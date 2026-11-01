// Forma de la Mayéutica del 4C: reparto de la correcta (más larga / más corta / posición), ids únicos y ids de `fuente` y `ancla` que existen en la ficha.
import { readFileSync } from 'fs';
import { MAYEUTICA_B4C } from '../../../../js/data/mayeutica/b4c-agua.js';
const html = readFileSync(new URL('../../../../js/modules/libros/marino-renal.html', import.meta.url), 'utf8');
const tests = [], ids = [], malos = [];
const ver = (q, donde) => {
  ids.push(q.id);
  String(q.fuente || '').split('·').map(s => s.trim()).filter(Boolean).forEach(f => { if (!html.includes(`id="${f}"`)) malos.push(`${q.id}: fuente ${f}`); });
  if (q.tipo === 'test') tests.push(q);
  if (q.tipo === 'error') { const n = q.frases.filter(f => f.mal).length; if (n > 2) malos.push(`${q.id}: ${n} errores`); }
  if (q.tipo === 'test') q.opciones.forEach(o => { if (!o.ok && !o.porque) malos.push(`${q.id}: opción sin porque`); });
};
for (const [f, d] of Object.entries(MAYEUTICA_B4C)) {
  [...d.guia, ...d.examen].forEach(q => ver(q, f));
  d.casos.forEach(c => { if (c.pasos.length < 5 || c.pasos.length > 8) malos.push(`${c.id}: ${c.pasos.length} pasos`); c.pasos.forEach(p => ver(p.pregunta, c.id)); if (!html.includes(`id="${c.volver.ancla}"`)) malos.push(`${c.id}: ancla`); });
  (d.profundizar || []).forEach(x => { if (!html.includes(`id="${x.id}"`)) malos.push(`profundizar ${x.id}`); });
}
if (new Set(ids).size !== ids.length) malos.push('ids repetidos');
const largo = tests.filter(q => { const l = q.opciones.map(o => o.t.length); return q.opciones.find(o => o.ok).t.length === Math.max(...l); }).length;
const corto = tests.filter(q => { const l = q.opciones.map(o => o.t.length); return q.opciones.find(o => o.ok).t.length === Math.min(...l); }).length;
console.log(`tests ${tests.length}: la buena más larga ${largo}, más corta ${corto}`, malos.length ? malos : 'sin fallos');
