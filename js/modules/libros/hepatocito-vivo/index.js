// Hepatocito vivo · «La fábrica por dentro» (Marino cap. 39): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre (lo resuelve el listener delegado de home/index.js):
// <button data-especialidad="libros" data-view="hepatocitoVivo" data-hepatocito-vivo="casimira">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js). El estado es un paciente (sano, casimira, edema, hilario, alta)
// y, tras dos puntos, «tips» pone el TIPS («alta:tips»). Lo pesado se monta en el primer abrir.
import { marcarVolver } from '../../../core/volver-ficha.js';

let raiz = null, pagina = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('hpv-volver'), raiz, origen);
    cargando = cargando || import('./pagina.js').then(m => { pagina = m; });
    await cargando;
    pagina.abrirEstado(String(clave || ''));
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('hpv-raiz');
    return { abrir: abrirEstado };
}
