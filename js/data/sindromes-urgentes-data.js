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

// Diagrama SVG original: fenotipos a nivel del vaso (microtrombosis vs.
// hemorragia), complementario al texto ya existente sobre los dos fenotipos.
export const cidSvgFenotipos = `
<svg viewBox="0 0 300 185" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <text x="75" y="14" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-blue);font-weight:bold;font-size:9px;">CID TROMBÓTICA</text>
  <line x1="15" y1="55" x2="135" y2="55" style="stroke:var(--text-muted)" stroke-width="2"/>
  <line x1="15" y1="105" x2="135" y2="105" style="stroke:var(--text-muted)" stroke-width="2"/>
  <circle cx="28" cy="70" r="5" style="fill:var(--accent-red);opacity:0.55"/>
  <circle cx="28" cy="90" r="5" style="fill:var(--accent-red);opacity:0.55"/>
  <circle cx="44" cy="80" r="5" style="fill:var(--accent-red);opacity:0.55"/>
  <g>
    <circle cx="100" cy="65" r="6" style="fill:var(--accent-blue)"/>
    <circle cx="112" cy="62" r="6" style="fill:var(--accent-blue)"/>
    <circle cx="122" cy="72" r="6" style="fill:var(--accent-blue)"/>
    <circle cx="100" cy="86" r="6" style="fill:var(--accent-blue)"/>
    <circle cx="113" cy="93" r="6" style="fill:var(--accent-blue)"/>
    <circle cx="123" cy="84" r="6" style="fill:var(--accent-blue)"/>
    <circle cx="108" cy="76" r="6" style="fill:var(--accent-blue)"/>
    <circle cx="106" cy="78" r="3" style="fill:var(--accent-yellow)"/>
    <circle cx="119" cy="78" r="3" style="fill:var(--accent-yellow)"/>
  </g>
  <rect x="125" y="55" width="10" height="50" style="fill:rgba(184,92,62,0.18)"/>
  <text x="75" y="140" text-anchor="middle" class="micro-svg-label">Trombo de fibrina y plaquetas</text>
  <text x="75" y="160" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-blue);font-weight:bold;">Isquemia → fallo orgánico</text>

  <line x1="150" y1="20" x2="150" y2="170" style="stroke:rgba(255,255,255,0.08)" stroke-width="1"/>

  <text x="225" y="14" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;font-size:9px;">CID HEMORRÁGICA</text>
  <line x1="165" y1="55" x2="207" y2="55" style="stroke:var(--text-muted)" stroke-width="2"/>
  <line x1="233" y1="55" x2="285" y2="55" style="stroke:var(--text-muted)" stroke-width="2"/>
  <line x1="165" y1="105" x2="285" y2="105" style="stroke:var(--text-muted)" stroke-width="2"/>
  <path d="M207 55 L215 40 L221 55" style="fill:none;stroke:var(--accent-red)" stroke-width="1.8"/>
  <path d="M221 55 L227 40 L233 55" style="fill:none;stroke:var(--accent-red)" stroke-width="1.8"/>
  <ellipse cx="220" cy="34" rx="26" ry="9" style="fill:rgba(184,92,62,0.22)"/>
  <circle cx="208" cy="32" r="3.5" style="fill:var(--accent-red)"/>
  <circle cx="221" cy="27" r="3.5" style="fill:var(--accent-red)"/>
  <circle cx="233" cy="33" r="3.5" style="fill:var(--accent-red)"/>
  <circle cx="188" cy="75" r="5" style="fill:var(--accent-red);opacity:0.3"/>
  <circle cx="258" cy="88" r="5" style="fill:var(--accent-red);opacity:0.3"/>
  <text x="225" y="140" text-anchor="middle" class="micro-svg-label">Rotura de la barrera hemostática</text>
  <text x="225" y="160" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);font-weight:bold;">Consumo de factores → hemorragia</text>
</svg>`;

