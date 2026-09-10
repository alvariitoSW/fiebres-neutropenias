// Modo Estudio: estima cuántos pomodoros (25 min de enfoque + 5 min de
// descanso, editables) cuesta cada ficha de la app — leer su contenido y,
// aparte, responder las preguntas de quiz que le corresponden —, ofrece un
// reloj Pomodoro real con contador de pomodoros completados, y lleva un
// progreso de estudio por ficha (cuánto llevas / cuánto te falta) que se
// conserva entre sesiones distintas.
//
// Genérico, igual que core/corkboard.js: se calcula UNA vez a partir del
// DOM ya cargado (todas las fichas de todas las especialidades están en
// la página desde el arranque, aunque ocultas — ver core/include.js) y
// del banco de quiz ya fusionado que main.js pasa a initQuiz(). No hace
// falta tocar el HTML/JS de ningún módulo concreto para que sus fichas
// muestren la estimación ni el progreso.
//
// Decisiones de arquitectura explícitas (ver CLAUDE.md): este módulo usa
// localStorage para 3 cosas — el nº de pomodoros completados
// ('hud-pomodoros-completados'), la duración de enfoque/descanso
// configurada por el usuario ('hud-pomodoro-config'), y el progreso de
// estudio por ficha ('hud-estudio-progreso'). Es la segunda excepción
// deliberada y acotada a la regla "sin persistencia" del proyecto — la
// primera es el propio quiz, que ya recuerda aciertos/fallos por
// pregunta en el dispositivo.

const PALABRAS_POR_MINUTO = 180; // lectura técnica en español, estimación
const MIN_POR_PREGUNTA_OPCION = 1.2;
const MIN_POR_PREGUNTA_REDACTAR = 2.5;
const ENFOQUE_DEFECTO = 25;
const DESCANSO_DEFECTO = 5;
const ENFOQUE_MAX = 180;
const DESCANSO_MAX = 60;

const STORAGE_CONTADOR = 'hud-pomodoros-completados';
const STORAGE_CONFIG = 'hud-pomodoro-config';
const STORAGE_PROGRESO = 'hud-estudio-progreso';

let estimaciones = new Map(); // tabId -> { minLectura, minPreguntas, minTotal, pomodoros, nPreguntas }
let progreso = {}; // tabId -> nº de pomodoros ya "invertidos" en esa ficha

function contarPalabras(texto) {
    const m = (texto || '').trim().match(/\S+/g);
    return m ? m.length : 0;
}

function calcularEstimaciones(quizBanco) {
    const mapa = new Map();
    const preguntasPorTema = new Map();
    (quizBanco || []).forEach(p => {
        if (!p || !p.tema) return;
        if (!preguntasPorTema.has(p.tema)) preguntasPorTema.set(p.tema, []);
        preguntasPorTema.get(p.tema).push(p);
    });

    document.querySelectorAll('.field-card[data-tab]').forEach(card => {
        const tab = card.dataset.tab;
        if (!tab || mapa.has(tab)) return;
        const contenido = document.getElementById(tab);
        if (!contenido) return;

        const minLectura = contarPalabras(contenido.textContent) / PALABRAS_POR_MINUTO;
        const preguntas = preguntasPorTema.get(tab) || [];
        const minPreguntas = preguntas.reduce((acc, p) =>
            acc + (p.tipo === 'redactar' ? MIN_POR_PREGUNTA_REDACTAR : MIN_POR_PREGUNTA_OPCION), 0);
        const minTotal = minLectura + minPreguntas;
        const pomodoros = minTotal > 0 ? Math.max(1, Math.ceil(minTotal / ENFOQUE_DEFECTO)) : 0;

        mapa.set(tab, { minLectura, minPreguntas, minTotal, pomodoros, nPreguntas: preguntas.length });
    });
    return mapa;
}

// ---------- Persistencia ----------

function leerContador() {
    try { return parseInt(localStorage.getItem(STORAGE_CONTADOR), 10) || 0; }
    catch { return 0; }
}
function guardarContador(n) {
    try { localStorage.setItem(STORAGE_CONTADOR, String(n)); } catch { /* localStorage no disponible */ }
}

