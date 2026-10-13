// Índice central de los libros (pantalla de entrada de Libros). Pinta
// js/data/libros-indice.js: una pestaña por libro, un buscador de capítulos,
// una tira de capítulos coloreada por dónde vive cada uno en la app, y la
// lista por secciones. Los botones de cada ficha son enlaces cruzados
// normales (`data-especialidad`), resueltos por el listener único de
// home/index.js — este archivo no navega por su cuenta.
import { librosIndice } from '../../data/libros-indice.js';
import { escapeHtml } from '../../core/ui.js';
import { textoFuente } from '../../core/vista-visual.js';
import { progresoEstudio } from '../../core/pomodoro.js';

// Mismos iconos y colores que el buscador global (core/search.js).
const DESTINO = {
    libros: { nombre: 'Libros', icono: '📚', color: 'var(--accent-purple)' },
    home: { nombre: 'Hematología', icono: '🩸', color: 'var(--accent-red)' },
    cardiologia: { nombre: 'Cardiología', icono: '🫀', color: 'var(--accent-blue)' },
    neumologia: { nombre: 'Neumología', icono: '🫁', color: 'var(--accent-green)' },
    fisioUci: { nombre: 'Fisiopatología UCI', icono: '🧬', color: 'var(--accent-yellow)' },
};

const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function capitulosDe(libro) {
    return libro.secciones.flatMap(s => s.capitulos);
}

// Botón de repaso de un libro entero: lo recoge la única llamada a
// initQuiz() (main.js) a través de quizTriggerId de libros/index.js.
export const idRepaso = libro => `btn-libro-repasar-${libro.id}`;

function chipFicha(f) {
    const d = DESTINO[f.especialidad] || DESTINO.libros;
    return `<button type="button" class="lib-ficha" style="--lib-color:${d.color};" data-especialidad="${f.especialidad}" data-view="${f.view}" data-panel="${f.panel}" data-tab="${f.tab}">${d.icono} ${escapeHtml(f.nombre)} →</button>`;
}

function tarjetaCapitulo(c) {
    const d = DESTINO[c.fichas[0]?.especialidad] || DESTINO.libros;
    const texto = norm([c.n, c.titulo, c.es, c.donde, ...c.fichas.map(f => f.nombre)].join(' '));
    return `
        <div class="lib-cap" id="lib-cap-${c.libro}-${c.n}" data-texto="${escapeHtml(texto)}" data-tabs="${c.fichas.map(f => f.tab).join(' ')}" style="--lib-color:${d.color};">
            <div class="lib-cap-head">
                <span class="lib-cap-num">${c.n}</span>
                <div>
                    <p class="lib-cap-titulo">${escapeHtml(c.es)}</p>
                    ${c.titulo ? `<p class="lib-cap-original">${escapeHtml(c.titulo)}</p>` : ''}
                </div>
            </div>
            <p class="lib-cap-donde">${d.icono} ${escapeHtml(c.donde)}</p>
            <p class="lib-cap-progreso" hidden></p>
            <p class="lib-cap-coincide" hidden></p>
            <div class="lib-fichas">${c.fichas.map(chipFicha).join('')}</div>
            <a class="biblio-link lib-pdf" href="${c.pdf}#page=${c.pagina}" target="_blank" rel="noopener">📄 PDF, pág. ${c.pagina} →</a>
        </div>`;
}

