// Mayéutica de las fichas del bloque 2, grupo A · La sangre (Marino cap. 12, en Hematología → Merino HEMATO):
// ficha 1 merino-anemia, ficha 2 merino-transfusion y ficha 3 merino-riesgos. La pinta js/core/mayeutica.js (botón
// «Estudiar» del interruptor de cada ficha). Datos puros.
//
// Toda la medicina sale de la ficha (js/modules/merino-hemato/merino-hemato.html) y de su PDF
// (docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf, págs. 1-19); cada pregunta dice dónde con `fuente` (ids
// `mh-…` de la ficha). Los pacientes se inventan (lista del bloque: Fermín y Rocío) y sus cuentas se marcan con
// `origen`. Plan: autonomo/bloques/b2/cobertura.md §3.A y §6.
// Formato: el de b1-fluidos.js. Donde una pregunta se comprueba en un modelo vivo que ya existe va
// `modeloVivo: { capilarVivo: '<estado>' }`; `modelo` es la vista Visual de la ficha (el paso «Mira»).
// `modeloFuturo` es el estado del modelo que aún no existe (el capilar que compensa, sus lupas del tubo y del
// alvéolo): el motor no lo pinta; queda aquí para conectarlo cuando se construya.

// La vista Visual de una ficha de Merino HEMATO, como botón «modelo» (sale tras contestar).
const visual = (tab, texto) => ({ especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab, enVisual: '', texto });
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto de la ficha.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="home" data-view="merinoHemato" data-panel="panel-merino-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;

