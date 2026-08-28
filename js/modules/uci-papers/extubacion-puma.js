// Guías PUMA de extubación traqueal — cuaderno de campo + simulador del
// algoritmo de extubación y selector de manejo del laringoespasmo. Fuente:
// Ellard L, et al. Project for Universal Management of Airways: guidelines
// for tracheal extubation. Anaesthesia. 2026.
import { initCorkboard } from '../../core/corkboard.js';

// Reproduce la lógica esencial del algoritmo de extubación (Fig. 2 de la
// guía) a partir de las 3 preguntas encadenadas — simplificación a texto
// para estudio, no sustituye la herramienta oficial ni el juicio clínico.
function calcAlgoritmoExtubacion() {
    const q1El = document.getElementById('extub-alg-q1');
    const q2El = document.getElementById('extub-alg-q2');
    const q3El = document.getElementById('extub-alg-q3');
    const box = document.getElementById('extub-alg-resultado');
    if (!q1El || !q2El || !q3El || !box) return;

    const reintubacionDificil = q1El.value === 'si';
    const ambosEnRiesgo = q2El.value === 'si';
    const diferirReduceRiesgo = q3El.value === 'si';

    let estado, mensaje;
    if (!reintubacionDificil) {
        estado = 'ok';
        mensaje = 'Sin riesgo relevante de reintubación difícil o time-crítica → estrategia sugerida: <strong>Manejo discrecional</strong>. El operador puede elegir libremente entre las opciones habituales de extubación.';
    } else if (!ambosEnRiesgo) {
        estado = 'warn';
        mensaje = 'Riesgo de reintubación difícil, pero mascarilla facial y SGA no están ambos "en riesgo" → estrategia sugerida: <strong>Extubación despierta</strong> (sin necesitar el margen de seguridad extra de un catéter de intercambio).';
    } else if (diferirReduceRiesgo) {
        estado = 'danger';
        mensaje = 'Riesgo de reintubación difícil, mascarilla Y SGA ambos "en riesgo", y diferir reduciría el riesgo significativamente → estrategia sugerida: <strong>Diferir la extubación</strong>. Repite la evaluación completa antes de reconsiderar.';
    } else {
        estado = 'danger';
        mensaje = 'Riesgo de reintubación difícil, mascarilla Y SGA ambos "en riesgo", y diferir NO reduciría el riesgo → estrategia sugerida: <strong>Extubación despierta sobre catéter de intercambio de vía aérea</strong> (o traqueostomía, si persiste riesgo de vía aérea time-crítica y no se anticipa mejoría diferible).';
    }

    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = mensaje;
}

const MANEJO_LARINGOESPASMO = {
    inicial: '<strong>Manejo inicial</strong> — considerar pedir ayuda; retirar el desencadenante potencial (aspiración, minimizar estimulación); O₂ al 100%; optimizar la permeabilidad de la vía aérea superior; CPAP con mascarilla ajustada; maniobra de Larson; propofol a dosis baja (0,25 mg/kg IV).',
    refractario: '<strong class="hl-rojo">Manejo refractario</strong> — si el laringoespasmo persiste, o aparece desaturación/bradicardia: pedir ayuda; propofol a dosis de inducción (2-4 mg/kg IV); bloqueante neuromuscular de intubación, succinilcolina (1-2 mg/kg IV/IO, 2-4 mg/kg IM) o rocuronio (1,5 mg/kg IV).',
};

function actualizarLaringoespasmo() {
    const select = document.getElementById('extub-laring-select');
    const box = document.getElementById('extub-laring-resultado');
    if (!select || !box) return;
    box.className = select.value === 'refractario' ? 'tfg-estado tfg-estado-danger' : 'tfg-estado tfg-estado-warn';
    box.innerHTML = MANEJO_LARINGOESPASMO[select.value];
}

export function init() {
    initCorkboard('extub-corkboard', 'panel-extub-tabs');

    ['extub-alg-q1', 'extub-alg-q2', 'extub-alg-q3'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', calcAlgoritmoExtubacion);
    });
    calcAlgoritmoExtubacion();

    document.getElementById('extub-laring-select')?.addEventListener('change', actualizarLaringoespasmo);
    actualizarLaringoespasmo();
}