function htmlLibro(libro) {
    const caps = capitulosDe(libro);
    const tira = libro.secciones.map(s => s.pendiente
        ? `<span class="lib-tira-pend" title="${escapeHtml(s.pendiente)}">${escapeHtml(s.numero)}</span>`
        : s.capitulos.map(c => {
            const d = DESTINO[c.fichas[0]?.especialidad] || DESTINO.libros;
            return `<button type="button" class="lib-tira-cap" style="--lib-color:${d.color};" data-ir-cap="lib-cap-${libro.id}-${c.n}" data-tabs="${c.fichas.map(f => f.tab).join(' ')}" aria-label="Capítulo ${c.n}: ${escapeHtml(c.es)}">${c.n}</button>`;
        }).join('')).join('');
    const usados = [...new Set(caps.map(c => c.fichas[0]?.especialidad))].map(k => DESTINO[k]).filter(Boolean);
    const secciones = libro.secciones.map(s => `
        <div class="lib-seccion">
            <p class="lib-seccion-titulo">Sección ${escapeHtml(s.numero)}${s.titulo ? ` · ${escapeHtml(s.titulo)}` : ''}${s.original ? ` <span class="lib-seccion-original">${escapeHtml(s.original)}</span>` : ''}</p>
            ${s.pendiente ? `<p class="lib-pendiente">⏳ ${escapeHtml(s.pendiente)}</p>` : s.capitulos.map(c => tarjetaCapitulo({ ...c, libro: libro.id })).join('')}
        </div>`).join('');
    const repaso = libro.quiz?.length ? `
        <button class="accordion-btn nav-btn lib-repaso" id="${idRepaso(libro)}" data-quiz-bloques="${escapeHtml(libro.quiz.join('|'))}" data-quiz-titulo="${escapeHtml(libro.titulo)}" style="border-left: 4px solid ${libro.color};">
            <span>🎯 Repasar ${escapeHtml(libro.titulo)} entero</span>
            <span style="font-size: 0.8rem; color: ${libro.color};">[ ${libro.quiz.length} BLOQUES → ]</span>
        </button>` : '';
    return `
        <p class="lib-nota">${escapeHtml(libro.nota)}</p>
        <p class="lib-resumen"><strong>${caps.length}</strong> capítulos en la app · <strong>${caps.reduce((s, c) => s + c.fichas.length, 0)}</strong> fichas<span class="lib-resumen-estudio"></span></p>
        ${repaso}
        <div class="lib-tira" aria-label="Capítulos del libro">${tira}</div>
        <div class="lib-leyenda">${usados.map(d => `<span style="--lib-color:${d.color};">${d.icono} ${d.nombre}</span>`).join('')}<span class="lib-leyenda-pend">⏳ sin PDF todavía</span><span class="lib-leyenda-estudio">● con estudio en Modo Estudio</span></div>
        <div class="lib-secciones">${secciones}</div>`;
}

