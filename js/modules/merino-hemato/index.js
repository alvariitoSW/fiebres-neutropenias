// Merino HEMATO — anemia, transfusión de hemoderivados y hemostasia en el
// paciente crítico (cuaderno de campo). Fuente: capítulos "Anemia and Red
// Blood Cell Transfusions" y "Platelets and Plasma", Marik PE. Handbook of
// Evidence-Based Critical Care.
import { initCorkboard } from '../../core/corkboard.js';

// Escala 4Ts (riesgo de trombocitopenia inducida por heparina): 4 selects
// (uno por criterio), puntuación 0-2 cada uno, suma 0-8.
function calc4Ts() {
    const resultado = document.getElementById('ts4-resultado');
    if (!resultado) return;

    const ids = ['ts4-trombo', 'ts4-tiempo', 'ts4-trombosis', 'ts4-otras'];
    const selects = ids.map(id => document.getElementById(id));
    if (selects.some(s => s.value === '')) {
        resultado.className = 'result-box';
        resultado.innerHTML = 'Elige las 4 categorías para calcular la puntuación.';
        return;
    }

    const puntos = selects.reduce((sum, s) => sum + Number(s.value), 0);
    let estado, texto;
    if (puntos <= 3) {
        estado = 'tfg-estado-ok';
        texto = `<strong>${puntos} puntos — riesgo bajo (&lt;1%).</strong> No se necesita más estudio ni retirar la heparina.`;
    } else if (puntos <= 5) {
        estado = 'tfg-estado-warn';
        texto = `<strong>${puntos} puntos — riesgo intermedio (~10%).</strong> Retirar heparina, iniciar anticoagulante no heparínico y solicitar ELISA anti-FP4/heparina.`;
    } else {
        estado = 'tfg-estado-danger';
        texto = `<strong>${puntos} puntos — riesgo alto (~50%).</strong> Retirar heparina e iniciar anticoagulante no heparínico a dosis terapéuticas plenas.`;
    }
    resultado.className = `result-box ${estado}`;
    resultado.innerHTML = texto;
}

function init4Ts() {
    const resultado = document.getElementById('ts4-resultado');
    if (!resultado) return;
    document.querySelectorAll('.ts4-select').forEach(s => s.addEventListener('change', calc4Ts));
    calc4Ts();
}

export function init() {
    initCorkboard('merino-corkboard', 'panel-merino-tabs');
    init4Ts();
}
