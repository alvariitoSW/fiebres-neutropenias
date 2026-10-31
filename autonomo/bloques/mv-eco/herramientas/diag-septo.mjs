// P4b · diagnóstico del tabique: septo (hoy), septoSignoDe(pvd−pvi) y LVEI (eje corto, como lo mide el juez) en td y ts.
//   node autonomo/bloques/mv-eco/herramientas/diag-septo.mjs [hoy|nuevo]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { septoSignoDe } from '../../../../js/modules/eco/contrato.mjs';
import { contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
const dib = process.argv[2] || 'hoy';
const ASENTAR = 40;
console.log(`dibujo ${dib} | forma g | fase | pvd-pvi | septo | septoSigno | LVEI juez (y/x) | EI según el septo (x/y) | alto y ancho (mm)`);
for (const [k, gs] of [['normal', [undefined]], ['tep', [0, 0.5, 1]], ['hpcronica', [0, 0.5, 1]]]) for (const g of gs) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') { ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? 200 : ASENTAR); }
  const o = m.onda, extra = extraDeMotor(m);
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ts = o.reduce((a, b) => (b.vvi < a.vvi ? b : a));
  for (const [f, s] of [['TD', td], ['TS', ts]]) {
    const e = estadoGeo(s, extra), C = contornosVista('psaxPm', e, dib), p = C.viEndo?.cad?.flatMap(c => c.ps);
    const ex = (i) => Math.max(...p.map(q => q[i])) - Math.min(...p.map(q => q[i]));
    console.log(`${k} ${g ?? '-'} | ${f} | ${(s.pvd - s.pvi).toFixed(1)} | ${e.septo.toFixed(2)} | ${septoSignoDe(s.pvd - s.pvi).toFixed(2)} | ${(ex(1) / ex(0)).toFixed(2)} | ${(ex(0) / ex(1)).toFixed(2)} | ${ex(1).toFixed(1)} x ${ex(0).toFixed(1)}`);
  }
}
// Hallazgo (31/10): con la pantalla girada el juez antiguo (y/x) medía el inverso; ahora usa paralelo/perpendicular al tabique. Esta columna y/x es la antigua.
