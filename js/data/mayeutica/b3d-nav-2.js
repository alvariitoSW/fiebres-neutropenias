// Mayéutica del bloque 3D, G5: ficha 19 neumo-derrame-antimicrobiano (Marino cap. 29, págs. 45-49 del PDF) y el caso de
// Casimiro (días 6-13). Formato: cabecera de b1-fluidos.js. Plan: autonomo/bloques/b3/estudio-3d/. El derrame lo enseña el
// estado `derrame-paraneumonico` del pulmón vivo (dea-g3 y dea-g6 lo abren); la antibioterapia no tiene modelo: el paso «Mira» es la vista Visual.
// Páginas comprobadas con pdftotext en docs/marino-2024-respiratory-management-caps27-30.pdf: frecuencia del derrame y
// Tabla 29.5, 45; categorías, tubo, antibióticos del derrame y drenaje ineficaz, 46; factores, regímenes, Tabla 29.6 y
// cultivos negativos, 47; neumonía documentada (7 días) y mortalidad, 48. Los datos «(del caso)» son de un paciente inventado.
const PDF = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const DER = 'neumo-derrame-antimicrobiano';
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const pl = (clave, texto) => ({ pulmonVivo: clave, texto });
const CASO = 'ficha: la regla de cada paso; las cifras del paciente, inventadas';

