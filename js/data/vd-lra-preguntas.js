// Banco de preguntas de repaso — "Disfunción del ventrículo derecho y
// lesión renal postoperatoria" (UCI/Papers Tuiter). A petición explícita
// del usuario, los papers de este apartado llevan un banco deliberadamente
// pequeño: 8-10 preguntas de opción múltiple + 3-4 preguntas "de
// redactar" (sin opciones — el usuario escribe su propia respuesta, ve la
// respuesta modelo, y se autoevalúa; ver core del motor en quiz.js). Mismo
// formato de tema/etiqueta que el resto de bancos de la app. Fuente:
// Siegman A, Sidhu PS, Li D. Right Heart Dysfunction and Postoperative
// Renal Injury: Venous Congestion, Renal Perfusion Pressure, and
// Perioperative Implications. Curr Anesthesiol Rep. 2026;16:10.
export const temasVdLra = [
    { key: 'vdlra-intro', etiqueta: 'Introducción: el modelo cardiorrenal' },
    { key: 'vdlra-fisiologia', etiqueta: 'Fisiología del VD y su relevancia renal' },
    { key: 'vdlra-hemodinamica', etiqueta: 'Hemodinámica renal: la presión venosa' },
    { key: 'vdlra-evidencia-humana', etiqueta: 'Evidencia clínica en humanos' },
    { key: 'vdlra-cirugia-cardiaca', etiqueta: 'Evidencia en cirugía cardiaca' },
    { key: 'vdlra-implicaciones', etiqueta: 'Implicaciones perioperatorias' },
    { key: 'vdlra-conclusiones', etiqueta: 'Conclusiones y referencias clave' },
];

