// Dudas de guardia — bitácora de preguntas reales + lo que se averiguó
// después, agrupada por tema (no por fecha, para encontrarlas rápido la
// próxima vez que toque un caso parecido). A petición explícita del
// usuario, incluye un formulario real para escribir dudas nuevas desde
// el propio dispositivo — 3ª excepción documentada a "sin localStorage"
// (ver CLAUDE.md, "Decisiones de arquitectura"), mismo criterio ya usado
// por quiz.js/core/pomodoro.js: solo en este dispositivo, nunca se sube
// a ningún sitio. Las 3 entradas de ejemplo (dudas-guardia-ejemplos.js)
// nunca se editan ni se eliminan desde aquí — solo sirven para mostrar
// el formato antes de que lleguen dudas reales.
import { dudasEjemplo } from '../../data/dudas-guardia-ejemplos.js';

const STORAGE_KEY = 'hud-dudas-guardia';
const TEMA_DEFECTO = 'General';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function cargarDudasUsuario() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
    catch { return []; }
}

function guardarDudasUsuario(dudas) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(dudas)); }
    catch { /* localStorage no disponible */ }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatearFecha(iso) {
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return '';
    return `${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function dudaCardHtml(duda) {
    const eliminar = duda.ejemplo ? '' : `<button class="duda-eliminar-btn" data-eliminar="${duda.id}">🗑 Eliminar</button>`;
    const fuente = duda.fuente ? `<a class="duda-fuente">Fuente: ${escapeHtml(duda.fuente)}</a>` : '';
    return `
    <details class="duda-card">
        <summary class="duda-summary">
            <span class="duda-pregunta">${escapeHtml(duda.pregunta)}</span>
            <span class="duda-meta">
                <span class="duda-tag">${escapeHtml(duda.tema)}</span>
                <span class="duda-fecha">${formatearFecha(duda.fecha)}</span>
                <span class="duda-toggle-hint">toca para ver la respuesta ▾</span>
            </span>
        </summary>
        <div class="duda-respuesta">
            <p>${escapeHtml(duda.respuesta)}</p>
            ${fuente}${eliminar}
        </div>
    </details>`;
}

// Agrupa por tema (alfabético) y, dentro de cada tema, más reciente primero.
function agruparPorTema(dudas) {
    const grupos = new Map();
    dudas.forEach(d => {
        const tema = (d.tema || TEMA_DEFECTO).trim() || TEMA_DEFECTO;
        if (!grupos.has(tema)) grupos.set(tema, []);
        grupos.get(tema).push(d);
    });
    return [...grupos.entries()]
        .sort((a, b) => a[0].localeCompare(b[0], 'es'))
        .map(([tema, lista]) => [tema, lista.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))]);
}

function render() {
    const lista = document.getElementById('dudas-lista');
    if (!lista) return;
    const dudasUsuario = cargarDudasUsuario();
    const todas = [...dudasEjemplo, ...dudasUsuario];
    const grupos = agruparPorTema(todas);

    const grupoHtml = grupos.map(([tema, dudas]) =>
        `<p class="duda-grupo-label">${escapeHtml(tema)} (${dudas.length})</p>${dudas.map(dudaCardHtml).join('')}`
    ).join('');
    const vacioHtml = dudasUsuario.length === 0 ? `
    <div class="duda-empty-card">
        <p class="section-label" style="margin:0;">Todavía sin dudas reales propias</p>
        <p>Usa el formulario de arriba para añadir la primera — se guarda solo en este dispositivo.</p>
    </div>` : '';
    lista.innerHTML = grupoHtml + vacioHtml;

    // Datalist de temas ya usados, para autocompletar al escribir uno nuevo.
    const datalist = document.getElementById('duda-temas-datalist');
    if (datalist) {
        const temasUnicos = [...new Set(todas.map(d => d.tema).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
        datalist.innerHTML = temasUnicos.map(t => `<option value="${escapeHtml(t)}"></option>`).join('');
    }

    lista.querySelectorAll('[data-eliminar]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            guardarDudasUsuario(cargarDudasUsuario().filter(d => d.id !== btn.dataset.eliminar));
            render();
        });
    });
}

export function init() {
    render();

    const form = document.getElementById('duda-form');
    const btnAbrir = document.getElementById('btn-duda-nueva');
    if (!form || !btnAbrir) return;

    const campos = {
        tema: document.getElementById('duda-input-tema'),
        pregunta: document.getElementById('duda-input-pregunta'),
        respuesta: document.getElementById('duda-input-respuesta'),
        fuente: document.getElementById('duda-input-fuente'),
    };
    const TEXTO_ABRIR = '✏️ Añadir una duda nueva';
    const TEXTO_CERRAR = '✕ Cerrar formulario';

    btnAbrir.addEventListener('click', () => {
        const abierto = form.classList.toggle('active');
        btnAbrir.textContent = abierto ? TEXTO_CERRAR : TEXTO_ABRIR;
        if (abierto) campos.pregunta?.focus();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pregunta = campos.pregunta.value.trim();
        const respuesta = campos.respuesta.value.trim();
        if (!pregunta || !respuesta) return;
        guardarDudasUsuario([...cargarDudasUsuario(), {
            id: `u-${Date.now()}`,
            tema: campos.tema.value.trim() || TEMA_DEFECTO,
            pregunta,
            respuesta,
            fuente: campos.fuente.value.trim(),
            fecha: new Date().toISOString().slice(0, 10),
            ejemplo: false,
        }]);
        form.reset();
        form.classList.remove('active');
        btnAbrir.textContent = TEXTO_ABRIR;
        render();
    });
}
