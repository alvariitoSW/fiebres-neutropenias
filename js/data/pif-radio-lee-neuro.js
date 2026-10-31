// Ejercicios «Lee la imagen» del cuaderno Neuro urgente (PIF Radiología). Formato: js/data/pif-radio-lee.js.
// Coordenadas en % de la imagen. Cada rótulo sale del pie de figura o del texto de su fuente; lo que la fuente no ubica no tiene zona.
const MN = 'docs/marino-2024-neurologia-caps45-47.pdf';
const UMI = 'docs/hugcdn-umi-manual-guardia-parte2.pdf';
const IMG = 'js/modules/pif-radio/img/';
const UMI_IMG = 'js/modules/sobrevivir-umi/img/';
const COMMONS = (archivo, fecha, autor = 'Hellerhoff') => ({
    texto: 'Wikimedia Commons, «' + archivo + '» (zonas y rótulos añadidos por esta app)', corto: 'Commons',
    url: 'https://commons.wikimedia.org/wiki/File:' + archivo.replace(/ /g, '_'),
    autor, fecha, licencia: 'CC BY-SA 4.0', licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
});
const umi = (imp, texto) => ({ texto, corto: 'Manual UMI', pdf: UMI, pagina: imp - 52 });
const op = (texto, esError, explicacion) => ({ texto, esError, explicacion });

