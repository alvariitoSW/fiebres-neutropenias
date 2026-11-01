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
            { nombre: 'NPT2a,c', funcion: 'Cotransportadores de Na⁺ y fosfato de la cara luminal: el proximal recupera aquí el fosfato filtrado. La PTH y el FGF23 los inhiben (fosfaturia).', diana: '— (los regulan la PTH y el FGF23)', flujo: [['na', 'r'], ['p', 'r', 'Salida de fosfato']] },
            { nombre: 'Anhidrasa carbónica', enzima: true, funcion: 'Enzima, no transportador: acelera H⁺ + HCO₃⁻ ⇄ CO₂ + H₂O en la luz y dentro de la célula. El HCO₃⁻ filtrado se une al H⁺ que saca NHE3, entra en forma de CO₂ y se regenera dentro para salir a la sangre.', diana: 'Acetazolamida' },
        ],
        paracelular: { iones: ['cl', 'na'], etiqueta: 'ClNa entre las células (parte final)' },
        agua: 'H₂O: 70% del filtrado, isotónica',
        general: 'La reacción del CO₂ con la anhidrasa carbónica es fisiología general: la ficha solo dice que NHE3 recupera el bicarbonato filtrado. También lo es la salida basolateral del fosfato.',
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
        general: 'Que casi todo el K⁺ que entra con NKCC2 vuelva a la luz por ROMK es fisiología general. Lo demás está en las fichas «El riñón y el calcio» y «El riñón y el magnesio»: el Ca²⁺ (20-25%) y el Mg²⁺ (65%) pasan entre las células empujados por la carga positiva de la luz, que depende del NaCl y del reciclaje de K⁺; por eso los diuréticos de asa los pierden en la orina',
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
            { nombre: 'Canal de Ca²⁺', funcion: 'El Ca²⁺ entra desde la luz por TRPV5/TRPV6 y sale a la sangre por el intercambiador basolateral Na⁺/Ca²⁺ (ver la nota de fidelidad de la ficha). La PTH aumenta aquí la reabsorción de Ca²⁺.', diana: '— (lo regula la PTH)', flujo: [['ca2', 'r', 'Na⁺/Ca²⁺']] },
            { nombre: 'TRPM6/7', funcion: 'El Mg²⁺ entra desde la luz por los canales TRPM6 y TRPM7 (a través de la célula). Es solo el 5-10% del Mg²⁺ filtrado, pero está muy regulado: con la rama gruesa decide cuánto Mg²⁺ sale en la orina. Lo estimulan la insulina, la PTH, el EGF y los estrógenos; mucha sal en la dieta lo frena.', diana: '— (lo regulan insulina, PTH, EGF)', flujo: [['mg2', 'r', 'Salida a la sangre']] },
        ],
        general: 'La ficha «El riñón y el calcio» da el canal luminal (TRPV5 y TRPV6), el 5-10% del Ca²⁺ que se reabsorbe aquí y su regulación por la PTH. La hipocalciuria de las tiazidas no ocurre aquí: es la contracción de volumen la que sube la reabsorción proximal de Ca²⁺. El canal TRPM6/7 del Mg²⁺ y su regulación están en «Magnesio y presión arterial» (Kuriyama 2026); por dónde sale el Mg²⁺ a la sangre no lo dice ninguna de las dos fuentes',
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
    // Rabdomiólisis (Marino cap. 34, PDF p. 51-52). La fuente no da índices urinarios
    // propios: lo que no dice va «—»; el reparto por tramos reutiliza el de la NTA y es
    // ilustrativo. `fraVolumen`: lo mismo con salino 10-20 mL/kg y diuresis >=1 mL/kg/h
    // (70 kg: ~1,7 L/día, ilustrativo).
    { id: 'rabdo', nombre: 'Rabdomiólisis', grupo: 'fra', adh: 1, fuentes: [],
      texto: 'La <strong>mioglobina</strong> liberada por el músculo lesionado puede dañar las células epiteliales del túbulo (Marino cap. 34, p. 52). La mioglobinuria es un componente crítico del diagnóstico (tira positiva sin hematíes); la CK se correlaciona más con la lesión muscular (p. 52). El volumen agresivo favorece el flujo tubular.',
      fra: { tfg: 0.25, rTp: 0.25, rTal: 0.2, M: 450, uosm: 320, V: 1.1, fena: 0.04, nta: true, rabdo: true,
        tabla: { volumen: '—', osm: '—', naOrina: '—', fena: '—', crocrs: '—', feurea: '—', sedimento: 'Tira + sin hematíes (mioglobina >20 μg/l, orina parda)' } },
      fraVolumen: { tfg: 0.25, rTp: 0.25, rTal: 0.2, M: 450, uosm: 320, V: 1.7, fena: 0.04, nta: true, rabdo: true, volumenOn: true,
        tabla: { volumen: 'Objetivo: ≥1 mL/kg/h tras salino 10-20 mL/kg (el libro imprime «1 mg/kg/hr»: errata, p. 52)', osm: '—', naOrina: '—', fena: '—', crocrs: '—', feurea: '—', sedimento: 'Tira + sin hematíes; la mioglobina se arrastra' } },
    },
    { id: 'obstruccion', nombre: 'Obstrucción (posrenal)', grupo: 'fra', adh: 0.4825, fuentes: [],
      texto: 'El aumento de presión en la vía urinaria se transmite de forma retrógrada hacia el parénquima: al principio disminuye el FG por el aumento de presión intratubular, y después se perpetúa porque el SRAA y el simpático contraen las arteriolas. En la uropatía obstructiva completa hay anuria (<100 ml/día).',
      fra: { tfg: 0.15, rTp: 0.65, rTal: 0.6, M: 1200, uosm: null, V: 0.05, fena: null, obstruccion: true,
        tabla: { volumen: 'Anuria (<100 ml/día) si es completa', osm: '—', naOrina: '—', fena: '—', crocrs: '—', feurea: '—', sedimento: '—' } },
      ficha: { vista: 'fra', panel: 'panel-fra-tabs', tabId: 'fra-subfenotipos-2', etiqueta: 'Ficha: FRA · Obstructiva →' } },
    // Acidosis hiperclorémicas: los valores de la orina y la sangre son los de
    // la tabla "Diarrea frente a las ATR" de la ficha Ácido-base: acidosis (en
    // `acido.tabla`); NH₄⁺ en orina sale de la frase del hiato aniónico
    // urinario. `defecto` = qué falla y dónde (se marca con ✕ como un fármaco;
    // `tramo`/`etiquetaEn` opcionales: tramo del dibujo y posición del rótulo).
    // Lo que mueve la animación (hco3Spawn, hSec, nh4Sec, kMult, hco3Proximal)
    // es ilustrativo.
    { id: 'diarrea', nombre: 'Diarrea', grupo: 'acido', adh: 0.4825, fuentes: ['ab-gi', 'ab-hau'],
      acido: { hco3Spawn: 0.6, hSec: 1.8, nh4Sec: 2.4, etiqueta: 'HCO₃⁻ perdido por el intestino',
        tabla: { hco3: '<24 mEq/l', k: '↓', uag: '−20 a −50', ph: '>5,5', nh4: 'Presente' } },
      aviso: 'Hiato aniónico urinario negativo: el riñón sí excreta NH₄⁺, el mecanismo de acidificación está intacto. La acidosis viene de fuera del riñón.',
      general: 'Cómo acidifica el colector (H⁺ de la célula intercalar y NH₄⁺) es fisiología general; la ficha da el hiato aniónico urinario y la tabla.',
      ficha: { tabId: 'fisio-acidobase-acidosis', etiqueta: 'Ficha: Ácido-base · acidosis →' } },
    { id: 'atr1', nombre: 'ATR I (distal)', grupo: 'acido', adh: 0.4825, fuentes: ['ab-t-atr1', 'ab-hau', 'ab-atr'],
      texto: 'La <strong>ATR I (distal)</strong> no consigue acidificar la orina: el pH urinario no baja de 5,5 (habitualmente &gt;6,5), no se excreta NH₄⁺ y el hiato aniónico urinario es positivo. HCO₃⁻ plasmático de 10-20 mEq/l, con K⁺ bajo. Se trata con dosis bajas de bicarbonato (~1 mEq/kg/día), parte como sal potásica.',
      acido: { hco3Spawn: 0.6, hSec: 0.12, nh4Sec: 0.15, kMult: 1.6,
        tabla: { hco3: '10-20 mEq/l', k: '↓', uag: 'Positivo', ph: '>5,5 (habitual >6,5)', nh4: 'Sin excreción' } },
      defecto: { segmento: 'colector', canal: 'Célula intercalar tipo A', nombre: 'ATR I', nota: 'ATR I: no secreta H⁺', etiqueta: 'ATR I: no secreta H⁺' },
      aviso: 'Hiato aniónico urinario positivo: no hay NH₄⁺ en la orina. La acidosis es de origen renal.',
      general: 'Que el fallo esté en la secreción de H⁺ de la célula intercalar, y que por eso el colector pierda más K⁺, es fisiología general: la ficha da los valores de la tabla y la dosis de bicarbonato.',
      ficha: { tabId: 'fisio-acidobase-acidosis', etiqueta: 'Ficha: Ácido-base · acidosis →' } },
    { id: 'atr2', nombre: 'ATR II (proximal)', grupo: 'acido', adh: 0.4825, fuentes: ['ab-t-atr2', 'ab-hau', 'ab-atr'],
      texto: 'En la <strong>ATR II (proximal)</strong> el túbulo proximal no recupera todo el HCO₃⁻ filtrado: lo pierde hasta que el HCO₃⁻ plasmático baja a 12-18 mEq/l. El mecanismo distal está intacto: el pH urinario baja de 5,5 y el hiato aniónico urinario es negativo. Necesita dosis altas de bicarbonato (3-15 mEq/kg/día).',
      acido: { hco3Spawn: 0.65, hSec: 1, nh4Sec: 1, kMult: 1.4, hco3Proximal: 0.5,
        tabla: { hco3: '12-18 mEq/l', k: '↓', uag: '−20 a −50', ph: '<5,5 (mecanismo intacto)', nh4: 'Presente' } },
      defecto: { segmento: 'tubulo-proximal', canal: 'Anhidrasa carbónica', nombre: 'ATR II', nota: 'ATR II: recupera mal el HCO₃⁻', etiqueta: 'ATR II: pierde HCO₃⁻', tramo: 'tp2', etiquetaEn: [222, 170] },
      aviso: 'El HCO₃⁻ que escapa del proximal lo recupera en parte el resto de la nefrona; con el HCO₃⁻ plasmático ya bajo se filtra menos y la orina puede acidificarse.',
      general: 'Dónde falla exactamente el proximal (NHE3, la anhidrasa carbónica o la salida basolateral del HCO₃⁻) y que por eso se pierda K⁺ es fisiología general; la ficha solo dice "proximal".',
      ficha: { tabId: 'fisio-acidobase-acidosis', etiqueta: 'Ficha: Ácido-base · acidosis →' } },
    { id: 'atr4', nombre: 'ATR IV (hipoaldosteronismo)', grupo: 'acido', adh: 0.4825, fuentes: ['ab-atr4', 'ab-t-atr4', 'ab-hau'],
      acido: { hco3Spawn: 0.8, hSec: 0.45, nh4Sec: 0.3, ahorraK: true,
        tabla: { hco3: '16-22 mEq/l', k: '↑', uag: 'Positivo', ph: '<5,5', nh4: 'Sin excreción' } },
      defecto: { segmento: 'colector', canal: 'ENaC', nombre: 'ATR IV', nota: 'Sin aldosterona (ATR IV)', etiqueta: 'Sin aldosterona' },
      aviso: 'Sin aldosterona, ENaC reabsorbe menos Na⁺ y ROMK secreta menos K⁺: hiperpotasemia, la marca de la ATR IV. El pH urinario baja de 5,5, pero sin NH₄⁺ (hiato aniónico urinario positivo).',
      general: 'Que la aldosterona active ENaC y ROMK está en la ficha (colector); que también estimule la secreción de H⁺, y que la hiperpotasemia frene la producción de NH₄⁺, es fisiología general.',
      ficha: { tabId: 'fisio-acidobase-acidosis', etiqueta: 'Ficha: Ácido-base · acidosis →' } },
    // Calcio, fósforo y magnesio: los valores son los de la tabla de la
    // hipercalcemia y los algoritmos de la ficha (en `mineral.tabla`); lo que
    // mueve la animación (caSpawn, ca, pProx) es ilustrativo. `efectos`: lo
    // que la situación frena ('bloquea', ✕) o estimula ('activa') en un canal.
    { id: 'hiperpara', nombre: 'Hiperparatiroidismo 1º', grupo: 'mineral', adh: 0.4825, fuentes: ['ca-hpt1', 'ca-t-hpt', 'nv-t-pth', 'p-regulacion'],
      mineral: { caSpawn: 1.5, ca: { tal: 0.6, tcd: 0.9 }, pProx: 0.6,
        tabla: [['PTH', 'N o ↑', ''], ['Ca²⁺ en sangre', 'Alto (suele <11 mg/dl)', 'sube'], ['Ca²⁺ en orina (24 h)', 'N o ↑', ''], ['Cca/Cr', '>0,02', ''], ['Fosfato en sangre', 'Bajo (fosfaturia por la PTH)', 'baja'], ['25-vitamina D', 'N o ↓', '']] },
      efectos: [
        { segmento: 'tubulo-proximal', canal: 'NPT2a,c', tipo: 'bloquea', nombre: 'PTH', nota: 'PTH: frena NPT2 (fosfaturia)', etiqueta: 'PTH: fosfaturia', tramo: 'tp2', etiquetaEn: [222, 170] },
        { segmento: 'tubulo-distal', canal: 'Canal de Ca²⁺', tipo: 'activa', nombre: 'PTH', nota: 'PTH: reabsorbe más Ca²⁺', etiqueta: 'PTH: ↑ Ca²⁺' },
        { segmento: 'tubulo-distal', canal: 'TRPM6/7', tipo: 'activa', nombre: 'PTH', nota: 'PTH: estimula TRPM6/7 (Kuriyama 2026)' },
      ],
      aviso: 'La PTH reabsorbe más Ca²⁺ en el distal, pero se filtra tanto Ca²⁺ (hipercalcemia) que el de la orina es normal o alto: Cca/Cr >0,02. Y frena NPT2a,c: el fosfato se pierde por la orina.',
      general: 'Que la hipercalcemia reduzca la reabsorción de Ca²⁺ en la rama gruesa es fisiología general; la ficha da el resultado (Ca urinario normal o alto).',
      ficha: { tabId: 'fisio-hipercalcemia', etiqueta: 'Ficha: Hipercalcemia →' } },
    { id: 'hhf', nombre: 'Hipercalcemia-hipocalciuria familiar', grupo: 'mineral', adh: 0.4825, fuentes: ['ca-hhf', 'ca-t-hhf', 'ca-orina'],
      mineral: { caSpawn: 1.15, ca: { tal: 0.88, tcd: 0.9 },
        tabla: [['PTH', 'N o ↑', ''], ['Ca²⁺ en sangre', 'Alto (o alto-normal)', 'sube'], ['Ca²⁺ en orina (24 h)', 'Bajo', 'baja'], ['Cca/Cr', '<0,01', ''], ['25-vitamina D', 'N', '']] },
      efectos: [{ segmento: 'asa-ascendente-gruesa', canal: 'paracelular', tipo: 'activa', nombre: 'CaSR', nota: 'CaSR mutado: reabsorbe más Ca²⁺', etiqueta: 'CaSR mutado: ↑ Ca²⁺' }],
      aviso: 'El sensor de calcio (CaSR) del riñón "ve" la calcemia normal o alta como baja y sigue reabsorbiendo Ca²⁺: hipercalcemia con calcio urinario bajo (Cca/Cr <0,01), lo que la separa del hiperparatiroidismo.',
      general: 'Dónde actúa el CaSR del riñón (sobre todo en la rama gruesa) es fisiología general; la ficha dice "↑reabsorción tubular de Ca".',
      ficha: { tabId: 'fisio-hipercalcemia', etiqueta: 'Ficha: Hipercalcemia →' } },
    { id: 'fgf23', nombre: 'Exceso de FGF23', grupo: 'mineral', adh: 0.4825, fuentes: ['p-fgf23', 'p-fig6'],
      mineral: { pProx: 0.55,
        tabla: [['Fosfato en sangre', '<2,5 mg/dl', 'baja'], ['RTP', '<90%: pérdida renal', ''], ['Calcitriol (CTR)', 'Bajo (el FGF23 lo suprime)', 'baja']] },
      efectos: [{ segmento: 'tubulo-proximal', canal: 'NPT2a,c', tipo: 'bloquea', nombre: 'FGF23', nota: 'FGF23: frena NPT2 (fosfaturia)', etiqueta: 'FGF23: fosfaturia', tramo: 'tp2', etiquetaEn: [222, 170] }],
      aviso: 'Con el fosfato bajo, un riñón sano lo recuperaría casi entero (RTP >90%). Aquí el FGF23 frena NPT2a,c y la RTP queda por debajo del 90%: la pérdida es renal (hipofosfatemia ligada a X, autosómica dominante, osteomalacia oncogénica).',
      ficha: { tabId: 'fisio-fosforo', etiqueta: 'Ficha: Fósforo →' } },
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
