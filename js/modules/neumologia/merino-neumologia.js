// Merino Neumología — embolia pulmonar, asma/EPOC, SDRA, oxigenoterapia y
// ventilación no invasiva en el paciente crítico (cuaderno de campo).
// Fuente: Marik PE. Handbook of Evidence-Based Critical Care, Cap. 22-26.
import { initCorkboard, openCorkboardTopic } from '../../core/corkboard.js';

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

// Enlaces cruzados internos al propio corkboard (referencias a "Capítulo
// 27/28/30" que quedaron desactualizadas al incorporar la Parte 2). Nunca
// .tx-link (acoplado al listener global de nefrologia/index.js) — clase e
// interruptor propios, mismo patrón ya usado por fisio-uci/hematologia.js
// para su cross-link interno a la Ficha 4 de TEG/ROTEM.
function initInternalLinks() {
    document.querySelectorAll('.neumo-internal-link').forEach(btn => {
        btn.addEventListener('click', () => openCorkboardTopic('panel-merino-neumo-tabs', btn.dataset.target));
    });
}

// Tabla 25.2 — selector "¿qué sistema necesito según la FiO2 objetivo?".
const SISTEMAS_O2 = [
    { nombre: 'O₂ nasal de bajo flujo', min: 24, max: 40, flujo: '1-6 L/min' },
    { nombre: 'Mascarilla facial estándar', min: 35, max: 50, flujo: '5-10 L/min' },
    { nombre: 'Mascarilla de no reinhalación', min: 60, max: 80, flujo: '≥10 L/min' },
    { nombre: 'Mascarilla de arrastre de aire (air-entrainment)', min: 24, max: 50, flujo: '2-15 L/min' },
    { nombre: 'OxyMask™', min: 24, max: 90, flujo: '1-≥15 L/min' },
    { nombre: 'O₂ nasal de alto flujo', min: 24, max: 100, flujo: '1-60 L/min' },
];
function calcSistemaO2() {
    const input = document.getElementById('neumo-o2-fio2-objetivo');
    const resultado = document.getElementById('neumo-o2-sistema-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    let fio2 = Number(input.value);
    if (fio2 < 21) { fio2 = 21; input.value = 21; }
    if (fio2 > 100) { fio2 = 100; input.value = 100; }

    const candidatos = SISTEMAS_O2.filter(s => fio2 >= s.min && fio2 <= s.max);
    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    if (candidatos.length === 0) {
        resultado.innerHTML = `<strong>FiO₂ objetivo: ${fio2}%</strong><p style="font-size:0.85rem; margin-top:6px;">Ningún sistema de la Tabla 25.2 cubre por sí solo esta FiO₂ con fiabilidad — considera O₂ nasal de alto flujo o valorar ventilación no invasiva.</p>`;
    } else {
        const lista = candidatos.map(s => `<li><strong>${s.nombre}</strong> — ${s.flujo}, rango ${s.min}-${s.max}%</li>`).join('');
        resultado.innerHTML = `<strong>FiO₂ objetivo: ${fio2}%</strong><p style="font-size:0.85rem; margin-top:6px;">Sistemas que cubren este objetivo:</p><ul style="margin:4px 0 0; padding-left:18px; font-size:0.85rem;">${lista}</ul>`;
    }
}
function initSistemaO2() {
    const input = document.getElementById('neumo-o2-fio2-objetivo');
    if (!input) return;
    input.addEventListener('input', calcSistemaO2);
    calcSistemaO2();
}

// Ecuaciones 27.4/27.5 — calculadora de compliance estática (Cstat).
function calcCstat() {
    const vtEl = document.getElementById('neumo-cstat-vt');
    const presionEl = document.getElementById('neumo-cstat-presion');
    const peepEl = document.getElementById('neumo-cstat-peep');
    const resultado = document.getElementById('neumo-cstat-resultado');
    if (!vtEl || !presionEl || !peepEl || !resultado) return;
    if (vtEl.value === '' || presionEl.value === '' || peepEl.value === '') { resultado.style.display = 'none'; return; }
    let vt = Number(vtEl.value);
    let presion = Number(presionEl.value);
    let peep = Number(peepEl.value);
    if (vt < 0) { vt = 0; vtEl.value = 0; }
    if (presion < 0) { presion = 0; presionEl.value = 0; }
    if (peep < 0) { peep = 0; peepEl.value = 0; }

    const driving = presion - peep;
    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    if (driving <= 0) {
        resultado.className = 'result-box tfg-estado-danger';
        resultado.innerHTML = `<strong>⚠️ Combinación no fisiológica</strong><p style="font-size:0.85rem; margin-top:6px;">La presión meseta (o Paw fin-insp) debe ser mayor que la PEEP total — revisa los datos.</p>`;
        return;
    }
    const cstat = vt / driving;
    let estado, texto;
    if (cstat >= 50) {
        estado = 'tfg-estado-ok';
        texto = 'Dentro del rango normal (50-80 mL/cmH₂O).';
    } else if (cstat >= 25) {
        estado = 'tfg-estado-warn';
        texto = 'Por debajo de lo normal, pero por encima del umbral típico de enfermedad pulmonar infiltrativa (&lt;25 mL/cmH₂O).';
    } else {
        estado = 'tfg-estado-danger';
        texto = 'Compatible con enfermedad pulmonar infiltrativa (&lt;25 mL/cmH₂O) — p. ej., edema pulmonar o SDRA.';
    }
    resultado.className = `result-box ${estado}`;
    resultado.innerHTML = `<strong>Cstat ≈ ${cstat.toFixed(1)} mL/cmH₂O</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}
function initCstat() {
    const resultado = document.getElementById('neumo-cstat-resultado');
    if (!resultado) return;
    ['neumo-cstat-vt', 'neumo-cstat-presion', 'neumo-cstat-peep'].forEach(id =>
        document.getElementById(id)?.addEventListener('input', calcCstat));
    calcCstat();
}

// Selector explicativo "¿disparo por presión o por flujo?" (puramente
// informativo, sin puntuación).
const TRIGGER_INFO = {
    presion: 'Requiere generar una presión negativa de vía aérea de 2-3 cmH₂O. Pese a ser un requisito bajo, <strong>alrededor de un tercio de los esfuerzos inspiratorios fracasan</strong> en disparar una respiración cuando la señal es la presión.',
    flujo: 'Implica poco o ningún cambio en presiones y volúmenes, por lo que <strong>involucra menos trabajo mecánico</strong> que el disparo por presión — por esto ha reemplazado a la presión como mecanismo estándar. Requiere tasas de 1-10 L/min. Su problema principal es el <strong>auto-disparo por fugas</strong> del sistema.',
};
function initTriggerSelect() {
    const select = document.getElementById('neumo-trigger-select');
    const resultado = document.getElementById('neumo-trigger-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        if (!select.value) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = 'result-box';
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<p style="font-size:0.85rem;">${TRIGGER_INFO[select.value]}</p>`;
    });
}

