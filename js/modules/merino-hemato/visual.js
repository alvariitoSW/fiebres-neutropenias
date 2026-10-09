// Vista Visual de Merino HEMATO: recetas para core/visual-kit.js. Las tablas
// con cifras se dibujan leyendo sus celdas (barras, matriz, frecuencias); la
// 4Ts escribe en sus <select> reales y copia el resultado de calc4Ts().
import { montarVisual } from '../../core/visual-kit.js';

export function init() {
    montarVisual('merino-anemia', {
        guia: 'Por qué la anemia se tolera y dónde deja de tolerarse.',
        paneles: [
            { tipo: 'barras', titulo: 'Viscosidad de la sangre según el hematocrito', nota: 'Tabla de la ficha, dibujada: a menos hematíes, sangre más fluida.',
              tabla: 1, series: [{ col: 1, nombre: 'Viscosidad relativa (agua = 1)', color: 'rojo' }] },
            { tipo: 'flujo', titulo: 'Compensación y su límite', nodos: [
                { fuente: 'La anemia desencadena 2 respuestas', etiqueta: 'Dos respuestas: ↑ gasto cardíaco y ↑ extracción de O₂', color: 'verde' },
                { fuente: 'La relación clave es VO₂', etiqueta: 'VO₂ = DO₂ × extracción: el límite', color: 'amarillo' },
                [{ fuente: 'Extracción de O₂ ~50%', color: 'rojo' }, { fuente: 'Equivale aprox. a SaO₂', etiqueta: 'ScvO₂ <70% como disparador', color: 'rojo' }],
                { fuente: 'Tolerancia a la anemia extrema', color: 'purpura' }
            ] },
            { tipo: 'comparar', titulo: 'Trampas y causas propias de la UCI', columnas: [
                { titulo: 'Medida', color: 'amarillo', nodos: [{ fuente: 'Como el Hto/Hb son concentraciones', etiqueta: 'La trampa del volumen plasmático' }, 'Definición clínica de anemia'] },
                { titulo: 'Anemia de la UCI', color: 'rojo', nodos: ['Inflamación', 'Flebotomía diagnóstica'] }
            ] }
        ]
    });

    montarVisual('merino-transfusion', {
        guia: 'Dónde está cada umbral de transfusión y por qué la Hb no basta.',
        paneles: [
            { tipo: 'linea', titulo: 'Umbrales de Hb en una regla', min: 5, max: 11, ticks: [5, 6, 7, 8, 9, 10, 11], unidad: 'Hb, g/dl', nodos: [
                { fuente: 'Hb <7 g/dl', etiqueta: 'Hb <7: crítico estable', en: 7, color: 'verde' },
                { fuente: 'Hb <8 g/dl', etiqueta: 'Hb <8: cardiopatía isquémica, cirugía cardíaca/ortopédica', en: 8, color: 'amarillo' },
                { fuente: 'En 1942', etiqueta: 'Hb 10 (el "10/30" histórico)', en: 10, fila: 'abajo', color: 'gris' }
            ] },
            { tipo: 'comparar', titulo: 'El disparador', columnas: [
                { titulo: 'Problema', color: 'rojo', nodos: ['2 problemas del umbral por Hb'] },
                { titulo: 'Alternativa', color: 'verde', nodos: ['Alternativa: extracción de O₂'] }
            ] },
            { tipo: 'racimos', titulo: 'La unidad de hematíes', grupos: [
                { titulo: 'Preparaciones', color: 'dorado', nodos: ['Concentrado de hematíes', 'Leucorreducido', 'Lavado'] },
                { titulo: 'Administración', color: 'amarillo', nodos: ['Tiempo de infusión', 'Filtros de sangre'] },
                { titulo: 'Evidencia', color: 'purpura', nodos: [
                    { fuente: 'En un adulto medio, 1 unidad', etiqueta: '¿Mejora la oxigenación?' },
                    { fuente: 'Una revisión de 45 estudios', etiqueta: '¿Anemia o transfusión?' },
                    { fuente: 'El mensaje de fondo del capítulo', etiqueta: 'Volumen vs. masa de hematíes' }] }
            ] }
        ]
    });

    montarVisual('merino-riesgos', {
        guia: 'Cada riesgo de la tabla, colocado según lo frecuente que es.',
        paneles: [
            { tipo: 'frecuencias', titulo: 'Frecuencia por unidad transfundida', tabla: 0,
              series: [{ nombre: 'Relacionados con inmunidad', color: 'purpura' }, { nombre: 'Otros', color: 'dorado' }] },
            { tipo: 'comparar', titulo: 'Las reacciones, una a una', columnas: [
                { titulo: 'Inmunológicas', color: 'purpura', nodos: ['Reacción hemolítica aguda', 'Fiebre no hemolítica', 'Hipersensibilidad', 'TRALI'] },
                { titulo: 'Otras', color: 'dorado', nodos: ['TACO', 'Infecciones nosocomiales'] }
            ] }
        ]
    });

    montarVisual('merino-trombocitopenia', {
        guia: 'De la trombocitopenia del crítico a la HIT: sospecha, 4Ts y tratamiento.',
        paneles: [
            { tipo: 'flujo', titulo: 'HIT paso a paso', nodos: [
                { fuente: 'Pseudotrombocitopenia', color: 'gris' },
                { fuente: 'Mecanismo', color: 'dorado' }, { fuente: 'Factores de riesgo', color: 'amarillo' },
                { fuente: 'Clínica', color: 'rojo' }, { fuente: 'Diagnóstico', color: 'purpura' }
            ] },
            { tipo: 'puntos', titulo: 'Escala 4Ts', resultado: ['#ts4-resultado'], items: [
                { control: '#ts4-trombo', etiqueta: 'Trombocitopenia' }, { control: '#ts4-tiempo', etiqueta: 'Momento de aparición' },
                { control: '#ts4-trombosis', etiqueta: 'Trombosis u otras secuelas' }, { control: '#ts4-otras', etiqueta: 'Otras causas de trombocitopenia' }
            ] },
            { tipo: 'escalera', titulo: 'Manejo según el riesgo', nodos: ['Bajo riesgo (≤3', 'Riesgo intermedio (4-5', 'Alto riesgo (6-8'] },
            { tipo: 'comparar', titulo: 'Anticoagular sin heparina', columnas: [
                { titulo: 'Contraindicado', color: 'rojo', nodos: ['Warfarina'] },
                { titulo: 'Opciones', color: 'verde', nodos: ['Argatrobán', 'Alternativas y manejo a largo plazo'] }
            ] }
        ]
    });

    montarVisual('merino-microangiopatias', {
        guia: 'Las tres microangiopatías comparten esquistocitos y plaquetas bajas; solo la CID consume factores.',
        paneles: [
            { tipo: 'matriz', titulo: 'Perfil de laboratorio', tabla: 0 },
            { tipo: 'comparar', titulo: 'Las tres entidades', columnas: [
                { titulo: 'CID', color: 'rojo', nodos: [{ fuente: 'Coagulación intravascular diseminada', etiqueta: 'Abrir' }] },
                { titulo: 'PTT', color: 'purpura', nodos: [{ fuente: 'Púrpura trombocitopénica trombótica', etiqueta: 'Abrir' }] },
                { titulo: 'SHU', color: 'amarillo', nodos: [{ fuente: 'Síndrome hemolítico-urémico', etiqueta: 'Abrir' }] }
            ] }
        ]
    });

    montarVisual('merino-plaquetas-plasma', {
        guia: 'Umbrales de plaquetas, reacciones por preparación y el plasma.',
        paneles: [
            { tipo: 'escalera', titulo: 'Umbrales de transfusión de plaquetas, de menor a mayor', nota: 'Ninguno está validado formalmente (ver texto).', nodos: [
                'Profiláctica, sin sangrado', 'Profiláctica, inserción de catéter', 'Profiláctica, cirugía electiva', 'Profiláctica, punción lumbar', 'Sangrado activo'] },
            { tipo: 'barras', titulo: 'Reacciones por 100.000 unidades', tabla: 0, excluir: ['Total'],
              series: [{ col: 1, nombre: 'Multidonante', color: 'verde' }, { col: 2, nombre: 'Aféresis', color: 'rojo' }] },
            { tipo: 'racimos', titulo: 'Plasma y crioprecipitado', grupos: [
                { titulo: 'Plasma fresco congelado', color: 'dorado', nodos: ['Preparación', 'Hemorragia masiva', 'Reversión de warfarina', 'PFC profiláctico'] },
                { titulo: 'Trampas', color: 'rojo', nodos: [{ fuente: 'El INR solo refleja', etiqueta: 'La trampa del INR con el PFC' }, { fuente: 'Los tipos de reacción adversa al PFC', etiqueta: 'Riesgos propios del PFC' }] },
                { titulo: 'Crioprecipitado', color: 'purpura', nodos: [{ fuente: 'Al descongelar PFC', etiqueta: 'Qué es y cuándo' }] }
            ] }
        ]
    });
}
