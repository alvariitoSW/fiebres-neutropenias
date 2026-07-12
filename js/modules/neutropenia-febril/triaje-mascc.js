function calcTriage() {
    let isSepsis = document.getElementById('triage-sepsis').checked;
    let isLMA = document.getElementById('triage-lma').checked;
    let idsaChecks = Array.from(document.querySelectorAll('.idsa-check')).filter(c => c.checked);
    let box = document.getElementById('triage-result-box');
    let text = document.getElementById('triage-eval-text');
    let m = document.getElementById('triage-management');

    if (isSepsis || isLMA || idsaChecks.length > 0) {
        box.style.borderColor = 'var(--accent-red)'; box.style.background = 'rgba(255, 51, 102, 0.1)';
        text.innerText = 'ALTO RIESGO AUTOMÁTICO (Ingreso + IV)'; text.style.color = 'var(--accent-red)';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Crítico:</strong><br>
            <ul>
                <li><strong>Ingreso hospitalario inmediato + ABT IV.</strong></li>
                ${isSepsis ? '<li><strong>Sepsis/Shock:</strong> Valorar ingreso directo en UCI. Retirada de CVC recomendada.</li>' : ''}
                ${isLMA ? '<li><strong>Fase Crítica:</strong> Riesgo máximo por inducción/acondicionamiento.</li>' : ''}
                ${idsaChecks.length > 0 ? `<li><strong>Comorbilidad de alto riesgo (IDSA):</strong> ${idsaChecks.map(c => c.parentElement.textContent.trim()).join(', ')}.</li>` : ''}
                <li><em>El Índice MASCC queda invalidado.</em></li>
            </ul>`;
    } else {
        box.style.borderColor = 'var(--accent-blue)'; box.style.background = 'rgba(0, 240, 255, 0.05)';
        text.innerText = 'Sin Red Flags. Evaluar MASCC.'; text.style.color = 'var(--accent-blue)';
        m.innerHTML = `<strong style="color: var(--accent-blue);">Siguiente paso:</strong><br>
            Evaluar riesgo de complicaciones con Índice MASCC (Abajo).`;
    }
    calcMASCC();
    calcCISNE();
}

function calcMASCC() {
    let highRisk = document.getElementById('triage-sepsis').checked
        || document.getElementById('triage-lma').checked
        || document.querySelectorAll('.idsa-check:checked').length > 0;
    let score = parseInt(document.getElementById('mascc-carga').value);
    if (document.getElementById('mascc-hipotension').checked) score += 5;
    if (document.getElementById('mascc-epoc').checked) score += 4;
    if (document.getElementById('mascc-tumor').checked) score += 4;
    if (document.getElementById('mascc-deshidratacion').checked) score += 3;
    if (document.getElementById('mascc-ambulatorio').checked) score += 3;
    if (document.getElementById('mascc-edad').checked) score += 2;

    let d = document.getElementById('mascc-score-display');
    let t = document.getElementById('mascc-eval-text');
    let m = document.getElementById('mascc-management');

    d.innerText = `${score} / 26`;
    if (highRisk) {
        d.style.color = 'var(--text-muted)'; t.innerText = 'INVALIDADO POR RED FLAGS'; t.style.color = 'var(--accent-red)';
        m.innerHTML = `Puntuación irrelevante. El paciente ya cumple criterios de <strong>ALTO RIESGO AUTOMÁTICO</strong>.`;
    } else if (score >= 21) {
        d.style.color = 'var(--accent-green)'; t.innerText = 'Bajo Riesgo'; t.style.color = 'var(--accent-green)';
        m.innerHTML = `<strong style="color: var(--accent-green);">Manejo:</strong><ul><li>Candidato a ABT oral y manejo ambulatorio. Control 48-72h.</li></ul>`;
    } else {
        d.style.color = 'var(--accent-red)'; t.innerText = 'Alto Riesgo'; t.style.color = 'var(--accent-red)';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Crítico:</strong><ul><li>Ingreso + ABT IV. Extraer hemocultivos inmediatos.</li></ul>`;
    }
}

function calcCISNE() {
    let highRisk = document.getElementById('triage-sepsis').checked
        || document.getElementById('triage-lma').checked
        || document.querySelectorAll('.idsa-check:checked').length > 0;

    let score = 0;
    if (document.getElementById('cisne-ecog').checked) score += 2;
    if (document.getElementById('cisne-hipergluc').checked) score += 2;
    if (document.getElementById('cisne-epoc').checked) score += 1;
    if (document.getElementById('cisne-cardio').checked) score += 1;
    if (document.getElementById('cisne-mucositis').checked) score += 1;
    if (document.getElementById('cisne-monocitos').checked) score += 1;

    let d = document.getElementById('cisne-score-display');
    let t = document.getElementById('cisne-eval-text');
    let m = document.getElementById('cisne-management');

    d.innerText = `${score} / 8`;
    if (highRisk) {
        d.style.color = 'var(--text-muted)'; t.innerText = 'INVALIDADO POR RED FLAGS'; t.style.color = 'var(--accent-red)';
        m.innerHTML = `Puntuación irrelevante. El paciente ya cumple criterios de <strong>ALTO RIESGO AUTOMÁTICO</strong>.`;
    } else if (score === 0) {
        d.style.color = 'var(--accent-green)'; t.innerText = 'Bajo Riesgo (~1.1% complicaciones)'; t.style.color = 'var(--accent-green)';
        m.innerHTML = `<strong style="color: var(--accent-green);">Manejo:</strong><ul><li>Candidato a manejo ambulatorio si el contexto lo permite. Recuerda: validado en tumores sólidos, no en hematología.</li></ul>`;
    } else if (score <= 2) {
        d.style.color = 'var(--accent-yellow)'; t.innerText = 'Riesgo Intermedio (~6.2% complicaciones)'; t.style.color = 'var(--accent-yellow)';
        m.innerHTML = `<strong style="color: var(--accent-yellow);">Manejo:</strong><ul><li>Valorar observación hospitalaria corta o ambulatorio con seguimiento estrecho.</li></ul>`;
    } else {
        d.style.color = 'var(--accent-red)'; t.innerText = 'Alto Riesgo (~36% complicaciones)'; t.style.color = 'var(--accent-red)';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Crítico:</strong><ul><li>Ingreso + ABT IV. Extraer hemocultivos inmediatos.</li></ul>`;
    }
}

export function init() {
    document.querySelectorAll('.triage-input').forEach(e => e.addEventListener('change', calcTriage));
    document.querySelectorAll('.mascc-input').forEach(e => e.addEventListener('change', calcMASCC));
    document.querySelectorAll('.cisne-input').forEach(e => e.addEventListener('change', calcCISNE));
    calcTriage();
}
