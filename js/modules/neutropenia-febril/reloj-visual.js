// Vista Visual de "2. Reloj de seguridad" (tratamiento dirigido): una barra
// por cada cuenta de días con su umbral marcado — días afebril (≥3) y, en
// la infección microbiológicamente documentada, días de antibiótico (≥7).
// Los umbrales son los que ya muestra el texto de la tarjeta. La imagen no
// decide: los botones escriben en los campos reales, cambian la pestaña
// real (Clínica / Microbiológica) y se copia el veredicto de calcSuspension().

import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const panel = () => $('panel-suspension-perfiles');
const esMicro = () => panel().querySelector('.tab.active')?.dataset.tab === 'tab-micro';

const BARRAS = [
    { id: 'afebril', etiqueta: 'Días afebril', umbral: 3, max: 7, campo: () => esMicro() ? 'susp-afebrile-days-micro' : 'susp-afebrile-days-clin' },
    { id: 'abt', etiqueta: 'Días de antibiótico', umbral: 7, max: 14, campo: () => 'susp-abt-days-micro', soloMicro: true }
];

function construir(cont) {
    const pestañas = [...panel().querySelectorAll('.tabs .tab')].map(t =>
        `<button type="button" data-pestana="${t.dataset.tab}">${t.textContent.trim()}</button>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Cada barra se llena con los días; la línea marca el mínimo. Se puede suspender cuando todas las barras visibles la cruzan.</p>
        <div class="regla-tipos reloj-tipos" role="group" aria-label="Tipo de infección">${pestañas}</div>
        ${BARRAS.map(b => `
            <div class="reloj-barra" data-barra="${b.id}">
                <div class="reloj-cab"><span>${b.etiqueta}</span><b data-num></b></div>
                <div class="reloj-pista"><i data-relleno></i><span class="reloj-umbral" style="left:${(b.umbral / b.max * 100).toFixed(1)}%"><em>≥${b.umbral}</em></span></div>
                <div class="regla-mandos">
                    <button type="button" class="visual-mini" data-paso="-1">− 1 día</button>
                    <button type="button" class="visual-mini" data-paso="1">+ 1 día</button>
                </div>
            </div>`).join('')}
        <button type="button" class="visual-mini reloj-neutro" data-neutro></button>
        <div class="visual-veredicto" data-veredicto></div>
        <p class="visual-guia reloj-oro"></p>
        <button type="button" class="visual-link" data-texto>Ver en el texto ↓</button>`;
    cont.querySelector('.reloj-oro').innerHTML = panel().querySelector('#suspension-result-area .warning-box').innerHTML;
}

function render() {
    const cont = $('reloj-visual');
    const micro = esMicro();
    cont.querySelectorAll('[data-pestana]').forEach(b => b.classList.toggle('active', (b.dataset.pestana === 'tab-micro') === micro));
    BARRAS.forEach(b => {
        const fila = cont.querySelector(`[data-barra="${b.id}"]`);
        fila.hidden = b.soloMicro && !micro;
        const v = parseInt($(b.campo()).value, 10) || 0;
        fila.querySelector('[data-num]').textContent = v;
        const relleno = fila.querySelector('[data-relleno]');
        relleno.style.width = `${Math.min(v, b.max) / b.max * 100}%`;
        relleno.classList.toggle('ok', v >= b.umbral);
    });
    const neutro = $('susp-neutro-persists').checked;
    const bn = cont.querySelector('[data-neutro]');
    bn.textContent = neutro ? '✔ Persiste neutropenia profunda' : '○ Sin neutropenia profunda persistente';
    bn.classList.toggle('on', neutro);
    bn.setAttribute('aria-pressed', String(neutro));
    const t = $('susp-final-result');
    const v = cont.querySelector('[data-veredicto]');
    v.style.borderColor = t.style.color;
    v.innerHTML = `<strong style="color:${t.style.color}">${t.textContent}</strong>${$('susp-final-sub').innerHTML}`;
}

function emitir(el) {
    el.dispatchEvent(new Event(el.type === 'checkbox' ? 'change' : 'input', { bubbles: true }));
}

export function initRelojVisual() {
    const cont = $('reloj-visual');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const pes = e.target.closest('[data-pestana]');
        if (pes) { panel().querySelector(`.tab[data-tab="${pes.dataset.pestana}"]`).click(); render(); return; }
        const paso = e.target.closest('[data-paso]');
        if (paso) {
            const b = BARRAS.find(x => x.id === paso.closest('[data-barra]').dataset.barra);
            const campo = $(b.campo());
            campo.value = String(Math.max(0, (parseInt(campo.value, 10) || 0) + Number(paso.dataset.paso)));
            emitir(campo);
            return;
        }
        if (e.target.closest('[data-neutro]')) { const c = $('susp-neutro-persists'); c.checked = !c.checked; emitir(c); return; }
        if (e.target.closest('[data-texto]')) irAlTexto(panel(), panel().querySelector('.tab-content.active') || panel());
    });
    // Se repinta con cualquier cambio de los campos (desde la vista Texto, desde
    // esta imagen o desde la regla de 10 días): el listener de calcSuspension()
    // está en el propio campo, así que al llegar aquí el veredicto ya está.
    ['input', 'change'].forEach(t => document.addEventListener(t, e => { if (e.target.classList?.contains('susp-inputs')) render(); }));
    panel().querySelectorAll('.tabs .tab').forEach(tab => tab.addEventListener('click', () => requestAnimationFrame(render)));
    render();
}