export const MAYEUTICA_SANGRE = {
  /* =================================================================================================
     Ficha 1 · Anemia en el paciente crítico (págs. 1-7)
     ================================================================================================= */
  'merino-anemia': {
    entrada: 'Por qué el hematocrito puede mentir, qué añade la UCI a la anemia, cómo la compensa el cuerpo y dónde está su límite.',
    guia: [
      { id: 'ane-g1', corto: 'una concentración', tipo: 'test', fuente: 'mh-anemia-definicion · mh-anemia-corte',
        enunciado: 'La anemia es «menos capacidad de la sangre para llevar O₂». Lo más exacto sería medir la masa eritrocitaria, pero usamos el Hto y la Hb. ¿Qué tienen de distinto, y por qué importa?',
        opciones: [
          { t: 'Miden la masa eritrocitaria, solo que más barato', porque: 'No la miden: reparten los hematíes en el volumen en que están. Si das por hecho que miden la masa, verás una «anemia» nueva tras cada litro de suero y transfundirás a quien no ha perdido un hematíe.' },
          { t: 'Son concentraciones: también los mueve el volumen de plasma', ok: true },
          { t: 'Son igual de exactos, pero salen antes', porque: 'No son igual de exactos: el plasma los cambia aunque la masa de hematíes no se mueva. Fiarse de ellos como de la masa eritrocitaria lleva a sobrestimar la anemia del crítico.' }],
        explicacion: 'La definición clínica (Hb <13 g/dl en varones y <12 en mujeres) <span class="hl">se basa en una concentración</span>: depende del volumen plasmático tanto como de la masa de hematíes.' },
      { id: 'ane-g2', corto: 'tumbarse', tipo: 'test', fuente: 'mh-trampa-volumen · mh-fig-12-1', modelo: visual('merino-anemia', '👁️ La Figura 12.1 en cifras (vista Visual)'), modeloFuturo: { capilarVivo: 'dilucion' },
        enunciado: 'Predice: un voluntario sano pasa de estar de pie a tumbado. Sin perder ni ganar sangre, ¿qué hace su hematocrito, y por qué?',
        opciones: [
          { t: 'No cambia: no ha perdido ni un hematíe', porque: 'Los hematíes no cambian, pero el plasma sí: al tumbarse gana unos 420 ml. Si esperas un Hto fijo, leerás como sangrado lo que es solo un cambio de postura.' },
          { t: 'Baja unos 4 puntos: entra líquido del intersticio al plasma', ok: true },
          { t: 'Sube: al tumbarse, la sangre se concentra en el tórax y el abdomen', porque: 'Es al revés: cae la presión hidrostática en los capilares de las piernas, el líquido intersticial vuelve a la sangre y la diluye. Esperar una subida te haría pasar por alto la dilución.' }],
        explicacion: 'Figura 12.1: de 41,8 a <span class="hl-rojo">37,7 %</span> (4,1 puntos). Sin el efecto de la gravedad cae la presión hidrostática en los capilares de las piernas, entra líquido intersticial y el plasma crece <span class="hl">420 ml</span>.' },
      { id: 'ane-g3', corto: 'el bolo', tipo: 'test', fuente: 'mh-trampa-volumen · mh-fig-12-1', modelo: visual('merino-anemia', '👁️ La Figura 12.1 en cifras (vista Visual)'), modeloFuturo: { capilarVivo: 'dilucion' },
        enunciado: 'Sigue la cadena: a otro sano le pasas un bolo de 20 ml/kg de salino isotónico. A los 90 min, su Hto ha bajado 4,2 puntos. ¿A qué pérdida de sangre «equivale» esa caída?',
        opciones: [
          { t: 'A ninguna: un bolo de salino no cambia el Hto', porque: 'Lo cambia: diluye la misma masa de hematíes en más plasma. Si no lo esperas, la Hb tras la reanimación te parecerá una hemorragia oculta y buscarás un sangrado que no existe.' },
          { t: 'A tanta sangre como suero se ha infundido', porque: 'La caída equivale a perder una unidad (500 ml), no al volumen infundido. Sobrestimarla tanto te llevaría a transfundir para «reponer» sangre que nunca se perdió.' },
          { t: 'A una unidad (500 ml), sin perder un hematíe', ok: true }],
        explicacion: 'Tumbarse y el bolo bajan el Hto lo que <span class="hl">perder una unidad de sangre (500 ml)</span>. En el crítico, con el plasma aumentado a menudo, el Hto y la Hb <span class="hl-rojo">sobreestiman la anemia</span>; y son la medida de todos los estudios de transfusión.' },
      { id: 'ane-g4', corto: 'la ferritina', tipo: 'test', fuente: 'mh-anemia-inflamacion',
        enunciado: 'Día 5 de UCI por una sepsis: Hb 9,5 g/dl, VCM 78 fl, hierro y transferrina bajos. ¿Qué dato separa una ferropenia de la anemia de la inflamación?',
        opciones: [
          { t: 'La transferrina: si está baja, es ferropenia', porque: 'En la anemia de la inflamación también bajan el hierro, la capacidad de fijación y la transferrina: pueden ser indistinguibles. Darías hierro a quien lo tiene secuestrado en los macrófagos.' },
          { t: 'La ferritina: por encima de 100 µg/l, inflamación', ok: true },
          { t: 'El VCM: una anemia microcítica es una ferropenia hasta que se demuestre lo contrario', porque: 'La inflamación también da una anemia hipocrómica microcítica, como la ferropenia. Por el VCM no las separas, y tratarías una ferropenia que no existe.' }],
        explicacion: 'La inflamación secuestra el hierro en los macrófagos (citocinas y <span class="hl-azul">hepcidina</span>): anemia microcítica con hierro, capacidad de fijación y transferrina bajos, como la ferropenia. La <span class="hl">ferritina</span> refleja los depósitos y las separa: <span class="hl-verde"><30 µg/l ferropenia</span>, <span class="hl-rojo">>100 µg/l inflamación</span>.' },
      { id: 'ane-g5', corto: 'la flebotomía', tipo: 'destapa', fuente: 'mh-anemia-flebotomia',
        enunciado: 'Tu paciente lleva una semana en la UCI y nadie lo ha visto sangrar. ¿Cuánta sangre le has quitado tú, y cómo lo reducirías? Son dos cosas.',
        puntos: [
          'De media <span class="hl">40-70 ml al día</span> en analíticas: hasta <span class="hl-rojo">500 ml (una unidad)</span> en una semana.',
          'Devolverle la primera muestra que se desecha al sacar por un catéter (unos 5 ml cada vez) reduce la flebotomía diaria <span class="hl-verde">a la mitad</span>.'],
        explicacion: 'Inflamación y flebotomía son las dos causas que la propia UCI añade a la anemia.' },
      { id: 'ane-g6', corto: 'el gasto', tipo: 'test', fuente: 'mh-anemia-compensacion · mh-viscosidad · mh-no-newtoniano · mh-fig-12-2',
        modeloVivo: { capilarVivo: 'anemia', texto: '🩸 El capilar con Hb 7,5 y el gasto fijo: lo que pasaría si el corazón no compensara' }, modelo: visual('merino-anemia', '👁️ La Figura 12.2 (vista Visual)'), modeloFuturo: { capilarVivo: 'anemia-compensada' },
        enunciado: 'Predice: baja la Hb a la mitad, con la volemia mantenida. ¿Qué hace el gasto cardíaco, y por qué?',
        opciones: [
          { t: 'Sube, pero solo en proporción a lo que cae el Hto', porque: 'Sube más que eso: la sangre es no newtoniana y su viscosidad baja al aumentar el flujo. Si esperas una subida proporcional, infravaloras cuánto compensa el corazón.' },
          { t: 'Sube más de lo que cae el Hto: la sangre es menos viscosa', ok: true },
          { t: 'No cambia: toda la compensación la hace la extracción de O₂', porque: 'La anemia desencadena dos respuestas: más extracción y más gasto. Si crees que el gasto no se mueve, con Hb 7,5 verás una extracción al límite que el cuerpo no tiene.' }],
        explicacion: 'La viscosidad depende sobre todo del Hto (Tabla 12.2) y, por Poiseuille, la resistencia es proporcional a la viscosidad. Como la sangre es <span class="hl-azul">no newtoniana</span> (a más flujo, menos viscosa), el gasto sube <span class="hl">más</span> de lo que cae el Hto: en la Figura 12.2, el Hto baja un 38 % y el gasto llega al 225 % del inicial.',
        nota: '<b>Nota de fidelidad.</b> La Figura 12.2 rotula «225 % de cambio en el gasto»; sus puntos van de unos 5,8 a 13 l/min: el gasto llega al 225 % del inicial (sube un 125 %). El capilar vivo, en su estado «anemia», mantiene el gasto fijo (la cuenta del capítulo de transporte de O₂): por eso su extracción llega al 50 %.' + enFicha('merino-anemia', 'mh-nota-fig-12-2') },
      { id: 'ane-g7', corto: 'el techo', tipo: 'test', fuente: 'mh-limite-compensacion · mh-fig-12-3',
        modeloVivo: { capilarVivo: 'umbral', texto: '🩸 El techo de la extracción (50 %) en el capilar, aquí alcanzado por bajo gasto' }, modelo: visual('merino-anemia', '👁️ La Figura 12.3 (vista Visual)'), modeloFuturo: { capilarVivo: 'techo-anemia' },
        enunciado: 'Predice: sigues bajando la Hb y mantienes la volemia. ¿Hasta dónde aguanta el consumo de O₂ (VO₂) de los tejidos?',
        opciones: [
          { t: 'Hasta una Hb de 7: por debajo, el VO₂ cae', porque: '7 g/dl es un umbral de transfusión de las guías, no el límite fisiológico. Si crees que los tejidos sufren ahí, transfundirás a pacientes que aún compensan de sobra.' },
          { t: 'Hasta un Hto del 10 % (Hb ≈3): la extracción llega al 50 %', ok: true },
          { t: 'Hasta que el aporte de O₂ (DO₂) empieza a caer, con un Hto de un 30 %', porque: 'El aporte cae desde el principio, pero la extracción sube y sostiene el VO₂. Poner ahí el límite es confundir que baje el aporte con que sufra el tejido.' }],
        explicacion: 'Figura 12.3 (primates): el DO₂ cae, pero la extracción sube y el VO₂ se mantiene <span class="hl">hasta un Hto del 10 % (Hb 3 g/dl)</span>. Ahí la extracción llega a su techo, <span class="hl-rojo">~50 %</span>: el VO₂ empieza a caer y sube el lactato. Ese 50 % podría servir de disparador de transfusión.' },
      { id: 'ane-g8', corto: 'qué lo permite', tipo: 'destapa', fuente: 'mh-tolerancia · mh-volumen-vs-celulas', modeloFuturo: { capilarVivo: 'anemia-hipovolemia' },
        enunciado: 'Ya sabes que se tolera una Hb muy baja. ¿Qué condición pone el libro, y qué lo muestra en personas? Son tres cosas.',
        puntos: [
          'Que se mantenga el <span class="hl">volumen intravascular</span>: así el gasto puede subir (en animales, un Hto del 5-10 % no daña la oxigenación).',
          'Testigos de Jehová posoperados (300): el <span class="hl">50 %</span> sobrevivió con Hb 2-3 y el <span class="hl">75 %</span> con Hb 3-4 g/dl.',
          'Voluntarios sanos con hemodilución hasta <span class="hl">Hb 5 g/dl</span>: sin daño aparente.'],
        explicacion: 'Según Marino, una Hb de hasta 5 g/dl parece segura, y algunos pacientes toleran 2-3. Es el puente con la ficha siguiente: <span class="hl-rojo">la hipovolemia causa shock; la anemia sola, no</span>.' },
    ],
    examen: [
      { id: 'ane-e1', corto: 'el corte', tipo: 'test', fuente: 'mh-anemia-corte · mh-tabla-12-1',
        enunciado: 'Varón de 58 años con Hb 13,2 g/dl. El laboratorio la marca como baja (rango 13,5-18). ¿Tiene anemia según la definición clínica?',
        opciones: [
          { t: 'Sí: está por debajo del rango de referencia', porque: 'El rango de referencia (Tabla 12.1) no es la definición de anemia. Etiquetarlo de anémico abre estudios y, en la UCI, transfusiones que no tocan.' },
          { t: 'No: la definición clínica en el varón es Hb <13 g/dl', ok: true },
          { t: 'Sí: en el varón, el corte clínico es Hb <13,5 g/dl (Hto <40 %)', porque: '13,5 es el límite inferior del rango normal, no el corte clínico (<13 g/dl, Hto <40 %). Confundirlos convierte en anemia lo que no lo es.' },
          { t: 'No: el corte en el varón es Hb <12', porque: 'Ese es el de la mujer. Con un corte de 12 dejarías sin diagnosticar a varones con Hb de 12-13, que sí tienen anemia por la definición.' }],
        explicacion: 'Definición clínica: <span class="hl-rojo">Hb <13 g/dl (Hto <40 %) en varones</span> y <12 (Hto <38 %) en mujeres. La Tabla 12.1 da rangos de referencia (13,5-18 en el varón), que son otra cosa.' },
      { id: 'ane-e2', corto: 'la viscosidad', tipo: 'test', fuente: 'mh-viscosidad · mh-tabla-12-2',
        enunciado: 'Con un hematocrito normal (45 %), ¿cuánto más viscosa es la sangre completa?',
        opciones: [
          { t: '~4 veces el plasma y ~3 veces el agua', porque: 'Están cruzadas: el plasma es solo algo más viscoso que el agua, así que la sangre es ~3 veces el plasma y ~4 veces el agua. Invertirlas es creer que el plasma es más fluido que el agua.' },
          { t: 'Unas 6 veces el agua: es lo que marca la Tabla 12.2', porque: '5,8 es la viscosidad relativa con un Hto del 60 %, no del 45 %. Con la cifra equivocada exageras cuánto cambia la resistencia con cada punto de Hto.' },
          { t: '~3 veces el plasma y ~4 veces el agua', ok: true }],
        explicacion: 'La del plasma (Hto 0) es solo algo mayor que la del agua (1,4); a un Hto del 45 %, la sangre es <span class="hl">~3 veces el plasma y ~4 veces el agua</span>. Por eso la sangre anémica fluye mucho más fácil.' },
      { id: 'ane-e3', corto: 'la Figura 12.2', tipo: 'test', fuente: 'mh-no-newtoniano · mh-fig-12-2', origen: 'ficha · lectura aproximada de la figura',
        enunciado: 'Figura 12.2: hemodilución isovolémica en un paciente con policitemia. El Hto baja un 38 % (de 60 a 37 %). ¿Qué hace el gasto cardíaco?',
        opciones: [
          { t: 'Sube un 38 %, igual que baja el Hto', porque: 'Sube mucho más: la sangre es no newtoniana y su viscosidad baja al aumentar el flujo. Con una subida proporcional subestimas la reserva del corazón para compensar la anemia.' },
          { t: 'Se multiplica por algo más de 2: de unos 6 a 13 l/min', ok: true },
          { t: 'Baja, porque llega menos O₂ al miocardio y el corazón falla', porque: 'Sube: menos viscosidad, menos resistencia (Poiseuille). Esperar que el corazón falle con la hemodilución te llevaría a transfundir por miedo a un bajo gasto que no aparece.' }],
        explicacion: 'De unos 5,8 a 13 l/min: el gasto <span class="hl">llega al 225 % del inicial</span>, mucho más de lo que cae el Hto, porque la sangre es <span class="hl-azul">no newtoniana</span>.',
        nota: '<b>Nota de fidelidad.</b> La figura rotula «225 % de cambio en el gasto»: es el gasto final respecto al inicial (×2,25), una subida del 125 %. La cuenta es de esta app, con la lectura aproximada de la figura.' + enFicha('merino-anemia', 'mh-nota-fig-12-2') },
      { id: 'ane-e4', corto: 'Testigos de Jehová', tipo: 'test', fuente: 'mh-tolerancia',
        enunciado: '300 posoperados Testigos de Jehová que rechazan la transfusión. ¿Qué supervivencia describe el estudio que cita Marino?',
        opciones: [
          { t: '75 % con Hb 2-3 g/dl y 50 % con Hb 3-4 g/dl', porque: 'Están cruzadas: con menos Hb, menos supervivencia (50 % con 2-3; 75 % con 3-4). Invertidas sugieren que bajar más la Hb protege, lo contrario de lo que pasa.' },
          { t: 'Nadie por debajo de 5 g/dl, el límite seguro', porque: 'Con 5 g/dl no hubo daño aparente en voluntarios sanos (otro estudio). En los Testigos de Jehová, la mitad sobrevivió con 2-3 g/dl: creer que nadie baja de 5 subestima cuánto se tolera.' },
          { t: '50 % con Hb 2-3 g/dl y 75 % con Hb 3-4 g/dl', ok: true }],
        explicacion: 'Carson 2002: <span class="hl">50 % con Hb 2-3</span> y <span class="hl">75 % con 3-4 g/dl</span>. En voluntarios sanos, Hb 5 sin daño. Conclusión del autor: hasta 5 g/dl parece seguro, y algunos toleran 2-3.' },
      { id: 'ane-e5', corto: 'la anemia de la UCI', tipo: 'test', fuente: 'mh-anemia-frecuencia · mh-anemia-transfusion-uci',
        enunciado: '¿Qué dice Marino de la anemia y la transfusión en la UCI?',
        opciones: [
          { t: 'Anemia en 2/3 al ingreso; la mitad de las transfusiones, por sangrado', porque: 'El 90 % de las transfusiones son para subir la Hb en pacientes que no sangran. Pensar que la mitad es por sangrado esconde que casi todas se deciden por un número.' },
          { t: 'Anemia en el 97 % a la semana; el 90 % de las transfusiones, sin sangrado', ok: true },
          { t: 'Anemia en la mitad a la semana; se transfunde a 2 de cada 3', porque: 'Mezcla cifras: el 97 % tiene anemia a la semana, y recibe hematíes hasta el 50 %. Así la anemia de la UCI parece rara cuando es casi universal.' },
          { t: 'Anemia rara al ingreso; casi todas se transfunden por sangrado', porque: 'Ya está en 2 de cada 3 al ingreso, y casi ninguna transfusión es por sangrado (el 90 %, sin él). Con esa idea no te preguntarías si cada transfusión hace falta.' }],
        explicacion: 'Casi universal: <span class="hl-rojo">2 de cada 3 al ingreso y el 97 % a la semana</span>. Hasta el 50 % recibe hematíes, y en el <span class="hl">90 %</span> de las transfusiones el motivo es subir la Hb sin sangrado.' },
      { id: 'ane-e6', corto: 'la nota del R2', tipo: 'error', fuente: 'mh-anemia-inflamacion · mh-trampa-volumen · mh-anemia-flebotomia · mh-umbrales-guias',
        enunciado: 'Nota de evolución de un R2 sobre la anemia de un paciente con sepsis, en el día 8. Encuentra los errores (puede no haber ninguno).',
        frases: [
          { t: 'Hb 8,4 g/dl sin signos de sangrado: anemia multifactorial de UCI.' },
          { t: 'Ferritina 480 µg/l con hierro y transferrina bajos: anemia de la inflamación, no ferropenia.' },
          { t: 'Parte de la caída de Hb puede ser dilucional: lleva un balance de +4 L desde el ingreso.' },
          { t: 'Le sacamos unos 50 ml de sangre al día: pido que se reinfunda la muestra que se desecha del catéter.' },
          { t: 'Sin cardiopatía isquémica y con Hb 8,4: no hay indicación de transfundir.' }],
        explicacion: 'Todo era cierto: aquí no había errores. Marcar una frase verdadera también cuenta como fallo.' },
    ],
    casos: [
      { id: 'h1', titulo: 'Fermín, 71 años: la Hb que bajó sin sangrar', corto: 'Caso · Fermín', sub: 'shock séptico por neumonía, 75 kg',
        paciente: { Edad: '71 años', Peso: '75 kg', Motivo: 'shock séptico por neumonía', Ingreso: 'Hto 39 %, Hb 12,9 g/dl' },
        pasos: [
          { momento: 'Urgencias · 90 min después', datos: { Fluidos: 'bolo de 1,5 L de cristaloide (20 ml/kg)', Hto: '39 % → 35 %', Hb: '12,9 → 11,6 g/dl', Sangrado: 'ninguno visible' }, nuevo: ['Fluidos', 'Hto', 'Hb', 'Sangrado'],
            pregunta: { id: 'h1-1', tipo: 'test', fuente: 'mh-trampa-volumen · mh-fig-12-1', origen: 'ficha · la cuenta, del caso', modeloFuturo: { capilarVivo: 'dilucion' },
              enunciado: 'El R1 de Urgencias escribe «caída de Hb: descartar sangrado oculto». Calcula y decide: ¿qué explica mejor esa caída de 4 puntos de Hto?',
              opciones: [
                { t: 'Un sangrado oculto de 1,5 L, lo mismo que el suero', porque: 'La caída no se corresponde con el suero infundido, y ni siquiera con un sangrado: un bolo de 20 ml/kg baja el Hto lo mismo sin perder un hematíe. Pedirías endoscopia y TC sin motivo.' },
                { t: 'La dilución: 20 ml/kg bajan el Hto unos 4 puntos sin perder sangre', ok: true },
                { t: 'Un sangrado de una unidad, que hay que buscar ya', porque: 'Es lo que «equivale» la caída, pero no es una pérdida: en la Figura 12.1 un bolo de 20 ml/kg bajó el Hto 4,2 puntos sin perder un hematíe. Buscarías una sangre que no falta.' }],
              explicacion: '75 kg × 20 ml/kg = 1,5 L. En la Figura 12.1, un bolo de 20 ml/kg bajó el Hto <span class="hl">4,2 puntos</span> a los 90 min, lo mismo que perder una unidad. Fermín baja 4 puntos: <span class="hl-azul">dilución</span>. El Hto y la Hb son concentraciones.' } },
          { momento: 'Día 1 · la nota del R1', datos: { Diagnóstico: '«anemia aguda posible por sangrado»' }, nuevo: ['Diagnóstico'],
            pregunta: { id: 'h1-2', tipo: 'error', fuente: 'mh-anemia-corte · mh-anemia-definicion · mh-trampa-volumen',
              enunciado: 'La nota del R1 de la mañana sobre la Hb de Fermín. Encuentra los errores (0, 1 o 2).',
              frases: [
                { t: 'Hb 11,6 g/dl: anemia por la definición clínica (<13 g/dl en el varón).' },
                { t: 'Ha bajado de 12,9 a 11,6 tras 1,5 L de cristaloide: probable sangrado de una unidad.', mal: true,
                  c: 'Una caída así tras 20 ml/kg es la que se espera por <span class="hl-azul">dilución</span> (Figura 12.1: 4,2 puntos de Hto), sin perder un hematíe.' },
                { t: 'El Hto y la Hb son concentraciones: dependen del volumen de plasma.' },
                { t: 'En el crítico tienden a sobreestimar la anemia, porque el plasma suele estar aumentado.' },
                { t: 'Para conocer la masa real de hematíes, el Hto es tan exacto como medir la masa eritrocitaria.', mal: true,
                  c: 'La medida más exacta es la <span class="hl">masa eritrocitaria</span> (hematíes marcados con cromo); el Hto es un sustituto que depende del plasma.' }],
              explicacion: 'Dos confusiones reales: leer como sangrado una dilución, y tomar una concentración por una masa.' } },
          { momento: 'Día 3', datos: { Hb: '9,8 g/dl', VCM: '79 fl', 'Hierro y transferrina': 'bajos', Ferritina: '610 µg/l' }, nuevo: ['Hb', 'VCM', 'Hierro y transferrina', 'Ferritina'],
            pregunta: { id: 'h1-3', tipo: 'test', fuente: 'mh-anemia-inflamacion',
              enunciado: 'Anemia microcítica con el hierro bajo. El R1 propone hierro intravenoso «por ferropenia». ¿Qué le dices?',
              opciones: [
                { t: 'Que sí: VCM bajo y hierro bajo son una ferropenia', porque: 'La inflamación da lo mismo: microcitosis con hierro, capacidad de fijación y transferrina bajos. Con una ferritina de 610 el hierro no falta: está secuestrado en los macrófagos.' },
                { t: 'Que no: con ferritina >100, es la anemia de la inflamación', ok: true },
                { t: 'Que sí, pero oral, porque la ferritina alta indica una ferropenia leve', porque: 'Una ferritina alta indica depósitos de hierro llenos, no una ferropenia: <30 µg/l es ferropenia y >100 µg/l, inflamación. El diagnóstico es otro.' }],
              explicacion: 'Ferritina <span class="hl-rojo">610 µg/l (>100)</span>: anemia de la inflamación. Las citocinas y la <span class="hl-azul">hepcidina</span> secuestran el hierro en los macrófagos; no llega a los hematíes en desarrollo.' } },
          { momento: 'Día 5', datos: { Analíticas: '~60 ml de sangre al día por el catéter arterial' }, nuevo: ['Analíticas'],
            pregunta: { id: 'h1-4', tipo: 'destapa', fuente: 'mh-anemia-flebotomia', origen: 'ficha · la cuenta, del caso',
              enunciado: 'La enfermera pregunta por qué Fermín sigue bajando la Hb si no sangra. Explícale qué le quitas y qué harías. Son dos cosas.',
              puntos: [
                'Con ~60 ml al día, en una semana le habremos sacado unos <span class="hl">420 ml</span>: casi una unidad (el libro: 40-70 ml al día, hasta 500 ml en una semana).',
                'Reinfundir la muestra que se desecha del catéter (unos 5 ml en cada extracción) reduce la flebotomía diaria <span class="hl-verde">a la mitad</span>.'],
              explicacion: '60 ml × 7 días = 420 ml. La flebotomía y la inflamación son las dos causas de anemia que añade la UCI.' } },
          { momento: 'Día 6', datos: { Hb: '7,6 g/dl', 'SpO₂': '97 %', 'ScvO₂': '72 %', Lactato: '1,4 mmol/l' }, nuevo: ['Hb', 'SpO₂', 'ScvO₂', 'Lactato'], calculadora: { ir: 'mar-dual-calc', nombre: 'Oximetría dual' },
            pregunta: { id: 'h1-5', tipo: 'test', fuente: 'mh-limite-compensacion · mh-techo-extraccion · mh-scvo2-disparador', origen: 'ficha · la cuenta, del caso', modeloFuturo: { capilarVivo: 'anemia-compensada' },
              enunciado: '«Con 7,6 de Hb sus tejidos estarán al límite», dice el estudiante. ¿Qué le contestas con los datos de Fermín?',
              opciones: [
                { t: 'Que sí: con Hb <8 la extracción ya está en el 50 %', porque: '97 − 72 = 25 %: lejos del 50 %, que en la Figura 12.3 llega con un Hto del 10 % (Hb ≈3). Si lo crees al límite, transfundirás a un tejido que compensa.' },
                { t: 'Extrae un 25 %: el techo del 50 % no llega hasta un Hto del 10 %', ok: true },
                { t: 'Que sí: el lactato lo confirma', porque: 'El lactato sube cuando el VO₂ empieza a caer, pasado el techo de la extracción; el de Fermín no ha subido. No hay señal de oxigenación tisular insuficiente.' }],
              explicacion: 'Extracción ≈ SaO₂ − ScvO₂ = 97 − 72 = <span class="hl-verde">25 %</span>. El techo (<span class="hl-rojo">50 %</span>) llega con un Hto del 10 % (Hb ≈3) si se mantiene la volemia: el gasto y la extracción compensan.' } },
        ],
        lleva: [
          'El Hto y la Hb son concentraciones: un bolo de 20 ml/kg los baja como perder una unidad, sin perder un hematíe.',
          'Ferritina >100 µg/l con hierro bajo: anemia de la inflamación, no ferropenia; y las analíticas quitan 40-70 ml al día.',
          'Con la volemia mantenida, la extracción no llega a su techo (50 %) hasta un Hto del 10 %.'],
        volver: { nombre: 'La trampa del volumen plasmático', ancla: 'mh-trampa-volumen', modelo: visual('merino-anemia', '👁️ Las Figuras 12.1 y 12.3 (vista Visual)'), modeloFuturo: { capilarVivo: 'dilucion' } } },
    ],
    profundizar: [
      { id: 'mh-tabla-12-1', titulo: 'Tabla 12.1: los rangos de referencia (VCM, recuento, reticulocitos, masa eritrocitaria)' },
      { id: 'mh-no-newtoniano', titulo: 'La sangre no newtoniana y la herida', nota: 'Lo que no entra en las preguntas: la lectura teleológica del autor sobre la herida.' },
    ],
  },

  /* =================================================================================================
     Ficha 2 · El umbral transfusional (págs. 7-11 y 16-17)
     ================================================================================================= */
  'merino-transfusion': {
    entrada: 'De dónde salen el 7 y el 8, por qué la Hb es un mal disparador, qué mirar en su lugar y qué hace de verdad una unidad de hematíes.',
    guia: [
      { id: 'trf-g1', corto: 'de 10 a 7', tipo: 'test', fuente: 'mh-umbral-historia',
        enunciado: 'En 1942 se fijó transfundir con Hb ≤10 g/dl, y así se hizo 60 años. ¿Qué cambió?',
        opciones: [
          { t: 'Faltaba sangre en los bancos y hubo que ahorrar', porque: 'Lo que movió el cambio fue la preocupación por los riesgos de transfundir, y luego los ensayos. Si crees que es solo logística, volverías a 10 cuando sobre sangre, sin beneficio.' },
          { t: 'Ensayos en que bajar a 7 no empeoró los resultados', ok: true },
          { t: 'Se vio que con Hb 7 se vivía más que con 10, también tras un infarto', porque: 'Los resultados fueron similares, no mejores: la ventaja de 7-8 es usar un 41 % menos de hematíes con el mismo resultado. Si crees que 7 «salva vidas», lo aplicarás donde la guía pide 8.' }],
        explicacion: 'La preocupación por los riesgos llevó a ensayos (Hébert 1999, Holst 2014) en que dejar bajar la Hb a <span class="hl">7 g/dl</span> no empeoró los resultados. En 48 estudios, 7-8 frente a 9-10: resultados similares (incluidos los eventos cardíacos) y <span class="hl-verde">41 % menos hematíes</span>.' },
      { id: 'trf-g2', corto: 'los umbrales', tipo: 'test', fuente: 'mh-umbrales-guias · mh-guias-cumplimiento', modelo: visual('merino-transfusion', '👁️ Los umbrales en una regla (vista Visual)'),
        enunciado: 'La mayoría de las 21 guías para el crítico que no sangra coinciden. ¿Qué umbral para quién?',
        opciones: [
          { t: '<7 para todos; <8 solo si sangra', porque: 'Las guías son para el crítico que no sangra; el <8 es para la cardiopatía isquémica y la cirugía cardíaca u ortopédica. Con <7 a todos, dejarías sin transfundir a un coronario con Hb 7,5.' },
          { t: '<7 estable sin coronariopatía; <8 con cardiopatía isquémica', ok: true },
          { t: '<8 para todos los críticos estables, y <7 solo en el shock séptico', porque: 'El shock séptico está en el grupo de <7, pero también el resto de críticos estables sin coronariopatía: con <8 para todos transfundirías de más.' }],
        explicacion: '<span class="hl">Hb <7</span>: crítico estable sin coronariopatía (incluye poscirugía cardíaca y shock séptico). <span class="hl">Hb <8</span>: cardiopatía isquémica, cirugía cardíaca u ortopédica. Se cumplen mal: el <span class="hl-rojo">60 %</span> de casi 5.000 transfusiones no siguió la guía.',
        nota: '<b>Nota de fidelidad.</b> La cirugía cardíaca sale en los dos grupos: «poscirugía cardíaca» en <7 y «cirugía cardíaca u ortopédica» en <8 (pág. 8). Marino no explica la diferencia.' + enFicha('merino-transfusion', 'merino-nota-hb-cirugia-cardiaca') },
      { id: 'trf-g3', corto: 'dos problemas', tipo: 'destapa', fuente: 'mh-hb-mal-disparador',
        enunciado: '«Si las guías ya dan un número de Hb, ¿para qué más?», pregunta el estudiante. ¿Qué dos problemas tiene la Hb como disparador? Son dos cosas.',
        puntos: [
          'No dice si la <span class="hl">oxigenación de los tejidos</span> es adecuada: se transfunde sin prueba de necesidad ni de beneficio.',
          'Una caída aguda puede ser solo <span class="hl-azul">dilución</span>: lleva a transfusiones innecesarias.'],
        explicacion: 'Por eso algunas guías proponen abandonar la Hb como disparador y usar medidas fisiológicas de la oxigenación tisular, como la extracción de O₂.' },
      { id: 'trf-g4', corto: 'medir la extracción', tipo: 'test', fuente: 'mh-extraccion-disparador',
        modeloVivo: { capilarVivo: 'dual', texto: '🩸 La oximetría doble en el capilar vivo' }, modeloFuturo: { capilarVivo: 'umbral-7' },
        enunciado: '¿Cómo medirías la extracción de O₂ a pie de cama, de forma continua, sin catéter de arteria pulmonar?',
        opciones: [
          { t: 'Con el lactato: si es normal, la extracción también', porque: 'El lactato sube cuando la extracción ya no compensa (pasado el 50 %); no la mide. Esperar al lactato es transfundir tarde.' },
          { t: 'Con la Hb: a menos Hb, más extracción, en la misma proporción', porque: 'La Hb no dice cuánto O₂ extraen los tejidos: es justo el problema del disparador por Hb. Seguirías transfundiendo por un número.' },
          { t: 'SaO₂ − ScvO₂: pulsioxímetro y catéter central de oximetría', ok: true }],
        explicacion: 'La extracción ≈ <span class="hl">SaO₂ − ScvO₂</span>, continua con pulsioximetría y un catéter venoso central «de oximetría». Disparador: <span class="hl-rojo">50 %</span>; si la SaO₂ es casi del 100 %, basta la ScvO₂ (<70 %). Pese a sus ventajas, han recibido poca atención.' },
      { id: 'trf-g5', corto: 'Hb 7', tipo: 'test', fuente: 'mh-limite-compensacion · mh-extraccion-disparador', origen: 'ficha · la posición es ilustrativa, de la forma de la Figura 12.3', modeloFuturo: { capilarVivo: 'umbral-7' },
        enunciado: 'Predice: Hb 7 g/dl, volemia normal, el corazón compensa. ¿Dónde está la extracción de O₂?',
        opciones: [
          { t: 'Ya en el 50 %: por eso se transfunde con 7', porque: 'El 50 % llega con un Hto del 10 % (Hb ≈3) en la Figura 12.3. El 7 es un umbral de las guías, no el techo fisiológico: verías hipoxia tisular donde no la hay.' },
          { t: 'Más alta que la normal, pero lejos del techo del 50 %', ok: true },
          { t: 'En su valor normal: con Hb 7 aún no hace falta extraer más', porque: 'Con menos Hb cae el aporte y la extracción sube para mantener el VO₂ (Figura 12.3). Si esperas una extracción normal, no entiendes cómo se compensa la anemia.' }],
        explicacion: 'En la Figura 12.3 la extracción sube a medida que baja el Hto y llega al 50 % con un Hto del 10 %. Con Hb 7 está entre medias: <span class="hl">el número de Hb no dice si el tejido sufre</span>; la extracción, sí.' },
      { id: 'trf-g6', corto: 'una unidad', tipo: 'test', fuente: 'mh-efecto-transfusion',
        enunciado: 'Una unidad de concentrado de hematíes en un adulto medio. ¿Cuánto esperas que suban la Hb y el Hto?',
        opciones: [
          { t: 'La Hb unos 3 g/dl y el Hto ~1 %', porque: 'Están cruzadas: ~1 g/dl de Hb y ~3 % de Hto. Esperarías una subida que no va a llegar y creerías que sangra.' },
          { t: 'La Hb ~1 g/dl y el Hto ~3 % por unidad', ok: true },
          { t: 'La Hb ~2 g/dl y el Hto ~6 %, si no sangra', porque: 'Es lo de dos unidades. Con esa expectativa, tras una sola verías «poca respuesta» y buscarías un sangrado o pedirías otra.' }],
        explicacion: 'En un adulto medio, 1 unidad: <span class="hl">Hb +1 g/dl y Hto +3 %</span>.' },
      { id: 'trf-g7', corto: 'el VO₂', tipo: 'test', fuente: 'mh-efecto-transfusion · mh-fig-12-4', modelo: visual('merino-transfusion', '👁️ La Figura 12.4 (vista Visual)'), modeloFuturo: { capilarVivo: 'transfusion' },
        enunciado: 'Predice: posoperados con Hb 6,4; con 1-2 unidades la Hb sube a 8 (un 25 %). ¿Qué pasa con el aporte (DO₂) y el consumo (VO₂) de O₂?',
        opciones: [
          { t: 'Suben los dos, un 25 %', porque: 'Sube el aporte, pero el consumo no cambia (Figura 12.4). Esperar más VO₂ es creer que la transfusión «oxigena» los tejidos, y no lo hace.' },
          { t: 'Sube el aporte; el consumo no cambia y cae la extracción', ok: true },
          { t: 'No se mueve ninguno: la Hb no cambia el aporte de O₂', porque: 'El aporte depende del contenido de O₂, y este de la Hb: subió en paralelo a ella. Lo que no cambia es el consumo.' }],
        explicacion: 'Figura 12.4: el DO₂ sube como la Hb, el <span class="hl-rojo">VO₂ no cambia</span>, así que la extracción baja (VO₂ = DO₂ × extracción): lo contrario que la anemia. Varios estudios lo confirman, y los hematíes almacenados mucho tiempo pueden incluso empeorar la oxigenación. Una guía: «no es un método absoluto para mejorar la oxigenación tisular».' },
      { id: 'trf-g8', corto: 'volumen o hematíes', tipo: 'destapa', fuente: 'mh-volumen-vs-celulas · mh-fig-12-6 · mh-tolerancia', modelo: visual('merino-transfusion', '👁️ La Figura 12.6 (vista Visual)'), modeloFuturo: { capilarVivo: 'anemia-hipovolemia' },
        enunciado: 'Si la transfusión no sube el VO₂ y se toleran Hb muy bajas, ¿qué sostiene de verdad la oxigenación de los tejidos? Son dos cosas.',
        puntos: [
          'El <span class="hl">volumen intravascular</span>: si se mantiene, el gasto sube y compensa la anemia, incluso extrema.',
          '<span class="hl-rojo">La hipovolemia es causa de shock; la anemia sola, no</span>: el volumen puede pesar más que la masa de hematíes («el volumen de sangre salva vidas», Figura 12.6).'],
        explicacion: 'Es el mensaje final del capítulo: subir la Hb se apoya en la creencia de que la anemia amenaza la oxigenación, y con la volemia mantenida no es así.' },
    ],
    examen: [
      { id: 'trf-e1', corto: 'la cirugía cardíaca', tipo: 'test', fuente: 'mh-umbrales-guias · merino-nota-hb-cirugia-cardiaca',
        enunciado: 'Posoperado de cirugía cardíaca, estable, sin coronariopatía conocida. Buscas su umbral de Hb en el texto de Marino sobre las guías. ¿Qué encuentras?',
        opciones: [
          { t: 'Solo en <8: toda cirugía cardíaca va con 8', porque: 'El texto lo pone también en <7 («incluye a los pacientes poscirugía cardíaca»). Si lo lees solo en un grupo, te pierdes que la fuente no lo aclara.' },
          { t: 'Que sale en los dos: en <7 («poscirugía cardíaca») y en <8', ok: true },
          { t: 'Solo en <7, porque la cirugía no cuenta como coronariopatía ni en el posoperatorio', porque: 'También aparece en <8 («pacientes sometidos a cirugía cardíaca u ortopédica»). Leer solo un grupo es elegir por tu cuenta lo que la fuente deja abierto.' }],
        explicacion: 'Marino (pág. 8) lo incluye en <span class="hl">Hb <7</span> («esto incluye a los pacientes poscirugía cardíaca y con shock séptico») y en <span class="hl">Hb <8</span> («cirugía cardíaca u ortopédica»).',
        nota: '<b>Nota: la fuente no lo dice.</b> Marino no explica por qué la cirugía cardíaca aparece en los dos umbrales; se reproducen los dos tal cual, sin elegir.' + enFicha('merino-transfusion', 'merino-nota-hb-cirugia-cardiaca') },
      { id: 'trf-e2', corto: 'la Tabla 12.4', tipo: 'test', fuente: 'mh-tabla-12-4 · mh-tiempo-infusion',
        enunciado: 'Una unidad de CH sin diluir, por gravedad, por un catéter periférico de 20 G. ¿Cuánto tarda, y qué haces en un paciente estable con anemia?',
        opciones: [
          { t: 'Unos 19 min: no hace falta diluir', porque: '19 min es diluida con 100 ml de salino. Sin diluir, por 20 G, tarda 117 min: con la cifra equivocada pensarías que el filtro se ha obstruido cuando todo va bien.' },
          { t: 'Casi 2 h (117 min): no hace falta diluir, se aconsejan 2 h', ok: true },
          { t: 'Casi 2 h: siempre se diluye con 100 ml de salino para que pase en 19 min', porque: 'Diluida pasa 6 veces más rápido, pero en el estable se recomiendan unas 2 h por unidad: la dilución probablemente no hace falta, y añade 100 ml sin motivo.' }],
        explicacion: 'Tabla 12.4: sin diluir, <span class="hl">117 min por 20 G y 70 por 18 G</span>; con 100 ml de salino, 19 y 12 min (6 veces más rápido). Tiempo recomendado en el estable: <span class="hl">2 h por unidad</span>.' },
      { id: 'trf-e3', corto: 'los lavados', tipo: 'test', fuente: 'mh-tabla-12-3 · mh-filtros',
        enunciado: 'Mujer con déficit de IgA que además tuvo una fiebre no hemolítica en una transfusión previa. Pides hematíes lavados. ¿Qué cubren?',
        opciones: [
          { t: 'Las dos cosas: el lavado quita el plasma y los leucocitos', porque: 'El salino quita el plasma residual, pero no elimina bien los leucocitos. Te quedarías tranquilo frente a una fiebre que el lavado no evita.' },
          { t: 'Solo la fiebre: el lavado quita los leucocitos', porque: 'Es al revés: quita el plasma (protege del déficit de IgA) y no los leucocitos. La dejarías expuesta a la anafilaxia que querías evitar.' },
          { t: 'El riesgo de anafilaxia por la IgA, no el de la fiebre', ok: true }],
        explicacion: 'Lavados: sin plasma residual, menos hipersensibilidad; indicados tras una reacción alérgica y en el déficit de IgA. <span class="hl-rojo">El lavado no quita bien los leucocitos</span>: eso lo hace la leucorreducción, indicada si hubo fiebre no hemolítica. Los filtros de 170-260 µm tampoco los retienen.' },
      { id: 'trf-e4', corto: 'el filtro', tipo: 'test', fuente: 'mh-filtros',
        enunciado: 'El filtro estándar de 170-260 micras de la transfusión. ¿Qué es cierto?',
        opciones: [
          { t: 'Es opcional y sirve para quitar leucocitos', porque: 'Es obligatorio para todo hemoderivado y no retiene leucocitos. Si confías en él para la leucorreducción, un paciente con fiebre previa recibirá leucocitos.' },
          { t: 'Obligatorio; retiene coágulos, no leucocitos', ok: true },
          { t: 'Retiene coágulos; si el flujo se hace lento, se diluye la bolsa con salino', porque: 'Un flujo lento con el filtro lleno de detritos es indicación de cambiar el filtro. Diluir no arregla un filtro colmatado.' }],
        explicacion: 'Poro de 170-260 µm, <span class="hl">obligatorio</span> para cualquier hemoderivado: retiene coágulos y detritos, <span class="hl-rojo">no leucocitos</span>. Si el flujo se enlentece al colmatarse, se cambia.' },
      { id: 'trf-e5', corto: '¿qué es peor?', tipo: 'test', fuente: 'mh-peor',
        enunciado: 'Una revisión de 45 estudios (272.596 críticos) sobre transfundir hematíes por anemia. ¿Qué encontró?',
        opciones: [
          { t: 'Beneficio neto en la mitad de los estudios', porque: 'Solo 1 de 45 mostró más beneficio que riesgo. Creer que la mitad se beneficia sostiene transfusiones que, en esa revisión, salen perdiendo.' },
          { t: 'Más riesgo que beneficio en 42 de 45; 17 de 18, peor supervivencia', ok: true },
          { t: 'Que es neutra: ni mejora ni empeora la supervivencia de los críticos', porque: 'De 18 estudios de supervivencia, 17 la señalan como factor de riesgo independiente de muerte. Tratarla como neutra quita peso a cada decisión de transfundir.' }],
        explicacion: 'En <span class="hl-rojo">42 de 45</span> estudios los riesgos superaron a los beneficios (solo 1 a favor); en <span class="hl-rojo">17 de 18</span>, la transfusión fue factor de riesgo independiente de muerte.' },
      { id: 'trf-e6', corto: 'el resumen', tipo: 'error', fuente: 'mh-guias-cumplimiento · mh-extraccion-disparador · mh-tabla-12-3 · mh-efecto-transfusion',
        enunciado: 'Resumen de un compañero para la sesión. Encuentra los errores (0, 1 o 2).',
        frases: [
          { t: 'De 21 guías, la mayoría coincide en Hb <7 y <8; en casi 5.000 transfusiones, el 60 % no las siguió.' },
          { t: 'Una extracción de O₂ del 50 % marca el umbral de oxigenación tisular comprometida.' },
          { t: 'Si la SaO₂ es casi del 100 %, se ha propuesto una ScvO₂ <70 % como disparador.' },
          { t: 'El concentrado de hematíes se guarda a temperatura ambiente hasta 42 días.', mal: true,
            c: 'Se guarda a <span class="hl">1-6 °C</span> hasta 42 días, con conservantes con adenina. A temperatura ambiente se guardan las plaquetas (unos 5 días).' },
          { t: 'Cuanto más tiempo almacenados, mejor oxigenan los hematíes al transfundirlos.', mal: true,
            c: 'Al revés: el almacenamiento prolongado puede <span class="hl-rojo">empeorar</span> la oxigenación tisular tras la transfusión.' }],
        explicacion: 'Dos confusiones reales: la temperatura de los hematíes (es la de las plaquetas) y el efecto del almacenamiento.' },
    ],
    casos: [
      { id: 'h1b', titulo: 'Fermín, día 6: ¿transfundir?', corto: 'Caso · Fermín, día 6', sub: 'shock séptico por neumonía, 75 kg',
        paciente: { Edad: '71 años', Peso: '75 kg', Motivo: 'shock séptico por neumonía; día 6 de UCI', Hb: '12,9 al ingreso → 7,6 g/dl hoy, sin sangrado' },
        pasos: [
          { momento: 'Día 6 · 08:00', datos: { 'SpO₂': '97 %', 'ScvO₂': '72 %', Lactato: '1,4 mmol/l', Noradrenalina: 'retirada ayer; PA 118/64 mmHg' }, nuevo: ['SpO₂', 'ScvO₂', 'Lactato', 'Noradrenalina'], calculadora: { ir: 'mar-dual-calc', nombre: 'Oximetría dual' },
            pregunta: { id: 'h1b-1', tipo: 'test', fuente: 'mh-umbrales-guias · mh-extraccion-disparador', origen: 'ficha · la cuenta, del caso',
              modeloVivo: { capilarVivo: 'dual', texto: '🩸 La oximetría doble en el capilar vivo' }, modeloFuturo: { capilarVivo: 'umbral-7' },
              enunciado: '¿Transfundes hoy? Mira el umbral y la extracción (SpO₂ − ScvO₂).',
              opciones: [
                { t: 'Sí: con Hb <8 se transfunde a todo crítico', porque: '<8 es para la cardiopatía isquémica y la cirugía cardíaca u ortopédica. En el shock séptico sin coronariopatía el umbral es <7: transfundirías sin necesidad, con todos sus riesgos.' },
                { t: 'No: Hb ≥7 en el shock séptico, y extrae ~25 %', ok: true },
                { t: 'Sí: la extracción ya está en el 50 % y el tejido sufre', porque: '97 − 72 = 25 %, lejos del techo del 50 %; y el lactato no ha subido. Leer mal la extracción te lleva a transfundir a un tejido que no está en déficit.' }],
              explicacion: 'Shock séptico sin cardiopatía isquémica conocida: umbral <span class="hl">Hb <7</span>. Extracción ≈ 97 − 72 = <span class="hl-verde">25 %</span>, lejos del 50 %.' } },
          { momento: 'Día 6 · 10:00 · el informe', datos: { Antecedentes: 'IAM con stent hace 3 años (informe que trae la hija)' }, nuevo: ['Antecedentes'],
            pregunta: { id: 'h1b-2', tipo: 'test', fuente: 'mh-umbrales-guias · mh-umbral-historia',
              enunciado: 'La hija trae un informe: infarto con stent hace 3 años. ¿Cambia tu decisión?',
              opciones: [
                { t: 'No: el umbral de 7 vale para todos los críticos estables', porque: 'Las guías separan a los pacientes con cardiopatía isquémica: para ellos es <8. Con Hb 7,6 dejarías sin transfundir a quien la guía sí lo indica.' },
                { t: 'Sí: cardiopatía isquémica, umbral <8; 1 unidad', ok: true },
                { t: 'Sí: con un stent coronario hay que mantener la Hb ≥10, el umbral clásico', porque: '≤10 fue el estándar desde 1942; luego se vio que 7-8 da los mismos resultados, incluidos los cardíacos, con un 41 % menos de hematíes. Subirlo a 10 gasta sangre sin beneficio.' }],
              explicacion: 'El giro: con <span class="hl">cardiopatía isquémica</span>, el umbral pasa de 7 a <span class="hl-rojo">8</span>. Con 7,6, una unidad.' } },
          { momento: 'Día 6 · 11:00', datos: { Vía: 'periférica de 18 G', Pedido: '1 concentrado de hematíes' }, nuevo: ['Vía', 'Pedido'],
            pregunta: { id: 'h1b-3', tipo: 'test', fuente: 'mh-tabla-12-4 · mh-tiempo-infusion',
              enunciado: 'La enfermera pregunta cuánto tardará por la 18 G y si la diluye con 100 ml de salino «para que pase antes». ¿Qué le contestas?',
              opciones: [
                { t: 'Unos 12 min sin diluir: el 18 G es grueso', porque: '12 min es diluida. Sin diluir, por 18 G, son unos 70 min; si esperas 12, pensarás que algo falla.' },
                { t: 'Unos 70 min sin diluir; mejor 2 h y sin diluir', ok: true },
                { t: 'Unos 70 min: que la diluya, así pasa en 12 min y acabamos antes', porque: 'Pasaría 6 veces más rápido, pero en el paciente estable se recomiendan unas 2 h por unidad: la dilución no hace falta y añade 100 ml sin motivo.' }],
              explicacion: 'Tabla 12.4: sin diluir, <span class="hl">70 min por 18 G</span> (117 por 20 G); diluida, 12 min. En el paciente estable se recomiendan <span class="hl">unas 2 h por unidad</span>: diluir para corregir una anemia probablemente no hace falta.' } },
          { momento: 'Día 6 · el plan del R1', datos: { Plan: 'escrito por el R1 de guardia' }, nuevo: ['Plan'],
            pregunta: { id: 'h1b-4', tipo: 'error', fuente: 'mh-umbrales-guias · mh-umbral-historia · mh-efecto-transfusion · mh-tiempo-infusion',
              enunciado: 'El plan del R1 para Fermín. Encuentra los errores (0, 1 o 2).',
              frases: [
                { t: 'Transfundo 1 CH: Hb <8 por su cardiopatía isquémica.' },
                { t: 'El objetivo es llegar a una Hb de 10, el umbral clásico.', mal: true,
                  c: 'Su umbral es <span class="hl">8</span>. El ≤10 de 1942 se abandonó: 7-8 dio los mismos resultados, incluidos los cardíacos, con un 41 % menos de hematíes.' },
                { t: 'Cada unidad le subirá la Hb ~1 g/dl y el Hto ~3 %.' },
                { t: 'Pasará en unas 2 h por la vía de 18 G, sin diluir.' },
                { t: 'Así mejorará la oxigenación de sus tejidos.', mal: true,
                  c: 'Subirá el aporte (DO₂), pero en la Figura 12.4 el consumo (VO₂) no cambió: la transfusión <span class="hl-rojo">no es un método absoluto</span> para mejorar la oxigenación tisular.' }],
              explicacion: 'Dos ideas que la ficha desmonta: el objetivo de 10 y que transfundir oxigena los tejidos.' } },
          { momento: 'Día 7', datos: { Hb: '8,5 g/dl', 'ScvO₂': '76 %' }, nuevo: ['Hb', 'ScvO₂'],
            pregunta: { id: 'h1b-5', tipo: 'destapa', fuente: 'mh-efecto-transfusion · mh-fig-12-4', origen: 'ficha · la cuenta, del caso', modelo: visual('merino-transfusion', '👁️ La Figura 12.4 (vista Visual)'), modeloFuturo: { capilarVivo: 'transfusion' },
              enunciado: 'El adjunto pregunta: «¿ha mejorado la oxigenación de los tejidos de Fermín?». Contéstale. Son tres cosas.',
              puntos: [
                'Ha subido el <span class="hl">aporte de O₂ (DO₂)</span>: tiene más Hb (7,6 → 8,5, lo esperado de una unidad).',
                'La extracción ha bajado (97 − 76 = <span class="hl">21 %</span>): es lo que hace la transfusión, al revés que la anemia.',
                'El <span class="hl-rojo">consumo (VO₂) no cambia</span> (Figura 12.4): no es un método absoluto para mejorar la oxigenación tisular.'],
              explicacion: 'VO₂ = DO₂ × extracción: si sube el aporte y el consumo no cambia, cae la extracción.' } },
        ],
        lleva: [
          'Umbral 7 en el crítico estable; 8 si hay cardiopatía isquémica: el antecedente cambia la decisión.',
          'La extracción (SaO₂ − ScvO₂) dice si el tejido sufre; la Hb, no.',
          'Una unidad sube la Hb ~1 g/dl y el aporte de O₂, no el consumo; en el estable, 2 h y sin diluir.'],
        volver: { nombre: 'Umbrales actuales de las guías', ancla: 'mh-umbrales-guias', modelo: visual('merino-transfusion', '👁️ Los umbrales en una regla (vista Visual)'), modeloVivo: { capilarVivo: 'dual' }, modeloFuturo: { capilarVivo: 'transfusion' } } },
    ],
    profundizar: [
      { id: 'mh-componentes', titulo: 'La sangre se fracciona en componentes' },
      { id: 'merino-nota-plasma-residual', titulo: 'El plasma residual de cada unidad: dos cifras' },
    ],
  },

  /* =================================================================================================
     Ficha 3 · Riesgos de la transfusión (págs. 11-16)
     ================================================================================================= */
  'merino-riesgos': {
    entrada: 'Qué es de verdad lo frecuente, qué hacer en los primeros minutos, el reloj de las reacciones y cómo separar el TRALI del TACO.',
    guia: [
      { id: 'rsg-g1', corto: 'VIH o error', tipo: 'test', fuente: 'mh-tabla-12-5', modelo: visual('merino-riesgos', '👁️ Las frecuencias en una escala (vista Visual)'),
        enunciado: 'Tabla 12.5: al transfundir una unidad, ¿qué es más probable, contagiar un VIH o ponérsela al paciente equivocado?',
        opciones: [
          { t: 'El VIH: es el riesgo más temido', porque: 'Es el más temido, no el más probable: 1:1,5 millones. Si vigilas el contagio y no la identificación, se te escapa lo que de verdad pasa.' },
          { t: 'El paciente equivocado: 1:15.000 frente a 1:1,5 millones', ok: true },
          { t: 'Los dos por igual, unos 1:500.000 cada uno, porque ambos son raros', porque: '1:500.000 es la transmisión bacteriana. El VIH es 1:1,5 millones y el error de paciente 1:15.000: cien veces más frecuente.' }],
        explicacion: '<span class="hl-rojo">Los errores de transfusión son mucho más frecuentes que la temida transmisión de infecciones</span>: paciente equivocado 1:15.000, unidad incompatible 1:33.000; VIH y hepatitis C 1:1,5 millones.' },
      { id: 'rsg-g2', corto: 'los 5 minutos', tipo: 'test', fuente: 'mh-hemolitica', modelo: visual('merino-riesgos', '👁️ El reloj de la transfusión (vista Visual)'),
        enunciado: 'A los 5 min de empezar una unidad: fiebre, disnea, dolor lumbar y PA 82/46. ¿Qué haces primero, y por qué con prisa?',
        opciones: [
          { t: 'Bajar el ritmo y dar un antihistamínico', porque: 'Es una reacción hemolítica aguda, no una alergia leve: seguir pasando sangre aumenta el daño, porque la gravedad depende del volumen transfundido.' },
          { t: 'Terminar la bolsa y pedir después el Coombs directo', porque: 'La gravedad de la reacción hemolítica depende del volumen transfundido: cada mililitro más la empeora. El Coombs se pide, pero después de parar.' },
          { t: 'Parar ya y comprobar bolsa y paciente', ok: true }],
        explicacion: 'Reacción hemolítica aguda (minutos tras empezar). <span class="hl-rojo">Parar</span> y comprobar que la sangre correcta va al paciente correcto: la gravedad depende del volumen. Si la sangre es la correcta, es improbable; aun así, el banco pide Hb libre en plasma y Coombs directo. Soporte: volumen, vasopresores y ventilación.' },
      { id: 'rsg-g3', corto: 'fiebre a las 3 h', tipo: 'test', fuente: 'mh-fiebre-nh',
        enunciado: 'A las 3 h de empezar una unidad, 38,4 °C (1,4 °C más que antes), con escalofríos, sin hipotensión ni disnea. ¿Qué es lo más probable, y cómo lo confirmas?',
        opciones: [
          { t: 'Fiebre no hemolítica: se confirma excluyendo hemólisis', ok: true },
          { t: 'Hemolítica: la fiebre es su primer signo', porque: 'La de la hemolítica aparece en minutos, con dolor e hipotensión. La no hemolítica no suele salir en la primera hora y puede llegar hasta las 6 h.' },
          { t: 'Un TRALI, porque aparece con fiebre dentro de las primeras 6 h', porque: 'El TRALI es un fallo respiratorio hipoxémico; una fiebre sin disnea ni hipoxemia no lo sugiere.' }],
        explicacion: 'Subida <span class="hl-purpura">>1 °C durante o hasta 6 h después</span>, sin otra causa. Se actúa como en la hemolítica (parar y verificar) y se confirma <span class="hl">excluyendo hemólisis</span>; el banco hace un Gram de la sangre del donante. <span class="hl-verde">>75 % no recurre</span>; si recurre, leucorreducidos.' },
      { id: 'rsg-g4', corto: 'la urticaria', tipo: 'test', fuente: 'mh-hipersensibilidad',
        enunciado: 'Habones en el tronco a mitad de la unidad, sin fiebre ni disnea. ¿Qué dice el libro?',
        opciones: [
          { t: 'No obliga a parar; lo habitual: pausa y difenhidramina', ok: true },
          { t: 'Parar del todo y no volver a transfundir', porque: 'Eso es tras una anafilaxia. Una urticaria leve sin fiebre ni siquiera obliga a interrumpir: le negarías una transfusión indicada.' },
          { t: 'Seguir sin hacer nada: unos habones sin fiebre no son ninguna reacción', porque: 'Es una reacción de hipersensibilidad, la más común (1:100). No obliga a parar, pero se alivia, y las siguientes irán con hematíes lavados.' }],
        explicacion: 'Urticaria leve sin fiebre: no obliga a interrumpir; la práctica habitual es parar un rato y dar <span class="hl">difenhidramina 25-50 mg</span> VO, IM o IV. En adelante, hematíes <span class="hl">lavados</span>, y estudiar un déficit de IgA. Disnea y sibilancias bruscas: anafilaxia, parar ya.' },
      { id: 'rsg-g5', corto: 'el TRALI', tipo: 'test', fuente: 'mh-trali · mh-fig-12-5', modelo: visual('merino-riesgos', '👁️ La radiografía del TRALI (vista Visual)'), modeloFuturo: { capilarVivo: 'trali' },
        enunciado: 'Predice: en el TRALI, ¿de quién son los anticuerpos y dónde se quedan las células que activan?',
        opciones: [
          { t: 'Del receptor; los hematíes se rompen en el pulmón', porque: 'Eso mezcla la hemolítica con el TRALI. En el TRALI, los anticuerpos vienen del donante y activan los neutrófilos del receptor, no rompen hematíes.' },
          { t: 'Del donante; los neutrófilos activados se quedan en los capilares del pulmón', ok: true },
          { t: 'No hay anticuerpos: es agua que entra por presión', porque: 'Eso es el TACO (edema hidrostático). En el TRALI, el 80 % se debe a anticuerpos del donante; en ~20 % no los hay, pero el agente no se conoce.' }],
        explicacion: 'En el <span class="hl">80 %</span>, anticuerpos <span class="hl-azul">del donante</span> contra antígenos de los neutrófilos del receptor: se activan, quedan secuestrados en los capilares pulmonares y migran al pulmón, donde lo inflaman. Radiografía como la del SDRA (Figura 12.5).' },
      { id: 'rsg-g6', corto: 'el TACO', tipo: 'test', fuente: 'mh-taco', modeloFuturo: { capilarVivo: 'taco' },
        enunciado: '¿Y en el TACO? ¿Qué llena el alvéolo, y qué paciente lo sufre más?',
        opciones: [
          { t: 'Neutrófilos; el que recibe muchas unidades', porque: 'Los neutrófilos son del TRALI. El TACO es un edema hidrostático, y no se correlaciona con el número de unidades.' },
          { t: 'Agua por presión; quien recibe más unidades, porque depende del volumen', porque: 'No hay correlación con el número de unidades: pueden intervenir otros factores además del volumen. Fiarte de «solo una unidad» te hará bajar la guardia.' },
          { t: 'Agua por presión; el que tiene insuficiencia cardíaca o renal', ok: true }],
        explicacion: 'Edema pulmonar <span class="hl">hidrostático</span> en las primeras 6 h, más frecuente con <span class="hl">insuficiencia cardíaca o renal previas</span>, propensos a la sobrecarga. <span class="hl-azul">No se correlaciona con el número de unidades.</span>' },
      { id: 'rsg-g7', corto: 'TRALI o TACO', tipo: 'destapa', fuente: 'mh-taco · mh-trali', modeloFuturo: [{ capilarVivo: 'trali' }, { capilarVivo: 'taco' }],
        enunciado: 'Disnea e hipoxemia a las 2 h de una transfusión, con infiltrados bilaterales. ¿Qué te inclina hacia uno u otro? Son tres cosas.',
        puntos: [
          'Hacia el TACO: <span class="hl">insuficiencia cardíaca o renal previas</span> y sobrecarga de volumen evidente.',
          'Hacia el TRALI: <span class="hl-azul">inflamación sistémica (PCR alta)</span>, sin insuficiencia cardíaca ni sobrecarga.',
          'La <span class="hl-rojo">fiebre no los separa</span>: es frecuente en el TRALI y aparece en el 30 % de los TACO.'],
        explicacion: 'En los dos: parar si no ha terminado y avisar al banco. En el TACO, diurético de asa IV; en ambos, soporte (ventilación si hace falta).' },
      { id: 'rsg-g8', corto: 'la infección', tipo: 'test', fuente: 'mh-nosocomiales',
        enunciado: '¿Qué relación hay entre la transfusión de hematíes y la infección nosocomial?',
        opciones: [
          { t: 'Ninguna: los transfundidos solo están más graves', porque: 'Puede influir, pero al menos 22 estudios la señalan como factor de riesgo independiente. Si la descartas, no ahorrarás transfusiones por este motivo.' },
          { t: 'Más riesgo cuanto más volumen y más tiempo guardada', ok: true },
          { t: 'Solo si la bolsa lleva bacterias, lo que pasa 1 vez de cada 500.000', porque: 'Eso es la transmisión bacteriana. La infección nosocomial viene del efecto inmunosupresor de la transfusión.' }],
        explicacion: 'El efecto inmunosupresor de la transfusión se conoce desde los años 70. El riesgo de infección nosocomial <span class="hl">crece con el volumen transfundido y con el tiempo de almacenamiento</span>; al menos 22 estudios: <span class="hl-rojo">factor de riesgo independiente</span>.' },
    ],
    examen: [
      { id: 'rsg-e1', corto: '¿de quién?', tipo: 'test', fuente: 'mh-hemolitica · mh-pfc-riesgos',
        enunciado: 'Reacción hemolítica aguda por una unidad de hematíes ABO-incompatible. ¿De quién son los anticuerpos, y contra qué?',
        opciones: [
          { t: 'Del donante, contra los hematíes del receptor', porque: 'Eso pasa con el plasma (PFC): anti-A y anti-B del donante contra los hematíes del receptor. Con hematíes es al revés: el receptor ataca lo que entra.' },
          { t: 'Del receptor, contra el ABO de los hematíes del donante', ok: true },
          { t: 'Del donante, contra los neutrófilos del receptor, que se quedan en el pulmón', porque: 'Ese es el TRALI. Confundirlos lleva a manejar como hemólisis una lesión pulmonar inflamatoria.' }],
        explicacion: 'Con hematíes, los anticuerpos <span class="hl-azul">del receptor</span> se unen a los antígenos ABO de los hematíes del donante; su lisis desencadena una respuesta inflamatoria sistémica. Con el plasma, al revés: <span class="hl-azul">del donante</span> contra el receptor (ficha 6).' },
      { id: 'rsg-e2', corto: 'TRALI y TACO', tipo: 'test', fuente: 'mh-trali · mh-taco · mh-tabla-12-5',
        enunciado: 'TRALI frente a TACO. ¿Qué pareja de cifras es la correcta?',
        opciones: [
          { t: 'TRALI ~1 % y mortalidad del 20 %; TACO 1:12.000 y ~50 %', porque: 'Están invertidas. El TRALI es raro y muy letal; el TACO, más frecuente y algo menos letal. Con las cifras al revés subestimarías al TACO, que es la complicación pulmonar más frecuente.' },
          { t: 'TRALI 1:12.000 y ~50 %; TACO ~1 % y 20 %', ok: true },
          { t: 'Los dos ~1 %, con mortalidad del 50 %', porque: 'El TRALI es 1:12.000 por unidad, no un 1 %; y la mortalidad del TACO es del 20 %. Igualarlos borra la diferencia que orienta la vigilancia.' }],
        explicacion: 'TRALI: raro (<span class="hl">1:12.000</span>), pero 1.ª causa de muerte por transfusión, <span class="hl-rojo">~50 %</span>. TACO: la complicación pulmonar más frecuente (<span class="hl">~1 %</span>; 1:100 por receptor en la Tabla 12.5, nota †), mortalidad <span class="hl-rojo">20 %</span>, ventilación mecánica en 3 de cada 4.' },
      { id: 'rsg-e3', corto: 'qué fiebre', tipo: 'test', fuente: 'mh-fiebre-nh · mh-hemolitica',
        enunciado: 'Tres fiebres durante una transfusión de hematíes. ¿Cuál encaja con una fiebre no hemolítica?',
        opciones: [
          { t: '38,6 °C a los 10 min, con dolor lumbar e hipotensión', porque: 'Fiebre en minutos con dolor lumbar e hipotensión es la reacción hemolítica aguda: hay que parar ya y comprobar la sangre.' },
          { t: '+0,6 °C a las 2 h, sin ningún otro síntoma acompañante', porque: 'La definición pide una subida >1 °C. Con 0,6 °C no cumple: la etiquetarías de reacción sin serlo.' },
          { t: '+1,3 °C a las 4 h, con tiritona y sin hipotensión', ok: true }],
        explicacion: 'Fiebre no hemolítica: <span class="hl-purpura">>1 °C durante o hasta 6 h después</span>, sin otra causa; <span class="hl-azul">no suele salir en la primera hora</span>; puede traer escalofríos y tiritona. La de la hemolítica, en minutos.' },
      { id: 'rsg-e4', corto: 'tras la anafilaxia', tipo: 'test', fuente: 'mh-hipersensibilidad · mh-umbrales-guias',
        enunciado: 'En su transfusión anterior tuvo una anafilaxia con broncoespasmo. Hoy, Hb 7,4 g/dl, estable, sin cardiopatía. ¿Qué haces?',
        opciones: [
          { t: 'Transfundir lavados, como tras cualquier alergia', porque: 'Lavados es lo indicado tras una reacción alérgica; tras una anafilaxia, el libro pide evitar nuevas transfusiones salvo que sean imprescindibles.' },
          { t: 'No transfundir si no es imprescindible, y estudiar un déficit de IgA', ok: true },
          { t: 'Transfundir: con 7,4 está en su umbral', porque: 'Su umbral (estable sin coronariopatía) es <7: con 7,4 no está indicada, y tras una anafilaxia el libro pide evitarla salvo que sea imprescindible.' }],
        explicacion: 'Tras una <span class="hl-rojo">anafilaxia</span>: evitar nuevas transfusiones salvo que sean imprescindibles; tras una reacción alérgica, lavados. A todo paciente con hipersensibilidad, estudiar un <span class="hl">déficit de IgA</span>.' },
      { id: 'rsg-e5', corto: 'la hipotensión', tipo: 'test', fuente: 'mh-hipersensibilidad · mh-hemolitica',
        enunciado: 'Hipotensión brusca con sibilancias durante una transfusión, sin fiebre. ¿Qué advierte el libro?',
        opciones: [
          { t: 'Que el shock anafiláctico puede confundirse con una hemolítica: parar ya', ok: true },
          { t: 'Que sin fiebre no puede ser una reacción a la transfusión', porque: 'La anafilaxia no da fiebre y es una reacción a la transfusión. Seguir transfundiendo a un paciente en shock anafiláctico es peligroso.' },
          { t: 'Que es una urticaria: pausa y antihistamínico', porque: 'La urticaria leve no da hipotensión ni sibilancias. Disnea y sibilancias bruscas sugieren anafilaxia: se para la transfusión de inmediato.' }],
        explicacion: 'Disnea y sibilancias bruscas sugieren <span class="hl-rojo">anafilaxia</span>, y su hipotensión puede confundirse con una reacción hemolítica aguda. Se para de inmediato y se maneja como cualquier anafilaxia grave.' },
      { id: 'rsg-e6', corto: 'los apuntes', tipo: 'error', fuente: 'mh-fiebre-nh · mh-trali · mh-taco · mh-hipersensibilidad',
        enunciado: 'Apuntes de un compañero sobre las reacciones a la transfusión. Encuentra los errores (0, 1 o 2).',
        frases: [
          { t: 'La fiebre no hemolítica es la reacción adversa más frecuente (1:60).' },
          { t: 'En la fiebre no hemolítica, los anticuerpos antileucocitarios son del receptor.' },
          { t: 'El TRALI se debe siempre a anticuerpos del donante.', mal: true,
            c: 'En el <span class="hl">80 %</span>. En ~20 % no intervienen anticuerpos, y no se conoce el agente.' },
          { t: 'En el TACO, el riesgo crece con el número de unidades transfundidas.', mal: true,
            c: '<span class="hl-azul">No hay correlación con el número de unidades</span>; pesan la insuficiencia cardíaca o renal previas, y quizá otros factores además del volumen.' },
          { t: 'Con déficit de IgA puede haber anafilaxia sin haber recibido antes plasma.' }],
        explicacion: 'Dos «siempre» que la ficha niega: el TRALI sin anticuerpos existe, y el TACO no depende del número de unidades.' },
    ],
    casos: [
      { id: 'h2', titulo: 'Rocío, 67 años: ahogo a la hora de la bolsa', corto: 'Caso · Rocío', sub: 'neumonía; cardiopatía isquémica con IC y ERC',
        paciente: { Edad: '67 años', Peso: '68 kg', Motivo: 'neumonía', Antecedentes: 'cardiopatía isquémica con IC (FEVI 35 %); enfermedad renal crónica' },
        pasos: [
          { momento: 'Día 4 · 09:00', datos: { Hb: '7,7 g/dl, sin sangrado', Balance: '+2,8 L desde el ingreso' }, nuevo: ['Hb', 'Balance'],
            pregunta: { id: 'h2-1', tipo: 'test', fuente: 'mh-umbrales-guias · mh-taco',
              enunciado: '¿La transfundes, y qué complicación pulmonar vigilas más en ella?',
              opciones: [
                { t: 'No: con 7,7 está por encima de 7', porque: 'Con cardiopatía isquémica el umbral es <8. Dejarías sin transfundir a quien la guía sí lo indica.' },
                { t: 'Sí (<8 por su cardiopatía); vigilar el TACO por su IC y su ERC', ok: true },
                { t: 'Sí; vigilar el TRALI, que es la complicación pulmonar más frecuente', porque: 'La más frecuente es el TACO (~1 %); el TRALI es raro (1:12.000). Y ella tiene justo lo que predispone al TACO: IC, ERC y un balance positivo.' }],
              explicacion: 'Cardiopatía isquémica: umbral <span class="hl">Hb <8</span>. Y la <span class="hl-rojo">IC y la insuficiencia renal previas</span> predisponen al TACO, la complicación pulmonar más frecuente.' } },
          { momento: 'Día 4 · 11:20', datos: { Transfusión: '1 CH desde las 10:40', Piel: 'habones en el tronco; sin fiebre ni disnea' }, nuevo: ['Transfusión', 'Piel'],
            pregunta: { id: 'h2-2', tipo: 'test', fuente: 'mh-hipersensibilidad',
              enunciado: 'La enfermera te llama por los habones. ¿Qué indicas?',
              opciones: [
                { t: 'Parar del todo: es una anafilaxia', porque: 'Sin disnea, sibilancias ni hipotensión es una urticaria leve. Pararla del todo le quitaría una transfusión indicada.' },
                { t: 'Nada: unos habones sin fiebre no son una reacción a la transfusión', porque: 'Es la reacción de hipersensibilidad más común (1:100 unidades). Pasarla por alto hará que la próxima vez no pidas hematíes lavados.' },
                { t: 'Pausa y difenhidramina 25-50 mg; luego puede seguir', ok: true }],
              explicacion: 'La urticaria leve sin fiebre <span class="hl">no obliga a interrumpir</span>; lo habitual es parar un rato y dar un antihistamínico (difenhidramina 25-50 mg VO, IM o IV).' } },
          { momento: 'Día 4 · 12:40', datos: { Respiración: 'disnea; SpO₂ 86 %; crepitantes bilaterales', Temperatura: '38,1 °C', PA: '168/92 mmHg', Transfusión: 'quedan unos 50 ml' }, nuevo: ['Respiración', 'Temperatura', 'PA', 'Transfusión'],
            pregunta: { id: 'h2-3', tipo: 'error', fuente: 'mh-taco · mh-trali',
              enunciado: 'La nota del R1 a las 12:45. Encuentra los errores (0, 1 o 2).',
              frases: [
                { t: 'Insuficiencia respiratoria aguda en las primeras 6 h de la transfusión.' },
                { t: 'Es un TRALI: tiene fiebre.', mal: true,
                  c: 'La fiebre <span class="hl-rojo">no separa</span> el TRALI del TACO: aparece en el 30 % de los TACO. Su IC, su ERC y el balance positivo apuntan al TACO.' },
                { t: 'Como quedan 50 ml, termino la bolsa y luego valoro.', mal: true,
                  c: 'Se <span class="hl-rojo">para</span> la transfusión si no ha terminado, a la primera señal de dificultad respiratoria.' },
                { t: 'Aviso al banco de sangre.' },
                { t: 'Con la radiografía sola no voy a poder separar TRALI de TACO.' }],
              explicacion: 'TRALI y TACO aparecen en el mismo plazo y pueden ser indistinguibles; en los dos se para y se avisa al banco.' } },
          { momento: 'Día 4 · 12:50', datos: { Analítica: 'pedida (PCR incluida)' }, nuevo: ['Analítica'],
            pregunta: { id: 'h2-4', tipo: 'destapa', fuente: 'mh-taco · mh-trali', modeloFuturo: [{ capilarVivo: 'taco' }, { capilarVivo: 'trali' }],
              enunciado: 'Mientras llega la analítica, ¿qué te inclina hacia el TACO o el TRALI en Rocío? Son tres cosas.',
              puntos: [
                'Su <span class="hl">IC y su ERC previas</span>, y la sobrecarga (+2,8 L): apuntan al TACO.',
                'Una <span class="hl-azul">PCR alta</span> sin insuficiencia cardíaca ni sobrecarga apoyaría el TRALI.',
                'Su fiebre <span class="hl-rojo">no decide</span>: la tiene el 30 % de los TACO.'],
              explicacion: 'La fuente no da cifras de PCR, BNP ni ecografía para separarlos: se decide con estos datos de conjunto.' } },
          { momento: 'Día 4 · 13:15', datos: { 'Rx de tórax': 'edema bilateral' }, nuevo: ['Rx de tórax'],
            pregunta: { id: 'h2-5', tipo: 'test', fuente: 'mh-taco',
              enunciado: 'Transfusión parada y banco avisado. Todo apunta a un TACO. ¿Qué añades?',
              opciones: [
                { t: 'Nada: al parar, el TACO se resuelve solo', porque: 'El TACO tiene una mortalidad descrita del 20 % y 3 de cada 4 necesitan ventilación mecánica: no es banal, y el libro indica diurético.' },
                { t: 'Diurético de asa IV y soporte respiratorio', ok: true },
                { t: 'Antihistamínico, como en la urticaria de esta mañana', porque: 'Es un edema hidrostático, no una alergia. Lo indicado en el TACO es el diurético de asa IV, y soporte.' }],
              explicacion: 'TACO: parar, avisar al banco, <span class="hl">diurético de asa IV</span> y soporte (ventilación mecánica si hace falta), como en el TRALI.' } },
          { momento: 'Día 6 · el giro', datos: { Hb: '7,5 g/dl', Plan: 'otra transfusión' }, nuevo: ['Hb', 'Plan'],
            pregunta: { id: 'h2-6', tipo: 'test', fuente: 'mh-hipersensibilidad · mh-taco · mh-fiebre-nh',
              enunciado: 'Vuelve a necesitar sangre (<8). ¿Qué cambias en esta transfusión?',
              opciones: [
                { t: 'Nada: la urticaria fue leve y el TACO ya pasó', porque: 'Tras una reacción alérgica, las siguientes van con hematíes lavados; y tras un TACO se aconseja corregir antes el balance positivo.' },
                { t: 'Lavados, por la urticaria; estudiar IgA; antes, corregir el balance', ok: true },
                { t: 'Leucorreducidos, por la fiebre que tuvo a las 12:40 del día 4', porque: 'Esa fiebre fue del TACO (la tiene el 30 %), no una fiebre no hemolítica; y los leucorreducidos se aconsejan cuando una fiebre no hemolítica se repite.' }],
              explicacion: 'El giro: la urticaria de las 11:20, que parecía menor, cambia el producto: <span class="hl">hematíes lavados</span> y estudiar un <span class="hl">déficit de IgA</span>. Y tras el TACO, <span class="hl-azul">identificar y corregir un balance positivo (con diuréticos) antes de transfundir</span>.' } },
        ],
        lleva: [
          'Su cardiopatía la pone en <8; su IC y su ERC, en riesgo de TACO, la complicación pulmonar más frecuente.',
          'TRALI y TACO salen en las mismas 6 h: parar y avisar; IC, ERC y sobrecarga apuntan al TACO, y la fiebre no los separa.',
          'Tras una urticaria, hematíes lavados; tras un TACO, corregir el balance antes de transfundir.'],
        volver: { nombre: 'TACO (sobrecarga circulatoria)', ancla: 'mh-taco', modelo: visual('merino-riesgos', '👁️ El reloj de la transfusión (vista Visual)'), modeloFuturo: { capilarVivo: 'taco' } } },
    ],
    profundizar: [
      { id: 'mh-tabla-12-5', titulo: 'Las infecciones transmitidas (Tabla 12.5)', nota: 'Virus y bacterias: VHB 1:1,2 millones, VHC y VIH 1:1,5 millones, bacterias 1:500.000.' },
      { id: 'mh-nosocomiales', titulo: 'De dónde viene la idea: los injertos renales' },
    ],
  },
};
