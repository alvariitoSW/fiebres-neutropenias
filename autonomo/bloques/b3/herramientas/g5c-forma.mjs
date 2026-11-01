// Forma de los test de G5c (fichas 17 y 18): buena más larga / más corta, posición y palabras vetadas.
import { MAYEUTICA_NAV as M } from '../../../../js/data/mayeutica/b3d-nav.js';
const VET = /\b(nunca|siempre|cualquier|todos|todas|sin más|irrelevante)\b/i;
const ids = new Set();
for (const [ficha, d] of Object.entries(M)) {
  const todas = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(s => s.pregunta))];
  const tests = todas.filter(q => q.tipo === 'test');
  let larga = 0, corta = 0; const pos = [0, 0, 0];
  for (const q of todas) { if (ids.has(q.id)) console.log('ID REPETIDO', q.id); ids.add(q.id); }
  for (const q of tests) {
    const L = q.opciones.map(o => o.t.length), i = q.opciones.findIndex(o => o.ok);
    const esL = L[i] === Math.max(...L) && L.filter(x => x === L[i]).length === 1;
    const esC = L[i] === Math.min(...L) && L.filter(x => x === L[i]).length === 1;
    if (esL) larga++; if (esC) corta++;
    pos[i]++; if (q.opciones.some(o => VET.test(o.t))) console.log('VETADA', q.id);
    console.log(q.id, L.join('/'), 'ok#' + i, esL ? 'LARGA' : '', esC ? 'CORTA' : '');
  }
  console.log(ficha, 'preguntas', todas.length, 'tests', tests.length, 'MÁS LARGA', larga, 'MÁS CORTA', corta, 'pos', pos.join(','));
}
