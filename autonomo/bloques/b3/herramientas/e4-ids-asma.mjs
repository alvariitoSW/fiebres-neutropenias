// Comprueba que todo id citado en b3d-asma*.js (fuente, Ver en la ficha, profundizar, volver) existe en la ficha. Uso: node e4-ids-asma.mjs
import fs from 'fs';
const html = fs.readFileSync('js/modules/neumologia/merino-neumologia.html', 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
const dup = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]).filter((x, i, a) => a.indexOf(x) !== i);
let mal = 0;
for (const f of ['js/data/mayeutica/b3d-asma.js', 'js/data/mayeutica/b3d-asma-2.js']) {
  const s = fs.readFileSync(f, 'utf8'), usados = new Set();
  for (const m of s.matchAll(/fuente: '([^']+)'/g)) m[1].split(' · ').forEach(x => usados.add(x.trim()));
  for (const m of s.matchAll(/(?:enFicha\((?:\w+, )?|data-resaltar="#)'?([a-z0-9-]+)'?\)?/g)) if (/^(nep|neumo)-/.test(m[1])) usados.add(m[1]);
  for (const m of s.matchAll(/\{ id: '(nep-[^']+|neumo-[^']+)'/g)) usados.add(m[1]);
  for (const m of s.matchAll(/ancla: '([^']+)'/g)) usados.add(m[1]);
  for (const u of usados) if (!ids.has(u)) { console.log('FALTA', f, u); mal++; }
}
console.log(mal ? '❌ ids que faltan: ' + mal : '✅ todos los ids citados existen', '· duplicados en el html:', dup.length);
