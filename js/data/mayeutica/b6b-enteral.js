// Estudiar (Texto | Estudiar) de las fichas del bloque 6b, grupo 6F · El intestino se defiende comiendo
// (Marino, cap. 49, nutrición enteral): mu-enteral-indicaciones, mu-formulas (de consulta), mu-pauta-enteral y
// mu-complicaciones-enteral de js/modules/libros/marino-nutricion.html. La pinta js/core/mayeutica.js. Datos puros.
// Formato: el de js/data/mayeutica/b1-fluidos.js.
//
// Fuente: docs/marino-2024-nutricion-endocrino-caps48-51.pdf, págs. 18-35 (desplazamiento 0; las tablas 49.2-49.4 son
// imagen en el PDF y sus páginas son la 20, la 21 y la 23). Cada explicación y cada distractor dicen su página.
// Los pacientes se inventan (Práxedes, Escolástica, Filomena, Cipriano); las cifras de los casos que salen de una
// calculadora son las que da la calculadora real de la ficha.

const NE = 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf';
const pdf = (p, t = `PDF pág. ${p}`) => `<a class="biblio-link" href="${NE}#page=${p}" target="_blank" rel="noopener">${t}</a>`;

export const MAYEUTICA_ENTERAL = {
  /* =================================================================================================
     5 · Nutrición enteral: por qué, cuándo y cuándo no (NE págs. 18-19)
     ================================================================================================= */
  'mu-enteral-indicaciones': {
    entrada: 'Por qué comer protege del intestino como fuente de sepsis, cuándo empezar sin esperar ruidos y qué contraindica de verdad la enteral (Tabla 49.1), con el vasopresor como duda típica.',
    guia: [
      { id: 'en-i-g1', corto: 'ayuno y sepsis', tipo: 'test', fuente: 'mu-ent-trofismo · mu-ent-infeccion',
        enunciado: 'Lleva cuatro días en ayunas «para dejar descansar el intestino». ¿Por qué eso le expone a más sepsis y no a menos?',
        opciones: [
          { t: 'Sin nutrientes en la luz se pierde el efecto trófico: la mucosa se atrofia, falla la barrera y los gérmenes entéricos pasan con más facilidad', ok: true },
          { t: 'Sin comer, la flora del intestino se multiplica más deprisa, satura la pared y la invade desde dentro por exceso de carga bacteriana sobre la mucosa', porque: 'El libro no habla de proliferación: habla de pérdida del trofismo y atrofia de la mucosa. Si piensas que el ayuno es solo un problema de flora, te quedarás con antibióticos y no con restablecer la barrera (p. 18).' },
          { t: 'Sin comer, el organismo no tiene energía para fabricar sus defensas generales y el paciente se infecta por una carencia calórica global', porque: 'El mecanismo del libro es local, en la pared del intestino (barrera e inmunidad de la mucosa), no una carencia calórica general. Con esa idea creerías que basta con suero glucosado IV (p. 18).' }],
        explicacion: 'El volumen de nutrientes en la luz tiene un <span class="hl">efecto trófico</span> que mantiene la barrera frente a la translocación de gérmenes. En el reposo intestinal hay <span class="hl-rojo">atrofia progresiva</span> de la mucosa y más riesgo de invasión bacteriana (' + pdf(18) + '). Por eso la enteral se ve como una medida de control de la infección.' },
      { id: 'en-i-g2', corto: 'la solución parenteral por boca', tipo: 'test', fuente: 'mu-ent-trofismo',
        enunciado: 'Alguien propone dar la bolsa de nutrición parenteral por la sonda para «conseguir lo mismo». ¿Por qué no funciona?',
        opciones: [
          { t: 'Porque el intestino no absorbe bien las soluciones con glucosa concentrada y aminoácidos libres en la luz', porque: 'No es un problema de absorción: el libro dice que el efecto trófico no se produce con esa solución porque necesita masa de nutrientes en la luz. Quien cree lo contrario acabaría con una barrera sin proteger (p. 18).' },
          { t: 'Porque la barrera necesita volumen de nutrientes en la luz, no solo los combustibles (hidratos, proteínas, lípidos)', ok: true },
          { t: 'Porque la parenteral lleva demasiadas proteínas y electrolitos para la tolerancia del estómago y no se tolera bien en cantidades grandes', porque: 'El motivo del libro no es la cantidad de proteína, sino que el efecto depende del volumen de nutrientes y no de los combustibles. Pensarlo así lleva a buscar una bolsa «mejor» en vez de una fórmula enteral (p. 18).' }],
        explicacion: 'El efecto trófico requiere <span class="hl">volumen de nutrientes</span> («nutritional bulk»), no los combustibles en sí: la solución parenteral dada por vía oral <span class="hl-rojo">no lo produce</span>. La glutamina, combustible principal del enterocito, podría participar (' + pdf(18) + ').' },
      { id: 'en-i-g3', corto: 'noradrenalina estable', tipo: 'test', fuente: 'mu-ent-vasopresor · mu-ent-calc',
        enunciado: 'Predice y luego comprueba en la calculadora: shock séptico, noradrenalina a 0,12 µg/kg/min desde hace 12 h, sin cambios. ¿Empiezas la enteral?',
        opciones: [
          { t: 'No: cualquier vasopresor contraindica la enteral', porque: 'El libro dice lo contrario: las perfusiones estables o en descenso no la contraindican. Con ese «no» dejarías sin barrera a un paciente séptico durante días (p. 19).' },
          { t: 'No hasta retirar el vasopresor por completo y confirmar que el shock se ha resuelto', porque: 'No hace falta retirarlo: solo se frena en el shock no controlado o progresivo. Esperar a la retirada retrasa la enteral más allá de las 48 h que se asocian a menos infecciones (p. 18-19).' },
          { t: 'Sí: estable o en descenso no la contraindica, y 0,12 no supera 0,2', ok: true }],
        explicacion: 'Solo el shock <span class="hl-rojo">no controlado o progresivo</span> contraindica la enteral. Con la perfusión estable se empieza; el umbral de 0,2 µg/kg/min solo recorta las calorías, no prohíbe (' + pdf(19) + ').' },
      { id: 'en-i-g4', corto: '48 h y ruidos', tipo: 'test', fuente: 'mu-ent-cuando',
        enunciado: 'Intubado, con 30 h de ingreso, sin contraindicaciones y sin ruidos intestinales a la auscultación. ¿Qué haces?',
        opciones: [
          { t: 'Espero a oír ruidos intestinales y después empiezo', porque: 'El libro dice que la presencia de ruidos no es necesaria para empezar. Esperar hace perder el margen de las 48 h y la reducción de infecciones que se le asocia (p. 18-19).' },
          { t: 'Espero a las 72 h para confirmar que no hay íleo y que el paciente está estable', porque: 'La recomendación es empezar dentro de las primeras 48 h del ingreso, salvo contraindicación; no hay un periodo de espera de 72 h en el capítulo (p. 19).' },
          { t: 'Empiezo ya: dentro de las 48 h del ingreso, sin exigir ruidos', ok: true }],
        explicacion: 'Si no puede comer: <span class="hl">enteral en las primeras 48 h</span> salvo contraindicación, y <span class="hl-rojo">no hace falta oír ruidos intestinales</span> (' + pdf(19) + '). El inicio precoz se asocia a una menor tasa de infecciones (' + pdf(18) + ').' },
    ],
    examen: [
      { id: 'en-i-e1', corto: 'qué sí contraindica', tipo: 'test', fuente: 'mu-tabla-49-1',
        enunciado: 'Según la Tabla 49.1, ¿cuál de estas situaciones sí es una contraindicación de la enteral por sonda?',
        opciones: [
          { t: 'Noradrenalina estable a 0,15 µg/kg/min', porque: 'Las perfusiones estables o en descenso no la contraindican (p. 19). Si la tomas por contraindicación, retiras la barrera a un paciente que la necesita.' },
          { t: 'Ausencia de ruidos intestinales', porque: 'No es contraindicación: no se requieren ruidos para empezar (p. 19).' },
          { t: 'Residuo gástrico de 600 mL en 6 h', ok: true },
          { t: 'Intubación con sedación continua', porque: 'La sedación no figura en la tabla; el crítico sedado e intubado es justo el que se alimenta por sonda (p. 19, 27).' }],
        explicacion: 'La Tabla 49.1 recoge ocho: shock no controlado, isquemia intestinal, hipoxemia o hipercapnia refractarias, hemorragia digestiva alta activa, obstrucción, fístula de alto débito, síndrome compartimental abdominal y <span class="hl-rojo">residuo gástrico >500 mL en 6 h</span> (' + pdf(19) + ').' },
      { id: 'en-i-e2', corto: 'noradrenalina alta', tipo: 'test', fuente: 'mu-ent-vasopresor',
        enunciado: 'Varón de 70 kg, shock séptico, noradrenalina estable a 18 µg/min. ¿Qué aporte calórico recomienda el capítulo?',
        opciones: [
          { t: '10-15 kcal/kg/día los primeros 7 días o hasta que haya mejoría', ok: true },
          { t: '25 kcal/kg/día, el aporte habitual, porque la perfusión es estable', porque: 'Estable no la contraindica, pero con noradrenalina >0,2 µg/kg/min (>14 µg/min en 70 kg) se recomiendan menos calorías. 18 µg/min son unos 0,26 µg/kg/min: sobrealimentarías a un paciente inestable (p. 19).' },
          { t: 'No alimentar hasta que la noradrenalina baje de 14 µg/min', porque: 'La cifra no prohíbe: recorta las calorías. Esperar privaría de la barrera a un paciente estable (p. 19).' }],
        explicacion: '18 µg/min ÷ 70 kg ≈ 0,26 µg/kg/min, por encima de <span class="hl">0,2 µg/kg/min (14 µg/min en 70 kg)</span>: se dan <span class="hl-rojo">10-15 kcal/kg/día en vez de 25</span> los primeros 7 días o hasta que mejore (' + pdf(19) + '). El paso a µg/kg/min es cálculo propio.' },
      { id: 'en-i-e3', corto: 'nota de evolución', tipo: 'error', fuente: 'mu-ent-cuando · mu-ent-vasopresor',
        enunciado: 'La nota de un compañero sobre un paciente séptico con vasopresor. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Empezar la enteral dentro de las primeras 48 h se asocia a menos infecciones.' },
          { t: 'Sin ruidos intestinales no se puede empezar la nutrición.', mal: true,
            c: 'La presencia de ruidos intestinales <span class="hl-rojo">no es necesaria</span> para empezar (p. 19).' },
          { t: 'La perfusión de noradrenalina estable no contraindica la enteral.' },
          { t: 'Un residuo gástrico >500 mL en 6 h es una contraindicación.' }],
        explicacion: 'La enteral precoz se asocia a menos infecciones (' + pdf(18) + '); no exige ruidos, el vasopresor estable no la contraindica y el residuo >500 mL en 6 h figura en la tabla (' + pdf(19) + ').' },
      { id: 'en-i-e4', corto: 'umbral de calorías', tipo: 'error', fuente: 'mu-ent-vasopresor',
        enunciado: 'Otra nota, sobre un paciente de 70 kg con noradrenalina. Puede tener 0, 1 o 2 errores.',
        frases: [
          { t: 'Con noradrenalina >0,2 µg/kg/min (>14 µg/min) se reducen las calorías.' },
          { t: 'La reducción es a 10-15 kcal/kg/día, en vez de las 25 habituales.' },
          { t: 'Se mantiene los primeros 7 días o hasta que mejore la situación.' },
          { t: 'En el shock no controlado o progresivo no se aconseja la enteral.' }],
        explicacion: 'Esta nota no tiene ningún error: reproduce el umbral, la reducción y la duración del capítulo (' + pdf(19) + ').' },
    ],
    casos: [
      { id: 'en-caso-praxedes', titulo: 'Práxedes, 63 años: el shock que sube y baja', corto: 'Práxedes', sub: 'Shock séptico: cuándo se puede alimentar y cuándo no',
        paciente: { Edad: '63 años, 70 kg', Ingreso: 'Shock séptico de origen abdominal, intubada', Fármacos: 'Noradrenalina' },
        pasos: [
          { momento: 'Día 1', datos: { Noradrenalina: '0,12 µg/kg/min, estable 12 h', Abdomen: 'blando, sin ruidos intestinales' }, nuevo: ['Noradrenalina', 'Abdomen'], calculadora: { ir: 'mu-ent-calc', nombre: '¿Puedo empezar la enteral?' },
            pregunta: { id: 'en-i-c1', tipo: 'test', fuente: 'mu-ent-calc',
              enunciado: 'Sin otras contraindicaciones, ¿qué decides con la calculadora?',
              opciones: [
                { t: 'Esperar a que vuelvan los ruidos y a que se retire la noradrenalina', porque: 'Ni los ruidos son necesarios ni el vasopresor estable contraindica. Retrasarías la enteral más allá de las 48 h (p. 19).' },
                { t: 'Empezar la enteral ya, con el aporte habitual', ok: true },
                { t: 'Empezar con 10-15 kcal/kg/día', porque: 'Esa reducción es para noradrenalina >0,2 µg/kg/min; con 0,12 corresponde el aporte habitual (p. 19).' }],
              explicacion: 'Estable y por debajo de 0,2: <span class="hl">se puede empezar en las primeras 48 h</span>, sin exigir ruidos (' + pdf(19) + ').' } },
          { momento: 'Día 1 · la objeción', datos: { Residente: '«Mejor esperar a que se resuelva el shock»' }, nuevo: ['Residente'],
            pregunta: { id: 'en-i-c2', tipo: 'destapa', fuente: 'mu-ent-infeccion · mu-ent-cuando',
              enunciado: 'El residente prefiere esperar. ¿Qué le contestas?',
              cuantas: 'son tres cosas',
              puntos: [
                'El vasopresor <span class="hl">estable o en descenso no contraindica</span> la enteral; solo el shock no controlado o progresivo.',
                'No hacen falta <span class="hl">ruidos intestinales</span> para empezar.',
                'Empezar en <span class="hl-rojo">48 h</span> se asocia a menos infecciones: la enteral protege la barrera.'],
              explicacion: 'Págs. ' + pdf(18, '18') + ' y ' + pdf(19, '19') + ' del capítulo.' } },
          { momento: 'Día 2', datos: { Noradrenalina: 'sube a 0,35 µg/kg/min y sigue subiendo', Estado: 'shock progresivo' }, nuevo: ['Noradrenalina', 'Estado'], calculadora: { ir: 'mu-ent-calc', nombre: 'Marca «Shock no controlado o progresivo»' },
            pregunta: { id: 'en-i-c3', tipo: 'test', fuente: 'mu-tabla-49-1 · mu-ent-calc',
              enunciado: 'Un giro: la dosis sube y el shock progresa. ¿Qué haces con la enteral?',
              opciones: [
                { t: 'Seguir igual: ya está en marcha', porque: 'El shock progresivo es la contraindicación nº 1 de la Tabla 49.1. Seguir alimentando con la perfusión creciendo expone al intestino isquémico (p. 19).' },
                { t: 'Reducirla a 10-15 kcal/kg/día y mantenerla', porque: 'Esa reducción es para el vasopresor estable por encima de 0,2; en el shock progresivo no se aconseja la enteral (p. 19).' },
                { t: 'Pararla: shock no controlado o progresivo', ok: true }],
              explicacion: '«Uncontrolled circulatory shock» abre la <span class="hl-rojo">Tabla 49.1</span>; en el shock progresivo no se aconseja la enteral (' + pdf(19) + ').' } },
          { momento: 'Día 2 · nota del residente', datos: { Nota: 'plan escrito por el residente de guardia' }, nuevo: ['Nota'],
            pregunta: { id: 'en-i-c4', tipo: 'error', fuente: 'mu-ent-vasopresor',
              enunciado: 'Revisas el plan del residente. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Pauso la enteral mientras el shock sea progresivo.' },
                { t: 'El límite de 0,2 µg/kg/min equivale a 14 µg/min en un adulto de 70 kg.' },
                { t: 'Por debajo de ese límite se recomiendan 10-15 kcal/kg/día en vez de 25.', mal: true,
                  c: 'Es <span class="hl-rojo">por encima</span> de 0,2 µg/kg/min (>14 µg/min en 70 kg) cuando se recomiendan 10-15 kcal/kg/día.' },
                { t: 'Puedo reanudarla con el vasopresor estable o en descenso.' }],
              explicacion: 'La reducción de calorías es para noradrenalina por encima de 0,2 µg/kg/min (' + pdf(19) + ').' } },
          { momento: 'Día 4', datos: { Noradrenalina: 'baja a 0,25 µg/kg/min y sigue descendiendo', Estado: 'shock en resolución' }, nuevo: ['Noradrenalina', 'Estado'], calculadora: { ir: 'mu-ent-calc', nombre: 'Noradrenalina 0,25' },
            pregunta: { id: 'en-i-c5', tipo: 'test', fuente: 'mu-ent-calc · mu-ent-vasopresor',
              enunciado: 'El shock cede, pero la noradrenalina sigue por encima de 0,2. Calcula cuántas kcal/día le corresponden (70 kg).',
              opciones: [
                { t: 'Unas 1.750 kcal/día: las 25 kcal/kg habituales', porque: 'Es el aporte habitual, que no corresponde con noradrenalina >0,2: sobrealimentarías a un paciente que aún no está estable (p. 19).' },
                { t: 'Entre 700 y 1.050 kcal/día: 10-15 kcal/kg', ok: true },
                { t: 'Ninguna: hasta retirar el vasopresor', porque: 'Estable o en descenso no contraindica la enteral (p. 19).' }],
              explicacion: 'Con noradrenalina >0,2 µg/kg/min y estable o en descenso: <span class="hl">10-15 kcal/kg/día</span> los primeros 7 días o hasta que mejore: 70 × 10 = 700 y 70 × 15 = <span class="hl-rojo">1.050 kcal/día</span> (cálculo propio, ' + pdf(19) + ').' } },
          { momento: 'Día 7', datos: { Alimentación: 'enteral reanudada, tolerada' }, nuevo: ['Alimentación'],
            pregunta: { id: 'en-i-c6', tipo: 'test', fuente: 'mu-ent-infeccion · mu-ent-final',
              enunciado: 'La familia pregunta por qué insistís en la sonda si «el suero le da lo mismo». ¿Qué respondes?',
              opciones: [
                { t: 'La sonda mantiene las defensas del intestino; la parenteral no lo hace', ok: true },
                { t: 'El suero no aporta calorías suficientes para cubrir el gasto del paciente séptico', porque: 'La diferencia que cuenta el libro no es calórica: la barrera de la mucosa se mantiene con la enteral y no con la parenteral (p. 18, 33).' },
                { t: 'La sonda es más barata y más cómoda de manejar para la enfermería', porque: 'No es el argumento del capítulo: la enteral es una medida de control de la infección porque la mucosa mantiene su barrera (p. 18).' }],
              explicacion: 'Las defensas antimicrobianas del intestino se sostienen con la enteral, <span class="hl-rojo">no con la parenteral</span>: comer es un mecanismo de defensa (' + pdf(18) + ' y ' + pdf(33) + ').' } },
        ],
        lleva: [
          'Vasopresor estable o en descenso no contraindica; shock no controlado o progresivo, sí.',
          'Por encima de 0,2 µg/kg/min: 10-15 kcal/kg/día los primeros 7 días; no se prohíbe, se recorta.',
          'Empezar en 48 h, sin ruidos: la enteral protege la barrera del intestino.'],
        volver: { nombre: '¿Puedo empezar la enteral?', ancla: 'mu-ent-calc' } },
    ],
    profundizar: [
      { id: 'mu-ent-trofismo', titulo: 'Las cuatro frases del trofismo, con la nota sobre la IgA' },
      { id: 'mu-ent-final', titulo: 'Comer como defensa antimicrobiana' },
    ],
  },

  /* =================================================================================================
     6 · Fórmulas enterales (ficha de consulta; NE págs. 20-23)
     ================================================================================================= */
  'mu-formulas': {
    entrada: 'Densidad y osmolalidad, fibra, cuándo el omega-3 y cuándo no la arginina, y la glutamina con su dosis: lo justo para elegir una fórmula.',
    guia: [
      { id: 'en-f-g1', corto: 'densidad y diarrea', tipo: 'test', fuente: 'mu-for-densidad · mu-tabla-49-2',
        enunciado: 'No hay restricción de líquidos. ¿Por qué eliges una fórmula de 1-1,2 kcal/mL y no una de 2?',
        opciones: [
          { t: 'Porque las de 2 kcal/mL llevan menos proteína que las estándar en cada litro', porque: 'Twocal HN lleva 84 g/L, más que las estándar de 35-65 g/L (p. 20). Elegirías por un motivo falso y desaprovecharías una fórmula útil cuando haya que restringir volumen.' },
          { t: 'Porque a más densidad, más osmolalidad, y eso promueve la diarrea', ok: true },
          { t: 'Porque las de 2 kcal/mL no cubren el gasto en reposo', porque: 'Cubren el mismo gasto con menos volumen; por eso se usan con restricción de líquidos, no porque no alcancen (p. 20).' }],
        explicacion: 'Las fórmulas de 1 y 1,2 kcal/mL son las habituales porque las más densas tienen <span class="hl-rojo">mayor osmolalidad</span> y promueven diarrea: Osmolite 1.2 tiene 360 mOsm/kg y Twocal HN, 710. Las de 1,5-2 kcal/mL, si el líquido es una prioridad (' + pdf(20) + ').' },
      { id: 'en-f-g2', corto: 'omega-3 y arginina', tipo: 'destapa', fuente: 'mu-for-omega3 · mu-for-pescado-uso · mu-for-arginina',
        enunciado: 'Dos pacientes: uno con SDRA y otro con sepsis grave en la UCI médica. ¿Qué piensas de las fórmulas inmunomoduladoras en cada uno?',
        cuantas: 'son tres cosas',
        puntos: [
          'Las de aceite de pescado (omega-3, p. ej. Oxepa) <span class="hl">no se usan de rutina</span>, pero hay algún beneficio en el <span class="hl-azul">SDRA</span>.',
          'La <span class="hl-rojo">arginina no</span> se usa en la UCI médica, sobre todo en la sepsis grave: el óxido nítrico puede dar hipotensión.',
          'La arginina se «considera» en el traumatismo craneoencefálico y en el perioperatorio de la cirugía mayor.'],
        explicacion: 'Omega-3: no rutinario, algo de beneficio en el SDRA (' + pdf(22) + '; Tabla 49.3 en ' + pdf(21) + '). Arginina: reduce infecciones en el perioperatorio de cirugía mayor y no se usa en la UCI médica (' + pdf(22) + ').' },
      { id: 'en-f-g3', corto: 'glutamina en el quemado', tipo: 'test', fuente: 'mu-for-glutamina · mu-glut-calc',
        enunciado: 'Quemado del 40 % de la superficie, 80 kg, con enteral. Predice y comprueba en la calculadora: ¿qué glutamina añades?',
        opciones: [
          { t: '16-24 g/día durante los primeros 5 días', porque: 'Esa es la dosis del trauma crítico (0,2-0,3 g/kg/día, 5 días). En el quemado >20 % la pauta es otra y te quedarías corto en dosis y en duración (p. 23).' },
          { t: 'Ninguna: la glutamina no se suplementa en la UCI', porque: 'Solo no se suplementa fuera del trauma crítico y del quemado >20 %; aquí sí está indicada (p. 23).' },
          { t: '24-40 g/día durante los primeros 10-15 días', ok: true }],
        explicacion: 'Quemado >20 %: <span class="hl">0,3-0,5 g/kg/día los primeros 10-15 días</span> de enteral: 0,3 × 80 = 24 y 0,5 × 80 = <span class="hl-rojo">40 g/día</span> (cálculo propio, ' + pdf(23) + '). Trauma crítico: 0,2-0,3 g/kg/día los primeros 5 días.' },
    ],
    examen: [
      { id: 'en-f-e1', corto: 'dos fibras', tipo: 'test', fuente: 'mu-for-fibra',
        enunciado: 'Un residente dice que toda la fibra de la fórmula «hace lo mismo». ¿Qué le corriges?',
        opciones: [
          { t: 'La fermentable da butirato, combustible del colonocito; la no fermentable retiene agua y ablanda las heces', ok: true },
          { t: 'La fermentable retiene agua en la luz y ablanda las heces; la no fermentable alimenta al colonocito con butirato', porque: 'Los papeles están al revés: la que fermentan las bacterias da los ácidos grasos de cadena corta (butirato) y la otra crea la fuerza osmótica (p. 21).' },
          { t: 'Las dos son fermentables y hacen lo mismo; solo cambia la cantidad de fibra por litro de fórmula', porque: 'Hay dos tipos con efecto distinto, y las fórmulas llevan una mezcla (la de más fibra es Jevity). Con ese error esperarías de la fibra un efecto que no tiene (p. 21).' }],
        explicacion: '<span class="hl-azul">Fermentable</span>: butirato como combustible del colonocito y crecimiento de microbios no patógenos. <span class="hl">No fermentable</span>: residuo osmótico que aumenta el agua de las heces (' + pdf(21) + ').' },
      { id: 'en-f-e2', corto: 'qué lleva la fórmula', tipo: 'error', fuente: 'mu-for-hc · mu-for-lipidos · mu-for-omega3',
        enunciado: 'Una diapositiva sobre la composición de las fórmulas. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Los hidratos aportan hasta el 70 % de las calorías.' },
          { t: 'Los lípidos estándar son poliinsaturados de aceites vegetales y aportan cerca del 30 % de las calorías.' },
          { t: 'Los poliinsaturados del aceite de pescado son precursores de mediadores inflamatorios.', mal: true,
            c: 'Son los de los <span class="hl-rojo">aceites vegetales</span> los que pueden ser precursores de eicosanoides inflamatorios; los omega-3 del pescado no promueven la inflamación (p. 21).' },
          { t: 'Influir en la inflamación con la dieta se llama inmunonutrición.' }],
        explicacion: 'Hidratos hasta el 70 %, lípidos cerca del 30 %, omega-3 que no promueven la inflamación e inmunonutrición (' + pdf(21) + ').' },
    ],
    casos: [
      { id: 'en-caso-escolastica', titulo: 'Escolástica, 78 años: el volumen manda', corto: 'Escolástica', sub: 'Elegir fórmula con restricción de líquidos y qué hacer con la diarrea',
        paciente: { Edad: '78 años, 55 kg', Ingreso: 'Insuficiencia cardiaca descompensada, enteral por sonda', Restricción: '1,2 L/día de líquidos totales; para la fórmula quedan unos 700 mL' },
        pasos: [
          { momento: 'Día 8 · aporte completo', datos: { 'GER (25 × 55 kg)': '1.375 kcal/día', Volumen: '700 mL para la fórmula' }, nuevo: ['GER (25 × 55 kg)', 'Volumen'],
            pregunta: { id: 'en-f-c1', tipo: 'test', fuente: 'mu-tabla-49-2 · mu-for-densidad',
              enunciado: 'Para dar 1.375 kcal en un máximo de 700 mL, ¿qué fórmula de la Tabla 49.2 sirve?',
              opciones: [
                { t: 'Osmolite 1.5 (1,5 kcal/mL): 917 mL', porque: 'Necesitaría unos 917 mL y no caben en los 700 mL disponibles (cálculo propio con la Tabla 49.2, p. 20).' },
                { t: 'Osmolite 1.2 (1,2 kcal/mL): 1.146 mL al día', porque: 'Es la que se prefiere sin restricción, pero pide 1.146 mL: excede el volumen que le queda y empeoraría su congestión (p. 20).' },
                { t: 'Twocal HN (2 kcal/mL): unos 688 mL/día', ok: true }],
              explicacion: '1.375 ÷ 2 = <span class="hl-rojo">688 mL/día</span>, unos 29 mL/h. Las de 1,5-2 kcal/mL son las que se usan cuando la restricción de líquidos es una prioridad (cálculo propio con la calculadora de la pauta, ' + pdf(20) + ' y ' + pdf(25) + ').' } },
          { momento: 'Día 10', datos: { Deposiciones: '7 líquidas al día', Fórmula: 'Twocal HN, 710 mOsm/kg' }, nuevo: ['Deposiciones'],
            pregunta: { id: 'en-f-c2', tipo: 'test', fuente: 'mu-for-densidad · mu-tabla-49-2',
              enunciado: 'Diarrea acuosa con la fórmula puesta. ¿Qué rasgo de la fórmula la explica?',
              opciones: [
                { t: 'Su alta osmolalidad (710 mOsm/kg) arrastra agua a la luz', ok: true },
                { t: 'Que lleva poca fibra (5 g/L) para ablandar y regular el tránsito', porque: 'La fibra no es el problema ni la solución: las fórmulas con fibra mezclan fermentable y no fermentable y no aportan ventaja en la diarrea (p. 32).' },
                { t: 'Que lleva proteína entera (polimérica) y no predigerida', porque: 'El texto no responsabiliza a la proteína entera: son las fórmulas hiperosmolares las que pueden causar diarrea acuosa (p. 32).' }],
              explicacion: 'Las fórmulas suelen ser <span class="hl-rojo">hiperosmolares</span> y arrastran agua a la luz del intestino (' + pdf(32) + '); la Tabla 49.2 da 710 mOsm/kg a Twocal HN (' + pdf(20) + ').' } },
          { momento: 'Día 10 · el plan', datos: { Dilema: 'la diarrea pide menos osmolalidad, el volumen pide más densidad' }, nuevo: ['Dilema'],
            pregunta: { id: 'en-f-c3', tipo: 'destapa', fuente: 'mu-for-densidad · mu-for-fibra',
              enunciado: 'El adjunto pregunta qué cambiarías. Plantéalo.',
              cuantas: 'son tres cosas',
              puntos: [
                'Una fórmula de <span class="hl">menor osmolalidad</span>, si es posible, aunque exija más volumen: lo hablas con el equipo.',
                'Una fórmula con proteínas <span class="hl">predigeridas</span> (elemental o semielemental): favorece la reabsorción de agua.',
                'La <span class="hl-rojo">fibra no ayuda</span> en la diarrea, ni la fermentable, porque las fórmulas llevan una mezcla.'],
              explicacion: 'Lo que dice el capítulo para la diarrea: menor osmolalidad si es posible, predigeridas y evitar los fármacos líquidos de la Tabla 49.6 (' + pdf(32) + '). Que choque con la restricción de líquidos es una decisión de equipo; el libro no la resuelve.' } },
          { momento: 'Día 11 · nota del residente', datos: { Nota: 'plan escrito por el residente' }, nuevo: ['Nota'],
            pregunta: { id: 'en-f-c4', tipo: 'error', fuente: 'mu-for-proteina · mu-for-fibra',
              enunciado: 'Revisas el plan del residente. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Twocal HN lleva 2 kcal/mL y 710 mOsm/kg de agua.' },
                { t: 'La «HN» indica más proteína (high nitrogen), un 20 % más que las estándar.' },
                { t: 'Para la diarrea paso a una con más fibra: la fibra la corta.', mal: true,
                  c: 'La fibra de las fórmulas es una mezcla de fermentable y no fermentable y <span class="hl-rojo">no aporta ventaja</span> en la diarrea (p. 32).' },
                { t: 'Reviso los fármacos líquidos que puedan llevar sorbitol.' }],
              explicacion: 'Densidad, osmolalidad y HN (' + pdf(20) + '); la fibra no ayuda y los líquidos con sorbitol sí pueden causar diarrea (' + pdf(32) + ').' } },
          { momento: 'Día 14 · bacteriemia', datos: { Estado: 'sepsis grave por catéter', Propuesta: 'cambiar a una fórmula con arginina' }, nuevo: ['Estado', 'Propuesta'],
            pregunta: { id: 'en-f-c5', tipo: 'test', fuente: 'mu-for-arginina',
              enunciado: 'Proponen una fórmula enriquecida en arginina «para las defensas». ¿Qué respondes?',
              opciones: [
                { t: 'No: en la UCI médica y la sepsis grave puede dar hipotensión por el óxido nítrico', ok: true },
                { t: 'Sí: reduce las infecciones en cualquier paciente crítico y mejora su pronóstico en la sepsis', porque: 'El beneficio documentado es en el perioperatorio de la cirugía mayor; en la sepsis grave se desaconseja (p. 22).' },
                { t: 'Sí, pero solo si la proteína es menor de 35 g/L', porque: 'Ese umbral no existe en el capítulo; el motivo para evitarla es el riesgo de hipotensión por óxido nítrico, no su proteína (p. 22).' }],
              explicacion: 'La arginina es precursora del óxido nítrico: en la <span class="hl-rojo">sepsis grave</span> hay riesgo de hipotensión, y no se usa en la UCI médica (' + pdf(22) + ').' } },
        ],
        lleva: [
          'Sin restricción, 1-1,2 kcal/mL; con restricción de líquidos, las de 1,5-2 kcal/mL.',
          'Más densidad es más osmolalidad: hasta el 70 % de los pacientes tiene diarrea y la fibra no la arregla.',
          'Omega-3 solo con algún beneficio en el SDRA; arginina no en la UCI médica ni en la sepsis grave.'],
        volver: { nombre: 'Densidad calórica', ancla: 'mu-for-densidad' } },
    ],
    profundizar: [
      { id: 'mu-for-carnitina', titulo: 'Carnitina: dosis y la unidad que imprime el libro' },
      { id: 'mu-for-exceso', titulo: '92 fórmulas y se usan pocas' },
      { id: 'mu-tabla-49-3', titulo: 'Tabla 49.3 · Fórmulas inmunomoduladoras' },
    ],
  },

  /* =================================================================================================
     7 · La pauta enteral y la sonda (NE págs. 23-30)
     ================================================================================================= */
  'mu-pauta-enteral': {
    entrada: 'Los cuatro pasos de la pauta (calorías, proteínas, fórmula, ritmo), el propofol que cuenta como comida y cómo saber dónde está la sonda cuando el paciente no tose.',
    guia: [
      { id: 'en-p-g1', corto: 'sonda sin tos', tipo: 'test', fuente: 'mu-sonda-pulmon',
        enunciado: 'Intubada y sedada, le pasas la sonda fina y no tose ni se queja. ¿Qué te dice eso de dónde está la punta?',
        opciones: [
          { t: 'Que está en el esófago o el estómago: si hubiera ido al pulmón la paciente habría tosido o se habría quejado', porque: 'En el crítico, sobre todo intubado y muy sedado, la sonda puede entrar en el pulmón sin tos ni signos de angustia. Quien se fía alimentaría a un pulmón (p. 27).' },
          { t: 'Nada: puede estar en el pulmón sin tos; se hace radiografía tras cada inserción antes de alimentar', ok: true },
          { t: 'Que está en el pulmón: el silencio de la paciente es precisamente la señal de alarma', porque: 'La ausencia de tos no indica nada en ningún sentido; la posición se confirma con radiografía, no con la reacción del paciente (p. 27).' }],
        explicacion: 'En ~1 % de las inserciones la sonda va al pulmón y el crítico <span class="hl-rojo">a menudo ni tose ni se queja</span>: radiografía portátil tras cada inserción y <span class="hl">no alimentar hasta confirmarlo</span> (' + pdf(27) + ').' },
      { id: 'en-p-g2', corto: 'el soplido', tipo: 'test', fuente: 'mu-sonda-whoosh',
        enunciado: 'La enfermera insufla aire y oye el «soplido» en el epigastrio. ¿Sirve para confirmar el estómago?',
        opciones: [
          { t: 'Sí: solo se oye si la punta está en el estómago, no si está en el pulmón o el esófago', porque: 'Un chorro de aire en el pulmón también se oye en el epigastrio. Alimentarías por una prueba que no distingue pulmón de estómago (p. 27).' },
          { t: 'Sí, si además aspiras líquido gástrico', porque: 'El capítulo no avala esa combinación; la prueba del soplido debe abandonarse y la posición se confirma radiográficamente (p. 27).' },
          { t: 'No: engaña, porque el aire en el pulmón también suena en el epigastrio', ok: true }],
        explicacion: 'El soplido <span class="hl-rojo">no confirma</span> que esté en el estómago («can be misleading, and should be abandoned»). La prueba es la radiografía (' + pdf(27) + ').' },
      { id: 'en-p-g3', corto: 'duodeno o estómago', tipo: 'test', fuente: 'mu-sonda-duodeno',
        enunciado: 'Sin regurgitación ni aspiración. ¿Dónde pones la punta, y por qué?',
        opciones: [
          { t: 'Duodeno: reduce mucho el riesgo de aspiración', porque: 'Los estudios no encuentran diferencia en el riesgo de aspiración entre estómago y duodeno; el duodeno es más difícil de lograr (p. 30).' },
          { t: 'Yeyuno desde el inicio, para no tener nunca residuo ni reflujo hacia el esófago', porque: 'El avance al duodeno o yeyuno se reserva para cuando falla el estómago y persiste el problema (p. 30-31).' },
          { t: 'Estómago: no cambia el riesgo de aspiración y es mucho más fácil', ok: true }],
        explicacion: 'Estómago por consenso; el duodeno es una opción <span class="hl">solo si hay regurgitación y aspiración problemáticas</span> (' + pdf(30) + ').' },
      { id: 'en-p-g4', corto: 'la pauta con propofol', tipo: 'test', fuente: 'mu-pauta-calc · mu-tabla-49-4 · mu-pauta-propofol',
        enunciado: 'Predice y luego usa la calculadora: 70 kg, propofol a 20 mL/h, Osmolite 1.2, primer día (70 % del GER). ¿A cuántos mL/h?',
        opciones: [
          { t: '42 mL/h: el GER entero menos el propofol', porque: 'Has dado el 100 % del GER (1.750 − 528 = 1.222 kcal), o el 70 % sin restar el propofol. Con ecuación se empieza al 70 % y descontando el propofol: así sobrealimentarías (p. 25-26).' },
          { t: '61 mL/h: el GER entero sin descontar el propofol', porque: 'El propofol aporta calorías (1,1 kcal/mL) y hay que restarlas: sin hacerlo sobrealimentarías con 528 kcal de más (p. 25).' },
          { t: '24 mL/h: (70 % del GER − propofol) ÷ 1,2 ÷ 24', ok: true }],
        explicacion: 'GER 25 × 70 = 1.750; 70 % = 1.225; propofol 20 × 1,1 × 24 = 528; 1.225 − 528 = 697 kcal ÷ 1,2 = 581 mL ÷ 24 = <span class="hl-rojo">24 mL/h</span> (la calculadora, con la Tabla 49.4 y la nota del propofol, ' + pdf(25) + ' y ' + pdf(26) + ').' },
    ],
    examen: [
      { id: 'en-p-e1', corto: 'cifras de la sonda', tipo: 'error', fuente: 'mu-sonda-pulmon · mu-sonda-co2 · mu-sonda-eco · mu-sonda-rx',
        enunciado: 'Un resumen sobre cómo comprobar la sonda. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'La sonda entra en el pulmón en cerca del 1 % de las inserciones.' },
          { t: 'La capnografía por la sonda tiene sensibilidad del 96 % y especificidad del 99 % para el pulmón.' },
          { t: 'La ecografía (sensibilidad 96 %, especificidad 91 %) ya ha sustituido a la radiografía.', mal: true,
            c: 'La ecografía <span class="hl-rojo">no ha sustituido</span> a la radiografía: se duda de su utilidad para detectar sondas mal colocadas (p. 28).' },
          { t: 'La punta ideal queda unos 10 cm bajo la cúpula del hemidiafragma.' }],
        explicacion: 'Pulmón ~1 % (' + pdf(27) + '); CO₂ 96/99 y la ecografía 96/91 sin sustituir a la radiografía (' + pdf(28) + ' y ' + pdf(29) + ').' },
      { id: 'en-p-e2', corto: 'límite del CO₂', tipo: 'test', fuente: 'mu-sonda-co2',
        enunciado: 'Mientras avanzas la sonda, el CO₂ no sube de 2 mmHg y no hay onda. ¿Qué conclusión es defendible?',
        opciones: [
          { t: 'No está en la vía aérea, pero no basta: hace falta la radiografía de tórax', ok: true },
          { t: 'Está en el estómago y puedes alimentar sin más pruebas porque no hay onda de CO₂', porque: 'No detecta la colocación errónea en el esófago (enrollada). Hace falta la radiografía antes de alimentar (p. 29).' },
          { t: 'Está en el pulmón: una cifra de CO₂ baja significa que la punta está en vía aérea', porque: 'La señal de vía aérea es la onda o el aumento a 15 mmHg, no un valor bajo (p. 29).' }],
        explicacion: 'Una onda o <span class="hl">15 mmHg</span> indica vía aérea (sensibilidad 96 %, especificidad 99 %). No detecta la sonda <span class="hl-rojo">enrollada en el esófago</span>, así que no reemplaza la radiografía (' + pdf(29) + ' y ' + pdf(30) + ').' },
      { id: 'en-p-e3', corto: 'pasos de la pauta', tipo: 'test', fuente: 'mu-tabla-49-4',
        enunciado: 'Según la Tabla 49.4, ¿qué hace el paso 4?',
        opciones: [
          { t: 'Calcular las calorías necesarias con 25 kcal/kg de peso y restar el propofol', porque: 'Eso es el paso 1 (GER); el último paso comprueba que se alcanzan las proteínas (p. 23-24).' },
          { t: 'Comprobar si la proteína aportada cubre la necesaria y, si no, añadir proteína en polvo', ok: true },
          { t: 'Dividir el volumen diario entre 24 para obtener el ritmo de perfusión continua en mL/h', porque: 'Es el paso 3b; el paso 4 ajusta las proteínas (p. 25).' }],
        explicacion: 'Paso 4: proteína aportada = <span class="hl">volumen (L/día) × proteína de la fórmula (g/L)</span>; si falta, <span class="hl-rojo">proteína en polvo</span> (' + pdf(25) + ').' },
      { id: 'en-p-e4', corto: 'primeros días', tipo: 'test', fuente: 'mu-pauta-inicio',
        enunciado: 'Calculas el GER con ecuación (sin calorimetría). ¿Cuánto das los primeros días?',
        opciones: [
          { t: 'No más del 70 % del GER durante los 7 primeros días del soporte nutricional', ok: true },
          { t: 'El 100 % del GER desde el primer día, para recuperar el balance cuanto antes', porque: 'Se empieza por debajo: la adaptación endógena (gluconeogénesis) de la fase aguda sumada a toda la nutrición lleva a sobrealimentar (p. 25).' },
          { t: 'No más del 70 % solo los 3 primeros días, y luego el 100 %', porque: 'Esos 3 días son para cuando el GER se mide con calorimetría indirecta; con ecuación el 70 % se mantiene 7 días (p. 25-26).' }],
        explicacion: 'Con calorimetría: ≤70 % los 3 primeros días y subir al 100 % en la primera semana. Con ecuaciones: <span class="hl-rojo">≤70 % los 7 primeros días</span> (' + pdf(25) + ' y ' + pdf(26) + ').' },
    ],
    casos: [
      { id: 'en-caso-filomena', titulo: 'Filomena, 44 años: la sonda que no dice nada', corto: 'Filomena', sub: 'Colocar la sonda, descubrirla en el pulmón y calcular la pauta',
        paciente: { Edad: '44 años, 70 kg', Ingreso: 'Traumatismo craneoencefálico, intubada', Sedación: 'propofol a 20 mL/h', Sonda: 'fina de 8 French con fiador' },
        pasos: [
          { momento: 'Día 1 · tras la inserción', datos: { Sonda: 'introducida 55 cm, sin tos ni quejas' }, nuevo: ['Sonda'],
            pregunta: { id: 'en-p-c1', tipo: 'test', fuente: 'mu-sonda-pulmon · mu-sonda-rx',
              enunciado: 'La sonda ha entrado sin tos ni queja. ¿Qué haces antes de alimentar?',
              opciones: [
                { t: 'Radiografía portátil de tórax y no alimentar hasta comprobar la posición del tubo', ok: true },
                { t: 'Auscultar el epigastrio mientras insuflas aire y comprobar que se oye el soplido', porque: 'El soplido no distingue pulmón de estómago; debe abandonarse (p. 27).' },
                { t: 'Empezar con la mitad del ritmo y vigilar durante unas horas si tose o se queja', porque: 'Una sedada e intubada no tose aunque la sonda esté en el pulmón (p. 27).' }],
              explicacion: 'Radiografía de tórax tras <span class="hl-rojo">cada</span> inserción; las 55 cm del caso están dentro de los 50-60 cm de la distancia NEX (cálculo del caso, ' + pdf(26) + ' y ' + pdf(27) + ').' } },
          { momento: 'Día 1 · la radiografía', datos: { Rx: 'la sonda se desvía a la derecha a la altura de la carina' }, nuevo: ['Rx'],
            pregunta: { id: 'en-p-c2', tipo: 'destapa', fuente: 'mar-img-49-3 · mu-sonda-mal',
              enunciado: 'Ves la radiografía de Filomena. ¿Qué haces y por qué?',
              cuantas: 'son tres cosas',
              puntos: [
                'La sonda <span class="hl-rojo">se desvía</span> a la derecha, siguiendo el bronquio principal derecho: está en el pulmón, no en el esófago.',
                '<span class="hl">Retirarla y no alimentar</span>: nada de fórmula hasta confirmar una posición correcta.',
                'Riesgo de <span class="hl">neumotórax</span>: fina y con fiador rígido, puede llegar lejos y perforar la pleura.'],
              explicacion: 'Figura 49.3: la sonda se desvía a la derecha en la carina siguiendo el bronquio principal derecho; en la 49.2, recta y biseca la carina (' + pdf(28) + ' y ' + pdf(29) + ').' } },
          { momento: 'Día 1 · el comentario de la enfermera', datos: { Nota: '«Auscultación epigástrica positiva: se puede alimentar»' }, nuevo: ['Nota'],
            pregunta: { id: 'en-p-c3', tipo: 'error', fuente: 'mu-sonda-whoosh · mu-sonda-co2',
              enunciado: 'El plan que dejan escrito para la segunda inserción. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Auscultación epigástrica positiva: puede alimentarse.', mal: true,
                  c: 'El soplido <span class="hl-rojo">no confirma</span> el estómago: el aire en el pulmón también se oye en el epigastrio (p. 27).' },
                { t: 'Monitorizaré el CO₂ por la sonda mientras avanzo.' },
                { t: 'Radiografía de tórax tras la nueva inserción.' },
                { t: 'Si la punta queda bajo la cúpula izquierda, es probable que esté en el estómago.' }],
              explicacion: 'El capítulo manda abandonar el soplido (' + pdf(27) + '); el CO₂ detecta el pulmón pero no sustituye a la radiografía (' + pdf(29) + ').' } },
          { momento: 'Día 1 · segunda inserción', datos: { 'CO₂ por la sonda': 'sin onda, <15 mmHg', Rx: 'recta por el mediastino, punta 10 cm bajo la cúpula izquierda' }, nuevo: ['CO₂ por la sonda', 'Rx'],
            pregunta: { id: 'en-p-c4', tipo: 'test', fuente: 'mar-img-49-2 · mu-sonda-rx',
              enunciado: 'Segunda radiografía: ¿es la posición óptima y puedes alimentar?',
              opciones: [
                { t: 'No: si la punta está bajo la cúpula, hay que subirla hasta la unión gastroesofágica para evitar el reflujo', porque: 'Al revés: unos 10 cm bajo la cúpula está lejos de la unión gastroesofágica y reduce el reflujo al esófago (p. 27).' },
                { t: 'Sí: recta por el mediastino y punta unos 10 cm bajo la cúpula del hemidiafragma izquierdo', ok: true },
                { t: 'Aún no: hace falta la ecografía para confirmar', porque: 'La radiografía es la prueba; la ecografía no la ha sustituido (p. 28).' }],
              explicacion: 'Trayecto recto por el mediastino que biseca la carina: esófago. Punta bajo la cúpula izquierda: probablemente estómago; óptimo, <span class="hl">unos 10 cm bajo la cúpula</span> (' + pdf(27) + '). Ya puedes alimentar.' } },
          { momento: 'Día 1 · la pauta', datos: { 'GER (25 × 70 kg)': '1.750 kcal/día; 70 % = 1.225', Propofol: '20 mL/h × 1,1 × 24 = 528 kcal' }, nuevo: ['GER (25 × 70 kg)', 'Propofol'], calculadora: { ir: 'mu-pauta-calc', nombre: 'Crear la pauta enteral' },
            pregunta: { id: 'en-p-c5', tipo: 'test', fuente: 'mu-pauta-calc · mu-pauta-propofol',
              enunciado: 'Con la calculadora (70 kg, Osmolite 1.2, 1,6 g/kg, propofol 20 mL/h, inicio al 70 %): ¿volumen y ritmo?',
              opciones: [
                { t: 'Unos 1.018 mL al día, es decir 42 mL/h', porque: 'Es la pauta al 100 % del GER menos el propofol; el primer día con ecuación es el 70 %, y darías 42 mL/h sobrealimentando (p. 25-26).' },
                { t: 'Unos 1.458 mL al día, es decir unos 61 mL/h', porque: 'Es el 100 % del GER sin restar propofol (1.750 ÷ 1,2): sobrealimentarías con 528 kcal de propofol (p. 25).' },
                { t: 'Unos 581 mL al día, es decir unos 24 mL/h', ok: true }],
              explicacion: '1.225 − 528 = 697 kcal ÷ 1,2 = <span class="hl-rojo">581 mL/día = 24 mL/h</span> (' + pdf(25) + '). El libro da 1,1 y 1 kcal/mL para el propofol; la calculadora de la ficha usa 1,1 y con 1 daría 26 mL/h.' } },
          { momento: 'Día 1 · las proteínas', datos: { 'Proteína necesaria': '1,6 × 70 = 112 g/día', 'Proteína aportada': '581 mL × 56 g/L = 33 g' }, nuevo: ['Proteína necesaria', 'Proteína aportada'],
            pregunta: { id: 'en-p-c6', tipo: 'test', fuente: 'mu-tabla-49-4',
              enunciado: 'La fórmula solo aporta 33 g de los 112 g de proteína que necesita. ¿Qué haces?',
              opciones: [
                { t: 'Añadir proteína en polvo a la fórmula', ok: true },
                { t: 'Cambiar a una fórmula de 2 kcal/mL', porque: 'No hay restricción de líquidos y las más densas solo se usan cuando el volumen es una prioridad (p. 25).' },
                { t: 'Aceptar la diferencia: la proteína no importa en la fase aguda', porque: 'El capítulo exige ajustar la proteína (1,2-2,0 g/kg/día; mediana 1,6) y no admite ese desfase (p. 25).' }],
              explicacion: 'Paso 4: si la proteína aportada queda corta, <span class="hl-rojo">se añade proteína en polvo</span> (' + pdf(25) + '). 33 g es 0,581 L × 56 g/L; 112 g es 1,6 × 70 (cálculo propio).' } },
        ],
        lleva: [
          'Sin tos ni queja no se descarta el pulmón: radiografía tras cada inserción y no alimentar hasta verla.',
          'El soplido engaña; el CO₂ detecta el pulmón pero no sustituye a la radiografía.',
          'Pauta: 70 % del GER los primeros días, restar el propofol, ritmo = volumen ÷ 24 y ajustar la proteína.'],
        volver: { nombre: 'Crear la pauta enteral', ancla: 'mu-pauta-calc' } },
    ],
    profundizar: [
      { id: 'mu-tabla-49-4', titulo: 'Tabla 49.4 · Los cuatro pasos y la nota de las proteínas' },
      { id: 'mu-nota-propofol', titulo: 'Propofol: 1,1 frente a 1 kcal/mL' },
    ],
  },

  /* =================================================================================================
     8 · Complicaciones de la nutrición enteral (NE págs. 30-35)
     ================================================================================================= */
  'mu-complicaciones-enteral': {
    entrada: 'La sonda que se obstruye, el residuo gástrico que no hay que medir de rutina, los procinéticos con su límite de días y la diarrea que traen los fármacos líquidos.',
    guia: [
      { id: 'en-c-g1', corto: 'residuo de rutina', tipo: 'test', fuente: 'mu-grv · mu-aspiracion',
        enunciado: 'En tu UCI miden el residuo gástrico cada turno y paran si pasa de 200 mL. ¿Por qué eso puede empeorar la nutrición del paciente?',
        opciones: [
          { t: 'Porque no reduce la aspiración ni mejora el pronóstico, pero interrumpe la nutrición', ok: true },
          { t: 'Porque un residuo bajo es en sí mismo un factor de riesgo de aspiración que hay que vigilar', porque: 'El libro no dice eso: dice que no hay pruebas de que vigilar el residuo reduzca la aspiración (p. 30-31).' },
          { t: 'Porque cada medida obstruye la sonda fina con más frecuencia y obliga a cambiarla', porque: 'No es el motivo del capítulo: la obstrucción se debe a precipitados proteicos por el reflujo ácido (p. 30). El problema del residuo son las interrupciones.' }],
        explicacion: 'El umbral de 150-250 mL «según el hospital» <span class="hl-rojo">no reduce la aspiración ni mejora los resultados</span> y es una causa frecuente de nutrición insuficiente (' + pdf(30) + ' y ' + pdf(31) + '). No medirlo de rutina; si se sospecha aspiración, >500 mL en 6 h justifica parar temporalmente.' },
      { id: 'en-c-g2', corto: 'eritromicina 3 días', tipo: 'test', fuente: 'mu-procineticos · mu-tabla-49-5',
        enunciado: 'Residuo de 600 mL en 6 h: paras la nutrición y pones eritromicina. ¿Por qué solo 3 días?',
        opciones: [
          { t: 'Porque alarga la microbiota y favorece las resistencias si se prolonga', porque: 'El libro dice lo contrario: tres días de eritromicina no alteran la microbiota. La razón del límite es otra (p. 31).' },
          { t: 'Porque su eficacia decae en pocos días (taquifilaxia)', ok: true },
          { t: 'Porque a partir del 4.º día prolonga el QT', porque: 'El QT se alarga con la eritromicina y la metoclopramida desde el principio (p. 31-32); no depende de pasar de 3 días.' }],
        explicacion: 'Es el procinético más eficaz y de primera línea, pero hay <span class="hl-rojo">taquifilaxia tras pocos días</span>: no más de 3 días (100-200 mg IV cada 8 h). Tres días no afectan a la microbiota residente (' + pdf(31) + ').' },
      { id: 'en-c-g3', corto: 'naloxona enteral', tipo: 'test', fuente: 'mu-procineticos',
        enunciado: 'Dismotilidad gástrica en un paciente con fentanilo que necesita seguir con analgesia. ¿Qué opción bloquea el opioide en el intestino sin quitar el efecto analgésico?',
        opciones: [
          { t: 'Naloxona IV en bolos, que antagoniza el opioide', porque: 'La IV revertiría también la analgesia. La opción que el libro propone es la naloxona directamente por la sonda (p. 32).' },
          { t: 'Metoclopramida 10 mg IV cada 8 h, que bloquea los receptores opioides', porque: 'La metoclopramida antagoniza la dopamina, no los receptores opioides, y su eficacia decae en pocos días (p. 31).' },
          { t: 'Naloxona enteral por la sonda: 8 mg cada 6 h, solo para opiáceos', ok: true }],
        explicacion: 'La naloxona intragástrica bloquea los receptores opioides del intestino <span class="hl">sin antagonizar la analgesia</span>: 8 mg por la sonda cada 6 h, solo para la dismotilidad por opiáceos (experiencia limitada) (' + pdf(31) + ' y ' + pdf(32) + ').' },
      { id: 'en-c-g4', corto: 'sonda ocluida', tipo: 'test', fuente: 'mu-oclusion · mu-oclusion-pasos',
        enunciado: 'La sonda fina va lenta. ¿Qué haces primero, y qué sigue si no funciona?',
        opciones: [
          { t: 'Pasar directamente la guía flexible y, si no funciona, cambiar la sonda', porque: 'La guía y el recambio son para la oclusión completa; con el flujo lento primero se prueba el agua tibia y las enzimas (p. 30).' },
          { t: 'Inyectar Viokase con carbonato sódico, y el agua tibia solo después', porque: 'El orden del capítulo es agua tibia primero (resuelve un 30 %) y las enzimas pancreáticas después, con pinzamiento de 5 minutos (p. 30).' },
          { t: 'Agua tibia (30 %); si no, Viokase con carbonato sódico (75 %) y pinzar', ok: true }],
        explicacion: 'Flujo lento: agua tibia (30 %); si no, <span class="hl">1 comprimido de Viokase y 1 de carbonato sódico (324 mg) en 5 mL</span>, pinzar 5 min y lavar (75 %). Oclusión completa: guía flexible o cambiar la sonda sin demora (' + pdf(30) + ').' },
    ],
    examen: [
      { id: 'en-c-e1', corto: 'nota de residuo', tipo: 'error', fuente: 'mu-grv-recomendaciones · mu-tabla-49-5',
        enunciado: 'La nota de guardia sobre un residuo elevado. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Residuo de 600 mL en 6 h con sospecha de aspiración: paro temporalmente la enteral.' },
          { t: 'Elevo el cabecero a 30° o más y pruebo un procinético.' },
          { t: 'Pauto eritromicina 100-200 mg IV cada 8 h durante 10 días.', mal: true,
            c: 'No más de <span class="hl-rojo">3 días</span>: su eficacia decae en pocos días (p. 31).' },
          { t: 'Si persiste al reanudar, avanzo el punto de infusión (estómago a duodeno).' }],
        explicacion: 'Residuo >500 mL en 6 h, cabecero ≥30° y procinético; si persiste, avanzar el punto de infusión (' + pdf(31) + ').' },
      { id: 'en-c-e2', corto: 'diarrea y fármacos', tipo: 'test', fuente: 'mu-diarrea · mu-diarrea-farmacos',
        enunciado: 'Diarrea en un paciente con enteral. ¿Qué rasgo de los fármacos líquidos por la sonda favorece la diarrea?',
        opciones: [
          { t: 'Osmolalidad ≥3.000 mOsm/kg y llevan sorbitol, un laxante', ok: true },
          { t: 'Que son isotónicos y se absorben poco en el intestino delgado', porque: 'Su problema es la hiperosmolalidad extrema (≥3.000 mOsm/kg), no ser isotónicos (p. 32).' },
          { t: 'Que llevan fibra fermentable que fermenta en el colon', porque: 'La fibra no está entre las causas que cita el capítulo para los líquidos; sí el sorbitol añadido para mejorar el sabor (p. 32).' }],
        explicacion: 'Se prefieren los líquidos por la sonda fina por riesgo de obstrucción menor, pero pueden ser <span class="hl-rojo">hiperosmolares (≥3.000 mOsm/kg)</span> y llevar sorbitol (Tabla 49.6, ' + pdf(32) + ').' },
      { id: 'en-c-e3', corto: 'diarrea y fibra', tipo: 'test', fuente: 'mu-diarrea-manejo',
        enunciado: 'La diarrea llega al 70 % de los pacientes con enteral. Para tratarla, ¿qué NO ayuda?',
        opciones: [
          { t: 'Una fórmula de menor osmolalidad, si es posible', porque: 'Es una de las medidas del capítulo (p. 32).' },
          { t: 'Una fórmula con fibra, que mezcla ambas', ok: true },
          { t: 'Una fórmula con proteínas predigeridas', porque: 'Facilita la absorción y la reabsorción de agua, útil en la diarrea rebelde (p. 32).' }],
        explicacion: 'Las fórmulas con fibra llevan una mezcla de fermentable y no fermentable: <span class="hl-rojo">no aportan ventaja en la diarrea</span>. Sí menor osmolalidad, predigeridas y evitar los líquidos de la Tabla 49.6 (' + pdf(32) + ').' },
      { id: 'en-c-e4', corto: 'aspiración silenciosa', tipo: 'test', fuente: 'mu-aspiracion',
        enunciado: 'No ves fórmula en la vía aérea. ¿Descarta eso la microaspiración?',
        opciones: [
          { t: 'Sí: si no se ve fórmula en las vías aéreas, no hay aspiración', porque: 'La microaspiración ocurre en casi la mitad de los críticos y normalmente no se ve fórmula en las vías aéreas (p. 30).' },
          { t: 'No: ocurre en casi la mitad de los críticos y suele no verse fórmula', ok: true },
          { t: 'Sí, si el residuo gástrico es normal', porque: 'Vigilar el residuo se ha usado para estimar el riesgo con éxito limitado; un residuo normal no la descarta (p. 30).' }],
        explicacion: 'Microaspiración en <span class="hl-rojo">casi la mitad</span> de los críticos, habitualmente sin fórmula visible, por mala motilidad gástrica y tono bajo del esfínter esofágico inferior (' + pdf(30) + ').' },
    ],
    casos: [
      { id: 'en-caso-cipriano', titulo: 'Cipriano, 69 años: la sonda, el residuo y el fentanilo', corto: 'Cipriano', sub: 'Complicaciones de la enteral en un posoperatorio con opioides',
        paciente: { Edad: '69 años', Ingreso: 'Posoperatorio de cirugía abdominal mayor, enteral por sonda fina', Fármacos: 'Fentanilo en perfusión' },
        pasos: [
          { momento: 'Día 2', datos: { Sonda: 'va lenta y se obstruye a ratos' }, nuevo: ['Sonda'],
            pregunta: { id: 'en-c-c1', tipo: 'test', fuente: 'mu-oclusion · mu-oclusion-pasos',
              enunciado: 'El flujo es lento, no hay obstrucción total. ¿Qué pruebas primero?',
              opciones: [
                { t: 'Lavado con agua tibia: resuelve un 30 % de los casos', ok: true },
                { t: 'Cambiar la sonda de inmediato por una nueva sin más intentos', porque: 'Es el recurso de la oclusión completa si no pasa una guía; antes se prueba el agua tibia y las enzimas (p. 30).' },
                { t: 'Inyectar Viokase con carbonato de entrada', porque: 'Las enzimas pancreáticas (75 %) van después del lavado con agua tibia (p. 30).' }],
              explicacion: 'Flujo lento: <span class="hl">agua tibia</span> (30 %); si no, Viokase con carbonato sódico (75 %) (' + pdf(30) + '). Prevención: 30 mL de agua cada 4 h y 10 mL tras cada fármaco.' } },
          { momento: 'Día 3 · sospecha de aspiración', datos: { Residuo: '600 mL en 6 h', Clínica: 'tos tras una regurgitación' }, nuevo: ['Residuo', 'Clínica'], calculadora: { ir: 'mu-grv-calc', nombre: 'Residuo gástrico: ¿qué hago?' },
            pregunta: { id: 'en-c-c2', tipo: 'test', fuente: 'mu-grv-calc · mu-grv-recomendaciones',
              enunciado: 'Con la calculadora: residuo 600 mL en 6 h, sin procinético previo y sin atribuirlo aún a opiáceos. ¿Qué haces?',
              opciones: [
                { t: 'Seguir igual: el umbral habitual es 200 mL', porque: 'Medirlo de rutina y parar por 150-250 mL no mejora resultados (p. 30-31); pero 600 mL con sospecha de aspiración supera los 500 mL en 6 h: justifica parar (p. 31).' },
                { t: 'Pararla temporalmente, cabecero a 30° o más y probar eritromicina', ok: true },
                { t: 'Retirar la sonda y pasar a nutrición parenteral', porque: 'El plan del libro es parar, elevar el cabecero y probar procinéticos; el avance del punto de infusión va si persiste (p. 31).' }],
              explicacion: '>500 mL en 6 h: <span class="hl-rojo">parar temporalmente</span>, cabecero ≥30° y un ensayo de procinéticos (' + pdf(31) + '). La calculadora propone eritromicina 100-200 mg IV cada 8 h, la más eficaz, no más de 3 días.' } },
          { momento: 'Día 3 · el procinético', datos: { Eritromicina: '200 mg IV cada 8 h' }, nuevo: ['Eritromicina'],
            pregunta: { id: 'en-c-c3', tipo: 'destapa', fuente: 'mu-procineticos',
              enunciado: 'Explica a la enfermera por qué la eritromicina es la primera elección y por qué se retira a los 3 días.',
              cuantas: 'son tres cosas',
              puntos: [
                'Estimula los <span class="hl">receptores de motilina</span>: es el procinético más eficaz.',
                'Su efecto decae en pocos días (<span class="hl-rojo">taquifilaxia</span>): no más de 3 días.',
                'Tres días no alteran la <span class="hl">microbiota residente</span>.'],
              explicacion: 'Tabla 49.5 y texto del capítulo (' + pdf(31) + ').' } },
          { momento: 'Día 4 · nota del residente', datos: { ECG: 'QTc 510 ms', Plan: 'asociar metoclopramida' }, nuevo: ['ECG', 'Plan'],
            pregunta: { id: 'en-c-c4', tipo: 'error', fuente: 'mu-procineticos · mu-tabla-49-5',
              enunciado: 'El residente añade metoclopramida. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Juntas, eritromicina y metoclopramida son más eficaces que por separado.' },
                { t: 'Las dos alargan el QT y hay que valorarlo al decidir la combinación.' },
                { t: 'Con QTc 510 ms seguimos con las dos sin más: el QT no importa aquí.', mal: true,
                  c: 'Ambos fármacos <span class="hl-rojo">prolongan el QT</span> y esto debe considerarse al decidir la combinación (p. 31-32).' },
                { t: 'La naloxona enteral bloquea los receptores opioides del intestino sin quitar la analgesia.' }],
              explicacion: 'La combinación es más eficaz pero ambos alargan el QT (' + pdf(31) + ' y ' + pdf(32) + '). El libro no fija un valor de QTc; la cifra del caso es ilustrativa.' } },
          { momento: 'Día 6 · persiste', datos: { Residuo: 'sigue >500 mL al reanudar', Fentanilo: 'se mantiene' }, nuevo: ['Residuo', 'Fentanilo'], calculadora: { ir: 'mu-grv-calc', nombre: 'Persiste = Sí' },
            pregunta: { id: 'en-c-c5', tipo: 'test', fuente: 'mu-grv-calc · mu-grv-recomendaciones',
              enunciado: 'Persiste al reanudar tras los procinéticos. ¿Qué indica la calculadora?',
              opciones: [
                { t: 'Duplicar la eritromicina', porque: 'No más de 3 días, y la eficacia decae (p. 31). El libro no propone aumentar la dosis.' },
                { t: 'Avanzar el punto de infusión: estómago a duodeno', ok: true },
                { t: 'Dejar de alimentar hasta que mejore el residuo', porque: 'Interrumpir la nutrición es justo lo que el capítulo intenta evitar; si persiste, se avanza el punto de infusión (p. 31).' }],
              explicacion: 'Si persiste al reanudar: <span class="hl-rojo">avanzar el punto de infusión</span> (estómago a duodeno o duodeno a yeyuno) (' + pdf(31) + ').' } },
          { momento: 'Día 9 · diarrea', datos: { Deposiciones: 'líquidas, 6 al día', Fármacos: 'paracetamol en solución, cloruro potásico líquido' }, nuevo: ['Deposiciones', 'Fármacos'],
            pregunta: { id: 'en-c-c6', tipo: 'test', fuente: 'mu-tabla-49-6 · mu-diarrea-farmacos',
              enunciado: 'Diarrea con la enteral. ¿Qué parte del tratamiento corresponde a los fármacos líquidos del caso?',
              opciones: [
                { t: 'Añadir una fórmula con más fibra para compensar su efecto en el intestino', porque: 'La fibra mezclada no ayuda en la diarrea (p. 32).' },
                { t: 'Aumentar el ritmo de la fórmula para diluirlos en la luz del intestino', porque: 'No es una medida del capítulo; las causas son la hiperosmolaridad y el sorbitol de los líquidos (p. 32).' },
                { t: 'Evitar, si es posible, los líquidos de la Tabla 49.6 que dan diarrea', ok: true }],
              explicacion: 'Paracetamol y cloruro potásico líquidos figuran en la Tabla 49.6 por superar 3.000 mOsm/kg (el paracetamol, además, lleva sorbitol) (' + pdf(32) + ').' } },
        ],
        lleva: [
          'No medir el residuo de rutina; >500 mL en 6 h con sospecha: parar, cabecero a 30° y eritromicina ≤3 días.',
          'Si persiste, avanzar el punto de infusión; con opiáceos, naloxona por la sonda; juntos, eritromicina y metoclopramida alargan el QT.',
          'Diarrea: osmolalidad, antibióticos, C. difficile y líquidos con sorbitol; la fibra no la arregla.'],
        volver: { nombre: 'Residuo gástrico: ¿qué hago?', ancla: 'mu-grv-calc' } },
    ],
    profundizar: [
      { id: 'mu-tabla-49-6', titulo: 'Tabla 49.6 · Los fármacos líquidos que dan diarrea' },
      { id: 'mu-aspiracion', titulo: 'La microaspiración «casi la mitad»' },
      { id: 'mu-ent-final', titulo: 'Comer como defensa antimicrobiana' },
    ],
  },
};
