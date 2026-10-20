// La inmersión: la escena viva (el corte de agua en grabado). Arriba, la tormenta del dolor (olas, nubes, lluvia y
// rayo: su tamaño sigue la BPS); bajo la superficie, el paciente como buzo con escafandra (su cara es la de la BPS y
// su profundidad, la RASS), el profundímetro de la RASS con la franja objetivo, los lastres de los sedantes, la boya de
// la dexmedetomidina y el aceite del opioide; a la derecha, el ventilador, el monitor (FC y PA, que casi no se mueven)
// y el medallón con la cara de la Tabla 6.1. En la subida (Tabla 6.7), dos buzos sueltan el lastre con sus relojes.
// Además: el tablero, la tira de la Tabla 6.7 bajo la lámina, el anillo dorado y el bucle de dibujo.
//
// Un solo estado (`estado`: la hoja de órdenes) y lo que se deriva de él (`D`, con derivar() de
// js/data/inmersion-viva-data.js). La interfaz y la capa de estudio viven en inmersion-viva.js.
// Las partículas (lactato, H⁺ y citoquinas) salen de js/core/particulas.js (tabla única de formas); lastres, boya y
// aceite son dibujos de la escena, no partículas. Rendimiento: el bucle solo corre con la lámina a la vista; con
// «reducir movimiento» se pinta el estado final.
import { svgParticula } from '../../core/particulas.js';
import { sinMovimiento } from '../../core/motion.js';
import {
    estadoBase, derivar, clamp, signo, OPIOIDES, SEDANTES, TABLA_6_7, RASS_TERM, durSubida,
} from '../../data/inmersion-viva-data.js';

export const $ = id => document.getElementById('inm-' + id);
const n2 = x => +x.toFixed(2);
const lerp = (a, b, t) => a + (b - a) * t;
export let REDUCIR = false;
const M = () => (REDUCIR ? null : window.Motion || null);

/* ============================================================
   Estado (enlaces vivos: solo esta pieza los cambia, con aplicarModelo)
   ============================================================ */
export let estado = estadoBase();
export let D = derivar(estado);
export const ocultos = new Set();   // cifras tapadas con «?» hasta contestar
export function marcarLlamado() { estado.llamado = true; }

/* ============================================================
   Geometría y utilidades de dibujo
   ============================================================ */
const SUP = 98;
const Y = { 4: 18, 3: 38, 2: 58, 1: 78, 0: 98, '-1': 126, '-2': 154, '-3': 186, '-4': 222, '-5': 260 };
export const yR = r => Y[String(clamp(Math.round(r), -5, 4))];
export const SUPERFICIE = SUP;
const SC = 0.85;                       // escala del buzo
const X_SOLO = [172], X_PAR = [140, 236], X_UNO = [172];
const VENT = [304, 27];                // entrada del ventilador
const MED = [311, 198, 38];            // el medallón de la cara
// Texto de la lámina: s (tamaño, nunca por debajo de 6,6 px), a (anclaje), c (color), i (cursiva), b (negrita), sans
const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}"${o.a ? ` text-anchor="${o.a}"` : ''} style="font-size:${Math.max(o.s || 7.5, 6.6)}px;fill:var(${o.c || '--text-dim'});${o.i ? 'font-style:italic;' : ''}${o.b ? 'font-weight:700;' : ''}${o.sans ? 'font-family:var(--inm-sans);' : 'font-family:var(--inm-serif);'}"${o.id ? ` id="inm-${o.id}"` : ''}>${t}</text>`;

const ESQUELETO = `<defs>
    <pattern id="inm-p-raya" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-yellow);stroke-width:.7;opacity:.34"/></pattern>
    <pattern id="inm-p-raya2" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><line x1="0" y1="0" x2="0" y2="3.4" style="stroke:var(--accent-yellow);stroke-width:.6;opacity:.28"/></pattern>
    <pattern id="inm-p-agua" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5 Q1.75 2 3.5 3.5 T7 3.5" style="fill:none;stroke:var(--text-muted);stroke-width:.45;opacity:.42"/></pattern>
    <pattern id="inm-p-arena" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".6" style="fill:var(--accent-yellow);opacity:.36"/><circle cx="3.6" cy="3.4" r=".4" style="fill:var(--text-muted);opacity:.4"/></pattern>
    <pattern id="inm-p-nube" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><line x1="0" y1="0" x2="0" y2="3" style="stroke:var(--text-muted);stroke-width:.6;opacity:.55"/></pattern>
    <pattern id="inm-p-franja" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--accent-yellow);stroke-width:.9;opacity:.3"/></pattern>
    <clipPath id="inm-clip-med"><circle cx="311" cy="198" r="38"/></clipPath>
  </defs>
  <g id="inm-g-fondo"></g>
  <path id="inm-ola-mascara" d="" style="fill:var(--bg-main)"/>
  <path id="inm-ola-cielo" d="" style="fill:url(#inm-p-nube);opacity:.18"/>
  <g id="inm-g-nubes"></g>
  <g id="inm-g-lluvia" style="stroke:var(--text-muted);stroke-width:.8;stroke-linecap:round"></g>
  <path id="inm-rayo" d="M206 6 L196 30 L206 30 L194 58" style="fill:none;stroke:var(--accent-blue);stroke-width:2;stroke-linejoin:round" opacity="0"/>
  <path id="inm-ola-linea" d="" style="fill:none;stroke:var(--text-dim);stroke-width:1.4"/>
  <path id="inm-ola-espuma" d="" style="fill:none;stroke:var(--text-main);stroke-width:.8;stroke-dasharray:3 5;opacity:.55"/>
  <path id="inm-ola-aceite" d="" style="fill:none;stroke:var(--accent-blue);stroke-width:3" opacity="0"/>
  <g id="inm-g-aceite"></g>
  <g id="inm-g-boya"></g>
  <g id="inm-g-tubos" style="fill:none;stroke-linecap:round;stroke-linejoin:round"></g>
  <g id="inm-g-lastres-caidos"></g>
  <g id="inm-g-buzos"></g>
  <g id="inm-g-part"></g>
  <g id="inm-g-vent"></g>
  <g id="inm-g-monitor"></g>
  <g id="inm-g-derecha"></g>
  <g id="inm-g-regla"></g>
  <g id="inm-g-aguja"></g>
  <g id="inm-g-rotulos"></g>
  <g id="inm-g-relojes"></g>
  <g id="inm-g-anillo"></g>`;

