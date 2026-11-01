// La arteria que se tapa: los síndromes coronarios agudos sobre el vaso vivo (Libros → Marino, cap. 20; su ficha es
// Cardiología → Marino → «SCA: diagnóstico», mc-sca-diagnostico). Datos puros, sin DOM.
// Fuente: docs/marino-2024-cardiac-disorders-caps18-21.pdf, PDF p. 38-43 (las páginas son las del PDF).
//
// El estado (en vaso-vivo-data.js): lesion: 'placa'; t: el tiempo de la placa (1 en la bifurcación, 2 se rompe, 3 salen
// los lípidos, 4 el trombo); ocl: la oclusión ('intermitente' | 'parcial' | 'completa'; la ficha no da un %: hueco);
// horas: el reloj «horas desde el dolor» (RELOJ); ntg: el dolor cede con nitroglicerina. 5b: asa, p2y ('clopidogrel' |
// 'ticagrelor' | 'prasugrel'), iib ('eptifibatida' | 'tirofiban'), el paciente (hic, ictus, alasa, morfina, clcr 0|50|30).
// 5c: lisis (tenecteplasa) y peso.
//
// EL RELOJ ES UNO SOLO (plan del profesor, b3-paso4 g5): lo usan la troponina (5a) y la trombólisis (5c). Para
// engancharlo, la lisis lee estado.horas y RELOJ.lisis, y añade sus topes en topesReloj() (con e.lisis): el mando es
// el mismo #vso-m-horas del panel «Arteria».

export const PDF_SCA = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const L20 = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 20', pdf: PDF_SCA };
export const DX = (id, pag) => ({ ...L20, ficha: 'mc-sca-diagnostico', id, pag });
export const TX = (id, pag) => ({ ...L20, ficha: 'mc-sca-tratamiento', id, pag });
const FDX = 'ficha · mc-sca-diagnostico', FTX = 'ficha · mc-sca-tratamiento';

// Las tres oclusiones (p. 40): sin %; la ficha solo dice completa, parcial o a ratos.
export const OCLUSIONES = {
    intermitente: { n: 'A ratos', s: 'on-off', sind: 'Angina inestable', corto: 'AI', ecg: 'sin ST elevado' },
    parcial: { n: 'Parcial', s: 'incompleta', sind: 'NSTEMI', corto: 'NSTEMI', ecg: 'sin ST elevado' },
    completa: { n: 'Completa', s: 'transmural', sind: 'STEMI', corto: 'STEMI', ecg: 'ST elevado' },
};
export const OCL_ORDEN = ['intermitente', 'parcial', 'completa'];

// El reloj «horas desde el dolor». Tope 24 h: ilustrativo (el capítulo trata las primeras 24-36 h, p. 38).
// 3 h: la hs-cTn se detecta desde entonces (p. 41). 12 h: la lisis pierde su beneficio (p. 43). Aviso a las 10 h
// (≈80 % de las 12, REGLAS §1.14): ilustrativo.
export const RELOJ = {
    min: 0, max: 24, paso: 1, inicio: 1, tropo: 3, lisis: 12, aviso: 10,
    origen: h => (h === 3 ? 'ficha · p. 41' : h === 12 ? 'ficha · p. 43' : 'ilustrativo'),
    marcas: [[3, 'hs-cTn'], [12, 'lisis']],
};
const necrosis = e => e.t === 4 && e.ocl !== 'intermitente' && e.horas >= RELOJ.tropo;

