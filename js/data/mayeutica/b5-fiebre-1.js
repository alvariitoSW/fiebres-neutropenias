// Mayéutica de las fichas del bloque 5, grupo C · La fiebre en la UCI (Marino cap. 44), parte 1: ficha 13
// ma-fiebre-basicos y ficha 10 ma-infecciones-nosocomiales (con el caso de Celestino). La pinta js/core/mayeutica.js
// (botón «Estudiar» del interruptor de cada ficha). Datos puros. La parte 2 (sonda y candiduria) está en b5-fiebre-2.js.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-abdomen.html) y de su PDF
// (docs/marino-2024-abdomen-temperatura-caps39-44.pdf, cap. 44 = págs. 59-72); cada pregunta dice dónde con `fuente`
// (ids `ma-…` de la ficha; los de otras fichas salen como enlace cruzado). Las cifras de los pacientes se inventan y se marcan
// con `origen`. Formato: el de b1-fluidos.js. `modelo: { termostatoVivo: 'fiebre:2' }` abre el termostato vivo en ese paso.

const visual = (tab, texto) => ({ especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab, enVisual: '', texto });

export const MAYEUTICA_FIEBRE_1 = {
  /* =================================================================================================
     Ficha 13 · Fiebre en la UCI: medirla, definirla y sus causas no infecciosas (págs. 59-64)
     ================================================================================================= */
  'ma-fiebre-basicos': {
    entrada: 'Con qué termómetro decides, cuánto es fiebre, por qué la fiebre es inflamación y no infección, y qué causas no infecciosas hay que conocer.',
    guia: [
      { id: 'fbr-g1', corto: 'el termómetro', tipo: 'test', fuente: 'ma-fiebre-termometria',
        enunciado: 'Un paciente con taquipnea y un catéter de arteria pulmonar con termistor. ¿Con qué medida decides si tiene fiebre?',
        opciones: [
          { t: 'Con la temperatura central del termistor; sin él, oral o rectal', ok: true },
          { t: 'Con la axilar o la timpánica: son rápidas y, en la práctica, bastan', porque: 'Marino las considera de precisión no aceptable: tomarías decisiones, como pedir cultivos o retirar antibióticos, con una cifra que no es fiable.' },
          { t: 'Con la oral, que coincide con la central', porque: 'Con taquipnea la oral puede ser 0,5 °C más baja que la central: una central de 38,3 °C se leería 37,8 °C y no pedirías el estudio de la fiebre.' }],
        explicacion: 'Lo mejor es la <span class="hl">temperatura central continua</span>: catéter con termistor en la arteria pulmonar, el esófago o la vejiga. Si no hay, oral o rectal (la oral, <span class="hl-rojo">0,5 °C más baja</span> con taquipnea). Timpánica, temporal y axilar: <span class="hl-rojo">no tomar decisiones</span> con ellas.',
        origen: 'ficha · la resta 38,3 − 0,5 es la cuenta del ejemplo' },
      { id: 'fbr-g2', corto: 'cuánto es fiebre', tipo: 'test', fuente: 'ma-fiebre-def · ma-tconv-calc', calculadora: { ir: 'ma-tconv-calc', nombre: 'Conversor °C ↔ °F y ¿es fiebre?' }, modelo: [{ termostatoVivo: 'juega' }, visual('ma-fiebre-basicos', '👁️ Cuánto es fiebre (vista Visual)')],
        enunciado: 'Dos pacientes marcan 38,1 °C en la vejiga: el primero una sola vez y no es neutropénico; el segundo, neutropénico, lo mantiene durante 90 minutos. ¿Quién tiene fiebre según las guías?',
        opciones: [
          { t: 'Los dos: en la práctica cualquier cifra desde 38 °C ya se considera fiebre en la UCI', porque: 'Para el paciente no neutropénico el umbral es una sola medida de ≥38,3 °C. Con 38,1 °C una vez abrirías un estudio de fiebre que la guía no pide.' },
          { t: 'Solo el neutropénico: 38,0 °C mantenidos al menos 1 hora', ok: true },
          { t: 'Ninguno: en los dos hace falta ≥38,3 °C', porque: 'En el neutropénico basta 38,0 °C mantenido ≥1 h. Esperar a los 38,3 °C retrasaría el estudio y el antibiótico donde unas horas cuentan.' }],
        explicacion: 'Una sola medida de <span class="hl-rojo">≥38,3 °C</span> es fiebre y merece estudio; en el <span class="hl-rojo">neutropénico</span>, <span class="hl">38,0 °C mantenido al menos 1 hora</span>. La calculadora de la ficha lo aplica con 38,1 °C.' },
      { id: 'fbr-g3', corto: 'tirita con 37,1', tipo: 'test', fuente: 'ma-fiebre-adaptativa · ma-fiebre-def · inmuno-fiebre-fisiologia · ma-antipireticos', modelo: [{ termostatoVivo: 'fiebre:2' }, { termostatoVivo: 'fiebre:4' }],
        enunciado: 'Predice, y luego lo compruebas en el modelo: una paciente con la temperatura en 37,1 °C tirita, con la piel fría y cerrada. ¿Por qué tirita si no tiene calor?',
        opciones: [
          { t: 'El hipotálamo subió el ajuste: se cree frío y fabrica calor', ok: true },
          { t: 'Es hipertermia: ha fallado la regulación de la temperatura', porque: 'En la hipertermia el ajuste no se mueve y la temperatura pasa de largo. Aquí el termostato funciona y su ajuste está alto: si lo tratas como hipertermia, con medidas de enfriamiento, la tiritona se agrava.' },
          { t: 'Su temperatura real ya es de 39,6 °C y el termómetro marca mal', porque: 'El 39,6 °C es el ajuste, no la temperatura: el termómetro acierta. Dudar de él te haría perder el mecanismo.' }],
        explicacion: 'La fiebre es un <span class="hl-azul">termostato normal con el punto de ajuste alto</span>, no una avería. Mientras la temperatura (37,1 °C) esté por debajo del ajuste (39,6 °C), el cuerpo cierra la piel y tirita hasta alcanzarlo; en el paso 4 la temperatura iguala al ajuste y deja de tiritar. En la hipertermia, en cambio, la regulación está rota.',
        origen: 'ficha (termostato normal con ajuste alto, p. 61 y 45) · fisiología general: cierra la piel y tirita para llegar al ajuste · 37,1 y 39,6 °C, del modelo (paciente ilustrativo)' },
      { id: 'fbr-g4', corto: 'fiebre alta', tipo: 'test', fuente: 'ma-fiebre-inflamacion',
        enunciado: 'Un paciente tiene 39,8 °C y otro 38,4 °C. ¿Pesa más la fiebre de 39,8 °C para decir «es una infección»?',
        opciones: [
          { t: 'Sí: cuanto más alta es la fiebre, más probable es que haya una infección detrás', porque: 'Ni la presencia ni la altura de la fiebre se correlacionan con la infección. Pedirías antibióticos por la cifra y dejarías de buscar la causa inflamatoria no infecciosa.' },
          { t: 'Sí, pero solo por encima de 39 °C', porque: 'La ficha no da ningún corte: hay fiebres altas sin infección e infecciones graves sin fiebre. Con ese corte atribuirías infección a una fiebre inflamatoria.' },
          { t: 'No: ni la presencia ni la altura se correlacionan con infección o gravedad', ok: true }],
        explicacion: 'Las citocinas inflamatorias (pirógenos endógenos) actúan sobre el hipotálamo: <span class="hl">cualquier inflamación sistémica da fiebre</span>. Por eso <span class="hl-rojo">el 50 % de las fiebres de la UCI no tienen infección</span> y distinguirlo ahorra antibióticos.' },
      { id: 'fbr-g5', corto: 'atelectasia', tipo: 'test', fuente: 'ma-fiebre-postop · mar-img-44-2 · ma-hipertermia-farmacos',
        enunciado: 'Primer día tras cirugía cardíaca (100 pacientes, Figura 44.2): casi el 90 % de los febriles tienen atelectasia. ¿Es la atelectasia la causa de la fiebre?',
        opciones: [
          { t: 'Sí: casi todos los febriles tienen atelectasia en la radiografía', porque: 'Es una asociación, no una causa. Darías fisioterapia y antibiótico a una fiebre que es respuesta al daño tisular.' },
          { t: 'Sí, al menos la atelectasia lobar', porque: 'Una atelectasia lobar provocada en animales tampoco dio fiebre. Buscarías una causa que no existe y dejarías pasar la verdadera.' },
          { t: 'No: el 75 % de los que tienen atelectasia no tiene fiebre', ok: true }],
        explicacion: 'La atelectasia aparece en <span class="hl-rojo">más del 90 %</span> de las anestesias generales: es frecuente, no causa fiebre. En el estudio, casi el 90 % de los febriles la tenían, pero <span class="hl">el 75 % de los que la tenían no tenían fiebre</span>.' },
      { id: 'fbr-g6', corto: 'fiebre por fármacos', tipo: 'destapa', fuente: 'ma-fiebre-farmacos · ma-tabla-44-3-hallazgos', cuantas: 'son tres cosas',
        enunciado: 'Fiebre por fármacos: cuándo la sospechas, qué la acompaña y cómo la confirmas. Son tres cosas.',
        puntos: [
          'Se sospecha cuando <span class="hl">no hay otra causa</span>; empieza desde unos días hasta más de un mes después de empezar el fármaco.',
          'La acompañan <span class="hl-rojo">escalofríos (53 %)</span> e hipotensión (~20 %), que pueden parecer graves; la eosinofilia y el exantema faltan en más del 75 %.',
          'Se confirma <span class="hl-azul">retirando el fármaco</span>: la fiebre desaparece en 72 h.'],
        explicacion: 'Hipersensibilidad o idiosincrasia; cualquier fármaco puede darla (Tabla 44.3: anfotericina, carbamazepina, cefalosporinas, heparinas, penicilinas, fenitoína, procainamida, quinidina).',
        nota: '<b>Nota de fidelidad.</b> El texto dice «alrededor del 20 %» de hipotensión y la Tabla 44.3 da 18 %. Se reproducen las dos.' },
      { id: 'fbr-g7', corto: 'la nota del R1', tipo: 'error', fuente: 'ma-fiebre-postop · ma-fiebre-otras · ma-fiebre-termometria',
        enunciado: 'La nota de un R1 en el primer día de un posoperatorio de cirugía mayor. Encuentra los errores (0, 1 o 2).',
        frases: [
          { t: 'Fiebre de 38,5 °C en el termistor vesical el día 1: es frecuente tras cirugía mayor (15-40 %).' },
          { t: 'Es la respuesta al daño tisular y suele ceder en 24-48 h: de momento, sin antibiótico.' },
          { t: 'La atelectasia basal de la radiografía no la explica.' },
          { t: 'Compruebo el termostato del colchón de agua y del humidificador: lleva un minuto.' }],
        explicacion: 'No hay ningún error: es el único texto limpio del grupo. Cada frase sale de la ficha (Fiebre postoperatoria precoz e iatrogénica).' },
    ],
    examen: [
      { id: 'fbr-e1', corto: 'variación diaria', tipo: 'test', fuente: 'ma-fiebre-def',
        enunciado: '¿Cuánto puede variar la temperatura de una persona a lo largo del día, y cuándo está en su mínimo y su máximo?',
        opciones: [
          { t: 'Hasta 1,3 °C: mínimo a las 4-8 h y máximo a las 16-18 h', ok: true },
          { t: 'Hasta 1,3 °F: mínimo a las 4-8 h y máximo a las 16-18 h del día', porque: 'Confundes la unidad: 1,3 °C son 2,4 °F. Con 1,3 °F subestimarías la oscilación normal y llamarías fiebre a un ritmo del día.' },
          { t: 'Hasta 0,6 °C: mínimo a las 16-18 h, máximo a las 4-8 h', porque: 'Cifra demasiado corta y horas invertidas. Tomarías por fiebre variaciones normales y pedirías estudios sin motivo.' }],
        explicacion: 'La temperatura varía <span class="hl">hasta 1,3 °C (2,4 °F)</span>: mínimo de 4 a 8 h, máximo de 16 a 18 h.',
        origen: 'ficha · p. 60' },
      { id: 'fbr-e2', corto: 'oral con taquipnea', tipo: 'test', fuente: 'ma-fiebre-termometria',
        enunciado: 'En un paciente taquipneico sin termistor, la temperatura oral frente a la central es:',
        opciones: [
          { t: 'Hasta 0,5 °C más alta: sobreestima la fiebre del paciente taquipneico', porque: 'Es el sentido contrario. Pedirías cultivos por una fiebre que no existe, cuando el riesgo es no ver la que sí hay.' },
          { t: 'Igual: la boca refleja el centro del cuerpo', porque: 'Con taquipnea no: respirar deprisa enfría la boca. Te fiarías de una cifra que infravalora la fiebre.' },
          { t: 'Hasta 0,5 °C más baja: puede ocultar una fiebre', ok: true }],
        explicacion: 'La oral puede ser <span class="hl-rojo">0,5 °C más baja</span> que la central con taquipnea; por eso lo mejor es el termistor y, si no hay, oral o rectal con esa salvedad.' },
      { id: 'fbr-e3', corto: 'fiebre del día 1', tipo: 'test', fuente: 'ma-fiebre-postop',
        enunciado: 'Fiebre el primer día tras cirugía mayor. ¿Con qué frecuencia ocurre y cuál es su causa habitual?',
        opciones: [
          { t: 'En más del 90 %, por la atelectasia de la anestesia', porque: 'El 90 % es la frecuencia de atelectasia en las anestesias generales; la atelectasia es frecuente, pero no causa fiebre. Tratarías con antibiótico lo que se pasa solo.' },
          { t: 'En el 15-40 %, por la respuesta al daño tisular; cede en 24-48 h', ok: true },
          { t: 'En menos del 5 %, y casi siempre se debe a una infección de la herida quirúrgica', porque: 'La herida se infecta típicamente a los 5-7 días, no el día 1, donde casi nunca hay infección. Pedirías cultivos y antibiótico de entrada.' }],
        explicacion: 'Fiebre el primer día en el <span class="hl">15-40 %</span> de la cirugía mayor: respuesta al daño tisular, casi nunca hay infección, cede en <span class="hl-verde">24-48 h</span>.' },
      { id: 'fbr-e4', corto: 'fiebre no hemolítica', tipo: 'test', fuente: 'ma-fiebre-tev-transfusion · merino-riesgos',
        enunciado: 'La fiebre no hemolítica de una transfusión de hematíes aparece:',
        opciones: [
          { t: 'Durante la transfusión o en las 6 h siguientes', ok: true },
          { t: 'A los 3-5 días de la transfusión, por hemólisis del donante', porque: 'No es hemolítica: la causan anticuerpos del receptor contra leucocitos del donante. Esperar días hace atribuirla a otra cosa o confundirla con una reacción grave.' },
          { t: 'Solo con plaquetas, nunca con hematíes', porque: 'Con hematíes es la reacción adversa más frecuente; con plaquetas es infrecuente (~1 por 1.000 unidades de donante único).' }],
        explicacion: 'Es la reacción adversa más frecuente de los hematíes: <span class="hl-rojo">durante la transfusión o en las 6 h siguientes</span>, por anticuerpos del receptor contra leucocitos del donante; más en politransfundidos. Con plaquetas, ~1 por 1.000 unidades.' },
      { id: 'fbr-e5', corto: 'fármaco sin exantema', tipo: 'test', fuente: 'ma-fiebre-farmacos · ma-tabla-44-3-hallazgos',
        enunciado: 'Sospechas fiebre por fármacos. ¿Qué papel tienen la eosinofilia y el exantema?',
        opciones: [
          { t: 'Si faltan la eosinofilia y el exantema, descarto la fiebre por fármacos', porque: 'Faltan en más del 75 %: esperar a verlos haría que casi nunca la sospecharas y seguirías cultivando y dando antibióticos.' },
          { t: 'Pueden faltar: faltan en más del 75 % de los casos', ok: true },
          { t: 'La eosinofilia la confirma', porque: 'Solo el 22 % la tiene y no confirma nada: la confirmación es que la fiebre desaparece a las 72 h de retirarlo.' }],
        explicacion: 'Eosinofilia (22 %) y exantema (18 %) <span class="hl-rojo">faltan en más del 75 %</span>. Se confirma retirando el fármaco: desaparece en 72 h.' },
      { id: 'fbr-e6', corto: 'Tabla 44.2', tipo: 'test', fuente: 'ma-tabla-44-2',
        enunciado: 'Según la Tabla 44.2, ¿cuál de estas causas no infecciosas figura entre las «menos frecuentes»?',
        opciones: [
          { t: 'Abstinencia de alcohol o drogas', porque: 'Está entre las más frecuentes. Si la crees rara, no la buscarás en un paciente agitado y febril unos días después del ingreso.' },
          { t: 'Síndrome de Dressler (Tabla 44.2)', ok: true },
          { t: 'Lesión pulmonar inflamatoria (SDRA)', porque: 'También entre las más frecuentes: un SDRA es una fuente inflamatoria habitual de fiebre sin infección.' }],
        explicacion: 'Más frecuentes: postoperatoria precoz, tromboembolismo, fármacos, transfusiones, infarto de miocardio, abstinencia, lesión pulmonar inflamatoria, ictus isquémico. <span class="hl">Menos frecuentes</span>: insuficiencia suprarrenal, infarto intestinal, <span class="hl">síndrome de Dressler</span>, embolia grasa, lisis tumoral, hipertermia maligna, síndrome serotoninérgico, fiebre iatrogénica.' },
    ],
    casos: [
      { id: 'c5c0', titulo: 'Celestino, 66 años: la fiebre del primer día', corto: 'Caso · Celestino', sub: 'bypass coronario, UCI cardiotorácica, 78 kg',
        paciente: { Edad: '66 años', Peso: '78 kg', Motivo: 'bypass coronario con circulación extracorpórea', Vías: 'catéter venoso central yugular de tres luces desde quirófano', Profilaxis: 'cefazolina perioperatoria' },
        pasos: [
          { momento: 'Día 1, 07:00', datos: { 'Temperatura axilar': '37,8 °C', 'Temperatura vesical': '38,4 °C' }, nuevo: ['Temperatura axilar', 'Temperatura vesical'],
            pregunta: { id: 'c5c0-1', tipo: 'test', fuente: 'ma-fiebre-termometria · ma-fiebre-def', origen: 'ficha (central frente a periféricas; ≥38,3 °C) · las cifras del paciente son ilustrativas',
              enunciado: 'Primera mañana tras el bypass. La enfermera anota 37,8 °C en la axila; el termistor vesical marca 38,4 °C. ¿Con qué cifra decides y qué es?',
              opciones: [
                { t: 'La axilar de 37,8 °C: no es fiebre y no hay que hacer nada más', porque: 'Las periféricas tienen una precisión no aceptable; con ella dejarías pasar una fiebre de 38,4 °C que ya merece estudio.' },
                { t: 'La vesical de 38,4 °C: es fiebre, porque supera 38,3 °C en una medida central', ok: true },
                { t: 'La media de las dos, 38,1 °C: queda por debajo del umbral, así que sigo observando', porque: 'No se promedia una medida fiable con otra que no lo es; y el umbral de fiebre, ≥38,3 °C, se aplica a la central.' }],
              explicacion: 'Se decide con la <span class="hl">temperatura central</span> (arteria pulmonar, esófago o vejiga): una sola medida de <span class="hl-rojo">≥38,3 °C</span> es fiebre. La axilar no es fiable para tomar decisiones.' } },
          { momento: 'Día 1, 09:00', datos: { 'Temperatura vesical': '38,4 °C', FC: '96/min', PA: '128/74 mmHg', Leucocitos: '13.200/µl', Radiografía: 'atelectasia basal izquierda' }, nuevo: ['Temperatura vesical', 'FC', 'PA', 'Leucocitos', 'Radiografía'],
            pregunta: { id: 'c5c0-2', tipo: 'test', fuente: 'ma-fiebre-postop · mar-img-44-2', modelo: { termostatoVivo: 'fiebre' }, origen: 'ficha (15-40 %, 24-48 h) · las cifras del paciente son ilustrativas',
              enunciado: 'Primera mañana tras la cirugía. ¿A qué atribuyes la fiebre?',
              opciones: [
                { t: 'A la atelectasia de la radiografía: fisioterapia y antibiótico', porque: 'La atelectasia no da fiebre. Habrías dado un antibiótico sin indicación y, si la fiebre reaparece al sexto día, habrías ocultado su verdadera causa.' },
                { t: 'A una sepsis por catéter desde el primer día de la cirugía', porque: 'Es posible, pero no lo más probable el día 1; sin hemocultivos por delante no se demuestra, y empezarías antibióticos a ciegas.' },
                { t: 'A la respuesta inflamatoria al daño tisular de la cirugía', ok: true }],
              explicacion: 'Fiebre el primer día en el <span class="hl">15-40 %</span> de la cirugía mayor: respuesta al daño tisular, casi nunca hay infección y <span class="hl-verde">cede en 24-48 h</span>. La atelectasia de la radiografía es frecuente, no causa fiebre.' } },
          { momento: 'Día 1, mediodía', datos: {}, nuevo: [],
            pregunta: { id: 'c5c0-3', tipo: 'error', fuente: 'ma-fiebre-postop · ma-fiebre-inflamacion · ma-fiebre-otras',
              enunciado: 'La nota del R1 sobre Celestino. Encuentra los errores (0, 1 o 2).',
              frases: [
                { t: 'Temperatura vesical 38,4 °C: es fiebre (≥38,3 °C).' },
                { t: 'La atelectasia basal de la radiografía explica la fiebre: pauto fisioterapia y antibiótico.', mal: true, c: 'La <span class="hl-rojo">atelectasia no da fiebre</span>: el 75 % de las atelectasias no la tienen.' },
                { t: 'Si sube a 39,5 °C pensaré en una infección grave por la altura de la fiebre.', mal: true, c: '<span class="hl-rojo">Ni la presencia ni la altura de la fiebre</span> se correlacionan con la infección ni con su gravedad.' },
                { t: 'Compruebo también el termostato del colchón de agua: lleva un minuto.' }],
              explicacion: 'La fiebre del primer día es respuesta al daño tisular; la atelectasia es frecuente, no causa fiebre.' } },
          { momento: 'Día 1, noche', datos: {}, nuevo: [],
            pregunta: { id: 'c5c0-4', tipo: 'destapa', fuente: 'ma-fiebre-postop', cuantas: 'son tres cosas',
              enunciado: 'La enfermera de noche pregunta por qué no se ha pedido antibiótico. Tres rasgos de esta fiebre.',
              puntos: [
                'Es <span class="hl">frecuente</span>: el primer día en el 15-40 % de la cirugía mayor.',
                'Es la <span class="hl-azul">respuesta al daño tisular</span>: casi nunca hay infección.',
                'Se espera que <span class="hl-verde">ceda en 24-48 h</span>.'],
              explicacion: 'Si no cede o aparece más tarde, se busca otra causa.' } },
          { momento: 'Día 2 · el giro', datos: { 'Temperatura vesical': '37,3 °C', Tratamiento: 'ningún antipirético ni antibiótico' }, nuevo: ['Temperatura vesical', 'Tratamiento'],
            pregunta: { id: 'c5c0-5', tipo: 'test', fuente: 'ma-fiebre-postop · ma-antip-paracetamol · mar-tabla-6-3 · mt-paracetamol',
              enunciado: 'Ha bajado a 37,3 °C sin tratamiento. ¿Qué confirma?',
              opciones: [
                { t: 'Que el paracetamol que le dieron la bajó', porque: 'No se le dio ningún antipirético. Atribuirías a un fármaco lo que fue la evolución natural de la respuesta al daño tisular (24-48 h).' },
                { t: 'Que la fiebre postoperatoria precoz cede sola', ok: true },
                { t: 'Que la atelectasia se resolvió con fisioterapia', porque: 'La atelectasia no causa la fiebre, así que su resolución no explica la bajada; creerías que la fisioterapia la trató.' }],
              explicacion: 'La fiebre del primer día <span class="hl-verde">cede en 24-48 h por sí sola</span>, sin tratamiento.',
              nota: '<b>Nota de fuentes.</b> Dosis máxima de paracetamol: <b>3 g/día</b> en el cap. 44 (ficha de antipiréticos, que cita la FDA 2011) frente a <b>4 g/día</b> en Marino Fundamentos, cap. 6, y en Toxicología, cap. 52 (≤3 g con riesgo). Se muestran las dos; no se elige una.' } },
        ],
        lleva: [
          'La fiebre se decide con la temperatura central, no con la axilar.',
          'La atelectasia no da fiebre, y la altura de la fiebre no dice si hay infección.',
          'La fiebre del primer día es respuesta al daño tisular: se espera 24-48 h.'],
        volver: { nombre: 'Fiebre postoperatoria precoz', ancla: 'ma-fiebre-postop', modelo: { termostatoVivo: 'fiebre' } } },
    ],
    profundizar: [
      { id: 'ma-tabla-44-1', titulo: 'Tabla 44.1: conversor °C ↔ °F y sus fórmulas' },
      { id: 'ma-tabla-44-3-farmacos', titulo: 'Tabla 44.3: fármacos más implicados en la fiebre' },
      { id: 'ma-fiebre-tev-transfusion', titulo: 'Embolia pulmonar (fiebre hasta una semana) y plaquetas' },
      { id: 'ma-fuentes-fiebre', titulo: 'Figura 44.1: las nueve fuentes de fiebre nueva' },
    ],
  },

  /* =================================================================================================
     Ficha 10 · Fiebre en la UCI: infecciones nosocomiales y hemocultivos (págs. 64-69)
     ================================================================================================= */
  'ma-infecciones-nosocomiales': {
    entrada: 'Qué germen y qué antibiótico en la herida, qué signo delata la necrotizante, cuándo pensar en endocarditis o Candida, y cómo se hacen los hemocultivos.',
    guia: [
      { id: 'nsc-g1', corto: 'limpia o contaminada', tipo: 'test', fuente: 'ma-iso-que · ma-iso-tto',
        enunciado: 'Dos heridas con pus al sexto día: una tras una cirugía limpia y otra tras una perforación intestinal. ¿Qué germen y qué antibiótico para cada una?',
        opciones: [
          { t: 'Limpia: bacilos gramnegativos, pip-tazo. Contaminada: S. aureus, vancomicina por vía IV y desbridamiento', porque: 'Están al revés. Darías vancomicina a la herida contaminada, que queda con los gramnegativos aerobios sin cubrir, y pip-tazo a una limpia por S. aureus.' },
          { t: 'Limpia: S. aureus, vancomicina. Contaminada: gramnegativos, pip-tazo o cef. 3.ª + metronidazol', ok: true },
          { t: 'Las dos son por S. aureus y se tratan igual: vancomicina más desbridamiento', porque: 'En la contaminada predominan los bacilos gramnegativos aerobios: con vancomicina sola no los cubrirías.' }],
        explicacion: 'Infección de herida: típicamente a los 5-7 días (se cuenta hasta 30), <span class="hl">1-2 % en la limpia</span> (S. aureus) y <span class="hl">4-5 % en la contaminada</span> (gramnegativos). Desbridar y, si hay fiebre, antibiótico: vancomicina si S. aureus; en la abdominal contaminada, pip-tazo o cefalosporina de 3.ª + metronidazol.' },
      { id: 'nsc-g2', corto: 'la necrotizante', tipo: 'test', fuente: 'ma-iso-necrotizante',
        enunciado: 'En los primeros días de una herida, ¿qué signo debe hacerte sospechar una infección necrotizante?',
        opciones: [
          { t: 'Crepitación y ampollas en la piel, con un exudado lechoso y maloliente', porque: 'Son signos tardíos. Si esperas a verlos retrasas el desbridamiento urgente de una infección que se extiende rápido.' },
          { t: 'Un exudado lechoso y maloliente', porque: 'Aparece cuando ya se extiende. Llegarías tarde: el signo precoz es el dolor.' },
          { t: 'Dolor desproporcionado a la piel, con eritema y edema marcados', ok: true }],
        explicacion: 'Primeros días: eritema y edema marcados con <span class="hl-rojo">dolor desproporcionado</span> (lesión nerviosa isquémica); después, crepitación y ampollas. Desbridamiento urgente y amplio; con el Gram se elige: penicilina + clindamicina o carbapenémico si la cirugía fue profunda.' },
      { id: 'nsc-g3', corto: 'quién lleva eco', tipo: 'test', fuente: 'ma-endocarditis · umi-endocarditis',
        enunciado: '¿En qué bacteriemias estudias una endocarditis?',
        opciones: [
          { t: 'Solo si el paciente tiene una válvula protésica o una válvula ya conocida como anormal, sea cual sea el germen', porque: 'Es el criterio del estreptococo, el estafilococo y el enterococo con válvula anormal o protésica; con S. aureus no hace falta tener ninguna válvula enferma.' },
          { t: 'En estreptococo, estafilococo o enterococo con válvula anormal o protésica, y en todo S. aureus', ok: true },
          { t: 'En toda fiebre con hemocultivo positivo, sea cual sea el germen', porque: 'La ficha no lo pide: pedirías ecocardiogramas innecesarios en bacteriemias por otros gérmenes sin válvula de riesgo.' }],
        explicacion: 'Se estudia en <span class="hl">toda bacteriemia por estreptococo, estafilococo o enterococo con válvula anormal o protésica</span> y en <span class="hl-rojo">todo hemocultivo con S. aureus</span>. ETT primero (60-70 % en válvula nativa); si es negativa, ETE (≥90 %). El tratamiento es largo y con complicaciones: mejor guiado por Infecciosas.' },
      { id: 'nsc-g4', corto: 'Candida', tipo: 'destapa', fuente: 'ma-candidiasis · ma-cand-que · ma-empirico', cuantas: 'son tres cosas',
        enunciado: 'Fiebre persistente sin causa en un paciente con vía central. ¿Por qué piensas en Candida, por qué el hemocultivo no la descarta y qué das? Son tres cosas.',
        puntos: [
          'Pensarla en la <span class="hl">fiebre persistente sin causa</span> y en la infección urinaria por Candida, con vía central, cirugía abdominal reciente o antibióticos de amplio espectro.',
          'El hemocultivo <span class="hl-rojo">no la descarta</span>: su sensibilidad puede ser tan baja como el 20 % (hay una PCR con >90 %).',
          'Una <span class="hl-azul">equinocandina</span> (o anfotericina si grave), no fluconazol: la mitad no son C. albicans.'],
        explicacion: 'La candiduria persistente o la infección urinaria por Candida suele ser consecuencia de la candidiasis diseminada: un signo valioso de enfermedad invasiva.',
        nota: '<b>Nota de fuentes.</b> El cap. 42 dice que la Candida en orina con sonda «suele ser colonización» y que los hemocultivos son negativos en más del 50 % de las diseminadas; este capítulo, que la candiduria persistente «suele ser consecuencia» y que la sensibilidad puede ser «tan baja como el 20 %». Se muestran las dos.' },
      { id: 'nsc-g5', corto: 'cuántos hemocultivos', tipo: 'test', fuente: 'ma-hemoc-numero · ma-tabla-fig44-3 · mar-img-44-3 · ma-hemoc-calc', calculadora: { ir: 'ma-hemoc-calc', nombre: '¿Cuántas bacteriemias detecto?' }, modelo: visual('ma-infecciones-nosocomiales', '👁️ Los hemocultivos (vista Visual)'),
        enunciado: 'Predice con la Figura 44.3: ¿cuántos hemocultivos en 24 h necesitas para pasar del 90 % de bacteriemias detectadas en «otras infecciones», y cuántos en la endocarditis?',
        opciones: [
          { t: '2 en otras infecciones (80 %) y 1 en la endocarditis (89 %), y así evito extraer sangre de más', porque: 'Los dos números se quedan por debajo del 90 %: con 2 hemocultivos en otras infecciones te escaparía 1 bacteriemia de cada 5.' },
          { t: '3 en otras (96 %) y 2 en la endocarditis (94 %), pues su bacteriemia es continua', ok: true },
          { t: 'Siempre 4: solo con el cuarto se llega al 100 %', porque: 'El 100 % con 4 es por construcción del estudio (pacientes con ≥4 hemocultivos). Con 3 ya detectas el 96 %, y en la endocarditis bastan 2: extraerías sangre de más.' }],
        explicacion: '3-4 hemocultivos en 24 h; en la endocarditis bastan 2 (la bacteriemia es continua). Endocarditis: 89, 94, 94 y 100 %; otras infecciones: 65, 80, <span class="hl">96</span> y 100 %.',
        origen: 'ficha · Figura 44.3' },
      { id: 'nsc-g6', corto: 'luz frente a periférica', tipo: 'test', fuente: 'ma-hemoc-multilumen · ma-dtp-calc · mar-bacteriemia-cateter', calculadora: { ir: 'ma-dtp-calc', nombre: 'Tiempo hasta la positividad' },
        enunciado: 'Predice: el frasco de una luz del catéter crece a las 9,5 h y el de la sangre periférica, con el mismo germen, a las 12 h. ¿Cuál es la fuente, y qué pierdes si cultivas una sola luz?',
        opciones: [
          { t: 'El catéter (crece ≥2 h antes); una luz sola puede perder hasta el 40 %', ok: true },
          { t: 'No se puede decir: una diferencia de 2,5 h entre las dos muestras es poco', porque: 'El umbral de la ficha es ≥2 h; 2,5 h lo supera. Pasarías por alto una sepsis por catéter.' },
          { t: 'Otra fuente, porque la periférica también es positiva', porque: 'Que crezca el mismo germen en la periférica es el requisito; lo que señala al catéter es que crezca ≥2 h antes.' }],
        explicacion: 'Mismo germen en el catéter y en la periférica, y el de la vía crece <span class="hl">≥2 h antes</span>: <span class="hl-rojo">sepsis por catéter</span>. Se cultivan dos luces más un periférico; una sola luz puede perder hasta el 40 %. Qué hacer con el catéter está en Fundamentos (cap. 3).',
        origen: 'ficha · las horas 9,5 y 12 son ilustrativas (la fuente solo da «≥2 h»)' },
      { id: 'nsc-g7', corto: 'sin demora', tipo: 'test', fuente: 'ma-empirico', modelo: { termostatoVivo: 'fiebre:1' },
        enunciado: '¿A cuál de estos pacientes febriles no le demoras ni unas horas el antibiótico empírico?',
        opciones: [
          { t: 'Al neutropénico con menos de 500 neutrófilos', ok: true },
          { t: 'Al paciente con 38,4 °C aislada y sin foco sospechado', porque: 'La ficha pide antibiótico si la infección es probable; con una fiebre aislada, antes se hacen los hemocultivos y se busca la fuente.' },
          { t: 'Al del primer día de una cirugía mayor', porque: 'Es respuesta al daño tisular y cede en 24-48 h: un antibiótico sin indicación y sin cultivos previos.' }],
        explicacion: 'Antibiótico empírico si la infección es probable; <span class="hl-rojo">sin demora en el neutropénico (<500)</span>, donde unas horas cuentan. Antes del antibiótico, hemocultivos bien hechos.' },
    ],
    examen: [
      { id: 'nsc-e1', corto: 'Tabla 44.4', tipo: 'test', fuente: 'ma-tabla-44-4',
        enunciado: 'Según la Tabla 44.4 (EE. UU. 2021), ¿cuál es la infección hospitalaria más frecuente en la UCI?',
        opciones: [
          { t: 'La infección por C. difficile (44.948 casos en total en el hospital)', porque: 'Tiene el segundo total, pero la tabla no da cifra en UCI. Pondrías el foco en el intestino cuando lo más frecuente en la UCI es respiratorio.' },
          { t: 'Los eventos asociados al ventilador (47.254 de 50.050)', ok: true },
          { t: 'La bacteriemia asociada a catéter (14.003 en UCI)', porque: 'Es más que la urinaria (12.208), pero los eventos del ventilador la triplican con holgura.' }],
        explicacion: '<span class="hl">Eventos asociados al ventilador: 47.254</span> en UCI (de 50.050 en total); bacteriemia por catéter 14.003 e infección urinaria por sonda 12.208 en UCI.',
        nota: '<b>Nota de fidelidad.</b> El pie de la tabla atribuye los datos a la referencia 21, pero el texto los cita como referencia 22.' },
      { id: 'nsc-e2', corto: 'volumen de sangre', tipo: 'test', fuente: 'ma-hemoc-volumen',
        enunciado: 'Pasar de 20 a 30 mL de sangre por punción:',
        opciones: [
          { t: 'Sube el rendimiento un 10 %, con los 10 mL extra en el frasco aerobio', ok: true },
          { t: 'Sube el rendimiento un 30 %, con el extra repartido entre ambos frascos', porque: 'La subida es del 10 % y el volumen extra va al aerobio. Con 30 % esperado, creerías que un negativo es más fiable de lo que es.' },
          { t: 'No cambia el rendimiento: lo importante es el número de punciones', porque: 'El número de punciones importa (3-4 en 24 h), pero el volumen también: lo óptimo son 20-30 mL.' }],
        explicacion: 'Lo óptimo es <span class="hl">20-30 mL por punción</span>. Lo habitual son 20 mL (10 aerobio + 10 anaerobio); con 30 mL el rendimiento sube <span class="hl">un 10 %</span> poniendo los 10 mL extra en el aerobio.' },
      { id: 'nsc-e3', corto: 'panel molecular', tipo: 'test', fuente: 'ma-hemoc-molecular',
        enunciado: 'Un panel molecular de hemocultivos detecta 6 bacterias con 90 % de sensibilidad y especificidad en 3-5 h. ¿Por qué su valor es dudoso?',
        opciones: [
          { t: 'Un positivo exige igualmente el antibiograma y un negativo no descarta otros gérmenes', ok: true },
          { t: 'Porque tarda 48 h o más en dar resultado', porque: 'Eso es lo que tarda el cultivo convencional; el panel da resultado en 3-5 h. Confundirlos te haría descartarlo por un defecto que no tiene.' },
          { t: 'Porque su sensibilidad y su especificidad son de solo el 20 % para cualquiera de las seis bacterias', porque: 'El 20 % es la sensibilidad del hemocultivo para la candidiasis invasiva; el panel tiene un 90 %. Descartarías la prueba por una cifra que no es suya.' }],
        explicacion: 'El panel detecta E. coli, P. aeruginosa, K. pneumoniae, S. aureus, E. faecium y A. baumannii; <span class="hl-rojo">un positivo necesita el antibiograma y un negativo no descarta otros gérmenes</span>.',
        nota: '<b>Nota de fidelidad.</b> El texto escribe «A. baumannni» (errata de A. baumannii).' },
      { id: 'nsc-e4', corto: 'ETT protésica', tipo: 'test', fuente: 'ma-endocarditis',
        enunciado: 'Sensibilidad de la ecocardiografía transtorácica para la endocarditis en una válvula protésica:',
        opciones: [
          { t: '60-70 %, como en la válvula nativa', porque: 'Es la cifra de la válvula nativa; en la protésica es menor (50 %). Te fiarías de una ETT negativa más de lo debido.' },
          { t: '≥90 %, como la transesofágica', porque: 'El ≥90 % es de la ETE. Descartarías una endocarditis protésica con una ETT que se escapa la mitad.' },
          { t: 'Un 50 %, menos que en la nativa', ok: true }],
        explicacion: 'ETT primero: sensibilidad <span class="hl">60-70 % en válvula nativa y 50 % en protésica</span>; si es negativa, <span class="hl-rojo">ETE (≥90 %)</span>.' },
      { id: 'nsc-e5', corto: 'peritonitis', tipo: 'test', fuente: 'ma-peritonitis',
        enunciado: 'Un posoperatorio de cirugía abdominal extensa con fiebre persistente. ¿Cuándo debes pensar en peritonitis o absceso?',
        opciones: [
          { t: 'Con fiebre persistente o tardía (≥1 semana) tras cirugía extensa o contaminada', ok: true },
          { t: 'Solo si la fiebre aparece el primer día tras la cirugía abdominal y cede en 48 h', porque: 'La fiebre del día 1 es la respuesta al daño tisular y cede en 24-48 h; no apunta a peritonitis.' },
          { t: 'Nunca sin ascitis: es una complicación del cirrótico', porque: 'La PBE es del cirrótico con ascitis, pero la peritonitis posoperatoria es otra entidad: la perderías tras cirugía contaminada.' }],
        explicacion: '<span class="hl">Peritonitis o absceso</span> tras cirugía abdominal extensa o contaminada con fiebre persistente o tardía (≥1 semana); PBE en el cirrótico con ascitis y fiebre sin explicación.' },
      { id: 'nsc-e6', corto: 'cuándo vancomicina', tipo: 'test', fuente: 'ma-empirico',
        enunciado: 'En la fiebre con sospecha de infección, ¿cuándo añades vancomicina al empírico de gramnegativos?',
        opciones: [
          { t: 'En toda fiebre con sospecha de infección, por si es S. aureus', porque: 'La ficha lo limita: cubrir S. aureus en todo febril añadiría vancomicina sin motivo.' },
          { t: 'Nunca: pip-tazo, cefepima o meropenem ya cubren también S. aureus en la práctica', porque: 'Esos tres son para gramnegativos aerobios; si hay catéter o neumonía del ventilador, el S. aureus se quedaría sin cubrir.' },
          { t: 'Si se sospecha infección del catéter o neumonía asociada al ventilador', ok: true }],
        explicacion: 'Cubrir bacilos gramnegativos aerobios (pip-tazo, cefepima o meropenem) y <span class="hl">S. aureus (vancomicina) si se sospecha catéter o neumonía asociada al ventilador</span>. Antifúngico (equinocandina) con riesgo de candidiasis invasiva y fiebre persistente, cirugía intestinal contaminada o candiduria persistente.' },
    ],
    casos: [
      { id: 'c5c1', titulo: 'Celestino, 66 años: la fiebre del día 6', corto: 'Caso · Celestino', sub: 'bypass coronario, UCI cardiotorácica, 78 kg',
        paciente: { Edad: '66 años', Peso: '78 kg', Motivo: 'bypass coronario con circulación extracorpórea', Vías: 'catéter venoso central yugular de tres luces desde quirófano', Profilaxis: 'cefazolina perioperatoria' },
        pasos: [
          { momento: 'Día 6, 16:30', datos: { 'Temperatura vesical': '38,9 °C', FC: '104/min', PA: '118/70 mmHg', Esternotomía: 'eritema, dolor y drenaje purulento', Leucocitos: '16.800/µl' }, nuevo: ['Temperatura vesical', 'FC', 'PA', 'Esternotomía', 'Leucocitos'],
            pregunta: { id: 'c5c1-3', tipo: 'test', fuente: 'ma-iso-que · ma-iso-tto', origen: 'ficha (5-7 días, 1-2 %, S. aureus) · las cifras del paciente son ilustrativas',
              enunciado: 'Vuelve la fiebre. ¿Qué es y qué das?',
              opciones: [
                { t: 'Infección de herida de cirugía limpia, probable S. aureus: desbridar y vancomicina', ok: true },
                { t: 'Infección de herida de cirugía contaminada: pip-tazo + metronidazol, sin vancomicina', porque: 'Es la pauta de la herida contaminada abdominal. A Celestino le quedaría el S. aureus sin cubrir.' },
                { t: 'Fiebre por fármacos: retiro la cefazolina', porque: 'Con una herida purulenta la causa es la herida; perderías al menos 72 h hasta comprobar que la fiebre no cede al retirarla.' }],
              explicacion: 'Herida de <span class="hl">cirugía limpia</span> (1-2 %), a los 5-7 días y con S. aureus como germen típico: <span class="hl-rojo">desbridar y vancomicina</span>.' } },
          { momento: 'Día 6, 17:00', datos: {}, nuevo: [],
            pregunta: { id: 'c5c1-4', tipo: 'error', fuente: 'ma-iso-tto · ma-hemoc-multilumen · ma-endocarditis',
              enunciado: 'La nota del R1 antes de la analítica de la tarde. Encuentra los errores (0, 1 o 2).',
              frases: [
                { t: 'Herida purulenta al 6.º día de una cirugía limpia: S. aureus probable.' },
                { t: 'Desbrido la herida y empiezo pip-tazo + metronidazol.', mal: true, c: 'En la cirugía <span class="hl-rojo">limpia</span> el germen es S. aureus: el antibiótico es <span class="hl">vancomicina</span>. Pip-tazo + metronidazol es la pauta de la contaminada.' },
                { t: 'Saco un hemocultivo de 20 mL por la luz distal y otro periférico.', mal: true, c: 'Dos luces + un periférico: <span class="hl-rojo">una sola luz puede perder hasta el 40 %</span>.' },
                { t: 'Si crece S. aureus, pido ecocardiograma aunque las válvulas sean normales.' }],
              explicacion: 'Vancomicina para la herida limpia y dos luces más un periférico; el eco en todo S. aureus es correcto.' } },
          { momento: 'Día 7, 12:00', datos: { Hemocultivos: 'S. aureus sensible a meticilina en los tres frascos', 'Luz proximal': 'positiva a las 9,5 h', Periférica: 'positiva a las 12 h' }, nuevo: ['Hemocultivos', 'Luz proximal', 'Periférica'], calculadora: { ir: 'ma-dtp-calc', nombre: 'Tiempo hasta la positividad' },
            pregunta: { id: 'c5c1-5', tipo: 'destapa', fuente: 'ma-hemoc-multilumen · mar-bacteriemia-cateter', origen: 'ficha · las horas 9,5 y 12 son ilustrativas (la fuente solo da «≥2 h»)', cuantas: 'son tres cosas',
              enunciado: '¿Cómo demuestras que el catéter es la fuente? Son tres cosas.',
              puntos: [
                'El <span class="hl">mismo germen</span> en la sangre del catéter y en la periférica.',
                'El del catéter crece <span class="hl-rojo">≥2 h antes</span>: aquí 2,5 h (9,5 frente a 12 h).',
                'Hace falta haber cultivado <span class="hl">dos luces</span>: una sola puede perder hasta el 40 %.'],
              explicacion: 'Qué hacer con el catéter lo cuenta el cap. 3 de Fundamentos (bacteriemia por catéter): aquí solo se demuestra la fuente.' } },
          { momento: 'Día 7 · el giro', datos: { Germen: 'S. aureus', Válvulas: 'nativas, sin soplo conocido' }, nuevo: ['Germen', 'Válvulas'],
            pregunta: { id: 'c5c1-6', tipo: 'test', fuente: 'ma-endocarditis · umi-endocarditis',
              enunciado: 'Es S. aureus. ¿Te quedas en «sepsis por catéter»?',
              opciones: [
                { t: 'Sí: ya está explicada por el catéter y no hace falta ecocardiograma', porque: 'Todo hemocultivo con S. aureus obliga a estudiar la endocarditis. Sin eco no sabrías si la hay, y su tratamiento es largo y distinto.' },
                { t: 'Solo si tuviera válvula protésica', porque: 'Ese criterio es para estreptococo, estafilococo o enterococo con válvula anormal o protésica; con S. aureus no hace falta, y se te escaparía.' },
                { t: 'No: todo S. aureus en sangre obliga a estudiar la endocarditis', ok: true }],
              explicacion: 'Se estudia la endocarditis en <span class="hl-rojo">todo hemocultivo con S. aureus</span>. ETT primero.' } },
          { momento: 'Día 8', datos: { 'ETT': 'sin vegetaciones' }, nuevo: ['ETT'],
            pregunta: { id: 'c5c1-7', tipo: 'test', fuente: 'ma-endocarditis', origen: 'ficha · la cuenta (1 − 0,60 a 0,70 = 30-40 %) es de la propia cifra',
              enunciado: 'La ETT no muestra vegetaciones. ¿Está descartada?',
              opciones: [
                { t: 'Sí: es una válvula nativa y la ETT está limpia, así que descarto la endocarditis', porque: 'La ETT tiene una sensibilidad del 60-70 % en válvula nativa: se te escaparía entre un 30 y un 40 % de las endocarditis.' },
                { t: 'No: la ETT detecta 60-70 %; negativa, se pide ETE (≥90 %)', ok: true },
                { t: 'No: repito la ETT en 48 h', porque: 'La ficha no propone repetirla; la prueba que sigue a una ETT negativa es la ETE.' }],
              explicacion: 'ETT primero (<span class="hl">60-70 % en válvula nativa</span>); si es negativa, <span class="hl-rojo">ETE (≥90 %)</span>.' } },
        ],
        lleva: [
          'Herida limpia a los 5-7 días: S. aureus y vancomicina; la contaminada, gramnegativos.',
          'Dos luces + periférico, 20-30 mL y 3-4 en 24 h; el catéter que crece ≥2 h antes es la fuente.',
          'S. aureus en sangre = eco siempre, y la ETT negativa no cierra.'],
        volver: { nombre: 'Catéter multilumen y hemocultivos', ancla: 'ma-hemoc-multilumen', modelo: { termostatoVivo: 'fiebre' } } },
    ],
    profundizar: [
      { id: 'ma-tabla-44-4', titulo: 'Tabla 44.4: infecciones hospitalarias en EE. UU. y en UCI' },
      { id: 'ma-hemoc-molecular', titulo: 'Pruebas moleculares de los hemocultivos' },
      { id: 'ma-peritonitis', titulo: 'Peritonitis, absceso y PBE del cirrótico' },
      { id: 'ma-iso-necrotizante', titulo: 'La necrotizante: penicilina + clindamicina o carbapenémico' },
    ],
  },
};
