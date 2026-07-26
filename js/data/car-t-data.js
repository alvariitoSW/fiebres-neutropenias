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
        'Enfermedad del injerto contra el receptor (EICR) activa.'
    ]
};

export const linfodeplecionData = {
    yescarta: { producto: 'Yescarta (axi-cel)', regimen: 'Ciclofosfamida 500 mg/m² + Fludarabina 30 mg/m²', dias: 'Días -5, -4, -3' },
    carvykti: { producto: 'Carvykti (cilta-cel)', regimen: 'Ciclofosfamida 300 mg/m² + Fludarabina 30 mg/m²', dias: 'Días -5, -4, -3' },
    tecartus: { producto: 'Tecartus (brexu-cel)', regimen: 'Ciclofosfamida 900 mg/m² + Fludarabina 25 mg/m²', dias: 'Fludarabina días -4, -3, -2; ciclofosfamida día -2' },
    abecma: { producto: 'Abecma (ide-cel)', regimen: 'Ciclofosfamida 900 mg/m² + Fludarabina 30 mg/m²', dias: 'Días -5, -4, -3' }
};

export const slcGradosData = {
    1: {
        titulo: 'SLC grado 1',
        criterio: 'Fiebre ≥38°C sin hipotensión ni hipoxia.',
        tratamiento: 'Descartar origen infeccioso (hemocultivos) e iniciar antibioterapia empírica o dirigida según colonización. Medidas antitérmicas. Retirar hipotensores y furosemida; mantener sueroterapia.<br><br><strong>Si alto riesgo de SLC grave</strong> (SLC precoz &lt;24h, fiebre persistente/refractaria, clínica general marcada, alta carga tumoral): administrar tocilizumab 24-48h tras el debut del SLC. Si se necesita una 2ª dosis de tocilizumab, asociar dexametasona 10 mg en dosis única.'
    },
    2: {
        titulo: 'SLC grado 2',
        criterio: 'Fiebre con hipotensión que no requiere vasopresores, y/o hipoxia que requiere oxígeno de bajo flujo (≤6 L/min).',
        tratamiento: 'Tocilizumab IV 8 mg/kg. Si no responde a las 12h (persiste grado 2), administrar 2ª dosis de tocilizumab e iniciar de forma concomitante dexametasona 10 mg IV/6h durante 1-3 días.'
    },
    3: {
        titulo: 'SLC grado 3',
        criterio: 'Hipotensión que requiere 1 vasopresor (± vasopresina), y/o hipoxia que requiere oxígeno de alto flujo (≥6 L/min).',
        tratamiento: '<strong>Traslado a UCI.</strong> Tocilizumab + dexametasona 10 mg IV/6h durante 1-3 días de forma concomitante. Si persiste grado 3 a las 12h, 2ª dosis de tocilizumab y escalar dexametasona a 20 mg/6h durante 1-3 días. Si progresa a grado 4 pese a tocilizumab + dexametasona en las primeras 12h: metilprednisolona en pulsos descendentes (1000 mg/24h x3d → 250 mg/12h x3d → 125 mg/12h x3d → 60 mg/12h x3d).'
    },
    4: {
        titulo: 'SLC grado 4',
        criterio: 'Hipotensión que requiere múltiples vasopresores, y/o hipoxia que requiere ventilación con presión positiva.',
        tratamiento: '<strong>Traslado a UCI.</strong> Tocilizumab + dexametasona 20 mg IV/6h durante 3 días, con tapering posterior en 1 semana. Si no hay mejoría en menos de 12h: 2ª dosis de tocilizumab y pulsos de metilprednisolona según la pauta descrita en grado 3.'
    },
    refractario: {
        titulo: 'SLC refractario',
        criterio: 'Persiste o progresa tras 24-48h de tratamiento con corticoides a dosis plenas (dexametasona o metilprednisolona).',
        tratamiento: 'Anakinra IV a dosis altas: 8-12 mg/kg cada 24h, en perfusión continua o repartida cada 6h (máximo 400 mg/6h). Mantener 3-5 días y suspender de forma progresiva al lograr mejoría sostenida o estabilización clínica.'
    }
};

