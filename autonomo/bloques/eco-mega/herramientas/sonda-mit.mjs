import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
const m = crearMotor(); m.correr(12); const o = m.onda;
const q = o.map(x => x.qMit); console.log('n', o.length, 'qMit max', Math.max(...q).toFixed(0), 'muestras cada 60:', o.filter((_, i) => i % 60 === 0).map(x => x.qMit.toFixed(0)).join(' '));