// 5b · los antiagregantes (Tabla 20.4, p. 47-48) y 5c · la trombólisis (Tabla 20.2, p. 44-45): sus datos
export const P2Y12 = { clopidogrel: { n: 'Clopidogrel', dosis: '300-600 mg, luego 75 mg/día' }, ticagrelor: { n: 'Ticagrelor', dosis: '180 mg, luego 90 mg cada 12 h' }, prasugrel: { n: 'Prasugrel', dosis: '60 mg, luego 10 mg/día' } };
export const IIB = { eptifibatida: { n: 'Eptifibatida', dosis: '180 µg/kg (máx. 22,6 mg), luego 2 µg/kg/min (máx. 15 mg/h); 2.º bolo a los 10 min', clcr: 50 }, tirofiban: { n: 'Tirofibán', dosis: '25 µg/kg, luego 0,15 µg/kg/min', clcr: 30 } };
// Tenecteplasa por peso (p. 44-45): <60 kg 30 mg, 60-69 35, 70-79 40, 80-89 45, ≥90 50. Peso 40-120 kg: ilustrativo.
export const PESO = { min: 40, max: 120, paso: 1, inicio: 80 };
export const tnkMg = peso => (peso < 60 ? 30 : peso < 70 ? 35 : peso < 80 ? 40 : peso < 90 ? 45 : 50);
// HNF al lado (p. 49): 60 U/kg (máx. 4.000) y 12 U/kg/h (máx. 1.000)
export const hnf = peso => ({ bolo: Math.min(60 * peso, 4000), inf: Math.min(12 * peso, 1000) });
// Fig. 20.3 (p. 44; cifras de la ficha): vidas salvadas por 100 tratados según las horas desde el dolor
export const FIG203 = [['0-1', 3.5], ['2-3', 2.5], ['4-6', 1.8], ['7-12', 1.4], ['13-18', 0.4]];
export const barraFig203 = h => (h <= 1 ? 0 : h <= 3 ? 1 : h <= 6 ? 2 : h <= 12 ? 3 : 4);
// Contraindicaciones del paciente que sellan cada fármaco (p. 47-48)
export const sellaAsa = e => e.alasa && e.asa;
export const sellaP2y = e => (e.p2y === 'ticagrelor' && e.hic) || (e.p2y === 'prasugrel' && e.ictus);
// ¿Cuántos de los tres interruptores frenan la plaqueta? (los sellados no cuentan)
export const frenos = e => (e.asa && !e.alasa ? 1 : 0) + (e.p2y && !sellaP2y(e) ? 1 : 0) + (e.iib ? 1 : 0);
// La lisis actúa: en el STEMI y antes de las 12 h (p. 43)
export const lisisActiva = e => !!e.lisis && e.lesion === 'placa' && e.t === 4 && e.ocl === 'completa' && e.horas <= RELOJ.lisis;

// Los topes del reloj y de los fármacos: lo que tope.js pone (aviso o sello) en cada estado.
export function topesReloj(e) {
    const out = [];
    if (e.lesion !== 'placa') return out;
    const S = (clave, titulo, texto, cita, origen, dis) => out.push({ clave, nivel: 'sello', titulo, texto, cita, origen, deshabilita: [dis] });
    const A = (clave, titulo, texto, cita, origen, bajo) => out.push({ clave, nivel: 'aviso', titulo, texto, cita, origen, bajo });
    if (e.t >= 3) {
        if (sellaAsa(e)) S('tx-asa', 'Contraindicado', 'Alergia a la aspirina: se apaga; el sustituto es el clopidogrel.', TX('mc-tabla-20-4', '47'), 'ficha · p. 47', '[data-vso-asa]');
        if (e.p2y === 'ticagrelor' && e.hic) S('tx-tica', 'Contraindicado', 'Hemorragia intracraneal previa: el ticagrelor sube el riesgo de otra.', TX('mc-tabla-20-4', '48'), 'ficha · p. 48', '[data-vso-p2y="ticagrelor"]');
        if (e.p2y === 'prasugrel' && e.ictus) S('tx-prasu', 'Contraindicado', 'Ictus o AIT reciente: el prasugrel sangra más y está contraindicado.', TX('mc-tabla-20-4', '48'), 'ficha · p. 48', '[data-vso-p2y="prasugrel"]');
        if (e.morfina && e.p2y) A('tx-morfina', 'Morfina:', 'resta efecto a los P2Y12; su significado clínico es incierto.', TX('mc-tabla-20-3', '46'), 'ficha · p. 46', '#vso-fila-pac');
        if (e.iib) A('tx-iib', 'IIb/IIIa:', 'solo en pacientes de alto riesgo que van a ICP urgente; los maneja el hemodinamista.', TX('mc-tabla-20-4', '48'), 'ficha · p. 48', '#vso-fila-pac');
        if (e.iib === 'eptifibatida' && e.clcr && e.clcr <= 50) A('tx-clcr', 'ClCr <50:', 'eptifibatida, la infusión al 50 %.', TX('mc-tabla-20-4', '47'), 'ficha · p. 47', '#vso-fila-pac');
        if (e.iib === 'tirofiban' && e.clcr && e.clcr <= 30) A('tx-clcr', 'ClCr <30:', 'tirofibán, la infusión al 50 %.', TX('mc-tabla-20-4', '48'), 'ficha · p. 48', '#vso-fila-pac');
    }
    if (e.t !== 4) return out;
    if (e.ocl === 'completa' && e.horas > RELOJ.lisis) out.push({ clave: 'reloj-lisis', nivel: 'sello', titulo: 'Lisis sin beneficio', texto: `${e.horas} h desde el dolor: pasadas 12 h, la trombólisis ya no da beneficio y no se aconseja.`, cita: TX('mc-fig-20-3', '43'), origen: 'ficha · p. 43', deshabilita: ['[data-vso-lisis]'] });
    else if (e.ocl === 'completa' && e.horas >= RELOJ.aviso) out.push({ clave: 'reloj-lisis', nivel: 'aviso', titulo: 'Se cierra la ventana:', texto: 'a las 12 h la lisis pierde su beneficio.', cita: TX('mc-fig-20-3', '43'), origen: 'ficha · p. 43; aviso a las 10 h: ilustrativo', bajo: '#vso-fila-reloj' });
    if (e.lisis && e.ocl !== 'completa') S('tx-nstemi', e.ocl === 'intermitente' ? 'Sin beneficio sin ST elevado' : 'Sin beneficio en el SCASEST', 'La trombólisis no da supervivencia sin ST elevado ni sustituye a la ICP: ICP urgente si hay inestabilidad; si no, a las 24-72 h.', TX('mc-scasest', '43'), 'ficha · p. 43', '[data-vso-lisis]');
    if (lisisActiva(e)) {
        const h = hnf(e.peso);
        A('tx-sangrado', 'Sangrado:', `transfusión en ~10 %, grave en ~1 %; fibrinógeno <100 mg/dL: crio o concentrado, sin ácido tranexámico. Heparina al lado: 60 U/kg (máx. 4.000) = ${h.bolo} U y 12 U/kg/h (máx. 1.000) = ${h.inf} U/h; aPTT 1,5-2 (el libro imprime «60 Units», sin /kg).`, TX('mc-trombolisis', '45'), 'ficha · p. 45 y 49', '#vso-fila-pac');
    }
    if (e.horas >= RELOJ.max) out.push({ clave: 'reloj-fin', nivel: 'aviso', titulo: 'Fin del reloj:', texto: 'el capítulo trata las primeras 24-36 h.', origen: 'tope de 24 h: ilustrativo', bajo: '#vso-fila-reloj' });
    return out;
}

