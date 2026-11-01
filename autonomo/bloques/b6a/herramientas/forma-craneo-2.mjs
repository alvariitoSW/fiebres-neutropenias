// Forma de las preguntas SOLO de b6a-craneo-2 (mismo criterio que jueces-forma): larga/corta/posición tras barajar.
import { MAYEUTICA_CRANEO_2 as M } from '../../../../js/data/mayeutica/b6a-craneo-2.js';
import { barajar } from '../../../../js/core/mayeutica-motor.js';
const qs = [];
for (const f of Object.values(M)) { for (const q of [...f.guia, ...f.examen, ...f.casos.flatMap(c => c.pasos.map(p => p.pregunta))]) if (q.tipo === 'test') qs.push(q); }
let larga = 0, corta = 0; const pos = [0, 0, 0]; const det = [];
for (const q of qs) {
  const o = barajar(q.opciones, q.id); const L = o.map(x => x.t.length);
  const i = o.findIndex(x => x.ok); pos[i]++;
  const mx = Math.max(...L), mn = Math.min(...L);
  const esL = L[i] === mx, esC = L[i] === mn; if (esL) larga++; if (esC) corta++;
  det.push(`${q.id}:${esL ? 'L' : esC ? 'C' : '-'}${i + 1}`);
}
console.log(`tests ${qs.length}; larga ${larga} (máx ${Math.floor(qs.length / 3)}); corta ${corta}; pos ${pos}`); console.log(det.join(' '));
