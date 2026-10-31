// Doble disparo con flujo alto: para cada (flujo, vt, pmus, tin) cuenta esfuerzos, tipo, Vt entregado, valle frente a Ti/2 y los dos picos de la Paw.
// Uso: node autonomo/bloques/b3/herramientas/doble-flujo.mjs
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
for (const flujo of [60, 80, 100]) for (const vt of [300, 350]) for (const pmus of [12, 14]) for (const tin of [1.4, 1.8, 2.2]) {
  const P = crearPulmon({ modo: 'vcv', vt, fr: 12, peep: 5, flujo, pmax: 60, pmus, tin, frNeural: 12 }, { c: 60, r: 8 });
  const paw = []; for (let i = 0; i < 40 / 0.005; i++) { P.paso(0.005); paw.push(P.paw); }
  const ef = P.esfuerzos.slice(2); const d = ef.filter(e => e.tipo === "doble");
  const y = paw.slice(-1000); let pk = [], dir = 0;
  for (let i = 1; i < y.length - 1; i++) if (y[i] > 8 && y[i] >= y[i - 1] && y[i] > y[i + 1]) pk.push([i, y[i]]);
  const tp = {}; for (const e of ef) tp[e.tipo] = (tp[e.tipo] || 0) + 1; const e0 = ef.find(e => e.tipo === 'doble') || ef[0];
  console.log(JSON.stringify(tp), e0 && `vt ${Math.round(e0.vt)} valle ${e0.valle?.toFixed?.(2)} ti/2 ${(e0.ti / 2).toFixed(2)}`, `flujo ${flujo} vt ${vt} pmus ${pmus} tin ${tin}: picos>8 ${pk.length} ${pk.slice(0, 4).map(a => (a[0] * 5 / 1000).toFixed(2) + 's/' + a[1].toFixed(1)).join(' ')} · min ${Math.min(...y).toFixed(1)} · dobles ${d.length}/${ef.length} vt ${d[0] ? Math.round(d[0].vt) : "-"} valle ${d[0] ? d[0].valle.toFixed(2) : "-"} ti/2 ${d[0] ? (d[0].ti / 2).toFixed(2) : "-"}`);
}
