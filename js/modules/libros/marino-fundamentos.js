// Libros · Marino Fundamentos — The ICU Book (Marino PL, 5.ª ed.), caps. 1-11:
// acceso vascular, prácticas comunes, monitorización y fluidoterapia.
// Cuaderno de campo + calculadoras y simuladores de cada ficha. Todas las
// cifras salen de las tablas/ecuaciones citadas en el propio texto de la
// ficha; lo que no es de la fuente (p. ej. el valor de VO₂ que usa el
// simulador de la Figura 9.3) se marca como ilustrativo en la propia UI.
import { initCorkboard } from '../../core/corkboard.js';
import { clamp } from '../../core/ui.js';

const $ = id => document.getElementById(id);
const num = el => (el && el.value !== '' ? Number(el.value) : null);
const fmt = (v, d = 1) => v.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

function pintar(box, estado, html) {
    if (!box) return;
    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = html;
}
function ocultar(box) { if (box) box.style.display = 'none'; }
function enlazar(ids, fn) {
    ids.forEach(id => { const el = $(id); el?.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', fn); });
    fn();
}

// ---- Cap. 1 — French (Ecuación 1.1 y Tabla 1.1) -------------------------
const TABLA_1_1 = { 1: ['27 G', '0,4'], 3: ['20 G', '0,9'], 4: ['18 G', '1,2'], 5: ['16 G', '1,7'], 7: ['13 G', '2,4'], 9: ['11 G', '3,2'] };
function calcFrench() {
    const fr = num($('mar-french-input')), box = $('mar-french-resultado');
    if (fr === null || fr <= 0) return ocultar(box);
    const g = TABLA_1_1[fr];
    pintar(box, 'ok', `<strong>${fmt(fr, fr % 1 ? 1 : 0)} Fr ≈ ${fmt(fr * 0.33, 2)} mm</strong> de diámetro externo.` +
        (g ? ` La Tabla 1.1 lo da como <strong>${g[0]}</strong> y ${g[1]} mm.` : ' La Tabla 1.1 no da su gauge equivalente.'));
}

// ---- Cap. 4 — ¿profilaxis de la úlcera de estrés? (Tabla 4.2) ----------
function calcUlcera() {
    const box = $('mar-ulcera-resultado');
    const marcados = [...document.querySelectorAll('.mar-ulcera-check:checked')].map(c => c.dataset.nivel);
    const mayor = marcados.filter(n => n === 'maximo' || n === 'alto').length;
    const mod = marcados.filter(n => n === 'moderado').length;
    if (mayor || mod >= 2) {
        const motivo = mayor ? 'un factor de riesgo máximo o alto' : `${mod} factores de riesgo moderados`;
        pintar(box, 'warn', `<strong>Profilaxis indicada</strong>: hay ${motivo}. Vuelve a valorarla cuando reciba nutrición enteral completa.`);
    } else {
        pintar(box, 'ok', `<strong>Sin indicación de profilaxis</strong>${mod === 1 ? ' (solo 1 factor moderado)' : ''}. Los factores de riesgo bajo no cambian la decisión.`);
    }
}

// ---- Cap. 5 — dosis de tromboprofilaxis (Tablas 5.2 y 5.3) -------------
function calcProfilaxis() {
    const f = $('mar-profilaxis-farmaco')?.value, clcr = num($('mar-profilaxis-clcr')), imc = num($('mar-profilaxis-imc'));
    const box = $('mar-profilaxis-resultado');
    if (!f || clcr === null || imc === null) return ocultar(box);
    const obeso = imc >= 40;
    let estado = 'ok', txt = '';
    switch (f) {
        case 'hnf': txt = obeso ? '<strong>7.500 U cada 8 h</strong> (obesidad, IMC ≥40).' : '<strong>5.000 U cada 8-12 h</strong>. Sin ajuste renal.'; break;
        case 'enoxaparina':
            if (clcr < 30) { estado = 'warn'; txt = '<strong>30 mg al día</strong>, o usar heparina no fraccionada (ClCr &lt;30).'; }
            else txt = obeso ? '<strong>40 mg cada 12 h</strong> (obesidad, IMC ≥40).' : '<strong>40 mg al día o 30 mg cada 12 h</strong>.';
            if (clcr < 30 && obeso) txt += ' La tabla no da una pauta para obesidad e insuficiencia renal a la vez.';
            break;
        case 'dalteparina':
            if (obeso) { estado = 'warn'; txt = '<strong>No bien estudiada</strong> en la obesidad (IMC ≥40).'; }
            else txt = '<strong>2.500-5.000 U al día</strong>. Sin ajuste renal.';
            break;
        case 'fondaparinux':
            if (clcr < 20) { estado = 'danger'; txt = '<strong>No usar</strong> (ClCr &lt;20, y también &lt;30 según la tabla).'; }
            else if (clcr < 35) { estado = 'warn'; txt = `<strong>Las dos cifras de la fuente discrepan aquí</strong> (ClCr ${clcr}): la Tabla 5.2 no da 1,5 mg por debajo de 35 y prohíbe por debajo de 30; el texto da 1,5 mg al día entre 20 y 50.`; }
            else if (clcr <= 50) { estado = 'warn'; txt = '<strong>1,5 mg al día</strong> (ClCr 35-50).'; }
            else txt = '<strong>2,5 mg al día</strong>.';
            if (obeso) txt += ' En la obesidad, la tabla no da recomendaciones.';
            break;
        case 'dabigatran':
            if (clcr < 30) { estado = 'danger'; txt = '<strong>No usar</strong> (ClCr &lt;30).'; }
            else if (obeso) { estado = 'danger'; txt = '<strong>No usar</strong> si IMC ≥40 o peso &gt;120 kg.'; }
            else txt = '<strong>110 mg al inicio, luego 220 mg al día</strong>. No usar si el peso es &gt;120 kg.';
            break;
        case 'apixaban':
            txt = clcr < 15 ? '<strong>No usar</strong> (ClCr &lt;15).' : '<strong>2,5 mg cada 12 h</strong>; dosis estándar también en la obesidad.';
            if (clcr < 15) estado = 'danger';
            break;
        case 'rivaroxaban':
            txt = clcr < 15 ? '<strong>No usar</strong> (ClCr &lt;15).' : '<strong>10 mg al día</strong>; dosis estándar también en la obesidad.';
            if (clcr < 15) estado = 'danger';
            break;
        case 'warfarina': txt = '<strong>2,5-5 mg al día</strong>, ajustando a un INR de 1,5-2,5. Sin ajuste renal ni ajuste conocido en la obesidad.'; break;
    }
    pintar(box, estado, txt);
}

// ---- Cap. 6 — BPS, RASS y propofol --------------------------------------
function calcBps() {
    const total = [...document.querySelectorAll('.mar-bps-item')].reduce((s, el) => s + Number(el.value), 0);
    pintar($('mar-bps-resultado'), total >= 6 ? 'danger' : 'ok',
        `<strong>BPS ${total}/12</strong> — ${total >= 6 ? 'dolor inaceptable (≥6): tratarlo.' : 'por debajo del corte de dolor inaceptable (6).'}`);
}

function calcRass() {
    const v = Number($('mar-rass-select')?.value);
    let estado, txt;
    if (v === 0) { estado = 'ok'; txt = 'Es el objetivo óptimo.'; }
    else if (v < 0 && v >= -2) { estado = 'ok'; txt = 'Sedación ligera: el objetivo si está en perfusión de sedantes.'; }
    else if (v < -2) { estado = v <= -4 ? 'danger' : 'warn'; txt = 'Más profundo de lo recomendado: bajar la sedación hasta −1 a −2.'; }
    else { estado = v >= 3 ? 'danger' : 'warn'; txt = 'Agitación: buscar y tratar la causa (dolor, delirio) antes de sedar más.'; }
    pintar($('mar-rass-resultado'), estado, `<strong>RASS ${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}</strong> — ${txt}`);
}

function calcPropofol() {
    const mlh = num($('mar-propofol-mlh')), peso = num($('mar-propofol-peso')), horas = num($('mar-propofol-horas'));
    const box = $('mar-propofol-resultado');
    if (mlh === null || peso === null || peso <= 0) return ocultar(box);
    const mgkgh = mlh * 10 / peso;            // propofol al 1% = 10 mg/mL
    const ugkgmin = mgkgh * 1000 / 60;
    const kcal = mlh * 24;                     // 1 kcal/mL
    const alta = ugkgmin > 80 || mgkgh > 5;
    const largo = horas !== null && horas > 48;
    let estado = 'ok', aviso = 'Por debajo de los umbrales descritos del síndrome de infusión.';
    if (alta && largo) { estado = 'danger'; aviso = 'Dosis alta durante más de 48 h: es el contexto típico del síndrome de infusión de propofol.'; }
    else if (alta) { estado = 'warn'; aviso = 'Dosis alta (&gt;80 µg/kg/min o &gt;5 mg/kg/h); el riesgo típico aparece si se mantiene más de 48 h.'; }
    else if (ugkgmin >= 36) { estado = 'warn'; aviso = 'Por debajo de los umbrales típicos, pero se ha descrito el síndrome con 36 µg/kg/min.'; }
    pintar(box, estado, `<strong>${fmt(ugkgmin, 0)} µg/kg/min</strong> (${fmt(mgkgh, 1)} mg/kg/h). ${aviso}<br>Aporta unas <strong>${fmt(kcal, 0)} kcal/día</strong> (1 kcal/mL), que cuentan en la nutrición.`);
}

// ---- Cap. 7 — oximetría dual -------------------------------------------
function calcDual() {
    const spo2 = num($('mar-dual-spo2')), svo2 = num($('mar-dual-svo2')), box = $('mar-dual-resultado');
    if (spo2 === null || svo2 === null) return ocultar(box);
    if (svo2 > spo2) return pintar(box, 'danger', '⚠️ La saturación venosa no puede ser mayor que la arterial: revisa los datos.');
    const d = spo2 - svo2;
    let estado = 'ok', txt = 'Sin aumento de la extracción de O₂.';
    if (d >= 50) { estado = 'danger'; txt = 'Amenaza para el metabolismo aerobio.'; }
    else if (d > 25) { estado = 'warn'; txt = 'Aporte reducido respecto al consumo, sin comprometer todavía el metabolismo aerobio.'; }
    pintar(box, estado, `<strong>SpO₂ − SvO₂ = ${fmt(d, 0)}%</strong> (≈ extracción de O₂). ${txt}`);
}

// ---- Cap. 8 — índices del catéter de arteria pulmonar (Tabla 8.1) ------
const RANGO_8_1 = {
    ic: [2.4, 4.0, 'L/min/m²', 'Índice cardíaco'], is: [20, 40, 'mL/m²', 'Índice sistólico'],
    irvs: [25, 30, 'U Wood', 'IRVS'], irvp: [1, 2, 'U Wood', 'IRVP'],
    do2: [520, 570, 'mL/min/m²', 'Índice de aporte de O₂'], vo2: [110, 160, 'mL/min/m²', 'Índice de consumo de O₂'],
    o2er: [0.2, 0.3, '', 'Extracción de O₂'],
};
function calcHemo() {
    const v = id => num($(`mar-hemo-${id}`));
    const box = $('mar-hemo-resultado');
    const talla = v('talla'), peso = v('peso'), gc = v('gc'), fc = v('fc'), pam = v('pam'), pvc = v('pvc');
    const pap = v('pap'), pawp = v('pawp'), hb = v('hb'), sao2 = v('sao2'), svo2 = v('svo2');
    if (talla === null || peso === null || gc === null) return pintar(box, 'warn', 'Rellena al menos talla, peso y gasto cardíaco.');
    const sc = (talla + peso - 60) / 100;
    if (sc <= 0) return pintar(box, 'danger', 'Superficie corporal no válida.');
    const ic = gc / sc;
    const res = { ic };
    if (fc) res.is = ic / fc * 1000;
    if (pam !== null && pvc !== null) res.irvs = (pam - pvc) / ic;
    if (pap !== null && pawp !== null) res.irvp = (pap - pawp) / ic;
    if (hb !== null && sao2 !== null) res.do2 = ic * 1.34 * hb * (sao2 / 100) * 10;
    if (hb !== null && sao2 !== null && svo2 !== null) {
        res.vo2 = ic * 1.34 * hb * ((sao2 - svo2) / 100) * 10;
        res.o2er = (sao2 - svo2) / sao2;
    }
    let peor = 'ok';
    const filas = Object.entries(res).map(([k, val]) => {
        const [lo, hi, u, nombre] = RANGO_8_1[k];
        const fuera = val < lo || val > hi;
        if (fuera) peor = 'warn';
        const d = k === 'o2er' ? 2 : (k === 'ic' ? 2 : (val >= 100 ? 0 : 1));
        return `<li>${nombre}: <strong>${fmt(val, d)}${u ? ' ' + u : ''}</strong> ${fuera ? '⚠️' : '✅'} <span style="color:var(--text-muted);">(${fmt(lo, k === 'o2er' || k === 'ic' ? 1 : 0)}-${fmt(hi, k === 'o2er' || k === 'ic' ? 1 : 0)})</span></li>`;
    });
    const avisos = [];
    if (pam !== null && pvc !== null && pvc >= pam) { peor = 'danger'; avisos.push('PVC ≥ PAM: combinación no fisiológica.'); }
    if (pap !== null && pawp !== null && pawp >= pap) { peor = 'danger'; avisos.push('Enclavamiento ≥ PAP media: combinación no fisiológica.'); }
    if (sao2 !== null && svo2 !== null && svo2 > sao2) { peor = 'danger'; avisos.push('SvO₂ &gt; SaO₂: no es posible.'); }
    pintar(box, peor, `${avisos.length ? `<p>⚠️ ${avisos.join(' ')}</p>` : ''}<p>Superficie corporal <strong>${fmt(sc, 2)} m²</strong></p><ul style="margin:6px 0 0; padding-left:18px;">${filas.join('')}</ul>`);
}

// ---- Cap. 9 — CaO₂ y extracción -----------------------------------------
function calcCao2() {
    const hb = num($('mar-cao2-hb')), sao2 = num($('mar-cao2-sao2')), pao2 = num($('mar-cao2-pao2')), box = $('mar-cao2-resultado');
    if (hb === null || sao2 === null || pao2 === null) return ocultar(box);
    const unido = 1.34 * hb * sao2 / 100, disuelto = 0.003 * pao2, total = unido + disuelto;
    const pct = total / 20 * 100;
    pintar(box, pct < 75 ? 'danger' : pct < 90 ? 'warn' : 'ok',
        `<strong>CaO₂ = ${fmt(total, 1)} mL/dL</strong> (unido a la Hb ${fmt(unido, 1)} + disuelto ${fmt(disuelto, 2)}; el disuelto es el ${fmt(disuelto / total * 100, 1)}%). Frente a los 20 mL/dL normales: <strong>${fmt(pct, 0)}%</strong>.`);
}

function calcExtraccion() {
    const sao2 = num($('mar-ext-sao2')), svo2 = num($('mar-ext-svo2')), box = $('mar-ext-resultado');
    if (sao2 === null || svo2 === null) return ocultar(box);
    if (svo2 > sao2) return pintar(box, 'danger', '⚠️ La SvO₂ no puede ser mayor que la SaO₂: revisa los datos.');
    const d = sao2 - svo2;
    let estado, txt;
    if (d >= 50) { estado = 'danger'; txt = 'Oxigenación tisular amenazada (≥50%).'; }
    else if (d > 30) { estado = 'warn'; txt = 'Extracción aumentada: el aporte ha bajado respecto al consumo, pero aún compensa.'; }
    else if (d >= 20) { estado = 'ok'; txt = 'Normal (20-30%).'; }
    else { estado = 'warn'; txt = 'Por debajo del 20%: sugiere un defecto de utilización del O₂ (p. ej. en la sepsis).'; }
    pintar(box, estado, `<strong>SaO₂ − SvO₂ = ${fmt(d, 0)}%</strong>. ${txt}`);
}

// ---- Cap. 11 — déficit de plasma, perfusión, VVS y respuesta -----------
function calcDeficit() {
    const peso = num($('mar-def-peso')), pct = num($('mar-def-pct')), box = $('mar-def-resultado');
    if (peso === null || pct === null || peso <= 0) return ocultar(box);
    const mlkg = $('mar-def-sexo')?.value === 'm' ? 36 : 40;
    const plasma = peso * mlkg, deficit = plasma * pct / 100;
    const cristaloide = deficit / 0.2, intersticio = cristaloide * 0.8;
    pintar(box, 'warn', `Volumen plasmático ≈ <strong>${fmt(plasma / 1000, 2)} L</strong>; déficit del ${pct}% = <strong>${fmt(deficit, 0)} mL</strong>.<br>Con cristaloide (20% en plasma): <strong>${fmt(cristaloide / 1000, 2)} L</strong>, de los que <strong>${fmt(intersticio / 1000, 2)} L van al intersticio</strong>.<br><span style="color:var(--text-muted);">Con albúmina al 5% (700 mL de plasma por litro, Figura 10.1) bastarían unos ${fmt(deficit / 0.7, 0)} mL.</span>`);
}

function calcPerfusion() {
    const scv = num($('mar-perf-scvo2')), pv = num($('mar-perf-pvco2')), pa = num($('mar-perf-paco2'));
    const ctx = $('mar-perf-contexto')?.value, box = $('mar-perf-resultado');
    const partes = [];
    let estado = 'ok';
    const sube = e => { const o = { ok: 0, warn: 1, danger: 2 }; if (o[e] > o[estado]) estado = e; };
    if (scv !== null) {
        if (scv <= 50) { sube('danger'); partes.push(`ScvO₂ ${scv}%: oxigenación tisular amenazada (≤50%). Corregir ya y medir el lactato.`); }
        else if (scv < 65) { sube('warn'); partes.push(`ScvO₂ ${scv}%: aporte de O₂ bajo (&lt;65%). No es por fuerza hipoperfusión: descarta la anemia.`); }
        else if (scv > 80) { sube(ctx === 'septico' ? 'warn' : 'ok'); partes.push(`ScvO₂ ${scv}%: más alta de lo esperado${ctx === 'septico' ? '; en el shock séptico sugiere un defecto de utilización del O₂: mira el gap de PCO₂' : ''}.`); }
        else partes.push(`ScvO₂ ${scv}%: dentro de lo normal (65-75%, hasta 80%).`);
        if (ctx === 'anemia' && scv < 70) partes.push('Con anemia, una ScvO₂ &lt;70% se ha propuesto como indicación de transfusión.');
    }
    if (pv !== null && pa !== null) {
        const gap = pv - pa;
        if (gap < 0) { sube('danger'); partes.push('⚠️ La PCO₂ venosa no puede ser menor que la arterial: revisa los datos.'); }
        else if (gap > 6) { sube('danger'); partes.push(`Gap de PCO₂ ${fmt(gap, 0)} mmHg: hipoperfusión tisular (&gt;6).`); }
        else if (gap > 5) { sube('warn'); partes.push(`Gap de PCO₂ ${fmt(gap, 0)} mmHg: entre el rango normal (2-5) y el corte de hipoperfusión (&gt;6).`); }
        else partes.push(`Gap de PCO₂ ${fmt(gap, 0)} mmHg: normal (2-5). Recuerda que no descarta una oxigenación tisular alterada.`);
    }
    if (!partes.length) return ocultar(box);
    pintar(box, estado, partes.map(p => `<p style="margin:4px 0;">${p}</p>`).join(''));
}

function calcVvs() {
    const max = num($('mar-vvs-max')), min = num($('mar-vvs-min')), media = num($('mar-vvs-media')), box = $('mar-vvs-resultado');
    if (max === null || min === null || media === null || media <= 0) return ocultar(box);
    if (min > max) return pintar(box, 'danger', '⚠️ El VS mínimo no puede ser mayor que el máximo.');
    const vvs = (max - min) / media * 100;
    if ($('mar-vvs-limites')?.checked) return pintar(box, 'warn', `VVS ${fmt(vvs, 0)}%, pero <strong>no es valorable</strong>: exige ausencia de esfuerzos respiratorios y de arritmias.`);
    pintar(box, vvs >= 15 ? 'ok' : 'warn', `<strong>VVS = ${fmt(vvs, 0)}%</strong> — ${vvs >= 15 ? 'probable respuesta a fluidos (≥15% la identifica en el 80%).' : 'por debajo del 15%: no predice respuesta.'}`);
}

function calcRespuesta() {
    const vs0 = num($('mar-resp-vs0')), vs1 = num($('mar-resp-vs1')), box = $('mar-resp-resultado');
    if (vs0 === null || vs1 === null || vs0 <= 0) return ocultar(box);
    const epp = $('mar-resp-prueba')?.value === 'epp';
    const cambio = (vs1 - vs0) / vs0 * 100;
    const responde = epp ? cambio >= 10 : cambio > 10;
    let html = `<strong>VS ${cambio >= 0 ? '+' : ''}${fmt(cambio, 0)}%</strong> — ${responde ? 'responde a fluidos' : 'no responde'} (${epp ? '≥10% tras la EPP' : '&gt;10% tras la sobrecarga'}).`;
    let estado = responde ? 'ok' : 'warn';
    if (epp && responde && $('mar-resp-taqui')?.checked) { estado = 'warn'; html += ' Pero con taquicardia, sospecha <strong>dolor</strong>: la EPP no debe causarla.'; }
    if (epp && !responde && $('mar-resp-pia')?.checked) html += ' Con presión intraabdominal alta, los <strong>falsos negativos</strong> son frecuentes.';
    if (!epp) html += ' El efecto se disipa a los 10 min.';
    pintar(box, estado, html);
}

// ---- Simuladores (gráficos SVG) -----------------------------------------
function simBase(cont, titulo, subtitulo) {
    cont.className = 'agua-simulador';
    cont.innerHTML = `<h4 style="color: var(--accent-blue);">${titulo}</h4><p class="subtitle">${subtitulo}</p>`;
}

// Figura 9.3: el VO₂ se mantiene subiendo la extracción hasta el 50%; a
// partir de ahí depende del aporte. VO₂ de 130 mL/min/m² (dentro del rango
// normal de la Tabla 9.2) y SaO₂ 98%: valores elegidos, ilustrativos.
function simDo2Vo2() {
    const cont = $('mar-do2-vo2-sim');
    if (!cont) return;
    simBase(cont, '📉 Aporte y consumo de O₂ (Figura 9.3)', 'Baja el aporte y mira cuándo el consumo deja de ser constante. Consumo fijado en 130 mL/min/m² y SaO₂ en 98%: cifras ilustrativas, dentro de los rangos normales de la Tabla 9.2.');
    const VO2 = 130, SAO2 = 98, X0 = 40, X1 = 320, Y0 = 150, Y1 = 20, MAXD = 800, MAXV = 160;
    const x = d => X0 + d / MAXD * (X1 - X0), y = v => Y0 - v / MAXV * (Y0 - Y1);
    const vo2De = d => Math.min(VO2, d * 0.5);
    let path = '';
    for (let d = 0; d <= MAXD; d += 10) path += `${d ? 'L' : 'M'}${x(d).toFixed(1)},${y(vo2De(d)).toFixed(1)}`;
    const crit = VO2 / 0.5;
    cont.insertAdjacentHTML('beforeend', `
        <svg viewBox="0 0 340 180" style="width:100%; max-width:420px; display:block; margin:6px auto;" role="img" aria-label="Curva de consumo frente a aporte de oxígeno">
            <line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="var(--text-muted)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" stroke="var(--text-muted)"/>
            <rect x="${X0}" y="${Y1}" width="${x(crit) - X0}" height="${Y0 - Y1}" fill="var(--accent-red)" opacity="0.08"/>
            <line x1="${x(crit)}" y1="${Y1}" x2="${x(crit)}" y2="${Y0}" stroke="var(--accent-red)" stroke-dasharray="4 3"/>
            <text x="${x(crit) + 4}" y="${Y1 + 10}" font-size="9" fill="var(--accent-red)">aporte crítico</text>
            <path d="${path}" fill="none" stroke="var(--accent-blue)" stroke-width="2.4"/>
            <circle id="mar-dv-punto" r="5" fill="var(--accent-yellow)" stroke="var(--bg-main)" stroke-width="1.5"/>
            <text x="${(X0 + X1) / 2}" y="174" text-anchor="middle" font-size="10" fill="var(--text-muted)">Aporte de O₂ (mL/min/m²)</text>
            <text x="12" y="${(Y0 + Y1) / 2}" font-size="10" fill="var(--text-muted)" transform="rotate(-90 12 ${(Y0 + Y1) / 2})" text-anchor="middle">Consumo</text>
            ${[0, 200, 400, 600, 800].map(d => `<text x="${x(d)}" y="${Y0 + 12}" font-size="8" text-anchor="middle" fill="var(--text-muted)">${d}</text>`).join('')}
        </svg>
        <div class="form-group"><label for="mar-dv-do2">Aporte de O₂: <strong id="mar-dv-do2-val"></strong> mL/min/m²</label><input type="range" id="mar-dv-do2" min="100" max="800" step="10" value="550"></div>
        <div class="tfg-estado tfg-estado-ok" id="mar-dv-resultado"></div>`);
    const upd = () => {
        const d = Number($('mar-dv-do2').value), v = vo2De(d), er = v / d, svo2 = SAO2 - er * 100;
        $('mar-dv-do2-val').textContent = d;
        const p = $('mar-dv-punto'); p.setAttribute('cx', x(d)); p.setAttribute('cy', y(v));
        const dep = d < crit;
        pintar($('mar-dv-resultado'), dep ? 'danger' : er > 0.3 ? 'warn' : 'ok',
            `Consumo <strong>${fmt(v, 0)}</strong> mL/min/m² · extracción <strong>${fmt(er * 100, 0)}%</strong> · SvO₂ ≈ <strong>${fmt(svo2, 0)}%</strong>. ` +
            (dep ? 'El consumo ya <strong>depende del aporte</strong>: metabolismo limitado por el oxígeno.' : er > 0.3 ? 'La extracción sube para mantener el consumo.' : 'Extracción normal (20-30%).'));
    };
    $('mar-dv-do2').addEventListener('input', upd);
    upd();
}

// Figura 10.1: cuánto de cada fluido queda en el plasma y en el intersticio
// (lo que falta de 1 L de glucosado entra en las células). Se escala en
// proporción al volumen infundido — una simplificación (ilustrativa).
const FLUIDOS_10_1 = {
    glucosado: { nombre: 'Glucosado al 5%', base: 1000, plasma: 100, inter: 250 },
    salino: { nombre: 'Salino al 0,9%', base: 1000, plasma: 275, inter: 825 },
    albumina: { nombre: 'Albúmina al 5%', base: 1000, plasma: 700, inter: 300 },
    hipertonico: { nombre: 'Salino al 7,5%', base: 250, plasma: 535, inter: 700 },
};
function simFluidos() {
    const cont = $('mar-fluido-sim');
    if (!cont) return;
    simBase(cont, '💧 ¿Adónde va lo que infundo?', 'Las cifras de la Figura 10.1, escaladas en proporción al volumen (una simplificación).');
    cont.insertAdjacentHTML('beforeend', `
        <div class="form-group"><label for="mar-fs-fluido">Fluido</label><select id="mar-fs-fluido">${Object.entries(FLUIDOS_10_1).map(([k, f]) => `<option value="${k}"${k === 'salino' ? ' selected' : ''}>${f.nombre}</option>`).join('')}</select></div>
        <div class="form-group"><label for="mar-fs-vol">Volumen infundido: <strong id="mar-fs-vol-val"></strong> mL</label><input type="range" id="mar-fs-vol" min="250" max="3000" step="250" value="1000"></div>
        <div id="mar-fs-barras"></div>
        <div class="tfg-estado tfg-estado-ok" id="mar-fs-resultado"></div>`);
    const upd = () => {
        const f = FLUIDOS_10_1[$('mar-fs-fluido').value], vol = Number($('mar-fs-vol').value), k = vol / f.base;
        const pl = f.plasma * k, it = f.inter * k, cel = Math.max(0, vol - pl - it);
        $('mar-fs-vol-val').textContent = vol;
        const max = Math.max(pl, it, cel, 1);
        const barra = (nombre, val, color) => `<div class="kinetic-row" style="display:block;"><div class="kinetic-label"><span>${nombre}</span><span>${fmt(val, 0)} mL</span></div><div class="kinetic-track"><div class="kinetic-fill" style="width:${clamp(val / max * 100, 0, 100)}%; background:${color};"></div></div></div>`;
        $('mar-fs-barras').innerHTML = barra('Plasma', pl, 'var(--accent-red)') + barra('Intersticio', it, 'var(--accent-blue)') + (cel > 0 ? barra('Dentro de las células', cel, 'var(--accent-purple)') : '');
        const extra = pl + it > vol ? ` Suma más de lo infundido (${fmt(pl + it, 0)} mL): saca agua de las células.` : '';
        pintar($('mar-fs-resultado'), pl / vol >= 0.5 ? 'ok' : 'warn', `De ${vol} mL, quedan <strong>${fmt(pl, 0)} mL en el plasma</strong> (${fmt(pl / vol * 100, 0)}%).${extra}`);
    };
    ['mar-fs-fluido', 'mar-fs-vol'].forEach(id => ['input', 'change'].forEach(ev => $(id).addEventListener(ev, upd)));
    upd();
}

// Figura 11.2: retorno venoso = (Pms − PAD)/Rv con Rv constante. La normal
// usa la Pms de 7 mmHg de los estudios en animales (con ella, +1 mmHg de PAD
// quita 1/7 ≈ 14% del retorno, como dice la fuente); la escala es relativa.
function simRetorno() {
    const cont = $('mar-retorno-sim');
    if (!cont) return;
    simBase(cont, '🚰 La curva de retorno venoso (Figura 11.2)', 'Rv constante y Pms normal de 7 mmHg (la de los estudios en animales). El retorno se da en % del normal con PAD 0. Ilustrativo.');
    const X0 = 40, X1 = 320, Y0 = 150, Y1 = 20, MAXP = 14, MAXR = 200;
    const x = p => X0 + p / MAXP * (X1 - X0), y = r => Y0 - r / MAXR * (Y0 - Y1);
    const rv = (pms, pad) => Math.max(0, (pms - pad) / 7 * 100);
    const curva = (pms, color, dash = '') => `<line x1="${x(0)}" y1="${y(rv(pms, 0))}" x2="${x(pms)}" y2="${y(0)}" stroke="${color}" stroke-width="2" ${dash}/>`;
    cont.insertAdjacentHTML('beforeend', `
        <svg viewBox="0 0 340 180" style="width:100%; max-width:420px; display:block; margin:6px auto;" role="img" aria-label="Curvas de retorno venoso">
            <line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="var(--text-muted)"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}" stroke="var(--text-muted)"/>
            ${curva(7, 'var(--text-muted)', 'stroke-dasharray="4 3"')}
            <g id="mar-rs-curva"></g>
            <circle id="mar-rs-punto" r="5" fill="var(--accent-yellow)" stroke="var(--bg-main)" stroke-width="1.5"/>
            <text x="${(X0 + X1) / 2}" y="174" text-anchor="middle" font-size="10" fill="var(--text-muted)">Presión en la aurícula derecha (mmHg)</text>
            <text x="12" y="${(Y0 + Y1) / 2}" font-size="10" fill="var(--text-muted)" transform="rotate(-90 12 ${(Y0 + Y1) / 2})" text-anchor="middle">Retorno venoso</text>
            ${[0, 2, 4, 6, 8, 10, 12, 14].map(p => `<text x="${x(p)}" y="${Y0 + 12}" font-size="8" text-anchor="middle" fill="var(--text-muted)">${p}</text>`).join('')}
        </svg>
        <div class="form-group"><label for="mar-rs-pms">Pms (volemia): <strong id="mar-rs-pms-val"></strong> mmHg</label><input type="range" id="mar-rs-pms" min="3" max="14" step="0.5" value="7"></div>
        <div class="form-group"><label for="mar-rs-pad">PAD / PVC: <strong id="mar-rs-pad-val"></strong> mmHg</label><input type="range" id="mar-rs-pad" min="0" max="14" step="0.5" value="0"></div>
        <div class="tfg-estado tfg-estado-ok" id="mar-rs-resultado"></div>`);
    const upd = () => {
        const pms = Number($('mar-rs-pms').value), pad = Number($('mar-rs-pad').value), r = rv(pms, pad);
        $('mar-rs-pms-val').textContent = fmt(pms, 1); $('mar-rs-pad-val').textContent = fmt(pad, 1);
        $('mar-rs-curva').innerHTML = curva(pms, 'var(--accent-blue)');
        const p = $('mar-rs-punto'); p.setAttribute('cx', x(Math.min(pad, pms))); p.setAttribute('cy', y(r));
        const vol = pms < 7 ? 'hipovolemia (Pms baja)' : pms > 7 ? 'más volumen (Pms alta)' : 'volemia normal';
        pintar($('mar-rs-resultado'), r === 0 ? 'danger' : r < 60 ? 'warn' : 'ok',
            `Gradiente Pms − PAD = <strong>${fmt(Math.max(0, pms - pad), 1)} mmHg</strong> → retorno <strong>${fmt(r, 0)}%</strong> del normal (${vol}).` +
            (r === 0 ? ' La PAD iguala a la Pms: <strong>no hay retorno venoso</strong>.' : ' Subir la PAD sin subir la Pms solo lo reduce.'));
    };
    ['mar-rs-pms', 'mar-rs-pad'].forEach(id => $(id).addEventListener('input', upd));
    upd();
}

export function init() {
    initCorkboard('marino-fund-corkboard', 'panel-marino-fund-tabs');
    enlazar(['mar-french-input'], calcFrench);
    enlazar([...document.querySelectorAll('.mar-ulcera-check')].map((c, i) => c.id || (c.id = `mar-ulcera-c${i}`)), calcUlcera);
    enlazar(['mar-profilaxis-farmaco', 'mar-profilaxis-clcr', 'mar-profilaxis-imc'], calcProfilaxis);
    enlazar(['mar-bps-cara', 'mar-bps-brazos', 'mar-bps-ventilador'], calcBps);
    enlazar(['mar-rass-select'], calcRass);
    enlazar(['mar-propofol-mlh', 'mar-propofol-peso', 'mar-propofol-horas'], calcPropofol);
    enlazar(['mar-dual-spo2', 'mar-dual-svo2'], calcDual);
    enlazar(['talla', 'peso', 'gc', 'fc', 'pam', 'pvc', 'pap', 'pawp', 'hb', 'sao2', 'svo2'].map(k => `mar-hemo-${k}`), calcHemo);
    enlazar(['mar-cao2-hb', 'mar-cao2-sao2', 'mar-cao2-pao2'], calcCao2);
    enlazar(['mar-ext-sao2', 'mar-ext-svo2'], calcExtraccion);
    enlazar(['mar-def-peso', 'mar-def-sexo', 'mar-def-pct'], calcDeficit);
    enlazar(['mar-perf-scvo2', 'mar-perf-pvco2', 'mar-perf-paco2', 'mar-perf-contexto'], calcPerfusion);
    enlazar(['mar-vvs-max', 'mar-vvs-min', 'mar-vvs-media', 'mar-vvs-limites'], calcVvs);
    enlazar(['mar-resp-prueba', 'mar-resp-vs0', 'mar-resp-vs1', 'mar-resp-taqui', 'mar-resp-pia'], calcRespuesta);
    simDo2Vo2();
    simFluidos();
    simRetorno();
}
