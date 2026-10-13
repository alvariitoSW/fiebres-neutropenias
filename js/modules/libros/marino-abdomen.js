// Libros · Marino Abdomen y temperatura — The ICU Book (Marino PL, 5.ª ed.),
// caps. 39-44: fallo hepático, pancreatitis, infecciones abdominales y
// urinarias, trastornos de la termorregulación y fiebre en la UCI.
// Cuaderno de campo + calculadoras y selectores de cada ficha; todas las
// cifras salen del texto y las tablas citadas en la propia ficha.
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
// Selector con explicación en una caja tfg-estado: datos = { valor: [estado, html] }.
function selector(selectId, boxId, datos) {
    enlazar([selectId], () => {
        const v = $(selectId)?.value, box = $(boxId);
        if (!v || !datos[v]) return ocultar(box);
        pintar(box, datos[v][0], datos[v][1]);
    });
}

// ---- Cap. 39 — fallo hepático ------------------------------------------
const FHA_CAUSA = {
    paracetamol: ['danger', '<strong>Paracetamol</strong> (46% en EE. UU.): N-acetilcisteína IV ya, aunque el nivel sea indetectable (lo es en la mitad), y hasta que mejore la función hepática.'],
    isquemia: ['warn', '<strong>Hepatitis isquémica</strong>: tiende a resolverse si se corrige la hipoperfusión; un 25% necesita trasplante.'],
    autoinmune: ['warn', '<strong>Hepatitis autoinmune</strong>: inicio insidioso, ANA o antimúsculo liso, 80% mujeres, hipergammaglobulinemia.'],
    vhb: ['danger', '<strong>Hepatitis B</strong> reactivada por la inmunosupresión: con el fallo ya instaurado, los análogos de nucleósidos aportan poco (25% de supervivencia sin trasplante).'],
    farmaco: ['danger', '<strong>Fármaco</strong> (Tabla 39.1): retíralo. Las reacciones idiosincrásicas tienen un 40% de supervivencia sin trasplante.'],
    desconocida: ['warn', '<strong>Causa desconocida</strong>: es razonable dar N-acetilcisteína empírica, aunque sin pruebas convincentes de beneficio. Piensa también en HELLP, Budd-Chiari, herpes y neoplasias.'],
};
function calcCvvh() {
    const nh3 = num($('ma-cvvh-nh3')), olig = $('ma-cvvh-oliguria')?.value === 'si', edema = $('ma-cvvh-edema')?.value === 'si', wh = Number($('ma-cvvh-wh')?.value || 0), box = $('ma-cvvh-resultado');
    const motivos = [];
    if (nh3 !== null && nh3 > 150) motivos.push(`amonio ${fmt(nh3, 0)} µmol/L (&gt;150)`);
    if (olig) motivos.push('oliguria persistente');
    if (edema) motivos.push('edema cerebral');
    const grado = wh ? ` West Haven grado ${wh}: ${['', 'atención corta, cambio de personalidad', 'apatía, desorientado en el tiempo', 'estupor, desorientado en lugar y tiempo', 'coma'][wh]}.` : '';
    if (motivos.length) pintar(box, 'danger', `<strong>Hemofiltración (CVVH) cuanto antes</strong>: ${motivos.join(', ')}. Su eficacia depende del tiempo.${grado}${wh >= 2 ? ' Consulta con trasplante si la encefalopatía progresa.' : ''}`);
    else pintar(box, wh ? 'warn' : 'ok', `Sin indicación de CVVH por estos criterios${nh3 !== null ? ` (amonio ${fmt(nh3, 0)}; normal &lt;60)` : ''}.${grado} Lactulosa y rifaximina reducen el amonio intestinal.`);
}
function calcVarices() {
    const hechos = [...document.querySelectorAll('.ma-var-check')], falta = hechos.filter(c => !c.checked).map(c => c.value), box = $('ma-var-resultado');
    if (!falta.length) return pintar(box, 'ok', '<strong>Checklist completo</strong> (Tabla 39.3). Si sigue sangrando pese a todo (20%), valora el TIPS.');
    pintar(box, falta.length > 3 ? 'danger' : 'warn', `<strong>${hechos.length - falta.length}/${hechos.length}</strong>. Falta: ${falta.join(' · ')}.`);
}
const PBE_WIZARD = {
    inicio: { pregunta: '¿Neutrófilos en el líquido ascítico >250/mm³?', si: 'origen', no: { estado: 'tfg-estado-ok', final: 'No es una PBE (un cultivo positivo sin ese recuento no basta: repite la paracentesis).' } },
    origen: { pregunta: '¿Es comunitaria (sin contacto sanitario en los últimos 90 días)?', si: { estado: 'tfg-estado-warn', final: 'Cefalosporina de 3.ª generación (cefotaxima o ceftriaxona), al menos 7 días. Albúmina 1,5 g/kg el día 1 y 1 g/kg el día 3.' }, no: 'resistentes' },
    resistentes: { pregunta: 'Asociada a cuidados o nosocomial: ¿hay muchos gérmenes resistentes en tu UCI?', si: { estado: 'tfg-estado-danger', final: 'Carbapenémico (meropenem 1 g cada 8 h) ± vancomicina (SARM) o daptomicina (enterococo resistente a vancomicina). Al menos 7 días + albúmina.' }, no: { estado: 'tfg-estado-warn', final: 'Piperacilina-tazobactam, al menos 7 días + albúmina.' } },
};
function calcPmn() {
    const ini = num($('ma-pmn-inicial')), d48 = num($('ma-pmn-48')), box = $('ma-pmn-resultado');
    if (ini === null) return ocultar(box);
    let html = ini > 250 ? `<strong>PBE</strong> (${fmt(ini, 0)} &gt;250/mm³): antibiótico sin esperar al cultivo.` : `${fmt(ini, 0)}/mm³: no cumple el criterio de PBE (&gt;250).`;
    let estado = ini > 250 ? 'danger' : 'ok';
    if (ini > 250 && d48 !== null) {
        const caida = (ini - d48) / ini * 100;
        html += `<br>A las 48 h: ${fmt(d48, 0)}/mm³, un <strong>${fmt(caida, 0)}%</strong> ${caida >= 0 ? 'menos' : 'más'}. ${caida >= 25 ? '<strong>Respuesta favorable</strong> (≥25%).' : '<strong>Respuesta insuficiente</strong> (&lt;25%): revisa el antibiótico y busca una peritonitis secundaria.'}`;
        estado = caida >= 25 ? 'ok' : 'danger';
    }
    pintar(box, estado, html);
}
function calcAlbumina() {
    const peso = num($('ma-alb-peso')), box = $('ma-alb-resultado');
    if (peso === null || peso <= 0) return ocultar(box);
    const d1 = 1.5 * peso, d3 = peso;
    pintar(box, 'ok', `Día 1: <strong>${fmt(d1, 0)} g</strong> (1,5 g/kg) = ${fmt(d1 * 4, 0)} mL de albúmina al 25%. Día 3: <strong>${fmt(d3, 0)} g</strong> (1 g/kg) = ${fmt(d3 * 4, 0)} mL al 25%.`);
}
function calcShr() {
    const c = [...document.querySelectorAll('.ma-shr-check')], n = c.filter(x => x.checked).length, box = $('ma-shr-resultado');
    if (n === c.length) return pintar(box, 'danger', '<strong>Cumple los 5 criterios de síndrome hepatorrenal</strong> (Tabla 39.4): albúmina al 25% 20-40 g/día + terlipresina (1 mg IV cada 4-6 h o 2 mg/día en perfusión) o noradrenalina 5-40 µg/min. Consulta para trasplante. Mide la presión intraabdominal si hay ascitis a tensión.');
    pintar(box, n ? 'warn' : 'ok', `<strong>${n}/5 criterios</strong>: el diagnóstico exige los cinco.`);
}

