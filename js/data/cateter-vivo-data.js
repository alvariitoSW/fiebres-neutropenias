// Catéter vivo: flujo, piel y biopelícula (Libros → Marino → Fundamentos, grupo accesos vasculares, caps. 1-3).
// Datos puros, sin DOM: las cifras de las fichas (cada una con su origen), el estado del modelo y lo que se deriva
// de él, los estados con nombre que abren las fichas (data-cateter-vivo="<estado>"), las láminas del libro, los
// conceptos, la Mayéutica (guía socrática y examen), los casos clínicos y «Para profundizar».
// Viene de la maqueta aprobada autonomo/maquetas/b1-cateter-vivo.html (vuelta 2). Toda la medicina sale de las
// fichas de js/modules/libros/marino-fundamentos.html (ids mar-*) y de
// docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf; el paciente de los casos se inventa.
//
// Esquema de una pregunta (el del río y mar y el capilar):
// { id, tipo: 'test'|'destapa'|'error', grupo: 'guia'|'examen', corto, fuente, estado, despues, mirar, ocultar,
//   tocar: { mandos, ocultar, instruccion, comprobar, pista, bueno, confirma }, enunciado, opciones: [{ t, ok, porque }],
//   puntos: [], frases: [{ t, mal, c }], explicacion, nota }
// `fuente` dice dónde está en el texto: «ficha#elemento · #otro-elemento» (lo enlaza «Ver en el texto»).

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const dec = (n, d = 1) => n.toFixed(d).replace('.', ',');
export const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const copia = o => JSON.parse(JSON.stringify(o));
export const PDF = 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf';

/* ============================================================
   1. Datos (cada cifra con su origen)
   ============================================================ */
// Banco 1 · Fig. 1.1 (mL/min, agua por gravedad; la figura no dice la altura de la bolsa)
export const FIG = { calibre: { 16: 220, 18: 105, 20: 60 }, longitud: { 2: 151, 6: 91, 12: 54 } };
export const FIG_TABLA_1_1 = { 16: { fr: 5, mm: 1.7 }, 18: { fr: 4, mm: 1.2 }, 20: { fr: 3, mm: 0.9 } };   // Tabla 1.1
export const FIG_LARGO_CALIBRE = 1.2;   // pulgadas (los tres calibres)
// Banco 2 · Tablas 1.2-1.3 (L/h, agua por gravedad desde 40 pulgadas)
export const CAT = {
    pc: { nombre: 'Periférico corto', sub: '18 G · 3 cm', lh: 6.0, cm: 3, mm: 1.2, tabla: 'mar-tabla-1-2', g: '18 G', fr: '18 G = 4 Fr = 1,2 mm (Tabla 1.1)', fig: 'f1-2' },
    pl: { nombre: 'Periférico largo', sub: '18 G · 8 cm', lh: 3.7, cm: 8, mm: 1.2, tabla: 'mar-tabla-1-2', g: '18 G', fr: '18 G = 4 Fr = 1,2 mm (Tabla 1.1)' },
    midline: { nombre: 'Midline', sub: '15 cm · por luz', lh: 1.3, cm: 15, mm: 1.82, tabla: 'mar-tabla-1-2', g: '18 G', fr: '5,5 Fr × 0,33 = 1,82 mm (ecuación) · luces 18 G', fig: 'f1-3' },
    'picc-d': { nombre: 'PICC · distal', sub: '50 cm · 18 G', lh: 0.26, cm: 50, mm: 1.82, tabla: 'mar-tabla-1-3', g: '18 G', fr: '5,5 Fr × 0,33 = 1,82 mm (ecuación) · luz 18 G' },
    'picc-p': { nombre: 'PICC · proximal', sub: '50 cm · 18 G', lh: 0.27, cm: 50, mm: 1.82, tabla: 'mar-tabla-1-3', g: '18 G', fr: '5,5 Fr × 0,33 = 1,82 mm (ecuación) · luz 18 G' },
    'cvc-d': { nombre: 'CVC · luz distal', sub: '20 cm · 16 G', lh: 2.28, cm: 20, mm: 2.4, tabla: 'mar-tabla-1-3', g: '16 G', fr: '7 Fr: 2,31 mm (ecuación) o 2,4 (tabla) · luz 16 G', luz: 'distal', fig: 'f1-4' },
    'cvc-m': { nombre: 'CVC · luz medial', sub: '20 cm · 18 G', lh: 0.91, cm: 20, mm: 2.4, tabla: 'mar-tabla-1-3', g: '18 G', fr: '7 Fr: 2,31 mm (ecuación) o 2,4 (tabla) · luz 18 G', luz: 'medial', fig: 'f1-4' },
    'cvc-p': { nombre: 'CVC · luz proximal', sub: '20 cm · 18 G', lh: 0.99, cm: 20, mm: 2.4, tabla: 'mar-tabla-1-3', g: '18 G', fr: '7 Fr: 2,31 mm (ecuación) o 2,4 (tabla) · luz 18 G', luz: 'proximal', fig: 'f1-4' },
    rapido: { nombre: 'Infusión rápida', sub: '7-8 Fr · 2-2,5″', lh: null, cm: 5.7, mm: 2.47, tabla: 'mar-bombas', g: '—', fr: '7-8 Fr = 2,31-2,64 mm (ecuación)', rapido: true }
};
export const ORDEN_CAT = ['pc', 'pl', 'midline', 'picc-d', 'picc-p', 'cvc-d', 'cvc-m', 'cvc-p', 'rapido'];
export const ALTURA = { 0: 0, 68: 50, 100: 75 };            // cm → mmHg (mar-altura-bolsa)
export const BOMBAS = {
    gravedad: { nombre: 'gravedad' },
    volumetrica: { nombre: 'bomba volumétrica', max: 1000, unidad: 'mL/h', rango: '0,1-1.000 mL/h', bolsa: '1 L' },
    jeringa: { nombre: 'bomba de jeringa', max: 100, unidad: 'mL/h', rango: '0,1-100 mL/h', bolsa: 'hasta 100 mL' },
    infusor: { nombre: 'infusor rápido', max: 1.5, unidad: 'L/min', rango: 'hasta 1,5 L/min, calentado' }
};
export const IO = { relPeriferica: 0.25, presionMedula: 30, aguja: '15 G' };   // mar-io-flujo, mar-io-aguja
export const AIRE = { tasa: 100, calibre: '14 G', gradiente: 5, letal: [200, 300], letalKg: [3, 5], peso: 70 };   // mar-aire-fisio (peso: ilustrativo)
export const BIO = { visible: 24, clinica: 48, factorAntibiotico: '100 a 1.000' };   // mar-biofilm, mar-bac-clinica
export const HC = { umbralH: 2, exactitudTiempo: 91, umbralRazon: 3, exactitudCuant: 94, horaCateter: 10, difCaso: 2.5 };   // mar-tabla-3-4 (horaCateter: ilustrativo; difCaso: del caso)
export const OCLUSIONES = {
    trombo: { nombre: 'Trombo', sub: '60 %', resuelve: ['alteplasa'] },
    alcalino: { nombre: 'Precipitado alcalino', sub: 'aciclovir, fenitoína…', resuelve: ['bicarbonato', 'naoh'] },
    acido: { nombre: 'Precipitado ácido', sub: 'ceftriaxona, vancomicina…', resuelve: ['hcl', 'cisteina'] },
    mineral: { nombre: 'Precipitado mineral', sub: 'NPT con Ca²⁺ y PO₄', resuelve: ['naoh', 'cisteina'] },
    lipidos: { nombre: 'Lípidos o proteínas', sub: 'NPT, propofol', resuelve: ['etanol', 'naoh'] }
};
export const INSTILAR = {
    guia: { nombre: 'Pasar una guía' },
    alteplasa: { nombre: 'Alteplasa 2 mg', sub: '30 y 120 min' },
    bicarbonato: { nombre: 'Bicarbonato 8,4 %' },
    naoh: { nombre: 'NaOH 0,1 N' },
    hcl: { nombre: 'HCl 0,1 N' },
    cisteina: { nombre: 'L-cisteína', sub: '50 mg/mL' },
    etanol: { nombre: 'Etanol 70 %' }
};
export const PUNTAS = {
    yugular: { nombre: 'Subió a la yugular', ok: false },
    'vcs-alta': { nombre: 'Cava superior, algo por encima de la carina', ok: true },
    carina: { nombre: 'A la altura de la carina', ok: true },
    auricula: { nombre: 'En la aurícula derecha', ok: null }
};
export const ORDEN_PUNTA = ['yugular', 'vcs-alta', 'carina', 'auricula'];

export function estadoBase() {
    return {
        lupa: 'A', banco: 'fig', figExp: 'calibre', figCal: 16, figLong: 2, cat: 'pc', vena: 'pequena', altura: 100, bomba: 'gravedad', io: false,
        tiempo: 0, paquete: { manos: false, barreras: false, clorhex: false, femoral: false }, aposito: 'transparente', zoomB: 'vias',
        antibiotico: false, manejo: null, hcIncubado: false, problema: 'biopelicula', oclusion: null, instilado: null,
        punta: 'carina', izquierdo: false, aire: { postura: 'espontanea', abierto: false },
        eco: { eje: 'corto', comprimir: false, trombosada: false, doppler: false, girada: false, aguja: false }
    };
}

// El catéter que se dibuja (longitud en cm, grosor en mm) y su texto French ↔ gauge
export function catDe(e) {
    if (e.io) return { nombre: 'Aguja intraósea', cm: 2.5, mm: 1.8, g: '15 G', fr: 'aguja de 15 G y 25 mm; su grosor dibujado, ilustrativo', io: true };
    if (e.banco === 'fig') {
        const g = e.figExp === 'calibre' ? e.figCal : 16, pulg = e.figExp === 'calibre' ? FIG_LARGO_CALIBRE : e.figLong, t = FIG_TABLA_1_1[g];
        return { nombre: `${g} G · ${dec(pulg, pulg % 1 ? 1 : 0)}″`, cm: pulg * 2.54, mm: t.mm, g: g + ' G', fr: `${g} G = ${t.fr} Fr = ${dec(t.mm)} mm (Tabla 1.1)` };
    }
    return { ...CAT[e.cat] };
}
export const resuelta = e => !!(e.oclusion && e.instilado && OCLUSIONES[e.oclusion].resuelve.includes(e.instilado));

/* Lo derivado de un estado: la cifra que se ve, su origen y la velocidad de la animación (0-1, dentro de su banco) */
export function derivar(e) {
    const D = { valor: null, unidad: '', texto: '', org: '', ilu: false, rel: 0, presion: null, avisos: [], ocluido: false, alarma: false, cat: catDe(e), grav: null };
    // 1. Por gravedad, en su banco
    if (e.io) {
        D.grav = { rel: IO.relPeriferica, texto: '25 %', unidad: 'de una periférica', org: 'ficha · mar-io-flujo' };
    } else if (e.banco === 'fig') {
        const v = e.figExp === 'calibre' ? FIG.calibre[e.figCal] : FIG.longitud[e.figLong];
        D.grav = { valor: v, unidad: 'mL/min', texto: String(v), rel: v / 220, org: `ficha · ${e.figExp === 'calibre' ? 'mar-fig-1-1-calibre' : 'mar-fig-1-1-longitud'} (Fig. 1.1)` };
    } else {
        const c = CAT[e.cat];
        if (c.lh == null) D.grav = { valor: null, unidad: 'L/h', texto: 'sin cifra', rel: 0.5, org: 'ficha · mar-bombas (sin flujo por gravedad)', ilu: true };
        else {
            const f = ALTURA[e.altura] / 75, v = +(c.lh * f).toFixed(2);
            D.grav = { valor: v, unidad: 'L/h', texto: dec(v, v < 1 ? 2 : 1), rel: v / 6, org: `ficha · ${c.tabla}` + (e.altura === 68 ? ' · calculado × 50/75 (Q ∝ ΔP) · mar-poiseuille' : e.altura === 0 ? ' · sin gradiente, sin flujo · mar-poiseuille' : '') };
        }
        D.presion = ALTURA[e.altura];
    }
    // 2. Lo que se infunde de verdad: gravedad o bomba
    const B = BOMBAS[e.bomba];
    if (e.bomba === 'gravedad') Object.assign(D, D.grav);
    else if (e.bomba === 'infusor') {
        if (D.cat.rapido) Object.assign(D, { valor: 1.5, unidad: 'L/min', texto: 'hasta 1,5', rel: 1, org: 'ficha · mar-bombas' });
        else { Object.assign(D, { valor: null, unidad: 'L/min', texto: 'sin cifra', rel: e.io ? 0.25 : 0.4, org: 'ficha · mar-bombas', ilu: true }); D.avisos.push(`El infusor rápido pide un catéter de infusión rápida (7-8 Fr, 2-2,5″). Con ${e.io ? 'la intraósea' : 'este catéter'}, la ficha no da cifra.`); }
    } else {
        const relB = e.banco === 'fig' && !e.io ? (B.max / 60) / 220 : (B.max / 1000) / 6;   // solo la velocidad del dibujo, dentro del banco
        Object.assign(D, { valor: B.max, unidad: B.unidad, texto: '≤ ' + fmt(B.max), rel: Math.max(0.03, Math.min(relB, (D.grav.rel || 0) * 3 + 0.02)), org: 'ficha · mar-bombas' });
    }
    if (e.io) { D.presion = null; D.presionMedula = IO.presionMedula; }
    // 3. Oclusión
    if (e.oclusion && !resuelta(e)) { D.ocluido = true; D.alarma = e.bomba !== 'gravedad'; D.rel = 0; D.valor = 0; D.texto = '0'; D.org = 'ficha · mar-oclusion-causas'; D.ilu = false; }
    if (e.instilado === 'guia' && e.oclusion) D.avisos.push('Pasar una guía no se aconseja: puede soltar la masa y embolizarla.');
    // 4. Lupa B · biopelícula y colonización (todo cualitativo salvo las marcas de 24 h y 48 h)
    const cerradas = ['manos', 'barreras', 'clorhex'].filter(k => e.paquete[k]).length;   // evitar la femoral no cierra una puerta de la piel (p. 25 y 32-33: hoy, por la trombosis)
    D.bio = {
        nivel: e.tiempo >= 336 ? 4 : e.tiempo >= 168 ? 3 : e.tiempo >= 48 ? 2 : e.tiempo >= 24 ? 1 : 0,
        visible: e.tiempo >= BIO.visible, clinicaPosible: e.tiempo >= BIO.clinica,
        puertasCerradas: cerradas,
        piel: e.manejo === 'retirar' ? 0 : clamp(Math.round((e.tiempo ? 2 + Math.min(4, e.tiempo / 48) : 0) * (1 - cerradas * 0.18) * ({ humedo: 1.6, esponja: 0.55 }[e.aposito] || 1)), 0, 9)
    };
    // 5. Hemocultivos (tiempo diferencial de la Tabla 3.4)
    D.hc = { cateter: HC.horaCateter, periferico: HC.horaCateter + HC.difCaso, dif: HC.difCaso, fuenteCateter: HC.difCaso >= HC.umbralH };
    // 6. Lupa C · aire y punta
    // Trendelenburg sube la presión venosa y REDUCE el riesgo (el libro no da cuánto); el femoral no entra en el tórax: sin aire
    D.aire = { tasa: e.aire.postura === 'espontanea' ? AIRE.tasa : e.aire.postura === 'trendelenburg' ? null : 0, reducido: e.aire.postura === 'trendelenburg', letal: AIRE.letal, letalKg: AIRE.letalKg.map(x => x * AIRE.peso), segundosHastaLetal: AIRE.letal.map(x => x / AIRE.tasa) };
    D.punta = e.izquierdo ? { nombre: 'Catéter izquierdo contra la pared de la cava', ok: false } : PUNTAS[e.punta];
    // 7. Lupa D · eco
    const E = e.eco;
    D.eco = { venaColapsa: E.comprimir && !E.trombosada, arteriaColapsa: false, colorVena: E.doppler ? (E.girada ? 'rojo' : 'azul') : null, colorArteria: E.doppler ? (E.girada ? 'azul' : 'rojo') : null, arteriaVisible: E.eje === 'corto', aguja: E.aguja ? (E.eje === 'corto' ? 'punto' : 'linea') : null };
    return D;
}

export function estadoDe(parcial) {
    const e = estadoBase(), p = copia(parcial || {});
    for (const [k, v] of Object.entries(p)) e[k] = v && typeof v === 'object' && !Array.isArray(v) && e[k] && typeof e[k] === 'object' ? Object.assign(e[k], v) : v;
    return e;
}

