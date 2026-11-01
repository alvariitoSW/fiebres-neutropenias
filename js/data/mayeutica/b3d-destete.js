// Mayéutica del bloque 3D, G5: fichas 20 neumo-sbt (aquí) y 21 neumo-weaning-extubacion (en b3d-destete-2.js). Marino cap. 30,
// págs. 50-61 del PDF caps27-30. Formato: cabecera de b1-fluidos.js. Caso de Benito (71 a, 78 kg, 1,72 m, PBW 68, FEVI 35 %,
// día 7 de ventilación por neumonía). Las cifras de los estados del pulmón vivo (sbt-ok: Vt 300, FR 20; sbt-fracaso: Vt 173, FR 34;
// sbt-ansiedad: Vt 450, FR 30, con el opiáceo FR 22 y Vt 400) son las del monitor de la app (js/data/pulmon-vivo-data.js), rotuladas
// ilustrativo; las demás cifras de Benito son del caso (ilustrativo).
import { MAYEUTICA_DESTETE_2 } from './b3d-destete-2.js';

const PDF = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const SB = 'neumo-sbt';
const pv = (estado, texto) => ({ pulmonVivo: estado, texto });
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const ILU = 'ilustrativo: las cifras de Benito son del caso; la regla, de la ficha';

const DATOS = {
  [SB]: {
    entrada: 'Dejar que el paciente dispare protege el diafragma; la prueba se hace cuando cumple la lista, se juzga por Vt, FR y su cociente, y respirar rápido solo es fracaso si el Vt baja.',
    guia: [
      { id: 'sbt-g1', corto: 'uno de cada tres', tipo: 'test', fuente: 'nep-sbt-uno-de-tres',
        enunciado: 'Retirar la ventilación mecánica suele ser rápido. Antes de seguir: ¿a qué proporción de pacientes le cuesta la transición a respirar sin ayuda?',
        opciones: [
          no('A uno de cada diez, por un problema pulmonar de base', `La fuente habla de uno de cada tres, y atribuye las dificultades a varias causas, no solo al pulmón (${p(50)}).`),
          ok('A cerca de uno de cada tres; el resto pasa sin incidentes'),
          no('A más de la mitad, porque la ventilación mecánica prolongada debilita el diafragma de forma inevitable', `La mayoría pasa sin incidentes; son cerca de uno de cada tres los que tienen dificultades (${p(50)}).`)],
        explicacion: `La retirada «suele ser un proceso rápido y sin incidentes, pero <span class="hl-purpura">cerca de uno de cada tres</span> pacientes tiene dificultades» (${p(50)}).` + enFicha(SB, 'nep-sbt-uno-de-tres') },
      { id: 'sbt-g2', corto: 'dejar disparar', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-sbt-disparadas',
        enunciado: 'Mientras ventilas a un paciente, ¿por qué conviene dejarle disparar las respiraciones del ventilador?',
        puntos: [
          `En el estudio animal, la ventilación <span class="hl-rojo">controlada durante 3 días</span> redujo cerca de un 50 % la fuerza de las contracciones del diafragma (${p(50)}).`,
          `La ventilación asistida, donde cada respiración la inicia el esfuerzo del paciente, queda <span class="hl-verde">casi como la respiración espontánea</span>: por eso se evitan la parálisis y la sedación profunda (${p(50)}-${p(51)}).`],
        explicacion: `El diafragma se contrae mientras exista impulso central; si el ventilador lo hace todo, se debilita (Figura 30.1, ${p(51)}). Permitir disparar «debería facilitar la transición» (${p(50)}).` + enFicha(SB, 'nep-sbt-disparadas') },
      { id: 'sbt-g3', corto: 'fisioterapia', tipo: 'test', fuente: 'nep-sbt-fisio',
        enunciado: 'El paciente lleva días en cama con el respirador y está estable. ¿Qué dice la fuente sobre la fisioterapia?',
        opciones: [
          no('Se reserva para quien ya está extubado, porque con el tubo no se puede movilizar y conviene esperar a la extubación para empezar', `La fuente la recomienda en los dependientes del ventilador que estén estables (sentarse, ponerse de pie, caminar), sin esperar a la extubación (${p(51)}).`),
          no('Solo ayuda a los que tienen debilidad por una enfermedad neuromuscular previa', `El desacondicionamiento por reposo prolongado es el factor que se trata, en el dependiente del ventilador estable (${p(51)}).`),
          ok('Un programa progresivo facilita el destete; se recomienda protocolizado en el paciente estable')],
        explicacion: `El reposo prolongado causa desacondicionamiento y debilidad; un programa progresivo (sentarse al borde de la cama, ponerse de pie, deambular) <span class="hl-verde">facilita el destete</span> y se recomienda protocolizado en los estables (${p(51)}).` + enFicha(SB, 'nep-sbt-fisio') },
      { id: 'sbt-g4', corto: 'sedación', tipo: 'test', fuente: 'nep-sbt-sedacion',
        enunciado: 'Las guías sobre sedación del paciente dependiente del ventilador, ¿qué recomiendan para no retrasar la retirada?',
        opciones: [
          ok('Sedación ligera, vacaciones diarias de sedación y evitar o reducir las benzodiacepinas'),
          no('Sedación profunda al principio y benzodiacepinas en infusión para proteger al paciente de la ansiedad', `La sedación profunda (paciente no despertable) y el midazolam sostenido retrasan el despertar y, con él, la liberación del ventilador (${p(51)}).`),
          no('Sedación ligera, pero con midazolam continuo, que es más fácil de titular', `Las benzodiacepinas, en especial el midazolam, son justo lo que la guía pide evitar o minimizar (${p(51)}).`)],
        explicacion: `Mantener un nivel <span class="hl-verde">ligero</span>, considerar <span class="hl-verde">vacaciones de sedación</span> diarias para que no se acumule el fármaco y <span class="hl-rojo">evitar o minimizar las benzodiacepinas</span> (${p(51)}).` + enFicha(SB, 'nep-sbt-sedacion') },
      { id: 'sbt-g5', corto: 'qué falla para la prueba', tipo: 'test', fuente: 'nep-sbt-disposicion · nep-sbt-tabla', origen: 'ficha; los datos del paciente, inventados',
        enunciado: 'Un ventilado con SpO₂ 95 % con FiO₂ 0,6 y PEEP 6, estable, despierto y con PaCO₂ basal. ¿Está listo para una prueba de respiración espontánea?',
        opciones: [
          no('Sí: la SpO₂ pasa de 90 %, la PEEP es baja y cumple los demás criterios, así que la FiO₂ no importa', `La SpO₂ ≥90 % se exige respirando concentraciones no tóxicas de O₂, FiO₂ ≤50 % (${p(52)}); con 0,6 no cumple y la prueba podría empezar con una oxigenación aún dependiente del respirador.`),
          ok('No todavía: la FiO₂ de 0,6 supera el 50 % que se admite para empezar; los otros criterios sí se cumplen'),
          no('No: la PEEP de 6 cmH₂O es demasiado alta, porque para la prueba se necesita PEEP cero', `El criterio es PEEP ≤8 cmH₂O, no cero (${p(52)}); con PEEP 6 el criterio se cumple, y esperarías sin motivo mientras el paciente sigue ventilado.`)],
        explicacion: `La oxigenación exige <span class="hl-azul">SpO₂ ≥90 % con FiO₂ ≤50 %</span> y PEEP ≤8 cmH₂O (${p(52)}): aquí falla la FiO₂, aunque los otros criterios se cumplan. Los cinco están en la Tabla 30.1; la calculadora de la ficha los pasa uno a uno.` + enFicha(SB, 'nep-sbt-tabla') },
      { id: 'sbt-g6', corto: 'cuánto valen los predictores', tipo: 'test', fuente: 'nep-sbt-predictores', modelo: pv('sbt-ok', '🫁 Ceferino supera la prueba: Vt 300, FR 20'),
        enunciado: 'Durante la prueba mides Vt, FR y la presión inspiratoria máxima. ¿Cómo se leen según la fuente?',
        opciones: [
          no('Cada uno decide por sí solo: si falla uno, la prueba se da por fracasada', `Cada parámetro puede ser un predictor pobre en un paciente concreto; hay que mirarlos en conjunto (${p(52)}).`),
          ok('Juntos dan una buena idea de la evolución, y los cambios seriados valen más que una medida al inicio'),
          no('Solo valen las mediciones del primer minuto, porque después el paciente se adapta y los valores dejan de reflejar el esfuerzo', `Los cambios seriados tienen más valor predictivo que las mediciones puntuales del inicio (${p(52)}).`)],
        explicacion: `«Cada uno puede ser un <span class="hl-azul">predictor pobre</span> en un paciente individual, pero tomados en conjunto darán una buena idea»; los cambios seriados pesan más que una medida puntual (${p(52)}). Vt 4-6 mL/kg PBW, FR <40 y PImax «>−20» (Tabla 30.1).`,
        nota: `<b>Nota de fidelidad:</b> la tabla escribe «Max Insp Pressure &gt; −20 cmH₂O» y el texto (${p(58)}) dice que la ventilación en reposo se ve amenazada cuando la PImax «cae a −20 o −30». La calculadora usa «≤ −20» como interpretación de la app.` + enFicha(SB, 'nep-sbt-predictores') },
      { id: 'sbt-g7', corto: 'dos métodos', tipo: 'error', fuente: 'nep-sbt-metodos · nep-sbt-fig-30-2',
        enunciado: 'Un residente resume en una nota los métodos de la prueba. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'La prueba puede hacerse conectado al ventilador o con un circuito en T.' },
          { t: 'Con presión de soporte de 5 cmH₂O se reduce el trabajo respiratorio a la mitad.', mal: true, c: `La presión de soporte de 5 no reduce de forma significativa el trabajo respiratorio: unos 50 J/L sin ella y unos 40 con ella (${p(52)}-${p(53)}).` },
          { t: 'En el circuito en T se monitoriza el Vt y la FR igual que con el ventilador.', mal: true, c: `La desventaja principal del circuito en T es no poder monitorizar la frecuencia ni el Vt (${p(53)}).` },
          { t: 'Con el ventilador, la presión de soporte baja compensa la resistencia del circuito.' }],
        explicacion: 'Dos errores: atribuir a la presión de soporte un alivio que no logra y creer que el tubo en T deja medir el Vt.',
        nota: `La presión de soporte de 5 se usa «para contrarrestar la resistencia a respirar a través del circuito» (${p(52)}).` + enFicha(SB, 'nep-sbt-circuito') },
      { id: 'sbt-g8', corto: 'el tubo en T', tipo: 'test', fuente: 'nep-sbt-tpiece · nep-sbt-preferido',
        enunciado: 'Quieres hacer la prueba desconectando al paciente con un tubo en T. ¿Cómo funciona y qué se sabe de su valor frente al otro método?',
        opciones: [
          no('Da O₂ a un flujo bajo para no secar la vía aérea y, según los estudios, logra mejores resultados que el soporte con el ventilador', `El flujo ha de ser alto, mayor que el inspiratorio del paciente, para evitar la reinhalación de CO₂; y ningún método ha demostrado ventaja (${p(53)}).`),
          ok('Da O₂ a un flujo mayor que el inspiratorio del paciente; ningún método de prueba ha demostrado ventaja clínica'),
          no('Da O₂ a flujo alto y es el método demostrado para demandas ventilatorias altas, aunque no deja medir la FR', `Que sirva mejor a quien tiene demandas altas «no está demostrado»; el método popular es dejarlo conectado por ser más fácil de preparar (${p(53)}).`)],
        explicacion: `Flujo de O₂ de pared <span class="hl-azul">mayor que el inspiratorio</span>, que además arrastra el CO₂ exhalado. Puede convenir a demandas altas «aunque esto no está demostrado»; <span class="hl-purpura">no importa cómo se haga</span> (${p(53)}).` + enFicha(SB, 'nep-sbt-tpiece') },
      { id: 'sbt-g9', corto: 'juzgar la prueba', tipo: 'test', fuente: 'nep-sbt-exito',
        enunciado: 'Durante la prueba, ¿en qué se apoya el juicio de éxito o fracaso?',
        opciones: [
          no('Solo en la saturación y en la gasometría final, que son objetivas', `La fuente suma los signos de distrés, la debilidad muscular (abdomen que se mueve hacia dentro), el intercambio gaseoso y la perfusión sistémica con la saturación venosa central (${p(54)}).`),
          ok('En signos de distrés, de debilidad, intercambio gaseoso y perfusión sistémica (ScvO₂)'),
          no('En el cociente FR/Vt de los primeros 5 minutos y en la presión inspiratoria máxima, y si ambos son normales, se extuba', `Esos son predictores de la Tabla 30.1, no el juicio completo de la prueba; el éxito se juzga por signos clínicos, gases y perfusión (${p(54)}).`)],
        explicacion: `Distrés (agitación, diaforesis, respiración rápida, músculos accesorios); debilidad (movimiento paradójico hacia dentro del abdomen al inspirar); gases (SpO₂, PaO₂/FiO₂, PaCO₂); perfusión (<span class="hl-azul">ScvO₂</span>) (${p(54)}).` + enFicha(SB, 'nep-sbt-exito') },
      { id: 'sbt-g10', corto: '¿ansiedad o fracaso?', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-sbt-rapida', origen: 'ficha; las cifras de Benito en el modelo, ilustrativas', modelo: pv('sbt-ansiedad', '🫁 Benito respira a 30 con volumen: mira el Vt'),
        enunciado: 'Un paciente en la prueba respira a 34 por minuto. ¿Cómo distingues ansiedad de fracaso, y qué no te lo aclara?',
        puntos: [
          `Si el <span class="hl-azul">Vt sube</span> junto con la FR (hiperventilación), apunta a ansiedad (${p(54)}).`,
          `Si el <span class="hl-rojo">Vt baja</span> mientras la FR sube (rápida y superficial), apunta a fracaso ventilatorio (${p(54)}).`,
          `El empeoramiento de los <span class="hl-purpura">gases</span> puede no distinguir entre las dos (${p(54)}).`],
        explicacion: `La prueba suele hacerse conectado al ventilador (el tubo en T también vale; ningún método es mejor, ${p(52)}-${p(53)}): así se ve el volumen y la frecuencia (${p(52)}). Benito en el modelo respira a 30 con un Vt de unos 450 mL: rápido y profundo (cifras del modelo, ilustrativo).` + enFicha(SB, 'nep-sbt-rapida') },
      { id: 'sbt-g11', corto: 'por qué importa respirar rápido', tipo: 'test', fuente: 'nep-sbt-dano',
        enunciado: 'Un paciente con EPOC grave respira rápido durante la prueba. Sea ansiedad o fracaso, ¿qué daño puede hacer esa frecuencia?',
        opciones: [
          no('Ninguno mientras la SpO₂ se mantenga: la frecuencia por sí sola no lo empeora', `La respiración rápida es perjudicial aunque la saturación aguante: en asma y EPOC promueve hiperinflación y PEEP intrínseca (${p(55)}).`),
          no('Mejora la ventilación de las zonas enfermas del SDRA porque acorta su constante de tiempo, aunque aumenta el espacio muerto en el EPOC', `Es al revés: en las zonas enfermas, con constantes de tiempo prolongadas, la rapidez reduce su ventilación y favorece el colapso alveolar y la hipoxemia (${p(55)}).`),
          ok('Hiperinflación y PEEP intrínseca: menos gasto, más espacio muerto, menos compliance y diafragma aplanado')],
        explicacion: `En asma y EPOC: <span class="hl-rojo">hiperinflación y PEEP intrínseca</span> (baja el gasto, sube el espacio muerto, baja la compliance y se aplana el diafragma). En el SDRA: colapso e hipoxemia. En todos: más consumo de O₂ (${p(55)}).` + enFicha(SB, 'nep-sbt-dano') },
      { id: 'sbt-g12', corto: 'qué hacer', tipo: 'test', fuente: 'nep-sbt-manejo', origen: 'ficha; las cifras de Benito en el modelo, ilustrativas', modelo: pv('sbt-ansiedad', '🫁 Benito: pulsa «Opiáceo» y mira el Vt'),
        enunciado: 'Según el Vt, ya has decidido si es ansiedad o fracaso. ¿Qué haces en cada caso?',
        opciones: [
          no('Fracaso: sedas y sigues la prueba; ansiedad: vuelves al ventilador para que descanse', `Está invertido: si se sospecha fracaso ventilatorio, el paciente vuelve al ventilador; si es ansiedad, se plantea un sedante (${p(55)}).`),
          ok('Fracaso: vuelve al ventilador. Ansiedad: un sedante, mejor un opiáceo (calma la disnea)'),
          no('En ambos casos un bolo de midazolam, que calma la ansiedad y la sensación de falta de aire', `El midazolam retrasa el despertar y la retirada; para la disnea la fuente prefiere los opiáceos (${p(51)}, ${p(55)}).`)],
        explicacion: `<span class="hl-rojo">Fracaso ventilatorio → de vuelta al ventilador</span>; <span class="hl-azul">ansiedad → sedante</span>, mejor un opiáceo, que calma la disnea (${p(55)}). En el modelo, con el opiáceo Benito baja a FR 22 y el Vt no cae (ilustrativo).` + enFicha(SB, 'nep-sbt-manejo') },
    ],
    examen: [
      { id: 'sbt-e1', corto: 'FR/Vt', tipo: 'test', fuente: 'nep-sbt-tabla', origen: 'ficha: Tabla 30.1; las cifras del paciente, ilustrativas',
        enunciado: 'En la prueba, un paciente respira a 28 por minuto con un Vt de 340 mL (cociente de 82 rpm/L). Frente a la Tabla 30.1, ¿cómo lees el cociente?',
        opciones: [
          no('Fuera del intervalo, porque el cociente debe ser menor de 60', `El intervalo de la tabla es 60-105; un valor de 82 cae dentro (${p(52)}).`),
          ok('Dentro del intervalo de 60-105: cumple ese predictor'),
          no('Por encima del intervalo: pasa de 105 y anuncia fracaso de la prueba', `82 queda por debajo de 105; el cociente que anuncia fracaso es el que supera ese techo (${p(52)}).`)],
        explicacion: `Cociente RR/Vt = 28 ÷ 0,34 ≈ 82 rpm/L: <span class="hl-azul">entre 60 y 105</span>, el predictor de la Tabla 30.1 (${p(52)}).` + enFicha(SB, 'nep-sbt-tabla') },
      { id: 'sbt-e2', corto: 'trabajo respiratorio', tipo: 'test', fuente: 'nep-sbt-fig-30-2', origen: 'ficha: Figura 30.2 (valores aproximados leídos en la figura)',
        enunciado: 'En el estudio de la Figura 30.2, ¿qué pasó con el trabajo respiratorio al comparar la prueba con y sin presión de soporte de 5, y una hora después de extubar?',
        opciones: [
          no('Bajó de unos 50 a unos 40 J/L con la presión de soporte, y siguió bajando tras extubar', `La bajada de 50 a 40 no fue significativa, y tras extubar el trabajo subió de forma marcada (${p(53)}).`),
          no('Fue igual con y sin presión de soporte, y también igual una hora después de extubar', `Tras extubar subió de forma marcada, hasta unos 90 J/L (p<0,05) (${p(53)}).`),
          ok('Unos 50 J/L sin soporte y 40 con él, sin diferencia; unos 90 al extubar')],
        explicacion: `~50 y ~40 J/L (<span class="hl-rojo">no significativo</span>) y ~90 J/L tras extubar (p<0,05): el trabajo real tras la extubación fue mucho mayor que durante la prueba (${p(53)}).` + enFicha(SB, 'nep-sbt-fig-30-2') },
      { id: 'sbt-e3', corto: 'dos horas', tipo: 'test', fuente: 'nep-sbt-tiempo',
        enunciado: 'Una prueba de respiración espontánea de 2 horas sale bien. ¿Qué se espera de ese paciente?',
        opciones: [
          no('Que solo la mitad pueda quitarse el ventilador, y por eso se repite la prueba otras 2 h', `Se espera que la mayoría, cerca del 80 %, se retire de forma permanente; el tiempo asignado va de menos de 30 minutos a más de 2 horas (${p(54)}).`),
          ok('Que cerca del 80 % de los que la toleran se retire del ventilador de forma definitiva'),
          no('Que la mayoría fracase después, porque 30 minutos es el tiempo que predice la retirada', `Con 2 horas de tolerancia, la mayoría (~80 %) se retira; los 30 minutos son el límite inferior del tiempo asignado (${p(54)}).`)],
        explicacion: `El tiempo de la prueba varía de <span class="hl-azul">menos de 30 minutos a más de 2 horas</span> según la clínica; «la mayoría (~80 %) de los que toleran 2 horas pueden retirarse de forma permanente» (${p(54)}).` + enFicha(SB, 'nep-sbt-tiempo') },
      { id: 'sbt-e4', corto: 'opiáceos en el EPOC', tipo: 'test', fuente: 'nep-sbt-manejo', origen: 'ficha',
        enunciado: 'Un paciente con EPOC grave tiene disnea intensa durante la prueba y sospechas ansiedad. ¿Qué dice la fuente del opiáceo?',
        opciones: [
          no('Está contraindicado en el EPOC por el riesgo de frenar la respiración, así que se prefieren las benzodiacepinas', `La fuente dice lo contrario: se han usado con seguridad para aliviar la disnea en el EPOC grave, y las benzodiacepinas retrasan la retirada (${p(51)}, ${p(55)}).`),
          ok('Se ha usado con seguridad para el alivio de la disnea en el EPOC grave, pese al miedo a hacerlo'),
          no('Se acepta solo si el paciente ya está reintubado, porque antes de eso no se ha estudiado en el EPOC', `La fuente cita su uso seguro en el EPOC grave durante el destete; no lo limita a pacientes reintubados (${p(55)}).`)],
        explicacion: `«Pese al miedo al uso de opiáceos en pacientes con EPOC, se han usado con seguridad para el alivio de la disnea en el <span class="hl-azul">EPOC grave</span>» (${p(55)}).` + enFicha(SB, 'nep-sbt-manejo') },
    ],
    casos: [
      { id: 'caso-sbt-benito', titulo: 'Benito, día 7: la prueba de respiración espontánea', corto: 'Benito, día 7', sub: 'Disposición, ansiedad o fracaso, y qué mirar.',
        paciente: { Paciente: 'Benito, 71 años, 78 kg, 1,72 m (PBW 68 kg)', Antecedente: 'FEVI 35 %', Ingreso: 'Neumonía; día 7 de ventilación' },
        lleva: [
          'La prueba se hace cuando cumple los cinco de disposición, y el paciente dispara su respiración para no debilitar el diafragma.' + enFicha(SB, 'nep-sbt-disposicion'),
          'Un cociente FR/Vt dentro de 60-105 acompaña al éxito, pero la frecuencia sola no dice nada: decide el volumen.' + enFicha(SB, 'nep-sbt-tabla'),
          'Si el Vt sube con la FR es ansiedad (opiáceo); si baja es fracaso (de vuelta al ventilador).' + enFicha(SB, 'nep-sbt-rapida')],
        volver: { nombre: 'La respiración rápida', ancla: 'nep-sbt-rapida', modelo: pv('sbt-ansiedad', '🫁 Benito en la prueba: ansiedad') },
        pasos: [
          { momento: 'Día 7 · por la mañana', datos: { 'FiO₂': '0,4', PEEP: '6 cmH₂O', 'SpO₂': '96 %', 'PaCO₂': '42 mmHg', Hemodinámica: 'sin vasopresor desde ayer', Conciencia: 'despierto, obedece órdenes' }, nuevo: ['FiO₂', 'PEEP', 'SpO₂', 'PaCO₂', 'Hemodinámica', 'Conciencia'],
            pregunta: { id: 'sbt-c1', tipo: 'destapa', cuantas: 'son cuatro líneas', fuente: 'nep-sbt-disposicion', origen: ILU,
              enunciado: 'Benito está con el respirador en modo asistido y dispara todas sus respiraciones. ¿Cumple los cinco criterios de disposición? Compruébalos con sus datos (cuatro líneas: la primera lleva dos).',
              puntos: [
                `<span class="hl-verde">SpO₂ 96 % con FiO₂ 0,4 y PEEP 6</span>: ≥90 % con FiO₂ ≤50 % y PEEP ≤8 cmH₂O (${p(52)}).`,
                `<span class="hl-verde">PaCO₂ 42</span>: normal (${p(52)}).`,
                `<span class="hl-verde">Hemodinámicamente estable</span>: Benito está sin vasopresor, lo más favorable que cabe (dato del caso) (${p(52)}).`,
                `<span class="hl-verde">Despertable y cooperador</span>: despierto y obedece órdenes (dato del caso) (${p(52)}).`],
              nota: `<b>La fuente no define «estable» ni usa escalas como RASS:</b> la Tabla 30.1 solo dice «hemodinámicamente estable» y «despertable y cooperador» (${p(52)}). Por eso Benito está sin vasopresor, sin depender de qué dosis se admitiría.`,
              explicacion: `Cumple los cinco criterios: puede hacer la prueba. La calculadora de la ficha lo comprueba casilla por casilla (${p(52)}).` + enFicha(SB, 'nep-sbt-tabla') },
            calculadora: { ir: 'neumo-sbt-resultado', nombre: 'Checklist de disposición' } },
          { momento: 'Día 7 · prueba, minuto 5', datos: { Modo: 'presión de soporte de 5, conectado', FR: '30 por minuto', 'Vt (del modelo)': '≈450 mL (6,6 mL/kg PBW)', 'FR/Vt': '≈67 rpm/L (con la calculadora)', PImax: '−35 cmH₂O' }, nuevo: ['Modo', 'FR', 'Vt (del modelo)', 'FR/Vt', 'PImax'],
            calculadora: { ir: 'neumo-sbt-vt', nombre: 'Predictores de éxito' },
            pregunta: { id: 'sbt-c2', tipo: 'test', fuente: 'nep-sbt-rapida', origen: ILU, modelo: pv('sbt-ansiedad', '🫁 Benito en la prueba: FR 30 con Vt de 450'),
              enunciado: 'Benito respira a 30, suda un poco y dice que le falta el aire. El Vt es de unos 450 mL. ¿Qué es, ansiedad o fracaso?',
              opciones: [
                no('Fracaso ventilatorio: una FR de 30 ya lo demuestra y hay que volver al ventilador', `La frecuencia sola no distingue: con el Vt aumentado el problema subyacente sugerido es la ansiedad (${p(54)}).`),
                ok('Ansiedad: la FR y el Vt suben a la vez y el cociente, de unos 67, cae dentro de 60-105'),
                no('No se puede saber sin gasometría: el empeoramiento de los gases separa la ansiedad del fracaso', `Los gases pueden no distinguir una de otra; lo que ayuda es mirar el Vt (${p(54)}).`)],
              explicacion: `Vt aumentado = <span class="hl-azul">ansiedad</span>. El 6,6 mL/kg queda algo por encima del rango de 4-6 de la tabla: en la hiperventilación el volumen sube (${p(54)}). Cifras del Vt y del cociente, del modelo (ilustrativo).` + enFicha(SB, 'nep-sbt-rapida') } },
          { momento: 'Día 7 · el plan', datos: { 'Nota del R1': 'cuatro frases' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'sbt-c3', tipo: 'error', fuente: 'nep-sbt-manejo · nep-sbt-rapida', origen: ILU,
              enunciado: 'El residente anota su plan para Benito. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Sigo la prueba y registro FR, Vt y su cociente cada pocos minutos.' },
                { t: 'Vuelvo al ventilador porque la FR es de 30.', mal: true, c: `La frecuencia sola no es fracaso: con el Vt aumentado se sospecha ansiedad, y solo el fracaso ventilatorio manda de vuelta al ventilador (${p(54)}-${p(55)}).` },
                { t: 'Calmo la ansiedad con un bolo de midazolam.', mal: true, c: `Para calmar la disnea se prefieren los opiáceos; el midazolam retrasa el despertar y la retirada (${p(51)}, ${p(55)}).` },
                { t: 'Valoro un opiáceo para la disnea.' }],
              explicacion: 'Dos errores: tomar la FR por fracaso sin mirar el volumen y elegir una benzodiacepina cuando la fuente prefiere el opiáceo.' + enFicha(SB, 'nep-sbt-manejo') } },
          { momento: 'Día 7 · tras el opiáceo', datos: { 'Opiáceo': 'dosis baja, la fuente no da dosis', FR: '22 por minuto', 'Vt (del modelo)': '≈400 mL' }, nuevo: ['Opiáceo', 'FR', 'Vt (del modelo)'],
            pregunta: { id: 'sbt-c4', tipo: 'test', fuente: 'nep-sbt-rapida · nep-sbt-manejo', origen: ILU, modelo: pv('sbt-ansiedad', '🫁 Benito: pulsa «Opiáceo»'),
              enunciado: 'A los 10 minutos Benito respira a 22 y el Vt sigue en unos 400 mL. ¿Qué te dice?',
              opciones: [
                no('Que el opiáceo ha enmascarado un fracaso que reaparecerá, así que se suspende la prueba ya', `La respuesta esperable de la ansiedad es calmarse sin perder volumen; el fracaso se reconoce por un Vt que cae (${p(54)}).`),
                ok('Que era ansiedad: se calmó y el Vt no cayó, así que no hay datos de fracaso ventilatorio'),
                no('Que el soporte de 5 cmH₂O ha mejorado su trabajo respiratorio y por eso respira mejor', `La presión de soporte de 5 no reduce de forma significativa el trabajo respiratorio (${p(53)}).`)],
              explicacion: `Si tras calmar la disnea el volumen se mantiene, el problema era la <span class="hl-azul">ansiedad</span>, no el fracaso ventilatorio (${p(54)}-${p(55)}). FR 22 y Vt ≈400, cifras del modelo (ilustrativo).` + enFicha(SB, 'nep-sbt-rapida') } },
          { momento: 'Día 7 · giro: a los 20 minutos', datos: { FR: '34 por minuto', 'Vt': '173 mL (2,5 mL/kg PBW)', 'FR/Vt': '199 rpm/L', Aspecto: 'sudoración, uso de músculos accesorios' }, nuevo: ['FR', 'Vt', 'FR/Vt', 'Aspecto'],
            pregunta: { id: 'sbt-c5', tipo: 'test', fuente: 'nep-sbt-rapida · nep-sbt-tabla', origen: ILU, modelo: pv('sbt-fracaso', '🫁 Rápido y superficial (con otro paciente): FR 34, Vt 173'),
              enunciado: 'A los 20 minutos Benito respira a 34 con un Vt de 173 mL y suda. ¿Y ahora?',
              opciones: [
                no('Repetir el opiáceo: sigue siendo ansiedad y el volumen bajo se debe al sedante', `El Vt ahora baja mientras la FR sube: eso es rápido y superficial, que sugiere fracaso ventilatorio (${p(54)}).`),
                no('Seguir otros 10 minutos y decidir con la gasometría, porque los gases distinguen ansiedad de fracaso', `Los gases pueden no distinguir una de otra; el Vt ya da la respuesta (${p(54)}).`),
                ok('Fracaso ventilatorio: vuelve al ventilador, porque el Vt baja mientras la FR sube')],
              explicacion: `FR que sube y Vt que baja: <span class="hl-rojo">rápida y superficial</span>, y el cociente de 199 supera el 105 de la tabla (${p(52)}, ${p(54)}). Se vuelve al ventilador (${p(55)}). Cifras del monitor del modelo en el estado de fracaso (ilustrativo).` + enFicha(SB, 'nep-sbt-rapida') } },
          { momento: 'Día 7 · ya en el ventilador', datos: { Situación: 'prueba fracasada a los 20 minutos' }, nuevo: ['Situación'],
            pregunta: { id: 'sbt-c6', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-sbt-exito', origen: ILU,
              enunciado: 'Benito vuelve al ventilador. Para entender por qué fracasó, ¿qué tres cosas miras?',
              puntos: [
                `El <span class="hl-azul">intercambio gaseoso</span>: saturación, PaO₂/FiO₂ y PaCO₂ (${p(54)}).`,
                `La <span class="hl-azul">perfusión sistémica</span>, con la saturación venosa central de O₂ (${p(54)}).`,
                `La <span class="hl-azul">debilidad muscular</span>: movimiento paradójico del abdomen hacia dentro al inspirar (${p(54)}).`],
              explicacion: `Son tres de los cuatro apartados con que se juzga la prueba (el otro es el distrés clínico) (${p(54)}). La ScvO₂ lleva a la ficha siguiente, la del corazón en el destete.` + enFicha(SB, 'nep-sbt-exito') } },
        ] },
    ],
    profundizar: [
      { id: 'nep-sbt-pimax', titulo: 'Nota: la PImax «>−20» de la tabla' },
      { id: 'nep-sbt-fisio', titulo: 'Fisioterapia progresiva en el dependiente del ventilador' },
    ],
  },
};

export const MAYEUTICA_DESTETE = { ...DATOS, ...MAYEUTICA_DESTETE_2 };
