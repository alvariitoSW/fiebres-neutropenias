// Forma de las preguntas de las fichas de IC aguda (b3b-ic.js): cuántas veces la buena es la más larga / la más corta.
const { MAYEUTICA_IC } = await import('../../../../js/data/mayeutica/b3b-ic.js');
const sin = t => String(t || '').replace(/<[^>]*>/g, '');
const por = {};
for (const [ficha, d] of Object.entries(MAYEUTICA_IC)) {
  const qs = [...d.guia, ...d.examen, ...(d.casos || []).flatMap(c => c.pasos.map(p => p.pregunta))];
  const tests = qs.filter(q => q.tipo === 'test');
  let larga = 0, corta = 0; const largas = [], cortas = [];
  for (const q of tests) {
    const l = q.opciones.map(o => sin(o.t).length), b = sin(q.opciones.find(o => o.ok).t).length;
    if (b === Math.max(...l)) { larga++; largas.push(q.id); }
    if (b === Math.min(...l)) { corta++; cortas.push(q.id); }
  }
  console.log(ficha, { preguntas: qs.length, guia: d.guia.length, examen: d.examen.length, tests: tests.length, larga, corta, largas: largas.join(' '), cortas: cortas.join(' ') });
}
