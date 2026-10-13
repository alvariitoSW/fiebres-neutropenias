// Índice de los libros de texto de la app (sección "Libros"): qué capítulos
// hay, de qué PDF salen y en qué ficha de la app vive su contenido. Datos
// puros, sin DOM: lo pinta js/modules/libros/indice.js.
//
// `destino` usa las mismas claves que los enlaces cruzados de toda la app
// (`[data-especialidad]`, ver home/index.js): especialidad + view + panel +
// tab. Un capítulo sin `destino` todavía no está subido.

const MARINO_PDF = {
    acceso: 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf',
    monitorizacion: 'docs/marino-2024-practicas-monitorizacion-caps5-9.pdf',
    fluidos: 'docs/marino-2024-fluidoterapia-caps10-11.pdf',
    hemato: 'docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf',
    shock: 'docs/marino-2024-shock-caps14-17.pdf',
    cardio: 'docs/marino-2024-cardiac-disorders-caps18-21.pdf',
    resp1: 'docs/marino-2024-respiratory-management-caps22-26.pdf',
    resp2: 'docs/marino-2024-respiratory-management-caps27-30.pdf',
    acidoRenal: 'docs/marino-2024-acido-base-renal-caps31-34.pdf',
    electrolitos: 'docs/marino-2024-electrolitos-caps35-38.pdf',
    abdomen: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf',
    neuro: 'docs/marino-2024-neurologia-caps45-47.pdf',
    nutricion: 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf',
    toxicos: 'docs/marino-2024-toxicologia-caps52-53-apendices.pdf',
};

// Fichas de cada capítulo: [tab, nombre corto].
const fund = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab, nombre }));
const mh = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab, nombre }));
const mc = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab, nombre }));
const mr = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs', tab, nombre }));
const ma = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab, nombre }));
const mne = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'libros', view: 'marinoNeuro', panel: 'panel-marino-neuro-tabs', tab, nombre }));
const mu = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'libros', view: 'marinoNutricion', panel: 'panel-marino-nutri-tabs', tab, nombre }));
const mt = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'libros', view: 'marinoToxicos', panel: 'panel-marino-tox-tabs', tab, nombre }));
const mn = (fichas) => fichas.map(([tab, nombre]) => ({ especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab, nombre }));

