// Calcula en qué lugar de escritura poner la buena de cada test de la ficha 2 para repartir las posiciones tras barajar.
import * as M from '../../../../js/data/mayeutica/b3d-asma-2.js';
import { barajar } from '../../../../js/core/mayeutica-motor.js';
const d = M.MAYEUTICA_ASMA_AGUDO;
const f = Object.values(d)[0];
const qs = [...f.guia, ...f.examen, ...f.casos.flatMap(c => c.pasos.map(s => s.pregunta))].filter(q => q.tipo === 'test');
const cnt = [0, 0, 0], pat = [];
for (const q of qs) {
  const n = q.opciones.length; let best = null;
  for (let w = 0; w < n; w++) {
    const ops = q.opciones.map(o => ({ ...o, ok: false })); ops[w].ok = true;
    const k = barajar(ops, q.id).findIndex(o => o.ok);
    if (best === null || cnt[k] < cnt[best.k]) best = { w, k };
  }
  cnt[best.k]++; pat.push(best.w);
}
console.log(qs.length, cnt.join(','), JSON.stringify(pat));
