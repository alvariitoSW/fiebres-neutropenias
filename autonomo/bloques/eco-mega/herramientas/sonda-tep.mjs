import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
const m = crearMotor(); m.correr(12); ESCENARIOS.tep.aplicar(m); m.correr(ASENTAR_FORMA + 12);
const o = m.onda, r = (k) => `${Math.min(...o.map(x => x[k])).toFixed(0)}-${Math.max(...o.map(x => x[k])).toFixed(0)}`;
console.log(`TEP AI ${r('vai')} AD ${r('vad')} VD ${r('vvd')} VI ${r('vvi')}`);
