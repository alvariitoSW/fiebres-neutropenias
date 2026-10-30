// El telar de la trombina: la escena viva (la lámina en grabado). A la izquierda, la pierna de lado con la femoral y la
// arteria transparentes (ahí se forman los trombos, «silentes hasta que embolizan»), sus mangas (medias o CNI) y el
// filtro de cava; a la derecha, la lupa sobre el bolsillo de una válvula, con tres vistas: el telar (la Fig. 5.2 hecha
// máquina: el Xa, la protrombina, la trombina que teje la red de fibrina, la antitrombina y las cadenas de heparina),
// la plaqueta de la TIH (FP4 e IgG) y el reloj neuroaxial. Abajo, el riñón y su vaso (el veredicto renal de la
// calculadora de la ficha). Además: el tablero de lecturas, el anillo dorado y el bucle de dibujo.
//
// Un solo estado (`estado`: la hoja de órdenes) y lo que se deriva de él (`D`, con derivar() de
// js/data/telar-vivo-data.js). La interfaz y la capa de estudio viven en telar-vivo.js. Viene de la maqueta aprobada
// autonomo/maquetas/b1-telar.html (vuelta 2), con los rótulos a 8 px o más (juicio, §7.7).
// Las partículas salen de js/core/particulas.js (tabla única de formas). Rendimiento: el bucle solo corre con la
// lámina a la vista; con «reducir movimiento» se pinta el estado final. Todos los ids llevan el prefijo tel-.
import { svgParticula } from '../../core/particulas.js';
import { sinMovimiento } from '../../core/motion.js';
import { construirEco, pintarEco, sincronizarEco, tableroEco } from './telar-vivo-tvp.js';
import { estadoBase, derivar, chipTxt, clamp, ES_HBPM, ES_HEPARINA, CUENTAS, CNI, NEURO, NEURO_NOMBRE, ORDEN_NEURO } from '../../data/telar-vivo-data.js';

export const $ = id => document.getElementById('tel-' + id);
const n2 = x => +x.toFixed(2);
const lerp = (a, b, u) => a + (b - a) * u;
const hashN = (i, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };   // pseudoazar fijo
export let REDUCIR = false;
const SVGNS = 'http://www.w3.org/2000/svg';
// La partícula de la tabla única, centrada en (x, y) y girada (grados)
const P = (clave, x, y, r, { rot, ...opc } = {}) => rot ? `<g transform="translate(${n2(x)} ${n2(y)}) rotate(${rot})">${svgParticula(clave, 0, 0, r, opc)}</g>` : svgParticula(clave, x, y, r, opc);
// Un rótulo de la lámina: nunca por debajo de 8 px. `plato`: fondo para que se lea sobre lo que se mueve.
const T = (x, y, txt, { s = 8, c = 'text-muted', a = 'start', i = true, w = '', id = '', plato = false } = {}) => {
    const fs = Math.max(9.3, s);
    const tt = `<text${id ? ` id="tel-${id}"` : ''} x="${n2(x)}" y="${n2(y)}" font-size="${fs}" text-anchor="${a}" style="fill:var(--${c});font-family:Georgia,serif${i ? ';font-style:italic' : ''}${w ? ';font-weight:' + w : ''}">${txt}</text>`;
    if (!plato) return tt;
    const ancho = String(txt).replace(/<[^>]+>/g, '').length * fs * 0.5 + 6, x0 = a === 'end' ? x - ancho + 3 : a === 'middle' ? x - ancho / 2 : x - 3;
    return `<rect x="${n2(x0)}" y="${n2(y - fs)}" width="${n2(ancho)}" height="${n2(fs * 1.35)}" rx="2" style="fill:var(--bg-main)" fill-opacity=".84"/>` + tt;
};

/* ============================================================
   Estado (solo esta pieza lo cambia, con aplicarModelo)
   ============================================================ */
export let estado = estadoBase();
export let D = derivar(estado);
export const ocultos = new Set();   // cifras tapadas con «?» hasta contestar
const Q = (k, v) => ocultos.has(k) ? '?' : v;
// La interfaz pinta lo suyo (la caja de la calculadora) después de cada repintado
export const ganchos = { despues: null };

/* ============================================================
   Geometría: la femoral de la pierna (4 curvas cúbicas) y la lupa
   ============================================================ */
const VENA_PIERNA = 'M58 300 C60 272 55 242 57 212 C59 188 62 172 62 150 C62 124 62 94 64 62 C65 42 68 24 70 2';
const TRAMOS = [[[58, 300], [60, 272], [55, 242], [57, 212]], [[57, 212], [59, 188], [62, 172], [62, 150]], [[62, 150], [62, 124], [62, 94], [64, 62]], [[64, 62], [65, 42], [68, 24], [70, 2]]];
function bezier(p0, p1, p2, p3, u) { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); }
// Puntos de la vena con su longitud acumulada: se recorre por longitud (sin medir el DOM, que puede estar oculto)
const VENA = (() => {
    const pts = []; for (const t of TRAMOS) for (let k = pts.length ? 1 : 0; k <= 40; k++) pts.push(bezier(...t, k / 40));
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, L, tot: L[L.length - 1] };
})();
function venaEn(u) {
    const d = clamp(u, 0, 1) * VENA.tot; let i = 1;
    while (i < VENA.L.length - 1 && VENA.L[i] < d) i++;
    const f = (d - VENA.L[i - 1]) / ((VENA.L[i] - VENA.L[i - 1]) || 1), a = VENA.pts[i - 1], b = VENA.pts[i];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}
const LUPA = { cx: 236, cy: 146, r: 114 };
const VALV = [62, 118];                     // la válvula que se amplía
// dónde cae la válvula ampliada a lo largo de la femoral (de ahí sale el émbolo)
const U_VALV = (() => { let mejor = 0, dm = 1e9; for (let i = 0; i <= 200; i++) { const p = venaEn(i / 200); const d = Math.abs(p[1] - VALV[1]); if (d < dm) { dm = d; mejor = i / 200; } } return mejor; })();
// las paredes de la vena en la lupa (luz entre 160 y 312; senos de la válvula a 144 y 328)
const PARED_IZQ = 'M160 20 L160 116 C160 136 144 146 144 172 C144 198 158 206 162 214 L162 276';
const PARED_DER = 'M312 20 L312 116 C312 136 328 146 328 172 C328 198 314 206 310 214 L310 276';
const VALVA_IZQ = 'M162 214 C182 200 210 170 222 128 C216 172 190 206 166 222 Z';
const VALVA_DER = 'M310 214 C290 200 262 170 250 128 C256 172 282 206 306 222 Z';
const XA = [236, 62], II = [196, 50], IIA0 = [172, 178];
const LEG = 'M22 6 L104 6 C108 40 104 80 94 116 C88 140 84 156 84 172 C86 196 92 214 88 238 C85 258 76 272 72 288 L112 296 C120 300 120 312 110 316 L46 318 C38 316 36 306 42 292 C40 276 34 258 32 236 C30 214 36 196 36 172 C36 152 28 132 24 108 C20 80 18 40 22 6 Z';

/* ============================================================
   La lámina: la pierna (izquierda), la lupa (derecha) y el riñón (abajo). Se construye una vez; luego se cambian
   sus partes.
   ============================================================ */
const DEFS = `<defs>
    <pattern id="tel-p-rayado" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-yellow)" stroke-opacity=".28" stroke-width=".7"/></pattern>
    <pattern id="tel-p-rayado-fino" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="2.6" style="stroke:var(--text-dim)" stroke-opacity=".22" stroke-width=".5"/></pattern>
    <pattern id="tel-p-punteado" width="7" height="6" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.5" r=".7" style="fill:var(--text-dim)" fill-opacity=".3"/><circle cx="5.1" cy="4.4" r=".55" style="fill:var(--text-dim)" fill-opacity=".24"/></pattern>
    <pattern id="tel-p-cruzado" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0L6 6M6 0L0 6" style="stroke:var(--text-muted)" stroke-opacity=".2" stroke-width=".5"/></pattern>
    <radialGradient id="tel-g-vineta" cx="50%" cy="50%" r="72%"><stop offset="55%" style="stop-color:var(--bg-main)" stop-opacity="0"/><stop offset="100%" style="stop-color:var(--bg-main)" stop-opacity=".85"/></radialGradient>
    <linearGradient id="tel-g-piel" x1="0" x2="1" y1="0" y2="0"><stop offset="0" style="stop-color:var(--text-dim)" stop-opacity=".2"/><stop offset=".55" style="stop-color:var(--text-dim)" stop-opacity=".06"/><stop offset="1" style="stop-color:var(--text-dim)" stop-opacity=".16"/></linearGradient>
    <clipPath id="tel-clip-lupa"><circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r - 1}"/></clipPath>
    <clipPath id="tel-clip-pierna"><path d="${LEG}"/></clipPath>
  </defs>`;
