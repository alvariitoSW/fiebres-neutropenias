// Imprime las filas «contrato = motor de hoy» del TEP (FEVD, TAPSE, PSAP, PAPd, PVC, PAM, GC, VD/VI, pared VD, E/e′) con el motor de hoy
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { contratoDe } from '../../../../js/modules/eco/contrato.mjs';
import { puenteHoy } from '../../../../js/modules/eco/contrato-puente-hoy.mjs';
for (const g of [0.5, 'def', 1]) {
  const m = crearMotor(); m.correr(12);
  if (g === 'def') ESCENARIOS.tep.aplicar(m); else ESCENARIOS.tep.aplicar(m, g);
  m.correr(ASENTAR_FORMA);
  const L = contratoDe(m, puenteHoy(m)).latido, r = (x, d = 1) => +x.toFixed(d);
  console.log(g, [r(L.feVd, 0), r(L.tapse), r(L.paps, 0), r(L.papd, 0), r(L.pvc, 0), r(L.pam, 0), r(L.gc), r(L.vdvi, 2), r(L['pared.vd']), r(L.eE)].join(', '));
}
