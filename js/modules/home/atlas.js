// Atlas Hematológico: mapa interactivo que sustituye los 4 botones apilados
// del menú principal de Hematología. Gestiona solo la navegación INTERNA
// del mapa (nivel general ↔ zonas); al tocar un nodo final (data-route),
// delega en el callback onRoute(key) para que home/index.js decida qué
// vista real mostrar. No conoce ni toca el contenido de esas vistas.
export function initAtlas({ onRoute, onCompass }) {
    const stage = document.getElementById('atlas-stage');
    if (!stage) return { reset: () => {} };

    const visited = new Set();

    function showScreen(id) {
        stage.querySelectorAll('.atlas-screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
    }

    function markVisited(key) {
        visited.add(key);
        stage.querySelectorAll(`[data-zone="${key}"], [data-route="${key}"]`).forEach(b => b.classList.add('visited'));
    }

    stage.addEventListener('click', (e) => {
        const back = e.target.closest('.back-chip');
        if (back) { showScreen(back.dataset.back); return; }

        const btn = e.target.closest('.region-btn');
        if (btn) {
            if (btn.dataset.zone) {
                markVisited(btn.dataset.zone);
                showScreen('atlas-screen-' + btn.dataset.zone);
            } else if (btn.dataset.route) {
                markVisited(btn.dataset.route);
                if (onRoute) onRoute(btn.dataset.route);
            }
            return;
        }

        if (e.target.closest('#atlas-compass') && onCompass) onCompass();
    });

    return {
        // Vuelve al mapa general. Se llama cada vez que se regresa al menú
        // principal de Hematología, para que las 4 regiones estén siempre
        // a un toque tras salir de cualquier contenido.
        reset: () => showScreen('atlas-screen-overview'),
    };
}
