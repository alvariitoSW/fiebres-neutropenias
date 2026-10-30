// La arteria que se tapa: los síndromes coronarios agudos sobre el vaso vivo (Libros → Marino, cap. 20; su ficha es
// Cardiología → Marino → «SCA: diagnóstico», mc-sca-diagnostico). Datos puros, sin DOM.
// Fuente: docs/marino-2024-cardiac-disorders-caps18-21.pdf, PDF p. 38-43 (las páginas son las del PDF).
//
// El estado (en vaso-vivo-data.js): lesion: 'placa'; t: el tiempo de la placa (1 en la bifurcación, 2 se rompe, 3 salen
// los lípidos, 4 el trombo); ocl: la oclusión ('intermitente' | 'parcial' | 'completa'; la ficha no da un %: hueco);
// horas: el reloj «horas desde el dolor» (RELOJ); ntg: el dolor cede con nitroglicerina.
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

// Los topes del reloj: lo que tope.js pone (aviso o sello) en cada hora. 5c añade aquí los suyos (con e.lisis).
export function topesReloj(e) {
    const out = [];
    if (e.lesion !== 'placa' || e.t !== 4) return out;
    if (e.ocl === 'completa' && e.horas >= RELOJ.lisis) out.push({ clave: 'reloj-lisis', nivel: 'sello', titulo: 'Lisis sin beneficio', texto: `${e.horas} h desde el dolor: pasadas 12 h, la trombólisis ya no da beneficio y no se aconseja.`, cita: TX('mc-fig-20-3', '43'), origen: 'ficha · p. 43', deshabilita: ['[data-vso-lisis]'] });
    else if (e.ocl === 'completa' && e.horas >= RELOJ.aviso) out.push({ clave: 'reloj-lisis', nivel: 'aviso', titulo: 'Se cierra la ventana:', texto: 'a las 12 h la lisis pierde su beneficio.', cita: TX('mc-fig-20-3', '43'), origen: 'ficha · p. 43; aviso a las 10 h: ilustrativo', bajo: '#vso-reloj' });
    if (e.horas >= RELOJ.max) out.push({ clave: 'reloj-fin', nivel: 'aviso', titulo: 'Fin del reloj:', texto: 'el capítulo trata las primeras 24-36 h.', origen: 'tope de 24 h: ilustrativo', bajo: '#vso-reloj' });
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
    c.fib = necrosis(e) ? C('A la 1 h', '>10 %', 'cambio: isquemia aguda', 'ficha · p. 41', 'alarma') : C('A la 1 h', '—', 'repetir la hs-cTn', t4 && e.ocl !== 'intermitente' ? 'ficha · p. 41' : '');
    c.dd = C('Desde el dolor', `${e.horas} h`, e.horas >= RELOJ.lisis ? 'fuera de la lisis' : e.horas >= RELOJ.tropo ? 'la hs-cTn ya se ve' : 'temprano', RELOJ.origen(e.horas) === 'ilustrativo' ? 'ilustr.' : RELOJ.origen(e.horas), e.horas >= RELOJ.lisis ? 'aviso' : '', RELOJ.origen(e.horas) === 'ilustrativo');
    // NTG: que alivie no prueba la isquemia (p. 40); en el STEMI el mando se apaga: decide el ECG
    c.esq = C('NTG', e.ocl === 'completa' && t4 ? 'no cuenta' : e.ntg ? 'alivia' : '—', e.ocl === 'completa' && t4 ? 'decide el ECG' : 'no prueba isquemia', 'ficha · p. 40', e.ntg ? 'aviso' : '');
    if (!t4) c.amenaza = C('Lisis', '—', 'aún sin trombo', '');
    else if (e.ocl !== 'completa') c.amenaza = C('Lisis', 'sin beneficio', 'en el SCASEST', 'ficha · p. 43', 'aviso');
    else if (e.horas >= RELOJ.lisis) c.amenaza = C('Lisis', 'sin beneficio', '>12 h', 'ficha · p. 43', 'alarma');
    else c.amenaza = C('Lisis', 'aún sirve', 'más cuanto antes', 'ficha · p. 43', 'bien');
    return c;
}

// La frase viva de la placa: [html, origen]
export function frasePlaca(e) {
    if (e.t === 1) return ['Una placa de ateroma en una <span class="hl-azul">bifurcación</span>: las placas que se rompen suelen estar en los puntos de ramificación, porque el roce del flujo (el estrés de cizalla) también cuenta. Pulsa ▶ para ver cómo se rompe.', `${FDX}#mc-placa · p. 38`];
    if (e.t === 2) return ['La <span class="hl-azul">inflamación</span> rompe la placa: los leucocitos sueltan mieloperoxidasa (MPO), que fabrica <span class="hl">hipoclorito</span>, el principio activo de la lejía, y oxida las lipoproteínas de la placa.', `${FDX}#mc-placa · p. 39`];
    if (e.t === 3) return ['Rota la placa, salen <span class="hl-rojo">lípidos trombogénicos</span>: activan las plaquetas y los factores de la coagulación.', `${FDX}#mc-fig-20-1 · p. 39`];
    if (e.ntg) return ['Que el dolor ceda con nitroglicerina <span class="hl-rojo">no prueba</span> la isquemia: la nitroglicerina también alivia el dolor del espasmo esofágico.', `${FDX}#mc-sca-clinica · p. 40`];
    const base = {
        completa: 'Trombo <span class="hl-rojo">oclusivo</span>: la arteria se cierra entera. Es el STEMI, un infarto transmural, con el <b>ST elevado</b> en el ECG de 12 derivaciones.',
        parcial: 'El trombo cierra la arteria <span class="hl">a medias</span>: es el NSTEMI. Sin ST elevado: puede haber descenso del ST, T invertidas o un ECG normal.',
        intermitente: 'El trombo se forma y se deshace: episodios repetidos de oclusión, <span class="hl">a ratos</span>. Es la angina inestable, sin ST elevado.',
    }[e.ocl];
    let reloj = '';
    if (e.ocl !== 'intermitente') reloj = e.horas >= RELOJ.tropo
        ? ` A las ${e.horas} h, una hs-cTn por encima del p99 hace probable la necrosis; un cambio de más del 10 % a la hora, isquemia aguda.`
        : ` A las ${e.horas} h, la hs-cTn puede no verse aún: se detecta desde las 3 h.`;
    if (e.ocl === 'completa' && e.horas >= RELOJ.lisis) return [`${base} Pasadas <span class="hl-rojo">12 h</span>, la trombólisis ya no da beneficio.`, `${FTX}#mc-fig-20-3 · p. 43`];
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
