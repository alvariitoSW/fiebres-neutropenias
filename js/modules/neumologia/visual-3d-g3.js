// Vista Visual del bloque 3D, grupo G3 (SDRA): diagnóstico y ventilación (Marino cap. 24, págs. 32-52).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`); las calculadoras y la lista de
// la ficha se conectan sin copiar su lógica. En las fichas con Estudiar, es el paso «Mira».

export const RECETAS_3D_G3 = {
    'neumo-sdra-diagnostico': {
        guia: 'El SDRA es una inflamación por neutrófilos: se diagnostica con cinco criterios a la vez y se gradúa por el cociente PaO₂/FiO₂; la placa y la wedge no bastan.',
        paneles: [
            { tipo: 'flujo', titulo: 'Cómo se forma la consolidación', nodos: [
                { fuente: '#nep-patogenesis', etiqueta: 'El neutrófilo circulante se activa y se adhiere al endotelio', color: 'dorado' },
                { fuente: '#nep-patogenesis', etiqueta: 'Migra y se desgranula: enzimas y oxígeno tóxico', color: 'amarillo' },
                { fuente: '#nep-fig-24-1', etiqueta: 'La pared capilar dañada exuda y llena los espacios aéreos', color: 'rojo' },
                { fuente: '#nep-patogenesis', etiqueta: 'La fibrina, si no se resuelve en semanas, deja fibrosis', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Condiciones predisponentes (Tabla 24.1)', grupos: [
                { titulo: 'Infecciosas', color: 'rojo', nodos: [{ fuente: '#nep-tabla-24-1', etiqueta: 'Neumonía 60 %' }, { fuente: '#nep-tabla-24-1', etiqueta: 'Sepsis extrapulmonar 16 %' }, { fuente: '#nep-tabla-24-1', etiqueta: 'Shock séptico 8 %' }] },
                { titulo: 'No infecciosas', color: 'amarillo', nodos: [{ fuente: '#nep-tabla-24-1', etiqueta: 'Aspiración gástrica 14 %' }, { fuente: '#nep-tabla-24-1', etiqueta: 'Contusión pulmonar 6 %' }, { fuente: '#nep-predisponentes', etiqueta: 'Sin fuente: cerca del 10 %' }] }
            ] },
            { tipo: 'requisitos', modo: 'todos', titulo: 'Tabla 24.2: ¿cumple los cinco criterios? (lista de la ficha)', puerta: 'Los 5 criterios', items: [{ checks: '.neumo-sdra-criterio-check' }], resultado: ['#neumo-sdra-criterio-resultado'] },
            { tipo: 'escalera', titulo: 'Gravedad por PaO₂/FiO₂', nodos: [
                { fuente: '#nep-gravedad', etiqueta: 'Leve: 201-300 mmHg (mortalidad ≈35 %)' },
                { fuente: '#nep-gravedad', etiqueta: 'Moderado: 100-200 mmHg (≈40 %)' },
                { fuente: '#nep-gravedad', etiqueta: 'Grave: <100 mmHg (≈45 %)' }
            ] },
            { tipo: 'calculadora', titulo: 'Clasificador de gravedad (calculadora de la ficha)', campos: ['#neumo-sdra-pao2fio2'], resultado: ['#neumo-sdra-severidad-resultado'] },
            { tipo: 'comparar', titulo: 'Qué falla al diagnosticar', columnas: [
                { titulo: 'Radiografía', color: 'amarillo', nodos: [{ fuente: '#nep-rx', etiqueta: 'Clásica en solo el 15-25 %; valor predictivo negativo del 47 %' }] },
                { titulo: 'Wedge', color: 'rojo', nodos: [{ fuente: '#nep-wedge', etiqueta: 'No mide la presión capilar: una wedge normal no excluye lo cardiogénico' }] },
                { titulo: 'TC', color: 'verde', nodos: [{ fuente: '#nep-tc', etiqueta: 'La más fiable: consolidación posterior al inicio, fibrosis reticular después' }] }
            ] }
        ]
    },
    'neumo-sdra-ventilacion': {
        guia: 'El respirador lesiona por volumen, no por presión: 6 mL/kg de peso predicho y meseta ≤30 son la estrategia con beneficio de supervivencia, y la mortalidad la marcan los otros órganos.',
        paneles: [
            { tipo: 'comparar', titulo: 'Tres formas de lesión por el respirador', columnas: [
                { titulo: 'Volutrauma', color: 'rojo', nodos: [{ fuente: '#nep-volutrauma', etiqueta: 'Volumen alto en un pulmón al 50 %: rotura de la interfaz' }] },
                { titulo: 'Atelectrauma', color: 'amarillo', nodos: [{ fuente: '#nep-atelectrauma', etiqueta: 'Abrir y cerrar vías pequeñas: cizalla; la PEEP lo evita' }] },
                { titulo: 'Biotrauma', color: 'purpura', nodos: [{ fuente: '#nep-biotrauma', etiqueta: 'Citocinas a la sangre sin daño estructural: fallo multiorgánico' }] }
            ] },
            { tipo: 'comparar', titulo: 'Volumen tidal: tradicional frente a normal', columnas: [
                { titulo: 'Tradicional', color: 'rojo', nodos: [{ fuente: '#nep-vt-tradicional', etiqueta: '12-15 mL/kg: el doble de lo normal' }] },
                { titulo: 'Normal', color: 'verde', nodos: [{ fuente: '#nep-vt-tradicional', etiqueta: '6-7 mL/kg' }] }
            ] },
            { tipo: 'calculadora', titulo: 'Peso predicho y volumen objetivo (calculadora de la ficha)', campos: ['#neumo-pbw-altura', '#neumo-pbw-sexo'], resultado: ['#neumo-pbw-resultado'] },
            { tipo: 'escalera', titulo: 'Tabla 24.5: ventilación protectora, por etapas', nodos: [
                { fuente: '#nep-tabla-24-5', etiqueta: '1.ª: Vt 8 mL/kg PBW, PEEP 5; bajar 1 mL/kg cada 2 h hasta 6' },
                { fuente: '#nep-tabla-24-5', etiqueta: '2.ª: meseta >30 → bajar Vt 1 mL/kg hasta meseta <30 o Vt 4' },
                { fuente: '#nep-tabla-24-5', etiqueta: '3.ª: pH 7,15-7,30 → FR hasta 35; pH <7,15 → FR 35 y después Vt' },
                { fuente: '#nep-tabla-24-5', etiqueta: 'Objetivos: Vt 6, meseta ≤30, SpO₂ 88-95 %, pH 7,30-7,45' }
            ] },
            { tipo: 'linea', titulo: 'Hipercapnia permisiva: PaCO₂ tolerada', min: 40, max: 80, unidad: 'mmHg', ticks: [40, 50, 60, 70, 80],
              bandas: [{ desde: 60, hasta: 70, texto: 'Seguro: pH 7,2-7,25', color: 'amarillo' }],
              nodos: [{ fuente: '#nep-hipercapnia', etiqueta: '60-70', en: 65, color: 'amarillo', fila: 'abajo' }] },
            { tipo: 'barras', titulo: 'Fig. 24.8: mortalidad según los órganos extrapulmonares fallados (%)', tabla: '#nep-fig-24-8',
              series: [{ col: 1, nombre: 'Mortalidad', color: 'rojo' }] },
            { tipo: 'racimos', titulo: 'Otras opciones', grupos: [
                { titulo: 'APRV y ECMO', color: 'gris', nodos: ['#nep-aprv', '#nep-ecmo'] }] }
        ]
    }
};
