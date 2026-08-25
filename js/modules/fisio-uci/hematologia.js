// Repaso esquematizado de Hematología y Hemostasia en Cuidados Críticos
// (cuaderno de campo). Fuente: El libro azul. Bases fisiopatológicas de la
// medicina crítica. Sección II, capítulos 12-16.
import { initCorkboard, openCorkboardTopic } from '../../core/corkboard.js';

// ---------------------------------------------------------------------
// FICHA 1 — Simulador de secuestro de hierro por hepcidina
// Modelo cualitativo simplificado (no cifras clínicas reales): a mayor
// inflamación, mayor síntesis de hepcidina, que degrada la ferroportina
// y reduce el hierro sérico disponible — el circuito que describe el
// propio texto de la ficha (Figuras 1, 3 y 4).
// ---------------------------------------------------------------------
function calcHepcidinaSimulador() {
    const slider = document.getElementById('fuci-hepc-inflamacion');
    if (!slider) return;
    const inflamacion = Number(slider.value);
    document.getElementById('fuci-hepc-inflamacion-valor').textContent = `${inflamacion}%`;

    const hepcidina = inflamacion;
    const ferroportina = 100 - inflamacion;
    const hierro = Math.max(5, 100 - inflamacion * 1.1);

    document.getElementById('fuci-hepc-hepcidina').style.width = `${hepcidina}%`;
    document.getElementById('fuci-hepc-ferroportina').style.width = `${ferroportina}%`;
    document.getElementById('fuci-hepc-hierro').style.width = `${hierro}%`;

    const box = document.getElementById('fuci-hepc-estado');
    let estado, mensaje;
    if (inflamacion < 25) {
        estado = 'ok';
        mensaje = '✅ Inflamación baja — hepcidina baja, la ferroportina permanece activa y el hierro fluye con normalidad desde enterocitos/macrófagos hacia la transferrina.';
    } else if (inflamacion < 60) {
        estado = 'warn';
        mensaje = '⚠️ Inflamación moderada — la hepcidina empieza a degradar la ferroportina: el hierro queda parcialmente secuestrado en macrófagos y enterocitos.';
    } else {
        estado = 'danger';
        mensaje = '🔴 Inflamación alta — hepcidina muy elevada, ferroportina casi inactiva: el hierro queda atrapado en el sistema reticuloendotelial pese a reservas corporales normales o altas — el sustrato de la anemia de la enfermedad crítica.';
    }
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = mensaje;
}

// ---------------------------------------------------------------------
// FICHA 2 — Selector de umbral de transfusión de plaquetas por escenario
// ---------------------------------------------------------------------
const PLT_ESCENARIOS = {
    hemorragia: 'Hemorragia activa (digestiva, hematuria, hemoptisis): transfundir con recuento &lt;<strong>50.000/mm³</strong>.',
    cirugia: 'Cirugía mayor o procedimiento invasivo en sitio profundo no compresible: mantener &gt;<strong>100.000/mm³</strong>.',
    neuro: 'Neurocirugía, procedimiento neurorradiológico invasivo, o sangrado intracraneal/intramedular: mantener &gt;<strong>100.000/mm³</strong>.',
    cardio: 'Hemodinamia cardiovascular o cirugía cardíaca/vascular: mantener &gt;<strong>100.000/mm³</strong>.',
    vvc: 'Vía venosa central (tunelizada o no), guiada por ultrasonido, por profesional entrenado: &gt;<strong>20.000/mm³</strong>.',
    pl: 'Punción lumbar: recomendación internacional ≥<strong>40.000/mm³</strong> (1C) — localmente ningún centro la realiza con &lt;100.000/mm³.',
    antiagregantes: 'Recuento normal pero con antiagregantes plaquetarios conocidos: idealmente medir el <strong>tiempo de sangría por método de Ivy</strong> antes de decidir.',
};

function wireSelectExplicacion(selectId, boxId, datos) {
    const select = document.getElementById(selectId);
    const box = document.getElementById(boxId);
    if (!select || !box) return;
    select.addEventListener('change', () => {
        const item = datos[select.value];
        if (!item) {
            box.style.display = 'none';
            return;
        }
        box.style.display = 'block';
        box.innerHTML = item;
    });
}

