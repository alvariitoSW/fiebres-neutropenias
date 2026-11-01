// Lista los tests de un archivo de Mayéutica donde la opción buena es la más larga (uso: node largas-b4-rinon.mjs b4-rinon-2.js [ficha])
const m = await import(new URL('../../../../js/data/mayeutica/' + process.argv[2], import.meta.url));
const largo = s => s.replace(/<[^>]+>/g, '').length;
for (const [fid, d] of Object.entries(Object.values(m)[0])) {
  if (process.argv[3] && fid !== process.argv[3]) continue;
  for (const q of [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test')) {
    const ls = q.opciones.map(o => largo(o.t)), ok = largo(q.opciones.find(o => o.ok).t);
    if (ok === Math.max(...ls)) console.log(fid, q.id, ls.join('/'), 'ok=' + ok);
  }
}
