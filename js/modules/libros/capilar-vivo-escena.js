// Capilar y oxígeno: la escena viva. El capilar del tejido en grabado (SVG), por el que desfilan hematíes con sus
// 4 perlas (los 4 sitios del hemo): cuántos, según la Hb; a qué velocidad, según el gasto; las perlas se sueltan
// como O₂ que cruza hacia las mitocondrias. Además: el tablero (como un monitor), las tres lupas (el dedo, la
// mitocondria y la boca), las tres gráficas vivas (Figs. 9.3, 9.1 y 9.2) y el bucle de dibujo. Un solo estado
// (`estado`) y lo que se deriva de él (`D`, con derivar() de js/data/capilar-vivo-data.js). La interfaz y la capa
// de estudio viven en capilar-vivo.js.
//
// Las partículas (hematíe, O₂, CO₂, lactato, glucosa) salen de js/core/particulas.js (tabla única de formas).
// Rendimiento: el bucle solo corre con la vista a la vista; con «reducir movimiento» se pinta el estado final.
import { svgParticula, iconoParticula } from '../../core/particulas.js';
import { sinMovimiento } from '../../core/motion.js';
import {
    estadoBase, estadoDe, derivar, tabla94, satDe, clamp, lerp, dec, mil, SC, ESTADOS,
} from '../../data/capilar-vivo-data.js';

export const $ = id => document.getElementById('cpv-' + id);
const NS = 'http://www.w3.org/2000/svg';
const n2 = x => +x.toFixed(2);
const hash01 = (a, b, c = 0) => { const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return x - Math.floor(x); };
export let REDUCIR = false;

/* ============================================================
   Estado (enlaces vivos: solo esta pieza los cambia, con aplicarModelo)
   ============================================================ */
export let estado = estadoBase();
export let D = derivar(estado);
export const ocultos = new Set();      // cifras tapadas con «?» hasta contestar; 'pista' tapa los rótulos que dan la respuesta
export const vistos = new Set();       // estados de la Fig. 9.2 visitados en la pregunta actual (para «compruébalo»)
const visitados = new Set(['normal']); // barras de la Fig. 9.2 ya descubiertas
export const tapado = k => ocultos.has(k) || (k === 'ven' && estado.toma === 'svo2' && ocultos.has('svo2ap'));
const sinPista = () => ocultos.has('pista');

/* ============================================================
   El hematíe: el disco de la tabla única con sus 4 perlas (los 4 sitios del hemo)
   ============================================================ */
const PERLAS = [[-3.5, 0], [3.5, 0], [0, -2.5], [0, 2.5]];
export function hematieSVG(estados = ['', '', '', ''], color = '--accent-red', r = 4.6) {
    const k = r / 4.6;
    return svgParticula('rbc', 0, 0, r, { color }) + PERLAS.map(([x, y], i) => `<g class="cpv-perla ${estados[i] ? 'cpv-' + estados[i] : ''}" transform="translate(${n2(x * k)} ${n2(y * k)})"><circle r="${n2(1.3 * k)}"/><line x1="${n2(-1.2 * k)}" y1="${n2(1.2 * k)}" x2="${n2(1.2 * k)}" y2="${n2(-1.2 * k)}"/></g>`).join('');
}
export function iconoHematie(estados, tam = 16, color = '--accent-red') { return `<svg width="${tam}" height="${tam}" viewBox="-8 -8 16 16" aria-hidden="true" focusable="false">${hematieSVG(estados, color)}</svg>`; }
export { iconoParticula };

/* ============================================================
   La lámina: el capilar del tejido
   ============================================================ */
let LCIRC = 0;
const NMUESTRAS = 600;
const MUESTRAS = [];   // [x, y, avance 0-1, ángulo en grados]
const NH = 11;                                    // huecos de la fila; con Hb 17 van todos llenos
const RANGO = [0, 6, 3, 9, 1, 7, 4, 10, 2, 8, 5]; // orden en que se vacían al bajar la Hb: los huecos quedan repartidos
const R_HEM = 11.5;
const ORDEN_PERLA = [[0, 2, 1, 3], [3, 1, 2, 0], [1, 3, 0, 2], [2, 0, 3, 1]];   // qué perla se vacía antes en cada hematíe
const HEM = [];
const hematiesVisibles = () => Math.round(NH * estado.hb / 17);   // proporcional a la Hb (ilustrativo: la fila, no el recuento)
let gPart = null;
const POOL = {};
let DIS_O2 = [];
const MITOS = [[120, 198], [192, 194], [262, 204], [318, 216]];
const mitoCerca = x => MITOS.reduce((a, m) => Math.abs(m[0] - x) < Math.abs(a[0] - x) ? m : a);
function pool(clave, n, r) {
    const arr = [];
    for (let i = 0; i < n; i++) { const g = document.createElementNS(NS, 'g'); g.innerHTML = svgParticula(clave, 0, 0, r); g.setAttribute('opacity', '0'); gPart.appendChild(g); arr.push({ g, vivo: false }); }
    return arr;
}
function lanzar(clave, x0, y0, x1, y1, dur, curva = 0) {
    const p = POOL[clave].find(q => !q.vivo); if (!p) return;
    Object.assign(p, { vivo: true, x0, y0, x1, y1, cx: (x0 + x1) / 2 + curva, cy: (y0 + y1) / 2 - Math.abs(curva) * 0.4, t: 0, dur });
}
function moverParticulas(dt) {
    for (const k in POOL) for (const p of POOL[k]) {
        if (!p.vivo) continue;
        p.t += dt / p.dur;
        if (p.t >= 1) { p.vivo = false; p.g.setAttribute('opacity', '0'); continue; }
        const u = p.t, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
        const x = a * p.x0 + b * p.cx + c * p.x1, y = a * p.y0 + b * p.cy + c * p.y1;
        p.g.setAttribute('transform', `translate(${n2(x)} ${n2(y)})`);
        p.g.setAttribute('opacity', String(n2(Math.min(1, u * 5, (1 - u) * 4))));
    }
}
function apagarParticulas() { for (const k in POOL) for (const p of POOL[k]) { p.vivo = false; p.g.setAttribute('opacity', '0'); } }