// Checklist de contraindicaciones de la IMV.
function calcImvChecklist() {
    const checks = document.querySelectorAll('.neumo-imv-check:checked');
    const resultado = document.getElementById('neumo-imv-resultado');
    if (!resultado) return;
    if (checks.length === 0) { resultado.style.display = 'none'; return; }
    const motivos = Array.from(checks)
        .map(c => c.value === 'debilidad' ? 'debilidad de la musculatura respiratoria' : 'disfunción ventricular izquierda')
        .join(' y ');
    resultado.style.display = 'block';
    resultado.className = 'result-box tfg-estado-danger';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>⚠️ IMV no recomendada</strong><p style="font-size:0.85rem; margin-top:6px;">Con ${motivos}, la IMV puede aumentar el trabajo respiratorio y/o comprometer el gasto cardíaco — considera otro modo (p. ej., asisto-control con disparo por flujo).</p>`;
}
function initImvChecklist() {
    const boxes = document.querySelectorAll('.neumo-imv-check');
    if (!boxes.length) return;
    boxes.forEach(b => b.addEventListener('change', calcImvChecklist));
    calcImvChecklist();
}

// Tabla 29.4 — selector "¿qué método de cultivo elijo?" con gauge de
// razón de probabilidades diagnóstica (DOR).
const CULTIVO_INFO = {
    aspirado: { umbral: '10⁵ UFC/mL', sens: '76%', esp: '68%', dor: 6.6, nombre: 'Aspirado traqueal' },
    psb: { umbral: '10³ UFC/mL', sens: '61%', esp: '77%', dor: 5.1, nombre: 'Cepillo protegido (PSB)' },
    bal: { umbral: '10⁴ UFC/mL', sens: '71%', esp: '80%', dor: 9.6, nombre: 'Lavado broncoalveolar (BAL)' },
};
function initCultivoSelect() {
    const select = document.getElementById('neumo-cultivo-select');
    const resultado = document.getElementById('neumo-cultivo-resultado');
    const gaugeRow = document.getElementById('neumo-cultivo-gauge-row');
    const gaugeFill = document.getElementById('neumo-cultivo-gauge-fill');
    const gaugeValor = document.getElementById('neumo-cultivo-gauge-valor');
    if (!select || !resultado || !gaugeRow || !gaugeFill || !gaugeValor) return;
    select.addEventListener('change', () => {
        if (!select.value) { resultado.style.display = 'none'; gaugeRow.style.display = 'none'; return; }
        const info = CULTIVO_INFO[select.value];
        gaugeRow.style.display = 'block';
        gaugeValor.textContent = info.dor.toFixed(1);
        gaugeFill.style.width = `${Math.min(100, (info.dor / 10) * 100)}%`;
        gaugeFill.style.background = info.dor >= 8 ? 'var(--accent-green)' : info.dor >= 6 ? 'var(--accent-yellow)' : 'var(--accent-red)';
        resultado.style.display = 'block';
        resultado.className = 'result-box';
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<strong>${info.nombre}</strong><p style="font-size:0.85rem; margin-top:6px;">Umbral: ${info.umbral} · Sensibilidad: ${info.sens} · Especificidad: ${info.esp} · Razón de probabilidades diagnóstica: ${info.dor.toFixed(1)}${info.dor === 9.6 ? ' — el método más fiable disponible.' : '.'}</p>`;
    });
}