// ---- Cap. 40 — pancreatitis --------------------------------------------
function calcAtlanta() {
    const dx = [...document.querySelectorAll('.ma-atl-dx')].filter(c => c.checked).length, fallo = $('ma-atl-fallo')?.value, compl = $('ma-atl-compl')?.value === 'si', box = $('ma-atl-resultado');
    if (dx < 2) return pintar(box, 'ok', `<strong>${dx}/3 criterios</strong>: el diagnóstico exige 2 de 3 (dolor característico, lipasa o amilasa &gt;3 veces, imagen).`);
    let grav, estado;
    if (fallo === 'persistente') { grav = '<strong>grave</strong> (fallo orgánico &gt;48 h): mortalidad del 20-25%'; estado = 'danger'; }
    else if (fallo === 'transitorio' || compl) { grav = '<strong>moderadamente grave</strong> (fallo transitorio &lt;48 h o complicaciones sin fallo persistente)'; estado = 'warn'; }
    else { grav = '<strong>leve</strong> (sin fallo orgánico ni complicaciones)'; estado = 'ok'; }
    pintar(box, estado, `<strong>Pancreatitis aguda</strong> (${dx}/3 criterios), ${grav}. Repite la imagen si persisten los síntomas: la necrosis puede no verse la primera semana.`);
}
function calcRingerLactato() {
    const peso = num($('ma-rl-peso')), hipo = $('ma-rl-hipovolemia')?.value === 'si', ca = $('ma-rl-calcio')?.value === 'si', box = $('ma-rl-resultado');
    if (peso === null || peso <= 0) return ocultar(box);
    const fluido = ca ? 'un cristaloide <strong>sin calcio</strong> (el Ringer lactato no se usa en la pancreatitis por hipercalcemia)' : '<strong>Ringer lactato</strong>';
    const bolo = hipo ? `bolo de <strong>${fmt(10 * peso, 0)} mL</strong> (10 mL/kg) y después ` : 'sin bolo (no hay hipovolemia) y ';
    pintar(box, ca ? 'warn' : 'ok', `Con ${fluido}: ${bolo}<strong>${fmt(1.5 * peso, 0)} mL/h</strong> (1,5 mL/kg/h). Objetivo: PAM ≥65 mmHg y diuresis ≥${fmt(0.5 * peso, 0)} mL/h. No subas a 20 mL/kg y 3 mL/kg/h: sobrecarga sin mejorar el pronóstico.`);
}
function calcTrigliceridos() {
    const peso = num($('ma-tg-peso')), tg = num($('ma-tg-valor')), box = $('ma-tg-resultado');
    if (peso === null || tg === null || peso <= 0) return ocultar(box);
    const causa = tg > 1000 ? 'Triglicéridos &gt;1.000 mg/dL: pueden ser la causa de la pancreatitis. ' : 'Por debajo de 1.000 mg/dL los triglicéridos no explican la pancreatitis según la ficha. ';
    const pasos = `Insulina IV a <strong>${fmt(0.1 * peso, 1)}-${fmt(0.4 * peso, 1)} U/h</strong> (0,1-0,4 U/kg/h) con ayuno y glucosado al 5-10%, vigilando la glucemia. Con ayuno baja los triglicéridos un 85-90% en 24 h: de ${fmt(tg, 0)} a unos <strong>${fmt(tg * 0.1, 0)}-${fmt(tg * 0.15, 0)} mg/dL</strong>. Objetivo &lt;500 mg/dL.`;
    pintar(box, tg > 1000 ? 'danger' : tg > 500 ? 'warn' : 'ok', causa + (tg > 500 ? pasos : 'Ya por debajo del objetivo (&lt;500 mg/dL).'));
}

