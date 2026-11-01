// Uso: node autonomo/bloques/b5/herramientas/longitudes-abdomen-2.mjs
// Reparto de longitudes de la opción buena por ficha (guía + examen + casos) en b5-abdomen-2.js.
import { MAYEUTICA_ABDOMEN_2 as M } from '../../../../js/data/mayeutica/b5-abdomen-2.js';
const sin = s => s.replace(/<[^>]+>/g, '');
for (const [k, f] of Object.entries(M)) {
  const qs = [...f.guia, ...f.examen, ...f.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test');
  let la = 0, co = 0; const lis = [];
  for (const q of qs) { const L = q.opciones.map(o => sin(o.t).length), b = q.opciones.findIndex(o => o.ok);
    const mx = L[b] === Math.max(...L), mn = L[b] === Math.min(...L); if (mx) { la++; lis.push('L:' + q.id); } if (mn) { co++; lis.push('C:' + q.id); } }
  console.log(k, 'tests', qs.length, 'máx', Math.floor(qs.length / 3), 'más larga', la, 'más corta', co, lis.join(' '));
}
