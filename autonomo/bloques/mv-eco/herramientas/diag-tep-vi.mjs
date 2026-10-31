// Diagnóstico: VI, PTDVI, GC, PAM, VD en el TEP a g 0 / 0,5 / 0,7 / 0,85 / 1 (mv-eco-2a5)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, aplicarEscenario } from '../../../../js/modules/eco/escenarios.mjs';
const gs = process.argv.slice(2).map(Number); if (!gs.length) gs.push(0, 0.5, 0.7, 0.85, 1);
for (const g of gs) {
  const m = crearMotor({ barorreflejo: process.env.BARO !== '0' }); m.correr(12); aplicarEscenario(m, 'tep', g);
  const u = m.ultimo, f = (x, d = 1) => Number(x).toFixed(d);
  console.log(`g${g}: VItd ${f(u.edv)} VIts ${f(u.esv)} PTDVI ${f(u.ptdvi)} GC ${f(u.gc, 2)} PAM ${f(u.pam)} FC ${f(u.fc, 0)} VDtd ${f(u.edvD)} VD/VI ${f(u.edvD / u.edv, 2)} PVC ${f(u.pvc)} PCP ${f(u.pcp)} pperi ${f(u.pperi, 2)} PAPs ${f(u.paps)} pvdmax ${f(u.pvd_max)} pvimax ${f(u.pvi_max)}`);
}
