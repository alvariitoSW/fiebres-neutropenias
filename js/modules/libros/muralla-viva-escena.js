// La muralla de papel: la escena viva (la lámina en grabado). A la izquierda, la tira del tubo desenrollado de la boca
// al colon (Fig. 4.1, escala logarítmica); a la derecha, la muralla de la estación elegida: la fosita gástrica (con su
// moco, su capilar, la lesión y la Fig. 4.3), la vellosidad del intestino (el encuadre de la Fig. 4.2, con la flora
// residente, las cadenas cortas, el GALT y la translocación) o el epitelio de la boca con sus 10 cerraduras. Debajo,
// la sangre (hacia la punta del catéter: vía 4), la figura viva de cada estación (Tabla 4.2, la balanza de la
// Fig. 4.6, la Fig. 4.5 con el reloj de la SDD, el motor del FMO o la Fig. 4.4) y la rueda del fallo multiorgánico.
// Además: el tablero, las consecuencias, el anillo dorado y el bucle de dibujo.
//
// Un solo estado (`estado`: la hoja de órdenes) y lo que se deriva de él (`D`, con derivar() de
// js/data/muralla-viva-data.js). La interfaz y la capa de estudio viven en muralla-viva.js.
// Las partículas salen de js/core/particulas.js (tabla única de formas). Rendimiento: el bucle solo corre con la
// lámina a la vista; con «reducir movimiento» se pinta el estado final.
import { svgParticula } from '../../core/particulas.js';
import { sinMovimiento } from '../../core/motion.js';
import { estadoBase, derivar, chipTxt, clamp, NIVELES } from '../../data/muralla-viva-data.js';

export const $ = id => document.getElementById('mur-' + id);
const n2 = x => +x.toFixed(2);
export let REDUCIR = false;
// Generador repetible (la misma lámina con el mismo estado)
function azar(sem) { let s = (Math.imul(sem + 1, 2654435761) ^ 0x9e3779b9) >>> 0; const r = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; r(); r(); return r; }
// La partícula de la tabla única, centrada en 0,0
const P = (clave, r, opc) => svgParticula(clave, 0, 0, r, opc);

/* ============================================================
   Estado (enlaces vivos: solo esta pieza los cambia, con aplicarModelo)
   ============================================================ */
export let estado = estadoBase();
export let D = derivar(estado);
// Cambia el estado y repinta. Devuelve el estado anterior (para la frase viva).
export function aplicarModelo(nuevo, { sinAnim = false } = {}) {
    const viejo = estado;
    estado = nuevo; D = derivar(estado);
    if (!(viejo.estacion === 'estomago' && D.balanza && derivar(viejo).balanza && viejo.estacion === nuevo.estacion)) Balanza.quieta = false;
    pintarLamina(); pintarTablero();
    if (!sinAnim) arrancar();
    return viejo;
}
export function setOcultos(arr, repintar = true) { ocultos.clear(); (arr || []).forEach(k => ocultos.add(k)); if (repintar) { pintarLamina(); pintarTablero(); } }

/* ============================================================
   Geometría: rutas, muestreo y células a lo largo de una superficie
   ============================================================ */
function longitudes(pts) { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
function enRuta(pts, s, L = longitudes(pts)) {
    const tot = L[L.length - 1], d = clamp(s, 0, 1) * tot;
    let i = 1; while (i < L.length - 1 && L[i] < d) i++;
    const f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, Math.atan2(y1 - y0, x1 - x0)];
}
// Puntos cada `paso` a lo largo de la polilínea, con su tangente y su normal hacia el tejido (a la derecha del sentido de marcha)
function muestrear(pts, paso) {
    const L = longitudes(pts), tot = L[L.length - 1], out = [];
    for (let d = paso / 2; d < tot; d += paso) {
        const [x, y, a] = enRuta(pts, d / tot, L);
        out.push({ x, y, tx: Math.cos(a), ty: Math.sin(a), nx: -Math.sin(a), ny: Math.cos(a), d });
    }
    return out;
}
const camino = pts => 'M' + pts.map(p => `${n2(p[0])} ${n2(p[1])}`).join('L');
// Una fila de células cilíndricas (una sola capa) a lo largo de la superficie
function celulas(muestras, alto, { ancho = 8.4, fuera = () => false, trofica = false } = {}) {
    let h = '';
    for (const m of muestras) {
        if (fuera(m)) continue;
        const a = ancho / 2, P = (u, v) => `${n2(m.x + m.tx * u + m.nx * v)} ${n2(m.y + m.ty * u + m.ny * v)}`;
        h += `<path d="M${P(-a, 0)}L${P(a, 0)}L${P(a, alto)}L${P(-a, alto)}Z" style="fill:var(--text-main);stroke:var(--accent-yellow)" fill-opacity="${trofica ? .2 : .11}" stroke-opacity=".55" stroke-width=".55"/>`;
        h += `<circle cx="${n2(m.x + m.nx * alto * .7)}" cy="${n2(m.y + m.ny * alto * .7)}" r="1.5" style="fill:var(--accent-purple)" fill-opacity=".8"/>`;
    }
    return h;
}

/* ============================================================
   Lo que se mueve: cada pieza animada es un <g data-mv> con su descriptor
   ============================================================ */
let movibles = [], descriptores = [], tiempo = 0;
function mv(desc, contenido) { descriptores.push(desc); return `<g data-mv="${descriptores.length - 1}">${contenido}</g>`; }
function colocar(m) {
    const t = tiempo;
    let x = 0, y = 0, extra = '', op = null;
    if (m.tipo === 'ruta') { if (!m.L) m.L = longitudes(m.pts); const s = (((m.s0 + m.v * t) % 1) + 1) % 1; const [px, py, a] = enRuta(m.pts, s, m.L); x = px; y = py; if (m.rot) extra = ` rotate(${n2(a * 180 / Math.PI)})`; if (m.desvanece) op = s > 0.85 ? (1 - s) / 0.15 : s < 0.08 ? s / 0.08 : 1; }
    else if (m.tipo === 'deriva') {
        if (m.x == null) { const r = azar(m.sem); m.x = m.x0 + r() * (m.x1 - m.x0); m.y = m.y0 + r() * (m.y1 - m.y0); const a = r() * 6.28; m.vx = Math.cos(a) * m.vel; m.vy = Math.sin(a) * m.vel; m.giro = r() * 180; }
        x = m.x; y = m.y; extra = ` rotate(${n2(m.giro + t * 12)})`;
    }
    else if (m.tipo === 'osc') { x = m.x + Math.sin(t * m.f + m.fase) * m.amp; y = m.y + Math.cos(t * m.f * .8 + m.fase) * m.amp * .6; if (m.giro != null) extra = ` rotate(${m.giro})`; }
    else if (m.tipo === 'muere') {
        const ph = ((t + m.f0) % m.T) / m.T;
        x = m.x; y = m.y + ph * 10;
        const s = ph < 0.5 ? 1 : ph < 0.85 ? 1 - (ph - 0.5) / 0.35 * 0.55 : 0.45;
        op = ph < 0.5 ? 1 : ph < 0.85 ? 1 - (ph - 0.5) / 0.35 : 0;
        extra = ` rotate(${m.giro}) scale(${n2(s)})`;
    }
    else if (m.tipo === 'rueda') { m.el.setAttribute('transform', `rotate(${n2((t * m.vel * 360) % 360)} ${m.cx} ${m.cy})`); return; }
    m.el.setAttribute('transform', `translate(${n2(x)} ${n2(y)})${extra}`);
    if (op != null) m.el.setAttribute('opacity', n2(clamp(op, 0, 1)));
}
function paso(dt) {
    tiempo += dt;
    for (const m of movibles) {
        if (m.tipo === 'deriva' && m.x != null) {
            m.x += m.vx * dt; m.y += m.vy * dt;
            if (m.x < m.x0 || m.x > m.x1) { m.vx *= -1; m.x = clamp(m.x, m.x0, m.x1); }
            if (m.y < m.y0 || m.y > m.y1) { m.vy *= -1; m.y = clamp(m.y, m.y0, m.y1); }
        }
        colocar(m);
    }
}
let enMarcha = false, tPrev = 0, visible = false;
const fotogramas = [];
function bucle(ahora) {
    if (!enMarcha) return;
    const dt = Math.min(0.05, (ahora - tPrev) / 1000); tPrev = ahora;
    const t0 = performance.now(); paso(dt); fotogramas.push(performance.now() - t0); if (fotogramas.length > 400) fotogramas.shift();
    if (visible && !document.hidden) requestAnimationFrame(bucle); else enMarcha = false;
}
export function arrancar() { if (REDUCIR || enMarcha || !visible) return; enMarcha = true; tPrev = performance.now(); requestAnimationFrame(bucle); }
export function ponerVisible(v) { visible = v; if (v) arrancar(); }
export function estadoBucle() {
    const n = fotogramas.length, medio = n ? n2(fotogramas.reduce((a, b) => a + b, 0) / n) : 0;
    return { enMarcha, visible, fotogramas: { n, medio, max: n ? n2(Math.max(...fotogramas)) : 0 } };
}
export function vaciarFotogramas() { fotogramas.length = 0; }

