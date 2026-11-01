// Mayéutica del bloque 3D (Marino cap. 23, págs. 15-25): fichas neumo-asma-epoc-basicos (aquí) y neumo-asma-agudo (b3d-asma-2.js),
// con el caso de Eulalia (urgencias y UCI). Datos puros; el formato está en la cabecera de b1-fluidos.js.
// Modelos vivos: pulmonVivo `broncoespasmo-auto-peep` y `eulalia-ajustada`, receptorVivo `bronquio` (β₂). Eulalia: 27 años,
// 60 kg, 1,62 m, PBW 54 kg (el del modelo). Las cifras de los casos son del paciente (inventado); la conducta, de la fuente.
import { MAYEUTICA_ASMA_AGUDO } from './b3d-asma-2.js';

const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const PDF_B = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const pb = n => `<a class="biblio-link" href="${PDF_B}#page=${n}" target="_blank" rel="noopener">cap. 27, pág. ${n}</a>`;
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const BA = 'neumo-asma-epoc-basicos';
const AG = 'neumo-asma-agudo';
const pl = (clave, texto) => ({ pulmonVivo: clave, texto });

export const MAYEUTICA_ASMA = {
  /* =================================================================================================
     Ficha · Asma y EPOC en la UCI: básicos (cap. 23, págs. 15-19) y el caso de Eulalia en urgencias
     ================================================================================================= */
  [BA]: {
    entrada: 'Por qué la clínica no mide la obstrucción, qué miden el PEFR y la PEEP intrínseca, y por qué el aerosol llega al pulmón en un 9-20 % de la dosis.',
    guia: [
      { id: 'as1-g1', corto: 'signos clínicos', tipo: 'test', fuente: 'nep-pulso-paradojico',
        enunciado: 'Una asmática llega taquicárdica, taquipneica, con músculos accesorios, sin poder acabar frases y con pulso paradójico. Antes de leer: ¿qué valor tiene ese conjunto para medir la gravedad de la obstrucción?',
        opciones: [
          { t: 'Ninguno es sensible ni específico para la obstrucción grave: hacen falta medidas objetivas', ok: true },
          { t: 'Si hay pulso paradójico, la obstrucción es grave; los demás signos solo acompañan, y con él basta para decidir el tratamiento de entrada', porque: `Marino dice que ninguno de los hallazgos, pulso paradójico incluido, es sensible ni específico (${p(16)}). Con esa regla darías por leve a quien no lo tiene y retrasarías la medida objetiva.` },
          { t: 'No poder acabar frases es el signo más específico y sustituye a las medidas objetivas', porque: `Tampoco es específico (${p(16)}); el examen clínico es a menudo poco fiable y se recomiendan medidas más objetivas, como el PEFR.` }],
        explicacion: `<span class="hl-rojo">El examen clínico es a menudo poco fiable</span> para juzgar la gravedad: taquicardia, taquipnea, músculos accesorios, no completar frases, alteración mental o pulso paradójico (caída inspiratoria de la sistólica >12 mmHg) no son ni sensibles ni específicos (${p(16)}).`,
        nota: `<b>Las fuentes discrepan:</b> este capítulo define el pulso paradójico como una caída >12 mmHg (${p(16)}); el cap. 26, como >10 mmHg (${p(87)}). Se muestran las dos cifras, cada una en su capítulo; no se elige una.` + enFicha(BA, 'nep-pulso-paradojico') },
      { id: 'as1-g2', corto: 'PEFR e hipercapnia', tipo: 'test', fuente: 'nep-pefr',
        enunciado: 'Un asmático con exacerbación respira espontáneamente. ¿Qué medida de cabecera usas y a partir de qué valor esperas que aparezca la hipercapnia?',
        opciones: [
          { t: 'El PEFR: por debajo del 40 % del predicho es grave (<200 L/min); la hipercapnia no llega hasta <25 %', ok: true },
          { t: 'El PEFR: la hipercapnia aparece ya por debajo del 40 %, al entrar en la obstrucción grave', porque: `Grave es <40 %, pero la hipercapnia no ocurre hasta que cae por debajo del 25 % (${p(16)}). Con este error esperarías CO₂ alto en todos los graves y tomarías una PaCO₂ normal por buena señal.` },
          { t: 'La pulsioximetría: una SaO₂ normal descarta la obstrucción grave y la hipercapnia, y evita tener que pedir una gasometría arterial', porque: `Marino propone el PEFR (${p(16)}); con SaO₂ normal seguirías sin medir la obstrucción mientras empeora.` }],
        explicacion: `Tabla de la ficha: <span class="hl-verde">≥70 % leve</span>, 40-69 % moderada, <span class="hl-rojo"><40 % grave</span>. Un PEFR <200 L/min indica obstrucción grave y la hipercapnia no aparece hasta <span class="hl-rojo">el 25 %</span> del predicho (${p(16)}).` + enFicha(BA, 'nep-pefr') },
      { id: 'as1-g3', corto: 'límite del PEFR', tipo: 'test', fuente: 'nep-pefr',
        enunciado: 'El PEFR es fácil de medir a pie de cama, pero no se ha popularizado en cuidados agudos. ¿Por qué?',
        opciones: [
          { t: 'Depende del esfuerzo: pide inspirar hasta la capacidad pulmonar total y espirar al máximo, y el paciente en distrés no puede', ok: true },
          { t: 'Porque necesita una espirometría de laboratorio, no se puede hacer a pie de cama y tampoco se puede repetir de forma seriada durante el ingreso', porque: `La fuente dice que es una medida a pie de cama fácilmente obtenible (${p(16)}); el obstáculo es el esfuerzo que exige.` },
          { t: 'Porque en el asma grave es siempre normal y solo sirve para el EPOC', porque: `Es la medida que clasifica el asma (tabla del PEFR); lo que falla es que el paciente en distrés no logra las maniobras (${p(16)}).` }],
        explicacion: `El PEFR <span class="hl-azul">depende del esfuerzo</span>: exige un esfuerzo inspiratorio máximo y uno espiratorio máximo hasta el volumen residual. Cuando cede el distrés, las mediciones periódicas sirven para seguir el curso (${p(16)}).` + enFicha(BA, 'nep-pefr') },
      { id: 'as1-g4', corto: 'PEEP intrínseca', tipo: 'test', fuente: 'nep-peep-intrinseca-basicos', modeloVivo: pl('broncoespasmo-auto-peep', '🫁 Un obstructivo con respirador: mira el flujo que no llega a cero'),
        enunciado: 'Un paciente con obstrucción grave está ventilado y no logra vaciar el pulmón. ¿Qué es la PEEP intrínseca y qué te dice?',
        opciones: [
          { t: 'La presión positiva que queda en el alvéolo al final de la espiración por el aire atrapado; refleja la gravedad de la obstrucción', ok: true },
          { t: 'La PEEP que programas en el respirador; refleja el nivel de reclutamiento y se ajusta según la oxigenación y la compliance del paciente', porque: `Esa es la extrínseca. La intrínseca nace del aire que no sale (${p(16)}); si las confundes, no buscarás el atrapamiento que lleva a la hipotensión.` },
          { t: 'La presión del circuito en la inspiración; se mide con la pausa', porque: `Esa es la presión pico o la meseta; la intrínseca es positiva al final de la espiración y se monitoriza durante la ventilación mecánica (${p(16)}).` }],
        explicacion: `Si no se exhala por completo, el volumen retenido causa <span class="hl-azul">hiperinflación</span> y presión positiva alveolar al final de la espiración: la PEEP intrínseca, <span class="hl-rojo">reflejo de la gravedad de la obstrucción</span>, que se monitoriza en ventilación mecánica (${p(16)}). Cómo medirla: ficha «EPOC y ventilación con presión positiva».` + enFicha(BA, 'nep-peep-intrinseca-basicos') },
      { id: 'as1-g10', corto: 'quitar la PEEP oculta', tipo: 'test', fuente: 'nep-ajustes-oculta', origen: 'ficha (conducta); cifras del monitor de la app (modelo, Jacinto)', modeloVivo: pl('auto-peep-corregida', '🫁 Jacinto con FR 12 y flujo 80: mira cómo el flujo final llega a cero'),
        enunciado: 'Un obstructivo ventilado con FR 24 y Vt 500 tiene el flujo espiratorio lejos de cero al final de cada espiración. ¿Qué haces primero para quitarle la PEEP oculta?',
        opciones: [
          { t: 'Alargar el tiempo de espiración (menos FR o más flujo inspiratorio) hasta que el flujo final llegue a cero', ok: true },
          { t: 'Subir la FR para lavar CO₂ y compensar el volumen minuto que pierde por el atrapamiento de aire', porque: `Más FR acorta aún más la espiración y atrapa más aire (${pb(15)}); el paciente se hiperinsuflaría y caería su presión arterial.` },
          { t: 'Poner una PEEP extrínseca igual a la oculta desde el principio, sin tocar el tiempo espiratorio', porque: `La PEEP extrínseca solo se añade, justo por debajo de la oculta, si prolongar la espiración no es posible o no tiene éxito (${pb(15)}); empezar por ahí deja el atrapamiento sin tratar.` }],
        explicacion: `Primero se mira el flujo final y se <span class="hl-verde">prolonga la espiración</span>; la PEEP extrínseca queda para cuando eso no basta (${pb(15)}). En el modelo (monitor de la app): con FR 24 y Vt 500, PEEP oculta 6,4 cmH₂O y flujo final −10 L/min; con FR 12, Vt 400 y flujo 80, 1,1 cmH₂O y el flujo llega a cero. El volumen minuto baja de 12 a 4,8 L/min: es el precio.` + enFicha('neumo-vm-ajuste', 'nep-ajustes-oculta') },
      { id: 'as1-g5', corto: 'nebulizador jet', tipo: 'test', fuente: 'nep-nebulizador',
        enunciado: '¿Cómo genera el aerosol un nebulizador jet y cuánto volumen lleva el de pequeño volumen?',
        opciones: [
          { t: 'Un cartucho presurizado con propelente libera una dosis fija que se activa con la respiración del paciente; el reservorio es de 200 mL', porque: `Eso es el MDI. El jet usa un gas a alta velocidad sobre un tubo sumergido, y los de pequeño volumen llevan 3-6 mL (${p(17)}).` },
          { t: 'Como una mascarilla de arrastre: un gas a alta presión pulveriza la solución; 3-6 mL, en menos de 10 min', ok: true },
          { t: 'Con ultrasonidos que vibran la solución; un reservorio de 3-6 mL dura más de una hora', porque: `El nebulizador de la ficha es neumático (jet) y vacía el reservorio en menos de 10 minutos (${p(17)}).` }],
        explicacion: `Mismo principio que la mascarilla de arrastre de aire: un chorro de gas a alta velocidad (p. ej., 50 psi de la pared) arrastra la solución por un tubo y la pulveriza. El reservorio de pequeño volumen, de <span class="hl-azul">3-6 mL</span>, se aerosoliza en menos de 10 min (${p(17)}).` + enFicha(BA, 'nep-nebulizador') },
      { id: 'as1-g6', corto: 'qué pronostica el ingreso', tipo: 'test', fuente: 'nep-asma-epoc-ominoso',
        enunciado: 'Antes de leer: ¿qué anuncia el ingreso en UCI de una exacerbación de EPOC y qué factor se asocia más a morir en el asma?',
        opciones: [
          { t: 'En el EPOC, 1 de cada 4 no sobrevive y el 40 % reingresa en un año; en el asma, la ventilación mecánica', ok: true },
          { t: 'En el EPOC, 1 de cada 10 no sobrevive y el 40 % reingresa; en el asma, la hipercapnia', porque: `La ficha da 1 de cada 4, no 1 de cada 10, y el factor de riesgo más fuerte de muerte en el asma es la necesidad de ventilación mecánica, no la hipercapnia (${p(15)}).` },
          { t: 'En el EPOC, 1 de cada 4 no sobrevive y casi ninguno reingresa en el año; en el asma, el uso de músculos accesorios', porque: `El 40 % de los supervivientes reingresa en un año, y el factor más fuerte en el asma es la ventilación mecánica; los signos clínicos no son fiables para la gravedad (${p(15)}-${p(16)}).` }],
        explicacion: `El ingreso en UCI es un <span class="hl-rojo">signo ominoso</span>: en el EPOC, 1 de cada 4 no sobrevivirá a la hospitalización y el 40 % de los supervivientes reingresará en un año; en el asma, la ventilación mecánica es el factor de riesgo más fuerte de muerte (${p(15)}).` + enFicha(BA, 'nep-asma-epoc-ominoso') },
      { id: 'as1-g7', corto: 'nebulizador frente a MDI', tipo: 'test', fuente: 'nep-neb-vs-mdi',
        enunciado: 'La respuesta broncodilatadora con 2,5 mg por nebulizador y con 0,36 mg por MDI con espaciador es la misma, aunque la dosis difiere 7 veces. ¿Qué concluyes?',
        opciones: [
          { t: 'Que el MDI con espaciador deposita 7 veces más fármaco en el pulmón, y por eso basta una dosis menor y sin riesgo de efectos adversos', porque: `El MDI deposita el 20 % y el nebulizador el 12 %, no 7 veces más (${p(17)}); darías por explicada una discrepancia que Marino deja sin explicar.` },
          { t: 'Que valen igual: ajustada por el depósito pulmonar sigue habiendo 4 veces de diferencia, sin explicación', ok: true },
          { t: 'Que el nebulizador es 7 veces más potente y debe reservarse para la crisis grave', porque: `La respuesta es equivalente (${p(18)}); la preferencia por el nebulizador en la crisis no viene de una potencia mayor.` }],
        explicacion: `Resultados equivalentes con una gran diferencia de dosis. Ajustando por la dosis inhalada (12 % de 2,5 mg = 300 μg; 20 % de 0,36 mg = 72 μg) hay <span class="hl-rojo">4 veces</span> de diferencia, y la discrepancia <span class="hl-azul">permanece sin explicación</span> (${p(18)}).` + enFicha(BA, 'nep-neb-vs-mdi') },
      { id: 'as1-g8', corto: 'aerosol en ventilación', tipo: 'test', fuente: 'nep-aerosol-vm',
        enunciado: 'Un paciente ventilado recibe albuterol por la rama inspiratoria. ¿Qué pasa con el depósito pulmonar?',
        opciones: [
          { t: 'Mejora, porque el aerosol va directo a la vía aérea sin pasar por la orofaringe', porque: `Marino dice lo contrario: el depósito se ve aún más afectado por la condensación (${p(19)}). Si esperas más efecto, pensarás que un fallo de respuesta es del paciente.` },
          { t: 'Es igual que respirando espontáneamente, y solo cambia la dosis', porque: `El depósito es menor en ventilación mecánica, aunque la dosis de albuterol sea la misma que en respiración espontánea (${p(19)}).` },
          { t: 'Empeora aún más por la condensación en la tubuladura y en el tubo endotraqueal', ok: true }],
        explicacion: `En ventilación mecánica el albuterol (nebulizador o MDI con espaciador, en la rama inspiratoria) deposita todavía menos por la <span class="hl-azul">condensación</span> en la tubuladura y el tubo; la dosis, pese a todo, es la misma, y tampoco hay diferencia de respuesta entre nebulizador y MDI (${p(19)}).` + enFicha(BA, 'nep-aerosol-vm') },
      { id: 'as1-g9', corto: 'método preferido', tipo: 'error', fuente: 'nep-metodo-preferido · nep-mdi',
        enunciado: 'Notas sobre cómo elegir el sistema de aerosol. Hay un error. Encuéntralo.',
        frases: [
          { t: 'Los MDI con espaciador se prefieren en general porque la dosis es menor y minimiza los efectos secundarios.' },
          { t: 'Si el paciente no coordina la respiración con el disparo, los MDI activados por la respiración deberían resolverlo.' },
          { t: 'En la exacerbación aguda de asma se usa el MDI sin espaciador porque es más rápido que el nebulizador.', mal: true, c: `Los nebulizadores se prefieren en la exacerbación aguda y se pasa a MDI al estabilizarse (${p(19)}); con MDI siempre se usa espaciador, porque sin él el 80 % impacta en la orofaringe (${p(17)}).` },
          { t: 'Cuando el cuadro se estabiliza se inicia el cambio de nebulizador a MDI.' }],
        explicacion: `<span class="hl-verde">Nebulizador en la exacerbación, MDI con espaciador al estabilizar</span> (${p(19)}).` + enFicha(BA, 'nep-metodo-preferido') },
    ],
    examen: [
      { id: 'as1-e1', corto: 'PEFR 35 %', tipo: 'test', fuente: 'nep-pefr',
        enunciado: 'Un asmático con PEFR del 35 % del predicho respira espontáneamente. ¿Cómo lo clasificas y qué esperas del CO₂ arterial?',
        opciones: [
          { t: 'Moderada (40-69 %), y ya con hipercapnia por estar cerca del 40 %, que conviene confirmar con una gasometría urgente', porque: `35 % es grave (<40 %); y la hipercapnia no aparece hasta <25 % (${p(16)}). Subestimarías la gravedad.` },
          { t: 'Grave (<40 %), pero sin hipercapnia todavía: esta no ocurre hasta que el PEFR cae por debajo del 25 %', ok: true },
          { t: 'Grave, y con hipercapnia, porque en todo PEFR <40 % se retiene CO₂', porque: `La hipercapnia espera al 25 % (${p(16)}); asumirla en todos los graves llevaría a leer una PaCO₂ normal como tranquilizadora.` }],
        explicacion: `<40 % es <span class="hl-rojo">grave</span>; la hipercapnia no ocurre hasta que el PEFR cae por debajo del <span class="hl-rojo">25 %</span> (${p(16)}).` + enFicha(BA, 'nep-pefr') },
      { id: 'as1-e2', corto: 'depósito 12 / 9 / 20', tipo: 'test', fuente: 'nep-tabla-23-1',
        enunciado: 'Albuterol: 2,5 mg por nebulizador o 200 μg por MDI sin y con espaciador. ¿Qué porcentaje llega a los pulmones, en ese orden?',
        opciones: [
          { t: '20 %, 9 % y 12 %: el nebulizador es el que más deposita', porque: `El nebulizador deposita el 12 % (el 66 % se queda en el aparato) (${p(17)}); con la tabla al revés pondrías el MDI con espaciador como el de menor aporte pulmonar.` },
          { t: '12 %, 9 % y 20 %', ok: true },
          { t: '12 %, 80 % y 20 %, porque el MDI sin espaciador deposita casi todo', porque: `El 80 % del MDI sin espaciador es el depósito en la orofaringe, no en el pulmón, que recibe el 9 % (${p(17)}).` }],
        explicacion: `Pulmones: nebulizador <span class="hl-rojo">12 %</span>, MDI <span class="hl-rojo">9 %</span>, MDI con espaciador <span class="hl-verde">20 %</span> (más del doble). La dosis de 200 μg es 2 puffs (${p(17)}).` + enFicha(BA, 'nep-tabla-23-1') },
      { id: 'as1-e3', corto: 'MDI sin espaciador', tipo: 'test', fuente: 'nep-tabla-23-1',
        enunciado: 'Con el MDI sin espaciador, ¿qué parte de la dosis llega al pulmón y cómo se compara con el MDI con espaciador?',
        opciones: [
          { t: 'El 9 % de la dosis: menos de la mitad de lo que deposita con espaciador', ok: true },
          { t: 'El 20 %, igual: el espaciador solo evita la tos y el sabor', porque: `Sin espaciador llega el 9 % y con él el 20 % (${p(17)}); darías por equivalente un método que deposita menos de la mitad.` },
          { t: 'El 80 %: casi todo el spray llega, porque sale a más de 30 m/s', porque: `El 80 % es lo que choca en la orofaringe, no lo que llega al pulmón (${p(17)}); el paciente tragaría casi toda la dosis.` }],
        explicacion: `El 9 % frente al 20 % con espaciador: <span class="hl-rojo">menos de la mitad</span> (${p(17)}).` + enFicha(BA, 'nep-tabla-23-1') },
      { id: 'as1-e4', corto: 'ajustes en ventilación', tipo: 'test', fuente: 'nep-aerosol-vm',
        enunciado: 'Nebulizas albuterol en un paciente con respirador. ¿Qué ajuste mejora el depósito y qué dosis das?',
        opciones: [
          { t: 'Subir el flujo inspiratorio para empujar el aerosol, y doblar la dosis por la condensación', porque: `La fuente pide lo contrario: bajar el flujo inspiratorio y alargar la inspiración, con la misma dosis (${p(19)}). Doblarla expone a más taquicardia e hipopotasemia sin base.` },
          { t: 'Bajar el flujo inspiratorio y alargar la inspiración; la dosis es la misma que en respiración espontánea', ok: true },
          { t: 'Bajar el flujo y alargar la inspiración, y usar solo el nebulizador porque el MDI responde menos en cualquier fase de la crisis', porque: `No hay diferencia de respuesta entre nebulizador y MDI en ventilación mecánica (${p(19)}).` }],
        explicacion: `El depósito mejora <span class="hl-verde">disminuyendo el flujo inspiratorio y aumentando la duración de la inspiración</span>; la dosis es la misma que respirando espontáneamente y nebulizador y MDI responden igual (${p(19)}).` + enFicha(BA, 'nep-aerosol-vm') },
    ],
    profundizar: [
      { id: 'neumo-nota-pulso-paradojico-23', titulo: 'Nota de fuentes: el pulso paradójico, >12 mmHg en este capítulo y >10 en el 26' },
      { id: 'nep-nebulizador', titulo: 'Nebulizador jet: los de gran volumen (>200 mL) y el depósito pulmonar' },
    ],
    casos: [
      { id: 'c-asma-1', titulo: 'Eulalia, 27 años: la asmática que no se cansa de respirar', corto: 'Caso · Eulalia (urgencias)', sub: 'asma en urgencias; sigue en la ficha «Exacerbación aguda de asma»',
        paciente: { Edad: '27 años, mujer', Peso: '60 kg, 1,62 m (PBW 54 kg)', Antecedentes: 'asma', Motivo: 'disnea progresiva desde la tarde' },
        pasos: [
          { momento: '22:10 · llegada', datos: { Habla: 'frases cortas, sin acabar', FC: '125', FR: '30', 'Pulso paradójico': '14 mmHg' }, nuevo: ['Habla', 'FC', 'FR', 'Pulso paradójico'],
            pregunta: { id: 'as1-c1', tipo: 'test', fuente: 'nep-pulso-paradojico', origen: 'ficha: ningún signo es sensible ni específico; las cifras de Eulalia, del caso',
              enunciado: 'Frases cortas, FC 125, FR 30 y pulso paradójico de 14 mmHg. ¿Con eso sabes cuánto está obstruida?',
              opciones: [
                { t: 'Sí: 14 mmHg supera el umbral del capítulo (>12) y la clasifica como grave', porque: `Ninguno de esos signos es sensible ni específico (${p(16)}); decidirías con un dato que puede estar presente sin gravedad o ausente con ella.` },
                { t: 'No: ninguno es sensible ni específico, así que pides una medida objetiva, el PEFR', ok: true },
                { t: 'Sí: no acabar frases con FR 30 define la obstrucción grave', porque: `La clínica no mide la obstrucción (${p(16)}); sin PEFR dosificarías el tratamiento a ojo.` }],
              explicacion: `<span class="hl-rojo">La clínica es poco fiable</span> para la gravedad; se mide el PEFR (${p(16)}). El pulso paradójico de 14 supera el umbral de este capítulo (>12) y el del cap. 26 (>10), pero tampoco mide la obstrucción.` + enFicha(BA, 'nep-pulso-paradojico') } },
          { momento: '22:20 · el PEFR', datos: { PEFR: '30 % del predicho (el aparato marca 135 L/min)' }, nuevo: ['PEFR'], calculadora: { ir: 'neumo-pefr-input', nombre: 'Clasificador de gravedad por PEFR' },
            pregunta: { id: 'as1-c2', tipo: 'test', fuente: 'nep-pefr', origen: 'ficha',
              enunciado: 'El aparato marca 135 L/min (30 % del predicho). Pruébalo en el clasificador: ¿qué dice la ficha del valor absoluto?',
              opciones: [
                { t: 'Menos de 200 L/min indica obstrucción grave', ok: true },
                { t: 'Moderada: el corte de 200 L/min separa la leve de la moderada, y 135 queda entre 100 y 200', porque: `El corte de 200 L/min marca la obstrucción grave (${p(16)}); la llamarías moderada y le darías un tratamiento de menos.` },
                { t: 'Leve: por encima de 100 L/min el flujo basta para que el asmático mantenga la ventilación', porque: `Por debajo de 200 L/min ya es grave (${p(16)}); a esta paciente la dejarías sin vigilancia mientras se agota.` }],
              explicacion: `<span class="hl-rojo">PEFR <200 L/min = obstrucción grave</span> (${p(16)}); el porcentaje del predicho (<40 %) da la misma clasificación.` + enFicha(BA, 'nep-pefr') } },
          { momento: '22:30 · gasometría', datos: { Pedido: 'gasometría arterial con O₂ suplementario' }, nuevo: ['Pedido'],
            pregunta: { id: 'as1-c3', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-o2-asma · nep-pefr · nep-paco2-42', origen: 'ficha',
              enunciado: 'Pides la gasometría. ¿Qué tres cosas buscas?',
              puntos: [
                `<span class="hl-azul">La oxigenación</span>: se da O₂ para mantener la SaO₂ ≥90 % (${p(24)}).`,
                `<span class="hl-azul">La PaCO₂ esperada</span>: con la ventilación minuto aumentada (a menudo doblada) debería estar baja; una normal sería retención (${p(20)}); que la esperada sea baja es deducción del texto.`,
                `<span class="hl-rojo">La hipercapnia franca</span> no se espera todavía: con PEFR del 30 % aparece por debajo del 25 % (${p(16)}).`],
              explicacion: `La gasometría busca hipoxemia y, sobre todo, el CO₂: con este PEFR <span class="hl-rojo">una PaCO₂ baja sería lo esperable</span> (deducción del texto) y una normal ya pesa (${p(20)}).` + enFicha(AG, 'nep-paco2-42') } },
          { momento: '22:40 · el plan del otro residente', datos: { Plan: 'cuatro líneas' }, nuevo: ['Plan'],
            pregunta: { id: 'as1-c4', tipo: 'error', fuente: 'nep-metodo-preferido · nep-mdi · nep-neb-vs-mdi', origen: 'ficha',
              enunciado: 'Plan del residente de guardia para Eulalia. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Albuterol 2,5 mg por nebulizador, porque en la exacerbación aguda se prefiere el nebulizador.' },
                { t: 'Si no hay nebulizador, 2 puffs de MDI directos a la boca, sin espaciador, para ir más rápido.', mal: true, c: `Con MDI siempre espaciador: sin él el spray choca en la orofaringe y el pulmón recibe menos de la mitad de lo que recibiría con él (${p(17)}).` },
                { t: 'Oxígeno para mantener la SaO₂ en 90 % o más.' },
                { t: 'El nebulizador deposita en el pulmón 7 veces más fármaco que el MDI, así que no hace falta más dosis.', mal: true, c: `Lo que difiere 7 veces es la dosis administrada (2,5 mg frente a 0,36 mg); lo inhalado difiere 4 veces (300 μg frente a 72 μg) (${p(18)}).` }],
              explicacion: 'Dos errores: el MDI sin espaciador y confundir la dosis administrada con la depositada.',
              nota: `El nebulizador deposita el 12 % y el MDI con espaciador el 20 % (${p(17)}).` + enFicha(BA, 'nep-tabla-23-1') } },
          { momento: '23:00 · segunda nebulización', datos: { Tratamiento: '2.ª de 3 nebulizaciones de 20 min' }, nuevo: ['Tratamiento'],
            pregunta: { id: 'as1-c5', tipo: 'test', fuente: 'nep-metodo-preferido', origen: 'ficha',
              enunciado: 'La enfermera propone pasar ya a MDI con espaciador para "darle más autonomía". ¿Qué decides?',
              opciones: [
                { t: 'Seguir con el nebulizador durante la exacerbación y pasar al MDI con espaciador cuando se estabilice', ok: true },
                { t: 'Pasar al MDI ya: se prefiere en general y la respuesta es la misma', porque: `Los MDI se prefieren en general, pero el nebulizador es lo preferido en la exacerbación aguda; el cambio se inicia al estabilizarse (${p(19)}). Cambiarlo ahora cambia el método en plena crisis.` },
                { t: 'Seguir con el nebulizador hasta el alta porque deposita más en el pulmón (12 % frente a 20 %)', porque: `El 20 % es el del MDI con espaciador, no el del nebulizador (${p(17)}); el MDI se prefiere por su menor dosis y menos efectos secundarios (${p(19)}) y se mantendría una dosis alta sin motivo.` }],
              explicacion: `<span class="hl-verde">Nebulizador en la exacerbación, MDI al estabilizar</span> (${p(19)}).` + enFicha(BA, 'nep-metodo-preferido') } },
          { momento: '23:30 · el giro', datos: { Tratamiento: '3 nebulizaciones completas', PEFR: 'sigue en el 30 %', 'PaCO₂': '42 mmHg', FR: '30' }, nuevo: ['Tratamiento', 'PaCO₂'],
            pregunta: { id: 'as1-c6', tipo: 'test', fuente: 'nep-paco2-42 · nep-algoritmo', origen: 'ficha: la regla de la PaCO₂ 42; las cifras de Eulalia, del caso',
              enunciado: 'Tras tres nebulizaciones el PEFR no sube y la PaCO₂ es 42 mmHg, "normal". ¿Te tranquiliza?',
              opciones: [
                { t: 'Sí: la PaCO₂ es normal y con una respuesta estable puede esperar en urgencias, porque el PEFR no ha empeorado', porque: `Con la ventilación minuto aumentada, una PaCO₂ normal es retención de CO₂ (${p(20)}). La dejarías en urgencias con una obstrucción que se agota.` },
                { t: 'Sí, y ya puede pasar a MDI porque se ha estabilizado', porque: `No se ha estabilizado: el PEFR no sube (${p(19)}); la PaCO₂ de 42 pese al tratamiento es el criterio de ingreso en UCI (${p(20)}).` },
                { t: 'No: con la ventilación minuto aumentada, 42 es retención de CO₂ y justifica ingresar en la UCI', ok: true }],
              explicacion: `<span class="hl-rojo">Una PaCO₂ normal frente a una ventilación minuto alta representa retención de CO₂</span> y obliga a UCI (${p(20)}; Fig. 23.3, ${p(21)}). El caso sigue en la ficha de la exacerbación aguda.` + enFicha(AG, 'nep-paco2-42') } },
        ],
        lleva: [
          'La clínica no mide la obstrucción: el PEFR sí (<40 % grave; hipercapnia solo <25 %).' + enFicha(BA, 'nep-pefr'),
          'Al pulmón llega el 9-20 % de lo que se da: el espaciador dobla el depósito del MDI, y la dosis inhalada difiere 4 veces, no 7.' + enFicha(BA, 'nep-tabla-23-1'),
          'Con la ventilación minuto alta, una PaCO₂ de 42 es retención de CO₂ y manda a la UCI.' + enFicha(AG, 'nep-paco2-42')],
        volver: { nombre: 'La Tabla 23.1: dónde acaba el albuterol', ancla: 'nep-tabla-23-1' } },
    ],
  },
  ...MAYEUTICA_ASMA_AGUDO,
};
