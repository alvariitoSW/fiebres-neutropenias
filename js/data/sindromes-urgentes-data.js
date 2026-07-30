// Datos puros para el módulo "Síndromes Hematológicos Urgentes".
// Fuentes CID:
// - Iba T, Levy JH, Maier CL, et al. Updated definition and scoring of
//   disseminated intravascular coagulation in 2025: communication from the
//   ISTH SSC Subcommittee on Disseminated Intravascular Coagulation.
//   J Thromb Haemost. 2025;23:2356-2362.
// - Levi M, Toh CH, Thachil J, Watson HG. Guidelines for the diagnosis and
//   management of disseminated intravascular coagulation. Br J Haematol.
//   2009;145(1):24-33 (British Committee for Standards in Haematology, BCSH).

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

// Tabla I de la guía BCSH 2009: trastornos subyacentes asociados a CID.
export const cidCausas = [
    { categoria: 'Sepsis e infección grave', items: [] },
    { categoria: 'Traumatismo', items: [] },
    { categoria: 'Destrucción de órganos', items: ['Pancreatitis'] },
    { categoria: 'Neoplasia', items: ['Tumores sólidos', 'Leucemia'] },
    { categoria: 'Obstétricas', items: ['Embolia de líquido amniótico', 'Abruptio placentae', 'Preeclampsia'] },
    { categoria: 'Anomalías vasculares', items: ['Hemangiomas de gran tamaño', 'Aneurisma vascular'] },
    { categoria: 'Fallo hepático grave', items: [] },
    { categoria: 'Agresiones tóxicas e inmunológicas', items: ['Mordeduras de serpiente', 'Drogas recreativas', 'Incompatibilidad transfusional ABO', 'Rechazo de trasplante'] },
];

// Los 5 pasos del algoritmo diagnóstico ISTH (Taylor et al. 2001), recogido
// en la guía BCSH 2009.
export const cidAlgoritmoPasos = [
    { paso: '1', titulo: 'Evaluación de riesgo', detalle: '¿Tiene el paciente un trastorno subyacente conocido asociado a CID franca? Si no, no usar este algoritmo.' },
    { paso: '2', titulo: 'Pruebas globales', detalle: 'Solicitar TP, recuento de plaquetas, fibrinógeno y un marcador relacionado con la fibrina (dímero-D o PDF).' },
    { paso: '3', titulo: 'Puntuar resultados', detalle: 'Asignar puntos a cada ítem según la tabla de puntuación.' },
    { paso: '4', titulo: 'Calcular la puntuación', detalle: 'Sumar los puntos de los 4 ítems.' },
    { paso: '5', titulo: 'Interpretar', detalle: '≥5: compatible con CID franca (repetir puntuación a diario). <5: sugestivo de CID no franca (repetir en 1-2 días).' },
];

// Hallazgos de laboratorio (guía BCSH 2009): utilidad y limitaciones de cada
// prueba en el diagnóstico de CID.
export const cidHallazgosLaboratorio = [
    {
        titulo: 'Recuento plaquetario',
        texto: 'Una reducción o tendencia descendente en determinaciones sucesivas es un signo sensible (aunque poco específico) de CID: la trombocitopenia está presente hasta en el 98% de los casos, con cifras &lt;50×10⁹/L en el 50%. Una determinación aislada es poco útil, ya que el recuento inicial puede estar dentro del rango "normal" (150-400×10⁹/L); un descenso continuo, incluso dentro de rango normal, puede indicar generación activa de trombina. La trombocitopenia tampoco es específica de CID, ya que muchas enfermedades de base (leucemia aguda, sepsis) también la producen.',
    },
    {
        titulo: 'PDF y dímero-D',
        texto: 'Los productos de degradación de la fibrina (PDF) y el dímero-D reflejan la actividad fibrinolítica, pero los PDF no discriminan entre degradación de fibrina reticulada y de fibrinógeno, lo que limita su especificidad. El dímero-D es más específico pero tampoco es un test aislado válido: otras situaciones (traumatismo, cirugía reciente, tromboembolismo venoso) también lo elevan. No existe un punto de corte estandarizado y universalmente aceptado para definir un aumento "moderado" o "fuerte", por lo que su interpretación depende del criterio clínico, el ensayo usado y el contexto.',
    },
    {
        titulo: 'TP y TTPa',
        texto: 'Están prolongados en un 50-60% de los casos de CID en algún momento de la evolución, sobre todo por consumo de factores de coagulación (aunque la disfunción hepática, el déficit de vitamina K o las pérdidas hemáticas masivas también contribuyen). <strong>Dato clínicamente relevante: en casi la mitad de los pacientes con CID, el TP y el TTPa son normales o incluso más cortos de lo normal</strong>, por la presencia de factores activados circulantes (trombina, Xa) que aceleran la formación del coágulo — un TP/TTPa normal NO excluye CID y obliga a repetir la determinación. Debe monitorizarse el TP (en segundos), no el INR: el INR solo está validado para el control de la anticoagulación oral.',
    },
    {
        titulo: 'Fibrinógeno',
        texto: 'A pesar de ser una prueba muy solicitada, el fibrinógeno es poco útil en la mayoría de los casos: al ser un reactante de fase aguda, sus niveles pueden mantenerse en rango normal durante un tiempo prolongado pese al consumo activo. En una serie, la sensibilidad de un fibrinógeno bajo para el diagnóstico de CID fue solo del 28%, y la hipofibrinogenemia se detectó únicamente en los casos muy graves (fibrinógeno normal hasta en el 57% de los pacientes con CID). Las determinaciones seriadas son más útiles que un valor aislado. Se recomienda el método de Clauss para su medición.',
    },
    {
        titulo: 'Frotis de sangre periférica',
        texto: 'Los hematíes fragmentados (esquistocitos), aunque descritos en la CID, rara vez superan el 10% del total de hematíes. En casos de CID crónica con dímero-D elevado pero pruebas de coagulación básicas normales, la presencia de esquistocitos puede aportar evidencia confirmatoria adicional. Cuando aparecen en número elevado, deben plantearse otros diagnósticos de microangiopatía trombótica, como la PTT.',
    },
    {
        titulo: 'Perfiles hemostáticos globales',
        texto: 'La tromboelastografía (TEG) se ha usado para vincular alteraciones diagnósticas con disfunción hemostática, pero su sensibilidad/especificidad diagnóstica para CID no está bien establecida (la evidencia disponible se refiere más a la predicción de sangrado en cirugía cardiovascular). Un perfil de transmitancia óptica atípico en el TTPa (la llamada "onda bifásica") se ha asociado a CID de forma independiente de la prolongación de los tiempos de coagulación: en un estudio de 1187 ingresos consecutivos en UCI, el valor predictivo positivo aumentaba con el grado de anomalía de la onda, que con frecuencia precedía a la alteración de los parámetros convencionales — aunque su uso está limitado a analizadores óptico-fotométricos específicos.',
    },
];
