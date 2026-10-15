// Libros · Marino Nutrición y endocrino — The ICU Book (Marino PL, 5.ª ed.),
// caps. 48-51: necesidades nutricionales, nutrición enteral y parenteral,
// suprarrenal y tiroides. Cuaderno de campo + calculadoras de cada ficha;
// las cifras salen de las tablas y del texto citados en la propia ficha.
import { initCorkboard } from '../../core/corkboard.js';

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
const idsDe = (sel, pref) => [...document.querySelectorAll(sel)].map((c, i) => c.id || (c.id = `${pref}${i}`));
const marcados = sel => [...document.querySelectorAll(sel)].filter(c => c.checked);
const pesoValido = id => { const p = num($(id)); return p !== null && p > 0 ? p : null; };
// Umbrales con el valor que se muestra (REGLAS §1.10): se redondea antes de comparar.
const r1 = v => Math.round(v * 10) / 10;
const r2 = v => Math.round(v * 100) / 100;
// Número sin decimales si es entero y con los que haga falta (hasta `max`) si no: el que se muestra es el que se usa.
const fmtA = (v, max = 1) => v.toLocaleString('es-ES', { maximumFractionDigits: max });

// Dosis de propofol no plausible (conocimiento general, no de la ficha): emulsión de 10 mg/mL y hasta ~4-5 mg/kg/h.
const avisoPropofol = (mlh, peso) => {
    const mgkgh = r1(mlh * 10 / peso);
    return mlh > 0 && mgkgh > 5 ? `<br><strong>Propofol ${fmt(mgkgh, 1)} mg/kg/h: dosis no plausible</strong> (usual hasta ~4-5 mg/kg/h con 10 mg/mL; <em>conocimiento general, no de la ficha</em>). Revisa los mL/h.` : '';
};

// Rangos de los campos (atributos min/max del propio <input>): fisiología general, no de la ficha.
// Un valor fuera de rango no se calcula: se avisa como combinación no fisiológica.
function primeroFueraDeRango(ids) {
    for (const id of ids) {
        const el = $(id), v = num(el);
        if (!el || v === null || (el.min === '' && el.max === '')) continue;
        const min = el.min === '' ? -Infinity : Number(el.min), max = el.max === '' ? Infinity : Number(el.max);
        if (v < min || v > max) return { el, v, min, max };
    }
    return null;
}
export const rangoValido = ids => primeroFueraDeRango(ids) === null;
function fueraDeRango(ids, box) {
    const f = primeroFueraDeRango(ids);
    if (!f) return false;
    const etiqueta = document.querySelector(`label[for="${f.el.id}"]`)?.textContent || f.el.id;
    pintar(box, 'warn', `<strong>Combinación no fisiológica (fuera de rango):</strong> «${etiqueta.trim()}» = ${fmtA(f.v, 2)}; rango ${fmtA(f.min, 2)}-${fmtA(f.max, 2)}. No se calcula. <span class="fuente-ficha">Rangos: fisiología general, no de la ficha.</span>`);
    return true;
}
// Peso para las ecuaciones (Ecuación 48.3): el ajustado si el real supera el 125% del ideal.
export function pesoParaCalculo(real, ideal) {
    if (ideal === null || ideal <= 0 || real <= 1.25 * ideal) return { peso: real, ajustado: false };
    return { peso: (real - ideal) * 0.25 + ideal, ajustado: true };
}

