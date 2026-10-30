// Banco de repaso — PIF Radiología · «Placa portátil de UCI».
// Fuente: Marino PL. The ICU Book, 5.ª ed.: cap. 28 (tubo endotraqueal), cap. 2 (vía central) y cap. 49 (sonda de alimentación).
// Desde la ficha «TC de cráneo»: Marino cap. 47, El Libro Azul (sección VIII) y Manual de orientación de la UMI (PNT del hospital, cita genérica).
// Las páginas son las del PDF de docs/. Formato igual que merino-hemato-preguntas.js.
export const temasPifRadio = [
    { key: 'pifradio-tubo', etiqueta: 'Tubo endotraqueal en la placa' },
    { key: 'pifradio-via', etiqueta: 'Vía central en la placa' },
    { key: 'pifradio-sonda', etiqueta: 'Sonda nasogástrica en la placa' },
    { key: 'pifradio-caso', etiqueta: 'Caso: placa tras intubar, canalizar y sondar' },
    { key: 'pifradio-craneo', etiqueta: 'TC de cráneo en 5 preguntas' },
    { key: 'pifradio-caso-craneo', etiqueta: 'Caso: TC de cráneo de guardia' },
];

export const preguntasPifRadio = [
    // ---- Tubo endotraqueal ----
    {
        id: 'pifradio-q001', tema: 'pifradio-tubo',
        enunciado: 'En la placa portátil de un intubado con la cabeza en posición neutra, ¿dónde debe estar la punta del tubo?',
        opciones: [
            'Apoyada justo sobre la carina, para que quede bien fija',
            '3 a 5 cm por encima de la bifurcación traqueal',
            'A medio camino entre la carina y la cúpula diafragmática, para que no moleste',
            'Por debajo de la carina, en el bronquio principal derecho',
        ],
        correcta: 1,
        explicacion: 'Con la cabeza neutra, la punta debe quedar 3 a 5 cm por encima de la bifurcación traqueal. Apoyada en la carina, sin margen: con un desplazamiento de 2 cm del cuello (pág. 18), el riesgo es que pase al bronquio (inferencia). La ficha no da una posición tan baja: la carina es la referencia de la bifurcación, y por debajo de ella el tubo entra en un bronquio, donde solo se ventila un pulmón. Origen: Marino, cap. 28, pág. 18 (ficha Vías artificiales, Merino Neumología).',
    },
    {
        id: 'pifradio-q002', tema: 'pifradio-tubo',
        enunciado: 'En la placa portátil no distingues la carina. ¿Dónde puedes localizarla para valorar el tubo?',
        opciones: [
            'En el espacio T1-T2, donde acaba la tráquea cervical',
            'En el espacio T8-T9, a la altura de la cúpula derecha',
            'En el espacio T6-T7, por debajo del hilio',
            'Al nivel del espacio T4-T5',
        ],
        correcta: 3,
        explicacion: 'Si la bifurcación o carina no es visible, se localiza al nivel del espacio T4-T5 en una radiografía portátil. Contar en T1-T2 te haría creer que el tubo está bajo la carina cuando no lo está, y en T8-T9 que está muy alto. En T6-T7 la verías demasiado baja y creerías que el tubo está alto cuando no lo está; los niveles son razonamiento propio, la fuente solo da T4-T5. Origen: Marino, cap. 28, pág. 18.',
    },
    {
        id: 'pifradio-q003', tema: 'pifradio-tubo',
        enunciado: 'Un tubo bien colocado se queda 3 cm por encima de la carina. Al flexionar o extender el cuello del paciente, ¿qué esperas?',
        opciones: [
            'Que la punta se mueva unos 2 cm',
            'Que la punta no se mueva, porque el tubo está fijado a la comisura',
            'Que la punta suba siempre hasta las cuerdas vocales',
            'Que la punta se desplace 10 cm, hasta el bronquio derecho',
        ],
        correcta: 0,
        explicacion: 'La flexión o extensión de la cabeza y el cuello desplaza unos 2 cm la punta del tubo. Pensar que no se mueve lleva a no vigilarla en cada cambio de postura; pensar que salta 10 cm lleva a retirar tubos que están bien. Origen: Marino, cap. 28, pág. 18.',
    },
    {
        id: 'pifradio-q004', tema: 'pifradio-tubo',
        enunciado: 'Tras aspirar y girar a un intubado, la saturación cae y la placa muestra el pulmón izquierdo sin aire. ¿Qué explica esto con más probabilidad y por qué?',
        opciones: [
            'El tubo ha subido a la faringe, porque la tráquea es más recta a la izquierda y el balón se ha desinflado',
            'Un neumotórax derecho, que colapsa el pulmón contrario',
            'Ha migrado al bronquio principal derecho, de curso más recto, y no ventila el izquierdo',
            'Una sonda nasogástrica en el pulmón izquierdo',
        ],
        correcta: 2,
        explicacion: 'Cuando los tubos se mueven hacia los pulmones, a menudo acaban en el bronquio principal derecho, que sigue un curso más recto desde la tráquea; el pulmón izquierdo, sin ventilar, se atelectasia. Un neumotórax derecho no colapsa el pulmón izquierdo, y una sonda en el pulmón izquierdo no es la vía habitual (se desvía a la derecha). Origen: Marino, cap. 28, págs. 18-19.',
    },
    {
        id: 'pifradio-q005', tema: 'pifradio-tubo',
        enunciado: 'Para reducir el riesgo de que el tubo migre, ¿a cuántos centímetros de los dientes se mantiene la punta para reducir el riesgo de migración?',
        opciones: [
            '23 cm en mujeres y 21 cm en hombres',
            '25 cm en ambos sexos',
            '21 cm en mujeres y 23 cm en hombres',
            '19 cm en mujeres y 21 cm en hombres',
        ],
        correcta: 2,
        explicacion: 'El riesgo de migración puede reducirse manteniendo la punta a no más de 21 cm de los dientes en mujeres y 23 cm en hombres. Con las cifras al revés, en una mujer el tubo quedaría 2 cm más profundo de lo aconsejado y más cerca del bronquio derecho. Origen: Marino, cap. 28, pág. 19.',
    },
    // ---- Vía central ----
    {
        id: 'pifradio-q006', tema: 'pifradio-via',
        enunciado: 'Acabas de canalizar una yugular interna. ¿Dónde debe quedar la punta del catéter?',
        opciones: [
            'En el ventrículo derecho, para medir presiones',
            'En la cava superior, 1-2 cm por encima de la aurícula derecha',
            '1-2 cm por debajo de la unión cava-aurícula, ya dentro de la aurícula',
            'En el bronquio principal derecho, siguiendo el trayecto del tubo',
        ],
        correcta: 1,
        explicacion: 'Los catéteres yugulares y subclavios deben estar en la cava superior, con la punta 1-2 cm por encima de la aurícula derecha. En el ventrículo derecho la punta irritaría el miocardio, y 1-2 cm por debajo de la unión cava-aurícula la punta ya no está en la cava (la ficha da el objetivo por encima de la aurícula). Un catéter no va por la vía aérea. Origen: Marino, cap. 2, pág. 36 (ficha Tras el catéter central).',
    },
    {
        id: 'pifradio-q007', tema: 'pifradio-via',
        enunciado: 'En la placa, ¿por qué la carina sirve de referencia para la punta de una vía central?',
        opciones: [
            'Porque la carina está justo encima de la unión cava superior-aurícula: una punta a su altura, o algo por encima, está bien',
            'Porque la carina marca el borde superior de la aurícula izquierda',
            'Porque una punta por debajo de la carina siempre es correcta',
            'Porque la carina se ve igual en todos los pacientes y nunca cambia de altura',
        ],
        correcta: 0,
        explicacion: 'La carina está justo encima de la unión entre la cava superior y la aurícula derecha; por eso una punta a su altura, o algo por encima, está en posición adecuada. La fuente solo da como adecuada la punta a la altura de la carina o algo por encima; no valora la punta por debajo, así que «siempre correcta» no se sostiene. Origen: Marino, cap. 2, pág. 36.',
    },
    {
        id: 'pifradio-q008', tema: 'pifradio-via',
        enunciado: 'No puedes hacer una placa y usas ecografía subcostal. Inyectas rápido 10 mL de suero por la luz distal y las burbujas llegan a la aurícula en menos de 2 segundos. ¿Qué indica?',
        opciones: [
            'Que el catéter está en una arteria',
            'Que el catéter está en la aurícula derecha y hay que retirarlo',
            'Que la punta está en la cava superior',
            'Que la prueba es negativa y hay que repetirla',
        ],
        correcta: 2,
        explicacion: 'Las microburbujas en la aurícula indican que el catéter está en el sistema venoso, y si aparecen en menos de 2 segundos, que la punta está en la cava superior. La prueba confirma el sistema venoso, no una arteria, y la ficha no manda retirarlo. Origen: Marino, cap. 2, pág. 37.',
    },
    // ---- Sonda nasogástrica ----
    {
        id: 'pifradio-q009', tema: 'pifradio-sonda',
        enunciado: 'Un paciente intubado y sedado tolera sin toser la colocación de una sonda de alimentación. ¿Qué haces antes de empezar la nutrición?',
        opciones: [
            'Empezar con poca velocidad: si no tose ni se queja, la sonda debe de estar bien colocada',
            'Auscultar el epigastrio mientras insuflas aire',
            'Esperar a que aparezca diarrea o distensión',
            'Radiografía portátil de tórax, y no alimentar hasta confirmar',
        ],
        correcta: 3,
        explicacion: 'El crítico sedado a menudo no tose ni muestra molestias cuando la sonda entra en el pulmón (alrededor del 1% de las inserciones), por lo que hace falta una radiografía portátil tras cada inserción y no se empieza a alimentar hasta verificarla. Nutrir una sonda en el pulmón puede acabar en morbilidad grave. Origen: Marino, cap. 49, págs. 27-28.',
    },
    {
        id: 'pifradio-q010', tema: 'pifradio-sonda',
        enunciado: 'Auscultas un «soplido» en el epigastrio al insuflar aire por la sonda. ¿Cuánto vale como prueba de que está en el estómago?',
        opciones: [
            'Confirma la posición si se oye claro',
            'No la confirma: un chorro de aire en el pulmón también se oye en el epigastrio',
            'Solo vale si se repite dos veces y suena igual',
            'Solo la descarta si no se oye nada',
        ],
        correcta: 1,
        explicacion: 'La presencia del soplido no confirma la colocación en el estómago, porque el aire que sale en el pulmón también se oye en el epigastrio. Repetirlo o fiarte de su ausencia no cambia eso (la ficha no valora la ausencia: es razonamiento propio); fiarte del soplido deja pasar sondas en el pulmón. Origen: Marino, cap. 49, pág. 27.',
    },
    {
        id: 'pifradio-q011', tema: 'pifradio-sonda',
        enunciado: 'En la placa, la sonda se desvía a la derecha a la altura de la carina. ¿Dónde está y qué riesgo hay?',
        opciones: [
            'En el estómago, con la punta demasiado alta',
            'En el esófago, enrollada, sin riesgo de neumotórax porque no atraviesa ninguna estructura',
            'En el bronquio principal derecho, con riesgo de neumotórax',
            'En la cava superior, con riesgo de arritmia',
        ],
        correcta: 2,
        explicacion: 'Una sonda que se desvía a la derecha a la altura de la bifurcación sigue el bronquio principal derecho, es decir, está en el pulmón. Al ser estrecha y llevar un fiador rígido puede avanzar mucho y romper la pleura: neumotórax. La que está bien baja recta por el mediastino y biseca el ángulo de la bifurcación. Origen: Marino, cap. 49, págs. 28-29.',
    },
    // ---- Caso ----
    {
        id: 'pifradio-q012', tema: 'pifradio-caso',
        enunciado: 'Caso (1/4). Mujer de 64 años con neumonía grave, intubada y sedada en la UCI. Cabeza en posición neutra: la placa muestra la punta del tubo 4 cm por encima de la carina y los dos pulmones ventilados. ¿Cómo lo valoras?',
        opciones: [
            'Bien: está entre 3 y 5 cm por encima de la bifurcación',
            'Mal: la punta debería estar sobre la carina',
            'Mal: a 4 cm de la carina, la flexión del cuello la mete en el bronquio',
            'Bien, pero solo si está a menos de 25 cm de los dientes',
        ],
        correcta: 0,
        explicacion: 'La posición correcta es 3 a 5 cm por encima de la bifurcación, y la flexión o extensión del cuello desplaza unos 2 cm la punta. Una flexión desplaza unos 2 cm, así que desde 4 cm sobre la carina no llega al bronquio (inferencia); avanzarlo 4 cm lo dejaría en la carina, sin margen. La cifra que da la ficha para reducir el riesgo de migración es ≤21 cm de los dientes en mujeres. Origen: Marino, cap. 28, págs. 18 y 19.',
    },
    {
        id: 'pifradio-q013', tema: 'pifradio-caso',
        enunciado: 'Caso (2/4). Al día siguiente le colocas una vía central yugular derecha. En la placa, el catéter baja recto por el mediastino y su punta queda a la altura de la carina. ¿Qué concluyes?',
        opciones: [
            'Está mal: la punta tiene que llegar a la aurícula derecha para medir la presión',
            'Hay que retirarlo 5 cm porque está sobre la carina',
            'No se puede valorar sin TC',
            'Posición adecuada: la carina está justo encima de la unión cava superior-aurícula',
        ],
        correcta: 3,
        explicacion: 'Un catéter que baja recto por el mediastino con la punta a la altura de la carina, o algo por encima, está bien colocado; el objetivo es la cava superior, 1-2 cm por encima de la aurícula derecha. Llevarlo a la aurícula no es el objetivo que da la ficha. Origen: Marino, cap. 2, pág. 36.',
    },
    {
        id: 'pifradio-q014', tema: 'pifradio-caso',
        enunciado: 'Caso (3/4). Para nutrirla le pasan una sonda fina con fiador. La placa muestra la sonda desviada a la derecha a la altura de la carina. El residente propone: «Insuflo aire y, si oigo el soplido en el epigastrio, empiezo a alimentar». ¿Qué le contestas?',
        opciones: [
            'Que tiene razón: el soplido confirma el estómago',
            'Que no alimente: la sonda está en el pulmón derecho',
            'Que alimente despacio y vigile la saturación por si aparece alguna intolerancia',
            'Que avance la sonda 10 cm más para que llegue al estómago',
        ],
        correcta: 1,
        explicacion: 'La sonda que se desvía a la derecha a la altura de la bifurcación está en el bronquio principal derecho, y el soplido también se oye si está en el pulmón. No se alimenta hasta confirmar la posición en la radiografía. Avanzarla con el fiador rígido puede llegar a la pleura y causar neumotórax. Origen: Marino, cap. 49, págs. 27-29.',
    },
    {
        id: 'pifradio-q015', tema: 'pifradio-caso',
        enunciado: 'Caso (4/4). Para hacerle la placa la giran y la saturación baja de 97 a 88 % (cifras inventadas del caso). El tubo parece más hondo y el pulmón izquierdo no tiene aire. ¿Qué haces y qué te llevas del caso?',
        opciones: [
            'Reposicionar el cuello y esperar: la placa del pulmón izquierdo se arregla sola',
            'Sospechar migración del tubo al bronquio principal derecho y retirarlo hasta que la punta quede a no más de 21 cm de los dientes',
            'Avanzar más el tubo para ventilar los dos pulmones',
            'Pedir una TC antes de tocar nada',
        ],
        correcta: 1,
        explicacion: 'Un tubo que se mueve hacia los pulmones a menudo acaba en el bronquio principal derecho, y el pulmón izquierdo no ventilado se atelectasia (págs. 18-19); mantener la punta a ≤21 cm de los dientes en mujeres reduce el riesgo (pág. 19). Esperar o avanzarlo mantiene un pulmón sin ventilar; la TC retrasa la corrección (razonamiento propio). Lo que te llevas: 1) la punta, 3-5 cm por encima de la carina (Marino, cap. 28, pág. 18); 2) ≤21 cm de los dientes en mujeres y 23 en hombres (pág. 19); 3) placa antes de nutrir una sonda (cap. 49, págs. 27-28).',
    },

    // ---- TC de cráneo (ficha 5) ----
    {
        id: 'pifradio-q016', tema: 'pifradio-craneo',
        enunciado: 'En una TC de cráneo sin contraste de un paciente que acaba de deteriorarse, ¿cómo se ve la sangre intracerebral?',
        opciones: [
            'Igual que el parénquima hasta pasadas 24 horas',
            'Como una zona hipodensa, más oscura que el parénquima y parecida al edema',
            'Hiperdensa: más blanca que el parénquima sano de alrededor',
            'Como una zona negra, como el aire de los senos',
        ],
        correcta: 2,
        explicacion: 'Marino muestra la hemorragia intracerebral como áreas hiperdensas (figs. 47.2 y 47.3, págs. 40 y 43). La hipodensidad es el edema focal (Libro Azul, pág. 51): leer así un hematoma te haría buscar un infarto y dar antiagregante a quien sangra. Que la sangre no se vea hasta 24 h no está en las fuentes y retrasaría la neurocirugía. Confundirla con aire (negro) pasaría por alto el hematoma. Origen: ficha.',
    },
    {
        id: 'pifradio-q017', tema: 'pifradio-craneo',
        enunciado: 'Un paciente con TCE tiene un hematoma y la línea media desviada. Según la ficha de factores pronósticos del Manual UMI, ¿a partir de qué desviación cuenta como factor de mal pronóstico?',
        opciones: [
            'Cualquier desviación visible, aunque sea de 1 mm',
            'Más de 20 mm',
            'Más de 15 mm',
            'Más de 5 mm',
        ],
        correcta: 3,
        explicacion: 'El manual lista el desplazamiento de la línea media de más de 5 mm como factor pronóstico (PDF pág. 27). En su tabla de Marshall imprime 20 mm para el tipo IV: es una discrepancia interna del manual, y esta app usa 5 mm. Esperar a 20 mm retrasaría la alarma en un paciente que ya tiene mal pronóstico. Los 15 mm no figuran; 15 cc es el volumen del hematoma. Origen: ficha (Manual UMI, págs. 79 y 94).',
    },
    {
        id: 'pifradio-q018', tema: 'pifradio-craneo',
        enunciado: 'La TC de un paciente con TCE no muestra las cisternas de la base y hay swelling en los dos hemisferios. ¿Qué tipo de Marshall es y qué te dice?',
        opciones: [
            'Difusa III: swelling bilateral sin cisternas basales (HTIC 63,2%)',
            'Difusa II: pequeñas lesiones, línea media centrada y cisternas visibles, con HTIC en el 28,6% y sin necesidad de más medidas',
            'Difusa I: TAC normal, sin riesgo de HTIC y no hace falta vigilar la PIC',
            'Masa evacuada: se ha operado ya una lesión',
        ],
        correcta: 0,
        explicacion: 'Swelling bilateral con ausencia de cisternas de la base es el tipo III, con HTIC en el 63,2% (Manual UMI, pág. 94). Llamarlo II, con cisternas visibles, infraestimaría el riesgo; el tipo I es una TC normal; y «masa evacuada» exige una cirugía previa que el enunciado no dice. Origen: ficha.',
    },
    {
        id: 'pifradio-q019', tema: 'pifradio-craneo',
        enunciado: 'Tras una hemorragia subaracnoidea, la TC muestra ventrículos dilatados. Según Marino, ¿por qué?',
        opciones: [
            'Porque ha entrado aire por la fractura y ocupa el sistema ventricular',
            'Porque la sangre bloquea el flujo del LCR y causa hidrocefalia obstructiva',
            'Porque la hipertensión intracraneal reduce el volumen del cerebro y los ventrículos se ven mayores por contraste',
            'Porque la inflamación por la sangre cierra la barrera hematoencefálica',
        ],
        correcta: 1,
        explicacion: 'La sangre en el espacio subaracnoideo bloquea el flujo del LCR y a menudo causa hidrocefalia obstructiva y aumento de la PIC (Marino, cap. 47, pág. 47). No hay fractura en el enunciado. La inflamación hace lo contrario: daña la barrera (vasogénico), y no dilata ventrículos. Tratarla como edema simple te haría tardar en pedir drenaje. Origen: ficha.',
    },
    {
        id: 'pifradio-q020', tema: 'pifradio-craneo',
        enunciado: 'Un paciente con warfarina tiene un hematoma intraparenquimatoso grande, sin desviación de la línea media. ¿Qué es lo primero que dice Marino?',
        opciones: [
            'Esperar una segunda TC a las 24 h y no actuar antes, porque sin desviación de la línea media no hay urgencia',
            'Parar la warfarina de la siguiente toma y vigilar la tensión sin más',
            'Revertir ya el antitrombótico: CCP de 4 factores y vitamina K',
            'Solo vitamina K intravenosa, que basta para revertir la warfarina',
        ],
        correcta: 2,
        explicacion: 'El deterioro rápido de las primeras horas se atribuye a la expansión del hematoma, así que se revierte ya el antitrombótico (CCP de 4 factores más vitamina K en la warfarina; Marino, cap. 47, págs. 42-44). Esperar a la segunda TC deja que sangre más; omitir solo la siguiente dosis no revierte la anticoagulación presente; la vitamina K sola tarda: su efecto empieza hacia las 2 h y es máximo a las 24 h, por eso se da junto al CCP (Marino, pág. 42), y el hematoma seguiría creciendo. Origen: ficha.',
    },
    {
        id: 'pifradio-q021', tema: 'pifradio-craneo',
        enunciado: 'Una TC sin sangre muestra una zona focal hipodensa. ¿Qué significa según El Libro Azul?',
        opciones: [
            'Sangre antigua ya reabsorbida, que no necesita más estudio',
            'Un edema focal, del que el infarto es un ejemplo',
            'Un hematoma epidural, que se ve oscuro por ser extraaxial',
            'Un artefacto del hueso, que no tiene valor clínico',
        ],
        correcta: 1,
        explicacion: 'La TC detecta el edema focal como señal hipodensa anormal, y los infartos son ejemplo de edema focal (Libro Azul, pág. 51). Pensar en sangre antigua o en hematoma epidural no lo dice ninguna fuente de la app y te alejaría del ictus. Un artefacto no se interpreta así sin más: no dejar de buscar causa podría costar tiempo de tratamiento. Origen: ficha.',
    },
    {
        id: 'pifradio-q022', tema: 'pifradio-craneo',
        enunciado: 'Encuentra el error. ¿Cuál de estas lecturas de una TC de cráneo es incorrecta?',
        opciones: [
            'Una TC normal en un TCE con GCS ≤8 puede justificar monitorizar la PIC si hay hipotensión sistólica por debajo de 90 mm Hg',
            'La línea media desviada solo es factor de mal pronóstico por encima de 20 mm, el umbral de la tabla de Marshall',
            'La ausencia de cisternas basales es factor de mal pronóstico del TCE',
            'El hematoma intracerebral se ve como una zona hiperdensa',
        ],
        correcta: 1,
        explicacion: 'Es incorrecta la segunda: la ficha de factores pronósticos del Manual UMI cuenta la línea media desviada más de 5 mm (PDF pág. 27); los 20 mm son los que imprime la tabla de Marshall en el tipo IV, una discrepancia del propio manual (PDF pág. 42) y esta app usa 5 mm. Medirla con 20 mm te haría tardar en alarmarte con un paciente que ya tiene mal pronóstico. Las otras tres son ciertas (Libro Azul, pág. 52; Manual UMI, pág. 27; Marino, pág. 43). Origen: ficha.',
    },
    {
        id: 'pifradio-q023', tema: 'pifradio-craneo',
        enunciado: 'Hemorragia subaracnoidea por aneurisma roto, aún sin asegurar y con la TAS en 190 mm Hg. ¿Qué objetivo y fármaco propone Marino?',
        opciones: [
            'Tranexámico para prevenir el resangrado',
            'TAS por debajo de 100 mm Hg con nitroprusiato, lo más rápido posible, aunque baje la perfusión',
            'Dejar la TAS en 190 mm Hg para mantener la perfusión cerebral',
            'TAS ≤140 mm Hg, con labetalol',
        ],
        correcta: 3,
        explicacion: 'Con TAS de 140 mm Hg o menos, el resangrado es poco frecuente; la bajada no debe subir el gasto cardíaco, por eso el labetalol (Marino, cap. 47, pág. 47). Dejar 190 deja al aneurisma expuesto; bajar a menos de 100 no tiene respaldo en la fuente. El tranexámico no previene el resangrado y no se recomienda (pág. 47). Origen: ficha.',
    },
    {
        id: 'pifradio-q024', tema: 'pifradio-caso-craneo',
        enunciado: 'Caso (1/4). Un hombre de 68 años con warfarina llega con cefalea y somnolencia (datos ilustrativos). La TC sin contraste muestra una gran zona blanca en el hemisferio derecho. ¿Qué haces en la lectura?',
        opciones: [
            'Es sangre hiperdensa: pasas a mirar la línea media y las cisternas',
            'Es una zona hipodensa de infarto: preparas un antiagregante',
            'Es una hemorragia subaracnoidea, porque la sangre llega a los ventrículos',
            'Es edema perihematoma: pasas a la pregunta de la hipodensidad',
        ],
        correcta: 0,
        explicacion: 'La sangre se ve hiperdensa (Marino, figs. 47.2 y 47.3, págs. 40 y 43): sí a la primera pregunta y pasas a línea media y cisternas. Dar antiagregante a un hematoma lo agravaría. Sangre en los ventrículos no es hemorragia subaracnoidea: el hematoma intracerebral se abre a ellos (fig. 47.3, pág. 43), mientras que la HSA es sangre en el espacio subaracnoideo de la base (fig. 47.4, pág. 46), y llamarla HSA te llevaría a buscar un aneurisma en lugar de frenar el hematoma. La hipodensidad es el edema focal (Libro Azul, pág. 51), y la pregunta 1 ya tiene respuesta: hay sangre. Origen: ficha.',
    },
    {
        id: 'pifradio-q025', tema: 'pifradio-caso-craneo',
        enunciado: 'Caso (2/4). La línea media está centrada y las cisternas se ven; la sangre está dentro del hemisferio y ha pasado a los ventrículos. ¿Qué medida es la prioridad?',
        opciones: [
            'Dar vitamina K oral, sin más medidas, y reevaluar en una semana con una nueva TC',
            'Revertir la warfarina ya y consultar con neurocirugía',
            'Iniciar heparina para que la TC no empeore',
            'Esperar: sin efecto de masa no hay urgencia',
        ],
        correcta: 1,
        explicacion: 'La prioridad es frenar el hematoma con reversión inmediata (CCP de 4 factores más vitamina K; Marino, cap. 47, págs. 42-44), y la sangre intraventricular obliga a consultar neurocirugía por el riesgo de hidrocefalia obstructiva (pág. 45). La vitamina K se da junto al CCP; su efecto empieza hacia las 2 h y es máximo a las 24 h (pág. 42), así que no frena el hematoma a tiempo; la heparina empeora la hemorragia. Origen: ficha.',
    },
    {
        id: 'pifradio-q026', tema: 'pifradio-caso-craneo',
        enunciado: 'Caso (3/4, giro). A las 6 h la pupila izquierda se dilata y el Glasgow cae a 7 (cifras ilustrativas). La nueva TC muestra más sangre, línea media desviada y cisternas basales ausentes. ¿Qué interpretas?',
        opciones: [
            'Una lesión estable: se mantiene el plan anterior y se repite la TC en 24 horas, sin cambiar nada',
            'Un Marshall III: cirugía urgente sin medir la PIC',
            'Efecto de masa con herniación: pedir neurocirugía y monitorizar la PIC',
            'Un infarto añadido en un territorio arterial, que se trata con antiagregante',
        ],
        correcta: 2,
        explicacion: 'Con desviación de la línea media y cisternas ausentes hay efecto de masa y swelling (Manual UMI, págs. 79 y 94), y Marino pide medir la PIC con GCS de 8 o menos, sangre intraventricular o signos de herniación como una pupila dilatada (cap. 47, pág. 45). Dejarla en 24 h perdería el momento de operar; los antiagregantes empeorarían la hemorragia. Puntúa con la tabla de Marshall (ficha umi-marshall, pág. 94 del manual): el Marshall III es swelling bilateral con cisternas ausentes (HTIC 63,2%); aquí la línea media desviada y la sangre añadida lo llevan al IV (swelling unilateral con línea media desviada, HTIC 100%) o a masa no evacuada si pasa de 25 cc (84,6%); y la cirugía urgente sin medir la PIC no sigue de la clase III. Lo que te llevas: 1) línea media y cisternas se leen siempre tras ver sangre; 2) cisternas ausentes más línea media desviada es efecto de masa, no una lesión estable; 3) con GCS ≤8 y signos de herniación se pide neurocirugía y se mide la PIC. Origen: ficha.',
    },
    {
        id: 'pifradio-q027', tema: 'pifradio-caso-craneo',
        enunciado: 'Caso B: otro paciente (4/4, giro). Una mujer de 50 años en coma tras un accidente, con GCS de 7 y TAS de 85 mm Hg (datos ilustrativos). La TC no muestra sangre ni hipodensidad focal. ¿Qué haces?',
        opciones: [
            'Descartar la hipertensión intracraneal, porque la TC es normal y el coma será metabólico',
            'Pensar en monitorizar la PIC pese a la TC normal',
            'Pedir solo otra TC en un mes, porque la TC normal indica buen pronóstico',
            'Tratarla como un Marshall IV por el coma',
        ],
        correcta: 1,
        explicacion: 'El Libro Azul recoge que, con GCS de 8 o menos y TC normal, monitorizar la PIC es beneficioso si hay más de 40 años, TAS por debajo de 90 mm Hg o daño focal (pág. 52). Descartar la HTIC por la TC contradice esto; la clase IV exige swelling y línea media desviada, que no hay. Origen: ficha.',
    },
];
