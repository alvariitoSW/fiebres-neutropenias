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

// "¿Dónde cae mi paciente?" — localizador sobre el continuo de FEVI de la
// Figura 1. No repite los cortes borde a borde del gráfico original (no
// verificables pixel a pixel), solo los umbrales ya citados literalmente
// en el texto de esta ficha y de la Ficha V/Ficha IX.
function calcFeviLocator() {
    const resultado = document.getElementById('fevi-locator-resultado');
    if (!resultado) return;
    const fevi = Number(document.getElementById('fevi-locator').value);
    document.getElementById('fevi-locator-val').textContent = fevi;

    const items = [];
    if (fevi < 50) {
        items.push('🧱 <strong>FMT (siempre):</strong> IECA/ARNI/ARA-II, betabloqueante, MRA, iSGLT2 — los 4 pilares en paralelo (HFrEF).');
    } else {
        items.push('🧱 <strong>FMT (siempre):</strong> iSGLT2 y MRA (HFpEF). IECA/ARNI/ARA-II solo Clase IIb.');
    }
    if (fevi <= 35) {
        items.push('🔌 <strong>GDIT a valorar:</strong> DAI de prevención primaria (si isquémica, NYHA II/III, IAM &gt;40 días) y TRC (si QRS ≥130ms con criterios de la Ficha V) — ver Ficha V.');
    }
    if (fevi <= 40) {
        items.push('🧩 <strong>AMT a valorar:</strong> hidralazina/ISDN (pacientes autoidentificados como de raza negra), glucósidos cardíacos.');
    }
    if (fevi < 45) {
        items.push('🧩 <strong>AMT a valorar:</strong> vericiguat (Clase IIb).');
    }
    if (fevi >= 45) {
        items.push('🧩 <strong>AMT a valorar (con IMC ≥30 kg/m²):</strong> semaglutida/tirzepatida (Clase IIa) — ver Ficha IX.');
    }
    resultado.innerHTML = items.map(i => `<p style="margin:4px 0; font-size:0.85rem;">${i}</p>`).join('');
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
}

function initFeviLocator() {
    const resultado = document.getElementById('fevi-locator-resultado');
    if (!resultado) return;
    document.getElementById('fevi-locator').addEventListener('input', calcFeviLocator);
    calcFeviLocator();
}

