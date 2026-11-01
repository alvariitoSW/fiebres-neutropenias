// Termostato vivo · el cuerpo que arde y tirita (Marino caps. 43-44): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre (lo resuelve el listener delegado de home/index.js):
// <button data-especialidad="libros" data-view="termostatoVivo" data-termostato-vivo="golpe:4">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js). El estado es fiebre, golpe, hm, snm, ss, hipo o juega, con su paso («hm:3»).

let raiz = null, pagina = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('tmv-volver'), raiz, origen);
    cargando = cargando || import('./pagina.js').then(m => { pagina = m; });
    await cargando;
    pagina.abrirEstado(String(clave || ''));
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('tmv-raiz');
    return { abrir: abrirEstado };
}
