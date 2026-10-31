// Doble disparo con Ti 0,6 s (flujo = Vt/10): tipo de los esfuerzos, Vt, valle frente a Ti/2 y los dos picos de la Paw primeros de un esfuerzo. Uso: node …/doble-tipos2.mjs
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
for (const [c, r] of [[40, 8], [30, 8], [40, 14], [30, 14], [40, 20]]) for (const vt of [300]) for (const pmus of [12, 14]) for (const tin of [1.8, 2.2]) {
  const P = crearPulmon({ modo: 'vcv', vt, fr: 12, peep: 5, flujo: 30, pmax: 60, pmus, tin, frNeural: 12 }, { c, r });
  const y = []; for (let i = 0; i < 40 / 0.005; i++) { P.paso(0.005); y.push(P.paw); }
  const ef = P.esfuerzos.slice(2), tp = {}; for (const e of ef) tp[e.tipo] = (tp[e.tipo] || 0) + 1; const e = ef.find(x => x.tipo === 'doble');
  const w = y.slice(-1000), pk = []; for (let i = 1; i < w.length - 1; i++) if (w[i] > 8 && w[i] >= w[i - 1] && w[i] > w[i + 1]) pk.push(w[i].toFixed(1));
  console.log(`C ${c} R ${r} vt ${vt} pmus ${pmus} tin ${tin}`, JSON.stringify(tp), `vt ${e ? Math.round(e.vt) : "-"} picos ${pk.join('/')} min ${Math.min(...w).toFixed(1)}`);
}
