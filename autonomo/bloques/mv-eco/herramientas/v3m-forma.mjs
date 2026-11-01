// v3m · forma de pVD−pAD en la ventana del chorro, en 12 tramos (máx. de cada tramo, ÷ máx.), y la de pVD y pAD
//   node v3m-forma.mjs normal - '{"normal":{...}}'
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { medir } from './m1-chorro.mjs';
const [k = 'normal', g, aj] = process.argv.slice(2);
const m = crearMotor(); m.correr(12); if (k !== 'normal') ESCENARIOS[k].aplicar(m, +g);
Object.assign(m.p, aj ? JSON.parse(aj) : {}); if (aj && JSON.parse(aj).adEes) { m.p.ad.ees *= JSON.parse(aj).adEes; delete m.p.adEes; }
m.correr(ASENTAR_FORMA); m.correr(5);
let ab = [], cur = []; for (const s of m.onda) { if (s.pvd > s.pad) cur.push(s); else { if (cur.length > ab.length) ab = cur; cur = []; } } if (cur.length > ab.length) ab = cur;
const n = 12, b = Array.from({ length: n }, (_, i) => ab.slice(Math.floor(i * ab.length / n), Math.floor((i + 1) * ab.length / n)));
const f = (fn) => b.map(x => Math.max(...x.map(fn)).toFixed(1).padStart(5)).join('');
console.log('d  ', f(s => s.pvd - s.pad)); console.log('pvd', f(s => s.pvd)); console.log('pad', f(s => s.pad)); console.log('pap', f(s => s.pap)); console.log('qP ', f(s => s.qPul / 10));