const Anim = { rbc: [], rbcPierna: [], at: [], hilos: [], presos: [], red: 0, reloj: 0, cniFase: 0, embolos: [], atrapados: 0, ep: 0, tihT: 0, spool: 0, iiaFase: 0, lisisFase: 0, atT: 1, xaAng: 0, iia: null };
function construirLamina() {
    const svg = $('lamina');
    const somb = [];
    for (let y = 12; y < 300; y += 5) somb.push(`<line x1="${n2(y < 170 ? 26 + (y / 170) * 6 : 34 + Math.sin(y / 30) * 2)}" y1="${y}" x2="${n2(y < 170 ? 40 + (y / 170) * 6 : 44)}" y2="${y + 2}" style="stroke:var(--text-dim)" stroke-opacity=".2" stroke-width=".6"/>`);
    const valvulas = [[57, 262], [57, 212], [62, 166], [63, 72]].map(([x, y]) => `<path d="M${x - 3.5} ${y + 3} L${x} ${y - 2} L${x + 3.5} ${y + 3}" style="fill:none;stroke:var(--text-main)" stroke-width=".8" opacity=".75"/>`).join('');
    const a1 = Math.PI - 0.62, a2 = Math.PI + 0.62;
    const p1 = [LUPA.cx + LUPA.r * Math.cos(a1), LUPA.cy - LUPA.r * Math.sin(a1)], p2 = [LUPA.cx + LUPA.r * Math.cos(a2), LUPA.cy - LUPA.r * Math.sin(a2)];
    svg.innerHTML = `${DEFS}
  <rect width="360" height="330" style="fill:var(--bg-main)"/>
  <rect width="360" height="330" fill="url(#tel-p-punteado)" opacity=".5"/>
  <g id="tel-g-pierna">
    <path d="${LEG}" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width="1"/>
    <path d="${LEG}" fill="url(#tel-g-piel)"/>
    <g clip-path="url(#tel-clip-pierna)">${somb.join('')}</g>
    <path d="M40 168 Q60 162 82 170" style="fill:none;stroke:var(--text-muted)" stroke-width=".6" opacity=".7"/>
    <ellipse cx="60" cy="170" rx="9" ry="6" style="fill:none;stroke:var(--text-muted)" stroke-width=".6" opacity=".6"/>
    <path id="tel-arteria" d="M50 300 C50 272 46 242 48 212 C50 188 52 172 52 150 C52 124 53 94 55 62 C56 42 58 24 60 2" style="fill:none;stroke:var(--accent-red)" stroke-width="1.6" opacity=".5"/>
    <path d="${VENA_PIERNA}" style="fill:none;stroke:var(--accent-purple)" stroke-width="5.5" stroke-linecap="round" opacity=".55"/>
    <path d="${VENA_PIERNA}" style="fill:none;stroke:var(--bg-main)" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    ${valvulas}
    <g id="tel-g-mangas"></g>
    <g id="tel-g-rbc-pierna"></g>
    <g id="tel-g-embolo-pierna"></g>
    <g id="tel-g-filtro" display="none">
      <path d="M62 26 L70 8 L78 26 M66 26 L70 8 L74 26" style="fill:none;stroke:var(--text-main)" stroke-width=".9"/>
      <circle cx="70" cy="8" r="1.4" style="fill:var(--text-main)"/>
      ${T(82, 22, 'filtro de VCI', { c: 'text-main', i: false, w: 600, plato: true })}
    </g>
    ${T(76, 9, '↑ cava', { c: 'text-dim' })}
    ${T(4, 326, 'pierna, de lado', { c: 'text-muted' })}
    ${T(72, 46, 'femoral', { c: 'accent-purple', w: 600 })}
    <text id="tel-rot-arteria" x="52" y="46" font-size="9.3" text-anchor="end" style="fill:var(--accent-red);font-family:Georgia,serif;font-style:italic">arteria</text>
  </g>
  <path d="M${VALV[0] + 4} ${VALV[1] - 4} L${n2(p1[0])} ${n2(p1[1])} M${VALV[0] + 4} ${VALV[1] + 4} L${n2(p2[0])} ${n2(p2[1])}" style="stroke:var(--accent-blue)" stroke-width=".7" stroke-dasharray="3 2" opacity=".75"/>
  <circle cx="${VALV[0]}" cy="${VALV[1]}" r="7" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.2"/>
  <g id="tel-lupa">
    <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r + 5}" style="fill:var(--bg-main)"/>
    <g clip-path="url(#tel-clip-lupa)">
      <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r}" style="fill:var(--bg-main)"/>
      <g id="tel-v-telar"></g><g id="tel-v-tih" display="none"></g><g id="tel-v-reloj" display="none"></g><g id="tel-v-eco" display="none"></g>
      <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r}" fill="url(#tel-g-vineta)" pointer-events="none"/>
    </g>
    <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r}" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.4"/>
    <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r + 3.5}" style="fill:none;stroke:var(--accent-blue)" stroke-width=".7"/>
  </g>
  <g id="tel-g-rinon"></g>
  <rect data-toca="pierna" role="button" aria-label="La pierna y la femoral" x="0" y="0" width="122" height="330" fill="transparent"/>
  <circle data-toca="lupa" role="button" aria-label="La lupa" cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r}" fill="transparent"/>
  <rect data-toca="rinon" role="button" aria-label="El riñón y la dosis" x="124" y="266" width="236" height="64" fill="transparent"/>`;
    construirTelar(); construirTih(); construirReloj(); construirEco();
    const gp = $('g-rbc-pierna');
    for (let i = 0; i < 10; i++) { const g = document.createElementNS(SVGNS, 'g'); g.innerHTML = svgParticula('rbc', 0, 0, 1.9); gp.appendChild(g); Anim.rbcPierna.push({ el: g, u: i / 10 }); }
}

