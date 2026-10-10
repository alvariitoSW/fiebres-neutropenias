// Datos de la nefrona viva (nefrona-viva.js, vista "nefrona" de Nefrología).
// - segmentosNefrona: por tramo anatómico, sus canales/transportadores (con
//   los iones que mueven: `flujo`, clave de ion + 'r' reabsorción o 's'
//   secreción), el id de su línea en la ficha "Reabsorción y secreción"
//   (`texto`, lo que se copia en el panel del tramo y adonde lleva
//   "Texto ↓") y las fichas de contenido clínico a las que da acceso
//   (`categorias`, resueltas por onCategoria en nefrologia/index.js).
// - situacionesNefrona / farmacosNefrona: los mandos de la simulación.
//   `fuentes` son ids de líneas de las fichas: si no hay `texto`, la
//   explicación se lee de ahí (una sola fuente); `ficha` enlaza a la ficha
//   clínica completa.
// - cifrasNefrona: las cifras que el modelo toma de las fichas. El resto
//   del modelo (reparto del Na⁺/K⁺ por tramos, efecto agudo de cada
//   fármaco) es ilustrativo y vive en nefrona-viva.js.
export const segmentosNefrona = {
    glomerulo: {
        nombre: 'Glomérulo (cápsula de Bowman)',
        texto: 'nv-t-dintel',
        canales: [
            { nombre: 'Barrera de filtración', funcion: 'Endotelio fenestrado + membrana basal + podocitos: filtra agua y solutos pequeños, retiene células y proteínas grandes.', diana: '—' },
            { nombre: '2 tipos de nefrona según su posición', funcion: 'Nefronas corticales (~85%): glomérulo en la corteza externa, asa de Henle corta que apenas entra en la médula. Nefronas yuxtamedulares (~15%): glomérulo junto a la unión corticomedular, asa de Henle larga que llega hasta la papila — son las responsables de generar el gradiente que permite concentrar mucho la orina.', diana: '—' },
        ],
        categorias: [
            { key: 'fisio-filtracion', etiqueta: 'Filtración glomerular' },
            { key: 'fisio-regulacion', etiqueta: 'Regulación del filtrado (simulador de TFG)' },
        ],
    },
    'tubulo-proximal': {
        nombre: 'Túbulo contorneado proximal',
        texto: 'nv-t-tp',
        canales: [
            { nombre: 'SGLT2', funcion: 'Reabsorción de glucosa acoplada a Na⁺ en el segmento inicial.', diana: 'Inhibidores de SGLT2 (gliflozinas)', flujo: [['na', 'r'], ['glu', 'r']] },
            { nombre: 'Anhidrasa carbónica', funcion: 'Cataliza la hidratación de CO₂, clave en la reabsorción de bicarbonato.', diana: 'Acetazolamida', flujo: [['hco3', 'r'], ['h', 's']] },
            { nombre: 'Intercambiador Na⁺/H⁺ (NHE3)', funcion: 'Reabsorción de Na⁺ acoplada a secreción de H⁺.', diana: '—', flujo: [['na', 'r'], ['h', 's']] },
        ],
        categorias: [
            { key: 'fisio-tubular', etiqueta: 'Reabsorción y secreción tubular' },
        ],
    },
    'asa-descendente': {
        nombre: 'Asa de Henle — rama descendente delgada',
        texto: 'nv-t-desc',
        canales: [
            { nombre: 'Acuaporina-1', funcion: 'Muy permeable al agua; concentra la orina en su trayecto hacia la médula. Es mucho más larga en las nefronas yuxtamedulares (llega hasta la papila) que en las corticales (apenas entra en la médula externa) — de esa diferencia depende la capacidad máxima de concentración de la orina.', diana: '—', flujo: [['h2o', 'r']] },
        ],
        categorias: [
            { key: 'fisio-agua-regulacion', etiqueta: 'Regulación del agua corporal' },
        ],
    },
    'asa-ascendente-delgada': {
        nombre: 'Asa de Henle — rama ascendente delgada (segmento fino)',
        texto: 'nv-t-ascd',
        canales: [
            { nombre: 'Transporte pasivo paracelular', funcion: 'Reabsorbe Na⁺, Cl⁻, Ca²⁺ y Mg²⁺ de forma pasiva (sin bomba activa), a favor del gradiente generado por la médula hipertónica.', diana: 'No es diana de diuréticos — al ser transporte pasivo, no hay ningún canal que bloquear farmacológicamente.', flujo: [['na', 'r'], ['cl', 'r'], ['ca', 'r']], paracelular: true },
        ],
        // Sin categoría propia a propósito: es un segmento de transporte
        // puramente pasivo, sin diana farmacológica ni ficha clínica
        // dedicada — forzar un enlace aquí sería relleno, no contenido.
        categorias: [],
    },
    'asa-ascendente-gruesa': {
        nombre: 'Asa de Henle — rama ascendente gruesa',
        texto: 'nv-t-tal',
        canales: [
            { nombre: 'NKCC2', funcion: 'Cotransporte activo Na⁺/K⁺/2Cl⁻; impermeable al agua, genera el gradiente medular hipertónico.', diana: 'Diuréticos de asa (furosemida, torasemida, bumetanida)', flujo: [['na', 'r'], ['k', 'r'], ['cl', 'r']] },
        ],
        categorias: [
            { key: 'diureticos-asa', etiqueta: 'Diuréticos de asa' },
        ],
    },
    'tubulo-distal': {
        nombre: 'Túbulo contorneado distal',
        texto: 'nv-t-tcd',
        canales: [
            { nombre: 'NCC', funcion: 'Cotransportador Na⁺/Cl⁻ sensible a tiazidas.', diana: 'Tiazidas (hidroclorotiazida, clortalidona)', flujo: [['na', 'r'], ['cl', 'r']] },
        ],
        categorias: [
            { key: 'fisio-potasio-regulacion', etiqueta: 'Regulación del potasio corporal' },
            { key: 'fisio-hipopotasemia', etiqueta: 'Hipopotasemia (Gitelman, tiazidas)' },
        ],
    },
    colector: {
        nombre: 'Túbulo y conducto colector',
        texto: 'nv-t-col',
        canales: [
            { nombre: 'ENaC', funcion: 'Canal epitelial de Na⁺ en la célula principal, regulado por aldosterona.', diana: 'Diuréticos ahorradores de K⁺ (amilorida, triamtereno); antagonistas de mineralocorticoides (espironolactona, eplerenona)', flujo: [['na', 'r']] },
            { nombre: 'Acuaporina-2', funcion: 'Canal de agua regulado por ADH en la membrana luminal.', diana: 'Antagonistas del receptor V2 de ADH (tolvaptán); relevante en diabetes insípida y SIADH', flujo: [['h2o', 'r']] },
            { nombre: 'ROMK', funcion: 'Canal de K⁺ que permite su secreción hacia la luz tubular.', diana: '—', flujo: [['k', 's']] },
        ],
        categorias: [
            { key: 'fisio-hiponatremia', etiqueta: 'Hiponatremia (SIADH)' },
            { key: 'fisio-hipernatremia', etiqueta: 'Hipernatremia (diabetes insípida)' },
            { key: 'fisio-hiperpotasemia', etiqueta: 'Hiperpotasemia (aldosterona, ENaC)' },
        ],
    },
};

