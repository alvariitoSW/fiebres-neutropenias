// Mayéutica del bloque 3, sub-bloque 3B · Disección aórtica aguda (Marino cap. 20, págs. 50-52): ficha 21 y el caso B (Anselmo).
// Datos puros; el formato está en la cabecera de b1-fluidos.js. La ficha es js/modules/cardiologia/merino-cardiologia.html.
// Modelos vivos: shockVivo `diseccion` (Joaquín a las 08:25: esmolol, nicardipino, labetalol, nitroprusiato, opioide) y `tapon`.
// Las cifras de los modelos NO van en los enunciados (primero predices, luego compruebas) y salen del monitor de la app
// (autonomo/bloques/b3/herramientas/g5-app.mjs); las del caso (Anselmo, 90 kg) son datos del paciente, no del modelo.
const PDF = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
const LA = 'docs/libro-azul-seccion-i-cardiovascular-parte2.pdf';
const la = n => `<a class="biblio-link" href="${LA}#page=${n}" target="_blank" rel="noopener">Libro Azul pág. ${n}</a>`;
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const ESC = 'docs/esc-2023-sca-parte1.pdf';
const esc = n => `<a class="biblio-link" href="${ESC}#page=${n}" target="_blank" rel="noopener">ESC 2023 SCA, PDF pág. ${n}</a>`;
const DED = '<i>Deducción; la fuente no lo dice.</i>';
const D = 'mc-diseccion-aortica';
const sv = (clave, texto) => ({ shockVivo: clave, texto });

