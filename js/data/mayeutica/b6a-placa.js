// Mayéutica del grupo 6C · La placa motora (Marino cap. 46, 2.ª mitad): miastenia gravis, Guillain-Barré con
// polineuropatía y miopatía del crítico, y relajantes con su reversión. La pinta js/core/mayeutica.js. Datos puros.
// Formato: el de js/data/mayeutica/b1-fluidos.js (cabecera).
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-neuro.html) y de su PDF
// (docs/marino-2024-neurologia-caps45-47.pdf, págs. 24-31); cada pregunta dice dónde con `fuente` y con la página.
// Los pacientes de los casos son inventados; sus cifras (FC, PA, CV, PIM, K⁺…) son del paciente, no de la fuente.
//
// «Compruébalo» abre la placa viva en el paciente y el paso de `modelo: { placaViva: 'paciente:paso' }`; donde la cuenta importa se deja
// también la calculadora de la ficha (`calculadora`). Pasos de la hendidura (para la sesión de los modelos): 1 llega el impulso,
// 2 salen las vesículas y 5 el músculo se relaja = `fisiología general` (Marino no los describe); 3 el
// ligando (ACh o relajante) se une al receptor = p. 29; 4 la acetilcolinesterasa rompe la ACh = p. 30-31.
const PDF = 'docs/marino-2024-neurologia-caps45-47.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoNeuro" data-panel="panel-marino-neuro-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const rv = (clave, texto) => ({ ritmoVivo: clave, texto });
const capSepsis = texto => ({ capilarVivo: 'sepsis', texto });
const C_MG = { ir: 'mn-mg-calc', nombre: 'Debilidad neuromuscular: ¿pensar en intubar?' };
const C_FARM = { ir: 'mn-mg-farmaco-calc', nombre: '¿Puede empeorar la miastenia?' };
const C_GBS = { ir: 'mn-gbsmg-calc', nombre: '¿Guillain-Barré o miastenia?' };
const C_BNM = { ir: 'mn-bnm-calc', nombre: 'Dosis de relajantes y de reversión' };
const NOTA_PIM = '<b>Nota de fidelidad.</b> El libro escribe «normal being &gt;–100 cm H2O» (' + pag(25) + '); leído al pie de la letra, el −20 también sería «&gt;−100». Se reproduce tal cual; la lectura habitual (más negativa de −100) es conocimiento general, no de la fuente. Además, el libro une CV y PIM con «y», y la calculadora de la app avisa si se cumple cualquiera de los dos.';
const NOTA_ROC = '<b>Las fuentes discrepan.</b> La Tabla 46.7 (' + pag(29) + ') da 50-70 min de duración del rocuronio y el texto (' + pag(30) + '), 30-70 min («unos 60» al hablar de intubar). Se muestran las dos; no se elige ganadora.';
const NOTA_NEO = '<b>Nota de fuentes.</b> El libro no da tope en mg: Marino da 70 µg/kg «nunca más» (' + pag(31) + '). El tope total de 5 mg es de la ficha técnica de la FDA (<a class="biblio-link" href="https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/204078Orig1s014lbl.pdf" target="_blank" rel="noopener">ficha técnica</a>), no del libro; la calculadora aplica los dos.';

