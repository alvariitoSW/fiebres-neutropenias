// Banco de preguntas de repaso — "Toxicidad sistémica por citrato en TRR
// continua" (UCI/Papers Tuiter). Banco estándar reducido (~10 opción
// múltiple + ~4 de redactar), repartido entre las 5 fichas con al menos 1
// pregunta por tema (regla dura del proyecto). Fuente: Redant S, Attou R,
// Talpos MT, Honoré PM. J Clin Med. 2026;15:6564.
export const temasCitratoTrr = [
    { key: 'citrato-fisiologia', etiqueta: 'Fisiología del citrato y su balance' },
    { key: 'citrato-riesgo-perfil', etiqueta: 'Factores de riesgo y perfil bioquímico' },
    { key: 'citrato-diagnostico', etiqueta: 'Diagnóstico y monitorización' },
    { key: 'citrato-manejo', etiqueta: 'Manejo escalonado y controversias' },
    { key: 'citrato-conclusiones', etiqueta: 'Marco integrado y dónde más aparece' },
];

export const preguntasCitratoTrr = [
    // ---- Opción múltiple (10) ----
    {
        id: 'citrato-q001',
        tema: 'citrato-fisiologia',
        enunciado: '¿En qué órganos, además del hígado, se metaboliza de forma sustancial el citrato reinfundido?',
        opciones: ['Músculo esquelético y corteza renal', 'Bazo y páncreas', 'Solo en el propio circuito extracorpóreo', 'Pulmón y tiroides'],
        correcta: 0,
        explicacion: 'El citrato se metaboliza predominantemente en el hígado, pero también de forma sustancial en el músculo esquelético y la corteza renal — la base del cambio de paradigma que ya no atribuye la intolerancia al citrato solo a la disfunción hepática.',
    },
    {
        id: 'citrato-q002',
        tema: 'citrato-fisiologia',
        enunciado: '¿Qué rango se recomienda mantener para el calcio iónico postfiltro durante la RCA?',
        opciones: ['Aproximadamente 0,20-0,40 mmol/l', 'Aproximadamente 1,0-1,3 mmol/l', 'Por debajo de 0,10 mmol/l siempre que sea posible', 'No existe ningún rango recomendado'],
        correcta: 0,
        explicacion: 'Bajar el calcio iónico postfiltro innecesariamente por debajo de este rango aumenta el aporte de citrato sin mejorar la eficacia anticoagulante, incrementando potencialmente la exposición sistémica al citrato sin beneficio.',
    },
    {
        id: 'citrato-q003',
        tema: 'citrato-riesgo-perfil',
        enunciado: '¿Cuál es el factor de riesgo mayor más fuerte y consistente para la acumulación sistémica de citrato?',
        opciones: ['El shock circulatorio', 'La disfunción hepática aislada', 'La hipernatremia', 'El uso de citrato trisódico en vez de Prismocitrate'],
        correcta: 0,
        explicacion: 'El shock circulatorio compromete la fosforilación oxidativa mitocondrial y la actividad del ciclo TCA en múltiples órganos a la vez, reduciendo la capacidad global de metabolizar citrato — el determinante principal, por encima de la disfunción hepática aislada.',
    },
    {
        id: 'citrato-q004',
        tema: 'citrato-riesgo-perfil',
        enunciado: '¿Qué distingue a la "sobrecarga de citrato" (citrate overload) de la verdadera acumulación sistémica por metabolismo alterado?',
        opciones: ['En la sobrecarga la capacidad metabólica está intacta y las anomalías suelen resolverse rápido al ajustar el aporte/eliminación', 'La sobrecarga es siempre irreversible', 'La sobrecarga solo ocurre en pacientes con hepatopatía grave', 'No hay ninguna diferencia clínica relevante entre ambas'],
        correcta: 0,
        explicacion: 'En la sobrecarga (flujos altos, infusión excesiva, efluente insuficiente), la capacidad oxidativa está preservada — las anomalías suelen resolverse rápidamente al reducir el aporte o aumentar la eliminación extracorpórea, a diferencia de la acumulación por metabolismo verdaderamente alterado.',
    },
    {
        id: 'citrato-q005',
        tema: 'citrato-diagnostico',
        enunciado: '¿Cuál es la manifestación bioquímica más precoz y sensible de la acumulación sistémica de citrato?',
        opciones: ['La hipocalcemia iónica sistémica', 'La hipernatremia', 'La hiperpotasemia', 'El QT acortado en el ECG'],
        correcta: 0,
        explicacion: 'La hipocalcemia iónica sistémica es la manifestación bioquímica más precoz y sensible, resultado de la quelación progresiva del calcio circulante por el citrato no metabolizado.',
    },
    {
        id: 'citrato-q006',
        tema: 'citrato-diagnostico',
        enunciado: '¿Qué umbral de ratio T/iCa (calcio total/calcio iónico) se usa comúnmente como sugestivo de acumulación clínicamente significativa de citrato?',
        opciones: ['>2,5', '>1,0', '>10', 'No existe ningún umbral de referencia en la literatura'],
        correcta: 0,
        explicacion: 'Un ratio T/iCa >2,5 es el umbral más ampliamente aceptado, aunque debe interpretarse siempre junto al calcio iónico, los requerimientos de calcio, el estado ácido-base y su tendencia — nunca de forma aislada.',
    },
    {
        id: 'citrato-q007',
        tema: 'citrato-diagnostico',
        enunciado: 'Según la revisión, ¿qué papel debe darse al lactato en el diagnóstico de acumulación de citrato?',
        opciones: ['Marcador de perfusión tisular y reserva metabólica reducida, no diagnóstico directo', 'Marcador diagnóstico directo y suficiente por sí solo', 'No tiene ninguna relación con el metabolismo del citrato', 'Solo es útil si el paciente tiene hepatopatía'],
        correcta: 0,
        explicacion: 'El lactato acompaña frecuentemente al metabolismo alterado del citrato porque ambos comparten sustrato mitocondrial y dependencia de la perfusión tisular, pero carece de sensibilidad y especificidad suficientes para ser un marcador diagnóstico directo.',
    },
    {
        id: 'citrato-q008',
        tema: 'citrato-manejo',
        enunciado: 'Según el algoritmo de manejo en 8 pasos, ¿cuál es la primera prioridad terapéutica ante sospecha de acumulación de citrato?',
        opciones: ['Identificar y corregir la causa fisiológica subyacente (habitualmente shock/hipoperfusión)', 'Discontinuar inmediatamente la RCA', 'Administrar bicarbonato en dosis altas', 'Aumentar la infusión de citrato para "diluir" el problema'],
        correcta: 0,
        explicacion: 'La prioridad terapéutica inicial es identificar y corregir la disfunción fisiológica reversible (shock, hipoperfusión, hipoxemia grave) — la discontinuación de la RCA es el último escalón, no el primero.',
    },
    {
        id: 'citrato-q009',
        tema: 'citrato-manejo',
        enunciado: '¿Por qué la reposición de calcio nunca debe considerarse tratamiento definitivo de la acumulación de citrato?',
        opciones: ['Corrige la hipocalcemia sin reducir la carga de citrato subyacente', 'Empeora siempre la acidosis metabólica', 'Está contraindicada en la RCA', 'Aumenta directamente la eliminación extracorpórea de citrato'],
        correcta: 0,
        explicacion: 'La reposición de calcio es un soporte esencial que restaura el calcio circulante, pero no actúa sobre la causa (el desequilibrio aporte-eliminación de citrato) — su normalización tras calcio no indica resolución de la acumulación.',
    },
    {
        id: 'citrato-q010',
        tema: 'citrato-conclusiones',
        enunciado: '¿Cuál de estos NO es uno de los 3 mensajes prácticos centrales de la revisión?',
        opciones: ['Discontinuar la RCA ante la primera anomalía bioquímica detectada, sin excepción', 'Evaluar el riesgo más allá del paradigma hepatocéntrico clásico', 'Diagnosticar mediante tendencias bioquímicas seriadas integradas', 'Tratar restaurando el balance aporte-eliminación, corrigiendo primero lo reversible'],
        correcta: 0,
        explicacion: 'Justo lo contrario: la revisión defiende que discontinuar ante la primera anomalía aislada puede privar innecesariamente al paciente de los beneficios de la RCA, porque muchos episodios son reversibles corrigiendo la causa fisiológica subyacente.',
    },

    // ---- De redactar (4) ----
    {
        id: 'citrato-q011',
        tema: 'citrato-fisiologia',
        tipo: 'redactar',
        enunciado: 'Explica el cambio de paradigma que propone esta revisión sobre qué determina realmente la intolerancia al citrato, frente a la visión tradicional centrada en el hígado.',
        respuestaModelo: 'La visión tradicional consideraba la disfunción hepática como el determinante principal de la intolerancia al citrato, porque se asumía que el hígado era el sitio casi exclusivo de su metabolismo. La revisión desplaza este marco: el citrato se metaboliza también de forma sustancial en el músculo esquelético y la corteza renal, y su aclaramiento depende sobre todo de la capacidad oxidativa mitocondrial preservada a través de estos órganos, no de la función hepática aislada. Por eso el determinante real de la acumulación sistémica es el desequilibrio entre el aporte de citrato y la capacidad metabólica+extracorpórea combinada para eliminarlo — y el shock circulatorio (que compromete esa capacidad oxidativa en todos los órganos a la vez) resulta ser un predictor mucho más fuerte que la disfunción hepática aislada.',
    },
    {
        id: 'citrato-q012',
        tema: 'citrato-riesgo-perfil',
        tipo: 'redactar',
        enunciado: 'Un paciente con cirrosis hepática estable (Child-Pugh A) sin signos de shock va a iniciar TRR continua. Según la evidencia de esta revisión, ¿es la hepatopatía por sí sola motivo para evitar la RCA? Razona tu respuesta.',
        respuestaModelo: 'No necesariamente. La revisión es explícita en que la disfunción hepática ya no debe considerarse una contraindicación absoluta a la RCA. Muchos pacientes con hepatopatía crónica estable mantienen un aclaramiento adecuado de citrato siempre que se preserve la perfusión tisular y la función mitocondrial global — precisamente porque el músculo esquelético y la corteza renal pueden compensar parte de la carga metabólica que antes se asumía exclusivamente hepática. Lo que determina el riesgo real es la interacción entre función hepática, estado circulatorio y reserva metabólica global, no la hepatopatía aislada. Por tanto, en este paciente estable y sin shock, la RCA puede considerarse razonablemente, siempre con la monitorización bioquímica rigurosa que la revisión recomienda para cualquier paciente en RCA.',
    },
    {
        id: 'citrato-q013',
        tema: 'citrato-diagnostico',
        tipo: 'redactar',
        enunciado: '¿Por qué el ratio T/iCa nunca debe interpretarse de forma aislada, aunque sea el marcador surrogado más aceptado de acumulación de citrato?',
        respuestaModelo: 'Porque su rendimiento diagnóstico está influido por varios factores que pueden alterarlo sin que exista una verdadera acumulación de citrato: la hipoalbuminemia (que afecta la fracción de calcio unida a proteínas), variaciones en la concentración de calcio total, diferencias metodológicas de laboratorio, y la propia naturaleza dinámica del metabolismo del citrato. Un ratio T/iCa levemente elevado en un paciente por lo demás estable no indica necesariamente acumulación clínicamente relevante que requiera discontinuar el citrato. Por eso las recomendaciones actuales insisten en integrar el ratio con el calcio iónico sistémico, los requerimientos de infusión de calcio, el estado ácido-base y, sobre todo, la tendencia de estos parámetros en el tiempo — las tendencias seriadas son generalmente más informativas que cualquier medición aislada.',
    },
    {
        id: 'citrato-q014',
        tema: 'citrato-manejo',
        tipo: 'redactar',
        enunciado: 'Enumera, en orden, al menos 4 de los 8 pasos del algoritmo de manejo de la acumulación de citrato, explicando por qué discontinuar la RCA es el último escalón y no el primero.',
        respuestaModelo: 'El algoritmo prioriza, en orden: (1) guiarse siempre por tendencias bioquímicas seriadas y el contexto clínico, nunca por una anomalía aislada; (2) identificar y corregir la causa subyacente, casi siempre un deterioro reversible del metabolismo oxidativo por shock o hipoperfusión; (3) optimizar la hemodinámica (fluidos, gasto cardíaco, soporte vasopresor/inotrópico); (4) reducir el aporte de citrato si persisten las alteraciones; (5) optimizar la eliminación extracorpórea aumentando la dosis de efluente; (6) reponer calcio como soporte; (7) corregir electrolitos y ácido-base asociados; y solo si todo lo anterior falla, (8) discontinuar la RCA. Discontinuar es el último paso porque la acumulación suele ser reversible al corregir la disfunción fisiológica subyacente, y la RCA aporta beneficios establecidos (mayor vida del circuito, menor riesgo hemorrágico) que se pierden innecesariamente si se abandona ante la primera anomalía bioquímica en vez de intentar primero restaurar el balance aporte-eliminación.',
    },
];
