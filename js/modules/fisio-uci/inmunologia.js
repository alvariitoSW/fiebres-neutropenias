import { initCorkboard } from '../../core/corkboard.js';

// Selector explicativo fiebre vs. hipertermia (Ficha 4) — puramente
// informativo, mismo patrón wireSelectExplicacion ya usado en Nefrología.
const FIEBRE_EXPLICACIONES = {
    infeccion: '🌡️ <strong>Fiebre.</strong> Set point hipotalámico desplazado por PGE2 — la respuesta a antipiréticos confirma el mecanismo. Tratamiento: antipiréticos (paracetamol/AINE) + tratar la causa infecciosa.',
    'golpe-calor': '🔥 <strong>Hipertermia (golpe de calor).</strong> Set point normal, fallo de disipación de calor ante una carga térmica ambiental extrema. Los antipiréticos NO tienen ningún papel — tratamiento con enfriamiento físico activo.',
    succinilcolina: '🔥 <strong>Hipertermia maligna.</strong> Defecto del receptor de rianodina desencadenado por succinilcolina/anestésicos volátiles, con liberación masiva de calcio intracelular. Urgencia: dantroleno + suspender el agente causal + enfriamiento activo.',
    antipsicotico: '🔥 <strong>Síndrome neuroléptico maligno.</strong> Bloqueo dopaminérgico central por antipsicóticos. Tratamiento: suspender el fármaco, enfriamiento, bromocriptina y/o dantroleno.',
    isrs: '🔥 <strong>Síndrome serotoninérgico.</strong> Exceso de actividad serotoninérgica central por combinación de fármacos serotoninérgicos — el clonus y la hiperreflexia lo distinguen del síndrome neuroléptico maligno. Tratamiento: suspender los agentes causales, benzodiacepinas, enfriamiento y, en casos graves, ciproheptadina.',
};

function wireFiebreSelector() {
    const select = document.getElementById('inmuno-fiebre-selector');
    const out = document.getElementById('inmuno-fiebre-resultado');
    if (!select || !out) return;
    select.addEventListener('change', () => {
        out.innerHTML = FIEBRE_EXPLICACIONES[select.value] || '';
    });
}

// Calculadora qSOFA (Ficha 12) — 3 criterios clínicos puntuables 0/1,
// riesgo alto de mal pronóstico con ≥2 puntos (Cap. 22/23).
function calcQsofa() {
    const mental = document.getElementById('inmuno-qsofa-mental');
    const fr = document.getElementById('inmuno-qsofa-fr');
    const pas = document.getElementById('inmuno-qsofa-pas');
    const out = document.getElementById('inmuno-qsofa-resultado');
    if (!mental || !fr || !pas || !out) return;

    const score = [mental, fr, pas].filter(el => el.checked).length;
    let estado, mensaje;
    if (score >= 2) {
        estado = 'danger';
        mensaje = `🔴 qSOFA = ${score}/3 — criterio de alto riesgo de mal pronóstico (≥2 puntos). Sensibilidad ~55%, especificidad ~84% para identificar pacientes con sospecha de infección en riesgo de mala evolución.`;
    } else {
        estado = 'ok';
        mensaje = `✅ qSOFA = ${score}/3 — por debajo del umbral de alto riesgo (≥2 puntos), aunque un qSOFA bajo no descarta sepsis por sí solo: sigue siendo necesario el juicio clínico.`;
    }
    out.className = `result-box tfg-estado-${estado}`;
    out.innerHTML = mensaje;
}

// Interpretación de PCT (Ficha 13) — bandas del algoritmo triangular
// original (Figura 1 del Capítulo 23).
function calcPct() {
    const input = document.getElementById('inmuno-pct-input');
    const out = document.getElementById('inmuno-pct-resultado');
    if (!input || !out) return;
    if (input.value === '') { out.innerHTML = ''; out.className = 'result-box'; return; }

    const pct = Number(input.value);
    if (Number.isNaN(pct) || pct < 0) { out.innerHTML = ''; out.className = 'result-box'; return; }

    let estado, banda, recomendacion;
    if (pct < 0.1) {
        estado = 'ok'; banda = '<0,1 ng/mL';
        recomendacion = 'Antibiótico altamente NO recomendado — infección bacteriana muy improbable.';
    } else if (pct < 0.25) {
        estado = 'ok'; banda = '0,1-0,25 ng/mL';
        recomendacion = 'Antibiótico NO recomendado — sepsis/infección bacteriana poco probable, valorar repetir en 6-24h si persiste sospecha clínica.';
    } else if (pct <= 0.5) {
        estado = 'warn'; banda = '0,25-0,5 ng/mL';
        recomendacion = 'Antibiótico recomendado — zona intermedia, correlacionar estrechamente con la clínica.';
    } else {
        estado = 'danger'; banda = '>0,5 ng/mL';
        recomendacion = 'Antibiótico altamente recomendado — compatible con infección bacteriana/sepsis; >2 ng/mL es indicativo de sepsis.';
    }
    out.className = `result-box tfg-estado-${estado}`;
    out.innerHTML = `🧪 PCT ${pct} ng/mL (banda ${banda})<br>${recomendacion}`;
}

export function init() {
    initCorkboard('inmuno-corkboard', 'panel-inmuno-tabs');

    wireFiebreSelector();

    ['inmuno-qsofa-mental', 'inmuno-qsofa-fr', 'inmuno-qsofa-pas'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calcQsofa);
    });
    calcQsofa();

    const pctInput = document.getElementById('inmuno-pct-input');
    if (pctInput) {
        pctInput.addEventListener('input', calcPct);
        calcPct();
    }
}
