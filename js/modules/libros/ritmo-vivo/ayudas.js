// Ayudas pequeñas del corazón eléctrico: el nodo del DOM por su id (todos con prefijo rtv-), la cita que lleva a la ficha
// y el origen de cada cifra. El enlace cruzado de «Ver en la ficha» lo resuelve el listener delegado de home/index.js.
import { FICHAS, PDF, libroDe } from '../../../data/ritmo-vivo-data.js';
import { clamp } from '../../../core/ui.js';
export { clamp };
export const $ = id => document.getElementById(id.startsWith('rtv-') ? id : 'rtv-' + id);
export const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coma = (x, d = 0) => (+x).toFixed(d).replace('.', ',');
export const NS = 'http://www.w3.org/2000/svg';
export const IMG = 'js/modules/cardiologia/img/';
// «Ver en la ficha» al párrafo exacto (data-resaltar) y, al lado, la página del PDF (en una línea que parte si hace falta)
export function cita(c) {
  const F = FICHAS[c.f], pag = /[-,]/.test(String(c.p)) ? `pp. ${c.p}` : `p. ${c.p}`;
  return `<span class="cita"><button type="button" class="cita-ir" data-especialidad="${F.esp}" data-view="${F.view}" data-panel="${F.panel}" data-tab="${c.f}" data-resaltar="#${c.id}">Ver en la ficha: ${F.corto} · ${c.sitio} →</button><a class="cita-pdf" href="${PDF[c.pdf || F.pdf]}#page=${String(c.p).match(/\d+/)[0]}" target="_blank" rel="noopener">PDF, ${pag}</a></span>`;
}
export const org = (t, ilu) => `<span class="rtv-org${ilu ? ' rtv-ilu' : ''}">${t}</span>`;
