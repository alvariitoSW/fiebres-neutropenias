// Módulo "Reconocimiento Temprano": contenido de referencia sobre fracaso
// respiratorio agudo y manejo crítico general del paciente hematológico
// (Azoulay et al. 2024 y 2025). Interactividad: pestañas, selector de
// terapias dirigidas y checklist de síntomas.
import { initTabs } from '../../core/tabs.js';
import { terapiasDirigidasData } from '../../data/terapias-dirigidas-data.js';

function calcTerapiaDirigida() {
    const select = document.getElementById('rt-terapia-select');
    const box = document.getElementById('rt-terapia-resultado');
    if (!select || !box) return;
    const data = terapiasDirigidasData[select.value];
    if (!data) { box.innerHTML = ''; return; }
    box.innerHTML = `
        <div style="font-weight:bold; color: var(--accent-blue); margin-bottom:8px;">${data.clase} <span style="color:var(--text-muted); font-weight:normal;">(${data.ejemplo})</span></div>
        <div style="margin-bottom:6px;"><strong>Defecto inmune:</strong> ${data.defecto}</div>
        <div style="margin-bottom:6px;"><strong>Clínica esperable:</strong> ${data.clinica}</div>
        <div><strong>Recomendación:</strong> ${data.recomendacion}</div>
    `;
}

function calcSintomas() {
    const checks = document.querySelectorAll('.rt-sintoma-check');
    const box = document.getElementById('rt-sintomas-resultado');
    if (!box) return;
    const count = Array.from(checks).filter(c => c.checked).length;
    if (count === 0) {
        box.innerHTML = 'Marca los síntomas presentes para registrar la evaluación sistemática.';
        box.style.color = 'var(--text-muted)';
    } else {
        box.innerHTML = `${count} síntoma(s) activo(s) — inicia manejo dirigido de cada uno. La evaluación <strong>sistemática</strong> (no solo la intervención puntual) es lo que reduce el estrés postraumático en supervivientes de UCI.`;
        box.style.color = 'var(--accent-yellow)';
    }
}

export function init() {
    initTabs(document.getElementById('panel-reconocimiento-tabs'));

    const select = document.getElementById('rt-terapia-select');
    if (select) {
        select.addEventListener('change', calcTerapiaDirigida);
        calcTerapiaDirigida();
    }

    const sintomaChecks = document.querySelectorAll('.rt-sintoma-check');
    if (sintomaChecks.length) {
        sintomaChecks.forEach(c => c.addEventListener('change', calcSintomas));
        calcSintomas();
    }
}