// ---- Cap. 48 — necesidades nutricionales ------------------------------
function calcCr() {
    const vo2 = num($('mu-cr-vo2')), vco2 = num($('mu-cr-vco2')), box = $('mu-cr-resultado');
    if (fueraDeRango(['mu-cr-vo2', 'mu-cr-vco2'], box)) return;
    if (vo2 === null || vco2 === null || vo2 <= 0) return ocultar(box);
    const cr = r2(vco2 / vo2);
    let txt;
    if (cr > 1.0) txt = 'por encima de 1,0, el máximo de la Tabla 48.1 (hidratos): revisa la medida';
    else if (cr >= 0.95) txt = 'cerca de 1,0: predominan los <strong>hidratos de carbono</strong>';
    else if (cr >= 0.75) txt = 'intermedio (0,7 lípidos · 0,8 proteínas · 1,0 hidratos): <strong>combustibles mezclados</strong>';
    else if (cr >= 0.7) txt = 'cerca de 0,7: predominan los <strong>lípidos</strong>';
    else txt = 'por debajo de 0,7, el mínimo de la Tabla 48.1 (lípidos): revisa la medida';
    const corte = cr <= 1 && cr >= 0.7 ? '<br><span class="fuente-ficha">Los cortes 0,75 y 0,95 son ilustrativos de la app: la Tabla 48.1 solo da 0,7, 0,8 y 1,0.</span>' : '';
    pintar(box, cr > 1 || cr < 0.7 ? 'warn' : 'ok', `CR = ${fmtA(vco2, 1)}/${fmtA(vo2, 1)} = <strong>${fmt(cr, 2)}</strong>: ${txt}.${corte}`);
}
function calcGer() {
    const real = pesoValido('mu-ger-peso'), ideal = num($('mu-ger-ideal')), metodo = $('mu-ger-metodo').value, dia = num($('mu-ger-dia')), na = num($('mu-ger-na')) ?? 0, box = $('mu-ger-resultado');
    if (fueraDeRango(['mu-ger-peso', 'mu-ger-ideal', 'mu-ger-dia', 'mu-ger-na'], box)) return;
    if (real === null) return ocultar(box);
    const { peso, ajustado } = pesoParaCalculo(real, ideal);
    const ger = 25 * peso;
    let html = `${ajustado ? `Peso ajustado <strong>${fmtA(peso, 1)} kg</strong> (real &gt;125% del ideal)` : `Peso real ${fmtA(peso, 1)} kg`}. GER = 25 × ${fmtA(peso, 1)} = <strong>${fmt(ger, 0)} kcal/día</strong>${metodo === 'calorimetria' ? ' (mejor medirlo con la calorimetría)' : ''}.`;
    let estado = 'ok';
    if (na > 0.2) {
        html += ` Noradrenalina ${fmt(na, 2)} µg/kg/min (&gt;0,2): considerar <strong>${fmt(10 * peso, 0)}-${fmt(15 * peso, 0)} kcal/día</strong> (10-15 kcal/kg) los primeros 7 días o hasta que mejore.`;
        estado = 'warn';
    } else if (dia !== null) {
        const tope = metodo === 'calorimetria' ? (dia <= 3 ? 0.7 : dia <= 7 ? null : 1) : (dia <= 7 ? 0.7 : 1);
        if (tope === null) html += ` Día ${fmt(dia, 0)}: subir del 70% al 100% (${fmt(0.7 * ger, 0)} → ${fmt(ger, 0)} kcal) a lo largo de la primera semana.`;
        else html += ` Día ${fmt(dia, 0)}: ${tope < 1 ? `no más del 70%, <strong>≤${fmt(0.7 * ger, 0)} kcal/día</strong>` : `el 100%, <strong>${fmt(ger, 0)} kcal/día</strong>`}.`;
    }
    html += ` Proteínas: <strong>${fmt(1.2 * peso, 0)}-${fmt(2.0 * peso, 0)} g/día</strong> (1,2-2,0 g/kg).`;
    pintar(box, estado, html);
}
function calcBalanceN() {
    const prot = num($('mu-bn-prot')), nuu = num($('mu-bn-nuu')), diarrea = $('mu-bn-diarrea').value === 'si', box = $('mu-bn-resultado');
    if (fueraDeRango(['mu-bn-prot', 'mu-bn-nuu'], box)) return;
    if (prot === null || nuu === null) return ocultar(box);
    const entra = prot / 6.25, bMin = r1(entra - (nuu + 6)), bMax = r1(entra - (nuu + 4));
    let html = `Entrada ${fmt(entra, 1)} g N (${fmtA(prot, 1)}/6,25) − salida ${fmtA(nuu + 4, 1)}-${fmtA(nuu + 6, 1)} g (NUU + 4-6) = balance <strong>${fmt(bMin, 1)} a ${fmt(bMax, 1)} g/día</strong>.`;
    if (diarrea) return pintar(box, 'warn', html + ' <strong>Con diarrea, el balance no es fiable.</strong>');
    if (bMin > 20) return pintar(box, 'warn', html + ' <strong>Balance no plausible</strong> (más de +20 g de nitrógeno al día; umbral de aviso: <em>fisiología general, no de la ficha</em>): revisa la proteína y el NUU.');
    if (bMin >= 4) html += ' En el objetivo (positivo de 4-6 g).';
    else if (bMax > 0) html += ' Positivo, pero por debajo del objetivo de 4-6 g.';
    else html += ' <strong>Nulo o negativo</strong>: antes de dar más proteína, asegura las calorías no proteicas.';
    pintar(box, bMin >= 4 ? 'ok' : bMax > 0 ? 'warn' : 'danger', html);
}
function calcTiamina() {
    const pre = marcados('.mu-tia-pre').length, mans = marcados('.mu-tia-man'), man = mans.filter(c => c.value !== 'neuropatia').length, box = $('mu-tia-resultado');
    if (!pre && !mans.length) return pintar(box, 'ok', 'Marca lo que tenga el paciente (Tabla 48.4).');
    const neuro = !man && mans.length ? ' La neuropatía periférica sola no es uno de los 3 signos con los que el capítulo pide sospecharlo (insuficiencia cardíaca, encefalopatía o acidosis láctica sin causa aparente).' : '';
    const pauta = '1) 500 mg IV cada 8 h, 2-3 días; 2) 250 mg IV al día, 3-5 días; 3) 100 mg orales cada 8 h, 1-2 semanas; 4) 100 mg orales al día. Y corregir el magnesio.';
    if (man) return pintar(box, 'danger', `<strong>Sospecha de déficit de tiamina</strong>${pre ? ` (${pre} predisponente${pre > 1 ? 's' : ''} y ${man > 1 ? `${man} manifestaciones` : '1 manifestación'})` : ''}. Pauta de la Tabla 48.4, IV al principio: ${pauta}${neuro}`);
    pintar(box, 'warn', `${pre ? `<strong>Paciente de riesgo</strong> (${pre} predisponente${pre === 1 ? '' : 's'})` : '<strong>Sin predisponentes marcados</strong>'}. Se suelen dar 100 mg/día, que no bastan para corregir un déficit: si aparece una manifestación sin causa aparente, la pauta completa.${neuro}`);
}
function calcFerritina() {
    const box = $('mu-ferritina-resultado');
    if (fueraDeRango(['mu-ferritina'], box)) return;
    const f0 = num($('mu-ferritina')), f = f0 === null ? null : Math.round(f0);
    if (f === null) return ocultar(box);
    if (f < 18) return pintar(box, 'danger', `Ferritina ${fmt(f, 0)} µg/L (&lt;18): <strong>déficit de hierro probable</strong>.`);
    if (f > 100) return pintar(box, 'ok', `Ferritina ${fmt(f, 0)} µg/L (&gt;100): <strong>déficit de hierro improbable</strong>. No dar hierro.`);
    pintar(box, 'warn', `Ferritina ${fmt(f, 0)} µg/L: entre 18 y 100, la ficha no la clasifica.`);
}

