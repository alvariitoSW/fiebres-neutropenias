// P5a: barrido del mando del TEP (g de 0 a 1 de 0,1 en 0,1 y el defecto): PAM, GC, FEVD, TAPSE, VD/VI, E/e′, TAP.
// Uso: node autonomo/bloques/mv-eco/herramientas/barrido-tep.mjs [g1 g2 ...]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { contratoDe } from '../../../../js/modules/eco/contrato.mjs';
import { puenteHoy } from '../../../../js/modules/eco/contrato-puente-hoy.mjs';
const f = (x, d = 1) => x == null || Number.isNaN(x) ? '-' : Number(x).toFixed(d);
const gs = process.argv.length > 2 ? process.argv.slice(2).map(x => x === 'def' ? x : Number(x)) : ['def', 0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
console.log(['g', 'FC', 'PAM', 'GC', 'PSAP', 'FEVD', 'TAPSE', 'VD/VI', 'E/e′', 'TAP'].join('\t'));
for (const g of gs) {
  const m = crearMotor(); m.correr(12); if (g === 'def') ESCENARIOS.tep.aplicar(m); else ESCENARIOS.tep.aplicar(m, g); m.correr(ASENTAR_FORMA);
  const L = contratoDe(m, puenteHoy(m)).latido;
  console.log([g, f(L.fc, 0), f(L.pam, 0), f(L.gc), f(L.paps, 0), f(L.feVd, 0), f(L.tapse), f(L.vdvi, 2), f(L.eE), f(L['tiempos.tap'], 0)].join('\t'));
}
