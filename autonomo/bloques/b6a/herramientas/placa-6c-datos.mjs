// Comprueba los datos de 6C: ids únicos en js/, fuentes y profundizar existen en la ficha, y el reparto de opciones (REGLAS §8).
import fs from 'fs';
import { execSync } from 'child_process';
import { MAYEUTICA_B6A_PLACA as M } from '../../../../js/data/mayeutica/b6a-placa.js';
const html = fs.readFileSync('js/modules/libros/marino-neuro.html', 'utf8');
const existe = id => html.includes(`id="${id}"`);
const pregs = []; let mal = 0;
for (const [ficha, d] of Object.entries(M)) {
  for (const q of [...d.guia, ...d.examen]) pregs.push({ ficha, q });
  for (const c of d.casos) for (const p of c.pasos) pregs.push({ ficha, q: p.pregunta });
  d.profundizar.forEach(p => { if (!existe(p.id)) { console.log('profundizar sin id', p.id); mal++; } });
}
const ids = new Set();
for (const { q } of pregs) {
  if (ids.has(q.id)) { console.log('id repetido', q.id); mal++; } ids.add(q.id);
  for (const f of q.fuente.split('·').map(x => x.trim())) if (!existe(f) && !f.startsWith('mar-img-46')) { console.log('fuente no existe', q.id, f); mal++; }
  const ch = execSync(`grep -rn "id: '${q.id}'" js --include=*.js | grep -v b6a-placa | wc -l`).toString().trim();
  if (ch !== '0') { console.log('choca en js/', q.id); mal++; }
  if (q.tipo === 'test') {
    const L = q.opciones.map(o => o.t.length), ok = q.opciones.findIndex(o => o.ok);
    if (q.opciones.filter(o => o.ok).length !== 1) { console.log('ok != 1', q.id); mal++; }
    q.opciones.forEach(o => { if (!o.ok && !o.porque) { console.log('sin porque', q.id); mal++; } });
    q.__largo = L[ok] === Math.max(...L); q.__corto = L[ok] === Math.min(...L);
  }
  if (q.tipo === 'error') { const n = q.frases.filter(f => f.mal).length; if (n > 2) { console.log('errores >2', q.id); mal++; } }
}
const tests = pregs.map(p => p.q).filter(q => q.tipo === 'test');
console.log('preguntas', pregs.length, 'tests', tests.length, 'correcta más larga', tests.filter(q => q.__largo).length, 'más corta', tests.filter(q => q.__corto).length);
for (const f of Object.keys(M)) { const t = pregs.filter(p => p.ficha === f && p.q.tipo === 'test').map(p => p.q); console.log(f, 'tests', t.length, 'larga', t.filter(q => q.__largo).length, 'corta', t.filter(q => q.__corto).length); }
console.log(mal ? 'FALLOS ' + mal : 'OK');