let tiempo = 0;
const acum = { lact: 0, co2: 0 };
// fracción de los sitios sin CO que llevan O₂ en cada punto del capilar: arterial a la entrada, venosa a la salida
function satLocal(u) {
    const art = D.S, venO2 = clamp(D.svo2 / (1 - D.fco), 0, 1);
    if (u < 0.1) return art;
    if (u > 0.9) return venO2;
    return lerp(art, venO2, (u - 0.1) / 0.8);
}
function velocidad() { return estado.rcp ? 5 : 28 * estado.gc / 5; }   // px/s, proporcional al gasto (ilustrativo)
function pasoLamina(dt) {
    tiempo += dt;
    const v = velocidad();
    const art = D.S, venO2 = clamp(D.svo2 / (1 - D.fco), 0, 1), medio = (art + venO2) / 2;
    const nVis = hematiesVisibles();
    for (let j = 0; j < NH; j++) {
        const h = HEM[j];
        const vis = RANGO[j] < nVis;
        if (vis !== h.vis) { h.vis = vis; h.g.setAttribute('opacity', vis ? '1' : '0'); }
        const s = ((h.s0 + v * tiempo) % LCIRC + LCIRC) % LCIRC;
        const m = MUESTRAS[Math.floor(s / LCIRC * NMUESTRAS) % NMUESTRAS];
        h.g.setAttribute('transform', `translate(${n2(m[0])} ${n2(m[1])}) rotate(${n2(m[3])})`);
        if (!vis) continue;
        const loc = satLocal(m[2]);
        const col = art - venO2 <= 0.01 || loc >= medio - 1e-6 ? '--accent-red' : '--accent-purple';
        if (col !== h.color) { h.color = col; h.cuerpo.style.fill = `var(${col})`; }
        // cuántas perlas lleva llenas este hematíe: loc × 4, repartiendo el redondeo entre hematíes (la media es exacta)
        const nCO = Math.floor(D.fco * 4 + hash01(j, 0, 7)), nLlenas = Math.floor(loc * (4 - nCO) + hash01(j, 0, 3));
        for (let i = 0; i < 4; i++) {
            const orden = ORDEN_PERLA[j % 4][i];
            const est = orden < nCO ? 'co' : (orden - nCO < nLlenas ? '' : 'vacia');
            if (est !== h.estado[i]) {
                const antes = h.estado[i];
                h.estado[i] = est; h.perlas[i].setAttribute('class', 'cpv-perla' + (est ? ' cpv-' + est : ''));
                // la perla que se vacía en el capilar suelta su O₂, que cruza el intersticio hasta una mitocondria
                if (dt > 0 && !REDUCIR && antes === '' && est === 'vacia' && m[2] > 0.08 && m[2] < 0.92) {
                    const t = mitoCerca(m[0] + 30 * (hash01(j, i, 5) - 0.3));
                    lanzar('o2', m[0], m[1] + 10, t[0] + 8 * (hash01(j, i, 6) - 0.5), t[1], 1.5, -6);
                }
            }
        }
    }
    // el O₂ disuelto: tres sueltos que viajan con el plasma
    DIS_O2.forEach((p, i) => {
        const s = ((LCIRC * (0.05 + i * 0.29) + v * tiempo) % LCIRC);
        const m = MUESTRAS[Math.floor(s / LCIRC * NMUESTRAS) % NMUESTRAS];
        p.g.setAttribute('transform', `translate(${n2(m[0])} ${n2(m[1] - 21)})`); p.g.setAttribute('opacity', m[2] < 0.6 ? '0.9' : '0');
    });
    if (dt > 0 && !REDUCIR) {
        // la célula suelta lactato y CO₂ hacia el extremo venoso del capilar
        acum.lact += dt * Math.max(0, D.lact - 1.2) * 0.6;
        while (acum.lact >= 1) { acum.lact -= 1; const m = MITOS[1 + Math.floor(Math.random() * 3)]; lanzar('lact', m[0], m[1] - 8, 250 + 90 * Math.random(), 132 + 12 * Math.random(), 2.2, 10); }
        acum.co2 += dt * (estado.rcp ? 0.1 : D.vo2 / 250) * 0.6;
        while (acum.co2 >= 1) { acum.co2 -= 1; const m = MITOS[Math.floor(Math.random() * 4)]; lanzar('co2', m[0], m[1] - 8, m[0] + 50 + 30 * Math.random(), 118 + 24 * Math.random(), 2, 8); }
        moverParticulas(dt);
    }
    // el barrido del capnograma pequeño
    $('capno-mini-barre').setAttribute('x', String(n2(249 + ((tiempo * 18) % 102))));
}

// Onda del capnograma: n respiraciones en una caja (x0, y0, w, h) con escala de 0 a 60 mmHg
function ondaCapno(x0, y0, w, h, n, e, Dd) {
    const y = v => y0 + h - clamp(v, 0, 60) / 60 * h;
    let d = `M${n2(x0)} ${n2(y(0))}`;
    const bw = w / n;
    for (let i = 0; i < n; i++) {
        const bx = x0 + i * bw;
        let pet = Dd.petco2;
        if (e.sedacion) pet = Dd.petco2 - (n - 1 - i) * 4;
        if (e.esofago) { d += `L${n2(bx + bw)} ${n2(y(0))}`; continue; }
        const xI = bx + bw * 0.12, xII = bx + bw * (e.espacio === 'epoc' ? 0.42 : 0.22), xIII = bx + bw * 0.72, xIV = bx + bw * 0.8;
        const ini3 = e.espacio === 'epoc' ? pet - 7 : pet - 2;
        d += `L${n2(xI)} ${n2(y(0))}`;
        if (e.espacio === 'epoc') d += `C${n2(xI + (xII - xI) * 0.3)} ${n2(y(pet * 0.1))} ${n2(xI + (xII - xI) * 0.4)} ${n2(y(ini3))} ${n2(xII)} ${n2(y(ini3))}`;
        else d += `L${n2(xII)} ${n2(y(ini3))}`;
        d += `L${n2(xIII)} ${n2(y(pet))}L${n2(xIV)} ${n2(y(0))}L${n2(bx + bw)} ${n2(y(0))}`;
    }
    return d;
}

/* ============================================================
   El tablero (cifras grandes con su unidad, como un monitor)
   ============================================================ */
