import { initCorkboard } from '../../core/corkboard.js';

// Simulador de la curva de Frank-Starling (Ficha 1) — modelo ilustrativo
// "pico con reducción posterior" (f(x) = A * (x/xp) * e^(1-x/xp)), elegido
// porque la propia fuente describe la curva como una meseta con posterior
// reducción de la fuerza ante presión/volumen excesivos (no una recta ni
// una simple saturación monótona). NO es una fórmula clínica real de la
// fuente — es puramente cualitativo, como el .tfg-simulador de Nefrología.
const FS_CURVAS = {
    aumentada: { A: 118, xp: 55 },
    normal: { A: 100, xp: 70 },
    disminuida: { A: 62, xp: 85 },
};
// Explicación fisiopatológica según la zona de la curva en la que cae el
// punto de trabajo (r = precarga/xp del estado seleccionado) — qué
// significa, qué mecanismo lo mantiene ahí, y cómo se descompensa.
function textoZonaFrankStarling(r) {
    if (r < 0.35) {
        return 'Zona ascendente pronunciada de la curva — el ventrículo es muy <strong>dependiente de la precarga</strong>: pequeños aumentos de volumen producen grandes aumentos del volumen sistólico (un paciente aquí sí responde a la administración de líquidos). El mecanismo es el propio acoplamiento actina-miosina de Frank-Starling: a mayor longitud de la fibra en reposo, más puentes cruzados eficaces se forman. El riesgo en esta zona no es el exceso, sino el defecto: si la precarga sigue cayendo (hemorragia, deshidratación, venodilatación por sepsis/anestesia), el volumen sistólico y el gasto cardíaco caen en paralelo, sin ningún mecanismo que lo evite más allá de la taquicardia compensadora.';
    }
    if (r < 1.0) {
        return 'Zona de meseta/eficiencia — el ventrículo trabaja cerca de su punto óptimo: el mecanismo de Frank-Starling ya extrajo casi todo el beneficio posible del estiramiento de la fibra, y el volumen sistólico se mantiene relativamente estable ante cambios moderados de precarga. Es el rango de trabajo habitual del corazón sano en reposo. Lo que mantiene a un paciente en esta zona es la regulación renal del volumen circulante (eje renina-angiotensina-aldosterona) y el tono venoso simpático, que ajustan el retorno venoso para no sobrepasar el pico de la curva.';
    }
    return 'Se ha sobrepasado el pico de la curva — <strong>sobredistensión</strong>: pese a seguir aumentando el volumen de fin de diástole, la fuerza de contracción empieza a declinar, porque el sarcómero se ha estirado más allá de su longitud óptima de solapamiento actina-miosina. Es lo que ocurre al sobrecargar de volumen a un ventrículo ya comprometido: seguir administrando líquidos deja de aumentar el gasto cardíaco (o incluso lo reduce) mientras la presión de llenado sigue subiendo — el círculo vicioso de la Ficha 3, que termina en edema pulmonar/sistémico. Es el punto en el que la estrategia debe cambiar de volumen a diuréticos/vasodilatadores.';
}
function textoEstadoFrankStarling(estado) {
    if (estado === 'disminuida') {
        return 'Con contractilidad <strong>disminuida</strong> (falla sistólica), toda la curva se desplaza abajo y a la derecha: para el mismo volumen de fin de diástole el corazón genera menos volumen sistólico, y alcanza su pico (más bajo) con más precarga de la habitual. El organismo compensa activando el sistema simpático y el eje renina-angiotensina-aldosterona para retener líquido y así elevar la precarga — pero esa misma compensación, sostenida en el tiempo, es la que termina produciendo la congestión y el remodelamiento ventricular descritos en la Ficha 3.';
    }
    if (estado === 'aumentada') {
        return 'Con contractilidad <strong>aumentada</strong> (estímulo inotrópico, catecolaminas endógenas o fármacos), la curva se desplaza arriba y a la izquierda: se alcanza un volumen sistólico mayor con menos precarga. El costo, desarrollado en la Ficha 2, es un mayor consumo de oxígeno miocárdico — sostener este estado con dosis altas de inotrópicos puede desencadenar isquemia o arritmias si el aporte coronario de oxígeno no logra igualar ese mayor consumo.';
    }
    return 'Con contractilidad <strong>normal</strong>, este es el comportamiento fisiológico de base del ventrículo — el punto de referencia frente al que se comparan los desplazamientos por falla sistólica o por estímulo inotrópico.';
}
function calcFrankStarlingSimulador() {
    const precargaEl = document.getElementById('cardio-fs-precarga');
    const estadoEl = document.getElementById('cardio-fs-estado');
    const marker = document.getElementById('cardio-fs-marker');
    const guideV = document.getElementById('cardio-fs-guia-v');
    const guideH = document.getElementById('cardio-fs-guia-h');
    const valorEl = document.getElementById('cardio-fs-precarga-valor');
    const salidaEl = document.getElementById('cardio-fs-resultado');
    const interpretacionEl = document.getElementById('cardio-fs-interpretacion');
    if (!precargaEl || !estadoEl || !marker) return;

    const precarga = Number(precargaEl.value);
    const curva = FS_CURVAS[estadoEl.value];
    const vsRaw = curva.A * (precarga / curva.xp) * Math.exp(1 - precarga / curva.xp);
    const vs = Math.max(0, Math.min(vsRaw, 130));

    const svgX = 40 + (precarga / 100) * 260;
    const svgY = 140 - vs;

    marker.setAttribute('cx', svgX);
    marker.setAttribute('cy', svgY);
    if (guideV) { guideV.setAttribute('x1', svgX); guideV.setAttribute('x2', svgX); guideV.setAttribute('y2', svgY); }
    if (guideH) { guideH.setAttribute('y1', svgY); guideH.setAttribute('y2', svgY); guideH.setAttribute('x2', svgX); }
    if (valorEl) valorEl.textContent = `${precarga}%`;

    document.querySelectorAll('.cardio-fs-curva').forEach(p => p.classList.remove('cardio-fs-curva-activa'));
    const activa = document.getElementById(`cardio-fs-curva-${estadoEl.value}`);
    if (activa) activa.classList.add('cardio-fs-curva-activa');

    const pct = curva.A > 0 ? Math.round((vs / curva.A) * 100) : 0;
    const etiquetaEstado = { aumentada: 'aumentada (inotrópico +)', normal: 'normal', disminuida: 'disminuida (falla sistólica)' }[estadoEl.value];
    if (salidaEl) {
        salidaEl.textContent = `Volumen sistólico relativo: ≈${pct}% del máximo alcanzable con contractilidad ${etiquetaEstado} (modelo ilustrativo, no una cifra clínica real).`;
    }
    if (interpretacionEl) {
        const r = precarga / curva.xp;
        interpretacionEl.innerHTML = textoZonaFrankStarling(r) + ' ' + textoEstadoFrankStarling(estadoEl.value);
    }
}

