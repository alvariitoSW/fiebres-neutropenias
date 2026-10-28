// Capilar y oxígeno: datos puros, sin DOM (Libros → Marino → Fundamentos, grupo oxígeno, caps. 7 y 9; ampliado con
// el cap. 12, anemia y transfusión, para Merino HEMATO del bloque 2).
// Viene de las maquetas aprobadas autonomo/maquetas/b1-capilar-oxigeno.html (vuelta 2, 20/10/2026) y
// autonomo/maquetas/b2-capilar.html (parada 1 del bloque 2, 20/10/2026: «el corazón compensa», el gasto quieto al
// transfundir, las lupas del tubo y del alvéolo).
// Toda la medicina sale de las fichas de js/modules/libros/marino-fundamentos.html (mar-transporte-o2,
// mar-extraccion-lactato, mar-oximetria, mar-capnografia; el gap de PCO₂ y la ScvO₂ del cap. 11 en
// mar-respuesta-fluidos; el propofol en mar-sedacion) y de las fichas 1-3 de Merino HEMATO (merino-anemia,
// merino-transfusion, merino-riesgos; cap. 12). Cada cifra dice su origen: ficha, fisiología general o ilustrativo.
// El paciente de los casos se inventa; la medicina, no.
//
// Aquí: el modelo (curva, contenido, aporte, consumo, extracción, saturación venosa, lactato, gap y PETCO₂; y, del
// cap. 12, el gasto que compensa la anemia, la volemia, la transfusión y la dilución), los estados con nombre (los que
// abre data-capilar-vivo="<estado>") con sus fuentes en lista (REGLAS §7.11) y su explicación guiada (GUIAS, REGLAS
// §7.10), los conceptos, la Mayéutica, los casos y la prueba de las cifras (pruebasCapilar). La escena vive en
// js/modules/libros/capilar-vivo-escena.js y la interfaz en capilar-vivo.js.

import { HEMODERIVADOS } from './hemoderivados-data.js';

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const dec = (n, d = 1) => n.toFixed(d).replace('.', ',');
export const mil = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const pct = s => Math.round(s * 100);
export const copia = o => JSON.parse(JSON.stringify(o));

/* ============================================================
   El modelo (cada línea con su origen; la tabla «De dónde sale cada cifra» del partial lo cuenta)
   ============================================================ */
// Curva de disociación: Severinghaus (fisiología general) corregida para pasar exactamente por los 4 puntos de la ficha.
const sev = p => { const x = p * p * p + 150 * p; return x / (x + 23400); };
const NUDOS = [[0, 0], [27, 0.50], [40, 0.73], [45, 0.78], [90, 0.98]];   // P50 (mar-curva-desplazamientos); Tabla 9.1; mar-anemia-hipoxemia
const DIF = NUDOS.map(([x, y]) => [x, x === 0 ? 0 : y - sev(x)]);
function correccion(p) {
    if (p >= 90) return DIF[4][1];
    for (let i = 0; i < DIF.length - 1; i++) if (p <= DIF[i + 1][0]) return lerp(DIF[i][1], DIF[i + 1][1], (p - DIF[i][0]) / (DIF[i + 1][0] - DIF[i][0]));
    return 0;
}
export const satDe = p => clamp(sev(p) + correccion(p), 0, 0.995);
export function po2De(s) { let a = 0, b = 150; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (satDe(m) < s) a = m; else b = m; } return (a + b) / 2; }

export const FCO = 0.25;                               // COHb del humo: ilustrativo
export const PEDIDO = { reposo: 250, fiebre: 300 };    // 250: mar-cvo2; 300: ilustrativo
export const SC = 1.7;                                 // mar-sc

/* ---------- El cap. 12: el corazón que compensa la anemia, la viscosidad, la volemia y el tubo ---------- */
// «El corazón compensa» (merino-anemia, p. 4-7): la extracción que el tejido alcanza con cada Hb, leída de la
// Fig. 12.3 (primates): ~25 % normal, ~29 % con Hto 30 (Hb 10), ~35 % con Hto 20 (Hb ≈6,7) y 50 % con Hto 10 (Hb 3,
// la equivalencia del libro, p. 6). El gasto es el que mantiene el consumo de 250 con esa extracción: ilustrativo
// (la forma de la figura, en animales; la fuente no da cuánto sube en el ser humano).
export const ER_HB = [[3, 0.50], [20 / 3, 0.35], [10, 0.29], [15, PEDIDO.reposo / (5 * 1.34 * 15 * 0.98 * 10)]];
export function erCurva(hb) {
    const h = clamp(hb, 3, 15);
    for (let i = 0; i < ER_HB.length - 1; i++) if (h <= ER_HB[i + 1][0]) return lerp(ER_HB[i][1], ER_HB[i + 1][1], (h - ER_HB[i][0]) / (ER_HB[i + 1][0] - ER_HB[i][0]));
    return ER_HB[ER_HB.length - 1][1];
}
// Por encima de Hb 15 el gasto se queda en 5; por debajo de Hb 3 ya no sube más (el techo de la Fig. 12.3).
export function gcCurva(hb) { const h = clamp(hb, 3, 15); return h >= 15 ? 5 : PEDIDO.reposo / (erCurva(h) * 1.34 * h * 0.98 * 10); }
// Viscosidad relativa al agua (Tabla 12.2, p. 4-5), con el Hto estimado como 3 × Hb (fisiología general).
export const VISC = [[0, 1.4], [10, 1.8], [20, 2.1], [30, 2.8], [40, 3.7], [50, 4.8], [60, 5.8]];
export function viscDe(hb) { const h = clamp(3 * hb, 0, 60); for (let i = 0; i < VISC.length - 1; i++) if (h <= VISC[i + 1][0]) return lerp(VISC[i][1], VISC[i + 1][1], (h - VISC[i][0]) / 10); return 5.8; }
// El tubo de hematocrito (Fig. 12.1, merino-anemia p. 2-3): [Hto antes, Hto después (null: aún no), rótulo antes, rótulo después]
export const TUBOS = {
    pie: [41.8, null, 'de pie', 'tumbado'], tumbado: [41.8, 37.7, 'de pie', 'tumbado'],
    antes: [42.9, null, 'antes', 'a los 90 min'], bolo: [42.9, 38.7, 'antes', 'a los 90 min'],
};
export const hbDeHto = hto => +(hto / 3).toFixed(1);   // Hb ≈ Hto / 3: fisiología general
// «Transfundir 1 CH»: la Hb sube 1 g/dL (y el Hto un 3 %) en un adulto medio (merino-transfusion, p. 10; la cifra vive
// en js/data/hemoderivados-data.js). Gotea en unas 2 h (p. 10); en pantalla, 2 s.
export const HB_POR_CH = HEMODERIVADOS.ch.sube.hb;

export function estadoBase() {
    return { hb: 15, pao2: 90, gc: 5, co: false, espacio: 'no', sedacion: false, esofago: false, rcp: false, frio: false,
        consumo: 'reposo', util: 'normal', estres: false, toma: 'svo2', sensor: 'dedo',
        compensa: false, volemia: 'mantenida', gcFijo: null, transf: null, dil: null, alveolo: null, ros: null };
}
export const estadoDe = parcial => Object.assign(estadoBase(), copia(parcial || {}));

// El gasto que de verdad lleva la sangre: el del mando; el de la curva si el corazón compensa; el que tenía al empezar
// la transfusión mientras gotea la bolsa (decisión del usuario: el gasto se queda quieto, Fig. 12.4); y como mucho 5 si
// falta volumen (la volemia baja no deja subirlo: merino-transfusion, p. 16-17).
export function gastoDe(e) {
    if (e.rcp) return e.gc;
    if (e.gcFijo != null) return e.gcFijo;
    if (e.volemia === 'baja') return Math.min(e.gc, 5);
    return e.compensa ? gcCurva(e.hb) : e.gc;
}

export function derivar(e) {
    const gc = gastoDe(e);
    const S = satDe(e.pao2);
    const fco = e.co ? FCO : 0;
    const sao2 = S * (1 - fco);
    const unido = 1.34 * e.hb * sao2, disuelto = 0.003 * e.pao2, cao2 = unido + disuelto;   // mar-cao2-9
    const do2 = gc * unido * 10;                                                              // mar-do2
    const pedido = PEDIDO[e.consumo];
    const techo = e.util === 'sepsis' ? 0.15 : 0.50;          // Figs. 9.3 y 12.3: hasta el 50 %; sepsis: ilustrativo (<20 %)
    const difPedida = pedido / do2 * sao2;                    // SaO₂ − SvO₂ que haría falta (O₂ER = dif / SaO₂, mar-o2er)
    const dif = Math.min(difPedida, techo, sao2);
    const vo2 = do2 * dif / sao2;
    const o2er = dif / sao2;
    const svo2 = sao2 - dif;
    const shock = gc < 4 || e.util === 'sepsis' || e.rcp;
    const scvo2 = shock ? Math.min(svo2 + 0.07, sao2) : svo2;  // mar-scvo2-9: media +7 % en el crítico (regla del shock: ilustrativa)
    const ven = e.toma === 'scvo2' ? scvo2 : svo2;
    const porAporte = difPedida > techo && e.util !== 'sepsis';
    const deficit = porAporte ? (pedido - vo2) / pedido : 0;
    const lact = 1 + 8 * deficit + (e.util !== 'normal' ? 3 : 0) + (e.estres ? 1 : 0);   // ilustrativo
    const gap = 20 / gc;                                       // ∝ 1/GC (mar-gap-co2); constante ilustrativa
    const paco2 = e.sedacion ? 55 : 40;
    const menos = { no: 2, epoc: 8, embolia: 10 }[e.espacio];
    const fGasto = gc < 5 ? 1 - 0.05 * (5 - gc) : 1;
    const petco2 = e.esofago ? 0 : e.rcp ? 8 : Math.min(paco2, (paco2 - menos) * fGasto);
    const sinOnda = e.rcp || (e.frio && e.sensor === 'dedo');
    const avisos = [];
    if (!e.rcp && do2 < 200) avisos.push('Aporte extremo: combinación casi incompatible con la vida');
    const pvo2 = po2De(clamp(svo2 / (1 - fco), 0.01, 0.99));
    const gcIlu = e.compensa || e.volemia === 'baja' || e.gcFijo != null;   // el gasto lo pone el modelo: ilustrativo
    const R = {
        hb: e.hb, gc: +gc.toFixed(1), visc: +viscDe(e.hb).toFixed(1), ext: Math.round(o2er * 100),
        spo2: sinOnda ? null : pct(S), sao2: pct(sao2), cao2, unido, disuelto, do2: Math.round(do2), do2i: Math.round(do2 / SC),
        vo2: Math.round(vo2), vo2i: Math.round(vo2 / SC), o2er: +o2er.toFixed(2), svo2: pct(svo2), scvo2: pct(scvo2), ven: pct(ven),
        lact: +lact.toFixed(1), gap: Math.round(gap), petco2: Math.round(petco2), paco2,
    };
    R.dif = R.sao2 - R.svo2;                    // los cortes se comparan con las cifras redondeadas (CLAUDE §7.10)
    R.dual = R.spo2 == null ? null : R.spo2 - R.ven;
    return { gc, gcIlu, S, sao2, svo2, scvo2, ven, cao2, unido, disuelto, do2, vo2, o2er, dif, lact, gap, petco2, paco2, pedido, techo, shock, porAporte, deficit, sinOnda, avisos, pvo2, fco, R };
}
// Tabla 9.4 (válida solo con metabolismo normal y SaO₂ >90 %): qué dice la saturación venosa.
// Su columna «defecto de utilización» describe la sepsis, así que en la sepsis se rotula (también si hay fiebre o estrés,
// que la acompañan); con fiebre, estrés o sin tiamina fuera de la sepsis, no.
export function tabla94(R, e = {}) {
    if (R.sao2 <= 90) return { t: 'Tabla 9.4 no válida: SaO₂ ≤90 %', corto: 'SaO₂ ≤90 %', c: 'neutro' };
    if (e.util === 'sepsis' && (R.dif < 20 || R.svo2 > 80)) return { t: 'defecto de utilización', corto: 'defecto de utilización', c: 'mal' };
    if (e.consumo === 'fiebre' || e.estres || e.util === 'tiamina') return { t: 'Tabla 9.4 no válida: metabolismo alterado', corto: 'no válida: metab.', c: 'neutro' };
    if (R.dif < 20 || R.svo2 > 80) return { t: 'defecto de utilización', corto: 'defecto de utilización', c: 'mal' };
    if (R.dif >= 50 || R.svo2 <= 50) return { t: 'O₂ tisular amenazado', corto: 'O₂ tisular amenazado', c: 'mal' };
    if (R.dif > 30 || R.svo2 < 65) return { t: 'menos aporte', corto: 'menos aporte', c: 'aviso' };
    return { t: 'normal', corto: 'normal', c: 'ok' };
}

// Estados con nombre. `umbral`: el aporte con el que la extracción llega justo al 50 % (Fig. 9.3).
// `pestana`: la pestaña del dock que se abre con el estado; `lupa`: la lupa que se abre; `grupo`: dónde va su chip
// ('o2': caps. 7 y 9; 'anemia': cap. 12); `transfundir`: la Hb a la que llega la bolsa (se ve gotear).
// Sus fuentes (REGLAS §7.11) y su explicación guiada están en GUIAS, más abajo; ESTADOS[k].fuentes se rellena con ellas.
export const GC_UMBRAL = (PEDIDO.reposo * 0.98 / 0.5) / (1.34 * 15 * 0.98 * 10);
export const ESTADOS = {
    normal: { n: 'Normal', p: {}, ficha: 'mar-transporte-o2', pestana: 'sangre', grupo: 'o2' },
    anemia: { n: 'Anemia, gasto fijo', s: 'Hb 7,5', p: { hb: 7.5 }, ficha: 'mar-transporte-o2', pestana: 'sangre', grupo: 'o2' },
    hipoxemia: { n: 'Hipoxemia', s: 'PaO₂ 45', p: { pao2: 45 }, ficha: 'mar-transporte-o2', pestana: 'pulmon', grupo: 'o2' },
    'bajo-gasto': { n: 'Bajo gasto', s: 'GC 2,5', p: { gc: 2.5 }, ficha: 'mar-extraccion-lactato', pestana: 'corazon', grupo: 'o2' },
    umbral: { n: 'Umbral', s: 'extracción 50 %', p: { gc: GC_UMBRAL }, ficha: 'mar-extraccion-lactato', pestana: 'corazon', grupo: 'o2' },
    dependiente: { n: 'Dependiente', s: 'GC 2', p: { gc: 2 }, ficha: 'mar-extraccion-lactato', pestana: 'corazon', grupo: 'o2' },
    sepsis: { n: 'Sepsis', s: 'no usa el O₂', p: { gc: 6, util: 'sepsis' }, ficha: 'mar-extraccion-lactato', lupa: 'mito', pestana: 'tejido', grupo: 'o2' },
    tiamina: { n: 'Sin tiamina', s: 'PDH sin TPP', p: { util: 'tiamina' }, ficha: 'mar-extraccion-lactato', lupa: 'mito', pestana: 'tejido', grupo: 'o2' },
    co: { n: 'Humo (CO)', s: 'SpO₂ engaña', p: { co: true }, ficha: 'mar-oximetria', lupa: 'dedo', pestana: 'sangre', grupo: 'o2' },
    'dedo-frio': { n: 'Dedo frío', s: 'onda plana', p: { gc: 2.5, frio: true }, ficha: 'mar-oximetria', lupa: 'dedo', pestana: 'corazon', grupo: 'o2' },
    dual: { n: 'Oximetría dual', s: 'SpO₂ − SvO₂', p: { hb: 7.5 }, ficha: 'mar-oximetria', pestana: 'mido', grupo: 'o2' },
    'capno-normal': { n: 'Capnograma', s: 'normal', p: {}, ficha: 'mar-capnografia', lupa: 'boca', pestana: 'pulmon', grupo: 'o2' },
    'capno-epoc': { n: 'EPOC', s: 'fase II lenta', p: { espacio: 'epoc' }, ficha: 'mar-capnografia', lupa: 'boca', pestana: 'pulmon', grupo: 'o2' },
    'capno-sedacion': { n: 'Sedación', s: 'hipoventila', p: { sedacion: true }, ficha: 'mar-capnografia', lupa: 'boca', pestana: 'pulmon', grupo: 'o2' },
    'capno-esofago': { n: 'Esófago', s: 'sin CO₂', p: { esofago: true }, ficha: 'mar-capnografia', lupa: 'boca', pestana: 'pulmon', grupo: 'o2' },
    'capno-rcp': { n: 'RCP', s: 'PETCO₂ muy baja', p: { rcp: true }, ficha: 'mar-capnografia', lupa: 'boca', pestana: 'corazon', grupo: 'o2' },
    // Cap. 12 (fichas 1-3 de Merino HEMATO; maqueta del bloque 2)
    dilucion: { n: 'Dilución', s: 'el tubo', p: { hb: hbDeHto(41.8), dil: 'pie' }, ficha: 'merino-anemia', lupa: 'tubo', pestana: 'sangre', grupo: 'anemia' },
    'anemia-compensada': { n: 'Anemia que compensa', s: 'Hb 7,5', p: { hb: 7.5, compensa: true }, ficha: 'merino-anemia', pestana: 'corazon', grupo: 'anemia' },
    'techo-anemia': { n: 'El techo', s: 'Hb 3', p: { hb: 3, compensa: true }, ficha: 'merino-anemia', pestana: 'sangre', grupo: 'anemia' },
    'umbral-7': { n: 'Umbral 7', s: 'el de las guías', p: { hb: 7, compensa: true }, ficha: 'merino-transfusion', pestana: 'sangre', grupo: 'anemia' },
    transfusion: { n: 'Transfusión', s: 'Hb 6,4 → 8', p: { hb: 6.4, compensa: true }, transfundir: 8, ficha: 'merino-transfusion', pestana: 'sangre', grupo: 'anemia' },
    'anemia-hipovolemia': { n: 'Anemia sin volumen', s: 'volemia baja', p: { hb: 7.5, compensa: true, volemia: 'baja', gc: 4 }, ficha: 'merino-transfusion', pestana: 'corazon', grupo: 'anemia' },
    trali: { n: 'TRALI', s: 'el alvéolo', p: { hb: 8, compensa: true, pao2: 55, alveolo: 'trali' }, ficha: 'merino-riesgos', lupa: 'alveolo', pestana: 'pulmon', grupo: 'anemia' },
    taco: { n: 'TACO', s: 'el alvéolo', p: { hb: 8, compensa: true, pao2: 55, alveolo: 'taco' }, ficha: 'merino-riesgos', lupa: 'alveolo', pestana: 'pulmon', grupo: 'anemia' },
    // Cap. 17 (ficha «Fisiopatología de la inflamación: ROS»): `ros` solo cambia el dibujo de la lupa y el tope del O₂; no toca la fisiología
    neutrofilo: { n: 'Estallido', s: 'el neutrófilo', p: { ros: 'neutrofilo' }, ficha: 'mc-inflamacion-ros', lupa: 'neutrofilo', pestana: 'pulmon', grupo: 'ros' },
    reperfusion: { n: 'Reperfusión', s: 'otro órgano', p: { ros: 'reperfusion' }, ficha: 'mc-inflamacion-ros', lupa: 'neutrofilo', pestana: 'pulmon', grupo: 'ros' },
};
// El estado al que llega un estado con bolsa (la transfusión ya puesta): Hb de llegada con el gasto quieto.
export function estadoFinal(clave) {
    const s = ESTADOS[clave];
    if (!s || !s.transfundir) return estadoDe(s ? s.p : {});
    const e0 = estadoDe(s.p);
    return Object.assign(e0, { hb: s.transfundir, gcFijo: gastoDe(e0), transf: { de: s.p.hb, a: s.transfundir } });
}
// Los que salen como chips en «Ir a un estado» (dual y capno-normal se abren desde sus fichas).
export const ESTADOS_CHIPS = Object.keys(ESTADOS).filter(k => k !== 'dual' && k !== 'capno-normal');
export const GRUPOS_CHIPS = [['o2', 'El oxígeno: del pulmón a la mitocondria'], ['anemia', 'Anemia y transfusión'], ['ros', 'El neutrófilo y las ROS']];

