// Interruptor "Texto | Visual" por tarjeta (y "Texto | Estudiar" en las fichas
// que tienen el recorrido Estudiar: core/mayeutica.js añade un hijo
// `.vista-estudiar` y el interruptor cambia solo).
//
// Cualquier elemento `[data-visual]` (una `.card`, o un `.vista-grupo` que
// envuelve varias tarjetas) con dos hijos `.vista-texto` y `.vista-visual`
// recibe un control segmentado justo debajo de su <h3> (o de su
// `.vista-grupo-titulo`). La vista Texto es la
// fuente primaria y la de por defecto; la Visual es otra forma de leer el
// mismo bloque. Cambiar es por tarjeta (no global) y no se guarda nada.
//
// En una ficha con Estudiar no hay botón Visual: sus dibujos viven en el paso
// «Mira» de Estudiar. Todo lo que pida la vista Visual de esa ficha (el botón
// "🖼️ Visual" de la cabecera, `irAlVisual()`, los enlaces `data-en-visual`)
// abre Estudiar en el paso «Mira» (evento vistachange con paso: 'mira').
//
// Se inicializa una sola vez desde main.js, igual que lightbox/corkboard:
// añadir una imagen nueva a otra tarjeta solo exige el atributo data-visual
// y los dos contenedores, sin tocar este archivo.

const CLASE_VISUAL = 'modo-visual';
const CLASE_ESTUDIAR = 'modo-estudiar';
const vistaDe = card => card.classList.contains(CLASE_VISUAL) ? 'visual' : card.classList.contains(CLASE_ESTUDIAR) ? 'estudiar' : 'texto';
const tieneEstudiar = card => !!card.querySelector(':scope > .vista-estudiar');

// Modo global (botón "🖼️ Visual" de la cabecera): pone TODAS las tarjetas
// en la misma vista de una vez, y las que se creen después (p. ej. la ficha
// de un microorganismo) nacen ya en ese modo. Cada tarjeta conserva su
// interruptor propio. Solo vive en memoria: no se guarda nada.
let modoGlobal = 'texto';

function pintarToggle(card) {
    const vista = vistaDe(card);
    card.querySelectorAll(':scope > .vista-toggle button').forEach(b => {
        const activo = b.dataset.vista === vista;
        b.classList.toggle('active', activo);
        b.setAttribute('aria-pressed', String(activo));
    });
}

function setVista(card, vista) {
    // En una ficha con Estudiar, «Visual» es Estudiar → Mira.
    let paso = null;
    if (vista === 'visual' && tieneEstudiar(card)) { vista = 'estudiar'; paso = 'mira'; }
    // Una tarjeta sin Estudiar (o sin Visual) no puede quedarse en ese modo.
    if (vista === 'estudiar' && !tieneEstudiar(card)) vista = 'texto';
    if (vista === 'visual' && !tieneVisual(card)) vista = 'texto';
    card.classList.toggle(CLASE_VISUAL, vista === 'visual');
    card.classList.toggle(CLASE_ESTUDIAR, vista === 'estudiar');
    pintarToggle(card);
    card.dispatchEvent(new CustomEvent('vistachange', { detail: paso ? { vista, paso } : { vista } }));
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
    // Y si vive dentro de un <details> cerrado (p. ej., una nota plegable), se despliega.
    for (let d = objetivo?.closest('details'); d; d = d.parentElement?.closest('details')) d.open = true;
    // Un frame para que el bloque recién mostrado tenga layout antes del scroll.
    requestAnimationFrame(() => resaltar(objetivo));
}

// La Visual sale siempre, salvo en una ficha con Estudiar (sus dibujos están en el paso «Mira»).
const tieneVisual = card => !tieneEstudiar(card);
const ETIQUETA = { texto: 'Texto', visual: 'Visual', estudiar: 'Estudiar' };

// Pone en el interruptor los botones de las vistas que tiene la tarjeta (si
// core/mayeutica.js añade Estudiar después, el botón Visual se cambia aquí).
function ponerBotones(card, toggle) {
    const vistas = ['texto', tieneEstudiar(card) ? 'estudiar' : 'visual'];
    const actuales = [...toggle.querySelectorAll('button[data-vista]')].map(b => b.dataset.vista);
    if (vistas.join() === actuales.join()) return;
    toggle.innerHTML = vistas.map(v => `<button type="button" data-vista="${v}">${ETIQUETA[v]}</button>`).join('');
}

export function initVistaVisual(root = document) {
    root.querySelectorAll('[data-visual]').forEach(card => {
        const previo = card.querySelector(':scope > .vista-toggle');
        if (previo) { ponerBotones(card, previo); pintarToggle(card); return; }
        const toggle = document.createElement('div');
        toggle.className = 'vista-toggle';
        toggle.setAttribute('role', 'group');
        toggle.setAttribute('aria-label', 'Forma de ver este bloque');
        ponerBotones(card, toggle);
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

// Pasa un bloque a su vista Visual (la construye si aún no existe). En una
// ficha con Estudiar, abre Estudiar en el paso «Mira».
export function irAlVisual(card) {
    if (card?.matches('[data-visual]')) setVista(card, 'visual');
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

// Texto de un bloque tal como lo lee la vista Texto: sin la imagen, sin la
// Estudiar, sin el interruptor y sin el botón "Siguiente ficha → …" (que lleva el nombre de
// OTRA ficha). Lo usan el buscador global y las estimaciones de Modo
// Estudio, para no contar dos veces lo que la imagen repite ni encontrar
// una ficha por el título de la siguiente.
const NO_FUENTE = '.vista-visual, .vista-estudiar, .vista-toggle, .siguiente-ficha-btn';
export function textoFuente(el) {
    if (!el.querySelector(NO_FUENTE)) return el.textContent;
    const copia = el.cloneNode(true);
    copia.querySelectorAll(NO_FUENTE).forEach(n => n.remove());
    return copia.textContent;
}