export const FIGS = {
    'f1-1': { src: 'mar-fig1-1-flujo-calibre-longitud.jpg', n: 'Fig. 1.1', pie: 'Fig. 1.1 — Flujo de agua por gravedad según el calibre (catéteres de 1,2″) y la longitud (16 G). Datos de dos estudios (refs. 4 y 5 del libro, uno por panel): 220/105/60 y 151/91/54 mL/min.', pag: 5, midio: true },
    'f1-2': { src: 'mar-fig1-2-cateter-sobre-aguja.jpg', n: 'Fig. 1.2', pie: 'Fig. 1.2 — Catéter sobre aguja para venas periféricas superficiales.', pag: 6 },
    'f1-3': { src: 'mar-fig1-3-venas-brazo-midline.jpg', n: 'Fig. 1.3', pie: 'Fig. 1.3 — Venas del brazo, con un midline en la basílica (la preferida).', pag: 8 },
    'f1-4': { src: 'mar-fig1-4-cvc-triple-luz.jpg', n: 'Fig. 1.4', pie: 'Fig. 1.4 — CVC de triple luz (7 Fr): distal 16 G, medial y proximal 18 G, y dónde sale cada una.', pag: 10 },
    'f1-5': { src: 'mar-fig1-5-seldinger.jpg', n: 'Fig. 1.5', pie: 'Fig. 1.5 — Técnica de Seldinger.', pag: 12 },
    'f1-10': { src: 'mar-fig1-10-intraosea-tibia.jpg', n: 'Fig. 1.10', pie: 'Fig. 1.10 — Aguja IO en la tibia proximal, 3 cm bajo la rótula y 2 cm medial. (El pie del libro dice «fémur»: errata; se sigue el texto.)', pag: 19 },
    'f3-2': { src: 'mar-fig3-2-vias-colonizacion.jpg', n: 'Fig. 3.2', pie: 'Fig. 3.2 — Las cuatro fuentes de colonización del catéter. La lupa B la recrea con los mismos números.', pag: 47 },
    'f3-3': { src: 'mar-fig3-3-biofilm.jpg', n: 'Fig. 3.3', pie: 'Fig. 3.3 — Staphylococcus epidermidis envuelto en una biopelícula (microscopía electrónica, coloreada).', pag: 48 },
    'f3-4': { src: 'mar-fig3-4-placas-cultivo.jpg', n: 'Fig. 3.4', pie: 'Fig. 3.4 — Crecimiento mucho más denso en la sangre del catéter que en la periférica.', pag: 49 },
    'f2-5': { src: 'mar-fig2-5-neumotorax-rx-tc.jpg', n: 'Fig. 2.5', pie: 'Fig. 2.5 — La radiografía portátil no ve el neumotórax anterior que enseña la TC.', pag: 35 },
    'f2-6': { src: 'mar-fig2-6-punta-carina.jpg', n: 'Fig. 2.6', pie: 'Fig. 2.6 — CVC bien colocado: la punta a la altura de la carina, justo encima de la unión cava-aurícula.', pag: 36 },
    'f3-1': { src: 'mar-fig3-1-perforacion-vcs.jpg', n: 'Fig. 3.1', pie: 'Fig. 3.1 — Catéter subclavio con la punta contra la pared de la cava superior; abajo, uno que la ha perforado (derrame).', pag: 46 },
    'f1-6': { src: 'mar-fig1-6-eje-largo-corto.jpg', n: 'Fig. 1.6', pie: 'Fig. 1.6 — Eje largo y eje corto: la aguja entera o solo un punto.', pag: 14 },
    'f1-7': { src: 'mar-fig1-7-compresion-yugular.jpg', n: 'Fig. 1.7', pie: 'Fig. 1.7 — Al comprimir, la yugular se colapsa y la carótida no.', pag: 15 },
    'f1-8': { src: 'mar-fig1-8-doppler-femoral.jpg', n: 'Fig. 1.8', pie: 'Fig. 1.8 — Arteria y vena femorales con Doppler color: aquí la arteria sale roja y la vena azul (el color depende de la dirección respecto a la sonda).', pag: 15 },
    'f1-9': { src: 'mar-fig1-9-guia-cateter-eco.jpg', n: 'Fig. 1.9', pie: 'Fig. 1.9 — Eje largo de la yugular: primero la guía, después el catéter, dentro de la luz.', pag: 15 },
    'f2-2': { src: 'mar-fig2-2-eco-yugular.jpg', n: 'Fig. 2.2', pie: 'Fig. 2.2 — Eje corto de la yugular interna y la carótida.', pag: 27 },
    'f2-3': { src: 'mar-fig2-3-eco-subclavia.jpg', n: 'Fig. 2.3', pie: 'Fig. 2.3 — Vista infraclavicular de la subclavia, con la pleura muy cerca.', pag: 30 }
};
export const TIRA = { A: ['f1-1', 'f1-2', 'f1-3', 'f1-4', 'f1-5', 'f1-10'], B: ['f3-2', 'f3-3', 'f3-4'], C: ['f2-6', 'f3-1', 'f2-5'], D: ['f1-6', 'f1-7', 'f1-8', 'f1-9', 'f2-2', 'f2-3'] };

export const ESTADOS = {
    calibre: { e: { banco: 'fig', figExp: 'calibre', figCal: 16 }, cifra: d => d.valor === 220 && d.unidad === 'mL/min' },
    longitud: { e: { banco: 'fig', figExp: 'longitud', figLong: 6 }, cifra: d => d.valor === 91 },
    altura: { e: { banco: 'tablas', cat: 'pc', altura: 68 }, cifra: d => d.valor === 4 && d.presion === 50 },
    catalogo: { e: { banco: 'tablas', cat: 'picc-d' }, cifra: d => d.valor === 0.26 && d.unidad === 'L/h' },
    'cvc-luces': { e: { banco: 'tablas', cat: 'cvc-d' }, cifra: d => d.valor === 2.28 },
    infusor: { e: { banco: 'tablas', cat: 'rapido', bomba: 'infusor' }, cifra: d => d.valor === 1.5 && d.unidad === 'L/min' },
    intraosea: { e: { io: true }, cifra: d => d.rel === 0.25 && d.presionMedula === 30 },
    'oclusion-trombo': { e: { banco: 'tablas', cat: 'picc-d', bomba: 'volumetrica', oclusion: 'trombo', problema: 'oclusion' }, cifra: d => d.ocluido && d.alarma },
    'oclusion-precipitado': { e: { banco: 'tablas', cat: 'picc-d', bomba: 'volumetrica', oclusion: 'mineral', problema: 'oclusion' }, cifra: d => d.ocluido },
    colonizacion: { e: { lupa: 'B', zoomB: 'vias', tiempo: 48 }, cifra: d => d.bio.clinicaPosible },
    biopelicula: { e: { lupa: 'B', zoomB: 'punta', tiempo: 24 }, cifra: d => d.bio.visible && !d.bio.clinicaPosible },
    'aposito-humedo': { e: { lupa: 'B', zoomB: 'vias', tiempo: 48, aposito: 'humedo' }, cifra: d => d.bio.piel > derivar(estadoDe({ lupa: 'B', tiempo: 48 })).bio.piel },
    hemocultivos: { e: { lupa: 'B', zoomB: 'frascos', problema: 'hemocultivos', hcIncubado: true }, cifra: d => d.hc.dif === 2.5 && d.hc.fuenteCateter },
    'recambio-guia': { e: { lupa: 'B', zoomB: 'vias', tiempo: 168, manejo: 'guia', problema: 'biopelicula' }, cifra: d => d.bio.nivel >= 1 },
    punta: { e: { lupa: 'C', punta: 'carina', problema: 'aire' }, cifra: d => d.punta.ok === true },
    'punta-izquierda': { e: { lupa: 'C', izquierdo: true, problema: 'aire' }, cifra: d => d.punta.ok === false },
    aire: { e: { lupa: 'C', aire: { postura: 'espontanea', abierto: true }, problema: 'aire' }, cifra: d => d.aire.tasa === 100 },
    trendelenburg: { e: { lupa: 'C', aire: { postura: 'trendelenburg', abierto: true }, problema: 'aire' }, cifra: d => d.aire.reducido && d.aire.tasa === null },
    'eco-eje-corto': { e: { lupa: 'D', eco: { eje: 'corto', aguja: true } }, cifra: d => d.eco.aguja === 'punto' && d.eco.arteriaVisible },
    'eco-eje-largo': { e: { lupa: 'D', eco: { eje: 'largo', aguja: true } }, cifra: d => d.eco.aguja === 'linea' && !d.eco.arteriaVisible },
    'eco-compresion': { e: { lupa: 'D', eco: { comprimir: true } }, cifra: d => d.eco.venaColapsa && !d.eco.arteriaColapsa },
    'eco-doppler': { e: { lupa: 'D', eco: { doppler: true } }, cifra: d => d.eco.colorArteria === 'rojo' && d.eco.colorVena === 'azul' }
};
export const FICHAS_ESTADO = [
    ['I · Catéteres y flujo', 'mar-cateteres-flujo', ['calibre', 'longitud', 'altura', 'infusor']],
    ['II · Periféricos y centrales', 'mar-tipos-cateter', ['catalogo', 'cvc-luces']],
    ['III · Eco e intraósea', 'mar-eco-intraosea', ['intraosea', 'eco-eje-corto', 'eco-eje-largo', 'eco-compresion', 'eco-doppler']],
    ['IV · CVC: indicaciones y sitio', 'mar-cvc-sitios', ['colonizacion']],
    ['V · Aire, neumotórax y punta', 'mar-cvc-complicaciones', ['aire', 'trendelenburg', 'punta']],
    ['VI · El catéter que se queda', 'mar-cateter-cuidados', ['aposito-humedo', 'oclusion-trombo', 'oclusion-precipitado', 'punta-izquierda']],
    ['VII · Bacteriemia por catéter', 'mar-bacteriemia-cateter', ['colonizacion', 'biopelicula', 'hemocultivos', 'recambio-guia']],
    ['VIII · Microbioma (solo la vía 4)', 'mar-microbioma', ['colonizacion']]
];
export const NOMBRE_ESTADO = { calibre: 'Calibre', longitud: 'Longitud', altura: 'Altura de la bolsa', catalogo: 'Catálogo (PICC)', 'cvc-luces': 'Luces del CVC', infusor: 'Infusor rápido',
    intraosea: 'Intraósea', 'oclusion-trombo': 'Oclusión: trombo', 'oclusion-precipitado': 'Oclusión: precipitado', colonizacion: 'Las 4 vías', biopelicula: 'Biopelícula',
    'aposito-humedo': 'Apósito húmedo', hemocultivos: 'Hemocultivos', 'recambio-guia': 'Recambio sobre guía', punta: 'La punta', 'punta-izquierda': 'Catéter izquierdo',
    aire: 'Conector abierto', trendelenburg: 'Trendelenburg', 'eco-eje-corto': 'Eco: eje corto', 'eco-eje-largo': 'Eco: eje largo', 'eco-compresion': 'Eco: comprimir', 'eco-doppler': 'Eco: Doppler' };

/* ============================================================
   La explicación guiada de cada estado con nombre (REGLAS §7.10; core/explicacion-guiada.js): 3-5 pasos cortos que
   se leen uno a uno. Cada paso: { t, resalta (lo que se señala en el dibujo), mirar (el anillo del modelo), e (cómo
   cambia el catéter en ese paso, sobre el estado), cita (core/citas.js: ficha, párrafo, página del PDF), org }.
   Todo sale de las fichas de marino-fundamentos.html; cada paso con su página del PDF.
   ============================================================ */
