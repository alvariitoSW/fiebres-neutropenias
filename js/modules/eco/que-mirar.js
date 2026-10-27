// "Qué mirar en esta vista": líneas reales de otras fichas de la app, una sola fuente. index.js copia cada
// línea del DOM (todas las fichas están cargadas desde el arranque) y añade un botón que lleva a ella.
// Nunca se escribe aquí texto clínico propio: si la app no tiene nada de una vista, se dice.

const FATE = { especialidad: 'sobrevivirUmi', view: 'manualUmi', panel: 'panel-manual-umi-tabs', tab: 'umi-fate', ficha: 'Manual UMI · FATE' };
const MONITORIZACION = { especialidad: 'fisioUci', view: 'cardiologia', panel: 'panel-cardio-tabs', tab: 'cardio-monitorizacion-hemodinamica', ficha: 'Fisiopatología UCI · Cardiología · Ficha 5' };
const VEXUS = { especialidad: 'uciPapers', view: 'vexus', panel: 'panel-vexus-tabs', tab: 'vexus-fisiologia-doppler', ficha: 'UCI · Papers Tuiter · VExUS' };
const CORAZON_PULMON = { especialidad: 'fisioUci', view: 'cardiologia', panel: 'panel-cardio-tabs', tab: 'cardio-interaccion-corazon-pulmon', ficha: 'Fisiopatología UCI · Cardiología · Ficha 11' };

export const QUE_MIRAR = {
    a4c: [
        { fuente: '#umi-fate-a4c', ...FATE },
        { fuente: '#cardio-eco-vd', ...CORAZON_PULMON },
        { fuente: '#cardio-eco-simpson', ...MONITORIZACION },
        { fuente: '#cardio-eco-tapse', ...MONITORIZACION, pendiente: 'Mídelo aquí: «Modo M» → «TAPSE (A4C)».' },
    ],
    a2c: [
        { fuente: '#umi-fate-extendido', ...FATE },
        { fuente: '#cardio-eco-simpson', ...MONITORIZACION },
        { fuente: '#cardio-eco-17seg', ...MONITORIZACION },
    ],
    a3c: [
        { fuente: '#cardio-eco-17seg', ...MONITORIZACION },
    ],
    plax: [
        { fuente: '#umi-fate-plax', ...FATE },
        { fuente: '#umi-fate-dimensiones', ...FATE },
        { fuente: '#umi-fate-fs', ...FATE, pendiente: 'Mide los diámetros aquí («Modo M» → «Diámetros del VI (PLAX)») y llévalos a la calculadora de FS de esta ficha.' },
        { fuente: '#umi-fate-estimacion', ...FATE },
        { fuente: '#cardio-eco-teichholz', ...MONITORIZACION },
    ],
    psaxAo: [],
    psaxMv: [
        { fuente: '#umi-fate-extendido', ...FATE },
        { fuente: '#cardio-eco-17seg', ...MONITORIZACION },
    ],
    psaxPm: [
        { fuente: '#umi-fate-psax', ...FATE },
        { fuente: '#cardio-eco-17seg', ...MONITORIZACION },
    ],
    sc4c: [
        { fuente: '#umi-fate-subcostal', ...FATE },
    ],
    scVci: [
        { fuente: '#umi-fate-vci-pvc', ...FATE, pendiente: 'Mídelo aquí: «Modo M» → «VCI (subcostal)».' },
        { fuente: '#umi-fate-vci', ...FATE },
        { fuente: '#vexus-onda-hepatica', ...VEXUS, pendiente: 'Mírala aquí: «Doppler pulsado» → «Suprahepática (SC VCI)».' },
    ],
    sse: [],
};

// Escenarios del simulador frente al tipo de shock de la Tabla 14.1 de Merino (el que comprueban las pruebas).
export const ESCENARIO_TIPO = {
    normal: null,
    hemorragia: 'hipovolémico',
    fallo: 'cardiogénico',
    derrame: 'obstructivo (taponamiento)',
    vasoplejia: 'vasodilatador',
    hipertrofia: null, dilatada: null, tep: null, hpcronica: null,
};

// Formas de enfermedad: de qué trata cada una (la cotejan, cifra a cifra, los criterios de escenarios.mjs)
export const FORMA_NOTA = {
    hipertrofia: 'Hipertrofia concéntrica del VI por sobrecarga de presión (HTA): pared gruesa y ventrículo rígido que se llena mal — insuficiencia cardíaca con FE preservada. Forma grave: PCP ~24 mmHg, PAPs ~37 y FE del VD ~31 %, con fallo derecho (cifras del modelo, ilustrativas).',
    dilatada: 'Miocardiopatía dilatada: contractilidad baja, VI grande con pared normal o fina y FE reducida. Forma grave: PCP ~23 mmHg, PAPs ~38 y FE del VD ~34 %, con fallo derecho (cifras del modelo, ilustrativas).',
    tep: 'TEP de riesgo intermedio: la resistencia pulmonar sube de golpe y el VD se dilata, se vacía mal y aplana el tabique en diástole (cor pulmonale agudo), todavía sin hipotensión. Criterios de Lang 2015 del VD que cumple: VD basal >41 mm (p. 17), FAC <35 %, FE del VD <45 % y TAPSE <17 mm (p. 23); debajo, las cifras de este VD, medidas en vivo.',
    hpcronica: 'Hipertensión pulmonar crónica (cor pulmonale crónico): la resistencia pulmonar sube despacio y el VD se adapta. A diferencia del TEP agudo, su pared libre es gruesa en telediástole (>5 mm; Mukherjee 2025, p. 145), y esa pared hipertrófica sostiene presiones pulmonares altas. El tabique se aplana en telesístole (índice de excentricidad >1: sobrecarga de presión). Hacia la gravedad máxima el VD se dilata y falla (cifras del modelo, ilustrativas).',
};
