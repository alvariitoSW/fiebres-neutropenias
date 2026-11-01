// Mayéutica del bloque 6a, grupo 6B · Coma y muerte encefálica (Marino cap. 45, págs. 9-16). Datos puros; formato en
// la cabecera de b1-fluidos.js. La medicina sale de la ficha (js/modules/libros/marino-neuro.html) y de su PDF
// (docs/marino-2024-neurologia-caps45-47.pdf); cada pregunta dice dónde con `fuente`. Los pacientes se inventan.
// Plan: autonomo/bloques/b6a/plan-estudio-6b.md §4 y §5. El cráneo vivo no existe aún: los `modelo:` del cráneo
// se añaden cuando exista (los puntos van marcados con [cráneo: …]).
const PDF = 'docs/marino-2024-neurologia-caps45-47.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
// La vista Visual de una ficha de Marino Neurología, como botón «modelo» (sale tras contestar).
const visual = (tab, texto) => ({ especialidad: 'libros', view: 'marinoNeuro', panel: 'panel-marino-neuro-tabs', tab, enVisual: '', texto });
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoNeuro" data-panel="panel-marino-neuro-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;

export const MAYEUTICA_COMA = {
  /* =================================================================================================
     Ficha 4 · Coma: causas y exploración (cap. 45, págs. 9-14)
     ================================================================================================= */
  'mn-coma': {
    entrada: 'Qué dicen la respuesta al dolor, las pupilas y los reflejos oculares sobre dónde está la lesión, cómo se mide el Glasgow (y cuándo no fiarse) y qué hacer con un coma.',
    guia: [
      { id: 'mnk-g1', corto: 'retira al dolor', tipo: 'test', fuente: 'mn-coma-dolor',
        enunciado: 'Pinchas el hombro de un paciente que no abre los ojos y retira el brazo hacia el lado contrario. ¿Encaja con un coma?',
        opciones: [
          { t: 'Sí: con un GCS ≤8 cualquier respuesta motora es compatible con coma', porque: 'El GCS ≤8 define el coma, pero una respuesta con propósito (retirar el miembro) no es propia del coma. Si lo das por coma, buscarás la causa donde no está y pasarás por alto un estado distinto.' },
          { t: 'No: retirar el miembro es una respuesta con propósito', ok: true },
          { t: 'Sí: la retirada es la respuesta típica de la decorticación', porque: 'La decorticación es una flexión anormal de los brazos (3 puntos), no una retirada (4 puntos). Confundirlas desplaza la lesión supuesta al tálamo sin motivo.' }],
        explicacion: `En el coma la respuesta al dolor <span class="hl-rojo">nunca es intencionada</span>: es sin propósito o no hay. Retirar el miembro es una respuesta con propósito y <span class="hl">no es propia del coma</span> (${pag(10, 'pág. 10')}).` },
      { id: 'mnk-g2', corto: 'las posturas', tipo: 'test', fuente: 'mn-coma-posturas · mn-coma-dolor',
        // [cráneo: herniacion-uncal]
        enunciado: 'Al pinchar, un paciente en coma extiende y pronuncia los brazos y las piernas. Antes de mirar la tabla: ¿dónde está la lesión?',
        opciones: [
          { t: 'Mesencéfalo y protuberancia alta (descerebración)', ok: true },
          { t: 'En el tálamo', porque: 'La lesión talámica da flexión de los brazos (decorticación). Si buscas allí la causa, no pensarás en el mesencéfalo ni en una masa que lo comprime.' },
          { t: 'En el tronco bajo: las extremidades quedan flácidas', porque: 'La lesión del tronco bajo da extremidades flácidas, no extensión. Esperar flacidez te haría subestimar un daño que ya es grave.' }],
        explicacion: `Tálamo: <span class="hl">flexión</span> de los brazos (decorticación). Mesencéfalo y protuberancia alta: <span class="hl-rojo">extensión y pronación</span> de brazos y piernas (descerebración). Tronco bajo: extremidades flácidas (${pag(10, 'pág. 10')}).` },
      { id: 'mnk-g3', corto: 'una pupila fija', tipo: 'test', fuente: 'mn-pup-unilateral · mn-tabla-45-4',
        modelo: visual('mn-coma', '👁️ La cara de Glasgow con pupila unilateral (vista Visual)'),
        enunciado: 'Predice: una sola pupila dilatada y fija en un paciente en coma. ¿Qué te dice?',
        opciones: [
          { t: 'Masa intracraneal en expansión, trauma o cirugía ocular o una crisis focal', ok: true },
          { t: 'Atropina o un anticolinérgico, que dilatan las dos pupilas y siguen reaccionando', porque: 'La atropina y los anticolinérgicos dilatan las dos pupilas y son reactivas, no una sola y fija. Atribuirlo al fármaco retrasa el TC ante una masa que comprime el tronco.' },
          { t: 'Síndrome de Horner', porque: '(fisiología general) El Horner da una pupila más pequeña, no dilatada. Con esa idea, buscarías una lesión simpática y no mirarías el hematoma que empuja el cerebro.' }],
        explicacion: `Tabla 45.4: <span class="hl-rojo">una dilatada y fija</span> = masa intracraneal en expansión (herniación uncal), trauma o cirugía ocular, o crisis focal. Dilatadas y <span class="hl">reactivas</span> las dos: atropina y anticolinérgicos, dopamina, anfetaminas (${pag(11, 'pág. 11')}).` },
      { id: 'mnk-g4', corto: 'puntiformes', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-pup-pequenas · mn-pup-puntiformes',
        enunciado: 'Dos pacientes en coma tienen las pupilas puntiformes: uno por opiáceos y otro por una lesión de la protuberancia. ¿Cómo los separas?',
        puntos: [
          'Opiáceos: pupilas puntiformes <span class="hl-verde">reactivas</span> a la luz.',
          'Lesión pontina: pupilas puntiformes <span class="hl-rojo">no reactivas</span>.'],
        explicacion: `El resumen del capítulo las separa por la reactividad (${pag(11, 'pág. 11')}). La Tabla 45.4 pone en la misma fila opiáceos, encefalopatía, hipercapnia y lesión pontina sin dar la reactividad de cada una.` },
      { id: 'mnk-g5', corto: 'ojos de muñeca', tipo: 'test', fuente: 'mn-coma-oculocefalico · mar-img-45-3',
        enunciado: 'Giras la cabeza de un paciente en coma bruscamente a la derecha y sus ojos se quedan mirando al frente. ¿Qué te dice?',
        opciones: [
          { t: 'Que el tronco bajo está dañado: los ojos no responden al giro', porque: 'Es al revés: con el tronco dañado los ojos siguen el giro de la cabeza. Si lo lees al revés, darás por perdido el tronco de un paciente que lo conserva.' },
          { t: 'Que el paciente está despierto y colabora', porque: 'Un paciente despierto también sigue el giro con los ojos; la mirada al frente se ve con el tronco intacto y el hemisferio afectado. Despierto no es coma y no explica nada de este hallazgo.' },
          { t: 'Tronco bajo intacto, aunque los hemisferios estén afectados', ok: true }],
        explicacion: `Con los hemisferios afectados pero el <span class="hl-verde">tronco bajo intacto</span>, los ojos se desvían en sentido contrario al giro y mantienen la mirada al frente. Con el tronco dañado (o si está despierto) siguen el giro. <span class="hl-rojo">No hacerlo con columna cervical inestable</span> (${pag(12, 'pág. 12')}).` },
      { id: 'mnk-g6', corto: 'la calórica', tipo: 'error', fuente: 'mn-coma-oculovestibular · mar-img-45-3',
        enunciado: 'Apuntes de un compañero sobre el reflejo oculovestibular. Encuentra el error.',
        frases: [
          { t: 'Compruebo antes que el tímpano está íntegro y el conducto libre.' },
          { t: 'Inyecto 50 mL de salino frío en el conducto auditivo.' },
          { t: 'Con el tronco intacto, los ojos se desvían despacio hacia el oído irrigado.' },
          { t: 'Irrigo el otro oído a continuación, sin esperar.', mal: true, c: 'Hay que <span class="hl">esperar 5 min</span> antes de irrigar el otro lado.' }],
        explicacion: `Tímpano íntegro y conducto libre; 50 mL de salino frío; con el tronco intacto los ojos se desvían despacio hacia el oído irrigado; se pierde si el tronco está dañado. Esperar 5 min antes del otro lado (${pag(13, 'pág. 13')}).` },
    ],
    examen: [
      { id: 'mnk-e1', corto: 'medias no reactivas', tipo: 'test', fuente: 'mn-tabla-45-4 · mn-pup-medias-nr',
        enunciado: 'Paciente en coma con pupilas de tamaño medio que no reaccionan a la luz. ¿Con qué se asocia?',
        opciones: [
          { t: 'Sobredosis de sedantes o bloqueo neuromuscular, con pupilas reactivas', porque: 'Los sedantes dan pupilas medias pero reactivas. Atribuir una pupila arreactiva a la sedación retrasa el estudio de una causa cerebral grave.' },
          { t: 'Hipotermia (<28 °C) o compresión del tronco por una masa', porque: 'La hipotermia profunda da pupilas dilatadas no reactivas, no medias. Calentar al paciente sin buscar la causa deja sin descartar lo grave.' },
          { t: 'Fallo hepático agudo, encefalopatía postanóxica o muerte encefálica', ok: true }],
        explicacion: `Tabla 45.4: <span class="hl-rojo">medias no reactivas</span> = fallo hepático agudo, encefalopatía postanóxica o muerte encefálica (${pag(11, 'pág. 11')}).` },
      { id: 'mnk-e2', corto: 'medias reactivas', tipo: 'test', fuente: 'mn-tabla-45-4 · mn-pup-medias-r',
        enunciado: 'En un paciente en coma las pupilas son medias y reaccionan a la luz. ¿Cuál es la lectura de la Tabla 45.4?',
        opciones: [
          { t: 'Tóxico-metabólica, sedantes o bloqueo neuromuscular', ok: true },
          { t: 'Masa en expansión con herniación uncal', porque: 'Eso da una sola pupila dilatada y fija. Pedir un TC urgente por esta pupila desvía la atención de la intoxicación o el bloqueo.' },
          { t: 'Muerte encefálica, porque el tamaño medio indica que no hay tono', porque: 'Con muerte encefálica las pupilas medias no son reactivas. Declararla con pupilas reactivas sería un error grave.' }],
        explicacion: `<span class="hl-verde">Medias y reactivas</span>: encefalopatía tóxica o metabólica, sobredosis de sedantes o bloqueo neuromuscular (${pag(11, 'pág. 11')}).` },
      { id: 'mnk-e3', corto: 'GCS intubado', tipo: 'test', fuente: 'mn-tabla-45-5 · mn-gcs-calc · mn-gcs-contexto',
        calculadora: { ir: 'mn-gcs-calc', nombre: 'Glasgow (Tabla 45.5)' },
        enunciado: 'Paciente intubado: abre los ojos al dolor y localiza el dolor con la mano. ¿Qué Glasgow le pones?',
        opciones: [
          { t: '8: coma grave por traumatismo craneal', porque: 'Con tubo el máximo es 11 y la parte verbal vale 1 como pseudopuntuación; clasificarlo por los tramos de gravedad sin escribir la T lo lee como un TCE grave sin serlo necesariamente.' },
          { t: '8T: 2 + 1 (pseudopuntuación) + 5, máximo 11 con tubo', ok: true },
          { t: '7: sin voz por el tubo se omite el componente verbal', porque: 'No se omite: se da 1 punto de pseudopuntuación (pág. 14), así que 2 + 5 + 1 = 8, no 7. Sumar solo ojos y motor engaña la gravedad.' }],
        explicacion: `Ojos 2 + verbal <span class="hl">1 (pseudopuntuación, tubo)</span> + motor 5 = 8T. Con tubo endotraqueal la puntuación máxima es <span class="hl-rojo">11</span> (${pag(13, 'págs. 13')}-${pag(14, '14')}).` },
      { id: 'mnk-e4', corto: 'GCS no fiable', tipo: 'test', fuente: 'mn-gcs-usos',
        enunciado: '¿En qué situación no es fiable el Glasgow?',
        opciones: [
          { t: 'Con relajantes, sedación profunda o hipotensión', ok: true },
          { t: 'Con una pupila dilatada y fija', porque: 'Es señal de masa, pero no invalida la escala (pág. 13): el Glasgow sigue puntuándose y vigilándose. Dejar de medirlo ahí te haría perder la evolución mientras llega el TC.' },
          { t: 'En el coma no traumático', porque: 'La escala se extendió del trauma al coma no traumático y sirve para definirlo (≤8). Dejar de usarla ahí te quita una forma de seguir la evolución.' }],
        explicacion: `El GCS <span class="hl-rojo">no es fiable</span> con relajantes, sedación profunda o hipotensión (${pag(13, 'pág. 13')}).` },
      { id: 'mnk-e5', corto: 'GCS y pronóstico', tipo: 'test', fuente: 'mn-gcs-usos',
        nota: 'Nota de fidelidad: la fuente compara «GCS ≤6» con «GCS ≤5»; los dos grupos se solapan. Se reproduce tal cual.' + enFicha('mn-coma', 'mn-gcs-usos'),
        enunciado: 'Coma no traumático: ¿qué dice Marino del GCS inicial y el pronóstico?',
        opciones: [
          { t: 'Un GCS inicial ≤8 no despierta nunca', porque: 'El ≤8 define el coma, no un pronóstico fatal. El libro solo da la cifra (pág. 14) y no dice que justifique retirar el tratamiento.' },
          { t: 'No tiene valor pronóstico: solo sirve para decidir la intubación', porque: 'El libro cita cuatro usos, uno de ellos el pronóstico. Ignorarlo te hace perder una referencia que el libro sí recoge.' },
          { t: 'Con ≤6 hay 7 veces más probabilidad de despertar que con ≤5', ok: true }],
        explicacion: `En el coma no traumático, un GCS inicial <span class="hl">≤6 tiene siete veces más probabilidades de despertar que uno ≤5</span> (${pag(14, 'pág. 14')}). La fuente compara grupos que se solapan.` },
      { id: 'mnk-e6', corto: 'mirada fija', tipo: 'test', fuente: 'mn-coma-motilidad',
        enunciado: 'Un paciente en coma tiene una preferencia fija de la mirada hacia un lado. ¿Qué sugiere?',
        opciones: [
          { t: 'Lesión ocupante o actividad epiléptica', ok: true },
          { t: 'Una encefalopatía metabólica con movimientos oculares espontáneos', porque: 'En la encefalopatía tóxica o metabólica los movimientos oculares espontáneos son un signo inespecífico, no una mirada fija. Atribuirlo a lo metabólico deja sin buscar la lesión o las crisis.' },
          { t: 'Un tronco normal', porque: 'La mirada fija no informa de que el tronco esté sano: lo mide el oculocefálico y el oculovestibular. Tranquilizarse con ella retrasa el EEG o el TC.' }],
        explicacion: `Una preferencia fija de la mirada sugiere mucho una <span class="hl-rojo">lesión ocupante o actividad epiléptica</span>; los movimientos espontáneos son un signo inespecífico de encefalopatía (${pag(12, 'pág. 12')}).` },
    ],
    casos: [
      { id: 'mnk-eduvigis', titulo: 'Eduvigis, 84 años: la que dormía por el fentanilo', corto: 'Caso · Eduvigis', sub: 'coma, opiáceos y un giro: una masa',
        paciente: { Edad: '84 años, mujer', Antecedentes: 'Fibrilación auricular con anticoagulante oral', Motivo: 'Dolor lumbar con parche de fentanilo' },
        pasos: [
          { momento: 'Día 0 · 08:30', datos: { Hallazgo: 'La encuentran inconsciente', Constantes: 'FR 7, SpO₂ 88 %, PA 132/70', Exploración: 'No abre los ojos, no emite sonidos, ningún movimiento al dolor' }, nuevo: ['Hallazgo', 'Constantes', 'Exploración'],
            calculadora: { ir: 'mn-gcs-calc', nombre: 'Glasgow (Tabla 45.5)' },
            pregunta: { id: 'mnk-c1', tipo: 'test', fuente: 'mn-gcs-calc · mn-gcs-usos',
              enunciado: 'Con ojos 1, verbal 1 y motor 1, ¿qué haces con la vía aérea?',
              opciones: [
                { t: 'Espero: es una intoxicación y se corregirá sola', porque: 'Con SpO₂ 88 % y FR 7, esperar es dejarla hipoventilar. Con GCS ≤8 los reflejos protectores de la vía aérea suelen fallar.' },
                { t: 'GCS 3: coma (≤8) y vía aérea en riesgo, intubar', ok: true },
                { t: 'GCS 3: lo único que hace falta es oxígeno con mascarilla', porque: 'La mascarilla no protege la vía aérea de un paciente sin reflejos y con FR 7: aspirará.' }],
              explicacion: `Suma 3: ausencia total de respuesta. Un GCS <span class="hl-rojo">≤8 define el coma</span> y se usa para decidir la intubación porque los reflejos protectores suelen fallar (${pag(14, 'pág. 14')}).` } },
          { momento: 'Día 0 · 08:40', datos: { Pupilas: 'Puntiformes, reactivas', 'Otro dato': 'Parche de fentanilo en la espalda' }, nuevo: ['Pupilas', 'Otro dato'],
            calculadora: { ir: 'mn-pup-calc', nombre: '¿Qué pupilas tengo delante? (Tabla 45.4)' },
            pregunta: { id: 'mnk-c2', tipo: 'test', fuente: 'mn-pup-pequenas · mn-pup-puntiformes',
              enunciado: 'Con pupilas puntiformes reactivas, ¿cuál es la causa más probable?',
              opciones: [
                { t: 'Una lesión de la protuberancia (pontina)', porque: 'La lesión pontina da pupilas puntiformes no reactivas. Pedir un TC de fosa posterior por esto retrasa retirar el fármaco.' },
                { t: 'Atropina o un anticolinérgico oculto', porque: 'Los anticolinérgicos dilatan las pupilas; no dan pupilas puntiformes. Buscarlos hace perder el parche que tiene delante.' },
                { t: 'Sobredosis de opiáceos', ok: true }],
              explicacion: `Pequeñas o puntiformes <span class="hl-verde">reactivas</span>: sobredosis de opiáceos; no reactivas, lesión pontina (${pag(11, 'pág. 11')}). La naloxona no se trata en este capítulo.` } },
          { momento: 'Día 0 · 09:00', datos: { Plan: 'Valorar el tronco' }, nuevo: ['Plan'],
            pregunta: { id: 'mnk-c3', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-coma-oculocefalico · mn-coma-oculovestibular · mar-img-45-3',
              enunciado: 'Sin columna cervical inestable. ¿Qué dos hallazgos te aseguran que el tronco conserva su función?',
              puntos: [
                'Ojos de muñeca <span class="hl-verde">presentes</span>: al girar la cabeza los ojos se quedan al frente (o van en sentido contrario al giro).',
                'Oculovestibular presente: con 50 mL de salino frío, los ojos se <span class="hl">desvían despacio hacia el oído irrigado</span>.'],
              explicacion: `Ambos reflejos están presentes con el tronco intacto y se pierden si no lo está (Fig. 45.3; ${pag(12, 'págs. 12')}-${pag(13, '13')}).` } },
          { momento: 'Día 0 · 14:30 · el giro', datos: { Situación: 'Intubada', Pupilas: 'Izquierda dilatada y fija; derecha puntiforme' }, nuevo: ['Situación', 'Pupilas'],
            // [cráneo: herniacion-uncal]
            pregunta: { id: 'mnk-c4', tipo: 'test', fuente: 'mn-pup-unilateral · mn-tabla-45-4',
              enunciado: 'Ahora una pupila izquierda dilatada y fija. ¿Qué piensas?',
              opciones: [
                { t: 'El efecto residual del fentanilo, que sigue actuando en el cerebro', porque: '(fisiología general) El opiáceo da pupilas pequeñas y simétricas. Esperar a que se disipe retrasa el TC ante una masa que comprime el tronco.' },
                { t: 'Un síndrome de Horner', porque: '(fisiología general) El Horner es una pupila más pequeña, no dilatada. Con esa idea no se pide el TC urgente.' },
                { t: 'Ya no es el opiáceo: masa en expansión, TC urgente', ok: true }],
              explicacion: `Una dilatada y fija = masa intracraneal en expansión (herniación uncal) (${pag(11, 'pág. 11')}). El TC muestra un hematoma subdural izquierdo (dato del caso).` } },
          { momento: 'Día 0 · 15:00', datos: { 'Respuesta al dolor': 'Extensión y pronación de los cuatro miembros' }, nuevo: ['Respuesta al dolor'],
            pregunta: { id: 'mnk-c5', tipo: 'test', fuente: 'mn-coma-posturas',
              enunciado: 'Extensión y pronación de brazos y piernas al dolor. ¿Qué tipo de respuesta y qué lesión?',
              opciones: [
                { t: 'Descerebración: mesencéfalo y protuberancia alta', ok: true },
                { t: 'Decorticación: lesión talámica, con flexión de los brazos', porque: 'La decorticación es flexión de los brazos, no extensión. Pensar en el tálamo subestima la compresión del mesencéfalo que causa el hematoma.' },
                { t: 'Flacidez: tronco bajo', porque: 'La flacidez es la respuesta de la lesión del tronco bajo. Aquí hay extensión, que indica una lesión más alta, y esperar flacidez haría descartar el tronco comprimido.' }],
              explicacion: `Esa postura es <span class="hl-rojo">descerebración</span>: lesión de mesencéfalo y protuberancia alta (${pag(10, 'pág. 10')}).` } },
          { momento: 'Día 1 · la nota del R1', datos: { 'Nota del R1': 'Resumen de la evolución' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'mnk-c6', tipo: 'error', fuente: 'mn-gcs-usos · mn-coma-oculocefalico',
              enunciado: 'La nota del R1. Encuentra los errores.',
              frases: [
                { t: 'Coma por opiáceos al ingreso: pupilas puntiformes reactivas.' },
                { t: 'GCS 3 al ingreso, intubada.' },
                { t: 'Ahora el GCS es fiable aunque está con propofol a dosis altas.', mal: true, c: 'El GCS <span class="hl-rojo">no es fiable con sedación profunda</span>, relajantes o hipotensión.' },
                { t: 'Repito los ojos de muñeca para ver el tronco, aunque cayó al suelo y no lleva collarín.', mal: true, c: 'No se hace con <span class="hl-rojo">columna cervical inestable</span>.' },
                { t: 'TC urgente por midriasis unilateral.' }],
              explicacion: `GCS no fiable con sedación profunda (${pag(13, 'pág. 13')}); el oculocefálico no se hace con columna cervical inestable (${pag(12, 'pág. 12')}).` } },
        ],
        lleva: [
          'Pupilas puntiformes reactivas = opiáceos; puntiformes no reactivas = lesión pontina.',
          'Una pupila dilatada y fija = masa en expansión: TC urgente.',
          'GCS ≤8: coma e intubar; no es fiable con sedación profunda o relajantes.'],
        // [cráneo: herniacion-uncal]
        volver: { nombre: 'Pupila dilatada y fija', ancla: 'mn-pup-unilateral', modelo: visual('mn-coma', '👁️ La cara de Glasgow con la pupila, en la vista Visual') } },
    ],
    profundizar: [
      { id: 'mn-coma-causas', titulo: 'Causas del coma (incluido el coma aparente)' },
      { id: 'mn-coma-motor', titulo: 'Respuesta motora: movimientos y déficit focal' },
      { id: 'mn-gcs-origen', titulo: 'Origen y rango del Glasgow' },
      { id: 'mn-tabla-45-4', titulo: 'Síndrome de Horner: la pupila más pequeña' },
    ],
  },

  /* =================================================================================================
     Ficha 5 · Muerte encefálica (cap. 45, págs. 14-16)
     ================================================================================================= */
  'mn-muerte-encefalica': {
    entrada: 'Qué exige la lista de comprobación de la muerte encefálica, por qué la PAM ≥75, cómo se hace el test de apnea y qué pruebas confirman.',
    guia: [
      { id: 'mnm-g1', corto: 'por qué PAM ≥75', tipo: 'test', fuente: 'mn-me-pam',
        enunciado: 'En la muerte encefálica se exige PAM ≥75 mmHg, no el ≥65 de siempre. ¿Por qué?',
        opciones: [
          { t: 'Para que el test de apnea no baje la presión', porque: 'El test es arriesgado (hipotensión, arritmias), pero la razón de la cifra es otra. Con esa idea, te fijarías en la PA solo durante la apnea y no antes.' },
          { t: 'Porque el requisito es la PA sistólica ≥100 y la PAM la sustituye', porque: 'La tabla da las dos cifras (PAS ≥100 o PAM ≥75); la ficha prefiere la PAM, que es la presión que importa. No explica por qué sube a 75.' },
          { t: 'Para contrarrestar la hipertensión intracraneal', ok: true }],
        explicacion: `La PAM es la presión fisiológica que importa; la exigida (≥75) es mayor que el objetivo habitual (≥65) <span class="hl">para contrarrestar la hipertensión intracraneal</span> (${pag(14, 'pág. 14')}).` },
      { id: 'mnm-g2', corto: 'los sedantes', tipo: 'test', fuente: 'mn-me-farmacos',
        enunciado: 'No dispones de niveles del sedante que recibió el paciente. ¿Cuánto esperas desde la última dosis?',
        opciones: [
          { t: '24 horas fijas', porque: 'El libro no da una cifra fija en horas: depende de las semividas del fármaco. Con un fármaco de semivida larga, 24 h pueden ser pocas y el efecto residual falsea la exploración.' },
          { t: 'Hasta que la sangre no tenga fármaco: no hace falta más', porque: 'La ficha avisa de que aclarar la sangre no garantiza que el fármaco salga del cerebro. Declarar la muerte demasiado pronto sería irreversible.' },
          { t: '5 semividas desde la última dosis', ok: true }],
        explicacion: `Sin niveles del fármaco, esperar <span class="hl">5 semividas</span> desde la última dosis: aclara la sangre, aunque no garantiza que salga del cerebro (${pag(14, 'pág. 14')}).` },
      { id: 'mnm-g3', corto: 'tras enfriar', tipo: 'test', fuente: 'mn-me-ttm',
        enunciado: 'El paciente estuvo con control de temperatura con objetivo <36 °C. ¿Qué hace falta antes de evaluar la muerte encefálica?',
        opciones: [
          { t: 'Nada: basta con que la temperatura sea >36 °C en ese momento', porque: 'El libro pide mantener >36 °C al menos 24 h antes de la evaluación. Explorarlo recién calentado puede dar una exploración falsamente grave.' },
          { t: 'Mantener >36 °C al menos 24 h antes de la evaluación', ok: true },
          { t: 'Mantener 36 °C exactos 48 h', porque: 'La temperatura exigida es mayor de 36 °C y durante al menos 24 h, no 48 h a 36 °C exactos.' }],
        explicacion: `Si el objetivo fue <36 °C, mantener <span class="hl-rojo">>36 °C al menos 24 h</span> antes de la evaluación (${pag(14, 'pág. 14')}).` },
      { id: 'mnm-g4', corto: 'objetivo de CO₂', tipo: 'test', fuente: 'mn-me-apnea-pasos · mn-apnea-calc',
        calculadora: { ir: 'mn-apnea-calc', nombre: 'Test de apnea: objetivo y tiempo' },
        enunciado: 'PaCO₂ basal 41 mmHg. Predice el objetivo al final de la apnea y cuánto tarda.',
        opciones: [
          { t: 'PaCO₂ de 60 mmHg en unos 3 min', porque: 'A 3 mmHg/min no se suben 20 mmHg en 3 min. Con la gasometría tan pronto, el CO₂ aún no es estímulo suficiente y el test no tiene valor.' },
          { t: 'PaCO₂ ≥61 mmHg, en unos 7 min (3 mmHg/min)', ok: true },
          { t: 'PaCO₂ de 50 mmHg (10 sobre la basal) en 3 minutos de apnea', porque: 'Hay que subir 20 mmHg sobre la basal, no 10. Un test que acaba antes no demuestra apnea.' }],
        explicacion: `Objetivo: PaCO₂ <span class="hl">>60 y >20 mmHg sobre la basal</span> (aquí ≥61); sube unos <span class="hl-rojo">3 mmHg por minuto</span> a temperatura normal: 6-7 min (${pag(15, 'págs. 15')}-${pag(16, '16')}).` },
      { id: 'mnm-g5', corto: 'pruebas confirmatorias', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-me-confirmatoria · mn-me-confirmatorias',
        enunciado: '¿Cuándo se recurre a una prueba confirmatoria y cuáles se aceptan?',
        puntos: [
          'Solo si los pasos 1-4 <span class="hl-rojo">no se pueden completar o interpretar</span>.',
          'Aceptadas: <span class="hl-verde">Doppler transcraneal, gammagrafía de flujo cerebral o angiografía de 4 vasos</span>.'],
        explicacion: `Tabla 45.6, paso 5 (${pag(15, 'pág. 15')}) y pruebas aceptadas (${pag(16, 'pág. 16')}).` },
      { id: 'mnm-g6', corto: 'Lázaro', tipo: 'test', fuente: 'mn-me-lazaro',
        // [cráneo: muerte-encefalica]
        enunciado: 'Al retirar el respirador, el paciente con muerte encefálica confirmada mueve un brazo. ¿Qué es?',
        opciones: [
          { t: 'El signo de Lázaro: descargas de la médula cervical', ok: true },
          { t: 'Un falso positivo: el test de apnea estaba mal hecho', porque: 'Es un movimiento espinal conocido, no prueba que el diagnóstico sea falso. Interpretarlo así lleva a repetir pruebas inútiles y angustia a la familia.' },
          { t: 'Un esfuerzo respiratorio del tronco', porque: 'Los esfuerzos respiratorios dependen del tronco, que está sin función. Si fuera eso, no habría muerte encefálica.' }],
        explicacion: `Movimientos breves y espontáneos de cabeza, tronco o brazos, sobre todo al retirar el respirador: son <span class="hl-azul">descargas de la médula cervical</span> (quizá por hipoxemia). Pueden angustiar si aparecen tras declarar la muerte (${pag(16, 'pág. 16')}).` },
    ],
    examen: [
      { id: 'mnm-e1', corto: 'no es confirmatoria', tipo: 'test', fuente: 'mn-me-confirmatorias',
        enunciado: '¿Cuál NO es una prueba confirmatoria aceptada de muerte encefálica?',
        opciones: [
          { t: 'El electroencefalograma (EEG)', ok: true },
          { t: 'Doppler transcraneal', porque: 'Está aceptado. Descartarlo deja sin recurso a un paciente en el que no se puede completar la apnea.' },
          { t: 'Angiografía de 4 vasos del encéfalo', porque: 'Está aceptada. Rechazarla te quita la prueba de flujo de referencia.' }],
        explicacion: `Aceptadas: Doppler transcraneal, gammagrafía de flujo y angiografía de 4 vasos. <span class="hl-rojo">No aceptadas</span>: EEG, potenciales evocados auditivos y somatosensoriales, angio-TC y angio-RM (${pag(16, 'pág. 16')}).` },
      { id: 'mnm-e2', corto: 'hora de la muerte', tipo: 'test', fuente: 'mn-me-apnea-pasos',
        nota: 'Interpretación de la app, no de la tabla: la Tabla 45.6 trae una sola casilla para el test de apnea, pero el texto habla de un «segundo test».' + enFicha('mn-muerte-encefalica', 'mn-me-segundo-apnea'),
        enunciado: '¿Cuál es la hora de la muerte cuando se confirma con dos exploraciones y dos tests de apnea?',
        opciones: [
          { t: 'La hora en que acaba la primera exploración clínica', porque: 'Con la primera exploración aún falta la segunda, separada ≥12 h. Declarar la muerte entonces sería prematuro.' },
          { t: 'La hora en que se retira el respirador', porque: 'Se suele mantener un tiempo en el respirador para la despedida de la familia; esa hora no es la de la muerte.' },
          { t: 'La hora del resultado de la segunda gasometría', ok: true }],
        explicacion: `Si el segundo test confirma la apnea, la hora de la muerte es la <span class="hl">hora en que llega el resultado de esa segunda gasometría</span> (${pag(16, 'pág. 16')}).` },
      { id: 'mnm-e3', corto: 'CO₂ y ventilación', tipo: 'test', fuente: 'mn-me-apnea-pasos',
        enunciado: 'Subir la PaCO₂ solo 1 mmHg aumenta la ventilación minuto en:',
        opciones: [
          { t: '0,5 L/min', porque: 'El libro da cuatro veces más. Con esa cifra pensarías que el CO₂ es un estímulo débil y subestimarías la fuerza del test.' },
          { t: '2 L/min', ok: true },
          { t: '5 L/min', porque: 'La cifra es 2 L/min. Sobrestimarlo haría pensar que el test es siempre inequívoco incluso con poca subida.' }],
        explicacion: `El CO₂ es un estímulo potente: <span class="hl">1 mmHg más de PaCO₂ aumenta la ventilación minuto en 2 L/min</span> (${pag(16, 'pág. 16')}).` },
      { id: 'mnm-e4', corto: 'cuántos exploradores', tipo: 'test', fuente: 'mn-me-calc',
        calculadora: { ir: 'mn-me-calc', nombre: 'Lista de comprobación de la muerte encefálica' },
        enunciado: 'En el adulto, ¿cuántos exploradores hacen falta para la exploración?',
        opciones: [
          { t: 'Dos, y uno de ellos neurólogo', porque: 'El libro no lo exige (pág. 15): basta un explorador con experiencia en el adulto.' },
          { t: 'Dos, de servicios distintos al que trata al paciente', porque: 'La pág. 15 no pide dos: basta un explorador con experiencia en el adulto.' },
          { t: 'Uno, si tiene experiencia', ok: true }],
        explicacion: `<span class="hl">Un solo explorador basta en el adulto</span> si tiene experiencia en la prueba (${pag(15, 'pág. 15')}).` },
      { id: 'mnm-e5', corto: 'cómo se sospecha', tipo: 'test', fuente: 'mn-me-causas',
        enunciado: '¿Cómo suele sospecharse la muerte encefálica en la UCI?',
        opciones: [
          { t: 'Por un EEG plano, que se pide antes de explorar al paciente', porque: 'El EEG no es una prueba confirmatoria aceptada ni el modo de sospecharla. Esperar a un EEG retrasa la exploración clínica.' },
          { t: 'Por pupilas sin reflejo a la luz o sin esfuerzos en el respirador', ok: true },
          { t: 'Por una PIC que no baja pese al tratamiento', porque: 'La hipertensión intracraneal puede ser la causa, pero la sospecha (pág. 14) es clínica: pupilas sin reflejo o sin esfuerzos en el respirador. Esperar la cifra deja pasar los signos.' }],
        explicacion: `Sospecha: <span class="hl-rojo">pupilas sin reflejo fotomotor</span> o no haber esfuerzos respiratorios en el respirador (${pag(14, 'pág. 14')}).` },
    ],
    casos: [
      { id: 'mnm-abundio', titulo: 'Abundio, 23 años: del hematoma a la muerte encefálica', corto: 'Caso · Abundio', sub: 'TCE por moto; 75 kg',
        paciente: { Edad: '23 años, varón', Peso: '75 kg', Motivo: 'Traumatismo craneal en moto' },
        pasos: [
          { momento: 'Día 0 · 02:00', datos: { Exploración: 'GCS 1-1-2 = 4; pupila derecha dilatada y fija; extensión al dolor', TC: 'Hematoma subdural agudo derecho' }, nuevo: ['Exploración', 'TC'],
            // el hematoma lo evacúa neurocirugía: dato del caso; el criterio de cirugía no es de Marino (ver «Para profundizar»)
            pregunta: { id: 'mnm-c1', tipo: 'test', fuente: 'mn-coma-posturas · mn-pup-unilateral',
              enunciado: 'Extensión al dolor y una pupila dilatada y fija. ¿Qué te dicen las dos cosas?',
              opciones: [
                { t: 'Descerebración y una masa en expansión', ok: true },
                { t: 'Decorticación y un efecto de sedantes', porque: 'No hay flexión, y los sedantes no dan una sola pupila fija. Dejarlo así retrasa la cirugía del hematoma.' },
                { t: 'Lesión del tronco bajo: sin respuesta, y trauma ocular', porque: 'El tronco bajo da flacidez; aquí hay extensión. Atribuir la pupila al ojo sin mirar el cerebro deja crecer la masa.' }],
              explicacion: `Extensión y pronación = descerebración (${pag(10, 'pág. 10')}); una pupila dilatada y fija = masa intracraneal en expansión (${pag(11, 'pág. 11')}). Neurocirugía evacúa el hematoma (dato del caso).` } },
          { momento: 'Día 1 · 08:00', datos: { Pupilas: 'Medias y fijas', Respirador: 'Ningún esfuerzo; no tose', Temperatura: '35,4 °C', Sedación: 'Propofol y fentanilo parados hace 4 h' }, nuevo: ['Pupilas', 'Respirador', 'Temperatura', 'Sedación'],
            calculadora: { ir: 'mn-me-calc', nombre: 'Lista de comprobación de la muerte encefálica' },
            pregunta: { id: 'mnm-c2', tipo: 'test', fuente: 'mn-me-calc · mn-me-farmacos · mn-me-ttm',
              enunciado: '¿Empiezas ya la determinación de muerte encefálica?',
              opciones: [
                { t: 'Sí: la clínica es clara y las pupilas están fijas', porque: 'Faltan requisitos: <48 h, T ≤36 °C y depresores sin aclarar. Declararla ahora es irreversible y no estaría fundada.' },
                { t: 'Sí, y si dudas, haz un EEG', porque: 'El EEG no es una prueba confirmatoria aceptada; no resuelve la duda de los requisitos.' },
                { t: 'Aún no: <48 h, T ≤36 °C y sedantes', ok: true }],
              explicacion: `Requisitos: al menos <span class="hl">48 h</span> desde la lesión, PAM ≥75, T >36 °C y sin efecto de depresores (5 semividas) (${pag(14, 'págs. 14')}-${pag(15, '15')}).` } },
          { momento: 'Día 2 · 08:00', datos: { Constantes: 'T 36,6 °C, PAS 112, PAM 78', Analítica: 'Glucosa 118', Sedantes: 'Sin ellos desde hace más de 5 semividas', 'Exploración 1': 'Los 6 reflejos ausentes' }, nuevo: ['Constantes', 'Analítica', 'Sedantes', 'Exploración 1'],
            calculadora: { ir: 'mn-me-calc', nombre: 'Lista de comprobación de la muerte encefálica' },
            pregunta: { id: 'mnm-c3', tipo: 'test', fuente: 'mn-me-calc',
              enunciado: 'Cumple los requisitos de la lista (sin sedantes, T y PAM adecuadas; sin hipotiroidismo ni otras causas reversibles descartadas por la analítica del caso) y la primera exploración es completa. ¿Qué falta?',
              opciones: [
                { t: 'Nada: puede declararse ya con la primera exploración', porque: 'Faltan la segunda exploración (≥12 h) y el test de apnea. Declararlo ahora saltaría pasos de la lista.' },
                { t: 'Solo el EEG', porque: 'El EEG no es una prueba confirmatoria aceptada ni un paso de la lista.' },
                { t: 'La segunda exploración ≥12 h y el test de apnea', ok: true }],
              explicacion: `Paso 3: dos exploraciones separadas ≥12 h; paso 4: test de apnea (${pag(15, 'pág. 15')}).` } },
          { momento: 'Día 2 · 08:30 · plan del R1 para la apnea', datos: { 'Plan del R1': 'Test de apnea' }, nuevo: ['Plan del R1'],
            calculadora: { ir: 'mn-apnea-calc', nombre: 'Test de apnea: objetivo y tiempo' },
            pregunta: { id: 'mnm-c4', tipo: 'error', fuente: 'mn-me-apnea-pasos · mn-me-confirmatorias',
              enunciado: 'El plan del R1 para la apnea. Encuentra los errores.',
              frases: [
                { t: 'Preoxigeno con O₂ al 100 % y saco una gasometría basal.' },
                { t: 'Desconecto del respirador e insuflo O₂ por el tubo.' },
                { t: 'Con 3 min basta: el CO₂ sube rápido.', mal: true, c: 'Sube <span class="hl">unos 3 mmHg/min</span>: 6-7 min para +20 mmHg.' },
                { t: 'Si aparece hipotensión o arritmia y no puedo completarlo, confirmo con un EEG.', mal: true, c: 'El <span class="hl-rojo">EEG no está aceptado</span>: Doppler transcraneal, gammagrafía de flujo o angiografía de 4 vasos.' },
                { t: 'Gasometría al final y vuelta al respirador.' }],
              explicacion: `Apnea: ${pag(16, 'pág. 16')}. Pruebas confirmatorias aceptadas y no aceptadas: ${pag(16, 'pág. 16')} (Tabla 45.6, ${pag(15, 'pág. 15')}).` } },
          { momento: 'Día 2 · 09:00 · apnea de 7 min', datos: { 'PaCO₂': '41 → 63 mmHg', Esfuerzos: 'Ninguno' }, nuevo: ['PaCO₂', 'Esfuerzos'],
            calculadora: { ir: 'mn-apnea-calc', nombre: 'Test de apnea: objetivo y tiempo' },
            pregunta: { id: 'mnm-c5', tipo: 'test', fuente: 'mn-apnea-calc · mn-me-apnea-pasos',
              enunciado: 'PaCO₂ de 41 a 63 mmHg, sin esfuerzos. ¿Cómo lo interpretas?',
              opciones: [
                { t: 'Compatible: PaCO₂ >60 y +22, sin esfuerzos', ok: true },
                { t: 'No concluyente: no llega a +25 sobre la basal', porque: 'La exigencia es >60 y +20 sobre la basal; aquí hay +22. Repetir la apnea expone al paciente a otro riesgo sin motivo.' },
                { t: 'Compatible solo si sube a 80', porque: 'El libro no pide esa cifra. Exigirla alargaría la apnea con riesgo de hipotensión y arritmias.' }],
              explicacion: `Sin esfuerzos con PaCO₂ <span class="hl">>60 y >20 sobre la basal</span> (${pag(15, 'págs. 15')}-${pag(16, '16')}). La app usa ≥20 sobre la basal.` } },
          { momento: 'Día 3 · 08:00 (más de 12 h)', datos: { 'Exploración 2': 'Igual que la primera', 'Apnea 2': 'Igual', Gasometría: 'Resultado a las 08:40' }, nuevo: ['Exploración 2', 'Apnea 2', 'Gasometría'],
            pregunta: { id: 'mnm-c6', tipo: 'test', fuente: 'mn-me-apnea-pasos · mn-me-segundo-apnea',
              enunciado: 'La segunda exploración y la segunda apnea confirman. ¿A qué hora se declara la muerte?',
              opciones: [
                { t: 'A las 08:00, al empezar la segunda exploración', porque: 'Aún no hay resultado de la gasometría del segundo test. Declararla entonces no tiene base.' },
                { t: 'A las 08:40, al llegar el resultado de la gasometría', ok: true },
                { t: 'A la hora en que se retira el respirador tras la despedida', porque: 'El tiempo de despedida no es la hora de la muerte; se mantiene al paciente en el respirador.' }],
              explicacion: `La hora de la muerte es la del <span class="hl">resultado de la segunda gasometría</span> (${pag(16, 'pág. 16')}).` } },
          { momento: 'Día 3 · el giro', datos: { Hallazgo: 'Al retirar el respirador, flexiona un brazo y eleva el tronco' }, nuevo: ['Hallazgo'],
            // [cráneo: muerte-encefalica]
            pregunta: { id: 'mnm-c7', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-me-lazaro',
              enunciado: 'La enfermera se asusta. ¿Qué le dices?',
              puntos: [
                'Es el <span class="hl-azul">signo de Lázaro</span>: descargas de la médula cervical, quizá por hipoxemia.',
                'No cambia el diagnóstico ya confirmado; puede angustiar, y conviene explicárselo a la familia.'],
              explicacion: `Movimientos breves y espontáneos al retirar el respirador (${pag(16, 'pág. 16')}).` } },
        ],
        lleva: [
          'Requisitos: ≥48 h, PAM ≥75, T >36 °C y 5 semividas de los sedantes.',
          'Apnea: PaCO₂ >60 y +20 sobre la basal, 6-7 min a 3 mmHg/min.',
          'El EEG no confirma; el signo de Lázaro es médula, no cerebro.'],
        // [cráneo: muerte-encefalica]
        volver: { nombre: 'Pruebas confirmatorias', ancla: 'mn-me-confirmatorias', modelo: visual('mn-muerte-encefalica', '👁️ La lista de comprobación de la muerte encefálica (vista Visual)') } },
    ],
    profundizar: [
      { id: 'mn-me-definicion', titulo: 'Definición legal (UDDA)' },
      { id: 'mn-me-familia', titulo: 'Cuidar a la familia' },
      { id: 'mn-me-segundo-apnea', titulo: 'El segundo test de apnea' },
      { id: 'mn-me-apnea-riesgo', titulo: 'Riesgos del test de apnea' },
    ],
  },
};
