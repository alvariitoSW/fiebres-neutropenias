// Libros · Marino Tóxicos y apéndices — The ICU Book (Marino PL, 5.ª ed.),
// caps. 52-53 (sobredosis de fármacos y tóxicos no farmacológicos) y
// Apéndices 1-3 (unidades, valores de referencia y "el cuerpo fantástico").
// Cuaderno de campo + calculadoras y el simulador del CO; las cifras salen
// de las tablas y del texto citados en la propia ficha.
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
const pesoValido = id => { const p = num($(id)); return p !== null && p > 0 ? p : null; };

// ---- Cap. 52 — sobredosis de fármacos ---------------------------------
// Líneas del nomograma (Figura 52.3): rectas en escala logarítmica entre los
// extremos que da el texto (150→5 y 300→10 µg/mL de las 4 a las 24 h).
export const lineaNomograma = (t, inicio, fin) => inicio * Math.pow(fin / inicio, (t - 4) / 20);
function calcNomograma() {
    const t = num($('mt-nomo-horas')), nivel = num($('mt-nomo-nivel')), tipo = $('mt-nomo-tipo').value, box = $('mt-nomo-resultado');
    if (tipo === 'repetida') return pintar(box, 'warn', '<strong>Dosis supraterapéuticas repetidas</strong>: el nomograma no sirve y el nivel no predice el riesgo. NAC si hay transaminasas altas o posible hepatotoxicidad.');
    if (t === null || nivel === null) return ocultar(box);
    if (t < 4) return pintar(box, 'warn', `A las ${fmt(t, 1)} h: el nomograma empieza a las 4 h. Mide el nivel a partir de entonces.`);
    if (t > 24) return pintar(box, 'warn', 'Más de 24 h: fuera del nomograma. Guíate por las transaminasas.');
    const ug = $('mt-nomo-unidad').value === 'umol' ? nivel / 6.62 : nivel;
    const trat = lineaNomograma(t, 150, 5), alto = lineaNomograma(t, 300, 10);
    let html = `Nivel ${fmt(ug, 1)} µg/mL a las ${fmt(t, 1)} h. Línea de tratamiento: ${fmt(trat, 1)} µg/mL; de alto riesgo: ${fmt(alto, 1)} µg/mL.`;
    if (ug >= alto) return pintar(box, 'danger', `${html} <strong>Por encima de la línea de alto riesgo</strong>: 90% de probabilidad de hepatotoxicidad. N-acetilcisteína ya; puede necesitarla prolongada.`);
    if (ug >= trat) return pintar(box, 'danger', `${html} <strong>Por encima de la línea de tratamiento: N-acetilcisteína.</strong>`);
    if (tipo === 'prolongada' && t <= 12) return pintar(box, 'warn', `${html} Por debajo, pero con liberación prolongada: <strong>repetir el nivel en 4-6 h</strong>.`);
    pintar(box, 'ok', `${html} Por debajo de la línea de tratamiento.`);
}
function calcNac() {
    const p = pesoValido('mt-nac-peso'), hd = $('mt-nac-hd').value === 'si', box = $('mt-nac-resultado');
    if (p === null) return ocultar(box);
    const ml = mg => fmt(mg / 200, 0);
    let html = `NAC al 20% (200 mg/mL): 1) <strong>${fmt(150 * p, 0)} mg</strong> (${ml(150 * p)} mL) en 200 mL de G5% en 1 h; 2) <strong>${fmt(50 * p, 0)} mg</strong> (${ml(50 * p)} mL) en 500 mL en 4 h; 3) <strong>${fmt(100 * p, 0)} mg</strong> (${ml(100 * p)} mL) en 1.000 mL en 16 h. Total ${fmt(300 * p, 0)} mg en 21 h.`;
    html += `<br>Si no se cumplen los criterios para parar: seguir a <strong>≥${fmt(6.25 * p, 0)} mg/h</strong> (6,25 mg/kg/h).`;
    if (hd) html += ` <strong>En hemodiálisis: ≥${fmt(12.5 * p, 0)} mg/h</strong> (12,5 mg/kg/h; la NAC también se dializa).`;
    pintar(box, hd ? 'warn' : 'ok', html);
}
function calcParar() {
    const c = [...document.querySelectorAll('.mt-parar-check')], falta = c.filter(x => !x.checked).map(x => x.value), box = $('mt-parar-resultado');
    if (!falta.length) return pintar(box, 'ok', '<strong>Se puede parar la NAC</strong>: se cumplen los 4 criterios de la Tabla 52.1.');
    pintar(box, 'warn', `<strong>Seguir la NAC IV</strong> (≥6,25 mg/kg/h) y revisar cada 12-24 h. Falta: ${falta.join(' · ')}.`);
}
function calcGlucagon() {
    const p = pesoValido('mt-glucagon-peso'), r = $('mt-glucagon-respuesta').value, box = $('mt-glucagon-resultado');
    if (p === null) return ocultar(box);
    const b1 = 0.05 * p, b2 = 0.07 * p;
    if (r === 'pendiente') return pintar(box, 'warn', `<strong>Bolo de ${fmt(b1, 1)} mg IV</strong> (0,05 mg/kg; habitual 3-5 mg). Respuesta en 3 min. Con el calcio iónico normal la respuesta cronotrópica es mejor.`);
    if (r === 'si') return pintar(box, 'ok', '<strong>Perfusión de 5 mg/h</strong>: el bolo dura solo 5 min. Por encima de 5 mg/h, náuseas y vómitos resistentes al ondansetrón.');
    pintar(box, 'danger', `<strong>Segundo bolo de ${fmt(b2, 1)} mg</strong> (0,07 mg/kg; o 5 mg). Si no responde, la milrinona se reserva para entonces. Recuerda que no revierte el bloqueo AV ni la neurotoxicidad.`);
}
export const NAL_WIZARD = {
    inicio: { pregunta: '¿Hay depresión respiratoria?', si: 'dosis2', no: 'conciencia' },
    conciencia: { pregunta: 'Consciencia deprimida sin depresión respiratoria: 0,4 mg IV, repetible a los 2 min. ¿Ha respondido con ≤0,8 mg?', si: { estado: 'tfg-estado-ok', final: 'Responde: perfusión de dos tercios de la dosis eficaz por hora (en 6 h). El efecto opioide vuelve a la 1-2 h.' }, no: { estado: 'tfg-estado-warn', final: '0,8 mg en total deberían bastar si la causa es un opioide: busca otra causa.' } },
    dosis2: { pregunta: '2 mg IV en bolo. ¿Responde en 2-3 min?', si: { estado: 'tfg-estado-ok', final: 'Responde con 2 mg: perfusión de dos tercios de la dosis eficaz por hora (en 6 h).' }, no: 'dosis4' },
    dosis4: { pregunta: '4 mg IV. ¿Responde?', si: { estado: 'tfg-estado-ok', final: 'Responde con 4 mg: perfusión de dos tercios de la dosis eficaz por hora.' }, no: 'dosis15' },
    dosis15: { pregunta: 'Seguir subiendo hasta 15 mg. ¿Responde?', si: { estado: 'tfg-estado-warn', final: 'Responde a dosis altas: perfusión de dos tercios de la dosis eficaz por hora. Vigila el edema pulmonar con dosis altas.' }, no: { estado: 'tfg-estado-danger', final: 'Con 15 mg sin respuesta, no son los opioides: busca otra causa y asegura la vía aérea.' } },
};
function calcNaloxonaPerfusion() {
    const d = num($('mt-nal-eficaz')), box = $('mt-nal-resultado');
    if (d === null || d <= 0) return ocultar(box);
    const h = d * 2 / 3;
    pintar(box, 'ok', `Dosis eficaz ${fmt(d, 1)} mg → perfusión de <strong>${fmt(h, 2)} mg/h</strong> (dos tercios por hora): ${fmt(h * 6, 1)} mg en 250 o 500 mL de salino para 6 h.`);
}
function calcSalicilatos() {
    const n = num($('mt-sal-nivel')), renal = $('mt-sal-renal').value === 'si', grave = $('mt-sal-grave').value === 'si', p = pesoValido('mt-sal-peso'), box = $('mt-sal-resultado');
    if (n === null) return ocultar(box);
    const mgdl = $('mt-sal-unidad').value === 'mmol' ? n / 0.0724 : n, mmol = mgdl * 0.0724;
    const motivos = [];
    if (mgdl > 90) motivos.push('nivel &gt;90 mg/dL');
    else if (mgdl > 80 && renal) motivos.push('&gt;80 mg/dL con función renal alterada');
    if (grave) motivos.push('intoxicación que amenaza la vida');
    let html = `Salicilato ${fmt(mgdl, 1)} mg/dL (${fmt(mmol, 2)} mmol/L).`;
    const alc = p !== null ? ` Alcalinizar: carga de <strong>${fmt(p, 0)}-${fmt(2 * p, 0)} mEq</strong> de bicarbonato y la solución a <strong>${fmt(2 * p, 0)}-${fmt(3 * p, 0)} mL/h</strong> (pH urinario ≥7,5). Carbón activado ${fmt(Math.min(p, 100), 0)} g cada 4 h.` : '';
    if (motivos.length) return pintar(box, 'danger', `${html} <strong>Hemodiálisis</strong>: ${motivos.join('; ')}.${alc}`);
    pintar(box, 'warn', `${html} Sin criterio de hemodiálisis por ahora.${alc}`);
}

