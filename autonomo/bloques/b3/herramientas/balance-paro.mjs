// Balance de las opciones de los test (REGLAS §8) y estructura de las 3 fichas de la parada. Uso: node balance-paro.mjs
import { MAYEUTICA_B3 } from '../../../../js/data/mayeutica/b3.js';
import fs from 'fs';
const html = fs.readFileSync(new URL('../../../../js/modules/cardiologia/merino-cardiologia.html', import.meta.url), 'utf8');
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
for (const f of ['mc-paro-soporte', 'mc-paro-monitorizacion', 'mc-posresucitacion']) {
  const d = MAYEUTICA_B3[f];
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))];
  const tests = qs.filter(q => q.tipo === 'test');
  let largo = 0, corto = 0; const pos = {};
  for (const q of tests) {
    const L = q.opciones.map(o => o.t.length), k = q.opciones.findIndex(o => o.ok);
    if (L[k] === Math.max(...L)) largo++; if (L[k] === Math.min(...L)) corto++; pos[k] = (pos[k] || 0) + 1;
  }
  const falta = [];
  for (const q of qs) for (const i of (q.fuente || '').split('·').map(s => s.trim())) if (i && !ids.has(i)) falta.push(i);
  for (const t of d.profundizar) if (!ids.has(t.id)) falta.push(t.id);
  for (const c of d.casos) if (!ids.has(c.volver.ancla)) falta.push(c.volver.ancla);
  const idsq = qs.map(q => q.id); const dup = idsq.filter((x, i) => idsq.indexOf(x) !== i);
  console.log(f, { guia: d.guia.length, examen: d.examen.length, pasos: d.casos.map(c => c.pasos.length), tests: tests.length, masLarga: largo, masCorta: corto, posicion: pos, idsQueFaltan: falta, dup });
}
if (process.argv[2] === '-v') for (const f of ['mc-paro-soporte', 'mc-paro-monitorizacion', 'mc-posresucitacion']) {
  const d = MAYEUTICA_B3[f];
  for (const q of [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test')) {
    const L = q.opciones.map(o => o.t.length), k = q.opciones.findIndex(o => o.ok);
    console.log(q.id, 'ok=' + k, L.join('/'), L[k] === Math.max(...L) ? 'LARGA' : '', L[k] === Math.min(...L) ? 'corta' : '');
  }
}
