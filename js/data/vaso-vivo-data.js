// El vaso que sangra: datos puros, sin DOM (Libros → Marino, bloque «Sangre y hemostasia», cap. 13; sus fichas viven en
// Hematología → Merino HEMATO: merino-trombocitopenia, merino-microangiopatias y merino-plaquetas-plasma).
// Viene de la maqueta aprobada autonomo/maquetas/b2-vaso.html (parada 1 del bloque 2, 20/10/2026: «la fusión de A y
// B»: la lámina de la arteriola con su red de capilares y órganos, y la herida como lupa grande).
// Modelo por concepto (REGLAS §7.11): la herida y la red; cada estado guarda sus fuentes como una lista (libro,
// página, ficha), para que otro libro pueda añadir su estado o su matiz sin rehacer el modelo.
//
// Toda la medicina sale de las fichas 4-6 de Merino HEMATO (js/modules/merino-hemato/merino-hemato.html, ids mh-…) y
// de su PDF (docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf, cap. 13 = págs. 20-36; la página del PDF es la
// del libro). La máquina de la trombina (Xa, II, IIa) es la del telar, cap. 5, Fig. 5.2 (ficha mar-tromboprofilaxis-
// farmacos). Cada cifra dice su origen: ficha, fisiología general o ilustrativo. El paciente de los casos se inventa;
// la medicina, no.
//
// Aquí: el estado y lo que se deriva de él (tapón, sangrado, órganos, lupas, tablero), la frase viva, los estados con
// nombre (los que abre data-vaso-vivo="<estado>") con sus fuentes y su explicación guiada (REGLAS §7.10), la
// Mayéutica (una sola fuente de preguntas: las de las fichas 4-6, js/data/mayeutica/b2-hemostasia.js, más 4 de
// «predice y compruébalo» que necesitan el dibujo), los casos (los mismos de las fichas) y la prueba de las cifras
// (pruebasVaso). La escena vive en js/modules/libros/vaso-vivo-escena.js y la interfaz en vaso-vivo.js.
import { HEMODERIVADOS } from './hemoderivados-data.js';
import { MAYEUTICA_HEMOSTASIA } from './mayeutica/b2-hemostasia.js';
import { RELOJ, PESO, tnkMg, tableroPlaca, frasePlaca, GUIA_PLACA, GUIA_ANTIAG, GUIA_LISIS, topesReloj as topesSca } from './vaso-vivo-data-sca.js';
import { BASE_TEP, tableroTep, fraseTep, topesTep, GUIA_TEP } from './vaso-vivo-data-tep.js';
export { RELOJ, OCLUSIONES, OCL_ORDEN, PESO, tnkMg } from './vaso-vivo-data-sca.js';
export const topesReloj = e => (e.emb ? topesTep(e) : topesSca(e));   // el émbolo (EP) tiene sus propios topes

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const copia = o => JSON.parse(JSON.stringify(o));
export const mil = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const PDF = 'docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf';

/* ============================================================
   El estado (la hoja de órdenes) y lo que se deriva de él
   ============================================================ */
// lesion: 'ninguna' | 'herida' | 'grande' (lesión estructural, propensa a sangrar); t: el tiempo de la herida (1-4);
// plaq: plaquetas/µL; causa: 'ninguna' | 'sepsis' | 'hit' | 'edta' | 'cid' | 'ptt' | 'shu' | 'mat' (esquistocitos sin
// saber aún cuál: solo en los casos); vari: la variante de la causa (CID séptica, obstétrica o fulminante; SHU típico o
// atípico); hep: la heparina en la HIT ('curso' | 'retirada' | 'argatroban'); rep: lo que se repone ('plaquetas',
// 'pfc', 'warf-pfc', 'ccp4f', 'masiva', 'crio', 'fibconc', 'recambio', 'lena'); previas: qué transfusión de plaquetas
// es (1, 3 o 5); abo: plaquetas ABO-compatibles. La arteria que se tapa (lesion 'placa'): ocl, horas y ntg, en
// vaso-vivo-data-sca.js.
export function estadoBase() {
    return { lesion: 'ninguna', t: 4, plaq: 250000, causa: 'ninguna', vari: null, hep: 'curso', rep: null, previas: 1, abo: false, ocl: 'completa', horas: RELOJ.inicio, ntg: false, asa: false, p2y: null, iib: null, lisis: false, peso: PESO.inicio, hic: false, ictus: false, alasa: false, morfina: false, clcr: 0, ...BASE_TEP };
}
export const estadoDe = parcial => Object.assign(estadoBase(), copia(parcial || {}));
export const MAT = c => c === 'cid' || c === 'ptt' || c === 'shu' || c === 'mat';
// Plaquetas que pone cada causa al elegirla en el dock (ilustrativas: la fuente da flechas, no cifras; la HIT, «cae un
// 50 %» desde 230.000)
export const PLAQ_CAUSA = { ninguna: 250000, sepsis: 60000, hit: 115000, edta: 250000, cid: 40000, ptt: 20000, shu: 50000, mat: 22000 };
// El mando de las plaquetas: 5.000-400.000/µL, en escala logarítmica, con las marcas de la ficha (p. 21, 29-30)
export const PLAQ_MIN = 5000, PLAQ_MAX = 400000;
export const MARCAS = [5000, 10000, 20000, 50000, 100000, 150000, 400000];
export const plaqDe = v => { const p = PLAQ_MIN * (PLAQ_MAX / PLAQ_MIN) ** (clamp(v, 0, 1000) / 1000); for (const m of MARCAS) if (Math.abs(p - m) / m < 0.06) return m; return p >= 20000 ? Math.round(p / 5000) * 5000 : Math.round(p / 1000) * 1000; };
export const vDe = p => Math.round(1000 * Math.log(clamp(p, PLAQ_MIN, PLAQ_MAX) / PLAQ_MIN) / Math.log(PLAQ_MAX / PLAQ_MIN));
// Cuánto del tapón se llega a formar con cada recuento: el corte de 100.000 es de la ficha (p. 21); el tamaño de lo
// que se forma por debajo, ilustrativo.
export const llenadoDe = p => (p >= 100000 ? 1 : p >= 50000 ? 0.5 : p >= 20000 ? 0.32 : p >= 10000 ? 0.2 : 0.12);

// Fig. 13.2 (p. 31): aumento medio de plaquetas (miles/µL) a la hora y a las 24 h tras la 1.ª, 3.ª y 5.ª transfusión.
// Lectura aproximada de las barras del libro.
export const FIG132 = { 1: [66, 38], 3: [54.5, 20], 5: [51, 26] };
// Texto (p. 30): una unidad sube 35.000-50.000 a la hora en un adulto medio que no sangra; a las 24 h, ~40 % menos.
export const SUBE = HEMODERIVADOS.plaquetas;
export const SUBE_HORA = [35000, 50000], MENOS_24H = 0.4;
// Fig. 13.3 (p. 34): PFC 12 mL/kg en críticos sin sangrado antes de un procedimiento (medianas)
export const FIG133 = { inr: [1.8, 1.4], at: [38, 50] };
// Hemorragia masiva del caso de Salvador (H5): fibrinógeno 120 mg/dL (del caso); crio 1 U/10 kg: +50 sin sangrado (p. 35)
export const FIB_CASO = 120, FIB_CRIO = 50;

export function derivar(e) {
    const d = { mat: MAT(e.causa) };
    // En la hemorragia masiva el tapón se queda corto (falta fibrinógeno); con el crio o el concentrado se rehace en lo
    // que dejan las plaquetas. Cuánto: ilustrativo (la ficha da el umbral y lo que sube el crio, no el tapón).
    d.fill = e.causa === 'cid' || e.rep === 'masiva' ? 0.35 : llenadoDe(e.plaq);
    const masiva = ['masiva', 'crio', 'fibconc'].includes(e.rep);
    d.sangra = 0;
    if (e.lesion === 'grande' && (e.plaq < 100000 || e.rep === 'masiva' || e.causa === 'cid')) d.sangra = 2;
    else if (e.lesion === 'grande' && masiva) d.sangra = 1;   // repuesto el fibrinógeno, aún rezuma: sangrando hace falta más (p. 35)
    else if (e.lesion === 'herida' && (e.plaq < 100000 || e.causa === 'cid')) d.sangra = e.causa === 'cid' && e.vari === 'obstetrica' ? 2 : 1;
    d.cierra = e.lesion !== 'ninguna' && !d.sangra;
    // Los órganos de la red (0 apagado, 1 aviso, 2 encendido) y los microtrombos de sus capilares
    d.organos = { pulmon: 0, rinon: 0, cerebro: 0, piel: 0 }; d.rotOrg = {}; d.nudos = {}; d.tipoNudo = 'plaq';
    if (e.causa === 'cid') {
        const n = e.rep === 'lena' ? 3 : e.vari === 'obstetrica' ? 1 : 2, lvl = e.vari === 'obstetrica' && e.rep !== 'lena' ? 1 : 2;
        d.nudos = { pulmon: n, rinon: n, cerebro: n, piel: e.vari === 'fulminante' ? 3 : 0 };
        d.organos = { pulmon: lvl, rinon: lvl, cerebro: lvl, piel: e.vari === 'fulminante' ? 2 : 0 };
        if (e.vari === 'fulminante') d.rotOrg.piel = 'necrosis';
        d.tipoNudo = 'fibrina';
    } else if (e.causa === 'ptt') {
        d.nudos = e.rep === 'recambio' ? { rinon: 1, cerebro: 1 } : { pulmon: 1, rinon: 1, cerebro: 3 };
        // la alteración mental es de su péntada, pero puede ser leve o faltar (p. 27): el cerebro, en aviso
        d.organos = { pulmon: 0, rinon: 1, cerebro: 1, piel: 0 }; d.rotOrg.rinon = 'leve'; d.rotOrg.cerebro = 'leve o nada'; d.tipoNudo = 'fvw';
    } else if (e.causa === 'shu') {
        d.nudos = { rinon: 3 }; d.organos.rinon = 2; d.rotOrg.rinon = 'fracasa'; d.tipoNudo = 'fvw';
        if (e.vari === 'atipico') { d.organos.cerebro = 1; d.rotOrg.cerebro = '~20 %'; d.nudos.cerebro = 1; }
    } else if (e.causa === 'mat') d.nudos = e.rep === 'lena' ? { pulmon: 2, rinon: 3, cerebro: 3 } : { pulmon: 1, rinon: 2, cerebro: 2 };   // reponer plaquetas «echa leña» a la microtrombosis (mh-plaq-indicaciones); cuánto, ilustrativo
    else if (e.lesion === 'ninguna' && e.plaq < 10000 && !e.rep) { d.organos.cerebro = 1; d.rotOrg.cerebro = 'HIC rara'; }
    // La lupa que se abre sola y lo que va bajo la arteriola en vez de la red
    d.lupaAuto = e.lesion === 'placa' ? 'placa' : e.causa === 'edta' ? 'tubo' : e.causa === 'hit' ? (e.hep === 'argatroban' ? 'cascada' : 'plaqueta')
        : e.causa === 'cid' || e.causa === 'mat' ? 'frotis' : e.causa === 'ptt' && e.rep !== 'recambio' ? 'plaqueta'
        : e.causa === 'shu' ? (e.vari === 'atipico' ? 'complemento' : 'frotis')
        : e.lesion !== 'ninguna' && !masiva && e.causa === 'ninguna' && !e.rep ? 'herida' : null;
    d.pie = e.rep === 'plaquetas' ? 'fig132' : ['pfc', 'warf-pfc', 'ccp4f'].includes(e.rep) ? 'balanza' : masiva ? 'masiva' : e.rep === 'recambio' ? 'recambio' : null;
    // Cuántas plaquetas y factores corren por la luz (ilustrativo)
    d.fPlaq = d.mat ? 0.25 : e.causa === 'hit' ? 0.7 : e.causa === 'edta' ? 1 : Math.min(1, Math.sqrt(e.plaq / 250000));
    d.fFactor = e.causa === 'cid' ? 0 : 1;
    d.factorHueco = e.rep === 'warf-pfc';
    d.bolsa = e.rep === 'plaquetas' || e.rep === 'lena' ? 'plaquetas' : null;
    d.masiva = masiva;
    return d;
}

