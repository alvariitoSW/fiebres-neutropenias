// Vista Visual de "1. Sin foco clínico": la escalera ECIL-10.
// Cuatro peldaños que suben con cada dato del paciente (riesgo bajo → BLEE →
// crítico → resistente a carbapenem) y una barandilla SARM que se suma a
// cualquiera. Tocar un peldaño marca/desmarca su casilla REAL; el peldaño que
// manda lo decide escalonSinFocoActivo(), la misma función que pinta la
// recomendación de la vista Texto. Textos: empirico-sin-foco-data.js.

import { escalonesSinFoco, notaCriticoConCr, sarmSinFoco, notaGramPositivoSinFoco } from '../../data/empirico-sin-foco-data.js';
import { escalonSinFocoActivo } from './tratamiento-empirico.js';
import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const CASILLAS = ['tx-inestable', 'tx-mdr', 'tx-cr', 'tx-sarm'];

function cambiar(id, valor) {
    const el = $(id);
    if (el.checked === valor) return;
    el.checked = valor;
    el.dispatchEvent(new Event('change', { bubbles: true }));
}

function construir(cont) {
    const n = escalonesSinFoco.length;
    const peldanos = escalonesSinFoco.map((e, i) => `
        <div class="peldano-col" style="padding-top:${(n - 1 - i) * 34}px">
            <span class="peldano-pie" aria-hidden="true"></span>
            <button type="button" class="peldano" data-id="${e.id}" style="--peldano:${e.color}">
                <b>${i + 1}</b><span>${e.corto}</span>
            </button>
        </div>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Se sube un peldaño por cada dato del paciente. Toca un peldaño para marcar su casilla; el punto blanco indica el que manda.</p>
        <div class="escalera">${peldanos}</div>
        <button type="button" class="barandilla" id="esc-sarm" aria-pressed="false">
            <b>Barandilla · colonización SARM</b> <span id="esc-sarm-estado"></span>
        </button>
        <div class="visual-detalle" id="esc-panel"></div>`;
}

function render() {
    const cont = $('empirico-escalera');
    if (!cont) return;
    const activo = escalonSinFocoActivo();
    escalonesSinFoco.forEach(e => {
        const b = cont.querySelector(`.peldano[data-id="${e.id}"]`);
        const marcado = e.checkbox ? $(e.checkbox).checked : !CASILLAS.slice(0, 3).some(id => $(id).checked);
        b.classList.toggle('marcado', marcado);
        b.setAttribute('aria-pressed', String(marcado));
        b.closest('.peldano-col').classList.toggle('activo', e.id === activo.id);
    });
    const sarm = $('tx-sarm').checked;
    $('esc-sarm').setAttribute('aria-pressed', String(sarm));
    $('esc-sarm').classList.toggle('on', sarm);
    $('esc-sarm-estado').textContent = sarm ? '· activada' : '· toca para añadirla';

    const extraCr = activo.id === 'inestable' && $('tx-cr').checked ? `<div class="esc-extra">${notaCriticoConCr}</div>` : '';
    const s = sarm ? sarmSinFoco[activo.id === 'inestable' ? 'inestable' : 'estable'] : null;
    const extraSarm = s ? `<div class="esc-extra sarm"><strong>${s.titulo}</strong> <span class="grade-badge">${s.grado}</span> ${s.texto}</div>` : '';
    $('esc-panel').style.borderColor = activo.color;
    $('esc-panel').innerHTML = `
        <div class="visual-detalle-titulo" style="color:${activo.color}">${activo.titulo}${activo.grado ? ` <span class="grade-badge${activo.gradoClase ? ' ' + activo.gradoClase : ''}">${activo.grado}</span>` : ''}</div>
        <div class="esc-regimen">${activo.regimen}</div>
        ${extraCr}${extraSarm}
        <div class="visual-detalle-fuente">${notaGramPositivoSinFoco}</div>
        <button type="button" class="visual-link" data-accion="fuente">Ver en el texto ↓</button>`;
}

export function initEmpiricoEscalera() {
    const cont = $('empirico-escalera');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const p = e.target.closest('.peldano');
        if (p) {
            const esc = escalonesSinFoco.find(x => x.id === p.dataset.id);
            // Riesgo bajo = ninguno de los tres datos de riesgo; los demás alternan su casilla.
            if (!esc.checkbox) CASILLAS.slice(0, 3).forEach(id => cambiar(id, false));
            else cambiar(esc.checkbox, !$(esc.checkbox).checked);
            return;
        }
        if (e.target.closest('#esc-sarm')) { cambiar('tx-sarm', !$('tx-sarm').checked); return; }
        if (e.target.closest('[data-accion="fuente"]')) irAlTexto($('empirico-sinfoco-card'), $('tx-recomendacion'));
    });
    document.addEventListener('change', e => { if (CASILLAS.includes(e.target.id)) render(); });
    render();
}
