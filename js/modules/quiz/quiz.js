// Motor genérico de quiz de repaso (tipo Anki, 4 opciones). No es
// específico de Nefrología — cualquier módulo puede llamar a
// initQuiz({ triggerId, banco }) con su propio banco de preguntas.
// Si además se pasa `temas` (array de { key, etiqueta }), se muestra antes
// una pantalla de selección de tema ("Todos los temas" + uno por cada
// entrada) que filtra el banco por su campo `tema` — opcional y con
// degradación elegante: sin `temas`, el quiz arranca directo como siempre.
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

export function initQuiz({ triggerId, banco, temas }) {
    const trigger = document.getElementById(triggerId);
    const overlay = document.getElementById('quiz-modal-overlay');
    if (!trigger || !overlay) return;

    const temasEl = document.getElementById('quiz-temas');
    const temasListaEl = document.getElementById('quiz-temas-lista');
    const progresoEl = document.getElementById('quiz-progreso');
    const enunciadoEl = document.getElementById('quiz-enunciado');
    const opcionesEl = document.getElementById('quiz-opciones');
    const explicacionEl = document.getElementById('quiz-explicacion');
    const siguienteBtn = document.getElementById('quiz-siguiente');
    const closeBtn = document.getElementById('quiz-modal-close');

    let orden = [];
    let indice = 0;

    function mostrarPantallaQuiz(visible) {
        [progresoEl, enunciadoEl, opcionesEl].forEach(el => el.style.display = visible ? '' : 'none');
        if (!visible) { explicacionEl.style.display = 'none'; siguienteBtn.style.display = 'none'; }
        if (temasEl) temasEl.style.display = visible ? 'none' : (temas ? 'block' : 'none');
    }

    function renderPregunta() {
        const pregunta = orden[indice];
        progresoEl.textContent = `Pregunta ${indice + 1} / ${orden.length}`;
        enunciadoEl.textContent = pregunta.enunciado;
        explicacionEl.style.display = 'none';
        siguienteBtn.style.display = 'none';

        opcionesEl.innerHTML = pregunta.opciones.map((op, i) =>
            `<button class="quiz-opcion" data-indice="${i}">${op}</button>`).join('');
    }

    function empezar(subBanco) {
        orden = barajar(subBanco);
        indice = 0;
        mostrarPantallaQuiz(true);
        renderPregunta();
    }

    function renderTemas() {
        if (!temasEl || !temasListaEl || !temas) return;
        const todas = { key: '', etiqueta: `Todos los temas (${banco.length})` };
        const lista = [todas, ...temas.map(t => ({ ...t, etiqueta: `${t.etiqueta} (${banco.filter(p => p.tema === t.key).length})` }))];
        temasListaEl.innerHTML = lista.map(t =>
            `<button class="quiz-opcion" data-tema="${t.key}">${t.etiqueta}</button>`).join('');
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

    if (temasListaEl) {
        temasListaEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.quiz-opcion');
            if (!btn) return;
            const tema = btn.dataset.tema;
            const subBanco = tema ? banco.filter(p => p.tema === tema) : banco;
            empezar(subBanco);
        });
    }

    siguienteBtn.addEventListener('click', () => {
        indice++;
        if (indice < orden.length) renderPregunta();
        else overlay.classList.remove('active');
    });

    trigger.addEventListener('click', () => {
        overlay.classList.add('active');
        if (temas && temas.length > 0) {
            mostrarPantallaQuiz(false);
            renderTemas();
        } else {
            empezar(banco);
        }
    });

    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
}