// Tabla 29.5 — clasificador de derrame paraneumónico (categorías 1-4).
function mostrarDerrame(resultado, categoria, motivo, nivel) {
    resultado.style.display = 'block';
    resultado.className = `result-box tfg-estado-${nivel}`;
    resultado.style.textAlign = 'left';
    const tubo = categoria >= 3 ? 'Sí' : 'No';
    resultado.innerHTML = `<strong>Categoría ${categoria}</strong><p style="font-size:0.85rem; margin-top:6px;">${motivo}</p><p style="font-size:0.85rem; margin-top:4px;"><strong>Tubo torácico:</strong> ${tubo}.</p>`;
}
function calcDerrame() {
    const purulentoEl = document.getElementById('neumo-derrame-purulento');
    const grosorEl = document.getElementById('neumo-derrame-grosor');
    const loculadoEl = document.getElementById('neumo-derrame-loculado');
    const phEl = document.getElementById('neumo-derrame-ph');
    const glucosaEl = document.getElementById('neumo-derrame-glucosa');
    const gramEl = document.getElementById('neumo-derrame-gram');
    const resultado = document.getElementById('neumo-derrame-resultado');
    if (!purulentoEl || !grosorEl || !loculadoEl || !phEl || !glucosaEl || !gramEl || !resultado) return;
    if (purulentoEl.value === '' || grosorEl.value === '') { resultado.style.display = 'none'; return; }

    if (purulentoEl.value === 'si') {
        mostrarDerrame(resultado, 4, 'Purulento a simple vista.', 'danger');
        return;
    }

    let grosor = Number(grosorEl.value);
    if (grosor < 0) { grosor = 0; grosorEl.value = 0; }
    if (grosor < 10) {
        mostrarDerrame(resultado, 1, '&lt;10 mm de grosor. Toracocentesis no necesaria, salvo deterioro clínico o aumento de tamaño del derrame.', 'ok');
        return;
    }

    if (loculadoEl.value === '') { resultado.style.display = 'none'; return; }
    if (gramEl.value === '') { resultado.style.display = 'none'; return; }

    const ph = phEl.value === '' ? null : Number(phEl.value);
    const glucosa = glucosaEl.value === '' ? null : Number(glucosaEl.value);
    const infectado = loculadoEl.value === 'si' || (ph !== null && ph < 7.20) || (glucosa !== null && glucosa < 60) || gramEl.value === 'si';

    if (infectado) {
        mostrarDerrame(resultado, 3, 'Loculado, rellena &gt;50% del hemitórax, o el análisis del líquido pleural muestra evidencia de infección (pH &lt;7,20 / glucosa &lt;60 mg/dl / Gram o cultivo positivos). Requiere drenaje con tubo torácico de pequeño calibre (8,5-14 French).', 'warn');
        return;
    }

    mostrarDerrame(resultado, 2, 'De flujo libre, &lt;50% del hemitórax, sin evidencia de infección en el análisis del líquido pleural. No se necesita ninguna otra intervención.', 'ok');
}
function initDerrame() {
    const resultado = document.getElementById('neumo-derrame-resultado');
    if (!resultado) return;
    ['neumo-derrame-purulento', 'neumo-derrame-grosor', 'neumo-derrame-loculado', 'neumo-derrame-ph', 'neumo-derrame-glucosa', 'neumo-derrame-gram'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', calcDerrame);
    });
}

