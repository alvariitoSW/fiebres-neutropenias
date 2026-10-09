// Vista Visual del Triaje: "el paciente en la puerta".
// Cada criterio IDSA es un marcador numerado sobre su órgano; las dos
// banderas automáticas van fuera del cuerpo. Tocar un marcador marca/desmarca
// la casilla REAL de la vista Texto y dispara su `change`, así que calcTriage()
// (y con él MASCC/CISNE) siguen siendo los únicos que deciden.

import { triajeAutomaticas, triajeIdsa } from '../../data/triaje-data.js';
import { hayRedFlags } from './triaje-mascc.js';
import { irAlTexto } from '../../core/vista-visual.js';
import { SILUETA_SVG, ORGANOS, posicion } from '../../core/silueta.js';

const $ = id => document.getElementById(id);
let sel = null;

function construir(cont) {
    const auto = triajeAutomaticas.map(f =>
        `<button type="button" class="triaje-auto" data-id="${f.id}">${f.corto}</button>`).join('');
    const marcas = triajeIdsa.map((f, i) =>
        `<button type="button" class="cuerpo-marca" data-id="${f.id}" style="${posicion(ORGANOS[f.organo])}" aria-label="${f.corto}">${i + 1}</button>`).join('');
    const leyenda = triajeIdsa.map((f, i) =>
        `<li data-id="${f.id}"><b>${i + 1}</b><span>${f.corto}</span></li>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Banderas automáticas, fuera del cuerpo. Debajo, los criterios IDSA sobre su órgano. <strong>Con una sola, ya es alto riesgo.</strong> Toca para marcar o desmarcar.</p>
        <div class="triaje-autos">${auto}</div>
        <div class="cuerpo">
            <div class="cuerpo-figura">${SILUETA_SVG}${marcas}</div>
            <ol class="cuerpo-leyenda">${leyenda}</ol>
        </div>
        <div class="visual-veredicto" id="triaje-cuerpo-veredicto"></div>
        <div class="visual-detalle" id="triaje-cuerpo-detalle" hidden></div>`;
}

function render() {
    const cont = $('triaje-cuerpo');
    if (!cont) return;
    [...triajeAutomaticas, ...triajeIdsa].forEach(f => {
        const on = $(f.id).checked;
        cont.querySelectorAll(`[data-id="${f.id}"]`).forEach(el => {
            el.classList.toggle('on', on);
            el.classList.toggle('sel', sel === f.id);
            if (el.tagName === 'BUTTON') el.setAttribute('aria-pressed', String(on));
        });
    });

    const marcadas = [...triajeAutomaticas, ...triajeIdsa].filter(f => $(f.id).checked);
    const alto = hayRedFlags();
    const v = $('triaje-cuerpo-veredicto');
    const color = alto ? 'var(--accent-red)' : 'var(--accent-green)';
    v.style.borderColor = color;
    v.style.color = color;
    v.innerHTML = alto
        ? `<strong>${marcadas.length} bandera${marcadas.length === 1 ? '' : 's'} → ALTO RIESGO AUTOMÁTICO</strong>Ingreso + antibiótico iv. El MASCC queda invalidado.`
        : '<strong>Sin banderas</strong>Siguiente paso: Índice MASCC (tarjeta 2).';

    const d = $('triaje-cuerpo-detalle');
    const f = [...triajeAutomaticas, ...triajeIdsa].find(x => x.id === sel);
    if (!f) { d.hidden = true; return; }
    d.hidden = false;
    d.innerHTML = `
        <div class="visual-detalle-titulo">${f.corto} · ${$(f.id).checked ? 'presente' : 'ausente'}</div>
        <div class="visual-detalle-fuente">Texto original: «${f.texto.replace('<', '&lt;')}»</div>
        <button type="button" class="visual-link" data-accion="fuente">Ver en el texto ↓</button>`;
}

export function initTriajeCuerpo() {
    const cont = $('triaje-cuerpo');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const b = e.target.closest('[data-id]');
        if (b && b.tagName === 'BUTTON') {
            sel = b.dataset.id;
            const input = $(sel);
            input.checked = !input.checked;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            return;
        }
        if (e.target.closest('[data-accion="fuente"]') && sel) {
            irAlTexto($('triaje-card'), $(sel).closest('label'));
        }
    });
    document.addEventListener('change', e => { if (e.target.matches?.('.triage-input')) render(); });
    render();
}
