// El émbolo y la lisis: la embolia pulmonar sobre el vaso vivo (Libros → Marino, cap. 22; su ficha es Neumología →
// Merino → «EP: manejo», neumo-ep-manejo). Datos puros, sin DOM.
// Fuente: docs/marino-2024-respiratory-management-caps22-26.pdf, PDF p. 8-11 (las páginas son las del PDF).
//
// El estado (en vaso-vivo-data.js): lesion: 'placa' con emb: true (la misma arteria, sin placa: el émbolo es un trombo
// venoso que llega migrado); tto: 'heparina' | 'lisis' | 'ambas'; horas: desde los síntomas (0-96, tope ilustrativo);
// peso (40-150, ilustrativo); y las cinco contraindicaciones absolutas (p. 9): sang, hem, isq, snc, cir.

export const PDF_TEP = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const L22 = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 22', pdf: PDF_TEP };
export const EP = (id, pag) => ({ ...L22, ficha: 'neumo-ep-manejo', id, pag });
// El mecanismo de la plasmina no está en el cap. 22: sale del cap. 20 (trombolíticos, p. 44)
export const PLASMINA = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 20', pdf: 'docs/marino-2024-cardiac-disorders-caps18-21.pdf', ficha: 'mc-sca-tratamiento', id: 'mc-trombolitico-mecanismo', pag: '44' };
const FEP = 'ficha · neumo-ep-manejo';

// Campos nuevos del estado base (vaso-vivo-data.js los añade a estadoBase)
export const BASE_TEP = { emb: false, tto: 'heparina', sang: false, hem: false, isq: false, snc: false, cir: false };
export const TTO = { heparina: 'Heparina', lisis: 'Lisis sola', ambas: 'Lisis + heparina' };
// Las contraindicaciones absolutas de la lisis (p. 9)
export const CONTRA = [['sang', 'Sangrado activo'], ['hem', 'Ictus hemorrágico previo'], ['isq', 'Ictus isquémico <6 meses'], ['snc', 'Neoplasia del SNC'], ['cir', 'Cirugía, trauma o TCE <3 sem']];
// El reloj desde los síntomas: 0-96 h (96 = ilustrativo); el mayor beneficio de la lisis, en las primeras 48 h (p. 10).
// Aviso a las 40 h (≈80 % de 48, REGLAS §1.14): ilustrativo.
export const RELOJ_TEP = { min: 0, max: 96, paso: 1, inicio: 6, beneficio: 48, aviso: 40 };
// El peso: 40-150 kg (ilustrativo). Alteplasa estándar 100 mg en 2 h; con colapso, 0,6 mg/kg en 15 min, máximo 50 mg (p. 8-9).
export const PESO_TEP = { min: 40, max: 150, paso: 1, inicio: 80, estandar: 100, mgKg: 0.6, maxAcel: 50 };
export const acelMg = peso => Math.min(PESO_TEP.maxAcel, +(PESO_TEP.mgKg * peso).toFixed(1));
const num = x => String(x).replace('.', ',');

export const hayContra = e => CONTRA.some(([k]) => e[k]);
export const contrasDe = e => CONTRA.filter(([k]) => e[k]).map(([, n]) => n);
// El tratamiento que pide el estado incluye la lisis (con una contraindicación se apaga: la ficha da la trombectomía)
export const pideLisis = e => e.tto === 'lisis' || e.tto === 'ambas';
export const lisisTep = e => !!e.emb && pideLisis(e) && !hayContra(e);
export const heparinaTep = e => e.tto === 'heparina' || e.tto === 'ambas';

