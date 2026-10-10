// Vista Visual de Reconocimiento Temprano del Paciente Hematológico: recetas
// para core/visual-kit.js. La tabla de epidemiología se dibuja como barras
// (una por columna, nunca dos escalas en el mismo eje); el selector de
// terapias dirigidas y la evaluación de síntomas se manejan desde la imagen.
import { montarVisual } from '../../core/visual-kit.js';

export function init() {
    montarVisual('rt-epidemiologia', {
        guia: 'Qué neoplasias llegan antes y con más frecuencia a la UCI, y por qué ingresan.',
        paneles: [
            { tipo: 'barras', titulo: 'Incidencia acumulada de ingreso en UCI a 1 año', tabla: 0,
              series: [{ col: 1, nombre: 'Incidencia acumulada a 1 año', color: 'rojo' }] },
            { tipo: 'barras', titulo: 'Tiempo medio hasta el ingreso en UCI', nota: 'Barra corta = llega antes a la UCI.', tabla: 0,
              series: [{ col: 2, nombre: 'Tiempo medio a UCI', color: 'amarillo' }] },
            { tipo: 'racimos', titulo: 'Por qué ingresan y qué reciben', grupos: [
                { titulo: 'En la UCI', color: 'dorado', nodos: [{ fuente: 'Diagnóstico principal al ingreso', etiqueta: 'Diagnóstico principal al ingreso' },
                    { fuente: 'Depuración extrarrenal', etiqueta: 'Depuración extrarrenal y quimioterapia en UCI' }] },
                { titulo: 'Patrones por enfermedad', color: 'purpura', nodos: ['LMA', 'Linfoma', 'Mieloma múltiple'] }
            ] }
        ]
    });

    montarVisual('rt-contexto', {
        guia: 'Las causas de fracaso respiratorio propias del paciente hematológico.',
        paneles: [
            { tipo: 'racimos', titulo: 'Causas propias', grupos: [
                { titulo: 'Infiltrados específicos de la LMA', color: 'rojo', nodos: ['Leucostasis pulmonar', 'Infiltración leucémica', 'Neumopatía por lisis'] },
                { titulo: 'Menos frecuentes (y sus trampas)', color: 'amarillo', nodos: ['Proteinosis alveolar', 'Toxicidad pulmonar por fármacos', 'Fusarium tras terapia CAR-T'] }
            ] }
        ]
    });

    montarVisual('rt-direct', {
        guia: 'Las seis letras de DIRECT, en el orden en que se recorren a pie de cama.',
        paneles: [
            { tipo: 'flujo', titulo: 'Enfoque DIRECT', nodos: [
                { fuente: 'D · Delay', color: 'dorado' },
                { fuente: 'I · Patrón de inmunodeficiencia', color: 'purpura' },
                { fuente: 'R · Radiología', color: 'amarillo' },
                { fuente: 'E · Experiencia compartida', color: 'verde' },
                { fuente: 'C · Clínica', color: 'amarillo' },
                { fuente: 'T · TC de alta resolución', color: 'rojo' }
            ] }
        ]
    });

    montarVisual('rt-diagnostico', {
        guia: 'Los 10 principios agrupados, la prueba según el compartimento y la infección según el defecto inmune.',
        paneles: [
            { tipo: 'racimos', titulo: '10 principios del estudio diagnóstico', grupos: [
                { titulo: 'Qué pedir', color: 'verde', nodos: [
                    { fuente: 'No hagas todas las pruebas', etiqueta: 'Según la probabilidad pre-test (DIRECT)' },
                    { fuente: 'Todo paciente necesita un estudio', etiqueta: 'Todo paciente necesita un estudio' },
                    { fuente: 'En el FRA hipoxémico, prioriza', etiqueta: 'FRA hipoxémico: primero lo no invasivo' },
                    { fuente: 'La mejor prueba es la que explora', etiqueta: 'Explora el compartimento más afectado' },
                    { fuente: 'Una buena estrategia diagnóstica', etiqueta: 'Una estrategia rinde más que una prueba' }] },
                { titulo: 'Cómo interpretar', color: 'amarillo', nodos: [
                    { fuente: 'Evita el sesgo de confirmación', etiqueta: 'Evita el sesgo de confirmación' },
                    { fuente: 'Una PCR positiva no es sinónimo', etiqueta: 'PCR positiva no es diagnóstico' },
                    { fuente: 'Una prueba negativa también aporta', etiqueta: 'Una prueba negativa también aporta' }] },
                { titulo: 'Procedimientos invasivos', color: 'rojo', nodos: [
                    { fuente: 'Si la LBA es imprescindible', etiqueta: 'Intubar para poder hacer la LBA' },
                    { fuente: 'El balance riesgo-beneficio', etiqueta: 'Riesgo-beneficio consensuado' },
                    { fuente: 'La LBA sí es imprescindible en', etiqueta: 'Cuándo la LBA es imprescindible' }] }
            ] },
            { tipo: 'racimos', titulo: 'Pruebas no invasivas', grupos: [
                { titulo: 'Elegir según el compartimento', color: 'dorado', nodos: ['Biomarcadores', 'Antígenos en suero y orina', 'PCR en sangre',
                    'PCR respiratoria', 'PCR de tejido/líquido', 'Muestras poco invasivas'] },
                { titulo: 'Tiempo', color: 'rojo', nodos: ['El tiempo hasta el antibiótico importa', { fuente: 'Empezar sin demora', etiqueta: 'Antibioterapia empírica en UCI' }] }
            ] },
            { tipo: 'comparar', titulo: 'Qué infección esperar según el defecto inmune', columnas: [
                { titulo: 'Neutrófilos', color: 'amarillo', nodos: ['Neutropenia corta', 'Neutropenia prolongada'] },
                { titulo: 'Linfocitos', color: 'purpura', nodos: ['Inmunidad humoral', 'Déficit de células T'] },
                { titulo: 'Otros', color: 'dorado', nodos: ['Disfunción de monocitos/macrófagos', 'Ibrutinib'] }
            ] },
            { tipo: 'racimos', titulo: 'Infecciones oportunistas a vigilar', grupos: [
                { titulo: 'Vigilar', color: 'rojo', nodos: ['CMV', 'VHS', 'VHH-6', 'Toxoplasma y micobacterias'] }
            ] }
        ]
    });

    montarVisual('rt-sindromes', {
        guia: 'Síndromes y toxicidades del paciente hematológico crítico, aparte de los infiltrados.',
        paneles: [
            { tipo: 'racimos', titulo: 'Síndromes y toxicidades', grupos: [
                { titulo: 'Inflamatorios e inmunes', color: 'rojo', nodos: ['Síndrome hemofagocítico', 'EICH agudo', 'CRS e ICANS'] },
                { titulo: 'Sangre y órganos', color: 'purpura', nodos: ['Síndrome de hiperviscosidad', 'Toxicidad cardiaca', 'Coagulopatía y refractariedad plaquetaria'] }
            ] }
        ]
    });

    montarVisual('rt-manejo', {
        guia: 'Del oxígeno a la UCI, y qué empeora el pronóstico.',
        paneles: [
            { tipo: 'flujo', titulo: 'Soporte respiratorio y hemodinámico', nodos: [
                { fuente: 'Objetivo: SpO2 88-95%', etiqueta: 'Oxígeno: SpO₂ 88-95%', color: 'verde' },
                { fuente: 'La VNI NO está recomendada', etiqueta: 'VNI no recomendada en el FRA hipoxémico', color: 'rojo' },
                [{ fuente: 'Esperar >1 hora por una cama', etiqueta: 'No esperar la cama de UCI', color: 'amarillo' },
                 { fuente: 'La neutropenia, por sí sola', etiqueta: 'La neutropenia no niega la UCI', color: 'amarillo' }],
                [{ fuente: '~80% de los inmunodeprimidos', etiqueta: 'SDRA', color: 'purpura' },
                 { fuente: 'Sigue las guías estándar de sepsis', etiqueta: 'Shock séptico', color: 'purpura' }],
                { fuente: 'Hematíes: estrategia restrictiva', etiqueta: 'Umbrales transfusionales', color: 'dorado' }
            ] },
            { tipo: 'racimos', titulo: 'Factores asociados a mayor mortalidad', grupos: [
                { titulo: 'Pronóstico', color: 'rojo', nodos: ['Características generales', 'Historia de la neoplasia', 'Momento del ingreso en UCI', 'Eventos durante el ingreso'] }
            ] }
        ]
    });

    montarVisual('rt-terapias', {
        guia: 'Elige una clase de terapia dirigida: la imagen copia su defecto inmune y la infección esperable.',
        paneles: [
            { tipo: 'selector', titulo: 'Riesgo infeccioso por clase de fármaco', control: '#rt-terapia-select', forma: 'chips', color: 'purpura',
              resultado: ['#rt-terapia-resultado'] }
        ]
    });

    montarVisual('rt-decisiones', {
        guia: 'Cómo se decide el ingreso y cuándo replantearlo.',
        paneles: [
            { tipo: 'flujo', titulo: 'Decisión de ingreso', nodos: [
                { fuente: 'La decisión no debe basarse solo', etiqueta: '¿Cuándo ingresar en UCI?', color: 'dorado' },
                { fuente: 'Cuando hay dudas sobre la reversibilidad', etiqueta: 'Ensayo de tiempo limitado', color: 'amarillo' },
                { fuente: 'Objetivos de cuidado', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Contexto', grupos: [
                { titulo: 'Motivos de ingreso, revisitados', color: 'dorado', nodos: [{ fuente: 'Con la cronificación', etiqueta: 'La cronificación cambia los ingresos' }] }
            ] }
        ]
    });

    montarVisual('rt-finvida', {
        guia: 'Objetivos realistas, evaluación de síntomas (marca desde aquí) y secuelas del superviviente.',
        paneles: [
            { tipo: 'flujo', titulo: 'Cuidados al final del ingreso', nodos: [
                { fuente: 'Paciente, familia y equipo', etiqueta: 'Objetivos de cuidado realistas', color: 'purpura' },
                { fuente: 'El paciente crítico hematológico sufre', etiqueta: 'Evaluación sistemática de síntomas', color: 'amarillo' },
                { fuente: 'Tras ventilación mecánica', etiqueta: 'Secuelas del superviviente de UCI', color: 'dorado' }
            ] },
            { tipo: 'puntos', titulo: 'Síntomas presentes', items: [{ checks: '.rt-sintoma-check', pts: 1 }], resultado: ['#rt-sintomas-resultado'] }
        ]
    });
}
