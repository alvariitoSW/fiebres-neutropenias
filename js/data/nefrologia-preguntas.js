// Banco de preguntas de repaso (quiz tipo Anki) de Nefrología. Cada
// pregunta: id estable (clave de localStorage), tema (misma clave que las
// categorías de nefrona-data.js, para poder filtrar por tema más adelante
// sin migrar el banco), enunciado, 4 opciones, índice de la correcta y
// explicación breve. Primer lote: solo diuréticos de asa (única categoría
// real por ahora) — se amplía según se añadan más categorías.
export const preguntasNefrologia = [
    {
        id: 'nefro-q001',
        tema: 'diureticos-asa',
        enunciado: '¿Sobre qué transportador actúa la furosemida?',
        opciones: ['NCC', 'NKCC2', 'ENaC', 'SGLT2'],
        correcta: 1,
        explicacion: 'La furosemida inhibe el cotransportador Na⁺/K⁺/2Cl⁻ (NKCC2) en la rama ascendente gruesa del asa de Henle.',
    },
    {
        id: 'nefro-q002',
        tema: 'diureticos-asa',
        enunciado: '¿Por qué los diuréticos de asa son los más potentes disponibles?',
        opciones: [
            'Porque actúan sobre el túbulo proximal, donde se reabsorbe más Na⁺',
            'Porque además de natriuréticos son ahorradores de K⁺',
            'Porque impiden generar el gradiente osmótico medular necesario para concentrar la orina',
            'Porque se administran siempre por vía intravenosa',
        ],
        correcta: 2,
        explicacion: 'Al bloquear NKCC2 en la rama ascendente gruesa, impiden la generación del gradiente hipertónico medular del que depende la capacidad de concentrar la orina, permitiendo excretar hasta un 20-25% del Na⁺ filtrado.',
    },
    {
        id: 'nefro-q003',
        tema: 'diureticos-asa',
        enunciado: '¿Cuál es la equivalencia aproximada de potencia entre bumetanida y furosemida?',
        opciones: ['1 mg bumetanida ≈ 4 mg furosemida', '1 mg bumetanida ≈ 40 mg furosemida', '1 mg bumetanida ≈ 400 mg furosemida', 'Son equipotentes mg a mg'],
        correcta: 1,
        explicacion: 'La bumetanida es aproximadamente 40 veces más potente en mg que la furosemida (1 mg ≈ 40 mg de furosemida).',
    },
    {
        id: 'nefro-q004',
        tema: 'diureticos-asa',
        enunciado: '¿Qué ventaja farmacocinética tiene la torasemida frente a la furosemida?',
        opciones: [
            'Mayor y más predecible biodisponibilidad oral',
            'No produce hipopotasemia',
            'No requiere ajuste en insuficiencia renal',
            'Actúa sobre NCC en vez de NKCC2',
        ],
        correcta: 0,
        explicacion: 'La torasemida tiene una biodisponibilidad oral más alta y predecible (~80-90%) que la furosemida, con semivida más larga.',
    },
    {
        id: 'nefro-q005',
        tema: 'diureticos-asa',
        enunciado: '¿Qué mecanismo explica la resistencia a diuréticos de asa en uso crónico?',
        opciones: [
            'Down-regulation de NKCC2 en el propio asa de Henle',
            'Hipertrofia adaptativa del túbulo distal que reabsorbe más Na⁺ ("frenado por freno")',
            'Aumento de la secreción de aldosterona exclusivamente',
            'Pérdida de la barrera de filtración glomerular',
        ],
        correcta: 1,
        explicacion: 'El túbulo distal desarrolla hipertrofia adaptativa que aumenta su capacidad de reabsorber el Na⁺ no reabsorbido en el asa, reduciendo la eficacia del diurético con el tiempo.',
    },
    {
        id: 'nefro-q006',
        tema: 'diureticos-asa',
        enunciado: '¿Cuál de estas es una estrategia válida frente a la resistencia a diuréticos de asa?',
        opciones: [
            'Cambiar a un inhibidor de la anhidrasa carbónica en monoterapia',
            'Bloqueo secuencial de la nefrona combinando con una tiazida',
            'Reducir la dosis para evitar la hipertrofia del túbulo distal',
            'Sustituir por un antagonista de mineralocorticoides en monoterapia',
        ],
        correcta: 1,
        explicacion: 'El bloqueo secuencial de la nefrona (p. ej. tiazida + diurético de asa) potencia el efecto natriurético al actuar sobre dos segmentos distintos.',
    },
    {
        id: 'nefro-q007',
        tema: 'diureticos-asa',
        enunciado: '¿Cuál NO es un efecto adverso típico de los diuréticos de asa?',
        opciones: ['Hipopotasemia', 'Alcalosis metabólica hipoclorémica', 'Hiperpotasemia', 'Ototoxicidad a dosis altas'],
        correcta: 2,
        explicacion: 'Los diuréticos de asa producen hipopotasemia (no hiperpotasemia), junto con hiponatremia, hipomagnesemia, hipocalcemia, alcalosis metabólica hipoclorémica y ototoxicidad a dosis altas.',
    },
    {
        id: 'nefro-q008',
        tema: 'diureticos-asa',
        enunciado: 'En sobrecarga de volumen con congestión intestinal, ¿por qué se prefiere la furosemida IV a la oral?',
        opciones: [
            'Porque la furosemida oral está contraindicada en insuficiencia cardiaca',
            'Porque la biodisponibilidad oral es variable y menor en congestión intestinal',
            'Porque la vía IV tiene menor riesgo de ototoxicidad',
            'Porque la vía oral solo está indicada en hipercalcemia',
        ],
        correcta: 1,
        explicacion: 'La biodisponibilidad oral de la furosemida es variable (10-90%) y disminuye en congestión intestinal, por lo que se prefiere la vía IV en descompensación aguda.',
    },
];
