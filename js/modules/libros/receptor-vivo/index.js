// El receptor vivo: vasopresores e inotrópicos (Marino caps. 14 y 16): esqueleto del modelo vivo de Libros, en construcción.
// Interfaz común: init() devuelve { abrir(estadoClave, origen) }. Se abre con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="receptorVivo" data-receptor-vivo="">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js).
import { marcarVolver } from '../../../core/volver-ficha.js';

let raiz = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('rcv-volver'), raiz, origen);
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('rcv-raiz');
    // [HUECO constructor receptor: el arranque del modelo]
    return { abrir: abrirEstado };
}
