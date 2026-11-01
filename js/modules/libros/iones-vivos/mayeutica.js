// La Mayéutica de «Lo que ves y lo que hay»: el motor común (core/mayeutica-motor.js) con los enganches de este modelo.
// Datos: js/data/iones-vivos-preguntas.js. Primero predices (cifras tapadas), luego el modelo lo confirma.
import { crearMayeuticaModelo, rutaDe, atributosFicha } from '../../../core/mayeutica-motor.js';
import { PREGUNTAS as P0, CASOS as CASOS0 } from '../../../data/iones-vivos-preguntas.js';

// Del formato de los datos al del motor: puntos como texto y frases con su corrección y su cita (páginas del PDF).
const adaptar = (q, cita) => ({ ...q,
  puntosC: q.puntos ? q.puntos.map(p => p.c) : undefined, puntos: q.puntos ? q.puntos.map(p => p.t) : undefined,
  frases: q.frases ? q.frases.map(f => ({ t: f.t, mal: f.mal, c: f.mal ? `<span class="hl-verde">${f.buena}</span> ${cita(f.cita)}` : '', cita: f.cita })) : undefined });

// d: { ponerEstado, taparTodo, accion, esperar, cita, S, medirDock, setModo }
export function crearMayeutica(d) {
  const PREGUNTAS = P0.map(q => adaptar(q, d.cita));
  const CASOS = CASOS0.map(c => ({ ...c, pasos: c.pasos.map(p => ({ ...p, pregunta: adaptar(p.pregunta, d.cita) })) }));
  const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preparar = q => {
    if (!q.estado) return;
    d.ponerEstado(q.estado);
    d.taparTodo(true);
  };
  const destapar = q => {
    d.taparTodo(false);
    if (q.tras) d.accion(q.tras);                             // el modelo hace lo que la pregunta anunciaba
    if (q.haz) d.accion(q.haz[0], q.haz[1]);
  };
  const citas = q => [q.fuente, q.fuente2, q.fuente3, ...(q.puntosC || []), ...(q.frases || []).map(f => f.cita)].filter(Boolean).filter((c, i, a) => a.indexOf(c) === i).map(d.cita).join(' · ');
  const subir = () => scrollTo({ top: 0, behavior: REDUCIR ? 'auto' : 'smooth' });
  return crearMayeuticaModelo({
    p: 'iov', cont: () => document.getElementById('iov-preg'), clave: 'iones-vivos-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => { d.taparTodo(false); d.ponerEstado({ preset: 'normal', ion: 'k' }); d.medirDock(); },
    volverPor: 'Lo que ves y lo que hay',
    pregunta: {
      alEmpezar: q => { preparar(q); d.medirDock(); },
      verEnTexto: q => { const h = citas(q); return h ? `<p class="iov-fuente-p">${h}</p>` : ''; },
      alCerrar: q => destapar(q),
    },
    textos: {
      ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): predices lo que verá el laboratorio y luego el modelo lo confirma.</span>
        <span><b>2. Examen, nivel MIR</b> (${nE}): conductas y umbrales de Marino, cada opción falsa con lo que le pasaría al paciente.</span>
        <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span><span><b>4.</b> Dos casos que evolucionan: Adela (hiperpotasemia) y Valentín (transfusión masiva).</span>`,
      empezar: 'Empezar la guía socrática', seguir: 'Seguir',
      pie: 'Las cifras del suero están tapadas hasta que contestas: primero predices, luego compruebas. Los pacientes de los casos se inventan; la medicina sale de las fichas de Marino (caps. 36-38) y cada pregunta dice dónde.',
      conModelo: 'el modelo', casos: 'El modelo se pone en el estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
      abrirPaciente: 'Abrir el modelo con el último paciente',
    },
    preguntaDePaso: () => ({}),
    abrirPaciente: C => { d.setModo('explorar'); d.ponerEstado(C.id === 'iov-adela' ? { preset: 'adela', ion: 'k' } : { preset: 'valentin', ion: 'ca' }); d.medirDock(); },
  });
}
export { rutaDe, atributosFicha };
