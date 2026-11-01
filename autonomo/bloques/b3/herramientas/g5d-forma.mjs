// Forma de los test de G5a (fichas 14 y 15): la buena más larga / más corta, posición y palabras vetadas, y ids repetidos.
import { MAYEUTICA_NAV_2 as M } from '../../../../js/data/mayeutica/b3d-nav-2.js';
const VET = /\b(nunca|siempre|cualquier|todos|todas|sin más|irrelevante|diseño)\b/i;
const ids = new Set(); let L = 0, C = 0, T = 0; const P = [0, 0, 0];
for (const [ficha, d] of Object.entries(M)) {
  const todas = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(s => s.pregunta))];
  const tests = todas.filter(q => q.tipo === 'test'); let larga = 0, corta = 0; const pos = [0, 0, 0];
  for (const q of todas) { if (ids.has(q.id)) console.log('ID REPETIDO', q.id); ids.add(q.id);
    if (q.tipo === 'error') console.log(q.id, 'errores', q.frases.filter(f => f.mal).length); if (q.tipo === 'destapa') console.log(q.id, 'puntos', q.puntos.length); }
  for (const q of tests) {
    const l = q.opciones.map(o => o.t.length), i = q.opciones.findIndex(o => o.ok);
    if (l[i] === Math.max(...l) && l.filter(x => x === l[i]).length === 1) { larga++; console.log('LARGA', q.id, l.join('/')); }
    if (l[i] === Math.min(...l) && l.filter(x => x === l[i]).length === 1) { corta++; console.log('CORTA', q.id, l.join('/')); }
    pos[i]++; if (q.opciones.some(o => VET.test(o.t) || VET.test(o.porque || ''))) console.log('VETADA', q.id);
  }
  console.log(ficha, 'preguntas', todas.length, 'tests', tests.length, 'LARGA', larga, 'CORTA', corta);
}
