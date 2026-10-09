// Índice MASCC: única fuente de verdad de ítems y puntos.
// La lista de la vista Texto, la suma de calcMASCC() y la escalera de la
// vista Visual leen de aquí, para que las tres no puedan desincronizarse.
// Fuente: consenso SEIMC-SEHH 2020 (ver "Fuentes y Evidencia").

export const MASCC_MAX = 26;
export const MASCC_CORTE = 21; // ≥21 = bajo riesgo

// Carga clínica: único ítem con 3 niveles (select), no binario.
export const masccCarga = {
    id: 'mascc-carga',
    etiqueta: 'Carga clínica de la enfermedad',
    corto: 'Carga clínica',
    max: 5,
    opciones: [
        { pts: 5, texto: 'Sin síntomas o leves' },
        { pts: 3, texto: 'Síntomas moderados' },
        { pts: 0, texto: 'Síntomas graves' }
    ]
};

// Ítems binarios. `texto` es la etiqueta literal de la calculadora;
// `corto`/`perdido` son las etiquetas del bloque presente/ausente en la escalera.
export const masccItems = [
    { id: 'mascc-hipotension', pts: 5, texto: 'Sin hipotensión (PAS > 90)', corto: 'Sin hipotensión', perdido: 'Hipotensión' },
    { id: 'mascc-epoc', pts: 4, texto: 'Sin historia de EPOC', corto: 'Sin EPOC', perdido: 'EPOC' },
    { id: 'mascc-tumor', pts: 4, texto: 'Tumor sólido o neo hematológica sin infección fúngica previa', corto: 'Sin infección fúngica previa', perdido: 'Infección fúngica previa' },
    { id: 'mascc-deshidratacion', pts: 3, texto: 'Sin deshidratación (fluidos IV)', corto: 'Sin deshidratación', perdido: 'Deshidratación (fluidos iv)' },
    { id: 'mascc-ambulatorio', pts: 3, texto: 'Paciente ambulatorio al inicio de la fiebre', corto: 'Ambulatorio al inicio', perdido: 'Ya ingresado' },
    { id: 'mascc-edad', pts: 2, texto: 'Edad < 60 años', corto: 'Edad <60', perdido: 'Edad ≥60' }
];