/* ============================================================
   El tablero: 8 casillas. En las microangiopatías, flechas: la Tabla 13.3 solo dice alto, bajo o normal.
   Cada casilla: { k, n (nombre), v (valor), u (unidad o sub), o (origen), ilu, cls ('alarma' | 'aviso' | 'bien' | '') }
   ============================================================ */
export const CELDAS = ['plaq', 'tapon', 'inr', 'aptt', 'fib', 'dd', 'esq', 'amenaza'];
export function tableroDe(e) {
    if (e.lesion === 'placa') return e.emb ? tableroTep(e) : tableroPlaca(e);
    const d = derivar(e), mat = d.mat;
    const C = (n, v, u, o, cls = '', ilu = false) => ({ n, v, u, o, cls, ilu });
    const fis = n => C(n, 'normal', '', 'fisiol.', 'bien', true);
    const c = {};
    // Plaquetas
    if (mat) c.plaq = C('Plaquetas', '↓', 'bajas', 'ficha · p. 26', 'alarma');
    else if (e.causa === 'hit') c.plaq = C('Plaquetas', '−50 %', 'rara vez <20.000', 'ficha · p. 23', 'aviso');
    else if (e.causa === 'edta') c.plaq = C('Plaquetas', 'falsa ↓', 'en el tubo', 'ficha · p. 21', 'aviso');
    else if (e.rep === 'plaquetas' && e.previas === 1) c.plaq = C('Plaquetas', `${mil((e.plaq + SUBE_HORA[0]) / 1000)}-${mil((e.plaq + SUBE_HORA[1]) / 1000)} mil`, `a la hora; 24 h: ${mil((e.plaq + SUBE_HORA[0] * (1 - MENOS_24H)) / 1000)}-${mil((e.plaq + SUBE_HORA[1] * (1 - MENOS_24H)) / 1000)} mil`, 'p. 30 · desde 20.000: ilustr.', 'bien', true);
    else if (e.rep === 'plaquetas') c.plaq = C('Plaquetas', e.previas === 5 ? '−25 %' : '−17 %', `aumento, ${e.previas}.ª transf.`, e.previas === 5 ? 'ficha · p. 30' : 'ficha · p. 31', 'aviso', e.previas !== 5);
    else {
        const corte = [100000, 10000, 5000].includes(e.plaq), normal = e.plaq >= 150000 && e.plaq <= 400000;
        const delCaso = ['masiva', 'crio', 'fibconc'].includes(e.rep) && [46000, 88000].includes(e.plaq);
        c.plaq = C('Plaquetas', mil(e.plaq), delCaso ? '/µL · del caso' : '/µL', corte ? 'ficha · p. 21' : normal ? 'ficha · p. 30' : 'ilustr.', e.plaq < 10000 ? 'alarma' : e.plaq < 100000 ? 'aviso' : 'bien', !corte && !normal);
    }
    // Tapón
    if (e.lesion === 'ninguna') c.tapon = C('Tapón', '—', 'sin herida', '');
    else if (e.causa === 'cid') c.tapon = C('Tapón', 'no cierra', 'consumo', 'ficha · p. 27', 'alarma');
    else if (e.rep === 'masiva') c.tapon = C('Tapón', 'no cierra', 'falta fibrinógeno', 'ilustr.', 'alarma', true);
    else if (e.plaq < 100000) c.tapon = C('Tapón', 'no cierra', '<100.000', 'ficha · p. 21', 'alarma');
    else if (d.masiva) c.tapon = C('Tapón', 'se rehace', 'aún rezuma', 'ilustr.', 'aviso', true);
    else c.tapon = C('Tapón', ['se pega', 'anclado', 'trombo', 'contraído'][e.t - 1], `tiempo ${e.t}`, 'ficha · p. 20-21', 'bien');
    // INR y aPTT
    if (e.causa === 'cid') { c.inr = C('INR', '↑', 'elevado', 'ficha · p. 26', 'alarma'); c.aptt = C('aPTT', '↑', 'alargado', 'ficha · p. 26', 'alarma'); }
    else if (e.causa === 'mat') { c.inr = C('INR', '?', 'pendiente', ''); c.aptt = C('aPTT', '?', 'pendiente', ''); }
    else if (mat) { c.inr = C('INR', 'normal', '', 'ficha · p. 26', 'bien'); c.aptt = C('aPTT', 'normal', '', 'ficha · p. 26', 'bien'); }
    else if (e.rep === 'pfc') { c.inr = C('INR', `${FIG133.inr[0]}→${FIG133.inr[1]}`.replace(/\./g, ','), 'mediana', 'ficha · p. 34', 'aviso'); c.aptt = C('aPTT', '—', 'sin dato', ''); }
    else if (e.rep === 'warf-pfc') { c.inr = C('INR', '↑ → baja', 'tras descongelar', 'ficha · p. 33', 'aviso'); c.aptt = C('aPTT', '—', 'sin dato', ''); }
    else if (e.rep === 'ccp4f') { c.inr = C('INR', 'revierte', '<30 min', 'ficha · p. 33', 'bien'); c.aptt = C('aPTT', '—', 'sin dato', ''); }
    else if (e.causa === 'hit') { c.inr = C('INR', '—', 'sin dato', ''); c.aptt = e.hep === 'argatroban' ? C('aPTT', '1,5-3×', 'objetivo', 'ficha · p. 25', 'aviso') : C('aPTT', '—', 'sin dato', ''); }
    else { c.inr = fis('INR'); c.aptt = fis('aPTT'); }
    // Fibrinógeno (con el PFC, la antitrombina: la otra mitad de la Fig. 13.3)
    if (e.causa === 'cid') c.fib = C('Fibrinógeno', '↓', 'bajo', 'ficha · p. 26', 'alarma');
    else if (e.causa === 'mat') c.fib = C('Fibrinógeno', '?', 'pendiente', '');
    else if (mat) c.fib = C('Fibrinógeno', 'normal', '', 'ficha · p. 26', 'bien');
    else if (e.rep === 'masiva') c.fib = C('Fibrinógeno', String(FIB_CASO), 'mg/dL · del caso', 'ilustr.', 'alarma', true);
    else if (e.rep === 'crio') c.fib = C('Fibrinógeno', `+${FIB_CRIO}`, 'mg/dL, 1 U/10 kg', 'ficha · p. 35', 'aviso');
    else if (e.rep === 'fibconc') c.fib = C('Fibrinógeno', '20 g/L', 'fijo, sin descongelar', 'ficha · p. 35', 'bien');
    else if (e.rep === 'pfc') c.fib = C('Antitrombina', `${FIG133.at[0]}→${FIG133.at[1]} %`, 'mediana', 'ficha · p. 34', 'aviso');
    else c.fib = C('Fibrinógeno', 'normal', '200-400 mg/dL', 'fisiol.', 'bien', true);
    // Dímero-D
    if (e.causa === 'cid') c.dd = C('Dímero-D', '↑', 'fibrinólisis', 'ficha · p. 27', 'alarma');
    else if (e.causa === 'mat') c.dd = C('Dímero-D', '?', 'pendiente', '');
    else if (mat) c.dd = C('Dímero-D', 'normal', '', 'ficha · p. 26', 'bien');
    else c.dd = fis('Dímero-D');
    // Esquistocitos
    c.esq = mat ? C('Esquistocitos', 'sí', 'en el frotis', 'ficha · p. 26', 'alarma') : C('Esquistocitos', 'no', '', '');
    // Lo que amenaza
    if (e.causa === 'hit') c.amenaza = C('Amenaza', 'trombosis', 'no sangrado', 'ficha · p. 23', 'alarma');
    else if (e.causa === 'ptt' || e.causa === 'shu' || e.causa === 'mat') c.amenaza = C('Amenaza', 'trombosis', '', 'ficha · p. 36', 'alarma');
    else if (e.causa === 'cid') c.amenaza = C('Amenaza', 'las dos', e.vari === 'obstetrica' ? 'manda el sangrado' : 'manda la trombosis', 'ficha · p. 27', 'alarma');
    else if (d.masiva || d.sangra === 2) c.amenaza = C('Amenaza', 'sangrado', '', d.masiva ? 'ficha · p. 32' : 'ficha · p. 21', 'alarma');
    else if (e.plaq < 10000 && !e.rep) c.amenaza = C('Amenaza', 'HIC', 'poco frecuente', 'ficha · p. 21', 'aviso');
    else c.amenaza = C('Amenaza', '—', '', '');
    return c;
}

/* ============================================================
   La frase viva: qué se ve y por qué, con su origen (ficha#párrafo · página). El orden es el de prioridad.
   Devuelve [html, origen] o, en la herida, la frase de su tiempo.
   ============================================================ */
