// Mayéutica del bloque 4, grupo D · Los iones de la célula (2/3): fichas mr-magnesio-deficit y mr-magnesio-reposicion
// de Marino cap. 37 «Magnesium». La pinta js/core/mayeutica.js. Datos puros; formato: b1-fluidos.js.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-renal.html) y de su PDF
// (docs/marino-2024-electrolitos-caps35-38.pdf; cap. 37 = págs. 31-39: «E p. N» es la página del PDF).
// El paciente del caso (Rufino) se inventa; sus cifras de análisis son del caso y se marcan como ilustrativas.
// Cobertura y caso: autonomo/bloques/b4/cobertura-anexo.md §3 (4D) y §7.

const IV = (estado, texto) => ({ ionesVivos: estado, texto });
const RV = (clave, texto) => ({ ritmoVivo: clave, texto });
const NEFRONA_FUROSEMIDA = { nefronaViva: 'normal|furosemida', texto: 'Compruébalo en la nefrona viva (furosemida)' };

export const MAYEUTICA_IONES_2 = {
  /* =================================================================================================
     XIX · Magnesio: medirlo bien y sospechar el déficit (E p. 31-36)
     ================================================================================================= */
  'mr-magnesio-deficit': {
    entrada: 'Por qué el magnesio del análisis puede ser normal con el cuerpo vacío, quién lo gasta (la furosemida, primera) y por qué el potasio y el calcio no se corrigen sin él.',
    guia: [
      { id: 'ion-mg-g1', corto: 'la bomba', tipo: 'test', fuente: 'mr-magnesio-deficit · mr-mg-arritmias',
        enunciado: 'El magnesio es cofactor de la ATPasa de la bomba Na⁺-K⁺. Antes de seguir: si falta magnesio, ¿qué le pasa a la célula del corazón?',
        opciones: [
            { t: 'Se hiperpolariza y el corazón se protege', porque: 'Es al revés: sin magnesio la bomba rinde menos. Si piensas que el déficit protege, no sospecharás el magnesio ante una arritmia ventricular.' },
            { t: 'Solo se afecta el hueso, donde está más de la mitad del magnesio; el corazón no nota nada', porque: 'El magnesio mueve la bomba de todas las células excitables. Pensar que el corazón no lo nota te haría pasar por alto la causa de una arritmia refractaria.' },
            { t: 'Se despolariza y es más propensa a arritmias', ok: true }],
        explicacion: 'El magnesio hace funcionar la <span class="hl-azul">bomba Na⁺-K⁺</span> (E p. 31) y su déficit <span class="hl-rojo">despolariza las células cardíacas y promueve arritmias</span> (E p. 35).' },
      { id: 'ion-mg-g2', corto: 'dónde está', tipo: 'test', fuente: 'mr-tabla-37-1', modelo: IV('rufino:3', 'Compruébalo en los iones vivos (Rufino)'),
        enunciado: 'Predice, antes de mirar la Tabla 37.1: de los 2.000 mEq de magnesio de un adulto de 70 kg, ¿qué parte está en el plasma, que es lo que mide el análisis?',
        opciones: [
            { t: 'Unos 6 mEq: el 0,3 %, menos del 1 %', ok: true },
            { t: 'Alrededor de la mitad, unos 1.000 mEq: el plasma sería el gran depósito del magnesio', porque: 'Eso es lo que hay en el hueso. Si creyeras que el plasma tiene la mitad, tomarías un Mg sérico normal como prueba de que el cuerpo está lleno.' },
            { t: 'Una cuarta parte, unos 500 mEq', porque: 'Es más o menos lo que hay en el músculo. Con ese error, un Mg sérico normal te parecería fiable.' }],
        explicacion: 'Tabla 37.1: hueso 1.060 mEq (53 %), músculo 540 (27 %), tejidos blandos 384 (19 %), hematíes 10 y <span class="hl">plasma 6 mEq (0,3 %)</span>. Por eso el plasma <span class="hl-rojo">puede ser normal con el cuerpo con depleción</span> (E p. 31).',
        nota: '<b>Nota de fidelidad.</b> La tabla da a los hematíes un 0,7 %, pero 10 de 2.000 mEq son el 0,5 %. Se reproduce la cifra de la fuente.' },
      { id: 'ion-mg-g3', corto: 'orina antes que plasma', tipo: 'test', fuente: 'mar-img-37-1 · mr-mg-orina', modelo: IV('rufino:3', 'Compruébalo en los iones vivos (Fig. 37.1)'),
        enunciado: 'Un voluntario sano empieza una dieta sin magnesio. A la semana, ¿qué se ve en el análisis y qué en la orina de 24 h?',
        opciones: [
            { t: 'Mg plasmático bajo y orina normal: el riñón sigue eliminando lo de siempre', porque: 'Es lo contrario. Con aporte deficiente el riñón ahorra magnesio; esperar un plasma bajo para sospechar el déficit llega tarde.' },
            { t: 'Las dos cosas caen a la vez, a la misma velocidad', porque: 'En la Figura 37.1 no coinciden: la orina cae primero. Pedir solo el plasma te daría falsa tranquilidad durante días.' },
            { t: 'Mg plasmático aún normal, pero la eliminación urinaria ya es mínima', ok: true }],
        explicacion: 'Normalmente se eliminan <span class="hl">5-15 mEq en 24 h</span>; con aporte deficiente el riñón conserva y la excreción cae a casi nada <span class="hl-azul">antes</span> de que baje el plasma: la orina detecta antes el déficit (Figura 37.1, E p. 33).' },
      { id: 'ion-mg-g4', corto: 'leer el análisis', tipo: 'destapa', fuente: 'mr-mg-suero · mr-mg-unidades · mr-mg-ionizado · mr-tabla-37-2',
        enunciado: 'Te dan un Mg de laboratorio de 1,7 mg/dL. Para leerlo bien tienes que saber tres cosas.',
        cuantas: 'son tres cosas',
        puntos: [
          'Se mide en <span class="hl">suero, no en plasma</span>: el anticoagulante del plasma puede llevar citrato u otros aniones que fijan el Mg.',
          'En mEq/L: (mg/dL × 10 / 24) × 2, así que <span class="hl">1,7 mg/dL = 1,4 mEq/L</span> (mmol/L = mEq/L × 0,5).',
          'El análisis estándar mide <span class="hl-azul">las tres fracciones</span> (el 67 % ionizado, activo; el resto ligado o quelado): una hipoproteinemia también lo baja.'],
        explicacion: 'Rango del suero total 1,7-2,4 mg/dL = 1,4-2,0 mEq/L = 0,7-1,0 mmol/L (Tabla 37.2). El ionizado se mide con electrodo, poco disponible, y no está claro que aporte (E p. 32-33).' },
      { id: 'ion-mg-g5', corto: 'la furosemida', tipo: 'test', fuente: 'mr-mg-farmacos · mr-tabla-37-3', modelo: NEFRONA_FUROSEMIDA,
        enunciado: 'Un paciente de UCI lleva meses con furosemida y le añaden espironolactona. ¿Cuál de los dos diuréticos le gasta el magnesio, y por qué?',
        opciones: [
            { t: 'La furosemida: su pérdida urinaria de Mg sigue a la de Na⁺ (hasta el 50 % en crónicos)', ok: true },
            { t: 'La espironolactona: actúa en el colector, donde se decide el magnesio final', porque: 'Los ahorradores de potasio no dan depleción de magnesio; el que lo gasta es el de asa. Culparla dejaría la furosemida sin tocar.' },
            { t: 'Los dos por igual: cualquier diurético frena la reabsorción de sodio y arrastra magnesio con él', porque: 'Los ahorradores de potasio no producen depleción de magnesio. Si los pusieras en el mismo saco, retirarías la espironolactona sin resolver la causa.' }],
        explicacion: 'Los diuréticos son una causa líder de déficit en la UCI: al frenar la reabsorción de Na⁺ frenan la de Mg, y <span class="hl-rojo">el de asa más que ninguno</span> (furosemida, ácido etacrínico): déficit en el 50 % de los tratados de forma crónica. Las tiazidas también; <span class="hl-verde">los ahorradores de potasio no</span> (E p. 34).' },
      { id: 'ion-mg-g6', corto: 'K⁺ que no sube', tipo: 'test', fuente: 'mr-mg-electrolitos · mr-mg-final', modelo: IV('mg-bajo', 'Compruébalo en los iones vivos (K⁺ y Mg bajo)'),
        enunciado: 'Un paciente con hipopotasemia por diuréticos recibe ClK varias horas y el potasio apenas se mueve. ¿Qué haces antes de subir la velocidad?',
        opciones: [
          { t: 'Subir el ClK al doble: la hipopotasemia refractaria solo es cuestión de dosis y de velocidad de infusión', porque: 'Con el magnesio bajo el K⁺ puede no corregirse por más ClK que des; subir la velocidad añade riesgo (un ClK rápido y concentrado irrita la vena y pide vena central grande, E p. 23) sin resolver la causa.' },
          { t: 'Cambiar a potasio oral: la absorción digestiva evita lo que bloquea el IV', porque: 'El problema no es la vía. Mientras falte magnesio, la hipopotasemia no se corrige, entre por donde entre.' },
          { t: 'Medir el magnesio (y reponerlo si está bajo, o sospecharlo aunque salga normal)', ok: true }],
        explicacion: 'La hipopotasemia que acompaña al déficit de Mg <span class="hl-rojo">puede ser refractaria a la reposición de K⁺</span> hasta que se repone el Mg (E p. 35). Idea final del capítulo: sospecha déficit de Mg en toda hipopotasemia por diuréticos (E p. 39).' },
    ],
    examen: [
      { id: 'ion-mg-e1', corto: 'vómito o diarrea', tipo: 'test', fuente: 'mr-mg-otras',
        enunciado: 'Dos pacientes llevan una semana perdiendo líquido digestivo: uno con vómitos incoercibles y otro con diarrea secretora profusa. ¿Cuál tiene riesgo de depleción de Mg?',
        opciones: [
            { t: 'Los dos: todo líquido digestivo lleva magnesio', porque: 'La secreción del tubo alto lleva solo 1-2 mEq/L. Reponer magnesio a ciegas en el vómito te distraería de las pérdidas de volumen y cloro que sí mandan.' },
            { t: 'Solo el de la diarrea secretora: el intestino bajo secreta 10-14 mEq/L', ok: true },
            { t: 'Ninguno: el magnesio se pierde solo por la orina y el intestino apenas interviene', porque: 'La secreción del tubo bajo es rica en magnesio y la diarrea secretora puede dar un déficit profundo. Lo pasarías por alto.' }],
        explicacion: 'Las secreciones del tubo digestivo bajo son ricas en Mg (<span class="hl">10-14 mEq/L</span>); las del alto tienen <span class="hl">1-2 mEq/L</span>: <span class="hl-azul">los vómitos no suponen riesgo</span> (E p. 34).' },
      { id: 'ion-mg-e2', corto: 'la cetoacidosis', tipo: 'test', fuente: 'mr-mg-otras',
        enunciado: 'Ingresa una cetoacidosis diabética con Mg normal (solo el 7 % tiene hipomagnesemia al ingreso). Tras el ingreso, en las primeras 12 horas de insulina, ¿qué esperas y por qué?',
        opciones: [
          { t: 'Que siga igual: la insulina solo mueve la glucosa y el potasio', porque: 'La insulina mete también el magnesio en las células. Ignorarlo te dejaría sin vigilar un déficit que pasa del 7 % al 50 %.' },
          { t: 'Que la hipomagnesemia suba al 50 %: la insulina mete el magnesio en las células', ok: true },
          { t: 'Que mejore sola: al corregir la acidosis se recupera el magnesio perdido en la orina', porque: 'La frecuencia sube, no baja: la insulina desplaza el magnesio al interior de la célula. Dejar de medirlo sería un error.' }],
        explicacion: 'Hipomagnesemia en el <span class="hl">7 %</span> de los ingresos por cetoacidosis, que sube al <span class="hl-rojo">50 %</span> en las primeras 12 h, probablemente por el paso del Mg a las células con la insulina (E p. 35).' },
      { id: 'ion-mg-e3', corto: 'el informe', tipo: 'error', fuente: 'mr-mg-farmacos · mr-mg-electrolitos · mr-mg-unidades',
        enunciado: 'Informe de un residente sobre un paciente con furosemida crónica. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Mg 1,6 mg/dL, es decir unos 1,3 mEq/L: por debajo del rango.' },
          { t: 'Con la furosemida crónica, el déficit de Mg afecta a cerca de la mitad de los tratados.' },
          { t: 'Si le añadimos espironolactona tendrá la misma pérdida urinaria de Mg que con la furosemida.', mal: true,
            c: 'Los <span class="hl-verde">ahorradores de potasio no</span> producen depleción de Mg; la producen el asa y las tiazidas (E p. 34).' },
          { t: 'La hipofosfatemia que presenta es consecuencia del déficit de Mg.', mal: true,
            c: 'Al revés: el fosfato bajo es <span class="hl">causa</span> del déficit (aumenta la eliminación renal de Mg), no efecto (E p. 35).' }],
        explicacion: '1,6 × 10 / 24 × 2 = 1,3 mEq/L: la primera frase es correcta; la furosemida da déficit en el 50 % con tratamiento crónico (E p. 32, 34-35).' },
      { id: 'ion-mg-e4', corto: 'la digital', tipo: 'test', fuente: 'mr-mg-arritmias',
        enunciado: 'Un paciente con digoxina presenta arritmias ventriculares y su Mg sérico es 1,5 mEq/L (normal). ¿Qué dice Marino del magnesio IV?',
        opciones: [
            { t: 'No sirve: con un Mg sérico normal no hay déficit que reponer ni arritmia que tratar', porque: 'Marino señala que el Mg IV puede suprimir las arritmias digitálicas aunque el Mg sérico sea normal. Descartarlo te dejaría sin un tratamiento posible.' },
            { t: 'Está contraindicado: la digital y el magnesio compiten por la misma bomba y se suman', porque: 'El déficit favorece la toxicidad digitálica, no el aporte. Retirar el magnesio dejaría la arritmia sin tratar.' },
            { t: 'Puede suprimirlas aunque el Mg sérico sea normal: comparte bomba con la digital', ok: true }],
        explicacion: 'Digital y déficit de Mg <span class="hl-azul">inhiben la misma bomba</span>, así que el déficit favorece la toxicidad digitálica; el Mg IV puede suprimir estas arritmias <span class="hl">aunque el Mg sérico sea normal</span> (E p. 35). También abole arritmias ventriculares refractarias con Mg normal, quizá por un efecto estabilizador de membrana.' },
      { id: 'ion-mg-e5', corto: 'hipocalcemia', tipo: 'destapa', fuente: 'mr-mg-electrolitos',
        enunciado: 'Un paciente con calcio bajo que no mejora con calcio IV tiene el Mg en 0,9 mEq/L. ¿Por qué el déficit de Mg causa hipocalcemia? Son tres cosas.',
        cuantas: 'son tres cosas',
        puntos: [
          'Hay <span class="hl">menor liberación de PTH</span>.',
          'Además hay <span class="hl">menor respuesta del órgano diana</span> a la PTH.',
          'Por eso <span class="hl-rojo">no se corrige hasta corregir el Mg</span>, igual que la hipopotasemia.'],
        explicacion: 'Mecanismo: liberación de PTH alterada combinada con respuesta alterada del órgano diana. La hipocalcemia del déficit de Mg es difícil de corregir hasta reponer el Mg (E p. 35).' },
    ],
    casos: [
      { id: 'ion-mg-caso-damian', titulo: 'Damián, 52 años: el magnesio que engaña', corto: 'Caso · Damián', sub: 'alcohólico desnutrido con K⁺ bajo',
        paciente: { Edad: '52 años', Motivo: 'alcoholismo crónico, desnutrido, con vómitos', Análisis: 'valores ilustrativos de un paciente inventado' },
        pasos: [
          { momento: 'Ingreso', datos: { 'K⁺': '3,0 mEq/L' }, nuevo: ['K⁺'],
            pregunta: { id: 'ion-mg-d1', tipo: 'test', fuente: 'mr-mg-otras · mr-mg-electrolitos', modeloVivo: IV('realimentar', 'Compruébalo en los iones vivos (Damián)'),
              enunciado: 'Damián llega desnutrido, con vómitos y un K⁺ de 3,0. Además de reponer potasio, ¿qué pides?',
              opciones: [
                { t: 'Nada más: los vómitos pierden magnesio y la reposición de K⁺ lo corregirá todo', porque: 'La secreción del tubo alto lleva solo 1-2 mEq/L de Mg. Y con el magnesio bajo el K⁺ puede no subir por más ClK que des.' },
                { t: 'Un Mg sérico: el alcoholismo crónico lo baja en el 44 % y el K⁺ puede quedar refractario', ok: true },
                { t: 'Una orina de 24 h y nada de sérico, porque en el alcohólico el sérico sale siempre normal', porque: 'No es siempre normal: el 44 % de los alcohólicos crónicos tiene hipomagnesemia. Retrasar el análisis básico retrasaría el tratamiento.' }],
              explicacion: 'Hipomagnesemia en el <span class="hl-rojo">44 %</span> de los alcohólicos crónicos (desnutrición, diarrea crónica y menor respuesta renal al déficit), y la hipopotasemia con déficit de Mg <span class="hl-rojo">puede ser refractaria al K⁺</span> (E p. 34-35).' } },
          { momento: 'Ingreso · análisis', datos: { 'Mg²⁺': '1,1 mEq/L (1,3 mg/dL)' }, nuevo: ['Mg²⁺'],
            pregunta: { id: 'ion-mg-d2', tipo: 'destapa', fuente: 'mr-tabla-37-1 · mr-mg-orina · mr-mg-monitor', modeloVivo: IV('rufino:3', 'Compruébalo en los iones vivos (Fig. 37.1)'),
              enunciado: 'El Mg de Damián es 1,1 mEq/L. Si mañana saliera normal, ¿por qué no te fiarías de él para saber lo que le falta? Son tres cosas.',
              cuantas: 'son tres cosas',
              puntos: [
                'El plasma tiene solo unos <span class="hl">6 de los 2.000 mEq</span> del cuerpo (0,3 %): el hueso y el músculo guardan el resto.',
                'El sérico <span class="hl-azul">se normaliza en 1-2 días</span> de reposición, pero los depósitos tardan varios días en llenarse.',
                'La orina de 24 h cae a casi nada <span class="hl-rojo">antes</span> de que baje el plasma: un sérico normal no descarta el déficit.'],
              explicacion: 'Tabla 37.1 (plasma 6 mEq, 0,3 %) y Figura 37.1 (E p. 31-33); la normalización del sérico frente a los depósitos, en el apartado de vigilancia (E p. 37-38).' } },
          { momento: 'Ingreso · plan',
            pregunta: { id: 'ion-mg-d3', tipo: 'test', fuente: 'mr-mg-leve · mr-mg-moderada', modeloVivo: IV('reponer-mg', 'Compruébalo en los iones vivos (reponer Mg)'),
              enunciado: 'Mg 1,1 mEq/L y K⁺ 3,0, sin arritmia ni convulsiones y con función renal normal. El Mg cae en el rango del protocolo leve (1-1,4). ¿Qué eliges?',
              opciones: [
                { t: 'El moderado, porque hay otra alteración electrolítica asociada (el K⁺ bajo)', ok: true },
                { t: 'El leve: 1 mEq/kg el primer día, porque el Mg está entre 1 y 1,4 mEq/L', porque: 'El leve es solo para el paciente sin otros trastornos electrolíticos; con el K⁺ bajo te quedarías corto.' },
                { t: 'El de amenaza vital, porque un alcohólico tiene riesgo alto de arritmia', porque: 'Ese esquema es para arritmia grave o convulsiones ya presentes; sin ellas, el bolo rápido no se justifica.' }],
              explicacion: 'Moderada: Mg <span class="hl">&lt;1 mEq/L</span> <span class="hl-azul">o hipomagnesemia con otras alteraciones electrolíticas</span>: 6 g en 3 h, 5 g en 6 h y 5 g/12 h durante 5 días (E p. 37).' } },
          { momento: 'Día 2', datos: { 'Mg²⁺': '1,6 mEq/L', 'K⁺': '3,6 mEq/L' }, nuevo: ['Mg²⁺', 'K⁺'],
            pregunta: { id: 'ion-mg-d4', tipo: 'error', fuente: 'mr-mg-monitor · mr-tabla-37-1 · mr-mg-final', modeloVivo: IV('realimentar', 'Compruébalo en los iones vivos (Damián)'),
              enunciado: 'Tras 24 h de perfusión el Mg está en rango. El residente anota su plan. Encuentra el error (puede haber 0, 1 o 2).',
              frases: [
                { t: 'El K⁺ ha subido a 3,6: la hipopotasemia refractaria cede al reponer el Mg.' },
                { t: 'El Mg sérico ya es normal: paro la perfusión.', mal: true,
                  c: 'El sérico se normaliza en 1-2 días, pero los depósitos tardan <span class="hl-rojo">varios días</span>: hay que seguir con 5 g/12 h durante 5 días (E p. 37-38). Además el plasma es solo el 0,3 % del magnesio del cuerpo (E p. 31).' },
                { t: 'Si hubiera hipocalcemia asociada, también esperaría que mejorase al reponer el Mg.' },
                { t: 'Para decidir cuándo parar me guiaré por la prueba de retención, no por el sérico.' }],
              explicacion: 'La mejor guía de la repleción es la retención urinaria; el sérico engaña porque se normaliza antes que los depósitos (E p. 37-39).' } },
          { momento: 'Día 2 · noche · el giro', datos: { 'Ca iónico': '0,98 mmol/L', Tratamiento: 'gluconato cálcico IV hace 6 h, sin cambio' }, nuevo: ['Ca iónico', 'Tratamiento'],
            pregunta: { id: 'ion-mg-d5', tipo: 'test', fuente: 'mr-mg-electrolitos', modeloVivo: IV('realimentar', 'Compruébalo en los iones vivos (Damián)'),
              enunciado: 'Damián tiene el calcio bajo y no sube con el calcio IV. ¿Cómo lo interpretas?',
              opciones: [
                { t: 'Falta calcio: subo la dosis de calcio IV hasta que corrija', porque: 'Con el Mg bajo la hipocalcemia no se corrige por más calcio que des; subir la dosis añade riesgo sin tratar la causa.' },
                { t: 'Hipocalcemia del déficit de Mg (menos PTH y menor respuesta a ella): sigo reponiendo el Mg', ok: true },
                { t: 'Un hipoparatiroidismo primario: pido PTH y no cambio nada hasta tenerla', porque: 'El déficit de Mg ya explica una PTH escasa y poco eficaz; esperar el resultado sin reponer Mg deja la hipocalcemia sin tratar.' }],
              explicacion: 'El déficit de Mg causa hipocalcemia por <span class="hl">menor liberación de PTH</span> y <span class="hl">menor respuesta del órgano diana</span>; <span class="hl-rojo">no se corrige hasta corregir el Mg</span> (E p. 35).' } },
        ],
        lleva: [
          'En el alcohólico desnutrido, un K⁺ que no sube obliga a sospechar y medir el magnesio (déficit en el 44 %).',
          'El Mg sérico engaña: el plasma es el 0,3 % del cuerpo y se normaliza antes que los depósitos; no se para por él.',
          'Con otro electrolito bajo toca el protocolo moderado, y la hipocalcemia refractaria también es del Mg.'],
        volver: { nombre: 'Magnesio en la orina', ancla: 'mr-mg-orina', modeloVivo: IV('realimentar', 'Iones vivos: Damián al realimentar') } },
    ],
    profundizar: [
      { id: 'mr-mg-unidades', titulo: 'Unidades y conversor mg/dL – mEq/L – mmol/L' },
      { id: 'mr-mg-ionizado', titulo: 'Magnesio ionizado (67 %)' },
      { id: 'mr-mg-neuro', titulo: 'Neurológicas: hiperactividad del SNC y Wernicke' },
    ],
  },

  /* =================================================================================================
     XX · Reponer magnesio, prueba de retención e hipermagnesemia (E p. 36-39)
     ================================================================================================= */
  'mr-magnesio-reposicion': {
    entrada: 'Cuánto magnesio dar y por qué el doble, qué protocolo según la gravedad, cómo saber que los depósitos ya están llenos y qué pasa cuando sobra.',
    guia: [
      { id: 'ion-mg-r1', corto: 'el preparado', tipo: 'test', fuente: 'mr-tabla-37-4 · mr-mg-preparados',
        enunciado: 'Vas a poner 6 g de sulfato de magnesio heptahidratado, el preparado IV estándar. ¿Cuánto magnesio elemental son, y en qué suero lo diluyes?',
        opciones: [
            { t: '24 mEq, en Ringer lactato', porque: 'Son 8 mEq por gramo, no 4 (eso son los mmol), y el calcio del Ringer contrarresta al magnesio. Pondrías la mitad de la dosis diluida en el suero equivocado.' },
            { t: '48 mEq, en salino isotónico', ok: true },
            { t: '96 mEq, en el suero que haya', porque: 'Esa cifra corresponde a duplicar el contenido por gramo, como si fuera el sulfato anhidro, no el heptahidratado. Y el diluyente importa: no vale el Ringer.' }],
        explicacion: 'Tabla 37.4: el sulfato heptahidratado lleva <span class="hl-azul">8 mEq (4 mmol) por gramo</span>, así que 6 g = 48 mEq. <span class="hl-rojo">No se diluye en Ringer</span>: su calcio contrarresta al magnesio (E p. 36).' },
      { id: 'ion-mg-r2', corto: 'el doble', tipo: 'test', fuente: 'mr-mg-leve', modelo: IV('reponer-mg', 'Compruébalo en los iones vivos (reponer Mg)'),
        enunciado: 'Predice: si el déficit total supuesto es de 1-2 mEq/kg, ¿cuánto magnesio tienes que prever dar en total, y por qué?',
        opciones: [
            { t: 'Lo mismo que el déficit, porque el cuerpo retiene todo el magnesio que se infunde y lo lleva al hueso', porque: 'Hasta el 50 % se pierde por la orina. Con una dosis igual al déficit, el paciente seguiría con depósitos vacíos.' },
            { t: 'La mitad del déficit: lo demás lo recupera el hueso solo', porque: 'Un hueso con el 53 % del magnesio no repone solo el plasma ni la célula en horas. Con la mitad, el déficit seguiría sin cubrir.' },
            { t: 'El doble del déficit, porque hasta el 50 % del infundido se pierde por la orina', ok: true }],
        explicacion: 'Protocolo leve: déficit supuesto <span class="hl">1-2 mEq/kg</span>; como <span class="hl-rojo">hasta el 50 % del infundido se pierde en la orina</span>, la necesidad total es el doble (E p. 37).' },
      { id: 'ion-mg-r3', corto: 'el leve', tipo: 'test', fuente: 'mr-mg-leve',
        enunciado: 'Mg sérico de 1,2 mEq/L, sin clínica ni otros trastornos, función renal normal. ¿Cómo lo repones?',
        opciones: [
            { t: '1 mEq/kg el primer día y 0,5 mEq/kg/día los 3-5 días siguientes', ok: true },
            { t: '2 g en 2-5 minutos y 5 g en 6 horas', porque: 'Ese es el esquema de amenaza vital (torsade, convulsiones). Un paciente silente no lo necesita y expones a un bolo rápido sin motivo.' },
            { t: '6 g en 3 horas, 5 g en 6 horas y después 5 g cada 12 horas durante 5 días', porque: 'Es el esquema de Mg menor de 1 mEq/L o con otras alteraciones electrolíticas. Para un caso leve y silente es más de lo necesario.' }],
        explicacion: 'Leve (Mg 1-1,4 mEq/L = 1,2-1,7 mg/dL, sin clínica): <span class="hl">1 mEq/kg el primer día y 0,5 mEq/kg/día los 3-5 días siguientes</span> (E p. 37).',
        nota: '<b>Nota de fidelidad.</b> La fuente da el equivalente «0,5-1 mmol/L», pero con mmol/L = mEq/L × 0,5 el rango 1-1,4 mEq/L son 0,5-0,7 mmol/L.' },
      { id: 'ion-mg-r4', corto: 'el grave', tipo: 'destapa', fuente: 'mr-mg-grave', modeloVivo: RV('torsade', 'Compruébalo en el corazón eléctrico (torsade)'),
        enunciado: 'Un paciente con hipomagnesemia presenta torsade de pointes. ¿Cuál es el esquema completo? Son tres pasos.',
        cuantas: 'son tres pasos',
        puntos: [
          '<span class="hl-rojo">2 g de MgSO₄</span> (16 mEq) IV en <span class="hl-rojo">2-5 minutos</span>.',
          'Después <span class="hl">5 g</span> (40 mEq) en 250-500 mL de salino isotónico en <span class="hl">6 horas</span>.',
          'Y <span class="hl">5 g cada 12 h</span> en perfusión continua durante <span class="hl">5 días</span>.'],
        explicacion: 'Esquema de hipomagnesemia con arritmias graves o convulsiones generalizadas, para función renal normal (E p. 37).' },
      { id: 'ion-mg-r5', corto: 'tras el bolo', tipo: 'test', fuente: 'mr-mg-monitor', modelo: IV('reponer-mg', 'Compruébalo en los iones vivos (la mitad a la orina)'),
        enunciado: 'Tras el bolo, el Mg sérico sube. ¿Por qué no basta el bolo?',
        opciones: [
            { t: 'Porque el bolo es peligroso por sí mismo y hay que repetirlo en dosis más pequeñas cada pocas horas', porque: 'El motivo no es la toxicidad del bolo, sino que el Mg se pierde y cae rápido. Fraccionar el bolo no sostendría el nivel.' },
            { t: 'Porque empieza a bajar a los 15 minutos; hay que seguir con una perfusión continua', ok: true },
            { t: 'Porque con un Mg normal ya hay depósitos suficientes y la perfusión sobra', porque: 'El sérico se normaliza en 1-2 días, pero los depósitos tardan varios días. Parar entonces dejaría al paciente a medio llenar.' }],
        explicacion: 'El Mg sérico sube tras el bolo y <span class="hl-rojo">empieza a bajar a los 15 min</span>. Puede normalizarse en 1-2 días, pero repletar el total tarda <span class="hl">varios días</span> (E p. 37-38).' },
      { id: 'ion-mg-r6', corto: 'la retención', tipo: 'test', fuente: 'mr-mg-retencion · mr-tabla-37-5',
        enunciado: 'En la prueba de retención, ¿por qué un paciente con depósitos vacíos elimina menos magnesio infundido por la orina que uno con depósitos normales?',
        opciones: [
            { t: 'Porque con depósitos normales el riñón reabsorbe todo el magnesio filtrado y no deja pasar nada a la orina, mientras que con déficit lo pierde', porque: 'Es lo opuesto: con depósitos normales la reabsorción está cerca del máximo y el exceso sale. Con esa idea interpretarías al revés el resultado.' },
            { t: 'Porque el hueso capta el magnesio infundido en una hora y lo guarda para siempre, de modo que la orina no refleja nada', porque: 'La prueba no mide el hueso: mide cuánto reabsorbe el riñón. Con ese razonamiento no sabrías qué hacer con el resultado.' },
            { t: 'Con depósitos normales la reabsorción ya está casi en su máximo (Tmax) y lo infundido sale; con déficit se reabsorbe más', ok: true }],
        explicacion: 'Con depósitos normales la reabsorción está <span class="hl-azul">cerca de su máximo (Tmax)</span> y casi todo sale en la orina; con déficit, la reabsorción es mucho menor que el Tmax y se elimina menos (E p. 38). Tabla 37.5: 6 g en 250 mL en 1 h y orina de 24 h.' },
    ],
    examen: [
      { id: 'ion-mg-x1', corto: 'ClCr 30-50', tipo: 'test', fuente: 'mr-mg-renal',
        enunciado: 'Pierde Mg por diarrea y tiene un aclaramiento de creatinina de 40 mL/min. ¿Qué haces con el protocolo estándar?',
        opciones: [
            { t: 'Lo doy completo: con aclaramiento de 40 el riñón elimina el magnesio sin problema', porque: 'Con riñón disminuido el Mg se elimina menos y puede acumularse. Darlo completo te llevaría hacia la hipermagnesemia.' },
            { t: 'No lo doy: la hipomagnesemia no existe con insuficiencia renal', porque: 'Puede ocurrir, sobre todo con pérdidas extrarrenales y ClCr de 30-50 mL/min. Dejarla sin tratar mantendría su arritmia y su hipopotasemia.' },
            { t: 'No más del 50 % del protocolo, vigilando de cerca el Mg sérico', ok: true }],
        explicacion: 'La hipomagnesemia es poco frecuente en la insuficiencia renal pero aparece con pérdidas extrarrenales y <span class="hl">ClCr 30-50 mL/min</span>: <span class="hl-rojo">no más del 50 %</span> de lo que marcan los protocolos y vigilar el Mg (E p. 37).' },
      { id: 'ion-mg-x2', corto: 'el límite', tipo: 'test', fuente: 'mr-hipermg-umbral', modelo: [RV('bav1', 'Compruébalo en el corazón eléctrico (BAV 1.º)'), IV('hipermg', 'Compruébalo en los iones vivos (hipermagnesemia)')],
        enunciado: 'Una paciente con insuficiencia renal y antiácidos con magnesio tiene bloqueo AV de 1.er grado en el ECG. ¿A partir de qué cifra de Mg sérico se espera?',
        opciones: [
          { t: 'Más de 4 mEq/L: la misma cifra que da la hiporreflexia', porque: 'A más de 4 mEq/L lo que aparece es hiporreflexia. Buscar el bloqueo con esa cifra confundiría los signos de la tabla.' },
          { t: 'Más de 5 mEq/L', ok: true },
          { t: 'Más de 10 mEq/L, cuando ya hay riesgo vital', porque: 'A más de 10 mEq/L la tabla pone el bloqueo AV completo. Esperar al primer grado hasta ese nivel dejaría un bloqueo avanzado sin ver.' }],
        explicacion: 'Tabla de la ficha: <span class="hl">&gt;4 mEq/L hiporreflexia</span>; <span class="hl">&gt;5 BAV de 1.er grado</span>; <span class="hl-rojo">&gt;10 bloqueo AV completo</span>; <span class="hl-rojo">&gt;13 parada cardíaca</span> (E p. 39).' },
      { id: 'ion-mg-x3', corto: 'tratar el exceso', tipo: 'test', fuente: 'mr-hipermg-tto', modelo: [RV('bav3', 'Compruébalo en el corazón eléctrico (BAV 3.º)'), IV('hipermg', 'Compruébalo en los iones vivos (hipermagnesemia)')],
        enunciado: 'Hipermagnesemia con bloqueo AV avanzado. ¿Qué haces mientras llega la hemodiálisis?',
        opciones: [
            { t: 'Sueroterapia con furosemida y esperar la hemodiálisis sin dar calcio, porque el bloqueo todavía no es completo', porque: 'Esa pauta es de los casos menos avanzados y con función renal conservada. Con bloqueo AV avanzado dejarías sin el antagonista que protege la conducción mientras llega la diálisis.' },
            { t: 'Ringer lactato en perfusión: el calcio que lleva corrige el magnesio', porque: 'El calcio del Ringer en esa cantidad no revierte un bloqueo AV. Esperar a eso retrasaría el antagonista real y el bloqueo progresaría.' },
            { t: 'Gluconato cálcico 1 g IV en 2-3 minutos, que antagoniza el efecto cardiovascular temporalmente', ok: true }],
        explicacion: 'El magnesio es el «<span class="hl-azul">calcioantagonista fisiológico</span>»: lo grave es el bloqueo de la conducción AV. Tratamiento de elección: <span class="hl">hemodiálisis</span>; entre tanto, <span class="hl">gluconato cálcico 1 g IV en 2-3 min</span>. Con volumen permitido y algo de función renal, sueroterapia con furosemida en los casos menos avanzados (E p. 39).' },
      { id: 'ion-mg-x4', corto: 'la hoja', tipo: 'error', fuente: 'mr-mg-preparados · mr-mg-retencion-limite · mr-hipermg-causas',
        enunciado: 'Plan de un residente para un paciente en UCI. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Preparo el MgSO₄ en 250 mL de Ringer lactato, que lo mantiene estable.', mal: true,
            c: '<span class="hl-rojo">No se diluye en Ringer</span>: su calcio contrarresta al magnesio. Se usa salino isotónico (E p. 36).' },
          { t: 'Una hemólisis masiva puede subir el Mg sérico, unos 0,1 mEq/L por cada 250 mL de hematíes lisados.' },
          { t: 'En una insuficiencia renal con antiácidos o laxantes con magnesio, la hipermagnesemia es la causa que más debo sospechar.' },
          { t: 'Con la función renal alterada, la prueba de retención sigue siendo igual de fiable.', mal: true,
            c: 'Puede ser <span class="hl">poco fiable con la función renal alterada</span>, lo habitual en la UCI (E p. 38).' },
          { t: 'Cuento 8 mEq de magnesio por gramo de sulfato heptahidratado: 6 g son 48 mEq.' }],
        explicacion: 'Los hematíes tienen unas tres veces más Mg que el suero, por eso la hemólisis solo da hipermagnesemia si es masiva (E p. 38-39).' },
      { id: 'ion-mg-x5', corto: 'orina de 24 h', tipo: 'test', fuente: 'mr-tabla-37-5', origen: 'ilustrativo: orina de un paciente inventado',
        enunciado: 'Prueba de retención: 6 g de MgSO₄ (48 mEq) en 1 h. En la orina de 24 h salen 22 mEq (ilustrativo). ¿Cómo lo lees?',
        opciones: [
            { t: 'Sigue habiendo déficit: eliminó menos de la mitad de lo infundido, así que hay que seguir reponiendo', ok: true },
            { t: 'Resultado no interpretable: solo vale con la orina de 6 horas, así que repito la prueba mañana con una recogida más corta', porque: 'Se recoge la orina de 24 h desde el inicio de la perfusión; la prueba sí es interpretable, salvo que el riñón esté alterado.' },
            { t: 'Depósitos suficientes: la mayor parte del magnesio infundido se ha eliminado, así que puedo dar por completada la reposición', porque: 'Eliminó menos de la mitad, no más del 80 %. Dar el alta del tratamiento ahora dejaría los depósitos vacíos.' }],
        explicacion: '22 de 48 mEq son el 46 %: <span class="hl-rojo">≤12 mmol (24 mEq) en 24 h, o ≤50 % de lo infundido, es depleción continuada</span> (E p. 38).',
        nota: '<b>Nota de fidelidad.</b> La Tabla 37.5 da ">19 mmol (38 mEq) = >80 %" como depósitos suficientes; 38 mEq son el 79 % de 48 mEq. Se reproduce la cifra de la fuente.' },
    ],
    casos: [
      { id: 'ion-mg-caso-rufino', titulo: 'Rufino, 74 años: el potasio que no sube', corto: 'Caso · Rufino', sub: 'obstrucción intestinal, SNG y furosemida',
        paciente: { Edad: '74 años', Motivo: 'obstrucción intestinal; SNG desde hace 5 días', Fármaco: 'furosemida crónica' },
        pasos: [
          { momento: 'Día 5',
            datos: { 'K⁺': '2,8 mEq/L', Reposición: 'ClK a 20 mEq/h durante 8 h (ilustrativo)' }, nuevo: ['K⁺', 'Reposición'],
            pregunta: { id: 'ion-mg-c1', tipo: 'test', fuente: 'mr-mg-electrolitos · mr-mg-final', modeloVivo: IV('mg-bajo', 'Compruébalo en los iones vivos (Rufino con Mg bajo)'),
              enunciado: 'Tras 8 horas de ClK a 20 mEq/h, el K⁺ de Rufino sigue en 2,8. ¿Qué haces?',
              opciones: [
                { t: 'Doblo la velocidad a 40 mEq/h, que es lo que resuelve una hipopotasemia refractaria, aunque sea por vía periférica', porque: 'A 40 mEq/h el ClK irrita la vena y pide vena central grande (E p. 23) y, sobre todo, el K⁺ no subirá mientras falte magnesio: solo ganas riesgo.' },
                { t: 'Pido un Mg sérico: la hipopotasemia refractaria sugiere déficit de magnesio', ok: true },
                { t: 'Retiro la furosemida y repito el K⁺ mañana, sin más', porque: 'Quitar el diurético reduce las pérdidas, pero no corrige un déficit de Mg ya instaurado: el K⁺ seguiría bajo.' }],
            explicacion: 'La hipopotasemia con déficit de Mg <span class="hl-rojo">es refractaria a la reposición de K⁺</span> hasta reponer Mg (E p. 35, 39).' } },
          { momento: 'Día 5 · tarde', datos: { 'Mg²⁺': '1,0 mEq/L (1,2 mg/dL)' }, nuevo: ['Mg²⁺'],
            pregunta: { id: 'ion-mg-c2', tipo: 'destapa', fuente: 'mr-mg-farmacos · mr-mg-otras · mr-tabla-37-3', modeloVivo: NEFRONA_FUROSEMIDA,
              enunciado: 'El Mg sale en 1,0 mEq/L. Ante su historia (SNG, furosemida crónica), ¿qué explica el déficit y qué no? Son tres cosas.',
              cuantas: 'son tres cosas',
              puntos: [
                'La <span class="hl-rojo">furosemida crónica</span>: déficit en el 50 % de los tratados.',
                'Las secreciones altas (la SNG) solo llevan <span class="hl">1-2 mEq/L</span> de Mg: <span class="hl-verde">no explican por sí solas</span> el déficit.',
                'La <span class="hl-azul">hipopotasemia refractaria</span> es el marcador que lo delató.'],
              explicacion: 'Furosemida (50 %) en la Tabla 37.3 y el apartado de diuréticos; las secreciones del tubo alto no son ricas en Mg (E p. 34-35).' } },
          { momento: 'Día 5 · plan',
            pregunta: { id: 'ion-mg-c3', tipo: 'test', fuente: 'mr-mg-moderada · mr-mg-leve', modeloVivo: IV('reponer-mg', 'Compruébalo en los iones vivos (reponer Mg)'),
              enunciado: 'Con Mg 1,0 mEq/L y K⁺ 2,8, sin arritmia ni convulsiones y con función renal normal, ¿qué protocolo eliges?',
              opciones: [
                { t: 'El leve (1 mEq/kg el primer día y 0,5 mEq/kg/día después): el Mg está entre 1 y 1,4 y no hay clínica', porque: 'El leve es para el silente sin otros trastornos; con el K⁺ bajo asociado corresponde el moderado. Te quedarías corto.' },
                { t: 'El de amenaza vital: 2 g en 2-5 minutos de entrada', porque: 'Está indicado en arritmias graves o convulsiones; sin ellas no se justifica el bolo rápido.' },
                { t: 'El moderado: 6 g en 3 h, luego 5 g en 6 h y 5 g cada 12 h durante 5 días', ok: true }],
            explicacion: 'Moderada: Mg <span class="hl">&lt;1 mEq/L</span> <span class="hl-azul">o hipomagnesemia con otras alteraciones electrolíticas</span>: 6 g (48 mEq) en 3 h, 5 g (40 mEq) en las 6 h siguientes y 5 g/12 h durante 5 días (E p. 37).' } },
          { momento: 'Hora 3 de la perfusión · el giro', datos: { Monitor: 'taquicardia ventricular polimorfa (torsade de pointes)' }, nuevo: ['Monitor'],
            pregunta: { id: 'ion-mg-c4', tipo: 'test', fuente: 'mr-mg-grave · mr-mg-arritmias', modeloVivo: RV('torsade', 'Compruébalo en el corazón eléctrico (torsade)'),
              enunciado: 'En el monitor aparece una torsade de pointes. ¿Qué haces?',
              opciones: [
                { t: '2 g de MgSO₄ IV en 2-5 minutos, y después 5 g en 6 h', ok: true },
                { t: 'Acelero la perfusión de 6 g para terminarla antes', porque: 'Una perfusión de horas no corta una arritmia en curso. Pierdes el bolo que sí actúa en minutos.' },
                { t: 'Espero a que el Mg sérico confirme que sigue bajo antes de actuar', porque: 'La arritmia grave es una indicación del esquema de amenaza vital; esperar al análisis la deja sin tratar.' }],
            explicacion: 'Torsade: <span class="hl-rojo">2 g de MgSO₄ en 2-5 min</span>, seguidos de 5 g en 6 h y 5 g/12 h durante 5 días (E p. 37). La torsade es la arritmia más citada ligada a la depleción de Mg (E p. 35-36).' } },
          { momento: 'Tras el bolo',
            pregunta: { id: 'ion-mg-c5', tipo: 'error', fuente: 'mr-mg-monitor · mr-mg-preparados', modeloVivo: IV('reponer-mg', 'Compruébalo en los iones vivos'),
              enunciado: 'La torsade cede y el Mg sube. El residente anota su plan. Encuentra el error (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Continúo con 5 g de MgSO₄ en 250-500 mL de salino isotónico en 6 horas.' },
                { t: 'Vigilo el Mg sérico: sube tras el bolo, pero empieza a bajar a los 15 minutos.' },
                { t: 'Con el Mg ya normal tras el bolo, suspendo el aporte y lo reevalúo mañana.', mal: true,
                  c: 'El Mg <span class="hl-rojo">empieza a bajar a los 15 minutos</span> y los depósitos tardan días: hay que seguir con 5 g/12 h durante 5 días (E p. 37-38).' },
                { t: 'Diluyo las siguientes dosis en salino isotónico, nunca en Ringer.' }],
              explicacion: 'El nivel sérico se normaliza antes que los depósitos: la perfusión continua es la parte importante del esquema (E p. 38).' } },
          { momento: 'Día 11 · tras acabar la perfusión', datos: { 'Orina de 24 h': '22 mEq de Mg tras 6 g (48 mEq) en 1 h (ilustrativo)' }, nuevo: ['Orina de 24 h'],
            pregunta: { id: 'ion-mg-c6', tipo: 'test', fuente: 'mr-tabla-37-5 · mr-mg-retencion-limite',
              enunciado: 'Se hace la prueba de retención para decidir cuándo parar. ¿Qué concluyes y con qué cautela?',
              opciones: [
                { t: 'La prueba no vale nunca en la UCI, así que no la uso', porque: 'Puede ser poco fiable con función renal alterada, pero con función conservada es la mejor guía del final de la reposición.' },
                { t: 'Hay depósitos suficientes, porque tras 6 g en 1 h casi todo el magnesio ha salido por la orina: paro la reposición', porque: 'Eliminó el 46 %, menos de la mitad. Parar dejaría el déficit sin completar.' },
                { t: 'Sigue el déficit (≤50 %), con la salvedad de que la prueba es poco fiable si el riñón está alterado', ok: true }],
            explicacion: '22/48 mEq = 46 % (≤50 %): <span class="hl-rojo">continúa la depleción</span>. La mejor guía de la repleción es la retención urinaria (E p. 38-39).' } },
        ],
        lleva: [
          'Un K⁺ que no sube con la reposición adecuada obliga a medir y reponer el magnesio.',
          'Torsade: 2 g de MgSO₄ en 2-5 min, luego 5 g en 6 h y 5 g/12 h durante 5 días.',
          'El Mg sérico normal no es el final: los depósitos tardan días y la prueba de retención marca el punto (con cautela si falla el riñón).'],
        volver: { nombre: 'Reponer magnesio', ancla: 'mr-mg-grave', modeloVivo: IV('mg-bajo', 'Iones vivos: Rufino con Mg bajo') } },
    ],
    profundizar: [
      { id: 'mr-mg-renal', titulo: 'Insuficiencia renal: no más del 50 %' },
      { id: 'mr-tabla-37-4', titulo: 'Óxido de magnesio oral (241 mg elemental)' },
      { id: 'mr-hipermg-causas', titulo: 'Causas de hipermagnesemia (hemólisis, 0,1 mEq/L por 250 mL)' },
    ],
  },
};
