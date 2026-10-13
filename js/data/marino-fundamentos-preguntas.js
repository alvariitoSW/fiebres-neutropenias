// Banco de preguntas de repaso — Libros · Marino Fundamentos (The ICU Book,
// caps. 1-11). 6 preguntas por ficha (5 de opción múltiple + 1 de redactar)
// × 23 fichas. Cada pregunta está contrastada con el texto de su ficha.
// Fuente: Marino PL. The ICU Book, 5.ª ed., Cap. 1-11.
export const temasMarinoFundamentos = [
    { key: 'mar-cateteres-flujo', etiqueta: 'Catéteres y flujo: tamaño, longitud, presión' },
    { key: 'mar-tipos-cateter', etiqueta: 'Catéteres periféricos y centrales' },
    { key: 'mar-eco-intraosea', etiqueta: 'Canalización ecoguiada y acceso intraóseo' },
    { key: 'mar-cvc-sitios', etiqueta: 'Acceso venoso central: indicaciones y sitio' },
    { key: 'mar-cvc-complicaciones', etiqueta: 'Tras el catéter central: aire, neumotórax y punta' },
    { key: 'mar-cateter-cuidados', etiqueta: 'El catéter que se queda: cuidados, oclusión, trombosis' },
    { key: 'mar-bacteriemia-cateter', etiqueta: 'Bacteriemia relacionada con el catéter' },
    { key: 'mar-microbioma', etiqueta: 'El intestino como origen de infección' },
    { key: 'mar-ulcera-estres', etiqueta: 'Lesión mucosa por estrés: ¿a quién proteger?' },
    { key: 'mar-tromboprofilaxis-farmacos', etiqueta: 'Tromboprofilaxis venosa: riesgo y fármacos' },
    { key: 'mar-tromboprofilaxis-escenarios', etiqueta: 'Tromboprofilaxis: mecánica y por escenario' },
    { key: 'mar-analgesia', etiqueta: 'Analgesia en la UCI' },
    { key: 'mar-sedacion', etiqueta: 'Sedación en la UCI' },
    { key: 'mar-oximetria', etiqueta: 'Oximetría: del dedo a la sangre venosa' },
    { key: 'mar-capnografia', etiqueta: 'Capnografía: el CO₂ espirado' },
    { key: 'mar-cateter-ap', etiqueta: 'Catéter de arteria pulmonar y enclavamiento' },
    { key: 'mar-termodilucion', etiqueta: 'Gasto por termodilución y los 10 parámetros' },
    { key: 'mar-transporte-o2', etiqueta: 'El O₂ en la sangre y su transporte' },
    { key: 'mar-extraccion-lactato', etiqueta: 'La extracción de O₂ y el lactato' },
    { key: 'mar-cristaloides', etiqueta: 'Cristaloides y sueros glucosados' },
    { key: 'mar-coloides', etiqueta: 'Coloides y el debate coloide-cristaloide' },
    { key: 'mar-retorno-venoso', etiqueta: 'Retorno venoso y sobrecarga' },
    { key: 'mar-respuesta-fluidos', etiqueta: 'Hipoperfusión y respuesta a fluidos' },
];

