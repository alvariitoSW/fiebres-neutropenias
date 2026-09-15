// Buscador global: indexa en tiempo real todas las fichas (.field-card
// [data-tab]) ya cargadas en el DOM de todas las especialidades — mismo
// patrón de recorrido del DOM ya usado por core/pomodoro.js, no una
// reimplementación — y las hace buscables desde cualquier pantalla. La
// navegación a cada resultado reutiliza el mecanismo ya generalizado que
// usan los botones `.especialidad-link` (ver irAResultadoBusqueda en
// modules/home/index.js), inyectado aquí como callback en vez de
// duplicarlo.
//
// Alcance v1, deliberado: solo fichas del patrón cuaderno de campo
// (core/corkboard.js), que es donde vive la inmensa mayoría del contenido
// teórico de la app. Quedan fuera las calculadoras/tablas de referencia
// sueltas que no usan .field-card (Escalas Generales, Neutropenia Febril,
// la tabla de 585 fármacos de Nefrotoxicidad, la guía transversal
// IRA/ERC) — ampliar el alcance a esas páginas es un paso aparte, no
// simplemente añadir entradas a PANEL_NAV.

function nombreFicha(card) {
    const el = card.querySelector('.field-name');
    if (!el) return '';
    return el.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
}

const ESPECIALIDADES = {
    home: { nombre: 'Hematología', icono: '🩸', color: 'var(--accent-red)' },
    nefrologia: { nombre: 'Nefrología', icono: '🫘', color: 'var(--accent-green)' },
    uciPapers: { nombre: 'UCI / Papers Tuiter', icono: '🐦', color: 'var(--accent-purple)' },
    fisioUci: { nombre: 'Fisiopatología UCI', icono: '🧬', color: 'var(--accent-yellow)' },
    cardiologia: { nombre: 'Cardiología', icono: '🫀', color: 'var(--accent-blue)' },
    neumologia: { nombre: 'Neumología', icono: '🫁', color: 'var(--accent-green)' },
};
const ORDEN_ESPECIALIDADES = ['home', 'nefrologia', 'uciPapers', 'fisioUci', 'cardiologia', 'neumologia'];