// El tablero: las mismas 8 casillas del vaso, con su rótulo de SCA (los ids no cambian: botones estables).
export function tableroPlaca(e) {
    const C = (n, v, u, o, cls = '', ilu = false) => ({ n, v, u, o, cls, ilu });
    const O = OCLUSIONES[e.ocl], t4 = e.t === 4, c = {};
    c.plaq = t4 ? C('Síndrome', O.corto, O.s, 'ficha · p. 40', e.ocl === 'intermitente' ? 'aviso' : 'alarma') : C('Síndrome', '—', 'aún sin trombo', '');
    c.tapon = C('Placa', ['estable', 'se rompe', 'lípidos', e.ocl === 'completa' ? 'oclusivo' : e.ocl === 'parcial' ? 'parcial' : 'on-off'][e.t - 1],
        ['en una bifurcación', 'MPO → hipoclorito', 'trombogénicos', 'el trombo'][e.t - 1], ['ficha · p. 38', 'ficha · p. 39', 'ficha · p. 39', 'ficha · p. 40'][e.t - 1], t4 ? 'alarma' : e.t > 1 ? 'aviso' : '');
    c.inr = t4 ? C('ST elevado', e.ocl === 'completa' ? 'sí' : 'no', e.ocl === 'completa' ? 'reperfundir ya' : 'o normal', 'ficha · p. 40', e.ocl === 'completa' ? 'alarma' : 'aviso') : C('ST elevado', '—', 'aún sin trombo', '');
    if (!t4) c.aptt = C('hs-cTn', '—', 'aún sin trombo', '');
    else if (e.ocl === 'intermitente') c.aptt = C('hs-cTn', '?', 'la fuente no lo dice', '');
    else if (e.horas < RELOJ.tropo) c.aptt = C('hs-cTn', 'aún no', 'se detecta desde 3 h', 'ficha · p. 41', '');
    else c.aptt = C('hs-cTn', '>p99', 'necrosis probable', 'ficha · p. 41', 'alarma');
    c.fib = necrosis(e) ? C('A la 1 h', '>10 %', 'cambio: isquemia aguda', 'umbral de la ficha p. 41; el cambio, ilustrativo', 'alarma') : C('A la 1 h', '—', 'repetir la hs-cTn', t4 && e.ocl !== 'intermitente' ? 'ficha · p. 41' : '');
    c.dd = C('Desde el dolor', `${e.horas} h`, e.horas > RELOJ.lisis ? 'fuera de la lisis' : e.horas >= RELOJ.tropo ? 'la hs-cTn ya se ve' : 'temprano', RELOJ.origen(e.horas) === 'ilustrativo' ? 'ilustr.' : RELOJ.origen(e.horas), e.horas > RELOJ.lisis ? 'aviso' : '', RELOJ.origen(e.horas) === 'ilustrativo');
    // NTG: que alivie no prueba la isquemia (p. 40); en el STEMI el mando se apaga: decide el ECG
    c.esq = C('NTG', e.ocl === 'completa' && t4 ? 'no cuenta' : e.ntg ? 'alivia' : '—', e.ocl === 'completa' && t4 ? 'decide el ECG' : 'no prueba isquemia', 'ficha · p. 40', e.ntg ? 'aviso' : '');
    if (!t4) c.amenaza = C('Lisis', '—', 'aún sin trombo', '');
    else if (e.ocl !== 'completa') c.amenaza = C('Lisis', 'sin beneficio', 'en el SCASEST', 'ficha · p. 43', 'aviso');
    else if (e.horas > RELOJ.lisis) c.amenaza = C('Lisis', 'sin beneficio', '>12 h', 'ficha · p. 43', 'alarma');
    else c.amenaza = C('Lisis', 'aún sirve', 'más cuanto antes', 'ficha · p. 43', 'bien');
    // 5b: los tres interruptores frenan el trombo (nunca lo disuelven, p. 47); 5c: la lisis y el fibrinógeno
    const n = frenos(e);
    if (e.t >= 3 && n) c.tapon = C('Trombo', n === 3 ? 'deja de crecer' : 'crece menos', `${n} de 3 interruptores`, 'ficha · p. 47', 'bien');
    if (lisisActiva(e)) {
        c.amenaza = C('Lisis', `TNK ${tnkMg(e.peso)} mg`, 'permeable 85 % a 90 min', 'ficha · p. 44', 'bien');
        c.tapon = C('Trombo', 'se reabre', 'permeable 85 % a 90 min', 'ficha · p. 44', 'bien');
        c.fib = C('Fibrinógeno', '↓', 'baja al lisar; <100: crio', 'ilustr.', 'aviso', true);
    }
    return c;
}

