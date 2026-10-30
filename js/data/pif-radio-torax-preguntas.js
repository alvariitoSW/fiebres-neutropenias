// Preguntas de «Tórax de UCI» (PIF Radiología). Formato de js/data/merino-hemato-preguntas.js; estilo de autonomo/REGLAS.md §8.
// Cada tema, con al menos una pregunta (un tema vacío rompe el quiz).
// Fuente: Marino PL. The ICU Book, 5.ª ed.: cap. 28 y 29 (docs/marino-2024-respiratory-management-caps27-30.pdf) y cap. 2
// (docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf). Las páginas son las del PDF de docs/.
// CASO «Tórax de UCI» (tema pifradio-torax-caso): T1 escribe los pasos 1-3 (neumotórax). T2 y T3 lo continúan con los
// ids pifradio-t2-caso… y pifradio-t3-caso… (mismo tema); el último paso lleva «Lo que te llevas». Paciente: varón de 52 años,
// neumonía grave, intubado, día 3 de UCI (cifras inventadas del caso).
export const temasPifRadioTorax = [
    { key: 'pifradio-t1', etiqueta: 'Neumotórax y derrame en la placa' },
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
];
