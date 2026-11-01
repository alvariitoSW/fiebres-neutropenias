// Lista los test de un archivo de Mayéutica cuya opción buena es la más larga o la más corta.
// Uso: node autonomo/bloques/b4/herramientas/largo-opciones.mjs js/data/mayeutica/b4a-gasometria-1.js
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const mod = await import(pathToFileURL(resolve(process.argv[2])));
const largo = s => s.replace(/<[^>]+>/g, '').length;
for (const [ficha, d] of Object.entries(Object.values(mod)[0])) {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test');
  let L = 0, C = 0; const ls = [];
  for (const q of qs) {
    const ls2 = q.opciones.map(o => largo(o.t)), i = q.opciones.findIndex(o => o.ok), m = Math.max(...ls2), n = Math.min(...ls2);
    const esL = ls2[i] === m, esC = ls2[i] === n; if (esL) { L++; ls.push(`${q.id}: ${ls2.join('/')} (buena ${i})`); } if (esC) C++;
  }
  console.log(`${ficha}: ${qs.length} tests · más larga ${L} · más corta ${C}`); ls.forEach(x => console.log('  ' + x));
}
