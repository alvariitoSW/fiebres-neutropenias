// Forma por ficha (buena más larga / más corta / posición) de craneo-1 y craneo-2.
import { MAYEUTICA_CRANEO_1 as A } from '../../../../js/data/mayeutica/b6a-craneo-1.js';
import { MAYEUTICA_CRANEO_2 as B } from '../../../../js/data/mayeutica/b6a-craneo-2.js';
import { barajar } from '../../../../js/core/mayeutica-motor.js';
for (const [k, f] of Object.entries({ ...A, ...B })) {
  const qs = [...f.guia, ...f.examen, ...f.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test');
  let l = 0, c = 0; const C = []; const pos = [0, 0, 0, 0], L = [];
  for (const q of qs) { const o = barajar(q.opciones, q.id); const n = o.map(x => x.t.length); const i = o.findIndex(x => x.ok); pos[i]++;
    if (n[i] === Math.max(...n)) { l++; L.push(q.id); } if (n[i] === Math.min(...n)) { c++; C.push(q.id); } }
  console.log(`${k}: tests ${qs.length}; larga ${l} (máx ${Math.floor(qs.length / 3)}) ${L.join(',')}; corta ${c} ${C.join(",")}; pos ${pos}`);
}
