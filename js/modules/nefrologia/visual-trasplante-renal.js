// Vista Visual de Trasplante renal y enfermedades glomerulares
// (Nefrología): recetas para core/visual-kit.js a partir de los PNT del
// Servicio ya resumidos en cada ficha.
import { montarVisual } from '../../core/visual-kit.js';

export function initVisualTrasplanteRenal() {
    montarVisual('tr-timoglobulina', {
        guia: 'Cuándo se usa, cómo se prepara al paciente y qué profilaxis necesita.',
        paneles: [
            { tipo: 'escalera', titulo: 'Rechazo celular (Banff 2017)', tabla: 0 },
            { tipo: 'flujo', titulo: 'Indicaciones', nodos: [
                [{ fuente: 'Inducción con TMG', color: 'dorado' }, { fuente: 'Rechazo agudo leve', color: 'amarillo' }]
            ] },
            { tipo: 'flujo', titulo: 'Administración', nodos: [
                { fuente: 'Preparación', color: 'gris' },
                { fuente: '1ª y 2ª dosis, 1h antes', etiqueta: 'Premedicación', color: 'amarillo' }
            ] },
            { tipo: 'escalera', titulo: 'Valganciclovir según el FG', nota: 'Tabla de la ficha: a menos filtrado, menos dosis.', nodos: [
                { fuente: '≥60 ml/min', color: 'verde' }, { fuente: '40-59 ml/min', color: 'amarillo' },
                { fuente: '25-39 ml/min', color: 'rojo' }, { fuente: '10-24 ml/min', color: 'purpura' }
            ] }
        ]
    });

    montarVisual('tr-cdifficile', {
        guia: 'Gravedad, tratamiento por escenario y recurrencias.',
        paneles: [
            { tipo: 'escalera', titulo: 'Gravedad', tabla: 1 },
            { tipo: 'racimos', titulo: 'Antibióticos según su asociación (tabla)', tabla: 0, color: 'rojo' },
            { tipo: 'flujo', titulo: 'Tratamiento por escenario', nodos: [
                { fuente: 'ICD no grave', color: 'verde' },
                { fuente: 'ICD grave o potencialmente grave', color: 'amarillo' },
                [{ fuente: 'Íleo o intolerancia a vía oral', color: 'rojo' }, { fuente: 'Formas graves complicadas', tras: 'Íleo o intolerancia a vía oral', color: 'purpura' }]
            ] },
            { tipo: 'flujo', titulo: 'Si vuelve', nodos: [
                { fuente: 'Cepas BI/NAP1/027', color: 'gris' },
                { fuente: 'Primera recurrencia', color: 'amarillo' },
                { fuente: 'Segunda recurrencia', color: 'rojo' }
            ] }
        ]
    });

    montarVisual('tr-ciclofosfamida', {
        guia: 'Dosis ajustada por edad y riñón, y lo que siempre la acompaña.',
        paneles: [
            { tipo: 'racimos', titulo: 'Dosis', grupos: [
                { titulo: 'Base', color: 'dorado', nodos: [{ fuente: 'Dosis', tras: 'Dosis y ajuste' }] },
                { titulo: 'Ajuste por edad y función renal (tabla)', color: 'amarillo', tabla: 0 }
            ] },
            { tipo: 'racimos', titulo: 'Acompañamiento y riesgos', grupos: [
                { titulo: 'Obligatorio', color: 'verde', nodos: ['Hidratación'] },
                { titulo: 'Efectos secundarios', color: 'rojo', nodos: ['Cistitis hemorrágica', 'Tumores a largo plazo', 'Náuseas y vómitos'] }
            ] }
        ]
    });

    montarVisual('tr-rituximab', {
        guia: 'Indicaciones, cómo se infunde y qué vigilar.',
        paneles: [
            { tipo: 'flujo', titulo: 'Antes y durante', nodos: [
                { fuente: 'Analítica', color: 'gris' },
                { fuente: 'Premedicación (45 min antes)', color: 'amarillo' },
                { fuente: 'Comenzar a 50 mg/h', etiqueta: 'Subida escalonada de la velocidad', color: 'dorado' },
                { fuente: 'Si reacción', etiqueta: 'Si hay reacción', color: 'rojo' }
            ] },
            { tipo: 'mapa', titulo: 'Efectos secundarios (>10%)', nodos: [
                { fuente: 'SNC', organo: 'cabeza' }, { fuente: 'Respiratorio', organo: 'pulmonDcho' },
                { fuente: 'Cardiovascular', organo: 'corazon' }, { fuente: 'Hepático', organo: 'higado' },
                { fuente: 'Gastrointestinal', organo: 'intestino' }, { fuente: 'Dermatológico', organo: 'piel' },
                { fuente: 'Hematológico', organo: 'medula' }
            ] }
        ]
    });

    montarVisual('tr-multirresistentes', {
        guia: 'Qué antibióticos quedan para cada germen y cómo aislarlo.',
        paneles: [
            { tipo: 'racimos', titulo: 'Familias activas por patógeno (tabla 1)', tabla: 0, color: 'verde' },
            { tipo: 'matriz', titulo: 'Control de la infección por patógeno (tabla 2)', tabla: 1,
              normales: ['no recomendado', 'no recomendada'], leyenda: ['no recomendado', 'recomendado o condicionado'] },
            { tipo: 'racimos', titulo: 'Antibióticos de 2ª y 3ª línea (tabla 3)', tabla: 2, color: 'purpura' },
            { tipo: 'racimos', titulo: 'Difíciles de tratar', grupos: [
                { titulo: 'Infecciones', color: 'rojo', nodos: ['Infección urinaria recurrente', 'Quistes infectados', 'Infección intraabdominal y abscesos'] },
                { titulo: 'Problemas añadidos', color: 'amarillo', nodos: ['Heterorresistencia', 'Características de la cirugía'] }
            ] }
        ]
    });
}