/* ---------- El telar, dentro de la lupa ---------- */
function cadenaPath(n, x0, y0, ang, curva, paso = 4.3) {
    const pts = []; let x = x0, y = y0, a = ang;
    for (let i = 0; i < n; i++) { pts.push([x, y]); a += curva; x += Math.cos(a) * paso; y += Math.sin(a) * paso; }
    return pts;
}
// Un collar de cuentas (la heparina): la forma «heparina» de la tabla es su icono; aquí cada cuenta es una bolita
const cuentasSVG = (pts, r = 1.9) => `<path d="M${pts.map(p => p.map(n2).join(' ')).join('L')}" style="fill:none;stroke:var(--accent-purple)" stroke-width=".7" opacity=".7"/>` + pts.map(([x, y]) => `<circle cx="${n2(x)}" cy="${n2(y)}" r="${r}" style="fill:var(--accent-purple);stroke:var(--bg-main)" stroke-width=".6"/>`).join('');
const xRoja = (x, y, k = 1) => `<g transform="translate(${n2(x)} ${n2(y)}) scale(${k})"><path d="M-5 -5 L5 5 M5 -5 L-5 5" style="stroke:var(--bg-main)" stroke-width="4.2" stroke-linecap="round"/><path d="M-5 -5 L5 5 M5 -5 L-5 5" style="stroke:var(--accent-red)" stroke-width="2.2" stroke-linecap="round"/></g>`;
export const llave = (x, y, rot = 0, k = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})"><circle cx="-9" cy="0" r="4.2" style="fill:none;stroke:var(--text-main)" stroke-width="1.6"/><path d="M-5 0 L8 0 M4 0 L4 4 M7 0 L7 3.4" style="fill:none;stroke:var(--text-main)" stroke-width="1.6" stroke-linecap="round"/></g>`;
export function engranaje(r, dientes = 10) {
    let d = '';
    for (let i = 0; i < dientes * 2; i++) { const a = i * Math.PI / dientes, rr = i % 2 ? r : r + 3.2; d += `${i ? 'L' : 'M'}${n2(Math.cos(a) * rr)} ${n2(Math.sin(a) * rr)}`; }
    return d + 'Z';
}
export const xRojaIcono = () => xRoja(0, 0, 0.9);
function construirTelar() {
    const g = $('v-telar');
    // los hilos posibles de la red, en los dos bolsillos (umbral de aparición fijo, pseudoazar)
    const hilos = [];
    const bolsillo = lado => {
        const X = x => lado === 'izq' ? x : 472 - x;
        const pared = [], valva = [];
        for (let i = 0; i <= 8; i++) { const y = 142 + (i / 8) * 72; const xw = 160 - 16 * Math.sin(Math.PI * clamp((y - 120) / 96, 0, 1)); pared.push([X(xw + 1.5), y]); }
        for (let i = 0; i <= 8; i++) { const y = 134 + (i / 8) * 84; const xv = 220 - (y - 134) * 0.62; valva.push([X(xv), y]); }
        const n = lado === 'izq' ? 34 : 22;
        for (let k = 0; k < n; k++) {
            const a = Math.floor(hashN(k, lado === 'izq' ? 3 : 7) * 9), b = clamp(a + Math.floor(hashN(k, 5) * 5) - 2, 0, 8);
            const p = hashN(k, 11) < 0.7 ? [pared[a], valva[b]] : hashN(k, 13) < 0.5 ? [pared[a], pared[clamp(a + 2, 0, 8)]] : [valva[a], valva[clamp(b + 2, 0, 8)]];
            const umbral = (lado === 'izq' ? 0.02 : 0.18) + 0.78 * (k / n);
            const c = [(p[0][0] + p[1][0]) / 2 + (hashN(k, 17) - 0.5) * 8, (p[0][1] + p[1][1]) / 2 + (hashN(k, 19) - 0.5) * 8];
            hilos.push({ p0: p[0], c, p1: p[1], d: `M${n2(p[0][0])} ${n2(p[0][1])} Q${n2(c[0])} ${n2(c[1])} ${n2(p[1][0])} ${n2(p[1][1])}`, umbral });
        }
        const presos = [];
        for (let k = 0; k < (lado === 'izq' ? 9 : 6); k++) {
            const y = 152 + hashN(k, lado === 'izq' ? 23 : 29) * 58, xw = 160 - 16 * Math.sin(Math.PI * clamp((y - 120) / 96, 0, 1)), xv = 220 - (y - 134) * 0.62;
            const x = xw + 6 + hashN(k, 31) * Math.max(4, xv - xw - 12);
            presos.push({ x: X(x), y, umbral: (lado === 'izq' ? 0.2 : 0.35) + 0.6 * (k / 9), rot: Math.round(hashN(k, 37) * 180) });
        }
        return presos;
    };
    const presos = [...bolsillo('izq'), ...bolsillo('der')];
    Anim.hilos = hilos; Anim.presos = presos;
    const tejido = [];
    for (let y = 24; y < 272; y += 4.5) { tejido.push(`<line x1="118" y1="${y}" x2="142" y2="${y - 6}" style="stroke:var(--text-muted)" stroke-opacity=".22" stroke-width=".5"/>`); tejido.push(`<line x1="330" y1="${y}" x2="354" y2="${y - 6}" style="stroke:var(--text-muted)" stroke-opacity=".22" stroke-width=".5"/>`); }
    g.innerHTML = `
    <rect x="118" y="28" width="240" height="240" fill="url(#tel-p-punteado)" opacity=".7"/>
    ${tejido.join('')}
    <path d="${PARED_IZQ} L310 276 L310 214 C314 206 328 198 328 172 C328 146 312 136 312 116 L312 20 Z" style="fill:var(--accent-purple)" opacity=".1"/>
    <path d="${PARED_IZQ}" style="fill:none;stroke:var(--text-muted)" stroke-width="14" opacity=".14" transform="translate(-7 0)"/>
    <path d="${PARED_DER}" style="fill:none;stroke:var(--text-muted)" stroke-width="14" opacity=".14" transform="translate(7 0)"/>
    <path d="${PARED_IZQ}" style="fill:none;stroke:var(--text-dim)" stroke-width="1.4"/>
    <path d="${PARED_DER}" style="fill:none;stroke:var(--text-dim)" stroke-width="1.4"/>
    <path d="${PARED_IZQ}" style="fill:none;stroke:var(--text-dim)" stroke-width=".5" stroke-dasharray="1 2.6" transform="translate(-5 0)"/>
    <path d="${PARED_DER}" style="fill:none;stroke:var(--text-dim)" stroke-width=".5" stroke-dasharray="1 2.6" transform="translate(5 0)"/>
    <g id="tel-g-cito"></g>
    <g id="tel-g-red">${hilos.map((h, i) => `<path id="tel-hilo${i}" d="${h.d}" style="fill:none;stroke:var(--accent-yellow)" stroke-width=".9" opacity=".85" display="none"/>`).join('')}</g>
    <g id="tel-g-presos">${presos.map((p, i) => `<g id="tel-preso${i}" display="none">${P('rbc', p.x, p.y, 3.4, { rot: p.rot })}</g>`).join('')}</g>
    <g id="tel-g-lisis">${Array.from({ length: 10 }, (_, i) => `<circle id="tel-lisis${i}" r="1.8" style="fill:var(--accent-green);stroke:var(--bg-main)" stroke-width=".5" display="none"/>`).join('')}</g>
    <path d="${VALVA_IZQ}" style="fill:var(--text-main);stroke:var(--text-dim)" stroke-width=".8" opacity=".55"/>
    <path d="${VALVA_DER}" style="fill:var(--text-main);stroke:var(--text-dim)" stroke-width=".8" opacity=".55"/>
    <path d="${VALVA_IZQ}" fill="url(#tel-p-rayado-fino)"/><path d="${VALVA_DER}" fill="url(#tel-p-rayado-fino)"/>
    <g id="tel-g-rbc-lupa"></g>
    <g id="tel-g-maquina">${svgMaquinaTrombina()}</g>
    <g id="tel-g-at"></g>
    <g id="tel-g-farmaco"></g>
    <g id="tel-g-embolo-lupa"></g>
    <g id="tel-cartela"></g>
    <g id="tel-g-rotulos"></g>`;
    const gr = $('g-rbc-lupa');
    for (let i = 0; i < 16; i++) { const e = document.createElementNS(SVGNS, 'g'); e.innerHTML = svgParticula('rbc', 0, 0, 3.7); gr.appendChild(e); Anim.rbc.push({ el: e, u: i / 16, off: hashN(i, 41) * 2 - 1, rot: Math.round(hashN(i, 43) * 60 - 30) }); }
    // la antitrombina: 6 escudos (2 con el déficit)
    const ga = $('g-at');
    for (let i = 0; i < 6; i++) { const e = document.createElementNS(SVGNS, 'g'); ga.appendChild(e); Anim.at.push({ el: e, home: [272 + (i % 2) * 22 + (i > 3 ? 6 : 0), 46 + Math.floor(i / 2) * 26], x: 0, y: 0, fase: hashN(i, 47) * 6 }); }
    Anim.at.forEach(a => { a.x = a.home[0]; a.y = a.home[1]; });
    // citoquinas sobre el endotelio
    $('g-cito').innerHTML = [[150, 58], [148, 104], [138, 178], [322, 70], [336, 168], [150, 244], [322, 240]].map(([x, y], i) => `<g data-cito="${i}">${svgParticula('cito', x, y, 4.6)}</g>`).join('');
    Anim.iia = $('iia');
}

/* ---------- La TIH: la plaqueta, el FP4 y la IgG ---------- */
const PLAQ = [236, 140, 44];
// Las 4 bolitas de FP4 alrededor de una plaqueta de centro (cx, cy) y radio r: [x, y, ángulo en grados]
export const fp4Posiciones = (cx, cy, r) => [-70, 20, 110, 200].map(g => { const a = g * Math.PI / 180; return [cx + Math.cos(a) * (r + 3), cy + Math.sin(a) * (r + 3), g]; });
const FP4S = fp4Posiciones(...PLAQ);
function construirTih() {
    $('v-tih').innerHTML = `
    <rect x="118" y="28" width="240" height="240" fill="url(#tel-p-punteado)" opacity=".6"/>
    <path d="M160 20 L160 276 M312 20 L312 276" style="stroke:var(--text-dim)" stroke-width="1" opacity=".5"/>
    ${svgPlaquetaFp4()}`;
}

/* ---------- Piezas que comparte con el vaso que sangra (cobertura del bloque 2, pieza común 5) ----------
   El telar y el vaso (js/modules/libros/vaso-vivo-escena.js) llaman a las mismas dos funciones: el R1 reconoce el
   mismo dibujo en los dos modelos. Con sus valores por defecto dibujan lo de siempre del telar (ids tel-…).
   `pre`: el prefijo de los ids; `rotulos`: false si quien las llama pone sus propios rótulos (p. ej. si dibuja la
   pieza a otra escala y los rótulos tienen que medir ≥ 7,5 px). */
// La máquina de la Fig. 5.2: el Xa (la rueda), la protrombina (II) y la trombina (IIa), la tejedora de la fibrina.
// `xa`, `ii`, `iia`: dónde va cada pieza (los trazos que las unen se calculan desde ellas).
export function svgMaquinaTrombina({ pre = 'tel', xa = XA, ii = II, iia = IIA0, rotulos = true } = {}) {
    const R = (x, y, t, o) => (rotulos ? T(x, y, t, o) : '');
    return `
      <path d="M${ii[0] - 2} ${ii[1] + 7} C${ii[0] - 4} ${ii[1] + 36} ${ii[0] - 12} ${ii[1] + 60} ${iia[0] + 4} ${iia[1] - 38}" style="fill:none;stroke:var(--text-dim)" stroke-width=".9" stroke-dasharray="2.5 2" opacity=".7"/>
      <path d="M${xa[0] - 14} ${xa[1] + 8} C${xa[0] - 22} ${xa[1] + 22} ${xa[0] - 36} ${xa[1] + 30} ${xa[0] - 44} ${xa[1] + 36}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1" opacity=".8"/>
      <path d="M${xa[0] - 46} ${xa[1] + 33} L${xa[0] - 44} ${xa[1] + 38} L${xa[0] - 40} ${xa[1] + 34}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1"/>
      <g transform="translate(${ii[0]} ${ii[1]})"><path d="M-9 -6 L9 -6 L6 0 L9 6 L-9 6 L-6 0 Z" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width=".9"/>${R(0, 4, 'II', { s: 10.6, a: 'middle', i: false, c: 'text-main', w: 700 })}</g>
      ${R(ii[0], ii[1] + 17, 'protrombina', { a: 'middle', c: 'text-dim', plato: true })}
      <g transform="translate(${xa[0]} ${xa[1]})"><path id="${pre}-xa-rueda" d="${engranaje(11)}" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-width="1.1"/><circle r="5.5" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width=".7"/></g>
      ${R(xa[0], xa[1] + 4, 'Xa', { s: 10.6, a: 'middle', i: false, c: 'text-main', w: 700 })}
      <g id="${pre}-g-spools"></g>
      <g id="${pre}-iia"${pre === 'tel' ? '' : ` transform="translate(${iia[0]} ${iia[1]}) rotate(-35)"`}><path d="M-14 0 Q0 -9 14 0 Q0 9 -14 0 Z" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-width="1.1"/><path d="M-13 0 L-18 -1 M13 0 L18 1" style="stroke:var(--accent-yellow)" stroke-width=".8"/>${R(0, 3, 'IIa', { a: 'middle', i: false, c: 'text-main', w: 700 })}</g>
      <path id="${pre}-iia-hilo" d="" style="fill:none;stroke:var(--accent-yellow)" stroke-width=".8" stroke-dasharray="2 1.5"/>
      ${R(iia[0] + 18, iia[1] + 34, '← IIa: la tejedora', { c: 'accent-yellow', plato: true })}`;
}
// La plaqueta de la TIH con sus 4 FP4 (las cadenas de heparina, las IgG, las espinas y los agregados se pintan
// después en sus grupos vacíos, ${pre}-tih-…). `trama`: el patrón de rayado del modelo que la dibuja.
export function svgPlaquetaFp4({ pre = 'tel', cx = PLAQ[0], cy = PLAQ[1], r = PLAQ[2], rotulos = true, trama = '#tel-p-rayado-fino' } = {}) {
    const k = r / PLAQ[2], fp4 = fp4Posiciones(cx, cy, r);
    return `
    <g id="${pre}-tih-espinas"></g>
    <g transform="translate(${cx} ${cy})">
      <circle r="${r}" style="fill:var(--text-main)" opacity=".2"/>
      <circle r="${r}" style="fill:none;stroke:var(--text-main)" stroke-width="1.4"/>
      <circle r="${r}" fill="url(${trama})"/>
      ${[[-14, -10, 5], [12, -16, 4], [4, 14, 5], [-16, 16, 3.5], [20, 8, 3.6]].map(([x, y, rr]) => `<circle cx="${n2(x * k)}" cy="${n2(y * k)}" r="${n2(rr * k)}" style="fill:var(--text-dim)" opacity=".5"/>`).join('')}
    </g>
    ${rotulos ? T(cx, cy + 4, 'plaqueta', { s: 9, a: 'middle', c: 'text-main', plato: true }) : ''}
    <g id="${pre}-tih-fp4">${fp4.map(([x, y]) => P('fp4', x, y, n2(5.2 * Math.max(1, k)))).join('')}</g>
    ${rotulos ? T(fp4[1][0] + 4, fp4[1][1] + 25, 'FP4', { a: 'middle', c: 'text-main', i: false, w: 700, plato: true }) : ''}
    <g id="${pre}-tih-cadenas"></g>
    <g id="${pre}-tih-igg"></g>
    <g id="${pre}-tih-peques"></g>
    <g id="${pre}-tih-rotulos"></g>`;
}

