// Merino Neumología — embolia pulmonar, asma/EPOC, SDRA, oxigenoterapia y
// ventilación no invasiva en el paciente crítico (cuaderno de campo).
// Fuente: Marik PE. Handbook of Evidence-Based Critical Care, Cap. 22-26.
import { initCorkboard } from '../../core/corkboard.js';

// Ecuación 22.1 — peso ajustado para dosificación de heparina por peso en
// obesidad mórbida (IMC≥40): IBW + 0,4×(peso real − peso ideal).
function calcPesoAjustado() {
    const idealEl = document.getElementById('neumo-peso-ideal');
    const realEl = document.getElementById('neumo-peso-real');
    const resultado = document.getElementById('neumo-peso-ajustado-resultado');
    if (!idealEl || !realEl || !resultado) return;
    if (idealEl.value === '' || realEl.value === '') { resultado.style.display = 'none'; return; }
    const ideal = Number(idealEl.value);
    const real = Number(realEl.value);
    if (ideal < 0 || real < 0) { resultado.style.display = 'none'; return; }

    const ajustado = ideal + 0.4 * (real - ideal);
    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Peso ajustado ≈ ${ajustado.toFixed(1)} kg</strong><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Úsalo en vez del peso real para el régimen de heparina por peso (Tabla 22.3) cuando el IMC sea ≥40 kg/m² — sobreestimar el peso con el régimen estándar promueve anticoagulación excesiva.</p>`;
}
function initPesoAjustado() {
    const resultado = document.getElementById('neumo-peso-ajustado-resultado');
    if (!resultado) return;
    document.getElementById('neumo-peso-ideal')?.addEventListener('input', calcPesoAjustado);
    document.getElementById('neumo-peso-real')?.addEventListener('input', calcPesoAjustado);
    calcPesoAjustado();
}

// Clasificador de gravedad de la obstrucción por PEFR (% predicho).
function calcPefr() {
    const input = document.getElementById('neumo-pefr-input');
    const resultado = document.getElementById('neumo-pefr-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    let pct = Number(input.value);
    if (pct < 0) { pct = 0; input.value = 0; }

    let estado, texto;
    if (pct >= 70) {
        estado = 'tfg-estado-ok';
        texto = 'Obstrucción <strong>leve</strong>.';
    } else if (pct >= 40) {
        estado = 'tfg-estado-warn';
        texto = 'Obstrucción <strong>moderada</strong>.';
    } else {
        estado = 'tfg-estado-danger';
        texto = 'Obstrucción <strong>grave</strong> — un PEFR &lt;200 L/min indica obstrucción grave, y la hipercapnia no ocurre hasta que el PEFR cae por debajo del 25% del predicho.';
    }
    resultado.style.display = 'block';
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${pct}% predicho</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}
function initPefr() {
    const input = document.getElementById('neumo-pefr-input');
    if (!input) return;
    input.addEventListener('input', calcPefr);
    calcPefr();
}

// Clasificador de gravedad del SDRA por PaO2/FiO2 (definición de Berlín).
function calcSdraSeveridad() {
    const input = document.getElementById('neumo-sdra-pao2fio2');
    const resultado = document.getElementById('neumo-sdra-severidad-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    let ratio = Number(input.value);
    if (ratio < 0) { ratio = 0; input.value = 0; }

    let estado, texto;
    if (ratio > 300) {
        estado = 'tfg-estado-ok';
        texto = 'Por encima de 300 mmHg — fuera del rango de gravedad del SDRA (recuerda que también se exige PEEP ≥5 cmH₂O para el criterio diagnóstico completo).';
    } else if (ratio >= 201) {
        estado = 'tfg-estado-ok';
        texto = 'SDRA <strong>leve</strong> — mortalidad intrahospitalaria ≈35%.';
    } else if (ratio >= 100) {
        estado = 'tfg-estado-warn';
        texto = 'SDRA <strong>moderado</strong> — mortalidad intrahospitalaria ≈40%.';
    } else {
        estado = 'tfg-estado-danger';
        texto = 'SDRA <strong>grave</strong> — mortalidad intrahospitalaria ≈45%.';
    }
    resultado.style.display = 'block';
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>PaO₂/FiO₂ = ${ratio} mmHg</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}
function initSdraSeveridad() {
    const input = document.getElementById('neumo-sdra-pao2fio2');
    if (!input) return;
    input.addEventListener('input', calcSdraSeveridad);
    calcSdraSeveridad();
}

// Tabla 24.5 — peso corporal predicho (PBW) y volumen tidal objetivo
// (6 mL/kg) para la ventilación protectora pulmonar.
function calcPbw() {
    const alturaEl = document.getElementById('neumo-pbw-altura');
    const sexoEl = document.getElementById('neumo-pbw-sexo');
    const resultado = document.getElementById('neumo-pbw-resultado');
    if (!alturaEl || !sexoEl || !resultado) return;
    if (alturaEl.value === '' || sexoEl.value === '') { resultado.style.display = 'none'; return; }
    let alturaCm = Number(alturaEl.value);
    if (alturaCm < 0) { alturaCm = 0; alturaEl.value = 0; }
    const alturaPulgadas = alturaCm / 2.54;

    const pbw = sexoEl.value === 'hombre'
        ? 50 + 2.3 * (alturaPulgadas - 60)
        : 45.5 + 2.3 * (alturaPulgadas - 60);
    const pbwClamp = Math.max(pbw, 0);
    const vtInicial = pbwClamp * 8;
    const vtObjetivo = pbwClamp * 6;

    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Peso corporal predicho ≈ ${pbwClamp.toFixed(1)} kg</strong><p style="font-size:0.85rem; margin-top:6px;">Volumen tidal inicial (8 mL/kg): ≈${vtInicial.toFixed(0)} mL · Volumen tidal objetivo (6 mL/kg): ≈${vtObjetivo.toFixed(0)} mL. Reducir 1 mL/kg cada 2h hasta el objetivo, luego ajustar por la presión meseta (≤30 cmH₂O) y el pH (Tabla 24.5).</p>`;
}
function initPbw() {
    const resultado = document.getElementById('neumo-pbw-resultado');
    if (!resultado) return;
    document.getElementById('neumo-pbw-altura')?.addEventListener('input', calcPbw);
    document.getElementById('neumo-pbw-sexo')?.addEventListener('change', calcPbw);
    calcPbw();
}

