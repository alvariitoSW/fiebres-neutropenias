// Libros · Marino Tóxicos y apéndices — The ICU Book (Marino PL, 5.ª ed.),
// caps. 52-53 (sobredosis de fármacos y tóxicos no farmacológicos) y
// Apéndices 1-3 (unidades, valores de referencia y "el cuerpo fantástico").
// Cuaderno de campo + calculadoras y el simulador del CO; las cifras salen
// de las tablas y del texto citados en la propia ficha.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';

const $ = id => document.getElementById(id);
const num = el => (el && el.value !== '' ? Number(el.value) : null);
// useGrouping 'always': es-ES no agrupa por defecto los números de 4 cifras (3500 → 3.500).
const fmt = (v, d = 1) => v.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' });

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
// Redondeo a un decimal: los umbrales se comparan con el valor que se muestra (REGLAS §1.10).
const r1 = x => Math.round(x * 10) / 10;
const fmtN = v => v.toLocaleString('es-ES', { maximumFractionDigits: 2, useGrouping: 'always' });
// Lee un campo numérico. Vacío = null (nunca 0). Fuera del min/max de su <input> (o de
// `lim`, si el rango depende de la unidad) devuelve el aviso «combinación no fisiológica»
// y v = null: no se calcula. Los rangos son de fisiología general, no de la ficha.
function leer(id, nombre, lim) {
    const el = $(id), v = num(el);
    if (v === null) return { v: null, aviso: '' };
    const min = lim ? lim[0] : (el.min !== '' ? Number(el.min) : -Infinity), max = lim ? lim[1] : (el.max !== '' ? Number(el.max) : Infinity);
    if (v >= min && v <= max) return { v, aviso: '' };
    return { v: null, aviso: `⚠️ <strong>Combinación no fisiológica / fuera de rango</strong>: ${nombre} ${fmtN(v)} no está entre ${fmtN(min)} y ${fmtN(max)} (rango de la calculadora: fisiología general, no de la ficha). No se calcula.` };
}
// Si algún campo está fuera de rango, pinta el aviso y devuelve true.
function avisar(box, ...lecturas) {
    const a = lecturas.map(l => l.aviso).filter(Boolean);
    if (!a.length) return false;
    pintar(box, 'warn', a.join('<br>'));
    return true;
}

