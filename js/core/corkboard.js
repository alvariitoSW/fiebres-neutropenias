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
}
