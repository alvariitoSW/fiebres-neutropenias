// Libros · Marino Ácido-base, renal y electrolitos — The ICU Book (Marino PL,
// 5.ª ed.), caps. 31-38. Cuaderno de campo + calculadoras de cada ficha.
// Todas las cifras salen de las ecuaciones y tablas citadas en el propio
// texto de la ficha; donde la fuente tiene una errata, la calculadora usa la
// lectura que justifica la nota de fidelidad de la ficha.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';
import { wireSelectExplicacion } from '../../core/ui.js';

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
// Límites de los campos (CLAUDE.md §7.10): los min/max del HTML son rangos de
// fisiología general, no de la ficha. Si un campo numérico se sale, la
// calculadora avisa en su propio recuadro y no calcula (así una albúmina en
// g/L o una creatinina en µmol/L no dan un resultado que parece válido).
const numES = v => Number(v).toLocaleString('es-ES', { maximumFractionDigits: 2 });
function camposFueraDeRango(ids) {
    return ids.map($).filter(el => el && el.type === 'number' && el.value !== '').filter(el => {
        const v = Number(el.value);
        return (el.min !== '' && v < Number(el.min)) || (el.max !== '' && v > Number(el.max));
    });
}
// Campos cuyo rango depende de la unidad elegida (caps. 37-38): el min/max del HTML vale para la unidad
// por defecto y este ajuste lo cambia al elegir otra. Debe llamarse ANTES de enlazar() para que su
// aviso de rango lea ya los límites nuevos. Los límites son de fisiología general, no de la ficha.
function limitesPorUnidad(campoId, selectIds, tabla) {
    const campo = $(campoId), selects = selectIds.map($);
    if (!campo || selects.some(s => !s)) return;
    const aplicar = () => {
        const lim = tabla[selects.map(s => s.value).join('|')];
        if (lim) { campo.min = lim[0]; campo.max = lim[1]; }
    };
    selects.forEach(s => s.addEventListener('change', aplicar));
    aplicar();
}
function enlazar(ids, fn) {
    const campos = ids.map($).filter(Boolean);
    const marco = campos[0]?.closest('.agua-simulador');
    const caja = marco?.querySelector('.tfg-estado');
    if (marco && campos.some(el => el.type === 'number') && !marco.querySelector('.mr-limites-nota')) {
        marco.insertAdjacentHTML('beforeend', '<p class="fuente-ficha mr-limites-nota">Límites de los campos: fisiología general, no de la ficha.</p>');
    }
    const revisar = () => {
        const malos = camposFueraDeRango(ids);
        if (!malos.length) return fn();
        const lista = malos.map(el => `${document.querySelector(`label[for="${el.id}"]`)?.textContent.trim() || el.id}: ${numES(el.min)}–${numES(el.max)}`).join('; ');
        pintar(caja, 'warn', `<strong>Fuera de rango</strong> (${lista}): ¿unidades? Son límites de fisiología general, no de la ficha. No se calcula hasta corregirlo.`);
    };
    campos.forEach(el => el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', revisar));
    revisar();
}
// "Coincide" si la diferencia es <1 unidad (la fuente no da un margen).
const comparar = (medida, esperada) => (Math.abs(medida - esperada) < 1 ? 0 : medida > esperada ? 1 : -1);

// ---- Cap. 31 — el método de Marino (Etapas I y II) ----------------------
function calcAcidoBase() {
    const ph = num($('mr-ab-ph')), pco2 = num($('mr-ab-pco2')), hco3 = num($('mr-ab-hco3')), box = $('mr-ab-resultado');
    if (ph === null || pco2 === null || hco3 === null || ph <= 0 || pco2 <= 0 || hco3 <= 0) return ocultar(box);
    const h = 24 * pco2 / hco3;
    const phCalc = -Math.log10(h * 1e-9);
    const avisoCoherencia = Math.abs(phCalc - ph) > 0.03
        ? `<br><small>⚠️ Con [H⁺] = 24 × PCO₂/HCO₃⁻ = ${fmt(h, 0)} nEq/L el pH debería ser ${fmt(phCalc, 2)}: revisa los datos (la gasometría no es coherente).</small>` : '';
    const phAlto = ph > 7.44, phBajo = ph < 7.36, pco2Alta = pco2 > 44, pco2Baja = pco2 < 36;
    const phAnormal = phAlto || phBajo, pco2Anormal = pco2Alta || pco2Baja;
    let estado = 'warn', txt = '';
    if (!phAnormal && !pco2Anormal) {
        const hco3Anormal = hco3 < 22 || hco3 > 26;
        estado = hco3Anormal ? 'warn' : 'ok';
        txt = hco3Anormal
            ? '<strong>pH y PaCO₂ normales con HCO₃⁻ alterado</strong>: las reglas de la ficha empiezan por la PaCO₂ y el pH; con estos valores no identifican un trastorno. Mira el hiato aniónico.'
            : '<strong>Sin trastorno ácido-base</strong> en los tres valores.';
        return pintar(box, estado, txt + avisoCoherencia);
    }
    if (!phAnormal && pco2Anormal) {
        const resp = pco2Alta ? 'acidosis respiratoria' : 'alcalosis respiratoria';
        const met = pco2Alta ? 'alcalosis metabólica' : 'acidosis metabólica';
        return pintar(box, 'warn', `<strong>Regla 2 — trastorno mixto: ${resp} + ${met}.</strong> La PaCO₂ es anormal con pH normal; la Etapa II sobra.` + avisoCoherencia);
    }
    if (phAnormal && !pco2Anormal) {
        const met = phBajo ? 'acidosis metabólica' : 'alcalosis metabólica';
        txt = `<strong>Trastorno primario: ${met}</strong> (pH anormal con PaCO₂ normal, cambio primario del HCO₃⁻).`;
    }
    let primario;
    if (phAnormal && pco2Anormal) {
        const mismoSentido = (phAlto && pco2Alta) || (phBajo && pco2Baja);
        primario = mismoSentido ? (phBajo ? 'acidosis metabólica' : 'alcalosis metabólica') : (phBajo ? 'acidosis respiratoria' : 'alcalosis respiratoria');
        txt = `<strong>Regla 1 — trastorno primario: ${primario}</strong> (pH y PaCO₂ cambian en ${mismoSentido ? 'el mismo sentido' : 'sentido opuesto'}).`;
    } else {
        primario = phBajo ? 'acidosis metabólica' : 'alcalosis metabólica';
    }
    if (primario === 'acidosis metabólica') {
        const esperada = 40 - 1.2 * (24 - hco3);
        const c = comparar(pco2, esperada);
        txt += `<br>Regla 3: PaCO₂ esperada = 40 − 1,2 × (24 − ${fmt(hco3, 0)}) = <strong>${fmt(esperada)} mmHg</strong>. `;
        txt += c === 0 ? 'La medida coincide: compensación respiratoria adecuada.' : c > 0 ? 'La medida es mayor: <strong>acidosis respiratoria añadida</strong>.' : 'La medida es menor: <strong>alcalosis respiratoria añadida</strong>.';
        txt += '<br>Etapa III: calcula el hiato aniónico (siguiente ficha).';
        estado = 'danger';
    } else if (primario === 'alcalosis metabólica') {
        const esperada = 40 + 0.7 * (hco3 - 24);
        const c = comparar(pco2, esperada);
        txt += `<br>Regla 3: PaCO₂ esperada = 40 + 0,7 × (${fmt(hco3, 0)} − 24) = <strong>${fmt(esperada)} mmHg</strong>. `;
        txt += c === 0 ? 'La medida coincide: compensación adecuada.' : c > 0 ? 'La medida es mayor: <strong>acidosis respiratoria añadida</strong>.' : 'La medida es menor: <strong>alcalosis respiratoria añadida</strong>.';
    } else {
        const acid = primario === 'acidosis respiratoria';
        const dp = Math.abs(pco2 - 40);
        const agudo = acid ? 24 + 0.1 * dp : 24 - 0.2 * dp;
        const cronico = acid ? 24 + 0.4 * dp : 24 - 0.4 * dp;
        txt += `<br>Regla 4: HCO₃⁻ esperado agudo <strong>${fmt(agudo)}</strong> y crónico <strong>${fmt(cronico)} mEq/L</strong>. `;
        const lo = Math.min(agudo, cronico), hi = Math.max(agudo, cronico);
        if (hco3 >= lo - 0.5 && hco3 <= hi + 0.5) {
            txt += Math.abs(hco3 - agudo) < 1 ? 'Coincide con el esperado del cuadro <strong>agudo</strong>.'
                : Math.abs(hco3 - cronico) < 1 ? 'Coincide con el esperado del cuadro <strong>crónico</strong> (compensado).'
                : 'Cae entre los dos: <strong>parcialmente compensado</strong>.';
        } else if (acid) {
            txt += hco3 < agudo ? 'Menor que el agudo: <strong>acidosis metabólica añadida</strong>.' : 'Mayor que el crónico: <strong>alcalosis metabólica añadida</strong>.';
        } else {
            txt += hco3 > agudo ? 'Mayor que el agudo: <strong>alcalosis metabólica añadida</strong>.' : 'Menor que el crónico: <strong>acidosis metabólica añadida</strong>.';
        }
        estado = 'warn';
    }
    pintar(box, estado, txt + avisoCoherencia);
}

// ---- Cap. 31 — hiato aniónico, corregido y delta gap -------------------
function calcGaps() {
    const na = num($('mr-gap-na')), cl = num($('mr-gap-cl')), hco3 = num($('mr-gap-hco3')), alb = num($('mr-gap-alb')), box = $('mr-gap-resultado');
    if (na === null || cl === null || hco3 === null) return ocultar(box);
    const ha = na - (cl + hco3);
    if (ha < -10 || ha > 50) return pintar(box, 'warn', `<strong>Combinación no fisiológica</strong>: con Na⁺ ${fmt(na, 0)}, Cl⁻ ${fmt(cl, 0)} y HCO₃⁻ ${fmt(hco3, 0)} el hiato sale ${fmt(ha, 0)} mEq/L. Revisa los datos y las unidades (criterio de la calculadora, no de la ficha).`);
    let html = `Hiato aniónico = ${fmt(na, 0)} − (${fmt(cl, 0)} + ${fmt(hco3, 0)}) = <strong>${fmt(ha, 0)} mEq/L</strong> (referencia habitual 8-12).`;
    let haUsado = ha;
    if (alb !== null && alb > 0) {
        haUsado = ha + 2.5 * (4.5 - alb);
        html += `<br>Corregido por albúmina = ${fmt(ha, 0)} + 2,5 × (4,5 − ${fmt(alb, 1)}) = <strong>${fmt(haUsado)} mEq/L</strong>.`;
    }
    const elevado = haUsado > 12;
    html += `<br>${elevado ? '<strong>Hiato elevado</strong>: acumulación de ácidos (láctico, cetoácidos, tóxicos, insuficiencia renal avanzada).' : '<strong>Hiato normal</strong>: pérdida de HCO₃⁻ (acidosis hiperclorémica: salino, diarrea, insuficiencia renal precoz…).'}`;
    let estado = elevado ? 'danger' : 'warn';
    if (elevado && hco3 < 24) {
        const delta = (haUsado - 12) / (24 - hco3);
        const etqHa = haUsado !== ha ? 'HA corregido' : 'HA';
        html += `<br>Delta gap = (${etqHa} ${fmt(haUsado)} − 12) / (24 − ${fmt(hco3, 0)}) = <strong>${fmt(delta, 2)}</strong>`;
        if (haUsado !== ha) html += ' <small>(la fuente no dice si el delta usa el hiato corregido)</small>';
        html += '. ';
        html += Math.abs(delta - 1) < 0.1 ? '≈1: acidosis de hiato elevado "pura".'
            : delta < 1 ? '&lt;1: hay además una <strong>acidosis de hiato normal (hiperclorémica)</strong>.'
            : '&gt;1: coexiste una <strong>alcalosis metabólica</strong>.';
    } else if (hco3 >= 24) {
        html += '<br>Con HCO₃⁻ ≥24 el delta gap no se calcula (no hay déficit de HCO₃⁻).';
        estado = 'ok';
    }
    pintar(box, estado, html + '<br><small>La fuente no da margen alrededor de 1; se toma 0,9-1,1 como "≈1".</small>');
}

// ---- Cap. 32 — déficit de bicarbonato ----------------------------------
function calcBicarbonato() {
    const peso = num($('mr-bicarb-peso')), hco3 = num($('mr-bicarb-hco3')), box = $('mr-bicarb-resultado');
    if (peso === null || hco3 === null || peso <= 0) return ocultar(box);
    if (hco3 >= 15) return pintar(box, 'ok', `Con HCO₃⁻ ${fmt(hco3, 0)} mEq/L ya está en el objetivo (15): no hay déficit que reponer.`);
    const deficit = 0.6 * peso * (15 - hco3), mitad = deficit / 2;
    pintar(box, 'warn', `Déficit = 0,6 × ${fmt(peso, 0)} × (15 − ${fmt(hco3, 0)}) = <strong>${fmt(deficit, 0)} mEq</strong>. Repón la mitad: <strong>${fmt(mitad, 0)} mEq</strong> ≈ ${fmt(mitad / 50, 1)} ampollas de 8,4% (50 mEq) o ${fmt(mitad / 45, 1)} de 7,5% (45 mEq), diluidas en glucosado al 5% y en horas.<br><small>Indicación según la ficha: pH ≤7,1 y/o HCO₃⁻ ≤5 (el autor lo limita al inestable). Vigila el calcio iónico y la ventilación.</small>`);
}

// ---- Cap. 32 — primeras horas de la CAD (Tablas 32.3 y 32.4) -----------
function calcCad() {
    const peso = num($('mr-cad-peso')), k = num($('mr-cad-k')), glu = num($('mr-cad-glucosa')), na = num($('mr-cad-na')), box = $('mr-cad-resultado');
    if (peso === null || k === null || glu === null || peso <= 0) return ocultar(box);
    const lineas = [];
    let estado = 'ok';
    if (k < 3.3) {
        estado = 'danger';
        lineas.push(`<strong>K⁺ &lt;3,3: no empieces la insulina.</strong> Da 40 mEq/h de K⁺ IV hasta K⁺ &gt;3,3 (Tabla 32.4).`);
    } else {
        const inicio = `Insulina regular: bolo de <strong>${fmt(0.1 * peso, 1)} U</strong> (0,1 U/kg) y perfusión a <strong>${fmt(0.1 * peso, 1)} U/h</strong>; que la glucosa baje unos 100 mg/dL por hora.`;
        if (glu <= 250) {
            lineas.push(`<strong>Si ya estás tratando y la glucosa ha bajado a ≤250</strong>: insulina a <strong>${fmt(0.05 * peso, 1)} U/h</strong> (0,05 U/kg/h) para mantener 150-200 mg/dL, y glucosado 5% en salino 0,45% a 150-200 mL/h.`);
            lineas.push(`<strong>Si es el ingreso (CAD euglucémica)</strong>: ${inicio} La fuente solo añade: glucosado al 5% en todos los fluidos.`);
        } else lineas.push(inicio);
        // Tabla 32.4: reposición de K⁺ por tramos.
        if (k > 5.5) lineas.push('K⁺ &gt;5,5: control del K⁺ cada 2 h (Tabla 32.4).');
        else {
            lineas.push(`K⁺ ${k <= 4 ? '3,3-4,0' : '4,0-5,5'}: da <strong>${k <= 4 ? 20 : 10} mEq/h de K⁺ IV</strong> (Tabla 32.4) y mide el K⁺ cada 1-2 h las primeras 6 h.`);
            if (estado === 'ok') estado = 'warn';
        }
    }
    lineas.push(`Fluidos: cristaloide balanceado a <strong>${fmt(15 * peso / 1000, 1)}-${fmt(20 * peso / 1000, 1)} L/h</strong> (15-20 mL/kg/h, o 1 L/h) unas horas; luego 250 mL/h.`);
    if (na !== null) {
        const corr = na + 2.4 * (glu - 100) / 100;
        lineas.push(`Na⁺ corregido por la glucosa: <strong>${fmt(corr)} mEq/L</strong> (para el hiato aniónico, usa el Na⁺ medido).`);
    }
    pintar(box, estado, lineas.join('<br>'));
}

// ---- Cap. 33 — PaCO₂ esperada en la alcalosis metabólica --------------
const ALC_TIPO = {
    bajo: 'Vómitos, aspiración nasogástrica, efecto residual de diuréticos o abuso de laxantes: <strong>responde al cloro</strong> (salino isotónico + cloruro potásico).',
    alto: 'Hiperaldosteronismo primario, mineralocorticoides exógenos o regaliz: no responde al cloro. Poco probable en la UCI.',
    variable: 'Depleción de potasio o de magnesio. Si toma diuréticos, <strong>mide el magnesio antes de reponer el K⁺</strong>: con déficit de Mg la hipopotasemia se resiste a la reposición.',
    diuretico: 'Con un diurético en curso el cloro urinario sigue alto aunque falte cloro: valóralo cuando pase su efecto (después se comporta como "volumen bajo, cloro &lt;20").',
};
function calcAlcalosis() {
    const hco3 = num($('mr-alc-hco3')), pco2 = num($('mr-alc-paco2')), box = $('mr-alc-paco2-resultado');
    if (hco3 === null) return ocultar(box);
    if (hco3 <= 24) return pintar(box, 'ok', 'Con HCO₃⁻ ≤24 no hay alcalosis metabólica que compensar.');
    const esperada = 40 + 0.7 * (hco3 - 24);
    let html = `PaCO₂ esperada = 40 + 0,7 × (${fmt(hco3, 0)} − 24) = <strong>${fmt(esperada)} mmHg</strong>.`;
    if (hco3 <= 30) html += ' <small>El capítulo define la alcalosis metabólica como HCO₃⁻ &gt;30: con este valor la ecuación se aplica, pero aún no cumple esa definición.</small>';
    html += esperada > 50 ? ' Hipercapnia preocupante (&gt;50): solo con alcalosis grave.' : esperada > 46 ? ' Ya hay hipercapnia (&gt;46).' : '';
    let estado = hco3 > 30 ? 'warn' : 'ok';
    if (pco2 !== null) {
        const c = comparar(pco2, esperada);
        html += c === 0 ? '<br>La medida coincide: compensación adecuada.' : c > 0 ? '<br>La medida es mayor: <strong>acidosis respiratoria añadida</strong>.' : '<br>La medida es menor: <strong>alcalosis respiratoria añadida</strong>.';
        if (c !== 0) estado = 'danger';
    }
    pintar(box, estado, html);
}

// ---- Cap. 33 — déficit de cloro y HCl ----------------------------------
function calcCloro() {
    const peso = num($('mr-cloro-peso')), cl = num($('mr-cloro-cl')), box = $('mr-cloro-resultado');
    if (peso === null || cl === null || peso <= 0) return ocultar(box);
    if (cl >= 100) return pintar(box, 'ok', `Con Cl⁻ ${fmt(cl, 0)} mEq/L no hay déficit (el objetivo de la ecuación es 100).`);
    const def = 0.2 * peso * (100 - cl);
    pintar(box, 'warn', `Déficit de Cl⁻ = 0,2 × ${fmt(peso, 0)} × (100 − ${fmt(cl, 0)}) = <strong>${fmt(def, 0)} mEq</strong> → <strong>${fmt(def / 154, 1)} L</strong> de salino isotónico (÷154), a 100 mL/h por encima de las pérdidas. No en estados edematosos.`);
}
function calcHcl() {
    const peso = num($('mr-hcl-peso')), hco3 = num($('mr-hcl-hco3')), ph = num($('mr-hcl-ph')), box = $('mr-hcl-resultado');
    if (peso === null || hco3 === null || peso <= 0) return ocultar(box);
    const indicado = hco3 > 50 || (ph !== null && ph > 7.55);
    const def = 0.5 * peso * (hco3 - 24);
    if (def <= 0) return pintar(box, 'ok', 'Con HCO₃⁻ ≤24 no hay déficit de H⁺.');
    pintar(box, indicado ? 'danger' : 'warn',
        `${indicado ? '' : '<strong>No cumple la indicación de la ficha</strong> (HCO₃⁻ &gt;50 o pH &gt;7,55). '}Déficit de H⁺ = 0,5 × ${fmt(peso, 0)} × (${fmt(hco3, 0)} − 24) = <strong>${fmt(def, 0)} mEq</strong> → <strong>${fmt(def / 100, 2)} L</strong> de HCl 0,1 N, a ≤${fmt(0.2 * peso, 0)} mEq/h (${fmt(0.2 * peso * 10, 0)} mL/h, 0,2 mEq/kg/h) por vía central; para cuando el pH baje a un valor aceptable (p. ej. &lt;7,5).`);
}

// ---- Cap. 34 — criterios KDIGO (Tabla 34.1) ----------------------------
function calcKdigo() {
    const basal = num($('mr-kdigo-basal')), actual = num($('mr-kdigo-actual')), t = $('mr-kdigo-tiempo')?.value, diu = num($('mr-kdigo-diuresis')), box = $('mr-kdigo-resultado');
    if (basal === null && actual === null && diu === null) return ocultar(box);
    // Se compara con enteros (centésimas): 2,3 − 2,0 vale 0,2999… en coma flotante.
    const cent = x => Math.round(x * 100);
    const crDatos = basal !== null && actual !== null && basal > 0, diuDatos = diu !== null;
    const cumple = [];
    if (crDatos) {
        if (t === '48' && cent(actual) - cent(basal) >= 30) cumple.push(`subida de ${fmt((cent(actual) - cent(basal)) / 100, 2)} mg/dL en 48 h (≥0,3)`);
        if (t !== 'mas' && cent(actual) * 2 >= cent(basal) * 3) cumple.push(`${fmt(actual / basal, 2)} veces la basal en 7 días (≥1,5)`);
    }
    if (diuDatos && diu < 0.5) cumple.push(`diuresis de ${fmt(diu, 2)} mL/kg/h durante 6 h (&lt;0,5)`);
    if (cumple.length) return pintar(box, 'danger', `<strong>Cumple criterios de fracaso renal agudo</strong>: ${cumple.join('; ')}. Recuerda las limitaciones: la oliguria puede ser una respuesta adecuada y la creatinina engaña en el crítico.`);
    const aviso = t === 'mas' ? ' (más de 7 días entre las creatininas: fuera de los criterios)' : '';
    if (crDatos && diuDatos) return pintar(box, 'ok', `<strong>No cumple</strong> ningún criterio con estos datos${aviso}.`);
    const faltan = [!crDatos && 'creatinina (basal y actual)', !diuDatos && 'diuresis de las últimas 6 h'].filter(Boolean).join(' ni la ');
    const valorado = [crDatos && 'creatinina', diuDatos && 'diuresis'].filter(Boolean).join(' y ');
    pintar(box, 'warn', `<strong>Faltan datos</strong>: ${valorado ? `por ${valorado} no cumple${aviso}, pero ` : ''}no se ha podido valorar la ${faltan}.`);
}
// ---- Cap. 34 — Cockcroft-Gault y MDRD (Figura 34.1) --------------------
function calcFg() {
    const edad = num($('mr-fg-edad')), peso = num($('mr-fg-peso')), cr = num($('mr-fg-cr')), mujer = $('mr-fg-sexo')?.value === 'm', box = $('mr-fg-resultado');
    if (edad === null || peso === null || cr === null || cr <= 0 || edad <= 0) return ocultar(box);
    const cg = (140 - edad) * peso * (mujer ? 0.85 : 1) / (72 * cr);
    const mdrd = 186 * Math.pow(cr, -1.154) * Math.pow(edad, -0.203) * (mujer ? 0.74 : 1);
    pintar(box, cg < 30 || mdrd < 30 ? 'danger' : cg < 60 || mdrd < 60 ? 'warn' : 'ok',
        `Cockcroft-Gault: <strong>${fmt(cg, 0)} mL/min</strong> · MDRD: <strong>${fmt(mdrd, 0)} mL/min/1,73 m²</strong>.<br><small>En el crítico sobrestiman el filtrado real (pérdida muscular, menos creatina en la sepsis).</small>`);
}
// ---- Cap. 34 — presión de perfusión abdominal (Ecuaciones 34.2 y 34.3) --
function calcPia() {
    const pam = num($('mr-pia-pam')), valor = num($('mr-pia-valor')), unidad = $('mr-pia-unidad')?.value, organo = $('mr-pia-organo')?.value === 'si', box = $('mr-pia-resultado');
    if (pam === null || valor === null) return ocultar(box);
    const pia = unidad === 'cmh2o' ? valor / 1.36 : valor;
    const ppa = pam - pia, grad = pam - 2 * pia;
    if (ppa <= 0) return pintar(box, 'warn', `<strong>Combinación no fisiológica</strong>: con PAM ${fmt(pam, 0)} y PIA ${fmt(pia)} mmHg la presión de perfusión abdominal sale ${fmt(ppa, 0)}. Revisa los datos y las unidades (criterio de la calculadora, no de la ficha).`);
    let cat = pia > 20 && organo ? '<strong>Síndrome compartimental abdominal</strong> (PIA &gt;20 mmHg con disfunción orgánica).'
        : pia >= 12 ? '<strong>Hipertensión intraabdominal</strong> (PIA ≥12 mmHg).'
        : pia <= 7 ? 'PIA normal en supino (5-7 mmHg).' : 'PIA por encima de lo normal, sin llegar a hipertensión intraabdominal.';
    const estado = pia > 20 && organo ? 'danger' : pia >= 12 || ppa <= 60 ? 'warn' : 'ok';
    pintar(box, estado, `${unidad === 'cmh2o' ? `PIA = ${fmt(valor, 0)} cmH₂O = <strong>${fmt(pia)} mmHg</strong> (÷1,36). ` : ''}${cat}<br>PPA = PAM − PIA = <strong>${fmt(ppa, 0)} mmHg</strong> (${ppa > 60 ? '&gt;60: asociada a mejores resultados' : '≤60: por debajo del objetivo'}). Gradiente de filtración = PAM − 2 × PIA = <strong>${fmt(grad, 0)} mmHg</strong>.`);
}
// ---- Cap. 34 — EFNa y EFU (Ecuaciones 34.4 y 34.5) ---------------------
function calcIndices() {
    const nau = num($('mr-ind-nau')), nap = num($('mr-ind-nap')), cru = num($('mr-ind-cru')), crp = num($('mr-ind-crp'));
    const uu = num($('mr-ind-ureau')), up = num($('mr-ind-ureap')), diur = $('mr-ind-diur')?.value === 'si', box = $('mr-indices-resultado');
    if (nau === null || nap === null || cru === null || crp === null || nap <= 0 || cru <= 0 || crp <= 0) return ocultar(box);
    const uPcr = cru / crp, efna = (nau / nap) / uPcr * 100;
    if (efna > 100) return pintar(box, 'warn', `<strong>Combinación no fisiológica</strong>: la EFNa sale ${fmt(efna, 0)}% (una fracción excretada no pasa de 100%). Revisa los datos y las unidades (criterio de la calculadora, no de la ficha).`);
    let html = `EFNa = (${fmt(nau, 0)}/${fmt(nap, 0)}) / (${fmt(cru, 0)}/${fmt(crp, 1)}) = <strong>${fmt(efna, 2)}%</strong>: `;
    html += efna < 1 ? 'sugiere <strong>hipoperfusión renal</strong> (puede ser falsamente baja en la lesión tubular de la sepsis o la mioglobinuria).'
        : efna > 2 ? 'sugiere <strong>lesión tubular</strong>.' : 'zona intermedia (1-2%).';
    if (diur) html += ' <strong>Con diurético la EFNa sube</strong>: fíate más de la EFU.';
    html += ` Na⁺ en orina ${fmt(nau, 0)}: ${nau < 20 ? 'ahorro de sodio (hipoperfusión)' : nau > 40 ? 'pérdida de sodio (lesión tubular, o diurético/ERC)' : 'intermedio'}.`;
    let estado = efna < 1 ? 'warn' : efna > 2 ? 'danger' : 'warn';
    if (uu !== null && up !== null && up > 0) {
        const efu = (uu / up) / uPcr * 100;
        if (efu > 100) return pintar(box, 'warn', `<strong>Combinación no fisiológica</strong>: la EFU sale ${fmt(efu, 0)}% (una fracción excretada no pasa de 100%). Revisa los datos y las unidades (criterio de la calculadora, no de la ficha).`);
        html += `<br>EFU = <strong>${fmt(efu)}%</strong>: ${efu < 35 ? 'hipoperfusión' : efu > 50 ? 'lesión tubular' : 'zona intermedia (35-50%)'}; no la alteran los diuréticos.`;
        if (diur) estado = efu < 35 ? 'warn' : efu > 50 ? 'danger' : 'warn';
    }
    pintar(box, estado, html);
}

// ---- Cap. 35 — osmolalidad calculada, efectiva y hiato osmolal ---------
function calcOsm() {
    const na = num($('mr-osm-na')), glu = num($('mr-osm-glu')), bun = num($('mr-osm-bun')), medida = num($('mr-osm-medida')), box = $('mr-osm-resultado');
    if (na === null || glu === null || bun === null) return ocultar(box);
    const calc = 2 * na + glu / 18 + bun / 2.8, efec = 2 * na + glu / 18;
    let html = `Calculada = 2 × ${fmt(na, 0)} + ${fmt(glu, 0)}/18 + ${fmt(bun, 0)}/2,8 = <strong>${fmt(calc, 0)} mOsm/kg H₂O</strong> (normal 285-295). Efectiva (sin urea) = <strong>${fmt(efec, 0)}</strong>.`;
    let estado = calc < 285 || calc > 295 ? 'warn' : 'ok';
    if (medida !== null) {
        const gap = medida - calc;
        html += `<br>Hiato osmolal = ${fmt(medida, 0)} − ${fmt(calc, 0)} = <strong>${fmt(gap, 0)}</strong> ${gap >= 10 ? '(≥10: <strong>soluto no medido</strong>, p. ej. un tóxico)' : '(&lt;10: normal)'}.`;
        if (gap >= 10) estado = 'danger';
    }
    pintar(box, estado, html);
}

// ---- Cap. 35 — hipernatremia -------------------------------------------
const HIPERNA_VEC = {
    bajo: '<strong>Hipovolémica</strong>: pérdida de líquido hipotónico (vómitos, diarrea, diuréticos, glucosuria) con la sed alterada. Primero salino isotónico para la hipotensión; después corrige el agua libre.',
    normal: '<strong>Normovolémica</strong>: pérdida de agua libre (reposición con líquido más hipertónico que el perdido, diabetes insípida). Glucosado al 5% o agua por sonda; desmopresina si es diabetes insípida central (Figura 35.2).',
    alto: '<strong>Hipervolémica</strong>: exceso de sodio (bicarbonato, salino). Furosemida con glucosado al 5%: la orina con furosemida lleva menos Na⁺ (~80) que el plasma.',
};
function calcHiperna() {
    const na = num($('mr-hiperna-na')), obj = num($('mr-hiperna-obj')), box = $('mr-hiperna-resultado');
    if (na === null || obj === null) return ocultar(box);
    if (na <= obj) return pintar(box, 'ok', 'El Na⁺ ya está en el objetivo.');
    const h = (na - obj) / 0.5;
    pintar(box, 'warn', `Bajar de ${fmt(na, 0)} a ${fmt(obj, 0)} a ≤0,5 mEq/L/h lleva <strong>al menos ${fmt(h, 0)} h</strong> (${fmt(h / 24, 1)} días). Es el ritmo tradicional; el óptimo no se conoce.`);
}
export const DI_WIZARD = {
    inicio: { pregunta: '¿Orina diluida con plasma hipertónico (hipernatremia)?', si: 'restriccion', no: { estado: 'tfg-estado-ok', final: 'Sin orina diluida con plasma hipertónico, no es el patrón de la diabetes insípida.' } },
    restriccion: { pregunta: 'Con restricción hídrica completa, ¿la osmolaridad urinaria sube más de 30 mOsm/L en unas horas?', si: { estado: 'tfg-estado-ok', final: 'Sube: no es diabetes insípida (el riñón concentra).' }, no: 'vasopresina' },
    vasopresina: { pregunta: 'Es diabetes insípida. Tras vasopresina, ¿la osmolaridad urinaria sube ≥50%?', si: { estado: 'tfg-estado-warn', final: 'DI central. Desmopresina 1 µg SC o 2 µg IV cada 12 h (la vía oral solo absorbe un 5%).' }, no: { estado: 'tfg-estado-danger', final: 'DI nefrogénica: busca fármacos (anfotericina, aminoglucósidos, dopamina, litio), hipopotasemia o recuperación de una necrosis tubular.' } },
};
// ---- Cap. 35 — hiponatremia --------------------------------------------
function calcNaCorr() {
    const na = num($('mr-nacorr-na')), glu = num($('mr-nacorr-glu')), box = $('mr-nacorr-resultado');
    if (na === null || glu === null) return ocultar(box);
    const corr = na + 2.4 * (glu - 100) / 100;
    pintar(box, corr < 135 ? 'warn' : corr > 145 ? 'danger' : 'ok',
        `Na⁺ corregido = ${fmt(na, 0)} + 2,4 × (${fmt(glu, 0)} − 100)/100 = <strong>${fmt(corr)} mEq/L</strong>${corr >= 135 && na < 135 ? ': la hiponatremia se explica por la glucosa' : corr < 135 ? ': hay hiponatremia además de la glucosa' : ''}.`);
}
function calcHiponaClasif() {
    const osm = $('mr-hc-osm')?.value, vec = $('mr-hc-vec')?.value, nau = $('mr-hc-nau')?.value, osmu = $('mr-hc-osmu')?.value, diur = $('mr-hc-diur')?.value === 'si', box = $('mr-hipona-clasif-resultado');
    if (osm === 'normal') return pintar(box, 'ok', '<strong>Pseudohiponatremia</strong> (osmolalidad normal, 285-295): proteínas o lípidos muy altos: la hiponatremia no es real.');
    if (!vec) return ocultar(box);
    let html = osm === 'nd' ? '<small>Sin osmolalidad no se puede descartar una pseudohiponatremia.</small><br>' : '';
    let estado = 'warn';
    if (vec === 'bajo') {
        html += '<strong>Hipovolémica</strong>: pérdida de sodio con retención de agua. ';
        if (nau === 'alto') html += 'Na⁺ urinario &gt;20: <strong>pérdida renal</strong> (diuréticos, insuficiencia suprarrenal primaria, pierde sal cerebral). ';
        else if (nau === 'bajo') html += 'Na⁺ urinario &lt;20: <strong>pérdida extrarrenal</strong> (digestiva). ';
        if (diur) html += '<small>(Nota de interpretación de la app, no de la ficha: con un diurético en curso el Na⁺ urinario puede no distinguir el origen.)</small> ';
        html += 'Salino isotónico.';
    } else if (vec === 'normal') {
        html += '<strong>Normovolémica</strong>: retención de agua (ADH no osmótica o ingesta excesiva). ';
        if (osmu === 'alta' && nau !== 'bajo') html += 'Orina concentrada (&gt;100) con Na⁺ urinario &gt;20: <strong>SIADH</strong> (300-500 mOsm/kg). ';
        else if (osmu === 'baja') html += 'Orina diluida (&lt;200): <strong>intoxicación hídrica / polidipsia</strong>. ';
        html += 'Restricción hídrica (500 mL menos que la diuresis).';
    } else {
        html += '<strong>Hipervolémica</strong>: sobra sal y más aún agua (insuficiencia cardíaca, cirrosis, renal). La furosemida corrige en teoría, pero la renina-angiotensina sostiene la hiponatremia.';
    }
    html += '<br>Si hay síntomas de encefalopatía, lo que manda es el <strong>salino al 3%</strong> (siguiente ficha).';
    pintar(box, estado, html);
}
function calcSalino3() {
    const peso = num($('mr-sal3-peso')), na0 = num($('mr-sal3-na0')), na1 = num($('mr-sal3-na1')), horas = num($('mr-sal3-horas')), dia = $('mr-sal3-dia')?.value, box = $('mr-sal3-resultado');
    if (peso === null || peso <= 0) return ocultar(box);
    let html = `Bolo de NaCl al 3%: <strong>2 mL/kg = ${fmt(2 * peso, 0)} mL</strong>, o <strong>150 mL</strong> (la fuente da las dos formas), por vía periférica, repetido cada pocas horas hasta que ceden los síntomas. Cada bolo puede subir el Na⁺ hasta 2 mEq/L.`;
    let estado = 'ok';
    if (na0 !== null && na1 !== null && horas !== null && horas > 0) {
        const sube = na1 - na0;
        const avisos = [];
        let nota24 = '';
        if (horas > 24) {
            // Tabla 35.3: 10 mEq/L el primer día y 8 los siguientes. Con dos lecturas solo se ve el máximo posible.
            const dias = Math.ceil(horas / 24), permitido = 10 + 8 * (dias - 1);
            if (sube > permitido) avisos.push(`más de ${permitido} mEq/L en ${dias} días (10 el primer día y 8 cada día siguiente)`);
            nota24 = ` <small>Con dos lecturas solo se comprueba el máximo de ${dias} días (${permitido} mEq/L); el reparto día a día no se ve.</small>`;
        } else if (dia === '1') {
            if (horas <= 2 && sube > 5) avisos.push('más de 5 mEq/L en 2 h');
            if (horas <= 5 && sube > 10) avisos.push('más de 10 mEq/L en 5 h');
            if (sube > 10) avisos.push('más de 10 mEq/L el primer día');
        } else if (sube > 8) avisos.push('más de 8 mEq/L en un día (a partir del segundo)');
        if (na1 > 130) avisos.push('Na⁺ final por encima de 130');
        html += `<br>Subida: <strong>${fmt(sube, 0)} mEq/L en ${fmt(horas, 1)} h</strong>. `;
        if (avisos.length) { estado = 'danger'; html += `⚠️ Supera los límites: ${avisos.join('; ')}. Valora desmopresina (Tabla 35.4).`; }
        else html += 'Dentro de los límites.';
        html += nota24;
        if (sube >= 5 && !avisos.length) html += ' Ya ha subido ≥5: si los síntomas no mejoran, busca otra causa.';
    }
    pintar(box, estado, html);
}

// ---- Cap. 36 — potasio ---------------------------------------------------
function calcKperdida() {
    const ku = num($('mr-kperd-ku')), clu = num($('mr-kperd-clu')), box = $('mr-kperd-resultado');
    if (ku === null) return ocultar(box);
    if (ku < 30) return pintar(box, 'warn', `K⁺ urinario &lt;30: pérdida <strong>extrarrenal</strong>, sobre todo <strong>diarrea</strong>.`);
    if (clu === null) return pintar(box, 'warn', 'K⁺ urinario &gt;30: pérdida renal. Añade el Cl⁻ urinario para afinar.');
    if (clu < 15) return pintar(box, 'warn', 'K⁺ &gt;30 y Cl⁻ &lt;15: <strong>aspiración nasogástrica o alcalosis</strong>.');
    if (clu > 25) return pintar(box, 'warn', 'K⁺ &gt;30 y Cl⁻ &gt;25: <strong>diuréticos o depleción de magnesio</strong>.');
    pintar(box, 'warn', 'Cl⁻ urinario entre 15 y 25: la Figura 36.3 no clasifica ese tramo.');
}
// Tabla 36.1: 50 mEq/kg de peso magro; se pierde un 10% del total por cada
// 1 mEq/L por debajo de 3,5. La usan la calculadora y el iceberg de la vista Visual.
export function deficitK(k, peso) {
    const total = 50 * peso;
    return { total, def: Math.max(0, total * 0.1 * (3.5 - k)) };
}
function calcKdeficit() {
    const k = num($('mr-kdef-k')), peso = num($('mr-kdef-peso')), ritmo = num($('mr-kdef-ritmo')), box = $('mr-kdef-resultado');
    if (k === null || peso === null || peso <= 0) return ocultar(box);
    if (k >= 3.5) return pintar(box, 'ok', 'Con K⁺ ≥3,5 no hay hipopotasemia.');
    const { total, def } = deficitK(k, peso);
    let html = `Déficit ≈ 10% de ${fmt(total, 0)} mEq por cada mEq/L por debajo de 3,5 = <strong>${fmt(def, 0)} mEq</strong>.`;
    if (Math.abs(peso - 70) < 0.5) html += ' (Coincide con la Tabla 36.1.)';
    html += ` A ${fmt(ritmo, 0)} mEq/h: unas <strong>${fmt(def / ritmo, 1)} h</strong> de reposición.`;
    html += ritmo > 20 ? ' <strong>Más de 20 mEq/h</strong>: solo en la grave, mejor por vena central grande y no en la cava superior.' : ' Lo estándar: 20 mEq en 100 mL de salino en 1 h.';
    html += '<br><small>Peso magro, 50 mEq/kg. Si no responde, piensa en el magnesio.</small>';
    if (k < 2.5) html += '<br><small>⚠️ La Tabla 36.1 se detiene en 2,5: por debajo, el déficit es una <strong>extrapolación de la app</strong> de la regla del 10% (la Figura 36.2 muestra una curva no lineal).</small>';
    pintar(box, k < 2.5 ? 'danger' : 'warn', html);
}
function calcFicticia() {
    const box = $('mr-ficticia-resultado');
    const marcados = [...document.querySelectorAll('.mr-ficticia:checked')].map(c => c.value);
    if (!marcados.length) return pintar(box, 'ok', 'Sin factores de hiperpotasemia ficticia: trátala como real.');
    const fuerte = marcados.includes('hemolisis') || marcados.includes('plaquetas');
    pintar(box, fuerte ? 'danger' : 'warn', `<strong>${marcados.length} factor${marcados.length > 1 ? 'es' : ''}</strong> de hiperpotasemia ficticia. ${fuerte ? 'La hemólisis (o la trombocitosis/leucocitosis grave) es la causa habitual: ' : ''}sospéchala si no hay motivo aparente y <strong>saca tú la muestra</strong>, evitando estos factores (el laboratorio a menudo no la detecta).`);
}
function calcHiperk() {
    const k = num($('mr-hk-k')), ecg = $('mr-hk-ecg')?.value === 'si', colapso = $('mr-hk-colapso')?.value === 'si', box = $('mr-hk-resultado');
    if (k === null) return ocultar(box);
    // El capítulo define la hiperpotasemia como K⁺ >5,5 (pág. 23); la grave (pág. 27) es una hiperpotasemia con K⁺ >6,5 o con cambios del ECG.
    if (k <= 5.5) return pintar(box, ecg ? 'warn' : 'ok', 'K⁺ ≤5,5: <strong>no es hiperpotasemia</strong> (el capítulo la define como &gt;5,5), con o sin cambios en el ECG.');
    if (k <= 6.5 && !ecg) return pintar(box, 'warn', '<strong>Hiperpotasemia no grave</strong>: Marino solo da pauta para la grave (&gt;6,5 o con cambios en el ECG). Descarta una hiperpotasemia ficticia (págs. 23-24), busca la causa (Tabla 36.2) y vigila.' + (colapso ? '<br>Has marcado colapso circulatorio o parada: Marino no da pauta para este cruce (su cloruro cálcico está dentro de la pauta de la grave, Tabla 36.3).' : ''));
    const pasos = [];
    if (colapso) pasos.push('<strong>Cloruro cálcico al 10%</strong> (tres veces más calcio que el gluconato): está indicado en el colapso circulatorio o la parada.');
    else pasos.push(`<strong>Gluconato cálcico al 10%, 10 mL IV en 3 min</strong>; repetir a los 5 min si hace falta${ecg ? '' : ' (indicado por K⁺ &gt;6,5; el autor lo reservaría para cuando hay cambios en el ECG)'}. Dura 30-60 min.`);
    pasos.push('<strong>Insulina regular 10 U IV + 50 mL de glucosa al 50%</strong> (baja ≥0,6 mEq/L, pico a los 30-60 min) ± salbutamol 20 mg en aerosol (nunca solo). Bicarbonato no.');
    pasos.push('<strong>Ciclosilicato de sodio y zirconio 10 g cada 8 h 48 h</strong>; la <strong>hemodiálisis</strong> es el método más eficaz (baja 1 mEq/L en 1 h y 2 en 3 h).');
    pintar(box, 'danger', `<strong>Hiperpotasemia grave</strong>:<br>${pasos.map((p, i) => `${i + 1}. ${p}`).join('<br>')}`);
}
function calcCalcioMl() {
    const mg = num($('mr-camg-prep')), ml = num($('mr-camg-ml')), box = $('mr-camg-resultado');
    if (mg === null || ml === null) return ocultar(box);
    pintar(box, 'ok', `${fmt(ml, 0)} mL × ${fmt(mg, 0)} mg/mL = <strong>${fmt(ml * mg, 0)} mg de calcio elemento</strong>.${mg === 27 ? ' Equivale a ' + fmt(ml * 3, 0) + ' mL de gluconato.' : ''}`);
}

// ---- Cap. 37 — magnesio ------------------------------------------------
// Tramos de la hipermagnesemia (Tabla de la ficha, pág. 39): una sola copia, la de la tabla `#mr-hipermg-umbral`,
// que también leen la escalera de la vista Visual y las dos calculadoras. Devuelve de mayor a menor umbral.
function tramosHiperMg() {
    const filas = [...($('mr-hipermg-umbral')?.tBodies[0]?.rows || [])];
    return filas.map(r => [Number(r.cells[0].textContent.replace(',', '.').replace(/[^\d.]/g, '')), r.cells[1].innerHTML.replace(/^./, c => c.toLowerCase())])
        .sort((a, b) => b[0] - a[0]);
}
const esperableMg = meq => tramosHiperMg().find(([u]) => meq > u) || null;
function calcMgConv() {
    const v = num($('mr-mgconv-valor')), u = $('mr-mgconv-unidad')?.value, box = $('mr-mgconv-resultado');
    if (v === null) return ocultar(box);
    const meq = u === 'mgdl' ? v * 10 / 24 * 2 : u === 'mmol' ? v * 2 : v;
    const mgdl = meq / 2 * 24 / 10, mmol = meq * 0.5;
    const estado = meq < 1.4 ? (meq < 1 ? 'danger' : 'warn') : meq > 2 ? (meq > 4 ? 'danger' : 'warn') : 'ok';
    const lect = meq < 1 ? 'hipomagnesemia moderada (&lt;1 mEq/L)' : meq < 1.4 ? 'hipomagnesemia leve (1-1,4 mEq/L)' : meq <= 2 ? 'dentro del rango de referencia' : esperableMg(meq) ? `hipermagnesemia: ${esperableMg(meq)[1]} esperable (&gt;${esperableMg(meq)[0]})` : 'por encima del rango';
    pintar(box, estado, `<strong>${fmt(mgdl, 2)} mg/dL = ${fmt(meq, 2)} mEq/L = ${fmt(mmol, 2)} mmol/L</strong>: ${lect} (Tabla 37.2: 1,7-2,4 mg/dL, 1,4-2,0 mEq/L, 0,7-1,0 mmol/L).`);
}
function calcMgReposicion() {
    const mg = num($('mr-mgrep-mg')), peso = num($('mr-mgrep-peso')), clin = $('mr-mgrep-clinica')?.value, ir = $('mr-mgrep-renal')?.value === 'ir', box = $('mr-mgrep-resultado');
    if (mg === null || peso === null || peso <= 0) return ocultar(box);
    const f = ir ? 0.5 : 1;
    const nota = ir ? '<br><strong>Insuficiencia renal</strong>: no más del 50% de lo de arriba (ya aplicado) y vigila el Mg de cerca.' + (clin === 'vital' ? ' <small>Marino dice «no más del 50% del Mg de los protocolos estándar»; aplicarlo también al bolo inicial de la amenaza vital es una extrapolación de la app.</small>' : '') : '';
    let html, estado;
    // Los protocolos de la fuente son para la hipomagnesemia (leve: 1-1,4 mEq/L, 1,4 incluido).
    if (mg > 1.4) {
        const arr = clin === 'vital' ? '<br>Con arritmias ventriculares refractarias, el Mg IV puede abolirlas aun con Mg normal (efecto estabilizador de membrana), pero la ficha no da una pauta para ese caso.' : '';
        return pintar(box, 'ok', 'Mg &gt;1,4 mEq/L: no hay hipomagnesemia, así que no aplican los protocolos de reposición (aunque puede haber déficit con Mg normal: piensa en la prueba de retención).' + arr);
    }
    if (clin === 'vital') {
        estado = 'danger';
        html = `<strong>Amenaza vital</strong>: ${fmt(2 * f, 1)} g de MgSO₄ (${fmt(16 * f, 0)} mEq) IV en 2-5 min; después ${fmt(5 * f, 1)} g en 6 h y ${fmt(5 * f, 1)} g cada 12 h en perfusión 5 días.`;
    } else if (mg < 1 || clin === 'otros') {
        estado = 'warn';
        html = `<strong>Moderada${mg >= 1 ? ' (por otros trastornos electrolíticos)' : ''}</strong>: ${fmt(6 * f, 1)} g de MgSO₄ (${fmt(48 * f, 0)} mEq) en 3 h; después ${fmt(5 * f, 1)} g en 6 h y ${fmt(5 * f, 1)} g cada 12 h en perfusión 5 días.`;
    } else {
        estado = 'warn';
        const d1 = peso * f, dia = 0.5 * peso * f;
        html = `<strong>Leve y asintomática</strong>: déficit supuesto ${fmt(peso, 0)}-${fmt(2 * peso, 0)} mEq (1-2 mEq/kg). Día 1: <strong>${fmt(d1, 0)} mEq</strong> (≈${fmt(d1 / 8, 1)} g de MgSO₄); los 3-5 días siguientes: <strong>${fmt(dia, 0)} mEq/día</strong> (≈${fmt(dia / 8, 1)} g/día).`;
    }
    pintar(box, estado, html + nota + '<br><small>Sigue al bolo con perfusión: el Mg empieza a bajar a los 15 min.</small>');
}
function calcMgRetencion() {
    const v = num($('mr-mgret-orina')), u = $('mr-mgret-unidad')?.value, renal = $('mr-mgret-renal')?.value, box = $('mr-mgret-resultado');
    if (v === null) return ocultar(box);
    const mmol = u === 'meq' ? v / 2 : v, pct = mmol / 24 * 100;
    let html = `${fmt(mmol, 1)} mmol en 24 h = <strong>${fmt(pct, 0)}%</strong> de los 24 mmol infundidos: `;
    let estado;
    if (mmol <= 12) { estado = 'danger'; html += '<strong>sigue habiendo déficit</strong> (≤50%).'; }
    else if (mmol > 19) { estado = 'ok'; html += '<strong>depósitos suficientes</strong> (&gt;80%).'; }
    else { estado = 'warn'; html += 'zona intermedia (50-80%): la tabla no la interpreta.'; }
    if (renal === 'alterada') { html += '<br>⚠️ Con la función renal alterada la prueba puede no ser fiable.'; estado = 'warn'; }
    pintar(box, estado, html);
}
function calcHiperMg() {
    const v = num($('mr-hipermg-valor')), box = $('mr-hipermg-resultado');
    if (v === null) return ocultar(box);
    if (v <= 2) return pintar(box, 'ok', 'Dentro o por debajo del rango de referencia (1,4-2,0 mEq/L).');
    const esperable = esperableMg(v)?.[1] || 'nada específico en la tabla (los umbrales empiezan en 4)';
    // Pág. 39: la hemodiálisis es el tratamiento de elección de la hipermagnesemia grave y el calcio IV es un puente hasta ella.
    // El capítulo no pone cifra a «grave»: la app la toma desde el bloqueo AV (>5).
    const pauta = v > 5 ? ' Pauta (grave): <strong>hemodiálisis</strong>; mientras llega, <strong>gluconato cálcico 1 g IV en 2-3 min</strong>. <small>El capítulo no fija una cifra para «grave»: la app la toma desde el bloqueo AV (&gt;5). El Manual Merck pone ≈10 mEq/L (12 mg/dL) como ejemplo de toxicidad grave (ver la nota de fuentes).</small>'
        : ' Marino no da pauta para la leve.';
    pintar(box, v > 5 ? 'danger' : 'warn', `Con ${fmt(v, 1)} mEq/L se espera: <strong>${esperable}</strong>.${pauta}`);
}

// ---- Cap. 38 — calcio y fósforo ----------------------------------------
const CA_RANGO = { total: [9.0, 10.0, 0.25, 'Calcio total'], ionico: [4.6, 5.0, 0.25, 'Calcio iónico'], fosforo: [2.5, 5.0, 0.32, 'Fósforo'] };
function calcCaConv() {
    const p = $('mr-caconv-param')?.value, v = num($('mr-caconv-valor')), u = $('mr-caconv-unidad')?.value, box = $('mr-caconv-resultado');
    if (!p || v === null) return ocultar(box);
    const [lo, hi, f, nombre] = CA_RANGO[p];
    const mgdl = u === 'mmol' ? v / f : v, mmol = mgdl * f;
    let estado = 'ok', lect = 'dentro del rango';
    if (mgdl < lo) { estado = 'warn'; lect = 'por debajo del rango'; }
    if (mgdl > hi) { estado = 'warn'; lect = 'por encima del rango'; }
    if (p === 'ionico' && mmol < 0.65) { estado = 'danger'; lect = 'hipocalcemia iónica extrema (&lt;0,65 mmol/L): solo aquí se describen hipotensión, bajo gasto y ectopia'; }
    else if (p === 'ionico' && mmol < 0.9) { estado = 'danger'; lect = 'hipocalcemia iónica &lt;0,9 mmol/L (la cifra que la ficha llama grave en la transfusión masiva)'; }
    if (p === 'fosforo' && mgdl < 1) { estado = 'danger'; lect = 'hipofosfatemia grave (&lt;1 mg/dL): fosfato IV'; }
    else if (p === 'total' && mgdl > 14) { estado = 'danger'; lect = 'hipercalcemia &gt;14 mg/dL: tratar'; }
    pintar(box, estado, `${nombre}: <strong>${fmt(mgdl, 2)} mg/dL = ${fmt(mmol, 2)} mmol/L</strong>, ${lect} (${fmt(lo, 1)}-${fmt(hi, 1)} mg/dL).`);
}
function calcCaPauta() {
    const peso = num($('mr-capauta-peso')), conc = num($('mr-capauta-prep')), dosis = num($('mr-capauta-dosis')), box = $('mr-capauta-resultado');
    if (peso === null || conc === null || dosis === null || peso <= 0) return ocultar(box);
    const nombre = conc === 9 ? 'gluconato' : 'cloruro';
    const mgh = dosis * peso;
    pintar(box, 'warn', `Bolo: 200 mg de calcio elemento = <strong>${fmt(200 / conc, 0)} mL de ${nombre} al 10%</strong> en 100 mL de salino en 5-10 min (+0,5 mg/dL de calcio total).<br>Perfusión: ${fmt(dosis, 1)} mg/kg/h × ${fmt(peso, 0)} kg = <strong>${fmt(mgh, 0)} mg/h = ${fmt(mgh / conc, 1)} mL/h de ${nombre}</strong>, al menos 6 h, guiada por el calcio iónico cada hora.<br><small>Solo si la hipocalcemia causa un efecto adverso grave: el calcio IV se asocia a fallo multiorgánico.</small>`);
}
function calcHiperca() {
    const ca = num($('mr-hiperca-ca')), neuro = $('mr-hiperca-neuro')?.value === 'si', vol = $('mr-hiperca-volumen')?.value, hemato = $('mr-hiperca-origen')?.value === 'hemato', clcr = $('mr-hiperca-clcr')?.value === 'si', box = $('mr-hiperca-resultado');
    if (ca === null) return ocultar(box);
    if (ca <= 10) return pintar(box, 'ok', 'Calcio total ≤10 mg/dL: no hay hipercalcemia.');
    if (ca <= 14 && !neuro) return pintar(box, 'warn', `Calcio ${fmt(ca, 1)}: ${ca > 12.5 ? 'pueden empezar las manifestaciones (&gt;12,5)' : 'por debajo de 12,5 las manifestaciones son poco probables'}. La ficha indica tratar con &gt;14 mg/dL o síntomas neurológicos.`);
    const pasos = [];
    pasos.push(vol === 'sobrecarga' ? '<strong>Furosemida</strong> para la sobrecarga de volumen (sin ella, no añade nada al salino).' : '<strong>Salino isotónico</strong> para diuresis de 100-150 mL/h (baja 1-2 mg/dL).');
    pasos.push('<strong>Calcitonina 4 U/kg SC cada 12 h</strong> 24-48 h (rápida, con taquifilaxia).');
    pasos.push(`<strong>Zoledronato 4 mg IV en 15 min</strong> (o pamidronato) desde ya, porque tarda 2-4 días${clcr ? '; con ClCr &lt;50 algunos reducen la dosis (nefrotóxico)' : ''}.`);
    if (hemato) pasos.push('<strong>Glucocorticoides</strong>: hidrocortisona 200-400 mg/día IV 3 días y prednisona 10-20 mg/día 7 días (más eficaces en mieloma y linfoma).');
    pintar(box, 'danger', `<strong>Tratar</strong> (${ca > 14 ? 'calcio &gt;14' : 'síntomas neurológicos'}):<br>${pasos.map((p, i) => `${i + 1}. ${p}`).join('<br>')}`);
}
function calcFosfato() {
    const po4 = num($('mr-fosfato-po4')), peso = num($('mr-fosfato-peso')), k = num($('mr-fosfato-k')), indic = $('mr-fosfato-indic')?.value === 'si', box = $('mr-fosfato-resultado');
    if (po4 === null || peso === null) return ocultar(box);
    if (po4 >= 2.5) return pintar(box, 'ok', 'Fósforo ≥2,5 mg/dL: no hay hipofosfatemia.');
    if (po4 >= 1 && !indic) return pintar(box, 'warn', `Hipofosfatemia (${fmt(po4, 1)} mg/dL) sin indicación de fosfato IV en la ficha: solo &lt;1 mg/dL o con disfunción cardíaca, fracaso respiratorio o rabdomiólisis. Suele ser un marcador de enfermedad.`);
    if (peso < 40 || peso > 120) return pintar(box, 'warn', 'La Tabla 38.5 solo cubre de 40 a 120 kg.');
    const fila = peso <= 60 ? 0 : peso <= 80 ? 1 : 2;
    const col = po4 < 1 ? 0 : po4 <= 1.7 ? 1 : 2;
    const T = [[30, 20, 10], [40, 30, 15], [50, 40, 20]];
    const mmol = T[fila][col];
    const sal = k === null ? 'sódico o potásico según el K⁺ (≥4 sódico, &lt;4 potásico)' : k >= 4 ? '<strong>fosfato sódico</strong> (K⁺ ≥4)' : '<strong>fosfato potásico</strong> (K⁺ &lt;4)';
    pintar(box, po4 < 1 ? 'danger' : 'warn', `Tabla 38.5: <strong>${mmol} mmol de PO₄</strong> = ${fmt(mmol / 3, 1)} mL de ${sal} (3 mmol/mL).`);
}
function calcQuelante() {
    const po4 = num($('mr-quelante-po4')), box = $('mr-quelante-resultado');
    if (po4 === null) return ocultar(box);
    if (po4 < 5.6) return pintar(box, 'ok', 'Por debajo de 5,6 mg/dL la pauta de sevelamer de la ficha no da dosis.');
    const sev = po4 <= 7.4 ? '800 mg cada 8 h' : po4 <= 8.9 ? '1.200-1.600 mg cada 8 h' : '1.600 mg cada 8 h';
    pintar(box, 'warn', `<strong>Sevelamer ${sev}</strong>, o <strong>acetato cálcico 1.334 mg cada 8 h</strong> (2 comprimidos), subiendo hasta PO₄ &lt;6 mg/dL sin hipercalcemia. Ninguno ha demostrado ser mejor.`);
}

export function init() {
    initCorkboard('marino-renal-corkboard', 'panel-marino-renal-tabs');
    enlazar(['mr-ab-ph', 'mr-ab-pco2', 'mr-ab-hco3'], calcAcidoBase);
    enlazar(['mr-gap-na', 'mr-gap-cl', 'mr-gap-hco3', 'mr-gap-alb'], calcGaps);
    // Gasometría encadenada: el HCO₃⁻ de la primera calculadora pasa a la de los hiatos.
    $('mr-ab-hco3')?.addEventListener('input', () => {
        const de = $('mr-ab-hco3'), a = $('mr-gap-hco3');
        if (!a || de.value === '' || a.value === de.value) return;
        a.value = de.value;
        a.dispatchEvent(new Event('input', { bubbles: true }));
    });
    enlazar(['mr-bicarb-peso', 'mr-bicarb-hco3'], calcBicarbonato);
    enlazar(['mr-cad-peso', 'mr-cad-k', 'mr-cad-glucosa', 'mr-cad-na'], calcCad);
    enlazar(['mr-alc-hco3', 'mr-alc-paco2'], calcAlcalosis);
    wireSelectExplicacion('mr-alc-tipo', 'mr-alc-tipo-resultado', ALC_TIPO);
    enlazar(['mr-cloro-peso', 'mr-cloro-cl'], calcCloro);
    enlazar(['mr-hcl-peso', 'mr-hcl-hco3', 'mr-hcl-ph'], calcHcl);
    enlazar(['mr-kdigo-basal', 'mr-kdigo-actual', 'mr-kdigo-tiempo', 'mr-kdigo-diuresis'], calcKdigo);
    enlazar(['mr-fg-edad', 'mr-fg-peso', 'mr-fg-cr', 'mr-fg-sexo'], calcFg);
    enlazar(['mr-pia-pam', 'mr-pia-valor', 'mr-pia-unidad', 'mr-pia-organo'], calcPia);
    wireSelectExplicacion('mr-mioglobina', 'mr-mioglobina-resultado', {
        neg: 'Tira negativa: no hay mioglobinuria significativa.',
        hematies: 'Tira positiva con hematíes en el sedimento: la sangre puede explicarla. Centrifuga y filtra para salir de dudas.',
        sinhematies: '<strong>Mioglobinuria probable</strong>: tira positiva sin hematíes en el sedimento. Volumen agresivo: salino 10-20 mL/kg y diuresis ≥1 mL/kg/h.',
        filtrada: '<strong>Mioglobina</strong>: sigue positiva tras quitar hematíes (centrifugar) y hemoglobina (filtrar).',
    });
    enlazar(['mr-ind-nau', 'mr-ind-nap', 'mr-ind-cru', 'mr-ind-crp', 'mr-ind-ureau', 'mr-ind-ureap', 'mr-ind-diur'], calcIndices);
    wireSelectExplicacion('mr-trr-objetivo', 'mr-trr-objetivo-resultado', {
        potasio: '<strong>Hemodiálisis</strong>: aclara rápido los solutos pequeños (unas horas bastan para un potasio peligroso).',
        urea: '<strong>Hemodiálisis</strong> intermitente: un día de residuos nitrogenados en una sesión.',
        volumen: '<strong>Hemofiltración continua</strong> (o hemodiafiltración): hasta 3 L/h de líquido y mejor tolerada en el inestable.',
        toxina: '<strong>Hemofiltración</strong> (convección): arrastra moléculas grandes, fármacos, tóxicos y, con poro mayor, citocinas.',
    });
    enlazar(['mr-osm-na', 'mr-osm-glu', 'mr-osm-bun', 'mr-osm-medida'], calcOsm);
    wireSelectExplicacion('mr-hiperna-vec', 'mr-hiperna-vec-resultado', HIPERNA_VEC);
    enlazar(['mr-hiperna-na', 'mr-hiperna-obj'], calcHiperna);
    initSiNoWizard('mr-di-wizard', DI_WIZARD);
    enlazar(['mr-nacorr-na', 'mr-nacorr-glu'], calcNaCorr);
    enlazar(['mr-hc-osm', 'mr-hc-vec', 'mr-hc-nau', 'mr-hc-osmu', 'mr-hc-diur'], calcHiponaClasif);
    enlazar(['mr-sal3-peso', 'mr-sal3-na0', 'mr-sal3-na1', 'mr-sal3-horas', 'mr-sal3-dia'], calcSalino3);
    enlazar(['mr-kperd-ku', 'mr-kperd-clu'], calcKperdida);
    enlazar(['mr-kdef-k', 'mr-kdef-peso', 'mr-kdef-ritmo'], calcKdeficit);
    enlazar([...document.querySelectorAll('.mr-ficticia')].map((c, i) => c.id || (c.id = `mr-ficticia-c${i}`)), calcFicticia);
    enlazar(['mr-hk-k', 'mr-hk-ecg', 'mr-hk-colapso'], calcHiperk);
    enlazar(['mr-camg-prep', 'mr-camg-ml'], calcCalcioMl);
    // 20 mEq/L ya es parada cardíaca (>13); 0,1 mEq/L es el suelo de lo medible. Mismo rango en las tres unidades.
    limitesPorUnidad('mr-mgconv-valor', ['mr-mgconv-unidad'], { mgdl: [0.1, 24], meq: [0.1, 20], mmol: [0.1, 10] });
    enlazar(['mr-mgconv-valor', 'mr-mgconv-unidad'], calcMgConv);
    enlazar(['mr-mgrep-mg', 'mr-mgrep-peso', 'mr-mgrep-clinica', 'mr-mgrep-renal'], calcMgReposicion);
    // La prueba infunde 24 mmol (48 mEq, Tabla 37.5): en la orina no puede salir más de lo infundido.
    limitesPorUnidad('mr-mgret-orina', ['mr-mgret-unidad'], { mmol: [0, 24], meq: [0, 48] });
    enlazar(['mr-mgret-orina', 'mr-mgret-unidad', 'mr-mgret-renal'], calcMgRetencion);
    enlazar(['mr-hipermg-valor'], calcHiperMg);
    // Rangos de fisiología general por parámetro y unidad (factores de la Tabla 38.1: ×0,25 el calcio y ×0,32 el fósforo).
    limitesPorUnidad('mr-caconv-valor', ['mr-caconv-param', 'mr-caconv-unidad'], {
        'total|mgdl': [4, 20], 'total|mmol': [1, 5], 'ionico|mgdl': [2, 10], 'ionico|mmol': [0.5, 2.5],
        'fosforo|mgdl': [0.1, 20], 'fosforo|mmol': [0.1, 6],
    });
    enlazar(['mr-caconv-param', 'mr-caconv-valor', 'mr-caconv-unidad'], calcCaConv);
    enlazar(['mr-capauta-peso', 'mr-capauta-prep', 'mr-capauta-dosis'], calcCaPauta);
    enlazar(['mr-hiperca-ca', 'mr-hiperca-neuro', 'mr-hiperca-volumen', 'mr-hiperca-origen', 'mr-hiperca-clcr'], calcHiperca);
    enlazar(['mr-fosfato-po4', 'mr-fosfato-peso', 'mr-fosfato-k', 'mr-fosfato-indic'], calcFosfato);
    enlazar(['mr-quelante-po4'], calcQuelante);
}
