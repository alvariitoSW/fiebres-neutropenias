// P5a: imprime las filas de TABLA de contrato.test.mjs para el TEP (modo 'app', como la prueba). Uso: node ...fila-tabla-tep.mjs def 0.5 1
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { contratoDe } from '../../../../js/modules/eco/contrato.mjs';
import { puenteHoy } from '../../../../js/modules/eco/contrato-puente-hoy.mjs';
for (const a of process.argv.slice(2)) {
  const m = crearMotor(); m.correr(12); if (a === 'def') ESCENARIOS.tep.aplicar(m); else ESCENARIOS.tep.aplicar(m, +a); m.correr(ASENTAR_FORMA);
  const L = contratoDe(m, puenteHoy(m)).latido, r = (x, d = 1) => +x.toFixed(d);
  console.log(a, [r(L.feVd, 0), r(L.tapse), r(L.paps, 0), r(L.papd, 0), r(L.pvc, 0), r(L.pam, 0), r(L.gc), r(L.vdvi, 2), r(L['pared.vd']), r(L.eE)].join(', '));
}
