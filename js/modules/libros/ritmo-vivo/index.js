// El corazón eléctrico (Marino cap. 19): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="ritmoVivo" data-ritmo-vivo="fa:dilt">
// (lo resuelve el listener delegado de home/index.js) y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js).
// El estado es una clave de ESTADOS (js/data/ritmo-vivo-data.js), vacía = el sinusal, con un fármaco opcional para la FA:
// «fa:dilt», «fa:amio», «fa:digo». Lo pesado (motor, dibujo y bucle de animación) se monta en el primer abrir y el bucle
// se para al salir de la vista (pagina.js).
import { marcarVolver } from '../../../core/volver-ficha.js';

let raiz = null, pagina = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('rtv-volver'), raiz, origen);
    document.body.classList.add('rtv-activo');
    cargando = cargando || import('./pagina.js').then(m => { pagina = m; });
    await cargando;
    const [estado, farmaco] = String(clave || '').split(':');
    const rcp = estado === 'fv' && /^rcp/.test(farmaco || '') ? farmaco.slice(4) || 'base' : null;   // «fv:rcp», «fv:rcp-adre», «fv:rcp-insufl»
    pagina.abrirEstado(estado || 'sinusal', rcp ? { rcp } : farmaco ? { farmaco } : {});
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('rtv-raiz');
    return { abrir: abrirEstado };
}
