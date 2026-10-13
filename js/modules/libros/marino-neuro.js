// Libros · Marino Neurología — The ICU Book (Marino PL, 5.ª ed.), caps. 45-47:
// consciencia (delirio, abstinencia, coma, muerte encefálica), movimiento
// (convulsiones, miastenia, Guillain-Barré, relajantes) e ictus.
// Cuaderno de campo + calculadoras de cada ficha; las cifras salen de las
// tablas y del texto citados en la propia ficha.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';

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
function selector(selectId, boxId, datos) {
    enlazar([selectId], () => {
        const v = $(selectId)?.value, box = $(boxId);
        if (!v || !datos[v]) return ocultar(box);
        pintar(box, datos[v][0], datos[v][1]);
    });
}
const pesoValido = id => { const p = num($(id)); return p !== null && p > 0 ? p : null; };

// ---- Cap. 45 — consciencia --------------------------------------------
function calcCam() {
    const v = [1, 2, 3, 4].map(i => $(`mn-cam-${i}`)?.value), box = $('mn-cam-resultado');
    if (v.every(x => !x)) return ocultar(box);
    const [i, ii, iii, iv] = v.map(x => x === 'si');
    if (v[0] === 'no' || v[1] === 'no') return pintar(box, 'ok', '<strong>CAM-ICU negativo</strong>: hacen falta los criterios I y II.');
    if (!v[0] || !v[1]) return pintar(box, 'warn', 'Responde los criterios I y II: son los dos obligatorios.');
    if (iii || iv) return pintar(box, 'danger', `<strong>CAM-ICU positivo: delirio</strong> (I + II + ${iii && iv ? 'III y IV' : iii ? 'III' : 'IV'}).`);
    if (v[2] === 'no' && v[3] === 'no') return pintar(box, 'ok', '<strong>CAM-ICU negativo</strong>: con I y II hace falta además III o IV.');
    pintar(box, 'warn', 'I y II presentes: responde III y IV (basta uno de los dos).');
}
function calcDex() {
    const p = pesoValido('mn-dex-peso'), box = $('mn-dex-resultado');
    if (p === null) return ocultar(box);
    pintar(box, 'ok', `Carga opcional: <strong>${fmt(p, 0)} µg</strong> (1 µg/kg) en 10 min. Mantenimiento: <strong>${fmt(0.2 * p, 0)}-${fmt(1.5 * p, 0)} µg/h</strong> (0,2-1,5 µg/kg/h). Vigila bradicardia e hipotensión.`);
}
const ABSTINENCIA = [
    [6, 8, 1, 2, 'Abstinencia precoz: ansiedad, náuseas, temblor'],
    [6, 48, 2, 3, 'Convulsiones generalizadas (una o dos)'],
    [12, 48, 1, 2, 'Alucinaciones visuales, auditivas o táctiles'],
    [48, 96, 3, 5, 'Delirium tremens'],
];
function calcAbstinencia() {
    const h = num($('mn-oh-horas')), box = $('mn-oh-resultado');
    if (h === null || h < 0) return ocultar(box);
    const ahora = ABSTINENCIA.filter(([a, , , dmax]) => h >= a && h <= a + dmax * 24).map(r => r[4]);
    const prox = ABSTINENCIA.filter(([a]) => h < a).map(r => `${r[4]} (desde las ${r[0]} h)`);
    let html = ahora.length ? `A las ${fmt(h, 0)} h puede haber: <strong>${ahora.join(' · ')}</strong>.` : `A las ${fmt(h, 0)} h ya no encaja ningún rasgo de la Tabla 45.3 por su comienzo y duración.`;
    if (prox.length) html += ` Aún puede llegar: ${prox.join(' · ')}.`;
    if (h > 96 + 5 * 24) html += ' Un delirio que dura más de 5 días obliga a buscar otra causa.';
    pintar(box, ahora.some(x => x.startsWith('Delirium') || x.startsWith('Convulsiones')) ? 'danger' : ahora.length ? 'warn' : 'ok', html);
}
function calcLorazepam() {
    const p = pesoValido('mn-lzp-peso'), r = num($('mn-lzp-ritmo')), h = num($('mn-lzp-horas')), box = $('mn-lzp-resultado');
    if (p === null || r === null) return ocultar(box);
    const mgkgh = r / p, alto = mgkgh >= 0.1;
    let html = `${fmt(r, 1)} mg/h en ${fmt(p, 0)} kg = <strong>${fmt(mgkgh, 3)} mg/kg/h</strong>. `;
    if (!alto) return pintar(box, 'ok', html + 'Por debajo de la dosis alta (≥0,1 mg/kg/h).');
    html += 'Dosis alta (≥0,1 mg/kg/h): ';
    if (h !== null && h > 48) return pintar(box, 'danger', html + `<strong>${fmt(h, 0)} h: más de 48 h</strong>, riesgo de toxicidad por propilenglicol. Retirar o cambiar.`);
    pintar(box, 'warn', html + `no más de 48 h${h !== null ? ` (lleva ${fmt(h, 0)} h)` : ''} por el propilenglicol.`);
}
const PUPILAS = {
    dilR: ['warn', '<strong>Dilatadas, reactivas</strong>: atropina y anticolinérgicos, agonistas adrenérgicos (dopamina), estimulantes (anfetaminas) o crisis no convulsivas.'],
    dilNR: ['danger', '<strong>Dilatadas, no reactivas</strong>: lesión cerebral difusa, hipotermia (&lt;28 °C) o compresión del tronco por una masa en expansión o hipertensión intracraneal.'],
    uni: ['danger', '<strong>Una dilatada y fija</strong>: masa intracraneal en expansión (herniación uncal), trauma o cirugía ocular, o crisis focal.'],
    medR: ['warn', '<strong>Medias, reactivas</strong>: encefalopatía tóxica o metabólica, sobredosis de sedantes o bloqueo neuromuscular.'],
    medNR: ['danger', '<strong>Medias, no reactivas</strong>: fallo hepático agudo, encefalopatía postanóxica o muerte encefálica.'],
    horner: ['warn', '<strong>Una más pequeña</strong>: síndrome de Horner.'],
    puntR: ['warn', '<strong>Puntiformes, reactivas</strong>: sobredosis de opiáceos o encefalopatía tóxica o metabólica.'],
    puntNR: ['danger', '<strong>Puntiformes, no reactivas</strong>: hipercapnia o lesión pontina.'],
};
function calcGcs() {
    const o = Number($('mn-gcs-o').value), vv = $('mn-gcs-v').value, m = Number($('mn-gcs-m').value), box = $('mn-gcs-resultado');
    const intubado = vv === 'T', v = intubado ? 1 : Number(vv), total = o + v + m;
    let html = `GCS <strong>${total}${intubado ? 'T' : ''}</strong> (O${o} V${intubado ? 'T' : v} M${m}; máximo ${intubado ? 11 : 15}).`;
    if ($('mn-gcs-contexto').value === 'no') return pintar(box, 'warn', html + ' <strong>No es fiable</strong> con relajantes, sedación profunda o hipotensión.');
    const usos = [];
    if (total <= 8) usos.push('<strong>Coma</strong> (≤8)', 'los reflejos de la vía aérea suelen fallar: valorar intubar');
    usos.push(`${usos.length ? 'traumatismo' : 'Traumatismo'} craneal ${total >= 13 ? 'leve (13-15)' : total >= 9 ? 'moderado (9-12)' : 'grave (≤8)'}`);
    pintar(box, total <= 8 ? 'danger' : total <= 12 ? 'warn' : 'ok', `${html} ${usos.join('; ')}.`);
}
function calcMuerte() {
    const grupos = { pre: '.mn-me-pre', causa: '.mn-me-causa', tronco: '.mn-me-tronco', apnea: '.mn-me-apnea' };
    const falta = Object.entries(grupos).filter(([, s]) => [...document.querySelectorAll(s)].some(c => !c.checked)).map(([k]) => k);
    const conf = $('mn-me-confirmatoria')?.checked, box = $('mn-me-resultado');
    const nombres = { pre: 'requisitos previos (paso 1)', causa: 'causa del coma (paso 2)', tronco: 'exploración del tronco, dos veces (paso 3)', apnea: 'test de apnea (paso 4)' };
    if (!falta.length) return pintar(box, 'ok', '<strong>Pasos 1-4 confirmados</strong>: se puede declarar la muerte legal.');
    if (conf) return pintar(box, 'ok', `<strong>Prueba confirmatoria positiva</strong>: se puede declarar la muerte legal aunque falten ${falta.map(k => nombres[k]).join(', ')}.`);
    pintar(box, falta.includes('pre') || falta.includes('causa') ? 'danger' : 'warn', `Falta: ${falta.map(k => nombres[k]).join(' · ')}. Si no se pueden completar o interpretar, prueba confirmatoria (paso 5).`);
}
function calcApnea() {
    const b = num($('mn-apnea-basal')), f = num($('mn-apnea-final')), esf = $('mn-apnea-esfuerzo').value === 'si', box = $('mn-apnea-resultado');
    if (b === null) return ocultar(box);
    const obj = Math.max(b + 20, 61), min = (obj - b) / 3;
    let html = `Objetivo: PaCO₂ <strong>≥${fmt(obj, 0)} mmHg</strong> (&gt;60 y ≥20 sobre ${fmt(b, 0)}). A unos 3 mmHg/min: <strong>~${fmt(Math.ceil(min), 0)} min</strong> de apnea.`;
    if (esf) return pintar(box, 'ok', html + ' <strong>Hay esfuerzos respiratorios</strong>: el test no confirma la muerte encefálica.');
    if (f === null) return pintar(box, 'warn', html);
    if (f >= obj) return pintar(box, 'danger', `${html} Al final, ${fmt(f, 0)} mmHg sin esfuerzos: <strong>test compatible con muerte encefálica</strong>.`);
    pintar(box, 'warn', `${html} Al final, ${fmt(f, 0)} mmHg: <strong>no alcanza el objetivo</strong>; el test no es concluyente.`);
}