const CI = (ficha, id, pag) => ({ libro: 'Marino, cap. ' + ({ 'mar-cateteres-flujo': 1, 'mar-tipos-cateter': 1, 'mar-eco-intraosea': 1, 'mar-cvc-sitios': 2, 'mar-cvc-complicaciones': 2, 'mar-cateter-cuidados': 3, 'mar-bacteriemia-cateter': 3 }[ficha] || 1), ficha, id, pag, pdf: PDF });
const FLU = (id, pag) => CI('mar-cateteres-flujo', id, pag), TIP = (id, pag) => CI('mar-tipos-cateter', id, pag), ECO = (id, pag) => CI('mar-eco-intraosea', id, pag);
const SIT = (id, pag) => CI('mar-cvc-sitios', id, pag), COM = (id, pag) => CI('mar-cvc-complicaciones', id, pag), CUI = (id, pag) => CI('mar-cateter-cuidados', id, pag), BAC = (id, pag) => CI('mar-bacteriemia-cateter', id, pag);
const LB = sel => '#ctv-lupaB ' + sel, LC = sel => '#ctv-lupaC ' + sel, LD = sel => '#ctv-lupaD ' + sel;
export const GUIAS = {
    calibre: [
        { t: 'La Fig. 1.1: agua por gravedad a través de catéteres de la misma longitud. Con un 16 G, la probeta se llena a <span class="hl">220 mL/min</span>.', resalta: '#ctv-g-probeta', cita: FLU('mar-fig-1-1-calibre', 4) },
        { t: 'Cambia a un 20 G: solo <span class="hl-rojo">60 mL/min</span>. El 16 G pasa más del doble que el 18 G (105) y casi cuatro veces más que el 20 G, con menos de 1 mm de diferencia de diámetro.', e: { figCal: 20 }, resalta: ['#ctv-g-cat-brazo', '#ctv-g-probeta'], cita: [FLU('mar-calibre-radio', 4), FLU('mar-tabla-1-1', 3)] },
        { t: 'El porqué es la ecuación de Hagen-Poiseuille: el flujo es proporcional a la <span class="hl-azul">cuarta potencia del radio</span> (r⁴). El radio es lo que más pesa.', resalta: '#ctv-g-cat-brazo', cita: FLU('mar-poiseuille', '3-4') },
        { t: 'Para infundir rápido: un catéter de gran calibre; y mejor aún, corto y de gran calibre.', resalta: '#ctv-g-cat-brazo', cita: FLU('mar-corto-grueso', 4) },
    ],
    longitud: [
        { t: 'El mismo 16 G, con distinta longitud (Fig. 1.1, derecha). Un periférico mide unas 2 pulgadas: 151 mL/min.', e: { figLong: 2 }, resalta: '#ctv-g-cat-brazo', cita: FLU('mar-fig-1-1-longitud', 4) },
        { t: 'A 6 pulgadas, la longitud habitual de un catéter central: <span class="hl-rojo">91 mL/min</span>, un 40 % menos.', resalta: ['#ctv-g-cat-brazo', '#ctv-g-probeta'], cita: FLU('mar-longitud-flujo', 4) },
        { t: 'A 12 pulgadas, otro 40 % menos: 54 mL/min. En Hagen-Poiseuille la longitud divide: el flujo es inversamente proporcional a L.', e: { figLong: 12 }, resalta: '#ctv-g-probeta', cita: [FLU('mar-longitud-flujo', 4), FLU('mar-poiseuille', '3-4')] },
        { t: 'Por eso, para correr: <span class="hl">corto y de gran calibre</span>.', e: { figLong: 2 }, resalta: '#ctv-g-cat-brazo', cita: FLU('mar-corto-grueso', 4) },
    ],
    altura: [
        { t: 'Por gravedad, la resistencia del catéter se vence subiendo el gradiente de presión (el ΔP de la ecuación): subiendo la bolsa sobre el punto de punción.', resalta: '#ctv-g-bolsa', cita: FLU('mar-altura-bolsa', 5) },
        { t: 'A 100 cm la presión de infusión es de 75 mmHg: el periférico corto da los <span class="hl">6,0 L/h</span> de la Tabla 1.2.', e: { altura: 100 }, resalta: ['#ctv-g-regla', '#ctv-g-probeta'], cita: [FLU('mar-altura-bolsa', 5), TIP('mar-tabla-1-2', 8)] },
        { t: 'A 68 cm, 50 mmHg: el flujo cae en la misma proporción, × 50/75, a unos 4 L/h. Es un cálculo del modelo con la ecuación, no una cifra de la tabla.', resalta: ['#ctv-g-bolsa', '#ctv-lectura'], cita: [FLU('mar-altura-bolsa', 5), FLU('mar-poiseuille', '3-4')], org: '4 L/h: calculado' },
        { t: 'Con la bolsa a la altura del brazo no hay gradiente: no hay flujo.', e: { altura: 0 }, resalta: '#ctv-g-bolsa', cita: FLU('mar-poiseuille', '3-4') },
    ],
    catalogo: [
        { t: 'El PICC es una versión más larga del midline: entra por las mismas venas del brazo, pero llega a la cava superior. El más usado, de doble luz y 50 cm.', resalta: '#ctv-g-cat-brazo', cita: TIP('mar-picc', 9) },
        { t: 'Su luz distal da solo <span class="hl-rojo">0,26 L/h</span> por gravedad (Tabla 1.3).', resalta: ['#ctv-g-probeta', '#ctv-lectura'], cita: TIP('mar-tabla-1-3', 9) },
        { t: 'El midline, de 15 cm, da 1,3 L/h por luz: el PICC mide más del triple y su flujo es solo un 20 % del del midline.', e: { cat: 'midline' }, resalta: '#ctv-g-cat-brazo', cita: [TIP('mar-tabla-1-2', 8), TIP('mar-picc', 9)] },
        { t: 'Ese flujo comprometido podría explicar su tasa relativamente alta de oclusiones. La Tabla 1.4 lo resume: la longitud del PICC puede limitar el ritmo de infusión.', resalta: '#ctv-g-cat-brazo', cita: [TIP('mar-picc', 9), TIP('mar-tabla-1-4', 11)] },
    ],
    'cvc-luces': [
        { t: 'El CVC más usado es el de triple luz (7 Fr, 20 cm). Las tres luces salen en el extremo, a distinta altura.', resalta: '#ctv-g-cat-brazo', cita: TIP('mar-cvc-triple', '9-10') },
        { t: 'La luz distal es más gruesa, de 16 G: <span class="hl">2,28 L/h</span> (Tabla 1.3).', resalta: ['#ctv-g-probeta', '#ctv-lectura'], cita: TIP('mar-tabla-1-3', 9) },
        { t: 'La medial y la proximal son de 18 G: 0,91 y 0,99 L/h. La distal da más del doble.', e: { cat: 'cvc-m' }, resalta: '#ctv-g-probeta', cita: [TIP('mar-tabla-1-3', 9), TIP('mar-cvc-triple', 9)] },
        { t: 'Por eso la luz distal es la mejor para infundir <span class="hl">volumen rápido</span>.', e: { cat: 'cvc-d' }, resalta: '#ctv-g-cat-brazo', cita: TIP('mar-cvc-triple', 9) },
    ],
    infusor: [
        { t: 'Las bombas ajustan la presión (hasta 15 psi) para dar el ritmo programado. Una volumétrica no pasa de 1.000 mL/h: sirve para dosificar.', e: { bomba: 'volumetrica', cat: 'pc' }, resalta: '#ctv-g-bomba', cita: FLU('mar-bombas', 5) },
        { t: 'Para la hemorragia masiva están los infusores rápidos: fluidos o hemoderivados calientes, <span class="hl">hasta 1,5 L/min</span>.', resalta: ['#ctv-g-bomba', '#ctv-lectura'], cita: FLU('mar-bombas', 5) },
        { t: 'Piden su catéter: el «de infusión rápida», de 7-8 Fr y 2-2,5 pulgadas de largo. Corto y grueso, como dice Hagen-Poiseuille.', resalta: '#ctv-g-cat-brazo', cita: [FLU('mar-bombas', 5), FLU('mar-corto-grueso', 4)] },
    ],
    intraosea: [
        { t: 'La vía intraósea es el acceso urgente cuando la IV es difícil o no está al momento: parada, trauma grave o shock.', resalta: '#ctv-g-hueso', cita: ECO('mar-io-indicaciones', 17) },
        { t: 'Su ventaja: la cavidad medular es rígida y <span class="hl">no se colapsa</span> con la hipotensión o la hipovolemia, a diferencia de las venas.', resalta: '#ctv-g-hueso', cita: ECO('mar-io-indicaciones', 17) },
        { t: 'Pero el flujo es lento: <span class="hl-rojo">un 25 % del de una vía periférica</span>, por la viscosidad de la médula y la presión de la cavidad (unos 30 mmHg).', resalta: '#ctv-g-probeta', cita: ECO('mar-io-flujo', 20) },
        { t: 'Por eso se presuriza siempre, con bomba o manguito; aun así, 300 mmHg o más pueden no bastar en una hemorragia masiva, y algunos proponen dos vías IO.', resalta: '#ctv-g-cat-brazo', cita: ECO('mar-io-flujo', 20) },
    ],
    'oclusion-trombo': [
        { t: 'Un PICC con bomba volumétrica que deja de pasar. La causa más frecuente de oclusión es un <span class="hl-rojo">trombo</span> (60 %).', resalta: '#ctv-g-oclusion', cita: CUI('mar-oclusion-causas', 42) },
        { t: 'Se nota como flujo lento o nulo, o alarmas frecuentes de la bomba por presión excesiva; cuesta o no se puede aspirar sangre.', resalta: '#ctv-g-bomba', cita: CUI('mar-oclusion-causas', 42) },
        { t: 'No pasar una guía para desatascarlo: puede soltar la masa y embolizarla. Lo estándar es disolverla químicamente.', resalta: '#ctv-g-oclusion', cita: CUI('mar-permeabilidad', 42) },
        { t: 'Alteplasa 2 mg (2 mL) en la luz: esperar 30 min y, si sigue ocluido, otros 90. Recupera el <span class="hl">80-90 %</span> de los catéteres.', e: { instilado: 'alteplasa' }, resalta: '#ctv-g-cat-brazo', cita: [CUI('mar-alteplasa', '42-43'), CUI('mar-alteplasa-eficacia', 42)] },
    ],
    'oclusion-precipitado': [
        { t: 'Otro PICC ocluido, esta vez por un precipitado mineral: nutrición parenteral rica en Ca²⁺ y PO₄.', resalta: '#ctv-g-oclusion', cita: CUI('mar-tabla-3-3', 43) },
        { t: 'Si la alteplasa no funciona, hay que pensar en las causas no trombóticas: qué pasaba por esa luz (Tabla 3.3).', e: { instilado: 'alteplasa' }, resalta: '#ctv-g-oclusion', cita: CUI('mar-alteplasa', 43) },
        { t: 'La regla: lo alcalino se disuelve con un álcali, lo ácido con un ácido y los lípidos con etanol. Para el mineral, NaOH 0,1 N de primera elección.', e: { instilado: 'naoh' }, resalta: '#ctv-g-cat-brazo', cita: [CUI('mar-oclusion-regla', 43), CUI('mar-tabla-3-3', 43)] },
    ],
    colonizacion: [
        { t: 'La Fig. 3.2: cuatro vías por las que el germen llega al catéter. La 1, la infusión contaminada (p. ej., hemoderivados), es rara.', resalta: LB('[data-g="n1"]'), cita: BAC('mar-bac-vias', '46-47') },
        { t: 'La 2, la luz interna, por puntos de rotura como los conectores: quizá destacada en los tunelizados.', resalta: LB('[data-g="n2"]'), cita: BAC('mar-bac-vias', '46-47') },
        { t: 'La 3, la piel, que migra por el trayecto subcutáneo: la <span class="hl-rojo">vía principal</span> en los percutáneos no tunelizados, la mayoría en la UCI. Arriba, las tres medidas del paquete de inserción (manos, barreras, clorhexidina): juntas han reducido las bacteriemias.', resalta: [LB('[data-g="n3"]'), LB('[data-g="puertas"]')], cita: [BAC('mar-bac-vias', '46-47'), SIT('mar-paquete-efecto', 24)], org: 'cuántos cocos: ilustrativo' },
        { t: 'La 4, la sangre: los microbios circulantes se pegan a la parte intravascular. El autor plantea si vienen del intestino: es su opinión.', resalta: LB('[data-g="n4"]'), cita: [BAC('mar-bac-vias', '46-47'), BAC('mar-bac-intestino', 54)] },
        { t: 'Desde las 48 h puede haber clínica, pero es inespecífica: la fiebre y la leucocitosis son inflamación, no prueba de infección.', resalta: LB('#ctv-b-cocos'), cita: BAC('mar-bac-clinica', 48) },
    ],
    biopelicula: [
        { t: 'La punta, de cerca: los microbios se pegan a la superficie inerte con <span class="hl-azul">adhesinas</span>.', resalta: LB('[data-g="punta"]'), cita: BAC('mar-biofilm', 47) },
        { t: 'Y segregan una matriz (<i>slime</i>: polisacáridos, proteínas, fibrina y ADN) que los protege de los fagocitos.', resalta: LB('[data-g="matriz"]'), cita: BAC('mar-biofilm', 47) },
        { t: 'Se ve al microscopio electrónico incluso tras un solo día. Los estafilococos coagulasa negativos, la primera causa, se pegan a los polímeros.', resalta: LB('[data-g="matriz"]'), cita: BAC('mar-biofilm', 47), org: 'el ritmo de crecimiento: ilustrativo' },
        { t: 'Con antibiótico mueren las libres; para las de la matriz harían falta concentraciones <span class="hl-rojo">100 a 1.000 veces mayores</span>.', e: { antibiotico: true }, resalta: LB('#ctv-b-libres'), cita: BAC('mar-biofilm', 47) },
    ],
    'aposito-humedo': [
        { t: 'El apósito transparente («oclusivo») deja ver el punto y lo sella; atrapa la humedad de la piel. Se cambia al menos cada 7 días.', e: { aposito: 'transparente' }, resalta: LB('[data-g="aposito"]'), cita: [CUI('mar-aposito-transparente', 40), CUI('mar-tabla-3-1', 41)] },
        { t: 'Si se acumula humedad o sangre debajo, el oclusivo puede <span class="hl-rojo">favorecer la colonización</span> y la infección.', resalta: LB('[data-g="aposito"]'), cita: CUI('mar-aposito-paradoja', 41) },
        { t: 'Por la vía 3, la piel, suben más gérmenes por el trayecto.', resalta: LB('[data-g="n3"]'), cita: BAC('mar-bac-vias', '46-47'), org: 'cuántos: ilustrativo' },
        { t: 'Es motivo para cambiarlo. Si la piel no se mantiene seca, mejor gasa, cambiada al menos cada 48 h.', e: { aposito: 'gasa' }, resalta: LB('[data-g="aposito"]'), cita: [CUI('mar-tabla-3-1', 41), CUI('mar-aposito-gasa', 40)] },
    ],
    hemocultivos: [
        { t: 'La clínica no hace el diagnóstico: hace falta un hemocultivo positivo de un sitio distinto del catéter y alguna prueba de que el catéter es la fuente. Dos frascos a la vez: del catéter y periférico.', resalta: [LB('[data-g="frasco-cat"]'), LB('[data-g="frasco-per"]')], cita: [BAC('mar-bac-cultivos', '48-49'), BAC('mar-tabla-3-4', 49)] },
        { t: 'El mismo germen crece en los dos; el del catéter, antes.', resalta: LB('[data-g="frasco-cat"]'), cita: BAC('mar-tabla-3-4', 49), org: 'las horas: ilustrativas' },
        { t: 'Si crece al menos <span class="hl">2 h antes</span>, el catéter es la fuente: tiempo diferencial, exactitud del 91 %. Aquí, 2,5 h.', resalta: LB('[data-g="frasco-per"]'), cita: BAC('mar-tabla-3-4', 49), org: '2,5 h: del caso' },
        { t: 'La otra prueba, los cuantitativos (colonias del catéter ≥3 veces las periféricas), es algo más exacta (94 %). Ninguna es claramente mejor.', resalta: LB('[data-g="frasco-cat"]'), cita: [BAC('mar-tabla-3-4', 49), BAC('mar-bac-metodo', '49-50')] },
    ],
    'recambio-guia': [
        { t: 'Día 7 de un catéter con bacteriemia confirmada: la biopelícula sigue creciendo en la punta.', e: { manejo: null }, resalta: LB('[data-g="bio"]'), cita: BAC('mar-biofilm', 47), org: 'el ritmo: ilustrativo' },
        { t: 'Mientras llegan los cultivos se deja: de 1.527 catéteres retirados por sospecha, solo se confirmó en 169 (11 %).', e: { manejo: 'dejar' }, resalta: LB('[data-g="bio"]'), cita: BAC('mar-bac-no-retirar', 51) },
        { t: 'Recambio sobre guía: <span class="hl-rojo">no</span>. Retirar y poner otro en un sitio nuevo; sobre guía solo si el acceso venoso es muy limitado.', resalta: LB('#ctv-b-cocos'), cita: BAC('mar-bac-guia', 52) },
        { t: 'Si se deja, el antibiótico sistémico apenas lo descontamina (biopelícula) y son de esperar recurrencias. Al retirarlo, la biopelícula se va con él.', e: { manejo: 'retirar' }, resalta: LB('[data-g="n3"]'), cita: BAC('mar-bac-guia', 52) },
    ],
    punta: [
        { t: 'Un catéter yugular o subclavio va en la cava superior, con la punta <span class="hl">1-2 cm por encima de la aurícula</span>.', resalta: LC('#ctv-c-asa'), cita: COM('mar-punta-objetivo', 36) },
        { t: 'En la radiografía, la referencia es la carina: está justo encima de la unión cava-aurícula. La punta, a su altura o algo por encima.', resalta: [LC('[data-g="carina"]'), LC('#ctv-c-asa')], cita: COM('mar-punta-rx', 36) },
        { t: 'Hay malposición en el 15-18 %, sobre todo con la subclavia: aquí ha subido a la yugular. Con eco, mira las dos yugulares.', e: { punta: 'yugular' }, resalta: LC('#ctv-c-asa'), cita: [COM('mar-punta-objetivo', 36), COM('mar-punta-eco', 37)] },
        { t: '¿Y en la aurícula? En 2.348 pacientes así, ninguna perforación ni arritmia relevante: se está dejando de recolocar.', e: { punta: 'auricula' }, resalta: LC('[data-g="auricula"]'), cita: COM('mar-punta-auricula', 37) },
    ],
    'punta-izquierda': [
        { t: 'Un catéter izquierdo llega a la cava por la innominada izquierda.', resalta: LC('#ctv-c-ruta'), cita: CUI('mar-perforacion-vcs', 45) },
        { t: 'No siempre gira hacia abajo: la punta <span class="hl-rojo">apoya en la pared lateral</span> de la cava y puede erosionarla.', resalta: LC('[data-g="pared"]'), cita: CUI('mar-perforacion-vcs', 45) },
        { t: 'Sale sangre y suero al mediastino y la pleura. Los síntomas (dolor retroesternal, tos, disnea) son inespecíficos.', resalta: LC('#ctv-c-asa'), cita: CUI('mar-perforacion-vcs', 45) },
        { t: 'La pista suele ser un ensanchamiento mediastínico y un derrame pleural nuevos (Fig. 3.1).', resalta: LC('[data-g="cava"]'), cita: CUI('mar-perforacion-vcs', 45) },
    ],
    aire: [
        { t: 'Respira solo: la presión intratorácica es negativa y crea el gradiente que mete aire en las venas.', e: { aire: { postura: 'espontanea', abierto: false } }, resalta: LC('[data-g="cava"]'), cita: COM('mar-aire-fisio', 33) },
        { t: 'Con el conector abierto, un gradiente de solo 5 mmHg por un 14 G arrastra <span class="hl-rojo">100 mL de aire por segundo</span>.', resalta: LC('[data-g="conector"]'), cita: COM('mar-aire-fisio', 33) },
        { t: 'Es mortal cuando entran 200-300 mL (3-5 mL/kg) en pocos segundos: puede bloquear el ventrículo derecho, dar edema pulmonar o pasar por un foramen oval y causar un ictus.', resalta: LC('#ctv-c-burbujas'), cita: COM('mar-aire-fisio', 33) },
        { t: 'Si se sospecha: aspirar con una jeringa, oxígeno al 100 % y decúbito lateral izquierdo (eficacia no demostrada).', resalta: LC('[data-g="conector"]'), cita: COM('mar-aire-manejo', 34) },
    ],
    trendelenburg: [
        { t: 'La prevención estándar es el Trendelenburg al canalizar yugular y subclavia: sube la presión venosa.', resalta: LC('[data-g="cava"]'), cita: COM('mar-aire-prevencion', 33) },
        { t: 'Reduce el riesgo, pero el conector se cierra igual. Cuánto aire entra así, el libro no lo dice.', resalta: LC('[data-g="conector"]'), cita: COM('mar-aire-prevencion', 33), org: 'las burbujas lentas: ilustrativo' },
        { t: 'Además distiende la yugular. No hace falta, y no se tolera, con congestión venosa; no se aconseja con hipertensión intracraneal.', resalta: LC('[data-g="cava"]'), cita: SIT('mar-yugular', 26) },
        { t: 'En la femoral no hace falta: el catéter no entra en el tórax ni sufre presiones negativas.', e: { aire: { postura: 'femoral', abierto: true } }, resalta: LC('[data-g="conector"]'), cita: COM('mar-aire-prevencion', 33) },
    ],
    'eco-eje-corto': [
        { t: 'Eje corto: el haz corta los vasos de través. Se localiza bien la vena y se ve a la vez la arteria vecina: menos punciones arteriales.', resalta: [LD('#ctv-d-vena'), LD('#ctv-d-arteria')], cita: ECO('mar-eco-ejes', '13-14') },
        { t: 'La aguja solo se ve como un <span class="hl">punto brillante</span> cuando llega a la luz.', resalta: LD('[data-g="aguja"]'), cita: [ECO('mar-eco-ejes', '13-14'), ECO('mar-eco-aguja', 16)] },
        { t: 'Las venas se colapsan al puncionarlas: con eje corto se perfora la pared posterior en el <span class="hl-rojo">40 %</span> (18 % con eje largo).', resalta: LD('#ctv-d-vena'), cita: ECO('mar-eco-pared-posterior', 16) },
        { t: 'Hoy se prefiere el eje corto para localizar la vena y confirmar la punción.', resalta: LD('[data-g="sonda"]'), cita: ECO('mar-eco-cual', 14) },
    ],
    'eco-eje-largo': [
        { t: 'Eje largo: el haz va a lo largo de la vena. Se ve avanzar la aguja, la guía y el catéter enteros.', resalta: LD('[data-g="aguja"]'), cita: [ECO('mar-eco-ejes', '13-14'), ECO('mar-eco-aguja', 16)] },
        { t: 'Pero <span class="hl-rojo">no se ve la arteria vecina</span>, y hace falta una vena bastante recta.', resalta: LD('[data-g="vena-larga"]'), cita: ECO('mar-eco-ejes', '13-14') },
        { t: 'Se prefiere para confirmar que la guía y luego el catéter están dentro de la luz (Fig. 1.9).', resalta: LD('[data-g="vena-larga"]'), cita: [ECO('mar-eco-cual', 14), ECO('mar-eco-pared-posterior', 16)] },
    ],
    'eco-compresion': [
        { t: '¿Vena o arteria? El método más fácil y usado: apretar la piel con la sonda.', resalta: LD('[data-g="sonda"]'), cita: ECO('mar-compresibilidad', 16) },
        { t: 'La vena se colapsa mucho antes que la arteria (Fig. 1.7).', resalta: [LD('#ctv-d-vena'), LD('#ctv-d-arteria')], cita: ECO('mar-compresibilidad', 16) },
        { t: 'Excepción: <span class="hl-rojo">una vena trombosada no se comprime</span>.', e: { eco: { comprimir: true, trombosada: true } }, resalta: LD('#ctv-d-vena'), cita: ECO('mar-compresibilidad', 16) },
    ],
    'eco-doppler': [
        { t: 'El Doppler color pinta el cambio de frecuencia que produce la dirección del flujo sobre la imagen en grises.', resalta: [LD('#ctv-d-vena'), LD('#ctv-d-arteria')], cita: ECO('mar-doppler-color', 16) },
        { t: 'Los colores <span class="hl-purpura">no significan arteria o vena</span>: indican la dirección del flujo respecto a la sonda. Lo dice la escala.', resalta: LD('[data-g="escala"]'), cita: ECO('mar-doppler-color', 16) },
        { t: 'Gira la sonda: cambia la dirección respecto a ella y los colores se intercambian. Ahora la arteria sale azul y la vena roja.', e: { eco: { doppler: true, girada: true } }, resalta: [LD('[data-g="sonda"]'), LD('#ctv-d-arteria')], cita: ECO('mar-doppler-color', '15-16'), org: 'girar la sonda: fisiología general' },
    ],
};
// Cada estado con nombre: su nombre y sus fuentes como lista (REGLAS §7.11), sin repetir, en el orden de la
// explicación. Otro libro puede añadir las suyas (ESTADOS[k].fuentes.push) sin rehacer el modelo; nunca se funden.
for (const [k, s] of Object.entries(ESTADOS)) {
    s.n = NOMBRE_ESTADO[k];
    const vistos = new Set();
    s.fuentes = (GUIAS[k] || []).flatMap(p => [].concat(p.cita || []))
        .filter(c => { const id = `${c.ficha}#${c.id}`; if (vistos.has(id)) return false; vistos.add(id); return true; });
}

