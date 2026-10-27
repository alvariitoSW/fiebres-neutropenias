// La lupa de la lámina 2 (maqueta b3-receptor): cerradura, canal, carro, prensa, bandeja, gránulos y su movimiento.
import { $, REDUCIR } from './util.js';
import { CELULAS, RECEPTORES, clamp } from '../../../data/receptor-vivo-data.js';
import { caja, cilindro, cilindroH, f2, formaD, llaveMini, marcas, materialDe, part, rad, tornillo, tubo } from './dibujos.js';
import { pausado } from './trazas.js';
import { ST } from './pagina.js';
/* ============================================================
   7. Lámina 2: la cerradura y su maquinaria (la mirada a 4×). Una cerradura de pines asentada en la doble capa de la
   membrana, con una ventana de corte que enseña los pines y la línea de corte: la llave buena los alinea y el cilindro
   gira; el tapón entra, no los alinea y se queda. Debajo, la maquinaria de cada célula:
   · miocito y nodo (Fig. 52.4, T pp. 10-11): carro → prensa que estampa AMPc con el ATP → bandeja → flotador y palanca que
     abren la compuerta del canal de Ca²⁺ → el calcio llega al efector (el sarcómero o el péndulo). La PDE, una trituradora.
   · célula lisa (fisiología general): carro con llaves de IP₃ → válvula del depósito (retículo) → calcio → trinquete de
     la miosina que acorta la célula. El β₂ (y el AMPc) levanta el gatillo del trinquete: la célula se afloja.
   · mastocito (S p. 66): la cerradura β y los gránulos; lo de en medio, la fuente no lo dice.
   En Fácil las máquinas quedan apagadas y un eje lleva la orden de la palanca al efecto; en Completa se encienden.
   ============================================================ */
