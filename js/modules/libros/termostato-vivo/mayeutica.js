// Termostato vivo · modo Preguntas: el motor común de la Mayéutica (core/mayeutica-motor.js) con los enganches del termostato.
// Las preguntas están en js/data/termostato-vivo-mayeutica.js. Si se predice, el monitor y el dibujo se esconden hasta contestar.
import { crearMayeuticaModelo } from '../../../core/mayeutica-motor.js';
import { CASOS, PREGUNTAS } from '../../../data/termostato-vivo-mayeutica.js';
import { nuevo } from './modelo.js';
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
export function montarMayeutica({ R, $, cita, org, ir, leer, modoPrueba }) {
  const leerEn = (p) => leer({ ...nuevo(), ...p });
  const tapar = (b) => R.classList.toggle('tapado', !!b);
  const verModelo = (b) => R.classList.toggle('sin-modelo', !b);
  const subir = () => { const r = R.getBoundingClientRect(); if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' }); };
  const inicio = () => ir({ est: 'fiebre', paso: 1, trat: 0, ysi: null, quieto: true });
  let cuenta = '';
  function comprobar(m, cont, q) {
    const T = q.tocar, a = leerEn(q.estado), d = leerEn(T.patch);
    m.disabled = true; tapar(false); ir({ ...T.patch, quieto: true });
    $('monitor').scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth', block: 'start' });
    cuenta = `${T.cuenta(a, d)} ${org('cifras: ilustrativo')}`;
    cont.querySelector('[data-accion="comprobar"]').click();
    requestAnimationFrame(() => cont.querySelector('[data-hueco="fin"]')?.scrollIntoView({ block: 'start', behavior: 'auto' }));
  }
  const M = crearMayeuticaModelo({
    p: 'tmv', cont: () => $('preg'), clave: 'termostato-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, volverPor: 'El cuerpo que arde y tirita',
    reiniciar: () => { verModelo(true); tapar(false); inicio(); },
    pregunta: {
      alEmpezar: (q) => { verModelo(!q.sinModelo); if (q.estado) ir({ ...q.estado, quieto: true }); tapar(!!q.predice && !q.sinModelo); },
      verEnTexto: (q) => `<p class="tmv-fuente-p">${[].concat(q.fuente || []).map(cita).join(' ')}</p>`,
      alCerrar: (q) => { tapar(false); verModelo(!q.sinModelo); },
      tocar: {
        mandoHTML: (t) => `<p class="tmv-para"><b>Compruébalo en el modelo:</b></p><button type="button" class="tmv-b tmv-prim" data-mando="sube">${t.txt}</button>`,
        alMostrar: (q, cont) => { tapar(false); verModelo(true); const f = cont.querySelector('[data-accion="comprobar"]').closest('.tmv-fila'); if (f) f.hidden = true; },
        comprobar: () => true, confirma: () => cuenta, accion: comprobar,
      },
    },
    textos: {
      ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): del punto de ajuste al antipirético; casi todas se predicen y se comprueban en el monitor.</span>
        <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen del capítulo.</span>
        <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span>
        <span><b>4.</b> Dos casos que evolucionan: Jacinta y Honorato.</span>`,
      empezar: 'Empezar la guía socrática', seguir: 'Seguir',
      pie: 'Las cifras del monitor salen cuando contestas: primero predices, luego compruebas. Los pacientes se inventan; la medicina sale del capítulo, y cada pregunta dice dónde.',
      conModelo: 'el termostato', casos: 'El modelo se pone en el estado de cada paso. Lo nuevo de la ficha del paciente sale en rojo.',
      abrirPaciente: 'Volver al termostato de este paciente',
    },
    preguntaDePaso: (paso) => ({ estado: paso.estado }),
    alTerminarCaso: () => { verModelo(true); tapar(false); },
    abrirPaciente: (C) => { modoPrueba('explorar'); ir({ ...C.abrir, trat: 0, ysi: null }); },
  });
  return { cargar: () => M.cargar(), entrar: () => M.entrar(), enPreguntas: (b) => { R.classList.toggle('preg-on', b); $('vista-preguntas').hidden = !b; if (!b) { tapar(false); verModelo(true); } } };
}
