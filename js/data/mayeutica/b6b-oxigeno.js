// Estudiar (Texto | Estudiar) de las fichas del bloque 6b, grupo 6K · El O₂ que no llega a la mitocondria
// (Marino, caps. 52-53): mt-salicilatos (19), mt-co (20) y mt-cianuro (21) de js/modules/libros/marino-toxicos.html.
// La pinta js/core/mayeutica.js. Datos puros. Formato: el de js/data/mayeutica/b1-fluidos.js.
// Hecha hasta ahora: la 19. Faltan la 20 y la 21 (se añaden a este mismo objeto, con el mismo estilo).
//
// Fuente: docs/marino-2024-toxicologia-caps52-53-apendices.pdf; salicilatos, págs. 14-16 (TX; el cap. 52 de
// «Marino» termina en la 17). Cada explicación y cada distractor dicen su página. Los pacientes se inventan.
// Cobertura y casos: autonomo/bloques/b6b/cobertura-anexo.md §3 (6K) y tabla de casos (Rosendo, 35).

const TX = 'docs/marino-2024-toxicologia-caps52-53-apendices.pdf';
const pdf = (p, t = `PDF pág. ${p}`) => `<a class="biblio-link" href="${TX}#page=${p}" target="_blank" rel="noopener">${t}</a>`;

