// Vista Visual del bloque 3D, G5d: ficha 19 neumo-derrame-antimicrobiano (Marino cap. 29, págs. 45-48 del PDF).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`); el clasificador de la
// ficha se conecta sin copiar su lógica. Sin modelo vivo: es el paso «Mira» del Estudiar.

export const RECETAS_3D_G5D = {
    'neumo-derrame-antimicrobiano': {
        guia: 'El derrame se clasifica en 4 categorías y de la 3 en adelante se drena con tubo fino; el antibiótico de la NAV lo deciden 5 factores, dura 7 días y se suspende si los cultivos son negativos.',
        paneles: [
            { tipo: 'escalera', titulo: 'Tabla 29.5: de menos a más grave', nodos: [
                { fuente: '#nep-derrame-cat1', etiqueta: '1: menos de 10 mm, libre; sin toracocentesis ni tubo' },
                { fuente: '#nep-derrame-cat2', etiqueta: '2: más de 10 mm, menos de la mitad del hemitórax; pH >7,20, glucosa >60; toracocentesis' },
                { fuente: '#nep-derrame-cat3', etiqueta: '3: loculado o más de la mitad; pH <7,20, glucosa <60, Gram o cultivo +; tubo' },
                { fuente: '#nep-derrame-cat4', etiqueta: '4: purulento; mismo análisis que la 3; tubo' }
            ] },
            { tipo: 'calculadora', titulo: 'Clasificador de derrame paraneumónico (calculadora de la ficha)',
              campos: ['#neumo-derrame-purulento', '#neumo-derrame-grosor', '#neumo-derrame-loculado', '#neumo-derrame-ph', '#neumo-derrame-glucosa', '#neumo-derrame-gram'],
              resultado: ['#neumo-derrame-resultado'] },
            { tipo: 'comparar', titulo: 'Tubo para el pus: fino frente a grueso', columnas: [
                { titulo: '8,5-14 Fr', color: 'verde', nodos: [{ fuente: '#nep-derrame-cat4', etiqueta: 'Calibre pequeño: drenaje equivalente' }] },
                { titulo: '28-36 Fr', color: 'dorado', nodos: [{ fuente: '#nep-derrame-cat4', etiqueta: 'Calibre grande: lo prefieren algunos, sin mejor drenaje' }] }
            ] },
            { tipo: 'racimos', titulo: 'Los 5 factores de riesgo de la NAV', grupos: [{ titulo: 'Con uno solo ya no es bajo riesgo', color: 'rojo', nodos: [
                { fuente: '#nep-atb-factores', etiqueta: 'NAV de inicio tardío' },
                { fuente: '#nep-atb-factores', etiqueta: 'Shock séptico' },
                { fuente: '#nep-atb-factores', etiqueta: 'MRSA o multirresistente previo' },
                { fuente: '#nep-atb-factores', etiqueta: 'Antibiograma con 25 % resistentes' },
                { fuente: '#nep-atb-factores', etiqueta: 'Antibióticos en los últimos 90 días' }] }] },
            { tipo: 'flujo', titulo: 'Tabla 29.6: del bajo al alto riesgo', nodos: [
                { fuente: '#nep-atb-bajo', etiqueta: 'Bajo riesgo: un agente (cefepima, levofloxacino o pip-tazo)', color: 'verde' },
                { fuente: '#nep-atb-alto', etiqueta: 'Alto riesgo, A: MRSA con vancomicina o linezolid', color: 'dorado' },
                { fuente: '#nep-atb-alto', etiqueta: 'Alto riesgo, B: β-lactámico antipseudomonal (pip-tazo, cefepima o meropenem)', color: 'purpura' },
                { fuente: '#nep-atb-tabla', etiqueta: 'C (levofloxacino o aminoglucósido): solo con riesgo alto de multirresistentes', color: 'rojo' }
            ] },
            { tipo: 'flujo', titulo: 'Del empírico al final', nodos: [
                { fuente: '#nep-atb-factores', etiqueta: 'Sospecha de NAV: empírico según los factores', color: 'dorado' },
                { fuente: '#nep-atb-cultivos', etiqueta: 'Cultivos negativos: suspender, aunque el paciente mejore', color: 'rojo' },
                { fuente: '#nep-atb-documentada', etiqueta: 'Patógeno aislado: lo dictan las sensibilidades', color: 'purpura' },
                { fuente: '#nep-atb-documentada', etiqueta: 'Duración recomendada: 7 días', color: 'verde' }
            ] },
            { tipo: 'linea', titulo: 'Días de antibiótico en la NAV documentada', min: 0, max: 10, unidad: 'días', ticks: [0, 7, 10],
              bandas: [{ desde: 0, hasta: 7, texto: 'Duración recomendada', color: 'verde' }],
              nodos: [{ fuente: '#nep-atb-documentada', etiqueta: '7 días', en: 7, color: 'verde', fila: 'abajo' }] },
            { tipo: 'racimos', titulo: 'La mortalidad de la NAV: tres explicaciones', grupos: [
                { titulo: 'Las que propone Marino', color: 'gris', nodos: [
                    { fuente: '#nep-atb-mortalidad', etiqueta: 'La tratamos muy bien' },
                    { fuente: '#nep-atb-mortalidad', etiqueta: 'No amenaza la vida' }] },
                { titulo: 'La que elige', color: 'purpura', nodos: [{ fuente: '#nep-atb-mortalidad', etiqueta: 'Está sobrediagnosticada' }] }
            ] }
        ]
    }
};
