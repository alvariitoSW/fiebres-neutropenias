// Preguntas de «Neuro urgente» (PIF Radiología). Formato de js/data/merino-hemato-preguntas.js; estilo de autonomo/REGLAS.md §8.
// Cada tema, con al menos una pregunta (un tema vacío rompe el quiz).
// Fuentes: Marino, The ICU Book, 5.ª ed., cap. 47 (docs/marino-2024-neurologia-caps45-47.pdf, págs. del PDF) y
// StatPearls, «Stroke Imaging» (https://www.ncbi.nlm.nih.gov/sites/books/NBK546635/, por sección).
export const temasPifRadioNeuro = [
    { key: 'pifradio-n1', etiqueta: 'Ictus: ¿isquémico o hemorrágico?' },
    { key: 'pifradio-neuro-caso', etiqueta: 'Caso: déficit agudo que acaba en la UCI' },
];

export const preguntasPifRadioNeuro = [
    // ---- N1 · Ictus: ¿isquémico o hemorrágico? ----
    {
        id: 'pifradio-n1-q001', tema: 'pifradio-n1',
        enunciado: 'Llega un paciente con un déficit neurológico agudo y se sospecha un ictus. ¿Qué prueba de imagen se pide primero?',
        opciones: [
            'Esperar 24 horas para repetir la exploración, porque el infarto no se ve antes',
            'Una angio-TC con contraste y, solo si sale normal, una TC sin contraste',
            'TC de cráneo sin contraste, para excluir sangre y ver signos precoces de isquemia',
            'Una resonancia sin urgencia, mientras se trata como isquémico por ser el más frecuente',
        ],
        correcta: 2,
        explicacion: 'La TC sin contraste es la prueba inicial de elección en todo ictus sospechado: excluye la hemorragia, detecta lo que lo imita y busca signos precoces de isquemia. Esperar 24 h retrasa el diagnóstico (la hipodensidad se hace nítida a las 12-24 h, pero la sangre se ve ya). Tratar como isquémico sin saber si hay sangre expone al paciente a un fármaco antitrombótico en una hemorragia (razonamiento propio). Origen: StatPearls, «Stroke Imaging», sección «Noncontrast Computed Tomography».',
    },
    {
        id: 'pifradio-n1-q002', tema: 'pifradio-n1',
        enunciado: 'De todos los ictus, ¿cuál es el reparto aproximado entre isquémicos y hemorragias intracerebrales espontáneas?',
        opciones: [
            'Isquémico, cerca del 85 %; hemorragia, del 10 al 15 %',
            'Mitad y mitad: la hemorragia es tan frecuente como el infarto',
            'Isquémico, cerca del 50 %; hemorragia, cerca del 40 %',
            'Isquémico, cerca del 60 %; hemorragia, cerca del 35 %',
        ],
        correcta: 0,
        explicacion: 'Los isquémicos son cerca del 85 % y la hemorragia intracerebral espontánea el 10-15 %. Pensar que se reparten a la par llevaría a pedir una TC «por si acaso» con retraso, o a dar por sentada la sangre; aun así la hemorragia es la que peor pronóstico tiene: la mitad no sobrevive 30 días. Origen: Marino, cap. 47, págs. 34 y 41.',
    },
    {
        id: 'pifradio-n1-q003', tema: 'pifradio-n1',
        enunciado: 'En la TC sin contraste, ¿cómo se ve un hematoma intracerebral como el de la figura 47.3 del libro?',
        opciones: [
            'Como una zona más oscura que el cerebro de alrededor, igual que se ve el edema o el infarto',
            'Como una zona hiperdensa, blanca, dentro del parénquima, que puede entrar en los ventrículos',
            'Como un cerebro normal: la sangre solo se ve después de inyectar contraste',
            'Como una sola arteria blanca sin ninguna otra alteración en el parénquima',
        ],
        correcta: 1,
        explicacion: 'Marino muestra el hematoma como una zona hiperdensa que ocupa casi la mitad del hemisferio y se extiende a los ventrículos, con riesgo de hidrocefalia obstructiva. Confundirlo con una zona oscura haría no buscar sangre; esperar al contraste retrasaría la decisión sobre antitrombóticos. La arteria hiperdensa es otro signo (trombo), no un hematoma. Origen: Marino, cap. 47, fig. 47.3, pág. 43.',
    },
    {
        id: 'pifradio-n1-q004', tema: 'pifradio-n1',
        enunciado: 'A las 2 horas del inicio de un déficit agudo, la TC sin contraste no muestra sangre y parece normal. ¿Qué concluyes?',
        opciones: [
            'Que no es un ictus: con una TC normal se descarta el infarto y se puede dar el alta a casa',
            'Que es un ictus hemorrágico muy pequeño que no se ve, así que se trata como una hemorragia',
            'No hay sangre, pero el infarto no queda descartado: se buscan signos precoces y angio-TC',
            'Que hay que repetir la TC sin contraste cada hora hasta que por fin aparezca la sangre',
        ],
        correcta: 2,
        explicacion: 'En la fase hiperaguda (menos de 12 h) la TC puede ser normal o mostrar solo signos sutiles, así que una TC normal no descarta el infarto. Darlo de alta como «no ictus» deja sin tratar una oclusión; repetir TC buscando sangre no ayuda si ya no la hay. Origen: StatPearls, «Stroke Imaging», sección «Noncontrast Computed Tomography» (fases) y «Computed Tomography Angiography».',
    },
    {
        id: 'pifradio-n1-q005', tema: 'pifradio-n1',
        enunciado: 'En la TC ves una cerebral media hiperdensa en un paciente con hemiplejía. ¿Qué te dice y qué sigue?',
        opciones: [
            'Que hay sangre en el espacio subaracnoideo, y se pide una punción lumbar para confirmarlo',
            'Que es un hallazgo sin valor, porque una arteria blanca es lo normal en una TC de cráneo',
            'Que el paciente ya está sin riesgo y puede esperar sin prisa a una resonancia programada',
            'Un trombo en la arteria, muy específico de oclusión de gran vaso: se pide una angio-TC',
        ],
        correcta: 3,
        explicacion: 'La cerebral media hiperdensa refleja un tromboembolismo intravascular y es muy específica de oclusión de gran vaso; la angio-TC localiza la oclusión. Interpretarla como sangre subaracnoidea o como normal deja sin buscar una oclusión tratable, y esperar a la resonancia retrasa la decisión. Origen: StatPearls, «Stroke Imaging», secciones «Noncontrast Computed Tomography» y «Computed Tomography Angiography».',
    },
    {
        id: 'pifradio-n1-q006', tema: 'pifradio-n1',
        enunciado: 'Un compañero te dice que la TC tiene «un ASPECTS de 7». ¿Qué significa?',
        opciones: [
            'Que el paciente lleva 7 días de evolución desde el inicio de los síntomas',
            'Que de los 10 puntos del territorio de la cerebral media se han restado 3 por regiones con hipodensidad o pérdida de diferenciación gris-blanca',
            'Que hay 7 regiones del cerebro con sangre visible en la TC sin contraste',
            'Que el infarto afecta al territorio posterior del cerebro y no al de la cerebral media',
        ],
        correcta: 1,
        explicacion: 'ASPECTS es una puntuación de 10 puntos sobre el territorio de la cerebral media; se resta por cada región con hipodensidad sutil o pérdida de diferenciación gris-blanca. 7 significa 3 regiones afectadas. Leerlo como regiones con sangre confunde la isquemia con la hemorragia; para el territorio posterior existe otra adaptación (PC-ASPECTS). Origen: StatPearls, «Stroke Imaging», sección «Alberta Stroke Program Early CT Score (ASPECTS)».',
    },
    // ---- Caso (continúa en N2: HTIC y hernias) ----
    {
        id: 'pifradio-n1-q007', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (1/3). Hombre de 71 años (paciente inventado), con fibrilación auricular y apixabán, que llega con debilidad brusca del brazo y la pierna izquierdos. La TC sin contraste muestra un hematoma hiperdenso en los ganglios basales derechos, sin sangre en los ventrículos. Piensa antes de mirar las opciones: ¿qué haces en la primera hora, en tres cosas?',
        opciones: [
            'Dar ácido acetilsalicílico 325 mg desde el ingreso como en el isquémico, y vigilar la evolución',
            'Revertir el apixabán (andexanet alfa), PAS por debajo de 140 mmHg y consultar con neurocirugía',
            'Mantener la PA por debajo de 180/105 mmHg como tras una trombólisis, sin tocar el anticoagulante',
            'Esperar la TC de control a las 24 h antes de revertir nada, porque el hematoma ya está formado y no crece',
        ],
        correcta: 1,
        explicacion: 'En la hemorragia intracerebral se revierte el antitrombótico (apixabán o rivaroxabán: andexanet alfa, tabla 47.4, pág. 44), se mantiene la PAS por debajo de 140 mmHg y se consulta con neurocirugía (pág. 45). El AAS es para el isquémico: aquí aumentaría el sangrado. El límite de 180/105 es el del isquémico tratado con trombólisis (pág. 35), no el de la hemorragia. Esperar 24 h no es seguro: los hematomas crecen sobre todo en las primeras horas, 26 % en la primera hora según el Libro Azul (neurología, parte 2, pág. 25 del PDF). Origen: Marino, cap. 47, págs. 35, 44 y 45.',
    },
    {
        id: 'pifradio-n1-q008', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (2/3). Ingresa en la UCI. Seis horas después baja el nivel de consciencia (de Glasgow 14 a 7) y aparece una pupila derecha dilatada. La nueva TC muestra sangre en los ventrículos laterales y ventrículos más grandes. ¿Qué piensas y qué pides?',
        opciones: [
            'Hidrocefalia obstructiva por la sangre: neurocirugía coloca un drenaje que además mide la PIC',
            'Que es una recaída de un infarto previo: se añade antiagregación y se repite la TC mañana por la mañana',
            'Que es un empeoramiento esperable que no cambia nada: seguir con la misma pauta y vigilar por turnos',
            'Que hace falta una nueva angio-TC urgente para decidir si se trombolisa a este paciente',
        ],
        correcta: 0,
        explicacion: 'La sangre intraventricular suele causar hidrocefalia obstructiva y requiere un catéter de drenaje ventricular, que también mide la PIC; el Glasgow de 8 o menos, la sangre intraventricular y la midriasis unilateral (herniación transtentorial) son indicaciones de monitorizarla (págs. 41-45). Añadir antiagregantes agravaría el sangrado; no hacer nada deja crecer la presión; trombolizar a un paciente con hemorragia es lo contrario del tratamiento. Origen: Marino, cap. 47, pág. 45 (ficha «Hemorragia intracerebral»).',
    },
    {
        id: 'pifradio-n1-q009', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (3/3). Al residente de guardia le pides la nota del ingreso y escribe: «Hemorragia intracerebral con extensión ventricular. 1) Apixabán revertido con andexanet alfa. 2) Objetivo de PAS por debajo de 140 mmHg. 3) Se pauta ácido acetilsalicílico 325 mg por su fibrilación auricular. 4) Si se coloca drenaje ventricular, objetivo de PIC por debajo de 20 mmHg.» Hay 0, 1 o 2 errores: ¿cuál es?',
        opciones: [
            'La frase 1: el apixabán no se revierte nunca en una hemorragia intracerebral',
            'La frase 2: en la hemorragia la presión sistólica debe mantenerse por encima de 180 mmHg',
            'No hay ningún error: las cuatro frases de la nota son correctas y se firma sin cambios',
            'La frase 3: el AAS 325 mg es del isquémico y en la hemorragia empeora el sangrado',
        ],
        correcta: 3,
        explicacion: 'Solo falla la frase 3: el AAS a 325 mg es la medida del ictus isquémico (pág. 38) y no se pauta en una hemorragia. Las otras son correctas: andexanet alfa para apixabán (tabla 47.4, pág. 44), PAS por debajo de 140 mmHg y PIC por debajo de 20 mmHg (pág. 45). Pensar que la 1 es el error dejaría sin revertir el anticoagulante; creer que la PAS ha de ser mayor de 180 mmHg la subiría en una hemorragia activa. Origen: Marino, cap. 47, págs. 38, 44 y 45.',
    },
];
