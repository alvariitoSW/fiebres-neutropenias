// La Mayéutica del pulmón vivo: guía socrática (6), examen nivel MIR (7) y tres casos que evolucionan (Isidro, Eulalia,
// Herminia) en el formato del motor común (core/mayeutica-motor.js). Sin DOM. Las citas son las de pulmon-vivo-data.js
// (C) y unas pocas propias (K); cada «Ver en la ficha» lleva a un párrafo de Merino Neumología. Las cifras de los casos
// y de las comprobaciones están copiadas del monitor de la app a 390 px (herramienta m-pulmon-cifras.mjs) y las vigila la
// prueba autonomo/bloques/b3/herramientas/m-may-cifras.mjs: `lee` (cifras del estado) y `cifras` (antes → después).
import { C, FICHA, PDF_A } from './pulmon-vivo-data.js';

const NEUMO = ['neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs'];
export const FICHA_M = { 'neumo-asma-epoc-basicos': [NEUMO, 'Asma y EPOC: lo básico', 'Asma y EPOC', PDF_A, 'Marino 2024'] };
const K = {
  cpap: { f: 'neumo-vni-metodos', id: 'nep-cpap-presion', sitio: 'CPAP: presión constante, usualmente 5-10 cmH₂O', p: 77 },
  edema: { f: 'neumo-vni-uso', id: 'nep-vni-edema', sitio: 'CPAP en el edema agudo de pulmón y el volumen sistólico', p: 83 },
  poscarga: { f: 'neumo-vni-uso', id: 'nep-poscarga-vpp', sitio: 'Poscarga: la presión positiva la baja (Ec. 26.1)', p: 87 },
  precarga: { f: 'neumo-vni-uso', id: 'nep-precarga-vpp', sitio: 'Precarga: la presión positiva frena el llenado (Fig. 26.7)', p: '85-86' },
  hipovol: { f: 'neumo-vni-uso', id: 'nep-precarga-vpp', sitio: 'La hipovolemia magnifica el efecto sobre el llenado', p: 86 },
  corazon: { f: 'neumo-vni-uso', id: 'nep-corazon-papel', sitio: 'El papel de la función cardíaca', p: 88 },
  peepGc: { f: 'neumo-vm-ajuste', id: 'nep-peep-gc', sitio: 'PEEP: oxigenación y aporte de O₂ (Fig. 27.6)', p: 12 },
  psili: { f: 'neumo-sdra-no-ventilatorio', id: 'nep-psili', sitio: 'P-SILI: esfuerzo aumentado, Vt ≥9,5 mL/kg e intubar antes que después (Fig. 24.4)', p: '40-42' },
  paradoj26: { f: 'neumo-vni-uso', id: 'neumo-nota-pulso-paradojico-26', sitio: 'Pulso paradójico: caída inspiratoria >10 mmHg (nota de fuentes)', p: 87 },
  paradoj23: { f: 'neumo-asma-epoc-basicos', id: 'neumo-nota-pulso-paradojico-23', sitio: 'Pulso paradójico: caída inspiratoria >12 mmHg (nota de fuentes)', p: 16 },
  muerto: { f: 'libro-azul-resp1', id: null, sitio: 'Espacio muerto: 150 de 500 mL; el volumen alveolar es menor que el minuto (pp. 389-390)', p: 5 },
};
const FICHAS = { ...FICHA, ...FICHA_M };
const pg = (p) => (/[-,]/.test(String(p)) ? `pp. ${p}` : `p. ${p}`);
// «(Marino 2024, p. 31)» al final de una opción falsa o de una frase: su página, para que el auditor la coteje
const src = (c) => ` <span class="pmy-src">(${FICHAS[c.f][4]}, ${pg(c.p)})</span>`;
const n1 = (v) => String(Math.round(v * 10) / 10).replace('.', ',');
const test = (id, grupo, corto, o) => ({ id, grupo, tipo: 'test', corto, predice: false, org: '', ...o });

// ───────── Guía socrática: cada pregunta pone el modelo en su estado y pide predecir antes de ver la cifra
const G1 = test('PG1', 'guia', 'pico y meseta', { predice: true, modelo: { estado: 'pausa-inspiratoria' },
  enunciado: 'Rafael, politrauma con pulmones sanos, está en volumen control. En la pausa inspiratoria la presión cae desde el pico y se queda plana. <b>Antes de mirar: ¿qué mide esa presión plana?</b>',
  opciones: [
    { t: 'La presión del alvéolo: sin flujo, la presión de la vía aérea se iguala con la alveolar.', ok: true },
    { t: 'La parte del pico que vence la resistencia de la vía aérea, la diferencia entre el pico y la PEEP.', porque: 'Esa parte es la que desaparece al parar el flujo (pico − meseta = Pres). Si tomaras la plana por ella, subestimarías cuánto distiende el volumen al alvéolo de Rafael.' + src(C.meseta) },
    { t: 'La presión pico, que se mantiene mientras el respirador sigue empujando.', porque: 'El pico cae justo al parar el flujo. Con esa idea creerías que 18 cmH₂O de pico ya son la presión alveolar y sobrestimarías el riesgo de Rafael.' + src(C.fig272) },
    { t: 'La PEEP: al cerrar la válvula el pulmón vuelve a su presión de reposo.', porque: 'En la pausa el alvéolo sigue lleno con todo el volumen insuflado; la PEEP es la presión al final de la espiración. Rafael seguiría con 13 de meseta, no con 5.' + src(C.finEsp) }],
  explicacion: 'Sin flujo no hay caída de presión por la resistencia: la presión que queda es la elástica del alvéolo (Pel), la meseta. Pico − meseta es lo que se gasta en vencer la resistencia.', fuente: [C.meseta, C.fig272],
  comprobar: { txt: 'Compruébalo: pico y meseta de Rafael', mandos: {}, mira: 'El pico baja a la meseta al parar el flujo; la diferencia es la resistencia.', cifras: null } });
const G2 = { id: 'PG2', grupo: 'guia', tipo: 'destapa', corto: 'SDRA: la meseta', predice: false, org: '', modelo: { estado: 'sdra-rigido', lee: { meseta: 32.1, cstat: 14, dp: 22.1 } },
  enunciado: 'Isidro, SDRA, Vt 420 mL (6 mL/kg de peso predicho) y PEEP 10: la meseta sale 32 cmH₂O y su Cstat, 14. <b>Escribe las dos cosas que haces con esa cifra.</b>',
  puntos: ['Reconocer que 32 pasa de 30: por encima de ese valor el riesgo de rotura alveolar deja de ser despreciable.', 'Bajar el Vt de 1 en 1 mL/kg hasta que la meseta baje de 30 o se llegue a 4 mL/kg.'],
  puntosOrg: ['', ''], fuente: [C.riesgo, C.t245], explicacion: 'La meseta es la presión del alvéolo: por eso el objetivo (≤30) se mira en ella y no en el pico.' };
