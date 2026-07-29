// Datos estructurados para el módulo CAR-T y complicaciones que llevan a UCI.
// Basado en protocolos internos del Servicio de Hematología y Hemoterapia (UTH)
// sobre indicaciones, infusión, síndrome de liberación de citoquinas (SLC/CRS)
// y neurotoxicidad (ICANS) asociados a terapia CAR-T.

export const productosCarT = [
    {
        nombre: 'Kymriah® (tisagenlecleucel)',
        indicacion: 'Leucemia linfoblástica aguda (LLA) de células B refractaria, en recaída postrasplante o en segunda o posterior recaída, en pacientes pediátricos y adultos jóvenes hasta 25 años. Linfoma B difuso de célula grande (LBDCG) en recaída o refractario tras dos o más líneas de tratamiento sistémico en adultos.'
    },
    {
        nombre: 'Yescarta® (axicabtagén ciloleucel)',
        indicacion: 'LBDCG y linfoma B de alto grado refractarios o en recaída en los 12 meses tras completar inmunoquimioterapia de primera línea. LBDCG y linfoma B primario mediastínico refractarios o en recaída tras 2 o más líneas. Linfoma folicular refractario o en recaída tras 3 o más líneas.'
    },
    {
        nombre: 'Abecma® (idecabtagén vicleucel)',
        indicacion: 'Mieloma múltiple en recaída y refractario tras al menos 3 tratamientos previos (incluidos un inmunomodulador, un inhibidor de proteasoma y un anticuerpo anti-CD38), con progresión al último tratamiento.'
    },
    {
        nombre: 'Tecartus® (brexucabtagén autoleucel)',
        indicacion: 'Linfoma de células del manto refractario o en recaída tras 2 o más líneas, incluido un inhibidor de BTK. LLA de células B precursoras en adultos ≥26 años, refractaria o en recaída.'
    },
    {
        nombre: 'Carvykti® (ciltacabtagén autoleucel)',
        indicacion: 'Mieloma múltiple refractario recaído tras al menos 1 tratamiento previo (incluidos un inmunomodulador y un inhibidor de proteasoma), con progresión al último tratamiento y refractariedad a lenalidomida.'
    },
    {
        nombre: 'ARI-0001 (CAR-T académico)',
        indicacion: 'Desarrollado en el Hospital Clínic de Barcelona, autorizado en España. LLA de células B en pacientes mayores de 25 años, en recaída o refractariedad a tratamientos convencionales, sin CAR-T previo.'
    }
];

export const criteriosSeleccionCarT = {
    inclusionComunes: [
        'Edad ≥18 años.',
        'Estado funcional ECOG &lt;2.',
        'Función renal, hepática, pulmonar y cardiaca adecuada para tolerar el tratamiento.',
        'Ausencia de infección activa o con carga viral detectable por VIH, hepatitis B o C.',
        'No haber recibido tratamiento previo con células CAR-T.',
        'Reserva medular adecuada: neutrófilos &gt;1000/mm³, linfocitos &gt;300/mm³ y linfocitos T CD3+ &gt;150/mm³, plaquetas ≥50.000/mm³, hemoglobina &gt;8.0 g/dl.'
    ],
    exclusion: [
        'Padecer otra neoplasia activa.',
        'Infección activa grave o no controlada, incluyendo VIH con carga viral detectable, o hepatitis B/C activa.',
        'ECOG ≥2 (incapacidad de tolerar terapia agresiva).',
        'Enfermedades graves no controladas: insuficiencia cardiaca avanzada, insuficiencia hepática o renal grave, trastornos pulmonares severos.',
        'Enfermedades neurológicas autoinmunes activas (p. ej. síndrome de Guillain-Barré, esclerosis lateral amiotrófica).',
        'Tratamiento previo con un CAR-T.',
        'Enfermedad del injerto contra el receptor (EICR) activa.',
        'Contraindicaciones específicas según la ficha técnica de cada producto y el protocolo clínico (p. ej. intolerancia a los componentes del tratamiento, alergias graves o participación en otros ensayos clínicos en conflicto).'
    ]
};

export const linfodeplecionData = {
    yescarta: { producto: 'Yescarta (axi-cel)', regimen: 'Ciclofosfamida 500 mg/m² + Fludarabina 30 mg/m²', dias: 'Días -5, -4, -3' },
    carvykti: { producto: 'Carvykti (cilta-cel)', regimen: 'Ciclofosfamida 300 mg/m² + Fludarabina 30 mg/m²', dias: 'Días -5, -4, -3' },
    tecartus: { producto: 'Tecartus (brexu-cel)', regimen: 'Ciclofosfamida 900 mg/m² + Fludarabina 25 mg/m²', dias: 'Fludarabina días -4, -3, -2; ciclofosfamida día -2' },
    abecma: { producto: 'Abecma (ide-cel)', regimen: 'Ciclofosfamida 900 mg/m² + Fludarabina 30 mg/m²', dias: 'Días -5, -4, -3' }
};

