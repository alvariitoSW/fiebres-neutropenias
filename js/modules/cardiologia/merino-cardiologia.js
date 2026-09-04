// Merino Cardiología — enfoque general del shock, shock hemorrágico,
// shock cardiogénico y síndromes de shock inflamatorio (cuaderno de
// campo). Fuente: Marik PE. Handbook of Evidence-Based Critical Care,
// Cap. 14-17.
import { initCorkboard, openCorkboardTopic } from '../../core/corkboard.js';

// Tabla 15.1 — clasificador de shock hemorrágico por % de volumen perdido.
function calcClaseHemorragia() {
    const input = document.getElementById('mc-clase-perdida');
    const resultado = document.getElementById('mc-clase-resultado');
    if (!input || !resultado) return;
    if (input.value === '') {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Introduce el % de volumen sanguíneo perdido estimado.</span>';
        return;
    }
    let pct = Number(input.value);
    if (pct < 0) { pct = 0; input.value = 0; }
    if (pct > 100) { pct = 100; input.value = 100; }

    let clase, estado, texto;
    if (pct < 15) {
        clase = 'Clase I'; estado = 'tfg-estado-ok';
        texto = 'Fase asintomática. Volumen restaurado por relleno transcapilar — reanimación con volumen no necesaria.';
    } else if (pct <= 30) {
        clase = 'Clase II'; estado = 'tfg-estado-warn';
        texto = 'Fase compensada. PA mantenida por vasoconstricción sistémica; vigilar hipoperfusión esplácnica. Reanimación con cristaloides.';
    } else if (pct <= 40) {
        clase = 'Clase III'; estado = 'tfg-estado-danger';
        texto = 'Shock hemorrágico establecido: la vasoconstricción ya no basta. Hipotensión, hipoperfusión orgánica, lactato elevado. Reanimación con sangre.';
    } else {
        clase = 'Clase IV'; estado = 'tfg-estado-danger';
        texto = 'Shock hemorrágico avanzado, potencialmente irreversible. Fallo multiorgánico y acidosis láctica grave. Transfusión masiva.';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${pct}% — ${clase}</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}

function initClaseHemorragia() {
    const input = document.getElementById('mc-clase-perdida');
    if (!input) return;
    input.addEventListener('input', calcClaseHemorragia);
    calcClaseHemorragia();
}

// Tabla 15.5 — intérprete TEG: cada select "anormal" añade su intervención.
const TEG_INTERVENCIONES = {
    r: 'Tiempo R anormal (&gt;9 min) → transfundir plasma, o revertir anticoagulantes (excepto warfarina).',
    k: 'Tiempo k anormal (&gt;2,5 min) → transfundir plasma.',
    alfa: 'Ángulo α anormal (&lt;65°) → crioprecipitado o concentrado de fibrinógeno.',
    ma: 'MA anormal (&lt;55 mm) → transfundir plaquetas.',
    ly30: 'LY30 anormal (&gt;3%) → ácido tranexámico.',
};
function calcTeg() {
    const ids = ['r', 'k', 'alfa', 'ma', 'ly30'];
    const selects = ids.map(id => document.getElementById(`mc-teg-${id}`));
    const resultado = document.getElementById('mc-teg-resultado');
    if (!resultado || selects.some(s => !s)) return;

    const evaluados = selects.filter(s => s.value !== '');
    if (evaluados.length === 0) {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Marca los parámetros TEG disponibles para ver las intervenciones recomendadas.</span>';
        return;
    }
    const anormales = ids.filter((id, i) => selects[i].value === 'anormal');
    if (anormales.length === 0) {
        resultado.className = 'result-box tfg-estado-ok';
        resultado.innerHTML = '<strong>Sin parámetros anormales marcados.</strong> Sin indicación de hemoderivados/antifibrinolítico según la TEG evaluada.';
        resultado.style.textAlign = 'left';
        return;
    }
    resultado.className = 'result-box tfg-estado-danger';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${anormales.length} parámetro${anormales.length > 1 ? 's' : ''} anormal${anormales.length > 1 ? 'es' : ''}:</strong>` +
        anormales.map(id => `<p style="font-size:0.85rem; margin:6px 0 0;">${TEG_INTERVENCIONES[id]}</p>`).join('');
}

function initTeg() {
    const r = document.getElementById('mc-teg-r');
    if (!r) return;
    document.querySelectorAll('.mc-teg-select').forEach(s => s.addEventListener('change', calcTeg));
    calcTeg();
}

// Selector "elección de dispositivo" — informativo, no puntuable (no hay
// un único ganador entre IABP/Impella/ECMO según la fuente).
const DISPOSITIVO_INFO = {
    iabp: {
        estado: 'tfg-estado-warn',
        texto: 'La forma más antigua y disponible de MCS, pese a no haber demostrado mejora en la supervivencia. Reduce el trabajo cardíaco (descarga el VI) y aumenta el flujo coronario/sistémico. Contraindicado en insuficiencia valvular aórtica o disección aórtica. Principal complicación: isquemia de extremidad (fiebre en 50%, bacteriemia en 15%).',
    },
    impella: {
        estado: 'tfg-estado-warn',
        texto: 'Bomba centrífuga percutánea que asiste el gasto ventricular (2,5-5,5 L/min). Efectos hemodinámicos similares al IABP, sin ventaja de supervivencia demostrada sobre él en shock relacionado con infarto — mayor ventaja en fallo del VI terminal (implante a largo plazo). Contraindicado en valvulopatía/prótesis aórtica y trombo del VI. Más sangrado mayor/isquemia de extremidad que el IABP, y mayor incidencia de hemólisis (5-10%).',
    },
    ecmo: {
        estado: 'tfg-estado-ok',
        texto: 'Soporte circulatorio y de intercambio gaseoso combinados — el único que da soporte biventricular completo sin combinar dispositivos. Método de elección si el shock cardiogénico se acompaña de fallo respiratorio. Problema propio: aumenta la poscarga del VI (puede requerir venteo o combinar con IABP/Impella). Complicaciones considerables: sangrado mayor (41%), sepsis (30%), isquemia de extremidad (17%), síndrome compartimental (10%), ictus (6%), amputación (5%). Supervivencia al alta ~42% en el mayor registro disponible.',
    },
};
function initDispositivoSelector() {
    const select = document.getElementById('mc-dispositivo-select');
    const resultado = document.getElementById('mc-dispositivo-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        const info = DISPOSITIVO_INFO[select.value];
        if (!info) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = `result-box ${info.estado}`;
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<p style="font-size:0.85rem;">${info.texto}</p>`;
    });
}