export const MAYEUTICA_B6A_PLACA = {
  /* =================================================================================================
     8 · Miastenia gravis (págs. 24-26)
     ================================================================================================= */
  'mn-miastenia': {
    entrada: 'Por qué la fuerza cae con el uso y vuelve con el reposo, qué músculos van primero, qué fármacos empeoran la placa, cuándo intubar y cómo se trata la crisis.',
    guia: [
      { id: 'mnm-g1', modelo: { placaViva: 'sera:2' }, corto: 'fatiga', tipo: 'test', fuente: 'mn-mg-definicion · mn-mg-clinica',
        enunciado: 'Serapio, de 35 años, ve doble por la tarde y por la mañana no. Antes de mirar la ficha: ¿qué explica que la debilidad empeore con el uso y mejore con el reposo?',
        opciones: [
          { t: 'Hay menos receptores de ACh en la placa', ok: true },
          { t: 'El nervio conduce cada vez más lento al cansarse', porque: 'Eso sería desmielinización (Guillain-Barré): conducción enlentecida y sin fatiga (Tabla 46.6). Si lo piensas aquí, pedirías neurofisiología y retrasarías vigilar la capacidad vital de un miasténico.' },
          { t: 'Falta acetilcolina en el terminal del nervio', porque: 'Marino sitúa la lesión en el receptor postsináptico (anticuerpos que lo destruyen), no en el terminal (' + pag(24) + '). Con esa idea no entenderías por qué la piridostigmina, que frena la destrucción de ACh, mejora al paciente, y buscarías la lesión en el terminal nervioso, cuando los anticuerpos van contra el receptor.' }],
        explicacion: 'Los anticuerpos destruyen los <span class="hl-azul">receptores de acetilcolina postsinápticos</span>: con menos receptores, la debilidad <span class="hl">empeora con la actividad y mejora con el reposo</span> (' + pag(24) + '). Solo afecta al músculo esquelético.' },
      { id: 'mnm-g2', corto: 'ojos primero', tipo: 'test', fuente: 'mn-mg-clinica',
        enunciado: 'Serapio tiene ptosis y diplopía. ¿Qué músculos afecta siempre la miastenia, y qué pasa después?',
        opciones: [
          { t: 'Los respiratorios primero; los ojos se afectan al final', porque: 'Es al revés: el diafragma y la pared torácica se debilitan al progresar (crisis). Si esperas disnea para sospechar miastenia, llegarás a la crisis sin haber vigilado la capacidad vital.' },
          { t: 'Los proximales de las piernas, con los ojos respetados', porque: 'La debilidad de los miembros viene después de los ojos, y en el 15 % ni llega. Buscar solo debilidad en las piernas te haría perder una miastenia ocular.' },
          { t: 'Los oculares siempre; en el 15 % solo ellos', ok: true }],
        explicacion: 'Los músculos oculares (párpados y oculomotores) <span class="hl">se afectan siempre</span>: diplopía y ptosis son los primeros signos. Después suele venir debilidad simétrica de los miembros, pero <span class="hl-rojo">en el 15 % se queda en los ojos</span>; al progresar fallan diafragma y pared torácica (' + pag(24) + ').' },
      { id: 'mnm-g3', modelo: { placaViva: 'sera:3' }, corto: 'prueba del hielo', tipo: 'test', fuente: 'mn-mg-hielo · mar-img-46-1',
        enunciado: 'Hielo sobre el párpado con ptosis, con el ojo cerrado, 2 minutos. ¿Qué cuenta como positivo y qué fiabilidad tiene?',
        opciones: [
          { t: 'Un aumento de la hendidura de 5 mm; sensibilidad del 95 %', porque: 'La fuente no da esas cifras. Con un umbral inventado más alto, dejarías sin diagnosticar a un miasténico con una mejoría real de 2 o 3 mm.' },
          { t: '+2 mm en la hendidura; sensibilidad y especificidad del 80 %', ok: true },
          { t: 'Cualquier cambio visible; sensibilidad y especificidad del 100 %', porque: 'La prueba falla en 1 de cada 5 casos en los dos sentidos. Fiarte de ella como definitiva te llevaría a descartar la miastenia con un hielo negativo, sin pedir anticuerpos.' }],
        explicacion: 'Se mide la hendidura palpebral, se aplica el hielo 2 min y se vuelve a medir: <span class="hl">+2 mm es positivo</span>, con sensibilidad y especificidad del <span class="hl-rojo">80 %</span> (' + pag(25) + ', Figura 46.1 en la misma página).',
        nota: '<b>La fuente no lo dice.</b> Marino solo escribe que el frío «mejora la transmisión neuromuscular»; su mecanismo íntimo no lo da el libro.' },
      { id: 'mnm-g4', corto: 'anti-AChR negativo', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-mg-anticuerpos',
        enunciado: 'Los anticuerpos anti-receptor de acetilcolina salen negativos. ¿Descartas la miastenia?',
        puntos: [
          'No: <span class="hl-rojo">el 10-15 % no tiene anti-AChR</span> (seronegativos).',
          'Pide <span class="hl">anti-MuSK</span> (cinasa específica del músculo): está presente en un <span class="hl">40 %</span> de esos seronegativos.'],
        explicacion: 'Los anticuerpos contra el receptor confirman el diagnóstico, pero su ausencia no lo descarta (' + pag(25) + ').' },
      { id: 'mnm-g5', modelo: { placaViva: 'sera' }, corto: 'piridostigmina', tipo: 'test', fuente: 'mn-mg-piridostigmina',
        enunciado: 'Serapio toma piridostigmina, que le va bien. ¿Por qué no se usa en el fracaso respiratorio?',
        opciones: [
          { t: 'Porque no llega a la placa y no inhibe la acetilcolinesterasa', porque: 'Sí actúa: es un inhibidor de la acetilcolinesterasa y se usa en la miastenia leve-moderada. Pensar que no funciona te haría retirarla a quien la necesita sin motivo.' },
          { t: 'Aumenta las secreciones (efecto colinérgico)', ok: true },
          { t: 'Porque produce hiperpotasemia', porque: 'La hiperpotasemia es de la succinilcolina (Tabla 46.7), no de la piridostigmina. Ese error te haría pedir potasios inútiles y no prever el moco que sí acumulará un paciente con la vía aérea comprometida.' }],
        explicacion: 'Es un inhibidor de la acetilcolinesterasa para la miastenia leve-moderada; no se usa en el fracaso respiratorio <span class="hl-rojo">porque aumenta las secreciones</span> (efecto colinérgico) (' + pag(26) + ').' },
      { id: 'mnm-g6', corto: 'plasmaféresis o IgIV', tipo: 'test', fuente: 'mn-mg-crisis',
        enunciado: 'En la crisis, IgIV y plasmaféresis responden en un 70 %. ¿Por qué se prefiere la plasmaféresis?',
        opciones: [
          { t: 'Responde antes: tras la 2.ª sesión (IgIV: 4-5 días)', ok: true },
          { t: 'Porque es más eficaz: responde el 90 %', porque: 'Marino las da por igual de eficaces (70 %). Con esa idea elegirías la técnica por una ventaja que no existe y no preguntarías por la disponibilidad.' },
          { t: 'Porque la IgIV está contraindicada con piridostigmina', porque: 'La ficha no lo dice; descartarías la IgIV cuando no hay plasmaféresis, y son igual de eficaces (' + pag(26) + ').' }],
        explicacion: 'Dos opciones <span class="hl">igual de eficaces (70 %)</span>; se prefiere la plasmaféresis porque <span class="hl-azul">responde antes</span>: tras la segunda sesión, frente a 4-5 días de la IgIV (' + pag(26) + ').' },
    ],
    examen: [
      { id: 'mnm-e1', corto: 'Tabla 46.5', tipo: 'test', fuente: 'mn-tabla-46-5', calculadora: C_FARM,
        enunciado: 'Serapio tiene fiebre y le van a pautar un fármaco. ¿Cuál de estos NO figura en la Tabla 46.5 de fármacos que pueden empeorar la miastenia?',
        opciones: [
          { t: 'Paracetamol', ok: true },
          { t: 'Magnesio', porque: 'Está en la Tabla 46.5 (' + pag(24) + '): pautarlo sin mirar la tabla es dar un fármaco de los que pueden empeorar la miastenia.' },
          { t: 'Litio', porque: 'Está en la Tabla 46.5 (' + pag(24) + '): mantenerlo sin mirar la tabla es seguir con un fármaco de los que pueden empeorar la miastenia.' },
          { t: 'Procainamida', porque: 'Es un antiarrítmico Ia, grupo de la tabla con quinidina y disopiramida. Usarla en una FA del miasténico es darle un fármaco de la lista.' }],
        explicacion: 'El paracetamol <span class="hl">no figura en la Tabla 46.5</span> (' + pag(24) + '). Eso no es una lista de fármacos seguros: la tabla solo nombra los que pueden empeorar la miastenia (antibióticos, cardiovasculares, relajantes y otros).' },
      { id: 'mnm-e2', corto: 'corticoides en la tabla', tipo: 'test', fuente: 'mn-tabla-46-5 · mn-mg-corticoides',
        enunciado: '¿Qué fármaco de la Tabla 46.5 se usa también para tratar la miastenia?',
        opciones: [
          { t: 'Los anestésicos inhalados', porque: 'Están en la tabla solo como fármacos a evitar. Usarlos «para tratar» dejaría al paciente más débil.' },
          { t: 'Los corticoides a dosis altas', ok: true },
          { t: 'Los calcioantagonistas, para el temblor', porque: 'Están en la tabla como fármacos que empeoran la miastenia y no se emplean para tratarla; darlos con esa idea la agravaría.' }],
        explicacion: 'La tabla lo marca con asterisco: <span class="hl">los corticoides a dosis altas también se usan para tratarla</span> (' + pag(24) + '). Metilprednisolona 2 g/día dos días, con algún éxito pero discutida porque las dosis altas pueden empeorarla (' + pag(26) + ').' },
      { id: 'mnm-e3', corto: '1.050 mL en 70 kg', tipo: 'test', fuente: 'mn-mg-intubacion', calculadora: C_MG,
        enunciado: 'Serapio pesa 70 kg y tiene una CV de 1.050 mL y una PIM de −18 cmH₂O. ¿Cumple criterio para pensar en intubar?',
        opciones: [
          { t: 'No: hacen falta menos de 1 L', porque: 'El criterio es «≤15 mL/kg o <1 L». 1.050 mL son exactamente 15 mL/kg (≤15); descartarlo por no bajar de 1 L es esperar a que esté in extremis (' + pag(25) + ').' },
          { t: 'No: la PaCO₂ aún es normal', porque: 'Marino decide por la CV y la PIM, sin esperar al in extremis (' + pag(25) + '). Esperar a que suba la PaCO₂ retrasa la intubación de un fracaso respiratorio que avanza rápido.' },
          { t: 'Sí: CV 15 mL/kg (≤15) y PIM peor que −20', ok: true }],
        explicacion: 'CV ≤<span class="hl-rojo">15 mL/kg</span> (o <1 L) y PIM de −20 cmH₂O deben hacer pensar seriamente en intubar (' + pag(25) + '): 1.050 mL / 70 kg = 15 mL/kg y la PIM de −18 es peor que −20. «No esperar a que esté in extremis».',
        nota: NOTA_PIM + enFicha('mn-miastenia', 'mn-mg-intubacion') },
      { id: 'mnm-e4', corto: 'BiPAP', tipo: 'test', fuente: 'mn-mg-intubacion',
        enunciado: 'La CV de Serapio ya está en el límite. ¿Cuándo vale la BiPAP en vez de intubar?',
        opciones: [
          { t: 'Siempre, como paso previo a intubar y ganar tiempo', porque: 'Un deterioro que puede ser muy rápido con un soporte que no cubre la debilidad lleva a una intubación urgente peor planificada.' },
          { t: 'Solo si la PaCO₂ es normal', porque: 'La fuente no da ese criterio: Marino decide por la CV y la PIM, sin esperar al in extremis (' + pag(25) + '). Esperar a que la gasometría se altere retrasa la intubación.' },
          { t: 'Solo si se espera mejoría en pocos días, lo que no suele ser el caso', ok: true }],
        explicacion: '<span class="hl-rojo">La BiPAP solo si se espera mejoría en pocos días</span> (lo que no suele ser el caso) (' + pag(25) + ').' },
      { id: 'mnm-e5', corto: 'pauta de la crisis', tipo: 'test', fuente: 'mn-mg-crisis',
        enunciado: '¿Cuál es la pauta de plasmaféresis en la crisis miasténica?',
        opciones: [
          { t: '3 sesiones en 3 días, 3 volúmenes plasmáticos cada una', porque: 'Es una pauta que no está en la fuente. Con menos sesiones de las pautadas, el paciente podría no llegar a la respuesta.' },
          { t: '5 sesiones en 7-10 días, 1-1,5 volúmenes cada una', ok: true },
          { t: '2 g/kg en 2-5 días', porque: 'Es la IgIV (2 g/kg en 2-5 días), no la plasmaféresis. Confundirlas te llevaría a calcular gramos en lugar de pautar sesiones.' }],
        explicacion: 'Plasmaféresis: <span class="hl">5 sesiones en 7-10 días</span>, cada una con 1-1,5 volúmenes plasmáticos; IgIV 2 g/kg en 2-5 días (' + pag(26) + ').' },
      { id: 'mnm-e6', corto: 'timoma', tipo: 'test', fuente: 'mn-mg-desencadenantes',
        enunciado: '¿Qué porcentaje de las miastenias lo causa un timoma?',
        opciones: [
          { t: '15 %', porque: 'Es el porcentaje que se queda solo en los ojos. Con esa cifra pedirías un TC de tórax a quien no lo necesita o lo olvidarías en la crisis.' },
          { t: '10 %', ok: true },
          { t: '15-20 %', porque: 'Es la cifra de las crisis miasténicas. Mezclarlas lleva a asociar el timoma con la gravedad respiratoria, que no es lo que dice el libro.' }],
        explicacion: 'Un timoma causa el <span class="hl">10 %</span> (' + pag(24) + '). El 15 % es la miastenia solo ocular y el 15-20 %, la crisis (' + pag(24) + ').' },
      { id: 'mnm-e7', corto: 'plan de la crisis', tipo: 'error', fuente: 'mn-mg-corticoides',
        enunciado: 'Plan que deja un compañero para Serapio en crisis. Léelo despacio: ¿hay algún error?',
        frases: [
          { t: 'Metilprednisolona 2 g/día dos días, aunque discutida.' },
          { t: 'Mejor no darla si ya responde a la plasmaféresis o a la IgIV.' },
          { t: 'Enoxaparina 40 mg/día como profilaxis de TVP.' },
          { t: 'Evaluar la deglución si hay debilidad bulbar y no está intubado.' }],
        explicacion: 'Ninguna es falsa: <span class="hl">las cuatro frases están en la ficha</span> (' + pag(26) + '). Parecen un error porque los corticoides a dosis altas están en la Tabla 46.5; por eso se dan «con algún éxito, pero discutidos».' },
    ],
    casos: [
      { id: 'mnm-c1', titulo: 'Serapio, 35 años: la ptosis de la tarde', corto: 'Caso · Serapio', sub: 'miastenia con neumonía, 70 kg',
        paciente: { Edad: '35 años', Peso: '70 kg', Motivo: 'Ptosis y diplopía que empeoran por la tarde' },
        lleva: [
          'Fatiga con el uso y alivio con el reposo: la placa tiene menos receptores. La Tabla 46.6 la separa del Guillain-Barré.',
          'Antes de prescribir, se lee la Tabla 46.5; y se intuba con CV ≤15 mL/kg (o <1 L) y PIM peor que −20, sin esperar al in extremis.',
          'En la crisis: plasmaféresis o IgIV, retirar piridostigmina (secreciones); un timoma explica el 10 %.'],
        volver: { nombre: '¿Cuándo intubar?', ancla: 'mn-mg-intubacion', modelo: { placaViva: 'sera:1' } },
        pasos: [
          { momento: 'Consulta · día 0', datos: { Exploración: 'ptosis derecha que empeora por la tarde; reflejos conservados', 'Prueba del hielo': 'hendidura de 6 a 9 mm (+3 mm)' }, nuevo: ['Exploración', 'Prueba del hielo'], calculadora: C_GBS,
            pregunta: { id: 'mnm-c1-1', tipo: 'test', fuente: 'mn-mg-hielo · mn-tabla-46-6 · mn-mg-clinica', origen: 'ficha; cifras del paciente: ilustrativo',
              enunciado: 'Ptosis vespertina con reflejos conservados y +3 mm tras el hielo. ¿Qué sugiere?',
              opciones: [
                { t: 'Síndrome de Guillain-Barré, por la debilidad simétrica', porque: 'En el Guillain-Barré los reflejos están disminuidos y no hay debilidad oculomotora. Tratarlo con IgIV sin ver la ptosis dejaría sin vigilar la causa real.' },
                { t: 'Miastenia gravis: fatiga y hielo positivo', ok: true },
                { t: 'Síndrome de Miller Fisher', porque: 'Miller Fisher es la variante del GBS con oftalmoplejía y ataxia (' + pag(27) + '); aquí no hay ataxia y los reflejos se conservan.' }],
              explicacion: 'Debilidad que se fatiga, afectación ocular y reflejos conservados (Tabla 46.6, ' + pag(27) + '); el hielo con +3 mm supera el umbral de <span class="hl">+2 mm</span> (' + pag(24) + ').' } },
          { momento: 'Día 3 · UCI intermedia', datos: { Evolución: 'neumonía; CV 1.300 mL (18,6 mL/kg), PIM −28' }, nuevo: ['Evolución'], calculadora: C_FARM,
            pregunta: { id: 'mnm-c1-2', tipo: 'error', fuente: 'mn-tabla-46-5 · mn-mg-intubacion · mn-mg-crisis · mn-mg-corticoides', origen: 'ficha; cifras del paciente: ilustrativo',
              enunciado: 'El R1 escribe el plan de la neumonía. Encuentra los errores.',
              frases: [
                { t: 'Gentamicina 5 mg/kg/día.', mal: true, c: 'Los aminoglucósidos figuran en la <span class="hl-rojo">Tabla 46.5</span> (' + pag(24) + '): elige un antibiótico que no esté en la tabla, según el antibiograma.' },
                { t: 'CV 1.300 mL (18,6 mL/kg) y PIM −28: aún no cumple criterio de intubar.' },
                { t: 'Mantener la piridostigmina mientras respire bien.' },
                { t: 'Si empeora, metilprednisolona antes que plasmaféresis.', mal: true, c: 'La primera opción es <span class="hl">IgIV o plasmaféresis</span>; los corticoides a dosis altas están discutidos porque pueden empeorarla (' + pag(26) + ').' },
                { t: 'Enoxaparina 40 mg/día.' }],
              explicacion: 'Intubar con CV ≤15 mL/kg (o <1 L) y PIM peor que −20 (' + pag(25) + '); piridostigmina para la miastenia leve-moderada y enoxaparina como profilaxis (' + pag(26) + ').' } },
          { momento: 'Día 4 · 6 horas después', datos: { Clínica: 'disfagia', CV: '950 mL (13,6 mL/kg)', PIM: '−18 cmH₂O', 'SpO₂': '95 % aire', 'PaCO₂': '41 mmHg' }, nuevo: ['Clínica', 'CV', 'PIM', 'SpO₂', 'PaCO₂'], calculadora: C_MG,
            // [pulmón vivo: estado 'debilidad-neuromuscular']
            pregunta: { id: 'mnm-c1-3', tipo: 'test', fuente: 'mn-mg-intubacion', origen: 'ficha; cifras del paciente: ilustrativo',
              enunciado: 'Serapio no está disneico y tiene una gasometría normal, pero la CV es de 950 mL y la PIM de −18. ¿Qué haces?',
              opciones: [
                { t: 'Esperar a que suba la PaCO₂ para decidir', porque: 'Marino decide por la CV y la PIM, sin esperar al in extremis (' + pag(25) + '); esperar a que suba la PaCO₂ es llegar in extremis.' },
                { t: 'BiPAP esta noche y revalorar mañana con una nueva CV y gasometría', porque: 'La BiPAP solo vale si se espera mejoría en pocos días, y con una miastenia que empeora no suele ser el caso. Una noche con CV de 13,6 mL/kg puede acabar en una parada.' },
                { t: 'Intubar: CV <1 L y ≤15 mL/kg, y PIM peor que −20', ok: true }],
              explicacion: 'CV ≤15 mL/kg (o <1 L) y PIM −20 son criterio (' + pag(25) + '): <span class="hl-rojo">no esperar a que esté in extremis</span>.',
              nota: NOTA_PIM } },
          { momento: 'Día 4 · ya intubado', datos: { Soporte: 'ventilación mecánica' }, nuevo: ['Soporte'], calculadora: C_FARM,
            pregunta: { id: 'mnm-c1-4', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mn-mg-crisis · mn-mg-piridostigmina · mn-tabla-46-5',
              enunciado: 'Con Serapio intubado, ¿qué pones en marcha y qué retiras?',
              puntos: [
                '<span class="hl">Plasmaféresis</span>: 5 sesiones en 7-10 días (mejoría tras la 2.ª); la IgIV es la alternativa.',
                'Retirar la <span class="hl-rojo">piridostigmina</span>: aumenta las secreciones respiratorias.',
                'Retirar la <span class="hl-rojo">gentamicina</span>: es un aminoglucósido de la Tabla 46.5.'],
              explicacion: 'Pautas de la crisis (' + pag(26) + ') y fármacos de la Tabla 46.5 (' + pag(24) + ').' } },
          { momento: 'Día 9 · el giro', datos: { 'Tras la 3.ª sesión': 'CV 1.500 mL', 'TC de tórax con contraste': 'masa en el mediastino anterior' }, nuevo: ['Tras la 3.ª sesión', 'TC de tórax con contraste'],
            pregunta: { id: 'mnm-c1-5', tipo: 'test', fuente: 'mn-mg-otros · mn-mg-desencadenantes', origen: 'ficha; cifras del paciente: ilustrativo',
              enunciado: 'Serapio mejora, y el TC de tórax muestra una masa en el mediastino anterior. ¿Qué cambia?',
              opciones: [
                { t: 'Un timoma (10 %): la timectomía la valora neurología', ok: true },
                { t: 'Timectomía urgente, porque está en crisis', porque: 'Marino pone la timectomía «a valorar por neurología», no como urgencia de la crisis. Operar a un paciente ventilado y débil añade riesgo sin que la ficha lo indique.' },
                { t: 'Es paraneoplásica: no se trata la placa, solo la masa', porque: 'La miastenia sigue necesitando su tratamiento (plasmaféresis o IgIV). Dejarlo por la masa deja al paciente con una placa que sigue fallando.' }],
              explicacion: 'Un timoma causa el <span class="hl">10 %</span> (' + pag(24) + '); se busca con TC con contraste y la timectomía queda a valorar por neurología (' + pag(26) + ').' } },
          { momento: 'Día 14 · extubado', datos: { Situación: 'extubado, sin soporte' }, nuevo: ['Situación'],
            pregunta: { id: 'mnm-c1-6', tipo: 'test', fuente: 'mn-mg-pronostico · mn-gbs-pronostico',
              enunciado: 'Serapio pregunta qué le espera. ¿Qué dice Marino del pronóstico de la miastenia en la UCI?',
              opciones: [
                { t: 'Sobrevive al ingreso un 97 % y el 10-15 % queda con discapacidad grave', porque: 'Esa es la cifra del Guillain-Barré (' + pag(28) + '). Dársela a Serapio sería hablarle del pronóstico de otra enfermedad.' },
                { t: 'Sobrevive al ingreso un 95 %, pero pocos se recuperan del todo', ok: true },
                { t: 'Se recupera del todo en la mitad, a lo largo de meses', porque: 'Es la recuperación de la polineuropatía y la miopatía del crítico. Prometérselo le llevaría a esperar una curación que la miastenia no suele dar.' }],
              explicacion: 'Pronóstico: <span class="hl">95 % sobrevive al ingreso, pero pocos se recuperan del todo</span> (' + pag(26) + ').' } },
        ] },
    ],
    profundizar: [
      { id: 'mn-mg-otros', titulo: 'Deglución, TC de tórax y timectomía' },
      { id: 'mn-mg-pronostico', titulo: 'Pronóstico de la miastenia' },
      { id: 'mn-mg-desencadenantes', titulo: 'Desencadenantes: cirugía, estrés y fármacos' },
    ],
  },

  /* =================================================================================================
     9 · Guillain-Barré, polineuropatía y miopatía del crítico (págs. 26-29)
     ================================================================================================= */
  'mn-gbs-pnc': {
    entrada: 'Dónde está la lesión y qué signo la delata: la mielina del Guillain-Barré frente a la placa miasténica, y el nervio o el músculo que rompe la inflamación del crítico.',
    guia: [
      { id: 'mng-g1', corto: 'qué precede', tipo: 'test', fuente: 'mn-gbs-definicion',
        enunciado: 'Florentina, de 52 años, tuvo diarrea hace dos semanas y ahora tiene debilidad. ¿Qué precede al Guillain-Barré y con qué retraso?',
        opciones: [
          { t: 'Una vacuna puesta en las 48 horas previas al inicio de los síntomas', porque: 'La ficha no relaciona el síndrome con ninguna vacuna. Atribuirlo a eso te haría buscar por ahí y no preguntar por la diarrea que sí precede al cuadro.' },
          { t: 'Una infección aguda 1-3 semanas antes (p. ej., Campylobacter)', ok: true },
          { t: 'Una infección de 1-3 días antes', porque: 'El intervalo es de semanas: con 1-3 días no relacionarías la diarrea de hace 14 días con la debilidad de hoy.' }],
        explicacion: 'Suele seguir a una infección aguda <span class="hl">1-3 semanas</span> antes, con <span class="hl-azul">mimetismo molecular</span>: anticuerpos contra un componente del germen que reaccionan con el nervio periférico (' + pag(26) + ').' },
      { id: 'mng-g2', modelo: { placaViva: 'flor:3' }, corto: 'qué no verás', tipo: 'test', fuente: 'mn-tabla-46-6',
        enunciado: 'En el Guillain-Barré la lesión está en la mielina. Predice, con la Tabla 46.6 tapada: ¿qué NO verás?',
        opciones: [
          { t: 'Conducción nerviosa enlentecida', porque: 'Sí la verás: es el signo de la desmielinización. Si no esperas lentitud, no pedirás el estudio de conducción que lo confirma.' },
          { t: 'Debilidad que se fatiga con el uso', ok: true },
          { t: 'Proteínas elevadas en el LCR', porque: 'Sí las verás (Tabla 46.6). Un LCR normal no es lo habitual y, si lo esperas, descartarías el diagnóstico.' },
          { t: 'Inestabilidad autonómica en los casos avanzados', porque: 'Sí la verás: la Tabla 46.6 la recoge en los casos avanzados (' + pag(27) + '). Si no la esperas, no la reconocerás cuando aparezca.' }],
        explicacion: 'Tabla 46.6 (' + pag(27) + '): en el Guillain-Barré <span class="hl">no hay debilidad oculomotora ni que se fatigue</span>; hay reflejos disminuidos, inestabilidad autonómica, conducción enlentecida y proteínas altas en el LCR. En la miastenia, al revés.' },
      { id: 'mng-g3', corto: 'Miller Fisher', tipo: 'test', fuente: 'mn-gbs-clinica · mn-tabla-46-6',
        enunciado: 'Florentina tiene diplopía y ataxia. ¿Descarta el Guillain-Barré?',
        opciones: [
          { t: 'Sí: la afectación ocular con ataxia es propia de la miastenia gravis y no del Guillain-Barré', porque: 'La Tabla 46.6 tiene una excepción. Descartarlo por ese motivo le quitaría la IgIV o la plasmaféresis a quien las necesita.' },
          { t: 'Puede ser: Miller Fisher, la variante con oftalmoplejía y ataxia (p. 27)', ok: true },
          { t: 'Sí: con ataxia piensa en un ictus de tronco, no en una neuropatía', porque: 'La variante Miller Fisher del GBS cursa con oftalmoplejía y ataxia (' + pag(27) + '); si la descartas, te saltas la IgIV o la plasmaféresis.' }],
        explicacion: 'Excepción de la Tabla 46.6 (' + pag(27) + '): el <span class="hl">síndrome de Miller Fisher</span>, variante del Guillain-Barré con oftalmoplejía y ataxia.' },
      { id: 'mng-g4', corto: 'a quién tratar', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-gbs-tratamiento',
        enunciado: 'Florentina no puede caminar sin ayuda. ¿A quién tratas en el Guillain-Barré y con qué?',
        puntos: [
          'A quien <span class="hl">no camina sin ayuda o tiene fracaso respiratorio</span>.',
          '<span class="hl">IgIV o plasmaféresis</span> con las mismas pautas que en la miastenia; <span class="hl-azul">la guía no prefiere ninguna</span>.'],
        explicacion: 'Además se vigilan la capacidad vital y la presión inspiratoria para intubar a tiempo (' + pag(27) + ').' },
      { id: 'mng-g5', modelo: [{ placaViva: 'pnc', texto: 'Compruébalo en la polineuropatía' }, { placaViva: 'mcc', texto: 'Compruébalo en la miopatía' }], corto: 'PNC y MCC', tipo: 'test', fuente: 'mn-pnc-pnc · mn-pnc-mcc',
        enunciado: 'En el crítico, ¿dónde está la lesión en la polineuropatía (PNC) y dónde en la miopatía (MCC)?',
        opciones: [
          { t: 'PNC desmielinizante, como el Guillain-Barré; MCC en la placa', porque: 'La PNC es axonal, no desmielinizante, y la MCC es del músculo, no de la placa. Tratarlas como un Guillain-Barré con IgIV no ayuda: no tienen tratamiento.' },
          { t: 'PNC: axón sensitivo y motor; MCC: el músculo', ok: true },
          { t: 'Las dos son musculares y solo difieren en la extensión', porque: 'La PNC es del nervio. Confundirlas te llevaría a pedir una biopsia muscular cuando el estudio de conducción ya lo aclara.' }],
        explicacion: 'PNC: <span class="hl">neuropatía axonal difusa sensitiva y motora</span>; MCC: <span class="hl">miopatía inflamatoria difusa</span> con pérdida de filamentos de miosina en la biopsia (' + pag(28) + ').' },
      { id: 'mng-g6', corto: 'lo que comparten', tipo: 'test', fuente: 'mn-pnc-que · mn-pnc-mcc',
        enunciado: '¿Qué comparten la PNC y la MCC?',
        opciones: [
          { t: 'Secundarias a una inflamación sistémica grave; salen al no destetar', ok: true },
          { t: 'Los corticoides a dosis altas las predisponen a las dos, y por eso se retiran', porque: 'Los corticoides y la relajación se citan en asmáticos con un cuadro parecido a la MCC, no en la PNC. Atribuirlo a las dos te llevaría a retirar un corticoide necesario.' },
          { t: 'Se curan con inmunoglobulinas', porque: 'No hay tratamiento. Esperar respuesta a la IgIV retrasa la movilización y la nutrición, que son lo único propuesto.' }],
        explicacion: 'Son trastornos secundarios de las enfermedades inflamatorias sistémicas graves; a menudo coexisten y <span class="hl">se descubren cuando el paciente no se puede retirar del respirador</span> (' + pag(28) + ').' },
    ],
    examen: [
      { id: 'mng-e1', corto: 'se resuelve solo', tipo: 'test', fuente: 'mn-gbs-clinica',
        enunciado: '¿Qué porcentaje de los Guillain-Barré se resuelve solo?',
        opciones: [
          { t: '25 %, la cifra de los que acaban ventilados', porque: 'Es el porcentaje con fracaso respiratorio. Pensar que solo se resuelve uno de cada cuatro llevaría a tratar sin criterio.' },
          { t: '80 %, a menudo con secuelas', ok: true },
          { t: '97 %, la cifra de los que sobreviven al ingreso', porque: 'Es la supervivencia al ingreso, no la resolución espontánea. Creerlo dejaría sin IgIV a quien no camina.' }],
        explicacion: 'Se resuelve solo en un <span class="hl">80 %</span>, a menudo con secuelas (' + pag(27) + '); fracaso respiratorio en el 25 % (' + pag(27) + ') y supervivencia del 97 % (' + pag(28) + ').' },
      { id: 'mng-e2', corto: 'dolor urente', tipo: 'test', fuente: 'mn-gbs-dolor',
        enunciado: 'Florentina tiene dolor urente en las piernas en la fase aguda. ¿Qué recomienda la guía?',
        opciones: [
          { t: 'Solo AINE y paracetamol, porque el dolor es nociceptivo y de origen muscular', porque: 'El dolor es neuropático (' + pag(28) + '), no nociceptivo ni muscular; tratarlo como tal te deja sin la gabapentina que pauta la guía.' },
          { t: 'Gabapentina 3.000 mg/día desde el primer día', porque: 'Son más de tres veces los 900 mg/día de la guía (300 mg tres veces al día, ' + pag(28) + '); 3.000 mg/día es la dosis a partir de la cual retirarla de golpe da un delirio como el de la abstinencia (cap. 45, ' + pag(9) + '), no una pauta para el dolor del Guillain-Barré.' },
          { t: 'Gabapentina 300 mg tres veces al día; opioides si urge', ok: true }],
        explicacion: 'Dolor <span class="hl">neuropático</span>, prominente en las fases aguda y de resolución: <span class="hl">gabapentina 300 mg tres veces al día</span> y, para alivio más inmediato, considerar opioides (' + pag(28) + ').' },
      { id: 'mng-e3', corto: 'punción lumbar', tipo: 'test', fuente: 'mn-gbs-dx',
        enunciado: '¿Para qué sirve la punción lumbar en el Guillain-Barré?',
        opciones: [
          { t: 'Descartar otras causas; muestra proteínas elevadas', ok: true },
          { t: 'Confirmar el diagnóstico al ver pleocitosis en el LCR', porque: 'La ficha no dice que haya pleocitosis, sino proteínas elevadas. Esperar células llevaría a descartarlo con un LCR típico.' },
          { t: 'Medir la presión de apertura, que está elevada', porque: 'No es lo que dice Marino. Buscarla retrasaría el diagnóstico mientras la capacidad vital cae.' }],
        explicacion: 'La punción lumbar <span class="hl">descarta otras causas</span> y muestra <span class="hl-rojo">proteínas elevadas</span>; el diagnóstico es clínico y por la conducción disminuida (' + pag(27) + ').' },
      { id: 'mng-e4', corto: 'neuropatía frecuente', tipo: 'test', fuente: 'mn-pnc-pnc',
        enunciado: '¿Cuál es la neuropatía periférica más frecuente del paciente crítico?',
        opciones: [
          { t: 'Síndrome de Guillain-Barré, el más frecuente en la UCI', porque: 'La más frecuente en el crítico es otra (' + pag(28) + '); pensar en Guillain-Barré ante todo paciente que no se desteta llevaría a dar IgIV sin motivo.' },
          { t: 'Polineuropatía del crítico (PNC)', ok: true },
          { t: 'Miastenia gravis', porque: 'Es una enfermedad de la placa, no una neuropatía. Esperarla te haría buscar ptosis y fatiga que el paciente flácido no tiene.' }],
        explicacion: 'La PNC es la <span class="hl">neuropatía periférica más frecuente del crítico</span>, muy frecuente en la sepsis grave y el shock séptico (' + pag(28) + ').' },
      { id: 'mng-e5', corto: 'qué confirma la MCC', tipo: 'test', fuente: 'mn-pnc-mcc · mn-pnc-pnc',
        enunciado: '¿Qué confirma la miopatía del crítico (MCC)?',
        opciones: [
          { t: 'Conducción enlentecida en fibras sensitivas y motoras', porque: 'Eso es la PNC. Confirmar una MCC con una conducción lenta te llevaría a un diagnóstico equivocado.' },
          { t: 'EMG miopático y biopsia con pérdida de miosina', ok: true },
          { t: 'Proteínas elevadas en el LCR', porque: 'Es del Guillain-Barré. Una punción lumbar no distingue la MCC y solo añadiría una prueba inútil.' }],
        explicacion: 'MCC: <span class="hl">electromiograma miopático y biopsia</span> (pérdida de filamentos de miosina, infiltrado inflamatorio); la conducción enlentecida es de la PNC (' + pag(28) + ').' },
      { id: 'mng-e6', corto: 'tratamiento', tipo: 'test', fuente: 'mn-pnc-manejo',
        enunciado: '¿Qué tratamiento tienen la PNC y la MCC?',
        opciones: [
          { t: 'IgIV 2 g/kg en 2-5 días, como en el Guillain-Barré', porque: 'La IgIV es del Guillain-Barré y de la miastenia; no está indicada aquí, así que gastarías un fármaco caro sin efecto.' },
          { t: 'Control glucémico estricto, que las revierte', porque: 'La hiperglucemia predispone a la MCC, pero Marino no da el control glucémico como tratamiento validado. Prometer reversión sería engañar a la familia.' },
          { t: 'Ninguno validado; se propone movilizar y nutrir', ok: true }],
        explicacion: '<span class="hl-rojo">No hay tratamiento</span>: se han propuesto movilización precoz y mejor nutrición, ninguna validada ni dirigida a la inflamación. Recuperación completa en la mitad, a lo largo de meses (' + pag(28) + '-29).' },
    ],
    casos: [
      { id: 'mng-c1', titulo: 'Florentina, 52 años: la debilidad que sube', corto: 'Caso · Florentina', sub: 'Guillain-Barré, 60 kg',
        paciente: { Edad: '52 años', Peso: '60 kg', Motivo: 'Diarrea hace 2 semanas; debilidad que sube' },
        lleva: [
          'Nervio frente a placa: sin fatiga, reflejos disminuidos, inestabilidad autonómica y conducción lenta (Tabla 46.6).',
          'Marino decide por la CV y la PIM, sin esperar al in extremis; la BiPAP solo si se espera mejoría en días.',
          'Si no se desteta y está flácida tras una sepsis, piensa en PNC y MCC: no tienen tratamiento.'],
        volver: { nombre: 'Tabla 46.6', ancla: 'mn-tabla-46-6', modelo: { placaViva: 'flor:3' } },
        pasos: [
          { momento: 'Día 0', datos: { Clínica: 'parestesias y debilidad simétrica que sube en 4 días; arreflexia; sin ptosis' }, nuevo: ['Clínica'], calculadora: C_GBS,
            pregunta: { id: 'mng-c1-1', tipo: 'test', fuente: 'mn-tabla-46-6 · mn-gbs-clinica · mn-pnc-que',
              enunciado: 'Debilidad simétrica ascendente, arreflexia y sin ptosis. ¿Dónde está la lesión?',
              opciones: [
                { t: 'En la placa: miastenia, porque la debilidad es simétrica', porque: 'La miastenia afecta siempre a los ojos y conserva los reflejos. Tratarla con piridostigmina no frenaría el Guillain-Barré y retrasaría la vigilancia respiratoria.' },
                { t: 'En la mielina del nervio periférico: Guillain-Barré', ok: true },
                { t: 'En el axón del nervio: polineuropatía del crítico, secundaria a sepsis', porque: 'La PNC aparece en la sepsis grave y se descubre al no poder retirar el respirador; Florentina aún no está en la UCI ni séptica.' }],
              explicacion: 'Reflejos disminuidos o ausentes y sin afectación ocular: <span class="hl">Guillain-Barré</span> (Tabla 46.6, ' + pag(27) + '), tras una infección 1-3 semanas antes (' + pag(26) + ').' } },
          { momento: 'Día 0 · estudios', datos: { LCR: 'proteínas 110 mg/dL (cifra del paciente)' }, nuevo: ['LCR'],
            pregunta: { id: 'mng-c1-2', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-gbs-dx · mn-tabla-46-6', origen: 'ficha; cifra del paciente: ilustrativo',
              enunciado: '¿Qué pides para confirmarlo y qué esperas ver?',
              puntos: [
                'Estudios de conducción: <span class="hl">conducción enlentecida</span>.',
                'Punción lumbar: <span class="hl">proteínas elevadas</span> (descarta además otras causas).'],
              explicacion: 'Diagnóstico clínico y por conducción disminuida; la punción lumbar muestra proteínas altas (' + pag(27) + ').' } },
          { momento: 'Día 1', datos: { Marcha: 'no camina sin ayuda', CV: '1.100 mL (18 mL/kg)', PIM: '−30 cmH₂O' }, nuevo: ['Marcha', 'CV', 'PIM'], calculadora: C_MG,
            pregunta: { id: 'mng-c1-3', tipo: 'test', fuente: 'mn-gbs-tratamiento', origen: 'ficha; cifras del paciente: ilustrativo',
              enunciado: 'Florentina ya no camina sin ayuda y su CV es de 18 mL/kg. ¿Y ahora?',
              opciones: [
                { t: 'Vigilar: el 80 % se resuelve solo', porque: 'Una paciente que no camina sin ayuda tiene indicación de tratamiento. Esperar deja que progrese hasta el fracaso respiratorio (25 %).' },
                { t: 'Solo plasmaféresis: la IgIV no sirve en el Guillain-Barré', porque: 'La guía acepta ambas y no prefiere ninguna. Negarle la IgIV retrasa el tratamiento si no hay plasmaféresis disponible.' },
                { t: 'IgIV 2 g/kg (120 g) o plasmaféresis, y vigilar CV y PIM', ok: true }],
              explicacion: 'Si no camina sin ayuda o hay fracaso respiratorio: <span class="hl">IgIV o plasmaféresis</span> con las pautas de la miastenia; 2 g/kg × 60 kg = 120 g (' + pag(27) + ', pautas en ' + pag(26) + ').' } },
          { momento: 'Día 2', datos: { CV: '850 mL (14 mL/kg)', PIM: '−18 cmH₂O', 'SpO₂': '96 %' }, nuevo: ['CV', 'PIM', 'SpO₂'], calculadora: C_MG,
            // [pulmón vivo: estado 'debilidad-neuromuscular']
            pregunta: { id: 'mng-c1-4', tipo: 'error', fuente: 'mn-mg-intubacion · mn-gbs-tratamiento · mn-mg-hielo · mn-mg-otros', origen: 'ficha; cifras del paciente: ilustrativo',
              enunciado: 'El R1 escribe el plan del día 2. Encuentra los errores.',
              frases: [
                { t: 'CV de 850 mL (14 mL/kg, <1 L) y PIM −18: cumple el criterio de intubar.' },
                { t: 'BiPAP nocturna y revalorar mañana.', mal: true, c: 'Con criterio cumplido se <span class="hl-rojo">intuba</span>: la BiPAP solo vale si se espera mejoría en pocos días (' + pag(25) + ', igual en el Guillain-Barré, ' + pag(27) + ').' },
                { t: 'Seguir con la IgIV: día 2 de 5.' },
                { t: 'Prueba del hielo para descartar miastenia.', mal: true, c: 'El hielo es para la ptosis (' + pag(24) + '); no hay ptosis, y la Tabla 46.6 ya separa las dos enfermedades.' },
                { t: 'Enoxaparina 40 mg/día.' }],
              explicacion: 'Marino decide por la CV y la PIM, sin esperar al in extremis (' + pag(25) + '); enoxaparina como profilaxis de TVP (' + pag(26) + ').',
              nota: NOTA_PIM } },
          { momento: 'Día 4 · el giro · intubada', datos: { FC: 'de 42 a 135 lpm en horas (cifra del paciente)', PA: 'de 85/45 a 185/100 mmHg (cifra del paciente)' }, nuevo: ['FC', 'PA'],
            pregunta: { id: 'mng-c1-5', tipo: 'test', fuente: 'mn-gbs-clinica · mn-tabla-46-6', origen: 'ilustrativo: oscilaciones de FC y PA del paciente; la fuente solo dice «inestabilidad autonómica»',
              enunciado: 'Intubada y con IgIV, su FC y su PA oscilan mucho. ¿Qué es?',
              opciones: [
                { t: 'Sepsis asociada a la ventilación: antibióticos y una carga de fluidos', porque: 'Hay que buscarla en un paciente ventilado, pero la fuente recoge la inestabilidad autonómica en los casos avanzados del Guillain-Barré (' + pag(27) + '); las cifras de FC y PA son del paciente (ilustrativo).' },
                { t: 'Inestabilidad autonómica del Guillain-Barré avanzado', ok: true },
                { t: 'Dolor neuropático no controlado', porque: 'El dolor del GBS es neuropático (' + pag(28) + '), pero no explica una FC de 42.' }],
              explicacion: 'Fracaso respiratorio en el 25 % e <span class="hl">inestabilidad autonómica en los casos avanzados</span> (' + pag(27) + '); en la miastenia no hay (Tabla 46.6).' } },
          { momento: 'Día 8', datos: { Síntoma: 'dolor urente en las piernas' }, nuevo: ['Síntoma'],
            pregunta: { id: 'mng-c1-6', tipo: 'test', fuente: 'mn-gbs-dolor',
              enunciado: 'Dolor urente en las piernas. ¿Qué pautas?',
              opciones: [
                { t: 'Gabapentina 300 mg cada 8 h; opioides si urge', ok: true },
                { t: 'Paracetamol y AINE, porque es un dolor nociceptivo', porque: 'El dolor del Guillain-Barré es neuropático (' + pag(28) + '), no nociceptivo; tratarlo como tal te deja sin la gabapentina que pauta la guía.' },
                { t: 'Gabapentina 3.000 mg/día', porque: 'Son más de tres veces los 900 mg/día de la guía (300 mg tres veces al día, ' + pag(28) + '); 3.000 mg/día es la dosis a partir de la cual retirarla de golpe da un delirio como el de la abstinencia (cap. 45, ' + pag(9) + '), no una pauta para el dolor.' }],
              explicacion: 'Dolor <span class="hl">neuropático</span>: gabapentina 300 mg tres veces al día; considerar opioides para alivio más inmediato (' + pag(28) + ').' } },
          { momento: 'Día 20', datos: { Evolución: 'sepsis por catéter; mejora la fuerza de brazos pero no se desteta; flácida, arreflexia' }, nuevo: ['Evolución'],
            modeloVivo: capSepsis('🩸 La sepsis en el capilar vivo'),
            pregunta: { id: 'mng-c1-7', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mn-pnc-que · mn-pnc-pnc · mn-pnc-mcc · mn-pnc-manejo', modeloVivo: capSepsis('🩸 La sepsis en el capilar vivo'),
              enunciado: 'Tras una sepsis, flácida y sin poder retirar el respirador. ¿Qué piensas?',
              puntos: [
                '<span class="hl">PNC y/o MCC</span>: la inflamación sistémica grave daña ahora el nervio y el músculo; a menudo coexisten.',
                'La clínica no las separa: <span class="hl">estudio de conducción</span> (PNC) y <span class="hl">EMG y biopsia</span> (MCC).',
                '<span class="hl-rojo">No hay tratamiento</span>: la mitad se recupera del todo, a lo largo de meses.'],
              explicacion: 'Trastornos secundarios a la sepsis grave; se descubren cuando no se retira el respirador (' + pag(28) + '-29).' } },
        ] },
    ],
    profundizar: [
      { id: 'mn-gbs-definicion', titulo: 'Guillain-Barré: mimetismo molecular' },
      { id: 'mn-pnc-final', titulo: 'La inflamación ataca de nuevo (Tabla 17.1)' },
      { id: 'mn-gbs-pronostico', titulo: 'Pronóstico del Guillain-Barré' },
    ],
  },

  /* =================================================================================================
     10 · Relajantes y su reversión (págs. 29-31)
     ================================================================================================= */
  'mn-relajantes': {
    entrada: 'Qué hace cada relajante en el receptor, cuándo la succinilcolina está prohibida, cómo se vigila con el tren de cuatro y cómo se revierte, con sus topes.',
    guia: [
      { id: 'mnr-g1', modelo: { placaViva: 'mel:1' }, corto: 'K⁺ y succinilcolina', tipo: 'test', fuente: 'mn-bnm-mecanismo · mn-bnm-succi',
        enunciado: 'Melquíades, de 62 años, tiene el potasio en 6,1 mmol/L. ¿Por qué la succinilcolina sube el K⁺?',
        opciones: [
          { t: 'Libera histamina, que desplaza el potasio de las células', porque: 'Eso lo hace el atracurio; el cisatracurio no libera histamina (' + pag(30) + '). Con esa idea, vigilarías la tensión y no el potasio.' },
          { t: 'Bloquea la bomba renal de potasio', porque: 'No es su mecanismo. Con esa idea la darías creyendo que solo importa si el riñón falla, cuando el peligro es el músculo.' },
          { t: 'La despolarización mantenida saca K⁺ del músculo', ok: true }],
        explicacion: 'Es el único despolarizante: su despolarización mantenida saca K⁺ del músculo, hasta <span class="hl">0,5 mEq/L</span>, sin consecuencias si no estaba alto; con hiperpotasemia previa puede ser <span class="hl-rojo">mortal</span> (' + pag(29) + '-30).' },
      { id: 'mnr-g2', corto: 'contraindicaciones', tipo: 'test', fuente: 'mn-tabla-46-7',
        enunciado: 'Melquíades además tiene un fracaso renal con K⁺ basal de 4,2. ¿Cuál NO está entre las contraindicaciones de la Tabla 46.7?',
        opciones: [
          { t: 'Rabdomiólisis con CK muy elevada', porque: 'Está en la lista de la Tabla 46.7. Dar succinilcolina a un rabdomiolítico es arriesgar una hiperpotasemia mortal.' },
          { t: 'Quemaduras', porque: 'Está en la lista. Intubar a un quemado con succinilcolina puede disparar el potasio.' },
          { t: 'Lesión medular con inmovilidad', porque: 'Está en la lista junto a la hipertermia maligna. Usarla en este paciente puede ser mortal.' },
          { t: 'Un fracaso renal con K⁺ de 4,2', ok: true }],
        explicacion: 'La Tabla 46.7 lista: <span class="hl-rojo">hiperpotasemia, hipertermia maligna, rabdomiólisis, quemaduras e inmovilidad por lesión medular</span> (' + pag(29) + '). La función renal no influye en la succinilcolina (Tabla 46.7, ' + pag(29) + '); sí el potasio alto.' },
      { id: 'mnr-g3', corto: 'rocuronio para intubar', tipo: 'test', fuente: 'mn-bnm-rocuronio · mn-tabla-46-7', calculadora: C_BNM,
        enunciado: 'Rocuronio 1 mg/kg para intubar. ¿Qué tiene de bueno y de malo?',
        opciones: [
          { t: 'Inicio igual al de la succinilcolina, pero dura una hora', ok: true },
          { t: 'Es más rápido que la succinilcolina, y dura 7-12 min', porque: 'La duración de 7-12 min es de la succinilcolina; el rocuronio es de duración intermedia. Contar con una recuperación rápida deja sin ventilar a quien no se intuba.' },
          { t: 'Es lento (5-7 min) y no depende de riñón ni hígado', porque: 'Eso es el cisatracurio: inicio 5-7 min y sus niveles no dependen de riñón ni hígado (Tabla 46.7, ' + pag(29) + '-30). Esperar 5-7 min con un rocuronio es retrasar una intubación urgente.' }],
        explicacion: 'A 1 mg/kg su inicio equivale al de 1 mg/kg de succinilcolina, <span class="hl">pero dura una hora</span>: si la vía aérea no se asegura a tiempo, revertir con sugammadex 16 mg/kg (' + pag(30) + ').',
        nota: NOTA_ROC + enFicha('mn-relajantes', 'mn-tabla-46-7') },
      { id: 'mnr-g4', modelo: { placaViva: 'mel:4' }, corto: 'TOF 0/4', tipo: 'test', fuente: 'mn-bnm-monitor',
        enunciado: 'Melquíades tiene una perfusión de relajante y el tren de cuatro marca 0 de 4. ¿Qué significa?',
        opciones: [
          { t: 'Bloqueo excesivo: el objetivo es 1 o 2 respuestas', ok: true },
          { t: 'Objetivo logrado: 0 respuestas evitan la asincronía', porque: 'El objetivo es 1 o 2 respuestas perceptibles. Mantener 0 expone al paciente a más relajante, más miopatía y más días de parálisis.' },
          { t: 'Bloqueo insuficiente: hay que subir la perfusión', porque: 'Sin aducción del pulgar el bloqueo es excesivo, no insuficiente. Subir la dosis añadiría parálisis sin beneficio.' }],
        explicacion: 'Cuatro estímulos a 2 Hz sobre el nervio cubital: <span class="hl-rojo">sin aducción del pulgar, bloqueo excesivo</span>; objetivo <span class="hl">1 o 2 respuestas</span> (' + pag(30) + ').' },
      { id: 'mnr-g5', modelo: { placaViva: 'mel' }, corto: 'neostigmina', tipo: 'test', fuente: 'mn-bnm-neostigmina',
        enunciado: 'Revertir un bloqueo moderado de un no despolarizante. ¿Cómo lo hace la neostigmina?',
        opciones: [
          { t: 'Se une directamente al rocuronio y lo inactiva', porque: 'Eso es el sugammadex. Esperar de la neostigmina una reversión inmediata a cualquier profundidad sería pasarse de dosis.' },
          { t: 'Inhibe la acetilcolinesterasa: más ACh vence al bloqueo', ok: true },
          { t: 'Igual que la piridostigmina, que se puede usar para revertir', porque: 'Edrofonio y piridostigmina no se usan para revertir. Cambiar de fármaco por esa idea retrasa la recuperación.' }],
        explicacion: 'Inhibe la acetilcolinesterasa: <span class="hl-azul">el aumento de acetilcolina supera el bloqueo competitivo</span> de los no despolarizantes (' + pag(30) + '-31). Edrofonio y piridostigmina no se usan para revertir.',
        nota: NOTA_NEO },
      { id: 'mnr-g6', modelo: { placaViva: 'mel:3' }, corto: 'sugammadex', tipo: 'test', fuente: 'mn-bnm-sugammadex',
        enunciado: '¿Por qué el sugammadex revierte más rápido que la neostigmina?',
        opciones: [
          { t: 'Porque inhibe la acetilcolinesterasa con más potencia', porque: 'No actúa sobre la enzima. Con esa idea esperarías efectos colinérgicos que el sugammadex no tiene.' },
          { t: 'Se une a los aminoesteroides y revierte en 2-3 min', ok: true },
          { t: 'Porque revierte todos los relajantes, también cisatracurio y succinilcolina', porque: 'Solo se une a los aminoesteroides (rocuronio, vecuronio; pancuronio mucho menos). Ponerlo con cisatracurio no tendría efecto y dejaría al paciente paralizado.' }],
        explicacion: 'Se une directamente a los <span class="hl">aminoesteroides</span> (rocuronio, vecuronio y, mucho menos, pancuronio); revierte siempre en <span class="hl">2-3 min</span> y sin efectos colinérgicos (' + pag(31) + ').' },
      { id: 'mnr-g7', corto: 'evitar la parálisis', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-bnm-ruego',
        enunciado: 'El ruego de Marino es evitar la parálisis prolongada. ¿Por qué?',
        puntos: [
          'Sin <span class="hl">EEG continuo</span> no sabes si la sedación y la analgesia bastan; estar despierto y paralizado es horrible y doloroso.',
          'Aumenta la <span class="hl-rojo">miopatía del crítico, la neumonía «hipostática», el tromboembolismo venoso y las úlceras por presión</span>.'],
        explicacion: 'Sedación profunda y algo de analgesia siempre (' + pag(31) + ').' },
    ],
    examen: [
      { id: 'mnr-e1', corto: 'inicio más lento', tipo: 'test', fuente: 'mn-tabla-46-7',
        enunciado: 'Según la Tabla 46.7, ¿cuál de los tres relajantes tiene el inicio más lento?',
        opciones: [
          { t: 'Succinilcolina, 1-1,5 min', porque: 'Es el más rápido. Esperarlo lento retrasa una secuencia rápida innecesariamente.' },
          { t: 'Cisatracurio, 5-7 min', ok: true },
          { t: 'Rocuronio, 1,5-3 min', porque: 'Es intermedio. Pensar que es el más lento llevaría a evitarlo en la secuencia rápida cuando es la alternativa a la succinilcolina.' }],
        explicacion: 'Inicio: succinilcolina 1-1,5 min, rocuronio 1,5-3 min y <span class="hl">cisatracurio 5-7 min</span> (Tabla 46.7, ' + pag(29) + ').' },
      { id: 'mnr-e2', corto: 'fallo renal y hepático', tipo: 'test', fuente: 'mn-bnm-cisatracurio · mn-tabla-46-7',
        enunciado: 'Intubado, con fallo renal y hepático, y necesita relajación en perfusión. ¿Cuál eliges?',
        opciones: [
          { t: 'Rocuronio 5-12 µg/kg/min, que no depende del hígado ni del riñón', porque: 'Tiene efecto prolongado en el fallo hepático (cuánto, mal estudiado): el paciente seguiría paralizado más de lo previsto.' },
          { t: 'Cisatracurio 1-3 µg/kg/min: no depende de riñón ni hígado', ok: true },
          { t: 'Succinilcolina en perfusión', porque: 'Está contraindicada en varias situaciones y en la tabla no se da perfusión para ella; sería arriesgar hiperpotasemia sin base.' }],
        explicacion: 'Sus niveles no dependen del riñón ni del hígado: <span class="hl">atractivo en la UCI</span> (' + pag(29) + '-30).' },
      { id: 'mnr-e3', corto: 'bloqueo profundo', tipo: 'test', fuente: 'mn-bnm-sugammadex', calculadora: C_BNM,
        enunciado: 'Bloqueo profundo por rocuronio en un paciente de 70 kg. ¿Qué dosis de sugammadex?',
        opciones: [
          { t: '2 mg/kg, la del bloqueo moderado', porque: 'Con un bloqueo profundo se quedaría corto: el paciente seguiría parcialmente paralizado.' },
          { t: '4 mg/kg = 280 mg (bloqueo profundo)', ok: true },
          { t: '16 mg/kg = 1.120 mg, la de justo tras la intubación', porque: 'Es la dosis del bloqueo recién puesto; en un bloqueo profundo sería el cuádruple de lo que hace falta, sin beneficio (' + pag(31) + ').' }],
        explicacion: 'Dosis según la profundidad: <span class="hl">16 mg/kg</span> justo tras la intubación, <span class="hl">4 mg/kg</span> con bloqueo profundo y 2 mg/kg con moderado (' + pag(31) + '): 4 × 70 = 280 mg.' },
      { id: 'mnr-e4', corto: 'tiempo de neostigmina', tipo: 'test', fuente: 'mn-bnm-neostigmina',
        enunciado: 'Neostigmina 70 µg/kg en un bloqueo moderado. ¿Cuánto tarda en revertir?',
        opciones: [
          { t: '2-3 min, como el sugammadex', porque: 'Eso es el sugammadex. Esperar 2-3 min con neostigmina te llevaría a repetir la dosis y pasarte de 70 µg/kg.' },
          { t: '8-45 min, según relajante y profundidad', ok: true },
          { t: 'Unos 60 min, como la duración del rocuronio', porque: 'La fuente da 8-45 min según el relajante, la profundidad y el anestésico (' + pag(31) + '); una hora es lo que dura el rocuronio, no lo que tarda la reversión.' }],
        explicacion: '70 µg/kg IV revierte un bloqueo moderado en <span class="hl">8-45 min</span> según el relajante, la profundidad y el anestésico (' + pag(31) + ').',
        nota: NOTA_NEO },
      { id: 'mnr-e5', corto: 'usos de los relajantes', tipo: 'test', fuente: 'mn-bnm-usos',
        enunciado: '¿Cuál de estos NO figura entre los usos de los relajantes del libro?',
        opciones: [
          { t: 'Facilitar la intubación', porque: 'Es el primero de los tres usos que da el libro; dudar de él quitaría un relajante a una secuencia rápida.' },
          { t: 'Tratar el estado epiléptico refractario', ok: true },
          { t: 'Evitar los escalofríos en la hipotermia inducida', porque: 'Es el segundo uso del libro. No usarlos dejaría escalofríos que anulan el enfriamiento.' },
          { t: 'Sincronizar la ventilación en el paciente muy agitado', porque: 'Es el tercer uso. Negarlo mantendría una asincronía que daña el pulmón.' }],
        explicacion: 'Marino da tres usos: <span class="hl">intubar, evitar escalofríos en la hipotermia inducida y sincronizar al muy agitado</span> (' + pag(29) + '). El estado epiléptico refractario no figura entre ellos.' },
      { id: 'mnr-e6', corto: 'peso', tipo: 'test', fuente: 'mn-bnm-mecanismo',
        enunciado: '¿Con qué peso dosifican muchos expertos los relajantes?',
        opciones: [
          { t: 'Con el peso real, siempre', porque: 'En un obeso daría una dosis de más; la parálisis se prolongaría.' },
          { t: 'Con el peso ideal, según muchos expertos', ok: true },
          { t: 'Peso ajustado', porque: 'La fuente dice que muchos expertos usan el peso ideal (' + pag(29) + '); con más peso darías más relajante del que hace falta.' }],
        explicacion: 'Muchos expertos dosifican por el <span class="hl">peso ideal</span> (' + pag(29) + ').' },
      { id: 'mnr-e7', corto: 'reversión', tipo: 'error', fuente: 'mn-bnm-sugammadex · mn-bnm-neostigmina',
        enunciado: 'Resumen de la reversión que escribe un compañero. Encuentra el error.',
        frases: [
          { t: 'El sugammadex revierte el rocuronio y el vecuronio.' },
          { t: 'Su efecto llega antes que la recuperación espontánea de la succinilcolina.' },
          { t: 'La neostigmina se puede repetir hasta 100 µg/kg si no revierte.', mal: true, c: 'No se pasa <span class="hl-rojo">nunca de 70 µg/kg</span> por los efectos parasimpaticomiméticos (' + pag(31) + ').' },
          { t: 'El sugammadex no tiene efectos colinérgicos.' }],
        explicacion: 'Sugammadex: aminoesteroides, 2-3 min (antes de que se pase la succinilcolina), sin efectos colinérgicos (' + pag(31) + ').',
        nota: NOTA_NEO },
    ],
    casos: [
      { id: 'mnr-c1', titulo: 'Melquíades, 62 años: el rocuronio que dura una hora', corto: 'Caso · Melquíades', sub: 'neumonía grave, fallo renal y hepático, 70 kg',
        paciente: { Edad: '62 años', 'Peso (real = ideal)': '70 kg', Motivo: 'Neumonía grave, fracaso renal agudo y cirrosis Child B' },
        lleva: [
          'Con K⁺ alto no se usa succinilcolina; el rocuronio la sustituye, pero dura una hora: sugammadex 16 mg/kg si no hay vía aérea.',
          'Perfusión con cisatracurio (ni riñón ni hígado) y TOF de 1-2 respuestas; nunca paralizado sin sedación.',
          'Neostigmina nunca >70 µg/kg; sugammadex solo con aminoesteroides.'],
        volver: { nombre: 'Sugammadex', ancla: 'mn-bnm-sugammadex', modelo: { placaViva: 'mel:3' } },
        pasos: [
          { momento: 'Día 0 · 03:00', datos: { Indicación: 'intubación urgente', 'K⁺': '6,1 mmol/L', Bilirrubina: '4 mg/dL' }, nuevo: ['Indicación', 'K⁺', 'Bilirrubina'], calculadora: C_BNM,
            pregunta: { id: 'mnr-c1-1', tipo: 'test', fuente: 'mn-tabla-46-7 · mn-bnm-succi · mn-bnm-rocuronio', origen: 'ficha; cifras del paciente: ilustrativo', modeloVivo: rv('hiperk', '⚡ El potasio alto en el ritmo vivo'),
              enunciado: 'Intubación urgente con K⁺ de 6,1. ¿Qué relajante y qué dosis?',
              opciones: [
                { t: 'Succinilcolina 1,5 mg/kg, porque dura menos', porque: 'Con hiperpotasemia previa está contraindicada: sube hasta 0,5 mEq/L más y puede ser mortal sobre un K⁺ de 6,1.' },
                { t: 'Cisatracurio 0,2 mg/kg, porque no depende del hígado', porque: 'Tarda 5-7 min en empezar: demasiado para una intubación urgente.' },
                { t: 'Rocuronio 1 mg/kg = 70 mg, por su inicio rápido', ok: true }],
              explicacion: 'Rocuronio 1 mg/kg (70 kg: <span class="hl">70 mg</span>) equivale en inicio a la succinilcolina y sirve si ésta está contraindicada (' + pag(30) + '); la hiperpotasemia la contraindica (' + pag(29) + ').',
              nota: NOTA_ROC } },
          { momento: 'Día 0 · 03:04 · el giro', datos: { 'Vía aérea': 'Cormack 4; no se intuba ni se ventila con mascarilla', 'SpO₂': '84 %' }, nuevo: ['Vía aérea', 'SpO₂'], calculadora: C_BNM,
            pregunta: { id: 'mnr-c1-2', tipo: 'test', fuente: 'mn-bnm-rocuronio · mn-bnm-sugammadex', origen: 'ficha; cifras del paciente: ilustrativo',
              enunciado: 'No se puede intubar ni ventilar y la saturación cae. ¿Qué das?',
              opciones: [
                { t: 'Neostigmina 70 µg/kg', porque: 'La fuente da 8-45 min para un bloqueo moderado (' + pag(31) + '); este es profundo y recién puesto: tarda demasiado para una vía aérea que no se puede asegurar.' },
                { t: 'Sugammadex 2 mg/kg, la dosis del bloqueo moderado', porque: 'Se queda corto con un bloqueo recién puesto; seguiría paralizado.' },
                { t: 'Sugammadex 16 mg/kg = 1.120 mg', ok: true },
                { t: 'Esperar: el rocuronio es de duración intermedia', porque: 'Dura una hora; la espera con SpO₂ de 84 % sería una parada hipóxica.' }],
              explicacion: 'Si la vía aérea no se asegura a tiempo: <span class="hl">sugammadex 16 mg/kg</span> (70 kg: 1.120 mg), que revierte en 2-3 min (' + pag(30) + '-31).' } },
          { momento: 'Día 0 · 05:00', datos: { Situación: 'intubado con fibrobroncoscopio; SDRA con asincronía grave' }, nuevo: ['Situación'], calculadora: C_BNM,
            pregunta: { id: 'mnr-c1-3', tipo: 'test', fuente: 'mn-bnm-cisatracurio · mn-tabla-46-7', origen: 'ficha; cuenta con el peso del paciente: ilustrativo', calculadora: C_BNM,
              enunciado: 'SDRA con asincronía grave, fracaso renal y cirrosis; ya está intubado y pesa 70 kg. ¿Qué relajante y qué perfusión?',
              opciones: [
                { t: 'Rocuronio 5-12 µg/kg/min, por su inicio rápido y duración intermedia', porque: 'Su efecto se prolonga en la hepatopatía (' + pag(30) + '): parálisis imprevista en un paciente con cirrosis.' },
                { t: 'Cisatracurio 1-3 µg/kg/min = 4,2-12,6 mg/h', ok: true },
                { t: 'Cisatracurio 42-126 mg/h', porque: 'Es la cuenta con un error ×10: 1-3 µg/kg/min en 70 kg son 4,2-12,6 mg/h; con esa pauta darías diez veces la dosis de la fuente (' + pag(29) + ').' }],
              explicacion: 'Cisatracurio: niveles independientes de riñón e hígado (' + pag(30) + '); perfusión 1-3 µg/kg/min (' + pag(29) + '): 1 × 70 = 70 µg/min = 4,2 mg/h y 3 × 70 = 210 µg/min = 12,6 mg/h.' } },
          { momento: 'Día 2', datos: { TOF: '0/4' }, nuevo: ['TOF'],
            pregunta: { id: 'mnr-c1-4', modelo: { placaViva: 'mel:4' }, tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-bnm-monitor · mn-bnm-ruego',
              enunciado: 'El TOF marca 0/4 en la perfusión. ¿Qué haces?',
              puntos: [
                'Es un <span class="hl-rojo">bloqueo excesivo</span>: bajar la perfusión hasta 1 o 2 respuestas.',
                'Sedación profunda y algo de analgesia <span class="hl">siempre</span>; sin EEG continuo no sabes si bastan.'],
              explicacion: 'Monitorización y ruego (' + pag(30) + '-31).' } },
          { momento: 'Día 5', datos: { Plan: 'retirar el relajante' }, nuevo: ['Plan'], calculadora: C_BNM,
            pregunta: { id: 'mnr-c1-5', tipo: 'error', fuente: 'mn-bnm-sugammadex · mn-bnm-neostigmina · mn-bnm-ruego',
              enunciado: 'Plan para retirar la perfusión de cisatracurio. Encuentra los errores.',
              frases: [
                { t: 'Parar la perfusión de cisatracurio.' },
                { t: 'Revertir con sugammadex 4 mg/kg.', mal: true, c: 'El sugammadex solo revierte los <span class="hl-rojo">aminoesteroides</span> (rocuronio, vecuronio); el cisatracurio no lo es (' + pag(31) + ').' },
                { t: 'Si no revierte, neostigmina 100 µg/kg.', mal: true, c: '<span class="hl-rojo">Nunca más de 70 µg/kg</span>, por los efectos parasimpaticomiméticos (' + pag(31) + ').' },
                { t: 'Contar con efectos parasimpaticomiméticos si se da neostigmina.' },
                { t: 'Cuanto más dure la parálisis, más riesgo de miopatía.' }],
              explicacion: 'Reversión y ruego (' + pag(31) + ').',
              nota: NOTA_NEO } },
          { momento: 'Día 9', datos: { Situación: 'despierto, flácido, arreflexia, no se desteta' }, nuevo: ['Situación'],
            pregunta: { id: 'mnr-c1-6', tipo: 'test', fuente: 'mn-pnc-mcc · mn-pnc-pnc · mn-pnc-manejo', modeloVivo: capSepsis('🩸 La sepsis en el capilar vivo'),
              enunciado: 'Despierto, flácido y sin poder retirar el respirador. ¿Qué piensas?',
              opciones: [
                { t: 'Bloqueo residual del cisatracurio: más sugammadex', porque: 'El cisatracurio dura 35-50 min; a los 9 días no es bloqueo residual y el sugammadex ni actúa sobre él.' },
                { t: 'Neuromiopatía del crítico, sin tratamiento', ok: true },
                { t: 'Guillain-Barré: IgIV', porque: 'La sepsis y los relajantes predisponen a la MCC, no al GBS; y la IgIV no la trata: la MCC no tiene tratamiento (' + pag(28) + ').' }],
              explicacion: 'La inmovilidad (p. ej., por relajantes), la sepsis grave y la hiperglucemia predisponen a la MCC; conducción y EMG o biopsia para distinguir de la PNC; sin tratamiento (' + pag(28) + ').' } },
        ] },
    ],
    profundizar: [
      { id: 'mn-bnm-usos', titulo: 'Para qué se usan los relajantes' },
      { id: 'mn-bnm-mecanismo', titulo: 'Mecanismo y peso ideal' },
      { id: 'mn-bnm-ruego', titulo: 'Un ruego: evitar la parálisis prolongada' },
    ],
  },
};