export const CELDAS = [
    { k: 'spo2', n: 'SpO₂', u: '%', o: 'fisiol.', ilu: false },
    { k: 'sao2', n: 'SaO₂', u: '%', o: 'fisiol.', ilu: false },
    { k: 'cao2', n: 'CaO₂', u: 'mL/dL', o: 'ficha' },
    { k: 'do2', n: 'DO₂', u: 'mL/min', o: 'ficha' },
    { k: 'vo2', n: 'VO₂', u: 'mL/min', o: 'ficha' },
    { k: 'o2er', n: 'O₂ER', u: 'extracción', o: 'ficha' },
    { k: 'ven', n: 'SvO₂', u: '%', o: 'ficha' },
    { k: 'lact', n: 'Lactato', u: 'mmol/L', o: 'ilustr.', ilu: true },
    { k: 'gap', n: 'Gap CO₂', u: 'mmHg', o: 'ilustr.', ilu: true },
    { k: 'petco2', n: 'PETCO₂', u: 'mmHg', o: 'ilustr.', ilu: true },
];
export function pintarTablero() {
    const R = D.R, e = estado;
    const val = {
        spo2: R.spo2 == null ? ['—', ''] : [`${R.spo2}`, R.spo2 < 90 ? '↓' : ''],
        sao2: [`${R.sao2}`, R.sao2 < 90 ? '↓' : ''],
        cao2: [dec(R.cao2, 1), ''],
        do2: e.rcp ? ['—', ''] : [mil(R.do2), R.do2 < 900 ? '↓' : R.do2 > 1100 ? '↑' : ''],
        vo2: e.rcp ? ['—', ''] : [`${R.vo2}`, R.vo2 < 200 ? '↓' : R.vo2 > 270 ? '↑' : ''],
        o2er: e.rcp ? ['—', ''] : [dec(R.o2er, 2), R.o2er > 0.3 ? '↑' : R.o2er < 0.2 ? '↓' : ''],
        ven: e.rcp ? ['—', ''] : [`${R.ven}`, R.ven < 65 ? '↓' : R.ven > 75 ? '↑' : ''],
        lact: e.rcp ? ['—', ''] : [dec(R.lact, 1), R.lact > 2 ? '↑' : ''],
        gap: e.rcp ? ['—', ''] : [`${R.gap}`, R.gap > 6 ? '↑' : ''],
        petco2: [`${R.petco2}`, R.petco2 <= 10 && e.rcp ? '↓' : ''],
    };
    for (const c of CELDAS) {
        const el = $('c-' + c.k), b = el.querySelector('b'), [v, fl] = val[c.k], tap = tapado(c.k);
        b.textContent = tap ? '?' : v + (fl ? ' ' + fl : '');
        el.classList.toggle('cpv-fuera', !tap && !!fl);
        if (c.k === 'ven') el.querySelector('.cpv-k').textContent = e.toma === 'scvo2' ? 'ScvO₂' : 'SvO₂';
        const origen = (ilu, base) => { const o = el.querySelector('.cpv-o'); o.textContent = ilu ? 'ilustr.' : base; o.classList.toggle('cpv-ilu', ilu); };
        if (c.k === 'sao2') origen(e.co, 'fisiol.');
        if (c.k === 'spo2') origen(R.spo2 == null, 'fisiol.');   // el «—» del dedo frío es del modelo
        if (c.k === 'cao2') origen(e.co, 'ficha');                // con CO, la SaO₂ (y el CaO₂) salen de una COHb ilustrativa
        if (['vo2', 'o2er', 'ven'].includes(c.k)) origen(e.util !== 'normal' || e.consumo === 'fiebre' || e.estres || (c.k === 'ven' && e.toma === 'scvo2' && D.shock), 'ficha');   // ScvO₂ +7 en el shock: ilustrativo
        const sub = el.querySelector('.cpv-sub');
        sub.textContent = tap || e.rcp || sinPista() ? '' : c.k === 'do2' ? `/m² ${R.do2i}` : c.k === 'vo2' ? `/m² ${R.vo2i}` : c.k === 'ven' ? tabla94(R, e).corto : c.k === 'spo2' && R.spo2 == null ? 'sin onda' : c.k === 'lact' ? (R.lact <= 2 ? 'mort. 15 %' : R.lact < 4 ? 'mort. 25 %' : 'mort. 38 %') : c.k === 'gap' ? (R.gap > 6 ? 'hipoperfusión' : R.gap >= 2 && R.gap <= 5 ? 'normal 2-5' : R.gap > 5 ? 'sin corte (5-6)' : '') : '';
    }
}
let celdaMirada = null;
export function mirarCelda(k) {
    if (celdaMirada) celdaMirada.classList.remove('cpv-mira');
    celdaMirada = k && $('c-' + k) ? $('c-' + k) : null;
    if (celdaMirada) celdaMirada.classList.add('cpv-mira');
}

/* ============================================================
   Lo que cambia en la lámina con el estado (rótulos, X, tomas, avisos)
   ============================================================ */
function pintarLaminaFija() {
    const e = estado, pista = !sinPista();
    $('mitos-x').toggleAttribute('hidden', e.util === 'normal' || !pista);
    const xt = $('mitos-x-txt'); xt.toggleAttribute('hidden', e.util === 'normal' || !pista); xt.textContent = e.util === 'sepsis' ? 'sepsis: la PDH no deja usar el O₂' : e.util === 'tiamina' ? 'sin tiamina: la PDH se para' : '';
    $('lam-toma').textContent = e.toma === 'scvo2' ? 'ScvO₂ · cava superior' : 'SvO₂ · arteria pulmonar';
    $('lam-boca').textContent = e.esofago && pista ? 'boca · ¡esófago!' : 'boca · CO₂';
    $('lam-boca').style.fill = e.esofago && pista ? 'var(--accent-red)' : 'var(--text-muted)';
    const aviso = !pista ? ['', ''] : e.rcp ? ['Parada:', 'sin pulso, el flujo casi se para'] : D.sinOnda ? ['Dedo frío: onda plana.', 'Pon el sensor en la frente'] : e.esofago ? ['Sin CO₂ espirado:', 'tubo en el esófago'] : D.porAporte ? ['Falta aporte: el tejido', 'ya coge la mitad del O₂'] : e.util === 'sepsis' ? ['Llega O₂, pero', 'la célula no lo usa'] : D.avisos.length ? ['Aporte extremo:', 'casi incompatible con la vida'] : ['', ''];
    $('lam-aviso').innerHTML = aviso[0] ? `<tspan x="14">${aviso[0]}</tspan><tspan x="14" dy="11">${aviso[1]}</tspan>` : '';
    const R = D.R;
    $('capno-mini-onda').setAttribute('d', ondaCapno(252, 15, 98, 24, 3, e, R));
    $('capno-mini-val').textContent = tapado('petco2') ? '?' : `${R.petco2} mmHg`;
}

/* ============================================================
   Las lupas: el dedo, la mitocondria y la boca (con la lámina del libro al lado; el lightbox de la app la amplía)
   ============================================================ */
