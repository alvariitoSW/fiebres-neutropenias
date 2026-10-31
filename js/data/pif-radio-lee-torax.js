// Ejercicios «Lee la imagen» del cuaderno Tórax de UCI (PIF Radiología). Datos puros; esquema en js/data/pif-radio-lee.js.
// Cada rótulo de zona repite lo que dice el pie de la figura (o el texto de la página citada); si la fuente no ubica la
// estructura, no hay zona. Las coordenadas son % de la imagen. La imagen es la ya extraída de la ficha, nunca una copia.
const NEU = 'js/modules/neumologia/img/';
const M22 = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const M27 = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const MC = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const MH = 'docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf';
const LA = 'docs/libro-azul-seccion-iv-respiratorio-parte1.pdf';
const marino = (n, pdf, pagina) => ({ texto: `Marino, The ICU Book, fig. ${n}`, corto: 'Marino', pdf, pagina });
const ALT = 'Imagen real de tórax';

// ---- Pestaña «Neumotórax y derrame» (radio-t1)
const T1 = [
    {
        id: 'tx-neumo-tc', ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-cuidado-barotrauma', rot: 'Barotrauma (Merino Neumología)' },
        titulo: 'Neumotórax que la placa no ve',
        consigna: 'Arriba, la placa portátil; abajo, la TC del mismo paciente. Toca una zona para destapar su rótulo.',
        img: NEU + 'neumo-fig28-5-radiografia-tc-neumotorax.jpg', alt: ALT + ': placa portátil y TC con neumotórax anterior',
        fuente: marino('28.5', M27, 27),
        pieAntes: 'Placa portátil y TC de tórax de un varón joven con traumatismo torácico cerrado.',
        pie: 'Placa portátil y TC de un varón joven con traumatismo torácico cerrado: el neumotórax anterior se ve en la TC (asterisco) y no es evidente en la placa portátil.',
        zonas: [
            { id: 'tc', forma: 'rect', x: 48, y: 59.5, w: 36, h: 14, rotulo: 'Neumotórax anterior (en la TC)', cita: 'pie de la fig. 28.5' },
            { id: 'rx', forma: 'rect', x: 15, y: 8, w: 70, h: 32, rotulo: 'En la placa portátil no es evidente', cita: 'pie de la fig. 28.5' },
        ],
        tapar: [{ x: 68.5, y: 63.5, w: 4, h: 3.2 }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'La placa portátil muestra con claridad el neumotórax anterior.', esError: true, explicacion: 'El pie dice que el neumotórax anterior se ve en la TC y no es evidente en la placa portátil (pág. 27).' },
                { texto: 'El neumotórax anterior se ve en la TC, señalado con un asterisco.', esError: false, explicacion: 'Así lo señala el pie de la figura (pág. 27).' },
                { texto: 'Es el estudio de un varón joven con traumatismo torácico cerrado.', esError: false, explicacion: 'Es la descripción del pie de la figura (pág. 27).' },
            ],
        },
    },
    {
        id: 'tx-tension', ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-cuidado-barotrauma', rot: 'Barotrauma (Merino Neumología)' },
        titulo: 'Neumotórax a tensión',
        consigna: 'Toca cada zona de la placa para destapar lo que nombra el pie de la figura.',
        img: NEU + 'neumo-fig28-7-radiografia-neumotorax-tension.jpg', alt: ALT + ': neumotórax a tensión izquierdo',
        fuente: marino('28.7', M27, 29),
        pieAntes: 'Radiografía de tórax.',
        pie: 'Neumotórax a tensión: sin trama pulmonar en el hemitórax izquierdo, hemidiafragma izquierdo deprimido y mediastino desplazado al lado contrario (placa de la referencia 30 de Marino).',
        zonas: [
            { id: 'trama', forma: 'rect', x: 53, y: 12, w: 39, h: 62, rotulo: 'Sin trama pulmonar en el hemitórax izquierdo', cita: 'pie de la fig. 28.7' },
            { id: 'diaf', forma: 'rect', x: 56, y: 76, w: 32, h: 16, rotulo: 'Hemidiafragma izquierdo deprimido', cita: 'pie de la fig. 28.7' },
            { id: 'media', forma: 'rect', x: 32, y: 35, w: 20, h: 50, rotulo: 'Mediastino desplazado al lado contrario', cita: 'pie de la fig. 28.7' },
        ],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'Falta la trama pulmonar en el hemitórax izquierdo.', esError: false, explicacion: 'Es el primer signo que da el pie (pág. 29).' },
                { texto: 'El mediastino se desplaza hacia el lado contrario al neumotórax.', esError: false, explicacion: 'Lo dice el pie de la figura (pág. 29).' },
                { texto: 'El hemidiafragma izquierdo está deprimido.', esError: false, explicacion: 'Lo dice el pie de la figura (pág. 29).' },
            ],
        },
    },
];

