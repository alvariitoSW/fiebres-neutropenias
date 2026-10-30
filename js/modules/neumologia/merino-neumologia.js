// Merino Neumología — embolia pulmonar, asma/EPOC, SDRA, oxigenoterapia y
// ventilación no invasiva en el paciente crítico (cuaderno de campo).
// Fuente: Marino PL. The ICU Book, 5.ª ed., Cap. 22-26.
import { initCorkboard } from '../../core/corkboard.js';
import { clamp, arrancar } from '../../core/ui.js';
import { init as initVisual } from './visual.js';
import { montarMayeutica } from '../../core/mayeutica.js';
import { montarRotulos } from '../../core/figura-rotulos.js';
import { ROTULOS_MERINO_NEUMO } from '../../data/merino-neumo-rotulos.js';
import { MAYEUTICA_B3 } from '../../data/mayeutica/b3.js';

// Número con coma decimal (es-ES) y sin separador de miles. Si el valor
// redondeado es 0 sale «0», nunca «−0,0».
function fmt(n, dec = 0) {
    const r = Number(n.toFixed(dec));
    if (r === 0) return '0';
    return r.toLocaleString('es-ES', { maximumFractionDigits: dec, useGrouping: false });
}

// Aviso común de las calculadoras de los caps. 22-26 cuando un dato queda fuera
// de lo posible en un paciente: no se calcula nada. Los límites de entrada son
// de plausibilidad (fisiología general), no cifras de la ficha.
function avisoNoFisiologico(resultado, detalle) {
    resultado.style.display = 'block';
    resultado.className = 'result-box tfg-estado-danger';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>⚠️ Combinación no fisiológica</strong><p style="font-size:0.85rem; margin-top:6px;">${detalle}</p>`;
}

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
    if (!(ideal >= 20 && ideal <= 150)) { avisoNoFisiologico(resultado, 'El peso ideal debe estar entre 20 y 150 kg — revisa el dato.'); return; }
    if (!(real >= 20 && real <= 400)) { avisoNoFisiologico(resultado, 'El peso real debe estar entre 20 y 400 kg — revisa el dato.'); return; }

    const ajustado = ideal + 0.4 * (real - ideal);
    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Peso ajustado ≈ ${fmt(ajustado, 1)} kg</strong><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Úsalo en vez del peso real para el régimen de heparina por peso (Tabla 22.3) cuando el IMC sea ≥40 kg/m² — sobreestimar el peso con el régimen estándar promueve anticoagulación excesiva.</p>`;
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
    const pct = Number(input.value);
    if (!(pct >= 0 && pct <= 150)) { avisoNoFisiologico(resultado, 'El PEFR debe estar entre 0 y 150 % del predicho — revisa el dato.'); return; }

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
    resultado.innerHTML = `<strong>${fmt(pct, 1)}% predicho</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
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
    const ratio = Number(input.value);
    if (!(ratio >= 30 && ratio <= 700)) { avisoNoFisiologico(resultado, 'El cociente PaO₂/FiO₂ debe estar entre 30 y 700 mmHg — revisa PaO₂ y FiO₂ (la FiO₂ va en fracción, de 0,21 a 1).'); return; }

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
    resultado.innerHTML = `<strong>PaO₂/FiO₂ = ${fmt(ratio, 1)} mmHg</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
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
    const alturaCm = Number(alturaEl.value);
    if (!(alturaCm >= 120 && alturaCm <= 230)) { avisoNoFisiologico(resultado, 'La altura debe estar entre 120 y 230 cm — revisa el dato (va en centímetros).'); return; }
    const alturaPulgadas = alturaCm / 2.54;

    const pbw = sexoEl.value === 'hombre'
        ? 50 + 2.3 * (alturaPulgadas - 60)
        : 45.5 + 2.3 * (alturaPulgadas - 60);
    const vtInicial = pbw * 8;
    const vtObjetivo = pbw * 6;

    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Peso corporal predicho ≈ ${fmt(pbw, 1)} kg</strong><p style="font-size:0.85rem; margin-top:6px;">Volumen tidal inicial (8 mL/kg): ≈${fmt(vtInicial)} mL · Volumen tidal objetivo (6 mL/kg): ≈${fmt(vtObjetivo)} mL. Reducir 1 mL/kg cada 2h hasta el objetivo, luego ajustar por la presión meseta y el pH (Tabla 24.5, págs. 48-49). La meseta objetivo aparece como «≤30 cmH₂O» en el texto y en los objetivos óptimos, y como «&lt;30» en la 2ª etapa: ver la nota de fuentes bajo la tabla.</p>`;
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
    const hb = Number(hbEl.value);
    const sao2 = Number(sao2El.value);
    if (!(hb >= 1 && hb <= 25)) { avisoNoFisiologico(resultado, 'La hemoglobina debe estar entre 1 y 25 g/dL — revisa el dato.'); return; }
    if (!(sao2 >= 1 && sao2 <= 100)) { avisoNoFisiologico(resultado, 'La SaO₂ debe estar entre 1 y 100 % — revisa el dato.'); return; }

    const cao2 = 1.34 * hb * (sao2 / 100) * 10;
    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>CaO₂ ≈ ${fmt(cao2)} mL/L</strong><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Referencias de la propia ficha: normal (Hb 15, SaO₂ 98%) ≈197 mL/L · umbral clásico de O₂ (SaO₂ 90%) ≈181 mL/L (−8%) · umbral transfusional (Hb 7, SaO₂ 98%) ≈92 mL/L (−64%).</p>`;
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
// Tabla 25.2 — selector "¿qué sistema necesito según la FiO2 objetivo?".
const SISTEMAS_O2 = [
    { nombre: 'O₂ nasal de bajo flujo', min: 24, max: 40, flujo: '1-6 L/min' },
    { nombre: 'Mascarilla facial estándar', min: 35, max: 50, flujo: '5-10 L/min' },
    { nombre: 'Mascarilla de no reinhalación', min: 60, max: 80, flujo: '≥10 L/min' },
    { nombre: 'Mascarilla de arrastre de aire (air-entrainment)', min: 24, max: 50, flujo: '2-15 L/min' },
    { nombre: 'OxyMask™', min: 24, max: 90, flujo: '1-≥15 L/min' },
    { nombre: 'O₂ nasal de alto flujo', min: 24, max: 100, flujo: '1-60 L/min' },
];
function calcSistemaO2(evento) {
    const input = document.getElementById('neumo-o2-fio2-objetivo');
    const resultado = document.getElementById('neumo-o2-sistema-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    const tecleado = Number(input.value);
    if (!Number.isFinite(tecleado)) { resultado.style.display = 'none'; return; }
    // Mientras se teclea («4» antes de «45») no se avisa de <21 %: solo al salir
    // del campo (change) o cuando ya hay 2 cifras.
    const alSalir = evento?.type === 'change';
    if (tecleado < 21 && !alSalir && input.value.replace(/\D/g, '').length < 2) { resultado.style.display = 'none'; return; }
    // No se reescribe el campo: se calcula con el valor acotado y se avisa.
    const fio2 = clamp(tecleado, 21, 100);
    const aviso = (tecleado < 21 || tecleado > 100)
        ? `<p style="font-size:0.85rem; margin-top:6px;"><strong>⚠️ Combinación no fisiológica:</strong> la FiO₂ debe estar entre 21 y 100 % (has escrito ${fmt(tecleado, 1)} %). Se calcula con ${fmt(fio2)} %.</p>`
        : '';

    const candidatos = SISTEMAS_O2.filter(s => fio2 >= s.min && fio2 <= s.max);
    resultado.style.display = 'block';
    resultado.className = tecleado < 21 || tecleado > 100 ? 'result-box tfg-estado-danger' : 'result-box';
    resultado.style.textAlign = 'left';
    if (candidatos.length === 0) {
        resultado.innerHTML = `<strong>FiO₂ objetivo: ${fmt(fio2, 1)}%</strong>${aviso}<p style="font-size:0.85rem; margin-top:6px;">Por debajo del mínimo de la Tabla 25.2 (24%): ningún sistema de la tabla tiene un rango que empiece por debajo de 24%.</p>`;
    } else {
        const lista = candidatos.map(s => `<li><strong>${s.nombre}</strong> — ${s.flujo}, rango ${s.min}-${s.max}%</li>`).join('');
        resultado.innerHTML = `<strong>FiO₂ objetivo: ${fmt(fio2, 1)}%</strong>${aviso}<p style="font-size:0.85rem; margin-top:6px;">Sistemas que cubren este objetivo:</p><ul style="margin:4px 0 0; padding-left:18px; font-size:0.85rem;">${lista}</ul>`;
    }
}
function initSistemaO2() {
    const input = document.getElementById('neumo-o2-fio2-objetivo');
    if (!input) return;
    input.addEventListener('input', calcSistemaO2);
    input.addEventListener('change', calcSistemaO2);
    calcSistemaO2();
}

// Caps. 27-30 — avisos comunes de las calculadoras de esta parte. Los límites de
// entrada son de fisiología general, no de la ficha (cada calculadora lo dice).
function avisoDatos(resultado, titulo, texto) {
    resultado.style.display = 'block';
    resultado.className = 'result-box tfg-estado-danger';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>⚠️ ${titulo}</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}
// Número con coma decimal, como en las tablas de las fichas.
function numEs(n, dec) {
    return n.toFixed(dec).replace('.', ',');
}

// Ecuaciones 27.4/27.5 — calculadora de compliance estática (Cstat).
function calcCstat() {
    const vtEl = document.getElementById('neumo-cstat-vt');
    const presionEl = document.getElementById('neumo-cstat-presion');
    const peepEl = document.getElementById('neumo-cstat-peep');
    const resultado = document.getElementById('neumo-cstat-resultado');
    if (!vtEl || !presionEl || !peepEl || !resultado) return;
    if (vtEl.value === '' || presionEl.value === '' || peepEl.value === '') { resultado.style.display = 'none'; return; }
    const vt = Number(vtEl.value);
    const presion = Number(presionEl.value);
    const peep = Number(peepEl.value);

    // Límites de fisiología general (no de la ficha).
    const fuera = [];
    if (!(vt >= 50 && vt <= 2000)) fuera.push('volumen tidal 50-2000 mL');
    if (!(presion >= 0 && presion <= 80)) fuera.push('presión meseta 0-80 cmH₂O');
    if (!(peep >= 0 && peep <= 30)) fuera.push('PEEP 0-30 cmH₂O');
    if (fuera.length) {
        avisoDatos(resultado, 'Combinación no fisiológica', `Revisa los datos: fuera de ${fuera.join(', ')} (rangos de fisiología general, no de la ficha). No se calcula la compliance.`);
        return;
    }

    const driving = presion - peep;
    if (driving <= 0) {
        avisoDatos(resultado, 'Combinación no fisiológica', 'La presión meseta (o Paw fin-insp) debe ser mayor que la PEEP total — revisa los datos.');
        return;
    }
    const cstat = vt / driving;
    let estado, texto;
    if (cstat > 80) {
        estado = 'tfg-estado-warn';
        texto = 'Por encima del rango normal de la ficha (50-80 mL/cmH₂O): la ficha no da un nombre a este tramo; revisa el volumen y las presiones.';
    } else if (cstat >= 50) {
        estado = 'tfg-estado-ok';
        texto = 'Dentro del rango normal (50-80 mL/cmH₂O).';
    } else if (cstat >= 25) {
        estado = 'tfg-estado-warn';
        texto = 'Por debajo de lo normal, pero por encima del umbral típico de enfermedad pulmonar infiltrativa (&lt;25 mL/cmH₂O).';
    } else {
        estado = 'tfg-estado-danger';
        texto = 'Compatible con enfermedad pulmonar infiltrativa (&lt;25 mL/cmH₂O) — p. ej., edema pulmonar o SDRA.';
    }
    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    resultado.className = `result-box ${estado}`;
    resultado.innerHTML = `<strong>Cstat ≈ ${numEs(cstat, 1)} mL/cmH₂O</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
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
    resultado.innerHTML = `<strong>⚠️ IMV no recomendada</strong><p style="font-size:0.85rem; margin-top:6px;">Con ${motivos}, la fuente no aconseja la IMV: puede aumentar el trabajo respiratorio y/o comprometer el gasto cardíaco.</p>`;
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
        gaugeValor.textContent = numEs(info.dor, 1);
        // Escala 0-12 para que la línea del 10 (umbral de la fuente) quede dentro; un solo color neutro.
        gaugeFill.style.width = `${Math.min(100, (info.dor / 12) * 100)}%`;
        gaugeFill.style.background = '';
        resultado.style.display = 'block';
        resultado.className = 'result-box';
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<strong>${info.nombre}</strong><p style="font-size:0.85rem; margin-top:6px;">Umbral: ${info.umbral} · Sensibilidad: ${info.sens} · Especificidad: ${info.esp} · Razón de probabilidades diagnóstica: ${numEs(info.dor, 1)}. La fuente dice que una prueba fiable tiene una razón de 10 o más${info.dor === 9.6 ? '; el BAL es el más fiable de los tres, pero queda por debajo de 10 y su sensibilidad y especificidad están lejos de ser ideales' : ''}.</p>`;
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
// Casos que la Tabla 29.5 no define (loculado sin infección, o infección sin loculación).
function mostrarDerrameSinClasificar(resultado, motivo) {
    resultado.style.display = 'block';
    resultado.className = 'result-box tfg-estado-warn';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>La fuente no clasifica este caso</strong><p style="font-size:0.85rem; margin-top:6px;">${motivo} La Tabla 29.5 pone en la categoría 3 «loculado o &gt;50% del hemitórax» <em>y</em> análisis con infección: valorar individualmente.</p>`;
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
    if (purulentoEl.value === '') { resultado.style.display = 'none'; return; }

    // Purulento a simple vista: categoría 4 ya, sin pedir más datos (la tabla no los exige).
    if (purulentoEl.value === 'si') {
        mostrarDerrame(resultado, 4, 'Purulento a simple vista (empiema): drenaje pleural inmediato.', 'danger');
        return;
    }

    if (grosorEl.value === '') { resultado.style.display = 'none'; return; }
    const grosor = Number(grosorEl.value);
    if (grosor < 0) {
        avisoDatos(resultado, 'Dato no fisiológico', 'El grosor del derrame no puede ser negativo — revisa los datos.');
        return;
    }
    if (grosor < 10) {
        mostrarDerrame(resultado, 1, '&lt;10 mm de grosor. Toracocentesis no necesaria, salvo deterioro clínico o aumento de tamaño del derrame.', 'ok');
        return;
    }

    if (loculadoEl.value === '') { resultado.style.display = 'none'; return; }
    if (gramEl.value === '') { resultado.style.display = 'none'; return; }

    const ph = phEl.value === '' ? null : Number(phEl.value);
    const glucosa = glucosaEl.value === '' ? null : Number(glucosaEl.value);
    // pH de fisiología general (no de la ficha): 6,5-7,8.
    if (ph !== null && !(ph >= 6.5 && ph <= 7.8)) {
        avisoDatos(resultado, 'Dato no fisiológico', 'El pH del líquido pleural debe estar entre 6,5 y 7,8 (rango de fisiología general, no de la ficha) — revisa los datos.');
        return;
    }
    if (glucosa !== null && glucosa < 0) {
        avisoDatos(resultado, 'Dato no fisiológico', 'La glucosa del líquido pleural no puede ser negativa — revisa los datos.');
        return;
    }

    const loculado = loculadoEl.value === 'si';
    const infeccion = (ph !== null && ph < 7.20) || (glucosa !== null && glucosa < 60) || gramEl.value === 'si';
    const faltan = [ph === null ? 'pH' : null, glucosa === null ? 'glucosa' : null].filter(Boolean);

    if (loculado && infeccion) {
        mostrarDerrame(resultado, 3, 'Loculado o &gt;50% del hemitórax, y el análisis del líquido pleural muestra evidencia de infección (pH &lt;7,20 / glucosa &lt;60 mg/dl / Gram o cultivo positivos). Requiere drenaje con tubo torácico de pequeño calibre (8,5-14 French).', 'warn');
        return;
    }
    if (loculado) {
        mostrarDerrameSinClasificar(resultado, `Loculado o &gt;50% del hemitórax, pero sin evidencia de infección en los datos puestos${faltan.length ? ` (faltan ${faltan.join(' y ')}: si salen de infección, sería categoría 3)` : ''}.`);
        return;
    }
    if (infeccion) {
        mostrarDerrameSinClasificar(resultado, 'De flujo libre y &lt;50% del hemitórax, pero con evidencia de infección en el análisis del líquido pleural (pH &lt;7,20 / glucosa &lt;60 mg/dl / Gram o cultivo positivos).');
        return;
    }

    if (faltan.length) {
        mostrarDerrame(resultado, 2, `<strong>Categoría 2 provisional: faltan ${faltan.join(' y ')}.</strong> De flujo libre y &lt;50% del hemitórax, con Gram y cultivo negativos, pero la categoría 2 exige también pH &gt;7,20 y glucosa &gt;60 mg/dl, y no se han medido todos.`, 'warn');
        return;
    }
    mostrarDerrame(resultado, 2, 'De flujo libre, &lt;50% del hemitórax, sin evidencia de infección en el análisis del líquido pleural (pH &gt;7,20, glucosa &gt;60 mg/dl, Gram y cultivo negativos). No se necesita ninguna otra intervención.', 'ok');
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
    const vol = Number(input.value);
    // Límite de fisiología general (no de la ficha): la fuga no puede superar un volumen tidal.
    if (!(vol >= 0 && vol <= 2000)) {
        avisoDatos(resultado, 'Combinación no fisiológica', 'El volumen de fuga debe estar entre 0 y 2000 mL (no puede superar un volumen tidal; rango de fisiología general, no de la ficha) — revisa los datos.');
        return;
    }

    let estado, texto;
    if (vol > 110) {
        estado = 'tfg-estado-ok';
        texto = 'Elimina el riesgo de edema laríngeo post-extubación con ~95% de certeza — nada más es necesario antes de la extubación.';
    } else if (vol < 110) {
        estado = 'tfg-estado-danger';
        texto = 'Aumenta el riesgo de edema laríngeo post-extubación ×7. Considera pretratamiento con esteroides (empezando horas antes de la extubación) y colocar VNI inmediatamente tras extubar.';
    } else {
        estado = 'tfg-estado-warn';
        texto = 'La fuente da «&gt;110 mL» y «&lt;110 mL»: el valor exacto de 110 mL queda sin definir. Valóralo individualmente.';
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
    const sinDefinir = (titulo, detalle) => {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>🟡 ${titulo}</strong><p style="font-size:0.85rem; margin-top:6px;">${detalle} <strong>La fuente no define esta categoría</strong> (Cap. 22, pág. 7): esta calculadora no la asigna a ninguna de las tres.</p>`;
    };
    if (hemo.checked && vd.checked && tropo.checked) {
        resultado.className = 'result-box tfg-estado-danger';
        resultado.innerHTML = `<strong>🔴 EP de alto riesgo (masiva)</strong><p style="font-size:0.85rem; margin-top:6px;">Disfunción del VD + troponina elevada (sobrecarga del corazón derecho) con inestabilidad hemodinámica — heparina no fraccionada por peso y trombolisis (Tabla 22.3).</p>`;
    } else if (hemo.checked) {
        sinDefinir('Inestabilidad hemodinámica sin el perfil de alto riesgo', 'El alto riesgo exige disfunción del VD y troponina elevada juntas, además de la inestabilidad; el riesgo intermedio exige que no haya inestabilidad.');
    } else if (vd.checked) {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>🟡 EP de riesgo intermedio (submasiva)</strong><p style="font-size:0.85rem; margin-top:6px;">Disfunción del VD${tropo.checked ? ' + troponina elevada (sobrecarga del corazón derecho)' : ' (con o sin troponina elevada)'} sin inestabilidad hemodinámica — enoxaparina 1 mg/kg SC cada 12 h; si no hay deterioro a las 24-48 h, pasar a anticoagulación oral (Tabla 22.3).</p>`;
    } else if (tropo.checked) {
        sinDefinir('Troponina elevada sin disfunción del VD', 'No hay disfunción del VD ni inestabilidad hemodinámica.');
    } else {
        sinDefinir('Comorbilidad significativa sin disfunción del VD ni inestabilidad', 'El bajo riesgo exige que tampoco haya comorbilidades significativas.');
    }
}
function initEpRiesgo() {
    const boxes = document.querySelectorAll('.neumo-ep-riesgo-check');
    if (!boxes.length) return;
    boxes.forEach(b => b.addEventListener('change', calcEpRiesgo));
    calcEpRiesgo();
}

// La fuente cuestiona el requisito de PEEP de la definición (Cap. 24, pág. 35).
const NOTA_PEEP_CRITERIO = `<p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">La fuente cuestiona el requisito de PEEP de la definición: exige intubación y ventilación mecánica, lo que deja fuera los casos de SDRA que no la necesitan (Cap. 24, pág. 35).</p>`;

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
        resultado.innerHTML = `<strong>Compatible con SDRA (${checks.length}/${total} criterios)</strong><p style="font-size:0.85rem; margin-top:6px;">Se cumplen los 5 criterios de la Tabla 24.2 — clasifica la gravedad con el cociente PaO₂/FiO₂ justo debajo.</p>${NOTA_PEEP_CRITERIO}`;
    } else {
        resultado.className = 'result-box tfg-estado-warn';
        resultado.innerHTML = `<strong>No compatible con SDRA por definición formal (${checks.length}/${total} criterios)</strong><p style="font-size:0.85rem; margin-top:6px;">Faltan criterios de la Tabla 24.2 — considera diagnósticos alternativos (edema pulmonar cardiogénico, neumonía, etc.).</p>${NOTA_PEEP_CRITERIO}`;
    }
}
function initSdraCriterio() {
    const boxes = document.querySelectorAll('.neumo-sdra-criterio-check');
    if (!boxes.length) return;
    boxes.forEach(b => b.addEventListener('change', calcSdraCriterio));
    calcSdraCriterio();
}

// Ficha XVI — tamaño de tubo ET recomendado según la altura (cm), a partir
// de los tramos en pies y pulgadas de la fuente (≤5'2" / 5'3"-5'10" / ≥5'11").
// La fuente no da tamaño entre 5'2" y 5'3" ni entre 5'10" y 5'11": se avisa.
function calcEtTubo() {
    const alturaEl = document.getElementById('neumo-et-altura');
    const resultado = document.getElementById('neumo-et-resultado');
    if (!alturaEl || !resultado) return;
    if (alturaEl.value === '') { resultado.style.display = 'none'; return; }
    const altura = Number(alturaEl.value);
    // Límite de fisiología general (no de la ficha): 100-230 cm.
    if (!(altura >= 100 && altura <= 230)) {
        avisoDatos(resultado, 'Altura no fisiológica', 'La altura debe estar entre 100 y 230 cm (rango de fisiología general, no de la ficha) — revisa los datos.');
        return;
    }

    // Redondeo a 0,1" (lo que se muestra), para que 160 cm = 5'3,0" caiga en el tramo de 5'3".
    const pulgadas = Math.round((altura / 2.54) * 10) / 10;
    const pies = Math.floor(pulgadas / 12);
    const resto = pulgadas - pies * 12;
    const altTxt = `${altura} cm = ${pies}'${numEs(resto, 1)}"`;

    let titulo, nota = '';
    if (pulgadas <= 62) titulo = 'Tamaño de tubo ET sugerido: 7';
    else if (pulgadas < 63) {
        titulo = 'Hueco de la fuente: sin tamaño para esta altura';
        nota = 'La fuente da tamaño 7 hasta 5\'2" (157,5 cm) y 7,5 desde 5\'3" (160,0 cm). Esta altura cae entre las dos.';
    } else if (pulgadas <= 70) titulo = 'Tamaño de tubo ET sugerido: 7,5';
    else if (pulgadas < 71) {
        titulo = 'Hueco de la fuente: sin tamaño para esta altura';
        nota = 'La fuente da tamaño 7,5 hasta 5\'10" (177,8 cm) y 8 desde 5\'11" (180,3 cm). Esta altura cae entre las dos.';
    } else titulo = 'Tamaño de tubo ET sugerido: 8';

    resultado.style.display = 'block';
    resultado.className = nota ? 'result-box tfg-estado-warn' : 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${titulo}</strong><p style="font-size:0.85rem; margin-top:6px;">${altTxt}${nota ? '. ' + nota : ''}</p><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Orientativo por altura corporal — la fuente recuerda que no hay evidencia de que el tamaño del tubo ET afecte los resultados clínicos.</p>`;
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
    if (pbw <= 0) { resultado.style.display = 'none'; return; }

    // Límites de fisiología general (no de la ficha).
    const fuera = [];
    if (!(vt >= 50 && vt <= 3000)) fuera.push('volumen tidal 50-3000 mL');
    if (!(rr >= 1 && rr <= 80)) fuera.push('frecuencia respiratoria 1-80 /min');
    if (fuera.length) {
        avisoDatos(resultado, 'Combinación no fisiológica', `Revisa los datos: fuera de ${fuera.join(', ')} (rangos de fisiología general, no de la ficha).`);
        return;
    }
    if (pimax > 0) {
        avisoDatos(resultado, 'La PImax es negativa', `¿Querías escribir −${pimax}? La presión inspiratoria máxima se mide como presión negativa (−20, −30…).`);
        return;
    }
    if (pimax < -200) {
        avisoDatos(resultado, 'Combinación no fisiológica', 'Una PImax más negativa que −200 cmH₂O queda fuera de lo fisiológico (rango de fisiología general, no de la ficha; la fuente cita medias de −120 y −84 en adultos sanos) — revisa los datos.');
        return;
    }

    const vtPorKg = vt / pbw;
    const rsbi = rr / (vt / 1000);
    // «ok» = dentro del rango que da la Tabla 30.1. Fuera de él no se marca como fallo:
    // la fuente solo da el rango de éxito y no dice qué pasa fuera.
    const criterios = [
        { nombre: 'V<sub>T</sub> 4-6 mL/kg PBW', valor: `${numEs(vtPorKg, 1)} mL/kg`, ok: vtPorKg >= 4 && vtPorKg <= 6 },
        { nombre: 'RR &lt;40/min', valor: `${rr} /min`, ok: rr < 40 },
        { nombre: 'RR/V<sub>T</sub> 60-105 rpm/L', valor: `${numEs(rsbi, 0)} rpm/L`, ok: rsbi >= 60 && rsbi <= 105 },
        { nombre: 'PI<sub>max</sub> ≤ −20 cmH₂O (interpretación de la app; la tabla pone «&gt;−20», ver nota)', valor: `${pimax} cmH₂O`, ok: pimax <= -20 },
    ];
    const dentro = criterios.filter(c => c.ok).length;
    // El color es un criterio de la app: la fuente solo dice «tomados en conjunto».
    const nivel = dentro === 4 ? 'ok' : dentro >= 2 ? 'warn' : 'danger';
    resultado.style.display = 'block';
    resultado.className = `result-box tfg-estado-${nivel}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${dentro}/4 predictores dentro del rango de éxito de la tabla</strong><ul style="margin:6px 0 0; padding-left:18px; font-size:0.85rem;">${criterios.map(c => `<li>${c.ok ? '✅ dentro del rango' : '➖ fuera del rango que da la fuente'} — ${c.nombre}: ${c.valor}</li>`).join('')}</ul><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Los rangos son los que da la fuente; no dice qué significa estar fuera de ellos. El color (verde 4/4, ámbar 2-3, rojo 0-1) es un criterio de la app: la fuente solo dice que cada predictor por separado es poco fiable y que, tomados en conjunto y con su evolución seriada, orientan mejor el pronóstico.</p>`;
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
    const [minV, maxV, nombreV] = tipoEl.value === 'hipercapnico' ? [10, 200, 'La PaCO₂'] : [30, 700, 'El cociente PaO₂/FiO₂'];
    if (!(basal >= minV && basal <= maxV && h1 >= minV && h1 <= maxV)) {
        avisoNoFisiologico(resultado, `${nombreV} debe estar entre ${minV} y ${maxV} mmHg, tanto el basal como el de la 1ª hora — revisa los datos.`);
        return;
    }

    resultado.style.display = 'block';
    resultado.style.textAlign = 'left';
    if (tipoEl.value === 'hipercapnico') {
        const deltaPct = ((basal - h1) / basal) * 100;
        const favorable = deltaPct >= 10;
        resultado.className = `result-box tfg-estado-${favorable ? 'ok' : 'danger'}`;
        resultado.innerHTML = `<strong>PaCO₂: ${Number(deltaPct.toFixed(1)) === 0 ? '' : (deltaPct > 0 ? '−' : '+')}${fmt(Math.abs(deltaPct), 1)}% respecto al basal</strong><p style="font-size:0.85rem; margin-top:6px;">${favorable ? '✅ Descenso ≥10% — respuesta favorable a la VNI.' : '⚠️ Fracaso en disminuir la PaCO₂ ≥10% tras 1h — evidencia de respuesta pobre (fracaso de la VNI); considerar intubación.'}</p>`;
    } else {
        const favorable = h1 > basal;
        resultado.className = `result-box tfg-estado-${favorable ? 'ok' : 'danger'}`;
        resultado.innerHTML = `<strong>PaO₂/FiO₂: ${fmt(basal)} → ${fmt(h1)} mmHg</strong><p style="font-size:0.85rem; margin-top:6px;">${favorable ? '✅ El cociente ha aumentado — respuesta favorable a la VNI.' : '⚠️ Fracaso en aumentar el cociente tras 1h — evidencia de respuesta pobre (fracaso de la VNI); considerar intubación si la hipoxemia es grave o la enfermedad subyacente tiene alta tasa de fracaso (Figura 26.5).'}</p>`;
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
    arrancar('Rótulos sobre las figuras de Merino Neumología', () => montarRotulos(document.getElementById('merino-neumo-view'), ROTULOS_MERINO_NEUMO));
    // Vista Visual de las fichas de embolia pulmonar (Marino cap. 22, bloque 3): arranca por separado.
    arrancar('vista Visual de Merino Neumología', initVisual);
    arrancar('Estudiar en Merino Neumología', () => Object.entries(MAYEUTICA_B3)
        .filter(([ficha]) => ficha.startsWith('neumo-'))
        .forEach(([ficha, datos]) => montarMayeutica(ficha, datos)));
}
