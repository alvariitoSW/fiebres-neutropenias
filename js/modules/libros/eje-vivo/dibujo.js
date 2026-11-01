// Eje vivo · la escena (SVG 390×300): arriba el enfermo en la cama con suero, noradrenalina y termómetro y sus dos lupas; abajo la lupa abierta
// con el eje de tres estaciones (óvalo = hipotálamo, gota = hipófisis, triángulo sobre riñón = suprarrenal, mariposa = tiroides).
import { SILUETA_SVG, ORGANOS } from '../../../core/silueta.js';
import { eje, FILAS, PROD, acthVals } from './modelo.js';
export const ZONAS = { cuello: [28, 42, 48, 52], rinon: [78, 44, 60, 66], suero: [256, 4, 74, 98], termo: [334, 4, 52, 100], eje: [4, 126, 382, 170] };
const CX = [48, 143, 238, 333], CY = 176;
const niv = (v) => (v > .7 ? '↑' : v < .25 ? '↓' : 'N');
const num = (x) => String(x).replace('.', ',');
const flecha = (x1, x2, lv, i, lab) => `<g class="paso" data-i="${i}"><line class="fl" x1="${x1}" y1="${CY}" x2="${x2 - 6}" y2="${CY}" stroke-width="${(1.5 + 4 * lv).toFixed(1)}" opacity="${(.3 + .7 * lv).toFixed(2)}"/><path class="fl-p" d="M${x2} ${CY} l-8 -5 v10 z" opacity="${(.3 + .7 * lv).toFixed(2)}"/><text class="min" x="${(x1 + x2) / 2}" y="${CY - 10}" text-anchor="middle">${lab}</text></g>`;
const bloqueo = (x, y) => `<g class="bloq"><circle cx="${x}" cy="${y}" r="7"/><path d="M${x - 4} ${y - 4} l8 8 M${x + 4} ${y - 4} l-8 8"/></g>`;
const esc = (k, n, t) => `<g transform="translate(${CX[k]} ${CY}) scale(${n}) translate(${-CX[k]} ${-CY})">${t}</g>`;
// La silueta de tinta de la app (js/core/silueta.js) tumbada en la cama: cabeza a la izquierda. Los dos puntos de las lupas salen de ORGANOS
// (el cuello bajo la boca y el riñón) con el mismo giro que la silueta: x' = 0,5·y + 14, y' = 0,5·x + 20.
const GIRO = 'matrix(0 .5 .5 0 14 20)', alCuerpo = ([x, y]) => [+(.5 * y + 14).toFixed(1), +(.5 * x + 20).toFixed(1)];
export const PUNTO = { ti: alCuerpo([ORGANOS.boca[0], ORGANOS.boca[1] + 10]), sr: alCuerpo(ORGANOS.rinon) };
const SIL_DENTRO = SILUETA_SVG.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
const silueta = () => {
  const [tx, ty] = PUNTO.ti, [rx, ry] = PUNTO.sr;
  return `<g class="sil" transform="${GIRO}">${SIL_DENTRO}</g>`
    + `<ellipse class="forma" cx="${tx - 4}" cy="${ty}" rx="4.5" ry="4"/><ellipse class="forma" cx="${tx + 4}" cy="${ty}" rx="4.5" ry="4"/>`
    + `<path class="forma" d="M${rx - 6} ${ry - 8} l7 -5 v10z"/>`;
};
const formas = {
  hip: (x) => `<ellipse class="forma" cx="${x}" cy="${CY}" rx="24" ry="14"/>`,
  hipo: (x) => `<path class="forma" d="M${x} ${CY - 18} C${x + 24} ${CY + 2} ${x + 16} ${CY + 20} ${x} ${CY + 20} C${x - 16} ${CY + 20} ${x - 24} ${CY + 2} ${x} ${CY - 18} Z"/>`,
  sr: (x, k) => esc(2, k, `<ellipse class="rinon" cx="${x}" cy="${CY + 8}" rx="26" ry="12"/><path class="forma" d="M${x} ${CY - 22} L${x - 18} ${CY + 2} L${x + 18} ${CY + 2} Z"/>`),
  ti: (x, k) => esc(2, k, `<ellipse class="forma" cx="${x - 14}" cy="${CY}" rx="14" ry="12"/><ellipse class="forma" cx="${x + 14}" cy="${CY}" rx="14" ry="12"/><rect class="forma" x="${x - 6}" y="${CY - 3}" width="12" height="7"/>`),
  tej: (x) => `<rect class="forma" x="${x - 28}" y="${CY - 18}" width="56" height="36" rx="10"/>`,
};
const T = (x, y, txt, c = 'min', a = 'start') => `<text class="${c}" x="${x}" y="${y}" text-anchor="${a}">${txt}</text>`;
const cm = (x) => String(x).replace('.', ',');
// Mapa de la Tabla 51.2 (T4 libre × TSH, escala log): recuadro = rango normal; el punto es el laboratorio del paciente. Cifras de la tabla: ficha p. 53.
function mapaTiroides(lb) {
  const x0 = 44, y1 = 262, xs = (v) => x0 + 160 * (Math.log10(Math.min(100, Math.max(0.001, v))) + 3) / 5, ys = (v) => y1 - 96 * (Math.log10(Math.min(10, Math.max(0.1, v))) + 1) / 2;
  let h = `<rect class="caja" x="${x0}" y="166" width="160" height="96"/><rect class="norm" x="${xs(0.3)}" y="${ys(1.8)}" width="${xs(4.5) - xs(0.3)}" height="${ys(0.8) - ys(1.8)}"/>`;
  h += T(40, 169, '10', 'min', 'end') + T(40, ys(1) + 3, '1', 'min', 'end') + T(40, 265, '0,1', 'min', 'end') + T(x0, 274, '0,001', 'min') + T(xs(1), 274, '1', 'min', 'middle') + T(x0 + 160, 274, '100', 'min', 'end') + T(124, 288, 'TSH mU/mL (escala log)', 'min', 'middle') + T(8, 157, 'T4 libre ng/dL ↑', 'rot');
  if (!lb) return h + T(218, 170, 'Tiroides no pedido en este caso', 'rot');
  const f = lb.fila, fila = FILAS[filaDe(lb)];
  h += `<circle class="pt" cx="${xs(lb.tsh).toFixed(1)}" cy="${ys(lb.t4).toFixed(1)}" r="5"/>`;
  h += T(218, 162, 'Tabla 51.2 (p. 53)', 'min') + T(218, 178, fila ? fila[0] : 'Fuera de la tabla', 'rot') + T(218, 194, fila ? `T4 ${fila[1]} · TSH ${fila[2]}` : 'Combinación sin fila', 'min');
  h += T(218, 212, `T4 libre ${cm(Math.round(lb.t4 * 10) / 10)} ng/dL`, 'rot') + T(218, 226, `TSH ${lb.tsh < 0.01 ? '<0,01' : cm(Math.round(lb.tsh * 10) / 10)} mU/mL`, 'rot');
  return h + T(218, 246, 'Recuadro: rango normal', 'min') + T(218, 259, 'T4 0,8-1,8 · TSH 0,3-4,5', 'min') + T(218, 276, 'Unidad de la TSH: la de la tabla', 'min dim');
}
// Barra del cortisol aleatorio (0-60 µg/dL): <10 supresión, 10-35 indeterminado, ≥35 adecuado; el hueco tras 250 µg de ACTH (aumento <9 = supresión). Cortes de la ficha p. 50-51 (paciente crítico).
function barraCortisol(s, a) {
  const x = (v) => 20 + 346 * v / 60, rb = (v0, v1, c) => `<rect class="${c}" x="${x(v0)}" y="175" width="${x(v1) - x(v0)}" height="20"/>`;
  let h = rb(0, 10, 'b-r') + rb(10, 35, 'b-a') + rb(35, 60, 'b-v');
  h += T(20, 170, '0', 'min', 'middle') + T(x(10), 170, '10', 'min', 'middle') + T(x(35), 170, '35', 'min', 'middle') + T(366, 170, '60', 'min', 'end');
  h += T(x(5), 238, 'supresión', 'min', 'middle') + T(x(22.5), 238, 'indeterminado', 'min', 'middle') + T(x(47.5), 238, 'adecuada', 'min', 'middle');
  const av = acthVals(s);
  if (!av || (s.pac !== 'bibiana' && !s.acth)) return h + T(14, 258, s.pac === 'toribio' ? 'No hace falta medirlo: se trata ya (ficha p. 51)' : 'Cortisol no pedido en este caso', 'rot');
  h += `<path class="pt" d="M${x(av.b) - 5} 207 h10 l-5 -10 z"/>` + T(x(av.b), 218, String(av.b), 'rot', 'middle');
  if (s.acth) h += `<path class="pt hueco" d="M${x(av.post) - 5} 207 h10 l-5 -10 z"/>` + T(x(av.post) + 14, 218, String(av.post), 'rot', 'middle') + T(14, 254, `Tras 250 µg de ACTH sube ${av.d}: ${av.d < 9 ? 'menos de 9 = supresión.' : '9 o más: respuesta normal.'}`, 'rot') + T(14, 267, 'Con 9 o más, no descarta la secundaria.', 'min');
  else h += T(14, 254, 'Entre 10 y 35 no decide: mide la ACTH o haz la prueba.', 'rot');
  if (s.pac !== 'bibiana') return h;
  return h + T(14, 284, `Necesita ≈${PROD[s.estres]} mg/día (15-25 en reposo, 350 máx.: ficha p. 48)`, 'min dim');
}
const filaDe = (lb) => { const a = lb.t4 > 1.8 ? 'u' : lb.t4 < 0.8 ? 'd' : 'n', b = lb.tsh > 4.5 ? 'u' : lb.tsh < 0.3 ? 'd' : 'n'; return { nn: 'normal', ud: 'hyper', nd: 't3tox', un: 'hiperx', du: 'hipoP', dd: 'hipoS', dn: 'euS' }[a + b]; };
export function escena(s, L, o = {}) {
  const { a, t, lb } = eje(s), sr = o.lup === 'sr', v = s.vol / 3000, ta = Math.max(0, Math.min(1, (L.t - 33) / 9));
  let h = '';
  // ---- el enfermo ----
  h += `<line class="cama" x1="8" y1="104" x2="250" y2="104"/>${silueta()}`;
  const [tx, ty] = PUNTO.ti, [rx, ry] = PUNTO.sr;
  h += `<circle class="lupa${!sr ? ' sel' : ''}" cx="${tx}" cy="${ty}" r="13"/><circle class="lupa${sr ? ' sel' : ''}" cx="${rx}" cy="${ry}" r="15"/>`;
  h += `<text class="min" x="${tx}" y="118" text-anchor="middle">Tiroides</text><text class="min" x="${rx + 4}" y="118" text-anchor="middle">Suprarrenal</text>`;
  // suero, noradrenalina y temperatura
  h += `<rect class="tanque" x="262" y="10" width="34" height="52" rx="8"/><rect class="liq" x="264" y="${(60 - 48 * v).toFixed(1)}" width="30" height="${(48 * v).toFixed(1)}" rx="6"/><text class="min" x="279" y="76" text-anchor="middle">Suero</text><text class="rot" x="279" y="88" text-anchor="middle">${num(s.vol / 1000)} L</text>`;
  h += `<rect class="tanque" x="306" y="10" width="16" height="52" rx="4"/><rect class="liq" x="308" y="${(60 - 48 * s.na).toFixed(1)}" width="12" height="${(48 * s.na).toFixed(1)}" rx="3"/><text class="min" x="314" y="76" text-anchor="middle">NA</text><text class="rot" x="314" y="88" text-anchor="middle">${num(s.na.toFixed(1))}</text>`;
  h += `<rect class="tanque" x="350" y="10" width="12" height="52" rx="6"/><circle class="tanque" cx="356" cy="68" r="8"/><rect class="liq t" x="352" y="${(60 - 48 * ta).toFixed(1)}" width="8" height="${(48 * ta).toFixed(1)}" rx="3"/><text class="rot" x="356" y="92" text-anchor="middle">${num(L.t)} °C</text>`;
  // ---- la lupa abierta ----
  h += `<rect class="panel" x="4" y="126" width="382" height="170" rx="10"/><text class="rot" x="14" y="142">Lupa: ${sr ? 'suprarrenal' : 'tiroides'}${o.vista === 'mapa' ? (sr ? ' · cortisol aleatorio (µg/dL)' : ' · mapa de la Tabla 51.2') : ''}</text>`;
  if (o.vista === 'mapa') return h + (sr ? barraCortisol(s, a) : mapaTiroides(lb));
  const N = sr ? [a.crh, a.acth, a.cort] : [t.trh, t.tsh, t.t4];
  const Hn = sr ? ['CRH', 'ACTH', 'cortisol'] : ['TRH', 'TSH', 'T4'];
  h += `<g class="paso" data-i="0">${formas.hip(CX[0])}${formas.hipo(CX[1])}</g>`;
  h += sr ? `<g class="paso" data-i="1">${formas.sr(CX[2], 1 - .6 * a.atro)}</g>` : `<g class="paso" data-i="1">${formas.ti(CX[2], t.tam)}</g>`;
  h += `<g class="paso" data-i="2">${formas.tej(CX[3])}${!sr ? `<path class="tij" d="M${CX[3] - 10} ${CY - 8} l20 16 M${CX[3] + 10} ${CY - 8} l-20 16"/>` : ''}</g>`;
  h += `<text class="min" x="${CX[0]}" y="214" text-anchor="middle">Hipotálamo</text><text class="min" x="${CX[1]}" y="214" text-anchor="middle">Hipófisis</text><text class="min" x="${CX[2]}" y="214" text-anchor="middle">${sr ? 'Suprarrenal' : 'Tiroides'}</text><text class="min" x="${CX[3]}" y="214" text-anchor="middle">Tejidos</text>`;
  for (let i = 0; i < 3; i++) h += flecha(CX[i] + 30, CX[i + 1] - 30, N[i], i, Hn[i]);
  const tag = (k, txt) => `<text class="rot" x="${CX[k]}" y="226" text-anchor="middle">${txt}</text>`;
  h += sr ? tag(0, `CRH ${niv(a.crh)}`) + tag(1, `ACTH ${niv(a.acth)}`) + tag(2, `cortisol ${a.cort < a.need ? '↓' : niv(a.cort)}`) + tag(3, a.estado === 'falta' ? 'insuficiente' : 'cubierto')
    : tag(0, `TRH ${niv(t.trh)}`) + tag(1, `TSH ${niv(t.tsh)}`) + tag(2, `T4 ${niv(t.t4)}`) + tag(3, `T3 ${niv(t.t3)}${t.r3 ? ' · T3r ↑' : ''}`);
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

// El eje paso a paso (hipotálamo → hipófisis → glándula → tejidos → freno) con Motion; con «reducir movimiento», el estado final.
import { cargarMotion, sinMovimiento } from '../../../core/motion.js';
export async function animarEje(svg) {
  const pasos = [...svg.querySelectorAll('.paso')];
  if (!pasos.length || sinMovimiento()) return;
  try {
    const M = await cargarMotion();
    pasos.forEach((g, k) => { g.setAttribute('opacity', '0'); M.animate(0, 1, { duration: 0.35, delay: 0.3 * Number(g.dataset.i || k), ease: 'easeOut', onUpdate: (v) => g.setAttribute('opacity', v.toFixed(2)), onComplete: () => g.removeAttribute('opacity') }); });
  } catch { pasos.forEach((g) => g.removeAttribute('opacity')); }
}