// ---- Pestaña «Patrones y edema» (radio-t2)
const T2 = [
    {
        id: 'tx-sdra-rx', ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-sdra-diagnostico', rot: 'Diagnóstico del SDRA (Merino Neumología)' },
        titulo: 'SDRA en la placa',
        consigna: 'Dos placas del mismo síndrome. Toca cada zona para destapar su rótulo.',
        img: NEU + 'neumo-fig24-2-radiografia-sdra.jpg', alt: ALT + ': dos radiografías de SDRA',
        fuente: marino('24.2', M22, 38),
        pieAntes: 'Dos radiografías de tórax de pacientes con la misma enfermedad.',
        pie: 'Arriba, el aspecto clásico del SDRA: infiltrados finamente granulares repartidos de forma uniforme por ambos pulmones. Abajo (SDRA por sepsis gramnegativa): infiltrados bilaterales confinados a los campos inferiores, con borramiento del hemidiafragma izquierdo que sugiere derrame pleural.',
        zonas: [
            { id: 'clasico', forma: 'rect', x: 8, y: 8, w: 84, h: 38, rotulo: 'Infiltrados finamente granulares, repartidos por igual en ambos pulmones', cita: 'pie de la fig. 24.2 (panel superior)' },
            { id: 'bajos', forma: 'rect', x: 8, y: 70, w: 78, h: 24, rotulo: 'Infiltrados bilaterales confinados a los campos inferiores', cita: 'pie de la fig. 24.2 (panel inferior)' },
            { id: 'diaf', forma: 'rect', x: 55, y: 86, w: 33, h: 11, rotulo: 'Borramiento del hemidiafragma izquierdo: sugiere derrame pleural', cita: 'pie de la fig. 24.2 (panel inferior)' },
        ],
        tapar: [{ x: 8, y: 9.5, w: 12, h: 3 }, { x: 7, y: 51.8, w: 10.5, h: 2.8 }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'Panel superior: infiltrados finamente granulares, uniformes en ambos pulmones.', esError: false, explicacion: 'Es el aspecto clásico que describe el pie (pág. 38).' },
                { texto: 'Panel inferior: infiltrados bilaterales limitados a los campos inferiores.', esError: false, explicacion: 'Lo dice el pie para el caso por sepsis gramnegativa (pág. 38).' },
                { texto: 'Panel superior: los infiltrados son asimétricos y de predominio unilateral.', esError: true, explicacion: 'El pie los describe uniformes en ambos pulmones (pág. 38).' },
                { texto: 'Panel inferior: el borramiento del hemidiafragma derecho sugiere un derrame pleural.', esError: true, explicacion: 'El pie habla del hemidiafragma izquierdo, no del derecho (pág. 38).' },
            ],
        },
    },
    {
        id: 'tx-trali', ver: { esp: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab: 'merino-riesgos', res: '#mh-fig-12-5', rot: 'Riesgos transfusionales (Merino HEMATO)' },
        titulo: 'Infiltrado homogéneo',
        consigna: 'Placa portátil de un paciente tras una transfusión. Toca la zona para destapar su rótulo.',
        img: 'js/modules/merino-hemato/img/fig1-cxr-trali.jpg', alt: ALT + ': placa portátil con infiltrados bilaterales',
        fuente: { texto: 'Marino, The ICU Book, fig. 12.5', corto: 'Marino', pdf: MH, pagina: 15 },
        pieAntes: 'Placa portátil de tórax.',
        pie: 'Placa portátil de un paciente con lesión pulmonar aguda relacionada con la transfusión (TRALI): patrón de infiltración homogéneo en los pulmones, característico de la lesión pulmonar inflamatoria.',
        zonas: [{ id: 'homo', forma: 'rect', x: 12, y: 12, w: 76, h: 80, rotulo: 'Patrón de infiltración homogéneo en los pulmones', cita: 'pie de la fig. 12.5' }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'Los infiltrados irradian desde los hilios, como en el edema cardiogénico.', esError: true, explicacion: 'El pie de la fig. 12.5 habla de un patrón homogéneo (pág. 15); los infiltrados que irradian desde los hilios son los del edema cardiogénico (fig. 18.4, Marino, pág. 8 del capítulo de cardiología).' },
                { texto: 'Es una placa portátil de un paciente con TRALI.', esError: false, explicacion: 'Es la descripción del pie (pág. 15).' },
                { texto: 'El patrón de infiltración homogéneo es característico de la lesión pulmonar inflamatoria.', esError: false, explicacion: 'Lo dice el pie de la figura (pág. 15).' },
            ],
        },
    },
    {
        id: 'tx-edema', ver: { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab: 'mc-ic-tipos', res: '#mc-fig-18-4', rot: 'Tipos de IC (Merino Cardiología)' },
        titulo: 'Edema cardiogénico',
        consigna: 'Placa portátil de un paciente con insuficiencia cardíaca aguda. Toca la zona para destapar su rótulo.',
        img: 'js/modules/cardiologia/img/mc-fig18-4-edema-pulmonar.jpg', alt: ALT + ': edema pulmonar cardiogénico',
        fuente: { texto: 'Marino, The ICU Book, fig. 18.4', corto: 'Marino', pdf: MC, pagina: 8 },
        pieAntes: 'Placa portátil de tórax.',
        pie: 'Placa portátil de un paciente con insuficiencia cardíaca aguda y edema pulmonar: los infiltrados irradian desde las regiones hiliares, un rasgo que distingue el edema cardiogénico del no cardiogénico.',
        zonas: [{ id: 'hilios', forma: 'rect', x: 25, y: 24, w: 50, h: 50, rotulo: 'Infiltrados que irradian desde las regiones hiliares', cita: 'pie de la fig. 18.4' }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'Los infiltrados irradian desde los hilios.', esError: false, explicacion: 'Es el rasgo que señala el pie (pág. 8).' },
                { texto: 'Un infiltrado repartido de forma homogénea por todo el pulmón es lo que distingue el edema cardiogénico.', esError: true, explicacion: 'El rasgo que distingue el cardiogénico del no cardiogénico es que los infiltrados irradian desde los hilios (pág. 8); el patrón homogéneo es el del TRALI (fig. 12.5).' },
                { texto: 'Es una placa portátil de un paciente con insuficiencia cardíaca aguda.', esError: false, explicacion: 'Es la descripción del pie (pág. 8).' },
            ],
        },
    },
    {
        id: 'tx-posicion', ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-nav-diagnostico', rot: 'Diagnóstico en ventilación (Merino Neumología)' },
        titulo: 'Posición y volumen',
        consigna: 'Dos placas del mismo paciente, con minutos de diferencia. Toca cada zona para destapar su rótulo.',
        img: NEU + 'neumo-fig29-3-radiografias-posicion.jpg', alt: ALT + ': dos placas, supina en espiración y de pie en inspiración',
        fuente: marino('29.3', M27, 41),
        pieAntes: 'Dos placas del mismo paciente.',
        pie: 'Efecto de la posición y del volumen pulmonar en una placa portátil: la placa supina tras espirar muestra la trama aglomerada en la base derecha, que podría confundirse con una neumonía basal en un paciente con fiebre. Imagen de la izquierda mejorada digitalmente.',
        zonas: [
            { id: 'trama', forma: 'rect', x: 6, y: 34, w: 15, h: 24, rotulo: 'Trama aglomerada en la base derecha: podría confundirse con una neumonía basal', cita: 'pie de la fig. 29.3' },
            { id: 'supina', forma: 'rect', x: 0.5, y: 3, w: 47, h: 30, rotulo: 'Placa supina, tomada tras espirar', cita: 'pie de la fig. 29.3' },
        ],
        tapar: [{ x: 5, y: 52, w: 12, h: 12 }, { x: 11, y: 84.5, w: 27, h: 8 }, { x: 61, y: 84.5, w: 28.5, h: 8 }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'Las dos placas son del mismo paciente, hechas con minutos de diferencia.', esError: false, explicacion: 'Así lo dice el pie (pág. 41).' },
                { texto: 'La trama aglomerada de la base derecha confirma una neumonía basal.', esError: true, explicacion: 'El pie dice que podría confundirse con una neumonía basal: es el efecto de la posición y del volumen, no una neumonía (pág. 41).' },
                { texto: 'La placa supina tomada tras espirar es la que muestra la trama aglomerada.', esError: false, explicacion: 'Lo dice el pie de la figura (pág. 41).' },
            ],
        },
    },
];

