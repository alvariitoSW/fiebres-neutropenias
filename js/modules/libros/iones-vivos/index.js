// Iones vivos · lo que ves y lo que hay (Marino caps. 36-38): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre (lo resuelve el listener delegado de home/index.js):
// <button data-especialidad="libros" data-view="ionesVivos" data-iones-vivos="rufino:3">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js). El estado es un paciente (normal, damian, rufino, valentin,
// adela), con un paso de su guía («rufino:3») o un ion («normal:ca»). Lo pesado se monta en el primer abrir y el bucle del ECG
// se para al salir de la vista (pagina.js).
import { marcarVolver } from '../../../core/volver-ficha.js';

let raiz = null, pagina = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('iov-volver'), raiz, origen);
    cargando = cargando || import('./pagina.js').then(m => { pagina = m; });
    await cargando;
    pagina.abrirEstado(String(clave || ''));
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('iov-raiz');
    return { abrir: abrirEstado };
}