// La frase viva de la placa: [html, origen]
export function frasePlaca(e) {
    if (e.t === 1) return ['Una placa de ateroma en una <span class="hl-azul">bifurcación</span>: las placas que se rompen suelen estar en los puntos de ramificación, porque el roce del flujo (el estrés de cizalla) también cuenta. Pulsa ▶ para ver cómo se rompe.', `${FDX}#mc-placa · p. 38`];
    if (e.t === 2) return ['La <span class="hl-azul">inflamación</span> rompe la placa: los leucocitos sueltan mieloperoxidasa (MPO), que fabrica <span class="hl">hipoclorito</span>, el principio activo de la lejía, y oxida las lipoproteínas de la placa.', `${FDX}#mc-placa · p. 39`];
    if (lisisActiva(e)) return [`El trombolítico convierte el <span class="hl-azul">plasminógeno unido a la fibrina</span> en <span class="hl">plasmina</span>, que corta los hilos de fibrina del trombo: la arteria se reabre. Tenecteplasa de ${tnkMg(e.peso)} mg en un solo bolo, para ${e.peso} kg; permeable al 85 % a los 90 min.`, `${FTX}#mc-trombolitico-mecanismo · p. 44-45`];
    if (e.t === 3 && frenos(e)) return [`Los antiagregantes frenan la plaqueta (${frenos(e)} de 3 interruptores): sin puentes de fibrinógeno ni tromboxano, las plaquetas activadas no se agregan.`, `${FTX}#mc-tabla-20-4 · p. 47-48`];
    if (e.t === 3) return ['Rota la placa, salen <span class="hl-rojo">lípidos trombogénicos</span>: activan las plaquetas y los factores de la coagulación.', `${FDX}#mc-fig-20-1 · p. 39`];
    if (e.ntg) return ['Que el dolor ceda con nitroglicerina <span class="hl-rojo">no prueba</span> la isquemia: la nitroglicerina también alivia el dolor del espasmo esofágico.', `${FDX}#mc-sca-clinica · p. 40`];
    if (e.t >= 3 && frenos(e) && !e.ntg) return [`Los antiagregantes <span class="hl-azul">frenan</span> la plaqueta (${frenos(e)} de 3 interruptores: aspirina, P2Y12, IIb/IIIa): el trombo ${frenos(e) === 3 ? 'deja de crecer' : 'crece menos'}, pero <span class="hl-rojo">no se disuelve</span>: eso lo hace el trombolítico o la ICP.`, `${FTX}#mc-tabla-20-4 · p. 47-48`];
    const base = {
        completa: 'Trombo <span class="hl-rojo">oclusivo</span>: la arteria se cierra entera. Es el STEMI, un infarto transmural, con el <b>ST elevado</b> en el ECG de 12 derivaciones.',
        parcial: 'El trombo cierra la arteria <span class="hl">a medias</span>: es el NSTEMI. Sin ST elevado: puede haber descenso del ST, T invertidas o un ECG normal.',
        intermitente: 'El trombo se forma y se deshace: episodios repetidos de oclusión, <span class="hl">a ratos</span>. Es la angina inestable, sin ST elevado.',
    }[e.ocl];
    let reloj = '';
    if (e.ocl !== 'intermitente') reloj = e.horas >= RELOJ.tropo
        ? ` A las ${e.horas} h, una hs-cTn por encima del p99 hace probable la necrosis; un cambio de más del 10 % a la hora, isquemia aguda.`
        : ` A las ${e.horas} h, la hs-cTn puede no verse aún: se detecta desde las 3 h.`;
    if (e.ocl === 'completa' && e.horas > RELOJ.lisis) return [`${base} Pasadas <span class="hl-rojo">12 h</span>, la trombólisis ya no da beneficio.`, `${FTX}#mc-fig-20-3 · p. 43`];
    return [base + reloj, `${FDX}#${reloj ? 'mc-troponina' : 'mc-sca-sindromes'} · ${reloj ? 'p. 40-41' : 'p. 40'}${RELOJ.origen(e.horas) === 'ilustrativo' ? ` · ${e.horas} h: ilustrativo` : ''}`];
}