// ---- Cap. 49 — nutrición enteral --------------------------------------
function calcEnteral() {
    const ci = marcados('.mu-ent-ci').map(c => c.value), na = num($('mu-ent-na')) ?? 0, box = $('mu-ent-resultado');
    if (fueraDeRango(['mu-ent-na'], box)) return;
    if (ci.length) return pintar(box, 'danger', `<strong>No empezar la enteral</strong>: ${ci.join(' · ')} (Tabla 49.1).`);
    if (na > 0.2) return pintar(box, 'warn', `Sin contraindicaciones. Noradrenalina ${fmt(na, 2)} µg/kg/min (&gt;0,2): empezar con <strong>10-15 kcal/kg/día</strong> los primeros 7 días o hasta que mejore.`);
    pintar(box, 'ok', '<strong>Se puede empezar</strong> en las primeras 48 h. No hace falta oír ruidos intestinales.');
}
function calcGlutamina() {
    const s = $('mu-glut-situacion').value, p = pesoValido('mu-glut-peso'), box = $('mu-glut-resultado');
    if (s === 'otro') return pintar(box, 'ok', 'Fuera del trauma crítico y del quemado &gt;20%: <strong>no suplementar</strong> glutamina.');
    if (fueraDeRango(['mu-glut-peso'], box)) return;
    if (p === null) return ocultar(box);
    if (s === 'trauma') return pintar(box, 'ok', `Trauma crítico: <strong>${fmt(0.2 * p, 0)}-${fmt(0.3 * p, 0)} g/día</strong> (0,2-0,3 g/kg/día) los primeros 5 días de enteral.`);
    pintar(box, 'ok', `Quemado &gt;20%: <strong>${fmt(0.3 * p, 0)}-${fmt(0.5 * p, 0)} g/día</strong> (0,3-0,5 g/kg/día) los primeros 10-15 días.`);
}
const FORMULAS = { isocal: ['Isocal', 1.0, 35], vital: ['Vital 1.0', 1.0, 40], osm12: ['Osmolite 1.2', 1.2, 56], osm15: ['Osmolite 1.5', 1.5, 63], jevity: ['Jevity 1.2', 1.2, 56], twocal: ['Twocal HN', 2.0, 84] };
function calcPauta() {
    const p = pesoValido('mu-pauta-peso'), [nombre, dens, protL] = FORMULAS[$('mu-pauta-formula').value], gkg = num($('mu-pauta-prot')), prop = num($('mu-pauta-propofol-ml')) ?? 0, fase = $('mu-pauta-fase').value, box = $('mu-pauta-resultado');
    if (fueraDeRango(['mu-pauta-peso', 'mu-pauta-prot', 'mu-pauta-propofol-ml'], box)) return;
    if (p === null || gkg === null) return ocultar(box);
    const ger = 25 * p, objetivo = fase === 'inicio' ? 0.7 * ger : ger, propKcal = prop * 1.1 * 24;
    if (prop > 0 && Math.round(propKcal) >= Math.round(objetivo)) return pintar(box, 'danger', `El propofol (${fmtA(prop, 1)} mL/h × 1,1 × 24 = <strong>${fmt(propKcal, 0)} kcal/día</strong>) cubre o supera el objetivo (${fmt(objetivo, 0)} kcal/día): no queda nada por dar por vía enteral con estas cifras. Revisa los datos.${avisoPropofol(prop, p)}`);
    const kcal = Math.max(0, objetivo - propKcal), vol = kcal / dens, ritmo = vol / 24, protDada = vol / 1000 * protL, protNec = gkg * p;
    let html = `GER ${fmt(ger, 0)} kcal/día${fase === 'inicio' ? ` → 70%: ${fmt(objetivo, 0)} (con ecuación, los 7 primeros días; con calorimetría, solo los 3 primeros)` : ''}${prop ? ` − propofol ${fmt(propKcal, 0)} kcal (${fmtA(prop, 1)} mL/h × 1,1 kcal/mL × 24)` : ''} = <strong>${fmt(kcal, 0)} kcal/día</strong>.`;
    html += `<br>${nombre}: ${fmt(vol, 0)} mL/día → <strong>${fmt(ritmo, 0)} mL/h</strong> en perfusión continua.`;
    const falta = protNec - protDada;
    html += avisoPropofol(prop, p);
    html += `<br>Proteína: aporta ${fmt(protDada, 0)} g de ${fmt(protNec, 0)} g necesarios. ${falta > 0 ? `<strong>Faltan ${fmt(falta, 0)} g</strong>: añadir proteína en polvo.` : 'Cubierta.'}`;
    if (dens >= 1.5) html += ' Fórmula densa: solo si hay que restringir volumen.';
    pintar(box, falta > 0 || dens >= 1.5 || avisoPropofol(prop, p) ? 'warn' : 'ok', html);
}
function calcResiduo() {
    const ml0 = num($('mu-grv-ml')), persiste = $('mu-grv-persiste').value === 'si', opi = $('mu-grv-opiaceos').value === 'si', box = $('mu-grv-resultado');
    if (fueraDeRango(['mu-grv-ml'], box)) return;
    if (ml0 === null) return ocultar(box);
    const ml = Math.round(ml0);
    if (ml <= 500) return pintar(box, 'ok', `${fmt(ml, 0)} mL en 6 h: por debajo de 500 mL, <strong>no justifica parar</strong>.`);
    if (persiste) return pintar(box, 'danger', `${fmt(ml, 0)} mL y persiste tras los procinéticos: <strong>avanzar el punto de infusión</strong> (estómago → duodeno, o duodeno → yeyuno).`);
    const proc = opi ? '<strong>naloxona enteral 8 mg por la sonda cada 6 h</strong> (dismotilidad por opiáceos)' : '<strong>eritromicina 100-200 mg IV cada 8 h</strong> (la más eficaz), sola o con metoclopramida 10 mg IV cada 8 h (las dos alargan el QT), no más de 3 días';
    pintar(box, 'warn', `${fmt(ml, 0)} mL en 6 h (&gt;500): <strong>parar temporalmente</strong>, cabecero a ≥30° y probar ${proc}.`);
}

