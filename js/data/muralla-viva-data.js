// La muralla de papel: datos puros, sin DOM (Libros → Marino → Fundamentos, cap. 4: mar-microbioma y
// mar-ulcera-estres; y la vía 4 de mar-bacteriemia-cateter). Escena del vientre de «La cama 7».
// Viene de la maqueta aprobada autonomo/maquetas/b1-muralla.html (vuelta 2, 20/10/2026; auditoría
// autonomo/bloques/b1/auditoria-cama7.md §1 y juicio-cama7.md §1).
// Toda la medicina sale de las fichas de js/modules/libros/marino-fundamentos.html y de
// docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf (págs. del PDF, «A p.»). Cada cifra dice su origen: ficha,
// fisiología general o ilustrativo. El paciente de los casos se inventa; la medicina, no.
//
// Aquí: la hoja de órdenes (estado) y lo que se deriva de ella (derivar), la regla de la Tabla 4.2 (la misma de la
// calculadora #mar-ulcera-calc: la prueba lo coteja), los estados con nombre (los que abre data-muralla-viva="<estado>"),
// los conceptos, la Mayéutica, los casos, «Para profundizar», las láminas y la prueba de las cifras (pruebasMuralla).
// La escena vive en js/modules/libros/muralla-viva-escena.js y la interfaz en muralla-viva.js.
//
// Formato de `fuente`: «ficha#elemento · #elemento · texto (A p. N)»; la interfaz lo convierte en «Ver en el texto»
// (enlaces a la ficha) y en el chip de origen («ficha · p. N»), sin ids a la vista.

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const copia = o => JSON.parse(JSON.stringify(o));

/* ============================================================
   La hoja de órdenes y lo que se deriva de ella
   ============================================================ */
export function estadoBase() {
    return { estacion: 'intestino', paciente: 'sano', vm: false, riego: 'normal', clcr50: false,
        proteccion: 'nada', enteral: false, coag: false, cirrosis: false, corticoides: false, anticoag: false,
        antibiotico: false, probiotico: 'no', sdd: false, dia: 0, descontaminacion: 'nada', mr: false, gota: 0 };
}

// Tabla 4.2 (mar-tabla-4-2, A p. 68). La regla es la de la calculadora #mar-ulcera-calc de la ficha: profilaxis si hay un
// factor máximo o alto, o dos o más moderados. La prueba (autonomo/pruebas/muralla-viva.mjs) la coteja con la calculadora.
export const NIVELES = { maximo: { nombre: 'Máximo', pct: '8-10 %' }, alto: { nombre: 'Alto', pct: '4-8 %' }, moderado: { nombre: 'Moderado', pct: '2-4 %' }, bajo: { nombre: 'Bajo', pct: '1-2 %' } };
export function riesgoTabla42(e) {
    const maximos = [], altos = [], moderados = [], bajos = [];
    if (e.vm && !e.enteral) maximos.push('VM >24 h sin enteral');
    if (e.cirrosis) maximos.push('cirrosis con hipertensión portal');
    if (e.coag) altos.push('coagulopatía preocupante');
    if (e.vm && e.enteral) moderados.push('VM >24 h con enteral');
    if (e.riego === 'shock') moderados.push('shock');
    if (e.sepsis) moderados.push('sepsis');
    if (e.fra) moderados.push('fracaso renal agudo');
    if (e.corticoides) bajos.push('corticoides');
    if (e.anticoag) bajos.push('anticoagulación');
    const nivel = maximos.length ? 'maximo' : (altos.length || moderados.length >= 2) ? 'alto' : moderados.length === 1 ? 'moderado' : 'bajo';
    return { nivel, ...NIVELES[nivel], profilaxis: nivel === 'maximo' || nivel === 'alto', maximos, altos, moderados, bajos };
}

export const BGN_BOCA = { sano: 2, planta: 37, uci: 70 };          // Fig. 4.4, lectura aproximada (mar-fig-4-4)
export const TIRA = { boca: 6, estomago: 3, intestino: 9, colon: 12 };   // exponentes de la Fig. 4.1 (UFC/mL)
export function fraccionSDD(dia) { return dia >= 7 ? 0 : dia >= 5 ? 0.15 : dia >= 4 ? 0.3 : dia >= 2 ? 0.6 : dia >= 1 ? 0.8 : 1; }   // ritmo ilustrativo; la ficha: 5-7 días

export function derivar(e) {
    const D = {};
    const supresor = e.proteccion === 'pantoprazol' || e.proteccion === 'famotidina';
    D.supresor = supresor;
    D.riesgo = riesgoTabla42(e);
    // Estómago
    D.ph = supresor ? '≥4' : '1-2';
    D.phNum = supresor ? 4 : 2;
    D.phSube = !supresor && e.enteral;
    D.salmonella = supresor ? 'crece' : e.enteral ? 'sin cifra' : 'muere';
    const base = e.riego === 'shock' ? 2 : e.riego === 'oculta' ? 1 : 0;   // el desencadenante es la isquemia (mar-ulcera-patogenia)
    const protege = e.enteral || supresor;                                // no se suman: con enteral completa el supresor no añade (mar-enteral-protege)
    D.lesion = { nivel: base, nombre: ['sin lesión', 'erosión', 'úlcera hasta la submucosa'][base], tam: base ? (protege ? 0.6 : 1) : 0,
        tapada: base > 0 && e.proteccion === 'sucralfato', sangra: base === 2 && e.proteccion !== 'sucralfato', rezuma: base === 1 && e.proteccion !== 'sucralfato' };
    D.moco = { normal: 14, oculta: 8, shock: 4 }[e.riego] + (e.enteral ? 6 : 0);
    D.capilar = { normal: 16, oculta: 10, shock: 5 }[e.riego];
    D.flujo = { normal: 1, oculta: 0.5, shock: 0.2 }[e.riego];
    D.hPlus = e.proteccion === 'pantoprazol' ? 0 : e.proteccion === 'famotidina' ? 4 : e.enteral ? 9 : 15;
    D.balanza = e.proteccion === 'pantoprazol';
    D.fig46 = { placeboSangrado: 4.2, pantoSangrado: 2.5, efecto: 1.7, pantoTotal: 21.9, placeboTotal: 22.6, n: 3298 };
    D.famotidinaMitad = e.proteccion === 'famotidina' && e.clcr50;
    D.sucralfatoBloqueado = e.enteral;
    // Intestino: disbiosis, translocación y el motor del FMO (mar-disbiosis, mar-motor-fmo)
    D.disbiosis = e.antibiotico;
    D.hipoperfusion = e.riego !== 'normal';
    D.motor = (D.disbiosis ? 1 : 0) + (D.hipoperfusion ? 1 : 0);
    D.numeros = { 1: D.disbiosis, 2: D.disbiosis || D.hipoperfusion, 3: D.disbiosis };
    D.translocacion = D.numeros[2];
    D.vasosCerrados = D.motor >= 1;
    D.residentes = D.disbiosis ? 0.25 : 1;
    const fr = e.sdd ? fraccionSDD(e.dia) : 1;
    D.sddFrac = fr;
    D.patogenosIntestino = e.sdd && e.mr ? (D.disbiosis ? 14 : 5) : Math.round((D.disbiosis ? 14 : { sano: 3, planta: 4, uci: 5 }[e.paciente]) * fr);
    D.mrHalo = e.sdd && e.mr;
    D.sddEfecto = e.sdd && !e.mr;
    D.fig45 = { control: 4.5, sod: 3, sdd: 1.4, caidaSOD: 33, caidaSDD: 67, caidaSDDbarras: Math.round(100 * (1 - 1.4 / 4.5)) };
    D.cdiff = supresor ? (e.proteccion === 'pantoprazol' ? '×3 con IBP' : 'más riesgo (menor que con IBP)') : null;
    D.probiotico = e.probiotico === 'temprano' ? 'previene C. difficile' : e.probiotico === 'tarde' ? 'ya no previene C. difficile' : null;
    D.neumonia = supresor;
    // Boca (mar-saliva, mar-colonizacion-orofaringe, Tabla 4.1)
    D.bgnPct = BGN_BOCA[e.paciente];
    D.cerradurasCambiadas = e.paciente !== 'sano';
    D.colonizadas = Math.round(D.bgnPct / 10);    // de 10 cerraduras = 100 %
    const desc = e.sdd ? 'sdd' : e.descontaminacion;
    D.descBoca = desc;
    D.cocosVivos = desc === 'nada';
    D.bacilosVivos = desc === 'nada' || desc === 'clorhexidina' || (desc === 'sdd' && e.mr);
    D.husosVivos = true;
    D.aspirar = { mlDia: 750, pct: 0.13, porMl: 1e6, microbios: Math.round(750 * 0.0013 * 1e6) };   // ≈ 975.000: «un millón»
    // La tira (Fig. 4.1, escala logarítmica desde 10²: recuento ilustrativo)
    D.tira = Object.fromEntries(Object.entries(TIRA).map(([k, x]) => [k, (x - 2) * 2]));
    if (supresor) D.tira.estomago = 8;               // colonización del jugo gástrico al quitar el ácido (sin cifra)
    const fp = { sano: 0.12, planta: 0.25, uci: 0.4 }[e.paciente];
    D.tiraPatogenos = D.mrHalo ? fp : fp * fr;
    D.tiraPatIntestino = D.mrHalo ? (D.disbiosis ? 0.6 : fp) : (D.disbiosis ? 0.6 : fp) * fr;
    D.flechaPulmon = supresor || e.gota > 0;
    return D;
}

/* Estados con nombre: los que abre data-muralla-viva="<estado>" (fichas, menú, buscador y Mayéutica) */
export const ESTADOS = {
    sano: { clave: null, nombre: 'Intestino sano', e: { estacion: 'intestino', paciente: 'sano' } },
    disbiosis: { clave: 'antibiotico', nombre: 'Disbiosis', e: { estacion: 'intestino', paciente: 'uci', antibiotico: true } },
    'motor-fmo': { clave: 'riego', nombre: 'El motor del FMO', e: { estacion: 'intestino', paciente: 'uci', vm: true, antibiotico: true, riego: 'shock' } },
    'boca-uci': { clave: 'paciente', nombre: 'La boca en la UCI', e: { estacion: 'boca', paciente: 'uci', vm: true } },
    clorhexidina: { clave: 'descontaminacion', nombre: 'Clorhexidina oral', e: { estacion: 'boca', paciente: 'uci', vm: true, descontaminacion: 'clorhexidina' } },
    sod: { clave: 'descontaminacion', nombre: 'SOD', e: { estacion: 'boca', paciente: 'uci', vm: true, descontaminacion: 'sod' } },
    'estomago-sano': { clave: null, nombre: 'Estómago sano', e: { estacion: 'estomago', paciente: 'sano' } },
    isquemia: { clave: 'riego', nombre: 'Isquemia (VM sin enteral)', e: { estacion: 'estomago', paciente: 'uci', vm: true, riego: 'oculta' } },
    ulcera: { clave: 'riego', nombre: 'Úlcera (shock)', e: { estacion: 'estomago', paciente: 'uci', vm: true, riego: 'shock' } },
    ibp: { clave: 'proteccion', nombre: 'Con IBP', e: { estacion: 'estomago', paciente: 'uci', vm: true, riego: 'oculta', proteccion: 'pantoprazol' } },
    enteral: { clave: 'enteral', nombre: 'Con enteral completa', e: { estacion: 'estomago', paciente: 'uci', vm: true, riego: 'oculta', enteral: true } },
    sucralfato: { clave: 'proteccion', nombre: 'Sucralfato', e: { estacion: 'estomago', paciente: 'uci', vm: true, riego: 'oculta', proteccion: 'sucralfato' } },
    sdd: { clave: 'sdd', nombre: 'SDD, día 7', e: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 7 } },
    multirresistentes: { clave: 'mr', nombre: 'SDD con multirresistentes', e: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 7, mr: true } },
};
export const estadoDe = parcial => Object.assign(estadoBase(), copia(parcial || {}));

