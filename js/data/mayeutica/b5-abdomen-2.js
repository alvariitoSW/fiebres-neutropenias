// Mayéutica del bloque 5, grupo 5B (parte 2) · El abdomen que se infecta (Marino cap. 41): fichas 7 ma-colecistitis,
// 8 ma-infeccion-abdominal y 9 ma-cdifficile, y los casos de Leocadia (C3), Isidora (C4) y Prudencio (C2). Datos puros;
// formato en la cabecera de b1-fluidos.js. La pinta js/core/mayeutica.js.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-abdomen.html) y de su PDF
// (docs/marino-2024-abdomen-temperatura-caps39-44.pdf, págs. 25-35; página del PDF = la que se enlaza). Los pacientes se inventan.
// Huecos respetados: Marino no da dosis ni duración del antibiótico en la colecistitis, ni criterios de cuándo operar
// el megacolon, ni dosis de meropenem en el cap. 41. La Tabla 41.3 está en la pág. 33 (la pág. 32 solo trae su título).
const PDF = 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
// «(pág. 26)» o «(págs. 26 y 27)», cada una enlazada al PDF.
const pg = (...n) => ' (' + (n.length > 1 ? 'págs. ' : 'pág. ') + n.map(x => pag(x, String(x))).join(' y ') + ')';
// La vista Visual de una ficha de Marino abdomen, como botón «modelo» (sale tras contestar).
const visual = (tab, texto) => ({ especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab, enVisual: '', texto });
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoAbdomen" data-panel="panel-marino-abd-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const SSC = '<a class="biblio-link" href="https://www.sccm.org/sccm/media/PDFs/Surviving-Sepsis-Campaign-2021-Guidelines-Infographic_Vasoactive-Agent.pdf?lang=en-US" target="_blank" rel="noopener">Surviving Sepsis Campaign 2021, vasoactivos</a>';
const ACG = '<a class="biblio-link" href="https://www.pubmed.gov/34003176/" target="_blank" rel="noopener">Kelly CR et al., Am J Gastroenterol 2021;116:1124-47</a>';
const TOK = '<a class="biblio-link" href="https://pubmed.ncbi.nlm.nih.gov/29090866/" target="_blank" rel="noopener">Tokyo Guidelines 2018, antibióticos</a>';
const septico = texto => ({ shockVivo: 'septico', texto });