// ---- Cap. 52 — sobredosis de fármacos ---------------------------------
// Líneas del nomograma (Figura 52.3). El texto solo da los extremos (150→5 y 300→10 µg/mL
// entre las 4 y las 24 h); los puntos intermedios se leen en el dibujo, donde la línea de
// tratamiento baja a la mitad cada 4 h (150, 75, 37,5, 18,8, 9,4 y 5). La de alto riesgo
// es paralela (300 → 10). Entre las horas marcadas se interpola en escala logarítmica.
const NOMO_H = [4, 8, 12, 16, 20, 24];
const NOMO_TRAT = [150, 75, 37.5, 18.8, 9.4, 5];
const NOMO_ALTO = [300, 150, 75, 37.5, 18.8, 10];
export function lineaNomograma(t, alto = false) {
    const v = alto ? NOMO_ALTO : NOMO_TRAT, x = Math.min(Math.max(t, 4), 24), i = Math.min(Math.floor((x - 4) / 4), 4);
    return v[i] * Math.pow(v[i + 1] / v[i], (x - NOMO_H[i]) / 4);
}
function calcNomograma() {
    const tipo = $('mt-nomo-tipo').value, umol = $('mt-nomo-unidad').value === 'umol', box = $('mt-nomo-resultado');
    if (tipo === 'repetida') return pintar(box, 'warn', '<strong>Dosis supraterapéuticas repetidas</strong>: el nomograma no sirve y el nivel no predice el riesgo. NAC si hay posible hepatotoxicidad con las transaminasas altas.');
    const T = leer('mt-nomo-horas', 'las horas', [0, 48]), N = leer('mt-nomo-nivel', 'el nivel de paracetamol', umol ? [0, 13240] : [0, 2000]);
    if (avisar(box, T, N)) return;
    const t = T.v, nivel = N.v;
    if (t === null || nivel === null) return ocultar(box);
    if (t < 4) return pintar(box, 'warn', `A las ${fmt(t, 1)} h: el nomograma empieza a las 4 h. Mide el nivel a partir de entonces.`);
    if (t > 24) return pintar(box, 'warn', 'Más de 24 h: fuera del nomograma, que no sirve. La NAC se indica también ante posible hepatotoxicidad con las transaminasas altas (ficha II).');
    const ug = r1(umol ? nivel / 6.62 : nivel), trat = r1(lineaNomograma(t)), alto = r1(lineaNomograma(t, true));
    const interp = NOMO_H.includes(t) ? '' : ' (interpolada entre las horas del dibujo: aproximada)';
    const html = `Nivel ${fmt(ug, 1)} µg/mL a las ${fmt(t, 1)} h. Línea de tratamiento: ${fmt(trat, 1)} µg/mL; de alto riesgo: ${fmt(alto, 1)} µg/mL${interp}.`;
    const enLinea = ' El libro trata por encima de la línea; justo en ella, esta calculadora aconseja tratar (criterio de la calculadora, no del libro).';
    if (ug >= alto) return pintar(box, 'danger', `${html} <strong>${ug > alto ? 'Por encima de' : 'En'} la línea de alto riesgo</strong>: 90% de probabilidad de hepatotoxicidad. N-acetilcisteína ya; puede necesitarla prolongada.${ug === alto ? enLinea : ''}`);
    if (ug >= trat) return pintar(box, 'danger', `${html} <strong>${ug > trat ? 'Por encima de la línea de tratamiento' : 'En la línea de tratamiento: tratar'}${ug > trat ? ': N-acetilcisteína' : ' con N-acetilcisteína'}.</strong>${ug === trat ? enLinea : ''}`);
    if (tipo === 'prolongada' && t <= 12) return pintar(box, 'warn', `${html} Por debajo, pero con liberación prolongada: <strong>repetir el nivel en 4-6 h</strong>.`);
    pintar(box, 'ok', `${html} Por debajo de la línea de tratamiento.`);
}
function calcNac() {
    const P = leer('mt-nac-peso', 'el peso'), hd = $('mt-nac-hd').value === 'si', box = $('mt-nac-resultado');
    if (avisar(box, P)) return;
    const p = P.v;
    if (p === null) return ocultar(box);
    const ml = mg => fmt(mg / 200, 1);
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
    const P = leer('mt-glucagon-peso', 'el peso'), r = $('mt-glucagon-respuesta').value, box = $('mt-glucagon-resultado');
    if (avisar(box, P)) return;
    const p = P.v;
    if (p === null) return ocultar(box);
    // El libro da 3-5 mg como dosis habitual del adulto (pág. 11): el bolo por kg no pasa de 5 mg.
    const b1 = Math.min(0.05 * p, 5), b2 = Math.min(0.07 * p, 5);
    const tope1 = 0.05 * p > 5 ? `; tope de 5 mg: 0,05 mg/kg daría ${fmt(0.05 * p, 1)} mg` : '';
    if (r === 'pendiente') return pintar(box, 'warn', `<strong>Bolo de ${fmt(b1, 1)} mg IV</strong> (0,05 mg/kg; habitual 3-5 mg${tope1}). Respuesta en 3 min. Con el calcio iónico normal la respuesta cronotrópica es mejor.`);
    if (r === 'si') return pintar(box, 'ok', '<strong>Perfusión de 5 mg/h</strong>: el bolo dura solo 5 min. Por encima de 5 mg/h, náuseas y vómitos resistentes al ondansetrón.');
    pintar(box, 'danger', `<strong>Segundo bolo de ${fmt(b2, 1)} mg</strong> (0,07 mg/kg; o 5 mg; tope de 5 mg). Si no responde, la milrinona se reserva para entonces. Recuerda que no revierte el bloqueo AV ni la neurotoxicidad.`);
}
// Al acabar el asistente con una dosis eficaz conocida, se la pasa a la
// calculadora de la perfusión (dos tercios por hora) y se añade el ritmo.
const conPerfusion = dosis => resultadoEl => {
    const campo = $('mt-nal-eficaz');
    if (campo) { campo.value = dosis; campo.dispatchEvent(new Event('input', { bubbles: true })); }
    const h = dosis * 2 / 3;
    resultadoEl.insertAdjacentHTML('beforeend', `<br>Con ${fmt(dosis, 0)} mg: <strong>${fmt(h, 2)} mg/h</strong> (${fmt(h * 6, 1)} mg para 6 h).`);
};
export const NAL_WIZARD = {
    inicio: { pregunta: '¿Hay depresión respiratoria?', si: 'dosis2', no: 'conciencia' },
    conciencia: { pregunta: 'Consciencia deprimida sin depresión respiratoria: 0,4 mg IV, repetible a los 2 min. ¿Ha respondido con ≤0,8 mg?', si: { estado: 'tfg-estado-ok', final: 'Responde: perfusión de dos tercios de la dosis eficaz por hora (en 6 h). El efecto opioide vuelve a la 1-2 h.' }, no: { estado: 'tfg-estado-warn', final: '0,8 mg en total deberían bastar si la causa es un opioide: busca otra causa.' } },
    dosis2: { pregunta: '2 mg IV en bolo. ¿Responde en 2-3 min?', si: { estado: 'tfg-estado-ok', final: 'Responde con 2 mg: perfusión de dos tercios de la dosis eficaz por hora (en 6 h).', alFinal: conPerfusion(2) }, no: 'dosis4' },
    dosis4: { pregunta: '4 mg IV. ¿Responde?', si: { estado: 'tfg-estado-ok', final: 'Responde con 4 mg: perfusión de dos tercios de la dosis eficaz por hora.', alFinal: conPerfusion(4) }, no: 'dosis15' },
    dosis15: { pregunta: 'Seguir subiendo hasta 15 mg. ¿Responde?', si: { estado: 'tfg-estado-warn', final: 'Responde a dosis altas: perfusión de dos tercios de la dosis eficaz por hora. Vigila el edema pulmonar con dosis altas.' }, no: { estado: 'tfg-estado-danger', final: 'Con 15 mg sin respuesta, no son los opioides: busca otra causa.' } },
};
function calcNaloxonaPerfusion() {
    const D = leer('mt-nal-eficaz', 'la dosis eficaz'), box = $('mt-nal-resultado');
    if (avisar(box, D)) return;
    const d = D.v;
    if (d === null || d <= 0) return ocultar(box);
    const h = d * 2 / 3;
    pintar(box, 'ok', `Dosis eficaz ${fmt(d, 1)} mg → perfusión de <strong>${fmt(h, 2)} mg/h</strong> (dos tercios por hora): ${fmt(h * 6, 1)} mg en 250 o 500 mL de salino para 6 h.`);
}
// Umbrales del libro en las dos unidades (págs. 15-16): se compara el valor redondeado a 1 decimal en la unidad tecleada.
const SAL = {
    mgdl: { u: 'mg/dL', hd: 90, hdRenal: 80, vida: 75, toxico: 40, tmin: 10, tmax: 30, lim: [0, 250] },
    mmol: { u: 'mmol/L', hd: 6.5, hdRenal: 5.8, vida: 5.4, toxico: 2.9, tmin: 0.7, tmax: 2.2, lim: [0, 18.1] }
};
function calcSalicilatos() {
    const k = SAL[$('mt-sal-unidad').value], renal = $('mt-sal-renal').value === 'si', grave = $('mt-sal-grave').value === 'si', box = $('mt-sal-resultado');
    const N = leer('mt-sal-nivel', 'el nivel de salicilato', k.lim), P = leer('mt-sal-peso', 'el peso');
    if (avisar(box, N, P)) return;
    const p = P.v;
    if (N.v === null) return ocultar(box);
    const n = r1(N.v), mmolU = k === SAL.mmol, otra = mmolU ? `≈${fmt(N.v / 0.0724, 0)} mg/dL` : `${fmt(N.v * 0.0724, 2)} mmol/L`;
    const tk = x => `${mmolU ? fmt(x, 1) : fmt(x, 0)} ${k.u}`;
    const motivos = [];
    if (n > k.hd) motivos.push(`nivel &gt;${tk(k.hd)}`);
    else if (n > k.hdRenal && renal) motivos.push(`&gt;${tk(k.hdRenal)} con función renal alterada`);
    if (grave) motivos.push('intoxicación que amenaza la vida');
    const banda = n > k.vida ? `amenaza la vida (&gt;${tk(k.vida)})` : n > k.toxico ? `tóxico (&gt;${tk(k.toxico)})` : n >= k.tmin && n <= k.tmax ? `rango terapéutico (${mmolU ? '0,7-2,2' : '10-30'} ${k.u})` : n < k.tmin ? 'por debajo del rango terapéutico' : 'por encima del terapéutico, sin llegar a tóxico';
    const html = `Salicilato ${fmt(n, 1)} ${k.u} (${otra}): ${banda}.`;
    if (n <= k.tmax && !motivos.length) return pintar(box, 'ok', `${html} La alcalinización se mantiene hasta que el nivel cae al rango terapéutico: con este nivel ya no hace falta.`);
    const alc = p !== null ? ` Alcalinizar: carga de <strong>${fmt(p, 0)}-${fmt(2 * p, 0)} mEq</strong> de bicarbonato y la solución a <strong>${fmt(2 * p, 0)}-${fmt(3 * p, 0)} mL/h</strong> (pH urinario ≥7,5). Carbón activado ${fmt(Math.min(p, 100), 0)} g cada 4 h.` : '';
    if (motivos.length) return pintar(box, 'danger', `${html} <strong>Hemodiálisis</strong>: ${motivos.join('; ')}.${alc}`);
    pintar(box, 'warn', `${html} Sin criterio de hemodiálisis por ahora.${alc}`);
}

