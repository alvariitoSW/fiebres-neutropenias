// Vista Visual de "4. Calculadora PK/PD": la escalera renal del fármaco
// elegido — una fila por tramo de función renal, de normal a hemofiltro, con
// su dosis. Las dosis se leen de pkpd-data.js, la misma fuente que usa
// calcPKPD(); la fila resaltada es la del tramo elegido en la calculadora, y
// tocar una fila, un fármaco o "Infección grave" escribe en los controles
// reales. Así la escalera muestra a la vez la dosis actual y cómo cambia al
// caer el aclaramiento.

import { pkpdData } from '../../data/pkpd-data.js';
import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const botones = () => [...document.querySelectorAll('#pkpd-card .pkpd-btn[data-drug]')];
const activo = () => document.querySelector('#pkpd-card .pkpd-btn[data-drug].active')?.dataset.drug || null;

function construir(cont) {
    const chips = botones().map(b =>
        `<button type="button" class="pkpd-chip ${b.classList.contains('fungal') ? 'fungico' : ''}" data-farmaco="${b.dataset.drug}">${b.textContent.trim()}</button>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Elige un fármaco: cada escalón es un tramo de función renal y su dosis. El resaltado es el tramo elegido; toca otro para cambiarlo.</p>
        <div class="pkpd-chips">${chips}</div>
        <button type="button" class="visual-mini pkpd-grave" data-grave></button>
        <div class="pkpd-escalera" data-escalera></div>
        <div class="pkpd-avisos" data-avisos></div>
        <button type="button" class="visual-link" data-texto>Ver en el texto ↓</button>`;
}

function render() {
    const cont = $('pkpd-escalera');
    const farmaco = activo();
    const grave = $('pkpd-severe-toggle').checked;
    const tramo = $('pkpd-renal').value;
    cont.querySelectorAll('[data-farmaco]').forEach(b => {
        b.classList.toggle('on', b.dataset.farmaco === farmaco);
        b.setAttribute('aria-pressed', String(b.dataset.farmaco === farmaco));
    });
    const bg = cont.querySelector('[data-grave]');
    bg.textContent = grave ? '✔ Infección grave / CMI límite' : '○ Infección no grave';
    bg.classList.toggle('on', grave);
    bg.setAttribute('aria-pressed', String(grave));

    const esc = cont.querySelector('[data-escalera]');
    const avisos = cont.querySelector('[data-avisos]');
    if (!farmaco) {
        esc.innerHTML = '<p class="mdr-vacio">Elige un fármaco para ver su escalera de dosis.</p>';
        avisos.innerHTML = '';
        return;
    }
    const dosis = pkpdData[farmaco].doses[grave ? 'severe' : 'normal'];
    const opciones = [...$('pkpd-renal').options];
    esc.innerHTML = opciones.map((o, k) => {
        const d = dosis[o.value];
        const igual = d === dosis[opciones[0].value];
        const nivel = o.value === 'crrt' ? null : 100 - k * 22;
        return `<button type="button" class="pkpd-escalon ${o.value === tramo ? 'on' : ''} ${o.value === 'crrt' ? 'crrt' : ''}" data-tramo="${o.value}" aria-pressed="${o.value === tramo}">
            <span class="pkpd-renal"><i style="width:${nivel === null ? 100 : nivel}%"></i><em>${o.textContent.trim()}</em></span>
            <span class="pkpd-dosis"><b>${d}</b><small>${k === 0 ? 'dosis de referencia' : (igual ? 'sin ajuste' : 'ajustada')}</small></span>
        </button>`;
    }).join('');
    avisos.innerHTML = `
        <div><b style="color: var(--accent-yellow);">⚠️ Interacciones</b> ${pkpdData[farmaco].inter}</div>
        <div><b style="color: var(--accent-red);">🚫 Precaución</b> ${pkpdData[farmaco].contra}</div>`;
}

function emitir(el) { el.dispatchEvent(new Event('change', { bubbles: true })); }

export function initPkpdVisual() {
    const cont = $('pkpd-escalera');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const f = e.target.closest('[data-farmaco]');
        if (f) { botones().find(b => b.dataset.drug === f.dataset.farmaco).click(); render(); return; }
        const t = e.target.closest('[data-tramo]');
        if (t) { $('pkpd-renal').value = t.dataset.tramo; emitir($('pkpd-renal')); return; }
        if (e.target.closest('[data-grave]')) { const c = $('pkpd-severe-toggle'); c.checked = !c.checked; emitir(c); return; }
        if (e.target.closest('[data-texto]')) irAlTexto($('pkpd-card'), $('pkpd-renal').closest('.form-group'));
    });
    document.addEventListener('change', e => { if (e.target.id === 'pkpd-renal' || e.target.id === 'pkpd-severe-toggle') render(); });
    botones().forEach(b => b.addEventListener('click', () => requestAnimationFrame(render)));
    render();
}
