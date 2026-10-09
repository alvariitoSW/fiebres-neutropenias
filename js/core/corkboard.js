// Cuaderno de campo: tablero de fichas ilustradas (.field-card) que sustituye
// una barra de pestañas de texto. Toque en el botón .back-cta de la cara
// trasera (el "hook" de repaso ya revelado) = abre el tema real (mismo
// .tab-content de siempre, contenido íntegro sin resumir). El panel que
// contiene los .tab-content arranca oculto (style="display:none" en el
// HTML) para no dejar una caja vacía entre el tablero y lo que venga
// después, hasta que se elige el primer tema.
//
// Dos modos, elegidos en runtime por el nº de fichas del tablero (nunca a
// mano por módulo, para que el propio contenido decida sin mantenimiento):
// - "cajón" (≤12 fichas): la ficha conserva la estética de tarjeta de campo
//   (parchment, cinta washi, ilustración) en una sola columna. Un toque
//   despliega un cajón DEBAJO de la propia ficha, en flujo normal —la
//   ficha crece de alto—, con la pista de repaso y el botón real.
// - "compacta" (>12 fichas, cuadernos grandes tipo Merino Cardiología o
//   Fisiología renal): la ficha se aplana a una fila delgada (icono +
//   título + pista truncada a una línea). Un toque abre una hoja fija al
//   pie de pantalla con la pista completa y el botón, cerrando cualquier
//   otra hoja abierta (solo una a la vez) y con fondo oscuro que cierra al
//   tocar fuera.
// Ambos modos reutilizan el MISMO HTML de siempre (.field-card >
// .field-card-inner > .card-face.front/.back) — todo el cambio vive aquí y
// en components.css, nunca en el HTML de cada ficha.
export function openCorkboardTopic(panelId, tabId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) {
        panel.style.display = 'block';
        target.classList.add('active');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Marca la(s) ficha(s) que llevan a este tema como "ya visto" (checkmark
    // verde, ver .field-card.visited en components.css) — funciona tanto si
    // se abre desde el propio cajón/hoja como si se llega desde fuera (p. ej.
    // el Atlas enlazando directo a un tema). Los data-tab son únicos en toda
    // la app, así que no hace falta saber a qué tablero pertenece la ficha.
    document.querySelectorAll(`.field-card[data-tab="${tabId}"]`).forEach(c => c.classList.add('visited'));
}

// Nombre legible de una ficha a partir de su .field-name (que a menudo
// lleva un <br> interno para partir el título en 2 líneas en la tarjeta) —
// se sustituye por un espacio en vez de dejarlo concatenado sin separación.
export function nombreFicha(card, porDefecto = '') {
    const el = card.querySelector('.field-name');
    if (!el) return porDefecto;
    return el.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
}

export function initCorkboard(boardId, panelId) {
    const board = document.getElementById(boardId);
    const panel = document.getElementById(panelId);
    if (!board || !panel) return;

    const cards = Array.from(board.querySelectorAll('.field-card'));
    const compacta = cards.length > 12;
    board.classList.add(compacta ? 'corkboard-compacta' : 'corkboard-cajon');

    // En modo compacta, la cara trasera se convierte en una hoja fija al pie
    // de pantalla — necesita un fondo que la separe del resto del contenido
    // y permita cerrarla tocando fuera. Un único fondo por tablero, no uno
    // por ficha.
    let backdrop = null;
    if (compacta) {
        backdrop = document.createElement('div');
        backdrop.className = 'corkboard-backdrop';
        board.appendChild(backdrop);
        backdrop.addEventListener('click', closeAll);
    }

    function closeAll() {
        cards.forEach(c => c.classList.remove('open'));
        if (backdrop) backdrop.classList.remove('active');
    }

    // La hoja compacta no repite el título (la cara trasera nunca lo tuvo,
    // solo la pista+botón) — se inyecta una vez, la primera vez que se abre
    // esa ficha, leyendo el título ya visible en la cara delantera. Así la
    // hoja dice de qué tema es antes de tocar el botón, sin duplicar el
    // título en el HTML de cada ficha.
    function asegurarTituloHoja(card) {
        const back = card.querySelector('.card-face.back');
        if (!back || back.querySelector('.corkboard-sheet-title')) return;
        const titulo = document.createElement('div');
        titulo.className = 'corkboard-sheet-title';
        titulo.textContent = nombreFicha(card);
        back.insertBefore(titulo, back.firstChild);
    }

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.back-cta')) {
                openCorkboardTopic(panelId, card.dataset.tab);
                closeAll();
                return;
            }
            const yaAbierta = card.classList.contains('open');
            if (compacta) {
                closeAll();
                if (!yaAbierta) {
                    asegurarTituloHoja(card);
                    card.classList.add('open');
                    backdrop.classList.add('active');
                }
            } else {
                card.classList.toggle('open');
            }
        });
    });

    // Botón "Siguiente ficha →" al final de cada tema, en el mismo orden en
    // que las fichas aparecen en el tablero — evita que el usuario tenga
    // que volver a subir hasta el tablero cada vez que termina de leer una.
    // La última ficha enlaza de vuelta a la primera (ciclo cerrado), para
    // que el botón exista siempre y el comportamiento sea uniforme en
    // TODOS los cuadernos de campo de la app sin excepciones por posición.
    if (cards.length < 2) return;
    cards.forEach((card, i) => {
        const siguienteCard = cards[(i + 1) % cards.length];
        const contenido = document.getElementById(card.dataset.tab);
        if (!contenido) return;
        const boton = document.createElement('button');
        boton.className = 'siguiente-ficha-btn';
        boton.type = 'button';
        boton.textContent = `Siguiente ficha: ${nombreFicha(siguienteCard, 'Siguiente ficha')} →`;
        boton.addEventListener('click', () => openCorkboardTopic(panelId, siguienteCard.dataset.tab));
        contenido.appendChild(boton);
    });
}