const F4 = 'ficha · merino-trombocitopenia', F5 = 'ficha · merino-microangiopatias', F6 = 'ficha · merino-plaquetas-plasma';
export function fraseDe(e) {
    if (e.lesion === 'placa') return e.emb ? fraseTep(e) : frasePlaca(e);
    const d = derivar(e);
    if (e.rep === 'recambio') return ['El tratamiento de la PTT es el <span class="hl-azul">recambio plasmático</span>: se separa y se desecha el plasma del paciente, y se le devuelven sus hematíes con plasma de un donante sano. Unas 1,5 veces el volumen de plasma cada día, hasta plaquetas normales <span class="hl">2 días seguidos</span>; si empieza en las primeras 48 h, <span class="hl-verde">sobrevive hasta el 90 %</span>.', `${F5}#mh-ptt · p. 28`];
    if (e.rep === 'lena' && e.causa === 'mat') return ['Las indicaciones de transfusión de plaquetas <span class="hl-rojo">no se aplican</span> a la trombocitopenia por consumo de las microangiopatías: transfundirlas puede agravar la microtrombosis. Cuántos nudos más: ilustrativo.', `${F6}#mh-plaq-indicaciones · p. 29`];
    if (e.rep === 'lena') return ['Reponer plaquetas y factores en la CID no suele parar el sangrado y puede <span class="hl-rojo">«echar leña»</span> a la microtrombosis. No hay tratamiento eficaz: soporte y tratar la causa. Con fallo multiorgánico, la mortalidad es <span class="hl-rojo">≥80 %</span>.', `${F5}#mh-cid · p. 27`];
    if (e.rep === 'plaquetas') {
        if (e.abo) return ['Plaquetas <span class="hl-verde">ABO-compatibles</span>: atenúan la refractariedad. Cuánto, la fuente no lo dice: por eso las barras no cambian.', `${F6}#mh-plaq-respuesta · p. 30`];
        if (e.previas > 1) return [`Cuantas más transfusiones, menos sube: tras 5, el aumento es <span class="hl">un 25 % menor</span>. Es la refractariedad: el receptor hace anticuerpos contra los antígenos ABO de las plaquetas del donante.${e.previas === 3 ? ' La barra de la 3.ª es una lectura aproximada de la figura.' : ''}`, `${F6}#mh-plaq-respuesta · p. 30 · Fig. 13.2 · p. 31`];
        return ['Una unidad de plaquetas sube el recuento <span class="hl-verde">35.000-50.000 a la hora</span> en un adulto medio que no sangra; a las 24 h, el aumento es <span class="hl">un 40 % menor</span>. Si sangra, se buscan más de 50.000; dentro del cráneo, más de 100.000.', `${F6}#mh-plaq-respuesta · p. 29-30 · desde 20.000: ilustrativo`, true];
    }
    if (e.rep === 'pfc') return ['El INR solo mira <span class="hl-azul">un plato de la balanza</span>: los factores que dependen de la vitamina K (II, VII, IX y X). El PFC trae también anticoagulantes: con 12 mL/kg el INR bajó de 1,8 a 1,4, pero la antitrombina subió del 38 al 50 %. <span class="hl-rojo">La coagulación puede quedar casi igual.</span>', `${F6}#mh-trampa-inr · p. 33-34`];
    if (e.rep === 'warf-pfc') return ['Warfarina y un sangrado que preocupa: primero <span class="hl">vitamina K</span>, para cortar la anticoagulación en curso. El PFC (10-15 mL/kg) devuelve el INR a la normalidad, pero hay que descongelarlo (retrasa) y <span class="hl-rojo">su volumen puede agravar el sangrado</span>.', `${F6}#mh-pfc-warfarina · p. 33`];
    if (e.rep === 'ccp4f') return ['El CCP4F trae en polvo los cuatro factores que dependen de la vitamina K (II, VII, IX y X): <span class="hl-verde">100 mL y menos de 30 min</span> para revertir la warfarina. Ni descongelar ni cargar volumen.', `${F6}#mh-pfc-warfarina · p. 33`];
    if (e.rep === 'crio') return ['Crio en el trauma si el fibrinógeno baja a <span class="hl">150-200 mg/dL</span>. 1 unidad por cada 10 kg lo sube unos 50 mg/dL <span class="hl-rojo">sin sangrado</span>: sangrando, hará falta más. Descongelado, se usa en 4 h; puede guiarse por tromboelastografía.', `${F6}#mh-crio · p. 35`];
    if (e.rep === 'fibconc') return ['El concentrado de fibrinógeno trae siempre <span class="hl-verde">20 g/L</span> y no hay que descongelarlo. El crio (10-20 g/L, variable) tarda en descongelarse y no pasa por la reducción de patógenos: por eso el concentrado gana terreno.', `${F6}#mh-crio · p. 35`];
    if (e.rep === 'masiva') return ['Hemorragia masiva: perder el equivalente a la volemia en 24 h. Se repone <span class="hl">1 PFC por cada 1-2 CH</span>. El fibrinógeno es <span class="hl-rojo">el primer factor que se agota</span>, y los sueros lo diluyen.', `${F6}#mh-pfc-masiva · p. 32 y 35 · fibrinógeno 120: del caso`];
    if (e.causa === 'edta') return ['En el tubo con EDTA, unos anticuerpos contra el EDTA <span class="hl-azul">agrupan las plaquetas</span>; la máquina lee los grumos como leucocitos y da un recuento falsamente bajo (<span class="hl">2 %</span> de los recuentos en el hospital). Repite en un tubo con citrato o heparina.', `${F4}#mh-pseudotrombo · p. 21`];
    if (e.causa === 'sepsis') return ['La sepsis es <span class="hl">la causa más frecuente</span> de trombocitopenia en la UCI: los <span class="hl-azul">macrófagos destruyen más plaquetas</span>. La trombocitopenia llega hasta el 60 % de los críticos.', `${F4}#mh-trombo-sepsis · p. 21 · 60.000: ilustrativo`, true];
    if (e.causa === 'hit') {
        if (e.hep === 'argatroban') return ['Argatrobán: frena la trombina (IIa) directamente. <span class="hl">1-2 µg/kg/min</span>, ajustado a un aPTT de 1,5-3 veces el normal; 0,5 si hay insuficiencia hepática; <span class="hl-verde">sin ajuste renal</span>. Dosis plenas hasta que las plaquetas pasen de 150.000; la warfarina, contraindicada en la fase aguda.', `${F4}#mh-argatroban · p. 24-25`];
        if (e.hep === 'retirada') return ['Quitar la heparina <span class="hl-rojo">no basta</span> (la HIT sale incluso con los lavados de catéter): toda HIT lleva un anticoagulante sin heparina a dosis plenas, aunque no haya trombosis. Si se retrasa, las trombosis son 10 veces más.', `${F4}#mh-hit-toda · p. 23-24`];
        return ['La heparina se une al <span class="hl-azul">FP4</span> de las plaquetas y contra ese complejo se hacen IgG, que las encienden. El peligro es la <span class="hl-rojo">trombosis</span>, no el sangrado: sin tratar, tromboembolia venosa en el 17-55 % y trombosis arterial en el 1-3 %.', `${F4}#mh-hit-clinica · p. 22-23`];
    }
    if (e.causa === 'cid') {
        if (e.vari === 'obstetrica') return ['CID de una urgencia obstétrica (embolia de líquido amniótico, desprendimiento de placenta, eclampsia, feto retenido): el mismo consumo de plaquetas y factores, pero aquí <span class="hl-rojo">manda el sangrado</span>.', `${F5}#mh-cid · p. 26-27`];
        if (e.vari === 'fulminante') return ['Púrpura fulminante: una forma grave de CID, con <span class="hl-rojo">necrosis y gangrena de los miembros</span>, en infecciones arrolladoras; sobre todo, la meningococemia.', `${F5}#mh-cid · p. 27`];
        return ['CID: se libera factor tisular y la coagulación <span class="hl-azul">arranca en toda la sangre</span>. Los microtrombos dañan pulmón, riñón y sistema nervioso central y gastan plaquetas y factores; lo que falta hace sangrar. En la sepsis <span class="hl-rojo">manda la trombosis</span>.', `${F5}#mh-cid · p. 26-27`];
    }
    if (e.causa === 'ptt') return ['PTT: aparecen anticuerpos que <span class="hl-azul">inactivan la ADAMTS-13</span>, la proteasa que corta el FvW. Sin ella, las plaquetas se pegan sin control y la microcirculación se llena de trombos. INR, aPTT y fibrinógeno, normales; la creatinina suele estar por debajo de 2 mg/dL.', `${F5}#mh-ptt · p. 27-28`];
    if (e.causa === 'shu') {
        if (e.vari === 'atipico') return ['SHU atípico: hereditario, con el <span class="hl-azul">complemento activado sin control</span>. El eculizumab, una IgG que se une a C5, lo ha revertido; si no lo hay, recambio plasmático. En un 20 % hay clínica fuera del riñón, sobre todo neurológica.', `${F5}#mh-shu · p. 28-29`];
        return ['SHU: trombocitopenia, fracaso renal agudo y anemia hemolítica microangiopática. Como en la PTT, no se gastan factores, pero <span class="hl-rojo">el riñón cae más</span>. Lo más frecuente es, probablemente, una infección (<i>E. coli</i> con toxina Shiga, neumococo, gripe): soporte y tratar la infección.', `${F5}#mh-shu · p. 28-29`];
    }
    if (e.causa === 'mat') return ['Esquistocitos: hematíes que se rompen al pasar por una microcirculación llena de coágulos. Confirman una <span class="hl-azul">anemia hemolítica microangiopática</span>; con plaquetas bajas, es una microangiopatía trombótica. Falta saber cuál.', `${F5}#mh-mat · p. 25-26`];
    if (e.lesion === 'grande') return d.sangra
        ? ['Una lesión propensa a sangrar y pocas plaquetas: <span class="hl-rojo">ahora el riesgo de hemorragia mayor es real</span> (el dibujo la hace sangrar). El recuento solo no lo decide: hace falta, además, la lesión.', `${F4}#mh-trombo-umbral · p. 21 · que sangre: ilustrativo`, true]
        : ['Una lesión estructural con más de 100.000 plaquetas: el tapón todavía se puede formar (aquí el dibujo lo cierra). Baja las plaquetas por debajo de 100.000 y mira qué pasa.', `${F4}#mh-trombo-umbral · p. 21 · que cierre: ilustrativo`, true];
    if (e.lesion === 'herida') {
        if (e.plaq < 100000) return ['Por debajo de 100.000 el tapón <span class="hl-rojo">ya no se forma bien</span>. Para una hemorragia mayor hace falta, además, una lesión propensa a sangrar: prueba «Estructural» en Herida.', `${F4}#mh-trombo-umbral · p. 21 · el tamaño del tapón: ilustrativo`, true];
        if (e.plaq < 150000) return ['Con 100.000 el tapón <span class="hl-verde">todavía se forma</span>; por debajo, ya no. Por eso «menos de 100.000» señala mejor la trombocitopenia que importa que la definición clásica, «menos de 150.000».', `${F4}#mh-trombo-umbral · p. 21`];
        return [
            ['1 · Se rompen el endotelio y su glucocálix: las plaquetas <span class="hl-azul">se pegan al colágeno</span> de debajo. Empieza el tapón: la hemostasia primaria.', `${F4}#mh-hemostasia-primaria · p. 20`],
            ['2 · Las plaquetas sueltan calcio, que enciende su receptor <span class="hl-azul">GPIIb/IIIa</span>: se une sin vuelta atrás al FvW de las células de alrededor (ancla el tapón a la pared) y también al fibrinógeno.', `${F4}#mh-hemostasia-primaria · p. 20`],
            ['3 · Del subendotelio sale tromboplastina y arranca la vía del <span class="hl-azul">factor tisular</span>, la principal; la de contacto también. Las dos llevan a activar la protrombina (II) y el fibrinógeno (I) pasa a fibrina: la hemostasia secundaria.', `${F4}#mh-vias-coagulacion · p. 21`],
            ['4 · Los puentes de fibrina entre las plaquetas estabilizan el tapón y lo <span class="hl-azul">contraen</span>: <span class="hl-verde">el flujo vuelve</span>. El trombo es eso: plaquetas en una malla de fibrina, ancladas a la herida.', `${F4}#mh-hemostasia-primaria · p. 20-21`],
        ][e.t - 1];
    }
    if (e.plaq < 10000) return [`Con ${mil(e.plaq)} y <span class="hl-verde">sin una lesión propensa a sangrar</span>: sin esa lesión se toleran recuentos de hasta 5.000 sin hemorragia mayor. Por debajo de 10.000, el riesgo es la hemorragia cerebral espontánea, y es <span class="hl">poco frecuente</span>. Pon una lesión estructural en Herida.`, `${F4}#mh-trombo-umbral · p. 21`];
    if (e.plaq < 100000) return [`Sin herida no hay tapón que hacer: con ${mil(e.plaq)} plaquetas y sin una lesión que sangre, el número solo no decide la hemorragia.`, `${F4}#mh-trombo-umbral · p. 21`];
    return ['El glucocálix mantiene la sangre <span class="hl-azul">fluida</span>: no deja que plaquetas ni leucocitos se peguen al endotelio y, al notar el roce del flujo, hace que el endotelio suelte óxido nítrico, que dilata. Toca la pared para abrir una herida.', `${F4}#mh-glucocalix · p. 20`];
}

/* ============================================================
   Estados con nombre (los que abre data-vaso-vivo="<estado>"): n (nombre), s (sub), p (el estado), grupo (dónde va su
   chip), pestana (la del dock), ficha (la de su tema), play (los 4 tiempos de la herida). Sus fuentes (REGLAS §7.11) y
   su explicación guiada, en GUIAS: ESTADOS[k].fuentes se rellena con ellas.
   ============================================================ */
