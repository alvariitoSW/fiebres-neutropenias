// Banco de repaso — PIF Cardiología · «ECG y arritmias», fichas 1 y 2 (introducción y frecuencia).
// Fuente: López Ramírez JH. La alegría de leer el electrocardiograma, 3.ª ed. Celsus; 2012, caps. 1-2.
export const temasPifEcgA = [
    { key: 'ecg-intro', etiqueta: '1 · Introducción y método' },
    { key: 'ecg-frecuencia', etiqueta: '2 · Frecuencia' },
];

export const preguntasPifEcgA = [
    {
        id: 'pif-ecg-a-q001', tema: 'ecg-intro',
        enunciado: 'En un trazado normal, ¿qué registra el complejo QRS?',
        opciones: ['La despolarización de los ventrículos', 'La despolarización de las aurículas', 'La repolarización de los ventrículos', 'La repolarización de las fibras de His-Purkinje'],
        correcta: 0,
        explicacion: 'El QRS es la despolarización ventricular; la P es la auricular, la T la repolarización ventricular y la U (ocasional) la de His-Purkinje. López Ramírez, pp. 2-3.',
    },
    {
        id: 'pif-ecg-a-q002', tema: 'ecg-intro',
        enunciado: 'A 25 mm/s, ¿cuánto dura un cuadro pequeño de 1 mm de largo y cuánto vale 1 mm de altura?',
        opciones: ['0,04 s de largo y 0,1 mV de alto', '0,2 s de largo y 0,1 mV de alto', '0,04 s de largo y 1 mV de alto', '0,1 s de largo y 0,04 mV de alto'],
        correcta: 0,
        explicacion: '1 mm de largo son 0,04 s; la línea gruesa cada 5 mm marca 0,2 s. En altura, 1 mm equivale a 0,1 mV. Confundirlo desplaza todos los intervalos que se midan después. López Ramírez, pp. 3-4.',
    },
    {
        id: 'pif-ecg-a-q003', tema: 'ecg-intro',
        enunciado: 'Un residente lee un ECG saltándose pasos y solo mira «lo que llama la atención». ¿Qué orden propone el libro para no pasar por alto detalles simples?',
        opciones: ['Frecuencia, ritmo, eje, hipertrofias, isquemia, infarto, intervalos', 'Ritmo, frecuencia, intervalos, eje, infarto, isquemia, hipertrofias', 'Intervalos, eje, frecuencia, ritmo, hipertrofias, isquemia, infarto', 'Isquemia, infarto, ritmo, frecuencia, eje, hipertrofias, intervalos'],
        correcta: 0,
        explicacion: 'Es la nemotecnia FREHIII. El autor insiste en seguirla siempre, incluso siendo cardiólogo. López Ramírez, p. 5.',
    },
    {
        id: 'pif-ecg-a-q004', tema: 'ecg-intro',
        enunciado: '¿Cómo es normalmente la onda P en la derivación AVR?',
        opciones: ['Negativa', 'Positiva', 'Isobifásica', 'Ausente en el adulto sano'],
        correcta: 0,
        explicacion: 'La P es positiva en casi todas las derivaciones, siempre negativa en AVR e isobifásica en V1. Una P positiva en AVR sugeriría electrodos mal puestos o un origen no sinusal. López Ramírez, p. 3.',
    },
    {
        id: 'pif-ecg-a-q005', tema: 'ecg-intro',
        enunciado: 'Un paciente con palpitaciones intermitentes tiene un ECG normal hecho entre los episodios. ¿Qué conclusión recoge el libro?',
        opciones: ['No se descarta una taquiarritmia paroxística: el ECG nunca se usa aislado de la clínica', 'Se descarta la arritmia porque el ECG es normal', 'Se repite el ECG en un año', 'Se atribuye a ansiedad sin más estudio'],
        correcta: 0,
        explicacion: 'Las taquiarritmias paroxísticas pueden dar un trazo normal fuera del episodio; el ECG se correlaciona siempre con la clínica. López Ramírez, p. 1.',
    },
    {
        id: 'pif-ecg-a-q006', tema: 'ecg-frecuencia',
        enunciado: '¿Cuál es la frecuencia cardíaca normal del adulto según el libro?',
        opciones: ['60-99 latidos por minuto', '50-80 latidos por minuto', '60-100 latidos por minuto en ancianos, hasta 120 en jóvenes', '70-110 latidos por minuto'],
        correcta: 0,
        explicacion: 'Bradicardia ≤59 y taquicardia ≥100; en ancianos hay una ligera tendencia a bajar y se considera normal hasta 90. López Ramírez, p. 7.',
    },
    {
        id: 'pif-ecg-a-q007', tema: 'ecg-frecuencia',
        enunciado: 'Una R cae sobre una línea gruesa y la siguiente R cae en la tercera línea gruesa posterior. ¿Qué frecuencia tiene?',
        opciones: ['100 lpm', '150 lpm', '75 lpm', '300 lpm'],
        correcta: 0,
        explicacion: 'Las líneas gruesas siguientes dan 300, 150, 100, 75, 60 y 50. Tercera línea = 100. López Ramírez, pp. 7-8.',
    },
    {
        id: 'pif-ecg-a-q008', tema: 'ecg-frecuencia',
        enunciado: 'Entre dos R hay 14 mm. ¿Qué frecuencia da el método 1500/mm?',
        opciones: ['Unos 107 lpm', 'Unos 150 lpm', 'Unos 75 lpm', 'Unos 210 lpm'],
        correcta: 0,
        explicacion: '1500/14 = 107. El método de las líneas gruesas habría dado 110. López Ramírez, p. 10.',
    },
    {
        id: 'pif-ecg-a-q009', tema: 'ecg-frecuencia',
        enunciado: '¿En qué situaciones el libro desaconseja el método de las líneas gruesas (300-150-100-75-60-50)?',
        opciones: ['Ritmo muy irregular, como la FA, y frecuencias por encima de 150', 'Solo en bradicardias', 'Solo en pacientes ancianos', 'Cuando el papel va a 50 mm/s y el ritmo es regular'],
        correcta: 0,
        explicacion: 'El método no sirve con ritmo muy irregular ni con FC > 150; ahí hay que contar en el margen superior del papel o dividir 1500 entre los mm RR. López Ramírez, p. 10.',
    },
    {
        id: 'pif-ecg-a-q010', tema: 'ecg-frecuencia',
        enunciado: 'En una fibrilación auricular hay 16 QRS en 5 segundos. ¿Qué frecuencia ventricular aproximada tiene?',
        opciones: ['192 lpm (16 × 12)', '80 lpm (16 × 5)', '96 lpm (16 × 6)', '160 lpm (16 × 10)'],
        correcta: 0,
        explicacion: 'Con el margen superior del papel, los QRS de 5 s se multiplican por 12 (o los de 6 s por 10). Es muy inexacto y se reserva para la FA. López Ramírez, pp. 10-11.',
    },
    {
        id: 'pif-ecg-a-q011', tema: 'ecg-frecuencia',
        enunciado: 'La segunda R cae a 3 mm de la línea gruesa de 100 en dirección a la de 75. ¿Qué frecuencia estima el método de las líneas gruesas?',
        opciones: ['85 lpm', '90 lpm', '80 lpm', '95 lpm'],
        correcta: 0,
        explicacion: 'Entre 100 y 75 hay 25 latidos en 5 mm, 5 lpm por mm: 100-95-90-85. López Ramírez, p. 8.',
    },
];
