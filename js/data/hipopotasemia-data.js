// Hipopotasemia (Nefrología → Fisiología, ficha 11). Datos puros, sin DOM.
//
// Fuente de la simulación de la vista Visual
// (js/modules/nefrologia/hipopotasemia-sim.js). Fuente clínica: de Sequera
// Ortíz P, Alcázar Arroyo R, Albalate Ramón M. Trastornos del potasio.
// Nefrología al día (SEN), 2024 — la misma ficha de la vista Texto.

import { farmacosHiperpotasemia, tratamientoHiperpotasemia } from './hiperpotasemia-data.js';

// Causas = punto de partida. `k` = K⁺ plasmático real al empezar; el déficit
// corporal inicial se deduce de él (ver magnitudes). `perdidas` = mEq/h que
// se siguen perdiendo por cada vía; `desplazado`/`salido` = mEq/l metidos en
// la célula o sacados de ella; `ataque` = minutos en que empieza y acaba de
// resolverse la redistribución; `pseudo` = mEq/l que la muestra marca de
// menos. Todas esas cantidades son ILUSTRATIVAS (la ficha no las da). Las
// pistas (`orina`, `gaso`, `ta`) sí salen de la ficha; null = la ficha no lo
// dice para esa causa. `fuente` = id de la línea de la ficha.
export const causasHipopotasemia = {
    diarrea: {
        etiqueta: 'Diarrea (pérdida extrarrenal)', k: 2.8, perdidas: { heces: 8 }, fuente: 'hp-causa-extrarrenal',
        orina: 'baja', gaso: 'acidosis metabólica', ta: null,
        texto: 'El K⁺ se va por el intestino. El riñón lo maneja bien: K⁺ en orina bajo.',
    },
    vomitos: {
        etiqueta: 'Vómitos', k: 2.9, perdidas: { orina: 6, heces: 0.5 }, fuente: 'hp-dx-gaso', extra: 'hp-causa-renal',
        orina: 'alta', gaso: 'alcalosis metabólica', ta: 'normal',
        texto: 'El jugo gástrico solo tiene 5-10 mEq/l de K⁺: la mayor parte se pierde por la orina, por la hipovolemia y el hiperaldosteronismo secundario.',
    },
    hiperaldo: {
        etiqueta: 'Hiperaldosteronismo 1º', k: 3.0, perdidas: { orina: 6 }, ahorrador: 'todos', fuente: 'hp-causa-hta',
        orina: 'alta', gaso: null, ta: 'HTA, renina baja',
        texto: 'Hiperactividad mineralocorticoide: el riñón pierde K⁺. HTA con renina baja.',
    },
    liddle: {
        etiqueta: 'Síndrome de Liddle', k: 3.0, perdidas: { orina: 6 }, ahorrador: 'enac', fuente: 'hp-liddle',
        orina: 'alta', gaso: null, ta: 'HTA, aldosterona suprimida',
        texto: 'Canal ENaC del colector activado de forma permanente. No responde a espironolactona; sí a triamtereno, que bloquea ENaC directamente.',
    },
    magnesio: {
        etiqueta: 'Hipomagnesemia', k: 2.7, perdidas: { orina: 5 }, magnesio: true, fuente: 'hp-mg',
        orina: 'alta', gaso: null, ta: 'normal',
        texto: 'Presente en >40% de las hipopotasemias. Altera la reabsorción tubular de K⁺: la hipopotasemia es refractaria a las sales de potasio hasta corregir el magnesio.',
    },
    paralisis: {
        etiqueta: 'Parálisis periódica (redistribución)', k: 2.4, desplazado: 1.6, ataque: [360, 720], fuente: 'hp-paralisis', extra: 'hp-mecanismos',
        orina: 'baja', gaso: null, ta: null,
        texto: 'Paso masivo de K⁺ al interior celular, en ataques de 6-24 h. El K⁺ del plasma es bajo, pero el depósito corporal no está vacío.',
    },
    cad: {
        etiqueta: 'Cetoacidosis diabética', k: 5.0, salido: 2.5, cad: true, fuente: 'hp-mecanismos', extra: 'hp-causa-otros',
        orina: null, gaso: 'acidosis metabólica', ta: null,
        texto: 'K⁺ normal o alto con depleción corporal verdadera: sin insulina y con hiperglucemia grave, el K⁺ sale de la célula. Trátala con insulina y mira el K⁺.',
    },
    pseudo: {
        etiqueta: 'Pseudohipopotasemia', k: 4.0, pseudo: 1.5, fuente: 'hp-pseudo',
        orina: null, gaso: null, ta: null,
        texto: 'Leucocitosis extrema (>100.000/mm³) o muestra procesada tarde a temperatura ambiente: los leucocitos captan K⁺ dentro del tubo.',
    },
};

