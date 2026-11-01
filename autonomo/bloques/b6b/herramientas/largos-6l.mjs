// Muestra, por pregunta test de b6b-apendices.js, el largo de cada opción y si la buena es la más corta/larga.
const { MAYEUTICA_APENDICES: M } = await import(new URL('../../../../js/data/mayeutica/b6b-apendices.js', import.meta.url));
const l = s => s.replace(/<[^>]+>/g, '').length;
for (const [f, d] of Object.entries(M)) for (const q of [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))]) {
  if (q.tipo !== 'test') continue;
  const ls = q.opciones.map(o => l(o.t)), i = q.opciones.findIndex(o => o.ok), b = ls[i];
  console.log(q.id.padEnd(14), ls.join(' '), 'buena', i, b === Math.min(...ls) ? 'CORTA' : '', b === Math.max(...ls) ? 'LARGA' : '');
}
