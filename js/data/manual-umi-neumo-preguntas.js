// Banco de preguntas de repaso — "Manual UMI Negrín — Manejo respiratorio
// práctico" (protocolos internos de la UMI, HUGCDN). 5 preguntas por ficha
// (4 opción múltiple + 1 de redactar) × 4 fichas — formato reducido, mismo
// criterio ya usado en los bloques prácticos más recientes de la app.
export const temasManualUmiNeumo = [
    { key: 'umi-rsi', etiqueta: 'Secuencia de intubación rápida (SIR)' },
    { key: 'umi-respirador', etiqueta: 'Programación inicial del respirador' },
    { key: 'umi-extubacion', etiqueta: 'Criterios de extubación y brecha aniónica' },
    { key: 'umi-blue', etiqueta: 'Protocolo BLUE: ecografía pulmonar' },
];

export const preguntasManualUmiNeumo = [
    // ---- Ficha I: SIR ----
    {
        id: 'umi-nq001', tema: 'umi-rsi',
        enunciado: '¿Qué significa la regla "3-3-2" al pronosticar una vía aérea difícil?',
        opciones: ['3 dedos de apertura oral, 3 dedos mentón-hueso hioides, 2 dedos hueso hioides-cartílago tiroides', 'Un método de anestesia en 3 fases y 2 relajantes', 'La proporción de dosis entre sedante y relajante', 'El número de intentos máximo de laringoscopia'],
        correcta: 0,
        explicacion: 'La regla 3-3-2 es una evaluación anatómica rápida de la vía aérea (apertura oral, distancia mentón-hioides, distancia hioides-cartílago tiroides), parte del Paso 1 (planificación) de la SIR, junto a la escala de Mallampati.',
    },
    {
        id: 'umi-nq002', tema: 'umi-rsi',
        enunciado: 'Según el manual, ¿qué fármaco relajante se prefiere si hay disponibilidad de sugammadex?',
        opciones: ['Succinilcolina', 'Pancuronio', 'Cisatracurio', 'Ninguno — el sugammadex no cambia la elección'],
        correcta: 0,
        explicacion: 'El algoritmo por estabilidad hemodinámica indica rocuronio o succinilcolina, "de elección si hay disponibilidad de sugammadex" — porque el antídoto revierte de inmediato el bloqueo si la intubación fracasa.',
    },
    {
        id: 'umi-nq003', tema: 'umi-rsi',
        enunciado: '¿Qué representa el nemotécnico SOAPME en la preparación de la vía aérea?',
        opciones: ['Suction, Oxygen, Airway, Pharmacology, Monitoring, Equipment', 'Sedation, Oxygen, Airway, Paralysis, Monitoring, Extubation', 'Suction, Oxygenation, Anesthesia, Pretreatment, Muscle relaxant, Extubation', 'Un protocolo exclusivo de extubación'],
        correcta: 0,
        explicacion: 'SOAPME = Suction (aspiración), Oxygen (oxígeno), Airway (vía aérea/Mallampati), Pharmacology (farmacología), Monitoring (monitorización), Equipment (equipo) — checklist de preparación antes de intubar.',
    },
    {
        id: 'umi-nq004', tema: 'umi-rsi',
        enunciado: 'En un paciente hemodinámicamente inestable, ¿qué combinación de inducción indica el algoritmo?',
        opciones: ['Fentanilo 0,5-1 mcg/kg + etomidato 0,2 mg/kg (o midazolam 0,1-0,15 mg/kg)', 'Fentanilo 2-4 mcg/kg + propofol 2 mg/kg', 'Solo succinilcolina, sin sedante previo', 'Ketamina en dosis única sin fentanilo'],
        correcta: 0,
        explicacion: 'En pacientes inestables se reduce la dosis de opioide y se prefiere etomidato (mejor perfil hemodinámico) o midazolam a dosis baja, frente a la combinación de mayor dosis usada en pacientes estables.',
    },
    {
        id: 'umi-nq005', tema: 'umi-rsi', tipo: 'redactar',
        enunciado: 'Explica para qué sirve la maniobra de Sellick (compresión cricoidea) durante la preoxigenación, y en qué momento de la SIR se aplica.',
        respuestaModelo: 'La maniobra de Sellick consiste en comprimir el cartílago cricoides contra la columna cervical, lo que colapsa mecánicamente la luz del esófago (situado justo detrás de la tráquea). Su objetivo es evitar que el contenido gástrico regurgite pasivamente hacia la faringe y sea aspirado hacia la vía aérea durante la inducción — un riesgo real porque en la SIR el paciente pierde sus reflejos protectores (tos, deglución) antes de tener el tubo endotraqueal asegurado. Se aplica durante el Paso 2 (preoxigenación, con la mascarilla de reservorio a FiO₂=1) y se mantiene hasta confirmar la correcta colocación del tubo, especialmente si se usa ambú/pieza en T (que insufla aire y puede distender el estómago, aumentando el riesgo de regurgitación) — el manual señala explícitamente evitar su uso si es posible y recurrir a la maniobra "si es necesario".',
    },

    // ---- Ficha II: Respirador ----
    {
        id: 'umi-nq006', tema: 'umi-respirador',
        enunciado: '¿Sobre qué peso se calcula el volumen tidal inicial (6-8 ml/kg)?',
        opciones: ['El peso corporal predicho (PBW), no el peso real', 'El peso real del paciente', 'El peso ideal por índice de Broca', 'El peso ajustado por obesidad'],
        correcta: 0,
        explicacion: 'El volumen tidal protector se calcula sobre el PBW (peso corporal predicho, función de la altura y el sexo) — usar el peso real sobreestima el volumen en pacientes obesos y favorece el barotrauma.',
    },
    {
        id: 'umi-nq007', tema: 'umi-respirador',
        enunciado: 'Según la fórmula del manual, ¿cuál es el PBW de un hombre de 180 cm?',
        opciones: ['≈75,1 kg', '≈50 kg', '≈90 kg', '≈65 kg'],
        correcta: 0,
        explicacion: 'PBW hombre = 50 + 0,91×(180−152,4) = 50 + 0,91×27,6 ≈ 50 + 25,1 = 75,1 kg.',
    },
    {
        id: 'umi-nq008', tema: 'umi-respirador',
        enunciado: '¿Cuál es la modalidad ventilatoria y la PEEP de inicio recomendadas al programar el respirador por primera vez?',
        opciones: ['Asistida-controlada por volumen, PEEP 5-8 cmH₂O', 'Presión de soporte, PEEP 0', 'APRV, PEEP alta fija de 20', 'Ventilación espontánea con CPAP puro'],
        correcta: 0,
        explicacion: 'La programación inicial del manual es asistida-controlada por volumen, con PEEP 5-8 cmH₂O y FiO₂ al 100% de partida, ajustándose después según la tabla FiO₂/PEEP.',
    },
    {
        id: 'umi-nq009', tema: 'umi-respirador',
        enunciado: '¿Qué elemento del checklist del respirador se verifica ANTES de conectar al paciente, usando un simulador?',
        opciones: ['El adecuado funcionamiento del ventilador', 'La auscultación de ambos campos pulmonares del paciente', 'El volumen espirado real del paciente', 'El correcto ciclado en el paciente ya conectado'],
        correcta: 0,
        explicacion: 'El checklist exige verificar el funcionamiento del ventilador con un simulador de pulmón artificial antes de conectarlo al paciente — los pasos de auscultación/ciclado/volumen espirado son posteriores, ya con el paciente conectado.',
    },
    {
        id: 'umi-nq010', tema: 'umi-respirador', tipo: 'redactar',
        enunciado: 'Explica por qué la tabla FiO₂/PEEP de la ARDS Network vincula ambos parámetros en vez de subirlos de forma independiente.',
        respuestaModelo: 'La tabla FiO₂/PEEP acopla ambos parámetros porque persiguen el mismo objetivo (mantener una oxigenación adecuada) por 2 mecanismos distintos y complementarios: la FiO₂ aumenta directamente la cantidad de oxígeno disponible en el gas inspirado, mientras que la PEEP mejora la oxigenación de forma indirecta, reclutando alvéolos colapsados y aumentando la capacidad residual funcional. Subir solo la FiO₂ de forma indefinida expone al pulmón a toxicidad por oxígeno sin abordar el problema de fondo (alvéolos colapsados que no participan en el intercambio gaseoso); subir solo la PEEP sin ajustar la FiO₂ puede ser insuficiente en hipoxemias graves y aumenta el riesgo de barotrauma/inestabilidad hemodinámica por la presión intratorácica elevada. La tabla escalona ambos juntos, de menor a mayor gravedad, para que el manejo de la oxigenación sea protocolizado y reproducible entre distintos profesionales, en vez de depender del criterio individual de cada uno en cada turno.',
    },

    // ---- Ficha III: Extubación / anion gap ----
    {
        id: 'umi-nq011', tema: 'umi-extubacion',
        enunciado: '¿Cuál de estos es un criterio REQUERIDO (no opcional) para valorar la extubación?',
        opciones: ['pH >7,25', 'Hb >8 mg/dl', 'Temperatura central ≤38°', 'Estado mental alerta'],
        correcta: 0,
        explicacion: 'pH >7,25 es uno de los 5 criterios requeridos, junto a mejoría de la causa, oxigenación adecuada, estabilidad hemodinámica y capacidad de esfuerzo inspiratorio. Hb, temperatura y estado mental son criterios adicionales, opcionales.',
    },
    {
        id: 'umi-nq012', tema: 'umi-extubacion',
        enunciado: 'En un paciente con hipoxemia crónica de base, ¿qué valor de PaFi se considera aceptable para extubar, aunque sea menor al umbral estándar de 150?',
        opciones: ['PaFi >120', 'PaFi >300', 'PaFi >80', 'No hay excepción posible para hipoxemia crónica'],
        correcta: 0,
        explicacion: 'El manual señala explícitamente que "algunos pacientes con hipoxemia crónica, PaFi >120 es aceptable" — un ajuste realista frente al umbral general de PaO₂/FiO₂ >150.',
    },
    {
        id: 'umi-nq013', tema: 'umi-extubacion',
        enunciado: '¿Cuál es la fórmula de la brecha aniónica?',
        opciones: ['(Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻)', '(Na⁺ − K⁺) + (Cl⁻ − HCO₃⁻)', 'Na⁺ / (Cl⁻ + HCO₃⁻)', '(Cl⁻ + HCO₃⁻) − (Na⁺ + K⁺)'],
        correcta: 0,
        explicacion: 'Brecha aniónica = (Na⁺+K⁺) − (Cl⁻−HCO₃⁻), normal <15. Es una herramienta rápida de cabecera para orientar el diagnóstico diferencial de la acidosis metabólica.',
    },
    {
        id: 'umi-nq014', tema: 'umi-extubacion',
        enunciado: '¿Cuál de estas causas NO está en la lista de causas de brecha aniónica elevada (>15) del manual?',
        opciones: ['Hipopotasemia', 'Metanol', 'Cetosis', 'Salicilato'],
        correcta: 0,
        explicacion: 'La lista del manual es: metanol, urea (uremia), cetosis, paraldehído, isoniacida, hierro, lactato, etanol, salicilato — la hipopotasemia no forma parte de esa lista de causas de hiato aniónico elevado.',
    },
    {
        id: 'umi-nq015', tema: 'umi-extubacion', tipo: 'redactar',
        enunciado: 'Explica por qué los 5 criterios de extubación se dividen en "requeridos" y "opcionales", y qué implicación práctica tiene esa distinción.',
        respuestaModelo: 'Los criterios requeridos representan condiciones fisiológicas mínimas sin las cuales la extubación tiene un riesgo alto de fracaso inmediato: si la causa de la insuficiencia respiratoria no ha mejorado, si la oxigenación sigue siendo inadecuada, si el paciente está acidótico, hemodinámicamente inestable, o no puede iniciar esfuerzo inspiratorio propio, retirar el tubo endotraqueal expone a una reintubación urgente en minutos. Los criterios opcionales (Hb, temperatura, estado mental), en cambio, son factores que influyen en el éxito de la extubación pero no la contraindican de forma absoluta por sí solos — un paciente puede extubarse con éxito con Hb 7,5 g/dl o algo de fiebre si todo lo demás está en orden, aunque esos factores aumenten el riesgo de fracaso y merezcan vigilancia más estrecha tras retirar el tubo. La implicación práctica es que un solo criterio opcional incumplido no debe posponer automáticamente la extubación, mientras que cualquier criterio requerido incumplido sí debe hacerlo.',
    },

    // ---- Ficha IV: BLUE ----
    {
        id: 'umi-nq016', tema: 'umi-blue',
        enunciado: '¿Cuál es el primer paso del protocolo BLUE?',
        opciones: ['Valorar la presencia de sliding pulmonar', 'Buscar directamente el PLAPS', 'Medir la PaO₂/FiO₂', 'Auscultar los 4 campos pulmonares'],
        correcta: 0,
        explicacion: 'El Paso 1 del protocolo BLUE es valorar la presencia de sliding pulmonar (superior e inferior) — de ahí se ramifica todo el árbol diagnóstico siguiente.',
    },
    {
        id: 'umi-nq017', tema: 'umi-blue',
        enunciado: 'Con sliding pulmonar bilateral presente y líneas B++ en el plano anterior, ¿cuál es el diagnóstico del protocolo BLUE?',
        opciones: ['Edema pulmonar', 'Neumotórax', 'EPOC/asma', 'Embolismo pulmonar'],
        correcta: 0,
        explicacion: 'Sliding bilateral + líneas B++ bilaterales es el patrón del edema pulmonar cardiogénico — las líneas B reflejan síndrome intersticial-alveolar difuso.',
    },
    {
        id: 'umi-nq018', tema: 'umi-blue',
        enunciado: '¿Qué signo ecográfico es necesario, además de la ausencia de sliding y líneas A++, para diagnosticar neumotórax con el protocolo BLUE?',
        opciones: ['El "lung point" (punto pulmonar)', 'El signo de la cola de cometa', 'El signo del sinusoide', 'La línea de PLAPS'],
        correcta: 0,
        explicacion: 'El "lung point" —el punto de transición entre pulmón con sliding y sin sliding— es el signo específico que confirma el neumotórax dentro del algoritmo BLUE, distinto de la simple ausencia de sliding (que también puede darse en intubación selectiva o apnea).',
    },
    {
        id: 'umi-nq019', tema: 'umi-blue',
        enunciado: 'Con sliding bilateral, líneas A y trombosis venosa confirmada, junto a PLAPS positivo, ¿qué diagnóstico sugiere el protocolo?',
        opciones: ['Embolismo pulmonar', 'Neumonía', 'Edema pulmonar', 'Neumotórax'],
        correcta: 0,
        explicacion: 'La combinación de líneas A (pulmón "seco"), trombosis venosa en el estudio y PLAPS positivo orienta a embolismo pulmonar — el infarto pulmonar séptico que puede generar la condensación posterolateral detectada como PLAPS.',
    },
    {
        id: 'umi-nq020', tema: 'umi-blue', tipo: 'redactar',
        enunciado: 'Explica por qué el protocolo BLUE distingue entre líneas A y líneas B, y qué representa fisiopatológicamente cada patrón.',
        respuestaModelo: 'Las líneas A son artefactos de reverberación horizontal que aparecen cuando el ultrasonido rebota entre la pleura y el transductor a través de un pulmón normalmente aireado — representan un parénquima pulmonar con contenido de aire predominante, típico del pulmón sano, del EPOC/asma (hiperinsuflado) y del neumotórax (donde el aire pleural también genera este patrón). Las líneas B, en cambio, son artefactos verticales ("cola de cometa") que se originan cuando el engrosamiento de los tabiques interlobulillares por líquido o la ocupación alveolar por edema alteran la impedancia acústica normal del pulmón aireado — representan síndrome intersticial-alveolar, típico del edema pulmonar cardiogénico (líneas B difusas y bilaterales) o de la neumonía (líneas B más focales/asimétricas). Esta distinción es la que permite al protocolo BLUE separar, en segundos y sin radiación, un pulmón "seco" (líneas A: EPOC, TEP, neumotórax) de un pulmón "húmedo" (líneas B: edema, neumonía) como primer gran bifurcación diagnóstica.',
    },
];