// Tabla 14.1 — selector "¿qué tipo de shock tengo delante?" por patrón
// PVC/gasto cardíaco/RVS. Cardiogénico y obstructivo comparten exactamente
// el mismo patrón en la tabla real (PVC alta/GC bajo/RVS alta) — el
// selector lo declara honestamente en vez de fingir que puede distinguirlos.
function calcTipoShock() {
    const pvc = document.getElementById('mc-shock-pvc')?.value;
    const gc = document.getElementById('mc-shock-gc')?.value;
    const rvs = document.getElementById('mc-shock-rvs')?.value;
    const resultado = document.getElementById('mc-shock-tipo-resultado');
    if (!resultado) return;

    if (!pvc || !gc || !rvs) {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Elige los 3 valores para ver el tipo de shock compatible.</span>';
        return;
    }

    let estado, texto;
    if (pvc === 'baja' && gc === 'bajo' && rvs === 'alta') {
        estado = 'tfg-estado-warn';
        texto = '<strong>Patrón compatible con shock hipovolémico.</strong> Ver Ficha III (fisiología y clasificación).';
    } else if (pvc === 'alta' && gc === 'bajo' && rvs === 'alta') {
        estado = 'tfg-estado-danger';
        texto = '<strong>Patrón compatible con shock cardiogénico u obstructivo</strong> — la Tabla 14.1 no los distingue entre sí con estas 3 variables: ambos comparten exactamente el mismo patrón. Se necesita evaluación adicional (ecocardiograma para función del VI, descartar taponamiento/embolia pulmonar/neumotórax a tensión). Ver Fichas VI-VIII (cardiogénico).';
    } else if (pvc === 'baja' && gc === 'normal-alto' && rvs === 'baja') {
        estado = 'tfg-estado-ok';
        texto = '<strong>Patrón compatible con shock vasodilatador (distributivo).</strong> El más frecuente con diferencia — el shock séptico explica la mayoría de los casos. Ver Ficha X (séptico) o Ficha XII (anafiláctico).';
    } else {
        estado = 'tfg-estado-warn';
        texto = 'Combinación no descrita en la Tabla 14.1 — puede tratarse de un patrón mixto, una fase de transición entre 2 tipos de shock, o un dato aislado poco fiable. Reevaluar con el cuadro clínico completo.';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = texto;
}

function initTipoShock() {
    const resultado = document.getElementById('mc-shock-tipo-resultado');
    if (!resultado) return;
    document.querySelectorAll('.mc-shock-tipo-select').forEach(s => s.addEventListener('change', calcTipoShock));
    calcTipoShock();
}

// Tabla 19.2 — CHA2DS2-VASc: riesgo de ictus en FA no valvular.
function calcCha2ds2Vasc() {
    const checks = document.querySelectorAll('.mc-cha2ds2-check');
    const resultado = document.getElementById('mc-cha2ds2-resultado');
    if (!resultado || checks.length === 0) return;

    let puntos = 0;
    checks.forEach(c => { if (c.checked) puntos += Number(c.dataset.puntos); });
    const sexoMarcado = document.getElementById('mc-cha-sexo')?.checked;
    // Tabla 19.2: Definido — varones ≥2 puntos, mujeres ≥3 puntos.
    // Considerar — varones 1 punto, mujeres 2 puntos.
    const umbralDefinido = sexoMarcado ? 3 : 2;
    const umbralConsiderar = sexoMarcado ? 2 : 1;

    let estado, texto;
    if (puntos === 0) {
        estado = 'tfg-estado-ok';
        texto = 'Riesgo mínimo. Sin indicación clara de anticoagulación (excepto FA valvular, que siempre la requiere independientemente de esta puntuación).';
    } else if (puntos >= umbralDefinido) {
        estado = 'tfg-estado-danger';
        texto = 'Riesgo definido de ictus (≥2 en varones, ≥3 en mujeres según la Tabla 19.2) — anticoagulación indicada salvo contraindicación (hemorragia activa, historia de HIC, tumor intracraneal, sangrado recurrente de lesión presente, plaquetas <50.000/µL).';
    } else if (puntos >= umbralConsiderar) {
        estado = 'tfg-estado-warn';
        texto = 'Riesgo bajo-intermedio ("Considerar" anticoagulación) — 1 punto en varones o 2 en mujeres, valorando el resto del cuadro clínico y el riesgo de sangrado.';
    } else {
        estado = 'tfg-estado-ok';
        texto = 'Riesgo mínimo — el sexo femenino aislado (sin ningún otro factor de riesgo) no alcanza por sí solo el umbral de "Considerar" anticoagulación de la Tabla 19.2 (2 puntos en mujeres).';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>CHA₂DS₂-VASc = ${puntos} puntos</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p><p style="font-size:0.75rem; color:var(--text-muted); margin-top:6px;">No aplica a FA valvular (estenosis mitral significativa o cualquier prótesis valvular), que siempre requiere anticoagulación con warfarina.</p>`;
}

function initCha2ds2Vasc() {
    const resultado = document.getElementById('mc-cha2ds2-resultado');
    if (!resultado) return;
    document.querySelectorAll('.mc-cha2ds2-check').forEach(c => c.addEventListener('change', calcCha2ds2Vasc));
    calcCha2ds2Vasc();
}

// Ecuación 19.1 — QTc de Bazett: QTc = QT / raiz(R-R).
function calcQtc() {
    const qtEl = document.getElementById('mc-qtc-qt');
    const fcEl = document.getElementById('mc-qtc-fc');
    const resultado = document.getElementById('mc-qtc-resultado');
    if (!qtEl || !fcEl || !resultado) return;

    if (qtEl.value === '' || fcEl.value === '') {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Introduce el QT medido (ms) y la frecuencia cardíaca (lpm).</span>';
        return;
    }
    let qtMs = Number(qtEl.value);
    let fc = Number(fcEl.value);
    if (qtMs < 0) { qtMs = 0; qtEl.value = 0; }
    if (fc <= 0) { fc = 1; fcEl.value = 1; }

    const rrSeg = 60 / fc;
    const qtSeg = qtMs / 1000;
    const qtcSeg = qtSeg / Math.sqrt(rrSeg);
    const qtcMs = qtcSeg * 1000;

    let estado, texto;
    if (qtcSeg <= 0.44) {
        estado = 'tfg-estado-ok';
        texto = 'QTc normal (≤0,44 s / ≤440 ms).';
    } else if (qtcSeg <= 0.5) {
        estado = 'tfg-estado-warn';
        texto = 'QTc prolongado, por debajo del umbral de mayor riesgo (0,5 s). Revisar fármacos/electrolitos que prolongan el QT (Tabla 19.5: antiarrítmicos IA/III, macrólidos, neurolépticos, cisaprida; hipopotasemia, hipocalcemia, hipomagnesemia).';
    } else {
        estado = 'tfg-estado-danger';
        texto = 'QTc &gt;0,5 s: riesgo de torsade de pointes. Corregir causas reversibles. Recuerda: el QT prolongado es frecuente en el crítico mientras que la torsade es infrecuente — su valor predictivo aislado es limitado.';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>QTc = ${qtcMs.toFixed(0)} ms (${qtcSeg.toFixed(3)} s)</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}

function initQtc() {
    const resultado = document.getElementById('mc-qtc-resultado');
    if (!resultado) return;
    document.querySelectorAll('.mc-qtc-input').forEach(el => el.addEventListener('input', calcQtc));
    calcQtc();
}

// Enlace interno Ficha I → Ficha X (mismo panel, sin depender del
// listener global .tx-link de nefrologia/index.js, que escanea todo el
// DOM y no debe reutilizarse fuera de sus propias claves de vista).
function initLinkASeptico() {
    const btn = document.getElementById('mc-link-a-septico');
    if (!btn) return;
    btn.addEventListener('click', () => openCorkboardTopic('panel-merino-cardio-tabs', 'mc-shock-septico'));
}

// Enlace interno Ficha XXIV → Ficha XXII (Tabla 21.1, que sustenta la
// cifra "1-7% de éxito" citada en el cierre "percepción vs. realidad").
function initLinkATabla211() {
    const btn = document.getElementById('mc-link-a-tabla211');
    if (!btn) return;
    btn.addEventListener('click', () => openCorkboardTopic('panel-merino-cardio-tabs', 'mc-paro-soporte'));
}

// Enlace interno Ficha VI (fallo del VD) → Ficha XIII (IC aguda: tipos y
// consecuencias, donde vive el desarrollo completo del fallo del VD).
function initLinkAIcTipos() {
    const btn = document.getElementById('mc-link-a-ic-tipos');
    if (!btn) return;
    btn.addEventListener('click', () => openCorkboardTopic('panel-merino-cardio-tabs', 'mc-ic-tipos'));
}

// Enlace interno Ficha VII (soporte farmacológico) → Ficha XX (estrategias
// de reperfusión completas del SCA).
function initLinkAScaTratamiento() {
    const btn = document.getElementById('mc-link-a-sca-tratamiento');
    if (!btn) return;
    btn.addEventListener('click', () => openCorkboardTopic('panel-merino-cardio-tabs', 'mc-sca-tratamiento'));
}

// Gauge visual del objetivo de PAM (Ficha I) — mismo patrón .kinetic-row/
// .kinetic-fill/.kinetic-marker ya usado en el resto de la app (DO2I de
// Cardiología/Fisiopatología UCI).
const MC_PAM_GAUGE_MAX = 120;
function calcPamGauge() {
    const input = document.getElementById('mc-pam-actual');
    const row = document.getElementById('mc-pam-gauge-row');
    const fill = document.getElementById('mc-pam-gauge-fill');
    const num = document.getElementById('mc-pam-gauge-num');
    if (!input || !row || !fill || !num) return;
    if (input.value === '') { row.style.display = 'none'; return; }
    let pam = Number(input.value);
    if (pam < 0) { pam = 0; input.value = 0; }
    if (pam > 180) { pam = 180; input.value = 180; }
    row.style.display = 'block';
    fill.style.width = `${Math.max(0, Math.min(100, (pam / MC_PAM_GAUGE_MAX) * 100))}%`;
    fill.style.background = pam >= 65 ? 'var(--accent-green)' : 'var(--accent-red)';
    fill.style.boxShadow = pam >= 65 ? 'var(--glow-green)' : 'var(--glow-red)';
    num.textContent = `${pam}`;
}
function initPamGauge() {
    const input = document.getElementById('mc-pam-actual');
    if (!input) return;
    input.addEventListener('input', calcPamGauge);
    calcPamGauge();
}

// Selector "¿qué agente para este escenario?" (Ficha II), basado en la
// Tabla 14.4 y en los perfiles de cada fármaco ya desarrollados en la ficha.
const VASOPRESOR_ESCENARIO = {
    'septico-inicial': { estado: 'tfg-estado-ok', texto: '<strong>Norepinefrina</strong> — vasopresor inicial de elección en shock séptico. Infusión continua sin dosis de carga, iniciar a 5-10 μg/min y titular al alza según respuesta (rango 5-40 μg/min).' },
    'septico-2': { estado: 'tfg-estado-warn', texto: '<strong>Vasopresina</strong> — 2º agente si la hipotensión persiste pese a norepinefrina. Infusión continua 0,01-0,04 U/h, dosis no titulable (a diferencia de los catecolaminérgicos).' },
    'septico-3': { estado: 'tfg-estado-danger', texto: '<strong>Angiotensina II</strong> — 3er agente en resistencia a norepinefrina + vasopresina. Inicio 20 ng/kg/min, hasta 80 ng/kg/min en las primeras 3h, mantenimiento ≤40 ng/kg/min. Riesgo mayor: trombosis venosa (13% vs. 5% con placebo en un ensayo). No hay evidencia convincente de que un 3er vasopresor mejore la supervivencia en shock séptico.' },
    anafilactico: { estado: 'tfg-estado-danger', texto: '<strong>Epinefrina</strong> — elección en shock anafiláctico (ver Ficha XII para dosis IM/IV). En otros contextos es 2ª línea en séptico (produce lactato, dificultando su uso como marcador de perfusión).' },
    bradicardia: { estado: 'tfg-estado-warn', texto: '<strong>Dopamina</strong> — estimulación cardíaca (cronotrópica) más marcada que otros vasopresores, útil si coexiste bradicardia con hipotensión, aunque hoy limitada en la mayoría de los demás contextos por esa misma estimulación indeseada.' },
    anestesia: { estado: 'tfg-estado-ok', texto: '<strong>Fenilefrina</strong> — agonista α puro, sobre todo para la hipotensión inducida por anestesia (sin componente cronotrópico que complique procedimientos breves).' },
};
function initVasopresorEscenario() {
    const select = document.getElementById('mc-vasopresor-escenario');
    const resultado = document.getElementById('mc-vasopresor-escenario-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        const info = VASOPRESOR_ESCENARIO[select.value];
        if (!info) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = `result-box ${info.estado}`;
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<p style="font-size:0.85rem;">${info.texto}</p>`;
    });
}