export const MAYEUTICA_OXIGENO = {
  /* =================================================================================================
     19 · Salicilatos (TX págs. 14-16)
     ================================================================================================= */
  'mt-salicilatos': {
    entrada: 'Por qué la aspirina da primero alcalosis y luego acidosis, qué se hace con el carbón, el bicarbonato y el potasio, y cuándo se dializa.',
    guia: [
      { id: 'sal-g1', corto: 'dosis mortal', tipo: 'test', fuente: 'mt-sal-datos',
        enunciado: 'Antes de nada: según el libro, la dosis de aspirina que puede ser mortal es de 150 mg/kg. En un adulto de 70 kg, ¿cuántos gramos son?',
        opciones: [
          { t: 'Unos 10,5 g: 150 mg/kg × 70 kg, o sea 10 500 mg', ok: true },
          { t: 'Unos 1,05 g: una caja grande de comprimidos de aspirina', porque: 'Te has comido un cero: 150 × 70 = 10 500 mg. Con esa idea tomarías por inofensiva una ingesta de 5-10 g y no mandarías ni un nivel (p. 14).' },
          { t: 'Unos 105 g: más del triple del límite alto', porque: 'Has multiplicado de más. El libro da 10-30 g como dosis que puede ser mortal; esperar a los 100 g sería llegar tarde a un paciente ya grave (p. 14).' }],
        explicacion: 'El libro dice que ingerir <span class="hl-rojo">10-30 g, o 150 mg/kg</span>, de aspirina puede ser mortal: 150 × 70 = 10 500 mg, unos 10,5 g (' + pdf(14) + '). El cálculo por kilo es propio sobre la cifra del libro.' },
      { id: 'sal-g2', corto: 'primero alcalosis', tipo: 'test', fuente: 'mt-sal-seña · mt-sal-alcalosis',
        enunciado: 'Una hora después de la ingesta, Rosendo respira rápido y hondo y la PCO₂ ha bajado. ¿Qué lo explica?',
        opciones: [
          { t: 'Un ácido que acidifica la sangre y la hiperventilación compensa', porque: 'Es el orden contrario: el salicílico apenas se disocia y no acidifica; la acidosis llega tarde. Con esa idea buscarías un ácido que no está y no reconocerías el cuadro en sus primeras horas (p. 14).' },
          { t: 'La fiebre: el desacoplamiento sube la temperatura y eso acelera la respiración', porque: 'La fiebre es otro efecto del desacoplamiento, pero no explica esta taquipnea precoz. Esperarías a que suba la temperatura para sospechar el diagnóstico y llegarías tarde (p. 14-15).' },
          { t: 'El salicílico estimula directamente el centro respiratorio del tronco', ok: true }],
        explicacion: 'El ácido salicílico <span class="hl-azul">estimula directamente los centros respiratorios</span> del tronco: sube la frecuencia y el volumen, baja la PCO₂ y aparece una alcalosis respiratoria, <span class="hl">uno de los primeros signos</span> (' + pdf(14) + ').',
        modelo: { acidobaseVivo: 'salic', texto: 'Mira la alcalosis respiratoria en el ácido-base vivo' } },
      { id: 'sal-g3', corto: 'la acidosis tardía', tipo: 'destapa', fuente: 'mt-sal-acidosis',
        enunciado: 'Si el ácido salicílico apenas se disocia, ¿de dónde sale la acidosis metabólica del salicilismo? Piensa antes de destapar.',
        cuantas: 'son tres cosas',
        puntos: [
          'El salicílico es un ácido débil que <span class="hl">no se disocia</span>: <span class="hl-rojo">no es él quien acidifica</span>.',
          'Desacopla la fosforilación oxidativa: la célula compensa con <span class="hl-azul">más glucólisis y más lactato</span> (y cetoácidos), con hiato aniónico elevado.',
          'Es una complicación <span class="hl">tardía</span>, y un pH ácido es de mal pronóstico.'],
        explicacion: 'Mecanismo y pronóstico de la acidosis, en ' + pdf(14) + ' y ' + pdf(15) + '.',
        modelo: { acidobaseVivo: 'salic' } },
      { id: 'sal-g4', corto: 'el nivel', tipo: 'test', fuente: 'mt-sal-niveles',
        enunciado: 'El laboratorio informa un salicilato de 45 mg/dL. ¿Cómo lo clasificas?',
        opciones: [
          { t: 'Terapéutico: el rango llega hasta 50 mg/dL', porque: 'El rango terapéutico es de 10-30 mg/dL. Con ese error darías el alta a una intoxicación que ya es tóxica (p. 15).' },
          { t: 'Tóxico (>40), aunque sin amenaza vital (>75)', ok: true },
          { t: 'Amenaza la vida: todo lo que pasa de 40 mg/dL', porque: 'Eso es el umbral de tóxico, no el de riesgo vital (>75 mg/dL). Si lo tratas como terminal, pedirías hemodiálisis sin el criterio que la indica (p. 15-16).' }],
        explicacion: 'Terapéutico <span class="hl-verde">10-30 mg/dL</span>; tóxico <span class="hl">&gt;40</span>; amenaza la vida <span class="hl-rojo">&gt;75</span> (' + pdf(15) + '). Con 45 mg/dL: tóxico.' },
      { id: 'sal-g5', corto: 'carbón a las 8 h', tipo: 'test', fuente: 'mt-sal-carbon',
        enunciado: 'Rosendo llega 8 horas después de tomar las pastillas, que eran de cubierta entérica. ¿Das carbón activado?',
        opciones: [
          { t: 'No: pasada la hora, ya no queda nada en el estómago', porque: 'Los salicilatos enlentecen el vaciamiento gástrico y las formas entéricas o retard se quedan en el estómago: puede quedar fármaco por absorber y lo dejarías pasar (p. 15).' },
          { t: 'No: el carbón se reserva a las primeras 2 horas', porque: 'Es más eficaz en las 2 primeras horas, pero el libro lo recomienda en todas las intoxicaciones, sea cual sea la hora. Lo negarías justo a quien más fármaco retenido puede tener (p. 15).' },
          { t: 'Sí: 1 g/kg (máx. 100 g), cada 4 h hasta que salga', ok: true }],
        explicacion: 'El carbón se da en <span class="hl">todas las intoxicaciones</span>, a cualquier hora: 1 g/kg, máximo 100 g, cada 4 h (' + pdf(15) + '). Es más eficaz en las primeras 2 h.' },
      { id: 'sal-g6', corto: 'el potasio', tipo: 'test', fuente: 'mt-sal-potasio · mt-tabla-52-3',
        enunciado: 'La Tabla 52.3 añade 40 mEq de KCl a la solución de bicarbonato. ¿Por qué?',
        opciones: [
          { t: 'Porque la hipopotasemia impide alcalinizar la orina', ok: true },
          { t: 'Porque el salicilato provoca hiperpotasemia y el KCl la compensa', porque: 'Es al revés: el bicarbonato baja el potasio. Si pensaras que sobra potasio, lo retirarías, vendría la hipopotasemia y la orina no se alcalinizaría (p. 16).' },
          { t: 'Para acidificar la orina y que el salicilato se elimine mejor', porque: 'Lo que se busca es alcalinizar la orina (pH ≥7,5), que aumenta la excreción. Acidificarla retendría el salicilato (p. 15-16).' }],
        explicacion: 'El bicarbonato <span class="hl-azul">mete K⁺ en las células</span>; la <span class="hl-rojo">hipopotasemia impide alcalinizar la orina</span> (aumenta la secreción de H⁺ en el túbulo distal): por eso los 40 mEq de KCl (' + pdf(16) + ').' },
    ],
    examen: [
      { id: 'sal-e1', corto: 'nota de ingreso', tipo: 'error', fuente: 'mt-sal-clinica · mt-sal-otros · mt-sal-niveles',
        enunciado: 'La nota de un compañero sobre una intoxicación por salicilatos. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Lo primero, en las primeras horas: hiperpnea, acúfenos, vértigo, náuseas y vómitos.' },
          { t: 'La fiebre y la sudoración se deben al desacoplamiento de la fosforilación oxidativa.' },
          { t: 'Entre los datos de laboratorio pueden aparecer hipocapnia, acidosis láctica, rabdomiólisis e hipernatremia.' },
          { t: 'Un salicilato bajo descarta el cuadro, porque en la forma crónica los niveles son más altos que en la aguda.', mal: true,
            c: 'En la intoxicación crónica los niveles suelen ser <span class="hl">más bajos</span>: un nivel bajo <span class="hl-rojo">no descarta</span> el cuadro (p. 15).' }],
        explicacion: 'Clínica y laboratorio en ' + pdf(15) + '; fiebre y sudoración por el aumento del metabolismo (' + pdf(15) + ').' },
      { id: 'sal-e2', corto: 'cuándo dializar', tipo: 'test', fuente: 'mt-sal-hd',
        enunciado: 'Salicilato de 82 mg/dL, creatinina elevada, sin edema cerebral ni SDRA. ¿Qué decides?',
        opciones: [
          { t: 'Seguir con la alcalinización: la diálisis se reserva a más de 90 mg/dL', porque: 'Con la función renal alterada el umbral baja a 80 mg/dL. Si esperas a 90, el salicilato se acumula en un riñón que ya no lo elimina bien (p. 16).' },
          { t: 'Hemodiálisis: >80 mg/dL con función renal alterada', ok: true },
          { t: 'Solo carbón activado: el nivel aún no amenaza la vida', porque: 'El nivel supera los 75 mg/dL de riesgo vital, y el carbón no basta: la hemodiálisis es lo más eficaz para eliminar el fármaco (p. 15-16).' }],
        explicacion: 'Indicaciones: <span class="hl-rojo">&gt;90 mg/dL</span>, <span class="hl-rojo">&gt;80 con función renal alterada</span>, o intoxicación que amenaza la vida (edema cerebral, SDRA, fallo multiorgánico) (' + pdf(16) + ').' },
      { id: 'sal-e3', corto: 'pH urinario que no sube', tipo: 'test', fuente: 'mt-sal-potasio · mt-sal-alcalinizar',
        enunciado: 'Llevas horas con bicarbonato y la orina sigue en pH 6. El potasio es de 2,9 mEq/L. ¿Qué haces?',
        opciones: [
          { t: 'Subir el bicarbonato sin tocar el potasio: es cuestión de dosis', porque: 'Más bicarbonato mete aún más K⁺ en las células y empeora la hipopotasemia, que es justo lo que impide alcalinizar (p. 16).' },
          { t: 'Pasar a diuréticos de asa para acidificar la orina', porque: 'Ni los diuréticos acidifican ni es lo que se busca: se quiere pH urinario ≥7,5 para aumentar la excreción del salicilato (p. 15-16).' },
          { t: 'Reponer potasio: la hipopotasemia impide alcalinizar la orina', ok: true }],
        explicacion: 'La hipopotasemia aumenta la secreción de H⁺ en el túbulo distal y <span class="hl-rojo">hace imposible alcalinizar</span> la orina: se corrige el potasio, como indica la Tabla 52.3 al añadir KCl (' + pdf(16) + '). El caso (potasio de 2,9 y pH urinario 6) es inventado.' },
      { id: 'sal-e4', corto: 'carbón en 120 kg', tipo: 'test', fuente: 'mt-sal-carbon',
        enunciado: 'Un paciente de 120 kg con salicilatos. ¿Qué dosis de carbón activado le das?',
        opciones: [
          { t: '100 g cada 4 h: es el tope por dosis', ok: true },
          { t: '120 g cada 4 h: 1 g por cada kilo', porque: 'El libro pone un tope de 100 g por dosis. Pasarse no aporta nada y aumenta el riesgo de vómito y aspiración (p. 15).' },
          { t: '50 g una sola vez: basta con una dosis', porque: 'Con salicilatos la dosis se repite cada 4 h hasta que el carbón salga en las heces o bajen los niveles; una sola dejaría fármaco por absorber (p. 15).' }],
        explicacion: '<span class="hl">1 g/kg, máximo 100 g</span>, cada 4 horas hasta que el carbón aparezca en las heces o los niveles bajen (' + pdf(15) + '). Que el exceso aumente el riesgo de aspiración es consideración general.',
        origen: 'ficha · el riesgo de aspiración, fisiología general' },
      { id: 'sal-e5', corto: 'la solución de bicarbonato', tipo: 'test', fuente: 'mt-tabla-52-3',
        enunciado: 'Preparas la solución de la Tabla 52.3 con 3 ampollas de bicarbonato de 44 mEq en un litro de glucosado al 5%. ¿Qué concentración de bicarbonato tiene, y qué le añades?',
        opciones: [
          { t: '44 mEq/L, y sin añadir nada más: ya basta', porque: 'Has contado solo una ampolla. La solución de la tabla es de 132 mEq/L y lleva además potasio; sin él la orina costaría más de alcalinizar (p. 16).' },
          { t: '132 mEq/L, más 40 mEq de cloruro potásico', ok: true },
          { t: '132 mEq/L, más 40 mEq de calcio', porque: 'El aditivo es potasio, no calcio. Lo que el bicarbonato arrastra al interior de las células es el K⁺, y su falta impide alcalinizar (p. 16).' }],
        explicacion: 'Tabla 52.3: 3 ampollas de NaHCO₃ (44 mEq cada una) en 1 L de glucosado al 5% = <span class="hl">132 mEq/L</span>, más <span class="hl">40 mEq de KCl</span>; carga de 1-2 mEq/kg y perfusión de 2-3 mL/kg/h (' + pdf(16) + ').' },
    ],
    casos: [
      { id: 'sal-ros', titulo: 'Rosendo, 35 años: 25 g de aspirina', corto: 'Caso · Rosendo (salicilatos)', sub: 'intoxicación voluntaria, 70 kg',
        paciente: { Edad: '35 años', Peso: '70 kg', Motivo: 'ha tomado 25 g de aspirina (357 mg/kg)', Llegada: 'a las 8 h de la ingesta' },
        pasos: [
          { momento: 'Urgencias · la dosis', datos: { 'Dosis': '25 g (357 mg/kg)' }, nuevo: ['Dosis'],
            pregunta: { id: 'sal-ros-1', tipo: 'test', fuente: 'mt-sal-datos',
              enunciado: 'Rosendo dice que se tomó 25 g de aspirina. Con 70 kg, ¿cómo valoras la dosis?',
              opciones: [
                { t: '357 mg/kg, más del doble de los 150 mg/kg mortales', ok: true },
                { t: 'Es 36 mg/kg: dosis alta pero lejos de la tóxica', porque: 'Te has equivocado de cuenta: 25 000 mg ÷ 70 kg son unos 357 mg/kg. Con 36 lo mandarías a casa en un paciente que puede morir (p. 14).' },
                { t: 'Son 25 g: por debajo del rango de 10-30 g, no pasa nada', porque: 'El rango de 10-30 g es el de dosis que pueden ser mortales, y 25 g cae dentro. Fiarte de que "no llega a 30" dejaría sin tratar una intoxicación grave (p. 14).' }],
              explicacion: '25 000 mg ÷ 70 kg = <span class="hl-rojo">357 mg/kg</span>, sobre los 150 mg/kg del libro (' + pdf(14) + '). La cuenta por kilo es propia.' } },
          { momento: 'Hora 2 de la observación', datos: { 'pH': '7,48', 'PCO₂': '22 mmHg', 'Síntomas': 'acúfenos, hiperpnea' }, nuevo: ['pH', 'PCO₂', 'Síntomas'],
            pregunta: { id: 'sal-ros-2', tipo: 'test', fuente: 'mt-sal-seña · mt-sal-clinica', origen: 'ilustrativo: gasometría de un paciente posible',
              modelo: { acidobaseVivo: 'salic', texto: 'Mira este paciente en el ácido-base vivo' },
              enunciado: 'pH 7,48, PCO₂ 22, acúfenos y respiración rápida. ¿Qué trastorno domina en este momento?',
              opciones: [
                { t: 'Acidosis metabólica con hiato elevado: es la marca del salicilismo', porque: 'Esa acidosis es tardía: aún no ha llegado y el pH es alcalino. Si la esperas para diagnosticar, perderías las primeras horas, que son las del carbón (p. 14).' },
                { t: 'Alcalosis respiratoria: estimula el centro respiratorio', ok: true },
                { t: 'Alcalosis metabólica por los vómitos', porque: 'Los vómitos no explican una PCO₂ de 22 con hiperpnea: lo que baja el CO₂ es la hiperventilación. Buscarías otra causa y no pensarías en el salicilato (p. 14-15).' }],
              explicacion: 'Alcalosis respiratoria, signo precoz (' + pdf(14) + '); con hiperpnea y acúfenos (' + pdf(15) + '). Las cifras de la gasometría son ilustrativas.' } },
          { momento: 'Hora 8 · ya lleva 8 h', datos: { 'Tiempo': '8 h desde la ingesta' }, nuevo: ['Tiempo'],
            pregunta: { id: 'sal-ros-3', tipo: 'test', fuente: 'mt-sal-carbon',
              enunciado: 'Han pasado 8 horas. ¿Qué haces con el carbón activado?',
              opciones: [
                { t: 'Lo omites: a las 8 h el carbón ya no sirve', porque: 'El libro lo recomienda en todos los casos, sea cual sea la hora: los salicilatos enlentecen el vaciamiento gástrico y el fármaco puede seguir en el estómago (p. 15).' },
                { t: 'Sí: 70 g (1 g/kg), repetirlos cada 4 horas', ok: true },
                { t: '100 g de entrada, el máximo, por la gravedad', porque: 'La dosis es 1 g/kg (máx. 100 g); en 70 kg son 70 g. El máximo es el tope, no un valor para los graves (p. 15).' }],
              explicacion: '<span class="hl">1 g/kg, máx. 100 g</span> cada 4 h hasta que salga en las heces o bajen los niveles; en 70 kg, <span class="hl-rojo">70 g</span> (' + pdf(15) + ').' } },
          { momento: 'Hora 9 · llega el nivel', datos: { 'Salicilato': '62 mg/dL', 'Función renal': 'normal' }, nuevo: ['Salicilato', 'Función renal'],
            calculadora: { ir: 'mt-sal-calc', nombre: 'Nivel de salicilato y qué hacer' },
            pregunta: { id: 'sal-ros-4', tipo: 'test', fuente: 'mt-sal-niveles · mt-sal-hd · mt-sal-alcalinizar',
              enunciado: 'Salicilato de 62 mg/dL con función renal normal. ¿Qué plan haces? Compruébalo después en la calculadora.',
              opciones: [
                { t: 'Hemodiálisis ya: está por encima de 40 mg/dL', porque: 'El umbral de diálisis es >90, o >80 con la función renal alterada, o intoxicación que amenaza la vida. Con 62 y riñón normal no se cumple y lo expondrías a una técnica sin indicación (p. 16).' },
                { t: 'Solo vigilar: aún no llega a 75 mg/dL', porque: 'Por encima de 40 mg/dL ya es tóxico, y la alcalinización es una de las piedras angulares: sin ella el nivel baja despacio y progresa la toxicidad (p. 15).' },
                { t: 'Alcalinizar la orina y seguir el carbón, sin diálisis por ahora', ok: true }],
              explicacion: '62 mg/dL es <span class="hl">tóxico (&gt;40)</span> y no llega a 75. No cumple criterio de diálisis (<span class="hl">&gt;90</span>, o <span class="hl">&gt;80 con función renal alterada</span>): se alcaliniza y se sigue con carbón (' + pdf(15) + ' y ' + pdf(16) + '). La calculadora de la ficha da la carga y el ritmo para 70 kg.' } },
          { momento: 'Hora 10 · se prepara la solución', datos: { 'Tabla 52.3': '1 L de glucosado al 5%' }, nuevo: ['Tabla 52.3'],
            pregunta: { id: 'sal-ros-5', tipo: 'error', fuente: 'mt-tabla-52-3 · mt-sal-potasio',
              enunciado: 'Las órdenes escritas para alcalinizar a Rosendo. Encuentra los errores.',
              frases: [
                { t: 'Solución: 3 ampollas de NaHCO₃ (44 mEq) en 1 L de glucosado al 5%, con 40 mEq de KCl.' },
                { t: 'Carga de bicarbonato de 1-2 mEq/kg y luego 2-3 mL/kg/h.' },
                { t: 'Objetivo: pH urinario ≥7,5 y diuresis de 1-2 mL/kg/h.' },
                { t: 'El potasio no hace falta: el bicarbonato lo sube.', mal: true,
                  c: 'El bicarbonato <span class="hl-rojo">mete K⁺ en las células</span> y la hipopotasemia impide alcalinizar: por eso los 40 mEq de KCl (p. 16).' }],
              explicacion: 'Tabla 52.3 y nota sobre la hipopotasemia (' + pdf(16) + '). Para 70 kg: carga de 70-140 mEq (cálculo con la tabla).' } },
          { momento: 'Día 2 · giro', datos: { 'pH': '7,21', 'Lactato': '7 mmol/L', 'Creatinina': '2,1 mg/dL', 'Salicilato': '85 mg/dL' }, nuevo: ['pH', 'Lactato', 'Creatinina', 'Salicilato'],
            calculadora: { ir: 'mt-sal-calc', nombre: 'Nivel de salicilato y qué hacer' },
            pregunta: { id: 'sal-ros-6', tipo: 'test', fuente: 'mt-sal-hd · mt-sal-acidosis', origen: 'ilustrativo: gasometría y analítica de un paciente posible',
              modelo: { acidobaseVivo: 'salic', texto: 'Mira el paso a la acidosis en el ácido-base vivo' },
              enunciado: 'Al día siguiente: pH 7,21, lactato 7, creatinina 2,1 y salicilato de 85 mg/dL. ¿Qué haces ahora?',
              opciones: [
                { t: 'Hemodiálisis: más de 80 mg/dL con función renal alterada', ok: true },
                { t: 'Seguir igual: 85 no llega a los 90 mg/dL de la diálisis', porque: 'Con el riñón alterado el umbral baja a 80 mg/dL, y 85 lo supera. Dejarlo así mantendría el salicilato en un riñón que no lo elimina (p. 16).' },
                { t: 'Doblar el bicarbonato para subir el pH sin tocar nada más', porque: 'Un pH ácido es de mal pronóstico, y con riñón alterado y 85 mg/dL el tratamiento más eficaz es la hemodiálisis; solo con bicarbonato retrasarías lo importante (p. 14-16).' }],
              explicacion: 'Nivel <span class="hl-rojo">&gt;80 mg/dL con función renal alterada</span>: hemodiálisis, que es lo más eficaz para eliminar salicilatos (' + pdf(16) + '). La acidosis es tardía y el pH ácido, de mal pronóstico (' + pdf(14) + '). Las cifras de pH, lactato y creatinina son ilustrativas.' } },
          { momento: 'Antes de dializar', datos: { 'Pregunta': 'de la residente' }, nuevo: ['Pregunta'],
            pregunta: { id: 'sal-ros-7', tipo: 'destapa', fuente: 'mt-sal-acidosis · mt-sal-otros',
              enunciado: 'La residente pregunta: «¿por qué ahora hay acidosis si el salicílico no es el ácido que acidifica?». Contéstale con el libro.',
              cuantas: 'son tres cosas',
              puntos: [
                'El salicílico <span class="hl">desacopla la fosforilación oxidativa</span>: la célula compensa con más glucólisis.',
                'Se acumulan <span class="hl-rojo">lactato (y cetoácidos)</span>: acidosis con hiato aniónico elevado.',
                'Es <span class="hl">tardía</span>, y el mismo desacoplamiento explica la fiebre, la sudoración y la deshidratación.'],
              explicacion: 'Mecanismo de la acidosis y otros efectos (' + pdf(14) + ' y ' + pdf(15) + ').' } },
        ],
        lleva: [
          'Alcalosis respiratoria primero; la acidosis con hiato elevado llega tarde y es de mal pronóstico.',
          'Carbón en todos, sea cual sea la hora, y alcalinizar la orina con potasio, porque la hipopotasemia lo impide.',
          'Diálisis con >90 mg/dL, o >80 con función renal alterada, o intoxicación que amenaza la vida.'],
        volver: { nombre: 'Salicilatos', ancla: 'mt-salicilatos', modelo: { acidobaseVivo: 'salic' } } },
    ],
    profundizar: [
      { id: 'mt-sal-otros', titulo: 'Fiebre, sudoración y deshidratación: otro efecto del desacoplamiento' },
      { id: 'mt-sal-niveles', titulo: 'Niveles tóxicos y por qué la intoxicación crónica engaña' },
      { id: 'mt-sal-soporte', titulo: 'El soporte general: líquidos, vasopresores y ventilación' },
    ],
  },
};