/* ============================================================
   Utilidades de dibujo de la lámina (la cama 7 va en js/modules/libros/cama7.js)
   ============================================================ */
const DEFS = `<defs>
    <pattern id="mur-p-rayado" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--accent-yellow)" stroke-opacity=".3" stroke-width=".8"/></pattern>
    <pattern id="mur-p-rayado-fino" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="3" style="stroke:var(--accent-yellow)" stroke-opacity=".22" stroke-width=".6"/></pattern>
    <pattern id="mur-p-punteado" width="7" height="6" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.5" r=".7" style="fill:var(--text-dim)" fill-opacity=".3"/><circle cx="5.1" cy="4.4" r=".55" style="fill:var(--text-dim)" fill-opacity=".24"/></pattern>
    <pattern id="mur-p-cruzado" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" style="stroke:var(--text-muted)" stroke-opacity=".2" stroke-width=".6"/></pattern>
    <pattern id="mur-p-ciruela" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-purple)" stroke-opacity=".5" stroke-width=".7"/></pattern>
    <pattern id="mur-p-verde" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-green)" stroke-opacity=".45" stroke-width=".7"/></pattern>
    <pattern id="mur-p-rojo" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(60)"><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-red)" stroke-opacity=".6" stroke-width=".8"/></pattern>
    <pattern id="mur-p-sabana" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--text-dim)" stroke-opacity=".28" stroke-width=".7"/></pattern>
</defs>`;
const LETRA_MIN = 8.4;
const T = (x, y, txt, { size = 8, color = '--text-dim', anchor = 'start', peso = 400, italic = false, plato = false, extra = '' } = {}) => {
    size = Math.max(size, LETRA_MIN);   // a 390 px la lámina se ve al ~87-92 %: así ningún rótulo baja de 7,5 px
    const tt = `<text x="${x}" y="${y}" text-anchor="${anchor}" style="font:${italic ? 'italic ' : ''}${peso} ${size}px Georgia, serif;fill:var(${color})"${extra}>${txt}</text>`;
    if (!plato) return tt;
    const w = String(txt).replace(/<[^>]+>/g, '').length * size * 0.5 + 6, x0 = anchor === 'end' ? x - w + 3 : anchor === 'middle' ? x - w / 2 : x - 3;
    return `<rect x="${n2(x0)}" y="${n2(y - size)}" width="${n2(w)}" height="${n2(size * 1.35)}" rx="2" style="fill:var(--bg-main)" fill-opacity=".82"/>` + tt;
};

/* ============================================================
   La lámina: la tira, la muralla de cada estación, la sangre, la figura viva y la rueda
   ============================================================ */
export const ocultos = new Set();   // cifras tapadas con «?» hasta contestar
const Q = (k, v) => ocultos.has(k) ? '?' : v;
export const ESTACIONES = { boca: { y0: 24, y1: 98 }, estomago: { y0: 100, y1: 180 }, intestino: { y0: 182, y1: 372 } };
const SEGMENTOS = [['boca', 24, 98, 'Boca', '10⁶'], ['estomago', 100, 180, 'Estómago', '&lt;10³'], ['intestino', 182, 274, 'Intestino', '10⁹'], ['colon', 276, 372, 'Colon', '10¹²']];

function tira(e, D) {
    let h = `<rect x="9" y="22" width="44" height="352" rx="18" style="fill:var(--text-main);stroke:var(--accent-yellow)" fill-opacity=".04" stroke-opacity=".5"/><rect x="9" y="22" width="44" height="352" rx="18" fill="url(#mur-p-rayado-fino)"/>`;
    const r = azar(7);
    for (const [k, y0, y1, nom, exp] of SEGMENTOS) {
        if (y0 > 30) h += `<line x1="12" y1="${y0 - 1}" x2="50" y2="${y0 - 1}" style="stroke:var(--accent-yellow)" stroke-opacity=".45" stroke-dasharray="2 2"/>`;
        h += T(31, y0 + 11, nom, { size: 7.5, anchor: 'middle', color: '--text-dim', peso: 600 });
        h += T(31, y1 - 4, ocultos.has('tira') ? '?' : exp, { size: 8.5, anchor: 'middle', color: '--accent-blue', peso: 700 });
        if (ocultos.has('tira')) continue;
        const n = D.tira[k], pat = k === 'intestino' || k === 'colon' ? D.tiraPatIntestino : D.tiraPatogenos;
        for (let i = 0; i < n; i++) {
            const x = 16 + r() * 30, y = y0 + 16 + r() * (y1 - y0 - 30);
            const esPat = r() < pat || (k === 'estomago' && D.supresor);
            h += `<g transform="translate(${n2(x)} ${n2(y)}) rotate(${Math.round(r() * 180)})">${P(esPat ? 'bacilo' : 'huso', 1.7, esPat && D.mrHalo ? { halo: '--accent-red' } : {})}</g>`;
        }
    }
    if (D.flechaPulmon) h += `<path d="M31 150 V12" style="fill:none;stroke:var(--accent-red)" stroke-width="1.6" stroke-dasharray="4 2"/><path d="M27 17 L31 9 L35 17" style="fill:none;stroke:var(--accent-red)" stroke-width="1.6"/>` + T(38, 11, 'pulmón', { size: 7, color: '--accent-red', peso: 600 });
    const s = ESTACIONES[e.estacion];
    h += `<rect x="6" y="${s.y0 - 2}" width="50" height="${s.y1 - s.y0 + 4}" rx="10" style="fill:none;stroke:var(--accent-blue)" stroke-width="2.4"/><path d="M57 ${(s.y0 + s.y1) / 2 - 5} L62 ${(s.y0 + s.y1) / 2} L57 ${(s.y0 + s.y1) / 2 + 5}Z" style="fill:var(--accent-blue)"/>`;
    for (const k of Object.keys(ESTACIONES)) h += `<rect data-toca="est:${k}" role="button" aria-label="Estación: ${k}" x="4" y="${ESTACIONES[k].y0}" width="56" height="${ESTACIONES[k].y1 - ESTACIONES[k].y0}" fill="transparent"/>`;
    return h;
}