// Ecuación 25.1 — contenido arterial de O2: CaO2 = 1,34 x Hb x SaO2 x 10.
function calcCao2() {
    const hbEl = document.getElementById('neumo-cao2-hb');
    const sao2El = document.getElementById('neumo-cao2-sao2');
    const resultado = document.getElementById('neumo-cao2-resultado');
    if (!hbEl || !sao2El || !resultado) return;
    if (hbEl.value === '' || sao2El.value === '') { resultado.style.display = 'none'; return; }
    let hb = Number(hbEl.value);
    let sao2 = Number(sao2El.value);
    if (hb < 0) { hb = 0; hbEl.value = 0; }
    if (sao2 < 0) { sao2 = 0; sao2El.value = 0; }
    if (sao2 > 100) { sao2 = 100; sao2El.value = 100; }

    const cao2 = 1.34 * hb * (sao2 / 100) * 10;
    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>CaO₂ ≈ ${cao2.toFixed(0)} mL/L</strong><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Referencias de la propia ficha: normal (Hb 15, SaO₂ 98%) ≈197 mL/L · umbral clásico de O₂ (SaO₂ 90%) ≈181 mL/L (−8%) · umbral transfusional (Hb 7, SaO₂ 98%) ≈92 mL/L (−64%).</p>`;
}
function initCao2() {
    const resultado = document.getElementById('neumo-cao2-resultado');
    if (!resultado) return;
    document.getElementById('neumo-cao2-hb')?.addEventListener('input', calcCao2);
    document.getElementById('neumo-cao2-sao2')?.addEventListener('input', calcCao2);
    calcCao2();
}

export function init() {
    initCorkboard('merino-neumo-corkboard', 'panel-merino-neumo-tabs');
    initPesoAjustado();
    initPefr();
    initSdraSeveridad();
    initPbw();
    initCao2();
}
