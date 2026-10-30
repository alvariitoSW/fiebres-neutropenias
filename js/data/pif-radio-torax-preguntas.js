// Preguntas de «Tórax de UCI» (PIF Radiología). Formato de js/data/merino-hemato-preguntas.js; estilo de autonomo/REGLAS.md §8.
// Cada tema, con al menos una pregunta (un tema vacío rompe el quiz).
// Fuente (T2 y T3, además): cap. 18 (docs/marino-2024-cardiac-disorders-caps18-21.pdf), caps. 22-24 (docs/marino-2024-respiratory-management-caps22-26.pdf), apéndice 2
// (docs/marino-2024-toxicologia-caps52-53-apendices.pdf) y StatPearls (Lung Imaging NBK558976; Hounsfield Unit NBK547721; CT Instrumentation and Physics NBK597347; CT-scan Image Production Procedures NBK574548), citadas con su sección.
// Fuente: Marino PL. The ICU Book, 5.ª ed.: cap. 28 y 29 (docs/marino-2024-respiratory-management-caps27-30.pdf) y cap. 2
// (docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf). Las páginas son las del PDF de docs/.
// CASO «Tórax de UCI» (tema pifradio-torax-caso): T1 escribe los pasos 1-3 (neumotórax). T2 y T3 lo continúan con los
// ids pifradio-t2-caso… y pifradio-t3-caso… (mismo tema); el último paso lleva «Lo que te llevas». Paciente: varón de 52 años,
// neumonía grave, intubado, día 3 de UCI (cifras inventadas del caso).
export const temasPifRadioTorax = [
    { key: 'pifradio-t1', etiqueta: 'Neumotórax y derrame en la placa' },
    { key: 'pifradio-t2', etiqueta: 'Patrones y edema en la placa' },
    { key: 'pifradio-t3', etiqueta: 'Introducción a la TC' },
    { key: 'pifradio-torax-caso', etiqueta: 'Caso: el intubado que empeora tras la vía central' },
];

