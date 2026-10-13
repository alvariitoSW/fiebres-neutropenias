// Índice central de los libros (pantalla de entrada de Libros). Pinta
// js/data/libros-indice.js: una pestaña por libro, un buscador de capítulos,
// una tira de capítulos coloreada por dónde vive cada uno en la app, y la
// lista por secciones. Los botones de cada ficha son enlaces cruzados
// normales (`data-especialidad`), resueltos por el listener único de
// home/index.js — este archivo no navega por su cuenta.
import { librosIndice } from '../../data/libros-indice.js';
import { escapeHtml } from '../../core/ui.js';

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

function chipFicha(f) {
    const d = DESTINO[f.especialidad] || DESTINO.libros;
    return `<button type="button" class="lib-ficha" style="--lib-color:${d.color};" data-especialidad="${f.especialidad}" data-view="${f.view}" data-panel="${f.panel}" data-tab="${f.tab}">${d.icono} ${escapeHtml(f.nombre)} →</button>`;
}

function tarjetaCapitulo(c) {
    const d = DESTINO[c.fichas[0]?.especialidad] || DESTINO.libros;
    const texto = norm([c.n, c.titulo, c.es, c.donde, ...c.fichas.map(f => f.nombre)].join(' '));
    return `
        <div class="lib-cap" id="lib-cap-${c.libro}-${c.n}" data-texto="${escapeHtml(texto)}" style="--lib-color:${d.color};">
            <div class="lib-cap-head">
                <span class="lib-cap-num">${c.n}</span>
                <div>
                    <p class="lib-cap-titulo">${escapeHtml(c.es)}</p>
                    ${c.titulo ? `<p class="lib-cap-original">${escapeHtml(c.titulo)}</p>` : ''}
                </div>
            </div>
            <p class="lib-cap-donde">${d.icono} ${escapeHtml(c.donde)}</p>
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
            return `<button type="button" class="lib-tira-cap" style="--lib-color:${d.color};" data-ir-cap="lib-cap-${libro.id}-${c.n}" aria-label="Capítulo ${c.n}: ${escapeHtml(c.es)}">${c.n}</button>`;
        }).join('')).join('');
    const usados = [...new Set(caps.map(c => c.fichas[0]?.especialidad))].map(k => DESTINO[k]).filter(Boolean);
    const secciones = libro.secciones.map(s => `
        <div class="lib-seccion">
            <p class="lib-seccion-titulo">Sección ${escapeHtml(s.numero)}${s.titulo ? ` · ${escapeHtml(s.titulo)}` : ''}</p>
            ${s.pendiente ? `<p class="lib-pendiente">⏳ ${escapeHtml(s.pendiente)}</p>` : s.capitulos.map(c => tarjetaCapitulo({ ...c, libro: libro.id })).join('')}
        </div>`).join('');
    return `
        <p class="lib-nota">${escapeHtml(libro.nota)}</p>
        <p class="lib-resumen"><strong>${caps.length}</strong> capítulos en la app · <strong>${caps.reduce((s, c) => s + c.fichas.length, 0)}</strong> fichas</p>
        <div class="lib-tira" aria-label="Capítulos del libro">${tira}</div>
        <div class="lib-leyenda">${usados.map(d => `<span style="--lib-color:${d.color};">${d.icono} ${d.nombre}</span>`).join('')}<span class="lib-leyenda-pend">⏳ sin PDF todavía</span></div>
        <div class="lib-secciones">${secciones}</div>`;
}

export function initIndice() {
    const cont = document.getElementById('libros-indice');
    if (!cont) return;
    cont.innerHTML = `
        <div class="lib-tabs" role="tablist">
            ${librosIndice.map((l, i) => `<button type="button" class="lib-tab${i ? '' : ' active'}" role="tab" data-libro="${l.id}" style="--lib-color:${l.color};">
                <span class="lib-tab-titulo">${escapeHtml(l.titulo)}</span><span class="lib-tab-autor">${escapeHtml(l.autor)}${l.edicion ? ` · ${escapeHtml(l.edicion)}` : ''}</span></button>`).join('')}
        </div>
        <div class="form-group"><label for="lib-buscar">Buscar un capítulo o un tema</label>
            <input type="text" id="lib-buscar" enterkeyhint="search" placeholder="p. ej. sedación, catéter, sepsis…" autocomplete="off"></div>
        <p class="lib-vacio" id="lib-vacio" hidden>Ningún capítulo de este libro coincide.</p>
        ${librosIndice.map((l, i) => `<div class="lib-libro" data-libro="${l.id}"${i ? ' hidden' : ''}>${htmlLibro(l)}</div>`).join('')}`;

    const buscar = cont.querySelector('#lib-buscar');
    const filtrar = () => {
        const q = norm(buscar.value.trim());
        const libro = cont.querySelector('.lib-libro:not([hidden])');
        let visibles = 0;
        libro.querySelectorAll('.lib-cap').forEach(c => {
            const ok = !q || c.dataset.texto.includes(q);
            c.hidden = !ok;
            if (ok) visibles++;
        });
        libro.querySelectorAll('.lib-seccion').forEach(s => {
            s.hidden = !!q && !s.querySelector('.lib-cap:not([hidden])');
        });
        cont.querySelector('#lib-vacio').hidden = visibles > 0;
    };
    buscar.addEventListener('input', filtrar);

    cont.addEventListener('click', (e) => {
        const tab = e.target.closest('.lib-tab');
        if (tab) {
            cont.querySelectorAll('.lib-tab').forEach(t => t.classList.toggle('active', t === tab));
            cont.querySelectorAll('.lib-libro').forEach(l => { l.hidden = l.dataset.libro !== tab.dataset.libro; });
            filtrar();
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
