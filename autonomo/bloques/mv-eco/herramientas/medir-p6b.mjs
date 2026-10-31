// P6b: fallo a distintos g con parámetros de prueba. Uso: node medir-p6b.mjs [retenMl] [rig] [relaj1] [curva]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { medirForma } from '../../../../js/modules/eco/pruebas/medir-forma.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
// (sin parámetros: mide el fallo tal como está en escenarios.mjs)
const f = (x, d = 1) => x == null || Number.isNaN(x) ? '-' : Number(x).toFixed(d);
console.log('g\tFC\tPAM\tGC\tPCP\tPVC\tFEVI\tFEVD\tVTDvi\tVTDvd\tE\teSep\tE/e′\tDT\tTAPSE');
for (const g of ['def', 0.5, 0.9, 1]) { const h = medirForma('fallo', g); h.fevi = (()=>{const m=crearMotor();m.correr(12);ESCENARIOS.fallo.aplicar(m,g==='def'?undefined:g);m.correr(40);return 100*m.ultimo.fe;})();
  console.log([g, f(h.fc,0), f(h.pam,0), f(h.gc), f(h.pcp), f(h.pvc), f(h.fevi,0), f(h.feVd,0), f(h.viTd,0), f(h.vdTd,0), f(h.E,0), f(h.eSep), f(h.eE), f(h.dt,0), f(h.tapse)].join('\t')); }
