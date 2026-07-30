// Datos puros para el módulo "Síndromes Hematológicos Urgentes".
// Fuente CID: Iba T, Levy JH, Maier CL, et al. Updated definition and scoring
// of disseminated intravascular coagulation in 2025: communication from the
// ISTH SSC Subcommittee on Disseminated Intravascular Coagulation.
// J Thromb Haemost. 2025;23:2356-2362.

// Tabla 1 del artículo: puntuación de cada ítem, idéntica para Overt DIC 2021
// y Overt DIC 2025 salvo el corte de dímero-D (cualitativo en 2021,
// cuantitativo en 2025). La puntuación SIC es independiente.
export const cidOvertDicItems = {
    plaquetas: [
        { min: 0, max: 49.999, puntos: 2, label: '<50' },
        { min: 50, max: 99.999, puntos: 1, label: '≥50, <100' },
        { min: 100, max: Infinity, puntos: 0, label: '≥100' },
    ],
    dimeroD: [
        { value: 'normal', puntos: 0, label: 'Normal o aumento leve (≤×3 LSN)' },
        { value: 'moderado', puntos: 2, label: 'Aumento moderado (>×3 LSN)' },
        { value: 'fuerte', puntos: 3, label: 'Aumento fuerte (>×7 LSN)' },
    ],
    ptProlongado: [
        { min: 0, max: 2.999, puntos: 0, label: '<3 s' },
        { min: 3, max: 5.999, puntos: 1, label: '≥3 s, <6 s' },
        { min: 6, max: Infinity, puntos: 2, label: '≥6 s' },
    ],
    fibrinogeno: [
        { value: 'normal', puntos: 0, label: '≥100 mg/dL' },
        { value: 'bajo', puntos: 1, label: '<100 mg/dL' },
    ],
    corte: 5,
};

// Puntuación SIC (Sepsis-Induced Coagulopathy). El subscore de SOFA es la
// suma de los 4 componentes no hematológicos (respiratorio, cardiovascular,
// hepático, renal); 0 puntos si esa suma es 0, 1 punto si es 1, 2 puntos si
// es ≥2. Para el diagnóstico de SIC, además del total ≥4, la suma de los
// puntos de plaquetas + PT-INR debe ser >2.
export const cidSicItems = {
    plaquetas: [
        { min: 0, max: 99.999, puntos: 2, label: '<100' },
        { min: 100, max: 149.999, puntos: 1, label: '≥100, <150' },
        { min: 150, max: Infinity, puntos: 0, label: '≥150' },
    ],
    inr: [
        { min: 0, max: 1.2, puntos: 0, label: '≤1,2' },
        { min: 1.2001, max: 1.4, puntos: 1, label: '>1,2, ≤1,4' },
        { min: 1.4001, max: Infinity, puntos: 2, label: '>1,4' },
    ],
    corte: 4,
    corteHemostasia: 2, // plaquetas + INR deben sumar >2
};

// Tabla 2 del artículo: terminología relacionada con CID.
export const cidTerminologia = [
    {
        termino: 'CID franca (Overt DIC)',
        definicion: 'Forma grave y clínicamente evidente de alteración hemostática, caracterizada por activación generalizada de la coagulación y fibrinólisis desregulada, manifestada por fallo orgánico y/o tendencia hemorrágica. Los mecanismos reguladores están sobrepasados, con consumo de factores de coagulación y plaquetas, hemorragia y/o disfunción orgánica.',
        sinonimos: null,
    },
    {
        termino: 'CID en fase precoz (Early-phase DIC)',
        definicion: 'Fase inicial de la CID, que puede progresar a CID franca si no se trata. El estado de coagulación activada se detecta mediante biomarcadores de laboratorio, pero los hallazgos clínicos mayores (hemorragia, complicaciones trombóticas o disfunción orgánica) todavía no son evidentes porque los mecanismos compensadores se mantienen. El tratamiento anticoagulante puede ser eficaz en esta fase, aunque no está aún probado de forma definitiva.',
        sinonimos: 'CID no franca (nonovert), CID subclínica, CID compensada.',
    },
    {
        termino: 'Pre-CID',
        definicion: 'Fase más precoz de alteración de la coagulación. El paciente puede tener factores de riesgo para CID y las pruebas de laboratorio pueden mostrar alteraciones muy sutiles, pero la CID todavía no se ha desarrollado.',
        sinonimos: null,
    },
    {
        termino: 'Coagulopatía',
        definicion: 'Término general para una alteración leve a moderada en uno o más elementos de la coagulación. El fenotipo puede ser hemorrágico, trombótico o mixto. También se usa en términos específicos como SIC (sepsis-induced coagulopathy) o TIC (trauma-induced coagulopathy); en esos contextos "coagulopatía" equivale a CID en fase precoz.',
        sinonimos: null,
    },
];

// Recreación esquemática de la Figura 1: progresión desde CID en fase precoz
// (etiología-dependiente) hasta CID franca, con el balance predominante entre
// fenotipo trombótico y hemorrágico según la causa de base.
export const cidEtiologias = [
    { sigla: 'SIC', nombre: 'Sepsis', trombotico: 70, hemorragico: 30 },
    { sigla: 'HIC', nombre: 'Golpe de calor (heatstroke)', trombotico: 55, hemorragico: 45 },
    { sigla: 'OIC', nombre: 'Complicaciones obstétricas', trombotico: 35, hemorragico: 65 },
    { sigla: 'TIC', nombre: 'Traumatismo', trombotico: 40, hemorragico: 60 },
    { sigla: 'CIC', nombre: 'Cáncer', trombotico: 60, hemorragico: 40 },
];

// Recreación esquemática de la Figura 2: tratamiento por fenotipo, con
// intervenciones propias de fase precoz vs. fase tardía en cada uno.
export const cidTratamientoFenotipo = {
    trombotica: {
        titulo: 'CID Trombótica',
        precoz: ['Heparina', 'Antitrombina', 'Trombomodulina recombinante'],
        tardia: ['Plasma fresco congelado', 'Fibrinógeno', 'Plaquetas'],
    },
    hemorragica: {
        titulo: 'CID Hemorrágica',
        precoz: ['Ácido tranexámico (antifibrinolítico)'],
        tardia: ['Plasma fresco congelado', 'Fibrinógeno', 'Plaquetas'],
    },
    nota: 'El tratamiento de la enfermedad de base es esencial y obligatorio en ambos fenotipos. La anticoagulación (heparina, antitrombina, trombomodulina) se dirige a la CID trombótica; el ácido tranexámico se reserva para la CID hemorrágica. En ambos fenotipos, la reposición con plasma fresco congelado, fibrinógeno y plaquetas se recomienda en la fase tardía descompensada.',
};
