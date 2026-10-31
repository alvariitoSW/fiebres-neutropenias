// Juez de geometría (B-045, J-geo). Node, sin navegador. NO es *.test.mjs: no entra en la suite por defecto.
//   node js/modules/eco/pruebas/geometria-juez.mjs [--dibujo hoy] [--json]
//   import { juzgarGeometria } from './geometria-juez.mjs'   →  { filas, resumen }
// Para cada forma de ESCENARIOS y cada punto de su mando (g = 0, 0,5, 1; sin mando, un punto), con el motor latiendo hasta
// estable, en telediástole (máx. vvi) y telesístole (mín. vvi):
//   a. contornos del corte A4C, eje corto (psaxPm) y PLAX (endo/epi de VI y VD, AI, AD): ninguno se cruza consigo mismo
//      y el endocardio del VI no sale de su epicardio;
//   b. medidas en mm sobre el A4C (diámetro basal VD y VI, VD/VI, pared libre del VD, pared del VI, área de la AD) contra
//      el rango de la guía de su forma, con página. Páginas impresas; PDF en docs/.
// Un límite sin fuente va marcado `sinFuente` y solo avisa (no falla).
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { construirCorazon } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { planoVista, cortarPieza } from '../ecografia.mjs';

const LANG = (p) => `Lang 2015 p.${p}`, MUK = (p) => `Mukherjee 2025 p.${p}`, ESC = (p) => `ESC/ERS 2022 p.${p}`;
export const VISTAS_JUEZ = ['a4c', 'psaxPm', 'plax'];
export const DIBUJOS = { hoy: { construir: construirCorazon, nota: 'dibujo de hoy (corazon-geo.mjs, sin cambios)' } };
const PIEZAS = { 'VI endocardio': 'viEndo', 'VI epicardio': 'viEpi', 'VD endocardio': 'vdEndo', 'VD epicardio': 'vdEpi', AI: 'ai', AD: 'ad' };

