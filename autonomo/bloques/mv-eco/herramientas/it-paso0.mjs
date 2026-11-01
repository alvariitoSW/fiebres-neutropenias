// Paso 0 P5f: ΔP VD-AD pico, vIT de Bernoulli, PSAP = 4v²+PVC y PAP sistólica del motor, por escenario.
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
export function cifrasIT(k, g, eroa = 0) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') { ESCENARIOS[k].aplicar(m, g); }
  m.p.eroaTricus = eroa; m.correr(k !== 'normal' && ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
  const o = m.onda, u = m.ultimo;
  const dp = Math.max(...o.map(x => x.pvd - x.pad)), v = Math.sqrt(Math.max(0, dp) / 4);
  const qmax = Math.max(...o.map(x => x.qTriReg || 0));
  return { dp, v, psap: 4 * v * v + u.pvc, pvc: u.pvc, paps: u.paps, pvdMax: Math.max(...o.map(x => x.pvd)), qmax };
}
if (process.argv[1].endsWith('it-paso0.mjs')) for (const [k, g] of [['normal'], ['hpcronica', 1], ['tep', 1]]) for (const e of [0, 0.3]) console.log(k, 'eroa', e, JSON.stringify(Object.fromEntries(Object.entries(cifrasIT(k, g, e)).map(([a, b]) => [a, +b.toFixed(2)]))));
