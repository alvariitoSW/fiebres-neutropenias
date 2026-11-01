// Vista Visual del bloque 3D, grupo G1 (respirador): modos, ajuste y PEEP oculta (Marino, caps. 27-28).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`); las calculadoras de la
// ficha se conectan sin copiar su lógica. En las fichas con Estudiar, es el paso «Mira».
// Las figuras 27.1-27.5 y 28.9 son texto en la ficha (sin imagen): se ven vivas en el pulmón vivo.

export const RECETAS_3D_G1 = {
    'neumo-vm-modos': {
        guia: 'En volumen control mandas el volumen y lees la presión; en presión control, al revés. La presión que rompe el alvéolo es la meseta.',
        paneles: [
            { tipo: 'comparar', titulo: 'Volumen control | presión control', columnas: [
                { titulo: 'VCV', color: 'dorado', nodos: [{ fuente: '#nep-vcv', etiqueta: 'Preseleccionas el volumen; flujo constante; la presión sube' }] },
                { titulo: 'PCV', color: 'purpura', nodos: [{ fuente: '#nep-pcv', etiqueta: 'Preseleccionas la presión; flujo desacelerante; el volumen varía' }, { fuente: '#nep-pcv-pros', etiqueta: 'Ventajas y límites' }] },
                { titulo: 'PRVC', color: 'verde', nodos: [{ fuente: '#nep-prvc', etiqueta: 'Fija el volumen y limita la presión' }] }
            ] },
            { tipo: 'flujo', titulo: 'De la presión pico a la meseta', nodos: [
                { fuente: '#nep-ec-27-1', etiqueta: 'Pico = Pres + Pel (Ec. 27.1)', color: 'dorado' },
                { fuente: '#nep-fig-27-2', etiqueta: 'Pausa sin flujo: la presión que queda es la meseta', color: 'purpura' },
                { fuente: '#nep-fig-27-2', etiqueta: 'Pico − meseta = Pres (resistencia de la vía aérea)', color: 'verde' },
                { fuente: '#nep-riesgo-alveolar', etiqueta: 'Riesgo alveolar despreciable con meseta ≤30 cmH₂O', color: 'rojo' }
            ] },
            { tipo: 'calculadora', titulo: 'Compliance estática (calculadora de la ficha)', campos: ['#neumo-cstat-vt', '#neumo-cstat-presion', '#neumo-cstat-peep'], resultado: ['#neumo-cstat-resultado'] },
            { tipo: 'linea', titulo: 'Presión media de la vía aérea', min: 0, max: 30, unidad: 'cmH₂O', ticks: [0, 5, 10, 20, 30],
              bandas: [{ desde: 5, hasta: 10, texto: 'Pulmón normal', color: 'verde' }, { desde: 10, hasta: 20, texto: 'Obstrucción', color: 'amarillo' }, { desde: 20, hasta: 30, texto: 'Pulmón rígido', color: 'rojo', alinear: 'fin' }],
              nodos: [
                { fuente: '#nep-presion-media', etiqueta: '5-10', en: 7.5, color: 'verde', fila: 'abajo' },
                { fuente: '#nep-presion-media', etiqueta: '10-20', en: 15, color: 'amarillo', fila: 'abajo' },
                { fuente: '#nep-presion-media', etiqueta: '20-30', en: 25, color: 'rojo', fila: 'abajo' }
              ] }
        ]
    },
    'neumo-vm-ajuste': {
        guia: 'El respirador se ajusta en cinco mandos y una lista; la mejor PEEP recluta sin hundir el gasto cardíaco.',
        paneles: [
            { tipo: 'comparar', titulo: 'Cómo se dispara la respiración', columnas: [
                { titulo: 'Por presión', color: 'dorado', nodos: [{ fuente: '#nep-disparo-presion', etiqueta: 'Deflexión negativa de presión: esfuerzo del paciente' }] },
                { titulo: 'Por flujo', color: 'verde', nodos: [{ fuente: '#nep-disparo-flujo', etiqueta: 'Casi sin cambio de presión: menos trabajo; hoy es el estándar' }] }
            ] },
            { tipo: 'requisitos', modo: 'ninguno', sinPuerta: true, iconoMarcado: '☑', titulo: 'IMV: ¿buena idea en este paciente? (lista de la ficha)', items: [{ checks: '.neumo-imv-check' }], resultado: ['#neumo-imv-resultado'] },
            { tipo: 'flujo', titulo: 'Subir la PEEP: el reclutamiento y su precio', nodos: [
                { fuente: '#nep-mejor-peep', etiqueta: 'PEEP ↑: recluta, la compliance sube y la presión de conducción baja', color: 'verde' },
                { fuente: '#nep-mejor-peep', etiqueta: 'Más allá: sobredistiende, la compliance baja', color: 'amarillo' },
                { fuente: '#nep-peep-gc', etiqueta: 'El gasto cardíaco puede caer', color: 'rojo' },
                { fuente: '#nep-do2', etiqueta: 'DO₂ = GC × CaO₂ (Ec. 27.6)', color: 'dorado' }
            ] },
            { tipo: 'escalera', titulo: 'Tabla 27.1: ventilación protectora, por etapas', nodos: [
                { fuente: '#nep-tabla-27-1', etiqueta: '1.ª: Vt 8 mL/kg PBW, PEEP 5; bajar 1 mL/kg cada 2 h hasta 6' },
                { fuente: '#nep-tabla-27-1', etiqueta: '2.ª: meseta >30 → bajar Vt 1 mL/kg hasta meseta <30 o Vt 4' },
                { fuente: '#nep-tabla-27-1', etiqueta: '3.ª: pH 7,15-7,30 → FR hasta 35; pH <7,15 → FR 35 y subir Vt' },
                { fuente: '#nep-tabla-27-1', etiqueta: 'Objetivos: SpO₂ 88-95 %, pH 7,30-7,45, FiO₂ ≤60 %' }
            ] },
            { tipo: 'racimos', titulo: 'Ajustes prácticos', grupos: [{ titulo: 'Flujo y PEEP oculta', color: 'gris', nodos: ['#nep-flujo-ie', '#nep-ajustes-oculta'] }] }
        ]
    },
    'neumo-peep-oculta': {
        guia: 'La PEEP oculta no se ve en el monitor: se ve el flujo que no llega a cero, se mide ocluyendo y se trata vaciando mejor.',
        paneles: [
            { tipo: 'comparar', titulo: 'Qué ve el monitor y qué hay dentro', columnas: [
                { titulo: 'Presión proximal', color: 'dorado', nodos: [{ fuente: '#nep-monitorizacion-oculta', etiqueta: 'Vuelve a 0 al final de la espiración' }] },
                { titulo: 'Presión alveolar', color: 'rojo', nodos: [{ fuente: '#nep-monitorizacion-oculta', etiqueta: 'Sigue positiva: la PEEP oculta' }] },
                { titulo: 'Flujo', color: 'purpura', nodos: [{ fuente: '#nep-fig-28-9', etiqueta: 'No llega a cero' }] }
            ] },
            { tipo: 'racimos', titulo: 'Qué le hace al paciente', grupos: [{ titulo: 'Cuatro efectos', color: 'rojo', nodos: [
                { fuente: '#nep-efectos', etiqueta: 'PVC espuria' },
                { fuente: '#nep-efectos', etiqueta: 'Gasto cardíaco ↓' },
                { fuente: '#nep-efectos', etiqueta: 'Trabajo respiratorio ↑' },
                { fuente: '#nep-efectos', etiqueta: 'Volutrauma y barotrauma' }] }] },
            { tipo: 'flujo', titulo: 'Ver, medir y tratar', nodos: [
                { fuente: '#nep-monitorizacion-oculta', etiqueta: 'Ver: el flujo espiratorio no llega a cero', color: 'amarillo' },
                { fuente: '#nep-oclusion', etiqueta: 'Medir: ocluir al final de la espiración', color: 'dorado' },
                { fuente: '#nep-manejo-oculta', etiqueta: 'Tratar: Vt ↓, flujo ↑, Ti ↓, FR ↓', color: 'verde' },
                { fuente: '#nep-peep-aplicada', etiqueta: 'PEEP aplicada justo por debajo de la oculta', color: 'purpura' }
            ] }
        ]
    }
};