export const preguntasMarinoFundamentos = [
    // ---- Ficha I: Catéteres y flujo ----
    {
        id: 'mar-q001', tema: 'mar-cateteres-flujo',
        enunciado: 'Según la ecuación de Hagen-Poiseuille, ¿qué dimensión del catéter pesa más sobre el flujo?',
        opciones: ['El radio, que entra elevado a la cuarta potencia', 'La longitud, que entra elevada al cuadrado', 'La viscosidad, que entra al cubo', 'Todas pesan por igual'],
        correcta: 0,
        explicacion: 'Q = ΔP × (π r⁴ / 8 µ L): el flujo es proporcional a la cuarta potencia del radio e inversamente proporcional a la longitud y la viscosidad.'
    },
    {
        id: 'mar-q002', tema: 'mar-cateteres-flujo',
        enunciado: '¿Qué diámetro externo tiene un catéter de 7 French, según la Ecuación 1.1?',
        opciones: ['Unos 2,3 mm', 'Unos 0,7 mm', 'Unos 7 mm', 'Unos 3,5 mm'],
        correcta: 0,
        explicacion: 'French × 0,33 = diámetro externo en mm: 7 × 0,33 ≈ 2,3 mm (la Tabla 1.1 lo da como 2,4 mm, 13 G).'
    },
    {
        id: 'mar-q003', tema: 'mar-cateteres-flujo',
        enunciado: 'En el sistema de calibre (gauge), un catéter de 20 G frente a uno de 16 G es…',
        opciones: ['Más fino: a más gauge, menos diámetro', 'Más grueso: a más gauge, más diámetro', 'Igual de grueso pero más largo', 'Imposible de comparar'],
        correcta: 0,
        explicacion: 'El gauge nació para alambres (cuántos caben en un espacio): varía en sentido inverso al diámetro.'
    },
    {
        id: 'mar-q004', tema: 'mar-cateteres-flujo',
        enunciado: 'En la Figura 1.1, pasar de un catéter de 16 G de 2 pulgadas a uno de 6 pulgadas reduce el flujo…',
        opciones: ['Un 40%', 'Un 10%', 'A la mitad exacta', 'No lo cambia'],
        correcta: 0,
        explicacion: 'De 151 a 91 mL/min, un 40%; y pasar a 12 pulgadas lo reduce otro 40% (54 mL/min).'
    },
    {
        id: 'mar-q005', tema: 'mar-cateteres-flujo',
        enunciado: 'Con una bolsa de suero colgada a 68 cm sobre el punto de punción, ¿qué presión de infusión se consigue?',
        opciones: ['50 mmHg (1 psi)', '15 mmHg', '150 mmHg', '300 mmHg'],
        correcta: 0,
        explicacion: 'A 68 cm la presión es de 50 mmHg (1 psi); a 100 cm, de 75 mmHg (1,5 psi).'
    },
    {
        tipo: 'redactar', id: 'mar-q006', tema: 'mar-cateteres-flujo',
        enunciado: 'Llega un paciente con hemorragia masiva y tienes que elegir entre un CVC de triple luz y dos periféricos cortos de 16 G. ¿Qué eliges para reponer volumen y por qué?',
        respuestaModelo: 'Los periféricos cortos y gruesos. La velocidad de infusión la marca el catéter, no la vena: el flujo depende de la cuarta potencia del radio y cae con la longitud. Un catéter corto y de gran calibre da mucho más flujo que un catéter central largo (un CVC de 6 pulgadas pierde un 40% frente a uno de 2). Si se usa el CVC, mejor su luz distal, que es la más gruesa.'
    },

    // ---- Ficha II: Catéteres periféricos y centrales ----
    {
        id: 'mar-q007', tema: 'mar-tipos-cateter',
        enunciado: '¿Qué define que un catéter sea "central"?',
        opciones: ['Que su punta llega a una de las venas cavas', 'Que se inserta en el tórax o en el cuello', 'Que tiene más de una luz', 'Que mide más de 15 cm'],
        correcta: 0,
        explicacion: 'Un catéter central llega a una de las venas cavas; uno periférico, no. Un PICC se inserta en el brazo y es central.'
    },
    {
        id: 'mar-q008', tema: 'mar-tipos-cateter',
        enunciado: '¿Qué vena se prefiere para un catéter de línea media (midline)?',
        opciones: ['La basílica', 'La braquial', 'La cefálica en la muñeca', 'La yugular externa'],
        correcta: 0,
        explicacion: 'La basílica sube recta por el brazo y no va junto a una arteria ni a un nervio, a diferencia de la braquial.'
    },
    {
        id: 'mar-q009', tema: 'mar-tipos-cateter',
        enunciado: 'En un estudio con catéteres de línea media, ¿durante cuánto tiempo se infundieron vasopresores sin extravasación?',
        opciones: ['Hasta 7-8 días', 'Nunca más de 24 horas', 'Solo durante la primera hora', 'No se permiten vasopresores por un midline'],
        correcta: 0,
        explicacion: 'Duraron 14 días de media, y se infundieron vasopresores hasta 7-8 días sin extravasación ni compromiso del miembro.'
    },
    {
        id: 'mar-q010', tema: 'mar-tipos-cateter',
        enunciado: 'En un CVC de triple luz, ¿qué luz es mejor para infundir volumen rápido?',
        opciones: ['La distal, que es la más gruesa (16 G)', 'La proximal', 'La medial', 'Todas dan el mismo flujo'],
        correcta: 0,
        explicacion: 'La distal es de 16 G y las otras de 18 G: da más del doble de flujo (2,28 frente a 0,91-0,99 L/h en la Tabla 1.3).'
    },
    {
        id: 'mar-q011', tema: 'mar-tipos-cateter',
        enunciado: '¿Qué proporción de los catéteres periféricos cortos falla en los 3 primeros días?',
        opciones: ['El 40-60%', 'Menos del 5%', 'Alrededor del 15%', 'El 90%'],
        correcta: 0,
        explicacion: 'Fallan el 40-60% en los 3 primeros días (flebitis, oclusión, salida accidental, extravasación), y el primer intento falla en un tercio.'
    },
    {
        tipo: 'redactar', id: 'mar-q012', tema: 'mar-tipos-cateter',
        enunciado: 'Explica por qué el PICC tiene tanta tendencia a ocluirse y qué catéter lo está sustituyendo.',
        respuestaModelo: 'El PICC es una versión larga del midline (40-55 cm, más del triple) y su flujo es solo un 20% del de un midline: ese flujo comprometido podría explicar su alta tasa de oclusiones. El midline se considera hoy una alternativa más segura (menos oclusiones y menos bacteriemias, con una TVP algo mayor pero baja), y su auge ha hecho que el uso del PICC disminuya; el PICC sigue siendo útil cuando se prevén semanas de tratamiento IV.'
    },

    // ---- Ficha III: Canalización ecoguiada y acceso intraóseo ----
    {
        id: 'mar-q013', tema: 'mar-eco-intraosea',
        enunciado: '¿Cómo se distingue mejor una vena de una arteria con la ecografía?',
        opciones: ['La vena se colapsa al comprimir; la arteria no', 'La arteria siempre sale roja en el Doppler color', 'La vena siempre es más pequeña', 'La arteria no se ve en eje corto'],
        correcta: 0,
        explicacion: 'La compresibilidad es el método más fácil (salvo una vena trombosada, que no se comprime). Los colores del Doppler indican la dirección del flujo respecto a la sonda, no si es arteria o vena.'
    },
    {
        id: 'mar-q014', tema: 'mar-eco-intraosea',
        enunciado: 'En un estudio, ¿con qué frecuencia se perforó la pared posterior de la vena con el eje corto?',
        opciones: ['40% (frente a 18% con eje largo)', '5% (frente a 40% con eje largo)', 'Nunca', '100%'],
        correcta: 0,
        explicacion: 'Las venas se colapsan al puncionarlas y la aguja tiende a atravesar la pared posterior: por eso hay que confirmar que la guía y luego el catéter están en la luz.'
    },
    {
        id: 'mar-q015', tema: 'mar-eco-intraosea',
        enunciado: '¿Dónde se coloca la aguja intraósea en la tibia proximal del adulto?',
        opciones: ['3 cm por debajo del borde inferior de la rótula y 2 cm medial', 'Justo encima de la rótula', 'En la cara lateral de la tibia distal', 'En el maléolo interno'],
        correcta: 0,
        explicacion: 'En la superficie plana bajo el cóndilo medial: 3 cm por debajo del borde inferior de la rótula y 2 cm medial a ese punto.'
    },
    {
        id: 'mar-q016', tema: 'mar-eco-intraosea',
        enunciado: '¿Qué flujo da una vía intraósea comparada con una vía periférica?',
        opciones: ['Un 25%', 'El doble', 'El mismo', 'Un 90%'],
        correcta: 0,
        explicacion: 'Es lento por la viscosidad de la médula y la presión de la cavidad medular (unos 30 mmHg): por eso se presuriza siempre.'
    },
    {
        id: 'mar-q017', tema: 'mar-eco-intraosea',
        enunciado: 'En el paciente despierto, ¿qué analgesia se da por la vía intraósea antes de infundir?',
        opciones: ['Lidocaína al 2% sin conservantes, 40 mg en 2 minutos', 'Ketamina 1 mg/kg en bolo', 'Paracetamol IV 1 g', 'Ninguna: no duele'],
        correcta: 0,
        explicacion: 'Lidocaína al 2% (40 mg, 2 mL) en 2 min, esperar 1 minuto y lavar con 10 mL de salino; si no basta, repetir a mitad de dosis.'
    },
    {
        tipo: 'redactar', id: 'mar-q018', tema: 'mar-eco-intraosea',
        enunciado: '¿Por qué la vía intraósea es útil en la parada o el shock, y cuánto tiempo puede usarse?',
        respuestaModelo: 'Porque la cavidad medular es rígida y no se colapsa con la hipotensión o la hipovolemia, a diferencia de las venas; las guías de la AHA recomiendan pasar a ella si falla el primer intento de vía IV. Es temporal: no se recomienda infundir más de 24 horas (sin pruebas firmes). En adultos se prefiere la tibia proximal (más éxito y no estorba la intubación ni las compresiones).'
    },

    // ---- Ficha IV: Acceso venoso central — indicaciones y sitio ----
    {
        id: 'mar-q019', tema: 'mar-cvc-sitios',
        enunciado: '¿En qué situaciones sigue siendo preferible u obligado un acceso venoso central frente al midline o el PICC?',
        opciones: ['En el shock y para técnicas como la hemodiálisis aguda', 'Para cualquier antibiótico', 'Siempre que se prevean más de 2 días de ingreso', 'Solo para la nutrición enteral'],
        correcta: 0,
        explicacion: '4 de las 6 indicaciones clásicas tienen hoy alternativa (midline/PICC); el acceso central sigue siendo preferible en el shock y obligado en técnicas como la hemodiálisis aguda.'
    },
    {
        id: 'mar-q020', tema: 'mar-cvc-sitios',
        enunciado: '¿Qué dice la fuente sobre corregir la coagulopatía antes de poner un catéter central?',
        opciones: ['No hay contraindicaciones absolutas y la recomendación de corregir plaquetas <20.000 o INR >3 no tiene pruebas', 'Siempre hay que transfundir plasma si el INR es >1,5', 'La coagulopatía contraindica el acceso yugular', 'Hay que esperar a plaquetas >100.000'],
        correcta: 0,
        explicacion: 'No hay contraindicaciones absolutas, ni siquiera la coagulopatía; la recomendación de corregir plaquetas <20.000 × 10⁶/L o INR >3 no tiene pruebas que la respalden.'
    },
    {
        id: 'mar-q021', tema: 'mar-cvc-sitios',
        enunciado: '¿Cuánto tiempo hay que frotar la clorhexidina al 2% en alcohol antes de dejarla secar?',
        opciones: ['30 segundos', '5 segundos', '5 minutos', 'No hace falta frotar'],
        correcta: 0,
        explicacion: 'Frotar 30 s y dejar secar por completo (unos 30 s en piel seca, hasta 2 min en piel húmeda); su actividad dura ≥6 horas.'
    },
    {
        id: 'mar-q022', tema: 'mar-cvc-sitios',
        enunciado: 'Si un catéter de gran calibre ha entrado en la carótida al canalizar la yugular, ¿qué se hace?',
        opciones: ['Dejarlo y llamar a cirugía vascular o radiología intervencionista', 'Retirarlo y comprimir 5 minutos', 'Retirarlo y comprimir 10 minutos', 'Dejarlo y usarlo como vía arterial'],
        correcta: 0,
        explicacion: 'Retirarlo puede ser mortal. Solo si la que punciona es la aguja fina basta retirarla y comprimir al menos 5 minutos.'
    },
    {
        id: 'mar-q023', tema: 'mar-cvc-sitios',
        enunciado: '¿Por qué se evita la vena subclavia si el paciente puede necesitar un acceso de hemodiálisis permanente en ese brazo?',
        opciones: ['Por la estenosis de la subclavia (15-50%), que aparece días o meses tras retirarlo', 'Porque no se puede usar con ecografía', 'Porque tiene más bacteriemias que ningún otro sitio', 'Porque obliga a anticoagular'],
        correcta: 0,
        explicacion: 'La estenosis de la subclavia aparece en el 15-50%, días o meses tras retirar el catéter.'
    },
    {
        tipo: 'redactar', id: 'mar-q024', tema: 'mar-cvc-sitios',
        enunciado: '¿Es la vena femoral un mal sitio para un catéter central? Razónalo con los datos de la ficha.',
        respuestaModelo: 'Su mala fama es en gran parte inmerecida. Se considera el sitio menos deseable sobre todo por más trombosis; cuando se creó el paquete de medidas también tenía más bacteriemias, pero estudios recientes no lo confirman: el riesgo de infección depende de cómo se cuida el punto, no de dónde está. En el estudio de 2.532 catéteres de la Tabla 2.2, la infección y la trombosis fueron muy bajas en los tres sitios; la femoral tuvo la TVP sintomática más alta (1,4%), pero con un riesgo pequeño.'
    },

    // ---- Ficha V: Tras el catéter central ----
    {
        id: 'mar-q025', tema: 'mar-cvc-complicaciones',
        enunciado: 'A través de un catéter de 14 G, un gradiente de solo 5 mmHg arrastra aire a…',
        opciones: ['100 mL por segundo', '1 mL por minuto', '10 mL por hora', 'No arrastra aire'],
        correcta: 0,
        explicacion: 'Es suficiente para una embolia mortal, que ocurre cuando entran 200-300 mL (3-5 mL/kg) en pocos segundos.'
    },
    {
        id: 'mar-q026', tema: 'mar-cvc-complicaciones',
        enunciado: 'Ante una embolia gaseosa venosa, ¿en qué posición se coloca al paciente?',
        opciones: ['Decúbito lateral izquierdo', 'Decúbito lateral derecho', 'Sentado a 90°', 'Prono'],
        correcta: 0,
        explicacion: 'El decúbito lateral izquierdo mueve la bolsa de aire que bloquea la salida del VD; además, oxígeno al 100% y aspirar por el catéter (eficacia no demostrada).'
    },
    {
        id: 'mar-q027', tema: 'mar-cvc-complicaciones',
        enunciado: '¿Por qué la radiografía portátil no ve hasta el 50% de los neumotórax en el crítico?',
        opciones: ['En decúbito supino el aire se acumula delante del pulmón y no sube al vértice', 'Porque la dosis de radiación es demasiado baja', 'Porque los catéteres tapan el pulmón', 'Porque el neumotórax tarda 24 horas en aparecer'],
        correcta: 0,
        explicacion: 'El aire se acumula en la parte anterior de la cavidad pleural y las marcas pulmonares de detrás lo tapan. La ecografía es más sensible.'
    },
    {
        id: 'mar-q028', tema: 'mar-cvc-complicaciones',
        enunciado: 'En una radiografía, ¿qué referencia anatómica indica que la punta del catéter yugular está bien colocada?',
        opciones: ['La carina, justo encima de la unión cava-aurícula', 'La clavícula', 'El borde del diafragma', 'La silueta del ventrículo izquierdo'],
        correcta: 0,
        explicacion: 'La punta debe quedar a la altura de la carina o algo por encima: la carina está justo encima de la unión cava superior-aurícula.'
    },
    {
        id: 'mar-q029', tema: 'mar-cvc-complicaciones',
        enunciado: 'En la prueba de burbujas, ¿qué indica que las microburbujas lleguen a la aurícula en menos de 2 segundos?',
        opciones: ['Que la punta está en la cava superior', 'Que el catéter está en una arteria', 'Que hay un foramen oval permeable', 'Que el catéter está en la yugular contralateral'],
        correcta: 0,
        explicacion: 'Si aparecen burbujas en la aurícula, el catéter está en el sistema venoso; si en menos de 2 s, la punta está en la cava superior.'
    },
    {
        tipo: 'redactar', id: 'mar-q030', tema: 'mar-cvc-complicaciones',
        enunciado: 'La radiografía de control muestra la punta del catéter en la aurícula derecha. ¿Hay que recolocarlo?',
        respuestaModelo: 'Tradicionalmente se retiraba por miedo a perforación y taponamiento, pero es rarísimo: en un estudio con 2.348 pacientes con la punta en la aurícula derecha no hubo ninguna perforación ni arritmia relevante. Se está abandonando la costumbre de recolocarlos. Lo ideal sigue siendo la punta en la cava superior, 1-2 cm por encima de la aurícula.'
    },
    // ---- Ficha VI: El catéter que se queda ----
    {
        id: 'mar-q031', tema: 'mar-cateter-cuidados',
        enunciado: '¿Cada cuánto se cambia, como mínimo, un apósito transparente de poliuretano?',
        opciones: ['Cada 7 días, o antes si se acumula humedad o sangre o se rompe el sellado', 'Cada 24 horas', 'Cada 48 horas', 'Solo al retirar el catéter'],
        correcta: 0,
        explicacion: 'Tabla 3.1: el transparente, al menos cada 7 días; el de gasa, al menos cada 48 h o si está sucio o húmedo.'
    },
    {
        id: 'mar-q032', tema: 'mar-cateter-cuidados',
        enunciado: '¿Con qué se recomienda hoy lavar y sellar un catéter venoso de uso intermitente?',
        opciones: ['Suero salino al 0,9% sin conservantes', 'Heparina 1.000 U/mL', 'Citrato sódico al 1,4%', 'Agua estéril'],
        correcta: 0,
        explicacion: 'El salino es igual de eficaz que la heparina y evita el riesgo de trombocitopenia inducida por heparina. El citrato al 1,4% es una alternativa en los catéteres arteriales.'
    },
    {
        id: 'mar-q033', tema: 'mar-cateter-cuidados',
        enunciado: 'Un CVC deja de refluir. ¿Qué NO se debe hacer?',
        opciones: ['Pasar una guía para desatascarlo', 'Instilar 2 mg de alteplasa y esperar 30 minutos', 'Pensar en precipitados si la alteplasa no funciona', 'Revisar si un punto de sutura lo estrangula'],
        correcta: 0,
        explicacion: 'Pasar una guía puede soltar la masa y embolizarla. Lo estándar es disolverla químicamente (alteplasa, 80-90% de éxito).'
    },
    {
        id: 'mar-q034', tema: 'mar-cateter-cuidados',
        enunciado: 'Un catéter se ha ocluido tras infundir nutrición parenteral rica en lípidos. ¿Con qué se intenta disolver?',
        opciones: ['Etanol al 70% (o NaOH 0,1 N)', 'Ácido clorhídrico 0,1 N', 'Bicarbonato sódico 8,4%', 'Alteplasa a doble dosis'],
        correcta: 0,
        explicacion: 'Regla de la Tabla 3.3: los precipitados alcalinos con un álcali, los ácidos con un ácido y los lípidos con etanol.'
    },
    {
        id: 'mar-q035', tema: 'mar-cateter-cuidados',
        enunciado: 'Paciente con PICC y TVP del miembro superior confirmada, sin edema importante y sin contraindicación para anticoagular. ¿Hay que retirar el catéter?',
        opciones: ['No es obligatorio: solo si el edema es intenso o doloroso, o no se puede anticoagular', 'Sí, siempre de inmediato', 'Sí, y no anticoagular', 'Solo si el dímero-D está alto'],
        correcta: 0,
        explicacion: 'Se anticoagula con las mismas pautas que la TVP de las piernas. El dímero-D no sirve de cribado en el crítico.'
    },
    {
        tipo: 'redactar', id: 'mar-q036', tema: 'mar-cateter-cuidados',
        enunciado: 'El punto de inserción de un CVC tiene un eritema leve, sin pus, y el paciente está estable. ¿Hay que cambiar el catéter? ¿Y el recambio programado?',
        respuestaModelo: 'No. El eritema solo, sin otros signos, no predice infección y no obliga a cambiarlo; un CVC se cambia si hay infección (pus en el punto o bacteriemia confirmada). El recambio rutinario o programado no reduce las infecciones y aumenta las complicaciones mecánicas e infecciosas, así que no se recomienda.'
    },

    // ---- Ficha VII: Bacteriemia relacionada con el catéter ----
    {
        id: 'mar-q037', tema: 'mar-bacteriemia-cateter',
        enunciado: '¿Cuál se considera la vía principal de colonización en los catéteres percutáneos no tunelizados de la UCI?',
        opciones: ['La piel, que migra por el trayecto subcutáneo', 'La infusión contaminada', 'La luz interna por los conectores', 'La vía linfática'],
        correcta: 0,
        explicacion: 'Es la vía considerada principal. El autor, en su reflexión final, plantea como opinión que el origen podría ser el intestino.'
    },
    {
        id: 'mar-q038', tema: 'mar-bacteriemia-cateter',
        enunciado: '¿Por qué el antibiótico solo no es el tratamiento óptimo de un catéter colonizado?',
        opciones: ['La biopelícula exige concentraciones 100-1.000 veces mayores, que serían tóxicas', 'Porque los estafilococos son siempre resistentes', 'Porque el antibiótico no llega a la sangre', 'Porque la biopelícula tarda meses en formarse'],
        correcta: 0,
        explicacion: 'La biopelícula protege a los microbios de los fagocitos y del antibiótico; se forma incluso tras un solo día.'
    },
    {
        id: 'mar-q039', tema: 'mar-bacteriemia-cateter',
        enunciado: 'En el método del tiempo diferencial hasta la positividad, ¿qué criterio sugiere que el catéter es la fuente?',
        opciones: ['La sangre del catéter crece al menos 2 horas antes que la periférica', 'La periférica crece 2 horas antes', 'Ambas crecen a la vez', 'Crece solo la sangre periférica'],
        correcta: 0,
        explicacion: 'Mismo germen en ambas y crecimiento en la del catéter ≥2 h antes (exactitud 91%; el cuantitativo, ≥3 veces más colonias, 94%).'
    },
    {
        id: 'mar-q040', tema: 'mar-bacteriemia-cateter',
        enunciado: '¿Qué antibiótico es la "columna vertebral" del tratamiento empírico de la bacteriemia por catéter?',
        opciones: ['Vancomicina', 'Ceftriaxona', 'Fluconazol', 'Amoxicilina-clavulánico'],
        correcta: 0,
        explicacion: 'Es la más activa frente a estafilococos (incluidos coagulasa negativos y SARM) y enterococos. Se añade cobertura de gramnegativos en el neutropénico o grave, y equinocandina si hay riesgo de Candida.'
    },
    {
        id: 'mar-q041', tema: 'mar-bacteriemia-cateter',
        enunciado: 'Bacteriemia confirmada por catéter. ¿Cuál de estas situaciones obliga a retirarlo?',
        opciones: ['Infección por S. aureus o Candida', 'Fiebre de 38 °C el primer día', 'Leucocitosis aislada', 'Cualquier sospecha, antes de los cultivos'],
        correcta: 0,
        explicacion: 'Retirar si hay inestabilidad o fallo multiorgánico progresivo, endocarditis o tromboflebitis séptica, S. aureus, Candida, Pseudomonas o multirresistentes, o bacteriemia >96 h pese a antibiótico adecuado.'
    },
    {
        tipo: 'redactar', id: 'mar-q042', tema: 'mar-bacteriemia-cateter',
        enunciado: 'Bacteriemia por S. aureus relacionada con un catéter. ¿Qué prueba pides siempre y cuánto dura el tratamiento?',
        respuestaModelo: 'Ecocardiografía transesofágica en toda bacteriemia por S. aureus, porque los signos típicos de endocarditis faltan en hasta dos tercios de las nosocomiales. Sin endocarditis, con el catéter retirado y sin inmunodepresión ni prótesis intravasculares: 14 días. Con endocarditis: 4-6 semanas e interconsulta a Infecciosas.'
    },

    // ---- Ficha VIII: El intestino como origen de infección ----
    {
        id: 'mar-q043', tema: 'mar-microbioma',
        enunciado: '¿Dónde se concentra el 99% del microbioma intestinal?',
        opciones: ['En el colon', 'En el estómago', 'En la boca', 'En el duodeno'],
        correcta: 0,
        explicacion: 'El estómago es la zona menos poblada (<10³ por mL) y el colon la más (10¹²).'
    },
    {
        id: 'mar-q044', tema: 'mar-microbioma',
        enunciado: '¿A qué pH del jugo gástrico se erradica Salmonella typhimurium en 1 hora?',
        opciones: ['pH 2', 'pH 4', 'pH 6', 'pH 7'],
        correcta: 0,
        explicacion: 'A pH 4 crece sin problema; a pH 3 cae su supervivencia; a pH 2 se erradica en 1 hora. El jugo gástrico tiene pH 1-2.'
    },
    {
        id: 'mar-q045', tema: 'mar-microbioma',
        enunciado: '¿Qué decide que la orofaringe del paciente grave se colonice por bacilos gramnegativos?',
        opciones: ['Que el germen pueda pegarse a un epitelio cuyas proteínas de adhesión han cambiado con la enfermedad', 'La exposición al entorno del hospital', 'La edad del paciente', 'La higiene de manos del personal'],
        correcta: 0,
        explicacion: 'No depende del entorno (los empleados del hospital apenas se colonizan) sino de la enfermedad: ~70% en pacientes de UCI frente a ~2% en sanos.'
    },
    {
        id: 'mar-q046', tema: 'mar-microbioma',
        enunciado: '¿Por qué las guías internacionales de neumonía asociada al ventilador retiraron la recomendación de clorhexidina oral?',
        opciones: ['El conjunto de 11 ensayos mostró más mortalidad', 'Porque es cara', 'Porque solo actúa sobre gramnegativos', 'Porque mancha los dientes'],
        correcta: 0,
        explicacion: 'Además actúa sobre todo frente a grampositivos, mientras que en la orofaringe del crítico predominan los gramnegativos.'
    },
    {
        id: 'mar-q047', tema: 'mar-microbioma',
        enunciado: 'En la Figura 4.5, ¿cuánto redujo la descontaminación digestiva selectiva (SDD) las bacteriemias por gramnegativos?',
        opciones: ['Un 67%', 'Un 10%', 'Nada', 'Un 33%'],
        correcta: 0,
        explicacion: 'SDD −67% (1,4 frente a 4,5 por 1.000 días); la descontaminación oral sola (SOD), −33%. El efecto se pierde con multirresistentes.'
    },
    {
        tipo: 'redactar', id: 'mar-q048', tema: 'mar-microbioma',
        enunciado: 'Explica por qué se llama al intestino el "motor" del fallo multiorgánico.',
        respuestaModelo: 'Una disbiosis o un periodo de hipoperfusión esplácnica rompen la barrera mucosa (una sola capa de células de 0,1 mm frente a billones de microbios); pasan patógenos o mediadores a la circulación (translocación), se inicia la respuesta inflamatoria, y la activación simpática contrae los vasos esplácnicos y rompe aún más la barrera. Es un proceso que se autoalimenta y mantiene la inflamación sistémica con disfunción de dos o más órganos.'
    },

    // ---- Ficha IX: Lesión mucosa por estrés ----
    {
        id: 'mar-q049', tema: 'mar-ulcera-estres',
        enunciado: '¿Cuál es el desencadenante de la lesión mucosa por estrés?',
        opciones: ['La isquemia local de la mucosa', 'El exceso de secreción ácida', 'Helicobacter pylori', 'Los corticoides'],
        correcta: 0,
        explicacion: 'El ácido la agrava y la reperfusión contribuye, pero el desencadenante es la isquemia; para el autor, la causa es la hipoperfusión, no el ácido.'
    },
    {
        id: 'mar-q050', tema: 'mar-ulcera-estres',
        enunciado: 'Según la Tabla 4.2, ¿qué paciente tiene indicación de profilaxis?',
        opciones: ['Ventilado más de 24 h sin nutrición enteral', 'Ventilado más de 24 h con nutrición enteral completa', 'En tratamiento con corticoides', 'Anticoagulado'],
        correcta: 0,
        explicacion: 'Profilaxis con un factor de riesgo máximo o alto (o ≥2 moderados). La ventilación con nutrición enteral es moderada; corticoides y anticoagulación, bajos.'
    },
    {
        id: 'mar-q051', tema: 'mar-ulcera-estres',
        enunciado: 'En el ensayo de la Figura 4.6 (3.298 pacientes), ¿qué efecto tuvo el pantoprazol?',
        opciones: ['Redujo el sangrado significativo solo un 1,7%, sin beneficio neto al sumar sus riesgos', 'Redujo la mortalidad a la mitad', 'Aumentó el sangrado', 'Eliminó la neumonía asociada al ventilador'],
        correcta: 0,
        explicacion: 'Sangrado 2,5% frente a 4,2%; sumando sangrado, neumonía, C. difficile e isquemia miocárdica, 21,9% frente a 22,6%.'
    },
    {
        id: 'mar-q052', tema: 'mar-ulcera-estres',
        enunciado: '¿Por qué el sucralfato no sirve en la mayoría de los pacientes de UCI?',
        opciones: ['No se puede usar con nutrición enteral', 'Porque sube el pH gástrico', 'Porque produce más neumonía', 'Porque es nefrotóxico'],
        correcta: 0,
        explicacion: 'Necesita el estómago vacío y, mezclado con la nutrición, favorece los bezoares. Además, su aluminio fija varios fármacos.'
    },
    {
        id: 'mar-q053', tema: 'mar-ulcera-estres',
        enunciado: 'Con IBP como profilaxis, ¿cuánto aumenta el riesgo de enterocolitis por C. difficile?',
        opciones: ['Se triplica', 'No cambia', 'Se reduce a la mitad', 'Aumenta un 5%'],
        correcta: 0,
        explicacion: 'El triple de riesgo; la FDA emitió una alerta de seguridad en 2013. También aumentan la neumonía comunitaria y la asociada al ventilador.'
    },
    {
        tipo: 'redactar', id: 'mar-q054', tema: 'mar-ulcera-estres',
        enunciado: 'Paciente ventilado con nutrición enteral completa que lleva días con pantoprazol "por protocolo". ¿Qué haces y por qué?',
        respuestaModelo: 'Retirarlo (desprescribir). La ventilación con nutrición enteral es un riesgo solo moderado y sin otros factores no hay indicación. La nutrición enteral protege la mucosa (efecto trófico y sube el pH) y los supresores del ácido dejan de reducir el sangrado cuando hay nutrición enteral completa; seis ensayos muestran que retirar el pantoprazol no aumenta el sangrado significativo, y mantenerlo expone a C. difficile y neumonía.'
    },
    // ---- Ficha X: Tromboprofilaxis — riesgo y fármacos ----
    {
        id: 'mar-q055', tema: 'mar-tromboprofilaxis-farmacos',
        enunciado: '¿Qué grupo tiene el riesgo más alto de TVP sin profilaxis según la fuente?',
        opciones: ['El trauma grave (TVP en el 58%)', 'La enfermedad médica aguda', 'La cirugía general menor', 'El embarazo'],
        correcta: 0,
        explicacion: 'Sobre todo lesión cerebral y medular y fracturas de columna, pelvis, cadera y huesos largos.'
    },
    {
        id: 'mar-q056', tema: 'mar-tromboprofilaxis-farmacos',
        enunciado: '¿Cuál de estas es una contraindicación ABSOLUTA de la tromboprofilaxis farmacológica?',
        opciones: ['Hemorragia intracraneal', 'Menstruación', 'Plaquetas de 120.000', 'Edad mayor de 80 años'],
        correcta: 0,
        explicacion: 'Absolutas: hemorragia intracraneal y sangrado clínicamente importante. Relativas: trauma craneal o medular, sangrado digestivo recurrente, coagulopatía grave. La menstruación no es contraindicación.'
    },
    {
        id: 'mar-q057', tema: 'mar-tromboprofilaxis-farmacos',
        enunciado: 'Paciente con ClCr de 25 mL/min. ¿Qué dosis profiláctica de enoxaparina da la Tabla 5.2?',
        opciones: ['30 mg al día, o usar heparina no fraccionada', '40 mg cada 12 h', '60 mg al día', 'Está contraindicada a cualquier dosis'],
        correcta: 0,
        explicacion: 'ClCr <30: 30 mg al día o HNF; la HNF parece la mejor opción con ClCr <20.'
    },
    {
        id: 'mar-q058', tema: 'mar-tromboprofilaxis-farmacos',
        enunciado: '¿Qué ventaja de la dalteparina destaca la fuente frente a la enoxaparina?',
        opciones: ['No necesita ajuste en la insuficiencia renal', 'Está bien estudiada en la obesidad mórbida', 'Es oral', 'No produce TIH'],
        correcta: 0,
        explicacion: 'Dalteparina 2.500-5.000 U al día, sin ajuste renal; en la obesidad no está bien estudiada.'
    },
    {
        id: 'mar-q059', tema: 'mar-tromboprofilaxis-farmacos',
        enunciado: '¿Cuánto tiempo hay que esperar tras la última dosis de enoxaparina (una vez al día) antes de una punción neuroaxial?',
        opciones: ['Al menos 24 horas', 'Al menos 2 horas', 'Al menos 6 horas', 'No hace falta esperar'],
        correcta: 0,
        explicacion: 'HNF SC ≥12 h; enoxaparina una vez al día ≥24 h; dabigatrán y rivaroxabán ≥48 h y apixabán ≥24 h con función renal normal o algo reducida.'
    },
    {
        tipo: 'redactar', id: 'mar-q060', tema: 'mar-tromboprofilaxis-farmacos',
        enunciado: 'Compara la heparina no fraccionada y la HBPM: mecanismo, biodisponibilidad y riesgo de TIH.',
        respuestaModelo: 'La HNF activa la antitrombina III (efecto anti-Xa) y además se une a la trombina (anti-IIa, 10 veces mayor y variable según la longitud de la cadena); se une a proteínas, endotelio, macrófagos y al factor plaquetario 4, lo que da biodisponibilidad baja (15-30%) y TIH en un 2,6%. La HBPM, con moléculas más pequeñas y uniformes, inhibe sobre todo el Xa y se une menos a la trombina: respuesta predecible, biodisponibilidad del 90%, efecto más largo y TIH del 0,2%.'
    },

    // ---- Ficha XI: Tromboprofilaxis mecánica y por escenario ----
    {
        id: 'mar-q061', tema: 'mar-tromboprofilaxis-escenarios',
        enunciado: '¿Qué método mecánico es el estándar y puede ser tan eficaz como la anticoagulación?',
        opciones: ['La compresión neumática intermitente', 'Las medias de compresión gradual', 'El filtro de vena cava', 'La movilización pasiva'],
        correcta: 0,
        explicacion: 'Aumenta el flujo y la fibrinolisis; las medias son el método menos eficaz y nunca se usan solas en el hospitalizado.'
    },
    {
        id: 'mar-q062', tema: 'mar-tromboprofilaxis-escenarios',
        enunciado: '¿Qué límite de presión no debe superar nunca la compresión neumática intermitente?',
        opciones: ['La presión diastólica', 'La presión venosa central', '100 mmHg', 'La presión sistólica'],
        correcta: 0,
        explicacion: 'Si la superara, comprimiría las arterias. Además limita la movilidad y macera la piel: retirarla cuando no haga falta.'
    },
    {
        id: 'mar-q063', tema: 'mar-tromboprofilaxis-escenarios',
        enunciado: 'Paciente de UCI por una enfermedad médica aguda. ¿Qué pauta propone la fuente?',
        opciones: ['HBPM sola, sin añadir profilaxis mecánica, y no prolongar tras el alta', 'HBPM más compresión neumática siempre', 'Solo medias de compresión', 'HBPM hasta 35 días tras el alta'],
        correcta: 0,
        explicacion: 'Todo paciente de UCI se considera de alto riesgo, pero la pauta es HBPM sola y no se prolonga tras el alta.'
    },
    {
        id: 'mar-q064', tema: 'mar-tromboprofilaxis-escenarios',
        enunciado: 'En un TCE grave, ¿cuándo se pasa de la compresión neumática a la enoxaparina?',
        opciones: ['Cuando la TC no muestre sangrado ni progresión durante 24 horas', 'En las primeras 2 horas', 'A los 14 días', 'Nunca: el TCE contraindica la anticoagulación'],
        correcta: 0,
        explicacion: 'Después se da enoxaparina 30 mg SC cada 12 h. En el trauma grave se recomienda monitorizar el anti-Xa.'
    },
    {
        id: 'mar-q065', tema: 'mar-tromboprofilaxis-escenarios',
        enunciado: 'Con un ClCr <15 mL/min, ¿qué tromboprofilaxis se puede usar según la fuente?',
        opciones: ['Solo heparina no fraccionada o warfarina', 'Cualquier ACOD', 'Fondaparinux', 'Enoxaparina 40 mg al día'],
        correcta: 0,
        explicacion: 'En la insuficiencia renal grave, la warfarina es el único oral seguro; de los parenterales, la HNF no requiere ajuste.'
    },
    {
        tipo: 'redactar', id: 'mar-q066', tema: 'mar-tromboprofilaxis-escenarios',
        enunciado: 'Resume la reflexión del autor ("adivina, adivinanza") sobre la inmovilidad como factor de riesgo de TVP.',
        respuestaModelo: 'Si la inmovilidad fuera la causa, la TVP sería epidémica en los ancianos encamados y se haría profilaxis perpetua en la paraplejia, y no es así. La idea viene de la estasis de la tríada de Virchow, pero inmovilidad no es estasis: con gasto normal, el retorno venoso también lo es. Lo que dispararía la TVP en los pacientes de alto riesgo sería sobre todo la inflamación (y la lesión vascular en trauma y ortopedia); en la lesión medular el riesgo solo es alto 3-4 semanas. Según el autor, esa creencia lleva a usar anticoagulantes de más.'
    },

    // ---- Ficha XII: Analgesia ----
    {
        id: 'mar-q067', tema: 'mar-analgesia',
        enunciado: 'En la escala numérica de dolor (1-10), ¿a partir de qué valor el dolor es inaceptable?',
        opciones: ['Más de 3', 'Más de 7', 'Más de 5', 'Solo con 10'],
        correcta: 0,
        explicacion: 'La autoevaluación es la medida más exacta; más de 3 = dolor inaceptable.'
    },
    {
        id: 'mar-q068', tema: 'mar-analgesia',
        enunciado: '¿Sirven la frecuencia cardíaca y la presión arterial para valorar el dolor en el paciente sedado?',
        opciones: ['No: se correlacionan mal con la intensidad del dolor', 'Sí, son el mejor indicador', 'Solo la frecuencia cardíaca', 'Solo en el posoperatorio'],
        correcta: 0,
        explicacion: 'Hay que abandonar esa práctica y usar la escala conductual del dolor (BPS), con ≥6 = dolor inaceptable.'
    },
    {
        id: 'mar-q069', tema: 'mar-analgesia',
        enunciado: '¿Por qué el fentanilo ha sustituido a la morfina como el opioide más usado en la UCI?',
        opciones: ['No libera histamina (menos hipotensión) y no tiene metabolitos activos', 'Porque no se acumula nunca', 'Porque no da depresión respiratoria', 'Porque es más barato'],
        correcta: 0,
        explicacion: 'Además es 600 veces más liposoluble (inicio más rápido). Su pega: se acumula en el cerebro con el uso continuado.'
    },
    {
        id: 'mar-q070', tema: 'mar-analgesia',
        enunciado: '¿Qué ajuste necesita la morfina en la insuficiencia renal?',
        opciones: ['Reducir la dosis de mantenimiento un 50%', 'Ninguno', 'Doblar la dosis', 'Está contraindicada'],
        correcta: 0,
        explicacion: 'Sus metabolitos activos se acumulan: la morfina-3-glucurónido puede dar mioclonías y convulsiones; la 6-glucurónido es más analgésica que la morfina.'
    },
    {
        id: 'mar-q071', tema: 'mar-analgesia',
        enunciado: '¿Por qué ya no se usa la meperidina (petidina) en la UCI?',
        opciones: ['Su metabolito normeperidina se acumula en la insuficiencia renal y da convulsiones y delirio', 'Porque libera mucha histamina', 'Porque no es analgésica', 'Porque solo existe por vía oral'],
        correcta: 0,
        explicacion: 'La normeperidina tiene una vida media de 15-40 h; con tanta disfunción renal en la UCI es un riesgo inaceptable.'
    },
    {
        tipo: 'redactar', id: 'mar-q072', tema: 'mar-analgesia',
        enunciado: '¿Qué opciones de analgesia sin opioides da la Tabla 6.3 y qué precauciones tiene cada una?',
        respuestaModelo: 'Paracetamol 1 g IV cada 6 h, sin pasar de 4 g al día (hepatotoxicidad), sin efecto antiinflamatorio. Ketorolaco 30 mg IV cada 6 h, a la mitad (15 mg) en insuficiencia renal, edad ≥65 o peso <50 kg; reduce un 25-50% la dosis de opioide. Ketamina 60-120 µg/kg/h con un opioide (ahorradora), sin efectos psicomiméticos llamativos a esas dosis y no aconsejada en la isquemia miocárdica. Para el dolor neuropático, gabapentina o carbamazepina por vía enteral.'
    },

    // ---- Ficha XIII: Sedación ----
    {
        id: 'mar-q073', tema: 'mar-sedacion',
        enunciado: 'En la escala RASS, ¿qué puntuación tiene un paciente que se despierta brevemente a la voz (menos de 10 s) con contacto visual?',
        opciones: ['−2 (sedación ligera)', '−1 (somnoliento)', '−3 (sedación moderada)', '0 (alerta y tranquilo)'],
        correcta: 0,
        explicacion: '−1 se despierta más de 10 s; −2, menos de 10 s; −3 se mueve a la voz sin contacto visual.'
    },
    {
        id: 'mar-q074', tema: 'mar-sedacion',
        enunciado: '¿A qué rango de RASS se titula una perfusión de sedantes?',
        opciones: ['−1 a −2', '−3 a −4', '+1 a +2', '−5'],
        correcta: 0,
        explicacion: 'El objetivo óptimo es 0; en perfusión, sedación ligera (−1 a −2), que favorece el destete y reduce el delirio.'
    },
    {
        id: 'mar-q075', tema: 'mar-sedacion',
        enunciado: '¿Qué riesgo grave tiene la perfusión de lorazepam a dosis altas y prolongadas?',
        opciones: ['Toxicidad por propilenglicol (acidosis láctica)', 'Síndrome de infusión', 'Hipertrigliceridemia', 'Bradicardia extrema'],
        correcta: 0,
        explicacion: 'Con >0,1 mg/kg/h o 10 mg/h más de 48 h. El lactato no predice bien la toxicidad: vigilar el hiato osmolar (>10).'
    },
    {
        id: 'mar-q076', tema: 'mar-sedacion',
        enunciado: '¿Qué distingue a la dexmedetomidina de los demás sedantes?',
        opciones: ['La sedación cooperativa, sin depresión respiratoria', 'Que no causa hipotensión ni bradicardia', 'Que es amnésica e intensamente analgésica', 'Que no tiene síndrome de retirada'],
        correcta: 0,
        explicacion: 'El paciente se despierta sin bajar la perfusión; es el fármaco de elección en el delirio de la UCI. Da bradicardia e hipotensión, y retirada en el 30%.'
    },
    {
        id: 'mar-q077', tema: 'mar-sedacion',
        enunciado: 'Según la Tabla 6.7, ¿qué es lo que más alarga el despertar tras una perfusión de propofol?',
        opciones: ['La profundidad de la sedación', 'La edad del paciente', 'La función renal', 'La concentración del preparado'],
        correcta: 0,
        explicacion: 'Tras 24 h, 13 minutos con sedación ligera frente a 25 horas con sedación profunda.'
    },
    {
        tipo: 'redactar', id: 'mar-q078', tema: 'mar-sedacion',
        enunciado: 'Describe la pauta de haloperidol IV para la agitación de la Tabla 6.8 y su principal precaución.',
        respuestaModelo: 'Empezar con 5 mg IV (añadiendo midazolam 1 mg si está muy agitado), esperar 15 minutos (el texto dice 20); si no responde, doblar a 10 mg; si tampoco, cambiar de fármaco; si responde, mantener con el 25% de la dosis eficaz cada 6 h (el texto dice cada 4-6 h). No usarlo con QTc >500 ms: la prolongación del QT puede dar torsade de pointes (3-4%), sobre todo con QTc >500 ms o más de 35 mg al día.'
    },
    // ---- Ficha XIV: Oximetría ----
    {
        id: 'mar-q079', tema: 'mar-oximetria',
        enunciado: '¿Con qué dos longitudes de onda distingue el pulsioxímetro la oxihemoglobina de la desoxihemoglobina?',
        opciones: ['Rojo (660 nm) e infrarrojo (940 nm)', 'Azul (450 nm) y verde (530 nm)', 'Ultravioleta e infrarrojo', 'Una sola longitud de onda'],
        correcta: 0,
        explicacion: 'En el rojo la oxihemoglobina absorbe menos que la desoxihemoglobina; en el infrarrojo, al revés.'
    },
    {
        id: 'mar-q080', tema: 'mar-oximetria',
        enunciado: 'Paciente con vasoconstricción intensa y la SpO₂ del dedo no da señal. ¿Qué alternativa propone la fuente?',
        opciones: ['El sensor de frente, por reflectancia y con cinta elástica', 'El lóbulo de la oreja sin pulsatilidad', 'Esperar a que mejore la perfusión', 'Una gasometría venosa'],
        correcta: 0,
        explicacion: 'La circulación de la frente viene de la carótida interna y se contrae menos; la cinta reduce las pulsaciones venosas, que podrían confundirse con las arteriales.'
    },
    {
        id: 'mar-q081', tema: 'mar-oximetria',
        enunciado: '¿Qué objetivo de SpO₂ da la guía más reciente de oxigenoterapia en la insuficiencia respiratoria hipercápnica?',
        opciones: ['88-92%', '94-98%', '100%', '80-85%'],
        correcta: 0,
        explicacion: 'En la mayoría, 90-94%; en la hipercápnica, 88-92%. Un cambio de 3-4% se considera significativo.'
    },
    {
        id: 'mar-q082', tema: 'mar-oximetria',
        enunciado: 'En la oximetría venosa mixta continua, ¿qué cambio se considera significativo?',
        opciones: ['Más del 5% durante más de 10 minutos', 'Cualquier cambio de 1%', 'Más del 20% en 1 minuto', 'Solo los cambios por debajo de 50%'],
        correcta: 0,
        explicacion: 'En ventilados estables la SvO₂ varía un 5-6% en pocas horas.'
    },
    {
        id: 'mar-q083', tema: 'mar-oximetria',
        enunciado: 'En la oximetría dual, ¿qué diferencia SpO₂ − SvO₂ indica una amenaza para el metabolismo aerobio?',
        opciones: ['≥50%', '>10%', '>25%', '<20%'],
        correcta: 0,
        explicacion: 'Entre >25% y <50% el aporte está reducido pero compensado; ≥50% amenaza el metabolismo aerobio, y se ha validado como indicador para transfundir en la anemia.'
    },
    {
        tipo: 'redactar', id: 'mar-q084', tema: 'mar-oximetria',
        enunciado: 'Un paciente rescatado de un incendio tiene una SpO₂ del 98%. ¿Te fías? ¿Qué pides?',
        respuestaModelo: 'No. El pulsioxímetro solo usa dos longitudes de onda y no detecta la carboxihemoglobina ni la metahemoglobina: si suben, la SaO₂ cae pero la SpO₂ apenas cambia, así que en la intoxicación por CO la SpO₂ sobrestima la SaO₂. Hay que pedir una gasometría arterial con cooximetría, que usa hasta 8 longitudes de onda.'
    },

    // ---- Ficha XV: Capnografía ----
    {
        id: 'mar-q085', tema: 'mar-capnografia',
        enunciado: 'En el capnograma, ¿qué indica un ascenso lento de la fase II?',
        opciones: ['Más espacio muerto alveolar, como en la EPOC', 'Una intubación esofágica', 'Hiperventilación', 'Un sensor desconectado'],
        correcta: 0,
        explicacion: 'Con ventilación y perfusión bien emparejadas el ascenso es rápido; lento si hay alvéolos con PCO₂ baja.'
    },
    {
        id: 'mar-q086', tema: 'mar-capnografia',
        enunciado: 'Durante una sedación para un procedimiento, ¿qué detecta antes la hipoventilación?',
        opciones: ['La PETCO₂, que sube antes de que baje la SpO₂', 'La SpO₂', 'La frecuencia cardíaca', 'La presión arterial'],
        correcta: 0,
        explicacion: 'Por eso se recomienda la capnografía siempre que se seda para un procedimiento.'
    },
    {
        id: 'mar-q087', tema: 'mar-capnografia',
        enunciado: '¿En qué situación puede no detectarse CO₂ aunque el tubo esté en la tráquea?',
        opciones: ['En la parada cardíaca', 'En la hiperventilación', 'En la acidosis metabólica', 'En la hiperoxia'],
        correcta: 0,
        explicacion: 'Sin retorno venoso no llega CO₂ al alvéolo. El broncoespasmo grave se ha propuesto, sin buena confirmación.'
    },
    {
        id: 'mar-q088', tema: 'mar-capnografia',
        enunciado: 'Tras 20 minutos de RCP, ¿qué valor de PETCO₂ hace improbable recuperar la circulación espontánea?',
        opciones: ['≤10 mmHg', '≤30 mmHg', '≥40 mmHg', 'Cualquier valor: no tiene valor pronóstico'],
        correcta: 0,
        explicacion: 'La PETCO₂ es valiosa como pronóstico en la RCP.'
    },
    {
        id: 'mar-q089', tema: 'mar-capnografia',
        enunciado: 'Según la Tabla 7.1, ¿qué situación hace que la PETCO₂ sea MAYOR que la PaCO₂?',
        opciones: ['Hipermetabolismo, acidosis metabólica o hiperoxia', 'Embolia pulmonar', 'Fuga en el circuito', 'Caída aguda del gasto cardíaco'],
        correcta: 0,
        explicacion: 'Lo habitual en la insuficiencia respiratoria es lo contrario: más espacio muerto, PETCO₂ menor que PaCO₂.'
    },
    {
        tipo: 'redactar', id: 'mar-q090', tema: 'mar-capnografia',
        enunciado: 'Explica para qué sirve seguir la diferencia PaCO₂ − PETCO₂ en un paciente ventilado.',
        respuestaModelo: 'En el sano son casi iguales, pero la PETCO₂ cae respecto a la PaCO₂ cuando aumenta el espacio muerto (alvéolos sobreventilados respecto a su perfusión), lo que pasa en casi toda insuficiencia respiratoria: la diferencia permite seguir la evolución. En ventilación mecánica, si la diferencia aumenta puede deberse en parte a sobreinsuflación por volúmenes excesivos, así que ayuda a encontrar el volumen óptimo.'
    },

    // ---- Ficha XVI: Catéter de arteria pulmonar y enclavamiento ----
    {
        id: 'mar-q091', tema: 'mar-cateter-ap',
        enunciado: 'Al avanzar el catéter, ¿cómo se reconoce que la punta ha pasado del ventrículo derecho a la arteria pulmonar?',
        opciones: ['Sube bruscamente la presión diastólica sin cambiar la sistólica', 'Desaparece la onda pulsátil', 'Baja la presión sistólica', 'Aparecen ondas v gigantes'],
        correcta: 0,
        explicacion: 'Por la resistencia del circuito pulmonar. La desaparición de la onda pulsátil marca el enclavamiento.'
    },
    {
        id: 'mar-q092', tema: 'mar-cateter-ap',
        enunciado: '¿Por qué no se debe dejar el globo hinchado mucho tiempo?',
        opciones: ['Puede romper la arteria pulmonar o infartar el pulmón', 'Porque descalibra el termistor', 'Porque produce arritmias auriculares', 'Porque falsea la PVC'],
        correcta: 0,
        explicacion: 'Al ver el enclavamiento, se deshincha el globo y debe volver la onda pulsátil.'
    },
    {
        id: 'mar-q093', tema: 'mar-cateter-ap',
        enunciado: 'En un paciente ventilado con presión positiva, ¿en qué punto del trazado se mide el enclavamiento?',
        opciones: ['Al final de la espiración, el punto más bajo de cada oscilación', 'En el pico inspiratorio', 'Promediando todo el ciclo', 'En el punto más alto de cada oscilación'],
        correcta: 0,
        explicacion: 'Al final de la espiración la presión intratorácica es cero; con presión positiva es el punto más bajo, y en respiración espontánea el más alto.'
    },
    {
        id: 'mar-q094', tema: 'mar-cateter-ap',
        enunciado: '¿Qué cambio espontáneo del enclavamiento se considera clínicamente significativo?',
        opciones: ['Más de 4 mmHg', 'Cualquier cambio de 1 mmHg', 'Más de 15 mmHg', 'Solo si supera 25 mmHg'],
        correcta: 0,
        explicacion: 'La variación es ≤4 mmHg en el 60% de los pacientes, pero llega a 7 mmHg.'
    },
    {
        id: 'mar-q095', tema: 'mar-cateter-ap',
        enunciado: '¿Qué hallazgo del trazado de enclavamiento salta a la vista en la insuficiencia mitral?',
        opciones: ['Ondas v prominentes', 'Ausencia de onda a', 'Onda c gigante', 'Un trazado plano'],
        correcta: 0,
        explicacion: 'La onda v es la sístole del VI contra la mitral; en la insuficiencia mitral se hace prominente.'
    },
    {
        tipo: 'redactar', id: 'mar-q096', tema: 'mar-cateter-ap',
        enunciado: 'Paciente con SDRA y enclavamiento de 10 mmHg. ¿Descarta eso un edema pulmonar hidrostático? Razónalo.',
        respuestaModelo: 'No. El enclavamiento se mide sin flujo (Q = 0) y equivale a la presión de la aurícula izquierda, no a la presión capilar. Con el globo deshinchado la presión capilar la supera en Q × resistencia de las venas pulmonares, una diferencia que no se puede calcular y que aumenta con la venoconstricción pulmonar (hipoxemia, endotoxemia, vasopresores y el propio SDRA). Por eso un enclavamiento normal no descarta el edema hidrostático, y usarlo como criterio diagnóstico de SDRA debería abandonarse.'
    },

    // ---- Ficha XVII: Termodilución y parámetros ----
    {
        id: 'mar-q097', tema: 'mar-termodilucion',
        enunciado: 'Tres medidas seriadas de gasto por termodilución, ¿cuándo son fiables?',
        opciones: ['Si difieren ≤10%; el gasto es su media', 'Siempre que haya al menos dos', 'Solo si son idénticas', 'Si difieren menos del 30%'],
        correcta: 0,
        explicacion: 'Si difieren más del 10%, no son fiables; y un cambio de gasto debe superar el 10% para ser significativo.'
    },
    {
        id: 'mar-q098', tema: 'mar-termodilucion',
        enunciado: '¿Qué error produce inyectar un volumen escaso o poco frío?',
        opciones: ['Sobrestima el gasto', 'Infraestima el gasto', 'No altera el resultado', 'Da una curva en meseta'],
        correcta: 0,
        explicacion: 'Menos cambio de temperatura se interpreta como más dilución, es decir, más flujo.'
    },
    {
        id: 'mar-q099', tema: 'mar-termodilucion',
        enunciado: 'Con la fórmula de la fuente, ¿qué superficie corporal tiene un paciente de 170 cm y 70 kg?',
        opciones: ['1,8 m²', '1,5 m²', '2,4 m²', '2,0 m²'],
        correcta: 0,
        explicacion: 'SC = [talla (cm) + peso (kg) − 60] / 100 = (170 + 70 − 60) / 100 = 1,8 m².'
    },
    {
        id: 'mar-q100', tema: 'mar-termodilucion',
        enunciado: '¿Cómo se calcula el índice de resistencia vascular sistémica (IRVS)?',
        opciones: ['(PAM − PVC) / índice cardíaco', 'PAM × índice cardíaco', '(PAP − enclavamiento) / índice cardíaco', 'PAM / frecuencia cardíaca'],
        correcta: 0,
        explicacion: 'Normal 25-30 unidades Wood indexadas. No es una resistencia medible de verdad, sino una relación global presión-flujo.'
    },
    {
        id: 'mar-q101', tema: 'mar-termodilucion',
        enunciado: '¿Qué rango normal da la Tabla 8.1 para la presión de enclavamiento?',
        opciones: ['6-12 mmHg', '0-5 mmHg', '15-25 mmHg', '20-40 mmHg'],
        correcta: 0,
        explicacion: 'Algo mayor que la PVC (0-5 mmHg), lo que mantiene cerrado el foramen oval.'
    },
    {
        tipo: 'redactar', id: 'mar-q102', tema: 'mar-termodilucion',
        enunciado: '¿Por qué, para el autor, la caída del uso del catéter de arteria pulmonar es "una reputación inmerecida"?',
        respuestaModelo: 'Porque es un monitor, no un tratamiento, y la mortalidad sirve para juzgar tratamientos, no medidas. Los médicos a menudo no entienden sus medidas, y cualquier herramienta falla en malas manos. Exigir que toda intervención salve vidas no tiene sentido: el objetivo de un monitor es dar información útil, y el catéter lo hace "con distinción". Además, los estudios que motivaron su caída estaban mal diseñados según el autor.'
    },
    // ---- Ficha XVIII: El O₂ en la sangre y su transporte ----
    {
        id: 'mar-q103', tema: 'mar-transporte-o2',
        enunciado: '¿Qué contenido arterial de O₂ tiene un paciente con Hb 15 g/dL, SaO₂ 98% y PaO₂ 90 mmHg?',
        opciones: ['Unos 20 mL/dL', 'Unos 90 mL/dL', 'Unos 5 mL/dL', 'Unos 98 mL/dL'],
        correcta: 0,
        explicacion: 'CaO₂ = (1,34 × 15 × 0,98) + (0,003 × 90) = 19,7 + 0,27 ≈ 20 mL/dL; el disuelto es solo el 1,5%.'
    },
    {
        id: 'mar-q104', tema: 'mar-transporte-o2',
        enunciado: '¿Qué baja más el CaO₂: reducir la Hb a la mitad o la PaO₂ a la mitad?',
        opciones: ['La Hb: lo reduce a la mitad; la PaO₂ a la mitad solo un 20%', 'La PaO₂: lo reduce a la mitad', 'Las dos lo bajan igual', 'Ninguna lo cambia'],
        correcta: 0,
        explicacion: 'Figura 9.2: Hb 15 → 7,5 lleva el CaO₂ de 20 a 10; PaO₂ 90 → 45 (SaO₂ 98 → 78%) solo de 20 a 16 mL/dL.'
    },
    {
        id: 'mar-q105', tema: 'mar-transporte-o2',
        enunciado: '¿Qué desplaza la curva de disociación de la oxihemoglobina a la DERECHA?',
        opciones: ['Acidemia, fiebre, más CO₂ y más 2,3-DPG', 'Alcalosis e hipotermia', 'Menos 2,3-DPG', 'La sangre conservada 3 semanas'],
        correcta: 0,
        explicacion: 'A la derecha la Hb libera más O₂ en los tejidos. La P50 normal es de unos 27 mmHg según esta fuente.'
    },
    {
        id: 'mar-q106', tema: 'mar-transporte-o2',
        enunciado: '¿Qué proporción de todo el O₂ de la sangre está en las venas?',
        opciones: ['Un 70%', 'Un 25%', 'Un 50%', 'Un 5%'],
        correcta: 0,
        explicacion: 'Las arterias tienen solo el 25% de la sangre: 250 mL de O₂ frente a 555 mL en las venas (805 mL en total).'
    },
    {
        id: 'mar-q107', tema: 'mar-transporte-o2',
        enunciado: '¿Cuánto debe cambiar el VO₂ calculado con el catéter para considerarse significativo?',
        opciones: ['Al menos un 18%', 'Un 2%', 'Un 5%', 'Un 50%'],
        correcta: 0,
        explicacion: 'Por la variabilidad acumulada de sus medidas (Tabla 9.3). El VO₂ medido por calorimetría indirecta varía solo ±5%.'
    },
    {
        tipo: 'redactar', id: 'mar-q108', tema: 'mar-transporte-o2',
        enunciado: 'Escribe las ecuaciones del aporte (DO₂), el consumo (VO₂) y la extracción (O₂ER) de O₂ y sus valores normales indexados.',
        respuestaModelo: 'DO₂ = GC × (1,34 × Hb × SaO₂) × 10, normal 520-600 mL/min/m² (Tabla 9.2). VO₂ = GC × 1,34 × Hb × (SaO₂ − SvO₂) × 10 (Fick inverso, necesita la SvO₂ mixta), normal 110-160 mL/min/m². O₂ER = VO₂/DO₂ ≈ SaO₂ − SvO₂, normal 0,2-0,3: solo una cuarta parte del O₂ que llega se usa. El ×10 pasa de mL/dL a mL/L.'
    },

    // ---- Ficha XIX: Extracción de O₂ y lactato ----
    {
        id: 'mar-q109', tema: 'mar-extraccion-lactato',
        enunciado: 'Al bajar el aporte de O₂, ¿cuándo empieza el VO₂ a depender del aporte?',
        opciones: ['Cuando la extracción (SaO₂ − SvO₂) llega al 50%', 'En cuanto baja cualquier cantidad', 'Cuando la extracción baja del 20%', 'Nunca: el VO₂ siempre es constante'],
        correcta: 0,
        explicacion: 'Ese punto es el umbral del metabolismo limitado por el oxígeno.'
    },
    {
        id: 'mar-q110', tema: 'mar-extraccion-lactato',
        enunciado: 'Paciente séptico con SvO₂ del 85%. ¿Qué sugiere según la Tabla 9.4?',
        opciones: ['Un defecto de utilización del O₂ en los tejidos', 'Que la oxigenación tisular es excelente', 'Anemia grave', 'Bajo gasto cardíaco'],
        correcta: 0,
        explicacion: 'SvO₂ >80% o SaO₂ − SvO₂ <20%: mala utilización, casi siempre por sepsis ("cortocircuito periférico").'
    },
    {
        id: 'mar-q111', tema: 'mar-extraccion-lactato',
        enunciado: 'En la Figura 9.4, ¿qué mortalidad hospitalaria tenían los pacientes con lactato inicial ≥4 mmol/L?',
        opciones: ['38%', '15%', '4%', '80%'],
        correcta: 0,
        explicacion: '≤2: 15%; 2,1-3,9: 25%; ≥4: 38%. Y si se normalizaba en <24 h, 4%; en 48-96 h, 43%.'
    },
    {
        id: 'mar-q112', tema: 'mar-extraccion-lactato',
        enunciado: '¿Cuál es la vía principal de la hiperlactatemia en la sepsis según la fuente?',
        opciones: ['La inhibición de la piruvato deshidrogenasa por endotoxina y citocinas', 'La hipoxia tisular', 'La insuficiencia renal', 'El déficit de LDH'],
        correcta: 0,
        explicacion: 'Junto a la glucólisis acelerada por las catecolaminas. Explicaría el defecto de utilización del O₂ en la mitocondria.'
    },
    {
        id: 'mar-q113', tema: 'mar-extraccion-lactato',
        enunciado: '¿Qué déficit vitamínico frecuente y poco reconocido en el crítico puede elevar el lactato con oxígeno?',
        opciones: ['Tiamina', 'Vitamina C', 'Vitamina D', 'Ácido fólico'],
        correcta: 0,
        explicacion: 'La PDH necesita pirofosfato de tiamina; sin él, el piruvato se desvía a lactato.'
    },
    {
        tipo: 'redactar', id: 'mar-q114', tema: 'mar-extraccion-lactato',
        enunciado: 'Explica el "razonamiento circular" del lactato que critica el autor y qué papel le atribuye en su lugar.',
        respuestaModelo: 'Se toma la relación entre lactato y muerte como prueba de que marca hipoxia celular, porque se cree que la falta de O₂ es la causa universal de muerte celular; pero esa idea se apoya sobre todo en la misma relación lactato-supervivencia. No hay pruebas de hipoxia celular en el shock séptico, y el lactato se produce también con O₂ (sepsis, estrés, déficit de tiamina, fármacos). Para el autor es un combustible alternativo en el estrés (densidad calórica como la glucosa; hasta el 60% de la energía del miocardio en la sepsis): su acumulación por hipoxia es la excepción, no la regla.'
    },
    // ---- Ficha XX: Cristaloides y glucosados ----
    {
        id: 'mar-q115', tema: 'mar-cristaloides',
        enunciado: '¿Qué proporción del agua corporal total es plasma?',
        opciones: ['Un 6-7%', 'Un 20%', 'Un 35%', 'Un 65%'],
        correcta: 0,
        explicacion: 'El plasma es el 20% del extracelular, que a su vez es el 35% del agua corporal total.'
    },
    {
        id: 'mar-q116', tema: 'mar-cristaloides',
        enunciado: '¿Qué componente del salino al 0,9% es el más perjudicial frente al plasma?',
        opciones: ['El cloro (154 frente a 103 mEq/L)', 'El sodio', 'El potasio', 'El calcio'],
        correcta: 0,
        explicacion: 'Produce acidosis metabólica hiperclorémica y vasoconstricción renal mediada por cloro.'
    },
    {
        id: 'mar-q117', tema: 'mar-cristaloides',
        enunciado: '¿Cómo genera bicarbonato el lactato del Ringer?',
        opciones: ['El hígado lo convierte en glucosa consumiendo H⁺: cada mmol de lactato genera un mmol de bicarbonato', 'Se une directamente a los H⁺ de la sangre', 'Lo elimina el riñón como bicarbonato', 'No genera bicarbonato'],
        correcta: 0,
        explicacion: '2 lactato + 2 H⁺ → glucosa; los OH⁻ que quedan se combinan con CO₂ y forman bicarbonato.'
    },
    {
        id: 'mar-q118', tema: 'mar-cristaloides',
        enunciado: '¿Por qué no se aconseja el Ringer lactato como diluyente de una transfusión?',
        opciones: ['Su calcio puede unirse al citrato de los hematíes y coagular', 'Porque su potasio daña los hematíes', 'Porque es hipertónico', 'Porque contiene glucosa'],
        correcta: 0,
        explicacion: 'Sin apoyo experimental firme (hay estudios que lo ven seguro), pero mejor evitarlo. Normosol y Plasma-Lyte llevan magnesio en vez de calcio.'
    },
    {
        id: 'mar-q119', tema: 'mar-cristaloides',
        enunciado: 'De 1 L de glucosado al 5%, ¿cuánto queda fuera de las células?',
        opciones: ['Unos 350 mL; dos tercios acaban dentro', 'Todo el litro', 'Unos 900 mL', 'Nada'],
        correcta: 0,
        explicacion: 'La glucosa entra en las células y se metaboliza y el agua la sigue: edema celular.'
    },
    {
        tipo: 'redactar', id: 'mar-q120', tema: 'mar-cristaloides',
        enunciado: '¿Para qué se usa el salino hipertónico en el TCE y cómo se compara con el manitol?',
        respuestaModelo: 'Para bajar la presión intracraneal. Equivale al manitol en bajar la PIC, mantiene mejor la presión de perfusión cerebral y evita su daño renal. Se usa del 3% al 25% (el 10% es popular: 0,6 mL/kg equivalen a 2 mL/kg de manitol al 20%), en bolos cada 6-8 h para mantener la PIC <20 mmHg mientras la osmolalidad sea <320. Ninguno de los dos ha mejorado la supervivencia del TCE.'
    },

    // ---- Ficha XXI: Coloides ----
    {
        id: 'mar-q121', tema: 'mar-coloides',
        enunciado: '¿Cuánto añade al plasma 1 L de albúmina al 5%?',
        opciones: ['700 mL (300 al intersticio)', '275 mL', '1.000 mL', '100 mL'],
        correcta: 0,
        explicacion: 'Unas 3 veces más eficaz que el salino (275 mL): el mismo aumento de plasma con un 30% del volumen de cristaloide.'
    },
    {
        id: 'mar-q122', tema: 'mar-coloides',
        enunciado: '¿Por qué la albúmina al 25% no es un fluido de reanimación de pérdidas?',
        opciones: ['No repone volumen: solo mueve líquido del intersticio al plasma', 'Porque dura menos de 1 hora', 'Porque es hipotónica', 'Porque está contraindicada en la hipoalbuminemia'],
        correcta: 0,
        explicacion: 'Expande el plasma 3-4 veces su volumen sacando agua del intersticio. Se usa para subir rápido el plasma en pacientes con edemas, sobre todo por hipoalbuminemia.'
    },
    {
        id: 'mar-q123', tema: 'mar-coloides',
        enunciado: '¿En qué población un gran estudio asoció la albúmina a más mortalidad que el salino?',
        opciones: ['El traumatismo craneoencefálico', 'La sepsis', 'La cirugía abdominal', 'La cirrosis'],
        correcta: 0,
        explicacion: 'Estudios recientes la muestran segura; la posible excepción es el TCE.'
    },
    {
        id: 'mar-q124', tema: 'mar-coloides',
        enunciado: '¿Qué efecto tienen los hidroxietilalmidones (HES) sobre la amilasa?',
        opciones: ['La suben 2-3 veces durante una semana, sin cambiar la lipasa', 'La bajan a cero', 'No la cambian', 'Producen pancreatitis'],
        correcta: 0,
        explicacion: 'La amilasa se une al HES y se elimina menos.'
    },
    {
        id: 'mar-q125', tema: 'mar-coloides',
        enunciado: '¿Qué límite diario se recomienda para los dextranos por su tendencia al sangrado?',
        opciones: ['20 mL/kg al día', '100 mL/kg al día', '5 mL/kg al día', 'No tienen límite'],
        correcta: 0,
        explicacion: 'Reducen la agregación plaquetaria, el factor VIII y el von Willebrand y aumentan la fibrinolisis; además dificultan las pruebas cruzadas.'
    },
    {
        tipo: 'redactar', id: 'mar-q126', tema: 'mar-coloides',
        enunciado: 'Según la propuesta del autor, ¿qué fluido eliges en cada tipo de hipovolemia?',
        respuestaModelo: 'Hipovolemia con riesgo vital (hay que reponer el plasma ya): un coloide, como la albúmina al 5%. Hipovolemia por deshidratación (pérdida uniforme del extracelular): un cristaloide, como el Ringer lactato. Hipovolemia con hipoalbuminemia (el plasma se escapa al intersticio): un coloide hiperoncótico, como la albúmina al 25%. No hay un único fluido óptimo: elegir uno para cada situación es "hacer la pregunta correcta".'
    },

    // ---- Ficha XXII: Retorno venoso y sobrecarga ----
    {
        id: 'mar-q127', tema: 'mar-retorno-venoso',
        enunciado: '¿Qué gradiente impulsa el retorno venoso según la Ecuación 11.2?',
        opciones: ['Presión sistémica media − PVC', 'PAM − PVC', 'PAM − presión de enclavamiento', 'PVC − presión intratorácica'],
        correcta: 0,
        explicacion: 'Retorno venoso = (Pms − PVC) / Rv. La reposición apenas cambia Rv, así que su objetivo es aumentar el gradiente Pms − PVC.'
    },
    {
        id: 'mar-q128', tema: 'mar-retorno-venoso',
        enunciado: 'Si la presión de la aurícula derecha sube 1 mmHg sin cambiar el volumen, ¿qué le pasa al retorno venoso?',
        opciones: ['Cae un 14% de media', 'Sube un 14%', 'No cambia', 'Cae a cero'],
        correcta: 0,
        explicacion: 'Por eso subir la PVC no debe ser un objetivo de la reposición: frena el retorno venoso.'
    },
    {
        id: 'mar-q129', tema: 'mar-retorno-venoso',
        enunciado: 'Un varón de 75 kg tiene un déficit de plasma de 450 mL. ¿Cuánto Ringer lactato hace falta para reponerlo?',
        opciones: ['2,25 L, de los que 1,8 L van al intersticio', '450 mL', '900 mL', '5 L'],
        correcta: 0,
        explicacion: 'Solo el 20% del cristaloide queda en el plasma: 450 / 0,2 = 2,25 L; el 80% (1,8 L) va al intersticio.'
    },
    {
        id: 'mar-q130', tema: 'mar-retorno-venoso',
        enunciado: '¿Cuál es el signo vital más sensible de hipovolemia según la fuente?',
        opciones: ['El aumento ortostático de la frecuencia cardíaca ≥30 lpm', 'La taquicardia en decúbito', 'La hipotensión en decúbito', 'La PVC baja'],
        correcta: 0,
        explicacion: 'Aparece con un 15% de déficit. La taquicardia en decúbito falta incluso con un 25% y la hipotensión no aparece hasta >30%.'
    },
    {
        id: 'mar-q131', tema: 'mar-retorno-venoso',
        enunciado: '¿Qué mostró la Figura 11.4 sobre la PVC y la volemia en postoperados?',
        opciones: ['Ninguna relación (r = 0,17)', 'Una correlación casi perfecta', 'Una relación inversa', 'Solo relación con PEEP alta'],
        correcta: 0,
        explicacion: 'La confunden la distensibilidad del VD y la presión intratorácica positiva. La PVC nunca debe usarse para decidir la fluidoterapia.'
    },
    {
        tipo: 'redactar', id: 'mar-q132', tema: 'mar-retorno-venoso',
        enunciado: 'Explica con la analogía del fregadero por qué la presión que impulsa el retorno venoso no es la presión arterial, y qué identifica a un paciente que responde a fluidos.',
        respuestaModelo: 'El fregadero es el sistema venoso (75% de la sangre) y el depósito de arriba, el arterial: el agua sale del fregadero por la altura de su propia columna, no por la presión del depósito. La presión que impulsa el retorno es la caída desde las vénulas (presión sistémica media, Pms) hasta la aurícula derecha: retorno = (Pms − PVC)/Rv. Una sobrecarga siempre sube la Pms, pero responde el paciente en quien aumenta el gradiente Pms − PVC.'
    },

    // ---- Ficha XXIII: Hipoperfusión y respuesta a fluidos ----
    {
        id: 'mar-q133', tema: 'mar-respuesta-fluidos',
        enunciado: '¿Qué gap de PCO₂ (venosa central − arterial) indica hipoperfusión tisular?',
        opciones: ['Más de 6 mmHg', 'Más de 1 mmHg', 'Menos de 2 mmHg', 'Más de 20 mmHg'],
        correcta: 0,
        explicacion: 'Normal 2-5 mmHg (0,3-0,7 kPa); >6 mmHg (>0,8 kPa) es hipoperfusión. Es inversamente proporcional al gasto cardíaco.'
    },
    {
        id: 'mar-q134', tema: 'mar-respuesta-fluidos',
        enunciado: 'Shock séptico con ScvO₂ del 82%. ¿Qué te ayuda a destapar una hipoperfusión?',
        opciones: ['El gap de PCO₂', 'Subir la FiO₂', 'Medir la PVC', 'Repetir la ScvO₂ en otra vena'],
        correcta: 0,
        explicacion: 'Una ScvO₂ >80% en la sepsis suele reflejar un defecto de utilización del O₂; el gap es más específico de hipoperfusión y no lo altera el shock séptico.'
    },
    {
        id: 'mar-q135', tema: 'mar-respuesta-fluidos',
        enunciado: '¿Qué proporción de pacientes inestables aumenta su volumen sistólico con fluidos?',
        opciones: ['Alrededor del 50%', 'Casi todos', 'Un 10%', 'Un 90%'],
        correcta: 0,
        explicacion: 'Y responder no significa estar hipovolémico: un normovolémico o hipervolémico también puede responder.'
    },
    {
        id: 'mar-q136', tema: 'mar-respuesta-fluidos',
        enunciado: '¿Qué variación del volumen sistólico (VVS) identifica la respuesta a fluidos en el 80%?',
        opciones: ['≥15%', '≥5%', '≥30%', '≥50%'],
        correcta: 0,
        explicacion: 'VVS = (VSmáx − VSmín) / VSmedio. Solo vale sin esfuerzos respiratorios y sin arritmias.'
    },
    {
        id: 'mar-q137', tema: 'mar-respuesta-fluidos',
        enunciado: 'Tras la elevación pasiva de las piernas el VS sube un 12%, pero con taquicardia. ¿Qué sospechas?',
        opciones: ['Un falso positivo por dolor', 'Una respuesta clara a fluidos', 'Hipertensión intraabdominal', 'Un error del monitor'],
        correcta: 0,
        explicacion: 'La EPP no debe causar taquicardia; también se sospecha dolor si la respuesta persiste al volver a semiincorporado. Por eso se mueve al paciente con la cama.'
    },
    {
        tipo: 'redactar', id: 'mar-q138', tema: 'mar-respuesta-fluidos',
        enunciado: 'Describe la prueba de elevación pasiva de las piernas: cómo se hace, qué la define como positiva y sus limitaciones.',
        respuestaModelo: 'Moviliza unos 300 mL de sangre hacia el corazón. Se empieza semiincorporado (cabecera a 30-45°), porque desde decúbito supino se pierde la sangre esplácnica; con la cama, se pone el tronco horizontal y las piernas a 30-45°; si el VS sube ≥10% y se mantiene unos minutos, se vuelve a semiincorporado y la respuesta debe desaparecer. Sensibilidad 85% y especificidad 92%. Necesita gasto continuo (la presión arterial sola no basta), da falsos negativos con presión intraabdominal alta y falsos positivos por dolor (sospecharlo si hay taquicardia).'
    },
];
