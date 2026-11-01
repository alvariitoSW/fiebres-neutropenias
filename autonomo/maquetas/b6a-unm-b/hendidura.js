// Hendidura de la lupa: el dibujo, los 5 PASOS y la animación con Motion se IMPORTAN del modelo A (sin copiar). Aquí solo el pegamento:
// qué paso se ve, cómo se mueven las ACh entre dos pasos y el reproductor. Los botones se crean una vez; el SVG se repinta.
import { escena as escenaA } from '../b6a-unm-a/dibujo.js';
import { PASOS } from '../b6a-unm-a/datos.js';
import { prepararMotion, moverAch, pulso } from '../b6a-unm-a/anim.js';
import { aLupa, leerA } from './bloqueo-motor.js';
export { PASOS, prepararMotion };
const leerAch = (svg) => [...svg.querySelectorAll('.ach')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), o: +c.getAttribute('opacity') }));
/** Pinta la lupa en el paso dado y mueve las ACh desde donde estaban. Devuelve la promesa del movimiento. */
export function pintarHend(svg, s, paso, oculto) {
  const previas = leerAch(svg), a = aLupa(s);
  svg.innerHTML = escenaA(a, leerA(a), paso, [], oculto);
  const nuevas = leerAch(svg);
  if (previas.length === nuevas.length && previas.every((p, i) => Math.abs(p.x - nuevas[i].x) + Math.abs(p.y - nuevas[i].y) + Math.abs(p.o - nuevas[i].o) < 0.5)) return Promise.resolve();   // sin cambio de paso: nada que mover
  if (paso === 1) pulso(svg);
  return moverAch(svg, previas, nuevas, 0.8);
}
export const pasoHtml = (paso, cita) => { const pa = PASOS[paso - 1]; return pa ? `<b>${paso}. ${pa[0]}.</b> ${pa[1]} ${pa[2] ? cita(pa[2]) : ''}<span class="origen-paso"> · ${pa[3] || 'ficha'}</span>` : 'Reposo: elige un paso del ciclo o pulsa «Ver el ciclo».'; };