// Diferenciador TSS estafilocócico vs. estreptocócico (Ficha XI), basado en
// la Tabla 17.3 — orientativo por conteo de datos disponibles, nunca
// diagnóstico por sí solo.
function calcTss() {
    const hemo = document.getElementById('mc-tss-hemocultivo-pos')?.checked;
    const menstrual = document.getElementById('mc-tss-fuente-menstrual')?.checked;
    const fascitis = document.getElementById('mc-tss-fuente-fascitis')?.checked;
    const dolor = document.getElementById('mc-tss-dolor-desproporcionado')?.checked;
    const resultado = document.getElementById('mc-tss-resultado');
    if (!resultado) return;

    if (!hemo && !menstrual && !fascitis && !dolor) {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Marca los datos disponibles para ver hacia qué síndrome apuntan (orientativo, no diagnóstico).</span>';
        return;
    }
    let puntosEstrepto = 0, puntosEstafilo = 0;
    if (hemo) puntosEstrepto += 1;
    if (menstrual) puntosEstafilo += 2;
    if (fascitis) puntosEstrepto += 2;
    if (dolor) puntosEstrepto += 1;

    let estado, texto;
    if (puntosEstrepto > puntosEstafilo) {
        estado = 'tfg-estado-danger';
        texto = 'Los datos marcados orientan más hacia <strong>TSS estreptocócico</strong> (mortalidad 35%, muy superior al estafilocócico) — hemocultivos positivos en ~60% de los casos, fuente típica fascitis necrotizante/sepsis posparto, dolor desproporcionado al examen. Terapia: penicilina en dosis alta + clindamicina.';
    } else if (puntosEstafilo > puntosEstrepto) {
        estado = 'tfg-estado-warn';
        texto = 'Los datos marcados orientan más hacia <strong>TSS estafilocócico</strong> — hemocultivos positivos en &lt;5% de los casos (su ausencia NO lo descarta), fuente típica menstruación/tampones o herida quirúrgica. Terapia: MSSA → cefazolina + clindamicina · MRSA → vancomicina + clindamicina.';
    } else {
        estado = 'tfg-estado-warn';
        texto = 'Datos mixtos o insuficientes para orientar el diagnóstico diferencial — recuerda que sin fuente identificable (~35% estafilocócico, ~45% estreptocócico) el diagnóstico se apoya en el cuadro clínico global, no en un único dato aislado. En ambos casos: cobertura empírica de amplio espectro + vancomicina + clindamicina mientras se aclara.';
    }
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = texto;
}
function initTss() {
    const resultado = document.getElementById('mc-tss-resultado');
    if (!resultado) return;
    document.querySelectorAll('.mc-tss-check').forEach(c => c.addEventListener('change', calcTss));
    calcTss();
}