/* ---- Estómago: la fosita gástrica ---- */
function estomago(e, D) {
    const ye = 136, ALTO = 22;
    let h = T(66, 17, 'ESTÓMAGO · la fosita gástrica' + diaTxt(e), { size: 7.5, color: '--accent-yellow', peso: 700 });
    const sup = [[62, ye], [164, ye], [175, ye + 7], [186, ye + 18], [198, ye + 28], [210, ye + 32], [222, ye + 28], [234, ye + 18], [245, ye + 7], [256, ye], [356, ye]];
    const L = D.lesion, cx = 290, w = L.nivel === 2 ? 40 * L.tam : L.nivel === 1 ? 30 * L.tam : 0;
    const enGap = m => L.nivel && Math.abs(m.x - cx) < w / 2 && m.y < ye + 4;
    // nutrición enteral (en la luz)
    if (e.enteral) h += `<path d="M66 36 C110 28 150 46 200 36 C230 30 250 40 262 36 L262 52 C230 58 200 46 160 54 C120 60 90 48 66 52Z" style="fill:var(--text-main)" fill-opacity=".09"/><path d="M66 36 C110 28 150 46 200 36 C230 30 250 40 262 36 L262 52 C230 58 200 46 160 54 C120 60 90 48 66 52Z" fill="url(#mur-p-rayado-fino)"/>` + T(70, 47, 'nutrición enteral', { size: 7.5, italic: true, color: '--text-dim' });
    // moco con HCO₃⁻ (pH 7): un trazo grueso sobre la superficie; el tejido tapa su mitad de abajo
    const finas = muestrear(sup, 2);
    const tramos = []; let actual = [];
    for (const m of finas) { if (enGap(m)) { if (actual.length > 1) tramos.push(actual); actual = []; } else actual.push([m.x, m.y]); }
    if (actual.length > 1) tramos.push(actual);
    for (const tr of tramos) h += `<path d="${camino(tr)}" style="fill:none;stroke:var(--accent-green)" stroke-opacity=".22" stroke-width="${D.moco * 2}" stroke-linejoin="round"/><path d="${camino(tr)}" style="fill:none;stroke:url(#mur-p-verde)" stroke-width="${D.moco * 2}" stroke-linejoin="round"/>`;
    for (const m of muestrear(sup, 15)) if (!enGap(m)) h += `<g transform="translate(${n2(m.x - m.nx * D.moco * .55)} ${n2(m.y - m.ny * D.moco * .55)})">${P('hco3', D.moco > 6 ? 2.4 : 1.7)}</g>`;
    // tejido (lámina propia y submucosa)
    const tejido = camino(sup) + 'L356 258L62 258Z';
    h += `<path d="${tejido}" style="fill:var(--bg-main)"/><path d="${tejido}" fill="url(#mur-p-punteado)"/>`;
    h += `<rect x="62" y="224" width="294" height="34" fill="url(#mur-p-cruzado)"/>` + T(352, 252, 'submucosa', { size: 7, color: '--text-muted', anchor: 'end', italic: true });
    // capilar de la mucosa (70-90 % del riego): grueso o cerrado según el riego
    const yc = 208, gc = D.capilar;
    h += `<rect x="62" y="${yc - gc / 2}" width="294" height="${gc}" style="fill:var(--accent-red)" fill-opacity=".14"/><line x1="62" y1="${yc - gc / 2}" x2="356" y2="${yc - gc / 2}" style="stroke:var(--accent-red)" stroke-opacity=".7"/><line x1="62" y1="${yc + gc / 2}" x2="356" y2="${yc + gc / 2}" style="stroke:var(--accent-red)" stroke-opacity=".7"/>`;
    const nR = { normal: 9, oculta: 6, shock: 3 }[e.riego];
    for (let i = 0; i < nR; i++) h += mv({ tipo: 'ruta', pts: [[62, yc], [356, yc]], s0: i / nR, v: 0.09 * D.flujo }, P('rbc', Math.min(3.2, gc / 3.2)));
    h += T(66, yc + gc / 2 + 9, 'capilar de la mucosa: 70-90 % del riego', { size: 7, color: '--text-dim', italic: true, plato: true });
    // la fila de células (una sola capa)
    h += celulas(muestrear(sup, 9), ALTO, { fuera: enGap, trofica: e.enteral });
    // la regla de 0,1 mm
    h += `<g data-toca="regla" data-regla="0,1 mm" role="button" aria-label="Regla: 0,1 mm"><rect x="62" y="${ye - 6}" width="80" height="52" fill="transparent"/><path d="M66 ${ye} H71 M68.5 ${ye} V${ye + ALTO} M66 ${ye + ALTO} H71" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.6"/>${T(74, ye + ALTO + 10, '0,1 mm · una sola capa', { size: 7.5, color: '--accent-blue', peso: 700, plato: true })}</g>`;
    // la lesión
    if (L.nivel) {
        const fondo = L.nivel === 2 ? 250 : ye + 14, x0 = cx - w / 2, x1 = cx + w / 2;
        const crater = `M${n2(x0)} ${ye - 1} C${n2(x0 + 2)} ${n2(fondo - 4)} ${n2(x1 - 2)} ${n2(fondo - 4)} ${n2(x1)} ${ye - 1}Z`;
        h += `<path d="${crater}" style="fill:var(--accent-red);stroke:var(--accent-red)" fill-opacity=".28" stroke-width="1.1"/><path d="${crater}" fill="url(#mur-p-rojo)"/>`;
        h += T(x0 - 3, L.nivel === 2 ? 240 : ye + 34, L.nivel === 2 ? 'úlcera' : 'erosión', { size: 8, color: '--accent-red', peso: 700, plato: true, anchor: 'end' });
        if (L.tapada) h += `<path d="M${n2(x0 - 5)} ${ye - 7} Q${cx} ${ye - 13} ${n2(x1 + 5)} ${ye - 7} L${n2(x1 + 5)} ${ye + 1} Q${cx} ${ye - 4} ${n2(x0 - 5)} ${ye + 1}Z" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" fill-opacity=".45" stroke-width=".8"/>` + T(cx, ye - 16, 'capa de sucralfato', { size: 7.5, color: '--accent-yellow', anchor: 'middle', peso: 700, plato: true });
        const nS = L.sangra ? Math.round(7 * L.tam) + 1 : L.rezuma ? 2 : 0;
        for (let i = 0; i < nS; i++) h += mv({ tipo: 'ruta', pts: [[cx + (i % 3 - 1) * 4, fondo - 6], [cx + (i % 3 - 1) * 8, ye - D.moco], [cx + (i % 3 - 1) * 18 - 40, L.sangra ? 56 : ye - D.moco - 14]], s0: i / Math.max(1, nS), v: L.sangra ? 0.22 : 0.08, desvanece: true }, P('rbc', 2.4));
    }
    // la luz: H⁺ y Salmonella (Fig. 4.3)
    const yl = ye - D.moco - 8;
    for (let i = 0; i < D.hPlus; i++) h += mv({ tipo: 'deriva', x0: 70, x1: 258, y0: 26, y1: yl, sem: 31 + i, vel: 9 }, P('h', 2.4));
    const nSal = D.salmonella === 'crece' ? 9 : 5;
    for (let i = 0; i < nSal; i++) {
        const r = azar(90 + i), x = 76 + r() * 176, y = 30 + r() * (yl - 40), g = Math.round(r() * 180);
        h += D.salmonella === 'muere' ? mv({ tipo: 'muere', x, y, giro: g, T: 4.5, f0: i * 0.9 }, P('bacilo', 3.2)) : mv({ tipo: 'osc', x, y, amp: 2.5, f: 1.3, fase: i, giro: g }, P('bacilo', 3.2));
    }
    h += T(66, 29, 'la luz · pH ' + Q('ph', D.ph), { size: 7.5, color: '--text-dim', italic: true, plato: true });
    // el indicador de la Fig. 4.3, al lado de la muralla
    const yPh = { 4: 32, 3: 64, 2: 96 };
    h += `<g data-toca="fig43" role="button" aria-label="Fig. 4.3: Salmonella y pH"><rect x="262" y="20" width="96" height="88" fill="transparent"/>`;
    h += `<rect x="342" y="26" width="7" height="76" rx="3.5" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-opacity=".6"/>`;
    for (const [p, txt] of [[4, 'pH 4 · crece'], [3, 'pH 3 · cae'], [2, 'pH 2 · muere en 1 h']]) h += `<line x1="339" y1="${yPh[p]}" x2="352" y2="${yPh[p]}" style="stroke:var(--accent-yellow)" stroke-opacity=".7"/>` + T(336, yPh[p] + 3, txt, { size: 8, anchor: 'end', color: '--text-dim', plato: true });
    if (ocultos.has('ph') || ocultos.has('salmonella')) h += T(354, 66, '?', { size: 12, color: '--accent-blue', anchor: 'end', peso: 700 });
    else { const ym = yPh[D.phNum]; h += `<path d="M358 ${ym - 5} L351 ${ym} L358 ${ym + 5}Z" style="fill:var(--accent-blue)"/>`; if (D.phSube) h += T(352, ym - 8, '↑ sin cifra', { size: 8, anchor: 'end', color: '--accent-blue', plato: true }); }
    h += T(352, 14, 'Fig. 4.3 · <tspan font-style="italic">Salmonella</tspan>', { size: 8, anchor: 'end', color: '--text-muted' }) + `</g>`;
    return h;
}