// ---- Cap. 41 — infecciones abdominales ---------------------------------
function calcBilis() {
    const s = $('ma-bilis-farmaco'), box = $('ma-bilis-resultado');
    if (!s?.value) return ocultar(box);
    const nombre = s.options[s.selectedIndex].text;
    if (s.value === 'buena') pintar(box, 'ok', `<strong>${nombre}</strong>: buena penetración en la bilis (Tabla 41.1).`);
    else pintar(box, 'warn', `<strong>${nombre}</strong>: mala penetración en la bilis (Tabla 41.1). Valora otra opción que cubra los gramnegativos entéricos.`);
}
const CDI_WIZARD = {
    inicio: { pregunta: '¿La PCR del gen de la toxina B en heces es positiva?', si: 'elisa', no: { estado: 'tfg-estado-ok', final: 'PCR negativa: descarta la infección por C. difficile (no hay C. difficile toxigénico).' } },
    elisa: { pregunta: 'PCR positiva = toxigénico, pero puede ser colonización. ¿El ELISA de toxinas A y B es positivo?', si: { estado: 'tfg-estado-danger', final: 'Infección confirmada: vancomicina 125 mg VO cada 6 h o fidaxomicina 200 mg cada 12 h, 10 días.' }, no: 'sospecha' },
    sospecha: { pregunta: 'ELISA negativo (pierde un 20%). ¿La sospecha clínica sigue siendo alta?', si: { estado: 'tfg-estado-warn', final: 'Colonoscopia: las pseudomembranas confirman el diagnóstico.' }, no: { estado: 'tfg-estado-ok', final: 'PCR positiva sin toxinas: la mayoría evoluciona bien sin tratamiento. No trates solo por la PCR.' } },
};
const CDI_TTO = {
    inicial: ['warn', 'Vancomicina <strong>125 mg VO cada 6 h</strong> 10 días, o fidaxomicina <strong>200 mg VO cada 12 h</strong> 10 días. La fiebre cede en 24-48 h y la diarrea en 4-5 días.'],
    fulminante: ['danger', 'Vancomicina <strong>500 mg cada 6 h</strong> VO, por sonda o en enema <strong>+ metronidazol 500 mg IV cada 8 h</strong>. El megacolon tóxico es una urgencia quirúrgica: colectomía subtotal si hace falta.'],
    'rec1-vanco': ['warn', 'Fidaxomicina 200 mg cada 12 h 10 días, o vancomicina en pauta prolongada: 125 mg cada 6 h 10-14 días, cada 12 h 7 días, cada 24 h 7 días y cada 2-3 días 2-8 semanas.'],
    'rec1-fidax': ['warn', 'Vancomicina en pauta prolongada (125 mg cada 6 h 10-14 días, cada 12 h 7 días, cada 24 h 7 días y cada 2-3 días 2-8 semanas). La fidaxomicina como opción de recurrencia solo se da si el primer episodio se trató con vancomicina.'],
    rec2: ['danger', '<strong>Trasplante de microbiota fecal</strong>: curación del 80-100% en la infección recurrente.'],
};
// Tabla 41.3: columnas gramnegativos, Pseudomonas, enterococos, anaerobios, BLEE ('+', '±', '-').
const TABLA_41_3 = [
    ['Piperacilina-tazobactam', ['+', '+', '+', '+', '±']],
    ['Meropenem', ['+', '+', '±', '+', '+']],
    ['Tigeciclina', ['+', '-', '+', '+', '+']],
    ['Ceftazidima-avibactam', ['+', '+', '-', '-', '+']],
    ['Amikacina', ['+', '+', '-', '-', '±']],
    ['Ceftriaxona', ['+', '-', '-', '-', '-']],
    ['Metronidazol', ['-', '-', '-', '+', '-']],
];
function calcCobertura() {
    const cols = [...document.querySelectorAll('.ma-cob-germen:checked')].map(c => Number(c.value)), shock = $('ma-cob-shock')?.value === 'si', box = $('ma-cob-resultado');
    if (!cols.length) return pintar(box, 'ok', 'Marca al menos un grupo de gérmenes.');
    let solos = TABLA_41_3.filter(([, c]) => cols.every(i => c[i] === '+')).map(([n]) => n);
    const avisos = [];
    if (shock && solos.includes('Tigeciclina')) { solos = solos.filter(n => n !== 'Tigeciclina'); avisos.push('la tigeciclina no se recomienda en el shock séptico'); }
    // Parejas que la ficha cita: ceftriaxona + metronidazol y amikacina + metronidazol.
    const parejas = [['Ceftriaxona', 'Metronidazol'], ['Amikacina', 'Metronidazol']]
        .filter(([a, b]) => { const ca = TABLA_41_3.find(x => x[0] === a)[1], cb = TABLA_41_3.find(x => x[0] === b)[1]; return cols.every(i => ca[i] === '+' || cb[i] === '+'); })
        .map(p => p.join(' + '));
    let html = solos.length ? `<strong>Cubren todo en monoterapia</strong>: ${solos.join(', ')}.` : '<strong>Ningún antibiótico de la tabla lo cubre todo solo.</strong>';
    if (parejas.length) html += `<br>Combinaciones de la ficha que lo cubren: ${parejas.join('; ')}${parejas.includes('Amikacina + Metronidazol') ? ' (la de la alergia a betalactámicos)' : ''}.`;
    if (shock && solos.includes('Meropenem')) html += '<br>En el shock séptico, el de elección es el <strong>meropenem</strong>.';
    if (avisos.length) html += `<br><small>${avisos.join('; ')}.</small>`;
    html += '<br><small>Ojo: el meropenem no cubre SARM ni enterococo resistente a vancomicina.</small>';
    pintar(box, solos.length ? 'ok' : 'warn', html);
}

