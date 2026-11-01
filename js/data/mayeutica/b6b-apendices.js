// Estudiar (Texto | Estudiar) de las fichas de consulta del bloque 6b, grupo 6L · Los apéndices en la guardia
// (Marino, apéndices 1-3): mt-unidades, mt-referencias y mt-cuerpo de js/modules/libros/marino-toxicos.html.
// La pinta js/core/mayeutica.js. Datos puros. Formato: el de js/data/mayeutica/b1-fluidos.js.
//
// Fuente: docs/marino-2024-toxicologia-caps52-53-apendices.pdf, págs. 32-46 (TX); el peso ajustado, de
// docs/marino-2024-nutricion-endocrino-caps48-51.pdf, pág. 4 (NE). Cada explicación y cada distractor dicen su
// página. Los pacientes se inventan. Cobertura: autonomo/bloques/b6b/cobertura-anexo.md §3 (6L) y §7 (Visitación).
// Fichas «de consulta»: Estudiar corto (3-4 preguntas guiadas y un «encuentra el error») y un caso.

const TX = 'docs/marino-2024-toxicologia-caps52-53-apendices.pdf';
const pdf = (p, t = `PDF pág. ${p}`) => `<a class="biblio-link" href="${TX}#page=${p}" target="_blank" rel="noopener">${t}</a>`;