const LUPAS = {
    dedo: { tit: 'El dedo · pulsioxímetro (Figs. 7.1-7.4)', lams: [['mar-fig7-1-espectro-hemoglobina.jpg', 'Figura 7.1 (PDF p. 37): absorción de la luz por HbO₂, Hb, COHb y metHb; líneas a 660 y 940 nm.'], ['mar-fig7-3-pulsioximetro-dedo.jpg', 'Figura 7.3 (PDF p. 39): sensor de dedo con dos diodos y el fotodetector.'], ['mar-fig7-4-oximetria-frente.jpg', 'Figura 7.4 (PDF p. 40): oximetría de frente, por reflectancia.']],
        txt: 'Lámina del libro: Figs. 7.1, 7.3 y 7.4; tócala para verla grande.' },
    mito: { tit: 'La mitocondria (Fig. 9.5)', lams: [['mar-fig9-5-vias-glucosa.jpg', 'Figura 9.5 (PDF p. 82): vías de la glucosa.'], ['mar-fig9-4-lactato-mortalidad.jpg', 'Figura 9.4 (PDF p. 80): lactato y mortalidad hospitalaria.']],
        txt: 'Lámina del libro: Figs. 9.5 y 9.4.' },
    boca: { tit: 'La boca · capnograma (Fig. 7.6)', lams: [['mar-fig7-6-capnografia.jpg', 'Figura 7.6 (PDF p. 44): capnografía infrarroja y sus 4 fases.'], ['mar-fig7-8-etco2-gasto.jpg', 'Figura 7.8 (PDF p. 46): cambios de PETCO₂ frente a cambios del gasto (r = 0,87).']],
        txt: 'Lámina del libro: Figs. 7.6 y 7.8.' },
};
export const Lupa = {
    abierta: null, el: null, svg: null, btnX: null,
    abrir(tipo) {
        this.abierta = tipo; this.el.hidden = false; this.btnX.hidden = false;
        document.querySelectorAll('[data-cpv-lupa]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cpvLupa === tipo)));
        $('escena').classList.add('cpv-con-lupa');
        $('libro').hidden = false; $('libro-txt').innerHTML = `<b>${LUPAS[tipo].tit}.</b> ${LUPAS[tipo].txt}`;
        $('libro-lams').innerHTML = LUPAS[tipo].lams.map(([f, pie]) => `<div class="article-figure cpv-lam"><img loading="lazy" src="js/modules/libros/img/${f}" alt="${pie}"></div>`).join('');
        this.colocar(); pintarLupa(true);
        if (!REDUCIR && window.Motion) window.Motion.animate(this.el, { scale: [0.25, 1], opacity: [0.3, 1] }, { type: 'spring', stiffness: 190, damping: 19 });
        if (REDUCIR) pintarUnaVez(); else arrancar();
    },
    cerrar() {
        this.abierta = null; this.el.hidden = true; this.btnX.hidden = true; $('libro').hidden = true; $('escena').classList.remove('cpv-con-lupa');
        document.querySelectorAll('[data-cpv-lupa]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    },
    colocar() {
        if (!this.abierta) return;
        const caja = $('lamina-caja').getBoundingClientRect(), svgR = $('lamina').getBoundingClientRect();
        if (!caja.width) return;
        const dTam = Math.round(Math.min(svgR.width * 0.86, svgR.height * 0.97, 320));
        const x = Math.round((caja.width - dTam) / 2), y = Math.round((svgR.height - dTam) / 2);
        Object.assign(this.el.style, { width: dTam + 'px', height: dTam + 'px', left: x + 'px', top: y + 'px' });
        Object.assign(this.btnX.style, { left: Math.min(caja.width - 46, x + dTam - 30) + 'px', top: Math.max(2, y - 4) + 'px' });
    },
};

const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}"${o.a ? ` text-anchor="${o.a}"` : ''} style="font-size:${o.s || 8.5}px;fill:var(${o.c || '--text-dim'});${o.i ? 'font-style:italic;' : ''}${o.b ? 'font-weight:700;' : ''}${o.sans ? 'font-family:var(--cpv-sans);' : ''}">${t}</text>`;
let lupaFija = '';     // se rehace solo cuando cambia el estado
export function pintarLupa(forzar) {
    if (!Lupa.abierta) return;
    const e = estado, R = D.R, tipo = Lupa.abierta, pista = !sinPista();
    let h = `<defs><clipPath id="cpv-lupa-clip"><circle cx="110" cy="110" r="110"/></clipPath></defs><g clip-path="url(#cpv-lupa-clip)"><rect width="220" height="220" style="fill:var(--bg-main)"/>`;
    if (tipo === 'dedo') {
        const frente = e.sensor === 'frente';
        const spo = tapado('spo2') ? '?' : R.spo2 == null ? '—' : R.spo2 + ' %', sao = tapado('sao2') ? '?' : R.sao2 + ' %';
        h += T(110, 28, `SpO₂ ${spo}`, { a: 'middle', s: 11, b: 1, c: '--text-main', sans: 1 });
        if (!frente) {
            h += T(94, 42, 'rojo', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' }) + T(126, 42, 'infrarrojo', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
            h += T(94, 51, '660 nm', { a: 'middle', s: 8, sans: 1 }) + T(126, 51, '940 nm', { a: 'middle', s: 8, sans: 1 });
            h += '<path d="M20 72H170Q194 72 194 96Q194 120 170 120H20Z" style="fill:url(#cpv-raya2);stroke:var(--text-muted);stroke-width:1.2"/>';
            h += '<path d="M178 78Q188 84 188 96Q188 108 178 114" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>';
            h += '<rect x="86" y="56" width="16" height="10" rx="2" style="fill:var(--accent-red)"/><rect x="118" y="56" width="16" height="10" rx="2" style="fill:var(--text-muted)"/>';
            h += '<path d="M94 66V128M126 66V128" style="stroke:var(--accent-yellow);stroke-width:1;stroke-dasharray:3 3;opacity:.7"/>';
            h += '<rect x="97" y="128" width="26" height="8" rx="2" style="fill:var(--text-dim)"/>' + T(110, 146, 'fotodetector', { a: 'middle', s: 8, sans: 1 });
            h += '<path id="cpv-lupa-arteria" d="M24 96H182" style="stroke:var(--accent-red);stroke-width:5;opacity:.75"/>' + T(30, 88, 'arteria que late', { s: 7.6, i: 1 });
        } else {
            h += '<path d="M24 120Q110 70 196 120" style="fill:url(#cpv-raya2);stroke:var(--text-muted);stroke-width:1.2"/>' + T(110, 108, 'frente (carótida interna)', { a: 'middle', s: 8, i: 1 });
            h += '<rect x="86" y="70" width="48" height="12" rx="3" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.2"/><circle cx="98" cy="76" r="2.6" style="fill:var(--accent-red)"/><rect x="114" y="73" width="12" height="6" style="fill:var(--text-dim)"/>';
            h += T(110, 50, 'reflectancia: diodos y detector juntos', { a: 'middle', s: 7.6, sans: 1 }) + T(110, 62, 'con cinta elástica (pulso venoso)', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
        }
        if (!pista) h += T(110, 162, 'SpO₂ = HbO₂ / (Hb + HbO₂): solo lo que late', { a: 'middle', s: 8, sans: 1 });
        else if (R.spo2 == null && !e.rcp) h += T(110, 162, 'Onda plana: pon el sensor en la frente', { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 });
        else if (e.rcp) h += T(110, 162, 'Parada: sin pulso no hay onda', { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 });
        else if (e.co) h += T(110, 160, `COHb: dos colores no la ven · SaO₂ ${sao}`, { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 }) + T(110, 170, 'cooxímetro: hasta 8 longitudes de onda', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
        else h += T(110, 162, 'SpO₂ = HbO₂ / (Hb + HbO₂): solo lo que late', { a: 'middle', s: 8, sans: 1 });
        // fotopletismograma (Fig. 7.2): A = amplitud sistólica, B = transmisión basal
        h += '<path id="cpv-lupa-pleti" d="" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.6"/>';
        h += T(42, 184, 'A', { s: 8, b: 1, c: '--accent-yellow', sans: 1 }) + T(110, 207, 'B: basal', { a: 'middle', s: 7.6, b: 1, c: '--accent-yellow', sans: 1 });
    } else if (tipo === 'mito') {
        const bloq = e.util !== 'normal' && pista;
        const lact = tapado('lact') ? '?' : dec(R.lact, 1);
        h += T(110, 28, `lactato ${lact} mmol/L`, { a: 'middle', s: 10, b: 1, c: R.lact > 2 && !tapado('lact') ? '--accent-red' : '--text-main', sans: 1 });
        h += svgParticula('glu', 52, 46, 4.5) + T(62, 49, 'glucosa', { s: 8 });
        h += '<path d="M52 56V76" style="stroke:var(--text-dim);stroke-width:1.2"/><path d="M48 72l4 6 4-6" style="fill:none;stroke:var(--text-dim);stroke-width:1.2"/>';
        h += T(60, 68, 'glucólisis · 2 ATP', { s: 8, sans: 1 });
        if (e.estres && pista) h += '<path d="M154 58L140 63" style="stroke:var(--accent-red);stroke-width:1.6"/><path d="M145 59l-6 4 6 3" style="fill:none;stroke:var(--accent-red);stroke-width:1.4"/>' + T(162, 42, 'estrés:', { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 }) + T(162, 52, '+40-50 %', { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 });
        h += T(20, 96, 'piruvato ×2', { s: 8 });
        h += '<path d="M42 102V134" style="stroke:var(--text-dim);stroke-width:1.2"/><path d="M38 130l4 6 4-6" style="fill:none;stroke:var(--text-dim);stroke-width:1.2"/>' + T(48, 122, 'LDH', { s: 8, sans: 1 });
        h += svgParticula('lact', 42, 148, 4.5) + T(26, 166, 'lactato', { s: 8, b: 1, c: '--accent-yellow' });
        h += '<path d="M78 92H104" style="stroke:var(--text-dim);stroke-width:1.2"/><path d="M100 88l6 4-6 4" style="fill:none;stroke:var(--text-dim);stroke-width:1.2"/>';
        h += '<rect x="108" y="83" width="40" height="18" rx="4" style="fill:var(--bg-main);stroke:var(--accent-yellow);stroke-width:1.1"/>' + T(128, 96, 'PDH', { a: 'middle', s: 8.5, b: 1, sans: 1 });
        h += T(153, 90, 'con TPP', { s: 7.6, i: 1, c: '--text-muted' }) + T(153, 99, '(tiamina)', { s: 7.6, i: 1, c: '--text-muted' });
        if (bloq) h += '<path d="M110 85l36 14M146 85l-36 14" style="stroke:var(--accent-red);stroke-width:2.2;stroke-linecap:round"/>' + T(136, 116, e.util === 'sepsis' ? 'sepsis: endotoxina' : 'sin pirofosfato', { s: 7.6, b: 1, c: '--accent-red', sans: 1 }) + T(136, 125, e.util === 'sepsis' ? 'y citocinas' : 'de tiamina', { s: 7.6, b: 1, c: '--accent-red', sans: 1 });
        h += `<path d="M128 101V126" style="stroke:var(--text-dim);stroke-width:1.2${bloq ? ';opacity:.3' : ''}"/>`;
        h += '<ellipse cx="134" cy="160" rx="58" ry="32" style="fill:url(#cpv-raya);stroke:var(--text-dim);stroke-width:1.3"/>';
        h += T(134, 142, 'mitocondria', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
        h += svgParticula('o2', 110, 153, 3) + T(118, 156, 'O₂ → H₂O', { s: 8, sans: 1 });
        h += T(134, 170, 'Krebs · 2 ATP', { a: 'middle', s: 8, sans: 1, b: 1 }) + T(134, 182, 'cadena · 28 ATP', { a: 'middle', s: 8, sans: 1, b: 1 });
        h += svgParticula('co2', 204, 148, 3.4) + T(190, 136, 'CO₂', { s: 8, sans: 1 });
        h += '<g id="cpv-lupa-flujo"></g>';
    } else if (tipo === 'boca') {
        const x0 = 36, y0 = 52, w = 156, hh = 100;
        const y = v => y0 + hh - clamp(v, 0, 60) / 60 * hh;
        h += `<path d="M${x0} ${y0}V${y0 + hh}H${x0 + w}" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>`;
        for (const v of [0, 20, 40, 60]) h += T(x0 - 4, y(v) + 3, v, { a: 'end', s: 7.2, sans: 1, c: '--text-muted' });
        h += T(x0, y0 - 6, 'PCO₂ (mmHg)', { s: 7.6, sans: 1, c: '--text-muted' });
        h += `<path d="M${x0} ${y(R.paco2)}H${x0 + w}" style="stroke:var(--accent-purple);stroke-width:1;stroke-dasharray:4 3"/>` + T(x0 + w, y(R.paco2) - 3, `PaCO₂ ${R.paco2}`, { a: 'end', s: 7.6, sans: 1, c: '--accent-purple' });
        h += `<path id="cpv-lupa-capno" d="${ondaCapno(x0, y0, w, hh, 2, e, R)}" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.8;stroke-linejoin:round"/>`;
        if (!e.esofago) {
            const bw = w / 2;
            h += T(x0 + bw * 0.06, y0 + hh + 11, 'I', { a: 'middle', s: 8, b: 1, sans: 1 }) + T(x0 + bw * (e.espacio === 'epoc' ? 0.28 : 0.17), y0 + hh + 11, 'II', { a: 'middle', s: 8, b: 1, sans: 1 });
            h += T(x0 + bw * 0.5, y0 + hh + 11, 'III', { a: 'middle', s: 8, b: 1, sans: 1 }) + T(x0 + bw * 0.78, y0 + hh + 11, 'IV', { a: 'middle', s: 8, b: 1, sans: 1 });
        }
        const pet = tapado('petco2') ? '?' : R.petco2;
        h += T(110, 30, `PETCO₂ ${pet} mmHg`, { a: 'middle', s: 11, b: 1, c: '--text-main', sans: 1 });
        let pie = ['I espacio muerto · II sube', 'III meseta · IV inspira'];
        if (!pista) pie = e.esofago ? ['Capnograma plano:', '¿qué piensas?'] : e.rcp ? ['Casi sin CO₂ espirado:', '¿qué piensas?'] : pie;
        else if (e.esofago) pie = ['Sin CO₂ espirado: esófago…', '…o parada, sin retorno venoso'];
        else if (e.rcp) pie = ['Si sigue ≤10 tras 20 min de RCP: improbable', 'recuperar la circulación espontánea'];
        else if (e.sedacion) pie = ['Sedación: la PETCO₂ sube', 'antes de que baje la SpO₂'];
        else if (e.espacio === 'epoc') pie = ['EPOC: fase II lenta', '(espacio muerto alveolar)'];
        else if (e.espacio === 'embolia') pie = ['Alvéolos sin sangre:', 'PETCO₂ &lt; PaCO₂'];
        else if (e.gc < 4) pie = ['Menos gasto,', 'menos PETCO₂ (Fig. 7.8)'];
        const rojo = pista && (e.esofago || e.rcp) ? '--accent-red' : '--text-dim';
        h += T(110, 175, pie[0], { a: 'middle', s: 8, b: 1, c: rojo, sans: 1 }) + T(110, 185, pie[1], { a: 'middle', s: 8, b: 1, c: rojo, sans: 1 });
        if (!e.esofago && !e.rcp && !tapado('petco2')) h += T(110, 197, `PaCO₂ − PETCO₂ = ${R.paco2 - R.petco2} mmHg`, { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
    }
    h += '</g>';
    if (forzar || h !== lupaFija) { lupaFija = h; Lupa.svg.innerHTML = h; FLUJO.forEach(f => { f.el = null; }); }
}
const FLUJO = [];   // puntitos que recorren la vía de la glucosa en la lupa de la mitocondria
function pasoLupa(dt) {
    if (!Lupa.abierta) return;
    const e = estado, R = D.R;
    if (Lupa.abierta === 'dedo') {
        const pleti = $('lupa-pleti'); if (!pleti) return;
        const amp = R.spo2 == null && !e.rcp ? 1 : e.rcp ? 0 : 14, base = 196;
        let d = '';
        for (let x = 40; x <= 180; x += 2) {
            const u = ((x - 40) / 50 - tiempo * 1.1) % 1, uu = u < 0 ? u + 1 : u;
            const v = Math.exp(-Math.pow((uu - 0.2) / 0.08, 2)) + 0.35 * Math.exp(-Math.pow((uu - 0.45) / 0.1, 2));
            d += `${x === 40 ? 'M' : 'L'}${x} ${n2(base - amp * v)}`;
        }
        pleti.setAttribute('d', d);
        const art = $('lupa-arteria'); if (art) art.style.strokeWidth = String(n2((R.spo2 == null ? 2 : 4) + (R.spo2 == null ? 0 : 2.5) * Math.exp(-Math.pow((((tiempo * 1.1) % 1) - 0.2) / 0.1, 2))));
    } else if (Lupa.abierta === 'mito') {
        const g = $('lupa-flujo'); if (!g) return;
        if (FLUJO.length === 0) for (let i = 0; i < 10; i++) FLUJO.push({ t: i / 10, ruta: 0, el: null });
        if (!g.childNodes.length) FLUJO.forEach(f => { f.el = document.createElementNS(NS, 'circle'); f.el.setAttribute('r', '2'); f.el.style.fill = 'var(--accent-yellow)'; g.appendChild(f.el); });
        const aLact = clamp((e.util !== 'normal' ? 0.75 : 0.08) + D.deficit * 1.5 + (e.estres ? 0.12 : 0), 0, 0.95);
        for (const f of FLUJO) {
            f.t += dt * (e.estres ? 0.42 : 0.3);
            if (f.t >= 1) { f.t -= 1; f.ruta = Math.random() < aLact ? 1 : 0; }
            let x, y; const u = f.t;
            if (u < 0.4) { x = 52; y = lerp(56, 86, u / 0.4); }
            else if (f.ruta === 1) { x = 42; y = lerp(102, 140, (u - 0.4) / 0.6); }
            else { const v = (u - 0.4) / 0.6; if (v < 0.4) { x = lerp(78, 104, v / 0.4); y = 92; } else { x = 134 + Math.cos(v * 9) * 34 * (v - 0.4); y = lerp(128, 176, (v - 0.4) / 0.6); } }
            f.el.setAttribute('cx', n2(x)); f.el.setAttribute('cy', n2(y));
            f.el.style.fill = f.ruta === 1 && u >= 0.4 ? 'var(--accent-red)' : 'var(--accent-yellow)';
        }
    }
}

/* ============================================================
   Las gráficas vivas (Figs. 9.3, 9.1 y 9.2), recreadas
   ============================================================ */
let barraNueva = null;
function pintarGraficas() {
    const e = estado, R = D.R;
    // Fig. 9.3
    {
        const X = v => 32 + v / 1100 * 196, Y = v => 146 - v / 200 * 132;
        const plateau = D.pedido / SC, pend = D.techo / D.sao2, xc = plateau / pend;
        let h = '<path d="M32 14V146H228" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>';
        for (const v of [0, 300, 600, 900]) h += T(X(v), 157, v, { a: 'middle', s: 7, sans: 1, c: '--text-muted' });
        for (const v of [0, 100, 200]) h += T(28, Y(v) + 3, v, { a: 'end', s: 7, sans: 1, c: '--text-muted' });
        h += T(130, 166, 'DO₂ (mL/min/m²)', { a: 'middle', s: 7, sans: 1, c: '--text-muted' }) + T(36, 12, 'VO₂ (mL/min/m²)', { s: 7, sans: 1, c: '--text-muted' });
        if (e.util === 'sepsis' || e.consumo === 'fiebre' || Math.abs(D.sao2 - 0.98) > 0.005) {
            const p0 = 250 / SC, x0 = p0 / (0.5 / 0.98);
            h += `<path d="M${X(0)} ${Y(0)}L${n2(X(x0))} ${n2(Y(p0))}H${X(1100)}" style="fill:none;stroke:var(--text-muted);stroke-width:1;stroke-dasharray:3 3"/>` + T(X(1100), Y(p0) - 3, 'normal', { a: 'end', s: 7.2, i: 1, c: '--text-muted' });
        }
        const xcl = Math.min(xc, 1100);
        h += `<path d="M${X(0)} ${Y(0)}L${n2(X(xcl))} ${n2(Y(Math.min(plateau, 1100 * pend)))}${xc < 1100 ? `H${X(1100)}` : ''}" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.8"/>`;
        h += `<path d="M${n2(X(xc))} ${Y(0)}V${n2(Y(plateau))}" style="stroke:var(--text-muted);stroke-width:.8;stroke-dasharray:2 2"/>`;
        h += T(X(xc) + 3, Y(0) - 4, 'umbral', { s: 7, i: 1, c: '--text-muted' });
        const bx = clamp(X(xc) - 33, 34, 172);
        h += `<rect x="${n2(bx)}" y="${n2(Y(plateau) - 24)}" width="66" height="14" rx="3" style="fill:var(--bg-card);stroke:var(--border-color)"/>` + T(bx + 33, Y(plateau) - 14, 'SaO₂ − SvO₂ 50 %', { a: 'middle', s: 6.5, sans: 1 });
        if (bx + 66 < X(700) - 4) h += `<rect x="${X(700)}" y="${n2(Y(plateau) - 24)}" width="66" height="14" rx="3" style="fill:var(--bg-card);stroke:var(--border-color)"/>` + T(X(700) + 33, Y(plateau) - 14, 'SaO₂ − SvO₂ 25 %', { a: 'middle', s: 6.5, sans: 1 });
        h += T(X(80), Y(30), 'dependiente', { s: 7, i: 1, c: '--accent-red' });
        if (!e.rcp && !tapado('do2') && !tapado('vo2')) {
            const px = X(Math.min(R.do2i, 1100)), py = Y(R.vo2i);
            h += `<circle cx="${n2(px)}" cy="${n2(py)}" r="5" style="fill:var(--accent-red);stroke:var(--bg-main);stroke-width:1.5"/>` + T(px + 7, py + 12, `paciente · dif. ${R.dif} %`, { s: 7, b: 1, sans: 1, c: '--text-main' });
        }
        $('svg-93').innerHTML = h;
    }
    // Fig. 9.1
    {
        const X = v => 32 + v / 100 * 196, Y = v => 146 - v * 132;
        let h = '<path d="M32 14V146H228" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>';
        for (const v of [0, 20, 40, 60, 80, 100]) h += T(X(v), 157, v, { a: 'middle', s: 7, sans: 1, c: '--text-muted' });
        for (const v of [0, 50, 100]) h += T(28, Y(v / 100) + 3, v, { a: 'end', s: 7, sans: 1, c: '--text-muted' });
        h += T(130, 166, 'PO₂ (mmHg)', { a: 'middle', s: 7, sans: 1, c: '--text-muted' }) + T(36, 12, 'saturación (%)', { s: 7, sans: 1, c: '--text-muted' });
        let d = ''; for (let p = 0; p <= 100; p += 2) d += `${p ? 'L' : 'M'}${n2(X(p))} ${n2(Y(satDe(p)))}`;
        h += `<path d="${d}" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.8"/>`;
        h += `<path d="M${X(0)} ${Y(0.5)}H${X(27)}V${Y(0)}" style="fill:none;stroke:var(--text-muted);stroke-width:.8;stroke-dasharray:2 2"/>` + T(X(27) + 3, Y(0) - 4, 'P50 27', { s: 7, sans: 1, c: '--text-muted' });
        h += T(X(78), Y(0.98) + 16, 'parte plana', { a: 'middle', s: 7, i: 1 }) + T(X(16), Y(0.62), 'empinada', { s: 7, i: 1 });
        const pa = clamp(e.pao2, 0, 100);
        if (!tapado('sao2')) {
            h += `<circle cx="${n2(X(pa))}" cy="${n2(Y(D.sao2))}" r="4.5" style="fill:var(--accent-red);stroke:var(--bg-main);stroke-width:1.5"/>` + T(X(pa) - 7, Y(D.sao2) + 3, 'A', { a: 'end', s: 8, b: 1, sans: 1, c: '--text-main' });
            if (e.co) h += `<circle cx="${n2(X(pa))}" cy="${n2(Y(D.S))}" r="4" style="fill:none;stroke:var(--accent-red);stroke-width:1.2;stroke-dasharray:2 1.5"/>` + T(X(pa) - 7, Y(D.S) - 3, 'SpO₂', { a: 'end', s: 7, sans: 1 });
        }
        if (!e.rcp && !tapado('ven') && !tapado('svo2ap')) {
            const pv = clamp(D.pvo2, 0, 100);
            h += `<circle cx="${n2(X(pv))}" cy="${n2(Y(D.svo2))}" r="4.5" style="fill:var(--accent-purple);stroke:var(--bg-main);stroke-width:1.5"/>` + T(X(pv) + 7, Y(D.svo2) + 3, `V · ${R.svo2} %`, { s: 7.5, b: 1, sans: 1, c: '--text-main' });
        }
        $('svg-91').innerHTML = h;
    }
    // Fig. 9.2: barras de CaO₂ que aparecen al visitar cada estado
    {
        const barras = [['normal', 'Normal'], ['hipoxemia', 'PaO₂ 45'], ['anemia', 'Hb 7,5']].map(([k, n]) => [k, n, derivar(estadoDe(ESTADOS[k].p)).cao2]);
        const Y = v => 120 - v / 22 * 100;
        let h = '<path d="M30 14V120H230" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>';
        for (const v of [0, 10, 20]) h += T(26, Y(v) + 3, v, { a: 'end', s: 7, sans: 1, c: '--text-muted' });
        h += T(34, 11, 'CaO₂ (mL/dL)', { s: 7, sans: 1, c: '--text-muted' });
        barras.forEach(([k, n, v], i) => {
            const x = 46 + i * 64, vis = visitados.has(k);
            if (vis) {
                h += `<rect class="cpv-barra" data-k="${k}" x="${x}" y="${n2(Y(v))}" width="40" height="${n2(120 - Y(v))}" style="fill:url(#cpv-raya);stroke:var(--accent-yellow);stroke-width:1.2"/>`;
                h += T(x + 20, Y(v) - 4, { normal: '20', hipoxemia: '16 (−20 %)', anemia: '10 (−50 %)' }[k], { a: 'middle', s: 7.5, b: 1, sans: 1, c: '--text-main' });
            } else h += `<rect x="${x}" y="40" width="40" height="80" style="fill:none;stroke:var(--text-muted);stroke-dasharray:3 3"/>` + T(x + 20, 84, '?', { a: 'middle', s: 12, b: 1, c: '--text-muted' });
            h += T(x + 20, 132, n, { a: 'middle', s: 7.5, sans: 1 });
        });
        h += T(130, 146, 'cifras de la Fig. 9.2 (el modelo da 10,1 y 15,8)', { a: 'middle', s: 7, i: 1, c: '--text-muted' });
        $('svg-92').innerHTML = h;
    }
}
function animarBarra(k) {
    if (REDUCIR || !window.Motion) return;
    const r = $('svg-92').querySelector(`.cpv-barra[data-k="${k}"]`); if (!r) return;
    const y1 = +r.getAttribute('y'), h1 = +r.getAttribute('height');
    window.Motion.animate(0, 1, { duration: 0.7, ease: 'easeOut', onUpdate: v => { r.setAttribute('y', n2(y1 + h1 * (1 - v))); r.setAttribute('height', n2(h1 * v)); } });
}

/* ============================================================
   Las camas de un caso, para verlas a la vez (mini-tablero)
   ============================================================ */
let camasQ = null;
export function ponerCamas(c) { camasQ = c || null; }
export function pintarCamas() {
    const el = $('camas-tabla'); if (!el || !camasQ) return;
    const ds = camasQ.map(c => ({ e: estadoDe(c.e), R: derivar(estadoDe(c.e)).R }));
    const actual = JSON.stringify(estado);
    document.querySelectorAll('#cpv-preg [data-cama]').forEach(b => b.setAttribute('aria-pressed', String(JSON.stringify(ds[+b.dataset.cama].e) === actual)));
    const fila = (n, k, f) => `<tr><th>${n}</th>${ds.map(d => `<td class="cpv-n">${tapado(k) ? '?' : f(d)}</td>`).join('')}</tr>`;
    el.innerHTML = `<table class="data-table cpv-mini"><thead><tr><th></th>${camasQ.map(c => `<th>${c.n}</th>`).join('')}</tr></thead><tbody>
        ${fila('CaO₂ (mL/dL)', 'cao2', d => dec(d.R.cao2, 1))}${fila('DO₂ (mL/min)', 'do2', d => mil(d.R.do2))}
        ${fila('Sat. venosa', 'ven', d => `${d.e.toma === 'scvo2' ? 'ScvO₂' : 'SvO₂'} ${d.R.ven} %`)}${fila('Lactato', 'lact', d => dec(d.R.lact, 1))}</tbody></table>`;
}

/* ============================================================
   Anillo dorado que late sobre lo que hay que mirar en la lámina (las celdas del tablero se marcan aparte)
   ============================================================ */
const POS_ANILLO = { alveolo: [18, 18, 16], celula: [190, 205, 64], boca: [301, 23, 58], venoso: [322, 96, 36], arterial: [30, 70, 36] };
export function mirar(k) {
    const enTablero = CELDAS.some(c => c.k === k);
    mirarCelda(enTablero ? k : null);
    const g = $('g-anillo'); g.innerHTML = '';
    if (!k || enTablero || !POS_ANILLO[k]) return;
    const [x, y, r] = POS_ANILLO[k];
    g.innerHTML = `<circle class="cpv-anillo-svg" cx="${x}" cy="${y}" r="${r}" style="fill:none;stroke:var(--accent-blue);stroke-width:2.2"/>`;
}

/* ============================================================
   Aplicar un estado: todo se repinta desde aquí. Devuelve el estado anterior.
   ============================================================ */
export function aplicarModelo(nuevo) {
    const viejo = estado;
    estado = nuevo; D = derivar(estado);
    for (const k of ['anemia', 'hipoxemia', 'co']) {
        const p = estadoDe(ESTADOS[k].p);
        const igual = ['hb', 'pao2', 'co', 'gc', 'util'].every(c => p[c] === estado[c]);
        if (igual) { vistos.add(k); if (k !== 'co' && !visitados.has(k)) { visitados.add(k); barraNueva = k; } }
    }
    repintar();
    if (barraNueva) { animarBarra(barraNueva); barraNueva = null; }
    if (REDUCIR) pintarUnaVez(); else arrancar();
    return viejo;
}
function repintar() { pintarTablero(); pintarLaminaFija(); pintarLupa(); pintarGraficas(); pintarCamas(); }
export function setOcultos(arr) { ocultos.clear(); (arr || []).forEach(k => ocultos.add(k)); repintar(); }

/* ============================================================
   El bucle (se para cuando la escena no se ve; con «reducir movimiento», un solo dibujo)
   ============================================================ */
let tPrev = 0, visible = false, enMarcha = false;
const fotogramas = [];
function bucle(ahora) {
    if (!visible || document.hidden || REDUCIR) { enMarcha = false; return; }
    const t0 = performance.now();
    const dt = Math.min(0.05, (ahora - tPrev) / 1000); tPrev = ahora;
    pasoLamina(dt); pasoLupa(dt);
    fotogramas.push(performance.now() - t0); if (fotogramas.length > 240) fotogramas.shift();
    requestAnimationFrame(bucle);
}
export function arrancar() {
    if (REDUCIR) { pintarUnaVez(); return; }
    if (enMarcha || !visible || !LCIRC) return;
    enMarcha = true; tPrev = performance.now(); requestAnimationFrame(bucle);
}
export function pintarUnaVez() { if (!LCIRC) return; apagarParticulas(); pasoLamina(0); pasoLupa(0); }
export function ponerVisible(v) { visible = v; if (v) arrancar(); }
export function estadoBucle() {
    const a = fotogramas.slice(-120); const m = a.reduce((x, y) => x + y, 0) / (a.length || 1);
    return { enMarcha, visible, fotogramas: { n: a.length, medio: +m.toFixed(2), max: +Math.max(0, ...a).toFixed(2) } };
}
export function vaciarFotogramas() { fotogramas.length = 0; }

/* ============================================================
   Inicio (después de cargar los partials). El capilar se mide la primera vez que la vista se ve
   (getTotalLength no funciona con la vista oculta en todos los navegadores).
   ============================================================ */
export function medir() {
    if (LCIRC) return;
    const circuito = $('circuito');
    const L = circuito.getTotalLength();
    if (!L) return;
    LCIRC = L;
    for (let i = 0; i < NMUESTRAS; i++) {
        const p = circuito.getPointAtLength(i / NMUESTRAS * LCIRC), q = circuito.getPointAtLength(Math.min(LCIRC, (i + 1) / NMUESTRAS * LCIRC + 0.5));
        MUESTRAS.push([p.x, p.y, i / NMUESTRAS, Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI]);
    }
    HEM.forEach((h, j) => { h.s0 = j / NH * LCIRC; });
    pintarUnaVez();
}
export function initEscena() {
    REDUCIR = sinMovimiento();
    const gHem = $('g-hem'); gPart = $('g-part');
    for (let j = 0; j < NH; j++) {
        const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'cpv-grande');
        g.innerHTML = hematieSVG(['', '', '', ''], '--accent-red', R_HEM);
        gHem.appendChild(g);
        HEM.push({ g, cuerpo: g.querySelector('path'), perlas: [...g.querySelectorAll('.cpv-perla')], estado: ['', '', '', ''], color: '', s0: 0, vis: null });
    }
    Object.assign(POOL, { o2: pool('o2', 30, 4), lact: pool('lact', 14, 4), co2: pool('co2', 12, 3.8) });
    DIS_O2 = pool('o2', 3, 3.2);
    $('tablero').innerHTML = CELDAS.map(c => `<div class="cpv-celda" id="cpv-c-${c.k}"><span class="cpv-k">${c.n}</span><b>—</b><span class="cpv-u">${c.u}</span><span class="cpv-sub"></span><span class="cpv-o${c.ilu ? ' cpv-ilu' : ''}">${c.o}</span></div>`).join('');
    Object.assign(Lupa, { el: $('lupa'), svg: $('lupa-svg'), btnX: $('lupa-cerrar') });
    D = derivar(estado);
    repintar();
}