// ---------------------------------------------------------------------
// FICHA 3 — Calculadora de Fick (DO2/VO2/EO2)
// Fórmulas literales del texto de esta ficha: CaO2 = Hb×1,39×SaO2 +
// PaO2×0,003; DO2 = GC×CaO2×10; VO2 = GC×1,39×Hb×(SaO2−SvO2)×10.
// ---------------------------------------------------------------------
const FICK_GAUGE_MAX = 1800;

function calcFuciFick() {
    const ids = ['fuci-fick-gc', 'fuci-fick-hb', 'fuci-fick-sao2', 'fuci-fick-pao2'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('fuci-fick-resultado');
    const gaugeRow = document.getElementById('fuci-fick-gauge-row');
    if (els.some(e => !e) || !box) return;

    if (els.some(e => e.value === '')) {
        box.style.display = 'none';
        if (gaugeRow) gaugeRow.style.display = 'none';
        return;
    }

    const [gc, hb, sao2, pao2] = els.map(e => Number(e.value));
    const svo2El = document.getElementById('fuci-fick-svo2');
    const svo2 = svo2El && svo2El.value !== '' ? Number(svo2El.value) : null;

    if (sao2 < 0 || sao2 > 100 || (svo2 !== null && (svo2 < 0 || svo2 > 100))) {
        box.style.display = 'block';
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '<strong>⚠️ Valor no fisiológico</strong> — la SaO₂/SvO₂ es un porcentaje y no puede ser negativa ni superar el 100%.';
        if (gaugeRow) gaugeRow.style.display = 'none';
        return;
    }
    if (svo2 !== null && svo2 > sao2) {
        box.style.display = 'block';
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '<strong>⚠️ Combinación de valores no fisiológica</strong> — la sangre venosa (SvO₂) no puede estar más oxigenada que la arterial (SaO₂): el oxígeno se extrae en los tejidos, no se añade. Revisa esos datos.';
        if (gaugeRow) gaugeRow.style.display = 'none';
        return;
    }

    const cao2 = hb * 1.39 * (sao2 / 100) + pao2 * 0.003;
    const do2 = gc * cao2 * 10;

    let lineas = [
        `CaO₂ = Hb×1,39×SaO₂ + PaO₂×0,003 = ${cao2.toFixed(1)} mL/dL`,
        `DO₂ = GC × CaO₂ × 10 = ${do2.toFixed(0)} mL/min`,
    ];

    let estado = 'ok';
    if (do2 < 900) estado = 'danger';
    else if (do2 <= 1000) estado = 'warn';

    if (svo2 !== null) {
        const vo2 = gc * 1.39 * hb * ((sao2 - svo2) / 100) * 10;
        const eo2 = do2 > 0 ? (vo2 / do2) * 100 : 0;
        lineas.push(`VO₂ = GC×1,39×Hb×(SaO₂−SvO₂)×10 = ${vo2.toFixed(0)} mL/min`);
        lineas.push(`EO₂ = VO₂/DO₂ = ${eo2.toFixed(1)}%`);
        if (eo2 > 35 && estado === 'ok') estado = 'warn';
    }

    let interpretacion;
    if (do2 < 900) {
        interpretacion = 'Por debajo del punto crítico de DO₂ que cita el texto (~900-1000 mL/min) — el VO₂ deja de ser independiente del aporte y empieza a caer en paralelo, con riesgo de metabolismo anaeróbico y acidosis láctica (deuda de oxígeno).';
    } else if (do2 <= 1000) {
        interpretacion = 'En el límite del punto crítico de DO₂ — poco margen de reserva antes de que el VO₂ empiece a depender directamente del aporte.';
    } else {
        interpretacion = 'Por encima del punto crítico — el VO₂ se mantiene constante gracias a la extracción tisular de oxígeno (EO₂), sin depender directamente de nuevas subidas del DO₂.';
    }

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = lineas.join('<br>') + `<br>${interpretacion}`;

    if (gaugeRow) {
        gaugeRow.style.display = 'block';
        const fill = document.getElementById('fuci-fick-gauge-fill');
        const num = document.getElementById('fuci-fick-gauge-num');
        fill.style.width = `${Math.max(0, Math.min(100, (do2 / FICK_GAUGE_MAX) * 100))}%`;
        const colores = { ok: 'var(--accent-green)', warn: 'var(--accent-yellow)', danger: 'var(--accent-red)' };
        fill.style.background = colores[estado];
        num.textContent = `${do2.toFixed(0)}`;
    }
}

// ---------------------------------------------------------------------
// FICHA 3 — Curva de disociación de la hemoglobina (Hill, n=2,7)
// Solo la p50 "normal" (22,5 mmHg) es una cifra citada por la fuente;
// los desplazamientos son un modelo ilustrativo, no cifras del capítulo.
// ---------------------------------------------------------------------
const HB_CURVA_N = 2.7;
const HB_CURVA_P50 = { normal: 22.5, derecha: 32, izquierda: 16 };

function buildHbCurvaPath(p50) {
    let d = '';
    for (let p = 0; p <= 150; p += 3) {
        const sat = 100 * Math.pow(p, HB_CURVA_N) / (Math.pow(p50, HB_CURVA_N) + Math.pow(p, HB_CURVA_N));
        const x = 34 + (p / 150) * (290 - 34);
        const y = 160 - (sat / 100) * 150;
        d += `${p === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
}

function calcHbCurva() {
    const select = document.getElementById('fuci-hbcurva-select');
    const path = document.getElementById('fuci-hbcurva-path');
    const marker = document.getElementById('fuci-hbcurva-p50marker');
    const box = document.getElementById('fuci-hbcurva-estado');
    if (!select || !path || !marker || !box) return;

    const estadoKey = select.value;
    const p50 = HB_CURVA_P50[estadoKey];
    path.setAttribute('d', buildHbCurvaPath(p50));
    const mx = 34 + (p50 / 150) * (290 - 34);
    marker.setAttribute('cx', mx.toFixed(1));
    marker.setAttribute('cy', '85');

    const textos = {
        normal: { estado: 'ok', msg: `✅ Curva normal — p50 ≈${p50} mmHg (la cifra que cita el propio capítulo).` },
        derecha: { estado: 'warn', msg: `⚠️ Desplazada a la derecha (p50 ilustrativo ≈${p50} mmHg) — ↓afinidad Hb-O₂: la Hb suelta el O₂ con más facilidad en los tejidos, facilitando la entrega. Causas citadas: acidosis, hipercarbia, hipertermia, ↑2,3-DPG.` },
        izquierda: { estado: 'warn', msg: `⚠️ Desplazada a la izquierda (p50 ilustrativo ≈${p50} mmHg) — ↑afinidad Hb-O₂: la Hb retiene el O₂ con más fuerza, dificultando su entrega a los tejidos pese a saturar con más facilidad en el pulmón. Causas citadas: alcalosis, hipotermia, intoxicación por CO.` },
    };
    const t = textos[estadoKey] || textos.normal;
    box.className = `tfg-estado tfg-estado-${t.estado}`;
    box.textContent = t.msg;
}

// ---------------------------------------------------------------------
// FICHA 3 — Deuda de oxígeno y punto crítico
// Por debajo del punto crítico (~950 mL/min, ilustrativo dentro del
// rango 900-1000 que cita el texto) el VO2 cae de forma proporcional al
// DO2 (supply-dependent); por encima, el VO2 se mantiene constante
// (supply-independent, sostenido por la extracción tisular de O2).
// ---------------------------------------------------------------------
const DO2_DEBT_CRIT = 950;

function calcDo2Debt() {
    const slider = document.getElementById('fuci-do2debt-slider');
    const marker = document.getElementById('fuci-do2debt-marker');
    const box = document.getElementById('fuci-do2debt-estado');
    if (!slider || !marker || !box) return;

    const doVal = Number(slider.value);
    document.getElementById('fuci-do2debt-valor').textContent = `${doVal} mL/min`;

    const x = 34 + (doVal / 1600) * (290 - 34);
    let y;
    if (doVal <= DO2_DEBT_CRIT) {
        y = 155 - (doVal / DO2_DEBT_CRIT) * (155 - 40);
    } else {
        y = 40;
    }
    marker.setAttribute('cx', x.toFixed(1));
    marker.setAttribute('cy', y.toFixed(1));

    let estado, mensaje;
    if (doVal < 700) {
        estado = 'danger';
        mensaje = '🔴 Muy por debajo del punto crítico — el VO₂ ya está cayendo con el DO₂: metabolismo anaeróbico, acidosis láctica y deuda de oxígeno acumulándose.';
    } else if (doVal < DO2_DEBT_CRIT) {
        estado = 'warn';
        mensaje = '⚠️ Por debajo del punto crítico — la extracción tisular ya está al límite y el VO₂ empieza a depender directamente del DO₂.';
    } else {
        estado = 'ok';
        mensaje = '✅ Por encima del punto crítico — el VO₂ se mantiene constante gracias a la reserva de extracción tisular, con independencia del aporte.';
    }
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = mensaje;
}

// ---------------------------------------------------------------------
// FICHA 3 — Resumen rápido de umbral de transfusión por escenario
// ---------------------------------------------------------------------
const TRANSF_ESCENARIOS = {
    septico: 'En sépticos, la estrategia <strong>restrictiva es mejor</strong>: transfundir con Hb &lt;7 g/dL (TRISS) — habitualmente 1 unidad, controlando a las 3h antes de considerar una segunda.',
    trauma: 'En el politraumatizado, guiar la decisión por el <strong>contexto hemodinámico</strong> (índice cardíaco, relación lactato/piruvato), no solo por la Hb — si hay sangrado masivo, transfusión balanceada (glóbulos rojos:plasma:plaquetas ≈1:1:1).',
    cardiovascular: 'Sin síndrome coronario agudo reciente: mantener Hb &gt;<strong>7,0 g/dL</strong> (TRICS-III: restrictiva no inferior a liberal, con menos días de UCI/ventilación).',
    sca: 'Con síndrome coronario agudo: mantener Hb ≥<strong>10 g/dL</strong> si hay síntomas isquémicos; transfundir si Hb &lt;8 g/dL en asintomáticos — recomendación basada en un único estudio de 110 pacientes, sin punto de corte firmemente validado.',
    epoc: 'Sin punto de corte propio validado — se aplica el mismo umbral general de <strong>7-8 g/dL</strong>; la anemia puede aumentar el trabajo respiratorio en el paciente pulmonar crónico.',
};

// ---------------------------------------------------------------------
// FICHA 4 — Visualizador del trazado TEG por patrón (A-G)
// Recreación esquemática (huso simétrico con inicio/pico/cola
// parametrizados), no una réplica exacta del trazado real.
// ---------------------------------------------------------------------
const TEG_PATRONES = {
    A: { start: 40, peakX: 90, amp: 45, endAmp: 45, estado: 'ok', msg: 'Trazado en huso simétrico, dentro de rangos normales.' },
    B: { start: 110, peakX: 160, amp: 45, endAmp: 45, estado: 'warn', msg: 'Inicio retrasado (r prolongado) — déficit de factores de coagulación.' },
    C: { start: 40, peakX: 90, amp: 20, endAmp: 20, estado: 'warn', msg: 'Amplitud máxima disminuida — trombocitopenia o disfunción plaquetaria.' },
    D: { start: 40, peakX: 90, amp: 45, endAmp: 8, estado: 'danger', msg: 'El trazado se estrecha tras alcanzar su amplitud — fibrinólisis acelerada.' },
    E: { start: 25, peakX: 55, amp: 58, endAmp: 58, estado: 'warn', msg: 'Formación rápida y amplitud elevada — hipercoagulabilidad.' },
    F: { start: 55, peakX: 100, amp: 30, endAmp: 15, estado: 'danger', msg: 'Patrón mixto hiper/hipocoagulable — coagulación intravascular diseminada.' },
    G: { start: 40, peakX: 110, amp: 12, endAmp: 8, estado: 'danger', msg: 'Trazado estrecho y aplanado — hipocoagulabilidad, CID tardía (consumo avanzado de factores).' },
};

function buildTegSpindlePath({ start, peakX, amp, endAmp }) {
    const cy = 70;
    const midX = start + (peakX - start) * 0.5;
    const end = 290;
    return `M ${start} ${cy} C ${midX} ${cy} ${midX} ${cy - amp} ${peakX} ${cy - amp} L ${end} ${cy - endAmp} L ${end} ${cy + endAmp} L ${peakX} ${cy + amp} C ${midX} ${cy + amp} ${midX} ${cy} ${start} ${cy} Z`;
}

function calcTegShape() {
    const select = document.getElementById('fuci-teg-shape-select');
    const path = document.getElementById('fuci-teg-shape-path');
    const box = document.getElementById('fuci-teg-shape-estado');
    if (!select || !path || !box) return;
    const p = TEG_PATRONES[select.value] || TEG_PATRONES.A;
    path.setAttribute('d', buildTegSpindlePath(p));
    box.className = `tfg-estado tfg-estado-${p.estado}`;
    box.textContent = `${select.value} — ${p.msg}`;
}

// ---------------------------------------------------------------------
// FICHA 4 — "¿Qué patrón tengo delante?" (ROTEM)
// ---------------------------------------------------------------------
const ROTEM_PATRONES = {
    normal: 'EXTEM/INTEM/FIBTEM dentro de rango — sin defecto de coagulación detectable.',
    plaquetopenia: 'El defecto (CFT prolongado, MCF bajo) aparece igual en EXTEM e INTEM, pero el <strong>FIBTEM</strong> —que inhibe la contribución plaquetaria— se mantiene prácticamente sin cambio: la firmeza depende de las plaquetas, no del fibrinógeno.',
    hipofibrinogenemia: 'EXTEM se mantiene esencialmente normal e INTEM solo cae levemente, pero el <strong>FIBTEM se hunde</strong> — el defecto está en el fibrinógeno/factor XIII, no en las plaquetas.',
    hiperfibrinolisis: 'EXTEM/INTEM muestran lisis completa (ML 100%) con el trazado "en forma de hoja". La clave es el <strong>APTEM</strong>: si la lisis se corrige a ML 0%, confirma hiperfibrinólisis verdadera (no artefacto).',
    heparina: 'Defecto en la vía <strong>intrínseca</strong> (INTEM), con EXTEM conservado — se corrige con hepTEM (heparinasa). Nota de fidelidad: el capítulo repite los mismos valores de INTEM que en Hiperfibrinólisis, probable duplicación de tabla en la fuente.',
};

// ---------------------------------------------------------------------
// FICHA 5 — Checklist interactivo de criterios DRESS
// ---------------------------------------------------------------------
function calcDressBocquet() {
    const boxes = document.querySelectorAll('.fuci-dress-bq');
    const estado = document.getElementById('fuci-dress-bq-estado');
    if (!boxes.length || !estado) return;
    const n = Array.from(boxes).filter(b => b.checked).length;
    if (n === 3) {
        estado.className = 'tfg-estado tfg-estado-danger';
        estado.textContent = '✅ Cumple los 3 criterios de Bocquet — compatible con DRESS.';
    } else {
        estado.className = 'tfg-estado tfg-estado-ok';
        estado.textContent = `${n}/3 criterios marcados — los 3 son necesarios para el diagnóstico según Bocquet.`;
    }
}

function calcDressRegiscar() {
    const nec = document.querySelectorAll('.fuci-dress-rc-nec');
    const opt = document.querySelectorAll('.fuci-dress-rc-opt');
    const estado = document.getElementById('fuci-dress-rc-estado');
    if (!nec.length || !opt.length || !estado) return;
    const nNec = Array.from(nec).filter(b => b.checked).length;
    const nOpt = Array.from(opt).filter(b => b.checked).length;
    if (nNec === nec.length && nOpt >= 3) {
        estado.className = 'tfg-estado tfg-estado-danger';
        estado.textContent = `✅ Cumple RegiSCAR — ${nNec}/${nec.length} criterios necesarios + ${nOpt}/${opt.length} adicionales (≥3 requeridos).`;
    } else {
        estado.className = 'tfg-estado tfg-estado-ok';
        estado.textContent = `${nNec}/${nec.length} criterios necesarios · ${nOpt}/${opt.length} adicionales (hacen falta los ${nec.length} necesarios + ≥3 de los ${opt.length} adicionales).`;
    }
}

function calcDressJscar() {
    const items = document.querySelectorAll('.fuci-dress-js');
    const estado = document.getElementById('fuci-dress-js-estado');
    if (!items.length || !estado) return;
    const arr = Array.from(items);
    const checked = arr.map(b => b.checked);
    const nChecked = checked.filter(Boolean).length;
    const primeros5 = checked.slice(0, 5).every(Boolean);
    if (nChecked === 7) {
        estado.className = 'tfg-estado tfg-estado-danger';
        estado.textContent = '✅ Cumple los 7 criterios — DRESS clásico (J-SCAR).';
    } else if (primeros5) {
        estado.className = 'tfg-estado tfg-estado-warn';
        estado.textContent = '⚠️ Cumple los primeros 5 criterios — DRESS atípico (J-SCAR).';
    } else {
        estado.className = 'tfg-estado tfg-estado-ok';
        estado.textContent = `${nChecked}/7 criterios marcados — hacen falta los 5 primeros (atípico) o los 7 (clásico).`;
    }
}

// ---------------------------------------------------------------------
// FICHA 5 — Calculadora de clasificación de gravedad
// ---------------------------------------------------------------------
function calcEosGrado() {
    const input = document.getElementById('fuci-eos-grado-input');
    const box = document.getElementById('fuci-eos-grado-estado');
    if (!input || !box) return;
    if (input.value === '') {
        box.style.display = 'none';
        return;
    }
    const val = Number(input.value);
    box.style.display = 'block';
    if (val <= 1500) {
        box.className = 'tfg-estado tfg-estado-ok';
        box.textContent = `${val}/mm³ — no alcanza el umbral de eosinofilia (>1500/mm³ según la fuente).`;
    } else if (val <= 5000) {
        box.className = 'tfg-estado tfg-estado-warn';
        box.textContent = `${val}/mm³ — eosinofilia moderada (1500-5000/mm³; el capítulo también etiqueta este rango como "leve", ver nota de fidelidad más arriba). Toda hipereosinofilia en UCI debe estudiarse.`;
    } else {
        box.className = 'tfg-estado tfg-estado-danger';
        box.textContent = `${val}/mm³ — eosinofilia grave (>5000/mm³). Estudiar siempre: Paso 1 (excluir causas secundarias) → Paso 2 (evaluar clonalidad/FIP1L1-PDGFRα).`;
    }
}

export function init() {
    initCorkboard('fuci-hemato-corkboard', 'panel-fuci-hemato-tabs');

    // Ficha 1
    const hepcSlider = document.getElementById('fuci-hepc-inflamacion');
    if (hepcSlider) {
        hepcSlider.addEventListener('input', calcHepcidinaSimulador);
        calcHepcidinaSimulador();
    }

    // Ficha 2
    wireSelectExplicacion('fuci-plt-select', 'fuci-plt-resultado', PLT_ESCENARIOS);
    const linkATeg = document.getElementById('fuci-link-a-teg');
    if (linkATeg) linkATeg.addEventListener('click', () => openCorkboardTopic('panel-fuci-hemato-tabs', 'fuci-teg'));

    // Ficha 3
    ['fuci-fick-gc', 'fuci-fick-hb', 'fuci-fick-sao2', 'fuci-fick-pao2', 'fuci-fick-svo2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcFuciFick);
    });
    calcFuciFick();

    const hbCurvaSelect = document.getElementById('fuci-hbcurva-select');
    if (hbCurvaSelect) {
        hbCurvaSelect.addEventListener('change', calcHbCurva);
        calcHbCurva();
    }

    const do2debtSlider = document.getElementById('fuci-do2debt-slider');
    if (do2debtSlider) {
        do2debtSlider.addEventListener('input', calcDo2Debt);
        calcDo2Debt();
    }

    wireSelectExplicacion('fuci-transf-escenario', 'fuci-transf-resultado', TRANSF_ESCENARIOS);

    // Ficha 4
    const tegShapeSelect = document.getElementById('fuci-teg-shape-select');
    if (tegShapeSelect) {
        tegShapeSelect.addEventListener('change', calcTegShape);
        calcTegShape();
    }
    wireSelectExplicacion('fuci-rotem-select', 'fuci-rotem-resultado', ROTEM_PATRONES);

    // Ficha 5
    document.querySelectorAll('.fuci-dress-bq').forEach(b => b.addEventListener('change', calcDressBocquet));
    document.querySelectorAll('.fuci-dress-rc-nec, .fuci-dress-rc-opt').forEach(b => b.addEventListener('change', calcDressRegiscar));
    document.querySelectorAll('.fuci-dress-js').forEach(b => b.addEventListener('change', calcDressJscar));
    calcDressBocquet();
    calcDressRegiscar();
    calcDressJscar();

    const eosGradoInput = document.getElementById('fuci-eos-grado-input');
    if (eosGradoInput) eosGradoInput.addEventListener('input', calcEosGrado);
}
