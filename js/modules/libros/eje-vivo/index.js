// Eje hormonal vivo · dos glándulas, un enfermo (Marino cap. 51): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre (lo resuelve el listener delegado de home/index.js):
// <button data-especialidad="libros" data-view="ejeVivo" data-eje-vivo="toribio:2">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js). El estado es la clave del paciente (toribio, bibiana, sinforoso, lucrecia,
// obdulia, policarpo, fulgencio) y, tras los dos puntos, el paso de su guía. La página (mandos, guía, topes) vive en pagina.js.
import { marcarVolver } from '../../../core/volver-ficha.js';
import { montar } from './pagina.js';

const $ = (id) => document.getElementById(id);
let raiz = null, api = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export function abrir(estadoClave, origen) {
  if (origen !== undefined) marcarVolver($('eje-volver'), raiz, origen);
  const [clave, n] = String(estadoClave || '').split(':');
  api.abrir(clave, Number(n) ? Number(n) - 1 : 0);
  requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
  raiz = $('eje-raiz'); api = montar(raiz); api.abrir('toribio', 0);
  return { abrir };
}
