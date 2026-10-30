// Preguntas de «Neuro urgente» (PIF Radiología). Formato de js/data/merino-hemato-preguntas.js; estilo de autonomo/REGLAS.md §8.
// Cada tema, con al menos una pregunta (un tema vacío rompe el quiz).
// Fuentes: Marino, The ICU Book, 5.ª ed., cap. 47 (docs/marino-2024-neurologia-caps45-47.pdf, págs. del PDF) y
// StatPearls, «Stroke Imaging» (https://www.ncbi.nlm.nih.gov/sites/books/NBK546635/, por sección); N2: Libro Azul de neurología (parte 1),
// Manual UMI (parte 2) y StatPearls, «Brain Herniation» (https://www.ncbi.nlm.nih.gov/books/NBK542246/, por sección).
export const temasPifRadioNeuro = [
    { key: 'pifradio-n1', etiqueta: 'Ictus: ¿isquémico o hemorrágico?' },
    { key: 'pifradio-n2', etiqueta: 'HTIC y hernias' },
    { key: 'pifradio-neuro-caso', etiqueta: 'Caso: déficit agudo que acaba en la UCI' },
];

export const preguntasPifRadioNeuro = [
    // ---- N1 · Ictus: ¿isquémico o hemorrágico? ----
    {
        id: 'pifradio-n1-q001', tema: 'pifradio-n1',
        enunciado: 'Llega un paciente con un déficit neurológico agudo y se sospecha un ictus. La resonancia ve la isquemia en minutos, pero la prueba de entrada es una TC sin contraste. ¿Por qué?',
        opciones: [
            'Porque la resonancia no detecta la isquemia hasta pasadas 24 horas',
            'Porque en la primera hora la TC ya muestra el infarto completo y no hace falta nada más',
            'Porque la angio-TC está contraindicada en todo ictus y la TC simple la sustituye',
            'Es rápida, está disponible y descarta enseguida una hemorragia; la resonancia queda para casos concretos',
        ],
        correcta: 3,
        explicacion: 'La TC sin contraste es la primera prueba porque es rápida, está en todas partes, tiene pocas contraindicaciones y descarta enseguida la hemorragia; la resonancia sí detecta la isquemia en minutos, pero se usa como prueba de rescate o en centros de ictus. Pensar que la resonancia no ve la isquemia hasta las 24 h es falso; esperar que la TC muestre el infarto completo en la primera hora retrasa el diagnóstico, porque la TC hiperaguda puede ser normal o sutil; y la angio-TC no está contraindicada: se recomienda después, en todo candidato a tratamiento. Origen: StatPearls, «Stroke Imaging», secciones «Noncontrast Computed Tomography» y «Integrated Hyperacute Workflows».',
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
        enunciado: 'En la TC sin contraste ves un hematoma hiperdenso que ocupa casi medio hemisferio y se extiende a los ventrículos (fig. 47.3 del libro). ¿Qué complicación vigilas y qué pides?',
        opciones: [
            'Una nueva isquemia por el fármaco que se acaba de dar: se pide una angio-TC para trombolisar',
            'Que la sangre se reabsorba sola en horas: se espera sin consultar y se repite la TC mañana',
            'Hidrocefalia obstructiva: neurocirugía y un catéter de drenaje ventricular, que además mide la PIC',
            'Que baje la presión arterial: se sube la PAS por encima de 180 mmHg para perfundir el hematoma',
        ],
        correcta: 2,
        explicacion: 'La sangre intraventricular suele causar hidrocefalia obstructiva y requiere un catéter de drenaje ventricular, que además sirve para medir la PIC; en la mayoría de las hemorragias intracerebrales se consulta con neurocirugía. Buscar trombólisis en una hemorragia es el tratamiento contrario; esperar sin consultar deja crecer la presión sobre un ventrículo bloqueado; y subir la PAS es lo opuesto a la meta de mantenerla por debajo de 140 mmHg. Origen: Marino, cap. 47, pág. 45 (y fig. 47.3, pág. 43).',
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
    // ---- N2 · HTIC y hernias ----
    {
        id: 'pifradio-n2-q001', tema: 'pifradio-n2',
        enunciado: 'En la TC sin contraste de un paciente con edema cerebral difuso, ¿qué signos esperas encontrar?',
        opciones: [
            'Cisternas muy amplias y surcos muy marcados, porque el cerebro se encoge',
            'Una única zona hiperdensa, redonda y homogénea, sin cambios en los surcos',
            'Pérdida de la unión gris-blanca, de los surcos y de la ínsula, y cisternas comprimidas',
            'Un cerebro completamente normal, porque el edema solo se puede ver con una resonancia magnética',
        ],
        correcta: 2,
        explicacion: 'El edema difuso borra la unión sustancia blanca-gris, la diferenciación del núcleo lenticular, los surcos corticales y la ínsula, y comprime las cisternas subaracnoideas. Esperar cisternas amplias es confundirlo con una atrofia y no sospechar la HTIC; una zona hiperdensa única es un hematoma, que cambia la conducta; y decir que la TC es normal retrasa la búsqueda de la causa, que la TC sí da. Origen: Libro Azul, neurología (parte 1), pág. 909 (PDF 51).',
    },
    {
        id: 'pifradio-n2-q002', tema: 'pifradio-n2',
        enunciado: 'Un paciente con traumatismo tiene en la TAC un swelling en los dos hemisferios y no se ven las cisternas de la base. ¿Qué tipo de Marshall es y qué riesgo de HTIC tiene?',
        opciones: [
            'Tipo III (swelling bilateral, sin cisternas de la base): HTIC en el 63,2 %',
            'Tipo II (lesiones pequeñas y cisternas visibles): HTIC en el 28,6 %',
            'Tipo IV: HTIC en el 100 %, por el swelling bilateral',
            'Tipo I: TAC normal, sin riesgo de HTIC',
        ],
        correcta: 0,
        explicacion: 'Swelling bilateral con ausencia de cisternas de la base es un Marshall III, con HTIC en el 63,2 %. El tipo II exige cisternas visibles: clasificarlo así subestima el riesgo y deja sin vigilar la PIC. El tipo IV es un swelling unilateral con la línea media desviada. El tipo I es una TAC normal: no tiene nada que ver con unas cisternas borradas. Origen: Manual UMI, pág. impresa 94 (PDF 42).',
    },
    {
        id: 'pifradio-n2-q003', tema: 'pifradio-n2',
        enunciado: 'Un hematoma frontal empuja el giro cingulado por debajo de la hoz del cerebro y el paciente pierde fuerza en las piernas. ¿Qué hernia es y qué arteria se compromete?',
        opciones: [
            'Uncal: comprime el III par y da una pupila dilatada, no debilidad de las piernas',
            'Amigdalar: las amígdalas bajan por el foramen magno y comprimen la cerebral media',
            'Central: baja el diencéfalo y se comprime la cerebral posterior contra el tentorio',
            'Subfalcina, por la cerebral anterior',
        ],
        correcta: 3,
        explicacion: 'En la hernia subfalcina el giro cingulado se desliza bajo la hoz y puede comprimir la cerebral anterior; el infarto de ese territorio explica la debilidad de las piernas. Llamarla uncal haría buscar una pupila que no está; la amigdalar es de la fosa posterior y se manifiesta con paro respiratorio; la central baja por la incisura y da una caída del nivel de consciencia, no debilidad aislada de las piernas. Origen: StatPearls, «Brain Herniation», secciones «Patterns of Brain Herniation» y «History and Physical».',
    },
    {
        id: 'pifradio-n2-q004', tema: 'pifradio-n2',
        enunciado: 'Un hematoma temporal derecho empuja el uncus contra el borde del tentorio y comprime el III par derecho. ¿Qué pupila y qué debilidad esperas, de forma clásica?',
        opciones: [
            'Pupila izquierda dilatada y debilidad del lado derecho',
            'Pupila derecha dilatada y poco reactiva, y debilidad del lado izquierdo',
            'Pupilas puntiformes en los dos lados y debilidad del lado derecho',
            'Pupilas normales en los dos lados, porque la hernia uncal no afecta nunca al tercer par craneal',
        ],
        correcta: 1,
        explicacion: 'La hernia uncal da anisocoria del mismo lado de la lesión (pupila dilatada y poco reactiva) y debilidad del lado contrario; el fenómeno de Kernohan-Woltman puede dar debilidad del mismo lado. Invertir los lados haría explorar o drenar el hemisferio equivocado; las pupilas puntiformes son de la fase pontina, no de la hernia uncal temprana; y decir que no hay cambio pupilar retrasa el aviso a neurocirugía. Origen: StatPearls, «Brain Herniation», sección «History and Physical» (y «Pathophysiology», hernia uncal).',
    },
    {
        id: 'pifradio-n2-q005', tema: 'pifradio-n2',
        enunciado: 'La tabla de Marshall del Manual dice «línea media desviada 20 mm» en el tipo IV; para operar un hematoma subdural o una contusión con efecto de masa, el mismo Manual usa más de 5 mm. ¿Cómo lo manejas?',
        opciones: [
            'Esperar a los 20 mm para dar la alarma, así no se opera de más',
            'Mostrar las dos cifras con su nota y no esperar a 20 mm para avisar',
            'Ignorar el umbral de 5 mm, porque la tabla de Marshall manda sobre el resto del Manual',
            'Pensar que 5 y 20 mm son el mismo umbral escrito de dos maneras',
        ],
        correcta: 1,
        explicacion: 'Son dos criterios distintos del Manual: la tabla de Marshall clasifica el TCE y el criterio quirúrgico decide si se opera un hematoma o una contusión con efecto de masa. El «20 mm» de la tabla parece una errata y la fuente no lo aclara, así que se muestran las dos cifras con su nota. Esperar a 20 mm retrasaría el aviso con el cerebro ya comprimido; darle más peso a la tabla es elegir una cifra sin motivo; y creer que son lo mismo no explica una diferencia de 15 mm. Origen: Manual UMI, págs. impresas 94 (tabla) y 83 (línea media >5 mm), y nota de fidelidad de la ficha «HTIC y hernias».',
    },
    // ---- Caso: déficit agudo que acaba en la UCI (N1 + N2) ----
    {
        id: 'pifradio-n1-q007', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (1/7). Hombre de 71 años (paciente inventado), con fibrilación auricular y apixabán, que llega con debilidad brusca del brazo y la pierna izquierdos. La TC sin contraste muestra un hematoma hiperdenso en los ganglios basales derechos, sin sangre en los ventrículos. Piensa antes de mirar las opciones: ¿qué haces en la primera hora, en tres cosas?',
        opciones: [
            'Dar ácido acetilsalicílico 325 mg desde el ingreso como en el isquémico, y vigilar la evolución',
            'Revertir el apixabán (andexanet alfa), PAS por debajo de 140 mmHg y consultar con neurocirugía',
            'Mantener la PA por debajo de 180/105 mmHg como tras una trombólisis, sin tocar el anticoagulante',
            'Esperar la TC de control a las 24 h antes de revertir nada, porque el hematoma ya está formado y no crece',
        ],
        correcta: 1,
        explicacion: 'En la hemorragia intracerebral se revierte el antitrombótico (apixabán o rivaroxabán: andexanet alfa, tabla 47.4, pág. 44), se mantiene la PAS por debajo de 140 mmHg y se consulta con neurocirugía (pág. 45). El AAS es para el isquémico: aquí aumentaría el sangrado (razonamiento propio). El límite de 180/105 es el del isquémico tratado con trombólisis (pág. 35), no el de la hemorragia. Esperar 24 h no es seguro: los hematomas crecen sobre todo en las primeras horas, 26 % en la primera hora según el Libro Azul (neurología, parte 2, pág. 945). Origen: Marino, cap. 47, págs. 35, 44 y 45.',
    },
    {
        id: 'pifradio-n1-q008', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (2/7). Ingresa en la UCI. Seis horas después baja el nivel de consciencia (de Glasgow 14 a 7) y aparece una pupila derecha dilatada. La nueva TC muestra sangre en los ventrículos laterales y ventrículos más grandes. ¿Qué piensas y qué pides?',
        opciones: [
            'Hidrocefalia obstructiva por la sangre: neurocirugía coloca un drenaje que además mide la PIC',
            'Que es una recaída de un infarto previo: se añade antiagregación y se repite la TC mañana por la mañana',
            'Que es un empeoramiento esperable que no cambia nada: seguir con la misma pauta y vigilar por turnos',
            'Que hace falta una nueva angio-TC urgente para decidir si se trombolisa a este paciente',
        ],
        correcta: 0,
        explicacion: 'La sangre intraventricular suele causar hidrocefalia obstructiva y requiere un catéter de drenaje ventricular, que también mide la PIC; el Glasgow de 8 o menos, la sangre intraventricular y la midriasis unilateral (herniación transtentorial) son indicaciones de monitorizarla (págs. 41-45). La pupila derecha dilatada ya era, desde el enunciado, un signo de herniación transtentorial y una indicación de monitorizar la PIC (pág. 45). Añadir antiagregantes agravaría el sangrado, no hacer nada deja crecer la presión y trombolizar a un paciente con hemorragia es lo contrario del tratamiento (los tres, razonamiento propio). Origen: Marino, cap. 47, pág. 45 (ficha «Hemorragia intracerebral»).',
    },
    {
        id: 'pifradio-n1-q009', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (3/7). Al residente de guardia le pides la nota del ingreso y escribe: «Hemorragia intracerebral con extensión ventricular. 1) Apixabán revertido con andexanet alfa. 2) Objetivo de PAS por debajo de 140 mmHg. 3) Se pauta ácido acetilsalicílico 325 mg por su fibrilación auricular. 4) Si se coloca drenaje ventricular, objetivo de PIC por debajo de 20 mmHg.» Hay 0, 1 o 2 errores: ¿cuál es?',
        opciones: [
            'La frase 1: el apixabán no se revierte nunca en una hemorragia intracerebral',
            'La frase 2: en la hemorragia la presión sistólica debe mantenerse por encima de 180 mmHg',
            'No hay ningún error: las cuatro frases de la nota son correctas y se firma sin cambios',
            'La frase 3: el AAS 325 mg es del isquémico y en la hemorragia empeora el sangrado',
        ],
        correcta: 3,
        explicacion: 'Solo falla la frase 3: el AAS a 325 mg es la medida del ictus isquémico (pág. 38) y no se pauta en una hemorragia. Las otras son correctas: andexanet alfa para apixabán (tabla 47.4, pág. 44), PAS por debajo de 140 mmHg y PIC por debajo de 20 mmHg (pág. 45). Pensar que la 1 es el error dejaría sin revertir el anticoagulante; creer que la PAS ha de ser mayor de 180 mmHg la subiría en una hemorragia activa. Origen: Marino, cap. 47, págs. 38, 44 y 45.',
    },
    {
        id: 'pifradio-n1-q010', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (4/7). Cuatro horas después de colocar el drenaje, la PIC marca 28 mmHg. La pupila derecha está dilatada y poco reactiva. La TC muestra la cisterna pontocerebelosa derecha ensanchada y la izquierda borrada, y la línea media desviada a la izquierda. Piensa antes de mirar las opciones: ¿qué hernia es, qué par craneal comprime y de qué lado esperas la debilidad?',
        opciones: [
            'Subfalcina: comprime la cerebral anterior y da debilidad de las piernas, sin cambios en la pupila',
            'Amigdalar: comprime el bulbo en el foramen magno y no cambia la pupila',
            'Uncal derecha: comprime el III par derecho y la debilidad es del lado izquierdo',
            'Ascendente: una masa de la fosa posterior empuja hacia arriba y aplana las cuadrigeminales',
        ],
        correcta: 2,
        explicacion: 'Cisterna pontocerebelosa del mismo lado ensanchada, la contraria borrada y pupila dilatada del mismo lado: hernia uncal derecha, con compresión del III par derecho y debilidad esperable en el lado izquierdo. La subfalcina no cambia la pupila; la amigdalar no se explica con una masa del hemisferio y daría un cuadro bulbar; la ascendente viene de una masa de la fosa posterior, que aquí no hay. Origen: StatPearls, «Brain Herniation», secciones «Evaluation» e «History and Physical»; Marino, cap. 45, pág. 11 (pupila unilateral dilatada y fija).',
    },
    {
        id: 'pifradio-n1-q011', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (5/7). La PIC se mantiene en 28 mmHg más de 10 minutos y la presión arterial media es de 85 mmHg. ¿Cuál es la presión de perfusión cerebral y cómo está respecto a la meta de Marino (50-70 mmHg)?',
        opciones: [
            '57 mmHg: dentro de la meta, con poco margen si la PAM baja',
            '113 mmHg (suma de las dos presiones): sobra perfusión y se puede bajar la tensión arterial',
            '57 mmHg, pero por debajo de la meta, así que hay que subir la PAM de inmediato',
            '28 mmHg: la presión de perfusión coincide con la PIC y no hay nada que hacer',
        ],
        correcta: 0,
        explicacion: 'La PPC es la PAM menos la PIC: 85 − 28 = 57 mmHg, dentro de 50-70 mmHg, y una PIC por encima de 20 mmHg durante más de 5 minutos cumple la definición de HTIC. Sumar las presiones (113) llevaría a bajar la tensión y a quitar perfusión; decir que 57 está por debajo de la meta empujaría la PAM sin necesidad; igualar PPC y PIC abandona al paciente. Origen: Marino, cap. 47, pág. 45 (PPC = PAM − PIC, meta 50-70) y Libro Azul, neurología (parte 1), pág. 871 (definición de HTIC).',
    },
    {
        id: 'pifradio-n1-q012', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (6/7). Dos horas después las dos pupilas están dilatadas y no reaccionan; la PA sube a 205/100 mmHg, la FC baja a 48 lpm y la respiración es irregular. ¿Qué indica?',
        opciones: [
            'Que el paciente mejora: la PA alta y la bradicardia indican buena perfusión cerebral y no hace falta hacer nada más',
            'Una crisis comicial: se trata con un anticomicial y se espera sin repetir la TC',
            'Un efecto de la sedación, que se suspende y se explora de nuevo dentro de unas horas',
            'Herniación con compromiso del tronco: tríada de Cushing con pupilas midriáticas arreactivas',
        ],
        correcta: 3,
        explicacion: 'Hipertensión, bradicardia y respiración irregular son la tríada de Cushing, y las pupilas midriáticas arreactivas corresponden a la fase bulbar del deterioro rostrocaudal: la herniación comprime el tronco. Tomarlo por una mejoría pierde minutos que el paciente no tiene; tratarlo como una crisis o como sedación deja sin tratar la presión, y podría acabar en parada (razonamiento propio). Origen: StatPearls, «Brain Herniation», sección «Pathophysiology» (hernia central, tríada de Cushing); Libro Azul, neurología (parte 1), págs. 870-871 (tabla 1, fase bulbar).',
    },
    {
        id: 'pifradio-n1-q013', tema: 'pifradio-neuro-caso',
        enunciado: 'Caso (7/7). Neurocirugía propone una craniectomía descompresiva. ¿Qué busca, según el Libro Azul?',
        opciones: [
            'Solo evacuar el hematoma y poco más, sin cambiar ni la PIC ni la perfusión cerebral del paciente',
            'Bajar la PIC, mejorar la presión de perfusión cerebral y evitar las herniaciones y la compresión del tronco',
            'Sustituir el drenaje ventricular, que ya no se necesitará nunca más',
            'Poder retirar la sedación y despertar al paciente hoy mismo',
        ],
        correcta: 1,
        explicacion: 'Los objetivos de la craniectomía descompresiva son controlar la PIC, mejorar la presión de perfusión, evitar las herniaciones y la compresión del tronco, y reducir la mortalidad; en el Manual es una medida de segundo nivel. Reducirla a evacuar el hematoma ignora su efecto sobre la presión; retirar el drenaje o la sedación no es su objetivo y arriesga un nuevo pico de presión. Lo que te llevas: en la TC, cisternas y línea media avisan antes de que la pupila se dilate; la clínica confirma; y la pupila, el Cushing y la PIC mandan la urgencia. Origen: Libro Azul, neurología (parte 1), pág. 917 (PDF 59) y Manual UMI, pág. impresa 83 (2.º nivel).',
    },
];
