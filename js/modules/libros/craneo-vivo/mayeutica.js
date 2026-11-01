// La Mayéutica del cráneo vivo: el motor común (core/mayeutica-motor.js) con los enganches de este modelo.
// Los datos viven en js/data/craneo-vivo-mayeutica.js; pagina.js le pasa `api` (poner el paciente, aplicar un cambio, leer).
import { crearMayeuticaModelo } from '../../../core/mayeutica-motor.js';
import { PREGUNTAS, CASOS } from '../../../data/craneo-vivo-mayeutica.js';
import { cita, PDF } from '../../../data/craneo-vivo-data.js';
import { instalarCssMayeutica } from './mayeutica-css.js';

// «PDF p. N · Ver en la ficha» de una cita {p, f, pdf?, url?, uw?}; el PDF de otra fuente (Libro Azul) cambia la ruta
const citaH = (c) => cita(c.p, c.f).replace(PDF, c.pdf || PDF) + (c.url ? ` <a class="cita-pdf" href="${c.url}" target="_blank" rel="noopener">${c.uw}</a>` : '');
export function crearMayeutica({ R, api, antes }) {
  instalarCssMayeutica();
  let cuentaTocar = '';
  const subir = () => { const r = document.getElementById('crv-monitor').getBoundingClientRect(); if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' }); };
  return crearMayeuticaModelo({
    p: 'crv', cont: () => document.getElementById('crv-preg'), clave: 'craneo-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, volverPor: 'El cráneo vivo',
    reiniciar: () => api.poner({ tipo: 'hematoma', masa: 68, pas: 136 }, false),
    pregunta: {
      alEmpezar: (q) => api.poner(q.estado, !!q.predice),
      verEnTexto: (q) => `<p class="crv-fuente-p">${[].concat(q.fuente || []).map(citaH).join(' ')}</p>`,
      alCerrar: () => api.oculto(false),
      tocar: {
        mandoHTML: (t) => `<p class="crv-para"><b>Compruébalo en el modelo:</b></p><button type="button" class="crv-b crv-prim" data-mando="sube">${t.txt}</button>`,
        alMostrar: (q, cont) => { api.oculto(false); const f = cont.querySelector('[data-accion="comprobar"]').closest('.crv-fila'); if (f) f.hidden = true; },
        comprobar: () => true,
        confirma: () => cuentaTocar,
        accion: (m, cont, q) => {
          m.disabled = true; const L0 = api.leer(); api.aplicar(q.tocar.a); const L1 = api.leer();
          cuentaTocar = `${q.tocar.cuenta(L0, L1)} <span class="org">cifras: ilustrativo</span>`;
          cont.querySelector('[data-accion="comprobar"]').click();
        },
      },
    },
    textos: {
      ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): la mayoría se predice y se comprueba en el monitor.</span>
        <span><b>2. Examen, nivel MIR</b> (${nE}): el error de un plan, el test de apnea y la hemicraniectomía.</span>
        <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span>
        <span><b>4.</b> Dos casos que evolucionan: Abundio y Segismundo.</span>`,
      empezar: 'Empezar la guía socrática', seguir: 'Seguir',
      pie: 'Las cifras del monitor salen cuando contestas: primero predices, luego compruebas. Los pacientes se inventan; la medicina sale de las fichas, y cada pregunta dice dónde.',
      conModelo: 'el cráneo', casos: 'El cráneo se pone en el estado de cada paso. Lo nuevo de la ficha del paciente sale en rojo.',
      abrirPaciente: 'Volver al cráneo de este paciente',
    },
    preguntaDePaso: (paso) => ({ estado: paso.estado }),
    alTerminarCaso: () => api.oculto(false),
    abrirPaciente: (C) => { antes(C.id === 'crv-segismundo' ? 'segismundo' : 'abundio'); api.poner(C.pasos[C.pasos.length - 1].estado, false); },
  });
}
