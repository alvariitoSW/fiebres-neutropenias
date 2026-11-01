// Mayéutica del bloque 3D (Marino cap. 26, págs. 76-88 del PDF): fichas neumo-vni-metodos y neumo-vni-uso y el caso de Herminia
// (la ficha 11 continúa la 10). Datos puros; el formato está en la cabecera de b1-fluidos.js. Modelo vivo: pulmón vivo (estados
// «psv-disparo», «cpap-eap» y «vpp-corazon-normal»). Las cifras del monitor se leyeron en la app a 390 px
// (autonomo/bloques/b3/herramientas/m-pulmon-cifras.mjs), no en el motor; los datos «(del paciente)» son del caso.
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const DED = '<i>Deducción; la fuente no lo dice.</i>';
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const M = 'neumo-vni-metodos', U = 'neumo-vni-uso';
const pv = (clave, texto) => ({ pulmonVivo: clave, texto });

export const MAYEUTICA_VNI = {
  /* =================================================================================================
     Ficha 10 · Ventilación no invasiva: métodos (cap. 26, págs. 76-80) y el caso de Herminia (1)
     ================================================================================================= */
  'neumo-vni-metodos': {
    entrada: 'Qué hace cada método de ventilación no invasiva (CPAP, bilevel, presión de soporte), en qué cuatro puntos la presión de soporte obedece al paciente y dónde falla de verdad: la mascarilla.',
    guia: [
      { id: 'vni-g1', corto: 'de la boquilla a la mascarilla', tipo: 'test', fuente: 'nep-historia-vni',
        enunciado: 'La ventilación a presión positiva sin intubar nació en los años 40. Antes de leer: ¿cómo se daba entonces y qué la llevó al fallo respiratorio agudo?',
        opciones: [
          { t: 'Con mascarilla facial desde el principio; la CPAP nació para el fallo respiratorio agudo y de ahí pasó a la apnea del sueño', porque: `Es al revés: primero fue una boquilla y la CPAP triunfó en la apnea del sueño (${p(76)}). Con esa idea creerías que la mascarilla ya estaba resuelta, y es justo donde falla la técnica.` },
          { t: 'Con boquilla, solo 10-15 minutos; la CPAP de la apnea del sueño mejoró las mascarillas y abrió el fallo agudo', ok: true },
          { t: 'Con un casco transparente durante horas; la CPAP del sueño no tuvo relación con la VNI aguda', porque: `El casco es una alternativa actual, rara en adultos (${p(80)}); la historia pasa por la boquilla y por la mascarilla de la CPAP (${p(76)}).` }],
        explicacion: `La VNI se introdujo en los años 40 <span class="hl-azul">por una boquilla, solo 10-15 minutos</span> (IPPB). La CPAP de los años 80 se hizo popular en la apnea obstructiva del sueño, <span class="hl-azul">mejoró las mascarillas</span>, y en los 90 llegó al fallo respiratorio agudo (${p(76)}).` + enFicha(M, 'nep-historia-vni') },
      { id: 'vni-g2', corto: 'qué sube con la CPAP', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-cpap-presion', origen: 'ficha; el monitor, ilustrativo',
        modeloVivo: pv('cpap-eap', '🫁 Herminia con CPAP: sube el mando PEEP (hace de CPAP) de 0 a 10'),
        enunciado: 'Una paciente respira con CPAP de 10 cmH₂O. ¿Qué sube con esa presión y qué no sube?',
        puntos: [
          `<span class="hl-verde">Sube el volumen pulmonar al final de la espiración</span> (la capacidad residual funcional) y evita el colapso de las vías pequeñas y de los alvéolos (${p(77)}).`,
          `<span class="hl-rojo">No sube el volumen tidal</span>: la CPAP no aumenta cada respiración, y por eso la fuente dice que da solo un soporte de presión limitado (${p(77)}).`],
        explicacion: `La presión se crea con un flujo constante de aire u oxígeno, habitualmente de <span class="hl-azul">5-10 cmH₂O</span> (${p(77)}). Con el modelo, sube el mando PEEP: la presión de la vía aérea queda fija, no empuja cada respiración.` + enFicha(M, 'nep-cpap-presion') },
      { id: 'vni-g3', corto: 'para qué se usa la CPAP', tipo: 'test', fuente: 'nep-cpap-usos',
        enunciado: '¿Para qué se usa sobre todo la CPAP?',
        opciones: [
          { t: 'Es la primera línea del fallo respiratorio agudo hipercápnico, porque da volumen en cada respiración', porque: `La CPAP no aumenta el volumen tidal y rara vez se usa en el fallo respiratorio agudo (${p(77)}). Con esa idea la pondrías a un EPOC que necesita ventilar.` },
          { t: 'Apnea del sueño y edema pulmonar cardiogénico; rara vez en el fallo respiratorio agudo', ok: true },
          { t: 'Casi solo el fallo respiratorio agudo; en la apnea del sueño es insuficiente porque el colapso es inspiratorio', porque: `El uso principal es la apnea obstructiva del sueño: la presión evita el colapso inspiratorio de la faringe (${p(77)}). Dejarías sin tratar la causa de la obstrucción.` }],
        explicacion: `El uso principal es la <span class="hl-azul">apnea obstructiva del sueño</span>; también ha tenido éxito en el <span class="hl-azul">edema pulmonar cardiogénico agudo</span>, y <span class="hl-rojo">rara vez se usa en el fallo respiratorio agudo</span> (${p(77)}).` + enFicha(M, 'nep-cpap-usos') },
      { id: 'vni-g4', corto: 'IPAP y PEEP', tipo: 'test', fuente: 'nep-bipap', origen: 'ficha; el pico de 15 del monitor, ilustrativo',
        modeloVivo: pv('psv-disparo', '🫁 Presión de soporte: pico 15 = PEEP 5 + soporte 10'),
        enunciado: 'En la ventilación no invasiva con dos niveles de presión (bilevel) el paciente dispara cada insuflación. ¿Qué presiones se usan y por qué no más altas?',
        opciones: [
          { t: 'Pico de 20-30 y PEEP de 10-15 cmH₂O; cuanta más presión, más volumen y menos intubaciones', porque: `Presiones más altas no se aconsejan: se toleran mal y promueven fugas en la mascarilla (${p(77)}). El paciente se arrancaría la máscara.` },
          { t: 'Pico de 10-20 y PEEP de 5-10; más presión se tolera mal y hace fugas en la máscara', ok: true },
          { t: 'Pico de 5-10 y PEEP de 0: el paciente dispara, así que la PEEP no hace falta', porque: `El modo da volumen aumentado por presión junto con una PEEP de 5-10 (${p(77)}). Sin PEEP perderías el efecto sobre los alvéolos colapsados.` }],
        explicacion: `Las presiones inspiratorias pico son típicamente de <span class="hl-azul">10-20 cmH₂O</span> y la PEEP de <span class="hl-azul">5-10</span>; <span class="hl-rojo">más presión se tolera mal y fuga alrededor de la mascarilla</span> (${p(77)}).` + enFicha(M, 'nep-bipap') },
      { id: 'vni-g5', corto: 'los 4 puntos de la PSV', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'nep-psv-4-puntos',
        modeloVivo: pv('psv-disparo', '🫁 Herminia en presión de soporte: hundimiento, flujo alto, flujo servo y corte'),
        enunciado: 'La ventilación con presión de soporte (PSV) ajusta la respiración del respirador a lo que pide el paciente. ¿En qué cuatro puntos de la curva obedece al paciente?',
        puntos: [
          `<span class="hl-azul">Disparo</span>: lo activa el paciente; la deflexión negativa inicial de la presión es su esfuerzo (${p(78)}).`,
          `<span class="hl-azul">Subida</span>: tras el disparo se usan flujos altos para llegar cuanto antes a la presión deseada (${p(78)}).`,
          `<span class="hl-azul">Mantenimiento</span>: la presión se mantiene constante ajustando el flujo, en servo, a la demanda del paciente (${p(78)}).`,
          `<span class="hl-rojo">Final</span>: la insuflación termina cuando el flujo inspiratorio del paciente cae al 25 % del flujo pico (${p(78)}).`],
        explicacion: `Son los cuatro números de la Figura 26.2 (${p(78)}). Con el modelo, mira la curva de presión (el hundimiento antes de cada respiración) y la de flujo (baja desde el pico y se corta).` + enFicha(M, 'nep-psv-4-puntos') },
      { id: 'vni-g6', corto: 'quién fija el volumen', tipo: 'test', fuente: 'nep-psv-uso',
        modeloVivo: pv('psv-disparo', '🫁 Con el mismo soporte, el volumen lo decide el paciente'),
        enunciado: 'En presión de soporte, ¿quién determina el tiempo de insuflación y el volumen tidal?',
        opciones: [
          { t: 'El respirador: fijas un tiempo inspiratorio y un volumen y los entrega igual en cada respiración', porque: `Eso es la ventilación controlada. En la PSV es el paciente quien los determina (${p(78)}). Con esa idea no esperarías que el volumen cambie al cambiar su pulmón.` },
          { t: 'El médico, con el soporte y la frecuencia que programa', porque: `El soporte fija solo la presión; el tiempo y el volumen salen del esfuerzo y de la demanda de flujo del paciente (${p(78)}).` },
          { t: 'El propio paciente, con su esfuerzo y su demanda de flujo', ok: true }],
        explicacion: `La interacción permite que <span class="hl-azul">el paciente determine el tiempo de insuflación y el volumen tidal</span>, promueve la sincronía paciente-ventilador y reduce el trabajo respiratorio (${p(78)}). Para qué se reserva la PSV (asincronía y pruebas de respiración espontánea) queda en «Para profundizar».` + enFicha(M, 'nep-psv-uso') },
      { id: 'vni-g7', corto: 'PAV frente a PSV', tipo: 'test', fuente: 'nep-pav',
        enunciado: 'La ventilación asistida proporcional (PAV) adapta la presión al paciente. Según Marino, ¿qué ventaja demostrada tiene frente a la presión de soporte?',
        opciones: [
          { t: 'Ninguna demostrada: no hay evidencia de que la PAV sea superior a la PSV', ok: true },
          { t: 'Menos intubaciones, porque la presión se ajusta a la mecánica del paciente', porque: `La fuente no aporta tal beneficio: no hay evidencia de que la PAV sea superior a la PSV (${p(79)}). Cambiarías de modo a un paciente que ya tolera uno sin ganancia conocida.` },
          { t: 'Menos fugas, porque mide la mecánica con la mascarilla puesta', porque: `Las mediciones de mecánica son periódicas y propietarias del ventilador (${p(79)}); nada dice que reduzcan las fugas.` }],
        explicacion: `<span class="hl-purpura">No hay evidencia de que la PAV sea superior a la PSV</span> como modo de VNI (${p(79)}).` + enFicha(M, 'nep-pav') },
      { id: 'vni-g8', corto: 'la mascarilla: 1 error', tipo: 'error', fuente: 'nep-mascarillas',
        enunciado: 'Un compañero resume las mascarillas de la VNI. Hay un error. Encuéntralo.',
        frases: [
          { t: 'La CPAP de bajo nivel puede administrarse con una mascarilla nasal.' },
          { t: 'Para dar BiPAP basta una mascarilla nasal, aunque la ajustes poco.', mal: true, c: 'La BiPAP exige mascarillas faciales completas, bien ajustadas para minimizar fugas.' },
          { t: 'Las mascarillas faciales son incómodas y los pacientes las toleran mal.' }],
        explicacion: `La interfaz es la que hizo posible la VNI: nasal para <span class="hl-verde">CPAP de bajo nivel</span>, pero <span class="hl-rojo">facial completa para BiPAP</span> (${p(79)}).` + enFicha(M, 'nep-mascarillas') },
      { id: 'vni-g9', corto: 'el casco', tipo: 'test', fuente: 'nep-casco',
        enunciado: 'Existe una alternativa a la mascarilla ajustada: una capucha transparente con sello blando en el cuello. ¿Qué muestran los estudios que la comparan con la mascarilla facial?',
        opciones: [
          { t: 'Más intubaciones y más muertes que con la mascarilla, por eso se dejó de usar en adultos', porque: `Muestran lo contrario: menos intubaciones e incluso menos muertes con el casco; si no se usa en adultos es por otra razón (${p(80)}). Descartarías una opción útil.` },
          { t: 'Resultados iguales a la mascarilla, pero con más fugas', porque: `La fuente no habla de fugas: dice menos intubaciones e incluso menos muertes con el casco (${p(80)}).` },
          { t: 'Menos intubaciones e incluso menos muertes, aunque rara vez se usa en adultos', ok: true }],
        explicacion: `El casco (<i>helmet</i>) muestra <span class="hl-verde">menos intubaciones e incluso menos muertes</span> que la mascarilla facial, pero <span class="hl-rojo">rara vez se usa en adultos</span> (${p(80)}).` + enFicha(M, 'nep-casco') }
    ],
    examen: [
      { id: 'vni-e1', corto: 'qué es BiPAP', tipo: 'test', fuente: 'nep-bipap-marca',
        enunciado: 'Marino usa «BiPAP» con moderación en el capítulo. ¿Por qué?',
        opciones: [
          { t: 'Es un nombre propietario, marca registrada de Philips Respironics', ok: true },
          { t: 'Es un modo distinto de la VNI, que da más presión que el bilevel', porque: `Es el mismo modo descrito, el bilevel; solo cambia el nombre (${p(77)}). Con esa idea buscarías otro respirador para un modo que ya tienes.` },
          { t: 'Es un modo genérico de cualquier fabricante, pero se usa menos que la PSV', porque: `El nombre es una marca registrada (${p(77)}); el modo se llama presión positiva bilevel en la vía aérea.` }],
        explicacion: `El modo se llama «presión positiva bilevel en la vía aérea»; <span class="hl-purpura">BiPAP es un nombre propietario</span>, registrado como marca por Philips Respironics (${p(77)}).` + enFicha(M, 'nep-bipap-marca') },
      { id: 'vni-e2', corto: 'fugas de la mascarilla', tipo: 'test', fuente: 'nep-mascarillas',
        enunciado: 'La mascarilla facial de una BiPAP tiene una pequeña fuga. ¿Qué cabe esperar del equipo?',
        opciones: [
          { t: 'Que ninguna máquina lo compense, por lo que cualquier fuga obliga a pasar a CPAP', porque: `La mayoría de las máquinas de BiPAP pueden compensar las fugas (${p(79)}). Cambiarías de método sin necesidad.` },
          { t: 'Que la compense la mayoría de las máquinas, con la mascarilla ajustada', ok: true },
          { t: 'Que sea irrelevante: no hace falta ajustar la mascarilla', porque: `Las mascarillas faciales deben ser ajustadas para minimizar fugas (${p(79)}). Sin ajuste, la presión se pierde por el lateral.` }],
        explicacion: `Las mascarillas deben ser ajustadas para minimizar fugas, <span class="hl-azul">aunque la mayoría de las máquinas de BiPAP pueden compensarlas</span> (${p(79)}).` + enFicha(M, 'nep-mascarillas') },
      { id: 'vni-e3', corto: 'cómo ajusta la PAV', tipo: 'test', fuente: 'nep-pav',
        enunciado: '¿Cómo ajusta la PAV la presión inspiratoria al paciente?',
        opciones: [
          { t: 'Con un nivel fijo de soporte que programa el médico y no se modifica', porque: `Eso es la presión de soporte. La PAV ajusta la presión a partir de mediciones periódicas de la mecánica (${p(79)}).` },
          { t: 'Cortando la insuflación al 25 % del flujo pico', porque: `Ese es el criterio de fin de la PSV (${p(78)}); la PAV usa la mecánica respiratoria medida (${p(79)}).` },
          { t: 'Midiendo periódicamente la distensibilidad y la resistencia', ok: true }],
        explicacion: `La PAV ajusta la presión inspiratoria pico al trabajo respiratorio con <span class="hl-azul">mediciones periódicas de distensibilidad y resistencia</span>, realizadas de forma propietaria por ventiladores capaces de administrarla (${p(79)}).` + enFicha(M, 'nep-pav') },
      { id: 'vni-e4', corto: 'corte al 25 %', tipo: 'test', fuente: 'nep-psv-4-puntos', origen: 'ficha; el flujo de 60 L/min, ilustrativo',
        enunciado: 'En una respiración con presión de soporte el flujo inspiratorio pico fue de 60 L/min. ¿Cuándo termina la insuflación?',
        opciones: [
          { t: 'Cuando el flujo cae a 15 L/min, el 25 % del pico', ok: true },
          { t: 'Cuando el flujo cae a 3 L/min, el 5 % del pico', porque: `El corte es al 25 % del pico (${p(78)}). Con el 5 % la insuflación se alargaría y el paciente lucharía contra el respirador.` },
          { t: 'Al cabo de un tiempo inspiratorio fijo que programas', porque: `En PSV el paciente determina el tiempo de insuflación; el tiempo fijo es de otros modos (${p(78)}).` }],
        explicacion: `El 25 % de 60 son <span class="hl-rojo">15 L/min</span>: la insuflación termina cuando el flujo del paciente cae a ese valor (${p(78)}).` + enFicha(M, 'nep-psv-4-puntos') }
    ],
    profundizar: [
      { id: 'nep-psv-uso', titulo: 'Para qué se reserva la presión de soporte (asincronía y pruebas de respiración espontánea)' }
    ],
    casos: [
      { id: 'c-vni-herminia', titulo: 'Herminia, 76 años: edema agudo de pulmón', corto: 'Caso · Herminia (métodos)', sub: 'Disnea brusca; la CPAP, la mascarilla y el cambio de método',
        paciente: { Edad: '76 años, mujer', Peso: '92 kg, 1,55 m (PBW 47,9 kg)', Antecedentes: 'hipertensión', Motivo: 'disnea intensa de inicio brusco' },
        pasos: [
          { momento: 'Urgencias', datos: { FR: '32 (del paciente)', 'SpO₂': '85 % con O₂ convencional (del paciente)', Auscultación: 'crepitantes bilaterales (del paciente)', Cuadro: 'edema agudo de pulmón (del paciente)' }, nuevo: ['FR', 'SpO₂', 'Auscultación', 'Cuadro'],
            pregunta: { id: 'vni-c1', tipo: 'test', fuente: 'nep-cpap-usos', origen: 'ficha; los datos de Herminia, del caso',
              enunciado: 'Herminia tiene un edema agudo de pulmón, está despierta y colabora. ¿Qué método de VNI eliges primero?',
              opciones: [
                { t: 'PAV: ajusta la presión a su mecánica, que es peor en el edema', porque: `No hay evidencia de que la PAV sea superior a la PSV (${p(79)}); no es una indicación del edema.` },
                { t: 'CPAP, que ha tenido éxito en el edema pulmonar cardiogénico agudo', ok: true },
                { t: 'Ninguno: el edema agudo exige intubación inmediata porque la CPAP no hace nada en el pulmón húmedo', porque: `La CPAP ha tenido éxito en el edema pulmonar cardiogénico agudo (${p(77)}). Intubarías sin necesidad a una paciente despierta y cooperadora.` }],
              explicacion: `La CPAP <span class="hl-verde">ha tenido éxito en el edema pulmonar cardiogénico agudo</span> (${p(77)}); sus razones se explican en la ficha siguiente.` + enFicha(M, 'nep-cpap-usos') } },
          { momento: 'CPAP 10', datos: { CPAP: '10 cmH₂O por mascarilla', 'Presión pico y media en el monitor (ilustrativo)': '10 y 10 cmH₂O' }, nuevo: ['CPAP', 'Presión pico y media en el monitor (ilustrativo)'],
            pregunta: { id: 'vni-c2', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-cpap-presion', origen: 'ficha; las cifras del monitor, ilustrativas',
              modeloVivo: pv('cpap-eap', '🫁 CPAP 10: sube el mando PEEP de 0 a 10'),
              enunciado: 'Herminia lleva CPAP de 10. En el monitor del modelo (sube el mando PEEP) la presión pico y la media valen 10. ¿Qué hace la presión durante el ciclo y cómo se produce?',
              puntos: [
                `<span class="hl-azul">Constante en todo el ciclo</span>: la presión al final de la espiración es positiva respecto a la atmosférica y se mantiene durante toda la respiración (${p(77)}); por eso la pico y la media coinciden.`,
                `<span class="hl-azul">Un flujo continuo</span> de aire u oxígeno, ajustado hasta lograr el nivel de presión deseado (${p(77)}).`],
              explicacion: `Con CPAP no hay presión de soporte: la presión sube a 10 y ahí se queda. Es la diferencia con el bilevel, donde la presión pico sube desde la PEEP en cada insuflación (${p(77)}).` + enFicha(M, 'nep-cpap-presion') } },
          { momento: 'El plan del residente', datos: { Plan: 'cuatro frases del residente' }, nuevo: ['Plan'],
            pregunta: { id: 'vni-c3', tipo: 'error', fuente: 'nep-cpap-presion · nep-pav', origen: 'ficha',
              enunciado: 'Plan del residente para Herminia. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Mantengo la presión positiva durante todo el ciclo, también al final de la espiración.' },
                { t: 'Subo la CPAP a 15 para que mueva más volumen en cada respiración.', mal: true, c: 'La CPAP no aumenta el volumen tidal: sube el volumen al final de la espiración y se usa a 5-10 cmH₂O.' },
                { t: 'Empiezo con una presión de 5-10 cmH₂O, que evita el colapso de los alvéolos al final de la espiración.' },
                { t: 'Si no mejora, paso a PAV, que es superior a la presión de soporte.', mal: true, c: 'No hay evidencia de que la PAV sea superior a la PSV como modo de VNI.' }],
              explicacion: `Dos confusiones típicas: pedirle volumen a la CPAP, que <span class="hl-rojo">no aumenta el volumen tidal</span> (${p(77)}), y dar por superior un modo que <span class="hl-rojo">no ha demostrado serlo</span> (${p(79)}).` + enFicha(M, 'nep-cpap-presion') } },
          { momento: 'A los 30 minutos', datos: { Mascarilla: 'se la arranca (del paciente)', Piel: 'úlcera en el puente de la nariz (del paciente)' }, nuevo: ['Mascarilla', 'Piel'],
            pregunta: { id: 'vni-c4', tipo: 'test', fuente: 'nep-mascarilla-intolerancia', origen: 'ficha; el estado de la paciente, del caso',
              enunciado: 'A la media hora Herminia se arranca la mascarilla y tiene una úlcera en el puente de la nariz. ¿Cómo lo interpretas?',
              opciones: [
                { t: 'Un fracaso de la CPAP por mala oxigenación: hay que intubar', porque: `Aquí no hay un dato de oxigenación peor; es intolerancia a la mascarilla (${p(79)}). Intubarías por un problema de interfaz.` },
                { t: 'Un efecto habitual que no cuenta: la mascarilla debe tolerarse siempre, como en la apnea del sueño', porque: `La intolerancia a la mascarilla es una fuente significativa de intentos fallidos (${p(79)}); ignorarla pierde la VNI.` },
                { t: 'Intolerancia a la mascarilla, causa del 18 % de los fracasos en un estudio', ok: true }],
              explicacion: `Las mascarillas pueden romper la piel, <span class="hl-rojo">especialmente en el puente de la nariz</span>, y la intolerancia explicó el <span class="hl-rojo">18 %</span> de los fracasos de la VNI en un estudio (${p(79)}). ${DED} Lo lógico es resolver la interfaz antes de abandonar el método.` + enFicha(M, 'nep-mascarilla-intolerancia') } },
          { momento: 'El giro · BiPAP', datos: { Presiones: 'IPAP 12 / EPAP 6 cmH₂O', Queja: '«respiro peor» (del paciente)' }, nuevo: ['Presiones', 'Queja'],
            pregunta: { id: 'vni-c5', tipo: 'test', fuente: 'nep-bipap', origen: 'ficha; los datos de Herminia, del caso',
              enunciado: 'Tras cambiar la interfaz pasan a BiPAP 12/6 y Herminia dice que respira peor. Las presiones están en el rango habitual. ¿Qué compruebas primero?',
              opciones: [
                { t: 'Subes a 20/10 para asegurar volumen: con más presión siempre se ventila mejor', porque: `Presiones más altas se toleran mal y promueven fugas (${p(77)}). Empeoraría su malestar.` },
                { t: 'Que dispare cada insuflación y que no haya fugas alrededor de la mascarilla', ok: true },
                { t: 'Vuelves a la CPAP: la BiPAP no vale en el edema agudo', porque: `La fuente no dice que la BiPAP no valga; el modo depende de que el paciente dispare y de que no haya fugas (${p(77)}).` }],
              explicacion: `El modo es <span class="hl-azul">activado por el paciente</span> (cada insuflación empieza con su esfuerzo) y <span class="hl-azul">las presiones altas promueven fugas</span> (${p(77)}). ${DED} Comprobar el disparo y las fugas sale de ahí.` + enFicha(M, 'nep-bipap') } }
        ],
        lleva: [
          'La CPAP sube el volumen al final de la espiración, no el volumen tidal; se usa a 5-10 cmH₂O.',
          'En el bilevel el paciente dispara y la presión pico es de 10-20 con PEEP de 5-10; presiones más altas se toleran mal y hacen fugas.',
          'La mascarilla es un punto débil: la intolerancia causó el 18 % de los fracasos de un estudio.'],
        volver: { nombre: 'Los cuatro puntos de la presión de soporte', ancla: 'nep-psv-4-puntos', modelo: pv('psv-disparo', '🫁 Herminia en presión de soporte') } }
    ]
  },

  /* =================================================================================================
     Ficha 11 · VNI: uso clínico y rendimiento cardíaco (cap. 26, págs. 80-88) y el caso de Herminia (2)
     ================================================================================================= */
  'neumo-vni-uso': {
    entrada: 'Cuándo se puede dar VNI (la lista), cómo se juzga a la hora, y por qué en el corazón que falla la presión positiva ayuda (baja la poscarga) mientras que en el sano o en el hipovolémico perjudica (frena el llenado).',
    guia: [
      { id: 'vnu-g1', corto: 'quién es candidato', tipo: 'test', fuente: 'nep-tabla-26-1',
        enunciado: 'Marino presenta los criterios de selección de la VNI como una lista de comprobación. ¿Cuál de estos pacientes con fallo respiratorio agudo es candidato?',
        opciones: [
          { t: 'Una paciente con estado confusional agudo, que por ahora respira bien', porque: `El estado confusional agudo es una de las seis condiciones de la Tabla 26.1 que descartan la VNI (${p(81)}). Con la máscara puesta no protegería ni pediría ayuda.` },
          { t: 'Un paciente consciente con hematemesis y vómitos persistentes', porque: `Hematemesis o vómitos persistentes están en la lista de exclusión (${p(81)}); con una mascarilla ajustada se aspiraría.` },
          { t: 'Un EPOC hipercápnico somnoliento pero despertable y cooperador', ok: true }],
        explicacion: `Es candidato quien responde <span class="hl-verde">NO a las seis condiciones</span> (${p(81)}). Basta que sea despertable y cooperador (${p(80)}).` + enFicha(U, 'nep-vni-candidatos') },
      { id: 'vnu-g2', corto: 'primera línea', tipo: 'test', fuente: 'nep-hipercapnico',
        enunciado: '¿En qué fallo respiratorio es la VNI terapia de primera línea?',
        opciones: [
          { t: 'En la exacerbación aguda de EPOC con hipercapnia aguda, no en la crónica', ok: true },
          { t: 'En cualquier hipercapnia, aguda o crónica, porque reduce la intubación y la mortalidad', porque: `La VNI no tiene este beneficio cuando la hipercapnia es crónica (${p(81)}). La pondrías donde no sirve.` },
          { t: 'En la neumonía comunitaria con hipoxemia pura, donde más éxito tiene', porque: `La neumonía comunitaria es la hipoxemia con mayor tasa de fracaso de la VNI (${p(82)}).` }],
        explicacion: `El uso más exitoso es el <span class="hl-purpura">fallo hipercápnico agudo de la exacerbación de EPOC</span>: con 17 estudios agrupados la intubación baja del 34 al 12 % y la mortalidad del 18 al 10 % (Fig. 26.4, ${p(81)}-${p(82)}).` + enFicha(U, 'nep-hipercapnico') },
      { id: 'vnu-g3', corto: 'la señal a la hora', tipo: 'test', fuente: 'nep-respuesta-1h',
        enunciado: 'Del 10-20 % de los EPOC hipercápnicos que no responden a la VNI: ¿cómo los identificas y qué no debes usar como señal temprana?',
        opciones: [
          { t: 'Por la conciencia a la hora: si sigue obnubilado, ha fallado; la PaCO₂ se mide a las 6 horas', porque: `La alteración mental tarda más en resolverse y no debe usarse como indicación temprana (${p(81)}). Intubarías a quien aún mejora.` },
          { t: 'Por la PaCO₂ a la hora: si no baja al menos un 10 %; la conciencia tarda más y no vale', ok: true },
          { t: 'Por la frecuencia respiratoria a la hora, sin gasometría', porque: `La fuente mide la PaCO₂ a la hora y la compara con el valor basal (${p(81)}).` }],
        explicacion: `Se comprueba la PaCO₂ tras <span class="hl-rojo">1 hora</span> y se compara con la basal: <span class="hl-rojo">no bajar al menos un 10 %</span> es respuesta pobre. La alteración mental puede tardar más y no sirve de señal temprana (${p(81)}).` + enFicha(U, 'nep-respuesta-1h') },
      { id: 'vnu-g4', corto: 'obesidad e hipoventilación', tipo: 'test', fuente: 'nep-sho',
        enunciado: 'Un paciente con síndrome de hipoventilación por obesidad entra en fallo hipercápnico agudo. ¿Qué dice Marino de la VNI?',
        opciones: [
          { t: 'No se usa: no hay estudios que la apoyen y se juzga en casos aislados', porque: `Pese a la escasez de estudios, la evidencia muestra que reduce la intubación (${p(82)}). La negarías a quien se beneficia.` },
          { t: 'Eficaz para evitar la intubación; vale la misma PaCO₂ a la hora', ok: true },
          { t: 'Es eficaz, pero se juzga por la oximetría y no por la PaCO₂', porque: `Se asume que vale la evaluación de la PaCO₂ a la hora (${p(82)}); la oximetría no la sustituye.` }],
        explicacion: `La evidencia, aunque escasa, muestra que la VNI <span class="hl-verde">reduce la intubación</span> en este síndrome; es razonable asumir que la <span class="hl-azul">PaCO₂ a la hora</span> también vale (${p(82)}).`,
        nota: `<b>Opinión del autor</b>: Marino da por «razonable» aplicar la evaluación a 1 h porque hay pocos estudios; no lo respalda un dato (${p(82)}).` + enFicha(U, 'nep-sho') },
      { id: 'vnu-g5', corto: 'según la causa', tipo: 'test', fuente: 'nep-hipoxemico · nep-fig-26-5',
        enunciado: 'En el fallo hipoxémico, la VNI falla según la causa (Fig. 26.5). ¿En cuál falla menos y en cuál más?',
        opciones: [
          { t: 'Menos en la neumonía comunitaria y más en el edema pulmonar cardiogénico agudo', porque: `Es al revés: el edema cardiogénico es donde menos falla y la neumonía comunitaria donde más (${p(82)}). La intentarías donde casi seguro fracasa.` },
          { t: 'Menos en el edema cardiogénico (10 %) y más en la neumonía comunitaria (50 %)', ok: true },
          { t: 'Menos en el SDRA grave, porque la presión recluta; más en el SDRA leve', porque: `En el SDRA el fracaso depende de la gravedad: 22 % en el leve y 47 % en el grave (${p(83)}).` }],
        explicacion: `Fracaso de la VNI: <span class="hl-verde">edema cardiogénico 10 %</span>, SDRA leve 22 %, COVID-19 33 %, SDRA grave 47 %, <span class="hl-rojo">neumonía comunitaria 50 %</span> (Fig. 26.5, ${p(82)}-${p(83)}).` + enFicha(U, 'nep-fig-26-5') },
      { id: 'vnu-g6', corto: 'la señal hipoxémica', tipo: 'test', fuente: 'nep-respuesta-pf',
        enunciado: 'En el fallo respiratorio hipoxémico, ¿qué señal a la hora indica fracaso de la VNI y cuándo debe llevar a intubar?',
        opciones: [
          { t: 'Que el cociente PaO₂/FiO₂ no suba; intubar si la hipoxemia es grave', ok: true },
          { t: 'Que la SpO₂ siga por debajo de 95 %; intubar siempre sin más', porque: `La fuente usa el cociente PaO₂/FiO₂ a la hora y no un corte de SpO₂ (${p(82)}). Intubarías a pacientes que aún mejoran.` },
          { t: 'Que la PaCO₂ no baje un 10 %; intubar solo si la conciencia empeora', porque: `Ese es el criterio del fallo hipercápnico (${p(81)}), y la conciencia no debe usarse como señal temprana.` }],
        explicacion: `Si el <span class="hl-rojo">PaO₂/FiO₂ no sube tras 1 hora</span> hay fracaso; es indicación de intubar si la hipoxemia es grave o la enfermedad de base tiene alta tasa de fracaso con VNI (${p(82)}).` + enFicha(U, 'nep-respuesta-pf') },
      { id: 'vnu-g7', corto: 'la PA sube con la insuflación', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-vni-edema',
        modeloVivo: pv('cpap-eap', '🫁 Herminia: sube la CPAP de 0 a 10 y mira el volumen sistólico'),
        origen: 'ficha; las cifras del monitor, ilustrativas',
        enunciado: 'En el edema agudo de pulmón, la presión arterial sube con cada insuflación a presión positiva y baja al volver la presión. ¿Qué mide el área sombreada de la curva y por qué sube?',
        puntos: [
          `<span class="hl-azul">El área sombreada es proporcional al volumen sistólico</span>: su aumento refleja más volumen eyectado (${p(83)}).`,
          `<span class="hl-rojo">La subida de la presión arterial no es un problema</span>: es un reflejo del mayor volumen sistólico del ventrículo izquierdo (${p(83)}).`,
          `<span class="hl-azul">El mecanismo es una menor poscarga del VI</span>, que se explica en la sección de rendimiento cardíaco (${p(83)}).`],
        explicacion: `Con el modelo, el volumen sistólico pasa de 35 mL sin CPAP a 38 mL con CPAP 5 y sigue en 38 con 10 (monitor, ilustrativo).` + enFicha(U, 'nep-vni-edema') },
      { id: 'vnu-g8', corto: 'HFNO frente a VNI', tipo: 'test', fuente: 'nep-hfno-vni · nep-hfno-preferido',
        enunciado: 'En el fallo respiratorio hipoxémico agudo, ¿cómo se compara el oxígeno nasal de alto flujo (HFNO) con la VNI en intubaciones, y cuál se prefiere?',
        opciones: [
          { t: 'Equivalente en intubaciones; se prefiere el HFNO por comodidad y porque deja comer', ok: true },
          { t: 'Es inferior en intubaciones; se prefiere la VNI aunque sea incómoda', porque: `Los estudios muestran tasas de intubación equivalentes, y Marino prefiere el HFNO (${p(83)}-${p(84)}). Mantendrías la mascarilla sin ganar nada.` },
          { t: 'Es superior siempre; se prefiere el HFNO porque la VNI no tiene indicación hipoxémica', porque: `La VNI tiene indicación hipoxémica y el HFNO es equivalente en general (superior solo en inmunocomprometidos) (${p(83)}-${p(84)}).` }],
        explicacion: `Tasas de intubación <span class="hl-azul">equivalentes</span>; como el HFNO evita la mascarilla, es más cómodo y permite la ingesta oral, <span class="hl-purpura">debería preferirse a la VNI</span> en el fallo hipoxémico agudo (${p(84)}).` + enFicha(U, 'nep-hfno-preferido') },
      { id: 'vnu-g9', corto: 'cuatro formas de frenar el llenado', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'nep-precarga-vias',
        modeloVivo: pv('vpp-corazon-normal', '🫁 Corazón sano: sube la PEEP de 4 a 20 y mira el volumen sistólico'),
        origen: 'ficha; las cifras del monitor, ilustrativas',
        enunciado: 'La presión intratorácica positiva reduce la precarga (el volumen al final de la diástole) de cuatro formas. ¿Cuáles?',
        puntos: [
          `<span class="hl-azul">Menos gradiente de entrada venosa al tórax</span>: baja el llenado del ventrículo derecho (${p(85)}).`,
          `<span class="hl-azul">Compresión de las venas pulmonares</span>: la presión suele superar la de las venas y frena el llenado del VI (${p(85)}).`,
          `<span class="hl-azul">Menor presión transmural telediastólica</span>: la pleural positiva baja la presión a través de la pared; pesa más en el VD, de presión de cámara más baja (${p(85)}).`,
          `<span class="hl-rojo">Más resistencia vascular pulmonar</span>: frena la salida del VD y, si falla, el septo empuja al VI y reduce su llenado (${p(85)}-${p(86)}).`],
        explicacion: `Es «una amenaza real para el llenado cardíaco», <span class="hl-rojo">magnificada por la hipovolemia</span>: evitarla es imperativo con presiones altas (${p(86)}). En el modelo sano, con PEEP 4 → 20 el volumen sistólico baja de 67 a 46 mL y el gasto de 4,9 a 3,8 L/min (monitor, ilustrativo).` + enFicha(U, 'nep-precarga-vias') },
      { id: 'vnu-g10', corto: 'pulso paradójico', tipo: 'test', fuente: 'nep-pulso-paradojico-26 · nep-ec-26-1',
        enunciado: 'Un asmático agudo respira solo y su presión sistólica cae más de 10 mmHg en cada inspiración. ¿Qué es y por qué ocurre?',
        opciones: [
          { t: 'Pulso paradójico: el esfuerzo exagerado hace más negativa la pleural y sube la poscarga', ok: true },
          { t: 'Pulso paradójico invertido: la inspiración mejora el llenado del VI y la presión sistólica sube', porque: `El invertido es el aumento inspiratorio con presión positiva (${p(87)}); aquí la caída es por esfuerzo espontáneo.` },
          { t: 'Normal: la presión sistólica nunca cambia con la respiración si el corazón es sano', porque: `La presión sistólica normalmente disminuye con la inspiración espontánea; lo anormal es la exageración (${p(87)}).` }],
        explicacion: `Poscarga = presión de la cámara − presión pleural (Ec. 26.1). La pleural negativa de la inspiración espontánea <span class="hl-azul">aumenta la poscarga del VI</span>; si la caída es exagerada (<span class="hl-rojo">&gt;10 mmHg</span>), es pulso paradójico, como en el asma aguda (${p(87)}). Con presión positiva ocurre lo contrario: la poscarga baja y la sistólica sube.`,
        nota: `<b>Errata de la fuente</b>: el texto (${p(87)}) remite a la «Figura 26.7» para ese aumento inspiratorio; la que muestra la presión arterial con una insuflación es la 26.6 (${p(85)}). La ficha describe el hallazgo y no cita el número.` + enFicha(U, 'nep-pulso-paradojico-26') },
      { id: 'vnu-g11', corto: 'gasto cardíaco: 2 errores', tipo: 'error', fuente: 'nep-gasto · nep-corazon-papel',
        modeloVivo: pv('vpp-corazon-normal', '🫁 Corazón sano con PEEP 20: el gasto baja'),
        enunciado: 'Un compañero resume el efecto de la presión positiva sobre el gasto cardíaco. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'El efecto depende del volumen intravascular, del nivel de presión y de si hay disfunción cardíaca.' },
          { t: 'En el corazón sano la presión positiva sube el gasto porque baja la poscarga.', mal: true, c: 'El corazón sano está en la parte plana de la curva de poscarga: gana poco por ello y pierde más por el llenado, así que el gasto tiende a bajar.' },
          { t: 'En el corazón que falla, bajar la poscarga pesa más que perder algo de llenado.' },
          { t: 'En el VI disfuncionante la presión positiva ayuda aunque frene la entrada de sangre al corazón derecho.', mal: true, c: 'Ayuda siempre que no impida la entrada venosa al corazón derecho.' }],
        explicacion: `El balance entre precarga y poscarga: el <span class="hl-azul">corazón normal</span> pierde gasto al frenarse el llenado; el <span class="hl-azul">que falla</span> lo gana al bajar la poscarga, <span class="hl-rojo">mientras no se impida el retorno al derecho</span> (${p(87)}-${p(88)}).` + enFicha(U, 'nep-corazon-papel') },
      { id: 'vnu-g12', corto: 'no olvides intubar', tipo: 'test', fuente: 'nep-no-olvides-intubar',
        enunciado: 'Un paciente lleva una hora de VNI sin mejorar y sigue con distrés respiratorio. ¿Qué advierte Marino?',
        opciones: [
          { t: 'Seguir con la VNI el máximo tiempo posible: intubar en extremis es igual de seguro que antes', porque: `Los retrasos de la intubación crean un riesgo innecesario: las intubaciones emergentes en pacientes in extremis pueden ser problemáticas (${p(88)}).` },
          { t: 'Que el beneficio debe verse a la hora y que el distrés persistente suma riesgo (P-SILI)', ok: true },
          { t: 'Que la intubación nunca se justifica mientras el paciente respire espontáneamente', porque: `La intubación da mayor control ventilatorio y puede ser necesaria para frenar la progresión del fallo agudo (${p(88)}).` }],
        explicacion: `La evidencia de beneficio <span class="hl-rojo">debe ser evidente tras 1 hora</span>; el distrés persistente se asocia a volúmenes espontáneos altos, que pueden llevar a la lesión pulmonar autoinducida (P-SILI), y retrasar la intubación es un riesgo (${p(88)}).` + enFicha(U, 'nep-no-olvides-intubar') }
    ],
    examen: [
      { id: 'vnu-e1', corto: '10 % o 10 mmHg', tipo: 'test', fuente: 'nep-respuesta-1h', origen: 'ficha; las cifras 60 y 53, ilustrativas',
        enunciado: 'PaCO₂ basal de 60 mmHg en un EPOC con VNI; a la hora es 53. Con el criterio del cap. 26 (el de esta ficha), ¿cómo responde?',
        opciones: [
          { t: 'Mal: bajó 7 mmHg, menos de lo esperable', porque: `El criterio de este capítulo es una bajada de al menos un 10 %, no de 10 mmHg; 7 mmHg son un 11,7 % (${p(81)}). Intubarías a un paciente que responde.` },
          { t: 'Bien: bajó el 11,7 %, más del 10 % que pide el capítulo', ok: true },
          { t: 'No se puede decir sin la conciencia: es el criterio principal a la hora', porque: `La alteración mental tarda más y no debe usarse como señal temprana (${p(81)}).` }],
        explicacion: `(60 − 53) / 60 = <span class="hl-verde">11,7 %</span>, más del 10 % del cap. 26 (${p(81)}).`,
        nota: `<b>Las fuentes discrepan</b>: el cap. 23 (<a class="biblio-link" href="${PDF}#page=26" target="_blank" rel="noopener">pág. 26</a>) habla de reducir la PaCO₂ «en 10 mmHg». Con 60 → 53 los dos criterios se separan: se muestran las dos cifras y no se elige una.` + enFicha(U, 'nep-respuesta-1h') },
      { id: 'vnu-e2', corto: 'rechazan intubar', tipo: 'test', fuente: 'nep-vni-candidatos',
        enunciado: 'Los criterios de selección no se aplican a los pacientes que rechazan la intubación. ¿Qué proporción de los que reciben VNI la rechaza?',
        opciones: [
          { t: 'El 2 %, una cifra excepcional que no cambia nada', porque: `Se reporta en el 20 % de los receptores de VNI (${p(80)}). Con esa idea no preguntarías antes por el límite del tratamiento.` },
          { t: 'El 50 %, la mitad de los pacientes', porque: `La cifra es el 20 % (${p(80)}), una quinta parte, no la mitad.` },
          { t: 'El 20 %, uno de cada cinco receptores', ok: true }],
        explicacion: `La negativa a la intubación y a la ventilación mecánica se reporta en el <span class="hl-rojo">20 % de los pacientes que reciben VNI</span> (${p(80)}).` + enFicha(U, 'nep-vni-candidatos') },
      { id: 'vnu-e3', corto: 'HFNO en inmunodeprimidos', tipo: 'test', fuente: 'nep-hfno-vni',
        enunciado: 'En pacientes inmunocomprometidos con fallo hipoxémico agudo, ¿cómo es el HFNO frente a la VNI para evitar la intubación?',
        opciones: [
          { t: 'Solo equivalente, igual que en el resto de pacientes', porque: `Hay evidencia de que el HFNO es superior a la VNI para prevenir la intubación en inmunocomprometidos (${p(83)}). Elegirías la mascarilla.` },
          { t: 'Superior, según la evidencia disponible', ok: true },
          { t: 'Inferior, porque la presión protege', porque: `Es al revés: puede ser más eficaz que la VNI en estos pacientes (${p(84)}).` }],
        explicacion: `Hay evidencia de que el HFNO es <span class="hl-purpura">superior a la VNI</span> para prevenir la intubación en inmunocomprometidos (${p(83)}-${p(84)}).` + enFicha(U, 'nep-hfno-vni') },
      { id: 'vnu-e4', corto: 'el VD sufre más', tipo: 'test', fuente: 'nep-precarga-vias',
        enunciado: 'La presión pleural positiva baja la presión transmural telediastólica. ¿Qué ventrículo sufre más y por qué?',
        opciones: [
          { t: 'El izquierdo, porque su pared es más gruesa', porque: `La fuente dice que pesa más en el derecho (${p(85)}). Vigilarías el ventrículo equivocado al subir la presión.` },
          { t: 'Ambos igual: la transmural depende solo de la pleural', porque: `El efecto es mayor en el VD porque su presión de cámara al final de la diástole es más baja (${p(85)}).` },
          { t: 'El derecho: su presión telediastólica es más baja', ok: true }],
        explicacion: `Tiene <span class="hl-rojo">mayor efecto sobre el llenado del VD</span>, porque la presión de la cámara al final de la diástole es más baja en el derecho (${p(85)}).` + enFicha(U, 'nep-precarga-vias') },
      { id: 'vnu-e5', corto: 'la Ec. 26.1', tipo: 'test', fuente: 'nep-ec-26-1', origen: 'ficha; las cifras 120, −5 y +10, ilustrativas',
        enunciado: 'La presión del VI en la sístole es 120 mmHg. ¿Cuál es la poscarga con una presión pleural de −5 y con una de +10?',
        opciones: [
          { t: '115 con −5 y 130 con +10: la pleural positiva la sube', porque: `La ecuación resta la pleural: Poscarga = presión de la cámara − presión pleural (${p(87)}); con −5 resultan 125, no 115.` },
          { t: '125 con −5 y 110 con +10: la pleural positiva baja la poscarga', ok: true },
          { t: '120 en ambos: la poscarga solo depende de la resistencia sistémica', porque: `La poscarga es una presión transmural y también depende de la pleural (${p(86)}-${p(87)}).` }],
        explicacion: `<span class="hl-azul">Poscarga = presión de la cámara − presión pleural</span> (Ec. 26.1): 120 − (−5) = 125 y 120 − 10 = <span class="hl-verde">110</span> (${p(87)}).` + enFicha(U, 'nep-ec-26-1') }
    ],
    profundizar: [
      { id: 'nep-reticencia-intubar', titulo: 'La reticencia a intubar al EPOC avanzado y sus riesgos' },
      { id: 'nep-poscarga', titulo: 'Qué es la poscarga: más que la resistencia sistémica' }
    ],
    casos: [
      { id: 'c-vni-herminia2', titulo: 'Herminia, 76 años: la CPAP y su corazón', corto: 'Caso · Herminia (uso clínico)', sub: 'Continúa de la ficha anterior: CPAP 10 bien tolerada tras cambiar la interfaz',
        paciente: { Edad: '76 años, mujer', Peso: '92 kg, 1,55 m (PBW 47,9 kg)', Antecedentes: 'hipertensión; en la ficha anterior, edema agudo de pulmón con CPAP', Motivo: 'sigue con CPAP 10 cmH₂O' },
        pasos: [
          { momento: 'Antes de seguir', datos: { Estado: 'despierta, colabora, sin vómitos ni convulsiones (del paciente)', Circulación: 'sin colapso (del paciente)' }, nuevo: ['Estado', 'Circulación'],
            pregunta: { id: 'vnu-c1', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-tabla-26-1', origen: 'ficha; el estado de la paciente, del caso',
              enunciado: 'Con la lista de la Tabla 26.1 delante: ¿qué condiciones que la excluirían no tiene Herminia?',
              puntos: [
                `<span class="hl-verde">No hay colapso circulatorio</span> potencialmente mortal ni respiración agónica (${p(81)}).`,
                `<span class="hl-verde">Está despierta y colabora</span>: sin agitación grave, sin estado confusional agudo y sin coma con la vía aérea desprotegida (${p(81)}).`,
                `<span class="hl-verde">Sin hematemesis ni vómitos persistentes</span> (${p(81)}).`],
              explicacion: `Responde NO a las seis condiciones, así que sigue siendo candidata (${p(81)}).` + enFicha(U, 'nep-tabla-26-1') } },
          { momento: 'A los 15 minutos', datos: { 'Volumen sistólico (monitor, ilustrativo)': '35 → 38 mL', 'Gasto cardíaco (monitor, ilustrativo)': '3,5 → 3,6 L/min', Observación: 'la presión arterial sube con cada insuflación (del paciente)' }, nuevo: ['Volumen sistólico (monitor, ilustrativo)', 'Gasto cardíaco (monitor, ilustrativo)', 'Observación'],
            pregunta: { id: 'vnu-c2', tipo: 'test', fuente: 'nep-vni-edema', origen: 'ficha; las cifras del monitor, ilustrativas',
              modeloVivo: pv('cpap-eap', '🫁 Herminia: CPAP de 0 a 10'),
              enunciado: 'Al poner CPAP 10 el monitor del modelo pasa de VS 35 a 38 mL y de GC 3,5 a 3,6 L/min. ¿Cómo lo lees?',
              opciones: [
                { t: 'Bien: suben un poco, porque la presión positiva le baja la poscarga al VI', ok: true },
                { t: 'Mal: el VS sube porque la presión comprime el ventrículo y sobrecarga su pared', porque: `La presión positiva disminuye la poscarga del VI; no la aumenta (${p(87)}). Quitarías la CPAP a quien se beneficia.` },
                { t: 'Irrelevante: el gasto cardíaco no depende de la presión del tórax', porque: `La presión intratorácica positiva puede aumentar el volumen sistólico (${p(83)}).` }],
              explicacion: `Sube el volumen sistólico por la <span class="hl-azul">menor poscarga</span> del VI (${p(83)}). La magnitud es del modelo (ilustrativa); la fuente da el sentido y no un porcentaje.` + enFicha(U, 'nep-vni-edema') } },
          { momento: 'El giro · la PA', datos: { Plan: 'cuatro frases del residente' }, nuevo: ['Plan'],
            pregunta: { id: 'vnu-c3', tipo: 'error', fuente: 'nep-poscarga-vpp · nep-corazon-papel', origen: 'ficha',
              enunciado: 'Plan del residente: «la PA sube con cada insuflación». Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Mantengo la CPAP: la paciente la tolera y la presión positiva ayuda en este corazón.' },
                { t: 'Quito la CPAP: si la PA sube con cada insuflación, aumenta la poscarga del VI.', mal: true, c: 'Con presión positiva la poscarga del VI baja, y la subida de la PA es un reflejo del mayor volumen sistólico.' },
                { t: 'Sigo midiendo el PaO₂/FiO₂ y la PaCO₂ a la hora para ver si la VNI funciona.' },
                { t: 'Como Herminia tiene el corazón enfermo, la CPAP le bajará el gasto igual que a un corazón sano.', mal: true, c: 'El corazón que falla está en la parte plana de la curva de precarga y la empinada de la de poscarga: la presión positiva tiende a promover el gasto.' }],
              explicacion: `Dos confusiones: leer la <span class="hl-rojo">subida de la PA</span> como mayor poscarga (es mayor volumen sistólico, ${p(83)}) y olvidar que <span class="hl-azul">el corazón que falla se beneficia</span> (${p(88)}).` + enFicha(U, 'nep-corazon-papel') } },
          { momento: 'A la hora', datos: { 'PaO₂/FiO₂': '95 → 180 (del paciente)', FR: '22 (del paciente)' }, nuevo: ['PaO₂/FiO₂', 'FR'],
            calculadora: { ir: 'neumo-vni-respuesta-tipo', nombre: 'Evaluador de respuesta a la 1.ª hora' },
            pregunta: { id: 'vnu-c4', tipo: 'test', fuente: 'nep-respuesta-pf', origen: 'ficha; los datos de Herminia, del caso',
              enunciado: 'A la hora, el PaO₂/FiO₂ de Herminia ha pasado de 95 a 180 y la FR de 32 a 22. ¿Qué decides?',
              opciones: [
                { t: 'Intubar ya: el cociente sigue por debajo de 200 y la hipoxemia sigue siendo grave', porque: `El criterio de fracaso es que el cociente no aumente a la hora (${p(82)}); aquí casi se duplica y baja el distrés.` },
                { t: 'Seguir con la CPAP: el cociente sube y baja el distrés', ok: true },
                { t: 'Subir la CPAP a 15 para consolidar la mejoría', porque: `La CPAP se usa a 5-10 cmH₂O (${p(77)}) y más presión frena el llenado del corazón (${p(86)}).` }],
              explicacion: `Mejoran el <span class="hl-verde">cociente</span> y el <span class="hl-verde">distrés</span>: hay evidencia de beneficio a la hora (${p(82)}, ${p(88)}).` + enFicha(U, 'nep-respuesta-pf') } },
          { momento: 'Furosemida y nitroglicerina', datos: { PA: '100/60 (del paciente)', Tratamiento: 'furosemida y nitroglicerina (del paciente)', CPAP: '10 cmH₂O, sin cambios' }, nuevo: ['PA', 'Tratamiento', 'CPAP'],
            pregunta: { id: 'vnu-c5', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-precarga-vpp · nep-precarga-vias', origen: 'ficha; los datos de Herminia, del caso',
              modeloVivo: pv('vpp-corazon-normal', '🫁 Con el corazón sano, la misma presión baja el volumen sistólico'),
              enunciado: 'Con la PA en 100/60 tras el diurético y el vasodilatador, ¿por qué la misma CPAP puede perjudicar ahora?',
              puntos: [
                `<span class="hl-rojo">La hipovolemia magnifica el freno al llenado</span>: la presión positiva es una amenaza para el llenado, mayor si falta volumen (${p(86)}).`,
                `<span class="hl-azul">El ventrículo derecho es el más sensible</span>: la presión transmural telediastólica cae más porque su presión de cámara es más baja (${p(85)}); si el VD no llena, tampoco el VI.`],
              explicacion: `Marino pide <span class="hl-rojo">evitar la hipovolemia</span> con presión positiva (${p(86)}). ${DED} Que el diurético y la nitroglicerina bajen el llenado sale de la fisiología general; vigilar la PA y reevaluar la presión es la conducta lógica, no una pauta de la fuente.` + enFicha(U, 'nep-precarga-vpp') } }
        ],
        lleva: [
          'Seis condiciones descartan la VNI; se juzga a la hora (PaCO₂ ≥10 % menos, o PaO₂/FiO₂ mayor).',
          'En el corazón que falla, la presión positiva baja la poscarga del VI y sube el volumen sistólico; la PA que sube con la insuflación lo refleja.',
          'La misma presión frena el llenado en el sano y más en el hipovolémico: vigila el volumen intravascular.'],
        volver: { nombre: 'El papel de la función cardíaca', ancla: 'nep-corazon-papel', modelo: pv('cpap-eap', '🫁 Herminia con CPAP') } }
    ]
  }
};
