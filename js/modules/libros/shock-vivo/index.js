// El shock a pie de cama: monitor y soporte (Marino caps. 14-17). Modelo vivo de Libros; sus fichas son las de Merino
// Cardiología. Interfaz común: init() devuelve { abrir(estadoClave, origen) }. Se abre con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="shockVivo" data-shock-vivo="<estado>">
// (lo resuelve el listener delegado de home/index.js con `modelosVivos`) y su «← VOLVER» lleva a la ficha de origen
// (core/volver-ficha.js). Estados (tabla F de la lista del bloque): hemo, septico, cardio, tapon, tep, balon, impella,
// ecmo y qs («¿Qué shock es?»); vacío = seguir donde estaba (la primera vez, Mateo).
// Lo pesado (motor, ecógrafo, bucle de animación) se carga y se monta al primer abrir (pagina.js), no al arrancar la
// app; el bucle se para solo cuando la vista se oculta.
import { marcarVolver } from '../../../core/volver-ficha.js';
import { instalarCss } from '../../../core/dibujo-iso.js';
import { SHV_CSS } from './estilos.js';

let raiz = null, modelo = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('shv-volver'), raiz, origen);
    if (!modelo) {
        cargando = cargando || import('./pagina.js').then(m => { modelo = m.montarShock(raiz); });
        await cargando;
    }
    modelo.abrirEstado(clave || '');
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('shv-raiz');
    instalarCss('shv', SHV_CSS);
    return { abrir: abrirEstado };
}