/* ============================================================
   El chip de origen: «ficha», «fisiología general» o «ilustrativo», y la página del PDF. El id de la ficha nunca se ve.
   ============================================================ */
export const PAGINAS = { 'mar-piel-interna': '58', 'mar-microbioma-cifras': '58', 'mar-microbioma-proteccion': '59', 'mar-disbiosis': '59', 'mar-motor-fmo': '60',
    'mar-acido-antiseptico': '60', 'mar-fig-4-3': '61-62', 'mar-saliva': '62', 'mar-colonizacion-orofaringe': '63', 'mar-fig-4-4': '63', 'mar-tabla-4-1': '63-64',
    'mar-fig-4-5': '64-65', 'mar-sdd': '65-66', 'mar-probioticos': '66', 'mar-ulcera-patogenia': '67', 'mar-ulcera-frecuencia': '67', 'mar-sangrado-significativo': '67',
    'mar-tabla-4-2': '68', 'mar-mito-corticoides': '68', 'mar-tabla-4-3': '68-69', 'mar-profilaxis-uso': '68', 'mar-img-4-6': '69-70', 'mar-desprescribir': '71',
    'mar-enteral-protege': '72', 'mar-acidofobia': '72-73', 'mar-bac-vias': '47', 'mar-bac-intestino': '53-54', 'mar-ulcera-calc': '68' };
export function chipTxt(f) {
    if (!f) return '';
    const tipos = new Set();
    if (/ilustrativ/.test(f)) tipos.add('ilustrativo');
    if (/fisiología general/.test(f)) tipos.add('fisiología general');
    if (/mar-|Fig\.|Tabla|acordeón|ficha|A p\./.test(f) || !tipos.size) tipos.add('ficha');
    let pags = []; const m = /A p\. ([\d\-, ]+\d)/.exec(f);
    if (m) pags = [m[1]]; else for (const [id, p] of Object.entries(PAGINAS)) if (new RegExp(id + '(?![\\w-])').test(f)) pags.push(p);
    pags = [...new Set(pags)];
    return ['ficha', 'fisiología general', 'ilustrativo'].filter(t => tipos.has(t)).join(' · ') + (pags.length ? ' · p. ' + pags.join(', ') : '');
}

/* ============================================================
   Contenido de estudio. Toda la medicina sale de las fichas (fuente = ficha#elemento, con su página del PDF A);
   el paciente de los casos se inventa.
   ============================================================ */
export const CONCEPTOS = [
    { titulo: 'La piel interna', estado: { estacion: 'intestino' }, mirar: 'regla',
        texto: 'La luz del tubo está «fuera» del cuerpo, como el agujero de un dónut. Su mucosa, nuestra «piel interna», es <span class="hl-rojo">una sola capa de células cilíndricas de 0,1 mm</span> frente a <span class="hl">100-400 billones de microbios</span>: una barrera de papel ante un ejército.',
        hacer: 'recorre las estaciones del tubo.', acciones: [{ t: 'Boca', e: { estacion: 'boca' }, mirar: 'tira' }, { t: 'Estómago', e: { estacion: 'estomago' }, mirar: 'regla' }, { t: 'Intestino', e: { estacion: 'intestino' }, mirar: 'regla' }],
        mira: 'la regla de 0,1 mm y la tira: boca 10⁶, estómago <10³, intestino 10⁹ y colon 10¹² UFC/mL (Fig. 4.1). El 99 % vive en el colon.',
        fuente: 'mar-microbioma#mar-piel-interna · #mar-microbioma-cifras (A p. 58-59)' },
    { titulo: 'La flora es la primera guardia', estado: { estacion: 'intestino' }, mirar: 'superficie',
        texto: 'La flora residente protege de tres formas: <span class="hl-verde">ocupa todos los huecos</span> de la mucosa, produce <span class="hl">ácidos grasos de cadena corta</span> (el combustible de sus células) y ayuda al GALT, que atrapa a los que cruzan.',
        hacer: 'mira cada mecanismo.', acciones: [{ t: 'Los huecos ocupados', e: {}, mirar: 'superficie' }, { t: 'Las cadenas cortas', e: {}, mirar: 'vellosidad' }, { t: 'El GALT', e: {}, mirar: 'galt' }],
        mira: 'los husos alineados en toda la superficie, las cadenas que entran en las células y los dos linfocitos del ganglio.',
        fuente: 'mar-microbioma#mar-microbioma-proteccion (A p. 59)' },
    { titulo: 'Disbiosis y translocación', estado: { estacion: 'intestino', paciente: 'uci' }, mirar: 'vellosidad',
        texto: 'Alterar el microbioma (<span class="hl-rojo">disbiosis</span>) estropea los tres mecanismos: los patógenos cruzan la pared. Esa <span class="hl-rojo">translocación</span> es una fuente principal de sepsis y fallo multiorgánico en el crítico.',
        hacer: 'pon un antibiótico de amplio espectro.', acciones: [{ t: 'Sin antibiótico', e: {} }, { t: 'Antibiótico amplio', e: { antibiotico: true }, mirar: 'numeros' }],
        mira: 'los tres números de la Fig. 4.2: ① sobrecrecimiento, ② rotura de la mucosa, ③ aclaramiento linfático alterado. Los bacilos bajan a la sangre.',
        fuente: 'mar-microbioma#mar-disbiosis · Fig. 4.2 (A p. 59-61)' },
    { titulo: 'El motor del fallo multiorgánico', estado: { estacion: 'intestino', paciente: 'uci', vm: true }, mirar: 'rueda',
        texto: 'Lo arranca una disbiosis <b>o</b> una hipoperfusión esplácnica. La barrera rota deja pasar microbios o mediadores, llega la inflamación y <span class="hl-rojo">el simpático cierra los vasos esplácnicos</span>: la barrera se rompe más. <span class="hl-purpura">Se autoalimenta</span>.',
        hacer: 'arranca la rueda de cada forma.', acciones: [{ t: 'Solo disbiosis', e: { antibiotico: true } }, { t: 'Solo shock', e: { riego: 'shock' } }, { t: 'Las dos', e: { antibiotico: true, riego: 'shock' } }],
        mira: 'la rueda: quieta, gira o va a toda velocidad (la velocidad es ilustrativa). El plexo de la vellosidad se estrecha.',
        fuente: 'mar-microbioma#mar-motor-fmo (A p. 60)' },
    { titulo: 'El ácido es un antiséptico', estado: { estacion: 'estomago', paciente: 'sano' }, mirar: 'gauge',
        texto: 'Su función principal no es digerir: es <span class="hl">una defensa antimicrobiana</span>. El jugo tiene pH 1-2. La <i>Salmonella</i> crece a pH 4, cae a pH 3 y <span class="hl-verde">desaparece en 1 hora a pH 2</span>.',
        hacer: 'quita el ácido.', acciones: [{ t: 'Sin nada (pH 1-2)', e: {} }, { t: 'Pantoprazol (pH ≥4)', e: { proteccion: 'pantoprazol' } }],
        mira: 'el indicador de la Fig. 4.3, a la derecha: con pH ≥4 las <i>Salmonella</i> dejan de morir y se multiplican.',
        fuente: 'mar-microbioma#mar-acido-antiseptico · #mar-fig-4-3 (A p. 60-62)' },
    { titulo: 'La úlcera viene del flujo', estado: { estacion: 'estomago', paciente: 'uci', vm: true }, mirar: 'lesion',
        texto: 'Un moco con bicarbonato (pH 7) protege el epitelio, y el flujo lo sostiene (<span class="hl">el 70-90 % del riego del estómago</span>). El desencadenante es <span class="hl-rojo">la isquemia local</span>; el ácido la agrava.',
        hacer: 'baja el riego.', acciones: [{ t: 'Riego normal', e: { riego: 'normal' } }, { t: 'PA normal con VM', e: { riego: 'oculta' } }, { t: 'Shock', e: { riego: 'shock' } }],
        mira: 'con el riego normal, ni con pH 1-2 hay erosión. Con la hipoperfusión oculta, erosión; con shock, úlcera hasta la submucosa que sangra.',
        fuente: 'mar-ulcera-estres#mar-ulcera-patogenia · #mar-acidofobia (A p. 67, 72-73)' },
    { titulo: 'Quitar el ácido cuesta', estado: { estacion: 'estomago', paciente: 'uci', vm: true, riego: 'shock' }, mirar: 'lesion',
        texto: 'Con IBP la úlcera <span class="hl">sigue apareciendo</span>: la causa no era el ácido. El libro solo da su efecto sobre el sangrado (4,2 → 2,5 %); el tamaño que dibuja la lámina es ilustrativo. Y quitarlo tiene precio: <span class="hl-rojo"><i>C. difficile</i> ×3 y más neumonía</span>. La balanza de la Fig. 4.6 no se inclina.',
        hacer: 'pon un supresor.', acciones: [{ t: 'Pantoprazol', e: { proteccion: 'pantoprazol' }, mirar: 'balanza' }, { t: 'Famotidina', e: { proteccion: 'famotidina' } }, { t: 'Sucralfato', e: { proteccion: 'sucralfato' }, mirar: 'lesion' }],
        mira: 'la úlcera sigue; la balanza: 4,2 → 2,5 % de sangrado, pero 21,9 % frente a 22,6 % al sumar los riesgos. El sucralfato tapa la lesión y deja el ácido.',
        fuente: 'mar-ulcera-estres#mar-profilaxis-uso · Fig. 4.6 · acordeón «Sucralfato» (A p. 68-71)' },
    { titulo: 'La enteral protege', estado: { estacion: 'estomago', paciente: 'uci', vm: true, riego: 'oculta' }, mirar: 'escalera',
        texto: 'La nutrición enteral es <span class="hl-verde">trófica y sube el pH</span>. En el ventilado cambia el escalón: <span class="hl-rojo">sin enteral, máximo (8-10 %)</span>; con enteral, moderado (2-4 %), sin profilaxis.',
        hacer: 'añade la enteral, y luego el IBP.', acciones: [{ t: 'Sin enteral', e: {} }, { t: 'Enteral completa', e: { enteral: true } }, { t: 'Enteral + pantoprazol', e: { enteral: true, proteccion: 'pantoprazol' } }],
        mira: 'el moco engorda y la escalera baja. Con enteral, el IBP no achica más la erosión: los supresores dejaban de reducir el sangrado.',
        fuente: 'mar-ulcera-estres#mar-enteral-protege · #mar-tabla-4-2 (A p. 68, 72)' },
    { titulo: 'La boca del crítico', estado: { estacion: 'boca', paciente: 'sano' }, mirar: 'cerraduras',
        texto: 'En el grave, las proteínas de adhesión del epitelio <span class="hl-rojo">cambian de forma</span> y los bacilos gramnegativos se pegan. <span class="hl-azul">Lo que decide no es que el germen esté, sino que pueda pegarse</span>. Aspirar el 0,13 % de la saliva mete un millón de microbios.',
        hacer: 'cambia de paciente y aspira.', acciones: [{ t: 'Sano', e: {} }, { t: 'Planta', e: { paciente: 'planta' } }, { t: 'UCI', e: { paciente: 'uci' } }, { t: 'UCI y aspirar', e: { paciente: 'uci', gota: 1 }, mirar: 'traquea' }],
        mira: 'las cerraduras: en ángulo en el sano, redondas en el grave. ~2-3, ~37 y ~70 % (Fig. 4.4, aproximada).',
        fuente: 'mar-microbioma#mar-saliva · #mar-colonizacion-orofaringe · #mar-fig-4-4 (A p. 62-63)' },
    { titulo: 'Descontaminar', estado: { estacion: 'boca', paciente: 'uci', vm: true }, mirar: 'cerraduras',
        texto: 'La clorhexidina actúa sobre todo frente a <span class="hl-rojo">grampositivos</span>; la SOD y la SDD, frente a estafilococos, bacilos gramnegativos y <i>Candida</i>, <span class="hl-verde">respetando a los anaerobios</span>. La SDD: −67 % de bacteriemias por gramnegativos, salvo con multirresistentes.',
        hacer: 'compara las estrategias.', acciones: [{ t: 'Clorhexidina 0,12 %', e: { descontaminacion: 'clorhexidina' } }, { t: 'SOD', e: { descontaminacion: 'sod' } }, { t: 'SDD, día 7', e: { estacion: 'intestino', sdd: true, dia: 7 }, mirar: 'fig45' }, { t: '+ multirresistentes', e: { estacion: 'intestino', sdd: true, dia: 7, mr: true }, mirar: 'vellosidad' }],
        mira: 'qué cae y qué queda pegado; con la SDD, la tira y la Fig. 4.5 (4,5 → 3 → 1,4 por 1.000 días).',
        fuente: 'mar-microbioma#mar-tabla-4-1 · #mar-sdd · #mar-fig-4-5 (A p. 63-66)' },
];

