// Eje B · la escena (SVG 390×300): arriba el enfermo en la cama con suero, noradrenalina y termómetro y sus dos lupas; abajo la lupa abierta
// con el eje de tres estaciones (óvalo = hipotálamo, gota = hipófisis, triángulo sobre riñón = suprarrenal, mariposa = tiroides).
import { eje } from './modelo.js';
export const ZONAS = { cuello: [40, 30, 56, 66], rinon: [128, 40, 64, 62], suero: [256, 4, 74, 98], termo: [334, 4, 52, 100], eje: [4, 126, 382, 170] };
const CX = [48, 143, 238, 333], CY = 176;
const niv = (v) => (v > .7 ? '↑' : v < .25 ? '↓' : 'N');
const num = (x) => String(x).replace('.', ',');
const flecha = (x1, x2, lv, i, lab) => `<g class="paso" data-i="${i}"><line class="fl" x1="${x1}" y1="${CY}" x2="${x2 - 6}" y2="${CY}" stroke-width="${(1.5 + 4 * lv).toFixed(1)}" opacity="${(.3 + .7 * lv).toFixed(2)}"/><path class="fl-p" d="M${x2} ${CY} l-8 -5 v10 z" opacity="${(.3 + .7 * lv).toFixed(2)}"/><text class="min" x="${(x1 + x2) / 2}" y="${CY - 10}" text-anchor="middle">${lab}</text></g>`;
const bloqueo = (x, y) => `<g class="bloq"><circle cx="${x}" cy="${y}" r="7"/><path d="M${x - 4} ${y - 4} l8 8 M${x + 4} ${y - 4} l-8 8"/></g>`;
const esc = (k, n, t) => `<g transform="translate(${CX[k]} ${CY}) scale(${n}) translate(${-CX[k]} ${-CY})">${t}</g>`;
const formas = {
  hip: (x) => `<ellipse class="forma" cx="${x}" cy="${CY}" rx="24" ry="14"/>`,
  hipo: (x) => `<path class="forma" d="M${x} ${CY - 18} C${x + 24} ${CY + 2} ${x + 16} ${CY + 20} ${x} ${CY + 20} C${x - 16} ${CY + 20} ${x - 24} ${CY + 2} ${x} ${CY - 18} Z"/>`,
  sr: (x, k) => esc(2, k, `<ellipse class="rinon" cx="${x}" cy="${CY + 8}" rx="26" ry="12"/><path class="forma" d="M${x} ${CY - 22} L${x - 18} ${CY + 2} L${x + 18} ${CY + 2} Z"/>`),
  ti: (x, k) => esc(2, k, `<ellipse class="forma" cx="${x - 14}" cy="${CY}" rx="14" ry="12"/><ellipse class="forma" cx="${x + 14}" cy="${CY}" rx="14" ry="12"/><rect class="forma" x="${x - 6}" y="${CY - 3}" width="12" height="7"/>`),
  tej: (x) => `<rect class="forma" x="${x - 28}" y="${CY - 18}" width="56" height="36" rx="10"/>`,
};
export function escena(s, L, o = {}) {
  const { a, t } = eje(s), sr = o.lup === 'sr', v = s.vol / 3000, ta = Math.max(0, Math.min(1, (L.t - 33) / 9));
  let h = '';
  // ---- el enfermo ----
  h += `<line class="cama" x1="8" y1="104" x2="250" y2="104"/><circle class="cuerpo" cx="40" cy="72" r="17"/><rect class="cuerpo" x="56" y="56" width="176" height="36" rx="16"/>`;
  h += `<g class="orgs"><ellipse class="forma" cx="59" cy="72" rx="8" ry="5" transform="scale(1)"/><ellipse class="forma" cx="73" cy="72" rx="8" ry="5"/><ellipse class="rinon" cx="160" cy="80" rx="14" ry="8"/><path class="forma" d="M160 60 L152 74 L168 74 Z"/></g>`;
  h += `<circle class="lupa${!sr ? ' sel' : ''}" cx="66" cy="72" r="20"/><circle class="lupa${sr ? ' sel' : ''}" cx="160" cy="74" r="20"/>`;
  h += `<text class="min" x="66" y="118" text-anchor="middle">Tiroides</text><text class="min" x="160" y="118" text-anchor="middle">Suprarrenal</text>`;
  // suero, noradrenalina y temperatura
  h += `<rect class="tanque" x="262" y="10" width="34" height="52" rx="8"/><rect class="liq" x="264" y="${(60 - 48 * v).toFixed(1)}" width="30" height="${(48 * v).toFixed(1)}" rx="6"/><text class="min" x="279" y="76" text-anchor="middle">Suero</text><text class="rot" x="279" y="88" text-anchor="middle">${num(s.vol / 1000)} L</text>`;
  h += `<rect class="tanque" x="306" y="10" width="16" height="52" rx="4"/><rect class="liq" x="308" y="${(60 - 48 * s.na).toFixed(1)}" width="12" height="${(48 * s.na).toFixed(1)}" rx="3"/><text class="min" x="314" y="76" text-anchor="middle">NA</text><text class="rot" x="314" y="88" text-anchor="middle">${num(s.na.toFixed(1))}</text>`;
  h += `<rect class="tanque" x="350" y="10" width="12" height="52" rx="6"/><circle class="tanque" cx="356" cy="68" r="8"/><rect class="liq t" x="352" y="${(60 - 48 * ta).toFixed(1)}" width="8" height="${(48 * ta).toFixed(1)}" rx="3"/><text class="rot" x="356" y="92" text-anchor="middle">${num(L.t)} °C</text>`;
  // ---- la lupa abierta ----
  h += `<rect class="panel" x="4" y="126" width="382" height="170" rx="10"/><text class="rot" x="14" y="142">Lupa: ${sr ? 'suprarrenal' : 'tiroides'}</text>`;
  const N = sr ? [a.crh, a.acth, a.cort] : [t.trh, t.tsh, t.t4];
  const Hn = sr ? ['CRH', 'ACTH', 'cortisol'] : ['TRH', 'TSH', 'T4'];
  h += `<g class="paso" data-i="0">${formas.hip(CX[0])}${formas.hipo(CX[1])}</g>`;
  h += sr ? `<g class="paso" data-i="1">${formas.sr(CX[2], 1 - .6 * a.atro)}</g>` : `<g class="paso" data-i="1">${formas.ti(CX[2], t.tam)}</g>`;
  h += `<g class="paso" data-i="2">${formas.tej(CX[3])}${!sr ? `<path class="tij" d="M${CX[3] - 10} ${CY - 8} l20 16 M${CX[3] + 10} ${CY - 8} l-20 16"/>` : ''}</g>`;
  h += `<text class="min" x="${CX[0]}" y="214" text-anchor="middle">Hipotálamo</text><text class="min" x="${CX[1]}" y="214" text-anchor="middle">Hipófisis</text><text class="min" x="${CX[2]}" y="214" text-anchor="middle">${sr ? 'Suprarrenal' : 'Tiroides'}</text><text class="min" x="${CX[3]}" y="214" text-anchor="middle">Tejidos</text>`;
  for (let i = 0; i < 3; i++) h += flecha(CX[i] + 30, CX[i + 1] - 30, N[i], i, Hn[i]);
  const tag = (k, txt) => `<text class="rot" x="${CX[k]}" y="226" text-anchor="middle">${txt}</text>`;
  h += sr ? tag(0, `CRH ${niv(a.crh)}`) + tag(1, `ACTH ${niv(a.acth)}`) + tag(2, `cortisol ${niv(a.cort)}`) + tag(3, a.estado === 'falta' ? 'falta cortisol' : 'cubierto')
    : tag(0, `TRH ${niv(t.trh)}`) + tag(1, `TSH ${niv(t.tsh)}`) + tag(2, `T4 ${niv(t.t4)}`) + tag(3, `T3 ${niv(t.t3)}${t.tij ? ' · T3r ↑' : ''}`);
  // lo que entra por fuera
  const ext = sr ? (a.ext ? (s.hc ? 'hidrocortisona' : 'prednisona') : '') : t.ext ? (t.ext === 'T4' ? 'levotiroxina' : 'liotironina') : '';
  if (ext) h += `<g class="paso" data-i="2"><text class="oro" x="380" y="152" text-anchor="end">${ext} ↓</text><path class="ext" d="M${sr ? 300 : 306} 156 L${sr ? 256 : 272} ${sr ? 168 : 170}"/></g>`;
  // bloqueos
  if (sr) { if (a.bloqueos.includes('hip')) h += bloqueo(96, CY); if (a.bloqueos.includes('glan')) h += bloqueo(191, CY); if (a.bloqueos.includes('org')) h += bloqueo(286, CY); }
  else { if (t.bloq.includes('sint')) h += bloqueo(262, CY - 24); if (t.bloq.includes('sec')) h += bloqueo(286, CY + 14); if (t.bloq.includes('tij')) h += bloqueo(CX[3] + 20, CY + 22); }
  // el freno: del hormona final al hipotálamo y la hipófisis (retroalimentación negativa)
  const f = sr ? a.cort : t.t4, w = (1.5 + 3 * f).toFixed(1), dash = f < .25 ? ' stroke-dasharray="4 3"' : '';
  h += `<g class="paso" data-i="3"><path class="freno" d="M${CX[2]} 236 V262 H${CX[0]} V240 M${CX[1]} 262 V240" stroke-width="${w}"${dash}/><path class="fl-p" d="M${CX[0]} 232 l-5 9 h10 z M${CX[1]} 232 l-5 9 h10 z"/><text class="oro" x="${CX[0] + 14}" y="256">−</text><text class="oro" x="${CX[1] + 14}" y="256">−</text></g>`;
  h += `<text class="min" x="195" y="276" text-anchor="middle">freno (retroalimentación negativa) · Libro Azul, Younes</text><text class="min dim" x="195" y="289" text-anchor="middle">${sr ? a.lab : t.lab}</text>`;
  return h;
}
export const focoSvg = (z) => { if (!z) return ''; const [x, y, w, hh] = ZONAS[z]; return `<rect class="foco" x="${x}" y="${y}" width="${w}" height="${hh}" rx="8"/>`; };
