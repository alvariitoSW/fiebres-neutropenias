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
    return `<tr>${fila.map(v => `<td>${v}</td>`).join('')}</tr>`;
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
            const nombre = tr.querySelector('td');
            const coincide = !q || (nombre && normaliza(nombre.textContent).includes(q));
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

export function init() {
    const cont = document.getElementById('farmacos-categorias');
    if (!cont) return;
    cont.innerHTML = categoriasFarmacos.map(renderCategoria).join('');

    cont.querySelectorAll('.micro-prof-head').forEach(head => {
        head.addEventListener('click', () => {
            head.classList.toggle('open');
            head.nextElementSibling.classList.toggle('active');
        });
    });

    const buscador = document.getElementById('farmaco-buscador');
    if (buscador) buscador.addEventListener('input', () => filtrarFarmacos(buscador.value));
}