// ---- Cap. 53 — tóxicos no farmacológicos ------------------------------
// Curva de Hill (ilustrativa, aproximada a la Figura 53.1). La COHb desplaza la curva a la
// izquierda: el P50 baja 0,296 mmHg por cada 1% de COHb, ajuste propio para que con el 50%
// la PO₂ venosa sea la de la figura (≈12 mmHg). Entre 0 y 60% es una aproximación lineal.
const P50 = 26.8, HILL = 2.7, CAP = 1.34 * 15, PA = 100, DAV = 5;
const p50De = cohb => P50 - 0.296 * cohb;
const satHill = (p, cohb = 0) => Math.pow(p, HILL) / (Math.pow(p, HILL) + Math.pow(p50De(cohb), HILL));
const po2DeSat = (s, cohb = 0) => p50De(cohb) * Math.pow(s / (1 - s), 1 / HILL);
export function coVenosa(cohb) {
    const util = CAP * (1 - cohb / 100), ca = util * satHill(PA, cohb), cv = Math.max(ca - DAV, 0.05);
    return { ca, cv, pv: po2DeSat(Math.min(cv / util, 0.999), cohb) };
}
function dibujarCo() {
    const c = num($('mt-co-sim-cohb')) ?? 0, svg = $('mt-co-sim-svg'), box = $('mt-co-sim-resultado');
    if (!svg) return;
    const X = p => 34 + p / 100 * 270, Y = v => 160 - v / 22 * 145;
    const curva = (f, cohb) => Array.from({ length: 51 }, (_, i) => { const p = i * 2; return `${i ? 'L' : 'M'}${X(p).toFixed(1)},${Y(f * CAP * satHill(p, cohb)).toFixed(1)}`; }).join(' ');
    const n = coVenosa(0), k = coVenosa(c), f = 1 - c / 100;
    const ejes = `<path d="M34,15 L34,160 L304,160" fill="none" stroke="var(--text-muted)" stroke-width="1"/>` +
        [0, 20, 40, 60, 80, 100].map(p => `<text x="${X(p)}" y="174" font-size="9" fill="var(--text-muted)" text-anchor="middle">${p}</text>`).join('') +
        [0, 10, 20].map(v => `<text x="28" y="${Y(v) + 3}" font-size="9" fill="var(--text-muted)" text-anchor="end">${v}</text>`).join('') +
        `<text x="170" y="187" font-size="9" fill="var(--text-muted)" text-anchor="middle">PO₂ (mmHg)</text><text x="10" y="90" font-size="9" fill="var(--text-muted)" transform="rotate(-90 10 90)" text-anchor="middle">O₂ (mL/dL)</text>`;
    const punto = (p, v, col, t) => `<circle cx="${X(p).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4" fill="${col}"/><text x="${(X(p) + 6).toFixed(1)}" y="${(Y(v) - 5).toFixed(1)}" font-size="9" fill="${col}">${t}</text>`;
    svg.innerHTML = ejes +
        `<path d="${curva(1, 0)}" fill="none" stroke="var(--accent-green)" stroke-width="2"/>` +
        (c > 0 ? `<path d="${curva(f, c)}" fill="none" stroke="var(--accent-red)" stroke-width="2"/>` : '') +
        punto(PA, n.ca, 'var(--accent-green)', 'A') + punto(n.pv, n.cv, 'var(--accent-green)', 'V') +
        (c > 0 ? punto(PA, k.ca, 'var(--accent-red)', 'A') + punto(k.pv, k.cv, 'var(--accent-red)', 'V') : '') +
        `<line x1="${X(k.pv).toFixed(1)}" y1="${Y(k.cv).toFixed(1)}" x2="${X(k.pv).toFixed(1)}" y2="160" stroke="var(--accent-red)" stroke-dasharray="3 3"/>`;
    pintar(box, c > 0 ? 'warn' : 'ok', `COHb ${fmt(c, 0)}%: CaO₂ ${fmt(k.ca, 1)} mL/dL. Con la misma extracción (5 mL/dL), PO₂ venosa <strong>${fmt(k.pv, 0)} mmHg</strong> (sin COHb: ${fmt(n.pv, 0)}).${c === 50 ? ' La Figura 53.1 da unos 12 mmHg con el 50%.' : ''}`);
}
function calcCo() {
    const C = leer('mt-co-cohb', 'la COHb'), fum = $('mt-co-fumador').value === 'si', grave = $('mt-co-grave').value === 'si', box = $('mt-co-resultado');
    if (avisar(box, C)) return;
    if (C.v === null) return ocultar(box);
    const c = r1(C.v), umbral = fum ? 10 : 4;
    if (c <= umbral) return pintar(box, 'ok', `COHb ${fmt(c, 1)}%: dentro del umbral (${fum ? '10% en fumadores' : '3-4% en no fumadores'}).`);
    const tO2 = 74 * Math.log2(c / umbral), tAire = 320 * Math.log2(c / umbral);
    let html = `COHb ${fmt(c, 1)}%: <strong>alta</strong> (umbral ${umbral}%). Oxígeno al 100%: hasta ~${umbral}% en <strong>${fmt(tO2, 0)} min</strong> (semivida 74 min), frente a ${fmt(tAire / 60, 1)} h con aire (320 min).`;
    if (grave) html += ' Intoxicación moderada o grave: <strong>ECG y marcadores</strong> (lesión miocárdica en ~40%). El hiperbárico no ha demostrado superar al O₂ normobárico.';
    pintar(box, grave ? 'danger' : 'warn', html + ' La COHb se correlaciona mal con la gravedad.');
}
function calcCianuro() {
    const inest = $('mt-cn-inestable').value === 'si', L = leer('mt-cn-lactato', 'el lactato'), parada = $('mt-cn-parada').value === 'si', renal = $('mt-cn-renal').value === 'si', box = $('mt-cn-resultado');
    if (avisar(box, L)) return;
    const lac = L.v === null ? null : r1(L.v);
    const sospecha = inest || parada || (lac !== null && lac >= 10);
    if (!sospecha) return pintar(box, 'ok', `Sin inestabilidad${lac !== null ? ` y lactato ${fmt(lac, 1)} (&lt;10)` : ''}: no hay criterio para tratar el cianuro de forma empírica.`);
    const hidroxo = parada ? '<strong>Hidroxocobalamina 10 g IV</strong> (parada)' : '<strong>Hidroxocobalamina 5 g IV en 15 min</strong>; segunda dosis de 5 g si amenaza la vida';
    const tio = renal ? 'Tiosulfato <strong>no</strong> (insuficiencia renal: el tiocianato se acumula).' : 'Tiosulfato sódico 12,5 g IV en 50 mL, con la hidroxocobalamina.';
    pintar(box, 'danger', `<strong>Tratar el cianuro ya</strong>, sin esperar al nivel: ${hidroxo}. ${tio} El nitrito de amilo está contraindicado en la inhalación de humo.`);
}
function calcFomepizol() {
    const tox = $('mt-fome-toxico').value, P = leer('mt-fome-peso', 'el peso'), PH = leer('mt-fome-ph', 'el pH'), organo = $('mt-fome-organo').value === 'si', vision = $('mt-fome-vision').value === 'si', box = $('mt-fome-resultado');
    if (avisar(box, P, PH)) return;
    const p = P.v, ph = PH.v === null ? null : Math.round(PH.v * 100) / 100;
    if (p === null) return ocultar(box);
    let html = `<strong>Fomepizol</strong>: carga de <strong>${fmt(15 * p, 0)} mg</strong> IV (15 mg/kg); luego ${fmt(10 * p, 0)} mg cada 12 h, 4 dosis; después ${fmt(15 * p, 0)} mg cada 12 h si el alcohol sigue &gt;20 mg/dL (y, si hace falta más de una sesión de hemodiálisis, cada 4 h durante la diálisis).`;
    html += tox === 'eg' ? '<br>Coadyuvantes: tiamina 100 mg IV/día y piridoxina 100 mg IV/día.' : `<br>Coadyuvante: ácido folínico <strong>${fmt(Math.min(p, 50), 0)} mg</strong> IV cada 4 h (1 mg/kg, máx. 50).`;
    const motivos = [];
    if (ph !== null && ph < 7.1) motivos.push(`pH ${fmt(ph, 2)} (&lt;7,1)`);
    if (organo) motivos.push('coma, convulsiones o insuficiencia renal');
    if (tox === 'met' && vision) motivos.push('alteración visual');
    if (motivos.length) html += `<br><strong>Hemodiálisis inmediata</strong>: ${motivos.join(', ')}.`;
    pintar(box, motivos.length ? 'danger' : 'warn', html);
}

