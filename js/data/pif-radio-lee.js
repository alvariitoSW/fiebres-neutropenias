// Ejercicios de «Lee esta placa» (PIF Radiología). Datos puros: la lógica está en js/modules/pif-radio/radio-lee.js
// (montarLectura(contenedor, ejercicio), reutilizable desde cualquier cuaderno: Placa, Tórax, Neuro).
// Coordenadas en % de la imagen real (x desde la izquierda, y desde arriba): valen a cualquier ancho.
//
// Esquema de un ejercicio:
// {
//   id,                       // único en toda la app: los ids del DOM son rl-<id>-…
//   titulo?, consigna?,       // texto sobre la imagen
//   img, alt,
//   fuente: { texto,          // «Marino, The ICU Book, fig. 28.1»
//             pdf?, pagina?,  // enlaza docs/…pdf#page=N
//             corto?,         // nombre corto para el enlace del resultado («Marino»)
//             url?, autor?, licencia?, licenciaUrl? },   // imagen ajena (Commons): url exige autor y licencia
//   pieAntes?, pie,           // pie sin la respuesta / pie completo (se muestra al comprobar)
//   zonas?: [ { id, forma: 'rect'|'circulo', x, y, w, h | x, y, r, rotulo, cita } ],   // r en % del ancho
//        // `cita` dice de dónde sale el rótulo («pie de la fig. 24.2»). Sin rótulo de la fuente, no hay zona.
//        // Tocar dentro de una zona destapa su rótulo; «Destapar todo» / «Tapar». Diana mínima de ~32 px.
//   toque?: { zona, confunde?, tolerancia, desplazaY?, regla? },   // el lector marca un punto; se compara con la zona
//   pregunta?: { enunciado, elecciones: [...], correcta, explicacion, porque?: [...] },   // lectura
//   error?: { enunciado, opciones: [ { texto, esError, explicacion } ] },                 // «encuentra el error»: 0, 1 o 2 errores
//   tapar?: [ { x, y, w, h } ],          // parches que ocultan rótulos impresos en la placa
//   frase?, ver?: { esp, view, panel, tab, res, rot }   // frase de la fuente y enlace «Ver en el texto»
// }
import { ROTULOS_MERINO_NEUMO } from './merino-neumo-rotulos.js';

const R28 = ROTULOS_MERINO_NEUMO['fig-28-1'].rotulos;   // punta del tubo y carina, de la fuente

