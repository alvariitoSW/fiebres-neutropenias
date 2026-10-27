// La Mayéutica del shock vivo en el formato del motor común (core/mayeutica-motor.js): guía socrática, examen y el caso
// de Aurelio. El texto de las preguntas está en shock-vivo-data.js (PREGUNTAS y CASO, con sus citas); aquí solo se
// pasa al formato del motor. Las cifras de un enunciado o de unas opciones que dependen del monitor llevan, además, su
// función (`vivo`): al preguntar, el modelo se pone en el estado de la pregunta y el texto se escribe con sus cifras;
// el texto fijo de aquí solo sirve de reserva y para comprobar la forma del banco.
import { PREGUNTAS as RAW, CASO as RAW_CASO } from './shock-vivo-data.js';

const CORTO = { G1: 'balón: cuándo se hincha', G4: 'balón 1:2', G5: 'el «Aumento» de la consola', G6: 'contraindicaciones del balón', G2: 'Impella a 5,5 L/min',
  G3: 'ECMO y el VI', E1: 'ScvO₂ en la sepsis', E2: 'sin balón', E3: 'pie sin pulso con balón', E4: 'complicación del Impella', E5: 'ventaja del ECMO VA' };
// Una lectura de reserva: todo a 0 (no se ve nunca; el modelo da las cifras de verdad)
const R0 = new Proxy({}, { get: () => 0 });

function convertir(q, id, grupo) {
  const fn = (x) => typeof x === 'function';
  const o = { id, grupo, tipo: q.tipo === 'destapa' ? 'destapa' : q.tipo === 'error' ? 'error' : 'test', corto: CORTO[id] || id,
    modelo: q.prepara, predice: !!q.predice, comprobar: q.comprueba || null, org: q.org || '',
    enunciado: fn(q.enunciado) ? q.enunciado(R0) : q.enunciado };
  if (fn(q.enunciado) || fn(q.opciones)) o.vivo = { enunciado: fn(q.enunciado) ? q.enunciado : null, opciones: fn(q.opciones) ? q.opciones : null };
  if (o.tipo === 'destapa') {
    o.puntos = q.puntos.map((p) => p.t); o.puntosOrg = q.puntos.map((p) => p.org || ''); o.fuente = q.puntos.map((p) => p.c);
  } else if (o.tipo === 'error') {
    o.frases = q.frases.map((f) => ({ t: f.t, mal: !!f.mal, ...(f.mal ? { c: f.buena } : {}), fuente: f.cita }));
    o.fuente = [q.cita];
  } else {
    o.opciones = (fn(q.opciones) ? q.opciones(R0) : q.opciones).map((x) => ({ ...x }));
    o.fuente = [q.cita, q.cita2].filter(Boolean);
  }
  if (q.explica) o.explicacion = q.explica;
  return o;
}

export const PREGUNTAS = RAW.map((q) => convertir(q, q.id, q.grupo));

export const CASOS = [{
  titulo: RAW_CASO.titulo, sub: 'Un infarto anterior que se complica, de la hemodinámica al ECMO', corto: 'Aurelio', paciente: {},
  pasos: RAW_CASO.pasos.map((p, i) => ({ momento: p.dia, modelo: p.prepara, ficha: p.ficha, pregunta: convertir(p, `C${i + 1}`, 'caso') })),
  lleva: RAW_CASO.llevas,
  volver: { nombre: 'Shock cardiogénico: la hemodinámica', ancla: 'mc-cs-hemodinamica' },
}];
