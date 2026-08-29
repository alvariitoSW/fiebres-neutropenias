// Insuficiencia Cardíaca (Guías ESC 2026) — cuaderno de campo +
// calculadoras interactivas ancladas a tablas/scores ya citados
// literalmente en la fuente. Fuente: 2026 ESC Guidelines for the
// management of heart failure. Eur Heart J. 2026;00:1-112.
import { initCorkboard } from '../../core/corkboard.js';

// Tabla 18 — CHA₂DS₂-VA (score aditivo simple, sin criterio de sexo,
// a diferencia del CHA₂DS₂-VASc clásico).
function calcCha2ds2Va() {
    const resultado = document.getElementById('cha2ds2va-resultado');
    if (!resultado) return;
    let puntos = 0;
    document.querySelectorAll('.cha2ds2va-check').forEach(c => {
        if (c.checked) puntos += Number(c.value);
    });
    const edadSel = document.getElementById('cha2ds2va-edad');
    puntos += Number(edadSel.value);

    let estado, texto;
    if (puntos >= 2) {
        estado = 'tfg-estado-danger';
        texto = `<strong>${puntos} puntos — riesgo tromboembólico elevado.</strong> Anticoagulación oral indicada (DOAC preferido sobre AVK, salvo estenosis mitral moderada-grave o válvula protésica mecánica).`;
    } else if (puntos === 1) {
        estado = 'tfg-estado-warn';
        texto = `<strong>${puntos} punto — riesgo intermedio.</strong> Considerar anticoagulación oral de forma individualizada.`;
    } else {
        estado = 'tfg-estado-ok';
        texto = `<strong>${puntos} puntos.</strong> Sin indicador de riesgo tromboembólico elevado según este score.`;
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = texto + '<p style="font-size:0.78rem; margin-top:8px; color:var(--text-muted);">En miocardiopatía hipertrófica o amiloidosis cardíaca con FA, la guía recomienda anticoagulación en todos los casos, independientemente de esta puntuación.</p>';
}

function initCha2ds2Va() {
    const resultado = document.getElementById('cha2ds2va-resultado');
    if (!resultado) return;
    document.querySelectorAll('.cha2ds2va-check').forEach(c => c.addEventListener('change', calcCha2ds2Va));
    document.getElementById('cha2ds2va-edad').addEventListener('change', calcCha2ds2Va);
    calcCha2ds2Va();
}

export function init() {
    initCorkboard('cardio-ic-corkboard', 'panel-cardio-ic-tabs');
    initCha2ds2Va();
}
