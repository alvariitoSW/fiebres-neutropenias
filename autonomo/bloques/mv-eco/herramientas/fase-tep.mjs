// P1: fases y volumen del VI en un latido del TEP (diagnóstico de la fusión E-A)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
const g = Number(process.argv[2] ?? 0.95);
const m = crearMotor(); m.correr(12); ESCENARIOS.tep.aplicar(m, g); m.correr(ESCENARIOS.tep.forma ? ASENTAR_FORMA : 40);
const o = m.onda; let prev = '';
for (let i = 0; i < o.length; i += 1) { if (o[i].fase !== prev || i % 25 === 0) console.log(i, o[i].fase, o[i].t.toFixed(3), 'vvi', o[i].vvi.toFixed(1), 'pai', o[i].pai.toFixed(1), 'pvi', o[i].pvi.toFixed(1), 'mit', o[i].vMit ? 1 : 0); prev = o[i].fase; }
console.log('tMitAbre', m.ultimo.tMitAbre, 'tS2', m.ultimo.tS2, 'T', m.ultimo.periodo);
