// Módulo "Reconocimiento Temprano": contenido de referencia sobre fracaso
// respiratorio agudo y manejo crítico general del paciente hematológico
// (Azoulay et al. 2024 y 2025). Interactividad: cuaderno de campo (fichas
// que se voltean tipo flashcard y abren el tema completo), selector de
// terapias dirigidas y checklist de síntomas.
import { terapiasDirigidasData } from '../../data/terapias-dirigidas-data.js';

// Primer toque: voltea la ficha para dar la pista de repaso. Si ya estaba
// volteada (o se toca el CTA "Ver contenido completo"), abre el tema real
// — el mismo tab-content de siempre, íntegro, sin resumir.
function initCuaderno() {
    const board = document.getElementById('rt-corkboard');
    const panel = document.getElementById('panel-reconocimiento-tabs');
    if (!board || !panel) return;

    function openTopic(id) {
        panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
            panel.style.display = 'block';
            target.classList.add('active');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    board.querySelectorAll('.field-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.back-cta')) {
                openTopic(card.dataset.tab);
                return;
            }
            card.classList.toggle('flipped');
        });
    });
}

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
    initCuaderno();

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