/* ---- Intestino: la vellosidad (el encuadre de la Fig. 4.2) ---- */
function intestino(e, D) {
    const yb = 214, ALTO = 22;
    let h = T(66, 17, 'INTESTINO · una vellosidad' + diaTxt(e), { size: 7.5, color: '--accent-yellow', peso: 700 });
    const tip = []; for (let a = 180; a >= 0; a -= 15) { const r = a * Math.PI / 180; tip.push([206 + 56 * Math.cos(r), 84 - 44 * Math.sin(r)]); }
    const sup = [[62, yb], [150, yb], [150, 84], ...tip.slice(1, -1), [262, 84], [262, yb], [356, yb]];
    const muestras = muestrear(sup, 9);
    const rota = D.numeros[2];
    const enGap = m => rota && m.x > 236 && m.y > 52 && m.y < 96;
    const tejido = camino(sup) + 'L356 258L62 258Z';
    h += `<path d="${tejido}" style="fill:var(--bg-main)"/><path d="${tejido}" fill="url(#mur-p-punteado)"/>`;
    // conducto linfático y plexo vascular (cerrado si el simpático aprieta)
    h += `<path d="M206 80 V250" style="stroke:var(--text-main)" stroke-opacity="${D.numeros[3] ? .1 : .2}" stroke-width="10" stroke-linecap="round"/>`;
    const gv = D.vasosCerrados ? (D.motor >= 2 ? 1.6 : 2.6) : 4.4;
    const plexo = sg => { const p = []; for (let y = 66; y <= 236; y += 6) p.push([206 + sg * (16 + 7 * Math.sin(y / 13)), y]); return p; };
    for (const sg of [-1, 1]) {
        const p = plexo(sg); h += `<path d="${camino(p)}" style="fill:none;stroke:var(--accent-red)" stroke-width="${gv}" stroke-opacity=".75" stroke-linecap="round"/>`;
        const ruta = sg < 0 ? p : [...p].reverse(); const vel = D.vasosCerrados ? (D.motor >= 2 ? 0.03 : 0.06) : 0.12;
        for (let i = 0; i < 4; i++) h += mv({ tipo: 'ruta', pts: ruta, s0: i / 4, v: vel }, P('rbc', D.vasosCerrados ? 1.6 : 2.3));
    }
    h += T(66, 132, 'plexo vascular', { size: 7, color: '--text-dim', italic: true, plato: true }) + `<line x1="120" y1="130" x2="188" y2="130" style="stroke:var(--text-dim)" stroke-opacity=".5" stroke-width=".6"/>`;
    h += T(66, 150, 'conducto linfático', { size: 7, color: '--text-dim', italic: true, plato: true }) + `<line x1="132" y1="148" x2="204" y2="148" style="stroke:var(--text-dim)" stroke-opacity=".5" stroke-width=".6"/>`;
    // la fila de células
    h += celulas(muestras, ALTO, { fuera: enGap });
    // GALT: un ganglio con dos guardias
    h += `<ellipse cx="102" cy="246" rx="34" ry="10" style="fill:var(--accent-purple);stroke:var(--accent-purple)" fill-opacity=".1" stroke-opacity=".6"/>` + T(66, 238, 'GALT', { size: 7, color: '--text-dim', peso: 700 });
    for (const [x, i] of [[90, 0], [116, 1]]) h += mv({ tipo: 'osc', x, y: 246, amp: 1.2, f: 1.1, fase: i * 2 }, P('linfocito', 4.2, D.numeros[3] ? { hueco: true } : {}));
    // la flora residente: ocupa todos los huecos de la superficie
    const r = azar(3);
    const sitios = muestras.filter((m, i) => i % 1 === 0 && !(m.x > 150 && m.x < 262 && m.y > yb - 1) && m.x > 66);
    sitios.forEach((m, i) => {
        const viva = D.residentes === 1 || r() < D.residentes;
        const x = m.x - m.nx * 5, y = m.y - m.ny * 5, g = Math.round(Math.atan2(m.ty, m.tx) * 180 / Math.PI);
        h += viva ? mv({ tipo: 'osc', x, y, amp: .7, f: 2, fase: i, giro: g }, P('huso', 2.6)) : `<g transform="translate(${n2(x)} ${n2(y)}) rotate(${g})">${P('huso', 2.6, { hueco: true })}</g>`;
    });
    // las cadenas cortas: combustible de las células
    const nCad = D.disbiosis ? 1 : 5;
    for (let i = 0; i < nCad; i++) { const m = sitios[(i * 7 + 3) % sitios.length]; h += mv({ tipo: 'ruta', pts: [[m.x - m.nx * 12, m.y - m.ny * 12], [m.x + m.nx * 8, m.y + m.ny * 8]], s0: i / nCad, v: 0.35, desvanece: true }, P('cadena', 2.4)); }
    // los patógenos: sin sitio en el sano; sobrecrecidos en la disbiosis (①)
    const nP = D.patogenosIntestino, haloMR = D.mrHalo ? { halo: '--accent-red' } : {};
    for (let i = 0; i < nP; i++) {
        const rr = azar(200 + i);
        if (D.disbiosis) { const a = Math.PI * (0.15 + rr() * 0.7); h += mv({ tipo: 'osc', x: 206 + Math.cos(a) * (60 + rr() * 10), y: 84 - Math.sin(a) * (50 + rr() * 8), amp: 1.5, f: 1.6, fase: i, giro: Math.round(rr() * 180) }, P('bacilo', 3, haloMR)); }
        else h += mv({ tipo: 'deriva', x0: 70, x1: 140, y0: 28, y1: 120, sem: 300 + i, vel: 8 }, P('bacilo', 3, haloMR));
    }
    // translocación: por la rotura, al plexo y a la sangre
    if (D.translocacion) {
        const ruta = [[250, 74], [238, 82], [224, 110], [222, 160], [228, 214], [236, 250], [244, 272], [356, 272]];
        for (let i = 0; i < 3; i++) h += mv({ tipo: 'ruta', pts: ruta, s0: i / 3, v: 0.09, rot: true, desvanece: true }, D.disbiosis ? P('bacilo', 2.6) : P('cito', 2.8));
    }
    // los tres números de la Fig. 4.2
    const num = (n, y, txt, x2, y2) => D.numeros[n] ? `<line x1="276" y1="${y - 3}" x2="${x2}" y2="${y2}" style="stroke:var(--accent-blue)" stroke-width=".7"/><circle cx="276" cy="${y - 3}" r="6" style="fill:var(--accent-blue)"/>${T(276, y, n, { size: 8, anchor: 'middle', color: '--bg-main', peso: 700 })}${txt.map((l, k) => T(285, y + k * 9, l, { size: 7.5, color: '--accent-blue', peso: 600, plato: true })).join('')}` : '';
    h += num(1, 30, ['sobrecrecimiento'], 236, 40) + num(2, 64, ['rotura de', 'la mucosa'], 254, 74) + num(3, 108, ['aclaramiento', 'linfático alterado'], 210, 120);
    h += `<g data-toca="regla" data-regla="0,1 mm" role="button" aria-label="Regla: 0,1 mm"><rect x="66" y="164" width="108" height="50" fill="transparent"/><path d="M150 186 V191 M150 188.5 H172 M172 186 V191" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.6"/>${T(138, 191, '0,1 mm', { size: 8, color: '--accent-blue', anchor: 'end', peso: 700, plato: true })}</g>`;
    if (D.vasosCerrados) h += T(268, 160, 'simpático:', { size: 7.5, color: '--accent-red', peso: 700, plato: true }) + T(268, 170, 'vasos cerrados', { size: 7.5, color: '--accent-red', peso: 700, plato: true });
    return h;
}

