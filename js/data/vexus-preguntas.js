// Banco de preguntas de repaso — "VExUS: ecografía de la congestión venosa"
// (UCI/Papers Tuiter). Mismo banco deliberadamente pequeño que el resto de
// papers de este apartado: ~10 preguntas de opción múltiple + 3-4 "de
// redactar" (ver core del motor en quiz.js) — aquí repartidas entre las 6
// fichas, con al menos 1 pregunta por tema (regla dura del proyecto: un
// tema con 0 preguntas rompe el selector del quiz). Fuentes: Mullens W, et
// al. J Am Coll Cardiol. 2009;53(7):589-96; Beaubien-Souligny W, et al.
// Ultrasound J. 2020;12:16; Rola P, et al. Ultrasound J. 2021;13:32.
export const temasVexus = [
    { key: 'vexus-intro', etiqueta: 'Introducción: el riñón congestivo' },
    { key: 'vexus-mullens', etiqueta: 'Mullens et al. 2009' },
    { key: 'vexus-fisiologia-doppler', etiqueta: 'Fisiología del Doppler venoso' },
    { key: 'vexus-score', etiqueta: 'Desarrollo del score VExUS' },
    { key: 'vexus-casos', etiqueta: 'Aplicación clínica: 5 casos' },
    { key: 'vexus-integracion', etiqueta: 'Dónde más aparece en la app' },
];

