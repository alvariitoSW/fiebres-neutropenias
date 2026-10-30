// Tabla «arteria → ECG → pared → complicación» del infarto agudo. Datos puros (sin DOM).
// Una columna por fuente, nunca una celda que mezcle autores. Cada celda es una lista de elementos
// { texto, fuente, pagina | apartado, href }; un hueco explícito lleva { hueco: true, texto, buscado }.
// Fuentes: López Ramírez 2012 (los mismos datos y páginas que `ecg9-tabla-ekg`), Wagner 2009 (Circulation 119:e262),
// Damluji 2021 (AHA, complicaciones mecánicas; texto libre en PMC, por apartado), ESC 2023 SCA y Marino 2024.
const LOP = 'López Ramírez 2012';
const lop = (texto, pagina, pdf) => ({ texto, fuente: LOP, pagina, href: `docs/lopez-ramirez-2012-alegria-leer-ecg-parte3.pdf#page=${pdf}` });
const wag = (texto, pdf, impresa) => ({ texto, fuente: 'Wagner 2009', pagina: `PDF p. ${pdf} (e${impresa})`, href: `docs/wagner-2009-aha-ecg-isquemia-infarto.pdf#page=${pdf}` });
const DAM_URL = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9364424';
const dam = (texto, apartado) => ({ texto, fuente: 'AHA 2021 (Damluji)', apartado, href: DAM_URL });
const esc = (texto, parte, pdf, impresa) => ({ texto, fuente: 'ESC 2023 SCA', pagina: `parte ${parte}, PDF p. ${pdf} (${impresa})`, href: `docs/esc-2023-sca-parte${parte}.pdf#page=${pdf}` });
const hueco = (texto, buscado) => ({ hueco: true, texto, buscado });

export const scaColumnas = [
    { clave: 'lopez', titulo: 'ECG según López Ramírez' },
    { clave: 'wagner', titulo: 'ECG según Wagner 2009' },
    { clave: 'pared', titulo: 'Pared' },
    { clave: 'complicacion', titulo: 'Complicación' },
];

