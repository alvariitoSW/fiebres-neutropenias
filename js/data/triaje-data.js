// Triaje inicial de la neutropenia febril: única fuente de verdad de las
// banderas de alto riesgo. La lista de la vista Texto (triaje-mascc.js), el
// cálculo de red flags y el cuerpo de la vista Visual (triaje-cuerpo.js)
// leen de aquí. Fuente: consenso SEIMC-SEHH 2020 + criterios IDSA.

// Banderas automáticas: por sí solas definen alto riesgo.
export const triajeAutomaticas = [
    { id: 'triage-sepsis', texto: 'Sepsis Grave / Shock Séptico', corto: 'Sepsis / shock' },
    { id: 'triage-lma', texto: 'Inducción de LMA o acondicionamiento pre-TPH', corto: 'Inducción LMA / pre-TPH' }
];

// Otros criterios IDSA de alto riesgo (con cualquiera basta).
// `organo` es la zona del cuerpo donde la vista Visual coloca el marcador.
export const triajeIdsa = [
    { id: 'triage-anc', texto: 'ANC ≤100/mm³ con duración esperada ≥7 días', corto: 'ANC ≤100 y ≥7 días', organo: 'medula' },
    { id: 'triage-hemodinamica', texto: 'Inestabilidad hemodinámica', corto: 'Inestabilidad hemodinámica', organo: 'corazon' },
    { id: 'triage-mucositis', texto: 'Mucositis que impide tragar, o diarrea grave', corto: 'Mucositis que impide tragar / diarrea grave', organo: 'boca' },
    { id: 'triage-gi', texto: 'Síntomas GI significativos (dolor abdominal, náuseas/vómitos o diarrea)', corto: 'Síntomas GI significativos', organo: 'abdomen' },
    { id: 'triage-mental', texto: 'Alteración del estado mental de nueva aparición', corto: 'Alteración mental nueva', organo: 'cabeza' },
    { id: 'triage-cateter', texto: 'Infección de catéter intravascular', corto: 'Infección de catéter', organo: 'cateter' },
    { id: 'triage-pulmonar', texto: 'Infiltrados pulmonares nuevos o hipoxia', corto: 'Infiltrados / hipoxia', organo: 'pulmonDcho' },
    { id: 'triage-epoc', texto: 'EPOC subyacente', corto: 'EPOC subyacente', organo: 'pulmonIzdo' },
    { id: 'triage-hepatica', texto: 'Insuficiencia hepática (transaminasas ≥5x LSN)', corto: 'Transaminasas ≥5× LSN', organo: 'higado' },
    { id: 'triage-renal', texto: 'Insuficiencia renal (ClCr <30 ml/min)', corto: 'ClCr <30 ml/min', organo: 'rinon' }
];