// ---- Cap. 50 — nutrición parenteral -----------------------------------
// La bolsa de NPT paso a paso (Cap. 50): la usan la calculadora y la vista Visual.
export function bolsaNpt(p, gkg, lip, prop) {
    const ger = 25 * p, propKcal = prop * 24, kcal = Math.max(0, ger - propKcal), prot = gkg * p, aaMl = prot / 100 * 1000;
    const lipKcal = lip * 2, d50Kcal = kcal - lipKcal, d50Ml = Math.max(0, d50Kcal / 1.7), total = aaMl + lip + d50Ml + 30, ritmo = total / 24;
    const glucosa = d50Ml * 0.5, mgkgmin = r1(glucosa * 1000 / p / 1440);
    return { ger, propKcal, kcal, prot, aaMl, lipKcal, d50Kcal, d50Ml, total, ritmo, mgkgmin };
}
function calcNpt() {
    const p = pesoValido('mu-npt-peso'), gkg = num($('mu-npt-prot')), lip = num($('mu-npt-lip')) ?? 0, prop = num($('mu-npt-propofol')) ?? 0, riesgo = $('mu-npt-riesgo').value === 'si', box = $('mu-npt-resultado');
    if (fueraDeRango(['mu-npt-peso', 'mu-npt-prot', 'mu-npt-lip', 'mu-npt-propofol'], box)) return;
    if (p === null || gkg === null) return ocultar(box);
    const { ger, propKcal, kcal, prot, aaMl, lipKcal, d50Kcal, d50Ml, total, ritmo, mgkgmin } = bolsaNpt(p, gkg, lip, prop);
    let html = `Paso 1 · ${fmt(ger, 0)} kcal/día${prop ? ` − propofol ${fmt(propKcal, 0)} (${fmtA(prop, 1)} mL/h × 1 kcal/mL × 24)` : ''} = <strong>${fmt(kcal, 0)} kcal</strong>; proteínas <strong>${fmt(prot, 0)} g</strong>.`;
    if (Math.round(propKcal) > Math.round(ger)) return pintar(box, 'danger', html + `<br>El propofol (${fmt(propKcal, 0)} kcal/día) supera por sí solo el GER (${fmt(ger, 0)} kcal/día): revisa las cifras antes de seguir.${avisoPropofol(prop, p)}`);
    html += `<br>Paso 2 · Aminoácidos al 10%: <strong>${fmt(aaMl, 0)} mL</strong>.`;
    if (Math.round(propKcal) + Math.round(lipKcal) > Math.round(ger)) return pintar(box, 'danger', html + `<br>Paso 3 · El propofol (${fmt(propKcal, 0)} kcal) y los lípidos (${fmt(lipKcal, 0)} kcal) suman más que el GER (${fmt(ger, 0)} kcal): reduce los lípidos.${avisoPropofol(prop, p)}`);
    html += `<br>Paso 3 · Lípidos al 20% ${fmt(lip, 0)} mL = ${fmt(lipKcal, 0)} kcal; quedan ${fmt(Math.max(0, d50Kcal), 0)} kcal → <strong>${fmt(d50Ml, 0)} mL de D50</strong> (1,7 kcal/mL).`;
    html += `<br>Paso 4 · ${fmt(aaMl, 0)} + ${fmt(lip, 0)} + ${fmt(d50Ml, 0)} + 30 mL = ${fmt(total, 0)} mL → <strong>${fmt(ritmo, 0)} mL/h</strong>.`;
    if (riesgo) html += ` Con riesgo de realimentación: empezar al 40-50%, <strong>${fmt(0.4 * ritmo, 0)}-${fmt(0.5 * ritmo, 0)} mL/h</strong>, y subir en 4-7 días según fosfato, potasio y magnesio.`;
    html += `<br>Glucosa ${fmt(mgkgmin, 1)} mg/kg/min${mgkgmin > 5 ? ' — <strong>por encima del máximo de 5 mg/kg/min</strong>' : ' (máximo 5)'}.`;
    const lipGkg = r1(lip * 0.2 / p), lipAlto = lipGkg > 1.5;
    if (lipAlto) html += `<br>Lípidos ${fmt(lipGkg, 1)} g/kg/día: <strong>por encima del máximo de 1,5 g/kg/día</strong> del Cap. 48 (págs. 5-6); la Tabla 50.2 del Cap. 50 admite 2,5 g/kg/día (nota de fuentes en Sustratos).`;
    html += avisoPropofol(prop, p);
    pintar(box, mgkgmin > 5 ? 'danger' : riesgo || lipAlto || avisoPropofol(prop, p) ? 'warn' : 'ok', html);
}
function calcRealimentacion() {
    const r = marcados('.mu-real-check').map(c => c.value), p = pesoValido('mu-real-peso'), box = $('mu-real-resultado');
    if (fueraDeRango(['mu-real-peso'], box)) return;
    if (!r.length) return pintar(box, 'ok', 'Sin criterios de alto riesgo de la ASPEN marcados.');
    const kcal = p !== null ? ` (en ${fmtA(p, 1)} kg: <strong>${fmt(10 * p, 0)}-${fmt(15 * p, 0)} kcal/día</strong>)` : '';
    pintar(box, 'danger', `<strong>Alto riesgo de síndrome de realimentación</strong>: ${r.join(' · ')}. Corregir electrolitos y empezar la tiamina antes de nutrir; empezar al 40-50% o 10-15 kcal/kg/día${kcal}, o glucosa a 150 g/día (300 mL de D50), y subir en 4-7 días.`);
}