// Tabla de monitorización y tratamiento de primera/segunda línea del SLC,
// basada en la versión vigente del protocolo del servicio (2025).
export const slcMonitorizacionData = {
    1: {
        signos: { temperatura: 'Fiebre ≥38°C (signo más frecuente)', tas: 'No hipotensión', o2: 'No requiere oxígeno suplementario' },
        primeraLinea: 'Descartar origen infeccioso (cultivos) e iniciar tratamiento antimicrobiano empírico (levofloxacino) o dirigido según colonización previa. Medidas antitérmicas. Retirar hipotensores y furosemida; mantener sueroterapia.',
        segundaLinea: 'Si hay alto riesgo de SLC grave (SLC precoz &lt;24h, fiebre persistente/refractaria, clínica general acusada, alta carga tumoral): tocilizumab 24-48h tras el debut del SLC. Si se necesita una 2ª dosis de tocilizumab, asociar dexametasona 10 mg en dosis única.'
    },
    2: {
        signos: { temperatura: 'Fiebre ≥38°C', tas: 'Hipotensión que responde a fluidos, sin necesidad de vasopresores', o2: 'Necesita oxígeno de bajo flujo (≤6 L/min)' },
        primeraLinea: 'Tocilizumab 8 mg/kg iv.',
        segundaLinea: 'Si no responde a la 1ª dosis (persiste grado 2 a las 12h): 2ª dosis de tocilizumab, iniciando de forma concomitante dexametasona 10 mg iv/6h durante 1-3 días.'
    },
    3: {
        signos: { temperatura: 'Fiebre ≥38°C', tas: 'Hipotensión que requiere 1 vasopresor', o2: 'Necesita oxígeno de alto flujo (≥6 L/min)' },
        primeraLinea: 'Traslado a UCI. Tocilizumab + dexametasona 10 mg iv/6h de forma concomitante durante 1-3 días.',
        segundaLinea: 'Si persiste grado 3 a las 12h: 2ª dosis de tocilizumab y escalar dexametasona a 20 mg/6h durante 1-3 días. Si progresa a grado 4 pese a tocilizumab + dexametasona en las primeras 12h (antes del 2º tocilizumab): metilprednisolona en pulsos — 1000 mg/24h (3 días) → 250 mg/12h (3 días) → 125 mg/12h (3 días) → 60 mg/12h (3 días).'
    },
    4: {
        signos: { temperatura: 'Fiebre ≥38°C', tas: 'Hipotensión que requiere múltiples vasopresores', o2: 'Necesita ventilación con presión positiva' },
        primeraLinea: 'Traslado a UCI. Tocilizumab + dexametasona 20 mg iv/6h durante 3 días, con tapering posterior en 1 semana.',
        segundaLinea: 'Si no hay mejoría en &lt;12h: 2ª dosis de tocilizumab y pulsos de metilprednisolona según la pauta del grado 3.'
    }
};

export const slcRefractarioData = {
    criterio: 'Persiste o progresa tras 24-48h de tratamiento con corticoides a dosis plenas (dexametasona o metilprednisolona).',
    tratamiento: 'Anakinra IV a dosis altas: 8-12 mg/kg cada 24h, en perfusión continua o repartida cada 6h (máximo 400 mg/6h). Mantener 3-5 días y suspender de forma progresiva al lograr mejoría sostenida o estabilización clínica. La literatura sobre SLC refractario (Jain MD, et al. Blood 2023) describe además siltuximab, ruxolitinib o ciclofosfamida como opciones de rescate de tercera línea si no hay respuesta a la anakinra — no recogidas en el protocolo del servicio, valorar de forma individualizada.'
};

