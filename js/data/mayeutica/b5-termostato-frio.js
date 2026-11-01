// Mayéutica del bloque 5, grupo 5D · El termostato (Marino caps. 43-44), segunda mitad: ma-hipotermia y ma-antipireticos, con los casos de Honorato y Dorotea.
// Formato: cabecera de b1-fluidos.js. Datos puros. Medicina: js/modules/libros/marino-abdomen.html y
// docs/marino-2024-abdomen-temperatura-caps39-44.pdf (cap. 43 = págs. 53-57; cap. 44, antipiréticos = págs. 69-72; desplazamiento 0).
// Los pacientes (Honorato, Dorotea) son inventados: sus cifras son «del caso» o `ilustrativo`.
const PDF = 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const TV = e => ({ termostatoVivo: e });
const POSRES = ' <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="mc-posresucitacion">Control de temperatura posparada (Merino Cardiología) ↗</button>';

export const MAYEUTICA_TERMOSTATO_FRIO = {
  /* =================================================================================================
     Ficha 17 · Hipotermia accidental (cap. 43, págs. 53-57)
     ================================================================================================= */
  'ma-hipotermia': {
    entrada: 'Qué hace el frío al corazón por tramos de temperatura, por qué el laboratorio engaña, cómo se recalienta y por qué nadie está muerto hasta estar caliente.',
    guia: [
      { id: 'hpo-g1', corto: 'agua fría', tipo: 'test', fuente: 'ma-hipo-riesgo',
        enunciado: 'Un pescador cae a un agua de 12 °C. Otro pasa la misma noche a 12 °C de aire, con ropa seca. ¿Por qué el primero puede morir en 30 minutos y el segundo no?',
        opciones: [
          { t: 'El agua roba calor mucho más rápido que el aire; por eso también la ropa mojada', ok: true },
          { t: 'Porque en el agua se pierde el escalofrío y con él la producción de calor', porque: 'La ficha no dice eso: el escalofrío es una defensa que duplica la producción de calor. Lo que cambia es la velocidad a la que se pierde el calor.' },
          { t: 'Porque el viento es más fuerte sobre el agua', porque: 'El viento es otro factor de riesgo (convección), distinto de la inmersión; no explica por qué el agua <15 °C puede ser mortal a los 30 min.' }],
        explicacion: `Inmersión en agua fría (<15 °C): puede ser mortal a los 30 min; <span class="hl-rojo">el agua roba calor mucho más rápido que el aire</span> (por eso la ropa mojada) (${pag(54, 'p. 54')}).` },
      { id: 'hpo-g2', corto: 'bajar de 32', tipo: 'test', fuente: 'ma-hipo-grados · ma-tabla-43-6', modeloVivo: TV('hipo:2'),
        enunciado: 'Predice y compruébalo: Honorato baja de 32 °C. ¿Qué pasa con su frecuencia cardíaca, su respiración y su escalofrío?',
        opciones: [
          { t: 'Taquicardia y escalofrío intenso, cada vez más fuerte, y la respiración se acelera', porque: 'Eso es la hipotermia leve (32-35 °C). Esperarlo bajo 32 °C haría subestimar a un paciente cuyo corazón ya se enlentece.' },
          { t: 'Bradicardia y bradipnea; el escalofrío solo se mantiene por encima de 30 °C', ok: true },
          { t: 'Sin cambios: hasta 28 °C el corazón no se afecta', porque: 'La ficha pone la bradicardia progresiva y el umbral de arritmias ya por debajo de 32 °C. Esperar a 28 °C llega tarde para vigilar el ritmo.' }],
        explicacion: `Moderada (28-31,9 °C): letargia, escalofrío menor o ausente, bradicardia y bradipnea; <span class="hl">escalofrío solo si >30 °C</span>; bradicardia y bradipnea por debajo de 32 °C (${pag(54, 'p. 54')}).` },
      { id: 'hpo-g3', corto: 'pupilas fijas', tipo: 'test', fuente: 'ma-hipo-grados', modeloVivo: TV('hipo:3'),
        enunciado: 'Honorato: 27,4 °C, FC 34, pupilas dilatadas y fijas, sin respuesta. ¿Está muerto?',
        opciones: [
          { t: 'Sí: pupilas fijas y FC de 34 son criterios de muerte', porque: 'En hipotermia grave el coma, las pupilas fijas y la bradicardia son esperables. Declararlo ahora lo condena sin haberlo recalentado.' },
          { t: 'No se puede declarar la muerte en hipotermia: hay que recalentar antes', ok: true },
          { t: 'Probablemente sí, pero se confirma con la onda de Osborn y con una segunda exploración', porque: 'La onda de Osborn no es específica y tiene poco o ningún valor diagnóstico o pronóstico: no confirma ni descarta la muerte.' }],
        explicacion: `Grave (<28 °C): coma y pupilas fijas. Por debajo de 24 °C se esperan apnea y asistolia, pero <span class="hl-rojo">no se puede declarar la muerte en hipotermia</span>: hay que recalentar antes (${pag(55, 'p. 55')}).` },
      { id: 'hpo-g4', corto: 'el laboratorio', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'ma-hipo-lab',
        enunciado: 'La analítica de Honorato llega a 37 °C. ¿Qué te engaña? Cuatro cosas.',
        puntos: [
          'La <span class="hl-rojo">gasometría</span> se procesa a 37 °C: hay que ajustarla a la temperatura del paciente.',
          'La <span class="hl">hiperpotasemia</span> viene del músculo (escalofrío o rabdomiólisis).',
          'La <span class="hl">creatinina</span> alta puede ser rabdomiólisis, fracaso renal o «diuresis por frío».',
          'La <span class="hl-rojo">coagulopatía</span> (<34 °C) puede no verse si la coagulación se procesa a temperatura normal.'],
        explicacion: `Evaluación de laboratorio de la hipotermia (${pag(55, 'p. 55')}). Ninguno de los cuatro se lee a 37 °C como si fuera el valor real del paciente.` },
      { id: 'hpo-g5', corto: 'dónde medir', tipo: 'test', fuente: 'ma-hipo-temp',
        enunciado: 'Quieres la temperatura real de Honorato. ¿Dónde la mides?',
        opciones: [
          { t: 'Timpánica: es la más cercana al cerebro', porque: 'La piel y el oído están más fríos que el interior; la ficha desaconseja oral, axilar, temporal y timpánica. Subestimarías la hipotermia, o la sobreestimarías.' },
          { t: 'Axilar sumando 0,5 °C', porque: 'La ficha no da ninguna corrección: la axilar es periférica y no sirve. Un número «corregido» sin base falsea la gravedad.' },
          { t: 'Con sonda vesical, esofágica o rectal', ok: true }],
        explicacion: `La piel está más fría que el interior: no sirven oral, axilar, temporal ni timpánica. Usar <span class="hl-rojo">sonda vesical, esofágica o rectal</span> (${pag(55, 'p. 55')}).` },
      { id: 'hpo-g6a', corto: 'onda de Osborn', tipo: 'test', fuente: 'ma-hipo-osborn · mar-img-43-1',
        enunciado: 'En el ECG de Honorato aparece una onda J entre el QRS y el ST (Figura 43.1). ¿Qué vale?',
        opciones: [
          { t: 'Es específica de la hipotermia y marca la gravedad', porque: 'También aparece en hipercalcemia, hemorragia subaracnoidea, lesión cerebral e isquemia. Guiar la gravedad por ella lleva a infravalorar al paciente sin onda.' },
          { t: 'Es inespecífica y casi sin valor diagnóstico ni pronóstico: «una curiosidad»', ok: true },
          { t: 'Es un signo pronóstico de fibrilación inminente', porque: 'La ficha no le da valor pronóstico. La FV por debajo de 28 °C se vigila por la temperatura, no por la onda J.' }],
        explicacion: `Ondas J (de Osborn) entre el QRS y el ST, sobre todo en II y V6; no son específicas y tienen poco o ningún valor diagnóstico o pronóstico: <span class="hl">«una curiosidad»</span> (${pag(55, 'p. 55')} y ${pag(56, '56')}).` },
      { id: 'hpo-g7a', corto: 'qué recalienta', tipo: 'test', fuente: 'ma-hipo-interno · ma-hipo-volumen', modeloVivo: TV('hipo:5'),
        enunciado: 'Predice y compruébalo con «Dar: recalentar»: Honorato está intubado. ¿Qué recalienta de verdad y qué solo evita enfriar más?',
        opciones: [
          { t: 'Los fluidos calientes recalientan 2,5 °C/h de forma fiable; los gases inspirados no importan', porque: 'Está al revés: los fluidos calientes evitan enfriar más pero no recalientan. Confiar en ellos deja a Honorato casi sin ganar temperatura.' },
          { t: 'Los gases a 40-45 °C suben la central 2,5 °C/h; los fluidos calientes solo evitan enfriar', ok: true },
          { t: 'Los lavados gástrico y vesical calientes, que dan calor directo', porque: 'La ficha no los recomienda: el gástrico por riesgo de aspiración y el vesical por ineficaz.' }],
        explicacion: `Interno, intubados: gases inspirados a 40-45 °C suben la central <span class="hl-rojo">2,5 °C/h</span>; los fluidos calientes evitan enfriar más pero no recalientan; sin lavados gástricos ni vesicales (${pag(56, 'p. 56')}).` },
      { id: 'hpo-g8', corto: 'FV en el frío', tipo: 'test', fuente: 'ma-hipo-interno · ma-hipo-arritmias',
        enunciado: 'Honorato, a 27,9 °C, entra en FV sin pulso. ¿Qué haces?',
        opciones: [
          { t: 'Declaro: una FV por debajo de 28 °C es terminal', porque: 'La FV y la asistolia son esperables por debajo de 28 °C y no autorizan a declarar la muerte antes de recalentar (p. 55).' },
          { t: 'RCP y ECMO venoarterial', ok: true },
          { t: 'Amiodarona y esperar a que suba la temperatura', porque: 'La causa es el frío; la ficha pide ECMO venoarterial en la parada por hipotermia, no un antiarrítmico y espera.' }],
        explicacion: `Por debajo de 28 °C hay riesgo de FV y asistolia (${pag(56, 'p. 56')}); en la parada por hipotermia: <span class="hl-rojo">ECMO venoarterial</span>.` },
    ],
    examen: [
      { id: 'hpo-e1', corto: 'atropina', tipo: 'test', fuente: 'ma-hipo-arritmias',
        enunciado: 'Honorato está a 30 °C con FC 40. ¿Qué esperas de la atropina?',
        opciones: [
          { t: 'Que corrija la bradicardia, como en la de origen vagal', porque: 'Por debajo de 32 °C la bradicardia es progresiva y resistente a la atropina. Gastar dosis y tiempo en ella retrasa el recalentamiento.' },
          { t: 'Que sea resistente: la bradicardia del frío cede al recalentar', ok: true },
          { t: 'Que la fibrile por debajo de 28 °C, por lo que se evita', porque: 'La ficha atribuye el riesgo de FV y asistolia al frío, no a la atropina; confundirlo hace dudar de usar lo que sí está indicado.' }],
        explicacion: `Por debajo de 32 °C: umbral de arritmias más bajo y <span class="hl-rojo">bradicardia progresiva resistente a la atropina</span>; por debajo de 28 °C, riesgo de FV y asistolia (${pag(56, 'p. 56')}).` },
      { id: 'hpo-e2a', corto: 'lavados', tipo: 'test', fuente: 'ma-hipo-interno',
        enunciado: 'Una hipotermia grave que no responde al recalentamiento externo activo. ¿Qué recomiendas dentro de las medidas internas?',
        opciones: [
          { t: 'Lavado gástrico con suero caliente', porque: 'No se recomienda: hay riesgo de aspiración.' },
          { t: 'Lavado vesical con suero caliente, por ser rápido', porque: 'Es ineficaz, según la ficha: no aporta calor suficiente y no sustituye al recalentamiento interno.' },
          { t: 'Intubar y dar gases inspirados a 40-45 °C; fluidos calentados; ECMO VA si hay parada', ok: true }],
        explicacion: `Interno: para la hipotermia grave en la que falla el externo activo; no se recomiendan lavados gástricos (aspiración) ni vesicales (ineficaces) (${pag(56, 'p. 56')}).` },
      { id: 'hpo-e3', corto: 'hipotermia leve', tipo: 'test', fuente: 'ma-hipo-grados · ma-tabla-43-6',
        enunciado: 'Una mujer de 78 años llega a 33,5 °C, confusa, con piel fría, escalofríos intensos, taquicardia y PA 150/90. ¿Qué grado es?',
        opciones: [
          { t: 'Moderada: la confusión y los 33,5 °C bastan para clasificarla, aunque tirite', porque: 'La moderada es 28-31,9 °C, con letargia, bradicardia y escalofrío menor o ausente. Tratarla como moderada ignora que sus defensas todavía funcionan.' },
          { t: 'Grave: la mortal es <24 °C y esta es la anterior', porque: 'Grave es <28 °C: coma, sin escalofrío, pupilas fijas. Con escalofrío intenso y taquicardia no encaja.' },
          { t: 'Leve (32-35 °C): confusa pero con signos de adaptación, incluso PA alta', ok: true }],
        explicacion: `Leve: confusos pero con signos de adaptación (vasoconstricción, escalofrío intenso, taquicardia, PA a veces alta) (${pag(54, 'p. 54')}).`,
        nota: '<b>Nota de fidelidad.</b> El texto llama «hipertermia moderada» a la hipotermia de 28-31,9 °C.' },
      { id: 'hpo-e4', corto: 'hipotensión al recalentar', tipo: 'test', fuente: 'ma-hipo-volumen',
        enunciado: 'Al recalentarse, un paciente se hipotensa. ¿Por qué, y qué haces?',
        opciones: [
          { t: 'Vasodilatación al recalentar y depleción de volumen por diuresis por frío; fluidos calentados', ok: true },
          { t: 'Insuficiencia cardíaca por el frío; restrinjo líquidos para evitar el edema y vigilo la diuresis horaria', porque: 'Es al revés: hay depleción de volumen, y restringir líquidos profundizaría la hipotensión.' },
          { t: 'Una arritmia por recalentar demasiado rápido; enfrío', porque: 'La ficha no atribuye la hipotensión a la velocidad ni propone enfriar; sería un retroceso innecesario.' }],
        explicacion: `La hipotermia moderada-grave suele cursar con depleción de volumen (diuresis por frío), y la vasodilatación al recalentar da hipotensión: fluidos calentados; si no responde, valorar ECMO venoarterial (${pag(56, 'p. 56')} y ${pag(57, '57')}).` },
      { id: 'hpo-e5a', corto: 'tipos', tipo: 'test', fuente: 'ma-hipo-def',
        enunciado: 'Un paciente con sepsis llega a 34,2 °C. ¿Qué tipo de hipotermia es, según la ficha?',
        opciones: [
          { t: 'Primaria (ambiental), la que trata esta ficha', porque: 'Es la causada por el ambiente; aquí hay una enfermedad de fondo. Aplicar solo su pauta ignoraría la causa.' },
          { t: 'Terapéutica, porque se busca controlar la temperatura', porque: 'La terapéutica es la que se induce para controlar la temperatura; nadie ha enfriado a este paciente.' },
          { t: 'Secundaria: por enfermedad o trauma', ok: true }],
        explicacion: `Hipotermia (<35 °C): primaria (ambiental, la de esta ficha), <span class="hl">secundaria (por enfermedad o trauma)</span> o terapéutica (control de temperatura) (${pag(53, 'p. 53')}).` },
    ],
    casos: [
      { id: 'hpo-c1', titulo: 'Honorato, 72 años: nadie está muerto hasta estar caliente', corto: 'Caso · Honorato', sub: 'hallado en un portal en enero, con alcohol',
        paciente: { Edad: '72 años', Motivo: 'Hallado a las 03:00 en un portal en enero', Antecedente: 'consumo de alcohol' },
        lleva: [
          'Temperatura central o nada (vesical, esofágica o rectal); nadie está muerto hasta estar caliente.',
          'Los gases calientes recalientan 2,5 °C/h; los fluidos calentados solo evitan enfriar más; los laboratorios se leen ajustados.',
          'Por debajo de 28 °C hay FV, y la parada por hipotermia es de ECMO venoarterial.'],
        volver: { nombre: 'Recalentamiento externo', ancla: 'ma-hipo-externo', modeloVivo: [TV('hipo:5'), { ritmoVivo: 'fv' }] },
        pasos: [
          { momento: 'Ambulancia y urgencias', datos: { Temperaturas: 'axilar 31,0 °C (ambulancia); timpánica 30,2 °C (urgencias)' }, nuevo: ['Temperaturas'],
            pregunta: { id: 'hpo-c1-1', tipo: 'test', fuente: 'ma-hipo-temp',
              enunciado: '¿Qué temperatura usas?',
              opciones: [
                { t: 'La timpánica: es la más cercana al cerebro y la más rápida de obtener', porque: 'La ficha la excluye: la piel y el oído están más fríos que el interior y falsean la medida.' },
                { t: 'La axilar más 0,5 °C', porque: 'No hay corrección en la ficha; un número corregido sin base puede dar una gravedad falsa.' },
                { t: 'Ninguna: la central, con sonda vesical, esofágica o rectal', ok: true }],
              explicacion: `Temperatura central: sonda vesical, esofágica o rectal; no sirven oral, axilar, temporal ni timpánica (${pag(55, 'p. 55')}).` } },
          { momento: 'Urgencias · hora 0', datos: { Temperatura: '27,4 °C (esofágica)', Constantes: 'FC 34, PA 76/40', Neurológico: 'GCS 5, pupilas dilatadas y fijas, sin escalofrío' }, nuevo: ['Temperatura', 'Constantes', 'Neurológico'], calculadora: { ir: 'ma-hipo-resultado', nombre: 'Gravedad (Tabla 43.6)' },
            pregunta: { id: 'hpo-c1-2', tipo: 'test', fuente: 'ma-tabla-43-6 · ma-hipo-grados', modeloVivo: TV('hipo:3'),
              enunciado: '¿Qué gravedad es y qué temes?',
              opciones: [
                { t: 'Grave (<28 °C): coma, pupilas fijas y FV; no se declara la muerte sin recalentar', ok: true },
                { t: 'Moderada: aún tiene pulso y presión', porque: '28-31,9 °C es la moderada; con 27,4 °C es grave. Subestimarla retrasa el recalentamiento interno y la vigilancia de la FV.' },
                { t: 'Pupilas fijas son muerte encefálica: aviso al coordinador de trasplantes', porque: 'No se puede declarar la muerte en hipotermia: hay que recalentar antes. Es un error de consecuencias irreversibles.' }],
              explicacion: `Grave: <span class="hl-rojo"><28 °C</span>, obnubilación o coma, sin escalofrío, pupilas dilatadas y fijas, bradicardia, hipotensión (${pag(54, 'p. 54')}); no se declara la muerte sin recalentar (${pag(55, '55')}).` } },
          { momento: 'Urgencias · hora 0,5', datos: { Analítica: 'K⁺ 5,8, pH 7,21 (procesado a 37 °C), INR 1,1 a 37 °C, creatinina 1,9, CK 4.100 (cifras del caso)' }, nuevo: ['Analítica'],
            pregunta: { id: 'hpo-c1-3', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'ma-hipo-lab',
              enunciado: 'La analítica llega a 37 °C. ¿Qué te engaña? Cuatro cosas.',
              puntos: [
                'La <span class="hl-rojo">gasometría</span>: se ajusta a la temperatura del paciente (27,4 °C).',
                'El <span class="hl">K⁺ de 5,8</span>: sale del músculo (escalofrío o rabdomiólisis; CK 4.100).',
                'La <span class="hl">creatinina de 1,9</span>: rabdomiólisis, fracaso renal o diuresis por frío.',
                'El <span class="hl-rojo">INR a 37 °C</span>: la coagulopatía de <34 °C no se ve si se procesa a temperatura normal.'],
              explicacion: `Evaluación de laboratorio (${pag(55, 'p. 55')}).` } },
          { momento: 'Urgencias · hora 1', datos: { ECG: 'bradicardia 34, onda J (Fig. 43.1)' }, nuevo: ['ECG'],
            pregunta: { id: 'hpo-c1-4', tipo: 'test', fuente: 'ma-hipo-osborn · ma-hipo-arritmias · ma-hipo-externo', modeloVivo: { ritmoVivo: 'bradi' },
              enunciado: '¿Qué vale la onda de Osborn y qué haces con la bradicardia?',
              opciones: [
                { t: 'La onda es específica y confirma la hipotermia; la bradicardia se trata con atropina, como la vagal', porque: 'La onda J no es específica (también en hipercalcemia, HSA, isquemia) y la bradicardia del frío es resistente a la atropina.' },
                { t: 'Esperar a que suba sola con mantas pasivas', porque: 'El pasivo basta en la mayoría de las hipotermias; en una grave a 27,4 °C con bradicardia y PA 76/40 hay que recalentar activamente (p. 56).' },
                { t: 'Curiosidad inespecífica; la bradicardia resiste a la atropina: recalentar', ok: true }],
              explicacion: `Ondas J no específicas, «una curiosidad» (${pag(55, 'p. 55')}); bradicardia resistente a la atropina por debajo de 32 °C (${pag(56, 'p. 56')}).` } },
          { momento: 'Urgencias · hora 1', datos: { Plan: 'borrador del R1' }, nuevo: ['Plan'],
            pregunta: { id: 'hpo-c1-5', tipo: 'error', fuente: 'ma-hipo-interno · ma-hipo-volumen',
              enunciado: 'Plan del R1 para Honorato. Puede haber 0, 1 o 2 errores.',
              frases: [
                { t: 'Intubo y caliento los gases inspirados a 40-45 °C.' },
                { t: '1.000 mL de salino a temperatura ambiente (21 °C), rápido.', mal: true, c: 'A 21 °C <span class="hl-rojo">enfrían más</span>: los fluidos se infunden calentados (p. 56).' },
                { t: 'Lavado gástrico con suero caliente.', mal: true, c: 'No se recomienda: <span class="hl">riesgo de aspiración</span> (p. 56).' },
                { t: 'Mantas térmicas activas.' },
                { t: 'Repito la gasometría ajustada y vigilo el K⁺.' },
                { t: 'No declaro nada hasta recalentar.' }],
              explicacion: `Gases a 40-45 °C: +2,5 °C/h; fluidos calentados (a 21 °C enfrían más); sin lavados gástricos ni vesicales (${pag(56, 'p. 56')}).` } },
          { momento: 'Hora 2 · giro', datos: { Temperatura: '27,9 °C', Ritmo: 'FV sin pulso' }, nuevo: ['Temperatura', 'Ritmo'],
            pregunta: { id: 'hpo-c1-6', tipo: 'test', fuente: 'ma-hipo-interno', origen: 'ilustrativo: (32 − 27,9) / 2,5', modeloVivo: { ritmoVivo: 'fv' },
              enunciado: '¿Qué haces?',
              opciones: [
                { t: 'Sigo con gases calientes y RCP hasta llegar a 32 °C', porque: 'De 27,9 a 32 °C con 2,5 °C/h son más de 1,5 horas de RCP seguidas (cuenta ilustrativa); la ficha va por el ECMO venoarterial.' },
                { t: 'Declaro: la FV por debajo de 28 °C es terminal', porque: 'La FV es esperable por debajo de 28 °C y no autoriza a declarar la muerte; nadie lo está hasta estar caliente.' },
                { t: 'RCP y ECMO venoarterial', ok: true }],
              explicacion: `En la parada por hipotermia: ECMO venoarterial (${pag(56, 'p. 56')}). Los minutos de RCP antes del ECMO no los cuantifica la ficha.` } },
          { momento: 'Día 1 · UCI', datos: { Temperatura: '33,0 °C, en ECMO', Constantes: 'PA 88/50, diuresis escasa' }, nuevo: ['Temperatura', 'Constantes'],
            pregunta: { id: 'hpo-c1-7', tipo: 'test', fuente: 'ma-hipo-volumen',
              enunciado: '¿Por qué baja la PA y qué das?',
              opciones: [
                { t: 'Por el edema de pulmón: restrinjo líquidos', porque: 'Hay depleción de volumen por la diuresis por frío; restringir empeora la hipotensión.' },
                { t: 'Vasodilatación al recalentar y diuresis por frío: fluidos calentados; ECMO VA si no responde', ok: true },
                { t: 'Por el recalentamiento: noradrenalina primero para sostener la PA y fluidos después si no responde', porque: 'La ficha va por el volumen; empezar con un vasopresor sobre un paciente depleccionado oculta el problema.' }],
              explicacion: `Depleción de volumen (diuresis por frío) y vasodilatación al recalentar: fluidos calentados; si no responde, ECMO venoarterial (${pag(56, 'p. 56')} y ${pag(57, '57')}).` } },
        ] },
    ],
    profundizar: [
      { id: 'ma-hipo-fisio', titulo: 'Fisiología: la conducta cuenta más que el escalofrío' },
      { id: 'ma-hipo-riesgo', titulo: 'Situaciones de riesgo: viento e índice de sensación térmica' },
      { id: 'ma-hipo-externo', titulo: 'Recalentamiento externo: pasivo y activo' },
    ],
  },

  /* =================================================================================================
     Ficha 14 · Antipiréticos (cap. 44, págs. 69-72)
     ================================================================================================= */
  'ma-antipireticos': {
    entrada: 'Por qué la fiebre protege en la sepsis, cuándo sí se baja, qué antipirético y cuánto, y por qué la manta es del golpe de calor.',
    guia: [
      { id: 'ant-g1', corto: 'qué gana con la fiebre', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-antip-defensa · ma-antip-clinica', modeloVivo: TV('fiebre:4'),
        enunciado: 'El interno quiere bajar toda fiebre «porque consume oxígeno». ¿Qué gana el huésped con más temperatura? Tres cosas.',
        puntos: [
          'Más <span class="hl-azul">anticuerpos y citocinas</span>, linfocitos T activados.',
          'Mejor <span class="hl-azul">quimiotaxis y fagocitosis</span> de los neutrófilos.',
          'Inhibe el crecimiento <span class="hl">bacteriano</span> y la replicación <span class="hl">viral</span>.'],
        explicacion: `Defensa del huésped (${pag(70, 'p. 70')}). Y en pacientes: en la sepsis grave y el shock séptico, más temperatura, menos mortalidad.` },
      { id: 'ant-g2', corto: 'Fig. 44.5', tipo: 'test', fuente: 'ma-tabla-fig44-5 · mar-img-44-5', modeloVivo: TV('fiebre:4'),
        enunciado: 'Predice y compruébalo en la tabla de la Fig. 44.5: en 2.225 pacientes con sepsis grave, ¿qué grupo de temperatura inicial muere más?',
        opciones: [
          { t: 'Los de >39,4 °C, con un 36 %', porque: 'Es al revés de la Fig. 44.5. Con esa idea bajarías toda fiebre alta en la sepsis.' },
          { t: 'Los de 38,3-39,4 °C, con un 25 %', porque: 'En ese tramo es 20 %; los de 37-38,2 °C tienen 25 %. No identificar el máximo de mortalidad con la temperatura baja lleva a malinterpretar la figura.' },
          { t: 'Los de <37 °C, con un 36 %; los de >39,4 °C, con un 16 %', ok: true }],
        explicacion: `Fig. 44.5 (${pag(70, 'p. 70')} y ${pag(71, '71')}): >39,4 °C 16 %; 38,3-39,4 °C 20 %; 37-38,2 °C 25 %; <37 °C 36 % (p<0,001). La figura solo da °F; los °C son la conversión de la ficha.`,
        nota: '<b>Nota de fuentes.</b> Es un estudio observacional: muestra asociación, no que bajar la temperatura cambie la mortalidad.' },
      { id: 'ant-g3', corto: 'el adjunto', tipo: 'test', fuente: 'ma-antip-clinica · ma-antip-guias',
        enunciado: 'El adjunto dice: «la fiebre protege, así que caliento a Dorotea, que está séptica pero afebril». ¿Qué dicen las guías?',
        opciones: [
          { t: 'Calentar a los sépticos afebriles es la recomendación de las guías de fiebre en la UCI desde hace años', porque: 'Fue un estudio en sépticos afebriles (calentarlos 1,5 °C redujo la mortalidad), no una recomendación de las guías.' },
          { t: 'No suprimir la fiebre de rutina; calentar fue un estudio, no una recomendación', ok: true },
          { t: 'Hay que bajar siempre toda fiebre, porque es dañina', porque: 'Las guías recomiendan no suprimirla de rutina. Bajarla siempre quita defensas y, en un estudio, se vio más mortalidad con antipiréticos.' }],
        explicacion: `Las guías recomiendan <span class="hl-rojo">no suprimir la fiebre de rutina</span> (${pag(71, 'p. 71')}). En sépticos afebriles, calentarlos externamente 1,5 °C redujo la mortalidad, pero fue un estudio.` },
      { id: 'ant-g4b', corto: 'cuándo sí', tipo: 'test', fuente: 'ma-antip-guias',
        enunciado: 'Un hombre de 60 años en el postoperatorio de una parada recuperada tiene 38,7 °C. ¿Se trata la fiebre?',
        opciones: [
          { t: 'No, porque la fiebre es defensa y las guías dicen no tratarla nunca', porque: 'Las guías dicen no suprimirla de rutina; con lesión cerebral isquémica (tras una parada o un ictus) la fiebre es dañina y debe tratarse.' },
          { t: 'Solo con ibuprofeno, porque el paracetamol está contraindicado', porque: 'No hay tal contraindicación salvo en insuficiencia hepática. El antipirético se elige por seguridad, no por el tipo de lesión.' },
          { t: 'Sí: con lesión cerebral isquémica (tras parada o ictus agudo), la fiebre es dañina', ok: true }],
        explicacion: `Excepción: la fiebre sí es dañina con <span class="hl-rojo">lesión cerebral isquémica</span> (tras una parada o un ictus agudo) y debe tratarse (${pag(71, 'p. 71')}).${POSRES}` },
      { id: 'ant-g5', corto: 'paracetamol 70 kg', tipo: 'test', fuente: 'ma-antip-paracetamol', origen: 'ilustrativo: 3 g/día = tope de la ficha',
        enunciado: 'Dorotea pesa 70 kg y tiene el hígado sano. ¿Qué paracetamol IV pautas, y cuál es el techo diario según este capítulo?',
        opciones: [
          { t: '1 g cada 8 h o 650 mg cada 6 h; máximo 3 g/día en este capítulo', ok: true },
          { t: '1 g cada 6 h, con un techo de 4 g/día', porque: 'Son 4 g, el techo del capítulo de analgesia, no el de este; con 1 g cada 6 h superas la dosis máxima segura que da este capítulo.' },
          { t: '15 mg/kg cada 4 h, sin techo', porque: 'La ficha no da una pauta por peso para el paracetamol y fija un techo: es hepatotóxico. Sin techo hay riesgo de daño hepático.' }],
        explicacion: `Paracetamol IV 650 mg cada 6 h o 1.000 mg cada 8 h; hepatotóxico: dosis máxima segura <span class="hl-rojo">3 g/día</span> (FDA, 2011); contraindicado en la insuficiencia hepática (${pag(72, 'p. 72')}).`,
        nota: '<b>Las fuentes discrepan.</b> En el capítulo de analgesia (Marino · Fundamentos, cap. 6) figura 4 g/día. Se reproducen las dos; no se elige ganadora.' },
      { id: 'ant-g6', corto: 'la manta', tipo: 'test', fuente: 'ma-antip-mantas', modeloVivo: TV('fiebre:5'),
        enunciado: 'Predice y compruébalo con «¿Y si… manta?»: Dorotea tiene 39,6 °C. Le pones una manta de enfriamiento. ¿Qué le pasa?',
        opciones: [
          { t: 'Baja la temperatura sin consecuencias, porque enfría la piel y el punto de ajuste', porque: 'Con fiebre el punto de ajuste está alto; la manta enfría la piel pero el cuerpo reacciona con frío y escalofrío, y la temperatura central sube más.' },
          { t: 'Más vasoconstricción y escalofrío: la respuesta febril ya imita al frío', ok: true },
          { t: 'Baja el punto de ajuste, como el paracetamol', porque: 'La manta no actúa sobre el hipotálamo ni sobre la prostaglandina E; solo enfría desde fuera.' }],
        explicacion: `Mantas de enfriamiento: contraproducentes en la fiebre; su sitio es el golpe de calor, donde la respuesta al calor se ha perdido (${pag(72, 'p. 72')}).` },
    ],
    examen: [
      { id: 'ant-e1', corto: 'AINE', tipo: 'test', fuente: 'ma-antip-aine',
        enunciado: 'Dorotea ya recibió ketorolaco 0,5 mg/kg. ¿Se repite cada 6 h?',
        opciones: [
          { t: 'Sí: cada 6 h, como el ibuprofeno IV', porque: 'El ketorolaco IV es de dosis única de 0,5 mg/kg; repetirlo cada 6 h no tiene base en la ficha y aumenta el riesgo renal y digestivo.' },
          { t: 'No: dosis única; el ibuprofeno IV es 10 mg/kg (máx. 800 mg) cada 6 h', ok: true },
          { t: 'Sí, hasta llegar a 10 mg/kg acumulados, como se hace con el dantroleno', porque: 'Mezcla pautas de fármacos distintos: 10 mg/kg es el techo del dantroleno, no del ketorolaco.' }],
        explicacion: `Ibuprofeno IV 10 mg/kg (máximo 800 mg) cada 6 h; ketorolaco IV en <span class="hl-rojo">dosis única</span> de 0,5 mg/kg (${pag(72, 'p. 72')}).` },
      { id: 'ant-e2', corto: 'qué bloquean', tipo: 'test', fuente: 'ma-antip-aine',
        enunciado: '¿Sobre qué mediador de la fiebre actúan los antipiréticos y cuáles se usan en la UCI?',
        opciones: [
          { t: 'Prostaglandina E: aspirina, paracetamol y AINE; en la UCI, los dos últimos', ok: true },
          { t: 'La IL-1 directamente; el paracetamol es el único usado en la UCI', porque: 'La ficha dice que interfieren con la prostaglandina E, y en la UCI se usan el paracetamol y los AINE. Descartar los AINE reduce las opciones sin base.' },
          { t: 'La serotonina; los más usados son los IMAO', porque: 'Eso es el síndrome serotoninérgico, no la fiebre; los IMAO (como el linezolid) pueden provocar SS.' }],
        explicacion: `Interfieren con la prostaglandina E, mediadora de la fiebre: aspirina, paracetamol y AINE; en la UCI se usan los dos últimos (${pag(71, 'p. 71')}).` },
      { id: 'ant-e3a', corto: 'asociación o causa', tipo: 'test', fuente: 'ma-antip-clinica · ma-tabla-fig44-5',
        enunciado: 'Un residente dice: «la Fig. 44.5 demuestra que subir la temperatura de un séptico baja su mortalidad». ¿Qué le contestas?',
        opciones: [
          { t: 'Que sí, porque el valor de p<0,001 lo demuestra', porque: 'La p<0,001 dice que la asociación no es casual, no que sea causal: la figura es observacional.' },
          { t: 'Que es una asociación observacional, y no prueba causa', ok: true },
          { t: 'Que solo vale en los >39,4 °C, y no en los otros tres grupos de la figura', porque: 'La figura muestra una gradación en los cuatro grupos, no solo en el más alto.' }],
        explicacion: `Fig. 44.5: temperatura inicial y mortalidad en 2.225 pacientes (${pag(70, 'p. 70')} y ${pag(71, '71')}); un estudio vio más mortalidad en los sépticos que recibieron antipiréticos.` },
      { id: 'ant-e4', corto: 'miedo a los AINE', tipo: 'test', fuente: 'ma-antip-aine',
        enunciado: '¿Por qué hay poca experiencia con AINE para la fiebre en la UCI?',
        opciones: [
          { t: 'Porque están contraindicados en la sepsis', porque: 'La ficha no los contraindica; los usa con dosis concretas. Aducir una contraindicación inexistente deja sin una opción segura al paciente.' },
          { t: 'En parte por un miedo exagerado al daño renal y a la hemorragia digestiva', ok: true },
          { t: 'Porque su efecto es menor que el del paracetamol', porque: 'La ficha no compara su eficacia; atribuye la poca experiencia al miedo a la toxicidad.' }],
        explicacion: `Poca experiencia en la UCI, en parte por un <span class="hl">miedo exagerado</span> al daño renal y la hemorragia digestiva (${pag(72, 'p. 72')}).` },
    ],
    casos: [
      { id: 'ant-c1', titulo: 'Dorotea, 55 años: ahora sí', corto: 'Caso · Dorotea', sub: 'shock séptico urinario; 70 kg (peso del caso)',
        paciente: { Edad: '55 años', Peso: '70 kg (del caso)', Motivo: 'Shock séptico de origen urinario' },
        lleva: [
          'En la sepsis la fiebre no se baja de rutina: la guía recomienda no suprimirla.',
          'Tras una parada, con lesión cerebral isquémica, sí se trata, con paracetamol hasta el techo de 3 g/día.',
          'La manta de enfriamiento es del golpe de calor, no de la fiebre.'],
        volver: { nombre: 'Mantas de enfriamiento', ancla: 'ma-antip-mantas', modeloVivo: TV('fiebre:5') },
        pasos: [
          { momento: 'Día 1', datos: { Constantes: 'T 39,6 °C, noradrenalina en perfusión', Diagnóstico: 'shock séptico urinario' }, nuevo: ['Constantes', 'Diagnóstico'],
            pregunta: { id: 'ant-c1-1', tipo: 'test', fuente: 'ma-antip-guias · ma-antip-mantas', modeloVivo: [TV('fiebre:4'), { shockVivo: 'septico' }],
              enunciado: '¿Pautas paracetamol?',
              opciones: [
                { t: 'Sí, de rutina, para bajar el consumo de oxígeno', porque: 'Un estudio vio más mortalidad en los sépticos con antipiréticos y la guía recomienda no suprimir la fiebre de rutina.' },
                { t: 'No de rutina; tampoco una manta a 37 °C, que provoca escalofrío', ok: true },
                { t: 'Una manta a 37 °C y paracetamol, para llegar antes al objetivo de temperatura', porque: 'La manta agrava el escalofrío de la respuesta febril y no hay beneficio en la sepsis.' }],
              explicacion: `La guía recomienda no suprimir la fiebre de rutina (${pag(71, 'p. 71')}); las mantas, contraproducentes en la fiebre (${pag(72, 'p. 72')}).` } },
          { momento: 'Día 1 · tarde',
            pregunta: { id: 'ant-c1-2', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-antip-defensa',
              enunciado: 'Explica a la familia por qué no se baja la fiebre. Tres cosas.',
              puntos: [
                'Más <span class="hl-azul">anticuerpos y citocinas</span>, linfocitos T activados.',
                'Mejor <span class="hl-azul">quimiotaxis y fagocitosis</span>.',
                'Frena <span class="hl">bacterias y virus</span>; en la sepsis, menos mortalidad.'],
              explicacion: `Defensa del huésped (${pag(70, 'p. 70')}).` } },
          { momento: 'Día 2 · giro', datos: { Evolución: 'parada (AESP) recuperada', Constantes: 'T 38,8 °C' }, nuevo: ['Evolución', 'Constantes'], calculadora: { ir: 'ma-antip-resultado', nombre: '¿Antipirético? ¿Cuál y cuánto?' },
            pregunta: { id: 'ant-c1-3', tipo: 'test', fuente: 'ma-antip-guias · ma-antip-paracetamol',
              enunciado: 'Tras la parada, ¿y ahora?',
              opciones: [
                { t: 'Sigo sin tratar, igual que ayer', porque: 'La excepción de las guías es la lesión cerebral isquémica tras una parada: ahí la fiebre es dañina.' },
                { t: 'Ketorolaco 0,5 mg/kg IV cada 6 h para mantener el efecto durante el día', porque: 'El ketorolaco es de dosis única (p. 72); repetirlo no tiene base.' },
                { t: 'Sí: lesión cerebral isquémica; paracetamol 1 g cada 8 h IV', ok: true }],
              explicacion: `La fiebre sí es dañina tras una parada (lesión cerebral isquémica) y debe tratarse (${pag(71, 'p. 71')}); paracetamol IV 1.000 mg cada 8 h (${pag(72, 'p. 72')}).${POSRES}` } },
          { momento: 'Día 2 · plan', datos: { Plan: 'nota del R1' }, nuevo: ['Plan'],
            pregunta: { id: 'ant-c1-4', tipo: 'error', fuente: 'ma-antip-paracetamol · ma-antip-mantas',
              enunciado: 'Nota del R1. Puede haber 0, 1 o 2 errores.',
              frases: [
                { t: 'Paracetamol 1 g cada 6 h IV, hasta 4 g/día.', mal: true, c: 'En este capítulo el techo es <span class="hl-rojo">3 g/día</span> (FDA, 2011); el cap. 6 admite 4 g y las fuentes discrepan (p. 72).' },
                { t: 'Manta de enfriamiento para llegar antes al objetivo.', mal: true, c: 'La manta es <span class="hl">contraproducente en la fiebre</span>: más vasoconstricción y escalofrío (p. 72).' },
                { t: 'Trato la fiebre porque hay lesión cerebral isquémica tras la parada.' },
                { t: 'Si hubiera insuficiencia hepática, no pondría paracetamol.' }],
              explicacion: `Paracetamol: 3 g/día aquí; contraindicado en insuficiencia hepática (${pag(72, 'p. 72')}).`,
              nota: '<b>Las fuentes discrepan.</b> El capítulo 44 pone 3 g/día; el cap. 6 (analgesia) admite 4 g/día. «Error» es respecto a este capítulo; se reproducen las dos.' } },
          { momento: 'Día 3', datos: { Constantes: 'escalofríos, piel fría con la manta puesta' }, nuevo: ['Constantes'],
            pregunta: { id: 'ant-c1-5', tipo: 'test', fuente: 'ma-antip-mantas',
              enunciado: '¿Qué haces con la manta?',
              opciones: [
                { t: 'Subir la intensidad de la manta, para vencer el escalofrío y bajar la temperatura central', porque: 'Más frío externo refuerza la vasoconstricción y el escalofrío, que producen calor.' },
                { t: 'Retirarla: es contraproducente en la fiebre; su sitio es el golpe de calor', ok: true },
                { t: 'Dejarla y añadir un AINE, que actúa sobre el escalofrío', porque: 'Los AINE actúan sobre la prostaglandina E; no frenan el escalofrío que provoca la manta.' }],
              explicacion: `La respuesta febril ya imita al frío y la manta la agrava (${pag(72, 'p. 72')}).` } },
        ] },
    ],
    profundizar: [
      { id: 'ma-antip-final', titulo: 'El Nobel de 1927 (Wagner-Jauregg)' },
      { id: 'mar-img-44-4', titulo: 'Figura 44.4 — Pasteurella a 39 °C y 43 °C' },
    ],
  },
};
