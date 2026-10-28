// Capilar y oxígeno: la escena viva. El capilar del tejido en grabado (SVG), por el que desfilan hematíes con sus
// 4 perlas (los 4 sitios del hemo): cuántos, según la Hb; a qué velocidad, según el gasto; las perlas se sueltan
// como O₂ que cruza hacia las mitocondrias. Además: el tablero (como un monitor), las seis lupas (el tubo, el
// alvéolo, el dedo, la mitocondria, la boca y el neutrófilo), la bolsa que gotea al transfundir, las gráficas vivas (Figs. 12.3,
// 12.4, 9.3, 9.1 y 9.2, y el antes y después de la anemia) y el bucle de dibujo. Un solo estado (`estado`) y lo que
// se deriva de él (`D`, con derivar() de js/data/capilar-vivo-data.js). La interfaz y la capa de estudio viven en
// capilar-vivo.js.
//
// Las partículas (hematíe, O₂, CO₂, lactato, glucosa, neutrófilo, IgG, agua) salen de js/core/particulas.js (tabla
// única de formas); la bolsa, de js/core/bolsa.js; el tubo de hematocrito, de js/core/tubo.js (piezas comunes).
// Rendimiento: el bucle solo corre con la vista a la vista; con «reducir movimiento» se pinta el estado final.
import { svgParticula, iconoParticula } from '../../core/particulas.js';
import { pintarFormula } from '../../core/formula.js';
import { sinMovimiento } from '../../core/motion.js';
import { svgBolsa, moverGota } from '../../core/bolsa.js';
import { svgTubosHto, crecerPlasma } from '../../core/tubo.js';
import { lupaNeutrofilo, pasoNeutrofilo, reiniciarNeutrofilo } from './capilar-vivo-neutrofilo.js';
import {
    estadoBase, estadoDe, derivar, tabla94, satDe, clamp, lerp, dec, mil, SC, ESTADOS, TUBOS, estadoFinal,
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
function velocidad() { return estado.rcp ? 5 : 28 * D.gc / 5; }   // px/s, proporcional al gasto (ilustrativo)
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
    // la gota de la bolsa, mientras transfunde
    if (estado.transf) moverGota($('lamina'), 'cpv-bolsa', (tiempo * 0.9) % 1, goteando && !REDUCIR);
    // el barrido del capnograma pequeño
    $('capno-mini-barre').setAttribute('x', String(n2(249 + ((tiempo * 18) % 102))));
}
// Mientras gotea la bolsa (lo pone la interfaz al transfundir), la gota se mueve.
let goteando = false;
export function ponerGoteo(v) { goteando = !!v; }

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
// Primera fila: la historia de la anemia (Hb, gasto, contenido, aporte, consumo, extracción); segunda, lo demás.
export const CELDAS = [
    { k: 'hb', n: 'Hb', u: 'g/dL', o: 'ilustr.', ilu: true },
    { k: 'gc', n: 'Gasto', u: 'L/min', o: 'ficha' },
    { k: 'cao2', n: 'CaO₂', u: 'mL/dL', o: 'ficha' },
    { k: 'do2', n: 'DO₂', u: 'mL/min', o: 'ficha' },
    { k: 'vo2', n: 'VO₂', u: 'mL/min', o: 'ficha' },
    { k: 'o2er', n: 'Extrac.', u: '% (O₂ER)', o: 'ficha' },
    { k: 'ven', n: 'SvO₂', u: '%', o: 'ficha' },
    { k: 'lact', n: 'Lactato', u: 'mmol/L', o: 'ilustr.', ilu: true },
    { k: 'spo2', n: 'SpO₂', u: '%', o: 'fisiol.', ilu: false },
    { k: 'sao2', n: 'SaO₂', u: '%', o: 'fisiol.', ilu: false },
    { k: 'gap', n: 'Gap CO₂', u: 'mmHg', o: 'ilustr.', ilu: true },
    { k: 'petco2', n: 'PETCO₂', u: 'mmHg', o: 'ilustr.', ilu: true },
];
// Los renglones «fórmula → números → resultado»: copian lo que ya calculó derivar() (R.cao2, R.do2), sin recalcular
function pintarFormulas(R, e) {
    // Se escriben los decimales justos para que la cuenta a mano dé lo que enseña el modelo (SaO₂ con 2; si no cuadra, 3 y 4; Hb con 1; si no, 2).
    const num = x => +String(x).replace(',', '.');
    const cuadra = (d, h, ok) => ok(num(dec(D.sao2, d)), num(dec(e.hb, h)));
    const pasos = [[2, 1], [3, 1], [3, 2], [4, 2]];
    const okC = (sa, h) => (1.34 * h * sa + 0.003 * e.pao2).toFixed(1) === R.cao2.toFixed(1);
    const okD = (sa, h) => Math.round(num(dec(R.gc, 1)) * 1.34 * h * sa * 10) === Math.round(R.do2);
    const [dC, hC] = pasos.find(([d, h]) => cuadra(d, h, okC)) || pasos[pasos.length - 1];
    const [dD, hD] = pasos.find(([d, h]) => cuadra(d, h, okD)) || pasos[pasos.length - 1];
    const ilu = e.co ? ' · SaO₂: ilustrativo' : e.dil ? ' · Hb: ilustrativo' : '', l = [];
    if (!tapado('cao2')) l.push({ titulo: 'CaO₂', formula: '1,34 × Hb × SaO₂ + 0,003 × PaO₂', numeros: `1,34 × ${dec(e.hb, hC)} × ${dec(D.sao2, dC)} + 0,003 × ${e.pao2}`, resultado: dec(R.cao2, 1), unidad: 'mL/dL', origen: 'ficha · mar-cao2-9' + ilu });
    if (!tapado('do2') && !e.rcp) l.push({ titulo: 'DO₂', formula: 'GC × 1,34 × Hb × SaO₂ × 10 (sin el disuelto)', numeros: `${dec(R.gc, 1)} × 1,34 × ${dec(e.hb, hD)} × ${dec(D.sao2, dD)} × 10`, resultado: mil(R.do2), unidad: 'mL/min', origen: 'ficha · mar-do2' + (D.gcIlu ? ' · gasto: ilustrativo' : '') + ilu });
    pintarFormula($('formula'), l);
}
export function pintarTablero() {
    const R = D.R, e = estado;
    const val = {
        hb: [dec(e.hb, 1), e.hb < 13 ? '↓' : ''],
        gc: [dec(R.gc, 1), R.gc > 5.5 ? '↑' : R.gc < 4 ? '↓' : ''],
        spo2: R.spo2 == null ? ['—', ''] : [`${R.spo2}`, R.spo2 < 90 ? '↓' : ''],
        sao2: [`${R.sao2}`, R.sao2 < 90 ? '↓' : ''],
        cao2: [dec(R.cao2, 1), ''],
        do2: e.rcp ? ['—', ''] : [mil(R.do2), R.do2 < 900 ? '↓' : R.do2 > 1100 ? '↑' : ''],
        vo2: e.rcp ? ['—', ''] : [`${R.vo2}`, R.vo2 < 200 ? '↓' : R.vo2 > 270 ? '↑' : ''],
        o2er: e.rcp ? ['—', ''] : [`${R.ext}`, R.ext > 30 ? '↑' : R.ext < 20 ? '↓' : ''],
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
        if (c.k === 'hb') { const o = el.querySelector('.cpv-o'); o.textContent = e.dil ? 'fisiol.' : 'ilustr.'; o.classList.toggle('cpv-ilu', !e.dil); }   // en la dilución, Hto / 3
        // con el corazón que compensa (o sin volumen, o mientras gotea la bolsa), el gasto y lo que depende de él son del modelo
        if (c.k === 'gc') origen(D.gcIlu, 'ficha');
        if (c.k === 'do2') origen(D.gcIlu, 'ficha');
        if (c.k === 'vo2') origen(e.util !== 'normal' || e.consumo === 'fiebre' || e.estres, 'ficha');
        if (['o2er', 'ven'].includes(c.k)) origen(D.gcIlu || e.util !== 'normal' || e.consumo === 'fiebre' || e.estres || (c.k === 'ven' && e.toma === 'scvo2' && D.shock), 'ficha');   // ScvO₂ +7 en el shock: ilustrativo
        const sub = el.querySelector('.cpv-sub');
        sub.textContent = tap || e.rcp || sinPista() ? '' : c.k === 'gc' ? (e.gcFijo != null ? 'quieto' : e.volemia === 'baja' ? 'sin volumen' : e.compensa && R.gc > 5.05 ? 'compensa' : '') : c.k === 'hb' ? (e.dil ? 'Hto / 3' : '') : c.k === 'o2er' ? (R.ext >= 50 ? 'techo' : '') : c.k === 'do2' ? `/m² ${R.do2i}` : c.k === 'vo2' ? `/m² ${R.vo2i}` : c.k === 'ven' ? tabla94(R, e).corto : c.k === 'spo2' && R.spo2 == null ? 'sin onda' : c.k === 'lact' ? (R.lact <= 2 ? 'mort. 15 %' : R.lact < 4 ? 'mort. 25 %' : 'mort. 38 %') : c.k === 'gap' ? (R.gap > 6 ? 'hipoperfusión' : R.gap >= 2 && R.gap <= 5 ? 'normal 2-5' : R.gap > 5 ? 'sin corte (5-6)' : '') : '';
    }
    pintarFormulas(R, e);
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
    const R = D.R, g = tapado('gc') ? '?' : dec(R.gc, 1);
    let aviso = ['', ''], verde = false;
    if (!pista) aviso = ['', ''];
    else if (e.rcp) aviso = ['Parada:', 'sin pulso, el flujo casi se para'];
    else if (D.sinOnda) aviso = ['Dedo frío: onda plana.', 'Pon el sensor en la frente'];
    else if (e.esofago) aviso = ['Sin CO₂ espirado:', 'tubo en el esófago'];
    else if (D.avisos.length) aviso = ['Aporte extremo:', 'casi incompatible con la vida'];
    else if (e.volemia === 'baja' && D.porAporte) aviso = ['Sin volumen, el corazón', `no compensa: gasto ${g}`];
    else if (e.volemia === 'baja') aviso = ['Volemia baja: el gasto', `no puede subir (${g})`];
    else if (e.compensa && D.porAporte && !tapado('o2er')) aviso = [`Anemia extrema (Hb ${dec(e.hb, 1)}):`, 'pasado el techo, el consumo cae'];
    else if (e.compensa && R.ext >= 50 && !tapado('o2er')) aviso = ['Anemia extrema (Hb 3):', 'extracción al 50 %, el techo'];
    else if (D.porAporte) aviso = ['Falta aporte: el tejido', 'ya coge la mitad del O₂'];
    else if (e.util === 'sepsis') aviso = ['Llega O₂, pero', 'la célula no lo usa'];
    else if (e.gcFijo != null) { aviso = ['Mientras gotea la bolsa:', `gasto quieto (${g} L/min)`]; verde = true; }
    else if (e.compensa && R.gc > 5.05) { aviso = ['El corazón compensa:', `gasto ${g} L/min`]; verde = true; }
    const av = $('lam-aviso');
    av.innerHTML = aviso[0] ? `<tspan x="14">${aviso[0]}</tspan><tspan x="14" dy="11">${aviso[1]}</tspan>` : '';
    av.style.fill = verde ? 'var(--accent-green)' : 'var(--accent-red)';
    // el rótulo del plasma: con el corazón que compensa, la viscosidad (Tabla 12.2); con la bolsa, se esconde
    const pl = $('lam-plasma');
    pl.textContent = e.compensa && e.hb < 15 && pista ? `sangre menos viscosa: ×${dec(R.visc, 1)} el agua (normal ≈×4)` : 'plasma: el 1,5 % del O₂ va disuelto';
    pl.toggleAttribute('hidden', !!e.transf);
    $('bolsa').toggleAttribute('hidden', !e.transf);
    // el rótulo de la bolsa: 1 CH, o 1-2 CH si la Hb sube más de 1 g/dL (la Fig. 12.4: 6,4 → 8 con 1-2 CH)
    const rot = e.transf && $('bolsa').querySelector('text');
    if (rot) rot.textContent = e.transf.a != null && e.transf.a - e.transf.de > 1.05 ? '1-2 CH' : '1 CH';
    $('capno-mini-onda').setAttribute('d', ondaCapno(252, 15, 98, 24, 3, e, R));
    $('capno-mini-val').textContent = tapado('petco2') ? '?' : `${R.petco2} mmHg`;
}