// ---- Cap. 46 — movimiento ---------------------------------------------
function calcSe() {
    const p = pesoValido('mn-se-peso'), box = $('mn-se-resultado');
    if (p === null) return ocultar(box);
    const d = (mgkg, max) => Math.min(mgkg * p, max);
    pintar(box, 'ok', `<strong>Paso 1</strong> · Lorazepam ${fmt(d(0.1, 4), 1)} mg IV en 2 min (0,1 mg/kg, máx. 4) · o midazolam ${fmt(d(0.15, 10), 1)} mg IV o IM (0,15 mg/kg, máx. 10).<br><strong>Paso 2</strong> · Levetiracetam ${fmt(d(60, 4500), 0)} mg IV (60 mg/kg, máx. 4.500) · fosfenitoína ${fmt(d(20, 1500), 0)} mg EF (20 mg EF/kg, máx. 1.500) · valproico ${fmt(d(40, 3000), 0)} mg IV (40 mg/kg, máx. 3.000).<br><strong>Paso 3</strong> (intubado) · Propofol bolo ${fmt(p, 0)}-${fmt(2 * p, 0)} mg · midazolam carga ${fmt(0.2 * p, 0)} mg · pentobarbital carga ${fmt(5 * p, 0)}-${fmt(15 * p, 0)} mg.`);
}
export const SE_WIZARD = {
    inicio: { pregunta: '¿Crisis de ≥5 minutos, o dos o más sin recuperar la consciencia entre ellas?', si: 'paso1', no: { estado: 'tfg-estado-ok', final: 'No cumple la definición de estado epiléptico. Si la consciencia sigue alterada, piensa en un estado no convulsivo: EEG.' } },
    paso1: { pregunta: 'Paso 1 · Lorazepam 0,1 mg/kg IV (o midazolam IM), repetible a los 5 min. ¿Ha cedido?', si: { estado: 'tfg-estado-ok', final: 'Controlado con benzodiacepinas. Busca la causa y vigila que no recurra.' }, no: 'paso2' },
    paso2: { pregunta: 'Paso 2 · Levetiracetam, fosfenitoína o valproico (son equivalentes; cortan la mitad). ¿Ha cedido?', si: { estado: 'tfg-estado-warn', final: 'Controlado en el paso 2. Mantener el anticonvulsivo (p. ej., levetiracetam 1.000 mg IV cada 12 h).' }, no: { estado: 'tfg-estado-danger', final: 'Estado epiléptico refractario (10-15%): intubar y ventilar, y dosis anestésicas de propofol, midazolam o pentobarbital (Tabla 46.4), con EEG continuo.' } },
};
const MIASTENIA = {
    aminoglucosido: ['danger', 'Aminoglucósido: <strong>puede empeorar la miastenia</strong> (Tabla 46.5).'],
    quinolona: ['danger', 'Fluoroquinolona: <strong>puede empeorar la miastenia</strong>.'],
    macrolido: ['danger', 'Macrólido: <strong>puede empeorar la miastenia</strong>.'],
    penicilina: ['danger', 'Penicilina: <strong>puede empeorar la miastenia</strong>.'],
    betabloq: ['danger', 'Betabloqueante: <strong>puede empeorar la miastenia</strong>.'],
    calcioant: ['danger', 'Calcioantagonista: <strong>puede empeorar la miastenia</strong>.'],
    ia: ['danger', 'Antiarrítmico Ia: <strong>puede empeorar la miastenia</strong>.'],
    bnm: ['danger', 'Relajantes, despolarizantes y no despolarizantes: <strong>pueden empeorar la miastenia</strong>.'],
    corticoide: ['warn', 'Corticoides a dosis altas: <strong>pueden empeorarla</strong>, aunque también se usan para tratarla. Mejor no si responde a IgIV o plasmaféresis.'],
    magnesio: ['danger', 'Magnesio: <strong>puede empeorar la miastenia</strong>.'],
    litio: ['danger', 'Litio: <strong>puede empeorar la miastenia</strong>.'],
    inhalado: ['danger', 'Anestésico inhalado: <strong>puede empeorar la miastenia</strong>.'],
};
function calcIntubarMg() {
    const p = pesoValido('mn-mg-peso'), cv = num($('mn-mg-cv')), pim = num($('mn-mg-pim')), box = $('mn-mg-resultado');
    if (p === null || (cv === null && pim === null)) return ocultar(box);
    const motivos = [], partes = [];
    if (cv !== null) { const ml = cv / p; partes.push(`CV ${fmt(cv, 0)} mL = ${fmt(ml, 1)} mL/kg`); if (ml <= 15 || cv < 1000) motivos.push('capacidad vital ≤15 mL/kg o &lt;1 L'); }
    if (pim !== null) { partes.push(`PIM ${fmt(pim, 0)} cmH₂O`); if (pim >= -20) motivos.push('presión inspiratoria máxima de −20 cmH₂O o menos negativa'); }
    if (motivos.length) return pintar(box, 'danger', `${partes.join(' · ')}: <strong>pensar seriamente en intubar</strong> (${motivos.join('; ')}). No esperar a que esté in extremis.`);
    pintar(box, 'ok', `${partes.join(' · ')}: por encima de los umbrales. Vigilar con frecuencia: puede empeorar muy rápido.`);
}
function calcMgGbs() {
    const sel = [...document.querySelectorAll('.mn-gm')], v = sel.map(s => s.value).filter(Boolean), box = $('mn-gm-resultado');
    if (!v.length) return ocultar(box);
    const mg = v.filter(x => x === 'mg').length, gbs = v.length - mg;
    const lado = mg > gbs ? '<strong>miastenia gravis</strong>' : gbs > mg ? '<strong>Guillain-Barré</strong>' : 'ninguno de los dos (empate)';
    pintar(box, mg === gbs ? 'warn' : 'ok', `${v.length}/6 rasgos: ${mg} de miastenia y ${gbs} de Guillain-Barré. Orienta a ${lado} (Tabla 46.6).`);
}
function calcBnm() {
    const p = pesoValido('mn-bnm-peso'), contra = $('mn-bnm-contra').value === 'si', prof = $('mn-bnm-profundidad').value, box = $('mn-bnm-resultado');
    if (p === null) return ocultar(box);
    const sug = { inmediato: 16, profundo: 4, moderado: 2 }[prof];
    let html = contra ? '<strong>Succinilcolina contraindicada</strong>: usa ' : `Succinilcolina <strong>${fmt(p, 0)}-${fmt(1.5 * p, 0)} mg</strong> (1-1,5 mg/kg), o `;
    html += `rocuronio <strong>${fmt(p, 0)} mg</strong> (1,0 mg/kg; inicio equivalente). Cisatracurio ${fmt(0.15 * p, 1)}-${fmt(0.2 * p, 1)} mg (0,15-0,2 mg/kg).`;
    html += `<br>Revertir el rocuronio: sugammadex <strong>${fmt(sug * p, 0)} mg</strong> (${sug} mg/kg, bloqueo ${prof === 'inmediato' ? 'recién puesto' : prof})`;
    html += prof === 'moderado' ? `, o neostigmina hasta <strong>${fmt(0.07 * p, 1)} mg</strong> (70 µg/kg, nunca más).` : '.';
    pintar(box, contra ? 'warn' : 'ok', html);
}