// ---- Cap. 53 — tóxicos no farmacológicos ------------------------------
const P50 = 26.8, HILL = 2.7, CAP = 1.34 * 15, PA = 100, DAV = 5;
const satHill = p => Math.pow(p, HILL) / (Math.pow(p, HILL) + Math.pow(P50, HILL));
const po2DeSat = s => P50 * Math.pow(s / (1 - s), 1 / HILL);
export function coVenosa(cohb) {
    const util = CAP * (1 - cohb / 100), ca = util * satHill(PA), cv = Math.max(ca - DAV, 0.05);
    return { ca, cv, pv: po2DeSat(Math.min(cv / util, 0.999)) };
}
function dibujarCo() {
    const c = num($('mt-co-sim-cohb')) ?? 0, svg = $('mt-co-sim-svg'), box = $('mt-co-sim-resultado');
    if (!svg) return;
    const X = p => 34 + p / 100 * 270, Y = v => 160 - v / 22 * 145;
    const curva = f => Array.from({ length: 51 }, (_, i) => { const p = i * 2; return `${i ? 'L' : 'M'}${X(p).toFixed(1)},${Y(f * CAP * satHill(p)).toFixed(1)}`; }).join(' ');
    const n = coVenosa(0), k = coVenosa(c), f = 1 - c / 100;
    const ejes = `<path d="M34,15 L34,160 L304,160" fill="none" stroke="var(--text-muted)" stroke-width="1"/>` +
        [0, 20, 40, 60, 80, 100].map(p => `<text x="${X(p)}" y="174" font-size="9" fill="var(--text-muted)" text-anchor="middle">${p}</text>`).join('') +
        [0, 10, 20].map(v => `<text x="28" y="${Y(v) + 3}" font-size="9" fill="var(--text-muted)" text-anchor="end">${v}</text>`).join('') +
        `<text x="170" y="187" font-size="9" fill="var(--text-muted)" text-anchor="middle">PO₂ (mmHg)</text><text x="10" y="90" font-size="9" fill="var(--text-muted)" transform="rotate(-90 10 90)" text-anchor="middle">O₂ (mL/dL)</text>`;
    const punto = (p, v, col, t) => `<circle cx="${X(p).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4" fill="${col}"/><text x="${(X(p) + 6).toFixed(1)}" y="${(Y(v) - 5).toFixed(1)}" font-size="9" fill="${col}">${t}</text>`;
    svg.innerHTML = ejes +
        `<path d="${curva(1)}" fill="none" stroke="var(--accent-green)" stroke-width="2"/>` +
        (c > 0 ? `<path d="${curva(f)}" fill="none" stroke="var(--accent-red)" stroke-width="2"/>` : '') +
        punto(PA, n.ca, 'var(--accent-green)', 'A') + punto(n.pv, n.cv, 'var(--accent-green)', 'V') +
        (c > 0 ? punto(PA, k.ca, 'var(--accent-red)', 'A') + punto(k.pv, k.cv, 'var(--accent-red)', 'V') : '') +
        `<line x1="${X(k.pv).toFixed(1)}" y1="${Y(k.cv).toFixed(1)}" x2="${X(k.pv).toFixed(1)}" y2="160" stroke="var(--accent-red)" stroke-dasharray="3 3"/>`;
    pintar(box, c > 0 ? 'warn' : 'ok', `COHb ${fmt(c, 0)}%: CaO₂ ${fmt(k.ca, 1)} mL/dL. Con la misma extracción (5 mL/dL), PO₂ venosa <strong>${fmt(k.pv, 0)} mmHg</strong> (sin COHb: ${fmt(n.pv, 0)}).`);
}
function calcCo() {
    const c = num($('mt-co-cohb')), fum = $('mt-co-fumador').value === 'si', grave = $('mt-co-grave').value === 'si', box = $('mt-co-resultado');
    if (c === null) return ocultar(box);
    const umbral = fum ? 10 : 4;
    if (c <= umbral) return pintar(box, 'ok', `COHb ${fmt(c, 1)}%: dentro del umbral (${fum ? '10% en fumadores' : '3-4% en no fumadores'}).`);
    const tO2 = 74 * Math.log2(c / umbral), tAire = 320 * Math.log2(c / umbral);
    let html = `COHb ${fmt(c, 1)}%: <strong>alta</strong> (umbral ${umbral}%). Oxígeno al 100%: hasta ~${umbral}% en <strong>${fmt(tO2, 0)} min</strong> (semivida 74 min), frente a ${fmt(tAire / 60, 1)} h con aire (320 min).`;
    if (grave) html += ' Intoxicación moderada o grave: <strong>ECG y marcadores</strong> (lesión miocárdica en ~40%). El hiperbárico no ha demostrado superar al O₂ normobárico.';
    pintar(box, grave ? 'danger' : 'warn', html + ' La COHb se correlaciona mal con la gravedad.');
}
function calcCianuro() {
    const inest = $('mt-cn-inestable').value === 'si', lac = num($('mt-cn-lactato')), parada = $('mt-cn-parada').value === 'si', renal = $('mt-cn-renal').value === 'si', box = $('mt-cn-resultado');
    const sospecha = inest || parada || (lac !== null && lac >= 10);
    if (!sospecha) return pintar(box, 'ok', `Sin inestabilidad${lac !== null ? ` y lactato ${fmt(lac, 1)} (&lt;10)` : ''}: no hay criterio para tratar el cianuro de forma empírica.`);
    const hidroxo = parada ? '<strong>Hidroxocobalamina 10 g IV</strong> (parada)' : '<strong>Hidroxocobalamina 5 g IV en 15 min</strong>; segunda dosis de 5 g si amenaza la vida';
    const tio = renal ? 'Tiosulfato <strong>no</strong> (insuficiencia renal: el tiocianato se acumula).' : 'Tiosulfato sódico 12,5 g IV en 50 mL, con la hidroxocobalamina.';
    pintar(box, 'danger', `<strong>Tratar el cianuro ya</strong>, sin esperar al nivel: ${hidroxo}. ${tio} El nitrito de amilo está contraindicado en la inhalación de humo.`);
}
function calcFomepizol() {
    const tox = $('mt-fome-toxico').value, p = pesoValido('mt-fome-peso'), ph = num($('mt-fome-ph')), organo = $('mt-fome-organo').value === 'si', vision = $('mt-fome-vision').value === 'si', box = $('mt-fome-resultado');
    if (p === null) return ocultar(box);
    let html = `<strong>Fomepizol</strong>: carga de <strong>${fmt(15 * p, 0)} mg</strong> IV (15 mg/kg); luego ${fmt(10 * p, 0)} mg cada 12 h, 4 dosis; después ${fmt(15 * p, 0)} mg cada 12 h si el alcohol sigue &gt;20 mg/dL (y cada 4 h durante la diálisis).`;
    html += tox === 'eg' ? '<br>Coadyuvantes: tiamina 100 mg IV/día y piridoxina 100 mg IV/día.' : `<br>Coadyuvante: ácido folínico <strong>${fmt(Math.min(p, 50), 0)} mg</strong> IV cada 4 h (1 mg/kg, máx. 50).`;
    const motivos = [];
    if (ph !== null && ph < 7.1) motivos.push(`pH ${fmt(ph, 2)} (&lt;7,1)`);
    if (organo) motivos.push('coma, convulsiones o insuficiencia renal');
    if (tox === 'met' && vision) motivos.push('alteración visual');
    if (motivos.length) html += `<br><strong>Hemodiálisis inmediata</strong>: ${motivos.join(', ')}.`;
    pintar(box, motivos.length ? 'danger' : 'warn', html);
}