function construirFondo() {
    let h = `<rect x="0" y="0" width="360" height="330" style="fill:var(--bg-main)"/>`;
    h += `<rect x="0" y="70" width="360" height="260" style="fill:url(#inm-p-agua)"/>`;
    for (const [y0, op] of [[140, 0.1], [190, 0.12], [236, 0.14], [276, 0.16]]) h += `<rect x="0" y="${y0}" width="360" height="${330 - y0}" style="fill:var(--bg-main);opacity:${op}"/>`;
    // la franja objetivo (−1 a −2), en oro
    h += `<rect x="0" y="114" width="360" height="54" style="fill:url(#inm-p-franja)"/><path d="M0 114H360M0 168H360" style="stroke:var(--accent-yellow);stroke-width:.6;stroke-dasharray:2 4;opacity:.7"/>`;
    // el fondo: arena y rocas
    h += `<path d="M0 300 C60 292 120 304 180 298 S300 290 360 298 V330 H0Z" style="fill:url(#inm-p-arena);stroke:var(--text-muted);stroke-width:.9"/>`;
    h += `<path d="M232 300 q8 -16 22 -10 q10 -8 16 8Z M96 302 q6 -10 16 -6 q6 -2 8 6Z" style="fill:url(#inm-p-raya2);stroke:var(--text-muted);stroke-width:.8"/>`;
    h += `<path d="M118 300 q-4 -16 2 -26 M124 300 q4 -12 -2 -22 M250 296 q-3 -12 3 -20" style="fill:none;stroke:var(--accent-green);stroke-width:.9;opacity:.6"/>`;
    h += T(354, 292, 'escena: ilustrativo', { a: 'end', s: 6.8, i: 1, c: '--text-muted' });
    $('g-fondo').innerHTML = h;
    // las nubes de la tormenta
    const nube = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 14 q-2 -10 9 -11 q3 -9 14 -6 q7 -8 17 -1 q11 -2 11 9 q8 3 3 9Z" style="fill:url(#inm-p-nube);stroke:var(--text-muted);stroke-width:1"/>`;
    $('g-nubes').innerHTML = nube(92, 2, 1.25) + nube(154, 10, 1.05) + nube(204, 0, 1.3);
    let ll = '';
    for (let i = 0; i < 28; i++) ll += `<line x1="0" y1="0" x2="-3" y2="9" opacity="0"/>`;
    $('g-lluvia').innerHTML = ll;
}
function construirRegla() {
    let h = `<rect x="15" y="10" width="7" height="256" rx="2" style="fill:url(#inm-p-raya);stroke:var(--accent-yellow);stroke-width:.9"/>`;
    h += T(18, 7, 'RASS', { a: 'middle', s: 6.8, c: '--accent-yellow', b: 1, sans: 1 });
    for (let r = 4; r >= -5; r--) {
        const y = Y[r], obj = r === -1 || r === -2, opt = r === 0;
        h += `<line x1="11" y1="${y}" x2="26" y2="${y}" style="stroke:var(--accent-yellow);stroke-width:${opt ? 1.6 : 0.9}"/>`;
        h += T(10, y + 2.6, signo(r), { a: 'end', s: 7.5, b: 1, c: opt || obj ? '--accent-yellow' : '--text-dim', sans: 1 });
        h += T(29, y + (opt ? -5 : 2.6), RASS_TERM[r] + (opt ? ' · óptimo' : ''), { s: 7, i: 1, c: opt || obj ? '--accent-yellow' : '--text-muted', b: opt });
    }
    h += T(29, 175, 'objetivo en perfusión: −1 a −2', { s: 6.8, c: '--accent-yellow', sans: 1, b: 1 });
    h += `<rect data-toca="regla" role="button" aria-label="El profundímetro: la escala RASS" x="0" y="0" width="40" height="270" fill="transparent"/>`;
    $('g-regla').innerHTML = h;
    $('g-aguja').innerHTML = `<g id="inm-aguja"><path d="M23 0 L33 -5 L33 5Z" style="fill:var(--accent-blue);stroke:var(--bg-main);stroke-width:.8"/></g>`;
}

/* ---------- La cara (Tabla 6.1 viva) ---------- */
// La cara pequeña, la que se ve por el visor de la escafandra.
function caraSVG(cara, ojos) {
    const L = 'stroke:var(--text-main);fill:none;stroke-linecap:round;stroke-width:1.2';
    let h = `<circle r="15" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1.4"/>`;
    h += `<path d="M-14 4 A15 15 0 0 1 -6 -13.6 A16 16 0 0 0 -11 8Z" style="fill:url(#inm-p-raya)"/>`;
    const cejas = { 1: 'M-9 -6 Q-6 -8 -3 -6 M3 -6 Q6 -8 9 -6', 2: 'M-9 -7 Q-6 -8 -3 -5.2 M3 -5.2 Q6 -8 9 -7', 3: 'M-9.5 -8 L-3 -4.6 M3 -4.6 L9.5 -8', 4: 'M-10 -8.6 L-2.4 -3.8 M2.4 -3.8 L10 -8.6' }[cara];
    h += `<path d="${cejas}" style="${L};stroke-width:1.8"/>`;
    if (ojos === 'abiertos') h += `<circle cx="-6" cy="-1" r="1.9" style="fill:var(--text-main)"/><circle cx="6" cy="-1" r="1.9" style="fill:var(--text-main)"/>`;
    else if (ojos === 'apretados') h += `<path d="M-8.6 -2.4 L-4 -0.6 L-8.6 1.2 M8.6 -2.4 L4 -0.6 L8.6 1.2" style="${L};stroke-width:1.5"/>`;
    else h += `<path d="M-8.6 -1 Q-6 0.8 -3.4 -1 M3.4 -1 Q6 0.8 8.6 -1" style="${L};stroke-width:1.4"/>`;
    h += `<rect x="-3" y="5" width="6" height="4" rx="1" style="fill:var(--text-muted)"/>`;
    return h;
}
// Simétrico de un trazo (solo órdenes M, L, Q: pares x y).
const espejoX = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${n2(-x)} ${y}`);
// La cara grande del medallón, en grabado: cejas, ojos, surcos, el tubo y las manos de la categoría «miembros superiores».
export function caraGrabado(cara, ojos, brazos) {
    const S = (d, w = 1.2, c = '--text-main') => `<path d="${d}" style="fill:none;stroke:var(${c});stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"/>`;
    const par = (d, w, c) => S(d + ' ' + espejoX(d), w, c);
    let h = `<path d="M-42 46 Q-36 26 -14 22 L14 22 Q36 26 42 46Z" style="fill:url(#inm-p-raya2);stroke:var(--text-dim);stroke-width:1.2"/>`;
    h += S('M-14 22 Q0 29 14 22', 0.9, '--text-muted') + S('M-24 30 Q-22 38 -24 46 M24 30 Q22 38 24 46', 0.6, '--text-muted');
    h += `<path d="M-7 12 L-7 22 Q0 25 7 22 L7 12" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1.1"/>`;
    h += `<ellipse cx="-17.5" cy="-1" rx="3" ry="5" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1"/><ellipse cx="17.5" cy="-1" rx="3" ry="5" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1"/>`;
    h += `<ellipse cx="0" cy="-2" rx="17" ry="21" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1.4"/>`;
    h += `<path d="M-17 -2 Q-17 16 -4 19 Q-13 12 -14 -4 Q-14 -14 -8 -20 Q-16 -15 -17 -2Z" style="fill:url(#inm-p-raya)"/>`;
    h += `<path d="M-17 -6 Q-18 -22 -4 -24 Q12 -26 17 -10 Q13 -18 4 -19 Q-8 -20 -13 -10Z" style="fill:url(#inm-p-raya);stroke:var(--text-muted);stroke-width:1"/>`;
    const frente = ['', '', 'M-7 -15 Q0 -16.5 7 -15', 'M-8 -15 Q0 -17 8 -15 M-6 -18 Q0 -19.4 6 -18', 'M-9 -14.5 Q0 -17 9 -14.5 M-7 -17.6 Q0 -19.6 7 -17.6 M-1.4 -12 L-0.9 -8 M1.4 -12 L0.9 -8'][cara];
    if (frente) h += S(frente, 0.7, '--text-muted');
    h += par({ 1: 'M-12 -10 Q-7 -12.5 -2.5 -10.5', 2: 'M-12 -10.8 Q-7 -12.2 -2.5 -8.8', 3: 'M-12.5 -12 Q-7 -11 -2.5 -7.6', 4: 'M-13 -12.6 Q-7 -10.5 -2 -6.6' }[cara], [0, 1.4, 1.7, 2, 2.4][cara]);
    if (ojos === 'abiertos') h += par('M-11 -4 Q-7 -6.6 -3 -4', 1) + `<circle cx="-7" cy="-3.7" r="1.9" style="fill:var(--text-main)"/><circle cx="7" cy="-3.7" r="1.9" style="fill:var(--text-main)"/>` + par('M-11 -4 Q-7 -2 -3 -4', 0.7, '--text-muted');
    else if (ojos === 'apretados') h += par('M-11 -5 L-3.5 -3.4 L-11 -1.6', 1.3) + par('M-13.5 -6 L-16 -8 M-14 -3.4 L-16.6 -3.4 M-13.5 -1 L-16 1', 0.7, '--text-muted');
    else h += par('M-11 -3.6 Q-7 -1.4 -3 -3.6', 1.1) + par('M-9.5 -2.6 L-10.2 -1.2 M-7 -2 L-7 -0.6 M-4.5 -2.6 L-3.9 -1.2', 0.5, '--text-muted');
    h += S('M-0.5 -3 Q-2.6 4 -1.4 6.5 Q0 7.6 2 6.6', 0.9, '--text-dim');
    if (cara >= 3) h += par('M-4 5 Q-8 9 -8.5 13', cara === 4 ? 1.1 : 0.8, '--text-dim');
    if (cara === 4) h += par('M-12 2 Q-10 5 -11 8', 0.7, '--text-muted');
    h += `<path d="M-15 11 L15 11" style="stroke:var(--text-muted);stroke-width:2.4;stroke-dasharray:3 1.6"/>`;
    h += `<rect x="-4" y="9" width="8" height="5" rx="1.2" style="fill:var(--text-muted);stroke:var(--bg-main);stroke-width:.6"/>`;
    h += `<path d="M3 12 Q16 14 34 4" style="fill:none;stroke:var(--text-muted);stroke-width:4.4;stroke-linecap:round"/><path d="M3 12 Q16 14 34 4" style="fill:none;stroke:var(--bg-main);stroke-width:1.6;stroke-linecap:round"/>`;
    h += S(cara >= 3 ? 'M-6 13 Q-4 15.8 0 15.8' : 'M-5.5 13.5 Q-3 15 0 15', 0.9, '--text-dim');
    const manos = { 1: [], 2: [[-25, 33, false]], 3: [[-14, 30, true]], 4: [[-9, 24, true]] }[brazos] || [];
    for (const [x, y, puno] of manos) for (const k of [1, -1]) h += puno
        ? `<circle cx="${k * x}" cy="${y}" r="4.4" style="fill:var(--text-dim);stroke:var(--bg-main);stroke-width:1"/><path d="M${k * x - 2.6} ${y - 1.2} L${k * x + 2.6} ${y - 1.2} M${k * x - 2.6} ${y + 1.2} L${k * x + 2.6} ${y + 1.2}" style="stroke:var(--bg-main);stroke-width:.7"/>`
        : `<ellipse cx="${k * x}" cy="${y}" rx="4.4" ry="3.2" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1.1"/>`;
    return h;
}
// Los lastres: unos 24-28 px en la escena, cada uno con su forma y su nombre.
const NOMBRE_LASTRE = { plomo: 'propofol', esponja: 'midazolam', barril: 'lorazepam', piedra: 'diazepam' };
export function lastreSVG(tipo, esc = 1, horas = 24, conNombre = true) {
    if (!tipo) return '';
    const cuerda = `<path class="inm-cuerda" d="M11 42 Q21 44 30 50" style="fill:none;stroke:var(--text-muted);stroke-width:1.3"/>`;
    const nombre = y => conNombre ? T(31, y, NOMBRE_LASTRE[tipo], { a: 'middle', s: 9, b: 1, c: '--text-dim', sans: 1 }) : '';
    const lingote = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-15 -8 H15 L12 8 H-12Z" style="fill:var(--text-muted);stroke:var(--bg-main);stroke-width:1.2"/><path d="M-11 -3.5 H11 M-10 .5 H8 M-9 4.5 H5" style="stroke:var(--text-main);stroke-width:.8;opacity:.55"/><path d="M-15 -8 H15" style="stroke:var(--text-main);stroke-width:1.3"/></g>`;
    if (tipo === 'plomo') return cuerda + lingote(31, 58) + nombre(78);
    if (tipo === 'esponja') {
        const k = (horas > 168 ? 1.45 : horas > 72 ? 1.3 : horas > 48 ? 1.15 : 1) * esc;   // crece con las horas (ilustrativo)
        return cuerda + `<g transform="translate(31 60) scale(${k})"><path d="M-15 -6 Q-12 -15 -2 -12 Q7 -18 13 -9 Q19 0 12 6 Q6 13 -4 9 Q-16 9 -15 -6Z" style="fill:var(--accent-yellow);opacity:.85;stroke:var(--bg-main);stroke-width:1.2"/>${[[-7, -4, 2.2], [2, -7, 1.6], [8, 0, 2], [-1, 3, 2.4], [-9, 4, 1.4], [5, 6, 1.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--bg-main)"/>`).join('')}</g>` + nombre(n2(60 + 14 * k + 8));
    }
    if (tipo === 'barril') return cuerda + lingote(31, 55, 0.8) + `<path d="M31 61 V68" style="stroke:var(--text-muted);stroke-width:1.2"/><g transform="translate(31 80)"><path d="M-10 -12 Q-13 0 -10 12 H10 Q13 0 10 -12Z" style="fill:url(#inm-p-raya2);stroke:var(--accent-yellow);stroke-width:1.2"/><path d="M-11.6 -5 H11.6 M-11.6 5 H11.6" style="stroke:var(--accent-yellow);stroke-width:1"/>${T(0, 3, 'PG', { a: 'middle', s: 7, b: 1, c: '--accent-yellow', sans: 1 })}</g>` + nombre(102);
    if (tipo === 'piedra') return cuerda + `<g transform="translate(31 60)"><path d="M-15 -2 L-9 -11 L5 -12 L15 -4 L13 8 L-2 12 L-13 7Z" style="fill:var(--text-dim);opacity:.9;stroke:var(--bg-main);stroke-width:1.2"/><path d="M-8 -5 L5 -7 M-9 2 L8 0 M-3 7 L6 6" style="stroke:var(--bg-main);stroke-width:.9"/></g>` + nombre(82);
    return '';
}
const MIEMBRO = (d, w = 8) => `<path d="${d}" style="fill:none;stroke:var(--text-dim);stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"/><path d="${d}" style="fill:none;stroke:var(--bg-main);stroke-width:${w - 2.4};stroke-linecap:round;stroke-linejoin:round"/><path d="${d}" style="fill:none;stroke:url(#inm-p-raya);stroke-width:${w - 2.4};stroke-linecap:round;stroke-linejoin:round"/>`;
function brazosSVG(b) {
    const [d, [x, y, puno]] = { 1: ['M-13 18 Q-20 30 -19 42', [-19, 45, false]], 2: ['M-13 18 L-22 31 L-13 38', [-12, 38, false]], 3: ['M-13 18 L-21 30 L-10 26', [-9, 25, true]], 4: ['M-12 17 L-16 26 L-6 21', [-5, 20, true]] }[b];
    const guante = k => puno ? `<circle cx="${k * x}" cy="${y}" r="3.8" style="fill:var(--text-dim);stroke:var(--bg-main);stroke-width:1"/>` : `<ellipse cx="${k * x}" cy="${y}" rx="3.4" ry="4" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1.4"/>`;
    let h = MIEMBRO(d) + MIEMBRO(espejoX(d)) + guante(1) + guante(-1);
    if (b === 4) h += `<path d="M-22 12 Q-25 16 -22 20 M22 12 Q25 16 22 20" style="fill:none;stroke:var(--accent-red);stroke-width:1"/>`;
    return h;
}
// El buzo: escafandra de latón con la cara del paciente en el visor; su manguera es el tubo al ventilador.
function buzoSVG(o) {
    let h = MIEMBRO('M-6 44 L-8 66') + MIEMBRO('M6 44 L8 66');
    h += `<path d="M-16 72 Q-16 64 -9 64 L-3 64 L-2 72Z M16 72 Q16 64 9 64 L3 64 L2 72Z" style="fill:var(--text-muted);stroke:var(--bg-main);stroke-width:1"/><path d="M-16 72.5 H-2 M16 72.5 H2" style="stroke:var(--text-dim);stroke-width:1.8"/>`;
    h += `<path d="M-14 15 Q0 10 14 15 L13 44 Q0 49 -13 44Z" style="fill:url(#inm-p-raya);stroke:var(--text-dim);stroke-width:1.4"/>`;
    h += `<path d="M-6 24 Q-4 33 -6 41 M6 24 Q4 33 6 41" style="fill:none;stroke:var(--text-muted);stroke-width:.7"/>`;
    h += `<rect x="-13.5" y="39" width="27" height="5" rx="1.5" style="fill:var(--text-muted);stroke:var(--bg-main);stroke-width:.8"/><rect x="-3" y="39.5" width="6" height="4" rx="1" style="fill:none;stroke:var(--accent-yellow);stroke-width:1"/>`;
    h += lastreSVG(o.lastre, 1, o.horas);
    h += brazosSVG(o.items.brazos);
    h += `<path d="M-15 13 Q0 6 15 13 L12 22 Q0 27 -12 22Z" style="fill:var(--bg-main);stroke:var(--accent-yellow);stroke-width:1.3"/>` + [[-9, 17.5], [0, 20.5], [9, 17.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" style="fill:var(--accent-yellow)"/>`).join('');
    h += `<circle r="16.5" style="fill:url(#inm-p-raya);stroke:var(--accent-yellow);stroke-width:1.8"/><circle r="15" style="fill:none;stroke:var(--bg-main);stroke-width:.6"/>`;
    h += [0, 60, 120, 180, 240, 300].map(g => { const a = g * Math.PI / 180; return `<circle cx="${n2(Math.cos(a) * 13.3)}" cy="${n2(Math.sin(a) * 13.3)}" r="1" style="fill:var(--accent-yellow)"/>`; }).join('');
    h += `<circle r="10.6" style="fill:var(--bg-main);stroke:var(--accent-yellow);stroke-width:1.5"/><g transform="scale(.66)">${caraSVG(o.items.cara, o.ojos)}</g>`;
    h += `<path d="M-7.5 -6.5 Q-4 -9.6 0 -9.2" style="fill:none;stroke:var(--text-main);stroke-width:.8;opacity:.55"/>`;
    h += `<rect x="10.5" y="-14" width="6" height="5" rx="1" transform="rotate(-35 13.5 -11.5)" style="fill:var(--accent-yellow);stroke:var(--bg-main);stroke-width:.6"/>`;
    if (o.agitado) h += `<path d="M-24 -6 Q-28 0 -24 6 M-28 -9 Q-34 0 -28 9 M24 -6 Q28 0 24 6 M28 -9 Q34 0 28 9" style="fill:none;stroke:var(--accent-red);stroke-width:1.1"/>`;
    if (o.delirio) h += `<path d="M0 -22 c8 -6 14 2 6 6 c-6 4 -12 -4 -4 -8 c6 -2 4 4 0 4" style="fill:none;stroke:var(--accent-purple);stroke-width:1.3;stroke-dasharray:2 1.5"/>`;
    return h;
}
function ojosDe(items, rass, mira) {
    if (items.cara >= 4) return 'apretados';
    if (mira) return 'abiertos';
    return rass >= 0 ? 'abiertos' : 'cerrados';
}

/* ---------- Partículas: lactato, H⁺ y la inflamación (tabla única de la app) ---------- */
let POOL = null;
function pool(gPart, clave, n, r) {
    const arr = [];
    for (let i = 0; i < n; i++) { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.innerHTML = svgParticula(clave, 0, 0, r); g.setAttribute('opacity', '0'); gPart.appendChild(g); arr.push({ g, vivo: false }); }
    return arr;
}
function soltar(clave, x0, y0, vx, vy, vida) {
    const p = POOL[clave].find(q => !q.vivo); if (!p) return;
    Object.assign(p, { vivo: true, x: x0, y: y0, vx, vy, t: 0, vida });
}
function moverParticulas(dt) {
    for (const k in POOL) for (const p of POOL[k]) {
        if (!p.vivo) continue;
        p.t += dt; if (p.t >= p.vida) { p.vivo = false; p.g.setAttribute('opacity', '0'); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (k === 'cito') p.x += Math.sin(p.t * 2 + p.vida) * 6 * dt;
        const a = Math.min(1, p.t * 3, (p.vida - p.t) * 2);
        p.g.setAttribute('transform', `translate(${n2(p.x)} ${n2(p.y)})`); p.g.setAttribute('opacity', n2(a * 0.95));
    }
}
function apagarParticulas() { for (const k in POOL) for (const p of POOL[k]) { p.vivo = false; p.g.setAttribute('opacity', '0'); } }

/* ---------- Los buzos ---------- */
let BUZOS = [];          // { g, x, y, anim, mira, i, llego, giro, subiendo }
const tormenta = { A: 2, Aobj: 2, nivel: 0 };
let llamando = false, esperaVoz = null;
function xs() { return D.par ? (D.par.length === 2 ? X_PAR : X_UNO) : X_SOLO; }
function rehacerBuzos() {
    const g = $('g-buzos'), cols = xs();
    if (BUZOS.length !== cols.length) {
        BUZOS.forEach(B => B.anim?.stop?.());
        g.innerHTML = ''; BUZOS = cols.map((x, i) => {
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.appendChild(el);
            return { g: el, x, y: i === 0 && BUZOS[0] ? BUZOS[0].y : SUP - 60, anim: null, mira: false, i };
        });
    }
    BUZOS.forEach((B, i) => { B.x = cols[i]; pintarBuzo(B); });
}
function datosBuzo(B) {
    const col = D.par ? D.par[B.i] : null;
    const rass = col ? (estado.subido && B.llego && col.min ? 0 : col.rass) : D.rass;
    const lastre = col ? (estado.subido && col.lastre !== 'esponja' ? null : col.lastre) : (estado.sedante ? SEDANTES[estado.sedante].lastre : null);
    return { col, rass, lastre };
}
function pintarBuzo(B) {
    const { rass, lastre } = datosBuzo(B);
    const items = D.items;
    B.g.innerHTML = buzoSVG({ items, ojos: ojosDe(items, rass, B.mira), lastre, horas: estado.horas, agitado: rass >= 2, delirio: estado.delirio && rass >= 2 });
}
function yObjetivo(B) { return yR(datosBuzo(B).rass); }
function moverBuzo(B, yFin, dur, ease = 'easeInOut', alFin) {
    if (B.anim) { B.anim.stop?.(); B.anim = null; }
    const Mo = M();
    if (!Mo || dur <= 0) { B.y = yFin; alFin && alFin(); dibujar(0); return; }
    const y0 = B.y;
    B.anim = Mo.animate(0, 1, { duration: dur, ease, onUpdate: v => { B.y = lerp(y0, yFin, v); }, onComplete: () => { B.anim = null; alFin && alFin(); } });
    arrancar();
}
// El paciente se sumerge al entrar por la ventana de la cabeza de la cama 7
export function sumergir() {
    const B = BUZOS[0];
    if (!B || D.par || !M()) return;
    B.y = SUP - 46; moverBuzo(B, yObjetivo(B), 1.5, 'easeOut');
}

/* ---------- Lo que se pinta cuando cambia el estado ---------- */
function pintarAceite() {
    const g = $('g-aceite');
    if (!estado.opioide || D.par) { g.innerHTML = ''; return; }
    const o = OPIOIDES[estado.opioide], ket = estado.ahorro.includes('ketorolaco');
    const s = ket ? 0.75 : 1;
    let h = `<g data-toca="aceite" role="button" aria-label="El aceite del opioide"><rect x="86" y="28" width="70" height="56" fill="transparent"/><g transform="translate(112 70) rotate(28) scale(${s})"><path d="M-9 -7 h14 a4 4 0 0 1 4 4 v10 a4 4 0 0 1 -4 4 h-14 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 4 -4Z" style="fill:url(#inm-p-raya);stroke:var(--accent-blue);stroke-width:1.1"/><path d="M9 -2 L22 -8 L22 -5 L10 2" style="fill:var(--accent-blue);opacity:.8"/><path d="M-6 -7 v-4 h8 v4" style="fill:none;stroke:var(--accent-blue);stroke-width:1"/></g></g>`;
    h += `<g id="inm-gotas-aceite">${[0, 1, 2].map(() => `<circle cx="128" cy="78" r="1.4" style="fill:var(--accent-blue)" opacity="0"/>`).join('')}</g>`;
    h += T(92, 38, o.n, { s: 7.4, b: 1, c: '--accent-blue', sans: 1 }) + T(92, 47, `inicio ${o.inicio}`, { s: 6.8, c: '--accent-blue', sans: 1 });
    let l2 = '';
    if (estado.renal === 'ir') l2 = `IR: ${o.irC.replace(' el mantenimiento', '').replace(' (IR terminal)', '')}`;
    else if (ket) l2 = 'ketorolaco: −25-50 %';
    else if (estado.opioide === 'remifentanilo') l2 = 'se va en 10 min';
    if (l2) h += T(92, 56, l2, { s: 6.8, c: estado.renal === 'ir' && estado.opioide === 'morfina' ? '--accent-red' : '--text-dim', sans: 1, b: 1 });
    g.innerHTML = h;
}
function pintarVent() {
    const v = D.items.vent;
    let h = `<rect x="304" y="4" width="52" height="30" rx="4" style="fill:url(#inm-p-raya);stroke:var(--text-muted);stroke-width:1"/><rect x="308" y="8" width="26" height="12" style="fill:var(--bg-main);stroke:var(--text-muted);stroke-width:.6"/>`;
    h += `<path d="M309 16 l4 -5 l3 7 l3 -5 l4 3 l3 -2 l4 1" style="fill:none;stroke:${v >= 3 ? 'var(--accent-red)' : 'var(--accent-yellow)'};stroke-width:.8"/>`;
    h += T(330, 30, 'ventilador', { a: 'middle', s: 6.8, i: 1, c: '--text-muted' });
    if (v >= 3) h += `<g><path d="M346 9 l6 10 h-12Z" style="fill:var(--accent-red)"/>${T(346, 18, '!', { a: 'middle', s: 7, b: 1, c: '--bg-main', sans: 1 })}</g>`;
    $('g-vent').innerHTML = h;
}
function pintarMonitor() {
    const q = k => ocultos.has(k);
    const fc = D.fc, pa = D.pa;
    let h = `<g data-toca="monitor" role="button" aria-label="El monitor: FC y PA"><rect x="266" y="38" width="90" height="54" rx="4" style="fill:var(--bg-main);stroke:var(--border-color);stroke-width:1"/>`;
    h += `<path id="inm-ecg" d="" style="fill:none;stroke:var(${D.av.pris || D.av.pg ? '--accent-red' : '--accent-green'});stroke-width:1"/>`;
    h += T(270, 68, 'FC', { s: 6.8, c: '--text-muted', sans: 1 }) + T(281, 69, q('fc') ? '?' : fc.txt, { s: 10, b: 1, c: fc.fuera ? '--accent-red' : '--text-main', sans: 1 });
    h += T(305, 68, 'PA', { s: 6.8, c: '--text-muted', sans: 1 }) + T(316, 69, q('pa') ? '?' : pa.txt, { s: 10, b: 1, c: pa.fuera ? '--accent-red' : '--text-main', sans: 1 });
    const alarma = D.av.pris ? ['IC sistólica · lactato ↑', 'rabdomiólisis'] : D.av.pg ? ['acidosis láctica', 'hiato osmolar >10'] : D.av.hipoPA ? ['caída marcada', 'sin cifra'] : null;
    if (alarma) h += T(311, 79, alarma[0], { a: 'middle', s: 6.8, b: 1, c: '--accent-red', sans: 1 }) + T(311, 88, alarma[1], { a: 'middle', s: 6.8, b: 1, c: '--accent-red', sans: 1 });
    else h += T(311, 82, 'mala guía del dolor', { a: 'middle', s: 6.8, i: 1, c: '--text-muted' });
    if (D.av.pris || D.av.pg) h += `<rect x="266" y="38" width="90" height="54" rx="4" class="inm-anillo-svg" style="fill:none;stroke:var(--accent-red);stroke-width:1.6"/>`;
    $('g-monitor').innerHTML = h + '</g>';
}
// La tira bajo la lámina: la Tabla 6.7 (o lo que cuenta cada subida), fuera del agua
function pintarTira() {
    const t = $('tira-par');
    if (!D.par) { t.hidden = true; return; }
    t.hidden = false;
    const tap = ocultos.has('reloj');
    if (estado.sedante === 'propofol') {
        const cols = Object.entries(TABLA_6_7), aq = k => +k === estado.horas ? ' inm-aqui' : '';
        t.className = 'inm-tira';
        t.innerHTML = `<span class="inm-tt">Tabla 6.7</span>${cols.map(([k, x]) => `<span class="inm-th${aq(k)}">${x.n.replace(' horas', ' h')}</span>`).join('')}`
            + `<span class="inm-tl">ligera</span>${cols.map(([k, x]) => `<span class="inm-v inm-v-ok${aq(k)}">${tap && aq(k) ? '?' : x.lig}</span>`).join('')}`
            + `<span class="inm-tl">profunda</span>${cols.map(([k, x]) => `<span class="inm-v inm-v-mal${aq(k)}">${tap && aq(k) ? '?' : x.prof}</span>`).join('')}`
            + `<span class="inm-org">ficha · p. 29</span>`;
        return;
    }
    t.className = 'inm-tira inm-una';
    if (estado.sedante === 'midazolam' || estado.sedante === 'lorazepam') t.innerHTML = `<b class="inm-c-oro">Un estudio:</b> midazolam <b class="inm-c-rojo">${tap ? '?' : '30 h'}</b> frente a lorazepam <b class="inm-c-verde">${tap ? '?' : '4-5 h'}</b> para despertar. Pero las guías más recientes: <b class="inm-c-rojo">evitar las BZD</b> en el ventilado. <span class="inm-org">ficha · p. 26, 27</span>`;
    else if (estado.sedante === 'dexmedetomidina') t.innerHTML = `<b class="inm-c-oro">Tabla 6.6:</b> despertar en ${tap ? '?' : '6-10 min'}; y sin pararla, se despierta al llamarle (cooperativa). <span class="inm-org">ficha · p. 27, 29</span>`;
    else t.innerHTML = `<b class="inm-c-oro">Diazepam:</b> vida media de 90 h y metabolitos activos; la ficha no da cuánto tarda en despertar. <span class="inm-org inm-ilu">ficha · p. 25 · hueco</span>`;
}
function pintarDerecha() {
    const g = $('g-derecha');
    pintarTira();
    if (D.par) { g.innerHTML = ''; return; }
    const [cx, cy, r] = MED, it = D.items, oc = ocultos.has('bps');
    let h = `<path id="inm-guia-med" d="" style="fill:none;stroke:var(--accent-blue);stroke-width:.7;stroke-dasharray:2 3;opacity:.7"/>`;
    h += `<g data-toca="medallon" role="button" aria-label="La cara: escala BPS">`;
    h += T(cx, cy - r - 6, 'la cara · Tabla 6.1', { a: 'middle', s: 7, c: '--accent-blue', sans: 1, b: 1 });
    h += `<circle cx="${cx}" cy="${cy}" r="${r + 3}" style="fill:var(--bg-main);stroke:var(--accent-blue);stroke-width:.8"/><circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--bg-main);stroke:var(--accent-blue);stroke-width:1.8"/>`;
    h += `<g clip-path="url(#inm-clip-med)"><g transform="translate(${cx} ${cy + 3}) scale(1.18)">${caraGrabado(it.cara, ojosDe(it, D.rass, BUZOS[0]?.mira), it.brazos)}</g></g>`;
    h += T(cx, cy + r + 15, oc ? 'BPS ?' : `BPS ${D.bps}`, { a: 'middle', s: 12, b: 1, c: oc ? '--text-main' : D.bps >= 6 ? '--accent-red' : '--accent-green' });
    h += T(cx, cy + r + 25, oc ? 'cara ? · brazos ?' : `cara ${it.cara} · brazos ${it.brazos}`, { a: 'middle', s: 7, c: '--text-dim', sans: 1 });
    h += T(cx, cy + r + 34, oc ? 'ventilador ?' : `ventilador ${it.vent}`, { a: 'middle', s: 7, c: '--text-dim', sans: 1 });
    h += T(cx, cy + r + 43, '≥6 = dolor inaceptable', { a: 'middle', s: 6.8, i: 1, c: '--text-muted' });
    g.innerHTML = h + '</g>';
}
function pintarRotulos() {
    const av = D.av; let l1 = '', l2 = '', c = '--accent-red';
    if (D.par) {
        if (estado.sedante === 'propofol') { l1 = estado.subido ? 'A la superficie: el ligero llega enseguida; el profundo tarda «días».' : 'Mismo propofol, mismas horas. Predice: ¿quién sube antes?'; l2 = 'subida en escala logarítmica · ilustrativo'; c = '--accent-yellow'; }
        else if (estado.sedante === 'midazolam' || estado.sedante === 'lorazepam') { l1 = 'La esponja del midazolam no se suelta del todo.'; l2 = 'un estudio · y las guías: evitar las BZD en el ventilado'; c = '--accent-yellow'; }
        else if (estado.sedante === 'dexmedetomidina') { l1 = 'La boya: sube en 6-10 min (Tabla 6.6).'; c = '--accent-yellow'; }
        else l1 = 'Diazepam: vida media de 90 h; la ficha no da su despertar.';
    } else if (av.haloBloq) { l1 = 'QTc >500 ms: el haloperidol no se usa.'; l2 = 'torsade de pointes: 3-4 % con haloperidol IV'; }
    else if (estado.halo && estado.delirio) { l1 = 'Haloperidol 5 mg IV: efecto a los 10-20 min, dura 3-4 h.'; l2 = 'si no responde: 10 mg · QTc >500 ms: no'; c = '--accent-yellow'; }
    else if (estado.delirio) { l1 = estado.sedante === 'dexmedetomidina' ? 'Delirio: la dexmedetomidina es la de elección.' : 'Delirio (no por abstinencia): dexmedetomidina de elección.'; l2 = estado.bradi ? 'no la tolera (bradicardia o hipotensión): haloperidol' : ''; c = '--accent-purple'; }
    else if (av.pris) { l1 = 'SIP: IC sistólica brusca · acidosis láctica · rabdomiólisis'; l2 = 'incidencia 3 % · mortalidad 30-35 %'; }
    else if (av.pg) { l1 = 'El barril gotea: propilenglicol → ácido láctico.'; l2 = 'vigila el hiato osmolar (>10); el lactato no lo predice'; }
    else if (av.midaz) { l1 = 'La esponja pesa: se acumula en el SNC.'; l2 = 'perfusión de midazolam: ≤48 h'; }
    else if (av.trampa) { l1 = 'Le hunde, pero la tormenta sigue: no quita el dolor.'; l2 = 'Fig. 6.1: ~80 % de los residentes contestó mal'; }
    else if (av.sinAnalgesia) { l1 = estado.sedante === 'propofol' ? 'Propofol: sedante, sin efecto analgésico.' : 'Sedado, y le sigue doliendo.'; l2 = 'el dolor se trata con analgesia'; }
    else if (estado.sedante === 'dexmedetomidina') { l1 = 'La boya: sedación cooperativa.'; l2 = 'llámale: sube, mira y vuelve solo'; c = '--accent-yellow'; }
    else if (estado.inflamacion) { l1 = 'Inflamación: el mismo gesto levanta olas más altas.'; l2 = 'hipernocicepción'; c = '--accent-purple'; }
    let h = '';
    if (l1) h += T(180, 312, l1, { a: 'middle', s: 7.6, b: 1, c, sans: 1 });
    if (l2) h += T(180, 323, l2, { a: 'middle', s: 7, i: 1, c: '--text-dim' });
    $('g-rotulos').innerHTML = h;
}
function pintarRelojes() {
    const g = $('g-relojes');
    if (!D.par) { g.innerHTML = ''; return; }
    const cols = xs();
    g.innerHTML = D.par.map((c, i) => {
        const x = cols[i], val = ocultos.has('reloj') || !(estado.subido && BUZOS[i]?.llego) ? '?' : (c.t || 'sin cifra');
        const col = c.k === 'profunda' || c.k === 'midazolam' ? '--accent-red' : '--accent-green';
        let ticks = '';
        for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ticks += `<line x1="${n2(x + Math.cos(a) * 13)}" y1="${n2(30 + Math.sin(a) * 13)}" x2="${n2(x + Math.cos(a) * 16)}" y2="${n2(30 + Math.sin(a) * 16)}" style="stroke:var(--accent-yellow);stroke-width:${k % 3 ? 0.6 : 1.2}"/>`; }
        return `<g data-reloj="${c.k}" data-valor="${val}"><circle cx="${x}" cy="30" r="20" style="fill:var(--bg-main);stroke:var(--accent-yellow);stroke-width:1"/><circle cx="${x}" cy="30" r="17.5" style="fill:url(#inm-p-raya2);stroke:var(--accent-yellow);stroke-width:.6"/>${ticks}
      <line class="inm-aguja-reloj" data-i="${i}" x1="${x}" y1="30" x2="${x}" y2="17" style="stroke:var(--text-main);stroke-width:1.6;stroke-linecap:round"/><circle cx="${x}" cy="30" r="1.6" style="fill:var(--text-main)"/>
      <rect x="${x - 26}" y="52" width="52" height="15" rx="3" style="fill:var(--bg-main);stroke:var(--border-color)"/>${T(x, 63, val, { a: 'middle', s: 10, b: 1, c: val === '?' ? '--text-main' : col, sans: 1 })}
      ${T(x, 76, c.k + (c.suya ? ' · su cama' : ''), { a: 'middle', s: 7, i: 1, c: c.suya ? '--accent-yellow' : '--text-dim' })}</g>`;
    }).join('');
}
function pintarBoya() {
    $('g-boya').innerHTML = estado.sedante === 'dexmedetomidina' ? `<path id="inm-cuerda-boya" d="" style="fill:none;stroke:var(--text-muted);stroke-width:1;stroke-dasharray:3 2"/><g id="inm-boya"><ellipse rx="10" ry="6.5" style="fill:var(--accent-yellow);stroke:var(--bg-main);stroke-width:1"/><path d="M-4 -6 V6 M3 -6.3 V6.3" style="stroke:var(--bg-main);stroke-width:2"/><path d="M0 -6.5 V-14" style="stroke:var(--text-dim);stroke-width:1"/><circle cy="-15" r="1.8" style="fill:var(--accent-red)"/></g>${T(0, 0, 'boya: dexmedetomidina', { s: 6.8, b: 1, c: '--accent-yellow', sans: 1, id: 'boya-txt' })}` : '';
}
function pintarEscena() {
    tormenta.nivel = (D.bps - 3) / 9;
    tormenta.Aobj = 1.5 + tormenta.nivel * 22;
    $('g-nubes').style.opacity = n2(0.2 + tormenta.nivel * 0.8);
    rehacerBuzos(); pintarAceite(); pintarVent(); pintarMonitor(); pintarDerecha(); pintarRotulos(); pintarRelojes(); pintarBoya();
    $('g-aguja').style.opacity = D.par ? 0.25 : 1;
    $('g-tubos').innerHTML = BUZOS.map(() => `<path class="inm-tubo-a" d="" style="stroke:var(--text-muted);stroke-width:3.2"/><path class="inm-tubo-b" d="" style="stroke:var(--bg-main);stroke-width:1.1"/>`).join('');
    if (!enMarcha) dibujar(0);
}

/* ---------- El bucle: olas, lluvia, rayos, tubos, monitor y partículas ---------- */
let tiempo = 0, enMarcha = false, tPrev = 0, visible = false, proxRayo = 1.5, emitir = 0;
const fotogramas = [];
const olaY = x => SUP + tormenta.A * Math.sin(x * 0.075 - tiempo * (1.2 + tormenta.nivel * 2.2)) + tormenta.A * 0.35 * Math.sin(x * 0.17 + tiempo * 1.7);
function dibujar(dt) {
    tiempo += dt;
    tormenta.A += (tormenta.Aobj - tormenta.A) * Math.min(1, dt * (estado.opioide ? 1 / Math.max(0.4, OPIOIDES[estado.opioide].vel) : 2.5));
    if (dt === 0) tormenta.A = tormenta.Aobj;
    // olas
    let linea = '', espuma = '';
    for (let x = -6; x <= 366; x += 6) { const y = olaY(x); linea += `${x < 0 ? 'M' : 'L'}${x} ${n2(y)}`; espuma += `${x < 0 ? 'M' : 'L'}${x} ${n2(y + 5 + Math.sin(x * 0.3 + tiempo * 2) * tormenta.A * 0.1)}`; }
    $('ola-linea').setAttribute('d', linea); $('ola-espuma').setAttribute('d', espuma);
    const mascara = `M-6 -2 H366 V${n2(olaY(366))} ` + linea.replace(/^M/, 'L').split('L').reverse().filter(Boolean).map(p => 'L' + p).join('') + 'Z';
    $('ola-mascara').setAttribute('d', mascara); $('ola-cielo').setAttribute('d', mascara);
    const aceite = $('ola-aceite');
    if (estado.opioide && !D.par) { let a = ''; for (let x = 90; x <= 250; x += 6) a += `${x === 90 ? 'M' : 'L'}${x} ${n2(olaY(x) - 1)}`; aceite.setAttribute('d', a); aceite.setAttribute('opacity', '.45'); } else aceite.setAttribute('opacity', '0');
    // lluvia
    const nLluvia = Math.round(tormenta.nivel * 28);
    [...$('g-lluvia').children].forEach((l, i) => {
        if (i >= nLluvia) { l.setAttribute('opacity', '0'); return; }
        const x = 90 + ((i * 53.3) % 180), y = ((tiempo * 120 + i * 37) % 90) + 8;
        if (y > olaY(x) - 4) { l.setAttribute('opacity', '0'); return; }
        l.setAttribute('x1', n2(x)); l.setAttribute('y1', n2(y)); l.setAttribute('x2', n2(x - 3)); l.setAttribute('y2', n2(y + 9)); l.setAttribute('opacity', '.7');
    });
    // rayo con BPS ≥ 9
    const rayo = $('rayo');
    if (D.bps >= 9 && !REDUCIR) { proxRayo -= dt; if (proxRayo < 0) proxRayo = 2.4 + Math.random() * 1.6; rayo.setAttribute('opacity', proxRayo > 2.25 && dt ? '1' : '0'); }
    else rayo.setAttribute('opacity', D.bps >= 9 && REDUCIR ? '.8' : '0');
    // gotas de aceite
    const gotas = $('gotas-aceite');
    if (gotas) [...gotas.children].forEach((c, i) => { const u = ((tiempo * 0.9 + i / 3) % 1); c.setAttribute('cx', n2(128 + u * 4)); c.setAttribute('cy', n2(78 + u * (olaY(130) - 78))); c.setAttribute('opacity', REDUCIR ? '.8' : n2(1 - u * 0.6)); });
    // buzos y tubos
    const vent = D.items.vent, tubosA = $('g-tubos').querySelectorAll('.inm-tubo-a'), tubosB = $('g-tubos').querySelectorAll('.inm-tubo-b');
    BUZOS.forEach((B, i) => {
        const bob = REDUCIR ? 0 : Math.sin(tiempo * 1.3 + i) * 1.6 + (B.y <= SUP + 4 ? (olaY(B.x) - SUP) * 0.6 : 0);
        const agit = datosBuzo(B).rass >= 2 && !REDUCIR ? Math.sin(tiempo * 9) * 1.4 : 0;
        const y = B.y + bob;
        B.g.setAttribute('transform', `translate(${n2(B.x + agit)} ${n2(y)}) scale(${SC})`);
        const sx = B.x + agit + 15 * SC, sy = y - 13 * SC, w = vent >= 3 && !REDUCIR ? (vent - 2) * 3 * Math.sin(tiempo * 11 + i) : 0;
        const d = `M${n2(sx)} ${n2(sy)} C${n2(sx + 18 + w)} ${n2(sy - 6)} ${n2(sx + 36)} ${n2(20 + w)} ${VENT[0]} ${VENT[1]}`;
        if (tubosA[i]) { tubosA[i].setAttribute('d', d); tubosB[i].setAttribute('d', d); }
        if (i === 0) {
            $('aguja').setAttribute('transform', `translate(0 ${n2(D.par ? yR(D.par[0].rass) : y)})`);
            const guia = $('guia-med'); if (guia) guia.setAttribute('d', `M${n2(B.x + 12)} ${n2(y - 4)} L${MED[0] - MED[2] - 4} ${MED[1]}`);
            const boya = $('boya');
            if (boya) { const bx = B.x + 34, by = olaY(bx) + 2; boya.setAttribute('transform', `translate(${n2(bx)} ${n2(by)})`); $('cuerda-boya').setAttribute('d', `M${n2(bx)} ${n2(by + 5)} Q${n2(bx - 4)} ${n2((by + y) / 2 + 10)} ${n2(B.x + 6 * SC)} ${n2(y + 44 * SC)}`); const bt = $('boya-txt'); bt.setAttribute('x', n2(bx + 13)); bt.setAttribute('y', n2(by + 14)); }
        }
    });
    // relojes que giran durante la subida
    $('g-relojes').querySelectorAll('.inm-aguja-reloj').forEach(a => {
        const B = BUZOS[+a.dataset.i]; if (!B) return;
        a.setAttribute('transform', `rotate(${n2(B.giro || 0)} ${B.x} 30)`);
    });
    // ECG del monitor
    const ecg = $('ecg');
    if (ecg) {
        let p = ''; const fase = (tiempo * 1.35) % 1;
        for (let x = 0; x <= 84; x += 2) { const u = ((x / 84) * 2.2 + fase) % 1; const yy = u > 0.46 && u < 0.5 ? -8 : u >= 0.5 && u < 0.54 ? 4 : u > 0.7 && u < 0.78 ? -2 : 0; p += `${x ? 'L' : 'M'}${269 + x} ${50 + yy}`; }
        ecg.setAttribute('d', p);
    }
    // partículas: el barril del lorazepam, el SIP y la inflamación
    if (!REDUCIR && dt) {
        emitir += dt;
        const B = BUZOS[0];
        if (B && emitir > 0.35) {
            emitir = 0;
            if (D.av.pg && !D.par) { const bx = B.x + 31 * SC, by = B.y + 90 * SC; soltar('lact', bx, by, (Math.random() - 0.5) * 14, -6 - Math.random() * 6, 3.2); if (Math.random() < 0.5) soltar('h', bx + 4, by, 8, -5, 3); }
            if (D.av.pris && !D.par) { soltar('lact', B.x + (Math.random() - 0.5) * 20, B.y + 30 * SC, (Math.random() - 0.5) * 10, -10, 3); if (Math.random() < 0.4) soltar('h', B.x - 10, B.y + 20, -6, -8, 2.6); }
            if (estado.inflamacion && !D.par) soltar('cito', 100 + Math.random() * 150, olaY(140) - 20 - Math.random() * 30, (Math.random() - 0.5) * 8, 6, 3.5);
        }
    }
    moverParticulas(dt);
}
function bucle(ahora) {
    if (!enMarcha) return;
    const dt = Math.min(0.05, (ahora - tPrev) / 1000); tPrev = ahora;
    const t0 = performance.now(); dibujar(dt); fotogramas.push(performance.now() - t0); if (fotogramas.length > 400) fotogramas.shift();
    if (visible && !document.hidden) requestAnimationFrame(bucle); else enMarcha = false;
}
export function arrancar() { if (REDUCIR) { pintarUnaVez(); return; } if (enMarcha || !visible) return; enMarcha = true; tPrev = performance.now(); requestAnimationFrame(bucle); }
export function ponerVisible(v) { visible = v; if (v) arrancar(); }
// Con «reducir movimiento», el estado final: el barril y el SIP ya han soltado su lactato
function pintarUnaVez() {
    apagarParticulas(); dibujar(0);
    const B = BUZOS[0];
    if (B && !D.par && (D.av.pg || D.av.pris)) { soltar('lact', B.x + 6, B.y + 50, 0, 0, 99); soltar('h', B.x + 14, B.y + 54, 0, 0, 99); soltar('lact', B.x - 12, B.y + 30, 0, 0, 99); moverParticulas(0.5); }
}
export function estadoBucle() {
    const n = fotogramas.length, medio = n ? n2(fotogramas.reduce((a, b) => a + b, 0) / n) : 0;
    return { enMarcha, visible, fotogramas: { n, medio, max: n ? n2(Math.max(...fotogramas)) : 0 } };
}
export function vaciarFotogramas() { fotogramas.length = 0; }

/* ---------- La subida (Tabla 6.7) y la voz (RASS, paso 2) ---------- */
function subir() {
    if (!D.par) return;
    const Mo = M();
    BUZOS.forEach((B, i) => {
        const c = D.par[i];
        // el lastre se suelta y cae al fondo (la esponja del midazolam, no del todo)
        if (c.lastre && c.lastre !== 'esponja' && c.min && Mo) {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); $('g-lastres-caidos').appendChild(g);
            g.innerHTML = lastreSVG(c.lastre).replace(/<path class="inm-cuerda"[^>]*\/>/, '');
            const y0 = B.y, x0 = B.x;
            Mo.animate(0, 1, { duration: 1.1, ease: 'easeIn', onUpdate: v => g.setAttribute('transform', `translate(${n2(x0)} ${n2(lerp(y0, 250, v))}) scale(${SC})`), onComplete: () => setTimeout(() => g.remove(), 1500) });
        }
        if (!c.min) { B.llego = true; return; }
        const dur = durSubida(c.min);
        B.giro = 0;
        if (!Mo) { B.y = SUP; B.llego = true; return; }
        B.subiendo = true;
        Mo.animate(0, 1, { duration: dur, ease: 'linear', onUpdate: v => { B.giro = v * dur * 420; } });
        moverBuzo(B, SUP, dur, 'easeOut', () => { B.subiendo = false; if (!estado.subido) return; B.llego = true; pintarBuzo(B); pintarRelojes(); pintarTablero(); });
    });
    if (!Mo) { BUZOS.forEach(pintarBuzo); pintarRelojes(); pintarTablero(); dibujar(0); }
}
export function respuestaVoz(tipo, e = estado, d = D) {
    const r = d.rass, dexm = e.sedante === 'dexmedetomidina';
    if (tipo === 'voz') {
        if (dexm) return { y: SUP, mira: true, espera: 1.8, txt: 'Dexmedetomidina: <span class="hl">se despierta sin bajar la perfusión</span>, te mira y vuelve sola a su sitio. Sedación cooperativa.', f: 'ficha · mar-dexmedetomidina' };
        if (r >= 0) return { txt: 'Ya está despierto: basta con observarle (paso 1: de 0 a +4).', f: 'ficha · mar-rass-pasos' };
        if (r === -1) return { y: SUP, mira: true, espera: 2.2, txt: 'RASS −1: <span class="hl">se despierta a la voz más de 10 s</span>, con contacto visual.', f: 'ficha · mar-tabla-6-4' };
        if (r === -2) return { y: Y[-1] - 8, mira: true, espera: 0.5, txt: 'RASS −2: <span class="hl">se despierta brevemente (&lt;10 s)</span>, con contacto visual, y vuelve a hundirse.', f: 'ficha · mar-tabla-6-4' };
        if (r === -3) return { y: Y[-3] - 14, mira: false, espera: 0.3, txt: 'RASS −3: algún movimiento a la voz, <span class="hl-rojo">sin contacto visual</span>.', f: 'ficha · mar-tabla-6-4' };
        return { txt: `RASS ${signo(r)}: <span class="hl-rojo">no responde a la voz</span>. Paso 3: sacudirle el hombro; si no, frotar el esternón.`, f: 'ficha · mar-rass-pasos' };
    }
    if (r >= -3) return { txt: 'Responde a la voz: no hace falta el estímulo físico (paso 2, de −1 a −3).', f: 'ficha · mar-rass-pasos' };
    if (r === -4) return { y: Y[-4] - 14, mira: false, espera: 0.3, txt: 'RASS −4: no responde a la voz, pero <span class="hl">se mueve con el estímulo físico</span>.', f: 'ficha · mar-tabla-6-4' };
    return { txt: 'RASS −5: <span class="hl-rojo">no responde ni a la voz ni al estímulo físico</span>.', f: 'ficha · mar-tabla-6-4' };
}
// Llamarle o sacudirle: el buzo sube lo que dice la Tabla 6.4 y vuelve. Devuelve la respuesta (la frase la dice la interfaz).
export function llamar(tipo) {
    if (D.par || llamando) return null;
    marcarLlamado();
    const res = respuestaVoz(tipo), B = BUZOS[0];
    if (res.y == null || !B) return res;
    if (!M()) { B.mira = !!res.mira; pintarBuzo(B); pintarDerecha(); dibujar(0); return res; }
    llamando = true;
    moverBuzo(B, res.y, 0.7, 'easeOut', () => {
        B.mira = !!res.mira; pintarBuzo(B); pintarDerecha();
        esperaVoz = setTimeout(() => { esperaVoz = null; B.mira = false; pintarBuzo(B); pintarDerecha(); moverBuzo(B, yObjetivo(B), 1, 'easeInOut', () => { llamando = false; }); }, res.espera * 1000);
    });
    return res;
}

/* ============================================================
   El tablero (como el monitor de la circulación viva) y lo que hay que mirar
   ============================================================ */
const CELDAS = [{ k: 'bps', n: 'BPS' }, { k: 'rass', n: 'RASS' }, { k: 'fc', n: 'FC' }, { k: 'pa', n: 'PA' }, { k: 'reloj', n: 'Despertar' }];
export function pintarTablero() {
    const q = k => ocultos.has(k), f = estado.fijo, par = D.par;
    const caso = '<span class="inm-o inm-caso">del caso</span>', ilu = '<span class="inm-o inm-ilu">ilustr.</span>';
    const celda = (k, b, u, o, cl = '') => `<div class="inm-celda ${cl}" id="inm-c-${k}"><span class="inm-k">${CELDAS.find(c => c.k === k).n}</span><b>${q(k) ? '?' : b}</b><span class="inm-u">${u}</span>${o}</div>`;
    let h = celda('bps', D.bps, '/12 · ≥6 malo', f.bps != null ? caso : ilu, q('bps') ? '' : D.bps >= 6 ? 'inm-fuera' : 'inm-bien');
    const rass = par ? (estado.subido && BUZOS.every(B => B.llego) && par.every(c => c.min) ? 0 : null) : D.rass;
    h += celda('rass', rass == null ? '—' : signo(rass), rass == null ? 'dos camas' : RASS_TERM[rass], f.rass != null ? caso : ilu, rass != null && rass > 0 ? 'inm-fuera' : '');
    h += celda('fc', D.fc.txt, D.fc.u || 'lpm', D.fc.o === 'caso' ? caso : `<span class="inm-o inm-ilu">${D.fc.o}</span>`, D.fc.fuera ? 'inm-fuera' : '');
    h += celda('pa', D.pa.txt, D.pa.u || 'mmHg', D.pa.o === 'caso' ? caso : `<span class="inm-o inm-ilu">${D.pa.o}</span>`, D.pa.fuera ? 'inm-fuera' : '');
    let dv = '—', du = 'pulsa Despertar';
    if (par) { const s = par.find(c => c.suya) || par[0]; const llego = BUZOS.every(B => B.llego); dv = estado.subido && llego ? (s.t || 'sin cifra') : '?'; du = s.k + (s.estudio ? ' · un estudio' : ''); }
    h += celda('reloj', dv, du, par ? '<span class="inm-o">ficha</span>' : '', '');
    $('tablero').innerHTML = h;
    if (anilloObj) mirar(anilloObj);
}
export function setOcultos(arr, repintar = true) {
    ocultos.clear(); (arr || []).forEach(k => ocultos.add(k));
    if (repintar) { pintarTablero(); pintarDerecha(); pintarMonitor(); pintarRelojes(); }
}
// El anillo dorado: sobre una celda del tablero o sobre una pieza de la lámina
export let anilloObj = null;
export const ANCLAS = ['medallon', 'monitor', 'buzo', 'aceite', 'vent', 'relojes', 'regla', 'bps', 'rass', 'fc', 'pa', 'reloj'];
export function mirar(k) {
    anilloObj = k || null;
    const esCelda = CELDAS.some(c => c.k === k);
    document.querySelectorAll('.inm-celda.inm-mira').forEach(c => c.classList.remove('inm-mira'));
    if (esCelda && $('c-' + k)) $('c-' + k).classList.add('inm-mira');
    const B = BUZOS[0];
    const POS = { medallon: [311, 198, 46], monitor: [311, 64, 36], buzo: B ? [B.x, B.y + 14, 34] : null, aceite: [118, 60, 28], vent: [330, 19, 22], relojes: [188, 42, 66], regla: [20, 140, 26] };
    const g = $('g-anillo'); g.innerHTML = '';
    if (esCelda || !k || !POS[k]) return;
    const [x, y, r] = POS[k];
    g.innerHTML = `<circle class="inm-anillo-svg" cx="${n2(x)}" cy="${n2(y)}" r="${r}" style="fill:none;stroke:var(--accent-blue);stroke-width:2.2"/>`;
}

/* ============================================================
   Aplicar un estado: todo se repinta desde aquí. Devuelve el estado anterior (para la frase viva).
   ============================================================ */
export function aplicarModelo(nuevo, { inmediato = false } = {}) {
    const viejo = estado;
    // un cambio de orden corta la respuesta a la voz que estuviera en marcha
    if (llamando || esperaVoz) { clearTimeout(esperaVoz); esperaVoz = null; llamando = false; BUZOS.forEach(B => { B.mira = false; }); }
    estado = nuevo; D = derivar(estado);
    const sube = estado.par && estado.subido && !(viejo.par && viejo.subido && viejo.sedante === estado.sedante && viejo.horas === estado.horas);
    if (!estado.subido) BUZOS.forEach(B => { B.llego = false; B.giro = 0; B.subiendo = false; });
    pintarEscena();
    if (sube) {
        BUZOS.forEach((B, i) => { if (B.anim) { B.anim.stop?.(); B.anim = null; } B.llego = false; B.giro = 0; B.y = yR(D.par[i].rass); });
        BUZOS.forEach(pintarBuzo); pintarRelojes();
        subir();
    } else {
        const dur = inmediato || !visible ? 0 : estado.sedante === 'diazepam' && viejo.sedante !== 'diazepam' ? 1.7 : 1.0;
        BUZOS.forEach(B => { if (B.subiendo && estado.subido) return; const yf = yObjetivo(B); if (Math.abs(B.y - yf) > 0.5) moverBuzo(B, yf, dur); });
    }
    pintarTablero();
    // lo que ya no se suelta (lactato, H⁺, citoquinas) se borra al cambiar de estado
    if (!(D.av.pg || D.av.pris || estado.inflamacion) || D.par) apagarParticulas();
    if (REDUCIR) pintarUnaVez(); else arrancar();
    return viejo;
}

/* ============================================================
   Arranque de la escena
   ============================================================ */
export function initEscena() {
    REDUCIR = sinMovimiento();
    $('mar').innerHTML = ESQUELETO;
    const gPart = $('g-part');
    POOL = { lact: pool(gPart, 'lact', 16, 3.2), h: pool(gPart, 'h', 10, 3), cito: pool(gPart, 'cito', 8, 3.4) };
    construirFondo(); construirRegla();
    aplicarModelo(estadoBase(), { inmediato: true });
}