// `adh`: nivel de ADH 0-1 (0 = sin ADH, 1 = ADH máxima). El de "normal" es el
// que da 1,8 L de orina con 900 mOsm/día (ilustrativo).
export const situacionesNefrona = [
    { id: 'normal', nombre: 'Normal', adh: 0.391, fuentes: ['nv-t-tabla'],
      texto: 'De <strong>180 L</strong> de plasma filtrados al día se reabsorbe el 99% del agua y el 99,5% del sodio: quedan <strong>1,8 L</strong> de orina.' },
    { id: 'deshidratacion', nombre: 'Deshidratación', adh: 1, fuentes: ['nv-t-rango-osm', 'nv-t-adh'] },
    { id: 'agua', nombre: 'Bebe mucha agua', adh: 0, fuentes: ['nv-t-rango-osm', 'nv-t-3cond'] },
    { id: 'siadh', nombre: 'SIADH', adh: 1, fuentes: ['nv-t-adh'],
      texto: 'El exceso de ADH inserta acuaporinas-2 de forma mantenida en la membrana luminal del colector, aumentando la reabsorción de agua libre de forma inapropiada y produciendo hiponatremia dilucional con orina inadecuadamente concentrada.',
      ficha: { tabId: 'fisio-hiponatremia', etiqueta: 'Ficha completa: Hiponatremia →' } },
    { id: 'di', nombre: 'Diabetes insípida', adh: 0, fuentes: ['nv-t-adh'],
      texto: 'Ausencia de ADH (central) o resistencia a su acción (nefrogénica) impide la inserción de acuaporinas-2 en el colector: no se reabsorbe agua libre y se pierde orina muy diluida en grandes volúmenes, con riesgo de hipernatremia.',
      ficha: { tabId: 'fisio-hipernatremia', etiqueta: 'Ficha completa: Hipernatremia →' } },
    { id: 'hiperglucemia', nombre: 'Hiperglucemia', adh: 0.391, fuentes: ['nv-t-tm'] },
    // Fracaso renal agudo: los valores de la orina son los rangos de la Tabla 3
    // y del volumen de diuresis de la ficha FRA · Diagnóstico; tfg/uosm/V/fena
    // son un punto ilustrativo dentro de esos rangos para mover la animación.
    { id: 'prerrenal', nombre: 'IRA prerrenal', grupo: 'fra', adh: 1, fuentes: [],
      texto: 'Hipoperfusión: el túbulo está sano y retiene sodio y agua con avidez. En la IRA por hipoperfusión la diuresis suele estar reducida y la orina es concentrada y pobre en sodio.',
      fra: { tfg: 0.4, rTp: 0.75, rTal: 0.6, M: 1200, uosm: 650, V: 0.6, fena: 0.003,
        tabla: { volumen: 'Reducido', osm: '>450 mOsm/kg', naOrina: '<10 mmol/l', fena: '<1%', sedimento: 'Cilindros hialinos' } },
      ficha: { vista: 'fra', panel: 'panel-fra-tabs', tabId: 'fra-diagnostico', etiqueta: 'Ficha: FRA · Diagnóstico →' } },
    { id: 'nta', nombre: 'Necrosis tubular aguda', grupo: 'fra', adh: 1, fuentes: [],
      texto: 'Las células del túbulo dañadas se desprenden y ya no reabsorben el sodio ni concentran la orina: más sodio en la orina, orina poco concentrada y cilindros granulosos. Suele haber oliguria (<400 ml/día).',
      fra: { tfg: 0.25, rTp: 0.25, rTal: 0.2, M: 450, uosm: 320, V: 0.3, fena: 0.04, nta: true,
        tabla: { volumen: '<400 ml/día', osm: '<350 mOsm/kg', naOrina: '>20 mmol/l', fena: '>2%', sedimento: 'Cilindros granulosos, células epiteliales' } },
      ficha: { vista: 'fra', panel: 'panel-fra-tabs', tabId: 'fra-diagnostico', etiqueta: 'Ficha: FRA · Diagnóstico →' } },
    { id: 'obstruccion', nombre: 'Obstrucción (posrenal)', grupo: 'fra', adh: 0.391, fuentes: [],
      texto: 'El aumento de presión en la vía urinaria se transmite de forma retrógrada hacia el parénquima: disminuye el FG por el aumento de presión intratubular. En la uropatía obstructiva completa hay anuria (<100 ml/día).',
      fra: { tfg: 0.15, rTp: 0.65, rTal: 0.6, M: 1200, uosm: null, V: 0.05, fena: null, obstruccion: true,
        tabla: { volumen: '<100 ml/día (anuria si es completa)', osm: '—', naOrina: '—', fena: '—', sedimento: '—' } },
      ficha: { vista: 'fra', panel: 'panel-fra-tabs', tabId: 'fra-subfenotipos-2', etiqueta: 'Ficha: FRA · Obstructiva →' } },
];

