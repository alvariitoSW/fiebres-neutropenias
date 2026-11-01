// Comprueba el equilibrio de las preguntas del 6H: ids únicos, ids de la ficha existentes, la correcta (más larga/corta) y su posición.
import { MAYEUTICA_EJE } from '../../../../js/data/mayeutica/b6b-eje.js';
import fs from 'node:fs';
const html = fs.readFileSync('js/modules/libros/marino-nutricion.html', 'utf8');
const ids = new Set(), tests = [];
for (const [f, d] of Object.entries(MAYEUTICA_EJE)) {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))];
  for (const q of qs) {
    if (ids.has(q.id)) console.log('ID REPETIDO', q.id); ids.add(q.id);
    for (const t of (q.fuente || '').split(' · ')) if (!html.includes(`id="${t.trim()}"`)) console.log('SIN ID EN LA FICHA', q.id, t);
    if (q.tipo === 'test') { const L = q.opciones.map(o => o.t.length), ok = q.opciones.findIndex(o => o.ok);
      tests.push({ f, id: q.id, mas: L[ok] === Math.max(...L), menos: L[ok] === Math.min(...L), pos: ok, L }); }
  }
  for (const p of d.profundizar) if (!html.includes(`id="${p.id}"`)) console.log('PROF SIN ID', p.id);
}
for (const f of Object.keys(MAYEUTICA_EJE)) { const t = tests.filter(x => x.f === f), n = t.length;
  console.log(f, 'tests', n, 'más larga', t.filter(x => x.mas).length, 'más corta', t.filter(x => x.menos).length, 'pos', [0,1,2].map(k => t.filter(x => x.pos === k).length)); }
const n = tests.length; console.log('TOTAL', n, 'larga', tests.filter(x => x.mas).length, 'corta', tests.filter(x => x.menos).length);
for (const x of tests.filter(x => x.mas)) console.log(' larga:', x.id, x.L.join('/'));
