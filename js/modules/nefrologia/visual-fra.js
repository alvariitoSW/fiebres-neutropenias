// Vista Visual de Fracaso Renal Agudo (Nefrología): recetas para
// core/visual-kit.js. Las dos calculadoras de la ficha (estadio KDIGO por
// creatinina y FENa/IFR) se conectan con el panel 'calculadora'.
import { montarVisual } from '../../core/visual-kit.js';

export function initVisualFra() {
    montarVisual('fra-definicion', {
        guia: 'Tres estadios, una calculadora por creatinina y el paso de IRA a ERC.',
        paneles: [
            { tipo: 'escalera', titulo: 'Estadios KDIGO', tabla: 0 },
            { tipo: 'calculadora', titulo: 'Estadio por creatinina (calculadora de la ficha)', campos: ['#fra-cr-basal', '#fra-cr-actual'],
              resultado: ['#fra-estadio-resultado'] },
            { tipo: 'flujo', titulo: 'Del episodio agudo a la enfermedad crónica', nodos: [
                { fuente: 'Concepto', etiqueta: 'IRA subclínica (ADQI)', color: 'gris' },
                { fuente: 'Definición', etiqueta: 'IRA (primeros 7 días)', color: 'amarillo' },
                { fuente: 'Enfermedad renal aguda', etiqueta: 'ERA (de 7 días a 3 meses)', color: 'rojo' },
                { fuente: 'Cronología', etiqueta: 'ERC (más de 3 meses)', color: 'purpura' }
            ] }
        ]
    });

    montarVisual('fra-epidemiologia', {
        guia: 'Cuánta IRA hay según dónde se mire y por qué mecanismo aparece.',
        paneles: [
            { tipo: 'racimos', titulo: 'Incidencia según el contexto (tabla)', tabla: 0, color: 'amarillo' },
            { tipo: 'racimos', titulo: 'Etiología por mecanismo (tabla 2)', tabla: 1, color: 'rojo' },
            { tipo: 'racimos', titulo: 'Quién está en riesgo', grupos: [
                { titulo: 'Riesgo', color: 'purpura', nodos: ['Factores de riesgo principales', 'IRA asociada a sepsis'] }
            ] }
        ]
    });

    montarVisual('fra-subfenotipos-1', {
        guia: 'Tres escenarios frecuentes, cada uno con su mecanismo y su manejo.',
        paneles: [
            { tipo: 'racimos', titulo: 'Subfenotipo por subfenotipo', grupos: [
                { titulo: 'Posquirúrgica', color: 'amarillo', nodos: ['Patogenia', 'Bloqueo del SRAA perioperatorio', { fuente: 'Tratamiento', etiqueta: 'Tratamiento' }] },
                { titulo: 'Sepsis', color: 'rojo', nodos: ['Magnitud', 'Mecanismos patogénicos implicados', 'IRA asociada a sepsis', 'IRA inducida por la sepsis'] },
                { titulo: 'Tóxica', color: 'purpura', nodos: ['Incidencia según el contexto', 'Mecanismos del daño renal por toxicidad', 'Factores moduladores', { fuente: 'Tratamiento', tras: 'Factores moduladores' }] }
            ] }
        ]
    });

    montarVisual('fra-subfenotipos-2', {
        guia: 'Cuatro órganos o situaciones que dañan el riñón de forma propia.',
        paneles: [
            { tipo: 'mapa', titulo: 'Dónde empieza', nodos: [
                { fuente: 'Definición', etiqueta: 'Corazón: síndrome cardiorrenal tipo 1', organo: 'corazon', color: 'rojo' },
                { fuente: 'Incidencia', etiqueta: 'Hígado: cirrosis', organo: 'higado', color: 'amarillo' },
                { fuente: 'Impacto', etiqueta: 'Embarazo', organo: 'abdomen', color: 'purpura' },
                { fuente: 'Magnitud', etiqueta: 'Vía urinaria: obstrucción', organo: 'vejiga', color: 'dorado' }
            ] },
            { tipo: 'racimos', titulo: 'Cada uno, en detalle', grupos: [
                { titulo: 'Cardiorrenal', color: 'rojo', nodos: ['Mecanismos patogénicos', 'Clasificación por FEVI', 'Evaluación a pie de cama', { fuente: 'Tratamiento', tras: 'Evaluación a pie de cama' }] },
                { titulo: 'Cirrosis', color: 'amarillo', nodos: ['Criterios ICA', 'Particularidad del estadio 1', 'Causas más frecuentes', 'Diagnóstico de SHR-IRA', 'Mecanismos fisiopatogénicos hemodinámicos', 'Tratamiento del SHR-IRA'] },
                { titulo: 'Embarazo (tabla)', color: 'purpura', tabla: 0 },
                { titulo: 'Obstructiva', color: 'dorado', nodos: ['Fisiopatología', { fuente: 'Tratamiento', tras: 'Fisiopatología' }] }
            ] }
        ]
    });

    montarVisual('fra-diagnostico', {
        guia: 'El algoritmo en cinco pasos, los índices urinarios y lo que dicen el sedimento y la imagen.',
        paneles: [
            { tipo: 'flujo', titulo: 'Algoritmo diagnóstico', nodos: [
                { fuente: '1. Elevación de productos nitrogenados', color: 'amarillo' },
                { fuente: '2. Datos de hipoperfusión', color: 'verde' },
                { fuente: '3. Ecografía renal', color: 'dorado' },
                { fuente: '4. Perfiles IRA', color: 'rojo' },
                { fuente: '5. Orientación final', color: 'purpura' }
            ] },
            { tipo: 'calculadora', titulo: 'FENa e IFR (calculadora de la ficha)',
              campos: ['#fra-na-orina', '#fra-na-serico', '#fra-cr-orina', '#fra-cr-serica'], resultado: ['#fra-fena-resultado'] },
            { tipo: 'racimos', titulo: 'Hipoperfusión frente a NTA (tabla 3)', tabla: 0, color: 'amarillo' },
            { tipo: 'racimos', titulo: 'Sedimento: qué significa cada hallazgo (tabla 4)', tabla: 1, color: 'rojo' },
            { tipo: 'flujo', titulo: 'Prueba de respuesta a furosemida', nodos: [
                { fuente: 'Fundamento', color: 'gris' }, { fuente: 'Protocolo', color: 'amarillo' }, { fuente: 'Interpretación', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Imagen y biopsia', grupos: [
                { titulo: 'Imagen', color: 'dorado', nodos: ['Ecografía renal', 'Pruebas de imagen avanzadas'] },
                { titulo: 'Biopsia', color: 'purpura', nodos: ['Uso habitual', 'Cuándo sí está indicada', { fuente: 'Seguridad', tras: 'Cuándo sí está indicada' }] }
            ] }
        ]
    });

    montarVisual('fra-complicaciones-tto', {
        guia: 'Qué complica una IRA y cómo se trata cada problema.',
        paneles: [
            { tipo: 'racimos', titulo: 'Complicaciones', grupos: [
                { titulo: 'A corto plazo (tabla)', color: 'rojo', tabla: 0 },
                { titulo: 'Más allá del riñón', color: 'purpura', nodos: ['Disfunción de otros órganos', 'Complicaciones a largo plazo'] }
            ] },
            { tipo: 'racimos', titulo: 'Tratamiento médico', grupos: [
                { titulo: 'Volumen', color: 'dorado', nodos: [{ fuente: 'Relevancia', etiqueta: 'Balance de fluidos' }] },
                { titulo: 'Potasio', color: 'rojo', nodos: [{ fuente: 'Tratamiento activo' }, 'Eliminación de potasio'] },
                { titulo: 'Acidosis', color: 'amarillo', nodos: [{ fuente: 'Causas', tras: 'Eliminación de potasio' }, 'Papel del bicarbonato sódico'] },
                { titulo: 'Otros iones', color: 'verde', nodos: ['Hipocalcemia', 'Hiperfosfatemia', 'Hiperuricemia'] }
            ] },
            { tipo: 'racimos', titulo: 'Nutrición (KDIGO)', tabla: 1, color: 'verde' }
        ]
    });

    montarVisual('fra-trs', {
        guia: 'Cuándo empezar, con qué técnica, a qué dosis y cuándo parar.',
        paneles: [
            { tipo: 'racimos', titulo: 'Indicaciones urgentes (tabla)', tabla: 0, color: 'rojo' },
            { tipo: 'racimos', titulo: 'El momento de inicio', grupos: [
                { titulo: 'Evidencia', color: 'purpura', nodos: ['Los 5 grandes ensayos', 'Metaanálisis y revisión Cochrane', 'En resumen'] }
            ] },
            { tipo: 'comparar', titulo: 'Modalidades', columnas: [
                { titulo: 'Continua', color: 'verde', nodos: [{ fuente: 'TRS continuo', etiqueta: 'Crítico inestable' }, { fuente: 'Situaciones donde KDIGO sugiere', etiqueta: 'Cuándo preferirla' }] },
                { titulo: 'Intermitente e híbrida', color: 'amarillo', nodos: [{ fuente: 'Estrategias para evitar la hipotensión', etiqueta: 'HDI sin hipotensión' }, 'Técnicas híbridas'] },
                { titulo: 'Peritoneal', color: 'dorado', nodos: ['Diálisis peritoneal'] }
            ] },
            { tipo: 'racimos', titulo: 'Dosis y anticoagulación', grupos: [
                { titulo: 'Dosis (tabla)', color: 'dorado', tabla: 1 },
                { titulo: 'Anticoagulación', color: 'purpura', nodos: ['Técnicas intermitentes', 'Técnicas continuas', 'Anticoagulación regional con citrato'] }
            ] },
            { tipo: 'racimos', titulo: 'Retirada: valores orientativos (tabla)', tabla: 2, color: 'verde' }
        ]
    });

    montarVisual('fra-prediccion', {
        guia: 'Detectar antes que la creatinina y prevenir.',
        paneles: [
            { tipo: 'racimos', titulo: 'Más allá de la creatinina', grupos: [
                { titulo: 'Limitación', color: 'gris', nodos: ['Limitación de la creatinina'] },
                { titulo: 'Biomarcadores', color: 'purpura', nodos: ['NephroCheck', 'NGAL', 'Biomarcadores pronósticos'] },
                { titulo: 'Modelos', color: 'dorado', nodos: ['Estado actual'] }
            ] },
            { tipo: 'racimos', titulo: 'Prevención (KDIGO 2012)', tabla: 0, color: 'verde' }
        ]
    });

    montarVisual('fra-evolucion', {
        guia: 'Después de una IRA: cuatro caminos y quién debe vigilarlos.',
        paneles: [
            { tipo: 'flujo', titulo: 'Escenarios tras un episodio de IRA', nodos: [
                [{ fuente: '1. Recuperación', color: 'verde' }, { fuente: '2. Desarrollo de enfermedad renal crónica', color: 'amarillo' }],
                [{ fuente: '3. Desarrollo de enfermedad cardiovascular', color: 'rojo' }, { fuente: '4. Mortalidad', color: 'purpura' }]
            ] },
            { tipo: 'flujo', titulo: 'Qué hacer en el seguimiento', nodos: [
                { fuente: '1. Monitorizar función renal', color: 'dorado' },
                { fuente: '2. Prevención de la recurrencia', color: 'amarillo' },
                { fuente: '3. Nefroprotección farmacológica', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Quién lo hace', grupos: [
                { titulo: 'Según el perfil (tabla)', color: 'purpura', tabla: 0 },
                { titulo: 'Recomendaciones', color: 'dorado', nodos: ['Recomendaciones KDIGO', 'Recomendación FRASEN', 'Estratificación por probabilidad de recuperación'] }
            ] }
        ]
    });
}
