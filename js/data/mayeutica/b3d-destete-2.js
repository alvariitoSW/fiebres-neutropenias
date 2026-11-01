// Mayéutica del bloque 3D, G5: ficha 21 neumo-weaning-extubacion (caso de Benito, días 7-10). Marino cap. 30, págs. 55-61 del PDF
// caps27-30. Formato: cabecera de b1-fluidos.js. Las cifras del pulmón vivo en fuga-cuff (VT 410, VTe 330 con el edema, fuga 80;
// 200 sin edema) son las de la app (js/data/pulmon-vivo-data.js), ilustrativas; las de la Figura 30.5 (22 → 3 % y 8 → 4 %), cotejadas
// con la imagen del PDF (pág. 60). Las demás cifras de Benito son del caso (ilustrativo).

const PDF = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const WE = 'neumo-weaning-extubacion';
const pv = (estado, texto) => ({ pulmonVivo: estado, texto });
const cv = (estado, texto) => ({ capilarVivo: estado, texto });
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const ILU = 'ilustrativo: las cifras de Benito son del caso; la regla, de la ficha';

export const MAYEUTICA_DESTETE_2 = {
  [WE]: {
    entrada: 'El corazón causa el 40 % de los destetes fallidos y la ScvO₂ lo delata; no se extuba para descansar; y una fuga del manguito <110 mL pide esteroides desde 12 h antes y VNI al salir.',
    guia: [
      { id: 'ext-g1', corto: 'cuatro fuentes', tipo: 'test', fuente: 'nep-ext-cardiaca',
        enunciado: 'El paciente falla la prueba y sospechas el corazón. ¿Cuáles son las posibles fuentes de disfunción cardíaca en el destete?',
        opciones: [
          ok('Poscarga por presión negativa, PEEP oculta, menos distensibilidad e isquemia silente'),
          no('La PEEP alta del ventilador, la sobrecarga de volumen y la fibrilación auricular de novo', `Durante la prueba falla el paso a respirar solo: las fuentes son las presiones negativas, la PEEP oculta, la distensibilidad y la isquemia silente (${p(55)}).`),
          no('Una poscarga que baja con la presión negativa y un retorno venoso que sube con la PEEP oculta', `Es al revés: la presión negativa aumenta la poscarga del VI y la PEEP oculta reduce el retorno venoso (${p(55)}).`)],
        explicacion: `Cuatro fuentes: <span class="hl-azul">(a) presiones intratorácicas negativas, que aumentan la poscarga del VI; (b) PEEP oculta, que reduce el retorno venoso; (c) menor distensibilidad ventricular, por hiperinflación y PEEP oculta; (d) isquemia miocárdica silente</span> (${p(55)}).` + enFicha(WE, 'nep-ext-cardiaca') },
      { id: 'ext-g2', corto: 'corazón y diafragma', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-ext-cardiaca-efectos',
        enunciado: 'La disfunción cardíaca también baja la fuerza del diafragma. ¿Por qué un corazón que falla debilita al diafragma?',
        puntos: [
          `El diafragma, como el corazón, <span class="hl-azul">extrae el O₂ al máximo</span> en condiciones normales: no tiene reserva de extracción (${p(55)}-${p(56)}).`,
          `Por eso depende del <span class="hl-rojo">gasto cardíaco</span> para su aporte de O₂: si el gasto cae, su fuerza cae (${p(56)}).`],
        explicacion: `Efectos de la disfunción cardíaca: congestión pulmonar y menor fuerza contráctil del diafragma (${p(55)}-${p(56)}).` + enFicha(WE, 'nep-ext-cardiaca-efectos') },
      { id: 'ext-g3', corto: 'ScvO₂ en la prueba', tipo: 'test', fuente: 'nep-ext-scvo2 · nep-ext-catarteria · nep-ext-eco-cardiaca', modelo: cv('bajo-gasto', '🩸 Mira por qué cae la saturación venosa cuando baja el gasto'),
        enunciado: 'Repites pruebas que fallan y quieres confirmar el corazón. ¿Qué herramientas da la fuente y cómo se comporta la saturación venosa si el gasto cae?',
        opciones: [
          no('Solo el catéter de arteria pulmonar, y la saturación venosa sube al caer el gasto, porque la sangre tarda más en volver', `El catéter se usa raramente y no es la única herramienta; al caer el gasto sube la extracción y la saturación baja (${p(55)}-${p(56)}).`),
          no('La eco cardíaca y la ScvO₂, que sube en los ensayos fallidos de 61 a 71 %', `Descendió progresivamente de unos 61 a unos 51 % en los ensayos fallidos (${p(56)}).`),
          ok('Eco, catéter de arteria pulmonar o ScvO₂; la saturación baja porque el tejido extrae más cuando el gasto cae')],
        explicacion: `Menos gasto → más extracción periférica → menos saturación venosa. En el estudio, la SvO₂ se mantuvo en ~65-66 % en los ensayos exitosos y bajó de ~61 a ~51 % en los fallidos; <span class="hl-azul">la ScvO₂ imita a la SvO₂</span> (${p(56)}).` + enFicha(WE, 'nep-ext-scvo2') },
      { id: 'ext-g4', corto: 'manejo del corazón', tipo: 'error', fuente: 'nep-ext-manejo-cardiaco',
        enunciado: 'Un residente resume qué hacer si el corazón falla en la prueba. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'Con disfunción sistólica, la CPAP ayuda al gasto al cancelar la poscarga que sube con la presión negativa.' },
          { t: 'Hay que retirar la CPAP antes de extubar, porque impide la retirada de la ventilación.', mal: true, c: `La CPAP se da de forma no invasiva y no impide retirar la ventilación mecánica, incluida la extubación (${p(56)}).` },
          { t: 'Un diurético en todo destete fallido, incluido el del corazón derecho sin edema.', mal: true, c: `La diuresis es para el VI agrandado o el edema inducido por el destete; con insuficiencia derecha y sin edema se aconseja un uso juicioso (${p(56)}).` },
          { t: 'Con hipertensión asociada, nitroglicerina intravenosa titulada a la presión deseada.' }],
        explicacion: 'Dos errores: tratar la CPAP como obstáculo y diuretizar sin edema en el corazón derecho.' + enFicha(WE, 'nep-ext-manejo-cardiaco') },
      { id: 'ext-g5', corto: 'debilidad', tipo: 'test', fuente: 'nep-ext-debilidad',
        enunciado: 'La debilidad respiratoria está arriba en la lista de causas de dificultad para retirar la ventilación. ¿Qué fuentes cita la ficha?',
        opciones: [
          no('La ventilación mecánica cuando el paciente dispare las respiraciones, la neuromiopatía y el tratamiento con esteroides intravenosos', `La ventilación debilita al diafragma cuando no se le deja disparar, no cuando dispara (${p(57)}). Los esteroides no se citan como fuente.`),
          ok('La ventilación controlada, la neuromiopatía del crítico (sin tratamiento eficaz) y la falta de magnesio y fósforo'),
          no('Solo la neuromiopatía, que tiene tratamiento eficaz si se reconoce a tiempo', `La neuromiopatía a menudo se reconoce solo al fallar el destete y no hay tratamiento eficaz (${p(57)}).`)],
        explicacion: `<span class="hl-azul">Ventilación mecánica sin disparo del paciente</span>; <span class="hl-rojo">neuromiopatía de la enfermedad crítica</span> («no hay tratamiento eficaz»); y depleción de magnesio y fósforo, cuya relevancia clínica no está probada pero que se corrige (${p(57)}).` + enFicha(WE, 'nep-ext-debilidad') },
      { id: 'ext-g6', corto: 'PImax: umbral y límite', tipo: 'test', fuente: 'nep-ext-pimax',
        enunciado: 'Piensas medir la presión inspiratoria máxima. ¿Con qué umbral se amenaza la ventilación en reposo y qué limita su uso en la UCI?',
        opciones: [
          no('Cuando cae a −20 o −30 cmH₂O; se mide con facilidad, así que es el estudio de elección', `Su límite es que el paciente con fallo respiratorio agudo tiene dificultad para hacer la maniobra (${p(58)}).`),
          no('Cuando llega a −84 cmH₂O; la maniobra se hace igual en el paciente agudo', `−84 es el valor medio normal en mujeres; el umbral es −20 o −30, y la maniobra es difícil en el fallo agudo (${p(58)}).`),
          ok('Cuando cae a −20 o −30; el paciente agudo tiene dificultad para hacer la maniobra')],
        explicacion: `La ventilación en reposo se ve amenazada cuando la PImax <span class="hl-rojo">cae a −20 o −30 cmH₂O</span>, el umbral de éxito de la prueba (Tabla 30.1); pero el paciente agudo a menudo no sabe hacer el esfuerzo máximo contra la vía ocluida (${p(58)}).` + enFicha(WE, 'nep-ext-pimax') },
      { id: 'ext-g7', corto: 'eco del diafragma', tipo: 'test', fuente: 'nep-ext-eco-diafragma',
        enunciado: 'La ecografía mide el grosor y la excursión del diafragma. ¿Qué limita su uso para decidir el destete?',
        opciones: [
          ok('Faltan referencias estandarizadas y ecografistas, y su impacto en el destete no está claro'),
          no('Mide con poca precisión el grosor, por lo que no se ha propuesto para valorar la disfunción diafragmática', `Se ha propuesto justamente para medir la disfunción diafragmática en UCI; sus límites son la falta de referencias y de ecografistas (${p(58)}).`),
          no('Solo funciona en el paciente despierto y cooperador, que puede hacer un esfuerzo máximo', `La limitación citada es la falta de mediciones de referencia, la escasez de ecografistas y un impacto dudoso (${p(58)}).`)],
        explicacion: `<span class="hl-purpura">Sin mediciones de referencia, pocos ecografistas y un impacto sobre el destete que no está claro</span> (${p(58)}). El manejo de la debilidad se limita a fisioterapia y soporte general.` + enFicha(WE, 'nep-ext-eco-diafragma') },
      { id: 'ext-g8', corto: 'extubar para descansar', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-ext-extubacion',
        enunciado: 'Un paciente sufre algo de distrés en la prueba y piensas que quitar el tubo le aliviaría el trabajo. ¿Qué dice la fuente de extubar para reducir el trabajo respiratorio?',
        puntos: [
          `El trabajo respiratorio puede <span class="hl-rojo">aumentar tras extubar</span>: por una FR mayor o por respirar a través de una glotis estrechada (${p(58)}).`,
          `Antes de extubar se valoran la <span class="hl-azul">eliminación de secreciones</span> y el riesgo de <span class="hl-azul">edema laríngeo</span> sintomático (${p(58)}).`],
        explicacion: `La fuente es tajante: «la extubación nunca debería realizarse para reducir el trabajo respiratorio»; en quienes toleran la extubación ese aumento no es motivo de preocupación (${p(58)}).` + enFicha(WE, 'nep-ext-extubacion') },
      { id: 'ext-g9', corto: 'reflejos y tos', tipo: 'test', fuente: 'nep-ext-reflejos',
        enunciado: 'Antes de extubar quieres valorar la tos con un papel. ¿Cómo se hace y qué pasa si los reflejos están débiles?',
        opciones: [
          no('Papel a 10 cm del tubo; si la tos es débil, no se puede extubar', `El papel va a 1-2 cm del extremo del tubo, y un reflejo débil no impide necesariamente la extubación (${p(58)}).`),
          no('Papel a 1-2 cm del tubo; con reflejos ausentes se reintuba para proteger la vía aérea y se difiere la extubación varios días', `Un reflejo débil o ausente identifica riesgo de aspiración, pero no impide necesariamente extubar (${p(58)}).`),
          ok('Papel a 1-2 cm del tubo; el reflejo débil marca riesgo de aspiración, pero no impide extubar')],
        explicacion: `Papel a <span class="hl-azul">1-2 cm</span>; si aparece humedad, la tos es adecuada. Reflejos disminuidos: no impiden necesariamente la extubación, pero merecen atención a la <span class="hl-rojo">deglución post-extubación</span> (${p(58)}).` + enFicha(WE, 'nep-ext-reflejos') },
      { id: 'ext-g10', corto: 'edema laríngeo', tipo: 'test', fuente: 'nep-ext-edema',
        enunciado: '¿Con qué frecuencia el edema laríngeo es lo bastante grave como para reintubar, y qué factores lo favorecen?',
        opciones: [
          no('En el 30-40 %, sobre todo con tubos pequeños y extubaciones programadas', `La incidencia es del 1-10 %, y los factores son intubación difícil y prolongada, tubo grande y autoextubación no planificada (${p(59)}).`),
          ok('En el 1-10 %: intubación difícil o prolongada, tubo grande, autoextubación'),
          no('En menos del 1 %, y solo cuando la intubación fue breve y el tubo de pequeño calibre', `Es el 1-10 %, y los factores de riesgo son los contrarios: intubación prolongada y tubo grande (${p(59)}).`)],
        explicacion: `Incidencia de edema que obliga a reintubar: <span class="hl-azul">1-10 %</span>; factores: <span class="hl-rojo">intubación difícil y prolongada, tubo grande, autoextubación no planificada</span> (${p(59)}).` + enFicha(WE, 'nep-ext-edema') },
      { id: 'ext-g11', corto: 'la fuga de 80', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-cuff-prueba · nep-cuff-recomendacion', origen: 'ficha; las cifras del modelo, ilustrativas', modelo: pv('fuga-cuff', '🫁 Benito: manguito a 0, con y sin edema laríngeo'),
        enunciado: 'Ventilas en volumen control, desinflas el manguito y entran 410 mL pero salen 330. ¿Qué has medido y qué dice una fuga de 80 mL?',
        puntos: [
          `La <span class="hl-azul">fuga</span> es la diferencia entre el volumen inhalado y el exhalado con el manguito desinflado; se mide mejor en volumen control, donde el volumen de insuflación está fijado (${p(59)}).`,
          `Por debajo de 110 mL, el riesgo de edema laríngeo tras extubar se multiplica por <span class="hl-rojo">7</span> (${p(59)}).`],
        explicacion: `En la prueba, una fuga que no aparece sugiere obstrucción de la vía aérea superior; el corte es 110 mL (${p(59)}). En el modelo, Benito sin edema pierde ≈200 mL con el manguito a 0, y con edema 80 (ilustrativo).` + enFicha(WE, 'nep-cuff-prueba') },
      { id: 'ext-g12', corto: 'qué lograron los esteroides', tipo: 'test', fuente: 'nep-cuff-esteroides', origen: 'ficha: Figura 30.5, cotejada con la imagen del PDF',
        enunciado: 'En el estudio multicéntrico de la Figura 30.5, ¿qué pasó con el edema laríngeo y con la reintubación al pretratar con esteroide, frente a placebo?',
        opciones: [
          no('El edema pasó del 8 % al 4 % y la reintubación del 22 % al 3 %', `Están cambiados: el edema bajó del 22 al 3 % y la reintubación del 8 al 4 % (${p(60)}).`),
          no('El edema bajó del 22 al 3 %, pero la reintubación no cambió de forma significativa', `También la reintubación bajó, del 8 al 4 % (p=0,02) (${p(60)}).`),
          ok('El edema bajó del 22 al 3 % y la reintubación del 8 al 4 %')],
        explicacion: `Placebo (N=343) frente a esteroide (N=355): edema <span class="hl-verde">22 → 3 %</span> (p<0,001; una caída de 7 veces) y reintubación <span class="hl-verde">8 → 4 %</span> (p=0,02; un 50 % menos) (${p(59)}-${p(60)}).` + enFicha(WE, 'nep-cuff-esteroides') },
      { id: 'ext-g13', corto: 'VNI al extubar', tipo: 'test', fuente: 'nep-ext-vni',
        enunciado: 'Un paciente tiene alto riesgo de edema laríngeo. ¿Qué papel tiene la ventilación no invasiva tras extubarlo?',
        opciones: [
          ok('Reduce la reintubación si se pone inmediatamente tras la extubación en el paciente de alto riesgo'),
          no('Reduce la reintubación, pero solo cuando ya hay fallo respiratorio establecido tras extubar', `No se ha demostrado éxito parecido cuando el fallo respiratorio post-extubación ya está establecido, y entonces no se recomienda (${p(60)}).`),
          no('No aporta nada frente a la oxigenoterapia convencional en este paciente, y aumenta el trabajo respiratorio de la glotis estrechada', `Es eficaz para reducir la reintubación cuando se usa de inmediato en alto riesgo de edema laríngeo (${p(60)}).`)],
        explicacion: `La VNI <span class="hl-verde">inmediata</span> tras extubar a los pacientes de alto riesgo reduce la reintubación (${p(60)}).` + enFicha(WE, 'nep-ext-vni') },
      { id: 'ext-g14', corto: 'por qué inspiratorio', tipo: 'test', fuente: 'nep-cuff-estridor · nep-cuff-manejo',
        enunciado: 'Tras extubar a un paciente con edema laríngeo oyes un ruido que predomina al inspirar. ¿Por qué en la inspiración, y cuándo suele aparecer?',
        opciones: [
          no('Porque la obstrucción es intratorácica y se estrecha al inspirar; suele aparecer a las 24 horas', `La obstrucción laríngea es extratorácica, y el estridor aparece a los 30 minutos en la mayoría, con retrasos de hasta 2 horas (${p(60)}).`),
          ok('Porque la obstrucción es extratorácica y la inspiración la estrecha; a los 30 minutos y hasta 2 horas'),
          no('Porque la obstrucción es extratorácica y se estrecha al espirar; aparece en unos minutos', `Las vías extratorácicas se estrechan al inspirar; las intratorácicas lo hacen al espirar (${p(60)}).`)],
        explicacion: `Las presiones negativas de la inspiración se transmiten a las vías superiores fuera del tórax y las <span class="hl-azul">estrechan en la inspiración</span>; las intratorácicas se estrechan en la espiración. Evidente a los 30 minutos en la mayoría; retrasos de hasta 2 horas (observación del autor) (${p(60)}).` + enFicha(WE, 'nep-cuff-estridor') },
    ],
    examen: [
      { id: 'ext-e1', corto: 'frecuencia del corazón', tipo: 'test', fuente: 'nep-ext-cardiaca',
        enunciado: '¿En qué proporción de las pruebas de destete fallidas se ha identificado disfunción cardíaca?',
        opciones: [
          no('En el 10 %', `La cifra es el 40 %; con un 10 % se pasaría por alto el corazón en casi la mitad de los fallos (${p(55)}).`),
          ok('En el 40 %'),
          no('En el 70 %, la mayor parte de los fallos del destete', `La fuente da el 40 % de las pruebas fallidas (${p(55)}).`)],
        explicacion: `<span class="hl-rojo">El 40 %</span> de las pruebas de destete fallidas (${p(55)}).` + enFicha(WE, 'nep-ext-cardiaca') },
      { id: 'ext-e2', corto: 'fuga >110', tipo: 'test', fuente: 'nep-cuff-recomendacion', origen: 'ficha',
        enunciado: 'En un paciente con intubación prolongada, la fuga del manguito es mayor de 110 mL. ¿Qué se concluye?',
        opciones: [
          no('Que hay que dar esteroides igualmente y extubar a VNI, porque un solo dato no excluye el edema', `Con >110 mL el riesgo se descarta con cerca del 95 % de certeza y no hace falta nada más antes de extubar (${p(59)}).`),
          ok('Que descarta el edema con cerca del 95 % de certeza y no hace falta nada más'),
          no('Que el riesgo es de la mitad que con un valor <110 mL, y se pretrata con una dosis única', `No es un riesgo a la mitad: >110 mL lo elimina con cerca del 95 % de certeza (${p(59)}).`)],
        explicacion: `La fuga <span class="hl-verde">&gt;110 mL</span> descarta el edema con ~95 % de certeza y «nada más es necesario antes de la extubación» (${p(59)}). La prueba se reserva para los de alto riesgo.` + enFicha(WE, 'nep-cuff-recomendacion') },
      { id: 'ext-e3', corto: 'pauta del esteroide', tipo: 'test', fuente: 'nep-cuff-esteroides', origen: 'ficha',
        enunciado: 'Quieres pretratar con esteroide a un paciente de alto riesgo. ¿Cuál es la pauta del estudio y cuándo debe empezar?',
        opciones: [
          no('Metilprednisolona 20 mg intravenosos en una sola dosis, administrada justo al extubar al paciente', `La pauta es 20 mg cada 4 horas desde 12 horas antes; el efecto no está presente si se da cerca de la extubación (${p(59)}).`),
          no('Metilprednisolona 20 mg cada 4 horas, empezando 2 horas antes de la extubación planificada', `La primera dosis se da 12 horas antes: el pretratamiento debe empezar horas antes (${p(59)}).`),
          ok('Metilprednisolona IV 20 mg cada 4 h, con la primera dosis 12 h antes de la extubación')],
        explicacion: `<span class="hl-azul">20 mg IV cada 4 h, primera dosis 12 h antes</span>; «el efecto no está presente si los esteroides se administran cerca del momento de la extubación» (${p(59)}).` + enFicha(WE, 'nep-cuff-esteroides') },
      { id: 'ext-e4', corto: 'cuándo aparece el estridor', tipo: 'test', fuente: 'nep-cuff-estridor', origen: 'ficha',
        enunciado: '¿Con qué grado de obstrucción de la vía aérea superior se hace evidente por primera vez el estridor?',
        opciones: [
          ok('Cuando la obstrucción alcanza cerca del 50 %'),
          no('Con una obstrucción próxima al 90 %, ya casi completa', `El estridor aparece con cerca del 50 % de obstrucción, mucho antes de que sea completa (${p(60)}).`),
          no('Solo con obstrucciones del 20 % o menos, y desaparece al aumentar', `Se hace evidente por primera vez cuando la obstrucción alcanza cerca del 50 % (${p(60)}).`)],
        explicacion: `El estridor aparece «cuando la obstrucción alcanza <span class="hl-azul">cerca del 50 %</span>»; es audible sin estetoscopio y más evidente al inspirar (${p(60)}).` + enFicha(WE, 'nep-cuff-estridor') },
      { id: 'ext-e5', corto: 'PImax normal', tipo: 'test', fuente: 'nep-ext-pimax', origen: 'ficha',
        enunciado: '¿Qué valores medios de PImax se han reportado en adultos sanos?',
        opciones: [
          no('−84 cmH₂O en los hombres y −120 en las mujeres', `Está al revés: −120 en hombres y −84 en mujeres (${p(58)}).`),
          ok('−120 cmH₂O en los hombres y −84 en las mujeres'),
          no('−20 cmH₂O en los hombres y −30 en las mujeres, que son los valores que predicen éxito', `−20 y −30 son el umbral de amenaza para la ventilación en reposo, no los valores normales (${p(58)}).`)],
        explicacion: `Valores medios de <span class="hl-azul">−120 (varones) y −84 cmH₂O (mujeres)</span>; varían ampliamente (${p(58)}).` + enFicha(WE, 'nep-ext-pimax') },
      { id: 'ext-e6', corto: 'VNI con fallo establecido', tipo: 'test', fuente: 'nep-ext-vni', origen: 'ficha',
        enunciado: 'Un paciente extubado desarrolla fallo respiratorio horas después. ¿Qué recomienda la fuente sobre la VNI?',
        opciones: [
          no('Ponerla en cuanto aparece el fallo, porque la VNI reduce la reintubación en esa fase', `No se ha demostrado éxito parecido con el fallo ya establecido y no se recomienda (${p(60)}).`),
          ok('No se recomienda con el fallo ya establecido; es para el uso inmediato tras extubar en alto riesgo'),
          no('Ponerla solo si el fallo es hipercápnico, y además mantenerla hasta pasar a la tubuladura de oxígeno', `La fuente no distingue el tipo de fallo: con el fallo ya establecido no se recomienda (${p(60)}).`)],
        explicacion: `Eficaz «inmediatamente tras la extubación» en alto riesgo; «no se recomienda una vez se ha establecido el fallo respiratorio» (${p(60)}).` + enFicha(WE, 'nep-ext-vni') },
    ],
    casos: [
      { id: 'caso-ext-benito', titulo: 'Benito, días 7-10: el corazón y la extubación', corto: 'Benito, días 7-10', sub: 'El corazón en la prueba, la fuga del manguito y el estridor.',
        paciente: { Paciente: 'Benito, 71 años, 78 kg, 1,72 m (PBW 68 kg)', Antecedente: 'FEVI 35 %', Ingreso: 'Neumonía; día 7 de ventilación' },
        lleva: [
          'Una ScvO₂ que cae en la prueba señala al corazón: menos gasto, más extracción.' + enFicha(WE, 'nep-ext-scvo2'),
          'No se extuba para que descanse del tubo: el trabajo respiratorio puede subir tras extubar.' + enFicha(WE, 'nep-ext-extubacion'),
          'Una fuga <110 mL pide pretratar con esteroide desde 12 h antes y poner VNI al extubar.' + enFicha(WE, 'nep-cuff-recomendacion')],
        volver: { nombre: 'La fuga del manguito', ancla: 'nep-cuff-recomendacion', modelo: pv('fuga-cuff', '🫁 La fuga de Benito') },
        pasos: [
          { momento: 'Día 7 · tras el fracaso de la prueba', datos: { 'ScvO₂': '65 % al empezar → 52 % en la prueba', PA: '170/95 mmHg', Auscultación: 'crepitantes bilaterales' }, nuevo: ['ScvO₂', 'PA', 'Auscultación'],
            pregunta: { id: 'ext-c1', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-ext-scvo2 · nep-ext-cardiaca', origen: ILU, modelo: cv('bajo-gasto', '🩸 Menos gasto, más extracción, menos saturación venosa'),
              enunciado: 'Benito falla la prueba: la ScvO₂ cae de 65 a 52, la PA sube a 170/95 y hay crepitantes. ¿Qué ha fallado y por qué baja la ScvO₂?',
              puntos: [
                `Es el <span class="hl-rojo">corazón</span>: la disfunción cardíaca (FEVI 35 %) se desenmascara al pasar a respirar solo, y trae congestión pulmonar (${p(55)}).`,
                `Cae el gasto, los tejidos <span class="hl-azul">extraen más O₂</span> y la saturación venosa baja (${p(56)}).`],
              explicacion: `En los ensayos fallidos del estudio la SvO₂ descendió de ~61 a ~51 %; la ScvO₂ imita a la SvO₂ (${p(56)}). Las cifras de Benito son las del caso (ilustrativo).` + enFicha(WE, 'nep-ext-scvo2') } },
          { momento: 'Día 7 · el plan', datos: { Decisión: 'intervenir sobre el corazón antes de repetir' }, nuevo: ['Decisión'],
            pregunta: { id: 'ext-c2', tipo: 'test', fuente: 'nep-ext-manejo-cardiaco', origen: ILU,
              enunciado: 'Con hipertensión, crepitantes y FEVI de 35 %, ¿qué haces antes de la próxima prueba?',
              opciones: [
                ok('Nitroglicerina IV titulada a la presión y diuresis por el edema; la CPAP no impide extubar'),
                no('Sedarlo más profundo para que no luche con el respirador y repetir la prueba mañana con el mismo plan', `La sedación profunda retrasa el despertar y la retirada del ventilador, y no trata el corazón (${p(51)}).`),
                no('Extubarlo ya para aliviar el trabajo de respirar contra el tubo y vigilarlo en planta', `La extubación no se hace para reducir el trabajo respiratorio, que puede aumentar tras extubar (${p(58)}).`)],
              explicacion: `Si la disfunción cardíaca se asocia a hipertensión, la <span class="hl-verde">nitroglicerina IV</span> titulada ha logrado retirar pacientes del ventilador; con edema o VI agrandado, la <span class="hl-verde">diuresis</span>; la CPAP es no invasiva y no impide extubar (${p(56)}).` + enFicha(WE, 'nep-ext-manejo-cardiaco') } },
          { momento: 'Día 8 · el plan del residente', datos: { 'Nota del R1': 'cuatro frases' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'ext-c3', tipo: 'error', fuente: 'nep-ext-extubacion · nep-ext-pimax', origen: ILU,
              enunciado: 'El residente anota su plan para los próximos días. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Antes de extubar valoro cómo elimina las secreciones y el riesgo de edema laríngeo.' },
                { t: 'Si vuelve a sudar en la prueba, lo extubo para que descanse del tubo.', mal: true, c: `La extubación no se hace para reducir el trabajo respiratorio: puede aumentar tras extubar (${p(58)}).` },
                { t: 'Sin una PImax medida no se puede decidir el destete.', mal: true, c: `Los pacientes con fallo agudo a menudo no pueden hacer la maniobra, lo que limita el valor de la PImax en la UCI (${p(58)}).` },
                { t: 'Corrijo el magnesio y el fósforo si están bajos.' }],
              explicacion: 'Dos errores: extubar «para descansar» y exigir una PImax que el paciente agudo a menudo no puede hacer.' + enFicha(WE, 'nep-ext-extubacion') } },
          { momento: 'Día 9 · nueva prueba', datos: { Prueba: 'presión de soporte de 5, 2 horas', Vt: '340 mL (5,0 mL/kg PBW)', FR: '22 por minuto', 'FR/Vt': '≈65 rpm/L (con la calculadora)', 'ScvO₂': '66 %', PImax: '−30 cmH₂O' }, nuevo: ['Prueba', 'Vt', 'FR', 'FR/Vt', 'ScvO₂', 'PImax'],
            calculadora: { ir: 'neumo-sbt-vt', nombre: 'Predictores de éxito' },
            pregunta: { id: 'ext-c4', tipo: 'test', fuente: 'nep-sbt-tiempo · nep-ext-extubacion · nep-ext-reflejos', origen: ILU,
              enunciado: 'Benito completa 2 horas con esas cifras y la ScvO₂ se mantiene. ¿Extubas?',
              opciones: [
                no('Sí, ya: ha superado la prueba y no queda nada por valorar antes de retirarle el tubo', `Antes de extubar se valoran la capacidad de eliminar secreciones (tos) y el riesgo de edema laríngeo (${p(58)}).`),
                ok('Es candidato: cerca del 80 % de los que toleran 2 h se retiran; antes miras tos y fuga'),
                no('No: la prueba solo vale si dura más de 6 horas y hay que repetirla mañana mismo', `El tiempo asignado va de menos de 30 minutos a más de 2 horas; el 80 % se aplica a quien tolera 2 horas (${p(54)}).`)],
              explicacion: `Vt 5,0 mL/kg, FR 22 y ScvO₂ estable, sin la caída de antes. La mayoría (~80 %) de los que toleran 2 horas se retiran de forma permanente (${p(54)}); queda ver tos y reflejos (${p(58)}) y el riesgo de edema (${p(59)}).` + enFicha(WE, 'nep-ext-extubacion') } },
          { momento: 'Día 9 · prueba de fuga', datos: { Modo: 'volumen control, manguito desinflado', 'Vt inhalado': '410 mL', 'Vt exhalado (del modelo)': '330 mL', Fuga: '80 mL' }, nuevo: ['Modo', 'Vt inhalado', 'Vt exhalado (del modelo)', 'Fuga'],
            calculadora: { ir: 'neumo-fuga-volumen', nombre: 'Prueba de fuga del manguito' },
            pregunta: { id: 'ext-c5', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-cuff-recomendacion · nep-cuff-esteroides', origen: ILU, modelo: pv('fuga-cuff', '🫁 Benito: manguito a 0 con edema laríngeo, fuga de 80'),
              enunciado: 'Benito lleva siete días intubado y fuga de 80 mL. Piensas extubarlo mañana a las 9. ¿Qué haces?',
              puntos: [
                `La fuga está <span class="hl-rojo">por debajo de 110</span>: el riesgo de edema post-extubación es 7 veces mayor (${p(59)}).`,
                `<span class="hl-azul">Pretratas con esteroide</span> y la primera dosis, 12 horas antes: esta noche a las 21:00 (${p(59)}).`,
                `Al extubar, <span class="hl-azul">VNI inmediata</span> (${p(59)}-${p(60)}).`],
              explicacion: `La calculadora de la ficha da el mismo veredicto con 80 mL. Los esteroides dados cerca de la extubación no sirven, así que la extubación se programa tras las 12 horas (${p(59)}). La fuga de 80 es del modelo (ilustrativo).` + enFicha(WE, 'nep-cuff-recomendacion') } },
          { momento: 'Día 10 · giro: 40 minutos tras extubar', datos: { Situación: 'extubado a VNI, con el esteroide dado', Ruido: 'estridor inspiratorio', 'SpO₂': '88 %' }, nuevo: ['Situación', 'Ruido', 'SpO₂'],
            pregunta: { id: 'ext-c6', tipo: 'test', fuente: 'nep-cuff-manejo · nep-cuff-estridor', origen: ILU, modelo: pv('fuga-cuff', '🫁 Benito: extuba con edema y mira el estridor'),
              enunciado: 'A los 40 minutos de extubar, Benito tiene estridor inspiratorio y SpO₂ de 88 %. ¿Adrenalina nebulizada y esperar a ver?',
              opciones: [
                no('Sí: nebulizas adrenalina y observas una hora, porque es el tratamiento del edema laríngeo', `La adrenalina en aerosol es un tratamiento popular pero no probado, y la desaturación obliga a reintubar sin esperar (${p(60)}).`),
                ok('No: la desaturación manda reintubar de inmediato; esos tratamientos no están probados'),
                no('No: subes la FiO₂ y repites el esteroide intravenoso, y si no mejora en 2 horas, reintubas', `El esteroide tampoco está probado para tratar el edema ya establecido, y esperar dificulta restablecer una vía estable (${p(60)}).`)],
              explicacion: `Cualquier signo de fallo inminente (desaturación, respiración rápida) pide <span class="hl-rojo">reintubación inmediata</span>: el retraso complica asegurar la vía; «no hay tratamientos probados» (${p(60)}). Aun con esteroide, el edema persiste en ~3 % (${p(60)}).` + enFicha(WE, 'nep-cuff-manejo') } },
        ] },
    ],
    profundizar: [
      { id: 'nep-ext-retrasos', titulo: 'Evitar retrasos en la retirada' },
      { id: 'nep-cuff-estridor', titulo: 'Estridor: señal de obstrucción y su mecanismo' },
    ],
  },
};