export const icansGradosData = {
    1: {
        titulo: 'ICANS grado 1',
        criterio: 'Puntuación ICE 7-9. Nivel de conciencia: despierto espontáneamente.',
        tratamiento: 'Valoración por Neurología. Descartar otro origen (infeccioso, cerebrovascular, edema). Suspender medicación que reduzca el nivel de conciencia. Valorar dexametasona 10 mg en dosis única. Si no lo tenía ya, iniciar anticonvulsivante: levetiracetam 500 mg/12h oral o IV.'
    },
    2: {
        titulo: 'ICANS grado 2',
        criterio: 'Puntuación ICE 3-6. Nivel de conciencia: despierto tras estímulo auditivo.',
        tratamiento: 'Valoración por Neurología; valorar UCI y proponer traslado si ICE &lt;6. Levetiracetam 500 mg/12h oral o IV si no lo tenía. Iniciar corticoides (dexametasona 10 mg/6h IV) hasta resolución a grado 1. TC craneal y EEG, repetir cada 48h salvo mejoría. Si refractariedad o deterioro, tratar como grado 3.'
    },
    3: {
        titulo: 'ICANS grado 3',
        criterio: 'Puntuación ICE 0-2 (o despierto solo a estímulos táctiles), o actividad comicial focal/generalizada que se resuelve rápido.',
        tratamiento: '<strong>Traslado a UCI.</strong> Mismas medidas que en grado 2. Escalar a dexametasona 20 mg/6h IV hasta resolución a grado 1. Si refractariedad o deterioro, tratar como grado 4.'
    },
    4: {
        titulo: 'ICANS grado 4',
        criterio: 'Puntuación ICE 0 (no despierta), estatus/crisis prolongada, déficit motor focal, o edema cerebral.',
        tratamiento: '<strong>Traslado a UCI.</strong> Metilprednisolona en pulsos descendentes (1000 mg/24h x3d → 250 mg/12h x3d → 125 mg/12h x3d → 60 mg/12h x3d). Tratamiento del edema cerebral o crisis comiciales si existieran. Si no hay respuesta, tratar como ICANS refractario.'
    },
    refractario: {
        titulo: 'ICANS refractario',
        criterio: 'Persiste o progresa tras 24-48h de corticoides a dosis plenas.',
        tratamiento: 'Ante sospecha de neuroinflamación mediada por IL-1: anakinra IV a dosis altas (8-12 mg/kg/24h, continua o cada 6h, máximo 400 mg/6h) durante 3-5 días. Si no hay respuesta en 48-72h, descartar causas alternativas de encefalopatía (infecciosa, metabólica, farmacológica) y valorar dasatinib 50 mg/12h durante 7 días. En ICANS grado 4 refractario o progresivo: terapia intratecal con hidrocortisona 20 mg (confirmando antes presencia de CAR-T en LCR); si no mejora en 3-7 días, repetir o valorar triple terapia intratecal (metotrexato 12 mg + citarabina 30 mg + hidrocortisona 20 mg).'
    }
};

export const otrasComplicacionesCarT = {
    lisisTumoral: 'Secundario a la rápida destrucción de células tumorales tras la infusión. Obliga a un control estricto de la función renal y los iones, e instauración de tratamiento preventivo en pacientes de alto riesgo.',
    sindromeActivacionMacrofagica: 'Sospechar en pacientes que han desarrollado SLC y que además presentan ferritina &gt;10.000 ng/mL con daño orgánico en 2 o más órganos.',
    infecciones: 'Los pacientes tratados con CAR-T se consideran de alto riesgo de infección a todos los efectos (uso de profilaxis, reservada sobre todo para neutropenias intensas y prolongadas, y manejo del tratamiento empírico de la fiebre).'
};
