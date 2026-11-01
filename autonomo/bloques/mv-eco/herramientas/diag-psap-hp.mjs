// PAP del motor en HP crónica g=1 y TEP g=1 (para entender la vIT de la captura d-it-cw-*)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
for (const [k, g] of [['normal'], ['hpcronica', 1], ['tep', 1]]) { const m = crearMotor(); m.correr(12); if (k !== 'normal') ESCENARIOS[k].aplicar(m, g); m.correr(ASENTAR_FORMA); const u = m.ultimo; console.log(k, Object.entries(u).filter(([n]) => /pap|pvc|pad|psap|pvd|pap/i.test(n)).map(([n, v]) => n + '=' + (+v).toFixed(1)).join(' ')); }
