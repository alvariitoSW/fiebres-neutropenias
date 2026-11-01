// Mayéutica del bloque 3D (Marino cap. 28, págs. 30-33 del PDF): ficha neumo-peep-oculta y el caso de Eulalia.
// Datos puros; el formato está en la cabecera de b1-fluidos.js. Modelo vivo: pulmón vivo (estados «broncoespasmo-auto-peep»,
// «auto-peep-corregida», «eulalia-conectada», «eulalia-ajustada»). Las cifras de Eulalia en el monitor se leyeron en la app a
// 390 px (autonomo/bloques/b3/herramientas/m-pulmon-cifras.mjs), no en el motor; los datos «(del paciente)» son del caso.
const PDF = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const PDF_A = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const pa = n => `<a class="biblio-link" href="${PDF_A}#page=${n}" target="_blank" rel="noopener">cap. 23, pág. ${n}</a>`;
const DED = '<i>Deducción; la fuente no lo dice.</i>';
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const PO = 'neumo-peep-oculta';
const pv = (clave, texto) => ({ pulmonVivo: clave, texto });

export const MAYEUTICA_PEEP_OCULTA = {
  'neumo-peep-oculta': {
    entrada: 'Por qué la PEEP oculta no se ve en las presiones, qué le hace al corazón y al pulmón, cómo se mide con la oclusión (y cuándo miente) y qué se hace: dar tiempo para espirar antes que poner PEEP.',
    guia: [
      { id: 'po-g1', corto: 'qué la causa', tipo: 'test', fuente: 'nep-definicion-oculta',
        enunciado: 'Marino define la PEEP oculta como un vaciado incompleto de los pulmones. Antes de leer: ¿qué la provoca y qué la empeora?',
        opciones: [
          { t: 'Una obstrucción grave de la vía aérea, que se agrava con la respiración rápida y los volúmenes tidales altos', ok: true },
          { t: 'Poner una PEEP externa alta; con una PEEP baja nunca aparece y el flujo espiratorio de cada ciclo siempre llega a cero', porque: `La causa es el vaciado incompleto en la obstrucción de la vía aérea, no la PEEP aplicada (${p(31)}). Con esa idea quitarías PEEP a un asmático sin tocar la frecuencia, que es lo que agrava la trampa.` },
          { t: 'Una compliance baja del pulmón: se agrava con volúmenes tidales pequeños y frecuencias lentas', porque: `Se agrava justo al contrario: con la respiración rápida y los volúmenes altos (${p(31)}). Si subes la frecuencia pensando en compensar, atrapas más aire.` }],
        explicacion: `Es el resultado de un <span class="hl-azul">vaciado incompleto</span>: frecuente en la obstrucción grave de la vía aérea (es la responsable de la hiperinflación del asma aguda) y <span class="hl-rojo">agravada por la respiración rápida y los volúmenes altos</span> (${p(31)}).` + enFicha(PO, 'nep-definicion-oculta'),
        modeloVivo: pv('broncoespasmo-auto-peep', '🫁 Jacinto: la PEEP oculta con FR 24') },
      { id: 'po-g2', corto: 'cuatro efectos', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'nep-efectos',
        modeloVivo: pv('eulalia-conectada', '🫁 Eulalia recién conectada: la presión media y la PEEP oculta'),
        enunciado: 'Una paciente con asma grave, hipotensa al conectarla, tiene una PVC de 18 mmHg. ¿Por qué esa PVC puede mentir, y qué otros tres efectos tiene la PEEP oculta?',
        puntos: [
          `<span class="hl-rojo">La PVC miente</span>: la PEEP oculta se transmite a la vena cava superior y crea un aumento espurio de la presión venosa central (${p(31)}).`,
          `<span class="hl-azul">Frena el corazón</span>: sube la presión intratorácica media, que puede impedir el retorno venoso y bajar el gasto cardíaco (${p(31)}).`,
          `<span class="hl-azul">Más trabajo respiratorio</span>: la hiperinflación exige presiones negativas mayores para meter el volumen tidal («respira profundo y trata de respirar desde ahí») (${p(31)}).`,
          `<span class="hl-rojo">Más riesgo para el pulmón</span>: sube el volumen y la presión alveolares al final de la inspiración, y con ellas el volutrauma y el barotrauma (${p(31)}).`],
        explicacion: `Los cuatro efectos adversos de Marino (${p(31)}). El primero es el que engaña al que mira el monitor: aquí una PVC alta no apunta a sobrecarga de líquido.` + enFicha(PO, 'nep-efectos') },
      { id: 'po-g3', corto: 'fácil de ver', tipo: 'test', fuente: 'nep-monitorizacion-oculta · nep-fig-28-9',
        enunciado: 'La PEEP oculta es «fácil de detectar pero difícil de cuantificar». ¿Dónde se detecta y por qué no sale en las presiones del respirador?',
        opciones: [
          { t: 'En la curva de presión de la vía aérea, donde la línea base queda por encima de cero al final de cada espiración, como una PEEP externa', porque: `Es lo que no ocurre: la presión proximal vuelve a cero al final de la espiración mientras la alveolar sigue positiva (${p(32)}). Si la buscas en la curva de presión no la verás nunca.` },
          { t: 'En la onda de flujo espiratorio: sigue habiendo flujo al final de la espiración mientras la presión proximal vuelve a cero', ok: true },
          { t: 'En la presión meseta, que sube cuando hay PEEP oculta', porque: `La PEEP oculta no es evidente en las presiones de la vía aérea monitorizadas (${p(31)}). Con una meseta normal darías por descartada una hiperinflación que sigue ahí.` }],
        explicacion: `La prueba la da la <span class="hl-azul">onda de flujo espiratorio</span> (flujo al final de la espiración, Fig. 23.5, ${pa(28)}); para ponerle cifra hace falta la oclusión. Es «oculta» porque la presión de la vía aérea proximal vuelve a cero (${p(31)}-${p(32)}).` + enFicha(PO, 'nep-monitorizacion-oculta'),
        modeloVivo: pv('broncoespasmo-auto-peep', '🫁 Mira el flujo final: no llega a cero') },
      { id: 'po-g4', corto: 'oclusión y esfuerzo', tipo: 'test', fuente: 'nep-oclusion',
        enunciado: 'Ocluyes el circuito espiratorio al final de la espiración y la presión salta. ¿Por qué ese método solo es fiable si el paciente no respira por sí mismo?',
        opciones: [
          { t: 'Porque la oclusión debe hacerse justo al final de la espiración y con respiración espontánea no se puede cronometrar', ok: true },
          { t: 'Porque con respiración espontánea desaparece la PEEP oculta y la maniobra siempre da cero', porque: `La PEEP oculta no desaparece: lo que falla es el momento de la oclusión (${p(31)}). Con esa idea darías por resuelta la hiperinflación de un paciente que sigue atrapando aire.` },
          { t: 'Porque solo es fiable por debajo de 20 resp/min: por encima la espiración es demasiado corta para ocluir', porque: `La fuente no pone límite de frecuencia: el requisito es que el paciente no respire espontáneamente (${p(31)}). Con esa idea medirías mal en uno que dispara.` }],
        explicacion: `Con el flujo detenido, la presión proximal iguala la alveolar al final de la espiración; <span class="hl-rojo">pero la oclusión tiene que caer justo al final de la espiración</span>, y eso no se puede cronometrar si el paciente respira solo: <span class="hl-rojo">solo es fiable en pacientes que no respiran espontáneamente</span> (${p(31)}).` + enFicha(PO, 'nep-oclusion'),
        modeloVivo: pv('eulalia-conectada', '🫁 Ocluye: la presión que sale es la PEEP oculta') },
      { id: 'po-g5', corto: 'cuatro maniobras', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'nep-manejo-oculta',
        modeloVivo: pv('auto-peep-corregida', '🫁 Jacinto: FR 12, flujo 80, Vt 400'), origen: 'ficha; las cifras del monitor, ilustrativas (Jacinto)',
        enunciado: 'Todas las maniobras contra la PEEP oculta buscan lo mismo. ¿Qué se cambia en el respirador (cuatro maniobras) y qué precio pueden tener?',
        puntos: [
          `<span class="hl-azul">Reducir el volumen tidal</span>: hay menos aire que sacar (${p(32)}).`,
          `<span class="hl-azul">Subir el flujo inspiratorio</span>: la inspiración dura menos y queda más tiempo para espirar: el I:E «se sube aumentando el flujo inspiratorio» (${p(9)}; lo lista como maniobra en ${p(32)}).`,
          `<span class="hl-azul">Reducir el tiempo inspiratorio</span> (en control por presión) <span class="hl-azul">y la frecuencia respiratoria</span>, si se puede (${p(32)}).`,
          `<span class="hl-rojo">El precio</span>: algunas bajan el volumen minuto, lo que puede no ser deseable (${p(32)}).`],
        explicacion: `Todas «promueven el vaciado alveolar durante la espiración» (${p(32)}). Con el modelo: Jacinto con FR 24 tiene una PEEP oculta de unos 6,4 cmH₂O; con FR 12 baja a 1,5 y el volumen minuto cae de 12 a 6 L/min (monitor).` + enFicha(PO, 'nep-manejo-oculta') },
      { id: 'po-g6', corto: 'PEEP aplicada: 2 errores', tipo: 'error', fuente: 'nep-peep-aplicada · nep-oclusion',
        enunciado: 'Nota del residente de guardia sobre un asmático ventilado, sedado y sin esfuerzos. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'La PEEP aplicada debe bastar para contrarrestar la presión que colapsa las vías pequeñas.' },
          { t: 'Midió una PEEP oculta de 14 cmH₂O; pongo una PEEP externa de 16 para vencerla.', mal: true, c: 'La PEEP aplicada no debe superar la oculta, para no estorbar el flujo espiratorio: justo por debajo de 14.' },
          { t: 'Antes de tocar la PEEP, alargo la espiración: menos volumen, más flujo y menos frecuencia.' },
          { t: 'Si el paciente se despierta y dispara el respirador, la oclusión al final de la espiración sigue siendo igual de fiable.', mal: true, c: 'Con respiración espontánea no se puede cronometrar la oclusión: solo es fiable en pacientes que no respiran espontáneamente.' },
          { t: 'Mantener abiertas las vías pequeñas con PEEP ayuda a reducir la hiperinflación.' }],
        explicacion: `La PEEP aplicada tiene un techo y una meta: contrarrestar el colapso de las vías pequeñas <span class="hl-rojo">sin superar la PEEP oculta</span>, es decir, justo por debajo (${p(32)}); y la oclusión solo sirve en quien no respira solo (${p(31)}).` + enFicha(PO, 'nep-peep-aplicada'),
        origen: 'ficha; las cifras 14 y 16, ilustrativas' },
      { id: 'po-g7', corto: 'si respira solo', tipo: 'test', fuente: 'nep-peep-aplicada',
        enunciado: 'Un paciente con EPOC respira espontáneamente sobre el respirador: no puedes medir la PEEP oculta con la oclusión. ¿Cómo sabes si la PEEP aplicada ayuda?',
        opciones: [
          { t: 'Repites la oclusión varias veces y te quedas con la mayor cifra, que será la más cercana a la real', porque: `El método no es fiable si respira espontáneamente, por mucho que se repita (${p(31)}). Tomarías una cifra mala para ajustar la PEEP.` },
          { t: 'Pones la PEEP máxima que tolere y compruebas que la presión pico baja en el monitor', porque: `La señal es el flujo al final de la espiración, no la presión pico (${p(32)}); con esa PEEP podrías superar la oculta y estorbar la espiración.` },
          { t: 'Vigilas el flujo al final de la espiración: si la PEEP aplicada lo reduce o elimina, baja la oculta', ok: true }],
        explicacion: `Si el paciente respira solo, el método alternativo es <span class="hl-azul">monitorizar el flujo al final de la espiración</span> mientras aplicas PEEP (${p(32)}). El resultado sigue siendo PEEP (aplicada en vez de oculta), pero reduce el riesgo de atelectrauma por abrir y cerrar las vías pequeñas (${p(32)}-${p(33)}).` + enFicha(PO, 'nep-peep-aplicada') },
      { id: 'po-g8', corto: 'una semana', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-palabra-final-28',
        enunciado: 'Una paciente lleva una semana en el respirador. ¿Qué dos condiciones hacen que Marino pase a traqueostomía, y para qué sirve?',
        puntos: [
          `<span class="hl-azul">Sin mejoría tras la primera semana</span> de ventilación (${p(33)}).`,
          `<span class="hl-azul">Poca probabilidad de extubar</span> en la semana siguiente (${p(20)}). La traqueostomía da comodidad al paciente y mejor eliminación de secreciones (${p(33)}).`],
        explicacion: `El curso de los primeros días anticipa lo que viene: se considera la traqueostomía a la semana si <span class="hl-rojo">no mejora y hay poca probabilidad de extubar</span> (${p(33)}; ${p(20)}).` + enFicha(PO, 'nep-palabra-final-28') }
    ],
    examen: [
      { id: 'po-e1', corto: '≤3 en el SDRA', tipo: 'test', fuente: 'nep-definicion-oculta',
        enunciado: 'En pacientes dependientes del ventilador, ¿en cuáles se considera universal la PEEP oculta y qué nivel es frecuente en el SDRA?',
        opciones: [
          { t: 'Universal en el SDRA y la EPOC; niveles de hasta 8 cmH₂O frecuentes en el asma', porque: `Universal es en el asma y la EPOC, y en el SDRA los niveles frecuentes son ≤3 cmH₂O (${p(31)}). Con esa idea culparías a la PEEP oculta de una meseta alta que es del pulmón rígido.` },
          { t: 'Universal en asma y EPOC; ≤3 cmH₂O en el SDRA', ok: true },
          { t: 'Universal en el asma, la EPOC y el SDRA, con niveles ≤8 cmH₂O en el SDRA', porque: `El texto la considera universal solo en el asma y la EPOC; en el SDRA, ≤3 cmH₂O, no ≤8 (${p(31)}). Medirías en cada SDRA una oclusión que casi nunca da una cifra relevante.` }],
        explicacion: `Universal <span class="hl-rojo">en asma y EPOC</span>; en el SDRA, solo niveles bajos, <span class="hl-rojo">≤3 cmH₂O</span> (${p(31)}).` + enFicha(PO, 'nep-definicion-oculta') },
      { id: 'po-e2', corto: 'justo por debajo', tipo: 'test', fuente: 'nep-peep-aplicada', origen: 'ficha; la cifra de 10, ilustrativa',
        enunciado: 'Ante una PEEP oculta de 10 cmH₂O medida por oclusión, ¿qué nivel de PEEP aplicada es el correcto?',
        opciones: [
          { t: 'Cualquier nivel por encima de 10, pues más PEEP vacía mejor', porque: `Superar la PEEP oculta impide el flujo espiratorio y empeora el atrapamiento (${p(32)}).` },
          { t: 'Ninguna: toda PEEP externa suma a la oculta y empeora el atrapamiento', porque: `La PEEP aplicada justo por debajo de la oculta no impide el vaciado y mantiene abiertas las vías pequeñas (${p(32)}); Marino solo añade que probablemente no merece la pena (${p(33)}).` },
          { t: 'Justo por debajo de 10, sin impedir el flujo espiratorio', ok: true }],
        explicacion: `El nivel debe bastar para contrarrestar la presión que cierra las vías pequeñas y <span class="hl-rojo">no exceder la PEEP oculta</span>: <span class="hl-azul">justo por debajo</span> (${p(32)}).` + enFicha(PO, 'nep-peep-aplicada') },
      { id: 'po-e3', corto: 'no merece la pena', tipo: 'test', fuente: 'nep-peep-aplicada',
        enunciado: '¿Qué opina Marino de tratar la PEEP oculta con PEEP aplicada?',
        opciones: [
          { t: 'Que, a efectos prácticos, probablemente no merece la pena el esfuerzo', ok: true },
          { t: 'Que es el tratamiento de primera línea, antes de tocar el volumen o la frecuencia', porque: `Lo primero es promover el vaciado alveolar (volumen, flujo, tiempo inspiratorio, frecuencia) (${p(32)}); poner PEEP primero deja el atrapamiento sin tratar.` },
          { t: 'Que lo mismo da una que otra, así que no hace falta medir la oculta', porque: `El texto dice que el resultado sigue siendo PEEP, pero que la aplicada reduce el atelectrauma, y pide ajustarla a la oculta (${p(32)}-${p(33)}).` }],
        explicacion: `Tras explicarlo, el autor añade que reducir la PEEP oculta con PEEP aplicada <span class="hl-rojo">probablemente no merece la pena</span>: el resultado sigue siendo PEEP, aunque reduce el atelectrauma (${p(33)}).` + enFicha(PO, 'nep-peep-aplicada'),
        nota: `<b>Opinión del autor</b>: Marino lo añade «por completitud» en una nota aparte (${p(33)}).` },
      { id: 'po-e4', corto: 'qué mide la oclusión', tipo: 'test', fuente: 'nep-oclusion', origen: 'ficha; la cifra de 12, ilustrativa',
        enunciado: 'Con el circuito espiratorio ocluido al final de la espiración y sin flujo, la presión proximal marca 12 cmH₂O. ¿Qué es?',
        opciones: [
          { t: 'Una presión creada por la propia oclusión, porque el flujo empuja contra el circuito cerrado y la presión proximal sube', porque: `Con flujo cero no hay caída de presión entre el alvéolo y la vía proximal (${p(31)}-${p(32)}); la cifra es presión alveolar, no un artefacto. Con esa idea desconfiarías de una medida válida.` },
          { t: 'La presión alveolar al final de la espiración: con flujo cero, proximal y alveolar se igualan; es la PEEP oculta', ok: true },
          { t: 'La meseta del ciclo anterior, que se mantiene al ocluir', porque: `La meseta es de la pausa inspiratoria; la oclusión espiratoria mide la presión al final de la espiración (${p(31)}).` }],
        explicacion: `Con el flujo detenido la presión proximal iguala la alveolar al final de la espiración: <span class="hl-azul">la lectura es la PEEP oculta</span>, pues sin oclusión la proximal vuelve a cero mientras la alveolar sigue positiva (${p(31)}-${p(32)}).` + enFicha(PO, 'nep-oclusion'),
        nota: `<b>Las fuentes discrepan</b>: el cap. 27 (${p(15)}, ajustes del respirador) llama a la maniobra «al final de la inspiración»; aquí se sigue el cap. 28, que la describe como espiratoria.` }
    ],
    profundizar: [
      { id: 'nep-ajustes-oculta', titulo: 'La PEEP oculta en los ajustes del respirador (ficha de ajustes)' }
    ],
    casos: [
      { id: 'c-peep-eulalia', titulo: 'Eulalia, 27 años: hipotensa al conectarla', corto: 'Caso · Eulalia (PEEP oculta)', sub: 'Asma casi fatal ya intubada; la PA cae al ventilarla',
        paciente: { Edad: '27 años, mujer', Peso: '60 kg, 1,62 m (PBW 54 kg)', Antecedentes: 'asma; en la ficha anterior, tras el fracaso de la VNI, fue intubada', Motivo: 'recién conectada al respirador' },
        pasos: [
          { momento: 'Al conectar', datos: { PA: '78/40 (del paciente)', FC: '128 (del paciente)', Ajustes: 'Vt 500, FR 26, flujo 60', 'Flujo final': '−13 L/min: no llega a cero', 'Pico': '42,4 cmH₂O' }, nuevo: ['PA', 'Ajustes', 'Flujo final', 'Pico'],
            pregunta: { id: 'po-c1', tipo: 'test', fuente: 'nep-monitorizacion-oculta · nep-fig-28-9', origen: 'ficha: la onda de flujo; el monitor, de la app; la PA, del paciente',
              modeloVivo: pv('eulalia-conectada', '🫁 Eulalia recién conectada'),
              enunciado: 'Eulalia está hipotensa justo después de conectarla. Antes de pensar en volumen, ¿qué miras en el respirador?',
              opciones: [
                { t: 'La onda de flujo espiratorio: si no llega a cero hay PEEP oculta', ok: true },
                { t: 'La PVC: si está alta, es que hay sobrecarga y el problema es cardíaco', porque: `La PEEP oculta se transmite a la cava superior y eleva la PVC de forma espuria (${p(31)}); concluirías una falla cardíaca que no es.` },
                { t: 'La curva de presión de la vía aérea: la PEEP oculta se ve como una línea base elevada', porque: `La PEEP oculta no es evidente en las presiones de la vía aérea: la proximal vuelve a cero (${p(31)}-${p(32)}). Seguirías buscándola donde no está.` }],
              explicacion: `Aquí el flujo final es de <span class="hl-rojo">−13 L/min y no llega a cero</span> (monitor): hay aire atrapado que frena el retorno venoso (${p(31)}; Fig. 23.5, ${pa(28)}).` + enFicha(PO, 'nep-monitorizacion-oculta') } },
          { momento: 'La oclusión', datos: { 'Oclusión al final de la espiración': '14,1 cmH₂O (PEEP oculta)', 'Presión media': '10,4 cmH₂O', PVC: '18 mmHg (del paciente)' }, nuevo: ['Oclusión al final de la espiración', 'Presión media', 'PVC'],
            pregunta: { id: 'po-c2', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-efectos', origen: 'ficha; las cifras, del monitor',
              modeloVivo: pv('eulalia-conectada', '🫁 Ocluye: 14 cmH₂O de PEEP oculta'),
              enunciado: 'Eulalia está sedada y sin esfuerzo: ocluyes y la presión marca 14,1 cmH₂O. Con la presión media en 10,4 y la PVC en 18, ¿qué tres efectos de la PEEP oculta tiene?',
              puntos: [
                `<span class="hl-rojo">Hipotensión</span>: la presión intratorácica media sube y frena el retorno venoso y el gasto cardíaco (${p(31)}).`,
                `<span class="hl-rojo">PVC espuria</span>: la 18 incluye la PEEP oculta transmitida a la cava superior (${p(31)}).`,
                `<span class="hl-azul">Riesgo de volutrauma y barotrauma</span>: más volumen y presión alveolares al final de la inspiración (${p(31)}). Ojo: lo que marca ese riesgo es la presión alveolar, no el pico de 42,4 (${p(4)}).`],
              explicacion: `Sedada y sin esfuerzo, la oclusión <span class="hl-azul">es fiable</span> (${p(31)}). Cada cifra se explica por los efectos adversos de la PEEP oculta.` + enFicha(PO, 'nep-efectos') } },
          { momento: 'El plan del residente', datos: { Plan: 'cuatro frases del residente' }, nuevo: ['Plan'],
            pregunta: { id: 'po-c3', tipo: 'error', fuente: 'nep-efectos · nep-manejo-oculta', origen: 'ficha',
              modeloVivo: pv('eulalia-conectada', '🫁 Eulalia con FR 26: ¿mejor subirla?'),
              enunciado: 'Plan del residente para Eulalia. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Como está sedada y no respira por sí misma, la oclusión al final de la espiración me da una cifra fiable.' },
                { t: 'La PVC de 18 es la presión de llenado real del corazón: está congestiva.', mal: true, c: 'La PEEP oculta se transmite a la cava y crea un aumento espurio de la PVC.' },
                { t: 'Subo la frecuencia para bajar el CO₂.', mal: true, c: 'La respiración rápida agrava la PEEP oculta; las maniobras buscan promover el vaciado, y reducir la frecuencia si es posible.' },
                { t: 'El flujo final que no llega a cero me confirma el atrapamiento de aire.' }],
              explicacion: `Dos confusiones típicas: leer la PVC como volumen (es <span class="hl-rojo">espuria</span>) y subir la FR, que <span class="hl-rojo">exacerba</span> la PEEP oculta (${p(31)}-${p(32)}).` + enFicha(PO, 'nep-efectos') } },
          { momento: 'El ajuste', datos: { Ajustes: 'Vt 333 (6,2 mL/kg PBW), FR 10, flujo 80', 'Oclusión': '1,6 cmH₂O', 'Flujo final': 'llega a cero', 'Presión media': '1,5 cmH₂O', 'Volumen minuto': '3,3 L/min', PA: '104/62 (del paciente)' }, nuevo: ['Ajustes', 'Oclusión', 'Flujo final', 'Presión media', 'Volumen minuto', 'PA'],
            pregunta: { id: 'po-c4', tipo: 'test', fuente: 'nep-manejo-oculta', origen: 'ficha: el precio; el monitor, de la app; la PA, del paciente',
              modeloVivo: pv('eulalia-ajustada', '🫁 Eulalia ajustada: FR 10, Vt 6 mL/kg'),
              enunciado: 'Tras ajustar, la PEEP oculta casi desaparece y la PA se recupera. ¿Qué has pagado?',
              opciones: [
                { t: 'Volumen minuto: ventilas menos y el CO₂ tenderá a subir', ok: true },
                { t: 'Un pico más alto por el flujo de 80, con más riesgo de barotrauma', porque: `El riesgo de barotrauma lo marca la presión alveolar (la meseta), no el pico (${p(4)}); y el precio descrito es el volumen minuto (${p(32)}).` },
                { t: 'Hipoxemia grave, porque con menos frecuencia el oxígeno no entra', porque: `El precio descrito es el volumen minuto (${p(32)}); la oxigenación no es lo que se paga con esta maniobra.` }],
              explicacion: `Vt × FR = 333 × 10 ≈ <span class="hl-rojo">3,3 L/min</span> frente a 13 antes (monitor). El libro solo dice que <span class="hl-rojo">algunas maniobras reducen el volumen minuto y eso puede no ser deseable</span> (${p(32)}).`,
              nota: `<b>La fuente no lo dice para el asma:</b> cuánta hipercapnia se tolera. Lo que Marino tolera en el SDRA (hipercapnia permisiva): PaCO₂ de 60-70 mmHg y pH de 7,2-7,25 son seguros para la mayoría; el objetivo del protocolo es pH 7,30-7,45 (<a class="biblio-link" href="${PDF_A}#page=49" target="_blank" rel="noopener">cap. 24, pág. 49</a>).` + enFicha(PO, 'nep-manejo-oculta') } },
          { momento: 'El giro · despierta', datos: { Estado: 'se despierta y dispara el respirador (del paciente)' }, nuevo: ['Estado'],
            pregunta: { id: 'po-c5', tipo: 'test', fuente: 'nep-oclusion · nep-peep-aplicada', origen: 'ficha; el estado de la paciente, del caso',
              modeloVivo: pv('eulalia-ajustada', '🫁 Eulalia ajustada'),
              enunciado: 'Eulalia se despierta y empieza a disparar el respirador. El residente quiere repetir la oclusión para «confirmar» que sigue sin PEEP oculta. ¿Qué le dices?',
              opciones: [
                { t: 'Que la repita tres veces y promedie, y así compensa los esfuerzos', porque: `El método solo es fiable en pacientes que no respiran espontáneamente (${p(31)}); promediar cifras malas no las arregla.` },
                { t: 'Que ya no hace falta: con respiración espontánea la PVC vuelve a ser fiable y basta con ella', porque: `La PVC sigue siendo espuria mientras haya PEEP oculta (${p(31)}); el método alternativo es mirar el flujo al final de la espiración (${p(32)}).` },
                { t: 'La oclusión ya no vale con respiración espontánea; vigila el flujo final', ok: true }],
              explicacion: `<span class="hl-rojo">Con respiración espontánea la oclusión no es fiable</span>; el flujo final sí se puede seguir (${p(31)}-${p(32)}).` + enFicha(PO, 'nep-oclusion') } },
          { momento: 'Si no se puede alargar más', datos: { 'Oclusión (ilustrativo)': '12 cmH₂O con la FR en el mínimo tolerado' }, nuevo: ['Oclusión (ilustrativo)'],
            pregunta: { id: 'po-c6', tipo: 'test', fuente: 'nep-peep-aplicada', origen: 'ficha; la cifra, ilustrativa',
              enunciado: 'Otra noche, con la FR ya en el mínimo que tolera y sin esfuerzos, la oclusión sigue en 12 cmH₂O. Quieres añadir PEEP externa. ¿Cuánta?',
              opciones: [
                { t: 'Igual a 12, para neutralizarla exactamente', porque: `No debe superar a la oculta; el nivel correcto es justo por debajo (${p(32)}). Igualarla ya estorba el flujo espiratorio.` },
                { t: '14, para vencer los 12 de PEEP oculta', porque: `Superar la PEEP oculta impide el flujo espiratorio (${p(32)}); sumarías atrapamiento en una asmática hipotensa.` },
                { t: 'Justo por debajo de 12, sin superar la oculta', ok: true }],
              explicacion: `<span class="hl-azul">Justo por debajo</span> de la oculta, para contrarrestar el colapso sin impedir la espiración (${p(32)}). Marino añade que probablemente no merece la pena (${p(33)}).`,
              nota: `<b>La fuente no lo dice:</b> el valor exacto (10, 11…); «justo por debajo» es todo el criterio del libro.` + enFicha(PO, 'nep-peep-aplicada') } },
          { momento: 'Día 8', datos: { Evolución: 'sigue en el respirador, sin mejoría desde hace una semana (del paciente)' }, nuevo: ['Evolución'],
            pregunta: { id: 'po-c7', tipo: 'test', fuente: 'nep-palabra-final-28', origen: 'ficha',
              enunciado: 'Una semana después, Eulalia sigue ventilada sin mejorar y con poca probabilidad de extubarla la semana próxima. ¿Qué propones?',
              opciones: [
                { t: 'Seguir igual: el curso de los primeros días ya no importa', porque: `El curso de los primeros días orienta lo que viene; si no mejora tras la primera semana, procede la traqueostomía (${p(33)}).` },
                { t: 'Traqueostomía: por comodidad y para eliminar mejor las secreciones', ok: true },
                { t: 'Solo vigilar eventos adversos: no hay otra decisión', porque: `Vigilar eventos adversos es la mayor parte del manejo diario (${p(33)}), pero la traqueostomía es la decisión de la semana.` }],
              explicacion: `<span class="hl-azul">Sin mejoría tras la primera semana, traqueostomía</span> (${p(33)}).` + enFicha(PO, 'nep-palabra-final-28') } }
        ],
        lleva: [
          'El flujo que no llega a cero al final de la espiración delata la PEEP oculta; la presión de la vía aérea no.',
          'La oclusión mide la PEEP oculta solo si el paciente no respira solo; la PVC se infla y no habla de volumen.',
          'Se trata dando tiempo para espirar (menos volumen, más flujo, menos frecuencia), pagando volumen minuto; la PEEP aplicada, justo por debajo.'],
        volver: { nombre: 'La oclusión al final de la espiración', ancla: 'nep-oclusion', modelo: pv('eulalia-conectada', '🫁 Eulalia en el pulmón vivo') } }
    ]
  }
};
