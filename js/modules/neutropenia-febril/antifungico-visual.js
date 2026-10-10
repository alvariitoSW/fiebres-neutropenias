// Vista Visual de "5. Antifúngico empírico": dos carriles de días de fiebre
// sin causa, uno sin profilaxis frente a filamentosos y otro con ella. Los
// umbrales dibujados son los del texto de la tarjeta (4-5 días sin
// profilaxis; >10 días con profilaxis, como rescate). La imagen no decide:
// escribe en los controles reales (días, profilaxis, inestabilidad) y copia
// el resultado de updateAntifungico().

import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const DIAS = 14;
const pct = d => `${(Math.min(d, DIAS) / DIAS * 100).toFixed(2)}%`;

const CARRILES = [
    { id: 'sin', titulo: 'Sin profilaxis frente a filamentosos', zonas: [
        { desde: 0, hasta: 4, texto: 'aún no: esperar o estrategia guiada (GM/BDG)', color: 'var(--accent-blue)' },
        { desde: 4, hasta: DIAS, texto: '≥4-5 d + inestabilidad → empírico (B-II)', color: 'var(--accent-red)' }] },
    { id: 'con', titulo: 'Con profilaxis frente a filamentosos', zonas: [
        { desde: 0, hasta: 10, texto: 'generalmente NO indicado (A-II)', color: 'var(--accent-green)' },
        { desde: 10, hasta: DIAS, texto: '>10 d + inestabilidad → rescate', color: 'var(--accent-yellow)' }] }
];

function construir(cont) {
    const ticks = [0, 2, 4, 6, 8, 10, 12, 14].map(d => `<span style="left:${pct(d)}">${d}</span>`).join('');
    const stats = [...document.querySelectorAll('#empirico-antifungico-card .stat-box')].map(b =>
        `<div class="af-stat"><b style="color:${b.querySelector('.stat-num').style.color}">${b.querySelector('.stat-num').textContent}</b><span>${b.querySelector('.stat-label').textContent}</span></div>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Días de fiebre sin causa con antibiótico de amplio espectro. Elige el carril (con o sin profilaxis), mueve el día y marca si hay inestabilidad.</p>
        <div class="af-stats">${stats}</div>
        ${CARRILES.map(c => `
            <button type="button" class="af-carril" data-carril="${c.id}">
                <span class="af-carril-titulo">${c.titulo}</span>
                <span class="af-pista">${c.zonas.map(z => `<i style="left:${pct(z.desde)};width:calc(${pct(z.hasta)} - ${pct(z.desde)});--z:${z.color}"><em>${z.texto}</em></i>`).join('')}<span class="af-cursor"></span></span>
            </button>`).join('')}
        <div class="eje-ticks af-ticks">${ticks}</div>
        <label class="regla-dia" for="af-dia">Días de fiebre sin causa: <b id="af-dia-num"></b></label>
        <input type="range" min="0" max="${DIAS}" step="1" id="af-dia">
        <div class="regla-mandos">
            <button type="button" class="visual-mini" id="af-inestable"></button>
        </div>
        <div class="visual-veredicto" id="af-veredicto"></div>
        <button type="button" class="visual-link" id="af-texto">Ver en el texto ↓</button>`;
}

function render() {
    const cont = $('antifungico-carriles');
    if (!cont || !cont.firstChild) return;
    const con = $('tx-profilaxis-previa').checked;
    const dias = parseFloat($('tx-dias-fiebre').value) || 0;
    const inestable = $('tx-inestable-fungico').checked;
    cont.querySelectorAll('.af-carril').forEach(b => {
        const activo = (b.dataset.carril === 'con') === con;
        b.classList.toggle('on', activo);
        b.setAttribute('aria-pressed', String(activo));
        b.querySelector('.af-cursor').style.left = pct(dias);
    });
    const r = $('af-dia');
    if (document.activeElement !== r) r.value = String(Math.min(dias, DIAS));
    $('af-dia-num').textContent = dias;
    const bi = $('af-inestable');
    bi.textContent = inestable ? '✔ Inestabilidad hemodinámica' : '○ Sin inestabilidad hemodinámica';
    bi.classList.toggle('on', inestable);
    bi.setAttribute('aria-pressed', String(inestable));
    const res = $('antifungico-resultado');
    const v = $('af-veredicto');
    const color = res.querySelector('strong')?.style.color || '';
    v.style.borderColor = color;
    v.innerHTML = res.innerHTML;
}

function poner(el, valor) {
    if (el.type === 'checkbox') el.checked = valor; else el.value = String(valor);
    el.dispatchEvent(new Event(el.type === 'checkbox' ? 'change' : 'input', { bubbles: true }));
}

export function initAntifungicoVisual() {
    const cont = $('antifungico-carriles');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const c = e.target.closest('.af-carril');
        if (c) { poner($('tx-profilaxis-previa'), c.dataset.carril === 'con'); return; }
        if (e.target.closest('#af-inestable')) { poner($('tx-inestable-fungico'), !$('tx-inestable-fungico').checked); return; }
        if (e.target.closest('#af-texto')) irAlTexto($('empirico-antifungico-card'), $('tx-dias-fiebre').closest('.form-group'));
    });
    $('af-dia').addEventListener('input', e => poner($('tx-dias-fiebre'), e.target.value));
    ['tx-profilaxis-previa', 'tx-dias-fiebre', 'tx-inestable-fungico'].forEach(id => {
        $(id).addEventListener('input', render);
        $(id).addEventListener('change', render);
    });
    render();
}