// La explicación guiada del estado «placa» (REGLAS §7.10): los 4 tiempos de la Fig. 20.1 y el reloj
export const GUIA_PLACA = [
    { t: 'Tiempo 1. Una placa de ateroma en una bifurcación de la arteria: las placas que se rompen suelen estar en los puntos de ramificación, porque el estrés de cizalla del flujo también contribuye.', estado: { lesion: 'placa', t: 1 }, lupa: 'placa', resalta: '#vso-pl-bif', cita: DX('mc-placa', '38') },
    { t: 'Tiempo 2. La inflamación rompe la placa. Los leucocitos sueltan mieloperoxidasa (MPO), que genera hipoclorito, «la lejía», y oxida las lipoproteínas de la placa: en las autopsias, la MPO tiñe el sitio de la rotura.', estado: { lesion: 'placa', t: 2 }, lupa: 'placa', resalta: '#vso-pl-mpo', cita: DX('mc-placa', '39') },
    { t: 'Tiempo 3. Por la rotura salen lípidos trombogénicos, que activan las plaquetas y los factores de la coagulación (panel de arriba de la Fig. 20.1).', estado: { lesion: 'placa', t: 3 }, lupa: 'placa', resalta: '#vso-pl-lipidos', cita: DX('mc-fig-20-1', '39') },
    { t: 'Tiempo 4. Se forma el trombo. Si cierra la arteria entera, STEMI (transmural, ST elevado); si la cierra a medias, NSTEMI; si se cierra y se abre a ratos, angina inestable. Cambia la oclusión abajo.', estado: { lesion: 'placa', t: 4 }, lupa: 'placa', resalta: '#vso-pl-trombo', cita: DX('mc-sca-sindromes', '40') },
    { t: 'El reloj. La hs-cTn se detecta desde las 3 h del dolor: por encima del p99 y con 3 h o más, la necrosis es probable; un cambio de más del 10 % a la hora es isquemia aguda.', estado: { lesion: 'placa', t: 4, horas: 3 }, lupa: 'placa', resalta: '#vso-c-aptt', cita: DX('mc-troponina', '41') },
];

