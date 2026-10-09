// Ajuste de fármacos por función renal: buscador de referencia rápida.
// A diferencia del resto de módulos de Nefrología, esto no es contenido
// teórico para estudiar (cuaderno de campo), es una tabla de consulta
// densa (585 fármacos) — por eso usa el acordeón .micro-prof-item ya
// existente (una categoría por fármaco-grupo) + un buscador de texto que
// filtra filas en vivo, en vez del patrón de fichas volteables.
// Fuente: García Montemayor V, Sanchez-Agesta Martínez M, Naranjo Muñoz J.
// Ajuste de Fármacos en la Enfermedad Renal Crónica. Nefrología al día
// (SEN), actualizado 24/5/2025.
import { categoriasFarmacos } from '../../data/ajuste-farmacos-data.js';

const BANDAS_DEFECTO = ['100-50 ml/min', '50-10 ml/min', '<10 ml/min'];

function cabeceraTabla(cat) {
    const bandas = cat.bandas || BANDAS_DEFECTO;
    const cols = ['Fármaco', 'Dosis F.R. normal', 'Método', ...bandas, 'Hemodiálisis'];
    if (cat.tipo === 'antibiotico') cols.push('Dosis HFVVC');
    return `<tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr>`;
}

function filaTabla(fila) {
    // fila: [nombre, dosisNormal, metodo, ...ccrValues, hd, hfvvc?]
    // El nombre normalizado se precalcula aquí una vez, para que el filtro
    // no tenga que normalizar 585 textContent en cada pulsación de tecla.
    return `<tr data-nombre="${normaliza(String(fila[0])).replace(/"/g, '&quot;')}">${fila.map(v => `<td>${v}</td>`).join('')}</tr>`;
}

function renderGrupo(grupo) {
    const subtitulo = grupo.subtitulo
        ? `<p class="section-label" style="margin-top:12px;">${grupo.subtitulo}</p>`
        : '';
    return subtitulo;
}

function renderCategoria(cat, idx) {
    const grupos = cat.grupos.map(g => `
        ${renderGrupo(g)}
        <div class="table-scroll" style="overflow-x:auto;">
            <table class="data-table farmaco-table">
                <thead>${cabeceraTabla(cat)}</thead>
                <tbody>${g.filas.map(filaTabla).join('')}</tbody>
            </table>
        </div>
    `).join('');

    return `
        <div class="micro-prof-item farmaco-categoria" data-cat="${cat.id}">
            <div class="micro-prof-head">
                <span>💊 ${cat.nombre}</span> <span class="toggle-icon">+</span>
            </div>
            <div class="micro-prof-body">${grupos}</div>
        </div>
    `;
}

function normaliza(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filtrarFarmacos(texto) {
    const q = normaliza(texto.trim());
    document.querySelectorAll('.farmaco-categoria').forEach(cat => {
        let algunaFilaVisible = false;
        cat.querySelectorAll('tbody tr').forEach(tr => {
            const coincide = !q || (tr.dataset.nombre || '').includes(q);
            tr.style.display = coincide ? '' : 'none';
            if (coincide) algunaFilaVisible = true;
        });
        cat.style.display = algunaFilaVisible ? '' : 'none';
        const head = cat.querySelector('.micro-prof-head');
        const body = cat.querySelector('.micro-prof-body');
        if (q && algunaFilaVisible) {
            head.classList.add('open');
            body.classList.add('active');
        } else if (!q) {
            head.classList.remove('open');
            body.classList.remove('active');
        }
    });
}

function renderTabla(cont) {
    cont.innerHTML = categoriasFarmacos.map(renderCategoria).join('');
    cont.querySelectorAll('.micro-prof-head').forEach(head => {
        head.addEventListener('click', () => {
            head.classList.toggle('open');
            head.nextElementSibling.classList.toggle('active');
        });
    });
}

export function init() {
    const cont = document.getElementById('farmacos-categorias');
    if (!cont) return;

    // 585 filas × 25 tablas es, con diferencia, el innerHTML más grande de
    // la app — se genera la primera vez que la vista se hace visible (o al
    // primer uso del buscador), no en el arranque de la página.
    let renderizada = false;
    const asegurarRender = () => {
        if (renderizada) return;
        renderizada = true;
        renderTabla(cont);
    };
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            if (entries.some(e => e.isIntersecting)) { asegurarRender(); io.disconnect(); }
        });
        io.observe(cont);
    } else {
        asegurarRender();
    }

    const buscador = document.getElementById('farmaco-buscador');
    if (buscador) buscador.addEventListener('input', () => { asegurarRender(); filtrarFarmacos(buscador.value); });
}