// Diagrama SVG original: algoritmo diagnóstico ISTH como flujograma con
// rombos de decisión (Taylor et al. 2001 / BCSH 2009).
export const cidSvgAlgoritmo = `
<svg viewBox="0 0 300 335" class="micro-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="algArrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
      <path d="M0,0 L5,2.5 L0,5 Z" style="fill:var(--text-muted)"/>
    </marker>
  </defs>

  <rect x="55" y="8" width="190" height="32" rx="4" style="fill:rgba(212,175,55,0.08);stroke:var(--accent-blue)" stroke-width="1.5"/>
  <text x="150" y="21" text-anchor="middle" class="micro-svg-label">Trastorno subyacente conocido</text>
  <text x="150" y="33" text-anchor="middle" class="micro-svg-label">asociado a CID</text>
  <line x1="150" y1="40" x2="150" y2="58" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#algArrow)"/>

  <polygon points="150,60 200,90 150,120 100,90" style="fill:rgba(207,154,62,0.10);stroke:var(--accent-yellow)" stroke-width="1.5"/>
  <text x="150" y="86" text-anchor="middle" class="micro-svg-label">¿Trastorno</text>
  <text x="150" y="96" text-anchor="middle" class="micro-svg-label">confirmado?</text>

  <line x1="200" y1="90" x2="222" y2="90" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#algArrow)"/>
  <text x="212" y="83" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);">No</text>
  <rect x="222" y="74" width="72" height="32" rx="4" style="fill:rgba(184,92,62,0.10);stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="258" y="88" text-anchor="middle" class="micro-svg-label">No usar</text>
  <text x="258" y="99" text-anchor="middle" class="micro-svg-label">el algoritmo</text>

  <line x1="150" y1="120" x2="150" y2="138" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#algArrow)"/>
  <text x="160" y="133" class="micro-svg-label" style="fill:var(--accent-green);">Sí</text>

  <rect x="40" y="140" width="220" height="34" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="150" y="154" text-anchor="middle" class="micro-svg-label">Solicitar TP, plaquetas, fibrinógeno</text>
  <text x="150" y="166" text-anchor="middle" class="micro-svg-label">y marcador de fibrina (dímero-D/PDF)</text>
  <line x1="150" y1="174" x2="150" y2="192" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#algArrow)"/>

  <rect x="75" y="194" width="150" height="28" rx="4" style="fill:rgba(0,0,0,0.2);stroke:var(--text-muted)" stroke-width="1.5"/>
  <text x="150" y="212" text-anchor="middle" class="micro-svg-label">Puntuar y sumar (0-8)</text>
  <line x1="150" y1="222" x2="150" y2="240" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#algArrow)"/>

  <polygon points="150,242 205,272 150,302 95,272" style="fill:rgba(207,154,62,0.10);stroke:var(--accent-yellow)" stroke-width="1.5"/>
  <text x="150" y="268" text-anchor="middle" class="micro-svg-label">¿Puntuación</text>
  <text x="150" y="278" text-anchor="middle" class="micro-svg-label">≥5?</text>

  <line x1="95" y1="272" x2="70" y2="272" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#algArrow)"/>
  <text x="82" y="265" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-green);">No</text>
  <rect x="4" y="257" width="70" height="34" rx="4" style="fill:rgba(144,160,106,0.10);stroke:var(--accent-green)" stroke-width="1.5"/>
  <text x="39" y="270" text-anchor="middle" class="micro-svg-label">CID no franca</text>
  <text x="39" y="281" text-anchor="middle" class="micro-svg-label">(repetir en 1-2 d)</text>

  <line x1="205" y1="272" x2="230" y2="272" style="stroke:var(--text-muted)" stroke-width="1.5" marker-end="url(#algArrow)"/>
  <text x="219" y="265" text-anchor="middle" class="micro-svg-label" style="fill:var(--accent-red);">Sí</text>
  <rect x="230" y="257" width="66" height="34" rx="4" style="fill:rgba(184,92,62,0.12);stroke:var(--accent-red)" stroke-width="1.5"/>
  <text x="263" y="270" text-anchor="middle" class="micro-svg-label">CID franca</text>
  <text x="263" y="281" text-anchor="middle" class="micro-svg-label">(repetir a diario)</text>
</svg>`;

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