// ---- Apéndices ----------------------------------------------------------
// Los pesos moleculares son conocimiento general: del apéndice solo salen los del ejemplo (calcio 40, glucosa 180).
const SOLUTOS = { na: ['Sodio', 23, 1], k: ['Potasio', 39, 1], cl: ['Cloro', 35.5, 1], ca: ['Calcio', 40, 2], mg: ['Magnesio', 24.3, 2], glucosa: ['Glucosa', 180, 0], urea: ['Nitrógeno ureico', 28, 0] };
function calcConversion() {
    const [nombre, pm, val] = SOLUTOS[$('mt-conv-soluto').value], V = leer('mt-conv-valor', 'el valor'), u = $('mt-conv-unidad').value, box = $('mt-conv-resultado');
    if (avisar(box, V)) return;
    const v = V.v;
    if (v === null) return ocultar(box);
    if (u === 'meq' && !val) return pintar(box, 'warn', `${nombre} no tiene carga: no se expresa en mEq/L.`);
    const mmol = u === 'mgdl' ? v * 10 / pm : u === 'mmol' ? v : v / val;
    const partes = [`<strong>${fmt(mmol * pm / 10, 1)} mg/dL</strong>`, `<strong>${fmt(mmol, 2)} mmol/L</strong>`];
    if (val) partes.push(`<strong>${fmt(mmol * val, 2)} mEq/L</strong>`);
    partes.push(`${fmt(mmol, 2)} mOsm/kg (n = 1)`);
    pintar(box, 'ok', `${nombre}: ${partes.join(' · ')}.`);
}
function calcCalibre() {
    const fr = $('mt-calibre-unidad').value === 'fr', V = leer('mt-calibre-valor', fr ? 'el calibre en French' : 'el calibre en mm', fr ? [0, 60] : [0, 20]), box = $('mt-calibre-resultado');
    if (avisar(box, V)) return;
    const v = V.v;
    if (v === null) return ocultar(box);
    pintar(box, 'ok', fr ? `${fmt(v, 0)} French ≈ <strong>${fmt(v / 3, 1)} mm</strong> de diámetro externo (regla: mm × 3 = French).` : `${fmt(v, 1)} mm ≈ <strong>${fmt(v * 3, 0)} French</strong> (regla: mm × 3 = French).`);
}
// Factores directos del apéndice (1 kPa = 7,5 mmHg = 10,2 cmH₂O; kPa = 0,133 × mmHg), de modo
// que el valor escrito se muestra tal cual: 40 mmHg sigue siendo 40 mmHg.
const PRES = { mmhg: { nombre: 'mmHg', kpa: 0.133, cmh2o: 1.36 }, kpa: { nombre: 'kPa', mmhg: 7.5, cmh2o: 10.2 }, cmh2o: { nombre: 'cmH₂O', kpa: 1 / 10.2, mmhg: 1 / 1.36 } };
const LIM_PRES = { mmhg: [0, 800], kpa: [0, 107], cmh2o: [0, 1100] };
function calcTempPres() {
    const tu = $('mt-temp-unidad').value, pu = $('mt-pres-unidad').value, box = $('mt-unid-resultado');
    const T = leer('mt-temp-valor', 'la temperatura', tu === 'c' ? [10, 45] : [50, 113]), P = leer('mt-pres-valor', 'la presión', LIM_PRES[pu]);
    if (avisar(box, T, P)) return;
    const t = T.v, p = P.v, partes = [];
    if (t !== null) partes.push(tu === 'c' ? `${fmtN(t)} °C = <strong>${fmt(9 / 5 * t + 32, 1)} °F</strong>` : `${fmtN(t)} °F = <strong>${fmt(5 / 9 * (t - 32), 1)} °C</strong>`);
    if (p !== null) {
        const f = PRES[pu], otras = Object.keys(f).filter(k => k !== 'nombre').map(k => ({ k, v: p * f[k] }));
        partes.push(`${fmtN(p)} ${f.nombre} = <strong>${fmt(otras[0].v, otras[0].k === 'kpa' ? 2 : 1)} ${PRES[otras[0].k].nombre}</strong> = ${fmt(otras[1].v, otras[1].k === 'kpa' ? 2 : 1)} ${PRES[otras[1].k].nombre}`);
    }
    if (!partes.length) return ocultar(box);
    pintar(box, 'ok', partes.join('<br>'));
}
const RAD = { 'mt-rad-rx': 0.02, 'mt-rad-tccr': 2, 'mt-rad-tct': 7, 'mt-rad-tca': 8, 'mt-rad-angio': 15 };
function calcRadiacion() {
    const box = $('mt-rad-resultado'), L = Object.keys(RAD).map(id => leer(id, 'el número de pruebas'));
    if (avisar(box, ...L)) return;
    if (L.every(l => l.v === null)) return ocultar(box);
    const total = Object.values(RAD).reduce((s, mSv, i) => s + (L[i].v ?? 0) * mSv, 0), pct = total / 50 * 100;
    pintar(box, pct >= 100 ? 'danger' : 'ok', `Dosis efectiva media estimada: <strong>${fmt(total, 2)} mSv</strong>, el ${fmt(pct, 0)}% del límite anual de la EPA (50 mSv). Equivale a ${fmt(Math.round(total / 0.02), 0)} radiografía${Math.round(total / 0.02) === 1 ? '' : 's'} de tórax de una proyección.`);
}
function calcImc() {
    const P = leer('mt-imc-peso', 'el peso'), T = leer('mt-imc-talla', 'la talla'), box = $('mt-imc-resultado');
    if (avisar(box, P, T)) return;
    if (P.v === null || T.v === null) return ocultar(box);
    const imc = r1(P.v / Math.pow(T.v / 100, 2));
    const [e, b] = imc < 18.5 ? ['warn', 'bajo peso'] : imc < 25 ? ['ok', 'saludable'] : imc < 30 ? ['warn', 'sobrepeso'] : imc < 40 ? ['danger', 'obesidad'] : ['danger', 'obesidad extrema'];
    pintar(box, e, `IMC <strong>${fmt(imc, 1)} kg/m²</strong>: ${b}.${imc <= 18.5 ? ' Es también criterio de riesgo de realimentación (Cap. 50).' : ''}`);
}
export function pefLeiner(sexo, edad, talla) {
    return (sexo === 'h' ? 3.95 - 0.0151 * edad : 2.93 - 0.0072 * edad) * talla;
}
function calcPef() {
    const s = $('mt-pef-sexo').value, E = leer('mt-pef-edad', 'la edad'), T = leer('mt-pef-talla', 'la talla'), M = leer('mt-pef-medido', 'el PEF medido'), box = $('mt-pef-resultado');
    if (avisar(box, E, T, M)) return;
    const e = E.v, t = T.v, m = M.v;
    if (e === null || t === null) return ocultar(box);
    const pred = pefLeiner(s, e, t);
    if (m === null) return pintar(box, 'ok', `PEF previsto: <strong>${fmt(pred, 0)} L/min</strong> (Leiner).`);
    const pct = m / pred * 100;
    pintar(box, 'neutro', `PEF previsto ${fmt(pred, 0)} L/min; medido ${fmt(m, 0)}: <strong>${fmt(pct, 0)}% del previsto</strong>. La gravedad del asma por el PEF, en Merino Neumología.`);
}
function calcVolemia() {
    const h = $('mt-volemia-sexo').value === 'h', P = leer('mt-volemia-peso', 'el peso'), box = $('mt-volemia-resultado');
    if (avisar(box, P)) return;
    const p = P.v;
    if (p === null) return ocultar(box);
    const [sa, he, pl] = h ? [66, 26, 40] : [60, 24, 36];
    pintar(box, 'ok', `Sangre <strong>${fmt(sa * p / 1000, 2)} L</strong> (${sa} mL/kg) · hematíes ${fmt(he * p / 1000, 2)} L (${he} mL/kg) · plasma ${fmt(pl * p / 1000, 2)} L (${pl} mL/kg).`);
}

