// Datos del diagrama interactivo de la nefrona (menú principal de
// Nefrología). Por segmento anatómico: canales/transportadores relevantes y
// las categorías de contenido clínico a las que da acceso ese segmento
// (claves resueltas por `categoriaDisponible` en nefrologia/index.js — así
// se puede añadir o mover una categoría sin tocar el SVG ni nefrona.js).
// Cada canal lleva un array `flujo` (ion + dirección reabsorcion/secrecion)
// que nefrona.js usa para pintar un mini-diagrama de flechas luz↔célula↔
// sangre — la representación visual de "cómo reabsorbe/excreta iones" que
// antes solo estaba descrita en texto.
// `modosInteractivos` resalta uno o más segmentos/canales según el
// diurético o la patología elegidos en el selector; las patologías pueden
// llevar un `link` a la ficha completa del cuaderno de campo de
// Fisiopatología renal (agua/potasio), en vez de quedarse solo en la
// explicación breve de 2 líneas.
export const segmentosNefrona = {
    glomerulo: {
        nombre: 'Glomérulo (cápsula de Bowman)',
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
        canales: [
            { nombre: 'SGLT2', funcion: 'Reabsorción de glucosa acoplada a Na⁺ en el segmento inicial.', diana: 'Inhibidores de SGLT2 (gliflozinas)', flujo: [{ ion: 'Na⁺', direccion: 'reabsorcion' }, { ion: 'Glucosa', direccion: 'reabsorcion' }] },
            { nombre: 'Anhidrasa carbónica', funcion: 'Cataliza la hidratación de CO₂, clave en la reabsorción de bicarbonato.', diana: 'Acetazolamida', flujo: [{ ion: 'HCO₃⁻', direccion: 'reabsorcion' }, { ion: 'H⁺', direccion: 'secrecion' }] },
            { nombre: 'Intercambiador Na⁺/H⁺ (NHE3)', funcion: 'Reabsorción de Na⁺ acoplada a secreción de H⁺.', diana: '—', flujo: [{ ion: 'Na⁺', direccion: 'reabsorcion' }, { ion: 'H⁺', direccion: 'secrecion' }] },
        ],
        categorias: [
            { key: 'fisio-tubular', etiqueta: 'Reabsorción y secreción tubular' },
        ],
    },
    'asa-descendente': {
        nombre: 'Asa de Henle — rama descendente delgada',
        canales: [
            { nombre: 'Acuaporina-1', funcion: 'Muy permeable al agua; concentra la orina en su trayecto hacia la médula. Es mucho más larga en las nefronas yuxtamedulares (llega hasta la papila) que en las corticales (apenas entra en la médula externa) — de esa diferencia depende la capacidad máxima de concentración de la orina.', diana: '—', flujo: [{ ion: 'H₂O', direccion: 'reabsorcion' }] },
        ],
        categorias: [
            { key: 'fisio-agua-regulacion', etiqueta: 'Regulación del agua corporal' },
        ],
    },
    'asa-ascendente-delgada': {
        nombre: 'Asa de Henle — rama ascendente delgada (segmento fino)',
        canales: [
            { nombre: 'Transporte pasivo paracelular', funcion: 'Reabsorbe Na⁺, Cl⁻, Ca²⁺ y Mg²⁺ de forma pasiva (sin bomba activa), a favor del gradiente generado por la médula hipertónica.', diana: 'No es diana de diuréticos — al ser transporte pasivo, no hay ningún canal que bloquear farmacológicamente.', flujo: [{ ion: 'Na⁺/Cl⁻', direccion: 'reabsorcion' }, { ion: 'Ca²⁺/Mg²⁺', direccion: 'reabsorcion' }] },
        ],
        // Sin categoría propia a propósito: es un segmento de transporte
        // puramente pasivo, sin diana farmacológica ni ficha clínica
        // dedicada — forzar un enlace aquí sería relleno, no contenido.
        categorias: [],
    },
    'asa-ascendente-gruesa': {
        nombre: 'Asa de Henle — rama ascendente gruesa',
        canales: [
            { nombre: 'NKCC2', funcion: 'Cotransporte activo Na⁺/K⁺/2Cl⁻; impermeable al agua, genera el gradiente medular hipertónico.', diana: 'Diuréticos de asa (furosemida, torasemida, bumetanida)', flujo: [{ ion: 'Na⁺', direccion: 'reabsorcion' }, { ion: 'K⁺', direccion: 'reabsorcion' }, { ion: 'Cl⁻', direccion: 'reabsorcion' }] },
        ],
        categorias: [
            { key: 'diureticos-asa', etiqueta: 'Diuréticos de asa' },
        ],
    },
    'tubulo-distal': {
        nombre: 'Túbulo contorneado distal',
        canales: [
            { nombre: 'NCC', funcion: 'Cotransportador Na⁺/Cl⁻ sensible a tiazidas.', diana: 'Tiazidas (hidroclorotiazida, clortalidona)', flujo: [{ ion: 'Na⁺', direccion: 'reabsorcion' }, { ion: 'Cl⁻', direccion: 'reabsorcion' }] },
        ],
        categorias: [
            { key: 'fisio-potasio-regulacion', etiqueta: 'Regulación del potasio corporal' },
            { key: 'fisio-hipopotasemia', etiqueta: 'Hipopotasemia (Gitelman, tiazidas)' },
        ],
    },
    colector: {
        nombre: 'Túbulo y conducto colector',
        canales: [
            { nombre: 'ENaC', funcion: 'Canal epitelial de Na⁺ en la célula principal, regulado por aldosterona.', diana: 'Diuréticos ahorradores de K⁺ (amilorida, triamtereno); antagonistas de mineralocorticoides (espironolactona, eplerenona)', flujo: [{ ion: 'Na⁺', direccion: 'reabsorcion' }] },
            { nombre: 'Acuaporina-2', funcion: 'Canal de agua regulado por ADH en la membrana luminal.', diana: 'Antagonistas del receptor V2 de ADH (tolvaptán); relevante en diabetes insípida y SIADH', flujo: [{ ion: 'H₂O', direccion: 'reabsorcion' }] },
            { nombre: 'ROMK', funcion: 'Canal de K⁺ que permite su secreción hacia la luz tubular.', diana: '—', flujo: [{ ion: 'K⁺', direccion: 'secrecion' }] },
        ],
        categorias: [
            { key: 'fisio-hiponatremia', etiqueta: 'Hiponatremia (SIADH)' },
            { key: 'fisio-hipernatremia', etiqueta: 'Hipernatremia (diabetes insípida)' },
            { key: 'fisio-hiperpotasemia', etiqueta: 'Hiperpotasemia (aldosterona, ENaC)' },
        ],
    },
};

