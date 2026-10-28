// Sonda: mínimos de AI y AD del normal y constantes (usa ECO_OVR con ovr-preload.mjs)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
const m = crearMotor(); m.correr(12); const o = m.onda, u = m.ultimo;
const mn = (k) => Math.min(...o.map(x => x[k])).toFixed(1), mx = (k) => Math.max(...o.map(x => x[k])).toFixed(1);
console.log(`AI ${mn('vai')}-${mx('vai')} AD ${mn('vad')}-${mx('vad')} pAI ${mn('pai')}-${mx('pai')} pAD ${mn('pad')}-${mx('pad')} PVC ${u.pvc.toFixed(2)} PCP ${u.pcp.toFixed(2)} PAM ${u.pam.toFixed(1)} GC ${u.gc.toFixed(2)} PAP ${u.paps.toFixed(1)}/${(+mn('pap')).toFixed(1)} VDsis ${mx('pvd')}`);
const q = o.map(x => x.qVp); console.log(`qVp ${Math.min(...q).toFixed(0)}..${Math.max(...q).toFixed(0)} mL/s`);
