// Comprueba b3d-respirador.js: ids de «fuente» presentes en la ficha, longitud de la correcta en los tests y nº de errores.
import { readFileSync } from 'node:fs';
import { MAYEUTICA_RESPIRADOR as M } from '../../../../js/data/mayeutica/b3d-respirador.js';
const html = readFileSync('js/modules/neumologia/merino-neumologia.html', 'utf8');
const txt = s => s.replace(/<[^>]+>/g, '');
let malos = 0;
for (const [ficha, d] of Object.entries(M)) {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))];
  const tests = qs.filter(q => q.tipo === 'test');
  for (const q of qs) for (const id of (q.fuente || '').split('·').map(s => s.trim()).filter(Boolean)) if (!html.includes(`id="${id}"`)) { console.log('FALTA id', id, q.id); malos++; }
  for (const q of qs) if (q.tipo === 'error') { const n = q.frases.filter(f => f.mal).length; if (n > 2) { console.log('errores>2', q.id); malos++; } }
  for (const x of [...d.profundizar]) if (!html.includes(`id="${x.id}"`)) { console.log('FALTA profundizar', x.id); malos++; }
  let larga = 0, corta = 0; const pos = [0, 0, 0];
  for (const q of tests) { const L = q.opciones.map(o => txt(o.t).length), k = q.opciones.findIndex(o => o.ok); if (L[k] === Math.max(...L)) larga++; if (L[k] === Math.min(...L)) corta++; pos[k]++; }
  console.log(ficha, 'tests', tests.length, 'correcta más larga', larga, 'más corta', corta, 'posiciones escritas', pos.join('/'), '| tipos', ['test', 'destapa', 'error'].map(t => t + ':' + qs.filter(q => q.tipo === t).length).join(' '));
  for (const q of tests) if (q.opciones.filter(o => o.ok).length !== 1 || q.opciones.some(o => !o.ok && !o.porque)) { console.log('opción mal', q.id); malos++; }
  if (/&lt;|&gt;/.test(JSON.stringify(d))) { console.log('&lt; en banco'); malos++; }
}
process.exit(malos ? 1 : 0);