// 5b · la explicación guiada de los antiagregantes: los tres interruptores sobre la plaqueta (Tabla 20.4)
const E4 = { lesion: 'placa', t: 4, ocl: 'completa', horas: 1 };
export const GUIA_ANTIAG = [
    { t: 'La aspirina inhibe la producción de tromboxano: la inhibición es irreversible. Salva 1 vida por cada 42 tratados. La primera dosis (162-325 mg) se mastica, sin tragar; si no se puede por boca, va por el recto.', estado: { ...E4, asa: true }, lupa: 'placa', resalta: '#vso-pl-plaq-asa', cita: TX('mc-tabla-20-4', '47') },
    { t: 'Los P2Y12 (clopidogrel, ticagrelor, prasugrel) bloquean el receptor de la plaqueta por el que el ADP la agrega. Se añaden a la aspirina en todo SCA, y la primera dosis va antes de la ICP.', estado: { ...E4, asa: true, p2y: 'ticagrelor' }, lupa: 'placa', resalta: '#vso-pl-plaq-p2y', cita: TX('mc-tabla-20-4', '48') },
    { t: 'Los anti-IIb/IIIa (eptifibatida, tirofibán) impiden que el fibrinógeno haga puentes entre plaquetas: son los antiagregantes más potentes. Solo en pacientes de alto riesgo que van a ICP urgente.', estado: { ...E4, asa: true, p2y: 'ticagrelor', iib: 'eptifibatida' }, lupa: 'placa', resalta: '#vso-pl-plaq-iib', cita: TX('mc-tabla-20-4', '48') },
    { t: 'Con los tres interruptores, el trombo deja de crecer, pero no desaparece: los antiagregantes evitan que crezca; no lo disuelven.', estado: { ...E4, asa: true, p2y: 'ticagrelor', iib: 'eptifibatida' }, lupa: 'placa', resalta: '#vso-pl-trombo', cita: TX('mc-tabla-20-4', '47') },
    { t: 'Cada uno tiene su contraindicación: ticagrelor con hemorragia intracraneal previa; prasugrel con ictus o AIT reciente; la aspirina con alergia (entonces, clopidogrel). Prueba los tres chips del paciente en la pestaña «Tratar».', estado: { ...E4, asa: true, p2y: 'ticagrelor', hic: true }, lupa: 'placa', resalta: '#vso-pl-plaq-p2y', cita: TX('mc-tabla-20-4', '48') },
];
// 5c · la explicación guiada de la trombólisis
export const GUIA_LISIS = [
    { t: 'El trombo es plaquetas en una malla de fibrina. El trombolítico convierte el plasminógeno en plasmina, y la plasmina corta los hilos de fibrina en fragmentos más pequeños.', estado: { ...E4, horas: 2, lisis: true }, lupa: 'placa', resalta: '#vso-pl-fibrina', cita: TX('mc-trombolitico-mecanismo', '44') },
    { t: 'Actúa sobre el plasminógeno unido a la fibrina del coágulo: eso limita la fibrinólisis en toda la sangre y reduce el riesgo de sangrado. Los tres agentes de la Tabla 20.2 reabren la arteria por igual (tenecteplasa: 85 % a los 90 min).', estado: { ...E4, horas: 2, lisis: true }, lupa: 'placa', resalta: '#vso-pl-lisis', cita: TX('mc-tabla-20-2', '44') },
    { t: 'La dosis de tenecteplasa depende del peso, en un solo bolo: 30 mg por debajo de 60 kg, 35 mg de 60 a 69, 40 mg de 70 a 79, 45 mg de 80 a 89 y 50 mg desde 90 kg.', estado: { ...E4, horas: 2, lisis: true, peso: 95 }, lupa: 'placa', resalta: '#vso-pl-lisis', cita: TX('mc-tabla-20-2', '45') },
    { t: 'El beneficio depende del reloj: máximo en la primera hora (3,5 vidas salvadas por 100 tratados) y perdido pasadas 12 h, cuando la lisis ya no se aconseja.', estado: { ...E4, horas: 8, lisis: true }, lupa: 'placa', resalta: '#vso-reloj-svg', cita: TX('mc-fig-20-3', '44') },
    { t: 'El precio es el sangrado: transfusión en cerca del 10 % y sangrado grave en cerca del 1 %. Si el fibrinógeno baja de 100 mg/dL, crioprecipitado o concentrado; el ácido tranexámico se desaconseja.', estado: { ...E4, horas: 8, lisis: true }, lupa: 'placa', resalta: '#vso-pl-fibrina', cita: TX('mc-trombolisis', '45') },
];