/* ---- Boca: el epitelio y sus cerraduras ---- */
function boca(e, D) {
    let h = T(66, 17, 'BOCA · el epitelio y sus cerraduras' + diaTxt(e), { size: 7.5, color: '--accent-yellow', peso: 700 });
    const ys = 128;
    h += `<rect x="62" y="${ys}" width="262" height="130" style="fill:var(--bg-main)"/><rect x="62" y="${ys}" width="262" height="130" fill="url(#mur-p-punteado)"/>`;
    // epitelio plano (varias capas)
    for (let fila = 0; fila < 3; fila++) for (let x = 62 + (fila % 2) * 9; x < 322; x += 18) h += `<rect x="${x + 1}" y="${ys + fila * 13 + 1}" width="16" height="${fila === 2 ? 12 : 10}" rx="5" style="fill:var(--text-main);stroke:var(--accent-yellow)" fill-opacity=".1" stroke-opacity=".5" stroke-width=".5"/><circle cx="${x + 9}" cy="${ys + fila * 13 + 6}" r="1.3" style="fill:var(--accent-purple)" fill-opacity=".7"/>`;
    h += T(66, ys + 52, 'epitelio plano', { size: 7, color: '--text-dim', italic: true, plato: true });
    // capilar
    for (const y of [204, 216]) h += `<line x1="62" y1="${y}" x2="324" y2="${y}" style="stroke:var(--accent-red)" stroke-opacity=".7"/>`;
    for (let i = 0; i < 6; i++) h += mv({ tipo: 'ruta', pts: [[62, 210], [324, 210]], s0: i / 6, v: 0.09 }, P('rbc', 2.8));
    // tráquea
    h += `<path d="M330 22 V250 M350 22 V250" style="stroke:var(--accent-yellow)" stroke-opacity=".6"/>`;
    for (let y = 30; y < 250; y += 10) h += `<path d="M331 ${y} Q340 ${y + 4} 349 ${y}" style="fill:none;stroke:var(--accent-yellow)" stroke-opacity=".35"/>`;
    h += T(340, 17, 'tráquea', { size: 7, anchor: 'middle', color: '--text-dim', italic: true }) + T(340, 258, 'pulmón ↓', { size: 7, anchor: 'middle', color: '--text-dim', italic: true, plato: true });
    // las 10 cerraduras (proteínas de adhesión): 10 = 100 %
    const orden = [3, 7, 0, 5, 9, 1, 6, 2, 8, 4];
    const pegados = new Set(orden.slice(0, D.colonizadas));
    for (let i = 0; i < 10; i++) {
        const x = 76 + i * 26;
        const d = D.cerradurasCambiadas ? `M${x - 6} ${ys}V${ys - 8}H${x - 3.6}A3.6 3.6 0 0 0 ${x + 3.6} ${ys - 8}H${x + 6}V${ys}Z` : `M${x - 6} ${ys}V${ys - 8}H${x - 4}L${x} ${ys - 3}L${x + 4} ${ys - 8}H${x + 6}V${ys}Z`;
        h += `<path d="${d}" style="fill:var(--accent-blue);stroke:var(--bg-main)" stroke-width=".6" fill-opacity=".85"/>`;
        if (pegados.has(i) && !ocultos.has('cerraduras')) h += mv({ tipo: 'osc', x, y: ys - 14, amp: .5, f: 2, fase: i, giro: 90 }, P('bacilo', 3.6, D.bacilosVivos ? (e.sdd && e.mr ? { halo: '--accent-red' } : {}) : { hueco: true }));
    }
    h += T(66, ys + 66, ocultos.has('cerraduras') ? '10 cerraduras = 100 % · ?' : `10 cerraduras = 100 % · ${D.cerradurasCambiadas ? 'cambiadas: los bacilos se pegan' : 'no encajan con los bacilos'}`, { size: 7, color: '--accent-blue', peso: 600, plato: true });
    // la luz: saliva, cocos, anaerobios y bacilos libres
    const box = { x0: 70, x1: 318, y0: 30, y1: 104 };
    for (let i = 0; i < 6; i++) h += D.cocosVivos ? mv({ tipo: 'deriva', ...box, sem: 40 + i, vel: 7 }, P('coco', 2.6)) : (() => { const r = azar(40 + i); return `<g transform="translate(${n2(70 + r() * 248)} ${n2(30 + r() * 74)})">${P('coco', 2.6, { hueco: true })}</g>`; })();
    for (let i = 0; i < 6; i++) h += mv({ tipo: 'deriva', ...box, sem: 60 + i, vel: 6 }, P('huso', 2.8));
    const libres = D.cerradurasCambiadas ? 1 : 3;
    for (let i = 0; i < libres; i++) h += D.bacilosVivos ? mv({ tipo: 'deriva', ...box, y0: 70, sem: 80 + i, vel: 9 }, P('bacilo', 3.2)) : '';
    for (let i = 0; i < 3; i++) h += mv({ tipo: 'deriva', ...box, sem: 20 + i, vel: 4 }, P('agua', 2.6, { opacidad: .7 }));
    h += T(66, 29, 'saliva: 750 mL al día · 10⁶ microbios/mL', { size: 7.5, color: '--text-dim', italic: true, plato: true });
    // la gota que baja por la tráquea
    if (e.gota) {
        h += mv({ tipo: 'ruta', pts: [[190, 74], [300, 44], [340, 36], [340, 244]], s0: REDUCIR ? 0.62 : 0, v: 0.22, desvanece: true }, P('agua', 4.2));
        h += T(326, 52, ocultos.has('aspirar') ? '0,13 % → ?' : '0,13 % ≈ 1 mL → 10⁶ microbios', { size: 7.5, color: '--accent-red', anchor: 'end', peso: 700, plato: true });
    }
    h += `<rect data-toca="cerraduras" role="button" aria-label="Las cerraduras" x="62" y="${ys - 30}" width="262" height="52" fill="transparent"/>`;
    return h;
}

