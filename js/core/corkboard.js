// Cuaderno de campo: tablero de fichas ilustradas (.field-card) que sustituye
// una barra de pestañas de texto. Primer toque = voltea la ficha y muestra
// una pista de repaso; toque en el botón .back-cta de la cara trasera = abre
// el tema real (mismo .tab-content de siempre, contenido íntegro sin
// resumir). El panel que contiene los .tab-content arranca oculto
// (style="display:none" en el HTML) para no dejar una caja vacía entre el
// tablero y lo que venga después, hasta que se elige el primer tema.
// Abre un tema directamente por su id, sin pasar por el volteo de la
// ficha — usado por el propio tablero (botón "Ver contenido completo") y
// también desde fuera (p. ej. el Atlas Hematológico, para enlazar
// directamente a un tema concreto de un cuaderno de campo).
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
    // se abre volteando la ficha como si se llega desde fuera (p. ej. el
    // Atlas enlazando directo a un tema). Los data-tab son únicos en toda la
    // app, así que no hace falta saber a qué tablero pertenece la ficha.
    document.querySelectorAll(`.field-card[data-tab="${tabId}"]`).forEach(c => c.classList.add('visited'));
}

// Nombre legible de una ficha a partir de su .field-name (que a menudo
// lleva un <br> interno para partir el título en 2 líneas en la tarjeta) —
// se sustituye por un espacio en vez de dejarlo concatenado sin separación.
function nombreFicha(card) {
    const el = card.querySelector('.field-name');
    if (!el) return 'Siguiente ficha';
    return el.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
}

export function initCorkboard(boardId, panelId) {
    const board = document.getElementById(boardId);
    const panel = document.getElementById(panelId);
    if (!board || !panel) return;

    board.querySelectorAll('.field-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.back-cta')) {
                openCorkboardTopic(panelId, card.dataset.tab);
                return;
            }
            card.classList.toggle('flipped');
        });
    });

    // Botón "Siguiente ficha →" al final de cada tema, en el mismo orden en
    // que las fichas aparecen en el tablero — evita que el usuario tenga
    // que volver a subir hasta el tablero cada vez que termina de leer una.
    // La última ficha enlaza de vuelta a la primera (ciclo cerrado), para
    // que el botón exista siempre y el comportamiento sea uniforme en
    // TODOS los cuadernos de campo de la app sin excepciones por posición.
    const tarjetas = Array.from(board.querySelectorAll('.field-card'));
    if (tarjetas.length < 2) return;
    tarjetas.forEach((card, i) => {
        const siguienteCard = tarjetas[(i + 1) % tarjetas.length];
        const contenido = document.getElementById(card.dataset.tab);
        if (!contenido) return;
        const boton = document.createElement('button');
        boton.className = 'siguiente-ficha-btn';
        boton.type = 'button';
        boton.textContent = `Siguiente ficha: ${nombreFicha(siguienteCard)} →`;
        boton.addEventListener('click', () => openCorkboardTopic(panelId, siguienteCard.dataset.tab));
        contenido.appendChild(boton);
    });
}