export const preguntasPifRadioTorax = [
    {
        id: 'pifradio-t1-q001', tema: 'pifradio-t1',
        enunciado: 'Paciente en supino, con un neumotórax pequeño. ¿Dónde se acumula el aire pleural y, por tanto, dónde lo buscas en la placa portátil?',
        opciones: [
            'En el vértice, como en la placa de pie',
            'En la axila, a la altura de la línea axilar media del lado afectado',
            'Delante de ambas bases, la zona más alta',
            'Detrás del pulmón, pegado a la columna, en la zona más baja',
        ],
        correcta: 2,
        explicacion: 'En supino el aire pleural se colecta en la región más alta del hemitórax, que es la anterior, justo delante de ambas bases (Origen: Marino, cap. 28, pág. 26). Buscarlo en el vértice lo deja pasar: no se acumula allí en supino y el paciente seguiría con un neumotórax sin ver (Origen: Marino, cap. 28, pág. 26). Detrás del pulmón, junto a la columna, es la zona declive: el aire sube, no se queda allí (razonamiento propio, mismo origen). La axila no es la zona más alta del paciente tumbado (razonamiento propio, mismo origen).',
    },
    {
        id: 'pifradio-t1-q002', tema: 'pifradio-t1',
        enunciado: 'Le pones una subclavia derecha a un crítico y la placa portátil posterior sale sin hallazgos. ¿Qué concluyes?',
        opciones: [
            'No hay neumotórax: la placa portátil es el estándar y basta para descartarlo',
            'No lo descarto: la placa se pierde hasta el 50 %',
            'Todas las subclavias lo producen, así que dejo el tubo puesto por si acaso',
            'Repetir la placa con el paciente de pie, que es la única fiable',
        ],
        correcta: 1,
        explicacion: 'La placa portátil no detecta hasta el 50 % de los neumotórax del crítico, y la eco tiene más sensibilidad y se recomienda en su lugar tras el catéter (Origen: Marino, cap. 2, págs. 34-35). Darlo por descartado deja un neumotórax sin tratar que puede crecer con la ventilación (Origen: Marino, cap. 2, pág. 34). Con subclavia la incidencia es del 1 % con eco y del 4 % sin ella, no del 100 % (Origen: Marino, cap. 2, pág. 34). Un crítico intubado no se pone de pie para la placa (razonamiento propio sobre Marino, cap. 28, pág. 26).',
    },
    {
        id: 'pifradio-t1-q003', tema: 'pifradio-t1',
        enunciado: 'Un ventilado empeora y sospechas barotrauma. ¿Qué dato de la exploración es el más específico de neumotórax?',
        opciones: [
            'La ausencia de ruidos respiratorios',
            'La disminución de la saturación de oxígeno',
            'La hipotensión leve con taquicardia',
            'Enfisema subcutáneo en cuello y tórax',
        ],
        correcta: 3,
        explicacion: 'El hallazgo clínico más específico es el enfisema subcutáneo, que aparece primero en el cuello y la parte alta del tórax (Origen: Marino, cap. 28, pág. 26). La ausencia de ruidos respiratorios es poco fiable en ventilación mecánica: los ruidos del tubo y del respirador se confunden con los del pulmón, y fiarte de ella puede hacerte descartar un neumotórax real (Origen: Marino, cap. 28, pág. 26). La hipoxemia y la hipotensión sí pueden aparecer en el de barotrauma, pero no son específicas (Origen: Marino, cap. 28, pág. 26).',
    },
    {
        id: 'pifradio-t1-q004', tema: 'pifradio-t1',
        enunciado: 'En la placa portátil de un ventilado inestable, ¿qué trío de signos te hace pensar en neumotórax a tensión?',
        opciones: [
            'Pulmón colapsado sin trama, mediastino hacia el mismo lado y hemidiafragma elevado en ese lado',
            'Sin trama, mediastino al lado contrario y diafragma deprimido',
            'Trama aumentada en las bases, silueta cardiaca grande y derrame bilateral',
            'Sin trama pulmonar, mediastino centrado y diafragmas simétricos',
        ],
        correcta: 1,
        explicacion: 'La tensión se reconoce por la ausencia de trama pulmonar en el hemitórax, el desplazamiento del mediastino hacia el lado contrario y el hemidiafragma deprimido (Origen: Marino, cap. 28, págs. 27-29, fig. 28.7). Un mediastino que tira hacia el mismo lado y un diafragma elevado son signos de pérdida de volumen, no de tensión, y confundirlos retrasa la descompresión de un shock obstructivo (Origen: Marino, cap. 28, pág. 28). Una silueta grande con derrame bilateral apunta a otra causa (razonamiento propio). Con el mediastino centrado y los diafragmas simétricos no hay tensión (Origen: Marino, cap. 28, pág. 28).',
    },
    {
        id: 'pifradio-t1-q005', tema: 'pifradio-t1',
        enunciado: 'Tensión confirmada, el paciente se hunde. ¿Cómo descomprimes con aguja?',
        opciones: [
            'Catéter corto de 5 cm en el 2.º espacio intercostal, en la línea medioclavicular',
            'Aguja fina en el 8.º espacio intercostal, en la línea axilar posterior',
            'Angiocatéter de 14 G y 8 cm en el 5.º espacio, delante de la línea axilar media',
            'Esperar la TC del paciente y entonces pinchar donde se vea el aire',
        ],
        correcta: 2,
        explicacion: 'El procedimiento recomendado es un angiocatéter de 14 G y 8 cm en el 5.º espacio intercostal justo por delante de la línea axilar media (Origen: Marino, cap. 28, pág. 29). Los catéteres más cortos y el 2.º espacio en la línea medioclavicular fallan más, y el aire seguiría comprimiendo el mediastino (Origen: Marino, cap. 28, pág. 29). Esperar a la TC retrasa una emergencia que exige descompresión inmediata y el paciente puede llegar a parada en actividad eléctrica sin pulso (Origen: Marino, cap. 28, págs. 28-29). Un 8.º espacio posterior no es lo que da la fuente (Origen: Marino, cap. 28, pág. 29).',
    },
    {
        id: 'pifradio-t1-q006', tema: 'pifradio-t1',
        enunciado: 'Neumonía con derrame libre: en la eco mide 8 mm de grosor. ¿Qué haces con él?',
        opciones: [
            'Nada invasivo: pequeño y libre, sin toracocentesis',
            'Toracocentesis diagnóstica para medir el pH y la glucosa',
            'Un tubo de 8,5-14 Fr desde el primer momento',
            'Un tubo grande de 28-36 Fr, que drena mejor que ninguno',
        ],
        correcta: 0,
        explicacion: 'Menos de 10 mm, libre, no necesita toracocentesis (Origen: Marino, cap. 29, págs. 45-46, tabla 29.5). La toracocentesis, con pH, glucosa y Gram, se reserva a más de 10 mm y menos de la mitad del hemitórax: en uno de 8 mm sería un pinchazo sin indicación (Origen: Marino, cap. 29, pág. 46). El tubo de 8,5-14 Fr es para loculado o más del 50 % del hemitórax, y en uno de 8 mm expondría a un drenaje sin necesidad (Origen: Marino, cap. 29, pág. 46). El tubo de 28-36 Fr lo prefieren algunos solo para el pus, y los de 8,5-14 Fr drenan igual (Origen: Marino, cap. 29, pág. 46).',
    },
    {
        id: 'pifradio-t1-caso1', tema: 'pifradio-torax-caso',
        enunciado: 'Caso, paso 1 (día 3). Varón de 52 años con neumonía grave, intubado y sedado. Le canalizan una subclavia derecha y la placa portátil de control es normal. Una hora después, la saturación baja de 96 a 89 % y la PA de 118/70 a 90/55 (cifras inventadas del caso). Piensa antes de mirar las opciones: ¿qué haces con la placa «normal»?',
        opciones: [
            'La placa normal descarta el neumotórax: busco otra causa, como la sepsis',
            'Sospecho neumotórax y lo compruebo con eco, listo para descomprimir',
            'Repito la placa a las 6 horas, a ver si ya se ve algo',
            'Pincho a ciegas el 2.º espacio sin más pruebas y sin eco',
        ],
        correcta: 1,
        explicacion: 'Hipoxemia o hipotensión sin explicar en un ventilado, tras un catéter, es la sospecha de neumotórax a tensión; la placa portátil se pierde hasta el 50 % y el aire en supino se esconde delante, y la eco es más sensible (Origen: Marino, cap. 28, págs. 26-28; cap. 2, págs. 34-35). Atribuirlo a sepsis mientras el neumotórax crece puede llevarlo a shock obstructivo (Origen: Marino, cap. 28, pág. 27). Esperar 6 horas es tiempo que el paciente no tiene (razonamiento propio sobre la misma fuente). El 2.º espacio falla más y no se punciona sin sospecha confirmada (Origen: Marino, cap. 28, pág. 29).',
    },
    {
        id: 'pifradio-t1-caso2', tema: 'pifradio-torax-caso',
        enunciado: 'Caso, paso 2. Veinte minutos después: PA 72/40, saturación 82 %. El residente de guardia escribe la nota. Una de las cuatro frases marcadas contiene un error (hay solo uno): «(A) La placa muestra el hemitórax derecho sin trama pulmonar, con el mediastino desplazado hacia el mismo lado derecho. (B) Es un neumotórax a tensión: no espero a la TC y descomprimo ya. (C) Pincho un angiocatéter de 14 G y 8 cm en el 5.º espacio, justo por delante de la línea axilar media. (D) Si falla, hago descompresión digital y después dejo un tubo de 8,5-14 Fr.» ¿Cuál es la frase errónea?',
        opciones: [
            'A: en la tensión el mediastino se desplaza hacia el lado contrario, no al mismo',
            'B: no se descomprime antes de la TC',
            'C: el angiocatéter de 14 G y 8 cm no se usa para descomprimir',
            'D: después de la descompresión no se deja tubo',
        ],
        correcta: 0,
        explicacion: 'El error es la frase A: en la tensión el mediastino se desplaza hacia el lado contrario, con el hemidiafragma deprimido (Origen: Marino, cap. 28, págs. 28-29). B es correcta: es una emergencia que exige descompresión inmediata, y esperar a la TC llevaría a la parada (Origen: Marino, cap. 28, pág. 29). C es correcta: es justo el material y el sitio recomendados, y no usarlo dejaría al paciente sin alivio (Origen: Marino, cap. 28, pág. 29). D es correcta: tras la descompresión se inserta un tubo pequeño de 8,5-14 Fr, y sin él el aire se reacumularía (Origen: Marino, cap. 28, pág. 29).',
    },
    {
        id: 'pifradio-t1-caso3', tema: 'pifradio-torax-caso',
        enunciado: 'Caso, paso 3. Descomprimido y con un tubo torácico de 12 Fr dirigido hacia delante y arriba, el paciente remonta: PA 112/68 y saturación 95 %. Pero en la cámara de sello de agua burbujea el aire con cada insuflación. El residente quiere conectar aspiración a −20 cm H2O «para cerrar la fuga antes». Piensa antes de mirar las opciones: ¿qué le contestas?',
        opciones: [
            'Que lo haga: la aspiración cierra la fístula bronquial más rápido',
            'Que mantenga el sello de agua: es una fuga por fístula y aspirar puede perpetuarla',
            'Que retire el tubo, porque el burbujeo indica que está mal colocado y no sirve',
            'Que lo cambie por uno de 28-36 Fr para que drene mejor el aire',
        ],
        correcta: 1,
        explicacion: 'Las burbujas en el sello de agua son la prueba de una fuga de aire por una fístula broncopleural, no de un tubo mal puesto (Origen: Marino, cap. 28, pág. 30). La aspiración suele ser innecesaria y puede mantener la fuga y retrasar el cierre de la fístula; si hay fuga mientras se aspira, se apaga (Origen: Marino, cap. 28, págs. 30-31). Retirar el tubo con una fuga activa en un ventilado con presión positiva deja el aire sin salida, con riesgo de un nuevo neumotórax a tensión (razonamiento propio, a partir de Marino, cap. 28, págs. 27-28). Los tubos de 28-36 Fr los prefieren algunos solo para el pus (Origen: Marino, cap. 29, pág. 46).',
    },
    {
        id: 'pifradio-t2-q001', tema: 'pifradio-t2',
        enunciado: 'Ventilado con fiebre y un infiltrado nuevo en la placa portátil. ¿Cuánto te ayuda ese infiltrado a decir que es una neumonía?',
        opciones: [
            'Mucho: la placa con infiltrado confirma la neumonía en casi todos los casos',
            'Poco: es sensible, pero su especificidad es del 26 % y la neumonía es solo un tercio de los infiltrados',
            'Nada: en el crítico la placa nunca muestra infiltrados por neumonía',
            'Solo vale si el infiltrado es bilateral y uniforme, porque entonces es neumonía',
        ],
        correcta: 1,
        explicacion: 'El infiltrado tiene una sensibilidad del 89 % pero una especificidad de solo el 26 %, y la neumonía supone un tercio de los infiltrados en la UCI; el resto son atelectasia focal, edema o SDRA (Origen: Marino, cap. 29, págs. 40-41, tabla 29.4). Darlo por confirmación llevaría a tratar como neumonía un edema o un SDRA (Origen: Marino, cap. 29, pág. 40). Decir que nunca los muestra es falso: la sensibilidad es alta (Origen: Marino, cap. 29, pág. 40). Un infiltrado bilateral y uniforme es más propio del SDRA clásico que de una neumonía (Origen: Marino, cap. 24, pág. 36).',
    },
    {
        id: 'pifradio-t2-q002', tema: 'pifradio-t2',
        enunciado: 'Sospechas un SDRA en un paciente con hipoxemia grave y la placa sale sin infiltrados. ¿Qué concluyes?',
        opciones: [
            'Que no lo descarta: su valor predictivo negativo es del 47 %',
            'Que lo descarta: sin infiltrados en la placa no puede haber SDRA y se busca otra causa',
            'Que es un SDRA seguro, porque la placa siempre sale normal en él',
            'Que hay que repetir la placa a las 24 h antes de pensar en nada más',
        ],
        correcta: 0,
        explicacion: 'Frente a la TC, la placa tiene un valor predictivo negativo del 47 %, «cara o cruz», y la placa puede ser normal en las primeras horas (Origen: Marino, cap. 24, págs. 35-36). Descartarlo por la placa deja sin tratar un SDRA real (Origen: Marino, cap. 24, pág. 36). Que sea siempre normal es falso: los infiltrados bilaterales suelen aparecer en menos de 24 h (Origen: Marino, cap. 24, pág. 35). Esperar a repetirla retrasa la decisión con un paciente hipoxémico (razonamiento propio sobre Marino, cap. 24, pág. 35).',
    },
    {
        id: 'pifradio-t2-q003', tema: 'pifradio-t2',
        enunciado: 'Placa con infiltrados bilaterales que irradian desde los hilios y derrames pleurales. ¿Qué orienta?',
        opciones: [
            'SDRA clásico: infiltrado uniforme en todos los campos y sin derrame',
            'Atelectasia del pulmón izquierdo por un tubo en el bronquio derecho',
            'Edema cardiogénico: la distribución desde los hilios es el rasgo que lo distingue',
            'Neumonía basal de la derecha, por la posición del paciente',
        ],
        correcta: 2,
        explicacion: 'Los infiltrados que irradian desde los hilios son el rasgo que distingue el edema cardiogénico del no cardiogénico, y los derrames son frecuentes (Origen: Marino, cap. 18, pág. 8). El SDRA clásico es uniforme y sin derrame, y atribuirle esta placa dejaría sin tratar la congestión (Origen: Marino, cap. 24, pág. 36). La atelectasia por intubación selectiva es de un solo pulmón, no bilateral (Origen: Marino, cap. 28, pág. 19). Una neumonía basal por posición no explica infiltrados bilaterales hiliares (razonamiento propio sobre Marino, cap. 29, pág. 41).',
    },
    {
        id: 'pifradio-t2-q004', tema: 'pifradio-t2',
        enunciado: 'Infiltrados bilaterales y una cuña pulmonar de 14 mmHg. ¿Qué haces con ese dato?',
        opciones: [
            'Descarto el edema cardiogénico: la cuña normal mide la presión capilar hidrostática',
            'Confirmo el SDRA: una cuña de 18 mmHg o menos lo define',
            'Lo uso como único criterio para decidir si hay sobrecarga',
            'No excluyo el edema cardiogénico: la cuña no mide la presión capilar hidrostática',
        ],
        correcta: 3,
        explicacion: 'Una cuña normal no excluye el edema cardiogénico, porque no mide la presión capilar hidrostática (Origen: Marino, cap. 24, págs. 36-37). Descartarlo por ese dato puede dejar sin tratar una congestión (Origen: Marino, cap. 24, pág. 37). Usar la cuña de 18 mmHg o menos como criterio de SDRA es, según Marino, problemático (Origen: Marino, cap. 24, pág. 36). Fiarse de ella como único criterio repite ese error (Origen: Marino, cap. 24, pág. 37).',
    },
    {
        id: 'pifradio-t2-q005', tema: 'pifradio-t2',
        enunciado: 'Opacidad basal con el mediastino desviado hacia ese lado y el hemidiafragma elevado. ¿Qué es más probable?',
        opciones: [
            'Consolidación neumónica, que suele conservar el volumen pulmonar y no desvía el mediastino',
            'Atelectasia: hay pérdida de volumen con ese desvío y esa elevación',
            'Neumotórax a tensión, con el mediastino desplazado hacia el lado del aire',
            'Edema cardiogénico, que desplaza el mediastino hacia el lado del edema',
        ],
        correcta: 1,
        explicacion: 'La atelectasia se asocia a pérdida de volumen, desvío del mediastino hacia el lado afectado y elevación del diafragma, a diferencia de la consolidación, que suele conservar el volumen (Origen: StatPearls, Lung Imaging, «Plain Films»). Pensar en consolidación llevaría a buscar solo antibiótico cuando quizá haya un tapón o un tubo mal situado (Origen: Marino, cap. 28, págs. 19 y 23). En la tensión el mediastino se desplaza al lado contrario (Origen: Marino, cap. 28, pág. 28). El edema cardiogénico es bilateral y no desvía el mediastino (razonamiento propio sobre Marino, cap. 18, pág. 8).',
    },
    {
        id: 'pifradio-t3-q001', tema: 'pifradio-t3',
        enunciado: 'Sospecha de embolia pulmonar en un crítico y la angio-TC sale normal. ¿Qué significa?',
        opciones: [
            'Que la embolia queda esencialmente excluida: su valor predictivo negativo es del 95 %',
            'Que no sirve de nada, porque la angio-TC no ve émbolos subsegmentarios',
            'Que hay que completar con una gammagrafía de ventilación-perfusión siempre',
            'Que la embolia es posible en la mitad de los casos y hay que repetir',
        ],
        correcta: 0,
        explicacion: 'Una angio-TC normal elimina esencialmente la embolia pulmonar: su valor predictivo negativo es del 95 % (Origen: Marino, cap. 22, pág. 5). Decir que no sirve ignora que llega hasta el nivel subsegmentario (Origen: Marino, cap. 22, pág. 5). La gammagrafía no se favorece porque los infiltrados la hacen anormal, y pedirla de rutina retrasa el diagnóstico (Origen: Marino, cap. 22, pág. 6). La cifra de «la mitad» corresponde al valor de la placa en el SDRA, no a la angio-TC (Origen: Marino, cap. 24, pág. 36).',
    },
    {
        id: 'pifradio-t3-q002', tema: 'pifradio-t3',
        enunciado: 'Ventilado en UCI con sospecha de embolia. El D-dímero sale elevado. ¿Cuánto te sirve?',
        opciones: [
            'Mucho: elevado confirma la embolia',
            'Poco para descartar: sale elevado en la mayoría de los ingresados, así que no discrimina',
            'Lo suficiente para saltarte la imagen cuando es muy alto',
            'Nada si es normal, aunque tampoco ayudaría si estuviera alto',
        ],
        correcta: 2,
        explicacion: 'Hasta el 80 % de los pacientes de UCI tienen el D-dímero elevado, por eso no resulta útil en ellos; su valor predictivo positivo es del 27 % (Origen: Marino, cap. 22, pág. 3). Tomarlo como confirmación lleva a anticoagular sin diagnóstico (Origen: Marino, cap. 22, pág. 3). Saltarse la imagen por un valor alto repite ese error, y la angio-TC es el método de elección (Origen: Marino, cap. 22, págs. 3-4). Es una frase que no distingue lo que dice la fuente (razonamiento propio sobre Marino, cap. 22, pág. 3).',
    },
    {
        id: 'pifradio-t3-q003', tema: 'pifradio-t3',
        enunciado: 'En la escala Hounsfield de una TC, ¿qué valores se dan al agua destilada y al aire?',
        opciones: [
            'Agua −1000 y aire 0 unidades Hounsfield',
            'Agua 1000 y aire −1000, porque el agua es densa',
            'Agua 0 y aire 1000, porque el aire ocupa más',
            'Agua 0 y aire −1000 unidades Hounsfield',
        ],
        correcta: 3,
        explicacion: 'El agua destilada vale 0 y el aire −1000 unidades Hounsfield; el hueso llega hasta unos 1000 y los metales superan 3000 (Origen: StatPearls, Hounsfield Unit, «Definition/Introduction»). Invertirlos haría leer el pulmón aireado como denso y la consolidación como aire (Origen: StatPearls, Hounsfield Unit, «Definition/Introduction»). El valor de 1000 corresponde al hueso, no al agua (Origen: StatPearls, Hounsfield Unit, «Definition/Introduction»). El aire es el valor más bajo de la escala, no el más alto (Origen: StatPearls, Hounsfield Unit, «Definition/Introduction»).',
    },
    {
        id: 'pifradio-t3-q004', tema: 'pifradio-t3',
        enunciado: 'Quieres comparar en la misma imagen estructuras de densidades muy distintas. ¿Qué ventana eliges?',
        opciones: [
            'Una ventana estrecha, de 50-350 HU, que da más contraste',
            'Una ventana ancha, de 400-2000 HU, aceptando menos contraste',
            'Cualquiera: la anchura de la ventana no cambia lo que se ve',
            'Una ventana de nivel 0, que muestra todas las densidades por igual',
        ],
        correcta: 1,
        explicacion: 'La ventana ancha (400-2000 HU) sirve para estructuras de densidades muy distintas, a costa de contraste: cuanto mayor la anchura, menos contraste (Origen: StatPearls, CT-scan Image Production Procedures, «Issues of Concern»). La estrecha (50-350 HU) es para densidades parecidas, y con ella las muy distintas se saturan (Origen: StatPearls, mismo artículo). La anchura sí cambia el contraste de la imagen (Origen: StatPearls, mismo artículo). El nivel es el punto medio de la escala de grises, no un modo de ver todo igual (Origen: StatPearls, CT Instrumentation and Physics, «Definition/Introduction»).',
    },
    {
        id: 'pifradio-t3-q005', tema: 'pifradio-t3',
        enunciado: 'Crítico con sospecha de embolia y un aclaramiento de creatinina de 25 mL/min/1,73 m². ¿Cómo planteas la angio-TC?',
        opciones: [
            'La pido sin más: el riesgo del contraste no cuenta frente a un valor predictivo negativo del 95 %',
            'La descarto siempre: con insuficiencia renal no hay ninguna alternativa',
            'La evito y busco alternativas; si es imprescindible, volumen y N-acetilcisteína',
            'La hago y repito la placa a las 2 horas para vigilar el riñón',
        ],
        correcta: 2,
        explicacion: 'Con un aclaramiento menor de 30 mL/min/1,73 m² se evita la angio-TC por la nefropatía por contraste; si es imprescindible, se da volumen y N-acetilcisteína intravenosa (Origen: Marino, cap. 22, pág. 6). Pedirla sin más expone el riñón a una lesión añadida (Origen: Marino, cap. 22, pág. 6). Existen alternativas, como la eco venosa de miembros inferiores, la ecocardiografía y la gammagrafía si no se puede hacer la angio-TC (Origen: Marino, cap. 22, págs. 4 y 6). Una placa a las 2 horas no mide el riñón (razonamiento propio sobre Marino, cap. 22, pág. 6).',
    },
    {
        id: 'pifradio-t2-caso4', tema: 'pifradio-torax-caso',
        enunciado: 'Caso, paso 4 (día 5). Tras el drenaje, el paciente de 52 años mejora, pero ahora tiene 38,6 ºC, secreciones purulentas, un balance de +3 L y PaO2/FiO2 de 130 con PEEP 8 (cifras inventadas del caso). La placa nueva muestra infiltrados bilaterales difusos. Piensa antes de mirar las opciones: ¿qué te dice la placa por sí sola?',
        opciones: [
            'Edema cardiogénico seguro: el balance positivo y los infiltrados bilaterales bastan para tratarlo con diuréticos',
            'SDRA confirmado: PaO2/FiO2 menor de 300 con infiltrados bilaterales cumple los criterios',
            'No separa neumonía, SDRA y edema: la uso con la clínica y, si no aclara, pido más',
            'Neumonía asociada a la ventilación: infiltrado nuevo y fiebre la confirman',
        ],
        correcta: 2,
        explicacion: 'Con infiltrados bilaterales y fiebre, la placa no separa los tres cuadros: el infiltrado tiene una especificidad del 26 % para neumonía, la placa tiene un valor predictivo negativo del 47 % en el SDRA y la distribución desde los hilios es solo orientativa (Origen: Marino, cap. 29, pág. 40; cap. 24, pág. 36; cap. 18, pág. 8). Dar el edema por seguro ignora que una cuña normal no lo excluye ni lo confirma, y puede llevar a diuréticos mientras hay una infección sin tratar (Origen: Marino, cap. 24, págs. 36-37). Dar el SDRA por confirmado olvida que el criterio exige que no haya evidencia de fallo izquierdo o sobrecarga, y aquí hay un balance de +3 L (Origen: Marino, cap. 24, pág. 35). Dar la neumonía por confirmada repite el error del 26 % de especificidad (Origen: Marino, cap. 29, pág. 40).',
    },
    {
        id: 'pifradio-t3-caso5', tema: 'pifradio-torax-caso',
        enunciado: 'Caso, paso 5 (día 6). Con antibiótico y diurético, el paciente empeora: PaO2/FiO2 de 85 con PEEP 10. La placa sigue igual de borrosa. Decides pedir una TC de tórax. ¿Qué esperas que aporte y a qué precio?',
        opciones: [
            'Nada que la placa no dé: la TC repite la placa con más radiación',
            'Ver el mediastino mejor, a cambio de contraste obligatorio y de una dosis menor que la de la placa',
            'Ver los cambios de la neumonía mejor, sin ningún riesgo añadido si el paciente va sedado',
            'Ver la consolidación posterior densa, a cambio de traslado y de 7 mSv',
        ],
        correcta: 3,
        explicacion: 'La TC es la técnica más fiable en el SDRA y muestra la consolidación densa posterior de la fase precoz, que la placa pierde (valor predictivo negativo del 47 %); el precio es el traslado a radiología, un riesgo que Marino cita, y 7 mSv frente a 0,02 de una placa (Origen: Marino, cap. 24, págs. 36-38; cap. 22, pág. 4; apéndice 2, pág. 37). Decir que no aporta nada ignora ese 47 % (Origen: Marino, cap. 24, pág. 36). Una TC de tórax no lleva siempre contraste, y su dosis es mayor que la de la placa, no menor (Origen: Marino, apéndice 2, pág. 37). Sedado no es seguro: el traslado supone un riesgo (Origen: Marino, cap. 22, pág. 4).',
    },
    {
        id: 'pifradio-t3-caso6', tema: 'pifradio-torax-caso',
        enunciado: 'Caso, paso 6. La TC muestra consolidación densa en las regiones posteriores de ambos pulmones. El residente escribe la nota; una de las cuatro frases tiene un error (solo uno): «(A) La consolidación posterior densa es el aspecto de la fase precoz del SDRA. (B) El decúbito prono podría rendir más cuando hay consolidación posterior densa; es una propuesta, no una regla. (C) El traslado a la TC no conlleva ningún riesgo si el paciente va sedado. (D) La dosis de una TC de tórax (7 mSv) supera con mucho la de una placa (0,02 mSv).» ¿Cuál es la errónea?',
        opciones: [
            'C: el traslado a radiología sí conlleva un riesgo',
            'A: la fase precoz no tiene consolidación posterior',
            'B: el prono nunca depende de la imagen de la TC',
            'D: la dosis de la TC es menor que la de la placa',
        ],
        correcta: 0,
        explicacion: 'El error es C: Marino cuenta el riesgo del traslado a radiología como un coste real (Origen: Marino, cap. 22, pág. 4); declararlo nulo llevaría a trasladar sin preparar al paciente. A es correcta: la fase precoz muestra consolidación densa en regiones posteriores, y negarlo llevaría a no reconocer el SDRA precoz (Origen: Marino, cap. 24, págs. 36-38). B es correcta: se propone que el éxito del prono dependa de la TC, y negarlo ignora esa propuesta (Origen: Marino, cap. 24, pág. 44). D es correcta: 7 mSv frente a 0,02, y afirmar lo contrario subestima la radiación (Origen: Marino, apéndice 2, pág. 37).',
    },
    {
        id: 'pifradio-t3-caso7', tema: 'pifradio-torax-caso',
        enunciado: 'Caso, paso 7 (día 8). El paciente, ya en prono y mejorando, presenta de golpe taquicardia y la saturación cae de 93 a 84 %. Sospechas una embolia. El D-dímero es de 2400 ng/mL y el aclaramiento de creatinina está conservado (cifras inventadas del caso). ¿Qué haces?',
        opciones: [
            'Uso el D-dímero: tan alto confirma la embolia y anticoagulo sin imagen',
            'Pido una angio-TC, método de elección: si es normal, la embolia queda esencialmente excluida',
            'Pido una gammagrafía V/Q, que los infiltrados no alteran',
            'Pido solo la eco venosa de miembros inferiores: si es negativa, descarta la embolia',
        ],
        correcta: 1,
        explicacion: 'La angio-TC es el método de elección y, con función renal conservada, el contraste no es obstáculo; normal, su valor predictivo negativo del 95 % elimina esencialmente la embolia (Origen: Marino, cap. 22, págs. 4-6). El D-dímero no sirve en la UCI porque hasta el 80 % lo tiene elevado, y anticoagular sin imagen expone a un riesgo sin diagnóstico (Origen: Marino, cap. 22, pág. 3). La gammagrafía no se favorece porque los infiltrados la hacen anormal (Origen: Marino, cap. 22, pág. 6). Una eco venosa negativa no excluye la embolia (Origen: Marino, cap. 22, pág. 4). Lo que te llevas: la placa orienta pero no separa edema, SDRA y neumonía; la TC ve lo que la placa se pierde, a cambio de radiación, contraste y traslado; y una angio-TC normal descarta la embolia, mientras que el D-dímero no ayuda en la UCI.',
    },
];
