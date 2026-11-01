// Posición (1ª..) de la opción buena de cada test del eje tras barajar, con el id actual y con variantes de id, para repartirlas.
import { barajar } from '../../../../js/core/mayeutica-motor.js';
import { PREGUNTAS, CASOS } from '../../../../js/data/eje-vivo-mayeutica.js';
const T = [...PREGUNTAS.filter(q => q.tipo === 'test'), ...CASOS.flatMap(c => c.pasos.map(p => p.pregunta))];
const pos = (q, id) => barajar(q.opciones, id).findIndex(o => o.ok) + 1;
console.log(T.map(q => `${q.id}:${pos(q, q.id)}`).join(' '));
for (const q of T) console.log(q.id, ['', 'a', 'b', 'c', 'd', 'e'].map(s => pos(q, q.id + s)).join(' '));
