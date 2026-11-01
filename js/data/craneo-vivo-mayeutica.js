// Mayéutica del cráneo vivo (Marino caps. 45-47; PDF = página del PDF). Solo datos; el motor es js/core/mayeutica-motor.js.
// Las respuestas viven aquí: el HTML no las lleva hasta que se contesta. Cada explicación y cada distractor lleva su página.
// `estado`: el paciente del modelo en esa pregunta; `tocar`: lo que se hace en el modelo al comprobar (`a` se suma al estado).
import { ERROR, ERROR_SEG, CASO, CASO_SEG, LLEVAS } from '../modules/libros/craneo-vivo/pruebas.js';
const LA1 = 'docs/libro-azul-seccion-viii-neurologia-parte1.pdf';
const WEB = 'https://www.rcemlearning.co.uk/modules/stroke-in-the-ed/lessons/specific-stroke-syndromes/topic/malignant-middle-cerebral-artery-infarct/';
const c = (p, f, o = {}) => ({ p, f, ...o });
const LAC = c(3, 'mn-hic-pic', { pdf: LA1 });
const ABU = { tipo: 'hematoma', masa: 68, pas: 136 };   // Abundio (PIC 30, PAM 95, PPC 65)
const pic = (a, b) => `la PIC pasa de ${a.pic} a ${b.pic} mmHg y la PPC de ${a.ppc} a ${b.ppc}`;
const PREG = [
  { grupo: 'guia', num: 'G1', predice: true, estado: { ...ABU, masa: 30 },
    enunciado: 'Abundio, 23 años, traumatismo craneal: hematoma pequeño, sin signos. Vas a dejar que crezca hasta la mitad de la caja (masa de 30 a 50). <b>¿Qué hace la PIC?</b>',
    opciones: [
      { t: 'Sube hasta rozar los 20 mmHg: la caja no se expande y ya casi no queda LCR ni sangre que ceder.', ok: true },
      { t: 'No cambia: el cerebro se acomoda al volumen nuevo y la PIC sigue en su sitio.', porque: 'En una masa que crece deprisa los mecanismos compensadores no llegan a desarrollarse (Libro Azul, p. 5). Si crees que se acomoda, esperarás al TC de mañana mientras la PIC pasa de 20.' },
      { t: 'Sube en línea recta: cada mililitro de hematoma suma lo mismo a la presión.', porque: 'La relación presión-volumen es una curva: al principio se compensa y luego cada mililitro sube más (Libro Azul, p. 5). Creyéndola recta, subestimarás el hematoma que parece pequeño.' },
      { t: 'Baja: el LCR se va y deja sitio de sobra para el hematoma.', porque: 'El LCR y la sangre venosa ceden volumen primero, pero se agotan y entonces la presión sube (Libro Azul, p. 3-4). Si esperas que baje, dejarás de vigilar la pupila.' }],
    explicacion: 'Dentro del cráneo cabe un volumen fijo (cerebro, sangre y LCR): lo que añade la masa lo ceden el LCR y la sangre hasta que no pueden y la PIC sube (Libro Azul, p. 3-5). El objetivo es PIC <20 mmHg (Marino, p. 45).', fuente: [LAC, c(45, 'mn-hic-pic')],
    tocar: { txt: 'Compruébalo: sube la masa de 30 a 50', a: { masa: 50 }, cuenta: (a, b) => `${pic(a, b)}: llega al límite de 20 (magnitud ilustrativa).` } },
  { grupo: 'guia', num: 'G2', predice: true, estado: { ...ABU, masa: 50 },
    enunciado: 'Abundio sigue creciendo (masa de 50 a 68). <b>¿Qué ves en sus pupilas?</b>',
    opciones: [
      { t: 'La derecha dilatada y fija, y la izquierda reactiva: el uncus aprieta el III par del lado de la masa.', ok: true },
      { t: 'La izquierda dilatada y fija: se dilata la del lado opuesto, hacia donde se desplaza el cerebro.', porque: 'El libro liga la pupila fija a la masa en expansión (p. 11); el lado de la masa es nuestra lectura. Buscarla en el lado opuesto te llevaría a operar donde no hay hematoma.' },
      { t: 'Las dos puntiformes y sin reacción: el tronco comprimido las cierra.', porque: 'Puntiformes sin reacción apuntan a la protuberancia (p. 11), no a una masa que desciende por la tienda. Pensando en el tronco, no buscarías el hematoma.' },
      { t: 'Las dos medias y sin reacción desde el principio, como en un coma profundo.', porque: 'Medias y fijas son del fallo hepático, la anoxia o la muerte encefálica (p. 11); en una masa que empieza, pasarlas por alto la unilateral retrasa la cirugía.' }],
    explicacion: 'Una pupila dilatada y fija es el signo del III par comprimido por una masa en expansión (uncal) (p. 11, Tabla 45.4). Que sea la del lado de la masa es nuestra lectura.', fuente: [c(11, 'mn-tabla-45-4')],
    tocar: { txt: 'Compruébalo: sube la masa a 68', a: { masa: 68 }, cuenta: (a, b) => `${pic(a, b)}, y aparece la pupila derecha fija.` } },
  { grupo: 'guia', num: 'G3', predice: true, estado: ABU,
    enunciado: 'Abundio, con la pupila derecha fija, empeora (masa de 68 a 76). <b>¿Qué hace la mano?</b>',
    opciones: [
      { t: 'Pasa a extensión de brazos y piernas: ya está afectado el mesencéfalo y la protuberancia alta.', ok: true },
      { t: 'Queda en flexión del brazo, la del tálamo, y ahí se queda hasta que se opere.', porque: 'La flexión es un escalón anterior (p. 10): si la masa sigue, el tronco sigue comprimiéndose. Esperar en ese escalón es llegar a la extensión.' },
      { t: 'Pasa a flácida: lo primero que cae es el tronco bajo.', porque: 'La flaccidez es el final (tronco bajo, p. 10), después de la extensión. Creerla primera te haría dar por irrecuperable un cuadro que aún se opera.' },
      { t: 'Vuelve a obedecer: la compresión da una mejoría pasajera antes de empeorar.', porque: 'No hay tal mejoría: la respuesta con propósito, como retirar el miembro, no es del coma (p. 10). Si la esperas, perderás las horas en que la cirugía salva.' }],
    explicacion: 'Con la compresión que baja por el tronco, el brazo pasa de la flexión (tálamo) a la extensión (mesencéfalo y protuberancia alta) y, al final, a la flaccidez (tronco bajo) (p. 10).', fuente: [c(10, 'mn-coma-posturas')],
    tocar: { txt: 'Compruébalo: sube la masa a 76', a: { masa: 76 }, cuenta: (a, b) => `${pic(a, b)}: la mano queda en extensión.` } },
  { grupo: 'guia', num: 'G4', predice: true, estado: ABU,
    enunciado: 'Abundio, a la espera del quirófano, recibe un bolo de salino hipertónico al 3 % (250 mL). <b>¿Qué esperas?</b>',
    opciones: [
      { t: 'Baja la PIC y retrocede el cuadro; el Na⁺ sube y no debe pasar de 155.', ok: true },
      { t: 'No baja nada hasta el tercer bolo: un solo bolo no llega a mover la PIC.', porque: 'El salino hipertónico actúa en el bolo y el objetivo es el Na⁺ 145-155 (p. 41). Esperar tres bolos con la pupila fija es arriesgar la descerebración.' },
      { t: 'Sube la PIC: el sodio arrastra agua hacia dentro de la célula.', porque: 'Es al revés: el hipertónico saca agua del tejido (p. 41, Tabla 47.3). Si lo crees, prohibirías el tratamiento que gana tiempo.' },
      { t: 'Baja la PIC, pero el objetivo es dejar el Na⁺ en 130-135 mEq/L.', porque: 'El objetivo es Na⁺ 145-155 mEq/L (p. 41). Con 130-135 pondrías al paciente en el hipoosmolar, que empeora el edema.' }],
    explicacion: 'El salino hipertónico es más eficaz que el manitol en el ictus (p. 41, Tabla 47.3), con Na⁺ 145-155: aquí se extrapola al hematoma (inferencia). Cuánto baja la PIC es ilustrativo.', fuente: [c(41, 'mn-isq-edema-manejo')],
    tocar: { txt: 'Compruébalo: salino al 3 %', a: { hiper: 1, na: 143 }, cuenta: (a, b) => `${pic(a, b)}, y el Na⁺ sube a 143: el cuadro retrocede (magnitud ilustrativa).` } },
  { grupo: 'guia', num: 'G5', tipo: 'destapa', estado: { tipo: 'hematoma', masa: 52, pas: 196, anti: 'warfarina', t: 3 },
    enunciado: 'Segismundo, 71 años, hemorragia intracerebral con warfarina (INR 3,2) y PA 196/108. El R1 propone esperar a ver si el hematoma se queda quieto. <b>¿Qué le contestas?</b> Son tres cosas.',
    puntos: [
      { t: 'El hematoma <span class="hl-rojo">crece mientras el anticoagulante siga actuando</span>: la ventana es de horas.', c: c(42, 'mn-hic-warfarina') },
      { t: '<span class="hl-azul">Revertir lo primero</span>: vitamina K 10 mg IV y concentrado de complejo protrombínico (Tabla 47.4).', c: c(44, 'mn-tabla-47-4') },
      { t: 'Bajar la <span class="hl-azul">PAS a <140</span>, no dejar los 196.', c: c(44, 'mn-hic-datos') }],
    explicacion: 'En la hemorragia con warfarina se revierte de inmediato (vitamina K 10 mg IV y CCP) y se baja la PAS por debajo de 140 (p. 44); esperar es dejar crecer el hematoma (p. 42).', fuente: [c(42, 'mn-hic-warfarina'), c(44, 'mn-tabla-47-4')] },
  { grupo: 'guia', num: 'G6', predice: true, estado: { tipo: 'hsa', masa: 25, pas: 170 },
    enunciado: 'Petronila, hemorragia subaracnoidea, PAS 170, aneurisma sin cerrar. Pasa un día sin tratar. <b>¿Qué ocurre?</b>',
    opciones: [
      { t: 'Resangra: con PAS >140 y el aneurisma abierto, la PIC sube de golpe.', ok: true },
      { t: 'Nada: el coágulo sella el aneurisma y se puede esperar la semana siguiente.', porque: 'El resangrado es la complicación temprana más grave y el aneurisma debe cerrarse en 3 días, nunca más allá de 7-10 (p. 47). Esperar sin cerrarlo la deja a merced de la PAS.' },
      { t: 'Pierde 2 puntos del GCS por vasoespasmo y sube la velocidad del Doppler.', porque: 'El vasoespasmo es de los días 4 a 14 (p. 48), no del día 1. Confundir las dos fases te haría vigilar con Doppler lo que ahora es un riesgo de resangrado.' },
      { t: 'El tranexámico la protege: basta con ponerlo y bajar la PAS después.', porque: 'Los antifibrinolíticos no previenen el resangrado y no se recomiendan; lo que lo previene es cerrar el aneurisma (p. 47). Petronila seguiría expuesta.' }],
    explicacion: 'Con el aneurisma abierto y la PAS por encima de 140, el riesgo de resangrado es máximo en los primeros días (p. 47): se baja la PAS a ≤140 y se cierra el aneurisma en 3 días. Cuánto sube la PIC es ilustrativo.', fuente: [c(47, 'mn-hsa-inmediato'), c(47, 'mn-hsa-aneurisma')],
    tocar: { txt: 'Compruébalo: avanza un día', a: { t: 1 }, cuenta: (a, b) => `${pic(a, b)}: sello de resangrado (magnitud ilustrativa).` } },
  { grupo: 'guia', num: 'G7', estado: { tipo: 'tronco', pas: 170 },
    enunciado: 'Leovigildo abre los ojos, no habla ni mueve nada, pero sigue con la mirada hacia arriba cuando se le pide. La PIC es normal. <b>¿Qué tiene?</b>',
    opciones: [
      { t: 'Síndrome del cautiverio: protuberancia ventral lesionada; está despierto y se comunica con los ojos.', ok: true },
      { t: 'Un estado vegetativo: abre los ojos, pero no sabe que está ahí.', porque: 'Abrir los ojos puede ser con conciencia (cautiverio) o sin ella (vegetativo) (p. 10); él obedece con los ojos. Tomarlo por vegetativo es hablar de él delante sin saber que escucha.' },
      { t: 'Un coma por masa supratentorial que ya comprime el tronco.', porque: 'En el coma los ojos no se abren de forma espontánea (p. 10) y aquí la PIC es normal. Buscar una masa que no existe retrasa lo que sí es un ictus del tronco.' },
      { t: 'Un coma metabólico: lo normal sería abrir los ojos y no obedecer.', porque: 'En el coma metabólico no se obedece ni se abren los ojos (p. 10); aquí obedece con los ojos. Tratarlo como metabólico dejaría sin diagnóstico la lesión de la protuberancia.' }],
    explicacion: 'En el síndrome del cautiverio (protuberancia ventral) quedan los movimientos verticales de los ojos y el parpadeo: el paciente está despierto y consciente (p. 3). Se parece a un coma, pero no lo es.', fuente: [c(3, 'mn-cons-lockedin'), c(10, 'mn-coma-posturas')] },
  { grupo: 'examen', num: 'E1', predice: true, estado: { ...ABU, masa: 30 },
    enunciado: 'Abundio, 23 años, traumatismo craneal: pupila derecha dilatada y fija, izquierda reactiva; retira el brazo izquierdo al dolor. <b>¿Dónde está la masa y qué pasará con la mano si no se opera?</b>',
    opciones: [
      { t: 'Derecha, del lado de la pupila fija; sin operar, la mano irá a flexión y luego a extensión.', ok: true },
      { t: 'Izquierda, del lado de la pupila que reacciona y del brazo que se mueve; la mano seguirá igual.', porque: 'La pupila dilatada y fija es la del lado de la masa en expansión (p. 11, Tabla 45.4). Operarías el lado equivocado.' },
      { t: 'Derecha, pero la herniación se frena sola y la mano seguirá igual aunque no se opere.', porque: 'La herniación no se detiene sola: si la masa sigue, el tronco se comprime y pasa a flexión, extensión y flaccidez (p. 10).' },
      { t: 'Derecha, y la mano ya tendría que estar flácida: el tronco bajo cae el primero.', porque: 'La flaccidez es lo último (p. 10); con la retirada al dolor aún queda tiempo, y la cirugía ha de ser ya.' }],
    explicacion: 'Pupila fija = masa en expansión del mismo lado (p. 11). Sin operar, la compresión baja por el tronco: flexión (tálamo), extensión (mesencéfalo-protuberancia alta) y flaccidez (tronco bajo) (p. 10).', fuente: [c(11, 'mn-tabla-45-4'), c(10, 'mn-coma-posturas')],
    tocar: { txt: 'Compruébalo: Abundio en su estado', a: { masa: 68 }, cuenta: (a, b) => `${pic(a, b)}: pupila derecha fija, GCS 9.` } },
  { grupo: 'examen', num: 'E2', tipo: 'error', estado: { tipo: 'hsa', masa: 25, pas: 130 }, sinModelo: false, _error: ERROR,
    enunciado: 'Plan de otro residente para Petronila, HSA, día 1. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.' },
  { grupo: 'examen', num: 'E3', tipo: 'error', estado: { tipo: 'hematoma', masa: 52, pas: 196, anti: 'warfarina' }, _error: ERROR_SEG,
    enunciado: 'Plan del R1 para Segismundo, hemorragia intracerebral con warfarina (INR 3,2). <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.' },
  { grupo: 'examen', num: 'E4', estado: { tipo: 'hematoma', masa: 100, pas: 110 },
    enunciado: 'Abundio, día 3: T 36,6 °C, sin sedantes, PAM 77, 70 horas de la lesión. Se hace el test de apnea; la PaCO₂ basal es de 42 mmHg. <b>¿Qué gasometría final confirma la muerte encefálica?</b>',
    opciones: [
      { t: 'Sin esfuerzo respiratorio y PaCO₂ 64 (+22): pasa de 60 y sube más de 20 sobre la basal.', ok: true },
      { t: 'Sin esfuerzo respiratorio a los 3 min y PaCO₂ 51: ya basta, porque la PaCO₂ sube unos 3 por minuto.', porque: 'A 3 mmHg por minuto, 3 min dan unos +9: se necesitan unos 6-7 min para subir 20 (p. 16). Declararlo a los 3 min sería un test no válido.' },
      { t: 'Sin esfuerzo respiratorio con PaCO₂ 58 (+16): casi llega y se da por válida.', porque: 'El objetivo es subir ≥20 mmHg sobre la basal y la Tabla 45.6 pide más de 60 (p. 15-16). Con 58 no se cumple y el test no concluye.' },
      { t: 'Sin esfuerzo respiratorio con PaCO₂ 62 partiendo de una basal de 55 (+7).', porque: 'Pasa de 60, pero no sube más de 20 sobre la basal: la tabla exige las dos condiciones (p. 15-16). El test no es válido.' }],
    explicacion: 'Con PAM ≥75 (p. 15, aquí 77), el test busca que la PaCO₂ suba ≥20 mmHg sobre la basal (unos 3 por minuto: 6-7 min) sin esfuerzo respiratorio (p. 16); la Tabla 45.6 la pide además >60 (p. 15). Con basal 42 la meta es 62 o más. Es una prueba de riesgo: desaturación, hipotensión y arritmias (p. 16).', fuente: [c(16, 'mn-me-apnea-pasos'), c(15, 'mn-me-pam')] },
  { grupo: 'examen', num: 'E5', tipo: 'destapa', estado: { tipo: 'hsa', masa: 25, pas: 130, t: 5 },
    enunciado: 'Petronila, día 5 de la HSA, con el aneurisma cerrado: el GCS pasa de 9 a 7 y el Doppler transcraneal sube de velocidad. <b>¿Qué piensas y qué haces?</b> Son tres cosas.',
    puntos: [
      { t: '<span class="hl-azul">Vasoespasmo</span>: aparece entre los días 4 y 14 y se vigila con el Doppler.', c: c(48, 'mn-hsa-vigilar') },
      { t: 'No es un resangrado: el riesgo de <span class="hl-rojo">resangrado</span> es de los primeros días y el aneurisma ya está cerrado.', c: c(47, 'mn-hsa-aneurisma') },
      { t: '<span class="hl-azul">Nimodipino 60 mg/4 h por vía oral</span>, 3 semanas: menos déficits, misma supervivencia.', c: c(48, 'mn-hsa-nimodipino') }],
    explicacion: 'Entre los días 4 y 14 las arterias de la base se estrechan: el GCS pierde puntos y el Doppler sube (p. 48). El nimodipino oral se da 3 semanas (p. 48); el resangrado es temprano y se previene cerrando el aneurisma (p. 47).', fuente: [c(48, 'mn-hsa-vigilar'), c(48, 'mn-hsa-nimodipino')] },
  { grupo: 'examen', num: 'E6', estado: { tipo: 'edema', masa: 60, pas: 150, sensor: false },
    enunciado: 'Clotilde, infarto extenso de la ACM, empeora a pesar del salino hipertónico. <b>¿Qué papel tiene la hemicraniectomía?</b>',
    opciones: [
      { t: 'Se plantea en el infarto maligno si empeora con tratamiento médico: en los ensayos, ≤60 años y ≤48 h.', ok: true },
      { t: 'Va de entrada en todo infarto grande, antes del salino: abre la caja de golpe y no hace falta nada más.', porque: 'Primero va el tratamiento médico (salino 3 % con Na⁺ 145-155, p. 41); la cirugía es para el infarto maligno que empeora (RCEM). Operar a todos expone a muchos a una cirugía que no necesitan.' },
      { t: 'Solo en el hematoma: en el infarto el edema se trata con salino y nunca se opera.', porque: 'En el infarto maligno de la ACM la cirugía reduce la mortalidad en ≤60 años y ≤48 h (RCEM). No considerarla deja a Clotilde sin la opción que puede salvarla.' },
      { t: 'Cuando la PIC llegue a 20 con el sensor puesto, como en el traumatismo craneal.', porque: 'En el ictus isquémico no se recomienda monitorizar la PIC (p. 40). Esperar una cifra que no se mide retrasa el momento de operar.' }],
    explicacion: 'La hemicraniectomía descompresiva reduce la mortalidad en el infarto maligno de la ACM en ≤60 años y ≤48 h (RCEM); Marino nombra la hemicraniectomía solo en la hemorragia tras tPA (p. 40) y no recomienda monitorizar la PIC en el ictus. Magnitud ilustrativa en el modelo.', fuente: [c(40, 'mn-isq-edema-manejo', { url: WEB, uw: 'RCEM (web)' })],
    tocar: { txt: 'Compruébalo: retira el hueso', a: { cran: true, masa: 80 }, cuenta: (a, b) => `con la masa en 80, ${pic(a, b)} y la caja abierta (magnitud ilustrativa).` } },
];
const CORTO = { G1: 'caja cerrada', G2: 'pupila fija', G3: 'flexión y extensión', G4: 'salino 3 %', G5: 'warfarina', G6: 'resangrado', G7: 'cautiverio', E1: 'dónde está la masa', E2: 'plan de Petronila', E3: 'plan de Segismundo', E4: 'test de apnea', E5: 'vasoespasmo', E6: 'hemicraniectomía' };
// Orden de partida de las opciones de cada test (rotación), calculado para que la buena caiga repartida entre las posiciones tras barajar
const ROT = {"crv-g1":0,"crv-g2":1,"crv-g3":2,"crv-g4":3,"crv-g6":0,"crv-g7":1,"crv-e1":2,"crv-e4":3,"crv-e6":0,"crv-caso-abundio-1":1,"crv-caso-abundio-2":2,"crv-caso-abundio-3":0,"crv-caso-abundio-4":1,"crv-caso-abundio-5":2,"crv-caso-segismundo-1":0,"crv-caso-segismundo-2":1,"crv-caso-segismundo-3":2,"crv-caso-segismundo-4":0};
const rota = (id, ops) => { const r = (ROT[id] || 0) % ops.length; return ops.slice(r).concat(ops.slice(0, r)); };
const unicas = (l) => [...new Map(l.filter(Boolean).map((x) => [x.p + x.f, x])).values()];
const citaDe = (p, f) => c(p, f);
function error(q, E) {
  return { ...q, frases: E.fr.map((x) => ({ t: x[0], mal: !!x[1], c: x[1] ? x[2] : '' })), fuente: unicas(E.fr.map((x) => citaDe(x[3], x[4]))),
    explicacion: E.fr.filter((x) => x[1]).map((x) => x[2]).join(' ') || 'No había ningún error.' };
}
export const PREGUNTAS = PREG.map((q) => {
  const o = { ...q, id: 'crv-' + q.num.toLowerCase(), tipo: q.tipo || 'test', corto: CORTO[q.num] };
  if (o.opciones) o.opciones = rota(o.id, o.opciones);
  if (o.tipo === 'destapa') o.puntos = q.puntos.map((p) => p.t);
  if (q._error) { Object.assign(o, error(q, q._error)); delete o._error; }
  if (o.tocar) o.tocar = { ...o.tocar, pista: 'Pulsa el botón y mira el monitor.' };
  return o;
});
/* ---------- Los dos casos: los de la maqueta, en el formato del motor ---------- */
const sinPaso = (s) => s.replace(/^Paso \d+ · /, '');
// Las opciones falsas de los casos, algo más largas para que la buena no se adivine por la longitud (mismo plan, más detalle)
const MAS = { 'Hiperventilar 24 horas para bajar la PIC.': 'Hiperventilar durante 24 horas seguidas para bajar la PIC cuanto antes.', 'Observar y repetir el TC en 6 horas.': 'Observar con neurológicos horarios y repetir el TC de control en 6 horas.',
  'Solo monitor de PIC y manitol, y repetir el TC mañana.': 'Colocar solo el monitor de PIC, dar manitol y repetir el TC mañana por la mañana.', 'PIC alta: más salino hipertónico.': 'PIC alta, aunque esté en 16: más salino hipertónico en bolo para asegurar.',
  'PPC baja: subir la PAM hasta PPC 100.': 'PPC baja: subir la PAM con vasopresor hasta conseguir una PPC de 100.', 'Sí: sin reflejos ni respiración se declara ya.': 'Sí: sin reflejos ni respiración espontánea ya se declara la muerte encefálica.',
  'Plasma fresco hasta que el INR baje de 1,5 y reevaluar mañana.': 'Plasma fresco hasta que el INR baje de 1,5 y reevaluar mañana con un TC de control.', 'Esperar a ver cómo evoluciona: GCS 13 es leve.': 'Esperar a ver cómo evoluciona unas horas: con GCS 13 se considera un cuadro leve.',
  'No monitorizo: en el hematoma basta mirar las pupilas.': 'No monitorizo la PIC: en el hematoma basta con vigilar las pupilas cada hora.', 'Subo la PAM a 150 por si el cerebro pide más flujo.': 'Subo la PAM hasta 150 por si el cerebro pide más flujo de sangre.',
  'Hiperventilar a PaCO₂ 25 para bajar la PIC ya.': 'Hiperventilar a PaCO₂ 25 mmHg para bajar la PIC ya y mantenerlo durante las primeras 24 horas seguidas.', 'Retirar el catéter: lleva tres días y se infecta.': 'Retirar el catéter ventricular: lleva tres días y puede infectarse.' };
