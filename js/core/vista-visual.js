// Interruptor "Texto | Visual" por tarjeta.
//
// Cualquier elemento `[data-visual]` (una `.card`, o un `.vista-grupo` que
// envuelve varias tarjetas) con dos hijos `.vista-texto` y `.vista-visual`
// recibe un control segmentado justo debajo de su <h3> (o de su
// `.vista-grupo-titulo`). La vista Texto es la
// fuente primaria y la de por defecto; la Visual es otra forma de leer el
// mismo bloque. Cambiar es por tarjeta (no global) y no se guarda nada.
//
// Se inicializa una sola vez desde main.js, igual que lightbox/corkboard:
// añadir una imagen nueva a otra tarjeta solo exige el atributo data-visual
// y los dos contenedores, sin tocar este archivo.

const CLASE_VISUAL = 'modo-visual';

// Modo global (botón "🖼️ Visual" de la cabecera): pone TODAS las tarjetas
// en la misma vista de una vez, y las que se creen después (p. ej. la ficha
// de un microorganismo) nacen ya en ese modo. Cada tarjeta conserva su
// interruptor propio. Solo vive en memoria: no se guarda nada.
let modoGlobal = 'texto';

function pintarToggle(card) {
    const esVisual = card.classList.contains(CLASE_VISUAL);
    card.querySelectorAll(':scope > .vista-toggle button').forEach(b => {
        const activo = (b.dataset.vista === 'visual') === esVisual;
        b.classList.toggle('active', activo);
        b.setAttribute('aria-pressed', String(activo));
    });
}

function setVista(card, vista) {
    card.classList.toggle(CLASE_VISUAL, vista === 'visual');
    pintarToggle(card);
    card.dispatchEvent(new CustomEvent('vistachange', { detail: { vista } }));
}

// Lleva la vista al elemento y lo resalta un momento.
export function resaltar(objetivo) {
    if (!objetivo) return;
    // Centrado si cabe en pantalla; si es más alto, desde su inicio, para no
    // aterrizar a mitad de una tarjeta larga sin ver su título.
    const alto = objetivo.getBoundingClientRect().height > window.innerHeight * 0.8;
    objetivo.scrollIntoView({ behavior: 'smooth', block: alto ? 'start' : 'center' });
    marcar(objetivo);
}

// Resalta un elemento un momento, sin mover la vista.
export function marcar(el) {
    if (!el) return;
    el.classList.remove('vista-resaltado');
    void el.offsetWidth; // reinicia la animación si ya estaba resaltado
    el.classList.add('vista-resaltado');
    setTimeout(() => el.classList.remove('vista-resaltado'), 2200);
}

// Vuelve a la vista Texto del bloque y resalta `objetivo` (la línea de la
// fuente primaria). Es el camino de "Ver en el texto" desde cualquier
// marcador de una imagen. `card` puede ser null si la fuente vive fuera de
// un bloque con interruptor (p. ej. en otra subvista ya mostrada).
export function irAlTexto(card, objetivo) {
    if (card) setVista(card, 'texto');
    // Si la línea vive dentro de un acordeón .micro-prof-item, se abre antes.
    const mpi = objetivo?.closest('.micro-prof-item');
    if (mpi) {
        mpi.querySelector(':scope > .micro-prof-head')?.classList.add('open');
        mpi.querySelector(':scope > .micro-prof-body')?.classList.add('active');
    }
    // Un frame para que el bloque recién mostrado tenga layout antes del scroll.
    requestAnimationFrame(() => resaltar(objetivo));
}

export function initVistaVisual(root = document) {
    root.querySelectorAll('[data-visual]').forEach(card => {
        if (card.querySelector(':scope > .vista-toggle')) return;
        const toggle = document.createElement('div');
        toggle.className = 'vista-toggle';
        toggle.setAttribute('role', 'group');
        toggle.setAttribute('aria-label', 'Forma de ver este bloque');
        toggle.innerHTML =
            '<button type="button" data-vista="texto">Texto</button>' +
            '<button type="button" data-vista="visual">Visual</button>';
        const cabecera = card.querySelector(':scope > h3, :scope > .vista-grupo-titulo');
        if (cabecera) cabecera.after(toggle); else card.prepend(toggle);
        toggle.addEventListener('click', e => {
            const b = e.target.closest('button[data-vista]');
            if (b) setVista(card, b.dataset.vista);
        });
        pintarToggle(card);
        if (modoGlobal === 'visual') setVista(card, 'visual');
    });
}

export function setModoGlobal(vista) {
    modoGlobal = vista;
    document.querySelectorAll('[data-visual]').forEach(card => setVista(card, vista));
}

// Botón de la cabecera. Se muestra solo cuando la pantalla actual tiene algún
// bloque con vista Visual (lo decide quien llama a hayVisualEn()).
export function initBotonVisualGlobal(boton) {
    if (!boton) return;
    const pintar = () => {
        const on = modoGlobal === 'visual';
        boton.classList.toggle('active', on);
        boton.setAttribute('aria-pressed', String(on));
        boton.textContent = on ? '🖼️ Visual: ON' : '🖼️ Visual';
    };
    boton.addEventListener('click', () => { setModoGlobal(modoGlobal === 'visual' ? 'texto' : 'visual'); pintar(); });
    pintar();
}

export const hayVisualEn = vista => !!vista?.querySelector('[data-visual]');

// Texto de un bloque tal como lo lee la vista Texto: sin la imagen, sin el
// interruptor y sin el botón "Siguiente ficha → …" (que lleva el nombre de
// OTRA ficha). Lo usan el buscador global y las estimaciones de Modo
// Estudio, para no contar dos veces lo que la imagen repite ni encontrar
// una ficha por el título de la siguiente.
const NO_FUENTE = '.vista-visual, .vista-toggle, .siguiente-ficha-btn';
export function textoFuente(el) {
    if (!el.querySelector(NO_FUENTE)) return el.textContent;
    const copia = el.cloneNode(true);
    copia.querySelectorAll(NO_FUENTE).forEach(n => n.remove());
    return copia.textContent;
}
