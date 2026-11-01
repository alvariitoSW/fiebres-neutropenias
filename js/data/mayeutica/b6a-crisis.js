// Mayéutica del bloque 6a, grupo 6B · Convulsiones (mn-convulsiones, Marino cap. 46, págs. 19-21) y Estado
// epiléptico (mn-estado-epileptico, págs. 21-23). La pinta js/core/mayeutica.js. Datos puros; formato: b1-fluidos.js.
// Toda la medicina sale de la ficha (js/modules/libros/marino-neuro.html) y de su PDF
// (docs/marino-2024-neurologia-caps45-47.pdf). Los pacientes de los casos se inventan.
const PDF = 'docs/marino-2024-neurologia-caps45-47.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoNeuro" data-panel="panel-marino-neuro-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;

// Dos cifras del libro para la hemorragia intracerebral (Tabla 46.1 y cap. 47); no se elige ganadora.
const NOTA_HIC = '<b>Las fuentes discrepan.</b> Convulsiones en la hemorragia intracerebral: 20-30 % en la Tabla 46.1 (' + pag(19, 'pág. 19') + ') frente a «alrededor del 15 %» de crisis sintomáticas la primera semana en el cap. 47 (' + pag(45, 'pág. 45') + '); el libro no las concilia.' + enFicha('mn-convulsiones', 'mn-tabla-46-1');

