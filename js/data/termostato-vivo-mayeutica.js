// Las preguntas y los casos de la Mayéutica del termostato vivo (Marino caps. 43-44, docs/marino-2024-abdomen-temperatura-caps39-44.pdf).
// Solo datos; el motor es js/core/mayeutica-motor.js. Las respuestas viven aquí: el HTML no las lleva hasta que se contesta.
// Cada cita es 'página|id del párrafo de la ficha' (la misma forma que usa el modelo). Las cifras del paciente salen del
// propio modelo (ESTADOS): nunca se escriben a mano. Una pregunta con `tocar` se comprueba en el modelo: { txt, patch, cuenta(antes, después) }.
import { ESTADOS } from './termostato-vivo-data.js';
const coma = (v, d = 1) => (+v).toFixed(d).replace('.', ',');
const est = (e, paso, trat = 0, ysi = null) => ({ est: e, paso, trat, ysi });
const P = (e, paso) => ESTADOS[e].pasos[paso - 1];
// Lo que el monitor muestra en un estado, para la ficha del paciente del caso (T, FC y lo que haya de PA, K⁺, CK)
const fila = (e, paso, trat = 0) => { const p = { ...P(e, paso), ...(trat ? P(e, paso).con : {}) };
  return [['T central', `${coma(p.T)} °C`, 1], ['FC', p.fc === 0 ? 'asistolia' : String(p.fc), 1], ...(p.pa ? [['PA', p.pa, 1]] : []), ...(p.k ? [['K⁺', `${coma(p.k)} mEq/L`, 1]] : []), ...(p.ck ? [['CK', `${p.ck.toLocaleString('es')} U/L`, 1]] : [])]; };