// Prueba de fuga del manguito (cuff-leak test) — umbral 110 mL.
function calcFugaManguito() {
    const input = document.getElementById('neumo-fuga-volumen');
    const resultado = document.getElementById('neumo-fuga-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    let vol = Number(input.value);
    if (vol < 0) { vol = 0; input.value = 0; }

    let estado, texto;
    if (vol > 110) {
        estado = 'tfg-estado-ok';
        texto = 'Elimina el riesgo de edema laríngeo post-extubación con ~95% de certeza — nada más es necesario antes de la extubación.';
    } else {
        estado = 'tfg-estado-danger';
        texto = 'Aumenta el riesgo de edema laríngeo post-extubación ×7. Considera pretratamiento con esteroides (empezando horas antes de la extubación) y colocar VNI inmediatamente tras extubar.';
    }
    resultado.style.display = 'block';
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Volumen de fuga = ${vol} mL</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}
function initFugaManguito() {
    const input = document.getElementById('neumo-fuga-volumen');
    if (!input) return;
    input.addEventListener('input', calcFugaManguito);
    calcFugaManguito();
}

// Ficha I — checklist de las 4 condiciones para retener anticoagulación
// en un émbolo pulmonar subsegmentario único.
function calcEpSubseg() {
    const checks = document.querySelectorAll('.neumo-ep-subseg-check:checked');
    const total = document.querySelectorAll('.neumo-ep-subseg-check').length;
    const resultado = document.getElementById('neumo-ep-subseg-resultado');
    if (!resultado) return;
    if (checks.length === 0) { resultado.style.display = 'none'; return; }
    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    if (checks.length === total) {
        resultado.className = 'result-box tfg-estado-ok';
        resultado.innerHTML = `<strong>✅ Razonable retener la anticoagulación</strong><p style="font-size:0.85rem; margin-top:6px;">Se cumplen las 4 condiciones descritas en el texto — vigilancia clínica en vez de anticoagulación inmediata.</p>`;
    } else {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>⚠️ No se cumplen las 4 condiciones (${checks.length}/${total})</strong><p style="font-size:0.85rem; margin-top:6px;">Se recomienda anticoagulación estándar para el émbolo subsegmentario.</p>`;
    }
}
function initEpSubseg() {
    const boxes = document.querySelectorAll('.neumo-ep-subseg-check');
    if (!boxes.length) return;
    boxes.forEach(b => b.addEventListener('change', calcEpSubseg));
    calcEpSubseg();
}

// Ficha II — clasificador de riesgo de la EP (bajo/intermedio/alto) por
// disfunción del VD, troponina, inestabilidad hemodinámica y comorbilidades.
function calcEpRiesgo() {
    const hemo = document.querySelector('.neumo-ep-riesgo-check[value="hemo"]');
    const vd = document.querySelector('.neumo-ep-riesgo-check[value="vd"]');
    const tropo = document.querySelector('.neumo-ep-riesgo-check[value="tropo"]');
    const comorb = document.querySelector('.neumo-ep-riesgo-check[value="comorb"]');
    const resultado = document.getElementById('neumo-ep-riesgo-resultado');
    if (!hemo || !vd || !tropo || !comorb || !resultado) return;
    const marcados = document.querySelectorAll('.neumo-ep-riesgo-check:checked').length;
    if (marcados === 0) { resultado.style.display = 'none'; return; }
    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    if (hemo.checked) {
        resultado.className = 'result-box tfg-estado-danger';
        resultado.innerHTML = `<strong>🔴 EP de alto riesgo (masiva)</strong><p style="font-size:0.85rem; margin-top:6px;">Inestabilidad hemodinámica — trombolisis + heparina no fraccionada por peso (Tabla 22.3).</p>`;
    } else if (vd.checked) {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>🟡 EP de riesgo intermedio (submasiva)</strong><p style="font-size:0.85rem; margin-top:6px;">Disfunción del VD${tropo.checked ? ' + troponina elevada (sobrecarga del corazón derecho)' : ''} sin inestabilidad hemodinámica — enoxaparina 1 mg/kg/12h y observación 24-48h.</p>`;
    } else if (comorb.checked) {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>🟡 No cumple estrictamente los criterios de bajo riesgo</strong><p style="font-size:0.85rem; margin-top:6px;">Comorbilidad significativa sin disfunción del VD ni inestabilidad hemodinámica — la fuente no define una categoría específica para este escenario; valorar manejo individualizado (posible alta diferida).</p>`;
    } else {
        resultado.className = 'result-box tfg-estado-ok';
        resultado.innerHTML = `<strong>🟢 EP de bajo riesgo</strong><p style="font-size:0.85rem; margin-top:6px;">Sin disfunción del VD, inestabilidad hemodinámica ni comorbilidades significativas — anticoagulación oral y alta precoz (Tabla 22.3).</p>`;
    }
}
function initEpRiesgo() {
    const boxes = document.querySelectorAll('.neumo-ep-riesgo-check');
    if (!boxes.length) return;
    boxes.forEach(b => b.addEventListener('change', calcEpRiesgo));
    calcEpRiesgo();
}

// Ficha VI — checklist de los 5 criterios diagnósticos de SDRA (Berlín).
function calcSdraCriterio() {
    const checks = document.querySelectorAll('.neumo-sdra-criterio-check:checked');
    const total = document.querySelectorAll('.neumo-sdra-criterio-check').length;
    const resultado = document.getElementById('neumo-sdra-criterio-resultado');
    if (!resultado) return;
    if (checks.length === 0) { resultado.style.display = 'none'; return; }
    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    if (checks.length === total) {
        resultado.className = 'result-box tfg-estado-danger';
        resultado.innerHTML = `<strong>Compatible con SDRA (${checks.length}/${total} criterios)</strong><p style="font-size:0.85rem; margin-top:6px;">Se cumplen los 5 criterios de la Tabla 24.2 — clasifica la gravedad con el cociente PaO₂/FiO₂ justo debajo.</p>`;
    } else {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>No compatible con SDRA por definición formal (${checks.length}/${total} criterios)</strong><p style="font-size:0.85rem; margin-top:6px;">Faltan criterios de la Tabla 24.2 — considera diagnósticos alternativos (edema pulmonar cardiogénico, neumonía, etc.).</p>`;
    }
}
function initSdraCriterio() {
    const boxes = document.querySelectorAll('.neumo-sdra-criterio-check');
    if (!boxes.length) return;
    boxes.forEach(b => b.addEventListener('change', calcSdraCriterio));
    calcSdraCriterio();
}

// Ficha XVI — tamaño de tubo ET recomendado según la altura (cm), a partir
// de los cortes en pulgadas de la fuente (≤5'2" / 5'3"-5'10" / ≥5'11").
function calcEtTubo() {
    const alturaEl = document.getElementById('neumo-et-altura');
    const resultado = document.getElementById('neumo-et-resultado');
    if (!alturaEl || !resultado) return;
    if (alturaEl.value === '') { resultado.style.display = 'none'; return; }
    let altura = Number(alturaEl.value);
    if (altura < 0) { altura = 0; alturaEl.value = 0; }

    let tamano;
    if (altura <= 157) tamano = '7';
    else if (altura < 180) tamano = '7,5';
    else tamano = '8';

    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Tamaño de tubo ET sugerido: ${tamano}</strong><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Orientativo por altura corporal — la fuente recuerda que no hay evidencia de que el tamaño del tubo ET afecte los resultados clínicos.</p>`;
}
function initEtTubo() {
    const input = document.getElementById('neumo-et-altura');
    if (!input) return;
    input.addEventListener('input', calcEtTubo);
    calcEtTubo();
}

// Ficha XXII — checklist de disposición para SBT + predictores de éxito
// (Tabla 30.1), reutilizando el PBW ya calculado en la Ficha VIII.
function calcSbtChecklist() {
    const checks = document.querySelectorAll('.neumo-sbt-check:checked');
    const total = document.querySelectorAll('.neumo-sbt-check').length;
    const resultado = document.getElementById('neumo-sbt-resultado');
    if (!resultado) return;
    if (checks.length === 0) { resultado.style.display = 'none'; return; }
    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    if (checks.length === total) {
        resultado.className = 'result-box tfg-estado-ok';
        resultado.innerHTML = `<strong>✅ Criterios de disposición cumplidos (${checks.length}/${total})</strong><p style="font-size:0.85rem; margin-top:6px;">Puede iniciarse la prueba de respiración espontánea.</p>`;
    } else {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>Faltan criterios de disposición (${checks.length}/${total})</strong><p style="font-size:0.85rem; margin-top:6px;">Revisa los criterios de la Tabla 30.1 antes de iniciar la SBT.</p>`;
    }
}
function initSbtChecklist() {
    const boxes = document.querySelectorAll('.neumo-sbt-check');
    if (!boxes.length) return;
    boxes.forEach(b => b.addEventListener('change', calcSbtChecklist));
    calcSbtChecklist();
}
function calcSbtPredictores() {
    const vtEl = document.getElementById('neumo-sbt-vt');
    const pbwEl = document.getElementById('neumo-sbt-pbw');
    const rrEl = document.getElementById('neumo-sbt-rr');
    const pimaxEl = document.getElementById('neumo-sbt-pimax');
    const resultado = document.getElementById('neumo-sbt-predictores-resultado');
    if (!vtEl || !pbwEl || !rrEl || !pimaxEl || !resultado) return;
    if (vtEl.value === '' || pbwEl.value === '' || rrEl.value === '' || pimaxEl.value === '') { resultado.style.display = 'none'; return; }
    const vt = Number(vtEl.value);
    const pbw = Number(pbwEl.value);
    const rr = Number(rrEl.value);
    const pimax = Number(pimaxEl.value);
    if (vt <= 0 || pbw <= 0 || rr <= 0) { resultado.style.display = 'none'; return; }

    const vtPorKg = vt / pbw;
    const rsbi = rr / (vt / 1000);
    const criterios = [
        { nombre: 'V<sub>T</sub> 4-6 mL/kg PBW', valor: `${vtPorKg.toFixed(1)} mL/kg`, ok: vtPorKg >= 4 && vtPorKg <= 6 },
        { nombre: 'RR &lt;40/min', valor: `${rr} /min`, ok: rr < 40 },
        { nombre: 'RR/V<sub>T</sub> 60-105 rpm/L', valor: `${rsbi.toFixed(0)} rpm/L`, ok: rsbi >= 60 && rsbi <= 105 },
        { nombre: 'PI<sub>max</sub> más negativa que −20 cmH₂O', valor: `${pimax} cmH₂O`, ok: pimax <= -20 },
    ];
    const favorables = criterios.filter(c => c.ok).length;
    const nivel = favorables === 4 ? 'ok' : favorables >= 2 ? 'warn' : 'danger';
    resultado.style.display = 'block';
    resultado.className = `result-box tfg-estado-${nivel}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${favorables}/4 predictores favorables</strong><ul style="margin:6px 0 0; padding-left:18px; font-size:0.85rem;">${criterios.map(c => `<li>${c.ok ? '✅' : '❌'} ${c.nombre}: ${c.valor}</li>`).join('')}</ul><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Cada predictor por separado es poco fiable — tomados en conjunto, y con su evolución seriada, orientan mejor el pronóstico de la SBT.</p>`;
}
function initSbtPredictores() {
    const resultado = document.getElementById('neumo-sbt-predictores-resultado');
    if (!resultado) return;
    ['neumo-sbt-vt', 'neumo-sbt-pbw', 'neumo-sbt-rr', 'neumo-sbt-pimax'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calcSbtPredictores);
    });
    calcSbtPredictores();
}

