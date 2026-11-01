// 154 · barrido de la poscarga del VD con la meseta del VD (motor.retrasoVdPorK): TEP y HP crónica de 0 a 1 y la resistencia
// pulmonar sola (k = 1…15). Paciente posible: FC, PAM, GC, PAPs, TAPSE, meseta (ms) y pVD/pVI en telesístole (Lang). Uso: node …
import { crearMotor, BASE, escalarRPul } from '../../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../../js/modules/eco/escenarios.mjs';
import { medirVd, muestrasClave } from '../../../../../js/modules/eco/atlas/vd.mjs';
const fila = (t, m) => { const u = m.ultimo, v = medirVd(m), es = muestrasClave(m.onda).es;
  console.log(`${t.padEnd(16)} FC ${u.fc.toFixed(0)} PAM ${u.pam.toFixed(0)} GC ${u.gc.toFixed(2)} PAPs ${u.paps.toFixed(0)} PVC ${u.pvc.toFixed(0)} TAPSE ${v.tapse.toFixed(1)} meseta ${(1000 * (m.s?.mesetaVd ?? NaN)).toFixed(0)} ms pVD/pVI(ts) ${(es.pvd / es.pvi).toFixed(2)} IE ${v.eiD.toFixed(2)}/${v.eiS.toFixed(2)}`); };
for (const k of ['tep', 'hpcronica']) for (const g of [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]) { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); m.correr(ASENTAR_FORMA); fila(`${k} ${g}`, m); }
for (const k of [1, 2, 4, 8, 12, 15]) { const m = crearMotor({ rPul: escalarRPul(BASE, k) }); m.correr(40); fila(`rPul ×${k}`, m); }