export const MAYEUTICA_APENDICES = {
  /* =================================================================================================
     Apéndice 1 · Unidades y conversiones (TX págs. 32-36)
     ================================================================================================= */
  'mt-unidades': {
    entrada: 'Las conversiones que se usan de verdad en la guardia: calcio y magnesio en mEq y mmol, kPa y mmHg, French y gauge, °C y °F.',
    guia: [
      { id: 'ap-u-g1', corto: 'calcio en mEq/L', tipo: 'test', fuente: 'mt-conv-solutos · mt-conv-calc',
        enunciado: 'Antes de calcular: el calcio plasmático es de 8 mg/dL (peso molecular 40, valencia 2). ¿Cuántos mEq/L son?',
        opciones: [
          { t: '4 mEq/L: (8 × 10 ÷ 40) × 2 = 4', ok: true },
          { t: '2 mEq/L: 8 × 10 ÷ 40, sin más', porque: 'Eso son 2 mmol/L: falta multiplicar por la valencia (2). Si lo tomas por mEq/L, creerás que el calcio es la mitad de lo que es y compararás con un rango pensado en otra unidad (p. 33).' },
          { t: '8 mEq/L: son unidades equivalentes', porque: 'mg/dL y mEq/L no son lo mismo: hay que pasar de dL a L (× 10), dividir por el peso molecular y multiplicar por la valencia. Con ese error leerías el doble de calcio del real (p. 33).' }],
        explicacion: 'Calcio parcialmente unido: <span class="hl">(mg/dL × 10 ÷ peso molecular) × valencia</span>. Con 8 mg/dL: (8 × 10 ÷ 40) × 2 = <span class="hl-rojo">4 mEq/L</span>. El 10 pasa de decilitros a litros (' + pdf(33, 'PDF pág. 33') + ').' },
      { id: 'ap-u-g2', corto: 'kPa y mmHg', tipo: 'test', fuente: 'mt-presion · mt-unid-calc',
        enunciado: 'Un laboratorio informa la PaO₂ en kPa y tú piensas en mmHg. Si dice 8,0 kPa, ¿cuántos mmHg son?',
        opciones: [
          { t: '60 mmHg: 8,0 × 7,5 = 60', ok: true },
          { t: '1,1 mmHg: 8,0 ÷ 7,5', porque: 'Has dividido en vez de multiplicar: 1 kPa = 7,5 mmHg. Leerías una hipoxemia imposible y tratarías una cifra que no es la del paciente (p. 32).' },
          { t: '80 mmHg: solo se mueve la coma', porque: 'La relación no es de 10 sino de 7,5 (1 kPa = 7,5 mmHg = 10,2 cmH₂O). Sobrestimarías el oxígeno en 20 mmHg y dejarías pasar una hipoxemia (p. 32).' }],
        explicacion: '<span class="hl">1 kPa = 7,5 mmHg</span> (y 10,2 cmH₂O); mmHg = 7,5 × kPa y kPa = 0,133 × mmHg. 8,0 kPa = <span class="hl-rojo">60 mmHg</span> (' + pdf(32) + ' y ' + pdf(36) + ').' },
      { id: 'ap-u-g3', corto: 'French y mm', tipo: 'destapa', fuente: 'mt-french · mt-french-tabla · mt-calibre-calc',
        enunciado: 'Un catéter de 8 Fr. Sin mirar la tabla, ¿de cuántos milímetros es y qué dos cosas debes recordar de esa cifra?',
        cuantas: 'son dos cosas',
        puntos: [
          'Regla útil: <span class="hl">diámetro externo (mm) × 3 = French</span>; 8 ÷ 3 es unos 2,7 mm.',
          'Es aproximada: la tabla del libro pone <span class="hl-rojo">2,6 mm</span> y <span class="hl">los diámetros varían con el fabricante</span>.'],
        explicacion: 'El libro da la regla en una nota de la tabla de calibres French (' + pdf(35) + ') y la tabla en ' + pdf(34) + '. El 2,7 de la regla frente al 2,6 de la tabla es cálculo propio sobre las cifras del libro.' },
      { id: 'ap-u-g4', corto: 'grados °F', tipo: 'test', fuente: 'mt-temp · mt-temp-tabla · mt-unid-calc',
        enunciado: 'Predice: 39,2 °C en una enfermera que mide en °F. ¿Qué lee?',
        opciones: [
          { t: '70,6 °F: solo multiplicar por 9/5', porque: 'Falta sumar 32. Con esa cifra pensarías en hipotermia en un paciente con fiebre y lo abrigarías en lugar de buscar la causa (p. 36).' },
          { t: '102,6 °F: (9/5 × 39,2) + 32', ok: true },
          { t: '4,0 °F: 5/9 × (39,2 − 32)', porque: 'Esa es la fórmula inversa, de °F a °C. Aplicarla al revés te da un número sin sentido clínico y no sabrías si el paciente tiene fiebre (p. 36).' }],
        explicacion: '<span class="hl">°F = (9/5 × °C) + 32</span> y °C = 5/9 × (°F − 32). La tabla del libro llega a 39 °C = 102,2 °F y 40 °C = 104 °F; 39,2 °C = <span class="hl-rojo">102,6 °F</span> sale de la fórmula (' + pdf(36) + ').' },
    ],
    examen: [
      { id: 'ap-u-e1', corto: 'nota de conversiones', tipo: 'error', fuente: 'mt-conv-solutos',
        enunciado: 'La nota de un compañero con las conversiones de una analítica. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Ca²⁺ de 8 mg/dL (peso molecular 40, valencia 2) son 4 mEq/L.' },
          { t: 'Mg²⁺ de 2 mEq/L son 2 mmol/L: en un ion divalente es lo mismo.', mal: true,
            c: 'En un ion divalente, mmol/L es <span class="hl">la mitad</span> de mEq/L: 2 mEq/L son 1 mmol/L (' + 'p. 33).' },
          { t: 'Glucosa de 90 mg/dL (peso molecular 180) son 5 mmol/L.' },
          { t: 'Na⁺ de 140 mEq/L: 140 mOsm/kg de agua.' }],
        explicacion: 'Univalente (K⁺): mmol/L = mEq/L. Divalente (Mg²⁺): mmol/L = mEq/L ÷ 2. Molécula sin carga (glucosa): mg/dL × 10 ÷ peso molecular (' + pdf(33) + ').' },
    ],
    casos: [
      { id: 'ap-vis-1', titulo: 'Visitación, 58 años: la guardia de las unidades', corto: 'Caso · Visitación (unidades)', sub: 'asma, ingreso nocturno',
        paciente: { Edad: '58 años', Motivo: 'asma con disnea', Peso: '92 kg', Talla: '160 cm' },
        pasos: [
          { momento: 'Noche del ingreso', datos: { 'Calcio': '8 mg/dL (caso inventado)' }, nuevo: ['Calcio'], calculadora: { ir: 'mt-conv-calc', nombre: 'Conversor de concentraciones' },
            pregunta: { id: 'ap-vis-1-1', tipo: 'test', fuente: 'mt-conv-solutos',
              enunciado: 'La analítica da el calcio en mg/dL; tu protocolo, en mEq/L. ¿Cuánto es?',
              opciones: [
                { t: '2 mEq/L: sin la valencia', porque: 'Es el valor en mmol/L: te falta la valencia 2. Creerías a la paciente con el calcio a la mitad (p. 33).' },
                { t: '4 mEq/L: (8 × 10 ÷ 40) × 2', ok: true },
                { t: '8 mEq/L: con la valencia dos veces', porque: 'Has multiplicado por la valencia 2 dos veces (2 × 2 × 2). Creerías a la paciente con el calcio al doble (p. 33).' }],
              explicacion: '(8 × 10 ÷ 40) × 2 = <span class="hl-rojo">4 mEq/L</span> (' + pdf(33) + ').' } },
          { momento: 'Madrugada · la gasometría', datos: { 'PaO₂': '8,0 kPa' }, nuevo: ['PaO₂'], calculadora: { ir: 'mt-unid-calc', nombre: 'Temperatura y presión' },
            pregunta: { id: 'ap-vis-1-2', tipo: 'test', fuente: 'mt-presion',
              enunciado: 'Otro laboratorio da la PaO₂ en kPa: 8,0. ¿Cuántos mmHg son?',
              opciones: [
                { t: '60 mmHg: 8,0 kPa × 7,5 mmHg/kPa', ok: true },
                { t: '80 mmHg: mover la coma', porque: 'Solo has movido la coma: la relación es 7,5, no 10. Sobrestimarías el oxígeno de la paciente (p. 32).' },
                { t: '1,1 mmHg: dividir entre 7,5', porque: 'Has dividido por 7,5 en vez de multiplicar. Pensarías en una hipoxemia imposible (p. 32).' }],
              explicacion: '1 kPa = 7,5 mmHg: 8,0 × 7,5 = <span class="hl-rojo">60 mmHg</span> (' + pdf(32) + ').' } },
          { momento: 'Día 2 · la glucosa', datos: { 'Glucosa': '180 mg/dL' }, nuevo: ['Glucosa'], calculadora: { ir: 'mt-conv-calc', nombre: 'Conversor de concentraciones' },
            pregunta: { id: 'ap-vis-1-3', tipo: 'test', fuente: 'mt-conv-solutos',
              enunciado: 'Tras los corticoides, la glucosa es de 180 mg/dL (peso molecular 180). ¿Cuántos mmol/L?',
              opciones: [
                { t: '20 mmol/L: se multiplica por la valencia', porque: 'La glucosa no tiene carga: no hay valencia que multiplicar. Con 20 mmol/L pensarías en un cuadro hiperglucémico grave que no tiene (p. 33).' },
                { t: '1 mmol/L: 180 ÷ 180', porque: 'Te has dejado el factor 10 que pasa de dL a L. Creerías que está en rango y no tratarías (p. 33).' },
                { t: '10 mmol/L: 180 × 10 ÷ 180', ok: true }],
              explicacion: 'Molécula sin carga: <span class="hl">mg/dL × 10 ÷ peso molecular</span> = 180 × 10 ÷ 180 = <span class="hl-rojo">10 mmol/L</span> (' + pdf(33) + ').' } },
          { momento: 'Día 2 · la vía', datos: { 'Vía': 'periférica de 16 G' }, nuevo: ['Vía'],
            pregunta: { id: 'ap-vis-1-4', tipo: 'destapa', fuente: 'mt-gauge',
              enunciado: 'La enfermera pregunta qué diámetro tiene una vía de 16 G. Contéstale con la tabla.',
              cuantas: 'son tres cosas',
              puntos: [
                '16 G: <span class="hl">1,62 mm</span> de diámetro externo.',
                'La tabla imprime 0,040 pulgadas para el 16 G, que <span class="hl-rojo">no cuadra con sus 1,62 mm</span> (serían unas 0,064): errata que se reproduce tal cual.',
                'Los diámetros <span class="hl">varían con el fabricante</span>.'],
              explicacion: 'Calibres gauge, tabla de las págs. 34-35 (' + pdf(35) + '); lo de las 0,064 pulgadas es cálculo propio (1,62 ÷ 25,4).' } },
          { momento: 'Día 3 · la nota de enfermería', datos: { 'Nota': 'conversiones del turno' }, nuevo: ['Nota'],
            pregunta: { id: 'ap-vis-1-5', tipo: 'error', fuente: 'mt-conv-solutos · mt-presion · mt-temp',
              enunciado: 'La nota del turno. Encuentra los errores.',
              frases: [
                { t: 'PAM de 70 mmHg: unos 9,3 kPa.' },
                { t: 'PaO₂ de 8,0 kPa: unos 60 mmHg.' },
                { t: 'K⁺ de 4 mEq/L son 2 mmol/L: se divide a la mitad.', mal: true,
                  c: 'El potasio es univalente: <span class="hl">mEq/L y mmol/L son iguales</span> (4 y 4). La mitad vale solo en los divalentes (p. 33).' },
                { t: 'T.ª de 38,5 °C: unos 101,3 °F.' }],
              explicacion: 'kPa = 0,133 × mmHg (70 mmHg → 9,31 kPa en la tabla, ' + pdf(36) + '); °F = (9/5 × 38,5) + 32 = 101,3 (cálculo con la fórmula del libro).' } },
        ],
        lleva: [
          'Calcio: (mg/dL × 10 ÷ peso molecular) × valencia; en los divalentes, mmol/L es la mitad de mEq/L.',
          '1 kPa = 7,5 mmHg; °F = (9/5 × °C) + 32.',
          'French = mm × 3 es aproximado, y las tablas del libro traen erratas (16 G).'],
        volver: { nombre: 'Concentraciones de solutos', ancla: 'mt-conv-solutos' } },
    ],
    profundizar: [
      { id: 'mt-caseras', titulo: 'Equivalencias de farmacia y caseras' },
      { id: 'mt-french-tabla', titulo: 'Tabla de calibres French' },
      { id: 'mt-gauge', titulo: 'Calibres gauge' },
      { id: 'mt-pres-tabla', titulo: 'Conversión de presiones mmHg a kPa (con sus filas repetidas)' },
    ],
  },

  /* =================================================================================================
     Apéndice 2 · Valores de referencia escogidos (TX págs. 37-43)
     ================================================================================================= */
  'mt-referencias': {
    entrada: 'Cuánta radiación pone cada prueba, el IMC que avisa de riesgo, el flujo espiratorio previsto y cuánta sangre tiene un adulto.',
    guia: [
      { id: 'ap-r-g1', corto: 'angio-TC frente a Rx', tipo: 'test', fuente: 'mt-radiacion · mt-rad-calc',
        enunciado: 'Antes de mirar la tabla: ¿cuántas veces más radiación da una angio-TC de tórax (15 mSv) que una radiografía de tórax de una proyección (0,02 mSv)?',
        opciones: [
          { t: 'Unas 7 veces', porque: 'Son 750, no 7. Con esa idea pedirías angio-TC repetidos sin sumar lo que lleva el paciente (p. 37).' },
          { t: 'Unas 75 veces', porque: 'Te has comido un cero: 15 ÷ 0,02 = 750. Subestimarías la dosis acumulada de quien ya lleva varias pruebas (p. 37).' },
          { t: 'Unas 750 veces', ok: true }],
        explicacion: 'Dosis efectiva media: Rx tórax 1 proyección <span class="hl">0,02 mSv</span>; angio-TC de tórax <span class="hl-rojo">15 mSv</span>: 15 ÷ 0,02 = 750 (cálculo propio sobre la tabla, ' + pdf(37) + ').' },
      { id: 'ap-r-g2', corto: 'una media con rango', tipo: 'test', fuente: 'mt-radiacion',
        enunciado: 'El TC de tórax figura con 7 mSv. ¿Qué significa esa cifra?',
        opciones: [
          { t: 'Es la dosis media; el rango va de 4 a 18 mSv', ok: true },
          { t: 'Es la dosis de todos los TC de tórax, siempre', porque: 'La tabla da una media y un rango (4-18). Si la tomas por fija, subestimarás lo que recibe quien se hace un TC con protocolo de más dosis (p. 37).' },
          { t: 'Es el máximo permitido por prueba', porque: 'El único límite de la tabla es el anual (50 mSv, de la EPA), no uno por prueba. Creer lo contrario te haría pedir pruebas sin sumar el total (p. 37).' }],
        explicacion: '«Average effective dose» con su rango: TC de tórax <span class="hl">7 mSv (4-18)</span>; angio-TC <span class="hl">15 (13-40)</span>. <span class="hl-rojo">Límite anual de la EPA: 50 mSv</span> (' + pdf(37) + ').' },
      { id: 'ap-r-g3', corto: 'IMC y realimentación', tipo: 'test', fuente: 'mt-imc-calc',
        enunciado: 'Una paciente de 40 kg y 160 cm lleva 7 días sin comer. Predice su IMC y qué cambia en tu plan.',
        opciones: [
          { t: '15,6: bajo peso; con IMC ≤18,5 y mala ingesta hay riesgo de realimentación', ok: true },
          { t: '25: normal; puedes empezar la nutrición a dosis plena', porque: 'Has dividido por la talla en lugar de por su cuadrado (40 ÷ 1,6). Con IMC ≤18,5 el cap. 50 lo cuenta como riesgo de realimentación (NE p. 44).' },
          { t: '15,6, pero el IMC solo clasifica y no cambia el plan', porque: 'Un IMC ≤18,5 es uno de los criterios de riesgo de realimentación del cap. 50: cambia cuánto y cómo empiezas, y qué electrolitos corriges antes (NE p. 44).' }],
        explicacion: 'IMC = peso ÷ talla²: 40 ÷ 2,56 = <span class="hl-rojo">15,6</span>. El <span class="hl">IMC ≤18,5</span> es criterio de riesgo de realimentación (cap. 50, NE p. 44). El apéndice trae el gráfico del IMC por peso y talla, con las bandas Underweight, Healthy, Overweight, Obese y Extremely Obese (' + pdf(38) + ').' },
      { id: 'ap-r-g4', corto: 'volemia', tipo: 'destapa', fuente: 'mt-volemia · mt-volemia-calc',
        enunciado: 'Una mujer de 60 kg. Antes de usar la calculadora: ¿cuánta sangre, cuánto plasma y cuántos hematíes?',
        cuantas: 'son tres cifras',
        puntos: [
          'Sangre: <span class="hl">60 mL/kg</span> en la mujer (66 en el varón): 60 × 60 = <span class="hl-rojo">3.600 mL</span>.',
          'Plasma: <span class="hl">36 mL/kg</span>: 2.160 mL.',
          'Hematíes: <span class="hl">24 mL/kg</span>: 1.440 mL (36 + 24 = 60).'],
        explicacion: 'Volúmenes sanguíneos estimados en adultos, Manual técnico de la AABB 1990 (' + pdf(42) + '). Los productos son cálculo propio.' },
    ],
    examen: [
      { id: 'ap-r-e1', corto: 'el PEF previsto', tipo: 'error', fuente: 'mt-pef-calc · mar-img-a2-5',
        enunciado: 'Un compañero apunta los previstos de una mujer de 40 años y 160 cm. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'El PEF previsto sale de una ecuación con la edad y la talla (Leiner, 1963).' },
          { t: 'PEF previsto de la mujer: [2,93 − (0,0072 × edad)] × talla ≈ 600 L/min.', mal: true,
            c: '(2,93 − 0,0072 × 40) × 160 = <span class="hl-rojo">423 L/min</span>, no 600 (p. 42).' },
          { t: 'La volemia estimada de una mujer es de 60 mL/kg; la del varón, 66.' },
          { t: 'Para los varones: [3,95 − (0,0151 × edad)] × talla (cm).' }],
        explicacion: 'Ecuación de las mujeres: <span class="hl">[2,93 − (0,0072 × edad)] × talla (cm)</span>; la de los varones, [3,95 − (0,0151 × edad)] × talla (' + pdf(41) + ' y ' + pdf(42) + '). Las tablas impresas no cuadran del todo con sus ecuaciones: lo explica la nota de fidelidad de la ficha.' },
    ],
    casos: [
      { id: 'ap-vis-2', titulo: 'Visitación, 58 años: las tablas, para usarlas', corto: 'Caso · Visitación (referencias)', sub: 'asma, 92 kg y 160 cm',
        paciente: { Edad: '58 años', Motivo: 'crisis de asma', Peso: '92 kg', Talla: '160 cm' },
        pasos: [
          { momento: 'Ingreso', calculadora: { ir: 'mt-imc-calc', nombre: 'IMC' },
            pregunta: { id: 'ap-vis-2-1', tipo: 'test', fuente: 'mt-imc-calc',
              enunciado: '92 kg y 160 cm. ¿Qué IMC tiene?',
              opciones: [
                { t: '57,5: peso ÷ talla en metros', porque: 'Has dividido por la talla, no por su cuadrado. Con esa cifra la tratarías como una obesidad extrema que no es (cálculo, p. 37).' },
                { t: '35,9: 92 ÷ (1,6 × 1,6)', ok: true },
                { t: '23,0: es el IMC con 59 kg', porque: 'Ese es el IMC de un peso saludable; con 92 kg no lo es. Pondrías las dosis por peso real sin pensar en el peso ajustado (cálculo, p. 37).' }],
              explicacion: '92 ÷ (1,6 × 1,6) = <span class="hl-rojo">35,9</span>. Con 92 kg y 160 cm cae en la banda «Obese» del gráfico del IMC (' + pdf(38) + ').' } },
          { momento: 'Ingreso · el peso', datos: { 'Peso ideal': '55 kg (tabla de mujeres, 5 pies 3 pulgadas)' }, nuevo: ['Peso ideal'],
            pregunta: { id: 'ap-vis-2-2', tipo: 'test', fuente: 'mar-img-a2-3 · mu-peso-ajustado',
              enunciado: 'Para calcular su nutrición necesitas un peso. Con el ideal de 55 kg, ¿cuál usas y cuánto es?',
              opciones: [
                { t: 'El real, 92 kg: el ajustado solo es para quien no se mueve', porque: 'El real solo vale hasta el 125 % del ideal; ella está en el 167 %. Con 92 kg le darías más calorías de las que recomienda el libro (NE p. 4).' },
                { t: 'El ajustado, 64 kg: (92 − 55) × 0,25 + 55', ok: true },
                { t: 'El ideal, 55 kg: siempre en obesos', porque: 'Con más de 125 % del ideal se recomienda el peso ajustado, no el ideal; el libro recomienda el ajustado, no el ideal (NE p. 4).' }],
              explicacion: 'Se usa el real salvo que supere en un 25 % al ideal; si es mayor del 125 %, el <span class="hl">peso ajustado = [(real − ideal) × 0,25] + ideal</span> (Ec. 48.3, NE p. 4): (37 × 0,25) + 55 = <span class="hl-rojo">64 kg</span>. El peso ideal (' + pdf(40) + ') sale de la tabla de mujeres de 5 pies 3 pulgadas (160 cm), complexión mediana, 121-135 libras (55-61 kg); aquí se toma el extremo bajo, 55 kg, con valor <b>ilustrativo</b>.' } },
          { momento: 'Urgencias · el flujo espiratorio', datos: { 'PEF medido': '180 L/min' }, nuevo: ['PEF medido'], calculadora: { ir: 'mt-pef-calc', nombre: 'PEF previsto' },
            pregunta: { id: 'ap-vis-2-3', tipo: 'test', fuente: 'mt-pef-calc · mar-img-a2-5',
              enunciado: 'Calcula su PEF previsto (mujer de 58 años y 160 cm) con la ecuación del apéndice.',
              opciones: [
                { t: '402 L/min: mujer de 58 años', ok: true },
                { t: '423 L/min: la de una mujer de 40 años', porque: 'Es el de una mujer de 40 años; la edad resta 0,0072 por año. Con 423 sobrestimarías su previsto y malinterpretarías el medido (p. 42).' },
                { t: '492 L/min: la de un varón', porque: 'Has usado la ecuación de los varones, [3,95 − (0,0151 × edad)] × talla. Sobrestimarías su previsto y su medido parecería menos grave de lo que es (p. 41).' }],
              explicacion: '(2,93 − 0,0072 × 58) × 160 = <span class="hl-rojo">402 L/min</span> (' + pdf(42) + ').' } },
          { momento: 'Urgencias · el giro', datos: { 'Nota del residente': '«PEF 180: 80 % del previsto, crisis leve»' }, nuevo: ['Nota del residente'],
            pregunta: { id: 'ap-vis-2-4', tipo: 'error', fuente: 'mt-pef-calc',
              enunciado: 'La nota del residente. Encuentra los errores.',
              frases: [
                { t: 'IMC de 35,9 y peso ajustado de 64 kg (el real supera el 125 % del ideal).' },
                { t: 'Previsto de la paciente: [2,93 − (0,0072 × 58)] × 160 ≈ 402 L/min.' },
                { t: 'El peso ideal sale de las tablas de pesos deseables del apéndice 2 (Metropolitan Life, 1983).' },
                { t: 'El medido, 180 L/min, es el 80 % del previsto.', mal: true,
                  c: '180 ÷ 402 = <span class="hl-rojo">45 %</span>, no 80 %. La gravedad del asma según el PEF está en la ficha de neumología, no en este apéndice.' }],
              explicacion: 'El apéndice da el previsto; el porcentaje es cálculo propio. Con 80 % se habría infravalorado la crisis a la mitad (' + pdf(42) + ').' } },
          { momento: 'Día 1 · las pruebas', datos: { 'Pruebas': 'Rx de tórax, TC de tórax y angio-TC de tórax' }, nuevo: ['Pruebas'], calculadora: { ir: 'mt-rad-calc', nombre: 'Radiación acumulada' },
            pregunta: { id: 'ap-vis-2-5', tipo: 'destapa', fuente: 'mt-radiacion · mt-rad-calc',
              enunciado: 'Pregunta la paciente cuánta radiación lleva ya. Contéstale.',
              cuantas: 'son tres cosas',
              puntos: [
                'Suma de las medias: 0,02 + 7 + 15 = <span class="hl-rojo">22 mSv</span>.',
                'Para comparar, la tabla cita un límite anual de <span class="hl">50 mSv</span> (EPA); no dice que sea un tope para un paciente.',
                'Son <span class="hl">medias con rango</span> (el angio-TC va de 13 a 40 mSv): puede ser más.'],
              explicacion: 'Tabla de dosis efectivas de Mettler (Radiology 2008), ' + pdf(37) + '. La suma es cálculo propio.' } },
          { momento: 'Día 1 · la reposición', datos: { 'Peso': '92 kg' },
            pregunta: { id: 'ap-vis-2-6', tipo: 'test', fuente: 'mt-volemia-calc',
              enunciado: 'Con los 60 mL/kg de la mujer, ¿cuál es su volemia estimada?',
              opciones: [
                { t: 'Unos 5,5 L: 60 mL/kg × 92', ok: true },
                { t: 'Unos 6,1 L: 66 × 92', porque: 'Has usado los 66 mL/kg del varón. Sobrestimarías su volemia unos 550 mL (p. 42).' },
                { t: 'Unos 3,3 L: es el plasma, 36 × 92', porque: 'Eso es solo el plasma (36 mL/kg), no la sangre entera. Con esa idea creerías que le falta más volumen del que le falta (p. 42).' }],
              explicacion: '60 mL/kg × 92 kg = 5.520 mL, <span class="hl-rojo">unos 5,5 L</span>; es una estimación en adultos (AABB 1990, ' + pdf(42) + ').' } },
        ],
        lleva: [
          'El IMC y el peso ideal de las tablas sirven para el peso ajustado: (real − ideal) × 0,25 + ideal.',
          'El PEF previsto sale de la ecuación con edad y talla; el 80 % de una nota puede ser un 45 %.',
          'La radiación se suma: las medias de la tabla, con su rango, frente a los 50 mSv anuales.'],
        volver: { nombre: 'PEF previsto', ancla: 'mt-pef-calc' } },
    ],
    profundizar: [
      { id: 'mt-pef-calc', titulo: 'Calculadora del PEF previsto' },
      { id: 'mar-img-a2-3', titulo: 'Pesos deseables de las mujeres (peso ideal para el peso ajustado)' },
      { id: 'mar-img-a2-6', titulo: 'CAM-ICU (la calculadora está en el cap. 45)' },
    ],
  },

  /* =================================================================================================
     Apéndice 3 · El cuerpo fantástico (TX págs. 44-46)
     ================================================================================================= */
  'mt-cuerpo': {
    entrada: 'Tres cifras del cuerpo que enlazan con lo que se estudia: el gasto en reposo, el ATP que se recicla y la piel que se renueva.',
    guia: [
      { id: 'ap-c-g1', corto: 'la bombilla', tipo: 'test', fuente: 'mt-cuerpo-bombilla',
        enunciado: 'Un adulto de 80 kg gasta en reposo unas 25 kcal/kg/día. Antes de leer: ¿cuántas kcal por hora son?',
        opciones: [
          { t: 'Unas 2.000 kcal/h: las de un día entero', porque: 'Son las kcal de todo el día. Esa confusión te haría calcular la nutrición con un gasto 24 veces mayor (p. 45).' },
          { t: 'Unas 83 kcal/h: 2.000 ÷ 24', ok: true },
          { t: 'Unas 25 kcal/h: por kilo, no por hora', porque: 'Has tomado la cifra por kg como si fuera por hora y sin multiplicar por 80 kg. Subestimarías el gasto de quien alimentas (p. 45).' }],
        explicacion: '25 kcal/kg × 80 kg = 2.000 kcal/día = <span class="hl-rojo">83 kcal/h</span>. El libro lo equipara a unos 80 W («1 kcal/h = 1,16 W»); con ese factor salen unos 96 W (cálculo propio): el orden de magnitud, el de una bombilla, es el mismo (' + pdf(45) + ').',
        nota: '<b>Nota de fidelidad.</b> El libro dice 83 kcal/h ≈ 80 W y a la vez 1 kcal/h = 1,16 W; con su propio factor serían unos 96 W. Se reproduce tal cual el 80 W del libro; la cuenta es propia.' },
      { id: 'ap-c-g2', corto: 'el ATP', tipo: 'test', fuente: 'mt-cuerpo-atp',
        enunciado: '¿Cuánto ATP produce y descompone el cuerpo cada día?',
        opciones: [
          { t: 'Unos 80 g, lo que se almacena', porque: 'El cuerpo no guarda el ATP para días: el libro da 2 × 10²⁶ moléculas al día, unos 80 kg, no 80 g (p. 45).' },
          { t: 'Unos 8 kg, una décima parte del peso', porque: 'La cifra del libro es 2 × 10²⁶ moléculas al día, unos 80 kg. Con 8 kg subestimarías la dependencia de la célula del oxígeno y de la glucosa que lo regeneran (p. 45).' },
          { t: 'Unos 80 kg, tanto como un adulto', ok: true }],
        explicacion: 'Unas <span class="hl">2 × 10²⁶ moléculas de ATP al día</span>, cerca de <span class="hl-rojo">80 kg</span>: cada día el cuerpo recicla una masa de ATP como el peso de un adulto de 80 kg (' + pdf(45) + ').' },
      { id: 'ap-c-g3', corto: 'la piel', tipo: 'destapa', fuente: 'mt-cuerpo-piel',
        enunciado: '¿Cada cuánto cambiamos de piel y cuántas células perdemos?',
        cuantas: 'son dos cifras',
        puntos: [
          'Perdemos unas <span class="hl">25.000 células por minuto</span>: unos 36 millones al día.',
          'La piel se renueva <span class="hl-rojo">cada 30 días</span>: unas 12 pieles nuevas al año.'],
        explicacion: 'La superficie de la piel son células muertas que se descaman (' + pdf(46) + ').' },
    ],
    examen: [
      { id: 'ap-c-e0', corto: 'hematíes por segundo', tipo: 'test', fuente: 'mt-cuerpo-hematies',
        enunciado: 'Un varón adulto tiene unos 27 billones de hematíes circulantes y renueva el 1 % cada día. ¿Cuántos fabrica por segundo?',
        opciones: [
          { t: 'Unos 3,1 millones por segundo: el 1 % (270.000 millones) repartido en las 24 h del día', ok: true },
          { t: '31 millones por segundo', porque: 'Te has pasado de un cero: 270.000 millones al día ÷ 86.400 s son unos 3,1 millones. Con esa cifra calcularías diez veces más producción de la que da el libro (p. 46).' },
          { t: '310.000 por segundo', porque: 'Es diez veces menos de lo que sale. Calcularías diez veces menos producción que la del libro, unos 27 billones de hematíes con renovación del 1 % diario (p. 46).' }],
        explicacion: '5,4 billones de hematíes por litro × 5 L = 27 billones; se renueva un <span class="hl">1 % al día</span>: 270.000 millones, es decir, <span class="hl-rojo">3,1 millones por segundo</span> (' + pdf(46) + ').' },
      { id: 'ap-c-e1', corto: 'longitudes', tipo: 'error', fuente: 'mt-cuerpo-vasos · mt-cuerpo-vias',
        enunciado: 'Una diapositiva de curiosidades. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Todos los vasos sanguíneos, puestos en fila, medirían unos 2.500 km.', mal: true,
            c: 'Los vasos medirían unos <span class="hl-rojo">100.000 km</span> (2,5 veces la circunferencia de la Tierra); 2.500 km son las vías aéreas (p. 44).' },
          { t: 'Las vías aéreas del pulmón suman unos 2.500 km, como de Londres a Moscú.' },
          { t: 'Hacen falta unos 3,1 millones de hematíes nuevos por segundo.' },
          { t: 'Cada día el cuerpo recicla unos 80 kg de ATP.' }],
        explicacion: 'Vasos: 100.000 km; vías aéreas: 2.500 km (' + pdf(44) + '); hematíes: 270.000 millones al día, 3,1 millones por segundo (' + pdf(46) + ').' },
    ],
    casos: [],
    profundizar: [
      { id: 'mt-cuerpo-genoma', titulo: 'El genoma: 2 m en un núcleo de 6 micras' },
      { id: 'mt-cuerpo-latido', titulo: 'El latido incomprensible' },
      { id: 'mt-cuerpo-sinapsis', titulo: 'Las conexiones de la corteza' },
    ],
  },
};