export const EJERCICIOS_LEE_NEURO = [
    {
        id: 'neuro-edema-hepatico', titulo: 'Edema cerebral en el fallo hepático',
        consigna: 'Compara las dos TC del mismo paciente y toca cada una para ver qué dice la fuente.',
        img: 'js/modules/libros/img/mar-fig39-2-tc-edema-cerebral.jpg', alt: 'Dos TC de cráneo sin contraste, antes y después del edema cerebral',
        fuente: { texto: 'Marino, The ICU Book, fig. 39.2', corto: 'Marino', pdf: 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf', pagina: 6 },
        pieAntes: 'TC de cráneo de un paciente con fallo hepático agudo, antes y después del inicio del edema cerebral.',
        pie: 'TC de cráneo en un paciente con fallo hepático agudo, antes (izquierda) y después (derecha) del inicio del edema cerebral. Se aprecian borramiento de los surcos y pérdida de la interfaz sustancia gris-blanca en la imagen de la derecha.',
        zonas: [
            { id: 'antes', forma: 'rect', x: 3, y: 12, w: 44, h: 82, rotulo: 'Antes del edema cerebral', cita: 'pie de la fig. 39.2' },
            { id: 'despues', forma: 'rect', x: 54, y: 14, w: 44, h: 80, rotulo: 'Después del inicio del edema: borramiento de surcos y pérdida de la interfaz gris-blanca', cita: 'pie de la fig. 39.2' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('La imagen de la derecha es posterior al inicio del edema cerebral.', false, 'Cierto: el pie dice «antes (izquierda) y después (derecha)» (Marino, fig. 39.2).'),
            op('En la imagen de la derecha se borran los surcos corticales.', false, 'Cierto: el pie describe el borramiento de los surcos en la imagen de la derecha.'),
            op('En la imagen de la derecha se pierde la interfaz sustancia gris-blanca.', false, 'Cierto: es el segundo signo que cita el pie.'),
            op('La imagen de la derecha es la previa y la de la izquierda muestra el edema.', true, 'Falso: se ha invertido el orden. El pie sitúa el edema en la imagen de la derecha (Marino, fig. 39.2).'),
        ] },
    },
    {
        id: 'neuro-hemorragia-tpa', titulo: 'Hemorragia tras trombolisis',
        consigna: 'Dos TC sin contraste del mismo paciente. Toca cada una.',
        img: 'js/modules/libros/img/mar-fig47-2-hemorragia-tpa.jpg', alt: 'Dos TC cerebrales sin contraste: antes del tPA y cinco horas después',
        fuente: { texto: 'Marino, The ICU Book, fig. 47.2', corto: 'Marino', pdf: MN, pagina: 40 },
        pieAntes: 'TC sin contraste de un paciente que empeoró bruscamente 5 horas después de recibir tPA.',
        pie: 'TC sin contraste de un paciente que empeoró bruscamente 5 horas después de recibir tPA. La TC de la derecha muestra una hemorragia intracerebral masiva (zonas hiperdensas) con desviación de la línea media.',
        zonas: [
            { id: 'antes', forma: 'rect', x: 5, y: 12, w: 43, h: 83, rotulo: 'Antes del tPA', cita: 'rótulo de la imagen («Before tPA») y pie de la fig. 47.2' },
            { id: 'hemorragia', forma: 'rect', x: 57, y: 33, w: 18, h: 45, rotulo: 'Zonas hiperdensas: hemorragia intracerebral masiva (5 h tras el tPA)', cita: 'pie de la fig. 47.2' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('La TC de la derecha, 5 horas después del tPA, muestra una hemorragia intracerebral masiva.', false, 'Cierto, según el pie de la fig. 47.2.'),
            op('La sangre reciente se ve hiperdensa (blanca) en la TC sin contraste.', false, 'Cierto: el pie llama «zonas hiperdensas» a la hemorragia.'),
            op('La línea media está desviada en la TC de la derecha.', false, 'Cierto: el pie cita la desviación de la línea media.'),
            op('La hemorragia aparece hipodensa (oscura) porque es sangre reciente.', true, 'Falso: el pie identifica la hemorragia con las zonas hiperdensas. Confundir hiper con hipodenso lleva a pasar por alto la sangre aguda (Marino, fig. 47.2).'),
        ] },
    },
    {
        id: 'neuro-hematoma-ventriculos', titulo: 'Hematoma con apertura a ventrículos',
        consigna: 'Toca el hematoma y el punto por donde la sangre llega a los ventrículos.',
        img: 'js/modules/libros/img/mar-fig47-3-hematoma.jpg', alt: 'TC sin contraste con un gran hematoma intracerebral hiperdenso',
        fuente: { texto: 'Marino, The ICU Book, fig. 47.3', corto: 'Marino', pdf: MN, pagina: 43 },
        pieAntes: 'TC sin contraste de cráneo con un hematoma intracerebral hiperdenso.',
        pie: 'TC sin contraste con un gran hematoma intracerebral hiperdenso que ocupa cerca de la mitad del volumen del hemisferio derecho. El sangrado se extiende a los ventrículos, con riesgo de hidrocefalia obstructiva.',
        zonas: [
            { id: 'hematoma', forma: 'rect', x: 22, y: 36, w: 33, h: 31, rotulo: 'Hematoma intracerebral hiperdenso (cerca de la mitad del hemisferio derecho)', cita: 'pie de la fig. 47.3' },
            { id: 'ventriculos', forma: 'rect', x: 46, y: 30, w: 14, h: 18, rotulo: 'Extensión del sangrado a los ventrículos', cita: 'pie de la fig. 47.3' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('El hematoma es hiperdenso y ocupa cerca de la mitad del hemisferio derecho.', false, 'Cierto, según el pie de la fig. 47.3.'),
            op('El sangrado se extiende a los ventrículos.', false, 'Cierto: así lo dice el pie.'),
            op('La apertura a los ventrículos crea riesgo de hidrocefalia obstructiva.', false, 'Cierto: es la consecuencia que señala el pie.'),
            op('La sangre queda confinada al parénquima, sin llegar a los ventrículos.', true, 'Falso: el pie dice que el sangrado se extiende a los ventrículos (Marino, fig. 47.3, pág. 43).'),
        ] },
    },
    {
        id: 'neuro-tc-ventriculos', titulo: 'TC normal: corte de los ventrículos',
        consigna: 'Toca las estructuras que el Manual rotula en este corte y comprueba.',
        img: UMI_IMG + 'umi-tc-ventriculos.jpg', alt: 'TC axial normal a nivel de los ventrículos con rótulos tapados',
        fuente: umi(87, 'Manual UMI, TC craneal normal (diapositiva 87)'),
        pieAntes: 'TC axial de cráneo normal.', pie: 'TC axial normal a nivel de los ventrículos, con los rótulos del Manual UMI.',
        zonas: [
            { id: 'caudado', forma: 'circulo', x: 48.8, y: 36.8, r: 3, rotulo: 'Núcleo caudado (cuerpo)', cita: 'rótulo del Manual UMI, pág. 87' },
            { id: 'silviana', forma: 'circulo', x: 36.9, y: 46.6, r: 3, rotulo: 'Cisura silviana', cita: 'rótulo del Manual UMI, pág. 87' },
            { id: 'v4', forma: 'circulo', x: 53.1, y: 61.9, r: 3, rotulo: '4.º ventrículo', cita: 'rótulo del Manual UMI, pág. 87' },
            { id: 'recto', forma: 'circulo', x: 55, y: 80.3, r: 3, rotulo: 'Seno recto', cita: 'rótulo del Manual UMI, pág. 87' },
        ],
        tapar: [{ x: 4, y: 31, w: 20, h: 8 }, { x: 3, y: 45, w: 18, h: 4.5 }, { x: 80, y: 52.7, w: 14, h: 7.5 }, { x: 79.5, y: 86, w: 13, h: 3.5 }],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('La hoz cerebral separa los dos lóbulos frontales.', false, 'Cierto: el Manual la rotula entre los lóbulos frontales (pág. 87).'),
            op('El seno recto se rotula en la línea media posterior, bajo el lóbulo occipital.', false, 'Cierto: así lo rotula el Manual (pág. 87).'),
            op('El putamen y el globo pálido se rotulan a un lado de la línea media.', false, 'Cierto: el Manual los señala en un lado (pág. 87).'),
            op('El seno recto está en la parte anterior, entre los lóbulos frontales.', true, 'Falso: el Manual lo sitúa atrás; entre los lóbulos frontales va la hoz cerebral (pág. 87).'),
        ] },
    },
    {
        id: 'neuro-tc-talamo', titulo: 'TC normal: corte del tálamo',
        consigna: 'Toca las estructuras que el Manual rotula en este corte.',
        img: UMI_IMG + 'umi-tc-talamo.jpg', alt: 'TC axial normal a nivel del tálamo con rótulos tapados',
        fuente: umi(88, 'Manual UMI, TC craneal normal (diapositiva 88)'),
        pieAntes: 'TC axial de cráneo normal.', pie: 'TC axial normal a nivel del tálamo, con los rótulos del Manual UMI.',
        zonas: [
            { id: 'caudado', forma: 'circulo', x: 43.8, y: 35.1, r: 3, rotulo: 'Cuerpo del caudado', cita: 'rótulo del Manual UMI, pág. 88' },
            { id: 'silviana', forma: 'circulo', x: 30.9, y: 43, r: 3, rotulo: 'Cisura silviana', cita: 'rótulo del Manual UMI, pág. 88' },
            { id: 'talamo', forma: 'circulo', x: 45, y: 49, r: 3, rotulo: 'Tálamo', cita: 'rótulo del Manual UMI, pág. 88' },
            { id: 'plexo', forma: 'circulo', x: 56.9, y: 53.7, r: 3, rotulo: 'Plexo coroide', cita: 'rótulo del Manual UMI, pág. 88' },
        ],
        tapar: [{ x: 10.6, y: 26.8, w: 15, h: 8.5 }, { x: 13.7, y: 55.8, w: 11, h: 5.4 }, { x: 3.6, y: 37, w: 19.7, h: 4.7 }, { x: 76, y: 53.4, w: 14, h: 9.6 }],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('En este corte el Manual rotula el tálamo y el cuerpo del caudado.', false, 'Cierto (Manual UMI, pág. 88).'),
            op('El Manual rotula la cápsula y el putamen-pálido en un lado.', false, 'Cierto (pág. 88).'),
            op('El Manual rotula el vermis y el seno en la parte posterior.', false, 'Cierto (pág. 88).'),
            op('En este corte se rotulan el IV ventrículo y la protuberancia.', true, 'Falso: eso pertenece al corte de la protuberancia (pág. 90). Aquí se rotulan estructuras supratentoriales.'),
        ] },
    },
    {
        id: 'neuro-tc-mesencefalo', titulo: 'TC normal: corte del mesencéfalo',
        consigna: 'Toca las estructuras que el Manual rotula en este corte (TC con contraste).',
        img: UMI_IMG + 'umi-tc-mesencefalo.jpg', alt: 'TC axial con contraste a nivel del mesencéfalo con rótulos tapados',
        fuente: umi(89, 'Manual UMI, TC craneal normal (diapositiva 89)'),
        pieAntes: 'TC axial con contraste.', pie: 'TC axial con contraste a nivel del mesencéfalo, con los rótulos del Manual UMI.',
        zonas: [
            { id: 'pedunculo', forma: 'circulo', x: 53.4, y: 51.9, r: 3, rotulo: 'Pedúnculo cerebral', cita: 'rótulo del Manual UMI, pág. 89' },
            { id: 'interpeduncular', forma: 'circulo', x: 50.9, y: 45.9, r: 3, rotulo: 'Cisterna interpeduncular', cita: 'rótulo del Manual UMI, pág. 89' },
            { id: 'cuadrigemino', forma: 'circulo', x: 51.9, y: 58, r: 3, rotulo: 'Tubérculo cuadrigémino', cita: 'rótulo del Manual UMI, pág. 89' },
            { id: 'silvio', forma: 'circulo', x: 62.8, y: 33.3, r: 3, rotulo: 'Cisura de Silvio', cita: 'rótulo del Manual UMI, pág. 89' },
        ],
        tapar: [{ x: 76.6, y: 49, w: 17, h: 3.7 }, { x: 76.8, y: 43, w: 21, h: 3.6 }, { x: 76.8, y: 55.8, w: 20.4, h: 3.1 }, { x: 76.6, y: 30.7, w: 13.4, h: 3.6 }],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('El Manual rotula la cisterna interpeduncular y el pedúnculo cerebral.', false, 'Cierto (Manual UMI, pág. 89).'),
            op('El Manual rotula el tubérculo cuadrigémino y el vermis cerebeloso.', false, 'Cierto (pág. 89).'),
            op('La imagen es una TC axial con contraste.', false, 'Cierto: el rótulo de la imagen lo dice (pág. 89).'),
            op('La imagen es una TC axial sin contraste.', true, 'Falso: el rótulo de la imagen dice «TC axial con contraste» (pág. 89).'),
        ] },
    },
    {
        id: 'neuro-tc-protuberancia', titulo: 'TC normal: corte de la protuberancia',
        consigna: 'Toca las estructuras que el Manual rotula en este corte (TC con contraste).',
        img: UMI_IMG + 'umi-tc-protuberancia.jpg', alt: 'TC axial con contraste a nivel de la protuberancia con rótulos tapados',
        fuente: umi(90, 'Manual UMI, TC craneal normal (diapositiva 90)'),
        pieAntes: 'TC axial con contraste.', pie: 'TC axial con contraste a nivel de la protuberancia, con los rótulos del Manual UMI.',
        zonas: [
            { id: 'protuberancia', forma: 'circulo', x: 51.9, y: 52.9, r: 3, rotulo: 'Protuberancia', cita: 'rótulo del Manual UMI, pág. 90' },
            { id: 'basilar', forma: 'circulo', x: 50.3, y: 46.6, r: 3, rotulo: 'Arteria basilar', cita: 'rótulo del Manual UMI, pág. 90' },
            { id: 'supraselar', forma: 'circulo', x: 53.1, y: 41.7, r: 3, rotulo: 'Cisterna supraselar', cita: 'rótulo del Manual UMI, pág. 90' },
            { id: 'v4', forma: 'circulo', x: 48.1, y: 61.6, r: 3, rotulo: 'IV ventrículo', cita: 'rótulo del Manual UMI, pág. 90' },
        ],
        tapar: [{ x: 74.7, y: 50, w: 12.5, h: 3.7 }, { x: 75, y: 44.5, w: 8.4, h: 3.1 }, { x: 74.7, y: 38.9, w: 17.2, h: 3.6 }, { x: 7.2, y: 59, w: 11.2, h: 3.2 }],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('El Manual rotula la arteria basilar y la protuberancia.', false, 'Cierto (Manual UMI, pág. 90).'),
            op('El Manual rotula la cisterna supraselar y la arteria cerebral media.', false, 'Cierto (pág. 90).'),
            op('El IV ventrículo queda por detrás de la protuberancia.', false, 'Cierto: en el rotulado del Manual está posterior a ella (pág. 90).'),
            op('La cisterna supraselar queda por detrás de la protuberancia y del IV ventrículo.', true, 'Falso: en el rotulado del Manual la cisterna supraselar está por delante de la protuberancia (pág. 90).'),
        ] },
    },
    {
        id: 'neuro-marshall', titulo: 'Clasificación de Marshall',
        consigna: 'Seis cortes de TC en orden: toca cada uno y lee a qué tipo corresponde.',
        img: UMI_IMG + 'umi-tc-marshall.jpg', alt: 'Seis cortes axiales de TC, de los tipos I a IV, masa evacuada y masa no evacuada',
        fuente: umi(94, 'Manual UMI, clasificación de Marshall (diapositiva 94)'),
        pieAntes: 'Seis TC del Manual, en el orden de la tabla.', pie: 'Seis TC en el orden de la tabla del Manual: tipos I a IV, masa evacuada y masa no evacuada.',
        zonas: [
            { id: 'tipo1', forma: 'rect', x: 1, y: 5, w: 14.5, h: 90, rotulo: 'Tipo I: TC normal', cita: 'tabla del Manual UMI, pág. 94' },
            { id: 'tipo2', forma: 'rect', x: 18, y: 5, w: 14.5, h: 90, rotulo: 'Tipo II: pequeñas lesiones, línea media centrada y cisternas visibles (HTIC 28,6 %)', cita: 'tabla del Manual UMI, pág. 94' },
            { id: 'tipo4', forma: 'rect', x: 51.5, y: 5, w: 14.5, h: 90, rotulo: 'Tipo IV: swelling unilateral (HTIC 100 %)', cita: 'tabla del Manual UMI, pág. 94' },
            { id: 'nevac', forma: 'rect', x: 84, y: 5, w: 14.5, h: 90, rotulo: 'Masa no evacuada: lesión > 25 cc no evacuada (HTIC 84,6 %)', cita: 'tabla del Manual UMI, pág. 94' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('Tipo II: línea media centrada y cisternas visibles.', false, 'Cierto, según la tabla (Manual UMI, pág. 94).'),
            op('Tipo III: swelling bilateral, sin cisternas de la base.', false, 'Cierto (pág. 94).'),
            op('Masa no evacuada: lesión > 25 cc sin evacuar.', false, 'Cierto (pág. 94).'),
            op('Tipo III: swelling unilateral con la línea media desviada.', true, 'Falso: el swelling unilateral es el tipo IV; el III es bilateral y sin cisternas de la base (pág. 94).'),
        ] },
    },
    {
        id: 'neuro-hsa-basal', titulo: 'Hemorragia subaracnoidea basal',
        consigna: 'TC axial de un varón de 43 años con aneurisma de la comunicante anterior. Toca cada corte para ver su nivel; la HSA basal es la sangre en el espacio subaracnoideo de la base (Marino, pág. 45).',
        img: IMG + 'neuro-hsa-basal.jpg', alt: 'Tres cortes axiales de TC craneal con hemorragia subaracnoidea basal',
        fuente: COMMONS('Basale Subarachnoidalblutung bei Anterioraneurysma 43M - CT axial - 001.jpg', '2022-05-02'),
        pieAntes: 'Tres cortes axiales de una TC sin contraste.', pie: 'Hemorragia subaracnoidea basal en un varón de 43 años con aneurisma de la comunicante anterior (descripción del autor en Commons). Es la sangre en el espacio subaracnoideo tras la rotura de un aneurisma sacular (Marino, pág. 45).',
        zonas: [
            { id: 'temporales', forma: 'rect', x: 1, y: 3, w: 31, h: 92, rotulo: 'Corte 1 (izquierda): nivel de los lóbulos temporales', cita: 'descripción del autor en Commons («left: … temporal lobes»)' },
            { id: 'astas', forma: 'rect', x: 34, y: 3, w: 32, h: 92, rotulo: 'Corte 2 (centro): nivel de las astas temporales de los ventrículos laterales', cita: 'descripción del autor en Commons («middle: … temporal horns»)' },
            { id: 'pineal', forma: 'rect', x: 67, y: 3, w: 32, h: 92, rotulo: 'Corte 3 (derecha): nivel de la glándula pineal', cita: 'descripción del autor en Commons («right: … pineal gland»)' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('La sangre está en el espacio subaracnoideo de la base, no dentro del parénquima.', false, 'Cierto: la HSA es la sangre en el espacio subaracnoideo (Marino, pág. 45).'),
            op('La causa habitual es la rotura de un aneurisma sacular.', false, 'Cierto (Marino, pág. 45).'),
            op('Los cortes son axiales.', false, 'Cierto: así lo dice la descripción del autor en Commons.'),
            op('Es una hemorragia intraparenquimatosa por hipertensión, sin relación con un aneurisma.', true, 'Falso: la descripción del autor indica un aneurisma de la arteria cerebral anterior y Marino describe la HSA como sangre subaracnoidea por rotura de un aneurisma (pág. 45).'),
        ] },
    },
    {
        id: 'neuro-hsa-media', titulo: 'HSA extensa y angio-TC del aneurisma',
        consigna: 'Tres imágenes del mismo caso (varón de 63 años). Toca cada una.',
        img: IMG + 'neuro-hsa-media-cta.jpg', alt: 'TC sin contraste, angio-TC en MIP y reconstrucción en volumen de una hemorragia subaracnoidea',
        fuente: COMMONS('Ausgedehnte Subarachnoidalblutung bei Aneurysma der Media 63M - CT nativ und CTA als MIP und VR - 001.jpg', '2022-07-08'),
        pieAntes: 'Tres imágenes de un mismo paciente.', pie: 'Hemorragia subaracnoidea extensa por aneurisma de la arteria cerebral media en un varón de 63 años: TC sin contraste, angio-TC en proyección de máxima intensidad (MIP) y reconstrucción en volumen (VR). Descripción tomada del título del archivo de Commons.',
        zonas: [
            { id: 'nativo', forma: 'rect', x: 1, y: 3, w: 31, h: 92, rotulo: 'TC sin contraste (nativa)', cita: 'título del archivo de Commons («CT nativ»)' },
            { id: 'mip', forma: 'rect', x: 34, y: 3, w: 32, h: 92, rotulo: 'Angio-TC en proyección de máxima intensidad (MIP)', cita: 'título del archivo de Commons («CTA als MIP»)' },
            { id: 'vr', forma: 'rect', x: 67, y: 3, w: 32, h: 92, rotulo: 'Reconstrucción en volumen (VR)', cita: 'título del archivo de Commons («VR»)' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('La primera imagen es una TC sin contraste.', false, 'Cierto: «CT nativ» en el título del archivo.'),
            op('La segunda imagen es una angio-TC en MIP.', false, 'Cierto: «CTA als MIP».'),
            op('El aneurisma está en la arteria cerebral media.', false, 'Cierto: «Aneurysma der Media» en el título.'),
            op('La tercera imagen es una ecografía transcraneal.', true, 'Falso: es una reconstrucción en volumen (VR) de la angio-TC, según el título del archivo.'),
        ] },
    },
    {
        id: 'neuro-hsa-traumatica', titulo: 'Hemorragia subaracnoidea traumática',
        consigna: 'Tres cortes de TC de una mujer de 83 años (axial, coronal y sagital). Toca la sangre en el axial y el coronal.',
        img: IMG + 'neuro-hsa-traumatica.jpg', alt: 'Tres cortes de TC craneal con hemorragia subaracnoidea traumática',
        fuente: COMMONS('Subarachnoidalblutung traumatisch 83W - CT - 001.jpg', '2022-09-27'),
        pieAntes: 'Tres cortes de TC craneal.', pie: 'Hemorragia subaracnoidea traumática en una mujer de 83 años (descripción del autor en Commons: HSA traumática izquierda). Sin aneurisma: la sangre llega al espacio subaracnoideo por el traumatismo.',
        zonas: [
            { id: 'axial', forma: 'rect', x: 23, y: 52, w: 6, h: 13, rotulo: 'Corte axial: HSA traumática izquierda (a la derecha de la imagen, por la convención radiológica)', cita: 'descripción del autor en Commons («left traumatic subarachnoid haemorrhage»)' },
            { id: 'coronal', forma: 'rect', x: 59, y: 42, w: 6.5, h: 12, rotulo: 'Corte coronal: la misma HSA, en el lado izquierdo del paciente', cita: 'descripción del autor en Commons («left traumatic subarachnoid haemorrhage»)' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('La sangre está en el espacio subaracnoideo.', false, 'Cierto: es una hemorragia subaracnoidea (descripción del autor en Commons).'),
            op('El origen es un traumatismo.', false, 'Cierto: la descripción del autor dice «traumatic».'),
            op('Los cortes son de una TC.', false, 'Cierto: «CT» en el título.'),
            op('Es una HSA por rotura de un aneurisma sacular.', true, 'Falso: la descripción del autor la califica de traumática. La HSA por aneurisma sacular es la que describe Marino (pág. 45).'),
        ] },
    },
    {
        id: 'neuro-subdural-parafalcino', titulo: 'Hematoma subdural parafalcino',
        consigna: 'Corte axial, coronal y sagital de un varón de 74 años. Toca el hematoma y la HSA frontal en el corte axial.',
        img: IMG + 'neuro-subdural-parafalcino.jpg', alt: 'Tres cortes de TC con un hematoma subdural junto a la hoz cerebral',
        fuente: COMMONS('Parafalzines Subduralhaematom 74M - CT - 001.jpg', '2023-02-05'),
        pieAntes: 'Tres cortes de TC craneal.', pie: 'Hematoma subdural parafalcino (junto a la hoz cerebral) en un varón de 74 años, según la descripción del autor en Commons, que añade hemorragias subaracnoideas bilaterales (frontal derecha y temporal izquierda) tras una caída. Dónde se opera un hematoma subdural: Manual UMI, pág. 83.',
        zonas: [
            { id: 'hoz', forma: 'rect', x: 12.3, y: 24, w: 4.2, h: 62, rotulo: 'Corte axial: hematoma subdural parafalcino, junto a la hoz', cita: 'descripción del autor en Commons («parafalcine subdural hematoma»)' },
            { id: 'hozcor', forma: 'rect', x: 44, y: 9, w: 4, h: 37, rotulo: 'Corte coronal: el mismo hematoma, pegado a la hoz', cita: 'descripción del autor en Commons («parafalcine subdural hematoma»)' },
            { id: 'hsafront', forma: 'rect', x: 8, y: 14, w: 5.5, h: 24, rotulo: 'Corte axial: HSA frontal derecha (a la izquierda de la imagen)', cita: 'descripción del autor en Commons («right frontal» subarachnoid haemorrhage)' },
        ],
        error: { enunciado: 'Una de estas lecturas es falsa. ¿Cuál?', opciones: [
            op('El hematoma está junto a la hoz cerebral.', false, 'Cierto: la descripción del autor dice «parafalcine».'),
            op('Es un hematoma subdural.', false, 'Cierto: la descripción del autor dice «subdural hematoma».'),
            op('Se ven cortes en tres planos.', false, 'Cierto: axial, coronal y sagital.'),
            op('Es una hemorragia intraventricular.', true, 'Falso: la descripción del autor lo califica de subdural parafalcino. La sangre intraventricular es la de Marino, fig. 47.3 (pág. 43).'),
        ] },
    },
];