export const EJERCICIOS_LEE = [
    {
        id: 'tubo',
        titulo: 'Tubo endotraqueal',
        consigna: 'Toca en la placa dónde crees que está la punta del tubo y elige tu lectura.',
        img: 'js/modules/neumologia/img/neumo-fig28-1-radiografia-tubo-et.jpg',
        alt: 'Radiografía de tórax portátil',
        fuente: { texto: 'Marino, The ICU Book, fig. 28.1', corto: 'Marino', pdf: 'docs/marino-2024-respiratory-management-caps27-30.pdf', pagina: 18 },
        pieAntes: 'Placa portátil de tórax.',
        pie: 'Tubo endotraqueal bien colocado.',
        zonas: [
            { id: 'punta', forma: 'circulo', x: R28[0].punto[0], y: R28[0].punto[1], r: 1.5, rotulo: 'Punta del tubo', cita: 'pie de la fig. 28.1' },
            { id: 'carina', forma: 'circulo', x: R28[1].punto[0], y: R28[1].punto[1], r: 1.5, rotulo: 'Carina', cita: 'pie de la fig. 28.1' },
        ],
        toque: { zona: 'punta', confunde: 'carina', tolerancia: 7, desplazaY: 6, regla: 'El tubo va de 3 a 5 cm por encima de la carina (pág. 18).' },
        tapar: [{ x: 84, y: 8, w: 16, h: 14 }, { x: 52.5, y: 29.1, w: 15.5, h: 9 }, { x: 50.4, y: 46.9, w: 15.2, h: 4.6 }, { x: 10, y: 62, w: 15, h: 5 }, { x: 72, y: 66, w: 15, h: 5 }],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'Con la cabeza en posición neutra, la punta va de 3 a 5 cm por encima de la bifurcación traqueal.', esError: false, explicacion: 'Cierto: es el objetivo de Marino (pág. 18).' },
                { texto: 'Si la carina no se ve en la placa portátil, se localiza al nivel del espacio T4-T5.', esError: false, explicacion: 'Cierto: Marino (pág. 18).' },
                { texto: 'Flexionar o extender el cuello no mueve la punta: la placa vale igual con la cabeza en cualquier posición.', esError: true, explicacion: 'Falso: la flexión o extensión de la cabeza y el cuello desplaza 2 cm la punta del tubo (Marino, pág. 18); por eso se compara con la cabeza en posición neutra.' },
                { texto: 'Si el tubo avanza demasiado, suele acabar en el bronquio principal derecho.', esError: false, explicacion: 'Cierto: sigue un curso más recto desde la tráquea, y el pulmón izquierdo queda sin ventilar (Marino, págs. 18-19).' },
            ],
        },
        pregunta: {
            enunciado: 'Elige tu lectura.',
            elecciones: ['Bien colocado', 'Muy alto', 'Muy bajo o en el bronquio derecho'],
            correcta: 0,
            porque: [null, null, 'Los tubos que avanzan acaban a menudo en el bronquio principal derecho (pág. 18).'],
            explicacion: 'Según el pie de la figura, el tubo está bien colocado.',
        },
        frase: 'Con la cabeza en posición neutra, la punta debe estar de 3 a 5 cm por encima de la bifurcación traqueal, o a medio camino entre la bifurcación y las cuerdas vocales. Si la carina no se ve, se localiza al nivel del espacio T4-T5.',
        ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-vias-artificiales', res: '#neumo-et-altura', rot: 'Vías artificiales (Merino Neumología)' },
    },
    {
        // Sin zonas ni toque: el pie de la fig. 2.6 da la posición («a la altura de la carina») pero no unas coordenadas; el punto
        // que la app situaba antes en la placa no salía de la fuente, así que se quitó y queda como pregunta de lectura.
        id: 'via',
        titulo: 'Vía central',
        consigna: 'Mira la placa, decide dónde termina la punta del catéter y elige tu lectura.',
        img: 'js/modules/libros/img/mar-fig2-6-punta-carina.jpg',
        alt: 'Radiografía de tórax portátil',
        fuente: { texto: 'Marino, The ICU Book, fig. 2.6', corto: 'Marino', pdf: 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf', pagina: 36 },
        pieAntes: 'Placa portátil de tórax (imagen mejorada digitalmente, según el pie).',
        pie: 'Catéter venoso central bien colocado (el pie da la figura como imagen mejorada digitalmente).',
        tapar: [{ x: 84, y: 8, w: 16, h: 14 }, { x: 22.5, y: 46.2, w: 21.6, h: 4.8 }, { x: 45, y: 59.2, w: 9.7, h: 4.9 }, { x: 48.4, y: 51.8, w: 2.6, h: 7 }, { x: 10, y: 62, w: 15, h: 5 }, { x: 72, y: 66, w: 15, h: 5 }],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'La carina está justo encima de la unión entre la cava superior y la aurícula derecha.', esError: false, explicacion: 'Cierto: es la referencia de la figura 2.6 (Marino, pág. 36).' },
                { texto: 'El objetivo es la punta en la cava superior, 1-2 cm por encima de la aurícula derecha.', esError: false, explicacion: 'Cierto (Marino, pág. 36).' },
                { texto: 'Lo ideal es que la punta entre en la aurícula derecha, para que el catéter no se salga.', esError: true, explicacion: 'Falso: el objetivo es la cava superior, 1-2 cm por encima de la aurícula (pág. 36), y la punta que perfora la aurícula causa taponamiento cardíaco, la complicación más grave del catéter central (pág. 46).' },
            ],
        },
        pregunta: {
            enunciado: 'Elige tu lectura.',
            elecciones: ['Demasiado baja (aurícula)', 'En la cava superior', 'Fuera del trayecto'],
            correcta: 1,
            porque: ['La carina está justo encima de la unión entre la cava superior y la aurícula derecha (pág. 36).'],
            explicacion: 'Según el pie de la figura, el catéter está bien colocado.',
        },
        frase: 'Posición adecuada: la carina está justo encima de la unión entre la cava superior y la aurícula derecha. El objetivo es la punta en la cava superior, 1-2 cm por encima de la aurícula derecha.',
        ver: { esp: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab: 'mar-cvc-complicaciones', res: '#mar-punta-rx', rot: 'Tras el catéter central (Marino, cap. 2)' },
    },
];

