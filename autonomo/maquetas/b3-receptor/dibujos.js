// Los dibujos de la lámina 1 (maqueta b3-receptor): el tubo, el calibre, el mastocito, el banco del miocito, el haz y la vía.
import { svgParticula } from '../../../js/core/particulas.js';
import * as I from '../comun/dibujo-iso.js';
import { $, FARMACOS, RECEPTORES, clamp, n1 } from './datos.js';
/* ============================================================
   5. El grabado: la pieza común (comun/dibujo-iso.js), en su proyección oblicua: un punto (x, y, z) del mundo cae en
   (x + 0,42·y, −z − 0,34·y). Aquí solo se dice dónde cae cada caja en la lámina (ox, oy: la esquina de delante, abajo a
   la izquierda) y se añaden las formas propias del receptor: la llave y la cerradura.
   ============================================================ */
export const f2 = x => +(+x).toFixed(2);
export const OBL = I.oblicua(), OBX = 0.42, OBY = 0.34;
export const caja = (ox, oy, w, h, d, { tono = 'med', lit = false, id = '', clase = '' } = {}) => I.caja3(OBL, [ox, 0, -oy], [w, d, h], { tono, lit, id, clase });
export const { cilindroV: cilindro, cilindroH, tuboPlano: tubo, tornillo, regla: marcas } = I;
// Las formas de entrada de las cerraduras (y del perfil de sus llaves), centradas en 0,0 con tamaño s
export function formaD(forma, s) {
  const pol = (n, r, g) => { let d = ''; for (let i = 0; i < n; i++) { const a = g + i * 2 * Math.PI / n; d += `${i ? 'L' : 'M'}${f2(Math.cos(a) * r)} ${f2(Math.sin(a) * r)}`; } return d + 'Z'; };
  switch (forma) {
    case 'triangulo': return `M0 ${f2(-s)}L${f2(s * 0.95)} ${f2(s * 0.72)}L${f2(-s * 0.95)} ${f2(s * 0.72)}Z`;
    case 'semicirculo': return `M${f2(-s)} ${f2(-s * 0.35)}H${f2(s)}A${f2(s)} ${f2(s)} 0 0 1 ${f2(-s)} ${f2(-s * 0.35)}Z`;
    case 'cuadrado': return `M${f2(-s * 0.8)} ${f2(-s * 0.8)}h${f2(s * 1.6)}v${f2(s * 1.6)}h${f2(-s * 1.6)}Z`;
    case 'hexagono': return pol(6, s, Math.PI / 6);
    case 'estrella': { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.45 : s * 1.1; d += `${i ? 'L' : 'M'}${f2(Math.cos(a) * r)} ${f2(Math.sin(a) * r)}`; } return d + 'Z'; }
    case 'ovalo': return `M${f2(s)} 0A${f2(s)} ${f2(s * 0.62)} 0 1 1 ${f2(-s)} 0A${f2(s)} ${f2(s * 0.62)} 0 1 1 ${f2(s)} 0Z`;
    case 'rombo': return `M0 ${f2(-s * 1.1)}L${f2(s * 0.8)} 0L0 ${f2(s * 1.1)}L${f2(-s * 0.8)} 0Z`;
    // la llave de dentro (el IP₃ que abre la válvula del depósito): un peine de tres dientes
    case 'peine': return `M${f2(-s)} ${f2(-s * 0.5)}H${f2(s)}V${f2(s * 0.7)}H${f2(s * 0.45)}V${f2(-s * 0.05)}H${f2(s * 0.2)}V${f2(s * 0.7)}H${f2(-s * 0.2)}V${f2(-s * 0.05)}H${f2(-s * 0.45)}V${f2(s * 0.7)}H${f2(-s)}Z`;
    default: { const a = f2(s), b = f2(s * 0.36); return `M${-b} ${-a}H${b}V${-b}H${a}V${b}H${b}V${a}H${-b}V${b}H${-a}V${-b}H${-b}Z`; }
  }
}
// El material de una llave: oro (fármaco), crema (del propio cuerpo) o ciega (el tapón, el antagonista)
export const MATERIAL = { oro: 'oro', endogeno: 'crema', ciega: 'ciega' };
export function materialDe(k) { return k === 'endogeno' ? 'crema' : (FARMACOS[k]?.material === 'ciega' ? 'ciega' : 'oro'); }
// Llave pequeña (lámina 1): anillo (la cabeza), caña con dos dientes y, en la punta, el perfil de su cerradura.
// Apunta a +x desde el origen (la punta va dentro de la boca)
export function llaveMini(forma, mat, s = 1) {
  if (mat === 'ciega') return `<g><path class="ciega" d="M0 ${f2(-1.2 * s)}h${f2(-6.4 * s)}v${f2(2.4 * s)}h${f2(6.4 * s)}Z"/><rect class="ciega" x="${f2(-11 * s)}" y="${f2(-3.2 * s)}" width="${f2(4.8 * s)}" height="${f2(6.4 * s)}" rx="${f2(0.9 * s)}"/><path class="ciega-b" d="M${f2(-11.6 * s)} 0h${f2(6 * s)}" style="stroke-width:${f2(1.2 * s)}"/></g>`;
  return `<g><path class="${mat}" d="M${f2(-1.6 * s)} ${f2(-0.8 * s)}h${f2(-5.4 * s)}v${f2(1.6 * s)}h${f2(5.4 * s)}Z M${f2(-3 * s)} ${f2(0.8 * s)}v${f2(1.5 * s)}h${f2(-1.2 * s)}v${f2(-1.5 * s)}Z M${f2(-5 * s)} ${f2(0.8 * s)}v${f2(1)}h${f2(-1.1 * s)}v${f2(-1)}Z"/>`
    + `<path class="${mat}" d="${formaD(forma, 1.6 * s)}" transform="translate(${f2(-0.4 * s)} 0)"/>`
    + `<circle class="${mat}" cx="${f2(-9.4 * s)}" cy="0" r="${f2(2.6 * s)}"/><circle cx="${f2(-9.4 * s)}" cy="0" r="${f2(1 * s)}" style="fill:var(--bg-main)"/></g>`;
}
// El hueco de una cerradura pequeña (lámina 1): una boca oscura con su forma grabada
export function bocaMini(forma, x, y, s = 1, rec = '') {
  return `<g data-cerr="${rec}" transform="translate(${f2(x)} ${f2(y)})"><circle r="${f2(3 * s)}" style="fill:var(--bg-main);stroke:var(--text-main);stroke-width:.6"/><path d="${formaD(forma, 1.5 * s)}" style="fill:none;stroke:var(--text-dim);stroke-width:.5"/></g>`;
}
// El icono de leyenda (HTML)
export function icoForma(forma, mat = 'oro') {
  return `<svg viewBox="-12 -9 24 18" aria-hidden="true"><g class="dib">${mat === 'boca' ? `<circle r="7" style="fill:var(--bg-main);stroke:var(--text-main);stroke-width:1"/><path d="${formaD(forma, 3.6)}" style="fill:none;stroke:var(--text-dim);stroke-width:1"/>` : `<g transform="translate(11 0) scale(1.15)">${llaveMini(forma, mat, 1.15)}</g>`}</g></svg>`;
}
// Una partícula de la tabla única (Ca²⁺, K⁺, agua, hematíe...): la dibuja js/core/particulas.js
export const part = (clave, x, y, r, extra = {}) => svgParticula(clave, x, y, r, extra);