export const preguntasVdLra = [
    // ---- Opción múltiple (9) ----
    {
        id: 'vdlra-q001',
        tema: 'vdlra-intro',
        enunciado: '¿Qué tipo de síndrome cardiorrenal (SCR) representa la disfunción perioperatoria del corazón derecho, según la clasificación de Ronco et al.?',
        opciones: ['SCR tipo 1 (disfunción cardíaca aguda que precipita LRA)', 'SCR tipo 2 exclusivamente', 'SCR tipo 5 exclusivamente', 'Ningún tipo de SCR se aplica al contexto perioperatorio'],
        correcta: 0,
        explicacion: 'El SCR tipo 1, definido como disfunción cardíaca aguda que precipita LRA, es precisamente el escenario que representa la disfunción perioperatoria del corazón derecho.',
    },
    {
        id: 'vdlra-q002',
        tema: 'vdlra-fisiologia',
        enunciado: '¿Cuáles son las dos vías interdependientes por las que la disfunción del VD amenaza al riñón?',
        opciones: ['Reducción del gasto anterógrado y congestión venosa', 'Solo la vasoconstricción coronaria', 'Solo la fibrilación auricular', 'Solo el edema pulmonar'],
        correcta: 0,
        explicacion: 'La disfunción del VD amenaza al riñón a través de dos vías interdependientes: la reducción del gasto anterógrado (hipoperfusión) y la congestión venosa (presión venosa renal elevada), amplificadas ambas por la interdependencia ventricular.',
    },
    {
        id: 'vdlra-q003',
        tema: 'vdlra-fisiologia',
        enunciado: '¿Qué distingue la "disfunción" del VD del "fallo" del VD?',
        opciones: ['La disfunción es estructura/función alterada sin fallo clínico; el fallo implica descompensación hemodinámica con congestión orgánica', 'Son términos exactamente sinónimos', 'La disfunción es siempre más grave que el fallo', 'El fallo del VD nunca afecta al riñón'],
        correcta: 0,
        explicacion: 'La disfunción del VD se refiere a una estructura o función alterada sin fallo clínico, mientras que el fallo implica descompensación hemodinámica con congestión orgánica, incluida la renal — la disfunción subclínica puede generar congestión renal relevante antes del fallo evidente.',
    },
    {
        id: 'vdlra-q004',
        tema: 'vdlra-hemodinamica',
        enunciado: 'Según el modelo de Guazzi et al., ¿qué ocurre con la TFG cuando la presión de perfusión renal (RPP) cae por debajo del umbral autorregulatorio de ~80 mmHg?',
        opciones: ['Se vuelve directamente dependiente de la presión, y pequeñas reducciones adicionales producen pérdida de filtración desproporcionada', 'No cambia en absoluto', 'Aumenta de forma compensatoria', 'Se vuelve completamente independiente de la presión'],
        correcta: 0,
        explicacion: 'Cuando la RPP cae por debajo del umbral autorregulatorio de aproximadamente 80 mmHg, la TFG se vuelve directamente dependiente de la presión, y pequeñas reducciones adicionales producen una pérdida de filtración desproporcionada.',
    },
    {
        id: 'vdlra-q005',
        tema: 'vdlra-evidencia-humana',
        enunciado: 'En el estudio de Mullens et al., ¿qué variable predijo mejor el empeoramiento de la función renal: la PVC o el índice cardiaco?',
        opciones: ['La PVC (AUC 0,734), mientras que el índice cardiaco no fue predictivo (AUC 0,552)', 'El índice cardiaco (AUC 0,9), sin ningún valor predictivo de la PVC', 'Ambas variables tuvieron el mismo valor predictivo', 'Ninguna de las dos variables tuvo valor predictivo'],
        correcta: 0,
        explicacion: 'La PVC fue un predictor potente del empeoramiento renal (AUC 0,734, p<0,0001), con el 75% de los pacientes con PVC >24 mmHg desarrollando empeoramiento renal, mientras que el índice cardiaco no fue predictivo (AUC 0,552, p=0,6).',
    },
    {
        id: 'vdlra-q006',
        tema: 'vdlra-evidencia-humana',
        enunciado: 'En el estudio de Chen et al. en pacientes críticos, ¿qué combinación conllevó el mayor aumento de mortalidad hospitalaria?',
        opciones: ['LRA en el contexto de disfunción aislada del VD (7,85 veces más mortalidad)', 'LRA en el contexto de disfunción aislada del VI (7,85 veces más mortalidad)', 'La disfunción biventricular sin LRA', 'Ninguna combinación mostró aumento de mortalidad'],
        correcta: 0,
        explicacion: 'La LRA en el contexto de disfunción aislada del VD conllevó un aumento de mortalidad hospitalaria de 7,85 veces, muy por encima del aproximadamente 2 veces asociado a la disfunción aislada del VI con LRA.',
    },
    {
        id: 'vdlra-q007',
        tema: 'vdlra-cirugia-cardiaca',
        enunciado: 'En el estudio de Lopez et al., ¿qué momento de la congestión venosa intraoperatoria se correlacionó específicamente con biomarcadores de estrés tubular renal (TIMP-2·IGFBP7)?',
        opciones: ['La congestión venosa previa a la circulación extracorpórea (pre-bypass)', 'La congestión venosa posterior al alta de la UCI', 'La congestión venosa solo durante la inducción anestésica', 'No se encontró ninguna correlación temporal específica'],
        correcta: 0,
        explicacion: 'La congestión venosa previa a la CEC se correlacionó específicamente con niveles elevados de TIMP-2·IGFBP7, un biomarcador validado de estrés tubular renal precoz — sugiriendo que la disfunción del VD antes de la incisión puede iniciar una cascada de estrés renal que precede a la lesión inflamatoria de la CEC.',
    },
    {
        id: 'vdlra-q008',
        tema: 'vdlra-implicaciones',
        enunciado: '¿Qué debe hacerse ante una oliguria postoperatoria con PVC elevada y sospecha de fallo del VD, según la reorientación conceptual del artículo?',
        opciones: ['Priorizar la descongestión (diuresis o ultrafiltración) en vez de administrar más fluidos', 'Administrar un bolo de cristaloides de forma refleja', 'Aumentar la sedación sin evaluar la hemodinámica', 'Ignorar la PVC y centrarse solo en la presión arterial media'],
        correcta: 0,
        explicacion: 'La administración refleja de fluidos ante la oliguria puede ser directamente perjudicial cuando el mecanismo es la PVC elevada y la congestión del VD — el manejo correcto prioriza la descongestión (diuresis o ultrafiltración) y evita más carga de volumen.',
    },
    {
        id: 'vdlra-q009',
        tema: 'vdlra-conclusiones',
        enunciado: '¿Cuáles son los tres mecanismos hemodinámicos interdependientes que explican la relación entre disfunción del corazón derecho y lesión renal postoperatoria, según la conclusión del artículo?',
        opciones: ['Reducción del gasto pulmonar anterógrado, hipertensión venosa sistémica, y reducción del gradiente de presión de perfusión renal', 'Hipertensión arterial, taquicardia y fiebre', 'Anemia, trombocitopenia y coagulopatía', 'Hiperglucemia, hipotermia y acidosis respiratoria'],
        correcta: 0,
        explicacion: 'La relación se entiende mejor a través de tres mecanismos interdependientes: la reducción del gasto pulmonar anterógrado, la hipertensión venosa sistémica, y la reducción del gradiente de presión de perfusión renal — operando de forma independiente y aditiva a los mecanismos isquémicos clásicos.',
    },

    // ---- De redactar (4) ----
    {
        id: 'vdlra-q010',
        tema: 'vdlra-fisiologia',
        tipo: 'redactar',
        enunciado: 'Explica con tus propias palabras qué es la "interdependencia ventricular" y por qué amplifica tanto la vía congestiva como la vía de fallo anterógrado en la disfunción del VD.',
        respuestaModelo: 'La interdependencia ventricular es el fenómeno por el cual la función de un ventrículo influye directamente en la del otro, principalmente a través del tabique interventricular compartido y el pericardio. Cuando el VD se dilata agudamente (p. ej. por sobrecarga de presión o volumen), el tabique se desplaza hacia la izquierda, aumentando la constricción pericárdica sobre el VI. Esto deteriora el llenado diastólico del VI, reduciendo su precarga y, por tanto, el gasto cardiaco sistémico — amplificando la vía de fallo anterógrado. Al mismo tiempo, este mismo mecanismo empeora indirectamente la vía congestiva: al caer el gasto sistémico, se activan los sistemas RAAS y simpático, promoviendo retención de sodio y agua, lo que aumenta aún más la precarga y la poscarga del VD, cerrando un círculo vicioso que agrava ambas vías simultáneamente.',
    },
    {
        id: 'vdlra-q011',
        tema: 'vdlra-hemodinamica',
        tipo: 'redactar',
        enunciado: 'Un paciente postoperatorio tiene una PAM de 70 mmHg y una PVC de 20 mmHg. Calcula la presión de perfusión renal (RPP) e interpreta el resultado a la luz del umbral autorregulatorio renal.',
        respuestaModelo: 'RPP = PAM − PVC = 70 − 20 = 50 mmHg. Este valor está claramente por debajo del umbral autorregulatorio renal de aproximadamente 80 mmHg, lo que significa que la TFG ya es directamente dependiente de la presión y vulnerable a nuevas caídas. Es clínicamente relevante porque la PAM de 70 mmHg, por sí sola, parece "aceptable" o incluso normal según los objetivos perioperatorios estándar — dando una falsa sensación de seguridad. Sin tener en cuenta la PVC elevada, un clínico podría no reconocer que el riñón de este paciente está, de hecho, en riesgo de lesión congestiva por baja presión de perfusión, y podría interpretar erróneamente una oliguria asociada como hipovolemia, administrando fluidos que empeorarían aún más la PVC y la RPP.',
    },
    {
        id: 'vdlra-q012',
        tema: 'vdlra-evidencia-humana',
        tipo: 'redactar',
        enunciado: 'Resume, en 2-3 frases, por qué el hallazgo de Mullens et al. (PVC como predictor y no el índice cardiaco) desafía el enfoque clásico de la oliguria perioperatoria como hipovolemia.',
        respuestaModelo: 'El enfoque clásico asume que la oliguria refleja bajo flujo sanguíneo renal (hipoperfusión arterial), lo que llevaría lógicamente a tratarla con más fluidos o mejorando el gasto cardiaco. Sin embargo, Mullens et al. mostraron que la PVC (una medida de congestión venosa, no de flujo arterial) predice mucho mejor el deterioro renal que el índice cardiaco, y que la RPP fue similar entre quienes desarrollaron y no desarrollaron lesión renal — es decir, la lesión no estaba explicada por menor perfusión arterial. Esto sugiere que en muchos pacientes la oliguria refleja congestión venosa renal, no depleción de volumen, y que tratarla con más fluidos (asumiendo hipovolemia) sería contraproducente.',
    },
    {
        id: 'vdlra-q013',
        tema: 'vdlra-implicaciones',
        tipo: 'redactar',
        enunciado: 'Describe qué herramienta de monitorización postoperatoria propone el artículo para fenotipificar la congestión venosa a pie de cama, y qué estructuras evalúa.',
        respuestaModelo: 'La herramienta es el Venous Excess Ultrasound (VExUS), un sistema de gradación validado por Beaubien-Souligny et al. Evalúa mediante ecografía Doppler a pie de cama: el diámetro de la vena cava inferior (VCI, con el grado más alto definido por VCI ≥2 cm), el patrón de flujo de la vena hepática, el patrón de flujo de la vena porta, y el patrón de flujo de la vena intrarrenal — buscando anomalías Doppler que reflejen congestión venosa retrógrada en cada uno de estos lechos. El grado VExUS más alto se asoció a un riesgo de LRA 3,69 veces mayor y superó a las mediciones aisladas de PVC en capacidad predictiva, ofreciendo una alternativa no invasiva y repetible a la monitorización invasiva de la PVC.',
    },
];
