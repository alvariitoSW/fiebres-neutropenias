// P1: índices de relajación del VI por escenario (relajación del motor, TRIV, FE, tasa de llenado normalizada)
import { crearMotor, ePrimaDeOnda } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
for (const [k, g] of [['normal'], ['fallo', 'def'], ['fallo', 1], ['dilatada'], ['hipertrofia', 0], ['hipertrofia', 'def'], ['hipertrofia', 1], ['hpcronica', 'def'], ['hpcronica', 1], ['tep', 'def'], ['tep', 0.95], ['vasoplejia'], ['hemorragia', 1]]) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
  const u = m.ultimo;
  console.log(`${k}:${g}`.padEnd(16), 'relaj', m.p.relajacion.toFixed(2), 'triv', ((u.tMitAbre - u.tS2) * 1000).toFixed(0), 'FE', (u.fe * 100).toFixed(0), 'tasa', u.ePrima.tasa.toFixed(2), 'lat', u.ePrima.lat.toFixed(1), 'vi.b', m.p.vi?.b, 'ees', m.p.eesVi ?? '', 'rigidez', m.p.rigidezVi ?? '');
}
