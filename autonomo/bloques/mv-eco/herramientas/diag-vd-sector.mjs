// mv-eco-2a5 · vuelta 5: ¿el plano A4C corta la pared libre del VD, y cae dentro del sector?
//   node autonomo/bloques/mv-eco/herramientas/diag-vd-sector.mjs
import { estadosForma, contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { planoVista, anguloHacia } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(2);
const grados = (x) => (x * 180 / Math.PI).toFixed(0);
for (const [k, g] of [['normal'], ['hpcronica', 1], ['tep', 1]]) {
  const { td } = estadosForma(k, g);
  const P = planoVista('a4c', td);
  const C = contornosVista('a4c', td, 'nuevo');
  console.log(k, g ?? '-', 'sector ±', grados(P.mitad), '| piezas:', Object.keys(C).join(','));
  for (const n of ['vdEndo', 'vdEpi']) { const ch = C[n]?.cad; if (!ch) { console.log('  ', n, 'sin corte'); continue; }
    for (const c of ch) { const a = c.ps.map(p => Math.atan2(p[0], p[1]));
      console.log('  ', n, 'pts', c.ps.length, 'ang(°) min', grados(Math.min(...a)), 'max', grados(Math.max(...a)), 'prof máx', Math.max(...c.ps.map(p => p[1])).toFixed(0)); } }
}
{ const { td } = estadosForma('hpcronica', 1); const C = contornosVista('a4c', td, 'nuevo');
  for (const n of ['vdEndo', 'vdEpi']) { const c = C[n].cad[0].ps; console.log(n, c.filter((_, i) => i % 6 === 0).map(p => `(${p[0].toFixed(0)},${p[1].toFixed(0)})`).join(' ')); } }
