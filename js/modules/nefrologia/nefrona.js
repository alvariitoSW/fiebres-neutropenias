// Diagrama interactivo de la nefrona: menú principal de Nefrología. Una
// ilustración anatómica real (js/modules/nefrologia/img/nefrona-anatomia.jpg)
// con botones invisibles ("hotspots") superpuestos por posición porcentual
// hace de mapa de navegación (tocar un segmento lleva a sus categorías de
// contenido) y de herramienta de estudio (muestra los canales/transportadores
// de esa zona, con un mini-diagrama de flechas de reabsorción/secreción por
// ion, y un modo interactivo resalta segmentos según el diurético o la
// patología elegidos — las patologías pueden enlazar a la ficha completa del
// cuaderno de campo de Fisiopatología renal). No conoce el contenido clínico
// real de cada categoría — delega en onCategoria(key), igual que atlas.js
// delega en onRoute(key).
import { segmentosNefrona, modosInteractivos } from '../../data/nefrona-data.js';
import { openCorkboardTopic } from '../../core/corkboard.js';

let flujoSvgSeq = 0;

// Mini-diagrama luz tubular ↔ célula ↔ sangre: una fila por ion, con una
// flecha verde (reabsorción, hacia la sangre) o roja (secreción, hacia la
// luz). Puramente esquemático — no representa proporciones reales.
function svgFlujo(flujo) {
    if (!flujo || flujo.length === 0) return '';
    const seq = flujoSvgSeq++;
    const rowH = 22;
    const h = 26 + flujo.length * rowH;

    const defs = [];
    const filas = flujo.map((f, i) => {
        const y = 30 + i * rowH;
        const reabsorcion = f.direccion === 'reabsorcion';
        const color = reabsorcion ? 'var(--accent-green)' : 'var(--accent-red)';
        const [x1, x2] = reabsorcion ? [58, 142] : [142, 58];
        const markerId = `canal-flujo-arrow-${seq}-${i}`;
        defs.push(`<marker id="${markerId}" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="${color}"/></marker>`);
        return `
            <text x="100" y="${y - 7}" font-size="9" fill="${color}" text-anchor="middle" font-weight="bold">${f.ion}</text>
            <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="2" marker-end="url(#${markerId})"/>
        `;
    }).join('');

    return `
        <svg class="canal-flujo-svg" viewBox="0 0 200 ${h}" preserveAspectRatio="xMidYMin meet">
            <defs>${defs.join('')}</defs>
            <line x1="58" y1="14" x2="58" y2="${h - 6}" stroke="var(--border-color)" stroke-width="1.5" stroke-dasharray="3,2"/>
            <line x1="142" y1="14" x2="142" y2="${h - 6}" stroke="var(--border-color)" stroke-width="1.5" stroke-dasharray="3,2"/>
            <text x="29" y="12" font-size="7.5" fill="var(--text-muted)" text-anchor="middle" letter-spacing="0.5">LUZ</text>
            <text x="100" y="12" font-size="7.5" fill="var(--text-muted)" text-anchor="middle" letter-spacing="0.5">CÉLULA</text>
            <text x="171" y="12" font-size="7.5" fill="var(--text-muted)" text-anchor="middle" letter-spacing="0.5">SANGRE</text>
            ${filas}
        </svg>
    `;
}

function renderCanales(cont, canales) {
    cont.innerHTML = canales.map(c => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('active')">
                <span>⚡ ${c.nombre}</span> <span class="toggle-icon">+</span>
            </div>
            <div class="micro-prof-body">
                <dl class="kv-row"><dt>Función</dt><dd>${c.funcion}</dd></dl>
                <dl class="kv-row"><dt>Diana farmacológica</dt><dd>${c.diana}</dd></dl>
                ${svgFlujo(c.flujo)}
            </div>
        </div>
    `).join('');
}

export function initNefrona({ onCategoria }) {
    const stage = document.getElementById('nefrona-photo-wrap');
    const panel = document.getElementById('nefro-panel-segmento');
    if (!stage || !panel) return { reset: () => {} };

    const titulo = document.getElementById('nefro-segmento-titulo');
    const canalesCont = document.getElementById('nefro-segmento-canales');
    const categoriasCont = document.getElementById('nefro-segmento-categorias');
    const modoSelect = document.getElementById('nefro-modo-select');
    const modoExplicacion = document.getElementById('nefro-modo-explicacion');

    function seleccionarSegmento(key) {
        const data = segmentosNefrona[key];
        if (!data) return;

        stage.querySelectorAll('[data-segmento]').forEach(g => g.classList.remove('segmento-activo'));
        stage.querySelectorAll(`[data-segmento="${key}"]`).forEach(g => g.classList.add('segmento-activo'));

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

    stage.addEventListener('click', (e) => {
        const g = e.target.closest('[data-segmento]');
        if (g) seleccionarSegmento(g.dataset.segmento);
    });

    panel.addEventListener('click', (e) => {
        const btn = e.target.closest('.nefro-categoria-btn');
        if (btn && onCategoria) onCategoria(btn.dataset.categoria);
    });

    function limpiarResaltadoModo() {
        stage.querySelectorAll('.canal-resaltado').forEach(g => g.classList.remove('canal-resaltado'));
    }

    modoSelect.addEventListener('change', () => {
        limpiarResaltadoModo();
        const modo = modosInteractivos[modoSelect.value];
        if (!modo) {
            modoExplicacion.style.display = 'none';
            return;
        }
        modo.segmentos.forEach(key =>
            stage.querySelectorAll(`[data-segmento="${key}"]`).forEach(g => g.classList.add('canal-resaltado')));
        modoExplicacion.style.display = 'block';
        modoExplicacion.innerHTML = `
            <strong>${modo.etiqueta}</strong>
            <p>${modo.explicacion}</p>
            <p style="color: var(--text-muted); font-size: 0.75rem;">Canal(es) implicado(s): ${modo.canales.join(', ')}</p>
            ${modo.link ? `<button class="quiz-siguiente nefro-modo-link" style="width:auto; display:inline-block; margin-top:8px; padding:6px 12px; font-size:0.75rem;">${modo.link.etiqueta}</button>` : ''}
        `;
        const linkBtn = modoExplicacion.querySelector('.nefro-modo-link');
        if (linkBtn && modo.link) {
            linkBtn.addEventListener('click', () => openCorkboardTopic(modo.link.panelId, modo.link.tabId));
        }
    });

    return {
        // Deselecciona segmento y limpia el modo interactivo. Se llama al
        // volver al menú de Nefrología desde una categoría, para que el
        // diagrama arranque siempre neutro.
        reset: () => {
            stage.querySelectorAll('[data-segmento]').forEach(g => g.classList.remove('segmento-activo'));
            limpiarResaltadoModo();
            panel.style.display = 'none';
            modoSelect.value = '';
            modoExplicacion.style.display = 'none';
        },
    };
}
