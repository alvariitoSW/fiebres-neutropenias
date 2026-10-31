// mv-eco-2a5 · vuelta 5: ¿el endocardio del VI en el PSAX es una curva suave? Giro máximo entre tramos vecinos del contorno (°)
// y número de puntas (giros > 25°). Papilares aparte: pieza «Papilar…».
//   node diag-d-suave.mjs
import { estadosForma, contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
for (const [k, g] of [['normal'], ['hpcronica', 1], ['hpcronica', 0.5], ['tep', 1], ['tep', 0.5]]) {
  const { td } = estadosForma(k, g), C = contornosVista('psaxPm', td, 'nuevo');
  const out = [];
  for (const nom of ['viEndo']) for (const ch of C[nom]?.cad ?? []) { const p = ch.ps; if (p.length < 20) continue; let mx = 0, pun = 0, suma = 0;
    for (let i = 1; i < p.length - 1; i++) { const a = Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0]), b = Math.atan2(p[i + 1][1] - p[i][1], p[i + 1][0] - p[i][0]);
      let d = Math.abs(b - a); if (d > Math.PI) d = 2 * Math.PI - d; d *= 180 / Math.PI; mx = Math.max(mx, d); if (d > 25) pun++; suma += d; }
    out.push(`n ${p.length} giro máx ${mx.toFixed(0)}° puntas>25° ${pun} total ${suma.toFixed(0)}°`); }
  console.log(k, g ?? '-', out.join(' | '), '| piezas', Object.keys(C).join(','));
}
