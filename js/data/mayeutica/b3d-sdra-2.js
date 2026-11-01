// Mayéutica del bloque 3D, G3: ficha 5 neumo-sdra-no-ventilatorio (Marino cap. 24, págs. 39-45 del PDF), con los casos de
// Elvira (P-SILI y alto flujo) e Isidro (esteroide y prono). Formato: cabecera de b1-fluidos.js.
// Las cifras de los casos que pasan por un estado del pulmón vivo se leyeron en la app a 390 px
// (autonomo/bloques/b3/herramientas/m-pulmon-cifras.mjs y s2-prono-cifras.mjs), rotuladas «ilustrativo»; los datos de los
// pacientes (inventados) se interpretan con los umbrales de la ficha.
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = id => ` <button type="button" class="may-ir" ${NEU} data-tab="neumo-sdra-no-ventilatorio" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const pv = (estado, texto) => ({ pulmonVivo: estado, texto });
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const ILU = 'ilustrativo: las cifras del monitor; el paciente es inventado';
const FNV = 'neumo-sdra-no-ventilatorio';

export const MAYEUTICA_SDRA_2 = {
  [FNV]: {
    entrada: 'En el SDRA casi ningún fármaco salva: lo que ayuda es no lesionarse respirando (alto flujo, intubar a tiempo), no encharcar, el esteroide en el moderado-grave y poner al paciente boca abajo.',
    guia: [
      { id: 'snv-g1', corto: 'terapias fracasadas', tipo: 'test', fuente: 'nep-terapias-fracasadas',
        enunciado: 'Antes de leer: ¿cómo han ido los fármacos dirigidos a mejorar la supervivencia en el SDRA y en qué consiste, entonces, el manejo?',
        opciones: [
          no('El óxido nítrico inhalado y el surfactante mejoran la supervivencia del adulto y se usan de rutina en el moderado-grave', `Están entre los fracasos (${p(39)}). Si los das por buenos, expondrás al paciente a un tratamiento sin beneficio demostrado y retrasarás lo que sí ayuda.`),
          ok('Han fracasado casi todos (surfactante, óxido nítrico, estatinas, bloqueantes…) y el manejo es sobre todo de soporte, incluida la ventilación'),
          no('Han fracasado solo los corticoides; estatinas, β-agonistas y factor estimulante de colonias sí reducen la mortalidad', `Los corticoides se salvan en parte y las estatinas, los β-agonistas y el G-CSF figuran entre los fracasos (${p(39)}). Con esa idea buscarías un fármaco en vez de proteger el pulmón.`)],
        explicacion: `Fracasaron surfactante (en adultos), óxido nítrico inhalado, prostaciclinas inhaladas, estatinas, corticoides (salvo excepciones), bloqueantes, β-agonistas, interferón β-1a y G-CSF: <span class="hl-rojo">el manejo es de soporte</span> (${p(39)}).` + enFicha('nep-terapias-fracasadas') },
      { id: 'snv-g2', corto: 'cómo se lesiona', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-psili · nep-fig-24-4', modelo: pv('p-sili', '🫁 Elvira con mucho esfuerzo'),
        enunciado: 'Un paciente con SDRA respira por sí mismo, con mucho esfuerzo y sin respirador. ¿Cómo puede lesionarse su propio pulmón?',
        puntos: [
          `Esfuerzos vigorosos crean <span class="hl-azul">presiones intratorácicas muy negativas</span> que no se transmiten por completo a los vasos (${p(39)}).`,
          `Sube la <span class="hl-azul">presión transmural</span> y sale fluido de los capilares «permeables» del SDRA: edema (${p(39)}-${p(40)}).`,
          `El esfuerzo sube el volumen tidal y <span class="hl-rojo">sobredistiende alvéolos sanos</span>: volutrauma; también ocurre en VM si sobrerrespira (${p(39)}).`],
        explicacion: `Es la lesión pulmonar autoinducida (P-SILI): presión negativa → presión transmural → edema, y volumen alto → volutrauma (Figura 24.4, ${p(40)}).` + enFicha('nep-psili') },
      { id: 'snv-g3', corto: 'retrasar la intubación', tipo: 'test', fuente: 'nep-psili',
        enunciado: 'Un paciente con SDRA sigue respirando con esfuerzos aumentados a pesar del oxígeno. ¿Qué implica el riesgo de P-SILI para la decisión de intubar?',
        opciones: [
          no('Esperar a que fracase el oxígeno de alto flujo, porque la ventilación mecánica añade más lesión que su propio esfuerzo', `Retrasarla puede tener consecuencias deletéreas si sigue con respiración laboriosa (${p(40)}). Mientras esperas, el esfuerzo sigue edematizando y sobredistendiendo su pulmón.`),
          ok('No retrasarla: se aconseja intubar antes que después, y mientras tanto el oxígeno y la sedación alivian la disnea'),
          no('Intubar solo cuando el cociente PaO₂/FiO₂ baje de 100, porque el P-SILI aparece por debajo de esa cifra', `El P-SILI depende del esfuerzo respiratorio, no de un P/F concreto, y la ficha no da ese umbral (${p(40)}). Te quedarías mirando una cifra mientras el paciente se lesiona.`)],
        explicacion: `Para quien continúa con esfuerzos aumentados, <span class="hl">intubación y ventilación mecánica antes que después</span>; entre tanto, medidas que alivien la disnea (${p(40)}).` + enFicha('nep-psili') },
      { id: 'snv-g4', corto: 'alto flujo', tipo: 'test', fuente: 'nep-hfno-sdra', modelo: pv('hfno', '🫁 Sube el flujo de la cánula de Elvira'),
        enunciado: 'Si la oxigenoterapia convencional no corrige la hipoxemia, se prueba el oxígeno nasal de alto flujo (HFNO). ¿Qué es y qué aporta frente a la convencional?',
        opciones: [
          no('O₂ seco a 15 L/min con la FiO₂ ligada al flujo; en el COVID bajó la mortalidad, sin cambiar las intubaciones', `Es el invertido: el HFNO da O₂ calentado y humidificado a 40-60 L/min con la FiO₂ ajustable aparte, y bajó las intubaciones sin cambiar la mortalidad (${p(40)}).`),
          no('O₂ calentado y humidificado a 40-60 L/min con FiO₂ independiente; su ventaja principal es la mayor fracción inspirada de oxígeno', `La ventaja que cita Marino no es una FiO₂ mayor, sino la respiración confortable que produce el flujo alto, que además reduce el P-SILI (${p(40)}).`),
          ok('Calentado y humidificado, 40-60 L/min y FiO₂ aparte; menos intubaciones en el COVID, sin cambio en mortalidad')],
        explicacion: `Menos intubaciones (no en todos los estudios) sin diferencia en mortalidad; hoy se recomienda como <span class="hl-verde">reemplazo de la oxigenoterapia convencional</span> por la respiración confortable (${p(40)}).` + enFicha('nep-hfno-sdra') },
      { id: 'snv-g5', corto: 'nota de toxicidad', tipo: 'error', fuente: 'nep-toxicidad-aviso', origen: ILU,
        enunciado: 'Un residente escribe esta nota sobre el alto flujo en un paciente no intubado. Hay un error. Encuéntralo.',
        frases: [
          { t: 'Si la oxigenoterapia convencional, de hasta 15 L/min, no corrige la hipoxemia, se prueba el alto flujo.' },
          { t: 'Usar el alto flujo para retrasar la intubación suele exponer al paciente a FiO₂ ≥70 % durante mucho tiempo.' },
          { t: 'Como no está intubado, una FiO₂ de 0,8 durante tres días es segura.', mal: true, c: `Los críticos suelen tener poco glutatión, la lesión por O₂ es idéntica al SDRA (${p(40)}-${p(41)}).` },
          { t: 'Los niveles altos de O₂ aceleran los efectos dañinos de la ventilación mecánica.' }],
        explicacion: 'El aviso de la ficha: el alto flujo permite FiO₂ ≥70 % prolongadas y con ellas el riesgo de toxicidad por O₂.',
        nota: `La toxicidad por O₂ se desarrolla en la ficha de oxígeno (${p(41)}).` + enFicha('nep-toxicidad-aviso') },
      { id: 'snv-g6', corto: 'VNI y gravedad', tipo: 'test', fuente: 'nep-fig-24-5 · nep-vni-sdra',
        enunciado: 'La VNI es popular en el SDRA precoz. ¿En qué gravedad evita más la intubación y qué te dice que está fracasando?',
        opciones: [
          no('En el SDRA grave, el que más la necesita; fracasa si a la hora el paciente sigue con la FiO₂ alta', `Es donde más falla (${p(42)}, Figura 24.5). Insistir en VNI en el grave retrasa una intubación que el paciente probablemente va a necesitar.`),
          no('En el moderado; fracasa si el P/F baja después de las primeras 24 horas de tratamiento', `Funciona mejor en el leve, y el aviso es a la hora, no a las 24 h (${p(41)}-${p(42)}). Un día de VNI fallida es un día de esfuerzo excesivo.`),
          ok('En el leve (P/F 201-300); fracasa si a la hora el P/F no sube y sigue el esfuerzo')],
        explicacion: `Mejor en el <span class="hl-verde">SDRA leve</span>; si el P/F no mejora a la hora con esfuerzo aumentado, <span class="hl-rojo">se considera intubar</span> (${p(41)}-${p(42)}).` + enFicha('nep-vni-sdra') },
      { id: 'snv-g7', corto: 'fluidos', tipo: 'test', fuente: 'nep-fluidos-sdra',
        enunciado: 'En el SDRA los capilares son permeables. ¿Cuál es el objetivo de fluidos y qué ha de evitarse?',
        opciones: [
          ok('Evitar el balance positivo con balances diarios y diuréticos, sin caer en déficit, que hunde el gasto con presión positiva'),
          no('Mantener un balance negativo cada día, con diurético sistemático, porque el pulmón solo mejora con el paciente seco del todo', `El déficit también daña: con presiones intratorácicas positivas la hipovolemia magnifica la caída del gasto cardíaco y agrava la disfunción multiorgánica (${p(42)}).`),
          no('Reponer volumen con liberalidad, porque el edema del SDRA es por la inflamación y no cambia con el balance de líquidos', `Un balance positivo se acumula en el pulmón y puede alargar la ventilación mecánica (${p(42)}).`)],
        explicacion: `Balance positivo fuera (puede acortar la ventilación), pero <span class="hl-rojo">sin déficits</span>: la presión positiva magnifica la caída del gasto cardíaco en la hipovolemia (${p(42)}).` + enFicha('nep-fluidos-sdra') },
      { id: 'snv-g8', corto: 'cuándo el esteroide', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'nep-corticoides-sdra · nep-tabla-24-3',
        enunciado: 'La recomendación es débil, pero existe. ¿A quién se da esteroide en el SDRA, cuánto y durante cuánto tiempo?',
        puntos: [
          `<span class="hl-azul">COVID-19</span> con O₂ o asistencia ventilatoria: dexametasona 6 mg al día hasta 10 días (${p(43)}).`,
          `<span class="hl-azul">Moderado-grave</span> (P/F <200 con PEEP 10): metilprednisolona, primeros 14 días (${p(43)}).`,
          `Si empieza en las <span class="hl">primeras 72 h</span>: 1 mg/kg/día de peso ideal; si el SDRA persiste 7-14 días: 2 mg/kg/día (${p(43)}).`,
          `Ambos regímenes, 14 días con <span class="hl-rojo">descenso lento</span> de la dosis (${p(43)}).`],
        explicacion: `La Tabla 24.3 los resume; el de 2 mg/kg va dirigido a la fase fibroproliferativa (${p(43)}).` + enFicha('nep-tabla-24-3') },
      { id: 'snv-g9', corto: 'efectos adversos', tipo: 'test', fuente: 'nep-corticoides-sdra · nep-tabla-24-3',
        enunciado: 'Al empezar metilprednisolona en un SDRA, ¿qué efecto adverso es el más frecuente y cuál el más temido?',
        opciones: [
          no('El más frecuente, la hemorragia digestiva por estrés; el más temido, la infección fúngica invasiva', `Esos no son los que cita la ficha (${p(43)}). Vigilarlos a ciegas te haría pasar por alto la glucemia.`),
          no('El más frecuente, la miopatía aguda con debilidad; el más temido, la hiperglucemia mantenida', `Están cambiados: la miopatía es la complicación temida pero rara (${p(43)}). Si la tomas por frecuente, atribuirás debilidad a un esteroide que casi nunca la causa sola.`),
          ok('Más frecuente, la hiperglucemia; más temida, una miopatía aguda con bloqueantes, pero rara')],
        explicacion: `<span class="hl">Hiperglucemia</span> la más frecuente; <span class="hl-rojo">miopatía aguda</span> la más temida, asociada a esteroide a dosis altas con bloqueantes neuromusculares, rara (${p(43)}).` + enFicha('nep-corticoides-sdra') },
      { id: 'snv-g10', corto: 'qué hace el prono', tipo: 'test', fuente: 'nep-prono-fisiologia', modelo: pv('prono', '🫁 Pulsa «Prono» y mira el racimo'),
        enunciado: 'Antes de girar a un paciente con consolidación densa en las zonas posteriores: ¿qué consigue la posición prono?',
        opciones: [
          no('Solo airea los segmentos posteriores; el flujo sanguíneo se queda donde estaba, repartido igual que en supino', `Hace las dos cosas: aumenta el flujo en la región anterior y airea los segmentos posteriores (${p(44)}). Quedarte con una sola explica mal por qué mejora la oxigenación.`),
          ok('Más flujo a la región anterior y aireación posterior: mejora la oxigenación y la salida de CO₂'),
          no('Reduce la presión de arteria pulmonar y por eso se aplica en cuanto hay hipoxemia', `La baja de la presión pulmonar alivia el corazón derecho, pero el prono tiene indicaciones concretas (${p(44)}); girar sin ellas expone a complicaciones.`)],
        explicacion: `Flujo anterior ↑ + aireación posterior ↑ = mejor oxigenación y mejor salida de CO₂; en respiración espontánea bajan FR y trabajo respiratorio y descienden las presiones de arteria pulmonar (${p(44)}).` + enFicha('nep-prono-fisiologia') },
      { id: 'snv-g11', corto: 'cuándo girar', tipo: 'test', fuente: 'nep-prono-cuando',
        enunciado: '¿Cuándo está indicada la posición prono, según estén respirando solos o ventilados?',
        opciones: [
          no('En ambos reduce la mortalidad: se aplica a los pacientes con SDRA, estén o no con alto flujo', `En respiración espontánea solo sirve con HFNO o VNI y no cambia la mortalidad (${p(44)}).`),
          no('Solo ventilados, como rescate de la hipoxemia refractaria, con el volumen tidal que lleven', `Se demostró supervivencia con P/F <150 ventilados con Vt de unos 6 mL/kg (${p(44)}); con volúmenes altos no hay esa evidencia.`),
          ok('Espontáneos con HFNO o VNI, para evitar intubar; ventilados con P/F <150 y Vt ~6, para la supervivencia')],
        explicacion: `Tabla 24.4: dos indicaciones; en espontáneos <span class="hl">menos intubaciones sin impacto en mortalidad</span>; en ventilados <span class="hl-verde">beneficio de supervivencia</span> en el moderado-grave (${p(44)}).`,
        nota: '<b>Las fuentes discrepan en la forma.</b> El texto define el moderado-grave como P/F <150 con PEEP ≥5, o FiO₂ ≥60 % con PEEP 10; la nota de la Tabla 24.4, como P/F <150 y FiO₂ ≥60 % con PEEP ≥5. No se elige.' + enFicha('nep-prono-cuando') },
      { id: 'snv-g12', corto: 'nota de prono', tipo: 'error', fuente: 'nep-tabla-24-4', origen: ILU,
        enunciado: 'Un residente apunta esta nota antes de pronar a un paciente. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'Con hemorragia activa no se prona.' },
          { t: 'Giro a un paciente con PIC elevada porque su P/F es de 90.', mal: true, c: `La PIC aumentada es contraindicación absoluta de la Tabla 24.4, aunque la hipoxemia sea muy grave (${p(44)}).` },
          { t: 'Una traqueostomía de hace tres días no cuenta: solo importan las de más de dos semanas.', mal: true, c: `Es la reciente (2 semanas) la que contraindica, junto con la esternotomía (${p(44)}).` },
          { t: 'Con un shock circulatorio hay que valorarlo bien, porque es contraindicación relativa.' }],
        explicacion: 'Absolutas: hemorragia activa, inestabilidad espinal, fracturas múltiples, PIC aumentada y traqueostomía o esternotomía reciente (2 semanas).',
        nota: `Relativas: shock circulatorio, embarazo, arritmias recientes potencialmente mortales y tubos torácicos funcionantes (${p(45)}).` + enFicha('nep-tabla-24-4') },
      { id: 'snv-g13', corto: 'evaluar la sesión', tipo: 'test', fuente: 'nep-prono-como',
        enunciado: 'Acabas la primera sesión de prono. ¿Qué buscas para decidir si merece la pena seguir?',
        opciones: [
          no('Esperar a las 48 horas para decidir, porque la respuesta no se ve en una sola sesión de giro', `Se espera la respuesta tras la primera sesión (${p(45)}). Dos días más de giros en quien no responde son complicaciones sin beneficio.`),
          no('Que el paciente refiera alivio; la oxigenación no se usa para decidir si repetir las sesiones', `Se usa el P/F y la distensibilidad (${p(45)}); el alivio subjetivo no sustituye a una cifra.`),
          ok('Que el P/F y la distensibilidad suban; si no hay beneficio, no se justifican más sesiones')],
        explicacion: `Tras la primera sesión debería verse subida del P/F y de la distensibilidad; <span class="hl-rojo">sin beneficio, no más sesiones</span> (${p(45)}).` + enFicha('nep-prono-como') },
    ],
    examen: [
      { id: 'snv-e1', corto: 'volumen en VNI', tipo: 'test', fuente: 'nep-vni-sdra',
        enunciado: 'Pacientes con SDRA que fracasan con VNI. ¿Qué volumen tidal tienen típicamente, y qué sugiere?',
        opciones: [
          no('≥8 mL/kg PBW, el volumen protector; sugiere que la VNI ventila bien', `El corte es 9,5, y un volumen alto indica esfuerzo aumentado, no ventilación adecuada (${p(41)}).`),
          ok('≥9,5 mL/kg de peso predicho: esfuerzo aumentado'),
          no('<6 mL/kg PBW, porque el paciente respira poco y se agota', `Es lo contrario: los que fracasan tienen volúmenes aumentados (${p(41)}).`)],
        explicacion: `Volúmenes tidales <span class="hl-rojo">≥9,5 mL/kg PBW</span>, con posible papel del P-SILI en el fracaso de VNI (${p(41)}).` + enFicha('nep-vni-sdra') },
      { id: 'snv-e2', corto: 'mortalidad con VNI', tipo: 'test', fuente: 'nep-fig-24-5',
        enunciado: 'En la Figura 24.5, ¿cuál es la mortalidad hospitalaria cuando la VNI tiene éxito frente a cuando fracasa?',
        opciones: [
          no('22 % si tiene éxito y 45 % si fracasa', `El 22 % es la tasa de fracaso en el SDRA leve, no una mortalidad (${p(41)}-${p(42)}).`),
          no('45 % si tiene éxito y 16 % si fracasa', `Están al revés: fracasar la VNI es lo que sube la mortalidad (${p(42)}).`),
          ok('16 % si tiene éxito y 45 % si fracasa')],
        explicacion: `<span class="hl-verde">16 %</span> con éxito frente a <span class="hl-rojo">45 %</span> si fracasa (${p(41)}-${p(42)}).` + enFicha('nep-fig-24-5') },
      { id: 'snv-e3', corto: 'dosis según el día', tipo: 'test', fuente: 'nep-tabla-24-3',
        enunciado: 'SDRA moderado-grave: ¿qué dosis de metilprednisolona corresponde a las primeras 72 horas y cuál al que persiste 7-14 días?',
        opciones: [
          no('2 mg/kg/día en las primeras 72 h y 1 mg/kg/día si persiste', `Está al revés: la dosis más alta se reserva a la fase fibroproliferativa (${p(43)}).`),
          ok('1 mg/kg/día de peso ideal en las primeras 72 h y 2 mg/kg/día si persiste 7-14 días'),
          no('1 mg/kg/día de peso real en ambos casos, con retirada brusca a los 7 días sin descenso', `Se usa el peso ideal y el régimen dura 14 días con descenso lento (${p(43)}).`)],
        explicacion: `<span class="hl">1 mg/kg/día</span> en las primeras 72 h; <span class="hl">2 mg/kg/día</span> si persiste 7-14 días (${p(43)}).` + enFicha('nep-tabla-24-3') },
      { id: 'snv-e4', corto: 'criterio de P/F', tipo: 'test', fuente: 'nep-prono-cuando · nep-tabla-24-4',
        enunciado: 'Un paciente ventilado con Vt de ~6 mL/kg: ¿por debajo de qué P/F está indicado el prono para mejorar la supervivencia?',
        opciones: [
          no('Menos de 150 mmHg solo si además la FiO₂ es ≥0,8', `La FiO₂ que recoge la ficha es ≥60 %, como definición alternativa, no 0,8 (${p(44)}). Exigir 0,8 retrasaría el giro a quien ya cumple la indicación.`),
          ok('Menos de 150 mmHg, con PEEP ≥5 cmH₂O'),
          no('Menos de 100 mmHg, el SDRA grave', `El criterio es P/F <150, ya en el moderado-grave (${p(44)}). Si esperas a 100, el paciente pasa horas hipoxémico sin el giro que podría mejorar su supervivencia.`)],
        explicacion: `<span class="hl-rojo">P/F <150 mmHg</span> con PEEP ≥5 (${p(44)}).`,
        nota: '<b>Las fuentes discrepan.</b> El texto añade «o FiO₂ ≥60 % con PEEP 10»; la nota de la Tabla 24.4 dice «y FiO₂ ≥60 %». Se muestran las dos; no se elige.' + enFicha('nep-tabla-24-4') },
      { id: 'snv-e5', corto: 'horas de prono', tipo: 'test', fuente: 'nep-prono-como',
        enunciado: '¿Cuántas horas de prono al día se aconsejan según el paciente respire solo o esté ventilado?',
        opciones: [
          no('2 horas al día en ambos, repartidas en varias sesiones cortas a lo largo del día', `La ficha pide una sola sesión larga en el espontáneo, no tandas cortas (${p(45)}).`),
          no('16 horas en el espontáneo, en varias tandas, y 8 horas en el ventilado', `Al revés: 8 h al menos en el espontáneo y 16 h al menos en el ventilado (${p(45)}).`),
          ok('Al menos 8 h en el espontáneo, en una sesión, y 16 h en el ventilado')],
        explicacion: `<span class="hl">≥8 h</span> (una sola sesión) respirando solo y <span class="hl">≥16 h</span> ventilado (${p(45)}).` + enFicha('nep-prono-como') },
      { id: 'snv-e6', corto: 'absoluta', tipo: 'test', fuente: 'nep-tabla-24-4',
        enunciado: '¿Cuál de estas es una contraindicación absoluta del prono?',
        opciones: [
          no('El embarazo', `Es relativa, junto con el shock, las arritmias recientes y los tubos torácicos (${p(45)}).`),
          ok('Una esternotomía de hace menos de 2 semanas'),
          no('Estar recibiendo vasopresores con estabilidad', `Los vasopresores no son contraindicación si el paciente está estable o mejora (${p(45)}).`)],
        explicacion: `Las absolutas de la Tabla 24.4 son hemorragia activa, inestabilidad espinal, fracturas múltiples, PIC aumentada y traqueostomía o esternotomía reciente (${p(44)}).` + enFicha('nep-tabla-24-4') },
    ],
    casos: [
      { id: 'c-snv-elvira', titulo: 'Elvira, 45 años: respira demasiado bien', corto: 'Caso · Elvira (P-SILI)', sub: 'neumonía con P/F 140; mucho esfuerzo; la cánula lo baja',
        paciente: { Edad: '45 años, mujer', 'Peso y talla': '58 kg, 1,60 m (PBW 52,4 kg)', Antecedente: 'trasplante renal, inmunosuprimida', Motivo: 'neumonía con fallo hipoxémico' },
        pasos: [
          { momento: 'Urgencias', datos: { FR: '28', Esfuerzo: 'tiraje visible', 'PaO₂/FiO₂': '140', Oxígeno: 'convencional, 15 L/min' }, nuevo: ['FR', 'Esfuerzo', 'PaO₂/FiO₂', 'Oxígeno'],
            pregunta: { id: 'snv-c1', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-psili · nep-hfno-sdra', origen: ILU, modelo: pv('hfno', '🫁 Elvira con la cánula a 10 L/min: FR 28 y mucho esfuerzo'),
              enunciado: 'Elvira respira con tiraje y FR 28 con oxígeno convencional a 15 L/min. ¿Qué lees y qué haces primero?',
              puntos: [
                `El tiraje y la FR 28 sugieren <span class="hl-rojo">esfuerzo muy aumentado</span>: riesgo de P-SILI (${p(39)}-${p(40)}).`,
                `Con oxígeno convencional (hasta 15 L/min) no corrige: se justifica un <span class="hl-azul">ensayo de HFNO</span> (${p(40)}).`,
                `Mientras, se vigila el esfuerzo: si persiste, se piensa en <span class="hl">intubar antes que después</span> (${p(40)}).`],
              explicacion: `El esfuerzo es el dato; la oxigenación, el motivo de la cánula (${p(40)}).` + enFicha('nep-psili') } },
          { momento: 'Urgencias · alto flujo', datos: { Oxígeno: 'HFNO 50 L/min, FiO₂ 0,8', FR: '22', 'Vt (monitor)': '335 mL (6,4 mL/kg PBW)', SpO2: '94 %' }, nuevo: ['Oxígeno', 'FR', 'Vt (monitor)', 'SpO2'],
            pregunta: { id: 'snv-c2', tipo: 'test', fuente: 'nep-hfno-sdra', origen: ILU, modelo: pv('hfno', '🫁 Sube el flujo de la cánula a 50 L/min'),
              enunciado: 'Pones HFNO a 50 L/min: bajan la FR (28 → 22) y el Vt (371 → 335 mL). ¿Qué te dice y por qué lo esperabas?',
              opciones: [
                no('Que la cánula la ventila: sustituye al respirador y el esfuerzo de la paciente ya no importa para nada', `El alto flujo no ventila: ofrece O₂ con confort (${p(40)}). Si lo crees, no vigilarás el esfuerzo que sigue.`),
                ok('Que respira más cómoda con menos esfuerzo, y eso reduce el riesgo de P-SILI'),
                no('Que la mortalidad va a bajar, porque en el COVID el HFNO la redujo de forma clara frente a la convencional', `En los estudios hubo menos intubaciones, pero sin diferencia en la mortalidad (${p(40)}).`)],
              explicacion: `La ventaja del HFNO es la <span class="hl-verde">respiración confortable</span>; con ella baja el riesgo de P-SILI (${p(40)}). Las cifras son del monitor, ilustrativas.` + enFicha('nep-hfno-sdra') } },
          { momento: 'Horas después', datos: { Oxígeno: 'HFNO 60 L/min, FiO₂ 0,8', FR: '32', 'Vt estimado': '9,8 mL/kg PBW', 'PaO₂/FiO₂': '150' }, nuevo: ['FR', 'Vt estimado', 'PaO₂/FiO₂'],
            pregunta: { id: 'snv-c3', tipo: 'test', fuente: 'nep-psili', origen: 'ficha: la conducta; los datos del caso, inventados',
              enunciado: 'Con el flujo al máximo, Elvira vuelve a FR 32, con un Vt estimado de 9,8 mL/kg y P/F 150. ¿Qué decides?',
              opciones: [
                no('Subir la FiO₂ a 1,0 y esperar unas horas más antes de plantear otra cosa', `Mantiene el esfuerzo y añade exposición alta a O₂ (${p(40)}-${p(41)}).`),
                no('Sedarla ligeramente para que respire más despacio, sin cambiar el soporte', `La sedación alivia la disnea, pero con el esfuerzo persistente la ficha aconseja intubar antes que después (${p(40)}).`),
                ok('Intubarla y ventilarla: con esfuerzo persistente es mejor antes que después')],
              explicacion: `Esfuerzo aumentado que continúa: <span class="hl-rojo">intubación y ventilación mecánica antes que después</span> (${p(40)}). El Vt estimado de 9,8 mL/kg es una extrapolación: la ficha da ≥9,5 mL/kg en los pacientes que fracasan con VNI (${p(41)}).` + enFicha('nep-psili') } },
          { momento: 'Ya intubada', datos: { 'Nota del R1': 'cuatro frases', Oxígeno: 'FiO₂ 0,8 desde hace 36 h' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'snv-c4', tipo: 'error', fuente: 'nep-fluidos-sdra', origen: ILU,
              enunciado: 'El R1 anota su plan para Elvira ya intubada. Hay un error. Encuéntralo.',
              frases: [
                { t: 'Busco un balance de +2 L al día para asegurar la precarga y el gasto cardíaco.', mal: true, c: `El balance positivo favorece el edema y más días de ventilación; hay que evitar los dos extremos (${p(42)}).` },
                { t: 'Reviso la FiO₂ a diario y la bajo a la mínima que mantenga la SpO₂ objetivo.' },
                { t: 'Evito también el déficit de volumen, porque la presión positiva magnifica la caída del gasto cardíaco.' },
                { t: 'Vigilo que no vuelva a hacer esfuerzos grandes sobre el respirador.' }],
              explicacion: 'El error es buscar un balance positivo: encharca el pulmón con la permeabilidad alterada; el déficit de volumen tampoco conviene.' + enFicha('nep-fluidos-sdra') } },
        ],
        lleva: ['El tiraje y un Vt muy alto son esfuerzo excesivo, y el alto flujo da la comodidad que lo baja.', 'Si el esfuerzo persiste con la cánula, se intuba antes que después.', 'Ni el balance positivo ni el déficit de volumen: se evitan los dos extremos.'],
        volver: { nombre: 'P-SILI', ancla: 'nep-psili', modelo: pv('p-sili', '🫁 El esfuerzo de Elvira') } },
      { id: 'c-snv-isidro', titulo: 'Isidro, 64 años: boca abajo', corto: 'Caso · Isidro (esteroide y prono)', sub: 'SDRA con P/F 120; metilprednisolona y 16 h en prono',
        paciente: { Edad: '64 años, varón', 'Peso y talla': '96 kg, 1,75 m (PBW 70,5 kg)', Motivo: 'neumonía bilateral con SDRA', Soporte: 'ventilado, PEEP 10, noradrenalina estable' },
        pasos: [
          { momento: 'Día 2', datos: { 'PaO₂/FiO₂': '120', PEEP: '10 cmH₂O', 'Vt (monitor)': '355 mL (5 mL/kg PBW)', 'Meseta (monitor)': '28,7 cmH₂O' }, nuevo: ['PaO₂/FiO₂', 'PEEP', 'Vt (monitor)', 'Meseta (monitor)'],
            pregunta: { id: 'snv-c5', tipo: 'test', fuente: 'nep-prono-cuando · nep-tabla-24-4', origen: ILU, modelo: pv('prono', '🫁 Isidro en supino'),
              enunciado: 'Isidro, ventilado con Vt bajo, tiene P/F 120 con PEEP 10 y consolidación posterior en el TC. ¿Qué propones?',
              opciones: [
                no('Seguir en supino y subir la PEEP, porque el prono es solo para quien respira solo', `En ventilados con P/F <150 y Vt bajo hay beneficio de supervivencia (${p(44)}).`),
                no('Pronar 8 horas, como se hace con los pacientes despiertos', `En ventilación mecánica se aconsejan al menos 16 h (${p(45)}); 8 h es la cifra del espontáneo.`),
                ok('Pronarlo, al menos 16 horas al día: cumple P/F <150 con Vt bajo')],
              explicacion: `Indicación de la Tabla 24.4: moderado-grave ventilado con ~6 mL/kg (${p(44)}); la duración, ≥16 h (${p(45)}). Cifras del monitor, ilustrativas.` + enFicha('nep-prono-cuando') } },
          { momento: 'Día 2 · esteroide', datos: { Inicio: 'primeras 72 h del SDRA', PBW: '70,5 kg' }, nuevo: ['Inicio'],
            pregunta: { id: 'snv-c6', tipo: 'test', fuente: 'nep-corticoides-sdra · nep-tabla-24-3', origen: 'ficha: 1 mg/kg de peso ideal; la cuenta, ilustrativa',
              enunciado: 'Decides metilprednisolona en las primeras 72 h. ¿Qué dosis diaria calculas?',
              opciones: [
                no('96 mg/día: 1 mg/kg de su peso real', `La ficha pide el peso corporal ideal (${p(43)}). Con el real le darías un 36 % más de esteroide.`),
                no('141 mg/día: 2 mg/kg de peso ideal', `Los 2 mg/kg son para el SDRA que persiste 7-14 días (${p(43)}).`),
                ok('70 mg/día: 1 mg/kg × 70,5 kg de PBW, en infusión continua')],
              explicacion: `1 mg/kg/día × 70,5 kg ≈ <span class="hl">70 mg/día</span>, 14 días con descenso lento (${p(43)}).` + enFicha('nep-tabla-24-3') } },
          { momento: 'Día 2 · plan de otro residente', datos: { 'Nota del R1': 'cuatro frases' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'snv-c7', tipo: 'error', fuente: 'nep-tabla-24-3 · nep-tabla-24-4', origen: ILU,
              enunciado: 'El residente anota el plan de Isidro. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Metilprednisolona 14 días, con descenso lento de la dosis.' },
                { t: 'Metilprednisolona 2 mg/kg desde hoy, porque es moderado-grave.', mal: true, c: `Los 2 mg/kg son la dosis de la fase tardía, con el SDRA persistente de 7-14 días; en las primeras 72 h es 1 mg/kg (${p(43)}).` },
                { t: 'Con noradrenalina no se puede pronar.', mal: true, c: `El uso de vasopresores no contraindica el prono si la situación está estable o mejorando (${p(45)}).` },
                { t: 'Reviso la glucemia con frecuencia por el esteroide.' }],
              explicacion: 'Dos errores: dar ya la dosis de la fase tardía y creer que los vasopresores contraindican el prono.',
              nota: 'La dosis de 2 mg/kg es la fila de la fase tardía de la Tabla 24.3.' + enFicha('nep-tabla-24-3') } },
          { momento: 'Día 3 · tras el giro', datos: { 'PaO₂/FiO₂': '120 → 180 a las 16 h', 'Cstat (monitor)': '13 → 17 mL/cmH₂O', 'Meseta (monitor)': '28,7 → 24,8 cmH₂O', '4 h en supino': 'P/F 175' }, nuevo: ['PaO₂/FiO₂', 'Cstat (monitor)', 'Meseta (monitor)', '4 h en supino'],
            pregunta: { id: 'snv-c8', tipo: 'test', fuente: 'nep-prono-como', origen: ILU, modelo: pv('prono', '🫁 Gira a Isidro 16 h y vuélvelo a supino'),
              enunciado: 'Tras 16 h boca abajo, el P/F es 180; vuelve a supino y 4 h después marca 175. ¿Qué haces?',
              opciones: [
                ok('No hace falta otra sesión: la mejoría persiste 4 h después'),
                no('Repetir 16 h cada día mientras dure el SDRA, por precaución', `Si la mejora persiste 4 h tras la sesión, ya no es necesario (${p(45)}). Cada giro suma riesgos de tubos, piel y plexo.`),
                no('Repetirla solo si el P/F cae a la mitad', `La ficha no da ese umbral (${p(45)}); el criterio es la persistencia a las 4 h.`)],
              explicacion: `Si la mejoría <span class="hl-verde">persiste 4 h después</span>, el prono ya no es necesario (${p(45)}). Cifras del monitor, ilustrativas.` + enFicha('nep-prono-como') } },
          { momento: 'Durante las 16 h', datos: { Vigilancia: 'tubos, piel, brazos' }, nuevo: ['Vigilancia'],
            pregunta: { id: 'snv-c9', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-prono-como', origen: 'ficha: las complicaciones',
              enunciado: 'Mientras Isidro está boca abajo, ¿qué complicaciones vigilas?',
              puntos: [
                `<span class="hl-rojo">Desplazamiento</span> del tubo endotraqueal y de los catéteres vasculares (${p(45)}).`,
                `Lesión del <span class="hl-azul">plexo braquial</span> y úlceras por presión (${p(45)}).`,
                `Malestar, vómitos y arritmias transitorias, en general infrecuentes (${p(45)}).`],
              explicacion: 'Son complicaciones generalmente infrecuentes; la fuente remite a un protocolo de la UCI.' + enFicha('nep-prono-como') } },
        ],
        lleva: ['P/F <150 con Vt bajo y consolidación posterior: prono, 16 h al día.', 'Metilprednisolona 1 mg/kg de peso ideal en las primeras 72 h, 14 días con descenso.', 'Si la mejoría persiste 4 h después de la sesión, no hace falta otra.'],
        volver: { nombre: 'Posición prono', ancla: 'nep-prono-como', modelo: pv('prono', '🫁 Isidro boca abajo') } },
    ],
    profundizar: [
      { id: 'nep-fig-24-4', titulo: 'Figura 24.4: el esquema del P-SILI' },
      { id: 'nep-hfno-sdra', titulo: 'El alto flujo y el aviso de la toxicidad del oxígeno' },
      { id: 'nep-tabla-24-3', titulo: 'Tabla 24.3: los tres regímenes de esteroide' },
      { id: 'nep-prono-cuando', titulo: 'Las preocupaciones sobre el prono (COVID y TC)' },
    ],
  },
};
