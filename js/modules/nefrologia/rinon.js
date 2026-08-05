// Mapa del riñón: nivel 0 de Nefrología. Un único nivel de nodos sobre una
// silueta de riñón en corte (a diferencia del Atlas Hematológico, que tiene
// mapa general + pantallas de zona) — los 7 objetivos de rotación van
// directos a su destino, sin pasar por una pantalla intermedia. No conoce
// el contenido real de cada destino — delega en onRoute(key), igual que
// atlas.js delega en onRoute(key) y nefrona.js en onCategoria(key).
export function initRinon({ onRoute }) {
    const stage = document.getElementById('rinon-stage');
    if (!stage) return { reset: () => {} };

    const visited = new Set();

    stage.addEventListener('click', (e) => {
        const btn = e.target.closest('.region-btn[data-route]');
        if (!btn) return;
        visited.add(btn.dataset.route);
        btn.classList.add('visited');
        if (onRoute) onRoute(btn.dataset.route);
    });

    return {
        // Quita las marcas de "visitado". Se llama al reentrar en
        // Nefrología desde Especialidades, mismo espíritu que atlas.reset().
        reset: () => {
            visited.clear();
            stage.querySelectorAll('.region-btn.visited').forEach(b => b.classList.remove('visited'));
        },
    };
}
