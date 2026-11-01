// Mayéutica del bloque 3D, G4 (Marino cap. 25, págs. 56-66 del PDF): fichas 7 neumo-o2-indicaciones (caso de Jacinto) y
// 8 neumo-o2-sistemas (caso de Elvira). Formato: cabecera de b1-fluidos.js. Plan: autonomo/bloques/b3/estudio-3d/.
// Las cifras del pulmón vivo (hfno: FR 28 y Vt 371 con 10 L/min; FR 22 y Vt 335 con 50 L/min) se leyeron en la app a 390 px
// (autonomo/bloques/b3/herramientas/), no en el motor; los datos «(del paciente)» son de casos inventados.
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const O2I = 'neumo-o2-indicaciones', O2S = 'neumo-o2-sistemas';
const pv = (estado, texto) => ({ pulmonVivo: estado, texto });
const cv = (estado, texto) => ({ capilarVivo: estado, texto });
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const ILU = 'ilustrativo: la cuenta es de la ecuación de la ficha; el paciente es inventado';

const DATOS = {
  /* =================================================================================================
     Ficha 7 · Oxígeno: indicaciones y efectos fisiológicos (cap. 25, págs. 56-61) y el caso de Jacinto
     ================================================================================================= */
  [O2I]: {
    entrada: 'El umbral del oxígeno (PaO₂ 60, SaO₂ 90) baja el contenido arterial solo un 8 %, los tejidos aguantan una PaO₂ de 22 con el lactato normal, y el O₂ de más no sube el consumo: vasoconstriñe.',
    guia: [
      { id: 'o2i-g1', corto: 'umbral y objetivo', tipo: 'test', fuente: 'nep-indicaciones-o2 · nep-objetivo-spo2',
        enunciado: 'La guía de 1984 fijó cuándo dar oxígeno y las guías recientes fijan a qué saturación llegar. Antes de leer: ¿qué cifras son?',
        opciones: [
          no('Umbral PaO₂ <50 o SaO₂ <85 %; objetivo 92-96 % si retiene CO₂ y 88-92 % en el resto', `Los cortes son otros y el objetivo está invertido: el umbral es PaO₂ <60 o SaO₂ <90 % y el 88-92 % es para quien retiene CO₂ (${p(56)}). Con ese error, un retenedor recibiría más oxígeno del que tolera.`),
          ok('Umbral PaO₂ <60 o SaO₂ <90 %; objetivo 88-92 % si retiene CO₂ y 90-94 % en el resto'),
          no('Umbral PaO₂ <60 o SaO₂ <90 %; objetivo 94-98 % también en quien retiene CO₂, para dejar margen', `El objetivo de quien retiene CO₂ es 88-92 % (${p(56)}); más oxígeno en un retenedor puede elevar su PaCO₂ (${p(26)}).`)],
        explicacion: `<span class="hl-azul">PaO₂ <60 mmHg o SaO₂ <90 %</span> definen la hipoxemia y el umbral de 1984; las guías recientes piden 88-92 % si hay retención de CO₂ y 90-94 % en el resto (${p(56)}).` + enFicha(O2I, 'nep-indicaciones-o2') },
      { id: 'o2i-g2', corto: 'CaO₂ del umbral', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-cao2',
        modeloVivo: [cv('hipoxemia-60', '🩸 PaO₂ 60 en el capilar: SaO₂ 89 % y CaO₂ ≈18 mL/dL (la ficha, con SaO₂ 90 %: 181 mL/L, −8 %)'), cv('anemia', '🩸 Hb 7,5 (la ficha usa 7): el CaO₂ se hunde a 10 mL/dL (100 mL/L; la ficha, 92)')],
        enunciado: 'Con la ecuación 25.1 (puedes usar la calculadora de la ficha): ¿qué CaO₂ queda en el umbral del oxígeno y en el de la transfusión, y cuál queda más lejos de la hipoxia tisular?',
        puntos: [
          `Hb 15 y SaO₂ 0,98 dan <span class="hl-azul">197 mL/L</span>; con SaO₂ 0,90, el umbral del O₂, queda en <span class="hl-azul">181 mL/L</span>: solo un 8 % menos (${p(57)}).`,
          `Con Hb 7 g/dL, el umbral de la transfusión, el CaO₂ es <span class="hl-rojo">92 mL/L</span> (${p(57)}).`,
          `El tejido no sufre hasta bajar de 92 mL/L, así que no puede sufrir en el umbral del O₂, mucho más alto: <span class="hl-purpura">ese umbral podría bajar</span> (${p(57)}).`],
        explicacion: `El umbral del oxígeno está mucho más lejos de la hipoxia tisular que el de la transfusión (${p(57)}). El capilar vivo lo da en mL/dL (20 mL/dL = 200 mL/L) y con su propia curva: a PaO₂ 60 marca SaO₂ 89 % y 18,1 mL/dL (181 mL/L), la misma cifra que la ficha con SaO₂ 90 %.`,
        nota: `<strong>Errata aparente de la fuente.</strong> El libro imprime que 92 mL/L es «un 64 % de descenso»; con sus propias cifras (92 frente a 197) sale un 53 %. Se reproduce la cifra del libro y la conclusión no cambia (${p(57)}).` + enFicha(O2I, 'nep-cao2') },
      { id: 'o2i-g3', corto: 'tolerancia', tipo: 'test', fuente: 'nep-tolerancia · nep-tabla-25-1',
        enunciado: 'Ocho pacientes con EPOC agudizada respiraron aire con una PaO₂ <40 mmHg al menos una hora. Antes de mirar la tabla: ¿qué mostró su lactato y qué se concluye?',
        opciones: [
          no('Lactato alto en la mitad: la hipoxemia grave daña el tejido aunque la SaO₂ pase del 50 %', `El lactato no pasó de 2,0 mmol/L en ninguno (Tabla 25.1, ${p(58)}-${p(59)}). Si lo crees, tratarías con urgencia una hipoxemia que el tejido soportaba.`),
          no('Lactato normal, porque el cuerpo se adapta a la hipoxemia con las semanas', `Marino lo descarta: se vio igual en el SDRA y la tolerancia no es una adaptación que se desarrolle con el tiempo (${p(58)}).`),
          ok('Lactato ≤2 mmol/L en los ocho: sin oxigenación tisular alterada, y no es una adaptación')],
        explicacion: `Con una PaO₂ de 22 a 39 mmHg el lactato fue de 0,3 a 2,0 mmol/L (<span class="hl-verde">normal ≤2</span>): <span class="hl-azul">los tejidos toleran una hipoxemia grave</span> (${p(58)}).` + enFicha(O2I, 'nep-tolerancia') },
      { id: 'o2i-g4', corto: 'cumbre del Everest', tipo: 'test', fuente: 'nep-hipobarica',
        enunciado: 'En una cámara que simulaba la cumbre del Everest (253 mmHg) se estudió a personas sanas. ¿Qué gasometría media tuvieron y qué mostró el lactato?',
        opciones: [
          no('PaO₂ 30 y SaO₂ 58 %, con un lactato de 4 mmol/L por el metabolismo anaerobio de la altura', `El lactato siguió en el rango normal, 1,7 mmol/L (${p(59)}). Con 4 pensarías en hipoperfusión y pondrías oxígeno por una cifra que el estudio no encontró.`),
          ok('PaO₂ 30 y SaO₂ 58 %, con el lactato normal en 1,7 mmol/L'),
          no('PaO₂ 45 y SaO₂ 78 %, con el lactato normal en 1,7 mmol/L, por un tercio de la presión del mar', `Son cifras de otra situación; en la cámara la PaO₂ media fue 30 y la SaO₂ 58 % (${p(59)}).`)],
        explicacion: `A 253 mmHg (un tercio de la presión del mar) la PaO₂ fue 30 y la SaO₂ 58 % con <span class="hl-verde">lactato 1,7 mmol/L</span>; hallazgos parecidos se citan en escaladores sin oxígeno (${p(59)}).` + enFicha(O2I, 'nep-hipobarica') },
      { id: 'o2i-g5', corto: 'consumo de O₂', tipo: 'test', fuente: 'nep-tasa-metabolica · nep-fig-25-2',
        enunciado: 'Pacientes con EPOC agudizada respiran aire, O₂ al 24 % y O₂ al 28 %. Antes de leer la figura: ¿qué pasa con su PaO₂ y con su consumo de O₂ (VO₂)?',
        opciones: [
          no('La PaO₂ y el VO₂ suben en cada escalón, porque más oxígeno permite más metabolismo aeróbico', `El VO₂ no cambió: 170, 167 y 168 mL/min/m² (${p(60)}). Si esperas que suba, darás oxígeno para «mejorar el metabolismo» y no lo hará.`),
          no('La PaO₂ sube, pero el VO₂ cae de forma progresiva porque el exceso de oxígeno deprime el metabolismo', `El VO₂ quedó esencialmente plano, no descendió (${p(60)}); la ficha describe ausencia de efecto, no depresión.`),
          ok('La PaO₂ sube de 45 a 59 y a 67 mmHg, pero el VO₂ queda plano en 167-170')],
        explicacion: `Aumento significativo de la PaO₂ (p<0,001) con un <span class="hl-rojo">VO₂ sin cambios</span>: el oxígeno de más no promueve el metabolismo aeróbico (${p(59)}-${p(60)}).` + enFicha(O2I, 'nep-fig-25-2') },
      { id: 'o2i-g6', corto: 'nota de oxígeno', tipo: 'error', fuente: 'nep-vasoconstrictor · nep-tasa-metabolica', origen: ILU,
        enunciado: 'Nota sobre un paciente con EPOC agudizada que respira aire. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'PaO₂ 55 mmHg y lactato 1,0 mmol/L, sin distrés respiratorio.' },
          { t: 'Ajusto el O₂ hasta SpO₂ 98 %, porque más oxígeno sube el consumo de O₂ de los tejidos.', mal: true, c: `En el estudio de la Figura 25.2 la PaO₂ subió de 45 a 67 mmHg y el VO₂ quedó en 168 mL/min/m²: el oxígeno de más no sube el consumo (${p(60)}).` },
          { t: 'Además dilata las coronarias, así que es bueno para el corazón.', mal: true, c: `El oxígeno vasoconstriñe las coronarias y puede disminuir su flujo en la enfermedad coronaria (${p(60)}).` },
          { t: 'El umbral de SaO₂ 0,90 supone un 8 % menos de CaO₂ que el normal.' }],
        explicacion: 'Dos errores: creer que el O₂ sube el consumo y creer que dilata las coronarias.',
        nota: `La ficha no pide quitar el oxígeno: describe que su umbral podría bajar (${p(57)}).` + enFicha(O2I, 'nep-vasoconstrictor') },
      { id: 'o2i-g7', corto: 'vasoconstricción', tipo: 'test', fuente: 'nep-vasoconstrictor',
        enunciado: 'El oxígeno estrecha los vasos de los órganos principales. Antes de leer: ¿por qué ocurre y en qué órgano hace lo contrario?',
        opciones: [
          no('Libera catecolaminas, que estrechan las arterias; en el cerebro, en cambio, dilata', `El mecanismo principal es la pérdida del óxido nítrico, y la excepción es el pulmón, no el cerebro (${p(60)}).`),
          no('Aumenta el calcio del músculo liso, también el del pulmón, por eso no hay excepciones', `Marino da una excepción: en el pulmón el oxígeno es vasodilatador (${p(60)}).`),
          ok('El superóxido oxida el óxido nítrico y se pierde su acción vasodilatadora; solo en el pulmón dilata')],
        explicacion: `El radical superóxido oxida el óxido nítrico: <span class="hl-azul">se pierde la vasodilatación</span>. El oxígeno estrecha los vasos de los órganos principales y solo en el pulmón los dilata (${p(60)}).` + enFicha(O2I, 'nep-vasoconstrictor') },
    ],
    examen: [
      { id: 'o2i-e1', corto: 'CaO₂ con Hb 10', tipo: 'test', fuente: 'nep-cao2', origen: ILU,
        enunciado: 'Una paciente con anemia tiene Hb 10 g/dL y SaO₂ 0,98. ¿Qué CaO₂ tiene y dónde queda respecto al umbral de 92 mL/L?',
        opciones: [
          no('98 mL/L, apenas por encima del umbral', `Olvidaste los 1,34 mL de O₂ que carga cada gramo de Hb: 1,34 × 10 × 0,98 × 10 = 131 (${p(57)}).`),
          ok('131 mL/L, por encima del umbral de 92 mL/L'),
          no('13 mL/L, muy por debajo del umbral', `Falta el factor 10 que convierte mL/dL en mL/L: son 131 mL/L (${p(57)}).`)],
        explicacion: `Ecuación 25.1: CaO₂ = 1,34 × Hb × SaO₂ × 10 = 1,34 × 10 × 0,98 × 10 ≈ <span class="hl-azul">131 mL/L</span> (${p(57)}).` + enFicha(O2I, 'nep-cao2') },
      { id: 'o2i-e2', corto: 'PaO₂ 22', tipo: 'test', fuente: 'nep-tabla-25-1',
        enunciado: 'En la Tabla 25.1, el paciente con la PaO₂ más baja tenía 22 mmHg. ¿Qué lactato tenía?',
        opciones: [
          no('4,0 mmol/L, muy por encima de lo normal', `El lactato de la tabla no superó 2,0 mmol/L (${p(58)}); un 4 sería de hipoperfusión.`),
          no('2,0 mmol/L, en el límite alto de la normalidad', `Ese valor es de los pacientes 6 y 7, con PaO₂ de 35 y 37 mmHg (${p(59)}).`),
          ok('Un lactato de 0,9 mmol/L, dentro de lo normal')],
        explicacion: `Paciente 1: PaO₂ 22, SaO₂ 35 % y <span class="hl-verde">lactato 0,9 mmol/L</span>; el lactato nunca pasó de 2,0 (${p(58)}-${p(59)}). Nota de fidelidad de la ficha: la columna del lactato se imprime como «mm/L».` + enFicha(O2I, 'nep-tabla-25-1') },
      { id: 'o2i-e3', corto: 'la guía de 1984', tipo: 'test', fuente: 'nep-indicaciones-o2', origen: 'ficha: la cita de 1984, pág. 56',
        enunciado: 'La guía de 1984 indica oxígeno con PaO₂ <60 mmHg o SaO₂ <90 %. ¿Qué se asume a esos valores y qué opina Marino?',
        opciones: [
          no('Que el tejido está bien hasta una PaO₂ <40 mmHg, y Marino lo confirma con sus estudios', `La guía asume lo contrario: que a esos valores hay hipoxia tisular (${p(56)}). Y Marino la cuestiona; con ese error darías por buena una asunción que los estudios con lactato normal no sostienen (${p(58)}).`),
          ok('Que hay hipoxia tisular, una asunción que Marino cuestiona con sus propios estudios'),
          no('Que hace falta un lactato >2 mmol/L para dar oxígeno, y Marino lo confirma', `La guía de 1984 se basa solo en la PaO₂ y la SaO₂ (${p(56)}); el lactato lo usa Marino para mostrar que el tejido tolera valores peores (${p(58)}). Con ese criterio retrasarías oxígeno a quien lo necesita.`)],
        explicacion: `La guía asume que a PaO₂ <60 o SaO₂ <90 % <span class="hl-rojo">«la hipoxia tisular está presente»</span>; Marino lo pone en duda: «el problema principal» es esa asunción (${p(56)}).` + enFicha(O2I, 'nep-indicaciones-o2') },
      { id: 'o2i-e4', corto: 'oxígeno y coronarias', tipo: 'test', fuente: 'nep-vasoconstrictor',
        enunciado: 'Un paciente con enfermedad coronaria recibe oxígeno de más. ¿Qué efecto de la ficha te preocupa?',
        opciones: [
          no('Que el oxígeno dilata las coronarias y roba flujo a las zonas isquémicas', `El efecto descrito es el contrario: vasoconstricción coronaria (${p(60)}).`),
          ok('Que vasoconstriñe las coronarias y puede disminuir su flujo sanguíneo'),
          no('Que sube el consumo de O₂ del miocardio y aumenta el riesgo de infarto', `La ficha no atribuye al oxígeno un aumento del consumo; mostró un VO₂ plano (${p(60)}).`)],
        explicacion: `El oxígeno <span class="hl-rojo">promueve vasoconstricción coronaria</span> y puede disminuir el flujo en la enfermedad coronaria (${p(60)}).` + enFicha(O2I, 'nep-vasoconstrictor') },
      { id: 'o2i-e5', corto: 'qué dice el VO₂ plano', tipo: 'test', fuente: 'nep-tasa-metabolica',
        enunciado: 'Si el VO₂ no sube al subir la PaO₂, ¿qué interpreta Marino sobre el uso clínico del oxígeno?',
        opciones: [
          no('Que la PaO₂ se mide mal en el EPOC y los estudios no son concluyentes', `Marino lo interpreta como coherente con que el uso clínico del oxígeno no se basa en la necesidad de los tejidos (${p(61)}).`),
          no('Que el metabolismo anaerobio compensa la falta de oxígeno en esos pacientes', `El lactato fue normal en los estudios de la ficha (${p(58)}); no hubo metabolismo anaerobio que compensar.`),
          ok('Que no se basa en las necesidades tisulares de O₂: los tejidos ya tienen suficiente')],
        explicacion: `<span class="hl-purpura">«Los tejidos tienen suficiente O₂ y no quieren más»</span>; la vasoconstricción sería un mecanismo que los protege del exceso (${p(61)}).` + enFicha(O2I, 'nep-tasa-metabolica') },
    ],
    casos: [
      { id: 'c-o2i-jacinto', titulo: 'Jacinto, 58 años: la noche del oxígeno', corto: 'Caso · Jacinto (oxígeno)', sub: 'EPOC en la planta, tras la UCI; SpO₂ 86 con aire y una mascarilla de más',
        paciente: { Edad: '58 años, varón', Peso: '70 kg', Antecedentes: 'EPOC grave, fumador; ingresó hipercápnico y pasó por la UCI', Motivo: 'Día 9, ya en la planta (del caso)' },
        pasos: [
          { momento: 'Día 9 · planta', datos: { 'SpO₂ (aire)': '86 %', 'PaO₂': '52 mmHg', Lactato: '1,1 mmol/L', Aspecto: 'tranquilo, FR 18' }, nuevo: ['SpO₂ (aire)', 'PaO₂', 'Lactato', 'Aspecto'],
            pregunta: { id: 'o2i-c1', tipo: 'test', fuente: 'nep-objetivo-spo2 · nep-tolerancia', origen: 'ficha: los objetivos; las cifras del paciente, inventadas',
              enunciado: 'Jacinto respira aire con SpO₂ 86 %, PaO₂ 52 y lactato 1,1. ¿Qué haces con el oxígeno?',
              opciones: [
                no('Oxígeno hasta SpO₂ 94-98 %, como en una hipoxemia sin retención de CO₂', `Jacinto retiene CO₂: su objetivo es 88-92 % (${p(56)}) y más oxígeno puede subir su PaCO₂ (${p(26)}).`),
                ok('Oxígeno hasta 88-92 %; el lactato normal dice que el tejido está bien'),
                no('Nada: con lactato normal no precisa oxígeno, aunque la SpO₂ sea 86 %', `La ficha defiende que el umbral podría bajar, pero las guías que cita piden oxígeno con SaO₂ <90 % y un objetivo de 88-92 % en el retenedor (${p(56)}-${p(57)}).`)],
              explicacion: `Las guías piden oxígeno con SaO₂ <90 % y <span class="hl-azul">88-92 % si retiene CO₂</span> (${p(56)}); el lactato ≤2 mmol/L es la señal de que el tejido no sufre (${p(58)}).` + enFicha(O2I, 'nep-objetivo-spo2') } },
          { momento: 'Día 9 · su contenido de O₂', datos: { Hb: '13 g/dL (del paciente)', 'SaO₂': '0,86' }, nuevo: ['Hb', 'SaO₂'],
            calculadora: { ir: 'neumo-cao2-hb', nombre: 'Contenido arterial de O₂' },
            pregunta: { id: 'o2i-c2', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-cao2', origen: ILU,
              enunciado: 'Calcula el CaO₂ de Jacinto con Hb 13 y SaO₂ 0,86 (calculadora de la ficha). ¿Qué te dice?',
              puntos: [
                `<span class="hl-azul">CaO₂ = 1,34 × 13 × 0,86 × 10 ≈ 150 mL/L</span> (${p(57)}).`,
                `Está muy por encima de los 92 mL/L del umbral de la transfusión; su lactato de 1,1 va en el mismo sentido (${p(57)}-${p(58)}).`,
                `Aun así, la pauta vigente que cita la ficha para un retenedor sigue siendo un objetivo de 88-92 % (${p(56)}).`],
              explicacion: `Un CaO₂ de 150 mL/L es un 24 % menos que el normal de 197, pero queda lejos de 92 mL/L (${p(57)}). Cuenta ilustrativa con un paciente inventado.` + enFicha(O2I, 'nep-cao2') } },
          { momento: 'Día 9 · de noche', datos: { Oxígeno: 'mascarilla a 10 L/min «por dolor torácico»', 'SpO₂': '99 %', 'PaCO₂': '71 → 84 mmHg a las 2 h (del paciente)' }, nuevo: ['Oxígeno', 'SpO₂', 'PaCO₂'],
            pregunta: { id: 'o2i-c3', tipo: 'test', fuente: 'nep-vasoconstrictor · nep-objetivo-spo2', origen: 'ficha; las cifras, del paciente (inventado)',
              enunciado: 'De guardia, le ponen una mascarilla a 10 L/min por dolor torácico. La SpO₂ sube a 99 % y a las 2 horas la PaCO₂ pasa de 71 a 84. ¿Qué ha pasado?',
              opciones: [
                no('El oxígeno apagó su impulso ventilatorio; basta retirarlo y no hay más que vigilar', `Los estudios recientes no encuentran una caída del impulso: la PaCO₂ sube igualmente (${p(26)}). Además, el oxígeno vasoconstriñe las coronarias (${p(60)}).`),
                ok('Superó su objetivo de 88-92 % y subió la PaCO₂; además el oxígeno vasoconstriñe las coronarias'),
                no('Es la evolución de su EPOC: la SpO₂ de 99 % prueba que el oxígeno no tuvo que ver', `En el retenedor, el oxígeno alto puede elevar la PaCO₂ aunque la oxigenación sea excelente (${p(26)}); 99 % supera su objetivo de 88-92 % (${p(56)}).`)],
              explicacion: `En la EPOC con hipercapnia crónica el oxígeno alto puede subir la PaCO₂; el objetivo es 88-92 % y no más (${p(26)}). El oxígeno vasoconstriñe además las coronarias (${p(60)}).` + enFicha(O2I, 'nep-vasoconstrictor') } },
          { momento: 'Día 10 · la nota del plan', datos: { Plan: 'redactado por un residente' }, nuevo: ['Plan'],
            pregunta: { id: 'o2i-c4', tipo: 'error', fuente: 'nep-vasoconstrictor · nep-objetivo-spo2', origen: 'ficha: lo que contradice cada frase',
              enunciado: 'Plan del residente tras la mala noche. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Objetivo de SpO₂ 88-92 % con oxígeno de bajo flujo.' },
                { t: 'Ajusto a SpO₂ 94-98 %, el objetivo de las guías recientes.', mal: true, c: `Las guías recientes piden 88-92 % si retiene CO₂ y 90-94 % en el resto, no 94-98 % (${p(56)}).` },
                { t: 'Subo el oxígeno porque libera óxido nítrico y dilata los vasos de los órganos principales.', mal: true, c: `Al revés: el superóxido oxida el óxido nítrico y se pierde la vasodilatación (${p(60)}).` },
                { t: 'Reviso el lactato: ≤2 mmol/L indica que el tejido no sufre.' }],
              explicacion: 'Dos errores: el objetivo de las guías recientes no es 94-98 % y el oxígeno no dilata los vasos de los órganos principales.' + enFicha(O2I, 'nep-vasoconstrictor') } },
          { momento: 'Día 10 · el sistema', datos: { 'SpO₂': '97 % con la mascarilla', 'PaCO₂': '84 mmHg' }, nuevo: ['SpO₂', 'PaCO₂'],
            pregunta: { id: 'o2i-c5', tipo: 'test', fuente: 'nep-objetivo-spo2', origen: 'ficha: objetivo y Tabla 25.2; las cifras, del paciente (inventado)',
              enunciado: 'Retiras la mascarilla. ¿Con qué sigues y con qué objetivo?',
              opciones: [
                no('Mascarilla de no reinhalación a 10 L/min, para tener margen si se desatura de noche', `Daría una FiO₂ de 60-80 % (${p(62)}), muy por encima de lo que necesita para 88-92 % y de lo que tolera su PaCO₂ (${p(26)}).`),
                ok('Gafas nasales de bajo flujo (FiO₂ 24-40 %) ajustadas a una SpO₂ de 88-92 %'),
                no('Aire ambiente hasta que la PaCO₂ baje de 60, aunque la SpO₂ quede en 86 %', `Su hipoxemia sí precisa oxígeno: el objetivo es 88-92 %, no cero (${p(56)}).`)],
              explicacion: `Las gafas dan una FiO₂ de 24 a 40 % con 1-6 L/min (${p(61)}); se ajustan al objetivo de 88-92 % del retenedor (${p(56)}).` + enFicha(O2I, 'nep-objetivo-spo2') } },
        ],
        lleva: [
          'El umbral del oxígeno baja el CaO₂ solo un 8 %; el lactato dice si el tejido sufre.' + enFicha(O2I, 'nep-cao2'),
          'En el que retiene CO₂ el objetivo es 88-92 % y no más.' + enFicha(O2I, 'nep-objetivo-spo2'),
          'El oxígeno de más no sube el consumo y vasoconstriñe, también las coronarias.' + enFicha(O2I, 'nep-vasoconstrictor')],
        volver: { nombre: 'El contenido de O₂', ancla: 'nep-cao2', modelo: cv('hipoxemia-60', '🩸 PaO₂ 60 en el capilar vivo') } },
    ],
    profundizar: [
      { id: 'nep-apego-o2', titulo: 'El apego al oxígeno' },
      { id: 'nep-messner', titulo: 'Reinhold Messner: el Everest sin oxígeno' },
    ],
  },

  /* =================================================================================================
     Ficha 8 · Oxígeno: sistemas de administración (cap. 25, págs. 61-66) y el caso de Elvira
     ================================================================================================= */
  [O2S]: {
    entrada: 'La FiO₂ la decide el paciente, con su flujo inspiratorio (de 15 a 120 L/min), tanto como el aparato; el alto flujo nasal es el que iguala ese flujo con una FiO₂ conocida y con comodidad.',
    guia: [
      { id: 'o2s-g1', corto: 'flujo y FiO₂', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-flujo-fio2',
        modeloVivo: pv('hfno', '🫁 Con 10 L/min la cánula no cubre la inspiración de Elvira'),
        enunciado: 'Dos pacientes llevan la misma cánula a 4 L/min y reciben una FiO₂ distinta. ¿Por qué?',
        puntos: [
          `La FiO₂ sale del <span class="hl-azul">balance entre el flujo de O₂ y el flujo inspiratorio del paciente</span> (${p(61)}).`,
          `Si el inspiratorio supera el flujo de O₂, el sobrante <span class="hl-rojo">arrastra aire ambiente</span> y la FiO₂ baja (${p(61)}).`,
          `El inspiratorio normal es de unos 15 L/min en calma y llega a 120 L/min en la insuficiencia respiratoria aguda (${p(61)}).`],
        explicacion: `Por eso los sistemas de bajo flujo suelen quedarse cortos en el distrés respiratorio (${p(61)}).` + enFicha(O2S, 'nep-flujo-fio2') },
      { id: 'o2s-g2', corto: 'qué sistema', tipo: 'test', fuente: 'nep-tabla-25-2',
        enunciado: 'Antes de mirar la Tabla 25.2: un paciente necesita una FiO₂ del 70 %. ¿Qué sistemas llegan y cuál ya no se favorece?',
        opciones: [
          no('Las gafas nasales a 6 L/min y la mascarilla estándar; ambas se siguen favoreciendo', `Las gafas dan 24-40 % y la mascarilla estándar 35-50 % (${p(62)}); ninguna llega al 70 % y el paciente seguiría hipoxémico.`),
          no('La mascarilla de arrastre de aire (24-50 %) y la OxyMask; la que cae en desuso es el alto flujo nasal', `El arrastre no pasa de 50 % y el alto flujo nasal es el sistema más eficaz (${p(62)}).`),
          ok('La de no reinhalación (60-80 %) y el alto flujo nasal; la primera ya no se favorece')],
        explicacion: `No reinhalación: ≥10 L/min y <span class="hl-azul">60-80 %</span>, «ya no se favorece»; alto flujo nasal: 1-60 L/min y 24-100 %, el más eficaz (${p(62)}).` + enFicha(O2S, 'nep-tabla-25-2') },
      { id: 'o2s-g3', corto: 'la cánula nasal', tipo: 'test', fuente: 'nep-canula',
        enunciado: '¿Qué flujo y qué FiO₂ da una cánula nasal de bajo flujo, y cuándo se humidifica?',
        opciones: [
          no('De 1 a 15 L/min con una cánula normal, FiO₂ 24-60 %; se humidifica a partir de 10 L/min', `Los flujos son 1-6 L/min y 24-40 %; 15 L/min solo con cánulas de gran calibre, y se humidifica por encima de 4 (${p(61)}).`),
          ok('De 1 a 6 L/min con FiO₂ de 24 a 40 %; se humidifica por encima de 4 L/min de flujo'),
          no('De 2 a 10 L/min y FiO₂ 35-50 %, el rango de la mascarilla estándar; se humidifica en las dos', `Ese es el rango de la mascarilla estándar (${p(62)}); la cánula llega a 24-40 % (${p(61)}).`)],
        explicacion: `Cánula: 1-6 L/min, FiO₂ de <span class="hl-azul">24 % (1 L/min) a 40 % (6 L/min)</span> en respiración tranquila; permite comer y hablar, pero no logra concentraciones altas (${p(61)}).` + enFicha(O2S, 'nep-canula') },
      { id: 'o2s-g4', corto: 'mascarilla estándar', tipo: 'test', fuente: 'nep-mascarilla · nep-tabla-25-2',
        enunciado: 'La mascarilla facial estándar tiene un flujo mínimo. ¿Cuál es y por qué?',
        opciones: [
          no('2 L/min, para que el reservorio se llene de oxígeno antes de cada inspiración', `La estándar no lleva bolsa reservorio y el mínimo es 5 L/min (${p(61)}).`),
          no('10 L/min, porque por debajo el arrastre de aire de sus puertos baja la FiO₂ a menos de 24 %', `Los puertos laterales dejan inhalar aire ambiente; el mínimo es 5 L/min para vaciar el gas exhalado (${p(61)}).`),
          ok('5 L/min, para sacar de la mascarilla el gas exhalado y que el paciente no lo reinhale')],
        explicacion: `Se necesita un flujo mínimo de 5 L/min para eliminar de la mascarilla el gas exhalado (${p(61)}).`,
        nota: `<strong>Nota de fidelidad: el libro no concuerda consigo mismo.</strong> La Tabla 25.2 (${p(62)}) da a la mascarilla estándar una FiO₂ de 35-50 %; el texto (${p(61)}) dice que puede lograr un máximo de aproximadamente el 60 % en respiración tranquila. Se muestran las dos cifras.` + enFicha(O2S, 'nep-mascarilla') },
      { id: 'o2s-g5', corto: 'el reservorio', tipo: 'test', fuente: 'nep-reservorio',
        enunciado: 'La mascarilla de no reinhalación podría dar una FiO₂ de 100 %, pero en la práctica se acerca al 80 %. ¿Por qué se queda corta?',
        opciones: [
          no('Por el arrastre viscoso de aire ambiente en sus puertos laterales, como en la mascarilla de arrastre', `Ese mecanismo es de la mascarilla de arrastre de aire (${p(63)}); en la de no reinhalación la válvula impide inhalar aire ambiente (${p(62)}).`),
          ok('Por las fugas alrededor de la mascarilla y el mal funcionamiento de la válvula, no por arrastre'),
          no('Porque, como la mascarilla estándar, su FiO₂ máxima en respiración tranquila ronda el 60 %', `Esa cifra es de la mascarilla estándar (${p(61)}); la de no reinhalación da 60-80 % (${p(62)}).`)],
        explicacion: `<span class="hl-azul">Teórica 100 %, real cercana al 80 %</span> por las fugas y las válvulas defectuosas; cayó en desuso por la reinhalación de CO₂ y por las bolsas insuficientemente llenas (${p(62)}).` + enFicha(O2S, 'nep-reservorio') },
      { id: 'o2s-g6', corto: 'el arrastre', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-arrastre',
        enunciado: 'La mascarilla de arrastre de aire usa un máximo de 15 L/min de oxígeno y se considera de alto flujo. ¿Por qué?',
        puntos: [
          `El puerto de entrada se estrecha: un chorro de alta velocidad produce un <span class="hl-azul">arrastre viscoso</span> que mete aire ambiente por los puertos (${p(63)}).`,
          `Cuanto más flujo de O₂, más aire arrastrado: así la <span class="hl-azul">FiO₂ se mantiene constante</span> y se cambia con el tamaño de los puertos (${p(63)}).`,
          `El flujo total (oxígeno más aire) suele ser <span class="hl-rojo">≥60 L/min</span>; su rango de FiO₂ es 24-50 % (${p(63)}).`],
        explicacion: `Alto flujo no significa mucho oxígeno: significa mucho gas total para el paciente (${p(63)}).` + enFicha(O2S, 'nep-arrastre') },
      { id: 'o2s-g7', corto: 'la OxyMask', tipo: 'test', fuente: 'nep-oxymask',
        enunciado: '¿Qué aporta la OxyMask frente a las otras mascarillas?',
        opciones: [
          no('Una FiO₂ fija de 24-50 % por arrastre viscoso, a más de 60 L/min de flujo total', `Eso describe la mascarilla de arrastre de aire (${p(63)}); la OxyMask usa un difusor sobre nariz y boca (${p(64)}).`),
          no('Gas calentado y humidificado a 40-60 L/min con lavado del espacio muerto de la nasofaringe', `Esas son las características del alto flujo nasal (${p(64)}-${p(65)}); la OxyMask es una mascarilla de 1 a ≥15 L/min (${p(62)}).`),
          ok('Concentraciones altas de O₂ con flujos relativamente bajos y menos reinhalación de CO₂')],
        explicacion: `Su difusor lleva un flujo concentrado de O₂ a nariz y boca (FiO₂ 24-90 %); supera a la de no reinhalación (menos reinhalación) y a la de arrastre (más O₂ con menos flujo) (${p(64)}).` + enFicha(O2S, 'nep-oxymask') },
      { id: 'o2s-g8', corto: 'nota del alto flujo', tipo: 'error', fuente: 'nep-hfno-diseno · nep-hfno-peep', origen: 'ficha: lo que contradice cada frase',
        enunciado: 'Nota sobre un alto flujo nasal. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'HFNO a 50 L/min con mezclador: gas calentado y humidificado, con FiO₂ y flujo titulados por separado.' },
          { t: 'Da una PEEP de 8-10 cmH₂O aunque el paciente tenga la boca abierta.', mal: true, c: `El HFNO solo genera una PEEP de 2-3 cmH₂O y solo con la boca cerrada (${p(65)}).` },
          { t: 'El flujo lava el espacio muerto de la nasofaringe y evita reinhalar CO₂.' },
          { t: 'Como el 30 % del volumen corriente sale del espacio muerto, el HFNO eleva la PaCO₂.', mal: true, c: `Lavar ese espacio previene la reinhalación del CO₂ exhalado; el HFNO reduce la ventilación minuto y la ficha no le atribuye retención de CO₂ (${p(65)}).` }],
        explicacion: 'Dos errores: la PEEP del HFNO es baja y con la boca cerrada, y el lavado del espacio muerto evita reinhalar CO₂.',
        modeloVivo: pv('hfno', '🫁 Activa «Boca cerrada» y mira la PEEP'),
        nota: `Aproximadamente el 30 % de un volumen corriente sale del gas exhalado en el espacio muerto anatómico (${p(65)}).` + enFicha(O2S, 'nep-hfno-peep') },
      { id: 'o2s-g9', corto: 'beneficio clínico', tipo: 'test', fuente: 'nep-hfno-clinico', origen: 'ficha: beneficio y recomendación, pág. 66',
        enunciado: 'Además de corregir la hipoxemia, ¿cuál es el beneficio principal del alto flujo nasal y qué recomienda la ficha?',
        opciones: [
          no('Ventilar al paciente y sustituir a la VNI en el fallo hipercápnico; se reserva para cuando falla la convencional', `El HFNO no ventila: alivia el distrés y da comodidad. Y la recomendación es que sustituya a la oxigenoterapia convencional, no que se reserve (${p(66)}).`),
          no('Calentar el gas sin humidificarlo, que seca la vía aérea y la hace tolerable; se indica si la hipoxemia es refractaria', `El gas del alto flujo nasal sale calentado y humidificado (${p(64)}); y la recomendación ya no es esperar a la refractariedad (${p(66)}).`),
          ok('Aliviar el distrés y dar comodidad, con menos riesgo de P-SILI; debería sustituir a la convencional')],
        explicacion: `Alivia el distrés y promueve una <span class="hl-verde">respiración confortable</span>, lo que reduce el riesgo de P-SILI; por eso se recomienda que sustituya a la oxigenoterapia convencional en la insuficiencia respiratoria hipoxémica aguda (${p(66)}).` + enFicha(O2S, 'nep-hfno-clinico') },
    ],
    examen: [
      { id: 'o2s-e1', corto: 'PEEP del alto flujo', tipo: 'test', fuente: 'nep-hfno-peep', origen: 'ficha: PEEP de 2-3 cmH₂O, pág. 65',
        enunciado: 'Una paciente con HFNO respira con la boca cerrada. ¿Qué PEEP le genera?',
        opciones: [
          no('5-8 cmH₂O, como una VNI de baja presión', `Es una PEEP de bajo nivel, de 2-3 cmH₂O (${p(65)}); creer que equivale a una VNI llevaría a no vigilar el esfuerzo.`),
          ok('2-3 cmH₂O, y solo con la boca cerrada'),
          no('Ninguna: el HFNO no genera presión espiratoria con la boca cerrada', `Con la boca cerrada sí genera 2-3 cmH₂O; con la boca abierta, no (${p(65)}).`)],
        explicacion: `El HFNO solo genera <span class="hl-azul">PEEP de bajo nivel, 2-3 cmH₂O, y solo con la boca cerrada</span>, algo poco frecuente en el fallo respiratorio agudo (${p(65)}).` + enFicha(O2S, 'nep-hfno-peep') },
      { id: 'o2s-e2', corto: 'espacio muerto', tipo: 'test', fuente: 'nep-hfno-diseno',
        enunciado: '¿Qué parte aproximada de un volumen corriente sale del gas exhalado que queda en el espacio muerto anatómico?',
        opciones: [
          no('Un 10 %', `Marino da alrededor del 30 % (${p(65)}); con el 10 % el lavado de la nasofaringe parecería un detalle sin importancia.`),
          no('Un 50 %', `Es mucho más de lo que da la ficha, alrededor del 30 % (${p(65)}).`),
          ok('Un 30 %')],
        explicacion: `<span class="hl-azul">Cerca del 30 %</span> del volumen corriente sale del gas del espacio muerto; el flujo alto lo lava y evita reinhalar CO₂ (${p(65)}).` + enFicha(O2S, 'nep-hfno-diseno') },
      { id: 'o2s-e3', corto: 'flujo mínimo', tipo: 'test', fuente: 'nep-mascarilla',
        enunciado: 'Una mascarilla facial estándar se conecta a 3 L/min. ¿Qué problema tiene?',
        opciones: [
          no('Ninguno: la FiO₂ depende solo de la concentración del gas que sale del caudalímetro', `Con menos de 5 L/min no se aclara el gas exhalado de la mascarilla, y la FiO₂ depende también del flujo inspiratorio del paciente (${p(61)}).`),
          no('Que el arrastre de aire baja la FiO₂ a 21 %, porque la mascarilla no tiene puertos', `La mascarilla sí tiene puertos de exhalación laterales que dejan inhalar aire (${p(61)}); el problema es otro.`),
          ok('Está por debajo del mínimo de 5 L/min: no se elimina el gas exhalado de la mascarilla')],
        explicacion: `Hace falta un flujo de <span class="hl-rojo">al menos 5 L/min</span> para eliminar el gas exhalado de la mascarilla (${p(61)}).` + enFicha(O2S, 'nep-mascarilla') },
      { id: 'o2s-e4', corto: 'OxyMask y alto flujo', tipo: 'test', fuente: 'nep-oxymask',
        enunciado: 'La OxyMask supera a la de no reinhalación y a la de arrastre. ¿Qué ventaja más ofrece frente al alto flujo nasal?',
        opciones: [
          no('Calienta y humidifica el gas, como el alto flujo nasal, pero con mucho menos flujo', `El gas calentado y humidificado es del alto flujo nasal (${p(64)}); la OxyMask lleva un difusor sobre nariz y boca con grandes aberturas para el CO₂ exhalado. Esperarlo te llevaría a usarla en distrés sin humidificar.`),
          ok('Ninguna otra: es superior a las otras mascarillas, pero no ofrece más que el alto flujo nasal'),
          no('Lava el espacio muerto de la nasofaringe, y por eso evita reinhalar CO₂ mejor que el alto flujo', `Ese lavado es de la cánula de alto flujo (${p(65)}); la OxyMask reduce la reinhalación frente a la no reinhalación (${p(64)}), no frente al alto flujo.`)],
        explicacion: `Es una mascarilla superior para dar O₂ alto a un coste bajo, pero <span class="hl-azul">por lo demás no ofrece ventajas sobre el alto flujo nasal</span> (${p(64)}).` + enFicha(O2S, 'nep-oxymask') },
      { id: 'o2s-e5', corto: 'arrastre y retención', tipo: 'test', fuente: 'nep-arrastre',
        enunciado: 'Una mascarilla de arrastre de aire fue popular en el paciente con retención crónica de CO₂. ¿Por qué?',
        opciones: [
          no('Porque da una FiO₂ de 60-80 % sin riesgo de reinhalación', `Su rango es 24-50 % (${p(63)}); lo valioso es que la FiO₂ no sube por sí sola.`),
          no('Porque ventila al paciente con el flujo total de 60 L/min y le baja la PaCO₂', `Ningún sistema de O₂ ventila; el flujo total sirve para mantener la FiO₂ (${p(63)}).`),
          ok('Porque da una FiO₂ constante y un aumento inadvertido podría elevar su PaCO₂')],
        explicacion: `Está diseñada para una FiO₂ constante, útil donde <span class="hl-azul">un aumento inadvertido de la FiO₂ puede subir la PaCO₂</span>; su popularidad bajó porque la pulsioximetría continua disuade del exceso de oxígeno (${p(63)}).` + enFicha(O2S, 'nep-arrastre') },
    ],
    casos: [
      { id: 'c-o2s-elvira', titulo: 'Elvira, 45 años: el oxígeno que no basta', corto: 'Caso · Elvira (sistemas)', sub: 'neumonía en urgencias; de la mascarilla al alto flujo',
        paciente: { Edad: '45 años, mujer', 'Peso y talla': '58 kg, 1,60 m (PBW 52,4 kg)', Antecedente: 'trasplante renal, inmunosuprimida', Motivo: 'neumonía con fallo hipoxémico' },
        pasos: [
          { momento: 'Urgencias · aire ambiente', datos: { 'SpO₂': '84 %', FR: '28', Aspecto: 'tiraje y disnea' }, nuevo: ['SpO₂', 'FR', 'Aspecto'],
            calculadora: { ir: 'neumo-o2-fio2-objetivo', nombre: 'Sistema según la FiO₂ objetivo' },
            pregunta: { id: 'o2s-c1', tipo: 'test', fuente: 'nep-tabla-25-2 · nep-hfno-clinico', origen: 'ficha: Tabla 25.2; FiO₂ objetivo 60 %, ilustrativa',
              enunciado: 'Elvira respira con tiraje y necesita una FiO₂ de unos 60 % (escríbelo en la calculadora). ¿Qué sistema eliges?',
              opciones: [
                no('Gafas nasales a 6 L/min: son cómodas y le permiten comer y hablar', `Dan una FiO₂ de 24-40 % (${p(61)}) y con su distrés su inspiratorio las supera: la FiO₂ real sería aún menor.`),
                no('Mascarilla facial estándar a 8 L/min, que da 35-50 %, subiendo el flujo si hace falta', `Su FiO₂ no pasa de unos 50-60 % en respiración tranquila (${p(61)}-${p(62)}) y Elvira respira rápido.`),
                ok('Alto flujo nasal; la no reinhalación llegaría, pero ya no se favorece')],
              explicacion: `La no reinhalación (≥10 L/min, 60-80 %) llega pero <span class="hl-rojo">ya no se favorece</span>; el alto flujo nasal es el sistema más eficaz para la hipoxemia grave y el distrés (${p(62)}).` + enFicha(O2S, 'nep-tabla-25-2') } },
          { momento: 'Urgencias · el plan', datos: { Plan: 'redactado mientras llega el equipo de alto flujo' }, nuevo: ['Plan'],
            pregunta: { id: 'o2s-c2', tipo: 'error', fuente: 'nep-tabla-25-2 · nep-canula · nep-reservorio', origen: 'ficha: lo que contradice cada frase',
              enunciado: 'Plan provisional del residente. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Su flujo inspiratorio, alto por el distrés, supera lo que da un sistema de bajo flujo.' },
                { t: 'Mascarilla de no reinhalación a 6 L/min para dar FiO₂ 60-80 %.', mal: true, c: `La no reinhalación se usa a ≥10 L/min (${p(62)}).` },
                { t: 'Si la bolsa reservorio se mantiene inflada, respirará sobre todo de ella.' },
                { t: 'Añado gafas a 5 L/min sin humidificar para que coma y hable.', mal: true, c: `Por encima de 4 L/min el oxígeno suele humidificarse (${p(61)}); sin humidificar a 5 L/min se reseca la vía aérea.` }],
              explicacion: 'Dos errores: el flujo mínimo de la no reinhalación y la humidificación habitual por encima de 4 L/min.' + enFicha(O2S, 'nep-reservorio') } },
          { momento: 'Urgencias · mascarilla de no reinhalación', datos: { Oxígeno: 'no reinhalación, 15 L/min', 'SpO₂': '93 %', 'PaO₂': '70 mmHg', 'PaO₂/FiO₂': '140 (FiO₂ real ≈0,5, ilustrativo)', FR: '28' }, nuevo: ['Oxígeno', 'SpO₂', 'PaO₂', 'PaO₂/FiO₂'],
            pregunta: { id: 'o2s-c3', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-reservorio', origen: 'ficha; las cifras, del caso (inventado)',
              enunciado: 'Con la no reinhalación a 15 L/min Elvira tiene PaO₂ 70 y un P/F de 140 (FiO₂ real ≈0,5). ¿Por qué una FiO₂ «del 100 %» le da un P/F de 140?',
              puntos: [
                `La FiO₂ teórica es del 100 %, pero la real se acerca al <span class="hl-rojo">80 %</span> por fugas y mal funcionamiento de la válvula, y menos aún si el inspiratorio del distrés supera el flujo (${p(61)}-${p(62)}).`,
                `Si la bolsa queda <span class="hl-rojo">insuficientemente llenada</span>, aparece una hipoxemia problemática (${p(62)}).`,
                `Con ≥10 L/min da como mucho 60-80 %; el alto flujo nasal llega a 24-100 % con 1-60 L/min, y por eso es la alternativa cuando el P/F es tan bajo (${p(62)}).`],
              explicacion: `La mascarilla de no reinhalación cayó en desuso por la reinhalación de CO₂ con válvulas defectuosas y por las bolsas mal llenadas (${p(62)}).` + enFicha(O2S, 'nep-reservorio') } },
          { momento: 'Urgencias · alto flujo', datos: { Oxígeno: 'HFNO 50 L/min, FiO₂ 0,8', FR: '22', 'SpO₂': '94 %' }, nuevo: ['Oxígeno', 'FR', 'SpO₂'],
            pregunta: { id: 'o2s-c4', tipo: 'test', fuente: 'nep-hfno-diseno · nep-tabla-25-3', origen: 'ilustrativo: la FR, del monitor de la app; el mecanismo, de la ficha', modeloVivo: pv('hfno', '🫁 Sube el flujo de la cánula a 50 L/min'),
              enunciado: 'Con el alto flujo, la FiO₂ se mantiene aunque Elvira respire con fuerza. ¿Qué hace el flujo que no hace la FiO₂?',
              opciones: [
                no('Sustituye a la VNI en el fallo hipercápnico: ventila por ella y baja su PaCO₂', `El HFNO no ventila ni sustituye a la VNI; alivia el esfuerzo porque la respiración es más cómoda (${p(66)}).`),
                no('Calienta el gas sin humidificarlo, y eso es lo que le da la comodidad', `El gas se calienta y se humidifica (${p(64)}); la comodidad viene del flujo ajustado a su inspiración (${p(66)}).`),
                ok('Lava el espacio muerto, sirve de sumidero para la FiO₂ y sube el volumen al final de la espiración')],
              explicacion: `El flujo alto lava el espacio muerto de la nasofaringe, es un <span class="hl-azul">«sumidero»</span> que mantiene la FiO₂ si el paciente sobrerrespira y aumenta el volumen pulmonar al final de la espiración (${p(65)}).` + enFicha(O2S, 'nep-hfno-diseno') } },
          { momento: 'Urgencias · a las 2 horas', datos: { Oxígeno: 'HFNO 50 L/min, FiO₂ 0,8', FR: '30 (ilustrativo)', Aspecto: 'vuelve el esfuerzo' }, nuevo: ['FR', 'Aspecto'],
            pregunta: { id: 'o2s-c5', tipo: 'test', fuente: 'nep-hfno-diseno · nep-tabla-25-2', origen: 'ilustrativo: la FR del caso; el flujo alcanzable, de la ficha', modeloVivo: pv('hfno', '🫁 Sube el flujo de la cánula hasta su tope de 60 L/min'),
              enunciado: 'A las 2 h Elvira sube la FR a 30 y vuelve el esfuerzo con 50 L/min. ¿Qué margen le queda a la cánula?',
              opciones: [
                no('Todo el que haga falta: el alto flujo nasal no tiene un tope de flujo y basta con subirlo', `Los flujos alcanzables son de 40-60 L/min según el fabricante (${p(64)}); creer que no hay tope te haría subir el flujo sin plan si el esfuerzo sigue.`),
                ok('Pocos L/min: queda poco hasta el tope de 60; si el esfuerzo sigue, hay que reevaluar a la paciente'),
                no('Ninguno: con FR 30 pasas a la mascarilla de no reinhalación, que da más FiO₂ y más flujo', `La no reinhalación ya no se favorece y no iguala el flujo inspiratorio del distrés (${p(62)}); el HFNO sigue siendo el sistema más eficaz hasta su tope.`)],
              explicacion: `El alto flujo alcanza 40-60 L/min según el fabricante (${p(64)}): a 50 L/min quedan unos 10 L/min de margen, y si el esfuerzo vuelve hay que reevaluar. La PEEP de 2-3 cmH₂O no sirve de reserva: exige boca cerrada (${p(65)}).` + enFicha(O2S, 'nep-hfno-diseno') } },
        ],
        lleva: [
          'La FiO₂ la decide el flujo inspiratorio del paciente: el bajo flujo se queda corto en el distrés.' + enFicha(O2S, 'nep-flujo-fio2'),
          'La mascarilla de no reinhalación ya no se favorece: da en la práctica cerca del 80 %.' + enFicha(O2S, 'nep-reservorio'),
          'El alto flujo da flujo, FiO₂ fija y comodidad; su PEEP es de 2-3 cmH₂O y solo con la boca cerrada.' + enFicha(O2S, 'nep-hfno-diseno')],
        volver: { nombre: 'El alto flujo nasal', ancla: 'nep-hfno-diseno', modelo: pv('hfno', '🫁 El alto flujo nasal en el pulmón vivo') } },
    ],
    profundizar: [
      { id: 'nep-tabla-25-3', titulo: 'Tabla 25.3: beneficios del alto flujo nasal' },
      { id: 'nep-tabla-25-2', titulo: 'Tabla 25.2 completa: sistemas, flujos y FiO₂' },
    ],
  },
};

// Reparte la posición de la buena en el orden de escritura (las opciones se barajan solas al pintarlas).
const colocar = (d, pat) => {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(s => s.pregunta))].filter(q => q.tipo === 'test');
  qs.forEach((q, i) => { const j = q.opciones.findIndex(o => o.ok); const [o] = q.opciones.splice(j, 1); q.opciones.splice(pat[i % pat.length], 0, o); });
  return d;
};
colocar(DATOS[O2I], [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 2]);
colocar(DATOS[O2S], [0, 1, 2]);
export const MAYEUTICA_OXIGENO = DATOS;