// Tabla de monitorización y tratamiento de primera/segunda línea del ICANS,
// basada en la versión vigente del protocolo del servicio (2025).
export const icansMonitorizacionData = {
    1: {
        signos: { ice: '7-9', conciencia: 'Despierto espontáneamente', crisis: 'N/A', debilidad: 'N/A', hic: '—' },
        primeraLinea: 'Valoración por Neurología. Descartar otro origen (infeccioso, cerebrovascular, edema). Suspender medicación que reduzca el nivel de conciencia. Valorar dexametasona 10 mg en dosis única.',
        segundaLinea: 'Si no lo tenía ya, iniciar anticonvulsivante: levetiracetam 500 mg/12h vo o iv.'
    },
    2: {
        signos: { ice: '3-6', conciencia: 'Despierto tras estímulo auditivo', crisis: 'N/A', debilidad: 'N/A', hic: '—' },
        primeraLinea: 'Valoración por Neurología; valorar UCI y proponer traslado si ICE &lt;6. Si no lo tenía, levetiracetam 500 mg/12h vo o iv (o dosis recomendada por Neurología). Corticoides equivalentes a dexametasona 10 mg/6h iv hasta resolución a grado 1. TC craneal y EEG, repitiendo cada 48h salvo mejoría.',
        segundaLinea: 'Si refractariedad o deterioro, tratar como grado 3.'
    },
    3: {
        signos: { ice: '0-2', conciencia: 'Despierto solo al estímulo táctil', crisis: 'Focal o generalizada que se resuelve rápidamente, o no convulsiva detectable en el EEG que se resuelve sin intervención', debilidad: 'N/A', hic: 'Edema focal en prueba de neuroimagen' },
        primeraLinea: 'Mismas medidas que en grado 2. Traslado a UCI. Dosis equivalentes a dexametasona 20 mg/6h iv hasta resolución a grado 1.',
        segundaLinea: 'Si refractariedad o deterioro, tratar como grado 4.'
    },
    4: {
        signos: { ice: '0', conciencia: 'Inconsciente — estímulos táctiles repetidos', crisis: 'Prolongada (&gt;5 min), o repetidas (clínicas y/o en EEG) sin recuperación de la normalidad entre ellas', debilidad: 'Focal pronunciada (hemiparesia o paraparesia)', hic: 'Postura de descerebración o decorticación, parálisis del VI par, papiledema, tríada de Cushing o edema cerebral difuso en la neuroimagen' },
        primeraLinea: 'Mismas medidas que en el grado anterior. Traslado a UCI. Metilprednisolona en pulsos: 1000 mg/24h (3 días) → 250 mg/12h (3 días) → 125 mg/12h (3 días) → 60 mg/12h (3 días). Tratamiento del edema cerebral o de las crisis comiciales si existieran.',
        segundaLinea: 'Si no hay respuesta, tratar como ICANS refractario.'
    }
};

export const icansRefractarioData = {
    criterio: 'Persiste o progresa tras 24-48h de corticoides a dosis plenas (dexametasona o metilprednisolona).',
    tratamiento: 'Ante sospecha de neuroinflamación mediada por IL-1: anakinra IV a dosis altas (8-12 mg/kg/24h, continua o cada 6h, máximo 400 mg/6h) durante 3-5 días. Si no hay respuesta en 48-72h, descartar causas alternativas de encefalopatía (infecciosa, metabólica, farmacológica) y valorar dasatinib 50 mg/12h durante 7 días. En ICANS grado 4 refractario o progresivo: terapia intratecal con hidrocortisona 20 mg (confirmando antes presencia de CAR-T en LCR); si no mejora en 3-7 días, repetir o valorar triple terapia intratecal (metotrexato 12 mg + citarabina 30 mg + hidrocortisona 20 mg). La literatura (Santomasso BD, et al. Blood 2023) recomienda evitar el tocilizumab en el ICANS aislado sin SLC concomitante — no revierte los síntomas neurológicos y podría empeorar la neurotoxicidad — y describe siltuximab como adyuvante junto a corticoides a dosis altas y anakinra en casos graves o refractarios.'
};

// Señales de alarma para reevaluar antes de la valoración programada (3 veces/día).
export const icansAlertasRevaluacion = ['Desorientación', 'Alteración del lenguaje', 'Alteración de la escritura', 'Convulsiones'];

export const iceScoreItems = [
    { label: 'Orientación — año', grupo: 'Orientación temporoespacial (año, mes, ciudad, hospital)' },
    { label: 'Orientación — mes', grupo: 'Orientación temporoespacial (año, mes, ciudad, hospital)' },
    { label: 'Orientación — ciudad', grupo: 'Orientación temporoespacial (año, mes, ciudad, hospital)' },
    { label: 'Orientación — hospital', grupo: 'Orientación temporoespacial (año, mes, ciudad, hospital)' },
    { label: 'Nominación — objeto 1 de 3', grupo: 'Reconocimiento de objetos ("nominación", 3 objetos distintos)' },
    { label: 'Nominación — objeto 2 de 3', grupo: 'Reconocimiento de objetos ("nominación", 3 objetos distintos)' },
    { label: 'Nominación — objeto 3 de 3', grupo: 'Reconocimiento de objetos ("nominación", 3 objetos distintos)' },
    { label: 'Obedece órdenes sencillas y complejas', grupo: 'Obediencia (cerrar los ojos/sacar la lengua; mano derecha en pie izquierdo)' },
    { label: 'Escribe una frase sencilla (sin dictado)', grupo: 'Escritura' },
    { label: 'Cuenta hacia atrás de 10 en 10 desde 100', grupo: 'Atención' }
];