// ---- Cap. 51 — suprarrenal y tiroides ---------------------------------
function calcCortisol() {
    const shock = $('mu-cortisol-shock').value === 'si', b0 = num($('mu-cortisol-basal')), c60_0 = num($('mu-cortisol-60')), box = $('mu-cortisol-resultado');
    if (shock) return pintar(box, 'warn', 'En el shock séptico <strong>no hace falta el cortisol</strong>: hidrocortisona IV (100 mg cada 8 h) si la hipotensión no responde a volumen y a dosis moderadas de vasopresor.');
    if (fueraDeRango(['mu-cortisol-basal', 'mu-cortisol-60'], box)) return;
    if (b0 === null) return ocultar(box);
    const b = r1(b0);   // cada cifra se compara con el valor que se muestra (REGLAS §1.10)
    // Un cortisol aleatorio ≥35 ya es una función normal: la prueba de ACTH solo se hace si es indeterminado (pág. 51).
    if (b >= 35) return pintar(box, 'ok', `Cortisol ${fmt(b, 1)} µg/dL (≥35): función <strong>normal o adecuada</strong>; el ACTH no hacía falta (se hace cuando el cortisol aleatorio es indeterminado).`);
    if (c60_0 !== null) {
        const c60 = r1(c60_0), inc = r1(c60 - b);
        if (c60 < b) return pintar(box, 'warn', `Cortisol a los 60 min (${fmt(c60, 1)}) por debajo del basal (${fmt(b, 1)}): <strong>combinación no fisiológica</strong> tras 250 µg de ACTH (<em>conocimiento general, no de la ficha</em>). Revisa los datos.`);
        if (b < 10 || inc < 9) return pintar(box, 'danger', `Basal ${fmt(b, 1)}, a los 60 min ${fmt(c60, 1)} µg/dL: aumento de <strong>${fmt(inc, 1)}</strong>. ${b < 10 ? 'Basal &lt;10' : 'Aumento &lt;9'}: <strong>supresión suprarrenal</strong>. Hidrocortisona 200-300 mg/día IV.`);
        return pintar(box, 'ok', `Aumento de <strong>${fmt(inc, 1)} µg/dL</strong> (≥9): respuesta normal. No descarta una supresión secundaria (hipotálamo-hipófisis): haría falta la ACTH plasmática.`);
    }
    if (b < 10) return pintar(box, 'danger', `Cortisol ${fmt(b, 1)} µg/dL (&lt;10): <strong>supresión</strong>. Hidrocortisona 200-300 mg/día IV (100 mg cada 8 h).`);
    pintar(box, 'warn', `Cortisol ${fmt(b, 1)} µg/dL: <strong>indeterminado</strong> (entre 10 y 35). Prueba de ACTH: 250 µg IV y cortisol a los 60 min.`);
}
const EQUIV = { hidro: ['Hidrocortisona', 20], pred: ['Prednisona', 5], metil: ['Metilprednisolona', 4], dexa: ['Dexametasona', 0.75] };
function calcEquivalencia() {
    const de = $('mu-equiv-de').value, d = num($('mu-equiv-dosis')), box = $('mu-equiv-resultado');
    if (fueraDeRango(['mu-equiv-dosis'], box)) return;
    if (d === null) return ocultar(box);
    const unidades = d / EQUIV[de][1];
    const otras = Object.entries(EQUIV).filter(([k]) => k !== de).map(([, [n, e]]) => `${n} <strong>${fmt(unidades * e, e < 1 ? 2 : 1)} mg</strong>`);
    pintar(box, 'ok', `${fmtA(d, 2)} mg de ${EQUIV[de][0].toLowerCase()} equivalen a: ${otras.join(' · ')} (Tabla 51.1).`);
}
const TIROIDES = {
    'alta|baja': ['danger', 'Hipertiroidismo primario'], 'normal|baja': ['warn', 'T3-toxicosis (hipertiroidismo leve o subclínico)'], 'alta|normal': ['warn', 'Hipertiroxinemia eutiroidea'],
    'baja|alta': ['danger', 'Hipotiroidismo primario'], 'baja|baja': ['danger', 'Hipotiroidismo secundario (hipotálamo-hipófisis)'], 'baja|normal': ['warn', 'Eutiroideo enfermo (en el 30-50% de la UCI): no se trata'],
    'normal|normal': ['ok', 'Normal'],
};
function calcTiroides() {
    const t4 = $('mu-ti-t4').value, tsh = $('mu-ti-tsh').value, box = $('mu-ti-resultado');
    if (!t4 || !tsh) return ocultar(box);
    const r = TIROIDES[`${t4}|${tsh}`];
    if (!r) return pintar(box, 'warn', 'Esa combinación no está en la Tabla 51.2.');
    pintar(box, r[0], `<strong>${r[1]}</strong> (Tabla 51.2).`);
}
function calcTormenta() {
    const tipo = $('mu-tor-tipo').value, ica = $('mu-tor-icasma').value, alergia = $('mu-tor-alergia').value === 'si', box = $('mu-tor-resultado'), tormenta = tipo === 'tormenta';
    const lineas = [];
    if (ica === 'crisis') lineas.push('<strong>Betabloqueante</strong>: ninguno — todos están contraindicados en la crisis asmática');
    else if (ica === 'si') lineas.push('<strong>Betabloqueante</strong>: metoprolol 25-50 mg orales 2-3 veces al día (β1-selectivo), o esmolol 50-100 µg/kg/min IV');
    else lineas.push(`<strong>Betabloqueante</strong>: propranolol ${tormenta ? '60-80 mg VO cada 4 h (dosis oral; la IV, en la nota de la tabla 51.3)' : '10-40 mg orales 3-4 veces al día'}`);
    lineas.push(tormenta ? '<strong>Antitiroideo</strong>: propiltiouracilo, carga de 500-1.000 mg y 250 mg cada 4 h (preferido en la tormenta)' : '<strong>Antitiroideo</strong>: metimazol 10-20 mg orales al día (preferido en la tirotoxicosis)');
    if (tormenta || tipo === 'grave') lineas.push(alergia ? '<strong>Alergia al yodo</strong>: litio 300 mg orales cada 8 h' : '<strong>Yodo</strong>: 5 gotas de solución saturada de yoduro potásico («Lugol» en el libro; 250 mg) cada 6 h, siempre con el antitiroideo (ver la nota de fidelidad)');
    if (tormenta) {
        lineas.push('<strong>Hidrocortisona</strong> 300 mg IV y 100 mg cada 8 h; volumen agresivo; tratar el desencadenante');
    }
    pintar(box, tormenta || tipo === 'grave' || ica === 'crisis' ? 'danger' : 'warn', lineas.join('<br>'));
}
function calcLevotiroxina() {
    const s = $('mu-levo-situacion').value, p = pesoValido('mu-levo-peso'), box = $('mu-levo-resultado');
    if (fueraDeRango(['mu-levo-peso'], box)) return;
    if (p === null) return ocultar(box);
    if (s === 'leve') return pintar(box, 'ok', `Levotiroxina oral <strong>${fmt(1.5 * p, 0)}-${fmt(1.8 * p, 0)} µg/día</strong> (1,5-1,8 µg/kg/día), ajustando por la TSH (habitual, 75-150 µg/día).`);
    pintar(box, 'danger', `1) <strong>Hidrocortisona 100 mg IV cada 8 h</strong>, la primera dosis antes de la hormona tiroidea. 2) <strong>Levotiroxina 200-400 µg IV en bolo lento</strong>; luego 50-100 µg orales al día (o ${fmt(1.6 * p, 0)} µg/día = 1,6 µg/kg). Por vía IV, el 75% de la oral (~${fmt(0.75 * 1.6 * p, 0)} µg/día). 3) Opcional: liotironina 5-20 µg IV y 2,5-10 µg cada 8 h.`);
}

