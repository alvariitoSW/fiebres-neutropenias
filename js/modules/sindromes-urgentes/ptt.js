// Módulo "Púrpura Trombótica Trombocitopénica (PTT)": definición,
// comparación PTTi/PTTc, calculadoras French score y PLASMIC score,
// desencadenantes, complicaciones a largo plazo, PTT refractaria, embarazo
// y tabla resumen de recomendaciones GRADE.
import {
    pttTipos,
    pttFrenchScoreItems,
    pttFrenchScoreCorte,
    pttPlasmicScoreItems,
    pttPlasmicScoreRangos,
    pttDesencadenantesRecaida,
    pttComplicacionesLargoPlazo,
    pttRefractariaData,
    pttEmbarazoData,
    pttRecomendaciones,
    pttSvgFisiopatologia,
    pttSvgAlgoritmo,
    pttSvgArbolCttp
} from '../../data/ptt-data.js';

function renderSvgs() {
    const fisio = document.getElementById('ptt-fisiopatologia-svg');
    if (fisio) fisio.innerHTML = pttSvgFisiopatologia;
    const alg = document.getElementById('ptt-algoritmo-svg');
    if (alg) alg.innerHTML = pttSvgAlgoritmo;
    const arbol = document.getElementById('ptt-arbol-cttp-svg');
    if (arbol) arbol.innerHTML = pttSvgArbolCttp;
}

function renderTipos() {
    const cont = document.getElementById('ptt-tipos-lista');
    if (!cont) return;
    cont.innerHTML = `
        <div class="compare-row">
            <div class="compare-box blue">
                <strong style="color: var(--accent-blue);">${pttTipos.iTTP.titulo}</strong><br>
                <span style="color: var(--text-muted); font-size: 0.68rem;">${pttTipos.iTTP.subtitulo}</span>
                <p style="margin-top: 6px;">${pttTipos.iTTP.texto}</p>
            </div>
            <div class="compare-box yellow">
                <strong style="color: var(--accent-yellow);">${pttTipos.cTTP.titulo}</strong><br>
                <span style="color: var(--text-muted); font-size: 0.68rem;">${pttTipos.cTTP.subtitulo}</span>
                <p style="margin-top: 6px;">${pttTipos.cTTP.texto}</p>
            </div>
        </div>
    `;
}

function renderFrenchChecklist() {
    const cont = document.getElementById('ptt-french-lista');
    if (!cont) return;
    cont.innerHTML = pttFrenchScoreItems.map(i => `
        <label class="checkbox-label">
            <input type="checkbox" class="ptt-french-check" value="${i.puntos}">
            ${i.label}
        </label>
    `).join('');
}

function calcFrenchScore() {
    const checks = document.querySelectorAll('.ptt-french-check');
    const total = Array.from(checks).filter(c => c.checked).reduce((acc, c) => acc + parseInt(c.value, 10), 0);
    const box = document.getElementById('ptt-french-resultado');
    if (!box) return;
    const cumple = total >= pttFrenchScoreCorte;
    box.innerHTML = `
        <div style="font-size: 1.6rem; font-weight: bold;">${total} / 3</div>
        <div style="margin-top: 6px; font-size: 0.85rem;">${cumple ? '⚠️ Alto riesgo de déficit grave de ADAMTS-13' : 'Riesgo no alto según este score'}</div>
    `;
    box.style.color = cumple ? 'var(--accent-red)' : 'var(--accent-green)';
}

function renderPlasmicChecklist() {
    const cont = document.getElementById('ptt-plasmic-lista');
    if (!cont) return;
    cont.innerHTML = pttPlasmicScoreItems.map(i => `
        <label class="checkbox-label">
            <input type="checkbox" class="ptt-plasmic-check" value="${i.puntos}">
            ${i.label}
        </label>
    `).join('');
}

function calcPlasmicScore() {
    const checks = document.querySelectorAll('.ptt-plasmic-check');
    const total = Array.from(checks).filter(c => c.checked).reduce((acc, c) => acc + parseInt(c.value, 10), 0);
    const box = document.getElementById('ptt-plasmic-resultado');
    if (!box) return;
    const rango = pttPlasmicScoreRangos.find(r => total >= r.min && total <= r.max);
    box.innerHTML = `
        <div style="font-size: 1.6rem; font-weight: bold;">${total} / 7</div>
        <div style="margin-top: 6px; font-size: 0.85rem;">${rango.riesgo}</div>
    `;
    box.style.color = rango.color;
}

function renderDesencadenantes() {
    const cont = document.getElementById('ptt-desencadenantes-lista');
    if (!cont) return;
    cont.innerHTML = pttDesencadenantesRecaida.map(d => `<li>${d}</li>`).join('');
}

function renderComplicaciones() {
    const cont = document.getElementById('ptt-complicaciones-lista');
    if (!cont) return;
    cont.innerHTML = pttComplicacionesLargoPlazo.map(c => `<li>${c}</li>`).join('');
}

function renderRefractaria() {
    const cont = document.getElementById('ptt-refractaria-tabla');
    if (!cont) return;
    cont.innerHTML = pttRefractariaData.map(r => `
        <tr><td><strong>${r.farmaco}</strong></td><td>${r.dosis}</td></tr>
    `).join('');
}

function renderEmbarazo() {
    const cont = document.getElementById('ptt-embarazo-lista');
    if (!cont) return;
    cont.innerHTML = pttEmbarazoData.map(e => `<li>${e}</li>`).join('');
}

function renderRecomendaciones() {
    const cont = document.getElementById('ptt-recomendaciones-lista');
    if (!cont) return;
    cont.innerHTML = pttRecomendaciones.map(r => `
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <strong style="color: var(--accent-blue);">Rec. ${r.num}.</strong> ${r.texto}
            <span class="grade-badge">${r.fuerza}, certeza ${r.certeza}</span>
            ${r.cambio ? `<div style="margin-top: 4px; font-size: 0.72rem; color: var(--accent-yellow);">🔄 ${r.cambioTexto}</div>` : ''}
        </div>
    `).join('');
}

export function init() {
    renderSvgs();
    renderTipos();
    renderFrenchChecklist();
    renderPlasmicChecklist();
    renderDesencadenantes();
    renderComplicaciones();
    renderRefractaria();
    renderEmbarazo();
    renderRecomendaciones();

    document.querySelectorAll('.ptt-french-check').forEach(c => c.addEventListener('change', calcFrenchScore));
    calcFrenchScore();

    document.querySelectorAll('.ptt-plasmic-check').forEach(c => c.addEventListener('change', calcPlasmicScore));
    calcPlasmicScore();
}