/* ---- La sangre, la figura viva y la rueda ---- */
function sangre(e, D) {
    let h = `<rect x="62" y="262" width="294" height="20" style="fill:var(--accent-red)" fill-opacity=".1"/><line x1="62" y1="262" x2="356" y2="262" style="stroke:var(--accent-red)" stroke-opacity=".75"/><line x1="62" y1="282" x2="356" y2="282" style="stroke:var(--accent-red)" stroke-opacity=".75"/>`;
    h += T(66, 275, 'la sangre', { size: 7.5, color: '--text-dim', italic: true, plato: true });
    for (let i = 0; i < 7; i++) h += mv({ tipo: 'ruta', pts: [[100, 272], [356, 272]], s0: i / 7, v: 0.08 }, P('rbc', 3));
    if (D.motor >= 1 && e.estacion === 'intestino') for (let i = 0; i < D.motor * 2; i++) h += mv({ tipo: 'ruta', pts: [[110, 268], [356, 276]], s0: i / (D.motor * 2) + .1, v: 0.06 }, P('cito', 2.6));
    if (D.translocacion && e.estacion === 'intestino') h += `<g data-toca="cateter" role="button" aria-label="Hacia la punta del catéter: vía 4"><rect x="226" y="238" width="134" height="56" fill="transparent"/>${T(354, 257, '→ punta del catéter · vía 4', { size: 7.5, anchor: 'end', color: '--accent-red', peso: 700, plato: true })}${T(354, 293, '(opinión del autor)', { size: 6.5, anchor: 'end', color: '--text-muted', italic: true })}</g>`;
    return h;
}

function plato(titulo, derecha) {
    return `<rect x="64" y="292" width="200" height="84" rx="8" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-opacity=".45"/>` + T(70, 303, titulo, { size: 7.5, color: '--accent-yellow', peso: 700 }) + (derecha ? T(258, 303, derecha, { size: 7.5, anchor: 'end', color: '--text-main', peso: 700 }) : '');
}
function figuraViva(e, D) {
    if (e.estacion === 'estomago' && D.balanza) {
        const f = D.fig46, q = v => Q('balanza', String(v).replace('.', ',') + ' %');
        let h = plato('Fig. 4.6 · la balanza');
        h += `<g data-toca="balanza" role="button" aria-label="Fig. 4.6: la balanza"><rect x="64" y="306" width="200" height="70" fill="transparent"/>`;
        h += `<path d="M164 368 L156 372 H172Z M164 334 V368" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" stroke-width="1.4"/>`;
        h += `<g id="mur-balanza-brazo"></g>`;
        h += T(164, 314, '', { size: 7.5, anchor: 'middle', color: '--text-dim', italic: true, extra: ' id="mur-balanza-fase"' });
        h += `</g>`;
        return h;
    }
    if (e.estacion === 'estomago') {
        const R = D.riesgo, orden = ['bajo', 'moderado', 'alto', 'maximo'];
        let h = plato('Tabla 4.2 · riesgo de sangrado', ocultos.has('riesgo') ? 'profilaxis: ?' : `profilaxis: ${R.profilaxis ? 'sí' : 'no'}`);
        h += `<g data-toca="escalera" role="button" aria-label="Tabla 4.2"><rect x="64" y="306" width="200" height="70" fill="transparent"/>`;
        orden.forEach((k, i) => {
            const x = 74 + i * 46, alto = 12 + i * 10, y = 368 - alto, aqui = R.nivel === k && !ocultos.has('riesgo');
            h += `<rect x="${x}" y="${y}" width="42" height="${alto}" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" fill-opacity="${aqui ? .45 : .1}" stroke-opacity=".7"/>`;
            h += T(x + 21, y - 11, NIVELES[k].nombre, { size: 8, anchor: 'middle', color: aqui ? '--text-main' : '--text-dim', peso: aqui ? 700 : 400 }) + T(x + 21, y - 2, NIVELES[k].pct, { size: 8, anchor: 'middle', color: '--text-muted' });
            if (aqui) h += `<path d="M${x + 15} ${y + 4} L${x + 27} ${y + 4} L${x + 21} ${y + 10}Z" style="fill:var(--accent-blue)"/>` + T(x + 21, y + 20, 'aquí', { size: 8, anchor: 'middle', color: '--accent-blue', peso: 700 });
        });
        h += `<line x1="164" y1="320" x2="164" y2="370" style="stroke:var(--accent-red)" stroke-dasharray="2 2"/>` + T(161, 318, 'corte', { size: 8, color: '--accent-red', italic: true, anchor: 'end' });
        return h + `</g>`;
    }
    if (e.estacion === 'intestino' && e.sdd) {
        const f = D.fig45; let h = plato('Fig. 4.5 · bacteriemias por BGN');
        [['Control', f.control], ['SOD', f.sod], ['SDD', f.sdd]].forEach(([nom, v], i) => {
            const x = 70 + i * 30, alto = v / 4.5 * 40, y = 360 - alto, hl = nom === 'SDD';
            h += `<rect x="${x}" y="${y}" width="22" height="${alto}" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" fill-opacity="${hl ? .5 : .15}"/>` + T(x + 11, y - 3, Q('fig45', String(v).replace('.', ',')), { size: 7.5, anchor: 'middle', color: '--text-main', peso: 700 }) + T(x + 11, 370, nom, { size: 7, anchor: 'middle', color: '--text-dim' });
        });
        h += T(111, 318, Q('fig45', '−33 %'), { size: 6.5, anchor: 'middle', color: '--accent-green', peso: 700 }) + T(141, 330, Q('fig45', '−67 %'), { size: 6.5, anchor: 'middle', color: '--accent-green', peso: 700 });
        // el reloj de la SDD (días 0-7)
        const X = d => 168 + d * 10;
        // la línea del día va debajo de los rótulos; «limpio: días 5-7» acaba antes del día 7 para no tacharse
        const dd = Math.min(7, e.dia);
        h += `<line x1="${n2(X(dd))}" y1="320" x2="${n2(X(dd))}" y2="358" style="stroke:var(--accent-blue)" stroke-width="1.4"/>`;
        h += T(164, 318, 'cefuroxima: días 1-4', { size: 6.4, color: '--accent-yellow', peso: 700 });
        h += `<rect x="${X(0)}" y="321" width="${n2(X(4) - X(0))}" height="5" style="fill:var(--accent-yellow)" fill-opacity=".55"/>`;
        h += T(164, 336, 'limpio: días 5-7', { size: 6.4, color: '--accent-green', peso: 700 });
        h += `<rect x="${X(5)}" y="339" width="${n2(X(7) - X(5))}" height="5" style="fill:var(--accent-green)" fill-opacity=".7"/>`;
        h += `<line x1="${X(0)}" y1="354" x2="${X(7)}" y2="354" style="stroke:var(--text-muted)" stroke-width=".6"/>`;
        for (let d = 0; d <= 7; d++) h += `<line x1="${n2(X(d))}" y1="351" x2="${n2(X(d))}" y2="357" style="stroke:var(--text-muted)" stroke-width=".6"/>` + ([0, 4, 7].includes(d) ? T(n2(X(d)), 365, d, { size: 6, anchor: 'middle', color: '--text-muted' }) : '');
        h += T(Math.min(n2(X(dd)), 252), 374, 'día ' + e.dia, { size: 6.8, color: '--accent-blue', peso: 700, anchor: 'middle' });
        return h;
    }
    if (e.estacion === 'intestino') {
        let h = plato('El motor del FMO', D.motor ? ['', 'gira', 'desbocado'][D.motor] : 'quieto');
        const pasos = ['① barrera rota', '② microbios o mediadores a la sangre', '③ inflamación sistémica', '④ simpático: cierra los vasos ↺'];
        pasos.forEach((p, i) => { h += T(72, 318 + i * 15, p, { size: 7.5, color: D.motor ? '--text-main' : '--text-muted', peso: D.motor ? 600 : 400 }); });
        return h;
    }
    // boca: Fig. 4.4
    let h = plato('Fig. 4.4 · BGN en la boca (aprox.)');
    [['sano', 2, 'sano', '~2-3'], ['alc', 45, 'alcoh.'], ['empl', 2, 'empl.', '~2-3'], ['planta', 37, 'planta'], ['uci', 70, 'UCI']].forEach(([k, v, nom, txt], i) => {
        const x = 74 + i * 38, alto = Math.max(1.5, v / 70 * 40), y = 358 - alto, hl = k === e.paciente;
        h += `<rect x="${x}" y="${y}" width="22" height="${alto}" style="fill:var(--accent-purple);stroke:${hl ? 'var(--accent-blue)' : 'var(--accent-purple)'}" fill-opacity="${hl ? .7 : .25}" stroke-width="${hl ? 2 : 1}"/>`;
        h += T(x + 11, y - 3, (ocultos.has('bgn') && hl) ? '?' : (txt || '~' + v), { size: 7.5, anchor: 'middle', color: '--text-main', peso: hl ? 700 : 400 }) + T(x + 11, 369, nom, { size: 6.8, anchor: 'middle', color: hl ? '--accent-blue' : '--text-dim', peso: hl ? 700 : 400 });
    });
    return h;
}