// Selector "¿qué estadio SCAI tengo delante?" — misma tabla de 5 estadios
// ya tabulada, con el nivel de intervención esperable por estadio.
const SCAI_INFO = {
    A: { estado: 'tfg-estado-ok', texto: 'Sin signos/síntomas de shock, pero en riesgo de desarrollarlo. Nivel de intervención esperable: vigilancia, sin intervención activa del shock todavía.' },
    B: { estado: 'tfg-estado-warn', texto: 'Evidencia clínica de inestabilidad hemodinámica (hipotensión relativa, taquicardia) sin hipoperfusión. Nivel de intervención esperable: optimización de volumen/vigilancia estrecha, sin soporte farmacológico/mecánico todavía.' },
    C: { estado: 'tfg-estado-danger', texto: 'Hipoperfusión que requiere intervención. Nivel de intervención esperable: inotrópico, vasopresor, o soporte circulatorio mecánico.' },
    D: { estado: 'tfg-estado-danger', texto: 'Similar a C pero con fallo de respuesta a las intervenciones iniciales. Nivel de intervención esperable: escalada de soporte — considerar Shock Team y MCS temporal si no está ya en marcha.' },
    E: { estado: 'tfg-estado-danger', texto: 'Shock refractario o parada cardíaca. Nivel de intervención esperable: múltiples intervenciones simultáneas, incluida RCP.' },
};
function initScai() {
    const select = document.getElementById('scai-select');
    const resultado = document.getElementById('scai-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        const info = SCAI_INFO[select.value];
        if (!info) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = `result-box ${info.estado}`;
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<strong>Estadio ${select.value}</strong><p style="font-size:0.85rem; margin-top:6px;">${info.texto}</p>`;
    });
}

// Asistente paso a paso del algoritmo de diuréticos guiado por Na⁺
// urinario (Fig. 15) — mismo patrón ya usado en el algoritmo de citrato
// de TRR continua (UCI/Papers Tuiter): un flujo clicable que avanza según
// la respuesta hasta llegar a la conducta recomendada.
const DIURETICOS_WIZARD = {
    inicio: {
        pregunta: 'Diurético de asa IV iniciado (40mg de furosemida naïve, o el doble de la dosis oral crónica). A las 2h: Na⁺ urinario ≥70 mmol/l, O a las 6h: diuresis ≥100 ml/h.',
        si: { estado: 'tfg-estado-ok', final: 'Respuesta adecuada. Repetir la pauta cada 12h hasta descongestión completa.' },
        no: 'paso2',
    },
    paso2: {
        pregunta: 'Tras doblar la dosis del diurético de asa, O añadir acetazolamida IV o hidroclorotiazida ajustada a FGe (uso crónico) — ¿mejora Na⁺ urinario/diuresis?',
        si: { estado: 'tfg-estado-ok', final: 'Respuesta tras escalada. Continuar reevaluando Na⁺/diuresis en esta pauta.' },
        no: 'paso3',
    },
    paso3: {
        pregunta: 'Tras escalada progresiva del diurético de asa hasta la dosis IV máxima + considerar añadir otros no-asa — ¿mejora?',
        si: { estado: 'tfg-estado-ok', final: 'Respuesta tras escalada máxima. Continuar la pauta con vigilancia estrecha.' },
        no: { estado: 'tfg-estado-danger', final: 'Sin respuesta pese a escalada máxima. Considerar ultrafiltración.' },
    },
};
function renderDiureticosWizard(pasoKey) {
    const preguntaEl = document.getElementById('diureticos-wizard-pregunta');
    const botonesEl = document.getElementById('diureticos-wizard-botones');
    const resultadoEl = document.getElementById('diureticos-wizard-resultado');
    const resetEl = document.getElementById('diureticos-wizard-reset');
    if (!preguntaEl) return;
    const paso = DIURETICOS_WIZARD[pasoKey];
    preguntaEl.textContent = paso.pregunta;
    resultadoEl.style.display = 'none';
    resetEl.style.display = 'none';
    botonesEl.innerHTML = '';
    ['si', 'no'].forEach(resp => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opcion';
        btn.style.flex = '1';
        btn.textContent = resp === 'si' ? 'Sí' : 'No';
        btn.addEventListener('click', () => {
            const next = paso[resp];
            if (typeof next === 'string') {
                renderDiureticosWizard(next);
            } else {
                botonesEl.innerHTML = '';
                resultadoEl.style.display = 'block';
                resultadoEl.className = `result-box ${next.estado}`;
                resultadoEl.style.textAlign = 'left';
                resultadoEl.innerHTML = `<strong>${next.final}</strong>`;
                resetEl.style.display = 'inline-block';
            }
        });
        botonesEl.appendChild(btn);
    });
}
function initDiureticosWizard() {
    const preguntaEl = document.getElementById('diureticos-wizard-pregunta');
    if (!preguntaEl) return;
    renderDiureticosWizard('inicio');
    document.getElementById('diureticos-wizard-reset').addEventListener('click', () => renderDiureticosWizard('inicio'));
}

// Checklist de descongestión pre-alta (Fig. 14) — mismo patrón "checklist
// puntuable con veredicto global" ya usado para los 3 sistemas de
// criterios DRESS en Hematología/Fisiopatología UCI.
function calcDescongestion() {
    const resultado = document.getElementById('desc-resultado');
    if (!resultado) return;
    const checks = document.querySelectorAll('.descongestion-check');
    const total = checks.length;
    const marcados = Array.from(checks).filter(c => c.checked).length;

    let estado, texto;
    if (marcados === total) {
        estado = 'tfg-estado-ok';
        texto = `<strong>${marcados}/${total} dominios en rango óptimo/aceptable.</strong> Sin signos persistentes de congestión detectados en los dominios evaluados — compatible con evaluación de alta.`;
    } else if (marcados === 0) {
        estado = 'tfg-estado-danger';
        texto = `<strong>0/${total} dominios en rango óptimo/aceptable.</strong> Marca los dominios que ya cumplen criterio, o revisa si persiste congestión relevante antes del alta.`;
    } else {
        estado = 'tfg-estado-warn';
        texto = `<strong>${marcados}/${total} dominios en rango óptimo/aceptable.</strong> Persiste al menos un dominio fuera de rango — la guía recomienda excluir signos persistentes de congestión antes del alta (Clase I, C).`;
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = texto;
}

function initDescongestion() {
    const resultado = document.getElementById('desc-resultado');
    if (!resultado) return;
    document.querySelectorAll('.descongestion-check').forEach(c => c.addEventListener('change', calcDescongestion));
    calcDescongestion();
}

// Checklist de derivación a centro de IC avanzada ("Rule of three" +
// "I NEED HELP") — con solo 1 criterio de cualquiera de las 2 listas ya
// es momento de discutir el caso, según el propio texto de la ficha.
function calcDerivacion() {
    const resultado = document.getElementById('derivacion-resultado');
    if (!resultado) return;
    const checks = document.querySelectorAll('.derivacion-check');
    const marcados = Array.from(checks).filter(c => c.checked).length;

    let estado, texto;
    if (marcados === 0) {
        estado = 'tfg-estado-ok';
        texto = 'Sin criterios marcados. Marca los que apliquen al paciente.';
    } else {
        estado = 'tfg-estado-danger';
        texto = `<strong>${marcados} criterio${marcados > 1 ? 's' : ''} marcado${marcados > 1 ? 's' : ''}.</strong> Con solo 1 criterio de cualquiera de las 2 listas ya es momento de discutir el caso con un centro de IC avanzada — salvo muy limitada esperanza de vida u otras condiciones que empeorarían el pronóstico post-trasplante/LVAD.`;
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = texto;
}

function initDerivacion() {
    const resultado = document.getElementById('derivacion-resultado');
    if (!resultado) return;
    document.querySelectorAll('.derivacion-check').forEach(c => c.addEventListener('change', calcDerivacion));
    calcDerivacion();
}

export function init() {
    initCorkboard('cardio-ic-corkboard', 'panel-cardio-ic-tabs');
    initCha2ds2Va();
    initNtProBnp();
    initTrc();
    initFeviLocator();
    initScai();
    initDiureticosWizard();
    initDescongestion();
    initDerivacion();
}
