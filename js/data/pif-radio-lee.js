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
