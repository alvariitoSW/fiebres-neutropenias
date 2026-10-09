// Motor genérico de quiz de repaso (tipo Anki, 4 opciones). No es
// específico de Nefrología — cualquier módulo puede llamar a
// initQuiz({ triggerId, banco }) con su propio banco de preguntas.
// Dos tipos de pregunta conviven en el mismo banco: las normales, de
// opción múltiple ({ enunciado, opciones, correcta, explicacion }), y las
// de redactar ({ tipo: 'redactar', enunciado, respuestaModelo }) — estas
// últimas no tienen opciones ni corrección automática: el usuario escribe
// su respuesta en un textarea (no se guarda), revela la respuesta modelo,
// y se autoevalúa con dos botones que alimentan el mismo
// aciertos/fallos por pregunta que las de opción múltiple.
// Si además se pasa `temas` (array de { key, etiqueta, asignatura, bloque }),
// se muestra antes una selección de tema en 3 niveles — 1º asignatura
// (Hematología/Nefrología/UCI Papers Tuiter/Fisiopatología UCI), 2º bloque
// (p. ej. dentro de Nefrología: Fisiología/HTA/ERC/FRA/TRR) y 3º ficha
// individual — en vez de una única lista plana con decenas de temas. Cada
// nivel añade una opción "Todos los temas de..." para repasar ese grupo
// entero, y el nivel raíz conserva "Todos los temas" (banco completo).
// Opcional y con degradación elegante: sin `temas`, el quiz arranca directo
// como siempre; si algún tema no lleva `asignatura`/`bloque`, se agrupa bajo
// una etiqueta genérica en vez de romper el árbol. Un trigger concreto
// puede además llevar data-quiz-asignatura/data-quiz-bloque en su propio
// HTML para saltarse la pantalla de "elige asignatura" y empezar ya
// filtrado a ese bloque (ver el propio listener de los triggers, más abajo)
// — pensado para guías monotemáticas (p. ej. "Preguntas MC difíciles" de
// Sobrevivir a la UMI) donde la asignatura/bloque de entrada ya se conoce
// de antemano.
// El modal (#quiz-modal-overlay y sus elementos internos) es un único
// partial compartido por TODA la app — por eso solo debe existir UNA
// llamada activa a initQuiz en toda la página, nunca una por especialidad.
// Dos llamadas activas (p. ej. una en home/index.js y otra en
// nefrologia/index.js) registran listeners duplicados sobre los mismos
// elementos del DOM: cada clic dispara ambas instancias a la vez, y la que
// no tiene preguntas para el tema elegido revienta con
// "Cannot read properties of undefined (reading 'enunciado')" al intentar
// pintar un array vacío — ocurrió de verdad al integrar el quiz de
// Hematología, ver CLAUDE.md. Patrón correcto: cada especialidad exporta
// su propio `quizTriggerId`/`quizBanco`/`quizTemas` desde su índice, y
// `js/main.js` (el único punto de entrada real) los fusiona en una sola
// llamada a initQuiz(). `triggerId` acepta un string o un array de
// strings: cada botón listado abre el mismo banco combinado, para que
// cada módulo pueda tener su propio botón "🎯 Repasar" sin duplicar el
// motor del quiz.
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

// Texto de un banco de preguntas → HTML seguro: deja pasar solo <sub>/<sup>
// y las entidades ya escritas (&lt;, &gt;), y escapa cualquier otro "<"
// (p. ej. "S<D" en VExUS), para que el mismo texto se vea igual en
// enunciado, opciones y explicación.
function htmlPregunta(texto) {
    return String(texto ?? '').replace(/<(?!\/?(sub|sup)>)/g, '&lt;');
}

// "Ninguna/Todas de las anteriores" solo tiene sentido al final: esas
// opciones no se barajan.
const OPCION_FIJA = /de las anteriores/i;

function barajar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