// Controles de la animación del ciclo cardíaco (Ficha 1) — la animación en
// sí es 100% CSS (@keyframes sobre x del cursor, opacity de las etiquetas
// de fase y r de los pulsos de tonos cardíacos), sin requestAnimationFrame;
// aquí solo se conecta el botón pausa/reanuda y el selector de velocidad,
// que cambian una clase y la custom property --ciclo-duracion.
function initCicloCardiacoAnimado() {
    const container = document.getElementById('cardio-wiggers-anim');
    if (!container) return;
    const btn = document.getElementById('cardio-wiggers-playpause');
    if (btn) {
        btn.addEventListener('click', () => {
            container.classList.toggle('paused');
            btn.textContent = container.classList.contains('paused') ? '▶ Reanudar' : '⏸ Pausar';
        });
    }
    const speedSel = document.getElementById('cardio-wiggers-velocidad');
    if (speedSel) {
        speedSel.addEventListener('change', () => {
            container.style.setProperty('--ciclo-duracion', speedSel.value);
        });
    }
}

// Interpretación fisiopatológica del DO2I calculado: qué significa la
// cifra, qué mecanismo compensador está (o no) en marcha para sostenerla,
// y qué implica que ese mecanismo se agote (descompensación). Cruza con
// el concepto de DO2 crítico y extracción máxima (60-70%) ya desarrollado
// en la Ficha 5.
function textoZonaDO2I(do2i) {
    if (do2i < 350) {
        return 'Por debajo del <strong>DO₂ crítico</strong> habitual — el aporte de oxígeno ya no cubre la demanda ni siquiera con la extracción tisular al máximo (60-70%). El metabolismo celular se vuelve <strong>dependiente del aporte</strong>: el VO₂ empieza a caer en paralelo al DO₂, forzando la vía anaeróbica (ácido láctico, acidosis metabólica) y con riesgo real de disfunción orgánica múltiple si no se corrige con urgencia la causa (gasto cardíaco, hemoglobina u oxigenación).';
    }
    if (do2i < 450) {
        return 'Por debajo del rango normal. El mecanismo compensador ya en marcha es el <strong>aumento de la extracción tisular de oxígeno</strong> (↑EO₂, hasta un máximo fisiológico de 60-70%) para mantener constante el VO₂ — así puede haber un paciente hemodinámicamente "compensado" con un DO₂ bajo. Si la causa de fondo (anemia, hipoxemia, bajo gasto) no se corrige y la extracción llega a su límite, el siguiente paso es la caída del VO₂ y la aparición de hiperlactatemia.';
    }
    if (do2i < 530) {
        return 'En el límite inferior de la normalidad — todavía dentro de un rango en el que la extracción de oxígeno puede compensar variaciones moderadas de la demanda, pero con poco margen de reserva ante un aumento brusco del consumo (fiebre, dolor, agitación, destete de la ventilación mecánica).';
    }
    if (do2i <= 600) {
        return 'Dentro del rango normal de referencia (Tabla 3) — el aporte de oxígeno cubre la demanda metabólica basal con margen de extracción de reserva (EO₂ normal 25-35%), sin necesitar mecanismos compensadores adicionales.';
    }
    if (do2i <= 750) {
        return 'Por encima del rango de referencia. Puede ser una respuesta fisiológica apropiada (ejercicio, fiebre, embarazo, anemia crónica compensada con gasto cardíaco elevado) o el reflejo de un estado hiperdinámico temprano (sepsis, hipertiroidismo) — el número por sí solo no distingue entre ambos escenarios; hay que interpretarlo junto con la saturación venosa y el lactato.';
    }
    return 'Marcadamente elevado, sugestivo de un estado <strong>hiperdinámico</strong> franco (fase inicial de la sepsis, anemia grave con gasto cardíaco muy aumentado, tirotoxicosis). Un DO₂ alto no garantiza una oxigenación tisular adecuada: en el shock distributivo puede coexistir con hipoxia celular real por alteración de la microcirculación y del shunt arteriovenoso (Ficha 4) — el escenario clásico en el que "los números se ven bien" en el monitor pero el paciente sigue hipoperfundido a nivel tisular.';
}

