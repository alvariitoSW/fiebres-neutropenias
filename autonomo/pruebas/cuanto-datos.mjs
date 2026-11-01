// Comprobación de los datos de js/data/mayeutica/b6b-cuanto.js (REGLAS §8): estructura, ids únicos, posiciones y longitudes.
import { MAYEUTICA_CUANTO as M } from '../../js/data/mayeutica/b6b-cuanto.js';
const largo = s => s.replace(/<[^>]+>/g, '').length; const m = []; const vistos = new Set();
let n = 0, larga = 0, corta = 0; const pos = {};
for (const [f, d] of Object.entries(M)) {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))];
  for (const q of qs) {
    if (vistos.has(q.id)) m.push('repetido ' + q.id); vistos.add(q.id);
    if (q.tipo === 'test') { const ls = q.opciones.map(o => largo(o.t)), i = q.opciones.findIndex(o => o.ok), ok = ls[i];
      n++; if (ok === Math.max(...ls)) larga++; if (ok === Math.min(...ls)) corta++; pos[i] = (pos[i] || 0) + 1;
      if (q.opciones.filter(o => o.ok).length !== 1) m.push(q.id + ' buenas');
      if (q.opciones.some(o => !o.ok && !(o.porque && o.porque.length > 40))) m.push(q.id + ' porque corto'); }
    if (q.tipo === 'error') { const e = q.frases.filter(x => x.mal).length; if (e > 2 || q.frases.length < 4 || q.frases.length > 6 || q.frases.some(x => x.mal && !x.c)) m.push(q.id + ' error'); }
    if (q.tipo === 'destapa' && (q.puntos.length < 2 || q.puntos.length > 4)) m.push(q.id + ' destapa');
  }
  for (const c of d.casos) { if (c.pasos.length < 5 || c.pasos.length > 8) m.push(c.id + ' pasos ' + c.pasos.length);
    if (!c.pasos.some(p => p.pregunta.tipo === 'error') || !c.pasos.some(p => p.pregunta.tipo === 'destapa') || c.lleva.length !== 3) m.push(c.id + ' caso'); }
}
console.log({ n, larga, corta, pos, problemas: m });
if (m.length || larga > n / 3 || corta > n / 3 || Math.max(...Object.values(pos)) > n / 2) process.exit(1);