// panelId (el mismo que ya recibe openCorkboardTopic) → cómo llegar hasta
// él: especialidad + clave de vista de su switcher medio (y, solo para
// Trasplante de Hematología, la clave del switcher interno de más abajo)
// + una etiqueta legible del bloque/guía/paper para el breadcrumb de cada
// resultado. Construido a mano a partir de los initCorkboard(...) reales
// (ver grep en todo js/modules) y de los createViewSwitcher(...) de cada
// index.js de especialidad — nunca inferido, para no arriesgar un
// resultado de búsqueda que navegue a un sitio equivocado o roto.
const PANEL_NAV = {
    // Hematología (especialidad 'home' — switcher raíz de home/index.js)
    'panel-reconocimiento-tabs': { especialidad: 'home', view: 'reconocimiento', bloque: 'Reconocimiento Temprano del Paciente Hematológico' },
    'panel-sindromes-tabs': { especialidad: 'home', view: 'sindromes', bloque: 'Síndromes Hematológicos Urgentes' },
    'panel-tph-tabs': { especialidad: 'home', view: 'trasplante', trasplante: 'intro', bloque: 'Trasplante TPH — Introducción' },
    'panel-cart-tabs': { especialidad: 'home', view: 'trasplante', trasplante: 'cart', bloque: 'Trasplante TPH — CAR-T' },
    'panel-tph-comp-tabs': { especialidad: 'home', view: 'trasplante', trasplante: 'complicaciones', bloque: 'Trasplante TPH — Complicaciones post-TPH' },
    'panel-merino-tabs': { especialidad: 'home', view: 'merinoHemato', bloque: 'Merino HEMATO' },

    // Nefrología
    'panel-fisio-tabs': { especialidad: 'nefrologia', view: 'nefrona', bloque: 'Fisiología renal y electrolitos' },
    'panel-hta-tabs': { especialidad: 'nefrologia', view: 'hta', bloque: 'Hipertensión Arterial' },
    'panel-erc-tabs': { especialidad: 'nefrologia', view: 'erc', bloque: 'Enfermedad Renal Crónica' },
    'panel-fra-tabs': { especialidad: 'nefrologia', view: 'fra', bloque: 'Fracaso Renal Agudo' },
    'panel-trr-tabs': { especialidad: 'nefrologia', view: 'trr', bloque: 'Terapias de Reemplazo Renal' },
    'panel-trasplante-renal-tabs': { especialidad: 'nefrologia', view: 'trasplanteRenal', bloque: 'Trasplante renal y enfermedades glomerulares' },

    // UCI / Papers Tuiter
    'panel-uci-shock-tabs': { especialidad: 'uciPapers', view: 'shockSeptico', bloque: 'Resucitación hemodinámica en el shock séptico' },
    'panel-no-tabs': { especialidad: 'uciPapers', view: 'oxidoNitrico', bloque: 'Óxido nítrico inhalado' },
    'panel-vdlra-tabs': { especialidad: 'uciPapers', view: 'vdLra', bloque: 'Disfunción del VD y LRA postoperatoria' },
    'panel-vexus-tabs': { especialidad: 'uciPapers', view: 'vexus', bloque: 'VExUS: congestión venosa' },
    'panel-extub-tabs': { especialidad: 'uciPapers', view: 'extubacionPuma', bloque: 'Guías PUMA de extubación traqueal' },
    'panel-citrato-tabs': { especialidad: 'uciPapers', view: 'citratoTrr', bloque: 'Toxicidad por citrato en TRR' },

    // Fisiopatología UCI
    'panel-fuci-hemato-tabs': { especialidad: 'fisioUci', view: 'hematologia', bloque: 'Hematología y Hemostasia' },
    'panel-vu-tabs': { especialidad: 'fisioUci', view: 'viasUrinarias', bloque: 'Vías Urinarias' },
    'panel-cardio-tabs': { especialidad: 'fisioUci', view: 'cardiologia', bloque: 'Cardiología (fisiopatología pura)' },
    'panel-inmuno-tabs': { especialidad: 'fisioUci', view: 'inmunologia', bloque: 'Inmunología' },

    // Cardiología
    'panel-cardio-ic-tabs': { especialidad: 'cardiologia', view: 'insuficienciaCardiaca', bloque: 'Insuficiencia Cardíaca (Guías ESC 2026)' },
    'panel-merino-cardio-tabs': { especialidad: 'cardiologia', view: 'merinoCardiologia', bloque: 'Merino Cardiología (Shock clínico)' },

    // Neumología
    'panel-merino-neumo-tabs': { especialidad: 'neumologia', view: 'merinoNeumologia', bloque: 'Merino Neumología' },
};

const MIN_CHARS = 2;
const MAX_RESULTADOS = 40;

function construirIndice() {
    const indice = [];
    document.querySelectorAll('.field-card[data-tab]').forEach(card => {
        const tab = card.dataset.tab;
        if (!tab || indice.some(i => i.tab === tab)) return;
        const contenido = document.getElementById(tab);
        if (!contenido) return;
        const panelEl = contenido.closest('[id^="panel-"]');
        const nav = panelEl && PANEL_NAV[panelEl.id];
        if (!nav) return; // panel sin ruta de navegación conocida: se omite en vez de arriesgar un resultado roto
        const titulo = nombreFicha(card);
        if (!titulo) return;
        indice.push({
            tab,
            titulo,
            panel: panelEl.id,
            nav,
            tituloBusqueda: titulo.toLowerCase(),
            textoBusqueda: contenido.textContent.toLowerCase(),
        });
    });
    return indice;
}