// ---- Apéndices ----------------------------------------------------------
const SOLUTOS = { na: ['Sodio', 23, 1], k: ['Potasio', 39, 1], cl: ['Cloro', 35.5, 1], ca: ['Calcio', 40, 2], mg: ['Magnesio', 24.3, 2], glucosa: ['Glucosa', 180, 0], urea: ['Nitrógeno ureico', 28, 0] };
function calcConversion() {
    const [nombre, pm, val] = SOLUTOS[$('mt-conv-soluto').value], v = num($('mt-conv-valor')), u = $('mt-conv-unidad').value, box = $('mt-conv-resultado');
    if (v === null) return ocultar(box);
    if (u === 'meq' && !val) return pintar(box, 'warn', `${nombre} no tiene carga: no se expresa en mEq/L.`);
    const mmol = u === 'mgdl' ? v * 10 / pm : u === 'mmol' ? v : v / val;
    const partes = [`<strong>${fmt(mmol * pm / 10, 1)} mg/dL</strong>`, `<strong>${fmt(mmol, 2)} mmol/L</strong>`];
    if (val) partes.push(`<strong>${fmt(mmol * val, 2)} mEq/L</strong>`);
    partes.push(`${fmt(mmol, 2)} mOsm/kg (n = 1)`);
    pintar(box, 'ok', `${nombre}: ${partes.join(' · ')}.`);
}
function calcCalibre() {
    const v = num($('mt-calibre-valor')), u = $('mt-calibre-unidad').value, box = $('mt-calibre-resultado');
    if (v === null) return ocultar(box);
    pintar(box, 'ok', u === 'fr' ? `${fmt(v, 0)} French = <strong>${fmt(v / 3, 1)} mm</strong> de diámetro externo.` : `${fmt(v, 1)} mm = <strong>${fmt(v * 3, 0)} French</strong>.`);
}
function calcTempPres() {
    const t = num($('mt-temp-valor')), tu = $('mt-temp-unidad').value, p = num($('mt-pres-valor')), pu = $('mt-pres-unidad').value, box = $('mt-unid-resultado');
    const partes = [];
    if (t !== null) partes.push(tu === 'c' ? `${fmt(t, 1)} °C = <strong>${fmt(9 / 5 * t + 32, 1)} °F</strong>` : `${fmt(t, 1)} °F = <strong>${fmt(5 / 9 * (t - 32), 1)} °C</strong>`);
    if (p !== null) {
        const kpa = pu === 'kpa' ? p : pu === 'mmhg' ? p * 0.133 : p / 10.2;
        partes.push(`${fmt(kpa * 7.5, 1)} mmHg = <strong>${fmt(kpa, 2)} kPa</strong> = ${fmt(kpa * 10.2, 1)} cmH₂O`);
    }
    if (!partes.length) return ocultar(box);
    pintar(box, 'ok', partes.join('<br>'));
}
const RAD = { 'mt-rad-rx': 0.02, 'mt-rad-tccr': 2, 'mt-rad-tct': 7, 'mt-rad-tca': 8, 'mt-rad-angio': 15 };
function calcRadiacion() {
    const total = Object.entries(RAD).reduce((s, [id, mSv]) => s + (num($(id)) ?? 0) * mSv, 0), box = $('mt-rad-resultado');
    const pct = total / 50 * 100;
    pintar(box, pct >= 100 ? 'danger' : 'ok', `Dosis efectiva media estimada: <strong>${fmt(total, 2)} mSv</strong>, el ${fmt(pct, 0)}% del límite anual de la EPA (50 mSv). Equivale a ${fmt(total / 0.02, 0)} radiografías de tórax de una proyección.`);
}
function calcImc() {
    const p = pesoValido('mt-imc-peso'), t = num($('mt-imc-talla')), box = $('mt-imc-resultado');
    if (p === null || t === null || t <= 0) return ocultar(box);
    const imc = p / Math.pow(t / 100, 2);
    const [e, b] = imc < 18.5 ? ['warn', 'bajo peso'] : imc < 25 ? ['ok', 'saludable'] : imc < 30 ? ['warn', 'sobrepeso'] : imc < 40 ? ['danger', 'obesidad'] : ['danger', 'obesidad extrema'];
    pintar(box, e, `IMC <strong>${fmt(imc, 1)} kg/m²</strong>: ${b}.${imc <= 18.5 ? ' Es también criterio de riesgo de realimentación (Cap. 50).' : ''}`);
}
export function pefLeiner(sexo, edad, talla) {
    return (sexo === 'h' ? 3.95 - 0.0151 * edad : 2.93 - 0.0072 * edad) * talla;
}
function calcPef() {
    const s = $('mt-pef-sexo').value, e = num($('mt-pef-edad')), t = num($('mt-pef-talla')), m = num($('mt-pef-medido')), box = $('mt-pef-resultado');
    if (e === null || t === null) return ocultar(box);
    const pred = pefLeiner(s, e, t);
    if (m === null) return pintar(box, 'ok', `PEF previsto: <strong>${fmt(pred, 0)} L/min</strong> (Leiner).`);
    const pct = m / pred * 100;
    pintar(box, 'neutro', `PEF previsto ${fmt(pred, 0)} L/min; medido ${fmt(m, 0)}: <strong>${fmt(pct, 0)}% del previsto</strong>. La gravedad del asma por el PEF, en Merino Neumología.`);
}
function calcVolemia() {
    const h = $('mt-volemia-sexo').value === 'h', p = pesoValido('mt-volemia-peso'), box = $('mt-volemia-resultado');
    if (p === null) return ocultar(box);
    const [sa, he, pl] = h ? [66, 26, 40] : [60, 24, 36];
    pintar(box, 'ok', `Sangre <strong>${fmt(sa * p / 1000, 2)} L</strong> (${sa} mL/kg) · hematíes ${fmt(he * p / 1000, 2)} L (${he} mL/kg) · plasma ${fmt(pl * p / 1000, 2)} L (${pl} mL/kg).`);
}

