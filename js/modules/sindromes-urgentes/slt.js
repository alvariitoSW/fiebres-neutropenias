// Módulo "Síndrome de Lisis Tumoral (SLT)": criterios diagnósticos
// Cairo-Bishop, selector de riesgo por enfermedad, tabla de fármacos
// uricosúricos y diagramas de fisiopatología/algoritmo de manejo.
import {
    sltLabCriteria,
    sltLabCorte,
    sltClinicalCriteria,
    sltClinicalCorte,
    sltRiesgoOpciones,
    sltFarmacosData,
    sltSvgPurinas,
    sltSvgAlgoritmo
} from '../../data/slt-data.js';

function renderSvgs() {
    const purinas = document.getElementById('slt-purinas-svg');
    if (purinas) purinas.innerHTML = sltSvgPurinas;
    const alg = document.getElementById('slt-algoritmo-svg');
    if (alg) alg.innerHTML = sltSvgAlgoritmo;
}

function renderCairoBishopChecklist() {
    const labCont = document.getElementById('slt-lab-lista');
    if (labCont) {
        labCont.innerHTML = sltLabCriteria.map(c => `
            <label class="checkbox-label">
                <input type="checkbox" class="slt-lab-check">
                ${c.label}
            </label>
        `).join('');
    }
    const clinCont = document.getElementById('slt-clinical-lista');
    if (clinCont) {
        clinCont.innerHTML = sltClinicalCriteria.map(c => `
            <label class="checkbox-label">
                <input type="checkbox" class="slt-clinical-check">
                ${c.label}
            </label>
        `).join('');
    }
}

function calcCairoBishop() {
    const labChecks = document.querySelectorAll('.slt-lab-check');
    const clinChecks = document.querySelectorAll('.slt-clinical-check');
    const box = document.getElementById('slt-cairobishop-resultado');
    if (!box) return;

    const labTotal = Array.from(labChecks).filter(c => c.checked).length;
    const clinTotal = Array.from(clinChecks).filter(c => c.checked).length;
    const labPositivo = labTotal >= sltLabCorte;
    const clinicoPositivo = labPositivo && clinTotal >= sltClinicalCorte;

    let texto;
    let color;
    if (clinicoPositivo) {
        texto = '🚨 SLT clínico (Clinical TLS)';
        color = 'var(--accent-red)';
    } else if (labPositivo) {
        texto = '⚠️ SLT de laboratorio (Laboratory TLS)';
        color = 'var(--accent-yellow)';
    } else {
        texto = 'No cumple criterios de SLT';
        color = 'var(--accent-green)';
    }

    box.innerHTML = `
        <div style="font-size: 0.85rem;">Criterios de laboratorio: <strong>${labTotal}/4</strong> (corte ≥2)</div>
        <div style="font-size: 0.85rem; margin-top: 2px;">Criterios clínicos: <strong>${clinTotal}/4</strong> (corte ≥1, requiere SLT de laboratorio)</div>
        <div style="font-size: 1.05rem; font-weight: bold; margin-top: 8px;">${texto}</div>
    `;
    box.style.color = color;
}

function renderRiesgoSelect() {
    const select = document.getElementById('slt-riesgo-select');
    if (!select) return;
    select.innerHTML = sltRiesgoOpciones.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
}

function calcRiesgo() {
    const select = document.getElementById('slt-riesgo-select');
    const box = document.getElementById('slt-riesgo-resultado');
    if (!select || !box) return;
    const opcion = sltRiesgoOpciones.find(o => o.value === select.value);
    if (!opcion) return;
    box.innerHTML = `<div style="font-size: 1.2rem; font-weight: bold;">${opcion.riesgo}</div>`;
    box.style.color = opcion.color;
}

function renderFarmacosTabla() {
    const cont = document.getElementById('slt-farmacos-tabla');
    if (!cont) return;
    cont.innerHTML = sltFarmacosData.map(f => `
        <tr>
            <td><strong>${f.farmaco}</strong></td>
            <td>${f.indicacion}</td>
            <td>${f.dosisAdulto}</td>
            <td>${f.dosisPediatrica}</td>
            <td>${f.info}</td>
        </tr>
    `).join('');
}

export function init() {
    renderSvgs();
    renderCairoBishopChecklist();
    renderRiesgoSelect();
    renderFarmacosTabla();

    document.querySelectorAll('.slt-lab-check, .slt-clinical-check').forEach(c => c.addEventListener('change', calcCairoBishop));
    calcCairoBishop();

    document.getElementById('slt-riesgo-select').addEventListener('change', calcRiesgo);
    calcRiesgo();
}
