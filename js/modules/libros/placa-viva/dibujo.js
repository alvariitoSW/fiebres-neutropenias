// Dibujo: la cadena nervio → placa → fibra → pulgar → pulmón (viewBox 360×184). La lupa de la placa vive en hendidura.js (importa la de A).
import { sacudidas } from './modelo.js';
import { ESTADOS } from '../../../data/placa-viva-data.js';
const X = [[6, 106], [116, 48], [164, 70], [236, 56], [294, 60]];   // x, ancho de cada eslabón
const ZONAS = { axon: [4, 38, 108, 66], placa: [114, 38, 52, 66], fibra: [162, 38, 74, 66], pulgar: [234, 38, 60, 66], pulmon: [292, 34, 64, 74], barras: [4, 108, 352, 74] };
export function escena(s, L, oculto, foco) {
  const gbs = s.est === 'gbs', pnc = s.est === 'pnc', mcc = s.est === 'mcc', blq = s.est === 'bloqueo' && s.rel && L.tof < 4, mg = s.est === 'miastenia';
  let o = '';
  // 1 axón con manguitos de mielina (en el GBS faltan trozos; en la polineuropatía el axón se adelgaza)
  o += `<rect class="tubo${pnc ? ' fino' : ''}" x="8" y="${pnc ? 67 : 62}" width="100" height="${pnc ? 6 : 16}" rx="8"/><line class="axon${pnc ? ' fino' : ''}" x1="8" y1="70" x2="112" y2="70"/><circle class="bulbo" cx="110" cy="70" r="9"/>`;
  for (let i = 0; i < 4; i++) o += `<rect class="mielina${gbs && i % 2 ? ' rota' : ''}" x="${14 + i * 24}" y="62" width="${gbs && i % 2 ? 10 : 18}" height="16" rx="8"/>`;
  // 2 placa (se tapa con el relajante), 3 fibra con sarcómeros, 4 pulgar, 5 campana
  o += `<rect class="placa${blq ? ' tapada' : ''}" x="120" y="54" width="40" height="32" rx="6"/><path class="hendid" d="M119,58 v24 M122,58 v24"/>`;
  for (let i = 0; i < 3; i++) o += `<path class="copa" d="M${128 + i * 12},58 q4,12 8,0"/>`;
  o += `<rect class="fibra" x="166" y="56" width="66" height="28" rx="6"/>`;
  for (let i = 0; i < 7; i++) o += `<line class="sarco${mcc && i % 2 ? ' perdida' : ''}" x1="${174 + i * 8}" y1="60" x2="${174 + i * 8}" y2="80"/>`;
  const ang = Math.round(55 * (1 - L.f / 100));   // aducción del pulgar: con fuerza plena queda pegado a la palma; sin fuerza se abre
  o += `<rect class="pulgar-c" x="240" y="66" width="48" height="30" rx="8"/><g transform="rotate(${-ang} 262 74)"><rect class="pulgar-r" x="256" y="40" width="14" height="38" rx="7" opacity="${(0.25 + 0.75 * L.f / 100).toFixed(2)}"/></g>`;
  const lob = 'M312,48 q-12,6 -12,32 q0,16 10,16 q6,0 6,-12 z M324,48 q12,6 12,32 q0,16 -10,16 q-6,0 -6,-12 z', nv = 50 * L.f / 100;   // dos pulmones; el nivel es la CV
  o += `<clipPath id="plv-cl-pul"><path d="${lob}"/></clipPath><path class="campana" d="${lob}"/><rect class="campana-n" clip-path="url(#plv-cl-pul)" x="298" y="${96 - nv}" width="42" height="${nv}"/><line class="tope15" x1="298" x2="340" y1="${96 - 50 * 15 / 70}" y2="${96 - 50 * 15 / 70}"/>`;
  o += '<text class="min" x="344" y="94" text-anchor="end">CV</text><path class="bronq" d="M324,38 v20 M324,58 l-10,10 M324,58 l10,10"/><path class="flecha" d="M118,70 h2 M160,70 h6 M232,70 h6 M290,70 h6"/>';
  for (let i = 0; i < 3; i++) o += `<path class="dedo" d="M${246 + i * 14},66 v-${14 + (i === 1 ? 6 : 0)}"/>`;
  [['Axón', 60], ['Placa', 140], ['Fibra', 199], ['Pulgar', 264], ['Pulmón', 324]].forEach(([t, x]) => { o += `<text class="rot" x="${x}" y="106" text-anchor="middle">${t}</text>`; });
  const le = ESTADOS[s.est].lesion;
  if (le && !oculto) { const cx = X[le[0]][0] + X[le[0]][1] / 2; o += `<text class="oro" x="${Math.min(300, Math.max(70, cx))}" y="28" text-anchor="middle">${le[1]}</text><path class="marca" d="M${cx - 5},34 h10 l-5,8 z"/>`; }
  // sacudidas
  const sa = sacudidas(s, L), est = { unico: 'estímulo único', rep: 'estímulo repetido ×10', tof: 'TOF: 4 estímulos' }[s.estim];
  o += `<text class="min" x="8" y="121">Sacudidas del pulgar · ${est}</text><g id="plv-barras">`;
  sa.forEach((a, i) => { const h = Math.max(1, 38 * a); o += `<rect class="barra${a < 0.05 ? ' vacia' : ''}" x="${14 + i * 30}" y="${166 - h}" width="22" height="${h}" rx="3"/><text class="min" x="${25 + i * 30}" y="178" text-anchor="middle">${i + 1}</text>`; });
  o += '</g>';
  if (s.estim === 'unico') o += `<text class="gran" x="96" y="156">${L.f} %</text><text class="min" x="96" y="172">de la fuerza: una sacudida</text>`;
  for (const z of foco) if (ZONAS[z]) o += `<rect class="foco" x="${ZONAS[z][0]}" y="${ZONAS[z][1]}" width="${ZONAS[z][2]}" height="${ZONAS[z][3]}" rx="8"/>`;
  return o;
}
