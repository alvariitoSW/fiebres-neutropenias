// Escena SVG (viewBox 360×346): colon → porta → hepatocito (carril de la urea + vías apagadas) → sangre arterial → astrocito; CVVH a un lado.
// Partículas de la tabla común (js/data/formas-iones.js): NH₃, urea y glutamina, dibujadas con svgParticula.
import { svgParticula, leyendaParticulas } from '../../../core/particulas.js';
import { TX, VIAS_APAGADAS } from '../../../data/hepatocito-vivo-data.js';
import { clamp, fmt, nodosVia, nombresVia } from './modelo.js';
const NODOS = [['NH₃', 'entra'], ['1.º paso del ciclo', '(mitocondria)'], ['Resto', 'del ciclo'], ['Urea', 'a la sangre']];
export const ZONAS = { colon: [4, 28, 100, 112], carril: [116, 48, 232, 122], apagadas: [4, 302, 352, 40], arterial: [118, 176, 112, 84], astro: [236, 184, 118, 122], cvvh: [4, 192, 96, 58] };
const nh3 = (x, y) => svgParticula('nh3', x, y, 3.4);
const urea = (x, y) => svgParticula('urea', x, y, 3);
const glu = (x, y) => svgParticula('glutamina', x, y, 3.4);
const T = (x, y, t, c = '', a = '') => `<text x="${x}" y="${y}" class="${c}" ${a}>${t}</text>`;
export const opNodo = (func, i) => +clamp(func / 100 * 4 - i, 0.35, 1).toFixed(2);
// Un paso está apagado cuando le quedan menos de la mitad de los hepatocitos que necesita: se marca con aspa y rótulo, no solo con la opacidad.
export const apagado = (func, i) => func / 100 * 4 - i < 0.5;
export function escena(s, L, oculto) {
  const o = [], tox = s.via !== 'urea';
  // Colon (con una vía tóxica no pinta nada: ni colon, ni TIPS, ni CVVH, ni astrocito)
  if (!tox) o.push(`<rect class="tanque" x="6" y="30" width="92" height="104" rx="14"/>`, T(52, 46, 'Colon', 'rot', 'text-anchor="middle"'), T(52, 58, 'grifo de NH₃', 'min', 'text-anchor="middle"'));
  if (!tox) for (let i = 0; i < 8; i++) o.push(`<ellipse class="bact" cx="${20 + (i % 4) * 20}" cy="${i < 4 ? 74 : 90}" rx="6" ry="3.4" opacity="${s.dep >= 2 && !oculto ? 0.25 : 0.9}"/>`);
  if (!tox) for (let i = 0; i < L.nProd; i++) o.push(nh3(18 + (i % 4) * 20, 74 + Math.floor(i / 4) * 16 + 7));
  if (!tox && s.dep > 0 && !oculto) o.push(T(52, 112, 'Luz: más ácido', 'min', 'text-anchor="middle"'));
  if (!tox && s.rifa) o.push(T(52, 126, 'Rifaximina', 'min', 'text-anchor="middle"'));
  // Porta
  o.push(`<path class="flecha" d="M98 84H116"/>`, tox ? T(113, 78, 'porta', 'min', 'text-anchor="end"') : T(100, 78, 'porta', 'min'));
  // Célula
  o.push(`<rect class="celula" x="116" y="24" width="236" height="148" rx="26"/>`, T(234, 40, 'Hepatocito', 'rot', 'text-anchor="middle"'));
  o.push(tox ? T(138, 167, 'sinusoide', 'min') : T(120, 168, 'sinusoide', 'min'), T(346, 168, 'bilis', 'min', 'text-anchor="end"'), `<path class="bilis" d="M352 150H358"/>`);
  const nu = s.via === 'urea' ? Math.round(L.nProd * s.func / 100) : 0;
  if (s.via === 'urea') {
  o.push(`<ellipse class="mito" cx="234" cy="108" rx="112" ry="56"/>`, T(234, 70, `Carril de la urea · ${L.carril} %`, 'rot', 'text-anchor="middle"'), T(250, 156, 'Mitocondria', 'min', 'text-anchor="middle"'));
  NODOS.forEach(([a, b], i) => {
    const x = 152 + i * 58, op = opNodo(s.func, i);
    o.push(`<g class="nodo" data-nodo="${i}" opacity="${op}"><circle class="nd" cx="${x}" cy="94" r="13"/>${T(x, 98, i + 1, 'num', 'text-anchor="middle"')}${T(x, 121, a, 'min', 'text-anchor="middle"')}${T(x, 132, b, 'min', 'text-anchor="middle"')}`);
    if (apagado(s.func, i)) o.push(`<path class="aspa" d="M${x - 7} 87L${x + 7} 101M${x + 7} 87L${x - 7} 101"/>`, T(x, 143, 'apagado', 'min apag', 'text-anchor="middle"'));
    if (i < 3) o.push(`<path class="flecha" d="M${x + 14} 94H${x + 44}"/>`);
    o.push('</g>');
  });
  for (let i = 0; i < nu; i++) o.push(urea(330 - (i % 3) * 9, 78 + Math.floor(i / 3) * 9));
  for (let i = 0; i < clamp(L.nProd - nu, 0, 6); i++) o.push(nh3(126 + (i % 3) * 9, 78 + Math.floor(i / 3) * 9));
  } else {
  // Vía de un tóxico (paracetamol, alcoholes): las cuatro estaciones del carril cambian de rótulo; sin urea ni mitocondria
  const v = nodosVia(s), nm = nombresVia(s), tit = s.via === 'paracetamol' ? `Paracetamol · glutatión ${s.glut} %` : `${s.alc === 'met' ? 'Metanol' : 'Etilenglicol'} · pH ${String(s.ph).replace('.', ',')}`;
  o.push(T(234, 70, tit, 'rot', 'text-anchor="middle"'));
  nm.forEach(([a, b], i) => {
    const x = 144 + i * 59, d = v[i] || { op: 1 };
    o.push(`<g class="nodo" data-nodo="${i}" opacity="${d.op}"><circle class="nd" cx="${x}" cy="94" r="13"/>${T(x, 98, i + 1, 'num', 'text-anchor="middle"')}${T(x, 121, a, 'min', 'text-anchor="middle" style="font-size:8.2px"')}${T(x, 132, b, 'min', 'text-anchor="middle" style="font-size:8.2px"')}`);
    if (d.off) o.push(`<path class="aspa" d="M${x - 7} 87L${x + 7} 101M${x + 7} 87L${x - 7} 101"/>`);
    if (d.tag) o.push(T(x, 143, d.tag, d.off ? 'min apag' : 'min', 'text-anchor="middle"'));
    if (i < nm.length - 1) o.push(`<path class="flecha" d="M${x + 14} 94H${x + 45}"/>`);
    o.push('</g>');
  });
  }
  // Vías apagadas (con candado): dos columnas bajo el dibujo
  o.push(T(6, 307, 'Otras vías · apagadas', 'min'));
  VIAS_APAGADAS.forEach(([n], i) => { const x = 6 + (i % 2) * 176, y = 311 + Math.floor(i / 2) * 17;
    o.push(`<g class="via-off" data-via="${i}"><rect class="gris" x="${x}" y="${y}" width="170" height="15" rx="5"/><rect class="cand" x="${x + 6}" y="${y + 6}" width="7" height="6" rx="1"/><path class="cand-a" d="M${x + 7.5} ${y + 6}V${y + 4.5}a2 2 0 0 1 4 0V${y + 6}"/>${T(x + 20, y + 11, n.split(' ')[0] + ' · apagada', 'min')}</g>`); });
  if (tox) {
    // Metabolito tóxico (p. 4): con el glutatión bajo el 30 % deja de neutralizarse y se acumula; rombos rojos que crecen y se multiplican
    if (s.via === 'paracetamol' && s.glut < TX.glutDano) {
      const k = clamp((TX.glutDano - s.glut) / TX.glutDano, 0, 1), n = Math.round(4 + 14 * k), r = +(2.8 + 3.4 * k).toFixed(1);
      o.push(T(190, 196, 'metabolito tóxico: se acumula', 'rot', 'text-anchor="middle"'));
      for (let i = 0; i < n; i++) { const x = 138 + (i % 6) * 21 + (Math.floor(i / 6) % 2) * 10, y = 220 + Math.floor(i / 6) * 22; o.push(`<path class="aspa" d="M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z"/>`); }
    }
    o.push(`<path class="puente" d="M98 112H106V204H156" opacity="0.12"/>`, `<rect class="cvvh" x="6" y="196" width="88" height="48" rx="8" opacity="0.12"/>`);
    o.push(`<circle class="astro" cx="292" cy="240" r="28" opacity="0.12"/>`);
    return o.join('');
  }
  // TIPS: puente que salta el hígado (del colon/porta a la sangre arterial)
  o.push(`<path class="${s.tips ? 'puente on' : 'puente'}" d="M98 112H106V204H156"/>`, T(94, 172, s.tips ? 'TIPS' : 'TIPS: apagado', s.tips ? 'rot' : 'min', 'text-anchor="end"'));
  if (s.tips) for (let i = 0; i < 3; i++) o.push(nh3(106, 124 + i * 20));
  // Sangre arterial y CVVH (a la izquierda del astrocito)
  o.push(`<path class="flecha" d="M160 172V214"/>`, `<path class="flecha" d="M160 220H206"/>`, T(166, 200, 'sangre arterial', 'min'));
  for (let i = 0; i < L.nSale; i++) o.push(nh3(126 + (i % 4) * 13, 232 + Math.floor(i / 4) * 12));
  // urea que sale del paso 4 a la sangre (cuadrados, otra forma que el NH₃)
  for (let i = 0; i < clamp(nu, 0, 4); i++) o.push(urea(172 + (i % 2) * 10, 178 + Math.floor(i / 2) * 10));
  // el filtro roba partículas: el NH₃ que la CVVH saca de la sangre aparece dentro de su caja
  if (s.cvvh) for (let i = 0; i < clamp(Math.round((L.sinCvvh - L.a) / 30), 0, 6); i++) o.push(nh3(16 + i * 12, 239));
  o.push(`<rect class="${s.cvvh ? 'cvvh on' : 'cvvh'}" x="6" y="196" width="88" height="48" rx="8"/>`, T(50, 214, 'CVVH', 'rot', 'text-anchor="middle"'), T(50, 230, s.cvvh ? 'filtrando NH₃' : 'apagada', 'min', 'text-anchor="middle"'), `<path class="flecha" d="M94 220H124" opacity="${s.cvvh ? 1 : 0.3}"/>`);
  // Astrocito (el hueco de la derecha, x 226-356, queda reservado para el astrocito grande de la vuelta siguiente)
  const r = 28 + 22 * (oculto ? 0.2 : L.sw);
  o.push(`<circle class="astro ${!oculto && L.sw > 0.4 ? 'hincha' : ''}" cx="292" cy="240" r="${r.toFixed(1)}"/>`, T(292, 303, oculto ? 'Astrocito' : `Astrocito · ${L.sw > 0.4 ? 'hinchado' : 'normal'}`, 'rot', 'text-anchor="middle"'));
  if (!oculto) { for (let i = 0; i < L.nGlu; i++) o.push(glu(272 + (i % 3) * 18, 232 + Math.floor(i / 3) * 14)); for (let i = 0; i < L.nGlu; i++) o.push(`<path class="p-agua" d="M${272 + (i % 3) * 18 - 4} ${248 + Math.floor(i / 3) * 12}q2 -3 4 0t4 0"/>`); o.push(T(292, +(240 - r - 5).toFixed(1), 'glutamina + agua', 'min', 'text-anchor="middle"')); }
  else o.push(T(292, 250, '?', 'gran', 'text-anchor="middle"'));
  return o.join('');
}
export const leyenda = () => leyendaParticulas(['nh3', 'urea', 'glutamina'], { titulo: 'Qué es cada partícula' });
export { fmt };