export const EULC = { estacion: 'estomago', paciente: 'uci', vm: true };
export const PREGUNTAS = [
    // ----- Ficha VIII: el intestino como origen de infección -----
    { id: 'mu-g1', grupo: 'guia', corto: 'dónde no hay', tipo: 'test', fuente: 'mar-microbioma#mar-microbioma-cifras · Fig. 4.1 (A p. 58-59)',
        estado: { estacion: 'intestino' },
        tocar: { mandos: ['estacion'], mirar: 'tira', ocultar: ['tira'], instruccion: 'toca en la tira la estación con menos microbios.', comprobar: e => e.estacion === 'estomago', pista: 'Es la segunda estación, entre la boca y el intestino.', bueno: { estacion: 'estomago' }, confirma: 'el estómago: <10³ por mL; la boca, 10⁶; el colon, 10¹² (Fig. 4.1).' },
        enunciado: 'La luz del tubo digestivo está «fuera» del cuerpo, como el agujero de un dónut, y en ella viven 100-400 billones de microbios. ¿Qué tramo es el menos poblado?',
        opciones: [
            { t: 'La boca: la saliva arrastra los microbios hacia abajo', ok: false, porque: 'La saliva lleva un millón de microbios por mL (10⁶): mil veces más que el estómago. Si crees la boca casi estéril, no ves por qué aspirar un mililitro de saliva siembra la neumonía del intubado.' },
            { t: 'El estómago: su ácido mata lo que llega con la comida', ok: true },
            { t: 'El intestino delgado: lo vacía el peristaltismo', ok: false, porque: 'El intestino tiene 10⁹ por mL; el estómago, <10³. Si lo crees casi vacío, subestimas de dónde sale la translocación que siembra la sangre del paciente.' }],
        explicacion: 'Fig. 4.1: boca 10⁶, estómago <10³, intestino 10⁹ y colon 10¹² UFC/mL. <span class="hl">El 99 % está en el colon</span>; el ácido del estómago protege al microbioma de los invasores que llegan con la comida.' },
    { id: 'mu-g2', grupo: 'guia', corto: 'por qué el intestino', tipo: 'test', fuente: 'mar-microbioma#mar-piel-interna · #mar-disbiosis (A p. 58-59)',
        estado: { estacion: 'intestino' }, mirarDespues: 'regla',
        enunciado: 'Para el autor, la antisepsia se centra casi solo en la piel. ¿Por qué mira también al tubo digestivo como puerta de la sepsis del crítico?',
        opciones: [
            { t: 'Porque su moco con bicarbonato deja pasar a los microbios', ok: false, porque: 'El moco con bicarbonato es la defensa del estómago frente al ácido, no una puerta. Si culpas al moco, no vigilas lo que de verdad se rompe en tu paciente: la capa de células, con la disbiosis o la hipoperfusión.' },
            { t: 'Porque es una superficie más pequeña que concentra los microbios', ok: false, porque: 'Es al revés: es una superficie mayor que la piel. Si la imaginas pequeña, infravaloras la puerta por la que entra la sepsis de tu paciente.' },
            { t: 'Porque una sola capa de células separa la sangre de la mayor carga de microbios del cuerpo', ok: true }],
        explicacion: 'La «piel interna» es <span class="hl-rojo">una sola capa de 0,1 mm</span> frente a 100-400 billones, en una superficie mayor que la piel. Si se rompe, los microbios cruzan: la <span class="hl-rojo">translocación</span>, fuente principal de sepsis y fallo multiorgánico.' },
    { id: 'mu-g3', grupo: 'guia', corto: 'antibiótico', tipo: 'test', fuente: 'mar-microbioma#mar-microbioma-proteccion · #mar-disbiosis · Fig. 4.2 (A p. 59-61)',
        estado: { estacion: 'intestino', paciente: 'uci' },
        tocar: { mandos: ['antibiotico'], mirar: 'numeros', ocultar: ['flora', 'barrera', 'motor'], instruccion: 'pon el antibiótico y mira qué aparece en la vellosidad.', comprobar: e => e.antibiotico, pista: 'Pulsa «Antibiótico amplio».', bueno: { antibiotico: true }, confirma: '① sobrecrecimiento, ② rotura de la mucosa y ③ aclaramiento linfático alterado: translocación (Fig. 4.2).' },
        enunciado: 'Pautas un antibiótico de amplio espectro a un paciente de UCI. Predice qué le pasa a la muralla.',
        opciones: [
            { t: 'Nada: el antibiótico solo actúa sobre los gérmenes de la infección', ok: false, porque: 'Altera el microbioma (disbiosis). Si no lo esperas, no buscas la translocación ni piensas en prevenir <i>C. difficile</i> a tiempo.' },
            { t: 'Cae la flora, crecen patógenos y se rompe la barrera', ok: true },
            { t: 'Queda estéril: sin microbios no hay infección de origen intestinal', ok: false, porque: 'No queda estéril: la Fig. 4.2 empieza por el sobrecrecimiento de patógenos. El paciente queda más expuesto, no menos.' }],
        explicacion: 'La disbiosis estropea los tres mecanismos de la flora: ocupar los huecos, alimentar a las células con cadenas cortas y ayudar al GALT. <span class="hl-rojo">La translocación es una fuente principal de sepsis y fallo multiorgánico</span>.' },
    { id: 'mu-g4', grupo: 'guia', corto: 'la rueda', tipo: 'destapa', fuente: 'mar-microbioma#mar-motor-fmo (A p. 60)',
        estado: { estacion: 'intestino', paciente: 'uci', vm: true, riego: 'shock' }, mirar: 'rueda',
        enunciado: 'Shock séptico de origen urinario, todavía sin antibiótico. ¿Cómo puede el intestino alimentar un fallo multiorgánico? Recorre la rueda: son cuatro cosas.',
        puntos: ['La <span class="hl-rojo">hipoperfusión esplácnica</span> rompe la barrera mucosa, igual que una disbiosis.', 'Pasan <span class="hl">patógenos o mediadores</span> a la circulación.', 'Se inicia una <span class="hl-rojo">respuesta inflamatoria sistémica</span>.', 'La <span class="hl-azul">activación simpática contrae los vasos esplácnicos</span> y rompe aún más la barrera: se autoalimenta.'],
        explicacion: 'El intestino como «motor» del fallo multiorgánico, la primera causa de muerte en el crítico. Con una disbiosis además, la rueda va a toda velocidad.' },
    { id: 'mu-g9', grupo: 'guia', corto: 'la boca', tipo: 'test', fuente: 'mar-microbioma#mar-colonizacion-orofaringe · #mar-fig-4-4 (A p. 63)',
        estado: { estacion: 'boca', paciente: 'sano' },
        tocar: { mandos: ['paciente'], mirar: 'cerraduras', ocultar: ['bgn', 'cerraduras'], instruccion: 'pon el paciente de UCI y mira las cerraduras.', comprobar: e => e.paciente === 'uci', pista: 'Pulsa «UCI».', bueno: { paciente: 'uci' }, confirma: '~70 %: las cerraduras cambian de forma y 7 de 10 llevan un bacilo pegado.' },
        enunciado: 'Un paciente de UCI y un celador del mismo hospital. ¿Quién lleva bacilos gramnegativos en la boca, y por qué?',
        opciones: [
            { t: 'Los dos por igual: lo decide el ambiente del hospital', ok: false, porque: 'Los empleados del hospital, ~2-3 %, como los sanos. Si culpas al ambiente, no ves que es la enfermedad del paciente la que deja pegarse a los bacilos que luego aspira.' },
            { t: 'El paciente: la enfermedad cambia las cerraduras del epitelio', ok: true },
            { t: 'El paciente, porque en la UCI hay más bacilos en el ambiente', ok: false, porque: 'Aciertas quién, no por qué: el empleado comparte ese ambiente y lleva ~2-3 %. Si lo atribuyes al ambiente, buscarás la solución fuera y no en lo que le pasa al epitelio de tu paciente, que es lo que le deja colonizado y expuesto a la neumonía por aspiración.' }],
        explicacion: 'La colonización <span class="hl-azul">no depende del entorno sino de la enfermedad</span> (Fig. 4.4): las proteínas de adhesión cambian de forma y pasan a unir patógenos. Lo mismo ocurre en el intestino y la vejiga.' },
    { id: 'mu-g10', grupo: 'guia', corto: 'clorhexidina', tipo: 'test', fuente: 'mar-microbioma#mar-tabla-4-1 · acordeones «Clorhexidina oral» y «SOD» (A p. 63-64)',
        estado: { estacion: 'boca', paciente: 'uci', vm: true },
        tocar: { mandos: ['descontaminacion'], mirar: 'cerraduras', instruccion: 'pon la clorhexidina; después compárala con la SOD.', comprobar: e => e.descontaminacion === 'clorhexidina', pista: 'Pulsa «Clorhexidina 0,12 %».', bueno: { descontaminacion: 'clorhexidina' }, confirma: 'mueren sobre todo los grampositivos; los bacilos siguen pegados. Con la SOD caen también los bacilos.' },
        enunciado: 'Le pones clorhexidina al 0,12 % cada 6 h. Predice qué microbios siguen pegados a sus cerraduras.',
        opciones: [
            { t: 'Ninguno: es un antiséptico de amplio espectro', ok: false, porque: 'Actúa sobre todo frente a grampositivos, y en la boca del crítico predominan los gramnegativos: el paciente seguiría colonizado. Y en 11 ensayos se asoció a más mortalidad.' },
            { t: 'Solo los anaerobios, que son la flora normal', ok: false, porque: 'Eso es lo que deja la SOD, que sí va contra los bacilos gramnegativos. Con la clorhexidina, el paciente sigue con los gramnegativos pegados.' },
            { t: 'Los bacilos gramnegativos', ok: true }],
        explicacion: 'La clorhexidina actúa sobre todo frente a <span class="hl-rojo">grampositivos</span>, y <span class="hl-rojo">las guías de NAV retiraron su recomendación</span>. La SOD reduce la NAV y las bacteriemias por gramnegativos (−33 %): que se ignore es «la antítesis de la medicina basada en la evidencia», según el autor.' },
    { id: 'mu-e4', grupo: 'examen', corto: 'pauta de SDD', tipo: 'error', fuente: 'mar-microbioma#mar-sdd (A p. 65-66)',
        estado: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 0 },
        enunciado: 'Pauta de SDD que deja escrita el R1 para un ingreso previsto de una semana.',
        frases: [
            { t: 'Boca: gel de polimixina 2 %, tobramicina 2 % y anfotericina 2 % cada 6 h.', mal: false },
            { t: 'Tubo: 10 mL con polimixina E 100 mg, tobramicina 80 mg y anfotericina 500 mg por SNG cada 6 h.', mal: false },
            { t: 'Cefuroxima IV 1,5 g cada 8 h hasta el alta de la UCI.', mal: true, c: 'La cefuroxima, <span class="hl-rojo">los 4 primeros días</span>: protege mientras se descontamina el intestino (5-7 días). Lo que sigue hasta el alta es la pauta de boca y tubo.' },
            { t: 'Está indicada en todo paciente que vaya a estar más de 72 h en una UCI sin resistencias problemáticas.', mal: false },
            { t: 'Respeta la flora anaerobia, la normal del tubo.', mal: false }],
        explicacion: 'Ningún estudio, ni uno de 5 años ni una experiencia de 16, ha mostrado más infecciones por resistentes: el miedo que la deja de lado no tiene base.' },
    { id: 'mu-e6', grupo: 'examen', corto: 'probióticos', tipo: 'test', fuente: 'mar-microbioma#mar-probioticos (A p. 66)',
        estado: { estacion: 'intestino', paciente: 'uci', antibiotico: true }, despues: { estacion: 'intestino', paciente: 'uci', antibiotico: true, probiotico: 'tarde' },
        enunciado: 'Lleva 4 días de antibiótico de amplio espectro y alguien propone un probiótico para prevenir <i>C. difficile</i>. ¿Qué dice la ficha?',
        opciones: [
            { t: 'Sí: sirven en cualquier momento mientras dure el antibiótico', ok: false, porque: 'El efecto depende del momento: 19 estudios, solo si se empiezan en los 2 primeros días. Le darías un tratamiento sin efecto y una falsa sensación de prevención.' },
            { t: 'No: en la UCI están contraindicados por ser bacterias vivas', ok: false, porque: 'Su uso principal en la UCI es justo prevenir <i>C. difficile</i> durante el antibiótico, si se empiezan a tiempo. Negárselo al siguiente paciente le quitaría una prevención que funciona.' },
            { t: 'Ya no: solo previenen si se empiezan en los 2 primeros días', ok: true }],
        explicacion: '<i>Lactobacillus</i> y <i>Bifidobacterium</i> (resisten el ácido y las sales biliares) o <i>Saccharomyces</i>. <span class="hl-rojo">Solo en los 2 primeros días</span> de antibiótico. También reducen la encefalopatía hepática y la NAV.' },
    // ----- Ficha IX: la lesión mucosa por estrés -----
    { id: 'mu-g5', grupo: 'guia', corto: 'el moco', tipo: 'test', fuente: 'mar-ulcera-estres#mar-ulcera-patogenia (A p. 67)',
        estado: { estacion: 'estomago', paciente: 'sano' }, mirarDespues: 'moco',
        enunciado: 'El jugo gástrico tiene pH 1-2, como el zumo de limón. ¿Por qué no se come el estómago sano?',
        opciones: [
            { t: 'Su epitelio tiene muchas capas, con queratina, que el ácido no atraviesa', ok: false, porque: 'Es una sola capa de células, como en todo el tubo. Si crees que la pared aguanta sola, no vigilas lo que de verdad la sostiene en tu paciente: el riego de la mucosa.' },
            { t: 'Un moco con bicarbonato (pH 7), sostenido por el flujo de la mucosa', ok: true },
            { t: 'Porque en ayunas no se segrega ácido, y el crítico está en ayunas', ok: false, porque: 'La ficha no lo dice así: el jugo tiene pH 1-2 y el objetivo de la profilaxis es subirlo a ≥4. Con esa idea, el ventilado sin enteral parecería protegido, y es el de riesgo máximo (8-10 %).' }],
        explicacion: 'Una capa de moco rico en bicarbonato (<span class="hl-verde">pH 7</span>) protege el epitelio del ácido y de la pepsina, y <span class="hl">el flujo de la mucosa la sostiene</span>: el 70-90 % del riego del estómago va a la mucosa (prostaciclina y óxido nítrico).' },
    { id: 'mu-g6', grupo: 'guia', corto: 'ácido o riego', tipo: 'test', fuente: 'mar-ulcera-estres#mar-ulcera-patogenia · #mar-ulcera-frecuencia (A p. 67)',
        estado: { ...EULC },
        tocar: { mandos: ['riego'], mirar: 'lesion', instruccion: 'baja el riego: prueba «PA normal con VM» y «Shock».', comprobar: e => e.riego !== 'normal', pista: 'Toca «PA normal con VM» o «Shock».', bueno: { riego: 'shock' }, confirma: 'el moco adelgaza y aparece la erosión; con shock, una úlcera hasta la submucosa que sangra.' },
        enunciado: 'En el crítico, ¿qué rompe esa defensa: subir el ácido o bajar el riego? Predice y compruébalo.',
        opciones: [
            { t: 'Subir el ácido: el estrés dispara la secreción y quema la mucosa', ok: false, porque: 'Para la ficha, el desencadenante es la isquemia local; el ácido solo la agrava. Si persigues el pH, le das un IBP que no toca la causa y le añade <i>C. difficile</i> ×3 y neumonía.' },
            { t: 'La pepsina, aunque el riego sea normal', ok: false, porque: 'Con el riego normal, el moco con bicarbonato protege del ácido y de la pepsina: no hay erosión. Buscarías otro culpable y dejarías de vigilar la perfusión del paciente.' },
            { t: 'Bajar el riego: la isquemia local es el desencadenante', ok: true }],
        explicacion: 'El desencadenante es la <span class="hl-rojo">isquemia local</span>; el ácido la agrava. Y <span class="hl-azul">puede haber hipoperfusión gástrica oculta sin hipotensión</span>, sobre todo con VM. En las primeras 24 h de UCI hay erosiones en el 75-100 %.' },
    { id: 'mu-e2', grupo: 'examen', corto: 'sangrado significativo', tipo: 'test', fuente: 'mar-ulcera-estres#mar-sangrado-significativo (A p. 67)',
        estado: { ...EULC, riego: 'shock' }, mirar: 'lesion',
        enunciado: 'Úlcera de estrés que sangra de forma visible. ¿Cuál de estos datos <b>no basta</b> para llamarla «clínicamente significativa»?',
        opciones: [
            { t: 'Transfusión de 2 concentrados de hematíes', ok: false, porque: 'Sí basta (≥2 concentrados). Si no lo reconoces, infraestimas un sangrado que ya ha necesitado sangre.' },
            { t: 'Inicio de un vasopresor, o subirlo un 20 %', ok: false, porque: 'Sí basta. Si lo pasas por alto, el paciente sigue sangrando con un shock que estás tapando con el vasopresor.' },
            { t: 'Caída de la PA media de 15 mmHg', ok: true }],
        explicacion: 'Sangrado visible con al menos uno de: caída de la PA (sistólica, media o diastólica) <span class="hl">≥20 mmHg</span>; inicio de vasopresor o subida ≥20 %; caída de la Hb ≥2 g/dL; ≥2 concentrados. Rezumar es frecuente; lo significativo, infrecuente.' },
    { id: 'mu-e1', grupo: 'examen', corto: 'Tabla 4.2', tipo: 'test', fuente: 'mar-ulcera-estres#mar-tabla-4-2 · #mar-mito-corticoides (A p. 68)',
        estado: { ...EULC, enteral: true, corticoides: true }, mirar: 'escalera', ocultar: ['riesgo'], calculadora: { nombre: '¿Necesita profilaxis? (Tabla 4.2)', ir: 'mar-ulcera-calc' },
        enunciado: 'Según la Tabla 4.2, ¿cuál de estos pacientes cumple la regla para la profilaxis?',
        opciones: [
            { t: 'Ventilado 3 días con enteral completa y metilprednisolona a dosis altas', ok: false, porque: 'Un solo moderado (VM con enteral); los corticoides son riesgo bajo. Le darías un IBP sin indicación: <i>C. difficile</i> ×3 y más neumonía.' },
            { t: 'Sepsis y fracaso renal agudo, sin ventilación', ok: true },
            { t: 'Anticoagulado a dosis plenas y con un cáncer', ok: false, porque: 'Anticoagulación y cáncer son riesgo bajo (1-2 %): no cambian la decisión. El paciente cargaría con los riesgos de suprimir el ácido sin beneficio.' }],
        explicacion: 'La regla: profilaxis con un factor máximo o alto, o <span class="hl">con dos o más moderados</span> (sepsis + FRA = alto, 4-8 %, el corte). La trampa: <span class="hl-rojo">corticoides y anticoagulación no cuentan</span>. La lámina enseña el primero: un solo moderado.' },
    { id: 'mu-e5', grupo: 'examen', corto: 'famotidina', tipo: 'test', fuente: 'mar-ulcera-estres#mar-tabla-4-3 · acordeón «Anti-H2» (A p. 68-69)',
        estado: { ...EULC, proteccion: 'famotidina' }, despues: { ...EULC, proteccion: 'famotidina', clcr50: true },
        enunciado: 'Ventilado sin enteral, con famotidina 20 mg cada 12 h. Hoy su ClCr es de 35 mL/min. ¿Qué haces?',
        opciones: [
            { t: 'Mantenerla: los anti-H2 no requieren ajuste renal', ok: false, porque: 'Son los IBP los que no lo requieren. La famotidina se elimina por el riñón: acumulada, puede alterar la conciencia del paciente.' },
            { t: 'Bajar a la mitad la dosis diaria', ok: true },
            { t: 'Cambiar a sucralfato, que protege igual y no se ajusta', ok: false, porque: 'No protege igual: IBP > anti-H2 > sucralfato. A un paciente de riesgo máximo le darías la profilaxis menos eficaz.' }],
        explicacion: 'Tabla 4.3: famotidina 20 mg cada 12 h, <span class="hl-rojo">−50 % con ClCr <50</span> (neurotóxica en la insuficiencia renal). Los IBP no necesitan ajuste.' },
    { id: 'mu-g7', grupo: 'guia', corto: 'IBP en el shock', tipo: 'test', fuente: 'mar-microbioma#mar-fig-4-3 · mar-ulcera-estres#mar-profilaxis-uso (A p. 61-62, 68-71)',
        estado: { ...EULC, riego: 'shock' },
        tocar: { mandos: ['proteccion'], mirar: 'gauge', ocultar: ['ph', 'salmonella'], instruccion: 'pon pantoprazol y mira la Fig. 4.3, a la derecha, y la úlcera.', comprobar: e => e.proteccion === 'pantoprazol', pista: 'Pulsa «Pantoprazol».', bueno: { proteccion: 'pantoprazol' }, confirma: 'pH ≥4: la <i>Salmonella</i> crece; la úlcera sigue (su tamaño, ilustrativo). Y abajo, la balanza.' },
        enunciado: 'Ese paciente en shock tiene una úlcera. Pones pantoprazol. Predice qué verás en la lámina.',
        opciones: [
            { t: 'La úlcera desaparece: sin ácido no hay lesión', ok: false, porque: 'La causa es la isquemia: la úlcera sigue. Si crees que el IBP la cura, dejas de corregir la perfusión del paciente.' },
            { t: 'Nada: el IBP casi no cambia el pH del estómago', ok: false, porque: 'Bloquea de forma irreversible la bomba de H⁺: inhibición completa del ácido. Por eso el estómago deja de frenar a los patógenos que llegan: más gastroenteritis y neumonía, y <i>C. difficile</i> ×3 con IBP.' },
            { t: 'La úlcera sigue, y la <i>Salmonella</i> deja de morir', ok: true }],
        explicacion: 'Fig. 4.3: a pH 4 la <i>Salmonella</i> crece; a pH 2 desaparece en 1 h. <span class="hl-rojo">Quitar el ácido abre la puerta</span>: más gastroenteritis, más neumonía y <i>C. difficile</i>. Y la úlcera no venía del ácido: <span class="hl">el efecto es pequeño</span> (sangrado 4,2 → 2,5 %, Fig. 4.6).' },
    { id: 'mu-e3', grupo: 'examen', corto: 'Fig. 4.6', tipo: 'test', fuente: 'mar-ulcera-estres · acordeón «IBP» · Fig. 4.6 (A p. 69-71)',
        estado: { ...EULC, riego: 'oculta', proteccion: 'pantoprazol' }, ocultar: ['balanza'], mirar: 'balanza',
        enunciado: '3.298 pacientes de UCI de alto riesgo, pantoprazol 40 mg IV al día frente a placebo (Fig. 4.6). ¿Qué concluye la fuente?',
        opciones: [
            { t: 'Que hay que dárselo: baja el sangrado de 4,2 a 2,5 %', ok: false, porque: 'Es un efecto de solo un 1,7 %, y se pierde al sumar neumonía, <i>C. difficile</i> e isquemia miocárdica. El paciente cargaría con los riesgos sin ganancia neta.' },
            { t: 'Sin beneficio neto al sumar sus riesgos al sangrado', ok: true },
            { t: 'Que mejora la supervivencia de los ventilados', ok: false, porque: 'Ninguna profilaxis mejora la supervivencia. Si lo crees, mantendrás el IBP a pacientes que solo reciben sus riesgos.' }],
        explicacion: 'Sangrado 4,2 → 2,5 % (<span class="hl">1,7 %</span>); sangrado + neumonía + <i>C. difficile</i> + isquemia miocárdica: <span class="hl-purpura">21,9 % frente a 22,6 %</span>. Mira la balanza: se inclina con el sangrado y se iguala al sumar los riesgos.' },
    { id: 'mu-g8', grupo: 'guia', corto: 'la enteral', tipo: 'destapa', fuente: 'mar-ulcera-estres#mar-enteral-protege · #mar-tabla-4-2 · #mar-desprescribir (A p. 68, 71-72)',
        estado: { ...EULC, riego: 'oculta', enteral: true }, mirar: 'moco',
        enunciado: '¿Por qué protege la nutrición enteral completa? Son dos razones y una consecuencia.',
        puntos: ['Efecto <span class="hl-verde">trófico</span> sobre la mucosa.', '<span class="hl">Sube el pH</span> del contenido gástrico.', 'En tres estudios, <span class="hl-rojo">los supresores del ácido dejaban de reducir el sangrado</span> con enteral completa: para la fuente, es todo lo que hace falta.'],
        explicacion: 'Tabla 4.2: VM >24 h sin enteral = máximo (8-10 %); con enteral = moderado (2-4 %), sin profilaxis. Y la mejor nutrición enteral explica que <span class="hl">retirar el pantoprazol</span> no aumentara el sangrado en seis ensayos.' },
];

