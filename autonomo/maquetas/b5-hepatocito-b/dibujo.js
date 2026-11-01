// Escena SVG (viewBox 360×436): colon → porta → hepatocito (carril de la urea + vías apagadas) → sangre arterial → astrocito; CVVH a un lado.
// Formas como las de js/core/particulas.js: círculo = NH₃, cuadrado = urea, rombo = glutamina (las especies nuevas se darán de alta al llevarlo a la app).
import { VIAS_APAGADAS } from './datos.js';
import { clamp, fmt } from './modelo.js';
const NODOS = [['NH₃', 'entra'], ['NH₃ + CO₂', 'mitocondria'], ['Ciclo de', 'la urea'], ['Urea', 'a la sangre']];
export const ZONAS = { colon: [4, 28, 100, 112], carril: [116, 48, 232, 122], apagadas: [116, 176, 232, 88], arterial: [150, 262, 190, 50], astro: [226, 318, 130, 116], cvvh: [108, 286, 100, 64] };
const nh3 = (x, y) => `<circle class="p-nh3" cx="${x}" cy="${y}" r="3.4"/>`;
const urea = (x, y) => `<rect class="p-urea" x="${x - 3.2}" y="${y - 3.2}" width="6.4" height="6.4"/>`;
const glu = (x, y) => `<path class="p-glu" d="M${x} ${y - 4.6}L${x + 3.4} ${y}L${x} ${y + 4.6}L${x - 3.4} ${y}Z"/>`;
const T = (x, y, t, c = '', a = '') => `<text x="${x}" y="${y}" class="${c}" ${a}>${t}</text>`;
export const opNodo = (func, i) => +clamp(func / 100 * 4 - i, 0.15, 1).toFixed(2);
export function escena(s, L, oculto) {
  const o = [];
  // Colon
  o.push(`<rect class="tanque" x="6" y="30" width="92" height="104" rx="14"/>`, T(52, 46, 'Colon', 'rot', 'text-anchor="middle"'), T(52, 58, 'grifo de NH₃', 'min', 'text-anchor="middle"'));
  for (let i = 0; i < 8; i++) o.push(`<ellipse class="bact" cx="${20 + (i % 4) * 20}" cy="${i < 4 ? 74 : 90}" rx="6" ry="3.4" opacity="${s.dep >= 2 && !oculto ? 0.25 : 0.9}"/>`);
  for (let i = 0; i < L.nProd; i++) o.push(nh3(18 + (i % 4) * 20, 74 + Math.floor(i / 4) * 16 + 7));
  if (s.dep > 0 && !oculto) o.push(T(52, 112, 'Lactulosa: más ácido', 'min', 'text-anchor="middle"'));
  if (s.rifa) o.push(T(52, 126, 'Rifaximina', 'min', 'text-anchor="middle"'));
  // Porta
  o.push(`<path class="flecha" d="M98 84H116"/>`, T(100, 78, 'porta', 'min'));
  // Célula
  o.push(`<rect class="celula" x="116" y="24" width="236" height="238" rx="26"/>`, T(234, 40, 'Hepatocito', 'rot', 'text-anchor="middle"'));
  o.push(T(120, 262, 'sinusoide', 'min'), T(346, 262, 'bilis', 'min', 'text-anchor="end"'), `<path class="bilis" d="M352 150H358"/>`);
  o.push(`<ellipse class="mito" cx="234" cy="108" rx="112" ry="56"/>`, T(234, 70, `Carril de la urea · ${L.carril} %`, 'rot', 'text-anchor="middle"'), T(234, 160, 'Mitocondria', 'min', 'text-anchor="middle"'));
  NODOS.forEach(([a, b], i) => {
    const x = 152 + i * 58, op = opNodo(s.func, i);
    o.push(`<g class="nodo" data-nodo="${i}" opacity="${op}"><circle class="nd" cx="${x}" cy="94" r="13"/>${T(x, 98, i + 1, 'num', 'text-anchor="middle"')}${T(x, 121, a, 'min', 'text-anchor="middle"')}${T(x, 132, b, 'min', 'text-anchor="middle"')}`);
    if (i < 3) o.push(`<path class="flecha" d="M${x + 14} 94H${x + 44}"/>`);
    o.push('</g>');
  });
  const nu = Math.round(L.nProd * s.func / 100);
  for (let i = 0; i < nu; i++) o.push(urea(330 - (i % 3) * 9, 78 + Math.floor(i / 3) * 9));
  for (let i = 0; i < clamp(L.nProd - nu, 0, 6); i++) o.push(nh3(126 + (i % 3) * 9, 78 + Math.floor(i / 3) * 9));
  // Vías apagadas (con candado)
  o.push(T(234, 182, 'Otras vías · apagadas', 'min', 'text-anchor="middle"'));
  VIAS_APAGADAS.forEach(([n], i) => { const y = 188 + i * 17;
    o.push(`<g class="via-off" data-via="${i}"><rect class="gris" x="122" y="${y}" width="224" height="15" rx="5"/><rect class="cand" x="128" y="${y + 6}" width="7" height="6" rx="1"/><path class="cand-a" d="M129.5 ${y + 6}V${y + 4.5}a2 2 0 0 1 4 0V${y + 6}"/>${T(142, y + 11, n + ' · aún apagada', 'min')}</g>`); });
  // Sangre arterial y CVVH
  o.push(`<path class="flecha" d="M234 262V316"/>`, T(240, 292, 'sangre arterial', 'min'));
  for (let i = 0; i < L.nSale; i++) o.push(nh3(222 - (i % 2) * 10, 270 + Math.floor(i / 2) * 11));
  o.push(`<rect class="${s.cvvh ? 'cvvh on' : 'cvvh'}" x="116" y="296" width="84" height="44" rx="8"/>`, T(158, 313, 'CVVH', 'rot', 'text-anchor="middle"'), T(158, 328, s.cvvh ? 'filtrando NH₃' : 'apagada', 'min', 'text-anchor="middle"'), `<path class="flecha" d="M200 318H224" opacity="${s.cvvh ? 1 : 0.3}"/>`);
  // Astrocito
  const r = 30 + 18 * (oculto ? 0.2 : L.sw);
  o.push(`<circle class="astro ${!oculto && L.sw > 0.4 ? 'hincha' : ''}" cx="292" cy="372" r="${r.toFixed(1)}"/>`, T(292, 430, oculto ? 'Astrocito' : `Astrocito · ${L.sw > 0.4 ? 'hinchado' : 'normal'}`, 'rot', 'text-anchor="middle"'));
  if (!oculto) { for (let i = 0; i < L.nGlu; i++) o.push(glu(274 + (i % 3) * 18, 362 + Math.floor(i / 3) * 18)); o.push(T(292, 350, 'glutamina + agua', 'min', 'text-anchor="middle"')); }
  else o.push(T(292, 376, '?', 'gran', 'text-anchor="middle"'));
  return o.join('');
}
export const leyenda = () => `<div class="nv-especies" role="group" aria-label="Qué es cada partícula"><span><svg width="12" height="12" viewBox="0 0 12 12"><circle class="p-nh3" cx="6" cy="6" r="4"/></svg> NH₃ (amonio)</span><span><svg width="12" height="12" viewBox="0 0 12 12"><rect class="p-urea" x="2" y="2" width="8" height="8"/></svg> Urea</span><span><svg width="12" height="12" viewBox="0 0 12 12"><path class="p-glu" d="M6 1L10 6L6 11L2 6Z"/></svg> Glutamina</span></div>`;
export { fmt };