const G3 = test('PG3', 'guia', 'el flujo que no llega a cero', { predice: true, modelo: { estado: 'broncoespasmo-auto-peep' },
  enunciado: 'Jacinto, EPOC grave, en volumen control con PEEP 0. En su curva de flujo, justo antes de la siguiente insuflación, el flujo espiratorio todavía no ha llegado a cero. <b>¿Qué significa?</b>',
  opciones: [
    { t: 'Que el pulmón aún se está vaciando cuando empieza la siguiente respiración: hay aire atrapado.', ok: true },
    { t: 'Que el respirador deja salir el aire contra una PEEP alta que Jacinto tiene puesta y por eso el flujo no llega a cero.', porque: 'Su PEEP marcada es 0: lo que frena la salida es la resistencia de su vía aérea, no una presión aplicada. Subir la PEEP creyendo esto le sumaría más presión a un pulmón ya hiperinsuflado.' + src(C.defOculta) },
    { t: 'Que espira con esfuerzo, tosiendo, y por eso el flujo sale tarde.', porque: 'La espiración es pasiva: el pulmón se vacía solo por su retracción. Sedar o relajar a Jacinto por esto no arreglaría el aire atrapado.' + src(C.finEsp) },
    { t: 'Que el pulmón se llena demasiado deprisa por una resistencia inspiratoria baja.', porque: 'El flujo al final de la espiración habla de cómo se vacía, no de cómo se llena. Jacinto seguiría con el aire atrapado sin que nadie lo buscara.' + src(C.fig235) }],
  explicacion: 'Ese flujo, que sigue saliendo cuando entra la siguiente insuflación, es la prueba de hiperinflación dinámica: el pulmón no ha terminado de vaciarse.', fuente: [C.fig235, C.defOculta] });
const G4 = test('PG4', 'guia', 'de PEEP 4 a 12', { predice: true, modelo: { estado: 'mejor-peep', mandos: { peep: 4 }, lee: { cstat: 9, dp: 20.2 } },
  enunciado: 'Isidro (SDRA, Vt 4 mL/kg) con PEEP 4. Subes la PEEP a 12 cmH₂O. <b>¿Qué pasa con su compliance estática (Cstat) y con la presión de conducción (meseta − PEEP)?</b>',
  opciones: [
    { t: 'La Cstat sube y la presión de conducción baja: las unidades dejan de cerrarse.', ok: true },
    { t: 'Suben las dos: la PEEP distiende más el pulmón y lo vuelve más rígido.', porque: 'En el estudio de PEEP creciente de Marino la compliance sube hasta una PEEP intermedia y la presión de conducción hace lo contrario; con esta idea no subirías la PEEP a quien aún tiene alvéolos por reclutar.' + src(C.mejorPeep) },
    { t: 'No cambian: la PEEP solo modifica la oxigenación.', porque: 'Sin PEEP el espacio aéreo colapsa al final de la espiración, y eso cambia la mecánica y empeora el intercambio de gases. Isidro seguiría abriendo y cerrando unidades.' + src(C.colapsoPeep) },
    { t: 'La Cstat baja y la presión de conducción sube: un pulmón rígido no tolera más presión de final de espiración.', porque: 'Eso le pasa con una PEEP excesiva (aquí, 20), cuando las unidades llegan a la zona plana de su curva; de 4 a 12 todavía hay unidades que reclutar.' + src(C.mejorPeep) }],
  explicacion: 'Con la PEEP por encima de la presión de cierre, las unidades dejan de colapsar y participan: la Cstat sube y la presión de conducción baja. Es el sentido del estudio de Marino, no una cifra para todos.', fuente: [C.mejorPeep, C.atelect],
  comprobar: { txt: 'Sube la PEEP a 12 en el respirador', mandos: { peep: 12 }, mira: 'La Cstat sube y la presión de conducción baja: las unidades dejan de cerrarse. (Partiendo de PEEP 12 desde el estado, la Cstat llega a 12: abrir pide más presión que mantener abierto.)', cifras: [['Cstat (mL/cmH₂O)', 'cstat', 9, 10], ['P. de conducción', 'dp', 20.2, 16.9]] } });
const G5 = test('PG5', 'guia', 'PSV y pulmón rígido', { predice: true, modelo: { estado: 'psv-disparo' },
  enunciado: 'Herminia respira en presión de soporte (PEEP 5, soporte 10) y su Cstat es 40. De pronto el pulmón se vuelve más rígido (Cstat 20) con los mismos ajustes. <b>¿Qué pasa con su volumen corriente?</b>',
  opciones: [
    { t: 'Baja: el flujo cae antes al 25 % de su pico y la insuflación termina antes.', ok: true },
    { t: 'Se mantiene: la presión de soporte garantiza el volumen que pidió el médico.', porque: 'La presión de soporte fija la presión, no el volumen: el volumen lo decide el paciente con su pulmón. Si lo creyeras, no vigilarías el Vt de Herminia al empeorar.' + src(C.psv4) },
    { t: 'Sube: el respirador alarga la insuflación para compensar la rigidez.', porque: 'El corte es por flujo, no por tiempo: no hay compensación. Esperar un volumen mayor dejaría a Herminia hipoventilada sin que saltara nada.' + src(C.psv4) },
    { t: 'Se mantiene: el respirador pasa solo a volumen control cuando cae la compliance.', porque: 'En presión de soporte el modo no cambia solo. Herminia seguiría con el soporte que tiene y un Vt menor.' + src(C.psv4) }],
  explicacion: 'Con la misma presión de soporte, si el pulmón se pone más rígido el flujo cae antes y entra menos volumen: el paciente fija el tiempo de insuflación y el volumen.', fuente: [C.psv4],
  comprobar: { txt: 'Baja la compliance de Herminia a 20', mandos: { c: 20 }, mira: 'La insuflación se acorta y el volumen cae a la mitad.', cifras: [['Vt (mL)', 'vt', 303, 152]] } });
const G6 = test('PG6', 'guia', 'PEEP en el corazón sano', { predice: true, modelo: { estado: 'vpp-corazon-normal' }, org: 'modelo (cifras ilustrativas)',
  enunciado: 'Rafael tiene el corazón sano y está ventilado con PEEP 4: su volumen sistólico (VS) es 67 mL. Subes la PEEP a 20 para oxigenar mejor. <b>¿Cuánto esperas que cambie el VS?</b>',
  opciones: [
    { t: 'Baja casi un tercio, hacia 46 mL: la presión frena el llenado y el corazón sano pierde más por la precarga de lo que gana por la poscarga.', ok: true },
    { t: 'Sube hacia 75 mL: la presión positiva baja la poscarga y siempre ayuda al ventrículo.', porque: 'Eso le pasa al corazón que falla, en la parte empinada de la curva de poscarga. En el sano, perder precarga pesa más: Rafael perdería gasto sin darse cuenta.' + src(K.corazon) },
    { t: 'Casi no cambia, unos 65 mL: la presión de la vía aérea apenas llega a la pleura y al corazón.', porque: 'Llega y rodea al corazón; por eso el llenado cae. Sin ver este efecto, Rafael podría hipotensarse con 20 y no se sabría por qué.' + src(K.precarga) },
    { t: 'Se hunde a la mitad, hacia 33 mL, pero solo si además hay hipovolemia.', porque: 'La hipovolemia magnifica el efecto, pero no es necesaria: el corazón sano ya pierde llenado con volemia normal. Rafael bajaría sin que nadie buscara la causa.' + src(K.hipovol) }],
  explicacion: 'La presión positiva dificulta el llenado; el corazón normal está en la parte empinada de la curva de precarga y en la plana de la de poscarga, así que su VS tiende a bajar. El aporte de O₂ es el gasto por el contenido arterial: el P/F puede subir y el aporte no.', fuente: [K.precarga, K.corazon, K.peepGc],
  comprobar: { txt: 'Sube la PEEP a 20 en el respirador', mandos: { peep: 20 }, mira: 'El VS y el gasto bajan; la PAM cae poco.', cifras: [['VS (mL)', 'cor-vs', 67, 46], ['Gasto cardíaco (L/min)', 'cor-gc', 4.9, 3.8], ['PAM (mmHg)', 'cor-pam', 86, 82]] } });