// ---- Cap. 47 — ictus --------------------------------------------------
function calcO2() {
    const s = num($('mn-o2-sat')), lleva = $('mn-o2-lleva').value === 'si', box = $('mn-o2-resultado');
    if (s === null) return ocultar(box);
    if (s < 90) return pintar(box, 'danger', `SaO₂ ${fmt(s, 0)}%: <strong>hipoxemia</strong> (&lt;90%). Oxígeno, con objetivo 90-92%.`);
    if (s <= 92) return pintar(box, 'ok', `SaO₂ ${fmt(s, 0)}%: en el objetivo del autor (90-92%).`);
    pintar(box, lleva ? 'warn' : 'ok', lleva ? `SaO₂ ${fmt(s, 0)}% con oxígeno: <strong>por encima de 92%</strong>. El autor aconseja bajarlo hasta 90-92% (la guía pide &gt;94%).` : `SaO₂ ${fmt(s, 0)}% sin oxígeno: no hace falta.`);
}
function calcPaIctus() {
    const e = $('mn-pa-escenario').value, s = num($('mn-pa-pas')), d = num($('mn-pa-pad')), ic = $('mn-pa-ic').value === 'si', box = $('mn-pa-resultado');
    if (s === null || d === null) return ocultar(box);
    const pa = `${fmt(s, 0)}/${fmt(d, 0)} mmHg`;
    if (e === 'nada') {
        if (s > 220 || d > 120 || ic) return pintar(box, 'warn', `${pa}: <strong>bajarla</strong>${ic ? ' (hay otra indicación)' : ' (&gt;220/120)'}, sin pasar del <strong>15%</strong> en 24 h: hasta ~${fmt(s * 0.85, 0)}/${fmt(d * 0.85, 0)}. Labetalol, nicardipina o clevidipina (Tabla 47.2).`);
        return pintar(box, 'ok', `${pa}: <strong>no bajarla</strong>. Mantiene el flujo de la penumbra (solo si &gt;220/120 las primeras 72 h).`);
    }
    const sobre = s > 180 || d > 105;
    const extra = e === 'trombectomia' ? ' Tras trombectomía no hay acuerdo: la guía pide &lt;180/105 y otros protocolos &lt;140/90.' : '';
    pintar(box, sobre ? 'danger' : 'ok', `${pa}: objetivo <strong>&lt;180/105 durante 24 h</strong>. ${sobre ? 'Por encima: bajarla.' : 'En objetivo.'}${extra}`);
}
const HIPER = { 3: [513, 'mlkg', 5, '250 mL o 5 mL/kg'], 5: [856, 'fijo', 100, '100 mL'], 7.5: [1293, 'rango', [2, 4], '100 mL o 2-4 mL/kg'], 14.6: [2500, 'texto', null, '24-48 mL'], 23.4: [4000, 'rango', [0.68, 2], '30 mL o 0,68-2 mL/kg'] };
function calcHiper() {
    const k = $('mn-hiper-sol').value, p = pesoValido('mn-hiper-peso'), na = num($('mn-hiper-na')), box = $('mn-hiper-resultado');
    const [conc, tipo, x, txt] = HIPER[k];
    let vol = txt;
    if (p !== null && tipo === 'mlkg') vol = `${fmt(x * p, 0)} mL (5 mL/kg) o 250 mL`;
    if (p !== null && tipo === 'rango') vol = `${fmt(x[0] * p, 0)}-${fmt(x[1] * p, 0)} mL (${txt.split(' o ')[1]}) o ${txt.split(' o ')[0]}`;
    let html = `NaCl ${k.replace('.', ',')}% (${fmt(conc, 0)} mEq/L de Na⁺${k === '7.5' ? '; no comercializado' : ''}): bolo de <strong>${vol}</strong>. Mejor en bolos que en perfusión.`;
    let estado = 'ok';
    if (na !== null) {
        if (na >= 155) { html += ` Na⁺ ${fmt(na, 0)}: <strong>en el techo del objetivo</strong> (145-155): no subirlo más.`; estado = 'danger'; }
        else if (na >= 145) html += ` Na⁺ ${fmt(na, 0)}: dentro del objetivo (145-155).`;
        else { html += ` Na⁺ ${fmt(na, 0)}: por debajo del objetivo (145-155).`; estado = 'warn'; }
    }
    pintar(box, estado, html);
}
function calcReversion() {
    const f = $('mn-rev-farmaco').value, p = pesoValido('mn-rev-peso'), inr = num($('mn-rev-inr')), dosis = num($('mn-rev-dosis')), horas = $('mn-rev-horas').value, andex = $('mn-rev-andexanet').value === 'si', box = $('mn-rev-resultado');
    $('mn-rev-inr-g').style.display = f === 'warfarina' ? '' : 'none';
    $('mn-rev-dosis-g').style.display = ['apixaban', 'rivaroxaban', 'heparina', 'enoxaparina'].includes(f) ? '' : 'none';
    $('mn-rev-horas-g').style.display = ['apixaban', 'rivaroxaban'].includes(f) ? '' : 'none';
    $('mn-rev-andexanet-g').style.display = ['apixaban', 'rivaroxaban'].includes(f) ? '' : 'none';
    const pk = (u) => p !== null ? `${fmt(u * p, 0)} U` : `${u} U/kg`;
    const aviso = ' <em>Cifra de la fuente; ver la nota de fidelidad de la tabla.</em>';
    if (f === 'warfarina') {
        if (inr === null) return ocultar(box);
        if (inr < 2) return pintar(box, 'warn', `INR ${fmt(inr, 1)}: la Tabla 47.4 da el CCP a partir de INR 2. Vitamina K 10 mg IV.`);
        const u = inr <= 4 ? 25 : inr <= 6 ? 35 : 50;
        return pintar(box, 'danger', `INR ${fmt(inr, 1)}: <strong>vitamina K 10 mg IV</strong> + <strong>CCP de 4 factores ${pk(u)}</strong> (${u} U/kg). La vitamina K empieza a las 2 h y es máxima a las 24 h.`);
    }
    if (f === 'dabigatran') return pintar(box, 'danger', `<strong>Idarucizumab 2,5 mg IV en bolo</strong>, repetido a los 15 min.${aviso} Si no hay: CCP de 4 factores ${pk(50)} (50 U/kg).`);
    if (f === 'apixaban' || f === 'rivaroxaban') {
        if (!andex) return pintar(box, 'danger', `Sin andexanet: <strong>CCP de 4 factores ${pk(50)}</strong> (50 U/kg).`);
        const lim = f === 'apixaban' ? 5 : 10, motivos = [];
        if (dosis !== null && dosis > lim) motivos.push(`última dosis &gt;${lim} mg`);
        if (horas === 'menos8') motivos.push('&lt;8 h desde la dosis');
        if (horas === 'desconocido') motivos.push('hora desconocida');
        const alta = motivos.length > 0;
        const porque = alta ? motivos.join(', ') : `${dosis !== null ? `≤${lim} mg` : `dosis sin indicar (pauta baja si fue ≤${lim} mg)`} y ≥8 h`;
        return pintar(box, 'danger', `<strong>Andexanet alfa, pauta ${alta ? 'alta' : 'baja'}</strong> (${porque}): bolo de ${alta ? 800 : 400} mg IV (a 30 mg/min) y luego ${alta ? 8 : 4} mg/min hasta 120 min.`);
    }
    if (f === 'heparina') return dosis === null ? ocultar(box) : pintar(box, 'danger', `<strong>Protamina ${fmt(dosis / 100, 0)} mg</strong> (1 mg por cada 100 U de la última dosis, ${fmt(dosis, 0)} U).`);
    if (f === 'enoxaparina') return dosis === null ? ocultar(box) : pintar(box, 'danger', `<strong>Protamina ${fmt(dosis, 0)} mg</strong> (1 mg por mg de la última dosis). Menos eficaz que con la heparina.`);
    pintar(box, 'warn', `<strong>Desmopresina ${p !== null ? `${fmt(3 * p, 0)} µg` : '3 µg/kg'}</strong> SC o IV (3 µg/kg), repetible una vez.${aviso}`);
}
function calcPpc() {
    const pam = num($('mn-ppc-pam')), pic = num($('mn-ppc-pic')), box = $('mn-ppc-resultado');
    if (pam === null || pic === null) return ocultar(box);
    const ppc = pam - pic, pics = pic >= 20 ? ` PIC ${fmt(pic, 0)}: <strong>≥20 mmHg</strong>, por encima del objetivo (drenar LCR).` : '';
    if (ppc < 50) return pintar(box, 'danger', `PPC = ${fmt(pam, 0)} − ${fmt(pic, 0)} = <strong>${fmt(ppc, 0)} mmHg</strong>: por debajo del objetivo (50-70).${pics}`);
    if (ppc > 70) return pintar(box, pic >= 20 ? 'danger' : 'warn', `PPC = <strong>${fmt(ppc, 0)} mmHg</strong>: por encima del objetivo razonable (50-70).${pics}`);
    pintar(box, pic >= 20 ? 'danger' : 'ok', `PPC = <strong>${fmt(ppc, 0)} mmHg</strong>: en el objetivo (50-70).${pics}`);
}
function calcNimodipino() {
    const d = num($('mn-nimo-dia')), box = $('mn-nimo-resultado');
    if (d === null || d < 0) return ocultar(box);
    const partes = [];
    partes.push(d <= 21 ? `<strong>Nimodipino 60 mg orales cada 4 h</strong> (día ${fmt(d, 0)} de 21)` : 'Nimodipino ya terminado (3 semanas)');
    if (d >= 4 && d <= 14) partes.push('<strong>ventana de la isquemia cerebral diferida (días 4-14)</strong>: exploraciones frecuentes; un déficit focal nuevo o una caída de 2 puntos del Glasgow la sugieren');
    else if (d < 4) partes.push(`la isquemia diferida empieza hacia el día 4 (faltan ${fmt(4 - d, 0)} días)`);
    if (d <= 3) partes.push('excluir el aneurisma mejor en estos 3 días');
    else if (d <= 10) partes.push('si el aneurisma sigue sin excluir, no retrasarlo más de 7-10 días');
    pintar(box, d >= 4 && d <= 14 ? 'danger' : d <= 21 ? 'warn' : 'ok', partes.join('. ') + '.');
}