export function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
export function barajar(ops, id) {   // orden fijo por pregunta, para que la buena no sea siempre la primera
    const a = ops.map((o, i) => ({ ...o, i })); const h = hash(id);
    for (let i = a.length - 1; i > 0; i--) { const j = (h >>> (i * 3)) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

export function revisarMayeutica() {
    const tests = [...PREGUNTAS.filter(x => x.tipo === 'test'), ...CASOS.flatMap(c => c.pasos.map(p => p.pregunta)).filter(x => x.tipo === 'test')];
    const errores = [...PREGUNTAS, ...CASOS.flatMap(c => c.pasos.map(p => p.pregunta))].filter(x => x.tipo === 'error');
    const destapas = [...PREGUNTAS, ...CASOS.flatMap(c => c.pasos.map(p => p.pregunta))].filter(x => x.tipo === 'destapa');
    const r = { fallos: [], tests: tests.length, correctaMasLarga: 0, posiciones: [0, 0, 0, 0], errores: errores.map(x => x.frases.filter(f => f.mal).length), destapas: destapas.length,
        guia: PREGUNTAS.filter(x => x.grupo === 'guia').length, examen: PREGUNTAS.filter(x => x.grupo === 'examen').length, casos: CASOS.length, predice: PREGUNTAS.filter(x => x.tocar).length };
    const largo = s => s.replace(/<[^>]+>/g, '').length;
    for (const x of tests) {
        const ok = x.opciones.find(o => o.ok), max = Math.max(...x.opciones.map(o => largo(o.t)));
        if (largo(ok.t) === max) r.correctaMasLarga++;
        r.posiciones[barajar(x.opciones, x.id).findIndex(o => o.ok)]++;
        if (x.opciones.filter(o => o.ok).length !== 1) r.fallos.push(x.id + ': una sola correcta');
        if (x.opciones.some(o => !o.ok && !(o.porque && o.porque.length > 30))) r.fallos.push(x.id + ': opción falsa sin «qué le pasaría»');
    }
    if (r.correctaMasLarga > tests.length / 3) r.fallos.push(`la correcta es la más larga en ${r.correctaMasLarga} de ${tests.length} (> 1/3)`);
    if (r.posiciones.filter(n => n > 0).length < 3) r.fallos.push('la correcta no varía de posición');
    if (r.errores.some(n => n > 2)) r.fallos.push('«encuentra el error» con más de 2 errores');
    if (!r.guia || !r.examen) r.fallos.push('faltan Guía o Examen');
    if (CASOS.length < 2) r.fallos.push('menos de 2 casos');
    for (const c of CASOS) { const tipos = new Set(c.pasos.map(p => p.pregunta.tipo)); if (!tipos.has('error') || !tipos.has('destapa')) r.fallos.push(c.id + ': falta error o destapa'); if (c.lleva.length !== 3) r.fallos.push(c.id + ': «Lo que te llevas» no tiene 3 puntos'); }
    const todas = [...PREGUNTAS, ...CASOS.flatMap(c => c.pasos.map(p => p.pregunta))];
    if (todas.some(x => !x.fuente)) r.fallos.push('pregunta sin fuente');
    const ids = todas.map(x => x.id); if (new Set(ids).size !== ids.length) r.fallos.push('ids de pregunta repetidos');
    return r;
}

const mezcla = (...ps) => { const e = estadoBase(); ps.forEach(p => Object.assign(e, copia(p))); return e; };
export function pruebasCateter() {
    const r = { fallos: [], todoCoincide: true };
    const ok = (c, t) => { if (!c) { r.fallos.push(t); r.todoCoincide = false; } };
    // calibre y longitud (Fig. 1.1, mL/min)
    r.calibre = {}; for (const g of [16, 18, 20]) { const d = derivar(mezcla({ banco: 'fig', figExp: 'calibre', figCal: g })); r.calibre[g] = d.valor; ok(d.valor === FIG.calibre[g] && d.unidad === 'mL/min', 'calibre ' + g); }
    ok(r.calibre[16] === 220 && r.calibre[18] === 105 && r.calibre[20] === 60, 'Fig. 1.1 calibre: 220/105/60');
    r.cociente16_20 = +(r.calibre[16] / r.calibre[20]).toFixed(2); ok(r.cociente16_20 > 3.5 && r.cociente16_20 < 4, 'casi 4 veces');
    r.longitud = {}; for (const l of [2, 6, 12]) { const d = derivar(mezcla({ banco: 'fig', figExp: 'longitud', figLong: l })); r.longitud[l] = d.valor; ok(d.unidad === 'mL/min', 'longitud ' + l); }
    ok(r.longitud[2] === 151 && r.longitud[6] === 91 && r.longitud[12] === 54, 'Fig. 1.1 longitud: 151/91/54');
    r.caida2a6 = Math.round(100 * (1 - r.longitud[6] / r.longitud[2])); r.caida6a12 = Math.round(100 * (1 - r.longitud[12] / r.longitud[6]));
    ok(r.caida2a6 === 40 && r.caida6a12 === 41, '−40 % y otro −40 %');
    // catálogo (Tablas 1.2-1.3, L/h) a 100, 68 y 0 cm
    const TAB = { pc: 6.0, pl: 3.7, midline: 1.3, 'picc-d': 0.26, 'picc-p': 0.27, 'cvc-d': 2.28, 'cvc-m': 0.91, 'cvc-p': 0.99 };
    r.catalogo = {};
    for (const [k, v] of Object.entries(TAB)) {
        const a = derivar(mezcla({ banco: 'tablas', cat: k, altura: 100 })), b = derivar(mezcla({ banco: 'tablas', cat: k, altura: 68 })), c = derivar(mezcla({ banco: 'tablas', cat: k, altura: 0 }));
        r.catalogo[k] = { a100: a.valor, a68: b.valor, a0: c.valor };
        ok(a.valor === v && a.unidad === 'L/h', 'tabla ' + k); ok(Math.abs(b.valor - +(v * 50 / 75).toFixed(2)) < 1e-9, '68 cm ' + k); ok(c.valor === 0, '0 cm ' + k);
    }
    r.piccFrenteMidline = Math.round(100 * TAB['picc-d'] / TAB.midline); ok(r.piccFrenteMidline === 20, 'PICC = 20 % del midline');
    r.midlineFrentePc = Math.round(100 * TAB.midline / TAB.pc); ok(r.midlineFrentePc >= 20 && r.midlineFrentePc <= 22, 'midline ≈ 20 % del periférico corto');
    r.presion = { 68: derivar(mezcla({ banco: 'tablas', altura: 68 })).presion, 100: derivar(mezcla({ banco: 'tablas', altura: 100 })).presion }; ok(r.presion[68] === 50 && r.presion[100] === 75, '50 y 75 mmHg');
    // la vena no cambia nada
    r.vena = ORDEN_CAT.concat(['fig16', 'fig20']).every(k => { const p = k.startsWith('fig') ? { banco: 'fig', figCal: +k.slice(3) } : { banco: 'tablas', cat: k }; return derivar(mezcla(p, { vena: 'pequena' })).valor === derivar(mezcla(p, { vena: 'grande' })).valor; });
    ok(r.vena, 'la vena no cambia el flujo');
    // los dos bancos no se mezclan
    r.bancos = { fig: [...new Set([16, 18, 20].map(g => derivar(mezcla({ banco: 'fig', figCal: g })).unidad))], tablas: [...new Set(Object.keys(TAB).map(k => derivar(mezcla({ banco: 'tablas', cat: k })).unidad))] };
    ok(r.bancos.fig.join() === 'mL/min' && r.bancos.tablas.join() === 'L/h', 'bancos sin mezclar');
    // French
    r.french = { '7': +(7 * 0.33).toFixed(2), '9': +(9 * 0.33).toFixed(2), tabla7: 2.4, tabla9: 3.2 }; ok(r.french['7'] === 2.31 && r.french['9'] === 2.97, 'French 7 → 2,31 · 9 → 2,97');
    // bombas
    r.bombas = { volumetrica: derivar(mezcla({ banco: 'tablas', bomba: 'volumetrica' })).valor, jeringa: derivar(mezcla({ banco: 'tablas', bomba: 'jeringa' })).valor,
        infusorRapido: derivar(mezcla({ banco: 'tablas', cat: 'rapido', bomba: 'infusor' })).valor, infusorCvc: derivar(mezcla({ banco: 'tablas', cat: 'cvc-d', bomba: 'infusor' })) };
    ok(r.bombas.volumetrica === 1000 && r.bombas.jeringa === 100 && r.bombas.infusorRapido === 1.5, 'bombas 1.000 mL/h, 100 mL/h, 1,5 L/min');
    ok(r.bombas.infusorCvc.valor === null && r.bombas.infusorCvc.avisos.length === 1, 'infusor con otro catéter: aviso'); r.bombas.infusorCvc = r.bombas.infusorCvc.avisos[0];
    // intraósea
    const dio = derivar(mezcla({ io: true })); r.io = { rel: dio.rel, presionMedula: dio.presionMedula, unidad: dio.unidad }; ok(dio.rel === 0.25 && dio.presionMedula === 30 && dio.valor == null, 'IO 25 % y 30 mmHg, sin L/h');
    // aire
    const da = derivar(mezcla({ lupa: 'C' })); r.aire = { tasa: da.aire.tasa, segundos: da.aire.segundosHastaLetal, letal70kg: da.aire.letalKg };
    ok(da.aire.tasa === 100 && da.aire.segundosHastaLetal.join() === '2,3' && da.aire.letalKg.join() === '210,350', 'aire 100 mL/s; 200-300 mL en 2-3 s; 210-350 mL en 70 kg');
    { const tr = derivar(mezcla({ aire: { postura: 'trendelenburg', abierto: true } })).aire, fe = derivar(mezcla({ aire: { postura: 'femoral', abierto: true } })).aire;
        r.aire.trendelenburg = tr.reducido ? 'menos riesgo, sin cifra' : tr.tasa; r.aire.femoral = fe.tasa; ok(tr.tasa === null && tr.reducido, 'Trendelenburg: menos, sin cifra'); ok(fe.tasa === 0, 'femoral: sin aire'); }
    // biopelícula y clínica
    r.bio = [0, 24, 48, 168, 336].map(t => { const b = derivar(mezcla({ tiempo: t })).bio; return { t, visible: b.visible, clinica: b.clinicaPosible }; });
    ok(!r.bio[0].visible && r.bio[1].visible && !r.bio[1].clinica && r.bio[2].clinica, 'biopelícula a las 24 h; clínica desde las 48 h');
    // hemocultivos
    const dh = derivar(estadoBase()).hc; r.hemocultivos = dh; ok(dh.dif === 2.5 && dh.fuenteCateter, '2,5 h ≥ 2 h: el catéter es la fuente');
    // oclusión × instilación (Tabla 3.2 y 3.3)
    r.oclusion = {};
    for (const o of Object.keys(OCLUSIONES)) { r.oclusion[o] = Object.keys(INSTILAR).filter(i => resuelta(mezcla({ oclusion: o, instilado: i }))); ok(derivar(mezcla({ oclusion: o, bomba: 'volumetrica' })).alarma && derivar(mezcla({ oclusion: o })).valor === 0, 'ocluido: sin flujo ' + o); }
    ok(r.oclusion.trombo.join() === 'alteplasa' && r.oclusion.mineral.join() === 'naoh,cisteina' && r.oclusion.acido.join() === 'hcl,cisteina' && r.oclusion.alcalino.join() === 'bicarbonato,naoh' && r.oclusion.lipidos.join() === 'naoh,etanol', 'Tabla 3.3');
    ok(Object.values(r.oclusion).every(a => !a.includes('guia')), 'la guía nunca');
    // punta
    r.punta = Object.fromEntries(ORDEN_PUNTA.map(p => [p, derivar(mezcla({ punta: p })).punta.ok])); ok(r.punta.carina === true && r.punta.yugular === false, 'punta en la carina');
    r.puntaIzquierda = derivar(mezcla({ izquierdo: true })).punta.ok; ok(r.puntaIzquierda === false, 'catéter izquierdo: aviso');
    // eco
    const de = (o) => derivar(mezcla({ eco: Object.assign(estadoBase().eco, o) })).eco;
    r.eco = { comprimir: de({ comprimir: true }), trombosada: de({ comprimir: true, trombosada: true }), doppler: de({ doppler: true }), girada: de({ doppler: true, girada: true }), ejeLargo: de({ eje: 'largo', aguja: true }), ejeCorto: de({ aguja: true }) };
    ok(r.eco.comprimir.venaColapsa && !r.eco.comprimir.arteriaColapsa && !r.eco.trombosada.venaColapsa, 'compresión: la vena sí, la arteria no, la trombosada no');
    ok(r.eco.doppler.colorArteria === r.eco.girada.colorVena && r.eco.doppler.colorVena === r.eco.girada.colorArteria, 'girar la sonda intercambia los colores');
    ok(r.eco.ejeCorto.aguja === 'punto' && r.eco.ejeLargo.aguja === 'linea' && !r.eco.ejeLargo.arteriaVisible, 'aguja: punto en eje corto, línea en eje largo');
    // estados con nombre: todos aplican sin error y su cifra coincide
    r.estados = {};
    for (const [k, st] of Object.entries(ESTADOS)) { try { const d = derivar(estadoDe(st.e)); r.estados[k] = st.cifra ? st.cifra(d) : true; ok(r.estados[k] === true, 'estado ' + k); } catch (err) { r.estados[k] = String(err); ok(false, 'estado ' + k); } }
    // Mayéutica: forma de las preguntas (REGLAS §8)
    if (typeof PREGUNTAS !== 'undefined') r.mayeutica = revisarMayeutica(); if (r.mayeutica && r.mayeutica.fallos.length) { r.todoCoincide = false; r.fallos.push(...r.mayeutica.fallos); }
    return r;
}

export const CONCEPTOS = [
    { titulo: 'El radio manda',
        texto: 'Hagen-Poiseuille: Q = ΔP × πr⁴ / 8µL. El flujo va con la <span class="hl-azul">cuarta potencia del radio</span>: entre el 16 G y el 20 G hay menos de 1 mm, y el 16 G pasa <span class="hl">casi cuatro veces más</span>.',
        hacer: 'cambia el calibre (Fig. 1.1, longitud fija de 1,2″).', estado: { banco: 'fig', figExp: 'calibre', figCal: 16 }, mirar: 'probeta',
        acciones: [{ t: '16 G', e: { figCal: 16 } }, { t: '18 G', e: { figCal: 18 } }, { t: '20 G', e: { figCal: 20 } }],
        mira: 'la probeta y la lectura: 220, 105 y 60 mL/min. En la franja «a escala», el grosor apenas cambia.',
        fuente: 'mar-cateteres-flujo#mar-fig-1-1-calibre · #mar-poiseuille' },
    { titulo: 'La longitud resta',
        texto: 'La resistencia crece con la longitud (R = 8µL/πr⁴). Con el mismo 16 G, de 2 a 6 pulgadas <span class="hl-rojo">−40 %</span>; de 6 a 12, otro −40 %. Para correr: <span class="hl">corto y de gran calibre</span>.',
        hacer: 'alarga el catéter (16 G fijo).', estado: { banco: 'fig', figExp: 'longitud', figLong: 2 }, mirar: 'escala',
        acciones: [{ t: '2″', e: { figLong: 2 } }, { t: '6″', e: { figLong: 6 } }, { t: '12″', e: { figLong: 12 } }],
        mira: 'el espécimen se alarga sobre la regla y la probeta se llena más despacio: 151, 91 y 54 mL/min.',
        fuente: 'mar-cateteres-flujo#mar-fig-1-1-longitud · #mar-corto-grueso' },
    { titulo: 'La vena no cuenta',
        texto: '<span class="hl">La velocidad de infusión la marca el catéter, no la vena</span>: sus dimensiones, no el tamaño de la vena canalizada.',
        hacer: 'cambia la vena con el mismo catéter.', estado: { banco: 'tablas', cat: 'pc' }, mirar: 'vena',
        acciones: [{ t: 'Vena pequeña', e: { vena: 'pequena' } }, { t: 'Vena grande', e: { vena: 'grande' } }],
        mira: 'la vena engorda; la lectura sigue en 6,0 L/h.',
        fuente: 'mar-cateteres-flujo#mar-flujo-cateter' },
    { titulo: 'Empujar: la altura de la bolsa',
        texto: 'Sin cambiar de catéter, la palanca es el ΔP: la altura de la bolsa sobre el punto de punción. <span class="hl">68 cm = 50 mmHg; 100 cm = 75 mmHg</span>. El flujo es proporcional al ΔP; a 0 cm, sin gradiente, no hay flujo.',
        hacer: 'sube y baja la bolsa (banco de las tablas).', estado: { banco: 'tablas', cat: 'pc', altura: 100 }, mirar: 'bolsa',
        acciones: [{ t: '0 cm', e: { altura: 0 }, mirar: 'bolsa' }, { t: '68 cm', e: { altura: 68 }, mirar: 'bolsa' }, { t: '100 cm', e: { altura: 100 }, mirar: 'bolsa' }],
        mira: '6,0 L/h a 100 cm (la tabla); 4,0 a 68 cm (calculado: × 50/75); 0 a 0 cm. La Fig. 1.1 no dice su altura: con ella, la bolsa no se mueve.',
        fuente: 'mar-cateteres-flujo#mar-altura-bolsa · #mar-poiseuille · mar-tipos-cateter#mar-tabla-1-2' },
    { titulo: 'Los catéteres reales',
        texto: 'Tablas 1.2-1.3 (L/h; otro experimento, no se mezcla con la Fig. 1.1). El midline da el 20 % del periférico corto, y el PICC, <span class="hl-rojo">el 20 % del midline</span>. Del CVC, <span class="hl">la luz distal (16 G)</span> da más del doble que las de 18 G.',
        hacer: 'recorre el catálogo.', estado: { banco: 'tablas', cat: 'midline' }, mirar: 'escala',
        acciones: [{ t: 'Midline', e: { cat: 'midline' } }, { t: 'PICC', e: { cat: 'picc-d' } }, { t: 'CVC distal', e: { cat: 'cvc-d' } }, { t: 'CVC proximal', e: { cat: 'cvc-p' } }],
        mira: 'el PICC de 50 cm se sale de la regla (lo marca la rotura) y da 0,26 L/h; el CVC distal, 2,28; el proximal, 0,99.',
        fuente: 'mar-tipos-cateter#mar-tabla-1-2 · #mar-tabla-1-3' },
    { titulo: 'Las bombas no son para correr',
        texto: 'La volumétrica dosifica de 0,1 a <span class="hl-rojo">1.000 mL/h</span>; la de jeringa, hasta 100 mL/h. Para la hemorragia masiva, el <span class="hl">infusor rápido</span>: hasta 1,5 L/min, con un catéter de 7-8 Fr y 2-2,5″.',
        hacer: 'cambia la bomba.', estado: { banco: 'tablas', cat: 'pc' }, mirar: 'lectura',
        acciones: [{ t: 'Volumétrica', e: { bomba: 'volumetrica' } }, { t: 'Jeringa', e: { bomba: 'jeringa' } }, { t: 'Infusor con CVC', e: { cat: 'cvc-d', bomba: 'infusor' } }, { t: 'Infusor con su catéter', e: { cat: 'rapido', bomba: 'infusor' } }],
        mira: 'con la volumétrica, ≤1.000 mL/h frente a 6 L/h por gravedad; el infusor con otro catéter no tiene cifra.',
        fuente: 'mar-cateteres-flujo#mar-bombas' },
    { titulo: 'La médula no se colapsa',
        texto: 'En el shock las venas se colapsan; la cavidad medular, rígida, no. Pero la IO da <span class="hl-rojo">un 25 % de una periférica</span>: la médula es viscosa y está a unos 30 mmHg. Se presuriza de rutina (bomba o manguito); no más de 24 h (recomendación sin pruebas firmes).',
        hacer: 'pon la intraósea.', estado: { io: true }, mirar: 'probeta',
        acciones: [{ t: 'Intraósea por gravedad', e: { io: true } }, { t: 'Presurizada (bomba)', e: { io: true, bomba: 'volumetrica' } }],
        mira: 'la barra junto a la probeta: 25 % de una periférica, sin L/h (la ficha no dice cuál).',
        fuente: 'mar-eco-intraosea#mar-io-indicaciones · #mar-io-flujo · #mar-io-duracion' },
    { titulo: 'Cuatro vías, una principal',
        texto: 'El germen llega al catéter por la infusión (rara), por el conector y la luz, por <span class="hl-rojo">la piel a lo largo del trayecto</span> (la principal en los no tunelizados) o desde la sangre. El paquete de inserción cierra puertas en la piel.',
        hacer: 'deja pasar el tiempo, cierra puertas y moja el apósito.', estado: { lupa: 'B', zoomB: 'vias', tiempo: 48 }, mirar: 'cocos',
        acciones: [{ t: 'Paquete completo', e: { paquete: { manos: true, barreras: true, clorhex: true, femoral: true } } }, { t: 'Humedad bajo el apósito', e: { aposito: 'humedo' } }, { t: 'Día 7', e: { tiempo: 168 } }],
        mira: 'los cocos que bajan por el trayecto. Cuántos: ilustrativo; la Tabla 2.1 no da cifras.',
        fuente: 'mar-bacteriemia-cateter#mar-bac-vias · mar-cvc-sitios#mar-tabla-2-1 · mar-cateter-cuidados#mar-aposito-paradoja' },
    { titulo: 'La biopelícula',
        texto: 'Se pegan con adhesinas y se envuelven en una matriz (polisacáridos, proteínas, fibrina y ADN). <span class="hl">Al día ya se ve al microscopio</span>. Los fagocitos no entran y haría falta de <span class="hl-rojo">100 a 1.000 veces</span> más antibiótico.',
        hacer: 'da antibiótico; después, prueba qué haces con el catéter.', estado: { lupa: 'B', zoomB: 'punta', tiempo: 168 }, mirar: 'cocos',
        acciones: [{ t: 'Antibiótico', e: { antibiotico: true } }, { t: 'Recambio sobre guía', e: { manejo: 'guia' } }, { t: 'Retirar', e: { manejo: 'retirar' } }, { t: 'Al microscopio', e: { zoomB: 'micro' }, mirar: null }],
        mira: 'el antibiótico deja en contorno (muertas) las libres; las de la matriz siguen. Retirado, la biopelícula se va con el catéter; sobre guía, el libro lo desaconseja.',
        fuente: 'mar-bacteriemia-cateter#mar-biofilm · #mar-bac-guia (Fig. 3.3)' },
    { titulo: '¿Es el catéter?',
        texto: 'La clínica no lo dice: sin clínica antes de 48 h, la fiebre es inflamación y el eritema no predice. Hace falta el mismo germen en sangre periférica y del catéter, y que el del catéter crezca <span class="hl">≥2 h antes</span> (91 %) o con ≥3 veces más colonias (94 %).',
        hacer: 'incuba los dos frascos.', estado: { lupa: 'B', zoomB: 'frascos', problema: 'hemocultivos' }, mirar: 'frascos',
        acciones: [{ t: 'Incubar', e: { hcIncubado: true } }],
        mira: 'el del catéter se enturbia 2,5 h antes (diferencia del caso; las horas absolutas son ilustrativas).',
        fuente: 'mar-bacteriemia-cateter#mar-bac-clinica · #mar-tabla-3-4' },
    { titulo: 'El catéter que no refluye',
        texto: 'Lo más frecuente es un <span class="hl-rojo">trombo (60 %)</span>: alteplasa 2 mg, 30 y 120 min (80-90 %). <span class="hl-rojo">No se aconseja pasar una guía</span>. Si falla, lo que pasaba por esa luz: <span class="hl">lo alcalino con un álcali, lo ácido con un ácido, los lípidos con etanol</span>.',
        hacer: 'ocluye y desobstruye.', estado: { banco: 'tablas', cat: 'picc-d', bomba: 'volumetrica', oclusion: 'trombo', problema: 'oclusion' }, mirar: 'lectura',
        acciones: [{ t: 'Trombo + alteplasa', e: { oclusion: 'trombo', instilado: 'alteplasa' } }, { t: 'NPT (Ca²⁺ y PO₄) + NaOH', e: { oclusion: 'mineral', instilado: 'naoh' } }, { t: 'Pasar una guía', e: { oclusion: 'trombo', instilado: 'guia' } }],
        mira: 'la bomba alarma y la probeta se para; el disolvente correcto lo abre.',
        fuente: 'mar-cateter-cuidados#mar-oclusion-causas · #mar-permeabilidad · #mar-alteplasa · #mar-tabla-3-3' },
    { titulo: 'La punta y el aire',
        texto: 'La punta, <span class="hl">1-2 cm por encima de la aurícula, a la altura de la carina</span>. Con el conector abierto y respiración espontánea, por un 14 G entran <span class="hl-rojo">100 mL de aire por segundo</span>: 200-300 mL en segundos matan.',
        hacer: 'mueve la punta y abre el conector.', estado: { lupa: 'C', problema: 'aire' }, mirar: 'punta',
        acciones: [{ t: 'Aurícula', e: { punta: 'auricula' }, mirar: 'punta' }, { t: 'Catéter izquierdo', e: { izquierdo: true }, mirar: 'punta' }, { t: 'Abrir el conector', e: { aire: { postura: 'espontanea', abierto: true } }, mirar: 'lectura' }, { t: 'En Trendelenburg', e: { aire: { postura: 'trendelenburg', abierto: true } }, mirar: 'lectura' }],
        mira: 'el contador de aire de la lectura; en Trendelenburg el riesgo baja (cuánto, el libro no lo dice: burbujas lentas, ilustrativo). En la aurícula, se está dejando de recolocar.',
        fuente: 'mar-cvc-complicaciones#mar-punta-objetivo · #mar-punta-auricula · #mar-aire-fisio · #mar-aire-prevencion · mar-cateter-cuidados#mar-perforacion-vcs' },
    { titulo: 'Vena o arteria (lupa D)',
        texto: 'Al comprimir, <span class="hl">la vena se colapsa y la arteria no</span> (salvo una vena trombosada). El Doppler color pinta <span class="hl-rojo">la dirección respecto a la sonda</span>, no el tipo de vaso.',
        hacer: 'comprime, enciende el Doppler y gira la sonda.', estado: { lupa: 'D' }, mirar: 'eco',
        acciones: [{ t: 'Comprimir', e: { eco: { comprimir: true } } }, { t: 'Vena trombosada', e: { eco: { comprimir: true, trombosada: true } } }, { t: 'Doppler', e: { eco: { doppler: true } } }, { t: 'Girar la sonda', e: { eco: { doppler: true, girada: true } } }],
        mira: 'los colores se intercambian al girar la sonda; los nombres «vena» y «arteria», no.',
        fuente: 'mar-eco-intraosea (Compresibilidad, Doppler color, Figs. 1.7-1.8)' }
];

export const PREGUNTAS = [
    { id: 'cv-g1', grupo: 'guia', corto: 'calibre', tipo: 'test', fuente: 'mar-cateteres-flujo#mar-fig-1-1-calibre · #mar-poiseuille',
        estado: { banco: 'fig', figExp: 'calibre', figCal: 16 }, mirar: 'probeta',
        tocar: { mandos: ['calibre'], ocultar: ['flujo'], instruccion: 'pon el 20 G y mira cómo se llena la probeta; vuelve al 16 G si quieres compararlo.', comprobar: e => e.figExp === 'calibre' && e.figCal === 20, confirma: '16 G, 220 mL/min; 20 G, 60: casi cuatro veces más con menos de 1 mm de diferencia.', pista: 'Pulsa «20 G».', bueno: { figCal: 20 } },
        enunciado: 'Predice. Entre un catéter de 16 G y uno de 20 G de la misma longitud hay menos de 1 mm de diámetro. ¿Cuánto más pasa el 16 G?',
        opciones: [
            { t: 'Un 20-30 % más: menos de 1 mm no puede dar mucho', ok: false, porque: 'Pasa casi cuatro veces más (220 frente a 60 mL/min). Con la 20 G, el paciente recibiría el volumen a un cuarto de velocidad.' },
            { t: 'Casi cuatro veces más: el radio cuenta a la cuarta', ok: true },
            { t: 'Lo mismo si subes la bolsa: la altura compensa', ok: false, porque: 'La altura sube el flujo de los dos en la misma proporción (Q ∝ ΔP); la diferencia del radio sigue ahí, y el paciente seguiría recibiendo mucho menos por la 20 G.' }],
        explicacion: 'Fig. 1.1: <span class="hl">220 frente a 60 mL/min</span>, los dos de 1,2″. El flujo va con la <span class="hl-azul">cuarta potencia del radio</span> (Hagen-Poiseuille): es lo que más pesa.' },
    { id: 'cv-g2', grupo: 'guia', corto: 'longitud', tipo: 'test', fuente: 'mar-cateteres-flujo#mar-fig-1-1-longitud · #mar-corto-grueso',
        estado: { banco: 'fig', figExp: 'longitud', figLong: 2 }, mirar: 'escala',
        tocar: { mandos: ['longitud'], ocultar: ['flujo'], instruccion: 'alarga el catéter a 6″ y mira la regla y la probeta.', comprobar: e => e.figExp === 'longitud' && e.figLong === 6, confirma: '151 → 91 mL/min: −40 %. A 12″, otro −40 % (54).', pista: 'Pulsa «6″».', bueno: { figExp: 'longitud', figLong: 6 } },
        enunciado: 'Predice. El mismo 16 G, pero de 6 pulgadas en vez de 2 (la longitud de un CVC frente a la de un periférico). ¿Qué le pasa al flujo?',
        opciones: [
            { t: 'Nada: manda el calibre, y es el mismo', ok: false, porque: 'La longitud también resta: cae un 40 % (151 → 91 mL/min). Con un catéter largo, el volumen le llegaría bastante más despacio.' },
            { t: 'Sube, porque un catéter largo llega a una vena más ancha', ok: false, porque: 'La vena no marca el ritmo; el catéter sí. El paciente recibiría menos volumen del que crees.' },
            { t: 'Baja un 40 %, y otro 40 % si lo llevas a 12″', ok: true }],
        explicacion: 'Fig. 1.1: de 2 a 6 pulgadas, <span class="hl-rojo">−40 %</span>; de 6 a 12, otro −40 %. Para correr: <span class="hl">corto y de gran calibre</span>.' },
    { id: 'cv-g3', grupo: 'guia', corto: 'la vena', tipo: 'test', fuente: 'mar-cateteres-flujo#mar-flujo-cateter · #mar-poiseuille',
        estado: { banco: 'tablas', cat: 'pc', vena: 'pequena' }, mirar: 'vena',
        tocar: { mandos: ['vena'], ocultar: ['flujo'], instruccion: 'cambia a la vena grande y lee el flujo.', comprobar: e => e.vena === 'grande', confirma: '6,0 L/h con las dos venas: el flujo no se ha movido.', pista: 'Pulsa «Vena grande».', bueno: { vena: 'grande' } },
        enunciado: 'Canalizas una vena enorme con el mismo catéter que tenías en una vena fina del antebrazo. ¿Cambia el flujo?',
        opciones: [
            { t: 'Sí: con una vena ancha hay menos resistencia a la salida', ok: false, porque: 'La resistencia está en el catéter (R = 8µL/πr⁴). Si cuentas con la vena grande, sigues reponiendo al mismo ritmo de antes.' },
            { t: 'No: el ritmo lo marcan las dimensiones del catéter, no la vena', ok: true },
            { t: 'Solo si la vena es central: allí la presión es más baja y el gradiente, mayor', ok: false, porque: 'Ser central no cambia el catéter: un CVC de 20 cm da menos que un periférico corto (2,28 frente a 6,0 L/h). El paciente recibiría menos de lo que esperas.' }],
        explicacion: '<span class="hl">La velocidad de infusión la marca el catéter, no la vena</span>: sus dimensiones, no el tamaño de la vena canalizada.' },
    { id: 'cv-g4', grupo: 'guia', corto: 'altura', tipo: 'test', fuente: 'mar-cateteres-flujo#mar-altura-bolsa · #mar-poiseuille',
        estado: { banco: 'tablas', cat: 'pc', altura: 100 }, mirar: 'bolsa',
        tocar: { mandos: ['altura'], ocultar: ['flujo', 'presion'], instruccion: 'baja la bolsa a 68 cm y lee la lectura.', comprobar: e => e.altura === 68, confirma: 'a 68 cm, 50 mmHg; el periférico corto pasa de 6,0 a 4,0 L/h (calculado: × 50/75).', pista: 'Pulsa «68 cm».', bueno: { altura: 68 } },
        enunciado: 'Sin cambiar de catéter, la palanca que te queda es el gradiente: la altura de la bolsa sobre el punto de punción. Predice: ¿con qué presión empuja a 68 cm?',
        opciones: [
            { t: '68 mmHg: un milímetro de mercurio por cada centímetro de altura', ok: false, porque: 'Un centímetro de altura no es un mmHg: a 68 cm la ficha da 50 mmHg. Esperarías más flujo del que le llega al paciente.' },
            { t: '50 mmHg; si subes la bolsa a 100 cm, empuja con 75 mmHg', ok: true },
            { t: 'Da igual: con una volumétrica ya va al máximo', ok: false, porque: 'La volumétrica no pasa de 1.000 mL/h; por gravedad, el periférico corto da 6 L/h. Con la bomba, el paciente recibiría menos.' }],
        explicacion: 'Por gravedad, el ΔP es la altura de la bolsa: <span class="hl">68 cm = 50 mmHg</span> y <span class="hl">100 cm = 75 mmHg</span>. El flujo es proporcional al ΔP.',
        nota: '<b>Nota de fidelidad.</b> Las Tablas 1.2-1.3 se midieron desde 40 pulgadas (101,6 cm) y la ficha da 75 mmHg para 100 cm (39 pulgadas): aquí se toman como la misma marca.' },
    { id: 'cv-g5', grupo: 'guia', corto: 'hemorragia masiva', tipo: 'destapa', fuente: 'mar-cateteres-flujo#mar-corto-grueso · #mar-bombas · mar-tipos-cateter#mar-tabla-1-3',
        estado: { banco: 'tablas', cat: 'cvc-d' }, despues: { banco: 'tablas', cat: 'rapido', bomba: 'infusor' }, mirar: 'escala', ocultar: ['flujo'],
        enunciado: 'Hemorragia masiva. ¿Qué pides para infundir lo más rápido posible?',
        puntos: ['Un catéter <span class="hl">corto y de gran calibre</span>: el radio a la cuarta a favor y la longitud en contra (Fig. 1.1).',
            'Si solo hay un CVC, <span class="hl">su luz distal</span> (16 G): 2,28 L/h, frente a 0,91-0,99 de las de 18 G (Tabla 1.3).',
            'Un <span class="hl">infusor rápido</span>: hasta 1,5 L/min, con su catéter de 7-8 Fr y 2-2,5″. La volumétrica no pasa de 1.000 mL/h.'],
        explicacion: 'En el modelo, ahora, el infusor con su catéter de infusión rápida. Con otro catéter, la ficha no da cifra.' },
    { id: 'cv-e1', grupo: 'examen', corto: 'Doppler color', tipo: 'test', fuente: 'mar-eco-intraosea (Doppler color · Compresibilidad, Figs. 1.7-1.8) · mar-cvc-sitios#mar-femoral',
        estado: { lupa: 'D', eco: { eje: 'corto', doppler: true } }, despues: { lupa: 'D', eco: { eje: 'corto', doppler: true, girada: true } }, mirar: 'eco',
        enunciado: 'Ingle derecha, eje corto con Doppler color: un vaso sale rojo y el otro, del otro color. El R1 dice: «el rojo es la arteria; pincho el otro». ¿Qué le contestas?',
        opciones: [
            { t: 'Bien: en el Doppler, el rojo es arterial y el azul venoso', ok: false, porque: 'El color dice la dirección del flujo respecto a la sonda, no el tipo de vaso: con la sonda girada se invierten. Podría acabar canalizando la arteria femoral.' },
            { t: 'Que pinche el rojo: en la ingle la vena va lateral', ok: false, porque: 'La vena femoral está justo medial a la arteria (Fig. 2.4). Pincharía la arteria.' },
            { t: 'El color solo da la dirección respecto a la sonda: que comprima', ok: true }],
        explicacion: 'El Doppler pinta la <span class="hl">dirección respecto a la sonda</span> (lo dice la escala de color). En la Fig. 1.8 la arteria sale roja, pero no siempre: mira cómo se intercambian al girar la sonda. Lo más fácil: <span class="hl">la vena se colapsa al comprimir y la arteria no</span>, salvo una vena trombosada.' },
    { id: 'cv-e2', grupo: 'examen', corto: 'French', tipo: 'test', fuente: 'mar-cateteres-flujo#mar-french · #mar-gauge · #mar-tabla-1-1 · #mar-french-nota',
        estado: { banco: 'tablas', cat: 'cvc-d' }, mirar: 'escala',
        enunciado: 'Te dan un introductor de 9 Fr. ¿Qué diámetro externo tiene?',
        opciones: [
            { t: '9 mm: el French da el diámetro en milímetros', ok: false, porque: 'Cada French son 0,33 mm. Esperarías un tubo tres veces más grueso del que vas a meter en la vena del paciente.' },
            { t: 'Unos 3 mm: 2,97 por la ecuación y 3,2 en la tabla', ok: true },
            { t: 'Menos que uno de 7 Fr: como el gauge, cuanto mayor el número, más fino es el catéter', ok: false, porque: 'Eso es el gauge. El French crece con el diámetro: 7 Fr = 2,4 mm y 9 Fr = 3,2 en la tabla. Si los confundes, en una hemorragia pedirías el catéter más fino.' }],
        explicacion: '<span class="hl-azul">Fr × 0,33 = mm</span>. El gauge va al revés y no está estandarizado: cambia con el fabricante.',
        nota: '<b>Nota de fidelidad.</b> La ecuación y la Tabla 1.1 no dan lo mismo: 9 Fr, 2,97 frente a 3,2 mm; 7 Fr, 2,31 frente a 2,4. La tabla recoge catéteres reales y la ecuación es una aproximación: se dan las dos.' },
    { id: 'cv-e4', grupo: 'examen', corto: 'embolia aérea', tipo: 'destapa', fuente: 'mar-cvc-complicaciones#mar-aire-clinica · #mar-aire-manejo',
        estado: { lupa: 'C', aire: { postura: 'espontanea', abierto: true }, problema: 'aire' }, mirar: 'lectura', ocultar: ['aire'],
        enunciado: 'Al retirar un CVC yugular, con el paciente sentado, aparecen disnea brusca y una tos angustiosa. Sospechas una embolia gaseosa. ¿Qué haces?',
        puntos: ['Si el catéter sigue dentro, conectar una jeringa e <span class="hl">intentar aspirar el aire</span>.',
            '<span class="hl">Oxígeno al 100 %</span>: saca el nitrógeno de las burbujas y reduce su volumen.',
            '<span class="hl">Decúbito lateral izquierdo</span>: mueve la bolsa de aire que bloquea la salida del VD.',
            'Si hay colapso cardiovascular, valorar <span class="hl-rojo">soporte extracorpóreo</span>.'],
        explicacion: 'La eficacia de estas medidas no está demostrada. La clínica: la disnea brusca es lo más precoz, a veces con tos angustiosa; en los casos avanzados, un soplo «en rueda de molino». La ETE es lo más sensible (detecta 0,02 mL/kg), pero no suele estar a mano.' },
    { id: 'cv-e3', grupo: 'examen', corto: 'oclusión', tipo: 'error', fuente: 'mar-cateter-cuidados#mar-oclusion-causas · #mar-permeabilidad · #mar-alteplasa · #mar-tabla-3-3',
        estado: { banco: 'tablas', cat: 'picc-d', bomba: 'volumetrica', oclusion: 'trombo', problema: 'oclusion' }, mirar: 'lectura',
        enunciado: 'PICC con la bomba alarmando por presión. Nota del R1.',
        frases: [
            { t: 'Lo más probable es un trombo: es la causa del 60 %.', mal: false },
            { t: 'Para aspirar, una jeringa pequeña: menos presión negativa, menos colapso de la luz.', mal: false },
            { t: 'Alteplasa 2 mg (2 mL); intento aspirar a los 30 min y, si no, a los 120.', mal: false },
            { t: 'Si no se abre, le paso una guía para desatascarlo.', mal: true, c: '<span class="hl-rojo">No se aconseja</span>: la guía puede soltar la masa y embolizarla. Si la alteplasa falla, piensa qué pasaba por esa luz (Tabla 3.3).' },
            { t: 'Si iba NPT rica en Ca²⁺ y fosfato, NaOH 0,1 N de primera elección.', mal: false }],
        explicacion: 'La alteplasa recupera el 80-90 %. Si no, la regla de la Tabla 3.3: <span class="hl">lo alcalino con un álcali, lo ácido con un ácido y los lípidos con etanol</span>.' }
];

export const CASOS = [
    { id: 'c-a1', titulo: 'Marcos, 30 años: ¿por dónde paso el volumen?', corto: 'Caso 1 · Marcos', sub: 'politrauma en moto',
        paciente: { Edad: '30 años', Motivo: 'politrauma (moto), hipotenso', Accesos: '20 G en el dorso de la mano · CVC triple luz de 20 cm' },
        pasos: [
            { momento: 'Llegada', datos: { PA: '78/40 mmHg', FC: '128 lpm' }, nuevo: ['PA', 'FC'], estado: { banco: 'fig', figExp: 'calibre', figCal: 20 }, mirar: 'probeta',
                pregunta: { id: 'a1-1', tipo: 'test', fuente: 'mar-cateteres-flujo#mar-fig-1-1-calibre · #mar-flujo-cateter',
                    despues: { banco: 'fig', figExp: 'calibre', figCal: 16 },
                    enunciado: 'Necesita volumen ya. ¿Qué acceso añades para correr más?',
                    opciones: [
                        { t: 'Otra 20 G en la otra mano: dos vías finas pasan el doble', ok: false, porque: 'Una 16 G corta pasa casi cuatro veces lo de una 20 G (220 frente a 60 mL/min). Con dos 20 G seguiría recibiendo menos de lo que necesita.' },
                        { t: 'Un periférico corto y grueso: 16 G', ok: true },
                        { t: 'Ninguno: el CVC va a una vena central, que admite más', ok: false, porque: 'La vena no marca el ritmo; el catéter sí, y el CVC es largo. El volumen le llegaría más despacio de lo que esperas.' }],
                    explicacion: 'Fig. 1.1: <span class="hl">16 G, 220 mL/min; 20 G, 60</span>. Para correr: corto y grueso. Míralo en la probeta.' } },
            { momento: '5 min', datos: { 'Vía nueva': '16 G en la flexura' }, nuevo: ['Vía nueva'], estado: { banco: 'tablas', cat: 'cvc-p' }, mirar: 'probeta',
                pregunta: { id: 'a1-2', tipo: 'test', fuente: 'mar-tipos-cateter#mar-tabla-1-3 · (CVC triple luz, Fig. 1.4)',
                    tocar: { mandos: ['cvc-luces'], ocultar: ['flujo'], instruccion: 'prueba las tres luces y lee el flujo.', comprobar: e => e.cat === 'cvc-d', confirma: 'distal 2,28 L/h; medial 0,91; proximal 0,99.', pista: 'La más gruesa es la distal.', bueno: { banco: 'tablas', cat: 'cvc-d' } },
                    enunciado: 'Predice. Además de la 16 G, quieres pasar suero por el CVC triple luz. ¿Por qué luz?',
                    opciones: [
                        { t: 'La proximal, que sale antes y no se mezcla con la punta', ok: false, porque: 'La proximal es de 18 G: 0,99 L/h, menos de la mitad que la distal. El volumen le llegaría a menos de la mitad de ritmo.' },
                        { t: 'Da igual: las tres luces son del mismo catéter de 7 Fr', ok: false, porque: '7 Fr es el diámetro externo; cada luz tiene su calibre (distal 16 G; medial y proximal 18 G). Por la medial (0,91 L/h) repondrías a menos de la mitad.' },
                        { t: 'La distal, la de 16 G', ok: true }],
                    explicacion: 'Tabla 1.3: <span class="hl">distal 2,28 L/h</span>, más del doble que las de 18 G. Es la luz para el volumen rápido.' } },
            { momento: '10 min', datos: { Bolsa: 'colgada a 68 cm del brazo' }, nuevo: ['Bolsa'], estado: { banco: 'tablas', cat: 'pc', altura: 68 }, mirar: 'bolsa',
                pregunta: { id: 'a1-3', tipo: 'destapa', fuente: 'mar-cateteres-flujo#mar-altura-bolsa · #mar-bombas · mar-tipos-cateter#mar-tabla-1-2', ocultar: ['flujo', 'presion'],
                    despues: { banco: 'tablas', cat: 'pc', altura: 100 },
                    enunciado: 'La enfermera pregunta cómo sacar más de las vías que ya tiene, y si una bomba ayudaría. ¿Qué le contestas?',
                    puntos: ['Subir la bolsa: el flujo es proporcional al gradiente. A 68 cm empuja con <span class="hl">50 mmHg</span>; a 100 cm, con <span class="hl">75</span>.',
                        'La bomba volumétrica <span class="hl-rojo">no sirve para correr</span>: no pasa de 1.000 mL/h, y un periférico corto por gravedad da 6 L/h.',
                        'Para la hemorragia masiva, el <span class="hl">infusor rápido</span> (hasta 1,5 L/min, calentado), con su catéter.'],
                    explicacion: 'En el modelo, la bolsa sube a 100 cm: la cifra de la tabla (6,0 L/h en el periférico corto de 18 G).' } },
            { momento: '25 min', datos: { Accesos: 'en el traslado a la TC se arrancan las periféricas y el CVC; no hay venas visibles' }, nuevo: ['Accesos'], estado: { io: true }, mirar: 'probeta',
                pregunta: { id: 'a1-4', tipo: 'test', fuente: 'mar-eco-intraosea#mar-io-sitio · #mar-io-flujo · #mar-io-errata', ocultar: ['flujo', 'presion'],
                    enunciado: 'Sin venas: vía intraósea. ¿Dónde, y qué esperas de ella?',
                    opciones: [
                        { t: 'Fémur proximal, como dice el pie de la Fig. 1.10; pasa como una periférica', ok: false, porque: 'El pie de figura dice fémur, pero el texto y el dibujo describen la tibia (errata). Y la IO da solo un 25 %: sin presurizar, el volumen apenas entraría.' },
                        { t: 'Tibia proximal; da un 25 % de una periférica: hay que presurizar', ok: true },
                        { t: 'Húmero, que tiene más flujo: así no hace falta presurizar', ok: false, porque: 'El húmero tiene más capacidad de flujo, pero en el adulto se prefiere la tibia (más éxito; no estorba la intubación ni las compresiones). Y la médula empuja con unos 30 mmHg: sin presurizar, el volumen apenas entraría.' }],
                    explicacion: 'Tibia proximal: <span class="hl">3 cm bajo la rótula y 2 cm medial</span>. La médula no se colapsa en el shock, pero da un <span class="hl-rojo">25 %</span> de una periférica (viscosidad y unos 30 mmHg): se presuriza de rutina. No más de 24 h (recomendación sin pruebas firmes).',
                    nota: '<b>Nota de fidelidad.</b> El pie de la Fig. 1.10 y el «A Final Word» dicen «fémur proximal»; el texto y el dibujo, la tibia. Se sigue el texto.' } },
            { momento: '40 min · el giro', datos: { Accesos: 'IO tibial · CVC triple luz nuevo, subclavio (20 cm)', Llega: 'el infusor rápido de la sala de trauma' }, nuevo: ['Accesos', 'Llega'], estado: { banco: 'tablas', cat: 'cvc-d', bomba: 'infusor' }, mirar: 'lectura',
                calculadora: { nombre: 'Del French al milímetro', ir: 'mar-french-calc' },
                pregunta: { id: 'a1-5', tipo: 'test', fuente: 'mar-cateteres-flujo#mar-bombas · #mar-french',
                    despues: { banco: 'tablas', cat: 'rapido', bomba: 'infusor' },
                    enunciado: 'Llega el infusor rápido (hasta 1,5 L/min). ¿Por dónde lo conectas?',
                    opciones: [
                        { t: 'Por la luz distal del CVC: es la más gruesa', ok: false, porque: 'El infusor pide un catéter de infusión rápida de 7-8 Fr y 2-2,5″. La luz distal es de 16 G y mide 20 cm: no le llegaría ese flujo.' },
                        { t: 'Por un catéter de infusión rápida: 7-8 Fr, 2-2,5″', ok: true },
                        { t: 'Por la intraósea, que va directa a la médula y no se colapsa en el shock', ok: false, porque: 'La IO da un 25 % de una periférica; incluso presurizada a 300 mmHg o más puede no bastar en una hemorragia masiva.' }],
                    explicacion: 'Infusores rápidos: fluidos o hemoderivados calientes <span class="hl">hasta 1,5 L/min</span>, con «catéteres de infusión rápida» de <span class="hl">7-8 Fr y 2-2,5 pulgadas</span>: cortos y gruesos.' } },
            { momento: '1 h', datos: { Clínica: 'despierta; le duele al infundir por la IO' }, nuevo: ['Clínica'], estado: { io: true, bomba: 'volumetrica' }, mirar: null,
                pregunta: { id: 'a1-6', tipo: 'error', fuente: 'mar-eco-intraosea#mar-io-lidocaina · #mar-io-duracion · mar-tipos-cateter#mar-tabla-1-3',
                    enunciado: 'Plan del R1 de guardia.',
                    frases: [
                        { t: 'Lidocaína al 2 % sin conservantes: 40 mg (2 mL) en la médula en 2 minutos.', mal: false },
                        { t: 'La dejamos actuar 1 minuto y lavamos con 10 mL de salino; si no basta, 20 mg más.', mal: false },
                        { t: 'El volumen, por la luz proximal del CVC: la cava es grande.', mal: true, c: 'Por la <span class="hl">distal</span> (16 G, 2,28 L/h); la proximal es de 18 G (0,99). Y manda el catéter, no el tamaño de la cava.' },
                        { t: 'Si el efecto se pierde a la hora, fentanilo por la IO a dosis IV.', mal: false },
                        { t: 'Si la IO funciona, la dejamos 48 h hasta tener una vía central nueva.', mal: true, c: 'Es temporal: <span class="hl-rojo">no más de 24 horas</span> de infusión (sin pruebas firmes, pero es lo recomendado).' }],
                    explicacion: 'La IO es un puente: duele en el despierto (el periostio está muy inervado) y no debe pasar de 24 h.' } }
        ],
        lleva: ['El ritmo lo marca el catéter: <b>corto y grueso</b> (16 G, 220 mL/min; 20 G, 60). La vena no cuenta.',
            'Del CVC, la luz distal (16 G, 2,28 L/h). Para correr de verdad, el infusor rápido con su catéter de 7-8 Fr; la volumétrica no pasa de 1.000 mL/h.',
            'La IO no se colapsa, pero da un 25 %: tibia proximal, presurizada de rutina, no más de 24 h y lidocaína 40 mg en 2 min si está despierto.'],
        volver: { nombre: 'Catéteres y flujo', ficha: 'mar-cateteres-flujo', estado: { banco: 'tablas', cat: 'rapido', bomba: 'infusor' } } },

    { id: 'c-a2', titulo: 'Carmen, 64 años: fiebre el día 9 del CVC', corto: 'Caso 2 · Carmen', sub: 'sepsis abdominal, CVC yugular',
        paciente: { Edad: '64 años', Motivo: 'sepsis abdominal, operada', Catéter: 'CVC yugular derecho' },
        pasos: [
            { momento: 'Día 9', datos: { Temperatura: '38,6 °C', Foco: 'ninguno claro', 'Punto del CVC': 'eritema, sin pus' }, nuevo: ['Temperatura', 'Foco', 'Punto del CVC'], estado: { lupa: 'B', zoomB: 'vias', tiempo: 216 }, mirar: 'cocos',
                pregunta: { id: 'a2-1', tipo: 'test', fuente: 'mar-bacteriemia-cateter#mar-bac-clinica · #mar-bac-no-retirar · #mar-bac-guia',
                    enunciado: '¿Retiras ya el CVC?',
                    opciones: [
                        { t: 'Sí: con fiebre sin foco y eritema en el punto, el catéter es la fuente hasta que se demuestre lo contrario', ok: false, porque: 'La fiebre es inflamación y el eritema no tiene valor predictivo. De 1.527 retirados por sospecha, solo 169 (11 %) lo eran: le quitarías un acceso que probablemente está limpio.' },
                        { t: 'Lo cambio sobre guía: conservo el acceso y quito el catéter sospechoso', ok: false, porque: 'Tocarías un catéter que probablemente está limpio (solo el 11 % de las sospechas se confirman), con los riesgos de un recambio. Y si se confirma la infección, el libro no lo recambia sobre guía (salvo, quizá, con un acceso venoso muy limitado): lo retira y pone otro en un sitio nuevo.' },
                        { t: 'Aún no: hemocultivos de cada luz y periférico, y espero', ok: true }],
                    explicacion: 'La clínica no diagnostica: de los retirados por sospecha, <span class="hl-rojo">solo el 11 %</span> lo eran. El catéter se deja mientras llegan los cultivos.' } },
            { momento: 'Día 9', datos: {}, nuevo: [], estado: { lupa: 'B', zoomB: 'frascos', problema: 'hemocultivos', tiempo: 216 }, mirar: 'frascos',
                pregunta: { id: 'a2-2', tipo: 'destapa', fuente: 'mar-bacteriemia-cateter#mar-tabla-3-4 · #mar-bac-luces · #mar-tabla-3-6 · #mar-bac-empirico',
                    enunciado: '¿Qué hemocultivos sacas, y qué haces justo después?',
                    puntos: ['Uno <span class="hl">periférico</span>: hace falta un hemocultivo positivo de un sitio distinto del catéter.', 'Uno <span class="hl">de cada luz</span>: cultivar una sola habría pasado por alto el 38 % de las infecciones.',
                        'Justo después, <span class="hl">antibiótico empírico sin demora</span>: vancomicina como columna; gramnegativos si hay neutropenia o gravedad (Tabla 3.6).'],
                    explicacion: 'Con los dos a la vez se puede comparar: tiempo diferencial (≥2 h, 91 %) o recuento (≥3 veces, 94 %).' } },
            { momento: 'Día 10', datos: { Hemocultivos: 'el mismo germen en el del catéter y el periférico' }, nuevo: ['Hemocultivos'], estado: { lupa: 'B', zoomB: 'frascos', problema: 'hemocultivos', tiempo: 240 }, mirar: 'frascos',
                calculadora: { nombre: 'Hemocultivos pareados y duración', ir: 'mar-hemocultivos-calc' },
                pregunta: { id: 'a2-3', tipo: 'test', fuente: 'mar-bacteriemia-cateter#mar-tabla-3-4 · #mar-bac-metodo',
                    tocar: { mandos: ['incubar'], ocultar: ['hc'], instruccion: 'incuba los dos frascos y mira cuál se enturbia antes.', comprobar: e => e.hcIncubado, confirma: 'el del catéter, 2,5 h antes que el periférico: el catéter es la fuente.', pista: 'Pulsa «Incubar los dos frascos».', bueno: { hcIncubado: true } },
                    enunciado: 'Predice: si el catéter es la fuente, ¿qué tiene que pasar con los dos frascos?',
                    opciones: [
                        { t: 'Que el del catéter se haga positivo al menos 2 h antes', ok: true },
                        { t: 'Nada: hay que retirarlo y cultivar la punta', ok: false, porque: 'El cultivo de la punta cayó en desuso: obliga a retirar el catéter y solo cultiva su superficie externa. Le quitarías el acceso para saber menos.' },
                        { t: 'Que tenga ≥3 veces más colonias; el tiempo no sirve', ok: false, porque: 'Ese es el otro método (cuantitativo, 94 %); el tiempo diferencial (≥2 h, 91 %) también vale. Retrasarías el diagnóstico esperando un recuento.' }],
                    explicacion: 'Tabla 3.4: el mismo germen en los dos y el del catéter <span class="hl">≥2 h antes</span> (91 %), o con <span class="hl">≥3 veces</span> más colonias (94 %). Ninguno es claramente mejor.' } },
            { momento: 'Día 10 · el giro', datos: { Hemocultivos: 'el del catéter, positivo 2,5 h antes que el periférico', Germen: '<i>Staphylococcus aureus</i>' }, nuevo: ['Hemocultivos', 'Germen'], estado: { lupa: 'B', zoomB: 'punta', tiempo: 240 }, mirar: 'cocos',
                pregunta: { id: 'a2-4', tipo: 'test', fuente: 'mar-bacteriemia-cateter#mar-bac-retirar · #mar-bac-guia · (Endocarditis)',
                    despues: { lupa: 'B', zoomB: 'punta', tiempo: 240, manejo: 'retirar' },
                    enunciado: 'Es <i>S. aureus</i>. ¿Qué haces con el catéter?',
                    opciones: [
                        { t: 'Lo dejo y sello cada luz con antibiótico durante 24 h', ok: false, porque: '<i>S. aureus</i> es criterio de retirada. Con el catéter dentro, la biopelícula seguiría sembrando la sangre: bacteriemia que persiste.' },
                        { t: 'Lo retiro, pongo otro en un sitio nuevo y pido una ETE', ok: true },
                        { t: 'Recambio sobre guía por la misma yugular', ok: false, porque: 'Marino lo desaconseja: retirar y poner otro en un sitio nuevo; sobre guía puede ser la mejor opción si el acceso venoso es muy limitado, y también tiene complicaciones. Con S. aureus, no hay motivo para arriesgarlo.' }],
                    explicacion: 'Retirar si se confirma con <span class="hl-rojo"><i>S. aureus</i>, Candida, Pseudomonas o BGN multirresistentes</span>, inestabilidad o fallo multiorgánico, endocarditis o tromboflebitis, o bacteriemia >96 h. Y <span class="hl">ETE en toda bacteriemia por <i>S. aureus</i></span>: los signos faltan en hasta dos tercios.' } },
            { momento: 'Día 10', datos: {}, nuevo: [], estado: { lupa: 'B', zoomB: 'punta', tiempo: 240, antibiotico: true }, mirar: 'cocos',
                pregunta: { id: 'a2-5', tipo: 'destapa', fuente: 'mar-bacteriemia-cateter#mar-biofilm',
                    enunciado: 'Su hijo pregunta por qué no basta con el antibiótico, sin quitar el catéter. ¿Qué le explicas?',
                    puntos: ['Los gérmenes se pegan al catéter y se envuelven en una <span class="hl">matriz</span> (polisacáridos, proteínas, fibrina y ADN) que los protege.', 'Los <span class="hl">fagocitos no pueden ingerirlos</span> dentro de esa biopelícula.', 'Haría falta de <span class="hl-rojo">100 a 1.000 veces</span> más antibiótico: una dosis tóxica.'],
                    explicacion: 'En la lupa: el antibiótico mata a las libres (contorno) y las de la biopelícula siguen.' } },
            { momento: 'Día 12', datos: { ETE: 'sin endocarditis', Otros: 'sin prótesis intravasculares ni inmunodepresión' }, nuevo: ['ETE', 'Otros'], estado: { lupa: 'B', zoomB: 'vias', tiempo: 288, manejo: 'retirar' }, mirar: null,
                pregunta: { id: 'a2-6', tipo: 'error', fuente: 'mar-bacteriemia-cateter#mar-bac-duracion · #mar-tabla-3-6 · #mar-bac-clinica · (Tromboflebitis supurada)',
                    enunciado: 'Plan del R1.',
                    frases: [
                        { t: 'CVC retirado; el nuevo, en otro sitio.', mal: false },
                        { t: 'El eritema del punto ya confirmaba que era el catéter.', mal: true, c: 'El eritema <span class="hl-rojo">no tiene valor predictivo</span>: lo confirmaron los hemocultivos (mismo germen, ≥2 h antes).' },
                        { t: 'Vancomicina, la columna vertebral frente a los estafilococos.', mal: false },
                        { t: 'Sin endocarditis, prótesis ni inmunodepresión y con buena respuesta: 7 días.', mal: true, c: 'Siete días son para un germen poco patógeno, como un SCN, con buena respuesta. <span class="hl"><i>S. aureus</i> sin endocarditis, catéter retirado y sin inmunodepresión ni prótesis: 14 días</span>.' },
                        { t: 'Si la sepsis persiste más de 72 h, buscar una tromboflebitis supurada.', mal: false }],
                    explicacion: 'Las duraciones dependen del germen: SCN, no más de 7 días; <i>S. aureus</i>, 14 (4-6 semanas con endocarditis); enterococos y BGN, 7-14.' } }
        ],
        lleva: ['La fiebre y el eritema no diagnostican: solo el 11 % de las sospechas se confirman. El catéter se deja mientras llegan los cultivos.',
            'Hemocultivo periférico y de cada luz: el catéter es la fuente si crece ≥2 h antes (91 %) o con ≥3 veces más colonias (94 %).',
            '<i>S. aureus</i>: retirar y sitio nuevo (no sobre guía), ETE y 14 días si no hay endocarditis, prótesis ni inmunodepresión. Si se deja un catéter infectado, el antibiótico apenas lo limpia.'],
        volver: { nombre: 'Bacteriemia relacionada con el catéter', ficha: 'mar-bacteriemia-cateter', estado: { lupa: 'B', zoomB: 'punta', tiempo: 240, antibiotico: true, problema: 'biopelicula' } } },

    // A3 (cobertura §3): la ficha V entera (aire, neumotórax y punta). La cobertura lo planteaba al retirar la vía;
    // aquí el aire entra por una luz abierta del catéter puesto, que es lo que el libro describe («si se sospecha
    // entrada de aire por un catéter»: aspirar por él) y lo que enseña la lupa C.
    { id: 'c-a3', titulo: 'Julián, 70 años: el conector abierto', corto: 'Caso 3 · Julián', sub: 'neumonía, CVC subclavio',
        paciente: { Edad: '70 años', Motivo: 'neumonía, día 6 de UCI; ya sin vasopresores', Catéter: 'CVC subclavio derecho' },
        pasos: [
            { momento: 'Día 6 · 10:00', datos: { Postura: 'sentado a 45°, respira solo', Enfermería: 'la luz proximal del CVC, desconectada y abierta' }, nuevo: ['Postura', 'Enfermería'], estado: { lupa: 'C', problema: 'aire' }, mirar: 'punta',
                pregunta: { id: 'a3-1', tipo: 'test', fuente: 'mar-cvc-complicaciones#mar-aire-fisio',
                    tocar: { mandos: ['conector'], ocultar: ['aire'], instruccion: 'abre el conector con el paciente sentado y mira el contador de aire (corre con la cifra del libro, la de un 14 G).', comprobar: e => e.aire.abierto && e.aire.postura === 'espontanea' && !e.izquierdo, confirma: 'por un 14 G, con 5 mmHg, entran 100 mL por segundo, y 200-300 mL en pocos segundos pueden matar. Por esta luz de 18 G entraría más despacio: el libro no da cuánto.', pista: 'Pulsa «Abrir conector».', bueno: { aire: { postura: 'espontanea', abierto: true } }, mirar: 'lectura' },
                    enunciado: 'Predice. Respira solo, sentado, con una luz del CVC abierta al aire. ¿Qué pasa por ella?',
                    opciones: [
                        { t: 'Entra aire, aspirado por la presión negativa del tórax', ok: true },
                        { t: 'Nada: la presión venosa es positiva y, si acaso, refluye sangre', ok: false, porque: 'Respirando solo, la presión del tórax es negativa y crea el gradiente que mete aire: con 5 mmHg, por un 14 G entran 100 mL por segundo. Dejarías la luz abierta hasta la embolia.' },
                        { t: 'Entra algo de aire, sin importancia', ok: false, porque: 'Por un 14 G, con solo 5 mmHg, entran 100 mL por segundo; por una luz más fina, menos (el libro no da cuánto), pero 200-300 mL (3-5 mL/kg) en pocos segundos pueden ser mortales. No lo tratarías como la urgencia que es.' }],
                    explicacion: 'La <span class="hl-rojo">presión intratorácica negativa</span> de la respiración espontánea crea el gradiente: con solo 5 mmHg, por un 14 G (1,8 mm de diámetro interno) entran <span class="hl-rojo">100 mL de aire por segundo</span>. Es mortal cuando entran 200-300 mL (3-5 mL/kg) en pocos segundos.',
                    nota: '<b>Nota de fidelidad.</b> Los 100 mL/s del libro son para un catéter de 14 G (1,8 mm) con 5 mmHg. La luz proximal de un CVC es de 18 G y el libro no da su cifra: el contador de la lupa corre con la del 14 G.' } },
            { momento: '10:01', datos: { Clínica: 'disnea brusca y una tos angustiosa', SpO2: '86 %' }, nuevo: ['Clínica', 'SpO2'], estado: { lupa: 'C', problema: 'aire', aire: { postura: 'espontanea', abierto: true } }, mirar: 'lectura',
                pregunta: { id: 'a3-2', tipo: 'test', fuente: 'mar-cvc-complicaciones#mar-aire-manejo · #mar-aire-prevencion',
                    enunciado: 'Sospechas una embolia gaseosa. El catéter sigue dentro. ¿Qué medida del libro aplicas por él?',
                    opciones: [
                        { t: 'Retirar el CVC ya, para que no entre más aire', ok: false, porque: 'Perderías la vía por la que se puede sacar el aire: con el catéter dentro, el libro conecta una jeringa e intenta aspirarlo.' },
                        { t: 'Ponerlo en Trendelenburg: sube la presión venosa y el aire deja de entrar', ok: false, porque: 'El Trendelenburg es la prevención al canalizar la yugular o la subclavia. Con el aire ya dentro, el libro lo pone en decúbito lateral izquierdo, para mover la bolsa de aire que bloquea la salida del VD.' },
                        { t: 'Conectar una jeringa a esa luz y aspirar el aire', ok: true }],
                    explicacion: 'Las cuatro medidas del libro, sin orden de prioridad y de eficacia no demostrada: <span class="hl">aspirar por el catéter</span>, <span class="hl">O₂ al 100 %</span> (saca el nitrógeno de las burbujas y reduce su volumen), <span class="hl">decúbito lateral izquierdo</span> y, si hay colapso cardiovascular, soporte extracorpóreo.' } },
            { momento: '10:05', datos: { Posición: 'decúbito lateral izquierdo, O₂ al 100 %' }, nuevo: ['Posición'], estado: { lupa: 'C', problema: 'aire' }, mirar: null,
                pregunta: { id: 'a3-3', tipo: 'destapa', fuente: 'mar-cvc-complicaciones#mar-aire-clinica',
                    enunciado: 'La enfermera pregunta cómo se confirma que es aire. ¿Qué le dices?',
                    puntos: ['Suele ser un <span class="hl">diagnóstico clínico</span>: lo más precoz, la disnea brusca, a veces con tos angustiosa.',
                        'La <span class="hl">ETE</span> es lo más sensible (detecta 0,02 mL/kg), pero no suele estar a mano.',
                        'El <span class="hl">Doppler precordial</span> ayuda (el aire da un sonido agudo), aunque puede carecer de especificidad.'],
                    explicacion: 'Puede ser silente. Si progresa, insuficiencia respiratoria y shock; en los casos avanzados, la mezcla de aire y sangre en el VD da un soplo «en rueda de molino».' } },
            { momento: '10:20 · el giro', datos: { Auscultación: 'soplo «en rueda de molino»', Neurología: 'hemiparesia izquierda nueva' }, nuevo: ['Auscultación', 'Neurología'], estado: { lupa: 'C', problema: 'aire', aire: { postura: 'espontanea', abierto: true } }, mirar: 'lectura',
                pregunta: { id: 'a3-4', tipo: 'test', fuente: 'mar-cvc-complicaciones#mar-aire-fisio · #mar-aire-clinica',
                    enunciado: 'El aire entró por una vena. ¿Qué explica el déficit neurológico?',
                    opciones: [
                        { t: 'Ha cruzado un foramen oval permeable: un ictus embólico', ok: true },
                        { t: 'Hipoperfusión: el aire venoso solo llega al pulmón', ok: false, porque: 'El aire venoso puede cruzar un foramen oval permeable y dar un ictus embólico. Si lo atribuyes al gasto, no buscarías el ictus.' },
                        { t: 'Edema pulmonar por fuga capilar, al llegar el aire al pulmón', ok: false, porque: 'El aire que llega al pulmón sí puede dar un edema por fuga capilar; pero de las tres cosas que el libro atribuye al aire venoso, la que causa un ictus es el paso por un foramen oval permeable. Perderías el ictus embólico.' }],
                    explicacion: 'El aire venoso hace tres cosas: <span class="hl-rojo">bloquea el VD</span> (fallo derecho agudo y shock cardiogénico), da <span class="hl">edema pulmonar por fuga capilar</span> al llegar al pulmón o <span class="hl-rojo">cruza un foramen oval permeable</span> y causa un ictus embólico. El soplo «en rueda de molino» es de los casos avanzados: aire y sangre mezclados en el VD.' } },
            { momento: 'Día 7', datos: { Catéter: 'el del día 6 se retiró; hoy, uno nuevo, subclavio derecho, con eco', 'Rx portátil': 'sin neumotórax; la punta sube por el cuello' }, nuevo: ['Catéter', 'Rx portátil'], estado: { lupa: 'C', problema: 'aire', punta: 'yugular' }, mirar: 'punta',
                pregunta: { id: 'a3-5', tipo: 'test', fuente: 'mar-cvc-complicaciones#mar-punta-objetivo · #mar-punta-rx · #mar-punta-eco',
                    tocar: { mandos: ['punta'], ocultar: ['punta'], instruccion: 'lleva la punta a su sitio.', comprobar: e => (e.punta === 'carina' || e.punta === 'vcs-alta') && !e.izquierdo, confirma: 'en la cava superior, 1-2 cm por encima de la aurícula: en la Rx, a la altura de la carina (o algo por encima, también aceptable).', pista: 'La carina está justo encima de la unión cava-aurícula.', bueno: { punta: 'carina' }, mirar: 'punta' },
                    enunciado: 'Predice. La punta de este subclavio ha subido por el cuello. ¿Dónde debería estar?',
                    opciones: [
                        { t: 'En la yugular interna basta: también es una vena central', ok: false, porque: 'Subir a la yugular es una malposición (las malposiciones, de todo tipo, son el 15-18 %, sobre todo con la subclavia): la punta no queda en la cava superior y hay que recolocarlo.' },
                        { t: 'Junto a la clavícula: con entrar en el tronco innominado es suficiente', ok: false, porque: 'Quedaría alta, fuera de la cava superior. El objetivo es la cava, 1-2 cm por encima de la aurícula: en la Rx, a la altura de la carina.' },
                        { t: 'En la cava superior, 1-2 cm sobre la aurícula (Rx: carina)', ok: true }],
                    explicacion: 'Yugulares y subclavios, con la punta en la cava superior, <span class="hl">1-2 cm por encima de la aurícula</span>; en la Rx, <span class="hl">a la altura de la carina</span> o algo por encima. Con un subclavio, la eco mira las dos yugulares durante el procedimiento, y así se recoloca ya.' } },
            { momento: 'Día 7 · nota', datos: {}, nuevo: [], estado: { lupa: 'C', problema: 'aire', punta: 'carina' }, mirar: null,
                pregunta: { id: 'a3-6', tipo: 'error', fuente: 'mar-cvc-complicaciones#mar-neumotorax · #mar-neumo-rx · #mar-neumo-eco · #mar-punta-eco · #mar-punta-auricula',
                    enunciado: 'Nota del R1 tras el subclavio.',
                    frases: [
                        { t: 'Subclavio derecho con eco; la punta había subido a la yugular y se ha recolocado.', mal: false },
                        { t: 'Con la subclavia, el neumotórax es más frecuente: un 1 % con eco y un 4 % sin ella.', mal: false },
                        { t: 'La Rx portátil no enseña neumotórax: neumotórax descartado.', mal: true, c: 'A la Rx portátil, en supino, <span class="hl-rojo">se le escapa hasta la mitad</span> de los neumotórax: el aire se queda delante del pulmón. La eco (el «deslizamiento pulmonar») es más sensible y se recomienda en su lugar.' },
                        { t: 'Para confirmar la punta con eco: 10 mL de suero rápido por la luz distal; si las burbujas llegan a la aurícula en menos de 2 s, la punta está en la cava superior.', mal: false },
                        { t: 'Si hubiera quedado en la aurícula, habría que recolocarla por el riesgo de perforación.', mal: true, c: 'En 2.348 pacientes con la punta en la aurícula derecha <span class="hl">no hubo ninguna perforación</span> ni arritmia relevante: se está abandonando la costumbre de recolocarla.' }],
                    explicacion: 'Tras un CVC, la eco sirve para las dos cosas: el neumotórax (deslizamiento pulmonar; su falta no es patognomónica) y la punta (las yugulares y la prueba de burbujas).' } }
        ],
        lleva: ['Respirando solo, el tórax aspira: con 5 mmHg, por un 14 G entran 100 mL de aire por segundo, y 200-300 mL (3-5 mL/kg) en segundos pueden matar. Trendelenburg al canalizar la yugular o la subclavia (no hace falta, y no se tolera, con congestión venosa; no se aconseja con hipertensión intracraneal); la femoral no lo necesita.',
            'Si entra: aspirar por el catéter, O₂ al 100 %, decúbito lateral izquierdo y, si hay colapso, soporte extracorpóreo (eficacia no demostrada). Por un foramen oval permeable, ictus.',
            'A la Rx portátil se le escapa hasta la mitad de los neumotórax: mejor la eco. La punta, a la altura de la carina (o algo por encima); si queda en la aurícula, se está dejando de recolocar.'],
        volver: { nombre: 'Aire, neumotórax y punta', ficha: 'mar-cvc-complicaciones', estado: { lupa: 'C', problema: 'aire', aire: { postura: 'espontanea', abierto: true } } } }
];

/* Para profundizar: lo que el modelo y la Mayéutica no cubren, con su sitio en el texto */
export const PROFUNDIZAR = [
    ['Materiales: poliuretano (días a semanas) y silicona (meses, catéteres implantables).', 'mar-cateteres-flujo', 2],
    ['Forssmann, 1929: el primer cateterismo derecho (historia).', 'mar-cateteres-flujo', 2],
    ['Periférico corto (falla un tercio al primer intento; 40-60 % en 3 días), periférico largo (8 cm, 7-9 días) y midline (basílica, 14 días, vasopresores 7-8 días; frente al PICC, menos oclusión y bacteriemia, TVP <5 %).', 'mar-tipos-cateter', 6],
    ['Seldinger, el dilatador y la Tabla 1.4: qué catéter para quién (el CVC, el catéter estable «de referencia final» y el preferido en la inestabilidad hemodinámica grave).', 'mar-seldinger · mar-tabla-1-4 · mar-resumen-cateteres', 10],
    ['Ecografía vascular: sondas de 5-15 MHz (unos 9 cm), protocolo en 3 pasos y pared posterior (40 % en eje corto frente a 18 % en eje largo).', 'mar-eco-metodo · mar-eco-protocolo · mar-eco-pared-posterior', 13],
    ['Intraósea: contraindicaciones, agujas de 15 G (15, 25 y 45 mm), confirmación con 5-10 mL de salino, retirada y complicaciones (<1 %).', 'mar-io-contraindicaciones · mar-io-aguja · mar-io-complicaciones', 17],
    ['CVC: las 6 indicaciones (4 con alternativa), contraindicaciones (plaquetas <20.000 o INR >3: sin pruebas), los tres sitios por referencias y por eco, y la Tabla 2.2 con su errata.', 'mar-cvc-sitios', 23],
    ['Punción carotídea en la yugular: 9,2 % por referencias anatómicas frente a 1,8 % con eco; comprimir al menos 5 min; si el catéter entró en la carótida, no retirarlo.', 'mar-yugular', 28],
    ['Subclavia: punción arterial 1-6 %, neumotórax 1-4 %, malposición 8-9 %, y estenosis de la subclavia (15-50 %) días o meses después: evitarla si puede necesitar una fístula de hemodiálisis en ese brazo.', 'mar-subclavia', 30],
    ['Neumotórax: a la Rx portátil se le escapa hasta la mitad; el deslizamiento pulmonar, más sensible.', 'mar-neumo-rx · mar-neumo-eco', 34],
    ['La punta con eco: las dos yugulares y la prueba de burbujas (10 mL por la luz distal; <2 s: cava superior).', 'mar-punta-eco', 37],
    ['Cuidados rutinarios (Tabla 3.1), sellado con salino y citrato al 1,4 % en los arteriales, y recambio solo con indicación.', 'mar-tabla-3-1 · mar-sellado · mar-recambio', 41],
    ['Trombosis por catéter: TVP del brazo (signo de Urschel), eco de compresión 97/96 %, el dímero-D no sirve, femoral 1,6 %; ', 'mar-tvp-superior · mar-tvp-diagnostico · mar-tvp-femoral', 44],
    ['Perforación de la cava por un catéter izquierdo (Fig. 3.1): toracocentesis con un líquido parecido al infundido; se confirma con contraste por el catéter. Ante la sospecha, parar la infusión; si se confirma, retirar el catéter (no provoca sangrado mediastínico); antibiótico solo si el líquido pleural está infectado. Y el taponamiento por perforación de la aurícula (mortalidad 40-100 %).', 'mar-perforacion-vcs · mar-perforacion-manejo · mar-taponamiento', 46],
    ['Gérmenes (Tabla 3.5), antibiótico empírico (Tabla 3.6) y sellado antibiótico (2-5 mg/mL, 24 h).', 'mar-tabla-3-5 · mar-tabla-3-6 · mar-bac-sellado', 50],
    ['Tromboflebitis supurada (4-6 semanas) y endocarditis nosocomial (ETE en toda bacteriemia por S. aureus).', 'mar-bacteriemia-cateter', 53],
    ['¿La piel o el intestino? La reflexión final del autor.', 'mar-bac-intestino', 53],
    ['El microbioma y la descontaminación digestiva (cap. 4).', 'mar-microbioma', 58]
];