export function initQuiz({ triggerId, banco, temas }) {
    const triggers = (Array.isArray(triggerId) ? triggerId : [triggerId])
        .map(id => document.getElementById(id))
        .filter(Boolean);
    const overlay = document.getElementById('quiz-modal-overlay');
    if (triggers.length === 0 || !overlay) return;

    const temasEl = document.getElementById('quiz-temas');
    const temasListaEl = document.getElementById('quiz-temas-lista');
    const temasTituloEl = document.getElementById('quiz-temas-titulo');
    const progresoEl = document.getElementById('quiz-progreso');
    const enunciadoEl = document.getElementById('quiz-enunciado');
    const opcionesEl = document.getElementById('quiz-opciones');
    const redactarEl = document.getElementById('quiz-redactar');
    const redactarInputEl = document.getElementById('quiz-redactar-input');
    const verRespuestaBtn = document.getElementById('quiz-ver-respuesta');
    const explicacionEl = document.getElementById('quiz-explicacion');
    const autoevalEl = document.getElementById('quiz-autoeval');
    const siguienteBtn = document.getElementById('quiz-siguiente');
    const closeBtn = document.getElementById('quiz-modal-close');

    let orden = [];
    let indice = 0;

    function mostrarPantallaQuiz(visible) {
        [progresoEl, enunciadoEl, opcionesEl].forEach(el => el.style.display = visible ? '' : 'none');
        if (!visible) {
            explicacionEl.style.display = 'none';
            siguienteBtn.style.display = 'none';
            redactarEl.style.display = 'none';
            autoevalEl.style.display = 'none';
        }
        if (temasEl) temasEl.style.display = visible ? 'none' : (temas ? 'block' : 'none');
    }

    function renderPregunta() {
        const pregunta = orden[indice];
        progresoEl.textContent = `Pregunta ${indice + 1} / ${orden.length}`;
        enunciadoEl.innerHTML = htmlPregunta(pregunta.enunciado);
        explicacionEl.style.display = 'none';
        autoevalEl.style.display = 'none';
        siguienteBtn.style.display = 'none';

        if (pregunta.tipo === 'redactar') {
            opcionesEl.style.display = 'none';
            redactarEl.style.display = 'block';
            redactarInputEl.value = '';
        } else {
            redactarEl.style.display = 'none';
            opcionesEl.style.display = 'flex';
            // La opción correcta se escribe siempre la primera en los bancos:
            // se baraja el orden en pantalla (data-indice sigue siendo el
            // índice original, el que compara responder()).
            const indices = pregunta.opciones.map((_, i) => i);
            const fijas = indices.filter(i => OPCION_FIJA.test(pregunta.opciones[i]));
            const vista = [...barajar(indices.filter(i => !fijas.includes(i))), ...fijas];
            opcionesEl.innerHTML = vista.map(i =>
                `<button class="quiz-opcion" data-indice="${i}">${htmlPregunta(pregunta.opciones[i])}</button>`).join('');
        }
    }

    function empezar(subBanco) {
        if (!subBanco.length) {
            // Un bloque/tema sin preguntas (p. ej. un data-quiz-bloque que no
            // coincide con ningún tema) no debe reventar en orden[0]: se vuelve
            // a la pantalla de selección en vez de pintar un banco vacío.
            mostrarPantallaQuiz(false);
            renderNivelAsignaturas();
            return;
        }
        orden = barajar(subBanco);
        indice = 0;
        mostrarPantallaQuiz(true);
        renderPregunta();
    }

    // Navegación de 3 niveles: asignatura → bloque → ficha. `nivelAsignatura`
    // y `nivelBloque` recuerdan dónde está el usuario para poder volver y
    // para resolver las opciones "Todos los temas de...".
    const ASIGNATURA_DEFECTO = 'Otros';
    const BLOQUE_DEFECTO = 'General';
    let nivelAsignatura = null;
    let nivelBloque = null;

    // Temas y preguntas de una asignatura (y, opcionalmente, de un bloque de ella).
    function temasDe(asignatura, bloque) {
        return temas.filter(t => (t.asignatura || ASIGNATURA_DEFECTO) === asignatura
            && (bloque === undefined || (t.bloque || BLOQUE_DEFECTO) === bloque));
    }
    function bancoDe(asignatura, bloque) {
        const keys = new Set(temasDe(asignatura, bloque).map(t => t.key));
        return banco.filter(p => keys.has(p.tema));
    }

    function contar(filtroFn) {
        return banco.filter(filtroFn).length;
    }

    function pintarBotones(botones) {
        temasListaEl.innerHTML = botones.map(b =>
            `<button class="quiz-opcion" data-accion="${b.accion}" data-valor="${b.valor ?? ''}">${b.etiqueta}</button>`).join('');
    }

    function renderNivelAsignaturas() {
        nivelAsignatura = null;
        nivelBloque = null;
        if (temasTituloEl) temasTituloEl.textContent = '¿Qué quieres repasar?';
        const asignaturas = [...new Set(temas.map(t => t.asignatura || ASIGNATURA_DEFECTO))];
        const botones = [
            { etiqueta: `Todos los temas (${banco.length})`, accion: 'todas' },
            ...asignaturas.map(a => ({ etiqueta: `${a} (${bancoDe(a).length})`, accion: 'asignatura', valor: a })),
        ];
        pintarBotones(botones);
    }

    // `prefijo` (opcional) deja solo los bloques que empiezan así — p. ej.
    // "Trasplante" para los 3 bloques de Trasplante de Hematología.
    function renderNivelBloques(asignatura, prefijo = '') {
        nivelAsignatura = asignatura;
        nivelBloque = null;
        if (temasTituloEl) temasTituloEl.textContent = `${asignatura} — ¿qué bloque quieres repasar?`;
        const bloques = [...new Set(temasDe(asignatura).map(t => t.bloque || BLOQUE_DEFECTO))].filter(b => b.startsWith(prefijo));
        const botones = [
            { etiqueta: '← Especialidades', accion: 'volver-asignaturas' },
            { etiqueta: `Todos los temas de ${asignatura} (${bancoDe(asignatura).length})`, accion: 'todas-asignatura' },
            ...bloques.map(b => ({ etiqueta: `${b} (${bancoDe(asignatura, b).length})`, accion: 'bloque', valor: b })),
        ];
        pintarBotones(botones);
    }

    function renderNivelTemas(asignatura, bloque) {
        nivelBloque = bloque;
        if (temasTituloEl) temasTituloEl.textContent = `${bloque} — ¿qué ficha quieres repasar?`;
        const botones = [
            { etiqueta: `← ${asignatura}`, accion: 'volver-bloques' },
            { etiqueta: `Todos los temas de ${bloque} (${bancoDe(asignatura, bloque).length})`, accion: 'todas-bloque' },
            ...temasDe(asignatura, bloque).map(t => ({ etiqueta: `${t.etiqueta} (${contar(p => p.tema === t.key)})`, accion: 'tema', valor: t.key })),
        ];
        pintarBotones(botones);
    }

    function responder(i) {
        const pregunta = orden[indice];
        const botones = opcionesEl.querySelectorAll('.quiz-opcion');
        botones.forEach(b => b.disabled = true);
        const boton = idx => opcionesEl.querySelector(`.quiz-opcion[data-indice="${idx}"]`);

        const acierto = i === pregunta.correcta;
        boton(i).classList.add(acierto ? 'correcta' : 'incorrecta');
        if (!acierto) boton(pregunta.correcta).classList.add('correcta');

        registrarRespuesta(pregunta.id, acierto);

        explicacionEl.style.display = 'block';
        explicacionEl.innerHTML = htmlPregunta(pregunta.explicacion);
        siguienteBtn.style.display = 'inline-block';
        siguienteBtn.textContent = indice + 1 < orden.length ? 'Siguiente →' : 'Terminar';
    }

    function verRespuesta() {
        const pregunta = orden[indice];
        redactarEl.style.display = 'none';
        explicacionEl.style.display = 'block';
        explicacionEl.innerHTML = htmlPregunta(pregunta.respuestaModelo);
        autoevalEl.style.display = 'flex';
    }

    function autoevaluar(acierto) {
        const pregunta = orden[indice];
        registrarRespuesta(pregunta.id, acierto);
        autoevalEl.style.display = 'none';
        siguienteBtn.style.display = 'inline-block';
        siguienteBtn.textContent = indice + 1 < orden.length ? 'Siguiente →' : 'Terminar';
    }

    opcionesEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-opcion');
        if (btn && !btn.disabled) responder(Number(btn.dataset.indice));
    });

    verRespuestaBtn.addEventListener('click', verRespuesta);

    autoevalEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-autoeval-btn');
        if (btn) autoevaluar(btn.dataset.acierto === 'true');
    });

    if (temasListaEl) {
        temasListaEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.quiz-opcion');
            if (!btn) return;
            const accion = btn.dataset.accion;
            const valor = btn.dataset.valor;
            if (accion === 'todas') { empezar(banco); return; }
            if (accion === 'asignatura') { renderNivelBloques(valor); return; }
            if (accion === 'volver-asignaturas') { renderNivelAsignaturas(); return; }
            if (accion === 'todas-asignatura') { empezar(bancoDe(nivelAsignatura)); return; }
            if (accion === 'bloque') { renderNivelTemas(nivelAsignatura, valor); return; }
            if (accion === 'volver-bloques') { renderNivelBloques(nivelAsignatura); return; }
            if (accion === 'todas-bloque') { empezar(bancoDe(nivelAsignatura, nivelBloque)); return; }
            if (accion === 'tema') { empezar(banco.filter(p => p.tema === valor)); return; }
        });
    }

    siguienteBtn.addEventListener('click', () => {
        indice++;
        if (indice < orden.length) renderPregunta();
        else overlay.classList.remove('active');
    });

    triggers.forEach(trigger => trigger.addEventListener('click', () => {
        overlay.classList.add('active');
        // Entrada directa a un bloque concreto, saltándose la pantalla de
        // "elige asignatura": un botón con data-quiz-asignatura +
        // data-quiz-bloque (p. ej. #btn-mc-dificiles-repasar, en Sobrevivir
        // a la UMI → Preguntas MC) empieza el quiz ya filtrado a ese bloque
        // — pensado para guías monotemáticas donde elegir asignatura sería
        // un paso redundante (solo hay un bloque real que elegir después).
        // Degradación elegante: sin esos data-* el trigger se comporta
        // exactamente igual que siempre (pantalla de 3 niveles, o banco
        // completo si no hay `temas`).
        // Con data-quiz-elegir, en vez de empezar ya se abre la lista de
        // fichas de ese bloque (o, sin bloque, la de bloques de la
        // asignatura, filtrable con data-quiz-prefijo-bloque): es lo que
        // usan los botones "Repasar" de cada módulo,
        // que así abren SU tema y no el menú de todas las especialidades.
        const asigDirecta = trigger.dataset.quizAsignatura;
        const bloqueDirecto = trigger.dataset.quizBloque;
        const elegir = 'quizElegir' in trigger.dataset;
        if (temas && temas.length > 0 && asigDirecta && elegir) {
            mostrarPantallaQuiz(false);
            const prefijo = trigger.dataset.quizPrefijoBloque;
            if (bloqueDirecto) { nivelAsignatura = asigDirecta; renderNivelTemas(asigDirecta, bloqueDirecto); }
            else renderNivelBloques(asigDirecta, prefijo);
        } else if (temas && temas.length > 0 && asigDirecta && bloqueDirecto) {
            empezar(bancoDe(asigDirecta, bloqueDirecto));
        } else if (temas && temas.length > 0) {
            mostrarPantallaQuiz(false);
            renderNivelAsignaturas();
        } else {
            empezar(banco);
        }
    }));

    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
}