export const ESTADOS = {
    sano: { n: 'Sano', s: 'el glucocálix', p: {}, grupo: 'trombo', pestana: 'herida', ficha: 'merino-trombocitopenia' },
    herida: { n: 'La herida', s: 'los 4 tiempos', p: { lesion: 'herida', t: 1 }, play: true, grupo: 'trombo', pestana: 'herida', ficha: 'merino-trombocitopenia' },
    'plaquetas-100k': { n: '100.000', s: 'el corte útil', p: { lesion: 'herida', t: 4, plaq: 100000 }, grupo: 'trombo', pestana: 'plaquetas', ficha: 'merino-trombocitopenia' },
    'plaquetas-5k': { n: '5.000', s: 'sin lesión', p: { plaq: 5000 }, grupo: 'trombo', pestana: 'plaquetas', ficha: 'merino-trombocitopenia' },
    pseudotrombocitopenia: { n: 'Pseudotrombocitopenia', s: 'el tubo', p: { causa: 'edta' }, grupo: 'trombo', pestana: 'causa', ficha: 'merino-trombocitopenia' },
    sepsis: { n: 'Sepsis', s: 'macrófagos', p: { causa: 'sepsis', plaq: PLAQ_CAUSA.sepsis }, grupo: 'trombo', pestana: 'causa', ficha: 'merino-trombocitopenia' },
    hit: { n: 'HIT', s: 'FP4 e IgG', p: { causa: 'hit', plaq: PLAQ_CAUSA.hit }, grupo: 'trombo', pestana: 'causa', ficha: 'merino-trombocitopenia' },
    'hit-argatroban': { n: 'HIT: argatrobán', s: 'sin heparina', p: { causa: 'hit', hep: 'argatroban', plaq: PLAQ_CAUSA.hit }, grupo: 'trombo', pestana: 'farmaco', ficha: 'merino-trombocitopenia' },
    cid: { n: 'CID', s: 'consumo', p: { causa: 'cid', vari: 'septica', lesion: 'herida', t: 4, plaq: PLAQ_CAUSA.cid }, grupo: 'mat', pestana: 'causa', ficha: 'merino-microangiopatias' },
    'cid-lena': { n: 'CID: reponer', s: 'echar leña', p: { causa: 'cid', vari: 'septica', lesion: 'herida', t: 4, plaq: PLAQ_CAUSA.cid, rep: 'lena' }, grupo: 'mat', pestana: 'plasma', ficha: 'merino-microangiopatias' },
    ptt: { n: 'PTT', s: 'sin ADAMTS-13', p: { causa: 'ptt', plaq: PLAQ_CAUSA.ptt }, grupo: 'mat', pestana: 'causa', ficha: 'merino-microangiopatias' },
    'ptt-recambio': { n: 'PTT: recambio', s: 'cada día', p: { causa: 'ptt', plaq: PLAQ_CAUSA.ptt, rep: 'recambio' }, grupo: 'mat', pestana: 'plasma', ficha: 'merino-microangiopatias' },
    shu: { n: 'SHU', s: 'el riñón', p: { causa: 'shu', vari: 'tipico', plaq: PLAQ_CAUSA.shu }, grupo: 'mat', pestana: 'causa', ficha: 'merino-microangiopatias' },
    'transfusion-plaquetas': { n: 'Transfundir plaquetas', s: '1 unidad', p: { rep: 'plaquetas', previas: 1, plaq: 20000 }, grupo: 'reponer', pestana: 'plaquetas', ficha: 'merino-plaquetas-plasma' },
    refractariedad: { n: 'Refractariedad', s: '5.ª transfusión', p: { rep: 'plaquetas', previas: 5, plaq: 20000 }, grupo: 'reponer', pestana: 'plaquetas', ficha: 'merino-plaquetas-plasma' },
    'pfc-inr': { n: 'El PFC y el INR', s: 'la balanza', p: { rep: 'pfc' }, grupo: 'reponer', pestana: 'plasma', ficha: 'merino-plaquetas-plasma' },
    warfarina: { n: 'Warfarina', s: 'vitamina K y CCP4F', p: { rep: 'warf-pfc' }, grupo: 'reponer', pestana: 'plasma', ficha: 'merino-plaquetas-plasma' },
    placa: { n: 'La placa que se rompe', s: 'los 4 tiempos', p: { lesion: 'placa', t: 1 }, play: true, grupo: 'arteria', pestana: 'arteria', ficha: 'mc-sca-diagnostico' },
    'placa-antiagregantes': { n: 'Los antiagregantes', s: 'tres interruptores', p: { lesion: 'placa', t: 4, ocl: 'completa', horas: 1, asa: true, p2y: 'ticagrelor', iib: 'eptifibatida' }, grupo: 'arteria', pestana: 'tratar', ficha: 'mc-sca-tratamiento' },
    'tep-lisis': { n: 'El émbolo y la lisis', s: 'evitar el siguiente', p: { lesion: 'placa', emb: true, t: 4, tto: 'heparina', horas: 6, peso: 80 }, grupo: 'arteria', pestana: 'tratar', ficha: 'neumo-ep-manejo' },
    trombolisis: { n: 'La trombólisis', s: 'plasmina y reloj', p: { lesion: 'placa', t: 4, ocl: 'completa', horas: 2, lisis: true, peso: 80 }, grupo: 'arteria', pestana: 'tratar', ficha: 'mc-sca-tratamiento' },
    'hemorragia-masiva': { n: 'Hemorragia masiva', s: 'el fibrinógeno', p: { rep: 'masiva', lesion: 'grande', t: 4, plaq: 46000 }, grupo: 'reponer', pestana: 'plasma', ficha: 'merino-plaquetas-plasma' },
};
export const GRUPOS_CHIPS = [['trombo', 'La herida y las plaquetas (trombocitopenia y HIT)'], ['mat', 'La red que se tapa (microangiopatías)'], ['reponer', 'Reponer (plaquetas y plasma)'], ['arteria', 'La arteria que se tapa: SCA y EP']];
// Qué estado con nombre es un estado cualquiera (o null)
export function claveDe(e) {
    for (const [k, s] of Object.entries(ESTADOS)) if (JSON.stringify(estadoDe(s.p)) === JSON.stringify(e)) return k;
    return null;
}

/* ============================================================
   La explicación guiada de cada estado (REGLAS §7.10): 3-5 pasos que señalan el dibujo (resalta) y llevan su cita
   (core/citas.js). En cada paso: `estado` (un estado con nombre o uno parcial), `lupa` (la que se abre; false = sin
   lupa) y `org` (el origen de lo que no sale de la cita).
   ============================================================ */
const L13 = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 13', pdf: PDF };
const TRB = (id, pag) => ({ ...L13, ficha: 'merino-trombocitopenia', id, pag });
const MA = (id, pag) => ({ ...L13, ficha: 'merino-microangiopatias', id, pag });
const PPL = (id, pag) => ({ ...L13, ficha: 'merino-plaquetas-plasma', id, pag });
// La máquina del telar: la Fig. 5.2 del cap. 5 (el Xa convierte la protrombina en trombina; la trombina, el fibrinógeno en fibrina)
const FIG52 = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 5', pdf: 'docs/marino-2024-practicas-monitorizacion-caps5-9.pdf', ficha: 'mar-tromboprofilaxis-farmacos', id: 'mar-img-5-2', pag: '4-6' };

// Warfarina: Marino cap. 19 (fibrilación auricular), p. 26 (mecanismo, ventana estrecha) y Tabla 19.3, p. 27 (INR 2-3)
const MAR19 = (id, pag) => ({ libro: 'Marino, The ICU Book (5.ª ed.), cap. 19', pdf: 'docs/marino-2024-cardiac-disorders-caps18-21.pdf', ficha: 'mc-fa-cardioversion', id, pag });