// ---- Cap. 42 — infección urinaria y candiduria -------------------------
function calcNhsn() {
    const sonda = $('ma-nhsn-sonda')?.value === 'si', sint = [...document.querySelectorAll('.ma-nhsn-sintoma:checked')].length, cult = $('ma-nhsn-cultivo')?.value === 'si', hemo = $('ma-nhsn-hemo')?.value === 'si', box = $('ma-nhsn-resultado');
    if (!cult) return pintar(box, 'ok', 'Sin urocultivo significativo (≤2 especies con una bacteria &gt;10⁵ UFC/mL): no es infección urinaria.');
    if (hemo) return pintar(box, 'danger', '<strong>Infección urinaria</strong> (bacteriémica): mismo germen en orina y sangre, haya o no síntomas. Empírico: piperacilina-tazobactam o carbapenémico (gramnegativos + enterococo).');
    if (sonda && sint) return pintar(box, 'danger', '<strong>Infección urinaria asociada a sonda</strong> (criterios NHSN). Empírico: piperacilina-tazobactam o carbapenémico; ajusta al cultivo, recambia la sonda si lleva &gt;2 semanas; 7 días si responde pronto, 10-14 si no.');
    if (sint) return pintar(box, 'warn', 'Hay síntomas y cultivo, pero sin sonda ≥2 días no cumple la definición de infección <em>asociada a sonda</em>.');
    pintar(box, 'ok', '<strong>Bacteriuria asintomática</strong>: no se trata (salvo antes de un procedimiento urológico con sangrado de mucosa).');
}
const CANDIDURIA = {
    asint: ['ok', 'Suele ser colonización: <strong>no se trata</strong>.'],
    neutro: ['warn', 'Riesgo de diseminación: la fuente propone una <strong>equinocandina</strong> (caspofungina, micafungina o anidulafungina).'],
    sistemica: ['danger', '<strong>Equinocandina</strong> (activa frente a todas las especies). Hemocultivos e imagen renal (abscesos, obstrucción).'],
    sensible: ['warn', '<strong>Fluconazol oral 200-400 mg/día, 2 semanas</strong>.'],
    resistente: ['danger', '<strong>Anfotericina B 0,3-0,6 mg/kg/día, 1-7 días</strong>. No equinocandinas: penetran mal en la orina.'],
    bola: ['danger', 'Bola fúngica: <strong>cirugía</strong>. Con nefrostomía, lavados con anfotericina B 25-50 mg en 200-500 mL de agua estéril.'],
};