export const preguntasVexus = [
    // ---- Opción múltiple (10) ----
    {
        id: 'vexus-q001',
        tema: 'vexus-intro',
        enunciado: 'Según el experimento de Winton (1931) en el riñón aislado de mamífero, ¿qué tuvo mayor impacto sobre el gasto urinario?',
        opciones: ['Elevar la presión venosa', 'Reducir la presión arterial en una magnitud equivalente', 'Ambas alteraciones tuvieron el mismo impacto', 'Ninguna de las dos alteró el gasto urinario'],
        correcta: 0,
        explicacion: 'Winton observó que el impacto de elevar la presión venosa sobre el gasto urinario era mayor que el de una caída equivalente de la presión arterial — la base fisiológica, casi centenaria, de todo lo que desarrollan las 3 fuentes de este bloque.',
    },
    {
        id: 'vexus-q002',
        tema: 'vexus-mullens',
        enunciado: 'En el estudio de Mullens et al. (2009), ¿qué porcentaje de pacientes con PVC basal >24 mmHg desarrolló empeoramiento de la función renal (WRF)?',
        opciones: ['75%', '40%', '8%', '100%'],
        correcta: 0,
        explicacion: 'Hubo un riesgo incremental casi lineal con la PVC: 8% con PVC <8 mmHg, hasta 75% con PVC >24 mmHg — frente a la incidencia global de WRF del 40% en toda la cohorte.',
    },
    {
        id: 'vexus-q003',
        tema: 'vexus-mullens',
        enunciado: '¿Qué mostraron las curvas ROC de Mullens et al. al comparar la PVC y el índice cardíaco (CI) como predictores de WRF?',
        opciones: ['La PVC predijo WRF (AUC 0,734) y el CI no lo hizo (AUC 0,552)', 'El CI predijo mejor que la PVC', 'Ambas variables predijeron igual de bien', 'Ninguna de las dos variables tuvo capacidad predictiva'],
        correcta: 0,
        explicacion: 'La diferencia entre ambas curvas fue estadísticamente significativa (p = 0,012) — el hallazgo central del estudio, que desplazó el foco del "bajo gasto" a la congestión venosa.',
    },
    {
        id: 'vexus-q004',
        tema: 'vexus-fisiologia-doppler',
        enunciado: '¿Qué patrón de la onda Doppler de la vena hepática se considera una anomalía grave?',
        opciones: ['Reversión de la fase sistólica (S)', 'Ausencia de la fase diastólica (D)', 'Ausencia de la onda A', 'Flujo puramente anterógrado sin variación'],
        correcta: 0,
        explicacion: 'La anomalía leve es S<D (aún anterógrada); la anomalía grave es la reversión completa de la fase sistólica, cuando la presión auricular derecha supera con fuerza a la presión venosa.',
    },
    {
        id: 'vexus-q005',
        tema: 'vexus-fisiologia-doppler',
        enunciado: '¿Por qué la vena porta puede NO mostrar pulsatilidad pese a una congestión venosa grave en un paciente cirrótico?',
        opciones: ['La rigidez del parénquima hepático amortigua la transmisión de presión desde la aurícula derecha', 'La cirrosis aumenta siempre el flujo hepatópeto', 'El hígado cirrótico deja de recibir sangre venosa sistémica', 'La vena porta se oblitera por completo en la cirrosis'],
        correcta: 0,
        explicacion: 'Es una de las trampas de interpretación reconocidas explícitamente por los autores: en el hígado cirrótico, la transmisión de presión desde la aurícula derecha a través de los sinusoides está amortiguada por la rigidez del parénquima.',
    },
    {
        id: 'vexus-q006',
        tema: 'vexus-score',
        enunciado: '¿Qué exige el sistema de gradación VExUS "C" (el que se usa hoy como VExUS) para el grado 3, congestión grave?',
        opciones: ['VCI ≥2 cm y anomalías Doppler graves en al menos 2 de los 3 lechos venosos', 'Solo una VCI ≥2 cm', 'Una anomalía grave en cualquier lecho venoso aislado', 'Una PVC invasiva >12 mmHg'],
        correcta: 0,
        explicacion: 'Es más exigente que los sistemas A y B (que permiten grado 3 con un solo lecho afectado) — y fue precisamente esta exigencia de ≥2 lechos la que le dio la asociación más fuerte con LRA postoperatoria (HR 3,69).',
    },
    {
        id: 'vexus-q007',
        tema: 'vexus-score',
        enunciado: '¿Cuál fue la razón de verosimilitud positiva (+LR) del grado 3 de VExUS C, evaluado al ingreso en UCI, para predecir LRA postoperatoria?',
        opciones: ['6,37', '1,91', '0,74', '3,69'],
        correcta: 0,
        explicacion: '6,37 (IC 2,19-18,5) — la más alta de todos los sistemas y variables individuales estudiadas, superando incluso al corte de PVC ≥12 mmHg (+LR 1,91).',
    },
    {
        id: 'vexus-q008',
        tema: 'vexus-casos',
        enunciado: 'En el Caso 2 de la serie de Rola et al. (el paciente derivado a cirugía por sospecha de colecistitis), ¿cuál era la causa real del hallazgo ecográfico en la vesícula?',
        opciones: ['Congestión hepática por insuficiencia cardíaca grave no diagnosticada (FEVI <10%)', 'Colecistitis alitiásica confirmada', 'Litiasis biliar complicada', 'Perforación vesicular'],
        correcta: 0,
        explicacion: 'El engrosamiento de la pared vesicular y el líquido pericolecístico eran edema por congestión hepática, no colecistitis — el VExUS evitó una cirugía innecesaria en un paciente con insuficiencia cardíaca grave sin diagnosticar.',
    },
    {
        id: 'vexus-q009',
        tema: 'vexus-casos',
        enunciado: 'En el Caso 5 (choque obstétrico), ¿qué llevó a error inicialmente al equipo tratante sobre el estado de volumen de la paciente?',
        opciones: ['Una variación del volumen sistólico (VVS) del 23% en el monitor de gasto cardíaco continuo, interpretada como "respuesta a fluidos"', 'Un grado VExUS 0 mal interpretado como congestión', 'Una PVC falsamente baja', 'Una VCI colapsada sin respiración'],
        correcta: 0,
        explicacion: 'El monitor de gasto cardíaco continuo sugería hipovolemia, cuando la causa real era disfunción aguda del ventrículo derecho por TEP más sobrecarga de volumen — el VExUS lo reveló y motivó ultrafiltración de urgencia en vez de más fluidos.',
    },
    {
        id: 'vexus-q010',
        tema: 'vexus-integracion',
        enunciado: '¿En qué ficha de FRA (módulo Nefrología) se menciona el VExUS, dentro de qué contexto clínico?',
        opciones: ['"Subfenotipos II: cardíaca, hepática, embarazo y obstructiva" — síndrome cardiorrenal tipo I', '"Concepto, definición y estadificación" — clasificación KDIGO', '"Tratamiento renal sustitutivo" — indicaciones de TRR', '"Predicción y prevención" — biomarcadores'],
        correcta: 0,
        explicacion: 'La Ficha de Subfenotipos II menciona que la ecocardiografía y el VExUS permiten dirigir la terapia de descongestión en el síndrome cardiorrenal tipo I — esta ficha nueva desarrolla el score completo al que remite esa mención.',
    },

    // ---- De redactar (4) ----
    {
        id: 'vexus-q011',
        tema: 'vexus-intro',
        tipo: 'redactar',
        enunciado: 'Explica por qué la verdadera presión de perfusión de un órgano no equivale simplemente a la presión arterial media (MAP) menos la presión venosa central (PVC).',
        respuestaModelo: 'Porque la perfusión real depende del gradiente entre la presión arteriolar precapilar y la presión venular postcapilar, no de la MAP y la PVC directamente. Aunque la MAP suele estar por encima de 90 mmHg, la presión arteriolar precapilar real puede estar en el rango de 35-40 mmHg — un gradiente mucho más estrecho del que sugiere mirar solo la MAP. Esto implica que un aumento de la presión venosa (PVC) reduce ese gradiente estrecho de forma proporcionalmente mucho mayor de lo que una lectura superficial de "MAP menos PVC" haría pensar, explicando por qué la congestión venosa tiene un impacto tan grande sobre la perfusión orgánica.',
    },
    {
        id: 'vexus-q012',
        tema: 'vexus-mullens',
        tipo: 'redactar',
        enunciado: 'Resume, en 2-3 frases, por qué el concepto de "riñón congestivo" que propone Mullens et al. desafía el abordaje clásico de la oliguria en la insuficiencia cardíaca descompensada.',
        respuestaModelo: 'El abordaje clásico asume que la oliguria en la insuficiencia cardíaca refleja bajo gasto cardíaco/hipoperfusión renal, lo que lógicamente llevaría a intentar mejorar el flujo anterógrado (inotrópicos, más precarga). Sin embargo, Mullens et al. mostraron que la PVC —no el índice cardíaco— fue el predictor hemodinámico más fuerte del empeoramiento renal, y que la TFG dependía de la PVC con independencia del índice cardíaco. Esto sugiere que en muchos pacientes la disfunción renal refleja congestión venosa retrógrada, no bajo flujo arterial — y que el tratamiento correcto pasa por descongestionar (diuréticos/ultrafiltración), no por intentar aumentar el gasto cardíaco.',
    },
    {
        id: 'vexus-q013',
        tema: 'vexus-score',
        tipo: 'redactar',
        enunciado: '¿Por qué la dilatación aislada de la vena cava inferior (VCI) no basta para diagnosticar congestión venosa clínicamente significativa, según el estudio de Beaubien-Souligny et al.?',
        respuestaModelo: 'Porque en el estudio, la dilatación aislada de la VCI (sin combinarla con el Doppler de vena hepática/porta/intrarrenal) tuvo un rendimiento diagnóstico pobre para predecir LRA postoperatoria — con una especificidad de solo el 41%, es decir, muchos pacientes con VCI dilatada no tenían realmente congestión clínicamente relevante (falsos positivos). La VCI puede estar dilatada por otros motivos (remodelado crónico en hipertensión pulmonar, por ejemplo) sin que exista congestión aguda real. Por eso el score VExUS combina la VCI con el Doppler de al menos 2 de 3 lechos venosos (hepático, porta, intrarrenal) — la combinación de marcadores, no un hallazgo aislado, es lo que da valor diagnóstico real.',
    },
    {
        id: 'vexus-q014',
        tema: 'vexus-casos',
        tipo: 'redactar',
        enunciado: 'Según Rola et al., ¿para qué decisión clínica parece más útil el VExUS — decidir si dar volumen, o decidir si retirarlo? Justifica con lo que muestran los 5 casos.',
        respuestaModelo: 'El VExUS parece más útil para identificar qué pacientes toleran, o incluso se benefician de, la retirada activa de volumen (diuréticos/ultrafiltración) — no tanto para decidir si administrar más fluidos. En los 5 casos de la serie, el hallazgo de un VExUS elevado (grado 2-3) llevó de forma consistente a estrategias de descongestión (drenaje de ascitis, furosemida en dosis altas, ultrafiltración) que mejoraron la función renal o el estado hemodinámico — incluso en escenarios donde el juicio clínico inicial (o un monitor de gasto cardíaco continuo, como en el Caso 5) sugería erróneamente hipovolemia o bajo flujo. Los propios autores señalan explícitamente esta limitación: VExUS no informa bien sobre la necesidad de dar volumen.',
    },
];
