// Vista Visual de "3. Matriz de combate MDR": un árbol de tres pasos,
// germen → condición del paciente → pauta. Los gérmenes, el tipo de
// carbapenemasa y las condiciones son los controles REALES de la tarjeta
// (se leen sus etiquetas); al tocar se escriben y se dispara su evento, y la
// pauta se copia de calcMDR(). Así el árbol nunca puede dar otra pauta que
// la calculadora.

import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);

// Agrupación por tipo de bacilo (la misma que la ficha de cada germen en
// Microorganismos: fermentadores = Enterobacterias; no fermentadores).
const GRUPOS = [
    { titulo: 'Enterobacterias', color: 'var(--accent-blue)', valores: ['blee', 'ampc', 'cre'] },
    { titulo: 'Bacilos Gram− no fermentadores', color: 'var(--accent-purple)', valores: ['pseudomonas', 'acineto', 'steno'] }
];
const MODIFICADORES = ['mdr-is-sepsis', 'mdr-high-inoculum', 'mdr-cmi-mero', 'mdr-borderline'];

const etiquetaOpcion = v => $('mdr-bug-select').querySelector(`option[value="${v}"]`).textContent.trim();
const visible = el => el.style.display !== 'none';

function etiquetaCasilla(input) {
    const l = input.closest('label').cloneNode(true);
    l.querySelector('input').remove();
    return l.textContent.trim();
}

function construir(cont) {
    cont.innerHTML = `
        <p class="visual-guia">Elige el germen, después la situación del paciente: la pauta de abajo es la de la calculadora.</p>
        <div class="mdr-paso"><span class="mdr-num">1</span><b>Germen</b></div>
        ${GRUPOS.map(g => `
            <div class="mdr-grupo" style="--vk:${g.color}">
                <div class="mdr-grupo-titulo">${g.titulo}</div>
                <div class="mdr-germenes">${g.valores.map(v => `<button type="button" class="mdr-germen" data-germen="${v}">${etiquetaOpcion(v)}</button>`).join('')}</div>
            </div>`).join('')}
        <div class="vk-flecha" aria-hidden="true">↓</div>
        <div class="mdr-paso"><span class="mdr-num">2</span><b>Situación del paciente</b></div>
        <div class="mdr-condiciones" data-condiciones></div>
        <div class="vk-flecha" aria-hidden="true">↓</div>
        <div class="mdr-paso"><span class="mdr-num">3</span><b>Pauta</b></div>
        <div class="visual-veredicto mdr-pauta" data-pauta></div>
        <button type="button" class="visual-link" data-texto>Ver en el texto ↓</button>`;
}

function render() {
    const cont = $('mdr-arbol');
    const germen = $('mdr-bug-select').value;
    cont.querySelectorAll('[data-germen]').forEach(b => {
        b.classList.toggle('on', b.dataset.germen === germen);
        b.setAttribute('aria-pressed', String(b.dataset.germen === germen));
    });
    const cond = cont.querySelector('[data-condiciones]');
    let html = '';
    if (germen === 'none') html = '<p class="mdr-vacio">Primero elige un germen.</p>';
    else {
        if (visible($('mdr-mod-carbapenemasa'))) {
            const sel = $('mdr-carbapenemasa-tipo');
            html += `<div class="mdr-grupo-titulo">${sel.closest('.form-group').querySelector('label').textContent}</div>
                <div class="mdr-carba">${[...sel.options].map(o => `<button type="button" class="mdr-chip ${o.value === sel.value ? 'on' : ''}" data-carba="${o.value}" aria-pressed="${o.value === sel.value}">${o.textContent}</button>`).join('')}</div>`;
        }
        const mods = MODIFICADORES.map($).filter(c => visible(c.closest('[id^="mdr-mod-"]')));
        html += mods.map(c => `<button type="button" class="mdr-chip mdr-cond ${c.checked ? 'on' : ''}" data-mod="${c.id}" aria-pressed="${c.checked}">${c.checked ? '✔' : '○'} ${etiquetaCasilla(c)}</button>`).join('');
        if (!html) html = '<p class="mdr-vacio">Para este germen la pauta no cambia con la situación del paciente.</p>';
    }
    cond.innerHTML = html;
    const t = $('mdr-result-title');
    const p = cont.querySelector('[data-pauta]');
    p.style.borderColor = t.style.color || '';
    p.innerHTML = `<strong style="color:${t.style.color || ''}">${t.textContent}</strong>${$('mdr-result-text').innerHTML}`;
}

function emitir(el) { el.dispatchEvent(new Event('change', { bubbles: true })); }

export function initMdrVisual() {
    const cont = $('mdr-arbol');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const g = e.target.closest('[data-germen]');
        if (g) { $('mdr-bug-select').value = g.dataset.germen; emitir($('mdr-bug-select')); return; }
        const c = e.target.closest('[data-carba]');
        if (c) { $('mdr-carbapenemasa-tipo').value = c.dataset.carba; emitir($('mdr-carbapenemasa-tipo')); return; }
        const m = e.target.closest('[data-mod]');
        if (m) { const x = $(m.dataset.mod); x.checked = !x.checked; emitir(x); return; }
        if (e.target.closest('[data-texto]')) irAlTexto($('mdr-card'), $('mdr-bug-select').closest('.form-group'));
    });
    // Los listeners de calcMDR() están en los propios controles: al llegar el
    // evento aquí la pauta ya está escrita.
    const ids = ['mdr-bug-select', 'mdr-carbapenemasa-tipo', ...MODIFICADORES];
    document.addEventListener('change', e => { if (ids.includes(e.target.id)) render(); });
    render();
}