export function initIndice() {
    const cont = document.getElementById('libros-indice');
    if (!cont) return;
    cont.innerHTML = `
        <div class="lib-tabs" role="tablist">
            ${librosIndice.map((l, i) => `<button type="button" class="lib-tab${i ? '' : ' active'}" role="tab" id="lib-tab-${l.id}" aria-selected="${i ? 'false' : 'true'}" aria-controls="lib-libro-${l.id}" data-libro="${l.id}" style="--lib-color:${l.color};">
                <span class="lib-tab-titulo">${escapeHtml(l.titulo)}</span><span class="lib-tab-autor">${escapeHtml(l.autor)}${l.edicion ? ` · ${escapeHtml(l.edicion)}` : ''}</span></button>`).join('')}
        </div>
        <div class="form-group"><label for="lib-buscar">Buscar un capítulo o un tema (también dentro de las fichas)</label>
            <input type="text" id="lib-buscar" enterkeyhint="search" placeholder="p. ej. sedación, catéter, sepsis…" autocomplete="off"></div>
        <p class="lib-vacio" id="lib-vacio" hidden>Ningún capítulo de este libro coincide. <button type="button" class="especialidad-link" id="lib-buscar-global">🔍 Buscar en toda la app →</button></p>
        ${librosIndice.map((l, i) => `<div class="lib-libro" id="lib-libro-${l.id}" role="tabpanel" aria-labelledby="lib-tab-${l.id}" data-libro="${l.id}"${i ? ' hidden' : ''}>${htmlLibro(l)}</div>`).join('')}`;

    // Texto de las fichas de cada capítulo: se lee del DOM (las fichas ya
    // están cargadas aunque estén ocultas) la primera vez que se busca, sin
    // la vista Visual ni los botones de navegación (textoFuente).
    const contenido = new Map();
    const textoFicha = tab => {
        if (!contenido.has(tab)) {
            const el = document.getElementById(tab);
            contenido.set(tab, el ? norm(textoFuente(el)) : '');
        }
        return contenido.get(tab);
    };

    const buscar = cont.querySelector('#lib-buscar');
    const filtrar = () => {
        const q = norm(buscar.value.trim());
        const libro = cont.querySelector('.lib-libro:not([hidden])');
        let visibles = 0;
        libro.querySelectorAll('.lib-cap').forEach(c => {
            const enTitulo = !q || c.dataset.texto.includes(q);
            const fichasCon = q && q.length >= 3 && !enTitulo ? c.dataset.tabs.split(' ').filter(t => textoFicha(t).includes(q)) : [];
            const ok = enTitulo || fichasCon.length > 0;
            c.hidden = !ok;
            const aviso = c.querySelector('.lib-cap-coincide');
            aviso.hidden = !fichasCon.length;
            if (fichasCon.length) {
                aviso.textContent = `Aparece en el texto de ${fichasCon.length === 1 ? 'una ficha' : `${fichasCon.length} fichas`}:`;
                c.querySelectorAll('.lib-ficha').forEach(b => b.classList.toggle('coincide', fichasCon.includes(b.dataset.tab)));
            } else c.querySelectorAll('.lib-ficha.coincide').forEach(b => b.classList.remove('coincide'));
            if (ok) visibles++;
        });
        libro.querySelectorAll('.lib-seccion').forEach(s => {
            s.hidden = !!q && !s.querySelector('.lib-cap:not([hidden])');
        });
        cont.querySelector('#lib-vacio').hidden = visibles > 0;
    };
    buscar.addEventListener('input', filtrar);

    // Progreso de Modo Estudio: pomodoros invertidos en las fichas de cada
    // capítulo (el mismo dato que guarda Modo Estudio; nada nuevo).
    const pintarProgreso = () => {
        const prog = progresoEstudio();
        const hechos = tabs => tabs.split(' ').filter(Boolean).map(t => prog[t] || 0);
        cont.querySelectorAll('.lib-tira-cap').forEach(b => b.classList.toggle('estudiado', hechos(b.dataset.tabs).some(n => n > 0)));
        cont.querySelectorAll('.lib-libro').forEach(lib => {
            let total = 0, caps = 0;
            lib.querySelectorAll('.lib-cap').forEach(c => {
                const h = hechos(c.dataset.tabs);
                const suma = h.reduce((a, n) => a + n, 0), fichas = h.filter(n => n > 0).length;
                const el = c.querySelector('.lib-cap-progreso');
                el.hidden = !suma;
                if (suma) { el.textContent = `🍅 ${suma} pomodoro${suma > 1 ? 's' : ''} de estudio en ${fichas} de ${h.length} ficha${h.length > 1 ? 's' : ''}`; caps++; }
                total += suma;
            });
            lib.querySelector('.lib-resumen-estudio').textContent = total ? ` · 🍅 ${total} pomodoros en ${caps} capítulo${caps > 1 ? 's' : ''}` : '';
        });
    };
    pintarProgreso();
    document.addEventListener('estudio-progreso', pintarProgreso);

    cont.addEventListener('click', (e) => {
        const tab = e.target.closest('.lib-tab');
        if (tab) {
            cont.querySelectorAll('.lib-tab').forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
            cont.querySelectorAll('.lib-libro').forEach(l => { l.hidden = l.dataset.libro !== tab.dataset.libro; });
            filtrar();
            return;
        }
        if (e.target.closest('#lib-buscar-global')) {
            const q = buscar.value.trim();
            document.getElementById('btn-buscar-global')?.click();
            const campo = document.getElementById('search-input-el');
            if (campo) { campo.value = q; campo.dispatchEvent(new Event('input', { bubbles: true })); }
            return;
        }
        const ir = e.target.closest('[data-ir-cap]');
        if (ir) {
            buscar.value = '';
            filtrar();
            const cap = document.getElementById(ir.dataset.irCap);
            cap?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cap?.classList.add('lib-cap-resaltado');
            setTimeout(() => cap?.classList.remove('lib-cap-resaltado'), 1600);
        }
    });
}