const sube = (a, b, u = '') => `${a}${u} → ${b}${u}`;
const PREG_RECORRIDO = [
  { grupo: 'guia', num: 'G1', predice: true, estado: est('fiebre', 1),
    enunciado: 'Dorotea tiene una infección y un pirógeno llega a su hipotálamo. <b>¿Qué es lo primero que cambia?</b> Mira después el dial del hipotálamo.',
    opciones: [
      { t: 'El punto de ajuste: sube, y 37 °C pasa a ser «frío» para su hipotálamo.', ok: true },
      { t: 'La producción de calor: el pirógeno calienta el cuerpo directamente y la temperatura sube sola.', porque: 'La fiebre es un termostato sano con el punto de ajuste más alto (p. 45), no un calentamiento sin control. Si lo piensas así, buscarás enfriar a Dorotea a la fuerza, justo lo que le hace tiritar (p. 72).' },
      { t: 'La pérdida de calor: el pirógeno estropea el radiador de la piel y no puede soltar calor.', porque: 'Un defecto de la regulación es hipertermia, no fiebre (p. 45). En Dorotea la regulación funciona: lo cierra el propio hipotálamo para llegar a su ajuste nuevo (p. 72).' },
      { t: 'Nada, hasta que la temperatura real suba: el termostato solo reacciona a lo que mide.', porque: 'El ajuste se mueve antes que la temperatura real, y por eso el cuerpo ya responde como si tuviera frío (p. 72). Esperar a ver la temperatura es llegar tarde a lo que ya está pasando.' }],
    explicacion: 'En la fiebre, el sistema regula con normalidad pero con el punto de ajuste más alto (p. 45): la respuesta febril imita la respuesta al frío (p. 72).', fuente: ['45|ma-fiebre-def', '72|ma-antip-mantas'],
    tocar: { txt: 'Compruébalo: deja que el pirógeno suba el ajuste', patch: est('fiebre', 2), cuenta: (a, d) => `el ajuste pasa de ${coma(a.pt)} a ${coma(d.pt)} °C con la temperatura real todavía en ${coma(d.T)} °C: ya hay escalofrío y los vasos de la piel se cierran.` } },
  { grupo: 'guia', num: 'G2', predice: true, estado: est('fiebre', 2),
    enunciado: 'Ahora el ajuste de Dorotea está en 39,6 °C y su temperatura real, bastante por debajo. <b>¿Qué hace su cuerpo para llegar al ajuste?</b>',
    opciones: [
      { t: 'Suda y abre los vasos de la piel para soltar el calor que le sobra.', porque: 'Eso lo haría si la temperatura real estuviera por encima del ajuste. Aquí está por debajo y el cuerpo responde como al frío (p. 72). Si esperas sudor, le pondrás un ventilador a una paciente que ya tirita.' },
      { t: 'Cierra la piel y tirita: así conserva y fabrica calor hasta alcanzar el ajuste.', ok: true },
      { t: 'No hace nada: la infección sube la temperatura por su cuenta y el hipotálamo lo acepta.', porque: 'El hipotálamo no acepta: persigue su ajuste con las defensas contra el frío (p. 72). Sin entender eso, verías el escalofrío como una complicación y no como el mecanismo de la fiebre.' },
      { t: 'Solo acelera el corazón; los vasos y el músculo no intervienen.', porque: 'La piel se cierra y el músculo tirita (p. 72), y el escalofrío puede duplicar el calor que produce el cuerpo (p. 53). Ignorarlo te haría pasar por alto el trabajo muscular que hay detrás.' }],
    explicacion: 'Cutánea y muscular: la vasoconstricción de la piel (menos pérdida) y el escalofrío (hasta el doble de calor) llevan la temperatura al ajuste (p. 72; p. 53).', fuente: ['72|ma-antip-mantas', '53|ma-hipo-fisio'],
    tocar: { txt: 'Compruébalo: pasa de hora', patch: est('fiebre', 3), cuenta: (a, d) => `la temperatura sube de ${coma(a.T)} a ${coma(d.T)} °C, la FC de ${a.fc} a ${d.fc} y sigue el escalofrío, con la piel cerrada.` } },
  { grupo: 'guia', num: 'G3', tipo: 'destapa', estado: est('golpe', 2),
    enunciado: 'Ovidio, 34 años, termina una carrera en verano. Su cuerpo fabrica calor y tiene que soltarlo. <b>¿Qué tienes que saber de cómo se pierde?</b> Son tres cosas.',
    puntos: [
      { t: 'En reposo el cuerpo es un horno que subiría su temperatura <span class="hl-azul">1 °C cada hora</span> si no soltara calor; el radiador es la piel.', c: '45|ma-calor' },
      { t: 'Sale por <span class="hl-azul">convección</span> (el flujo de sangre y de aire) y por <span class="hl-azul">evaporación</span>: cada litro de sudor que se evapora se lleva 580 kcal.', c: '46|ma-calor-evaporacion' },
      { t: 'El sudor tiene que <span class="hl-rojo">evaporarse</span>: secarle el sudor a Ovidio no le enfría, y por eso no se hace.', c: '46|ma-calor-evaporacion' }],
    explicacion: 'Sudando 1-2 litros por hora, el cuerpo pierde más de 1.000 kcal en una hora, pero solo si el sudor se evapora (p. 46).', fuente: ['45|ma-calor', '46|ma-calor-evaporacion'] },
  { grupo: 'guia', num: 'G4', predice: true, estado: est('golpe', 4),
    enunciado: 'Ovidio llega con 41,6 °C, delirio y piel seca. Vas a darle 1 g de paracetamol IV. <b>¿Qué hará con su temperatura?</b>',
    opciones: [
      { t: 'Bajará poco a poco, como en cualquier fiebre.', porque: 'No es fiebre: el punto de ajuste no se ha movido y el antipirético no tiene sobre qué actuar (p. 45). Esperar a que baje es perder minutos con un golpe de calor.' },
      { t: 'Nada: el ajuste sigue en 37 °C, así que el antipirético no actúa.', ok: true },
      { t: 'Bajará menos que en la fiebre, pero algo ayudará mientras llega el hielo.', porque: 'En la hipertermia los antipiréticos son ineficaces (p. 45), no «menos eficaces». Cada minuto que Ovidio pase a 41,6 °C sin enfriar daña más órganos (p. 47).' },
      { t: 'Subirá: el paracetamol es hepatotóxico y Ovidio ya tiene el hígado afectado.', porque: 'El paracetamol es hepatotóxico (p. 72), pero no sube la temperatura. Quedarte en ese miedo te hará olvidar lo importante: enfriar ya (p. 47).' }],
    explicacion: 'Hipertermia es un defecto de la regulación; fiebre, un sistema normal con el ajuste alto. Por eso los antipiréticos (el paracetamol) no sirven en la hipertermia (p. 45).', fuente: ['45|ma-calor-hipertermia'],
    tocar: { txt: 'Compruébalo: dale el paracetamol', patch: { ...est('golpe', 4), ysi: 'golpe' }, cuenta: (a, d) => `Ovidio sigue en ${coma(d.T)} °C con PA ${d.pa}, y el dial del hipotálamo sigue en ${coma(d.pt, 0)} °C: no se ha movido.` } },
  { grupo: 'guia', num: 'G5', predice: true, estado: est('golpe', 4),
    enunciado: 'Ovidio, 41,6 °C: lo enfrías con evaporación e hielo en ingles, axilas y cuello. <b>¿Hasta qué temperatura sigues enfriando?</b>',
    opciones: [
      { t: 'Hasta unos 38 °C, y ahí se para.', ok: true },
      { t: 'Hasta 35 °C, para asegurar que no vuelve a subir.', porque: 'La meta de la ficha es 38 °C (p. 47). Enfriar de más favorece el escalofrío, que es contraproducente porque sube la temperatura (p. 47).' },
      { t: 'Hasta 37 °C, el ajuste de su hipotálamo.', porque: 'La meta es 38 °C (p. 47). Insistir por debajo acerca el escalofrío del enfriamiento externo, que le devolvería calor a Ovidio (p. 47).' },
      { t: 'Hasta que deje de delirar, sin mirar la cifra.', porque: 'El delirio no es un objetivo medible: la meta es la temperatura, 38 °C (p. 47). Sin cifra, Ovidio podría pasarse de frío o quedarse corto.' }],
    explicacion: 'El enfriamiento activo se dirige a 38 °C (p. 47); a 0,3 °C por minuto con la evaporación, de 41,6 a 38,2 °C son unos 11 minutos (cuenta del modelo). El escalofrío del enfriamiento externo es contraproducente (p. 47).', fuente: ['47|ma-calor-golpe'],
    tocar: { txt: 'Compruébalo: enfría a Ovidio', patch: est('golpe', 4, 1), cuenta: (a, d) => `la temperatura baja de ${coma(a.T)} a ${coma(d.T)} °C, la FC de ${a.fc} a ${d.fc}, la PA sube de ${a.pa} a ${d.pa} y vuelve el sudor.` } },
  { grupo: 'guia', num: 'G6', predice: true, estado: est('snm', 2),
    enunciado: 'Jacinta, 47 años, lleva haloperidol desde hace unos días. Ahora tiene rigidez en tubo de plomo y 37,6 °C. El termostato de Jacinta no se ha movido. <b>¿Cuándo se espera que suba su temperatura?</b>',
    opciones: [
      { t: 'Antes que la rigidez: el haloperidol calienta y el músculo se pone rígido por la fiebre.', porque: 'Es al revés: la rigidez va primero (p. 50). Si esperas fiebre para sospechar, tardarás en retirar el haloperidol mientras el músculo rígido produce calor.' },
      { t: 'Nunca: el síndrome neuroléptico maligno se diagnostica sin fiebre.', porque: 'La hipertermia es parte del cuadro (p. 49). Descartarlo por tener 37,6 °C te haría seguir con el fármaco, que es lo que lo causa (p. 50).' },
      { t: 'Hasta 8-10 horas después de empezar la rigidez, porque el músculo rígido produce el calor.', ok: true },
      { t: 'Al mismo tiempo que los primeros síntomas, de golpe, porque la dosis lo marca.', porque: 'No hay relación entre la dosis y la aparición del síndrome (p. 50): es una reacción idiosincrásica, no tóxica. La fiebre se retrasa respecto a la rigidez (p. 50).' }],
    explicacion: 'En el síndrome neuroléptico maligno las primeras manifestaciones son la rigidez y la confusión, y la fiebre puede retrasarse 8-10 horas; el calor lo produce la musculatura rígida (p. 50).', fuente: ['50|ma-snm-clinica'],
    tocar: { txt: 'Compruébalo: pasan las horas', patch: est('snm', 3), cuenta: (a, d) => `la temperatura sube de ${coma(a.T)} a ${coma(d.T)} °C y la FC de ${a.fc} a ${d.fc}, con el dial del hipotálamo quieto en ${coma(d.pt, 0)} °C: calienta el músculo, no el termostato.` } },
  { grupo: 'guia', num: 'G7', predice: true, estado: est('hipo', 2),
    enunciado: 'Honorato, 72 años, hallado en la calle: tirita y tiene bradicardia. Si se sigue enfriando hasta unos 27 °C, <b>¿qué pasa con el escalofrío y con el corazón?</b>',
    opciones: [
      { t: 'Tirita más fuerte y la FC sube: cuanto más frío, más defensa.', porque: 'Esas defensas protegen solo en las fases iniciales (p. 53). Por debajo de 28 °C el escalofrío desaparece (p. 54): esperar más defensa te dejaría sin ver que Honorato se está apagando.' },
      { t: 'Deja de tiritar, la bradicardia empeora y por debajo de 28 °C hay riesgo de fibrilación ventricular.', ok: true },
      { t: 'Se mantiene igual hasta los 24 °C y solo entonces cambia algo.', porque: 'Ya por debajo de 32 °C hay bradicardia que no responde a atropina y por debajo de 28 °C hay riesgo de FV (p. 56). Esperar a los 24 °C sería llegar con asistolia.' },
      { t: 'La FC sube por el estrés y el escalofrío se mantiene hasta 24 °C.', porque: 'La tabla de la fuente da bradicardia y sin escalofrío en la hipotermia grave (p. 54). Contar con taquicardia retrasaría el recalentamiento.' }],
    explicacion: 'Moderada (28-31,9 °C): escalofrío reducido o ausente y bradicardia; grave (<28 °C): coma, sin escalofrío, pupilas fijas, hipotensión (Tabla 43.6, p. 54); y riesgo de FV y asistolia por debajo de 28 °C (p. 56).', fuente: ['54|ma-hipo-grados', '56|ma-hipo-arritmias'],
    tocar: { txt: 'Compruébalo: sigue enfriándose', patch: est('hipo', 3), cuenta: (a, d) => `la temperatura baja de ${coma(a.T)} a ${coma(d.T)} °C, la FC de ${a.fc} a ${d.fc}, el escalofrío ${d.esc ? 'sigue' : 'desaparece'} y la PA es ${d.pa}.` } },
  { grupo: 'guia', num: 'G8', estado: est('fiebre', 4),
    enunciado: 'Dorotea, 55 años, en shock séptico, mantiene 39,6 °C. El R1 propone bajarle la temperatura «para que gaste menos». <b>¿Qué haces?</b>',
    opciones: [
      { t: 'Paracetamol 1 g cada 8 h, de rutina: toda fiebre en la UCI se baja.', porque: 'La guía más reciente recomienda no suprimir la fiebre de forma sistemática (p. 71). En un shock séptico, Dorotea perdería una defensa (p. 70), y un estudio vio más mortalidad en sépticos tratados con antipiréticos (p. 70).' },
      { t: 'No la bajas de rutina: es una defensa, y las guías no recomiendan suprimirla.', ok: true },
      { t: 'La bajas con una manta de enfriamiento, que no tiene efectos adversos como los fármacos.', porque: 'La manta es contraproducente en la fiebre: cierra la piel y provoca escalofrío, que sube la temperatura (p. 72). Dorotea tiritaría más.' },
      { t: 'La bajas porque a más temperatura, más mortalidad en la sepsis.', porque: 'Es al revés: en 2.225 pacientes con sepsis grave y shock la temperatura inicial se asoció de forma inversa con la mortalidad (p. 70-71). La figura es observacional, pero no apoya bajarla.' }],
    explicacion: 'Fiebre no es una enfermedad sino una respuesta adaptativa de defensa; se baja con lesión cerebral isquémica (parada, ictus), no de rutina (p. 71).', fuente: ['70|ma-antip-defensa', '71|ma-antipireticos'] },
  { grupo: 'guia', num: 'G9', predice: true, estado: est('fiebre', 4),
    enunciado: 'Dorotea tiene 39,6 °C y le pones una manta de enfriamiento. <b>¿Qué hace su cuerpo?</b>',
    opciones: [
      { t: 'Baja el ajuste del hipotálamo y su temperatura desciende.', porque: 'La manta no toca el punto de ajuste: eso lo hace el antipirético al frenar la prostaglandina E (p. 71). Con la manta, el ajuste sigue alto y Dorotea lo persigue.' },
      { t: 'Cierra más la piel y tirita: el escalofrío aumenta la producción de calor.', ok: true },
      { t: 'Suda más para compensar el frío externo.', porque: 'Con la manta la respuesta es de frío: piel cerrada y escalofrío (p. 72). Si esperas sudor, verás el escalofrío como una reacción alérgica a la manta.' },
      { t: 'No cambia nada: la piel de Dorotea ya está cerrada y no puede cerrarse más.', porque: 'La manta agrava la vasoconstricción y el esfuerzo muscular que producen la fiebre (p. 72). Pensar que no hace nada la deja puesta sobre una paciente que tirita.' }],
    explicacion: 'La respuesta febril hace que el cuerpo se comporte como si estuviera envuelto en una manta de enfriamiento; añadir una agrava la vasoconstricción y el escalofrío (p. 72). Las mantas son más apropiadas en el golpe de calor.', fuente: ['72|ma-antip-mantas'],
    tocar: { txt: 'Compruébalo: ponle la manta', patch: { ...est('fiebre', 4), ysi: 'fiebre' }, cuenta: (a, d) => `con la manta, el escalofrío pasa de ${a.esc ? 'sí' : 'no'} a ${d.esc ? 'sí' : 'no'} y los vasos de la piel se cierran; la temperatura real sigue en ${coma(d.T)} °C.` } },
  { grupo: 'examen', num: 'E1', estado: est('hm', 3),
    enunciado: 'Marcial, 28 años y 75 kg, en quirófano con sevoflurano: el CO₂ espirado sube, el masetero se pone rígido y la T aún es 37,2 °C. Suspendes el halogenado. <b>¿Cómo pautas el dantroleno?</b>',
    opciones: [
      { t: 'Una dosis de 1 mg/kg (75 mg) y esperar a ver si cede la rigidez antes de repetir.', porque: 'La pauta repite el bolo cada pocos minutos hasta que ceden los síntomas o se llegue a 10 mg/kg (p. 48). Una dosis aislada deja abierto el canal de calcio mientras sube el calor.' },
      { t: '1-2 mg/kg (75-150 mg) en bolo rápido, repetido hasta que ceda o se llegue a 10 mg/kg, y luego 1-2 mg/kg cada 6 h al menos 24 h.', ok: true },
      { t: '10 mg/kg (750 mg) de una vez, para llegar al máximo sin perder tiempo.', porque: 'Los 10 mg/kg son el tope acumulado, no la dosis inicial (p. 48). Darle más dantroleno del que hace falta suma debilidad muscular de 2-4 días (p. 49).' },
      { t: 'Hielo y fluidos fríos: el dantroleno solo si la temperatura pasa de 40 °C.', porque: 'La temperatura sube tarde (p. 49) y el hielo no cierra el canal de calcio: lo que baja la temperatura es controlar la rigidez (p. 49). Sin dantroleno temprano, la mortalidad es ≥70 % (p. 49).' }],
    explicacion: 'Dantroleno 1-2 mg/kg en bolo rápido IV, repetido hasta que ceda o se llegue a 10 mg/kg; después 1-2 mg/kg cada 6 h al menos 24 h, para prevenir la recaída (Tabla 43.2, p. 48). Temprano baja la mortalidad de ≥70 % a ≤10 % (p. 49).', fuente: ['48|ma-hm-tto', '49|ma-hm-clinica'] },
  { grupo: 'examen', num: 'E2', sinModelo: true,
    enunciado: 'Jacinta, día 8 de una neumonía, con linezolid y fentanilo: clonus ocular, hiperreflexia y 38,0 °C. <b>¿Qué rasgo orienta al síndrome serotoninérgico y no al neuroléptico maligno?</b>',
    opciones: [
      { t: 'La rigidez muscular: solo la tiene el neuroléptico maligno.', porque: 'Los dos tienen rigidez (p. 53), y en el serotoninérgico grave incluso puede tapar los signos que sí los distinguen. Con este criterio, Jacinta seguiría con el linezolid.' },
      { t: 'La hiperreflexia y el clonus, sobre todo el ocular.', ok: true },
      { t: 'La fiebre: solo se ve en el serotoninérgico.', porque: 'Los dos aumentan la temperatura (p. 53), y en el serotoninérgico solo aparece en el 60 % (p. 52): no separa nada y una T normal no lo descarta.' },
      { t: 'La CK mayor de 1.000 U/L, que no se ve en el neuroléptico.', porque: 'Es una cifra del neuroléptico maligno (p. 50). Usarla para separarlos te llevaría a llamar neuroléptico a lo serotoninérgico y a no retirar el linezolid.' }],
    explicacion: 'Los rasgos distintivos del síndrome serotoninérgico son la hiperreflexia y el clonus; la rigidez intensa puede enmascararlos (p. 53). El clonus ocular es el signo más fiable (p. 52).', fuente: ['52|ma-ss-claves', '53|ma-ss-snm'] },
  { grupo: 'examen', num: 'E3', tipo: 'error', estado: est('hipo', 3),
    enunciado: 'Plan de Honorato, hipotérmico a 27,4 °C. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
    frases: [
      { t: 'Medir la temperatura con una sonda vesical, esofágica o rectal.', mal: false, c: '' },
      { t: 'Los fluidos a temperatura ambiente (21 °C) son seguros para reponer el volumen mientras se recalienta.', mal: true, c: 'Los fluidos a 21 °C enfrían más al paciente; se infunden calientes, y aun así solo evitan enfriar más (p. 56).' },
      { t: 'Con los gases inspirados a 40-45 °C, la temperatura sube unos 2,5 °C por hora.', mal: false, c: '' },
      { t: 'En parada por hipotermia no se declara la muerte hasta haberlo recalentado.', mal: false, c: '' }],
    explicacion: 'Un error: los fluidos a 21 °C enfrían (p. 56). La temperatura central se mide con sonda (p. 55), los gases calientes suben unos 2,5 °C/h (p. 56) y la muerte no se declara sin recalentar (p. 55).', fuente: ['55|ma-hipo-grados', '56|ma-hipo-externo'] },
  { grupo: 'examen', num: 'E4', sinModelo: true,
    enunciado: 'Un paciente de 70 kg con fiebre y lesión cerebral isquémica tras una parada: aquí sí se baja. Eliges ibuprofeno IV. <b>¿Qué dosis da el libro?</b>',
    opciones: [
      { t: '800 mg fijos cada 4 h, sin ajustar al peso.', porque: 'La dosis es de 10 mg/kg, hasta 800 mg cada 6 h (p. 72). Cada 4 h sumaría más dosis al día de las que describe la fuente.' },
      { t: '10 mg/kg (700 mg), hasta 800 mg cada 6 h; el libro no fija un máximo diario.', ok: true },
      { t: 'Ninguna: los AINE están contraindicados en el paciente crítico por el riñón.', porque: 'El libro dice que su uso en la UCI es limitado por un miedo exagerado a la toxicidad renal y a la hemorragia digestiva (p. 72), no que estén contraindicados. Descartarlos te dejaría sin una opción que la fuente describe.' },
      { t: 'Ketorolaco 0,5 mg/kg cada 6 h, la pauta repetida habitual.', porque: 'La fuente describe una sola dosis IV de ketorolaco de 0,5 mg/kg (p. 72). Repetirla cada 6 h es una pauta que el libro no da.' }],
    explicacion: 'Ibuprofeno IV 10 mg/kg, hasta 800 mg cada 6 h (p. 72). El libro no da un máximo diario. Los antipiréticos se usan sobre todo en la lesión cerebral isquémica (p. 71).', fuente: ['72|ma-antip-aine', '71|ma-antipireticos'] },
];
const CORTO = { G1: 'el ajuste sube', G2: 'piel y escalofrío', G3: 'perder calor', G4: 'paracetamol en el golpe', G5: 'enfriar hasta 38', G6: 'SNM: la fiebre tarda', G7: 'hipotermia', G8: 'fiebre en sepsis', G9: 'la manta', E1: 'dantroleno', E2: 'SS frente a SNM', E3: 'plan de Honorato', E4: 'ibuprofeno' };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
const unir = (q) => [...new Set([...(q.fuente || []), ...(q.puntos || []).map(p => p.c).filter(Boolean)])];
function adaptar(q, id, corto) {
  const o = { ...q, id, tipo: q.tipo || 'test', corto: corto || sinHtml(q.enunciado).slice(0, 28), fuente: unir(q) };
  if (q.puntos) o.puntos = q.puntos.map(p => p.t);
  return o;
}
export const PREGUNTAS = PREG_RECORRIDO.map(q => adaptar(q, 'tmv-' + q.num.toLowerCase(), CORTO[q.num]));
// Ahora, a los casos. Cada paso tiene el estado del modelo; la ficha del paciente sale del monitor (ESTADOS), no de números a mano.
const CASO_J = { id: 'tmv-jacinta', titulo: 'La rigidez antes que la fiebre (Jacinta)', sub: 'Del neuroléptico maligno al serotoninérgico', corto: 'Jacinta', abrir: { est: 'snm', paso: 4 }, vuelta: 'ma-snm-clinica',
  pasos: [
  { momento: 'Día 5 · 14:00', estado: est('snm', 2), dato: [['Paciente', 'Jacinta, 47 años; neumonía y agitación, con haloperidol desde hace unos días (dosis del caso)'], ...fila('snm', 2)], tipo: 'test', predice: true,
    enunciado: 'Rigidez generalizada y confusión, <b>¿qué sospechas?</b>',
    opciones: [
      { t: 'Un síndrome neuroléptico maligno que empieza: la rigidez va antes que la fiebre.', ok: true },
      { t: 'No puede ser un SNM sin fiebre; esperas a que suba para decidir.', porque: 'La fiebre se retrasa hasta 8-10 horas tras la rigidez (p. 50). Mientras esperas, el haloperidol sigue y el músculo rígido produce calor.' },
      { t: 'Una distonía por el haloperidol; le pones un anticolinérgico y se resuelve.', porque: 'La distonía se confunde con el SNM al principio, pero se separa con la CK: solo sube un poco, frente a más de 1.000 U/L en el SNM (p. 50). Sin medirla, la tratarías mal.' },
      { t: 'Sepsis: cultivos y antibiótico, sin tocar el haloperidol, que no tiene que ver.', porque: 'Quitar el fármaco causante es lo más importante en el SNM (p. 50). Sin retirarlo, la rigidez y el calor siguen subiendo.' }],
    explicacion: 'Rigidez y confusión son las primeras manifestaciones del SNM, 24-72 h después de empezar el fármaco; la fiebre puede retrasarse (p. 50).', fuente: ['50|ma-snm-clinica'] },
  { momento: 'Día 5 · 23:00', estado: est('snm', 4), dato: fila('snm', 4), tipo: 'test', predice: true,
    enunciado: 'La temperatura sube y la CK pasa de 1.000. <b>¿Qué haces primero?</b>',
    opciones: [
      { t: 'Retirar el haloperidol y empezar fluidos.', ok: true },
      { t: 'Bajar el haloperidol a la mitad y vigilar.', porque: 'La medida más importante es la retirada inmediata del fármaco (p. 50). Con media dosis, el bloqueo dopaminérgico sigue.' },
      { t: 'Paracetamol IV para la fiebre: el calor es el problema.', porque: 'Es hipertermia, no fiebre: el antipirético es ineficaz (p. 45). Jacinta perdería horas con el haloperidol aún puesto.' },
      { t: 'Ciproheptadina oral 12 mg: es el antídoto de esta rigidez.', porque: 'La ciproheptadina es del síndrome serotoninérgico (p. 53). En el SNM se retira el fármaco y puede darse bromocriptina (p. 51).' }],
    explicacion: 'Se retira el fármaco y se hidrata, con profilaxis tromboembólica; la bromocriptina mejora la rigidez en horas (p. 50-51).', fuente: ['50|ma-snm-clinica', '51|ma-snm-tto'],
    tocar: { txt: 'Compruébalo: retira el haloperidol y da el tratamiento', patch: est('snm', 5, 1), cuenta: (a, d) => `la T baja de ${coma(a.T)} a ${coma(d.T)} °C, la FC de ${a.fc} a ${d.fc}, la CK de ${a.ck.toLocaleString('es')} a ${d.ck.toLocaleString('es')} y cede la rigidez.` } },
  { momento: 'Día 8 · linezolid y fentanilo', estado: est('ss', 3), dato: [['Fármacos nuevos', 'linezolid y fentanilo', 1], ...fila('ss', 3)], tipo: 'test',
    enunciado: 'Una semana después, con otra infección, tiene 38,0 °C, hiperreflexia y movimientos horizontales de los ojos. <b>¿Qué es?</b>',
    opciones: [
      { t: 'Una recaída del SNM: la rigidez y la fiebre vuelven.', porque: 'La hiperreflexia y el clonus distinguen el serotoninérgico del SNM (p. 53), y ahora hay dos fármacos que suben la serotonina (p. 52). Tratarla como SNM dejaría puestos el linezolid y el fentanilo.' },
      { t: 'Un síndrome serotoninérgico: el clonus ocular es el signo más fiable.', ok: true },
      { t: 'Una hipertermia maligna por el fentanilo.', porque: 'La hipertermia maligna es por halogenados y succinilcolina (p. 48). El fentanilo no es el desencadenante.' },
      { t: 'No es un síndrome: la fiebre es de la neumonía y los ojos, del fentanilo.', porque: 'El clonus ocular es el signo más fiable del serotoninérgico (p. 52). Ignorarlo dejaría puestos los dos fármacos.' }],
    explicacion: 'Hiperreflexia, mioclonías y clonus (el ocular, el más fiable) con dos fármacos serotoninérgicos: síndrome serotoninérgico (p. 52).', fuente: ['52|ma-ss-claves'] },
  { momento: 'Día 8 · el tratamiento', estado: est('ss', 5), dato: fila('ss', 5), tipo: 'test', predice: true,
    enunciado: 'Retirados los dos fármacos, sigue con clonus. <b>¿Qué más?</b>',
    opciones: [
      { t: 'Ciproheptadina por vía oral (también por sonda): 12 mg y luego 2 mg cada 2 h mientras persistan los síntomas.', ok: true },
      { t: 'Ciproheptadina 12 mg IV, para que actúe más rápido.', porque: 'La ciproheptadina solo existe por vía oral (p. 53). Se puede triturar por sonda nasogástrica.' },
      { t: 'Bromocriptina 10 mg tres veces al día, como en el SNM.', porque: 'La bromocriptina es del SNM (p. 51). En el serotoninérgico va un antagonista de la serotonina (p. 53).' },
      { t: 'Rocuronio de entrada, por la rigidez.', porque: 'La parálisis es para la rigidez y la rabdomiólisis que no mejoran con las medidas convencionales (p. 53), no para empezar.' }],
    explicacion: 'Se retira lo que lo causa y se da ciproheptadina solo oral: 12 mg y 2 mg cada 2 h; mantenimiento de 8 mg cada 6 h (p. 53).', fuente: ['53|ma-ss-tto'],
    tocar: { txt: 'Compruébalo: retira y da ciproheptadina', patch: est('ss', 5, 1), cuenta: (a, d) => `la T baja de ${coma(a.T)} a ${coma(d.T)} °C, la FC de ${a.fc} a ${d.fc} y desaparece el clonus.` } }],
  lleva: ['La rigidez va antes que la fiebre en el SNM; la fiebre puede tardar 8-10 horas (p. 50).', 'En el SNM, retirar el fármaco; en el SS, retirar y ciproheptadina solo oral (p. 51, 53).', 'Hiperreflexia y clonus ocular distinguen el SS (p. 52-53).'] };