const DATOS = {
  [DER]: {
    entrada: 'El derrame paraneumónico se clasifica en 4 categorías por tamaño, pH, glucosa y Gram, y de la 3 en adelante se drena con tubo fino; el antibiótico de la NAV lo deciden 5 factores de riesgo, dura 7 días y se para si los cultivos son negativos.',
    guia: [
      { id: 'dea-g1', corto: 'frecuencia y eco', tipo: 'test', fuente: 'nep-derrame-frecuencia',
        enunciado: 'Un paciente hospitalizado con neumonía. Antes de leer: ¿en qué proporción hay derrame pleural, y qué prueba se recomienda para localizarlo si hay que pinchar?',
        opciones: [
          no('En el 2-4 %; basta la radiografía de tórax para localizarlo', `El derrame está en el 20-40 % de las neumonías hospitalizadas; la radiografía puede mostrarlo, pero la ficha recomienda la ecografía para su localización y tamaño (${p(45)}). Con una cifra tan baja no lo buscarías en cada neumonía ventilada.`),
          ok('En el 20-40 %; la ecografía define localización y tamaño'),
          no('En el 60-80 %; se localiza con una TC antes de cada toracocentesis', `La cifra de la ficha es 20-40 % y para localizar recomienda la ecografía, sobre todo si se hace toracocentesis (${p(45)}); pedir una TC en cada caso llevaría al paciente a un traslado que la ficha no pide.`)],
        explicacion: `Los derrames están presentes en el <span class="hl-azul">20-40 %</span> de las neumonías de pacientes hospitalizados; pueden verse en la radiografía, pero se recomienda la ecografía para definir localización y tamaño (${p(45)}).` + enFicha(DER, 'nep-derrame-frecuencia') },
      { id: 'dea-g2', corto: 'las 4 categorías', tipo: 'destapa', cuantas: 'son cuatro categorías', fuente: 'nep-derrame-tabla · nep-derrame-categorias',
        enunciado: 'Sin mirar la Tabla 29.5: ¿cuáles son las 4 categorías del derrame paraneumónico y qué las separa?',
        puntos: [
          `<span class="hl-verde">Categoría 1</span>: menos de 10 mm, de flujo libre. No hace falta toracocentesis ni tubo (${p(45)}).`,
          `<span class="hl">Categoría 2</span>: más de 10 mm pero menos de la mitad del hemitórax, de flujo libre; pH >7,20, glucosa >60 mg/dL, Gram y cultivo negativos. Toracocentesis, sin tubo (${p(45)}-${p(46)}).`,
          `<span class="hl-rojo">Categoría 3</span>: loculado, o más de la mitad del hemitórax; pH <7,20, glucosa <60 mg/dL, Gram o cultivo positivos. Tubo torácico (${p(45)}).`,
          `<span class="hl-rojo">Categoría 4</span>: purulento, con el análisis de la categoría 3. Tubo torácico (${p(45)}).`],
        explicacion: `La gravedad crece de la 1 a la 4; lo que separa la 2 de la 3 es la infección del líquido (pH, glucosa, Gram o cultivo) junto con la loculación o el tamaño (${p(45)}).` + enFicha(DER, 'nep-derrame-tabla') },
      { id: 'dea-g3', corto: 'categoría 2', tipo: 'test', fuente: 'nep-derrame-cat2', origen: 'ficha: la categoría 2; las cifras del enunciado, ilustrativas',
        modeloVivo: pl('derrame-paraneumonico', '🫁 Compruébalo con el líquido de Alonso: cambia el pH, la glucosa y el Gram y mira cuándo sale «tubo»'),
        enunciado: 'Un derrame libre de 20 mm que ocupa un tercio del hemitórax; el análisis da pH 7,32, glucosa 90 mg/dL y Gram y cultivo negativos. ¿Qué haces, y qué límite advierte la ficha?',
        opciones: [
          no('Tubo de 8,5-14 Fr desde el principio, porque pasa de 10 mm', `El tubo es de las categorías 3 y 4; en la 2 no hay infección y no se necesita otra intervención (${p(46)}). Pondrías un tubo a un derrame que no lo precisa.`),
          ok('Toracocentesis con el máximo de líquido; algunos paran en −20 cmH₂O de presión pleural'),
          no('Solo vigilar con una nueva ecografía mañana, como en los derrames de menos de 10 mm', `Eso es la categoría 1; en la 2 se aconseja toracocentesis (${p(46)}). Sin pinchar no tendrías el análisis del líquido que descarta la infección.`)],
        explicacion: `Categoría 2: toracocentesis y retirar la mayor cantidad posible de líquido. Algunos miden la presión pleural con un manómetro y paran si llega a <span class="hl-rojo">−20 cmH₂O</span>, para prevenir un edema pulmonar por presión negativa (${p(46)}).` + enFicha(DER, 'nep-derrame-cat2') },
      { id: 'dea-g4', corto: 'tubo en el empiema', tipo: 'test', fuente: 'nep-derrame-cat4',
        enunciado: 'El líquido de un derrame sale francamente purulento. Antes de leer: ¿qué calibre de tubo elige la ficha para drenar el pus?',
        opciones: [
          no('Uno grande, de 28-36 Fr, porque el pus espeso no pasa por un tubo fino', `Algunos lo prefieren, pero la ficha dice que los tubos pequeños (8,5-14 Fr) logran un drenaje equivalente (${p(46)}); con el grande el paciente asumiría un tubo mayor sin ganar drenaje.`),
          ok('Uno de calibre pequeño, de 8,5-14 Fr: drena igual que el de 28-36 Fr'),
          no('Ninguno por ahora: se espera al cultivo mientras los antibióticos reabsorben el pus', `La categoría 4 pide drenaje pleural inmediato (${p(46)}); esperar deja el empiema sin drenar.`)],
        explicacion: `Categoría 4 = empiema: <span class="hl-rojo">drenaje inmediato</span>. Algunos prefieren tubos de 28-36 Fr, pero los de 8,5-14 Fr logran un drenaje equivalente (${p(46)}).` + enFicha(DER, 'nep-derrame-cat4') },
      { id: 'dea-g5', corto: 'antibiótico del derrame', tipo: 'test', fuente: 'nep-derrame-atb',
        enunciado: 'Derrame paraneumónico infectado en un paciente hospitalizado, ya con el tubo. ¿Qué debe cubrir el antibiótico empírico, y con qué régimen?',
        opciones: [
          no('Neumococo y anaerobios de la boca, con amoxicilina-clavulánico por vía intravenosa', `Es una pauta pensada para otro ámbito: en el hospitalizado la ficha pide cubrir MRSA y gramnegativos con Pseudomonas (${p(46)}), y esa pauta dejaría la Pseudomonas sin cubrir.`),
          ok('MRSA y gramnegativos con Pseudomonas: vancomicina más cefepima o piperacilina-tazobactam'),
          no('Solo gramnegativos con Pseudomonas, con cefepima sola', `Sin vancomicina quedaría sin cubrir el MRSA, que la ficha incluye entre lo que debe cubrir el antibiótico del derrame (${p(46)}).`)],
        explicacion: `El drenaje se combina con antibioterapia empírica; en el hospitalizado cubre <span class="hl-azul">MRSA y entéricos gramnegativos, incluida Pseudomonas</span>: vancomicina más cefepima o piperacilina-tazobactam (${p(46)}).` + enFicha(DER, 'nep-derrame-atb') },
      { id: 'dea-g6', corto: 'drenaje ineficaz', tipo: 'test', fuente: 'nep-derrame-drenaje',
        modeloVivo: pl('derrame-paraneumonico', '🫁 Pon el tubo en el loculado de Alonso y deja pasar las horas'),
        enunciado: 'Un derrame loculado drena mal por el primer tubo. Antes de leer: ¿qué sigue, y qué se descarta?',
        opciones: [
          no('Fibrinolíticos por el tubo desde el primer momento, para romper las loculaciones', `La ficha no los aconseja en general en el derrame complicado ni en el empiema (${p(46)}); los usarías donde la guía no los respalda.`),
          ok('Un segundo tubo, mejor con guía de TC; después, consulta de cirugía'),
          no('Retirar el tubo y hacer toracocentesis repetidas, porque está loculado', `En los derrames complicados el drenaje pleural es obligado (${p(46)}); sin tubo, las loculaciones infectadas seguirían sin vaciarse.`)],
        explicacion: `Si el drenaje con el primer tubo no basta, se coloca <span class="hl-azul">otro tubo, preferiblemente guiado por TC</span>; si persisten los problemas, consulta quirúrgica. Los fibrinolíticos intrapleurales no se aconsejan en general (${p(46)}).` + enFicha(DER, 'nep-derrame-drenaje') },
      { id: 'dea-g7', corto: 'un solo factor basta', tipo: 'test', fuente: 'nep-atb-factores', origen: 'ficha; los datos del paciente, inventados',
        enunciado: 'NAV de inicio precoz, sin shock séptico, en un paciente que recibió antibióticos hace 60 días por una infección urinaria. ¿Qué régimen empírico lleva?',
        opciones: [
          no('El de bajo riesgo: la NAV es precoz y no hay shock, y una infección urinaria antigua no cuenta', `La exposición a antibióticos en los últimos 90 días es un factor de riesgo por sí sola (${p(47)}); tratarías con un solo agente a un paciente de alto riesgo.`),
          ok('El de alto riesgo: haber recibido antibióticos en los últimos 90 días es un factor, y con uno basta'),
          no('El de alto riesgo solo si además hay shock séptico, porque los demás factores no cambian la pauta', `El régimen de bajo riesgo es solo para la NAV precoz «without septic shock or any of the other risk factors» (sin shock séptico ni ningún otro factor de riesgo): cada factor, sin necesidad de shock, lleva al régimen de alto riesgo (${p(47)}); sin cobertura de MRSA podrías dejar sin tratar el germen resistente.`)],
        explicacion: `Los cinco factores (inicio tardío, shock séptico, MRSA o multirresistente previo, antibiograma con el 25 % de resistentes y antibióticos en los últimos 90 días) cuentan <span class="hl-rojo">cada uno por separado</span>: con uno basta para el régimen de alto riesgo (${p(47)}).` + enFicha(DER, 'nep-atb-factores') },
      { id: 'dea-g8', corto: 'bajo riesgo', tipo: 'test', fuente: 'nep-atb-bajo', origen: 'ficha; la toxicidad del aminoglucósido, fisiología general',
        enunciado: 'NAV de inicio precoz, sin shock séptico ni ningún otro factor de riesgo. ¿Qué régimen empírico lleva?',
        opciones: [
          no('Vancomicina más meropenem, para cubrir el MRSA desde el primer día de tratamiento', `Es el esquema del alto riesgo (${p(47)}); sin factores sumarías antibióticos que la ficha no pide.`),
          ok('Un solo agente: cefepima, levofloxacino o piperacilina-tazobactam'),
          no('Cefepima más un aminoglucósido, para reforzar a la Pseudomonas', `El agente no β-lactámico se añade solo si hay alto riesgo de multirresistentes (${p(47)}); sin ese riesgo el paciente recibiría un segundo antibiótico, con la toxicidad propia de un aminoglucósido, sin indicación.`)],
        explicacion: `Bajo riesgo = <span class="hl-verde">un único agente</span> que cubra MSSA, entéricos gramnegativos y Pseudomonas: cefepima, levofloxacino o piperacilina-tazobactam (${p(47)}).` + enFicha(DER, 'nep-atb-bajo') },
      { id: 'dea-g9', corto: 'nota de alto riesgo', tipo: 'error', fuente: 'nep-atb-alto · nep-atb-tabla', origen: 'ficha: Tabla 29.6',
        enunciado: 'Nota de un residente para un paciente de alto riesgo. Hay un error. Encuéntralo.',
        frases: [
          { t: 'Cubro MRSA con vancomicina o linezolid.' },
          { t: 'El linezolid cubre el MRSA igual que la vancomicina, según la tabla.' },
          { t: 'Para gramnegativos y Pseudomonas con un β-lactámico: piperacilina-tazobactam, cefepima o meropenem.' },
          { t: 'El aminoglucósido del grupo C va de entrada en todo paciente de alto riesgo.', mal: true, c: `El régimen C se incluye solo si hay alto riesgo de organismos multirresistentes (${p(47)}).` }],
        explicacion: 'Un error: el grupo C no es para todo el alto riesgo (el linezolid sí cubre MRSA en la tabla).',
        nota: `<strong>Nota de fidelidad.</strong> La prosa del alto riesgo llama «β-lactámico» al levofloxacino, pero la Tabla 29.6 lo pone en el grupo C (no β-lactámico). La discrepancia está en la propia fuente; se reproduce tal cual y no es un error del residente (${p(47)}).` + enFicha(DER, 'nep-atb-tabla') },
      { id: 'dea-g10', corto: 'cultivos negativos', tipo: 'test', fuente: 'nep-atb-cultivos',
        enunciado: 'Una sospecha de NAV tratada con antibióticos empíricos: todos los cultivos salen negativos y el paciente va mejorando. ¿Qué dice la ficha?',
        opciones: [
          no('Seguir con el régimen, porque la mejoría demuestra que funciona', `La ficha reconoce esa tendencia y dice que no está justificada (${p(47)}); el paciente seguiría con antibióticos sin una infección que los requiera.`),
          ok('Suspenderlos: la mejoría no justifica seguir con cultivos negativos'),
          no('Pasar a un fármaco de espectro más estrecho y mantenerlo hasta el alta', `Con los cultivos negativos la ficha pide discontinuar, no estrechar (${p(47)}); mantener un antibiótico más corto seguiría siendo tratamiento de más.`)],
        explicacion: `Hay una tendencia a continuar el empírico pese a cultivos negativos si el paciente mejora, pero <span class="hl-rojo">no está justificada</span>: se discontinúan si todos los cultivos son negativos (${p(47)}).` + enFicha(DER, 'nep-atb-cultivos') },
      { id: 'dea-g11', corto: 'NAV documentada', tipo: 'test', fuente: 'nep-atb-documentada',
        enunciado: 'La NAV ya está documentada: se aisló el patógeno. ¿Qué decide el antibiótico?',
        opciones: [
          no('El régimen empírico del primer día, que se mantiene como empezó', `La ficha dice que lo dictan las sensibilidades del aislado (${p(48)}); mantener el régimen amplio sin mirarlas sobretrataría al paciente.`),
          ok('Las sensibilidades (antibiograma) del patógeno aislado en el paciente'),
          no('La gravedad del paciente en cada guardia, ajustada a la fiebre del día', `La ficha no liga la elección a la fiebre diaria sino al antibiograma (${p(48)}); guiarte por la fiebre podría dejarte con un fármaco al que el germen es resistente.`)],
        explicacion: `En la NAV documentada, el antibiótico <span class="hl-azul">lo dictan las sensibilidades</span> del o los patógenos aislados (${p(48)}).` + enFicha(DER, 'nep-atb-documentada') },
      { id: 'dea-g12', corto: 'mortalidad de la NAV', tipo: 'test', fuente: 'nep-atb-mortalidad',
        enunciado: 'Varios estudios hallan que la NAV apenas cambia la mortalidad. Marino propone tres explicaciones. ¿Cuál elige, y por qué?',
        opciones: [
          no('Que la tratamos tan bien que no mata', `Es la primera opción y Marino no la elige: tras recordar que los criterios diagnósticos no son específicos, se queda con el sobrediagnóstico (${p(48)}).`),
          ok('Que está sobrediagnosticada, dada la poca especificidad de sus criterios'),
          no('Que no es una infección que amenace la vida, y por eso no se trata con urgencia', `Marino no la elige y pide antibióticos pronto en toda sospecha de NAV (${p(46)}); demorarlos le costaría tiempo a un paciente con una infección real.`)],
        explicacion: `Las tres explicaciones son: la tratamos muy bien, no es grave o está sobrediagnosticada. Con la falta de especificidad de las Tablas 29.3 y 29.4, <span class="hl-purpura">la tercera es la más apropiada</span>, a juicio de Marino (opinión del autor, ${p(48)}).` + enFicha(DER, 'nep-atb-mortalidad') },
    ],
    examen: [
      { id: 'dea-e1', corto: 'pH y glucosa', tipo: 'test', fuente: 'nep-derrame-tabla',
        enunciado: 'Un derrame loculado, ¿con qué pH y glucosa del líquido se considera categoría 3?',
        opciones: [
          no('pH <7,30 y glucosa <90 mg/dL', `Esos cortes no son los de la tabla; con pH 7,25 y glucosa 80 darías por infectado un líquido que la ficha trata como no infectado (${p(45)}).`),
          ok('pH <7,20 y glucosa <60 mg/dL, con Gram o cultivo positivos'),
          no('pH >7,20 y glucosa >60 mg/dL, con Gram y cultivo negativos', `Eso describe la categoría 2, sin evidencia de infección (${p(45)}-${p(46)}); con esos datos no hay indicación de tubo.`)],
        explicacion: `Categoría 3: loculado o >50 % del hemitórax con <span class="hl-rojo">pH <7,20, glucosa <60 mg/dL</span> y Gram o cultivo positivos (${p(45)}-${p(46)}).` + enFicha(DER, 'nep-derrame-tabla') },
      { id: 'dea-e2', corto: 'presión pleural', tipo: 'test', fuente: 'nep-derrame-cat2',
        enunciado: 'Al drenar un derrame de categoría 2 con manómetro, ¿a qué presión pleural algunos paran, y qué previenen?',
        opciones: [
          no('−40 cmH₂O, para prevenir un edema pulmonar por presión negativa', `La cifra de la ficha es −20; parar en −40 sería llegar tarde a una presión pleural que ya habría podido causar el edema (${p(46)}).`),
          no('−20 cmH₂O, para prevenir un neumotórax iatrogénico', `La cifra es −20, pero lo que previene es el edema pulmonar por presión negativa, no un neumotórax (${p(46)}).`),
          ok('−20 cmH₂O, para prevenir un edema pulmonar por presión negativa')],
        explicacion: `Algunos miden la presión pleural durante el drenaje y lo detienen si llega a <span class="hl-rojo">−20 cmH₂O</span> para prevenir un edema pulmonar por presión negativa (${p(46)}).` + enFicha(DER, 'nep-derrame-cat2') },
      { id: 'dea-e3', corto: 'antibiograma', tipo: 'test', fuente: 'nep-atb-factores',
        enunciado: 'Un hospital cuyo antibiograma tiene resistentes a una parte de los aislados. ¿A partir de qué proporción cuenta como factor de riesgo?',
        opciones: [
          no('Con el 10 % de aislados resistentes', `Es un corte más bajo que el de la ficha, 25 % (${p(47)}); con él la mayoría de tus pacientes serían de alto riesgo y recibirían vancomicina y un carbapenem de más.`),
          ok('Con el 25 % de aislados resistentes'),
          no('Con el 50 % de aislados resistentes', `Es un corte más alto que el de la ficha (${p(47)}); con él tratarías como de bajo riesgo a pacientes que ya lo son de alto.`)],
        explicacion: `El factor (d) es un antibiograma hospitalario en el que el <span class="hl-rojo">25 %</span> de los aislados son resistentes (${p(47)}).` + enFicha(DER, 'nep-atb-factores') },
      { id: 'dea-e4', corto: 'duración', tipo: 'test', fuente: 'nep-atb-documentada',
        enunciado: '¿Qué duración recomienda la ficha para el antibiótico de una NAV documentada?',
        opciones: [
          no('14 días, para asegurar la erradicación', `La ficha recomienda 7 días (${p(48)}); duplicar el tiempo expondría al paciente a más antibiótico sin base en la fuente.`),
          ok('7 días, con el patógeno documentado'),
          no('3 días, hasta que baje la fiebre', `La duración recomendada es 7 días (${p(48)}); suspender en 3 dejaría la neumonía documentada con un tratamiento más corto que el recomendado.`)],
        explicacion: `La duración recomendada de la antibioterapia es de <span class="hl-azul">7 días</span> (${p(48)}).` + enFicha(DER, 'nep-atb-documentada') },
      { id: 'dea-e5', corto: 'fibrinolíticos', tipo: 'test', fuente: 'nep-derrame-drenaje',
        enunciado: 'Derrame paraneumónico complicado o empiema: ¿qué dice la ficha de los fibrinolíticos intrapleurales?',
        opciones: [
          no('Se usan de rutina en la categoría 3, por el tubo, para romper las loculaciones', `Es lo contrario de lo que dice la ficha (${p(46)}); los usarías sin respaldo en la guía que cita.`),
          ok('No se aconsejan en general en el derrame complicado ni en el empiema'),
          no('Se reservan a la categoría 2, durante la toracocentesis', `La categoría 2 no necesita otra intervención tras la toracocentesis (${p(46)}); no son su indicación.`)],
        explicacion: `La administración intrapleural de fibrinolíticos <span class="hl-rojo">no se aconseja en general</span> para el derrame paraneumónico complicado y el empiema (${p(46)}).` + enFicha(DER, 'nep-derrame-drenaje') },
      { id: 'dea-e6', corto: 'levofloxacino', tipo: 'test', fuente: 'nep-atb-alto · nep-atb-tabla', origen: 'ficha: la prosa y la Tabla 29.6',
        enunciado: 'La prosa del alto riesgo llama β-lactámico al levofloxacino y la Tabla 29.6 lo pone en el grupo C. ¿Cómo lo lees?',
        opciones: [
          no('Como un error del libro, y se saca el levofloxacino de las pautas de la ficha, incluida la de bajo riesgo', `La ficha mantiene el levofloxacino como candidato del bajo riesgo (${p(47)}); descartarlo te quitaría una opción válida y trataría una discrepancia anotada como si fuera un fallo.`),
          ok('Como una discrepancia entre prosa y tabla: es una fluorquinolona y la tabla lo pone en el grupo C'),
          no('Con la prosa: el levofloxacino sirve de β-lactámico del grupo B', `La tabla lo clasifica en el grupo C (${p(47)}); sustituir el grupo B por una fluorquinolona cambiaría la pauta del paciente.`)],
        explicacion: `Prosa y tabla discrepan dentro de la misma fuente; se reproducen tal cual y la clasificación de la <span class="hl-azul">Tabla 29.6</span> lo coloca en el grupo C (${p(47)}).`,
        nota: `<strong>Nota de fidelidad.</strong> No es un error del residente ni una corrección: es lo que imprime el libro (${p(47)}).` + enFicha(DER, 'nep-atb-alto') },
    ],
    casos: [
      { id: 'c-dea-casimiro', titulo: 'Casimiro, 68 años: del derrame a los 7 días', corto: 'Caso · Casimiro (derrame y antibióticos)', sub: 'Neurocrítico con NAV tardía, shock y un derrame loculado',
        paciente: { Edad: '68 años, varón', Peso: '75 kg', Antecedentes: 'neurocrítico en ventilación mecánica; amoxicilina-clavulánico hace 2 meses', Motivo: 'Día 6 de ventilación: sospecha de NAV (del caso)' },
        pasos: [
          { momento: 'Día 6 · el régimen', datos: { Cuadro: 'fiebre, secreciones purulentas, infiltrado basal derecho', BAL: 'positivo', Hemodinámica: 'noradrenalina (shock séptico)', 'Antibiótico previo': 'hace 2 meses' }, nuevo: ['Cuadro', 'BAL', 'Hemodinámica', 'Antibiótico previo'],
            pregunta: { id: 'dea-c1', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-atb-factores · nep-atb-alto · nep-atb-tabla', origen: CASO,
              enunciado: 'Casimiro, día 6 de ventilación, con BAL positivo, noradrenalina y un antibiótico hace 2 meses. ¿Cuántos factores de riesgo tiene y qué régimen empírico?',
              puntos: [
                `Tres factores: <span class="hl-rojo">NAV tardía</span> (≥5 días de intubación, ${p(35)}), <span class="hl-rojo">shock séptico</span> y <span class="hl-rojo">antibióticos en los últimos 90 días</span> (${p(47)}).`,
                `Alto riesgo: <span class="hl-azul">vancomicina</span> (o linezolid) para MRSA más un β-lactámico antipseudomonal, p. ej. meropenem (Tabla 29.6, ${p(47)}).`,
                `El grupo C (fluorquinolona o aminoglucósido) solo si hay alto riesgo de multirresistentes; no se añade por rutina (${p(47)}).`],
              explicacion: `Un solo factor ya excluye el bajo riesgo; Casimiro suma tres (${p(47)}).` + enFicha(DER, 'nep-atb-factores') } },
          { momento: 'Día 6 · la nota del plan', datos: { Plan: 'redactado por un residente' }, nuevo: ['Plan'],
            pregunta: { id: 'dea-c2', tipo: 'error', fuente: 'nep-atb-factores · nep-atb-alto · nep-atb-documentada', origen: CASO,
              enunciado: 'Plan del residente para Casimiro. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Pauto cefepima sola, porque es su primera neumonía.', mal: true, c: `Tiene tres factores de riesgo; el alto riesgo pide cubrir el MRSA con vancomicina o linezolid y añadir un β-lactámico (${p(47)}).` },
                { t: 'Mantengo el cultivo del BAL pendiente para ajustar el tratamiento.' },
                { t: 'Añado un aminoglucósido solo si sospecho un organismo multirresistente.' },
                { t: 'Si todos los cultivos salen negativos, sigo con el antibiótico igualmente.', mal: true, c: `Con todos los cultivos negativos el tratamiento se suspende (${p(47)}).` }],
              explicacion: 'Dos errores: tratar como bajo riesgo a un paciente con tres factores, y seguir el antibiótico con todos los cultivos negativos.' + enFicha(DER, 'nep-atb-alto') } },
          { momento: 'Día 8 · el derrame', datos: { Derrame: 'loculado, 15 mm en la eco', 'pH pleural': '7,12', Glucosa: '40 mg/dL', Gram: 'bacilos gramnegativos' }, nuevo: ['Derrame', 'pH pleural', 'Glucosa', 'Gram'],
            calculadora: { ir: 'neumo-derrame-grosor', nombre: 'Clasificador de derrame paraneumónico' },
            pregunta: { id: 'dea-c3', tipo: 'test', fuente: 'nep-derrame-tabla · nep-derrame-cat3', origen: CASO,
              enunciado: 'Se punciona el derrame: loculado, 15 mm, pH 7,12, glucosa 40 mg/dL y Gram con bacilos gramnegativos. ¿Qué categoría es y qué tubo?',
              opciones: [
                no('Categoría 2: toracocentesis evacuadora y sin tubo', `El líquido sale infectado (pH <7,20, glucosa <60, Gram positivo) y está loculado: la categoría 2 no tiene infección (${p(46)}). Sin tubo, el derrame infectado seguiría ahí.`),
                ok('Categoría 3: tubo de calibre pequeño, de 8,5-14 Fr'),
                no('Categoría 4: tubo grande de 28-36 Fr, por la infección', `El líquido no es purulento, así que no es categoría 4; y el tubo pequeño drena igual que el grande (${p(46)}). Pondrías un tubo mayor sin ganar drenaje.`)],
              explicacion: `Loculado más pH <7,20, glucosa <60 y Gram positivo = <span class="hl-rojo">categoría 3</span>; se drena con tubos de pequeño calibre, 8,5-14 Fr (${p(46)}).` + enFicha(DER, 'nep-derrame-cat3') } },
          { momento: 'Día 9 · los cultivos', datos: { Aislamiento: 'Pseudomonas aeruginosa en BAL y en el líquido pleural, sensible a cefepima', Hemocultivos: 'negativos' }, nuevo: ['Aislamiento', 'Hemocultivos'],
            pregunta: { id: 'dea-c4', tipo: 'test', fuente: 'nep-atb-documentada · nep-atb-cultivos', origen: CASO,
              enunciado: 'Llegan los cultivos: Pseudomonas aeruginosa sensible a cefepima en el BAL y en el líquido pleural; hemocultivos negativos y sin MRSA aislado. Casimiro lleva vancomicina más meropenem. ¿Qué haces?',
              opciones: [
                no('Mantener vancomicina y meropenem hasta completar los días, por el shock del primer día', `En la NAV documentada el tratamiento lo dictan las sensibilidades del aislado (${p(48)}); seguir cubriendo a ciegas un MRSA que no creció mantendría un fármaco sin diana.`),
                ok('Dirigir el tratamiento con cefepima según el antibiograma y retirar la vancomicina'),
                no('Suspender los antibióticos, porque los hemocultivos son negativos', `Solo se discontinúa si los cultivos son negativos (${p(47)}); aquí el BAL y el líquido pleural crecen Pseudomonas, y el paciente se quedaría sin tratar una infección documentada.`)],
              explicacion: `Con el patógeno aislado, la antibioterapia <span class="hl-azul">la dictan las sensibilidades</span> (${p(48)}); solo se discontinúa si todos los cultivos son negativos (${p(47)}).` + enFicha(DER, 'nep-atb-documentada') } },
          { momento: 'Día 11 · el drenaje', datos: { Tubo: 'segundo tubo guiado por TC, puesto el día 10', Drenaje: 'sigue escaso', Eco: 'loculaciones' }, nuevo: ['Tubo', 'Drenaje', 'Eco'],
            pregunta: { id: 'dea-c5', tipo: 'test', fuente: 'nep-derrame-drenaje', origen: CASO,
              enunciado: 'Con el segundo tubo guiado por TC, el drenaje sigue escaso y la eco muestra loculaciones. ¿Qué sigue?',
              opciones: [
                no('Fibrinolíticos intrapleurales por los dos tubos, para romper las loculaciones', `La ficha no los aconseja en general en el derrame complicado ni en el empiema (${p(46)}); los usarías sin respaldo.`),
                no('Un tercer tubo y esperar otra semana a que drene por sí solo', `La ficha escalona: tubo adicional y, ante nuevos problemas, consulta quirúrgica (${p(46)}); esperar con las loculaciones sin romper alarga la infección.`),
                ok('Consulta quirúrgica para VATS, que rompe adherencias sin toracotomía')],
              explicacion: `Si el drenaje sigue siendo inadecuado tras otro tubo, se pide <span class="hl-azul">VATS</span>, que rompe las adherencias sin toracotomía (${p(46)}).` + enFicha(DER, 'nep-derrame-drenaje') } },
          { momento: 'Día 13 · el final', datos: { Tratamiento: 'antibiótico desde el día 6; cefepima dirigida desde el día 9', Tubo: 'sigue puesto, drena 30 mL/día', Cultivos: 'sin nuevos aislamientos' }, nuevo: ['Tratamiento', 'Tubo', 'Cultivos'],
            pregunta: { id: 'dea-c6', tipo: 'test', fuente: 'nep-atb-documentada', origen: CASO,
              enunciado: 'Día 13, con el tubo aún puesto y drenando 30 mL/día. ¿Qué dice la ficha de la duración del antibiótico y a qué situación se aplica?',
              opciones: [
                no('Da 7 días también para el derrame: se mantiene hasta que el tubo deje de drenar', `Los 7 días son los de la NAV documentada (${p(48)}); la ficha no da duración para el derrame ni la liga a la permanencia del tubo. Aplicarlos al derrame sería atribuirle a la fuente algo que no dice.`),
                ok('Da 7 días para la NAV documentada; para el derrame drenado no da ninguna duración'),
                no('Da más de 7 días para la Pseudomonas, porque es un germen difícil', `La ficha no da una duración mayor para la Pseudomonas; recomienda 7 días para la NAV documentada (${p(48)}). Alargarlo sin base en la fuente sumaría antibiótico de más.`)],
              explicacion: `La duración recomendada de la antibioterapia es de <span class="hl-azul">7 días</span> para la NAV documentada (${p(48)}); del derrame drenado no dice nada.`,
              nota: `<strong>La fuente no lo dice.</strong> Marino no da una duración para el antibiótico cuando hay un derrame drenado, ni cuándo retirar el tubo. Mantenerlo mientras el tubo drene puede defenderse clínicamente, pero no sale de la ficha (${p(48)}).` + enFicha(DER, 'nep-atb-documentada') } },
        ],
        lleva: [
          'El derrame paraneumónico se clasifica en 4 categorías; la 3 y la 4 se drenan con tubo, y el fino drena igual que el grueso.' + enFicha(DER, 'nep-derrame-tabla'),
          'Los 5 factores de riesgo deciden el régimen empírico; el dirigido lo dictan las sensibilidades.' + enFicha(DER, 'nep-atb-factores'),
          'La NAV documentada se trata 7 días, y con todos los cultivos negativos se suspende.' + enFicha(DER, 'nep-atb-cultivos')],
        volver: { nombre: 'La Tabla 29.6', ancla: 'nep-atb-tabla' } },
    ],
    profundizar: [
      { id: 'nep-derrame-cat1', titulo: 'Categoría 1: cuándo se pincha un derrame pequeño' },
    ],
  },
};

// Reparte la posición de la buena en el orden de escritura (las opciones se barajan solas al pintarlas).
const colocar = (d, pat) => {
  const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(s => s.pregunta))].filter(q => q.tipo === 'test');
  qs.forEach((q, i) => { const j = q.opciones.findIndex(o => o.ok); const [o] = q.opciones.splice(j, 1); q.opciones.splice(pat[i % pat.length], 0, o); });
  return d;
};
colocar(DATOS[DER], [1, 2, 0, 1, 0, 2, 1, 0, 2, 0, 1, 2]);
export const MAYEUTICA_NAV_2 = DATOS;