/* ---------- El reloj neuroaxial ---------- */
const RELOJ = { cx: 236, cy: 142, R: 98, radios: { hnf: 86, enoxaparina: 74, apixaban: 62, rivaroxaban: 50, dabigatran: 38 } };
const angH = h => -Math.PI / 2 + (h / 48) * Math.PI * 2;
const ptH = (h, r) => [RELOJ.cx + Math.cos(angH(h)) * r, RELOJ.cy + Math.sin(angH(h)) * r];
function arcoH(h0, h1, r) { if (h1 - h0 <= 0) return ''; const [x0, y0] = ptH(h0, r), [x1, y1] = ptH(h1 - 0.0001, r); return `M${n2(x0)} ${n2(y0)}A${r} ${r} 0 ${h1 - h0 > 24 ? 1 : 0} 1 ${n2(x1)} ${n2(y1)}`; }
function construirReloj() {
    let h = `<rect x="118" y="28" width="240" height="240" fill="url(#tel-p-cruzado)" opacity=".7"/>
    <circle cx="${RELOJ.cx}" cy="${RELOJ.cy}" r="${RELOJ.R}" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width="1"/>`;
    for (let k = 0; k < 48; k++) { const [x0, y0] = ptH(k, RELOJ.R - 2), [x1, y1] = ptH(k, k % 6 ? RELOJ.R - 5 : RELOJ.R - 9); h += `<line x1="${n2(x0)}" y1="${n2(y0)}" x2="${n2(x1)}" y2="${n2(y1)}" style="stroke:var(--text-muted)" stroke-width="${k % 6 ? .5 : 1}"/>`; }
    // con la cifra tapada, los anillos salen neutros (sin el umbral de cada fármaco)
    let arcos = '', neutros = '', nombres = '';
    for (const k of ORDEN_NEURO) {
        const r = RELOJ.radios[k], u = NEURO[k];
        arcos += `<path d="${arcoH(0, u, r)}" style="fill:none;stroke:var(--accent-red)" stroke-width="8" opacity=".38"/><path d="${arcoH(0, u, r)}" style="fill:none;stroke:var(--accent-red)" stroke-width="8" stroke-dasharray="1 2.4" opacity=".7"/>`;
        if (u < 48) arcos += `<path d="${arcoH(u, 48, r)}" style="fill:none;stroke:var(--accent-green)" stroke-width="8" opacity=".32"/>`;
        const [xu, yu] = ptH(u, r - 5), [xu2, yu2] = ptH(u, r + 5);
        arcos += `<line x1="${n2(xu)}" y1="${n2(yu)}" x2="${n2(xu2)}" y2="${n2(yu2)}" style="stroke:var(--text-main)" stroke-width="1.4"/>`;
        neutros += `<circle cx="${RELOJ.cx}" cy="${RELOJ.cy}" r="${r}" style="fill:none;stroke:var(--text-muted)" stroke-width="8" opacity=".22"/>`;
        nombres += T(RELOJ.cx - 4, RELOJ.cy - r + 3, NEURO_NOMBRE[k], { a: 'end', c: 'text-main', i: false, plato: true });
    }
    h += `<g id="tel-reloj-arcos">${arcos}</g><g id="tel-reloj-neutros" display="none">${neutros}</g>${nombres}`;
    h += T(RELOJ.cx, RELOJ.cy - RELOJ.R - 3, '0 h', { a: 'middle', c: 'text-dim', i: false });
    h += T(RELOJ.cx + RELOJ.R + 6, RELOJ.cy + 3, '12', { a: 'middle', c: 'text-dim', i: false });
    h += T(RELOJ.cx, RELOJ.cy + RELOJ.R + 10, '24 h', { a: 'middle', c: 'text-dim', i: false });
    h += T(RELOJ.cx - RELOJ.R - 6, RELOJ.cy + 3, '36', { a: 'middle', c: 'text-dim', i: false });
    h += `<g id="tel-reloj-luces"></g><line id="tel-reloj-aguja" x1="${RELOJ.cx}" y1="${RELOJ.cy}" x2="${RELOJ.cx}" y2="${RELOJ.cy - RELOJ.R}" style="stroke:var(--accent-blue)" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="${RELOJ.cx}" cy="${RELOJ.cy}" r="22" style="fill:var(--bg-main);stroke:var(--accent-blue)" stroke-width="1"/>
    <text id="tel-reloj-h" x="${RELOJ.cx}" y="${RELOJ.cy + 4}" font-size="11" text-anchor="middle" style="fill:var(--text-main);font-family:Georgia,serif;font-weight:700">6 h</text>`;
    $('v-reloj').innerHTML = h;
}

/* ============================================================
   Pintar el estado: lo que depende de las órdenes (no cada fotograma)
   ============================================================ */
// posiciones de la antitrombina según el fármaco: en reposo, en el Xa o junto a la trombina
function destinoAT(e) {
    const f = e.farmaco, n = D.atN;
    return Anim.at.map((a, i) => {
        if (i >= n) return null;
        if (!f || !ES_HEPARINA(f)) return a.home;
        if (i === 0) return [XA[0] + 20, XA[1] + 14];      // la AT despierta atrapa el Xa
        if (i === 1 && n > 1) return [204, 112];           // la que lleva la cadena hacia la trombina
        return a.home;
    });
}
function pintarAT() {
    const hep = estado.farmaco && ES_HEPARINA(estado.farmaco);
    Anim.at.forEach((a, i) => { a.el.innerHTML = i >= D.atN ? '' : svgParticula('at', 0, 0, 7, { color: hep ? '--accent-blue' : '--text-muted', opacidad: hep ? 1 : 0.62 }); });
}
const CART = { hnf: ['larga y desigual:', 'ata la AT y la trombina'], enoxaparina: ['corta y uniforme:', 'apenas llega a la IIa'], dalteparina: ['corta y uniforme:', 'apenas llega a la IIa'],
    fondaparinux: ['5 cuentas:', 'solo el Xa'], apixaban: ['llave sin AT', 'sobre el Xa'], rivaroxaban: ['llave sin AT', 'sobre el Xa'], dabigatran: ['llave sin AT', 'sobre la trombina'], warfarina: ['warfarina', 'sin mecanismo en la ficha'] };