// ---------------------------------------------------------------- geometría 2D
const cruz = (ax, ay, bx, by, cx, cy) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
function seCruzan(a, b, c, d) {   // cruce propio (los extremos que se tocan no cuentan)
  const e = 1e-7;
  const d1 = cruz(...c, ...d, ...a), d2 = cruz(...c, ...d, ...b), d3 = cruz(...a, ...b, ...c), d4 = cruz(...a, ...b, ...d);
  return ((d1 > e && d2 < -e) || (d1 < -e && d2 > e)) && ((d3 > e && d4 < -e) || (d3 < -e && d4 > e));
}
/** Cadenas de puntos [x,y] a partir de los segmentos del corte (los extremos comparten clave). */
export function cadenas({ seg, claves }) {
  const n = claves.length / 2, ady = new Map();
  for (let i = 0; i < n; i++) for (const e of [0, 1]) { const k = claves[2 * i + e]; (ady.get(k) || ady.set(k, []).get(k)).push([i, e]); }
  const usado = new Uint8Array(n), out = [];
  const pt = (i, e) => [seg[4 * i + 2 * e], seg[4 * i + 2 * e + 1]];
  const sigue = (k, desde) => { for (const [j, e] of ady.get(k) || []) if (!usado[j] && j !== desde) return [j, e]; return null; };
  for (let i = 0; i < n; i++) {
    if (usado[i]) continue;
    usado[i] = 1; const ps = [pt(i, 0), pt(i, 1)]; let kf = claves[2 * i + 1];
    for (let paso = 0; paso < n; paso++) { const s = sigue(kf, -1); if (!s) break; usado[s[0]] = 1; ps.push(pt(s[0], 1 - s[1])); kf = claves[2 * s[0] + 1 - s[1]]; }
    let ki = claves[2 * i];
    for (let paso = 0; paso < n; paso++) { const s = sigue(ki, -1); if (!s) break; usado[s[0]] = 1; ps.unshift(pt(s[0], 1 - s[1])); ki = claves[2 * s[0] + 1 - s[1]]; }
    out.push({ ps, cerrada: ki === kf });
  }
  return out;
}
export function cruces({ seg, claves }) {
  const n = claves.length / 2, mal = [];
  const P = (i) => [[seg[4 * i], seg[4 * i + 1]], [seg[4 * i + 2], seg[4 * i + 3]]];
  for (let i = 0; i < n; i++) { const [a, b] = P(i);
    for (let j = i + 1; j < n; j++) {
      if (claves[2 * i] === claves[2 * j] || claves[2 * i] === claves[2 * j + 1] || claves[2 * i + 1] === claves[2 * j] || claves[2 * i + 1] === claves[2 * j + 1]) continue;
      const [c, d] = P(j); if (seCruzan(a, b, c, d)) mal.push([a, c]);
    } }
  return mal;
}
const cerrar = (c) => c.cerrada || c.ps.length < 3 ? c.ps : [...c.ps, c.ps[0]];
const area = (ps) => { let s = 0; for (let i = 0; i < ps.length - 1; i++) s += ps[i][0] * ps[i + 1][1] - ps[i + 1][0] * ps[i][1]; return Math.abs(s) / 2; };
/** Lista de segmentos [a,b] de todas las cadenas, con los extremos sueltos unidos de dos en dos (el más cercano), como la pared cerrada. */
function segsCerrados(cad) {
  const S = [], ex = [];
  for (const c of cad) { for (let i = 0; i < c.ps.length - 1; i++) S.push([c.ps[i], c.ps[i + 1]]); if (!c.cerrada) ex.push(c.ps[0], c.ps[c.ps.length - 1]); }
  const par = []; for (let i = 0; i < ex.length; i++) for (let j = i + 1; j < ex.length; j++) par.push([Math.hypot(ex[i][0] - ex[j][0], ex[i][1] - ex[j][1]), i, j]);
  par.sort((a, b) => a[0] - b[0]); const u = new Set();
  for (const [d, i, j] of par) if (!u.has(i) && !u.has(j)) { u.add(i); u.add(j); S.push([ex[i], ex[j]]); }
  return S;
}
function dentro(S, [x, y]) { let c = false; for (const [[x1, y1], [x2, y2]] of S) { if ((y1 > y) !== (y2 > y) && x < x1 + (y - y1) * (x2 - x1) / (y2 - y1)) c = !c; } return c; }
const distS = (p, S) => { let m = Infinity; for (const [a, b] of S) m = Math.min(m, distSeg(p, a, b)); return m; };
function distSeg(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy || 1e-12, t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); }
const distA = (p, ps) => { let m = Infinity; for (let i = 0; i < ps.length - 1; i++) m = Math.min(m, distSeg(p, ps[i], ps[i + 1])); return m; };
/** Extensión horizontal [min,max] de un polígono cerrado a la profundidad y. */
function corteH(ps, y) { const xs = []; for (let i = 0; i < ps.length - 1; i++) { const [x1, y1] = ps[i], [x2, y2] = ps[i + 1]; if ((y1 > y) !== (y2 > y)) xs.push(x1 + (y - y1) * (x2 - x1) / (y2 - y1)); } return xs.length ? [Math.min(...xs), Math.max(...xs)] : null; }
const mediana = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : NaN; };

// ---------------------------------------------------------------- motor y contornos
export function estadosForma(k, g) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
  const o = m.onda, extra = extraDeMotor(m);
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ts = o.reduce((a, b) => (b.vvi < a.vvi ? b : a));
  return { td: estadoGeo(td, extra), ts: estadoGeo(ts, extra) };
}
export function contornosVista(clave, est, dibujo = 'hoy') {
  const P = planoVista(clave, est), partes = DIBUJOS[dibujo].construir(est).partes, out = {};
  for (const p of partes) { const k = PIEZAS[p.nombre]; if (!k || !p.idx) continue;
    const c = cortarPieza(p, P); if (!c.seg.length) continue;
    (out[k] ||= []).push(c); }
  // varias piezas con el mismo nombre (no hay en las seis): se juntan
  const res = {};
  for (const [k, cs] of Object.entries(out)) { const c = cs[0]; res[k] = { seg: c.seg, claves: c.claves, cad: cadenas(c), cruces: cruces(c) }; }
  return res;
}

