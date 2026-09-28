// Banco de preguntas de repaso — "Manual UMI Negrín — Cardiología práctica"
// (protocolos internos de la UMI, HUGCDN). 5 preguntas por ficha (4 opción
// múltiple + 1 de redactar) × 8 fichas — formato reducido, mismo criterio
// ya usado en los bloques prácticos más recientes de la app.
export const temasManualUmiCardio = [
    { key: 'umi-vasoactivos', etiqueta: 'Fármacos vasoactivos: receptores y dosis' },
    { key: 'umi-endocarditis', etiqueta: 'Endocarditis infecciosa: criterios de Duke' },
    { key: 'umi-fate', etiqueta: 'Ecocardiografía FATE a pie de cama' },
    { key: 'umi-marcapasos', etiqueta: 'Marcapasos: código de 5 letras' },
    { key: 'umi-hemodinamica', etiqueta: 'Hemodinámica invasiva y Swan-Ganz' },
    { key: 'umi-cirugia-cardiaca', etiqueta: 'Cirugía cardiaca: anticoagulación y sangrado' },
    { key: 'umi-posparada', etiqueta: 'Síndrome posparada cardíaca' },
    { key: 'umi-fa-anticoagulacion', etiqueta: 'FA: algoritmo de anticoagulación' },
];

