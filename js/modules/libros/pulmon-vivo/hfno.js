// La cánula nasal de alto flujo (estado `hfno`, Marino cap. 25 pp. 61-66). Funciones puras: del flujo de la cánula salen el
// esfuerzo y la FR de Elvira (ilustrativo), la FiO₂ que llega al alvéolo y la SpO₂ (ilustrativa), y el aviso/sello del mando.
// Origen: balance entre el flujo de O₂ y el inspiratorio, 15 y 120 L/min, 40-60 L/min y PEEP 2-3 con boca cerrada: ficha.
import { simular } from './pulmon.mjs';
import * as D from '../../../data/pulmon-vivo-data.js';
const { HFNO, C } = D;
const f0 = (n) => String(Math.round(n));
const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const lerp = ([a, b], q) => a + (b - a) * (q - HFNO.min) / (HFNO.max - HFNO.min);
export const limitar = (q) => Math.max(0, Math.min(HFNO.tope, q));

// Esfuerzo y frecuencia de Elvira para un flujo (de 0 a 60; por debajo de 10 se queda como a 10: sin ayuda)
export function efecto(q) { const x = Math.max(HFNO.min, limitar(q)); return { pmus: Math.round(lerp(HFNO.pmus, x) * 2) / 2, frEsp: Math.round(lerp(HFNO.frEsp, x)) }; }
// Flujo inspiratorio máximo (L/min) que da el modelo con esos ajustes
export function flujoInsp(resp, pulmon) {
  const f = simular(resp, { ...pulmon, rEsp: pulmon.rEsp ?? pulmon.r }, {}, { ciclos: 8, ventana: 8 }).flujo;
  return Math.max(0, ...f);
}
// FiO₂ al alvéolo (%): si el flujo de la cánula no cubre el inspiratorio, el resto es aire (21 %): mezcla lineal (ilustrativo)
export function fio2Alveolo(q, vi, fio2) { const x = limitar(q); return x >= vi ? fio2 : 21 + (fio2 - 21) * x / vi; }
// SpO₂ (%): recta entre los dos puntos del caso de Elvira (84 con aire, 95 con FiO₂ 80 %); ilustrativo, el modelo no calcula gases
export function spo2(fio2Pct) { const { aire, alta, fio2Alta } = HFNO.spo2; return Math.round(aire + (alta - aire) * Math.max(0, Math.min(1, (fio2Pct - 21) / (fio2Alta - 21)))); }
// Todo junto, para el mando y las pruebas: pasa los ajustes que va a usar el motor
export function lectura(q, fio2, resp, pulmon) {
  const e = efecto(q), r = { ...resp, ...e }, vi = flujoInsp(r, pulmon), fa = fio2Alveolo(q, vi, fio2);
  return { ...e, vi, fio2Alv: fa, spo2: spo2(fa) };
}
// Avisos y sello del mando. `pedido`: el flujo que se intentó poner (puede pasar de 60 en una prueba)
export function avisoCanula(q, lec) {
  if (q < HFNO.inspNormal) return { nivel: 'aviso', titulo: 'Flujo bajo: arrastra aire', texto: `${f0(q)} L/min es menos que el flujo inspiratorio de una persona en reposo (15 L/min): Elvira completa cada inspiración con aire de la habitación y la FiO₂ al alvéolo cae a ${f0(lec.fio2Alv)} % (SpO₂ ${f0(lec.spo2)} %).`, cita: C.flujoFio2, origen: 'ficha, cap. 25 p. 61 (15 y 120 L/min) · FiO₂ y SpO₂: ilustrativo' };
  if (q >= HFNO.tope) return { nivel: 'aviso', titulo: 'En el tope del equipo', texto: `${f0(q)} L/min es lo máximo que dan los equipos (40-60 según el fabricante): más flujo no es posible.`, cita: C.hfnoDiseno, origen: 'ficha, cap. 25 p. 64' };
  return null;
}
export function selloCanula(pedido, lec) {
  return { k: 'canula-tope', titulo: 'Más flujo del que da el equipo', texto: `Pides ${f0(pedido)} L/min y los equipos de alto flujo dan 40-60 L/min según el fabricante: la cánula se queda en ${HFNO.tope}. A ${HFNO.tope} L/min Elvira respira a ${f0(lec.frEsp)} por minuto, con FiO₂ al alvéolo ${f0(lec.fio2Alv)} % y SpO₂ ${f0(lec.spo2)} %: el flujo ya cubre su inspiración y más no la ayuda.`, cita: C.hfnoDiseno, origen: 'ficha, cap. 25 p. 64 · FR, FiO₂ y SpO₂: ilustrativo' };
}
