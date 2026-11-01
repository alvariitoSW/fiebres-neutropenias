// Cuenta, por ficha, los test cuya opción buena es la más larga (tope: un tercio).
import * as M2 from '../../../../js/data/mayeutica/b3d-oxigeno-2.js';
const todo = Object.values(M2).find(v => v && typeof v === "object");
const strip = s => s.replace(/<[^>]+>/g, '');
for (const [k, f] of Object.entries(todo)) {
  const qs = [...(f.guia || []), ...(f.examen || []), ...(f.casos || []).flatMap(c => c.pasos.map(p => p.pregunta).filter(Boolean))].filter(q => q.opciones);
  const cortas = [], largas = [], pos = [0, 0, 0];
  for (const q of qs) {
    const L = q.opciones.map(o => strip(o.t).length), i = q.opciones.findIndex(o => o.ok);
    if (L[i] < Math.min(...L.filter((_, j) => j !== i))) cortas.push(q.id + ":" + L.join("/"));
    if (L[i] > Math.max(...L.filter((_, j) => j !== i))) largas.push(q.id + '(+' + (L[i] - Math.max(...L.filter((_, j) => j !== i)) + ')'));
  }
  console.log(k, 'tests', qs.length, 'buena más larga', largas.length, largas.join(" "), "| buena más corta", cortas.length, cortas.join(" "));
}