// ---- Cap. 43 — calor, hipertermias e hipotermia ------------------------
function calcCalor() {
    const t = num($('ma-calor-temp')), snc = $('ma-calor-snc')?.value === 'si', hemo = $('ma-calor-hemo')?.value === 'si', box = $('ma-calor-resultado');
    if (t === null) return ocultar(box);
    if (t >= 41 || snc || hemo) {
        const min = t > 38 ? (t - 38) / 0.3 : 0;
        return pintar(box, 'danger', `<strong>Golpe de calor</strong>${t < 41 ? ' (por la clínica, aunque la temperatura sea &lt;41 °C)' : ''}: volumen y enfriamiento activo hasta 38 °C. Con enfriamiento evaporativo (0,3 °C/min) bajar de ${fmt(t, 1)} a 38 °C lleva unos <strong>${fmt(min, 0)} min</strong>. Vigila el escalofrío.`);
    }
    if (t >= 38) return pintar(box, 'warn', '<strong>Agotamiento por calor</strong>: deshidratación sin compromiso hemodinámico ni del SNC. Volumen y medidas generales; no hace falta enfriar de forma activa.');
    pintar(box, 'ok', 'Temperatura &lt;38 °C sin disfunción del SNC ni hemodinámica: no es un síndrome mayor por calor.');
}
function calcDiferencial() {
    const f = $('ma-dif-farmaco')?.value, clonus = $('ma-dif-clonus')?.checked, etco2 = $('ma-dif-etco2')?.checked, ck = $('ma-dif-ck')?.checked, box = $('ma-dif-resultado');
    if (!f) return ocultar(box);
    let html, estado = 'danger';
    if (f === 'anestesico' || etco2) html = '<strong>Hipertermia maligna</strong>: suspende el anestésico y da <strong>dantroleno</strong>. Avisa a la familia (autosómica dominante).';
    else if (f === 'sero' || clonus) html = '<strong>Síndrome serotoninérgico</strong>: hiperreflexia, mioclonías y clonus son lo más específico. Retira los fármacos; en los graves, ciproheptadina 12 mg y después 2 mg cada 2 h.';
    else if (f === 'retirada') html = '<strong>Síndrome neuroléptico maligno por retirada</strong>: <strong>reinicia</strong> el dopaminérgico ya y bájalo despacio después.';
    else html = '<strong>Síndrome neuroléptico maligno</strong>: retira el fármaco; bromocriptina 10 mg cada 8 h o dantroleno en los graves; profilaxis tromboembólica obligatoria.';
    if (f === 'sero' && etco2) html += '<br><small>Aviso: la subida del CO₂ espirado orienta a hipertermia maligna; revisa si hubo anestésico.</small>';
    if ((f === 'antidopa' || f === 'retirada') && clonus) html += '<br><small>El clonus apunta a síndrome serotoninérgico: revisa los fármacos (comparten algunos).</small>';
    if (ck) html += '<br>CK &gt;1.000 U/L: típica del SNM (en la distonía solo sube algo); vigila la rabdomiólisis y el riñón.';
    pintar(box, estado, html);
}
function calcDantroleno() {
    const peso = num($('ma-dant-peso')), sind = $('ma-dant-sindrome')?.value, box = $('ma-dant-resultado');
    if (peso === null || peso <= 0) return ocultar(box);
    if (sind === 'hm') pintar(box, 'danger', `Bolo IV rápido de <strong>${fmt(peso, 0)}-${fmt(2 * peso, 0)} mg</strong> (1-2 mg/kg), repetido cada pocos minutos hasta que ceda o hasta <strong>${fmt(10 * peso, 0)} mg</strong> acumulados (10 mg/kg). Después ${fmt(peso, 0)}-${fmt(2 * peso, 0)} mg cada 6 h al menos 24 h.`);
    else pintar(box, 'warn', `<strong>${fmt(peso, 0)} mg IV cada 8 h</strong> (1 mg/kg) hasta resolución o ${fmt(10 * peso, 0)} mg acumulados; después 50-200 mg/día VO en 3-4 dosis. Pauta sugerida, no bien definida.`);
}
function calcHipotermia() {
    const t = num($('ma-hipo-t')), iot = $('ma-hipo-iot')?.value === 'si', box = $('ma-hipo-resultado');
    if (t === null) return ocultar(box);
    if (t >= 35) return pintar(box, 'ok', 'Temperatura ≥35 °C: no hay hipotermia.');
    let grado, estado, rec;
    if (t >= 32) { grado = 'leve (32-35 °C)'; estado = 'warn'; rec = 'recalentamiento externo (pasivo o activo)'; }
    else if (t >= 28) { grado = 'moderada (28-31,9 °C)'; estado = 'danger'; rec = 'recalentamiento externo activo; arritmias y bradicardia resistente a atropina por debajo de 32 °C'; }
    else { grado = t < 24 ? 'grave, en rango mortal (&lt;24 °C: apnea y asistolia)' : 'grave (&lt;28 °C)'; estado = 'danger'; rec = 'si el externo activo no basta, recalentamiento interno; riesgo de fibrilación ventricular; ECMO venoarterial en la parada'; }
    let html = `Hipotermia <strong>${grado}</strong>: ${rec}. Fluidos calentados.`;
    if (iot && t < 32) html += ` Gases inspirados a 40-45 °C: +2,5 °C/h → unas <strong>${fmt((32 - t) / 2.5, 1)} h</strong> hasta 32 °C y ${fmt((35 - t) / 2.5, 1)} h hasta 35 °C (solo con este método).`;
    if (t < 28) html += '<br>No declares la muerte sin recalentar antes.';
    pintar(box, estado, html);
}

