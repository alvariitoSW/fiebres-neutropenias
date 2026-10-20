// Vista Visual de Merino HEMATO (Marino, caps. 12-13): recetas para core/visual-kit.js. En las fichas con
// Estudiar, es el paso «Mira». Cada nodo apunta a su texto por id (`fuente: '#mh-…'`); las tablas con cifras se
// dibujan leyendo sus celdas (barras, matriz, frecuencias); la 4Ts escribe en sus <select> reales y copia el
// resultado de calc4Ts(). Las láminas del libro (figuras reales de la ficha, con su pie y su página) van en un
// panel `figuras`.
import { montarVisual } from '../../core/visual-kit.js';

const LAMINAS = { tipo: 'figuras', titulo: 'Las láminas del libro', nota: 'Desliza para verlas; tócalas para ampliarlas.' };

export function init() {
    montarVisual('merino-anemia', {
        guia: 'Por qué la anemia se tolera y dónde deja de tolerarse.',
        paneles: [
            { ...LAMINAS, nodos: ['#mh-fig-12-1', '#mh-fig-12-2', '#mh-fig-12-3'] },
            { tipo: 'barras', titulo: 'El hematocrito cae sin perder un hematíe', nota: 'Figura 12.1 en cifras: al tumbarse o con un bolo de salino, la misma masa de hematíes queda en más plasma.',
              tabla: '#mh-fig-12-1-cifras', series: [{ col: 1, nombre: 'Hto antes', color: 'rojo' }, { col: 2, nombre: 'Hto después', color: 'dorado' }] },
            { tipo: 'barras', titulo: 'Viscosidad de la sangre según el hematocrito', nota: 'Tabla 12.2 dibujada: a menos hematíes, sangre más fluida.',
              tabla: '#mh-tabla-12-2', series: [{ col: 1, nombre: 'Viscosidad relativa (agua = 1)', color: 'rojo' }] },
            { tipo: 'flujo', titulo: 'Compensación y su límite', nodos: [
                { fuente: '#mh-anemia-compensacion', etiqueta: 'Dos respuestas: ↑ gasto cardíaco y ↑ extracción de O₂', color: 'verde' },
                { fuente: '#mh-no-newtoniano', etiqueta: 'El gasto sube más de lo que cae el Hto', color: 'verde' },
                { fuente: '#mh-limite-compensacion', etiqueta: 'VO₂ = DO₂ × extracción: el techo, Hto 10 %', color: 'amarillo' },
                [{ fuente: '#mh-techo-extraccion', etiqueta: 'Extracción de O₂ ~50 %', color: 'rojo' }, { fuente: '#mh-scvo2-disparador', etiqueta: 'ScvO₂ <70 % como disparador', color: 'rojo' }],
                { fuente: '#mh-tolerancia', color: 'purpura' }
            ] },
            { tipo: 'comparar', titulo: 'Trampas y causas propias de la UCI', columnas: [
                { titulo: 'Medida', color: 'amarillo', nodos: [{ fuente: '#mh-trampa-volumen', etiqueta: 'La trampa del volumen plasmático' }, '#mh-anemia-corte'] },
                { titulo: 'Anemia de la UCI', color: 'rojo', nodos: ['#mh-anemia-inflamacion', '#mh-anemia-flebotomia'] }
            ] }
        ]
    });

    montarVisual('merino-transfusion', {
        guia: 'Dónde está cada umbral de transfusión y por qué la Hb no basta.',
        paneles: [
            { ...LAMINAS, nodos: ['#mh-fig-12-4', '#mh-fig-12-6'] },
            { tipo: 'linea', titulo: 'Umbrales de Hb en una regla', nota: 'La cirugía cardíaca figura en los dos umbrales de la fuente (<7 poscirugía cardíaca; <8 cirugía cardíaca u ortopédica): ver la nota de fidelidad en el texto.', min: 5, max: 11, ticks: [5, 6, 7, 8, 9, 10, 11], unidad: 'Hb, g/dl', nodos: [
                { fuente: '#mh-umbral-7', etiqueta: 'Hb <7: crítico estable', en: 7, color: 'verde' },
                { fuente: '#mh-umbral-8', etiqueta: 'Hb <8: cardiopatía isquémica, cirugía cardíaca u ortopédica', en: 8, color: 'amarillo' },
                { fuente: '#mh-umbral-historia', etiqueta: 'Hb ≤10: recomendada en 1942', en: 10, fila: 'abajo', color: 'gris' }
            ] },
            { tipo: 'comparar', titulo: 'El disparador', columnas: [
                { titulo: 'Problema', color: 'rojo', nodos: ['#mh-hb-mal-disparador'] },
                { titulo: 'Alternativa', color: 'verde', nodos: ['#mh-extraccion-disparador'] }
            ] },
            { tipo: 'racimos', titulo: 'La unidad de hematíes', grupos: [
                { titulo: 'Preparaciones', color: 'dorado', tabla: '#mh-tabla-12-3' },
                { titulo: 'Administración', color: 'amarillo', nodos: ['#mh-tiempo-infusion', '#mh-filtros'] },
                { titulo: 'Evidencia', color: 'purpura', nodos: [
                    { fuente: '#mh-efecto-transfusion', etiqueta: '¿Mejora la oxigenación?' },
                    { fuente: '#mh-peor', etiqueta: '¿Anemia o transfusión?' },
                    { fuente: '#mh-volumen-vs-celulas', etiqueta: 'Volumen frente a masa de hematíes' }] }
            ] }
        ]
    });

    montarVisual('merino-riesgos', {
        guia: 'Cada riesgo de la tabla, según lo frecuente que es, y el reloj de la transfusión.',
        paneles: [
            { tipo: 'frecuencias', titulo: 'Frecuencia de cada reacción', nota: 'Por unidad transfundida, salvo la sobrecarga circulatoria (TACO)†: su 1:100 es por receptor, no por unidad (nota † de la Tabla 12.5).', tabla: '#mh-tabla-12-5',
              series: [{ nombre: 'Relacionados con inmunidad', color: 'purpura' }, { nombre: 'Otros', color: 'dorado' }] },
            { tipo: 'linea', titulo: 'El reloj de la transfusión', nota: 'Horas desde que empieza la transfusión. Los plazos son de la ficha (pág. 12-16); el sitio exacto de cada marca es ilustrativo.',
              min: 0, max: 6, ticks: [0, 1, 2, 3, 4, 5, 6], unidad: 'horas', bandas: [{ desde: 0, hasta: 6, texto: 'TRALI, TACO y fiebre: hasta 6 h', color: 'amarillo', alinear: 'fin' }], nodos: [
                { fuente: '#mh-hemolitica', etiqueta: 'Hemolítica: en los primeros minutos', en: 0, color: 'rojo' },
                { fuente: '#mh-hipersensibilidad', etiqueta: 'Urticaria: durante la transfusión, sin fiebre', en: 0.5, fila: 'abajo', color: 'dorado' },
                { fuente: '#mh-trali', etiqueta: 'TRALI: a menudo en la 1.ª hora, hasta 6 h', en: 1, color: 'purpura' },
                { fuente: '#mh-fiebre-nh', etiqueta: 'Fiebre no hemolítica: rara en la 1.ª hora, hasta 6 h', en: 1.5, fila: 'abajo', color: 'amarillo' },
                { fuente: '#mh-taco', etiqueta: 'TACO: en las primeras 6 h', en: 6, fila: 'abajo', color: 'verde' }
            ] },
            { ...LAMINAS, nodos: ['#mh-fig-12-5'] },
            { tipo: 'comparar', titulo: 'Las reacciones, una a una', columnas: [
                { titulo: 'Inmunológicas', color: 'purpura', nodos: ['#mh-hemolitica', '#mh-fiebre-nh', '#mh-hipersensibilidad', '#mh-trali'] },
                { titulo: 'Otras', color: 'dorado', nodos: ['#mh-taco', '#mh-nosocomiales'] }
            ] }
        ]
    });

    montarVisual('merino-trombocitopenia', {
        guia: 'De cómo se tapa un vaso a la HIT: sospecha, 4Ts y tratamiento.',
        paneles: [
            { tipo: 'flujo', titulo: 'La hemostasia en tres pasos', nodos: [
                { fuente: '#mh-glucocalix', etiqueta: 'Glucocálix: la sangre no se pega', color: 'verde' },
                { fuente: '#mh-hemostasia-primaria', etiqueta: 'Herida: tapón de plaquetas (GPIIb/IIIa, FvW)', color: 'amarillo' },
                { fuente: '#mh-hemostasia-secundaria', etiqueta: 'Fibrina: el tapón se vuelve trombo', color: 'rojo' }
            ] },
            { tipo: 'flujo', titulo: 'Recuento inesperadamente bajo', nodos: [
                { fuente: '#mh-pseudotrombo', etiqueta: 'Pseudotrombocitopenia: el contador se equivoca', color: 'gris' }
            ] },
            { tipo: 'flujo', titulo: 'HIT paso a paso', nodos: [
                { fuente: '#mh-hit-mecanismo', color: 'dorado' }, { fuente: '#mh-hit-riesgo', color: 'amarillo' },
                { fuente: '#mh-hit-clinica', color: 'rojo' }, { fuente: '#mh-hit-diagnostico', color: 'purpura' }
            ] },
            { tipo: 'puntos', titulo: 'Escala 4Ts', resultado: ['#ts4-resultado'], items: [
                { control: '#ts4-trombo', etiqueta: 'Trombocitopenia' }, { control: '#ts4-tiempo', etiqueta: 'Momento de aparición' },
                { control: '#ts4-trombosis', etiqueta: 'Trombosis u otras secuelas' }, { control: '#ts4-otras', etiqueta: 'Otras causas de trombocitopenia' }
            ] },
            { tipo: 'escalera', titulo: 'Manejo según el riesgo', nodos: ['#mh-4ts-bajo', '#mh-4ts-intermedio', '#mh-4ts-alto'] },
            { tipo: 'comparar', titulo: 'Anticoagular sin heparina', columnas: [
                { titulo: 'Contraindicado', color: 'rojo', nodos: ['#mh-hit-warfarina'] },
                { titulo: 'Opciones', color: 'verde', nodos: ['#mh-argatroban', '#mh-hit-alternativas'] }
            ] }
        ]
    });

    montarVisual('merino-microangiopatias', {
        guia: 'Las tres microangiopatías comparten esquistocitos y plaquetas bajas; solo la CID consume factores.',
        paneles: [
            { ...LAMINAS, nodos: ['#mh-fig-13-1'] },
            { tipo: 'matriz', titulo: 'Perfil de laboratorio', tabla: '#mh-tabla-13-3' },
            { tipo: 'comparar', titulo: 'Las tres entidades', columnas: [
                { titulo: 'CID', color: 'rojo', nodos: [{ fuente: '#mh-cid', etiqueta: 'Abrir' }] },
                { titulo: 'PTT', color: 'purpura', nodos: [{ fuente: '#mh-ptt', etiqueta: 'Abrir' }] },
                { titulo: 'SHU', color: 'amarillo', nodos: [{ fuente: '#mh-shu', etiqueta: 'Abrir' }] }
            ] }
        ]
    });

    montarVisual('merino-plaquetas-plasma', {
        guia: 'Umbrales de plaquetas, reacciones por preparación y el plasma.',
        paneles: [
            { ...LAMINAS, nodos: ['#mh-fig-13-2', '#mh-fig-13-3'] },
            { tipo: 'escalera', titulo: 'Umbrales de transfusión de plaquetas, de menor a mayor', nota: 'Según la fuente, los umbrales profilácticos (sin sangrado y para procedimientos) no están validados; para el sangrado activo no dice lo mismo (ver texto).', nodos: [
                '#mh-plaq-profilaxis', '#mh-plaq-cvc', '#mh-plaq-cirugia', '#mh-plaq-pl', '#mh-plaq-sangrado'] },
            { tipo: 'barras', titulo: 'Reacciones por 100.000 unidades', tabla: '#mh-tabla-13-4', excluir: ['Total'],
              series: [{ col: 1, nombre: 'Multidonante', color: 'verde' }, { col: 2, nombre: 'Aféresis', color: 'rojo' }] },
            { tipo: 'racimos', titulo: 'Plasma y crioprecipitado', grupos: [
                { titulo: 'Plasma fresco congelado', color: 'dorado', nodos: ['#mh-pfc', '#mh-pfc-masiva', '#mh-pfc-warfarina', '#mh-pfc-profilactico'] },
                { titulo: 'Trampas', color: 'rojo', nodos: [{ fuente: '#mh-trampa-inr', etiqueta: 'La trampa del INR con el PFC' }, { fuente: '#mh-pfc-riesgos', etiqueta: 'Riesgos propios del PFC' }] },
                { titulo: 'Crioprecipitado', color: 'purpura', nodos: [{ fuente: '#mh-crio', etiqueta: 'Qué es y cuándo' }] }
            ] }
        ]
    });
}