// ───────── Examen nivel MIR
const X1 = test('PE1', 'examen', 'el peso para el Vt', {
  enunciado: 'Isidro mide 1,75 m y pesa 96 kg, con SDRA. El residente programa 576 mL de Vt «a 6 mL/kg». <b>¿Cuál es el error y cuál sería el volumen del protocolo?</b>',
  opciones: [
    { t: 'Usó el peso real; con el peso predicho (70,5 kg), 6 mL/kg son unos 420 mL.', ok: true },
    { t: 'Ninguno: el Vt se calcula sobre el peso real, porque el pulmón crece con el peso.', porque: 'El pulmón se corresponde con la talla y el sexo, no con los kilos: el peso predicho es el que se asocia a volúmenes pulmonares normales. Con 576 mL Isidro recibiría unos 8 mL/kg de su peso predicho.' + src(C.t245) },
    { t: 'Debía usar 8 mL/kg del peso real, unos 770 mL.', porque: 'El 8 mL/kg es el volumen de partida del protocolo, y sobre el peso predicho: de ahí se baja hasta 6. Con 770 mL Isidro recibiría unos 11 mL/kg de su peso predicho, lejos del 6 del protocolo.' + src(C.t271) },
    { t: 'Usó 6 mL/kg, pero debía partir de 4 mL/kg sobre el peso predicho.', porque: 'El 4 mL/kg es el mínimo al que se llega si la meseta sigue pasando de 30, no el volumen inicial. Partir de ahí hipoventilaría a Isidro sin necesidad.' + src(C.t245) }],
  explicacion: 'El Vt se calcula con el peso predicho (por talla y sexo), no con el real. Para un varón de 1,75 m son 70,5 kg; 576 mL ya son unos 8 mL/kg de ese peso.', fuente: [C.t271, C.t245], org: 'ilustrativo (paciente) · ficha (fórmula y protocolo)' });
const X2 = test('PE2', 'examen', 'el pico sube, ¿y la meseta?', {
  enunciado: 'Rafael, en volumen control con flujo constante. Durante la noche el pico pasa de 28 a 42 cmH₂O y la meseta se queda en 24. <b>¿Qué ha cambiado?</b>',
  opciones: [
    { t: 'La resistencia de la vía aérea: pico − meseta pasó de 4 a 18, y la parte elástica no cambió.', ok: true },
    { t: 'La compliance: el pulmón se ha puesto más rígido.', porque: 'Si fuera la elastancia, subiría la meseta (Pel) junto con el pico. Con la meseta en 24 buscar un pulmón más rígido haría perder el tiempo con el problema real, la vía aérea.' + src(C.meseta) },
    { t: 'El volumen entregado: el respirador está dando más Vt del programado y por eso sube el pico sin cambiar la elasticidad.', porque: 'Más volumen en la misma compliance subiría también la meseta. Rafael tiene la meseta igual: lo que cambió fue el gasto de presión por el flujo.' + src(C.ec271) },
    { t: 'Nada importante: el pico solo refleja el volumen del pulmón.', porque: 'El pico suma resistencia y elastancia y no mide el volumen pulmonar; ignorar un salto de 14 cmH₂O de resistencia dejaría sin tratar su causa.' + src(C.ec271) }],
  explicacion: 'Pico = Pres + Pel; la meseta es Pel (más la PEEP). Un pico que sube con la meseta quieta es un problema de resistencia; el libro no enumera las causas.', fuente: [C.ec271, C.meseta], org: 'ilustrativo (28 → 42 y 24)' });
const X3 = test('PE3', 'examen', 'ventilación alveolar', {
  enunciado: 'Un paciente con 150 mL de espacio muerto pasa de Vt 500 y FR 14 a Vt 300 y FR 30 «para proteger el pulmón». <b>¿Cuánto aire llega al alvéolo por minuto con el nuevo ajuste?</b>',
  opciones: [
    { t: '4,5 L/min: (300 − 150) × 30.', ok: true },
    { t: '9 L/min: 300 × 30, el volumen minuto.', porque: 'Eso es el volumen minuto: el volumen que ventila los alvéolos es menor, porque el espacio muerto no intercambia gas. Creerlo ocultaría que la PaCO₂ puede subir.' + src(K.muerto) },
    { t: '8,85 L/min: 9 L/min menos 150 mL una sola vez.', porque: 'El espacio muerto se pierde en cada respiración, no una vez por minuto: son 30 veces 150 mL. El error de cálculo disimularía la hipoventilación alveolar.' + src(K.muerto) },
    { t: 'Más que antes (4,9 L/min): subir la FR compensa el menor volumen.', porque: 'Con Vt 500 y FR 14 son (500 − 150) × 14 = 4,9 L/min; con el nuevo ajuste son 4,5: aunque el volumen minuto sube de 7 a 9 L/min, llega menos aire al alvéolo.' + src(K.muerto) }],
  explicacion: 'En cada respiración, 150 mL no llegan al alvéolo: con Vt 300 llegan 150 y con FR 30 son 4,5 L/min. Por eso un Vt pequeño a FR alta ventila poco.', fuente: [K.muerto], org: 'ilustrativo (paciente) · Libro azul IV (150 mL de 500)' });
const X4 = test('PE4', 'examen', 'PVC alta con auto-PEEP', { modelo: { estado: 'eulalia-conectada' },
  enunciado: 'Eulalia, asma casi fatal recién conectada, tiene unos 14 cmH₂O de PEEP oculta y la presión venosa central sale alta. <b>¿Cómo lo interpretas?</b>',
  opciones: [
    { t: 'La PEEP oculta se transmite a la cava superior y eleva la PVC de forma falsa.', ok: true },
    { t: 'Hipervolemia real: hay que dar un diurético.', porque: 'La PVC está falsamente alta. Un diurético quitaría volumen a una paciente que, por el aire atrapado, ya recibe menos retorno venoso.' + src(C.efectos) },
    { t: 'La PVC es fiable: se mide dentro del tórax contra la presión atmosférica y la presión del tórax no influye en ella.', porque: 'La PEEP oculta sube la presión intratorácica media, dificulta el retorno venoso y falsea la PVC. Fiarse de la cifra llevaría a tratar un volumen que no sobra.' + src(C.efectos) },
    { t: 'Un fallo del catéter: hay que cambiarlo de sitio.', porque: 'El libro da otra explicación, la PEEP oculta transmitida a la cava. Cambiar el catéter no corregiría el aire atrapado ni la hipotensión.' + src(C.efectos) }],
  explicacion: 'Entre los efectos de la PEEP oculta, el libro cita que se transmite a la cava superior y crea un aumento espurio de la PVC.', fuente: [C.efectos, C.monOculta] });
