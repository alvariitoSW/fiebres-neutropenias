// Escena SVG 360×330: silueta con tres capas (piel, músculo, cerebro), lupa del hipotálamo y lupa del retículo del músculo.
import { svgParticula } from '../../../js/core/particulas.js';
import { fmt } from './modelo.js';
const LIMB = [['m1', 100, 84, 70, 172], ['m2', 160, 84, 190, 172], ['m3', 112, 176, 108, 306], ['m4', 148, 176, 152, 306]];
const CAPS = [[124, 98], [136, 120], [124, 142], [136, 160], [84, 120], [176, 120], [76, 150], [184, 150], [106, 220], [154, 220], [108, 262], [152, 262], [130, 52], [116, 44]];
export function escena(l, capas, foco, cerrado) {
  const f = (k) => (foco === k ? '<rect class="foco-r" x="2" y="2" width="1" height="1" hidden/>' : '');
  const on = (k) => (capas[k] ? '' : ' hidden');
  const ring = (k, x, y, r) => (foco === k ? `<circle class="foco" cx="${x}" cy="${y}" r="${r}"/>` : '');
  let o = '';
  // ---- piel ----
  o += `<g id="c-piel"${on('piel')}><circle class="piel ${l.cap ? 'ab' : 'ce'}" cx="130" cy="42" r="28"/>`;
  o += `<path class="piel ${l.cap ? 'ab' : 'ce'}" d="M92 72 Q130 64 168 72 L178 176 L82 176 Z"/>`;
  for (const [, x1, y1, x2, y2] of LIMB) o += `<line class="piel ${l.cap ? 'ab' : 'ce'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="30"/>`;
  for (const [x, y] of CAPS) o += l.cap ? `<path class="vaso ab" d="M${x - 6} ${y} q3 -5 6 0 t6 0"/>` : `<path class="vaso ce" d="M${x - 2} ${y} l4 0"/>`;
  if (l.sud) for (let i = 0; i < 6; i++) o += `<g class="gota" style="--dx:${(i % 2 ? 1 : -1) * (14 + i * 3)}px;--dy:${-10 - i * 2}px;animation-delay:${i * 0.35}s">${svgParticula('agua', [96, 164, 80, 180, 118, 142][i], [100, 108, 140, 150, 196, 236][i], 4.2)}</g>`;
  o += ring('piel', 130, 176, 120) + '</g>';
  // ---- músculo ----
  o += `<g id="c-mus"${on('mus')}>`;
  for (const [, x1, y1, x2, y2] of LIMB) o += `<line class="mus${l.rig ? ' rig' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="18"/>`;
  const fib = [[114, 100], [130, 100], [146, 100], [114, 124], [130, 124], [146, 124], [114, 148], [130, 148], [146, 148], [108, 200], [152, 200], [110, 250], [150, 250], [86, 130], [174, 130]];
  for (const [x, y] of fib) o += l.rig ? `<line class="fibra rig" x1="${x}" y1="${y - 10}" x2="${x}" y2="${y + 10}"/>` : `<path class="fibra${l.esc ? ' tir' : ''}" d="M${x} ${y - 10} q4 5 0 10 t0 10"/>`;
  if (l.rig === 1) o += '<text class="rot" x="96" y="38">masetero rígido</text>';
  o += ring('mus', 130, 180, 96) + '</g>';
  // calor: nace en el músculo y el hígado, sale por la piel si está abierta
  const n = 4 + (l.esc ? 3 : 0) + (l.rig ? 3 : 0) + Math.round(l.ca * 3);
  o += '<g id="c-calor">';
  for (let i = 0; i < n; i++) { const x = 104 + (i * 13) % 52, y = 108 + (i * 17) % 60, dx = l.cap ? (i % 2 ? 46 : -46) : (i % 2 ? 6 : -6); o += `<circle class="calor" r="3.2" cx="${x}" cy="${y}" style="--dx:${dx}px;--dy:${-6 - (i % 3) * 3}px;animation-delay:${(i * 0.29).toFixed(2)}s"/>`; }
  o += '</g>';
  o += '<text class="pq" x="130" y="192" text-anchor="middle">calor</text>';
  // ---- lupa hipotálamo (cerebro) ----
  const base = 118, esc = 2.6, hF = (l.pt - 22) * esc, yR = base - (l.T - 22) * esc;
  o += `<g id="c-cer"${on('cer')}><circle class="lupa" cx="290" cy="76" r="62"/><line class="guion" x1="154" y1="36" x2="238" y2="52"/>`;
  o += `<text class="rot" x="290" y="26" text-anchor="middle">Hipotálamo</text><rect class="escala" x="262" y="${base - 52}" width="6" height="52" rx="3"/>`;
  o += `<g id="llama" transform="translate(0 0)"><path class="llama" d="M265 ${base} q-10 -${hF * 0.5} 0 -${hF} q10 ${hF * 0.4} 0 ${hF} z" /></g>`;
  o += `<path class="real" d="M300 ${yR} l-9 -5 l0 10 z"/><text class="pq" x="284" y="46">llama: ajuste ${fmt(l.pt)}</text><text class="pq" x="284" y="58">flecha: real ${fmt(l.T)}</text>`;
  o += `<text class="pq" x="290" y="130" text-anchor="middle">${l.clon ? 'clonus ocular' : ''}</text>${ring('cer', 290, 76, 66)}</g>`;
  // ---- lupa retículo ----
  o += `<g id="c-ret"${on('mus')}><circle class="lupa" cx="290" cy="238" r="58"/><line class="guion" x1="174" y1="210" x2="236" y2="226"/>`;
  o += `<text class="rot" x="290" y="190" text-anchor="middle">Fibra del músculo</text>`;
  o += `<rect class="fibra-g${l.ca > 0.5 || l.rig ? ' contr' : ''}" x="248" y="${l.ca > 0.5 ? 222 : 216}" width="84" height="${l.ca > 0.5 ? 20 : 34}" rx="8"/>`;
  o += `<ellipse class="reti" cx="290" cy="268" rx="38" ry="12"/><text class="pq" x="290" y="287" text-anchor="middle">retículo</text>`;
  o += `<g class="canal"><rect class="${l.ca > 0.3 ? 'ab' : 'ce'}" x="283" y="${l.ca > 0.3 ? 252 : 255}" width="14" height="${l.ca > 0.3 ? 8 : 14}" rx="2"/></g>`;
  const nCa = Math.round(l.ca * 6);
  for (let i = 0; i < nCa; i++) o += `<g class="gota" style="--dx:${(i - 2.5) * 6}px;--dy:-28px;animation-delay:${i * 0.25}s">${svgParticula('ca', 264 + i * 9, 254, 3.6)}</g>`;
  o += `<text class="pq" x="290" y="212" text-anchor="middle">${l.ca > 0.3 ? 'Ca²⁺ suelto' : 'Ca²⁺ guardado'}</text>${ring('ret', 290, 238, 62)}</g>`;
  // ---- barra de estado ----
  o += `<text class="pq" x="6" y="322">${l.cap ? 'Piel abierta (vasos largos)' : 'Piel cerrada (vasos cortos)'} · ${l.esc ? 'tirita' : l.rig ? 'rígido' : 'reposo'} · ${l.sud ? 'suda' : 'sin sudor'}</text>`;
  return o;
}
