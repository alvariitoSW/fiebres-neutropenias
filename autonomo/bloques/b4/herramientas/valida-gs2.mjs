// Valida b4a-gasometria-2.js: ids de fuente existentes en la ficha, ids únicos y posiciones/longitud de las correctas.
import { readFileSync } from 'fs';
import { MAYEUTICA_GASOMETRIA_2 as M } from '../../../../js/data/mayeutica/b4a-gasometria-2.js';
const html = readFileSync(new URL('../../../../js/modules/libros/marino-renal.html', import.meta.url), 'utf8');
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
const vistos = new Set(); let mal = 0, tests = 0, larga = 0, corta = 0; const pos = [0, 0, 0, 0];
const chk = (q, f) => {
  if (vistos.has(q.id)) { console.log('ID DUP', q.id); mal++; } vistos.add(q.id);
  for (const s of (q.fuente || '').split('·').map(x => x.trim()).filter(Boolean)) if (!ids.has(s)) { console.log('FUENTE?', q.id, s); mal++; }
  if (q.tipo === 'test') {
    tests++; const L = q.opciones.map(o => o.t.length), i = q.opciones.findIndex(o => o.ok);
    if (L[i] === Math.max(...L)) larga++; if (L[i] === Math.min(...L)) corta++;
    q.opciones.forEach(o => { if (!o.ok && !o.porque) { console.log('SIN PORQUE', q.id); mal++; } });
  }
  if (q.tipo === 'error') { const n = q.frases.filter(f => f.mal).length; if (n > 2) { console.log('ERRORES', q.id, n); mal++; } }
};
for (const [k, f] of Object.entries(M)) {
  console.log(k, 'guía', f.guia.length, 'examen', f.examen.length, 'casos', f.casos.map(c => c.pasos.length));
  f.guia.concat(f.examen).forEach(q => chk(q, f));
  f.casos.forEach(c => c.pasos.forEach(p => chk(p.pregunta, f)));
  f.profundizar.forEach(p => { if (!ids.has(p.id)) { console.log('PROF?', p.id); mal++; } });
  f.casos.forEach(c => { if (!ids.has(c.volver.ancla)) { console.log('ANCLA?', c.volver.ancla); mal++; } });
}
console.log('tests', tests, 'correcta más larga', larga, 'más corta', corta, 'problemas', mal);
