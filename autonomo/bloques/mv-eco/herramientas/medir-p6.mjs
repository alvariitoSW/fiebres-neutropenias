// P6: tabla del fallo (def/0,5/0,75/1): FC, PAM, GC, PCP, FEVI/FEVD, E, A, E/A, DT, e′ sep, E/e′, fusión
// Uso: node autonomo/bloques/mv-eco/herramientas/medir-p6.mjs   (no escribe nada en la app)
import { medirForma } from '../../../../js/modules/eco/pruebas/medir-forma.mjs';
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { contratoDe } from '../../../../js/modules/eco/contrato.mjs';
import { puenteHoy } from '../../../../js/modules/eco/contrato-puente-hoy.mjs';
const f = (x, d = 1) => x == null || Number.isNaN(x) ? '-' : Number(x).toFixed(d);
console.log('g\tFC\tPAM\tGC\tPCP\tFEVI\tFEVD\tE\tA\tE/A\tDT\teSep\tE/e′\tfus');
for (const g of ['def', 0.5, 0.75, 1]) { const h = medirForma('fallo', g);
  const m = crearMotor(); m.correr(12); if (g === 'def') ESCENARIOS.fallo.aplicar(m); else ESCENARIOS.fallo.aplicar(m, g); m.correr(ESCENARIOS.fallo.forma ? ASENTAR_FORMA : 40);
  const L = contratoDe(m, puenteHoy(m)).latido;
  console.log([g, f(h.fc, 0), f(h.pam, 0), f(h.gc), f(h.pcp), f(L.fe, 0), f(L.feVd, 0), f(h.E, 0), f(h.A, 0), f(h.ea, 2), f(h.dt, 0), f(h.eSep), f(h.eE), h.fusion].join('\t')); }