// Selector de perfil hemodinámico en shock cardiogénico (Ficha VI) — VI,
// VD, obstrucción dinámica del TSVI e inflamación sistémica sobreañadida.
const CARDIOGENICO_PERFIL_INFO = {
    vi: { estado: 'tfg-estado-danger', texto: 'Fallo del <strong>ventrículo izquierdo</strong> — la causa más frecuente de shock cardiogénico (síndrome coronario agudo ~50% de los casos según el Cap. 14; ~2/3 según el Cap. 16, ver nota de fidelidad en Ficha I). Manejo dirigido a la perfusión tisular y la revascularización — ver Ficha VII.' },
    vd: { estado: 'tfg-estado-warn', texto: 'Fallo del <strong>ventrículo derecho</strong> — mismas similitudes fisiopatológicas que el fallo del VI, pero con menor mortalidad. La dilatación grave del VD puede desplazar el septo interventricular hacia el VI, comprometiendo también su llenado (interdependencia ventricular).' },
    tsvi: { estado: 'tfg-estado-warn', texto: '<strong>Obstrucción dinámica del tracto de salida del VI</strong> (miocardiopatía hipertrófica) — se trata de forma distinta al resto: el objetivo es enlentecer la FC y aumentar el llenado diastólico con betabloqueantes no vasodilatadores (metoprolol, nadolol), NO con inotrópicos ni reducción de precarga, que empeoran la obstrucción.' },
    inflamatorio: { estado: 'tfg-estado-warn', texto: '<strong>Shock cardiogénico con inflamación sistémica sobreañadida</strong> (20-40% de los casos post-IAM) — las RVS pueden NO estar elevadas pese al bajo gasto (vasodilatación por óxido nítrico), y la mortalidad es mayor. Se relaciona con la disfunción microcirculatoria del shock cardiogénico.' },
};
function initCardiogenicoPerfil() {
    const select = document.getElementById('mc-cardiogenico-perfil-select');
    const resultado = document.getElementById('mc-cardiogenico-perfil-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        const info = CARDIOGENICO_PERFIL_INFO[select.value];
        if (!info) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = `result-box ${info.estado}`;
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<p style="font-size:0.85rem;">${info.texto}</p>`;
    });
}

// Asistente de titulación de furosemida IV (Ficha XIV) — mismo patrón
// wizard/estado-máquina ya usado por el algoritmo de diuréticos de la
// guía ESC 2026 de IC (insuficiencia-cardiaca.js).
const MC_FUROSEMIDA_WIZARD = {
    inicio: {
        pregunta: '¿El paciente ya recibe furosemida oral de forma crónica?',
        si: 'evaluarCronico',
        no: 'preguntaRenal',
    },
    preguntaRenal: {
        pregunta: '¿Función renal normal (sin insuficiencia renal conocida)?',
        si: 'evaluarNormal',
        no: 'evaluarIR',
    },
    evaluarNormal: {
        pregunta: 'Dosis IV inicial: 40 mg (naïve, función renal normal). A las 2h, ¿diuresis ≥1 litro?',
        si: { estado: 'tfg-estado-ok', final: 'Respuesta adecuada a 40 mg IV. Mantener la dosis eficaz IV dos veces al día hasta descongestión completa.' },
        no: 'dosisMax',
    },
    evaluarIR: {
        pregunta: 'Dosis IV inicial: 60-80 mg (naïve, insuficiencia renal). A las 2h, ¿diuresis ≥1 litro?',
        si: { estado: 'tfg-estado-ok', final: 'Respuesta adecuada a la dosis inicial. Mantener la dosis eficaz IV dos veces al día hasta descongestión completa.' },
        no: 'dosisMax',
    },
    evaluarCronico: {
        pregunta: 'Dosis IV inicial: igual a la dosis oral diaria total (solo ~50% de la dosis oral se absorbe — puede necesitar ajuste al alza). A las 2h, ¿diuresis ≥1 litro?',
        si: { estado: 'tfg-estado-ok', final: 'Respuesta adecuada a la dosis inicial. Mantener la dosis eficaz IV dos veces al día hasta descongestión completa.' },
        no: 'dosisMax',
    },
    dosisMax: {
        pregunta: '¿La dosis IV actual ya alcanza 200 mg?',
        si: { estado: 'tfg-estado-danger', final: 'Resistencia a furosemida confirmada (sin respuesta a 200 mg IV). Considerar bumetanida/torsemida, metolazona adyuvante, infusión continua, o ultrafiltración — ver Tabla 18.4 y el micro-perfil "Resistencia a la furosemida" de esta misma ficha.' },
        no: { estado: 'tfg-estado-warn', final: 'Doblar la dosis IV (hasta un máximo de 200 mg) y reevaluar la diuresis a las 2h.' },
    },
};
function renderFurosemidaWizard(pasoKey) {
    const preguntaEl = document.getElementById('mc-furosemida-wizard-pregunta');
    const botonesEl = document.getElementById('mc-furosemida-wizard-botones');
    const resultadoEl = document.getElementById('mc-furosemida-wizard-resultado');
    const resetEl = document.getElementById('mc-furosemida-wizard-reset');
    if (!preguntaEl) return;
    const paso = MC_FUROSEMIDA_WIZARD[pasoKey];
    preguntaEl.textContent = paso.pregunta;
    resultadoEl.style.display = 'none';
    resetEl.style.display = 'none';
    botonesEl.innerHTML = '';
    ['si', 'no'].forEach(resp => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opcion';
        btn.style.flex = '1';
        btn.textContent = resp === 'si' ? 'Sí' : 'No';
        btn.addEventListener('click', () => {
            const next = paso[resp];
            if (typeof next === 'string') {
                renderFurosemidaWizard(next);
            } else {
                botonesEl.innerHTML = '';
                resultadoEl.style.display = 'block';
                resultadoEl.className = `result-box ${next.estado}`;
                resultadoEl.style.textAlign = 'left';
                resultadoEl.innerHTML = `<strong>${next.final}</strong>`;
                resetEl.style.display = 'inline-block';
            }
        });
        botonesEl.appendChild(btn);
    });
}
function initFurosemidaWizard() {
    const preguntaEl = document.getElementById('mc-furosemida-wizard-pregunta');
    if (!preguntaEl) return;
    renderFurosemidaWizard('inicio');
    document.getElementById('mc-furosemida-wizard-reset').addEventListener('click', () => renderFurosemidaWizard('inicio'));
}

// Conversor de equivalencia de diuréticos de asa (Ficha XIV) — Tabla 18.4:
// 40 mg furosemida = 1 mg bumetanida = 20 mg torsemida.
function calcDiureticoEquiv() {
    const input = document.getElementById('mc-diuretico-equiv-input');
    const resultado = document.getElementById('mc-diuretico-equiv-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    let mg = Number(input.value);
    if (mg < 0) { mg = 0; input.value = 0; }
    const bumetanida = mg / 40;
    const torsemida = mg / 2;
    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${mg} mg furosemida ≈ ${bumetanida.toFixed(2)} mg bumetanida ≈ ${torsemida.toFixed(1)} mg torsemida</strong><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Equivalencia de la Tabla 18.4 (40:1:20) — útil en resistencia a furosemida, dado que bumetanida/torsemida tienen mayor biodisponibilidad.</p>`;
}
function initDiureticoEquiv() {
    const input = document.getElementById('mc-diuretico-equiv-input');
    if (!input) return;
    input.addEventListener('input', calcDiureticoEquiv);
    calcDiureticoEquiv();
}

// Calculadora de delta de troponina (Ficha XIX), protocolo de 3 pasos de
// hs-cTn al ingreso y a la 1h ya descrito en la propia ficha.
function calcTroponinaDelta() {
    const inicialEl = document.getElementById('mc-troponina-inicial');
    const horaEl = document.getElementById('mc-troponina-1h');
    const resultado = document.getElementById('mc-troponina-resultado');
    if (!inicialEl || !horaEl || !resultado) return;
    if (inicialEl.value === '' || horaEl.value === '') { resultado.style.display = 'none'; return; }
    const inicial = Number(inicialEl.value);
    const hora = Number(horaEl.value);
    if (inicial < 0 || hora < 0) { resultado.style.display = 'none'; return; }

    let deltaPct = inicial === 0 ? (hora === 0 ? 0 : Infinity) : ((hora - inicial) / inicial) * 100;

    let estado, texto;
    if (!isFinite(deltaPct)) {
        estado = 'tfg-estado-danger';
        texto = 'Cambio no cuantificable como % desde un valor inicial de 0 — valora el cambio absoluto y el cuadro clínico.';
    } else if (Math.abs(deltaPct) > 10) {
        estado = 'tfg-estado-danger';
        texto = `Cambio ${deltaPct > 0 ? 'ascendente' : 'descendente'} &gt;10% — evidencia de isquemia aguda (IM agudo), según el protocolo de 3 pasos de esta ficha.`;
    } else {
        estado = 'tfg-estado-ok';
        texto = 'Cambio ≤10% — sin evidencia de isquemia aguda por este criterio. Si la hs-cTn inicial ya está elevada (por encima del percentil 99 del ensayo) y han pasado ≥3h desde el inicio de síntomas, sigue siendo compatible con necrosis miocárdica ya establecida (causas no isquémicas: miocardiopatía, taquicardia sostenida, IC, hipertensión pulmonar, sepsis).';
    }
    resultado.style.display = 'block';
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Δ = ${isFinite(deltaPct) ? deltaPct.toFixed(1) + '%' : '—'}</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}
function initTroponinaDelta() {
    const resultado = document.getElementById('mc-troponina-resultado');
    if (!resultado) return;
    document.getElementById('mc-troponina-inicial')?.addEventListener('input', calcTroponinaDelta);
    document.getElementById('mc-troponina-1h')?.addEventListener('input', calcTroponinaDelta);
    calcTroponinaDelta();
}

// Cronómetro de tiempo puerta-balón / puerta-aguja (Ficha XX) — tiempo real
// desde que se pulsa "Iniciar", comparado contra el objetivo AHA de cada
// modo (90-120 min puerta-balón; &lt;30 min puerta-aguja).
let mcPuertaBalonInterval = null;
let mcPuertaBalonInicio = null;
function actualizarPuertaBalon() {
    const resultado = document.getElementById('mc-puerta-balon-resultado');
    const modoEl = document.getElementById('mc-puerta-balon-modo');
    if (!resultado || !mcPuertaBalonInicio) return;
    const segundos = Math.floor((Date.now() - mcPuertaBalonInicio) / 1000);
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    let estado, mensaje;
    if (modoEl && modoEl.value === 'aguja') {
        if (min < 30) { estado = 'tfg-estado-ok'; mensaje = 'Dentro del objetivo de tiempo puerta-aguja (&lt;30 min).'; }
        else { estado = 'tfg-estado-danger'; mensaje = 'Por encima del objetivo de 30 min para iniciar trombólisis.'; }
    } else {
        if (min < 90) { estado = 'tfg-estado-ok'; mensaje = 'Dentro del objetivo (&lt;90 min).'; }
        else if (min < 120) { estado = 'tfg-estado-warn'; mensaje = 'Por encima del objetivo AHA de 90 min, dentro del límite de 120 min.'; }
        else { estado = 'tfg-estado-danger'; mensaje = 'Por encima de 120 min — la mortalidad aumenta significativamente a partir de aquí (Fig. 20.2). Si no se ha hecho ya, valorar trombólisis previa a la transferencia.'; }
    }
    resultado.style.display = 'block';
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${min} min ${seg.toString().padStart(2, '0')} s</strong><p style="font-size:0.85rem; margin-top:6px;">${mensaje}</p>`;
}
function initPuertaBalon() {
    const iniciarBtn = document.getElementById('mc-puerta-balon-iniciar');
    const resetBtn = document.getElementById('mc-puerta-balon-reset');
    if (!iniciarBtn || !resetBtn) return;
    iniciarBtn.addEventListener('click', () => {
        mcPuertaBalonInicio = Date.now();
        iniciarBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        actualizarPuertaBalon();
        mcPuertaBalonInterval = setInterval(actualizarPuertaBalon, 1000);
    });
    resetBtn.addEventListener('click', () => {
        clearInterval(mcPuertaBalonInterval);
        mcPuertaBalonInicio = null;
        iniciarBtn.style.display = 'inline-block';
        resetBtn.style.display = 'none';
        const resultado = document.getElementById('mc-puerta-balon-resultado');
        if (resultado) resultado.style.display = 'none';
    });
    document.getElementById('mc-puerta-balon-modo')?.addEventListener('change', () => {
        if (mcPuertaBalonInicio) actualizarPuertaBalon();
    });
}

// Selector de antihipertensivo en disección aórtica (Ficha XXI), Tabla 20.5.
const DISECCION_FARMACO_INFO = {
    'titulacion-rapida': { estado: 'tfg-estado-ok', texto: '<strong>Esmolol</strong> — betabloqueante ultrarrápido (semivida ~9 min), preferido cuando se necesita ajustar la dosis con rapidez. 500 μg/kg bolo, luego 50 μg/kg/min, incrementos de 25 hasta 200 μg/kg/min máx. Evitar en IC aguda.' },
    monoterapia: { estado: 'tfg-estado-ok', texto: '<strong>Labetalol</strong> — α y β bloqueante combinado, la única opción de la tabla que puede usarse en monoterapia (cubre control de FC y PA a la vez). 20 mg IV en 2 min, luego 20-40 mg cada 10 min o infusión 1-2 mg/min (máx. 300 mg acumulados). Evitar en IC aguda.' },
    'oral-mantenimiento': { estado: 'tfg-estado-ok', texto: '<strong>Metoprolol</strong> — adecuado para el betabloqueo inicial junto a un vasodilatador, con dosificación intermitente. 5 mg bolo, repetible ×2 en 5 min, luego 5-10 mg cada 4-6h.' },
    'vasodilatador-asociado': { estado: 'tfg-estado-warn', texto: '<strong>Nicardipino</strong> (o nitroprusiato) — SIEMPRE combinado con betabloqueante, nunca en monoterapia (la taquicardia refleja y el aumento del gasto cardíaco de un vasodilatador solo, sin betabloqueo, aumentan las fuerzas de cizalla). Nicardipino: infusión 5 mg/h, +2,5 mg/h cada 5 min hasta 15 mg/h máx.' },
    'ic-aguda': { estado: 'tfg-estado-danger', texto: 'Esmolol, labetalol y metoprolol son betabloqueantes — usar con cautela o evitarlos si coexiste IC aguda descompensada. Considerar nitroprusiato + betabloqueo con vigilancia hemodinámica estrecha, y valorar el manejo combinado con la Ficha XIV (IC aguda: manejo).' },
};
function initDiseccionFarmaco() {
    const select = document.getElementById('mc-diseccion-farmaco-select');
    const resultado = document.getElementById('mc-diseccion-farmaco-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        const info = DISECCION_FARMACO_INFO[select.value];
        if (!info) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = `result-box ${info.estado}`;
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<p style="font-size:0.85rem;">${info.texto}</p>`;
    });
}