export function init() {
    initCorkboard('marino-neuro-corkboard', 'panel-marino-neuro-tabs');
    enlazar(['mn-cam-1', 'mn-cam-2', 'mn-cam-3', 'mn-cam-4'], calcCam);
    enlazar(['mn-dex-peso'], calcDex);
    enlazar(['mn-oh-horas'], calcAbstinencia);
    enlazar(['mn-lzp-peso', 'mn-lzp-ritmo', 'mn-lzp-horas'], calcLorazepam);
    selector('mn-pup-select', 'mn-pup-resultado', PUPILAS);
    enlazar(['mn-gcs-o', 'mn-gcs-v', 'mn-gcs-m', 'mn-gcs-contexto'], calcGcs);
    enlazar([...idsDe('.mn-me-pre, .mn-me-causa, .mn-me-tronco, .mn-me-apnea', 'mn-me-c'), 'mn-me-confirmatoria'], calcMuerte);
    enlazar(['mn-apnea-basal', 'mn-apnea-final', 'mn-apnea-esfuerzo'], calcApnea);
    enlazar(['mn-se-peso'], calcSe);
    initSiNoWizard('mn-se-wizard', SE_WIZARD);
    selector('mn-mg-farmaco', 'mn-mg-farmaco-resultado', MIASTENIA);
    enlazar(['mn-mg-peso', 'mn-mg-cv', 'mn-mg-pim'], calcIntubarMg);
    enlazar(idsDe('.mn-gm', 'mn-gm-c'), calcMgGbs);
    enlazar(['mn-bnm-peso', 'mn-bnm-contra', 'mn-bnm-profundidad'], calcBnm);
    enlazar(['mn-o2-sat', 'mn-o2-lleva'], calcO2);
    enlazar(['mn-pa-escenario', 'mn-pa-pas', 'mn-pa-pad', 'mn-pa-ic'], calcPaIctus);
    enlazar(['mn-hiper-sol', 'mn-hiper-peso', 'mn-hiper-na'], calcHiper);
    enlazar(['mn-rev-farmaco', 'mn-rev-peso', 'mn-rev-inr', 'mn-rev-dosis', 'mn-rev-horas', 'mn-rev-andexanet'], calcReversion);
    enlazar(['mn-ppc-pam', 'mn-ppc-pic'], calcPpc);
    enlazar(['mn-nimo-dia'], calcNimodipino);
}