function rueda(e, D) {
    const cx = 310, cy = 336, R = 25;
    let h = `<g data-toca="rueda" role="button" aria-label="La rueda del motor del fallo multiorgánico"><rect x="268" y="290" width="88" height="90" fill="transparent"/>`;
    h += T(cx, 299, 'motor del FMO', { size: 7.5, anchor: 'middle', color: D.motor ? '--accent-red' : '--text-dim', peso: 700 });
    if (D.motor) h += `<circle cx="${cx}" cy="${cy}" r="${R + 6}" style="fill:var(--accent-red)" fill-opacity="${D.motor === 2 ? .18 : .08}"/>`;
    let g = `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:none;stroke:var(--accent-yellow)" stroke-opacity=".35" stroke-width="5"/>`;
    for (let i = 0; i < 4; i++) {
        const a0 = (-90 + i * 90 + 18) * Math.PI / 180, a1 = (-90 + i * 90 + 72) * Math.PI / 180;
        const P = a => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
        const [x0, y0] = P(a0), [x1, y1] = P(a1);
        const tx = -Math.sin(a1), ty = Math.cos(a1);
        g += `<path d="M${n2(x0)} ${n2(y0)} A${R} ${R} 0 0 1 ${n2(x1)} ${n2(y1)}" style="fill:none;stroke:var(--accent-${D.motor ? 'red' : 'yellow'})" stroke-width="1.8"/>`;
        g += `<path d="M${n2(x1 + tx * 4 - Math.cos(a1) * 3)} ${n2(y1 + ty * 4 - Math.sin(a1) * 3)} L${n2(x1 + tx * 1)} ${n2(y1 + ty * 1)} L${n2(x1 + tx * 4 + Math.cos(a1) * 3)} ${n2(y1 + ty * 4 + Math.sin(a1) * 3)}" style="fill:none;stroke:var(--accent-${D.motor ? 'red' : 'yellow'})" stroke-width="1.6"/>`;
    }
    const nodo = (a, contenido) => { const r = a * Math.PI / 180, x = cx + R * Math.cos(r), y = cy + R * Math.sin(r); return `<circle cx="${n2(x)}" cy="${n2(y)}" r="7" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width=".8"/><g transform="translate(${n2(x)} ${n2(y)})">${contenido}</g>`; };
    g += nodo(-90, `<rect x="-5" y="-3" width="4" height="6" style="fill:var(--text-main)" fill-opacity=".6"/><rect x="1.5" y="-3" width="4" height="6" style="fill:var(--text-main)" fill-opacity=".6"/>`);
    g += nodo(0, P('bacilo', 2.2));
    g += nodo(90, P('cito', 2.8));
    g += nodo(180, `<path d="M-5 -3 L5 -1 M-5 3 L5 1" style="stroke:var(--accent-red)" stroke-width="1.2"/>`);
    h += D.motor ? mv({ tipo: 'rueda', cx, cy, vel: D.motor === 2 ? 0.45 : 0.12 }, g) : g;
    h += T(cx, cy + 3, 'FMO', { size: 8, anchor: 'middle', color: D.motor ? '--accent-red' : '--text-muted', peso: 700 });
    h += T(cx, 377, ['quieta', 'gira', 'a toda velocidad'][D.motor], { size: 7, anchor: 'middle', color: D.motor ? '--accent-red' : '--text-muted', italic: true });
    return h + `</g>`;
}

const diaTxt = e => (e.dia || e.sdd) ? ' · día ' + e.dia : '';
export function pintarLamina() {
    descriptores = [];
    const e = estado;
    let h = DEFS + `<rect width="360" height="380" style="fill:var(--bg-main)"/>`;
    h += `<g data-estacion="${e.estacion}">`;
    h += e.estacion === 'estomago' ? estomago(e, D) : e.estacion === 'intestino' ? intestino(e, D) : boca(e, D);
    h += sangre(e, D) + figuraViva(e, D) + rueda(e, D) + tira(e, D);
    h += `</g>`;
    const svg = $('lamina'); svg.innerHTML = h;
    movibles = [...svg.querySelectorAll('[data-mv]')].map(el => Object.assign(descriptores[+el.dataset.mv], { el }));
    for (const m of movibles) colocar(m);
    if (D.balanza && e.estacion === 'estomago') Balanza.pintar();
}

/* La balanza de la Fig. 4.6: primero solo el sangrado (se inclina), después con los riesgos (no se inclina) */
export const Balanza = {
    fase: 1, anim: null,
    pintar() {
        const brazo = $('balanza-brazo'); if (!brazo) return;
        const f = D.fig46, cx = 164, cy = 334, L = 62;
        const dibujar = (ang, fase) => {
            const a = ang * Math.PI / 180, xl = cx - L * Math.cos(a), yl = cy - L * Math.sin(a), xr = cx + L * Math.cos(a), yr = cy + L * Math.sin(a);
            const izq = fase ? f.pantoTotal : f.pantoSangrado, der = fase ? f.placeboTotal : f.placeboSangrado;
            const v = x => ocultos.has('balanza') ? '?' : String(x).replace('.', ',') + ' %';
            const pan = (x, y, nom, val) => `<line x1="${n2(x)}" y1="${n2(y)}" x2="${n2(x - 12)}" y2="${n2(y + 16)}" style="stroke:var(--accent-yellow)" stroke-width=".7"/><line x1="${n2(x)}" y1="${n2(y)}" x2="${n2(x + 12)}" y2="${n2(y + 16)}" style="stroke:var(--accent-yellow)" stroke-width=".7"/><path d="M${n2(x - 16)} ${n2(y + 16)} Q${n2(x)} ${n2(y + 26)} ${n2(x + 16)} ${n2(y + 16)}Z" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" fill-opacity=".25"/>${T(n2(x), n2(y + 22), val, { size: 7.5, anchor: 'middle', color: '--text-main', peso: 700 })}${T(n2(x), n2(y - 4), nom, { size: 6.8, anchor: 'middle', color: '--text-dim' })}`;
            brazo.innerHTML = `<line x1="${n2(xl)}" y1="${n2(yl)}" x2="${n2(xr)}" y2="${n2(yr)}" style="stroke:var(--accent-yellow)" stroke-width="2.4" stroke-linecap="round"/>` + pan(xl, yl, 'pantoprazol', v(izq)) + pan(xr, yr, 'placebo', v(der));
            const ft = $('balanza-fase');
            if (ft) ft.innerHTML = fase ? (ocultos.has('balanza') ? 'sangrado + neumonía + <tspan font-style="italic">C. difficile</tspan> + isquemia' : 'con los riesgos: <tspan style="fill:var(--accent-purple);font-weight:700;font-style:normal">sin beneficio neto</tspan>') : 'solo el sangrado: −1,7 %';
        };
        const angSolo = 9, angTodo = n2((f.placeboTotal - f.pantoTotal) / f.placeboTotal * 30);   // inclinación proporcional a la diferencia (ilustrativo)
        if (this.anim) { this.anim.stop?.(); this.anim = null; }
        if (REDUCIR || !window.Motion || this.fase === 1 && this.quieta) { dibujar(angTodo, 1); return; }
        dibujar(angSolo, 0);
        this.anim = window.Motion.animate(angSolo, angTodo, { delay: 1.6, duration: 1.2, ease: 'easeInOut', onUpdate: v => dibujar(v, 1) });
    },
    quieta: false
};

