import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
const [vt, fr, flujo, pm, tin, ret] = process.argv.slice(2).map(Number);
const P = crearPulmon({ modo: 'vcv', vt, fr, peep: 5, flujo, pmax: 40, pmus: pm, tin, frNeural: 20, retraso: ret }, { c: 60, r: 8 });
for (let i = 0; i < 40 / 0.005; i++) P.paso(0.005);
console.log(P.esfuerzos.slice(-4).map((e) => JSON.stringify(e)).join('\n'), '\nlect', JSON.stringify({ vtExh: P.lectura()?.vtExh, pico: P.lectura()?.pico }));
