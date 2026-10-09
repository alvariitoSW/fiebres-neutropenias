// Vista Visual de Trasplante (Introducción, CAR-T y Complicaciones post-TPH):
// recetas para core/visual-kit.js. Las tablas de gradación de SLC e ICANS se
// dibujan como peldaños (una columna por grado); los <select> y casillas de
// siempre (donante, fallo de injerto, mucositis, ICE, criterios de alta...)
// se manejan desde la imagen y copian el resultado de su calculadora.
import { montarVisual } from '../../core/visual-kit.js';

function introduccion() {
    montarVisual('tph-donante', {
        guia: 'Elige el tipo de donante: la imagen copia su definición y la jerarquía de criterios.',
        paneles: [
            { tipo: 'selector', titulo: 'Tipo de donante', control: '#tph-donante-select', forma: 'chips', color: 'dorado',
              resultado: ['#tph-donante-titulo', '#tph-donante-definicion', '#tph-donante-jerarquia'] },
            { tipo: 'racimos', titulo: 'Antes y después de la donación', grupos: [
                { titulo: 'Obligatorio', color: 'rojo', nodos: ['Retipaje obligatorio'] },
                { titulo: 'Donante', color: 'dorado', nodos: ['Cuidados post-extracción del donante', 'Estudio familiar ampliado y donantes menores'] }
            ] }
        ]
    });

    montarVisual('tph-acondicionamiento', {
        guia: 'Cuánto destruye cada acondicionamiento, qué régimen va con cada diagnóstico y qué soporte lleva siempre.',
        paneles: [
            { tipo: 'escalera', titulo: 'Intensidad, de menos a más', nodos: [
                { fuente: 'No mieloablativo (ANM)', color: 'verde' },
                { fuente: 'Intensidad reducida (AIR)', color: 'amarillo' },
                { fuente: 'Mieloablativo (AMA)', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Régimen según diagnóstico, agrupado por tipo de trasplante', grupos: [
                { titulo: 'Alogénico', color: 'dorado', nodos: ['LMA / SMD', 'LLA / patología linfoide'] },
                { titulo: 'Alogénico haploidéntico', color: 'purpura', nodos: ['Mieloide y linfoide (con enfermedad)', 'Linfoma de Hodgkin', 'Aplasia medular'] },
                { titulo: 'Intensidad reducida y rescate', color: 'amarillo', nodos: [
                    { fuente: 'css:#tph-regimenes-tabla tr:nth-child(5)', etiqueta: 'Mieloide y linfoide (TBF)' },
                    'Mieloide y linfoide (rescate)'] },
                { titulo: 'Autólogo', color: 'verde', nodos: [
                    { fuente: 'css:#tph-regimenes-tabla tr:nth-child(8)', etiqueta: 'LMA (BEA)' },
                    'Linfomas', 'Linfoma no Hodgkin con afectación de SNC', 'Mieloma múltiple'] }
            ] },
            { tipo: 'racimos', titulo: 'Soporte común y toxicidad', grupos: [
                { titulo: 'Soporte de todo acondicionamiento', color: 'verde', nodos: ['Hidratación y diuresis alcalina', 'Antieméticos y protección gástrica',
                    'Profilaxis antiinfecciosa', 'Profilaxis de EICH', 'Profilaxis de cistitis hemorrágica', 'Profilaxis de CMV',
                    'Profilaxis de recidiva en SNC', 'Profilaxis de sangrado'] },
                { titulo: 'Toxicidad por fármaco e ICT', color: 'rojo', nodos: ['Perfil de toxicidad de los principales fármacos',
                    'Profilaxis del síndrome del injerto', { fuente: 'Indicación, dosis y antiemesis', etiqueta: 'Irradiación corporal total' }] }
            ] }
        ]
    });

    montarVisual('tph-planta', {
        guia: 'El recorrido del ingreso de arriba abajo; las dos últimas pueden aparecer en cualquier fase.',
        paneles: [
            { tipo: 'flujo', titulo: 'Del ingreso al injerto', nodos: [
                { fuente: 'Pre-ingreso e ingreso', color: 'dorado' },
                { fuente: 'Acondicionamiento', color: 'amarillo' },
                { fuente: 'Día 0 (infusión de progenitores)', color: 'purpura' },
                { fuente: 'Fase de aplasia', color: 'rojo' },
                { fuente: 'Fase de injerto', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'En cualquier fase', grupos: [
                { titulo: 'Vigilar', color: 'rojo', nodos: ['Traslado a UMI', 'Clostridioides difficile'] }
            ] }
        ]
    });

    montarVisual('tph-injerto', {
        guia: 'Cuatro entidades distintas, sus causas y qué hacer según el contexto.',
        paneles: [
            { tipo: 'selector', titulo: '¿Qué entidad es?', control: '#tph-injerto-select', forma: 'chips', color: 'rojo',
              resultado: ['#tph-injerto-titulo', '#tph-injerto-definicion', '#tph-injerto-incidencia'] },
            { tipo: 'racimos', titulo: 'Por qué falla el injerto', grupos: [
                { titulo: 'Causas más frecuentes', color: 'rojo', nodos: ['Infecciones, sobre todo víricas', 'Fármacos mielotóxicos',
                    'Sensibilización a antígenos HLA', 'Fallos en el microambiente medular'] },
                { titulo: 'Factores de riesgo', color: 'amarillo', nodos: ['Relacionados con los progenitores', 'Relacionados con el nicho medular',
                    'Relacionados con la enfermedad', 'Inmunológicos', 'Relacionados con la técnica'] }
            ] },
            { tipo: 'selector', titulo: 'Manejo según el contexto', control: '#tph-manejo-select', forma: 'chips', color: 'verde',
              resultado: ['#tph-manejo-titulo', '#tph-manejo-texto'] }
        ]
    });

    montarVisual('tph-productos', {
        guia: 'Todo producto se cultiva; qué se hace si el cultivo sale positivo.',
        paneles: [
            { tipo: 'flujo', titulo: 'Cultivo del producto', nodos: [
                { fuente: 'A todos los productos de terapia celular', etiqueta: 'Cultivo de todo producto manipulado', color: 'dorado' },
                [{ fuente: 'Productos criopreservados', color: 'purpura' }, { fuente: 'Productos en fresco', color: 'verde' }],
                { fuente: 'Actitud según el germen aislado', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Aparte', grupos: [
                { titulo: 'Riesgo biológico', color: 'amarillo', nodos: ['Productos con riesgo biológico o en cuarentena'] }
            ] }
        ]
    });

    montarVisual('tph-soporte', {
        guia: 'Los pilares del soporte. La mucositis y el dolor se manejan desde aquí.',
        paneles: [
            { tipo: 'racimos', titulo: 'Profilaxis antiinfecciosa', grupos: [
                { titulo: 'Por tipo de germen', color: 'dorado', nodos: ['Profilaxis bacteriana', 'Profilaxis fúngica', 'Profilaxis vírica'] }
            ] },
            { tipo: 'selector', titulo: 'Mucositis: grado OMS', control: '#tph-mucositis-select',
              resultado: ['#tph-mucositis-criterio', '#tph-mucositis-tratamiento'] },
            { tipo: 'selector', titulo: 'Dolor: según la causa', control: '#tph-dolor-select', forma: 'chips', color: 'amarillo',
              resultado: ['#tph-dolor-texto'] },
            { tipo: 'racimos', titulo: 'Otros pilares', grupos: [
                { titulo: 'Analgesia', color: 'amarillo', nodos: ['Fármacos y dosis de referencia'] },
                { titulo: 'Soporte', color: 'verde', nodos: ['Náuseas y vómitos', 'Soporte nutricional', 'Soporte transfusional',
                    'Factores de crecimiento (G-CSF)', 'Infusión de progenitores hematopoyéticos'] }
            ] }
        ]
    });

    montarVisual('tph-alta', {
        guia: 'Los tres criterios de alta: la imagen marca las casillas reales y copia el veredicto.',
        paneles: [
            { tipo: 'puntos', titulo: 'Criterios de alta', items: [{ checks: '.tph-alta-check', pts: 1 }], resultado: ['#tph-alta-resultado'] },
            { tipo: 'racimos', titulo: 'Al alta', grupos: [
                { titulo: 'Entregar y planificar', color: 'verde', nodos: ['Informe de alta y receta electrónica', 'Recomendaciones específicas según patología y riesgo'] }
            ] }
        ]
    });
}

function carT() {
    montarVisual('cart-indicaciones', {
        guia: 'Qué productos hay, quién puede recibirlos y qué enfermedades los indican.',
        paneles: [
            { tipo: 'racimos', titulo: 'Productos', grupos: [
                { titulo: 'Comerciales y académico', color: 'purpura', nodos: ['Kymriah', 'Yescarta', 'Abecma', 'Tecartus', 'Carvykti', 'ARI-0001'] }
            ] },
            { tipo: 'comparar', titulo: 'Selección del paciente (linfomas)', columnas: [
                { titulo: 'Inclusión', color: 'verde', nodos: ['Edad ≥18 años', 'Estado funcional ECOG <2', 'Función renal, hepática', 'Ausencia de infección activa',
                    'No haber recibido tratamiento previo', 'Reserva medular adecuada'] },
                { titulo: 'Exclusión', color: 'rojo', nodos: ['Padecer otra neoplasia activa', 'Infección activa grave', 'ECOG ≥2', 'Enfermedades graves no controladas',
                    'Enfermedades neurológicas autoinmunes', { fuente: 'css:#cart-exclusion-lista li:last-child' }] }
            ] },
            { tipo: 'racimos', titulo: 'Criterios por enfermedad', grupos: [
                { titulo: 'Linfomas', color: 'dorado', nodos: ['Linfoma B difuso de célula grande', 'Linfoma folicular', 'Linfoma de células del manto'] }
            ] }
        ]
    });

    montarVisual('cart-infusion', {
        guia: 'Los días alrededor de la infusión (día 0): linfodepleción antes, vigilancia estrecha después.',
        paneles: [
            { tipo: 'linea', titulo: 'Calendario de la infusión', min: -5, max: 10, ticks: [-5, -3, 0, 3, 7, 10], unidad: 'días respecto a la infusión',
              bandas: [{ desde: -5, hasta: -2, texto: 'Linfodepleción', color: 'purpura' }, { desde: 0, hasta: 10, texto: 'Monitorización estrecha', color: 'amarillo', alinear: 'fin' }],
              nodos: [
                  { fuente: 'Antes de infundir', etiqueta: 'Día 0: comprobaciones antes de infundir', en: 0, color: 'rojo' },
                  { fuente: 'Premedicación habitual', etiqueta: 'Día 0: premedicación', en: 0, fila: 'abajo', color: 'verde' },
                  { fuente: 'Tras la infusión, monitorización estrecha', etiqueta: 'Días 0 a +7-10: vigilar SLC e ICANS', en: 7, fila: 'abajo', color: 'amarillo' }
              ] },
            { tipo: 'racimos', titulo: 'Linfodepleción y efectos de la infusión', grupos: [
                { titulo: 'Linfodepleción por producto', color: 'purpura', nodos: ['Yescarta', 'Carvykti', 'Tecartus', 'Abecma'] },
                { titulo: 'Efectos adversos de la infusión', color: 'rojo', nodos: ['Reacción vagal por histamina', 'Trastornos del gusto', 'Reacción anafiláctica'] }
            ] }
        ]
    });

    montarVisual('cart-slc', {
        guia: 'Cada peldaño es una columna de la tabla de gradación: toca un grado para ver signos y tratamiento.',
        paneles: [
            { tipo: 'grados', titulo: 'Grado de SLC y tratamiento', nota: 'El grado lo marca el signo más grave; la fiebre ≥38 °C está en todos.', tabla: 0, filasResumen: [1, 2] },
            { tipo: 'racimos', titulo: 'Si no responde', grupos: [
                { titulo: 'Reglas', color: 'rojo', nodos: [{ fuente: 'El grado de SLC viene determinado', etiqueta: 'Qué determina el grado' }, 'SLC refractario'] }
            ] }
        ]
    });

    montarVisual('cart-icans', {
        guia: 'Puntúa el ICE desde aquí (marca las casillas reales); debajo, la gradación por grado.',
        paneles: [
            { tipo: 'puntos', titulo: 'Puntuación ICE (1 punto por ítem superado)', items: [{ checks: '.cart-ice-check', pts: 1 }], resultado: ['#cart-ice-resultado'] },
            { tipo: 'grados', titulo: 'Grado de ICANS y tratamiento', tabla: 0, filasResumen: [0, 1] },
            { tipo: 'racimos', titulo: 'Avisos', grupos: [
                { titulo: 'Vigilancia', color: 'amarillo', nodos: ['Reevaluar antes de lo programado si aparece', 'Antes de la infusión'] },
                { titulo: 'Escalada', color: 'rojo', nodos: ['ICANS refractario', 'Ante focalidad neurológica'] }
            ] }
        ]
    });

    montarVisual('cart-otras', {
        guia: 'Las otras complicaciones precoces, aparte del SLC y el ICANS.',
        paneles: [
            { tipo: 'racimos', titulo: 'Complicaciones precoces', grupos: [
                { titulo: 'Metabólicas e inflamatorias', color: 'amarillo', nodos: ['Síndrome de lisis tumoral', 'Síndrome de activación macrofágica'] },
                { titulo: 'Órganos e infección', color: 'rojo', nodos: ['Complicaciones cardiacas y respiratorias', 'Infecciones'] }
            ] }
        ]
    });
}

function complicaciones() {
    montarVisual('comp-neutropenia', {
        guia: 'Del primer pico febril al antibiótico dirigido: elige foco y germen para ver la pauta.',
        paneles: [
            { tipo: 'flujo', titulo: 'Fiebre en neutropenia', nodos: [
                { fuente: 'Definición de fiebre y de riesgo', color: 'amarillo' },
                { fuente: 'Pruebas diagnósticas y biomarcadores', color: 'dorado' },
                { fuente: 'Escalada', etiqueta: 'Escalada (cefepime) o desescalada', color: 'rojo' },
                { fuente: 'Duración del tratamiento', color: 'verde' }
            ] },
            { tipo: 'selector', titulo: 'Según el foco', control: '#comp-foco-select', forma: 'chips', color: 'amarillo', resultado: ['#comp-foco-texto'] },
            { tipo: 'selector', titulo: 'Según el germen multirresistente', control: '#comp-germen-select', forma: 'chips', color: 'rojo', resultado: ['#comp-germen-texto'] },
            { tipo: 'racimos', titulo: 'Microbiología', grupos: [
                { titulo: 'Microorganismos más frecuentes', color: 'purpura', nodos: ['Bacterianas'] }
            ] }
        ]
    });

    montarVisual('comp-cateter', {
        guia: 'Qué tipo de infección es, qué hacer ante la fiebre y cuándo retirar el catéter.',
        paneles: [
            { tipo: 'escalera', titulo: 'Del catéter colonizado a la bacteriemia', nodos: [
                { fuente: 'Colonización', color: 'verde' },
                { fuente: 'Flebitis', color: 'amarillo' },
                { fuente: 'Infección del punto de inserción', etiqueta: 'Infección local (punto, trayecto, bolsa)', color: 'amarillo' },
                { fuente: 'Bacteriemia/fungemia relacionada con el líquido', etiqueta: 'Bacteriemia por el líquido de infusión', color: 'rojo' },
                { fuente: 'Bacteriemia/fungemia relacionada con el catéter', etiqueta: 'Bacteriemia relacionada con el catéter', color: 'rojo' }
            ] },
            { tipo: 'flujo', titulo: 'Episodio febril', nodos: [
                { fuente: 'Extracción de cultivos de sangre periférica', etiqueta: 'Cultivos + cefepime y vancomicina/daptomicina', color: 'dorado' },
                { fuente: 'Indicaciones de retirada del catéter', color: 'rojo' },
                { fuente: 'Situaciones especiales', etiqueta: 'Fiebre persistente y duración', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Gérmenes y prevención', grupos: [
                { titulo: 'Saber', color: 'verde', nodos: ['Microorganismos más frecuentes', 'Medidas preventivas'] }
            ] }
        ]
    });

    montarVisual('comp-hongos', {
        guia: 'Certeza diagnóstica, sensibilidad de Candida y tratamiento por patógeno.',
        paneles: [
            { tipo: 'selector', titulo: 'Criterios EORTC/MSG', control: '#comp-eortc-select', forma: 'chips', color: 'purpura', resultado: ['#comp-eortc-texto'] },
            { tipo: 'matriz', titulo: 'Sensibilidad de Candida spp.', nota: 'Tabla de la ficha; las notas ¹-⁴ están en el texto.', tabla: 0,
              normales: ['s', 's¹', 's²'], leyenda: ['sensible', 'resistente o dependiente de dosis'] },
            { tipo: 'selector', titulo: 'Tratamiento dirigido por patógeno', control: '#comp-hongo-select', forma: 'chips', color: 'rojo', resultado: ['#comp-hongo-texto'] },
            { tipo: 'racimos', titulo: 'Contexto', grupos: [
                { titulo: 'Huésped y empírico', color: 'amarillo', nodos: ['Criterios del huésped', 'Criterios clínicos y micológicos', 'Empírico'] }
            ] }
        ]
    });

    montarVisual('comp-viricas', {
        guia: 'El CMV por escenario, y el resto de virus agrupados.',
        paneles: [
            { tipo: 'selector', titulo: 'CMV: tratamiento según escenario', control: '#comp-cmv-select', forma: 'chips', color: 'rojo', resultado: ['#comp-cmv-texto'] },
            { tipo: 'racimos', titulo: 'Otros virus', grupos: [
                { titulo: 'CMV', color: 'rojo', nodos: ['Definiciones y factores de riesgo'] },
                { titulo: 'Herpesvirus', color: 'purpura', nodos: ['Virus herpes simple', 'Virus varicela zóster', 'Virus herpes humano tipo 6', 'Virus herpes humano tipo 8', 'Virus de Epstein-Barr'] },
                { titulo: 'Otros', color: 'dorado', nodos: ['Virus respiratorios', 'Virus BK', 'Adenovirus'] }
            ] }
        ]
    });

    montarVisual('comp-eich', {
        guia: 'Primera línea según gravedad; si fracasan los corticoides, la segunda línea.',
        paneles: [
            { tipo: 'selector', titulo: 'Primera línea según gravedad', control: '#comp-eich-grado-select', resultado: ['#comp-eich-grado-texto'] },
            { tipo: 'flujo', titulo: 'Si los corticoides fallan', nodos: [
                { fuente: 'Corticorrefractariedad, corticodependencia y corticointolerancia', color: 'rojo' },
                { fuente: 'Criterios de respuesta al tratamiento', color: 'amarillo' }
            ] },
            { tipo: 'racimos', titulo: 'Segunda línea (EICH agudo refractario)', grupos: [
                { titulo: 'Opciones', color: 'purpura', nodos: ['Ruxolitinib', 'Fotoaféresis extracorpórea', 'Vedolizumab', 'Anti-TNFα', 'Basiliximab', 'Células madre mesenquimales'] },
                { titulo: 'Base', color: 'dorado', nodos: ['Clasificación según el momento de presentación', 'Factores de riesgo y manifestaciones', 'Soporte durante el tratamiento'] }
            ] }
        ]
    });

    montarVisual('comp-noinfecciosas', {
        guia: 'Cada complicación no infecciosa sobre el órgano que daña; casi todas nacen de un daño endotelial.',
        paneles: [
            { tipo: 'mapa', titulo: 'Complicaciones precoces no infecciosas', nodos: [
                { fuente: 'Enfermedad veno-oclusiva hepática', organo: 'higado', color: 'rojo' },
                { fuente: 'Síndrome del injerto', organo: 'piel', color: 'amarillo' },
                { fuente: 'Síndrome de fuga capilar', organo: 'vasos', color: 'amarillo' },
                { fuente: 'Hemorragia alveolar difusa', organo: 'pulmonDcho', color: 'rojo' },
                { fuente: 'Síndrome de neumonía idiopática', organo: 'pulmonIzdo', color: 'purpura' },
                { fuente: 'Microangiopatía trombótica', organo: 'rinon', color: 'rojo' },
                { fuente: 'Diarrea', organo: 'intestino', color: 'amarillo' },
                { fuente: 'Cistitis hemorrágica', organo: 'vejiga', color: 'purpura' }
            ] },
            { tipo: 'selector', titulo: 'Cistitis hemorrágica según su causa', control: '#comp-cistitis-select', forma: 'chips', color: 'purpura', resultado: ['#comp-cistitis-texto'] }
        ]
    });
}

export function init() {
    introduccion();
    carT();
    complicaciones();
}