// Acciones de la lista. `ini`/`fin` en minutos (fin null = sigue actuando).
// Insulina y salbutamol toman sus tiempos y su magnitud de la tabla de
// tratamiento de la hiperpotasemia (misma ficha de origen). Los tiempos de
// la corrección del magnesio, los ahorradores y la absorción oral no los da
// la ficha: son ILUSTRATIVOS.
const deHiper = id => {
    const f = farmacosHiperpotasemia.find(x => x.id === id);
    const fila = tratamientoHiperpotasemia.find(t => t.id === id);
    return { ini: f.ini, fin: f.fin, magnitud: f.magnitud, tiempo: `Inicio/duración: ${fila.tiempo} (tabla de la ficha de hiperpotasemia)` };
};
export const accionesHipopotasemia = [
    { id: 'iv', grupo: 'repone', nombre: 'ClK i.v. (perfusión)', fuente: 'hp-precauciones', extra: 'hp-via-iv', tiempo: 'Concentración <50 mEq/l, ritmo <20 mEq/h, máximo 200 mEq/día, en solución no glucosada. Preferible vía central sin llegar a la aurícula.' },
    { id: 'oral', grupo: 'repone', nombre: 'ClK oral (Potasión®, 8 mEq/comprimido)', meq: 8, absorcion: [30, 90], repetible: true, fuente: 'hp-orales', tiempo: 'Un comprimido por toque. La absorción (30-90 min) es ilustrativa.' },
    { id: 'magnesio', grupo: 'frena', nombre: 'Corregir el magnesio', ini: [30, 90], fin: null, fuente: 'hp-mg', extra: 'hp-fig6', tiempo: 'Paso de la Figura 6. El tiempo hasta que actúa es ilustrativo.' },
    { id: 'espironolactona', grupo: 'frena', nombre: 'Espironolactona / eplerenona', ini: [60, 180], fin: null, bloquea: 'aldosterona', fuente: 'hp-orales', extra: 'hp-liddle', tiempo: 'Ahorrador de K⁺ para pérdidas renales persistentes. Tiempo ilustrativo.' },
    { id: 'triamtereno', grupo: 'frena', nombre: 'Triamtereno', ini: [60, 180], fin: null, bloquea: 'enac', fuente: 'hp-orales', extra: 'hp-liddle', tiempo: 'Ahorrador de K⁺ que bloquea ENaC directamente. Tiempo ilustrativo.' },
    { id: 'insulina', grupo: 'desplaza', nombre: 'Insulina', repetible: true, fuente: 'hp-causa-redistribucion', ...deHiper('insulina') },
    { id: 'salbutamol', grupo: 'desplaza', nombre: 'Salbutamol (β2-agonista)', repetible: true, fuente: 'hp-farmacos', ...deHiper('salbutamol') },
];

export const gruposHipopotasemia = {
    repone: { rotulo: 'Repone K⁺', color: 'var(--accent-green)' },
    frena: { rotulo: 'Frena la pérdida', color: 'var(--accent-purple)' },
    desplaza: { rotulo: 'Mete K⁺ en la célula (desencadenantes)', color: 'var(--accent-blue)' },
};

// Opciones de la perfusión i.v. Los límites salen de la ficha (<20 mEq/h,
// <50 mEq/l, 200 mEq/día).
export const perfusionHipopotasemia = {
    ritmos: [10, 20, 40], ritmoMax: 20,
    concentraciones: [{ v: 40, txt: '40 mEq/l (20 en 500 ml)' }, { v: 80, txt: '80 mEq/l (20 en 250 ml)' }], concMax: 50,
    maxDia: 200,
};

// Déficit corporal: la ficha da 200-400 mEq por cada 1 mEq/l que baja el K⁺,
// y >800-1.000 mEq con K⁺ <2. El modelo usa 300 mEq/(mEq/l) de 4 a 3 y 600
// por debajo de 3, que cumple las dos cifras (K⁺ 2 → 900 mEq). El resto es
// ILUSTRATIVO.
export const magnitudesHipopotasemia = {
    normal: 4,
    porMeqAlto: 300,      // mEq por mEq/l entre 4 y 3 (y por encima de 4)
    porMeqBajo: 600,      // mEq por mEq/l por debajo de 3
    excrecionExceso: 20,  // mEq/h que saca el riñón con el K⁺ por encima de 4,5
    fugaMagnesio: 0.6,    // fracción del K⁺ repuesto que se pierde por orina sin corregir el Mg
    ahorrador: 0.7,       // fracción de la pérdida renal que frena un ahorrador eficaz
    glucosado: 0.3,       // mEq/l que mete en la célula la insulina del suero glucosado
};
