// Mayéutica del shock vivo (guía socrática, examen, repaso y el caso de Aurelio): los enganches del motor común
// (core/mayeutica-motor.js) con el modelo. Salió de pagina.js para dejarlo en ≤700 líneas; no cambia el comportamiento.
// `h` trae lo que vive en el cierre de montarShock: raiz, $, est, monitor, cita, org, coma, REDUCIR y sus funciones;
// h.R y h.cab son lectores vivos (la lectura y la cabecera cambian).
import { CANALES } from './canales.js';
import * as D from '../../../data/shock-vivo-data.js';
import { crearMayeuticaModelo } from '../../../core/mayeutica-motor.js';
import { PREGUNTAS as PREG_MAY, CASOS as CASOS_MAY } from '../../../data/shock-vivo-mayeutica.js';

export function montarMayeutica(h) {
const { raiz, $, est, monitor, cita, org, coma, REDUCIR, nuevoPaciente, refrescar, trabajar, medirDock, setModo, pintarPacientes, pintarDock, ctxMon, tapar } = h;
// ---------------------------------------------------------------- Mayéutica: guía socrática, examen, repaso y el caso de Aurelio
// El motor común (core/mayeutica-motor.js) lleva el recorrido; aquí solo sus enganches: poner el monitor y el dibujo en
// el estado de cada pregunta (con el velo «primero predices»), las citas «Ver en la ficha» y el «Compruébalo» en el modelo.
const CIFRA_ET = { pam: 'PAM', pas: 'PAS', pad: 'PAD', pcp: 'PCP', pvc: 'PVC', ic: 'IC', irvs: 'IRVS', fc: 'FC', spo2: 'SpO₂', imp: 'bomba (L/min)', ecmo: 'ECMO (L/min)', aoAbre: 'aórtica abre', edema: 'edema (mL)', picoDia: 'pico diastólico', picoNo: 'pico sin balón', teleDia: 'telediastólica', teleNo: 'telediastólica sin balón', pcpLim: 'PCP' };
function cifraTxt(k, r) { const v = r[k]; if (v == null) return '—'; if (k === 'aoAbre') return `${v} de ${r.aoDe}`; if (k === 'ic' || k === 'imp' || k === 'ecmo') return coma(v, 1); return coma(v, 0); }
let ultimaPrep = null;
function prepararPregunta(pr) {
  if (!pr) return;
  const pac = D.PACIENTES.find((p) => p.k === pr.pac);
  est.aparato = pr.ajuste?.soporte ?? 'no';
  est.vista = pr.escena && pr.escena !== 'corazon' ? 'aparato' : 'paciente'; est.plano = 'dentro';
  nuevoPaciente(pac, { rec: pr.rec, ajuste: pr.ajuste || {}, volumen: pr.volumen || 0, horas: pr.horas || 0 });
  est.canales = pr.canales || 'todos';
  monitor.ver(est.canales === 'cabecera' ? ['ecg', 'art', 'pleth', 'co2'] : CANALES.map((x) => x.k)); monitor.llenar(h.cab, ctxMon());
}
const enRepaso = () => May.fase === 'repaso';
function subirMay() { medirDock(); const r = raiz.getBoundingClientRect(); if (r.top < 0) scrollBy({ top: r.top, behavior: 'auto' }); }
// El caso: la ficha del paciente se rellena con las cifras del monitor en ese momento (datos y nuevo se leen al abrir el paso)
const CASOS_V = CASOS_MAY.map((C) => ({ ...C,
  hueco: `Fuentes: ${[D.C.csHemo, D.C.csNa, D.C.papilar, D.C.ecmoPoscarga].map(cita).join(' ')}`,
  pasos: C.pasos.map((p, i) => {
    let claves = [];
    return Object.defineProperties({ ...p }, {
      datos: { get() {
        prepararPregunta(p.modelo); ultimaPrep = p.modelo; refrescar(true);
        const filas = p.ficha(h.R).map(([k, v]) => [k === 'Hora 18' ? (i === 5 ? 'Soplo' : 'Respiración') : k, v]);
        claves = filas.map((f) => f[0]); return Object.fromEntries(filas);
      } },
      nuevo: { get() { return claves; } },
    });
  }) }));
const May = crearMayeuticaModelo({
  p: 'shv', cont: () => $('zona-may'), clave: 'shock-vivo-mayeutica-v1', preguntas: PREG_MAY, casos: CASOS_V,
  subir: subirMay, volverPor: 'El shock a pie de cama',
  reiniciar: () => { ultimaPrep = null; tapar(false); prepararPregunta({ pac: 'aurelio', escena: 'corazon' }); refrescar(true); },
  pregunta: {
    alEmpezar: (q) => {
      if (q.modelo) { if (ultimaPrep === q.modelo) ultimaPrep = null; else prepararPregunta(q.modelo); }
      tapar(q.predice && !enRepaso()); refrescar(true);
      if (q.vivo?.enunciado) q.enunciado = q.vivo.enunciado(h.R);
      if (q.vivo?.opciones) q.opciones = q.vivo.opciones(h.R);
      if (q.puntosOrg) q.puntos = q.puntos.map((t, i) => t + (q.puntosOrg[i] ? ' ' + org(q.puntosOrg[i]) : ''));
      if (q.frases) q.frases = q.frases.map((f) => f.mal ? { ...f, c: `<span class="hl-verde">${f.c}</span> ${cita(f.fuente)}` } : f);
      if (q.explicacion && q.org) q.explicacion += ' ' + org(q.org);
    },
    verEnTexto: (q) => [].concat(q.fuente || []).filter(Boolean).map(cita).join('')
      + (q.comprobar && !enRepaso() ? `<div class="shv-fila"><button type="button" class="shv-b shv-prim" data-comprueba="1">${q.comprobar.txt}</button></div>` : ''),
    alCerrar: (q) => { if (!q.comprobar || enRepaso()) { tapar(false); refrescar(true); } },
    alSalir: () => tapar(false),
    alClic: (e, q) => {
      const b = e.target.closest('button'); if (!b) return false;
      if (b.dataset.verMonitor) { $('monitor').scrollIntoView({ block: 'start', behavior: REDUCIR ? 'auto' : 'smooth' }); return true; }
      if (!b.dataset.comprueba) return false;
      const c = q.comprobar; tapar(false);
      const antes = h.R ? { ...h.R } : null;
      trabajar(() => { if (c.ajuste) { if (c.ajuste.soporte) { est.aparato = c.ajuste.soporte; est.vista = 'aparato'; } h.cab.ajustar(c.ajuste); } if (c.volumen) h.cab.volumen(c.volumen); }, c.volumen ? 20 : 10);
      const cifras = antes && c.cifras ? `<dl class="antes-despues">${c.cifras.map((k) => `<dt>${CIFRA_ET[k] || k}</dt><dd>${cifraTxt(k, antes)} <span class="flecha">→</span> <b>${cifraTxt(k, h.R)}</b></dd>`).join('')}</dl>` : '';
      b.closest('.shv-fila').outerHTML = `<p class="shv-para"><span class="shv-ok">Mira el modelo:</span> ${c.mira}</p>${cifras}<div class="shv-fila"><button type="button" class="shv-b" data-ver-monitor="1">Ver el monitor</button></div>`;
      return true;
    },
  },
  textos: {
    ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): predices, destapas y lo compruebas en el modelo.</span>
      <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen de las fichas.</span>
      <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span>
      <span><b>4.</b> El caso de Aurelio: ${CASOS_V[0].pasos.length} pasos que evolucionan con el reloj.</span>`,
    empezar: 'Empezar la guía socrática', seguir: 'Seguir',
    pie: 'Cada pregunta pone el monitor y el dibujo en el estado de su pregunta; las cifras se destapan al contestar. Los pacientes se inventan; la medicina sale de las fichas de Merino Cardiología, y cada respuesta dice dónde.',
    conModelo: 'el monitor', casos: 'El monitor se pone en el estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
    abrirPaciente: 'Abrir el modelo con Aurelio en ECMO',
  },
  preguntaDePaso: () => ({}),
  alTerminarCaso: () => { ultimaPrep = null; tapar(false); prepararPregunta({ pac: 'aurelio', escena: 'corazon' }); refrescar(true); },   // el final del caso no deja los sellos del último paso sobre el monitor
  abrirPaciente: () => {
    setModo('explorar'); const p = D.PACIENTES.find((x) => x.k === 'aurelio');
    est.aparato = 'ecmo'; est.vista = 'aparato';
    nuevoPaciente(p, { rec: { eroaMitral: 0.8, pao2: 56 }, volumen: 250, ajuste: { na: 5, dobuta: true, soporte: 'ecmo', ecmo: 4.5 } });
    pintarPacientes(); refrescar(true); pintarDock();
  },
});
return { May, CASOS_V, prepararPregunta };
}
