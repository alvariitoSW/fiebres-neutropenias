// Motor genérico de quiz de repaso (tipo Anki, 4 opciones). No es
// específico de Nefrología — cualquier módulo puede llamar a
// initQuiz({ triggerId, banco }) con su propio banco de preguntas.
//
// Única excepción de persistencia del proyecto: guarda aciertos/fallos por
// pregunta en localStorage (solo ese dispositivo, sin cuentas ni
// servidor). Alcance deliberadamente mínimo por ahora: sin agenda de
// repaso ni algoritmo de selección — cada apertura recorre el banco en
// orden aleatorio simple. Ver nota de excepción en CLAUDE.md.
const STORAGE_KEY = 'quiz-progreso-v1';

function cargarProgreso() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; }
    catch { return {}; }
}

function registrarRespuesta(id, acierto) {
    const progreso = cargarProgreso();
    const actual = progreso[id] ?? { aciertos: 0, fallos: 0 };
    acierto ? actual.aciertos++ : actual.fallos++;
    progreso[id] = actual;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progreso));
}

function barajar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

export function initQuiz({ triggerId, banco }) {
    const trigger = document.getElementById(triggerId);
    const overlay = document.getElementById('quiz-modal-overlay');
    if (!trigger || !overlay) return;

    const progresoEl = document.getElementById('quiz-progreso');
    const enunciadoEl = document.getElementById('quiz-enunciado');
    const opcionesEl = document.getElementById('quiz-opciones');
    const explicacionEl = document.getElementById('quiz-explicacion');
    const siguienteBtn = document.getElementById('quiz-siguiente');
    const closeBtn = document.getElementById('quiz-modal-close');

    let orden = [];
    let indice = 0;

    function renderPregunta() {
        const pregunta = orden[indice];
        progresoEl.textContent = `Pregunta ${indice + 1} / ${orden.length}`;
        enunciadoEl.textContent = pregunta.enunciado;
        explicacionEl.style.display = 'none';
        siguienteBtn.style.display = 'none';

        opcionesEl.innerHTML = pregunta.opciones.map((op, i) =>
            `<button class="quiz-opcion" data-indice="${i}">${op}</button>`).join('');
    }

    function responder(i) {
        const pregunta = orden[indice];
        const botones = opcionesEl.querySelectorAll('.quiz-opcion');
        botones.forEach(b => b.disabled = true);

        const acierto = i === pregunta.correcta;
        botones[i].classList.add(acierto ? 'correcta' : 'incorrecta');
        if (!acierto) botones[pregunta.correcta].classList.add('correcta');

        registrarRespuesta(pregunta.id, acierto);

        explicacionEl.style.display = 'block';
        explicacionEl.textContent = pregunta.explicacion;
        siguienteBtn.style.display = 'inline-block';
        siguienteBtn.textContent = indice + 1 < orden.length ? 'Siguiente →' : 'Terminar';
    }

    opcionesEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-opcion');
        if (btn && !btn.disabled) responder(Number(btn.dataset.indice));
    });

    siguienteBtn.addEventListener('click', () => {
        indice++;
        if (indice < orden.length) renderPregunta();
        else overlay.classList.remove('active');
    });

    trigger.addEventListener('click', () => {
        orden = barajar(banco);
        indice = 0;
        overlay.classList.add('active');
        renderPregunta();
    });

    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
}
