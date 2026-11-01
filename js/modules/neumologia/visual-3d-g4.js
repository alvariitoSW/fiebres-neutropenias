// Vista Visual del bloque 3D, grupo G4 (oxígeno): fichas 7 (indicaciones y efectos) y 8 (sistemas), Marino cap. 25.
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`); las calculadoras de la
// ficha se conectan sin copiar su lógica. En las fichas con Estudiar, es el paso «Mira».

export const RECETAS_3D_G4 = {
    'neumo-o2-indicaciones': {
        guia: 'El umbral del oxígeno baja el contenido arterial solo un 8 %; los tejidos aguantan una PaO₂ de 22 con lactato normal; y más oxígeno no sube el consumo: vasoconstriñe.',
        paneles: [
            { tipo: 'calculadora', titulo: 'Contenido arterial de O₂ (calculadora de la ficha)', campos: ['#neumo-cao2-hb', '#neumo-cao2-sao2'], resultado: ['#neumo-cao2-resultado'] },
            { tipo: 'comparar', titulo: 'Dos umbrales, dos caídas del CaO₂', columnas: [
                { titulo: 'Umbral del O₂', color: 'verde', nodos: [{ fuente: '#nep-cao2', etiqueta: 'SaO₂ 0,98 → 0,90: 197 → 181 mL/L, −8 %' }] },
                { titulo: 'Umbral de la transfusión', color: 'rojo', nodos: [{ fuente: '#nep-cao2', etiqueta: 'Hb 15 → 7: 197 → 92 mL/L (el libro dice −64 %; la cuenta da −53 %)' }] }
            ] },
            { tipo: 'linea', titulo: 'SpO₂ objetivo con oxígeno', min: 80, max: 100, unidad: '%', ticks: [80, 88, 90, 92, 94, 100],
              bandas: [{ desde: 88, hasta: 92, texto: 'Retiene CO₂', color: 'amarillo' }],
              nodos: [
                { fuente: '#nep-objetivo-spo2', etiqueta: '88-92 si retiene CO₂', en: 90, color: 'amarillo', fila: 'abajo' },
                { fuente: '#nep-objetivo-spo2', etiqueta: '90-94 en el resto', en: 92, color: 'verde', fila: 'arriba' }
              ] },
            { tipo: 'barras', titulo: 'Tabla 25.1: PaO₂ de ocho pacientes con lactato ≤2 mmol/L', nota: 'Barra: PaO₂ (mmHg). El lactato de los ocho es 0,3-2,0 mmol/L.', tabla: '#nep-tabla-25-1',
              series: [{ col: 1, nombre: 'PaO₂ (mmHg)', color: 'rojo' }] },
            { tipo: 'barras', titulo: 'Fig. 25.2: la PaO₂ sube y el VO₂ no', nota: 'PaO₂ en mmHg y VO₂ en mL/min/m², con O₂ al 21, 24 y 28 %.', tabla: '#nep-fig-25-2',
              series: [{ col: 1, nombre: 'PaO₂', color: 'dorado' }, { col: 2, nombre: 'VO₂', color: 'verde' }] },
            { tipo: 'racimos', titulo: 'El oxígeno como vasoconstrictor', grupos: [
                { titulo: 'Vasoconstricción', color: 'rojo', nodos: [
                    { fuente: '#nep-vasoconstrictor', etiqueta: 'Coronarias: menos flujo en la enfermedad coronaria' },
                    { fuente: '#nep-vasoconstrictor', etiqueta: 'Sistémica: gasto cardíaco ↓, hipoperfusión' },
                    { fuente: '#nep-vasoconstrictor', etiqueta: 'Capilares del músculo: pueden obliterarse (animales)' }] },
                { titulo: 'Excepción', color: 'verde', nodos: [{ fuente: '#nep-vasoconstrictor', etiqueta: 'Pulmón: vasodilatador' }] }
            ] }
        ]
    },
    'neumo-o2-sistemas': {
        guia: 'La FiO₂ la decide el flujo inspiratorio del paciente más que el aparato; solo el alto flujo nasal cubre ese flujo con una FiO₂ conocida y con comodidad.',
        paneles: [
            { tipo: 'comparar', titulo: 'Flujo del paciente frente al flujo de O₂', columnas: [
                { titulo: 'Respiración tranquila', color: 'verde', nodos: [{ fuente: '#nep-flujo-fio2', etiqueta: 'Inspiratorio ≈15 L/min: un bajo flujo lo cubre' }] },
                { titulo: 'Insuficiencia aguda', color: 'rojo', nodos: [{ fuente: '#nep-flujo-fio2', etiqueta: 'Inspiratorio hasta 120 L/min: el sobrante arrastra aire y baja la FiO₂' }] }
            ] },
            { tipo: 'escalera', titulo: 'Tabla 25.2: de menos a más FiO₂', nodos: [
                { fuente: '#nep-tabla-25-2', etiqueta: 'Cánula nasal 1-6 L/min: 24-40 %' },
                { fuente: '#nep-tabla-25-2', etiqueta: 'Mascarilla estándar 5-10 L/min: 35-50 % (el texto dice hasta 60 %)' },
                { fuente: '#nep-tabla-25-2', etiqueta: 'Arrastre de aire 2-15 L/min: 24-50 %' },
                { fuente: '#nep-tabla-25-2', etiqueta: 'No reinhalación ≥10 L/min: 60-80 %, ya no se favorece' },
                { fuente: '#nep-tabla-25-2', etiqueta: 'OxyMask 1-≥15 L/min: 24-90 %' },
                { fuente: '#nep-tabla-25-2', etiqueta: 'Alto flujo nasal 1-60 L/min: 24-100 %, el más eficaz' }
            ] },
            { tipo: 'calculadora', titulo: '¿Qué sistema según la FiO₂ objetivo? (calculadora de la ficha)', campos: ['#neumo-o2-fio2-objetivo'], resultado: ['#neumo-o2-sistema-resultado'] },
            { tipo: 'racimos', titulo: 'Qué hace cada dispositivo', grupos: [
                { titulo: 'Bajo flujo', color: 'gris', nodos: [
                    { fuente: '#nep-canula', etiqueta: 'Cánula: permite comer y hablar; humidificar >4 L/min' },
                    { fuente: '#nep-mascarilla', etiqueta: 'Mascarilla: mínimo 5 L/min para vaciar el gas exhalado' }] },
                { titulo: 'Alto flujo', color: 'dorado', nodos: [
                    { fuente: '#nep-reservorio', etiqueta: 'Reservorio: teórica 100 %, real ≈80 %' },
                    { fuente: '#nep-arrastre', etiqueta: 'Arrastre: FiO₂ constante; flujo total ≥60 L/min' },
                    { fuente: '#nep-oxymask', etiqueta: 'OxyMask: O₂ alto con flujo bajo; sin más ventajas que el alto flujo' }] }
            ] },
            { tipo: 'flujo', titulo: 'Alto flujo nasal: del mezclador al volumen espiratorio', nodos: [
                { fuente: '#nep-hfno-diseno', etiqueta: 'Mezclador: FiO₂ y flujo por separado', color: 'dorado' },
                { fuente: '#nep-hfno-diseno', etiqueta: 'Gas calentado y humidificado, 40-60 L/min', color: 'purpura' },
                { fuente: '#nep-hfno-diseno', etiqueta: 'Cánula estrecha: más velocidad', color: 'verde' },
                { fuente: '#nep-hfno-diseno', etiqueta: 'Lava el espacio muerto (≈30 % del Vt)', color: 'verde' },
                { fuente: '#nep-hfno-diseno', etiqueta: 'Sumidero: mantiene la FiO₂ si sobrerrespira', color: 'verde' },
                { fuente: '#nep-hfno-peep', etiqueta: 'PEEP 2-3 cmH₂O solo con la boca cerrada', color: 'amarillo' }
            ] },
            { tipo: 'racimos', titulo: 'Tabla 25.3: beneficios del alto flujo', grupos: [
                { titulo: 'Fisiológicos', color: 'verde', nodos: [
                    { fuente: '#nep-tabla-25-3', etiqueta: 'Menos espacio muerto y más volumen espiratorio final' },
                    { fuente: '#nep-tabla-25-3', etiqueta: 'Más distensibilidad; menos FR y trabajo' }] },
                { titulo: 'Clínicos', color: 'purpura', nodos: [
                    { fuente: '#nep-tabla-25-3', etiqueta: 'Respiración cómoda; menos riesgo de P-SILI' },
                    { fuente: '#nep-tabla-25-3', etiqueta: 'Permite comer; puede evitar la intubación' }] }
            ] }
        ]
    }
};
