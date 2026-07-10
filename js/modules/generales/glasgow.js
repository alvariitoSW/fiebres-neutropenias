function calcGCS() {
    let eye = parseInt(document.getElementById('gcs-eye').value);
    let verb = document.getElementById('gcs-verbal').value;
    let mot = parseInt(document.getElementById('gcs-motor').value);
    let isIntubated = (verb === "1T");
    let score = eye + (isIntubated ? 1 : parseInt(verb)) + mot;
    
    let d = document.getElementById('gcs-score-display');
    let t = document.getElementById('gcs-eval-text');
    let m = document.getElementById('gcs-management');

    d.innerText = isIntubated ? `${score}T / 15` : `${score} / 15`;
    m.style.display = 'block';
    
    if (score <= 8 && !isIntubated) {
        d.style.color = 'var(--accent-red)'; t.innerText = 'TCE Grave / Coma'; t.style.color = 'var(--accent-red)';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Crítico:</strong><ul><li><strong>Aislamiento de vía aérea (IOT).</strong></li><li>Preoxigenar y preparar ISR.</li></ul>`;
    } else if (score >= 9 && score <= 12) {
        d.style.color = 'var(--accent-yellow)'; t.innerText = 'TCE Moderado'; t.style.color = 'var(--accent-yellow)';
        m.innerHTML = `<strong style="color: var(--accent-yellow);">Manejo:</strong><ul><li>Vigilancia neurológica estricta.</li><li>Considerar neuroimagen urgente.</li></ul>`;
    } else if (isIntubated) {
        d.style.color = 'var(--accent-blue)'; t.innerText = 'Paciente Intubado'; t.style.color = 'var(--accent-blue)';
        m.innerHTML = `<strong style="color: var(--accent-blue);">Manejo:</strong><ul><li>Mantener sedoanalgesia según protocolo (RASS/BIS).</li></ul>`;
    } else {
        d.style.color = 'var(--accent-green)'; t.innerText = 'Normal'; t.style.color = 'var(--accent-green)';
        m.innerHTML = `<strong style="color: var(--accent-green);">Manejo:</strong><ul><li>Exploración neurológica conservada. Vigilancia habitual.</li></ul>`;
    }
}

export function init() {
    document.querySelectorAll('.gcs-input').forEach(e => e.addEventListener('change', calcGCS));
    calcGCS();
}
