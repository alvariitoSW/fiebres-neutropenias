// Barrido de (pmus, tin, vt, flujo) del doble disparo: picos de Paw con prominencia ≥3 por esfuerzo y su valle (cmH₂O). Uso: node …/doble-barrido.mjs
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
for (const vt of [400, 450, 500]) for (const flujo of [40, 50]) for (const pmus of [8, 10, 12, 14]) for (const tin of [1.6, 2.2]) {
  const resp = { ps: 10, frEsp: 16, retraso: null, peep: 5, pinsp: 10, ie: 2, pmax: 40, modo: 'vcv', vt, fr: 12, flujo, pmus, tin, frNeural: 12 };
  const P = crearPulmon(resp, { c: 60, r: 8, rEsp: 8, racimo: 'sano' }, {});
  for (let i = 0; i < 6000; i++) P.paso(0.005);
  const y = []; for (let i = 0; i < 4000; i++) { P.paso(0.005); y.push(P.paw); }
  // picos: máximos locales con caída posterior ≥3 y subida previa ≥3
  const pk = []; for (let i = 5; i < y.length - 5; i++) if (y[i] >= y[i - 1] && y[i] > y[i + 1] && y[i] > resp.peep + 4) { const mn = Math.min(...y.slice(Math.max(0, i - 40), i)); if (y[i] - mn >= 3) pk.push(i); }
  const ef = P.efectos ?? null;
  const val = pk.length >= 2 ? Math.min(...y.slice(pk[0], pk[1])) : null;
  console.log(`vt ${vt} q ${flujo} pmus ${pmus} tin ${tin}: picos ${pk.length} alt ${pk.map((i) => y[i].toFixed(0)).join('/')} valle ${val == null ? '—' : val.toFixed(1)}`);
}