export const modosInteractivos = {
    furosemida: {
        tipo: 'diuretico',
        etiqueta: 'Furosemida (diurético de asa)',
        segmentos: ['asa-ascendente-gruesa'],
        canales: ['NKCC2'],
        explicacion: 'Inhibe el cotransportador NKCC2 en la rama ascendente gruesa del asa de Henle, bloqueando la reabsorción de Na⁺/K⁺/2Cl⁻. Es el diurético más potente porque actúa sobre el segmento que genera el gradiente osmótico medular necesario para concentrar la orina.',
    },
    tiazida: {
        tipo: 'diuretico',
        etiqueta: 'Tiazida (hidroclorotiazida)',
        segmentos: ['tubulo-distal'],
        canales: ['NCC'],
        explicacion: 'Inhibe el cotransportador NCC en el túbulo contorneado distal. Efecto natriurético moderado (solo el 5-10% del Na⁺ filtrado se reabsorbe aquí), pero clínicamente relevante por su papel en la hipertensión y por el riesgo de hiponatremia e hipopotasemia.',
    },
    espironolactona: {
        tipo: 'diuretico',
        etiqueta: 'Espironolactona (ahorrador de K⁺)',
        segmentos: ['colector'],
        canales: ['ENaC'],
        explicacion: 'Antagoniza el receptor de mineralocorticoides en la célula principal del colector, reduciendo la actividad de ENaC. Efecto diurético débil pero ahorrador de K⁺; base del bloqueo del eje renina-angiotensina-aldosterona en insuficiencia cardiaca.',
    },
    amiloride: {
        tipo: 'diuretico',
        etiqueta: 'Amiloride (ahorrador de K⁺)',
        segmentos: ['colector'],
        canales: ['ENaC'],
        explicacion: 'A diferencia de la espironolactona, no bloquea el receptor de aldosterona: cierra directamente el canal ENaC, sea cual sea la actividad mineralocorticoide. Por eso funciona en el síndrome de Liddle (donde ENaC está permanentemente activo e independiente de la aldosterona) y no la espironolactona.',
    },
    acetazolamida: {
        tipo: 'diuretico',
        etiqueta: 'Acetazolamida (inhibidor de la anhidrasa carbónica)',
        segmentos: ['tubulo-proximal'],
        canales: ['Anhidrasa carbónica'],
        explicacion: 'Inhibe la anhidrasa carbónica del túbulo proximal, reduciendo la reabsorción de bicarbonato. Diurético débil (el Na⁺ no reabsorbido aquí se recupera después en segmentos distales), usado sobre todo para alcalinizar la orina o tratar la alcalosis metabólica poscorrección.',
    },
    siadh: {
        tipo: 'patologia',
        etiqueta: 'SIADH',
        segmentos: ['colector'],
        canales: ['Acuaporina-2'],
        explicacion: 'El exceso de ADH inserta acuaporinas-2 de forma mantenida en la membrana luminal del colector, aumentando la reabsorción de agua libre de forma inapropiada y produciendo hiponatremia dilucional con orina inadecuadamente concentrada.',
        link: { panelId: 'panel-fisio-tabs', tabId: 'fisio-hiponatremia', etiqueta: 'Ver ficha completa: Hiponatremia →' },
    },
    'diabetes-insipida': {
        tipo: 'patologia',
        etiqueta: 'Diabetes insípida (central o nefrogénica)',
        segmentos: ['colector'],
        canales: ['Acuaporina-2'],
        explicacion: 'Ausencia de ADH (central) o resistencia a su acción (nefrogénica) impide la inserción de acuaporinas-2 en el colector: no se reabsorbe agua libre y se pierde orina muy diluida en grandes volúmenes, con riesgo de hipernatremia.',
        link: { panelId: 'panel-fisio-tabs', tabId: 'fisio-hipernatremia', etiqueta: 'Ver ficha completa: Hipernatremia →' },
    },
    hipopotasemia: {
        tipo: 'patologia',
        etiqueta: 'Hipopotasemia',
        segmentos: ['colector'],
        canales: ['ROMK'],
        explicacion: 'La mayoría de causas renales de hipopotasemia (diuréticos, hiperaldosteronismo, Bartter/Gitelman, Liddle) actúan aumentando el flujo o la electronegatividad luminal en este segmento, lo que estimula la secreción de K⁺ por ROMK más allá de lo fisiológico.',
        link: { panelId: 'panel-fisio-tabs', tabId: 'fisio-hipopotasemia', etiqueta: 'Ver ficha completa: Hipopotasemia →' },
    },
    hiperpotasemia: {
        tipo: 'patologia',
        etiqueta: 'Hiperpotasemia',
        segmentos: ['colector'],
        canales: ['ROMK'],
        explicacion: 'El déficit de aldosterona, la insuficiencia renal o los fármacos que bloquean ENaC/ROMK (IECA, ARA2, ahorradores de K⁺) reducen la secreción distal de K⁺ por este segmento — el mecanismo final común de casi todas las hiperpotasemias por disminución de la eliminación renal.',
        link: { panelId: 'panel-fisio-tabs', tabId: 'fisio-hiperpotasemia', etiqueta: 'Ver ficha completa: Hiperpotasemia →' },
    },
};
