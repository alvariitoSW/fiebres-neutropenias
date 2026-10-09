// Los textos pueden llevar <strong> (contenido de confianza, escrito aquí).
// Tratamiento empírico SIN foco clínico (ECIL-10, 2025): única fuente de
// verdad de los escalones. La recomendación de la vista Texto
// (calcTxEmpirico en tratamiento-empirico.js) y la escalera de la vista
// Visual (empirico-escalera.js) leen de aquí.

// Orden de la escalera, de abajo arriba. `checkbox` es la casilla de la
// vista Texto que activa el escalón (el de riesgo bajo es "ninguna").
export const escalonesSinFoco = [
    {
        id: 'bajo', checkbox: null, color: 'var(--accent-green)', grado: 'A-I', gradoClase: '',
        titulo: '▲ Riesgo bajo', corto: 'Riesgo bajo',
        contexto: 'baja prevalencia local, sin colonización/infección previa por BGN resistentes, estable',
        regimen: 'Monoterapia ahorradora de carbapenems: Piperacilina-tazobactam, Cefepime, Ceftazidima o Cefoperazona-sulbactam.'
    },
    {
        id: 'mdr', checkbox: 'tx-mdr', color: 'var(--accent-yellow)', grado: 'A-IIu', gradoClase: '',
        titulo: '▼ Riesgo alto', corto: 'BLEE',
        contexto: 'BLEE u otros BGN resistentes a 1ª línea, sensibles a carbapenems',
        regimen: 'Carbapenem en monoterapia.'
    },
    {
        id: 'inestable', checkbox: 'tx-inestable', color: 'var(--accent-red)', grado: 'A-IIu', gradoClase: 'red',
        titulo: '🚨 Paciente crítico', corto: 'Crítico',
        contexto: 'inestabilidad hemodinámica, sepsis, shock séptico o neumonía',
        regimen: 'Carbapenem ± inhibidor de betalactamasa, o betalactámico antipseudomónico + aminoglucósido en combinación (mantenerla hasta descartar bacteriemia).'
    },
    {
        id: 'cr', checkbox: 'tx-cr', color: 'var(--accent-purple)', grado: null, gradoClase: '',
        titulo: 'Colonización/infección previa por BGN resistente a carbapenems (sin inestabilidad):', corto: 'Resistente a carbapenem',
        contexto: 'colonización o infección previa por BGN resistente a carbapenems',
        regimen: 'Consulta la <strong>Matriz de Combate MDR</strong> (T. Dirigido) — el fármaco depende del tipo de carbapenemasa (KPC/OXA-48/MBL), P. aeruginosa XDR, A. baumannii o S. maltophilia.'
    }
];

// Prioridad real de la recomendación: crítico manda sobre todo; después
// resistencia a carbapenems; después BLEE; si no, riesgo bajo.
export const PRIORIDAD_SIN_FOCO = ['inestable', 'cr', 'mdr', 'bajo'];

// Añadido cuando el paciente crítico tiene además resistencia a carbapenems.
export const notaCriticoConCr = 'Colonización/infección previa por BGN resistente a carbapenems: consulta la <strong>Matriz de Combate MDR</strong> (T. Dirigido) para elegir fármaco dirigido por tipo de resistencia.';

// Barandilla SARM: se suma a cualquier escalón; grado según estabilidad.
export const sarmSinFoco = {
    inestable: { grado: 'A-IIt', titulo: 'Colonización SARM + inestabilidad/neumonía:', texto: 'añadir daptomicina (nunca si sospecha respiratoria) o vancomicina.' },
    estable: { grado: 'B-IIrt', titulo: 'Colonización SARM, estable:', texto: 'considerar añadir daptomicina o vancomicina.' }
};

export const notaGramPositivoSinFoco = 'Añadir cobertura anti-Gram+ también si hay sospecha de infección de catéter o piel/partes blandas (B-III), o sepsis/shock/neumonía independientemente de la colonización (C-III). Si se usa ceftazidima ± avibactam o cefiderocol (poca actividad Gram+) con mucositis grave, considerar cobertura antiestreptocócica (C-III). Fuera de estos casos, no añadir cobertura anti-Gram+ de rutina (D-IIru), y la fiebre persistente aislada, con paciente estable, no es motivo para escalar antibióticos.';
