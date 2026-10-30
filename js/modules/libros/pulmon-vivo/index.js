// El pulmón con respirador (Marino caps. 22-28). Modelo vivo de Libros; sus fichas son las de Merino Neumología.
// Interfaz común: init() devuelve { abrir(estadoClave, origen) }. Se abre con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="pulmonVivo" data-pulmon-vivo="<estado>">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`) y su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). Estados: normal-vcv, pcv, pausa-inspiratoria, broncoespasmo-auto-peep, auto-peep-corregida,
// sdra-rigido, sdra-protector, volutrauma, eulalia-conectada, eulalia-ajustada; vacío = seguir donde estaba.
// Lo pesado (motor, pantalla, bucle de animación) se monta al primer abrir (pagina.js); el bucle se para solo cuando la
// vista se oculta.
import { marcarVolver } from '../../../core/volver-ficha.js';
import { instalarCss } from '../../../core/dibujo-iso.js';
import { PUL_CSS, ESCENA_CSS } from './estilos.js';

let raiz = null, modelo = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('pul-volver'), raiz, origen);
    if (!modelo) {
        cargando = cargando || import('./pagina.js').then(m => { modelo = m.montarPulmon(raiz); });
        await cargando;
    }
    modelo.abrirEstado(clave || '');
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('pul-raiz');
    instalarCss('pul', PUL_CSS);
    instalarCss('escena-pulmon', ESCENA_CSS);
    import('./lamina.js').then(m => m.montarLamina());
    import('./corazon.js').then(m => m.montarCorazon());   // E3-enganche: el panel del corazón
    return { abrir: abrirEstado };
}