export const GUIAS = {
    placa: GUIA_PLACA,
    'placa-antiagregantes': GUIA_ANTIAG,
    trombolisis: GUIA_LISIS,
    'tep-lisis': GUIA_TEP,
    sano: [
        { t: 'El endotelio está cubierto por el glucocálix (la hierba dorada), una malla de mucopolisacáridos: una superficie que resiste la trombosis.', resalta: '#vso-zona-glucocalix', cita: TRB('mh-glucocalix', '20') },
        { t: 'Mantiene la sangre fluida: no deja que plaquetas ni leucocitos se peguen al endotelio. Mira cómo pasan las plaquetas sin tocar la pared.', resalta: '#vso-zona-luz', cita: TRB('mh-glucocalix', '20') },
        { t: 'Además nota el roce del flujo y hace que el endotelio suelte óxido nítrico, que dilata; y frena el paso de proteínas grandes, con lo que sostiene la presión oncótica del plasma.', resalta: '#vso-zona-glucocalix', cita: TRB('mh-glucocalix', '20') },
        { t: 'El recuento normal de plaquetas es de 150.000-400.000/µL.', resalta: '#vso-c-plaq', cita: PPL('mh-plaq-preparaciones', '30') },
    ],
    herida: [
        { t: 'Tiempo 1. Se rompen el endotelio y su glucocálix: asoma el colágeno del subendotelio y las plaquetas se pegan a él. Empieza el tapón: la hemostasia primaria.', estado: { lesion: 'herida', t: 1 }, lupa: 'herida', resalta: '#vso-h-colageno', cita: TRB('mh-hemostasia-primaria', '20') },
        { t: 'Tiempo 2. Las plaquetas sueltan calcio, que enciende su receptor GPIIb/IIIa: se une sin vuelta atrás al FvW de las células de alrededor, que ancla el tapón a la pared, y también al fibrinógeno.', estado: { lesion: 'herida', t: 2 }, lupa: 'herida', resalta: '#vso-h-fvw', cita: TRB('mh-hemostasia-primaria', '20') },
        { t: 'Tiempo 3. Del subendotelio sale tromboplastina: arranca la vía del factor tisular, la principal (el río grueso); la de contacto, por los cininógenos, es el fino. Las dos llevan a activar la protrombina (II) y el fibrinógeno (I) pasa a fibrina: la hemostasia secundaria.', estado: { lesion: 'herida', t: 3 }, lupa: 'herida', resalta: '#vso-h-rios', cita: [TRB('mh-hemostasia-secundaria', '21'), TRB('mh-vias-coagulacion', '21')] },
        { t: 'Tiempo 4. Los puentes de fibrina entre las plaquetas estabilizan el tapón y lo contraen, y el flujo vuelve. El trombo es eso: plaquetas en una malla de fibrina, ancladas a la pared en la herida.', estado: { lesion: 'herida', t: 4 }, lupa: 'herida', resalta: '#vso-h-tapon', cita: [TRB('mh-hemostasia-primaria', '20'), TRB('mh-hemostasia-secundaria', '21')] },
        { t: 'La cascada, de cerca: los dos ríos llevan a activar la protrombina (II). La máquina es la del telar (cap. 5): en ella, el Xa convierte la protrombina en trombina (IIa), y la trombina teje el fibrinógeno en hilos de fibrina.', estado: { lesion: 'herida', t: 4 }, lupa: 'cascada', resalta: '#vso-cas-maquina', cita: [TRB('mh-vias-coagulacion', '21'), FIG52] },
    ],
    'plaquetas-100k': [
        { t: 'Con 100.000 plaquetas la herida todavía se tapa: el tapón se forma entero.', lupa: 'herida', resalta: '#vso-h-tapon', cita: TRB('mh-trombo-umbral', '21') },
        { t: 'Por debajo de 100.000 ya no se forma bien: aquí, con 50.000, queda a medias y la herida rezuma.', estado: { lesion: 'herida', t: 4, plaq: 50000 }, lupa: 'herida', resalta: '#vso-h-tapon', cita: TRB('mh-trombo-umbral', '21'), org: 'el tamaño del tapón: ilustrativo' },
        { t: 'Por eso «menos de 100.000» señala mejor la trombocitopenia que importa que la definición clásica, «menos de 150.000». Es el trastorno hemostático más frecuente de la UCI: hasta el 60 %.', resalta: '#vso-c-plaq', cita: TRB('mh-trombo-umbral', '21') },
    ],
    'plaquetas-5k': [
        { t: '5.000 plaquetas y ninguna lesión: no sangra. Sin una lesión propensa a sangrar, recuentos tan bajos se toleran sin hemorragia mayor.', resalta: '#vso-zona-luz', cita: TRB('mh-trombo-umbral', '21') },
        { t: 'Por debajo de 10.000, el riesgo de verdad es la hemorragia cerebral espontánea, y es poco frecuente: el medallón del cerebro avisa.', resalta: '#vso-med-cerebro', cita: TRB('mh-trombo-umbral', '21') },
        { t: 'La misma cifra con una lesión estructural propensa a sangrar: ahora el riesgo de hemorragia mayor es real. El recuento solo no lo decide; hace falta, además, la lesión.', estado: { plaq: 5000, lesion: 'grande', t: 4 }, lupa: 'herida', resalta: '#vso-h-sangre', cita: TRB('mh-trombo-umbral', '21'), org: 'que sangre en el dibujo: ilustrativo' },
        { t: 'Por eso, sin sangrado activo, el problema no es el número sino la causa: las plaquetas profilácticas rara vez hacen falta.', estado: { plaq: 5000 }, lupa: false, resalta: '#vso-c-amenaza', cita: [PPL('mh-plaq-validez', '29'), PPL('mh-mensajes', '36')] },
    ],
    pseudotrombocitopenia: [
        { t: 'En el paciente, las plaquetas son normales: lo que falla es el tubo.', lupa: false, resalta: '#vso-zona-luz', cita: TRB('mh-pseudotrombo', '21') },
        { t: 'En el tubo con EDTA, unos anticuerpos contra el EDTA agrupan las plaquetas; la máquina lee los grumos como leucocitos y da un recuento falsamente bajo: el 2 % de los recuentos en el hospital.', lupa: 'tubo', resalta: '#vso-t-edta', cita: TRB('mh-pseudotrombo', '21') },
        { t: 'Se sospecha si la cifra es más baja de lo esperado o hay grumos en el frotis: repite el recuento en un tubo con citrato o heparina.', lupa: 'tubo', resalta: '#vso-t-citrato', cita: TRB('mh-pseudotrombo', '21') },
    ],
    sepsis: [
        { t: 'La sepsis es la causa más frecuente de trombocitopenia en la UCI.', resalta: '#vso-c-plaq', cita: TRB('mh-trombo-sepsis', '21'), org: '60.000: ilustrativo' },
        { t: 'El mecanismo: los macrófagos destruyen más plaquetas. Mira los macrófagos de la luz, con plaquetas dentro.', resalta: '#vso-macrofagos', cita: TRB('mh-trombo-sepsis', '21') },
        { t: 'Menos frecuentes pero más graves: la heparina (HIT) y las microangiopatías trombóticas (CID, PTT y SHU).', resalta: '#vso-zona-red', cita: TRB('mh-trombo-sepsis', '21') },
    ],
    hit: [
        { t: 'La heparina no es inmunógena por sí misma: se une al FP4 de las plaquetas y forma un complejo contra el que se hacen anticuerpos IgG.', lupa: 'plaqueta', resalta: '#vso-l-fp4', cita: TRB('mh-hit-mecanismo', '22') },
        { t: 'Las IgG se unen a las plaquetas y las encienden con fuerza: eso favorece la trombosis. El sistema reticuloendotelial retira parte de las plaquetas recubiertas. Los anticuerpos suelen desaparecer a los 3 meses de retirar la heparina.', lupa: false, resalta: '#vso-zona-luz', cita: TRB('mh-hit-mecanismo', '22') },
        { t: 'Por eso el peligro es la trombosis, no el sangrado: sin tratar, tromboembolia venosa en el 17-55 % y trombosis arterial (ictus, infarto) en el 1-3 %; en hasta el 25 %, la trombosis llega antes que la caída de plaquetas.', lupa: false, resalta: ['#vso-trombo-venoso', '#vso-trombo-arterial'], cita: TRB('mh-hit-clinica', '23') },
        { t: 'Las plaquetas caen un 50 %, rara vez por debajo de 20.000. Suele aparecer a los 5-10 días de la primera exposición (en menos de 24 h si hubo heparina en los 3 meses previos); rara vez, una HIT tardía sale hasta 3 semanas después.', lupa: false, resalta: '#vso-c-plaq', cita: TRB('mh-hit-clinica', '23'), org: '115.000 desde 230.000: ilustrativo' },
    ],
    'hit-argatroban': [
        { t: 'Se retira toda la heparina: la HIT no depende de la dosis y sale incluso con los lavados de catéter.', estado: { causa: 'hit', hep: 'retirada', plaq: PLAQ_CAUSA.hit }, lupa: 'plaqueta', resalta: '#vso-l-fp4', cita: TRB('mh-hit', '23') },
        { t: 'Quitarla no basta: toda HIT lleva un anticoagulante sin heparina a dosis plenas, aunque no haya trombosis. Si se retrasa, las trombosis son 10 veces más.', estado: { causa: 'hit', hep: 'retirada', plaq: PLAQ_CAUSA.hit }, lupa: false, resalta: '#vso-c-amenaza', cita: TRB('mh-hit-toda', '24') },
        { t: 'El argatrobán frena directamente la trombina: en la cascada, la IIa (la tejedora) queda tachada.', lupa: 'cascada', resalta: '#vso-cas-arg', cita: TRB('mh-argatroban', '25') },
        { t: '1-2 µg/kg/min, ajustado a un aPTT de 1,5-3 veces lo normal; 0,5 si hay insuficiencia hepática; sin ajuste renal; dosis plenas hasta que las plaquetas pasen de 150.000. La warfarina, contraindicada en la fase aguda (su efecto protrombótico puede dar gangrena de miembros y necrosis cutánea); si la recibió en los días previos, se revierte con vitamina K.', lupa: 'cascada', resalta: '#vso-c-aptt', cita: [TRB('mh-argatroban', '25'), TRB('mh-hit-warfarina', '24')] },
    ],
    cid: [
        { t: 'Una lesión extensa (shock séptico, trauma, urgencias obstétricas) libera factor tisular: la coagulación arranca en toda la sangre, no solo en una herida (las chispas de la luz).', lupa: false, resalta: '#vso-zona-luz', cita: MA('mh-cid', '26') },
        { t: 'Se forma fibrina en la microcirculación: microtrombos en toda la red, que dañan sobre todo pulmón, riñón y sistema nervioso central.', lupa: false, resalta: '#vso-zona-red', cita: MA('mh-cid', '27') },
        { t: 'Los microtrombos gastan plaquetas y factores: INR alto, aPTT alargado y fibrinógeno bajo. Lo que falta hace sangrar: la herida no se cierra.', lupa: false, resalta: ['#vso-c-inr', '#vso-c-fib'], cita: [MA('mh-tabla-13-3', '26'), MA('mh-cid', '27')] },
        { t: 'La fibrinólisis aumenta y sube el dímero-D. Los hematíes se rompen al pasar por la red llena de coágulos: son los esquistocitos del frotis (Fig. 13.1).', lupa: 'frotis', resalta: '#vso-lupa-peq', cita: [MA('mh-mat-dimero', '27'), MA('mh-fig-13-1', '26')] },
        { t: 'En la sepsis manda la trombosis; en las causas obstétricas, el sangrado. La púrpura fulminante (sobre todo, la meningococemia) es una forma grave, con necrosis y gangrena de los miembros.', lupa: 'frotis', resalta: '#vso-c-amenaza', cita: MA('mh-cid', '27') },
    ],
    'cid-lena': [
        { t: 'Si la hemorragia amenaza la vida se reponen hemoderivados, pero eso no suele parar el sangrado.', lupa: false, resalta: '#vso-bolsa', cita: MA('mh-cid', '27') },
        { t: 'Las plaquetas y los factores de la bolsa pueden «echar leña» a la microtrombosis: más nudos en la red.', lupa: false, resalta: '#vso-zona-red', cita: MA('mh-cid', '27') },
        { t: 'No hay tratamiento eficaz: soporte y tratar la causa. Con fallo multiorgánico, la mortalidad es ≥80 %. Por eso las indicaciones de plaquetas no valen en las microangiopatías.', lupa: false, resalta: '#vso-c-amenaza', cita: [MA('mh-cid', '27'), PPL('mh-plaq-indicaciones', '29')] },
    ],
    ptt: [
        { t: 'El factor de von Willebrand (FvW) es una proteína grande del endotelio que promueve la adhesión de las plaquetas; lo controla una proteasa, la ADAMTS-13, que lo corta.', lupa: 'plaqueta', resalta: '#vso-l-fvw', cita: MA('mh-ptt', '27') },
        { t: 'En la PTT aparecen anticuerpos que inactivan la ADAMTS-13 (no se sabe qué los desencadena): las plaquetas se pegan sin control y la microcirculación se llena de trombos.', lupa: 'plaqueta', resalta: '#vso-l-adamts', cita: MA('mh-ptt', '27') },
        { t: 'La coagulación no se gasta: INR, aPTT y fibrinógeno normales, y el dímero-D también. Así se separa de la CID.', lupa: false, resalta: ['#vso-c-inr', '#vso-c-fib'], cita: [MA('mh-ptt', '28'), MA('mh-tabla-13-3', '26')] },
        { t: 'El riñón suele afectarse poco (creatinina por debajo de 2 mg/dL): así se separa del SHU. Fiebre, alteración mental e insuficiencia renal forman parte de su péntada, a menudo incompleta: la fiebre puede faltar y lo neurológico, ser leve o no estar.', lupa: false, resalta: ['#vso-med-cerebro', '#vso-med-rinon'], cita: MA('mh-ptt', '27-28') },
        { t: 'Suele aparecer en la edad media, 3 veces más en mujeres, y sin tratar puede matar en 24-48 h. La hemólisis se sospecha por la LDH alta y la haptoglobina baja, y los esquistocitos la confirman. Una actividad de ADAMTS-13 muy baja es patognomónica, pero la prueba no está disponible en muchos hospitales.', lupa: 'plaqueta', resalta: '#vso-l-adamts', cita: [MA('mh-ptt', '27-28'), MA('mh-mat-hemolisis', '27')] },
    ],
    'ptt-recambio': [
        { t: 'El tratamiento de elección es el recambio plasmático: la sangre pasa por un aparato que separa y desecha el plasma del paciente y le devuelve sus hematíes con plasma de un donante sano.', resalta: '#vso-r-separador', cita: MA('mh-ptt', '28') },
        { t: 'Unas 1,5 veces el volumen plasmático por sesión, a diario, hasta que las plaquetas sean normales 2 días seguidos.', resalta: '#vso-r-pauta', cita: MA('mh-ptt', '28') },
        { t: 'Si empieza en las primeras 48 h desde los síntomas, sobrevive hasta el 90 %; sin tratar, la PTT aguda fulminante es casi siempre mortal. La fuente no dice qué molécula retira o repone el recambio: el dibujo no la pinta.', resalta: '#vso-r-donante', cita: [MA('mh-ptt', '28'), MA('mh-nota-recambio', '28')] },
    ],
    shu: [
        { t: 'El SHU es la tríada de trombocitopenia, fracaso renal agudo y anemia hemolítica microangiopática: aquí el que cae es el riñón.', lupa: false, resalta: '#vso-med-rinon', cita: MA('mh-shu', '28') },
        { t: 'No se gastan factores ni aumenta la fibrinólisis: INR, aPTT y dímero-D normales, como en la PTT. Lo que lo separa es el riñón, más grave.', lupa: false, resalta: ['#vso-c-inr', '#vso-c-dd'], cita: [MA('mh-shu', '28'), MA('mh-tabla-13-3', '26')] },
        { t: 'Lo más frecuente es, probablemente, una infección (E. coli con toxina Shiga, neumococo, gripe): soporte y tratar la infección.', lupa: 'frotis', resalta: '#vso-zona-red', cita: MA('mh-shu', '28-29') },
        { t: 'El SHU atípico es hereditario: el complemento se activa sin control. El eculizumab, una IgG que se une a C5, lo ha revertido; si no lo hay, recambio. Un 20 % tiene clínica fuera del riñón, sobre todo neurológica.', estado: { causa: 'shu', vari: 'atipico', plaq: PLAQ_CAUSA.shu }, lupa: 'complemento', resalta: '#vso-lupa-peq', cita: MA('mh-shu', '28-29') },
    ],
    'transfusion-plaquetas': [
        { t: 'Antes de transfundir: estas indicaciones no valen en las microangiopatías. Si sangra, se buscan más de 50.000; si sangra dentro del cráneo, más de 100.000.', resalta: '#vso-c-plaq', cita: PPL('mh-plaq-sangrado', '29') },
        { t: 'Gotea una unidad (agrupada de 4-6 donantes, o de aféresis): en un adulto medio que no sangra, sube el recuento 35.000-50.000 a la hora.', resalta: '#vso-bolsa', cita: PPL('mh-plaq-respuesta', '30'), org: 'desde 20.000: ilustrativo' },
        { t: 'A las 24 h el aumento es un 40 % menor: mira las barras de la 1.ª transfusión (Fig. 13.2).', resalta: '#vso-f132-1', cita: [PPL('mh-plaq-respuesta', '30'), PPL('mh-fig-13-2', '31')] },
        { t: 'La figura (otro estudio) da unos 66.000 a la hora tras la 1.ª: más que el texto. Marino no las concilia; la banda verde es la del texto.', resalta: '#vso-f132-banda', cita: PPL('mh-nota-fig-13-2', '30-31'), org: 'barras: lectura aproximada' },
    ],
    refractariedad: [
        { t: 'Cuantas más transfusiones, menos sube: tras 5, el aumento es un 25 % menor (Fig. 13.2).', resalta: '#vso-f132-5', cita: PPL('mh-plaq-respuesta', '30') },
        { t: 'Es la refractariedad: el receptor hace anticuerpos contra los antígenos ABO de las plaquetas del donante.', resalta: '#vso-f132-5', cita: PPL('mh-plaq-respuesta', '30') },
        { t: 'Se atenúa con plaquetas ABO-compatibles; cuánto, la fuente no lo dice. Y con 3 transfusiones, la barra de las 24 h (~20.000) es menor que con 5 (~26.000): la figura es así y no lo explica.', resalta: '#vso-f132-3', cita: PPL('mh-fig-13-2', '31'), org: 'barras: lectura aproximada' },
    ],
    'pfc-inr': [
        { t: 'El INR mira sobre todo un plato de la balanza: los factores que dependen de la vitamina K (II, VII, IX y X).', resalta: '#vso-b-izq', cita: PPL('mh-trampa-inr', '33') },
        { t: 'No ve el otro plato: los anticoagulantes del propio plasma (antitrombina, proteína C y proteína S).', resalta: '#vso-b-der', cita: PPL('mh-trampa-inr', '33') },
        { t: 'En críticos sin sangrado y con el INR alto antes de un procedimiento, un PFC de 12 mL/kg bajó el INR de 1,8 a 1,4 (medianas, Fig. 13.3).', resalta: '#vso-b-dial', cita: [PPL('mh-trampa-inr', '33'), PPL('mh-fig-13-3', '34')] },
        { t: 'Pero la antitrombina subió del 38 al 50 %: el fiel casi no se mueve. Y el PFC profiláctico no ha demostrado reducir el sangrado.', resalta: '#vso-b-fiel', cita: [PPL('mh-fig-13-3', '34'), PPL('mh-pfc-profilactico', '33')] },
    ],
    warfarina: [
        { t: 'La warfarina no toca la máquina: frena en el hígado la síntesis de los cuatro factores que dependen de la vitamina K (II, VII, IX y X). Aquí, la despensa vacía. Su ventana es estrecha: se vigila con el INR (objetivo 2-3), que mira justo ese plato y no la antitrombina ni las proteínas C y S.', lupa: 'cascada', resalta: '#vso-cas-despensa', cita: [MAR19('mc-warfarina', '26'), MAR19('mc-tabla-19-3', '27'), PPL('mh-pfc-warfarina', '33'), PPL('mh-trampa-inr', '33')] },
        { t: 'Con warfarina, el plasma sirve para reponer factores de coagulación; los que trae el CCP4F son los que dependen de la vitamina K (II, VII, IX y X): aquí, huecos.', resalta: '#vso-b-izq', cita: PPL('mh-pfc-warfarina', '33') },
        { t: 'Primero, vitamina K, para cortar la anticoagulación que sigue en curso.', resalta: '#vso-b-vitk', cita: PPL('mh-pfc-warfarina', '33') },
        { t: 'Después, PFC 10-15 mL/kg para devolver el INR a la normalidad: hay que descongelarlo, lo que retrasa el tratamiento, y su volumen puede agravar el sangrado.', resalta: '#vso-b-pfc', cita: PPL('mh-pfc-warfarina', '33') },
        { t: 'El CCP4F trae en polvo los cuatro factores: 100 mL y revierte la warfarina en menos de 30 min.', estado: { rep: 'ccp4f' }, resalta: '#vso-b-ccp', cita: PPL('mh-pfc-warfarina', '33') },
    ],
    'hemorragia-masiva': [
        { t: 'Hemorragia masiva: perder el equivalente a la volemia en 24 h. La lesión es grande y sangra.', resalta: '#vso-zona-herida', cita: PPL('mh-pfc-masiva', '32') },
        { t: 'Se repone 1 PFC por cada 1-2 concentrados de hematíes.', resalta: '#vso-m-bolsas', cita: PPL('mh-pfc-masiva', '32') },
        { t: 'El fibrinógeno es el primer factor que se agota, y los sueros lo diluyen.', resalta: '#vso-m-fib', cita: PPL('mh-crio', '35'), org: 'fibrinógeno 120: del caso' },
        { t: 'En el trauma, crio si el fibrinógeno cae a 150-200 mg/dL: 1 unidad por 10 kg lo sube unos 50 mg/dL sin sangrado (sangrando, hará falta más). O concentrado de fibrinógeno: 20 g/L, sin descongelar.', estado: { rep: 'crio', lesion: 'grande', t: 4, plaq: 46000 }, resalta: '#vso-m-fib', cita: PPL('mh-crio', '35') },
    ],
};
// Las fuentes de cada estado, en lista (REGLAS §7.11): las citas de sus pasos, sin repetir
for (const [k, pasos] of Object.entries(GUIAS)) {
    const vistas = new Set();
    ESTADOS[k].fuentes = pasos.flatMap(p => [].concat(p.cita || [])).filter(c => { const id = `${c.ficha}|${c.id}`; if (vistas.has(id)) return false; vistas.add(id); return true; });
}

