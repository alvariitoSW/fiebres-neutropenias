// Mayéutica del bloque 3D, G5: fichas 14 neumo-vias-artificiales (caso de Rafael, tubo y manguito) y 15 neumo-cuidado-barotrauma
// (en b3d-tubo-2.js). Marino cap. 28, págs. 17-30 del PDF caps27-30. Formato: cabecera de b1-fluidos.js.
// Las cifras del pulmón vivo (fuga-cuff: Vt 410 → 330 con el manguito a 15, fuga 80; 210 con el manguito a 0, fuga 200) se leyeron
// en la app a 390 px con autonomo/bloques/b3/herramientas/m-pulmon-cifras.mjs; las de Rafael en el caso son inventadas (ilustrativo).
import { MAYEUTICA_TUBO_2 } from './b3d-tubo-2.js';

const PDF = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const VA = 'neumo-vias-artificiales';
const pv = (estado, texto) => ({ pulmonVivo: estado, texto });
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const ILU = 'ilustrativo: las cifras de Rafael son del caso; la regla, de la ficha';

const DATOS = {
  [VA]: {
    entrada: 'El tubo se elige por la altura, la punta queda 3-5 cm sobre la carina, el manguito no pasa de 25 y la traqueostomía tiene su momento, su técnica y sus trampas.',
    guia: [
      { id: 'tubo-g1', corto: 'tamaño por altura', tipo: 'test', fuente: 'nep-tamano',
        enunciado: 'Antes de abrir la calculadora: ¿qué tamaño de tubo recomienda la fuente según la altura, y qué se sabe de su efecto en los resultados?',
        opciones: [
          no('Tamaño 7 hasta 150 cm, 7,5 hasta 170 y 8 desde 175; un tubo mayor reduce las complicaciones y se asocia a menos reintubaciones', `Esos cortes no son los del libro (7 hasta 157,5 cm; 8 desde 180,3 cm), y el libro no ve efecto del tamaño en los resultados (${p(17)}).`),
          ok('Tamaño 7 hasta 157,5 cm, 7,5 de 160 a 177,8 y 8 desde 180,3 cm; no hay evidencia de que el tamaño cambie los resultados'),
          no('Tamaño 8 en el adulto, porque el tubo estrecho aumenta la resistencia y la mortalidad', `El libro recomienda tamaños por tramos de altura y niega evidencia de efecto sobre los resultados clínicos (${p(17)}).`)],
        explicacion: `Tamaño por <span class="hl-azul">altura</span>: 7 hasta 5'2", 7,5 de 5'3" a 5'10" y 8 desde 5'11"; «no hay evidencia de que el tamaño del tubo afecte los resultados» (${p(17)}). Las equivalencias en cm son conversiones de la ficha.` + enFicha(VA, 'nep-tamano') },
      { id: 'tubo-g2', corto: 'dónde va la punta', tipo: 'test', fuente: 'nep-posicion',
        enunciado: 'En la radiografía portátil de un paciente intubado, con la cabeza en posición neutra: ¿dónde debe quedar la punta del tubo y cómo localizas la carina si no se ve?',
        opciones: [
          no('Justo sobre la carina, a 1 cm, para ventilar los dos pulmones; la carina está en T8, como se suele hacer para asegurar ventilación bilateral', `La punta cerca de la carina es la que migra al bronquio derecho al moverse el tubo; la carina se localiza en T4-T5 y la punta queda a 3-5 cm (${p(18)}-${p(19)}).`),
          no('A 3-5 cm sobre la carina; si no se ve, la carina está a la altura de T8-T9', `La distancia es correcta, pero la carina está en el espacio T4-T5, no en T8-T9 (${p(18)}).`),
          ok('A 3-5 cm sobre la bifurcación, a medio camino entre ella y las cuerdas; la carina está en el espacio T4-T5')],
        explicacion: `<span class="hl-azul">3 a 5 cm sobre la bifurcación</span>, a mitad entre ella y las cuerdas vocales; si no se ve, está en el espacio <span class="hl-azul">T4-T5</span> (${p(18)}, Figura 28.1).` + enFicha(VA, 'nep-posicion') },
      { id: 'tubo-g3', corto: 'ángulo de Louis', tipo: 'test', fuente: 'nep-insercion',
        enunciado: 'Antes de intubar quieres estimar cuántos centímetros introducir. ¿Qué referencia del tórax usas y cómo mides?',
        opciones: [
          no('El apéndice xifoides, midiendo desde el ángulo de la mandíbula con el cuello flexionado y la cabeza en posición neutra, sin extensión del cuello ni tracción del tubo', `La referencia es la unión manubrioesternal (ángulo de Louis) y la cabeza va en extensión completa, no flexionada (${p(18)}).`),
          no('La unión manubrioesternal, desde los incisivos y con la cabeza en posición neutra', `La medida se toma con la cabeza en extensión completa, no en posición neutra (${p(18)}).`),
          ok('La unión manubrioesternal, que está en el plano de la carina: la distancia desde los incisivos con la cabeza en extensión completa')],
        explicacion: `El <span class="hl-azul">ángulo de Louis</span> (unión manubrioesternal) está en el mismo plano horizontal que la bifurcación traqueal; la distancia desde los incisivos, con la cabeza <span class="hl-azul">en extensión completa</span>, es la longitud a introducir (${p(18)}).` + enFicha(VA, 'nep-insercion') },
      { id: 'tubo-g4', corto: 'migración', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-migracion · nep-fig-28-2',
        enunciado: 'El tubo se mueve al aspirar o girar al paciente y se mete hacia dentro. ¿Adónde va, qué le pasa al pulmón y qué límite reduce el riesgo?',
        puntos: [
          `Va al <span class="hl-azul">bronquio principal derecho</span>, que baja en línea recta desde la tráquea (${p(18)}).`,
          `El pulmón izquierdo deja de ventilarse y se colapsa: <span class="hl-rojo">atelectasia</span> (Figura 28.2, ${p(18)}-${p(19)}).`,
          `Punta a <span class="hl-purpura">≤21 cm de los dientes en la mujer y ≤23 cm en el hombre</span> (${p(19)}).`],
        explicacion: `Los tubos pueden migrar en los dos sentidos; hacia dentro acaban en el bronquio derecho (${p(18)}-${p(19)}).` + enFicha(VA, 'nep-migracion') },
      { id: 'tubo-g5', corto: 'lesión de la laringe', tipo: 'test', fuente: 'nep-laringe',
        enunciado: '¿Con qué frecuencia se lesiona la laringe en el intubado de UCI y qué lesiones aparecen?',
        opciones: [
          no('En menos del 10 %, y solo tras semanas de intubación; la voz no se afecta', `Se ha demostrado en más de la mitad de los intubados más de 12 horas, y se han descrito problemas de voz y disnea a largo plazo (${p(19)}).`),
          ok('En más de la mitad de los intubados más de 12 h: úlceras posteriores y subglóticas, granulomas y edema laríngeo'),
          no('En más de la mitad, pero solo si la intubación fue difícil, con estenosis traqueal como lesión típica', `La dificultad y el tubo grande aumentan el riesgo, pero la lesión aparece en más de la mitad de los intubados más de 12 h; la estenosis traqueal es de la traqueostomía (${p(19)}, ${p(21)}).`)],
        explicacion: `<span class="hl-rojo">Más de la mitad</span> de los intubados más de 12 horas; más frecuente con intubación difícil, tubo grande y duración prolongada. El edema laríngeo da problemas al extubar (${p(19)}).` + enFicha(VA, 'nep-laringe') },
      { id: 'tubo-g6', corto: 'drenaje subglótico', tipo: 'test', fuente: 'nep-subglotico',
        enunciado: 'Un tubo con drenaje subglótico tiene un conducto por encima del manguito. ¿Qué extrae y qué se espera de él?',
        opciones: [
          no('Las secreciones bronquiales de debajo del manguito, para no tener que aspirar por el tubo, y así evitar la aspiración de las vías por el tubo en cada turno', `El conducto drena lo que se acumula por encima del manguito inflado, no el moco bronquial (${p(19)}-${p(20)}).`),
          no('Las secreciones de la boca acumuladas sobre el manguito, aunque sin relación con la neumonía', `Esa aspiración de secreciones orales es justo el papel patogénico de la neumonía asociada a la ventilación (${p(19)}).`),
          ok('Las secreciones de la boca que se acumulan sobre el manguito; puede reducir la neumonía asociada a la ventilación')],
        explicacion: `La aspiración de secreciones de la boca tiene un papel destacado en la <span class="hl-azul">neumonía asociada a la ventilación</span>; estos tubos las drenan sobre el manguito y pueden reducirla (${p(19)}-${p(20)}).` + enFicha(VA, 'nep-subglotico') },
      { id: 'tubo-g7', corto: 'traqueo precoz', tipo: 'test', fuente: 'nep-momento',
        enunciado: 'Los estudios comparan la traqueostomía precoz (en la primera semana) con la tardía (a las dos semanas o más). ¿Qué consigue la precoz?',
        opciones: [
          no('Reduce la neumonía asociada a la ventilación y la mortalidad, pero no el tiempo de ventilación según los estudios más grandes', `Es al revés en lo que importa: reduce sedantes y tiempo de ventilación, pero no la neumonía ni la mortalidad (${p(20)}).`),
          no('Reduce los sedantes y la neumonía, y además aumenta algo la mortalidad', `No reduce la neumonía y la mortalidad no cambia (${p(20)}).`),
          ok('Reduce las necesidades de sedantes y el tiempo de ventilación; no reduce la neumonía ni la mortalidad')],
        explicacion: `Precoz: <span class="hl-verde">menos sedantes y menos tiempo de ventilación</span>; <span class="hl-rojo">ni menos neumonía ni menos mortalidad</span> (${p(20)}).` + enFicha(VA, 'nep-momento') },
      { id: 'tubo-g8', corto: 'cricotiroidotomía', tipo: 'test', fuente: 'nep-tecnicas',
        enunciado: 'Un paciente sobrevive a una cricotiroidotomía de urgencia y ya está estable. ¿Qué haces con esa vía?',
        opciones: [
          no('La mantienes hasta el destete: es una vía igual de segura que la traqueostomía', `Tiene una incidencia alta de lesión laríngea y estenosis subglótica; por eso solo se usa en urgencia (${p(20)}).`),
          no('La cambias por un tubo orotraqueal, que lesiona menos la laringe a largo plazo', `La indicación es una traqueostomía regular; y el tubo orotraqueal prolongado ya lesiona la laringe en más de la mitad (${p(19)}-${p(20)}).`),
          ok('La sustituyes por una traqueostomía regular, quirúrgica o percutánea, en cuanto esté estable')],
        explicacion: `La <span class="hl-rojo">cricotiroidotomía es solo acceso de emergencia</span>; el que sobrevive necesita una traqueostomía regular lo antes posible. La percutánea es la técnica preferida en general (${p(20)}).` + enFicha(VA, 'nep-tecnicas') },
      { id: 'tubo-g9', corto: 'estenosis traqueal', tipo: 'error', fuente: 'nep-estenosis', origen: ILU,
        enunciado: 'Nota sobre la estenosis traqueal en una traqueostomía de Rafael. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'La estenosis se localiza sobre todo en la incisión traqueal, tras cerrarse el estoma.' },
          { t: 'Aparece en la primera semana, con el tubo puesto.', mal: true, c: `Es una complicación tardía: aparece en los primeros 6 meses después de retirar el tubo (${p(21)}).` },
          { t: 'Es más frecuente con la técnica percutánea que con la quirúrgica.', mal: true, c: `El riesgo es el mismo con la traqueostomía quirúrgica y con la percutánea (${p(21)}).` },
          { t: 'La mayoría de los casos son asintomáticos.' }],
        explicacion: 'Dos errores: situarla en la primera semana con el tubo puesto y atribuir más riesgo a la técnica percutánea.',
        nota: `La ficha no la presenta como frecuente: la incidencia varía de 0 a 15 % en las series (${p(21)}).` + enFicha(VA, 'nep-estenosis') },
      { id: 'tubo-g10', corto: 'fuga del manguito', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-cuff-fuga · nep-cuff-solucion',
        enunciado: 'Oyes una fuga de aire por la garganta en cada insuflación. ¿Cuál es el orden de lo que haces, según el estado del balón piloto?',
        puntos: [
          `Separas al paciente del ventilador, lo ventilas con la bolsa de anestesia y <span class="hl-azul">compruebas el balón piloto</span> (${p(22)}).`,
          `Piloto <span class="hl-verde">inflado</span>: el sello es desigual con la pared; desinflas, reposicionas, reinflas (sin pasar de 25 cmH₂O) y, si sigue, pones un tubo mayor (${p(22)}).`,
          `Piloto <span class="hl-rojo">desinflado</span>: falla la válvula o el manguito; reinflas y, si el piloto no se llena, cambias el tubo (${p(23)}).`],
        explicacion: `El piloto dice si el manguito está lleno: la causa es el contacto o la válvula (${p(22)}-${p(23)}).` + enFicha(VA, 'nep-cuff-solucion') },
      { id: 'tubo-g11', corto: 'por qué 25', tipo: 'test', fuente: 'nep-cuff-presion', modelo: pv('fuga-cuff', '🫁 Benito: el manguito a 25 y la fuga'),
        enunciado: 'Antes de comprobarlo en el modelo: el manguito se hincha hasta que no se oye fuga. ¿Cuál es el tope de presión y por qué ese número?',
        opciones: [
          no('40 mmHg, la presión que aguanta el balón piloto sin romperse', `El tope es 25 mmHg y no depende del balón piloto sino de los capilares de la pared de la tráquea (${p(21)}).`),
          ok('25 mmHg: es la presión de los capilares de la pared traqueal; por encima se comprimen y la mucosa se isquemia'),
          no('25 mmHg, la presión mínima para sellar la tráquea; por debajo hay aspiración y, por debajo, el manguito se desliza y entra saliva en la vía aérea', `Es un máximo, no un mínimo: por encima isquemia la mucosa; los manguitos modernos alargados sellan con menos presión (${p(21)}).`)],
        explicacion: `Tope de <span class="hl-rojo">25 mmHg</span>: la presión hidrostática capilar de la pared traqueal; más presión externa comprime los capilares y causa isquemia de la mucosa. Los manguitos modernos, alargados, sellan con menos presión (${p(21)}).`,
        nota: `<b>Nota de fuentes.</b> El libro da el límite en dos unidades: 25 mmHg al medir con manómetro (${p(21)}) y 25 cmH₂O al reponer aire ante una fuga (${p(22)}). No son lo mismo (25 mmHg son unos 34 cmH₂O) y no se elige ganadora; el modelo usa 25 cmH₂O, el más estricto.` + enFicha(VA, 'nep-cuff-presion') },
    ],
    examen: [
      { id: 'tubo-e1', corto: 'tubo de 185 cm', tipo: 'test', fuente: 'nep-tamano', origen: 'ficha: los tramos; el paciente es inventado',
        enunciado: 'Un varón de 185 cm necesita intubación. ¿Qué tamaño de tubo da la fuente para su altura?',
        opciones: [
          no('7,5, que cubre hasta 5\'10" y es el habitual del adulto', `5'10" son 177,8 cm; a 185 cm corresponde el tramo de 5'11" o más (${p(17)}).`),
          ok('Tamaño 8, el del tramo de 5\'11" (180,3 cm) o más'),
          no('7, el más pequeño, para proteger la laringe', `El 7 es para alturas de hasta 5'2" (157,5 cm) (${p(17)}).`)],
        explicacion: `Tamaño 8 para alturas ≥5'11" (180,3 cm o más) (${p(17)}).` + enFicha(VA, 'nep-tamano') },
      { id: 'tubo-e2', corto: 'cifras de la traqueostomía', tipo: 'test', fuente: 'nep-complicaciones-traqueo',
        enunciado: 'Sumando la técnica quirúrgica y la percutánea, ¿qué cifras da la fuente de mortalidad, sangrado mayor e infección de la traqueostomía?',
        opciones: [
          no('Mortalidad <1 %, sangrado mayor <5 % e infección <1 % en la percutánea', `La infección es de 2 a 10 % (con tasas más bajas en la percutánea), no <1 % (${p(20)}).`),
          no('Mortalidad 1-5 %, sangrado mayor >10 % e infección 2-10 % que baja a menos del 1 % con la técnica percutánea hecha por expertos', `La mortalidad es menor del 1 % y el sangrado mayor menor del 5 % (${p(20)}).`),
          ok('Mortalidad <1 %, sangrado mayor <5 % e infección 2-10 %, con las tasas más bajas en la percutánea')],
        explicacion: `Mortalidad <span class="hl-verde"><1 %</span>, sangrado mayor <span class="hl-verde"><5 %</span> e infección <span class="hl">2-10 %</span> (más baja con la percutánea) (${p(20)}).` + enFicha(VA, 'nep-complicaciones-traqueo') },
      { id: 'tubo-e3', corto: 'ventaja de la traqueo', tipo: 'test', fuente: 'nep-traqueostomia',
        enunciado: 'Un paciente va a necesitar ventilación más de 2 semanas. ¿Qué ventajas tiene la traqueostomía frente al tubo por la boca?',
        opciones: [
          no('Más comodidad y menor resistencia, pero más lesión de la laringe por quedar el tubo más tiempo', `Reduce el riesgo de lesión laríngea, no lo aumenta (${p(20)}).`),
          ok('Más comodidad, acceso fácil para aspirar y dar broncodilatadores, menos resistencia y menos lesión laríngea'),
          no('Menor coste y sin necesidad de sedación, ya que se coloca al pie de la cama', `Esas ventajas (coste, sin anestesia general, menos infecciones) son de la técnica percutánea frente a la quirúrgica, no de la traqueostomía frente al tubo (${p(20)}).`)],
        explicacion: `Preferida en ventilación prolongada (>2 semanas): <span class="hl-verde">comodidad, acceso a secreciones y broncodilatadores, menor resistencia y menor riesgo de lesión laríngea</span> (${p(20)}).` + enFicha(VA, 'nep-traqueostomia') },
      { id: 'tubo-e4', corto: 'unidades del tope', tipo: 'test', fuente: 'nep-cuff-presion · nep-cuff-solucion', modelo: pv('fuga-cuff', '🫁 Benito: el manguito a 15 y a 0'),
        enunciado: 'Reinflas un manguito que fugaba y quieres respetar el tope. ¿Qué unidad y qué cifra da la fuente?',
        opciones: [
          no('Solo 25 cmH₂O, que es la presión de los capilares traqueales, porque el manómetro del balón piloto mide en esa unidad y no en mmHg', `La presión capilar de la pared se da en mmHg (25 mmHg) al medir con manómetro; los 25 cmH₂O aparecen al reponer aire en una fuga (${p(21)}-${p(22)}).`),
          ok('25 mmHg con el manómetro del balón piloto y 25 cmH₂O al reponer aire: la fuente da las dos'),
          no('Solo 25 mmHg; reponer aire no requiere mirar la presión', `Al reponer aire hay que comprobar que la presión no pase de 25 cmH₂O (${p(22)}).`)],
        explicacion: `El libro escribe <span class="hl-purpura">25 mmHg</span> (${p(21)}) y <span class="hl-purpura">25 cmH₂O</span> (${p(22)}). Son unidades distintas; ante la duda, el 25 cmH₂O es más estricto.`,
        nota: `<b>Las fuentes discrepan:</b> 25 mmHg son unos 34 cmH₂O. No es un error del residente: son las dos cifras del libro (${p(21)} y ${p(22)}).` + enFicha(VA, 'nep-cuff-presion') },
      { id: 'tubo-e5', corto: 'volumen de la fuga', tipo: 'test', fuente: 'nep-cuff-fuga', origen: 'ficha: la definición; las cifras, ilustrativas', modelo: pv('fuga-cuff', '🫁 Benito: el manguito a 15, fuga de 80'),
        enunciado: 'Programas 600 mL y el ventilador mide 540 mL exhalados. ¿Cómo estimas la fuga y qué sospechas?',
        opciones: [
          no('Fuga de 60 mL por una rotura del manguito, que es la causa más habitual, ya que los manguitos de los tubos se desgastan con los días de ventilación', `Los manguitos habitualmente no se rompen: la fuga suele venir de un contacto desigual con la pared o de la válvula del piloto (${p(22)}).`),
          no('Fuga de 540 mL: es lo que se escapa por la laringe en cada insuflación', `La fuga es la diferencia entre el volumen programado y el exhalado, aquí 60 mL (${p(22)}).`),
          ok('Fuga de 60 mL: la diferencia entre lo programado y lo exhalado; suele ser contacto desigual o válvula del piloto')],
        explicacion: `Fuga = volumen programado − volumen exhalado = <span class="hl-azul">60 mL</span> (${p(22)}). Suele deberse a un <span class="hl-azul">contacto no uniforme</span> o a la válvula, no a una rotura.` + enFicha(VA, 'nep-cuff-fuga') },
    ],
    casos: [
      { id: 'c-tubo-rafael', titulo: 'Rafael, 52 años: del tubo a la traqueostomía', corto: 'Caso · Rafael (tubo)', sub: 'politrauma: tamaño, Rx, traqueostomía, fuga y decanulación',
        paciente: { Edad: '52 años, varón', Talla: '1,80 m', Motivo: 'politrauma, intubado', Antecedentes: 'sin enfermedad previa' },
        pasos: [
          { momento: 'Día 1 · intubación', datos: { Altura: '1,80 m', 'Altura en pulgadas': '70,9"' }, nuevo: ['Altura', 'Altura en pulgadas'], calculadora: { ir: 'neumo-et-altura', nombre: 'Calculadora del tamaño del tubo' },
            pregunta: { id: 'tubo-c1', tipo: 'test', fuente: 'nep-tamano', origen: 'ficha: los tramos; el paciente es inventado',
              enunciado: 'Vas a intubar a Rafael. Mete 180 cm en la calculadora de la ficha: ¿qué te devuelve y cómo decides el tubo?',
              opciones: [
                no('Tamaño 8, porque la calculadora lo da desde 180 cm, que la propia calculadora devuelve para las alturas de 180 cm en adelante', `180 cm son 70,9": entre 5'10" (177,8 cm) y 5'11" (180,3 cm), donde el libro no da tamaño (${p(17)}).`),
                ok('Un hueco de la fuente, entre 7,5 y 8; como el tamaño no cambia los resultados, eliges uno de los dos vecinos'),
                no('Tamaño 7, el más pequeño, que es el más seguro', `El 7 es para ≤157,5 cm; para 1,80 m queda muy lejos de su tramo (${p(17)}).`)],
              explicacion: `Entre <span class="hl-azul">5'10" (7,5)</span> y <span class="hl-azul">5'11" (8)</span> el libro no da tamaño; como «no hay evidencia de que el tamaño afecte los resultados», se elige uno de los dos vecinos. Rafael lleva el 8 (ficha de modos del respirador) (${p(17)}).` + enFicha(VA, 'nep-tamano') } },
          { momento: 'Día 1 · radiografía', datos: { 'Tubo': '8, a 23 cm de los dientes', 'Rx portátil': 'punta a 1 cm de la carina' }, nuevo: ['Tubo', 'Rx portátil'],
            pregunta: { id: 'tubo-c2', tipo: 'test', fuente: 'nep-posicion · nep-migracion', origen: ILU,
              enunciado: 'La radiografía muestra la punta a 1 cm de la carina, con el tubo a 23 cm de los dientes. ¿Qué haces?',
              opciones: [
                no('Lo dejas: tan cerca de la carina ventila bien los dos pulmones', `Un tubo así de profundo migra al bronquio derecho con un simple movimiento, y flexionar el cuello lo mueve 2 cm (${p(18)}-${p(19)}).`),
                ok('Lo retiras unos centímetros hasta dejar la punta a 3-5 cm de la carina, contando con que la flexión del cuello la mueve 2 cm'),
                no('Lo avanzas 2 cm para que el manguito selle bien por debajo de las cuerdas', `Avanzarlo acerca la punta a la carina y a la intubación del bronquio derecho con atelectasia del pulmón izquierdo (${p(18)}-${p(19)}).`)],
              explicacion: `Punta a <span class="hl-azul">3-5 cm sobre la carina</span>; la flexión o extensión del cuello desplaza 2 cm (${p(18)}). Los 23 cm a los dientes son el máximo del hombre (${p(19)}).` + enFicha(VA, 'nep-posicion') } },
          { momento: 'Día 8 · sigue intubado', datos: { Situación: 'ventilado desde el día 1', Pronóstico: 'extubación improbable la semana próxima' }, nuevo: ['Situación', 'Pronóstico'],
            pregunta: { id: 'tubo-c3', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-momento · nep-tecnicas', origen: ILU,
              enunciado: 'Rafael lleva una semana intubado y es improbable que lo extubes la semana que viene. ¿Qué planteas y cómo?',
              puntos: [
                `<span class="hl-azul">Traqueostomía</span>: la práctica es considerarla tras una semana de intubación si hay poca probabilidad de extubar en la siguiente (${p(20)}).`,
                `Por la <span class="hl-azul">técnica percutánea</span>: al pie de la cama, sin anestesia general, más barata y con menos infecciones (${p(20)}).`,
                `Con un operador <span class="hl-rojo">experto</span>: es más difícil que la quirúrgica (${p(20)}).`],
              explicacion: `Rafael ya no es un caso de tubo temporal: la traqueostomía se plantea ahora y no a las dos semanas (${p(20)}).` + enFicha(VA, 'nep-tecnicas') } },
          { momento: 'Día 9 · giro: fuga', datos: { 'Vt programado': '500 mL', 'Vt exhalado': '400 mL', Sonido: 'fuga audible en cada insuflación' }, nuevo: ['Vt programado', 'Vt exhalado', 'Sonido'],
            pregunta: { id: 'tubo-c4', tipo: 'test', fuente: 'nep-cuff-fuga', origen: 'ficha: la definición y la causa; las cifras de Rafael, ilustrativas', modelo: pv('fuga-cuff', '🫁 Benito (otro paciente): el manguito a 15, fuga de 80'),
              enunciado: 'Con el manguito inflado, el ventilador de Rafael suena a fuga: programado 500, exhalado 400. ¿Cuánto es la fuga y qué es lo más probable?',
              opciones: [
                no('100 mL, y lo más probable es que el manguito esté roto', `La fuga son 100 mL (la diferencia), pero los manguitos habitualmente no se rompen (${p(22)}).`),
                ok('100 mL, y lo más probable es un contacto desigual con la pared o la válvula del balón piloto'),
                no('400 mL, lo que sale por la laringe, y lo más probable es un tubo demasiado pequeño y hay que cambiarlo cuanto antes por uno mayor', `La fuga es la diferencia entre programado y exhalado, 100 mL, y la fuente atribuye la fuga al contacto o a la válvula, no al tamaño (${p(22)}).`)],
              explicacion: `Fuga = 500 − 400 = <span class="hl-azul">100 mL</span> (ilustrativo); causa habitual: <span class="hl-azul">contacto no uniforme o válvula</span> (${p(22)}). En el modelo, Benito con el manguito a 15 pierde 80 mL de 410.` + enFicha(VA, 'nep-cuff-fuga') } },
          { momento: 'Día 9 · el plan', datos: { 'Nota del R1': 'cuatro frases' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'tubo-c5', tipo: 'error', fuente: 'nep-cuff-presion · nep-cuff-solucion', origen: ILU,
              enunciado: 'El residente anota su plan para la fuga de Rafael. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Separo al paciente del ventilador y lo ventilo con la bolsa.' },
                { t: 'Inflo el manguito hasta 40 cmH₂O hasta que deje de oírse la fuga.', mal: true, c: `La presión no debe pasar de 25: por encima se comprimen los capilares de la pared y se isquemia la mucosa (${p(21)}-${p(22)}).` },
                { t: 'El balón piloto está inflado: cambio el tubo ya, sin reposicionarlo.', mal: true, c: `Con el piloto inflado, primero se desinfla, se reposiciona y se reinfla; solo si no corrige se pone un tubo mayor (${p(22)}).` },
                { t: 'Mido la presión del manguito con un manómetro conectado al piloto.' }],
              explicacion: 'Dos errores: sobrepasar el tope de presión del manguito y cambiar el tubo sin reposicionarlo antes.',
              nota: `La ficha da el tope en mmHg y en cmH₂O (${p(21)}-${p(22)}); aquí 40 cmH₂O supera ambos.` + enFicha(VA, 'nep-cuff-solucion') } },
          { momento: 'Día 12 · se sale la traqueostomía', datos: { Traqueostomía: 'colocada el día 10', 'Día 12': 'sale por un golpe de tos' }, nuevo: ['Traqueostomía', 'Día 12'],
            pregunta: { id: 'tubo-c6', tipo: 'test', fuente: 'nep-decanulacion', origen: 'ficha: la regla; los días del caso, inventados',
              enunciado: 'Rafael se decanula accidentalmente al segundo día de su traqueostomía. ¿Qué haces?',
              opciones: [
                no('Reinsertas el tubo por el estoma, cuanto antes, para no perder el trayecto y así evitas que el estoma se estreche con el paso de las horas', `El estoma aún no ha madurado y el trayecto se cierra rápido: reinsertar a ciegas crea falsos trayectos (${p(20)}).`),
                ok('Lo reintubas por la boca primero; el estoma madura en una semana y antes de eso se cierra rápido'),
                no('Esperas con oxígeno por el estoma a que se estabilice y lo reinsertas a ciegas por la tarde', `Con el estoma inmaduro el trayecto se cierra y la reinserción ciega puede crear un falso trayecto (${p(20)}).`)],
              explicacion: `Si el tubo se sale en los primeros días, <span class="hl-rojo">reintubación oral antes de reinsertar</span>: el estoma tarda <span class="hl-azul">una semana</span> en madurar (${p(20)}).` + enFicha(VA, 'nep-decanulacion') } },
        ],
        lleva: [
          'Entre 5\'10" y 5\'11" la fuente no da tamaño; la punta va a 3-5 cm de la carina y a ≤23 cm en el hombre.' + enFicha(VA, 'nep-posicion'),
          'El manguito no pasa de 25: ante una fuga, bolsa, piloto, reposicionar y, si no corrige, tubo mayor.' + enFicha(VA, 'nep-cuff-solucion'),
          'Con la traqueostomía todavía inmadura, la salida accidental se resuelve reintubando por la boca.' + enFicha(VA, 'nep-decanulacion')],
        volver: { nombre: 'La fuga del manguito', ancla: 'nep-cuff-fuga', modelo: pv('fuga-cuff', '🫁 La fuga del manguito') } },
    ],
    profundizar: [
      { id: 'nep-fig-28-1', titulo: 'Figura 28.1: radiografía con el tubo bien colocado' },
      { id: 'nep-fig-28-2', titulo: 'Figura 28.2: intubación del bronquio derecho' },
      { id: 'nep-cuff-presion', titulo: 'Cómo se infla el manguito y se mide su presión' },
    ],
  },
};

export const MAYEUTICA_TUBO = { ...DATOS, ...MAYEUTICA_TUBO_2 };
