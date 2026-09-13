// Índice de comorbilidad de Charlson.
// Fuente: Charlson ME, Pompei P, Ales KL, MacKenzie CR. J Chronic Dis. 1987;40(5):373-383.
// La fórmula de supervivencia a 10 años (10-year survival = 0.983^(e^(score×0.9)))
// usa el índice AJUSTADO POR EDAD (comorbilidad + edad) — el índice de
// comorbilidad puro (sin edad) se muestra aparte, que es el que suele
// citarse para clasificar la carga de comorbilidad en bajo/moderado/alto.

function calcCharlson() {
    const edad = parseInt(document.getElementById('charlson-edad').value);
    const comorbilidad = Array.from(document.querySelectorAll('.charlson-item'))
        .reduce((sum, el) => sum + (parseInt(el.value) ? parseInt(el.dataset.pts) : 0), 0);
    const ajustado = comorbilidad + edad;

    const d = document.getElementById('charlson-score-display');
    const t = document.getElementById('charlson-eval-text');
    const m = document.getElementById('charlson-management');

    const supervivenciaFraccion = Math.pow(0.983, Math.pow(Math.E, ajustado * 0.9));
    const supervivenciaPct = supervivenciaFraccion * 100;
    const supervivenciaTexto = supervivenciaPct < 1 ? '< 1' : supervivenciaPct.toFixed(0);

    d.innerText = `${comorbilidad} pts`;
    m.style.display = 'block';

    let color, texto;
    if (comorbilidad === 0) { color = 'var(--accent-green)'; texto = 'Sin comorbilidad'; }
    else if (comorbilidad <= 2) { color = 'var(--accent-green)'; texto = 'Comorbilidad baja'; }
    else if (comorbilidad <= 4) { color = 'var(--accent-yellow)'; texto = 'Comorbilidad moderada'; }
    else { color = 'var(--accent-red)'; texto = 'Comorbilidad alta'; }

    d.style.color = color;
    t.innerText = texto; t.style.color = color;
    m.innerHTML = `<strong style="color: ${color};">Índice ajustado por edad:</strong>
        <ul>
            <li><strong>${ajustado} pts</strong> (comorbilidad ${comorbilidad} + edad ${edad})</li>
            <li>Supervivencia estimada a 10 años: <strong>~${supervivenciaTexto}%</strong> — estimación aproximada de la cohorte original de derivación, no sustituye el juicio clínico individualizado.</li>
        </ul>`;
}

export function init() {
    document.getElementById('charlson-edad').addEventListener('change', calcCharlson);
    document.querySelectorAll('.charlson-item').forEach(e => e.addEventListener('change', calcCharlson));
    calcCharlson();
}
