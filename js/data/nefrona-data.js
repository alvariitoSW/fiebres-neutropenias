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
// Vista de célula: `flujo` = [ion, 'r' reabsorción | 's' secreción, salida
// basolateral opcional]; sin salida, el Na⁺ sale por la bomba. `epitelio`
// ('alto' | 'cubico' | 'plano'), `cepillo`, `mito`, `bomba`, `fugaK`,
// `paracelular` y `agua` describen la célula; `general` dice qué partes del
// dibujo son fisiología general y no salen de la ficha.
export const segmentosNefrona = {
    glomerulo: {
        nombre: 'Glomérulo (cápsula de Bowman)',
        texto: 'nv-t-dintel',
        canales: [
            { nombre: 'Barrera de filtración', funcion: 'Endotelio fenestrado + membrana basal + podocitos: filtra agua y solutos pequeños, retiene células y proteínas grandes.', diana: '—' },
        ],
        categorias: [
            { key: 'fisio-filtracion', etiqueta: 'Filtración glomerular' },
            { key: 'fisio-regulacion', etiqueta: 'Regulación del filtrado (simulador de TFG)' },
        ],
    },
    'tubulo-proximal': {
        nombre: 'Túbulo contorneado proximal',
        texto: 'nv-t-tp',
        epitelio: 'alto', cepillo: true, mito: 5, bomba: true, fugaK: true,
        canales: [
            { nombre: 'SGLT2', funcion: 'Cotransporta Na⁺ y glucosa desde la luz. El 90% de la glucosa se reabsorbe aquí y el 10% en el segmento recto (SGLT1); los transportadores de glucosa de la cara basolateral la sacan a la sangre.', diana: 'Inhibidores de SGLT2 (gliflozinas)', flujo: [['na', 'r'], ['glu', 'r', 'Transp. glucosa']] },
            { nombre: 'Intercambiador Na⁺/H⁺ (NHE3)', funcion: 'Mete Na⁺ y saca H⁺ a la luz, con lo que recupera el bicarbonato filtrado. Se inhibe con PTH y glucagón; se activa con angiotensina II.', diana: '—', flujo: [['na', 'r'], ['h', 's']] },
            { nombre: 'Anhidrasa carbónica', enzima: true, funcion: 'Enzima, no transportador: acelera H⁺ + HCO₃⁻ ⇄ CO₂ + H₂O en la luz y dentro de la célula. El HCO₃⁻ filtrado se une al H⁺ que saca NHE3, entra en forma de CO₂ y se regenera dentro para salir a la sangre.', diana: 'Acetazolamida' },
        ],
        paracelular: { iones: ['cl', 'na'], etiqueta: 'ClNa entre las células (parte final)' },
        agua: 'H₂O: 70% del filtrado, isotónica',
        general: 'La reacción del CO₂ con la anhidrasa carbónica es fisiología general: la ficha solo dice que NHE3 recupera el bicarbonato filtrado.',
        categorias: [
            { key: 'fisio-tubular', etiqueta: 'Reabsorción y secreción tubular' },
        ],
    },
    'asa-descendente': {
        nombre: 'Asa de Henle — rama descendente delgada',
        texto: 'nv-t-desc',
        epitelio: 'plano', mito: 1,
        canales: [
            { nombre: 'Acuaporinas', funcion: 'Muy permeable al agua, que sale hacia el intersticio hipertónico de la médula. No reabsorbe ClNa y es impermeable a la urea. Células muy delgadas y con pocas mitocondrias.', diana: '—', flujo: [['h2o', 'r', 'Acuaporinas']] },
        ],
        categorias: [
            { key: 'fisio-agua-regulacion', etiqueta: 'Regulación del agua corporal' },
        ],
    },
    'asa-ascendente-delgada': {
        nombre: 'Asa de Henle — rama ascendente delgada (segmento fino)',
        texto: 'nv-t-ascd',
        epitelio: 'plano', mito: 1,
        canales: [
            { nombre: 'Paso pasivo', funcion: 'Impermeable al agua. El ClNa sale por gradiente químico y la urea entra por gradiente químico, sin bomba: así ayuda a concentrar el intersticio medular.', diana: 'No es diana de diuréticos: no hay ninguna bomba que bloquear.', flujo: [['na', 'r'], ['cl', 'r'], ['urea', 's']] },
        ],
        // Sin categoría propia a propósito: transporte pasivo, sin diana
        // farmacológica ni ficha clínica dedicada.
        categorias: [],
    },
    'asa-ascendente-gruesa': {
        nombre: 'Asa de Henle — rama ascendente gruesa',
        texto: 'nv-t-tal',
        epitelio: 'cubico', mito: 5, bomba: true,
        canales: [
            { nombre: 'NKCC2', funcion: 'Cotransporte de Na⁺/K⁺/2Cl⁻ desde la luz, activado por la ADH. Impermeable al agua: saca sal sin agua, el líquido sale más diluido y el intersticio se vuelve hipertónico. Hasta el 25% del Na⁺ filtrado se reabsorbe en la rama ascendente.', diana: 'Diuréticos de asa (furosemida, torasemida, bumetanida)', flujo: [['na', 'r'], ['k', 'r', 'Canal de K⁺'], ['cl', 'r', 'Canal de Cl⁻']] },
            { nombre: 'ROMK (reciclaje de K⁺)', depende: 'NKCC2', desdeCelula: true, funcion: 'Casi todo el K⁺ que entra con NKCC2 vuelve a la luz por el canal ROMK. Así a NKCC2 nunca le falta K⁺ en la luz (hay mucho menos K⁺ que Na⁺ y Cl⁻), y la salida de cargas positivas deja la luz con carga positiva, que empuja el Ca²⁺ y el Mg²⁺ entre las células.', flujo: [['k', 's']] },
        ],
        paracelular: { iones: ['ca'], etiqueta: 'Ca²⁺ y Mg²⁺ entre las células (luz positiva)', depende: 'NKCC2' },
        general: 'El reciclaje de K⁺ por ROMK, la carga positiva de la luz y el paso del Ca²⁺ y el Mg²⁺ entre las células son fisiología general: la ficha dice que el Ca²⁺ y el Mg²⁺ se reabsorben en la rama ascendente, sin decir por qué vía. Por eso, al bloquear NKCC2, también se pierden Ca²⁺ y Mg²⁺ en la orina.',
        categorias: [
            { key: 'diureticos-asa', etiqueta: 'Diuréticos de asa' },
        ],
    },
    'tubulo-distal': {
        nombre: 'Túbulo contorneado distal',
        texto: 'nv-t-tcd',
        epitelio: 'cubico', mito: 4, bomba: true,
        canales: [
            { nombre: 'NCC', funcion: 'Cotransportador Na⁺/Cl⁻ de la cara luminal. Impermeable al agua: sigue diluyendo la orina.', diana: 'Tiazidas (hidroclorotiazida, clortalidona)', flujo: [['na', 'r'], ['cl', 'r', 'Canal de Cl⁻']] },
        ],
        categorias: [
            { key: 'fisio-potasio-regulacion', etiqueta: 'Regulación del potasio corporal' },
            { key: 'fisio-hipopotasemia', etiqueta: 'Hipopotasemia (Gitelman, tiazidas)' },
        ],
    },
    colector: {
        nombre: 'Túbulo y conducto colector',
        texto: 'nv-t-col',
        epitelio: 'cubico', mito: 2, bomba: true,
        canales: [
            { nombre: 'ENaC', funcion: 'Canal de Na⁺ de la célula principal, activado por la aldosterona.', diana: 'Amilorida y triamtereno (cierran el canal); espironolactona y eplerenona (bloquean el receptor de la aldosterona)', flujo: [['na', 'r']] },
            { nombre: 'Acuaporina-2', funcion: 'Canal de agua de la membrana luminal que inserta la ADH; el agua sale a la sangre por AQP3/AQP4 de la cara basolateral.', diana: 'Antagonistas del receptor V2 de la ADH (tolvaptán); relevante en diabetes insípida y SIADH', flujo: [['h2o', 'r', 'AQP3/AQP4']] },
            { nombre: 'ROMK', funcion: 'Canal de K⁺ que lo secreta a la luz. Lo activa la aldosterona y lo inhibe el H⁺ de la luz; secreta más cuanto más flujo y más Na⁺ llegan.', diana: '—', flujo: [['k', 's']] },
            { nombre: 'Transportador de urea', funcion: 'En la parte distal del colector, estimulado por la ADH: la urea sale a la médula interna y forma parte del gradiente.', diana: '—', flujo: [['urea', 'r', 'Hacia la médula']] },
            { nombre: 'Célula intercalar tipo A', intercalar: true, funcion: 'Secreta H⁺ a la luz y saca HCO₃⁻ a la sangre por el intercambiador Cl⁻/HCO₃⁻.', diana: '—', flujo: [['h', 's'], ['hco3', 'r', 'Cl⁻/HCO₃⁻']] },
        ],
        general: 'La bomba de protones de la célula intercalar es fisiología general; ver la nota de fidelidad de la ficha.',
        categorias: [
            { key: 'fisio-hiponatremia', etiqueta: 'Hiponatremia (SIADH)' },
            { key: 'fisio-hipernatremia', etiqueta: 'Hipernatremia (diabetes insípida)' },
            { key: 'fisio-hiperpotasemia', etiqueta: 'Hiperpotasemia (aldosterona, ENaC)' },
        ],
    },
};

