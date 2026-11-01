// Vista Visual del bloque 3D, G3b: ficha 5 neumo-sdra-no-ventilatorio (Marino, cap. 24, págs. 39-45 del PDF).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`). En la ficha con Estudiar es el paso «Mira».
// La Figura 24.5 no tiene tabla en la ficha: sus cifras (22, 42 y 47 %) se dibujan en una línea con los valores del texto.
export const RECETAS_3D_G3B = {
    'neumo-sdra-no-ventilatorio': {
        guia: 'Casi ningún fármaco salvó el SDRA: se protege el pulmón del propio esfuerzo, se evita el exceso de fluidos, se usa esteroide en el moderado-grave y se gira al paciente.',
        paneles: [
            { tipo: 'racimos', titulo: 'Terapias que fracasaron', grupos: [{ titulo: 'Sin beneficio de supervivencia', color: 'rojo', nodos: [
                { fuente: '#nep-terapias-fracasadas', etiqueta: 'Surfactante (adultos) y óxido nítrico inhalado' },
                { fuente: '#nep-terapias-fracasadas', etiqueta: 'Prostaciclinas inhaladas y estatinas' },
                { fuente: '#nep-terapias-fracasadas', etiqueta: 'Bloqueantes neuromusculares y β-agonistas' },
                { fuente: '#nep-terapias-fracasadas', etiqueta: 'Interferón β-1a y G-CSF' }] }] },
            { tipo: 'flujo', titulo: 'P-SILI: cómo el esfuerzo lesiona el pulmón (Figura 24.4)', nodos: [
                { fuente: '#nep-psili', etiqueta: 'Esfuerzo vigoroso: presión intratorácica muy negativa', color: 'dorado' },
                { fuente: '#nep-fig-24-4', etiqueta: 'Sube la presión transmural: el fluido sale de los capilares', color: 'rojo' },
                { fuente: '#nep-fig-24-4', etiqueta: 'Edema por presión negativa, amplificado por la permeabilidad del SDRA', color: 'purpura' },
                { fuente: '#nep-fig-24-4', etiqueta: 'Además el Vt sube y sobredistiende alvéolos sanos: volutrauma', color: 'rojo' }] },
            { tipo: 'linea', titulo: 'Figura 24.5: fracaso de la VNI según la gravedad (%)', min: 0, max: 60, unidad: '%', ticks: [0, 10, 20, 30, 40, 50, 60],
              bandas: [{ desde: 0, hasta: 30, texto: 'Leve', color: 'verde' }, { desde: 30, hasta: 60, texto: 'Moderado y grave', color: 'rojo', alinear: 'fin' }],
              nodos: [
                { fuente: '#nep-fig-24-5', etiqueta: 'Leve 22', en: 22, color: 'verde', fila: 'abajo' },
                { fuente: '#nep-fig-24-5', etiqueta: 'Mod. 42', en: 42, color: 'amarillo', fila: 'abajo' },
                { fuente: '#nep-fig-24-5', etiqueta: 'Grave 47', en: 47, color: 'rojo', fila: 'abajo' }] },
            { tipo: 'comparar', titulo: 'Alto flujo y VNI', columnas: [
                { titulo: 'HFNO', color: 'verde', nodos: [{ fuente: '#nep-hfno-sdra', etiqueta: '40-60 L/min, FiO₂ independiente; confort; menos intubaciones sin cambio en mortalidad' }, { fuente: '#nep-toxicidad-aviso', etiqueta: 'Cuidado: FiO₂ ≥70 % prolongada es tóxica' }] },
                { titulo: 'VNI', color: 'dorado', nodos: [{ fuente: '#nep-vni-sdra', etiqueta: 'Mejor en el SDRA leve; si el P/F no sube a la hora, intubar' }, { fuente: '#nep-fig-24-5', etiqueta: 'Mortalidad 16 % si acierta, 45 % si fracasa' }] }
            ] },
            { tipo: 'racimos', titulo: 'Fluidos', grupos: [{ titulo: 'Evitar los dos extremos', color: 'gris', nodos: [
                { fuente: '#nep-fluidos-sdra', etiqueta: 'Balance positivo: edema y más días de ventilación' },
                { fuente: '#nep-fluidos-sdra', etiqueta: 'Déficit de volumen: cae el gasto cardíaco con presión positiva' }] }] },
            { tipo: 'escalera', titulo: 'Tabla 24.3: corticoides en el SDRA', nodos: [
                { fuente: '#nep-tabla-24-3', etiqueta: 'COVID-19: dexametasona 6 mg al día, hasta 10 días' },
                { fuente: '#nep-tabla-24-3', etiqueta: 'Moderado-grave, primeras 72 h: metilprednisolona 1 mg/kg/día de peso ideal' },
                { fuente: '#nep-tabla-24-3', etiqueta: 'Moderado-grave que persiste 7-14 días: 2 mg/kg/día' },
                { fuente: '#nep-corticoides-sdra', etiqueta: 'Recomendación débil; 14 días con descenso lento' }] },
            { tipo: 'comparar', titulo: 'Tabla 24.4: prono', columnas: [
                { titulo: 'Indicaciones', color: 'verde', nodos: [{ fuente: '#nep-tabla-24-4', etiqueta: 'Espontáneo con HFNO o VNI: evitar intubar' }, { fuente: '#nep-prono-cuando', etiqueta: 'Ventilado, P/F <150 y Vt ~6: supervivencia' }] },
                { titulo: 'Absolutas', color: 'rojo', nodos: [{ fuente: '#nep-tabla-24-4', etiqueta: 'Hemorragia activa, inestabilidad espinal, fracturas múltiples, PIC alta, traqueostomía o esternotomía reciente' }] }
            ] },
            { tipo: 'linea', titulo: 'Prono: cuánto y cuándo reevaluar', min: 0, max: 16, unidad: 'h', ticks: [0, 4, 8, 12, 16],
              nodos: [
                { fuente: '#nep-prono-como', etiqueta: '8 h (espontáneo)', en: 8, color: 'dorado', fila: 'abajo' },
                { fuente: '#nep-prono-como', etiqueta: '16 h (ventilado)', en: 16, color: 'verde', fila: 'abajo' },
                { fuente: '#nep-prono-como', etiqueta: '4 h después', en: 4, color: 'purpura', fila: 'abajo' }] }
        ]
    }
};
