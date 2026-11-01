// Vista Visual del bloque 3D, G5c: fichas 17 (NAV: prevención) y 18 (NAV: diagnóstico), Marino cap. 29.
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`). En estas fichas no hay modelo
// vivo: la Mira es el trabajo visual. Las Figs. 29.3 y 29.4 son imágenes reales de la ficha; las 29.2 y 29.5 son
// diagramas de dispositivo y no están en la ficha como imagen.

const LAMINAS = { tipo: 'figuras', titulo: 'Las láminas del libro', nota: 'Desliza para verlas; tócalas para ampliarlas.', todas: true };

export const RECETAS_3D_G5C = {
    'neumo-nav-prevencion': {
        guia: 'La NAV nace de lo que se aspira desde la boca: la clorhexidina se asocia a más mortalidad, la SOD baja la neumonía del 31 al 10 % y el paquete reúne cinco prácticas.',
        paneles: [
            { tipo: 'linea', titulo: 'Cuándo empieza y cómo se llama la NAV', min: 0, max: 10, unidad: 'días tras intubar', ticks: [0, 2, 4, 5, 10],
              bandas: [{ desde: 2, hasta: 5, texto: 'Precoz', color: 'amarillo' }, { desde: 5, hasta: 10, texto: 'Tardía', color: 'rojo', alinear: 'fin' }],
              nodos: [
                { fuente: '#nep-definiciones-nav', etiqueta: '≥48 h: empieza la NAV', en: 2, color: 'dorado', fila: 'abajo' },
                { fuente: '#nep-definiciones-nav', etiqueta: '2-4 días: precoz', en: 3.5, color: 'amarillo', fila: 'arriba' },
                { fuente: '#nep-definiciones-nav', etiqueta: '≥5 días: tardía', en: 5, color: 'rojo', fila: 'abajo' },
                { fuente: '#nep-nav-proporcion', etiqueta: '80 % de las neumonías de UCI; 60 % de las NAV, tardías', en: 8, color: 'purpura', fila: 'arriba' }
              ] },
            { tipo: 'barras', titulo: 'Tabla 29.1: aislados en la neumonía de UCI (%)', tabla: '#nep-tabla-29-1',
              series: [{ col: 1, nombre: 'NAV precoz', color: 'amarillo' }, { col: 2, nombre: 'NAV tardía', color: 'rojo' }, { col: 3, nombre: 'HAP', color: 'gris' }] },
            { tipo: 'comparar', titulo: 'Descontaminar la boca: clorhexidina | SOD', columnas: [
                { titulo: 'Clorhexidina', color: 'rojo', nodos: [{ fuente: '#nep-clorhexidina', etiqueta: '0,12 % cada 6 h; se asocia a más mortalidad por mucositis; ya no se recomienda' }] },
                { titulo: 'SOD', color: 'verde', nodos: [
                    { fuente: '#nep-sod-oral', etiqueta: 'Antibióticos no absorbibles; respeta la flora normal; método preferido' },
                    { fuente: '#nep-nav-sod-impopular', etiqueta: 'Impopular en EE. UU. por un miedo infundado a las resistencias' }] }
            ] },
            { tipo: 'barras', titulo: 'Fig. 29.1: efecto de la SOD en ventilados (%)', nota: 'Datos reales de la fuente; en ambos desenlaces p ≤0,01.', tabla: '#nep-fig-29-1',
              series: [{ col: 1, nombre: 'Control', color: 'gris' }, { col: 2, nombre: 'SOD', color: 'verde' }] },
            { tipo: 'racimos', titulo: 'Tabla 29.2: el paquete del ventilador', grupos: [
                { titulo: 'Las cinco prácticas', color: 'dorado', tabla: '#nep-tabla-29-2' },
                { titulo: 'Qué dice el texto', color: 'purpura', nodos: [{ fuente: '#nep-paquete', etiqueta: 'Algunas no tocan la neumonía, pero juntas reducen la NAV' }] }
            ] },
            { tipo: 'racimos', titulo: 'La cabecera y la vía aérea', grupos: [
                { titulo: 'Cabecera', color: 'amarillo', nodos: [
                    { fuente: '#nep-semirreclinada', etiqueta: '30-45°: menos reflujo y aspiración gástrica; los estudios discrepan' },
                    { fuente: '#nep-nav-comentario-cabecera', etiqueta: 'Duda del autor: podría mover secreciones de la boca; nunca estudiado' }] },
                { titulo: 'Vía aérea', color: 'verde', nodos: [
                    { fuente: '#nep-cuidado-via-aerea-nav', etiqueta: 'Aspirar solo si hay secreciones molestas, no por rutina' },
                    { fuente: '#nep-subglotica', etiqueta: 'Puerto sobre el manguito; aspiración continua ≤ −20 cmH₂O; menos NAV' }] }
            ] }
        ]
    },
    'neumo-nav-diagnostico': {
        guia: 'La clínica no diagnostica la NAV; el Gram dice si la muestra sirve y el cultivo cuantitativo del BAL, con umbral 10⁴, es el más fiable, todo antes del antibiótico.',
        paneles: [
            { tipo: 'linea', titulo: 'Razón de probabilidades diagnóstica: la clínica frente a la línea del 10', min: 0, max: 12, unidad: 'razón de probabilidades', ticks: [0, 2, 4, 6, 8, 10, 12],
              bandas: [{ desde: 10, hasta: 12, texto: 'Prueba fiable ≥10', color: 'verde', alinear: 'fin' }],
              nodos: [
                { fuente: '#nep-tabla-29-3', etiqueta: 'Los cuatro criterios clínicos: 2,1 a 2,8', en: 2.5, color: 'rojo', fila: 'abajo' },
                { fuente: '#nep-nav-criterios-clinicos', etiqueta: 'El diagnóstico no es posible solo con la clínica', en: 6, color: 'amarillo', fila: 'arriba' },
                { fuente: '#nep-tabla-29-3', etiqueta: 'Una prueba fiable llega a 10', en: 10, color: 'verde', fila: 'abajo' }
              ] },
            { tipo: 'barras', titulo: 'Tabla 29.3: sensibilidad y especificidad de cada criterio (%)', tabla: '#nep-tabla-29-3',
              series: [{ col: 1, nombre: 'Sensibilidad', color: 'dorado' }, { col: 2, nombre: 'Especificidad', color: 'rojo' }] },
            LAMINAS,
            { tipo: 'comparar', titulo: 'Cultivo del aspirado: cualitativo | cuantitativo', columnas: [
                { titulo: 'Cualitativo', color: 'amarillo', nodos: [{ fuente: '#nep-cualitativos', etiqueta: 'Sensibilidad >90 %, especificidad 15-40 %: el negativo excluye; el positivo no sirve' }] },
                { titulo: 'Cuantitativo', color: 'verde', nodos: [{ fuente: '#nep-cuantitativos', etiqueta: 'Umbral 10⁵ UFC/mL; sensibilidad 76 %, especificidad 68 %: más fiable' }] }
            ] },
            { tipo: 'escalera', titulo: 'Umbral de cada cultivo cuantitativo (Tabla 29.4)', nodos: [
                { fuente: '#nep-cuantitativos', etiqueta: 'Aspirado traqueal: 10⁵ UFC/mL · razón 6,6' },
                { fuente: '#nep-psb', etiqueta: 'Cepillo protegido: 10³ UFC/mL · razón 5,1' },
                { fuente: '#nep-bal-cuantitativo', etiqueta: 'BAL: 10⁴ UFC/mL · razón 9,6, el más fiable' }
            ] },
            { tipo: 'selector', titulo: '¿Qué método de cultivo? (selector de la ficha)', control: '#neumo-cultivo-select', forma: 'chips', color: 'dorado', resultado: ['#neumo-cultivo-resultado'] },
            { tipo: 'flujo', titulo: 'Cómo se hace el BAL', nodos: [
                { fuente: '#nep-bal', etiqueta: '6 lavados de 20 mL (mínimo 120 mL)', color: 'dorado' },
                { fuente: '#nep-bal', etiqueta: 'Se descarta el primero; vuelve el 25 % o menos', color: 'amarillo' },
                { fuente: '#nep-bal', etiqueta: 'El resto va a microscopía y cultivo cuantitativo', color: 'verde' },
                { fuente: '#nep-intracelulares', etiqueta: 'Intracelulares >3 % de las células: neumonía en >90 %', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Sin broncoscopio y con cepillo', grupos: [
                { titulo: 'Mini-BAL', color: 'verde', nodos: [{ fuente: '#nep-mini-bal', etiqueta: 'Catéter de 50 cm a ciegas, 10-20 mL; rendimiento equivalente al BAL' }] },
                { titulo: 'Cepillo protegido', color: 'dorado', nodos: [{ fuente: '#nep-psb', etiqueta: 'Umbral 10³; menos fiable que el BAL, más específico que el aspirado' }] }
            ] },
            { tipo: 'comparar', titulo: 'Qué método prefieren las guías', columnas: [
                { titulo: 'Internacionales', color: 'verde', nodos: [{ fuente: '#nep-metodo-preferido-nav', etiqueta: 'Cuantitativos con BAL, mini-BAL o PSB, antes del antibiótico' }] },
                { titulo: 'EE. UU.', color: 'amarillo', nodos: [{ fuente: '#nep-metodo-preferido-nav', etiqueta: 'Cultivos traqueales rutinarios: lo invasivo no mejora los resultados' }] },
                { titulo: 'El autor', color: 'purpura', nodos: [{ fuente: '#nep-nav-autor-prefiere', etiqueta: 'Mejor rendimiento (BAL); el mini-BAL evita el coste de la broncoscopia' }] }
            ] }
        ]
    }
};