export const MAYEUTICA_DISECCION = {
  /* =================================================================================================
     Ficha 21 · Disección aórtica aguda (cap. 20, págs. 50-52) y el caso B (Anselmo)
     ================================================================================================= */
  'mc-diseccion-aortica': {
    entrada: 'Por qué una disección de la ascendente se parece a un SCA, por qué se baja la presión con el freno primero y el vasodilatador después, y por qué el dolor que se calla no cura.',
    guia: [
      { id: 'dis-g1', corto: 'SCA o disección', tipo: 'test', fuente: 'mc-diseccion-claves · mc-diseccion-fisio',
        enunciado: 'Un paciente con dolor torácico intenso tiene el ECG con cambios isquémicos. Antes de leer la ficha: ¿cómo puede una disección de la aorta ascendente producir un cuadro que «incluye» un SCA?',
        opciones: [
          { t: 'Al propagarse hacia atrás, el desgarro puede ocluir una coronaria, dar insuficiencia aórtica o llenar el pericardio', ok: true },
          { t: 'El desgarro de la íntima forma un trombo sobre la pared aórtica y este se desprende hacia la coronaria', porque: `Marino no describe una embolia: la disección que se propaga hacia atrás ocluye la coronaria desde la pared (${p(50)}). Con ese reflejo tratarías un SCA sin haber descartado la disección, que la guía ESC manda excluir con angio-TC cuando el cuadro la hace posible (${esc(23)}).` },
          { t: 'No puede: el dolor de la disección es siempre en la espalda y el del SCA es retroesternal', porque: `La disección de la ascendente da dolor subesternal; el de la espalda es el de la descendente (${p(50)}). Con esa regla perderías la disección, que se pasa por alto en 1 de cada 3 casos (${p(50)}).` }],
        explicacion: `En la disección tipo A, la propagación <span class="hl-rojo">retrógrada</span> puede causar <span class="hl-azul">insuficiencia aórtica, oclusión coronaria y taponamiento pericárdico</span>; la presentación «puede simular o incluir un SCA» (${p(50)}).` + enFicha(D, 'mc-diseccion-fisio') },
      { id: 'dis-g2', corto: 'la FC con nicardipino solo', tipo: 'test', fuente: 'mc-diseccion-manejo · mc-tabla-20-5', modeloVivo: sv('diseccion', '🫀 Nicardipino solo en Joaquín: mira la PA y la frecuencia'),
        origen: 'ficha para el aviso; el barorreflejo, de Marino cap. 18 y del Libro Azul',
        enunciado: 'Predice, y luego lo compruebas en el modelo: a Joaquín, hipertenso, le das solo nicardipino y la presión baja. ¿Qué hace su frecuencia cardíaca?',
        opciones: [
          { t: 'Baja: con menos presión el corazón trabaja menos y se enlentece por descarga', porque: `Es lo contrario: los barorreceptores notan la caída y activan el simpático, con efecto sobre la frecuencia (${la(51)}). Si esperas bradicardia darás el vasodilatador solo y la cizalla aumentará (${p(52)}).` },
          { t: 'No cambia: el nicardipino actúa en el vaso, no en el corazón', porque: `Actúa en el vaso, pero la bajada de presión dispara el reflejo simpático (${la(51)}); por eso Marino avisa de que la bajada no debe acompañarse de taquicardia (${p(52)}).` },
          { t: 'Sube: la bajada de presión activa el reflejo simpático sobre el corazón', ok: true }],
        explicacion: `Cuando la presión cae, los barorreceptores activan el simpático (efecto inotrópico y cronotrópico positivo, ${la(51)}). En la disección es justo lo que <span class="hl-rojo">no puede pasar</span>: la bajada de presión <b>no debe acompañarse de taquicardia ni de más gasto</b> (${p(52)}).`,
        nota: `<b>En el modelo (ilustrativo):</b> Joaquín parte de 167/96, FC 94 e IC 2,8; con nicardipino 10 mg/h solo, 127/91, FC 136 e IC 3,1 y el sello «Cizalla ↑». <b>La fuente no lo dice:</b> cuánto sube la frecuencia; Marino da el aviso, no la cifra.` + enFicha(D, 'mc-diseccion-manejo') },
      { id: 'dis-g3', corto: 'por qué cizalla', tipo: 'test', fuente: 'mc-diseccion-manejo',
        enunciado: 'Un compañero dice: «Si la PAS ya está en 120, qué más da que la frecuencia esté en 120 también». ¿Por qué empeora la disección con la taquicardia y el gasto altos?',
        opciones: [
          { t: 'No empeora: lo único que cuenta es la cifra de PAS', porque: `Marino lo niega: la bajada de presión no debe acompañarse de taquicardia ni de aumento del gasto (${p(52)}). Con esa idea dejarías un vasodilatador solo, que baja la PAS y sube la frecuencia.` },
          { t: 'Porque aumentan las fuerzas de cizalla que promueven la disección', ok: true },
          { t: 'Porque la taquicardia gasta oxígeno del miocardio y acaba en un infarto', porque: `Esa es la razón del betabloqueo en el SCA, que reduce la demanda de O₂ (${p(47)}); en la disección Marino da otra: la cizalla (${p(52)}). Confundirlas te haría tratar la frecuencia como isquemia y no como fuerza sobre la pared.` }],
        explicacion: `La taquicardia y el aumento del gasto <span class="hl-rojo">aumentan las fuerzas de cizalla</span> que favorecen la disección; por eso se prefieren los betabloqueantes y el vasodilatador solo se usa junto a ellos (${p(52)}).` + enFicha(D, 'mc-diseccion-manejo') },
      { id: 'dis-g4', corto: 'el dolor que cede', tipo: 'test', fuente: 'mc-diseccion-clinica',
        enunciado: 'A las tres horas de empezar, el dolor desgarrador de un paciente con disección de la ascendente desaparece del todo. ¿Cómo lo interpretas?',
        opciones: [
          { t: 'Puede ceder durante horas o días; su vuelta suele anunciar la rotura', ok: true },
          { t: 'El desgarro se ha sellado: baja el riesgo de rotura y la cirugía puede esperar', porque: `Marino lo cuenta como fuente de diagnósticos perdidos, no como curación (${p(50)}); sin cirugía mueren cerca del 60 % y la mortalidad sube 1-2 % por hora (${p(50)}, ${p(52)}).` },
          { t: 'Es un dolor funcional: la disección verdadera duele hasta el final', porque: `Solo el 5 % de las disecciones no duele, pero el dolor puede ceder espontáneamente durante horas o días (${p(50)}). Con esa regla darías de alta a un paciente que se romperá al volver el dolor.` }],
        explicacion: `<span class="hl-rojo">El dolor puede ceder espontáneamente durante horas o días</span> y su regreso suele ser signo de rotura inminente; esa resolución es una causa importante de diagnósticos perdidos (${p(50)}).` + enFicha(D, 'mc-diseccion-clinica') },
      { id: 'dis-g5', corto: 'hasta dónde bajar', tipo: 'test', fuente: 'mc-diseccion-objetivos', modeloVivo: sv('diseccion', '🫀 Esmolol y nicardipino: baja hasta el objetivo y mira el sello'),
        enunciado: 'Predice: con esmolol y un vasodilatador, ¿a qué PAS apuntas en la disección y hasta dónde se tolera?',
        opciones: [
          { t: 'Objetivo 100 mmHg; se tolera hasta 70, mientras el paciente esté despierto', porque: `Marino fija la PAS en 120 y tolera hasta 90 (${p(52)}). Bajar a 100-70 pasa de lo tolerado y expone al paciente a hipotensión (${DED}).` },
          { t: 'Objetivo de PAS de 120 mmHg; se suelen tolerar presiones hasta 90 mmHg', ok: true },
          { t: 'Objetivo 120 mmHg, sin límite por debajo: cuanta menos presión, menos cizalla', porque: `La tolerancia se queda en 90 (${p(52)}); por debajo, la hipotensión es la contraindicación clásica del betabloqueo (${p(47)}).` }],
        explicacion: `<span class="hl-verde">PAS objetivo de 120 mmHg</span>, aunque <span class="hl-azul">hasta 90 mmHg suele tolerarse</span> (${p(52)}). Por debajo de 90 el modelo marca «por debajo de lo tolerado».`,
        nota: `<b>Dos contextos, dos páginas.</b> En el SCA, Marino dice que con PAS <120 mmHg el betabloqueo aumenta el riesgo de shock cardiogénico (${p(47)}); en la disección, la PAS objetivo <i>es</i> 120 y el betabloqueo es la base (${p(52)}). No hay que elegir entre ellas: responden a enfermedades distintas. <b>En el modelo (ilustrativo):</b> esmolol a 100 µg/kg/min más nicardipino 7,5 mg/h dejan a Joaquín en 122/59, FC 63 e IC 2,3 y salta el sello «Objetivo».` + enFicha(D, 'mc-diseccion-objetivos') },
      { id: 'dis-g6', corto: 'dos errores del residente', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-diseccion-objetivos · mc-diseccion-clinica',
        enunciado: 'Un residente propone: «Pongo analgésico cuando acabe la TC y, si la Rx y el ECG son normales, lo descarto». ¿Qué dos cosas corriges?',
        puntos: [
          `El <span class="hl-azul">opioide IV va pronto</span>: el dolor activa el simpático y sube la frecuencia, el gasto y la presión (${p(52)}).`,
          `La <span class="hl-rojo">Rx normal (hasta el 20 %) y el ECG normal (30 %)</span> no descartan: hace falta una imagen (${p(50)}).`],
        explicacion: `El dolor <b>agrava</b> la disección por la vía simpática, y los hallazgos clínicos tienen una sensibilidad limitada, por eso se exige una de las cuatro pruebas de imagen (${p(50)}, ${p(52)}).` + enFicha(D, 'mc-diseccion-clinica') },
    ],
    examen: [
      { id: 'dis-e1', corto: 'pulsos iguales', tipo: 'test', fuente: 'mc-diseccion-clinica', origen: 'ilustrativo: paciente inventado; el 15 %, de la ficha',
        enunciado: 'Un varón con dolor desgarrador tiene pulsos iguales en los dos brazos. ¿Descarta eso la disección?',
        opciones: [
          { t: 'Sí: es el signo clásico y aparece en la mayoría de las disecciones, por eso se busca siempre', porque: `Los pulsos desiguales son clásicos pero infrecuentes (15 %) (${p(50)}); con pulsos iguales, que son el 85 %, perderías la mayoría de las disecciones.` },
          { t: 'Solo si además el ECG es normal, porque entonces no hay isquemia', porque: `El ECG es normal en el 30 % de las disecciones y no las descarta (${p(50)}). Se necesita imagen.` },
          { t: 'No: los pulsos desiguales aparecen solo en el 15 % de las disecciones', ok: true }],
        explicacion: `Los <span class="hl-rojo">pulsos desiguales</span> (por obstrucción de la subclavia izquierda) son un hallazgo clásico pero <b>poco frecuente: el 15 %</b>; por eso unos pulsos iguales no descartan nada (${p(50)}).` + enFicha(D, 'mc-diseccion-clinica') },
      { id: 'dis-e2', corto: 'la prueba de imagen', tipo: 'test', fuente: 'mc-diseccion-imagen · mc-diseccion-imagen-tabla',
        enunciado: 'Según Marino, ¿qué prueba de imagen es la más sensible y específica en la disección, y cuál más acepta?',
        opciones: [
          { t: 'La ecografía transesofágica: sensibilidad 98 %, así que descarta mejor que ninguna', porque: `Su sensibilidad es 98 % pero su especificidad solo 77 % (${p(50)}); la más sensible y específica a la vez es la RM, con 98 % y 98 %.` },
          { t: 'La TC con contraste (94 % y 87 %); la RM solo se usa si la TC falla', porque: `La más sensible y específica es la RM; la TC es aceptable, no la primera (${p(50)}-${p(51)}). La aortografía (88 % y 94 %) es la menos sensible.` },
          { t: 'La resonancia (98 % y 98 %); la TC angiográfica también es aceptable', ok: true }],
        explicacion: `Una de cuatro pruebas: <span class="hl-verde">RM</span> sensibilidad y especificidad 98 %/98 %; ETE 98/77; TC 94/87; aortografía 88/94. La RM es la mejor, pero <b>la angio-TC también es aceptable</b> (${p(50)}-${p(51)}).`,
        nota: `<b>La fuente no lo dice:</b> cuál elegir en un paciente inestable ni cuánto tarda cada una; la elección depende de la disponibilidad.` + enFicha(D, 'mc-diseccion-imagen-tabla') },
      { id: 'dis-e3', corto: 'monoterapia válida', tipo: 'test', fuente: 'mc-tabla-20-5', modeloVivo: sv('diseccion', '🫀 Labetalol solo y nicardipino solo: compara'),
        enunciado: '¿Cuál de estos tres fármacos de la Tabla 20.5 se usa solo, sin betabloqueante añadido?',
        opciones: [
          { t: 'Nicardipino, porque baja la presión con rapidez', porque: `Marino lo indica en combinación con un betabloqueante (${p(52)}); solo, sube la frecuencia y el gasto y aumenta la cizalla.` },
          { t: 'Labetalol, un bloqueante α y β combinado', ok: true },
          { t: 'Nitroprusiato, porque es el más potente', porque: `También se usa en combinación con un betabloqueante (${p(52)}); además, evitar >3 µg/kg/min prolongados por el cianuro.` }],
        explicacion: `El <span class="hl-azul">labetalol</span> bloquea α y β y «se usa como monoterapia»; el nicardipino y el nitroprusiato son <span class="hl-rojo">vasodilatadores</span> que van <b>siempre con un betabloqueante</b> (${p(52)}). El labetalol se evita en la IC aguda (${p(52)}).`,
        nota: `<b>La fuente no lo dice:</b> por qué el labetalol sí vale solo; Marino lo da como hecho de la tabla.` + enFicha(D, 'mc-tabla-20-5') },
      { id: 'dis-e4', corto: 'nitroprusiato 4', tipo: 'test', fuente: 'mc-tabla-20-5', origen: 'ilustrativo: paciente inventado; la dosis, de la Tabla 20.5',
        enunciado: 'Un paciente con disección ya con esmolol recibe nitroprusiato a 4 µg/kg/min desde hace horas. Tiene función renal y hepática normales y no tiene isquemia coronaria. ¿Qué te preocupa?',
        opciones: [
          { t: 'Nada: 4 está dentro de la dosis eficaz típica (2-5) y se puede mantener sin límite', porque: `La dosis eficaz es 2-5, pero hay que evitar infusiones prolongadas por encima de 3 µg/kg/min (${p(52)}); mantenerla expone al paciente a la intoxicación por cianuro.` },
          { t: 'El cianuro: se evitan infusiones prolongadas por encima de 3 µg/kg/min', ok: true },
          { t: 'Que debería ir sin betabloqueante: el esmolol y el nitroprusiato se anulan', porque: `El nitroprusiato se usa precisamente junto a un betabloqueante (${p(52)}); quitarlo dejaría al paciente con taquicardia refleja.` }],
        explicacion: `Eficaz: 0,2 y luego 2-5 µg/kg/min, pero <span class="hl-rojo">se evitan infusiones prolongadas por encima de 3 µg/kg/min</span> por el riesgo de cianuro; se puede añadir tiosulfato (500 mg) al infusato (${p(52)}). No usarlo con fallo hepático o renal ni con isquemia coronaria (${p(52)}).` + enFicha(D, 'mc-tabla-20-5') },
      { id: 'dis-e5', corto: 'esmolol 80 kg', tipo: 'test', fuente: 'mc-tabla-20-5', origen: 'ilustrativo: paciente inventado; la pauta, de la Tabla 20.5',
        enunciado: 'Una paciente de 80 kg con disección va a empezar esmolol. ¿Qué bolo y qué velocidad inicial?',
        opciones: [
          { t: 'Bolo de 40 mg y 4 mg/min', ok: true },
          { t: 'Bolo de 4 mg y 40 mg/min', porque: `Se ha cambiado el punto decimal: 500 µg/kg son 40 mg y 50 µg/kg/min son 4 mg/min (${p(51)}); 40 mg/min es una dosis diez veces mayor y cae por encima del máximo de 200 µg/kg/min (16 mg/min).` },
          { t: 'Bolo de 40 mg y 16 mg/min, el máximo, para bajar cuanto antes', porque: `Se empieza a 50 µg/kg/min y se sube de 25 en 25, con un bolo antes de cada subida, hasta un máximo de 200 (${p(51)}); saltar al máximo quita la titulación para la que se elige el esmolol (${DED}).` }],
        explicacion: `500 µg/kg × 80 kg = 40 mg; 50 µg/kg/min × 80 kg = <span class="hl-azul">4 mg/min</span>; sube de 25 µg/kg/min (2 mg/min) con un bolo antes de cada subida, hasta 200 µg/kg/min (16 mg/min). No se indica en la IC aguda (${p(51)}).` + enFicha(D, 'mc-tabla-20-5') },
      { id: 'dis-e6', corto: 'betabloqueo PAS 120', tipo: 'test', fuente: 'mc-diseccion-objetivos · mc-tabla-20-5', origen: 'ficha: SCA (pág. 47) y disección (pág. 52)',
        enunciado: 'Marino desaconseja el betabloqueo en el SCA cuando la PAS es <120 mmHg, y en la disección fija la PAS objetivo en 120 con el betabloqueo como base. ¿Se contradice?',
        opciones: [
          { t: 'Sí: manda la regla del SCA y en la disección se esperaría a tener PAS >120 antes del betabloqueo', porque: `Son dos enfermedades distintas: la PAS objetivo de la disección es 120 y el betabloqueo es la base (${p(52)}); esperar a una PAS más alta dejaría la cizalla sin tratar.` },
          { t: 'Sí: manda la de la disección y en el SCA con PAS <120 se da igual el betabloqueo', porque: `En el SCA, con PAS <120 mmHg el betabloqueo aumenta el riesgo de shock cardiogénico (${p(47)}); darlo igual lo provocaría.` },
          { t: 'No: son enfermedades distintas, cada una con su razón (shock en el SCA, cizalla en la disección)', ok: true }],
        explicacion: `<span class="hl-azul">SCA:</span> el betabloqueo reduce la demanda de O₂, pero con PAS <120 aumenta el riesgo de shock cardiogénico (${p(46)}-${p(47)}). <span class="hl-azul">Disección:</span> el betabloqueo frena la cizalla, la PAS objetivo es 120 y se tolera hasta 90 (${p(52)}).`,
        nota: `<b>Las dos páginas son de Marino y no se eligen entre sí.</b> Que no se contradigan es una deducción (${DED}): Marino no compara las dos reglas. <b>La fuente no lo dice:</b> cómo se maneja una disección que llega con PAS <120 mmHg; el texto solo fija el objetivo.` + enFicha(D, 'mc-diseccion-objetivos') },
    ],
    profundizar: [
      { id: 'mc-tabla-20-5', titulo: 'Tabla 20.5: las cinco filas completas (incluido el metoprolol)' },
      { id: 'mc-diseccion-farmaco-select', titulo: 'El selector: qué antihipertensivo elijo' },
    ],
    casos: [
      { id: 'c-dis', titulo: 'Anselmo, 61 años: el dolor que se calla', corto: 'Caso · Anselmo', sub: 'hipertenso mal controlado; 90 kg; el dolor que cede y vuelve',
        paciente: { Edad: '61 años, varón', Peso: '90 kg', Antecedentes: 'hipertensión mal controlada', Motivo: 'dolor torácico desgarrador de 50 minutos' },
        pasos: [
          { momento: '22:05', datos: { 'PA brazo derecho': '186/104', 'PA brazo izquierdo': '180/100', FC: '98', ECG: 'descenso del ST de 1 mm en II, III y aVF' }, nuevo: ['PA brazo derecho', 'PA brazo izquierdo', 'FC', 'ECG'],
            pregunta: { id: 'dis-c1', tipo: 'test', fuente: 'mc-diseccion-claves · mc-diseccion-clinica',
              enunciado: 'Dolor desgarrador, ECG con descenso del ST y PA muy alta. ¿Das heparina y un antiagregante P2Y12 como a un SCASEST?',
              opciones: [
                { t: 'Sí: con descenso del ST y dolor torácico se trata como SCASEST hasta que se demuestre otra cosa', porque: `La presentación de la disección puede simular o incluir un SCA y el ECG isquémico aparece en el 15 % (${p(50)}); tratarlo como SCA sin descartarla sería pasarla por alto, algo que ocurre en 1 de cada 3 casos (${p(50)}).` },
                { t: 'No: antes hay que descartar la disección; el ECG isquémico no la excluye', ok: true },
                { t: 'Solo la aspirina y la heparina; el P2Y12 espera a la angiografía', porque: `Mantiene un antitrombótico sin haber descartado una aorta que se está abriendo; la imagen es lo que decide (${p(50)}). La imagen decide antes de tratar como SCA (${esc(23)}); Marino no dice qué le hace un antitrombótico a la disección.` }],
              explicacion: `La disección <span class="hl-rojo">puede simular o incluir un SCA</span> y el ECG tiene cambios isquémicos en el 15 % de los casos: antes de tratarlo como SCA hay que descartarla (${p(50)}; ${esc(23)}).`,
              nota: `<b>La fuente no lo dice:</b> que los antitrombóticos agraven la disección. Se buscó en Marino cap. 20, el Libro Azul cardiovascular (partes 1 y 2) y la guía ESC 2023 de SCA (partes 1 y 2): solo dicen que la disección se descarta con angio-TC y que se confunde con un SCA; por eso la respuesta se apoya en eso. Las cifras de PA de Anselmo son del paciente del caso.` + enFicha(D, 'mc-diseccion-claves') } },
          { momento: '22:25', datos: { 'Rx de tórax': 'sin ensanchamiento mediastínico', Pulsos: 'iguales en los dos brazos', ECG: 'sin más cambios' }, nuevo: ['Rx de tórax', 'Pulsos'],
            pregunta: { id: 'dis-c2', tipo: 'test', fuente: 'mc-diseccion-clinica', origen: 'ficha: los porcentajes; el paciente, inventado',
              enunciado: 'La radiografía es normal y los pulsos son iguales. ¿Descartas la disección?',
              opciones: [
                { t: 'Sí: el ensanchamiento aparece en el 60 % y su ausencia la hace improbable', porque: `El ensanchamiento está en el 60 %, así que el 40 % no lo tiene; la Rx es normal hasta en el 20 % (${p(50)}). Con esa lógica darías de alta a una disección.` },
                { t: 'Solo si repites el ECG y es normal', porque: `El ECG es normal en el 30 % de las disecciones (${p(50)}); otra prueba de baja sensibilidad no descarta nada.` },
                { t: 'No: la Rx es normal hasta en el 20 % y los pulsos son iguales en el 85 %; hace falta imagen', ok: true }],
              explicacion: `Rx normal en hasta el <span class="hl-rojo">20 %</span> de los casos y pulsos desiguales en solo el 15 % (iguales en el 85 %): por la <b>limitada sensibilidad de los hallazgos clínicos</b>, se requiere imagen (${p(50)}).` + enFicha(D, 'mc-diseccion-clinica') } },
          { momento: '22:50', datos: { 'TC con contraste': 'flap íntimal en la aorta ascendente' }, nuevo: ['TC con contraste'],
            pregunta: { id: 'dis-c3', tipo: 'test', fuente: 'mc-fig-20-4 · mc-diseccion-fisio',
              enunciado: 'La TC muestra un flap en la ascendente. ¿Qué te dice y qué haces?',
              opciones: [
                { t: 'Disección tipo A: el flap la distingue de un aneurisma sacular y la cirugía es el tratamiento de elección', ok: true },
                { t: 'Tipo B, porque el flap está lejos de la válvula aórtica: se maneja con fármacos', porque: `La disección que afecta a la aorta entre la válvula y el tronco braquiocefálico es tipo A (${p(50)}) y la cirugía es el tratamiento de elección (${p(51)}). Marino no trata el tipo B.` },
                { t: 'No es concluyente: con una TC (94 % y 87 %) hay que repetir con aortografía antes de operar', porque: `La angio-TC es aceptable (${p(51)}); esperar otra prueba retrasaría una cirugía en la que la mortalidad sube 1-2 % por hora (${p(52)}).` }],
              explicacion: `El <span class="hl-azul">flap íntimal</span> separa la luz verdadera de la falsa y distingue la disección de un aneurisma sacular (${p(51)}). Entre la válvula aórtica y el tronco braquiocefálico es <b>tipo A</b>: emergencia quirúrgica (${p(50)}-${p(51)}).` + enFicha(D, 'mc-fig-20-4') } },
          { momento: '22:55 · las órdenes', datos: { Diagnóstico: 'disección tipo A', 'Órdenes escritas': 'cuatro, hechas por un residente' }, nuevo: ['Diagnóstico'],
            pregunta: { id: 'dis-c4', tipo: 'error', fuente: 'mc-diseccion-manejo · mc-diseccion-objetivos · mc-tabla-20-5', modeloVivo: sv('diseccion', '🫀 Prueba la orden en el monitor de Joaquín'),
              enunciado: 'Órdenes del residente para Anselmo. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Nicardipino a 5 mg/h en monoterapia para bajar la presión.', mal: true, c: `El nicardipino va siempre con un betabloqueante; solo sube la frecuencia y el gasto (${p(52)}).` },
                { t: 'Opioide IV precoz: el dolor sube la frecuencia, el gasto y la presión.' },
                { t: 'Objetivo: dejar la PAS en 150, porque es hipertenso crónico.', mal: true, c: `La PAS objetivo es <span class="hl-verde">120 mmHg</span> y se tolera hasta 90 (${p(52)}).` },
                { t: 'Avisar ya a cirugía cardíaca: es el tratamiento de elección.' }],
              explicacion: 'Dos errores: el vasodilatador solo y un objetivo de PAS que no es el de Marino.',
              nota: `<b>La fuente no lo dice:</b> qué opioide ni en qué dosis; solo habla de opioides IV (${p(52)}).` + enFicha(D, 'mc-diseccion-objetivos') } },
          { momento: '23:10 · esmolol', datos: { Peso: '90 kg', 'PA': '186/104', FC: '98', Pauta: 'esmolol de la Tabla 20.5' }, nuevo: ['Peso', 'Pauta'],
            pregunta: { id: 'dis-c5', tipo: 'test', fuente: 'mc-tabla-20-5 · mc-diseccion-objetivos', modeloVivo: sv('diseccion', '🫀 Esmolol y luego nicardipino en Joaquín'),
              origen: 'ficha: la pauta; los productos por peso (45 mg, 4,5 mg/min, 18 mg/min) son aritmética sobre la Tabla 20.5, no cifras de la fuente; Anselmo es el paciente del caso; las cifras del monitor son de Joaquín en el modelo (ilustrativo)',
              enunciado: 'Anselmo pesa 90 kg. ¿Qué bolo de esmolol y qué velocidad de infusión inicial le pones?',
              opciones: [
                { t: 'Bolo de 45 mg y 4,5 mg/min', ok: true },
                { t: 'Bolo de 4,5 mg y 45 mg/min', porque: `Se ha desplazado la coma: 500 µg/kg son 45 mg y 50 µg/kg/min son 4,5 mg/min (${p(51)}); 45 mg/min sería diez veces la dosis de inicio.` },
                { t: 'Bolo de 45 mg y 18 mg/min, el máximo, para llegar antes', porque: `Empieza en 50 µg/kg/min y sube de 25 en 25 con un bolo antes de cada subida hasta 200 (${p(51)}); a 90 kg, 200 son 18 mg/min, techo y no punto de partida.` }],
              explicacion: `500 µg/kg × 90 kg = <span class="hl-azul">45 mg</span> de bolo; 50 µg/kg/min × 90 kg = <span class="hl-azul">4,5 mg/min</span>. Sube de 25 µg/kg/min con otro bolo antes de cada subida (máx. 200) hasta la PAS deseada (${p(51)}); si el esmolol solo no alcanza 120, se añade el nicardipino (${p(52)}).`,
              nota: `<b>En el modelo (ilustrativo; es Joaquín, no Anselmo):</b> con esmolol a 100 µg/kg/min baja a 149/67 con FC 63 e IC 2,1; al añadir nicardipino 7,5 mg/h queda en 122/59, FC 63 e IC 2,3, y salta el sello «Objetivo». <b>La fuente no lo dice:</b> cuánto baja la PA cada escalón.` + enFicha(D, 'mc-tabla-20-5') } },
          { momento: '01:00 · el giro', datos: { 'PA': '120/64', FC: '62', Dolor: 'ha desaparecido', 'Nota del R1': '«mejoría clínica; cirugía a primera hora»' }, nuevo: ['PA', 'FC', 'Dolor', 'Nota del R1'],
            pregunta: { id: 'dis-c6', tipo: 'test', fuente: 'mc-diseccion-clinica · mc-diseccion-objetivos', origen: 'ficha; las cifras de Anselmo son del caso',
              enunciado: 'La PA ya está en el objetivo y el dolor ha desaparecido. El R1 escribe «mejoría clínica; cirugía a primera hora». ¿Qué le corriges?',
              opciones: [
                { t: 'Nada: si el dolor cede es que la disección se ha estabilizado', porque: `El dolor puede ceder espontáneamente durante horas o días (${p(50)}); y la cirugía, la intervención de elección, no puede esperar: la mortalidad sube 1-2 % por hora (${p(52)}).` },
                { t: 'Que retire el opioide, porque sin dolor ya no hace falta', porque: `El dolor agrava la disección por la vía simpática (${p(52)}); quitar la analgesia por la desaparición del dolor ignora que este puede volver y anunciar la rotura (${p(50)}).` },
                { t: 'Que el dolor puede ceder horas o días y su vuelta anuncia rotura: cirugía urgente', ok: true }],
              explicacion: `<span class="hl-rojo">El dolor puede ceder horas o días</span> y su vuelta suele anunciar la rotura inminente (${p(50)}). La cirugía es el tratamiento de elección y la mortalidad sube 1-2 % por hora; uno de cada tres casos se pasa por alto (${p(50)}, ${p(52)}).` + enFicha(D, 'mc-diseccion-clinica') } },
          { momento: '03:10 · de nuevo', datos: { Dolor: 'vuelve, desgarrador', 'PA': '92/58', FC: '118', Auscultación: 'soplo diastólico nuevo', PVC: '16 mmHg' }, nuevo: ['Dolor', 'PA', 'FC', 'Auscultación', 'PVC'],
            pregunta: { id: 'dis-c7', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-diseccion-fisio', modeloVivo: sv('tapon', '🫀 El taponamiento en el monitor y en la eco'), origen: 'ficha; el soplo y la PVC, fisiología general',
              enunciado: 'Dolor de nuevo, hipotensión, taquicardia, soplo diastólico y PVC alta. En una disección de la ascendente, ¿qué tres complicaciones buscas?',
              puntos: [
                `<span class="hl-rojo">Insuficiencia aórtica</span> (el soplo diastólico nuevo).`,
                `<span class="hl-rojo">Oclusión de una coronaria</span> (isquemia).`,
                `<span class="hl-rojo">Taponamiento pericárdico</span> (hipotensión con PVC alta).`],
              explicacion: `La propagación retrógrada puede dar <b>insuficiencia aórtica, oclusión coronaria y taponamiento</b> (${p(50)}). El dolor que vuelve suele anunciar la rotura; sin cirugía mueren cerca del 60 % y la mortalidad sube 1-2 % por hora; la reparación la deja en torno al 10 % (${p(50)}, ${p(52)}).`,
              nota: `<b>La fuente no lo dice:</b> qué hallazgo corresponde a cada complicación; el soplo y la PVC son fisiología general (${DED}). En el modelo, Joaquín una hora después ilustra el taponamiento. <b>Nota de fidelidad:</b> en la p. 52 la cifra del 10 % tras la cirugía cita la referencia (30), distinta de la (39) de la frase anterior; se copia tal cual.` + enFicha(D, 'mc-diseccion-fisio') } },
        ],
        lleva: [
          'Nunca un vasodilatador solo: primero el freno (esmolol) y después el nicardipino hasta una PAS de 120.' + enFicha(D, 'mc-diseccion-manejo'),
          'Ni la Rx, ni el ECG, ni los pulsos normales descartan una disección: hace falta imagen.' + enFicha(D, 'mc-diseccion-imagen'),
          'El dolor que se calla no cura: puede ceder horas o días y su vuelta anuncia la rotura.' + enFicha(D, 'mc-diseccion-clinica')],
        volver: { nombre: 'Manejo de la disección', ancla: 'mc-diseccion-manejo', modelo: sv('diseccion', '🫀 Esmolol y nicardipino en el monitor') } },
    ],
  },
};