function buscar(indice, query) {
    const q = query.trim().toLowerCase();
    if (q.length < MIN_CHARS) return [];
    return indice
        .map(item => {
            let score = 0;
            if (item.tituloBusqueda.includes(q)) score += 2;
            if (item.textoBusqueda.includes(q)) score += 1;
            return score > 0 ? { ...item, score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RESULTADOS);
}

function agruparPorEspecialidad(resultados) {
    const grupos = new Map();
    resultados.forEach(r => {
        const key = r.nav.especialidad;
        if (!grupos.has(key)) grupos.set(key, []);
        grupos.get(key).push(r);
    });
    return ORDEN_ESPECIALIDADES
        .filter(key => grupos.has(key))
        .map(key => ({ especialidad: key, items: grupos.get(key) }));
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function initSearch({ navegar }) {
    const btnAbrir = document.getElementById('btn-buscar-global');
    if (!btnAbrir) return;

    const indice = construirIndice();

    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
        <div class="search-panel">
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input type="text" class="search-input-el" id="search-input-el" placeholder="Buscar en toda la app…" autocomplete="off">
                <button type="button" class="search-close" id="search-close-btn" aria-label="Cerrar buscador">×</button>
            </div>
            <p class="search-meta" id="search-meta"></p>
            <div class="search-results" id="search-results"></div>
        </div>`;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#search-input-el');
    const meta = overlay.querySelector('#search-meta');
    const resultsEl = overlay.querySelector('#search-results');
    const closeBtn = overlay.querySelector('#search-close-btn');

    function render(query) {
        if (query.trim().length < MIN_CHARS) {
            meta.textContent = '';
            resultsEl.innerHTML = '<p class="search-hint">Escribe al menos 2 letras para buscar en las fichas de todas las especialidades.</p>';
            return;
        }
        const resultados = buscar(indice, query);
        if (resultados.length === 0) {
            meta.textContent = '';
            resultsEl.innerHTML = '<p class="search-hint">Sin resultados.</p>';
            return;
        }
        const grupos = agruparPorEspecialidad(resultados);
        meta.innerHTML = `<strong>${resultados.length}</strong> resultado${resultados.length === 1 ? '' : 's'} en ${grupos.length} especialidad${grupos.length === 1 ? '' : 'es'}`;
        resultsEl.innerHTML = grupos.map(g => {
            const esp = ESPECIALIDADES[g.especialidad];
            const filas = g.items.map(item => `
                <button type="button" class="search-result-row" style="--srg-color: ${esp.color};" data-tab="${item.tab}">
                    <span class="search-result-text">
                        <span class="search-result-title">${escapeHtml(item.titulo)}</span>
                        <span class="search-result-crumb">${escapeHtml(item.nav.bloque)}</span>
                    </span>
                    <span class="search-result-arrow">→</span>
                </button>`).join('');
            return `
                <div class="search-result-group">
                    <div class="search-result-group-head" style="--srg-color: ${esp.color};">
                        <span class="search-result-group-icon" style="--srg-color: ${esp.color};">${esp.icono}</span>
                        <span class="search-result-group-label">${esp.nombre}</span>
                    </div>
                    ${filas}
                </div>`;
        }).join('');

        resultsEl.querySelectorAll('.search-result-row').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = indice.find(i => i.tab === btn.dataset.tab);
                if (!item) return;
                cerrar();
                navegar?.({
                    especialidad: item.nav.especialidad,
                    view: item.nav.view,
                    trasplante: item.nav.trasplante,
                    panel: item.panel,
                    tab: item.tab,
                });
            });
        });
    }

    function abrir() {
        overlay.classList.add('active');
        input.value = '';
        render('');
        setTimeout(() => input.focus(), 30);
    }
    function cerrar() {
        overlay.classList.remove('active');
    }

    input.addEventListener('input', () => render(input.value));
    closeBtn.addEventListener('click', cerrar);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) cerrar();
    });

    btnAbrir.addEventListener('click', abrir);
}