export const CASOS = [
    { id: 'E1', titulo: 'Ramón, 70 años: ¿protección gástrica a este?', corto: 'Ramón · ¿protección gástrica?', sub: 'neumonía, intubado',
        paciente: { Edad: '70 años', Motivo: 'Neumonía; intubado', 'ClCr basal': '40 mL/min (ERC estable, sin FRA)' },
        pasos: [
            { momento: 'Día 1', datos: { VM: 'prevista más de 24 h', Enteral: 'no', Fármacos: 'metilprednisolona a dosis altas', 'Sepsis / shock': 'no / no', Coagulación: 'normal' }, nuevo: ['VM', 'Enteral', 'Fármacos', 'Sepsis / shock', 'Coagulación'],
                estado: { ...EULC, riego: 'oculta', corticoides: true, clcr50: true, dia: 1 }, mirar: 'escalera', calculadora: { nombre: '¿Necesita profilaxis? (Tabla 4.2)', ir: 'mar-ulcera-calc' },
                pregunta: { id: 'e1-1', tipo: 'test', fuente: 'mar-ulcera-estres#mar-tabla-4-2 · #mar-mito-corticoides · #mar-ulcera-patogenia (A p. 67-68)', ocultar: ['riesgo'],
                    enunciado: '¿Le pones profilaxis de la úlcera de estrés? ¿Por qué?',
                    opciones: [
                        { t: 'Sí, por los corticoides a dosis altas', ok: false, porque: 'Es el mito: 25 estudios sin efecto sobre el sangrado. Si la razón son los corticoides, se la mantendrás cuando ya no la necesite y cargará con <i>C. difficile</i> ×3 y neumonía.' },
                        { t: 'Sí: VM >24 h sin enteral es riesgo máximo', ok: true },
                        { t: 'No: sin hipotensión no hay isquemia de la mucosa', ok: false, porque: 'Puede haber hipoperfusión gástrica oculta sin hipotensión, sobre todo con VM. Lo dejarías sin profilaxis en el escalón de riesgo máximo.' }],
                    explicacion: 'Tabla 4.2: VM >24 h sin enteral = <span class="hl-rojo">máximo (8-10 %)</span>. Los corticoides están en el escalón bajo (1-2 %): no cambian la decisión. En la lámina, la erosión ya rezuma con la PA normal.' } },
            { momento: 'Día 1', datos: { Profilaxis: 'pantoprazol 40 mg IV al día' }, nuevo: ['Profilaxis'],
                estado: { ...EULC, riego: 'oculta', corticoides: true, clcr50: true, proteccion: 'pantoprazol', dia: 1 }, mirar: 'balanza',
                pregunta: { id: 'e1-2', tipo: 'destapa', fuente: 'mar-ulcera-estres#mar-profilaxis-uso · #mar-tabla-4-3 · acordeones «IBP» y «Sucralfato» (A p. 68-71)',
                    enunciado: '¿Por qué pantoprazol, y qué esperas de él? Son tres cosas.',
                    puntos: ['Eficacia: <span class="hl">IBP > anti-H2 > sucralfato</span>; <span class="hl-rojo">ninguno mejora la supervivencia</span>.', 'Va por vía <span class="hl">IV</span> y <span class="hl-azul">no requiere ajuste renal</span> (su ClCr es 40; la famotidina sí lo necesitaría).', 'El sucralfato le valdría hoy, sin enteral, pero <span class="hl-rojo">no cuando empiece la nutrición</span>: necesita el estómago vacío (bezoares).'],
                    explicacion: 'La balanza de la Fig. 4.6 recuerda el precio: sangrado 4,2 → 2,5 %, pero sumando neumonía, <i>C. difficile</i> e isquemia, 21,9 % frente a 22,6 %.' } },
            { momento: 'Día 3 · el giro', datos: { Enteral: 'completa desde ayer' }, nuevo: ['Enteral'],
                estado: { ...EULC, riego: 'oculta', corticoides: true, clcr50: true, proteccion: 'pantoprazol', enteral: true, dia: 3 }, mirar: 'moco',
                pregunta: { id: 'e1-3', tipo: 'test', fuente: 'mar-ulcera-estres#mar-desprescribir · #mar-enteral-protege · #mar-tabla-4-2 (A p. 68, 71-72)', ocultar: ['riesgo'],
                    enunciado: 'Ya tolera la nutrición completa y sigue intubado. ¿Qué haces con el pantoprazol?',
                    opciones: [
                        { t: 'Mantenerlo hasta la extubación: sigue con VM', ok: false, porque: 'Con enteral completa, la VM es un solo moderado (2-4 %): no hay indicación. Seis ensayos: retirarlo no aumenta el sangrado. Mantenerlo le deja <i>C. difficile</i> ×3 y neumonía.' },
                        { t: 'Pasarlo a sucralfato, que conserva la acidez', ok: false, porque: 'Con la nutrición no se puede (estómago vacío, bezoares), y ya no hay indicación: le sumarías un fármaco que fija otros en el estómago.' },
                        { t: 'Retirarlo: con la enteral, queda en un solo moderado', ok: true }],
                    explicacion: '<span class="hl-verde">Desprescribir</span>: seis ensayos no ven más sangrado al retirar el pantoprazol en pacientes de alto riesgo; la diferencia con los estudios antiguos se atribuye a la mejor nutrición enteral. Mira: con enteral, el IBP ya no achica más la erosión.' } },
            { momento: 'Día 5', datos: { Fármacos: 'metilprednisolona; famotidina 20 mg cada 12 h (pautada anoche)' }, nuevo: ['Fármacos'],
                estado: { ...EULC, riego: 'oculta', corticoides: true, clcr50: true, proteccion: 'famotidina', enteral: true, dia: 5 }, mirar: 'gauge',
                pregunta: { id: 'e1-4', tipo: 'test', fuente: 'mar-ulcera-estres#mar-tabla-4-3 · acordeón «Anti-H2» (A p. 68-69)',
                    enunciado: 'Anoche, de guardia, le pautaron famotidina 20 mg cada 12 h. Su ClCr es 40. ¿Qué haces?',
                    opciones: [
                        { t: 'Pasarla a pantoprazol, que no requiere ajuste renal', ok: false, porque: 'Sigue sin indicación; y con IBP la asociación con <i>C. difficile</i> y neumonía es más fuerte. Le cambiarías un riesgo por otro mayor.' },
                        { t: 'Retirarla; y si hiciera falta, a mitad de dosis', ok: true },
                        { t: 'Mantener 20 mg cada 12 h: es la dosis de la Tabla 4.3', ok: false, porque: 'Con ClCr <50, la mitad de la dosis diaria: acumulada, puede alterarle la conciencia. Y no tiene indicación.' }],
                    explicacion: 'Con enteral completa y un solo moderado, <span class="hl-verde">no hay indicación</span>. Si la hubiera: famotidina <span class="hl-rojo">−50 % con ClCr <50</span> (neurotóxica).' } },
            { momento: 'Día 5', datos: { Fármacos: 'metilprednisolona' }, nuevo: ['Fármacos'],
                estado: { ...EULC, riego: 'oculta', corticoides: true, clcr50: true, enteral: true, dia: 5 }, mirar: 'escalera',
                pregunta: { id: 'e1-5', tipo: 'error', fuente: 'mar-ulcera-estres#mar-mito-corticoides · #mar-desprescribir · #mar-tabla-4-3 · #mar-sangrado-significativo',
                    enunciado: 'Plan que presenta el R1 en la sesión de la mañana.',
                    frases: [
                        { t: 'Los corticoides a dosis altas obligan a mantener un IBP.', mal: true, c: 'Es el mito: el conjunto de 25 estudios no mostró efecto de los corticoides sobre el sangrado de ninguna gravedad (riesgo bajo, 1-2 %).' },
                        { t: 'Con enteral completa se puede retirar el pantoprazol: seis ensayos no vieron más sangrado.', mal: false },
                        { t: 'Si hiciera falta famotidina, 20 mg cada 12 h: con ClCr 40 no se ajusta.', mal: true, c: 'Con ClCr <50, <span class="hl-rojo">la mitad de la dosis diaria</span>.' },
                        { t: 'Si sangra, será significativo si, por ejemplo, la Hb cae ≥2 g/dL o necesita ≥2 concentrados.', mal: false },
                        { t: 'Ninguna profilaxis mejora la supervivencia.', mal: false }],
                    explicacion: 'Plan bueno: sin profilaxis, enteral completa y vigilar el sangrado significativo.' } },
        ],
        lleva: ['La úlcera de estrés la desencadena la isquemia de la mucosa, no el ácido: la profilaxis tiene un efecto pequeño.',
            'La enteral completa es la mejor protección: con un solo moderado, se desprescribe el IBP.',
            'Los corticoides no son motivo; la famotidina, a mitad de dosis con ClCr <50.'],
        volver: { nombre: 'Lesión mucosa por estrés · Tabla 4.2', ancla: 'mar-tabla-4-2', estado: { ...EULC, riego: 'oculta', enteral: true, corticoides: true, dia: 5 } } },

    { id: 'E5', titulo: 'Lucía, 55 años: ¿SDD a esta?', corto: 'Lucía · ¿descontaminar?', sub: 'posoperatorio, ingreso largo',
        paciente: { Edad: '55 años', Motivo: 'Posoperatorio de cirugía abdominal; ventilada', Previsión: 'UCI más de 72 h', Unidad: 'sin resistencias problemáticas' },
        pasos: [
            { momento: 'Día 0 · ingreso', datos: {}, nuevo: [], estado: { estacion: 'intestino', paciente: 'uci', vm: true, dia: 0 }, mirar: 'tira',
                pregunta: { id: 'e5-1', tipo: 'test', fuente: 'mar-microbioma#mar-sdd (A p. 65-66)',
                    enunciado: '¿Le pones SDD?',
                    opciones: [
                        { t: 'No: la SDD dispara las resistencias', ok: false, porque: 'Ningún estudio lo ha mostrado (ni uno de 5 años ni una experiencia de 16). Le quitarías un beneficio probado: menos infecciones adquiridas en la UCI y menos mortalidad.' },
                        { t: 'Solo si llega a tener una neumonía asociada al ventilador', ok: false, porque: 'Es profilaxis: se da para prevenir las infecciones adquiridas en la UCI, no para tratarlas. Esperar a la neumonía es perder lo que evita.' },
                        { t: 'Sí: más de 72 h de UCI; hasta el alta', ok: true }],
                    explicacion: 'Indicación: <span class="hl">todo paciente que vaya a estar más de 72 h</span> en la UCI, hasta el alta. Reduce neumonía, infección urinaria y bacteriemia, y <span class="hl-verde">la mortalidad</span>.' } },
            { momento: 'Día 0', datos: { SDD: 'pautada' }, nuevo: ['SDD'], estado: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 0 }, mirar: 'fig45',
                pregunta: { id: 'e5-2', tipo: 'destapa', fuente: 'mar-microbioma#mar-sdd (A p. 65)',
                    enunciado: '¿Cuáles son las tres partes de la pauta? Con sus dosis.',
                    puntos: ['<b>Boca</b>: gel de polimixina 2 %, tobramicina 2 % y anfotericina 2 % cada 6 h.', '<b>Tubo digestivo</b>: 10 mL con polimixina E 100 mg, tobramicina 80 mg y anfotericina 500 mg por SNG cada 6 h.', '<b>Sistémico</b>: cefuroxima IV 1,5 g cada 8 h <span class="hl">los 4 primeros días</span>.'],
                    explicacion: 'Antibióticos no absorbibles contra estafilococos, bacilos gramnegativos aerobios y <i>Candida</i>, <span class="hl-verde">respetando la flora anaerobia</span>.' } },
            { momento: 'Día 2', datos: { SDD: 'día 2' }, nuevo: ['SDD'], estado: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 2 },
                pregunta: { id: 'e5-3', tipo: 'test', fuente: 'mar-microbioma#mar-sdd (A p. 65)',
                    tocar: { mandos: ['dia'], mirar: 'fig45', ocultar: ['tira'], instruccion: 'mueve el día de la SDD hasta el 7 y mira la tira y el reloj de abajo.', comprobar: e => e.dia >= 7, pista: 'Pulsa «Día 7».', bueno: { dia: 7 }, confirma: 'el día 7 se han ido los patógenos; la flora anaerobia sigue. El ritmo de la tira es ilustrativo: la ficha da 5-7 días.' },
                    enunciado: '¿Por qué la cefuroxima solo los 4 primeros días? Predice cuándo estará descontaminado su intestino.',
                    opciones: [
                        { t: 'Porque el intestino queda limpio en 24 h', ok: false, porque: 'Tarda 5-7 días. Si crees que basta un día, retirarías la protección de la paciente cuando aún está colonizada.' },
                        { t: 'Cubre mientras se descontamina el intestino, que tarda 5-7 días', ok: true },
                        { t: 'Porque a partir del día 4 aparecen resistencias', ok: false, porque: 'Ningún estudio de SDD ha mostrado más infecciones por resistentes. Con ese miedo, se la quitarías y perdería su protección.' }],
                    explicacion: 'La cefuroxima es la <span class="hl">protección sistémica</span> mientras se descontamina el intestino.' } },
            { momento: 'Día 7', datos: { SDD: 'día 7' }, nuevo: ['SDD'], estado: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 7 }, mirar: 'fig45',
                pregunta: { id: 'e5-4', tipo: 'test', fuente: 'mar-microbioma#mar-fig-4-5 · #mar-sdd (A p. 64-66)', ocultar: ['fig45'],
                    enunciado: 'En el estudio de la Fig. 4.5, las bacteriemias por gramnegativos pasaron de 4,5 (control) a 1,4 por 1.000 días con la SDD. ¿Qué reducción da el texto?',
                    opciones: [
                        { t: '−33 %', ok: false, porque: 'Esa es la de la SOD (4,5 → 3). Te quedarías corto con la SDD y quizá elegirías para tu paciente la estrategia que protege menos.' },
                        { t: '−31 %: 1,4 es el 31 % de 4,5', ok: false, porque: 'El 31 % es lo que queda, no lo que baja. Leer así un ensayo te hace infravalorar lo que gana tu paciente.' },
                        { t: '−67 %', ok: true }],
                    explicacion: 'SOD: −33 %; SDD: <span class="hl-verde">−67 %</span> (texto). También el % de pacientes con bacteriemia: 6,2 → 4 → 1,9 %.',
                    nota: '<b>Nota de fidelidad.</b> Con las barras (4,5 → 1,4) sale −69 %; el texto dice −67 %. Se muestra la del texto. <span class="org">ficha · p. 66</span>' } },
            { momento: 'Día 9 · el giro', datos: { Unidad: 'brote de BGN multirresistentes: resistencias problemáticas' }, nuevo: ['Unidad'], estado: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 9, mr: true }, mirar: 'vellosidad',
                pregunta: { id: 'e5-5', tipo: 'test', fuente: 'mar-microbioma#mar-sdd (A p. 66)',
                    enunciado: 'La unidad tiene ya resistencias problemáticas: un brote de bacilos gramnegativos multirresistentes. ¿Qué cambia para la SDD?',
                    opciones: [
                        { t: 'Nada: la SDD también cubre a los multirresistentes', ok: false, porque: 'Con multirresistentes el efecto se pierde: la paciente seguiría expuesta a sus bacteriemias con una falsa seguridad.' },
                        { t: 'Pierde su efecto: no es apropiada en esa UCI', ok: true },
                        { t: 'Hay que alargar la cefuroxima hasta el alta', ok: false, porque: 'La cefuroxima va los 4 primeros días y no arregla el problema: la SDD pierde su efecto contra los multirresistentes. Le añadirías antibiótico sin beneficio.' }],
                    explicacion: '<span class="hl-rojo">No es apropiada en UCI con resistencias problemáticas</span>. Mira la lámina: los bacilos con halo no caen ni el día 9.' } },
            { momento: 'Día 9', datos: {}, nuevo: [], estado: { estacion: 'boca', paciente: 'uci', vm: true, sdd: true, dia: 9, mr: true }, mirar: 'cerraduras',
                pregunta: { id: 'e5-6', tipo: 'error', fuente: 'mar-microbioma#mar-tabla-4-1 · #mar-probioticos · #mar-sdd (A p. 63-66)',
                    enunciado: 'Hoja de órdenes que propone el R1 para la boca y el intestino.',
                    frases: [
                        { t: 'Clorhexidina al 2 % cada 6 h en la boca.', mal: true, c: '0,12 % cada 6 h: <span class="hl-rojo">el 2 % produce mucositis ulcerosa</span>. Y las guías de NAV retiraron su recomendación.' },
                        { t: 'Con multirresistentes en la unidad, la SDD deja de estar indicada.', mal: false },
                        { t: 'Probiótico desde hoy, día 9 de antibiótico, para prevenir <i>C. difficile</i>.', mal: true, c: 'Solo previene si se empieza en los <span class="hl-rojo">2 primeros días</span> de antibiótico (19 estudios).' },
                        { t: 'La SOD respeta los anaerobios, la flora normal de la boca.', mal: false }],
                    explicacion: 'Dos errores de dosis y de momento: los dos dejan a la paciente sin beneficio y con riesgo.' } },
        ],
        lleva: ['SDD a todo el que vaya a estar más de 72 h en una UCI sin resistencias problemáticas, hasta el alta.',
            'Boca, tubo y cefuroxima 4 días: el intestino tarda 5-7 días; bacteriemias por gramnegativos −67 %.',
            'Con multirresistentes, la SDD pierde el efecto; la clorhexidina, al 0,12 % y no al 2 %.'],
        volver: { nombre: 'El intestino como origen de infección · SDD', ancla: 'mar-sdd', estado: { estacion: 'intestino', paciente: 'uci', vm: true, sdd: true, dia: 7 } } },

    { id: 'E6', titulo: 'Andrés, 62 años: la neumonía del que tomaba IBP', corto: 'Andrés · la neumonía y el IBP', sub: 'ventilado, día 6',
        paciente: { Edad: '62 años', Motivo: 'Ventilado (ingreso neurológico)', Enteral: 'completa desde el día 2', Fármacos: 'pantoprazol 40 mg IV desde el ingreso', 'Otros factores de la Tabla 4.2': 'ninguno' },
        hueco: 'El tratamiento de la neumonía no está en estas fichas: no se pregunta, se enlaza.',
        extra: { texto: '🫁 La prevención de la NAV (Merino Neumología)', ir: { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-nav-prevencion' } },
        pasos: [
            { momento: 'Día 6', datos: { Fiebre: 'sí', Secreciones: 'purulentas', Rx: 'infiltrado nuevo' }, nuevo: ['Fiebre', 'Secreciones', 'Rx'],
                estado: { ...EULC, enteral: true, proteccion: 'pantoprazol', dia: 6 }, mirar: 'gauge',
                pregunta: { id: 'e6-1', tipo: 'test', fuente: 'mar-ulcera-estres · acordeón «Riesgos de suprimir el ácido» (A p. 70-71)', ocultar: ['ph', 'salmonella'],
                    enunciado: 'Sospechas una neumonía asociada al ventilador. ¿Qué papel puede tener el pantoprazol?',
                    opciones: [
                        { t: 'Ninguno: el IBP solo actúa dentro del estómago', ok: false, porque: 'Al subir el pH, el jugo gástrico se coloniza y se aspira: hay más neumonía, también asociada al ventilador. No revisarías un fármaco que puede estar empeorándole.' },
                        { t: 'Le protege: menos ácido aspirado, menos daño en el pulmón', ok: false, porque: 'Lo que importa es lo que crece en un jugo sin ácido. Mantenerlo «para proteger» le deja más neumonía y <i>C. difficile</i> ×3.' },
                        { t: 'Puede haber contribuido: con IBP hay más neumonía', ok: true }],
                    explicacion: 'Más neumonía comunitaria y asociada al ventilador, <span class="hl-rojo">más con IBP que con anti-H2</span>; se cree que por colonización del jugo gástrico y aspiración.' } },
            { momento: 'Día 6', datos: { Familia: '«¿Por qué se lo pusieron?»' }, nuevo: ['Familia'],
                estado: { ...EULC, enteral: true, proteccion: 'pantoprazol', dia: 6 }, mirar: 'balanza',
                pregunta: { id: 'e6-2', tipo: 'test', fuente: 'Fig. 4.6 · acordeón «IBP» (A p. 69-71)', ocultar: ['balanza'],
                    enunciado: '¿Qué dice la balanza de la Fig. 4.6 sobre el pantoprazol en pacientes de alto riesgo?',
                    opciones: [
                        { t: 'Lo que evita pesa más: el sangrado baja de 4,2 a 2,5 %', ok: false, porque: 'Es un efecto de solo un 1,7 % y se pierde al sumar neumonía, <i>C. difficile</i> e isquemia. Con esa lectura, seguiría expuesto a sus riesgos sin ganancia.' },
                        { t: 'Se iguala al sumar los riesgos: sin beneficio neto', ok: true },
                        { t: 'Lo que añade pesa el doble: el total se duplica', ok: false, porque: 'No se duplica: 21,9 frente a 22,6 %. La conclusión es «sin beneficio neto», no «daño neto»: exagerarlo te haría negárselo también a quien la Tabla 4.2 sí se lo indica.' }],
                    explicacion: '21,9 % frente a 22,6 %: <span class="hl-purpura">sin beneficio neto</span>. Y desde el día 2, con la enteral completa, Andrés ya ni siquiera era de alto riesgo.' } },
            { momento: 'Día 6', datos: {}, nuevo: [],
                estado: { estacion: 'boca', paciente: 'uci', vm: true, enteral: true, proteccion: 'pantoprazol', dia: 6 }, mirar: 'traquea',
                pregunta: { id: 'e6-3', tipo: 'test', fuente: 'mar-microbioma#mar-saliva (A p. 62)',
                    tocar: { mandos: ['aspirar'], mirar: 'traquea', ocultar: ['aspirar'], instruccion: 'pulsa «Aspirar el 0,13 %» y sigue la gota por la tráquea.', comprobar: e => !!e.gota, pista: 'Pulsa «Aspirar el 0,13 %».', bueno: { gota: 1 }, confirma: '0,13 % de 750 mL ≈ 1 mL → un millón de microbios en la vía aérea.' },
                    enunciado: '¿Cuánta saliva tiene que aspirar para meter un millón de microbios en su vía aérea? Predice y compruébalo.',
                    opciones: [
                        { t: 'Medio litro: hace falta una aspiración masiva', ok: false, porque: 'Basta el 0,13 %. Si esperas una aspiración evidente, no ves la que ocurre a diario en tu paciente intubado.' },
                        { t: 'Un 10 % de la del día, unos 75 mL', ok: false, porque: 'Basta mucho menos: 1 mL de 750 (0,13 %), con un millón de microbios por mL. Y en el grave esa saliva lleva gramnegativos pegados por la enfermedad.' },
                        { t: 'Unos 1 mL: el 0,13 % de la del día', ok: true }],
                    explicacion: 'Se producen <span class="hl">750 mL de saliva al día</span>, con un millón de microbios por mL. La aspiración de secreciones orales sería el desencadenante de la mayoría de las neumonías nosocomiales.' } },
            { momento: 'Día 6', datos: {}, nuevo: [],
                estado: { estacion: 'boca', paciente: 'uci', vm: true, enteral: true, proteccion: 'pantoprazol', dia: 6, gota: 1 }, mirar: 'cerraduras',
                pregunta: { id: 'e6-4', tipo: 'destapa', fuente: 'mar-microbioma#mar-colonizacion-orofaringe · #mar-fig-4-4 · acordeón «Riesgos de suprimir el ácido» (A p. 63, 71)',
                    enunciado: '¿Por qué su boca está llena de gramnegativos, y qué añade el IBP? Son tres cosas.',
                    puntos: ['La enfermedad <span class="hl-azul">cambia la forma de las proteínas de adhesión</span>: los bacilos se pegan. No es el entorno.', 'En la UCI, <span class="hl-rojo">~70 %</span> lleva bacilos gramnegativos en la boca; un sano, ~2-3 % (Fig. 4.4, aproximada).', 'Con el IBP, <span class="hl-rojo">el jugo gástrico también se coloniza</span> y se aspira.'],
                    explicacion: 'En la tira, la flecha roja sube del estómago a la boca y a la tráquea.' } },
            { momento: 'Día 6 · el giro', datos: { Revisión: '¿tenía indicación?' }, nuevo: ['Revisión'],
                estado: { ...EULC, enteral: true, proteccion: 'pantoprazol', dia: 6 }, mirar: 'escalera',
                pregunta: { id: 'e6-5', tipo: 'test', fuente: 'mar-ulcera-estres#mar-tabla-4-2 · #mar-profilaxis-uso (A p. 68)', ocultar: ['riesgo'],
                    enunciado: 'Revisas por qué llevaba pantoprazol. ¿Qué dice la Tabla 4.2 de su caso?',
                    opciones: [
                        { t: 'Desde el día 2, un solo moderado: ya no la necesitaba', ok: true },
                        { t: 'Riesgo máximo: la VM >24 h obliga a la profilaxis', ok: false, porque: 'Eso es la VM sin enteral. Con enteral completa desde el día 2 es un moderado: desde entonces el IBP le sobraba y le ha expuesto a neumonía y <i>C. difficile</i>.' },
                        { t: 'Riesgo bajo: la VM no cuenta si tiene enteral', ok: false, porque: 'Sí cuenta, como moderado (2-4 %); con un segundo moderado (sepsis, shock, FRA) subiría a alto y sí la necesitaría. Si no lo vigilas, se la quitarás a quien la necesite.' }],
                    explicacion: 'Más del 80 % de los pacientes de UCI reciben profilaxis, y <span class="hl-rojo">unos 70 % de ellos no la necesitan</span>.' } },
            { momento: 'Día 7', datos: { Fármacos: 'pantoprazol retirado' }, nuevo: ['Fármacos'],
                estado: { ...EULC, enteral: true, dia: 7 }, mirar: 'gauge',
                pregunta: { id: 'e6-6', tipo: 'error', fuente: 'acordeones «Riesgos de suprimir el ácido» y «Clorhexidina oral» (A p. 64, 71)',
                    enunciado: 'Plan del R1 para Andrés.',
                    frases: [
                        { t: 'Retiro el pantoprazol.', mal: false },
                        { t: 'Lo cambio por famotidina: los anti-H2 no aumentan la neumonía.', mal: true, c: 'También la aumentan, aunque menos que los IBP; y no tiene indicación.' },
                        { t: 'Con enteral completa y un solo moderado, no necesita otra profilaxis.', mal: false },
                        { t: 'Clorhexidina oral para prevenir otra NAV: es lo que recomiendan las guías.', mal: true, c: 'Las guías internacionales de NAV <span class="hl-rojo">retiraron la recomendación</span>: el conjunto de 11 ensayos mostró más mortalidad.' }],
                    explicacion: 'Sin el IBP, vuelve el ácido; con la enteral completa el pH sube algo, sin cifra en la ficha.' } },
        ],
        lleva: ['Suprimir el ácido quita el antiséptico: el jugo gástrico se coloniza y se aspira (más neumonía), y hay más <i>C. difficile</i> (×3 con IBP).',
            'El 0,13 % de la saliva lleva un millón de microbios a la vía aérea; en el grave, gramnegativos pegados por la enfermedad.',
            'Más del 80 % recibe profilaxis y el 70 % no la necesita: revisa la indicación y retírala.'],
        volver: { nombre: 'Lesión mucosa por estrés · riesgos de suprimir el ácido', ancla: 'mar-acido-riesgos', estado: { ...EULC, riego: 'oculta', proteccion: 'pantoprazol' } } },
];

export const PDF = p => `docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf#page=${p}`;
export const PROFUNDIZAR = [
    { html: '<b>El microbioma.</b> Unos 70.000 genomas y 2 kg; presente casi desde el nacimiento, funciona como un ecosistema.', donde: 'mar-microbioma-cifras · A p. 58', href: PDF(58) },
    { html: '<b>El ácido y la digestión.</b> La aclorhidria no causa malabsorción relevante: solo facilita la absorción de hierro y calcio.', donde: 'mar-acido-antiseptico · A p. 60', href: PDF(60) },
    { html: '<b>Lister (1867).</b> El primer antiséptico fue un ácido, el carbólico (fenol). Hoy su nombre se recuerda por un enjuague bucal.', donde: 'mar-acido-antiseptico · A p. 61', href: PDF(61) },
    { html: '<b>Clorhexidina: la evidencia.</b> Algunos estudios, −30 % de NAV sin menos mortalidad; otros, beneficio marginal o nulo; 11 ensayos juntos, más mortalidad.', donde: 'acordeón «Clorhexidina oral» · A p. 64', href: PDF(64) },
    { html: '<b>¿Por qué se ignora la SDD?</b> Por miedo a las resistencias; ningún estudio (uno de 5 años, una experiencia de 16) mostró más infecciones por resistentes. En Sobrevivir a la UMI está el protocolo de DDS de guardia (Manual UMI).', donde: 'mar-sdd · A p. 66', href: PDF(66) },
    { html: '<b>Probióticos y prebióticos.</b> Los prebióticos son fibras que favorecen la flora; juntos, «simbióticos». Los probióticos también reducen la encefalopatía hepática y la NAV.', donde: 'mar-probioticos · A p. 66', href: PDF(66) },
    { html: '<b>El flujo de la mucosa.</b> La prostaciclina y el óxido nítrico lo mantienen; en la hemorragia, la reperfusión también contribuye (modelos animales).', donde: 'mar-ulcera-patogenia · A p. 67', href: PDF(67) },
    { html: '<b>IBP y clopidogrel.</b> Comparten el citocromo P-450: el IBP puede frenar su activación. Pruebas inconsistentes; hoy no se recomienda evitarlos.', donde: 'acordeón «IBP» · A p. 70', href: PDF(70) },
    { html: '<b>El aluminio del sucralfato</b> fija en el estómago ciprofloxacino, digoxina, ketoconazol, norfloxacino, fenitoína, tiroxina, tetraciclina, teofilina y warfarina, y el fosfato intestinal (rara vez hipofosfatemia).', donde: 'acordeón «Sucralfato» · A p. 71', href: PDF(71) },
    { html: '<b>Acidofobia gástrica.</b> pH: ácido gástrico 2,0; zumo de limón 2,0; Pepsi 2,13; vinagre 2,2; Coca-Cola 2,24; Fanta 2,51. No queman la boca: lo que quema en un ácido industrial es su composición, no su acidez.', donde: 'mar-acidofobia · A p. 72-73', href: PDF(72) },
    { html: '<b>Los otros IBP (Tabla 4.3).</b> Omeprazol 40 mg al día y lansoprazol 30 mg al día, por vía oral o SNG; el esomeprazol también va IV, pero apenas se usa. Se consideran equivalentes, aunque no se ha estudiado; ninguno necesita ajuste renal.', donde: 'mar-tabla-4-3 · A p. 68-69', href: PDF(69) },
    { html: '<b>Suprimir el ácido tiene precio.</b> Aumenta las gastroenteritis por <i>Salmonella</i> y <i>Campylobacter</i> y las infecciones por <i>C. difficile</i>; la FDA publicó en 2013 una alerta de seguridad sobre <i>C. difficile</i> e IBP.', donde: 'mar-acido-antiseptico · acordeón «Riesgos» · A p. 62, 70', href: PDF(70) },
    { html: '<b>Tabla 4.4, contra la profilaxis rutinaria.</b> El sangrado significativo es infrecuente; el efecto de la profilaxis es pequeño; no mejora la supervivencia; y el beneficio se pierde al contar los riesgos de suprimir el ácido.', donde: 'mar-tabla-4-4 · A p. 72', href: PDF(72) },
    { html: '<b>Profilaxis de más.</b> Más del 80 % de los pacientes de UCI la reciben y unos 70 % no la necesitan: un exceso que no solo es caro, también puede hacer daño.', donde: 'mar-profilaxis-uso · A p. 68', href: PDF(68) },
    { html: '<b>La boca del grave.</b> Se coloniza sobre todo por bacilos gramnegativos aerobios como <i>Pseudomonas aeruginosa</i>, que son también la causa más frecuente de la neumonía nosocomial: por eso se descontamina la boca del intubado. La pauta de la clorhexidina es mantenerla mientras dependa del respirador, aunque las guías internacionales de NAV <span class="hl-rojo">retiraron su recomendación</span> por la duda sobre el daño. Impedir que los patógenos se peguen al epitelio sería un método eficaz de control de la infección; para el autor, merece mucha más atención.', donde: 'mar-colonizacion-orofaringe · Tabla 4.1 · A p. 63-64', href: PDF(63) },
    { html: '<b>¿La piel o el intestino?</b> La reflexión del autor sobre el origen de la bacteriemia por catéter (vía 4): poca correlación entre la piel del punto y la punta; gramnegativos, enterococos y <i>Candida</i> son la mitad.', donde: 'mar-bac-intestino · A p. 53-54', href: PDF(53) },
];

export const LAMINAS = [
    ['mar-fig4-1-densidad-microbiana.jpg', 'Fig. 4.1', 'Densidad de microorganismos (UFC por mL): boca 10⁶, estómago <10³, intestino 10⁹, colon 10¹².'],
    ['mar-fig4-2-translocacion.jpg', 'Fig. 4.2', 'Consecuencias de alterar el microbioma: 1) sobrecrecimiento, 2) rotura de la mucosa, 3) aclaramiento linfático alterado («Cleatance»: errata de la figura).'],
    ['mar-fig4-3-ph-gastrico-bacterias.jpg', 'Fig. 4.3', 'Supervivencia de Salmonella typhimurium a pH 2, 3 y 4.'],
    ['mar-fig4-4-colonizacion-orofaringe.jpg', 'Fig. 4.4', 'Bacilos gramnegativos aerobios en la boca según el grupo.'],
    ['mar-fig4-5-descontaminacion-sdd.jpg', 'Fig. 4.5', 'Bacteriemia por gramnegativos con SOD, SDD o cuidados habituales.'],
    ['mar-fig4-6-pantoprazol.jpg', 'Fig. 4.6', 'Pantoprazol 40 mg IV: sangrado, y sangrado más neumonía, C. difficile e isquemia. 3.298 pacientes.'],
];

/* ============================================================
   Prueba de las cifras (sin DOM): window.__murPruebas() la amplía con los estados pintados y la Mayéutica
   ============================================================ */
export function pruebasMuralla() {
    const r = { fallos: [], todoCoincide: true };
    const ok = (c, t) => { if (!c) { r.fallos.push(t); r.todoCoincide = false; } };
    const de = k => derivar(estadoDe(ESTADOS[k].e));
    // Fig. 4.1 y la pared
    r.fig41 = { ...TIRA }; ok(TIRA.boca === 6 && TIRA.estomago === 3 && TIRA.intestino === 9 && TIRA.colon === 12, 'Fig. 4.1: 10⁶, <10³, 10⁹, 10¹²');
    const ds = de('sano'); r.tiraPuntos = ds.tira;
    ok(ds.tira.estomago < ds.tira.boca && ds.tira.boca < ds.tira.intestino && ds.tira.intestino < ds.tira.colon, 'la tira: el estómago, casi vacío; el colon, lleno');
    // sano
    r.sano = { motor: ds.motor, residentes: ds.residentes, translocacion: ds.translocacion }; ok(ds.motor === 0 && ds.residentes === 1 && !ds.translocacion, 'sano: rueda quieta, flora en todos los huecos');
    const dd = de('disbiosis'); r.disbiosis = { numeros: dd.numeros, motor: dd.motor, translocacion: dd.translocacion };
    ok(dd.numeros[1] && dd.numeros[2] && dd.numeros[3] && dd.motor === 1 && dd.translocacion, 'disbiosis: los 3 números de la Fig. 4.2, translocación, rueda girando');
    const dm = de('motor-fmo'); r.motorFmo = { motor: dm.motor, vasosCerrados: dm.vasosCerrados }; ok(dm.motor === 2 && dm.vasosCerrados, 'motor-fmo: a toda velocidad, vasos esplácnicos cerrados');
    const dh = derivar(estadoDe({ estacion: 'intestino', riego: 'shock', vm: true, paciente: 'uci' })); r.soloShock = { motor: dh.motor, numeros: dh.numeros };
    ok(dh.motor === 1 && dh.numeros[2] && !dh.numeros[1], 'solo hipoperfusión: rompe la barrera y arranca la rueda, sin sobrecrecimiento');
    // boca
    const db = de('boca-uci'); r.bocaUci = { bgn: db.bgnPct, colonizadas: db.colonizadas, cambiadas: db.cerradurasCambiadas, aspirar: db.aspirar.microbios };
    ok(db.bgnPct === 70 && db.colonizadas === 7 && db.cerradurasCambiadas, 'boca-uci: ~70 %, 7 de 10 cerraduras');
    ok(db.aspirar.microbios > 9e5 && db.aspirar.microbios < 1.1e6, '0,13 % de 750 mL ≈ un millón de microbios');
    r.bgn = { sano: derivar(estadoDe({ paciente: 'sano' })).colonizadas, planta: derivar(estadoDe({ paciente: 'planta' })).colonizadas }; ok(r.bgn.sano === 0 && r.bgn.planta === 4, 'Fig. 4.4: sano 0 de 10, planta 4 de 10');
    const dc = de('clorhexidina'); r.clorhexidina = { cocos: dc.cocosVivos, bacilos: dc.bacilosVivos }; ok(!dc.cocosVivos && dc.bacilosVivos, 'clorhexidina: mueren los cocos, quedan los bacilos');
    const dso = de('sod'); r.sod = { cocos: dso.cocosVivos, bacilos: dso.bacilosVivos, anaerobios: dso.husosVivos }; ok(!dso.cocosVivos && !dso.bacilosVivos && dso.husosVivos, 'SOD: mueren estafilococos y bacilos; quedan los anaerobios');
    // estómago
    const de0 = de('estomago-sano'); r.estomagoSano = { ph: de0.ph, salmonella: de0.salmonella, lesion: de0.lesion.nivel };
    ok(de0.ph === '1-2' && de0.salmonella === 'muere' && de0.lesion.nivel === 0, 'estómago sano: pH 1-2, Salmonella que muere, sin lesión');
    r.riegoNormalSinLesion = ['nada', 'famotidina', 'pantoprazol', 'sucralfato'].every(p => [false, true].every(en => derivar(estadoDe({ estacion: 'estomago', proteccion: p, enteral: en, vm: true })).lesion.nivel === 0));
    ok(r.riegoNormalSinLesion, 'con el riego normal, ninguna erosión en ninguna combinación');
    const di = de('isquemia'); r.isquemia = { lesion: di.lesion.nombre, riesgo: di.riesgo.nivel, pct: di.riesgo.pct, profilaxis: di.riesgo.profilaxis };
    ok(di.lesion.nivel === 1 && di.riesgo.nivel === 'maximo' && di.riesgo.pct === '8-10 %' && di.riesgo.profilaxis, 'isquemia: erosión; riesgo máximo 8-10 %, profilaxis sí');
    const du = de('ulcera'); r.ulcera = { lesion: du.lesion.nombre, sangra: du.lesion.sangra }; ok(du.lesion.nivel === 2 && du.lesion.sangra, 'úlcera: hasta la submucosa, sangra');
    const dsi = derivar(estadoDe({ ...ESTADOS.ulcera.e, proteccion: 'pantoprazol' })); r.shockConIbp = { nivel: dsi.lesion.nivel, tam: dsi.lesion.tam };
    ok(dsi.lesion.nivel === 2 && dsi.lesion.tam < 1 && dsi.lesion.tam > 0, 'shock con pantoprazol: aparece, más pequeña');
    const dib = de('ibp'); r.ibp = { ph: dib.ph, salmonella: dib.salmonella, balanza: dib.fig46, cdiff: dib.cdiff };
    ok(dib.ph === '≥4' && dib.salmonella === 'crece' && dib.balanza, 'IBP: pH ≥4, la Salmonella crece, balanza');
    ok(+(dib.fig46.placeboSangrado - dib.fig46.pantoSangrado).toFixed(1) === dib.fig46.efecto && dib.fig46.pantoTotal === 21.9 && dib.fig46.placeboTotal === 22.6, 'Fig. 4.6: 4,2 → 2,5 (1,7) y 21,9 frente a 22,6');
    ok(dib.cdiff === '×3 con IBP', 'C. difficile ×3 con IBP');
    const den = de('enteral'); r.enteral = { riesgo: den.riesgo.nivel, pct: den.riesgo.pct, profilaxis: den.riesgo.profilaxis, moco: den.moco, mocoSin: di.moco };
    ok(den.riesgo.nivel === 'moderado' && den.riesgo.pct === '2-4 %' && !den.riesgo.profilaxis && den.moco > di.moco, 'enteral: moderado 2-4 %, sin profilaxis; muralla más gruesa');
    const denI = derivar(estadoDe({ ...ESTADOS.enteral.e, proteccion: 'pantoprazol' })); r.enteralMasIbp = denI.lesion.tam === den.lesion.tam;
    ok(r.enteralMasIbp, 'con enteral completa, el IBP no achica más la lesión');
    const dsu = de('sucralfato'); r.sucralfato = { tapada: dsu.lesion.tapada, ph: dsu.ph }; ok(dsu.lesion.tapada && dsu.ph === '1-2', 'sucralfato: capa sobre la erosión, la acidez sigue');
    ok(derivar(estadoDe({ enteral: true })).sucralfatoBloqueado, 'sucralfato bloqueado con enteral');
    // Tabla 4.2: la regla
    const R = p => riesgoTabla42(estadoDe(p)).nivel;
    r.tabla42 = { corticoidesYAnticoag: R({ corticoides: true, anticoag: true }), dosModerados: R({ vm: true, enteral: true, riego: 'shock' }), coagulopatia: R({ coag: true }), cirrosis: R({ cirrosis: true }), sepsisFra: R({ sepsis: true, fra: true }) };
    ok(r.tabla42.corticoidesYAnticoag === 'bajo' && r.tabla42.dosModerados === 'alto' && r.tabla42.coagulopatia === 'alto' && r.tabla42.cirrosis === 'maximo' && r.tabla42.sepsisFra === 'alto', 'Tabla 4.2: regla de #mar-ulcera-calc');
    r.famotidinaMitad = derivar(estadoDe({ proteccion: 'famotidina', clcr50: true })).famotidinaMitad; ok(r.famotidinaMitad, 'famotidina −50 % con ClCr <50');
    // SDD
    const dsd = de('sdd'); r.sdd = { patogenos: dsd.patogenosIntestino, tiraPat: dsd.tiraPatIntestino, fig45: dsd.fig45 };
    ok(dsd.patogenosIntestino === 0 && dsd.tiraPatIntestino === 0, 'SDD día 7: los patógenos se van');
    ok(dsd.fig45.control === 4.5 && dsd.fig45.sod === 3 && dsd.fig45.sdd === 1.4 && dsd.fig45.caidaSOD === Math.round(100 * (1 - 3 / 4.5)) && dsd.fig45.caidaSDD === 67 && dsd.fig45.caidaSDDbarras === 69, 'Fig. 4.5: 4,5 / 3 / 1,4; −33 % y −67 % (barras: −69 %)');
    r.sddPorDia = [0, 2, 4, 7].map(d => derivar(estadoDe({ ...ESTADOS.sdd.e, dia: d })).patogenosIntestino);
    ok(r.sddPorDia.every((v, i, a) => i === 0 || v <= a[i - 1]) && r.sddPorDia[3] === 0, 'la SDD vacía día a día');
    const dmr = de('multirresistentes'); r.multirresistentes = { patogenos: dmr.patogenosIntestino, halo: dmr.mrHalo, efecto: dmr.sddEfecto };
    ok(dmr.patogenosIntestino > 0 && dmr.mrHalo && !dmr.sddEfecto, 'multirresistentes: bacilos con halo que no caen');
    return r;
}