/* ============================================================
   Mayéutica: una sola fuente de preguntas (REGLAS §8 y decisión del director, 20/10/2026). Las de las fichas 4-6
   (js/data/mayeutica/b2-hemostasia.js), en su orden, más 4 de «predice y compruébalo» que necesitan el dibujo. Cada
   pregunta sale con el vaso en un estado que no da la respuesta (`estado`) y, al contestar, pasa al de su tema
   (`despues`, el estado con nombre de su `modeloVivo`): primero predices, luego compruebas.
   ============================================================ */
const H = MAYEUTICA_HEMOSTASIA;
const FICHAS = ['merino-trombocitopenia', 'merino-microangiopatias', 'merino-plaquetas-plasma'];
// El estado con nombre al que lleva una pregunta de las fichas (su modeloVivo del vaso)
export const estadoVasoDe = q => [].concat(q?.modeloVivo || []).map(m => m.vasoVivo).find(Boolean) || null;
// Con qué se abre el vaso antes de contestar: sin pistas (las plaquetas del enunciado, si las da)
const ANTES = { pseudotrombocitopenia: { plaq: 38000 }, 'transfusion-plaquetas': { plaq: 20000 }, refractariedad: { plaq: 20000 }, cid: { plaq: 40000 }, 'cid-lena': { plaq: 40000 }, ptt: { plaq: 20000 }, 'ptt-recambio': { plaq: 20000 }, shu: { plaq: 40000 } };
const deFicha = (q, serie) => { const k = estadoVasoDe(q); return { ...q, serie, estado: (k && ANTES[k]) || {}, despues: k }; };

// Las 4 propias: se predicen y se comprueban en el dibujo (tocar). Mandos: 'tiempo' (los 4 tiempos de la herida) y
// 'estado|<clave>|<rótulo>' (un botón que pone el vaso en un estado con nombre).
const PROPIAS = {
    // ficha 4, tras «la herida» (trb-g2)
    'trb-g2': [{ id: 'vso-p1', serie: 'guia', corto: 'el orden', tipo: 'test', fuente: 'mh-hemostasia-primaria · mh-hemostasia-secundaria', estado: { lesion: 'herida', t: 1 }, lupa: 'herida',
        tocar: { mandos: ['tiempo'], ocultar: ['tapon'], instruccion: 'pon el tiempo en que el tapón queda anclado a la pared y pulsa «Comprobar».', comprobar: e => e.lesion !== 'ninguna' && e.t === 2, pista: 'Toca el tiempo 2 de la herida.', bueno: { t: 2 },
            confirma: 'tiempo 2: el calcio enciende la GPIIb/IIIa, que agarra el FvW (los cordones que bajan de la pared) y el fibrinógeno.' },
        enunciado: 'Predice: en la lupa, las plaquetas ya se han pegado al colágeno (tiempo 1). ¿Qué es lo siguiente?',
        opciones: [
            { t: 'La fibrina teje su red sobre las plaquetas, antes de activarlas', porque: 'La fibrina es la hemostasia secundaria: estabiliza un tapón que ya está anclado (tiempo 3). Si creyeras que va primero, buscarías el fallo de un tapón en la coagulación y no en las plaquetas.' },
            { t: 'El tapón se contrae y vuelve el flujo', porque: 'La contracción es el final (tiempo 4) y la hacen los puentes de fibrina, que aún no existen. Darías por cerrada una herida en la que el tapón ni siquiera está anclado.' },
            { t: 'Sueltan calcio: la GPIIb/IIIa agarra el FvW y lo ancla', ok: true }],
        explicacion: 'Tiempo 2: las plaquetas liberan <span class="hl-azul">calcio, que activa la GPIIb/IIIa</span>; esta se une de forma irreversible al <span class="hl">FvW</span> (ancla el tapón a la pared) y al fibrinógeno. Después llega la fibrina (tiempo 3) y, al final, la contracción (tiempo 4).' }],
    // ficha 4, tras «riesgo intermedio» (trb-g9)
    'trb-g9': [{ id: 'vso-p2', serie: 'guia', corto: 'dónde corta', tipo: 'test', fuente: 'mh-argatroban · mar-tromboprofilaxis-farmacos#mar-img-5-2', estado: { causa: 'hit', hep: 'retirada', plaq: PLAQ_CAUSA.hit }, lupa: 'cascada',
        tocar: { mandos: ['estado|hit-argatroban|Dar argatrobán'], ocultar: ['aptt'], instruccion: 'pon el argatrobán y mira la cascada.', comprobar: e => e.causa === 'hit' && e.hep === 'argatroban', pista: 'Pulsa «Dar argatrobán».', bueno: { hep: 'argatroban' },
            confirma: 'en la lupa de la cascada queda tachada la IIa, la tejedora: el argatrobán frena la trombina, y se ajusta a un aPTT de 1,5-3 veces lo normal.' },
        enunciado: 'Predice: retirada la heparina, empiezas argatrobán. ¿Sobre qué pieza de la cascada actúa?',
        opciones: [
            { t: 'Sobre el Xa, la rueda que activa la protrombina', porque: 'Eso es lo que hacen los anti-Xa directos del telar (apixabán, rivaroxabán). El argatrobán es un inhibidor directo de la trombina: si lo tomaras por un anti-Xa, no entenderías por qué se ajusta con el aPTT.' },
            { t: 'Sobre la IIa, la trombina que teje la fibrina', ok: true },
            { t: 'Sobre el FP4 de la plaqueta, para que la heparina ya no encuentre dónde unirse', porque: 'La ficha no trae ningún fármaco que actúe sobre el FP4: lo que hace es retirar toda la heparina y frenar la trombina. Si creyeras que el argatrobán solo aparta la heparina, podrías darlo a medias, y toda HIT necesita un anticoagulante no heparínico a dosis plenas (si se retrasa, las trombosis son 10 veces más).' }],
        explicacion: 'El argatrobán es un <span class="hl-azul">inhibidor directo de la trombina (IIa)</span>, en infusión continua: 1-2 µg/kg/min ajustado a un aPTT de 1,5-3 veces lo normal. En la máquina del telar, la IIa es la tejedora que convierte el fibrinógeno en fibrina.' }],
    // ficha 5, tras «PTT o SHU» (mat-g7)
    'mat-g7': [{ id: 'vso-p3', serie: 'guia', corto: 'los órganos', tipo: 'test', fuente: 'mh-cid · mh-shu · mh-mat', estado: { causa: 'cid', vari: 'septica', lesion: 'herida', t: 4, plaq: PLAQ_CAUSA.cid }, lupa: false,
        tocar: { mandos: ['estado|shu|Pasar a un SHU'], ocultar: [], instruccion: 'cambia la CID por un SHU y mira los medallones.', comprobar: e => e.causa === 'shu', pista: 'Pulsa «Pasar a un SHU».', bueno: { causa: 'shu', vari: 'tipico', lesion: 'ninguna', plaq: PLAQ_CAUSA.shu },
            confirma: 'en el SHU el que cae es el riñón (fracaso renal agudo), el órgano de su tríada. Fuera del riñón, la fuente solo lo describe en el atípico: un 20\u00a0%, sobre todo neurológico.' },
        enunciado: 'En el vaso, una CID séptica enciende el pulmón, el riñón y el cerebro. Predice: si fuera un SHU por <i>E. coli</i>, ¿qué medallón quedaría encendido?',
        opciones: [
            { t: 'Los mismos tres: es la misma microtrombosis', porque: 'La CID afecta sobre todo a pulmón, riñón y SNC; el SHU es la tríada de trombocitopenia, fracaso renal agudo y hemólisis microangiopática. Si esperaras los tres, no buscarías en el riñón lo que separa al SHU.' },
            { t: 'Ninguno: el SHU no forma microtrombos y solo rompe los hematíes', porque: 'El SHU es una microangiopatía trombótica: comparte la trombosis microvascular con disfunción de órganos. Lo tomarías por una hemólisis sin más y no vigilarías el riñón.' },
            { t: 'El riñón: el SHU lleva un fracaso renal agudo', ok: true }],
        explicacion: 'Las tres microangiopatías comparten microtrombosis con disfunción de órganos. En la CID, sobre todo <span class="hl">pulmón, riñón y SNC</span>; el SHU es la tríada de trombocitopenia, <span class="hl-rojo">fracaso renal agudo</span> y anemia hemolítica microangiopática, con el riñón peor que en la PTT.' }],
    // ficha 6, tras «¿coagula mejor?» (ppl-g8)
    'ppl-g8': [{ id: 'vso-p4', serie: 'guia', corto: 'el fiel', tipo: 'test', fuente: 'mh-trampa-inr · mh-fig-13-3', estado: {}, lupa: false,
        tocar: { mandos: ['estado|pfc-inr|Poner el PFC (12 mL/kg)'], ocultar: ['inr', 'fib'], instruccion: 'pon el PFC y mira el fiel de la balanza.', comprobar: e => e.rep === 'pfc', pista: 'Pulsa «Poner el PFC».', bueno: { rep: 'pfc' },
            confirma: 'el dial del INR baja (1,8 → 1,4), pero el plato de los anticoagulantes también pesa más (antitrombina 38 → 50 %): el fiel casi no se mueve.' },
        enunciado: 'Predice en la balanza: un PFC de 12 mL/kg baja el INR de 1,8 a 1,4. ¿Qué hace el fiel de la coagulación?',
        opciones: [
            { t: 'Se inclina hacia coagular, como el INR', porque: 'El INR solo pesa un plato (II, VII, IX y X). El PFC carga también el otro (antitrombina 38 → 50 %): darías por corregida una coagulación que apenas ha cambiado.' },
            { t: 'Casi no se mueve: también sube la antitrombina', ok: true },
            { t: 'Se inclina hacia sangrar, porque el plasma diluye los factores que había', porque: 'En la Fig. 13.3 el INR baja con el PFC (1,8 → 1,4): no empeora. Lo que el INR no ve es que la antitrombina también sube (38 → 50 %), y el neto puede ser poco o ningún cambio: esperarías un sangrado que la figura no muestra y no verías que el paciente se queda casi igual.' }],
        explicacion: 'El INR solo mira los factores que dependen de la vitamina K; el PFC sube también la <span class="hl-azul">antitrombina, la proteína C y la proteína S</span>. Resultado: <span class="hl-rojo">poco o ningún cambio</span> neto de la coagulación (Fig. 13.3).' }],
};
function guiaCon(ficha) {
    return H[ficha].guia.flatMap(q => [deFicha(q, 'guia'), ...(PROPIAS[q.id] || [])]);
}
export const PREGUNTAS = [
    ...FICHAS.flatMap(guiaCon),
    ...FICHAS.flatMap(f => H[f].examen.map(q => deFicha(q, 'examen'))),
];

