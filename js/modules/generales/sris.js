function calcSRIS() {
    let score = Array.from(document.querySelectorAll('.sris-check')).filter(c => c.checked).length;
    let d = document.getElementById('sris-score-display');
    let t = document.getElementById('sris-eval-text');
    let m = document.getElementById('sris-management');

    d.innerText = `${score} / 4`;
    if (score >= 2) {
        d.style.color = 'var(--accent-red)';
        t.innerText = 'Cumple criterios SRIS'; t.style.color = 'var(--accent-red)';
        m.style.display = 'block';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Crítico:</strong>
            <ul><li>Sospecha clínica de infección.</li><li>Extraer hemocultivos y lactato.</li><li>Valorar inicio de antibioterapia empírica precoz.</li></ul>`;
    } else {
        d.style.color = 'var(--accent-green)';
        t.innerText = 'No cumple criterios SRIS'; t.style.color = 'var(--text-muted)';
        m.style.display = 'block';
        m.innerHTML = `<strong style="color: var(--accent-yellow);">Manejo:</strong>
            <ul><li>Observación y monitorización clínica habitual.</li><li>Buscar foco infeccioso si la sospecha persiste.</li></ul>`;
    }
}

export function init() {
    document.querySelectorAll('.sris-check').forEach(e => e.addEventListener('change', calcSRIS));
    calcSRIS();
}