// ---- Cap. 44 — fiebre --------------------------------------------------
function calcTemperatura() {
    const v = num($('ma-tconv-valor')), u = $('ma-tconv-unidad')?.value, neutro = $('ma-tconv-neutro')?.value === 'si', box = $('ma-tconv-resultado');
    if (v === null) return ocultar(box);
    const c = u === 'f' ? 5 / 9 * (v - 32) : v, f = 9 / 5 * c + 32;
    const umbral = neutro ? 38.0 : 38.3;
    const fiebre = c >= umbral;
    pintar(box, fiebre ? 'warn' : 'ok', `<strong>${fmt(c, 1)} °C = ${fmt(f, 1)} °F</strong>. ${fiebre ? `<strong>Fiebre</strong> (≥${fmt(umbral, 1)} °C${neutro ? ', mantenida ≥1 h en el neutropénico' : ''}): merece estudio, pero la mitad no es infecciosa.` : `Por debajo del umbral de fiebre (${fmt(umbral, 1)} °C).`}`);
}
const DETECCION = { endo: [89, 94, 94, 100], otras: [65, 80, 96, 100] };
function calcHemocultivos() {
    const n = Number($('ma-hemoc-n')?.value || 0), tipo = $('ma-hemoc-tipo')?.value, box = $('ma-hemoc-resultado');
    if (!n || !tipo) return ocultar(box);
    const pct = DETECCION[tipo][n - 1];
    const objetivo = tipo === 'endo' ? 2 : 3;
    pintar(box, n >= objetivo ? 'ok' : 'warn', `Con ${n} hemocultivo${n > 1 ? 's' : ''} en 24 h se detecta el <strong>${pct}%</strong> de las bacteriemias (Figura 44.3). ${n >= objetivo ? 'Suficiente' : `Recomendado: ${tipo === 'endo' ? '2 en la endocarditis' : '3-4 en 24 h'}`}. Extrae 20-30 mL por punción.`);
}
function calcDtp() {
    const cvc = num($('ma-dtp-cvc')), per = num($('ma-dtp-per')), box = $('ma-dtp-resultado');
    if (cvc === null || per === null || cvc < 0 || per < 0) return ocultar(box);
    const d = per - cvc;
    pintar(box, d >= 2 ? 'danger' : 'ok', `El catéter crece <strong>${fmt(Math.abs(d), 1)} h ${d >= 0 ? 'antes' : 'después'}</strong> que la periferia. ${d >= 2 ? '<strong>≥2 h antes: sepsis por catéter</strong> (con el mismo germen en las dos muestras).' : 'Menos de 2 h antes: no cumple el criterio de sepsis por catéter.'}`);
}
function calcAntipiretico() {
    const peso = num($('ma-antip-peso')), cerebro = $('ma-antip-cerebro')?.value === 'si', higado = $('ma-antip-higado')?.value === 'si', box = $('ma-antip-resultado');
    if (peso === null || peso <= 0) return ocultar(box);
    const ibu = Math.min(10 * peso, 800), keto = 0.5 * peso;
    let html = cerebro ? '<strong>Sí, bájala</strong>: con lesión cerebral isquémica (posparada o ictus) la fiebre es dañina.' : '<strong>No suprimas la fiebre de rutina</strong>: es una respuesta adaptativa (las guías no recomiendan tratarla sistemáticamente).';
    html += '<br>Si decides tratarla: ';
    html += higado ? 'paracetamol <strong>contraindicado</strong> (insuficiencia hepática); ' : 'paracetamol 650 mg cada 6 h (VO, rectal o IV) o 1.000 mg IV cada 8 h, máximo 3 g/día; ';
    html += `ibuprofeno IV <strong>${fmt(ibu, 0)} mg</strong> cada 6 h (10 mg/kg, máx. 800) o ketorolaco IV <strong>${fmt(keto, 0)} mg</strong> en dosis única (0,5 mg/kg). Nada de mantas de enfriamiento.`;
    pintar(box, cerebro ? 'warn' : 'ok', html);
}

