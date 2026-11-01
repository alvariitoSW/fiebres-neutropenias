// Eje hormonal vivo · modo Preguntas: el motor común de la Mayéutica (core/mayeutica-motor.js) con los enganches del eje.
// Las preguntas están en js/data/eje-vivo-mayeutica.js. Si se predice, la PA del monitor sale «?» hasta contestar.
import { crearMayeuticaModelo } from '../../../core/mayeutica-motor.js';
import { CASOS, PREGUNTAS } from '../../../data/eje-vivo-mayeutica.js';
import { cita } from '../../../data/eje-vivo-data.js';
import { nuevo } from './modelo.js';
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
export function montarMayeutica({ R, $, org, ir, leer, modoPrueba }) {
  const leerEn = (e) => leer({ ...nuevo(e.pac), ...(e.set || {}) });
  const tapar = (b) => ir({ oculto: !!b });
  const subir = () => { const r = R.getBoundingClientRect(); if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' }); };
  const inicio = () => ir({ pac: 'toribio', guia: false, oculto: false });
  let cuenta = '';
  function comprobar(m, cont, q) {
    const T = q.tocar, a = leerEn(q.estado), d = leerEn(T.patch);
    m.disabled = true; ir({ ...T.patch, vista: q.estado.vista, lup: q.estado.lup, guia: false, oculto: false });
    $('monitor').scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth', block: 'start' });
    cuenta = `${T.cuenta(a, d)} ${org('cifras: ilustrativo')}`;
    cont.querySelector('[data-accion="comprobar"]').click();
    requestAnimationFrame(() => cont.querySelector('[data-hueco="fin"]')?.scrollIntoView({ block: 'start', behavior: 'auto' }));
  }
  const M = crearMayeuticaModelo({
    p: 'ejm', cont: () => $('preg'), clave: 'eje-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, volverPor: 'Dos glándulas, un enfermo',
    reiniciar: () => inicio(),
    pregunta: {
      alEmpezar: (q) => { if (q.estado) ir({ ...q.estado, guia: false, oculto: !!q.predice }); },
      verEnTexto: (q) => `<p class="ejm-fuente-p">${[].concat(q.fuente || []).map((c) => { const [p, id] = String(c).split('|'); return cita(p, id); }).join(' ')}</p>`,
      alCerrar: () => tapar(false),
      tocar: {
        mandoHTML: (t) => `<p class="ejm-para"><b>Compruébalo en el modelo:</b></p><button type="button" class="ejm-b ejm-prim" data-mando="sube">${t.txt}</button>`,
        alMostrar: (q, cont) => { tapar(false); const f = cont.querySelector('[data-accion="comprobar"]').closest('.ejm-fila'); if (f) f.hidden = true; },
        comprobar: () => true, confirma: () => cuenta, accion: comprobar,
      },
    },
    textos: {
      ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): siete apuestas con Toribio, Bibiana, Sinforoso, Policarpo, Fulgencio y Lucrecia; la PA sale cuando contestas.</span>
        <span><b>2. Examen, nivel MIR</b> (${nE}): cuatro notas de evolución con «encuentra el error».</span>
        <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span>
        <span><b>4.</b> Dos casos que evolucionan, con un giro: Obdulia y Toribio.</span>`,
      empezar: 'Empezar la guía socrática', seguir: 'Seguir',
      pie: 'La PA del monitor sale cuando contestas: primero predices, luego compruebas. Los pacientes se inventan; la medicina sale del capítulo, y cada pregunta dice dónde.',
      conModelo: 'el eje', casos: 'El modelo se pone en el estado de cada paso. Lo nuevo de la ficha del paciente sale en rojo.',
      abrirPaciente: 'Volver al eje de este paciente',
    },
    preguntaDePaso: (paso) => ({ estado: paso.estado }),
    alTerminarCaso: () => tapar(false),
    abrirPaciente: (C) => { modoPrueba('explorar'); ir({ pac: C.abrir.pac }); },
  });
  return { cargar: () => M.cargar(), entrar: () => M.entrar(), enPreguntas: (b) => { R.classList.toggle('preg-on', b); $('vista-preguntas').hidden = !b; if (!b) tapar(false); } };
}
