// Ejercicios de «Lee esta placa» (PIF Radiología, ficha 6). Datos puros: la lógica está en radio-lee.js.
// Coordenadas en % de la imagen (x desde la izquierda, y desde arriba). Radio de tolerancia: % del ancho pintado.
// Frases: las mismas que ya usan las tarjetas 2 y 3 (PASOS_TUBO / PASOS_VIA de radio-placa.js).
import { ROTULOS_MERINO_NEUMO } from './merino-neumo-rotulos.js';

const R28 = ROTULOS_MERINO_NEUMO['fig-28-1'].rotulos;   // punta del tubo y carina, de la fuente

export const EJERCICIOS_LEE = [
    {
        id: 'tubo',
        titulo: 'Tubo endotraqueal',
        consigna: 'Toca en la placa dónde crees que está la punta del tubo y elige tu lectura.',
        img: 'js/modules/neumologia/img/neumo-fig28-1-radiografia-tubo-et.jpg',
        alt: 'Radiografía de tórax portátil',
        pieAntes: 'Placa portátil de tórax. Marino, The ICU Book, fig. 28.1.',
        pie: 'Tubo endotraqueal bien colocado. Marino, The ICU Book, fig. 28.1.',
        regla: 'El tubo va de 3 a 5 cm por encima de la carina (pág. 18).',
        pdf: 'docs/marino-2024-respiratory-management-caps27-30.pdf', pag: 18,
        punto: R28[0].punto, textoPunto: 'Punta del tubo (según el pie de la fuente)',
        extra: { punto: R28[1].punto, texto: 'Carina' },
        tapar: [{ x: 84, y: 8, w: 16, h: 14 }, { x: 50.4, y: 29.1, w: 17.2, h: 9 }, { x: 50.4, y: 46.9, w: 15.2, h: 4.6 }],
        tolerancia: 7,
        elecciones: ['Bien colocado', 'Muy alto', 'Muy bajo o en el bronquio derecho'],
        correcta: 0,
        respuesta: 'Según el pie de la figura, el tubo está bien colocado.',
        frase: 'Con la cabeza en posición neutra, la punta debe estar de 3 a 5 cm por encima de la bifurcación traqueal, o a medio camino entre la bifurcación y las cuerdas vocales. Si la carina no se ve, se localiza al nivel del espacio T4-T5.',
        ver: { esp: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-vias-artificiales', res: '#neumo-et-altura', rot: 'Vías artificiales (Merino Neumología)' },
    },
    {
        id: 'via',
        titulo: 'Vía central',
        consigna: 'Toca en la placa dónde crees que termina la punta del catéter y elige tu lectura.',
        img: 'js/modules/libros/img/mar-fig2-6-punta-carina.jpg',
        alt: 'Radiografía de tórax portátil',
        pieAntes: 'Placa portátil de tórax. Marino, The ICU Book, fig. 2.6, imagen mejorada digitalmente.',
        regla: 'En la vía, la punta va a la altura de la carina o algo por encima (pág. 36).',
        pie: 'Catéter venoso central bien colocado. Marino, The ICU Book, fig. 2.6 (el pie la da como imagen mejorada digitalmente).',
        pdf: 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf', pag: 36,
        punto: [44.9, 48.4], textoPunto: 'Punta, situada por esta app según el pie (a la altura de la carina)',
        extra: { punto: [49.5, 56], texto: 'Carina' },
        tapar: [{ x: 84, y: 8, w: 16, h: 14 }, { x: 22.5, y: 46.2, w: 21.6, h: 4.8 }, { x: 45, y: 59.2, w: 9.7, h: 4.9 }, { x: 48.4, y: 51.8, w: 2.6, h: 7 }],
        tolerancia: 7,
        elecciones: ['En la cava superior', 'Demasiado baja (aurícula)', 'Fuera del trayecto'],
        correcta: 0,
        respuesta: 'Según el pie de la figura, el catéter está bien colocado.',
        frase: 'Posición adecuada: la carina está justo encima de la unión entre la cava superior y la aurícula derecha. El objetivo es la punta en la cava superior, 1-2 cm por encima de la aurícula derecha.',
        ver: { esp: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab: 'mar-cvc-complicaciones', res: '#mar-punta-rx', rot: 'Tras el catéter central (Marino, cap. 2)' },
    },
];