/* ============================================================
   Conceptos (cada uno mueve el modelo)
   ============================================================ */
export const CONCEPTOS = [
    { titulo: 'El O₂ viaja pegado a la Hb',
        texto: 'El O₂ se disuelve mal en el plasma: <span class="hl">0,003 × PaO₂</span>. Con PaO₂ 90, 0,27 mL/dL: el <span class="hl-rojo">1,5 %</span> del contenido. El resto, 19,7 mL/dL, va unido a la Hb (1,34 mL por gramo). Total ≈ 20 mL/dL.',
        hacer: 'sube la PaO₂ a 100 y mira cuánto cambia el contenido; luego baja la Hb.', estado: {}, mirar: 'cao2',
        acciones: [{ t: 'PaO₂ 100', p: { pao2: 100 } }, { t: 'Hb 10', p: { hb: 10 } }, { t: 'Normal', p: {} }],
        mira: 'el CaO₂ del tablero: la PaO₂ casi no lo mueve; la Hb, mucho (quita hematíes de la fila). En el capilar, las perlas de cada hematíe frente a los tres O₂ sueltos del plasma.',
        fuente: 'mar-transporte-o2#mar-o2-disuelto · #mar-cao2-9' },
    { titulo: 'La curva en S protege',
        texto: 'La PaO₂ normal está en la <span class="hl">parte plana</span>: puede caer hasta 60 con poco cambio de saturación. La venosa (≈40 mmHg, 73 %) está en la parte <span class="hl-azul">empinada</span>, lo que facilita la captación de O₂ en los capilares pulmonares. La P50 marca su posición: 27 mmHg.',
        hacer: 'baja la PaO₂ paso a paso.', estado: {}, mirar: 'sao2',
        acciones: [{ t: 'PaO₂ 60', p: { pao2: 60 } }, { t: 'PaO₂ 45', p: { pao2: 45 } }, { t: 'PaO₂ 40', p: { pao2: 40 } }, { t: 'PaO₂ 90', p: {} }],
        mira: 'la SaO₂: 98 → 89 % con 60 (curva de fisiología general: la ficha solo dice que por encima de 60 los cambios son menores); 78 % con 45; 73 % con 40. Las perlas se vacían poco hasta que entras en la parte empinada.',
        fuente: 'mar-transporte-o2#mar-curva-forma · #mar-curva-desplazamientos (Fig. 9.1)' },
    { titulo: 'La anemia pesa más que la hipoxemia',
        texto: 'Bajar la Hb a la mitad (15 → 7,5) baja el CaO₂ <span class="hl-rojo">a la mitad</span> (20 → 10). Bajar la PaO₂ a la mitad (90 → 45; SaO₂ 98 → 78 %) solo lo baja <span class="hl">un 20 %</span> (20 → 16).',
        hacer: 'visita los dos estados y abre la Fig. 9.2 viva (Explorar).', estado: {}, mirar: 'cao2',
        acciones: [{ t: 'Hb a la mitad', p: { hb: 7.5 } }, { t: 'PaO₂ a la mitad', p: { pao2: 45 } }],
        mira: 'el capilar: en la anemia, <b>huecos en la fila</b> (la mitad de hematíes) y, con el gasto fijo, cada uno sale más vacío; en la hipoxemia, la fila está entera y cada hematíe entra con 3 perlas de cada 4.',
        fuente: 'mar-transporte-o2#mar-anemia-hipoxemia (Fig. 9.2)' },
    { titulo: 'Aporte, consumo y extracción',
        texto: '<span class="hl">DO₂ = GC × 1,34 × Hb × SaO₂ × 10</span> (900-1.100 mL/min). El tejido consume 250 (VO₂) y coge una cuarta parte: <span class="hl">O₂ER 0,25</span>. Si el aporte cae, sube la extracción y el consumo no cambia… <span class="hl-rojo">hasta el 50 %</span>: ahí el consumo empieza a depender del aporte.',
        hacer: 'baja el gasto hasta pasar el umbral.', estado: {}, mirar: 'o2er',
        acciones: [{ t: 'GC 3,5', p: { gc: 3.5 } }, { t: 'Umbral', p: { gc: GC_UMBRAL } }, { t: 'GC 2', p: { gc: 2 } }, { t: 'GC 8', p: { gc: 8 } }],
        mira: 'la O₂ER y la SvO₂ cambian; el VO₂ se queda en 250 hasta el umbral y luego cae (y sube el lactato). En Explorar, el punto de la Fig. 9.3 baja por la rampa.',
        fuente: 'mar-transporte-o2#mar-do2 · #mar-o2er · mar-extraccion-lactato#mar-extraccion-curva (Fig. 9.3)' },
    { titulo: 'La saturación venosa avisa',
        texto: 'Con metabolismo normal y SaO₂ &gt;90 %: SvO₂ 65-75 % normal; <span class="hl">&lt;65 % menos aporte</span>; <span class="hl-rojo">≤50 % O₂ tisular amenazado</span>; <span class="hl-rojo">&gt;80 % defecto de utilización</span>, casi siempre sepsis (Tabla 9.4). La ScvO₂ de la cava superior sale más alta en el crítico (de media un 7 %) y en el shock, hasta un 18 %.',
        hacer: 'compara el bajo gasto con la sepsis, y cambia la toma.', estado: {}, mirar: 'ven',
        acciones: [{ t: 'Bajo gasto', p: { gc: 2.5 } }, { t: 'Bajo gasto · ScvO₂', p: { gc: 2.5, toma: 'scvo2' } }, { t: 'Sepsis', p: { gc: 6, util: 'sepsis' } }],
        mira: 'los hematíes que salen del capilar: medio vacíos en el bajo gasto (SvO₂ 48 %) y casi llenos en la sepsis (83 %, ilustrativo). Con la toma en la cava, la ScvO₂ del shock engaña: 55 % (+7, ilustrativo).',
        fuente: 'mar-extraccion-lactato#mar-sao2-svo2-guia · #mar-svo2-guia · #mar-scvo2-9' },
    { titulo: 'El lactato no siempre es falta de O₂',
        texto: 'El lactato se produce también con O₂ (unos 20 mmol/kg al día). Con O₂ de sobra sube si la <span class="hl-azul">PDH</span> no trabaja (sepsis, déficit de tiamina) o con el estrés fisiológico, que sube la glucólisis aerobia un 40-50 %. Una revisión que cita el libro (ref. 44, p. 82) dice que la acumulación de lactato por hipoxia es «con mucho la excepción y no la regla».',
        hacer: 'abre la mitocondria y prueba cada causa.', estado: {}, lupa: 'mito', mirar: 'lact',
        acciones: [{ t: 'Sepsis', p: { gc: 6, util: 'sepsis' }, lupa: 'mito' }, { t: 'Sin tiamina', p: { util: 'tiamina' }, lupa: 'mito' }, { t: 'Estrés', p: { estres: true }, lupa: 'mito' }, { t: 'Aporte bajo (GC 2)', p: { gc: 2 }, lupa: 'mito' }],
        mira: 'en la lupa, la X sobre la PDH desvía el piruvato al lactato (puntos rojos). Las bandas del lactato y su mortalidad (≤2: 15 %; 2,1-3,9: 25 %; ≥4: 38 %) son de la Fig. 9.4; cuánto sube en cada estado, ilustrativo.',
        fuente: 'mar-extraccion-lactato#mar-tabla-9-5 · #mar-lactato-circular · #mar-lactato-conclusion · #mar-fig-9-4' },
    { titulo: 'El pulsioxímetro: dos colores y lo que late',
        texto: 'Dos luces: <span class="hl">660 nm</span> (rojo) y <span class="hl">940 nm</span> (infrarrojo); la HbO₂ y la Hb absorben al revés en cada una. Solo analiza <span class="hl-azul">lo que late</span> (A/B): así ignora las venas. No ve la COHb ni la metHb: en el CO <span class="hl-rojo">la SpO₂ sobrestima</span> la SaO₂.',
        hacer: 'mete humo y enfría el dedo.', estado: {}, lupa: 'dedo', mirar: 'spo2',
        acciones: [{ t: 'Humo (CO)', p: { co: true }, lupa: 'dedo' }, { t: 'Dedo frío', p: { gc: 2.5, frio: true }, lupa: 'dedo' }, { t: 'Sensor en la frente', p: { gc: 2.5, frio: true, sensor: 'frente' }, lupa: 'dedo' }],
        mira: 'con CO, SpO₂ 98 % y SaO₂ 74 % (COHb ilustrativa): en el capilar, perlas grises tachadas. Con el dedo frío, la onda se aplana (ilustrativo); en la frente vuelve. Exactitud: ±3-4 % una medida suelta; ±2-3 % las seriadas.',
        fuente: 'mar-oximetria#mar-oxi-absorcion · #mar-pulsioximetria · #mar-cooximetria · #mar-oxi-frente · #mar-oxi-exactitud' },
    { titulo: 'El CO₂ que se espira',
        texto: 'Fase I: espacio muerto anatómico. II: sube (lento si hay más espacio muerto alveolar, como en la EPOC). III: meseta hasta la <span class="hl">PETCO₂</span>. IV: inspiración. Sin CO₂: <span class="hl-rojo">tubo en el esófago</span>… o una parada, sin retorno venoso.',
        hacer: 'recorre los capnogramas.', estado: {}, lupa: 'boca', mirar: 'petco2',
        acciones: [{ t: 'EPOC', p: { espacio: 'epoc' }, lupa: 'boca' }, { t: 'Sedación', p: { sedacion: true }, lupa: 'boca' }, { t: 'Esófago', p: { esofago: true }, lupa: 'boca' }, { t: 'RCP', p: { rcp: true }, lupa: 'boca' }, { t: 'GC 2,5', p: { gc: 2.5 }, lupa: 'boca' }],
        mira: 'la onda grande de la lupa y la diferencia PaCO₂ − PETCO₂. Los cambios de PETCO₂ siguen a los del gasto (r = 0,87 entre los cambios, en posoperados); ≤10 tras 20 min de RCP, recuperar la circulación espontánea es improbable. Las cifras de PETCO₂ son ilustrativas.',
        fuente: 'mar-capnografia#mar-capno-f1 · #mar-capno-f2 · #mar-capno-intubacion · #mar-capno-gasto · #mar-capno-rcp · #mar-gradiente-co2' },
    // Cap. 12 (fichas 1-3 de Merino HEMATO). Las acciones con `estado` ponen el modelo en ese estado con nombre.
    { titulo: 'El corazón compensa la anemia',
        texto: 'La anemia baja la <span class="hl-azul">viscosidad</span>: la sangre normal es ≈3 veces más viscosa que el plasma y ≈4 veces más que el agua (Tabla 12.2). La resistencia es proporcional a la viscosidad (R = 8µL/πr⁴): con anemia, <span class="hl">el gasto sube</span>. En la Fig. 12.2 (un paciente con policitemia, no un anémico habitual) sube más de lo que cae el Hto, porque la sangre no es newtoniana: al fluir más deprisa, es menos viscosa. Todo esto, con la volemia mantenida.',
        hacer: 'compara la anemia con el gasto fijo y con el corazón que compensa.', estado: { hb: 7.5 }, mirar: 'gc',
        acciones: [{ t: 'Gasto fijo', estado: 'anemia' }, { t: 'El corazón compensa', estado: 'anemia-compensada' }, { t: 'Normal', estado: 'normal' }],
        mira: 'el gasto y la extracción del tablero: con el gasto fijo (la cuenta del cap. 9, Fig. 9.2, con el gasto quieto en 5 L/min), la extracción llega al 50 %; si el corazón compensa (cap. 12, con la volemia mantenida), se queda en ≈34 % y los hematíes corren más deprisa (gasto ilustrativo).',
        fuente: 'merino-anemia#mh-anemia-compensacion · #mh-tabla-12-2 · #mh-no-newtoniano' },
    { titulo: 'El techo: un Hto del 10 %',
        texto: 'La extracción sube hasta un máximo de ≈50 %. En la Fig. 12.3 (primates) llega con un <span class="hl-rojo">Hto del 10 % (Hb ≈3)</span>: por debajo, el consumo cae y sube el lactato. Por eso, opina el autor, una extracción del 50 % «podría servir» para indicar la transfusión (p. 6). En humanos, hasta Hb 5 parece seguro; en testigos de Jehová posoperados, el 50 % sobrevivió con Hb 2-3 y el 75 % con Hb 3-4 (p. 7).',
        hacer: 'baja la Hb con el corazón que compensa.', estado: { hb: 5, compensa: true }, mirar: 'o2er',
        acciones: [{ t: 'Hb 5', p: { hb: 5, compensa: true } }, { t: 'Hb 3: el techo', estado: 'techo-anemia' }, { t: 'Hb 2', p: { hb: 2, compensa: true } }],
        mira: 'la extracción llega al 50 % con Hb 3; con Hb 2 el VO₂ baja de 250 y sube el lactato (gasto y lactato, ilustrativos).',
        fuente: 'merino-anemia#mh-limite-compensacion · #mh-tolerancia' },
    { titulo: 'El Hto mide una concentración',
        texto: 'Tumbarse baja el Hto <span class="hl">4,1 puntos</span> (pasa a la sangre líquido de las piernas: +420 mL de plasma); un bolo de 20 mL/kg de salino, <span class="hl">4,2 puntos</span> a los 90 min. En los dos casos, como <span class="hl-rojo">perder una unidad de sangre (500 mL)</span>, sin perder un hematíe. La anemia se define por una concentración: Hb &lt;13 g/dL en varones y &lt;12 en mujeres (Tabla 12.1), y por eso la influye el volumen del plasma.',
        hacer: 'abre el tubo y prueba las dos cosas.', estado: { hb: hbDeHto(41.8), dil: 'pie' }, lupa: 'tubo', mirar: 'hb',
        acciones: [{ t: 'Tumbarse', p: { hb: hbDeHto(37.7), dil: 'tumbado' }, lupa: 'tubo' }, { t: 'Bolo de 20 mL/kg', p: { hb: hbDeHto(38.7), dil: 'bolo' }, lupa: 'tubo' }],
        mira: 'la columna roja (la masa) no se mueve; el plasma crece y el Hto cae. La Hb del tablero es el Hto entre 3 (fisiología general).',
        fuente: 'merino-anemia#mh-trampa-volumen' },
    { titulo: 'Transfundir sube el aporte, no el consumo',
        texto: 'Cada CH sube la Hb ≈1 g/dL y el Hto ≈3 %. En la Fig. 12.4, 1-2 CH subieron la Hb de 6,4 a 8 (+25 %) y el aporte, según el libro, «de forma parecida» (en el dibujo, ≈+17 %), pero <span class="hl-rojo">el consumo no cambió</span>: la extracción cayó. Y sin volumen el corazón no puede compensar: <span class="hl">la hipovolemia causa shock; la anemia, no</span>.',
        hacer: 'transfunde y luego quita volumen.', estado: { hb: 6.4, compensa: true }, mirar: 'vo2',
        acciones: [{ t: 'Transfundir 6,4 → 8', estado: 'transfusion' }, { t: 'Anemia sin volumen', estado: 'anemia-hipovolemia' }],
        mira: 'el VO₂ se queda en 250 aunque el aporte suba; sin volumen, el gasto no sube y el consumo cae (gasto y lactato, ilustrativos).',
        fuente: 'merino-transfusion#mh-efecto-transfusion · #mh-volumen-vs-celulas' },
    { titulo: 'TRALI o TACO',
        texto: 'Los dos dan insuficiencia respiratoria hipoxémica en las 6 h tras empezar la transfusión. <span class="hl-rojo">TRALI</span>: anticuerpos del donante contra los neutrófilos del receptor (80 %; en el otro ≈20 % no hay anticuerpos), que se quedan en el pulmón; 1 por cada 12.000 CH, mortalidad ≈50 %. <span class="hl">TACO</span>: edema hidrostático, ≈1 %, más con IC o IR previas; mortalidad del 20 %.',
        hacer: 'abre el alvéolo con cada uno.', estado: {}, lupa: 'alveolo', mirar: 'spo2',
        acciones: [{ t: 'TRALI', estado: 'trali' }, { t: 'TACO', estado: 'taco' }],
        mira: 'en el TRALI, los anticuerpos de la bolsa y los neutrófilos que pasan al alvéolo; en el TACO, el agua que cruza y un corazón dibujado grande (ilustración: el libro solo dice que el TACO es más frecuente con insuficiencia cardíaca previa, p. 15). La Rx real del TRALI está en la lámina, debajo de la lupa. La PaO₂ de 55 es ilustrativa.',
        fuente: 'merino-riesgos#mh-trali · #mh-taco' },
];

