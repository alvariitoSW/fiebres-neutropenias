// Banco de repaso — PIF Radiología · «Placa portátil de UCI».
// Fuente: Marino PL. The ICU Book, 5.ª ed.: cap. 28 (tubo endotraqueal), cap. 2 (vía central) y cap. 49 (sonda de alimentación).
// Las páginas son las del PDF de docs/. Formato igual que merino-hemato-preguntas.js.
export const temasPifRadio = [
    { key: 'pifradio-tubo', etiqueta: 'Tubo endotraqueal en la placa' },
    { key: 'pifradio-via', etiqueta: 'Vía central en la placa' },
    { key: 'pifradio-sonda', etiqueta: 'Sonda nasogástrica en la placa' },
    { key: 'pifradio-caso', etiqueta: 'Caso: placa tras intubar, canalizar y sondar' },
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
];