// Selector de fármaco de control de frecuencia en FA por comorbilidad
// (Ficha XVI), Tabla 19.1.
const FA_FARMACO_INFO = {
    general: { estado: 'tfg-estado-ok', texto: '<strong>Diltiazem</strong> — el más popular y eficaz en las primeras horas (cruza el objetivo de 100 lpm a las ~2,3h). 0,25 mg/kg IV en 2 min, luego infusión 5-15 mg/h. Limitado por hipotensión (20-30%) y efecto inotrópico negativo.' },
    hfref: { estado: 'tfg-estado-warn', texto: '<strong>Amiodarona</strong> — preferida en HFrEF (menos inotropismo negativo que diltiazem/betabloqueantes), y puede además convertir a ritmo sinusal. 150 mg IV en 10 min (repetible), luego 1 mg/min×6h y 0,5 mg/min×18h (máx. 2,2 g/24h).' },
    hiperadrenergico: { estado: 'tfg-estado-ok', texto: '<strong>Betabloqueante</strong> (metoprolol o esmolol) — más eficaz en estados hiperadrenérgicos (dolor, ansiedad, sepsis) que diltiazem. Éxito en ~70% de los casos.' },
    'titulacion-rapida': { estado: 'tfg-estado-ok', texto: '<strong>Esmolol</strong> — betabloqueante ultra-corto (semivida 9 min), permite titulación rápida y reversible. 500 μg/kg IV bolo, luego 50 μg/kg/min, incrementos de 25 μg/kg/min cada 5 min hasta 200 μg/kg/min máx.' },
    'control-cronico': { estado: 'tfg-estado-warn', texto: '<strong>Digoxina</strong> — acción lenta, NO debe usarse sola para control agudo (apenas alcanza el objetivo &lt;100 lpm a las 6h), pero es una opción de control a largo plazo, sobre todo en HFrEF. 0,25 mg IV cada 2h hasta 1,5 mg total, luego 0,125-0,375 mg IV/día.' },
    wpw: { estado: 'tfg-estado-danger', texto: '<span class="hl-rojo">Ninguno de los fármacos de la Tabla 19.1 debe usarse</span> si la FA se origina de una vía accesoria en el nodo AV (WPW, ver Ficha XVII) — el bloqueo selectivo del nodo AV puede precipitar fibrilación ventricular. Requiere manejo especializado distinto.' },
};
function initFaFarmaco() {
    const select = document.getElementById('mc-fa-farmaco-select');
    const resultado = document.getElementById('mc-fa-farmaco-resultado');
    if (!select || !resultado) return;
    select.addEventListener('change', () => {
        const info = FA_FARMACO_INFO[select.value];
        if (!info) { resultado.style.display = 'none'; return; }
        resultado.style.display = 'block';
        resultado.className = `result-box ${info.estado}`;
        resultado.style.textAlign = 'left';
        resultado.innerHTML = `<p style="font-size:0.85rem;">${info.texto}</p>`;
    });
}