// `adh`: nivel de ADH 0-1 (0 = sin ADH, 1 = ADH máxima). El de "normal" es el
// que da 1,8 L de orina con 900 mOsm/día, contando con que la urea que deja
// salir la ADH también sube el gradiente medular (ilustrativo).
export const situacionesNefrona = [
    // `plasma`: lo que pasa en la sangre según las fichas de agua, hipo e
    // hipernatremia (lo que distingue situaciones con la misma orina).
    { id: 'normal', nombre: 'Normal', adh: 0.4825, fuentes: ['nv-t-tabla'], plasma: ['Normal', 'Sin estímulo extra para la ADH'],
      texto: 'De <strong>180 L</strong> de plasma filtrados al día se reabsorbe el 99% del agua y el 99,5% del sodio: quedan <strong>1,8 L</strong> de orina.' },
    { id: 'deshidratacion', nombre: 'Deshidratación', adh: 1, fuentes: ['nv-t-rango-osm', 'nv-t-adh'], plasma: ['↑ Osmolalidad', 'Es lo que dispara la ADH'] },
    { id: 'agua', nombre: 'Bebe mucha agua', adh: 0, fuentes: ['nv-t-rango-osm', 'nv-t-3cond'], plasma: ['↓ Osmolalidad', 'Se apaga la ADH'] },
    { id: 'siadh', nombre: 'SIADH', adh: 0.8, fuentes: ['nv-t-adh'], plasma: ['↓ Na⁺ (hiponatremia)', 'Osm plasmática <280 con orina >100 mOsm/kg'], naOrina: '>40 mEq/l',
      texto: 'El exceso de ADH inserta acuaporinas-2 de forma mantenida en la membrana luminal del colector, aumentando la reabsorción de agua libre de forma inapropiada y produciendo hiponatremia dilucional con orina inadecuadamente concentrada.',
      ficha: { tabId: 'fisio-hiponatremia', etiqueta: 'Ficha completa: Hiponatremia →' } },
    { id: 'di', nombre: 'Diabetes insípida', adh: 0, fuentes: ['nv-t-adh'], plasma: ['↑ Na⁺ si no bebe', 'Riesgo de hipernatremia'],
      texto: 'Ausencia de ADH (central) o resistencia a su acción (nefrogénica) impide la inserción de acuaporinas-2 en el colector: no se reabsorbe agua libre y se pierde orina muy diluida en grandes volúmenes, con riesgo de hipernatremia.',
      ficha: { tabId: 'fisio-hipernatremia', etiqueta: 'Ficha completa: Hipernatremia →' } },
    { id: 'hiperglucemia', nombre: 'Hiperglucemia', adh: 0.4825, fuentes: ['nv-t-tm'], plasma: ['↑ Glucosa', 'Por encima de ~180 mg/dl aparece glucosuria'] },
    // Fracaso renal agudo: los valores de la orina son los rangos de la Tabla 3
    // y del volumen de diuresis de la ficha FRA · Diagnóstico; tfg/uosm/V/fena
    // son un punto ilustrativo dentro de esos rangos para mover la animación.
    { id: 'prerrenal', nombre: 'IRA prerrenal', grupo: 'fra', adh: 1, fuentes: [],
      texto: 'Hipoperfusión: el túbulo está sano y retiene sodio y agua con avidez. En la IRA por hipoperfusión la diuresis suele estar reducida y la orina es concentrada y pobre en sodio.',
      fra: { tfg: 0.4, rTp: 0.75, rTal: 0.6, M: 1200, uosm: 650, V: 0.6, fena: 0.003,
        tabla: { volumen: 'Reducido', osm: '>450 mOsm/kg', naOrina: '<10 mmol/l', fena: '<1%', crocrs: '>40', feurea: '<35%', sedimento: 'Cilindros hialinos' } },
      ficha: { vista: 'fra', panel: 'panel-fra-tabs', tabId: 'fra-diagnostico', etiqueta: 'Ficha: FRA · Diagnóstico →' } },
    { id: 'nta', nombre: 'Necrosis tubular aguda', grupo: 'fra', adh: 1, fuentes: [],
      texto: 'Las células del túbulo dañadas se desprenden y ya no reabsorben el sodio ni concentran la orina: más sodio en la orina, orina poco concentrada y cilindros granulosos. La diuresis suele preservarse, aunque puede haber oliguria (<400 ml/día).',
      fra: { tfg: 0.25, rTp: 0.25, rTal: 0.2, M: 450, uosm: 320, V: 1.1, fena: 0.04, nta: true,
        tabla: { volumen: 'Suele preservarse (puede haber oliguria <400 ml/día)', osm: '<350 mOsm/kg', naOrina: '>20 mmol/l', fena: '>2%', crocrs: '<20', feurea: '>35%', sedimento: 'Cilindros granulosos pigmentados, células epiteliales' } },
      ficha: { vista: 'fra', panel: 'panel-fra-tabs', tabId: 'fra-diagnostico', etiqueta: 'Ficha: FRA · Diagnóstico →' } },
    { id: 'obstruccion', nombre: 'Obstrucción (posrenal)', grupo: 'fra', adh: 0.4825, fuentes: [],
      texto: 'El aumento de presión en la vía urinaria se transmite de forma retrógrada hacia el parénquima: al principio disminuye el FG por el aumento de presión intratubular, y después se perpetúa porque el SRAA y el simpático contraen las arteriolas. En la uropatía obstructiva completa hay anuria (<100 ml/día).',
      fra: { tfg: 0.15, rTp: 0.65, rTal: 0.6, M: 1200, uosm: null, V: 0.05, fena: null, obstruccion: true,
        tabla: { volumen: 'Anuria (<100 ml/día) si es completa', osm: '—', naOrina: '—', fena: '—', crocrs: '—', feurea: '—', sedimento: '—' } },
      ficha: { vista: 'fra', panel: 'panel-fra-tabs', tabId: 'fra-subfenotipos-2', etiqueta: 'Ficha: FRA · Obstructiva →' } },
];

