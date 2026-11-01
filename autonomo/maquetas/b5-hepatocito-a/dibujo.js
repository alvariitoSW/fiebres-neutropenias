// El sinusoide en un SVG de 360×340: intestino → porta → cordón de hepatocitos → vena hepática → cerebro (con lupa del astrocito).
import { svgParticula } from '../../../js/core/particulas.js';
import { clamp } from './modelo.js';
const mueve = (x, y, dx, dy, i, clave = 'nh4', r = 3.4) => `<g class="mueve" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${(i * 0.45).toFixed(2)}s">${svgParticula(clave, x, y, r)}</g>`;
const CEL = (i) => { const c = i >> 1, arriba = i % 2 === 0; return { x: 120 + 30 * c, y: arriba ? 52 : 110, arriba }; };
export function escena(s, l, foco) {
  let o = '';
  // intestino
  o += `<rect class="tej" x="4" y="62" width="64" height="76" rx="16"/><text class="rot" x="36" y="152" text-anchor="middle">Intestino</text>`;
  for (const [x, y] of [[16, 76], [30, 116], [46, 80], [56, 120], [22, 98]]) o += `<circle class="bac" cx="${x}" cy="${y}" r="3"/>`;
  const prod = clamp(Math.round(5 * (1 - 0.04 * Math.min(s.dep, 3)) * (s.rif ? 0.9 : 1)), 1, 5);
  for (let i = 0; i < prod; i++) o += mueve(48, 88 + (i % 3) * 8, 62, 0, i);
  // porta y vena hepática
  o += `<line class="vena" x1="68" y1="100" x2="120" y2="100"/><text class="min" x="93" y="90" text-anchor="middle">Porta</text>`;
  o += `<line class="vena" x1="238" y1="100" x2="280" y2="100"/><text class="min" x="245" y="94">V. hep.</text>`;
  // cordón de hepatocitos
  o += `<rect class="sin" x="118" y="92" width="122" height="16"/>`;
  for (let i = 0; i < 8; i++) {
    const c = CEL(i), on = i < l.celulas, cx = c.x + 14;
    o += `<rect class="cel ${on ? 'on' : 'off'}" x="${c.x}" y="${c.y}" width="28" height="38" rx="8"/>`;
    if (on) {
      o += mueve(cx, 100, 0, c.arriba ? -11 : 11, i % 4, 'nh4', 3);
      o += `<g class="ur">${svgParticula('urea', cx, c.arriba ? c.y + 8 : c.y + 30, 3.4)}</g>`;
    } else o += `<path class="cruz" d="M${cx - 6} ${c.y + 13}l12 12m0 -12l-12 12"/>`;
  }
  o += `<text class="rot" x="178" y="166" text-anchor="middle">Hígado: ${l.celulas}/8 hepatocitos</text><text class="min" x="178" y="178" text-anchor="middle">cada célula: horno de la urea</text>`;
  // sangre con amonio hacia el cerebro
  const nb = clamp(Math.round(l.nh3 / 40), 0, 7);
  for (let i = 0; i < nb; i++) o += mueve(246, 96 + (i % 2) * 8, 34, 0, i);
  // cerebro y lupa
  o += `<ellipse class="tej" cx="318" cy="88" rx="40" ry="34"/><text class="rot" x="318" y="46" text-anchor="middle">Cerebro</text>`;
  o += `<line class="guion" x1="318" y1="122" x2="306" y2="186"/><path class="guion" d="M280 88 L318 88"/>`;
  for (let i = 0; i < clamp(Math.round(l.nh3 / 60), 0, 5); i++) o += mueve(314 - i * 2, 126, -6, 44, i);
  const R = l.r; o += `<circle class="astro ${l.hinchado ? 'hin' : ''}" cx="306" cy="236" r="${R.toFixed(1)}"/>`;
  o += `<text class="min" x="306" y="233" text-anchor="middle">Glutamina</text><text class="min" x="306" y="245" text-anchor="middle">${l.hinchado ? '+ agua' : ''}</text>`;
  for (let i = 0; i < clamp(Math.round((R - 30) / 2.5), 0, 8); i++) { const a = i * 0.8 + 0.3; o += svgParticula('agua', 306 + Math.cos(a) * (R - 12), 236 + Math.sin(a) * (R - 12) * 0.9, 3.2); }
  o += `<text class="rot" x="306" y="${(236 + R + 13).toFixed(0)}" text-anchor="middle">Astrocito: ${l.hinchado ? 'hinchado' : 'normal'}</text>`;
  // TIPS
  o += `<path class="${s.tips ? 'tips on' : 'tips'}" d="M74 98 V24 H241 V98"/><text class="min" x="178" y="17" text-anchor="middle">TIPS ${s.tips ? '(puente abierto)' : '(apagado)'}</text>`;
  if (s.tips) for (let i = 0; i < 3; i++) o += mueve(74, 24, 167, 0, i);
  // CVVH: desvío del tramo arterial
  o += `<path class="${s.cvvh ? 'vena on' : 'vena off'}" d="M246 104 V218 H236 M236 226 H254 V104" style="stroke-width:4"/>`;
  o += `<rect class="filtro ${s.cvvh ? 'on' : ''}" x="136" y="204" width="100" height="28" rx="8"/><text class="rot" x="186" y="222" text-anchor="middle">Filtro CVVH ${s.cvvh ? '' : '(apagado)'}</text>`;
  if (s.cvvh) { for (let i = 0; i < 3; i++) o += mueve(246, 112, 0, 100, i); }
  // puertas apagadas
  o += `<text class="min" x="6" y="252">Puertas cerradas del hepatocito</text>`;
  ['Paracetamol', 'Cetonas', 'Alcoholes', 'Lactato'].forEach((n, i) => { const x = 6 + 59 * i; o += `<rect class="puerta" x="${x}" y="258" width="56" height="26" rx="5"/><path class="cruz" d="M${x + 4} ${264}l6 6m0 -6l-6 6"/><text class="pq" x="${x + 28}" y="279" text-anchor="middle">${n}</text>`; });
  o += `<text class="min" x="6" y="298">se encienden en Tóxicos / Renal</text>`;
  if (foco) o += `<rect class="foco" x="${foco[0]}" y="${foco[1]}" width="${foco[2]}" height="${foco[3]}" rx="10"/>`;
  return o;
}
