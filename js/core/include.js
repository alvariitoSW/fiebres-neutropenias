// Carga los fragmentos HTML de cada módulo declarados con data-include="ruta.html"
// e inyecta su contenido en el elemento. Así cada calculadora vive en su propio
// archivo .html en vez de amontonarse todas en index.html.
export async function includeAll(root = document) {
    const nodes = Array.from(root.querySelectorAll('[data-include]'));
    await Promise.all(nodes.map(async (node) => {
        const url = node.getAttribute('data-include');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`No se pudo cargar ${url}: ${response.status}`);
        }
        node.innerHTML = await response.text();
    }));
}