// Ficha XIII — evaluador de respuesta a la VNI a la 1ª hora (PaCO₂ para
// fallo hipercápnico, PaO₂/FiO₂ para fallo hipoxémico).
function calcVniRespuesta() {
    const tipoEl = document.getElementById('neumo-vni-respuesta-tipo');
    const basalEl = document.getElementById('neumo-vni-respuesta-basal');
    const h1El = document.getElementById('neumo-vni-respuesta-1h');
    const resultado = document.getElementById('neumo-vni-respuesta-resultado');
    if (!tipoEl || !basalEl || !h1El || !resultado) return;
    if (tipoEl.value === '' || basalEl.value === '' || h1El.value === '') { resultado.style.display = 'none'; return; }
    const basal = Number(basalEl.value);
    const h1 = Number(h1El.value);
    if (basal <= 0) { resultado.style.display = 'none'; return; }

    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    if (tipoEl.value === 'hipercapnico') {
        const deltaPct = ((basal - h1) / basal) * 100;
        const favorable = deltaPct >= 10;
        resultado.className = `result-box tfg-estado-${favorable ? 'ok' : 'danger'}`;
        resultado.innerHTML = `<strong>PaCO₂: ${deltaPct >= 0 ? '−' : '+'}${Math.abs(deltaPct).toFixed(1)}% respecto al basal</strong><p style="font-size:0.85rem; margin-top:6px;">${favorable ? '✅ Descenso ≥10% — respuesta favorable a la VNI.' : '⚠️ Fracaso en disminuir la PaCO₂ ≥10% tras 1h — evidencia de respuesta pobre (fracaso de la VNI); considerar intubación.'}</p>`;
    } else {
        const favorable = h1 > basal;
        resultado.className = `result-box tfg-estado-${favorable ? 'ok' : 'danger'}`;
        resultado.innerHTML = `<strong>PaO₂/FiO₂: ${basal.toFixed(0)} → ${h1.toFixed(0)} mmHg</strong><p style="font-size:0.85rem; margin-top:6px;">${favorable ? '✅ El cociente ha aumentado — respuesta favorable a la VNI.' : '⚠️ Fracaso en aumentar el cociente tras 1h — evidencia de respuesta pobre (fracaso de la VNI); considerar intubación si la hipoxemia es grave o la enfermedad subyacente tiene alta tasa de fracaso (Figura 26.5).'}</p>`;
    }
}
function initVniRespuesta() {
    const tipoEl = document.getElementById('neumo-vni-respuesta-tipo');
    const basalLabel = document.getElementById('neumo-vni-respuesta-basal-label');
    const h1Label = document.getElementById('neumo-vni-respuesta-1h-label');
    const resultado = document.getElementById('neumo-vni-respuesta-resultado');
    if (!tipoEl || !resultado) return;
    tipoEl.addEventListener('change', () => {
        if (tipoEl.value === 'hipercapnico') {
            basalLabel.textContent = 'PaCO₂ basal (mmHg)';
            h1Label.textContent = 'PaCO₂ a la 1ª hora (mmHg)';
        } else if (tipoEl.value === 'hipoxemico') {
            basalLabel.textContent = 'PaO₂/FiO₂ basal (mmHg)';
            h1Label.textContent = 'PaO₂/FiO₂ a la 1ª hora (mmHg)';
        } else {
            basalLabel.textContent = 'Valor basal';
            h1Label.textContent = 'Valor a la 1ª hora';
        }
        calcVniRespuesta();
    });
    document.getElementById('neumo-vni-respuesta-basal')?.addEventListener('input', calcVniRespuesta);
    document.getElementById('neumo-vni-respuesta-1h')?.addEventListener('input', calcVniRespuesta);
    calcVniRespuesta();
}

export function init() {
    initCorkboard('merino-neumo-corkboard', 'panel-merino-neumo-tabs');
    initInternalLinks();
    initPesoAjustado();
    initPefr();
    initSdraSeveridad();
    initPbw();
    initCao2();
    initSistemaO2();
    initCstat();
    initTriggerSelect();
    initImvChecklist();
    initCultivoSelect();
    initDerrame();
    initFugaManguito();
    initEpSubseg();
    initEpRiesgo();
    initSdraCriterio();
    initEtTubo();
    initSbtChecklist();
    initSbtPredictores();
    initVniRespuesta();
}