/* ============================================================
   Explicación guiada (REGLAS §7.10): 3-5 pasos por estado con nombre. Cada paso dice lo que pasa, señala en el
   dibujo dónde se ve (resalta: partes de la lámina o de la lupa; mirar: una cifra del tablero) y lleva su cita
   (core/citas.js: «Ver en la ficha», el párrafo exacto, y el PDF de segunda opción). Un paso puede poner el modelo en
   otro estado (estado: clave de ESTADOS o un estado parcial) o abrir otra lupa (lupa; false = sin lupa); si no lo
   dice, el modelo vuelve al estado de la explicación. `org`: el origen de las cifras del paso que no salen de la cita.
   Las fuentes de cada estado (ESTADOS[k].fuentes, REGLAS §7.11) se sacan de estas citas: libro, PDF, página, ficha e id.
   ============================================================ */
const L9 = { libro: 'Marino, The ICU Book (5.ª ed.), caps. 7 y 9', pdf: 'docs/marino-2024-practicas-monitorizacion-caps5-9.pdf' };
const L12 = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 12', pdf: 'docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf' };
const TO2 = (id, pag) => ({ ...L9, ficha: 'mar-transporte-o2', id, pag });
const EXL = (id, pag) => ({ ...L9, ficha: 'mar-extraccion-lactato', id, pag });
const OXI = (id, pag) => ({ ...L9, ficha: 'mar-oximetria', id, pag });
const CAP = (id, pag) => ({ ...L9, ficha: 'mar-capnografia', id, pag });
const ANE = (id, pag) => ({ ...L12, ficha: 'merino-anemia', id, pag });
const TRA = (id, pag) => ({ ...L12, ficha: 'merino-transfusion', id, pag });
const RIE = (id, pag) => ({ ...L12, ficha: 'merino-riesgos', id, pag });
const L17 = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 17', pdf: 'docs/marino-2024-shock-caps14-17.pdf' };
const L21 = { libro: 'Marino, The ICU Book (5.ª ed.), cap. 21', pdf: 'docs/marino-2024-cardiac-disorders-caps18-21.pdf' };
const ROS = (id, pag) => ({ ...L17, ficha: 'mc-inflamacion-ros', id, pag });
const POS = (id, pag) => ({ ...L21, ficha: 'mc-posresucitacion', id, pag });
const ILU = 'cifras del modelo: ilustrativas';
const INF = HEMODERIVADOS.ch.infusion;   // Tabla 12.4: tiempos de infusión por gravedad (p. 10)