const visual = (tab, texto) => ({ especialidad: 'libros', view: 'marinoNeuro', panel: 'panel-marino-neuro-tabs', tab, enVisual: '', texto });
export const MAYEUTICA_CRISIS = {
  /* =================================================================================================
     Convulsiones y estado epiléptico no convulsivo (págs. 19-21)
     ================================================================================================= */
  'mn-convulsiones': {
    entrada: 'Quién convulsiona en la UCI y por qué, qué es (y qué no es) una crisis, y la crisis que no se ve: el estado no convulsivo detrás de una consciencia alterada.',
    guia: [
      { id: 'mnv-g1', corto: 'quién convulsiona', tipo: 'test', fuente: 'mn-tabla-46-1',
        enunciado: 'Dos pacientes llegan a la UCI en shock igual de grave: uno por una neumonía y otro con una hemorragia intracerebral. Antes de mirar la Tabla 46.1: ¿qué marca el riesgo de convulsionar?',
        opciones: [
          { t: 'La gravedad del shock y el fallo de órganos', porque: 'El libro lo descarta: el riesgo no depende del estado general. Si vigilas más al más grave en lugar de al que tiene lesión cerebral, se te pasará la crisis del paciente con la hemorragia.' },
          { t: 'La presencia y el tipo de lesión cerebral', ok: true },
          { t: 'Solo la edad del paciente', porque: 'La tabla no ordena por edad sino por lesión: traumatismo craneal, isquemia, encefalitis, hemorragia. Con esa idea, un joven con un traumatismo craneal quedaría sin vigilar.' }],
        explicacion: 'El riesgo de convulsiones depende sobre todo de la <span class="hl">presencia y el tipo de lesión cerebral</span>, no del estado general (' + pag(19, 'pág. 19') + '). Sin enfermedad neurológica es de solo un 4-15 %; con isquemia cerebral, un 40 %.' },
      { id: 'mnv-g2', corto: 'la mioclonía', tipo: 'test', fuente: 'mn-conv-movimientos',
        enunciado: 'Una paciente intubada tiene sacudidas irregulares y breves de una mano. ¿Es siempre una crisis epiléptica?',
        opciones: [
          { t: 'Sí: toda sacudida de este tipo es una crisis clónica, que hay que tratar como tal desde el primer momento', porque: 'Clónico es el movimiento rítmico de amplitud regular; el irregular es mioclónico. Tratarlo siempre como crisis la sedaría de más sin que haya descarga cerebral.' },
          { t: 'No: la mioclonía no siempre es una crisis; no va con descargas rítmicas en el EEG', ok: true },
          { t: 'No: solo es crisis si hay contracción mantenida', porque: 'La contracción mantenida es el movimiento tónico, no el único que cuenta. Esperar a verlo dejaría sin diagnosticar las crisis clónicas o los automatismos.' }],
        explicacion: 'Los movimientos pueden ser tónicos, clónicos (rítmicos y regulares), mioclónicos (irregulares) o automatismos. <span class="hl">La mioclonía no se considera siempre una crisis</span>: no se acompaña de descargas rítmicas en el EEG (' + pag(20, 'pág. 20') + ').' },
      { id: 'mnv-g3', corto: 'sin movimientos', tipo: 'test', fuente: 'mn-conv-generalizadas',
        enunciado: 'Un paciente paralizado con relajantes tiene una descarga sincrónica de casi toda la corteza. ¿Puede estar teniendo una crisis generalizada sin que se mueva?',
        opciones: [
          { t: 'No: sin convulsión visible no puede haber una crisis generalizada, solo una mioclonía sin importancia', porque: 'Dar por hecho que sin movimientos no hay crisis es lo que esconde el estado no convulsivo: el paciente seguirá con la cabeza en descarga sin que nadie lo trate.' },
          { t: 'Sí: pierde siempre la consciencia, aunque no siempre convulsione', ok: true },
          { t: 'Sí, pero conserva la consciencia', porque: 'La generalizada siempre pierde la consciencia; la que puede conservarla es la focal. Confundirlas lleva a descartar una crisis porque el paciente «responde».' }],
        explicacion: 'Las generalizadas son descargas sincrónicas de casi toda la corteza y <span class="hl">siempre pierden la consciencia</span>, aunque no siempre convulsionan; las focales pueden o no perderla (' + pag(20, 'pág. 20') + ').' },
      { id: 'mnv-g4', corto: 'EEG continuo', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-conv-eeg',
        enunciado: 'Tienes un paciente con la consciencia alterada y sospechas un estado no convulsivo. ¿Por qué pedir un EEG continuo y no uno de 20 minutos?',
        puntos: [
          'El continuo (1-2 días) encuentra crisis en el <span class="hl-rojo">16 %</span>; los registros intermitentes, solo en el <span class="hl">4-8 %</span>.',
          'Y en los EEG pedidos por <span class="hl-azul">alteración de la consciencia</span>, el 37 % mostraba crisis no convulsivas.'],
        explicacion: 'Por eso el libro pide pensar en crisis no convulsivas en todo paciente de UCI con la consciencia alterada y usar EEG continuo si hay (' + pag(21, 'pág. 21') + ').' },
      { id: 'mnv-g5', corto: 'la parcial compleja', tipo: 'error', fuente: 'mn-conv-parciales',
        enunciado: 'Apuntes sobre la crisis parcial compleja. Puede haber 0, 1 o 2 errores: encuéntralos.',
        frases: [
          { t: 'Es no convulsiva.' },
          { t: 'El paciente está despierto, pero sin conciencia del entorno.' },
          { t: 'A menudo hay un aura previa, como un olor.' },
          { t: 'Hay automatismos, como masticar.' }],
        explicacion: 'Son <span class="hl">no convulsivas, con cambios de conducta</span>: despierto pero sin conciencia del entorno (como las ausencias), a menudo con aura previa (un olor) y automatismos (' + pag(20, 'pág. 20') + '). No hay ningún error: precisamente por no convulsionar pasan desapercibidas.' },
    ],
    examen: [
      { id: 'mnv-e1', corto: 'tabla 46.1', tipo: 'test', fuente: 'mn-tabla-46-1',
        enunciado: 'Según la Tabla 46.1, ¿en qué situación es más frecuente el estado epiléptico?',
        opciones: [
          { t: 'Traumatismo craneal, 15-25 %, la situación con más estado epiléptico', porque: 'El traumatismo craneal tiene 15-25 %, por debajo del 30 % de la isquemia. Un paciente con isquemia cerebral tiene más riesgo de estado epiléptico (30 %) y no lo vigilarías tanto.' },
          { t: 'Lesión cerebral isquémica, 30 %', ok: true },
          { t: 'Encefalitis, 20 %', porque: 'En la encefalitis son más frecuentes las convulsiones (35-45 %) que el estado epiléptico (20 %). Confundir las dos columnas lleva a infravalorar la isquemia.' }],
        explicacion: 'Tabla 46.1: <span class="hl-rojo">lesión isquémica 30 %</span>, traumatismo craneal 15-25 %, encefalitis 20 %, hemorragia subaracnoidea 15 %, hemorragia intracerebral 10-20 % y sin enfermedad neurológica <1 % (' + pag(19, 'pág. 19') + ').' },
      { id: 'mnv-e2', corto: 'ictus y crisis', tipo: 'test', fuente: 'mn-tabla-46-1 · mn-isq-convulsiones',
        enunciado: '¿Qué dice el libro del porcentaje de pacientes con ictus isquémico agudo que tienen convulsiones o una crisis sintomática en la primera semana?',
        opciones: [
          { t: 'Solo 2-5 %, según la Tabla 46.1', porque: 'Es solo una de las dos cifras del libro; el capítulo 47 dice «alrededor del 20 %». Quedarte con una como si fuera la única es elegir ganadora donde el libro no lo hace.' },
          { t: 'Solo alrededor del 20 %, según el capítulo 47', porque: 'Es la otra de las dos cifras. El libro no concilia ninguna, así que no se puede decir que una sea la correcta.' },
          { t: 'El libro da dos cifras distintas (2-5 % y alrededor del 20 %) y no las concilia', ok: true }],
        explicacion: 'La Tabla 46.1 da un <span class="hl">2-5 %</span> (' + pag(19, 'pág. 19') + ') y el capítulo 47 dice que <span class="hl">alrededor del 20 %</span> tiene una crisis sintomática esa semana (' + pag(41, 'pág. 41') + '). Se muestran las dos.',
        nota: '<b>Las fuentes discrepan.</b> Tabla 46.1 (' + pag(19, 'pág. 19') + ') frente a cap. 47 (' + pag(41, 'pág. 41') + '); el libro no las concilia.' + enFicha('mn-convulsiones', 'mn-tabla-46-1') },
      { id: 'mnv-e3', corto: 'la más frecuente', tipo: 'test', fuente: 'mn-tabla-46-2',
        enunciado: 'Un estado epiléptico no convulsivo, ¿cómo se manifiesta con más frecuencia (Tabla 46.2)?',
        opciones: [
          { t: 'Con coma, en el 22 %, la forma más llamativa', porque: 'El coma es frecuente, pero la confusión lo supera con mucho. Buscar solo al paciente en coma dejaría sin diagnosticar al confuso.' },
          { t: 'Con letargia, en el 21 %', porque: 'Es casi igual que el coma y también menor que la confusión. Esperar un paciente aletargiado hace pasar por alto al que solo está confuso.' },
          { t: 'Con confusión, en el 49 %', ok: true }],
        explicacion: 'Tabla 46.2 (105 casos): <span class="hl-rojo">confusión 49 %</span>, coma 22 %, letargia 21 %, agitación o delirio 8 %; la alteración de la consciencia aparece en cerca del 80 % (' + pag(21, 'pág. 21') + ').' },
      { id: 'mnv-e4', corto: 'definición de SE', tipo: 'test', fuente: 'mn-conv-se',
        enunciado: 'Definición clásica de estado epiléptico en el adulto.',
        opciones: [
          { t: '≥5 minutos de actividad continua, o dos o más crisis sin recuperar la consciencia entre ellas', ok: true },
          { t: '≥30 minutos de crisis continua', porque: 'Los 30 minutos son el tiempo a partir del cual puede haber lesión neuronal permanente, no la definición. Esperarlos retrasa el tratamiento.' },
          { t: 'Dos crisis en una hora, aunque se recupere la consciencia', porque: 'La definición exige no recuperar la consciencia entre crisis. Tratar de estado epiléptico dos crisis separadas sedaría sin necesidad.' }],
        explicacion: 'Definición clásica: <span class="hl-purpura">≥5 minutos de actividad epiléptica continua, o dos o más crisis sin recuperar la consciencia entre ellas</span> (' + pag(20, 'pág. 20') + '). Los 30 minutos son el umbral de la lesión neuronal (' + pag(21, 'pág. 21') + ').' },
    ],
    casos: [
      { id: 'mnv-saturnina', titulo: 'Saturnina, 68 años: la confusión que no era delirio', corto: 'Caso · Saturnina', sub: 'hemorragia intracerebral lobar; 65 kg',
        paciente: { Edad: '68 años', Peso: '65 kg', Antecedentes: 'Hipertensión', Motivo: 'Hemorragia intracerebral lobar' },
        pasos: [
          { momento: 'Día 3 · 11:00', datos: { Estado: 'Confusa, fluctuante; sacudidas irregulares de la mano derecha', Constantes: 'T 37,2 °C', Analítica: 'Na⁺ 139 mmol/L, glucosa 126 mg/dL' }, nuevo: ['Estado', 'Constantes', 'Analítica'],
            calculadora: { ir: 'mn-cam-calc', nombre: 'CAM-ICU' },
            pregunta: { id: 'mnv-s1', tipo: 'test', fuente: 'mn-tabla-46-1 · mn-conv-pensar',
              enunciado: 'El CAM-ICU sale positivo. Pero tiene una hemorragia intracerebral. ¿Qué haces?',
              opciones: [
                { t: 'Es delirio: haloperidol y reorientar', porque: 'El delirio explica la confusión, pero no las sacudidas ni la lesión cerebral. Sedarla con un neuroléptico taparía una crisis que sigue en marcha.' },
                { t: 'El CAM-ICU positivo no excluye una crisis: con lesión cerebral (convulsiones en el 20-30 %), pensar en ella', ok: true },
                { t: 'Esperar: sin convulsión generalizada no hay crisis', porque: 'La consciencia alterada es justo la forma de presentarse del estado no convulsivo. Esperar la convulsión la deja sin tratar.' }],
              explicacion: 'Tabla 46.1: hemorragia intracerebral, <span class="hl-rojo">convulsiones 20-30 %</span> (' + pag(19, 'pág. 19') + '). Hay que <span class="hl">pensar en crisis no convulsivas</span> en cualquier paciente de UCI con la consciencia alterada (' + pag(21, 'pág. 21') + ').',
              nota: NOTA_HIC } },
          { momento: 'Día 3 · 11:15', datos: { Plan: 'Apuntes del R1' }, nuevo: ['Plan'],
            pregunta: { id: 'mnv-s2', tipo: 'error', fuente: 'mn-conv-movimientos · mn-conv-eeg · mn-hic-otras',
              enunciado: 'Plan del R1 para Saturnina. Puede haber 0, 1 o 2 errores: encuéntralos.',
              frases: [
                { t: 'Las mioclonías confirman que es una crisis.', mal: true, c: 'La mioclonía <span class="hl">no siempre es una crisis</span>: no va con descargas rítmicas en el EEG (pág. 20).' },
                { t: 'Pido un EEG de rutina y, si es normal, la descarto.', mal: true, c: 'El intermitente encuentra crisis en el <span class="hl">4-8 %</span> frente al <span class="hl">16 %</span> del continuo (pág. 21); en la hemorragia intracerebral, EEG continuo 24-36 h (pág. 45).' },
                { t: 'Glucosa y sodio normales: no es la causa metabólica.' },
                { t: 'No inicio profilaxis anticonvulsiva previa.' }],
              explicacion: 'Dos fallos: la mioclonía no basta para llamarlo crisis y un EEG corto normal no descarta nada. Sin profilaxis anticonvulsiva en la hemorragia intracerebral, pero con EEG continuo 24-36 h si la consciencia está alterada (' + pag(45, 'pág. 45') + ').',
              nota: NOTA_HIC } },
          { momento: 'Día 3 · 14:00', datos: { EEG: 'Continuo: descargas rítmicas continuas' }, nuevo: ['EEG'],
            pregunta: { id: 'mnv-s3', tipo: 'test', fuente: 'mn-conv-se · mn-conv-pensar',
              enunciado: 'El EEG continuo muestra descargas rítmicas continuas: estado epiléptico no convulsivo. ¿Qué haces?',
              opciones: [
                { t: 'Observar: si no convulsiona, no hay riesgo de lesión y puede esperarse a ver cómo evoluciona', porque: 'Más de 30 minutos de crisis pueden dejar lesión neuronal permanente, convulsione o no. Observar sobre una hemorragia ya presente es sumar daño.' },
                { t: 'Tratarlo con los mismos pasos del estado epiléptico, sabiendo que se logra menos éxito', ok: true },
                { t: 'Subir la sedación para que deje de descargar', porque: 'Los pasos empiezan por benzodiacepinas y un anticonvulsivo no sedante; la sedación sin más tapa la clínica pero no corta la descarga que muestra el EEG.' }],
              explicacion: 'El tratamiento está pensado para el generalizado convulsivo, pero <span class="hl">se usa igual en el no convulsivo, con menos éxito</span> (' + pag(21, 'pág. 21') + ').' } },
          { momento: 'Día 3 · 14:20 · giro', datos: { Tratamiento: 'Lorazepam 4 mg IV, repetido a los 5 min', EEG: 'Sin cambios' }, nuevo: ['Tratamiento', 'EEG'],
            calculadora: { ir: 'mn-se-calc', nombre: 'Dosis por peso (Tabla 46.3)' },
            pregunta: { id: 'mnv-s4', tipo: 'test', fuente: 'mn-tabla-46-3 · mn-se-paso2', origen: 'ficha; la cuenta, con el peso del caso (ilustrativo)',
              enunciado: 'Recibió lorazepam 4 mg, repetido a los 5 minutos, y el EEG sigue igual. Pesa 65 kg. ¿Cuál es el paso 2 con levetiracetam?',
              opciones: [
                { t: 'Levetiracetam 60 mg/kg, unos 3.900 mg (máx. 4.500)', ok: true },
                { t: 'Fenitoína oral cargada en 24 h, para evitar la vía IV', porque: 'La vía oral no corta un estado: la Tabla 46.3 da fármacos IV con máximo por dosis. Esperar a que haga efecto deja la descarga continua.' },
                { t: 'Un tercer bolo de lorazepam hasta que ceda la descarga', porque: 'Se repite una sola vez; un tercio de los casos no responde a las benzodiacepinas. Insistir retrasa el paso 2 mientras continúa la descarga.' }],
              explicacion: '60 mg/kg × 65 kg = <span class="hl-verde">3.900 mg</span>, por debajo del máximo de 4.500 mg por dosis (' + pag(22, 'pág. 22') + '). Tras la benzodiacepina, un anticonvulsivo no sedante: levetiracetam, fosfenitoína o valproico son equivalentes (' + pag(22, 'pág. 22') + ').' } },
          { momento: 'Día 4 · repaso', datos: { Pregunta: '¿Por qué se habría escapado?' }, nuevo: ['Pregunta'],
            pregunta: { id: 'mnv-s5', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-conv-eeg · mn-tabla-46-2',
              enunciado: 'Saturnina no tenía convulsión visible. ¿Por qué se habría escapado el diagnóstico?',
              puntos: [
                'La <span class="hl">consciencia alterada</span> es la manifestación de cerca del 80 % de los estados no convulsivos, y se confunde con delirio.',
                'Con EEG <span class="hl-azul">intermitente</span> solo se ve en el 4-8 %, frente al 16 % del continuo.'],
              explicacion: 'Por eso: consciencia alterada en la UCI, pensar en crisis (' + pag(21, 'pág. 21') + ').' } },
        ],
        lleva: [
          'Consciencia alterada en la UCI: piensa en crisis, y más si hay lesión cerebral.',
          'EEG continuo encuentra el 16 %; los registros intermitentes, el 4-8 %.',
          'La lesión cerebral, no la gravedad del shock, pone el riesgo de convulsionar.'],
        volver: { nombre: 'Cuánto se encuentra', ancla: 'mn-conv-eeg', modelo: visual('mn-convulsiones', '👁️ Qué se ve de la crisis en la vista Visual') } },
    ],
    profundizar: [
      { id: 'mn-conv-se', titulo: 'Los unos 20 tipos de estado epiléptico' },
      { id: 'mn-hic-otras', titulo: 'Hemorragia intracerebral: EEG continuo 24-36 h' },
    ],
  },

  /* =================================================================================================
     Estado epiléptico: tratamiento (págs. 21-23)
     ================================================================================================= */
  'mn-estado-epileptico': {
    entrada: 'Tres pasos contra el reloj: benzodiacepina, anticonvulsivo no sedante y, si no cede, anestésico con el paciente intubado.',
    guia: [
      { id: 'mns-g1', corto: 'lorazepam', tipo: 'test', fuente: 'mn-se-diazepam',
        enunciado: 'Para cortar un estado epiléptico, ¿por qué el libro prefiere lorazepam al diazepam IV?',
        opciones: [
          { t: 'Porque el diazepam no es eficaz en el estado epiléptico convulsivo generalizado', porque: 'Sí es eficaz. Descartarlo por ineficaz lleva a no usarlo ni cuando es lo único que hay.' },
          { t: 'Porque sale rápido del cerebro y aumenta el riesgo de que la crisis recurra', ok: true },
          { t: 'Porque el diazepam solo se da por vía oral', porque: 'Existe el diazepam IV y el libro lo menciona. Con esa idea, esperarías la vía oral en un paciente que no puede tragar.' }],
        explicacion: 'El diazepam IV es eficaz, pero <span class="hl">sale rápido del cerebro</span> y aumenta el riesgo de recurrencia (' + pag(21, 'pág. 21') + '). El lorazepam actúa en unos 2 minutos y dura 6-12 h.' },
      { id: 'mns-g2', corto: 'sin vía IV', tipo: 'test', fuente: 'mn-se-midazolam',
        enunciado: 'Un paciente convulsiona en la calle y no hay vía IV. ¿Qué benzodiacepina das?',
        opciones: [
          { t: 'Midazolam IM, 10 mg, tan eficaz como el lorazepam IV', ok: true },
          { t: 'Lorazepam IV: hay que canalizar antes de tratar a este paciente', porque: 'Canalizar mientras la crisis sigue retrasa el tratamiento. Una crisis de más de 30 minutos puede dejar daño neuronal permanente.' },
          { t: 'Esperar a que ceda sola antes de dar nada', porque: 'Con la crisis ≥5 minutos ya es estado epiléptico y el tiempo cuenta; esperar solo sirve para sumar minutos.' }],
        explicacion: 'El midazolam puede darse IV o <span class="hl">IM</span> (0,15 mg/kg o 10 mg) y el IM es tan eficaz como el lorazepam IV: útil cuando no hay vía (' + pag(21, 'págs. 21') + '-' + pag(22, '22') + ').' },
      { id: 'mns-g3', corto: 'fosfenitoína', tipo: 'test', fuente: 'mn-se-fosfenitoina',
        enunciado: '¿Por qué la fosfenitoína puede infundirse tres veces más rápido que la fenitoína?',
        opciones: [
          { t: 'Porque se une menos a las proteínas del plasma y por eso llega antes al cerebro', porque: 'El libro no da esa razón. Pasar por alto la causa real lleva a infundir fenitoína deprisa y producir hipotensión y depresión cardíaca.' },
          { t: 'Porque no lleva propilenglicol: deprime menos el corazón y baja menos la tensión', ok: true },
          { t: 'Porque es un sedante de acción más rápida que la fenitoína', porque: 'No es sedante: el paso 2 es de anticonvulsivos no sedantes. Esperar sedación como señal de efecto confunde la respuesta.' }],
        explicacion: 'Es un profármaco hidrosoluble <span class="hl">sin propilenglicol</span>: menos depresión cardíaca e hipotensión que la fenitoína, y se infunde tres veces más rápido (' + pag(22, 'pág. 22') + ').' },
      { id: 'mns-g4', corto: 'antes del paso 3', tipo: 'test', fuente: 'mn-se-refractario',
        enunciado: 'El estado sigue tras la benzodiacepina y un anticonvulsivo. Vas a dar un anestésico. ¿Qué haces antes?',
        opciones: [
          { t: 'Pedir primero un EEG y decidir después', porque: 'El EEG continuo se aconseja, pero el libro lo pone junto al anestésico, no como requisito previo. Esperarlo retrasaría el tratamiento de un paciente que ya lleva muchos minutos en crisis (lectura del plan).' },
          { t: 'Dar el bolo en ventilación espontánea para no tener que intubarlo', porque: 'Todos los fármacos de la Tabla 46.4 deprimen la ventilación en dosis recomendadas: sin intubar, la depresión respiratoria será el siguiente problema.' },
          { t: 'Intubarlo y ventilarlo, porque todos deprimen la respiración', ok: true }],
        explicacion: 'Se intuba y se ventila <span class="hl-rojo">antes</span>, porque todos deprimen la respiración en las dosis recomendadas (' + pag(23, 'pág. 23') + '). El EEG continuo también se aconseja, y la consulta con neurología crítica o epileptología (' + pag(23, 'pág. 23') + ').' },
      { id: 'mns-g5', corto: 'propofol y 48 h', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-tabla-46-4',
        enunciado: 'En la Tabla 46.4, el propofol tiene un techo de 15 mg/kg/h. ¿Qué cambia pasadas 48 horas?',
        puntos: [
          'El techo baja de 15 a <span class="hl-rojo">5 mg/kg/h</span> si la perfusión dura más de 48 h.',
          'Coincide con el <span class="hl-azul">umbral del síndrome de infusión de propofol</span> del cap. 6 (>5 mg/kg/h durante más de 48 h).'],
        explicacion: 'Techo de la Tabla 46.4 (' + pag(23, 'pág. 23') + '); el umbral del síndrome de infusión de propofol (>5 mg/kg/h durante más de 48 h) está en el ' + '<a class="biblio-link" href="docs/marino-2024-practicas-monitorizacion-caps5-9.pdf#page=28" target="_blank" rel="noopener">cap. 6, PDF pág. 28</a>' + '.' },
    ],
    examen: [
      { id: 'mns-e1', corto: 'dosis máxima', tipo: 'test', fuente: 'mn-tabla-46-3',
        enunciado: '¿Cuál es la dosis máxima por dosis de levetiracetam en el estado epiléptico?',
        opciones: [
          { t: '4.500 mg por dosis', ok: true },
          { t: '3.000 mg', porque: 'Es el máximo del ácido valproico. Quedarte corto con el levetiracetam (60 mg/kg) infradosifica a cualquier paciente de más de 50 kg.' },
          { t: '1.500 mg por dosis, como la fosfenitoína', porque: 'Es el máximo de la fosfenitoína (en equivalentes de fenitoína). Daría una dosis muy baja de levetiracetam y el estado seguiría.' }],
        explicacion: 'Tabla 46.3: <span class="hl-verde">levetiracetam 60 mg/kg, máx. 4.500 mg</span>; fosfenitoína 20 mg EF/kg, máx. 1.500 mg EF; valproico 40 mg/kg, máx. 3.000 mg (' + pag(22, 'pág. 22') + ').' },
      { id: 'mns-e2', corto: 'valproico', tipo: 'test', fuente: 'mn-se-valproico',
        enunciado: '¿Qué efecto adverso debe vigilarse con el ácido valproico?',
        opciones: [
          { t: 'Hipotensión', porque: 'La hipotensión es el problema de la fenitoína (por el propilenglicol), no del valproico. Vigilar la tensión y no el amonio dejaría pasar la encefalopatía.' },
          { t: 'Hiperamonemia, con riesgo de encefalopatía (40 %)', ok: true },
          { t: 'Depresión respiratoria', porque: 'El paso 2 es de fármacos no sedantes; la depresión respiratoria es de las benzodiacepinas y los anestésicos del paso 3. Mirar solo la ventilación deja pasar el amonio.' }],
        explicacion: 'Tiene pocos efectos adversos, pero hay un <span class="hl-rojo">40 % de riesgo de hiperamonemia</span>, que puede producir encefalopatía (' + pag(23, 'pág. 23') + ').' },
      { id: 'mns-e3', corto: 'el paso 2', tipo: 'test', fuente: 'mn-se-paso2',
        enunciado: 'Con levetiracetam, fosfenitoína o valproico, ¿cuántos estados convulsivos se cortan?',
        opciones: [
          { t: 'Alrededor del 90 %, y no son equivalentes entre sí', porque: 'El libro dice la mitad. Con una expectativa del 90 % no estarías preparado para el paso 3 en cuanto falle el primero.' },
          { t: 'Cerca de un tercio', porque: 'Un tercio es la fracción que no responde a las benzodiacepinas, no la que corta el paso 2. Eso te haría cambiar de fármaco demasiado pronto.' },
          { t: 'Alrededor de la mitad, y los tres son equivalentes', ok: true }],
        explicacion: 'Los tres son equivalentes al terminar el estado, lo que ocurre en <span class="hl">cerca de la mitad</span> de los casos; el levetiracetam se prefiere por tener menos efectos adversos (' + pag(22, 'pág. 22') + ').' },
      { id: 'mns-e4', corto: 'mortalidad', tipo: 'test', fuente: 'mn-se-mortalidad',
        enunciado: '¿Cuál es la mortalidad hospitalaria del estado epiléptico refractario?',
        opciones: [
          { t: 'Hasta el 21 %, igual que el convulsivo', porque: 'Es la del generalizado convulsivo. Con esa cifra la familia del refractario recibiría un pronóstico demasiado optimista.' },
          { t: 'Unos 50 %', porque: 'Es la del generalizado no convulsivo. Aplicarla al refractario infravalora la cifra más alta, hasta el 61 %.' },
          { t: 'Hasta el 61 %', ok: true }],
        explicacion: 'Mortalidad hospitalaria: hasta <span class="hl-rojo">21 %</span> en el generalizado convulsivo, unos 50 % en el no convulsivo y <span class="hl-rojo">hasta 61 %</span> en el refractario (' + pag(23, 'pág. 23') + ').' },
      { id: 'mns-e5', corto: 'dosis de lorazepam', tipo: 'test', fuente: 'mn-se-lorazepam · mn-tabla-46-3',
        enunciado: '¿Qué dosis de lorazepam da el libro?',
        opciones: [
          { t: 'Solo 4 mg, sin límite de repeticiones', porque: 'El libro permite repetir una vez, no sin límite. Encadenar dosis eleva el riesgo de depresión respiratoria antes del paso 2.' },
          { t: 'El texto: 0,05-0,1 mg/kg (o 4 mg), repetible una vez; la tabla: 0,1 mg/kg (o 4 mg), repetir a los 5 min', ok: true },
          { t: 'Siempre 0,1 mg/kg sin tope, repetido a los 2 min', porque: 'La tabla da «0,1 mg/kg (o 4 mg)», que la calculadora de la ficha lee como tope de 4 mg, y se repite a los 5 min, no a los 2 (2 min es la duración de la infusión). Podría pasarse de dosis en un paciente grande.' }],
        explicacion: 'El texto da <span class="hl">0,05-0,1 mg/kg (o 4 mg)</span> IV en 2 min, repetible una vez (' + pag(21, 'pág. 21') + '); la Tabla 46.3, 0,1 mg/kg (o 4 mg) y repetir a los 5 min (' + pag(22, 'pág. 22') + ').',
        nota: '<b>Nota de fidelidad.</b> El libro imprime «0,1 mg/kg (or 4 mg)»; la calculadora de la ficha lee «4 mg» como tope (lectura de la ficha, no palabra del libro). La tabla añade el intervalo de 5 min al texto.' + enFicha('mn-estado-epileptico', 'mn-se-lorazepam') },
    ],
    casos: [
      { id: 'mns-tiburcio', titulo: 'Tiburcio, 57 años: la crisis que no paraba', corto: 'Caso · Tiburcio', sub: 'epilepsia que dejó la medicación; 80 kg',
        paciente: { Edad: '57 años', Peso: '80 kg', Antecedentes: 'Epilepsia', Motivo: 'Dejó la medicación' },
        pasos: [
          { momento: 'Urgencias · 09:00', datos: { Estado: 'Crisis tónico-clónica generalizada de 7 minutos' }, nuevo: ['Estado'],
            pregunta: { id: 'mns-t1', tipo: 'test', fuente: 'mn-conv-se',
              enunciado: 'La crisis lleva 7 minutos y no cede. ¿Es un estado epiléptico?',
              opciones: [
                { t: 'Sí: lleva ≥5 minutos de actividad epiléptica continua', ok: true },
                { t: 'Todavía no: hay que esperar a los 30 minutos', porque: 'Los 30 minutos son el umbral de lesión neuronal, no el de la definición. Esperarlos deja al paciente con la crisis sin tratar el tiempo suficiente para dañarse.' },
                { t: 'No, porque es un epiléptico conocido y sus crisis son las habituales', porque: 'La definición es por duración, no por diagnóstico previo. Dejarlo pasar por conocido retrasa el paso 1.' }],
              explicacion: 'Estado epiléptico: <span class="hl-purpura">≥5 minutos de actividad epiléptica continua</span> (' + pag(20, 'pág. 20') + '); los 30 minutos son el umbral de la lesión neuronal permanente (' + pag(21, 'pág. 21') + ').' } },
          { momento: 'Urgencias · 09:02', datos: { Vía: 'IV canalizada' }, nuevo: ['Vía'],
            calculadora: { ir: 'mn-se-calc', nombre: 'Dosis por peso (Tabla 46.3)' },
            pregunta: { id: 'mns-t2', tipo: 'test', fuente: 'mn-tabla-46-3 · mn-se-lorazepam', origen: 'ficha; la cuenta, con el peso del caso (ilustrativo)',
              enunciado: 'Pesa 80 kg. ¿Qué das primero?',
              opciones: [
                { t: 'Lorazepam 4 mg IV en 2 minutos, repetible a los 5 minutos', ok: true },
                { t: 'Diazepam 10 mg IV, repetido si no cede', porque: 'El diazepam es eficaz, pero sale rápido del cerebro y la crisis recurre; no es el preferido.' },
                { t: 'Levetiracetam 4.500 mg directamente, sin benzodiacepina previa', porque: 'El paso 1 son las benzodiacepinas. Saltarlo retrasa el fármaco que corta el estado en unos 2 minutos.' }],
              explicacion: 'Tabla 46.3: lorazepam <span class="hl-verde">0,1 mg/kg o 4 mg</span>; a 80 kg la calculadora lee «(or 4 mg)» como tope: 4 mg (' + pag(22, 'pág. 22') + ').' } },
          { momento: 'Urgencias · 09:12', datos: { Estado: 'Sigue en crisis tras dos dosis de lorazepam', Plan: 'Apuntes del R1' }, nuevo: ['Estado', 'Plan'],
            pregunta: { id: 'mns-t3', tipo: 'error', fuente: 'mn-tabla-46-3 · mn-se-fosfenitoina · mn-se-levetiracetam',
              enunciado: 'Plan del R1 para el paso 2. Puede haber 0, 1 o 2 errores: encuéntralos.',
              frases: [
                { t: 'Paso 2: fenitoína a 150 mg/min.', mal: true, c: 'Los <span class="hl">150 mg/min</span> son de la fosfenitoína, que va tres veces más rápido que la fenitoína (pág. 22).' },
                { t: 'Levetiracetam 60 mg/kg: 4.800 mg.', mal: true, c: 'La dosis máxima por dosis es <span class="hl">4.500 mg</span> (págs. 22-23).' },
                { t: 'Si cede, seguir con levetiracetam 1.000 mg IV cada 12 horas, con niveles.' },
                { t: 'Comprobar la glucemia capilar.' }],
              explicacion: 'Fosfenitoína 20 mg EF/kg a ≤150 mg/min, o levetiracetam 60 mg/kg con máximo de 4.500 mg; si hay respuesta, 1.000 mg cada 12 h ajustando por niveles (' + pag(22, 'pág. 22') + ').' } },
          { momento: 'Urgencias · 09:40', datos: { Estado: 'Más de 30 minutos; sigue tras levetiracetam 4.500 mg' }, nuevo: ['Estado'],
            pregunta: { id: 'mns-t4', tipo: 'test', fuente: 'mn-se-refractario',
              enunciado: 'Sigue tras la benzodiacepina y el levetiracetam. ¿Qué haces?',
              opciones: [
                { t: 'Es refractario: intubar y ventilar antes, y dar un anestésico de la Tabla 46.4', ok: true },
                { t: 'Dar valproico: el paso 2 tiene tres fármacos y solo se ha probado uno', porque: 'Los tres fármacos del paso 2 son equivalentes para cortar el estado, pero ya lleva más de 30 minutos y no cede tras la benzodiacepina y el levetiracetam: es un estado refractario, que pide dosis anestésicas. Repetir un fármaco equivalente retrasa la vía aérea segura mientras la crisis sigue.' },
                { t: 'Dar el anestésico sin intubar, para poder seguir vigilando la clínica del paciente', porque: 'Todos deprimen la respiración en las dosis recomendadas: sin vía aérea segura, la apnea sería la nueva urgencia.' }],
              explicacion: 'Un <span class="hl">10-15 %</span> es refractario a los pasos 1 y 2: dosis anestésicas, con intubación y ventilación antes, EEG continuo y neurología crítica (' + pag(23, 'pág. 23') + ').' } },
          { momento: 'Urgencias · 09:50', datos: { 'Vía aérea': 'Intubado y ventilado' }, nuevo: ['Vía aérea'],
            pregunta: { id: 'mns-t5', tipo: 'test', fuente: 'mn-tabla-46-4', origen: 'ficha; la cuenta, con el peso del caso (ilustrativo)',
              enunciado: 'Eliges propofol (80 kg). ¿Cómo empiezas?',
              opciones: [
                { t: 'Bolo de 80-160 mg (1-2 mg/kg) y 80 mg/h (1 mg/kg/h), subiendo hasta 15 mg/kg/h', ok: true },
                { t: 'Bolo de 800 mg y perfusión a 800 mg/h, para frenar la crisis cuanto antes y luego bajar la dosis', porque: 'Eso son 10 mg/kg: diez veces el bolo y la perfusión de la tabla. Habría hipotensión grave sin necesidad.' },
                { t: 'Perfusión de 5 mg/kg/h desde el principio, sin bolo', porque: 'La tabla empieza con bolo y 1 mg/kg/h y sube según respuesta. Saltarse el bolo alarga el tiempo en crisis.' }],
              explicacion: 'Propofol: bolo 1-2 mg/kg (<span class="hl-verde">80-160 mg</span>) y perfusión 1 mg/kg/h (80 mg/h), subiendo hasta <span class="hl-verde">15 mg/kg/h</span> (' + pag(23, 'pág. 23') + '). Con EEG continuo y neurología.' } },
          { momento: 'Día 3 · hora 52 · giro', datos: { Tratamiento: 'Propofol a 8 mg/kg/h desde hace más de 48 h' }, nuevo: ['Tratamiento'],
            pregunta: { id: 'mns-t6', tipo: 'test', fuente: 'mn-tabla-46-4',
              enunciado: 'Sigue con propofol a 8 mg/kg/h pasadas 48 horas. ¿Qué haces?',
              opciones: [
                { t: 'Subir a 10 mg/kg/h: el techo del propofol es 15 mg/kg/h', porque: 'El techo de 15 es para menos de 48 h; después es 5. Con 10 mg/kg/h pasadas 48 h se acumularía riesgo de síndrome de infusión de propofol.' },
                { t: 'Seguir igual: 8 mg/kg/h sigue por debajo del techo de 15 mg/kg/h y la crisis aún no cede', porque: 'Pasadas 48 h el techo es 5 mg/kg/h; 8 lo supera y expone al síndrome de infusión de propofol.' },
                { t: 'Bajar a ≤5 mg/kg/h, el techo del propofol tras 48 h', ok: true }],
              explicacion: 'Pasadas 48 h el techo del propofol es de <span class="hl-rojo">5 mg/kg/h</span>, que coincide con el umbral del síndrome de infusión de propofol; 8 lo supera. La Tabla 46.4 solo fija ese techo (' + pag(23, 'pág. 23') + '); también ofrece midazolam y pentobarbital como otros anestésicos, pero no manda cambiar. El umbral del síndrome de infusión de propofol está en el ' + '<a class="biblio-link" href="docs/marino-2024-practicas-monitorizacion-caps5-9.pdf#page=28" target="_blank" rel="noopener">cap. 6, PDF pág. 28</a>' + ' (>5 mg/kg/h más de 48 h).' } },
          { momento: 'Día 3 · familia', datos: { Pregunta: '¿Qué le cuentas a la familia?' }, nuevo: ['Pregunta'],
            pregunta: { id: 'mns-t7', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-se-mortalidad · mn-se-paso2',
              enunciado: 'La familia pregunta por el pronóstico. ¿Qué le cuentas?',
              puntos: [
                'La mortalidad hospitalaria del refractario llega <span class="hl-rojo">hasta el 61 %</span>.',
                'Una crisis de más de 30 minutos <span class="hl">puede dejar una lesión neuronal permanente</span>, por eso hay que cortarla pronto.'],
              explicacion: 'Mortalidad: hasta 21 % convulsivo, unos 50 % no convulsivo y hasta 61 % refractario (' + pag(23, 'pág. 23') + '); la lesión neuronal, a partir de los 30 minutos (' + pag(21, 'pág. 21') + ').' } },
        ],
        lleva: [
          '≥5 minutos ya es estado: benzodiacepina primero, sin esperar a los 30.',
          'Máximos del paso 2: levetiracetam 4.500 mg, fosfenitoína 1.500 mg EF, valproico 3.000 mg.',
          'Intubar antes del paso 3; el propofol, ≤5 mg/kg/h tras 48 horas.'],
        volver: { nombre: 'Tabla 46.4', ancla: 'mn-tabla-46-4', modelo: visual('mn-estado-epileptico', '👁️ La escalera del estado epiléptico (vista Visual)') } },
    ],
    profundizar: [
      { id: 'mn-tabla-46-4', titulo: 'Tabla 46.4 — Pentobarbital y midazolam en el refractario' },
      { id: 'mn-se-refractario', titulo: 'Otros fármacos del refractario: tiopental, fenobarbital y ketamina' },
      { id: 'mn-se-fosfenitoina', titulo: 'Fosfenitoína en el fallo hepático' },
    ],
  },
};
