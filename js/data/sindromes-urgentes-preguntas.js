// Banco de preguntas de repaso — Síndromes Hematológicos Urgentes (CID,
// PTT, Síndrome de Lisis Tumoral). Mismo formato que
// nefrologia-preguntas.js. Fuentes: Iba T, et al. J Thromb Haemost. 2025
// (CID); Levi M, et al. Br J Haematol. 2009 (CID); Zheng XL, et al. J
// Thromb Haemost. 2025 (PTT); Chan YLT, et al. Br J Haematol. 2025 (SLT);
// Cairo MS, Bishop M. Br J Haematol. 2004 (SLT).
export const temasSindromes = [
    { key: 'sind-cid', etiqueta: 'Coagulación Intravascular Diseminada' },
    { key: 'sind-ptt', etiqueta: 'Púrpura Trombótica Trombocitopénica' },
    { key: 'sind-slt', etiqueta: 'Síndrome de Lisis Tumoral' },
];

export const preguntasSindromes = [
    // ---- CID ----
    {
        id: 'sind-q001',
        tema: 'sind-cid',
        enunciado: '¿Cuáles son los 2 fenotipos clínicos principales de la CID?',
        opciones: ['Trombótico y hemorrágico', 'Agudo y crónico exclusivamente', 'Solo hemorrágico', 'Solo trombótico'],
        correcta: 0,
        explicacion: 'La CID puede manifestarse con un fenotipo predominantemente trombótico (depósito de fibrina, microtrombosis, fallo orgánico) o hemorrágico (consumo de plaquetas y factores de coagulación).',
    },
    {
        id: 'sind-q002',
        tema: 'sind-cid',
        enunciado: '¿Qué escala de 2025 usa la app para clasificar la coagulopatía inducida por sepsis, previa a la CID franca?',
        opciones: ['SIC (Sepsis-Induced Coagulopathy)', 'SOFA', 'APACHE II', 'CURB-65'],
        correcta: 0,
        explicacion: 'El SIC score (Sepsis-Induced Coagulopathy) es la puntuación de 2025 que identifica la coagulopatía precoz inducida por sepsis, antes de que se establezca la CID franca (Overt DIC).',
    },
    {
        id: 'sind-q003',
        tema: 'sind-cid',
        enunciado: '¿Qué fármaco, antes recomendado en la CID asociada a sepsis grave, fue retirado del mercado en 2011 tras el ensayo PROWESS-SHOCK?',
        opciones: ['La proteína C activada recombinante (Xigris®)', 'La heparina no fraccionada', 'El ácido tranexámico', 'El plasma fresco congelado'],
        correcta: 0,
        explicacion: 'La proteína C activada recombinante (Xigris®) fue retirada del mercado en 2011 tras el ensayo PROWESS-SHOCK y ya no forma parte de la práctica clínica actual — no debe reproducirse como recomendación vigente.',
    },
    {
        id: 'sind-q004',
        tema: 'sind-cid',
        enunciado: 'Según la guía BCSH (Levi et al. 2009), ¿qué 3 parámetros de laboratorio son la base de la puntuación ISTH de Overt DIC?',
        opciones: ['Recuento de plaquetas, tiempo de protrombina y fibrinógeno (más dímero-D/productos de degradación de fibrina)', 'Hemoglobina, leucocitos y VSG', 'Creatinina, urea y potasio', 'Bilirrubina, GOT y GPT'],
        correcta: 0,
        explicacion: 'La puntuación ISTH de Overt DIC se basa en el recuento de plaquetas, el tiempo de protrombina, el fibrinógeno y los marcadores relacionados con fibrina (dímero-D o productos de degradación de fibrina).',
    },
    {
        id: 'sind-q005',
        tema: 'sind-cid',
        enunciado: 'A nivel del microvaso, ¿qué diferencia el fenotipo trombótico del hemorrágico en la CID?',
        opciones: ['Depósito de fibrina y microtrombosis (trombótico) vs. consumo de plaquetas y factores con rotura de la barrera hemostática (hemorrágico)', 'No hay ninguna diferencia fisiopatológica entre ambos', 'El fenotipo hemorrágico se debe solo a trombocitopenia', 'El fenotipo trombótico solo afecta a venas grandes, nunca a la microcirculación'],
        correcta: 0,
        explicacion: 'El fenotipo trombótico se caracteriza por depósito de fibrina y microtrombosis con fallo orgánico secundario, mientras que el fenotipo hemorrágico se debe al consumo de plaquetas y factores de coagulación con rotura de la barrera hemostática.',
    },

    // ---- PTT ----
    {
        id: 'sind-q006',
        tema: 'sind-ptt',
        enunciado: '¿Qué nivel de actividad de ADAMTS-13 define el déficit grave causante de la PTT?',
        opciones: ['<10% de la normalidad (<10 UI/dL)', '<50% de la normalidad', '<80% de la normalidad', 'El nivel de ADAMTS-13 no se usa para el diagnóstico'],
        correcta: 0,
        explicacion: 'La PTT está causada por un déficit grave de actividad de ADAMTS-13, definido como <10% de la normalidad (<10 UI/dL) — la metaloproteasa que fragmenta el factor von Willebrand ultra-largo.',
    },
    {
        id: 'sind-q007',
        tema: 'sind-ptt',
        enunciado: '¿En qué porcentaje de los casos está presente la péntada clásica de Raynaud (fiebre, anemia hemolítica microangiopática, trombocitopenia, alteración neurológica y renal) en la PTT?',
        opciones: ['Solo en el 40% de los casos — no debe exigirse para sospechar PTT', 'En el 100% de los casos, es obligatoria para el diagnóstico', 'Nunca está presente en la PTT', 'Solo en la PTT congénita'],
        correcta: 0,
        explicacion: 'La péntada de Raynaud solo está presente en el 40% de los casos de PTT — la app avisa explícitamente de que no debe exigirse su presencia completa para sospechar el diagnóstico.',
    },
    {
        id: 'sind-q008',
        tema: 'sind-ptt',
        enunciado: '¿Qué diferencia a la PTTi de la PTTc (Upshaw-Schulman)?',
        opciones: ['PTTi es autoinmune (anticuerpos anti-ADAMTS-13); PTTc es congénita, por déficit genético de ADAMTS-13', 'PTTi es congénita y PTTc es autoinmune', 'No hay diferencia, son sinónimos', 'PTTc solo se da en el embarazo'],
        correcta: 0,
        explicacion: 'La PTT inmune (PTTi) está causada por autoanticuerpos frente a ADAMTS-13, mientras que la PTT congénita (PTTc, síndrome de Upshaw-Schulman) se debe a un déficit genético de la enzima.',
    },
    {
        id: 'sind-q009',
        tema: 'sind-ptt',
        enunciado: '¿Qué fármaco con aviso de riesgo hemorrágico se usa en el manejo agudo de la PTT junto al recambio plasmático (TPE)?',
        opciones: ['Caplacizumab', 'Rasburicasa', 'Eculizumab', 'Rituximab en monoterapia sin TPE'],
        correcta: 0,
        explicacion: 'El caplacizumab se usa en el manejo agudo de la PTT junto al TPE y corticoides, con un aviso explícito de riesgo hemorrágico asociado a su uso.',
    },
    {
        id: 'sind-q010',
        tema: 'sind-ptt',
        enunciado: '¿Qué 2 calculadoras interactivas de riesgo pretest incluye la app para orientar el diagnóstico de PTT antes de conocer la actividad de ADAMTS-13?',
        opciones: ['French score y PLASMIC score', 'MASCC e Índice CISNE', 'SOFA y qSOFA', 'Glasgow y APACHE'],
        correcta: 0,
        explicacion: 'La app incluye el French score (Coppo et al. 2010) y el PLASMIC score (Bendapudi et al. 2017) como calculadoras interactivas para estimar la probabilidad de un déficit grave de ADAMTS-13 antes de tener el resultado de laboratorio.',
    },

    // ---- SLT ----
    {
        id: 'sind-q011',
        tema: 'sind-slt',
        enunciado: 'Según los criterios de Cairo-Bishop, ¿cuántos de los 4 criterios de laboratorio se necesitan para el diagnóstico de SLT de laboratorio?',
        opciones: ['≥2 de los 4 criterios', 'Los 4 criterios simultáneamente', 'Solo 1 criterio es suficiente', 'No hay criterios de laboratorio, solo clínicos'],
        correcta: 0,
        explicacion: 'El SLT de laboratorio requiere ≥2 de los 4 criterios de Cairo-Bishop (hiperuricemia, hiperpotasemia, hiperfosfatemia, hipocalcemia). El SLT clínico añade además ≥1 criterio clínico al de laboratorio.',
    },
    {
        id: 'sind-q012',
        tema: 'sind-slt',
        enunciado: '¿Qué enzima inhiben el alopurinol y el febuxostat en el catabolismo de las purinas?',
        opciones: ['La xantina oxidasa', 'La urato oxidasa', 'La anhidrasa carbónica', 'La lactato deshidrogenasa'],
        correcta: 0,
        explicacion: 'Alopurinol y febuxostat inhiben la xantina oxidasa, reduciendo la formación de ácido úrico. La rasburicasa, en cambio, actúa como urato oxidasa, degradando el ácido úrico ya formado.',
    },
    {
        id: 'sind-q013',
        tema: 'sind-slt',
        enunciado: '¿Qué motivó la actualización 2025 de la guía BSH de SLT, según se documenta explícitamente en la app?',
        opciones: ['Un análisis de incidentes del NHSE sobre seguridad del paciente relacionados con la disponibilidad de rasburicasa', 'Un nuevo fármaco urato-oxidasa sustituto de la rasburicasa', 'La retirada del alopurinol del mercado', 'Un cambio en los criterios diagnósticos de Cairo-Bishop'],
        correcta: 0,
        explicacion: 'La actualización 2025 de la guía BSH está motivada, entre otros factores, por un análisis de incidentes del NHSE (National Health Service England) centrado en la seguridad del paciente en relación con la disponibilidad de rasburicasa.',
    },
    {
        id: 'sind-q014',
        tema: 'sind-slt',
        enunciado: '¿Qué determina el selector interactivo de riesgo de SLT de la app?',
        opciones: ['El riesgo combinando enfermedad, estadio y tipo de tratamiento (17 combinaciones de la Tabla 2 del artículo)', 'Solo el tipo de tumor sólido', 'Únicamente la edad del paciente', 'El riesgo se calcula solo con la creatinina basal'],
        correcta: 0,
        explicacion: 'El selector interactivo de riesgo de la app aplana las 17 combinaciones de la Tabla 2 del artículo (enfermedad, estadio y tipo de tratamiento) para estratificar el riesgo de SLT.',
    },
    {
        id: 'sind-q015',
        tema: 'sind-slt',
        enunciado: '¿Cuál es la piedra angular de la profilaxis del SLT en pacientes de riesgo?',
        opciones: ['La hidratación adecuada', 'La transfusión profiláctica de plaquetas', 'La anticoagulación profiláctica', 'La ventilación mecánica precoz'],
        correcta: 0,
        explicacion: 'La hidratación es la piedra angular de la profilaxis del SLT, junto con el debulking de la enfermedad cuando es posible, la educación del paciente, evitar nefrotóxicos y la monitorización estrecha.',
    },
];