// Simulador paso a paso del algoritmo ACLS (Ficha XXII) — mismo patrón
// wizard que el asistente de furosemida de más arriba, recorriendo la
// lógica del algo-flow ya presente en la ficha (protegido por copyright
// AHA en su forma gráfica original, aquí solo la secuencia de decisión).
const MC_ACLS_WIZARD = {
    inicio: {
        pregunta: 'Paro sin pulso confirmado — RCP inmediata (compresiones + O₂) en marcha, monitor/desfibrilador conectado. ¿Ritmo desfibrilable (FV/TV sin pulso)?',
        si: 'desfib1',
        no: 'noDesfib1',
    },
    desfib1: {
        pregunta: 'Desfibrila (choque bifásico 120-200 J) y reanuda RCP 2 min sin interrupción. Tras 2 min, ¿persiste ritmo desfibrilable?',
        si: 'epi1',
        no: { estado: 'tfg-estado-ok', final: 'Ritmo cambia. Comprueba pulso — si organizado y con pulso, posible RCE (ver cuidados posparo, Ficha XXIV). Si sigue sin pulso pero ya no desfibrilable, pasa a la vía de asistolia/AESP (epinefrina cada 3-5 min + buscar causas reversibles).' },
    },
    epi1: {
        pregunta: 'Epinefrina 1 mg IV/IO (repetir cada 3-5 min durante toda la reanimación) + 2º choque. Tras el 2º choque y 2 min de RCP, ¿persiste FV/TV?',
        si: 'antiarritmico',
        no: { estado: 'tfg-estado-ok', final: 'Ritmo cambia tras el 2º choque + epinefrina. Comprueba pulso — posible RCE (ver Ficha XXIV) o transición a la vía de asistolia/AESP si sigue sin pulso.' },
    },
    antiarritmico: {
        pregunta: 'Tras el 3er choque sin respuesta: amiodarona 300 mg IV/IO (2ª dosis 150 mg si es necesario; si no hay amiodarona, lidocaína 1-1,5 mg/kg). ¿Persiste FV/TV pese a 3 choques + epinefrina + antiarrítmico?',
        si: { estado: 'tfg-estado-danger', final: 'Mal pronóstico tras el fallo de 3 desfibrilaciones (~5% de resultado satisfactorio). Busca activamente causas reversibles ("las H y las T": hipovolemia, hipoxia, hidrogenión-acidosis, hipo/hiperpotasemia, hipotermia, neumoTórax a tensión, Taponamiento, Tóxicos, Tromboembolismo pulmonar, oclusión Trombótica coronaria) y considera ECMO emergente si está disponible en 24h.' },
        no: { estado: 'tfg-estado-ok', final: 'Ritmo cambia. Comprueba pulso — posible RCE (ver Ficha XXIV) o transición a la vía de asistolia/AESP si sigue sin pulso.' },
    },
    noDesfib1: {
        pregunta: 'Ritmo no desfibrilable (asistolia/AESP). RCP 2 min + epinefrina 1 mg IV/IO cada 3-5 min, buscando causas reversibles ("las T": neumoTórax a tensión, Taponamiento pericárdico, Tóxicos, Tromboembolismo pulmonar, oclusión Trombótica coronaria). Al reevaluar a los 2 min, ¿cambia a ritmo desfibrilable?',
        si: 'desfib1',
        no: 'noDesfib2',
    },
    noDesfib2: {
        pregunta: 'Sigue en asistolia/AESP. ¿Hay retorno de circulación espontánea (pulso palpable o ETCO₂ en ascenso, ver Ficha XXIII)?',
        si: { estado: 'tfg-estado-ok', final: 'RCE — inicia cuidados posparo cardíaco de inmediato (control de temperatura, hemodinámica, pronóstico neurológico: ver Ficha XXIV).' },
        no: { estado: 'tfg-estado-warn', final: 'Continúa ciclos de RCP 2 min + epinefrina cada 3-5 min, reevaluando ritmo y causas reversibles cada 2 min. Si el esfuerzo ha sido adecuado y prolongado sin RCE, considera la terminación de la reanimación.' },
    },
};
function renderAclsWizard(pasoKey) {
    const preguntaEl = document.getElementById('mc-acls-wizard-pregunta');
    const botonesEl = document.getElementById('mc-acls-wizard-botones');
    const resultadoEl = document.getElementById('mc-acls-wizard-resultado');
    const resetEl = document.getElementById('mc-acls-wizard-reset');
    if (!preguntaEl) return;
    const paso = MC_ACLS_WIZARD[pasoKey];
    preguntaEl.textContent = paso.pregunta;
    resultadoEl.style.display = 'none';
    resetEl.style.display = 'none';
    botonesEl.innerHTML = '';
    ['si', 'no'].forEach(resp => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opcion';
        btn.style.flex = '1';
        btn.textContent = resp === 'si' ? 'Sí' : 'No';
        btn.addEventListener('click', () => {
            const next = paso[resp];
            if (typeof next === 'string') {
                renderAclsWizard(next);
            } else {
                botonesEl.innerHTML = '';
                resultadoEl.style.display = 'block';
                resultadoEl.className = `result-box ${next.estado}`;
                resultadoEl.style.textAlign = 'left';
                resultadoEl.innerHTML = `<strong>${next.final}</strong>`;
                resetEl.style.display = 'inline-block';
            }
        });
        botonesEl.appendChild(btn);
    });
}
function initAclsWizard() {
    const preguntaEl = document.getElementById('mc-acls-wizard-pregunta');
    if (!preguntaEl) return;
    renderAclsWizard('inicio');
    document.getElementById('mc-acls-wizard-reset').addEventListener('click', () => renderAclsWizard('inicio'));
}

