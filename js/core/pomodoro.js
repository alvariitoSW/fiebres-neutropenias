// Modo Estudio: estima cuántos pomodoros (25 min de enfoque + 5 min de
// descanso) cuesta cada ficha de la app — leer su contenido y, aparte,
// responder las preguntas de quiz que le corresponden —, y ofrece un
// reloj Pomodoro real con contador de pomodoros completados.
//
// Genérico, igual que core/corkboard.js: se calcula UNA vez a partir del
// DOM ya cargado (todas las fichas de todas las especialidades están en
// la página desde el arranque, aunque ocultas — ver core/include.js) y
// del banco de quiz ya fusionado que main.js pasa a initQuiz(). No hace
// falta tocar el HTML/JS de ningún módulo concreto para que sus fichas
// muestren la estimación.
//
// Decisión de arquitectura explícita: el contador de pomodoros
// completados se guarda en localStorage (clave 'hud-pomodoros-completados').
// Es la SEGUNDA excepción deliberada y acotada a la regla "sin
// persistencia" del proyecto (ver CLAUDE.md) — la primera es el propio
// quiz, que ya recuerda aciertos/fallos por pregunta en el dispositivo.

const PALABRAS_POR_MINUTO = 180; // lectura técnica en español, estimación
const MIN_POR_PREGUNTA_OPCION = 1.2;
const MIN_POR_PREGUNTA_REDACTAR = 2.5;
const MIN_POMODORO = 25;
const MIN_DESCANSO = 5;
const STORAGE_KEY = 'hud-pomodoros-completados';

let estimaciones = new Map(); // tabId -> { minLectura, minPreguntas, minTotal, pomodoros, nPreguntas }

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
        const pomodoros = minTotal > 0 ? Math.max(1, Math.ceil(minTotal / MIN_POMODORO)) : 0;

        mapa.set(tab, { minLectura, minPreguntas, minTotal, pomodoros, nPreguntas: preguntas.length });
    });
    return mapa;
}

function inyectarBadges() {
    document.querySelectorAll('.field-card[data-tab]').forEach(card => {
        if (card.querySelector('.pomo-badge')) return;
        const est = estimaciones.get(card.dataset.tab);
        if (!est || est.pomodoros === 0) return;
        const front = card.querySelector('.card-face.front');
        if (!front) return;

        const detalles = [];
        if (est.minLectura > 0) detalles.push(`📖~${Math.max(1, Math.round(est.minLectura))}m`);
        if (est.minPreguntas > 0) detalles.push(`❓~${Math.max(1, Math.round(est.minPreguntas))}m`);

        const badge = document.createElement('div');
        badge.className = 'pomo-badge';
        badge.innerHTML = `<span class="pomo-badge-total">🍅×${est.pomodoros}</span>` +
            (detalles.length ? `<span class="pomo-badge-detail">${detalles.join(' ')}</span>` : '');
        front.appendChild(badge);
    });
}

// ---------- Reloj Pomodoro ----------

const estado = { fase: 'trabajo', finEn: null, corriendo: false, restanteMs: MIN_POMODORO * 60000 };
let intervalId = null;
const el = {};

function leerContador() {
    try { return parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0; }
    catch { return 0; }
}
function guardarContador(n) {
    try { localStorage.setItem(STORAGE_KEY, String(n)); } catch { /* localStorage no disponible */ }
}

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

function cambiarFase() {
    if (estado.fase === 'trabajo') {
        guardarContador(leerContador() + 1);
        estado.fase = 'descanso';
        estado.restanteMs = MIN_DESCANSO * 60000;
    } else {
        estado.fase = 'trabajo';
        estado.restanteMs = MIN_POMODORO * 60000;
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
    estado.restanteMs = MIN_POMODORO * 60000;
    actualizarUI();
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
        <div class="pomo-contador">Pomodoros completados: <strong>0</strong></div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    el.fab = fab;
    el.panel = panel;
    el.fase = panel.querySelector('.pomo-fase');
    el.tiempo = panel.querySelector('.pomo-tiempo');
    el.btnStart = panel.querySelector('.pomo-btn-start');
    el.contador = panel.querySelector('.pomo-contador strong');

    fab.addEventListener('click', () => panel.classList.toggle('active'));
    panel.querySelector('.pomo-panel-close').addEventListener('click', () => panel.classList.remove('active'));
    el.btnStart.addEventListener('click', iniciarPausar);
    panel.querySelector('.pomo-btn-reset').addEventListener('click', reiniciar);

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
    inyectarBadges();
    construirWidget();
    const btn = document.getElementById('btn-modo-estudio');
    if (btn) btn.addEventListener('click', toggleStudyMode);
}
