// Vista Visual de Enfermedad Renal Crónica (KDIGO 2024): recetas para
// core/visual-kit.js, más el mapa de calor G×A de la ficha 1 conectado a la
// calculadora de FGe de la propia ficha (mismas funciones, erc-cga.js).
import { montarVisual } from '../../core/visual-kit.js';
import { irAlTexto } from '../../core/vista-visual.js';
import { ckdEpi2021, categoriaG, categoriaA, MAPA_RIESGO, RIESGO_TEXTO } from './erc-cga.js';

const COLOR_RIESGO = {
    1: 'var(--accent-green)', 2: 'var(--accent-yellow)',
    3: 'color-mix(in srgb, var(--accent-yellow) 62%, var(--accent-red))', 4: 'var(--accent-red)'
};
const FILAS_G = [['G1', '≥90'], ['G2', '60-89'], ['G3a', '45-59'], ['G3b', '30-44'], ['G4', '15-29'], ['G5', '<15']];
const COLS_A = [['A1', '<30'], ['A2', '30-300'], ['A3', '>300']];

// Mapa de calor de KDIGO: la celda del paciente de la calculadora se marca
// con los mismos cálculos que usa calcCgaCategorizador().
function mapaCalor(cuerpo, { tab, texto }) {
    cuerpo.innerHTML = `<div class="erc-calor">
            <span class="erc-calor-esquina">FG \\ ACR</span>${COLS_A.map(([a, r]) => `<span class="erc-calor-cab">${a}<small>${r}</small></span>`).join('')}
            ${FILAS_G.map(([g, r]) => `<span class="erc-calor-cab fila">${g}<small>${r}</small></span>${COLS_A.map(([a]) =>
                `<span class="erc-calor-celda" data-celda="${g}${a}" style="--c:${COLOR_RIESGO[MAPA_RIESGO[g][a]]}"></span>`).join('')}`).join('')}
        </div>
        <div class="vk-matriz-leyenda">${[1, 2, 3, 4].map(n => `<span class="serie" style="--vk:${COLOR_RIESGO[n]}">${RIESGO_TEXTO[n]}</span>`).join('')}</div>
        <p class="erc-calor-paciente"></p>
        <button type="button" class="visual-link">Ver en el texto ↓</button>`;
    const campo = id => document.getElementById(id);
    const marcar = () => {
        const cr = Number(campo('erc-cr').value), edad = Number(campo('erc-edad').value), acrTxt = campo('erc-acr').value;
        const nota = cuerpo.querySelector('.erc-calor-paciente');
        cuerpo.querySelectorAll('.erc-calor-celda.on').forEach(c => c.classList.remove('on'));
        if (!cr || !edad || acrTxt === '' || Number.isNaN(Number(acrTxt))) {
            nota.textContent = 'Rellena la calculadora de arriba para ver dónde cae el paciente.';
            return;
        }
        const fge = ckdEpi2021(cr, edad, campo('erc-sexo').value);
        const g = categoriaG(fge), a = categoriaA(Number(acrTxt));
        cuerpo.querySelector(`[data-celda="${g}${a}"]`).classList.add('on');
        nota.innerHTML = `Paciente de la calculadora: FGe ${fge.toFixed(0)} → <strong>${g}${a}</strong>, ${RIESGO_TEXTO[MAPA_RIESGO[g][a]]}.`;
    };
    ['erc-cr', 'erc-edad', 'erc-sexo', 'erc-acr'].forEach(id => ['input', 'change'].forEach(ev => campo(id).addEventListener(ev, marcar)));
    cuerpo.querySelector('.visual-link').addEventListener('click', () => irAlTexto(tab, texto.querySelectorAll('table')[1]));
    marcar();
}

