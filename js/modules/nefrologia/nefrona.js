// Diagrama interactivo de la nefrona: menú principal de Nefrología. Un
// mismo SVG hace de mapa de navegación (tocar un segmento lleva a sus
// categorías de contenido) y de herramienta de estudio (muestra los
// canales/transportadores de esa zona, y un modo interactivo resalta
// segmentos según el diurético o la patología elegidos). No conoce el
// contenido clínico real de cada categoría — delega en onCategoria(key),
// igual que atlas.js delega en onRoute(key).
import { segmentosNefrona, modosInteractivos } from '../../data/nefrona-data.js';

function renderCanales(cont, canales) {
    cont.innerHTML = canales.map(c => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('active')">
                <span>⚡ ${c.nombre}</span> <span class="toggle-icon">+</span>
            </div>
            <div class="micro-prof-body">
                <dl class="kv-row"><dt>Función</dt><dd>${c.funcion}</dd></dl>
                <dl class="kv-row"><dt>Diana farmacológica</dt><dd>${c.diana}</dd></dl>
            </div>
        </div>
    `).join('');
}

export function initNefrona({ onCategoria }) {
    const svg = document.querySelector('.nefrona-diagram');
    const panel = document.getElementById('nefro-panel-segmento');
    if (!svg || !panel) return { reset: () => {} };

    const titulo = document.getElementById('nefro-segmento-titulo');
    const canalesCont = document.getElementById('nefro-segmento-canales');
    const categoriasCont = document.getElementById('nefro-segmento-categorias');
    const modoSelect = document.getElementById('nefro-modo-select');
    const modoExplicacion = document.getElementById('nefro-modo-explicacion');

    function seleccionarSegmento(key) {
        const data = segmentosNefrona[key];
        if (!data) return;

        svg.querySelectorAll('[data-segmento]').forEach(g => g.classList.remove('segmento-activo'));
        svg.querySelectorAll(`[data-segmento="${key}"]`).forEach(g => g.classList.add('segmento-activo'));

        panel.style.display = 'block';
        titulo.textContent = data.nombre;
        renderCanales(canalesCont, data.canales);

        if (data.categorias.length === 0) {
            categoriasCont.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted);">🚧 Contenido clínico de esta zona en preparación.</p>';
        } else {
            categoriasCont.innerHTML = data.categorias.map(key =>
                `<button class="accordion-btn nav-btn nefro-categoria-btn" data-categoria="${key}" style="border-left: 4px solid var(--accent-green);">
                    <span>Ver contenido clínico</span>
                    <span style="font-size: 0.8rem; color: var(--accent-green);">[ VER → ]</span>
                </button>`
            ).join('');
        }
    }

    svg.addEventListener('click', (e) => {
        const g = e.target.closest('[data-segmento]');
        if (g) seleccionarSegmento(g.dataset.segmento);
    });

    panel.addEventListener('click', (e) => {
        const btn = e.target.closest('.nefro-categoria-btn');
        if (btn && onCategoria) onCategoria(btn.dataset.categoria);
    });

    function limpiarResaltadoModo() {
        svg.querySelectorAll('.canal-resaltado').forEach(g => g.classList.remove('canal-resaltado'));
    }

    modoSelect.addEventListener('change', () => {
        limpiarResaltadoModo();
        const modo = modosInteractivos[modoSelect.value];
        if (!modo) {
            modoExplicacion.style.display = 'none';
            return;
        }
        modo.segmentos.forEach(key =>
            svg.querySelectorAll(`[data-segmento="${key}"]`).forEach(g => g.classList.add('canal-resaltado')));
        modoExplicacion.style.display = 'block';
        modoExplicacion.innerHTML = `
            <strong>${modo.etiqueta}</strong>
            <p>${modo.explicacion}</p>
            <p style="color: var(--text-muted); font-size: 0.75rem;">Canal(es) implicado(s): ${modo.canales.join(', ')}</p>
        `;
    });

    return {
        // Deselecciona segmento y limpia el modo interactivo. Se llama al
        // volver al menú de Nefrología desde una categoría, para que el
        // diagrama arranque siempre neutro.
        reset: () => {
            svg.querySelectorAll('[data-segmento]').forEach(g => g.classList.remove('segmento-activo'));
            limpiarResaltadoModo();
            panel.style.display = 'none';
            modoSelect.value = '';
            modoExplicacion.style.display = 'none';
        },
    };
}