// `segmento`/`canal`: lo que bloquea (se marca con ✕ en la nefrona y en la célula).
export const farmacosNefrona = [
    { id: 'ninguno', nombre: 'Ninguno' },
    { id: 'furosemida', nombre: 'Furosemida', segmento: 'asa-ascendente-gruesa', canal: 'NKCC2', fuentes: ['nv-t-tal'], categoria: { key: 'diureticos-asa', etiqueta: 'Diuréticos de asa →' },
      texto: 'Inhibe el cotransportador NKCC2 en la rama ascendente gruesa del asa de Henle, bloqueando la reabsorción de Na⁺/K⁺/2Cl⁻. Es el diurético más potente porque actúa sobre el segmento que genera el gradiente osmótico medular necesario para concentrar la orina.' },
    { id: 'tiazida', nombre: 'Tiazida', segmento: 'tubulo-distal', canal: 'NCC', fuentes: ['nv-t-tcd'],
      texto: 'Inhibe el cotransportador NCC en el túbulo contorneado distal. Efecto natriurético moderado (solo el 5-10% del Na⁺ filtrado se reabsorbe aquí), pero clínicamente relevante por su papel en la hipertensión y por el riesgo de hiponatremia e hipopotasemia.' },
    { id: 'espironolactona', nombre: 'Espironolactona', segmento: 'colector', canal: 'ENaC', receptor: true, fuentes: ['nv-t-col'],
      texto: 'Antagoniza el receptor de mineralocorticoides en la célula principal del colector, reduciendo la actividad de ENaC. Efecto diurético débil pero ahorrador de K⁺; base del bloqueo del eje renina-angiotensina-aldosterona en insuficiencia cardiaca.' },
    { id: 'amilorida', nombre: 'Amilorida', segmento: 'colector', canal: 'ENaC', fuentes: ['nv-t-col'],
      texto: 'A diferencia de la espironolactona, no bloquea el receptor de aldosterona: cierra directamente el canal ENaC, sea cual sea la actividad mineralocorticoide. Por eso funciona en el síndrome de Liddle (donde ENaC está permanentemente activo e independiente de la aldosterona) y no la espironolactona.' },
    { id: 'acetazolamida', nombre: 'Acetazolamida', segmento: 'tubulo-proximal', canal: 'Anhidrasa carbónica', fuentes: ['nv-t-tp'],
      texto: 'Inhibe la anhidrasa carbónica del túbulo proximal, reduciendo la reabsorción de bicarbonato. Diurético débil (el Na⁺ no reabsorbido aquí se recupera después en segmentos distales), usado sobre todo para alcalinizar la orina o tratar la alcalosis metabólica poscorrección.' },
    { id: 'isglt2', nombre: 'iSGLT2 (gliflozina)', segmento: 'tubulo-proximal', canal: 'SGLT2', fuentes: ['nv-t-tm'] },
];

// Cifras de las fichas que usa el modelo.
export const cifrasNefrona = {
    filtradoL: 180,          // L/día de plasma filtrado (tabla de la ecuación maestra)
    naFiltradoG: 630,        // g/día de Na⁺ filtrado (misma tabla)
    aguaProximal: 0.70,      // fracción del agua filtrada que recupera el proximal
    osmMin: 50,              // mOsm/kg sin ADH
    osmMax: 1200,            // mOsm/kg con ADH máxima
    cargaOsmolar: 900,       // mOsm/día habituales
    glucosaTm: 320,          // mg/min
    glucosaUmbral: 180,      // mg/dl
};