export const preguntasManualUmiCardio = [
    // ---- Ficha I: Vasoactivos ----
    {
        id: 'umi-cq001', tema: 'umi-vasoactivos',
        enunciado: '¿Con qué fármaco NO se deben diluir ni administrar simultáneamente la dopamina, dobutamina, noradrenalina ni adrenalina?',
        opciones: ['Bicarbonato sódico (NaHCO₃)', 'Suero salino fisiológico 0,9%', 'Suero glucosado 5%', 'Cloruro potásico'],
        correcta: 0,
        explicacion: 'El pH básico del bicarbonato inactiva a las 4 catecolaminas clásicas — advertencia compartida por las 4 en el manual de la UMI.',
    },
    {
        id: 'umi-cq002', tema: 'umi-vasoactivos',
        enunciado: 'A dosis &gt;10 μg/kg/min, ¿qué receptor predomina en el efecto de la dopamina?',
        opciones: ['Receptores α (vasoconstricción sistémica y pulmonar)', 'Receptores β2 (vasodilatación)', 'Receptores dopaminérgicos D1 exclusivamente', 'Receptores muscarínicos'],
        correcta: 0,
        explicacion: 'A dosis &gt;10 μg/kg/min la dopamina es agonista de receptores α en circulación sistémica y pulmonar, produciendo vasoconstricción — a diferencia de los 3 μg/kg/min, donde predomina el efecto β.',
    },
    {
        id: 'umi-cq003', tema: 'umi-vasoactivos',
        enunciado: '¿Qué reacción adversa es específica y grave del nitroprusiato, y no de la nitroglicerina?',
        opciones: ['Intoxicación por cianuro/tiocianato', 'Taquifilaxia a las 24h', 'Metahemoglobinemia', 'Broncoespasmo'],
        correcta: 0,
        explicacion: 'El nitroprusiato libera 5 moléculas de cianuro por molécula; el cianuro bloquea la citocromo oxidasa mitocondrial y se metaboliza a tiocianato (neurotóxico, eliminado por el riñón). La nitroglicerina, en cambio, tiene como reacción propia la metahemoglobinemia por oxidación del grupo hemo.',
    },
    {
        id: 'umi-cq004', tema: 'umi-vasoactivos',
        enunciado: '¿Cuál es el antídoto real del rocuronio, y a qué dosis revierte el bloqueo de forma inmediata?',
        opciones: ['Sugammadex, 16 mg/kg', 'Neostigmina, 5 mg', 'Fisostigmina, 2 mg', 'Flumazenilo, 0,5 mg'],
        correcta: 0,
        explicacion: 'Sugammadex ("Bridion") es el antídoto específico del rocuronio y vecuronio — 4 mg/kg para reversión estándar, 16 mg/kg para reversión inmediata tras la dosis de intubación.',
    },
    {
        id: 'umi-cq005', tema: 'umi-vasoactivos', tipo: 'redactar',
        enunciado: 'Explica por qué la dobutamina, pese a aumentar el gasto cardíaco, puede ser deletérea en un paciente con falla cardíaca — y qué receptor lo explica.',
        respuestaModelo: 'La dobutamina es agonista β1 predominante, lo que aumenta la contractilidad, la frecuencia cardíaca y el dromotropismo, elevando el gasto cardíaco de forma dosis-dependiente. Pero ese mismo efecto inotrópico y cronotrópico positivo aumenta el consumo miocárdico de oxígeno — un efecto deletéreo precisamente en el contexto de falla cardíaca, donde el miocardio ya tiene una reserva energética comprometida. El efecto β2 acompañante (vasodilatación periférica débil) suele dejar la presión arterial sin cambios netos, así que el balance depende de si el beneficio hemodinámico del mayor gasto compensa el mayor coste metabólico.',
    },

    // ---- Ficha II: Endocarditis ----
    {
        id: 'umi-cq006', tema: 'umi-endocarditis',
        enunciado: 'Según los criterios de Duke, ¿cuándo se considera EI definitiva?',
        opciones: ['2 criterios mayores, o 1 mayor + 3 menores, o 5 menores', '1 criterio mayor por sí solo', '3 criterios menores', 'Un único hemocultivo positivo'],
        correcta: 0,
        explicacion: 'EI definida (criterios clínicos) = 2 mayores, o 1 mayor + 3 menores, o 5 menores — la misma regla en los criterios de Duke originales y en los modificados.',
    },
    {
        id: 'umi-cq007', tema: 'umi-endocarditis',
        enunciado: '¿Qué microorganismo permite, con un único hemocultivo positivo, cumplir por sí solo un criterio MAYOR de Duke?',
        opciones: ['Coxiella burnetii', 'Staphylococcus epidermidis', 'Escherichia coli', 'Candida albicans'],
        correcta: 0,
        explicacion: 'Un cultivo único positivo para Coxiella burnetii cuenta como criterio mayor por sí solo — el resto de microorganismos requieren cultivos persistentemente positivos o un agente típico Gram+.',
    },
    {
        id: 'umi-cq008', tema: 'umi-endocarditis',
        enunciado: 'Ante sospecha de EI con prótesis valvular y ETT positivo, ¿cuál es el siguiente paso del algoritmo?',
        opciones: ['ETE (ecocardiograma transesofágico)', 'Alta y reevaluación en consulta', 'Repetir solo el ETT en 24h', 'Iniciar tratamiento sin más pruebas de imagen'],
        correcta: 0,
        explicacion: 'Prótesis valvulares/dispositivos intracardiacos, ETT de pobre calidad o ETT positivo llevan todos a ETE — el ETT solo no basta en ninguno de esos 3 escenarios.',
    },
    {
        id: 'umi-cq009', tema: 'umi-endocarditis',
        enunciado: '¿Qué prueba de imagen añaden los criterios ESC 2015 específicamente para el estudio de prótesis valvulares con alta sospecha de EI?',
        opciones: ['¹⁸F-FDG PET/TAC o SPECT/TAC con leucocitos marcados', 'Resonancia magnética cardiaca simple', 'Ecografía Doppler carotídea', 'Gammagrafía ósea'],
        correcta: 0,
        explicacion: 'En válvula protésica, el algoritmo añade PET/TAC con ¹⁸F-FDG o SPECT/TAC con leucocitos marcados con isótopos — técnicas de medicina nuclear que compensan la menor sensibilidad del ecocardiograma sobre material protésico.',
    },
    {
        id: 'umi-cq010', tema: 'umi-endocarditis', tipo: 'redactar',
        enunciado: 'Distingue un fenómeno vascular de un fenómeno inmunitario dentro de los criterios menores de Duke, con un ejemplo de cada uno.',
        respuestaModelo: 'Los fenómenos vasculares reflejan embolización séptica directa desde la vegetación: émbolo arterial grave, infarto pulmonar séptico, aneurisma micótico, hemorragias intracraneales o conjuntivales, y las lesiones de Janeway (máculas eritematosas indoloras en palmas/plantas). Los fenómenos inmunitarios, en cambio, reflejan una respuesta inmune mediada por inmunocomplejos, no una embolización directa: glomerulonefritis, nódulos de Osler (nódulos dolorosos en pulpejos), manchas de Roth (hemorragias retinianas con centro pálido) y factor reumatoide positivo. Ambos son criterios menores, pero mecánicamente son fenómenos distintos — uno es obstrucción vascular por material embólico, el otro es daño tisular mediado por el sistema inmune.',
    },

    // ---- Ficha III: FATE ----
    {
        id: 'umi-cq011', tema: 'umi-fate',
        enunciado: '¿Cuántas posiciones (ventanas) básicas componen el protocolo FATE estándar?',
        opciones: ['4', '2', '6', '8'],
        correcta: 0,
        explicacion: 'El FATE básico usa 4 posiciones: subcostal 4-cámaras, apical 4-cámaras, paraesternal eje largo (con su variante de eje corto de VI), y escaneo pleural.',
    },
    {
        id: 'umi-cq012', tema: 'umi-fate',
        enunciado: 'En la estimación visual de la función sistólica del VI, si la válvula mitral se acerca al septo a menos de 1 cm, ¿qué se puede estimar?',
        opciones: ['FEVI >40%', 'FEVI <20%', 'Derrame pericárdico significativo', 'Disfunción diastólica grave'],
        correcta: 0,
        explicacion: 'El movimiento de la válvula mitral hacia el septo (<1 cm de distancia) es uno de los 3 signos visuales de función sistólica conservada del VI, junto al movimiento endocárdico simétrico y el engrosamiento miocárdico ≥40%.',
    },
    {
        id: 'umi-cq013', tema: 'umi-fate',
        enunciado: 'En ventilación mecánica sin esfuerzo respiratorio, ¿a partir de qué índice de colapsabilidad de la VCI se considera al paciente respondedor a volumen?',
        opciones: ['>18%', '>40%', '>5%', '>90%'],
        correcta: 0,
        explicacion: 'En VM sin esfuerzo respiratorio el corte es >18% (fórmula (Dmáx−Dmín)×100/Dmín) — distinto del >40% que se usa en ventilación espontánea, porque la fisiología del llenado de la VCI cambia con la presión intratorácica positiva.',
    },
    {
        id: 'umi-cq014', tema: 'umi-fate',
        enunciado: '¿Cuál de estas NO es una de las 6 preguntas del examen FATE sistemático?',
        opciones: ['Medir la fracción de eyección exacta por Simpson biplano', 'Buscar patología obvia', 'Evaluar la función biventricular', 'Explorar pleura en ambos lados'],
        correcta: 0,
        explicacion: 'El FATE es deliberadamente un examen dirigido y cualitativo (estimación visual), no un estudio completo con medición exacta por Simpson — esa es precisamente la diferencia con una ecocardiografía reglada por cardiología.',
    },
    {
        id: 'umi-cq015', tema: 'umi-fate', tipo: 'redactar',
        enunciado: 'Explica qué distingue al FATE "básico" del FATE "extendido", y cuándo tendría sentido pasar del primero al segundo.',
        respuestaModelo: 'El FATE básico se limita a las 4 posiciones estándar (subcostal, apical 4-cámaras, paraesternal eje largo y su eje corto, y el escaneo pleural), pensadas para responder preguntas binarias rápidas: ¿hay derrame?, ¿está dilatado el VD?, ¿la función global es normal o está claramente deprimida? El FATE extendido añade ventanas adicionales — vena cava inferior subcostal, eje corto paraesternal de la válvula mitral, aorta paraesternal en eje corto, y las vistas apicales de 5 y 2 cámaras — que permiten estimar la respuesta a volumen (colapsabilidad de la VCI), valorar función diastólica básica (patrón mitral E/A) y explorar estructuras que el FATE básico no cubre bien. Tiene sentido pasar al extendido cuando el hallazgo básico deja una pregunta de manejo sin resolver — por ejemplo, un VD dilatado en el básico que exige valorar la VCI para decidir si el paciente tolerará más volumen.',
    },

    // ---- Ficha IV: Marcapasos ----
    {
        id: 'umi-cq016', tema: 'umi-marcapasos',
        enunciado: 'En el código NBG de 5 letras, ¿qué describe la 3ª posición?',
        opciones: ['La respuesta (disparado, inhibido, o ambos)', 'La cámara de estimulación', 'La cámara de detección', 'La programabilidad'],
        correcta: 0,
        explicacion: 'Posición 1 = estimulación, 2 = detección, 3 = respuesta (T/I/D), 4 = programabilidad, 5 = función antitaquicardia.',
    },
    {
        id: 'umi-cq017', tema: 'umi-marcapasos',
        enunciado: 'Un marcapasos programado como "DDD" estimula y detecta en:',
        opciones: ['Aurícula y ventrículo (doble en ambas posiciones)', 'Solo ventrículo', 'Solo aurícula', 'Ninguna cámara — solo telemetría'],
        correcta: 0,
        explicacion: '"D" en la 1ª y 2ª posición significa "doble" — el dispositivo estimula y detecta tanto en aurícula como en ventrículo.',
    },
    {
        id: 'umi-cq018', tema: 'umi-marcapasos',
        enunciado: '¿Qué caracteriza a una indicación de Grupo III?',
        opciones: ['Evidencia/acuerdo general de que el procedimiento es ineficaz, y en algunos casos perjudicial', 'Evidencia sólida de que el procedimiento es beneficioso', 'Evidencia controvertida a favor', 'Indicación de uso exclusivamente pediátrico'],
        correcta: 0,
        explicacion: 'Grupo III = la evidencia/acuerdo general apoya la ineficacia del procedimiento, que incluso puede ser perjudicial en algunos casos — la recomendación opuesta al Grupo I.',
    },
    {
        id: 'umi-cq019', tema: 'umi-marcapasos',
        enunciado: 'Dentro del Grupo II, ¿qué distingue a la Clase IIa de la IIb?',
        opciones: ['IIa: la evidencia/opinión se inclina a favor. IIb: se basa en menor evidencia o la opinión mayoritaria es menos favorable', 'IIa es siempre más segura que IIb', 'IIb solo aplica a marcapasos temporales', 'No hay diferencia real entre ambas'],
        correcta: 0,
        explicacion: 'Ambas reflejan evidencia controvertida (Grupo II), pero IIa tiene la balanza de evidencia/opinión a favor de la utilidad, mientras que IIb se apoya en un grado de evidencia menor o una opinión mayoritaria menos favorable.',
    },
    {
        id: 'umi-cq020', tema: 'umi-marcapasos', tipo: 'redactar',
        enunciado: 'Describe qué representa la 5ª posición del código NBG y por qué es distinta de las 4 anteriores.',
        respuestaModelo: 'Las primeras 4 posiciones del código NBG describen el comportamiento de estimulación "de base" del dispositivo: qué cámaras estimula, qué cámaras detecta, cómo responde a lo que detecta, y qué tan programable/adaptable a la frecuencia es. La 5ª posición es distinta porque describe una función completamente aparte: la capacidad antitaquicardia del dispositivo — es decir, qué hace el marcapasos si detecta una taquiarritmia, no un ritmo lento. Las opciones son P (estimulación antitaquicardia, "overdrive pacing"), S (choque, como en un DAI) o D (estimulación + choque combinados). Por eso un dispositivo puede tener un código NBG completo de 5 letras (p. ej. "DDDRD") solo si combina funciones de marcapasos convencional con capacidad de cardioversión/desfibrilación, como ocurre en un DAI-resincronizador.',
    },

    // ---- Ficha V: Hemodinámica ----
    {
        id: 'umi-cq021', tema: 'umi-hemodinamica',
        enunciado: 'Un paciente con PVC alta, PAPM alta, PEP alta, TAM baja, GC bajo y RVS alta tras un IAM presenta un patrón de:',
        opciones: ['Shock cardiogénico', 'Shock hipovolémico', 'Shock distributivo por sepsis', 'Shock anafiláctico'],
        correcta: 0,
        explicacion: 'Ese patrón (PVC/PAPM/PEP altas, TAM baja, GC bajo, RVS alta) es el del shock cardiogénico — idéntico en la tabla al del shock obstructivo salvo por la PEP (normal/baja en obstructivo vs. alta en cardiogénico).',
    },
    {
        id: 'umi-cq022', tema: 'umi-hemodinamica',
        enunciado: 'En el protocolo Swan-Ganz, si la SvO₂ es baja (<60%) y la SaO₂ es normal (>95%), ¿qué se evalúa a continuación?',
        opciones: ['El gasto cardíaco', 'Aumentar la PEEP directamente', 'Suspender la sedación', 'Transfundir sin más evaluación'],
        correcta: 0,
        explicacion: 'Con SaO₂ normal descartada la hipoxemia como causa, el protocolo dirige la evaluación hacia el gasto cardíaco (alto o bajo) como siguiente paso del árbol de decisión.',
    },
    {
        id: 'umi-cq023', tema: 'umi-hemodinamica',
        enunciado: 'Con gasto cardíaco bajo y PEP/IVTDVD elevados (>18 mmHg / >140 ml/m²), ¿qué indica el manual como acción?',
        opciones: ['Dobutamina (disfunción miocárdica)', 'Fluidos (hipovolemia)', 'Diuréticos únicamente', 'Vasodilatadores puros'],
        correcta: 0,
        explicacion: 'PEP/IVTDVD altos con GC bajo sugieren disfunción miocárdica (el corazón ya está "lleno" pero no expulsa) — el protocolo indica dobutamina, no más fluidos (que sí estaría indicado si la PEP/IVTDVD fueran bajas).',
    },
    {
        id: 'umi-cq024', tema: 'umi-hemodinamica',
        enunciado: '¿Qué fórmula corresponde a la resistencia vascular sistémica (RVS)?',
        opciones: ['[PAM−PVC]/GC × 80', 'GC/SC', 'Hb×1,34×%saturación venosa', '[VS×(PAM−POAP)]/SC × 0,0136'],
        correcta: 0,
        explicacion: 'RVS = [PAM−PVC]/GC × 80 (dina×s×cm⁻⁵). Las otras fórmulas corresponden a índice cardíaco, saturación venosa mixta e ITSVI respectivamente.',
    },
    {
        id: 'umi-cq025', tema: 'umi-hemodinamica', tipo: 'redactar',
        enunciado: 'Explica por qué el shock cardiogénico y el shock obstructivo comparten exactamente el mismo patrón de PVC/GC/RVS en la tabla, y cómo se distinguen en la práctica.',
        respuestaModelo: 'Ambos son, en esencia, formas de "fallo de bomba" desde el punto de vista puramente hemodinámico: algo impide que el corazón eyecte sangre de forma eficaz, así que la sangre se acumula "aguas arriba" (PVC alta) mientras el gasto cardíaco cae (GC bajo) y el organismo compensa con vasoconstricción periférica (RVS alta). La diferencia está en el mecanismo, no en el patrón de presiones: en el shock cardiogénico el problema es intrínseco al miocardio (isquemia, arritmia, valvulopatía aguda) — el músculo cardíaco en sí falla. En el shock obstructivo el corazón es funcionalmente normal, pero algo externo bloquea mecánicamente el llenado o la eyección — taponamiento pericárdico, neumotórax a tensión, o una embolia pulmonar masiva que obstruye el tracto de salida del VD. Por eso el patrón hemodinámico por sí solo no los distingue: hace falta la historia clínica y, sobre todo, una ecocardiografía (FATE) que muestre derrame pericárdico, dilatación aguda del VD, o ausencia de contractilidad segmentaria isquémica, para saber cuál de los dos es.',
    },

    // ---- Ficha VI: Cirugía cardiaca ----
    {
        id: 'umi-cq026', tema: 'umi-cirugia-cardiaca',
        enunciado: 'Tras un recambio valvular mecánico, ¿cuándo se inicia la anticoagulación con heparina sódica según el protocolo?',
        opciones: ['Cuando el sangrado es <50 ml/h durante más de 5h', 'Inmediatamente al llegar a la UMI, sin esperar', 'Solo tras confirmar Hb >10 g/dl', 'A las 72h fijas del postoperatorio'],
        correcta: 0,
        explicacion: 'El protocolo exige un sangrado ya controlado (<50 ml/h) sostenido más de 5h antes de iniciar la anticoagulación — priorizando la hemostasia inicial sobre el inicio precoz de la anticoagulación.',
    },
    {
        id: 'umi-cq027', tema: 'umi-cirugia-cardiaca',
        enunciado: '¿Cuál es el objetivo de rAPTT (ratio sobre control) en la anticoagulación postoperatoria de cirugía cardiaca?',
        opciones: ['1,5-2,3 veces el control', '1-1,2 veces el control', '3-4 veces el control', 'No se usa rAPTT en este protocolo'],
        correcta: 0,
        explicacion: 'El objetivo es un APTT alargado 1,5-2,3 veces sobre el control — dentro de esa banda no se hacen cambios, y se repite el control a las 24h.',
    },
    {
        id: 'umi-cq028', tema: 'umi-cirugia-cardiaca',
        enunciado: 'En el algoritmo de sangrado post-CCV, ¿qué hallazgo del tromboelastograma indica el uso de desmopresina?',
        opciones: ['Amplitud máxima <45', 'Fibrinógeno <150 mg/dl', 'Plaquetas <100.000', 'TCA >140 seg'],
        correcta: 0,
        explicacion: 'Una amplitud máxima <45 en el TEG orienta a disfunción plaquetaria funcional — el algoritmo indica desmopresina 0,3 μg/kg en ese punto, distinto de los otros hallazgos (que orientan a protamina, transfusión de plaquetas o crioprecipitados respectivamente).',
    },
    {
        id: 'umi-cq029', tema: 'umi-cirugia-cardiaca',
        enunciado: '¿Cuál de estos débitos de drenaje NO se considera, por sí solo, sangrado anormal según el manual?',
        opciones: ['5 ml/kg en la 2ª hora, con Hb estable >8', '>300 ml en la 1ª hora', '>1000 ml en las 4 primeras horas', 'Aumento súbito de 300 a 500 ml/h durante 3h consecutivas'],
        correcta: 0,
        explicacion: '5 ml/kg en la 2ª hora está por debajo del corte real (>7 ml/kg o >400 ml en la 2ª hora) y coincide con el rango de "sangrado normal" (1,5-2 ml/kg/h) si la evaluación clínica (T°, pH, Ca²⁺, Hb) es también normal.',
    },
    {
        id: 'umi-cq030', tema: 'umi-cirugia-cardiaca', tipo: 'redactar',
        enunciado: 'Explica por qué el algoritmo de sangrado post-CCV recorre coagulación (TCA/TEG) antes que plaquetas, antes que fibrinógeno, en vez de pedir todo a la vez y corregir sin orden.',
        respuestaModelo: 'El algoritmo sigue la cascada real de la hemostasia, del componente más "corriente arriba" al más específico: primero comprueba que la propia heparina de la bomba de circulación extracorpórea esté bien neutralizada (TCA >140seg → protamina), porque un exceso de heparina residual simularía cualquier otro defecto de coagulación y llevaría a transfusiones innecesarias si se corrige en el orden equivocado. Después evalúa el tiempo de coagulación global (TEG >1,5 → plasma), luego el número de plaquetas, luego su función (amplitud máxima del TEG → desmopresina), y por último el fibrinógeno (crioprecipitados). Corregir en este orden evita tratar un síntoma (p. ej. transfundir plaquetas) cuando la causa real es otra (heparina residual o déficit de fibrinógeno) — y es exactamente el mismo principio que justifica pedir un tromboelastograma completo en vez de una coagulación convencional (PT/PTT/plaquetas por separado), que no distingue estos escalones con la misma rapidez.',
    },

    // ---- Ficha VII: Síndrome posparada ----
    {
        id: 'umi-cq031', tema: 'umi-posparada',
        enunciado: '¿Cuáles son los 4 componentes del síndrome posparada cardíaca?',
        opciones: ['Persistencia de la enfermedad precipitante, daño cerebral posparada, daño miocárdico posparada, SRIS', 'Solo daño cerebral y daño miocárdico', 'Hipoglucemia, hipotermia, acidosis y coagulopatía', 'Shock hipovolémico secundario a la RCP'],
        correcta: 0,
        explicacion: 'Los 4 componentes reales son: persistencia de la enfermedad precipitante, daño cerebral posparada (isquemia + radicales libres + pérdida de autorregulación), daño miocárdico posparada (aturdimiento, disfunción sistodiastólica), y un SRIS que remeda clínicamente a la sepsis.',
    },
    {
        id: 'umi-cq032', tema: 'umi-posparada',
        enunciado: '¿Por qué la presión de perfusión cerebral (PPC) pasa a depender directamente de la tensión arterial sistémica tras la parada?',
        opciones: ['Por la pérdida de la autorregulación cerebral', 'Porque la PIC baja a 0 tras la RCP', 'Porque el flujo cerebral deja de depender de la presión', 'Por vasodilatación cerebral farmacológica programada'],
        correcta: 0,
        explicacion: 'La isquemia y los radicales libres de O₂ tóxicos liberados durante la parada producen pérdida de la autorregulación cerebral — el mecanismo que normalmente mantiene el flujo cerebral constante pese a cambios de presión sistémica. Sin autorregulación, la PPC queda directamente ligada a la TA sistémica.',
    },
    {
        id: 'umi-cq033', tema: 'umi-posparada',
        enunciado: '¿Cuál es la ventana temporal de la "fase precoz" del SPP, donde las intervenciones podrían tener mayor relevancia?',
        opciones: ['Desde los 20 min hasta las 6-12h tras RCE', 'Solo los primeros 5 minutos', 'De las 72h en adelante', 'Desde el alta hospitalaria'],
        correcta: 0,
        explicacion: 'La fase precoz va de los 20 min (fin de la fase inmediata) hasta las 6-12h — el manual señala explícitamente que las intervenciones en esta ventana podrían tener mayor relevancia sobre el pronóstico.',
    },
    {
        id: 'umi-cq034', tema: 'umi-posparada',
        enunciado: 'En el manejo hemodinámico posparada, si la PAM es >100 mmHg, ¿cuál es la acción indicada?',
        opciones: ['Vasodilatadores IV hasta PAM <100, asegurando PVC 8-12', 'Bolo de volumen adicional', 'Iniciar noradrenalina', 'No hacer nada — es un hallazgo esperado tras la RCP'],
        correcta: 0,
        explicacion: 'PAM >100 mmHg orienta a vasodilatadores IV (hasta PAM <100), asegurando PVC 8-12, diuréticos si hay ICC/sobrecarga, y beta-bloqueantes si hay taquicardia y/o SCA con FE normal — la RVS elevada por la propia respuesta al paro no debe dejarse sin corregir.',
    },
    {
        id: 'umi-cq035', tema: 'umi-posparada', tipo: 'redactar',
        enunciado: 'Compara el manejo de un paciente con elevación de ST tras RCE frente a uno con GCS <8 sin causa obvia — ¿qué prueba se prioriza en cada caso y por qué?',
        respuestaModelo: 'Si hay elevación de ST o dolor isquémico tras la RCE, el protocolo prioriza el cateterismo (CATE) urgente con intervención coronaria percutánea (ICP) inmediata si procede — la lógica es la misma que en cualquier SCA: el miocardio isquémico sigue perdiéndose mientras no se revasculariza, y la parada cardiaca no cambia esa urgencia, solo la complica. Si en cambio el paciente tiene GCS <8 tras 20 minutos de RCE sin otra causa evidente de coma, el protocolo prioriza en su lugar una TAC craneal dentro de los primeros 120 minutos — porque a esas alturas hay que descartar una causa neurológica primaria de la parada (hemorragia subaracnoidea, ictus) antes de asumir que el bajo nivel de conciencia es solo la encefalopatía anóxica esperable, y porque esa ventana de 120 minutos es también cuando se decide si iniciar hipotermia terapéutica inducida. En ambos casos la prueba elegida ataca la causa más probable y más tiempo-dependiente de cada escenario clínico, no un protocolo genérico único.',
    },

    // ---- Ficha VIII: FA y anticoagulación ----
    {
        id: 'umi-cq036', tema: 'umi-fa-anticoagulacion',
        enunciado: 'En el algoritmo de anticoagulación en FA, ¿qué 2 escenarios anulan la puntuación CHA₂DS₂-VASc por completo y van directos a AVK?',
        opciones: ['Válvulas cardiacas mecánicas o estenosis mitral', 'Edad >75 años o sexo femenino', 'Insuficiencia cardíaca o diabetes', 'Ictus previo o enfermedad vascular'],
        correcta: 0,
        explicacion: 'Válvulas mecánicas o estenosis mitral son la primera pregunta del algoritmo — si la respuesta es "sí", el paciente va directo a AVK (Clase I·A) sin necesidad de calcular CHA₂DS₂-VASc, porque los NACO están contraindicados en ese contexto.',
    },
    {
        id: 'umi-cq037', tema: 'umi-fa-anticoagulacion',
        enunciado: 'Con CHA₂DS₂-VASc = 0 puntos, ¿qué recomienda el algoritmo?',
        opciones: ['No están indicados los tratamientos antiagregante ni anticoagulante (Clase III·B)', 'Anticoagulación oral obligatoria', 'Antiagregación con AAS', 'Oclusor de orejuela izquierda de rutina'],
        correcta: 0,
        explicacion: 'Con 0 puntos, ni la antiagregación ni la anticoagulación están indicadas — es una recomendación Clase III·B (evidencia de ineficacia/perjuicio).',
    },
    {
        id: 'umi-cq038', tema: 'umi-fa-anticoagulacion',
        enunciado: 'Con CHA₂DS₂-VASc ≥2 puntos, ¿qué anticoagulante se prefiere entre NACO y AVK?',
        opciones: ['NACO, preferido sobre AVK (ambos Clase I·A)', 'AVK siempre, sin excepción', 'Ninguno — solo antiagregación doble', 'Depende exclusivamente de la edad'],
        correcta: 0,
        explicacion: 'Con ≥2 puntos la anticoagulación está indicada, y el algoritmo prefiere los NACO sobre los AVK — ambos con Clase de recomendación I·A, pero el orden de preferencia es explícito.',
    },
    {
        id: 'umi-cq039', tema: 'umi-fa-anticoagulacion',
        enunciado: 'Si la anticoagulación oral está contraindicada en un paciente de alto riesgo, ¿qué alternativa contempla el algoritmo?',
        opciones: ['Oclusores de la orejuela izquierda (Clase IIb·C)', 'Doble antiagregación indefinida como sustituto equivalente', 'Suspender cualquier profilaxis de ictus', 'AVK a dosis reducida sin control de INR'],
        correcta: 0,
        explicacion: 'El algoritmo contempla, tras evaluar y corregir los factores de riesgo hemorrágico reversibles, el uso de oclusores de la orejuela izquierda para pacientes con contraindicaciones claras a la anticoagulación oral — Clase IIb·C.',
    },
    {
        id: 'umi-cq040', tema: 'umi-fa-anticoagulacion', tipo: 'redactar',
        enunciado: 'Explica por qué este algoritmo no incluye una calculadora nueva de CHA₂DS₂-VASc, y dónde vive esa calculadora dentro de la app.',
        respuestaModelo: 'La puntuación CHA₂DS₂-VASc en sí (8 ítems puntuables — insuficiencia cardíaca, hipertensión, edad ≥75, diabetes, ictus/AIT previo, enfermedad vascular, edad 65-74, sexo femenino — con un semáforo de riesgo por corte de puntos) ya existe como calculadora interactiva real en Merino Cardiología, Ficha XVII ("FA: cardioversión y prevención de ictus"), construida a partir de la fuente de Marik. Duplicarla aquí con una segunda implementación habría arriesgado una inconsistencia de cifras entre dos calculadoras del mismo score dentro de la misma app — el mismo criterio que ya sigue el proyecto en otros cruces entre especialidades (p. ej. remitir a una calculadora ya existente en vez de reimplementarla). Por eso esta ficha se limita a desarrollar el árbol de decisión completo alrededor de la puntuación (qué hacer antes, durante y después de calcularla), y enlaza por texto a la ficha donde la calculadora numérica ya vive.',
    },
];