export function init() {
    initCorkboard('marino-abd-corkboard', 'panel-marino-abd-tabs');
    selector('ma-fha-causa', 'ma-fha-causa-resultado', FHA_CAUSA);
    enlazar(['ma-cvvh-nh3', 'ma-cvvh-oliguria', 'ma-cvvh-edema', 'ma-cvvh-wh'], calcCvvh);
    enlazar(idsDe('.ma-var-check', 'ma-var-c'), calcVarices);
    initSiNoWizard('ma-pbe', PBE_WIZARD);
    enlazar(['ma-pmn-inicial', 'ma-pmn-48'], calcPmn);
    enlazar(['ma-alb-peso'], calcAlbumina);
    enlazar(idsDe('.ma-shr-check', 'ma-shr-c'), calcShr);
    enlazar([...idsDe('.ma-atl-dx', 'ma-atl-c'), 'ma-atl-fallo', 'ma-atl-compl'], calcAtlanta);
    enlazar(['ma-rl-peso', 'ma-rl-hipovolemia', 'ma-rl-calcio'], calcRingerLactato);
    enlazar(['ma-tg-peso', 'ma-tg-valor'], calcTrigliceridos);
    enlazar(['ma-bilis-farmaco'], calcBilis);
    initSiNoWizard('ma-cdi', CDI_WIZARD);
    selector('ma-cditto-situacion', 'ma-cditto-resultado', CDI_TTO);
    enlazar([...idsDe('.ma-cob-germen', 'ma-cob-c'), 'ma-cob-shock'], calcCobertura);
    enlazar(['ma-nhsn-sonda', ...idsDe('.ma-nhsn-sintoma', 'ma-nhsn-c'), 'ma-nhsn-cultivo', 'ma-nhsn-hemo'], calcNhsn);
    selector('ma-cand-escenario', 'ma-cand-resultado', CANDIDURIA);
    enlazar(['ma-calor-temp', 'ma-calor-snc', 'ma-calor-hemo'], calcCalor);
    enlazar(['ma-dif-farmaco', 'ma-dif-clonus', 'ma-dif-etco2', 'ma-dif-ck'], calcDiferencial);
    enlazar(['ma-dant-peso', 'ma-dant-sindrome'], calcDantroleno);
    enlazar(['ma-hipo-t', 'ma-hipo-iot'], calcHipotermia);
    enlazar(['ma-tconv-valor', 'ma-tconv-unidad', 'ma-tconv-neutro'], calcTemperatura);
    enlazar(['ma-hemoc-n', 'ma-hemoc-tipo'], calcHemocultivos);
    enlazar(['ma-dtp-cvc', 'ma-dtp-per'], calcDtp);
    enlazar(['ma-antip-peso', 'ma-antip-cerebro', 'ma-antip-higado'], calcAntipiretico);
}