const X5 = { id: 'PE5', grupo: 'examen', tipo: 'error', corto: 'frases del SDRA', predice: false, org: '', modelo: { estado: 'sdra-rigido' },
  enunciado: 'El R1 anota el plan de Isidro (Vt 420, PEEP 10, meseta 32). <b>Puede haber 0, 1 o 2 errores.</b>',
  frases: [
    { t: 'La meseta es la presión del alvéolo: por eso el objetivo de ≤30 se mira en la meseta y no en el pico.', mal: false, fuente: C.riesgo },
    { t: 'Con la meseta en 32, subo la PEEP: así la meseta baja de 30.', mal: true, c: 'La meseta incluye la PEEP, así que subirla no la baja. Se baja el Vt de 1 en 1 mL/kg hasta bajar de 30 o llegar a 4 mL/kg.', fuente: C.t245 },
    { t: 'La presión de conducción (meseta − PEEP) sale 22, pero Marino no da un objetivo numérico para ella.', mal: false, fuente: C.cstat }],
  explicacion: 'Solo la segunda es falsa: la PEEP forma parte de la meseta.', fuente: [C.riesgo, C.cstat] };
const X6 = test('PE6', 'examen', 'P-SILI', { modelo: { estado: 'p-sili' },
  enunciado: 'Elvira, 45 años, trasplantada renal, neumonía con fallo hipoxémico. Tras una hora de ventilación no invasiva el P/F no mejora y sus volúmenes son de 9,5 mL/kg de peso predicho o más. <b>¿Qué piensas y qué haces?</b>',
  opciones: [
    { t: 'Esfuerzo aumentado con posible lesión autoinducida (P-SILI): consideras intubar ya.', ok: true },
    { t: 'Buena señal: un volumen alto indica reserva respiratoria.', porque: 'El libro lo lee al revés: esos volúmenes son un esfuerzo respiratorio aumentado. Esperar con Elvira retrasaría la intubación en quien ya fracasa.' + src(K.psili) },
    { t: 'Subes el soporte para que tome aún más volumen y deje de trabajar tanto con la musculatura respiratoria.', porque: 'Un volumen alto con esfuerzo es justo lo que se asocia al daño; empujar más volumen podría empeorar la lesión que se quiere evitar.' + src(K.psili) },
    { t: 'Sigues otra hora con la misma VNI antes de decidir.', porque: 'La falta de mejoría del P/F tras una hora de VNI es mala respuesta e indica considerar la intubación; esperar otra hora alarga la lesión.' + src(K.psili) }],
  explicacion: 'Los pacientes que fracasan con VNI suelen tener volúmenes ≥9,5 mL/kg de peso predicho (más esfuerzo) y el P-SILI puede contribuir; si el P/F no mejora, se considera intubar.', fuente: [K.psili] });
const X7 = { id: 'PE7', grupo: 'examen', tipo: 'destapa', corto: 'efectos de la PEEP oculta', predice: false, org: '', modelo: { estado: 'eulalia-conectada' },
  enunciado: 'Eulalia tiene unos 14 cmH₂O de PEEP oculta. <b>Escribe tres consecuencias de esa PEEP oculta.</b>',
  puntos: ['Sube la presión intratorácica media: menos retorno venoso y menos gasto cardíaco.', 'Más trabajo para disparar el respirador: hacen falta presiones negativas mayores para meter el Vt.', 'Más riesgo de volutrauma y barotrauma por la hiperinsuflación.'],
  puntosOrg: ['', '', ''], fuente: [C.efectos, C.efectos, C.efectos], explicacion: 'Una cuarta, ya vista: la PVC sale falsamente alta.' };

// ───────── Casos. `lee` = cifras del estado en el monitor de la app (data-fila); el paso las enseña en la ficha del paciente
const paso = (momento, modelo, ficha, pregunta, extra = {}) => ({ momento, modelo, ficha, pregunta, ...extra });
const ISI = { paciente: '64 años, 96 kg, 1,75 m (peso predicho 70,5 kg)', dx: 'Neumonía bilateral → SDRA moderado' };
const L1 = { meseta: 32.1, cstat: 14, dp: 22.1, vt: 420 }, L2 = { meseta: 28.4, cstat: 13, dp: 18.4, vt: 350, vm: 10.5 };
const L3 = { meseta: 32.2, cstat: 7, dp: 14.2, vt: 225 }, L4 = { meseta: 27.2, cstat: 12, dp: 15.2, vt: 285 }, L5 = { meseta: 23.7, cstat: 8, dp: 23.7, vt: 285 };
const EUL = { paciente: '27 años, 60 kg, 1,62 m (peso predicho 54 kg)', dx: 'Asma casi fatal; PaCO₂ 42 tras 3 nebulizaciones' };
const HER = { paciente: '76 años, 92 kg, 1,55 m (peso predicho 47,9 kg)', dx: 'Edema agudo de pulmón, hipertensa' };
const hacer = (id, o) => ({ ...o, id, grupo: 'caso', corto: id });