/* ============================================================
   Las lupas: el tubo, el alvéolo, el dedo, la mitocondria y la boca (con la lámina del libro al lado; el lightbox
   de la app la amplía). Las partes que señala la explicación guiada llevan su id (cpv-lupa-…, cpv-tubo-…, cpv-alv-…).
   ============================================================ */
const IMG_HEMATO = 'js/modules/merino-hemato/img/';
const LUPAS = {
    tubo: { tit: 'El tubo · el hematocrito (Fig. 12.1)', lams: [['mar-fig12-1-hematocrito-volumen.jpg', 'Figura 12.1 del libro (PDF p. 3): el Hto de pie y tumbado (41,8 → 37,7 %) y antes y 90 min después de 20 mL/kg de salino (42,9 → 38,7 %).']],
        txt: 'Lámina del libro: Fig. 12.1.' },
    alveolo: { tit: 'El alvéolo · TRALI y TACO', lams: [[IMG_HEMATO + 'fig1-cxr-trali.jpg', 'Figura 12.5 del libro (PDF p. 15): radiografía portátil de un TRALI, con un infiltrado bilateral homogéneo.']],
        txt: 'Lámina del libro: Fig. 12.5, la Rx de un TRALI.' },
    dedo: { tit: 'El dedo · pulsioxímetro (Figs. 7.1-7.4)', lams: [['mar-fig7-1-espectro-hemoglobina.jpg', 'Figura 7.1 (PDF p. 37): absorción de la luz por HbO₂, Hb, COHb y metHb; líneas a 660 y 940 nm.'], ['mar-fig7-3-pulsioximetro-dedo.jpg', 'Figura 7.3 (PDF p. 39): sensor de dedo con dos diodos y el fotodetector.'], ['mar-fig7-4-oximetria-frente.jpg', 'Figura 7.4 (PDF p. 40): oximetría de frente, por reflectancia.']],
        txt: 'Lámina del libro: Figs. 7.1, 7.3 y 7.4; tócala para verla grande.' },
    mito: { tit: 'La mitocondria (Fig. 9.5)', lams: [['mar-fig9-5-vias-glucosa.jpg', 'Figura 9.5 (PDF p. 82): vías de la glucosa.'], ['mar-fig9-4-lactato-mortalidad.jpg', 'Figura 9.4 (PDF p. 80): lactato y mortalidad hospitalaria.']],
        txt: 'Lámina del libro: Figs. 9.5 y 9.4.' },
    boca: { tit: 'La boca · capnograma (Fig. 7.6)', lams: [['mar-fig7-6-capnografia.jpg', 'Figura 7.6 (PDF p. 44): capnografía infrarroja y sus 4 fases.'], ['mar-fig7-8-etco2-gasto.jpg', 'Figura 7.8 (PDF p. 46): cambios de PETCO₂ frente a cambios del gasto (r = 0,87).']],
        txt: 'Lámina del libro: Figs. 7.6 y 7.8.' },
    neutrofilo: { tit: 'El neutrófilo · estallido respiratorio (Fig. 17.1)', lams: [],
        txt: 'Dibujo recreado de la Fig. 17.1 del libro (cap. 17, p. 53-55).' },
};
export const Lupa = {
    abierta: null, el: null, svg: null, btnX: null,
    abrir(tipo) {
        this.abierta = tipo; this.el.hidden = false; this.btnX.hidden = false;
        document.querySelectorAll('[data-cpv-lupa]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cpvLupa === tipo)));
        $('escena').classList.add('cpv-con-lupa');
        $('libro').hidden = false; $('libro-txt').innerHTML = `<b>${LUPAS[tipo].tit}.</b> ${LUPAS[tipo].txt}`;
        $('libro-lams').innerHTML = LUPAS[tipo].lams.map(([f, pie]) => `<div class="article-figure cpv-lam"><img loading="lazy" src="${f.includes('/') ? f : 'js/modules/libros/img/' + f}" alt="${pie}"></div>`).join('');
        tuboAnim = REDUCIR ? 1 : 0; this.colocar(); pintarLupa(true);
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
        // La ✕, abajo a la derecha de la lupa: arriba pisaba el capnograma pequeño («boca · CO₂» y su cifra)
        Object.assign(this.btnX.style, { left: Math.min(caja.width - 46, x + dTam - 30) + 'px', top: Math.max(2, y + dTam - 40) + 'px' });
    },
};

const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}"${o.a ? ` text-anchor="${o.a}"` : ''} style="font-size:${Math.max(o.s || 8.5, 7.5)}px;fill:var(${o.c || '--text-dim'});${o.i ? 'font-style:italic;' : ''}${o.b ? 'font-weight:700;' : ''}${o.sans ? 'font-family:var(--cpv-sans);' : ''}">${t}</text>`;
let tuboAnim = 1;      // 0 → 1: el plasma del tubo de la derecha crece (un número y el bucle; sin Motion)
// El tubo (pieza común, core/tubo.js): la columna roja (la masa) es la misma en los dos; el plasma crece hasta dar el Hto.
function lupaTubo(e) {
    const t = TUBOS[e.dil] || TUBOS.pie, [a, b, ra, rb] = t;
    let h = T(110, 26, `Hto ${dec(a, 1)} % → ${b == null ? '?' : dec(b, 1) + ' %'}`, { a: 'middle', s: 11, b: 1, c: '--text-main', sans: 1 });
    h += b == null
        ? T(110, 40, e.dil === 'antes' ? 'pon el bolo (Sangre)' : 'túmbalo (Sangre)', { a: 'middle', s: 8.5, i: 1, c: '--text-muted' })
        : T(110, 40, 'misma masa eritrocitaria,', { a: 'middle', s: 8.5, b: 1, c: '--accent-yellow', sans: 1 }) + T(110, 51, 'más plasma', { a: 'middle', s: 8.5, b: 1, c: '--accent-yellow', sans: 1 });
    h += svgTubosHto({ a, b, rotulos: [ra, rb], prefijo: 'cpv-tubo', anim: tuboAnim, fmt: v => dec(v, 1) + ' %' });
    if (e.dil === 'tumbado') h += T(160, 72, '+420 mL', { s: 8.5, b: 1, c: '--accent-yellow', sans: 1 }) + T(160, 82, 'de plasma', { s: 8, c: '--accent-yellow', sans: 1 });
    return h;
}
// El alvéolo: arriba el alvéolo, abajo su capilar. TRALI: los anticuerpos de la bolsa y los neutrófilos que se quedan y
// pasan. TACO: el agua que cruza por presión y un corazón grande al lado. Sin TRALI ni TACO, el alvéolo con aire.
function lupaAlveolo(e) {
    const R = D.R, tipo = e.alveolo, pista = !sinPista();
    let h = T(110, 20, tipo ? `PaO₂ ${e.pao2} · SpO₂ ${tapado('spo2') ? '?' : R.spo2 + ' %'}` : 'Alvéolo y capilar pulmonar', { a: 'middle', s: 10, b: 1, c: '--text-main', sans: 1 });
    if (tipo) h += T(110, 31, 'hipoxemia: cifra ilustrativa', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
    h += `<g id="cpv-alv-alveolo"><ellipse cx="110" cy="74" rx="66" ry="36" style="fill:url(#cpv-raya);stroke:var(--text-muted);stroke-width:1.3"/>`;
    if (tipo === 'trali') h += '<ellipse cx="110" cy="74" rx="65" ry="35" style="fill:var(--accent-red);opacity:.16"/>';
    h += T(110, 58, tipo === 'trali' ? 'alvéolo inflamado' : tipo === 'taco' ? 'alvéolo con agua' : 'alvéolo: aire', { a: 'middle', s: 8.5, i: 1, c: '--text-dim' }) + '</g>';
    if (tipo === 'taco') h += '<path id="cpv-alv-agua" d="M48 86Q110 92 172 86Q166 104 110 110Q54 104 48 86Z" style="fill:var(--text-main);opacity:.22"/>';
    // la pared y el capilar pulmonar, con sus hematíes
    h += `<g id="cpv-alv-capilar"><path d="M14 118H206M14 146H206" style="stroke:var(--text-muted);stroke-width:1.2"/><rect x="14" y="119" width="192" height="26" style="fill:url(#cpv-punteo)"/>`;
    h += [[44, 132], [92, 133], [170, 131]].map(([x, y]) => svgParticula('rbc', x, y, 4.2)).join('') + '</g>';
    h += T(110, 158, 'capilar pulmonar', { a: 'middle', s: 8, i: 1, c: '--text-muted' });
    let pie = [];
    if (tipo === 'trali') {
        // la bolsa con sus anticuerpos (la Y de la tabla de formas; el libro no dice de qué clase son)
        h += `<g id="cpv-alv-bolsa"><rect x="20" y="92" width="14" height="18" rx="3" style="fill:none;stroke:var(--accent-red);stroke-width:1.1"/><path d="M27 110V118" style="stroke:var(--text-muted);stroke-width:1"/>${svgParticula('igg', 27, 100, 3.2)}</g>`;
        h += svgParticula('igg', 58, 126, 3.4) + svgParticula('igg', 128, 125, 3.4);
        h += `<g id="cpv-alv-neutros">${svgParticula('neutrofilo', 70, 128, 5.6) + svgParticula('neutrofilo', 140, 129, 5.6) + svgParticula('neutrofilo', 92, 88, 5.6) + svgParticula('neutrofilo', 136, 80, 5.6)}`;
        h += '<path d="M142 120Q146 104 138 92" style="fill:none;stroke:var(--accent-red);stroke-width:1.2;stroke-dasharray:2 2"/></g>';
        pie = pista ? [['anticuerpos del donante (80 %):', '--text-dim'], ['neutrófilos que se quedan y pasan', '--text-dim'], ['1.ª hora-6 h · mortalidad ≈50 %', '--accent-red']] : [];
    } else if (tipo === 'taco') {
        h += '<g id="cpv-alv-gotas"></g>';
        // el corazón grande, a la derecha
        h += '<path id="cpv-alv-corazon" transform="translate(10 4)" d="M186 96c-6-8-18-4-16 6 2 8 16 16 16 16s14-8 16-16c2-10-10-14-16-6z" style="fill:var(--accent-red);opacity:.85;stroke:var(--bg-main);stroke-width:1"/>';
        pie = pista ? [['agua por presión: edema', '--text-dim'], ['hidrostático · IC o IR previas', '--text-dim'], ['en 6 h · mortalidad 20 %', '--accent-red']] : [];
    } else pie = [['elige TRALI o TACO', '--text-muted']];
    pie.forEach(([t, c], i) => { h += T(110, 172 + i * 11, t, { a: 'middle', s: 8.5, b: c !== '--text-muted', c, sans: 1 }); });
    return h;
}
let lupaFija = '';     // se rehace solo cuando cambia el estado
export function pintarLupa(forzar) {
    if (!Lupa.abierta) return;
    const e = estado, R = D.R, tipo = Lupa.abierta, pista = !sinPista();
    let h = `<defs><clipPath id="cpv-lupa-clip"><circle cx="110" cy="110" r="110"/></clipPath></defs><g clip-path="url(#cpv-lupa-clip)"><rect width="220" height="220" style="fill:var(--bg-main)"/>`;
    if (tipo === 'tubo') h += lupaTubo(e);
    else if (tipo === 'alveolo') h += lupaAlveolo(e);
    else if (tipo === 'dedo') {
        const frente = e.sensor === 'frente';
        const spo = tapado('spo2') ? '?' : R.spo2 == null ? '—' : R.spo2 + ' %', sao = tapado('sao2') ? '?' : R.sao2 + ' %';
        h += T(110, 28, `SpO₂ ${spo}`, { a: 'middle', s: 11, b: 1, c: '--text-main', sans: 1 });
        if (!frente) {
            h += T(94, 42, 'rojo', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' }) + T(126, 42, 'infrarrojo', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
            h += T(94, 51, '660 nm', { a: 'middle', s: 8, sans: 1 }) + T(126, 51, '940 nm', { a: 'middle', s: 8, sans: 1 });
            h += '<path d="M20 72H170Q194 72 194 96Q194 120 170 120H20Z" style="fill:url(#cpv-raya2);stroke:var(--text-muted);stroke-width:1.2"/>';
            h += '<path d="M178 78Q188 84 188 96Q188 108 178 114" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>';
            h += '<g id="cpv-lupa-luces"><rect x="86" y="56" width="16" height="10" rx="2" style="fill:var(--accent-red)"/><rect x="118" y="56" width="16" height="10" rx="2" style="fill:var(--text-muted)"/></g>';
            h += '<path d="M94 66V128M126 66V128" style="stroke:var(--accent-yellow);stroke-width:1;stroke-dasharray:3 3;opacity:.7"/>';
            h += '<rect x="97" y="128" width="26" height="8" rx="2" style="fill:var(--text-dim)"/>' + T(110, 146, 'fotodetector', { a: 'middle', s: 8, sans: 1 });
            h += '<path id="cpv-lupa-arteria" d="M24 96H182" style="stroke:var(--accent-red);stroke-width:5;opacity:.75"/>' + T(30, 88, 'arteria que late', { s: 7.6, i: 1 });
        } else {
            h += '<path d="M24 120Q110 70 196 120" style="fill:url(#cpv-raya2);stroke:var(--text-muted);stroke-width:1.2"/>' + T(110, 108, 'frente (carótida interna)', { a: 'middle', s: 8, i: 1 });
            h += '<rect x="86" y="70" width="48" height="12" rx="3" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.2"/><circle cx="98" cy="76" r="2.6" style="fill:var(--accent-red)"/><rect x="114" y="73" width="12" height="6" style="fill:var(--text-dim)"/>';
            h += T(110, 50, 'reflectancia: diodos y detector juntos', { a: 'middle', s: 7.6, sans: 1 }) + T(110, 62, 'con cinta elástica (pulso venoso)', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
        }
        h += '<g id="cpv-lupa-pie">';
        if (!pista) h += T(110, 162, 'SpO₂ = HbO₂ / (Hb + HbO₂): solo lo que late', { a: 'middle', s: 8, sans: 1 });
        else if (R.spo2 == null && !e.rcp) h += T(110, 162, 'Onda plana: pon el sensor en la frente', { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 });
        else if (e.rcp) h += T(110, 162, 'Parada: sin pulso no hay onda', { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 });
        else if (e.co) h += T(110, 160, `COHb: dos colores no la ven · SaO₂ ${sao}`, { a: 'middle', s: 8, b: 1, c: '--accent-red', sans: 1 }) + T(110, 170, 'cooxímetro: hasta 8 longitudes de onda', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
        else h += T(110, 162, 'SpO₂ = HbO₂ / (Hb + HbO₂): solo lo que late', { a: 'middle', s: 8, sans: 1 });
        h += '</g>';
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
        h += `<g id="cpv-lupa-lact">${svgParticula('lact', 42, 148, 4.5)}${T(26, 166, 'lactato', { s: 8, b: 1, c: '--accent-yellow' })}</g>`;
        h += '<path d="M78 92H104" style="stroke:var(--text-dim);stroke-width:1.2"/><path d="M100 88l6 4-6 4" style="fill:none;stroke:var(--text-dim);stroke-width:1.2"/>';
        h += '<rect id="cpv-lupa-pdh" x="108" y="83" width="40" height="18" rx="4" style="fill:var(--bg-main);stroke:var(--accent-yellow);stroke-width:1.1"/>' + T(128, 96, 'PDH', { a: 'middle', s: 8.5, b: 1, sans: 1 });
        h += T(153, 90, 'con TPP', { s: 7.6, i: 1, c: '--text-muted' }) + T(153, 99, '(tiamina)', { s: 7.6, i: 1, c: '--text-muted' });
        if (bloq) h += '<path d="M110 85l36 14M146 85l-36 14" style="stroke:var(--accent-red);stroke-width:2.2;stroke-linecap:round"/>' + T(136, 116, e.util === 'sepsis' ? 'sepsis: endotoxina' : 'sin pirofosfato', { s: 7.6, b: 1, c: '--accent-red', sans: 1 }) + T(136, 125, e.util === 'sepsis' ? 'y citocinas' : 'de tiamina', { s: 7.6, b: 1, c: '--accent-red', sans: 1 });
        h += `<path d="M128 101V126" style="stroke:var(--text-dim);stroke-width:1.2${bloq ? ';opacity:.3' : ''}"/>`;
        h += '<ellipse cx="134" cy="160" rx="58" ry="32" style="fill:url(#cpv-raya);stroke:var(--text-dim);stroke-width:1.3"/>';
        h += T(134, 142, 'mitocondria', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
        h += svgParticula('o2', 110, 153, 3) + T(118, 156, 'O₂ → H₂O', { s: 8, sans: 1 });
        h += T(134, 170, 'Krebs · 2 ATP', { a: 'middle', s: 8, sans: 1, b: 1 }) + T(134, 182, 'cadena · 28 ATP', { a: 'middle', s: 8, sans: 1, b: 1 });
        h += svgParticula('co2', 204, 148, 3.4) + T(190, 136, 'CO₂', { s: 8, sans: 1 });
        h += '<g id="cpv-lupa-flujo"></g>';
    } else if (tipo === 'neutrofilo') {
        if (forzar) reiniciarNeutrofilo();
        h += lupaNeutrofilo(e, T, { exceso: !!e.ros && e.pao2 > estadoBase().pao2 && R.sao2 >= 90 });
    } else if (tipo === 'boca') {
        const x0 = 36, y0 = 52, w = 156, hh = 100;
        const y = v => y0 + hh - clamp(v, 0, 60) / 60 * hh;
        h += `<path d="M${x0} ${y0}V${y0 + hh}H${x0 + w}" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>`;
        for (const v of [0, 20, 40, 60]) h += T(x0 - 4, y(v) + 3, v, { a: 'end', s: 7.2, sans: 1, c: '--text-muted' });
        h += T(x0, y0 - 6, 'PCO₂ (mmHg)', { s: 7.6, sans: 1, c: '--text-muted' });
        h += `<g id="cpv-lupa-paco2"><path d="M${x0} ${y(R.paco2)}H${x0 + w}" style="stroke:var(--accent-purple);stroke-width:1;stroke-dasharray:4 3"/>${T(x0 + w, y(R.paco2) - 3, `PaCO₂ ${R.paco2}`, { a: 'end', s: 7.6, sans: 1, c: '--accent-purple' })}</g>`;
        h += `<path id="cpv-lupa-capno" d="${ondaCapno(x0, y0, w, hh, 2, e, R)}" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.8;stroke-linejoin:round"/>`;
        if (!e.esofago) {
            const bw = w / 2;
            // las fases, con su tramo del primer capnograma (lo que señala la explicación guiada)
            const tramo = (id, a, b, et, xt) => `<g id="${id}"><path d="M${n2(x0 + bw * a)} ${y0 + hh + 3}H${n2(x0 + bw * b)}" style="stroke:var(--text-muted);stroke-width:1"/>${T(n2(x0 + bw * xt), y0 + hh + 12, et, { a: 'middle', s: 8, b: 1, sans: 1 })}</g>`;
            const f2 = e.espacio === 'epoc' ? 0.42 : 0.22;
            h += tramo('cpv-lupa-f1', 0, 0.12, 'I', 0.06) + tramo('cpv-lupa-f2', 0.12, f2, 'II', (0.12 + f2) / 2);
            h += tramo('cpv-lupa-f3', f2, 0.72, 'III', (f2 + 0.72) / 2) + tramo('cpv-lupa-f4', 0.72, 1, 'IV', 0.84);
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
    if (forzar || h !== lupaFija) { lupaFija = h; Lupa.svg.innerHTML = h; FLUJO.forEach(f => { f.el = null; }); if (tipo === 'neutrofilo') pasoNeutrofilo(0, e, Lupa.svg, true); }
}
const FLUJO = [];   // puntitos que recorren la vía de la glucosa en la lupa de la mitocondria
function pasoLupa(dt) {
    if (!Lupa.abierta) return;
    const e = estado, R = D.R;
    // el tubo: el plasma del tubo de la derecha crece (en 1,2 s); el alvéolo del TACO: gotas que suben por presión
    if (Lupa.abierta === 'tubo') {
        const t = TUBOS[e.dil]; if (!t || t[1] == null) return;
        tuboAnim = REDUCIR ? 1 : Math.min(1, tuboAnim + dt / 1.2);
        crecerPlasma(Lupa.svg, 'cpv-tubo', t[0], t[1], tuboAnim);
        return;
    }
    if (Lupa.abierta === 'alveolo') {
        const g = $('alv-gotas'); if (!g) return;
        if (!g.childNodes.length) for (let i = 0; i < 6; i++) { const c = document.createElementNS(NS, 'g'); c.innerHTML = svgParticula('agua', 0, 0, 2.6); g.appendChild(c); }
        [...g.childNodes].forEach((c, i) => {
            const u = REDUCIR ? 0.3 + 0.08 * i : ((tiempo * 0.45 + i / 6) % 1);
            c.setAttribute('transform', `translate(${n2(60 + i * 20)} ${n2(132 - 40 * u)})`); c.setAttribute('opacity', String(n2(Math.min(1, u * 4, (1 - u) * 4))));
        });
        return;
    }
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
    } else if (Lupa.abierta === 'neutrofilo') {
        pasoNeutrofilo(dt, e, Lupa.svg, REDUCIR);
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
// Antes y después: la anemia con Hb 7,5, con el gasto fijo y con el corazón que compensa (se pinta una vez).
function pintarAB() {
    const fijo = derivar(estadoDe(ESTADOS.anemia.p)), comp = derivar(estadoDe(ESTADOS['anemia-compensada'].p));
    const col = (tit, d, clase, frase) => `<div class="cpv-ab-col${clase}"><h4>${tit}</h4><dl>
        <dt>Gasto</dt><dd>${dec(d.R.gc, 1)} L/min</dd><dt>Aporte</dt><dd>${mil(d.R.do2)} mL/min</dd>
        <dt>Extracción</dt><dd class="${d.R.ext >= 50 ? 'cpv-ab-mal' : ''}">${d.R.ext} %</dd><dt>SvO₂</dt><dd class="${d.R.svo2 <= 50 ? 'cpv-ab-mal' : ''}">${d.R.svo2} %</dd></dl><p>${frase}</p></div>`;
    $('ab').innerHTML = col('Si el gasto no cambiara', fijo, '', 'La extracción llegaría a ≈50 %: parecería que el tejido está al límite.')
        + col('El corazón compensa', comp, ' cpv-ab-nueva', 'La extracción sube sin llegar al techo, como en la Fig. 12.3.');
}
function pintarGraficas() {
    const e = estado, R = D.R;
    if (!$('ab').innerHTML) pintarAB();
    // Fig. 12.3 viva: extracción (arriba) y consumo (abajo) frente a la Hb, con el corazón que compensa
    {
        const X = hb => 34 + (15 - hb) / 13 * 192;
        const Ye = v => 78 - v / 60 * 64, Yv = v => 172 - v / 300 * 56;
        let h = '<path d="M34 14V78H226M34 116V172H226" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>';
        for (const v of [0, 25, 50]) h += T(30, Ye(v) + 3, v, { a: 'end', s: 7.6, sans: 1, c: '--text-muted' });
        for (const v of [0, 250]) h += T(30, Yv(v) + 3, v, { a: 'end', s: 7.6, sans: 1, c: '--text-muted' });
        h += T(38, 11, 'extracción (%)', { s: 7.6, sans: 1, c: '--text-muted' }) + T(38, 110, 'VO₂ (mL/min)', { s: 7.6, sans: 1, c: '--text-muted' });
        for (const v of [15, 10, 7, 3]) h += T(X(v), 184, v, { a: 'middle', s: 7.6, sans: 1, c: '--text-muted' });
        h += T(130, 194, 'Hb (g/dL)', { a: 'middle', s: 7.6, sans: 1, c: '--text-muted' });
        let de = '', dv = '';
        for (let hb = 15; hb >= 2; hb -= 0.25) { const q = derivar(estadoDe({ hb, compensa: true })); de += `${de ? 'L' : 'M'}${n2(X(hb))} ${n2(Ye(q.o2er * 100))}`; dv += `${dv ? 'L' : 'M'}${n2(X(hb))} ${n2(Yv(q.R.vo2))}`; }
        h += `<path d="${de}" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.8"/><path d="${dv}" style="fill:none;stroke:var(--accent-yellow);stroke-width:1.8"/>`;
        h += `<path d="M${n2(X(3))} 14V172" style="stroke:var(--text-muted);stroke-width:.9;stroke-dasharray:3 3"/>`;
        h += T(X(3) - 3, 26, 'Hb 3 ≈ Hto 10 %', { a: 'end', s: 7.6, i: 1, c: '--text-dim' });
        h += T(X(3) - 3, 98, 'el techo: 50 %', { a: 'end', s: 7.6, i: 1, c: '--text-dim' });
        if (!e.rcp && !tapado('o2er') && e.hb <= 15) {
            const px = X(clamp(e.hb, 2, 15));
            h += `<circle cx="${n2(px)}" cy="${n2(Ye(D.o2er * 100))}" r="4.5" style="fill:var(--accent-red);stroke:var(--bg-main);stroke-width:1.5"/>`;
            if (!tapado('vo2')) h += `<circle cx="${n2(px)}" cy="${n2(Yv(R.vo2))}" r="4.5" style="fill:var(--accent-red);stroke:var(--bg-main);stroke-width:1.5"/>`;
            const izq = px > 150;
            h += T(px + (izq ? -7 : 7), Ye(R.ext) - 6, `${R.ext} %${e.compensa || e.gcFijo != null ? '' : ' (gasto fijo)'}`, { a: izq ? 'end' : 'start', s: 7.6, b: 1, sans: 1, c: '--text-main' });
        }
        $('svg-123').innerHTML = h;
    }
    // Fig. 12.4 viva: antes y después de transfundir (aparece al visitar el estado). Cada fila, su escala: la pendiente es el % de cambio.
    {
        const vis = visitados.has('transfusion');
        let h = T(92, 162, 'antes', { a: 'middle', s: 8, sans: 1, c: '--text-muted' }) + T(180, 162, 'después', { a: 'middle', s: 8, sans: 1, c: '--text-muted' });
        h += '<path d="M92 8V150M180 8V150" style="stroke:var(--text-muted);stroke-width:.7;stroke-dasharray:2 3"/>';
        if (!vis) h += T(136, 84, '? visita «Transfusión»', { a: 'middle', s: 9, b: 1, c: '--text-muted', sans: 1 });
        else {
            const pre = derivar(estadoDe(ESTADOS.transfusion.p)), post = derivar(estadoFinal('transfusion'));
            const fila = (yc, nombre, a, b, col, fmt) => {
                const y2 = yc - (b / a - 1) * 100;
                return T(8, yc + 3, nombre, { s: 8, sans: 1, b: 1, c: col }) + `<path d="M92 ${yc}L180 ${n2(y2)}" style="stroke:var(${col});stroke-width:1.8"/>`
                    + `<circle cx="92" cy="${yc}" r="4" style="fill:var(${col});stroke:var(--bg-main);stroke-width:1.2"/><circle cx="180" cy="${n2(y2)}" r="4" style="fill:var(${col});stroke:var(--bg-main);stroke-width:1.2"/>`
                    + T(84, yc + 3, fmt(a), { a: 'end', s: 8, sans: 1, c: '--text-main' }) + T(188, y2 + 3, fmt(b) + (Math.abs(b / a - 1) < 0.01 ? ' (igual)' : ` (+${Math.round((b / a - 1) * 100)} %)`), { s: 8, sans: 1, c: '--text-main' });
            };
            h += fila(40, 'Hb', ESTADOS.transfusion.p.hb, ESTADOS.transfusion.transfundir, '--accent-red', v => dec(v, 1));
            h += fila(96, 'DO₂', pre.do2, post.do2, '--accent-yellow', v => mil(v));
            h += fila(140, 'VO₂', pre.vo2, post.vo2, '--text-dim', v => Math.round(v));
        }
        $('svg-124').innerHTML = h;
    }
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
        const igual = ['hb', 'pao2', 'co', 'gc', 'util', 'compensa', 'volemia'].every(c => p[c] === estado[c]);
        if (igual) { vistos.add(k); if (k !== 'co' && !visitados.has(k)) { visitados.add(k); barraNueva = k; } }
    }
    if (estado.transf) visitados.add('transfusion');
    // un tubo nuevo: su plasma crece desde el principio
    if (estado.dil !== viejo.dil && estado.dil && TUBOS[estado.dil][1] != null) tuboAnim = REDUCIR ? 1 : 0;
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
    // la bolsa (pieza común, core/bolsa.js): un CH que gotea en la sangre al transfundir
    $('bolsa-sitio').innerHTML = svgBolsa('ch', { x: 207, y: -1, id: 'cpv-bolsa', tubo: 44, rotulo: 'izq', gota: 0 });
    $('bolsa').setAttribute('hidden', '');
    D = derivar(estado);
    repintar();
}