export const GUIAS = {
    normal: [
        { t: 'Del pulmón llega la sangre arterial: cada hematíe trae casi llenas sus 4 perlas, los 4 sitios del hemo (SaO₂ 98 %). El O₂ viaja pegado a la Hb: 1,34 mL por gramo.', resalta: '#cpv-zona-arterial', mirar: 'sao2', cita: TO2('mar-hb-o2', '69-70') },
        { t: 'En el plasma va muy poco disuelto: 0,003 × PaO₂, 0,27 mL/dL. Es el 1,5 % de los ≈20 mL/dL del contenido arterial.', resalta: '#cpv-lam-plasma', mirar: 'cao2', cita: TO2('mar-cao2-9', '70') },
        { t: 'Con un gasto de 5 L/min llegan ≈985 mL/min de O₂: el aporte (DO₂ = GC × 1,34 × Hb × SaO₂ × 10).', resalta: '#cpv-zona-capilar', mirar: 'do2', cita: TO2('mar-do2', '72-73') },
        { t: 'El tejido coge 250 mL/min, una cuarta parte de lo que llega (O₂ER 0,25): cada hematíe sale con una perla de cada cuatro vacía, y la SvO₂ queda en ≈73 %.', resalta: '#cpv-zona-venosa', mirar: 'o2er', cita: [TO2('mar-o2er', '74-75'), TO2('mar-tabla-9-1', '67-68')] },
    ],
    anemia: [
        { t: 'Con la Hb a la mitad (15 → 7,5), la fila del capilar tiene huecos: la mitad de hematíes.', resalta: '#cpv-zona-capilar', mirar: 'hb', cita: TO2('mar-anemia-hipoxemia', '70-71'), org: 'la fila: ilustrativa' },
        { t: 'El contenido arterial cae a la mitad, de 20 a 10 mL/dL (Fig. 9.2): la curva en S protege de la hipoxemia, pero no de la anemia.', mirar: 'cao2', cita: TO2('mar-anemia-hipoxemia', '70') },
        { t: 'Si el gasto no cambiara (5 L/min), el aporte caería a ≈490 mL/min y el tejido tendría que subir la extracción hasta el 50 %: el umbral de la Fig. 9.3.', resalta: '#cpv-zona-venosa', mirar: 'o2er', cita: EXL('mar-extraccion-curva', '75-76') },
        { t: 'Pero el corazón compensa: con anemia la sangre es menos viscosa y el gasto sube, y la extracción no toca el techo hasta un Hto del 10 % (Hb ≈3). Así lo ves con el corazón que compensa.', estado: 'anemia-compensada', mirar: 'gc', cita: [ANE('mh-anemia-compensacion', '4'), ANE('mh-limite-compensacion', '6')], org: 'gasto: ilustrativo' },
    ],
    hipoxemia: [
        { t: 'La PaO₂ cae a la mitad (90 → 45), pero la SaO₂ solo baja a 78 %: cada hematíe entra con 3 perlas de cada 4.', resalta: '#cpv-zona-arterial', mirar: 'sao2', cita: TO2('mar-anemia-hipoxemia', '70') },
        { t: 'El contenido arterial baja solo un 20 % (20 → 16 mL/dL): mucho menos que con la Hb a la mitad.', mirar: 'cao2', cita: TO2('mar-anemia-hipoxemia', '70-71') },
        { t: 'Es la forma en S: la PaO₂ normal está en la parte plana y puede caer hasta 60 con poco cambio de saturación; la venosa (≈40) está en la parte empinada.', mirar: 'sao2', cita: TO2('mar-curva-forma', '68') },
    ],
    'bajo-gasto': [
        { t: 'El gasto cae a 2,5 L/min: los hematíes pasan más despacio por el capilar.', resalta: '#cpv-zona-capilar', mirar: 'do2', cita: TO2('mar-do2', '72-73'), org: 'la velocidad: ilustrativa' },
        { t: 'El aporte cae a la mitad (≈490 mL/min). Para seguir consumiendo 250, el tejido sube la extracción hasta el 50 % (Fig. 9.3).', mirar: 'o2er', cita: EXL('mar-extraccion-curva', '75-76') },
        { t: 'Los hematíes salen con la mitad de las perlas vacías: SvO₂ ≈49 %. Una SvO₂ ≤50 % es oxigenación tisular amenazada (Tabla 9.4).', resalta: '#cpv-zona-venosa', mirar: 'ven', cita: EXL('mar-svo2-guia', '77') },
        { t: 'Con menos gasto, también baja la PETCO₂: sus cambios siguen a los del gasto (r = 0,87 entre los cambios, en posoperados, Fig. 7.8).', resalta: '#cpv-capno-mini', mirar: 'petco2', cita: CAP('mar-capno-gasto', '46'), org: 'PETCO₂: ilustrativa' },
    ],
    umbral: [
        { t: 'Bajando el gasto llega un punto en que la extracción (SaO₂ − SvO₂) ha pasado del 25 % al 50 %.', resalta: '#cpv-zona-venosa', mirar: 'o2er', cita: EXL('mar-extraccion-curva', '75') },
        { t: 'Hasta aquí el consumo no cambia: VO₂ 250 mL/min, la meseta de la Fig. 9.3.', mirar: 'vo2', cita: EXL('mar-extraccion-curva', '75-76') },
        { t: 'Es el umbral del metabolismo limitado por el O₂: si el aporte baja más, el consumo cae con él.', mirar: 'vo2', cita: EXL('mar-extraccion-curva', '75') },
    ],
    dependiente: [
        { t: 'Con gasto 2 el aporte (≈394 mL/min) ya no llega: la extracción no puede pasar del 50 %.', resalta: '#cpv-zona-venosa', mirar: 'o2er', cita: EXL('mar-extraccion-curva', '75') },
        { t: 'El consumo cae con el aporte (VO₂ ≈201): el consumo depende del aporte.', mirar: 'vo2', cita: EXL('mar-extraccion-curva', '75-76') },
        { t: 'La célula suelta lactato. Un lactato &gt;2 mmol/L se considera el marcador más fiable de mala oxigenación tisular.', resalta: '#cpv-zona-celula', mirar: 'lact', cita: EXL('mar-lactato-supervivencia', '78'), org: 'cuánto sube: ilustrativo' },
    ],
    sepsis: [
        { t: 'Llega O₂ de sobra (gasto 6 L/min), pero la mitocondria no lo usa: la PDH, la puerta del piruvato, está inhibida por la endotoxina y las citocinas.', resalta: '#cpv-lupa-pdh', cita: EXL('mar-lactato-sepsis', '81') },
        { t: 'El piruvato se desvía a lactato aunque haya O₂: lactato aerobio. Las catecolaminas, además, aceleran la glucólisis.', resalta: '#cpv-lupa-lact', mirar: 'lact', cita: [EXL('mar-lactato-sepsis', '81'), EXL('mar-lactato-aerobio', '80')] },
        { t: 'Los hematíes salen casi llenos: una SvO₂ &gt;80 % (o SaO₂ − SvO₂ &lt;20 %) es defecto de utilización, casi siempre por sepsis (Tabla 9.4).', lupa: false, resalta: '#cpv-zona-venosa', mirar: 'ven', cita: EXL('mar-sao2-svo2-guia', '76-77'), org: 'SvO₂ 83 %: ilustrativa' },
        { t: 'Una revisión que cita el libro (ref. 44) lo resume: «cualquier aumento del lactato suele reflejar algo distinto de la limitación de O₂; la acumulación de lactato por hipoxia es, con mucho, la excepción y no la regla».', lupa: false, mirar: 'lact', cita: EXL('mar-lactato-conclusion', '82') },
    ],
    tiamina: [
        { t: 'La PDH necesita pirofosfato de tiamina (TPP) como cofactor para meter el piruvato en la mitocondria.', resalta: '#cpv-lupa-pdh', cita: EXL('mar-lactato-tiamina', '81') },
        { t: 'Sin él, el piruvato se desvía a lactato: hiperlactatemia aerobia, con O₂ de sobra.', resalta: '#cpv-lupa-lact', mirar: 'lact', cita: EXL('mar-lactato-tiamina', '81'), org: 'lactato: ilustrativo' },
        { t: 'Se considera frecuente y a menudo no reconocido en el crítico. La saturación venosa en este déficit, la ficha no la da: el modelo no la toca.', cita: EXL('mar-lactato-tiamina', '81') },
    ],
    co: [
        { t: 'El pulsioxímetro usa dos luces, roja (660 nm) e infrarroja (940 nm): solo distingue la HbO₂ de la Hb.', resalta: '#cpv-lupa-luces', cita: OXI('mar-oxi-absorcion', '36-37') },
        { t: 'La COHb no la ve: la SpO₂ sigue en 98 %, pero la SaO₂ real ha caído (74 % con una COHb del 25 %).', resalta: '#cpv-lupa-pie', mirar: 'sao2', cita: OXI('mar-cooximetria', '40'), org: 'COHb 25 %: ilustrativa' },
        { t: 'En el capilar, las perlas grises tachadas son sitios ocupados por CO: no llevan O₂. El contenido arterial cae a ≈15 mL/dL.', lupa: false, resalta: '#cpv-zona-arterial', mirar: 'cao2', cita: OXI('mar-cao2', '41'), org: ILU },
        { t: 'Si se sospecha CO o metahemoglobina: gasometría arterial con cooximetría, que usa hasta 8 longitudes de onda.', cita: OXI('mar-cooximetria', '40') },
    ],
    'dedo-frio': [
        { t: 'El pulsioxímetro solo analiza lo que late (A/B en el fotopletismograma): así ignora la sangre de las venas.', resalta: '#cpv-lupa-pleti', cita: OXI('mar-pulsioximetria', '37-38') },
        { t: 'Con hipotensión o vasoconstricción periférica, la SpO₂ del dedo puede fallar: en el modelo, la onda se aplana.', resalta: '#cpv-lupa-pleti', mirar: 'spo2', cita: OXI('mar-oxi-frente', '39'), org: 'onda plana: ilustrativa' },
        { t: 'En la frente, la circulación viene de la carótida interna y se contrae menos: la SpO₂ vuelve. Se sujeta con una cinta elástica, que reduce la interferencia de las pulsaciones venosas, que pueden confundirse con las arteriales.', estado: { gc: 2.5, frio: true, sensor: 'frente' }, mirar: 'spo2', cita: OXI('mar-oxi-frente', '39-40') },
    ],
    dual: [
        { t: 'La diferencia SpO₂ − SvO₂ equivale aproximadamente a la extracción de O₂ de los capilares.', resalta: '#cpv-zona-venosa', mirar: 'ven', cita: OXI('mar-dual', '43') },
        { t: 'Aquí, con Hb 7,5 y el gasto fijo en 5, 98 − 48 = 50 %: ≥50 % es amenaza para el metabolismo aerobio.', mirar: 'ven', cita: OXI('mar-dual-tabla', '43') },
        { t: 'En la anemia, un SpO₂ − SvO₂ ≥50 % ha resultado un indicador válido para transfundir hematíes.', cita: OXI('mar-dual', '43') },
        { t: 'Ojo: es con el gasto fijo. Si el corazón compensa, con esta Hb la extracción se queda lejos del 50 %. Opinión del autor: en la anemia, la extracción del 50 % «puede usarse» como disparador de la transfusión (p. 8), mejor que la Hb; algunas guías proponen abandonar la Hb como disparador.', estado: 'anemia-compensada', mirar: 'o2er', cita: [ANE('mh-limite-compensacion', '6'), TRA('mh-extraccion-disparador', '8')], org: 'gasto: ilustrativo' },
    ],
    'capno-normal': [
        { t: 'Fase I: el principio de la espiración, gas del espacio muerto anatómico, casi sin CO₂.', resalta: '#cpv-lupa-f1', cita: CAP('mar-capno-f1', '44') },
        { t: 'Fase II: el CO₂ sube, rápido cuando ventilación y perfusión están emparejadas.', resalta: '#cpv-lupa-f2', cita: CAP('mar-capno-f2', '44') },
        { t: 'Fase III: la meseta; al final, la PETCO₂. Fase IV: empieza la inspiración.', resalta: '#cpv-lupa-f3', mirar: 'petco2', cita: [CAP('mar-capno-f3', '44-45'), CAP('mar-capno-f4', '45')] },
        { t: 'En el sano, la PETCO₂ y la PaCO₂ son casi iguales.', resalta: '#cpv-lupa-paco2', cita: CAP('mar-gradiente-co2', '47'), org: 'PETCO₂ 38: ilustrativa' },
    ],
    'capno-epoc': [
        { t: 'En la EPOC hay más espacio muerto alveolar: alvéolos con la PCO₂ baja.', cita: CAP('mar-capno-f2', '44') },
        { t: 'Por eso la fase II sube despacio.', resalta: '#cpv-lupa-f2', cita: CAP('mar-capno-f2', '44') },
        { t: 'La PETCO₂ se queda por debajo de la PaCO₂ (Tabla 7.1): la diferencia sirve para seguir la evolución.', resalta: '#cpv-lupa-paco2', mirar: 'petco2', cita: [CAP('mar-gradiente-co2', '47'), CAP('mar-tabla-7-1', '47')], org: 'PETCO₂: ilustrativa' },
    ],
    'capno-sedacion': [
        { t: 'La sedación puede causar hipoventilación: más en ancianos, obesos, con apnea del sueño o retención crónica de CO₂.', cita: CAP('mar-capno-sedacion', '45') },
        { t: 'La PETCO₂ sube antes de que baje la SpO₂: aquí 53 mmHg, con la SpO₂ aún en 98 %.', resalta: '#cpv-lupa-capno', mirar: 'petco2', cita: CAP('mar-capno-sedacion', '45'), org: 'PETCO₂: ilustrativa' },
        { t: 'Por eso la capnografía es superior a la oximetría para detectarla y se recomienda siempre que se seda para un procedimiento.', mirar: 'spo2', cita: CAP('mar-capno-sedacion', '45') },
    ],
    'capno-esofago': [
        { t: 'Tras intubar, el capnograma sale plano: no hay CO₂ espirado.', resalta: '#cpv-lupa-capno', mirar: 'petco2', cita: CAP('mar-capno-intubacion', '46') },
        { t: 'La intubación esofágica no reconocida se da en 1 de cada 18 intubaciones urgentes del crítico, y auscultar no siempre la distingue.', cita: CAP('mar-capno-intubacion', '46') },
        { t: 'Confirmar el tubo con el CO₂ espirado es estándar de cuidado.', cita: CAP('mar-capno-intubacion', '46') },
    ],
    'capno-rcp': [
        { t: 'En la parada puede haber muy poco CO₂ con el tubo bien puesto: sin retorno venoso, apenas llega CO₂ al alvéolo.', resalta: '#cpv-lupa-capno', cita: CAP('mar-capno-intubacion', '46') },
        { t: 'Los cambios de la PETCO₂ siguen a los del gasto (r = 0,87 entre los cambios, en posoperados, Fig. 7.8).', cita: CAP('mar-capno-gasto', '46') },
        { t: 'Si tras 20 minutos de RCP la PETCO₂ sigue ≤10 mmHg, es improbable recuperar la circulación espontánea.', mirar: 'petco2', cita: CAP('mar-capno-rcp', '47'), org: 'PETCO₂ 8: ilustrativa' },
    ],
    // ---- Cap. 12 ----
    dilucion: [
        { t: 'La anemia se mide con concentraciones, el Hto y la Hb: la masa de hematíes, la medida exacta, no se usa en la clínica. Se define por Hb &lt;13 g/dL (Hto &lt;40 %) en varones y &lt;12 (Hto &lt;38 %) en mujeres (Tabla 12.1), y por ser una concentración, la influye el volumen del plasma.', resalta: '#cpv-tubo-izq', mirar: 'hb', cita: [ANE('mh-anemia-corte', '2'), ANE('mh-tabla-12-1', '2')] },
        { t: 'Al tumbarse, baja la presión de los capilares de las piernas y pasa líquido intersticial a la sangre (+420 mL de plasma): el Hto cae de 41,8 a 37,7 %.', estado: { hb: hbDeHto(37.7), dil: 'tumbado' }, resalta: '#cpv-tubo-der', cita: ANE('mh-trampa-volumen', '2-3') },
        { t: 'La columna roja, la masa de hematíes, mide lo mismo en los dos tubos: solo ha crecido el plasma.', estado: { hb: hbDeHto(37.7), dil: 'tumbado' }, resalta: ['#cpv-tubo-p1-masa', '#cpv-tubo-p2-masa'], cita: ANE('mh-trampa-volumen', '2') },
        { t: 'Un bolo de 20 mL/kg de salino hace lo mismo: 42,9 → 38,7 % a los 90 min. Las dos caídas equivalen a perder una unidad de sangre (500 mL, dice el pie de la Fig. 12.1; el texto de la p. 2 dice «una unidad de hematíes») sin perder un hematíe.', estado: { hb: hbDeHto(38.7), dil: 'bolo' }, resalta: '#cpv-tubo-der', cita: ANE('mh-trampa-volumen', '2-3') },
        { t: 'En el crítico el volumen plasmático suele estar aumentado: la Hb y el Hto sobrestiman la anemia.', estado: { hb: hbDeHto(38.7), dil: 'bolo' }, mirar: 'hb', cita: ANE('mh-trampa-volumen', '3'), org: 'Hb = Hto / 3: fisiología general' },
    ],
    'anemia-compensada': [
        { t: 'Con menos hematíes, la sangre es menos viscosa: la normal es ≈4 veces más viscosa que el agua; con un Hto del 22,5 % (Hb 7,5), ≈2,3 veces, un valor entre las filas del 20 % (2,1) y el 30 % (2,8) de la Tabla 12.2.', resalta: '#cpv-lam-plasma', mirar: 'hb', cita: ANE('mh-tabla-12-2', '4-5'), org: 'Hto = 3 × Hb y el valor entre filas de la tabla: fisiología general' },
        { t: 'La resistencia al flujo es proporcional a la viscosidad (R = 8µL/πr⁴): con menos resistencia, el corazón bombea más.', mirar: 'gc', cita: ANE('mh-anemia-compensacion', '4-5') },
        { t: 'Y sube más de lo que cae el Hto, porque la sangre no es newtoniana: a más flujo, menos viscosa (Fig. 12.2, de un paciente con policitemia). Aquí, ≈7,6 L/min; los hematíes corren más deprisa.', resalta: '#cpv-zona-capilar', mirar: 'gc', cita: ANE('mh-no-newtoniano', '5-6'), org: 'gasto: ilustrativo' },
        { t: 'El aporte aun así baja (≈750 mL/min), pero la extracción sube (≈34 %) y el consumo se queda en 250: lejos del techo del 50 %.', resalta: '#cpv-zona-venosa', mirar: 'o2er', cita: ANE('mh-limite-compensacion', '6'), org: ILU },
    ],
    'techo-anemia': [
        { t: 'Hb 3, un Hto del 10 %: anemia extrema. El corazón ya bombea ≈12,7 L/min.', mirar: 'gc', cita: ANE('mh-limite-compensacion', '6'), org: 'gasto: ilustrativo (forma de la Fig. 12.3, en primates)' },
        { t: 'La extracción llega a su máximo, ≈50 %: es el techo de la Fig. 12.3.', resalta: '#cpv-zona-venosa', mirar: 'o2er', cita: ANE('mh-limite-compensacion', '6') },
        { t: 'Por debajo (aquí, Hb 2) el consumo cae y sube el lactato: oxigenación tisular insuficiente. Por eso, opina el autor, una extracción del 50 % «podría servir» para indicar la transfusión (p. 6).', estado: { hb: 2, compensa: true }, resalta: '#cpv-zona-celula', mirar: 'vo2', cita: [ANE('mh-limite-compensacion', '6'), TRA('mh-extraccion-disparador', '8')], org: 'lactato: ilustrativo' },
        { t: 'Las fuentes discrepan, y las dos son del libro: con la Fig. 12.3 (p. 6), bajo un Hto del 10 % cae el consumo; pero en animales con la volemia mantenida (p. 7), un Hto de 5-10 % (Hb 1,5-3) no dañó la oxigenación de los tejidos. No se elige una: el modelo pone el techo en Hb 3.', mirar: 'hb', cita: [ANE('mh-limite-compensacion', '6'), ANE('mh-tolerancia', '7')] },
        { t: 'En humanos, una Hb de hasta 5 parece segura (hemodilución en adultos sanos). Entre 300 testigos de Jehová posoperados, el 50 % sobrevivió con Hb 2-3 y el 75 % con Hb 3-4; algunos toleran 2-3.', mirar: 'hb', cita: ANE('mh-tolerancia', '7') },
    ],
    'umbral-7': [
        { t: 'Hb &lt;7: el umbral de las guías en el crítico estable sin cardiopatía isquémica (incluye el shock séptico y la poscirugía cardíaca).', mirar: 'hb', cita: TRA('mh-umbrales-guias', '8') },
        { t: 'Hb &lt;8 con cardiopatía isquémica o en la cirugía cardíaca u ortopédica. La fuente nombra la cirugía cardíaca en los dos umbrales: la ficha lo explica en su nota.', estado: { hb: 8, compensa: true }, mirar: 'hb', cita: [TRA('mh-umbrales-guias', '8'), TRA('merino-nota-hb-cirugia-cardiaca', '8')] },
        { t: 'Con Hb 7, la extracción está en ≈34 %, lejos del 50 %. La Hb no informa de si el tejido recibe el O₂ que necesita.', mirar: 'o2er', cita: TRA('mh-hb-mal-disparador', '8'), org: ILU },
        { t: 'Por eso algunas guías proponen la extracción: SaO₂ − ScvO₂ (pulsioxímetro y catéter de oximetría) o, con la SaO₂ cerca del 100 %, una ScvO₂ &lt;70 %.', estado: { hb: 7, compensa: true, toma: 'scvo2' }, mirar: 'ven', cita: TRA('mh-extraccion-disparador', '8-9') },
    ],
    transfusion: [
        { t: 'Hb 6,4: se transfunden 1-2 concentrados de hematíes (CH). En un adulto medio, cada uno sube la Hb ≈1 g/dL y el Hto ≈3 %.', resalta: '#cpv-bolsa', mirar: 'hb', cita: TRA('mh-efecto-transfusion', '10') },
        { t: `La bolsa es muy viscosa (Hto 60 %) y gotea despacio: por gravedad, un CH sin diluir tarda ${INF.sinDiluir.g20} min por un catéter de 20 G y ${INF.sinDiluir.g18} min por uno de 18 G; con 100 mL de salino, ${INF.con100.g20} y ${INF.con100.g18} min (Tabla 12.4). La pauta recomendada es de unas 2 h por unidad en el estable, y la dilución probablemente no hace falta.`, resalta: '#cpv-bolsa', cita: [TRA('mh-tabla-12-4', '10'), TRA('mh-tiempo-infusion', '10')] },
        { t: 'La Hb sube de 6,4 a 8 (un 25 %); el libro dice que el aporte sube «de forma parecida», y en la Fig. 12.4 pasa de ≈295 a ≈347 mL/min/m² (≈+17 %, leído del dibujo). Mientras gotea la bolsa, el modelo deja quieto el gasto: así el aporte sube lo mismo que la Hb.', mirar: 'do2', cita: TRA('mh-efecto-transfusion', '10-11'), org: 'gasto quieto: ilustrativo' },
        { t: 'Pero el consumo no cambia (VO₂ 250): cae la extracción, al revés que en la anemia (Fig. 12.4).', resalta: '#cpv-zona-venosa', mirar: 'vo2', cita: TRA('mh-efecto-transfusion', '10-11') },
        { t: 'La transfusión no debe considerarse un método absoluto para mejorar la oxigenación de los tejidos, y la sangre almacenada mucho tiempo puede incluso empeorarla.', cita: TRA('mh-efecto-transfusion', '11') },
    ],
    'anemia-hipovolemia': [
        { t: 'La misma Hb que en «Anemia que compensa», pero sin volumen: el corazón no puede subir el gasto (aquí, 4 L/min).', mirar: 'gc', cita: TRA('mh-volumen-vs-celulas', '16-17'), org: 'gasto: ilustrativo' },
        { t: 'El aporte cae a ≈394 mL/min, la extracción toca el techo y el consumo depende del aporte: sube el lactato. Eso lo calcula el modelo con lo que el libro dice del techo (p. 6); la fuente no lo dice de una anemia con hipovolemia.', resalta: '#cpv-zona-celula', mirar: 'vo2', cita: [EXL('mar-extraccion-curva', '75'), ANE('mh-limite-compensacion', '6')], org: ILU },
        { t: 'Devuélvele el volumen: el gasto vuelve a subir (el libro: las anemias extremas no dañan la oxigenación si se mantiene la volemia, p. 16-17). Que el consumo vuelva a 250 lo pone el modelo; la fuente no lo dice.', estado: 'anemia-compensada', mirar: 'vo2', cita: TRA('mh-volumen-vs-celulas', '16-17') },
        { t: 'La hipovolemia es causa de shock; la anemia, no: el volumen puede pesar más que la Hb (Fig. 12.6).', mirar: 'gc', cita: TRA('mh-volumen-vs-celulas', '17') },
    ],
    trali: [
        { t: 'TRALI: una lesión pulmonar inflamatoria parecida al SDRA. Rara (1 de cada 12.000 CH), pero la primera causa de muerte por transfusión, con una mortalidad cercana al 50 %.', resalta: '#cpv-alv-alveolo', cita: RIE('mh-trali', '14') },
        { t: 'En el 80 % de los casos, anticuerpos del donante, que llegan con la bolsa, se unen a los neutrófilos del receptor. En el otro ≈20 % no intervienen anticuerpos, y el agente responsable no se ha identificado.', resalta: '#cpv-alv-bolsa', cita: RIE('mh-trali', '14') },
        { t: 'Los neutrófilos activados se quedan en los capilares pulmonares y pasan al pulmón, donde causan la lesión inflamatoria.', resalta: '#cpv-alv-neutros', cita: RIE('mh-trali', '14') },
        { t: 'Insuficiencia respiratoria hipoxémica, a menudo en la primera hora y hasta las 6 h, con fiebre frecuente; en la Rx, un infiltrado bilateral como el del SDRA (Fig. 12.5).', mirar: 'spo2', cita: RIE('mh-trali', '14-15'), org: 'PaO₂ 55: ilustrativa' },
        { t: 'Qué hacer: parar la transfusión al primer signo de dificultad respiratoria, avisar al banco de sangre y dar soporte como en el SDRA. Una PCR alta y la ausencia de insuficiencia cardíaca o de sobrecarga de líquido apoyan el TRALI frente al TACO.', cita: RIE('mh-trali', '14-15') },
    ],
    taco: [
        { t: 'TACO: la complicación pulmonar más frecuente de la transfusión de hematíes (≈1 %): edema pulmonar hidrostático en las primeras 6 h.', resalta: '#cpv-alv-agua', cita: RIE('mh-taco', '15') },
        { t: 'El agua entra por presión. Es más frecuente con insuficiencia cardíaca o renal previas, propensos a la sobrecarga de líquido.', resalta: '#cpv-alv-corazon', cita: RIE('mh-taco', '15') },
        { t: 'No hay relación con el número de unidades. Mortalidad del 20 %; tres de cada cuatro necesitan ventilación mecánica.', mirar: 'spo2', cita: RIE('mh-taco', '15-16'), org: 'PaO₂ 55: ilustrativa' },
        { t: 'Puede ser indistinguible del TRALI: la misma ventana de 6 h, y fiebre en el 30 % de los casos. Orientan al TACO la insuficiencia cardíaca previa, la sobrecarga de líquido o la insuficiencia renal.', cita: RIE('mh-taco', '16') },
        { t: 'Qué hacer: parar la transfusión si no ha terminado, avisar al banco y poner un diurético de asa intravenoso; el resto es soporte, como en el TRALI. Antes de futuras transfusiones, se aconseja identificar y corregir el balance positivo con diuréticos.', cita: RIE('mh-taco', '16') },
    ],
    neutrofilo: [
        { t: 'En la fase inicial de la inflamación, el neutrófilo multiplica hasta por 20 su consumo de O₂ durante 15-20 minutos: es el «estallido respiratorio».', resalta: '#cpv-lupa-neu-titulo', cita: ROS('mc-estallido', '53') },
        { t: 'El nombre engaña: ese O₂ no se dedica a fabricar ATP (no es respiración celular), sino derivados nocivos del oxígeno para matar microbios. La NADPH oxidasa de la membrana se activa y añade electrones al O₂ de uno en uno.', resalta: '#cpv-lupa-nadph', cita: [ROS('mc-estallido', '53'), ROS('mc-fig-17-1', '54')] },
        { t: 'O₂ → radical superóxido (O₂·) → con 2 H⁺ → peróxido de hidrógeno (H₂O₂).', resalta: '#cpv-lupa-cadena', cita: ROS('mc-fig-17-1', '54') },
        { t: 'El H₂O₂ se bifurca: con Fe²⁺/Fe³⁺ da radical hidroxilo (HO·); con Cl⁻ y mieloperoxidasa, hipoclorito, el ingrediente activo de la lejía doméstica.', resalta: '#cpv-lupa-fork', cita: ROS('mc-fig-17-1', '54') },
        { t: 'Son armas contra los microbios (sin NADPH oxidasa, en la enfermedad granulomatosa crónica, hay infecciones recurrentes), pero también dañan al huésped, incluidos el endotelio y su glucocálix, cuando las ROS superan a los antioxidantes: estrés oxidante.', cita: [ROS('mc-ros', '53-55'), ROS('mc-lesion-oxidante', '55')] },
    ],
    reperfusion: [
        { t: 'El peróxido de hidrógeno se mueve libremente por los tejidos y puede entrar en el torrente sanguíneo.', resalta: '#cpv-lupa-vaso', cita: ROS('mc-lesion-oxidante-foco', '55') },
        { t: 'Por la sangre alcanza órganos distantes, donde puede entrar en las células.', resalta: '#cpv-lupa-organo', cita: ROS('mc-lesion-oxidante-foco', '55') },
        { t: 'Allí, al encontrar hierro en estado reducido (Fe²⁺), genera radicales hidroxilo: un posible mecanismo del fallo multiorgánico en la lesión pulmonar inflamatoria, la sepsis o tras la reperfusión diseminada que sigue a un paro cardíaco.', resalta: '#cpv-lupa-fe', cita: ROS('mc-lesion-oxidante-foco', '55') },
        { t: 'Tras la parada, el O₂ de más tampoco ayuda: la hiperoxia agrava la lesión neurológica y el O₂ se usa solo para corregir una SaO₂ <90 %. Sube la PaO₂ con la SaO₂ ya sobre 90 % y mira el sello.', mirar: 'sao2', cita: POS('mc-tabla-21-4', '66-67'), org: 'PaO₂ 91-100: ilustrativa' },
    ],
};
// Las fuentes de cada estado (REGLAS §7.11): la lista de sus citas, sin repetir, en el orden de la explicación. Otro
// libro puede añadir las suyas (ESTADOS[k].fuentes.push) sin rehacer el modelo; nunca se funden.
for (const [k, s] of Object.entries(ESTADOS)) {
    const vistos = new Set();
    s.fuentes = (GUIAS[k] || []).flatMap(p => (Array.isArray(p.cita) ? p.cita : p.cita ? [p.cita] : []))
        .filter(c => { const id = `${c.ficha}#${c.id}`; if (vistos.has(id)) return false; vistos.add(id); return true; });
}

/* ============================================================
   Mayéutica: { id, serie: 'guia'|'examen', tipo: 'test'|'destapa'|'error', fuente, estado, lupa, mirar,
     tocar: { mandos, ocultar, instruccion, comprobar(estado, vistos), pista, bueno, confirma(R) }, despues,
     enunciado, opciones: [{ t, ok, porque }], puntos: [], frases: [{ t, mal, c }], explicacion, nota }
   Las opciones salen en el orden escrito: la posición de la buena se reparte a mano y la comprueba pruebasCapilar().
   ============================================================ */
