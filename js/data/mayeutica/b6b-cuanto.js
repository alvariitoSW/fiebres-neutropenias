// Estudiar (Texto | Estudiar) del grupo 6E · Cuánto y qué dar (Marino cap. 48, Necesidades nutricionales):
// mu-gasto-energetico, mu-sustratos, mu-tiamina y mu-vitaminas-oligo de js/modules/libros/marino-nutricion.html.
// La pinta js/core/mayeutica.js. Datos puros. Formato: el de js/data/mayeutica/b1-fluidos.js.
//
// Fuente: docs/marino-2024-nutricion-endocrino-caps48-51.pdf, págs. 2-14 (desplazamiento 0); proteínas y propofol
// también de las págs. 23, 25, 38 y 40 (caps. 49-50). Cada explicación y cada distractor dicen su página. Los
// pacientes se inventan (Ildefonso, Crescencia, Aniceto, Emeterio) y sus cifras encajan con las del libro.
// La 4 (mu-vitaminas-oligo) es ficha de consulta: Estudiar corto.

const NU = 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf';
const pdf = (p, t = `PDF pág. ${p}`) => `<a class="biblio-link" href="${NU}#page=${p}" target="_blank" rel="noopener">${t}</a>`;

export const MAYEUTICA_CUANTO = {
  /* =================================================================================================
     1 · Gasto energético (NU págs. 2-4)
     ================================================================================================= */
  'mu-gasto-energetico': {
    entrada: 'Qué quema el paciente, cuánto gasta y por qué el primer día se le da menos de lo que gasta.',
    guia: [
      { id: 'cu-ge-g1', corto: 'cociente respiratorio', tipo: 'test', fuente: 'mu-cr · mu-tabla-48-1',
        enunciado: 'Predice: un paciente consume 250 mL/min de O₂ y produce 250 mL/min de CO₂. ¿Qué combustible domina y cuál es su cociente respiratorio?',
        opciones: [
          { t: 'Hidratos de carbono: CR 1,0', ok: true },
          { t: 'Lípidos: CR 0,7', porque: '0,7 es el cociente mínimo, el de los lípidos, que producen menos CO₂ que O₂ que consumen. Con él creerías que quema grasa cuando quema hidratos y no frenarías el aporte de glucosa que le sube el CO₂ (p. 2).' },
          { t: 'Proteínas: CR 1,0', porque: 'Las proteínas tienen un CR de 0,8, no 1,0; el 1,0 es el de los hidratos. Atribuirías a la proteína un gasto que no es suyo y leerías mal el balance de combustibles (p. 2).' }],
        explicacion: 'CR = VCO₂ ÷ VO₂ = 250 ÷ 250 = <span class="hl-rojo">1,0</span>: el CR más alto es el de los <span class="hl">hidratos (1,0)</span>, el más bajo el de los lípidos (0,7) y el de las proteínas es 0,8 (Tabla 48.1). Un CR de 1,0 indica que los hidratos son el combustible predominante (' + pdf(2) + ' y ' + pdf(3) + ').' },
      { id: 'cu-ge-g2', corto: 'el carro metabólico', tipo: 'destapa', fuente: 'mu-carro · mu-fio2',
        enunciado: '¿Cómo sacas el gasto del día con el carro metabólico y cuándo no te fías de él?',
        cuantas: 'son tres cosas',
        puntos: [
          'Se mide en <span class="hl">equilibrio durante 15-30 minutos</span> (kcal/min).',
          'Se multiplica por <span class="hl">1.440</span>, los minutos de un día: 30 minutos extrapolados equivalen a 24 horas.',
          'No es fiable con <span class="hl-rojo">FiO₂ por encima de 70 %</span> (el límite antiguo era 60 %).'],
        explicacion: 'Indirecta: se calcula el gasto en reposo a partir del VO₂ y el VCO₂ de todo el cuerpo, con sensores en la línea del respirador (' + pdf(3) + ').' },
      { id: 'cu-ge-g3', corto: 'peso ajustado', tipo: 'test', fuente: 'mu-formula · mu-peso-ajustado',
        enunciado: 'Sin carro, un paciente de 100 kg con peso ideal de 70 kg. Predice: ¿qué peso usas y cuánto es su gasto con 25 kcal/kg?',
        opciones: [
          { t: '2.500 kcal: 25 × el peso real de 100 kg, tal cual', porque: 'El peso real solo vale hasta el 125 % del ideal y aquí es el 143 %. Con 2.500 kcal lo sobrealimentarías, con hiperglucemia y lipogénesis (p. 4).' },
          { t: '1.750 kcal: peso ideal, 70 kg', porque: 'El libro no usa el peso ideal para esta cuenta: pasa al ajustado. Con 1.750 kcal infraestimarías el gasto de un paciente con más masa que el ideal (p. 4).' },
          { t: '1.938 kcal: peso ajustado 77,5 kg', ok: true }],
        explicacion: '100 kg es el <span class="hl-rojo">143 %</span> del ideal (más del 125 %): se usa el <span class="hl">peso ajustado = (real − ideal) × 0,25 + ideal</span> = (100 − 70) × 0,25 + 70 = 77,5 kg. GER = 25 × 77,5 = <span class="hl-rojo">1.938 kcal/día</span> (' + pdf(4) + ').' },
      { id: 'cu-ge-g4', corto: 'empezar por debajo', tipo: 'test', fuente: 'mu-menos',
        enunciado: 'Las guías recientes empiezan por debajo del gasto medido o estimado. ¿Por qué?',
        opciones: [
          { t: 'Porque el tubo digestivo del enfermo crítico no tolera más', porque: 'La razón del libro no es digestiva sino metabólica. Con esa idea darías el 100 % por vía parenteral y sobrealimentarías igual (p. 4).' },
          { t: 'Por los ajustes endógenos (más gluconeogénesis): una dieta normal encima sobrealimenta', ok: true },
          { t: 'Solo para evitar el síndrome de realimentación', porque: 'Evitar la realimentación es un motivo añadido y solo en el que llega desnutrido; no explica la regla general. Con esa idea darías el 100 % al que no está desnutrido (p. 4).' }],
        explicacion: 'Al inicio de la enfermedad aguda actúan <span class="hl">ajustes endógenos</span> (p. ej. más gluconeogénesis); sumar una ingesta normal los desborda: <span class="hl-rojo">sobrealimentación</span> con hiperglucemia y lipogénesis. En el desnutrido, evitar la nutrición agresiva reduce además el riesgo de realimentación (' + pdf(4) + ').' },
      { id: 'cu-ge-g5', corto: 'cuánto y cuántos días', tipo: 'test', fuente: 'mu-espen',
        enunciado: 'Estimas el gasto con la ecuación (no hay carro). Estamos en el día 5 de soporte. ¿Qué porcentaje del gasto das?',
        opciones: [
          { t: 'No más del 70 %: con ecuación, 7 días', ok: true },
          { t: '100 %: ya pasaron 3 días desde el ingreso y toca subir', porque: 'Los 3 días son para cuando el gasto se mide con calorimetría; con ecuación son 7. Darías el 100 % en el día 5 y sobrealimentarías al paciente (p. 4).' },
          { t: 'Subir gradualmente hasta el 100 %', porque: 'La subida gradual del día 4 al 7 es la pauta de la calorimetría, no la de la ecuación. Subirías antes de tiempo (p. 4).' }],
        explicacion: 'Europa: con calorimetría, <span class="hl">≤70 % los 3 primeros días</span> y luego subir gradualmente al 100 % durante la primera semana; con ecuación, <span class="hl-rojo">≤70 % los 7 primeros días</span> (' + pdf(4) + ').' },
      { id: 'cu-ge-g6', corto: 'noradrenalina alta', tipo: 'test', fuente: 'mu-espen · mu-ger-calc',
        enunciado: 'Un paciente de 70 kg con noradrenalina a 0,25 µg/kg/min. Predice: ¿cuánto das al día?',
        opciones: [
          { t: '1.225 kcal: el 70 % de 1.750', porque: 'Es la regla general, pero con noradrenalina >0,2 µg/kg/min (>14 µg/min en 70 kg) el libro pide menos. Con 1.225 kcal sobrealimentarías a un paciente con shock (p. 4).' },
          { t: '700-1.050 kcal: 10-15 kcal/kg', ok: true },
          { t: 'Nada: con vasopresor no se nutre', porque: 'El libro baja la dosis a 10-15 kcal/kg durante 7 días o hasta que mejore, no la suprime. Lo dejarías sin aporte de entrada (p. 4).' }],
        explicacion: '0,25 µg/kg/min × 70 kg = 17,5 µg/min, por encima de los 14 µg/min del umbral: <span class="hl">10-15 kcal/kg/día</span> durante 7 días o hasta que mejore = 70 × 10 a 70 × 15 = <span class="hl-rojo">700-1.050 kcal</span> (' + pdf(4) + ').' },
    ],
    examen: [
      { id: 'cu-ge-e1', corto: 'peso ajustado II', tipo: 'test', fuente: 'mu-formula · mu-peso-ajustado',
        enunciado: 'Un paciente de 90 kg, peso ideal 70 kg, sin carro metabólico. ¿Qué GER usas?',
        opciones: [
          { t: '2.250 kcal: 25 × el peso real de 90 kg, sin ajustar', porque: 'El peso real se usa hasta el 125 % del ideal; 90 kg es el 129 %. Sobrealimentarías con 2.250 kcal (p. 4).' },
          { t: '1.875 kcal: peso ajustado 75 kg', ok: true },
          { t: '1.750 kcal: peso ideal, 70 kg', porque: 'El peso ideal no es el que recomienda el libro; con más del 125 % se pasa al ajustado. Infraestimarías el gasto en 125 kcal (p. 4).' }],
        explicacion: '90 ÷ 70 = <span class="hl-rojo">129 %</span> (>125 %): peso ajustado (90 − 70) × 0,25 + 70 = 75 kg; 25 × 75 = <span class="hl-rojo">1.875 kcal</span> (' + pdf(4) + ').' },
      { id: 'cu-ge-e2', corto: 'nota de nutrición', tipo: 'error', fuente: 'mu-cr · mu-carro · mu-espen',
        enunciado: 'La nota de un compañero sobre el gasto energético. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Un CR de 0,7 indica que el paciente quema sobre todo hidratos.', mal: true,
            c: 'El CR más bajo, <span class="hl">0,7, es el de los lípidos</span>; el de los hidratos es 1,0 (p. 2).' },
          { t: 'Con el carro se mide 15-30 minutos y se multiplica por 1.440.' },
          { t: 'Con ecuación: 70 % durante 7 días; con calorimetría, 3 días y luego subir.' },
          { t: 'Con noradrenalina a 0,25 µg/kg/min en 70 kg (17,5 µg/min) hay que bajar a 10-15 kcal/kg.' }],
        explicacion: 'CR de los lípidos 0,7 y de los hidratos 1,0 (' + pdf(3) + '); 15-30 min × 1.440 (' + pdf(3) + '); 70 % durante 3 o 7 días y el umbral de la noradrenalina (' + pdf(4) + ').' },
      { id: 'cu-ge-e3', corto: 'si hay carro, ¿ecuación?', tipo: 'destapa', fuente: 'mu-carro · mu-formula',
        enunciado: 'Hay carro metabólico en el hospital. ¿Para qué quieres entonces la ecuación?',
        cuantas: 'son tres cosas',
        puntos: [
          'Todas las guías recomiendan la <span class="hl">calorimetría indirecta</span>.',
          'Pero es <span class="hl-rojo">cara y necesita personal entrenado</span>: no está en todas partes.',
          'Si no hay, vale <span class="hl">25 × peso</span>: de las más de 200 ecuaciones, ninguna predice mejor.'],
        explicacion: 'Dónde, qué recomiendan y qué hacer sin el equipo (' + pdf(3) + ' y ' + pdf(4) + ').' },
    ],
    casos: [
      { id: 'cu-ild', titulo: 'Ildefonso, 67 años: cuánto se le da y cuándo', corto: 'Caso · Ildefonso (gasto)', sub: 'shock séptico, 80 kg',
        paciente: { Edad: '67 años', Motivo: 'shock séptico de origen abdominal', Peso: '80 kg (ideal 70 kg: 114 %)', Soporte: 'ventilado, noradrenalina' },
        pasos: [
          { momento: 'Día 1 · el shock', datos: { 'Noradrenalina': '0,25 µg/kg/min' }, nuevo: ['Noradrenalina'], calculadora: { ir: 'mu-ger-calc', nombre: 'Gasto energético en reposo' },
            pregunta: { id: 'cu-ild-1', tipo: 'test', fuente: 'mu-ger-calc · mu-espen',
              enunciado: 'No hay medida aún. Con 80 kg (114 % del ideal, peso real) y la noradrenalina a 0,25, ¿cuánto das hoy?',
              opciones: [
                { t: '2.000 kcal: 25 × 80, el GER entero', porque: 'Es el GER, pero con noradrenalina >0,2 µg/kg/min el libro pide menos. Darías todo en pleno shock y sobrealimentarías (p. 4).' },
                { t: '800-1.200 kcal: 10-15 kcal/kg', ok: true },
                { t: '1.400 kcal: el 70 % de 2.000', porque: 'El 70 % es la regla general, pero la noradrenalina a 0,25 (>0,2 µg/kg/min) la cambia por 10-15 kcal/kg. Te pasarías en 200-600 kcal (p. 4).' }],
              explicacion: 'GER = 25 × 80 = 2.000 kcal (peso real: 114 % del ideal, bajo el 125 %). Pero con noradrenalina >0,2 µg/kg/min (>14 µg/min en 70 kg), <span class="hl-rojo">10-15 kcal/kg</span> = 800-1.200 kcal, 7 días o hasta que mejore (' + pdf(4) + ').' } },
          { momento: 'Día 2 · el carro', datos: { 'FiO₂': '80 %', 'Carro metabólico': 'disponible' }, nuevo: ['FiO₂', 'Carro metabólico'],
            pregunta: { id: 'cu-ild-2', tipo: 'test', fuente: 'mu-carro · mu-fio2',
              enunciado: 'Llega el carro. El paciente sigue con FiO₂ de 80 %. ¿Te fías de la medida de hoy?',
              opciones: [
                { t: 'Sí: la calorimetría es el método de referencia y su cifra manda sobre cualquier ecuación', porque: 'Es el de referencia, pero con FiO₂ >70 % puede no ser fiable. Darías por buena una cifra errónea y ajustarías la dieta con ella (p. 3).' },
                { t: 'Sí, el sensor llega a FiO₂ de 90 %', porque: 'El sensor es exacto hasta 70 % (antes 60 %). Por encima no hay garantía y darías por medida una cifra que no lo es (p. 3).' },
                { t: 'No: con FiO₂ >70 % no es fiable; sigues con la estimación', ok: true }],
              explicacion: 'Los carros más nuevos son exactos hasta una FiO₂ de <span class="hl">70 %</span> (antes 60 %); por encima, la calorimetría <span class="hl-rojo">puede no ser fiable</span> (' + pdf(3) + '). Sigues con la estimación del día 1.' } },
          { momento: 'Día 3 · mejora', datos: { 'Noradrenalina': '0,10 µg/kg/min', 'FiO₂': '45 %', 'GER medido (carro)': '2.000 kcal' }, nuevo: ['Noradrenalina', 'FiO₂', 'GER medido (carro)'],
            pregunta: { id: 'cu-ild-3', tipo: 'test', fuente: 'mu-espen',
              enunciado: 'Ahora el carro es fiable y marca 2.000 kcal. Es el tercer día de soporte y la noradrenalina ya está a 0,10. ¿Cuánto das?',
              opciones: [
                { t: '1.400 kcal: el 70 % del gasto medido', ok: true },
                { t: '2.000 kcal: es una medición con carro', porque: 'Con calorimetría se da ≤70 % durante los 3 primeros días y subir después. Darías el 100 % en el día 3 y sobrealimentarías (p. 4).' },
                { t: '800-1.200 kcal: sigues con 10-15 kcal/kg', porque: 'Esa pauta es para noradrenalina >0,2 y ya está a 0,10. Te quedarías corto en 200-600 kcal (p. 4).' }],
              explicacion: 'Con la noradrenalina por debajo de 0,2 vuelve la pauta general: con calorimetría, <span class="hl-rojo">≤70 % los 3 primeros días</span> = 0,7 × 2.000 = 1.400 kcal, y subir gradualmente al 100 % en la primera semana (' + pdf(4) + ').' } },
          { momento: 'Día 5 · otro residente subió la dieta el fin de semana', datos: { 'Glucemia': '240 mg/dL', 'Nota del otro residente': 'GER del día 2 (FiO₂ 80 %); «dieta al 100 % desde el día 1»; proteínas 96-160 g' }, nuevo: ['Glucemia', 'Nota del otro residente'],
            pregunta: { id: 'cu-ild-4', tipo: 'error', fuente: 'mu-carro · mu-fio2 · mu-espen',
              enunciado: 'Glucemia de 240. El residente de guardia subió la dieta y lo justifica así. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Medimos el GER 20 minutos en equilibrio.' },
                { t: 'La medida del día 2, con FiO₂ de 80 %, era fiable.', mal: true,
                  c: 'Por encima de FiO₂ de <span class="hl-rojo">70 %</span> el carro puede no ser fiable (p. 3).' },
                { t: 'Se pautó el 100 % desde el día 1 porque se midió con calorimetría.', mal: true,
                  c: 'Incluso con calorimetría, <span class="hl-rojo">≤70 % los 3 primeros días</span>: la hiperglucemia es la sobrealimentación (p. 4).' },
                { t: 'Proteínas: 96-160 g, o sea 1,2-2,0 g/kg.' }],
              explicacion: 'Equilibrio 15-30 min (' + pdf(3) + '); 70 % los 3 primeros días con calorimetría (' + pdf(4) + '); proteínas 1,2-2,0 g/kg/día: 1,2 × 80 = 96 g y 2,0 × 80 = 160 g (' + pdf(6) + ').' } },
          { momento: 'Día 8 · sin vasopresor', datos: { 'Noradrenalina': 'retirada' }, nuevo: ['Noradrenalina'],
            pregunta: { id: 'cu-ild-5', tipo: 'destapa', fuente: 'mu-ger-calc · mu-hc-techo · mu-proteinas',
              enunciado: 'Con la noradrenalina retirada y el GER en 2.000 kcal, ¿qué pautas le das?',
              cuantas: 'son tres cosas',
              puntos: [
                'Energía: ya al <span class="hl">100 % = 2.000 kcal</span>, tras la subida gradual.',
                'Proteínas: <span class="hl">96-160 g</span> (1,2-2,0 g/kg).',
                'Hidratos: ≤5 mg/kg/min = 5 × 80 × 1.440 ÷ 1.000 = <span class="hl-rojo">576 g/día</span> como techo.'],
              explicacion: 'GER (' + pdf(4) + '), proteínas (' + pdf(6) + ') y techo de hidratos (' + pdf(5) + '). Las multiplicaciones son cálculo propio con el peso del paciente.' } },
        ],
        lleva: [
          'Primero menos: con noradrenalina >0,2 µg/kg/min, 10-15 kcal/kg.',
          'Con FiO₂ >70 % el carro no vale: se estima con 25 × peso.',
          'Del 70 % al 100 % en 3 días con calorimetría o en 7 con ecuación.'],
        volver: { nombre: 'Cuánto dar el primer día', ancla: 'mu-espen' } },
    ],
    profundizar: [
      { id: 'mu-calorimetria', titulo: 'La ecuación de la calorimetría indirecta' },
      { id: 'mu-carro', titulo: 'El carro metabólico' },
      { id: 'mu-cuando', titulo: 'Cuándo empezar: 24-48 horas' },
      { id: 'mu-tabla-48-1', titulo: 'Tabla 48.1 entera' },
    ],
  },

  /* =================================================================================================
     2 · Sustratos: hidratos, lípidos y proteínas (NU págs. 4-7)
     ================================================================================================= */
  'mu-sustratos': {
    entrada: 'Hidratos y lípidos ponen la energía; la proteína se protege con calorías, no con más proteína.',
    guia: [
      { id: 'cu-su-g1', corto: 'hidratos: mínimo y techo', tipo: 'test', fuente: 'mu-hc · mu-hc-techo',
        enunciado: 'Predice: una paciente de 60 kg. ¿Cuánto es el mínimo diario de hidratos y su techo?',
        opciones: [
          { t: 'Mínimo 130 g; techo 5 mg/kg/min = 432 g/día', ok: true },
          { t: 'Mínimo 130 g; techo 500 g/día', porque: 'Los 500 g son el techo de un adulto de 70 kg (5 mg/kg/min); en 60 kg son 432 g. Te pasarías unos 70 g de la glucosa tolerable (p. 5).' },
          { t: 'Sin mínimo: el hígado fabrica la glucosa que haga falta', porque: 'El libro aconseja al menos 130 g/día, porque el sistema nervioso consume 100-120 g de glucosa diarios. Sin ese aporte, forzarías la gluconeogénesis a costa de proteína (p. 5).' }],
        explicacion: 'Mínimo <span class="hl">130 g/día</span> (el SNC gasta 100-120 g). Techo <span class="hl-rojo">5 mg/kg/min</span>: 5 × 60 × 1.440 ÷ 1.000 = 432 g/día (en 70 kg, unos 500 g; ' + pdf(5) + ').' },
      { id: 'cu-su-g2', corto: 'pasarse de hidratos', tipo: 'test', fuente: 'mu-hc-techo · mu-tabla-48-1',
        enunciado: '¿Qué pasa si das hidratos por encima del techo?',
        opciones: [
          { t: 'Hipoglucemia de rebote por exceso de insulina', porque: 'El libro no describe ese rebote: el estrés crítico da resistencia a la insulina e hiperglucemia. Pautarías azúcar si no lo necesita (p. 5).' },
          { t: 'Baja la producción de CO₂ porque los hidratos son el combustible más limpio', porque: 'Al revés: los hidratos tienen el CR más alto (1,0), el que más CO₂ produce por O₂ consumido. En un ventilado, el exceso complica el destete (p. 3 y 5).' },
          { t: 'Más CO₂ y lipogénesis, con hiperglucemia', ok: true }],
        explicacion: 'El estrés promueve <span class="hl">resistencia a la insulina e hiperglucemia</span>, y el exceso de hidratos promueve <span class="hl-rojo">producción de CO₂</span> (CR 1,0) y lipogénesis (' + pdf(5) + ').' },
      { id: 'cu-su-g3', corto: 'el propofol suma', tipo: 'test', fuente: 'mu-propofol',
        nota: '<b>Nota de fuentes.</b> El cap. 48 dice que el propofol aporta <b>1,1 kcal/mL</b> (p. 5; el cap. 49, p. 25, trae las dos cifras: 1,1 y 1 kcal/mL); la hoja de cálculo del cap. 50 lo equipara a la Intralipid al 10 %, <b>1 kcal/mL</b> (p. 40). Se muestran las dos: 396 o 360 kcal/día a 15 mL/h.',
        enunciado: 'Un paciente tiene propofol a 15 mL/h todo el día. Predice: ¿cuántas calorías no proteicas aporta?',
        opciones: [
          { t: 'Ninguna: es un sedante, no una nutrición', porque: 'El propofol va en una emulsión lipídica y el libro obliga a contar sus calorías como no proteicas. Si las ignoras, sobrealimentas con grasa y la hipertrigliceridemia pasa inadvertida (p. 5).' },
          { t: 'Unas 3.600 kcal: la emulsión al 10 % da 10 kcal/mL', porque: 'El 10 % son 100 mg/mL, no 10 kcal/mL: la densidad es 1-1,1 kcal/mL. Con 3.600 kcal le quitarías casi toda la nutrición por una cuenta mal hecha (p. 5 y 40).' },
          { t: 'Unas 396 kcal (360 si se cuenta 1 kcal/mL)', ok: true }],
        explicacion: '15 mL/h × 24 h × 1,1 kcal/mL = <span class="hl-rojo">396 kcal/día</span> (360 con 1 kcal/mL). Cuentan como calorías no proteicas y hay que vigilar los triglicéridos (' + pdf(5) + ', ' + pdf(25) + ' y ' + pdf(40) + ').' },
      { id: 'cu-su-g4', corto: 'tope de lípidos', tipo: 'test', fuente: 'mu-lipidos-exceso · mu-nota-lipidos',
        nota: '<b>Nota de fuentes.</b> El cap. 48 pone el máximo de lípidos en <b>1,5 g/kg/día</b> (p. 6); la Tabla 50.2 da <b>2,5 g/kg/día</b> (p. 38). Se muestran las dos; no se elige una.',
        enunciado: 'Una paciente de 60 kg. Según el cap. 48, ¿cuál es el máximo de lípidos al día?',
        opciones: [
          { t: '150 g/día: 2,5 g/kg', porque: 'Es la Tabla 50.2 (p. 38); el cap. 48 pone el máximo en 1,5 g/kg, porque el exceso de lípidos, sobre todo PUFA, causa daño oxidativo y altera la inmunidad. Darías 60 g de más a una paciente con pulmón ya dañado (p. 5-6).' },
          { t: '90 g/día: 1,5 g/kg', ok: true },
          { t: '0,5 g/kg: el 0,5 % del linoleico', porque: 'El 0,5 % es la proporción mínima de linoleico entre los ácidos grasos, no un tope de dosis. Confundirías un mínimo con un máximo y la dejarías corta (p. 5-6).' }],
        explicacion: 'Máximo recomendado <span class="hl-rojo">1,5 g/kg/día</span> = 1,5 × 60 = 90 g (' + pdf(5) + ' y ' + pdf(6) + '). La Tabla 50.2 da 2,5 g/kg (150 g; ' + pdf(38) + ').' },
      { id: 'cu-su-g5', corto: 'balance nitrogenado', tipo: 'test', fuente: 'mu-balance · mu-bn-calc',
        enunciado: 'Predice: proteína 100 g/día, nitrógeno ureico urinario (NUU) de 10 g/día, sin diarrea. ¿Qué balance sale?',
        opciones: [
          { t: '+6 g: 16 − 10', porque: 'Olvidas el nitrógeno que se pierde por las heces (4-6 g/día). Con +6 darías por logrado el objetivo y no subirías el aporte (p. 6).' },
          { t: '−10 g: restas el NUU a lo bruto, sin pasar la proteína a nitrógeno', porque: 'Has restado el NUU a la proteína en gramos, sin pasarla a nitrógeno (÷ 6,25). Verías una catabolia grave que no existe y forzarías proteína de más (p. 6).' },
          { t: 'Entre 0 y +2 g: 100 ÷ 6,25 − (10 + 4-6)', ok: true }],
        explicacion: 'Aporte: 100 ÷ 6,25 = 16 g de N. Pérdida: NUU + 4-6 g de heces = 14-16 g. Balance = <span class="hl-rojo">0 a +2 g</span>: por debajo del objetivo de +4 a +6 (' + pdf(6) + ').' },
      { id: 'cu-su-g6', corto: 'balance negativo', tipo: 'destapa', fuente: 'mu-bn-calorias · mar-img-48-1',
        enunciado: 'Balance nitrogenado de −8 g con proteína de 1,8 g/kg. ¿Subes la proteína?',
        cuantas: 'son tres cosas',
        puntos: [
          'No: <span class="hl-rojo">mira primero las calorías</span>. Con proteína fija, el balance solo cruza el cero cuando las calorías no proteicas cubren el GER (Fig. 48.1).',
          'Más proteína <span class="hl">no sirve si faltan calorías</span>.',
          'El objetivo es <span class="hl">+4 a +6 g</span> y se valora solo con el paciente estable.'],
        explicacion: 'Primer paso para un balance positivo: calorías no proteicas suficientes para no degradar proteína como energía (' + pdf(6) + ' y ' + pdf(7) + ').' },
    ],
    examen: [
      { id: 'cu-su-e1', corto: 'proteína del crítico', tipo: 'test', fuente: 'mu-proteinas',
        nota: '<b>Nota de fuentes.</b> El cap. 48 recomienda <b>1,2-2,0 g/kg/día</b> (p. 6); la Tabla 49.4 de la nutrición enteral, <b>1,2-1,6</b> (p. 24). Se muestran las dos.',
        enunciado: '¿Qué aporte de proteína recomienda el libro en el paciente crítico?',
        opciones: [
          { t: '0,8-1,0 g/kg/día, igual que en el sano sin enfermedad aguda', porque: 'Es la necesidad del sano; el crítico tiene hipercatabolismo y se queda corto con eso. Perdería masa muscular de más (p. 6).' },
          { t: '1,2-2,0 g/kg/día (1,2-1,6 en la Tabla 49.4)', ok: true },
          { t: 'Hasta 2,5 g/kg/día para forzar el balance', porque: 'Pasa del rango del libro y, sin calorías suficientes, no mejora el balance. Cargarías al riñón con urea sin ganancia (p. 6-7).' }],
        explicacion: 'Normal 0,8-1,0 g/kg/día; en el crítico, por la hipercatabolia, <span class="hl-rojo">1,2-2,0 g/kg/día</span> (' + pdf(6) + '); la Tabla 49.4 lo deja en 1,2-1,6 (' + pdf(24) + ').' },
      { id: 'cu-su-e2', corto: 'ácido linoleico', tipo: 'test', fuente: 'mu-linoleico',
        enunciado: '¿Qué produce el déficit de ácido linoleico y cómo se evita?',
        opciones: [
          { t: 'Dermopatía escamosa, disfunción cardíaca e infecciones; se evita con 0,5 % de los ácidos grasos', ok: true },
          { t: 'Hepatopatía; se evita con el 3-4 % de las calorías', porque: 'Ese 3-4 % es una cifra del cap. 50 y la clínica del libro es otra: piel, corazón e infecciones. Vigilarías el hígado y no verías el déficit (p. 5 y 37-38).' },
          { t: 'Hipoglucemia y neuropatía; se evita con 0,5 % de proteína', porque: 'El libro no asocia el linoleico a esa clínica: es un ácido graso y su déficit da piel, corazón e infecciones. Buscarías la glucemia y no repondrías el ácido graso esencial (p. 5).' }],
        explicacion: 'El linoleico es el <span class="hl">único ácido graso esencial</span> de la dieta; su déficit da dermopatía escamosa, disfunción cardíaca y más infecciones, y se evita con el <span class="hl-rojo">0,5 %</span> de los ácidos grasos (' + pdf(5) + ').' },
      { id: 'cu-su-e3', corto: 'nota de sustratos', tipo: 'error', fuente: 'mu-sustratos · mu-propofol · mu-nota-lipidos · mu-balance',
        enunciado: 'La nota de un compañero sobre los sustratos. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'La proteína aporta la energía; los hidratos y los lípidos mantienen las enzimas.', mal: true,
            c: 'Al revés: la energía va en <span class="hl">calorías no proteicas</span> (hidratos y lípidos) y la proteína mantiene enzimas y estructuras (p. 4).' },
          { t: 'El propofol aporta 1,1 kcal/mL: hay que sumarlo.' },
          { t: 'Lípidos: máximo 1,5 g/kg aquí y 2,5 g/kg en la Tabla 50.2.' },
          { t: 'El NUU recoge un tercio del nitrógeno de la proteína degradada.', mal: true,
            c: '<span class="hl-rojo">Dos tercios</span> del N van a la orina y el 85 % de ese es urea (p. 6).' }],
        explicacion: 'Calorías no proteicas y proteínas (' + pdf(4) + '); propofol (' + pdf(5) + '); lípidos (' + pdf(5) + ' y ' + pdf(38) + '); nitrógeno urinario (' + pdf(6) + ').' },
      { id: 'cu-su-e4', corto: 'calorías al 80 %', tipo: 'test', fuente: 'mu-bn-calorias · mar-img-48-1',
        enunciado: 'Un paciente recibe el 80 % de su GER en calorías no proteicas con proteína fija. Según la Figura 48.1, ¿qué le pasa al balance si subes la proteína?',
        opciones: [
          { t: 'Se hace positivo, porque llega más nitrógeno', porque: 'Con calorías por debajo del GER la proteína se quema como energía y el balance sigue negativo. Subirías proteína sin efecto (p. 6-7).' },
          { t: 'Sigue negativo mientras las calorías no cubran el GER', ok: true },
          { t: 'Es indiferente: las calorías no cuentan para el balance, solo la proteína', porque: 'Son lo primero: sin ellas la proteína se degrada para dar energía. Descuidarías las calorías y el balance seguiría negativo (p. 6-7).' }],
        explicacion: 'Con ingesta proteica constante el balance se hace positivo <span class="hl-rojo">solo cuando las calorías no proteicas alcanzan el GER</span>; aumentar la proteína no lo consigue si faltan calorías (' + pdf(6) + ' y ' + pdf(7) + ').' },
    ],
    casos: [
      { id: 'cu-cre', titulo: 'Crescencia, 49 años: la proteína no sustituye a las calorías', corto: 'Caso · Crescencia (sustratos)', sub: 'pancreatitis grave, 60 kg',
        paciente: { Edad: '49 años', Motivo: 'pancreatitis aguda grave', Peso: '60 kg', Soporte: 'ventilada con propofol; enteral desde el día 2', GER: '1.500 kcal (25 × 60)' },
        pasos: [
          { momento: 'Día 8 de soporte · el balance', datos: { 'Aporte': '900 kcal (60 % del GER)', 'Proteína': '90 g', 'NUU': '20 g/día' }, nuevo: ['Aporte', 'Proteína', 'NUU'], calculadora: { ir: 'mu-bn-calc', nombre: 'Balance nitrogenado' },
            pregunta: { id: 'cu-cre-1', tipo: 'test', fuente: 'mu-bn-calc · mu-balance',
              enunciado: 'Sin diarrea. ¿Qué balance nitrogenado tiene?',
              opciones: [
                { t: '−5,6 g: 14,4 − 20', porque: 'Olvidas las heces (4-6 g/día). Verías una catabolia menor de la real y la tolerarías (p. 6).' },
                { t: 'Entre −11,6 y −9,6 g', ok: true },
                { t: '+14,4 g: solo el aporte', porque: 'Has tomado el nitrógeno de entrada sin restar las pérdidas. Creerías que está en anabolismo y no corregirías el aporte (p. 6).' }],
              explicacion: '90 ÷ 6,25 = 14,4 g de N; pérdidas 20 + 4-6 = 24-26 g; balance = <span class="hl-rojo">−11,6 a −9,6 g</span> (' + pdf(6) + ').' } },
          { momento: 'Día 8 · la visita', datos: { 'Adjunto': '«subamos la proteína a 2,5 g/kg»' }, nuevo: ['Adjunto'],
            pregunta: { id: 'cu-cre-2', tipo: 'destapa', fuente: 'mu-bn-calorias · mar-img-48-1 · mu-proteinas',
              enunciado: 'El adjunto quiere subir la proteína a 2,5 g/kg. ¿Qué le contestas?',
              cuantas: 'son tres cosas',
              puntos: [
                'Con calorías al 60 % del GER, <span class="hl-rojo">más proteína no corrige el balance</span> (Fig. 48.1).',
                'Primero se suben las <span class="hl">calorías no proteicas</span> hasta cubrir el GER.',
                '2,5 g/kg <span class="hl">pasa del rango</span>: 1,2-2,0 g/kg (1,2-1,6 en la Tabla 49.4).'],
              explicacion: 'Figura 48.1 (' + pdf(6) + ' y ' + pdf(7) + ') y rangos de proteína (' + pdf(6) + ' y ' + pdf(24) + ').' } },
          { momento: 'Día 8 · el propofol', datos: { 'Propofol': '15 mL/h' }, nuevo: ['Propofol'],
            pregunta: { id: 'cu-cre-3', tipo: 'test', fuente: 'mu-propofol · mu-nota-propofol',
              enunciado: 'Va con propofol a 15 mL/h. ¿Cuántas calorías aporta y cómo cuentan?',
              opciones: [
                { t: 'Ninguna: es un sedante de la UCI y no entra en las cuentas de nutrición', porque: 'Va en emulsión lipídica y debe contarse como calorías no proteicas. Darías de más y la sobrealimentarías con grasa (p. 5 y 25).' },
                { t: '396 kcal (360 con 1 kcal/mL), y cuentan como no proteicas', ok: true },
                { t: '396 kcal, pero se suman a las proteicas', porque: 'El libro las cuenta como calorías no proteicas, no como proteicas. Las sumarías donde no toca y falsearías el cociente de calorías (p. 5).' }],
              explicacion: '15 × 24 × 1,1 = <span class="hl-rojo">396 kcal</span> (360 con 1 kcal/mL, cap. 50): se restan de las calorías no proteicas que le faltan (' + pdf(5) + ' y ' + pdf(25) + ').' } },
          { momento: 'Día 9 · el plan del otro residente', datos: { 'Plan': 'GER 1.500 al 100 %; proteína 150 g; lípidos 30 %, máx. 90 g; hidratos 100 g' }, nuevo: ['Plan'],
            pregunta: { id: 'cu-cre-4', tipo: 'error', fuente: 'mu-espen · mu-proteinas · mu-hc · mu-lipidos-exceso',
              enunciado: 'El plan del otro residente. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Subimos a 1.500 kcal (100 %): ya van 8 días de soporte con ecuación.' },
                { t: 'Proteína a 150 g (2,5 g/kg) para forzar el balance.', mal: true,
                  c: '2,5 g/kg pasa del rango <span class="hl-rojo">1,2-2,0 g/kg</span> y no corrige el balance si faltan calorías (p. 6-7).' },
                { t: 'Lípidos el 30 % de las calorías, con un máximo de 90 g.' },
                { t: 'Hidratos a 100 g para no subir el CO₂.', mal: true,
                  c: 'El mínimo es <span class="hl-rojo">130 g/día</span>: por debajo, el sistema nervioso no tiene su glucosa (p. 5).' }],
              explicacion: 'Con ecuación, 70 % durante 7 días y luego 100 % (' + pdf(4) + '); proteínas (' + pdf(6) + '); lípidos y hidratos (' + pdf(5) + ').' } },
          { momento: 'Día 12 · tras ajustar', datos: { 'Aporte': '1.500 kcal', 'Proteína': '90 g', 'NUU': '8 g/día' }, nuevo: ['Aporte', 'Proteína', 'NUU'], calculadora: { ir: 'mu-bn-calc', nombre: 'Balance nitrogenado' },
            pregunta: { id: 'cu-cre-5', tipo: 'test', fuente: 'mu-bn-calc · mu-balance',
              enunciado: 'Con las calorías ya al 100 % del GER, ¿cómo está el balance?',
              opciones: [
                { t: 'En objetivo, de +4 a +6 g', porque: 'Sale menos: 14,4 − (8 + 4-6) = +0,4 a +2,4 g, por debajo de +4. Te darías por satisfecha y la proteína se quedaría corta (p. 6).' },
                { t: 'Negativo, igual que el día 8, porque la proteína sigue siendo de 90 g', porque: 'Con calorías suficientes el balance ya cruza el cero; la mejora es la de la Figura 48.1. No verías el efecto de haber corregido las calorías (p. 6-7).' },
                { t: 'Positivo pero bajo el objetivo: +0,4 a +2,4 g', ok: true }],
              explicacion: '14,4 − (8 + 4-6) = <span class="hl-rojo">+0,4 a +2,4 g</span>: positivo, con las calorías cubiertas, pero por debajo de +4 a +6 (' + pdf(6) + ' y ' + pdf(7) + ').' } },
          { momento: 'Día 13 · diarrea', datos: { 'Deposiciones': '5 al día' }, nuevo: ['Deposiciones'],
            pregunta: { id: 'cu-cre-6', tipo: 'destapa', fuente: 'mu-balance',
              enunciado: 'Con cinco deposiciones líquidas, pides otro balance nitrogenado. ¿Qué interpretas?',
              cuantas: 'son dos cosas',
              puntos: [
                'Con diarrea las pérdidas no urinarias <span class="hl-rojo">no se pueden estimar</span>: el balance no es fiable.',
                'Y se valora solo con el <span class="hl">paciente estable</span>.'],
              explicacion: 'Las heces aportan unos 4-6 g/día de N en condiciones normales; con diarrea esa estimación falla (' + pdf(6) + ').' } },
        ],
        lleva: [
          'Primero las calorías: más proteína no sirve si faltan.',
          'El balance cuenta 4-6 g de heces, y no vale con diarrea.',
          'El propofol son calorías no proteicas: 396 kcal a 15 mL/h.'],
        volver: { nombre: 'Balance y calorías no proteicas', ancla: 'mu-bn-calorias' } },
    ],
    profundizar: [
      { id: 'mu-tabla-48-2', titulo: 'Reservas endógenas (Tabla 48.2)', nota: 'El libro imprime un total de 165.000 kcal; la suma de las filas sale algo distinta (nota en la ficha).' },
      { id: 'mu-nota-lipidos', titulo: 'Lípidos: 1,5 o 2,5 g/kg' },
      { id: 'mu-linoleico', titulo: 'El ácido linoleico' },
      { id: 'mu-lipidos', titulo: 'Lípidos, el 30 % de la energía' },
    ],
  },

  /* =================================================================================================
     3 · Tiamina (NU págs. 8-11)
     ================================================================================================= */
  'mu-tiamina': {
    entrada: 'Un lactato alto sin causa en un alcohólico es tiamina: 500 mg IV cada 8 h y magnesio, no 100 mg.',
    guia: [
      { id: 'cu-ti-g1', corto: 'por qué sube el lactato', tipo: 'test', fuente: 'mu-tia-funcion · mu-tia-lactato', modelo: { acidobaseVivo: 'lactica' },
        enunciado: 'Predice: un déficit de tiamina, ¿por qué sube el lactato?',
        opciones: [
          { t: 'Porque la hipoperfusión obliga al metabolismo anaerobio, como en el shock', porque: 'La hipoperfusión es otra causa de lactato y el libro la separa: aquí falta un cofactor, no flujo. Con esa idea correrías a dar volumen a alguien con la presión normal (p. 10).' },
          { t: 'Sin pirofosfato de tiamina, la piruvato deshidrogenasa no mete el piruvato', ok: true },
          { t: 'Porque el alcohol inhibe la absorción de tiamina y además se convierte en lactato', porque: 'Es mezcla de verdad y error: el alcohol sí inhibe la absorción intestinal de tiamina, pero no se convierte en lactato; ese no es el mecanismo. Perderías la tiamina como causa (p. 8).' }],
        explicacion: 'La tiamina se convierte en <span class="hl">pirofosfato de tiamina</span>, cofactor de la piruvato deshidrogenasa; sin ella el piruvato no entra en la mitocondria y se forma <span class="hl-rojo">más lactato</span> (' + pdf(8) + ' y ' + pdf(10) + ').' },
      { id: 'cu-ti-g2', corto: 'las reservas', tipo: 'test', fuente: 'mu-tia-reservas',
        enunciado: '¿Cuánta tiamina almacena un adulto sano y cuánto dura sin aporte?',
        opciones: [
          { t: 'Unos 300 mg: duran varios meses sin aporte', porque: 'Son unos 30 mg y se agotan en semanas. Pensarías que hay margen de meses y no darías tiamina al que lleva días sin comer (p. 8).' },
          { t: 'Unos 30 mg: se agotan en 2-3 semanas', ok: true },
          { t: 'Unos 30 mg: se agotan en 3 días', porque: 'La cifra de reserva es correcta, pero se agotan en 2-3 semanas, no en 3 días. Exagerarías la urgencia en un paciente que acaba de ingresar (p. 8).' }],
        explicacion: 'Reservas de unos <span class="hl">30 mg</span>, agotadas en <span class="hl-rojo">2-3 semanas</span> sin aporte; la necesidad normal es de 1 mg/día (' + pdf(8) + ').' },
      { id: 'cu-ti-g3', corto: 'por qué el Mg antes', tipo: 'destapa', fuente: 'mu-tia-otros · mu-tia-tto',
        enunciado: '¿Por qué hay que corregir el magnesio al reponer tiamina?',
        cuantas: 'son dos cosas',
        puntos: [
          'Sin magnesio, la tiamina infundida <span class="hl-rojo">no se convierte en pirofosfato</span>, que es la forma que se usa.',
          'La depleción de magnesio <span class="hl">predispone por sí misma</span> al déficit de tiamina.'],
        explicacion: 'El magnesio inhibe la conversión a pirofosfato cuando falta; hay que detectarlo y corregirlo para aprovechar la tiamina (' + pdf(8) + ' y ' + pdf(11) + ').' },
      { id: 'cu-ti-g4', corto: 'glucosa y tiamina', tipo: 'test', fuente: 'mu-tia-realimentacion',
        enunciado: 'Un paciente con reservas justas recibe nutrición con glucosa. ¿Por qué eso puede precipitar el déficit de tiamina?',
        opciones: [
          { t: 'Porque la glucosa bloquea la absorción de tiamina en el intestino del enfermo', porque: 'No es lo que dice el libro: la carga de glucosa precipita el déficit en quien tiene reservas límite, no bloquea la absorción. Darías tiamina oral esperando absorción cuando el problema es la reserva agotada (p. 8).' },
          { t: 'Es el síndrome de realimentación con otro nombre', porque: 'El libro lo compara con el síndrome de realimentación, pero lo considera una entidad distinta. Aplicarías el protocolo de realimentación y olvidarías la tiamina (p. 9).' },
          { t: 'Con reservas al límite, la carga de glucosa de la nutrición agota la tiamina', ok: true }],
        explicacion: 'Quien llega con reservas límite se queda sin tiamina al recibir una <span class="hl-rojo">carga de glucosa</span> (la nutrición); es parecido a la realimentación pero una entidad distinta (' + pdf(8) + ' y ' + pdf(9) + ').' },
      { id: 'cu-ti-g5', corto: 'la tríada', tipo: 'test', fuente: 'mu-tia-wernicke',
        enunciado: 'En la encefalopatía de Wernicke, ¿en cuántos aparece la tríada clásica?',
        opciones: [
          { t: 'En el 20 %; alteración mental en el 80 % y oculares en el 30 %', ok: true },
          { t: 'En el 80 %; alteración mental en el 20 % y oculares en el 30 %', porque: 'El 80 % es el de las alteraciones mentales, no el de la tríada completa: has cruzado las cifras. Exigirías la tríada y dejarías sin tratar a 4 de cada 5 pacientes (p. 9).' },
          { t: 'En el 30 %; alteración mental en el 80 % y oculares en el 20 %', porque: 'El 30 % es el de los signos oculares, no el de la tríada, y los oculares no son el 20 %. Esperarías la tríada y perderías el diagnóstico (p. 9).' }],
        explicacion: 'La tríada (alteración mental, ocular y ataxia) ocurre en solo el <span class="hl-rojo">20 %</span>; alteración mental en el 80 % y ocular en el 30 % (' + pdf(9) + ').' },
      { id: 'cu-ti-g6', corto: 'la pauta', tipo: 'test', fuente: 'mu-tia-tto · mu-tabla-48-4',
        enunciado: 'Sospechas déficit de tiamina en un paciente crítico. ¿Qué pauta pones?',
        opciones: [
          { t: '500 mg IV/8 h 2-3 días; 100 mg/día 3-5 días; 100 mg orales/8 h 1-2 semanas; 100 mg/día', porque: 'El segundo escalón vuelve a la dosis convencional de 100 mg/día, que el libro considera inadecuada para corregir el déficit. Lo dejarías sin corregir (p. 11).' },
          { t: '500 mg orales/8 h 2-3 días; 250 mg orales/día 3-5 días; 100 mg orales/8 h 1-2 semanas; 100 mg/día', porque: 'Al inicio se prefiere la vía intravenosa: la absorción oral es errática en el crítico. El tratamiento fallaría por mala absorción (p. 11).' },
          { t: '500 mg IV/8 h 2-3 días; 250 mg IV/día 3-5 días; 100 mg orales/8 h 1-2 semanas; 100 mg/día', ok: true }],
        explicacion: 'La dosis de 100 mg/día <span class="hl-rojo">no corrige</span> el déficit; la pauta es la de la Tabla 48.4 (500 mg IV/8 h, luego 250 mg IV/día, 100 mg orales/8 h y 100 mg/día), con la vía IV siempre al principio (' + pdf(9) + ' y ' + pdf(11) + ').' },
    ],
    examen: [
      { id: 'cu-ti-e1', corto: 'shock séptico', tipo: 'test', fuente: 'mu-tia-otros',
        enunciado: '¿En qué proporción de pacientes con shock séptico se ha descrito déficit de tiamina?',
        opciones: [
          { t: 'Hasta el 20 %', porque: 'El 20 % es la frecuencia de la tríada de Wernicke, otra cifra. Subestimarías el déficit en el shock séptico (p. 8 y 9).' },
          { t: 'Hasta el 30 %', porque: 'El 30 % es la frecuencia de los signos oculares en Wernicke. No pedirías sospecharlo en uno de cada dos pacientes sépticos (p. 9).' },
          { t: 'Hasta el 70 %', ok: true }],
        explicacion: 'Déficit de tiamina descrito en <span class="hl-rojo">hasta el 70 %</span> de los pacientes con shock séptico (' + pdf(8) + ').' },
      { id: 'cu-ti-e2', corto: 'qué medir', tipo: 'test', fuente: 'mu-tia-lab',
        enunciado: 'Quieres confirmar el déficit con una analítica. ¿Qué miras?',
        opciones: [
          { t: 'Tiamina plasmática, la prueba habitual y de la que te puedes fiar', porque: 'Los niveles plasmáticos no son fiables. Te fiarías de una cifra normal y descartarías un déficit real (p. 11).' },
          { t: 'Pirofosfato de tiamina en sangre total: normal 63-229 nmol/L', ok: true },
          { t: 'Pirofosfato de tiamina en plasma: normal 63-229 nmol/L', porque: 'La cifra es la del pirofosfato en sangre total, no en plasma, donde la tiamina no es fiable. Pedirías la muestra equivocada y te fiarías de un resultado sin valor (p. 11).' }],
        explicacion: 'Casi toda la tiamina es pirofosfato en los hematíes: el ensayo en sangre total (normal <span class="hl">63-229 nmol/L</span>) tiene sentido; la plasmática no es fiable y el diagnóstico es clínico (' + pdf(11) + ').' },
      { id: 'cu-ti-e3', corto: 'nota de tiamina', tipo: 'error', fuente: 'mu-tia-otros · mu-tia-tto · mu-tia-rm',
        enunciado: 'La nota de un compañero sobre la tiamina. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'La furosemida crónica aumenta la excreción renal de tiamina.' },
          { t: 'La cirugía bariátrica protege del déficit de tiamina.', mal: true,
            c: 'La cirugía gástrica por obesidad <span class="hl-rojo">predispone</span> al déficit por peor absorción (p. 8).' },
          { t: 'Pauta: 500 mg IV/8 h, luego 250 mg IV/día, luego 100 mg orales/8 h y 100 mg/día.' },
          { t: 'Una RM normal, con sensibilidad del 93 %, descarta Wernicke.', mal: true,
            c: 'La RM tiene <span class="hl-rojo">sensibilidad del 53 %</span> y especificidad del 93 %: una normal no lo descarta (p. 11).' }],
        explicacion: 'Furosemida, cirugía bariátrica (' + pdf(8) + '); Tabla 48.4 (' + pdf(9) + '); sensibilidad y especificidad de la RM (' + pdf(11) + ').' },
      { id: 'cu-ti-e4', corto: 'furosemida e IC', tipo: 'destapa', fuente: 'mu-tia-corazon',
        enunciado: 'El adjunto dice: «con la furosemida crónica y la insuficiencia cardiaca, tiamina y listo». ¿Qué matizas?',
        cuantas: 'son tres cosas',
        puntos: [
          'El déficit de tiamina típico da <span class="hl">beriberi húmedo: insuficiencia cardiaca de gasto alto</span>.',
          'La furosemida crónica puede <span class="hl">agravar otras miocardiopatías</span> por el déficit.',
          'Pero suplementar en la insuficiencia cardiaca <span class="hl-rojo">no ha mostrado efecto convincente</span> en la función ni los síntomas.'],
        explicacion: 'Cardiomiopatía por déficit de tiamina y evidencia del suplemento (' + pdf(9) + ').' },
    ],
    casos: [
      { id: 'cu-ani', titulo: 'Aniceto, 56 años: el lactato que no tiene causa', corto: 'Caso · Aniceto (tiamina)', sub: 'alcohol y neumonía, 70 kg',
        paciente: { Edad: '56 años', Motivo: 'neumonía', Antecedente: 'consumo crónico de alcohol', Peso: '70 kg' },
        pasos: [
          { momento: 'Ingreso · lactato alto', datos: { 'Lactato': '5,0 mmol/L', 'PA': '126/74', 'FC': '98', 'Diuresis': 'normal', 'SatO₂': '94 %' }, nuevo: ['Lactato', 'PA', 'FC', 'Diuresis', 'SatO₂'], calculadora: { ir: 'mu-tia-calc', nombre: 'Tiamina' },
            pregunta: { id: 'cu-ani-1', tipo: 'test', fuente: 'mu-tia-calc · mu-tia-lactato', modelo: { acidobaseVivo: 'lactica' },
              enunciado: 'Alcohol, neumonía, lactato 5,0, con la presión y la diuresis normales. ¿Qué sospechas?',
              opciones: [
                { t: 'Un shock oculto con hipoperfusión: hay que dar volumen sin demora', porque: 'No hay hipoperfusión: PA, FC, diuresis y SatO₂ están bien. Darías volumen a ciegas y el lactato seguiría alto (p. 10).' },
                { t: 'Déficit de tiamina: lactato sin causa en un alcohólico', ok: true },
                { t: 'Dosar tiamina plasmática y esperar el resultado', porque: 'Los niveles plasmáticos no son fiables y el diagnóstico es clínico. Retrasarías un tratamiento inocuo (p. 11).' }],
              explicacion: '<span class="hl-rojo">Lactato de causa no aclarada</span>, con un factor de riesgo (alcohol), obliga a sospechar déficit de tiamina; el diagnóstico es clínico y no esperas a un nivel (' + pdf(10) + ' y ' + pdf(11) + ').' } },
          { momento: 'Ingreso · el magnesio', datos: { 'Mg': '1,4 mg/dL (bajo según el laboratorio)' }, nuevo: ['Mg'],
            pregunta: { id: 'cu-ani-2', tipo: 'destapa', fuente: 'mu-tia-tto · mu-tabla-48-4',
              enunciado: 'Vas a tratar el déficit de tiamina. ¿Qué pautas?',
              cuantas: 'son tres cosas',
              puntos: [
                'Tiamina <span class="hl-rojo">500 mg IV cada 8 horas</span> durante 2-3 días.',
                'Por vía <span class="hl">IV siempre al principio</span>: la absorción oral es errática en el crítico.',
                'Reponer el <span class="hl">magnesio</span> para que se convierta en pirofosfato.'],
              explicacion: 'Tabla 48.4 (' + pdf(9) + ') y recomendaciones de tratamiento (' + pdf(11) + '). El libro no da un corte numérico del Mg; el «bajo» es del laboratorio.' } },
          { momento: 'Ingreso · la nota del otro residente', datos: { 'Nota': 'profilaxis habitual; pirofosfato; Mg; RM' }, nuevo: ['Nota'],
            pregunta: { id: 'cu-ani-3', tipo: 'error', fuente: 'mu-tia-tto · mu-tia-clinico · mu-tia-rm',
              enunciado: 'El otro residente deja esta nota. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: '100 mg/día de profilaxis, como siempre.', mal: true,
                  c: '100 mg al día es la dosis convencional y <span class="hl-rojo">no corrige</span> el déficit (p. 11).' },
                { t: 'Pido pirofosfato (63-229) pero empiezo la tiamina sin esperar el resultado.' },
                { t: 'Repongo el magnesio.' },
                { t: 'RM si aparecen confusión o nistagmo.' }],
              explicacion: 'Dosis convencional, tiamina sin esperar el resultado, magnesio y RM (' + pdf(11) + ').' } },
          { momento: 'Día 2 · el lactato', datos: { 'Lactato': '1,8 mmol/L' }, nuevo: ['Lactato'],
            pregunta: { id: 'cu-ani-4', tipo: 'test', fuente: 'mu-tia-lactato', modelo: { acidobaseVivo: 'lactica' },
              enunciado: 'Con la tiamina y el magnesio, el lactato ha bajado a 1,8. ¿Por qué?',
              opciones: [
                { t: 'El magnesio actúa como tampón de la acidosis y neutraliza el lactato formado', porque: 'El magnesio no tampona: permite convertir la tiamina en pirofosfato. Atribuirías la mejoría a otro fármaco y no sabrías por qué (p. 11).' },
                { t: 'El suero diluyó el lactato', porque: 'No recibió volumen en este caso; la dilución no explica la caída. Seguirías buscando causas de hipoperfusión inexistentes (p. 10).' },
                { t: 'El piruvato ya entra en la mitocondria, con su cofactor repuesto', ok: true }],
              explicacion: 'Repuesto el pirofosfato de tiamina, la piruvato deshidrogenasa mete el <span class="hl-rojo">piruvato en la mitocondria</span> y el lactato baja (' + pdf(8) + ', ' + pdf(10) + ' y ' + pdf(11) + '). Que baje es un dato del paciente: el libro no da cuánto baja.' } },
          { momento: 'Día 3 · confusión y nistagmo', datos: { 'Neurológico': 'confusión y nistagmo', 'RM': 'hiperseñal bilateral en tálamo medial' }, nuevo: ['Neurológico', 'RM'],
            pregunta: { id: 'cu-ani-5', tipo: 'test', fuente: 'mu-tia-rm · mu-tia-wernicke · mar-img-48-2',
              enunciado: 'La RM (como la Figura 48.2) muestra hiperseñal en ambos tálamos mediales. ¿Qué haces con la tríada y la RM?',
              opciones: [
                { t: 'Compatible con Wernicke; una RM normal no lo descartaría (sensibilidad 53 %)', ok: true },
                { t: 'Una RM normal lo habría descartado, porque su sensibilidad es del 93 %', porque: 'La sensibilidad es 53 % y la especificidad 93 %: has invertido las cifras, y con sensibilidad de 53 % una RM normal no descarta. Con una RM normal lo descartarías y no tratarías a un Wernicke real (p. 11).' },
                { t: 'Sin la tríada completa no es Wernicke: espera a que aparezcan los tres signos', porque: 'La tríada solo aparece en el 20 %. Exigirla dejaría sin tratar a la mayoría (p. 9).' }],
              explicacion: 'Aumento de señal T2 bilateral en el <span class="hl">tálamo medial</span> (' + pdf(11) + '). Sensibilidad <span class="hl-rojo">53 %</span>, especificidad 93 %: una RM normal no excluye el diagnóstico; la tríada solo aparece en el 20 % (' + pdf(9) + ').' } },
        ],
        lleva: [
          'Lactato sin causa en un alcohólico: sospecha tiamina.',
          'Repón el magnesio; 100 mg al día no corrigen: 500 mg IV cada 8 h.',
          'Tiamina antes de la glucosa de la nutrición.'],
        volver: { nombre: 'Diagnóstico clínico de la tiamina', ancla: 'mu-tia-clinico', modelo: { acidobaseVivo: 'lactica' } } },
    ],
    profundizar: [
      { id: 'mu-tia-corazon', titulo: 'La miocardiopatía (beriberi húmedo)' },
      { id: 'mu-tia-tto', titulo: 'La dosis importa' },
      { id: 'mu-tia-alcohol', titulo: 'El alcohol y la tiamina' },
      { id: 'mu-tia-rm', titulo: 'RM: localizaciones' },
    ],
  },

  /* =================================================================================================
     4 · Vitaminas y oligoelementos (NU págs. 7-8, 12-14) · ficha de consulta
     ================================================================================================= */
  'mu-vitaminas-oligo': {
    entrada: 'Vitamina D y selenio se reponen; el hierro, solo con déficit y anemia; y la glucosa del enfermo acaba en lactato.',
    guia: [
      { id: 'cu-vo-g1', corto: 'vitamina D', tipo: 'test', fuente: 'mu-vitd · mu-vitd-dx',
        enunciado: 'Un paciente con 25-OHD de 25 nmol/L. ¿Cómo lo clasificas y qué dice el libro de reponer?',
        opciones: [
          { t: 'Déficit grave (<30); 150.000 UI IM normalizan el nivel en el 90 %', ok: true },
          { t: 'Déficit leve; basta la dieta o la vía oral con 600 UI al día', porque: 'Por debajo de 30 nmol/L el déficit es grave, y la absorción oral no es fiable en el crítico. Te quedarías con un déficit sin corregir (p. 12).' },
          { t: 'Normal: el déficit empieza por debajo de 10 nmol/L', porque: 'El déficit se define por debajo de 50 nmol/L, y es grave por debajo de 30. Dejarías sin tratar un déficit grave que se asocia a más infecciones (p. 11-12).' }],
        explicacion: 'Déficit en el <span class="hl">40-100 %</span> de los pacientes de UCI; las nutriciones dan 200-400 UI frente a 600. <span class="hl"><50 nmol/L déficit; <30 grave</span>; una sola inyección IM de 150.000 UI normaliza el nivel en el 90 % (' + pdf(11) + ' y ' + pdf(12) + ').' },
      { id: 'cu-vo-g2', corto: 'por qué no hierro', tipo: 'test', fuente: 'mu-hierro-oxidativo',
        enunciado: '¿Por qué el libro evita dar hierro al crítico sin déficit?',
        opciones: [
          { t: 'Porque la hipoferremia de la inflamación es protectora y la transferrina, saturada al 90 %, no lo capta', porque: 'La hipoferremia sí protege, pero la transferrina está saturada al 30 %, no al 90 %, y el motivo de evitarlo es el daño oxidativo del hierro libre (p. 13). Darías hierro IV pensando que no tiene riesgo.' },
          { t: 'Porque el hierro del crítico está ya en la ferritina y no hace falta', porque: 'Con ferritina baja hay déficit tisular y sí hace falta; el motivo de evitarlo sin déficit es el daño oxidativo. Dejarías de buscar un déficit real (p. 13).' },
          { t: 'El Fe²⁺ genera radical hidroxilo y ferroptosis en la inflamación; la transferrina solo está al 30 %', ok: true }],
        explicacion: 'El hierro reducido (Fe²⁺) produce <span class="hl-rojo">radicales hidroxilo</span> y desencadena <span class="hl">ferroptosis</span> en la inflamación; la transferrina circulante está saturada al 30 %, así que se une rápido al hierro nuevo (' + pdf(12) + ' y ' + pdf(13) + ').' },
      { id: 'cu-vo-g3', corto: 'glucosa y lactato', tipo: 'test', fuente: 'mu-glucosa-lactato · mar-img-48-3', modelo: { acidobaseVivo: 'lactica' },
        enunciado: 'Predice: en la Figura 48.3, ¿qué le pasa al lactato con 200 g de glucosado al 5 % frente al Ringer lactato?',
        opciones: [
          { t: 'Sube por encima de 2 con el glucosado y no con el Ringer', ok: true },
          { t: 'Sube más con el Ringer, que lleva lactato en su composición y lo aporta', porque: 'En el estudio es el glucosado el que lo sube; el Ringer no lo elevó. Quitarías el Ringer por el dato equivocado (p. 14).' },
          { t: 'No cambia: la glucosa se quema entera', porque: 'En el enfermo grave hasta el 85 % de la glucosa se recupera como lactato, frente a menos del 5 % en el sano. Infundirías glucosado sin ver el lactato (p. 14).' }],
        explicacion: 'Menos del <span class="hl">5 %</span> de la glucosa va a lactato en el sano y hasta el <span class="hl-rojo">85 %</span> en el enfermo agudo; el glucosado (unos 200 g) elevó el lactato por encima de 2 mmol/L y el Ringer no (' + pdf(14) + ').' },
    ],
    examen: [
      { id: 'cu-vo-e1', corto: 'cortes de ferritina', tipo: 'test', fuente: 'mu-ferritina-cortes',
        enunciado: '¿Qué ferritina hace probable el déficit de hierro y cuál lo hace improbable?',
        opciones: [
          { t: 'Probable <18 µg/L; improbable >100 µg/L', ok: true },
          { t: 'Probable <100 µg/L; improbable >300 µg/L en el crítico', porque: 'Son cortes demasiado altos: el probable es <18 y el improbable >100. Darías hierro a quien no lo necesita (p. 13).' },
          { t: 'Probable <50 µg/L; improbable >18 µg/L', porque: 'Has invertido los cortes: 18 es el límite del déficit probable, no del improbable. Descartarías un déficit probable (p. 13).' }],
        explicacion: 'Ferritina <span class="hl-rojo"><18 µg/L</span> indica déficit probable; <span class="hl">>100 µg/L</span>, improbable (' + pdf(13) + ').' },
      { id: 'cu-vo-e2', corto: 'selenio', tipo: 'test', fuente: 'mu-selenio',
        enunciado: '¿Para qué sirve el selenio, cuándo baja la actividad enzimática y cuál es la dosis IV máxima segura?',
        opciones: [
          { t: 'Cofactor de la glutatión peroxidasa; <100 µg/L la reduce; selenito IV máx. 225 µg/día', ok: true },
          { t: 'Cofactor de la catalasa; <55 µg/L la reduce; selenito IV máx. 400 µg/día', porque: 'La enzima es la glutatión peroxidasa y el máximo 225 µg/día; 400 se pasa del libro. Intoxicarías con selenio (p. 13).' },
          { t: 'Cofactor de la glutatión peroxidasa; <100 µg/L la reduce; selenito máx. 55 µg/día', porque: '55 µg/día es la necesidad diaria del sano, no el máximo seguro de 225. Darías una dosis bajísima en un crítico con mayor consumo (p. 13).' }],
        explicacion: 'Cofactor esencial de la <span class="hl">glutatión peroxidasa</span>; por debajo de 100 µg/L hay menos actividad; selenito sódico IV, máximo seguro <span class="hl-rojo">225 µg/día</span> (' + pdf(13) + ').' },
      { id: 'cu-vo-e3', corto: 'una mosca en la sopa', tipo: 'destapa', fuente: 'mu-glucosa-lactato',
        enunciado: 'Un residente dice: “nutrimos para evitar la desnutrición, así que cuanto antes al 100 %”. ¿Qué le contestas con el cierre del capítulo?',
        cuantas: 'son dos cosas',
        puntos: [
          'La desnutrición del crítico es <span class="hl">procesamiento anómalo, no inanición</span>: nutrir no la corrige hasta resolver la enfermedad.',
          'Los lípidos con inflamación <span class="hl-rojo">se oxidan</span> y pueden dañar tejidos.'],
        explicacion: 'Cierre del capítulo: la glucosa del enfermo agudo va a lactato y el aporte puede ser dañino (' + pdf(13) + ' y ' + pdf(14) + ').' },
    ],
    casos: [
      { id: 'cu-eme', titulo: 'Emeterio, 71 años: ¿hierro, vitamina D, selenio?', corto: 'Caso · Emeterio (vitaminas)', sub: 'sepsis urinaria, anemia',
        paciente: { Edad: '71 años', Motivo: 'sepsis de origen urinario', Hb: '8,2 g/dL' },
        pasos: [
          { momento: 'Día 1 · hierro sérico bajo', datos: { 'Hierro sérico': 'bajo' }, nuevo: ['Hierro sérico'],
            pregunta: { id: 'cu-eme-1', tipo: 'destapa', fuente: 'mu-hierro-oxidativo',
              enunciado: 'El hierro sérico sale bajo. ¿Es déficit de hierro?',
              cuantas: 'son dos cosas',
              puntos: [
                'En la <span class="hl">inflamación sistémica</span> la hipoferremia es común.',
                'Tener <span class="hl-rojo">poco hierro libre</span> protege del daño oxidativo: no se trata como déficit sin ferritina.'],
              explicacion: 'El poco hierro libre tiene valor de supervivencia y explica la hipoferremia de la inflamación (' + pdf(12) + ' y ' + pdf(13) + ').' } },
          { momento: 'Día 2 · ferritina', datos: { 'Ferritina': '14 µg/L', 'Hb': '8,2 g/dL' }, nuevo: ['Ferritina'], calculadora: { ir: 'mu-ferritina-calc', nombre: 'Ferritina' },
            pregunta: { id: 'cu-eme-2', tipo: 'test', fuente: 'mu-ferritina-calc · mu-ferritina-cortes',
              enunciado: 'Ferritina 14 µg/L y anemia. ¿Das hierro?',
              opciones: [
                { t: 'No: la hipoferremia de la inflamación protege; esperar a resolver la sepsis', porque: 'Con ferritina <18 y anemia hay un supuesto: déficit tisular probable. Negarlo dejaría la anemia sin la causa corregible (p. 13).' },
                { t: 'Sí: déficit probable (<18) con anemia, el único supuesto', ok: true },
                { t: 'Solo si la ferritina pasa de 100 µg/L', porque: 'Por encima de 100 el déficit es improbable: darías hierro, con su riesgo oxidativo, a quien no lo necesita (p. 13).' }],
              explicacion: 'Ferritina <span class="hl-rojo"><18 µg/L</span> = déficit probable; con anemia es el único supuesto para dar hierro al crítico (' + pdf(13) + ').' } },
          { momento: 'Día 3 · la dextrosa', datos: { 'Suero': 'glucosado al 5 %', 'Lactato': '2,6 mmol/L sin hipoperfusión' }, nuevo: ['Suero', 'Lactato'],
            pregunta: { id: 'cu-eme-3', tipo: 'test', fuente: 'mu-glucosa-lactato · mar-img-48-3', modelo: { acidobaseVivo: 'lactica' },
              enunciado: 'Sube el lactato a 2,6 con la presión y la diuresis normales, tras varios litros de glucosado al 5 %. ¿Cuál es la explicación más probable?',
              opciones: [
                { t: 'Es falta de hierro: una ferritina baja hace subir el lactato del enfermo', porque: 'El déficit de hierro causa anemia, no lactato (fisiología general). Darías hierro sin causa y no retirarías el glucosado.' },
                { t: 'La glucosa se convierte en lactato en el enfermo agudo, hasta el 85 %', ok: true },
                { t: 'Hipoperfusión oculta por la sepsis, aunque la PA sea normal', porque: 'No hay datos de hipoperfusión (diuresis normal) y el lactato aparece tras varios litros de glucosado. Darías más volumen y no retirarías el glucosado (p. 14).' }],
              explicacion: 'En el enfermo agudo hasta el <span class="hl-rojo">85 %</span> de una carga de glucosa se recupera como lactato (menos del 5 % en el sano); en la Fig. 48.3 el glucosado elevó el lactato y el Ringer no (' + pdf(14) + ').' } },
          { momento: 'Día 4 · vitamina D', datos: { '25-OHD': '22 nmol/L' }, nuevo: ['25-OHD'],
            pregunta: { id: 'cu-eme-4', tipo: 'destapa', fuente: 'mu-vitd-dx',
              enunciado: 'Con la 25-OHD en grave, ¿por qué la inyección IM y no la vía oral, y qué aportan las nutriciones?',
              cuantas: 'son dos cosas',
              puntos: [
                'La fiabilidad de la <span class="hl-rojo">vía oral es incierta</span> en el crítico: por eso una sola inyección IM de 150.000 UI.',
                'Las nutriciones (NE y NPT) aportan solo <span class="hl">200-400 UI al día frente a las 600 UI</span> necesarias: no corrigen un déficit grave.'],
              explicacion: 'La IM de 150.000 UI normaliza el nivel en el 90 %; las nutriciones se quedan cortas en el aporte diario (' + pdf(11) + ' y ' + pdf(12) + ').' } },
          { momento: 'Día 5 · el pase', datos: { 'Pase': 'hierro; vecino ferritina 320 y Hb 9; 25-OHD 22; selenio 80 µg/L' }, nuevo: ['Pase'],
            pregunta: { id: 'cu-eme-5', tipo: 'error', fuente: 'mu-ferritina-cortes · mu-vitd-dx · mu-selenio',
              enunciado: 'El resumen del pase. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Emeterio (ferritina 14, anemia): hierro.' },
                { t: 'Su vecino, ferritina 320 y Hb 9: hierro también.', mal: true,
                  c: 'Con ferritina >100 el déficit es <span class="hl-rojo">improbable</span>; el libro no da hierro al crítico sin evidencia de déficit tisular (p. 13).' },
                { t: '25-OHD de 22: déficit grave, 150.000 UI IM.' },
                { t: 'Selenio de 80 µg/L (<100): menor actividad de glutatión peroxidasa; si se repone, selenito IV con máximo 225 µg/día.' }],
              explicacion: 'Ferritina y hierro (' + pdf(13) + '); vitamina D (' + pdf(12) + '); selenio, <100 µg/L menos actividad y máximo 225 µg/día (' + pdf(13) + ').' } },
        ],
        lleva: [
          'Hierro solo con déficit tisular (ferritina <18) y anemia.',
          'Vitamina D <30 nmol/L es grave: 150.000 UI IM.',
          'Selenio IV: máximo 225 µg/día.'],
        volver: { nombre: 'Cortes de ferritina', ancla: 'mu-ferritina-cortes', modelo: { acidobaseVivo: 'lactica' } } },
    ],
    profundizar: [
      { id: 'mu-tabla-48-3', titulo: 'Vitaminas: necesidades diarias (Tabla 48.3)' },
      { id: 'mu-tabla-48-5', titulo: 'Oligoelementos: necesidades diarias (Tabla 48.5)' },
      { id: 'mu-antiox', titulo: 'Vitaminas antioxidantes (C y E)' },
      { id: 'mu-vitd-consecuencias', titulo: 'Vitamina D: consecuencias' },
      { id: 'mu-hierro', titulo: 'El hierro del cuerpo: 4,5 g' },
    ],
  },
};