// Apéndices como página de consulta: filtra por el texto escrito todo lo que hay en la ficha
// (filas de tabla con su cabecera, listas, acordeones, párrafos y calculadoras). Un rótulo de
// sección que coincide muestra su bloque entero. Sin coincidencias, un mensaje y nada más.
function filtroApendice(tabId) {
    const input = $(`${tabId}-buscar`), tab = $(tabId), cuenta = $(`${tabId}-buscar-n`);
    if (!input || !tab) return;
    const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const poner = (el, oculto) => { if (oculto) { el.hidden = true; el.dataset.filtrado = '1'; } else if (el.dataset.filtrado) { el.hidden = false; delete el.dataset.filtrado; } };
    const partesDe = el => el.matches('ol, ul') ? [...el.children] : el.matches('.micro-profiles') ? [...el.querySelectorAll('.micro-prof-item')] : el.querySelector('table') ? [...el.querySelectorAll('tbody tr')] : null;
    input.addEventListener('input', () => {
        const q = norm(input.value.trim());
        const raiz = tab.querySelector(':scope > .vista-texto') || tab, hijos = [...raiz.children].filter(el => !el.matches('h3, .mt-apx-buscar'));
        let seccionOk = false, total = 0, etiqueta = null, vistos = 0;
        const cierra = () => { if (etiqueta) poner(etiqueta, !!q && !vistos && !seccionOk); };
        hijos.forEach(el => {
            if (el.classList.contains('section-label')) {
                cierra(); etiqueta = el; vistos = 0; seccionOk = !q || norm(el.textContent).includes(q); if (q && seccionOk) total++; return;
            }
            const partes = partesDe(el), cab = el.querySelector('thead') ? norm(el.querySelector('thead').textContent) : '';
            let visible;
            if (partes) {
                const cabOk = cab.includes(q) && !!q;
                let n = 0;
                partes.forEach(p => {
                    const ok = !q || seccionOk || cabOk || norm(p.textContent).includes(q);
                    poner(p, !ok);
                    if (ok && q) { n++; const item = p.closest('.micro-prof-item'); if (item) { item.querySelector('.micro-prof-head')?.classList.add('open'); item.querySelector('.micro-prof-body')?.classList.add('active'); } if (p.classList.contains('micro-prof-item')) { p.querySelector('.micro-prof-head')?.classList.add('open'); p.querySelector('.micro-prof-body')?.classList.add('active'); } }
                });
                visible = !q || seccionOk || n > 0;
                total += n;
            } else {
                visible = !q || seccionOk || norm(el.textContent).includes(q);
                if (q && visible && !seccionOk) total++;
            }
            poner(el, !visible);
            if (visible) vistos++;
        });
        cierra();
        if (q && !total) {
            hijos.forEach(el => poner(el, true));
            cuenta.textContent = ' Sin coincidencias';
        } else cuenta.textContent = q ? ` ${total} coincidencia${total === 1 ? '' : 's'}` : '';
    });
}
export function init() {
    initCorkboard('marino-tox-corkboard', 'panel-marino-tox-tabs');
    enlazar(['mt-nomo-horas', 'mt-nomo-nivel', 'mt-nomo-unidad', 'mt-nomo-tipo'], calcNomograma);
    enlazar(['mt-nac-peso', 'mt-nac-hd'], calcNac);
    enlazar(idsDe('.mt-parar-check', 'mt-parar-c'), calcParar);
    enlazar(['mt-glucagon-peso', 'mt-glucagon-respuesta'], calcGlucagon);
    initSiNoWizard('mt-nal-wizard', NAL_WIZARD);
    filtroApendice('mt-unidades');
    filtroApendice('mt-referencias');
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
