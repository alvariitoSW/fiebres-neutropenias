// Mayéutica del bloque 4, grupo D · Los iones de la célula (1/3): fichas mr-hipopotasemia, mr-hiperk-causas y
// mr-hiperk-tratamiento de Marino cap. 36 «Potassium». La pinta js/core/mayeutica.js. Datos puros; formato: b1-fluidos.js.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-renal.html) y de su PDF
// (docs/marino-2024-electrolitos-caps35-38.pdf; cap. 36 = págs. 18-28: «E p. N» es la página del PDF).
// Los pacientes de los casos (Adela, Rufino, Gregorio) se inventan; sus cifras de análisis y de ECG son del caso y se marcan como ilustrativas.
// Cobertura y caso: autonomo/bloques/b4/cobertura-anexo.md §4D y pacientes.

const iv = (estado, texto) => ({ ionesVivos: estado, texto });
const ritmo = (clave, texto) => ({ ritmoVivo: clave, texto });
// El filtro vivo (k-urgente) llega con el grupo 4B (auto/b4-4b): mismo enlace que su botón en mr-trr.
const FILTRO_K = { filtroVivo: 'k-urgente', especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs', tab: 'mr-trr', texto: 'Compruébalo en el filtro' };
const VISUAL_HIPOK = { especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs', tab: 'mr-hipopotasemia', enVisual: '', texto: 'Míralo en la vista Visual de la ficha' };
const FUROSEMIDA = { nefronaViva: 'normal|furosemida', especialidad: 'nefrologia', view: 'nefrona', texto: 'La furosemida en la nefrona' };

export const MAYEUTICA_IONES_1 = {
  /* =================================================================================================
     XVI · Potasio: la punta del iceberg y la hipopotasemia (E p. 18-23)
     ================================================================================================= */
  'mr-hipopotasemia': {
    entrada: 'Por qué el K⁺ del análisis es la punta de un iceberg, por qué 3,0 ya son 175 mEq de déficit, qué separa el Cl⁻ de la orina y cómo se repone sin pasarse.',
    guia: [
      { id: 'ion-k-g1', corto: 'el iceberg', tipo: 'test', fuente: 'mr-k-bomba · mr-k-total · mar-img-36-1', modelo: iv('normal:k'),
        enunciado: 'Un adulto de 70 kg tiene unos 3.500 mEq de potasio. Antes de mirar la ficha: ¿cuánto de ese potasio está en el plasma que mide tu análisis?',
        opciones: [
          { t: 'Unos 15 mEq, el 0,4 % del total del potasio', ok: true },
          { t: 'Unos 70 mEq: todo el potasio que está fuera de las células', porque: 'Eso es todo el extracelular (2 %), no solo el plasma, que es un 20 % de él. Si crees que el análisis ve 70 mEq, creerás que un K⁺ normal descarta un déficit.' },
          { t: 'Unos 350 mEq, el 10 % del total', porque: 'El 98 % está dentro de las células y solo el 2 % fuera. Fiarte de un 10 % te haría tomar el K⁺ sérico por un reflejo fiel del total y no sospecharías el déficit.' }],
        explicacion: 'Con 50 mEq/kg, 3.500 mEq: <span class="hl-azul">98 % dentro</span>, <span class="hl">70 mEq (2 %) fuera</span>, y el plasma (20 % del extracelular) contiene unos <span class="hl-rojo">15 mEq: el 0,4 %</span>. Medir el K⁺ plasmático es juzgar el iceberg por su punta (E p. 18).',
        nota: '<b>Nota de fidelidad.</b> El libro imprime «50 mg/kg» donde quiere decir mEq/kg, y más adelante dice que el plasma tiene «9-10 mEq» de potasio, no los 15 de este cálculo. Se reproducen las dos cifras (E p. 18, 25).' },
      { id: 'ion-k-g2', corto: 'la curva plana', tipo: 'test', fuente: 'mr-k-curva · mar-img-36-2', modelo: [iv('normal:k'), VISUAL_HIPOK],
        enunciado: 'Con K⁺ de 4 mEq/L: ¿cuánto potasio hay que perder para bajar 1 mEq/L, y cuánto hay que ganar para subirlo 1? Primero predices, luego lo ves en el modelo.',
        opciones: [
          { t: 'Perder 100-200 mEq y ganar 200-400 mEq', porque: 'Es al revés. Con esa idea creerías que subir el K⁺ es lo difícil y repondrías de menos a quien tiene un déficit grande.' },
          { t: 'Perder 200-400 mEq y ganar 100-200 mEq por mEq/L', ok: true },
          { t: 'Lo mismo en las dos direcciones, unos 100 mEq por mEq/L', porque: 'La curva no es una recta: el potasio de dentro de la célula repone al de fuera y la depleción necesita el doble de cambio. Con la recta infravalorarías el déficit.' }],
        explicacion: 'Hace falta un <span class="hl-rojo">déficit de 200-400 mEq</span> para bajarlo 1 mEq/L y solo un <span class="hl">exceso de 100-200 mEq</span> para subirlo 1: el cambio del total es el doble en la depleción porque la reserva intracelular repone el extracelular (E p. 19, Figura 36.2).' },
      { id: 'ion-k-g3', corto: 'adónde se va', tipo: 'destapa', fuente: 'mr-hipok-redistribucion · mr-hipok-renal',
        enunciado: 'Un paciente de UCI tiene K⁺ 2,9. Antes de reponer, ¿por qué vías puede haberlo perdido de la sangre? Son tres cosas.',
        puntos: [
          '<span class="hl-azul">Redistribución</span>: los β₂ (salbutamol), la alcalosis, la hipotermia y la insulina lo meten en las células.',
          '<span class="hl-rojo">Pérdida renal</span>: los diuréticos son la primera causa; en la UCI, además, la aspiración nasogástrica, la alcalosis y la depleción de magnesio.',
          '<span class="hl">Pérdida extrarrenal</span>: sobre todo la diarrea.'],
        explicacion: 'Las tres vías de la ficha (E p. 20-21). Los β₂ inhalados bajan el K⁺ ≤0,5 mEq/L a dosis habituales, más si se combinan con diuréticos.' },
      { id: 'ion-k-g4', corto: 'el cloro', tipo: 'test', fuente: 'mr-hipok-renal · mar-img-36-3 · mr-kperd-calc', modelo: FUROSEMIDA,
        enunciado: 'Una orina aislada muestra K⁺ de 45 mEq/L y Cl⁻ de 8 mEq/L. ¿Qué causa de pérdida renal apunta?',
        opciones: [
          { t: 'Un diurético: el Cl⁻ urinario alto (>25 mEq/L) es lo típico de los diuréticos', porque: 'Con diurético el cloro de la orina sale alto, por encima de 25. Un cloro de 8 señala otra causa; si das por hecho el diurético, pasarás por alto el vómito o la aspiración.' },
          { t: 'Depleción de magnesio: altera la reabsorción tubular y el Cl⁻ sale alto', porque: 'Tampoco: la depleción de magnesio se agrupa con los diuréticos, con Cl⁻ urinario alto (>25).' },
          { t: 'Aspiración nasogástrica o alcalosis: el Cl⁻ urinario es bajo (<15 mEq/L)', ok: true }],
        explicacion: 'Con K⁺ urinario >30 mEq/L (pérdida renal), el Cl⁻ separa: <span class="hl-azul">bajo (<15)</span> con aspiración nasogástrica y alcalosis; <span class="hl-rojo">alto (>25)</span> con diuréticos y depleción de magnesio (Figura 36.3, E p. 21). La aspiración pierde poco K⁺ (10-15 mEq/L) pero la pérdida de volumen y de H⁺ aumenta la pérdida urinaria.' },
      { id: 'ion-k-g5', corto: 'qué da en el ECG', tipo: 'destapa', fuente: 'mr-hipok-clinica · mr-hipok-arritmias',
        enunciado: 'Un K⁺ de 2,6 en un paciente sin cardiopatía. Son tres cosas sobre lo que da.',
        puntos: [
          'La grave (<2,5 mEq/L) puede dar <span class="hl">debilidad muscular difusa</span>; casi siempre es silente.',
          'El ECG cambia en el 50 %: <span class="hl-azul">onda U >1 mm, T aplanada o invertida y QT largo</span>; ninguno es específico.',
          'En contra de lo que se cree, <span class="hl-rojo">sola no es un riesgo de arritmias graves</span>; suma riesgo a otras causas, como la isquemia.'],
        explicacion: 'La onda U y la T también se ven en la hipertrofia del VI (E p. 22). Que no dé arritmias graves sola no quita que la corrijas: suma a otras causas.' },
      { id: 'ion-k-g6', corto: 'el déficit', tipo: 'test', fuente: 'mr-tabla-36-1 · mr-kdef-calc', modelo: iv('rufino'),
        enunciado: 'Varón de 70 kg de peso magro con K⁺ 3,0, un valor «solo un poco bajo». ¿Qué déficit total estima la Tabla 36.1?',
        opciones: [
          { t: 'Unos 35 mEq: una ampolla y media de ClK, y repongo ya', porque: 'Esos 35 mEq corresponden a un K⁺ de 3,4. Con 3,0 repondrías de menos y el K⁺ volvería a bajar en horas.' },
          { t: 'Unos 175 mEq: el 10 % del total por cada 1 mEq/L que baja', ok: true },
          { t: 'Unos 350 mEq: el 10 % del total de 3.500 mEq, sea cual sea el K⁺', porque: 'El 10 % es por cada 1 mEq/L que baja, y 3,0 está a 0,5 de 3,5; 350 mEq serían los de un K⁺ de 2,5.' }],
        explicacion: 'Tabla 36.1: <span class="hl">se pierde un 10 % del K⁺ total por cada 1 mEq/L que baja</span>; incluso una hipopotasemia leve (3,0) supone <span class="hl-rojo">175 mEq</span>; 2,5 son 350 (E p. 22).',
        nota: '<b>Nota de precisión.</b> El libro da dos magnitudes en el mismo capítulo: 200-400 mEq por mEq/L desde un K⁺ de 4 (E p. 19) y la Tabla 36.1 desde 3,5 (E p. 22). Se muestran ambas, sin elegir una.' },
    ],
    examen: [
      { id: 'ion-k-e1', corto: 'sube despacio', tipo: 'test', fuente: 'mr-kcl-respuesta · mr-k-curva',
        enunciado: 'Un paciente con furosemida crónica lleva 8 h con 20 mEq/h de ClK y su K⁺ casi no se mueve de 2,8. ¿Qué piensas primero?',
        opciones: [
          { t: 'La curva es plana al principio; si persiste, miro antes el magnesio y no acelero', ok: true },
          { t: 'Que 20 mEq/h es poco y subir a 100 mEq/h por la cava superior, para compensar', porque: 'Pasar de 20 mEq/h por la cava superior tiene un riesgo mal documentado de asistolia, y no arreglarías la causa si falta magnesio.' },
          { t: 'Que el ClK no hace efecto en quien toma furosemida crónica, y cambiar de preparado', porque: 'No existe esa inhibición. Lo que ocurre es que el déficit de magnesio altera la reabsorción tubular de K⁺ y bloquea la corrección hasta que se repone.' }],
        explicacion: 'Al principio sube despacio (la parte plana de la curva). La hipopotasemia de quien tiene déficit de magnesio <span class="hl-rojo">no se corrige hasta reponerlo</span> (E p. 23).',
        modelo: iv('mg-bajo', 'Compruébalo con Mg bajo') },
      { id: 'ion-k-e2', corto: 'la diarrea', tipo: 'test', fuente: 'mr-hipok-extrarrenal',
        enunciado: 'En una diarrea secretora grave, ¿qué cantidad de potasio puede perder al día el paciente?',
        opciones: [
          { t: 'Poco: el K⁺ fecal es de 5-10 mEq/día, como con heces normales', porque: 'Esa es la pérdida normal por las heces. En la diarrea grave el volumen multiplica la cifra y el déficit te sorprendería.' },
          { t: 'Hasta 400 mEq/día: K⁺ fecal de 15-40 mEq/L con volúmenes de hasta 10 L', ok: true },
          { t: 'Unos 40 mEq/día: el techo que pierde el intestino aunque la diarrea sea abundante', porque: 'Con 15-40 mEq/L y hasta 10 L, el techo no es 40 sino diez veces más; con ese tope repondrías un tercio de lo perdido y el K⁺ seguiría cayendo.' }],
        explicacion: 'En la diarrea secretora e inflamatoria el K⁺ fecal es de 15-40 mEq/L y el volumen puede llegar a 10 L/día: <span class="hl-rojo">hasta 400 mEq/día</span> en los casos graves (E p. 21).' },
      { id: 'ion-k-e3', corto: 'a qué ritmo', tipo: 'test', fuente: 'mr-kcl-ritmo',
        enunciado: 'Quieres reponer a un paciente con K⁺ 2,3 y arritmias ventriculares por otra causa. ¿Qué ritmo y qué vía respetan la ficha?',
        opciones: [
          { t: '40 mEq/h por la vena cava superior, para ir rápido y corregir pronto la arritmia', porque: 'Pasar de 20 mEq/h por la cava superior tiene un riesgo, mal documentado, de asistolia: el potasio concentrado llega directo al corazón.' },
          { t: '5 mEq/h, siempre, porque más ritmo es peligroso para el corazón', porque: 'Demasiado lento para una hipopotasemia grave. La ficha admite 40 mEq/h en la grave y se han usado hasta 100 mEq/h con seguridad.' },
          { t: '20 mEq en 100 mL en 1 h; 40 mEq/h si es grave, por vena central y no cava superior', ok: true }],
        explicacion: 'Lo estándar es 20 mEq en 100 mL de salino en 1 h; el máximo suele ser 20 mEq/h, puede hacer falta <span class="hl">40 mEq/h</span> en la grave y no por la <span class="hl-rojo">cava superior si se pasa de 20 mEq/h</span> (E p. 23).' },
      { id: 'ion-k-e4', corto: 'la nota de guardia', tipo: 'error', fuente: 'mr-kcl-preparados · mr-hipok-arritmias · mr-hipok-redistribucion',
        enunciado: 'El R1 anota su plan para un K⁺ de 3,0. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Quito primero lo que mete K⁺ en las células, como la alcalosis, y luego repongo.' },
          { t: 'La hipopotasemia por sí sola ya es un gran riesgo de arritmias graves: pongo ClK de 2 mEq/mL directo.', mal: true,
            c: 'El ClK de 2 mEq/mL tiene <span class="hl-rojo">4.000 mOsm/L</span>: siempre diluido. Y la hipopotasemia sola no es un riesgo de arritmias graves.' },
          { t: 'Con 3,0 calculo un déficit de unos 175 mEq.' },
          { t: 'Si es grave y la urgencia manda, paso 40 mEq/h por la vena cava superior.', mal: true,
            c: 'Por encima de 20 mEq/h la <span class="hl-rojo">cava superior no se recomienda</span> (riesgo, mal documentado, de asistolia): vena central grande.' },
          { t: 'Paso 20 mEq en 100 mL de salino en 1 hora y, si no sube, miro el magnesio.' }],
        explicacion: 'Primero eliminar lo que mete K⁺ en las células; el cloruro potásico concentrado es muy hiperosmótico y va diluido; sola, la hipopotasemia no da arritmias graves (E p. 22-23).' },
      { id: 'ion-k-e5', corto: 'el fosfato potásico', tipo: 'test', fuente: 'mr-kcl-preparados',
        enunciado: 'Una paciente con cetoacidosis necesita potasio. ¿Qué preparado prefieren algunos, y qué lleva por mL?',
        opciones: [
          { t: 'Fosfato potásico: 4,5 mEq de K⁺ y 3 mmol de fosfato por mL', ok: true },
          { t: 'Cloruro potásico de 1-2 mEq/mL en ampollas de 10 a 40 mEq, porque también repone el fosfato', porque: 'El cloruro no lleva fosfato. Pretender reponer el fosfato de la cetoacidosis con ClK dejaría el fósforo bajo.' },
          { t: 'Acetato potásico de 4.000 mOsm/L', porque: 'Esos 4.000 mOsm/L son del cloruro potásico de 2 mEq/mL, y el acetato no se nombra en la ficha.' }],
        explicacion: 'El fosfato potásico (4,5 mEq de K⁺ y 3 mmol de fosfato por mL) lo prefieren algunos en la cetoacidosis (E p. 23).',
        nota: '<b>Nota de fuentes.</b> El cap. 36 (E p. 23) da 4,5 mEq/mL; la Tabla 38.5 (E p. 51) imprime 4,3 mEq. Es la misma solución con dos cifras: se reproducen ambas.' },
    ],
    casos: [
      { id: 'ion-k-rufino', titulo: 'Rufino, 74 años: el cloro, el déficit y el ritmo', corto: 'Caso · Rufino (K⁺)', sub: 'obstrucción intestinal, SNG y furosemida',
        paciente: { Edad: '74 años', Motivo: 'obstrucción intestinal; sonda nasogástrica desde hace 5 días', Fármaco: 'furosemida crónica' },
        lleva: [
          'El Cl⁻ urinario separa la causa: bajo (<15) con aspiración y alcalosis; alto (>25) con diuréticos.',
          'Un K⁺ de 2,8 son unos 245 mEq de déficit: a 20 mEq/h, más de 12 horas.',
          'Si el K⁺ no sube, mira el magnesio antes de acelerar el ritmo.'],
        volver: { nombre: 'Hipopotasemia', ancla: 'mr-hipopotasemia', modelo: iv('mg-bajo', 'Compruébalo con Mg bajo') },
        pasos: [
          { momento: 'Día 5 · el análisis', datos: { 'K⁺': '2,8 mEq/L', 'HCO₃⁻': '42 mEq/L', 'K⁺ urinario': '45 mEq/L', 'Cl⁻ urinario': '12 mEq/L' }, nuevo: ['K⁺', 'HCO₃⁻', 'K⁺ urinario', 'Cl⁻ urinario'],
            pregunta: { id: 'ion-k-r1', tipo: 'test', fuente: 'mr-hipok-renal · mr-hipok-extrarrenal', modelo: FUROSEMIDA, origen: 'ficha · cifras del caso, ilustrativas',
              enunciado: 'Rufino toma furosemida desde hace años. Con K⁺ urinario de 45 y Cl⁻ urinario de 12 mEq/L, ¿qué pérdida apunta el análisis?',
              opciones: [
                { t: 'Un diurético: el Cl⁻ urinario bajo es lo típico de la furosemida', porque: 'Con diuréticos el Cl⁻ urinario sale alto (>25 mEq/L). Dar por hecho el diurético te haría pasar por alto la aspiración y la alcalosis, que se mantienen.' },
                { t: 'Diarrea: el K⁺ urinario de 45 no cuenta y el Cl⁻ bajo indica pérdida digestiva', porque: 'Un K⁺ urinario >30 mEq/L es pérdida renal. Culpar al intestino te dejaría sin explicar por qué el riñón pierde potasio.' },
                { t: 'Pérdida renal con la aspiración nasogástrica y la alcalosis como causa', ok: true }],
              explicacion: 'K⁺ urinario >30 mEq/L = pérdida renal; el Cl⁻ separa: <span class="hl-azul">bajo (<15)</span> con aspiración nasogástrica y alcalosis, <span class="hl-rojo">alto (>25)</span> con diuréticos y depleción de magnesio (Figura 36.3, E p. 21). No se excluyen: puede haber un Cl⁻ urinario bajo por la aspiración y, a la vez, un Mg²⁺ bajo; por eso se mide el magnesio en toda hipopotasemia que no sube (fisiología general; E p. 23).' } },
          { momento: 'Día 5 · cuánto falta', datos: { 'K⁺': '2,8 mEq/L', Peso: '70 kg de peso magro' }, nuevo: ['Peso'],
            pregunta: { id: 'ion-k-r2', tipo: 'test', fuente: 'mr-tabla-36-1 · mr-kdef-calc', modelo: iv('rufino'), origen: 'ficha · Tabla 36.1; horas: ilustrativo',
              enunciado: 'Con K⁺ 2,8 y 70 kg magros, ¿qué déficit total estima la Tabla 36.1 y cuánto tardas en cubrirlo a 20 mEq/h?',
              opciones: [
                { t: 'Unos 245 mEq según la Tabla 36.1: más de 12 horas a 20 mEq/h de ClK, sin parar', ok: true },
                { t: 'Unos 175 mEq: algo más de 8 horas, que es el déficit de un K⁺ de 3,0', porque: 'Esos 175 mEq son los de 3,0. Con 2,8 te faltarían 70 mEq y daría por terminada la reposición con el K⁺ aún bajo.' },
                { t: 'Unos 40 mEq: dos ampollas, porque Rufino solo tiene una hipopotasemia moderada y estable', porque: 'Ya con 3,4 son 35 mEq; con 2,8 reponer 40 sería cubrir el 16 % del déficit y el K⁺ se quedaría bajo.' }],
              explicacion: 'Tabla 36.1: <span class="hl-rojo">245 mEq</span> para 2,8 (un 10 % del total por cada mEq/L). A 20 mEq/h son unas 12 horas (E p. 22-23).' } },
          { momento: 'Día 5 · la pauta', datos: { Pauta: 'ClK' }, nuevo: ['Pauta'],
            pregunta: { id: 'ion-k-r3', tipo: 'destapa', fuente: 'mr-kcl-ritmo · mr-kcl-preparados', modelo: iv('rufino'), origen: 'ficha',
              enunciado: 'Quieres reponer el potasio de Rufino. ¿Cómo lo pautas? Son tres cosas.',
              puntos: [
                '<span class="hl">20 mEq en 100 mL de salino en 1 hora</span>: el máximo suele fijarse en 20 mEq/h.',
                'El ClK concentrado (2 mEq/mL = 4.000 mOsm/L) <span class="hl-rojo">va siempre diluido</span>.',
                'Mejor por <span class="hl-azul">vena central grande</span>, y no por la cava superior si pasas de 20 mEq/h.'],
              explicacion: 'Se puede llegar a 40 mEq/h si es grave (E p. 23). La ficha da la pauta, no el ritmo de Rufino: el suyo, de 20 mEq/h, es el estándar.' } },
          { momento: 'Día 5 · 8 horas después · el giro', datos: { 'K⁺': '2,8 mEq/L', 'Mg²⁺': '1,0 mEq/L', Reposición: '160 mEq en 8 h' }, nuevo: ['K⁺', 'Mg²⁺', 'Reposición'],
            pregunta: { id: 'ion-k-r4', tipo: 'test', fuente: 'mr-kcl-respuesta · mr-hipok-renal', modelo: iv('mg-bajo', 'Compruébalo con Mg bajo'), origen: 'ficha · cifras del caso, ilustrativas',
              enunciado: 'Han pasado 160 mEq y el K⁺ sigue en 2,8, con un magnesio de 1,0. ¿Qué haces?',
              opciones: [
                { t: 'Subo a 40 mEq/h por la cava superior para vencer la resistencia', porque: 'No es lo que frena el K⁺, y pasar de 20 mEq/h por la cava superior tiene riesgo de asistolia, mal documentado.' },
                { t: 'Repongo el magnesio por vía IV y mantengo el ClK al ritmo estándar de 20 mEq/h', ok: true },
                { t: 'Espero 24 horas sin tocar nada: la curva es plana y acabará subiendo', porque: 'La parte plana explica una subida lenta al principio, pero con el magnesio bajo no se corrige: perderías un día con el potasio en riesgo.' }],
              explicacion: 'La hipopotasemia de quien tiene <span class="hl-rojo">déficit de magnesio no se corrige hasta reponerlo</span>: el magnesio bajo favorece la pérdida urinaria de K⁺ (E p. 23).' } },
          { momento: 'Día 6 · el plan',
            pregunta: { id: 'ion-k-r5', tipo: 'error', fuente: 'mr-kcl-preparados · mr-kcl-ritmo · mr-hipok-renal',
              enunciado: 'El residente anota el plan de Rufino. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'El Cl⁻ urinario de 12 apunta a la aspiración y la alcalosis, no a la furosemida.' },
                { t: 'Calculo un déficit de unos 245 mEq con la Tabla 36.1.' },
                { t: 'Para ir más rápido, ClK de 2 mEq/mL sin diluir por una vía central.', mal: true,
                  c: 'El ClK de 2 mEq/mL tiene <span class="hl-rojo">4.000 mOsm/L</span>: va siempre diluido.' },
                { t: 'Si a las 8 h no sube, doblo a 40 mEq/h por la cava superior.', mal: true,
                  c: 'Pasar de 20 mEq/h por la <span class="hl-rojo">cava superior</span> no se recomienda; y si no sube, se mira el magnesio.' },
                { t: 'Si el K⁺ no responde, repito el magnesio antes de acelerar.' }],
              explicacion: 'El ClK va diluido, el ritmo se limita en la cava superior y la resistencia se explica por el magnesio (E p. 21-23).' } },
          { momento: 'Día 6 · con el magnesio repuesto', datos: { 'K⁺': '3,4 mEq/L' }, nuevo: ['K⁺'],
            pregunta: { id: 'ion-k-r6', tipo: 'test', fuente: 'mr-tabla-36-1 · mr-hipok-renal', modelo: iv('reponer-mg', 'Compruébalo con el Mg repuesto'), origen: 'ficha · K⁺ del caso, ilustrativo',
              enunciado: 'Repuesto el magnesio, el K⁺ llega a 3,4. ¿Paras ya la reposición?',
              opciones: [
                { t: 'Sí: 3,4 está casi normal y seguir es innecesario', porque: 'Con 3,4 siguen faltando unos 35 mEq (Tabla 36.1) y la sonda y la furosemida siguen perdiendo potasio: volvería a bajar.' },
                { t: 'No: aún faltan unos 35 mEq y las pérdidas continúan; repongo y vigilo el K⁺', ok: true },
                { t: 'No: subo a 40 mEq/h para terminar pronto', porque: 'Con un déficit de 35 mEq no se justifica el ritmo máximo, reservado a la hipopotasemia grave.' }],
              explicacion: 'Tabla 36.1: <span class="hl">35 mEq</span> para 3,4. La causa sigue activa (aspiración y diurético), así que se sigue reponiendo y vigilando (E p. 22-23).' } },
        ] },
    ],
    profundizar: [
      { id: 'mr-k-excrecion', titulo: 'Eliminación: cifras de heces, sudor y orina' },
      { id: 'mr-kcl-preparados', titulo: 'Preparados de potasio y su osmolaridad' },
    ],
  },

  /* =================================================================================================
     XVII · Hiperpotasemia: causas y ECG (E p. 23-27)
     ================================================================================================= */
  'mr-hiperk-causas': {
    entrada: 'Cómo saber si la hiperpotasemia es real, por qué casi siempre hay un defecto renal detrás y por qué el ECG no predice el K⁺.',
    guia: [
      { id: 'ion-k-h1', corto: 'los dos mecanismos', tipo: 'test', fuente: 'mr-hiperk-mecanismos',
        enunciado: 'K⁺ de 6,4 y no sabes por qué. ¿Qué dato de una muestra de orina separa los dos mecanismos de la hiperpotasemia?',
        opciones: [
          { t: 'K⁺ urinario >30 mEq/L: el riñón no está excretando el potasio que sobra', porque: 'Es al revés: un K⁺ urinario alto indica que el riñón sí elimina potasio. La señal de excreción alterada es la cifra baja.' },
          { t: 'K⁺ urinario <30 mEq/L: la excreción renal está alterada', ok: true },
          { t: 'Cl⁻ urinario <15 mEq/L: el potasio sale de las células', porque: 'El Cl⁻ urinario es la herramienta de la hipopotasemia (Figura 36.3), no de esta; con él no separarías la salida celular del fallo renal.' }],
        explicacion: 'Dos mecanismos: <span class="hl-azul">salida de K⁺ de las células</span> o <span class="hl-rojo">fallo de la excreción renal</span>. Si no está claro, K⁺ urinario <30 mEq/L = excreción renal alterada (E p. 23).' },
      { id: 'ion-k-h2', corto: 'falsa alarma', tipo: 'destapa', fuente: 'mr-pseudohiperk · mr-ficticia-calc', modelo: iv('adela'),
        enunciado: 'El laboratorio informa K⁺ 6,9 en un tubo hemolizado. ¿Cómo puede ser que la cifra exista en el tubo y no en la sangre? Son tres cosas.',
        puntos: [
          'Las <span class="hl">células dañadas liberan K⁺</span> al extraer la muestra: casi siempre hemólisis.',
          'También las <span class="hl-azul">plaquetas >500 × 10⁹/L</span> o la leucocitosis grave de los síndromes linfoproliferativos.',
          'Contribuyen <span class="hl-rojo">cerrar el puño</span>, aspirar con fuerza, el tubo neumático y el retraso en procesarla.'],
        explicacion: 'Sospéchala si no hay motivo aparente para la hiperpotasemia (el laboratorio a menudo no la detecta): saca tú la muestra, evitando esos factores (E p. 23-24).' },
      { id: 'ion-k-h3', corto: 'siempre es renal', tipo: 'test', fuente: 'mr-hiperk-renal · mr-tabla-36-2',
        enunciado: 'Un paciente con K⁺ 6,2 mantenido durante días tiene función renal «normal» en el análisis y toma enalapril y suplementos de K⁺. ¿Cómo lo interpretas?',
        opciones: [
          { t: 'Un exceso de aporte de los suplementos: un riñón sano siempre elimina una carga de K⁺, sin más', porque: 'Un riñón sano sí elimina la carga, y por eso mismo, si la hiperpotasemia se mantiene, hay un defecto renal detrás. Culpar solo al aporte te haría seguir con el IECA.' },
          { t: 'Una salida de K⁺ de las células, porque no se mantiene sin ella', porque: 'La salida celular da una subida transitoria. Una mantenida implica, al menos en parte, un defecto de excreción.' },
          { t: 'Hay un defecto renal en la excreción, aunque sea parcial, y el IECA pesa en él', ok: true }],
        explicacion: 'Como el riñón puede eliminar una carga de K⁺, <span class="hl-rojo">toda hiperpotasemia mantenida implica, al menos en parte, un defecto renal</span>: enfermedad renal, insuficiencia suprarrenal (solo la crónica) o fármacos. Todos los de la columna «reducen la excreción renal» de la Tabla 36.2 actúan sobre el eje renina-angiotensina-aldosterona, salvo el trimetoprim-sulfametoxazol (E p. 25).' },
      { id: 'ion-k-h4', corto: 'las bolsas', tipo: 'test', fuente: 'mr-hiperk-transfusion', modelo: iv('valentin'),
        enunciado: 'Un politrauma recibe 10 concentrados de hematíes en 3 h. Predice: ¿cuánto potasio lleva cada unidad de 18 días de almacenamiento?',
        opciones: [
          { t: '2-3 mEq por unidad: a 4 °C la bomba del hematíe se para y el K⁺ sale', ok: true },
          { t: '20-30 mEq por unidad de 18 días, que explicaría un K⁺ de 8 con solo dos bolsas', porque: 'Diez veces más de lo real. Esperar tanto te haría buscar otra causa mayor cuando es la suma de muchas unidades lo que pesa.' },
          { t: 'Nada: las bolsas se lavan y no llevan K⁺', porque: 'La transfusión masiva (≥6 unidades) es una causa descrita de hiperpotasemia. Si lo descartas, no la sospecharás en un paciente con flujo renal comprometido.' }],
        explicacion: 'Tras 18 días (la media), una unidad lleva <span class="hl">2-3 mEq</span>: 6 unidades son al menos 12-18 mEq, una carga considerable frente a los <span class="hl-azul">9-10 mEq</span> de K⁺ del plasma. La hiperpotasemia empieza a verse tras 7 unidades (E p. 25).' },
      { id: 'ion-k-h5', corto: 'qué ve el ECG', tipo: 'test', fuente: 'mr-hiperk-amenaza · mr-ecg-hiperk · mar-img-36-4', modelo: ritmo('hiperk', 'Compruébalo en el corazón eléctrico'),
        enunciado: 'Predice el orden en que aparecen los cambios del ECG con el K⁺ subiendo.',
        opciones: [
          { t: 'QRS ancho; después T picuda; después P larga y plana; después FV o asistolia', porque: 'El orden es otro: la T picuda abre la serie. Esperar al QRS ancho para actuar es llegar cuando el bloqueo ya ha empezado.' },
          { t: 'T picuda; P baja y PR largo; sin P y QRS ancho; FV', ok: true },
          { t: 'Onda U prominente; T aplanada; QT largo; torsade', porque: 'Esos son los cambios de la hipopotasemia, no de la hiperpotasemia.' }],
        explicacion: 'La hiperpotasemia despolariza el miocardio y enlentece la conducción: T alta y picuda, baja la P y se alarga el PR, desaparece la P y se ensancha el QRS (bloqueo completo), FV o asistolia (Figura 36.4, E p. 26).' },
      { id: 'ion-k-h6', corto: 'el ECG engaña', tipo: 'destapa', fuente: 'mr-ecg-correlacion',
        enunciado: '¿Por qué un ECG normal no te tranquiliza con un K⁺ alto? Son tres cosas.',
        puntos: [
          'Se enseña que los cambios aparecen hacia 6 mEq/L, pero en un estudio <span class="hl-rojo">solo el 40 % con K⁺ >7</span> tenía cambios.',
          'Hay un caso de <span class="hl">14 mEq/L sin cambios</span>.',
          'Se ha sugerido que la hiperpotasemia sola quizá <span class="hl-azul">no explica los cambios del ECG</span>.'],
        explicacion: 'Sin correlación predecible entre K⁺ y ECG (E p. 26-27). Por eso el tratamiento se indica por el K⁺ o por el ECG: cualquiera de los dos.' },
    ],
    examen: [
      { id: 'ion-k-x1', corto: 'los fármacos', tipo: 'test', fuente: 'mr-tabla-36-2 · mr-hiperk-renal',
        enunciado: 'De los fármacos de la Tabla 36.2, ¿cuál sube el K⁺ inhibiendo directamente la secreción distal, sin pasar por el eje renina-angiotensina-aldosterona?',
        opciones: [
          { t: 'La espironolactona, porque bloquea el receptor de la aldosterona en el distal', porque: 'Bloquea la aldosterona, es decir, actúa justo sobre ese eje. Cambiar entre estos fármacos no te ayudaría a explicar el mecanismo.' },
          { t: 'El enalapril', porque: 'Un IECA frena la angiotensina II y por tanto la aldosterona: actúa sobre el eje.' },
          { t: 'El trimetoprim-sulfametoxazol', ok: true }],
        explicacion: 'Todos los de la columna «reducen la excreción renal» actúan sobre el eje renina-angiotensina-aldosterona (IECA, ARA-II, espironolactona, AINE, amilorida), salvo el <span class="hl-rojo">trimetoprim-sulfametoxazol</span>, que inhibe directamente la secreción distal (E p. 25).' },
      { id: 'ion-k-x2', corto: 'lisis tumoral', tipo: 'test', fuente: 'mr-hiperk-lisis',
        enunciado: 'Linfoma no Hodgkin recién iniciada la quimioterapia. ¿Cuándo aparece el síndrome de lisis tumoral y qué amenaza es la más inmediata?',
        opciones: [
          { t: 'En 7 días tras la quimioterapia; la hiperpotasemia es la inmediata', ok: true },
          { t: 'A las 6 semanas del inicio de la quimioterapia; la hiperuricemia, que da el FRA', porque: 'Aparece en la primera semana. Esperar a las semanas te haría no vigilar el K⁺ cuando es más peligroso.' },
          { t: 'En los 7 días tras iniciar la citotoxicidad; la hipocalcemia', porque: 'La hipocalcemia forma parte del síndrome, pero la ficha señala la hiperpotasemia como la amenaza más inmediata.' }],
        explicacion: 'En los <span class="hl">7 días</span> tras iniciar la citotoxicidad: hiperpotasemia, hiperfosfatemia, hipocalcemia e hiperuricemia, a menudo con FRA. La hiperpotasemia es la amenaza más inmediata (E p. 24).' },
      { id: 'ion-k-x3', corto: 'la succinilcolina', tipo: 'error', fuente: 'mr-digital-succi · mr-hiperk-acidosis',
        enunciado: 'Un residente repasa causas de hiperpotasemia. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'La succinilcolina sube el K⁺ menos de 1 mEq/L durante 5-10 min.' },
          { t: 'La acidosis láctica se asocia siempre a hiperpotasemia por la competencia H⁺/K⁺.', mal: true,
            c: 'La relación se cuestiona: la <span class="hl-rojo">acidosis láctica no se asocia</span> a hiperpotasemia y la respiratoria lo hace de forma inconstante.' },
          { t: 'La digital da hiperpotasemia con la dosis habitual, porque inhibe la bomba.', mal: true,
            c: 'La digital inhibe la bomba, pero solo da hiperpotasemia en la <span class="hl-rojo">intoxicación aguda</span>.' },
          { t: 'La transfusión de 6 o más unidades de sangre almacenada puede subir el potasio.' },
          { t: 'La lisis tumoral da hiperpotasemia, hiperfosfatemia, hipocalcemia e hiperuricemia.' }],
        explicacion: 'La succinilcolina sube el K⁺ <1 mEq/L unos 5-10 min, pero puede subirlo de forma peligrosa en la lesión medular («hipersensibilidad por denervación») (E p. 24).' },
      { id: 'ion-k-x4', corto: 'sospecha ficticia', tipo: 'test', fuente: 'mr-pseudohiperk',
        enunciado: 'K⁺ de 7,1 en un paciente con 600 × 10⁹/L de plaquetas, sin causa aparente de hiperpotasemia y con el ECG sin cambios. ¿Qué haces?',
        opciones: [
          { t: 'Trato ya con calcio e insulina: K⁺ >6,5 es grave sea cual sea la causa', porque: 'Con plaquetas >500 y sin causa aparente la cifra puede no existir en la sangre; tratarla sin confirmar expone al paciente a un tratamiento que no necesita.' },
          { t: 'Pido que el laboratorio repita la cifra en el mismo tubo', porque: 'Las plaquetas siguen liberando K⁺ en el tubo: repetirlo en él da la misma cifra falsa y retrasa la decisión.' },
          { t: 'Saco yo la muestra evitando puño y succión fuerte, la proceso pronto y miro el ECG', ok: true }],
        explicacion: 'Sospecha la hiperpotasemia ficticia si no hay causa aparente (a menudo el laboratorio no la detecta): saca tú la muestra evitando el puño cerrado, la aspiración fuerte, el tubo neumático y el retraso; las plaquetas >500 × 10⁹/L y la leucocitosis grave también la producen (E p. 23-24). Con el ECG sin cambios, la fuente deja el calcio para cuando los haya (E p. 27); lo primero es otra muestra bien extraída (E p. 24).' },
    ],
    casos: [
      { id: 'ion-k-gregorio', titulo: 'Gregorio, 57 años: el potasio del músculo', corto: 'Caso · Gregorio', sub: 'rabdomiólisis tras 14 h en el suelo',
        paciente: { Edad: '57 años', Motivo: 'caída en el domicilio; 14 h en el suelo', Análisis: 'CK 48.000 U/L, Cr 2,4 mg/dL (ilustrativo)' },
        lleva: [
          'La rabdomiólisis saca el potasio de las células; con el riñón fallando, se mantiene.',
          'Cualquier K⁺ con cambios del ECG es grave: no esperes al 6,5.',
          'El calcio protege el corazón y no baja el K⁺: sigue con insulina y eliminación.'],
        volver: { nombre: 'Causas de la hiperpotasemia', ancla: 'mr-hiperk-causas', modelo: ritmo('hiperk', 'Compruébalo en el corazón eléctrico') },
        pasos: [
          { momento: 'Urgencias · el análisis', datos: { 'K⁺ (muestra bien extraída)': '6,3 mEq/L', CK: '48.000 U/L', Cr: '2,4 mg/dL' }, nuevo: ['K⁺ (muestra bien extraída)', 'CK', 'Cr'],
            pregunta: { id: 'ion-k-gr1', tipo: 'test', fuente: 'mr-hiperk-salida · mr-hiperk-renal · mr-pseudohiperk', origen: 'ficha · cifras del caso, ilustrativas',
              enunciado: 'La muestra se extrajo bien. ¿De dónde sale el potasio de Gregorio y por qué se mantiene?',
              opciones: [
                { t: 'Es ficticia: el músculo lesionado libera potasio también en el tubo', porque: 'La muestra es buena y hay causa evidente. La sospecha de falsa alarma se reserva para cuando no hay motivo aparente.' },
                { t: 'Solo sale de las células: el riñón no interviene en una causa muscular', porque: 'Toda hiperpotasemia mantenida implica un defecto renal, al menos en parte. Ignorar la Cr de 2,4 te dejaría sin la causa que impide eliminarlo.' },
                { t: 'Sale del músculo lesionado, y se mantiene porque el riñón no lo excreta', ok: true }],
              explicacion: 'La rabdomiólisis está entre las causas de <span class="hl-azul">salida de K⁺ de las células</span> (E p. 24); como el riñón sano elimina una carga de K⁺, <span class="hl-rojo">si se mantiene hay un defecto renal</span> (E p. 25). Aquí, la creatinina de 2,4.' } },
          { momento: 'Urgencias · el ECG', datos: { ECG: 'T picudas' }, nuevo: ['ECG'],
            pregunta: { id: 'ion-k-gr2', tipo: 'test', fuente: 'mr-hiperk-grave · mr-ecg-hiperk', modelo: ritmo('hiperk', 'Compruébalo en el corazón eléctrico'), origen: 'ficha',
              enunciado: 'El ECG de Gregorio tiene T picudas con K⁺ 6,3, por debajo de 6,5. ¿Lo tratas como grave?',
              opciones: [
                { t: 'No: grave es K⁺ >6,5, y espero al próximo análisis', porque: 'La definición de grave incluye cualquier K⁺ con cambios del ECG. Esperar con T picudas es dejar avanzar el bloqueo.' },
                { t: 'Sí: con cambios del ECG ya es grave aunque no pase de 6,5', ok: true },
                { t: 'Solo si aparece el QRS ancho: la T picuda es el último cambio', porque: 'La T picuda abre la serie del ECG; el QRS ancho llega después, cuando el bloqueo ya está en marcha.' }],
              explicacion: 'Grave: <span class="hl-rojo">K⁺ >6,5 o cualquier K⁺ con cambios del ECG</span>; y la T alta y picuda es el primero de esos cambios (E p. 26-27).' } },
          { momento: 'Urgencias · lo que viene', datos: { Orina: 'oliguria' }, nuevo: ['Orina'],
            pregunta: { id: 'ion-k-gr3', tipo: 'destapa', fuente: 'mr-hiperk-salida · mr-hiperk-renal · mr-ecg-correlacion', origen: 'ficha',
              enunciado: 'Aunque hoy sea 6,3, el K⁺ de Gregorio puede subir. ¿Por qué? Son tres cosas.',
              puntos: [
                'La rabdomiólisis es una causa de <span class="hl-azul">salida de K⁺ de las células</span>.',
                'Con FRA, el riñón <span class="hl-rojo">no excreta</span> la carga: ese defecto la mantiene.',
                'El ECG y la cifra <span class="hl">no se correlacionan</span>: la cifra no predice los cambios del ECG (E p. 29).'],
              explicacion: 'Por eso se trata por la cifra o por el ECG, cualquiera de los dos, sin esperar (E p. 24-27).' } },
          { momento: 'Hora 2 · el giro', datos: { 'K⁺': '6,8 mEq/L', ECG: 'QRS ancho', 'Ca²⁺ iónico': '0,95 mmol/L' }, nuevo: ['K⁺', 'ECG', 'Ca²⁺ iónico'],
            pregunta: { id: 'ion-k-gr4', tipo: 'test', fuente: 'mr-tabla-36-3 · mr-calcio-preparados', modelo: ritmo('hiperk', 'Compruébalo en el corazón eléctrico'), origen: 'ficha · cifras del caso, ilustrativas',
              enunciado: 'A las 2 horas el QRS se ensancha y el K⁺ es 6,8. ¿Qué haces primero?',
              opciones: [
                { t: 'Gluconato cálcico 10 mL en 3 min y después insulina con glucosa', ok: true },
                { t: 'Insulina 10 U con glucosa: es lo que baja el K⁺, y el calcio después', porque: 'La insulina tarda en actuar y no protege el corazón. Con el QRS ancho, el primer objetivo es bloquear el efecto sobre la conducción.' },
                { t: 'Bicarbonato en bolo para meter el K⁺ en las células', porque: 'Sin acidosis metabólica no cambia el K⁺ y forma complejos con el calcio que vas a necesitar.' }],
              explicacion: 'Primero <span class="hl">estabilizar el corazón</span> con gluconato (10 mL en 3 min), luego insulina con glucosa (E p. 27-28). El calcio iónico de 0,95 es un dato del caso (ilustrativo): aquí la indicación la da el ECG.' } },
          { momento: 'Hora 2 · el plan',
            pregunta: { id: 'ion-k-gr5', tipo: 'error', fuente: 'mr-hiperk-renal · mr-bicarb-k · mr-calcio-preparados',
              enunciado: 'El residente anota su plan. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Gluconato cálcico 10 mL en 3 min y repito a los 5 min si el ECG no mejora.' },
                { t: 'La hiperpotasemia mantenida de Gregorio implica un defecto renal: la creatinina lo confirma.' },
                { t: 'Pido un K⁺ urinario: si es mayor de 30 mEq/L, el riñón no está excretando.', mal: true,
                  c: 'Un K⁺ urinario <span class="hl-rojo"><30 mEq/L</span> indica excreción alterada; si es alto, el riñón sí elimina potasio.' },
                { t: 'Añado bicarbonato en bolo para meter el K⁺ en las células.', mal: true,
                  c: 'Sin acidosis metabólica <span class="hl-rojo">no cambia el K⁺</span> y forma complejos con el calcio.' }],
              explicacion: 'El K⁺ urinario <30 mEq/L separa el fallo de excreción (E p. 23) y el bicarbonato no sirve sin acidosis (E p. 28).' } },
          { momento: 'Hora 6 · sacar el potasio', datos: { 'K⁺': '6,2 mEq/L', Orina: 'oliguria' }, nuevo: ['K⁺'],
            pregunta: { id: 'ion-k-gr6', tipo: 'test', fuente: 'mr-hd-k · mr-szc', modelo: FILTRO_K, origen: 'ficha · K⁺ del caso, ilustrativo',
              enunciado: 'Tras calcio e insulina, el K⁺ está en 6,2 y sigue oligúrico. ¿Qué método elimina el exceso con más eficacia?',
              opciones: [
                { t: 'Hemodiálisis: baja 1 mEq/L en 1 h y es la más eficaz', ok: true },
                { t: 'Resina de poliestireno: es la más eficaz y rápida', porque: 'La ficha le da eficacia dudosa, inicio lento y casos de necrosis intestinal; con oliguria perderías horas.' },
                { t: 'Salbutamol en aerosol, que baja el K⁺ más de 1 mEq/L de golpe', porque: 'Baja menos de 0,5 mEq/L a dosis terapéuticas y nunca solo: no elimina el exceso.' }],
              explicacion: 'La <span class="hl-rojo">hemodiálisis</span> es la más eficaz (1 mEq/L en 1 h, 2 mEq/L en 3 h) (E p. 28-29).' } },
        ] },
    ],
    profundizar: [
      { id: 'mr-digital-succi', titulo: 'Digital y succinilcolina' },
      { id: 'mr-cautopireiofagia', titulo: 'Todo es posible: la cautopireiofagia' },
    ],
  },

  /* =================================================================================================
     XVIII · Hiperpotasemia grave: tratamiento (E p. 27-28)
     ================================================================================================= */
  'mr-hiperk-tratamiento': {
    entrada: 'Por qué el calcio arregla el ECG sin bajar el K⁺, qué hace cada fármaco, cuánto dura y por qué el bicarbonato no está en la lista.',
    guia: [
      { id: 'ion-k-t1', corto: 'los tres objetivos', tipo: 'test', fuente: 'mr-hiperk-grave · mr-tabla-36-3', modelo: FILTRO_K,
        enunciado: 'K⁺ de 6,6 con cambios del ECG. Antes de leer la tabla: ¿en qué orden se persiguen los tres objetivos?',
        opciones: [
          { t: 'Sacar el exceso, meter K⁺ en las células y estabilizar el corazón', porque: 'Invierte el orden. Empezar por lo más lento (la resina o la diálisis) deja el corazón desprotegido durante la espera.' },
          { t: 'Bloquear el efecto sobre la conducción, meter K⁺ en las células y sacar el exceso', ok: true },
          { t: 'Meter K⁺ en las células, sacar el exceso y, si hay tiempo, proteger el corazón', porque: 'Protegerlo no es opcional ni queda para el final: la amenaza principal es el bloqueo de la conducción.' }],
        explicacion: 'Definición: <span class="hl-rojo">K⁺ >6,5, o cualquier K⁺ con cambios del ECG</span>. Tres objetivos en orden: a) <span class="hl">estabilizar el corazón</span>, b) meter K⁺ en las células, c) eliminar el exceso (E p. 27).' },
      { id: 'ion-k-t2', corto: 'el calcio', tipo: 'destapa', fuente: 'mr-calcio-hiperk · mr-calcio-efecto', modelo: ritmo('hiperk', 'Compruébalo en el corazón eléctrico'),
        enunciado: 'Dar calcio no baja el K⁺ y, sin embargo, es el tratamiento de elección. ¿Por qué? Son tres cosas.',
        puntos: [
          'La hiperpotasemia <span class="hl-rojo">despolariza el miocardio</span>, cierra canales de sodio y enlentece la conducción.',
          'El calcio <span class="hl-azul">hiperpolariza</span> y lo antagoniza: protege el corazón sin cambiar la cifra.',
          'El efecto llega en minutos pero <span class="hl">se disipa en 30-60 min</span>: hay que combinarlo con lo demás.'],
        explicacion: 'Es el tratamiento de elección de la cardiotoxicidad (E p. 27). Que el K⁺ no baje explica que, si no haces nada más, el ECG vuelva a empeorar cuando el calcio se acaba.' },
      { id: 'ion-k-t3', corto: 'gluconato o cloruro', tipo: 'test', fuente: 'mr-calcio-preparados · mr-calcio-indicaciones', modelo: iv('adela:4'),
        enunciado: 'Un paciente con K⁺ 6,8 y T picudas, estable, sin colapso. ¿Qué calcio eliges y por qué?',
        opciones: [
          { t: 'Cloruro cálcico, porque lleva tres veces más calcio', porque: 'Esa potencia es precisamente la razón de reservarlo para el colapso o la parada; en un paciente estable no hace falta.' },
          { t: 'Gluconato cálcico al 10 %: 10 mL en 3 min, repetibles a los 5; el cloruro (27 mg/mL frente a 9) queda para el colapso', ok: true },
          { t: 'Ninguno todavía: primero insulina con glucosa y el calcio solo si el ECG empeora', porque: 'El primer objetivo es proteger la conducción, y ya hay T picudas: esperar a que se ensanche el QRS es dejar al corazón sin protección mientras la insulina empieza a hacer efecto.' }],
        explicacion: 'Gluconato al 10 %: <span class="hl">9 mg/mL de calcio elemento</span> (ampolla de 10 mL). Cloruro al 10 %: <span class="hl-rojo">27 mg/mL</span>, tres veces más; se reserva para el colapso cardiovascular o la parada (E p. 27).' },
      { id: 'ion-k-t4', corto: 'insulina y β₂', tipo: 'test', fuente: 'mr-insulina-k · mr-beta2-k', modelo: iv('adela:4'),
        enunciado: 'Predice: tras 10 U de insulina con 50 mL de glucosa al 50 %, ¿cuánto baja el K⁺, cuándo es el pico y qué hay del salbutamol?',
        opciones: [
          { t: 'Baja 3 mEq/L en 5 min y es definitivo; el salbutamol a dosis habituales es igual de potente', porque: 'Es temporal (pico a los 30-60 min) y modesto. Si lo crees definitivo, no seguirás con la eliminación y el K⁺ volverá a subir.' },
          { t: 'Baja 0,6 mEq/L pero el salbutamol a dosis doble lo supera sin riesgo', porque: 'Para bajar 0,5-1 el salbutamol exige al menos 4 veces la dosis, con efectos adversos como la taquicardia.' },
          { t: 'Baja ≥0,6 mEq/L con pico a los 30-60 min; el salbutamol, <0,5 y nunca solo', ok: true }],
        explicacion: 'La insulina-glucosa activa la bomba en el músculo: baja el K⁺ <span class="hl">al menos 0,6 mEq/L</span>, con <span class="hl">pico a los 30-60 min</span>, temporal. Los β₂ bajan <0,5 mEq/L a dosis terapéuticas; nunca solos (E p. 28).' },
      { id: 'ion-k-t5', corto: 'el bicarbonato', tipo: 'destapa', fuente: 'mr-bicarb-k',
        enunciado: '¿Por qué la ficha desaconseja el bicarbonato para meter K⁺ en las células? Son dos cosas.',
        puntos: [
          'Las perfusiones cortas (hasta 4 h) <span class="hl-rojo">no cambian el K⁺ sin acidosis metabólica</span>.',
          'Forma <span class="hl">complejos con el calcio</span>: contraproducente si estás dando calcio.'],
        explicacion: 'Dos razones (E p. 28): sin acidosis metabólica no cambia el K⁺ y, además, se une al calcio.' },
      { id: 'ion-k-t6', corto: 'sacar el potasio', tipo: 'test', fuente: 'mr-szc · mr-sps · mr-hd-k', modelo: FILTRO_K,
        enunciado: 'Para sacar potasio del cuerpo tienes resina de poliestireno, ciclosilicato de sodio y zirconio y hemodiálisis. ¿Cuál es el método más eficaz y cuál es hoy el preferido entre las resinas?',
        opciones: [
          { t: 'La resina de poliestireno es la más eficaz y rápida de todas; la diálisis es la última opción', porque: 'La resina tiene eficacia dudosa, inicio lento y casos de necrosis intestinal. No es la más eficaz ni la más rápida.' },
          { t: 'Hemodiálisis, 1 mEq/L en 1 h; entre los fijadores, el ciclosilicato, preferido hoy', ok: true },
          { t: 'Ciclosilicato en bolo único de 10 g; la hemodiálisis solo para el K⁺ >10', porque: 'La pauta es repetida (cada 8 h durante 48 h), y la ficha no pone el corte de 10 para la diálisis.' }],
        explicacion: 'La <span class="hl-rojo">hemodiálisis</span> es el método más eficaz (1 mEq/L en 1 h, 2 mEq/L en 3 h). El ciclosilicato (efecto significativo a la 1 h) equivale al poliestireno en la aguda sin sus riesgos y es hoy el preferido (E p. 28).' },
    ],
    examen: [
      { id: 'ion-k-y1', corto: 'la Tabla 36.3', tipo: 'test', fuente: 'mr-tabla-36-3',
        enunciado: 'Elige la pauta que sigue la Tabla 36.3 para una hiperpotasemia grave con ECG alterado.',
        opciones: [
          { t: 'Cloruro cálcico 10 mL en 3 min; insulina 10 U + 50 mL G50; salbutamol 20 mg en aerosol, y nada más después', porque: 'El cloruro es solo para el colapso, y falta eliminar el exceso: el K⁺ volvería a subir.' },
          { t: 'Gluconato en 1 h; bicarbonato 100 mEq; resina 15 g al día', porque: 'El calcio se da en 3 min, el bicarbonato no está indicado sin acidosis y la dosis de resina no es esa.' },
          { t: 'Gluconato 10 mL al 10 % en 3 min; insulina 10 U + 50 mL G50; ciclosilicato 10 g cada 8 h durante 48 h', ok: true }],
        explicacion: 'Tabla 36.3: gluconato 10 % 10 mL IV en 3 min (repetir a los 5); insulina regular 10 U IV + 50 mL de G50; salbutamol 20 mg aerosol; ciclosilicato 10 g cada 8 h 48 h (E p. 27).' },
      { id: 'ion-k-y2', corto: 'la nota del R1', tipo: 'error', fuente: 'mr-calcio-preparados · mr-bicarb-k · mr-calcio-indicaciones',
        enunciado: 'Un residente propone su plan para un K⁺ de 7,0 con QRS ancho. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Gluconato cálcico 10 mL en 3 min; si el ECG no mejora, repito a los 5 min.' },
          { t: 'Cloruro cálcico en vez de gluconato porque tiene más calcio, y así es más seguro.', mal: true,
            c: 'El cloruro (27 mg/mL) da <span class="hl-rojo">tres veces más calcio</span>: se reserva para el colapso circulatorio o la parada.' },
          { t: 'Añado bicarbonato en bolo para meter potasio en las células, aunque ya doy calcio.', mal: true,
            c: 'Sin acidosis metabólica no cambia el K⁺ y <span class="hl-rojo">forma complejos con el calcio</span>.' },
          { t: 'Pongo insulina regular 10 U con 50 mL de glucosa al 50 %.' },
          { t: 'Pauto ciclosilicato 10 g cada 8 h durante 48 h.' }],
        explicacion: 'El plan correcto es el de la Tabla 36.3, sin bicarbonato y con gluconato salvo colapso (E p. 27-28).' },
      { id: 'ion-k-y3', corto: 'dos indicaciones', tipo: 'test', fuente: 'mr-calcio-indicaciones',
        enunciado: 'Un paciente tiene K⁺ 6,8 con ECG normal. ¿Qué dice la ficha sobre dar calcio?',
        opciones: [
          { t: 'Hay dos pautas: calcio con K⁺ >6,5 con o sin cambios, o solo con cambios del ECG, que al autor le parece adecuada', ok: true },
          { t: 'Una sola pauta: el calcio exige siempre un K⁺ >8', porque: 'No hay ese corte en la ficha. Esperar a un K⁺ más alto es arriesgado, por la mala correlación con el ECG.' },
          { t: 'Calcio sí, y repetirlo cada 5 min hasta bajar el K⁺ a 5', porque: 'El calcio no baja el K⁺; repetirlo a ciegas no sirve. Se repite a los 5 min si el ECG sigue alterado.' }],
        explicacion: 'Las indicaciones publicadas: K⁺ >6,5 con o sin cambios del ECG, o cambios con cualquier K⁺. Algunos lo usan solo con cambios del ECG, lo que al autor le parece adecuado dada la mala correlación entre K⁺ y ECG (E p. 27).',
        nota: '<b>Opinión del autor.</b> La ficha recoge su preferencia sin decir que la otra pauta sea un error (E p. 27).' },
      { id: 'ion-k-y4', corto: 'el digital', tipo: 'test', fuente: 'mr-calcio-digital',
        enunciado: 'Hiperpotasemia grave en un paciente intoxicado con digital. ¿Qué dice la ficha del calcio?',
        opciones: [
          { t: 'Sigue absolutamente contraindicado en toda intoxicación digitálica, sin excepción', porque: 'La ficha matiza: hay estudios con muchos casos tratados sin daño. Negar el calcio te dejaría sin el tratamiento de elección.' },
          { t: 'Clásicamente contraindicado, pero hay muchos casos con calcio IV sin daño', ok: true },
          { t: 'Solo se permite si el K⁺ pasa de 8, cuando pesa más que la digital', porque: 'La ficha no pone ese corte: la hiperpotasemia grave con ECG alterado se protege con calcio, y esperar a 8 es llegar con el corazón ya bloqueado.' }],
        explicacion: 'Clásicamente contraindicado en la intoxicación digitálica (sobrecarga celular de calcio), pero estudios retrospectivos muestran muchos casos con calcio IV sin daño (E p. 27).' },
    ],
    casos: [
      { id: 'ion-k-adela', titulo: 'Adela, 72 años: el potasio que volvió', corto: 'Caso · Adela', sub: 'ERC con enalapril, espironolactona e ibuprofeno',
        paciente: { Edad: '72 años', Antecedentes: 'Enfermedad renal crónica estadio 3', Fármacos: 'enalapril + espironolactona + ibuprofeno', Motivo: 'Debilidad y mareo' },
        lleva: [
          'Un K⁺ alto en un tubo hemolizado se repite, pero el ECG decide mientras tanto.',
          'El calcio protege el corazón unos 30-60 min, no baja el K⁺: se combina con insulina y con la eliminación.',
          'Si el ECG empeora de nuevo, repite el calcio y piensa en hemodiálisis (1 mEq/L en 1 h).'],
        volver: { nombre: 'Tratamiento de la hiperpotasemia', ancla: 'mr-hiperk-tratamiento', modelo: ritmo('hiperk', 'Compruébalo en el corazón eléctrico') },
        pasos: [
          { momento: 'Urgencias · el análisis', datos: { 'K⁺ (tubo hemolizado)': '6,9 mEq/L' }, nuevo: ['K⁺ (tubo hemolizado)'],
            pregunta: { id: 'ion-k-a1', tipo: 'destapa', fuente: 'mr-tabla-36-2 · mr-hiperk-renal · mr-pseudohiperk', modelo: iv('adela'), origen: 'ficha · cifras del caso, ilustrativas',
              enunciado: 'Adela toma enalapril, espironolactona e ibuprofeno y tiene una ERC. El tubo está hemolizado. ¿Por qué debes tomar en serio el 6,9 aunque sea posible la falsa alarma? Son tres cosas.',
              puntos: [
                'Enalapril, espironolactona e ibuprofeno actúan sobre el <span class="hl-rojo">eje renina-angiotensina-aldosterona</span> (Tabla 36.2).',
                'Toda hiperpotasemia mantenida implica un <span class="hl">defecto renal</span>, y ella ya lo tiene.',
                'Hay motivo aparente, así que no es seguro que sea ficticia: <span class="hl-azul">se repite sin puño ni succión y se mira el ECG</span>.'],
              explicacion: 'Con K⁺ >6,5 o ECG alterado la hiperpotasemia es grave (E p. 27). Sospechas la ficticia si no hay motivo aparente (E p. 23-24); aquí hay tres. Los fármacos de la Tabla 36.2 y la ERC explican que sea real (E p. 25).' } },
          { momento: 'Urgencias · la repetición y el ECG', datos: { 'K⁺ (sin puño)': '6,6 mEq/L', ECG: 'PR largo, QRS 130 ms' }, nuevo: ['K⁺ (sin puño)', 'ECG'],
            pregunta: { id: 'ion-k-a2', tipo: 'test', fuente: 'mr-hiperk-grave · mr-ecg-hiperk · mr-ecg-correlacion', modelo: ritmo('hiperk', 'Compruébalo en el corazón eléctrico'), origen: 'ficha · cifras del caso, ilustrativas',
              enunciado: 'La repetición, bien extraída, da 6,6 y el ECG muestra PR largo y QRS de 130 ms. ¿Cómo lo clasificas y qué haces primero?',
              opciones: [
                { t: 'Moderada: espero el próximo análisis porque el K⁺ y el ECG no se correlacionan', porque: 'Que no se correlacionen es un motivo para tratar por cualquiera de los dos, no para esperar. Con QRS ancho, el bloqueo ya está en marcha.' },
                { t: 'Grave: K⁺ >6,5 y cambios del ECG; primero estabilizo el corazón con calcio', ok: true },
                { t: 'Grave, pero primero doy la insulina porque es lo que baja el potasio', porque: 'El primer objetivo es bloquear el efecto sobre la conducción. La insulina tarda y no protege el corazón en los primeros minutos.' }],
              explicacion: 'K⁺ >6,5 <span class="hl-rojo">o cualquier K⁺ con cambios del ECG</span>: ella cumple los dos. Tres objetivos en orden: estabilizar el corazón, meter K⁺ en las células, sacar el exceso (E p. 26-27).' } },
          { momento: 'Minuto 0 · el calcio', datos: { Pauta: 'gluconato cálcico al 10 %' }, nuevo: ['Pauta'],
            pregunta: { id: 'ion-k-a3', tipo: 'test', fuente: 'mr-tabla-36-3 · mr-calcio-preparados', modelo: iv('adela:4'), origen: 'ficha',
              enunciado: 'Adela está estable, sin colapso. ¿Qué calcio y cómo?',
              opciones: [
                { t: 'Cloruro cálcico al 10 %, 10 mL en 3 min, por ser más potente que el gluconato y actuar antes', porque: 'El cloruro es el triple de calcio y se reserva para el colapso o la parada; en una paciente estable es innecesario.' },
                { t: 'Gluconato cálcico 10 mL en 30 min, para no irritar la vena', porque: 'La pauta es en 3 min: en 30 el calcio llega tarde para frenar el efecto sobre la conducción.' },
                { t: 'Gluconato cálcico al 10 %, 10 mL IV en 3 min, repetible a los 5 min', ok: true }],
              explicacion: 'Gluconato cálcico al 10 %: 10 mL IV en 3 min; repetir a los 5 min si hace falta. El ECG se arregla a los pocos minutos (E p. 27).' } },
          { momento: 'Minuto 10 · meter y sacar', datos: { Pauta: 'insulina + glucosa + ciclosilicato' }, nuevo: ['Pauta'],
            pregunta: { id: 'ion-k-a4', tipo: 'test', fuente: 'mr-tabla-36-3 · mr-insulina-k · mr-szc', modelo: iv('adela:4'), origen: 'ficha',
              enunciado: 'El ECG ha mejorado. ¿Qué añades ahora para meter y sacar el potasio?',
              opciones: [
                { t: 'Salbutamol 20 mg en aerosol como único tratamiento adicional, y esperar a ver cómo evoluciona', porque: 'Nunca solo, y baja menos de 0,5 mEq/L; no elimina el exceso.' },
                { t: 'Insulina regular 10 U + 50 mL G50 en bolo, y ciclosilicato 10 g cada 8 h 48 h', ok: true },
                { t: 'Bicarbonato 100 mEq porque la acidosis sube el K⁺', porque: 'Sin acidosis metabólica no cambia el K⁺ y forma complejos con el calcio que acabas de dar.' }],
              explicacion: 'Insulina regular 10 U IV + 50 mL de glucosa al 50 %: baja al menos 0,6 mEq/L con pico a los 30-60 min; ciclosilicato 10 g cada 8 h durante 48 h, con efecto a la 1 h (E p. 27-28).' } },
          { momento: 'Minuto 45 · el giro', datos: { ECG: 'el QRS vuelve a ensancharse', 'K⁺': '6,0 mEq/L' }, nuevo: ['ECG', 'K⁺'],
            pregunta: { id: 'ion-k-a5', tipo: 'test', fuente: 'mr-calcio-efecto · mr-hd-k', modelo: [iv('adela:4'), FILTRO_K], origen: 'ficha · K⁺ del caso, ilustrativo (baja 0,6 con la insulina, E p. 28)',
              enunciado: 'A los 45 min el QRS vuelve a ensancharse y el K⁺ está en 6,0, solo 0,6 por debajo de antes. ¿Qué ha pasado y qué haces?',
              opciones: [
                { t: 'El calcio se ha disipado y el K⁺ sigue alto: repito calcio y dejo preparada la diálisis', ok: true },
                { t: 'La insulina ha fallado: doy otras 10 U inmediatamente sin calcio', porque: 'El problema inmediato es el corazón, no la cifra; sin calcio el bloqueo avanza.' },
                { t: 'Es un artefacto de la monitorización: un K⁺ de 6,0 es demasiado bajo para cambiar el ECG', porque: 'La correlación es impredecible: hay cambios con cifras moderadas. Llamarlo artefacto retrasa el tratamiento.' }],
              explicacion: 'El calcio actúa en minutos y <span class="hl-rojo">se disipa en 30-60 min</span>; si no has bajado el K⁺, vuelve el efecto. La insulina baja al menos 0,6 mEq/L (E p. 28): con 6,0 queda alto, y preparar la hemodiálisis (1 mEq/L en 1 h) es razonable (E p. 27-28).' } },
          { momento: 'Minuto 50 · el plan', datos: { Plan: 'calcio + hemodiálisis' }, nuevo: ['Plan'],
            pregunta: { id: 'ion-k-a6', tipo: 'error', fuente: 'mr-calcio-preparados · mr-bicarb-k · mr-hd-k',
              enunciado: 'El residente de guardia anota el plan. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Repito gluconato cálcico 10 mL en 3 min y pido hemodiálisis urgente.' },
                { t: 'Cambio a cloruro cálcico porque es más potente que el gluconato.', mal: true,
                  c: 'El cloruro (27 mg/mL) es <span class="hl-rojo">tres veces más calcio</span> y se reserva para el colapso o la parada; Adela está estable.' },
                { t: 'Añado 100 mEq de bicarbonato porque la acidosis sube el potasio.', mal: true,
                  c: 'Sin acidosis metabólica <span class="hl-rojo">no cambia el K⁺</span> en infusiones cortas, y forma complejos con el calcio.' },
                { t: 'Mantengo el ciclosilicato 10 g cada 8 h y vigilo el ECG: el calcio dura 30-60 min.' }],
              explicacion: 'Dos errores clásicos: usar el calcio más potente sin colapso y recurrir al bicarbonato (E p. 27-28).' } },
        ] },
    ],
    profundizar: [
      { id: 'mr-calcio-digital', titulo: 'Calcio y digital' },
      { id: 'mr-sps', titulo: 'Poliestireno sulfonato sódico (Kayexalate®)' },
    ],
  },
};