export const L = { hx: 66, top: 60, bot: 152, rx: 31, ry: 10.5, memT: 96, memF: 106, memB: 136 };
L.corte = L.hx + 19;
export const PIN_Y = [76, 94, 112, 130];
export const largoPin = c => 4 + 3 * c;                          // cifra 1-4 → largo del pin de la llave
export const LEVA = { r: 40, y: L.bot + 9 };
export let lupaCel = 'miocito', heroe = null, lupaHecha = '', heroeActual = null;
export const setLupaCel = v => { lupaCel = v; };
export const setHeroe = v => { heroe = v; };
// La cerradura grande es la que mueve la máquina de la célula (la primera de su lista), salvo que el usuario toque otra
export function heroeDe(cel, R) {
  if (heroe && CELULAS[cel].receptores.includes(heroe)) return heroe;
  return CELULAS[cel].receptores[0];
}
export function membranaL(huecos) {
  let h = `<rect class="t-sup" x="0" y="${L.memT}" width="360" height="${L.memF - L.memT}" style="stroke:none"/>`;
  h += `<rect x="0" y="${L.memF}" width="360" height="${L.memB - L.memF}" style="fill:var(--bg-main)"/>`;
  for (let x = 3; x < 360; x += 6.4) {
    if (huecos.some(([a, b]) => x > a - 3 && x < b + 3)) continue;
    h += `<circle cx="${f2(x + 1.6)}" cy="${f2(L.memT + 5)}" r="1.5" style="fill:var(--text-dim);opacity:.55"/>`;
    h += `<path class="linea-f" d="M${f2(x - 0.9)} ${L.memF + 6}v9M${f2(x + 0.9)} ${L.memF + 6}v9M${f2(x - 0.9)} ${L.memB - 6}v-8M${f2(x + 0.9)} ${L.memB - 6}v-8"/>`;
    h += `<circle class="t-sup" cx="${f2(x)}" cy="${L.memF + 3.4}" r="2.8"/><circle class="t-sup" cx="${f2(x)}" cy="${L.memB - 3.4}" r="2.8"/>`;
  }
  h += `<path class="linea" d="M0 ${L.memT}H360M0 ${L.memF}H360M0 ${L.memB}H360"/>`;
  return h;
}
// La cerradura grande: carcasa, cilindro (con la boca de su forma y la marca que gira), ventana de corte con los pines
export function cerraduraGrande(rec) {
  const { hx, top, bot, rx, ry } = L, forma = RECEPTORES[rec].forma;
  let h = `<g id="rcv-l-cerr" data-pieza="cerradura">`;
  h += `<ellipse class="rcv-halo-s" cx="${hx + 3}" cy="${bot + 5}" rx="${rx + 5}" ry="${ry}"/>`;
  h += cilindro(hx, top, rx, ry, bot - top, { tono: 'med', lit: true });
  h += `<path class="linea-f" d="M${hx - rx} ${top + 16}a${rx} ${ry} 0 0 0 ${2 * rx} 0"/>`;
  for (const a of [190, 230, 270, 310, 350]) { const x = hx + (rx - 4) * Math.cos(rad(a)), y = top + (ry - 1.6) * Math.sin(rad(a)); h += tornillo(x, y, 1.1); }
  h += `<ellipse class="t-osc" cx="${hx}" cy="${top}" rx="18" ry="6.1"/><ellipse class="t-sup" cx="${hx}" cy="${top - 0.7}" rx="17.2" ry="5.7"/>`;
  h += `<path d="${formaD(forma, 4.6)}" transform="translate(${hx} ${top - 0.7}) scale(1 .5)" style="fill:var(--bg-main);stroke:var(--text-main);stroke-width:.8"/>`;
  h += `<g id="rcv-l-marca"></g>`;
  // la ventana de corte: el cilindro, la carcasa, las cámaras de los pines y la línea de corte
  const w0 = top + 9, w1 = bot - 6;
  h += `<clipPath id="rcv-clip-corte"><rect x="${hx}" y="${w0}" width="${rx - 1}" height="${w1 - w0}"/></clipPath>`;
  h += `<g clip-path="url(#rcv-clip-corte)"><rect x="${hx}" y="${w0}" width="${rx}" height="${w1 - w0}" style="fill:url(#rcv-g-densa)"/>`;
  h += `<rect x="${hx}" y="${w0}" width="${L.corte - hx}" height="${w1 - w0}" style="fill:var(--rcv-card2)"/>`;
  for (const y of PIN_Y) h += `<rect x="${hx}" y="${y - 4.6}" width="${rx}" height="9.2" style="fill:var(--bg-main)"/>`;
  h += `<g id="rcv-l-pines"></g><g id="rcv-l-hoja"></g>`;
  h += `<path class="rcv-marca-pin" d="M${L.corte} ${w0}V${w1}"/></g>`;
  h += `<path class="linea-h" d="M${hx} ${w0}V${w1}M${hx + rx - 1} ${w0}V${w1}M${hx} ${w0}H${hx + rx - 1}M${hx} ${w1}H${hx + rx - 1}"/>`;
  h += `<ellipse class="t-osc" cx="${hx}" cy="${LEVA.y - 2}" rx="8" ry="3"/><g id="rcv-l-leva"></g>`;
  return h + `</g>`;
}
export function cerraduraPeq(rec, x) {
  const forma = RECEPTORES[rec].forma, t = L.top + 20, b = L.bot - 4;
  let h = `<g id="rcv-l-sec-${rec}" data-cerr="${rec}" data-pieza="sec" data-x="${x}" role="button" aria-label="Cerradura ${RECEPTORES[rec].nombre}">`;
  h += `<rect x="${x - 17}" y="${t - 30}" width="34" height="${b - t + 36}" fill="transparent"/>`;
  h += cilindro(x, t, 12, 4.2, b - t, { tono: 'med' });
  h += `<ellipse class="t-sup" cx="${x}" cy="${t}" rx="7" ry="2.5"/><path d="${formaD(forma, 3)}" transform="translate(${x} ${t}) scale(1 .5)" style="fill:var(--bg-main);stroke:var(--text-main);stroke-width:.7"/>`;
  h += `<path class="linea-f" d="M${x - 12} ${t + 10}a12 4.2 0 0 0 24 0"/>`;
  return h + `<g class="rcv-sec-ocupa"></g><g class="rcv-sec-varilla"></g></g>`;
}
// El canal de calcio con su compuerta (miocito y nodo)
export const CANAL = { x: 312, y0: 84, y1: 146 };
export function canalCa() {
  const K = CANAL;
  let h = `<g id="rcv-l-canal" data-pieza="canal">`;
  h += caja(K.x - 13, K.y1, 9, K.y1 - K.y0, 7, { tono: 'med' }) + caja(K.x + 5, K.y1, 9, K.y1 - K.y0, 7, { tono: 'med' });
  h += `<path class="linea-f" d="M${K.x - 11} ${K.y0 + 8}h6M${K.x - 11} ${K.y0 + 18}h6M${K.x + 7} ${K.y0 + 8}h6M${K.x + 7} ${K.y0 + 18}h6"/>`;
  h += `<g id="rcv-l-compuerta"></g>`;
  return h + `</g>`;
}
// El carro (la proteína G) sobre su raíl, con la biela que lo empuja desde la leva
export const RAIL = { y: 192, x0: 96, x1: 188, c0: 104, c1: 160 };
export function carroYRail(gq) {
  const Q = RAIL;
  let h = `<g class="rcv-solo-completa">`;
  h += caja(Q.x0, Q.y + 4, Q.x1 - Q.x0, 1.4, 9, { tono: 'sup' }) + caja(Q.x0, Q.y, Q.x1 - Q.x0, 1.4, 9, { tono: 'sup' });
  for (let x = Q.x0 + 3; x < Q.x1; x += 7) h += `<path class="linea-f" d="M${x} ${Q.y + 4.6}l3.8 -3.1"/>`;
  h += caja(Q.x1, Q.y + 6, 4, 9, 9, { tono: 'med' });
  h += `<g id="rcv-l-carro" data-pieza="carro">${caja(0, Q.y - 5, 26, 12, 8, { tono: 'med', lit: true })}`;
  h += `<circle class="t-sup" cx="5.5" cy="${Q.y - 2}" r="3.5"/><circle class="t-sup" cx="20.5" cy="${Q.y - 2}" r="3.5"/><circle cx="5.5" cy="${Q.y - 2}" r="1" style="fill:var(--text-dim)"/><circle cx="20.5" cy="${Q.y - 2}" r="1" style="fill:var(--text-dim)"/>`;
  h += tornillo(4.5, Q.y - 19.5, 0.9) + tornillo(21.5, Q.y - 19.5, 0.9) + `<path class="linea-f" d="M3 ${Q.y - 11}h20"/>`;
  if (gq) h += `<g id="rcv-l-ip3-carga"></g>`;
  h += `</g><path id="rcv-l-biela" class="linea-h" d="M0 0" style="stroke-width:1.5"/>`;
  return h + `</g>`;
}
// La prensa (adenilato ciclasa): bancada, columnas, travesaño y pisón; el ATP entra por la rampa
export const PRENSA = { x: 196, y: 254 };
export function prensa() {
  const P2 = PRENSA;
  let h = `<g id="rcv-l-prensa" data-pieza="prensa" class="rcv-solo-completa">`;
  h += caja(P2.x, P2.y, 60, 7, 14, { tono: 'med' });
  h += caja(P2.x + 4, P2.y - 7, 5, 82, 5, { tono: 'med' }) + caja(P2.x + 49, P2.y - 7, 5, 82, 5, { tono: 'med' });
  h += caja(P2.x + 1, P2.y - 89, 58, 8, 10, { tono: 'med', lit: true }) + tornillo(P2.x + 5, P2.y - 100.5, 1) + tornillo(P2.x + 53, P2.y - 100.5, 1);
  h += `<path class="linea-f" d="M${P2.x + 6} ${P2.y - 93}h46"/>`;
  h += `<g id="rcv-l-pison"></g>`;
  h += caja(P2.x - 30, P2.y - 14, 32, 1.4, 8, { tono: 'sup' });
  h += `<g id="rcv-l-atp"></g>`;
  return h + `</g>`;
}
// La bandeja del AMPc, la trituradora (PDE) con su cubeta, y el flotador con su palanca (la proteína cinasa)
export const BAND = { x: 214, y: 288, w: 78, h: 22 };
export function bandejaPdeFlotador() {
  const B2 = BAND;
  let h = `<g id="rcv-l-bandeja" data-pieza="bandeja" class="rcv-solo-completa">`;
  h += `<path class="t-osc" d="M${B2.x} ${B2.y - B2.h}h${B2.w}l6 -4.6h${-B2.w}Z"/><path class="t-med" d="M${B2.x} ${B2.y - B2.h}v${B2.h}h${B2.w}v${-B2.h}"/>`;
  h += `<g id="rcv-l-monedas"></g><path class="t-med" d="M${B2.x} ${B2.y}h${B2.w}v-9h${-B2.w}Z" style="opacity:.92"/><path class="linea-f" d="M${B2.x} ${B2.y - 5}h${B2.w}"/>`;
  h += `</g>`;
  h += `<g id="rcv-l-pde" data-pieza="pde" class="rcv-solo-completa">`;
  h += `<path class="t-sup" d="M${B2.x + 8} ${B2.y}l6 7h8l6 -7Z"/><g id="rcv-l-engranajes"></g>`;
  h += caja(B2.x + 2, B2.y + 34, 34, 8, 8, { tono: 'med' }) + `<g id="rcv-l-amp"></g><g id="rcv-l-cuna"></g>`;
  h += `</g>`;
  h += `<g id="rcv-l-mano" data-pieza="mano" class="rcv-solo-completa"><g id="rcv-l-flotador"></g>${caja(296, 236, 7, 40, 5, { tono: 'med' })}${tornillo(299.5, 194, 1.4)}<g id="rcv-l-palanca"></g></g>`;
  return h;
}
export const engranaje = (cx, cy, r, ang) => {
  let d = ''; const n = 10;
  for (let i = 0; i < n * 2; i++) { const a = ang + i * Math.PI / n, rr = i % 2 ? r : r + 2.2; d += `${i ? 'L' : 'M'}${f2(cx + rr * Math.cos(a))} ${f2(cy + rr * Math.sin(a))}`; }
  return `<path class="t-sup" d="${d}Z"/><circle cx="${cx}" cy="${cy}" r="2" style="fill:var(--rcv-card2);stroke:var(--text-dim);stroke-width:.6"/>`;
};
// El depósito de calcio (retículo) con su válvula de IP₃ (célula lisa)
export function deposito(x0, x1, cy, r) {
  const vx = (x0 + x1) / 2;
  let h = `<g id="rcv-l-ret" data-pieza="reticulo" data-vx="${vx}" data-vy="${cy + r}">`;
  h += cilindroH(x0, x1, cy, r, { tono: 'med', lit: true }) + `<ellipse class="t-med" cx="${x0}" cy="${cy}" rx="${f2(r * 0.36)}" ry="${r}"/>`;
  for (let x = x0 + 8; x < x1 - 4; x += 9) h += `<circle cx="${x}" cy="${cy - r + 1.6}" r=".75" style="fill:var(--text-dim)"/><circle cx="${x}" cy="${cy + r - 1.6}" r=".75" style="fill:var(--text-dim)"/>`;
  h += `<rect x="${vx - 22}" y="${cy - 9}" width="44" height="18" rx="3" style="fill:var(--bg-main);stroke:var(--text-main);stroke-width:.7"/><g id="rcv-l-nivel" data-x="${vx - 22}" data-y="${cy - 9}"></g>`;
  h += caja(vx - 5, cy + r + 9, 10, 9, 5, { tono: 'med' }) + `<g id="rcv-l-valvula"></g>`;
  return h + `</g>`;
}
// Los efectores: el sarcómero (miocito), el péndulo (nodo), el trinquete (célula lisa)
export function efector(tipo) {
  let h = `<g id="rcv-l-trinq" data-pieza="${tipo}">`;
  if (tipo === 'fuerza') h += caja(20, 370, 326, 3, 10, { tono: 'base' }) + `<g id="rcv-l-sarc"></g>`;
  else if (tipo === 'ritmo') h += caja(20, 370, 200, 4, 10, { tono: 'base' }) + caja(70, 366, 22, 40, 8, { tono: 'med' }) + marcas(98, 196, 362.6, 4, 2) + `<g id="rcv-l-pend"></g>`;
  else if (tipo === 'fuga') h += caja(16, 370, 330, 3, 10, { tono: 'base' }) + `<g id="rcv-l-endo"></g>`;
  else if (tipo === 'acorta') h += caja(16, 370, 330, 3, 10, { tono: 'base' }) + caja(18, 362, 16, 40, 8, { tono: 'med', lit: true }) + caja(34, 368.4, 300, 1, 5, { tono: 'sup' }) + marcas(36, 330, 367.2, 4.5, 2) + `<g id="rcv-l-cuerda"></g>`;
  return h + `</g>`;
}
export function granulos() {
  let h = `<g id="rcv-l-gran" data-pieza="granulos">`;
  h += `<g id="rcv-l-gran-v"></g><g id="rcv-l-pestillo"></g>`;
  h += `<g id="rcv-l-duda" data-pieza="duda">${caja(100, 238, 44, 26, 5, { tono: 'sup' })}<text class="rcv-rot" x="122" y="231" font-size="17" text-anchor="middle" style="font-style:normal;fill:var(--text-main)">?</text>${tornillo(104, 216, 0.9)}${tornillo(140, 216, 0.9)}</g>`;
  return h + `</g>`;
}
export function montarLupa(cel, R) {
  const C2 = CELULAS[cel], hero = heroeDe(cel, R), otros = C2.receptores.filter(r => r !== hero), maq = C2.maquinaria;
  const posSec = [146, 190, 234].slice(0, otros.length);
  let h = `<rect class="rcv-fondo" x="0" y="0" width="360" height="372"/><rect x="0" y="${L.memB}" width="360" height="${372 - L.memB}" style="fill:url(#rcv-g-fina);opacity:.5"/>`;
  h += `<g id="rcv-l-fuera"></g>`;
  const huecos = [[L.hx - L.rx, L.hx + L.rx], ...posSec.map(x => [x - 12, x + 12])];
  if (C2.canal) huecos.push([CANAL.x - 15, CANAL.x + 17]);
  h += membranaL(huecos);
  h += efector(C2.efector === 'granulos' ? 'fuga' : C2.efector);
  if (maq === 'gs' || maq === 'gs-relaja') h += prensa() + bandejaPdeFlotador();
  if (maq === 'gq') h += `<g class="rcv-solo-completa-no">${deposito(196, 300, 214, 22)}</g>`;
  if (maq === 'gs-relaja') h += deposito(306, 352, 226, 15);
  if (C2.canal) h += canalCa();
  if (maq !== 'duda') h += carroYRail(maq === 'gq');
  h += `<g class="rcv-solo-facil" id="rcv-l-eje"></g>`;
  if (maq === 'duda') h += granulos();
  h += `<g id="rcv-l-relaja"></g>`;
  h += otros.map((r, i) => cerraduraPeq(r, posSec[i])).join('');
  h += cerraduraGrande(hero);
  h += `<g id="rcv-l-llave-g"></g><g id="rcv-l-ca"></g><g id="rcv-guia-capa-l"></g>`;
  $('lupa').innerHTML = h;
  lupaHecha = cel + hero; heroeActual = hero;
  aplicarCascada();
}
// Fácil: las máquinas se apagan (quedan en sombra) y el eje lleva la orden; Completa: se encienden, el eje se va
export function aplicarCascada() {
  const comp = ST.cas === 'completa';
  document.querySelectorAll('#rcv-rcv-lupa .rcv-solo-completa').forEach(e => { e.setAttribute('opacity', comp ? 1 : 0.16); e.style.pointerEvents = comp ? '' : 'none'; });
  document.querySelectorAll('#rcv-rcv-lupa .rcv-solo-facil').forEach(e => e.setAttribute('display', comp ? 'none' : 'inline'));
}
/* ---- El movimiento de la lámina 2 (todo sale de efecto(); con «reducir movimiento», el estado final) ---- */
export const V2 = { u: 0, giro: 0, carro: 0, ampc: 0.2, compuerta: 0, ip3: 0, relaja: 0, suelta: 0 };
export function objetivosLupa(R) {
  const cel = lupaCel, hero = heroeActual, c = R.A.occ[cel][hero], act = R.A.act(cel, hero), m = R.A.maq[cel] || {};
  const tapon = c.tap > 0.3, llave = c.ag > 0.08;
  // ¿alguna cerradura de la célula gira? (el carro lo empujan todas las de su vía)
  const via = RECEPTORES[hero].via, gira = CELULAS[cel].receptores.some(r => RECEPTORES[r].via === via && R.A.act(cel, r) > 0.2);
  return { cel, hero, tapon, llave, quien: c.quien, u: tapon || llave ? 1 : 0, giro: !tapon && act > 0.2 ? 1 : 0, carro: gira ? 1 : 0,
    ampc: m.ampc ?? 0.2, ip3: m.ip3 ?? 0, relaja: m.relaja ?? 0, pde: R.A.dentro.pde, suelta: R.A.maq.mastocito.suelta };
}
export function seguir(v, obj, dt, k = 4) { return REDUCIR || pausado ? obj : v + (obj - v) * (1 - Math.exp(-k * dt)); }
export function animarLupa(t, dt, R) {
  const O = objetivosLupa(R), C2 = CELULAS[lupaCel], maq = C2.maquinaria, hero = O.hero, forma = RECEPTORES[hero].forma;
  V2.u = seguir(V2.u, O.u, dt, 3); V2.giro = seguir(V2.giro, V2.u > 0.95 ? O.giro : 0, dt, 3);
  V2.carro = seguir(V2.carro, O.carro && (V2.giro > 0.6 || !O.giro) ? 1 : 0, dt, 2.5); V2.ampc = seguir(V2.ampc, O.ampc, dt, 1.5);
  V2.ip3 = seguir(V2.ip3, O.ip3, dt, 1.5); V2.relaja = seguir(V2.relaja, O.relaja, dt, 1.5); V2.suelta = seguir(V2.suelta, O.suelta, dt, 1.5);
  const { hx, top, bot } = L, cif = RECEPTORES[hero].pines, cifTapon = cif.map(v => 5 - v);
  // la llave (o el tapón) en la cerradura grande; si está tapada, la llave del fármaco choca y rebota al lado
  const llaveG = (mat, dy, dx, rebota) => {
    let s = `<g id="rcv-${rebota ? 'l-llave-rebota' : 'l-llave'}" transform="translate(${f2(dx)} ${f2(dy)})">`;
    if (mat === 'ciega') s += `<rect class="rcv-ciega" x="${hx - 13}" y="${top - 46}" width="26" height="19" rx="3.4"/><path class="rcv-ciega-b" d="M${hx - 15} ${top - 36.5}h30"/><rect class="rcv-ciega" x="${hx - 4}" y="${top - 27}" width="8" height="24"/>`;
    else s += `<path class="rcv-${mat}" d="${formaD(forma, 14)}" transform="translate(${hx} ${top - 40})"/><path d="${formaD(forma, 6)}" transform="translate(${hx} ${top - 40})" style="fill:var(--bg-main);stroke:var(--accent-yellow);stroke-width:.6"/>`
      + `<rect class="rcv-${mat}" x="${hx - 7}" y="${top - 27}" width="14" height="4" rx="1.2"/><rect class="rcv-${mat}" x="${hx - 4}" y="${top - 23}" width="8" height="20"/><path class="linea-f" d="M${hx - 4} ${top - 17}h8M${hx - 4} ${top - 12}h8"/>`;
    return s + `</g>`;
  };
  let hk = '';
  if (O.tapon) {
    hk += llaveG('ciega', 0, 0, false);
    if (O.llave) { const fase = REDUCIR || pausado ? 0.5 : ((t / 1300) % 1); hk += llaveG(materialDe(O.quien), -6 - 10 * Math.abs(Math.sin(fase * Math.PI)), 34, true); }
  } else if (O.llave || V2.u > 0.02) hk += llaveG(materialDe(O.quien || 'na'), -34 * (1 - V2.u), 0, false);
  $('l-llave-g').innerHTML = hk;
  // la hoja de la llave en el corte y los pines (la llave buena los deja justo en la línea de corte)
  const enLlave = O.tapon ? 1 : V2.u, cifUsada = O.tapon ? cifTapon : cif;
  let hp = '', hh = '';
  if (enLlave > 0.02 && (O.tapon || O.llave || V2.u > 0.02)) {
    const yTip = top + 9 + (bot - top - 12) * enLlave;
    let d = `M${hx} ${top + 9}`;
    PIN_Y.forEach((y, i) => { const xb = L.corte - largoPin(cifUsada[i]); if (y < yTip) d += `L${hx} ${y - 6}L${f2(xb)} ${y - 2.4}L${f2(xb)} ${y + 2.4}L${hx} ${y + 6}`; });
    d += `L${hx} ${f2(yTip)}Z`;
    hh = `<path class="${O.tapon ? 'rcv-ciega' : "rcv-" + materialDe(O.quien || 'na')}" d="${d}"/>`;
  }
  PIN_Y.forEach((y, i) => {
    const lk = largoPin(cif[i]), apoyo = enLlave > (i + 0.6) / 4 ? L.corte - largoPin(cifUsada[i]) : hx + 1;
    const x0 = Math.max(hx + 1, apoyo), x1 = x0 + lk, x2 = x1 + 9;
    hp += `<rect class="rcv-oro-osc" x="${f2(x0)}" y="${y - 3.3}" width="${f2(lk)}" height="6.6" rx="2.6"/><rect class="t-sup" x="${f2(x1)}" y="${y - 3.3}" width="9" height="6.6" rx="1.2"/>`;
    let z = `M${f2(x2)} ${y}`; const n = 5, w = (hx + L.rx - 1 - x2) / n; for (let k = 0; k < n; k++) z += `l${f2(w / 2)} ${k % 2 ? 2.6 : -2.6}l${f2(w / 2)} ${k % 2 ? -2.6 : 2.6}`;
    hp += `<path class="linea" d="${z}"/>`;
  });
  $('l-pines').innerHTML = hp; $('l-hoja').innerHTML = hh;
  // la marca del cilindro y la leva de abajo
  const g = V2.giro * rad(150);
  $('l-marca').innerHTML = `<path class="linea-h" d="M${hx} ${top - 0.7}L${f2(hx + 14 * Math.cos(-g))} ${f2(top - 0.7 + 4.7 * Math.sin(-g))}" style="stroke-width:1.4"/>`;
  const al = Math.PI + rad(25) - g * 1.15, lev = [hx + LEVA.r * Math.cos(al), LEVA.y + 11 * Math.sin(al)];
  $('l-leva').innerHTML = `<path d="M${hx} ${LEVA.y - 2}L${f2(lev[0])} ${f2(lev[1])}" style="stroke:var(--text-dim);stroke-width:6;stroke-linecap:round"/><path d="M${hx} ${LEVA.y - 2}L${f2(lev[0])} ${f2(lev[1])}" style="stroke:var(--rcv-card2);stroke-width:4.2;stroke-linecap:round"/><circle cx="${f2(lev[0])}" cy="${f2(lev[1])}" r="2" class="t-sup"/><circle cx="${hx}" cy="${LEVA.y - 2}" r="2.4" class="t-sup"/>`;
  // las cerraduras pequeñas: su llave o su tapón
  document.querySelectorAll('#rcv-rcv-lupa [data-pieza="sec"]').forEach(gs => {
    const rec = gs.dataset.cerr, c = R.A.occ[lupaCel][rec], x = +gs.dataset.x, t0 = L.top + 20;
    let s = '';
    if (c.tap > 0.3) s += `<g transform="translate(${x} ${t0 - 1}) rotate(90) scale(1.35)">${llaveMini(RECEPTORES[rec].forma, 'ciega')}</g>`;
    if (c.ag > 0.08) s += `<g transform="translate(${x + (c.tap > 0.3 ? 11 : 0)} ${t0 - (c.tap > 0.3 ? 14 : 1)}) rotate(90) scale(1.35)">${llaveMini(RECEPTORES[rec].forma, materialDe(c.quien))}</g>`;
    gs.querySelector('.rcv-sec-ocupa').innerHTML = s;
    // si su cerradura es de la misma vía que la máquina, empuja también el carro con su varilla
    const mismaVia = RECEPTORES[rec].via === RECEPTORES[hero].via && maq !== 'duda';
    const activa = R.A.act(lupaCel, rec) > 0.2;
    gs.querySelector('.rcv-sec-varilla').innerHTML = mismaVia ? `<path d="M${x} ${L.bot + 2}V${RAIL.y - 16}H${f2(Math.max(x - 14, RAIL.c0 + 26 * 0 + 30))}" style="fill:none;stroke:var(${activa ? '--text-main' : '--text-muted'});stroke-width:${activa ? 1.6 : 1};stroke-dasharray:${activa ? 'none' : '2 2'}"/>` : '';
  });
  // fuera: llaves que bajan hacia las cerraduras (tantas como ocupación: ilustrativo) y el calcio que espera
  let hf = '';
  CELULAS[lupaCel].receptores.forEach((rec, j) => { const c = R.A.occ[lupaCel][rec]; if (c.ag < 0.08) return; const n = Math.round(1 + c.ag * 2);
    for (let i = 0; i < n; i++) { const u = REDUCIR || pausado ? (i + 0.5) / n : ((t / 5600 + i / n + j * 0.21) % 1); const x = 132 + ((i * 61 + j * 47) % 150), y = 4 + u * 50;
      hf += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(90)" opacity="${f2(0.95 - 0.5 * u)}">${llaveMini(RECEPTORES[rec].forma, materialDe(c.quien), 1.7)}</g>`; } });
  if (C2.canal) for (let i = 0; i < 6; i++) hf += part('ca', CANAL.x - 14 + i * 6 + (i % 2) * 2, 66 + (i % 3) * 7, 2.7);
  $('l-fuera').innerHTML = hf;
  // el carro y su biela
  let cx0 = RAIL.c0;
  if (maq !== 'duda' && $('l-carro')) {
    cx0 = RAIL.c0 + (RAIL.c1 - RAIL.c0) * V2.carro;
    $('l-carro').setAttribute('transform', `translate(${f2(cx0)} 0)`);
    $('l-biela').setAttribute('d', `M${f2(lev[0])} ${f2(lev[1])}L${f2(cx0)} ${RAIL.y - 9}`);
    if (maq === 'gq' && $('l-ip3-carga')) { let s = ''; const n = Math.round(V2.ip3 * 3); for (let i = 0; i < n; i++) s += `<g transform="translate(${7 + i * 6} ${RAIL.y - 22}) rotate(90) scale(.8)">${llaveMini('peine', 'crema')}</g>`; $('l-ip3-carga').innerHTML = s; }
  }
  // el eje del modo Fácil: de la leva al efecto
  if ($('l-eje')) {
    const ret = $('l-ret'), dest = maq === 'gq' ? [+ret.dataset.vx, +ret.dataset.vy + 2] : maq === 'gs' ? [CANAL.x, CANAL.y1 + 4] : maq === 'gs-relaja' ? [300, 318] : null;
    $('l-eje').innerHTML = !dest ? '' : `<path d="M${f2(lev[0])} ${f2(lev[1])}L${f2(lev[0])} 176L${dest[0]} 176L${dest[0]} ${dest[1]}" style="fill:none;stroke:var(--text-dim);stroke-width:4;stroke-linejoin:round"/><path d="M${f2(lev[0])} ${f2(lev[1])}L${f2(lev[0])} 176L${dest[0]} 176L${dest[0]} ${dest[1]}" style="fill:none;stroke:var(--rcv-card2);stroke-width:2.4;stroke-linejoin:round"/><circle cx="${f2(lev[0])}" cy="176" r="2.6" class="t-sup"/><circle cx="${dest[0]}" cy="176" r="2.6" class="t-sup"/>`;
  }
  if (maq === 'gs' || maq === 'gs-relaja') animarGs(t, O, maq);
  if (maq === 'gq' || maq === 'gs-relaja') animarGq(t, O, maq);
  if (C2.efector === 'fuerza') animarSarcomero(t, R);
  if (C2.efector === 'ritmo') animarPendulo(t, R);
  if (C2.efector === 'acorta') animarTrinquete(t, R, maq);
  if (maq === 'duda') animarGranulos(t, O, R, lev);
}
export function animarGs(t, O, maq) {
  const P2 = PRENSA, B2 = BAND, activo = V2.carro > 0.8 ? clamp((V2.ampc - 0.2) / 0.6, 0.15, 1) : 0.06;
  const ciclo = REDUCIR || pausado ? 0.25 : (t / (1600 - 700 * activo)) % 1, baja = Math.max(0, Math.sin(ciclo * Math.PI * 2)) * (V2.carro > 0.8 ? 1 : 0.12);
  $('l-pison').innerHTML = `<path class="linea" d="M${P2.x + 29} ${P2.y - 81}V${f2(P2.y - 66 + 26 * baja)}" style="stroke-width:3.2"/>` + caja(P2.x + 19, P2.y - 52 + 26 * baja, 20, 10, 7, { tono: 'sup', lit: V2.carro > 0.8 });
  let s = ''; for (let i = 0; i < 3; i++) { const x = P2.x - 24 + i * 9, y = P2.y - 16.8; s += `<ellipse class="rcv-atp" cx="${x}" cy="${y}" rx="4" ry="1.8"/>` + [-1.6, 0, 1.6].map(d => `<circle cx="${f2(x + d)}" cy="${f2(y - 0.2)}" r=".5" style="fill:var(--text-dim)"/>`).join(''); }
  if (V2.carro > 0.8) s += `<ellipse class="rcv-ampc" cx="${P2.x + 29}" cy="${P2.y - 10}" rx="4" ry="1.8"/><ellipse cx="${P2.x + 29}" cy="${P2.y - 10}" rx="1.5" ry=".65" style="fill:var(--bg-main)"/>`;
  $('l-atp').innerHTML = s;
  // las monedas de AMPc en la bandeja (anillos)
  const n = Math.round(clamp(V2.ampc, 0, 1.6) * 10); let m = '';
  for (let i = 0; i < n; i++) { const fila = Math.floor(i / 8), x = B2.x + 7 + (i % 8) * 8.4 + (fila % 2) * 4, y = B2.y - 12 - fila * 3.8; m += `<ellipse class="rcv-ampc" cx="${f2(x)}" cy="${f2(y)}" rx="3.6" ry="1.7"/><ellipse cx="${f2(x)}" cy="${f2(y)}" rx="1.3" ry=".6" style="fill:var(--bg-main)"/>`; }
  $('l-monedas').innerHTML = m;
  // la trituradora: gira salvo que la cuña de la milrinona la atasque
  const atasco = O.pde > 0.05, ang = atasco ? 0.3 : (REDUCIR || pausado ? 0 : t / 900);
  $('l-engranajes').innerHTML = engranaje(B2.x + 12, B2.y + 15, 7.5, ang) + engranaje(B2.x + 29, B2.y + 15, 7.5, -ang + 0.3);
  $('l-cuna').innerHTML = atasco ? `<path class="rcv-oro" d="M${B2.x + 20.5} ${B2.y + 6}l-4.4 13h8.8Z"/><path class="rcv-oro" d="M${B2.x + 17} ${B2.y + 6}h7l-1 -6h-5Z"/>` : '';
  let am = ''; const nAmp = atasco ? 1 : 4; for (let i = 0; i < nAmp; i++) am += `<path d="M${B2.x + 7 + i * 7} ${B2.y + 30}l1.8 -2.8l1.8 2.8Z" style="fill:var(--text-muted)"/>`;
  $('l-amp').innerHTML = am;
  // el flotador sobre las monedas y la palanca de la proteína cinasa
  const alto = Math.min(18, Math.ceil(n / 8) * 3.8), yf = B2.y - 17 - alto, xf = B2.x + B2.w - 8;
  const abre = clamp((V2.ampc - 0.2) / 0.7, 0.06, 1);
  V2.compuerta = seguir(V2.compuerta, abre, 0.05, 6);
  const a = -0.3 + 0.75 * V2.compuerta, px = 299.5, py = 194, l1 = 21, l2 = 22;
  const e1 = [px - l1 * Math.cos(a), py + l1 * Math.sin(a)], e2 = [px + l2 * Math.cos(a), py - l2 * Math.sin(a)];
  $('l-flotador').innerHTML = `<path class="linea" d="M${xf} ${f2(yf)}V${f2(e1[1])}H${f2(e1[0])}" style="stroke-width:1.4"/><circle class="rcv-esfera" cx="${xf}" cy="${f2(yf + 1)}" r="5.4"/><path class="linea-f" d="M${xf - 3.6} ${f2(yf - 0.6)}a5 5 0 0 1 4 -3.4"/>`;
  $('l-palanca').innerHTML = `<path d="M${f2(e1[0])} ${f2(e1[1])}L${f2(e2[0])} ${f2(e2[1])}" style="stroke:var(--text-dim);stroke-width:4.4;stroke-linecap:round"/><path d="M${f2(e1[0])} ${f2(e1[1])}L${f2(e2[0])} ${f2(e2[1])}" style="stroke:var(--rcv-card2);stroke-width:2.6;stroke-linecap:round"/><circle cx="${px}" cy="${py}" r="2.2" class="t-sup"/>`;
  if ($('l-compuerta')) {
    const ga = V2.compuerta * 1.2, hx2 = CANAL.x - 5, hy = CANAL.y1 + 2;
    $('l-compuerta').innerHTML = `<path d="M${f2(e2[0])} ${f2(e2[1])}L${f2(hx2 + 12 * Math.cos(ga))} ${f2(hy + 12 * Math.sin(ga))}" class="linea" style="stroke-width:1"/><path d="M${hx2} ${hy}L${f2(hx2 + 13 * Math.cos(ga))} ${f2(hy + 13 * Math.sin(ga))}" style="stroke:var(--text-main);stroke-width:2.8;stroke-linecap:round"/><circle cx="${hx2}" cy="${hy}" r="1.7" class="t-sup"/>`;
    let c = ''; const nCa = Math.round(1 + 8 * V2.compuerta);
    for (let i = 0; i < nCa; i++) { const u = REDUCIR || pausado ? (i + 0.5) / nCa : ((t / 2800 + i / nCa) % 1);
      const y = CANAL.y0 + u * (330 - CANAL.y0), x = CANAL.x + 2 + Math.sin(i * 1.7 + u * 6) * (u < 0.25 ? 1 : 6) - (u > 0.62 ? (u - 0.62) * 520 * ((i % 3) / 3 + 0.3) : 0);
      c += part('ca', x, y, 2.8); }
    $('l-ca').innerHTML = c;
  } else if (maq === 'gs-relaja') {
    // en el bronquio, la palanca no abre un canal: levanta el gatillo del trinquete (fisiología general)
    $('l-ca').innerHTML = '';
  }
}
export function animarGq(t, O, maq) {
  const ret = $('l-ret'); if (!ret) return;
  const vx = +ret.dataset.vx, vy = +ret.dataset.vy, ab = clamp(V2.ip3, 0, 1), nivel = 1 - 0.35 * ab;
  const nv = $('l-nivel'), nx = +nv.dataset.x, ny = +nv.dataset.y;
  nv.innerHTML = `<rect x="${nx + 1}" y="${f2(ny + 18 * (1 - nivel))}" width="42" height="${f2(18 * nivel)}" style="fill:var(--text-main);opacity:.16"/>` + Array.from({ length: 7 }, (_, i) => part('ca', nx + 5 + i * 5.6, ny + 12 - (i % 2) * 4 + 4 * (1 - nivel), 2)).join('');
  $('l-valvula').innerHTML = `<g transform="translate(${vx} ${vy + 9})"><ellipse class="t-sup" rx="6.4" ry="2.2"/><path class="linea" d="M-6.4 0h12.8" transform="rotate(${f2(ab * 160)})"/></g>`
    + (ab > 0.05 ? `<g transform="translate(${vx - 10} ${vy + 4}) rotate(0) scale(.9)">${llaveMini('peine', 'crema')}</g>` : '');
  let c = ''; const n = Math.round(ab * 8), dest = maq === 'gq' ? 120 : 210;
  for (let i = 0; i < n; i++) { const u = REDUCIR || pausado ? (i + 0.5) / n : ((t / 2500 + i / n) % 1); c += part('ca', vx + Math.sin(i * 2.1 + u * 5) * 4 - u * dest * ((i % 3) / 3 + 0.4), vy + 14 + u * (334 - vy - 14), 2.5); }
  if (maq === 'gq') $('l-ca').innerHTML = c; else $('l-ca').innerHTML += c;
  // en el bronquio, la cerradura muscarínica abre la válvula por su cuenta (fisiología general): un tubo la une
  if (maq === 'gs-relaja' && !$('l-tubo-musc')) { const sec = $('l-sec-musc'); if (sec) { const x = +sec.dataset.x; sec.insertAdjacentHTML('beforebegin', `<g id="rcv-l-tubo-musc">${tubo([[x, L.bot], [x, 170], [vx, 170], [vx, vy - 30]], 1.2, { luz: false })}</g>`); } }
}
export function animarSarcomero(t, R) {
  const T = 60000 / R.fc, fase = REDUCIR || pausado ? 0.2 : (t % T) / T, sist = Math.max(0, Math.sin(clamp(fase / 0.4, 0, 1) * Math.PI));
  const F = clamp(V2.ampc, 0.2, 1.4), s = 0.03 + 0.1 * sist * F;
  const zl = 30 + 70 * s, zr = 336 - 70 * s, mid = (zl + zr) / 2;
  let h = '';
  for (const z of [zl, zr]) h += `<path d="M${f2(z)} 316l3.4 6.4l-3.4 6.4l3.4 6.4l-3.4 6.4l3.4 6.4l-3.4 6.4l3.4 6.4" style="fill:none;stroke:var(--text-main);stroke-width:2.4;stroke-linejoin:round"/>`;
  for (const y of [322, 335, 348, 361]) {
    for (const [z, dir] of [[zl, 1], [zr, -1]]) { const fin = mid - dir * 14; let d = ''; for (let x = z + 3 * dir; dir > 0 ? x < fin : x > fin; x += 5.4 * dir) d += `<circle cx="${f2(x)}" cy="${y}" r="1.7" style="fill:var(--rcv-card2);stroke:var(--text-dim);stroke-width:.5"/>`; h += `<path class="linea-f" d="M${f2(z)} ${y}H${f2(fin)}"/>` + d; }
  }
  for (const y of [328.5, 341.5, 354.5]) {
    h += `<rect class="t-med" x="${f2(mid - 62)}" y="${y - 2.4}" width="124" height="4.8" rx="2.4"/>`;
    for (let x = mid - 58; x < mid + 58; x += 6.5) { if (Math.abs(x - mid) < 5) continue; const dir = x < mid ? -1 : 1, inc = (0.45 + 0.55 * sist) * 3.6 * dir;
      h += `<path d="M${f2(x)} ${y - 2.4}l${f2(inc)} -4M${f2(x)} ${y + 2.4}l${f2(inc)} 4" style="stroke:var(--accent-red);stroke-width:1.2;stroke-linecap:round"/>`; }
  }
  const nCa = Math.round(2 + 8 * clamp((V2.ampc - 0.2) / 0.8, 0, 1)); for (let i = 0; i < nCa; i++) h += part('ca', zl + 12 + i * 15, i % 2 ? 322 : 361, 2.3);
  $('l-sarc').innerHTML = h;
}
export function animarPendulo(t, R) {
  const T = 60000 / R.fc, fase = REDUCIR || pausado ? 0.25 : (t % (2 * T)) / (2 * T), ang = 18 * Math.sin(fase * 2 * Math.PI);
  const peso = clamp(70 - (R.fc - 60) * 0.5, 20, 70);
  $('l-pend').innerHTML = `<g transform="rotate(${f2(ang)} 81 330)"><path class="rcv-aguja" d="M81 330V214" style="stroke-width:1.6"/>${caja(74, 330 - peso, 14, 10, 6, { tono: 'sup', lit: true })}</g><circle cx="81" cy="330" r="2.6" class="t-sup"/>`;
}
export function animarTrinquete(t, R, maq) {
  const m = R.A.maq[lupaCel], tono = clamp(m.tono ?? 0, -1, 1.4), acorta = clamp(0.25 + 0.3 * tono, 0, 0.7);
  V2.acorta = REDUCIR || pausado || V2.acorta == null ? acorta : V2.acorta + (acorta - V2.acorta) * 0.05;
  const xb = 330 - 150 * V2.acorta, gat = clamp(V2.relaja, 0, 1);
  let h = `<path class="linea" d="M34 338H${f2(xb)}"/>`;
  for (let x = 38; x < xb - 4; x += 5.4) h += `<circle cx="${f2(x)}" cy="338" r="1.9" style="fill:var(--rcv-card2);stroke:var(--text-dim);stroke-width:.5"/>`;
  h += `<rect class="t-med" x="48" y="345" width="${f2(Math.max(40, xb - 74))}" height="5" rx="2.5"/>`;
  for (let x = 54; x < xb - 30; x += 7.5) h += `<path d="M${f2(x)} 345l${f2(-2.6 * (0.4 + V2.acorta))} -4.4" style="stroke:var(--accent-red);stroke-width:1.2;stroke-linecap:round"/>`;
  h += caja(xb, 352, 16, 22, 8, { tono: 'sup', lit: true });
  const gx = xb + 22, gy = 322;
  h += `<g id="rcv-l-gatillo"><path d="M${f2(gx)} ${gy}l${f2(-11)} ${f2(12 - 10 * gat)}" style="stroke:var(--text-main);stroke-width:2.2;stroke-linecap:round"/><circle cx="${f2(gx)}" cy="${gy}" r="2" class="t-sup"/></g>`;
  $('l-cuerda').innerHTML = h;
  // quién levanta el gatillo: el β₂ (una varilla desde su cerradura) o, en el bronquio, la palanca de la cinasa
  let r = '';
  if (gat > 0.05) {
    const sec = $('l-sec-beta2');
    const desde = heroeActual === 'beta2' ? (maq === 'gs-relaja' ? [321.5, 186] : [L.hx, LEVA.y]) : sec ? [+sec.dataset.x, L.bot] : null;
    if (desde) r = `<path d="M${f2(desde[0])} ${f2(desde[1])}V${gy - 14}H${f2(gx)}V${gy - 2}" style="fill:none;stroke:var(--text-dim);stroke-width:1.3;stroke-dasharray:3 2"/>`;
    if (R.A.dentro.pde > 0.05) r += `<path class="rcv-oro" d="M${f2(gx - 4)} ${gy + 10}l4 -8l4 8Z"/>`;
  }
  $('l-relaja').innerHTML = r;
}
export function animarGranulos(t, O, R, lev) {
  const suelta = V2.suelta, n = 7;
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = 170 + i * 26, sale = i < Math.round(suelta * n);
    h += `<circle class="rcv-gran" cx="${x + 13}" cy="${L.memB + 62}" r="9" opacity=".75"/><circle class="rcv-gran-p" cx="${x + 10}" cy="${L.memB + 60}" r="1.2"/><circle class="rcv-gran-p" cx="${x + 15}" cy="${L.memB + 64}" r="1.1"/>`;
    if (sale) { const u = REDUCIR || pausado ? 0.6 : ((t / 3000 + i / n) % 1);
      h += `<path class="rcv-gran" d="M${x - 10} ${L.memB + 2}a10 10 0 0 0 20 0"/>`;
      for (let k = 0; k < 3; k++) h += `<circle cx="${f2(x - 4 + k * 4)}" cy="${f2(L.memT - 6 - u * 46 - k * 3)}" r="1.5" style="fill:var(--accent-purple)" opacity="${f2(1 - u)}"/>`; }
    else h += `<circle class="rcv-gran" cx="${x}" cy="${L.memB + 24}" r="10"/><circle class="rcv-gran-p" cx="${x - 3}" cy="${L.memB + 22}" r="1.3"/><circle class="rcv-gran-p" cx="${x + 2.4}" cy="${L.memB + 26}" r="1.3"/><circle class="rcv-gran-p" cx="${x + 3}" cy="${L.memB + 19}" r="1"/>`;
  }
  $('l-gran-v').innerHTML = h;
  // la diana: el endotelio del vaso, que se abre entre sus células cuando llegan los mediadores (la fuga, S p. 67)
  let e = ''; const nC = 9, ancho = 330 / nC, hueco = 1 + 9 * suelta;
  for (let i = 0; i < nC; i++) { const x0 = 18 + i * ancho + hueco / 2, w = ancho - hueco;
    e += caja(x0, 352, w, 12, 6, { tono: 'sup' }) + `<ellipse class="rcv-nucleo" cx="${f2(x0 + w / 2)}" cy="346" rx="${f2(w * 0.22)}" ry="2.6"/>`; }
  e += `<path class="linea-f" d="M18 330H348" style="stroke-dasharray:3 3"/>`;
  for (let i = 0; i < Math.round(suelta * 8); i++) { const u = REDUCIR || pausado ? (i + 0.5) / 8 : ((t / 2600 + i / 8) % 1), x = 18 + (i % nC + 1) * ancho; e += part('agua', x, 332 + u * 34, 2.6); }
  $('l-endo').innerHTML = e;
  const cierra = 1 - suelta;
  $('l-pestillo').innerHTML = caja(158, L.memB + 44, 186, 3, 6, { tono: 'sup' }) + `<path d="M160 ${L.memB + 39}H${f2(160 + 180 * cierra)}" style="stroke:var(--text-main);stroke-width:2.2;stroke-linecap:round"/>`
    + Array.from({ length: Math.round(7 * cierra) }, (_, i) => `<path d="M${170 + i * 26} ${L.memB + 39}v-5" style="stroke:var(--text-main);stroke-width:1.6"/>`).join('')
    + `<path class="linea" d="M${f2(lev[0])} ${f2(lev[1])}L122 ${L.memB + 74}" style="stroke-dasharray:2.4 2"/><path class="linea" d="M144 ${L.memB + 80}L160 ${L.memB + 41}" style="stroke-dasharray:2.4 2"/>`;
}

