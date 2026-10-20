// Carga los fragmentos HTML de cada módulo declarados con data-include="ruta.html"
// e inyecta su contenido en el elemento. Así cada calculadora vive en su propio
// archivo .html en vez de amontonarse todas en index.html.
// La versión de la app (la ?v= con la que el mapa de versiones de index.html cargó este módulo; ver
// autonomo/version.mjs). Los fragmentos se piden con ella para que el móvil no mezcle piezas de dos versiones.
export const VERSION = new URL(import.meta.url).searchParams.get('v') || '';
export const conVersion = url => VERSION ? `${url}${url.includes('?') ? '&' : '?'}v=${VERSION}` : url;

export async function includeAll(root = document) {
    const nodes = Array.from(root.querySelectorAll('[data-include]'));
    // Un fragmento que no se descarga no debe dejar sin arrancar toda la app: se cargan los demás y el fallo
    // se avisa en pantalla (core/aviso-arranque.js).
    const resultados = await Promise.allSettled(nodes.map(async (node) => {
        const url = node.getAttribute('data-include');
        const response = await fetch(conVersion(url));
        if (!response.ok) {
            throw new Error(`No se pudo cargar ${url}: ${response.status}`);
        }
        node.innerHTML = await response.text();
    }));
    resultados.filter(r => r.status === 'rejected').forEach(r => {
        console.error(r.reason);
        window.dispatchEvent(new ErrorEvent('error', { message: r.reason.message }));
    });
}