export const scaTerritorios = [
    {
        id: 'da-proximal', territorio: 'DA proximal (antes de la 1.ª septal y la 1.ª diagonal)',
        lopez: [lop('EKG 1: ↑ST > 0,25 mV en V1; ↑ST en aVR; ↓ST en V5; ↓ST inferior ≥ 0,1 mV; Q en aVL con ↑ST en DI-aVL', 'pp. 136-137', 9)],
        wagner: [wag('↑ST en V1-V4, I, aVL y a menudo aVR; ↓ST recíproco en II, III, aVF y a menudo V5; más ↑ST en aVL que en aVR y más ↓ST en III que en II', 4, 265)],
        pared: [wag('Base del VI, paredes anterior y lateral y tabique («extensive anterior wall or anterobasal»)', 4, 265)],
        complicacion: [
            dam('Los defectos septales anteriores y apicales se deben a infartos del territorio de la DA', 'Ventricular septal defect'),
            dam('Shock con predominio del VI: infarto extenso de la DA', 'Tabla 2'),
            esc('Trombo del VI sobre todo en el IAMCEST anterior', 2, 3, 'p. 3776, apdo. 12.2.3'),
        ],
    },
    {
        id: 'da-distal', territorio: 'DA distal (tras la 1.ª septal y la 1.ª diagonal)',
        lopez: [lop('EKG 4: sin ↓ST inferior (≤ 0,1 mV, sobre todo en DIII); Q en V4-V6; T negativa en aVL; a veces ↓ST en aVL', 'pp. 139-140', 12)],
        wagner: [wag('↑ST en V3-V6 (menos en V2); sin ↑ST en V1, aVR ni aVL; sin ↓ST en II, III, aVF (puede haber ↑ST en II, III, aVF)', 4, 265)],
        pared: [wag('Anterior', 4, 265)],
        complicacion: [
            dam('Los defectos septales apicales se deben a infartos del territorio de la DA', 'Ventricular septal defect'),
            dam('El aneurisma verdadero se debe sobre todo a la oclusión total de la DA', 'Pseudoaneurysm and true aneurysm'),
        ],
    },
    {
        id: 'diagonal', territorio: '1.ª diagonal',
        lopez: [lop('EKG 8: ↑ST en DI, aVL y V2 (> 0,1 mV); ↓ST en DIII y aVF; V3 isoeléctrico o ↓ST < 0,1 mV; ↓ST de 1 mm en V4', 'pp. 142-143', 15)],
        wagner: [hueco('Wagner no trata la oclusión de la diagonal; solo describe la DA entre la 1.ª septal y la 1.ª diagonal: V1 sin ↑ST, aVL con ↑ST y III con ↓ST (PDF p. 4, e265)', 'Wagner 2009, ESC 2023')],
        pared: [hueco('La fuente no lo dice', 'López Ramírez, Wagner')],
        complicacion: [hueco('La fuente no lo dice', 'Damluji 2021, ESC 2023, Marino')],
    },
    {
        id: 'cd-inferior', territorio: 'Coronaria derecha (infarto inferior)',
        lopez: [lop('EKG 5: ↓ST en DIII > DII (flecha tal como la imprime el libro, ver nota); ↓ST ≥ 1 mm en DI y aVL; ↓ST en V1-V2 = compromiso posterior', 'pp. 140-141', 13)],
        wagner: [wag('↑ST solo en II, III y aVF, con más ↑ST en III que en II; a menudo ↓ST en I y aVL', 4, 265)],
        pared: [wag('Inferior', 4, 265)],
        complicacion: [
            dam('Los defectos septales posteriores se deben a infartos inferiores', 'Ventricular septal defect'),
            dam('La rotura del músculo papilar posteromedial (riego único: Cx o CD) ocurre con infartos inferiores o laterales', 'Acute mitral regurgitation secondary to papillary muscle rupture'),
            { texto: 'La insuficiencia cardíaca derecha suele deberse a hipertensión pulmonar o a un infarto de pared inferior', fuente: 'Marino 2024, caps. 18-21', pagina: 'PDF p. 3', href: 'docs/marino-2024-cardiac-disorders-caps18-21.pdf#page=3' },
            hueco('BAV con infarto inferior: la fuente no lo dice', 'ESC 2023, Wagner'),
        ],
    },
    {
        id: 'cd-vd', territorio: 'Coronaria derecha proximal + ventrículo derecho',
        lopez: [lop('EKG 6: lo anterior, con mayor ↓ST en aVL que en V1, ↑ST en V1 y ↑ST en V4R, que rara vez persiste más de 12 h', 'p. 141', 14)],
        wagner: [wag('↑ST en V3R y V4R y a menudo en V1; V4R es la derivación derecha más usada; la ↑ST derecha dura menos que la inferior (sin cifra de horas): registrarla cuanto antes. El vector posterior puede anular el ↑ST en V1', 4, 265)],
        pared: [wag('Inferior con extensión al ventrículo derecho (y posterolateral izquierda si la CD es dominante)', 5, 266)],
        complicacion: [
            esc('No dar nitratos con hipotensión, bradicardia o taquicardia marcadas, o infarto del VD', 1, 25, 'p. 3744, apdo. 4.2.2.2'),
            dam('Shock con predominio del VD: suele ser infarto de la coronaria derecha con afectación del VD', 'Tabla 2'),
            dam('El infarto del VD es un rasgo importante de los defectos septales por oclusión proximal aguda de la coronaria derecha', 'Ventricular septal defect'),
        ],
    },
    {
        id: 'cx-om', territorio: 'Circunfleja / obtusa marginal (lateral y posterior)',
        lopez: [
            lop('EKG 7 (inferior, circunfleja): ↑ST en DII > DIII; aVL isoeléctrico o con ↑ST; ↓ST en V1-V2 (también en la CD): «siempre implica compromiso posterior»', 'p. 142', 15),
            lop('EKG 9 (obtusa marginal 1 proximal): ↑ST en aVL y V6; leve ↓ST en DIII y aVF; ↓ST en V2 (< 0,1 mV), V3 y V4', 'p. 143', 16),
        ],
        wagner: [wag('↑ST en II mayor que en III; I y aVL isoeléctricos o con ↑ST. La ↓ST en V1-V3 con infarto inferior puede ser de CD o de Cx y no las distingue; su ausencia sugiere más CD que Cx', 5, 266)],
        pared: [wag('Inferior y lateral; ↓ST en V1-V3 = pared posterior o posterolateral', 5, 266)],
        complicacion: [
            dam('La rotura del músculo papilar posteromedial (riego único: Cx o CD) ocurre con infartos inferiores o laterales', 'Acute mitral regurgitation secondary to papillary muscle rupture'),
            dam('El pseudoaneurisma afecta con más frecuencia a la pared inferior o lateral', 'Pseudoaneurysm and true aneurysm'),
        ],
    },
];

// Notas de fuentes (se muestran bajo la tabla en `<details class="nota-plegable">`; no se elige ganadora).
export const scaNotas = [
    { id: 'errata-ekg5', titulo: 'Nota de fidelidad: ↓ST o ↑ST en DIII frente a DII (EKG 5)',
      texto: 'López Ramírez imprime «↓ST en DIII > DII» con flecha hacia abajo (pp. 140-141); Wagner 2009 dice «greater ST-segment elevation in lead III than in lead II» (PDF p. 4, e265). La tabla reproduce cada una como la imprime su fuente.' },
    { id: 'v4r-duracion', titulo: 'Nota de fuentes: cuánto dura el ↑ST en V4R',
      texto: 'López Ramírez: «rara vez persiste más de 12 h» (p. 141). Wagner 2009: dura «a much shorter period» que la elevación inferior, sin cifra (PDF p. 4). La ESC 2023 no da duración (PDF p. 19 de la parte 1): V3R y V4R se registran si se sospecha infarto inferior.' },
    { id: 'posterior', titulo: 'Nota de fuentes: ↓ST en V1-V3 y la arteria',
      texto: 'López Ramírez: ↓ST en V1-V2 implica compromiso posterior, en CD o Cx. Wagner 2009: no distingue CD de Cx; su ausencia sugiere más CD, y mantiene «posterior» por convención (propone «lateral»). ESC 2023: ↓ST en V1-V3 o ↑ST en V7-V9 sugieren oclusión posterior, «often the left circumflex» (parte 1, PDF p. 19, p. 3738). Las tres coinciden en la pared; difieren en la arteria.' },
];

export const damlujiRef = {
    texto: 'Damluji AA et al. Mechanical Complications of Acute Myocardial Infarction: A Scientific Statement From the American Heart Association. Circulation 2021;144(2):e16-e35 (DOI 10.1161/CIR.0000000000000985).',
    nota: 'Texto libre en PMC (versión de autor); se cita por apartado, sin número de página.',
    href: DAM_URL,
};
