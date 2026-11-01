import { MAYEUTICA_GASOMETRIA_2 as M } from '../../../../js/data/mayeutica/b4a-gasometria-2.js';
const all = []; for (const f of Object.values(M)) { f.guia.concat(f.examen).forEach(q => all.push(q)); f.casos.forEach(c => c.pasos.forEach(p => all.push(p.pregunta))); }
for (const q of all.filter(q => q.tipo === 'test')) { const L = q.opciones.map(o => o.t.length), i = q.opciones.findIndex(o => o.ok); if (L[i] === Math.max(...L)) console.log(q.id, L.join(','), 'ok=' + i); }
