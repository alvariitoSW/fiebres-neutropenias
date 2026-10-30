// Exploración E4a: corre el pulmón con esfuerzo y cuenta las asincronías. node autonomo/pruebas/herramientas-e4a-asinc.mjs
import { crearPulmon } from '../../js/modules/libros/pulmon-vivo/pulmon.mjs';
export function correr(resp, pulmon, seg = 40) {
  const P = crearPulmon({ modo: 'vcv', vt: 400, fr: 12, peep: 5, flujo: 60, pmax: 60, tin: 0.8, frNeural: 20, ...resp }, pulmon);
  const paw = [], q = [], pm = [], disp = [];
  for (let i = 0; i < seg / 0.005; i++) { P.paso(0.005); paw.push(P.paw); q.push(P.flujo); pm.push(P.pmus); disp.push(P.disparo); }
  return { P, paw, q, pm, disp };
}
if (process.argv[1].endsWith('herramientas-e4a-asinc.mjs')) {
  for (const [n, r, pu] of [['ineficaz', { pmus: 3 }, { c: 60, r: 8 }], ['sincro', { pmus: 8 }, { c: 60, r: 8 }], ['doble', { pmus: 12, tin: 2, frNeural: 12, flujo: 30 }, { c: 60, r: 8 }], ['doble10', { pmus: 10, tin: 2, frNeural: 12, flujo: 30 }, { c: 60, r: 8 }], ['inverso', { pmus: 10, tin: 1.0, retraso: 0.3, fr: 14 }, { c: 60, r: 8 }]]) {
    const { P } = correr(r, pu);
    console.log(n, P.esfuerzos.slice(2).map((e) => `${e.tipo} vt${Math.round(e.vt)} valle${e.valle?.toFixed(2)} n${e.disparos}`).join(' | '));
  }
}