function pintarFarmaco() {
    const e = estado, f = e.farmaco;
    let h = '', r = '';
    const destinos = destinoAT(e);
    if (f && ES_HEPARINA(f)) {
        const tipo = f === 'hnf' ? 'hnf' : f === 'fondaparinux' ? 'cinco' : 'hbpm', largos = CUENTAS[tipo];
        // cadenas en las AT de reposo: el largo se ve (cuántas cuentas, ilustrativo; las 5 del fondaparinux, de la ficha)
        destinos.forEach((p, i) => { if (!p || i < 2) return; const n = largos[i % largos.length]; h += cuentasSVG(cadenaPath(n, p[0] + 3, p[1] + 8, 1.15 + (i % 2) * 0.25, (i % 2 ? -0.03 : 0.025), 3.1), 1.45); });
        // la AT 0 atrapa el Xa: X roja (anti-Xa)
        h += cuentasSVG(cadenaPath(tipo === 'cinco' ? 5 : tipo === 'hbpm' ? 9 : 14, XA[0] + 26, XA[1] + 20, 0.4, 0.16)) + xRoja(XA[0] - 13, XA[1] + 12, 0.9);
        // la AT 1 y su cadena hacia la trombina: aquí decide el largo
        if (D.atN > 1) {
            const ini = [204, 120];
            if (tipo === 'hnf') { h += cuentasSVG(cadenaPath(15, ini[0], ini[1], Math.PI * 0.62, 0.035, 4.3)) + xRoja(IIA0[0] + 10, IIA0[1] - 12, 1.05); r += T(212, 140, 'llega y ata', { c: 'text-main', i: false, w: 700, plato: true }); }
            else if (tipo === 'hbpm') {
                const pts = cadenaPath(9, ini[0], ini[1], Math.PI * 0.62, 0.035, 2.4);
                h += cuentasSVG(pts) + `<path d="M${n2(pts[8][0])} ${n2(pts[8][1])} L${IIA0[0] + 8} ${IIA0[1] - 10}" style="stroke:var(--text-dim)" stroke-width="1" stroke-dasharray="1.5 2.5"/><g opacity=".45">${xRoja(IIA0[0] + 10, IIA0[1] - 12, 0.5)}</g>`;
                r += T(212, 140, 'no llega', { c: 'accent-red', i: false, w: 700, plato: true });
            } else h += cuentasSVG(cadenaPath(5, ini[0], ini[1], Math.PI * 0.2, 0.05, 4.3));
        }
    } else if (f === 'apixaban' || f === 'rivaroxaban') {
        h += llave(XA[0] + 24, XA[1] + 2, 180) + xRoja(XA[0] - 13, XA[1] + 12, 0.9);
        r += T(XA[0] + 4, XA[1] + 30, 'llave sin AT', { c: 'text-main', plato: true });
    } else if (f === 'dabigatran') {
        h += llave(IIA0[0] + 24, IIA0[1] - 18, 200) + xRoja(IIA0[0] + 10, IIA0[1] - 12, 1.05);
        r += T(208, 150, 'llave sin AT', { c: 'text-main', plato: true }) + T(208, 161, 'sobre la IIa', { c: 'text-main', plato: true });
    } else if (f === 'warfarina') {
        r += `<g transform="translate(250 108)"><rect x="-4" y="-11" width="92" height="38" rx="6" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width=".8" stroke-dasharray="3 2"/>${T(2, 0, 'warfarina: tarda', { c: 'text-main' })}${T(2, 11, '5-7 días; su', { c: 'text-main' })}${T(2, 22, 'mecanismo: hueco', { c: 'text-muted' })}</g>`;
    }
    $('g-farmaco').innerHTML = h;
    const c2 = f ? CART[f] : ['bolsillo de la válvula', 'vena femoral'];
    $('cartela').innerHTML = T(LUPA.cx, 238, c2[0], { s: 8.5, a: 'middle', c: f ? 'accent-purple' : 'text-dim', i: !f, w: f ? 700 : '', plato: true }) + T(LUPA.cx, 250, c2[1], { a: 'middle', c: 'text-dim', plato: true });
    if (D.atN > 0 && !(f && ES_HEPARINA(f))) r += T(292, 132, D.atN < 6 ? 'AT: solo 2' : 'AT dormida', { c: 'text-muted', a: 'middle', plato: true });
    $('g-rotulos').innerHTML = r;
    pintarAT();
    Anim.at.forEach((a, i) => { a.desde = [a.x, a.y]; a.hacia = destinos[i] || a.home; });
    Anim.atT = REDUCIR ? 1 : 0;
    $('g-cito').setAttribute('display', e.inflamacion ? 'inline' : 'none');
    $('xa-rueda').style.stroke = D.corta.xa ? 'var(--text-muted)' : 'var(--accent-yellow)';
}
function etiq(x, y, num, uni) {
    const w = Math.max(num.length * 5.2 + 5, 30);
    return `<g transform="translate(${x} ${y})"><rect x="-1" y="-9.5" width="${n2(w)}" height="22" rx="3" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width=".7"/>${T(1.5, 0, num, { c: 'accent-yellow', i: false, w: 700 })}<text x="1.5" y="9.5" font-size="9.3" style="fill:var(--text-dim);font-family:system-ui,sans-serif">${uni}</text></g>`;
}
function pintarMangas() {
    const e = estado;
    let h = '';
    if (e.mecanica === 'medias') {
        const lineas = [];
        for (let y = 300; y > 62;) { const paso = 2.2 + (300 - y) * 0.022; lineas.push(`<line x1="20" y1="${n2(y)}" x2="114" y2="${n2(y - 3)}" style="stroke:var(--text-main)" stroke-opacity=".32" stroke-width=".7"/>`); y -= paso; }
        h += `<g clip-path="url(#tel-clip-pierna)"><rect x="0" y="62" width="120" height="260" style="fill:var(--text-main)" opacity=".06"/>${lineas.join('')}</g>`;
        h += `<path d="M24 64 Q60 58 102 66" style="fill:none;stroke:var(--text-main)" stroke-width="1.2" opacity=".7"/>`;
        h += etiq(2, 284, '18', 'mmHg') + etiq(2, 92, '8', 'mmHg');
    } else if (e.mecanica === 'cni') {
        const cam = [[244, 294, 0], [192, 242, 1], [80, 150, 2]];
        h += cam.map(([y0, y1, k]) => `<g id="tel-c${k}"><rect x="14" y="${y0}" width="${k === 2 ? 100 : 86}" height="${y1 - y0}" rx="10" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" stroke-width="1" fill-opacity=".1"/><rect x="14" y="${y0}" width="${k === 2 ? 100 : 86}" height="${y1 - y0}" rx="10" fill="url(#tel-p-rayado)"/></g>`).join('');
        h += etiq(2, 274, '35-40', 'mmHg') + etiq(2, 120, '20', 'mmHg');
        h += `<g transform="translate(12 178)"><circle r="8" style="fill:var(--bg-main);stroke:var(--text-dim)" stroke-width=".8"/><path id="tel-cni-arco" d="" style="fill:none;stroke:var(--accent-yellow)" stroke-width="2"/>${T(0, 19, '10 s', { a: 'middle', c: 'text-dim', i: false, plato: true })}</g>`;
    }
    // con la CNI por encima de la diastólica: la arteria, en rojo y aplastada sobre las cámaras, y el pie más pálido
    // (que la arteria se comprime es de la ficha; el pie pálido, fisiología general)
    const aprieta = D.cni && D.cni.aprietaArteria;
    if (aprieta) h += `<path id="tel-arteria-top" d="M50 300 C50 272 46 242 48 212 C50 188 52 172 52 150 C52 124 53 94 55 62" style="fill:none;stroke:var(--accent-red)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="5 2"/>
    <path d="M42 292 L72 288 L112 296 C120 300 120 312 110 316 L46 318 C38 316 36 306 42 292 Z" style="fill:var(--text-main)" opacity=".3"/>
    ${T(88, 326, 'pie pálido', { a: 'middle', c: 'text-main', i: false, w: 600, plato: true })}`;
    $('g-mangas').innerHTML = h;
    const art = $('arteria');
    art.style.strokeDasharray = aprieta ? '3 3' : '';
    art.setAttribute('opacity', aprieta ? '1' : '.5');
    const rot = $('rot-arteria');
    rot.innerHTML = aprieta ? 'arteria<tspan x="52" dy="9">apretada</tspan>' : 'arteria';
    rot.style.fontWeight = aprieta ? '700' : '';
    $('g-filtro').setAttribute('display', e.filtro ? 'inline' : 'none');
}
const rinonSVG = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-6 -16 C8 -20 14 -8 12 2 C10 12 6 20 -4 17 C-12 15 -12 6 -6 2 C-2 0 -2 -4 -7 -6 C-12 -8 -12 -14 -6 -16 Z" style="fill:var(--accent-red);stroke:var(--text-dim)" stroke-width=".9" fill-opacity=".28"/><path d="M-6 -16 C8 -20 14 -8 12 2 C10 12 6 20 -4 17 C-12 15 -12 6 -6 2 C-2 0 -2 -4 -7 -6 C-12 -8 -12 -14 -6 -16 Z" fill="url(#tel-p-rayado-fino)"/><path d="M-5 -1 L-14 -1" style="stroke:var(--text-dim)" stroke-width="1"/></g>`;
function pintarRinon() {
    const e = estado, g = $('g-rinon');
    const x0 = 128, y0 = 266;
    if (!e.farmaco) { g.innerHTML = `<g opacity=".7">${rinonSVG(x0 + 16, y0 + 30)}${T(x0 + 36, y0 + 28, 'el riñón: elige un fármaco', { c: 'text-muted' })}${T(x0 + 36, y0 + 40, 'y mira si lo acumula', { c: 'text-muted' })}</g>`; return; }
    const v = D.vaso, oculto = ocultos.has('dosis');
    const col = D.renal.estado === 'danger' ? '--accent-red' : D.renal.estado === 'warn' ? '--accent-yellow' : '--accent-green';
    const H = 38, lleno = oculto ? 0.5 : v;
    const veredicto = oculto ? '¿?' : D.renal.estado === 'ok' ? 'sin ajuste' : D.notaDalte ? 'nota p. 11' : D.notaFonda ? 'discrepan' : D.renal.estado === 'warn' ? 'ajustar' : 'no usar';
    g.innerHTML = `${rinonSVG(x0 + 16, y0 + 26)}
    ${T(x0 + 16, y0 + 56, `ClCr ${e.clcr}`, { a: 'middle', c: 'text-dim', i: false })}
    <path d="M${x0 + 32} ${y0 + 26} L${x0 + 52} ${y0 + 26}" style="stroke:var(--text-muted)" stroke-width=".9" stroke-dasharray="2 2"/>
    <g transform="translate(${x0 + 56} ${y0 + 6})">
      <rect x="0" y="${n2(H - H * lleno)}" width="20" height="${n2(H * lleno)}" style="fill:var(${oculto ? '--text-muted' : col})" opacity=".45"/>
      <rect x="0" y="${n2(H - H * lleno)}" width="20" height="${n2(H * lleno)}" fill="url(#tel-p-rayado)"/>
      <path d="M0 0 L0 ${H} L20 ${H} L20 0" style="fill:none;stroke:var(--text-dim)" stroke-width="1.1"/>
      ${!oculto && v >= 1 ? `<path d="M20 2 q4 6 2 14" style="fill:none;stroke:var(${col})" stroke-width="1.4"/>` : ''}
    </g>
    ${T(x0 + 66, y0 + 58, veredicto, { a: 'middle', c: oculto ? 'text-muted' : col.slice(2), i: false, w: 700 })}
    ${T(x0 + 90, y0 + 16, D.f.largo, { s: 9, c: 'text-main', i: false, w: 600 })}
    <foreignObject x="${x0 + 88}" y="${y0 + 20}" width="${356 - x0 - 88}" height="44"><div xmlns="http://www.w3.org/1999/xhtml" style="font:9px/1.25 system-ui,sans-serif;color:var(--text-dim)">${oculto ? 'la dosis: ¿?' : D.dosis.corta}${!oculto && e.imc >= 40 ? ` · IMC ${e.imc}` : ''}<br><span style="color:var(--text-muted);font-style:italic">vaso: veredicto renal · altura ilustrativa</span></div></foreignObject>`;
}
function pintarTihFijo() {
    const f = estado.farmaco;
    let h = '', r = '';
    const env = D.tih.envuelve, nEnv = env === 'si' ? 4 : env === 'poco' ? 1 : 0;
    FP4S.forEach(([x, y, g], i) => {
        const a = g * Math.PI / 180;
        if (!f || !ES_HEPARINA(f) || f === 'fondaparinux') return;
        if (i < nEnv) {
            // «se une al FP4»: un lazo de cuentas alrededor (imagen ilustrativa)
            const pts = [], n = env === 'si' ? 14 : 9;
            for (let k = 0; k < n; k++) { const b = a + Math.PI / 2 + (k / n) * Math.PI * 2 * (env === 'si' ? 1.05 : 0.8); pts.push([x + Math.cos(b) * 9.5, y + Math.sin(b) * 9.5]); }
            h += `<g data-lazo="${i}">${cuentasSVG(pts, 1.8)}</g>`;
        } else {
            const n = ES_HBPM(f) ? 9 : 14;
            h += `<g data-suelta="${i}">${cuentasSVG(cadenaPath(n, x + Math.cos(a) * 20, y + Math.sin(a) * 20, a + Math.PI / 2, 0.06, 4), 1.8)}</g>`;
        }
    });
    $('tih-cadenas').innerHTML = h;
    $('tih-igg').innerHTML = FP4S.slice(0, nEnv).map(([x, y, g], i) => { const a = g * Math.PI / 180; return `<g id="tel-igg-${i}" opacity="0">${P('igg', x + Math.cos(a) * 19, y + Math.sin(a) * 19, 5.4, { rot: g + 270 })}</g>`; }).join('');
    // espinas de la plaqueta activada y plaquetas pequeñas que se agregan (trombosis): ilustrativo
    let esp = '';
    for (let k = 0; k < 14; k++) { const a = k * Math.PI / 7 + 0.2; esp += `<path d="M${n2(PLAQ[0] + Math.cos(a) * (PLAQ[2] - 1))} ${n2(PLAQ[1] + Math.sin(a) * (PLAQ[2] - 1))} L${n2(PLAQ[0] + Math.cos(a) * (PLAQ[2] + 13))} ${n2(PLAQ[1] + Math.sin(a) * (PLAQ[2] + 13))}" style="stroke:var(--text-main)" stroke-width="1.6" stroke-linecap="round"/>`; }
    $('tih-espinas').innerHTML = `<g id="tel-tih-esp" opacity="0">${esp}</g>`;
    $('tih-peques').innerHTML = `<g id="tel-tih-agreg" opacity="0">${[[198, 204], [214, 212], [232, 216], [250, 212], [266, 204], [222, 226], [242, 226]].map(([x, y], i) => P(i % 2 ? 'plaquetaActiva' : 'plaqueta', x, y, 4.2)).join('')}${T(236, 248, 'trombosis + trombocitopenia', { a: 'middle', c: 'accent-red', i: false, w: 600, plato: true })}</g>`;
    if (f === 'fondaparinux') r += T(PLAQ[0], 52, 'fondaparinux: se puede usar', { a: 'middle', c: 'text-main', i: false, w: 600, plato: true }) + T(PLAQ[0], 63, 'con TIH sospechada o previa', { a: 'middle', c: 'text-dim', plato: true })
        + T(PLAQ[0], 214, 'tratamiento aprobado', { a: 'middle', c: 'text-dim', plato: true }) + T(PLAQ[0], 225, 'de la TIH: argatrobán', { a: 'middle', c: 'accent-yellow', i: false, w: 600, plato: true });
    else if (!f || !ES_HEPARINA(f)) r += T(PLAQ[0], 56, 'sin heparina, no hay complejo', { a: 'middle', c: 'text-dim', plato: true });
    else r += T(PLAQ[0], 52, env === 'si' ? 'HNF: se une al FP4' : 'HBPM: se une menos', { a: 'middle', c: 'text-main', i: false, w: 600, plato: true }) + T(PLAQ[0], 63, 'lazos: imagen ilustrativa', { a: 'middle', c: 'text-dim', plato: true });
    $('tih-rotulos').innerHTML = r;
    Anim.tihT = REDUCIR ? 9 : 0;
}
function pintarReloj() {
    const h = estado.horas, oc = ocultos.has('reloj');
    const [x, y] = ptH(h, RELOJ.R);
    $('reloj-aguja').setAttribute('x2', n2(x)); $('reloj-aguja').setAttribute('y2', n2(y));
    $('reloj-h').textContent = `${h} h`;
    $('reloj-arcos').setAttribute('display', oc ? 'none' : 'inline');
    $('reloj-neutros').setAttribute('display', oc ? 'inline' : 'none');
    $('reloj-luces').innerHTML = ORDEN_NEURO.map(k => {
        const [lx, ly] = ptH(h, RELOJ.radios[k]), ok = D.reloj[k], c = oc ? '--text-muted' : ok ? '--accent-green' : '--accent-red';
        return `<g transform="translate(${n2(lx)} ${n2(ly)})"><circle r="5.6" style="fill:var(--bg-main);stroke:var(${c})" stroke-width="1.6"/><text y="3" font-size="9.3" text-anchor="middle" style="fill:var(${c});font-family:system-ui,sans-serif;font-weight:700">${oc ? '?' : ok ? '✓' : '✗'}</text></g>`;
    }).join('');
}

/* ============================================================
   Animación: hematíes, la tejedora, la red, la fibrinólisis, la CNI, los émbolos y la TIH. El ritmo, ilustrativo.
   ============================================================ */
function anchoLuz(y) { if (y > 214) return 54; if (y > 130) return lerp(9, 54, (y - 130) / 84); if (y > 96) return lerp(38, 9, (y - 96) / 34); return 38; }
function equilibrio(d) { return d.lisis ? (d.teje > 0.3 ? 0.4 : 0.08) : d.teje > 0.3 ? 0.85 : d.teje > 0.01 ? 0.3 : 0; }
function cniInfladas(f) { return [f < 0.3, f >= 0.1 && f < 0.4, f >= 0.2 && f < 0.5]; }   // reparto del ciclo: ilustrativo
let visHilos = -1, visPresos = -1;
function pintarRed() {
    const n = Anim.hilos.filter(h => h.umbral < Anim.red).length;
    if (n !== visHilos) { visHilos = n; Anim.hilos.forEach((h, i) => $('hilo' + i).setAttribute('display', h.umbral < Anim.red ? 'inline' : 'none')); }
    const m = Anim.presos.filter(p => p.umbral < Anim.red).length;
    if (m !== visPresos) { visPresos = m; Anim.presos.forEach((p, i) => $('preso' + i).setAttribute('display', p.umbral < Anim.red ? 'inline' : 'none')); }
}
const enHilo = (h, t) => { const v = 1 - t; return [v * v * h.p0[0] + 2 * v * t * h.c[0] + t * t * h.p1[0], v * v * h.p0[1] + 2 * v * t * h.c[1] + t * t * h.p1[1]]; };
const SPOOL = [[II[0] - 2, II[1] + 7], [192, 86], [184, 110], [IIA0[0] + 4, 140]];
function paso(dt) {
    Anim.reloj += dt;
    const e = estado;
    // la CNI: ciclo real de 10 s (ficha); cómo se reparte entre las cámaras, ilustrativo
    let impulso = 1;
    if (D.cni) {
        Anim.cniFase = (Anim.cniFase + dt / CNI.ciclo) % 1;
        const inf = cniInfladas(Anim.cniFase);
        inf.forEach((on, i) => { const c = $('c' + i); if (c) { c.firstElementChild.setAttribute('fill-opacity', on ? '.5' : '.1'); c.setAttribute('transform', on ? 'translate(-1.5 0) scale(1.03 1)' : ''); } });
        if (inf.some(Boolean)) impulso = 1.9;
        const a = Anim.cniFase * Math.PI * 2, arco = $('cni-arco');
        if (arco) arco.setAttribute('d', `M0 -6A6 6 0 ${Anim.cniFase > 0.5 ? 1 : 0} 1 ${n2(Math.sin(a) * 6)} ${n2(-Math.cos(a) * 6)}`);
        const at = $('arteria-top'); if (at) at.setAttribute('stroke-width', inf.some(Boolean) ? '1' : '2.4');
    }
    const vel = D.velocidad * impulso * (D.medias ? 1.12 : 1);
    if (e.vista === 'telar') {
        Anim.rbc.forEach(b => {
            b.u += dt * 0.12 * vel; if (b.u > 1) b.u -= 1;
            const y = 276 - b.u * 262, x = LUPA.cx + b.off * anchoLuz(y);
            b.el.setAttribute('transform', `translate(${n2(x)} ${n2(y)}) rotate(${b.rot})`);
        });
        // la red: crece con el telar; la fibrinólisis (CNI) la deshace; sin estímulo se deshace muy despacio
        Anim.red = clamp(Anim.red + dt * (0.06 * D.teje - (D.lisis ? 0.035 : 0) - (D.teje === 0 ? 0.01 : 0)), 0, 1);
        if (Anim.red >= 0.96) { Anim.red = 0.66; soltarEmbolo(); }
        pintarRed();
        // la tejedora
        const tejiendo = D.teje > 0.01 && e.farmaco !== 'dabigatran';
        Anim.iiaFase += dt * (tejiendo ? 1.2 + 5 * D.teje : 0.3);
        const ix = IIA0[0] + (tejiendo ? Math.sin(Anim.iiaFase) * 11 : 0), iy = IIA0[1] + (tejiendo ? Math.cos(Anim.iiaFase * 0.5) * 12 : 0);
        Anim.iia.setAttribute('transform', `translate(${n2(ix)} ${n2(iy)}) rotate(${tejiendo ? n2(Math.cos(Anim.iiaFase) * 25 - 35) : -35})`);
        Anim.iia.setAttribute('opacity', tejiendo ? '1' : '.55');
        const hp = $('iia-hilo');
        if (tejiendo && visHilos > 0) { const h = Anim.hilos[Math.floor(Anim.iiaFase / Math.PI) % Math.max(1, visHilos)]; hp.setAttribute('d', `M${n2(ix)} ${n2(iy)} L${n2(h.p0[0])} ${n2(h.p0[1])}`); }
        else hp.setAttribute('d', '');
        // el Xa gira si trabaja; parado si un fármaco lo frena
        const xaActivo = D.estimulo > 0 && !D.corta.xa;
        Anim.xaAng += dt * (xaActivo ? 70 : D.estimulo > 0 ? 6 : 0);
        $('xa-rueda').setAttribute('transform', `rotate(${n2(Anim.xaAng % 360)})`);
        // una protrombina que baja hacia el bolsillo (si el Xa trabaja)
        const sp = $('g-spools');
        if (xaActivo) { Anim.spool = (Anim.spool + dt * 0.45) % 1; const [sx, sy] = bezier(...SPOOL, Anim.spool); sp.innerHTML = `<g transform="translate(${n2(sx)} ${n2(sy)})"><path d="M-4 -2.5 L4 -2.5 L2.5 0 L4 2.5 L-4 2.5 L-2.5 0 Z" style="fill:var(--accent-yellow);stroke:var(--bg-main)" stroke-width=".6"/></g>`; }
        else if (sp.innerHTML) sp.innerHTML = '';
        // la antitrombina va a su sitio y se mece
        if (Anim.atT < 1) Anim.atT = Math.min(1, Anim.atT + dt * 1.4);
        const u = 1 - Math.pow(1 - Anim.atT, 3);
        Anim.at.forEach(a => { if (!a.hacia) return; a.x = lerp(a.desde[0], a.hacia[0], u); a.y = lerp(a.desde[1], a.hacia[1], u); const bob = Math.sin(Anim.reloj * 1.3 + a.fase) * 1.4; a.el.setAttribute('transform', `translate(${n2(a.x)} ${n2(a.y + bob)})`); });
        $('g-farmaco').setAttribute('opacity', n2(u));
        if (e.inflamacion) $('g-cito').querySelectorAll('[data-cito]').forEach((c, i) => c.setAttribute('opacity', n2(0.55 + 0.45 * Math.sin(Anim.reloj * 2.2 + i))));
        // fibrinólisis: puntos que recorren los hilos
        Anim.lisisFase = (Anim.lisisFase + dt * 0.35) % 1;
        for (let i = 0; i < 10; i++) {
            const el = $('lisis' + i);
            if (!D.lisis || visHilos < 1) { el.setAttribute('display', 'none'); continue; }
            const h = Anim.hilos[Math.floor(hashN(i, 53) * visHilos)], [px, py] = enHilo(h, (Anim.lisisFase + i * 0.13) % 1);
            el.setAttribute('display', 'inline'); el.setAttribute('cx', n2(px)); el.setAttribute('cy', n2(py));
        }
    }
    Anim.rbcPierna.forEach(b => { b.u += dt * 0.07 * vel; if (b.u > 1) b.u -= 1; const [x, y] = venaEn(b.u); b.el.setAttribute('transform', `translate(${n2(x)} ${n2(y)})`); });
    moverEmbolos(dt);
    if (e.vista === 'tih') pasoTih(dt);
}
function soltarEmbolo() { if (Anim.embolos.length <= 3) Anim.embolos.push({ fase: 'lupa', u: 0 }); }
let embH = ['', ''];
function moverEmbolos(dt) {
    let hl = '', hp = '';
    Anim.embolos = Anim.embolos.filter(m => {
        m.u += dt * (m.fase === 'lupa' ? 0.7 : 0.35);
        if (m.fase === 'lupa') {
            if (m.u >= 1) { m.fase = 'pierna'; m.u = U_VALV; }
            else { const x = lerp(184, 214, m.u), y = lerp(136, 26, m.u); hl += `<g transform="translate(${n2(x)} ${n2(y)})"><path d="M-6 -3 Q0 -7 6 -2 Q4 5 -3 4 Q-8 2 -6 -3 Z" style="fill:var(--accent-red);stroke:var(--accent-yellow)" stroke-width=".8"/></g>`; }
            return true;
        }
        if (m.fase === 'pierna') {
            const [x, y] = venaEn(Math.min(1, m.u));
            if (estado.filtro && y <= 26) { m.fase = 'atrapado'; m.x = 70; m.y = 24; Anim.atrapados++; return Anim.atrapados <= 3; }
            if (m.u >= 1) { Anim.ep = Anim.reloj; return false; }
            hp += `<circle cx="${n2(x)}" cy="${n2(y)}" r="3" style="fill:var(--accent-red);stroke:var(--accent-yellow)" stroke-width=".8"/>`;
            return true;
        }
        hp += `<circle cx="${m.x}" cy="${m.y}" r="2.6" style="fill:var(--accent-red);stroke:var(--text-main)" stroke-width=".7"/>`;
        return estado.filtro;
    });
    if (Anim.ep && Anim.reloj - Anim.ep < 2.5) hp += T(80, 36, '→ al pulmón (EP)', { c: 'accent-red', i: false, w: 700, plato: true });
    if (embH[0] !== hl) { embH[0] = hl; $('g-embolo-lupa').innerHTML = hl; }
    if (embH[1] !== hp) { embH[1] = hp; $('g-embolo-pierna').innerHTML = hp; }
}
function pasoTih(dt) {
    Anim.tihT += dt;
    const t = Anim.tihT, caen = D.plaquetasCaen;
    const op = (a, b) => n2(clamp((t - a) / (b - a), 0, 1));
    $('tih-cadenas').querySelectorAll('[data-lazo]').forEach(g => g.setAttribute('opacity', op(0, 1.2)));
    for (let i = 0; i < 4; i++) { const g = $('igg-' + i); if (g) g.setAttribute('opacity', op(1.2, 2.4)); }
    $('tih-esp')?.setAttribute('opacity', caen ? op(2.4, 3.4) : 0);
    $('tih-agreg')?.setAttribute('opacity', caen ? op(2.8, 3.8) : 0);
}
// «Reducir movimiento» (o la lámina aún sin ver): el estado final, quieto
function pintarUnaVez() {
    Anim.red = equilibrio(D); pintarRed();
    Anim.rbc.forEach((b, k) => { const y = 276 - ((k + 0.5) / Anim.rbc.length) * 262, x = LUPA.cx + b.off * anchoLuz(y); b.el.setAttribute('transform', `translate(${n2(x)} ${n2(y)}) rotate(${b.rot})`); });
    Anim.rbcPierna.forEach((b, k) => { const [x, y] = venaEn((k + 0.5) / Anim.rbcPierna.length); b.el.setAttribute('transform', `translate(${n2(x)} ${n2(y)})`); });
    Anim.atT = 1; Anim.at.forEach(a => { if (!a.hacia) return; a.x = a.hacia[0]; a.y = a.hacia[1]; a.el.setAttribute('transform', `translate(${n2(a.x)} ${n2(a.y)})`); });
    $('g-farmaco').setAttribute('opacity', '1');
    Anim.iia.setAttribute('transform', `translate(${IIA0[0]} ${IIA0[1]}) rotate(-35)`);
    $('xa-rueda').setAttribute('transform', '');
    if (estado.vista === 'tih') { Anim.tihT = 9; pasoTih(0); }
    if (D.cni) cniInfladas(0.15).forEach((on, i) => { const c = $('c' + i); if (c) c.firstElementChild.setAttribute('fill-opacity', on ? '.5' : '.1'); });
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
    return { enMarcha, visible, fotogramas: { n, medio, max: n ? n2(Math.max(...fotogramas)) : 0 }, red: n2(Anim.red) };
}
export function vaciarFotogramas() { fotogramas.length = 0; }

/* ============================================================
   Aplicar un estado, la vista de la lupa y el tablero de lecturas
   ============================================================ */
const CHAPA = { telar: 'la pierna · el telar', tih: 'la plaqueta · TIH', reloj: 'reloj neuroaxial', eco: 'eco de compresión' };
let vistaAnim = null;
function abrirVista(v) {
    $('chapa').textContent = CHAPA[v];
    $('vista-cerrar').hidden = v === 'telar';
    ['telar', 'tih', 'reloj', 'eco'].forEach(k => $('v-' + k).setAttribute('display', k === v ? 'inline' : 'none'));
    const g = $('lupa');
    if (vistaAnim) { vistaAnim.stop?.(); vistaAnim = null; }
    const tr = k => g.setAttribute('transform', `translate(${LUPA.cx} ${LUPA.cy}) scale(${k.toFixed(3)}) translate(${-LUPA.cx} ${-LUPA.cy})`);
    if (REDUCIR || !window.Motion) { tr(1); return; }
    tr(0.86); vistaAnim = window.Motion.animate(0.86, 1, { duration: 0.4, ease: [0.2, 0.8, 0.2, 1], onUpdate: tr });
}
// Cambia el estado y repinta. Devuelve el estado anterior (para la frase viva).
export function aplicarModelo(nuevo, { reiniciar = false, forzar = false } = {}) {
    const viejo = estado;
    estado = nuevo; D = derivar(estado);
    if (reiniciar) { Anim.red = equilibrio(D) * (REDUCIR ? 1 : 0.7); Anim.embolos = []; Anim.atrapados = 0; Anim.ep = 0; }
    if (viejo.vista !== nuevo.vista || forzar) abrirVista(nuevo.vista);
    pintarTodo(viejo);
    if (REDUCIR || !enMarcha) pintarUnaVez();
    arrancar();
    return viejo;
}
function pintarTodo(viejo) {
    pintarFarmaco(); pintarMangas(); pintarRinon();
    if (estado.vista === 'tih' && (!viejo || viejo.farmaco !== estado.farmaco || viejo.vista !== 'tih' || viejo.tih !== estado.tih)) pintarTihFijo();
    if (estado.vista === 'reloj') pintarReloj();
    if (estado.vista === 'eco') pintarEco(estado);
    sincronizarEco(estado);
    pintarTablero();
    ganchos.despues?.();
}
export function setOcultos(arr, repintar = true) {
    ocultos.clear(); (arr || []).forEach(k => ocultos.add(k));
    if (!repintar) return;
    pintarTablero(); pintarRinon(); if (estado.vista === 'reloj') pintarReloj();
    ganchos.despues?.();
}

/* El tablero: tres lecturas con su origen, encima de la lámina */
const CORTA_TXT = { hnf: 'Xa + IIa', enoxaparina: 'Xa', dalteparina: 'Xa', fondaparinux: 'solo Xa', apixaban: 'Xa directo', rivaroxaban: 'Xa directo', dabigatran: 'IIa directo', warfarina: 'a los 5-7 días' };
const ORG = t => t.startsWith('!') ? `<span class="tel-o">${t.slice(1)}</span>` : `<span class="tel-o${/ilustrativ/.test(t) && !/mar-/.test(t) ? ' tel-ilu' : ''}">${chipTxt(t)}</span>`;
export function pintarTablero() {
    const e = estado, c = [];
    const celda = (k, clave, valor, origen, tono = '') => c.push(`<div class="tel-celda"><span class="tel-k">${k}</span><b class="${ocultos.has(clave) ? '' : tono ? 'tel-' + tono : ''}">${Q(clave, valor)}</b>${ORG(origen)}</div>`);
    if (e.vista === 'telar') {
        celda('Flujo femoral', 'flujo', D.flujoTxt, e.gastoBajo ? 'fisiología general · 35 % ilustrativo' : 'mar-inmovilidad (= el gasto)');
        const tend = D.tendencia;
        celda('Red de fibrina', 'red', tend, 'ritmo ilustrativo', tend === 'crece' ? 'alarma' : tend === 'quieta' || tend === 'se deshace' ? 'bien' : '');
        if (e.farmaco) celda('Corta', 'corta', CORTA_TXT[e.farmaco] + (ES_HBPM(e.farmaco) ? ' (IIa, poco)' : ''), 'mar-img-5-2 (p. 6)');
        else celda('Antitrombina', 'at', D.atN === 6 ? '6, dormidas' : '2 de 6', D.atN === 6 ? 'sin heparina · ilustrativo' : 'mar-tev-uci (×14) · 2 de 6 ilustrativo');
    } else if (e.vista === 'tih') {
        if (e.farmaco === 'fondaparinux') {
            celda('Con TIH sospechada', 'tih', 'se puede usar', 'mar-fondaparinux (p. 8)');
            celda('Tratamiento de la TIH', 'tih', 'argatrobán', 'mar-fondaparinux (p. 8)');
            celda('Con el FP4', 'fp4', 'sin dato', '!la ficha no lo dice');
        } else {
            celda('Plaquetas', 'tih', D.plaquetasCaen ? 'caen' : e.sospechaTih && !e.tih && (e.farmaco === 'hnf' || ES_HBPM(e.farmaco)) ? 'bajan · sin agregados aún' : '—', 'consumo · ilustrativo', D.plaquetasCaen ? 'alarma' : '');
            celda('TIH', 'tih', D.tih.incidencia != null ? String(D.tih.incidencia).replace('.', ',') + ' %' : '—', e.farmaco === 'hnf' || ES_HBPM(e.farmaco) ? 'mar-hbpm (p. 7)' : '!sin heparina');
            celda('Con la dosis', 'tih', 'no depende', 'mar-hnf (p. 5)');
        }
    } else if (e.vista === 'eco') {
        tableroEco(e).forEach(([k, clave, valor, origen, tono]) => celda(k, clave, valor, origen, tono));
    } else {
        const corto = k => ({ hnf: 'HNF', enoxaparina: 'enoxa 1/día', apixaban: 'apixa', rivaroxaban: 'rivaro', dabigatran: 'dabi' }[k]);
        const listos = ORDEN_NEURO.filter(k => D.reloj[k]), esperar = ORDEN_NEURO.filter(k => !D.reloj[k]);
        celda('Desde la dosis', 'horas', `${e.horas} h`, '!función renal normal');
        celda('Ya se puede', 'reloj', listos.length ? listos.map(corto).join(', ') : 'ninguno', 'mar-neuroeje (p. 9-10)', 'bien');
        celda('Esperar', 'reloj', esperar.length ? esperar.map(corto).join(', ') : 'nada', 'mar-neuroeje (p. 9-10)', esperar.length ? 'alarma' : '');
    }
    $('tablero').innerHTML = c.join('');
}

/* ============================================================
   Anillo dorado sobre lo que hay que mirar
   ============================================================ */
export const ANCLAS = { valvula: [VALV[0], VALV[1], 34], telar: [184, 184, 84], xa: [XA[0], XA[1], 50], iia: [IIA0[0], IIA0[1], 50], flujo: [236, 230, 64], rinon: [184, 294, 76],
    mangas: [58, 200, 120], filtro: [72, 18, 44], fp4: [PLAQ[0], PLAQ[1], 140], reloj: [RELOJ.cx, RELOJ.cy, 210] };
let anilloAnim = null;
export let anilloObj = null;
export function anillo(obj) {
    const a = $('anillo'); anilloObj = obj;
    if (anilloAnim) { anilloAnim.stop?.(); anilloAnim = null; }
    if (!obj || !ANCLAS[obj]) { a.hidden = true; return; }
    const svg = $('lamina'), r = svg.getBoundingClientRect(), r0 = $('escena').getBoundingClientRect();
    if (!r.width) { a.hidden = true; return; }
    const s = Math.min(r.width / 360, r.height / 330), ox = (r.width - 360 * s) / 2, oy = (r.height - 330 * s) / 2;
    const [sx, sy, st] = ANCLAS[obj], tam = n2(st * s);
    Object.assign(a.style, { left: n2(r.left - r0.left + ox + sx * s) + 'px', top: n2(r.top - r0.top + oy + sy * s) + 'px', width: tam + 'px', height: tam + 'px', margin: `-${tam / 2}px 0 0 -${tam / 2}px` });
    a.hidden = false;
    if (!REDUCIR && window.Motion) anilloAnim = window.Motion.animate(a, { transform: ['scale(0.9)', 'scale(1.06)', 'scale(0.9)'], opacity: [0.95, 0.5, 0.95] }, { duration: 1.4, repeat: Infinity, ease: 'easeInOut' });
}

/* ============================================================
   Arranque de la escena
   ============================================================ */
export function initEscena() {
    REDUCIR = sinMovimiento();
    construirLamina();
    D = derivar(estado);
    abrirVista('telar'); pintarTodo(null); pintarUnaVez();
}