export const librosIndice = [
    {
        id: 'marino',
        titulo: 'The ICU Book',
        autor: 'Marino PL',
        edicion: '5.ª ed.',
        color: 'var(--accent-blue)',
        nota: 'Repartido en la app por especialidad: los caps. 1-11 y 31-53 y los apéndices viven aquí, en Libros; los caps. 12-30, en Merino HEMATO, Merino Cardiología y Merino Neumología.',
        // Bloques del quiz con las preguntas de este libro, en el orden de sus capítulos ("Asignatura::Bloque").
        quiz: ['Libros::Marino · Fundamentos (caps. 1-11)', 'Hematología::Merino HEMATO', 'Cardiología::Merino Cardiología', 'Neumología::Merino Neumología', 'Libros::Marino · Ácido-base, renal y electrolitos (caps. 31-38)', 'Libros::Marino · Abdomen y temperatura (caps. 39-44)', 'Libros::Marino · Neurología (caps. 45-47)', 'Libros::Marino · Nutrición y endocrino (caps. 48-51)', 'Libros::Marino · Tóxicos y apéndices (caps. 52-53)'],
        secciones: [
            { numero: 'I', titulo: 'Acceso vascular', original: 'Vascular Access', capitulos: [
                { n: 1, titulo: 'Vascular Access Primer', es: 'Acceso vascular: lo básico', pdf: MARINO_PDF.acceso, pagina: 2, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-cateteres-flujo', 'Catéteres y flujo'], ['mar-tipos-cateter', 'Periféricos y centrales'], ['mar-eco-intraosea', 'Ecoguiada e intraósea']]) },
                { n: 2, titulo: 'Central Venous Access', es: 'Acceso venoso central', pdf: MARINO_PDF.acceso, pagina: 23, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-cvc-sitios', 'Indicaciones y sitio de punción'], ['mar-cvc-complicaciones', 'Complicaciones inmediatas y punta']]) },
                { n: 3, titulo: 'The Indwelling Vascular Catheter', es: 'El catéter vascular permanente', pdf: MARINO_PDF.acceso, pagina: 40, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-cateter-cuidados', 'Cuidados, oclusión y trombosis'], ['mar-bacteriemia-cateter', 'Bacteriemia por catéter']]) },
            ] },
            { numero: 'II', titulo: 'Prácticas habituales', original: 'Common Practices', capitulos: [
                { n: 4, titulo: 'Alimentary Prophylaxis', es: 'Profilaxis del tubo digestivo', pdf: MARINO_PDF.acceso, pagina: 58, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-microbioma', 'Microbioma y descontaminación'], ['mar-ulcera-estres', 'Úlcera de estrés']]) },
                { n: 5, titulo: 'Venous Thromboprophylaxis', es: 'Tromboprofilaxis venosa', pdf: MARINO_PDF.monitorizacion, pagina: 1, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-tromboprofilaxis-farmacos', 'Riesgo y fármacos'], ['mar-tromboprofilaxis-escenarios', 'Pautas por escenario']]) },
                { n: 6, titulo: 'Analgesia and Sedation in the ICU', es: 'Analgesia y sedación', pdf: MARINO_PDF.monitorizacion, pagina: 16, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-analgesia', 'Analgesia'], ['mar-sedacion', 'Sedación']]) },
            ] },
            { numero: 'III', titulo: 'Monitorización fisiológica', original: 'Physiological Monitoring', capitulos: [
                { n: 7, titulo: 'Oximetry and Capnography', es: 'Oximetría y capnografía', pdf: MARINO_PDF.monitorizacion, pagina: 36, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-oximetria', 'Oximetría'], ['mar-capnografia', 'Capnografía']]) },
                { n: 8, titulo: 'The Pulmonary Artery Catheter', es: 'El catéter de arteria pulmonar', pdf: MARINO_PDF.monitorizacion, pagina: 50, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-cateter-ap', 'Catéter y presión de enclavamiento'], ['mar-termodilucion', 'Gasto cardíaco y parámetros derivados']]) },
                { n: 9, titulo: 'Systemic Oxygenation', es: 'Oxigenación sistémica', pdf: MARINO_PDF.monitorizacion, pagina: 67, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-transporte-o2', 'Oxígeno en sangre y transporte'], ['mar-extraccion-lactato', 'Extracción de O₂ y lactato']]) },
            ] },
            { numero: 'IV', titulo: 'Fluidoterapia intravenosa', original: 'Intravenous Fluid Therapy', capitulos: [
                { n: 10, titulo: 'Intravenous Fluids', es: 'Fluidos intravenosos', pdf: MARINO_PDF.fluidos, pagina: 2, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-cristaloides', 'Cristaloides y dextrosa'], ['mar-coloides', 'Coloides']]) },
                { n: 11, titulo: 'Fluid Management', es: 'Manejo de fluidos', pdf: MARINO_PDF.fluidos, pagina: 21, donde: 'Libros · Marino Fundamentos',
                  fichas: fund([['mar-retorno-venoso', 'Retorno venoso y sobrecarga'], ['mar-respuesta-fluidos', 'Hipoperfusión y respuesta a fluidos']]) },
            ] },
            { numero: 'V', titulo: '', capitulos: [
                { n: 12, titulo: 'Anemia and Red Blood Cell Transfusions', es: 'Anemia y transfusión de hematíes', pdf: MARINO_PDF.hemato, pagina: 1, donde: 'PIF · Hematología · Merino HEMATO',
                  fichas: mh([['merino-anemia', 'Anemia en el crítico'], ['merino-transfusion', 'Umbral transfusional'], ['merino-riesgos', 'Riesgos de la transfusión']]) },
                { n: 13, titulo: 'Platelets and Plasma', es: 'Plaquetas y plasma', pdf: MARINO_PDF.hemato, pagina: 20, donde: 'PIF · Hematología · Merino HEMATO',
                  fichas: mh([['merino-trombocitopenia', 'Trombocitopenia y HIT'], ['merino-microangiopatias', 'Microangiopatías trombóticas'], ['merino-plaquetas-plasma', 'Plaquetas y plasma']]) },
            ] },
            { numero: 'VI', titulo: 'Síndromes de shock', original: 'Shock Syndromes', capitulos: [
                { n: 14, titulo: 'Approaches to Clinical Shock', es: 'Abordaje del shock', pdf: MARINO_PDF.shock, pagina: 1, donde: 'Fisiopatología UCI · Cardiología · Merino Cardiología',
                  fichas: mc([['mc-definiciones', 'Definiciones y monitorización'], ['mc-vasopresores', 'Vasopresores']]) },
                { n: 15, titulo: 'Hemorrhagic Shock', es: 'Shock hemorrágico', pdf: MARINO_PDF.shock, pagina: 21, donde: 'Merino Cardiología',
                  fichas: mc([['mc-hemorragico-clasificacion', 'Clasificación'], ['mc-hemorragico-fluidos', 'Fluidos y hemoderivados'], ['mc-damage-control', 'Reanimación de control de daños']]) },
                { n: 16, titulo: 'Cardiogenic Shock', es: 'Shock cardiogénico', pdf: MARINO_PDF.shock, pagina: 37, donde: 'Merino Cardiología',
                  fichas: mc([['mc-cardiogenico-fisio', 'Fisiopatología'], ['mc-cardiogenico-farmaco', 'Fármacos'], ['mc-soporte-mecanico', 'Soporte mecánico']]) },
                { n: 17, titulo: 'Inflammatory Shock Syndromes', es: 'Shock inflamatorio', pdf: MARINO_PDF.shock, pagina: 52, donde: 'Merino Cardiología',
                  fichas: mc([['mc-inflamacion-ros', 'Inflamación'], ['mc-shock-septico', 'Shock séptico'], ['mc-shock-toxico', 'Shock tóxico'], ['mc-anafilaxia', 'Anafilaxia']]) },
            ] },
            { numero: 'VII', titulo: 'Trastornos cardíacos', original: 'Cardiac Disorders', capitulos: [
                { n: 18, titulo: 'Acute Heart Failure(s)', es: 'Insuficiencia cardíaca aguda', pdf: MARINO_PDF.cardio, pagina: 1, donde: 'Merino Cardiología',
                  fichas: mc([['mc-ic-tipos', 'Tipos'], ['mc-ic-manejo', 'Manejo']]) },
                { n: 19, titulo: 'Tachyarrhythmias', es: 'Taquiarritmias', pdf: MARINO_PDF.cardio, pagina: 18, donde: 'Merino Cardiología',
                  fichas: mc([['mc-taqui-reconocimiento', 'Reconocimiento'], ['mc-fa-frecuencia', 'FA: frecuencia'], ['mc-fa-cardioversion', 'FA: cardioversión'], ['mc-otras-taqui', 'Otras taquicardias']]) },
                { n: 20, titulo: 'Acute Coronary Syndromes', es: 'Síndromes coronarios agudos', pdf: MARINO_PDF.cardio, pagina: 38, donde: 'Merino Cardiología',
                  fichas: mc([['mc-sca-diagnostico', 'Diagnóstico'], ['mc-sca-tratamiento', 'Tratamiento'], ['mc-diseccion-aortica', 'Disección aórtica']]) },
                { n: 21, titulo: 'Cardiac Arrest', es: 'Parada cardíaca', pdf: MARINO_PDF.cardio, pagina: 55, donde: 'Merino Cardiología',
                  fichas: mc([['mc-paro-soporte', 'Soporte vital'], ['mc-paro-monitorizacion', 'Monitorización'], ['mc-posresucitacion', 'Posparada']]) },
            ] },
            { numero: 'VIII', titulo: 'Trastornos respiratorios', original: 'Respiratory Disorders', capitulos: [
                { n: 22, titulo: 'Acute Pulmonary Embolism', es: 'Embolia pulmonar aguda', pdf: MARINO_PDF.resp1, pagina: 1, donde: 'Fisiopatología UCI · Neumología · Merino Neumología',
                  fichas: mn([['neumo-ep-diagnostico', 'Diagnóstico'], ['neumo-ep-manejo', 'Manejo']]) },
                { n: 23, titulo: 'Asthma and COPD in the ICU', es: 'Asma y EPOC en la UCI', pdf: MARINO_PDF.resp1, pagina: 15, donde: 'Merino Neumología',
                  fichas: mn([['neumo-asma-epoc-basicos', 'Básicos'], ['neumo-asma-agudo', 'Asma aguda'], ['neumo-epoc-vpp', 'EPOC y presión positiva']]) },
                { n: 24, titulo: 'Acute Respiratory Distress Syndrome', es: 'SDRA', pdf: MARINO_PDF.resp1, pagina: 32, donde: 'Merino Neumología',
                  fichas: mn([['neumo-sdra-diagnostico', 'Diagnóstico'], ['neumo-sdra-no-ventilatorio', 'Manejo no ventilatorio'], ['neumo-sdra-ventilacion', 'Ventilación']]) },
            ] },
            { numero: 'IX', titulo: 'Manejo respiratorio', original: 'Respiratory Management', capitulos: [
                { n: 25, titulo: 'Oxygen Inhalation', es: 'Oxigenoterapia', pdf: MARINO_PDF.resp1, pagina: 56, donde: 'Merino Neumología',
                  fichas: mn([['neumo-o2-indicaciones', 'Indicaciones'], ['neumo-o2-sistemas', 'Sistemas'], ['neumo-o2-toxicidad', 'Toxicidad']]) },
                { n: 26, titulo: 'Noninvasive Ventilation', es: 'Ventilación no invasiva', pdf: MARINO_PDF.resp1, pagina: 76, donde: 'Merino Neumología',
                  fichas: mn([['neumo-vni-metodos', 'Métodos'], ['neumo-vni-uso', 'Uso clínico']]) },
                { n: 27, titulo: 'Conventional Mechanical Ventilation', es: 'Ventilación mecánica convencional', pdf: MARINO_PDF.resp2, pagina: 1, donde: 'Merino Neumología',
                  fichas: mn([['neumo-vm-modos', 'Modos'], ['neumo-vm-ajuste', 'Ajuste']]) },
                { n: 28, titulo: 'The Ventilator-Dependent Patient', es: 'El paciente dependiente del ventilador', pdf: MARINO_PDF.resp2, pagina: 17, donde: 'Merino Neumología',
                  fichas: mn([['neumo-vias-artificiales', 'Vía aérea artificial'], ['neumo-cuidado-barotrauma', 'Cuidados y barotrauma'], ['neumo-peep-oculta', 'PEEP oculta']]) },
                { n: 29, titulo: 'Ventilator-Associated Pneumonia', es: 'Neumonía asociada al ventilador', pdf: MARINO_PDF.resp2, pagina: 35, donde: 'Merino Neumología',
                  fichas: mn([['neumo-nav-prevencion', 'Prevención'], ['neumo-nav-diagnostico', 'Diagnóstico'], ['neumo-derrame-antimicrobiano', 'Derrame y antibióticos']]) },
                { n: 30, titulo: 'Discontinuing Mechanical Ventilation', es: 'Retirada de la ventilación', pdf: MARINO_PDF.resp2, pagina: 50, donde: 'Merino Neumología',
                  fichas: mn([['neumo-sbt', 'Prueba de respiración espontánea'], ['neumo-weaning-extubacion', 'Destete y extubación']]) },
            ] },
            { numero: 'X', titulo: 'Trastornos ácido-base', original: 'Acid-Base Disorders', capitulos: [
                { n: 31, titulo: 'Acid-Base Analysis', es: 'Análisis ácido-base', pdf: MARINO_PDF.acidoRenal, pagina: 2, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-acidobase-analisis', 'pH y compensaciones'], ['mr-acidobase-gaps', 'Los "gaps"']]) },
                { n: 32, titulo: 'Lactic Acidosis and Ketoacidosis', es: 'Acidosis láctica y cetoacidosis', pdf: MARINO_PDF.acidoRenal, pagina: 16, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-lactato-bicarbonato', 'Lactato y bicarbonato'], ['mr-cetoacidosis', 'Cetoacidosis']]) },
                { n: 33, titulo: 'Metabolic Alkalosis', es: 'Alcalosis metabólica', pdf: MARINO_PDF.acidoRenal, pagina: 32, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-alcalosis-mecanismos', 'Mecanismos'], ['mr-alcalosis-tratamiento', 'Tratamiento']]) },
            ] },
            { numero: 'XI', titulo: 'Trastornos renales y electrolíticos', original: 'Renal & Electrolyte Disorders', capitulos: [
                { n: 34, titulo: 'Acute Kidney Injury', es: 'Fracaso renal agudo', pdf: MARINO_PDF.acidoRenal, pagina: 44, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-fra-criterios', 'Criterios'], ['mr-fra-causas', 'Causas y presiones'], ['mr-fra-nefrotoxicos', 'Nefrotóxicos'], ['mr-fra-indices', 'Índices urinarios'], ['mr-trr', 'Reemplazo renal']]) },
                { n: 35, titulo: 'Sodium', es: 'Sodio', pdf: MARINO_PDF.electrolitos, pagina: 1, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-osmolalidad', 'Osmolalidad'], ['mr-hipernatremia', 'Hipernatremia'], ['mr-hiponatremia-dx', 'Hiponatremia: diagnóstico'], ['mr-hiponatremia-tto', 'Hiponatremia: tratamiento']]) },
                { n: 36, titulo: 'Potassium', es: 'Potasio', pdf: MARINO_PDF.electrolitos, pagina: 18, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-hipopotasemia', 'Hipopotasemia'], ['mr-hiperk-causas', 'Hiperpotasemia: causas'], ['mr-hiperk-tratamiento', 'Hiperpotasemia: tratamiento']]) },
                { n: 37, titulo: 'Magnesium', es: 'Magnesio', pdf: MARINO_PDF.electrolitos, pagina: 31, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-magnesio-deficit', 'Déficit'], ['mr-magnesio-reposicion', 'Reposición e hipermagnesemia']]) },
                { n: 38, titulo: 'Calcium and Phosphorus', es: 'Calcio y fósforo', pdf: MARINO_PDF.electrolitos, pagina: 42, donde: 'Libros · Marino Ácido-base y renal',
                  fichas: mr([['mr-calcio-hipoca', 'Calcio e hipocalcemia'], ['mr-hipercalcemia', 'Hipercalcemia'], ['mr-fosforo', 'Fósforo']]) },
            ] },
            { numero: 'XII', titulo: 'Abdomen y pelvis', original: 'The Abdomen & Pelvis', capitulos: [
                { n: 39, titulo: 'Liver Failure', es: 'Insuficiencia hepática', pdf: MARINO_PDF.abdomen, pagina: 2, donde: 'Libros · Marino Abdomen y temperatura',
                  fichas: ma([['ma-fallo-hepatico-agudo', 'Fallo hepático agudo'], ['ma-encefalopatia-hepatica', 'Encefalopatía'], ['ma-varices', 'Varices'], ['ma-pbe-shr', 'PBE y hepatorrenal']]) },
                { n: 40, titulo: 'Acute Pancreatitis', es: 'Pancreatitis aguda', pdf: MARINO_PDF.abdomen, pagina: 16, donde: 'Libros · Marino Abdomen y temperatura',
                  fichas: ma([['ma-pancreatitis-dx', 'Diagnóstico y gravedad'], ['ma-pancreatitis-tto', 'Tratamiento']]) },
                { n: 41, titulo: 'Abdominal Infections in the ICU', es: 'Infecciones abdominales', pdf: MARINO_PDF.abdomen, pagina: 25, donde: 'Libros · Marino Abdomen y temperatura',
                  fichas: ma([['ma-colecistitis', 'Colecistitis alitiásica'], ['ma-cdifficile', 'C. difficile'], ['ma-infeccion-abdominal', 'Infección intraabdominal']]) },
                { n: 42, titulo: 'Urinary Tract Infections in the ICU', es: 'Infecciones urinarias', pdf: MARINO_PDF.abdomen, pagina: 38, donde: 'Libros · Marino Abdomen y temperatura',
                  fichas: ma([['ma-itu-sonda', 'Asociada a sonda'], ['ma-candiduria', 'Candiduria']]) },
            ] },
            { numero: 'XIII', titulo: 'Temperatura corporal alterada', original: 'Altered Body Temperature', capitulos: [
                { n: 43, titulo: 'Thermoregulatory Disorders', es: 'Trastornos de la termorregulación', pdf: MARINO_PDF.abdomen, pagina: 45, donde: 'Libros · Marino Abdomen y temperatura',
                  fichas: ma([['ma-calor', 'Calor'], ['ma-hipertermia-farmacos', 'Hipertermias por fármacos'], ['ma-hipotermia', 'Hipotermia']]) },
                { n: 44, titulo: 'Fever in the ICU', es: 'Fiebre en la UCI', pdf: MARINO_PDF.abdomen, pagina: 59, donde: 'Libros · Marino Abdomen y temperatura',
                  fichas: ma([['ma-fiebre-basicos', 'Bases y no infecciosas'], ['ma-infecciones-nosocomiales', 'Infecciones y hemocultivos'], ['ma-antipireticos', 'Antipiréticos']]) },
            ] },
            { numero: 'XIV', titulo: 'Trastornos del sistema nervioso', original: 'Nervous System Disorders', capitulos: [
                { n: 45, titulo: 'Disorders of Consciousness', es: 'Trastornos de la consciencia', pdf: MARINO_PDF.neuro, pagina: 2, donde: 'Libros · Marino Neurología',
                  fichas: mne([['mn-consciencia', 'Consciencia alterada'], ['mn-delirio', 'Delirio'], ['mn-abstinencia', 'Abstinencia alcohólica'], ['mn-coma', 'Coma'], ['mn-muerte-encefalica', 'Muerte encefálica']]) },
                { n: 46, titulo: 'Disorders of Movement', es: 'Trastornos del movimiento', pdf: MARINO_PDF.neuro, pagina: 19, donde: 'Libros · Marino Neurología',
                  fichas: mne([['mn-convulsiones', 'Convulsiones'], ['mn-estado-epileptico', 'Estado epiléptico'], ['mn-miastenia', 'Miastenia gravis'], ['mn-gbs-pnc', 'Guillain-Barré y neuromiopatía'], ['mn-relajantes', 'Bloqueo neuromuscular']]) },
                { n: 47, titulo: 'Acute Stroke in the ICU', es: 'Ictus agudo en la UCI', pdf: MARINO_PDF.neuro, pagina: 34, donde: 'Libros · Marino Neurología',
                  fichas: mne([['mn-ictus-soporte', 'Ictus: medidas generales'], ['mn-ictus-complicaciones', 'Ictus: antitrombóticos'], ['mn-hic', 'Hemorragia intracerebral'], ['mn-hsa', 'Hemorragia subaracnoidea']]) },
            ] },
            { numero: 'XV', titulo: 'Nutrición y metabolismo', original: 'Nutrition & Metabolism', capitulos: [
                { n: 48, titulo: 'Nutritional Requirements', es: 'Necesidades nutricionales', pdf: MARINO_PDF.nutricion, pagina: 2, donde: 'Libros · Marino Nutrición y endocrino',
                  fichas: mu([['mu-gasto-energetico', 'Gasto energético'], ['mu-sustratos', 'Sustratos y nitrógeno'], ['mu-tiamina', 'Tiamina'], ['mu-vitaminas-oligo', 'Vitaminas y oligoelementos']]) },
                { n: 49, titulo: 'Enteral Nutrition', es: 'Nutrición enteral', pdf: MARINO_PDF.nutricion, pagina: 18, donde: 'Libros · Marino Nutrición y endocrino',
                  fichas: mu([['mu-enteral-indicaciones', 'Por qué y cuándo'], ['mu-formulas', 'Fórmulas'], ['mu-pauta-enteral', 'Pauta y sonda'], ['mu-complicaciones-enteral', 'Complicaciones']]) },
                { n: 50, titulo: 'Parenteral Nutrition', es: 'Nutrición parenteral', pdf: MARINO_PDF.nutricion, pagina: 36, donde: 'Libros · Marino Nutrición y endocrino',
                  fichas: mu([['mu-npt-soluciones', 'Soluciones'], ['mu-npt-pauta', 'Paso a paso'], ['mu-npt-complicaciones', 'Complicaciones y realimentación']]) },
                { n: 51, titulo: 'Adrenal and Thyroid Dysfunction', es: 'Disfunción suprarrenal y tiroidea', pdf: MARINO_PDF.nutricion, pagina: 47, donde: 'Libros · Marino Nutrición y endocrino',
                  fichas: mu([['mu-suprarrenal', 'Suprarrenal (CIRCI)'], ['mu-tiroides', 'Tiroides y tirotoxicosis'], ['mu-hipotiroidismo', 'Hipotiroidismo']]) },
            ] },
            { numero: 'XVI', titulo: 'Sobredosis y tóxicos', original: 'Overdoses & Poisons', capitulos: [
                { n: 52, titulo: 'Pharmaceutical Drug Overdoses', es: 'Sobredosis de fármacos', pdf: MARINO_PDF.toxicos, pagina: 2, donde: 'Libros · Marino Tóxicos y apéndices',
                  fichas: mt([['mt-paracetamol', 'Paracetamol'], ['mt-nac', 'N-acetilcisteína'], ['mt-bzd-betabloq', 'Benzodiacepinas y betabloqueantes'], ['mt-opioides', 'Opioides'], ['mt-salicilatos', 'Salicilatos']]) },
                { n: 53, titulo: 'Nonpharmaceutical Poisons', es: 'Tóxicos no farmacológicos', pdf: MARINO_PDF.toxicos, pagina: 19, donde: 'Libros · Marino Tóxicos y apéndices',
                  fichas: mt([['mt-co', 'Monóxido de carbono'], ['mt-cianuro', 'Cianuro'], ['mt-alcoholes', 'Etilenglicol y metanol']]) },
            ] },
            { numero: 'XVII', titulo: 'Apéndices', original: 'Appendices', capitulos: [
                { n: 'A1', titulo: 'Units and Conversions', es: 'Unidades y conversiones', pdf: MARINO_PDF.toxicos, pagina: 32, donde: 'Libros · Marino Tóxicos y apéndices',
                  fichas: mt([['mt-unidades', 'Unidades y conversiones']]) },
                { n: 'A2', titulo: 'Selected Reference Ranges', es: 'Valores de referencia', pdf: MARINO_PDF.toxicos, pagina: 37, donde: 'Libros · Marino Tóxicos y apéndices',
                  fichas: mt([['mt-referencias', 'Valores de referencia']]) },
                { n: 'A3', titulo: 'The Body Fantastic', es: 'El cuerpo fantástico', pdf: MARINO_PDF.toxicos, pagina: 44, donde: 'Libros · Marino Tóxicos y apéndices',
                  fichas: mt([['mt-cuerpo', 'El cuerpo fantástico']]) },
            ] },
        ]
    },
    {
        id: 'libro-azul',
        titulo: 'El Libro Azul',
        autor: 'Bases fisiopatológicas de la medicina crítica',
        edicion: '',
        color: 'var(--accent-yellow)',
        nota: 'Vive en Fisiopatología UCI (grupo raíz Fisiopatología UCI → tarjeta Fisiopatología UCI). Hoy están las secciones I, II, III y VII.',
        quiz: ['Fisiopatología UCI::Cardiología', 'Fisiopatología UCI::Hematología y Hemostasia', 'Fisiopatología UCI::Inmunología', 'Fisiopatología UCI::Vías Urinarias'],
        secciones: [
            { numero: 'I', titulo: 'Aparato cardiovascular', capitulos: [
                ...[
                    [1, 'Fisiología cardíaca aplicada', 'cardio-fisiologia-aplicada', 'parte1', 3],
                    [2, 'Fisiopatología cardiovascular: de lo fundamental a lo importante', 'cardio-fisiopatologia-fundamental', 'parte1', 23],
                    [3, 'Disfunción cardíaca sistólica y diastólica', 'cardio-disfuncion-sistolica-diastolica', 'parte1', 29],
                    [4, '¿Cómo funciona la microcirculación?', 'cardio-microcirculacion', 'parte1', 45],
                    [5, 'Monitorización hemodinámica sistémica clásica', 'cardio-monitorizacion-hemodinamica', 'parte1', 59],
                    [6, 'Fisiopatología de la enfermedad coronaria', 'cardio-enfermedad-coronaria', 'parte1', 97],
                    [7, 'Hipertensión pulmonar en el paciente crítico', 'cardio-hipertension-pulmonar', 'parte2', 1],
                    [8, 'Fisiopatología de la embolia pulmonar', 'cardio-embolia-pulmonar', 'parte2', 15],
                    [9, 'Fisiopatología del ventrículo derecho', 'cardio-ventriculo-derecho', 'parte2', 21],
                    [10, 'Fisiopatología de los estados de choque', 'cardio-estados-choque', 'parte2', 29],
                    [11, 'Interacción corazón-pulmón', 'cardio-interaccion-corazon-pulmon', 'parte2', 55],
                ].map(([n, es, tab, parte, pagina]) => ({ n, es, pdf: `docs/libro-azul-seccion-i-cardiovascular-${parte}.pdf`, pagina, donde: 'Fisiopatología UCI · Cardiología',
                    fichas: [{ especialidad: 'fisioUci', view: 'cardiologia', panel: 'panel-cardio-tabs', tab, nombre: es }] })),
            ] },
            { numero: 'II', titulo: 'Hematología y hemostasia', capitulos: [
                ...[
                    [12, 'Fisiopatología de la anemia', 'fuci-anemia', 1],
                    [13, 'Fisiopatología de la trombocitopenia', 'fuci-trombocitopenia', 15],
                    [14, '¿Cuándo transfundir?', 'fuci-transfusion', 29],
                    [15, 'Monitorización de la hemostasia (TEG/ROTEM)', 'fuci-teg', 55],
                    [16, 'Eosinofilia en el paciente crítico', 'fuci-eosinofilia', 71],
                ].map(([n, es, tab, pagina]) => ({ n, es, pdf: 'docs/libro-azul-seccion-ii-hematologia-hemostasia.pdf', pagina, donde: 'Fisiopatología UCI · Hematología y Hemostasia',
                    fichas: [{ especialidad: 'fisioUci', view: 'hematologia', panel: 'panel-fuci-hemato-tabs', tab, nombre: es }] })),
            ] },
            { numero: 'III', titulo: 'Sistema inmunitario', capitulos: [
                ...[
                    [17, 'El huésped crítico: mecanismos de defensa', [['inmuno-huesped-defensa', 'SIRS, CARS y PICS'], ['inmuno-mediadores-terapias', 'Mediadores y terapias']], 'parte1', 3],
                    [18, 'Fiebre y alteraciones de la temperatura', [['inmuno-fiebre-fisiologia', 'Fiebre'], ['inmuno-hipertermia-sindromes', 'Hipertermia']], 'parte1', 29],
                    [19, 'Fisiopatología de la sepsis', [['inmuno-sepsis-fisiopatologia', 'Sepsis']], 'parte1', 53],
                    [20, 'El corazón en la sepsis', [['inmuno-corazon-lps', 'LPS y depresión miocárdica'], ['inmuno-corazon-mitocondria-calcio', 'Mitocondria y calcio']], 'parte2', 1],
                    [21, 'Encefalopatía séptica', [['inmuno-encefalopatia-fisiopatologia', 'Fisiopatología'], ['inmuno-encefalopatia-diagnostico', 'Diagnóstico y manejo']], 'parte2', 29],
                    [22, 'Fisiopatogenia del choque séptico', [['inmuno-choque-definiciones', 'Definiciones'], ['inmuno-endotelio-cardiovascular', 'Endotelio']], 'parte2', 41],
                    [23, 'Monitorización de los parénquimas en sepsis', [['inmuno-sofa-dom', 'SOFA y disfunción orgánica'], ['inmuno-biomarcadores-pct', 'Procalcitonina']], 'parte2', 59],
                ].map(([n, es, fichas, parte, pagina]) => ({ n, es, pdf: `docs/libro-azul-seccion-iii-inmunitario-${parte}.pdf`, pagina, donde: 'Fisiopatología UCI · Inmunología',
                    fichas: fichas.map(([tab, nombre]) => ({ especialidad: 'fisioUci', view: 'inmunologia', panel: 'panel-inmuno-tabs', tab, nombre })) })),
            ] },
            { numero: 'IV-VI', titulo: 'Aparato respiratorio y siguientes', pendiente: 'Caps. 24-45: sin PDF todavía.', capitulos: [] },
            { numero: 'VII', titulo: 'Vías urinarias', capitulos: [
                ...[
                    [46, 'Fisiopatología renal', 'vu-fisiologia-renal', 3],
                    [47, 'Fisiopatología de la lesión renal aguda', 'vu-lra', 13],
                    [48, 'Monitorización de la función renal', 'vu-monitorizacion', 25],
                ].map(([n, es, tab, pagina]) => ({ n, es, pdf: 'docs/libro-azul-seccion-vii-vias-urinarias.pdf', pagina, donde: 'Fisiopatología UCI · Vías Urinarias',
                    fichas: [{ especialidad: 'fisioUci', view: 'viasUrinarias', panel: 'panel-vu-tabs', tab, nombre: es }] })),
            ] },
            { numero: 'VIII →', titulo: 'Secciones siguientes', pendiente: 'Caps. 49 en adelante: sin PDF todavía.', capitulos: [] },
        ]
    }
];
