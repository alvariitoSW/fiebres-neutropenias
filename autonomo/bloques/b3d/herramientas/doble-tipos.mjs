// Tipo de cada esfuerzo (doble / sincrónico…) y valle, para pmus y tin. Uso: node …/doble-tipos.mjs
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
for (const pmus of [9, 10, 11, 12, 13, 14]) for (const tin of [1.6, 1.8, 2.0, 2.2, 2.6]) {
  const P = crearPulmon({ ps: 10, frEsp: 16, retraso: null, peep: 5, pinsp: 10, ie: 2, pmax: 40, modo: 'vcv', vt: 300, fr: 12, flujo: 30, pmus, tin, frNeural: 12 }, { c: +(process.env.C ?? 60), r: +(process.env.R ?? 8), rEsp: +(process.env.R ?? 8), racimo: 'sano' }, {});
  let marcas = 0; for (let i = 0; i < 40 / 0.005; i++) { P.paso(0.005); if (P.disparo) marcas++; }
  const ef = P.esfuerzos.slice(2); console.log(`pmus ${pmus} tin ${tin}: ${[...new Set(ef.map((e) => e.tipo))]} valle ${ef[0]?.valle?.toFixed(2)} vt ${Math.round(ef[0]?.vt)}`);
}