export const MAYEUTICA_ABDOMEN_2 = {
  /* =================================================================================================
     Ficha 7 · Colecistitis alitiásica (cap. 41, págs. 25-27)
     ================================================================================================= */
  'ma-colecistitis': {
    entrada: `La vesícula del crítico se infecta sin piedras y a menudo sin dolor: falta en un tercio, hemocultivos positivos en el 90 % (${pg(26)}); la ecografía tiene S 81 % y E 83 % (${pg(26)}).`,
    guia: [
      { id: 'cole-g1', corto: 'los mecanismos', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'ma-cole-mecanismo · ma-cole-riesgo',
        enunciado: 'Un paciente lleva seis días con nutrición parenteral tras un shock y desarrolla colecistitis sin ningún cálculo. Antes de mirar la ficha: ¿qué le pasa a su vesícula?',
        puntos: [
          '<span class="hl-rojo">Hipoperfusión</span> de la vesícula.',
          'Se contrae menos y se acumula <span class="hl">barro biliar</span>.',
          'El <span class="hl-azul">esfínter de Oddi se relaja</span> y entran gérmenes intestinales a la vía biliar.',
          'Cambia la bilis: el barro lleva <span class="hl">microlitos</span> que favorecen la colecistitis.'],
        explicacion: 'Son los cuatro mecanismos posibles de Marino; el libro no dice cuál pesa más en cada paciente' + pg(25) + '.' },
      { id: 'cole-g2', corto: 'a quién buscarla', tipo: 'test', fuente: 'ma-cole-riesgo · ma-cole-def',
        enunciado: 'Pase de guardia en la UCI. ¿A cuál de estos pacientes le buscas la colecistitis alitiásica aunque no se queje?',
        opciones: [
          { t: 'Al que lleva días en sepsis o shock, con parenteral o tras cirugía con bomba', ok: true },
          { t: 'Al que tiene cálculos biliares conocidos y cólicos repetidos desde hace años', porque: 'Eso es la colecistitis litiásica, con el cístico obstruido por cálculos. La alitiásica es la del crítico, y si esperas piedras no se la buscarás al que más riesgo tiene.' },
          { t: 'Solo al que se queja de dolor en el hipocondrio derecho y tiene Murphy positivo', porque: 'En un tercio de los casos el dolor falta. Esperar a que duela retrasa la intervención, y la enfermedad puede empeorar muy rápido.' }],
        explicacion: 'Predisponen el <span class="hl">ictus, la sepsis, el shock, el reposo intestinal prolongado (parenteral) y el posoperatorio</span>, sobre todo de cirugía con circulación extracorpórea. Es poco frecuente, típica del crítico y más grave que la litiásica' + pg(25) + '.' },
      { id: 'cole-g3', corto: 'sin dolor', tipo: 'test', fuente: 'ma-cole-clinica', modeloVivo: septico('🫀 La fiebre con hipotensión y sin foco, en el shock a pie de cama'),
        enunciado: 'Un paciente sedado tiene fiebre, hipotensión y fallo multiorgánico, y el abdomen no duele a la palpación. ¿Descarta eso la colecistitis alitiásica?',
        opciones: [
          { t: 'No: fiebre e hipotensión son inespecíficas y el dolor falta en un tercio', ok: true },
          { t: 'Sí: sin dolor en el hipocondrio derecho ni defensa abdominal no hay colecistitis', porque: 'El dolor falta en un tercio de los pacientes. Dar por descartada la vesícula deja sin tratar un foco que puede empeorar muy rápido.' },
          { t: 'Solo si los hemocultivos salen negativos', porque: 'Son positivos en el 90 %, pero no se usan para descartar: la prueba que decide es la ecografía, la primera. Esperarlos retrasa el diagnóstico de un cuadro que empeora rápido.' }],
        explicacion: 'La presentación es <span class="hl">inespecífica</span> (fiebre, hipotensión, fallo multiorgánico). El dolor en el hipocondrio derecho falta en <span class="hl-rojo">un tercio</span>; los hemocultivos son positivos en el 90 %' + pg(26) + '.' },
      { id: 'cole-g4', corto: 'la eco', tipo: 'test', fuente: 'ma-cole-eco · mar-img-41-1', modelo: visual('ma-colecistitis', '👁️ Fig. 41.1: la mucosa desprendida (vista Visual)'),
        enunciado: 'Antes de ver la Figura 41.1: en la eco de una colecistitis alitiásica, ¿qué hallazgo es de verdad específico?',
        opciones: [
          { t: 'Una vesícula distendida con barro', porque: 'Sugieren la enfermedad, pero no son específicos: el barro aparece en muchos críticos. Operar o drenar por ese solo hallazgo se pasa de largo.' },
          { t: 'Mucosa desprendida en la luz de la vesícula, típica de la gangrenosa', ok: true },
          { t: 'Una eco normal, porque la descarta', porque: 'Con sensibilidad del 81 % pierde casi 1 de cada 5. Quedarte tranquilo con una eco normal deja sin diagnosticar a quien tiene el cuadro.' }],
        explicacion: 'Distensión y barro <span class="hl-rojo">sugieren pero no son específicos</span>. En la enfermedad avanzada se ve <span class="hl">mucosa desprendida en la luz</span>, típica de la colecistitis gangrenosa (Figura 41.1). En 26 estudios agrupados: sensibilidad del 81 % y especificidad del 83 %. Ojo: esa cifra viene de un metaanálisis de colecistitis aguda en general (ref. 9 de Marino), no solo de la alitiásica' + pg(26) + '.' },
      { id: 'cole-g5', corto: 'cuándo el HIDA', tipo: 'test', fuente: 'ma-cole-hida', origen: 'ficha; los datos del paciente son ilustrativos',
        enunciado: 'La eco no es concluyente en un paciente con una insuficiencia hepática grave (bilirrubina 9 mg/dL). ¿Qué esperas de la gammagrafía HIDA, el patrón oro?',
        opciones: [
          { t: 'Que no sirva, porque la TC rinde más que cualquier gammagrafía', porque: 'La TC es la prueba de precisión pobre; el HIDA sigue siendo el patrón oro, con la condición de que el hígado lleve el trazador a la bilis.' },
          { t: 'Que sea el patrón oro y no dependa del hígado', porque: 'Depende de él. Con un hígado que no funciona el trazador no llega a la bilis y pedirla pierde horas que este paciente no tiene.' },
          { t: 'Que falle si el hígado no mueve el trazador a la bilis', ok: true }],
        explicacion: 'Si la eco no es diagnóstica, el patrón oro es el HIDA, pero <span class="hl-rojo">necesita un hígado funcionante</span> para llevar el trazador a la bilis. La RM rinde como la eco; la TC, poco' + pg(26) + '.' },
      { id: 'cole-g6', corto: 'plan del R1', tipo: 'error', fuente: 'ma-tabla-41-1 · ma-cole-tto', modelo: visual('ma-colecistitis', '👁️ Tabla 41.1 en la vista Visual'),
        enunciado: 'La nota del R1 para una colecistitis alitiásica confirmada. Encuentra el error (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Colecistectomía laparoscópica, que es la de elección.' },
          { t: 'Si está demasiado inestable para operar, drenaje percutáneo de la vesícula.' },
          { t: 'Empiezo meropenem porque llega bien a la bilis.', mal: true, c: 'El meropenem es de <span class="hl-rojo">mala penetración</span> en la bilis (Tabla 41.1). Llegan bien piperacilina-tazobactam, ceftriaxona, ampicilina-sulbactam, ciprofloxacino, levofloxacino y tigeciclina.' },
          { t: 'El antibiótico empírico, en cuanto se confirme, y cubriendo enterobacterias.' }],
        explicacion: 'El tratamiento: colecistectomía laparoscópica o drenaje percutáneo si hay inestabilidad, y antibiótico que cubra enterobacterias y llegue a la bilis. Marino no da dosis ni duración' + pg(27) + '.',
        nota: '<b>La fuente no lo dice.</b> El libro no da dosis ni duración del antibiótico en la colecistitis: la ficha tampoco. Las ' + TOK + ' revisan la duración del tratamiento; aquí no se pone ninguna cifra.' + enFicha('ma-colecistitis', 'ma-cole-tto') }
    ],
    examen: [
      { id: 'cole-e1', corto: 'el germen', tipo: 'test', fuente: 'ma-cole-clinica · ma-cole-tto',
        enunciado: 'Un paciente con colecistitis alitiásica tiene hemocultivos positivos. ¿Qué espera encontrar y qué debe cubrir el antibiótico empírico?',
        opciones: [
          { t: 'Cocos grampositivos de la piel, y bastaría con vancomicina', porque: 'La vancomicina es de mala penetración en la bilis y no cubre gramnegativos: el paciente seguiría con el foco biliar sin tratar.' },
          { t: 'Gramnegativos aerobios: cubrir enterobacterias', ok: true },
          { t: 'Anaerobios en exclusiva, y basta con metronidazol', porque: 'El hallazgo casi constante son los gramnegativos aerobios. Un esquema solo contra anaerobios deja sin cubrir a los gérmenes que dan la bacteriemia.' }],
        explicacion: 'Los hemocultivos son positivos en el 90 % y se aíslan <span class="hl">bacilos gramnegativos aerobios casi siempre</span>; el empírico debe cubrir los gramnegativos entéricos' + pg(26, 27) + '.' },
      { id: 'cole-e2', corto: 'RM y TC', tipo: 'test', fuente: 'ma-cole-hida',
        enunciado: 'La eco es dudosa y el HIDA no está disponible esta noche. ¿Qué dice Marino de la RM y de la TC?',
        opciones: [
          { t: 'La TC es mejor que la eco y la RM no aporta nada', porque: 'Es al revés para la TC: su precisión es pobre. Fiarte de una TC normal para descartar el cuadro puede dejar sin tratar la vesícula.' },
          { t: 'Las dos rinden más que la eco: pídelas siempre primero', porque: 'La eco sigue siendo la primera prueba y la RM solo la iguala. Pedir otras antes retrasa un diagnóstico que no admite demora.' },
          { t: 'La RM rinde como la eco, y la TC tiene una precisión pobre', ok: true }],
        explicacion: 'La <span class="hl">RM tiene el mismo rendimiento que la ecografía</span> y <span class="hl-rojo">la precisión de la TC es pobre</span>' + pg(26) + '.' },
      { id: 'cole-e3', corto: 'Tabla 41.1', tipo: 'test', fuente: 'ma-tabla-41-1 · ma-bilis-calc', modelo: visual('ma-colecistitis', '👁️ Tabla 41.1 en la vista Visual'),
        enunciado: 'Con la Tabla 41.1 delante, ¿qué pareja de antibióticos llega bien a la bilis?',
        opciones: [
          { t: 'Tigeciclina con ciprofloxacino, las dos de buena penetración', ok: true },
          { t: 'Cefepima y gentamicina juntas, que cubren gramnegativos', porque: 'Las dos son de mala penetración en la bilis. En una colecistitis, el foco quedaría con una concentración insuficiente.' },
          { t: 'Ceftazidima y vancomicina juntas, que cubren gramnegativos y grampositivos', porque: 'Tampoco: ambas están en la columna de mala penetración, junto con cefepima, cefotaxima, gentamicina y meropenem.' }],
        explicacion: 'Buena penetración: ampicilina-sulbactam, ceftriaxona, ciprofloxacino, levofloxacino, piperacilina-tazobactam y tigeciclina. Mala: cefepima, cefotaxima, ceftazidima, gentamicina, meropenem y vancomicina' + pg(27) + '.' },
      { id: 'cole-e4', corto: 'más grave', tipo: 'test', fuente: 'ma-cole-def · ma-cole-tto',
        enunciado: 'Comparada con la colecistitis litiásica, la colecistitis alitiásica del paciente crítico es…',
        opciones: [
          { t: 'Más leve: sin obstrucción del cístico, la inflamación es menor', porque: 'Es al revés: es más grave. Tratarla como una litiásica leve retrasa una intervención que no admite demora.' },
          { t: 'Igual: solo cambia la causa y se maneja del mismo modo', porque: 'No es igual: puede empeorar muy rápido. Esperar la evolución con tratamiento conservador da tiempo a la gangrena.' },
          { t: 'Más grave, y puede deteriorarse muy deprisa', ok: true }],
        explicacion: '<span class="hl-rojo">Más grave que la litiásica</span> (' + pag(25, 'pág. 25') + '); puede empeorar muy rápido, por eso «la intervención pronta es obligada»: colecistectomía laparoscópica o, si está inestable, drenaje percutáneo' + pg(27) + '.' },
      { id: 'cole-e5', corto: 'lo que la eco no ve', tipo: 'test', fuente: 'ma-cole-eco',
        enunciado: 'Marino cita para la eco una sensibilidad del 81 %. Si la hicieras a 100 pacientes con colecistitis, ¿a cuántos no se la verías?',
        opciones: [
          { t: 'A unos 19: casi 1 de cada 5 se te escaparía', ok: true },
          { t: 'A unos 17, que es lo que deja la especificidad del 83 %', porque: 'La especificidad (83 %) mide los sanos que salen negativos, no los enfermos que se pierden. Con ese cálculo subestimas los falsos negativos y fías demasiado de una eco normal.' },
          { t: 'A unos 33: la eco se pierde un tercio, como el dolor', porque: 'El tercio es el de los pacientes sin dolor, otra cifra. Con 81 % de sensibilidad se pierden unos 19 de cada 100; sobrestimarlo lleva a pedir pruebas de más.' }],
        explicacion: 'Sensibilidad del 81 %: de 100 con colecistitis, la eco ve 81 y <span class="hl-rojo">no ve 19</span>. Especificidad del 83 %. Ojo: la cifra viene de un metaanálisis de 26 estudios de colecistitis aguda en general (ref. 9 de Marino), no solo de la alitiásica' + pg(26) + '.' }
    ],
    casos: [
      { id: 'leocadia', titulo: 'Leocadia, 77 años: fiebre sin dolor, día 6 de la bomba', corto: 'Caso · Leocadia', sub: 'colecistitis alitiásica tras cirugía con circulación extracorpórea',
        paciente: { Edad: '77 años', Motivo: 'Día 6 tras un recambio valvular con circulación extracorpórea; nutrición parenteral' },
        pasos: [
          { momento: 'Día 6 · mañana', datos: { Constantes: 'T 38,9 °C, FC 110, PA 88/50', Abdomen: 'sin dolor en el hipocondrio derecho' }, nuevo: ['Constantes', 'Abdomen'],
            pregunta: { id: 'leocadia-1', tipo: 'test', fuente: 'ma-cole-clinica · ma-cole-riesgo', modeloVivo: septico('🫀 Fiebre e hipotensión sin foco, en el shock a pie de cama'),
              enunciado: 'No le duele el hipocondrio derecho ni al palpar. ¿Entra la vesícula en el diagnóstico diferencial?',
              opciones: [
                { t: 'Sí: el dolor falta en un tercio y su contexto la favorece', ok: true },
                { t: 'No: sin dolor y sin signo de Murphy no puede ser colecistitis', porque: 'El dolor falta en un tercio de los casos. Descartar la vesícula por esa razón retrasa la intervención de un cuadro que empeora rápido.' },
                { t: 'Solo si la eco muestra cálculos', porque: 'La alitiásica es precisamente la que no tiene cálculos obstruyendo el cístico: si esperas piedras, la perderás.' }],
              explicacion: 'Presentación inespecífica (fiebre, hipotensión), <span class="hl-rojo">sin dolor en un tercio</span>, en una paciente con los factores predisponentes: cirugía con circulación extracorpórea y reposo intestinal' + pg(25, 26) + '.' } },
          { momento: 'Día 6 · mañana', datos: { Contexto: 'nutrición parenteral desde la cirugía' }, nuevo: ['Contexto'],
            pregunta: { id: 'leocadia-2', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'ma-cole-riesgo · ma-cole-mecanismo',
              enunciado: 'El adjunto pregunta: «¿por qué precisamente su vesícula?».',
              puntos: [
                'Por la <span class="hl-azul">bomba</span>: el posoperatorio de una cirugía con circulación extracorpórea es un factor predisponente, y la hipoperfusión es uno de los mecanismos posibles.',
                'Por la <span class="hl">nutrición parenteral</span>: el reposo intestinal prolongado predispone, y una vesícula que se contrae menos acumula barro biliar.'],
              explicacion: 'Predisponen la cirugía con circulación extracorpórea y el reposo intestinal (parenteral); entre los mecanismos, la hipoperfusión y la menor contracción con acumulación de barro' + pg(25) + '.',
              nota: '<b>La fuente no lo dice.</b> Marino cita los factores predisponentes y los mecanismos por separado, sin emparejarlos. Esta correspondencia (la bomba con la hipoperfusión, el parenteral con el barro) es una deducción.' + enFicha('ma-colecistitis', 'ma-cole-mecanismo') } },
          { momento: 'Día 6 · mediodía', datos: { Hemocultivos: 'bacilos gramnegativos' }, nuevo: ['Hemocultivos'],
            pregunta: { id: 'leocadia-3', tipo: 'test', fuente: 'ma-cole-eco · ma-cole-hida',
              enunciado: 'Con hemocultivos que ya crecen gramnegativos y sospecha de la vesícula, ¿qué prueba pides primero?',
              opciones: [
                { t: 'TC abdominal: ve todo el abdomen de una vez', porque: 'La precisión de la TC es pobre para este diagnóstico. Una TC normal no descartaría la vesícula y retrasaría el tratamiento.' },
                { t: 'Ecografía; el HIDA solo si no basta y el hígado funciona', ok: true },
                { t: 'HIDA directamente, que es el patrón oro de este diagnóstico', porque: 'Es el patrón oro, pero Marino lo reserva para cuando la eco no es diagnóstica y exige un hígado funcionante. Saltarte la eco retrasa un diagnóstico urgente.' }],
              explicacion: 'La <span class="hl">ecografía es la prueba inicial</span>; si no es diagnóstica, el patrón oro es el HIDA (necesita un hígado que funcione). La RM rinde como la eco; la TC, poco' + pg(26, 27) + '.' } },
          { momento: 'Día 6 · tarde', datos: { Ecografía: 'pared muy engrosada y masa ecogénica en la luz (Figura 41.1)' }, nuevo: ['Ecografía'],
            pregunta: { id: 'leocadia-4', tipo: 'error', fuente: 'ma-cole-tto · ma-tabla-41-1 · mar-img-41-1', modelo: visual('ma-colecistitis', '👁️ Fig. 41.1: la mucosa desprendida (vista Visual)'),
              enunciado: 'La eco enseña mucosa desprendida: colecistitis gangrenosa. La nota del R1: ¿hay algún error? Puede haber 0, 1 o 2.',
              frases: [
                { t: 'Colecistectomía laparoscópica, que es la de elección.' },
                { t: 'Si no aguanta el quirófano, drenaje percutáneo de la vesícula.' },
                { t: 'Antibiótico empírico ya, cubriendo enterobacterias.' },
                { t: 'Piperacilina-tazobactam: llega bien a la bilis.' }],
              explicacion: 'Ninguna frase es errónea: laparoscópica de elección, percutáneo si hay inestabilidad, empírico que cubra enterobacterias, y piperacilina-tazobactam está en la columna de buena penetración (Tabla 41.1)' + pg(27) + '.' } },
          { momento: 'Día 6 · noche · el giro', datos: { Constantes: 'PA 82/48 con noradrenalina' }, nuevo: ['Constantes'], calculadora: { ir: 'ma-bilis-resultado', nombre: '¿Llega a la bilis? (Tabla 41.1)' },
            pregunta: { id: 'leocadia-5', tipo: 'test', fuente: 'ma-cole-tto · ma-tabla-41-1', modeloVivo: septico('🫀 El shock con noradrenalina, a pie de cama'),
              enunciado: 'Sigue hipotensa con noradrenalina. ¿Quirófano o drenaje, y qué antibiótico? Comprueba en la calculadora piperacilina-tazobactam y meropenem.',
              opciones: [
                { t: 'Colecistectomía laparoscópica ya: es la de elección', porque: 'Es la de elección, pero esta paciente está demasiado inestable para la cirugía. El quirófano en shock con noradrenalina añade un riesgo que el drenaje evita.' },
                { t: 'Drenaje percutáneo por inestable, y meropenem por el shock séptico', porque: 'El drenaje es lo correcto, pero el meropenem es de mala penetración en la bilis (Tabla 41.1). Su papel de elección en el shock séptico es en la infección intraabdominal con BLEE, no en la vesícula.' },
                { t: 'Drenaje percutáneo y piperacilina-tazobactam (llega a la bilis)', ok: true }],
              explicacion: 'Si el paciente está <span class="hl-rojo">demasiado inestable para operar</span>, el drenaje percutáneo es una alternativa adecuada; el antibiótico debe cubrir enterobacterias y llegar a la bilis' + pg(27) + '.',
              nota: '<b>La fuente no lo dice.</b> Marino no da dosis ni duración del antibiótico en la colecistitis; por eso aquí no se pone ninguna. Las ' + TOK + ' revisan la duración del tratamiento.' + enFicha('ma-colecistitis', 'ma-cole-tto') } },
        ],
        lleva: [
          'Sin dolor no se descarta la colecistitis alitiásica: falta en un tercio.',
          'La eco va primero; el HIDA, si no basta y el hígado funciona; la TC rinde poco.',
          'A la bilis llegan piperacilina-tazobactam y ceftriaxona; el meropenem, no.'],
        volver: { nombre: 'Clínica de la colecistitis alitiásica', ancla: 'ma-cole-clinica', modeloVivo: septico('🫀 El shock séptico, en el estado de Leocadia') } },
    ],
    profundizar: [
      { id: 'ma-cole-def', titulo: 'Qué es la colecistitis alitiásica', nota: 'La introducción del capítulo (Arbuthnot-Lane y la idea de la autointoxicación) está en la ' + pag(25, 'pág. 25') + ' del PDF.' },
    ],
  },

  /* =================================================================================================
     Ficha 8 · Infección intraabdominal complicada (cap. 41, págs. 31-35)
     ================================================================================================= */
  'ma-infeccion-abdominal': {
    entrada: `Aire libre, cirugía pronto y un antibiótico que cubra lo que hay. Rx de pie hasta 85 %, TC localiza 85 %; tras cirugía el aire dura ≥1 semana (${pg(31)}); meropenem en el shock, tigeciclina no (${pg(33)}).`,
    guia: [
      { id: 'iia-g1', corto: 'aire libre', tipo: 'test', fuente: 'ma-iia-neumoperitoneo · mar-img-41-4', modelo: visual('ma-infeccion-abdominal', '👁️ Fig. 41.4: aire bajo los dos diafragmas (vista Visual)'),
        enunciado: 'Un paciente con dolor abdominal de inicio brusco y signos de irritación peritoneal. ¿Qué exige el diagnóstico de perforación y qué prueba ve más?',
        opciones: [
          { t: 'Aire libre en el peritoneo; la TC ve más que la radiografía de pie', ok: true },
          { t: 'Líquido libre en la eco; la radiografía de pie ve más que la TC', porque: 'El diagnóstico exige aire libre, no líquido. Y la TC es más sensible que la placa simple: fiarte de una radiografía normal para descartar deja sin cirugía una perforación.' },
          { t: 'Leucocitosis y fiebre; basta la radiografía de tórax si sale normal', porque: 'Ni la leucocitosis ni la fiebre son el criterio. La radiografía de pie solo detecta hasta el 85 %: una normal no descarta la perforación.' }],
        explicacion: 'El diagnóstico <span class="hl">requiere aire libre (neumoperitoneo)</span>. La radiografía de tórax de pie detecta hasta el <span class="hl">85 %</span> (Figura 41.4); la TC es más sensible y localiza la perforación en el 85 %' + pg(31) + '.' },
      { id: 'iia-g2', corto: 'aire tras cirugía', tipo: 'test', fuente: 'ma-iia-neumoperitoneo · ma-iia-postop',
        enunciado: 'Día 5 de una laparotomía. Fiebre y una radiografía de pie con aire bajo el diafragma. ¿Es una perforación nueva?',
        opciones: [
          { t: 'No sirve: el aire persiste al menos una semana tras la cirugía', ok: true },
          { t: 'Sí: el aire libre confirma la perforación', porque: 'Tras una cirugía abdominal el neumoperitoneo puede persistir al menos una semana. Operar por esa placa sola expone al paciente a una reintervención innecesaria.' },
          { t: 'No: el aire se reabsorbe en 48 horas, así que es una fuga nueva', porque: 'Persiste al menos una semana. Esperar que la placa «se limpie» a los dos días retrasa una fuga anastomótica real.' }],
        explicacion: 'El neumoperitoneo <span class="hl-rojo">no es útil poco después de una cirugía abdominal</span>: puede persistir al menos una semana. Por eso la fuga anastomótica se reconoce tarde' + pg(31, 34) + '.' },
      { id: 'iia-g3', corto: 'volumen o presor', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'ma-iia-manejo', modeloVivo: septico('🫀 El shock séptico a pie de cama'),
        enunciado: 'Perforación con oliguria e hipotensión, camino del quirófano. ¿Por qué volumen sí y, si se puede, vasopresor mejor no antes de operar?',
        puntos: [
          'Se <span class="hl">pierde mucho líquido al peritoneo</span> por el contenido intestinal: la oliguria o la hipotensión piden reponer volumen.',
          'El vasopresor produce <span class="hl-rojo">vasoconstricción esplácnica</span> y agrava la isquemia intestinal de fondo.'],
        explicacion: 'Lo primero suele ser la cirugía; en el periodo perioperatorio, volumen si hay compromiso circulatorio y evitar el vasopresor si es posible' + pg(32) + '.',
        nota: '<b>Las fuentes difieren.</b> Marino prefiere evitar el vasopresor antes de operar (' + pag(32, 'pág. 32') + '); la Surviving Sepsis 2021 pone la noradrenalina como primera línea en el shock séptico (' + SSC + '). No se elige ganadora.' },
      { id: 'iia-g4', corto: 'sin resistentes', tipo: 'test', fuente: 'ma-iia-sin-resistentes · ma-tabla-41-3', modelo: visual('ma-infeccion-abdominal', '👁️ Tabla 41.3 en la vista Visual'),
        calculadora: { ir: 'ma-cob-resultado', nombre: '¿Qué antibiótico cubre lo que necesito?' },
        enunciado: 'Perforación sin sospecha de gérmenes resistentes. Predice con la calculadora (marca gramnegativos, anaerobios y enterococos): ¿qué empírico en monoterapia?',
        opciones: [
          { t: 'Ceftriaxona con metronidazol: cubre lo mismo y es más sencillo', porque: 'Su espectro es muy inferior al de piperacilina-tazobactam y Marino la reserva para el paciente que no está grave.' },
          { t: 'Meropenem, que cubre más', porque: 'Sin sospecha de resistentes no hace falta: su uso se limita por la resistencia que se desarrolla con rapidez.' },
          { t: 'Piperacilina-tazobactam sola, en monoterapia', ok: true }],
        explicacion: 'Sin resistentes sospechados, <span class="hl">piperacilina-tazobactam en monoterapia</span>. Ceftriaxona + metronidazol es una alternativa si no está gravemente enfermo, pero con un espectro muy inferior' + pg(33) + '.' },
      { id: 'iia-g5', corto: 'BLEE y shock', tipo: 'test', fuente: 'ma-iia-blee · ma-tabla-41-3', modeloVivo: septico('🫀 El shock séptico a pie de cama'),
        calculadora: { ir: 'ma-cob-resultado', nombre: '¿Qué antibiótico cubre lo que necesito?' },
        enunciado: 'Sospecha de BLEE por una colonización previa y shock séptico. Con la calculadora, marcando «BLEE» y «Shock: sí»: ¿cuál eliges y cuál no?',
        opciones: [
          { t: 'Meropenem sí, el de elección; tigeciclina no', ok: true },
          { t: 'Tigeciclina sí, porque cubre BLEE, SARM y enterococo resistente', porque: 'No se recomienda en el shock séptico. Con ella el paciente que más espectro necesita recibe la opción que Marino desaconseja.' },
          { t: 'Piperacilina-tazobactam, que ya cubre BLEE', porque: 'En la Tabla 41.3 cubre la BLEE de forma incompleta (+/−). Con un germen resistente, el paciente en shock seguiría sin cobertura.' }],
        explicacion: 'Con BLEE: meropenem, tigeciclina o ceftazidima-avibactam. El <span class="hl">meropenem</span> es el de espectro más amplio y <span class="hl">de elección en el shock séptico</span>; la <span class="hl-rojo">tigeciclina no se recomienda en el shock</span>' + pg(33) + '.' },
      { id: 'iia-g6', corto: 'ceftazidima-avibactam', tipo: 'test', fuente: 'ma-iia-blee · ma-tabla-41-3',
        enunciado: 'Marcas anaerobios y BLEE en la calculadora y ceftazidima-avibactam no aparece. ¿Qué le falta?',
        opciones: [
          { t: 'Cubrir Pseudomonas, que es su punto débil', porque: 'La ceftazidima cubre Pseudomonas. Si crees que es ese su hueco, la usarás de más en infecciones con anaerobios.' },
          { t: 'Cubrir los enterococos y los anaerobios', ok: true },
          { t: 'Actividad frente a la BLEE, por eso se prefiere meropenem', porque: 'Sí tiene actividad frente a la BLEE: es una de las tres opciones. Lo que falta son los anaerobios, que en una perforación están.' }],
        explicacion: 'La ceftazidima cubre Pseudomonas, pero <span class="hl-rojo">no es activa frente a enterococos ni anaerobios</span>; con la combinación hay poca experiencia por ahora' + pg(33, 34) + '.' },
      { id: 'iia-g7', corto: 'Candida', tipo: 'test', fuente: 'ma-iia-candida',
        enunciado: 'Perforación gástrica en un paciente que ha recibido antibióticos hace poco. ¿Cubres algo más aparte de las bacterias?',
        opciones: [
          { t: 'Nada más: la Tabla 41.3 ya cubre lo que abunda en el intestino', porque: 'La tabla no recoge ningún antifúngico. Una perforación alta tras antibióticos es un factor de riesgo importante de peritonitis por Candida.' },
          { t: 'Tigeciclina, que añade grampositivos resistentes', porque: 'Cubre MRSA y VRE, no Candida. Cambiar de antibiótico no sirve para la Candida.' },
          { t: 'Sí: una equinocandina, que cubre todas las especies de Candida', ok: true }],
        explicacion: 'Candida abunda en el intestino, sobre todo tras antibióticos, y la <span class="hl-rojo">perforación del tubo digestivo alto</span> es un factor de riesgo importante. Si preocupa: <span class="hl">equinocandina</span> (micafungina, anidulafungina o caspofungina)' + pg(34) + '.' },
      { id: 'iia-g8', corto: 'tras la cirugía', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'ma-iia-postop',
        enunciado: 'Peritonitis posoperatoria por fuga anastomótica. ¿Qué cambia respecto de la perforación habitual?',
        puntos: [
          'El empírico <span class="hl-rojo">debe cubrir BLEE</span>.',
          'Cubrir <span class="hl">Candida</span> si el paciente está inestable o grave.'],
        explicacion: 'Es la infección abdominal más frecuente en la UCI y suele ser una fuga. Se reconoce tarde (el aire dura una semana) y la reintervención llega a menudo cuando ya ha empeorado' + pg(34) + '.' },
      { id: 'iia-g9', corto: 'absceso', tipo: 'test', fuente: 'ma-iia-absceso · mar-img-41-5', modelo: visual('ma-infeccion-abdominal', '👁️ Fig. 41.5: el absceso multiloculado (vista Visual)'),
        enunciado: 'Día 10 tras una esplenectomía: fiebre sin dolor abdominal localizado. ¿Cuándo pides la TC y qué haces si hay absceso?',
        opciones: [
          { t: 'TC ahora, que es lo más fiable; drenaje guiado por TC', ok: true },
          { t: 'Radiografía de abdomen: si no hay aire, descartado', porque: 'El aire extraluminal se ve en menos del 15 %. Una placa normal no descarta un absceso que es un foco oculto de sepsis.' },
          { t: 'Reintervención de entrada, porque el absceso es quirúrgico', porque: 'El drenaje guiado por TC tiene éxito en el 90-95 % y la cirugía rara vez hace falta: se expone al paciente a una reintervención de más riesgo.' }],
        explicacion: 'La TC es <span class="hl">lo más fiable</span>, sobre todo después de la primera semana. Drenaje inmediato: <span class="hl">guiado por TC, con éxito del 90-95 %</span>; antibiótico como en la peritonitis posoperatoria' + pg(34, 35) + '.' }
    ],
    examen: [
      { id: 'iia-e1', corto: 'alergia', tipo: 'test', fuente: 'ma-iia-alergia',
        enunciado: 'Una paciente con una perforación es alérgica a los betalactámicos. ¿Qué combinación es adecuada?',
        opciones: [
          { t: 'Ceftriaxona con metronidazol, que es lo más sencillo', porque: 'La ceftriaxona es un betalactámico: reacción alérgica, y además esa pareja tiene un espectro muy inferior.' },
          { t: 'Tigeciclina sola, que cubre gramnegativos y anaerobios', porque: 'No es betalactámica, pero no cubre Pseudomonas y no se recomienda en el shock séptico (Tabla 41.3): en una perforación grave deja gérmenes sin tratar.' },
          { t: 'Amikacina con metronidazol, sin betalactámicos', ok: true }],
        explicacion: 'Para el alérgico a betalactámicos, la combinación de <span class="hl">amikacina y metronidazol</span> es una pareja adecuada: la amikacina cubre gramnegativos y Pseudomonas, y el metronidazol, los anaerobios (Tabla 41.3)' + pg(33, 34) + '.' },
      { id: 'iia-e2', corto: 'SARM y ERV', tipo: 'test', fuente: 'ma-iia-blee',
        enunciado: 'Una peritonitis con sospecha de BLEE en un paciente colonizado por SARM y enterococo resistente a vancomicina, sin shock. ¿Qué dice Marino?',
        opciones: [
          { t: 'El meropenem no cubre SARM ni ERV; la tigeciclina sí', ok: true },
          { t: 'El meropenem cubre SARM y ERV, y la tigeciclina no', porque: 'Es al revés. Con meropenem solo, el SARM y el ERV quedarían sin tratar.' },
          { t: 'Ninguno de los dos los cubre: hace falta añadir vancomicina', porque: 'La tigeciclina sí es activa frente a SARM y ERV. Y la vancomicina no cubre el ERV, que es resistente a ella.' }],
        explicacion: 'El meropenem <span class="hl-rojo">no es activo frente a SARM ni a enterococo resistente a vancomicina</span>. La tigeciclina no cubre Pseudomonas, pero sí SARM y ERV; no se recomienda en el shock séptico' + pg(33) + '.' },
      { id: 'iia-e3', corto: 'el absceso', tipo: 'test', fuente: 'ma-iia-absceso',
        enunciado: 'Un absceso abdominal posoperatorio. ¿Qué hallazgos esperas con más frecuencia?',
        opciones: [
          { t: 'Dolor localizado, masa palpable y aire extraluminal en la placa', porque: 'Son los que faltan: la sensibilidad abdominal localizada falta en el 60 %, la masa se palpa en menos del 10 % y el aire se ve en menos del 15 %. Esperarlos retrasa la TC.' },
          { t: 'Fiebre casi siempre, sin dolor local en el 60 %', ok: true },
          { t: 'Paciente afebril con dolor intenso en el sitio del absceso', porque: 'La fiebre casi siempre está presente y el dolor local falta en el 60 %. Esperar dolor y sin fiebre deja sin diagnosticar un foco oculto de sepsis.' }],
        explicacion: 'Foco oculto de sepsis: <span class="hl">fiebre casi siempre</span>, pero <span class="hl-rojo">sin dolor local en el 60 %</span>, masa palpable en menos del 10 % y aire extraluminal en la radiografía en menos del 15 %' + pg(34) + '.' },
      { id: 'iia-e4', corto: 'la TC precoz', tipo: 'test', fuente: 'ma-iia-absceso',
        enunciado: 'Segundo día del posoperatorio, fiebre sin foco. ¿Por qué la TC abdominal de hoy puede engañar?',
        opciones: [
          { t: 'Porque en el posoperatorio precoz la fiebre siempre es de origen inflamatorio', porque: 'No es el motivo que da Marino: el riesgo de la TC precoz es otro (sangre y líquido de lavado leídos como un absceso).' },
          { t: 'Porque aún no hay abscesos y la TC saldrá siempre normal', porque: 'Es lo contrario: la TC ve colecciones de más. Un falso absceso puede llevar a drenar o reoperar sin necesidad.' },
          { t: 'Porque las colecciones de sangre o líquido de lavado se leen como abscesos', ok: true }],
        explicacion: 'Las <span class="hl-rojo">colecciones de sangre o de líquido de irrigación</span> se pueden confundir con un absceso en el posoperatorio precoz. La TC es más fiable pasada la primera semana, cuando se han reabsorbido' + pg(34) + '.' },
      { id: 'iia-e5', corto: 'cirugía o drenaje', tipo: 'test', fuente: 'ma-iia-absceso',
        enunciado: 'Un absceso posoperatorio confirmado en la TC. ¿Qué indica Marino?',
        opciones: [
          { t: 'Drenaje guiado por TC de inmediato; rara vez hace falta cirugía', ok: true },
          { t: 'Reoperar de entrada, y drenar con TC solo si la cirugía no basta', porque: 'Es el orden contrario. La reintervención añade riesgo a un paciente que ya está séptico.' },
          { t: 'Antibiótico unos días y drenar solo si no cede', porque: 'Se aconseja el drenaje inmediato. Esperar mantiene un foco de sepsis abierto.' }],
        explicacion: 'Se recomienda el <span class="hl">drenaje inmediato</span>: el guiado por TC tiene éxito en el <span class="hl">90-95 %</span> y la cirugía rara vez hace falta. El antibiótico es el de la peritonitis posoperatoria' + pg(35) + '.' }
    ],
    casos: [
      { id: 'isidora', titulo: 'Isidora, 63 años: el aire que no servía', corto: 'Caso · Isidora', sub: 'fuga anastomótica en el día 5 de una hemicolectomía',
        paciente: { Edad: '63 años', Motivo: 'Día 5 de hemicolectomía derecha; colonización previa por E. coli BLEE' },
        pasos: [
          { momento: 'Día 5 · mañana', datos: { Constantes: 'T 38,5 °C', Abdomen: 'dolor difuso', Radiografía: 'de pie, aire bajo el diafragma' }, nuevo: ['Constantes', 'Abdomen', 'Radiografía'],
            pregunta: { id: 'isidora-1', tipo: 'test', fuente: 'ma-iia-neumoperitoneo · ma-iia-postop', modelo: visual('ma-infeccion-abdominal', '👁️ Fig. 41.4: aire bajo los dos diafragmas (vista Visual)'),
              enunciado: 'La placa de pie enseña aire bajo el diafragma, pero es el día 5 de la cirugía. ¿Qué te da la TC que la placa no puede darte?',
              opciones: [
                { t: 'Localiza la perforación (en el 85 %), y el aire de la placa ya no vale', ok: true },
                { t: 'Ve el aire libre que la placa pierde: la placa solo llega al 85 %', porque: 'El 85 % es lo que la placa de pie llega a detectar, no lo que añade la TC. Si crees que la TC solo ve más aire, no la pedirás cuando el aire ya no sirve.' },
                { t: 'Nada: tras la cirugía el aire de la placa ya confirma la fuga', porque: 'Tras la cirugía el aire persiste al menos una semana y no confirma nada. Reoperar por la placa sola puede ser una reintervención innecesaria, y sin localizar la fuga.' }],
              explicacion: 'La placa de pie detecta aire libre hasta en el 85 %, pero tras una cirugía abdominal el <span class="hl-rojo">neumoperitoneo dura al menos una semana y no sirve</span>. La TC es más sensible y <span class="hl">localiza la perforación en el 85 %</span>' + pg(31, 34) + '.' } },
          { momento: 'Día 5 · mediodía', datos: { TC: 'colección junto a la anastomosis', Diuresis: '0,4 mL/kg/h', PA: '84/48' }, nuevo: ['TC', 'Diuresis', 'PA'],
            pregunta: { id: 'isidora-2', tipo: 'test', fuente: 'ma-iia-manejo', modeloVivo: septico('🫀 La hipotensión del shock séptico, a pie de cama'),
              enunciado: 'La diuresis cae y la PA es 84/48. Va a reintervenirse. ¿Empiezas un vasopresor ya?',
              opciones: [
                { t: 'Noradrenalina ya: la PA es baja y hay que subirla cuanto antes', porque: 'Es lo que hace la guía de sepsis, pero Marino prefiere volumen antes de la cirugía: el vasopresor puede agravar la isquemia intestinal de fondo por vasoconstricción esplácnica.' },
                { t: 'Volumen primero; el vasopresor, mejor tras la cirugía', ok: true },
                { t: 'Nada hasta el quirófano: la oliguria es normal', porque: 'La oliguria o la hipotensión son signos de compromiso circulatorio y piden reponer volumen: se pierde mucho líquido al peritoneo.' }],
              explicacion: 'Se pierde mucho líquido al peritoneo: la caída de la diuresis o de la PA <span class="hl">pide volumen</span>. Evitar el vasopresor antes de la cirugía, si se puede, porque la vasoconstricción esplácnica agrava la isquemia' + pg(32) + '.',
              nota: '<b>Las fuentes difieren.</b> Marino prefiere evitar el vasopresor antes de operar (' + pag(32, 'pág. 32') + '); la Surviving Sepsis 2021 pone la noradrenalina como primera línea en el shock séptico (' + SSC + '). No se elige ganadora.' } },
          { momento: 'Día 5 · tarde', datos: { Plan: 'antibiótico empírico' }, nuevo: ['Plan'], calculadora: { ir: 'ma-cob-resultado', nombre: '¿Qué antibiótico cubre lo que necesito?' },
            pregunta: { id: 'isidora-3', tipo: 'test', fuente: 'ma-iia-postop · ma-iia-blee · ma-tabla-41-3',
              enunciado: 'Peritonitis posoperatoria en una colonizada por E. coli BLEE. Abre la calculadora si quieres: ¿qué empírico eliges?',
              opciones: [
                { t: 'Piperacilina-tazobactam: es la monoterapia habitual de la perforación', porque: 'Con BLEE su espectro es incompleto (+/− en la Tabla 41.3); y la posoperatoria debe cubrir BLEE.' },
                { t: 'Ceftriaxona con metronidazol', porque: 'Su espectro es muy inferior y la ceftriaxona no cubre BLEE (−); no es una opción para una paciente grave.' },
                { t: 'Meropenem: cubre la BLEE y es el de espectro más amplio', ok: true }],
              explicacion: 'En la peritonitis posoperatoria el <span class="hl-rojo">empírico debe cubrir BLEE</span>. Con BLEE: meropenem (el de espectro más amplio), tigeciclina o ceftazidima-avibactam (esta, sin enterococos ni anaerobios)' + pg(33, 34) + '.',
              nota: '<b>La fuente no lo dice.</b> El capítulo 41 no da la dosis de meropenem; la única dosis del libro, 1 g cada 8 horas, está en Marino, cap. 39 (PBE), ' + pag(11, 'pág. 11') + ', para otro cuadro; no se traslada a esta pregunta.' } },
          { momento: 'Día 5 · noche · el giro', datos: { Constantes: 'PA 78/44 con noradrenalina', Fluidos: '2 L de cristaloide sin respuesta; noradrenalina iniciada', Analítica: 'lactato 4 mmol/L' }, nuevo: ['Constantes', 'Fluidos', 'Analítica'],
            pregunta: { id: 'isidora-4', tipo: 'error', fuente: 'ma-iia-blee · ma-iia-candida · ma-iia-postop', modeloVivo: septico('🫀 El shock con noradrenalina, a pie de cama'),
              enunciado: 'Está ya en shock séptico y camino de la reintervención. La nota del R1: encuentra el error (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Meropenem, que es el de elección en el shock séptico.' },
                { t: 'Cambio a tigeciclina para cubrir también el enterococo resistente.', mal: true, c: 'La tigeciclina <span class="hl-rojo">no se recomienda en el shock séptico</span>. El meropenem sigue siendo el de elección.' },
                { t: 'Añado una equinocandina: es posoperatoria e inestable.' },
                { t: 'Reintervención hoy.' }],
              explicacion: 'El meropenem es de elección en el shock; la tigeciclina no se recomienda en él. En la posoperatoria, Candida se cubre si está inestable o grave; el control del foco (la cirugía) es la prioridad. El vasopresor ya no se pudo evitar: con 2 L de cristaloide sin respuesta, la noradrenalina entra antes de operar. Marino dice evitarlo «si es posible», no «nunca»' + pg(32, 33, 34) + '.',
              nota: '<b>Las fuentes difieren.</b> Marino prefiere evitar el vasopresor antes de operar (' + pag(32, 'pág. 32') + '); la Surviving Sepsis 2021 pone la noradrenalina como primera línea en el shock séptico (' + SSC + '). No se elige ganadora.' } },
          { momento: 'Día 13 · ocho días tras la reintervención', datos: { Constantes: 'T 38,2 °C', Abdomen: 'sin dolor localizado' }, nuevo: ['Constantes', 'Abdomen'],
            pregunta: { id: 'isidora-5', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-iia-absceso · ma-iia-postop · mar-img-41-5', modelo: visual('ma-infeccion-abdominal', '👁️ Fig. 41.5: el absceso multiloculado (vista Visual)'),
              enunciado: 'Vuelve la fiebre, sin dolor localizado. El adjunto pregunta: «¿qué haces?».',
              puntos: [
                'La <span class="hl">TC ahora</span>: es la prueba más fiable, mejor después de la primera semana.',
                'Si hay absceso: <span class="hl-rojo">drenaje guiado por TC</span> inmediato (éxito del 90-95 %); la cirugía rara vez hace falta.',
                'El antibiótico, el <span class="hl-azul">mismo de la peritonitis posoperatoria</span> (que cubre BLEE, y Candida si sigue inestable).'],
              explicacion: 'El absceso posoperatorio es un foco oculto de sepsis: fiebre casi siempre, pero sin dolor local en el 60 % de los casos' + pg(34, 35) + '.' } },
        ],
        lleva: [
          'Tras la cirugía el aire libre no cuenta durante al menos una semana: la TC decide.',
          'Posoperatoria: cubrir BLEE y, si está inestable, Candida; volumen antes que vasopresor antes del quirófano.',
          'La tigeciclina no va en el shock séptico; el meropenem sí.'],
        volver: { nombre: 'Peritonitis posoperatoria', ancla: 'ma-iia-postop', modeloVivo: septico('🫀 El shock séptico, en el estado de Isidora'), modelo: visual('ma-infeccion-abdominal', '👁️ Figs. 41.4 y 41.5 (vista Visual)') } },
    ],
    profundizar: [
      { id: 'ma-iia-perforacion', titulo: 'Causas de la perforación' },
      { id: 'ma-iia-postop', titulo: 'La PCR y la fuga anastomótica', nota: 'Marino dice que la proteína C reactiva podría predecir la fuga, sin aceptación general (' + pag(34, 'pág. 34') + ').' },
      { id: 'ma-iia-final', titulo: 'El ácido gástrico y C. difficile', nota: 'Se cubre en la ficha de C. difficile (' + pag(35, 'pág. 35') + ').' },
    ],
  },

  /* =================================================================================================
     Ficha 9 · Clostridioides difficile (cap. 41, págs. 27-31)
     ================================================================================================= */
  'ma-cdifficile': {
    entrada: `No invade: sus toxinas hacen el daño y la PCR sola no basta. PCR negativa descarta; ELISA positiva confirma y pierde un 20 % (${pg(29)}); vancomicina oral 125 mg ×4, 10 días (${pg(30)}).`,
    guia: [
      { id: 'cdi-g1', corto: 'la puerta', tipo: 'test', fuente: 'ma-cdi-patogenia',
        enunciado: 'Un paciente sin diarrea previa empieza con diarrea acuosa en el día 10 de un antibiótico. ¿Por qué un antibiótico abre la puerta a C. difficile?',
        opciones: [
          { t: 'Porque C. difficile es de la flora normal y el antibiótico la activa', porque: 'Es un habitante infrecuente del intestino sano. Si lo piensas flora normal, no buscarás la toxina en un paciente con diarrea y antibiótico.' },
          { t: 'Porque deprime el sistema inmune del paciente', porque: 'No es el mecanismo de la ficha. Pensar así lleva a retirar defensas que no son el problema, en vez de ver que el daño es de las toxinas.' },
          { t: 'Porque altera el microbioma, que frena a los gérmenes indeseables', ok: true }],
        explicacion: 'El microbioma impide la colonización por gérmenes indeseables; su alteración (<span class="hl-azul">disbiosis</span>) abre la puerta a infecciones, y la más destacada es la enterocolitis por C. difficile. Es un bacilo grampositivo anaerobio esporulado, poco habitual en el intestino sano, que prolifera cuando la flora cambia. Riesgo: edad avanzada, contacto sanitario y antibióticos' + pg(27) + '.' },
      { id: 'cdi-g2', corto: 'invade o no', tipo: 'test', fuente: 'ma-cdi-patogenia',
        enunciado: '¿Cómo daña C. difficile el colon, y qué significan las pseudomembranas?',
        opciones: [
          { t: 'Invade la pared y pasa a la sangre; las pseudomembranas son un hallazgo banal', porque: 'No es invasor. Esperar una bacteriemia para sospecharlo deja pasar la enfermedad, y las pseudomembranas son un signo de enfermedad grave.' },
          { t: 'Libera las toxinas A y B; las pseudomembranas indican enfermedad grave', ok: true },
          { t: 'No daña: solo coloniza, y la diarrea es de otra causa', porque: 'Sus toxinas dañan la mucosa y causan inflamación de la pared y síntomas. Descartarlo por «solo coloniza» deja sin tratar a quien tiene infección.' }],
        explicacion: '<span class="hl-purpura">No es invasor</span>: libera las toxinas A y B, que dañan la mucosa e inflaman la pared. La inflamación grave forma placas, las <span class="hl-rojo">pseudomembranas</span>: son evidencia de enfermedad grave' + pg(27) + '.' },
      { id: 'cdi-g3', corto: 'el omeprazol', tipo: 'test', fuente: 'ma-cdi-ibp',
        enunciado: 'El paciente toma omeprazol como profilaxis de la úlcera de estrés. ¿Qué tiene que ver con C. difficile?',
        opciones: [
          { t: 'Quita el ácido gástrico, una defensa antibacteriana', ok: true },
          { t: 'Nada: el riesgo es solo del antibiótico', porque: 'Los inhibidores de la bomba de protones se asocian a más infección. Dejarlo «por inocente» mantiene un factor evitable.' },
          { t: 'Protege la mucosa del colon frente al daño de las toxinas', porque: 'La asociación es la contraria: más riesgo. Suponer protección te lleva a mantener el fármaco en quien ya tiene la infección.' }],
        explicacion: 'Los <span class="hl">inhibidores de la bomba de protones se asocian a más infección por C. difficile</span>, coherente con el papel antibacteriano del ácido gástrico (Cap. 4, Figura 4.3): un argumento contra su uso excesivo como profilaxis de úlcera de estrés' + pg(28) + '.' },
      { id: 'cdi-g4', corto: 'fiebre y leucos', tipo: 'test', fuente: 'ma-cdi-clinica', origen: 'ficha; los datos del paciente son ilustrativos',
        enunciado: 'Diarrea acuosa con T 39,5 °C y 28.000 leucocitos/mm³ en un paciente con antibiótico. ¿Es lo típico de la infección por C. difficile según Marino?',
        opciones: [
          { t: 'Sí: lo habitual son la fiebre alta y la leucocitosis muy marcada', porque: 'Lo habitual es fiebre baja y leucocitosis leve. Esperar fiebre alta hace no sospecharlo en el que tiene fiebre baja.' },
          { t: 'No: lo típico es fiebre ≤38,3 °C y menos de 15.000 leucocitos', ok: true },
          { t: 'Lo descarta, porque nunca hay leucocitosis', porque: 'La forma típica sí cursa con leucocitosis leve. Y una cifra fuera de lo típico no se usa para descartarla: el diagnóstico lo dan las pruebas en heces.' }],
        explicacion: 'El cuadro principal es la diarrea acuosa, con <span class="hl">fiebre baja (≤38,3 °C) y leucocitosis leve (<15.000/mm³)</span>. La forma fulminante (3-5 %) añade <span class="hl-rojo">hipotensión y distensión</span>' + pg(28) + '.',
        nota: '<b>La fuente no lo dice.</b> Marino describe lo típico, pero no clasifica la gravedad. La ACG 2021, con los criterios de IDSA/SHEA, llama «grave» a leucocitos ≥15.000 o creatinina >1,5 mg/dL, y «fulminante» a hipotensión o shock, íleo o megacolon: 39,5 °C y 28.000 leucocitos no son lo típico de Marino, sino una forma grave (' + ACG + ').' + enFicha('ma-cdifficile', 'ma-cdi-clinica') },
      { id: 'cdi-g5', corto: 'PCR sí, ELISA no', tipo: 'test', fuente: 'ma-cdi-pruebas · ma-cdi-aviso · mar-img-41-3', modelo: visual('ma-cdifficile', '👁️ Fig. 41.3: el árbol diagnóstico (vista Visual)'),
        calculadora: { ir: 'ma-cdi-resultado', nombre: 'Interpretar las pruebas (Figura 41.3)' },
        enunciado: 'Predice con la calculadora: PCR positiva y ELISA negativa, y la sospecha clínica no es alta. ¿Infección por C. difficile?',
        opciones: [
          { t: 'Sí: la PCR positiva basta para confirmar la infección', porque: 'La PCR confirma el germen toxigénico, no la infección: no distingue colonización de infección. Tratar por ella es sobrediagnosticar.' },
          { t: 'No: una ELISA negativa elimina la infección', porque: 'La ELISA tiene baja sensibilidad y pierde un 20 %. Con sospecha alta no se descartaría.' },
          { t: 'Probable colonización: la mayoría va bien sin tratar', ok: true }],
        explicacion: 'La PCR (gen de la toxina B) es muy sensible: negativa, descarta; positiva, confirma el germen toxigénico pero <span class="hl-rojo">no la infección</span>. La ELISA de toxinas, si es positiva, confirma, pero pierde un 20 %. Con PCR positiva y toxina negativa, la mayoría <span class="hl">evoluciona bien sin tratamiento</span>' + pg(29) + '.',
        nota: '<b>Las fuentes difieren.</b> El protocolo del hospital (trasplante renal, Nefrología) usa un algoritmo GDH + toxina + PCR; Marino empieza por la PCR y confirma con ELISA. Se enlazan, no se elige ganadora.' + enFicha('ma-cdifficile', 'ma-cdi-pruebas') },
      { id: 'cdi-g6', corto: 'nota del R1', tipo: 'error', fuente: 'ma-cdi-aviso · ma-tabla-41-2', modelo: visual('ma-cdifficile', '👁️ Tabla 41.2 en la vista Visual'),
        enunciado: 'La nota del R1 ante unas heces con PCR positiva. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'La PCR positiva confirma C. difficile toxigénico, pero no distingue colonización de infección.' },
          { t: 'PCR positiva: empiezo vancomicina oral ya.', mal: true, c: 'Tratar solo por la PCR lleva al <span class="hl-rojo">sobrediagnóstico</span>: cerca de la mitad de las PCR positivas no tienen toxinas y evolucionan bien sin antibiótico. Primero la ELISA.' },
          { t: 'Si la ELISA es positiva: vancomicina 125 mg VO 4 veces al día, 10 días.' },
          { t: 'Pauta: metronidazol oral 10 días.', mal: true, c: '<span class="hl-rojo">No es la pauta de Marino</span>: en la Tabla 41.2 el primer episodio es vancomicina o fidaxomicina; el metronidazol (500 mg IV cada 8 h) solo se añade en el fulminante.' }],
        explicacion: 'Dos errores según Marino: tratar por la PCR sola y una pauta que la Tabla 41.2 no recoge' + pg(29, 30) + '.',
        nota: '<b>Las fuentes difieren.</b> Marino (Tabla 41.2) no recoge el metronidazol oral; la ACG 2021 lo admite en el episodio inicial no grave de bajo riesgo (' + ACG + '). No se elige ganadora: la pregunta sigue la Tabla 41.2.' },
      { id: 'cdi-g7', corto: 'hipotensión y distensión', tipo: 'test', fuente: 'ma-cdi-clinica · ma-tabla-41-2 · ma-cdi-curso', modelo: visual('ma-cdifficile', '👁️ Fig. 41.2: el megacolon tóxico (vista Visual)'), modeloVivo: septico('🫀 La hipotensión del fulminante, a pie de cama'),
        calculadora: { ir: 'ma-cditto-resultado', nombre: '¿Qué pauta? (Tabla 41.2)' },
        enunciado: 'Un paciente con C. difficile confirmado tiene ahora hipotensión y el abdomen distendido. ¿Qué cambia?',
        opciones: [
          { t: 'Fulminante: vancomicina 500 mg/6 h enteral y metronidazol 500 mg IV/8 h', ok: true },
          { t: 'Nada cambia: sigue con vancomicina 125 mg cuatro veces al día durante 10 días', porque: 'Es la pauta del primer episodio. En el fulminante queda corta: sin el aumento ni el metronidazol IV, la enfermedad grave avanza.' },
          { t: 'Cambiar a fidaxomicina 200 mg dos veces al día', porque: 'No es pauta del fulminante en la Tabla 41.2, y se trata con vancomicina enteral más metronidazol IV.' }],
        explicacion: 'La forma <span class="hl-rojo">fulminante (3-5 %)</span> se trata con vancomicina enteral 500 mg cada 6 h más metronidazol IV 500 mg cada 8 h. El megacolon tóxico es una urgencia quirúrgica; si se opera, se prefiere la colectomía subtotal' + pg(28, 30) + '.',
        nota: '<b>La fuente no lo dice.</b> Marino no da criterios de cuándo operar el megacolon ni plazos; solo dice que, si hace falta cirugía, se prefiere la colectomía subtotal.'+ ' La ACG 2021 propone como cirugía del fulminante la colectomía total con ileostomía terminal o, según el caso, la ileostomía en asa con lavado colónico y vancomicina intraluminal (' + ACG + '). Sobre cuándo operar: buscado en la ACG 2021; no da plazo.' + enFicha('ma-cdifficile', 'ma-cdi-curso') },
      { id: 'cdi-g8', corto: 'las recaídas', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'ma-cdi-recaidas · ma-tabla-41-2',
        enunciado: 'El paciente mejora y a las dos semanas vuelve la diarrea. ¿Cuánto recae cada pauta y qué haces en la segunda recurrencia?',
        puntos: [
          'Las recaídas suelen ser en 3 semanas: <span class="hl-rojo">25 % con vancomicina y 13 % con fidaxomicina</span>.',
          'En la 2.ª recurrencia, <span class="hl">trasplante de microbiota fecal</span>: la curación comunicada es del 80-100 %.'],
        explicacion: 'Un 5 % recae más de una vez; para las recaídas múltiples lo más eficaz es el trasplante de microbiota fecal (heces líquidas de donantes sanos por sonda, endoscopia o enema). La 1.ª recurrencia: vancomicina en pauta descendente o, si el primer episodio fue con vancomicina, fidaxomicina' + pg(30) + '.' },
      { id: 'cdi-g9', corto: 'probióticos', tipo: 'test', fuente: 'ma-cdi-prevencion',
        enunciado: 'Se usan mucho los probióticos durante y después del tratamiento. ¿Qué dice Marino para no recaer?',
        opciones: [
          { t: 'Que los recomienda siempre: evitan que C. difficile se adhiera', porque: 'Es el argumento teórico, pero el American College of Gastroenterology no los recomienda. Darlos de rutina añade un gasto sin beneficio demostrado.' },
          { t: 'Que el American College of Gastroenterology no los recomienda', ok: true },
          { t: 'Que solo valen en la primera recaída', porque: 'No distingue por recaída: no los recomienda por resultados no concluyentes y por poder impedir la recolonización del colon.' }],
        explicacion: 'Los probióticos se usan mucho, pero el American College of Gastroenterology <span class="hl-rojo">no los recomienda</span>: resultados no concluyentes y hay indicios de que pueden <span class="hl">impedir la recolonización del colon</span> tras el antibiótico' + pg(31) + '.' }
    ],
    examen: [
      { id: 'cdi-e1', corto: 'cuánto dura', tipo: 'test', fuente: 'ma-cdi-curso',
        enunciado: 'Primer episodio con vancomicina oral: al tercer día cede la fiebre y la diarrea mejora. ¿Cuánto se mantiene el tratamiento?',
        opciones: [
          { t: 'Los 10 días, aunque la fiebre ya haya cedido', ok: true },
          { t: 'Hasta que la diarrea desaparezca, en 4-5 días', porque: 'La diarrea cede en 4-5 días, pero la pauta se completa en 10. Parar antes arriesga que el cuadro se reactive.' },
          { t: 'Hasta que la fiebre ceda, en 24-48 h', porque: 'La fiebre cede en 24-48 h; parar entonces deja la pauta a medias.' }],
        explicacion: 'La fiebre cede en 24-48 h y la diarrea en 4-5 días, pero <span class="hl">el tratamiento se completa 10 días</span>' + pg(30) + '.' },
      { id: 'cdi-e2', corto: 'fidaxomicina', tipo: 'test', fuente: 'ma-tabla-41-2',
        enunciado: 'Primer episodio tratado con fidaxomicina que recae a las dos semanas. ¿Qué pauta toca?',
        opciones: [
          { t: 'Fidaxomicina otros 10 días, igual que la primera vez', porque: 'Según la Tabla 41.2 la fidaxomicina en la recurrencia solo se da si el primer episodio se trató con vancomicina.' },
          { t: 'Trasplante de microbiota fecal', porque: 'Es el tratamiento de la 2.ª recurrencia o las múltiples, no de la primera.' },
          { t: 'Vancomicina en pauta prolongada, descendente', ok: true }],
        explicacion: '1.ª recurrencia: vancomicina 125 mg 4 veces al día 10-14 días y luego descendente (2 veces al día 7 días, 1 vez al día 7 días, cada 2-3 días 2-8 semanas), o fidaxomicina 200 mg dos veces al día 10 días <span class="hl-rojo">solo si el primer episodio fue con vancomicina</span>' + pg(30) + '.' },
      { id: 'cdi-e3', corto: 'colonoscopia', tipo: 'test', fuente: 'ma-cdi-aviso',
        enunciado: 'PCR positiva, ELISA negativa y una sospecha clínica muy alta. ¿Qué haces?',
        opciones: [
          { t: 'Repites la PCR en 48 horas', porque: 'La PCR ya fue positiva y no distingue colonización de infección: repetirla no aclara nada.' },
          { t: 'Colonoscopia, mejor que la rectosigmoidoscopia', ok: true },
          { t: 'Rectosigmoidoscopia, porque es más rápida y suficiente', porque: 'Marino prefiere la colonoscopia para un resultado óptimo; con la otra puedes dejar sin ver pseudomembranas.' }],
        explicacion: 'La visualización directa se reserva para la <span class="hl">alta sospecha con toxinas negativas</span>: las pseudomembranas confirman el diagnóstico. La colonoscopia es preferible a la rectosigmoidoscopia' + pg(30) + '.' },
      { id: 'cdi-e4', corto: 'guantes y bata', tipo: 'test', fuente: 'ma-cdi-prevencion',
        enunciado: 'La unidad usa guantes, bata y lavado de manos con todos los casos. ¿Basta para cortar la transmisión?',
        opciones: [
          { t: 'Sí: la transmisión es de paciente a paciente por las manos del personal', porque: 'Es verdad, pero no basta: los portadores asintomáticos también contagian. Confiar solo en ello deja pasar los casos sin diagnosticar.' },
          { t: 'Basta si se añade el aislamiento durante todo el ingreso', porque: 'Marino no lo propone; el problema es otro: los portadores asintomáticos.' },
          { t: 'No: los portadores asintomáticos también transmiten sin diarrea', ok: true }],
        explicacion: 'Guantes y bata para todo contacto e higiene de manos (IDSA); pero <span class="hl-rojo">es poco probable que eliminen la transmisión</span>, porque los portadores asintomáticos son fuentes importantes' + pg(31) + '.' },
      { id: 'cdi-e5', corto: 'cuántos fulminantes', tipo: 'test', fuente: 'ma-cdi-clinica',
        enunciado: 'De 100 pacientes con infección por C. difficile, ¿cuántos hacen la forma fulminante, con hipotensión y distensión?',
        opciones: [
          { t: 'Unos 3-5: es poco frecuente, pero la más grave', ok: true },
          { t: 'Unos 10-15: uno de cada siete, más o menos', porque: 'Es el triple de lo que cita Marino (3-5 %). Sobrestimarla lleva a tratar como fulminante, con metronidazol IV, a quien tiene un primer episodio habitual.' },
          { t: 'Unos 25-30: es casi la forma típica de la enfermedad', porque: 'Lo típico es la diarrea acuosa con fiebre baja y leucocitosis leve. Esperar un fulminante en uno de cada cuatro desatiende la forma habitual y su pauta.' }],
        explicacion: 'La forma <span class="hl-rojo">fulminante</span> es el <span class="hl">3-5 %</span> de los casos: añade hipotensión y distensión al cuadro de diarrea acuosa con fiebre baja y leucocitosis leve' + pg(28) + '.' },
      { id: 'cdi-e6', corto: 'comunitaria', tipo: 'test', fuente: 'ma-cdi-epi',
        enunciado: '¿Qué proporción de los casos de C. difficile se adquiere ya en la comunidad?',
        opciones: [
          { t: 'Un 10-15 %: la comunitaria sigue siendo una rareza', porque: 'Es una cifra menor que la real: la comunitaria ha subido mucho. Suponerla rara hace no sospecharlo en quien llega de casa con diarrea.' },
          { t: 'Un 34-48 %: aún domina la nosocomial, pero crece', ok: true },
          { t: 'Un 60-70 %: la comunitaria ya supera a la nosocomial', porque: 'Sigue siendo sobre todo nosocomial, transmitida por las manos del personal. Bajar la guardia de la higiene de manos sería un error.' }],
        explicacion: 'Es <span class="hl">sobre todo nosocomial</span> (tras 48 h de ingreso), pero hubo un aumento drástico de la comunitaria: ya son el <span class="hl">34-48 %</span> de los casos' + pg(27) + '.' }
    ],
    casos: [
      { id: 'prudencio', titulo: 'Prudencio, 69 años: la diarrea del día 10 de ceftriaxona', corto: 'Caso · Prudencio', sub: 'C. difficile tras ceftriaxona y omeprazol',
        paciente: { Edad: '69 años', Motivo: 'Neumonía; día 10 de ceftriaxona; omeprazol de profilaxis', Diarrea: '6 deposiciones acuosas al día' },
        pasos: [
          { momento: 'Día 10', datos: { Constantes: 'T 38,1 °C, PA 122/70', Analítica: 'leucocitos 13.500/mm³' }, nuevo: ['Constantes', 'Analítica'],
            pregunta: { id: 'prudencio-1', tipo: 'test', fuente: 'ma-cdi-clinica · ma-cdi-aviso',
              enunciado: 'Diarrea acuosa con ese cuadro y antibiótico desde hace diez días. ¿Cuadra con C. difficile?',
              opciones: [
                { t: 'No: una fiebre tan baja la descarta, tiene que ser más alta', porque: 'Al revés: lo típico es una fiebre baja. Si esperas fiebre alta, retrasarás las pruebas de heces.' },
                { t: 'No: habría que esperar a ver pseudomembranas', porque: 'La colonoscopia se reserva para la alta sospecha con toxinas negativas; esperar a verlas retrasa el diagnóstico por heces.' },
                { t: 'Sí: fiebre ≤38,3 °C y leucocitos <15.000 es lo típico', ok: true }],
              explicacion: 'Diarrea acuosa con <span class="hl">fiebre baja (≤38,3 °C) y leucocitosis leve (<15.000/mm³)</span>: es lo típico. La colonoscopia queda para la alta sospecha con toxinas negativas' + pg(28, 30) + '.' } },
          { momento: 'Día 10', datos: { Fármacos: 'ceftriaxona y omeprazol de profilaxis' }, nuevo: ['Fármacos'],
            pregunta: { id: 'prudencio-2', tipo: 'test', fuente: 'ma-cdi-ibp · ma-iia-final',
              enunciado: '¿Qué le ha hecho el omeprazol?',
              opciones: [
                { t: 'Nada: el riesgo es solo del antibiótico', porque: 'Los inhibidores de la bomba de protones se asocian a más infección. Mantener el omeprazol «porque no cuenta» es mantener un factor evitable.' },
                { t: 'Le ha quitado el ácido, una defensa frente a lo que se traga', ok: true },
                { t: 'Le ha protegido el colon de las toxinas durante el tratamiento', porque: 'La asociación es la contraria: más riesgo de infección. Mantenerlo por «protector» persistiría el factor.' }],
              explicacion: 'Los IBP se asocian a más infección por C. difficile, coherente con el <span class="hl">papel antibacteriano del ácido gástrico</span>: un argumento contra su uso excesivo como profilaxis de úlcera de estrés' + pg(28, 35) + '.' } },
          { momento: 'Día 11', datos: { Heces: 'PCR del gen de la toxina B positiva; ELISA pendiente' }, nuevo: ['Heces'],
            pregunta: { id: 'prudencio-3', tipo: 'error', fuente: 'ma-cdi-pruebas · ma-cdi-aviso · ma-cdi-prevencion', modelo: visual('ma-cdifficile', '👁️ Fig. 41.3: el árbol diagnóstico (vista Visual)'),
              enunciado: 'La nota del R1 con la PCR positiva y la ELISA pendiente. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'La PCR positiva confirma C. difficile toxigénico.' },
                { t: 'Empiezo vancomicina oral ya, por la PCR.', mal: true, c: 'Cerca de la mitad de los PCR positivos <span class="hl-rojo">no tienen toxinas</span> y van bien sin antibiótico; tratar por la PCR sola es sobrediagnosticar. Espera a la ELISA.' },
                { t: 'Si la ELISA sale positiva: vancomicina 125 mg IV cada 6 h.', mal: true, c: `La vancomicina del primer episodio va por <span class="hl-rojo">vía oral</span>, 125 mg cuatro veces al día (Tabla 41.2, ${pag(30, "pág. 30")}). La guía IDSA/SHEA 2017 también la recomienda por vía oral: <a class="biblio-link" href="https://pubmed.ncbi.nlm.nih.gov/29462280/" target="_blank" rel="noopener">McDonald LC et al., Clin Infect Dis 2018;66:e1-48</a>.` },
                { t: 'Guantes y bata para entrar en la habitación.' }],
              explicacion: 'Dos errores: tratar solo por la PCR y dar la vancomicina por vía IV, cuando la pauta es oral' + pg(29, 30, 31) + '.' } },
          { momento: 'Día 11 · tarde', datos: { Heces: 'ELISA de toxinas A y B positiva' }, nuevo: ['Heces'], calculadora: { ir: 'ma-cditto-resultado', nombre: '¿Qué pauta? (Tabla 41.2)' },
            pregunta: { id: 'prudencio-4', tipo: 'test', fuente: 'ma-tabla-41-2 · ma-cdi-pruebas', modelo: visual('ma-cdifficile', '👁️ Tabla 41.2 en la vista Visual'),
              enunciado: 'Infección confirmada, primer episodio, sin hipotensión ni distensión. ¿Qué pauta?',
              opciones: [
                { t: 'Metronidazol 500 mg IV cada 8 h, sin vancomicina, durante 10 días', porque: 'Es el añadido del fulminante, no la pauta del primer episodio. Una pauta sin vancomicina o fidaxomicina deja la infección sin su tratamiento de elección.' },
                { t: 'Vancomicina 500 mg cada 6 h por boca', porque: 'Es la dosis del fulminante. Para un primer episodio es una dosis cuatro veces mayor de lo indicado.' },
                { t: 'Vancomicina 125 mg ×4 al día o fidaxomicina 200 mg ×2, 10 días', ok: true }],
              explicacion: 'Primer episodio: <span class="hl">vancomicina 125 mg VO cuatro veces al día durante 10 días, o fidaxomicina 200 mg VO dos veces al día durante 10 días</span> (Tabla 41.2)' + pg(30) + '.' } },
          { momento: 'Día 13 · el giro', datos: { Constantes: 'PA 85/55', Abdomen: 'distendido; sin deposiciones desde ayer', Radiografía: 'Figura 41.2' }, nuevo: ['Constantes', 'Abdomen', 'Radiografía'],
            pregunta: { id: 'prudencio-5', tipo: 'test', fuente: 'ma-cdi-clinica · ma-tabla-41-2 · mar-img-41-2', modelo: visual('ma-cdifficile', '👁️ Fig. 41.2: el megacolon tóxico (vista Visual)'), modeloVivo: septico('🫀 La hipotensión del fulminante, a pie de cama'),
              enunciado: 'Dos días después ya no tiene diarrea, pero sí hipotensión y el abdomen distendido. ¿Qué es y qué cambia?',
              opciones: [
                { t: 'Ha mejorado: ya no tiene diarrea y puede seguir con la misma pauta', porque: 'La falta de deposiciones con distensión es un íleo o un megacolon: la forma más temida de la enfermedad. Tranquilizarte la deja avanzar.' },
                { t: 'Fulminante con megacolon: vancomicina y metronidazol IV, y cirugía', ok: true },
                { t: 'Hay que subir a fidaxomicina', porque: 'No es una pauta del fulminante en la Tabla 41.2, y no trata la complicación quirúrgica que ya existe.' }],
              explicacion: 'Hipotensión más distensión por íleo o megacolon: <span class="hl-rojo">infección fulminante</span> (3-5 %). Vancomicina 500 mg cada 6 h por boca, sonda o enema, más metronidazol 500 mg IV cada 8 h. El megacolon tóxico es una urgencia quirúrgica' + pg(28, 30) + '.',
              nota: '<b>La fuente no lo dice.</b> Marino no da criterios de cuándo operar el megacolon ni plazos.'+ ' La ACG 2021 propone la colectomía total con ileostomía terminal o la ileostomía en asa con lavado colónico y vancomicina intraluminal (' + ACG + '). Sobre cuándo operar: buscado en la ACG 2021; no da plazo.' + enFicha('ma-cdifficile', 'ma-cdi-curso') } },
          { momento: 'Día 13 · quirófano', datos: { Decisión: 'cirugía' }, nuevo: ['Decisión'],
            pregunta: { id: 'prudencio-6', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-cdi-curso · ma-cdi-prevencion',
              enunciado: 'El cirujano pregunta tres cosas: ¿qué operación, cuánto dura el tratamiento aunque ceda y qué le dices a la familia sobre los probióticos?',
              puntos: [
                '<span class="hl">Colectomía subtotal</span>: es la preferida cuando el megacolon necesita cirugía.',
                'En la pauta habitual, la fiebre cede en 24-48 h y la diarrea en 4-5 días, pero el tratamiento se completa los <span class="hl">10 días</span>.',
                'Probióticos: el American College of Gastroenterology <span class="hl-rojo">no los recomienda</span>.'],
              explicacion: 'Si hace falta cirugía por megacolon tóxico se prefiere la colectomía subtotal; los probióticos no se recomiendan por resultados no concluyentes' + pg(30, 31) + '.',
              nota: '<b>La fuente no lo dice.</b> Los 10 días y los plazos de la fiebre y la diarrea son los del tratamiento habitual; Marino no da la duración del fulminante; buscado en la ACG 2021 (' + ACG + '), que tampoco da plazo. Esa guía propone, como cirugía, la colectomía total con ileostomía terminal o la ileostomía en asa con lavado colónico y vancomicina intraluminal, según el caso.' + enFicha('ma-cdifficile', 'ma-cdi-curso') } },
        ],
        lleva: [
          'La PCR dice «está»; la toxina dice «hace daño»: no se trata solo por la PCR.',
          'Fiebre baja y leucocitos <15.000 es lo típico; hipotensión con distensión es lo fulminante.',
          'El omeprazol no es inocente: quita una defensa del estómago.'],
        volver: { nombre: 'Aviso: no trates solo por la PCR', ancla: 'ma-cdi-aviso', modeloVivo: septico('🫀 El shock séptico, en el estado de Prudencio'), modelo: visual('ma-cdifficile', '👁️ Figs. 41.2 y 41.3 (vista Visual)') } },
    ],
    profundizar: [
      { id: 'ma-tabla-41-2', titulo: 'Tabla 41.2 completa', nota: 'La vancomicina en pauta descendente de la primera recurrencia, completa.' },
      { id: 'ma-cdi-patogenia', titulo: 'Patogenia y transmisión', nota: 'Incluye lo que no entra en el recorrido: aves, pescado y carne roja como fuente ocasional (' + pag(27, 'pág. 27') + ').' },
      { id: 'ma-iia-final', titulo: 'C. difficile y ácido gástrico (cierre del capítulo)' },
    ],
  },
};
