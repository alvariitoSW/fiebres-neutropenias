// P4a-1 · diagnóstico de la pared libre del VD en el A4C (dibujo hoy y nuevo).
//   node autonomo/bloques/mv-eco/herramientas/diag-pared-vd.mjs [hoy|nuevo]
// Para normal, TEP y HP crónica a g 0/0,5/1 (telediástole): pared del VD que da anatomia.mjs (paredVdDe), la que mide el
// juez (mediana endo→epi del tercio medio-basal, lado libre), y su reparto (mín, p25, p75, máx) para ver si es el dibujo
// (pared adelgazada donde la luz es estrecha) o la forma de medir.
import { estadosForma, contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { paredVdDe } from '../../../../js/modules/eco/anatomia.mjs';
const dib = process.argv[2] || 'hoy';
// Sin cerrar las cadenas abiertas: el epicardio del VD es abierto (de la base al ápex); el juez lo cierra con una cuerda
// recta base→ápex que, con el VD dilatado, pasa por dentro de la cavidad pegada al endocardio (columna «a la cuerda»).
const cerrar = (c) => c.ps;
const dS = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; const t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0; return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
const dA = (p, ps) => { let m = Infinity; for (let i = 0; i < ps.length - 1; i++) m = Math.min(m, dS(p, ps[i], ps[i + 1])); return m; };
const q = (a, f) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(f * s.length))]; };
const f1 = (x) => (x == null || Number.isNaN(x) ? '-' : x.toFixed(1));
console.log(`dibujo ${dib} | forma g | anatomia | endo→epi abierto (mediana) | min p25 p75 max | n | a la cuerda`);
for (const [k, gs] of [['normal', [undefined]], ['tep', [0, 0.5, 1]], ['hpcronica', [0, 0.5, 1]]]) for (const g of gs) {
  const { td } = estadosForma(k, g), C = contornosVista('a4c', td, dib);
  const poli = (n) => { const c = C[n]?.cad?.sort((a, b) => b.ps.length - a.ps.length)[0]; return c ? cerrar(c) : null; };
  const vdE = poli('vdEndo'), vdP = poli('vdEpi');
  if (!vdE || !vdP) { console.log(k, g, 'sin corte'); continue; }
  const ys = vdE.map(p => p[1]), y0 = Math.min(...ys), L = Math.max(...ys) - y0;
  const ls = vdE.filter(p => p[1] > y0 + L * 0.35 && p[1] < y0 + L * 0.9), xm = q(ls.map(p => p[0]), 0.5);
  const d = ls.filter(p => p[0] <= xm).map(p => dA(p, vdP));
  const a = vdP[0], b = vdP[vdP.length - 1], dc = ls.filter(p => p[0] <= xm).map(p => dS(p, b, a));
  console.log(`${k} ${g ?? '-'} | ${f1(paredVdDe(td))} | ${f1(q(d, 0.5))} | ${f1(Math.min(...d))} ${f1(q(d, .25))} ${f1(q(d, .75))} ${f1(Math.max(...d))} | ${d.length} | ${f1(q(dc, 0.5))}`);
}