export const PREGUNTAS = [
    // ---- Guía socrática: la cadena de la ficha XVIII (mar-transporte-o2) ----
    { id: 'co-g1', serie: 'guia', corto: 'para qué la Hb', tipo: 'test', fuente: 'mar-transporte-o2#mar-o2-disuelto · #mar-cao2-9', estado: {}, mirar: 'cao2',
        enunciado: 'Si el O₂ se disuelve en el plasma, ¿para qué hace falta la hemoglobina?',
        opciones: [
            { t: 'No hace falta si respira O₂ al 100 %: con PaO₂ 500 basta el disuelto', ok: false, porque: 'Con PaO₂ 500 el disuelto es 0,003 × 500 = 1,5 mL/dL, frente a los ≈20 que lleva la Hb normal. Al anémico el O₂ puro solo le añade ese poco: seguiría con mucho menos O₂ del que necesita.' },
            { t: 'Porque se disuelve poco: es el 1,5 % del contenido', ok: true },
            { t: 'Porque el disuelto solo cuenta si la PaO₂ pasa de 100', ok: false, porque: 'Cuenta siempre, pero poco: con 90 mmHg, 0,27 mL/dL. Si esperaras que subir la PaO₂ compensara una anemia, el paciente seguiría sin O₂: cada 10 mmHg añaden 0,03 mL/dL.' }],
        explicacion: 'O₂ disuelto = <span class="hl">0,003 × PaO₂</span>: con 90 mmHg, 0,27 mL/dL. Unido a la Hb: 1,34 × 15 × 0,98 = 19,7. Total ≈ 20 mL/dL; el disuelto es el <span class="hl-rojo">1,5 %</span>. Por eso hace falta la Hb.' },
    { id: 'co-g2', serie: 'guia', corto: 'PaO₂ 60', tipo: 'test', fuente: 'mar-transporte-o2#mar-curva-forma (Fig. 9.1)', estado: {}, mirar: 'sao2',
        tocar: { mandos: ['pao2'], ocultar: ['spo2', 'sao2', 'cao2', 'ven'], instruccion: 'baja la PaO₂ a 60 y pulsa «Comprobar».', comprobar: e => e.pao2 >= 58 && e.pao2 <= 62, pista: 'Mueve el deslizador de la PaO₂ hasta 60.', bueno: { pao2: 60 },
            confirma: R => `con PaO₂ 60, SaO₂ ${R.sao2} % y CaO₂ ${dec(R.cao2, 1)} mL/dL. Poco cambio.` },
        enunciado: 'La PaO₂ cae de 90 a 60 mmHg: un tercio. ¿Cuánto cae la saturación? Contesta y compruébalo en el modelo.',
        opciones: [
            { t: 'Un tercio también, hasta ≈65 %: van en paralelo', ok: false, porque: 'La curva no es una recta. Si lo creyeras, verías una desaturación grave donde no la hay y subirías el O₂ o la presión de la ventilación sin necesidad.' },
            { t: 'Nada: la Hb sigue saturada mientras la PaO₂ pase de 40', ok: false, porque: '40 mmHg es la PO₂ venosa, en la parte empinada: ahí la saturación es del 73 %. Si esperaras a ver la caída por debajo de 40, el paciente ya estaría en la parte que cae en picado.' },
            { t: 'Poco, hasta ≈89 %: está en la parte plana de la curva', ok: true }],
        explicacion: 'La PaO₂ normal está en la <span class="hl">parte plana</span>: puede caer hasta 60 con poco cambio de saturación. La venosa (≈40) está en la empinada, lo que facilita la captación de O₂ en el pulmón. <span class="cpv-org cpv-ilu">89 %: curva de fisiología general ajustada a la ficha</span>' },
    { id: 'co-g3', serie: 'guia', corto: 'anemia o hipoxemia', tipo: 'test', fuente: 'mar-transporte-o2#mar-anemia-hipoxemia (Fig. 9.2)', estado: {}, mirar: 'cao2',
        tocar: { mandos: ['estado|anemia|Hb a la mitad (7,5)', 'estado|hipoxemia|PaO₂ a la mitad (45)'], ocultar: ['cao2', 'sao2', 'spo2'], instruccion: 'pon los dos estados, uno tras otro.', comprobar: (e, vistos) => vistos.has('anemia') && vistos.has('hipoxemia'), visitar: ['anemia', 'hipoxemia'],
            pista: 'Pulsa los dos botones: «Hb a la mitad» y «PaO₂ a la mitad».', bueno: { hb: 7.5 }, confirma: () => 'con la Hb a la mitad, CaO₂ 10 mL/dL (−50 %); con la PaO₂ a la mitad, 16 (−20 %). Lo ves en la Fig. 9.2 viva.' },
        enunciado: 'A un paciente le baja la Hb a la mitad (15 → 7,5); a otro, la PaO₂ a la mitad (90 → 45). ¿A cuál le cae más el contenido arterial de O₂?',
        opciones: [
            { t: 'Al anémico: pierde la mitad; el hipoxémico, un 20 %', ok: true },
            { t: 'Al hipoxémico: la PaO₂ es la que empuja el O₂ a la sangre', ok: false, porque: 'Con PaO₂ 45 la Hb aún va saturada al 78 %. Si lo creyeras, corregirías la PaO₂ y dejarías al anémico sin transfundir, con la mitad del O₂ en la sangre.' },
            { t: 'Igual: los dos pierden la mitad del CaO₂', ok: false, porque: 'La curva en S protege la saturación; la Hb no tiene esa defensa. Sobrestimarías la gravedad de la hipoxemia y te quedarías corto con la anemia.' }],
        explicacion: 'Fig. 9.2: Hb a la mitad → CaO₂ <span class="hl-rojo">de 20 a 10</span>; PaO₂ a la mitad (SaO₂ 98 → 78 %) → <span class="hl">de 20 a 16</span>. <span class="hl-rojo">La anemia pesa mucho más</span> que la hipoxemia en el O₂ arterial.' },
    { id: 'co-g4', serie: 'guia', corto: 'devolver el aporte', tipo: 'destapa', fuente: 'mar-transporte-o2#mar-do2 · #mar-o2-disuelto · #mar-tabla-9-2', estado: { hb: 7.5 }, mirar: 'do2',
        tocar: { mandos: ['hb', 'gc'], ocultar: ['do2', 'vo2', 'o2er', 'ven'], instruccion: 'devuélvele el aporte a ≈985 con el mando que quieras y pulsa «Comprobar».', comprobar: e => derivar(e).R.do2 >= 950,
            pista: 'Con el gasto no llegas: en el modelo se queda en 8 L/min. Sube la Hb.', bueno: { hb: 15 },
            confirma: R => `DO₂ ${mil(R.do2)} mL/min. Con el gasto al máximo del modelo (8 L/min) y la Hb en 7,5 te quedarías en ${mil(derivar(estadoDe({ hb: 7.5, gc: 8 })).R.do2)}.` },
        enunciado: 'Con Hb 7,5 y gasto 5, el aporte de O₂ se ha quedado en ≈490 mL/min. ¿Con qué palanca lo devolverías a ≈985, cuánto tendría que cambiar y cuál no te sirve?',
        puntos: ['La <span class="hl">Hb</span>: el aporte es proporcional a ella; de 7,5 a 15 vuelve a ≈985.', 'El <span class="hl">gasto</span>: tendría que <span class="hl-rojo">doblarse</span> (de 5 a 10 L/min), porque también multiplica.', 'La <span class="hl">PaO₂</span> no sirve: la SaO₂ ya es del 98 % y el disuelto no entra en la fórmula del aporte (es el 1,5 %).'],
        explicacion: 'DO₂ = GC × 1,34 × Hb × SaO₂ × 10: tres medidas que se multiplican, y doblar una dobla el aporte. La SaO₂ ya está cerca de 1. Tabla 9.2: <span class="hl">900-1.100 mL/min</span>.' },
    { id: 'co-g5', serie: 'guia', corto: 'el consumo', tipo: 'test', fuente: 'mar-transporte-o2#mar-vo2 · #mar-tabla-9-3 · mar-extraccion-lactato#mar-scvo2-9', estado: {}, mirar: 'ven',
        enunciado: 'Y para el consumo (VO₂, por el «Fick inverso»), ¿qué cuarta medida necesitas además de las tres del aporte?',
        opciones: [
            { t: 'La SvO₂ mixta (catéter de arteria pulmonar)', ok: true },
            { t: 'La PaO₂, para sumar el O₂ disuelto', ok: false, porque: 'El disuelto es el 1,5 %: se omite. Sin la saturación venosa no sabrías cuánto O₂ se quedó en el tejido, ni si el paciente consume lo que necesita.' },
            { t: 'La ScvO₂ del CVC: vale lo mismo que la mixta', ok: false, porque: 'En el crítico la ScvO₂ sale de media un 7 % más alta (hasta un 18 % en el shock): calcularías menos extracción y menos consumo del real, y creerías que el tejido está mejor de lo que está.' }],
        explicacion: 'VO₂ = GC × 1,34 × Hb × (SaO₂ − SvO₂) × 10: <span class="hl">cuatro medidas</span>. El VO₂ calculado varía <span class="hl-rojo">±18 %</span> (Tabla 9.3): un cambio menor no es significativo; el medido por calorimetría, ±5 %.' },
    // ---- Examen, nivel MIR ----
    { id: 'co-e1', serie: 'examen', corto: 'SvO₂ 83 %', tipo: 'test', fuente: 'mar-extraccion-lactato#mar-sao2-svo2-guia · #mar-svo2-guia (Tabla 9.4)', estado: {}, despues: { gc: 6, util: 'sepsis' }, lupaDespues: 'mito',
        enunciado: 'Shock séptico con noradrenalina. SaO₂ 98 %, SvO₂ 83 % por el catéter de arteria pulmonar, lactato 4 mmol/L. Según la Tabla 9.4, ¿qué indica la SvO₂?',
        opciones: [
            { t: 'Buena perfusión: el tejido recibe más O₂ del que pide', ok: false, porque: 'Es la trampa: una SvO₂ &gt;80 % es defecto de utilización, no exceso de aporte. Darías por resuelta la reanimación con un lactato ≥4, el grupo con un 38 % de mortalidad (Fig. 9.4).' },
            { t: 'Defecto de utilización (&gt;80 %), casi siempre por sepsis', ok: true },
            { t: 'Aporte reducido pero compensado: extracción del 30-50 %', ok: false, porque: 'Eso sería una SvO₂ por debajo de 65 %. Subirías el gasto o transfundirías a un paciente al que no le falta aporte.' },
            { t: 'Oxigenación tisular amenazada: la extracción pasa del 50 %', ok: false, porque: 'Es el extremo opuesto (SvO₂ ≤50 %). Lo tratarías como falta de aporte cuando la mitocondria no usa el O₂ que le llega: aquí la extracción es del 15 %.' }],
        explicacion: 'Tabla 9.4: SaO₂ − SvO₂ <span class="hl-rojo">&lt;20 %</span> o SvO₂ <span class="hl-rojo">&gt;80 %</span> = defecto de utilización («cortocircuito periférico»), casi siempre por sepsis: la endotoxina y las citocinas inhiben la PDH. Válido solo con metabolismo normal y SaO₂ &gt;90 %.',
        nota: '<b>Nota de fidelidad.</b> La SvO₂ normal es 65-75 % en el cap. 9 y 70-75 % en el cap. 7 y la Tabla 8.1: las dos son de la fuente.' },
    { id: 'co-e2', serie: 'examen', corto: 'ScvO₂ en el shock', tipo: 'test', fuente: 'mar-extraccion-lactato#mar-scvo2-9 · mar-oximetria#mar-scvo2', estado: { gc: 3.6, toma: 'scvo2' }, mirar: 'ven',
        tocar: { mandos: ['toma'], ocultar: ['svo2ap'], instruccion: 'cambia la toma a la arteria pulmonar.', comprobar: e => e.toma === 'svo2', pista: 'Pulsa «A. pulmonar · SvO₂».', bueno: { toma: 'svo2' },
            confirma: R => `SvO₂ ${R.svo2} %, por debajo de 65 % (menos aporte), con la ScvO₂ en ${R.scvo2} %.` },
        enunciado: 'Shock cardiogénico con un CVC: ScvO₂ 70 %, «el objetivo recomendado». ¿Qué esperas en la arteria pulmonar (SvO₂ mixta)? Contesta y compruébalo.',
        opciones: [
            { t: 'Más baja: en el shock la ScvO₂ sale más alta, hasta un 18 %', ok: true },
            { t: 'Más alta: la ScvO₂ siempre es algo menor que la SvO₂', ok: false, porque: 'Eso pasa en el sano. En el shock el cerebro conserva su flujo y su sangre venosa sube la ScvO₂: creerías que la mixta está aún mejor y pararías la reanimación con un aporte insuficiente.' },
            { t: 'La misma, 70 %: en la cava superior ya se mezcla toda la sangre', ok: false, porque: 'La mixta es la de la arteria pulmonar, la de todos los retornos. Darías por cumplido un objetivo que en la mixta no se cumple (&lt;65 % = menos aporte).' }],
        explicacion: 'La ScvO₂ es menor que la SvO₂ en el sano, pero <span class="hl-rojo">mayor en el crítico: de media un 7 %, hasta un 18 % en el shock</span> (el cerebro conserva su flujo). Su normalidad no está bien definida; 70 % es uno de los objetivos recomendados. Valen más las tendencias (cambio &gt;5 %).',
        nota: 'El modelo suma el 7 % de media en el shock (GC &lt;4, sepsis o parada); la regla es ilustrativa.' },
    { id: 'co-e3', serie: 'examen', corto: 'CO y capnografía', tipo: 'error', fuente: 'mar-oximetria#mar-cooximetria · mar-capnografia#mar-capno-intubacion · #mar-capno-sedacion · #mar-tabla-7-1', estado: {},
        enunciado: 'Pase de guardia del R1, tras una noche movida.',
        frases: [
            { t: 'Al intoxicado por humo, con SpO₂ 99 %: en el CO el pulsioxímetro infraestima, así que la SaO₂ real será aún mayor.', mal: true, c: 'Al revés: con COHb la SaO₂ cae y la SpO₂ apenas cambia: <span class="hl-rojo">la SpO₂ sobrestima</span>. Hace falta gasometría arterial con cooximetría.' },
            { t: 'Le he pedido una gasometría arterial con cooximetría.', mal: false },
            { t: 'A la del box 3 la intubamos y confirmé el tubo con el CO₂ espirado: auscultar no siempre distingue el esófago.', mal: false },
            { t: 'En la sedación para la endoscopia, la PETCO₂ subió, pero la SpO₂ seguía en 96 %: no hipoventilaba.', mal: true, c: 'La PETCO₂ <span class="hl-rojo">sube antes de que baje la SpO₂</span>: es el aviso precoz de la hipoventilación. Por eso la capnografía es superior a la oximetría en la sedación.' },
            { t: 'Si el de la cama 7 hace una embolia pulmonar, espero que la PETCO₂ caiga por debajo de la PaCO₂.', mal: false }],
        explicacion: 'El CO engaña al pulsioxímetro (dos colores no ven la COHb) y el capnógrafo avisa antes que el oxímetro. La embolia aumenta el espacio muerto: PETCO₂ &lt; PaCO₂ (Tabla 7.1).' },
];

/* ============================================================
   Casos clínicos (el paciente se inventa; la medicina sale de la ficha). Las cifras del paciente son las que da
   el modelo en ese paso (lo comprueba pruebasCapilar()).
   ============================================================ */