/* ============================================================
   Los casos: los mismos de las fichas (Gonzalo, Inés y Salvador). Cada paso pone el vaso en el estado del paciente
   sin dar la respuesta (`estado`) y, al contestar, en el de su tema (`despues`).
   ============================================================ */
const PASOS_VASO = {
    'h3-1': { e: { plaq: 140000 } }, 'h3-2': { e: { plaq: 85000 } }, 'h3-3': { e: { plaq: 85000 }, despues: 'hit-argatroban' },
    'h3-4': { e: { causa: 'hit', hep: 'retirada', plaq: 85000 }, despues: 'hit-argatroban', ocultar: ['aptt'] }, 'h3-5': { e: { causa: 'hit', hep: 'argatroban', plaq: 85000 } },
    'h3-6': { e: { causa: 'hit', hep: 'argatroban', plaq: 85000 } }, 'h3-7': { e: { plaq: 70000 } },
    'h4-1': { e: { plaq: 16000 } }, 'h4-2': { e: { causa: 'mat', plaq: 16000 } }, 'h4-3': { e: { causa: 'mat', plaq: 16000 }, despues: 'ptt' },
    'h4-4': { e: { causa: 'ptt', plaq: 16000 } }, 'h4-5': { e: { causa: 'ptt', plaq: 16000 }, despues: 'ptt-recambio' }, 'h4-6': { e: { causa: 'ptt', plaq: 38000, rep: 'recambio' } },
    'h5-1': { e: { lesion: 'grande', t: 4, plaq: 150000 }, despues: 'hemorragia-masiva' }, 'h5-2': { e: { rep: 'masiva', lesion: 'grande', t: 4, plaq: 150000 }, despues: null, crio: true },
    'h5-3': { e: { rep: 'masiva', lesion: 'grande', t: 4, plaq: 46000 } }, 'h5-4': { e: { rep: 'masiva', lesion: 'grande', t: 4, plaq: 88000 } },
    'h5-5': { e: { rep: 'masiva', lesion: 'grande', t: 4, plaq: 100000 } }, 'h5-6': { e: {}, despues: 'pfc-inr' },
};
// El estado al que vuelve cada caso («Abrir el vaso en el estado del paciente»)
const VOLVER = { h3: 'hit-argatroban', h4: 'ptt-recambio', h5: 'pfc-inr' };
// Revisión por objetivos al cerrar el caso (core/mayeutica-motor.js): pasos desde 0. Solo Inés (H4); sus fuentes son las de sus preguntas.
const OBJETIVOS = {
    h4: [
        { id: 'plaquetas', texto: 'Plaquetas bajas con esquistocitos: sin transfundir plaquetas', pasos: [{ paso: 0, consecuencia: true }, { paso: 3, frases: [0] }],
          si: 'Las indicaciones de transfusión de plaquetas no se aplican a la trombocitopenia por consumo de las microangiopatías: transfundirlas puede agravar la microtrombosis.',
          no: 'Con esquistocitos y plaquetas bajas es una microangiopatía trombótica (aquí, el frotis lo confirma después), y ahí las indicaciones de transfusión de plaquetas no se aplican: pueden agravar la microtrombosis.',
          fuente: 'mh-plaq-indicaciones · mh-mat-hemolisis · mh-mat' },
        { id: 'ptt', texto: 'PTT y no CID: la coagulación lo separa', pasos: [1, 2],
          si: 'INR, aPTT, fibrinógeno y dímero-D normales descartan la CID; con creatinina <2 mg/dl, fiebre y confusión, es una PTT.',
          no: 'La CID consume factores (INR y aPTT alargados, fibrinógeno bajo, dímero-D alto); con todo normal no es CID. Una creatinina <2 mg/dl es lo habitual en la PTT, y sin tratar mata en 24-48 h.',
          fuente: 'mh-tabla-13-3 · mh-cid · mh-ptt' },
        { id: 'recambio', texto: 'Recambio plasmático bien pautado', pasos: [{ paso: 3, frases: [1, 3] }, 4, 5],
          si: 'Recambio de inicio precoz (<48 h desde los síntomas), de ~1,5 veces el volumen plasmático por sesión, a diario hasta plaquetas normales 2 días seguidos.',
          no: 'El recambio es de inicio precoz (<48 h desde los síntomas), ~1,5 veces el volumen plasmático por sesión, a diario hasta que las plaquetas sean normales 2 días seguidos.',
          fuente: 'mh-ptt' }],
};
// Error con consecuencia: transfundir plaquetas ya, con una microangiopatía por delante (h4-1). Cuántos nudos: ilustrativo.
const CONSECUENCIAS = {
    // Atada al índice de la opción (la 3.ª de h4-1), no a su texto: si alguien reescribe la opción, no se pierde.
    'h4-1': { 2: {
        estado: { causa: 'mat', plaq: 16000, rep: 'lena' },
        texto: 'Le transfundes plaquetas antes de confirmar nada. Si el frotis confirma esquistocitos, con plaquetas bajas será una microangiopatía trombótica, y ahí <span class="hl-rojo">transfundir plaquetas puede agravar la microtrombosis</span>: mira cómo se llenan más los capilares del pulmón, el riñón y el cerebro.',
        corto: 'las plaquetas agravaron la microtrombosis.',
        fuente: 'mh-plaq-indicaciones · mh-cid · trombosis más: ilustrativo' } },
};
export const CASOS = FICHAS.flatMap(f => H[f].casos).map(C => ({
    ...C, vaso: VOLVER[C.id], ...(OBJETIVOS[C.id] ? { objetivos: OBJETIVOS[C.id] } : {}),
    pasos: C.pasos.map(paso => {
        const v = PASOS_VASO[paso.pregunta.id] || { e: {} };
        const despues = 'despues' in v ? v.despues : estadoVasoDe(paso.pregunta);
        const cons = CONSECUENCIAS[paso.pregunta.id];
        const preg = cons ? { ...paso.pregunta, opciones: paso.pregunta.opciones.map((o, i) => cons[i] ? { ...o, consecuencia: cons[i] } : o) } : paso.pregunta;
        return { ...paso, estado: v.e, ocultar: v.ocultar, pregunta: { ...preg, despues, despuesP: v.crio ? { rep: 'crio', lesion: 'grande', t: 4, plaq: 150000 } : null } };
    }),
}));

/* ============================================================
   Notas, láminas del libro y «Para profundizar»
   ============================================================ */
export const NOTAS = [
    { tipo: 'discrepan', txt: '<b>Lo que sube una unidad de plaquetas a la hora.</b> El texto da 35.000-50.000 en un adulto medio que no sangra (p. 30); la Fig. 13.2, de otro estudio, da ~66.000 tras la primera transfusión (lectura aproximada, p. 31). Se muestran las dos: la banda verde de la gráfica viva es la del texto.', fuente: 'merino-plaquetas-plasma#mh-nota-fig-13-2' },
    { tipo: 'calla', txt: '<b>Fig. 13.2.</b> Con 3 transfusiones, el aumento a las 24 h (~20.000) es menor que con 5 (~26.000). La figura es así y no lo explica: se copia tal cual.', fuente: 'merino-plaquetas-plasma#mh-fig-13-2' },
    { tipo: 'calla', txt: '<b>El fibrinógeno normal</b> no sale en el capítulo: el tablero usa 200-400 mg/dL como fisiología general. El 150-200 mg/dL del crio es el umbral del trauma; el del posparto, la fuente no lo da.', fuente: 'merino-plaquetas-plasma#mh-crio' },
    { tipo: 'calla', txt: '<b>Lo que no se dibuja, porque la fuente no lo explica:</b> por qué la warfarina es protrombótica en la HIT, la plasmina, los multímeros del FvW, qué molécula retira o repone el recambio, cuánto atenúan las plaquetas ABO-compatibles y en qué punto de la cascada entra cada factor (el capítulo solo dice que II, VII, IX y X dependen de la vitamina K).', fuente: 'merino-microangiopatias#mh-nota-recambio' },
    { tipo: 'calla', txt: '<b>Los órganos del SHU.</b> La fuente define el SHU por su tríada (trombocitopenia, fracaso renal agudo y anemia hemolítica microangiopática) y solo describe clínica fuera del riñón en el atípico (un 20 %, sobre todo neurológica). Del SHU típico no dice más: el dibujo enciende solo el riñón.', fuente: 'merino-microangiopatias#mh-shu' },
    { tipo: 'calla', txt: '<b>El Xa de la cascada.</b> El cap. 13 dice que las dos vías activan factores de coagulación y llevan a activar la protrombina (II), sin nombrar el Xa. La máquina de la lupa es la del telar (cap. 5, Fig. 5.2): ahí el Xa convierte la protrombina en trombina.', fuente: 'merino-trombocitopenia#mh-vias-coagulacion · mar-tromboprofilaxis-farmacos#mar-img-5-2' },
    { tipo: 'autor', txt: '<b>«Ninguna de estas recomendaciones está validada».</b> Los umbrales de plaquetas profilácticas (≤10.000; catéter central &lt;20.000; punción lumbar y cirugía no neuroaxial &lt;50.000) son de la guía AABB; la duda es del autor, que recuerda que 5.000 no dan sangrado espontáneo. La guía no cambia por ella.', fuente: 'merino-plaquetas-plasma#mh-plaq-validez' },
];
export const NOTA_TIPO = { discrepan: 'Las fuentes discrepan', calla: 'La fuente no lo dice', autor: 'Opinión del autor' };
// Las láminas reales del libro que van al lado del dibujo vivo (la del frotis es una foto; 13.2 y 13.3, las gráficas)
const IMG = 'js/modules/merino-hemato/img/';
export const LAMINAS = {
    frotis: [IMG + 'fig2-esquistocitos-cid.jpg', 'Figura 13.1 del libro (PDF p. 26): frotis de sangre de un paciente con CID; las flechas señalan esquistocitos, hematíes fragmentados, patognomónicos de una anemia hemolítica microangiopática.', 'Fig. 13.1: el frotis de una CID'],
    fig132: [IMG + 'fig13-2-respuesta-plaquetas.jpg', 'Figura 13.2 del libro (PDF p. 31): aumento medio de plaquetas a la hora y a las 24 h tras la 1.ª, la 3.ª y la 5.ª transfusión.', 'Fig. 13.2: la gráfica del libro'],
    fig222: ['js/modules/neumologia/img/neumo-fig22-2-trombectomia-cateter.jpg', 'Figura 22.2 del libro (PDF p. 10): coágulo recuperado con un catéter de las arterias pulmonares en una EP aguda con sobrecarga del corazón derecho; la trombectomía saca mucho coágulo, y por eso la lisis ha tenido tan poco efecto en la EP que amenaza la vida.', 'Fig. 22.2: la foto del libro'],
    balanza: [IMG + 'fig13-3-pfc-inr-antitrombina.jpg', 'Figura 13.3 del libro (PDF p. 34): PFC 12 mL/kg en críticos sin sangrado; el INR baja de 1,8 a 1,4 y la antitrombina sube de 38 a 50 % (medianas).', 'Fig. 13.3: la gráfica del libro'],
};