export function init() {
    initCorkboard('marino-tox-corkboard', 'panel-marino-tox-tabs');
    enlazar(['mt-nomo-horas', 'mt-nomo-nivel', 'mt-nomo-unidad', 'mt-nomo-tipo'], calcNomograma);
    enlazar(['mt-nac-peso', 'mt-nac-hd'], calcNac);
    enlazar(idsDe('.mt-parar-check', 'mt-parar-c'), calcParar);
    enlazar(['mt-glucagon-peso', 'mt-glucagon-respuesta'], calcGlucagon);
    initSiNoWizard('mt-nal-wizard', NAL_WIZARD);
    enlazar(['mt-nal-eficaz'], calcNaloxonaPerfusion);
    enlazar(['mt-sal-nivel', 'mt-sal-unidad', 'mt-sal-renal', 'mt-sal-grave', 'mt-sal-peso'], calcSalicilatos);
    enlazar(['mt-co-sim-cohb'], dibujarCo);
    enlazar(['mt-co-cohb', 'mt-co-fumador', 'mt-co-grave'], calcCo);
    enlazar(['mt-cn-inestable', 'mt-cn-lactato', 'mt-cn-parada', 'mt-cn-renal'], calcCianuro);
    enlazar(['mt-fome-toxico', 'mt-fome-peso', 'mt-fome-ph', 'mt-fome-organo', 'mt-fome-vision'], calcFomepizol);
    enlazar(['mt-conv-soluto', 'mt-conv-valor', 'mt-conv-unidad'], calcConversion);
    enlazar(['mt-calibre-valor', 'mt-calibre-unidad'], calcCalibre);
    enlazar(['mt-temp-valor', 'mt-temp-unidad', 'mt-pres-valor', 'mt-pres-unidad'], calcTempPres);
    enlazar(Object.keys(RAD), calcRadiacion);
    enlazar(['mt-imc-peso', 'mt-imc-talla'], calcImc);
    enlazar(['mt-pef-sexo', 'mt-pef-edad', 'mt-pef-talla', 'mt-pef-medido'], calcPef);
    enlazar(['mt-volemia-sexo', 'mt-volemia-peso'], calcVolemia);
}
