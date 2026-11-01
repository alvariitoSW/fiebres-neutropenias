// Largo de cada opción de los tests de b6b-higado.js y recuento de «la buena es la más larga / más corta» y de su posición.
const { MAYEUTICA_HIGADO: M } = await import(new URL('../../../../js/data/mayeutica/b6b-higado.js', import.meta.url));
const l = s => s.replace(/<[^>]+>/g, '').length;
let n = 0, lg = 0, co = 0; const pos = {};
for (const [f, d] of Object.entries(M)) for (const q of [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))]) {
  if (q.tipo !== 'test') continue;
  const ls = q.opciones.map(o => l(o.t)), i = q.opciones.findIndex(o => o.ok), b = ls[i];
  n++; pos[i] = (pos[i] || 0) + 1;
  const L = b === Math.max(...ls) && ls.filter(x => x === b).length === 1, C = b === Math.min(...ls) && ls.filter(x => x === b).length === 1;
  lg += L; co += C; if (process.argv[2]) console.log(q.id.padEnd(14), ls.join(' '), 'buena', i, C ? 'CORTA' : '', L ? 'LARGA' : '');
}
console.log({ tests: n, masLarga: lg, masCorta: co, limite: Math.floor(n / 3), posiciones: pos });
