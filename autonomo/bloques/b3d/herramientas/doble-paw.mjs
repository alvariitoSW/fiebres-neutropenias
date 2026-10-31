// Doble disparo: traza de la Paw (cada 0,1 s) del estado doble-disparo. Uso: node autonomo/bloques/b3d/herramientas/doble-paw.mjs [pmus] [tin]
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
const a = process.argv.slice(2).map(Number);
const resp = { ps: 10, frEsp: 16, tin: 0.8, retraso: null, peep: 5, pinsp: 10, ie: 2, pmax: 40, modo: 'vcv', vt: a[2] ?? 300, fr: 12, flujo: a[3] ?? 30, pmus: a[0] ?? 14, tin: a[1] ?? 2.2, frNeural: 12 };
const P = crearPulmon(resp, { c: 60, r: 8, rEsp: 8, racimo: 'sano' }, {});
for (let i = 0; i < 6000; i++) P.paso(0.005);
const tr = []; for (let i = 0; i < 1400; i++) { P.paso(0.005); if (i % 5 === 0) tr.push(Math.round(P.paw * 10) / 10); }
console.log(tr.join(' '));