/* ============================================================
   6. Lámina 1: dos órganos, una misma vía. A la izquierda el tubo (la arteriola con su anillo de células lisas, o el
   bronquio) y su calibre; a la derecha el banco del corazón: el haz de miocitos con su medidor de fuerza y el nodo
   como metrónomo. La vía de la bomba lleva las llaves a los dos. Ninguna cifra dentro del dibujo.
   ============================================================ */
export const AC = { x: 84, y: 138 };            // centro del corte del tubo
export const R_REF = 16;                        // luz de referencia (px) con la IRVS de referencia
export const MEDIA = 1250;                       // (área de la media)/π a la referencia: la media no cambia de volumen al cerrarse
export const ORDEN12 = [0, 6, 3, 9, 1, 7, 4, 10, 2, 8, 5, 11];
export const pol = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
export const rad = g => g * Math.PI / 180;
export function geomTubo(rl, bronquio) {
  const mi = rl + (bronquio ? 7 : 4.2), mo = Math.sqrt(mi * mi + (bronquio ? 820 : MEDIA)), ao = mo + (bronquio ? 15 : 11);
  return { rl, mi, mo, ao };
}
// ¿Cuántas cerraduras de cada tipo tienen llave o tapón en una célula? (la imagen de la ocupación: ilustrativo)
export function cuenta(R, cel, rec, n) {
  const c = R.A.occ[cel]?.[rec]; if (!c) return { llaves: 0, tapones: 0, quien: null };
  return { llaves: Math.round(c.ag * n), tapones: Math.round(c.tap * n), quien: c.quien, tapQuien: c.tapQuien };
}
// El anillo de la arteriola (o del bronquio) en corte, con su cuerpo hacia atrás, su calibre y sus cerraduras
export function dibTubo(R, rl) {
  const bron = R.P.organo === 'bronquio', g = geomTubo(rl, bron), { x: cx, y: cy } = AC;
  const ob = [-15, -12], bx = cx + ob[0], by = cy + ob[1];
  const nx = -ob[1], ny = ob[0], nl = Math.hypot(nx, ny), ux = nx / nl, uy = ny / nl;
  let h = `<g id="e-tubo">`;
  // la rama de la vía que entra por detrás, hasta su collar sobre la adventicia
  h += tubo([[bx, VIA.y], [bx, by - g.ao + 2]], 2.4) + caja(bx - 4.5, by - g.ao + 5, 9, 4, 5, { tono: 'sup' });
  // cuerpo hacia atrás: el cilindro visto casi de frente
  h += `<circle class="t-osc" cx="${f2(bx)}" cy="${f2(by)}" r="${f2(g.ao)}"/>`;
  h += `<path class="t-med" d="M${f2(cx + ux * g.ao)} ${f2(cy + uy * g.ao)}L${f2(bx + ux * g.ao)} ${f2(by + uy * g.ao)}A${f2(g.ao)} ${f2(g.ao)} 0 0 0 ${f2(bx - ux * g.ao)} ${f2(by - uy * g.ao)}L${f2(cx - ux * g.ao)} ${f2(cy - uy * g.ao)}Z"/>`;
  // anillos de la adventicia que dan la vuelta al cuerpo (fibras de colágeno, a la altura de su sección)
  for (const t of [0.35, 0.7]) h += `<path class="linea-f" d="M${f2(cx + ux * g.ao + ob[0] * t)} ${f2(cy + uy * g.ao + ob[1] * t)}A${f2(g.ao)} ${f2(g.ao)} 0 0 0 ${f2(cx - ux * g.ao + ob[0] * t)} ${f2(cy - uy * g.ao + ob[1] * t)}"/>`;
  // la cara del corte: adventicia
  h += `<circle class="adventicia" cx="${cx}" cy="${cy}" r="${f2(g.ao)}"/>`;
  for (let i = 0; i < 9; i++) { const a = rad(i * 40 + 12), r = (g.mo + g.ao) / 2 + (i % 2 ? 2.5 : -2), [x, y] = pol(cx, cy, r, a);
    h += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="2.6" ry=".8" transform="rotate(${f2(i * 40 + 102)} ${f2(x)} ${f2(y)})" style="fill:var(--text-muted)"/>`; }
  // el cartílago del bronquio: placas en C fuera del músculo
  if (bron) for (let i = 0; i < 4; i++) { const a0 = rad(i * 90 + 18), a1 = rad(i * 90 + 72), r0 = g.mo + 4, r1 = g.ao - 3, p = [pol(cx, cy, r0, a0), pol(cx, cy, r1, a0), pol(cx, cy, r1, a1), pol(cx, cy, r0, a1)];
    h += `<path class="cartilago" d="M${f2(p[0][0])} ${f2(p[0][1])}L${f2(p[1][0])} ${f2(p[1][1])}A${f2(r1)} ${f2(r1)} 0 0 1 ${f2(p[2][0])} ${f2(p[2][1])}L${f2(p[3][0])} ${f2(p[3][1])}A${f2(r0)} ${f2(r0)} 0 0 0 ${f2(p[0][0])} ${f2(p[0][1])}Z"/>`; }
  // la fibra nerviosa con sus varicosidades (simpática en la arteriola; en el bronquio, la del vago: fisiología general)
  const n0 = rad(148), n1 = rad(236), rn = g.ao - 4;
  h += `<g id="e-nervio"><path class="nervio" d="M${f2(pol(cx, cy, rn, n0)[0])} ${f2(pol(cx, cy, rn, n0)[1])}A${f2(rn)} ${f2(rn)} 0 0 1 ${f2(pol(cx, cy, rn, n1)[0])} ${f2(pol(cx, cy, rn, n1)[1])}"/>`;
  for (let i = 0; i < 5; i++) { const [x, y] = pol(cx, cy, rn, n0 + (n1 - n0) * (i + 0.5) / 5); h += `<ellipse class="varic" cx="${f2(x)}" cy="${f2(y)}" rx="2.6" ry="2"/>`; }
  // las llaves del propio cuerpo que salen de las varicosidades (cocaína: fisiología general)
  if (R.P.endogeno) for (let i = 0; i < 4; i++) { const a = n0 + (n1 - n0) * (i + 0.5) / 5, [x, y] = pol(cx, cy, rn + 5, a + 0.06);
    h += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(a * 180 / Math.PI)})">${llaveMini(i % 2 ? 'cuadrado' : 'triangulo', 'crema', 0.8)}</g>`; }
  h += `</g>`;
  // la media: las células lisas enrolladas, cada una con su núcleo y dos cerraduras en su borde de fuera
  const n = bron ? 10 : 12, recs = bron ? ['beta2', 'musc'] : ['alfa1', 'v1', 'beta2', 'dopa'];
  const cel = bron ? 'liso-bronquio' : 'liso-arteriola';
  const on = bron ? R.A.maq[cel].tono > 0.3 : R.A.maq[cel].tono > 0.25;
  h += `<g id="e-anillo" data-celula="${cel}" role="button" aria-label="${bron ? 'Músculo liso del bronquio' : 'Anillo de células lisas de la arteriola'}">`;
  h += `<circle cx="${cx}" cy="${cy}" r="${f2(g.mo)}" style="fill:var(--bg-main)"/>`;
  const span = 360 / n;
  for (let i = 0; i < n; i++) {
    const a0 = rad(i * span - 90 + 2), a1 = rad((i + 1) * span - 90 - 1), tw = rad(8);
    const o0 = pol(cx, cy, g.mo - 0.5, a0 + tw), o1 = pol(cx, cy, g.mo - 0.5, a1 + tw), i1 = pol(cx, cy, g.mi + 0.4, a1), i0 = pol(cx, cy, g.mi + 0.4, a0);
    h += `<path class="liso${on ? ' on' : ''}" d="M${f2(i0[0])} ${f2(i0[1])}L${f2(o0[0])} ${f2(o0[1])}A${f2(g.mo - 0.5)} ${f2(g.mo - 0.5)} 0 0 1 ${f2(o1[0])} ${f2(o1[1])}Q${f2((o1[0] + i1[0]) / 2 + 1)} ${f2((o1[1] + i1[1]) / 2)} ${f2(i1[0])} ${f2(i1[1])}A${f2(g.mi + 0.4)} ${f2(g.mi + 0.4)} 0 0 0 ${f2(i0[0])} ${f2(i0[1])}Z"/>`;
    const am = (a0 + a1) / 2 + tw / 2, rm = (g.mi + g.mo) / 2, [nxp, nyp] = pol(cx, cy, rm, am), largo = Math.max(2.4, (g.mi + g.mo) / 2 * (a1 - a0) * 0.3);
    h += `<ellipse class="nucleo" cx="${f2(nxp)}" cy="${f2(nyp)}" rx="${f2(largo)}" ry="${f2(Math.min(2.2, (g.mo - g.mi) * 0.16))}" transform="rotate(${f2(am * 180 / Math.PI + 90)} ${f2(nxp)} ${f2(nyp)})"/>`;
  }
  // el epitelio del bronquio: una capa pegada a la luz, con sus cilios hacia dentro (lo que lo distingue de la arteriola)
  if (bron) { h += `<circle cx="${cx}" cy="${cy}" r="${f2(g.mi - 0.8)}" style="fill:none;stroke:var(--text-dim);stroke-width:1.6;stroke-dasharray:3 1.2"/>`;
    for (let i = 0; i < 24; i++) { const a = rad(i * 15 + 4), [x0, y0] = pol(cx, cy, g.mi - 1.6, a), [x1, y1] = pol(cx, cy, Math.max(1, g.mi - 4.2), a);
      h += `<line x1="${f2(x0)}" y1="${f2(y0)}" x2="${f2(x1)}" y2="${f2(y1)}" style="stroke:var(--text-dim);stroke-width:.6"/>`; } }
  // las cerraduras del borde de fuera y sus llaves
  const sockets = [];
  for (let i = 0; i < n; i++) {
    const am = rad((i + 0.5) * span - 90 + 4);
    sockets.push({ i, rec: recs[0], a: am - rad(span * 0.2) });
    sockets.push({ i, rec: bron ? recs[1] : recs[1 + (i % 3)], a: am + rad(span * 0.2) });
  }
  const porTipo = {};
  for (const rec of recs) porTipo[rec] = sockets.filter(s => s.rec === rec);
  for (const rec of recs) {
    const lista = porTipo[rec], c = cuenta(R, cel, rec, lista.length);
    const orden = lista.length === 12 ? ORDEN12.map(k => lista[k]) : lista.map((s, k) => lista[(k * 5) % lista.length]);
    orden.forEach((s, k) => {
      const [x, y] = pol(cx, cy, g.mo + 1.6, s.a), gr = s.a * 180 / Math.PI;
      h += bocaMini(RECEPTORES[rec].forma, x, y, 0.9, rec);
      const tapon = k < c.tapones, llave = !tapon && k < c.llaves;
      if (tapon) h += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(gr + 180)})">${llaveMini(RECEPTORES[rec].forma, 'ciega', 0.85)}</g>`;
      else if (llave) h += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(gr + 180)})">${llaveMini(RECEPTORES[rec].forma, materialDe(c.quien), 0.85)}</g>`;
    });
  }
  h += `</g>`;
  // la elástica interna (más ondulada cuanto más cerrada) y el endotelio (en el bronquio, el epitelio con sus cilios)
  const amp = 0.4 + 1.1 * clamp(1 - rl / 36, 0, 1), re = g.mi - 0.8;
  let dE = '';
  for (let k = 0; k <= 96; k++) { const a = k / 96 * 2 * Math.PI, r = re + amp * Math.sin(a * 26); dE += `${k ? 'L' : 'M'}${f2(cx + r * Math.cos(a))} ${f2(cy + r * Math.sin(a))}`; }
  h += `<path class="elastica" d="${dE}Z"/>`;
  if (bron) {
    h += `<circle class="epitelio" cx="${cx}" cy="${cy}" r="${f2(rl + 5.5)}"/>`;
    for (let i = 0; i < 22; i++) { const a = rad(i * 360 / 22), [x0, y0] = pol(cx, cy, rl + 5.5, a), [x1, y1] = pol(cx, cy, rl, a);
      h += `<path class="linea-f" d="M${f2(x0)} ${f2(y0)}L${f2(x1)} ${f2(y1)}"/>`; const [cx1, cy1] = pol(cx, cy, rl - 1.6, a + 0.05); h += `<path class="linea-f" d="M${f2(x1)} ${f2(y1)}L${f2(cx1)} ${f2(cy1)}"/>`; }
  } else {
    h += `<circle class="endo" cx="${cx}" cy="${cy}" r="${f2(rl + 2.4)}"/>`;
    const fuga = R.P.mediadores ? R.A.maq.mastocito.suelta : 0;
    for (let i = 0; i < 14; i++) { const a = rad(i * 360 / 14 + 6), [x0, y0] = pol(cx, cy, rl + 2.4, a), [x1, y1] = pol(cx, cy, rl, a);
      const hueco = fuga > 0.35 && i % 3 === 0;
      h += hueco ? `<path d="M${f2(x0)} ${f2(y0)}L${f2(x1)} ${f2(y1)}" style="stroke:var(--bg-main);stroke-width:${f2(0.8 + 1.8 * fuga)}"/>` : `<path class="linea-f" d="M${f2(x0)} ${f2(y0)}L${f2(x1)} ${f2(y1)}"/>`;
      const [bx2, by2] = pol(cx, cy, rl + 0.2, a + rad(12)); h += `<ellipse cx="${f2(bx2)}" cy="${f2(by2)}" rx="2" ry=".9" transform="rotate(${f2(i * 360 / 14 + 96)} ${f2(bx2)} ${f2(by2)})" style="fill:var(--text-dim)"/>`;
    }
  }
  // la luz: sangre con hematíes y alguna llave (en el bronquio, aire)
  h += `<circle class="${bron ? 'luz' : 'sangre'}" cx="${cx}" cy="${cy}" r="${f2(rl)}"/>`;
  if (!bron) { const pr = [[-0.42, -0.3], [0.38, 0.18], [-0.05, 0.5]];
    pr.forEach(([a, b]) => { if (rl > 12) h += part('rbc', cx + a * rl, cy + b * rl, Math.min(4, rl * 0.16)); });
    // las llaves que lleva la sangre (las de los fármacos puestos)
    const enSangre = Object.keys(R.S.f).filter(k => R.S.f[k] && FARMACOS[k].llaves.length && FARMACOS[k].material !== 'ciega' && !FARMACOS[k].via);
    enSangre.slice(0, 3).forEach((k, i) => { const ll = FARMACOS[k].llaves.find(l => !l.cel || l.cel.includes('liso-arteriola')) || FARMACOS[k].llaves[0];
      h += `<g transform="translate(${f2(cx + (0.25 - 0.3 * i) * rl)} ${f2(cy - (0.55 - 0.45 * i) * rl)}) rotate(${-30 + 50 * i})">${llaveMini(RECEPTORES[ll.rec].forma, 'oro', 0.75)}</g>`; }); }
  // en el bronquio, lo inhalado llega por la luz (el aire)
  if (bron) Object.keys(R.S.f).filter(k => R.S.f[k] && FARMACOS[k].via === 'inhalada').forEach((k, i) => { const ll = FARMACOS[k].llaves[0];
    h += `<g transform="translate(${f2(cx + (i ? 0.1 : -0.25) * rl)} ${f2(cy + (i ? 0.35 : -0.2) * rl)}) rotate(${i ? 200 : 20})">${llaveMini(RECEPTORES[ll.rec].forma, FARMACOS[k].material === 'ciega' ? 'ciega' : 'oro', 0.75)}</g>`; });
  // la fuga: el agua sale entre las células del endotelio y empapa la adventicia (anafilaxia)
  const fugaA = R.P.mediadores ? R.A.maq.mastocito.suelta : 0;
  if (fugaA > 0.35) for (let i = 0; i < Math.round(fugaA * 5); i++) { const [x, y] = pol(cx, cy, g.ao + 4 + (i % 2) * 5, rad(70 + i * 22)); h += part('agua', x, y, 2.4); }
  h += `</g>`;
  return { svg: h, g };
}
// El calibre de interiores (un comparador de taladros): dos palpadores tocan la pared de la luz y el reloj lee el diámetro
export function dibCalibre(rl) {
  const { x: cx, y: cy } = AC, dx = 30, dy = 252;
  let h = `<g id="e-cal" role="img" aria-label="Calibre de la luz">`;
  h += `<path d="M${cx} ${cy}L${dx + 6} ${dy - 13}" style="stroke:var(--text-dim);stroke-width:3.2;stroke-linecap:round"/><path d="M${cx} ${cy}L${dx + 6} ${dy - 13}" style="stroke:var(--card2);stroke-width:2"/>`;
  h += `<rect class="t-sup" x="${f2(cx - rl + 1.2)}" y="${f2(cy - 1.3)}" width="${f2(2 * rl - 2.4)}" height="2.6" rx="1.2"/>`;
  h += `<path class="linea-h" d="M${f2(cx - rl + 0.6)} ${f2(cy - 2.6)}v5.2M${f2(cx + rl - 0.6)} ${f2(cy - 2.6)}v5.2"/>`;
  h += `<circle cx="${cx}" cy="${cy}" r="2" class="t-sup"/>`;
  h += cilindro(dx, dy - 15, 4, 1.6, 6, { tono: 'med' });
  h += `<circle class="t-osc" cx="${dx}" cy="${dy}" r="14.5"/><circle class="t-sup" cx="${dx}" cy="${dy}" r="12.2"/>`;
  for (let i = 0; i < 20; i++) { const a = rad(i * 18 - 90), [x0, y0] = pol(dx, dy, 12.2, a), [x1, y1] = pol(dx, dy, i % 5 ? 10.6 : 9.4, a);
    h += `<path class="${i % 5 ? 'linea-f' : 'linea'}" d="M${f2(x0)} ${f2(y0)}L${f2(x1)} ${f2(y1)}"/>`; }
  h += `<g id="cal-aguja"><path class="aguja" d="M${dx} ${dy}L${dx} ${dy - 10}"/></g><circle cx="${dx}" cy="${dy}" r="1.4" style="fill:var(--text-main)"/>`;
  return h + `</g>`;
}
// El mastocito que vive en la adventicia, con sus gránulos y sus cerraduras β
export function dibMastocito(R, g) {
  const [mx, my] = pol(AC.x, AC.y, g.ao + 8, rad(-38)), c = cuenta(R, 'mastocito', 'beta2', 3), suelta = R.A.maq.mastocito.suelta;
  let h = `<g id="e-mast" data-celula="mastocito" role="button" aria-label="Mastocito">`;
  h += `<ellipse class="t-osc" cx="${f2(mx + 1.5)}" cy="${f2(my + 1.5)}" rx="21" ry="15"/><ellipse class="miocito" cx="${f2(mx)}" cy="${f2(my)}" rx="21" ry="15" style="fill:var(--card2)"/>`;
  h += `<ellipse class="nucleo" cx="${f2(mx - 4)}" cy="${f2(my + 2)}" rx="6.5" ry="5"/>`;
  const gp = [[-14, -6], [-8, -10], [0, -9], [8, -8], [14, -3], [11, 5], [4, 8], [-12, 6]];
  const fuera = Math.round(suelta * 5);
  gp.forEach(([a, b], i) => {
    if (i < fuera) { const [ox, oy] = pol(mx, my, 24 + i * 4, rad(150 + i * 14)); h += `<path class="gran" d="M${f2(ox - 3.2)} ${f2(oy)}a3.2 3.2 0 1 0 6.4 0" transform="rotate(${f2(150 + i * 14 - 90)} ${f2(ox)} ${f2(oy)})"/>`; }
    else h += `<circle class="gran" cx="${f2(mx + a)}" cy="${f2(my + b)}" r="2.8"/><circle class="gran-p" cx="${f2(mx + a - 0.6)}" cy="${f2(my + b - 0.5)}" r=".55"/>`;
  });
  [[-8, -15], [3, -15.5], [13, -12]].forEach(([a, b], k) => {
    const x = mx + a, y = my + b; h += bocaMini('cuadrado', x, y, 0.9, 'beta2');
    if (k < c.tapones) h += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(90)">${llaveMini('cuadrado', 'ciega', 0.85)}</g>`;
    else if (k < c.llaves) h += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(90)">${llaveMini('cuadrado', materialDe(c.quien), 0.85)}</g>`;
  });
  return h + `</g>`;
}
// El banco del corazón: base sobre patas, regla, poste con su pinza, el haz de miocitos, el transductor con su reloj de
// fuerza y el metrónomo (el nodo) con sus cerraduras
export const BANCO = { base: 270, haz0: 224, haz1: 302, hazY: 198, fil: 10.5, met: { x: 190, piv: 252, top: 132 }, dial: { x: 320, y: 138 } };
export function dibBanco(R) {
  const B = BANCO, M = B.met, D = B.dial;
  let h = `<g id="e-banco">`;
  h += `<ellipse class="halo-s" cx="258" cy="${B.base + 3}" rx="96" ry="5"/>`;
  for (const x of [176, 338]) h += cilindro(x, B.base - 1, 4.4, 1.6, 4, { tono: 'osc' });
  h += caja(166, B.base - 2, 182, 6, 24, { tono: 'med' });
  for (const [x, y] of [[171, B.base - 10.6], [343, B.base - 10.6], [180, B.base - 16.6], [352, B.base - 16.6]]) h += tornillo(x, y, 1.3);
  h += `<path class="linea-f" d="M170 ${B.base - 7.6}l${f2(22 * OBX)} ${f2(-22 * OBY)}H${352 - 4}"/>`;
  // la regla bajo el haz: el haz se acorta sobre ella
  h += caja(224, B.base - 12, 80, 1, 6, { tono: 'sup' }) + marcas(226, 301, B.base - 13.2, 3, 1.8);
  // el metrónomo: el nodo
  h += `<g id="e-nodo" data-celula="nodo" role="button" aria-label="El nodo: el metrónomo">`;
  h += caja(170, B.base - 10, 42, 5, 12, { tono: 'med' });
  const yb = B.base - 15, yt = M.top, wb = 18, wt = 6, dd = 12 * OBX, de = -12 * OBY;
  h += `<path class="t-osc" d="M${M.x + wb} ${yb}l${f2(dd)} ${f2(de)}L${f2(M.x + wt + dd)} ${f2(yt + de)}L${M.x + wt} ${yt}Z"/>`;
  h += `<path class="t-med" d="M${M.x - wb} ${yb}H${M.x + wb}L${M.x + wt} ${yt}H${M.x - wt}Z"/>`;
  h += `<path class="t-sup" d="M${M.x - wt} ${yt}l${f2(dd)} ${f2(de)}h${2 * wt}l${f2(-dd)} ${f2(-de)}Z"/>`;
  h += `<rect x="${M.x - 3}" y="${yt + 9}" width="6" height="${M.piv - yt - 12}" rx="2" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:.6"/>`;
  for (let y = yt + 13, i = 0; y < M.piv - 6; y += 4.5, i++) h += `<path class="${i % 5 ? 'linea-f' : 'linea'}" d="M${M.x - 3.4} ${f2(y)}h${i % 5 ? -2.2 : -3.6}M${M.x + 3.4} ${f2(y)}h${i % 5 ? 2.2 : 3.6}"/>`;
  [[M.x - 11, yb - 6, 'beta1'], [M.x - 9, yb - 22, 'gluc'], [M.x + 11, yb - 6, 'beta1']].forEach(([x, y, rec]) => { h += bocaMini(RECEPTORES[rec].forma, x, y, 1.15, rec); });
  h += `<g id="nodo-llaves"></g>`;
  h += `<g id="pendulo"><path class="aguja" d="M${M.x} ${M.piv}V${yt + 6}" style="stroke-width:1.1"/><g id="pesa">${caja(M.x - 4.5, 0, 9, 7, 4, { tono: 'sup', lit: true })}</g></g>`;
  h += `<circle cx="${M.x}" cy="${M.piv}" r="1.9" class="t-sup"/>`;
  h += `</g>`;
  // el cable de la conducción: del nodo a la pinza del haz
  h += tubo([[M.x + 16, B.base - 18], [214, B.base - 26], [216, B.hazY + 26]], 0.9, { luz: false });
  // el poste izquierdo y su pinza
  h += cilindro(219, B.hazY - 4, 3, 1.1, B.base - 12 - (B.hazY - 4), { tono: 'med' }) + caja(212, B.hazY + 34, 13, 38, 6, { tono: 'med' }) + tornillo(218.5, B.hazY + 2, 1.4) + tornillo(218.5, B.hazY + 28, 1.4);
  // el transductor, su placa, su columna y el reloj de la fuerza
  h += caja(306, B.base - 12, 30, 44, 10, { tono: 'med' }) + caja(310, B.base - 18, 22, 12, 1, { tono: 'sup' });
  h += `<path class="linea-f" d="M313 ${B.base - 27}h15M313 ${B.base - 24}h11M313 ${B.base - 21}h13"/>` + tornillo(312, B.base - 29, 0.8) + tornillo(330, B.base - 29, 0.8);
  h += cilindro(321, D.y + 20, 3, 1.1, B.base - 56 - (D.y + 20), { tono: 'med' });
  h += `<g id="e-medidor" role="img" aria-label="Medidor de fuerza"><circle class="t-osc" cx="${D.x + 1.4}" cy="${D.y + 1.4}" r="21"/><circle class="t-sup" cx="${D.x}" cy="${D.y}" r="21"/><circle cx="${D.x}" cy="${D.y}" r="18" style="fill:var(--bg-main);stroke:var(--text-dim);stroke-width:.6"/>`;
  for (let i = 0; i <= 30; i++) { const a = rad(-210 + i * 8), [x0, y0] = pol(D.x, D.y, 17.6, a), [x1, y1] = pol(D.x, D.y, i % 5 ? 15.6 : 13.6, a);
    h += `<path class="${i % 5 ? 'linea-f' : 'linea'}" d="M${f2(x0)} ${f2(y0)}L${f2(x1)} ${f2(y1)}"/>`; }
  const [ra0, rb0] = [pol(D.x, D.y, 11.6, rad(-50)), pol(D.x, D.y, 11.6, rad(30))];
  h += `<path d="M${f2(ra0[0])} ${f2(ra0[1])}A11.6 11.6 0 0 1 ${f2(rb0[0])} ${f2(rb0[1])}" style="fill:none;stroke:var(--accent-red);stroke-width:1.6;stroke-opacity:.6"/>`;
  h += `<g id="dial-aguja"><path class="aguja" d="M${D.x} ${D.y + 3}V${D.y - 15}" style="stroke-width:1.1"/></g><circle cx="${D.x}" cy="${D.y}" r="1.8" style="fill:var(--text-main)"/>`;
  h += cilindro(D.x + 21, D.y - 3, 2.2, 0.9, 6, { tono: 'sup' }) + `</g>`;
  h += `</g>`;
  return h;
}
// El haz de miocitos (se rehace en cada latido: se acorta sobre la regla) con sus cerraduras y el hilo al transductor
export function dibHaz(R, acorta) {
  const B = BANCO, L0 = B.haz1 - B.haz0, L = L0 * (1 - acorta), x0 = B.haz0;
  let h = '';
  const c1 = cuenta(R, 'miocito', 'beta1', 6), cg = cuenta(R, 'miocito', 'gluc', 3);
  let kb = 0, kg = 0;
  for (let fila = 0; fila < 3; fila++) {
    const y = B.hazY + fila * (B.fil + 1), corte = 0.4 + 0.12 * fila;
    for (const [a, b] of [[0, corte], [corte, 1]]) {
      const xa = x0 + a * L + (a ? 0.7 : 0), xb = x0 + b * L - (b < 1 ? 0.7 : 0);
      h += `<rect class="miocito" x="${f2(xa)}" y="${f2(y)}" width="${f2(xb - xa)}" height="${B.fil}" rx="3.4"/>`;
      for (let x = xa + 2.4; x < xb - 1.8; x += 2.3 * (1 - acorta * 0.5)) h += `<path class="estria" d="M${f2(x)} ${f2(y + 1.2)}v${f2(B.fil - 2.4)}"/>`;
      h += `<ellipse class="nucleo" cx="${f2((xa + xb) / 2)}" cy="${f2(y + B.fil / 2)}" rx="4" ry="2"/>`;
    }
    const xd = x0 + corte * L; h += `<path class="disco" d="M${f2(xd)} ${f2(y - 0.2)}v3.4h1.4v3.6h-1.4v3.6"/>`;
    for (const t of [0.2, 0.7]) {
      const x = x0 + t * L; h += bocaMini('semicirculo', x, y + 0.2, 1, 'beta1');
      if (kb < c1.tapones) h += `<g transform="translate(${f2(x)} ${f2(y + 0.2)}) rotate(-90)">${llaveMini('semicirculo', 'ciega', 0.9)}</g>`;
      else if (kb < c1.llaves) h += `<g transform="translate(${f2(x)} ${f2(y + 0.2)}) rotate(-90)">${llaveMini('semicirculo', materialDe(c1.quien), 0.9)}</g>`;
      kb++;
    }
    const xg = x0 + 0.9 * L; h += bocaMini('ovalo', xg, y + 0.2, 1, 'gluc');
    if (kg < cg.llaves) h += `<g transform="translate(${f2(xg)} ${f2(y + 0.2)}) rotate(-90)">${llaveMini('ovalo', 'oro', 0.9)}</g>`;
    kg++;
  }
  h += `<path class="linea-h" d="M${f2(x0 + L)} ${B.hazY + 16}L306 ${B.hazY + 18}"/><circle cx="306" cy="${B.hazY + 18}" r="1.4" class="t-sup"/>`;
  return h;
}
// La vía: de la bomba (a la izquierda) a los dos órganos; las llaves viajan dentro (tantas como dosis)
export const VIA = { y: 16, a: 69, b: 256 };
export function dibVia() {
  const V = VIA, B = BANCO;
  let h = `<g id="e-via">`;
  h += tubo([[6, V.y], [354, V.y]], 3.6);
  h += tubo([[V.b, V.y], [V.b, B.hazY - 8], [B.haz0 + 2, B.hazY - 8]], 1.8) + `<circle class="t-sup" cx="${B.haz0 + 1}" cy="${B.hazY - 8}" r="2"/>`;
  h += cilindro(24, V.y - 6, 5, 1.8, 12, { tono: 'med' }) + caja(19, V.y - 6.5, 10, 3, 4, { tono: 'sup' }) + caja(3, V.y + 3.5, 6, 7, 4, { tono: 'med' });
  for (const x of [V.a, V.b]) h += `<circle cx="${x}" cy="${V.y}" r="4.6" class="t-sup"/><circle cx="${x}" cy="${V.y}" r="1.4" style="fill:var(--text-dim)"/>`;
  // la pinza de rodillo de la línea, con su rueda
  h += caja(150, V.y + 5, 14, 10, 6, { tono: 'med' }) + `<circle class="t-sup" cx="157" cy="${V.y - 6}" r="3.4"/><circle cx="157" cy="${V.y - 6}" r="1" style="fill:var(--text-dim)"/>`;
  h += `<g id="via-llaves"></g></g>`;
  return h;
}
export let escenaHecha = '', rlDibujado = -1, ultimaCuenta = '';
export function montarEscena(R, rl) {
  const t = dibTubo(R, rl);
  let h = `<rect class="fondo" x="0" y="0" width="360" height="276"/>`;
  h += dibVia();
  h += `<g id="esc-tubo">${t.svg}</g>`;
  h += `<g id="esc-mast">${R.P.mediadores ? dibMastocito(R, t.g) : ''}</g>`;
  h += dibBanco(R);
  h += `<g id="e-mio" data-celula="miocito" role="button" aria-label="El haz de miocitos"><g id="haz"></g></g>`;
  h += `<g id="esc-cal">${dibCalibre(rl)}</g>`;
  h += `<g id="via-encima"></g><g id="guia-capa-e"></g>`;
  $('escena').innerHTML = h;
  rlDibujado = rl; escenaHecha = R.S.id + R.P.organo; ultimaCuenta = ''; if (typeof V !== 'undefined') V.acorta = -1;
}
// Lo que cambia con el estado (sin rehacer la lámina): el tubo, el mastocito, el calibre y las llaves del nodo
export function actualizarEscena(R, rl, forzar) {
  const clave = JSON.stringify([R.S.pac, R.S.f, Math.round(rl * 4)]);
  if (forzar || Math.abs(rl - rlDibujado) > 0.25 || clave !== ultimaCuenta) {
    const t = dibTubo(R, rl);
    $('esc-tubo').innerHTML = t.svg;
    $('esc-mast').innerHTML = R.P.mediadores ? dibMastocito(R, t.g) : '';
    $('esc-cal').innerHTML = dibCalibre(rl);
    const c1 = cuenta(R, 'nodo', 'beta1', 2), cg = cuenta(R, 'nodo', 'gluc', 1), M = BANCO.met, yb = BANCO.base - 15;
    let h = '';
    [[M.x - 11, 0, 180], [M.x + 11, 1, 0]].forEach(([x, k, gr]) => {
      if (k < c1.tapones) h += `<g transform="translate(${x} ${yb - 6}) rotate(${gr})">${llaveMini('semicirculo', 'ciega', 0.95)}</g>`;
      else if (k < c1.llaves) h += `<g transform="translate(${x} ${yb - 6}) rotate(${gr})">${llaveMini('semicirculo', materialDe(c1.quien), 0.95)}</g>`;
    });
    if (cg.llaves) h += `<g transform="translate(${M.x - 9} ${yb - 22}) rotate(180)">${llaveMini('ovalo', 'oro', 0.95)}</g>`;
    $('nodo-llaves').innerHTML = h;
    rlDibujado = rl; ultimaCuenta = clave;
  }
  return geomTubo(rl, R.P.organo === 'bronquio');
}

