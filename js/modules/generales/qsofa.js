function calcQSOFA() {
    let score = Array.from(document.querySelectorAll('.qsofa-check')).filter(c => c.checked).length;
    let d = document.getElementById('qsofa-score-display');
    let t = document.getElementById('qsofa-eval-text');
    let m = document.getElementById('qsofa-management');

    d.innerText = `${score} / 3`;
    if (score >= 2) {
        d.style.color = 'var(--accent-red)';
        t.innerText = 'Alto riesgo de mala evolución / Sepsis'; t.style.color = 'var(--accent-red)';
        m.style.display = 'block';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Crítico:</strong>
            <ul><li>Alta sospecha de infección con fallo orgánico.</li><li>Extraer hemocultivos y lactato urgente.</li><li>Iniciar despistaje completo (calcular SOFA).</li></ul>`;
    } else {
        d.style.color = 'var(--accent-green)';
        t.innerText = 'Bajo riesgo'; t.style.color = 'var(--text-muted)';
        m.style.display = 'block';
        m.innerHTML = `<strong style="color: var(--accent-yellow);">Manejo:</strong>
            <ul><li>Continuar monitorización habitual.</li><li>Reevaluar si hay deterioro clínico progresivo.</li></ul>`;
    }
}

export function init() {
    document.querySelectorAll('.qsofa-check').forEach(e => e.addEventListener('change', calcQSOFA));
    calcQSOFA();
}