// ---- Pestaña «Introducción a la TC» (radio-t3)
const T3 = [
    {
        id: 'tx-sdra-tc', ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-sdra-diagnostico', rot: 'Diagnóstico del SDRA (Merino Neumología)' },
        titulo: 'SDRA en la TC',
        consigna: 'Dos cortes de TC en fases distintas del SDRA. Toca cada zona para destapar su rótulo.',
        img: NEU + 'neumo-fig24-3-tc-sdra.jpg', alt: ALT + ': dos cortes de TC de SDRA',
        fuente: marino('24.3', M22, 38),
        pieAntes: 'Dos cortes de TC de tórax, en fases distintas de la enfermedad.',
        pie: 'Arriba, fase precoz del SDRA: consolidación densa en las regiones posteriores del pulmón. Abajo, fase avanzada: infiltrados reticulares en todos los campos, con neumomediastino (flecha).',
        zonas: [
            { id: 'poster', forma: 'rect', x: 10, y: 27, w: 82, h: 18, rotulo: 'Consolidación densa en las regiones posteriores', cita: 'pie de la fig. 24.3 (panel superior)' },
            { id: 'reticular', forma: 'rect', x: 6, y: 60, w: 88, h: 33, rotulo: 'Infiltrados reticulares en todos los campos', cita: 'pie de la fig. 24.3 (panel inferior)' },
            { id: 'neumomed', forma: 'circulo', x: 69.5, y: 65, r: 4.5, rotulo: 'Neumomediastino', cita: 'pie de la fig. 24.3 (flecha)' },
        ],
        tapar: [{ x: 73, y: 62.3, w: 12, h: 3 }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'Corte superior: consolidación densa en las regiones posteriores, fase precoz.', esError: false, explicacion: 'Es lo que dice el pie para el panel superior (pág. 38).' },
                { texto: 'Corte inferior: la consolidación densa sigue limitada a las regiones posteriores, como al inicio.', esError: true, explicacion: 'En la fase avanzada el pie describe infiltrados reticulares en todos los campos, con neumomediastino (pág. 38).' },
                { texto: 'Corte inferior: infiltrados reticulares en todos los campos y neumomediastino.', esError: false, explicacion: 'Es lo que dice el pie para la fase avanzada (pág. 38).' },
            ],
        },
    },
    {
        id: 'tx-tep', ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-ep-diagnostico', res: '#nep-fig-22-1', rot: 'Embolia pulmonar: diagnóstico (Merino Neumología)' },
        titulo: 'Embolia pulmonar en la angio-TC',
        consigna: 'Angio-TC de tórax. Toca cada zona para destapar su rótulo.',
        img: NEU + 'neumo-fig22-1-tc-embolia-pulmonar.jpg', alt: ALT + ': angio-TC con defecto de relleno en la arteria pulmonar izquierda',
        fuente: marino('22.1', M22, 5),
        pieAntes: 'Angio-TC de tórax con contraste (imagen retocada digitalmente, según el pie).',
        pie: 'Angio-TC pulmonar: el émbolo aparece como un defecto de relleno en la arteria pulmonar principal izquierda. Ao = aorta, AP = arteria pulmonar. Imagen retocada digitalmente, según el pie.',
        zonas: [
            { id: 'defecto', forma: 'circulo', x: 62, y: 47, r: 3.3, rotulo: 'Defecto de relleno en la arteria pulmonar principal izquierda', cita: 'pie de la fig. 22.1' },
            { id: 'ap', forma: 'circulo', x: 53.5, y: 40.5, r: 5, rotulo: 'Arteria pulmonar', cita: 'pie de la fig. 22.1 (PA = arteria pulmonar)' },
            { id: 'ao', forma: 'circulo', x: 56, y: 58, r: 4, rotulo: 'Aorta', cita: 'pie de la fig. 22.1 (AO = aorta)' },
        ],
        tapar: [{ x: 50.5, y: 37, w: 5.5, h: 6 }, { x: 52.5, y: 54.5, w: 5.5, h: 6 }, { x: 67.5, y: 43.5, w: 12, h: 11 }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'El defecto de relleno está en la arteria pulmonar principal izquierda.', esError: false, explicacion: 'Es lo que dice el pie de la figura (pág. 5).' },
                { texto: 'El émbolo aparece como un defecto de relleno dentro de la arteria.', esError: false, explicacion: 'Es la descripción del pie (pág. 5).' },
                { texto: 'La imagen es una angio-TC pulmonar, retocada digitalmente según el pie.', esError: false, explicacion: 'El pie lo indica así (pág. 5).' },
            ],
        },
    },
    {
        id: 'tx-diseccion', ver: { esp: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab: 'mc-diseccion-aortica', res: '#mc-fig-20-4', rot: 'Disección aórtica (Merino Cardiología)' },
        titulo: 'Disección de aorta ascendente',
        consigna: 'TC con contraste. Toca cada zona para destapar su rótulo.',
        img: 'js/modules/cardiologia/img/mc-fig20-4-tc-diseccion-aortica.jpg', alt: ALT + ': TC con contraste con disección de la aorta ascendente',
        fuente: { texto: 'Marino, The ICU Book, fig. 20.4', corto: 'Marino', pdf: MC, pagina: 51 },
        pieAntes: 'TC con contraste de tórax.',
        pie: 'TC con contraste de una disección aguda en la aorta ascendente: el colgajo íntimo (flechas pequeñas) separa la luz verdadera de la falsa y distingue la disección de un aneurisma sacular. AP = arteria pulmonar, Ao descendente (DA).',
        zonas: [
            { id: 'flap', forma: 'rect', x: 44.5, y: 12, w: 5, h: 27, rotulo: 'Colgajo íntimo: separa la luz verdadera de la falsa', cita: 'pie de la fig. 20.4' },
            { id: 'verdadera', forma: 'rect', x: 31, y: 15, w: 13, h: 25, rotulo: 'Luz verdadera', cita: 'pie de la fig. 20.4 (rótulo impreso en la imagen)' },
            { id: 'falsa', forma: 'rect', x: 50, y: 15, w: 8, h: 25, rotulo: 'Luz falsa', cita: 'pie de la fig. 20.4 (rótulo impreso en la imagen)' },
            { id: 'da', forma: 'circulo', x: 58, y: 73, r: 5, rotulo: 'Aorta descendente', cita: 'pie de la fig. 20.4 (DA = aorta descendente)' },
        ],
        tapar: [{ x: 34.5, y: 20, w: 10, h: 10 }, { x: 46, y: 20.5, w: 10.5, h: 10 }, { x: 52, y: 70.5, w: 7.5, h: 5.5 }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'El colgajo íntimo separa la luz verdadera de la falsa.', esError: false, explicacion: 'Es lo que dice el pie (pág. 51).' },
                { texto: 'La disección está en la aorta descendente, no en la ascendente.', esError: true, explicacion: 'El pie habla de una disección aguda en la aorta ascendente; la descendente (DA) es la que se ve entera, sin colgajo (pág. 51).' },
                { texto: 'El colgajo íntimo distingue la disección de un aneurisma sacular.', esError: false, explicacion: 'Lo dice el pie de la figura (pág. 51).' },
            ],
        },
    },
    {
        id: 'tx-sponge',
        titulo: 'SDRA difuso («sponge lung»)',
        consigna: 'Un corte de TC y la placa portátil del mismo tipo de paciente. Toca la zona para destapar su rótulo.',
        img: 'js/modules/pif-radio/img/torax-libroazul-fig3-sdra-difuso.jpg', alt: ALT + ': TC y placa portátil de SDRA difuso',
        fuente: { texto: 'Libro Azul, cap. 28, fig. 3 (modificada de Rouby, Eur Respir J 2003;22(42):27s-36; el libro imprime «Roubby»)', corto: 'Libro Azul', pdf: LA, pagina: 65 },
        pieAntes: 'TC de tórax (izquierda) y radiografía portátil (derecha).',
        pie: 'SDRA difuso («sponge lung»): pérdida masiva de aireación repartida de forma homogénea por el parénquima pulmonar, con atenuaciones difusas y bilaterales en la TC.',
        zonas: [{ id: 'difuso', forma: 'rect', x: 2, y: 10, w: 48, h: 80, rotulo: 'Pérdida de aireación homogénea en ambos pulmones (atenuaciones difusas y bilaterales en la TC)', cita: 'texto del libro, pág. 448 impresa (PDF 64), y pie de la fig. 3' }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'En el SDRA difuso la pérdida de aireación se reparte de forma homogénea por el parénquima.', esError: false, explicacion: 'Es la definición del libro (pág. 448 impresa, PDF 64).' },
                { texto: 'En el SDRA difuso la pérdida de aireación afecta solo a los lóbulos inferiores.', esError: true, explicacion: 'Eso describe el SDRA focal; en el difuso la pérdida es homogénea y bilateral (pág. 448 impresa, PDF 64).' },
                { texto: 'En el SDRA difuso, una PEEP mayor de 10 cm H2O induce un reclutamiento marcado, sin sobredistensión de los lóbulos superiores.', esError: false, explicacion: 'Es lo que el libro atribuye a los autores citados (pág. 448 impresa, PDF 64).' },
            ],
        },
    },
    {
        id: 'tx-floody',
        titulo: 'SDRA focal («floody»)',
        consigna: 'Un corte de TC y su placa portátil. Toca la zona para destapar su rótulo.',
        img: 'js/modules/pif-radio/img/torax-libroazul-fig4-sdra-focal.jpg', alt: ALT + ': TC y placa portátil de SDRA focal',
        fuente: { texto: 'Libro Azul, cap. 28, fig. 4 (modificada de Rouby, Eur Respir J 2003;22(42):27s-36; el libro imprime «Roubby»)', corto: 'Libro Azul', pdf: LA, pagina: 65 },
        pieAntes: 'TC de tórax (izquierda) y radiografía portátil (derecha).',
        pie: 'SDRA focal («floody» u ocupación alveolar), en un corte de TC y su placa portátil.',
        zonas: [{ id: 'ocupacion', forma: 'rect', x: 2, y: 58, w: 46, h: 36, rotulo: 'Ocupación alveolar', cita: 'pie de la fig. 4 («floody» u ocupación alveolar)' }],
        error: {
            enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
            opciones: [
                { texto: 'En el SDRA focal la pérdida de aireación afecta solo a los lóbulos inferiores, con los superiores preservados.', esError: false, explicacion: 'Es la definición del libro (pág. 448 impresa, PDF 64).' },
                { texto: 'En el SDRA focal, una PEEP mayor de 10 cm H2O induce un reclutamiento marcado.', esError: true, explicacion: 'Según el libro, en el lobar ese nivel de PEEP no consiguió reclutar y se asoció con sobredistensión de las áreas aireadas; el reclutamiento marcado fue del SDRA difuso (pág. 448 impresa, PDF 64).' },
                { texto: 'En el SDRA focal, una PEEP mayor de 10 cm H2O se asoció con sobredistensión de las áreas previamente aireadas.', esError: false, explicacion: 'Lo dice el libro (pág. 448 impresa, PDF 64).' },
            ],
        },
    },
];

