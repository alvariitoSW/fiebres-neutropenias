// Banco de preguntas de repaso — "Guías PUMA de extubación traqueal"
// (UCI/Papers Tuiter). Banco estándar reducido (~10 opción múltiple + ~4
// de redactar), repartido entre las 7 fichas con al menos 1 pregunta por
// tema (regla dura del proyecto). Fuente: Ellard L, Higgs A, Cooper RM, et
// al. Project for Universal Management of Airways: guidelines for
// tracheal extubation. Anaesthesia. 2026.
export const temasExtubacionPuma = [
    { key: 'extub-intro', etiqueta: 'Introducción y evaluación del riesgo' },
    { key: 'extub-algoritmo', etiqueta: 'El algoritmo de extubación' },
    { key: 'extub-secuencia-protectora', etiqueta: 'Extubación de secuencia protectora' },
    { key: 'extub-catwe-checklist', etiqueta: 'Catéteres de intercambio y checklist' },
    { key: 'extub-secuencia-despierta', etiqueta: 'Secuencia de extubación despierta' },
    { key: 'extub-laringoespasmo', etiqueta: 'Laringoespasmo' },
    { key: 'extub-complicaciones', etiqueta: 'Complicaciones y conversión de vía aérea' },
];

export const preguntasExtubacionPuma = [
    // ---- Opción múltiple (10) ----
    {
        id: 'extub-q001',
        tema: 'extub-intro',
        enunciado: '¿Qué proporción aproximada de los resultados adversos graves de vía aérea del NAP4 se asoció a la extubación?',
        opciones: ['Un tercio', 'Menos del 5%', 'La mitad', 'Prácticamente ninguno'],
        correcta: 0,
        explicacion: 'Aproximadamente un tercio de los resultados graves documentados en el 4º Proyecto de Auditoría Nacional (NAP4) se asociaron a la extubación, con mayor probabilidad de causar lesión cerebral o muerte que los eventos de la intubación.',
    },
    {
        id: 'extub-q002',
        tema: 'extub-intro',
        enunciado: 'Según la Tabla 1 (precondiciones), ¿qué dominio incluye "sin cierre diferido de cavidades mayores (abdomen abierto, tórax abierto)"?',
        opciones: ['Quirúrgico', 'Respiratorio', 'Metabólico', 'Recursos'],
        correcta: 0,
        explicacion: 'El dominio quirúrgico incluye ausencia de reintubación inminente prevista y ausencia de cierre diferido de cavidades mayores, entre otras precondiciones.',
    },
    {
        id: 'extub-q003',
        tema: 'extub-algoritmo',
        enunciado: 'Según el algoritmo, si hay riesgo de reintubación difícil, mascarilla Y SGA están ambos "en riesgo", y diferir NO reduciría el riesgo, ¿qué estrategia se sugiere (asumiendo que no persiste riesgo de vía aérea time-crítica sin mejora esperable)?',
        opciones: ['Extubación despierta sobre catéter de intercambio de vía aérea', 'Manejo discrecional', 'Extubación profunda sin más precauciones', 'Diferir la extubación indefinidamente'],
        correcta: 0,
        explicacion: 'Cuando ambos lifelines superiores están "en riesgo" y diferir no ayuda, la estrategia recomendada busca el máximo margen de seguridad sin renunciar al lifeline traqueal: extubación despierta sobre catéter de intercambio (o traqueostomía si persiste riesgo time-crítico sin mejora esperable).',
    },
    {
        id: 'extub-q004',
        tema: 'extub-secuencia-protectora',
        enunciado: '¿Cuál es el objetivo de EtO₂ recomendado antes de extubar, como parte de la extensión del tiempo de apnea segura?',
        opciones: ['≥ 85%', '≥ 50%', '≥ 21% (aire ambiente)', 'No se especifica ningún objetivo'],
        correcta: 0,
        explicacion: 'La reoxigenación de la capacidad residual funcional hasta una concentración de oxígeno teleespiratorio ≥ 85% se recomienda antes de la extubación o conversión de vía aérea, para maximizar el tiempo de apnea segura.',
    },
    {
        id: 'extub-q005',
        tema: 'extub-catwe-checklist',
        enunciado: '¿Qué tasa de éxito global de reintubación traqueal se ha reportado usando un catéter de intercambio de vía aérea (AEC)?',
        opciones: ['92%', '50%', '14%', '99,9%'],
        correcta: 0,
        explicacion: 'Se han reportado tasas de éxito global de reintubación del 92% con AEC, frente a tasas de éxito al primer intento del 87% (vs. 14% sin AEC).',
    },
    {
        id: 'extub-q006',
        tema: 'extub-catwe-checklist',
        enunciado: '¿Por qué NO debe insuflarse oxígeno a través de un catéter de intercambio de vía aérea?',
        opciones: ['Riesgo inaceptable de barotrauma', 'El catéter no es compatible con oxígeno', 'Reduce la eficacia de la anticoagulación', 'Aumenta el riesgo de laringoespasmo'],
        correcta: 0,
        explicacion: 'Debido al riesgo inaceptable de barotrauma, no debe insuflarse oxígeno por el AEC — el oxígeno suplementario se aporta mediante mascarilla facial o gafas nasales.',
    },
    {
        id: 'extub-q007',
        tema: 'extub-secuencia-despierta',
        enunciado: '¿Por qué se recomienda evitar planos intermedios de consciencia al extubar?',
        opciones: ['Aumentan el riesgo de tos, laringoespasmo y broncoespasmo', 'Prolongan innecesariamente el tiempo de recuperación', 'Impiden completar el checklist de extubación', 'No tienen relación con el riesgo de complicaciones'],
        correcta: 0,
        explicacion: 'Los planos intermedios de consciencia se asocian a mayor riesgo de complicaciones (tos, esfuerzo, laringoespasmo, regurgitación) — por eso se recomienda extubar deliberadamente despierto (obedeciendo órdenes) o profundamente inconsciente.',
    },
    {
        id: 'extub-q008',
        tema: 'extub-laringoespasmo',
        enunciado: 'Si la obstrucción de vía aérea o la presión de ventilación elevada NO se resuelve tras una dosis de intubación de bloqueante neuromuscular, ¿qué se debe concluir?',
        opciones: ['Que no se debe a laringoespasmo y hay que buscar otra causa', 'Que se necesita una segunda dosis idéntica inmediatamente', 'Que el diagnóstico de laringoespasmo queda confirmado', 'Que debe administrarse atropina de inmediato'],
        correcta: 0,
        explicacion: 'Aviso explícito de la guía: la obstrucción o la presión de vía aérea elevada que no responde a una dosis de intubación de BNM no es laringoespasmo — deben buscarse otras causas (cuerpo extraño, broncoespasmo, colapso de tejidos, etc.).',
    },
    {
        id: 'extub-q009',
        tema: 'extub-laringoespasmo',
        enunciado: '¿Cuál es el manejo correcto de la bradicardia secundaria a hipoxemia durante una crisis de laringoespasmo?',
        opciones: ['Resolver la hipoxemia, no administrar atropina', 'Administrar atropina de inmediato en todos los casos', 'Iniciar compresiones torácicas sin más valoración', 'Aumentar la dosis de succinilcolina'],
        correcta: 0,
        explicacion: 'La guía distingue explícitamente: la bradicardia por hipoxemia se maneja resolviendo la hipoxemia, mientras que la atropina sí es apropiada para la bradicardia asociada al uso de succinilcolina.',
    },
    {
        id: 'extub-q010',
        tema: 'extub-complicaciones',
        enunciado: 'Si ocurre edema pulmonar por presión negativa (EPPN) tras morder el tubo, ¿cuál es el manejo correcto del líquido de edema?',
        opciones: ['Aplicar presión positiva a los pulmones, evitando la succión', 'Aspirar agresivamente el líquido de la vía aérea', 'Administrar diuréticos de asa a dosis altas', 'Colocar al paciente en Trendelenburg profundo y esperar'],
        correcta: 0,
        explicacion: 'La eliminación del líquido de edema se logra con presión positiva, no con succión (que aumenta la pérdida de fluido e interrumpe el aporte de O₂). Los diuréticos no son beneficiosos y pueden agravar la hipovolemia por la transferencia de fluido a los pulmones.',
    },

    // ---- De redactar (4) ----
    {
        id: 'extub-q011',
        tema: 'extub-intro',
        tipo: 'redactar',
        enunciado: 'Explica qué significa que un lifeline de vía aérea (mascarilla, SGA o tubo) se designe "en riesgo", y por qué esa designación se hace por separado para cada lifeline.',
        respuestaModelo: 'Un lifeline se designa "en riesgo" cuando no se espera que lograr "éxito de la vía aérea" (ventilación alveolar + SpO₂ adecuada) con él sea "rápido y fiable" — es decir, cuando hay dudas razonables sobre si ese dispositivo concreto funcionará sin dificultad si se necesita. Se evalúa por separado para cada lifeline porque el riesgo de vía aérea difícil no es uniforme: un paciente puede tener una mascarilla facial fácil pero una intubación traqueal muy difícil (o viceversa), y la estrategia de extubación depende precisamente de cuántos y cuáles lifelines están comprometidos a la vez — si ambos superiores (mascarilla y SGA) están "en riesgo", el margen de seguridad frente a la hipoxemia se reduce mucho más que si solo uno lo está.',
    },
    {
        id: 'extub-q012',
        tema: 'extub-algoritmo',
        tipo: 'redactar',
        enunciado: '¿Por qué la extubación planificada se considera "siempre electiva", y qué implicación práctica tiene esto para la estrategia?',
        respuestaModelo: 'Se considera siempre electiva porque, a diferencia de una emergencia de vía aérea, el equipo tiene control total sobre cuándo, dónde y con qué recursos se realiza — nada obliga a extubar en un momento concreto salvo la propia decisión clínica. La implicación práctica es que, si diferir la extubación puede reducir significativamente el riesgo (por ejemplo, dando tiempo a resolver edema con esteroides, mejorar el equipo disponible, o esperar a un cambio de turno con más experiencia), debe hacerse — la guía es explícita en que no diferir cuando esto reduciría el riesgo es un error evitable, mientras que diferir sin que vaya a mejorar nada solo traslada el riesgo a otro operador, potencialmente menos familiarizado con el caso.',
    },
    {
        id: 'extub-q013',
        tema: 'extub-secuencia-despierta',
        tipo: 'redactar',
        enunciado: 'Un paciente abre los ojos al pedírselo tras la extubación planificada. ¿Es esto suficiente para considerar que está "despierto" según la guía? Justifica tu respuesta.',
        respuestaModelo: 'No necesariamente. La guía advierte explícitamente que la apertura ocular en respuesta a una orden verbal puede ser una reacción inespecífica y no fiable, no una prueba real de que el paciente pueda seguir instrucciones de forma consciente. Para evitar esta ambigüedad, se recomienda pedir tareas más específicas y menos reflejas, como "aprieta mi mano" — una respuesta correcta a esa orden es un indicador mucho más fiable de que el paciente está realmente despierto y obedeciendo órdenes. Tampoco sirven los movimientos con propósito aparente (como alcanzar el tubo), que no indican de forma fiable que el paciente esté despierto y pueden ocurrir en planos intermedios de consciencia, precisamente los de mayor riesgo.',
    },
    {
        id: 'extub-q014',
        tema: 'extub-complicaciones',
        tipo: 'redactar',
        enunciado: 'Explica la diferencia entre "conversión" y "reemplazo" de vía aérea, y por qué la guía prefiere la conversión cuando el manejo de la vía aérea se considera "en riesgo".',
        respuestaModelo: 'La conversión mantiene la capacidad continua de ventilación alveolar en todo momento, o conserva una guía en la vía aérea que permite restaurarla rápidamente (por ejemplo, intubar a través de un SGA ya colocado, o extubar sobre un catéter de intercambio). El reemplazo, en cambio, interrumpe inevitablemente la ventilación con el lifeline inicial hasta lograr establecer el siguiente, sin ninguna guía intermedia (por ejemplo, retirar un SGA e intentar intubar a ciegas). La conversión se prefiere cuando el manejo de vía aérea está "en riesgo" porque reduce el tiempo sin ventilación alveolar garantizada y aporta un plan B inmediato si el nuevo lifeline falla — mientras que el reemplazo deja al paciente sin ninguna vía aérea asegurada durante la transición, precisamente el escenario que se quiere evitar en un paciente ya identificado como de mayor riesgo.',
    },
];