export const B2_GIRO = { gc: 6, util: 'sepsis', consumo: 'fiebre', toma: 'scvo2' };
export const B3E = { gc: 6, util: 'sepsis', estres: true, toma: 'scvo2' };
export const CASOS = [
    { id: 'B2', titulo: 'Dos camas, una pregunta', corto: 'Caso 1 · dos camas', sub: 'anemia frente a hipoxemia',
        paciente: { 'Cama 1': 'Varón, 62 años: hemorragia digestiva', 'Cama 2': 'Mujer, 55 años: neumonía' },
        camas: [{ n: 'Cama 1', e: { hb: 7.5 } }, { n: 'Cama 2', e: { pao2: 45 } }],
        pasos: [
            { momento: 'Pase de guardia · 8:00', datos: { 'Cama 1 · datos': 'Hb 7,5 g/dL · SpO₂ 98 % (PaO₂ 90)', 'Cama 2 · datos': 'Hb 15 g/dL · PaO₂ 45 (SaO₂ 78 %)' }, nuevo: ['Cama 1 · datos', 'Cama 2 · datos'],
                estado: {}, mirar: 'cao2',
                pregunta: { id: 'b2-1', tipo: 'test', fuente: 'mar-transporte-o2#mar-anemia-hipoxemia (Fig. 9.2)',
                    tocar: { mandos: ['estado|anemia|Cama 1', 'estado|hipoxemia|Cama 2'], ocultar: ['cao2', 'do2'], instruccion: 'pon en el modelo cada cama.', comprobar: (e, vistos) => vistos.has('anemia') && vistos.has('hipoxemia'), visitar: ['anemia', 'hipoxemia'],
                        pista: 'Pulsa «Cama 1» y luego «Cama 2».', bueno: { hb: 7.5 }, confirma: () => 'cama 1, CaO₂ 10 mL/dL; cama 2, 16.' },
                    enunciado: 'El R2 te pregunta: «¿Cuál de las dos lleva menos O₂ en cada decilitro de sangre arterial?».',
                    opciones: [
                        { t: 'La cama 2: tiene la PaO₂ a la mitad de lo normal', ok: false, porque: 'Con PaO₂ 45 aún satura el 78 %: CaO₂ ≈16. Centrarías el esfuerzo en su O₂ y dejarías sin tratar la anemia de la cama 1.' },
                        { t: 'La cama 1: con la Hb a la mitad, el CaO₂ cae a la mitad', ok: true },
                        { t: 'Las dos igual: a cada una le falta la mitad de algo', ok: false, porque: 'La curva en S protege la saturación; la Hb no tiene esa defensa. Tratarías igual dos déficits que no se parecen.' }],
                    explicacion: 'Fig. 9.2: <span class="hl-rojo">la anemia pesa mucho más</span> que la hipoxemia en el O₂ arterial.' } },
            { momento: '8:15', datos: {}, nuevo: [], estado: { hb: 7.5 }, mirar: 'cao2', calculadora: { nombre: 'Contenido arterial de O₂', ir: 'mar-cao2-calc' },
                pregunta: { id: 'b2-2', tipo: 'destapa', fuente: 'mar-transporte-o2#mar-cao2-9 · #mar-anemia-hipoxemia',
                    enunciado: 'Calcula los dos CaO₂ con la Ec. 9.3 (o con la calculadora de la ficha): dos cifras y una conclusión.',
                    puntos: ['Cama 1: 1,34 × 7,5 × 0,98 + 0,003 × 90 = 9,8 + 0,27 ≈ <span class="hl-rojo">10 mL/dL</span>.', 'Cama 2: 1,34 × 15 × 0,78 + 0,003 × 45 = 15,7 + 0,14 ≈ <span class="hl">16 mL/dL</span>.', 'La anemia baja el contenido un <span class="hl-rojo">50 %</span>; la hipoxemia, un 20 %.'],
                    explicacion: 'Con la Hb a la mitad no hay curva que te proteja: cada hematíe que falta es O₂ que no llega.' } },
            { momento: '8:30', datos: { 'Gasto (las dos)': '5 L/min' }, nuevo: ['Gasto (las dos)'], estado: {}, mirar: 'do2',
                pregunta: { id: 'b2-3', tipo: 'test', fuente: 'mar-transporte-o2#mar-do2 · mar-extraccion-lactato#mar-extraccion-curva',
                    tocar: { mandos: ['hb'], ocultar: ['do2', 'vo2', 'o2er', 'ven', 'lact'], instruccion: 'pon la Hb de la cama 1 (7,5) y pulsa «Comprobar».', comprobar: e => e.hb <= 7.5, pista: 'Baja el deslizador de la Hb hasta 7,5.', bueno: { hb: 7.5 },
                        confirma: R => `DO₂ ${R.do2} mL/min; la extracción sube al ${R.dif} % y la SvO₂ baja a ${R.svo2} %.` },
                    enunciado: 'Con un gasto de 5 L/min, ¿cuánto O₂ llega cada minuto a los tejidos de la cama 1?',
                    opciones: [
                        { t: '≈ 985 mL/min: lo normal, porque el gasto no ha cambiado', ok: false, porque: 'Eso es con Hb 15. Con 7,5 el aporte cae a la mitad: no verías que ya está en el umbral de extracción.' },
                        { t: '≈ 49 mL/min: 5 × 1,34 × 7,5 × 0,98', ok: false, porque: 'Falta el ×10 (de mL/dL a mL/L): diez veces menos de lo real. Con 49 mL/min ningún paciente llegaría vivo al pase.' },
                        { t: '≈ 490 mL/min: la mitad de lo normal', ok: true }],
                    explicacion: 'DO₂ = 5 × 1,34 × 7,5 × 0,98 × 10 ≈ <span class="hl-rojo">492 mL/min</span>. Para seguir consumiendo 250, la extracción sube hasta el 50 %: el umbral de la Fig. 9.3.',
                    nota: 'Es con el gasto del caso, fijo en 5 L/min. Si el corazón compensa la anemia (sangre menos viscosa, más gasto), con Hb 7,5 la extracción se queda lejos del 50 %: el techo no llega hasta un Hto del 10 % (Hb ≈3). <span class="cpv-org">ficha · merino-anemia#mh-limite-compensacion · p. 6</span>' } },
            { momento: '10:00', camas: [{ n: 'Cama 1', e: { hb: 7.5, toma: 'scvo2' } }, { n: 'Cama 2', e: { pao2: 45, toma: 'scvo2' } }], datos: { 'ScvO₂ cama 1': '48 % (CVC)' }, nuevo: ['ScvO₂ cama 1'], estado: { hb: 7.5, toma: 'scvo2' }, lupa: 'dedo', mirar: 'ven', calculadora: { nombre: 'Oximetría dual', ir: 'mar-dual-calc' },
                pregunta: { id: 'b2-4', tipo: 'test', fuente: 'mar-oximetria#mar-dual · #mar-dual-tabla',
                    enunciado: 'A la cama 1 le ponen un CVC: ScvO₂ 48 %, con SpO₂ 98 %. ¿Qué te dice la oximetría dual?',
                    opciones: [
                        { t: 'SpO₂ − ScvO₂ = 50 %: amenaza; indicador válido para transfundir', ok: true },
                        { t: 'Entre 25 y 50 %: aporte reducido pero compensado; vigilar', ok: false, porque: '50 ya es el corte de amenaza: el metabolismo aerobio está al límite. Si esperas, la siguiente caída del gasto la vuelve dependiente del aporte (y sube el lactato).' },
                        { t: 'Nada: la ScvO₂ normal es menor que la SvO₂, así que 48 % es esperable', ok: false, porque: 'Es algo menor en el sano, no 25 puntos; y en el crítico suele ser mayor. Atribuirías a la toma una anemia que ya amenaza el metabolismo aerobio.' }],
                    explicacion: '(SpO₂ − SvO₂) ≈ extracción: VO₂ = DO₂ × (SpO₂ − SvO₂). <span class="hl-rojo">≥50 %: amenaza</span> para el metabolismo aerobio; ha resultado un indicador válido para transfundir hematíes en la anemia. Es con el gasto fijo de este paciente (5 L/min): si su corazón compensara la anemia, con Hb 7,5 la extracción no llegaría al 50 %.',
                    nota: 'En el modelo, la ScvO₂ se iguala a la SvO₂ fuera del shock (la ficha dice «algo menor», sin cifra).' } },
            { momento: 'Día 2 · el giro', camas: [{ n: 'Cama 1', e: { hb: 7.5, toma: 'scvo2' } }, { n: 'Cama 2', e: B2_GIRO }], datos: { 'Cama 2 · datos': 'Con O₂: PaO₂ 90 (SaO₂ 98 %) · fiebre · GC 6 L/min', 'ScvO₂ cama 2': '90 %', 'Lactato cama 2': '4 mmol/L' }, nuevo: ['Cama 2 · datos', 'ScvO₂ cama 2', 'Lactato cama 2'],
                estado: B2_GIRO, mirar: 'ven',
                pregunta: { id: 'b2-5', tipo: 'error', fuente: 'mar-transporte-o2#mar-anemia-hipoxemia · mar-respuesta-fluidos#mar-scvo2-pautas · mar-extraccion-lactato#mar-scvo2-9 · #mar-fig-9-4',
                    enunciado: 'La cama 2 hace una sepsis. Nota del R2 en su historia:',
                    frases: [
                        { t: 'Ayer estaba peor que la cama 1: con la PaO₂ a la mitad, el contenido baja a la mitad.', mal: true, c: 'La PaO₂ a la mitad baja el CaO₂ <span class="hl">un 20 %</span> (20 → 16); la Hb a la mitad, un 50 %.' },
                        { t: 'Hoy satura bien y la ScvO₂ es del 90 %: objetivo del 70 % cumplido, la perfusión es buena.', mal: true, c: 'Una ScvO₂ <span class="hl-rojo">&gt;80 % en el shock séptico</span> es, lo más probable, un defecto de utilización (cap. 11; en la SvO₂ mixta, la Tabla 9.4): el tejido no usa el O₂ que le llega. Con lactato 4, nada está resuelto.' },
                        { t: 'En el shock, la ScvO₂ puede superar a la SvO₂ hasta un 18 %.', mal: false },
                        { t: 'Un lactato inicial ≥4 se asocia a una mortalidad hospitalaria del 38 % (Fig. 9.4).', mal: false }],
                    explicacion: 'La cama 2 no mejora: le sobra O₂ en la sangre venosa porque la mitocondria no lo usa.' } },
            { momento: 'Día 2', camas: [{ n: 'Cama 1', e: { hb: 7.5, toma: 'scvo2' } }, { n: 'Cama 2', e: B2_GIRO }], datos: {}, nuevo: [], estado: B2_GIRO, lupa: 'mito', mirar: 'lact',
                pregunta: { id: 'b2-6', tipo: 'destapa', fuente: 'mar-extraccion-lactato (acordeón «Sepsis») · #mar-tabla-9-5 · #mar-lactato-conclusion',
                    enunciado: 'La cama 2 tiene O₂ de sobra y aun así lactato 4. ¿De dónde sale? Míralo en la lupa.',
                    puntos: ['La <span class="hl-azul">PDH inhibida</span> por productos bacterianos (endotoxina) y citocinas: el piruvato no entra en la mitocondria y se desvía a lactato.', 'La <span class="hl-azul">glucólisis acelerada</span> por las catecolaminas.'],
                    explicacion: 'Es lactato aerobio (Tabla 9.5). Una revisión que cita el libro (ref. 44, p. 82) dice que la hipoxia es «con mucho la excepción y no la regla».' } },
        ],
        lleva: ['La anemia baja el CaO₂ mucho más que la hipoxemia: la mitad frente a un 20 % (Fig. 9.2).',
            'SpO₂ − SvO₂ ≥50 %: amenaza para el metabolismo aerobio y un indicador válido para transfundir en la anemia.',
            'Una saturación venosa &gt;80 % en la sepsis es defecto de utilización, no buena perfusión.'],
        volver: { nombre: 'El oxígeno en la sangre y su transporte', ficha: 'mar-transporte-o2', estado: 'anemia' } },

    { id: 'B3', titulo: 'Shock séptico: la ScvO₂ alta que no tranquiliza', corto: 'Caso 2 · shock séptico', sub: 'neumonía, noradrenalina, propofol',
        paciente: { Edad: '58 años', Peso: '80 kg', Motivo: 'Neumonía grave, shock séptico' },
        pasos: [
            { momento: 'Ingreso en la UCI', datos: { Fármacos: 'noradrenalina · propofol', 'SaO₂': '98 %', 'ScvO₂': '90 %', Lactato: '5 mmol/L' }, nuevo: ['Fármacos', 'SaO₂', 'ScvO₂', 'Lactato'],
                estado: B3E, mirar: 'ven', ocultar: ['pista'], calculadora: { nombre: '¿Qué dice esta saturación venosa?', ir: 'mar-extraccion-calc' },
                pregunta: { id: 'b3-1', tipo: 'test', fuente: 'mar-respuesta-fluidos#mar-scvo2-pautas (cap. 11) · mar-extraccion-lactato#mar-sao2-svo2-guia · #mar-scvo2-9',
                    enunciado: 'Con la ficha en la mano (cómo leer la ScvO₂, cap. 11, y la Tabla 9.4), ¿qué te dice esta saturación venosa?',
                    opciones: [
                        { t: 'Que la perfusión es buena: supera el objetivo de 70 %', ok: false, porque: 'Pararías la reanimación con un lactato de 5: el grupo de ≥4 tiene un 38 % de mortalidad (Fig. 9.4).' },
                        { t: 'Que la extracción está amenazada: hay que subir el aporte', ok: false, porque: 'Amenaza es una SvO₂ ≤50 %; aquí es al revés. Transfundir o subir el gasto no arregla una mitocondria que no usa el O₂.' },
                        { t: 'Que el tejido no usa el O₂: defecto de utilización', ok: true }],
                    explicacion: 'SvO₂ <span class="hl-rojo">&gt;80 %</span> (o SaO₂ − SvO₂ &lt;20 %): defecto de utilización, casi siempre sepsis. Para la ScvO₂, el cap. 11: <span class="hl-rojo">&gt;80 % en el shock séptico</span> es, lo más probable, un defecto de utilización, y el gap de PCO₂ ayuda a destapar la hipoperfusión. La ScvO₂ sale más alta que la mixta en el crítico (de media un 7 %) y en el shock (hasta un 18 %).' } },
            { momento: 'Hora 1', datos: { 'Gap de PCO₂': '3 mmHg' }, nuevo: ['Gap de PCO₂'], estado: B3E, mirar: 'gap', calculadora: { nombre: 'ScvO₂ + gap de PCO₂', ir: 'mar-perfusion-calc' },
                pregunta: { id: 'b3-2', tipo: 'test', fuente: 'mar-respuesta-fluidos#mar-gap-co2 · #mar-tabla-11-2 · #mar-gap-vs-scvo2',
                    enunciado: 'Pides el gap de PCO₂ (venoso central − arterial): 3 mmHg. ¿Qué concluyes?',
                    opciones: [
                        { t: 'No hay hipoperfusión, pero un gap normal no descarta oxigenación alterada', ok: true },
                        { t: 'Hay hipoperfusión: el gap de 3 se suma a la ScvO₂ alta', ok: false, porque: 'Normal es 2-5; hipoperfusión, &gt;6 (Tabla 11.2). Subirías la noradrenalina o los fluidos sin indicación.' },
                        { t: 'Perfusión y oxigenación correctas: ya puedes bajar el soporte', ok: false, porque: 'El gap no informa de la oxigenación tisular. Con un lactato de 5 por defecto de utilización, retirar el soporte sería prematuro.' }],
                    explicacion: 'Tabla 11.2: gap <span class="hl-verde">2-5 normal</span>, &gt;6 hipoperfusión. Es más específico de hipoperfusión y el shock séptico no lo altera; pero <span class="hl-rojo">no informa de la oxigenación tisular</span>: combinar los dos puede ser lo óptimo.',
                    nota: 'El gap del modelo es ilustrativo (∝ 1/GC).' } },
            { momento: 'Hora 2', datos: {}, nuevo: [], estado: B3E, lupa: 'mito', mirar: 'lact', calculadora: { nombre: '¿Por qué está alto el lactato?', ir: 'mar-lactato-calc' },
                pregunta: { id: 'b3-3', tipo: 'destapa', fuente: 'mar-extraccion-lactato#mar-tabla-9-5 · acordeones «Sepsis» y «Estrés fisiológico»',
                    enunciado: 'El lactato sigue en 5 con O₂ de sobra en la sangre venosa. Según la Tabla 9.5, ¿qué lo explica en este paciente?',
                    puntos: ['La <span class="hl-azul">sepsis</span>: la endotoxina y las citocinas inhiben la PDH.', 'Las <span class="hl-azul">catecolaminas</span> (la noradrenalina): aceleran la glucólisis.', 'El <span class="hl-azul">propofol</span>: está en la Tabla 9.5 de la hiperlactatemia aerobia.'],
                    explicacion: 'En la lupa, la X sobre la PDH y la flecha de las catecolaminas. Todo es lactato con O₂ (aerobio).' } },
            { momento: 'Hora 6', datos: {}, nuevo: [], estado: B3E, mirar: 'lact',
                pregunta: { id: 'b3-4', tipo: 'error', fuente: 'mar-extraccion-lactato#mar-sao2-svo2-guia · #mar-fig-9-4 · #mar-lactato-conclusion · mar-respuesta-fluidos#mar-gap-vs-scvo2',
                    enunciado: 'Plan que escribe el R1:',
                    frases: [
                        { t: 'ScvO₂ 90 %, por encima del 70 %: perfusión correcta; no reevaluamos el lactato.', mal: true, c: 'Una saturación venosa tan alta en la sepsis es <span class="hl-rojo">defecto de utilización</span>; y lo que pesa es cuánto tarda el lactato en normalizarse.' },
                        { t: 'Un lactato inicial ≥4 se asocia a una mortalidad hospitalaria del 38 %.', mal: false },
                        { t: 'Si se normaliza en menos de 24 h, la mortalidad es del 4 %; si tarda 48-96 h, del 43 %.', mal: false },
                        { t: 'Como el lactato alto prueba hipoxia celular, subimos la FiO₂ al 100 %.', mal: true, c: 'El lactato <span class="hl-rojo">no prueba hipoxia</span>: la revisión que cita el libro (ref. 44, p. 82) dice que por hipoxia es «con mucho la excepción y no la regla». Y la SaO₂ ya es del 98 %.' },
                        { t: 'El gap de PCO₂ es más específico de hipoperfusión que la ScvO₂ en el shock séptico.', mal: false }],
                    explicacion: 'Fig. 9.4: importa el lactato inicial y, sobre todo, lo que tarda en normalizarse.' } },
            { momento: 'Día 3 · el giro', datos: { Propofol: '5,5 mg/kg/h desde hace 60 h', Lactato: 'sigue en 5: no cede', CK: '4.800 U/L', Eco: 'FEVI baja, nueva' }, nuevo: ['Propofol', 'Lactato', 'CK', 'Eco'],
                estado: B3E, lupa: 'mito', mirar: 'lact', calculadora: { nombre: 'Propofol: dosis y riesgo', ir: 'mar-propofol-calc' },
                pregunta: { id: 'b3-5', tipo: 'test', fuente: 'mar-sedacion#mar-pris',
                    enunciado: '¿Qué te preocupa ahora?',
                    opciones: [
                        { t: 'Hipoxia tisular: el lactato no baja y hay que subir el aporte', ok: false, porque: 'La ScvO₂ sigue alta: le sobra O₂. Subir el aporte no toca la causa, y el cuadro sigue su curso.' },
                        { t: 'Síndrome de infusión de propofol: &gt;5 mg/kg/h durante &gt;48 h', ok: true },
                        { t: 'Nada nuevo: la hiperlactatemia es universal en la sepsis', ok: false, porque: 'Lo es, pero un lactato que no cede con rabdomiólisis y una FEVI nueva baja es el síndrome de infusión de propofol: mortalidad del 30-35 %.' }],
                    explicacion: '<span class="hl-rojo">Síndrome de infusión de propofol</span>: insuficiencia cardíaca sistólica brusca, acidosis láctica que no cede, rabdomiólisis, fracaso renal y fallo multiorgánico. Típico con &gt;80 µg/kg/min o &gt;5 mg/kg/h durante más de 48 h (descrito con 36 µg/kg/min). Incidencia del 3 %, mortalidad del 30-35 %; tratamiento de soporte (ECMO en algún caso).' } },
            { momento: 'Día 3', datos: {}, nuevo: [], estado: B3E, lupa: 'mito',
                pregunta: { id: 'b3-6', tipo: 'destapa', fuente: 'mar-extraccion-lactato (acordeón «Sepsis») · mar-sedacion#mar-pris',
                    enunciado: 'El adjunto te pregunta qué tienen en común la sepsis y el propofol en este paciente. Piensa en la mitocondria.',
                    puntos: ['La sepsis inhibe la <span class="hl-azul">PDH</span>: el piruvato no entra en la mitocondria (defecto de utilización, saturación venosa alta).', 'El propofol, quizá, inhibe la <span class="hl-azul">cadena de transporte de electrones</span> mitocondrial (síndrome de infusión).'],
                    explicacion: 'Los dos fallan dentro de la mitocondria: llega O₂, pero no se usa, y sale lactato.' } },
        ],
        lleva: ['Saturación venosa &gt;80 % en la sepsis: defecto de utilización, no buena perfusión (Tabla 9.4).',
            'El gap de PCO₂ ve la hipoperfusión, pero no la oxigenación tisular; un lactato alto no prueba hipoxia.',
            'Propofol &gt;5 mg/kg/h (&gt;80 µg/kg/min) más de 48 h y un lactato que no cede: síndrome de infusión.'],
        volver: { nombre: 'La extracción de O₂ y el lactato', ficha: 'mar-extraccion-lactato', estado: 'sepsis' } },

    { id: 'B1', titulo: 'La SpO₂ que mentía', corto: 'Caso 3 · humo', sub: 'incendio en casa, cefalea y confusión',
        paciente: { Edad: '45 años', Motivo: 'Rescatada de un incendio en casa', Clínica: 'cefalea y confusión' },
        pasos: [
            { momento: 'Urgencias · llegada', datos: { 'SpO₂': '98 % en aire', Hb: '15 g/dL' }, nuevo: ['SpO₂', 'Hb'], estado: { co: true }, lupa: 'dedo', mirar: 'spo2', ocultar: ['sao2', 'cao2', 'do2', 'vo2', 'o2er', 'ven', 'pista'],
                pregunta: { id: 'b1-1', tipo: 'test', fuente: 'mar-oximetria#mar-cooximetria · #mar-oxi-absorcion',
                    enunciado: 'El celador comenta: «Satura al 98 %, así que el humo no le ha hecho nada». ¿Está descartada la hipoxemia?',
                    opciones: [
                        { t: 'Sí: con SpO₂ 98 % la SaO₂ es normal', ok: false, porque: 'El pulsioxímetro no detecta la COHb: la SaO₂ real puede haber caído mucho con la SpO₂ intacta. La darías de alta con la Hb ocupada por CO.' },
                        { t: 'Sí, si el sensor va en la frente, donde la circulación no se contrae', ok: false, porque: 'La frente arregla la vasoconstricción del dedo, no la COHb: la ficha dice que los pulsioxímetros estándar no la detectan (hacen falta las longitudes de onda del cooxímetro) y no da al de frente por distinto. Seguirías sin ver el CO.' },
                        { t: 'No: el pulsioxímetro no ve la COHb y la sobrestima', ok: true }],
                    explicacion: 'Con dos longitudes de onda (660 y 940 nm) el pulsioxímetro solo distingue HbO₂ y Hb. <span class="hl-rojo">En la intoxicación por CO la SpO₂ sobrestima la SaO₂</span>: si se sospecha, gasometría arterial con cooximetría.' } },
            { momento: '20 min', datos: { 'Cooximetría': 'SaO₂ 74 % · COHb 25 %' }, nuevo: ['Cooximetría'], estado: { co: true }, lupa: 'dedo', mirar: 'sao2',
                pregunta: { id: 'b1-2', tipo: 'destapa', fuente: 'mar-oximetria#mar-cooximetria · #mar-oxi-absorcion',
                    enunciado: 'La residente de primer año no lo entiende: «¿Por qué el pulsioxímetro dice 98 % y la gasometría 74 %?». Explícaselo.',
                    puntos: ['El pulsioxímetro usa <span class="hl">dos longitudes de onda</span>: solo distingue la HbO₂ de la Hb; la COHb no la ve.', 'El <span class="hl-azul">cooxímetro</span> del laboratorio usa más longitudes de onda (hasta 8), con sangre arterial: mide la COHb y la SaO₂ real.', 'Normalmente la COHb y la metHb suman <span class="hl-verde">menos del 5 %</span>; aquí la COHb ocupa una cuarta parte de la Hb.'],
                    explicacion: 'Si la COHb o la metHb suben, <span class="hl-rojo">la SaO₂ cae pero la SpO₂ apenas cambia</span>. En el capilar, las perlas grises tachadas son los sitios ocupados por el CO.',
                    nota: 'La COHb del 25 % es la del paciente del caso (ilustrativa); la ficha no da una cifra.' } },
            { momento: '30 min', datos: {}, nuevo: [], estado: { co: true }, lupa: 'dedo', mirar: 'cao2', calculadora: { nombre: 'Contenido arterial de O₂', ir: 'mar-cao2-calc' },
                pregunta: { id: 'b1-3', tipo: 'test', fuente: 'mar-oximetria#mar-cao2 · mar-transporte-o2#mar-cao2-9',
                    tocar: { mandos: ['estado|co|Poner a la paciente (CO)'], ocultar: ['cao2', 'do2'], instruccion: 'pon a la paciente en el modelo y mira el CaO₂.', comprobar: (e, vistos) => vistos.has('co'), visitar: ['co'], pista: 'Pulsa «Poner a la paciente (CO)».', bueno: { co: true },
                        confirma: R => `CaO₂ ${dec(R.cao2, 1)} mL/dL, con la SpO₂ en ${R.spo2} %.` },
                    enunciado: 'Con Hb 15, PaO₂ 90 y SaO₂ 74 % (la de la cooximetría), ¿cuál es su contenido arterial de O₂? Contesta y compruébalo.',
                    opciones: [
                        { t: '≈ 15 mL/dL: la cuarta parte menos de lo normal', ok: true },
                        { t: '≈ 20 mL/dL: lo normal, porque la SpO₂ sigue en el 98 %', ok: false, porque: 'Con la SpO₂ calculas el O₂ que no tiene: la COHb no lleva O₂. Le atribuirías un contenido normal a una sangre con una cuarta parte de la Hb ocupada.' },
                        { t: '≈ 10 mL/dL: como con la Hb a la mitad', ok: false, porque: 'Sería con la mitad de la Hb sin O₂. Aquí falta la cuarta parte: sobrestimarías la caída y no entenderías por qué la SpO₂ no la ve.' }],
                    explicacion: 'CaO₂ = 1,34 × 15 × 0,74 + 0,003 × 90 ≈ <span class="hl-rojo">15 mL/dL</span> (normal ≈20). Se calcula con la <span class="hl">SaO₂ de la cooximetría</span>, no con la SpO₂.' } },
            { momento: '1 h', datos: { 'Nota del R1': 'en la historia' }, nuevo: ['Nota del R1'], estado: { co: true }, lupa: 'dedo', mirar: 'spo2',
                pregunta: { id: 'b1-4', tipo: 'error', fuente: 'mar-oximetria#mar-cooximetria · #mar-oxi-frente · #mar-oxi-exactitud',
                    enunciado: 'Nota del R1 de urgencias, antes de subirla:',
                    frases: [
                        { t: 'SpO₂ 98 % en aire: sin hipoxemia.', mal: true, c: 'Con COHb <span class="hl-rojo">la SpO₂ sobrestima</span>: la SaO₂ por cooximetría es del 74 %.' },
                        { t: 'Si dudo de la SpO₂, pongo el sensor en la frente.', mal: true, c: 'La frente sirve cuando el dedo falla por <span class="hl">hipotensión o vasoconstricción</span>. La COHb no la ven los pulsioxímetros estándar, y la ficha no dice que el de frente sea distinto: lo que sirve es la gasometría arterial con cooximetría.' },
                        { t: 'Pedida gasometría arterial con cooximetría.', mal: false },
                        { t: 'Normalmente la COHb y la metHb suman menos del 5 %.', mal: false }],
                    explicacion: 'La SpO₂ no informa del CO: la cooximetría sí.' } },
            { momento: 'Planta · al día siguiente', datos: { Motivo: 'otra paciente, con metahemoglobinemia' }, nuevo: ['Motivo'], estado: {}, lupa: 'dedo', mirar: 'spo2',
                pregunta: { id: 'b1-5', tipo: 'destapa', fuente: 'mar-oximetria#mar-cooximetria',
                    enunciado: 'Al día siguiente te llaman por otra paciente con metahemoglobinemia y SpO₂ «aceptable». ¿Qué esperas del pulsioxímetro y qué pides?',
                    puntos: ['La <span class="hl-azul">metHb</span> engaña igual que la COHb: el pulsioxímetro no la detecta.', 'La SaO₂ cae y la SpO₂ apenas cambia: <span class="hl-rojo">la sobrestima</span>.', 'Pides <span class="hl">gasometría arterial con cooximetría</span>.'],
                    explicacion: 'El modelo solo dibuja el CO; la metHb se comporta igual frente al pulsioxímetro (ficha).' } },
        ],
        lleva: ['El pulsioxímetro (dos longitudes de onda) no ve la COHb ni la metHb: en esas intoxicaciones la SpO₂ sobrestima la SaO₂.',
            'Si se sospechan, gasometría arterial con cooximetría (hasta 8 longitudes de onda); la frente no lo arregla.',
            'El CaO₂ se calcula con la SaO₂ de la cooximetría: con COHb del 25 %, ≈15 mL/dL aunque la SpO₂ diga 98 %.'],
        volver: { nombre: 'Oximetría: de la punta del dedo a la sangre venosa', ficha: 'mar-oximetria', estado: 'co' } },

    { id: 'B4', titulo: 'Sedación para una endoscopia', corto: 'Caso 4 · sedación', sub: 'obesa, apnea del sueño',
        paciente: { Edad: '52 años', Motivo: 'Sedación para una endoscopia', Antecedentes: 'obesidad · apnea del sueño' },
        pasos: [
            { momento: 'Endoscopia · minuto 10', datos: { 'PETCO₂': 'de 38 a 53 mmHg', 'SpO₂': '98 %' }, nuevo: ['PETCO₂', 'SpO₂'], estado: { sedacion: true }, lupa: 'boca', mirar: 'petco2',
                pregunta: { id: 'b4-1', tipo: 'test', fuente: 'mar-capnografia#mar-capno-sedacion · #mar-tabla-7-1',
                    enunciado: 'El endoscopista quiere seguir: «Satura perfectamente». ¿Qué te dice la PETCO₂?',
                    opciones: [
                        { t: 'Más espacio muerto: alvéolos que ventilan pero no reciben sangre', ok: false, porque: 'El espacio muerto baja la PETCO₂ por debajo de la PaCO₂ (Tabla 7.1), no la sube. Buscarías una embolia y dejarías hipoventilar a la paciente.' },
                        { t: 'Nada, mientras la SpO₂ siga por encima de 94 %', ok: false, porque: 'La SpO₂ es el aviso tardío: cuando caiga, la hipoventilación ya será grave. Seguirías sedando a ciegas.' },
                        { t: 'Hipoventila: la PETCO₂ sube antes de que baje la SpO₂', ok: true }],
                    explicacion: 'La sedación puede causar hipoventilación. <span class="hl-rojo">La PETCO₂ sube antes de que baje la SpO₂</span>: la capnografía es superior a la oximetría para detectarla.',
                    nota: 'Las cifras de PETCO₂ del modelo son ilustrativas (la ficha da solo el sentido).' } },
            { momento: 'Minuto 12', datos: {}, nuevo: [], estado: { sedacion: true }, lupa: 'boca', mirar: 'petco2',
                pregunta: { id: 'b4-2', tipo: 'destapa', fuente: 'mar-capnografia#mar-capno-sedacion',
                    enunciado: 'El endoscopista te pregunta por qué a esta paciente le pones capnografía y a otros no. ¿Qué le contestas?',
                    puntos: ['La hipoventilación con sedación es más probable en <span class="hl">ancianos, obesos, apnea del sueño o retención crónica de CO₂</span>: ella tiene dos.', 'La PETCO₂ avisa <span class="hl-rojo">antes</span> que la SpO₂.', 'Y se recomienda <span class="hl-azul">siempre</span> que se seda para un procedimiento, no solo en ella.'],
                    explicacion: 'Es una recomendación general, no un extra para los de riesgo.' } },
            { momento: 'Minuto 15 · se intuba', datos: { Tubo: 'intubada', Capnograma: 'plano' }, nuevo: ['Tubo', 'Capnograma'], estado: { esofago: true }, lupa: 'boca', mirar: 'petco2', ocultar: ['pista'],
                pregunta: { id: 'b4-3', tipo: 'test', fuente: 'mar-capnografia#mar-capno-intubacion',
                    enunciado: 'Se intuba y el capnograma sale plano. Al auscultar, «se oye bien». ¿Qué piensas primero?',
                    opciones: [
                        { t: 'Fallo del sensor: auscultando se oye bien en los dos campos', ok: false, porque: 'Auscultar no siempre distingue la intubación esofágica. Dejarías el tubo en el esófago: puede ser mortal.' },
                        { t: 'Tubo en el esófago, hasta demostrar lo contrario', ok: true },
                        { t: 'Broncoespasmo grave: el aire no sale', ok: false, porque: 'Se ha propuesto, pero sin buena confirmación. Tratarías un broncoespasmo y no mirarías dónde está el tubo.' }],
                    explicacion: 'Confirmar con CO₂ espirado es estándar: la intubación esofágica no reconocida se da en <span class="hl-rojo">1 de cada 18 intubaciones urgentes</span> del crítico, y auscultar no siempre la distingue.' } },
            { momento: 'Minuto 16 · el giro', datos: { Laringoscopia: 'tubo en la tráquea', Pulso: 'no se palpa: RCP' }, nuevo: ['Laringoscopia', 'Pulso'], estado: { rcp: true }, lupa: 'boca', mirar: 'petco2', ocultar: ['pista'],
                pregunta: { id: 'b4-4', tipo: 'error', fuente: 'mar-capnografia#mar-capno-intubacion · #mar-capno-rcp',
                    enunciado: 'El tubo está bien puesto, pero la paciente no tiene pulso. Nota del R1:',
                    frases: [
                        { t: 'El tubo está en la tráquea; si apenas sale CO₂, será un fallo del sensor.', mal: true, c: 'En la <span class="hl-rojo">parada</span> puede haber muy poco o ningún CO₂ con el tubo bien puesto: sin retorno venoso apenas llega CO₂ al alvéolo.' },
                        { t: 'Durante la RCP, la PETCO₂ también informa del pronóstico.', mal: false },
                        { t: 'Si tras 20 min de RCP la PETCO₂ sigue ≤10 mmHg, es improbable recuperar la circulación espontánea.', mal: false },
                        { t: 'El broncoespasmo grave se ha propuesto como causa de CO₂ nulo, sin buena confirmación.', mal: false }],
                    explicacion: 'Sin CO₂: esófago… o parada, sin retorno venoso. La PETCO₂ es valiosa como pronóstico en la RCP; el broncoespasmo grave queda como causa propuesta, sin buena confirmación.' } },
            { momento: 'Minuto 36 de RCP', datos: { 'PETCO₂': '8 mmHg tras 20 min' }, nuevo: ['PETCO₂'], estado: { rcp: true }, lupa: 'boca', mirar: 'petco2', ocultar: ['pista'],
                pregunta: { id: 'b4-5', tipo: 'test', fuente: 'mar-capnografia#mar-capno-rcp · #mar-capno-gasto',
                    enunciado: 'Tras 20 min de RCP, la PETCO₂ sigue en 8 mmHg. ¿Qué dice la fuente?',
                    opciones: [
                        { t: 'Que la RCP va bien: poco CO₂ espirado es buena ventilación', ok: false, porque: 'La PETCO₂ sigue al flujo: poco CO₂ es poco gasto que lleve CO₂ al pulmón. Leerías un mal pronóstico como un buen signo.' },
                        { t: 'Nada: la PETCO₂ solo sirve para confirmar el tubo', ok: false, porque: 'Sirve también en la RCP: ≤10 mmHg tras 20 min es un dato de pronóstico. Te perderías la información que da.' },
                        { t: 'Que es improbable recuperar la circulación espontánea', ok: true }],
                    explicacion: '<span class="hl-rojo">PETCO₂ ≤10 mmHg tras 20 min de RCP</span>: es improbable recuperar la circulación espontánea. Los cambios de PETCO₂ siguen a los del gasto (r = 0,87, Fig. 7.8).',
                    nota: 'Los 8 mmHg son del paciente inventado; el umbral (≤10 mmHg tras 20 min de RCP) es de la ficha.' } },
        ],
        lleva: ['En la sedación, la PETCO₂ sube antes de que baje la SpO₂: capnografía siempre que se seda para un procedimiento.',
            'Capnograma plano tras intubar: esófago hasta que se demuestre lo contrario; auscultar no basta (1 de cada 18).',
            'Con el tubo bien puesto, sin CO₂ puede ser una parada; ≤10 mmHg tras 20 min de RCP: improbable recuperar la circulación.'],
        volver: { nombre: 'Capnografía: el CO₂ que se espira', ficha: 'mar-capnografia', estado: 'capno-rcp' } },
];

