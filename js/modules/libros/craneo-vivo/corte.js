// El corte coronal del cráneo (izquierda) y el enfermo que responde (derecha). Un solo SVG 390×330.
// Convención radiológica: el lado D del enfermo queda a la izquierda del dibujo, igual que en la cara.
import { dibujarCara, dibujarMano, MANO, textoPupila } from './cara.js';
import { TIPOS } from './modelo.js';
import { svgParticula } from '../../../core/particulas.js';
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Sangre en las arterias de la base: corre más deprisa con más PPC y en el vasoespasmo; sin flujo se para y no se pinta.
const RIO = 'M64,216 L172,216';
const flujoBase = (L) => (L.me ? '' : [0, 1, 2, 3].map((i) => { const dur = L.hsaDiasEsp ? 1.4 : Math.min(6, Math.max(1.8, 240 / Math.max(L.ppc, 20))); return `<g>${REDUCIR ? '' : `<animateMotion dur="${dur.toFixed(1)}s" repeatCount="indefinite" begin="-${(i * dur / 4).toFixed(2)}s" path="${RIO}"/>`}${svgParticula(i % 2 ? 'o2' : 'rbc', REDUCIR ? 64 + 28 * i : 0, REDUCIR ? 216 : 0, 2.6)}</g>`; }).join(''));
export const ZONAS = { uncus: [56, 160, 62, 44], tronco: [98, 178, 44, 82], ventr: [64, 62, 112, 70], cist: [40, 166, 160, 80], cara: [244, 2, 144, 160], mano: [244, 196, 140, 40] };
const t = (x, y, s, c = 'ct', a = 'start') => !s ? '' : `<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s}</text>`;
const lin = (a, b, c, d) => `<path d="M${a},${b} L${c},${d}" class="lider"/>`;
export function escena(s, L, { oculto = false } = {}) {
  const sh = L.shift, fx = 118 + sh, tr = s.tipo === 'tronco', hsa = s.tipo === 'hsa', hv = s.tipo === 'ventricular';
  const m = L.masaEf, r = 8 + m * 0.42;                      // radio de la masa (ilustrativo)
  const vL = hv ? 1 + m / 70 : Math.max(0.35, 1 - m / 160), vR = hv ? 1 + m / 70 : 1 + m / 400;
  const vent = (cx, k, d) => `<path d="M${cx},${84 + (d ? 0 : 0)} q${-d * 14 * k},6 ${-d * 10 * k},30 q${d * 3},10 ${d * 12 * k},4 q${d * 10 * k},-14 ${-d * 2 * k},-34z" class="vent"/>`;
  const abre = s.cran ? `<path d="M26,56 Q14,110 34,170" class="hueco"/>` : '';
  const masa = tr || hsa ? '' : s.tipo === 'edema'
    ? `<ellipse cx="62" cy="104" rx="${r + 14}" ry="${r + 20}" class="edema"/>`
    : `<ellipse cx="${hv ? fx - 22 : 62}" cy="${hv ? 100 : 108}" rx="${r}" ry="${r * 0.9}" class="sangre"/><path d="M${(hv ? fx - 22 : 62) - r * 0.6},${108} l${r * 1.2},0 M${62},${108 - r * 0.6} l0,${r * 1.2}" class="trama"/>`;
  const ung = L.est >= 2 ? 1 : 0;                              // el uncus baja y aprieta el III par
  const uncus = `<ellipse cx="${84 + 12 * ung}" cy="${177 + 6 * ung}" rx="14" ry="9" class="uncus"/>`;
  const ciste = hsa ? `<path d="M52,206 Q118,226 184,206" class="sangre-linea"/>` : '';
  const vaso = `<path d="M64,216 L108,216 M128,216 L172,216" class="vaso" style="stroke-width:${hsa ? (L.hsaDiasEsp ? 1.5 : 4.5) : 3}"/>`;
  const lesion = tr ? `<rect x="112" y="222" width="12" height="20" rx="3" class="lesion"/>` : '';
  const cat = (s.sensor && s.tipo !== 'edema') || s.drenaje ? `<path d="M170,28 L${fx + 22},84 M170,28 L170,12 L231,12 L231,126" class="cat"/><rect x="224" y="126" width="14" height="14" rx="3" class="cat-c"/>` : '';
  const flecha = L.est >= 2 && !L.me ? `<path d="M84,170 L102,196" class="flecha"/>` : '';
  const pxr = (L.me ? 0.55 : 0);
  const gcsT = tr ? 'Obedece con los ojos' : `GCS ${L.gcs} · O${L.O} V${L.V} M${L.M}`;
  const lab = [t(4, 9, 'D', 'ct dim'), t(232, 9, 'I', 'ct dim', 'end'), t(fx, 9, 'Línea media', 'ct', 'middle'),
    t(4, 205, 'Uncus'), lin(30, 201, 72, 178), t(4, 232, 'III par'), lin(34, 228, 106, 190), t(203, 205, 'Tienda'), lin(204, 200, 168, 190), t(138, 262, 'Tronco'),
    t(150, 119, 'Ventrículos', 'ct dim'),
    hsa ? t(52, 276, 'Sangre en cisternas') + t(52, 292, L.hsaDiasEsp ? 'Arterias estrechas (vasoespasmo)' : 'Arterias de la base') : t(52, 292, 'Arterias de la base'),
    tr ? t(134, 278, 'Lesión ventral') + lin(130, 270, 120, 244) : '', s.cran ? t(30, 22, 'Hueso retirado', 'ct') : '',
    s.tipo === 'edema' ? t(24, 52, 'Edema') : hsa || tr ? '' : t(24, 52, hv ? 'Sangre ventricular' : 'Hematoma D'),
    (s.sensor && s.tipo !== 'edema') || s.drenaje ? t(178, 156, s.drenaje ? 'Drenaje LCR' : 'Sensor PIC') : ''].join('');
  const cara = `<g transform="translate(248,6) scale(.62)">${dibujarCara({ o: L.O, v: L.V, m: L.M, pup: L.pup, lock: tr })}</g>`;
  const der = [t(248, 166, tr ? 'Mira arriba, obedece' : L.O >= 4 ? 'Ojos abiertos' : L.O >= 2 ? 'Abre al estímulo' : 'Ojos cerrados'),
    ...textoPupila(L.pup).split(';').map((x, i) => t(248, 178 + 13 * i, x.trim())),
    `<g transform="translate(248,200)">${dibujarMano(tr ? 6 : L.M)}</g>`, t(386, 216, tr ? 'Mueve los ojos' : MANO[L.M] || '', 'ct', 'end'), t(386, 229, tr ? 'y parpadea' : '', 'ct', 'end'),
    t(248, 276, oculto ? 'GCS ?' : gcsT, 'ct fuerte'), t(248, 292, L.me ? 'Sin respuesta ni reflejos' : '', 'ct'), t(248, 308, TIPOS[s.tipo], 'ct dim')].join('');
  return `<ellipse cx="118" cy="128" rx="108" ry="118" class="craneo"/><ellipse cx="118" cy="100" rx="94" ry="80" class="cerebro"/>
    ${abre}${masa}${vent(118 - 22 + sh, vL, 1)}${vent(118 + 22 + sh, vR, -1)}${ciste}
    <path d="M${fx},26 L${fx},182" class="falx"/>
    <path d="M30,176 L100,194 M206,176 L136,194" class="tienda"/><ellipse cx="118" cy="218" rx="70" ry="24" class="cerebelo"/>
    <rect x="106" y="180" width="24" height="70" rx="10" class="tronco"/>${lesion}${uncus}${flecha}${vaso}${flujoBase(L)}
    <path d="M${106},188 L${96 + 12 * ung},${178 + 6 * ung}" class="par3"/>${cat}
    ${L.me ? '<ellipse cx="118" cy="128" rx="108" ry="118" class="apagado"/>' + t(118, 132, 'Sin flujo', 'ct fuerte', 'middle') : ''}
    ${lab}${cara}${der}`;
}
