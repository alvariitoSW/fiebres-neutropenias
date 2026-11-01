// Vista Visual del bloque 3D, G5b: fichas 20 neumo-sbt y 21 neumo-weaning-extubacion (Marino, cap. 30, págs. 50-61 del PDF).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`). Las Figuras 30.1, 30.2, 30.4 y 30.5 no
// son imágenes de la ficha (el texto da sus cifras): se ven como líneas y comparaciones con esas cifras. Las calculadoras son las de la
// ficha. En las fichas con Estudiar, es el paso «Mira».

export const RECETAS_3D_G5B = {
    'neumo-sbt': {
        guia: 'El diafragma se debilita si no dispara; la prueba se hace cuando cumple la lista, se juzga por Vt, FR y su cociente, y respirar rápido solo es fracaso si el Vt baja.',
        paneles: [
            { tipo: 'comparar', titulo: 'Fig. 30.1: ventilación controlada | asistida', columnas: [
                { titulo: 'Controlada 3 días', color: 'rojo', nodos: [{ fuente: '#nep-sbt-disparadas', etiqueta: 'Fuerza del diafragma ≈50 % menor que respirando solo' }] },
                { titulo: 'Asistida (el paciente dispara)', color: 'verde', nodos: [{ fuente: '#nep-sbt-disparadas', etiqueta: 'Algo por debajo de la espontánea: protege el diafragma' }] }
            ] },
            { tipo: 'requisitos', modo: 'todos', titulo: 'Disposición: ¿cumple los cinco? (lista de la ficha)', puerta: 'Los 5 criterios', items: [{ checks: '.neumo-sbt-check' }], resultado: ['#neumo-sbt-resultado'] },
            { tipo: 'calculadora', titulo: 'Predictores de éxito durante la prueba (calculadora de la ficha)', campos: ['#neumo-sbt-vt', '#neumo-sbt-pbw', '#neumo-sbt-rr', '#neumo-sbt-pimax'], resultado: ['#neumo-sbt-predictores-resultado'] },
            { tipo: 'comparar', titulo: 'Con el ventilador (PS 5) | tubo en T', columnas: [
                { titulo: 'Conectado al ventilador', color: 'verde', nodos: [
                    { fuente: '#nep-sbt-circuito', etiqueta: 'Se ven Vt y FR; PS 5 vence la resistencia del circuito' },
                    { fuente: '#nep-sbt-circuito', etiqueta: 'La PS 5 no reduce de forma significativa el trabajo' }] },
                { titulo: 'Tubo en T', color: 'dorado', nodos: [
                    { fuente: '#nep-sbt-tpiece', etiqueta: 'O₂ de pared a flujo mayor que el inspiratorio' },
                    { fuente: '#nep-sbt-tpiece', etiqueta: 'No se pueden monitorizar FR ni Vt' }] }
            ] },
            { tipo: 'linea', titulo: 'Fig. 30.2: trabajo respiratorio (J/L)', nota: 'Valores aproximados leídos en la figura de Marino.', min: 0, max: 100, ticks: [0, 40, 50, 90, 100], unidad: 'J/L', nodos: [
                { fuente: '#nep-sbt-fig-30-2', etiqueta: 'Con PS 5: ≈40', en: 40, fila: 'abajo', color: 'verde' },
                { fuente: '#nep-sbt-fig-30-2', etiqueta: 'Sin PS: ≈50', en: 50, color: 'amarillo' },
                { fuente: '#nep-sbt-fig-30-2', etiqueta: '1 h tras extubar: ≈90', en: 90, color: 'rojo' }
            ] },
            { tipo: 'comparar', titulo: 'Respirar rápido: ansiedad | fracaso', columnas: [
                { titulo: 'Ansiedad', color: 'verde', nodos: [{ fuente: '#nep-sbt-rapida', etiqueta: 'FR ↑ y Vt ↑ (hiperventilación): un opiáceo' }] },
                { titulo: 'Fracaso ventilatorio', color: 'rojo', nodos: [{ fuente: '#nep-sbt-rapida', etiqueta: 'FR ↑ y Vt ↓ (rápido y superficial): al ventilador' }] }
            ] },
            { tipo: 'racimos', titulo: 'Qué hacer antes y durante', grupos: [
                { titulo: 'Sedación', color: 'dorado', nodos: [
                    { fuente: '#nep-sbt-sedacion', etiqueta: 'Ligera, vacaciones diarias, evitar benzodiacepinas' }] },
                { titulo: 'Juicio de la prueba', color: 'purpura', nodos: [
                    { fuente: '#nep-sbt-exito', etiqueta: 'Distrés, debilidad, gases y perfusión (ScvO₂)' },
                    { fuente: '#nep-sbt-tiempo', etiqueta: '2 h toleradas: ≈80 % se retiran' }] },
                { titulo: 'Daño de respirar rápido', color: 'rojo', nodos: [
                    { fuente: '#nep-sbt-dano', etiqueta: 'EPOC: hiperinflación y PEEP intrínseca; SDRA: colapso; más VO₂' }] }
            ] }
        ]
    },
    'neumo-weaning-extubacion': {
        guia: 'El corazón causa el 40 % de los destetes fallidos y la ScvO₂ lo delata; no se extuba para descansar; y una fuga del manguito <110 mL pide esteroides desde 12 h antes y VNI al extubar.',
        paneles: [
            { tipo: 'flujo', titulo: 'Disfunción cardíaca en el destete (40 % de los fallos)', nodos: [
                { fuente: '#nep-ext-cardiaca', etiqueta: 'Presión intratorácica negativa: sube la poscarga del VI', color: 'rojo' },
                { fuente: '#nep-ext-cardiaca', etiqueta: 'PEEP oculta: baja el retorno; menos distensibilidad', color: 'amarillo' },
                { fuente: '#nep-ext-cardiaca', etiqueta: 'Isquemia silente', color: 'purpura' },
                { fuente: '#nep-ext-cardiaca-efectos', etiqueta: 'Congestión pulmonar y diafragma más débil (extrae el O₂ al máximo)', color: 'dorado' }
            ] },
            { tipo: 'linea', titulo: 'Fig. 30.4: saturación venosa mixta en la prueba (%)', nota: 'Valores aproximados leídos en la figura de Marino.', min: 40, max: 80, ticks: [40, 50, 60, 70, 80], unidad: '%', nodos: [
                { fuente: '#nep-ext-scvo2', etiqueta: 'Fallida: cae a ≈51', en: 51, fila: 'abajo', color: 'rojo' },
                { fuente: '#nep-ext-scvo2', etiqueta: 'Fallida: empieza en ≈61', en: 61, color: 'amarillo' },
                { fuente: '#nep-ext-scvo2', etiqueta: 'Exitosa: estable ≈65-66', en: 66, fila: 'abajo', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Qué hacer con el corazón y con la debilidad', grupos: [
                { titulo: 'Corazón', color: 'dorado', nodos: [
                    { fuente: '#nep-ext-manejo-cardiaco', etiqueta: 'CPAP, diuresis (VI agrandado o edema), nitroglicerina IV si hay hipertensión' }] },
                { titulo: 'Debilidad', color: 'purpura', nodos: [
                    { fuente: '#nep-ext-debilidad', etiqueta: 'Ventilación controlada, neuromiopatía (sin tratamiento), Mg y P bajos' },
                    { fuente: '#nep-ext-eco-diafragma', etiqueta: 'Eco del diafragma: sin referencias, impacto no claro' }] }
            ] },
            { tipo: 'linea', titulo: 'PImax (cmH₂O)', nota: 'Cifras de la ficha: normales y umbral.', min: -130, max: 0, ticks: [-120, -84, -30, -20, 0], unidad: 'cmH₂O', nodos: [
                { fuente: '#nep-ext-pimax', etiqueta: 'Varones: −120', en: -120, color: 'verde' },
                { fuente: '#nep-ext-pimax', etiqueta: 'Mujeres: −84', en: -84, fila: 'abajo', color: 'verde' },
                { fuente: '#nep-ext-pimax', etiqueta: 'Amenaza: −30', en: -30, color: 'amarillo' },
                { fuente: '#nep-ext-pimax', etiqueta: 'Amenaza: −20', en: -20, fila: 'abajo', color: 'rojo' }
            ] },
            { tipo: 'flujo', titulo: 'Antes de extubar: la prueba de fuga', nodos: [
                { fuente: '#nep-ext-extubacion', etiqueta: 'Nunca para reducir el trabajo respiratorio: puede subir tras extubar', color: 'rojo' },
                { fuente: '#nep-ext-reflejos', etiqueta: 'Tos con papel a 1-2 cm; reflejos débiles marcan riesgo, no impiden', color: 'amarillo' },
                { fuente: '#nep-cuff-recomendacion', etiqueta: 'Fuga >110 mL: ≈95 % sin edema, extubar', color: 'verde' },
                { fuente: '#nep-cuff-recomendacion', etiqueta: 'Fuga <110 mL: riesgo ×7; esteroide antes y VNI inmediata', color: 'purpura' }
            ] },
            { tipo: 'calculadora', titulo: 'Prueba de fuga del manguito (calculadora de la ficha)', campos: ['#neumo-fuga-volumen'], resultado: ['#neumo-fuga-resultado'] },
            { tipo: 'linea', titulo: 'Fig. 30.5: esteroide frente a placebo (%)', nota: 'Cifras de la ficha: edema laríngeo y reintubación.', min: 0, max: 25, ticks: [0, 5, 10, 15, 20, 25], unidad: '%', nodos: [
                { fuente: '#nep-cuff-esteroides', etiqueta: 'Edema: 22 → 3', en: 22, color: 'rojo' },
                { fuente: '#nep-cuff-esteroides', etiqueta: 'Edema con esteroide: 3', en: 3, fila: 'abajo', color: 'verde' },
                { fuente: '#nep-cuff-esteroides', etiqueta: 'Reintubación: 8 → 4', en: 8, color: 'amarillo' },
                { fuente: '#nep-cuff-esteroides', etiqueta: 'Reintubación con esteroide: 4', en: 4, fila: 'abajo', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Después de extubar', grupos: [
                { titulo: 'VNI', color: 'verde', nodos: [{ fuente: '#nep-ext-vni', etiqueta: 'Inmediata en alto riesgo; con el fallo ya establecido, no' }] },
                { titulo: 'Estridor', color: 'rojo', nodos: [
                    { fuente: '#nep-cuff-estridor', etiqueta: 'Aparece con ≈50 % de obstrucción; predomina al inspirar' },
                    { fuente: '#nep-cuff-manejo', etiqueta: 'A los 30 min (hasta 2 h); fallo inminente: reintubar ya' }] },
                { titulo: 'Evitar retrasos', color: 'gris', nodos: [{ fuente: '#nep-ext-retrasos', etiqueta: 'Sedación ligera, fisioterapia, nutrición, mirar el corazón' }] }
            ] }
        ]
    }
};