// Ficha XVIII — asistente paso a paso del manejo escalonado de la TAM
// (mismo patrón Sí/No que renderAclsWizard).
const MC_MAT_WIZARD = {
    inicio: {
        pregunta: 'Corrige hipomagnesemia/hipopotasemia (magnesio antes que potasio si coexisten) e inicia magnesio empírico IV incluso con nivel sérico normal: 2 g MgSO₄ en 50 mL salino en 15 min, luego 6 g en 500 mL en 6h. ¿Persiste la TAM tras el magnesio?',
        si: 'farmaco',
        no: { estado: 'tfg-estado-ok', final: 'Éxito con corrección electrolítica + magnesio empírico — 88% de conversión a ritmo sinusal en el estudio de referencia, independiente del nivel sérico de magnesio.' },
    },
    farmaco: {
        pregunta: 'TAM persiste tras el magnesio empírico. ¿Tiene el paciente EPOC?',
        si: { estado: 'tfg-estado-warn', final: 'Verapamilo 0,25-5 mg IV en 2 min, repetible cada 15-30 min hasta 20 mg total — &lt;50% de éxito de conversión, pero puede frenar la frecuencia ventricular. Inotrópico negativo potente, no recomendado en HFrEF.' },
        no: { estado: 'tfg-estado-ok', final: 'Metoprolol (Tabla 19.1) — 80% de éxito de conversión a ritmo sinusal.' },
    },
};
function renderMatWizard(pasoKey) {
    const preguntaEl = document.getElementById('mc-mat-wizard-pregunta');
    const botonesEl = document.getElementById('mc-mat-wizard-botones');
    const resultadoEl = document.getElementById('mc-mat-wizard-resultado');
    const resetEl = document.getElementById('mc-mat-wizard-reset');
    if (!preguntaEl) return;
    const paso = MC_MAT_WIZARD[pasoKey];
    preguntaEl.textContent = paso.pregunta;
    resultadoEl.style.display = 'none';
    resetEl.style.display = 'none';
    botonesEl.innerHTML = '';
    ['si', 'no'].forEach(resp => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opcion';
        btn.style.flex = '1';
        btn.textContent = resp === 'si' ? 'Sí' : 'No';
        btn.addEventListener('click', () => {
            const next = paso[resp];
            if (typeof next === 'string') {
                renderMatWizard(next);
            } else {
                botonesEl.innerHTML = '';
                resultadoEl.style.display = 'block';
                resultadoEl.className = `result-box ${next.estado}`;
                resultadoEl.style.textAlign = 'left';
                resultadoEl.innerHTML = `<strong>${next.final}</strong>`;
                resetEl.style.display = 'inline-block';
            }
        });
        botonesEl.appendChild(btn);
    });
}
function initMatWizard() {
    const preguntaEl = document.getElementById('mc-mat-wizard-pregunta');
    if (!preguntaEl) return;
    renderMatWizard('inicio');
    document.getElementById('mc-mat-wizard-reset').addEventListener('click', () => renderMatWizard('inicio'));
}

// Checklist puntuable de predictores de mal pronóstico (Ficha XXIV),
// Tabla 21.5 — mismo patrón que el checklist DRESS de Fisiopatología UCI.
function calcPronostico() {
    const checks = document.querySelectorAll('.mc-pronostico-check');
    const resultado = document.getElementById('mc-pronostico-resultado');
    if (!resultado || checks.length === 0) return;
    const marcados = Array.from(checks).filter(c => c.checked).length;
    if (marcados === 0) {
        resultado.className = 'result-box';
        resultado.innerHTML = '<span style="color:var(--text-muted);">Marca los criterios presentes (Tabla 21.5) — cualquiera de los 7, en su momento de evaluación correcto, predice mal resultado con alto grado de certeza.</span>';
        return;
    }
    resultado.className = 'result-box tfg-estado-danger';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${marcados} de 7 criterios presentes.</strong><p style="font-size:0.85rem; margin-top:6px;">Cada uno de estos 7 predictores, aislado, ya se asocia a mal resultado neurológico con alto grado de certeza — no es necesario que se acumulen varios. Verifica siempre que se haya respetado el momento de evaluación de cada criterio (día 2 o día 4 según el hallazgo) antes de usarlo con fines pronósticos.</p>`;
}
function initPronostico() {
    const resultado = document.getElementById('mc-pronostico-resultado');
    if (!resultado) return;
    document.querySelectorAll('.mc-pronostico-check').forEach(c => c.addEventListener('change', calcPronostico));
    calcPronostico();
}

// Intérprete de ETCO₂ a los 20 minutos (Ficha XXIII), umbral 10-15 mmHg.
function calcEtco2() {
    const input = document.getElementById('mc-etco2-20min');
    const resultado = document.getElementById('mc-etco2-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    let etco2 = Number(input.value);
    if (etco2 < 0) { etco2 = 0; input.value = 0; }

    let estado, texto;
    if (etco2 < 10) {
        estado = 'tfg-estado-danger';
        texto = 'Por debajo de 10 mmHg — reanimación exitosa improbable a los 20 min de RCP.';
    } else if (etco2 <= 15) {
        estado = 'tfg-estado-warn';
        texto = 'Zona límite (10-15 mmHg) — la fuente cita ambos umbrales (15 mmHg en un estudio, 10 mmHg en otro) sin un único corte consensuado. Valora la trayectoria (¿sube o baja?, ver Fig. 21.4) junto al resto del cuadro.';
    } else {
        estado = 'tfg-estado-ok';
        texto = 'Por encima de 15 mmHg — compatible con RCE probable/reanimación con más opciones. Continuar la reanimación hasta 1½ horas se ha asociado a resultados favorables cuando el ETCO₂ se mantiene por encima de este nivel.';
    }
    resultado.style.display = 'block';
    resultado.className = `result-box ${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${etco2} mmHg</strong><p style="font-size:0.85rem; margin-top:6px;">${texto}</p>`;
}
function initEtco2() {
    const input = document.getElementById('mc-etco2-20min');
    if (!input) return;
    input.addEventListener('input', calcEtco2);
    calcEtco2();
}

// Ficha IV — calculadora de volumen de reanimación asanguínea, Tabla 15.4.
function calcVolumenReanimacion() {
    const pesoEl = document.getElementById('mc-vr-peso');
    const sexoEl = document.getElementById('mc-vr-sexo');
    const perdidaEl = document.getElementById('mc-vr-perdida');
    const fluidoEl = document.getElementById('mc-vr-fluido');
    const resultado = document.getElementById('mc-vr-resultado');
    if (!pesoEl || !sexoEl || !perdidaEl || !fluidoEl || !resultado) return;
    if (pesoEl.value === '' || sexoEl.value === '' || perdidaEl.value === '' || fluidoEl.value === '') { resultado.style.display = 'none'; return; }
    const peso = Number(pesoEl.value);
    let perdida = Number(perdidaEl.value);
    if (peso <= 0) { resultado.style.display = 'none'; return; }
    if (perdida < 0) { perdida = 0; perdidaEl.value = 0; }
    if (perdida > 100) { perdida = 100; perdidaEl.value = 100; }

    const vp = peso * (sexoEl.value === 'hombre' ? 40 : 36);
    const dvp = vp * (perdida / 100);
    const factor = fluidoEl.value === 'cristaloide' ? 3 : 1;
    const vr = dvp * factor;

    resultado.style.display = 'block';
    resultado.className = 'result-box';
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>Volumen de reanimación ≈ ${vr.toFixed(0)} mL</strong><p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">VP ≈ ${vp.toFixed(0)} mL · DVP ≈ ${dvp.toFixed(0)} mL · factor ×${factor} (${fluidoEl.value}).</p>`;
}
function initVolumenReanimacion() {
    const resultado = document.getElementById('mc-vr-resultado');
    if (!resultado) return;
    ['mc-vr-peso', 'mc-vr-sexo', 'mc-vr-perdida', 'mc-vr-fluido'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calcVolumenReanimacion);
        document.getElementById(id)?.addEventListener('change', calcVolumenReanimacion);
    });
    calcVolumenReanimacion();
}