// Cuaderno «Placa portátil» (grupo P4c): sus ejercicios se montan desde radio-placa.js (dispositivos en la ficha 6, abdomen en la 7).
// Van aparte de EJERCICIOS_LEE para no mezclarse con los de otros cuadernos.
export const EJERCICIOS_PLACA_DISP = [
    {
        id: 'intub-sel',
        titulo: 'Tubo en el bronquio derecho',
        consigna: 'Mira la placa y toca las zonas para ver lo que rotula el libro; después busca el error.',
        img: 'js/modules/neumologia/img/neumo-fig28-2-radiografia-intubacion-selectiva.jpg',
        alt: 'Radiografía de tórax portátil',
        fuente: { texto: 'Marino, The ICU Book, fig. 28.2', corto: 'Marino', pdf: 'docs/marino-2024-respiratory-management-caps27-30.pdf', pagina: 19 },
        pieAntes: 'Placa portátil de tórax.',
        pie: 'Intubación del bronquio principal derecho y atelectasia del pulmón izquierdo no ventilado (pie de la fig. 28.2; imagen de la referencia 5 del libro).',
        zonas: [
            { id: 'punta', forma: 'circulo', x: 45.4, y: 45.2, r: 2.2, rotulo: 'Punta del tubo, en el bronquio principal derecho', cita: 'rótulo impreso en la fig. 28.2 y pie de la figura' },
            { id: 'atelect', forma: 'rect', x: 56, y: 30, w: 38, h: 52, rotulo: 'Pulmón izquierdo no ventilado, con atelectasia', cita: 'pie de la fig. 28.2' },
        ],
        tapar: [{ x: 27, y: 43, w: 19, h: 8 }],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'El tubo está en el bronquio principal derecho.', esError: false, explicacion: 'Cierto: es lo que dice el pie de la figura 28.2 (Marino, pág. 19).' },
                { texto: 'El pulmón izquierdo no se ventila y tiene atelectasia.', esError: false, explicacion: 'Cierto: el pie de la figura 28.2 lo da así (pág. 19).' },
                { texto: 'El tubo ha subido: la punta está por encima de la carina, en la tráquea alta.', esError: true, explicacion: 'Falso: el pie habla de intubación del bronquio principal derecho. Cuando los tubos se mueven hacia los pulmones, a menudo terminan en el bronquio derecho, que sigue un curso más recto desde la tráquea (págs. 18-19).' },
                { texto: 'Mantener la punta a no más de 21 cm de los dientes en la mujer y 23 cm en el hombre reduce el riesgo de migración.', esError: false, explicacion: 'Cierto (Marino, pág. 19).' },
            ],
        },
        ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-vias-artificiales', res: '#neumo-et-altura', rot: 'Vías artificiales (Merino Neumología)' },
    },
    {
        id: 'via-perf',
        titulo: 'Catéter subclavio contra la cava superior',
        consigna: 'Mira la placa y toca las zonas para ver lo que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig3-1-perforacion-vcs.jpg',
        alt: 'Dos radiografías de tórax con un catéter subclavio',
        fuente: { texto: 'Marino, The ICU Book, fig. 3.1', corto: 'Marino', pdf: 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf', pagina: 46 },
        pieAntes: 'Dos placas: arriba y abajo.',
        pie: 'Arriba, catéter subclavio colocado de modo que perfora la cava superior; abajo, un catéter colocado igual que ya la ha perforado, con derrame pleural (pie de la fig. 3.1).',
        zonas: [
            { id: 'punta', forma: 'circulo', x: 36, y: 22.5, r: 3.2, rotulo: 'Punta contra la pared de la cava superior (panel superior)', cita: 'rótulo impreso en la fig. 3.1 y texto de la pág. 45' },
            { id: 'derrame', forma: 'rect', x: 3, y: 78, w: 40, h: 20, rotulo: 'Derrame pleural (panel inferior)', cita: 'rótulo impreso en la fig. 3.1 y texto de la pág. 45' },
        ],
        tapar: [{ x: 10, y: 20.5, w: 25, h: 7.5 }, { x: 15, y: 91.5, w: 21, h: 7.5 }],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'La punta del catéter roza la pared lateral de la cava superior en lugar de girar hacia la aurícula.', esError: false, explicacion: 'Cierto: es lo que pasa cuando un catéter izquierdo no hace el giro hacia abajo (Marino, pág. 45).' },
                { texto: 'El derrame pleural puede estar formado en gran parte por el líquido intravenoso que se escapa.', esError: false, explicacion: 'Cierto (pág. 46).' },
                { texto: 'Si se sospecha la perforación, se sigue infundiendo por el catéter mientras se confirma.', esError: true, explicacion: 'Falso: al sospecharla se detiene la infusión de inmediato (pág. 46).' },
                { texto: 'Se confirma inyectando contraste por el catéter y viendo el contraste en el mediastino o el espacio pleural.', esError: false, explicacion: 'Cierto (pág. 46).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab: 'mar-cvc-complicaciones', res: '#mar-perforacion-vcs', rot: 'Perforación de la cava (Marino, cap. 3)' },
    },
    {
        id: 'sonda-ok',
        titulo: 'Sonda de alimentación bien colocada',
        consigna: 'Mira la placa y toca las zonas para ver lo que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig49-2-sonda-correcta.jpg',
        alt: 'Radiografía de tórax portátil con una sonda de alimentación',
        fuente: { texto: 'Marino, The ICU Book, fig. 49.2', corto: 'Marino', pdf: 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf', pagina: 28 },
        pieAntes: 'Placa portátil de tórax tras colocar la sonda.',
        pie: 'Colocación correcta de la sonda de alimentación nasogástrica; no se empieza a alimentar hasta verificarla con la radiografía (pie de la fig. 49.2).',
        zonas: [
            { id: 'recta', forma: 'rect', x: 48.5, y: 2, w: 5, h: 86, rotulo: 'La sonda baja recta por el mediastino', cita: 'rótulo impreso en la fig. 49.2 y texto de la pág. 29' },
            { id: 'punta', forma: 'circulo', x: 82.3, y: 83, r: 3, rotulo: 'Punta por debajo de la cúpula del hemidiafragma', cita: 'rótulo impreso en la fig. 49.2' },
        ],
        tapar: [{ x: 14, y: 32, w: 33, h: 10 }, { x: 70, y: 62, w: 16, h: 19 }],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'La sonda baja recta por el mediastino y la punta queda bajo la cúpula del hemidiafragma.', esError: false, explicacion: 'Cierto: es lo que rotula la figura 49.2 (Marino, pág. 28).' },
                { texto: 'Antes de esta placa, oír un soplido de aire en el epigastrio ya confirmaba que la sonda estaba en el estómago.', esError: true, explicacion: 'Falso: un chorro de aire en el pulmón también se oye en el epigastrio; la prueba puede engañar y debe abandonarse (pág. 27).' },
                { texto: 'La ecografía confirma el estómago con sensibilidad del 96% y especificidad del 91%, pero no ha sustituido a la radiografía.', esError: false, explicacion: 'Cierto (pág. 28).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoNutricion', panel: 'panel-marino-nutri-tabs', tab: 'mu-pauta-enteral', res: '#mu-sonda-rx', rot: 'Alimentación enteral (Marino, cap. 49)' },
    },
    {
        id: 'sonda-pulmon',
        titulo: 'Sonda de alimentación en el pulmón',
        consigna: 'Mira la placa y toca las zonas para ver lo que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig49-3-sonda-pulmon.jpg',
        alt: 'Radiografía de tórax portátil con una sonda de alimentación en el pulmón derecho',
        fuente: { texto: 'Marino, The ICU Book, fig. 49.3', corto: 'Marino', pdf: 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf', pagina: 29 },
        pieAntes: 'Placa portátil de tórax tras colocar la sonda.',
        pie: 'Sonda de alimentación en el pulmón derecho (pie de la fig. 49.3; imagen retocada digitalmente, según el pie).',
        zonas: [
            { id: 'punta', forma: 'circulo', x: 17, y: 84, r: 3.5, rotulo: 'Punta de la sonda en el pulmón derecho', cita: 'pie de la fig. 49.3' },
        ],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'La sonda se desvía a la derecha a la altura de la bifurcación traqueal, siguiendo el bronquio principal derecho.', esError: false, explicacion: 'Cierto (Marino, pág. 28).' },
                { texto: 'Por ser fina y blanda, esta sonda no puede llegar hasta la pleura.', esError: true, explicacion: 'Falso: son sondas finas que se avanzan con un fiador rígido; pueden llegar lejos en el pulmón y romper hacia la pleura y producir un neumotórax (pág. 29).' },
                { texto: 'El CO2 medido por la sonda al avanzarla detecta la entrada en la vía aérea, pero no la colocación en el esófago.', esError: false, explicacion: 'Cierto: sensibilidad 96% y especificidad 99% para el pulmón; no detecta el esófago (pág. 29).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoNutricion', panel: 'panel-marino-nutri-tabs', tab: 'mu-pauta-enteral', res: '#mu-sonda-mal', rot: 'Sonda mal colocada (Marino, cap. 49)' },
    },
];