const ORG = t => `<span class="mur-o${/ilustrativ/.test(t) && !/mar-|Fig|Tabla/.test(t) ? ' mur-ilu' : ''}">${chipTxt(t)}</span>`;
export function pintarTablero() {
    const e = estado, c = [];
    const celda = (k, clave, valor, origen, tono = '') => c.push(`<div class="mur-celda"><span class="mur-k">${k}</span><b class="${ocultos.has(clave) ? '' : tono ? 'mur-' + tono : ''}">${Q(clave, valor)}</b>${ORG(origen)}</div>`);
    if (e.estacion === 'estomago') {
        const R = D.riesgo;
        celda('Riesgo · Tabla 4.2', 'riesgo', `${R.nombre} · ${R.pct}`, 'ficha · mar-tabla-4-2', R.profilaxis ? 'alarma' : 'bien');
        celda('pH de la luz', 'ph', D.ph + (D.phSube ? ' ↑' : ''), D.phSube ? 'ficha · mar-enteral-protege' : 'ficha · mar-profilaxis-uso', D.supresor ? 'alarma' : '');
        celda('<i>Salmonella</i> · Fig. 4.3', 'salmonella', { muere: 'muere en 1 h', crece: 'crece', 'sin cifra': 'sin cifra' }[D.salmonella], 'ficha · mar-fig-4-3', D.salmonella === 'crece' ? 'alarma' : D.salmonella === 'muere' ? 'bien' : '');
    } else if (e.estacion === 'intestino') {
        celda('Flora residente', 'flora', D.disbiosis ? 'disbiosis' : 'en todos los huecos', 'ficha · mar-disbiosis', D.disbiosis ? 'alarma' : 'bien');
        if (e.sdd) celda('SDD · día ' + e.dia, 'barrera', D.sddEfecto ? (D.patogenosIntestino ? `quedan ${D.patogenosIntestino} patógenos` : 'patógenos fuera') : 'sin efecto: multirresistentes', 'ficha · mar-sdd · ritmo ilustrativo', D.sddEfecto ? 'bien' : 'alarma');
        else celda('Barrera', 'barrera', D.translocacion ? 'rota: translocación' : 'íntegra', 'ficha · mar-disbiosis · mar-motor-fmo', D.translocacion ? 'alarma' : 'bien');
        celda('Motor del FMO', 'motor', ['quieto', 'gira', 'a toda velocidad'][D.motor], 'ficha · mar-motor-fmo · velocidad ilustrativa', D.motor ? 'alarma' : '');
    } else {
        celda('BGN en la boca · Fig. 4.4', 'bgn', (D.bgnPct === 2 ? '~2-3' : '~' + D.bgnPct) + ' %', 'ficha · mar-fig-4-4 (aprox.)', D.bgnPct > 10 ? 'alarma' : 'bien');
        celda('Cerraduras', 'cerraduras', D.cerradurasCambiadas ? 'cambiadas' : 'normales', 'ficha · mar-colonizacion-orofaringe', D.cerradurasCambiadas ? 'alarma' : 'bien');
        celda('Aspirar el 0,13 %', 'aspirar', '≈ 10⁶ microbios', 'ficha · mar-saliva');
    }
    $('tablero').innerHTML = c.join('');
    // consecuencias
    const ch = [];
    if (D.supresor) { ch.push(['r', e.proteccion === 'pantoprazol' ? '<i>C. difficile</i> ×3 con IBP' : '<i>C. difficile</i>: más riesgo (menos que con IBP)']); ch.push(['r', 'más neumonía: el jugo se coloniza y se aspira']); }
    if (D.famotidinaMitad) ch.push(['r', 'famotidina: −50 % (ClCr &lt;50)']);
    if (e.proteccion === 'sucralfato') ch.push(['v', 'sucralfato: menos neumonía que los supresores']);
    if (e.estacion === 'estomago' && (e.corticoides || e.anticoag)) ch.push(['', 'corticoides y anticoagulación: riesgo bajo, no mueven nada']);
    if (D.probiotico) ch.push([e.probiotico === 'temprano' ? 'v' : 'r', 'probiótico: ' + D.probiotico + (e.probiotico === 'temprano' ? ' (19 estudios)' : '')]);
    if (e.sdd) ch.push(D.sddEfecto ? ['v', 'SDD: bacteriemias por BGN −67 %'] : ['r', 'multirresistentes: la SDD pierde el efecto']);
    if (e.estacion === 'boca' && e.descontaminacion === 'clorhexidina') ch.push(['r', 'clorhexidina: las guías de NAV retiraron la recomendación']);
    if (e.estacion === 'boca' && e.descontaminacion === 'sod') ch.push(['v', 'SOD: bacteriemias por BGN −33 %']);
    if (e.estacion === 'boca' && e.mr && !e.sdd) ch.push(['', 'multirresistentes y SOD: la ficha no lo dice (hueco)']);
    $('consec').innerHTML = ch.map(([k, t]) => `<span class="${k ? 'mur-' + k : ''}">${t}</span>`).join('');
}

/* ============================================================
   Anillo dorado sobre lo que hay que mirar
   ============================================================ */
export const ANCLAS = { regla: { estomago: [92, 160], intestino: [160, 188] }, moco: [200, 128], lesion: [290, 160], gauge: [330, 64], tira: [31, 200], rueda: [310, 336],
    vellosidad: [206, 90], galt: [102, 246], cerraduras: [190, 118], traquea: [340, 140], balanza: [164, 340], escalera: [164, 340], fig45: [130, 340], fig44: [160, 340],
    sangre: [200, 272], cateter: [320, 262], capilar: [200, 208], superficie: [150, 120], salmonella: [160, 70], numeros: [290, 70], luz: [160, 60] };
let anilloAnim = null;
export let anilloObj = null;
export function anillo(obj) {
    const a = $('anillo'); anilloObj = obj;
    if (anilloAnim) { anilloAnim.stop?.(); anilloAnim = null; }
    if (!obj || !ANCLAS[obj]) { a.hidden = true; return; }
    let p = ANCLAS[obj]; if (!Array.isArray(p)) p = p[estado.estacion] || Object.values(p)[0];
    const svg = $('lamina'), r = svg.getBoundingClientRect(), r0 = $('escena').getBoundingClientRect();
    const s = Math.min(r.width / 360, r.height / 380), ox = (r.width - 360 * s) / 2, oy = (r.height - 380 * s) / 2;
    a.style.left = n2(r.left - r0.left + ox + p[0] * s) + 'px'; a.style.top = n2(r.top - r0.top + oy + p[1] * s) + 'px'; a.hidden = false;
    if (!REDUCIR && window.Motion) anilloAnim = window.Motion.animate(a, { transform: ['scale(0.85)', 'scale(1.12)', 'scale(0.85)'], opacity: [0.95, 0.5, 0.95] }, { duration: 1.4, repeat: Infinity, ease: 'easeInOut' });
}

/* ============================================================
   Arranque de la escena
   ============================================================ */
export function initEscena() {
    REDUCIR = sinMovimiento();
    pintarLamina(); pintarTablero();
}
