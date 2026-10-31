// Doble disparo con vt 300 / flujo 30 fijos: altura del 1.er pico, valle y 2.º pico de la Paw según pmus y tin. Uso: node …/doble-barrido2.mjs
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
for (const pmus of [9, 10, 11, 12, 13, 14, 15]) for (const tin of [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.6]) {
  const resp = { ps: 10, frEsp: 16, retraso: null, peep: 5, pinsp: 10, ie: 2, pmax: 40, modo: 'vcv', vt: 300, fr: 12, flujo: 30, pmus, tin, frNeural: 12 };
  const P = crearPulmon(resp, { c: 60, r: 8, rEsp: 8, racimo: 'sano' }, {});
  for (let i = 0; i < 6000; i++) P.paso(0.005);
  const y = []; for (let i = 0; i < 1000; i++) { P.paso(0.005); y.push(P.paw); }
  let i0 = 1; while (i0 < y.length && !(y[i0] - y[i0 - 1] > 0.5)) i0++;     // primer salto: el 1.er disparo
  const seg = (a, b) => y.slice(i0 + a, i0 + b);
  const p1 = Math.max(...seg(0, 110)), v = Math.min(...seg(110, 260)), p2 = Math.max(...seg(200, 480));
  console.log(`pmus ${pmus} tin ${tin}: pico1 ${p1.toFixed(1)} valle ${v.toFixed(1)} pico2 ${p2.toFixed(1)}  ${p1 - v >= 4 && p2 - v >= 4 ? '<== DOS PICOS' : ''}`);
}