function leerConfig() {
    try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_CONFIG));
        if (raw && Number.isFinite(raw.enfoque) && Number.isFinite(raw.descanso)) {
            return {
                enfoque: Math.min(ENFOQUE_MAX, Math.max(1, Math.round(raw.enfoque))),
                descanso: Math.min(DESCANSO_MAX, Math.max(1, Math.round(raw.descanso))),
            };
        }
    } catch { /* localStorage no disponible o valor corrupto */ }
    return { enfoque: ENFOQUE_DEFECTO, descanso: DESCANSO_DEFECTO };
}
function guardarConfig(cfg) {
    try { localStorage.setItem(STORAGE_CONFIG, JSON.stringify(cfg)); } catch { /* localStorage no disponible */ }
}

function leerProgreso() {
    try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_PROGRESO));
        if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw;
    } catch { /* localStorage no disponible o valor corrupto */ }
    return {};
}
function guardarProgreso() {
    try { localStorage.setItem(STORAGE_PROGRESO, JSON.stringify(progreso)); } catch { /* localStorage no disponible */ }
}

let config = leerConfig();

// ---------- Progreso de estudio por ficha ----------

// De entre todos los .tab-content marcados .active (puede haber alguno
// suelto de otra vista oculta — cada especialidad tiene su propio grupo
// de pestañas independiente), busca el único que además es visible de
// verdad ahora mismo y corresponde a una ficha con estimación calculada.
function obtenerFichaActivaVisible() {
    const activos = document.querySelectorAll('.tab-content.active');
    for (const el of activos) {
        if (estimaciones.has(el.id) && el.offsetParent !== null) return el.id;
    }
    return null;
}

function progresoFicha(tab) {
    const est = estimaciones.get(tab);
    if (!est) return 0;
    return Math.min(est.pomodoros, progreso[tab] || 0);
}

function registrarProgresoFichaActiva() {
    const tab = obtenerFichaActivaVisible();
    if (!tab) return;
    const est = estimaciones.get(tab);
    if (!est || est.pomodoros === 0) return;
    progreso[tab] = Math.min(est.pomodoros, (progreso[tab] || 0) + 1);
    guardarProgreso();
    actualizarBadgeFicha(tab);
    actualizarResumenProgreso();
}

function alternarFichaEstudiada(tab) {
    const est = estimaciones.get(tab);
    if (!est) return;
    progreso[tab] = progresoFicha(tab) >= est.pomodoros ? 0 : est.pomodoros;
    guardarProgreso();
    actualizarBadgeFicha(tab);
    actualizarResumenProgreso();
}

function calcularResumenProgreso() {
    let total = 0, hechos = 0;
    estimaciones.forEach((est, tab) => {
        total += est.pomodoros;
        hechos += progresoFicha(tab);
    });
    return {
        total, hechos, restantes: total - hechos,
        pct: total > 0 ? Math.round((hechos / total) * 100) : 0,
    };
}

// ---------- Etiquetas de pomodoros por ficha ----------

function contenidoBadge(tab) {
    const est = estimaciones.get(tab);
    if (!est) return { html: '', completa: false };
    const hecho = progresoFicha(tab);
    const completa = est.pomodoros > 0 && hecho >= est.pomodoros;
    const detalles = [];
    if (est.minLectura > 0) detalles.push(`📖~${Math.max(1, Math.round(est.minLectura))}m`);
    if (est.minPreguntas > 0) detalles.push(`❓~${Math.max(1, Math.round(est.minPreguntas))}m`);
    const html = `<span class="pomo-badge-total">${completa ? '✅' : '🍅'} ${hecho}/${est.pomodoros}</span>` +
        (detalles.length ? `<span class="pomo-badge-detail">${detalles.join(' ')}</span>` : '');
    return { html, completa };
}

function actualizarBadgeFicha(tab) {
    document.querySelectorAll(`.pomo-badge[data-tab="${tab}"]`).forEach(badge => {
        const { html, completa } = contenidoBadge(tab);
        badge.innerHTML = html;
        badge.classList.toggle('pomo-done', completa);
    });
}

function inyectarBadges() {
    document.querySelectorAll('.field-card[data-tab]').forEach(card => {
        const tab = card.dataset.tab;
        const est = estimaciones.get(tab);
        if (!est || est.pomodoros === 0) return;
        const front = card.querySelector('.card-face.front');
        if (!front || front.querySelector('.pomo-badge')) return;

        const badge = document.createElement('div');
        badge.className = 'pomo-badge';
        badge.dataset.tab = tab;
        const { html, completa } = contenidoBadge(tab);
        badge.innerHTML = html;
        badge.classList.toggle('pomo-done', completa);
        badge.title = 'Toca para marcar/desmarcar esta ficha como estudiada';
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            alternarFichaEstudiada(tab);
        });
        front.appendChild(badge);
    });
}

