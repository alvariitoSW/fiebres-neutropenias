// Forma de los test de G4 (fichas 7 y 8): la buena más larga / más corta, posición de la buena y palabras vetadas.
import { MAYEUTICA_OXIGENO as M } from '../../../../js/data/mayeutica/b3d-oxigeno.js';
const VET = /\b(nunca|siempre|cualquier|todos|todas|sin más|irrelevante)\b/i;
for (const [ficha, d] of Object.entries(M)) {
  const tests = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(s => s.pregunta))].filter(q => q.tipo === 'test');
  let larga = 0, corta = 0; const pos = [0, 0, 0];
  for (const q of tests) {
    const L = q.opciones.map(o => o.t.length), i = q.opciones.findIndex(o => o.ok);
    if (L[i] === Math.max(...L) && L.filter(x => x === L[i]).length === 1) larga++;
    if (L[i] === Math.min(...L) && L.filter(x => x === L[i]).length === 1) corta++;
    pos[i]++; if (q.opciones.some(o => VET.test(o.t))) console.log('VETADA', q.id);
    console.log(q.id, L.join('/'), 'ok#' + i);
  }
  const todas = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(s => s.pregunta))];
  console.log(ficha, 'preguntas', todas.length, 'tests', tests.length, 'buena MÁS LARGA', larga, 'MÁS CORTA', corta, 'pos', pos.join(','));
}
