// Equilibrio de los tests de b6b-enteral.js (REGLAS §8): la buena, más larga/corta en ≤ ⅓ y ninguna posición en más de la mitad.
import { MAYEUTICA_ENTERAL as M } from '../../js/data/mayeutica/b6b-enteral.js';
const len = o => o.t.replace(/<[^>]*>/g, '').length;
const tests = [];
for (const [f, d] of Object.entries(M)) {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))];
  qs.filter(q => q.tipo === 'test').forEach(q => tests.push({ f, q }));
  qs.forEach(q => { if (q.tipo === 'test') { if (q.opciones.filter(o => o.ok).length !== 1) console.log('❌ ok≠1', q.id); q.opciones.filter(o => !o.ok && !o.porque).forEach(() => console.log('❌ sin porque', q.id)); } });
}
const stat = (arr, nombre) => {
  let larga = 0, corta = 0; const pos = {};
  arr.forEach(({ q }) => { const L = q.opciones.map(len), i = q.opciones.findIndex(o => o.ok); if (L[i] === Math.max(...L)) larga++; if (L[i] === Math.min(...L)) corta++; pos[i] = (pos[i] || 0) + 1; });
  const n = arr.length; console.log(nombre, `n=${n} larga=${larga} corta=${corta} pos=${JSON.stringify(pos)}`, larga <= n / 3 && corta <= n / 3 && Math.max(...Object.values(pos)) <= n / 2 ? '✅' : '❌');
};
stat(tests, 'archivo'); for (const f of Object.keys(M)) stat(tests.filter(t => t.f === f), f);