export const EJERCICIOS_PLACA_ABD = [
    {
        id: 'megacolon',
        titulo: 'Megacolon tóxico por C. difficile',
        consigna: 'Mira la placa de abdomen y busca el error entre las lecturas.',
        img: 'js/modules/libros/img/mar-fig41-2-megacolon-toxico.jpg',
        alt: 'Radiografía de abdomen con colon muy dilatado',
        fuente: { texto: 'Marino, The ICU Book, fig. 41.2', corto: 'Marino', pdf: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf', pagina: 28 },
        pieAntes: 'Radiografía de abdomen.',
        pie: 'Aspecto radiográfico del megacolon tóxico en una enterocolitis por C. difficile (pie de la fig. 41.2). El libro no rotula estructuras en la imagen, por eso no hay zonas.',
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'El megacolon tóxico es una urgencia quirúrgica.', esError: false, explicacion: 'Cierto (Marino, pág. 28).' },
                { texto: 'Es la complicación más temida de la forma fulminante, que ocurre en el 3-5% de los casos.', esError: false, explicacion: 'Cierto (pág. 28).' },
                { texto: 'Es la complicación habitual de la forma leve, con diarrea acuosa, fiebre baja y leucocitosis ligera.', esError: true, explicacion: 'Falso: la forma leve cursa con fiebre ≤101 °F y leucocitos <15.000/mm³; la fulminante añade hipotensión y distensión por íleo o megacolon tóxico (pág. 28).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab: 'ma-cdifficile', res: '#mar-img-41-2', rot: 'C. difficile (Marino, cap. 41)' },
    },
    {
        id: 'neumoperitoneo',
        titulo: 'Aire libre bajo los diafragmas',
        consigna: 'Mira la imagen y toca la zona que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig41-4-neumoperitoneo.jpg',
        alt: 'Radiografía de tórax de pie',
        fuente: { texto: 'Marino, The ICU Book, fig. 41.4', corto: 'Marino', pdf: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf', pagina: 32 },
        pieAntes: 'Radiografía de tórax de pie.',
        pie: 'Aire libre bajo ambos hemidiafragmas (pie de la fig. 41.4).',
        zonas: [
            { id: 'der', forma: 'rect', x: 5, y: 73, w: 40, h: 9, rotulo: 'Aire libre bajo el hemidiafragma derecho', cita: 'pie de la fig. 41.4' },
            { id: 'izq', forma: 'rect', x: 58, y: 75, w: 38, h: 9, rotulo: 'Aire libre bajo el hemidiafragma izquierdo', cita: 'pie de la fig. 41.4' },
        ],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'El aire bajo el diafragma en una placa de tórax de pie tiene una sensibilidad de hasta el 85% para la perforación intestinal.', esError: false, explicacion: 'Cierto (Marino, pág. 31).' },
                { texto: 'La TC es más sensible que la radiografía simple y localiza el sitio de la perforación en el 85% de los casos.', esError: false, explicacion: 'Cierto (pág. 31).' },
                { texto: 'Aire libre en una placa de la primera semana tras una laparotomía confirma una perforación.', esError: true, explicacion: 'Falso: tras la cirugía el neumoperitoneo no es un hallazgo útil, porque puede persistir al menos una semana (pág. 31).' },
                { texto: 'Ante una perforación, lo primero suele ser la exploración quirúrgica inmediata.', esError: false, explicacion: 'Cierto (pág. 32).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab: 'ma-infeccion-abdominal', res: '#mar-img-41-4', rot: 'Perforación intestinal (Marino, cap. 41)' },
    },
    {
        id: 'pancr-edema',
        titulo: 'Pancreatitis edematosa',
        consigna: 'Mira la imagen y toca la zona que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig40-1-pancreatitis-edematosa.jpg',
        alt: 'TC de abdomen con contraste',
        fuente: { texto: 'Marino, The ICU Book, fig. 40.1', corto: 'Marino', pdf: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf', pagina: 19 },
        pieAntes: 'TC de abdomen con contraste.',
        pie: 'Pancreatitis edematosa: el páncreas (contorno punteado) está aumentado de tamaño y realza por completo; el borde borroso es característico del edema (pie de la fig. 40.1).',
        zonas: [
            { id: 'pancreas', forma: 'rect', x: 43, y: 39, w: 28, h: 26, rotulo: 'Páncreas aumentado de tamaño, que realza por completo (contorno punteado)', cita: 'pie de la fig. 40.1' },
        ],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'El páncreas está aumentado de tamaño y realza por completo con el contraste.', esError: false, explicacion: 'Cierto (Marino, pág. 19).' },
                { texto: 'El borde pancreático borroso es característico del edema.', esError: false, explicacion: 'Cierto (pág. 19).' },
                { texto: 'Un páncreas que realza entero con contraste indica pancreatitis necrotizante.', esError: true, explicacion: 'Falso: la necrosis es un área sin realce con el contraste; un páncreas que realza por completo es el patrón edematoso (pág. 19).' },
                { texto: 'Sin contraste intravenoso la TC distingue peor la forma edematosa de la necrotizante; la resonancia es una alternativa.', esError: false, explicacion: 'Cierto (pág. 19).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab: 'ma-pancreatitis-dx', res: '#mar-img-40-1', rot: 'Pancreatitis aguda: diagnóstico (Marino, cap. 40)' },
    },
    {
        id: 'pancr-necrosis',
        titulo: 'Pancreatitis necrotizante',
        consigna: 'Mira la imagen y toca la zona que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig40-2-pancreatitis-necrotizante.jpg',
        alt: 'TC de abdomen con contraste',
        fuente: { texto: 'Marino, The ICU Book, fig. 40.2', corto: 'Marino', pdf: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf', pagina: 20 },
        pieAntes: 'TC de abdomen con contraste; las flechas están en la imagen original.',
        pie: 'Pancreatitis necrotizante: el área sin realce (flechas) es necrosis del cuello y el cuerpo del páncreas (pie de la fig. 40.2; imagen de la referencia 8 del libro).',
        zonas: [
            { id: 'necrosis', forma: 'rect', x: 41, y: 34, w: 14, h: 14, rotulo: 'Área sin realce: necrosis en el cuello y el cuerpo del páncreas', cita: 'pie de la fig. 40.2' },
        ],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'El área sin realce con el contraste representa necrosis, y la pancreatitis se clasifica como necrotizante.', esError: false, explicacion: 'Cierto (Marino, pág. 19).' },
                { texto: 'La necrosis de la imagen está en el cuello y el cuerpo del páncreas.', esError: false, explicacion: 'Cierto: es lo que dice el pie de la figura 40.2 (pág. 20).' },
                { texto: 'Si la TC de los primeros días no muestra necrosis, queda descartada la pancreatitis necrotizante.', esError: true, explicacion: 'Falso: la necrosis puede no aparecer durante la primera semana; se repite la imagen si los síntomas persisten o la pancreatitis es grave (pág. 19).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab: 'ma-pancreatitis-dx', res: '#mar-img-40-2', rot: 'Pancreatitis aguda: diagnóstico (Marino, cap. 40)' },
    },
    {
        id: 'pancr-infectada',
        titulo: 'Necrosis pancreática con gas',
        consigna: 'Mira la imagen y toca la zona que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig40-3-necrosis-infectada.jpg',
        alt: 'TC de abdomen con contraste',
        fuente: { texto: 'Marino, The ICU Book, fig. 40.3', corto: 'Marino', pdf: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf', pagina: 22 },
        pieAntes: 'TC de abdomen con contraste.',
        pie: 'Necrosis extensa del páncreas con numerosas burbujas de gas, que indican infección (pie de la fig. 40.3).',
        zonas: [
            { id: 'gas', forma: 'rect', x: 45, y: 28, w: 42, h: 28, rotulo: 'Burbujas de gas dentro de la necrosis: indican infección', cita: 'pie de la fig. 40.3' },
        ],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'Las burbujas de gas en la necrosis indican probable infección.', esError: false, explicacion: 'Cierto (Marino, pág. 22).' },
                { texto: 'Si se sospecha infección, se empieza antibiótico con cobertura de gramnegativos entéricos.', esError: false, explicacion: 'Cierto (pág. 22).' },
                { texto: 'Los antibióticos profilácticos reducen las infecciones del páncreas y están recomendados.', esError: true, explicacion: 'Falso: no reducen la incidencia de infección pancreática y no se recomiendan (pág. 22).' },
                { texto: 'Si el tratamiento no invasivo falla, puede hacer falta drenaje guiado por TC o desbridamiento quirúrgico.', esError: false, explicacion: 'Cierto (pág. 22).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab: 'ma-pancreatitis-tto', res: '#mar-img-40-3', rot: 'Pancreatitis aguda: tratamiento (Marino, cap. 40)' },
    },
    {
        id: 'absceso',
        titulo: 'Absceso tras esplenectomía',
        consigna: 'Mira la imagen y toca la zona que rotula el libro; después busca el error.',
        img: 'js/modules/libros/img/mar-fig41-5-absceso-abdominal.jpg',
        alt: 'TC de abdomen',
        fuente: { texto: 'Marino, The ICU Book, fig. 41.5', corto: 'Marino', pdf: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf', pagina: 35 },
        pieAntes: 'TC de abdomen.',
        pie: 'Absceso multiloculado en el cuadrante superior izquierdo, en un paciente tras una esplenectomía (pie de la fig. 41.5).',
        zonas: [
            { id: 'absceso', forma: 'rect', x: 58, y: 25, w: 34, h: 55, rotulo: 'Absceso multiloculado del cuadrante superior izquierdo', cita: 'rótulo impreso en la fig. 41.5 y pie de la figura' },
        ],
        tapar: [{ x: 71, y: 43, w: 12.5, h: 7 }],
        error: {
            enunciado: 'Encuentra el error: una de estas lecturas es falsa.',
            opciones: [
                { texto: 'El drenaje guiado por TC tiene éxito en el 90-95% de los abscesos y rara vez hace falta cirugía.', esError: false, explicacion: 'Cierto (Marino, pág. 35).' },
                { texto: 'La TC en la primera semana tras la cirugía es lo más fiable, porque ya no queda líquido libre.', esError: true, explicacion: 'Falso: en el posoperatorio precoz, colecciones de sangre o del líquido de irrigación se pueden confundir con un absceso; la TC es más fiable después de la primera semana (pág. 34).' },
                { texto: 'La falta de dolor localizado no descarta el absceso: falta en el 60% de los casos, y la masa palpable aparece en menos del 10%.', esError: false, explicacion: 'Cierto (pág. 34).' },
            ],
        },
        ver: { esp: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab: 'ma-infeccion-abdominal', res: '#mar-img-41-5', rot: 'Absceso abdominal (Marino, cap. 41)' },
    },
];
