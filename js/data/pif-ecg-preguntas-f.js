// Banco de repaso — PIF Cardiología · «Predice el ECG»: de la arteria al ECG, del ECG a la arteria y a la complicación que vigilar.
// Fuentes: López Ramírez 2012 (pp. 136-143); Wagner 2009, Circulation 119:e262 (PDF pp. 4-5); ESC 2023 SCA; AHA 2021, Damluji
// (Circulation 144:e16, PMC9364424, por apartado). Cifras y frases como en js/data/sca-territorios.js.
export const temasPifEcgF = [
    { key: 'ecg-predice', etiqueta: 'Predice el ECG (arteria, pared, complicación)' },
];

export const preguntasPifEcgF = [
    {
        id: 'pif-ecg-f-q001', tema: 'ecg-predice',
        enunciado: 'Antes de mirar las opciones, piensa: un infarto por oclusión de la coronaria derecha. ¿En qué derivaciones sube el ST, en cuál más, y qué pasa en I y aVL? ¿Qué ECG esperas?',
        opciones: [
            '↑ST en V1-V4, I, aVL y a menudo aVR, con ↓ST recíproco en II, III y aVF y, a veces, en V5',
            '↑ST en II más que en III, con I y aVL isoeléctricos o con ↑ST',
            '↑ST solo en II, III y aVF, con más ↑ST en III que en II y, a menudo, ↓ST en I y aVL',
            '↑ST en V3-V6, sin ↓ST en II, III ni aVF',
        ],
        correcta: 2,
        explicacion: 'En la coronaria derecha el ↑ST queda en la cara inferior y es mayor en III que en II; I y aVL suelen mostrar el espejo (↓ST). La primera opción es la DA proximal (anterior, con espejo inferior): el paciente tendría un infarto anterior extenso. La segunda es el patrón de la circunfleja (II > III): se le atribuiría la arteria equivocada. La cuarta es la DA distal: no explicaría la cara inferior. Wagner 2009, PDF p. 4-5 (e265); López Ramírez, EKG 5, pp. 140-141.',
    },
    {
        id: 'pif-ecg-f-q002', tema: 'ecg-predice',
        enunciado: 'Piensa antes: ECG con ↑ST en V1-V4, I, aVL y aVR, y ↓ST en II, III, aVF y V5, con más ↑ST en aVL que en aVR. ¿Qué arteria y en qué punto de ella está ocluida?',
        opciones: [
            'DA proximal, antes de la 1.ª septal y la 1.ª diagonal',
            'DA distal, por debajo de la 1.ª septal y la 1.ª diagonal',
            'Coronaria derecha proximal, con extensión al ventrículo derecho',
            'Circunfleja proximal, con compromiso posterior',
        ],
        correcta: 0,
        explicacion: 'Un ↑ST que llega a aVL y aVR y deja un espejo inferior es la firma de una oclusión proximal de la DA: afecta a la base del VI y al tabique. La DA distal no daría ↑ST en V1, aVR ni aVL ni ↓ST inferior. La coronaria derecha da el ↑ST abajo, no un espejo inferior; y la circunfleja se vería en II > III y en V1-V3 con ↓ST. Wagner 2009, PDF p. 4 (e265); López Ramírez, EKG 1, pp. 136-137.',
    },
    {
        id: 'pif-ecg-f-q003', tema: 'ecg-predice',
        enunciado: 'Un ECG muestra ↑ST en II mayor que en III, aVL con ↑ST y ↓ST en V1-V2. Antes de elegir, razona: ¿qué cara del corazón y qué arteria? ¿Qué implica el ↓ST en V1-V2?',
        opciones: [
            'Coronaria derecha: porque el ↑ST inferior es siempre mayor en III que en II y aVL tiene ↓ST',
            'DA proximal: porque el ↑ST en aVL y el espejo en V1-V2 son propios de la cara anterior y lateral',
            '1.ª diagonal: el ↑ST en aVL es lateral alto, sin cara inferior',
            'Circunfleja: inferior y lateral, y el ↓ST en V1-V2 señala pared posterior',
        ],
        correcta: 3,
        explicacion: 'II > III con aVL isoeléctrico o elevado es el patrón de la circunfleja, y el ↓ST en V1-V2 indica pared posterior. Con la coronaria derecha el ↑ST sería mayor en III que en II y aVL a menudo tendría ↓ST: confundirlas lleva a buscar la arteria equivocada. Con la DA proximal hay ↑ST en V1-V4, no ↓ST. La 1.ª diagonal no da ↑ST inferior. El ↓ST en V1-V2 también puede darlo la coronaria derecha: Wagner no las distingue por ese signo. López Ramírez, EKG 7, p. 142; Wagner 2009, PDF p. 5 (e266).',
    },
    {
        id: 'pif-ecg-f-q004', tema: 'ecg-predice',
        enunciado: 'Piensa antes: tras un infarto anterior extenso por oclusión de la DA, ¿qué complicación vigilarías con una ecocardiografía?',
        opciones: [
            'Rotura del músculo papilar posteromedial',
            'Trombo en el ventrículo izquierdo',
            'Infarto del ventrículo derecho',
            'Pseudoaneurisma de la pared inferior',
        ],
        correcta: 1,
        explicacion: 'El trombo del VI aparece sobre todo en el IAMCEST anterior (hasta el 12,2 % en la RMN): si el ápex no se ve bien, un contraste ayuda. La rotura del papilar posteromedial acompaña a infartos inferiores o laterales (riego único): aquí no encaja. El infarto del VD viene de la coronaria derecha proximal. El pseudoaneurisma afecta más a la pared inferior o lateral. ESC 2023 SCA, parte 2, PDF p. 3 (p. 3776, apdo. 12.2.3); AHA 2021 Damluji, apartados «Acute mitral regurgitation secondary to papillary muscle rupture» y «Pseudoaneurysm and true aneurysm».',
    },
    {
        id: 'pif-ecg-f-q005', tema: 'ecg-predice',
        enunciado: 'Piensa antes: al cuarto día de un infarto, la ecografía muestra una comunicación interventricular en la parte posterior del tabique. ¿Qué infarto la explica?',
        opciones: [
            'Un infarto inferior',
            'Un infarto anterior extenso de la DA proximal',
            'Un infarto apical de la DA distal',
            'Un infarto lateral aislado de la marginal, que no llega al tabique',
        ],
        correcta: 0,
        explicacion: 'Los defectos septales posteriores se deben a infartos inferiores; los anteriores y apicales, a infartos del territorio de la DA. Pensar en la DA proximal o distal llevaría a buscar la CIV en el sitio equivocado. Un infarto lateral aislado no es el que la fuente asocia a la CIV posterior. AHA 2021 Damluji, apartado «Ventricular septal defect» (la aparición a los 3-5 días sale de la Tabla 1 del mismo documento).',
    },
    // ---- Caso que evoluciona (paciente inventado) ----
    {
        id: 'pif-ecg-f-c001', tema: 'ecg-predice', paso: 1,
        enunciado: 'Caso, paso 1. Varón de 62 años con dolor torácico de 40 minutos. ECG: ↑ST en II, III y aVF, con más ↑ST en III que en II, ↓ST en I y aVL y ↑ST en V1. Piensa: ¿qué arteria y qué territorio?',
        opciones: [
            'Circunfleja: territorio inferior y lateral, porque el ↑ST es mayor en II que en III',
            'DA proximal: anterior, con espejo inferior',
            'Coronaria derecha proximal: inferior, con posible extensión al VD',
            'DA distal: anterior, sin ↓ST en las derivaciones inferiores',
        ],
        correcta: 2,
        explicacion: 'III > II con ↓ST en I y aVL apunta a la coronaria derecha; el ↑ST en V1 hace pensar en el ventrículo derecho. La circunfleja daría II > III. La DA daría ↑ST anterior, no inferior. Wagner 2009, PDF p. 4 (e265); López Ramírez, EKG 5 y 6, pp. 140-141.',
    },
    {
        id: 'pif-ecg-f-c002', tema: 'ecg-predice', paso: 2,
        enunciado: 'Caso, paso 2. Sigue el dolor y la PA es de 104/66 mmHg. Antes de elegir: ¿qué derivaciones añades, y qué fármaco clásico del dolor isquémico evitas y por qué?',
        opciones: [
            'Solo V7-V9 para ver la pared posterior, y nitroglicerina para el dolor porque la PA es normal',
            'V3R y V4R cuanto antes, y sin nitroglicerina: sus efectos venodilatadores pueden ser contraproducentes si el ventrículo derecho está infartado',
            'Repetir V1-V6 más tarde, y nitroglicerina con la PA vigilada de cerca',
            'V3R y V4R cuanto antes, y nitroglicerina mientras la PA siga normal',
        ],
        correcta: 1,
        explicacion: 'V3R-V4R se registran en todo infarto inferior, y cuanto antes, porque el ↑ST derecho dura menos que el inferior; el ↑ST en V4R sugiere isquemia del VD. En el infarto del VD la nitroglicerina no se aconseja «porque sus efectos venodilatadores pueden ser contraproducentes» (Marino 2024, PDF p. 46); aunque la PA sea normal ahora, el riesgo está en el infarto del VD. Registrar solo V7-V9 o repetir V1-V6 retrasa el diagnóstico del VD. Wagner 2009, PDF p. 4 (e265); ESC 2023 SCA, parte 1, PDF p. 19 (p. 3738) y PDF p. 25 (p. 3744, apdo. 4.2.2.2).',
    },
    {
        id: 'pif-ecg-f-c003', tema: 'ecg-predice', paso: 3,
        enunciado: 'Caso, paso 3. Al cuarto día, el eco muestra rotura de un músculo papilar con insuficiencia mitral aguda. Piensa: en este infarto de la cara inferior, ¿qué papilar es el más probable y por qué?',
        opciones: [
            'El anterolateral, porque tiene doble riego de la DA y de una diagonal o de la marginal de la circunfleja',
            'Ninguno: la rotura papilar no depende del infarto',
            'El anterolateral, porque la coronaria derecha lo irriga solo',
            'El posteromedial: riego único (circunfleja o coronaria derecha) y rotura en infartos inferiores o laterales',
        ],
        correcta: 3,
        explicacion: 'El posteromedial depende de una sola arteria, según la dominancia circunfleja o coronaria derecha, y su rotura se asocia a infartos inferiores o laterales, a los 3-5 días. El anterolateral tiene doble riego (DA y diagonal o marginal de la circunfleja); la rotura típica en un infarto inferior es la del posteromedial. La rotura sí depende del infarto transmural. AHA 2021 Damluji, apartado «Acute mitral regurgitation secondary to papillary muscle rupture» y Tabla 1. La cirugía es de elección y se puede considerar un balón de contrapulsación mientras se espera: ESC 2023 SCA, parte 2, PDF p. 3-4 (pp. 3776-3777).',
    },
];