// ---------------------------------------------------------------- medidas en el A4C (mm)
export function medidasA4C(td, ts) {
  const C = contornosVista('a4c', td), r = {};
  const poli = (k) => { const c = C[k]?.cad?.sort((a, b) => b.ps.length - a.ps.length)[0]; return c ? cerrar(c) : null; };
  const vdE = poli('vdEndo'), viE = poli('viEndo'), vdP = poli('vdEpi'), viP = poli('viEpi');
  if (vdE && viE) {
    const ys = vdE.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), L = y1 - y0;   // d crece del ápex a la base
    const ancho = (ps, a, b) => { let m = 0, h = 0.5; for (let y = a; y <= b; y += h) { const e = corteH(ps, y); if (e) m = Math.max(m, e[1] - e[0]); } return m; };
    // cavidad del VD: del endocardio de la pared libre (la superficie del VD es abierta) al epicardio del VI (el lado del tabique)
    let bas = 0; const tabique = viP || viE;
    for (let y = y0 + L * 2 / 3; y <= y1; y += 0.5) { const f = corteH(vdE, y), t = corteH(tabique, y); if (f && t) bas = Math.max(bas, t[0] - f[0]); }
    r.vdBasal = bas; r.vdLargo = L;
    const yi = viE.map(p => p[1]), a0 = Math.min(...yi), a1 = Math.max(...yi);
    r.viBasal = ancho(viE, a0 + (a1 - a0) * 2 / 3, a1); r.viLargo = a1 - a0; r.vdVi = r.vdBasal / r.viBasal;
    // pared libre del VD: distancia del endocardio del VD (lado libre, tercio medio-basal) a su epicardio
    if (vdP) { const ls = vdE.filter(p => p[1] > y0 + L * 0.35 && p[1] < y0 + L * 0.9); const xm = mediana(ls.map(p => p[0])); r.paredVd = mediana(ls.filter(p => p[0] <= xm).map(p => distA(p, vdP))); }
    if (viP) { const li = viE.filter(p => p[1] > a0 + (a1 - a0) * 0.35 && p[1] < a0 + (a1 - a0) * 0.8), xs = li.map(p => p[0]), xmin = Math.min(...xs), xmax = Math.max(...xs), q = (xmax - xmin) / 6;
      r.paredViLat = mediana(li.filter(p => p[0] > xmax - q).map(p => distA(p, viP))); r.paredViSep = mediana(li.filter(p => p[0] < xmin + q).map(p => distA(p, viP))); }
  }
  // LVEI (eje corto a la altura de los papilares, telediástole): dimensión anteroposterior / septolateral del endocardio del VI
  const Ce = contornosVista('psaxPm', td), e = Ce.viEndo?.cad?.flatMap(c => c.ps);
  if (e?.length) { const ex = (i) => Math.max(...e.map(p => p[i])) - Math.min(...e.map(p => p[i])); r.lvei = ex(1) / ex(0); }
  const Cs = contornosVista('a4c', ts), ad = Cs.ad?.cad?.sort((a, b) => b.ps.length - a.ps.length)[0];
  if (ad) r.areaAdTs = area(cerrar(ad)) / 100;   // cm², telesístole
  return r;
}

