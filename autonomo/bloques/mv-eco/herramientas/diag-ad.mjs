// P4a-2 · diagnóstico del área de la AD en el A4C (telesístole): vad del motor, área medida como el juez y área que daría
// el área-longitud monoplano con ese volumen. Lang 2015 p. 29 (Tabla 12): V = 8/(3π)·A²/L ≈ 0,85·A²/L → A = √(V·L/0,8488).
//   node autonomo/bloques/mv-eco/herramientas/diag-ad.mjs [hoy|nuevo]
import { estadosForma, contornosVista, medidasA4C } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
const dib = process.argv[2] || 'hoy';
const area = (ps) => { let s = 0; for (let i = 0; i < ps.length; i++) { const a = ps[i], b = ps[(i + 1) % ps.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };
const COEF = 8 / (3 * Math.PI);
console.log(`dibujo ${dib} | forma g | vad mL | área cortada cm² (todos los trozos) | L mm (alto del corte) | A área-long. cm² | corte/AL`);
for (const [k, gs] of [['normal', [undefined]], ['tep', [0, 0.5, 1]], ['hpcronica', [0, 0.5, 1]], ['taponamiento', [1]], ['hipertrofia', [1]]]) for (const g of gs) {
  let est; try { est = estadosForma(k, g); } catch { continue; }
  const { ts } = est, C = contornosVista('a4c', ts, dib), cad = C.ad?.cad || [];
  const todos = cad.flatMap(c => c.ps), ys = todos.map(p => p[1]);
  const L = ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  // área: suma de los trozos cerrados (aprox. del juez, que los empalma)
  const a = medidasA4C(est.td, ts, dib).areaAdTs;
  const AL = ts.vad * 1000 * L / COEF; const ALcm2 = Math.sqrt(AL) / 10;  // A² = V·L/0,85 (mm⁴) → A (mm²) → /100 cm²
  console.log(`${k} ${g ?? '-'} | ${ts.vad.toFixed(1)} | ${a.toFixed(1)} | ${L.toFixed(0)} | ${(AL ** 0.5 / 100).toFixed(1)} | ${(a / (AL ** 0.5 / 100)).toFixed(2)}`);
}