// Ficha VII — semáforo "¿estoy en objetivo?" contra la Tabla 16.2.
function calcObjetivosCardiogenico() {
    const campos = [
        { id: 'mc-obj-pcp', nombre: 'PCP', unidad: 'mmHg', ok: v => v >= 19 && v <= 20 },
        { id: 'mc-obj-ic', nombre: 'Índice cardíaco', unidad: 'L/min/m²', ok: v => v >= 2.5 },
        { id: 'mc-obj-irvs', nombre: 'IRVS', unidad: 'unidades Wood', ok: v => v >= 25 && v <= 30 },
        { id: 'mc-obj-pam', nombre: 'PAM', unidad: 'mmHg', ok: v => v >= 65 },
        { id: 'mc-obj-gap', nombre: 'Gap de PCO₂', unidad: 'mmHg', ok: v => v < 6 },
        { id: 'mc-obj-diuresis', nombre: 'Diuresis', unidad: 'mL/kg/h', ok: v => v > 0.5 },
        { id: 'mc-obj-svo2', nombre: 'SvO₂', unidad: '%', ok: v => v > 50 },
        { id: 'mc-obj-lactato', nombre: 'Lactato', unidad: 'mmol/l', ok: v => v < 2 },
    ];
    const resultado = document.getElementById('mc-objetivos-resultado');
    if (!resultado) return;
    const rellenos = campos.filter(c => document.getElementById(c.id)?.value !== '');
    if (rellenos.length === 0) { resultado.style.display = 'none'; return; }

    const evaluados = rellenos.map(c => {
        const valor = Number(document.getElementById(c.id).value);
        return { ...c, valor, ok: c.ok(valor) };
    });
    const enObjetivo = evaluados.filter(c => c.ok).length;
    const nivel = enObjetivo === evaluados.length ? 'ok' : enObjetivo === 0 ? 'danger' : 'warn';
    resultado.style.display = 'block';
    resultado.className = `result-box tfg-estado-${nivel}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${enObjetivo}/${evaluados.length} objetivos alcanzados</strong><ul style="margin:6px 0 0; padding-left:18px; font-size:0.85rem;">${evaluados.map(c => `<li>${c.ok ? '✅' : '❌'} ${c.nombre}: ${c.valor} ${c.unidad}</li>`).join('')}</ul>`;
}
function initObjetivosCardiogenico() {
    const resultado = document.getElementById('mc-objetivos-resultado');
    if (!resultado) return;
    ['mc-obj-pcp', 'mc-obj-ic', 'mc-obj-irvs', 'mc-obj-pam', 'mc-obj-gap', 'mc-obj-diuresis', 'mc-obj-svo2', 'mc-obj-lactato'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calcObjetivosCardiogenico);
    });
}

// Ficha XXIV — estado de la temperatura respecto al objetivo del TTM
// (Tabla 21.3: objetivo ≤37,5°C, disparo de enfriamiento activo si &gt;37,7°C).
function calcTtmTemp() {
    const input = document.getElementById('mc-ttm-temp');
    const resultado = document.getElementById('mc-ttm-resultado');
    if (!input || !resultado) return;
    if (input.value === '') { resultado.style.display = 'none'; return; }
    const temp = Number(input.value);

    let estado, mensaje;
    if (temp > 37.7) { estado = 'danger'; mensaje = 'Por encima de 37,7°C — iniciar enfriamiento activo, objetivo 37,5°C.'; }
    else if (temp > 37.5) { estado = 'warn'; mensaje = 'Entre 37,5 y 37,7°C — reforzar medidas (paracetamol, reducir temperatura ambiente) antes de llegar al disparo de enfriamiento activo.'; }
    else if (temp < 32) { estado = 'warn'; mensaje = 'Por debajo de 32°C — hipotermia más profunda de lo recomendado; considerar recalentamiento controlado.'; }
    else { estado = 'ok'; mensaje = temp < 36 ? 'Hipotermia leve espontánea (32-36°C) — no recalentar activamente.' : 'Dentro del objetivo (≤37,5°C).'; }

    resultado.style.display = 'block';
    resultado.className = `result-box tfg-estado-${estado}`;
    resultado.style.textAlign = 'left';
    resultado.innerHTML = `<strong>${temp}°C</strong><p style="font-size:0.85rem; margin-top:6px;">${mensaje}</p>`;
}
function initTtmTemp() {
    const input = document.getElementById('mc-ttm-temp');
    if (!input) return;
    input.addEventListener('input', calcTtmTemp);
    calcTtmTemp();
}

export function init() {
    initCorkboard('merino-cardio-corkboard', 'panel-merino-cardio-tabs');
    initTipoShock();
    initClaseHemorragia();
    initTeg();
    initDispositivoSelector();
    initLinkASeptico();
    initLinkATabla211();
    initLinkAIcTipos();
    initLinkAScaTratamiento();
    initCha2ds2Vasc();
    initQtc();
    initPamGauge();
    initVasopresorEscenario();
    initTss();
    initCardiogenicoPerfil();
    initFurosemidaWizard();
    initDiureticoEquiv();
    initTroponinaDelta();
    initPuertaBalon();
    initDiseccionFarmaco();
    initFaFarmaco();
    initAclsWizard();
    initPronostico();
    initEtco2();
    initVolumenReanimacion();
    initObjetivosCardiogenico();
    initMatWizard();
    initTtmTemp();
}