// ---------- Reloj Pomodoro ----------

const estado = { fase: 'trabajo', finEn: null, corriendo: false, restanteMs: config.enfoque * 60000 };
let intervalId = null;
const el = {};

function formatoTiempo(ms) {
    const totalSeg = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSeg / 60);
    const s = totalSeg % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function actualizarUI() {
    if (!el.tiempo) return;
    el.tiempo.textContent = formatoTiempo(estado.restanteMs);
    el.fase.textContent = estado.fase === 'trabajo' ? 'Enfoque' : 'Descanso';
    el.panel.classList.toggle('pomo-descanso', estado.fase === 'descanso');
    el.contador.textContent = leerContador();
    el.btnStart.textContent = estado.corriendo ? '⏸ Pausar' : '▶ Iniciar';
}

function actualizarResumenProgreso() {
    if (!el.progresoFill) return;
    const r = calcularResumenProgreso();
    el.progresoFill.style.width = `${r.pct}%`;
    el.progresoTexto.innerHTML = `Progreso: <strong>${r.hechos}/${r.total}</strong> 🍅 (${r.pct}%)`;
    el.progresoResto.innerHTML = r.total === 0
        ? 'Sin fichas con contenido aún'
        : (r.restantes > 0 ? `Quedan ~<strong>${r.restantes}</strong> pomodoros por estudiar` : '¡Todo estudiado! 🎉');
}

function cambiarFase() {
    if (estado.fase === 'trabajo') {
        guardarContador(leerContador() + 1);
        registrarProgresoFichaActiva();
        estado.fase = 'descanso';
        estado.restanteMs = config.descanso * 60000;
    } else {
        estado.fase = 'trabajo';
        estado.restanteMs = config.enfoque * 60000;
    }
    estado.finEn = Date.now() + estado.restanteMs;
    actualizarUI();
    if (el.panel) {
        el.panel.classList.add('pomo-cambio');
        setTimeout(() => el.panel.classList.remove('pomo-cambio'), 700);
    }
}

// Basado en la hora de fin (Date.now() + duración), no en descontar
// segundo a segundo — así no acumula deriva si la pestaña se queda en
// segundo plano y el intervalo deja de dispararse puntualmente.
function tick() {
    if (!estado.corriendo) return;
    const restante = estado.finEn - Date.now();
    if (restante <= 0) {
        cambiarFase();
        return;
    }
    estado.restanteMs = restante;
    actualizarUI();
}

function iniciarPausar() {
    if (estado.corriendo) {
        estado.corriendo = false;
        estado.restanteMs = Math.max(0, estado.finEn - Date.now());
        clearInterval(intervalId);
    } else {
        estado.corriendo = true;
        estado.finEn = Date.now() + estado.restanteMs;
        intervalId = setInterval(tick, 250);
    }
    actualizarUI();
}

function reiniciar() {
    estado.corriendo = false;
    clearInterval(intervalId);
    estado.fase = 'trabajo';
    estado.restanteMs = config.enfoque * 60000;
    actualizarUI();
}

// Aplica una duración editada por el usuario. Si el reloj está corriendo,
// el cambio se guarda para la próxima fase (no se toca la cuenta atrás en
// marcha, para no dar un salto brusco en mitad de una sesión); si está
// parado y la fase visible es la que se acaba de editar, se refleja ya.
function aplicarConfig(campo, input) {
    const limite = campo === 'enfoque' ? ENFOQUE_MAX : DESCANSO_MAX;
    const porDefecto = campo === 'enfoque' ? ENFOQUE_DEFECTO : DESCANSO_DEFECTO;
    let val = parseInt(input.value, 10);
    if (!Number.isFinite(val) || val < 1) val = porDefecto;
    val = Math.min(limite, Math.max(1, val));
    input.value = val;

    config[campo] = val;
    guardarConfig(config);

    const faseAfectada = campo === 'enfoque' ? 'trabajo' : 'descanso';
    if (!estado.corriendo && estado.fase === faseAfectada) {
        estado.restanteMs = val * 60000;
        actualizarUI();
    }
}