export function initVisualErc() {
    montarVisual('erc-definicion', {
        guia: 'La ERC se clasifica en dos ejes, FG y albuminuria; juntos dan el riesgo.',
        paneles: [
            { tipo: 'calculadora', titulo: 'FGe (CKD-EPI 2021) y categoría CGA (calculadora de la ficha)',
              campos: ['#erc-cr', '#erc-edad', '#erc-sexo', '#erc-acr'], resultado: ['#erc-cga-resultado'] },
            { tipo: 'propio', titulo: 'Mapa de calor de riesgo (G × A)', nota: 'El mismo mapa que usa la calculadora: la celda marcada es la del paciente.', render: mapaCalor },
            { tipo: 'matriz', titulo: 'Complicaciones según el FG', nota: 'Tabla de la ficha, dibujada (sin la fila de vitamina D, que agrupa los tramos de otra forma).',
              tabla: 3, calor: true, excluir: ['Déficit de 25'], leyenda: ['color tenue = menos frecuente', 'color intenso = más frecuente'] },
            { tipo: 'racimos', titulo: 'Causas', grupos: [
                { titulo: 'Causas de ERC', color: 'rojo', nodos: ['Nefropatía diabética', 'Enfermedad vascular', 'Glomerulonefritis', 'Enfermedades quísticas', 'Uropatía obstructiva'] },
                { titulo: 'Factores de riesgo para el cribado (tabla)', color: 'amarillo', tabla: 4 }
            ] }
        ]
    });

    montarVisual('erc-evaluacion', {
        guia: 'Cómo medir el FG, cómo medir la albuminuria y cuándo ir más allá.',
        paneles: [
            { tipo: 'escalera', titulo: 'Del FG estimado al medido', nodos: [
                { fuente: 'Ecuación recomendada de primera línea', etiqueta: 'eGFRcr (CKD-EPI 2021)', color: 'verde' },
                { fuente: 'Cuándo usar cistatina C', etiqueta: 'Confirmar con cistatina C', color: 'amarillo' },
                { fuente: 'Medida directa de FG', etiqueta: 'FG medido (mGFR)', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Qué altera creatinina y cistatina sin cambiar el FG (tabla)', tabla: 1, color: 'purpura' },
            { tipo: 'flujo', titulo: 'Albuminuria', nodos: [
                { fuente: 'Prueba recomendada', color: 'dorado' },
                { fuente: 'Cuándo repetir', color: 'amarillo' },
                { fuente: 'Dispositivos point-of-care', color: 'gris' }
            ] },
            { tipo: 'racimos', titulo: 'Buscar la causa', grupos: [
                { titulo: 'Biopsia', color: 'rojo', nodos: ['Indicación', 'Seguridad'] },
                { titulo: 'Genética', color: 'purpura', nodos: [{ fuente: 'Relevancia', etiqueta: 'Estudio genético' }] }
            ] }
        ]
    });

    montarVisual('erc-riesgo', {
        guia: 'Del riesgo de fallo renal a la acción, y cada cuánto controlar.',
        paneles: [
            { tipo: 'escalera', titulo: 'Riesgo de fallo renal (KFRE) → acción', tabla: 0 },
            { tipo: 'matriz', titulo: 'Controles de FGe y ACR al año (G × A)', tabla: 1, calor: true, leyenda: ['color tenue = menos controles', 'color intenso = más controles'] },
            { tipo: 'racimos', titulo: 'Herramientas', grupos: [
                { titulo: 'Fallo renal', color: 'rojo', nodos: [{ fuente: 'Qué es', etiqueta: 'KFRE' }, 'Versión de 4 variables', 'Versión de 8 variables', 'Otras ecuaciones validadas'] },
                { titulo: 'Por enfermedad', color: 'purpura', nodos: ['Nefropatía IgA', 'Poliquistosis renal'] },
                { titulo: 'Cardiovascular', color: 'dorado', nodos: ['Herramientas validadas en ERC', 'Por qué importa'] }
            ] }
        ]
    });

    montarVisual('erc-estilo-vida', {
        guia: 'Lo que el paciente puede cambiar, con su efecto sobre la PA cuando la ficha lo cuantifica.',
        paneles: [
            { tipo: 'racimos', titulo: 'Estilo de vida', grupos: [
                { titulo: 'Ejercicio', color: 'verde', nodos: [{ fuente: 'Recomendación', etiqueta: 'Actividad física' }, { fuente: 'Efecto cuantificado sobre la PA', etiqueta: 'Efecto sobre la PA' }] },
                { titulo: 'Peso y tabaco', color: 'amarillo', nodos: ['Peso', { fuente: 'Efecto cuantificado sobre la PA', tras: 'Peso', etiqueta: 'Efecto sobre la PA' }, 'Tabaco'] },
                { titulo: 'Sodio', color: 'rojo', nodos: [{ fuente: 'Recomendación', tras: 'Tabaco', etiqueta: '<2 g/día' }, { fuente: 'Beneficio', tras: 'Tabaco' }, { fuente: 'Efecto cuantificado sobre la PA', tras: 'Beneficio', etiqueta: 'Efecto sobre la PA' }] },
                { titulo: 'Dieta', color: 'dorado', nodos: ['Patrón recomendado', 'Foco en ultraprocesados', 'Potasio en la dieta', { fuente: 'Recomendación', tras: 'Potasio en la dieta', etiqueta: 'Alcohol' }] }
            ] },
            { tipo: 'racimos', titulo: 'Proteínas según la situación (tabla)', tabla: 0, color: 'purpura' }
        ]
    });

    montarVisual('erc-pa-raas', {
        guia: 'Objetivo de PA, cuándo bloquear el SRAA y qué hacer tras empezar.',
        paneles: [
            { tipo: 'racimos', titulo: 'Objetivo de PA', grupos: [
                { titulo: 'Objetivo', color: 'dorado', nodos: ['Recomendación principal', 'Por qué "medida estandarizada"'] },
                { titulo: 'Excepciones (tabla)', color: 'amarillo', tabla: 0 }
            ] },
            { tipo: 'racimos', titulo: 'IECA o ARA II: fuerza de la recomendación (tabla)', tabla: 1, color: 'verde' },
            { tipo: 'flujo', titulo: 'Tras iniciar o subir el bloqueo', nodos: [
                [{ fuente: 'Rama 1', etiqueta: 'Normopotasemia y FGe −<30%: subir dosis', color: 'verde' },
                 { fuente: 'Rama 2', etiqueta: 'Hiperpotasemia', color: 'amarillo' },
                 { fuente: 'Rama 3', etiqueta: 'FGe −≥30%: buscar causa', color: 'rojo' }]
            ] },
            { tipo: 'racimos', titulo: 'No retirar sin motivo', grupos: [
                { titulo: 'Discontinuación', color: 'purpura', nodos: ['No se recomienda', 'Ensayo STOP-ACEi', 'Diálisis', 'Por qué no combinar IECA + ARA II'] }
            ] }
        ]
    });

    montarVisual('erc-nefroproteccion', {
        guia: 'Los cuatro fármacos que protegen el riñón y a quién se dan.',
        paneles: [
            { tipo: 'racimos', titulo: 'Las 4 clases (tabla resumen)', tabla: 2, color: 'verde' },
            { tipo: 'racimos', titulo: 'iSGLT2', grupos: [
                { titulo: 'A quién (tabla)', color: 'dorado', tabla: 0 },
                { titulo: 'Por qué y cómo', color: 'verde', nodos: ['Mecanismo de nefroprotección', 'Magnitud del beneficio', 'No aumentan el riesgo de hiperpotasemia', 'Continuidad del tratamiento'] },
                { titulo: 'Precauciones (tabla)', color: 'rojo', tabla: 1 }
            ] },
            { tipo: 'racimos', titulo: 'Finerenona y GLP-1 RA', grupos: [
                { titulo: 'ns-MRA (finerenona)', color: 'purpura', nodos: [{ fuente: 'Recomendación', tras: 'Continuidad del tratamiento' }, 'Diferencia frente a los antialdosterónicos', { fuente: 'Magnitud del beneficio', tras: 'Diferencia frente a los antialdosterónicos' }, 'Monitorización de potasio con finerenona', 'Riesgo de hiperpotasemia'] },
                { titulo: 'GLP-1 RA', color: 'amarillo', nodos: [{ fuente: 'Recomendación', tras: 'Riesgo de hiperpotasemia' }, 'Beneficio en ERC'] }
            ] }
        ]
    });

    montarVisual('erc-acidosis-k', {
        guia: 'Acidosis y potasio en la ERC: qué los causa y cómo se maneja, por escalones.',
        paneles: [
            { tipo: 'flujo', titulo: 'Acidosis metabólica', nodos: [
                { fuente: 'Mecanismo', color: 'amarillo' },
                { fuente: 'Consecuencias de la acidosis no corregida', color: 'rojo' },
                { fuente: 'Recomendación', color: 'verde' }
            ] },
            { tipo: 'escalera', titulo: 'Hiperpotasemia: manejo escalonado', nodos: [
                { fuente: '1ª línea', color: 'verde' }, { fuente: '2ª línea', color: 'amarillo' }, { fuente: '3ª línea', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Fármacos que suben el potasio (tabla)', tabla: 1, color: 'rojo' },
            { tipo: 'barras', titulo: 'Cuánto potasio se absorbe según el alimento', nota: 'Tabla de la ficha: barra = límite inferior del rango.',
              tabla: 3, series: [{ col: 1, nombre: 'Absorción', color: 'amarillo' }] },
            { tipo: 'racimos', titulo: 'Gravedad y captores', grupos: [
                { titulo: 'Conducta (tabla)', color: 'purpura', tabla: 2 },
                { titulo: 'Captores', color: 'dorado', nodos: ['Agentes captadores de potasio'] }
            ] }
        ]
    });

    montarVisual('erc-mbd-urico', {
        guia: 'Mineral-óseo, anemia y ácido úrico: los objetivos y los primeros pasos.',
        paneles: [
            { tipo: 'racimos', titulo: 'Valores objetivo del metabolismo mineral (tabla S.E.N.)', tabla: 0, color: 'dorado' },
            { tipo: 'flujo', titulo: 'Anemia de la ERC', nodos: [
                { fuente: 'Periodicidad de la determinación', color: 'gris' },
                { fuente: 'Estudio inicial de la anemia en ERC', color: 'amarillo' },
                { fuente: 'Primer paso: hierro antes que ESA', color: 'verde' },
                { fuente: 'Umbral e objetivo de los ESA', color: 'rojo' }
            ] },
            { tipo: 'comparar', titulo: 'Ácido úrico', columnas: [
                { titulo: 'Tratar', color: 'verde', nodos: ['Umbral práctico de inicio', 'Fármaco de elección', 'Tratamiento del brote agudo de gota'] },
                { titulo: 'No tratar / precaución', color: 'rojo', nodos: [{ fuente: 'Evidencia que sustenta no tratar', etiqueta: 'Hiperuricemia asintomática' }, { fuente: 'Señal de seguridad', etiqueta: 'CARES (febuxostat)' }, 'Precaución con alopurinol'] }
            ] }
        ]
    });

    montarVisual('erc-cv', {
        guia: 'Estatinas, AAS, cardiopatía isquémica y FA en la persona con ERC.',
        paneles: [
            { tipo: 'racimos', titulo: 'Estatinas según edad y FGe (tabla)', tabla: 0, color: 'dorado' },
            { tipo: 'comparar', titulo: 'AAS', columnas: [
                { titulo: 'Prevención secundaria', color: 'verde', nodos: ['Prevención secundaria', 'Gastroprotección'] },
                { titulo: 'Prevención primaria', color: 'gris', nodos: ['Prevención primaria'] }
            ] },
            { tipo: 'racimos', titulo: 'Cardiopatía isquémica y FA', grupos: [
                { titulo: 'Isquemia estable', color: 'rojo', nodos: [{ fuente: 'Recomendación', etiqueta: 'Médico frente a invasivo' }, 'Excepciones'] },
                { titulo: 'Fibrilación auricular', color: 'purpura', nodos: ['Prevalencia en ERC', 'Por qué NOAC', 'Ajuste de dosis por FG', 'Uso del CHA₂DS₂-VASc en ERC', 'Escala HAS-BLED', 'Estrategia diagnóstica en 3 pasos'] }
            ] }
        ]
    });

    montarVisual('erc-farmacos', {
        guia: 'Qué evitar, cómo ajustar, qué suspender en un día malo y cómo protegerse del contraste.',
        paneles: [
            { tipo: 'puntos', titulo: 'Riesgo de Mehran (calculadora de la ficha)', items: [
                { checks: '#mehran-hipotension', pts: 5 }, { checks: '#mehran-iabp', pts: 5 }, { checks: '#mehran-icc', pts: 5 },
                { checks: '#mehran-edad', pts: 4 }, { checks: '#mehran-anemia', pts: 3 }, { checks: '#mehran-dm', pts: 3 },
                { control: '#mehran-volumen', etiqueta: 'Contraste (1 punto/100 cc)', unidad: 'cc', tramos: [
                    { label: '<100', min: 0, max: 99, pts: 0 }, { label: '100-199', min: 100, max: 199, pts: 1 },
                    { label: '200-299', min: 200, max: 299, pts: 2 }, { label: '300-399', min: 300, max: 399, pts: 3 }, { label: '≥400', min: 400, max: 1e6, pts: '4+' }] },
                { control: '#mehran-renal', etiqueta: 'Función renal' }
            ], resultado: ['#mehran-resultado'] },
            { tipo: 'racimos', titulo: 'Nefrotóxicos y su alternativa (tabla)', tabla: 0, color: 'rojo' },
            { tipo: 'racimos', titulo: 'Ajuste y revisión', grupos: [
                { titulo: 'Dosis según el FG', color: 'dorado', nodos: ['Principio general', 'Cuándo usar mayor precisión', 'FGe no indexado', 'Situación clínica inestable'] },
                { titulo: 'Revisión', color: 'verde', nodos: [{ fuente: 'Qué es', etiqueta: 'Cascada de prescripción' }, 'Cuándo hacerla', 'Pasos clave del proceso'] },
                { titulo: 'Día de enfermedad', color: 'amarillo', nodos: ['Acrónimo SADMANS', 'El problema más frecuente'] }
            ] },
            { tipo: 'racimos', titulo: 'Suspender antes de cirugía (tabla)', tabla: 1, color: 'purpura' }
        ]
    });

    montarVisual('erc-atencion', {
        guia: 'Cuándo derivar, quién atiende según el riesgo y cuándo empezar la diálisis.',
        paneles: [
            { tipo: 'racimos', titulo: 'Criterios de derivación (tabla)', tabla: 0, color: 'rojo' },
            { tipo: 'escalera', titulo: 'Atención escalonada por riesgo', tabla: 2 },
            { tipo: 'racimos', titulo: 'Síntomas más frecuentes', grupos: [
                { titulo: 'Prevalencia', color: 'amarillo', nodos: ['Fatiga — 70%', 'Disnea — 42%'] },
                { titulo: 'Manejo', color: 'verde', nodos: ['Manejo de síntomas comunes', 'Malnutrición'] }
            ] },
            { tipo: 'flujo', titulo: 'Inicio de la diálisis', nodos: [
                { fuente: 'Principio general', color: 'dorado' },
                { fuente: 'Rango habitual de FG', color: 'amarillo' },
                { fuente: 'Evidencia sobre inicio precoz', etiqueta: 'Ensayo IDEAL', color: 'gris' },
                [{ fuente: 'Planificación de acceso', color: 'verde' }, { fuente: 'Manejo conservador integral', color: 'purpura' }]
            ] }
        ]
    });

    montarVisual('erc-tratamiento-objetivos', {
        guia: 'Una analítica delante: qué está fuera de objetivo y los once objetivos de la ERC.',
        paneles: [
            { tipo: 'calculadora', titulo: 'Panel analítico de la visita (calculadora de la ficha)',
              campos: ['#erc-panel-acr', '#erc-panel-k', '#erc-panel-hco3', '#erc-panel-hb', '#erc-panel-sexo'], resultado: ['#erc-panel-resultado'] },
            { tipo: 'flujo', titulo: 'Los objetivos, en orden', nodos: [
                'Conocer el estadio', 'Frenar la progresión', 'Controlar el potasio', 'Corregir la acidosis', 'Vigilar el metabolismo óseo',
                'Manejar el ácido úrico', 'Reducir el riesgo cardiovascular', 'Evitar la nefrotoxicidad', 'Vigilar la anemia', 'Optimizar la nutrición', 'Planificar la derivación'
            ].map((f, k) => ({ fuente: f, etiqueta: `${k + 1}. ${f}`, color: ['dorado', 'verde', 'rojo', 'amarillo', 'purpura'][k % 5] })) }
        ]
    });

    montarVisual('erc-unidad-erca', {
        guia: 'La unidad ERCA: elegir tratamiento con el paciente y preparar el inicio.',
        paneles: [
            { tipo: 'flujo', titulo: 'Decisión compartida en 3 fases', nodos: [
                { fuente: 'Fase de determinación de valores', color: 'dorado' },
                { fuente: 'Fase informativa', color: 'amarillo' },
                { fuente: 'Fase deliberativa', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Modalidades', grupos: [
                { titulo: 'Opciones', color: 'verde', nodos: ['Trasplante renal', 'Hemodiálisis domiciliaria', 'Diálisis peritoneal urgente', 'Hemodiálisis incremental'] },
                { titulo: 'Diálisis peritoneal (tabla)', color: 'dorado', tabla: 0 },
                { titulo: 'Tratamiento conservador (tabla)', color: 'purpura', tabla: 1 }
            ] },
            { tipo: 'racimos', titulo: 'Cuándo empezar', grupos: [
                { titulo: 'Inicio', color: 'rojo', nodos: ['Umbral independiente de síntomas', 'Inicio urgente'] },
                { titulo: 'Preparación', color: 'amarillo', nodos: ['Preservación de la red venosa', 'Estructura de la valoración psicológica', 'Herramienta validada', 'El modelo ACERCA'] }
            ] }
        ]
    });
}