// `segmento`/`canal`: lo que bloquea (se marca con ✕ en la nefrona y en la célula).
export const farmacosNefrona = [
    { id: 'ninguno', nombre: 'Ninguno' },
    { id: 'furosemida', nombre: 'Furosemida', segmento: 'asa-ascendente-gruesa', canal: 'NKCC2', fuentes: ['nv-t-tal'], categoria: { key: 'diureticos-asa', etiqueta: 'Diuréticos de asa →' },
      texto: 'Inhibe el cotransportador NKCC2 en la rama ascendente gruesa del asa de Henle, bloqueando la reabsorción de Na⁺/K⁺/2Cl⁻. Es el diurético más potente porque actúa sobre el segmento que genera el gradiente osmótico medular necesario para concentrar la orina.' },
    { id: 'tiazida', nombre: 'Tiazida', segmento: 'tubulo-distal', canal: 'NCC', fuentes: ['nv-t-tcd'],
      texto: 'Inhibe el cotransportador NCC del túbulo contorneado distal. Al distal llega ya poco sodio, así que el efecto natriurético es moderado. Pero el distal deja de diluir la orina (riesgo de hiponatremia) y llega más Na⁺ al colector, que arrastra la secreción de K⁺ (riesgo de hipopotasemia).' },
    { id: 'espironolactona', nombre: 'Espironolactona', segmento: 'colector', canal: 'ENaC', receptor: true, fuentes: ['nv-t-col'],
      texto: 'Antagoniza el receptor de mineralocorticoides en la célula principal del colector. Sin la acción de la aldosterona (que puede recuperar hasta el 5% del Na⁺ filtrado), ENaC reabsorbe menos Na⁺ y ROMK secreta menos K⁺: diurético débil y ahorrador de K⁺.' },
    { id: 'amilorida', nombre: 'Amilorida', segmento: 'colector', canal: 'ENaC', fuentes: ['nv-t-col'],
      texto: 'A diferencia de la espironolactona, no bloquea el receptor de aldosterona: cierra directamente el canal ENaC, sea cual sea la actividad mineralocorticoide. Por eso funciona en el síndrome de Liddle (donde ENaC está permanentemente activo e independiente de la aldosterona) y no la espironolactona.' },
    { id: 'acetazolamida', nombre: 'Acetazolamida', segmento: 'tubulo-proximal', canal: 'Anhidrasa carbónica', fuentes: ['nv-t-tp'],
      texto: 'Inhibe la anhidrasa carbónica del túbulo proximal: el bicarbonato filtrado no se recupera y sale por la orina. Diurético débil, porque el Na⁺ que no se reabsorbe aquí se recupera más adelante. El mecanismo es farmacología general; en la app aparece como tratamiento de la alcalosis metabólica cuando el suero salino está contraindicado.' },
    { id: 'isglt2', nombre: 'iSGLT2 (gliflozina)', segmento: 'tubulo-proximal', canal: 'SGLT2', fuentes: ['nv-t-tm'] },
];

// Cifras de las fichas que usa el modelo.
export const cifrasNefrona = {
    filtradoL: 180,          // L/día de plasma filtrado (tabla de la ecuación maestra)
    naFiltradoG: 630,        // g/día de Na⁺ filtrado (misma tabla)
    aguaProximal: 0.70,      // fracción del agua filtrada que recupera el proximal
    aguaDescendente: 0.20,   // fracción del agua que llega a la rama descendente (situación normal)
    ureaProximal: 0.50,      // fracción de la urea filtrada que recupera el proximal
    osmMin: 50,              // mOsm/kg sin ADH
    osmMax: 1200,            // mOsm/kg con ADH máxima
    cargaOsmolar: 900,       // mOsm/día habituales
    glucosaTm: 320,          // mg/min
    glucosaUmbral: 180,      // mg/dl
};