// ---------------------------------------------------------------- rangos por forma (con página)
const nf = (v, d = 0) => (v == null || Number.isNaN(v) ? '-' : Number(v).toFixed(d));
const R = (medida, min, max, fuente, extra = {}) => ({ medida, min, max, fuente, ...extra });
const TECHO = { vdBasal: 70, paredVd: 15, vdVi: 2.5 };   // techos de «paciente posible»: sin fuente
export function rangosDe(k, g) {
  const r = [], tope = g >= 0.99, nl = (k === 'normal');
  const lb = (min) => nl ? min : 0;
  const hp = k === 'hpcronica', tep = k === 'tep';
  // VD basal
  if (hp && tope || tep && tope) r.push(R('vdBasal', 41, TECHO.vdBasal, LANG(20) + ' (dilatado >41: derivado del límite superior de la Tabla 8)', {}), R('vdBasal', 0, TECHO.vdBasal, 'techo de paciente posible', { sinFuente: true }));
  else if (k === 'fallo' || k === 'dilatada') r.push(R('vdBasal', lb(25), 49, LANG(20) + ' (25-41) / ' + MUK(145) + ' (>49 grave)'));
  else r.push(R('vdBasal', lb(25), 41, LANG(20)));
  // VD/VI basal
  if ((hp || tep) && tope) r.push(R('vdVi', 1.0, TECHO.vdVi, ESC(3645) + ' T10 (>1,0)'), R('vdVi', 0, TECHO.vdVi, 'techo de paciente posible', { sinFuente: true }));
  else r.push(R('vdVi', 0, 1.0, ESC(3645) + ' T10 (>1,0 = señal de HP)'));
  // pared libre VD
  if (hp && tope) r.push(R('paredVd', 5, TECHO.paredVd, LANG(20) + ' (1-5); ' + MUK(145) + ' (<5 normal)'), R('paredVd', 0, TECHO.paredVd, 'techo de paciente posible', { sinFuente: true }));
  else r.push(R('paredVd', 0, 5, LANG(20) + ' (1-5); ' + MUK(144)));
  // pared VI (septo y lateral): 6-10 mm en varón; en la dilatada/fallo, solo el techo
  const hip = k === 'hipertrofia' && g > 0.01;
  if (hip && !tope) r.push(R('paredViSep', 0, 25, 'techo de paciente posible', { sinFuente: true }));
  else if (hip && tope) r.push(R('paredViSep', 10, 25, LANG(17) + ' (0,6-1,0 cm; >10 = hipertrofia: derivado del límite normal)'), R('paredViSep', 0, 25, 'techo de paciente posible', { sinFuente: true }));
  else r.push(R('paredViSep', 0, 10, LANG(17) + ' (0,6-1,0 cm)')), r.push(R('paredViLat', 0, 10, LANG(17)));
  // aplanamiento del tabique (LVEI) y AD telesistólica
  if ((hp || tep) && tope) r.push(R('lvei', 1.1, 2.5, ESC(3645) + ' T10 (LVEI >1,1)'), R('lvei', 0, 2.5, 'techo de paciente posible', { sinFuente: true }));
  else r.push(R('lvei', 0, 1.1, ESC(3645) + ' T10 (LVEI >1,1 = señal de HP)'));
  if (hp && tope) r.push(R('areaAdTs', 18, 40, ESC(3645) + ' T10 (área AD telesistólica >18 cm²); ' + MUK(145) + ' (<19 normal)'), R('areaAdTs', 0, 40, 'techo de paciente posible', { sinFuente: true }));
  else r.push(R('areaAdTs', 0, 19, MUK(145) + ' (área AD <19 cm²)'));
  return r;
}
export function gDe(k) { return k !== 'normal' && ESCENARIOS[k].gravedad ? [0, 0.5, 1] : [undefined]; }

// ---------------------------------------------------------------- juez
export function juzgarGeometria({ dibujo = 'hoy', formas = Object.keys(ESCENARIOS) } = {}) {
  if (!DIBUJOS[dibujo]) throw new Error('dibujo desconocido: ' + dibujo);
  const filas = [];
  const fila = (k, g, vista, fase, mal, ok, cifras = '', aviso = false) => filas.push({ forma: k, g: g ?? '-', vista, fase, ok: !mal.length, aviso, motivo: mal.length ? mal.join('; ') : ok, cifras });
  for (const k of formas) for (const g of gDe(k)) {
    const { td, ts } = estadosForma(k, g);
    for (const [fase, est] of [['td', td], ['ts', ts]]) for (const v of VISTAS_JUEZ) {
      const C = contornosVista(v, est, dibujo), mal = [], cif = [];
      for (const [n, c] of Object.entries(C)) { if (c.cruces.length) mal.push(`${n} se cruza consigo mismo (${c.cruces.length}x, p.ej. en ${c.cruces[0][0].map(x => nf(x, 1))})`); cif.push(`${n}:${c.cad.length}`); }
      for (const par of ['vi']) { const E = C[par + 'Endo'], P = C[par + 'Epi'];
        if (E && P) { const pe = segsCerrados(P.cad);
          const abiertos = P.cad.filter(c => !c.cerrada).flatMap(c => [c.ps[0], c.ps[c.ps.length - 1]]);   // la base abierta: ahí el cierre recto no vale
          const fuera = E.cad.flatMap(c => c.ps).filter(p => !dentro(pe, p) && distS(p, pe) > 0.5 && !abiertos.some(q => Math.hypot(p[0] - q[0], p[1] - q[1]) < 25)).length;
          if (fuera) mal.push(`endocardio del ${par.toUpperCase()} sale ${fuera} puntos del epicardio`); } }
      if (!C.viEndo) mal.push('sin corte del endocardio del VI');
      fila(k, g, v, fase, mal, 'sin cruces; endo dentro de epi', cif.join(' '));
    }
    const m = medidasA4C(td, ts), rs = rangosDe(k, g === undefined ? 0 : g);
    const mal = [], aviso = [];
    for (const rg of rs) { const x = m[rg.medida];
      if (x == null || Number.isNaN(x)) { mal.push(`${rg.medida}: no se pudo medir`); continue; }
      if (x < rg.min - 1e-9 || x > rg.max + 1e-9) (rg.sinFuente ? aviso : mal).push(`${rg.medida} ${nf(x, ['vdVi', 'lvei'].includes(rg.medida) ? 2 : 1)} fuera de ${rg.min}-${rg.max} (${rg.fuente})`); }
    const cifras = Object.entries(m).map(([a, b]) => `${a}=${nf(b, ['vdVi', 'lvei'].includes(a) ? 2 : 1)}`).join(' ');
    fila(k, g, 'a4c', 'medidas', mal, 'dentro de rango', cifras + (aviso.length ? ' | AVISO sin fuente: ' + aviso.join('; ') : ''));
  }
  const malas = filas.filter(f => !f.ok);
  return { filas, resumen: { total: filas.length, fallos: malas.length, dibujo } };
}

