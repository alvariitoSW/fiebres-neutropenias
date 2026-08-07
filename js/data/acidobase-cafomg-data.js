// Datos puros para los selectores interactivos de las fichas "Ácido-base",
// "Hipocalcemia", "Hipercalcemia", "Fósforo" y "Magnesio" del cuaderno de
// campo de Fisiopatología renal. Fuentes: Alteraciones del Metabolismo
// Ácido Base, Nefrología al día (SEN); Rodelo-Haad C, Albalate Ramón M, de
// Sequera Ortíz P, Rodríguez Portillo M. Trastornos del Calcio, Fósforo y
// Magnesio. Nefrología al día (SEN), actualizado 1/10/2025.

export const alcalosisMetabolicaPorCloro = {
    'vomitos-recientes': { etiqueta: 'Vómitos recientes', na: '↑', k: '↑', cl: '↓', nota: 'El bicarbonato urinario obliga a excretar Na⁺ acompañante; el Cl⁻ urinario cae porque la volemia efectiva aún no se ha contraído del todo.' },
    'vomitos-remotos': { etiqueta: 'Vómitos remotos', na: '↓', k: '↓', cl: '↓', nota: 'Una vez contraído el volumen extracelular, el riñón retiene Na⁺, K⁺ y Cl⁻ para intentar restaurar la volemia — los tres caen en orina.' },
    'diureticos-recientes': { etiqueta: 'Diuréticos recientes', na: '↑', k: '↑', cl: '↑', nota: 'Mientras el diurético sigue actuando, bloquea la reabsorción tubular de Na⁺/Cl⁻ — los tres iones aparecen elevados en orina.' },
    'diureticos-remotos': { etiqueta: 'Diuréticos remotos', na: '↓', k: '↓', cl: '↓', nota: 'Pasado el efecto del fármaco, el riñón vuelve a retener Na⁺/K⁺/Cl⁻ por la contracción de volumen ya establecida — igual que en los vómitos remotos.' },
    'bartter-gitelman': { etiqueta: 'Síndromes de Bartter y Gitelman', na: '↑', k: '↑', cl: '↑', nota: 'El defecto tubular hereditario impide la reabsorción de Na⁺/Cl⁻ de forma mantenida (no transitoria como con un diurético) — los tres iones están persistentemente elevados en orina, incluso sin fármacos.' },
};

export const hipocalcemiaPorPTH = {
    'pth-baja': {
        etiqueta: 'PTH disminuida (hipoparatiroidismo)',
        texto: 'La secreción de PTH está reducida por destrucción, desarrollo anómalo o alteración de la glándula paratiroidea.',
        detalle: 'Causas más frecuentes: postquirúrgico (cirugía de tiroides/paratiroides), autoinmune. También: radiación, infiltración (metástasis, sarcoidosis, amiloidosis), genéticas, síndrome del hueso hambriento postparatiroidectomía, hipomagnesemia. Siguiente paso: medir el magnesio.',
    },
    'pth-alta': {
        etiqueta: 'PTH elevada (hiperparatiroidismo secundario)',
        texto: 'La PTH sube en un intento fisiológico de corregir la hipocalcemia — el problema está en otro punto del eje.',
        detalle: 'Causas más frecuentes: déficit de vitamina D. También: resistencia a la vitamina D o a la PTH (pseudohipoparatiroidismo), pérdida de calcio de la circulación (hiperfosfatemia severa, pancreatitis, lisis tumoral), enfermedad renal. Siguiente paso: medir el fósforo.',
    },
};

export const hipercalcemiaDiferencial = {
    hiperparatiroidismo: {
        etiqueta: 'Hiperparatiroidismo',
        pth: 'Normal o ↑', cao: 'Normal o ↑', vitd: 'Normal o ↓',
        texto: 'Adenoma (80-85%), hiperplasia (15-20%) o carcinoma (1%) paratiroideo. Fosfatemia baja por la fosfaturia inducida por la PTH.',
    },
    tumoral: {
        etiqueta: 'Hipercalcemia tumoral',
        pth: '↓', cao: '↑', vitd: 'Según el tumor',
        texto: 'Mediada por PTHrp (mecanismo más común), osteólisis local por citoquinas (mieloma, linfoma) o producción tumoral de calcitriol (linfomas). Calcemias con frecuencia >13 mg/dl.',
    },
    fhh: {
        etiqueta: 'Hipercalcemia-hipocalciuria familiar',
        pth: 'Normal o ↑', cao: '↓ (Cca/Cr <0,01)', vitd: 'Normal',
        texto: 'Mutación autosómica dominante del CaSR renal y paratiroideo. El riñón "interpreta" la calcemia normal-alta como baja, reabsorbiendo Ca⁺ en exceso — de ahí el calcio urinario bajo pese a la hipercalcemia.',
    },
};

export const fosforoMecanismos = {
    'hipo-absorcion': {
        etiqueta: 'Hipofosfatemia por ↓absorción intestinal',
        texto: 'Malnutrición con baja ingesta, déficit o resistencia a la vitamina D, antiácidos/ligantes de fósforo, malabsorción, alcoholismo.',
    },
    'hipo-renal': {
        etiqueta: 'Hipofosfatemia por pérdida renal',
        texto: 'Hiperparatiroidismo 1º/2º, déficit de vitamina D, tubulopatías hereditarias (hipofosfatemia ligada a X, síndrome de Fanconi, enfermedad de Dent), osteomalacia oncogénica, cetoacidosis diabética, acidosis, expansión de volumen, fármacos (calcitonina, acetazolamida, esteroides).',
    },
    'hipo-intracelular': {
        etiqueta: 'Hipofosfatemia por paso al espacio intracelular',
        texto: 'Alcalosis respiratoria aguda, síndrome de realimentación (el más relevante clínicamente), tratamiento con insulina, recuperación de acidosis metabólica o hipotermia, hiperventilación, catecolaminas.',
    },
    'hiper-renal': {
        etiqueta: 'Hiperfosfatemia por ↓excreción renal',
        texto: 'Enfermedad renal aguda o crónica (causa dominante), hipoparatiroidismo/pseudohipoparatiroidismo, acromegalia, calcinosis tumoral, bifosfonatos, toxicidad por vitamina D.',
    },
    'hiper-redistribucion': {
        etiqueta: 'Hiperfosfatemia por redistribución',
        texto: 'Síndrome de lisis tumoral, rabdomiólisis, acidosis respiratoria/metabólica/láctica, anemia hemolítica, estado catabólico, hipertermia maligna.',
    },
};

export const magnesioMecanismos = {
    renal: {
        etiqueta: 'Pérdidas renales',
        texto: 'Poliuria (recuperación de necrosis tubular aguda, postobstructiva), diabetes mellitus, mutaciones genéticas (Bartter/Gitelman), fármacos (tiazidas, furosemida, aminoglucósidos, anfotericina B, inhibidores de calcineurina, cisplatino), hiperaldosteronismo primario, alcoholismo.',
    },
    gastrointestinal: {
        etiqueta: 'Pérdidas gastrointestinales',
        texto: 'Aspiración nasogástrica o vómitos prolongados, diarrea aguda o crónica, fístulas intestinales/biliares, malabsorción, cortocircuito quirúrgico de intestino delgado, pancreatitis aguda, inhibidores de la bomba de protones.',
    },
    redistribucion: {
        etiqueta: 'Redistribución',
        texto: 'Síndrome del hueso hambriento (tras paratiroidectomía) y síndrome de realimentación en pacientes malnutridos.',
    },
};
