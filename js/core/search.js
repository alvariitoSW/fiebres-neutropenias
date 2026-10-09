// Buscador global: indexa en tiempo real todas las fichas (.field-card
// [data-tab]) ya cargadas en el DOM de todas las especialidades — mismo
// patrón de recorrido del DOM ya usado por core/pomodoro.js, no una
// reimplementación — y las hace buscables desde cualquier pantalla. La
// navegación a cada resultado reutiliza el mecanismo ya generalizado que
// usan los botones `.especialidad-link` (ver irAResultadoBusqueda en
// modules/home/index.js), inyectado aquí como callback en vez de
// duplicarlo.
//
// Alcance: las fichas del patrón cuaderno de campo (core/corkboard.js),
// donde vive la inmensa mayoría del contenido teórico, más las tarjetas de
// las vistas listadas en VISTAS_TARJETAS (Neutropenia Febril y Escalas
// Generales). Siguen fuera la tabla de 585 fármacos de Nefrotoxicidad y la
// guía transversal IRA/ERC — para añadir otra vista de tarjetas basta una
// entrada más en VISTAS_TARJETAS.

import { nombreFicha } from './corkboard.js';
import { escapeHtml } from './ui.js';
import { textoFuente, resaltar } from './vista-visual.js';

const ESPECIALIDADES = {
    home: { nombre: 'Hematología', icono: '🩸', color: 'var(--accent-red)' },
    nefrologia: { nombre: 'Nefrología', icono: '🫘', color: 'var(--accent-green)' },
    uciPapers: { nombre: 'UCI / Papers Tuiter', icono: '🐦', color: 'var(--accent-purple)' },
    fisioUci: { nombre: 'Fisiopatología UCI', icono: '🧬', color: 'var(--accent-yellow)' },
    cardiologia: { nombre: 'Cardiología', icono: '🫀', color: 'var(--accent-blue)' },
    neumologia: { nombre: 'Neumología', icono: '🫁', color: 'var(--accent-green)' },
    sobrevivirUmi: { nombre: 'Sobrevivir a la UMI', icono: '📋', color: 'var(--accent-purple)' },
};
const ORDEN_ESPECIALIDADES = ['home', 'nefrologia', 'uciPapers', 'fisioUci', 'cardiologia', 'neumologia', 'sobrevivirUmi'];

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

    // Sobrevivir a la UMI
    'panel-manual-umi-tabs': { especialidad: 'sobrevivirUmi', view: 'manualUmi', bloque: 'Manual UMI Negrín' },
};

// Vistas sin cuaderno de campo cuyas tarjetas (.card de primer nivel con
// su <h3>) también se indexan: cada una dice cómo llegar — especialidad +
// vista raíz + los botones YA existentes que hay que pulsar, en orden —, y
// al elegir el resultado se hace scroll a la tarjeta y se resalta.
const VISTAS_TARJETAS = {
    'hemato-main-view': { especialidad: 'home', view: 'citopenias', botones: ['btn-neutropenia-febril'], bloque: 'Neutropenia Febril' },
    'hemato-diagnostico-view': { especialidad: 'home', view: 'citopenias', botones: ['btn-neutropenia-febril', 'btn-diagnostico'], bloque: 'Neutropenia Febril — Diagnóstico' },
    'hemato-tratamiento-view': { especialidad: 'home', view: 'citopenias', botones: ['btn-neutropenia-febril', 'btn-tratamiento'], bloque: 'Neutropenia Febril — Tratamiento empírico' },
    'hemato-dirigido-view': { especialidad: 'home', view: 'citopenias', botones: ['btn-neutropenia-febril', 'btn-dirigido'], bloque: 'Neutropenia Febril — Tratamiento dirigido' },
    'escalas-generales-view': { especialidad: 'home', view: 'escalas', botones: [], bloque: 'Escalas Generales' },
};

const MIN_CHARS = 2;
const MAX_RESULTADOS = 40;

function construirIndice() {
    const indice = [];
    const vistos = new Set();
    document.querySelectorAll('.field-card[data-tab]').forEach(card => {
        const tab = card.dataset.tab;
        if (!tab || vistos.has(tab)) return;
        vistos.add(tab);
        const contenido = document.getElementById(tab);
        if (!contenido) return;
        const panelEl = contenido.closest('[id^="panel-"]');
        const nav = panelEl && PANEL_NAV[panelEl.id];
        if (!nav) return; // panel sin ruta de navegación conocida: se omite en vez de arriesgar un resultado roto
        const titulo = nombreFicha(card);
        if (!titulo) return;
        indice.push({
            clave: tab,
            tab,
            titulo,
            panel: panelEl.id,
            nav,
            tituloBusqueda: titulo.toLowerCase(),
            textoBusqueda: textoFuente(contenido).toLowerCase(),
        });
    });
    Object.entries(VISTAS_TARJETAS).forEach(([vistaId, nav]) => {
        const vista = document.getElementById(vistaId);
        if (!vista) return;
        [...vista.querySelectorAll('.card')].filter(c => !c.parentElement.closest('.card')).forEach((card, k) => {
            const titulo = (card.querySelector('h3, .vista-grupo-titulo')?.textContent || '').replace(/\s+/g, ' ').trim();
            if (!titulo || /^fuentes$/i.test(titulo)) return;
            indice.push({
                clave: `${vistaId}#${k}`,
                el: card,
                titulo,
                nav,
                tituloBusqueda: titulo.toLowerCase(),
                textoBusqueda: textoFuente(card).toLowerCase(),
            });
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

export function initSearch({ navegar }) {
    const btnAbrir = document.getElementById('btn-buscar-global');
    if (!btnAbrir) return;

    // El índice (textContent de ~300 fichas) se construye la primera vez que
    // se abre el buscador, no en el arranque — la mayoría de visitas nunca
    // lo abren y no hay motivo para pagar ese recorrido del DOM al cargar.
    let indice = null;

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
                <button type="button" class="search-result-row" style="--srg-color: ${esp.color};" data-clave="${escapeHtml(item.clave)}">
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
                const item = indice.find(i => i.clave === btn.dataset.clave);
                if (!item) return;
                cerrar();
                if (item.el) {
                    navegar?.({ especialidad: item.nav.especialidad, view: item.nav.view });
                    item.nav.botones.forEach(id => document.getElementById(id)?.click());
                    requestAnimationFrame(() => resaltar(item.el));
                    return;
                }
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
        if (!indice) indice = construirIndice();
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
