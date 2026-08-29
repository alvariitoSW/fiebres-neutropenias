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

// Interpretador de NT-proBNP ambulatorio ajustado por edad — umbral fijo
// de descarte (<125 pg/ml) + umbral "probable" por tramo de edad, ambos
// citados literalmente en la ficha.
function calcNtProBnp() {
    const resultado = document.getElementById('ntprobnp-resultado');
    if (!resultado) return;
    const edadEl = document.getElementById('ntprobnp-edad');
    const valorEl = document.getElementById('ntprobnp-valor');
    if (edadEl.value === '' || valorEl.value === '') {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Introduce edad y NT-proBNP.</span>';
        return;
    }
    const edad = Number(edadEl.value);
    const valor = Number(valorEl.value);
    const umbral = edad < 50 ? 125 : (edad <= 75 ? 250 : 500);
    const tramo = edad < 50 ? '<50 años' : (edad <= 75 ? '50-75 años' : '>75 años');

    let estado, texto;
    if (valor < 125) {
        estado = 'tfg-estado-ok';
        texto = `<strong>${valor} pg/ml — descarta IC</strong> (umbral de descarte no ajustado por edad, &lt;125 pg/ml).`;
    } else if (valor >= umbral) {
        estado = 'tfg-estado-danger';
        texto = `<strong>${valor} pg/ml — IC probable</strong> para el tramo de edad ${tramo} (umbral ≥${umbral} pg/ml).`;
    } else {
        estado = 'tfg-estado-warn';
        texto = `<strong>${valor} pg/ml — zona intermedia</strong> para el tramo de edad ${tramo}: por encima del umbral de descarte (125 pg/ml) pero por debajo del umbral "probable" para su edad (≥${umbral} pg/ml). Valorar clínicamente y considerar ecocardiograma.`;
    }
    if (valor > 2000) {
        texto += '<p style="font-size:0.78rem; margin-top:8px; color:var(--text-muted);">NT-proBNP &gt;2000 pg/ml se asocia a 2× riesgo de hospitalización precoz por IC — justifica valoración especialista expedita.</p>';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = texto;
}

function initNtProBnp() {
    const resultado = document.getElementById('ntprobnp-resultado');
    if (!resultado) return;
    document.getElementById('ntprobnp-edad').addEventListener('input', calcNtProBnp);
    document.getElementById('ntprobnp-valor').addEventListener('input', calcNtProBnp);
    calcNtProBnp();
}

// Selector de elegibilidad de TRC por QRS + morfología (Fig. 10) — misma
// tabla de 5 escenarios ya desarrollada en texto, aquí como selector.
function calcTrc() {
    const resultado = document.getElementById('trc-resultado');
    if (!resultado) return;
    const qrs = Number(document.getElementById('trc-qrs').value);
    document.getElementById('trc-qrs-val').textContent = qrs;
    const lbbb = document.getElementById('trc-morfologia').value === 'lbbb';

    let clase, estado, detalle;
    if (qrs < 130) {
        clase = 'Clase III (no recomendada)';
        estado = 'tfg-estado-danger';
        detalle = 'salvo indicación de estimulación por bloqueo AV de alto grado.';
    } else if (qrs < 150) {
        clase = lbbb ? 'Clase IIa' : 'Clase IIb';
        estado = 'tfg-estado-warn';
        detalle = lbbb ? 'QRS 130-149 ms + LBBB.' : 'QRS 130-149 ms + no-LBBB — indicación más débil.';
    } else {
        clase = lbbb ? 'Clase I' : 'Clase IIa';
        estado = lbbb ? 'tfg-estado-ok' : 'tfg-estado-warn';
        detalle = lbbb ? 'QRS ≥150 ms + LBBB — indicación más fuerte.' : 'QRS ≥150 ms + no-LBBB.';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>TRC: ${clase}</strong><p style="font-size:0.82rem; margin-top:6px;">${detalle}</p><p style="font-size:0.78rem; margin-top:8px; color:var(--text-muted);">Requisito de partida en todos los casos: HFrEF con FEVI ≤35% pese a FMT óptimo (reevaluar tras uptitration).</p>`;
}

function initTrc() {
    const resultado = document.getElementById('trc-resultado');
    if (!resultado) return;
    document.getElementById('trc-qrs').addEventListener('input', calcTrc);
    document.getElementById('trc-morfologia').addEventListener('change', calcTrc);
    calcTrc();
}

export function init() {
    initCorkboard('cardio-ic-corkboard', 'panel-cardio-ic-tabs');
    initCha2ds2Va();
    initNtProBnp();
    initTrc();
}