/* ============================================================
   Prueba de las cifras: las comprobables de cobertura §6.1 (±1 en la última cifra salvo donde se dice), los
   extremos de los mandos, la forma de la Mayéutica y las cifras de los casos.
   ============================================================ */
export function pruebasCapilar() {
    const r = { estados: [], extremos: null, mayeutica: null, casos: [], todoCoincide: true };
    const mira = (estado, campo, valor, espera, tol, nota = '') => {
        const ok = valor != null && Math.abs(valor - espera) <= tol + 1e-9;
        if (!ok) r.todoCoincide = false;
        r.estados.push({ estado, campo, valor, espera, tol, ok, nota });
    };
    const D = k => derivar(estadoDe(ESTADOS[k].p));
    let d = D('normal');
    mira('normal', 'SaO₂ %', d.R.sao2, 98, 1); mira('normal', 'SpO₂ %', d.R.spo2, 98, 1);
    mira('normal', 'O₂ unido mL/dL', +d.unido.toFixed(1), 19.7, 0.1); mira('normal', 'O₂ disuelto mL/dL', +d.disuelto.toFixed(2), 0.27, 0.01);
    mira('normal', 'CaO₂ mL/dL', Math.round(d.cao2), 20, 1); mira('normal', 'DO₂ mL/min', d.R.do2, 985, 1); mira('normal', 'DO₂ /m²', d.R.do2i, 580, 1);
    mira('normal', 'VO₂ mL/min', d.R.vo2, 250, 1); mira('normal', 'VO₂ /m²', d.R.vo2i, 147, 1); mira('normal', 'O₂ER', d.R.o2er, 0.25, 0.01);
    mira('normal', 'SvO₂ %', d.R.svo2, 73, 1); mira('normal', 'SaO₂ − SvO₂', d.R.dif, 25, 1); mira('normal', 'PaO₂ 60 → SaO₂ %', pct(satDe(60)), 89, 1, '«poco cambio» (mar-curva-forma)');
    d = D('anemia');
    mira('anemia', 'CaO₂ mL/dL', Math.round(d.cao2), 10, 1); mira('anemia', 'DO₂ mL/min', d.R.do2, 490, 3, 'el texto dice ≈490; sale 492');
    mira('anemia', 'O₂ER', d.R.o2er, 0.5, 0.01); mira('anemia', 'SvO₂ %', d.R.svo2, 49, 1);
    d = D('hipoxemia');
    mira('hipoxemia', 'SaO₂ %', d.R.sao2, 78, 1); mira('hipoxemia', 'CaO₂ mL/dL', Math.round(d.cao2), 16, 1);
    mira('hipoxemia', 'caída del CaO₂ %', Math.round((1 - d.cao2 / D('normal').cao2) * 100), 20, 1); mira('hipoxemia', 'SvO₂ %', d.R.svo2, 53, 1);
    d = D('bajo-gasto');
    mira('bajo-gasto', 'DO₂ mL/min', d.R.do2, 490, 3, '≈490'); mira('bajo-gasto', 'O₂ER', d.R.o2er, 0.5, 0.01); mira('bajo-gasto', 'SvO₂ %', d.R.svo2, 49, 1);
    mira('bajo-gasto', 'gap PCO₂ mmHg', d.R.gap, 8, 0);
    d = D('umbral');
    mira('umbral', 'SaO₂ %', d.R.sao2, 98, 0); mira('umbral', 'SaO₂ − SvO₂', d.R.dif, 50, 0); mira('umbral', 'SvO₂ %', d.R.svo2, 48, 0, 'la Fig. 9.3 imprime 50; con SaO₂ 98 la resta da 48');
    mira('umbral', 'VO₂ mL/min', d.R.vo2, 250, 1);
    d = D('dependiente');
    mira('dependiente', 'DO₂ mL/min', d.R.do2, 394, 1); mira('dependiente', 'VO₂ mL/min', d.R.vo2, 201, 1, 'Ec. 9.17 (SaO₂ ≈ 1) da 197; la Ec. 9.13, exacta, 201');
    mira('dependiente', 'VO₂ < 250', d.R.vo2 < 250 ? 1 : 0, 1, 0); mira('dependiente', 'lactato sube (>2)', d.R.lact > 2 ? 1 : 0, 1, 0);
    d = D('sepsis');
    mira('sepsis', 'SvO₂ %', d.R.svo2, 83, 1); mira('sepsis', 'SaO₂ − SvO₂', d.R.dif, 15, 1); mira('sepsis', 'lactato ≥4', d.R.lact >= 4 ? 1 : 0, 1, 0);
    mira('sepsis', 'Tabla 9.4', tabla94(d.R, estadoDe(ESTADOS.sepsis.p)).t === 'defecto de utilización' ? 1 : 0, 1, 0);
    mira('fiebre', 'Tabla 9.4 no válida (metabolismo alterado)', /no válida/.test(tabla94(derivar(estadoDe({ consumo: 'fiebre' })).R, { consumo: 'fiebre' }).t) ? 1 : 0, 1, 0);
    d = D('tiamina');
    mira('tiamina', 'SvO₂ % (no se toca)', d.R.svo2, 73, 0); mira('tiamina', 'lactato ≥4', d.R.lact >= 4 ? 1 : 0, 1, 0);
    d = D('co');
    mira('co', 'SpO₂ %', d.R.spo2, 98, 1); mira('co', 'SaO₂ % (COHb 25 %, ilustrativo)', d.R.sao2, 74, 1); mira('co', 'CaO₂ mL/dL', Math.round(d.cao2), 15, 1);
    d = D('dedo-frio');
    mira('dedo-frio', 'SpO₂ sin onda (null)', d.R.spo2 === null ? 1 : 0, 1, 0);
    mira('dedo-frio', 'en la frente vuelve', derivar(estadoDe({ ...ESTADOS['dedo-frio'].p, sensor: 'frente' })).R.spo2, 98, 1);
    d = D('dual');
    mira('dual', 'SpO₂ − SvO₂', d.R.dual, 50, 0);
    mira('capno-normal', 'PETCO₂ ≤ PaCO₂', D('capno-normal').R.petco2 <= 40 ? 1 : 0, 1, 0);
    mira('capno-epoc', 'PETCO₂ < PaCO₂', D('capno-epoc').R.petco2 < D('capno-epoc').R.paco2 ? 1 : 0, 1, 0);
    mira('capno-sedacion', 'PETCO₂ sube', D('capno-sedacion').R.petco2 > D('capno-normal').R.petco2 ? 1 : 0, 1, 0);
    mira('capno-sedacion', 'SpO₂ aún normal', D('capno-sedacion').R.spo2, 98, 1);
    mira('capno-esofago', 'PETCO₂', D('capno-esofago').R.petco2, 0, 0);
    mira('capno-rcp', 'PETCO₂ ≤10', D('capno-rcp').R.petco2 <= 10 ? 1 : 0, 1, 0);
    // Cap. 12 (cobertura del bloque 2 §4.2; ±1 en la última cifra salvo donde se dice)
    mira('normal', 'gasto', D('normal').R.gc, 5, 0); mira('normal', 'compensa con Hb 15: gasto 5', derivar(estadoDe({ compensa: true })).R.gc, 5, 0);
    d = D('anemia');
    mira('anemia (gasto fijo)', 'gasto', d.R.gc, 5, 0); mira('anemia (gasto fijo)', 'SaO₂ − SvO₂', d.R.dif, 50, 1);
    d = D('anemia-compensada');
    mira('anemia-compensada', 'gasto (cobertura ~7,7)', d.R.gc, 7.6, 0.15); mira('anemia-compensada', 'extracción %', d.R.ext, 34, 1);
    mira('anemia-compensada', 'VO₂', d.R.vo2, 250, 1); mira('anemia-compensada', 'aporte mL/min (≈750)', d.R.do2, 746, 5);
    mira('anemia-compensada', 'viscosidad ×agua (Tabla 12.2, Hto 22,5)', d.R.visc, 2.3, 0.1);
    d = D('techo-anemia');
    mira('techo-anemia', 'extracción %', d.R.ext, 50, 0); mira('techo-anemia', 'gasto (cobertura ~12,5)', d.R.gc, 12.7, 0.1); mira('techo-anemia', 'VO₂', d.R.vo2, 250, 1);
    const bajo = derivar(estadoDe({ hb: 2, compensa: true }));
    mira('Hb 2 con compensa', 'VO₂ cae (<250)', bajo.R.vo2 < 250 ? 1 : 0, 1, 0); mira('Hb 2 con compensa', 'lactato sube (>2)', bajo.R.lact > 2 ? 1 : 0, 1, 0);
    d = D('umbral-7');
    mira('umbral-7', 'extracción %', d.R.ext, 34, 1); mira('umbral-7', 'extracción lejos del 50 (<40)', d.R.ext < 40 ? 1 : 0, 1, 0);
    mira('umbral-7', 'Hb 8: extracción %', derivar(estadoDe({ hb: 8, compensa: true })).R.ext, 33, 1);
    const pre = derivar(estadoDe(ESTADOS.transfusion.p)), post = derivar(estadoFinal('transfusion'));
    mira('transfusion', 'Hb +25 %', Math.round((ESTADOS.transfusion.transfundir / ESTADOS.transfusion.p.hb - 1) * 100), 25, 0);
    mira('transfusion', 'gasto quieto', post.R.gc - pre.R.gc, 0, 0);
    mira('transfusion', 'aporte +25 % con el gasto quieto (el libro: «similar»; en el dibujo, ≈+17 %)', Math.round((post.do2 / pre.do2 - 1) * 100), 25, 0);
    mira('transfusion', 'VO₂ igual', post.R.vo2 - pre.R.vo2, 0, 1); mira('transfusion', 'la extracción cae', post.R.ext < pre.R.ext ? 1 : 0, 1, 0);
    mira('transfusion', '1 CH: +1 g/dL', estadoDe({ hb: 6.4 }).hb + HB_POR_CH, 7.4, 0.01);
    d = D('anemia-hipovolemia');
    mira('anemia-hipovolemia', 'gasto', d.R.gc, 4, 0); mira('anemia-hipovolemia', 'aporte mL/min', d.R.do2, 394, 1);
    mira('anemia-hipovolemia', 'VO₂ < 250', d.R.vo2 < 250 ? 1 : 0, 1, 0); mira('anemia-hipovolemia', 'lactato > 2', d.R.lact > 2 ? 1 : 0, 1, 0);
    for (const k of ['trali', 'taco']) { mira(k, 'SaO₂ con PaO₂ 55 (<90)', D(k).R.sao2 < 90 ? 1 : 0, 1, 0); mira(k, 'SaO₂ ≥80 (paciente posible)', D(k).R.sao2 >= 80 ? 1 : 0, 1, 0); }
    for (const [k, a, b2] of [['tumbado', 41.8, 37.7], ['bolo', 42.9, 38.7]]) {
        mira('dilucion · ' + k, 'Hto (Fig. 12.1)', TUBOS[k][1], b2, 0); mira('dilucion · ' + k, 'caída del Hto (4,1 y 4,2)', +(TUBOS[k][0] - TUBOS[k][1]).toFixed(1), k === 'tumbado' ? 4.1 : 4.2, 0);
        mira('dilucion · ' + k, 'Hb ≈ Hto / 3', hbDeHto(b2), +(b2 / 3).toFixed(1), 0); mira('dilucion · ' + k, 'Hb antes ≈ Hto / 3', hbDeHto(a), +(a / 3).toFixed(1), 0);
    }
    // Cap. 17: `ros` no toca la fisiología (mismas cifras que el normal) y el O₂ de más con SaO₂ ≥90 % es siempre un paciente posible
    for (const k of ['neutrofilo', 'reperfusion']) {
        mira(k, 'SaO₂ igual que el normal', D(k).R.sao2, D('normal').R.sao2, 0); mira(k, 'DO₂ igual que el normal', D(k).R.do2, D('normal').R.do2, 0);
        const alto = derivar(estadoDe({ ...ESTADOS[k].p, pao2: 100 }));
        mira(k, 'PaO₂ 100: SaO₂ ≥90 (hay sello)', alto.R.sao2 >= 90 ? 1 : 0, 1, 0);
    }
    // La explicación guiada: 3-5 pasos por estado, cada paso con su cita (ficha, página y PDF)
    for (const k of Object.keys(ESTADOS)) {
        const g = GUIAS[k] || [];
        mira(k, 'pasos de la explicación (3-5)', g.length >= 3 && g.length <= 5 ? 1 : 0, 1, 0);
        mira(k, 'cada paso con su cita', g.every(p => [].concat(p.cita || []).length && [].concat(p.cita).every(c => c.ficha && c.pag && c.pdf)) ? 1 : 0, 1, 0);
        mira(k, 'fuentes del estado en lista', Array.isArray(ESTADOS[k].fuentes) && ESTADOS[k].fuentes.length ? 1 : 0, 1, 0);
    }
    // Paciente posible: cada mando en sus extremos y su punto medio (los demás normales).
    const ex = { svo2: [100, 0], do2: [1e9, 0], vo2Max: 0, sat40: null };
    for (const hb of [5, 11, 17]) for (const pao2 of [40, 70, 100]) for (const gc of [1.5, 4.75, 8]) {
        const unoSolo = [hb !== 11, pao2 !== 70, gc !== 4.75].filter(Boolean).length <= 1;
        if (!unoSolo) continue;
        const q = derivar(estadoDe({ hb, pao2, gc }));
        ex.svo2 = [Math.min(ex.svo2[0], q.R.svo2), Math.max(ex.svo2[1], q.R.svo2)];
        ex.do2 = [Math.min(ex.do2[0], q.R.do2), Math.max(ex.do2[1], q.R.do2)];
        ex.vo2Max = Math.max(ex.vo2Max, q.R.vo2);
    }
    ex.sat40 = pct(satDe(40)); ex.sepsisMax = derivar(estadoDe({ hb: 17, pao2: 100, gc: 8, util: 'sepsis' })).R.svo2;
    // Los mandos del cap. 12, uno a uno (los demás en su punto medio): la Hb de 2 a 17 con el corazón que compensa (de
    // 5 sin volumen, con gasto 4), el gasto de 1,5 a 5 con la volemia baja y la transfusión desde cada Hb (gasto quieto).
    ex.gcMax = 0; ex.svo2b = [100, 0]; ex.do2b = [1e9, 0];
    const caso = q => { ex.gcMax = Math.max(ex.gcMax, q.R.gc); ex.svo2b = [Math.min(ex.svo2b[0], q.R.svo2), Math.max(ex.svo2b[1], q.R.svo2)]; ex.do2b = [Math.min(ex.do2b[0], q.R.do2), Math.max(ex.do2b[1], q.R.do2)]; };
    for (let hb = 2; hb <= 17; hb += 0.5) {
        caso(derivar(estadoDe({ hb, compensa: true })));
        if (hb >= 5) caso(derivar(estadoDe({ hb, compensa: true, volemia: 'baja', gc: 4 })));
        if (hb === 11) for (const gc of [1.5, 3.25, 5]) caso(derivar(estadoDe({ hb, compensa: true, volemia: 'baja', gc })));   // el gasto, solo
        if (hb <= 16) { const e0 = estadoDe({ hb, compensa: true }); caso(derivar(Object.assign(e0, { hb: Math.min(17, hb + HB_POR_CH), gcFijo: gastoDe(e0) }))); }
    }
    ex.ok = ex.svo2[0] >= 20 && ex.svo2[1] <= 90 && ex.do2[0] >= 190 && ex.do2[1] <= 1900 && ex.vo2Max <= 250 && ex.sepsisMax <= 90 && ex.sat40 < 80
        && ex.gcMax <= 13 && ex.svo2b[0] >= 20 && ex.svo2b[1] <= 85 && ex.do2b[0] >= 190 && ex.do2b[1] <= 1900;
    if (!ex.ok) r.todoCoincide = false;
    r.extremos = ex;
    // Mayéutica: la buena, la más larga en ≤⅓ de los tests y en posición variada; 0-2 errores en «encuentra el error».
    const tests = [], errores = [];
    const ver = (q, donde) => {
        if (q.tipo === 'test') {
            const lens = q.opciones.map(o => o.t.replace(/&[a-z]+;/g, 'x').length), ic = q.opciones.findIndex(o => o.ok);
            tests.push({ id: q.id, donde, posicion: ic + 1, masLarga: lens[ic] === Math.max(...lens), unaBuena: q.opciones.filter(o => o.ok).length === 1, porques: q.opciones.every(o => o.ok || o.porque) });
        }
        if (q.tipo === 'error') errores.push({ id: q.id, n: q.frases.filter(f => f.mal).length });
    };
    PREGUNTAS.forEach(q => ver(q, 'recorrido'));
    CASOS.forEach(c => c.pasos.forEach(p => ver(p.pregunta, c.id)));
    const nLarga = tests.filter(t => t.masLarga).length, posiciones = [...new Set(tests.map(t => t.posicion))];
    r.mayeutica = { tests: tests.length, correctaMasLarga: nLarga, tercio: Math.floor(tests.length / 3), posiciones: tests.map(t => t.posicion).join(' '),
        errores, guia: PREGUNTAS.filter(q => q.serie === 'guia').length, examen: PREGUNTAS.filter(q => q.serie === 'examen').length,
        predice: PREGUNTAS.filter(q => q.tocar).length,
        ok: nLarga <= Math.floor(tests.length / 3) && posiciones.length >= 3 && errores.every(e => e.n <= 2) && tests.every(t => t.unaBuena && t.porques) };
    if (!r.mayeutica.ok) r.todoCoincide = false;
    // Los casos: lo que dice la ficha del paciente es lo que da el modelo en ese paso.
    const q = p => derivar(estadoDe(p)).R;
    for (const [caso, paso, campo, valor, espera] of [
        ['B2', 1, 'cama 1: CaO₂', Math.round(D('anemia').cao2), 10], ['B2', 1, 'cama 2: CaO₂', Math.round(D('hipoxemia').cao2), 16],
        ['B2', 3, 'cama 1: DO₂', D('anemia').R.do2, 492], ['B2', 4, 'cama 1: ScvO₂', q({ hb: 7.5, toma: 'scvo2' }).ven, 48],
        ['B2', 4, 'cama 1: SpO₂ − ScvO₂', q({ hb: 7.5, toma: 'scvo2' }).dual, 50],
        ['B2', 5, 'cama 2: ScvO₂', q(B2_GIRO).ven, 90], ['B2', 5, 'cama 2: lactato', q(B2_GIRO).lact, 4],
        ['B3', 1, 'ScvO₂', q(B3E).ven, 90], ['B3', 1, 'lactato', q(B3E).lact, 5],
        ['B3', 2, 'gap PCO₂', q(B3E).gap, 3],
        ['B1', 1, 'SpO₂', q({ co: true }).spo2, 98], ['B1', 2, 'SaO₂', q({ co: true }).sao2, 74], ['B1', 3, 'CaO₂ (redondeado)', Math.round(q({ co: true }).cao2), 15],
        ['B4', 1, 'PETCO₂ basal', q({}).petco2, 38], ['B4', 1, 'PETCO₂ sedada', q({ sedacion: true }).petco2, 53], ['B4', 1, 'SpO₂ sedada', q({ sedacion: true }).spo2, 98],
        ['B4', 3, 'PETCO₂ esófago', q({ esofago: true }).petco2, 0]]) {
        const ok = valor === espera; if (!ok) r.todoCoincide = false;
        r.casos.push({ caso, paso, campo, valor, espera, ok });
    }
    return r;
}
