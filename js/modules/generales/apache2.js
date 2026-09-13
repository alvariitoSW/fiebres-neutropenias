// APACHE II (Acute Physiology and Chronic Health Evaluation II).
// Fuente: Knaus WA, Draper EA, Wagner DP, Zimmerman JE. Crit Care Med. 1985;13(10):818-829.
// El componente neurológico (15 - Glasgow) se lee directamente de los
// selects .gcs-input de la calculadora de Glasgow de esta misma ficha, en
// vez de duplicar un select de rango de GCS — mismo criterio de cross-link
// dentro de la ficha ya usado en otras calculadoras de la app (p. ej. el
// panel de estado compartido del ciclo cardíaco en Cardiología).

function toggleOxigenacion() {
    const alta = document.getElementById('apache-fio2').value === 'alta';
    document.getElementById('apache-o2-baja-wrap').style.display = alta ? 'none' : 'block';
    document.getElementById('apache-o2-alta-wrap').style.display = alta ? 'block' : 'none';
}

function calcApache() {
    const generic = Array.from(document.querySelectorAll('.apache-input'))
        .reduce((sum, el) => sum + parseInt(el.value), 0);

    const creatBase = parseInt(document.getElementById('apache-creat').value);
    const fra = document.getElementById('apache-fra').value === '1';
    const creatPts = fra ? creatBase * 2 : creatBase;

    const fio2Alta = document.getElementById('apache-fio2').value === 'alta';
    const o2Pts = parseInt(document.getElementById(fio2Alta ? 'apache-o2-alta' : 'apache-o2-baja').value);

    const eye = parseInt(document.getElementById('gcs-eye').value);
    const verbalRaw = document.getElementById('gcs-verbal').value;
    const motor = parseInt(document.getElementById('gcs-motor').value);
    const verbal = verbalRaw === '1T' ? 1 : parseInt(verbalRaw);
    const gcs = eye + verbal + motor;
    const gcsPts = 15 - gcs;

    const agePts = parseInt(document.getElementById('apache-edad').value);
    const chronicPts = parseInt(document.getElementById('apache-cronica').value);

    const total = generic + creatPts + o2Pts + gcsPts + agePts + chronicPts;

    const d = document.getElementById('apache-score-display');
    const t = document.getElementById('apache-eval-text');
    const m = document.getElementById('apache-management');

    d.innerText = `${total} / 71`;
    m.style.display = 'block';

    if (total >= 25) {
        d.style.color = 'var(--accent-red)';
        t.innerText = 'Gravedad muy alta'; t.style.color = 'var(--accent-red)';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo Crítico:</strong>
            <ul><li>Riesgo de mortalidad hospitalaria elevado — la propia escala predice mortalidad creciente a mayor puntuación, sin una cifra única (varía según ingreso médico/quirúrgico y diagnóstico).</li><li>Reevaluar objetivos de cuidado y monitorización invasiva.</li><li>Recalcular a diario con el peor valor de cada variable en 24h.</li></ul>`;
    } else if (total >= 15) {
        d.style.color = 'var(--accent-red)';
        t.innerText = 'Gravedad alta'; t.style.color = 'var(--accent-red)';
        m.innerHTML = `<strong style="color: var(--accent-red);">Manejo:</strong>
            <ul><li>Enfermedad grave, riesgo de mortalidad significativo.</li><li>Monitorización estrecha y soporte de órganos según fallo detectado.</li></ul>`;
    } else if (total >= 10) {
        d.style.color = 'var(--accent-yellow)';
        t.innerText = 'Gravedad moderada'; t.style.color = 'var(--accent-yellow)';
        m.innerHTML = `<strong style="color: var(--accent-yellow);">Manejo:</strong>
            <ul><li>Monitorización habitual de UCI.</li><li>Reevaluar si hay deterioro clínico progresivo.</li></ul>`;
    } else {
        d.style.color = 'var(--accent-green)';
        t.innerText = 'Gravedad leve'; t.style.color = 'var(--text-muted)';
        m.innerHTML = `<strong style="color: var(--accent-green);">Manejo:</strong>
            <ul><li>Riesgo de mortalidad bajo en relación al resto de la escala.</li><li>Monitorización estándar.</li></ul>`;
    }
}

export function init() {
    document.querySelectorAll('.apache-input, .apache-o2-input').forEach(e => e.addEventListener('change', calcApache));
    document.getElementById('apache-creat').addEventListener('change', calcApache);
    document.getElementById('apache-fra').addEventListener('change', calcApache);
    document.getElementById('apache-edad').addEventListener('change', calcApache);
    document.getElementById('apache-cronica').addEventListener('change', calcApache);
    document.getElementById('apache-fio2').addEventListener('change', () => { toggleOxigenacion(); calcApache(); });
    // el GCS se recalcula automáticamente al cambiar cualquiera de los 3
    // selects de la calculadora de Glasgow de esta misma ficha
    document.querySelectorAll('.gcs-input').forEach(e => e.addEventListener('change', calcApache));

    toggleOxigenacion();
    calcApache();
}