export const CASOS = [
  { titulo: 'Isidro: SDRA, PEEP y meseta', sub: 'Un SDRA moderado: la meseta, la presión de conducción y el error de subir la PEEP por el P/F', corto: 'Isidro', paciente: {},
    volver: { nombre: 'SDRA: ventilación protectora', ancla: 'nep-protectora' },
    lleva: ['La meseta es la presión del alvéolo: se mira ≤30 y, si la pasa con 6 mL/kg de peso predicho, se baja el Vt de 1 en 1 hasta 4 mL/kg.', 'El P/F puede subir con la PEEP sin que suba el aporte de O₂: DO₂ = GC × CaO₂, y la PEEP puede bajar el gasto.', 'La mejor PEEP sale de la compliance y de la presión de conducción de este paciente: ni 0 (las unidades se abren y se cierran) ni 20 (sobredistensión).'],
    pasos: [
      paso('Día 2 de ventilación · P/F 110 con PEEP 10', { estado: 'sdra-rigido', lee: L1 }, [['Paciente', ISI.paciente], ['Diagnóstico', ISI.dx], ['Respirador', 'Volumen control · Vt 420 mL (6 mL/kg) · FR 30 · PEEP 10'], ['Meseta', n1(L1.meseta) + ' cmH₂O'], ['Cstat', n1(L1.cstat) + ' mL/cmH₂O'], ['P. de conducción', n1(L1.dp) + ' cmH₂O']],
        hacer('I1', { tipo: 'test', modelo: { estado: 'sdra-rigido' }, org: '', enunciado: 'Con el Vt a 6 mL/kg de peso predicho la meseta de Isidro sale 32. <b>¿Qué haces?</b>',
          opciones: [
            { t: 'Bajas el Vt a 5 mL/kg y vuelves a medir la meseta; sigues hasta bajar de 30 o llegar a 4 mL/kg.', ok: true },
            { t: 'Subes la PEEP hasta que la meseta baje de 30.', porque: 'La PEEP forma parte de la meseta: subirla la sube. Isidro quedaría con más presión en el alvéolo, no con menos.' + src(C.meseta) },
            { t: 'La dejas: con 6 mL/kg ya cumples el protocolo.', porque: 'El protocolo también pide meseta ≤30; por encima de 30 el riesgo de rotura alveolar ya no es despreciable, y Isidro tendría 32.' + src(C.riesgo) },
            { t: 'Pasas a presión control y la meseta se arregla sola.', porque: 'En presión control la presión la fijas tú, pero el volumen lo pone el pulmón: con una compliance de 14, Isidro recibiría menos volumen o más presión, no ambos arreglados.' + src(C.pcvPros) }],
          explicacion: 'Si la meseta pasa de 30 con 6 mL/kg, el protocolo baja el Vt de 1 en 1 mL/kg hasta que la meseta baje de 30 o se llegue a 4 mL/kg.', fuente: [C.t245, C.protectora] })),
      paso('Tras bajar el Vt a 5 mL/kg', { estado: 'sdra-rigido', mandos: { vt: 352 }, lee: L2 }, [['Respirador', 'Volumen control · Vt 350 mL (5 mL/kg) · FR 30 · PEEP 10'], ['Meseta', n1(L2.meseta) + ' cmH₂O'], ['P. de conducción', n1(L2.dp) + ' cmH₂O'], ['Volumen minuto', n1(L2.vm) + ' L/min'], ['pH (ejemplo)', '7,22']],
        hacer('I2', { tipo: 'test', modelo: { estado: 'sdra-rigido', mandos: { vt: 352 } }, org: 'ilustrativo (pH) · ficha (protocolo)', enunciado: 'La meseta ya está en 28; el volumen minuto bajó y la gasometría de Isidro da un pH de 7,22 (cifra de ejemplo). Su FR es 30. <b>¿Qué haces según la tercera etapa del protocolo?</b>',
          opciones: [
            { t: 'Subes la FR hasta que el pH pase de 7,30 o llegues a 35.', ok: true },
            { t: 'Subes de nuevo el Vt a 6 mL/kg para recuperar el pH.', porque: 'El Vt solo sube si el pH sigue por debajo de 7,15 con la FR ya en 35. Con 7,22 se vuelve a una meseta de 32 sin haber agotado la FR.' + src(C.t245) },
            { t: 'Dejas la FR en 30: la acidosis no se corrige subiendo la FR.', porque: 'El protocolo manda subirla con pH de 7,15 a 7,30. Dejarla sin tocar mantendría la acidosis de Isidro sin motivo.' + src(C.t245) },
            { t: 'Subes la FR a 45 para normalizar el pH cuanto antes.', porque: 'El techo del protocolo es 35; más frecuencia deja menos tiempo para exhalar y favorece la hiperinflación y la PEEP intrínseca.' + src(C.t271) }],
          explicacion: 'En la tercera etapa, con pH de 7,15 a 7,30 se sube la FR hasta que el pH pase de 7,30 o la FR llegue a 35.', fuente: [C.t245, C.t271] })),
      paso('Tarde · P/F sigue en 110', { estado: 'mejor-peep', mandos: { peep: 18 }, lee: L3 }, [['Respirador', 'Vt 225 mL (3,2 mL/kg) · PEEP 18 · alarma de presión 40'], ['Meseta', n1(L3.meseta) + ' cmH₂O'], ['Cstat', n1(L3.cstat) + ' mL/cmH₂O'], ['P. de conducción', n1(L3.dp) + ' cmH₂O']],
        hacer('I3', { tipo: 'error', modelo: { estado: 'mejor-peep', mandos: { peep: 18 } }, org: '', enunciado: 'El R1 sube la PEEP de Isidro a 18 y anota su razonamiento. <b>Puede haber 0, 1 o 2 errores.</b>',
          frases: [
            { t: 'Con PEEP 12 las cuatro unidades estaban abiertas y la Cstat era la mejor del barrido (12 mL/cmH₂O).', mal: false, fuente: C.mejorPeep },
            { t: 'Subo la PEEP a 18 porque sube el P/F: si oxigena mejor, el aporte de O₂ también sube.', mal: true, c: 'El P/F puede subir y el aporte de O₂ no: DO₂ = gasto × contenido arterial de O₂, y la PEEP puede bajar el gasto cardíaco.', fuente: K.peepGc },
            { t: 'Con PEEP 18 la meseta sale 32 y no importa: la PEEP no cuenta en la meseta.', mal: true, c: 'La meseta incluye la PEEP: con 18 sale 32,2, por encima de 30, y la Cstat cae a 7.', fuente: C.riesgo }],
          explicacion: 'Dos errores: la oxigenación no es el aporte de O₂, y la PEEP forma parte de la meseta.', fuente: [K.peepGc, C.riesgo, C.mejorPeep] })),
      paso('De vuelta a PEEP 12', { estado: 'mejor-peep', lee: L4 }, [['Respirador', 'Vt 285 mL (4 mL/kg) · PEEP 12'], ['Meseta', n1(L4.meseta) + ' cmH₂O'], ['Cstat', n1(L4.cstat) + ' mL/cmH₂O'], ['P. de conducción', n1(L4.dp) + ' cmH₂O']],
        hacer('I4', { tipo: 'test', modelo: { estado: 'mejor-peep' }, org: '', enunciado: 'Con PEEP 12 la Cstat de Isidro es 12 y la presión de conducción 15; con 18 eran 7 y 14. Mañana ingresa otra paciente con SDRA y un pulmón distinto. <b>¿Cómo eliges su PEEP?</b>',
          opciones: [
            { t: 'Pruebo valores crecientes de PEEP y me quedo con el que da su mejor Cstat y su menor presión de conducción.', ok: true },
            { t: 'Pongo 12, que fue la mejor PEEP de Isidro y del estudio de Marino, y la dejo fija mientras la oxigenación sea buena.', porque: 'El 12 sale del estudio de PEEP creciente de Marino y de este modelo, no de una norma. Con otro pulmón puede quedarse corto, y la paciente seguiría abriendo y cerrando unidades.' + src(C.t245) },
            { t: 'Pongo la que dé el P/F más alto, porque más oxigenación es más aporte de O₂ a los tejidos.', porque: 'Un P/F alto no equivale a mejor aporte de O₂: la PEEP puede bajar el gasto cardíaco. Con el P/F como guía se repite el error de la PEEP 18 de Isidro.' + src(K.peepGc) },
            { t: 'Pongo la más alta que mantenga la meseta por debajo de 30, porque así abro el máximo de unidades.', porque: 'La meseta de 30 es un tope de seguridad, no el objetivo. A Isidro con 18 la Cstat le cae a 7 aunque se cuide la meseta: hay unidades sobredistendidas y no más abiertas.' + src(C.riesgo) }],
          explicacion: 'El libro lo muestra con un estudio de PEEP creciente: la compliance sube, llega a un máximo y desciende. De ahí sale «la mejor PEEP» de ese estudio: no una cifra para todos, se busca de nuevo en cada paciente.', fuente: [C.mejorPeep, C.riesgo] })),
      paso('Un compañero propone quitarle la PEEP', { estado: 'atelectrauma-zeep', lee: L5 }, [['Respirador', 'Vt 285 mL (4 mL/kg) · PEEP 0'], ['Meseta', n1(L5.meseta) + ' cmH₂O'], ['Cstat', n1(L5.cstat) + ' mL/cmH₂O'], ['P. de conducción', n1(L5.dp) + ' cmH₂O']],
        hacer('I5', { tipo: 'destapa', modelo: { estado: 'atelectrauma-zeep' }, org: '', enunciado: 'Con PEEP 0 la meseta de Isidro baja a 24. «Así protegemos el pulmón», dice un compañero. <b>Escribe dos cosas que Isidro pierde sin PEEP.</b>',
          puntos: ['Las unidades se abren y se cierran en cada respiración (atelectrauma) y su Cstat cae a 8 mL/cmH₂O.', 'Sin PEEP el espacio aéreo colapsa al final de la espiración y empeora el intercambio de gases.'], puntosOrg: ['', ''], fuente: [C.atelect, C.colapsoPeep], explicacion: 'La meseta baja porque la PEEP forma parte de ella, no porque el pulmón esté mejor.' }))
    ] },
  { titulo: 'Eulalia: asma, auto-PEEP y pulso paradójico', sub: 'Un asma casi fatal: del pulso paradójico a la hipotensión al conectarla', corto: 'Eulalia', paciente: {},
    volver: { nombre: 'PEEP oculta', ancla: 'nep-definicion-oculta' },
    lleva: ['El pulso paradójico se define con >10 mmHg en un capítulo y >12 en otro: las fuentes discrepan y ninguno de estos signos es sensible ni específico.', 'La hipotensión tras conectar a un asmático se mira primero con el flujo espiratorio y la oclusión espiratoria: el aire atrapado frena el retorno venoso.', 'Todo lo que corrige la PEEP oculta busca más tiempo de vaciado: menos Vt, más flujo y menos FR; el volumen minuto baja.'],
    pasos: [
      paso('Urgencias · antes de intubar', { estado: 'eulalia-conectada', lee: { pico: 42.4 } }, [['Paciente', EUL.paciente], ['Diagnóstico', EUL.dx], ['Exploración', 'Frases cortas · PAS cae 11 mmHg al inspirar (cifra de ejemplo)']],
        hacer('E1', { tipo: 'test', modelo: { estado: 'eulalia-conectada' }, org: 'ilustrativo (11 mmHg) · ficha (umbrales)', enunciado: 'En la línea arterial, la PAS de Eulalia cae 11 mmHg en la inspiración (cifra de ejemplo). <b>¿Hay pulso paradójico?</b>',
          opciones: [
            { t: 'Depende de la fuente: >10 mmHg en el capítulo 26 (sí), >12 mmHg en el 23 (no).', ok: true },
            { t: 'Sí: el libro usa >10 mmHg en todos sus capítulos.', porque: 'El capítulo 23 lo define con una caída de >12 mmHg. Dar por seguro el valor te haría afirmar o negar el signo con una certeza que el libro no tiene.' + src(K.paradoj23) },
            { t: 'No: el umbral del libro es siempre >12 mmHg, porque el pulso paradójico se mide igual en todos los capítulos y en todas las fuentes.', porque: 'El capítulo 26 lo define con una caída de >10 mmHg. Con 11 mmHg descartarlo sin matices pasaría por alto un signo de esfuerzo inspiratorio exagerado.' + src(K.paradoj26) },
            { t: 'No existe: en el asma la PAS sube al inspirar.', porque: 'En inspiración espontánea la PAS baja; es la presión positiva la que la sube (pulso paradójico inverso). Confundirlos invertiría la lectura de la curva.' + src(K.paradoj26) }],
          explicacion: 'Dos capítulos del mismo libro lo definen distinto (>10 y >12 mmHg), y el capítulo 23 añade que ninguno de estos signos es sensible ni específico para la obstrucción grave: se recomiendan medidas más objetivas.', fuente: [K.paradoj26, K.paradoj23] })),
      paso('Recién conectada · se hipotensa', { estado: 'eulalia-conectada', lee: { pico: 42.4, peeptot: 14.1, flujofin: -13, pmedia: 10.4, vt: 500 }, },
        [['Respirador', 'Volumen control · Vt 500 mL (9,2 mL/kg) · FR 26 · PEEP 0'], ['Pico', '42,4 cmH₂O'], ['Flujo al final de la espiración', '−13 L/min · no llega a cero'], ['PEEP oculta (oclusión)', '14,1 cmH₂O'], ['Presión media de la vía aérea', '10,4 cmH₂O'], ['Situación', 'Hipotensión tras conectarla']],
        hacer('E2', { tipo: 'test', modelo: { estado: 'eulalia-conectada' }, org: '', enunciado: 'Eulalia se hipotensa al conectarla. <b>¿Qué hallazgo del respirador apunta a la causa?</b>',
          opciones: [
            { t: 'El flujo espiratorio no llega a cero y la oclusión da 14 de PEEP oculta: aire atrapado que frena el retorno venoso.', ok: true },
            { t: 'El pico de 42: indica un neumotórax.', porque: 'El pico suma resistencia y elastancia. El neumotórax se sospecha ante hipoxemia o hipotensión sin explicación y se confirma en la radiografía; descartar el aire atrapado antes sería un error.' + src(C.ec271) },
            { t: 'La sedación: el flujo que no llega a cero es un efecto de los fármacos.', porque: 'Ese flujo es la prueba de hiperinflación dinámica, no un efecto farmacológico. Atribuirlo a la sedación dejaría a Eulalia con el aire atrapado.' + src(C.fig235) },
            { t: 'Una PVC alta: indica sobrecarga de volumen.', porque: 'La PEEP oculta se transmite a la cava y eleva la PVC de forma falsa; tratarla con diuréticos le quitaría volumen a quien tiene menos retorno.' + src(C.efectos) }],
          explicacion: 'El flujo que sigue saliendo al final de la espiración y la PEEP oculta con la oclusión señalan la hiperinflación dinámica, que sube la presión intratorácica media y frena el retorno venoso. El neumotórax se descarta en la radiografía.', fuente: [C.fig235, C.oclusion28, C.efectos] }),
        { nuevo: ['Pico', 'Flujo al final de la espiración', 'PEEP oculta (oclusión)', 'Presión media de la vía aérea', 'Situación'] }),
      paso('Lo que el aire atrapado tarda en salir', { estado: 'eulalia-conectada', lee: { fr: 26 } }, [['Constante de tiempo', 'τ espiratoria 3,9 s (R·C del modelo)'], ['Espiración', 'Unos 1,8 s por ciclo (FR 26)']],
        hacer('E3', { tipo: 'test', modelo: { estado: 'eulalia-conectada' }, org: 'ilustrativo (R y C) · Libro azul IV (63,2 %)', enunciado: 'La constante de tiempo espiratoria de Eulalia es de 3,9 s y su espiración dura unos 1,8 s. <b>¿Qué fracción del volumen insuflado sale en ese tiempo?</b>',
          opciones: [
            { t: 'Menos del 63 %: ni siquiera se cumple una constante de tiempo.', ok: true },
            { t: 'El 63 %: es lo que sale en una constante de tiempo.', porque: 'Ese porcentaje sale al cumplirse una τ (3,9 s), y aquí la espiración dura menos de la mitad. Creerlo subestimaría el aire que queda atrapado en cada ciclo.' + src(C.tau) },
            { t: 'Casi todo: la espiración activa vacía el pulmón.', porque: 'En ventilación controlada la espiración es pasiva. Con esa idea no alargarías el tiempo espiratorio y el aire atrapado de Eulalia seguiría creciendo.' + src(C.finEsp) },
            { t: 'Todo: bastan dos constantes de tiempo y el pulmón queda vacío antes de la siguiente respiración.', porque: 'Para eliminar la auto-PEEP hacen falta 4-5 constantes de tiempo; con dos, parte del volumen se queda dentro.' + src(C.tau) }],
          explicacion: 'En una constante de tiempo (R × C) un alvéolo se vacía un 63,2 %; para eliminar la auto-PEEP hacen falta 4 o 5. Con 1,8 s frente a 3,9 s no se completa ni una.', fuente: [C.tau], }) ),
      paso('Antes del plan: dar tiempo a exhalar', { estado: 'eulalia-conectada' }, [['Objetivo', 'Que el pulmón se vacíe antes de la siguiente insuflación']],
        hacer('E3b', { tipo: 'destapa', modelo: { estado: 'eulalia-conectada' }, org: '', enunciado: 'Eulalia exhala menos de lo que se le insufla. <b>Escribe dos ajustes del respirador que le dan tiempo para vaciar el pulmón.</b>',
          puntos: ['Bajar la frecuencia respiratoria si se puede: cada ciclo dura más y la espiración tiene más tiempo, aunque baje el volumen minuto.', 'Subir el flujo inspiratorio: la inspiración se acorta y el resto del ciclo queda para exhalar.'], puntosOrg: ['', ''], fuente: [C.manejo, C.tau], explicacion: 'Bajar el Vt también ayuda, porque hay menos volumen que sacar. Todo esto reduce el volumen minuto y la PaCO₂ puede subir.' })),
      paso('Plan de ajuste del R1', { estado: 'eulalia-conectada' }, [['Objetivo', 'Dar tiempo para exhalar']],
        hacer('E4', { tipo: 'error', modelo: { estado: 'eulalia-conectada' }, org: '', enunciado: 'El R1 propone el plan para Eulalia. <b>Puede haber 0, 1 o 2 errores.</b>',
          frases: [
            { t: 'Para vaciar el pulmón: bajar el Vt, subir el flujo inspiratorio y bajar la FR si se puede.', mal: false, fuente: C.manejo },
            { t: 'La PaCO₂ sube, así que subo la FR para eliminar más CO₂.', mal: true, c: 'Con más FR hay menos tiempo para exhalar y más hiperinflación. Se baja la FR si se puede, aunque baje el volumen minuto.', fuente: C.manejo },
            { t: 'La PEEP oculta se ve en la presión de la vía aérea del respirador; no hace falta ocluir.', mal: true, c: 'La PEEP oculta no se ve en las presiones monitorizadas; se mide con la oclusión al final de la espiración.', fuente: C.monOculta }],
          explicacion: 'Dos errores: más frecuencia empeora el atrapamiento y la PEEP oculta no aparece en la presión monitorizada.', fuente: [C.manejo, C.monOculta, C.oclusion28] })),
      paso('Con el ajuste: FR 10, Vt 6 mL/kg, flujo 80', { estado: 'eulalia-ajustada', lee: { pico: 33.9, peeptot: 1.6, flujofin: -2, pmedia: 1.5, vm: 3.3, vt: 333 } }, [['Respirador', 'Volumen control · Vt 333 mL (6,2 mL/kg) · FR 10 · flujo 80'], ['Pico', '33,9 cmH₂O'], ['Flujo al final de la espiración', '−2 L/min · llega a cero'], ['PEEP oculta (oclusión)', '1,6 cmH₂O'], ['Presión media de la vía aérea', '1,5 cmH₂O'], ['Volumen minuto', '3,3 L/min']],
        hacer('E5', { tipo: 'test', modelo: { estado: 'eulalia-ajustada' }, org: 'modelo (cifras) · fisiología general (PaCO₂)', enunciado: 'Con el ajuste, el flujo llega a cero y la presión media de la vía aérea baja de 10,4 a 1,5 cmH₂O; el volumen minuto es 3,3 L/min. <b>¿Qué esperas en su presión arterial y en su PaCO₂?</b>',
          opciones: [
            { t: 'La PA se recupera, por menos presión intratorácica media; la PaCO₂ sube, por el menor volumen minuto.', ok: true },
            { t: 'La PA no cambia: la hipotensión era solo de la sedación.', porque: 'La PEEP oculta eleva la presión intratorácica media y frena el retorno venoso; al bajarla, la causa mecánica desaparece y la PA debe recuperarse. Atribuirla a la sedación dejaría sin valorar el atrapamiento.' + src(C.efectos) },
            { t: 'La PaCO₂ baja: con menos aire atrapado se ventila mejor.', porque: 'El libro avisa de que estas maniobras reducen el volumen minuto; con 3,3 L/min Eulalia elimina menos CO₂ y debes esperarlo.' + src(C.manejo) },
            { t: 'Ambas empeoran: con FR 10 el retorno venoso cae más.', porque: 'La FR baja no frena el retorno venoso; lo que lo frena es el aire atrapado, que aquí desaparece (PEEP oculta de 14 a 1,6).' + src(C.vppConsec) }],
          explicacion: 'Menos presión intratorácica media permite el retorno venoso y la PA se recupera. A cambio baja el volumen minuto y la PaCO₂ subirá; que en el asma se tolere es fisiología general.', fuente: [C.vppConsec, C.manejo] }))
    ] },
  { titulo: 'Herminia: edema agudo de pulmón y CPAP', sub: 'La presión de soporte, la CPAP que sube el volumen sistólico y el giro «quítale la CPAP»', corto: 'Herminia', paciente: {},
    volver: { nombre: 'CPAP en el edema agudo de pulmón', ancla: 'nep-vni-edema' },
    lleva: ['En presión de soporte el paciente fija el tiempo de insuflación y el volumen: el flujo cae al 25 % del pico y termina la respiración.', 'En el corazón que falla, la presión positiva baja la poscarga y sube el volumen sistólico; en el sano o el hipovolémico baja el llenado.', 'Una PA que sube con la CPAP es la mejoría del corazón, no un motivo para quitarla.'],
    pasos: [
      paso('Ya respira por su cuenta', { estado: 'psv-disparo', lee: { vt: 303, vm: 4.8 } }, [['Paciente', HER.paciente], ['Diagnóstico', HER.dx], ['Respirador', 'Presión de soporte 10 · PEEP 5 · FR 16'], ['Vt', '303 mL (6,3 mL/kg)'], ['Volumen minuto', '4,8 L/min']],
        hacer('H1', { tipo: 'test', modelo: { estado: 'psv-disparo' }, org: '', enunciado: 'Herminia respira en presión de soporte 10 con PEEP 5 y un Vt de 303 mL. Por el edema su pulmón se vuelve más rígido y la Cstat cae a la mitad; no tocas el respirador. <b>¿Qué pasa con su Vt y por qué?</b>',
          opciones: [
            { t: 'Baja, porque el flujo inspiratorio cae antes al 25 % de su pico y eso termina la insuflación.', ok: true },
            { t: 'Baja, porque el respirador corta la insuflación al llegar al tiempo inspiratorio que tiene programado.', porque: 'En soporte no hay tiempo programado: el paciente lo fija con el ciclado por flujo. Si lo creyeras, alargarías el tiempo inspiratorio sin ningún efecto y Herminia seguiría hipoventilada.' + src(C.psv4) },
            { t: 'Se mantiene, porque la presión de soporte entrega el volumen que el médico pidió.', porque: 'La presión de soporte fija la presión, no el volumen: Herminia recibiría menos aire sin que saltara ninguna alarma de volumen.' + src(C.psv4) },
            { t: 'Sube, porque el respirador mantiene el flujo más tiempo para compensar la rigidez.', porque: 'El corte es por flujo, no hay compensación. Esperar más volumen dejaría a Herminia con un Vt bajo sin que nadie lo vigilara.' + src(C.psv4) }],
          explicacion: 'Con la misma presión de soporte, un pulmón más rígido hace caer el flujo antes: la insuflación termina antes y entra menos volumen. Por eso el soporte se ajusta al Vt real.', fuente: [C.psv4] })),
      paso('Pasa a CPAP · antes de ponerla', { estado: 'cpap-eap', lee: { 'cor-vs': 34, 'cor-gc': 3.4, 'cor-pam': 72 } }, [['Respirador', 'CPAP 0 (soporte 0)'], ['Volumen sistólico', '34 mL'], ['Gasto cardíaco', '3,4 L/min'], ['PAM', '72 mmHg']],
        hacer('H2', { tipo: 'test', predice: true, modelo: { estado: 'cpap-eap' }, org: 'modelo (cifras ilustrativas)', enunciado: 'Herminia está en edema agudo de pulmón con un corazón que falla. Pones CPAP de 10 cmH₂O. <b>Antes de mirar: ¿qué le pasa a su volumen sistólico?</b>',
          opciones: [
            { t: 'Sube: la presión positiva baja la poscarga del VI y le ayuda a eyectar.', ok: true },
            { t: 'Baja: la CPAP frena el retorno venoso y el volumen sistólico cae, como en un corazón sano con hipovolemia.', porque: 'Eso le pasa al corazón sano o hipovolémico. El que falla está en la parte plana de la curva de precarga y gana más con menos poscarga. Retirar la CPAP por este miedo le quitaría el apoyo.' + src(K.corazon) },
            { t: 'No cambia: la presión del pulmón no llega al corazón.', porque: 'Llega a la pleura y rodea al corazón: poscarga = presión de la cámara − presión pleural. Sin este efecto no entenderías por qué la CPAP mejora a Herminia.' + src(K.poscarga) },
            { t: 'Solo sube con CPAP de 15 o más.', porque: 'La CPAP habitual es de 5 a 10, y el efecto ya aparece a 5. Subir a 15 sin necesidad le añadiría presión sin más beneficio en el modelo.' + src(K.cpap) }],
          explicacion: 'La presión positiva asiste al VI en la eyección: con la pleura más positiva baja la poscarga y sube el volumen sistólico.', fuente: [K.poscarga, K.edema, K.corazon],
          comprobar: { txt: 'Pon la CPAP en 10', mandos: { peep: 10 }, mira: 'El volumen sistólico, el gasto y la PAM suben.', cifras: [['VS (mL)', 'cor-vs', 34, 38], ['Gasto cardíaco (L/min)', 'cor-gc', 3.4, 3.6], ['PAM (mmHg)', 'cor-pam', 72, 75]] } })),
      paso('Con CPAP 10 · la PA ha subido', { estado: 'cpap-eap', mandos: { peep: 10 }, lee: { 'cor-vs': 38, 'cor-gc': 3.6, 'cor-pam': 75 } }, [['Respirador', 'CPAP 10'], ['Volumen sistólico', '38 mL'], ['Gasto cardíaco', '3,6 L/min'], ['PAM', '75 mmHg']],
        hacer('H3', { tipo: 'error', modelo: { estado: 'cpap-eap', mandos: { peep: 10 } }, org: '', enunciado: 'La PAM de Herminia pasó de 72 a 75 mmHg. El R1 comenta el cambio. <b>Puede haber 0, 1 o 2 errores.</b>',
          frases: [
            { t: 'La PAM subió porque la CPAP bajó la poscarga del VI y el volumen sistólico pasó de 34 a 38 mL.', mal: false, fuente: K.poscarga },
            { t: 'Quítale la CPAP, que la PA ha subido: así no sube más.', mal: true, c: 'La subida es la mejoría del corazón: al quitar la CPAP el VS vuelve de 38 a 34 mL y Herminia pierde la ayuda a la eyección.', fuente: K.edema },
            { t: 'Con hipovolemia la misma CPAP le bajaría el gasto cardíaco.', mal: false, fuente: K.hipovol }],
          explicacion: 'Solo la segunda es falsa: una PA que sube con la CPAP en el edema agudo de pulmón no es un motivo para retirarla.', fuente: [K.poscarga, K.edema, K.hipovol] })),
      paso('¿Por qué en ella sube y en un sano baja?', { estado: 'vpp-corazon-normal' }, [['Comparación', 'El corazón sano de Rafael con PEEP 4 → 20: VS 67 → 46 mL']],
        hacer('H4', { tipo: 'destapa', modelo: { estado: 'cpap-eap', mandos: { peep: 10 } }, org: '', enunciado: 'La misma presión sube el VS de Herminia y baja el de un corazón sano. <b>Escribe dos razones.</b>',
          puntos: ['Poscarga = presión de la cámara − presión pleural: con la pleura más positiva, el VI del corazón que falla eyecta con menos esfuerzo.', 'El corazón que falla está en la parte plana de la curva de precarga y en la empinada de la de poscarga; el sano, al revés: perder llenado le baja el VS.'], puntosOrg: ['', ''], fuente: [K.poscarga, K.corazon], explicacion: 'Si además hay hipovolemia, el efecto sobre el llenado se magnifica.' })),
      paso('¿Cuánta CPAP?', { estado: 'cpap-eap', mandos: { peep: 10 } }, [['Respirador', 'CPAP 10']],
        hacer('H5', { tipo: 'test', modelo: { estado: 'cpap-eap', mandos: { peep: 10 } }, org: '', enunciado: 'Para el edema agudo de pulmón de Herminia, el compañero propone CPAP de 20 «como la PEEP máxima de ventilación mecánica». <b>¿Qué le dices?</b>',
          opciones: [
            { t: 'Que la CPAP es usualmente de 5 a 10; el rango de 10-20 es de la PEEP en ventilación mecánica para abrir lo colapsado.', ok: true },
            { t: 'Que está bien: la CPAP y la PEEP tienen el mismo rango.', porque: 'La CPAP en VNI es usualmente de 5 a 10; la PEEP de 10-20 pertenece a la ventilación mecánica. Con 20, Herminia recibiría más presión de la que el modelo ni la ficha dan por habitual.' + src(K.cpap) },
            { t: 'Que debe ser siempre 5: más presión no ayuda.', porque: 'El rango habitual llega a 10 y en el modelo el VS sube de 34 a 38 mL entre 0 y 10; quedarse en 5 por norma renunciaría a esa ayuda.' + src(K.cpap) },
            { t: 'Que 20 solo sobra si el corazón es sano.', porque: 'La CPAP habitual es de 5 a 10 en cualquier corazón; el modelo no deja pasar de 10 porque más sería extrapolar el beneficio sin fuente.' + src(K.cpap) }],
          explicacion: 'La CPAP es una presión constante, usualmente de 5 a 10 cmH₂O; la PEEP de 10-20 abre lo colapsado en ventilación mecánica.', fuente: [K.cpap, C.mejorPeep] }))
    ] },
];

export const PREGUNTAS = [G1, G2, G3, G4, G5, G6, X1, X2, X3, X4, X5, X6, X7].map((q) => ({ ...q, fuente: q.fuente }));
export { FICHAS };
