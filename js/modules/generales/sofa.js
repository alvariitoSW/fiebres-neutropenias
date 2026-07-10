function calcSOFA() {
    let score = Array.from(document.querySelectorAll('.sofa-input')).reduce((sum, input) => sum + parseInt(input.value), 0);
    let d = document.getElementById('sofa-score-display');
    let t = document.getElementById('sofa-eval-text');
    let m = document.getElementById('sofa-management');

    d.innerText = `${score} / 24`;
    if (score >= 2) {
        d.style.color = 'var(--accent-red)';
        t.innerText = 'Disfunción Orgánica Aguda (Sepsis)'; t.style.color = 'var(--accent-red)';
        m.style.display = 'block';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Sepsis-3:</strong>
            <ul><li>Iniciar bundle de resucitación (1h).</li><li>Fluidoterapia (30ml/kg) si hipotensión.</li><li>Vasopresores para objetivo PAM > 65mmHg.</li></ul>`;
    } else {
        d.style.color = 'var(--accent-green)';
        t.innerText = 'Sin disfunción orgánica severa'; t.style.color = 'var(--text-muted)';
        m.style.display = 'block';
        m.innerHTML = `<strong style="color: var(--accent-yellow);">Manejo:</strong>
            <ul><li>Monitorización estándar.</li><li>Reevaluar si hay deterioro clínico.</li></ul>`;
    }
}

export function init() {
    document.querySelectorAll('.sofa-input').forEach(e => e.addEventListener('change', calcSOFA));
    calcSOFA();
}