// ---------------------------------------------------------------- captura de los contornos del A4C (SVG; jueces.mjs lo pasa a PNG)
const COL = { viEndo: '#e06c6c', viEpi: '#a04040', vdEndo: '#6ca0e0', vdEpi: '#4070a0', ai: '#e0c050', ad: '#60c090' };
export function capturaSVG(k, g, fase = 'td', vista = 'a4c', dibujo = 'hoy') {
  const { td, ts } = estadosForma(k, g), C = contornosVista(vista, fase === 'td' ? td : ts, dibujo);
  const pts = Object.values(C).flatMap(c => c.cad.flatMap(x => x.ps)), xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs) - 10, y0 = Math.min(...ys) - 10, W = Math.max(...xs) - x0 + 10, H = Math.max(...ys) - y0 + 10;
  const l = Object.entries(C).flatMap(([n, c]) => c.cad.map(x => `<polyline fill="none" stroke="${COL[n]}" stroke-width="1.2" points="${x.ps.map(p => `${(p[0] - x0).toFixed(1)},${(H - (p[1] - y0)).toFixed(1)}`).join(' ')}"/>`));   // ápex abajo, base arriba
  const cx = Object.entries(C).flatMap(([, c]) => c.cruces).map(([a]) => `<circle cx="${(a[0] - x0).toFixed(1)}" cy="${(H - (a[1] - y0)).toFixed(1)}" r="3" fill="none" stroke="#fff"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${(H + 14).toFixed(0)}" width="${(W * 3).toFixed(0)}" height="${((H + 14) * 3).toFixed(0)}"><rect width="100%" height="100%" fill="#111"/>${l.join('')}${cx.join('')}<text x="3" y="${(H + 11).toFixed(0)}" fill="#ddd" font-size="7" font-family="sans-serif">${k} g=${g ?? '-'} ${vista.toUpperCase()} ${fase} · rojo VI, azul VD</text></svg>`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2), dib = a.includes('--dibujo') ? a[a.indexOf('--dibujo') + 1] : 'hoy';
  const { filas, resumen } = juzgarGeometria({ dibujo: dib });
  if (a.includes('--json')) console.log(JSON.stringify({ resumen, filas }, null, 1));
  else { for (const f of filas) console.log(`${f.ok ? '✅' : '❌'} ${f.forma}:${f.g} ${f.vista} ${f.fase} — ${f.motivo}${f.ok ? '' : ' · ' + f.cifras}`);
    console.log(`\n${resumen.fallos} fallos de ${resumen.total} filas (dibujo ${dib})`); }
  process.exit(resumen.fallos ? 1 : 0);
}