const HALO_A26 = {
    id: 'tx-halo',
    titulo: 'Signo del halo',
    consigna: 'TC de tórax de un paciente neutropénico. Toca la zona para destapar su rótulo.',
    img: 'js/modules/neutropenia-febril/img/aspergillus-signo-halo.jpg', alt: ALT + ': TC con signo del halo',
    fuente: { texto: 'Shroff S, et al. Clin Case Rep 2014;2(3):113-114, fig. 1', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4184607/', autor: 'Shroff S, Shroff GS, Yust-Katz S, Olar A, Tummala S, Tremont-Lukats IW', sitio: 'PMC', licencia: 'CC BY-NC-ND 3.0', licenciaUrl: 'https://creativecommons.org/licenses/by-nc-nd/3.0/' },
    pieAntes: 'TC de tórax de un varón de 35 años con síndrome mielodisplásico y neutropenia.',
    pie: 'TC de tórax: signo del halo (opacidad nodular rodeada de un halo en vidrio deslustrado) en el pulmón derecho.',
    zonas: [{ id: 'halo', forma: 'rect', x: 3, y: 34, w: 17, h: 26, rotulo: 'Opacidad nodular rodeada de un halo en vidrio deslustrado, en el pulmón derecho', cita: 'pie de la fig. 1 de Shroff 2014' }],
    error: {
        enunciado: 'Una de estas lecturas es un error. ¿Cuál?',
        opciones: [
            { texto: 'El nódulo central es la hemorragia y el halo es el nódulo fúngico.', esError: true, explicacion: 'Es al revés: el nódulo sólido es el nódulo fúngico o el infarto, y el halo en vidrio deslustrado representa la hemorragia (Shroff 2014).' },
            { texto: 'En un paciente inmunodeprimido, el signo del halo es muy sugestivo de infección fúngica angioinvasiva, sobre todo aspergilosis.', esError: false, explicacion: 'Lo dice el artículo (Shroff 2014).' },
            { texto: 'Una imagen idéntica puede verse en la mucormicosis.', esError: false, explicacion: 'Lo dice el artículo (Shroff 2014).' },
        ],
    },
};

export const EJERCICIOS_LEE_TORAX = { 'radio-t1': T1, 'radio-t2': T2, 'radio-t3': [...T3, HALO_A26] };
