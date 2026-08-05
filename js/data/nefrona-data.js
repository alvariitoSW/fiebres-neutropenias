// Datos del diagrama interactivo de la nefrona (menú principal de
// Nefrología). Por segmento anatómico: canales/transportadores relevantes y
// las categorías de contenido clínico a las que da acceso ese segmento
// (claves resueltas por `categoriaDisponible` en nefrologia/index.js — así
// se puede añadir o mover una categoría sin tocar el SVG ni nefrona.js).
// `modosInteractivos` resalta uno o más segmentos/canales según el
// diurético o la patología elegidos en el selector.
export const segmentosNefrona = {
    glomerulo: {
        nombre: 'Glomérulo (cápsula de Bowman)',
        canales: [
            { nombre: 'Barrera de filtración', funcion: 'Endotelio fenestrado + membrana basal + podocitos: filtra agua y solutos pequeños, retiene células y proteínas grandes.', diana: '—' },
            { nombre: '2 tipos de nefrona según su posición', funcion: 'Nefronas corticales (~85%): glomérulo en la corteza externa, asa de Henle corta que apenas entra en la médula. Nefronas yuxtamedulares (~15%): glomérulo junto a la unión corticomedular, asa de Henle larga que llega hasta la papila — son las responsables de generar el gradiente que permite concentrar mucho la orina.', diana: '—' },
        ],
        categorias: [],
    },
    'tubulo-proximal': {
        nombre: 'Túbulo contorneado proximal',
        canales: [
            { nombre: 'SGLT2', funcion: 'Reabsorción de glucosa acoplada a Na⁺ en el segmento inicial.', diana: 'Inhibidores de SGLT2 (gliflozinas)' },
            { nombre: 'Anhidrasa carbónica', funcion: 'Cataliza la hidratación de CO₂, clave en la reabsorción de bicarbonato.', diana: 'Acetazolamida' },
            { nombre: 'Intercambiador Na⁺/H⁺ (NHE3)', funcion: 'Reabsorción de Na⁺ acoplada a secreción de H⁺.', diana: '—' },
        ],
        categorias: [],
    },
    'asa-descendente': {
        nombre: 'Asa de Henle — rama descendente delgada',
        canales: [
            { nombre: 'Acuaporina-1', funcion: 'Muy permeable al agua; concentra la orina en su trayecto hacia la médula. Es mucho más larga en las nefronas yuxtamedulares (llega hasta la papila) que en las corticales (apenas entra en la médula externa) — de esa diferencia depende la capacidad máxima de concentración de la orina.', diana: '—' },
        ],
        categorias: [],
    },
    'asa-ascendente-delgada': {
        nombre: 'Asa de Henle — rama ascendente delgada (segmento fino)',
        canales: [
            { nombre: 'Transporte pasivo paracelular', funcion: 'Reabsorbe Na⁺, Cl⁻, Ca²⁺ y Mg²⁺ de forma pasiva (sin bomba activa), a favor del gradiente generado por la médula hipertónica.', diana: 'No es diana de diuréticos — al ser transporte pasivo, no hay ningún canal que bloquear farmacológicamente.' },
        ],
        categorias: [],
    },
    'asa-ascendente-gruesa': {
        nombre: 'Asa de Henle — rama ascendente gruesa',
        canales: [
            { nombre: 'NKCC2', funcion: 'Cotransporte activo Na⁺/K⁺/2Cl⁻; impermeable al agua, genera el gradiente medular hipertónico.', diana: 'Diuréticos de asa (furosemida, torasemida, bumetanida)' },
        ],
        categorias: ['diureticos-asa'],
    },
    'tubulo-distal': {
        nombre: 'Túbulo contorneado distal',
        canales: [
            { nombre: 'NCC', funcion: 'Cotransportador Na⁺/Cl⁻ sensible a tiazidas.', diana: 'Tiazidas (hidroclorotiazida, clortalidona)' },
        ],
        categorias: [],
    },
    colector: {
        nombre: 'Túbulo y conducto colector',
        canales: [
            { nombre: 'ENaC', funcion: 'Canal epitelial de Na⁺ en la célula principal, regulado por aldosterona.', diana: 'Diuréticos ahorradores de K⁺ (amilorida, triamtereno); antagonistas de mineralocorticoides (espironolactona, eplerenona)' },
            { nombre: 'Acuaporina-2', funcion: 'Canal de agua regulado por ADH en la membrana luminal.', diana: 'Antagonistas del receptor V2 de ADH (tolvaptán); relevante en diabetes insípida y SIADH' },
            { nombre: 'ROMK', funcion: 'Canal de K⁺ que permite su secreción hacia la luz tubular.', diana: '—' },
        ],
        categorias: [],
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
    siadh: {
        tipo: 'patologia',
        etiqueta: 'SIADH',
        segmentos: ['colector'],
        canales: ['Acuaporina-2'],
        explicacion: 'El exceso de ADH inserta acuaporinas-2 de forma mantenida en la membrana luminal del colector, aumentando la reabsorción de agua libre de forma inapropiada y produciendo hiponatremia dilucional con orina inadecuadamente concentrada.',
    },
    'diabetes-insipida': {
        tipo: 'patologia',
        etiqueta: 'Diabetes insípida (central o nefrogénica)',
        segmentos: ['colector'],
        canales: ['Acuaporina-2'],
        explicacion: 'Ausencia de ADH (central) o resistencia a su acción (nefrogénica) impide la inserción de acuaporinas-2 en el colector: no se reabsorbe agua libre y se pierde orina muy diluida en grandes volúmenes, con riesgo de hipernatremia.',
    },
};