const opsDe = (tuplas) => tuplas.map((t) => (t[1] ? { t: t[0], ok: true } : { t: MAS[t[0]] || t[0], porque: t[2] }));
const preguntaDe = (id, enun, tuplas) => ({ id, tipo: 'test', corto: id.slice(4), enunciado: sinPaso(enun), opciones: rota(id, opsDe(tuplas)),
  explicacion: tuplas.find((t) => t[1])[2], fuente: unicas(tuplas.map((t) => citaDe(t[3], t[4]))) });
const MOM_A = ['Urgencias · TCE', 'Quirófano · TC', 'Reanimación · tras la cirugía', 'Día 2 · UCI', 'Día 3 · UCI'];
const DAT_A = [{ Pupila: 'derecha fija', GCS: '9', 'PIC / PPC': '30 / 65' }, { TC: 'hematoma 55 mL, desvío 8 mm' }, { 'PIC / PPC': '16 / 68', PAM: '84' }, { Pupilas: 'medias y fijas', PIC: 'igual a la PAM (77)' }, { Temperatura: '36,6 °C', PAM: '77' }];
const MOM_S = ['Urgencias', 'A las 6 h', 'Hora 12', 'Día 3'];
const DAT_S = [{ PA: '196/108', INR: '3,2', GCS: '13' }, { GCS: '6', TC: 'sangre ventricular' }, { PIC: '26', PAM: '100', PPC: '74' }, { TC: 'hidrocefalia' }];
const caso = (id, titulo, sub, corto, pac, C, mom, dat, lleva, volver) => ({ id, titulo, sub, corto, paciente: pac,
  pasos: C.pasos.map((p, i) => ({ momento: mom[i], estado: p.e, datos: dat[i], nuevo: Object.keys(dat[i]), pregunta: preguntaDe(`${id}-${i + 1}`.replace('crv-', 'crv-caso-'), p.enun, p.ops) })),
  lleva, volver });
export const CASOS = [
  caso('crv-abundio', 'Abundio, 23 años', 'Traumatismo craneal · del hematoma a la muerte encefálica', 'Abundio', { Paciente: 'Abundio, 23 años', Motivo: 'traumatismo craneal con hematoma temporal derecho' }, CASO, MOM_A, DAT_A,
    LLEVAS.map((x, i) => `${x.replace(/ <span class="cita">.*$/, '')} (p. ${[11, 10, 45, 14][i]})`), { nombre: 'Hipertensión intracraneal (Marino, cap. 47)', ancla: 'mn-hic-pic' }),
  caso('crv-segismundo', 'Segismundo, 71 años', 'Hemorragia con warfarina · revertir, vigilar la PIC y drenar', 'Segismundo', { Paciente: 'Segismundo, 71 años, 80 kg', Motivo: 'hemorragia de ganglios basales con sangre ventricular; warfarina' }, CASO_SEG, MOM_S, DAT_S,
    CASO_SEG.llevas.map((x) => `${x[0]} (p. ${x[1]})`), { nombre: 'Hemorragia intracerebral (Marino, cap. 47)', ancla: 'mn-hic-warfarina' }),
];