// Los topes: sello (contraindicación y reoclusión) y avisos (reloj, sangrado, dosis)
export function topesTep(e) {
    const out = [];
    const A = (clave, titulo, texto, cita, origen, bajo) => out.push({ clave, nivel: 'aviso', titulo, texto, cita, origen, bajo });
    if (hayContra(e)) out.push({ clave: 'tep-contra', nivel: 'sello', titulo: 'Lisis contraindicada:', texto: `${contrasDe(e).join('; ')}. Alternativa de la ficha: trombectomía mecánica por catéter, como rescate.`, cita: EP('nep-trombolisis', '9-10'), origen: `${FEP} · p. 9-10`, deshabilita: ['[data-vso-tep="lisis"]', '[data-vso-tep="ambas"]'] });
    else if (e.tto === 'lisis') out.push({ clave: 'tep-reoclusion', nivel: 'sello', titulo: 'Trombina liberada: reoclusión.', texto: 'Al disolverse el coágulo se libera trombina, que puede reocluir el vaso: la heparina es especialmente útil después de la lisis.', cita: EP('nep-trombolisis', '9'), origen: `${FEP} · p. 9`, deshabilita: [] });
    if (lisisTep(e)) {
        A('tep-sangrado', 'Sangrado mayor:', '10-12 % con la lisis sistémica, con hemorragia intracraneal en 1-2 %; borra el beneficio global.', EP('nep-trombolisis', '9'), `${FEP} · p. 9`, '#vso-fila-tep-pac');
        if (e.peso >= 84) A('tep-acel', 'Dosis acelerada:', `desde 84 kg (0,6 mg/kg = ${num(+(0.6 * e.peso).toFixed(1))} mg) se queda en el máximo de 50 mg.`, EP('nep-tabla-22-3', '8'), `${FEP} · p. 8-9; el peso, ilustrativo`, '#vso-fila-tep-peso');
    }
    if (e.horas > RELOJ_TEP.beneficio) A('tep-reloj', 'Pasadas 48 h:', 'la lisis da menos beneficio (el mayor está en las primeras 48 h); la ficha no da un corte más allá.', EP('nep-trombolisis', '10'), `${FEP} · p. 10`, '#vso-fila-tep-reloj');
    else if (e.horas >= RELOJ_TEP.aviso) A('tep-reloj', 'Se acaban las 48 h:', 'el mayor beneficio de la lisis ocurre dentro de las 48 h desde los síntomas.', EP('nep-trombolisis', '10'), `${FEP} · p. 10; aviso a las 40 h: ilustrativo`, '#vso-fila-tep-reloj');
    if (e.horas >= RELOJ_TEP.max) A('tep-reloj-fin', 'Fin del reloj:', 'tope de 96 h del mando.', null, 'tope de 96 h: ilustrativo', '#vso-fila-tep-reloj');
    if (e.peso >= PESO_TEP.max) A('tep-peso-fin', 'Fin del mando:', 'tope de 150 kg.', null, 'tope de 150 kg: ilustrativo', '#vso-fila-tep-peso');
    return out;
}

// El tablero: las mismas 8 casillas del vaso, con su rótulo de EP
export function tableroTep(e) {
    const C = (n, v, u, o, cls = '', ilu = false) => ({ n, v, u, o, cls, ilu });
    const lisis = lisisTep(e), c = {}, hep = heparinaTep(e);
    c.plaq = C('Émbolo', lisis ? 'se reabre' : 'sigue ahí', lisis ? 'el vaso vuelve a pasar' : 'no se disuelve', lisis ? 'ficha · p. 9' : 'ficha · p. 11', lisis ? 'bien' : 'alarma');
    c.tapon = C('Fibrina', lisis ? 'cortada' : 'intacta', lisis ? 'plasmina' : 'el émbolo no cambia', lisis ? 'ficha · cap. 20 p. 44' : 'ficha · p. 11', lisis ? 'bien' : '');
    c.inr = lisis ? (hep ? C('Trombina', 'frenada', 'por la heparina', 'ficha · p. 9', 'bien') : C('Trombina', 'liberada', 'riesgo de reoclusión', 'ficha · p. 9', 'alarma')) : C('Trombina', '—', 'sin lisis', '');
    c.aptt = hep ? C('PTT objetivo', '46-70 s', '1,5-2,5 × control', 'ficha · p. 9', 'bien') : C('PTT objetivo', '—', 'sin heparina', '');
    c.fib = lisis ? C('Sangrado mayor', '10-12 %', 'HIC 1-2 %', 'ficha · p. 9', 'aviso') : C('Sangrado mayor', '—', 'sin lisis', '');
    c.dd = C('Desde síntomas', `${e.horas} h`, e.horas > RELOJ_TEP.beneficio ? 'menos beneficio' : 'mayor beneficio', e.horas > RELOJ_TEP.beneficio ? 'ficha · p. 10' : 'ficha · p. 10', e.horas > RELOJ_TEP.beneficio ? 'aviso' : '');
    c.esq = lisis ? C('Alteplasa', '100 mg en 2 h', `colapso: ${num(acelMg(e.peso))} mg en 15 min`, 'ficha · p. 8-9', 'bien') : C('Alteplasa', '—', 'sin lisis', '');
    if (hayContra(e)) c.amenaza = C('Salida', 'trombectomía', 'rescate por catéter', 'ficha · p. 10', 'alarma');
    else if (lisis) c.amenaza = C('Salida', hep ? 'lisis + heparina' : 'lisis sin heparina', hep ? 'durante y después' : 'la trombina reocluye', 'ficha · p. 9', hep ? 'bien' : 'alarma');
    else c.amenaza = C('Salida', 'heparina', 'evita el siguiente', 'ficha · p. 11', 'bien');
    return c;
}