// Principio de Fick (Ficha 1: Fisiología cardíaca aplicada) — CaO2, DO2 y,
// si se dan datos venosos, CvO2/VO2/EO2. DO2/VO2 se multiplican x10 para
// convertir el CaO2 (mL/dL) x GC (L/min) a mL/min, igual que la Tabla 12
// del Capítulo 5 (ver Ficha 5, IDO2).
function calcFickTransporte() {
    const ids = ['cardio-fick-hb', 'cardio-fick-sao2', 'cardio-fick-pao2', 'cardio-fick-fc', 'cardio-fick-vs', 'cardio-fick-sc'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('cardio-fick-resultado');
    const interpretacionEl = document.getElementById('cardio-fick-interpretacion');
    if (els.some(e => !e) || !box) return;
    if (els.some(e => e.value === '')) {
        box.style.display = 'none';
        const gaugeRow = document.getElementById('cardio-fick-gauge-row');
        if (gaugeRow) gaugeRow.style.display = 'none';
        if (interpretacionEl) interpretacionEl.style.display = 'none';
        return;
    }

    const [hb, sao2, pao2, fc, vs, sc] = els.map(e => Number(e.value));
    const gc = (fc * vs) / 1000;
    const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * 0.003;
    const do2 = gc * cao2 * 10;
    const ic = gc / sc;
    const do2i = do2 / sc;

    let lineas = [
        `GC = FC × VS = ${gc.toFixed(2)} L/min (IC = ${ic.toFixed(2)} L/min/m²)`,
        `CaO₂ = Hb×1,34×SaO₂ + PaO₂×0,003 = ${cao2.toFixed(1)} mL/dL`,
        `DO₂ = GC × CaO₂ × 10 = ${do2.toFixed(0)} mL/min (DO₂I = ${do2i.toFixed(0)} mL/min/m²)`,
    ];

    let estado = 'ok';
    if (do2i < 450) estado = 'danger';
    else if (do2i < 530) estado = 'warn';

    let textoInterpretacion = textoZonaDO2I(do2i);

    const svo2El = document.getElementById('cardio-fick-svo2');
    const pvo2El = document.getElementById('cardio-fick-pvo2');
    if (svo2El && pvo2El && svo2El.value !== '' && pvo2El.value !== '') {
        const svo2 = Number(svo2El.value);
        const pvo2 = Number(pvo2El.value);
        const cvo2 = hb * 1.34 * (svo2 / 100) + pvo2 * 0.003;
        const vo2 = gc * (cao2 - cvo2) * 10;
        const eo2 = do2 > 0 ? (vo2 / do2) * 100 : 0;
        lineas.push(`CvO₂ = ${cvo2.toFixed(1)} mL/dL`);
        lineas.push(`VO₂ = GC × (CaO₂ − CvO₂) × 10 = ${vo2.toFixed(0)} mL/min`);
        lineas.push(`EO₂ = VO₂/DO₂ = ${eo2.toFixed(1)}%`);
        if (eo2 > 35 && estado === 'ok') estado = 'warn';
        if (eo2 >= 50) {
            textoInterpretacion += ' Con una extracción de oxígeno (EO₂) del ' + eo2.toFixed(0) + '%, el organismo ya está usando gran parte de su reserva de extracción (el máximo fisiológico ronda el 60-70%) — queda poco margen de compensación antes de que el VO₂ empiece a depender directamente del DO₂.';
        }
    }

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = lineas.join('<br>') +
        `<br><span style="font-size:0.72rem;opacity:0.85;">Valores normales de referencia (Tabla 3): DO₂I 530-600 mL/min/m², EO₂ 25-35%.</span>`;

    if (interpretacionEl) {
        interpretacionEl.style.display = 'block';
        interpretacionEl.className = `tfg-estado tfg-estado-${estado}`;
        interpretacionEl.innerHTML = textoInterpretacion;
    }

    actualizarGaugeDO2I(do2i, estado);
}

// Gauge visual del DO2I (escala 0-800 mL/min/m², banda normal 530-600
// marcada con 2 marcadores) — mismo patrón .kinetic-row/.kinetic-fill/
// .kinetic-marker ya usado en las calculadoras ISTH de Síndromes Urgentes.
const DO2I_GAUGE_MAX = 800;
function actualizarGaugeDO2I(do2i, estado) {
    const row = document.getElementById('cardio-fick-gauge-row');
    const fill = document.getElementById('cardio-fick-gauge-fill');
    const num = document.getElementById('cardio-fick-gauge-num');
    if (!row || !fill || !num) return;

    row.style.display = 'block';
    fill.style.width = `${Math.max(0, Math.min(100, (do2i / DO2I_GAUGE_MAX) * 100))}%`;
    const colores = { ok: 'var(--accent-green)', warn: 'var(--accent-yellow)', danger: 'var(--accent-red)' };
    const glows = { ok: 'var(--glow-green)', warn: 'none', danger: 'var(--glow-red)' };
    fill.style.background = colores[estado] || colores.ok;
    fill.style.boxShadow = glows[estado] || 'none';
    num.textContent = `${do2i.toFixed(0)}`;
}

// Interpretación fisiopatológica de la RVS: qué significa cada zona, qué
// mecanismo reflejo la sostiene, y qué implica que ese mecanismo se agote
// o se vuelva insuficiente (paso de shock compensado a descompensado).
function zonaRVS(rvs) {
    if (rvs < 8) {
        return {
            estado: 'danger',
            texto: 'Resistencia vascular muy baja — <strong>vasoplejía</strong>. Es el patrón característico del shock distributivo (séptico, anafiláctico, neurogénico): pérdida del tono vasomotor por sobreproducción de óxido nítrico y otros mediadores inflamatorios, con hiporrespuesta del músculo liso vascular a las catecolaminas. Mientras puede, el organismo compensa aumentando el gasto cardíaco de forma refleja (PAM = GC × RVS) — el patrón hiperdinámico típico del shock séptico precoz. Cuando ni el aumento del GC compensa la caída de RVS, o esta se hace refractaria a vasopresores en dosis crecientes, se habla de <strong>shock vasopléjico</strong>, de mal pronóstico.',
        };
    }
    if (rvs < 10) {
        return {
            estado: 'warn',
            texto: 'Resistencia vascular por debajo de lo habitual — vasodilatación relativa, que puede ser un signo precoz de un proceso distributivo, un efecto de sedación/anestesia/fármacos vasodilatadores, o parte de una respuesta fisiológica normal (fiebre, ejercicio, embarazo avanzado).',
        };
    }
    if (rvs <= 15) {
        return {
            estado: 'ok',
            texto: 'Dentro del rango de referencia habitual — el tono vasomotor sostiene la perfusión tisular sin imponer una poscarga excesiva al ventrículo izquierdo.',
        };
    }
    if (rvs <= 20) {
        return {
            estado: 'warn',
            texto: 'Resistencia vascular elevada — <strong>vasoconstricción compensadora</strong>, el reflejo (barorreceptores → sistema simpático → eje renina-angiotensina-aldosterona) que el organismo activa para sostener la PAM cuando el gasto cardíaco cae (hipovolemia, disfunción sistólica). Es útil a corto plazo, pero aumenta la poscarga del VI y, sostenida, puede comprometer aún más un corazón con reserva contráctil limitada — además reduce el flujo esplácnico y renal, con riesgo de isquemia mesentérica y lesión renal aguda.',
        };
    }
    return {
        estado: 'danger',
        texto: 'Vasoconstricción extrema — el organismo está sacrificando el flujo a órganos no vitales (piel, músculo, esplácnico, renal) para sostener la presión arterial central (cerebro, corazón). Si el gasto cardíaco sigue cayendo pese a esta vasoconstricción máxima, la RVS no puede seguir aumentando indefinidamente y la presión arterial empieza a caer también — es el paso de <strong>shock compensado a shock descompensado</strong>.',
    };
}

// Resistencias vasculares (ley de Hagen-Poiseuille), Ficha 1.
function calcResistenciasVasculares() {
    const gcEl = document.getElementById('cardio-rv-gc');
    const pamEl = document.getElementById('cardio-rv-pam');
    const padEl = document.getElementById('cardio-rv-pad');
    const box = document.getElementById('cardio-rv-resultado');
    const interpretacionEl = document.getElementById('cardio-rv-interpretacion');
    if (!gcEl || !pamEl || !padEl || !box) return;
    if (gcEl.value === '' || pamEl.value === '' || padEl.value === '') {
        box.style.display = 'none';
        if (interpretacionEl) interpretacionEl.style.display = 'none';
        return;
    }

    const gc = Number(gcEl.value);
    const pam = Number(pamEl.value);
    const pad = Number(padEl.value);
    if (gc === 0) { box.style.display = 'none'; return; }

    const rvs = (pam - pad) / gc;
    let lineas = [`RVS = (PAM − PAD) / GC = ${rvs.toFixed(1)} unidades de Wood (mmHg·min/L) ≈ ${(rvs * 80).toFixed(0)} dyn·s·cm⁻⁵`];

    const pampEl = document.getElementById('cardio-rv-pamp');
    const paiEl = document.getElementById('cardio-rv-pai');
    if (pampEl && paiEl && pampEl.value !== '' && paiEl.value !== '') {
        const pamp = Number(pampEl.value);
        const pai = Number(paiEl.value);
        const rvp = (pamp - pai) / gc;
        lineas.push(`RVP = (PAMP − PAI) / GC = ${rvp.toFixed(2)} unidades de Wood ≈ ${(rvp * 80).toFixed(0)} dyn·s·cm⁻⁵`);
    }

    const zona = zonaRVS(rvs);

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${zona.estado}`;
    box.innerHTML = lineas.join('<br>') +
        '<br><span style="font-size:0.72rem;opacity:0.85;">Recuerda: la fuente advierte que RVS/RVP no reflejan fielmente la poscarga real, por el acoplamiento matemático con el propio GC.</span>';

    if (interpretacionEl) {
        interpretacionEl.style.display = 'block';
        interpretacionEl.className = `tfg-estado tfg-estado-${zona.estado}`;
        interpretacionEl.innerHTML = zona.texto;
    }
}

// Costo de funcionamiento miocárdico (doble/triple producto, presión de
// perfusión coronaria, índice aporte-consumo), Ficha 2.
function calcCostoFuncionamiento() {
    const fcEl = document.getElementById('cardio-costo-fc');
    const pasEl = document.getElementById('cardio-costo-pas');
    const cunaEl = document.getElementById('cardio-costo-cuna');
    const padEl = document.getElementById('cardio-costo-pad-sist');
    const ladoEl = document.getElementById('cardio-costo-lado');
    const pvcEl = document.getElementById('cardio-costo-pvc');
    const pvcGroup = document.getElementById('cardio-costo-pvc-group');
    const box = document.getElementById('cardio-costo-resultado');
    if (!fcEl || !pasEl || !cunaEl || !padEl || !ladoEl || !pvcEl || !box) return;

    const esDerecho = ladoEl.value === 'der';
    if (pvcGroup) pvcGroup.style.display = esDerecho ? 'block' : 'none';

    if (fcEl.value === '' || pasEl.value === '' || cunaEl.value === '' || padEl.value === '' || (esDerecho && pvcEl.value === '')) {
        box.style.display = 'none';
        return;
    }

    const fc = Number(fcEl.value);
    const pas = Number(pasEl.value);
    const cuna = Number(cunaEl.value);
    const padSist = Number(padEl.value);
    const referencia = esDerecho ? Number(pvcEl.value) : cuna;

    const dobleProducto = fc * pas;
    const tripleProducto = dobleProducto * cuna;
    const ppc = padSist - referencia;
    const indiceAporteConsumo = tripleProducto > 0 ? ppc / (tripleProducto / 1000) : null;

    let estado = 'ok';
    if (dobleProducto > 12000 || tripleProducto > 120000) estado = 'danger';
    else if (ppc < 60 || (indiceAporteConsumo !== null && indiceAporteConsumo < 0.6)) estado = 'warn';

    const lineas = [
        `Doble producto = FC × PAS = ${dobleProducto.toLocaleString('es')} (normal máx. 12.000)`,
        `Triple producto = doble producto × presión en cuña = ${tripleProducto.toLocaleString('es')} (normal máx. 120.000)`,
        `Presión de perfusión coronaria (${esDerecho ? 'VD, PAD−PVC' : 'VI, PAD−cuña'}) = ${ppc.toFixed(0)} mmHg (objetivo &gt;60 mmHg)`,
        indiceAporteConsumo !== null ? `Índice de aporte-consumo = PPC / (triple producto/1000) = ${indiceAporteConsumo.toFixed(2)} (normal &gt;0,6)` : '',
    ].filter(Boolean);

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = lineas.join('<br>');
}

// Índice de aporte de oxígeno (IDO2 = IC x CaO2), Ficha 2 — versión x10
// (mL/min/m²) cruzada con el rango normal 520-650 de la Tabla 12 del
// Capítulo 5 (ver Ficha 5).
function calcIDO2Ficha2() {
    const ids = ['cardio-ido2-gc', 'cardio-ido2-sc', 'cardio-ido2-hb', 'cardio-ido2-sao2', 'cardio-ido2-pao2'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('cardio-ido2-resultado');
    if (els.some(e => !e) || !box) return;
    if (els.some(e => e.value === '')) { box.style.display = 'none'; return; }

    const [gc, sc, hb, sao2, pao2] = els.map(e => Number(e.value));
    if (sc === 0) { box.style.display = 'none'; return; }

    const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * 0.003;
    const ic = gc / sc;
    const ido2 = ic * cao2 * 10;

    let estado = 'ok';
    if (ido2 < 450) estado = 'danger';
    else if (ido2 < 520) estado = 'warn';

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `IC = GC/SC = ${ic.toFixed(2)} L/min/m²<br>` +
        `CaO₂ = ${cao2.toFixed(1)} mL/dL<br>` +
        `IDO₂ = IC × CaO₂ × 10 = ${ido2.toFixed(0)} mL/min/m²` +
        '<br><span style="font-size:0.72rem;opacity:0.85;">Valor normal de referencia (Tabla 12, Capítulo 5): 520-650 mL/min/m².</span>';
}

// Tensión de la pared ventricular, ley de Laplace (Ficha 3): T = (P×R)/2t.
function calcLaplaceTension() {
    const pEl = document.getElementById('cardio-laplace-p');
    const rEl = document.getElementById('cardio-laplace-r');
    const tEl = document.getElementById('cardio-laplace-t');
    const box = document.getElementById('cardio-laplace-resultado');
    if (!pEl || !rEl || !tEl || !box) return;
    if (pEl.value === '' || rEl.value === '' || tEl.value === '') { box.style.display = 'none'; return; }

    const p = Number(pEl.value);
    const r = Number(rEl.value);
    const t = Number(tEl.value);
    if (t === 0) { box.style.display = 'none'; return; }

    const tension = (p * r) / (2 * t);

    box.style.display = 'block';
    box.className = 'tfg-estado tfg-estado-ok';
    box.innerHTML = `T = (P × R) / 2t = (${p} × ${r}) / (2 × ${t}) = <strong>${tension.toFixed(1)}</strong> (unidades de presión×longitud/longitud)` +
        '<br><span style="font-size:0.72rem;opacity:0.85;">A mayor radio (dilatación) o menor grosor de pared, mayor tensión para la misma presión — la hipertrofia (↑t) es el mecanismo compensador que busca normalizarla.</span>';
}

export function init() {
    initCorkboard('cardio-corkboard', 'panel-cardio-tabs');

    document.querySelectorAll('#cardio-fs-precarga, #cardio-fs-estado')
        .forEach(el => el && el.addEventListener('input', calcFrankStarlingSimulador));
    calcFrankStarlingSimulador();

    initCicloCardiacoAnimado();

    document.querySelectorAll('#cardio-fick-hb, #cardio-fick-sao2, #cardio-fick-pao2, #cardio-fick-fc, #cardio-fick-vs, #cardio-fick-sc, #cardio-fick-svo2, #cardio-fick-pvo2')
        .forEach(el => el && el.addEventListener('input', calcFickTransporte));
    calcFickTransporte();

    document.querySelectorAll('#cardio-rv-gc, #cardio-rv-pam, #cardio-rv-pad, #cardio-rv-pamp, #cardio-rv-pai')
        .forEach(el => el && el.addEventListener('input', calcResistenciasVasculares));
    calcResistenciasVasculares();

    document.querySelectorAll('#cardio-costo-fc, #cardio-costo-pas, #cardio-costo-cuna, #cardio-costo-pad-sist, #cardio-costo-pvc')
        .forEach(el => el && el.addEventListener('input', calcCostoFuncionamiento));
    const ladoEl = document.getElementById('cardio-costo-lado');
    if (ladoEl) ladoEl.addEventListener('change', calcCostoFuncionamiento);
    calcCostoFuncionamiento();

    document.querySelectorAll('#cardio-laplace-p, #cardio-laplace-r, #cardio-laplace-t')
        .forEach(el => el && el.addEventListener('input', calcLaplaceTension));
    calcLaplaceTension();

    document.querySelectorAll('#cardio-ido2-gc, #cardio-ido2-sc, #cardio-ido2-hb, #cardio-ido2-sao2, #cardio-ido2-pao2')
        .forEach(el => el && el.addEventListener('input', calcIDO2Ficha2));
    calcIDO2Ficha2();
}
