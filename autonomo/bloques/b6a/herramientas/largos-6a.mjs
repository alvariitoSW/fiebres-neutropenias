// Ayuda del constructor 6A: por cada test, longitudes de las opciones, si la buena es la más larga y su posición tras barajar.
const { MAYEUTICA_6A } = await import(new URL('../../../../js/data/mayeutica/b6a-despierto.js', import.meta.url));
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const largo = t => t.replace(/<[^>]+>/g, '').length;
let tot = 0, L = 0, C = 0; const pos = {};
for (const [f, d] of Object.entries(MAYEUTICA_6A)) for (const q of [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))]) {
  if (q.tipo !== 'test') { if (q.opciones) console.log(q.id); continue; }
  const ls = q.opciones.map(o => largo(o.t)), b = q.opciones.findIndex(o => o.ok), max = Math.max(...ls), min = Math.min(...ls);
  const p = barajar(q.opciones, q.id).findIndex(o => o.ok); pos[p] = (pos[p] || 0) + 1; tot++;
  if (ls[b] === max) L++; if (ls[b] === min) C++;
  console.log(q.id.padEnd(9), ls.join('/').padEnd(12), 'ok', b, ls[b] === max ? 'LARGA' : ls[b] === min ? 'corta' : '', 'pos', p, q.opciones.filter(o => !o.ok && !(o.porque && o.porque.length > 40)).length ? 'PORQUE-CORTO' : '');
}
console.log({ tot, larga: L, corta: C, pos });