// La frase viva del émbolo: [html, origen]
export function fraseTep(e) {
    if (hayContra(e)) return ['<span class="hl-rojo">Contraindicación absoluta</span> de la lisis: sangrado activo, ictus hemorrágico previo, ictus isquémico en los últimos 6 meses, neoplasia del SNC o cirugía, trauma mayor o TCE en las últimas 3 semanas. La ficha deja la <span class="hl">trombectomía mecánica</span> por catéter como rescate.', `${FEP}#nep-trombolisis · p. 9-10`];
    if (e.tto === 'lisis') return ['La lisis disuelve el coágulo y libera <span class="hl-rojo">trombina</span>, que puede reocluir el vaso. Sin heparina, el émbolo se reabre pero se vuelve a tejer la red.', `${FEP}#nep-trombolisis · p. 9`];
    if (e.tto === 'ambas') return [`La heparina sigue <span class="hl-azul">durante y después</span> de la lisis: el coágulo se disuelve y la trombina liberada queda frenada. Alteplasa ${PESO_TEP.estandar} mg en 2 h; con colapso inminente, 0,6 mg/kg en 15 min (${num(acelMg(e.peso))} mg para ${e.peso} kg; máximo 50 mg).`, `${FEP}#nep-trombolisis · p. 8-9`];
    return ['Con heparina el émbolo <span class="hl-rojo">no se disuelve</span>: el objetivo de la anticoagulación no es disolver el émbolo existente, sino <span class="hl-azul">prevenir el siguiente</span>.', `${FEP}#nep-filtros · p. 11`];
}

// La explicación guiada del estado (REGLAS §7.10): 5 pasos, cada uno con su cita
const E0 = { lesion: 'placa', emb: true, t: 4, horas: 6, peso: 80 };
export const GUIA_TEP = [
    { t: 'El émbolo es un trombo venoso que llegó migrado hasta la arteria pulmonar y la tapa. Con heparina, el émbolo no cambia de tamaño: la anticoagulación no sirve para disolver el émbolo existente, sino para evitar el siguiente.', estado: { ...E0, tto: 'heparina' }, lupa: 'placa', resalta: '#vso-tep-embolo', cita: EP('nep-filtros', '11') },
    { t: 'La lisis está recomendada en la EP de alto riesgo con inestabilidad hemodinámica. El trombolítico convierte el plasminógeno unido a la fibrina en plasmina, y la plasmina corta los hilos de fibrina: el vaso se reabre.', estado: { ...E0, tto: 'ambas' }, lupa: 'placa', resalta: '#vso-tep-fibrina', cita: [EP('nep-trombolisis', '9'), PLASMINA] },
    { t: 'Pero al disolverse el coágulo se libera trombina, y esta puede promover la reoclusión del vaso. Por eso la heparina es especialmente útil después de la lisis; con lisis sola, la red vuelve a tejerse.', estado: { ...E0, tto: 'lisis' }, lupa: 'placa', resalta: '#vso-tep-trombina', cita: EP('nep-trombolisis', '9') },
    { t: 'La pauta es alteplasa 100 mg en 2 horas; con colapso cardiovascular inminente, 0,6 mg/kg en 15 minutos con un máximo de 50 mg. La heparina se mantiene durante la lisis (a veces se para y se reinicia tras el fibrinolítico) hasta que el paciente mejora o se estabiliza. El precio: sangrado mayor en el 10-12 %, con hemorragia intracraneal en el 1-2 %, y el mayor beneficio dentro de las 48 h de los síntomas.', estado: { ...E0, tto: 'ambas', peso: 95, horas: 12 }, lupa: 'placa', resalta: '#vso-tep-dosis', cita: [EP('nep-tabla-22-3', '8'), EP('nep-trombolisis', '9-10')] },
    { t: 'Con una contraindicación absoluta (sangrado activo, ictus hemorrágico previo, ictus isquémico en 6 meses, neoplasia del SNC, cirugía, trauma mayor o TCE en 3 semanas) la lisis se apaga. La ficha deja la trombectomía mecánica por catéter como rescate, con mejoría de presiones pulmonares y función del VD mayor que con la lisis.', estado: { ...E0, tto: 'heparina', sang: true }, lupa: 'placa', resalta: '#vso-tep-embolo', cita: [EP('nep-trombolisis', '9'), EP('nep-trombectomia', '10')] },
];