function construirWidget() {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'pomodoro-fab';
    fab.className = 'pomodoro-fab';
    fab.textContent = '🍅';
    fab.setAttribute('aria-label', 'Abrir reloj Pomodoro');

    const panel = document.createElement('div');
    panel.id = 'pomodoro-panel';
    panel.className = 'pomodoro-panel';
    panel.innerHTML = `
        <div class="pomo-panel-head">
            <span>🍅 Pomodoro</span>
            <button type="button" class="pomo-panel-close" aria-label="Cerrar">✕</button>
        </div>
        <div class="pomo-fase">Enfoque</div>
        <div class="pomo-tiempo">25:00</div>
        <div class="pomo-botones">
            <button type="button" class="pomo-btn pomo-btn-start">▶ Iniciar</button>
            <button type="button" class="pomo-btn pomo-btn-reset">↺ Reiniciar</button>
        </div>
        <div class="pomo-config">
            <label class="pomo-config-label">Enfoque (min)
                <input type="number" class="pomo-config-input" id="pomo-cfg-enfoque" min="1" max="${ENFOQUE_MAX}">
            </label>
            <label class="pomo-config-label">Descanso (min)
                <input type="number" class="pomo-config-input" id="pomo-cfg-descanso" min="1" max="${DESCANSO_MAX}">
            </label>
        </div>
        <div class="pomo-contador">Pomodoros completados: <strong>0</strong></div>
        <div class="pomo-progreso">
            <div class="pomo-progreso-barra"><div class="pomo-progreso-fill"></div></div>
            <div class="pomo-progreso-texto">Progreso: <strong>0/0</strong> 🍅 (0%)</div>
            <div class="pomo-progreso-resto">Quedan ~<strong>0</strong> pomodoros por estudiar</div>
        </div>
        <p class="pomo-hint">Toca el 🍅 de una ficha para marcarla/desmarcarla como estudiada.</p>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    el.fab = fab;
    el.panel = panel;
    el.fase = panel.querySelector('.pomo-fase');
    el.tiempo = panel.querySelector('.pomo-tiempo');
    el.btnStart = panel.querySelector('.pomo-btn-start');
    el.contador = panel.querySelector('.pomo-contador strong');
    el.cfgEnfoque = panel.querySelector('#pomo-cfg-enfoque');
    el.cfgDescanso = panel.querySelector('#pomo-cfg-descanso');
    el.progresoFill = panel.querySelector('.pomo-progreso-fill');
    el.progresoTexto = panel.querySelector('.pomo-progreso-texto');
    el.progresoResto = panel.querySelector('.pomo-progreso-resto');

    el.cfgEnfoque.value = config.enfoque;
    el.cfgDescanso.value = config.descanso;

    fab.addEventListener('click', () => panel.classList.toggle('active'));
    panel.querySelector('.pomo-panel-close').addEventListener('click', () => panel.classList.remove('active'));
    el.btnStart.addEventListener('click', iniciarPausar);
    panel.querySelector('.pomo-btn-reset').addEventListener('click', reiniciar);
    el.cfgEnfoque.addEventListener('change', () => aplicarConfig('enfoque', el.cfgEnfoque));
    el.cfgDescanso.addEventListener('change', () => aplicarConfig('descanso', el.cfgDescanso));

    actualizarUI();
}

function toggleStudyMode() {
    const on = document.body.classList.toggle('study-mode-on');
    const btn = document.getElementById('btn-modo-estudio');
    if (btn) btn.classList.toggle('active', on);
    if (!on) {
        // Al salir de Modo Estudio se oculta el reloj (CSS), pero se pausa
        // también su cuenta atrás para no seguir corriendo en segundo plano.
        if (estado.corriendo) iniciarPausar();
        el.panel && el.panel.classList.remove('active');
    }
}

export function initStudyMode({ quizBanco } = {}) {
    estimaciones = calcularEstimaciones(quizBanco);
    progreso = leerProgreso();
    estado.restanteMs = config.enfoque * 60000;
    inyectarBadges();
    construirWidget();
    actualizarResumenProgreso();
    const btn = document.getElementById('btn-modo-estudio');
    if (btn) btn.addEventListener('click', toggleStudyMode);
}