/* ============================================================
   Prueba de las cifras (cobertura del bloque 2 §5.3; ±1 en la última cifra salvo donde se dice), los extremos del
   mando de las plaquetas, las explicaciones guiadas y la forma de la Mayéutica.
   ============================================================ */
export function pruebasVaso() {
    const r = { estados: [], extremos: null, guias: [], mayeutica: null, todoCoincide: true, reloj: [] };
    const mira = (estado, campo, valor, espera, tol = 0, nota = '') => {
        const ok = typeof espera === 'number' ? valor != null && Math.abs(valor - espera) <= tol + 1e-9 : valor === espera;
        if (!ok) r.todoCoincide = false;
        r.estados.push({ estado, campo, valor, espera, ok, nota });
    };
    const E = k => estadoDe(ESTADOS[k].p), T = k => tableroDe(E(k)), D = k => derivar(E(k));
    mira('sano', 'plaquetas', E('sano').plaq, 250000, 0, 'normal 150.000-400.000 (p. 30)'); mira('sano', 'tapón', T('sano').tapon.v, '—');
    mira('herida', 'tiempo 4: el tapón cierra', derivar(estadoDe({ lesion: 'herida', t: 4 })).cierra, true);
    mira('plaquetas-100k', 'cierra con 100.000', D('plaquetas-100k').cierra, true); mira('plaquetas-100k', 'no cierra con 95.000', derivar(estadoDe({ lesion: 'herida', t: 4, plaq: 95000 })).cierra, false);
    mira('plaquetas-5k', 'sin lesión no sangra', D('plaquetas-5k').sangra, 0); mira('plaquetas-5k', 'con lesión estructural sangra', derivar(estadoDe({ plaq: 5000, lesion: 'grande' })).sangra, 2);
    mira('plaquetas-5k', 'HIC: aviso', T('plaquetas-5k').amenaza.v, 'HIC');
    mira('pseudotrombocitopenia', 'lupa del tubo', D('pseudotrombocitopenia').lupaAuto, 'tubo'); mira('pseudotrombocitopenia', 'plaquetas', T('pseudotrombocitopenia').plaq.v, 'falsa ↓');
    mira('sepsis', 'plaquetas', E('sepsis').plaq, 60000, 0, 'ilustrativo');
    mira('hit', 'caída', T('hit').plaq.v, '−50 %'); mira('hit', 'amenaza', T('hit').amenaza.v, 'trombosis'); mira('hit', '115.000 = 230.000 × 0,5', E('hit').plaq, 230000 * 0.5);
    mira('hit-argatroban', 'aPTT objetivo', T('hit-argatroban').aptt.v, '1,5-3×'); mira('hit-argatroban', 'lupa de la cascada', D('hit-argatroban').lupaAuto, 'cascada');
    for (const [k, inr, fib, dd] of [['cid', '↑', '↓', '↑'], ['ptt', 'normal', 'normal', 'normal'], ['shu', 'normal', 'normal', 'normal']]) {
        const t = T(k); mira(k, 'INR', t.inr.v, inr); mira(k, 'fibrinógeno', t.fib.v, fib); mira(k, 'dímero-D', t.dd.v, dd); mira(k, 'esquistocitos', t.esq.v, 'sí'); mira(k, 'plaquetas', t.plaq.v, '↓');
    }
    mira('cid', 'órganos: pulmón, riñón y cerebro', ['pulmon', 'rinon', 'cerebro'].every(o => D('cid').organos[o] === 2), true);
    mira('ptt', 'riñón leve, cerebro en aviso (leve o ausente, p. 27)', D('ptt').organos.rinon === 1 && D('ptt').organos.cerebro === 1, true);
    mira('shu', 'el riñón', D('shu').organos.rinon, 2);
    mira('cid-lena', 'más nudos que la CID', D('cid-lena').nudos.pulmon > D('cid').nudos.pulmon, true);
    mira('ptt-recambio', 'el recambio', D('ptt-recambio').pie, 'recambio');
    const tp = T('transfusion-plaquetas');
    mira('transfusion-plaquetas', 'a la hora (20.000 + 35.000-50.000)', tp.plaq.v, '55-70 mil'); mira('transfusion-plaquetas', 'a las 24 h (40 % menos del aumento)', /24 h: 41-50 mil/.test(tp.plaq.u), true);
    mira('transfusion-plaquetas', 'Fig. 13.2: 24 h ~40 % menos (lectura)', Math.round((1 - FIG132[1][1] / FIG132[1][0]) * 100), 40, 3, 'lectura aproximada');
    mira('refractariedad', 'tras 5: ~25 % menos (lectura de la Fig. 13.2)', Math.round((1 - FIG132[5][0] / FIG132[1][0]) * 100), 25, 3, 'lectura aproximada'); mira('refractariedad', 'tablero', T('refractariedad').plaq.v, '−25 %');
    mira('pfc-inr', 'INR', T('pfc-inr').inr.v, '1,8→1,4'); mira('pfc-inr', 'antitrombina', T('pfc-inr').fib.v, '38→50 %');
    mira('warfarina', 'factores huecos', D('warfarina').factorHueco, true); mira('warfarina', 'balanza', D('warfarina').pie, 'balanza');
    mira('hemorragia-masiva', 'fibrinógeno (del caso)', T('hemorragia-masiva').fib.v, '120'); mira('hemorragia-masiva', 'sangra', D('hemorragia-masiva').sangra, 2);
    mira('hemorragia-masiva', 'crio: +50', tableroDe(estadoDe({ rep: 'crio', lesion: 'grande', plaq: 46000 })).fib.v, '+50');
    mira('crio', '1 U/10 kg en 80 kg = 8 U', 80 / 10, 8);
    // El mando de las plaquetas: de 5.000 a 400.000, siempre un paciente posible (sin NaN; el tapón cierra solo desde 100.000)
    const ex = { ok: true, malos: [] };
    for (let v = 0; v <= 1000; v += 25) {
        const p = plaqDe(v), dd = derivar(estadoDe({ plaq: p, lesion: 'herida', t: 4 })), t = tableroDe(estadoDe({ plaq: p }));
        const bien = p >= PLAQ_MIN && p <= PLAQ_MAX && dd.cierra === (p >= 100000) && /^[\d.]+$/.test(t.plaq.v);
        if (!bien) { ex.ok = false; ex.malos.push(p); }
    }
    ex.min = plaqDe(0); ex.medio = plaqDe(500); ex.max = plaqDe(1000);
    if (ex.min !== 5000 || ex.max !== 400000) ex.ok = false;
    if (!ex.ok) r.todoCoincide = false;
    r.extremos = ex;
    // El reloj de la placa: 3 oclusiones × 0, 3, 12 y 24 h (troponina >p99 desde 3 h salvo a ratos; sello de la lisis a 12 h en la completa)
    for (const ocl of ['intermitente', 'parcial', 'completa']) for (const horas of [0, 3, 12, 24]) {
        const e = estadoDe({ lesion: 'placa', t: 4, ocl, horas }), T = tableroDe(e), sello = topesReloj(e).some(x => x.nivel === 'sello');
        const tropo = ocl !== 'intermitente' && horas >= 3 ? '>p99' : ocl === 'intermitente' ? '?' : 'aún no';
        const ok = T.aptt.v === tropo && sello === (ocl === 'completa' && horas > 12) && T.inr.v === (ocl === 'completa' ? 'sí' : 'no') && T.dd.v === `${horas} h`;
        if (!ok) r.todoCoincide = false;
        r.reloj.push({ ocl, horas, tropo: T.aptt.v, ecg: T.inr.v, sello, ok });
    }
    // 5c: el peso (40-120 kg) → tenecteplasa por tramos; 5b: tres interruptores × sus contraindicaciones = sellos
    r.peso = [40, 59, 60, 69, 70, 79, 80, 89, 90, 120].map(p => ({ p, mg: tnkMg(p) }));
    if (r.peso.map(x => x.mg).join() !== '30,30,35,35,40,40,45,45,50,50') r.todoCoincide = false;
    const sellos = (extra) => topesReloj(estadoDe({ lesion: 'placa', t: 4, ...extra })).filter(x => x.nivel === 'sello').map(x => x.clave).join();
    r.sellos = { asa: sellos({ asa: true, alasa: true }), tica: sellos({ p2y: 'ticagrelor', hic: true }), prasu: sellos({ p2y: 'prasugrel', ictus: true }), clopi: sellos({ p2y: 'clopidogrel', hic: true, ictus: true, alasa: true }), nstemi: sellos({ lisis: true, ocl: 'parcial' }), tarde: sellos({ lisis: true, horas: 13 }) };
    if (r.sellos.asa !== 'tx-asa' || r.sellos.tica !== 'tx-tica' || r.sellos.prasu !== 'tx-prasu' || r.sellos.clopi !== '' || r.sellos.nstemi !== 'tx-nstemi' || r.sellos.tarde !== 'reloj-lisis') r.todoCoincide = false;
    // La explicación guiada: 3-5 pasos por estado, cada paso con su cita (ficha, página y PDF), las fuentes en lista
    for (const k of Object.keys(ESTADOS)) {
        const g = GUIAS[k] || [];
        const bien = g.length >= 3 && g.length <= 5 && g.every(p => [].concat(p.cita || []).length && [].concat(p.cita).every(c => c.ficha && c.pag && c.pdf && c.id)) && Array.isArray(ESTADOS[k].fuentes) && ESTADOS[k].fuentes.length > 0;
        if (!bien) r.todoCoincide = false;
        r.guias.push({ estado: k, pasos: g.length, ok: bien });
    }
    // Mayéutica: una sola buena con el porqué de cada falsa; 0-2 errores; las propias, con su «tocar»
    const tests = [], errores = [];
    const ver = q => {
        if (q.tipo === 'test') tests.push({ id: q.id, unaBuena: q.opciones.filter(o => o.ok).length === 1, porques: q.opciones.every(o => o.ok || (o.porque && o.porque.length >= 30)) });
        if (q.tipo === 'error') errores.push({ id: q.id, n: q.frases.filter(f => f.mal).length });
    };
    PREGUNTAS.forEach(ver); CASOS.forEach(c => c.pasos.forEach(p => ver(p.pregunta)));
    r.mayeutica = { preguntas: PREGUNTAS.length, guia: PREGUNTAS.filter(q => q.serie === 'guia').length, examen: PREGUNTAS.filter(q => q.serie === 'examen').length,
        predice: PREGUNTAS.filter(q => q.tocar).length, casos: CASOS.length, pasos: CASOS.reduce((a, c) => a + c.pasos.length, 0),
        ok: tests.every(t => t.unaBuena && t.porques) && errores.every(e => e.n <= 2) && PREGUNTAS.filter(q => q.tocar).length >= 3 };
    if (!r.mayeutica.ok) r.todoCoincide = false;
    return r;
}