export function init() {
    initCorkboard('marino-nutri-corkboard', 'panel-marino-nutri-tabs');
    enlazar(['mu-cr-vo2', 'mu-cr-vco2'], calcCr);
    enlazar(['mu-ger-peso', 'mu-ger-ideal', 'mu-ger-metodo', 'mu-ger-dia', 'mu-ger-na'], calcGer);
    enlazar(['mu-bn-prot', 'mu-bn-nuu', 'mu-bn-diarrea'], calcBalanceN);
    enlazar(idsDe('.mu-tia-pre, .mu-tia-man', 'mu-tia-c'), calcTiamina);
    enlazar(['mu-ferritina'], calcFerritina);
    enlazar([...idsDe('.mu-ent-ci', 'mu-ent-c'), 'mu-ent-na'], calcEnteral);
    enlazar(['mu-glut-situacion', 'mu-glut-peso'], calcGlutamina);
    enlazar(['mu-pauta-peso', 'mu-pauta-formula', 'mu-pauta-prot', 'mu-pauta-propofol-ml', 'mu-pauta-fase'], calcPauta);
    enlazar(['mu-grv-ml', 'mu-grv-persiste', 'mu-grv-opiaceos'], calcResiduo);
    enlazar(['mu-npt-peso', 'mu-npt-prot', 'mu-npt-lip', 'mu-npt-propofol', 'mu-npt-riesgo'], calcNpt);
    // NPT encadenada: el peso de cálculo (real, o ajustado si supera el 125% del ideal) de la calculadora de energía.
    $('mu-npt-desde-ger')?.addEventListener('click', () => {
        const real = pesoValido('mu-ger-peso'), msg = $('mu-npt-desde-ger-msg');
        if (real === null) { msg.textContent = 'Rellena antes el peso en la calculadora de energía.'; return; }
        const { peso, ajustado } = pesoParaCalculo(real, num($('mu-ger-ideal')));
        $('mu-npt-peso').value = Math.round(peso * 10) / 10;
        $('mu-npt-peso').dispatchEvent(new Event('input', { bubbles: true }));
        msg.textContent = ajustado ? `Peso ajustado: ${fmtA(peso, 1)} kg.` : `Peso real: ${fmtA(peso, 1)} kg.`;
    });
    enlazar([...idsDe('.mu-real-check', 'mu-real-c'), 'mu-real-peso'], calcRealimentacion);
    enlazar(['mu-cortisol-shock', 'mu-cortisol-basal', 'mu-cortisol-60'], calcCortisol);
    enlazar(['mu-equiv-de', 'mu-equiv-dosis'], calcEquivalencia);
    enlazar(['mu-ti-t4', 'mu-ti-tsh'], calcTiroides);
    enlazar(['mu-tor-tipo', 'mu-tor-icasma', 'mu-tor-alergia'], calcTormenta);
    enlazar(['mu-levo-situacion', 'mu-levo-peso'], calcLevotiroxina);
}