const CASO_H = { id: 'tmv-honorato', titulo: 'Nadie está muerto hasta estar caliente (Honorato)', sub: 'Hipotermia ambiental', corto: 'Honorato', abrir: { est: 'hipo', paso: 3 }, vuelta: 'ma-hipo-grados',
  pasos: [
  { momento: 'Urgencias · 03:00', estado: est('hipo', 2), dato: [['Paciente', 'Honorato, 72 años; hallado en la calle'], ...fila('hipo', 2)], tipo: 'test',
    enunciado: 'Quieres medir su temperatura. <b>¿Con qué la mides?</b>',
    opciones: [
      { t: 'Con un termómetro axilar: es rápido y no invade.', porque: 'La piel está más fría que el interior en el frío (p. 55): la axila subestima. Podrías clasificar mal su gravedad.' },
      { t: 'Con un termómetro del oído: está cerca del cerebro y vale.', porque: 'Los termómetros de oído, de arteria temporal, orales y axilares no son apropiados en el hipotérmico (p. 55).' },
      { t: 'Con una sonda central: vesical, esofágica o rectal.', ok: true },
      { t: 'Con el termómetro de la frente, que marca el valor medio de la piel.', porque: 'La frente es piel, y la piel está más fría que el interior (p. 55). Honorato parecería menos grave de lo que es.' }],
    explicacion: 'En la hipotermia se mide la temperatura central, con sondas vesical, esofágica o rectal; las periféricas no son apropiadas (p. 55).', fuente: ['55|ma-hipo-grados'] },
  { momento: 'Una hora después', estado: est('hipo', 3), dato: fila('hipo', 3), tipo: 'test', predice: true,
    enunciado: 'Coma, pupilas fijas y sin escalofrío. <b>¿Qué gravedad es y qué temes?</b>',
    opciones: [
      { t: 'Leve: confusión y escalofrío, riesgo de fiebre al recalentar.', porque: 'La leve (32-35 °C) tiene escalofrío brusco y taquicardia (p. 54). Honorato está sin escalofrío y bradicárdico.' },
      { t: 'Moderada: letargo y escalofrío reducido; lo que temes es la hipotensión.', porque: 'La moderada es de 28-31,9 °C (p. 54). Con coma y pupilas fijas, subestimarla retrasa el recalentamiento.' },
      { t: 'Grave (<28 °C): riesgo de fibrilación ventricular y asistolia.', ok: true },
      { t: 'Fatal (<24 °C): ya no se puede hacer nada.', porque: 'Incluso la apnea y la asistolia por debajo de 24 °C no permiten declarar la muerte antes de recalentar (p. 54-55).' }],
    explicacion: 'Grave: obnubilación o coma, sin escalofrío, pupilas fijas, hipotensión (Tabla 43.6, p. 54); riesgo de FV y asistolia por debajo de 28 °C (p. 56).', fuente: ['54|ma-hipo-grados', '56|ma-hipo-arritmias'] },
  { momento: 'La parada', estado: est('hipo', 4), dato: fila('hipo', 4), tipo: 'test',
    enunciado: 'Apnea y asistolia con la temperatura por debajo de 24 °C. <b>¿Declaras la muerte?</b>',
    opciones: [
      { t: 'Sí: la apnea y la asistolia a esa temperatura lo confirman.', porque: 'Son esperables por debajo de 24 °C, no confirman la muerte (p. 54-55). Declararla sería dejar morir a alguien recuperable.' },
      { t: 'No: no se declara la muerte sin recalentar al paciente.', ok: true },
      { t: 'Antes le pones atropina para la bradicardia, y si no responde, declaras.', porque: 'La bradicardia por debajo de 32 °C no responde a la atropina (p. 56), y la muerte no se declara sin recalentar (p. 55).' },
      { t: 'Sí, si las pupilas están dilatadas y fijas.', porque: 'Las pupilas fijas y dilatadas son un hallazgo de la hipotermia grave (p. 54), no un criterio de muerte (p. 55).' }],
    explicacion: 'El cuerpo debe recalentarse a una temperatura normal antes de declarar la muerte (p. 55).', fuente: ['54|ma-hipo-grados', '55|ma-hipo-grados'] },
  { momento: 'Recalentar', estado: est('hipo', 5), dato: fila('hipo', 5), tipo: 'test', predice: true,
    enunciado: 'Honorato sigue en parada. <b>¿Cómo lo recalientas?</b>',
    opciones: [
      { t: 'ECMO venoarterial, con calor externo y fluidos calientes.', ok: true },
      { t: 'Lavado gástrico con líquido caliente.', porque: 'Es un método no recomendado por el riesgo de aspiración (p. 56).' },
      { t: 'Un bolo de suero a temperatura ambiente (21 °C) para reponer el volumen.', porque: 'Los fluidos a 21 °C enfrían más al paciente (p. 56): deben ir calientes, y aun así solo evitan enfriar.' },
      { t: 'Lavado vesical caliente: es el método interno más fiable.', porque: 'El lavado vesical caliente es ineficaz (p. 56).' }],
    explicacion: 'En la parada hipotérmica se ha usado con éxito la ECMO venoarterial (p. 56); los fluidos calientes evitan que se enfríe más, y los gases a 40-45 °C suben la temperatura unos 2,5 °C/h (p. 56).', fuente: ['56|ma-hipo-externo'],
    tocar: { txt: 'Compruébalo: recalienta a Honorato', patch: est('hipo', 5, 1), cuenta: (a, d) => `la T sube de ${coma(a.T)} a ${coma(d.T)} °C, la FC de ${a.fc} a ${d.fc} y la PA es ${d.pa}.` } }],
  lleva: ['La temperatura central se mide con sonda, nunca en la piel (p. 55).', 'Por debajo de 28 °C: riesgo de FV; por debajo de 24 °C, apnea y asistolia esperables (p. 54, 56).', 'La muerte no se declara sin recalentar; ECMO venoarterial en la parada (p. 55-56).'] };
const dic = pares => Object.fromEntries(pares.map(([k, v]) => [k, v]));
export const CASOS = [CASO_J, CASO_H].map(C => {
  const [p1] = C.pasos;
  return {
    id: C.id, titulo: C.titulo, sub: C.sub, corto: C.corto, abrir: C.abrir,
    paciente: dic(p1.dato.map(([k, v]) => [k, v])),
    pasos: C.pasos.map((s, i) => ({
      momento: s.momento, estado: s.estado, datos: i ? dic(s.dato.map(([k, v]) => [k, v])) : {}, nuevo: s.dato.filter(x => x[2]).map(x => x[0]),
      pregunta: adaptar({ ...s, grupo: undefined, dato: undefined }, `${C.id}-${i + 1}`, `paso ${i + 1}`),
    })),
    lleva: C.lleva, volver: { nombre: 'Termostato y trastornos (Marino, cap. 43)', ancla: C.vuelta },
  };
});
