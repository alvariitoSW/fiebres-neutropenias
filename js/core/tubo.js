// El tubo (pieza común del bloque 2): la lupa de un tubo de laboratorio. Una sola pieza para el capilar vivo (el
// hematocrito centrifugado: la misma masa de hematíes con más plasma, Marino Fig. 12.1) y el vaso que sangra (el tubo
// con EDTA, con las plaquetas en grumos). Solo dibuja: los rótulos y las cifras los pone el modelo que la usa.
//
// svgTubosHto({ a, b, rotulos: [antes, después], prefijo, anim }) → dos tubos en una caja de 220 × 220 (la de las
//   lupas): a la izquierda, el Hto `a`; a la derecha, el Hto `b` (null = tubo vacío con «?»). La columna roja (la
//   masa) mide lo mismo en los dos: el plasma crece hasta dar el Hto medido. `anim` (0-1) es cuánto ha crecido ya.
// crecerPlasma(raiz, prefijo, a, b, anim) mueve solo el plasma del segundo tubo (para animarlo sin repintar).
// svgTuboEdta({ prefijo, grumos, rotulo }) → un tubo de tapón morado con la sangre sin centrifugar: con `grumos`,
//   las plaquetas se juntan en racimos.
import { svgParticula } from './particulas.js';

const n2 = x => +x.toFixed(2);
const FONDO = 178;                      // el fondo de los tubos en la caja de 220
const alto = (a, hto) => 100 * a / hto; // la altura total que da ese Hto con la misma masa (1 px por punto del primero)
const T = (x, y, t, { a = 'middle', s = 8.5, c = '--text-dim', b = false, i = false } = {}) =>
    `<text x="${n2(x)}" y="${n2(y)}" text-anchor="${a}" style="font-size:${s}px;fill:var(${c});font-family:system-ui, sans-serif;${b ? 'font-weight:700;' : ''}${i ? 'font-style:italic;' : ''}">${t}</text>`;
const vidrio = (cx, discontinuo = false) => `<path d="M${cx - 15} ${FONDO - 112}V${FONDO - 4}Q${cx - 15} ${FONDO + 2} ${cx} ${FONDO + 2}Q${cx + 15} ${FONDO + 2} ${cx + 15} ${FONDO - 4}V${FONDO - 112}" style="fill:none;stroke:var(--text-muted);stroke-width:${discontinuo ? 1.2 : 1.4}${discontinuo ? ';stroke-dasharray:3 3' : ''}"/>`;

export function alturaPlasma(a, b, anim = 1) {
    const H0 = 100, H1 = alto(a, b), u = 1 - Math.pow(1 - Math.max(0, Math.min(1, anim)), 3);
    return H0 + (H1 - H0) * u;
}

export function svgTubosHto({ a, b = null, rotulos = ['antes', 'después'], prefijo = 'tubo', anim = 1, fmt = v => String(v) }) {
    const rojo = a;
    const tubo = (cx, H, id) => vidrio(cx)
        + `<rect id="${id}" x="${cx - 13}" y="${n2(FONDO - H)}" width="26" height="${n2(H - rojo)}" style="fill:var(--accent-yellow);opacity:.42"/>`
        + `<rect id="${id}-masa" x="${cx - 13}" y="${n2(FONDO - rojo)}" width="26" height="${n2(rojo)}" rx="2" style="fill:var(--accent-red)"/>`;
    let h = `<g id="${prefijo}-izq">${tubo(80, 100, `${prefijo}-p1`)}</g>`;
    h += b != null ? `<g id="${prefijo}-der">${tubo(140, alturaPlasma(a, b, anim), `${prefijo}-p2`)}</g>`
        : `<g id="${prefijo}-der">${vidrio(140, true)}${T(140, 128, '?', { s: 16, b: true, c: '--text-muted' })}</g>`;
    // la raya de la masa: la misma altura en los dos tubos
    h += `<g id="${prefijo}-masa"><path d="M60 ${n2(FONDO - rojo)}H160" style="stroke:var(--text-main);stroke-width:1;stroke-dasharray:3 2"/>${T(56, FONDO - rojo + 3, 'masa', { a: 'end', s: 8, i: true })}</g>`;
    h += T(80, 194, rotulos[0]) + T(140, 194, rotulos[1]);
    h += T(80, 205, fmt(a), { b: true, c: '--text-main' }) + (b != null ? T(140, 205, fmt(b), { b: true, c: '--accent-red' }) : '');
    return h;
}

export function crecerPlasma(raiz, prefijo, a, b, anim) {
    const p2 = raiz.querySelector(`#${prefijo}-p2`);
    if (!p2 || b == null) return;
    const H = alturaPlasma(a, b, anim);
    p2.setAttribute('y', n2(FONDO - H)); p2.setAttribute('height', n2(H - a));
}

export function svgTuboEdta({ prefijo = 'edta', grumos = true, rotulo = '' } = {}) {
    let h = `<g id="${prefijo}">${vidrio(110)}`;
    h += `<rect x="94" y="${FONDO - 120}" width="32" height="10" rx="3" style="fill:var(--accent-purple)"/>`;
    h += `<rect x="97" y="${FONDO - 100}" width="26" height="96" rx="2" style="fill:var(--accent-red);opacity:.35"/>`;
    // plaquetas: sueltas o en racimos
    const sitios = grumos ? [[104, 96], [108, 100], [102, 102], [106, 105], [115, 132], [119, 136], [113, 138], [104, 160], [108, 163]]
        : [[103, 92], [117, 104], [106, 118], [116, 130], [104, 142], [115, 152], [106, 164], [116, 168], [110, 84]];
    h += `<g id="${prefijo}-plaquetas">${sitios.map(([x, y]) => svgParticula(grumos ? 'plaquetaActiva' : 'plaqueta', x, y, 2.4)).join('')}</g></g>`;
    if (rotulo) h += T(110, 196, rotulo);
    return h;
}
