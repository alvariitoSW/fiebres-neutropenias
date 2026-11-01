// Dibujo: la cadena nervio → placa → fibra → pulgar → pulmón (viewBox 360×262) y la lupa de la placa (360×150).
import { sacudidas } from './modelo.js';
import { ESTADOS } from './datos.js';
const X = [[6, 106], [116, 48], [164, 70], [236, 56], [294, 60]];   // x, ancho de cada eslabón
const ZONAS = { axon: [4, 38, 108, 66], placa: [114, 38, 52, 66], fibra: [162, 38, 74, 66], pulgar: [234, 38, 60, 66], pulmon: [292, 34, 64, 74], barras: [4, 112, 352, 146] };
export function escena(s, L, oculto, foco) {
  const gbs = s.est === 'gbs', pnc = s.est === 'pnc', mcc = s.est === 'mcc', blq = s.est === 'bloqueo' && s.rel && L.tof < 4, mg = s.est === 'miastenia';
  let o = '';
  // 1 axón con manguitos de mielina (en el GBS faltan trozos; en la polineuropatía el axón se adelgaza)
  o += `<line class="axon${pnc ? ' fino' : ''}" x1="8" y1="70" x2="112" y2="70"/>`;
  for (let i = 0; i < 4; i++) o += `<rect class="mielina${gbs && i % 2 ? ' rota' : ''}" x="${14 + i * 24}" y="62" width="${gbs && i % 2 ? 10 : 18}" height="16" rx="4"/>`;
  // 2 placa (se tapa con el relajante), 3 fibra con sarcómeros, 4 pulgar, 5 campana
  o += `<rect class="placa${blq ? ' tapada' : ''}" x="120" y="54" width="40" height="32" rx="6"/>`;
  for (let i = 0; i < 3; i++) o += `<path class="copa" d="M${128 + i * 12},58 q4,12 8,0"/>`;
  o += `<rect class="fibra" x="166" y="56" width="66" height="28" rx="6"/>`;
  for (let i = 0; i < 7; i++) o += `<line class="sarco${mcc && i % 2 ? ' perdida' : ''}" x1="${174 + i * 8}" y1="60" x2="${174 + i * 8}" y2="80"/>`;
  const ang = Math.round(55 * (1 - L.f / 100));   // aducción del pulgar: con fuerza plena queda pegado a la palma; sin fuerza se abre
  o += `<rect class="pulgar-c" x="240" y="66" width="48" height="30" rx="8"/><g transform="rotate(${-ang} 262 74)"><rect class="pulgar-r" x="256" y="40" width="14" height="38" rx="7" opacity="${(0.25 + 0.75 * L.f / 100).toFixed(2)}"/></g>`;
  o += `<rect class="campana" x="300" y="44" width="48" height="52" rx="5"/><rect class="campana-n" x="302" y="${96 - 50 * L.f / 100}" width="44" height="${50 * L.f / 100}"/><line class="tope15" x1="300" x2="348" y1="${96 - 50 * 15 / 70}" y2="${96 - 50 * 15 / 70}"/>`;
  o += '<path class="flecha" d="M112,70 h6 M160,70 h6 M232,70 h6 M290,70 h6"/>';
  [['Axón', 60], ['Placa', 140], ['Fibra', 199], ['Pulgar', 264], ['Pulmón', 324]].forEach(([t, x]) => { o += `<text class="rot" x="${x}" y="108" text-anchor="middle">${t}</text>`; });
  const le = ESTADOS[s.est].lesion;
  if (le && !oculto) { const cx = X[le[0]][0] + X[le[0]][1] / 2; o += `<text class="oro" x="${Math.min(300, Math.max(70, cx))}" y="28" text-anchor="middle">${le[1]}</text><path class="marca" d="M${cx - 5},34 h10 l-5,8 z"/>`; }
  // sacudidas
  const sa = sacudidas(s, L), est = { unico: 'estímulo único', rep: 'estímulo repetido ×10', tof: 'TOF: 4 estímulos' }[s.estim];
  o += `<text class="min" x="8" y="128">Sacudidas del pulgar · ${est}</text><g id="barras">`;
  sa.forEach((a, i) => { const h = Math.max(1, 90 * a); o += `<rect class="barra${a < 0.05 ? ' vacia' : ''}" x="${14 + i * 30}" y="${238 - h}" width="22" height="${h}" rx="3"/><text class="min" x="${25 + i * 30}" y="252" text-anchor="middle">${i + 1}</text>`; });
  o += '</g>';
  for (const z of foco) if (ZONAS[z]) o += `<rect class="foco" x="${ZONAS[z][0]}" y="${ZONAS[z][1]}" width="${ZONAS[z][2]}" height="${ZONAS[z][3]}" rx="8"/>`;
  return o;
}
export function lupa(s, L) {
  const mg = s.est === 'miastenia', blq = s.est === 'bloqueo' && s.rel, roc = blq && s.rel !== 'succi', tapa = roc && !(s.sug > 0 && s.rel === 'roc' && L.tof >= 4) && L.tof < 4, succi = blq && s.rel === 'succi' && L.tof < 4;
  let o = '<rect class="term" x="8" y="6" width="344" height="30" rx="8"/>';
  for (let i = 0; i < 8; i++) o += `<circle class="vesicula" cx="${26 + i * 42}" cy="21" r="6"/>`;
  for (let i = 0; i < 8; i++) { const x = 26 + i * 42, rota = mg && i >= 3; o += `<path class="copa${rota ? ' rota' : ''}${succi ? ' abierta' : ''}" d="M${x - 10},78 q10,20 20,0"/>`;
    if (rota) o += `<path class="anticuerpo" d="M${x - 5},62 l5,7 l5,-7 M${x},69 v8"/>`; if (tapa) o += `<rect class="tapon" x="${x - 8}" y="76" width="16" height="6" rx="2"/>`; if (succi) o += `<circle class="potasio" cx="${x}" cy="112" r="3"/>`; }
  o += `<rect class="memb" x="8" y="96" width="344" height="12" rx="4"/>`;
  for (let i = 0; i < 7; i++) o += `<path class="tijera${s.neo > 0 ? ' bloqueada' : ''}" d="M${41 + i * 42 - 4},84 l8,8 m0,-8 l-8,8"/>`;
  if (blq && s.rel === 'roc' && s.sug > 0) for (let i = 0; i < 4; i++) o += `<circle class="anillo-sug" cx="${60 + i * 80}" cy="50" r="5"/>`;
  o += '<text class="min" x="12" y="56">Hendidura</text><text class="min" x="12" y="126">Músculo</text>';
  const nota = mg ? (s.farm ? 'Menos receptores y la transmisión, dificultada' : 'Pocos receptores: la respuesta se agota') : succi ? 'Succinilcolina: copas abiertas, sale K⁺' : tapa ? 'Rocuronio/cisatracurio: tapón en la copa' : roc && s.sug > 0 ? 'Sugammadex se lleva el rocuronio' : 'Placa sana: ACh, copas y tijeras';
  return o + `<text class="oro" x="348" y="144" text-anchor="end">${nota}</text>`;
}
