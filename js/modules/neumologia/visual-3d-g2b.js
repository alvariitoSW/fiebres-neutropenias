// Vista Visual del bloque 3D, grupo G2 (fichas 1, 2 y 3: asma y EPOC en la UCI; Marino, cap. 23).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`) o por el comienzo de
// su fila; la calculadora del PEFR de la ficha se conecta sin copiar su lógica. En las fichas con Estudiar es el paso «Mira».
// Estas fichas no tienen imágenes (las figuras 23.1-23.5 son tablas o texto): no hay panel de láminas.

export const RECETAS_3D_G2B = {
    'neumo-asma-epoc-basicos': {
        guia: 'El PEFR mide la obstrucción a pie de cama; el espaciador multiplica por dos lo que llega al pulmón; y la PEEP intrínseca refleja la gravedad.',
        paneles: [
            { tipo: 'escalera', titulo: 'Gravedad según el PEFR (% predicho)', nodos: [
                { fuente: '≥70%', etiqueta: '≥70 %: obstrucción leve' },
                { fuente: '40-69%', etiqueta: '40-69 %: moderada' },
                { fuente: '<40%', etiqueta: '<40 %: grave' }
            ] },
            { tipo: 'calculadora', titulo: 'Clasificador de gravedad por PEFR (el de la ficha)', campos: ['#neumo-pefr-input'], resultado: ['#neumo-pefr-resultado'] },
            { tipo: 'barras', titulo: 'Tabla 23.1: adónde va el fármaco', tabla: '#nep-tabla-23-1',
              series: [{ col: 1, nombre: 'Nebulizador (2,5 mg)', color: 'dorado' }, { col: 3, nombre: 'MDI + espaciador (200 μg)', color: 'verde' }] },
            { tipo: 'comparar', titulo: 'Nebulizador | MDI con espaciador', columnas: [
                { titulo: 'Nebulizador', color: 'dorado', nodos: [{ fuente: '#nep-neb-vs-mdi', etiqueta: '2,5 mg dados: 12 % al pulmón = 300 μg' }] },
                { titulo: 'MDI + espaciador', color: 'verde', nodos: [{ fuente: '#nep-neb-vs-mdi', etiqueta: '0,36 mg (4 puffs) dados: 20 % al pulmón = 72 μg' }] }
            ] },
            { tipo: 'racimos', titulo: 'Aerosoles y ventilación', grupos: [
                { titulo: 'En ventilación mecánica', color: 'amarillo', nodos: [{ fuente: '#nep-aerosol-vm', etiqueta: 'Peor depósito: baja el flujo inspiratorio y alarga la inspiración' }] },
                { titulo: 'Método preferido', color: 'verde', nodos: [{ fuente: '#nep-metodo-preferido', etiqueta: 'MDI con espaciador: dosis más baja, menos efectos secundarios' }, { fuente: '#nep-metodo-preferido', etiqueta: 'Nebulizador en la exacerbación aguda; MDI al estabilizarse' }] },
                { titulo: 'PEEP intrínseca', color: 'rojo', nodos: [{ fuente: '#nep-peep-intrinseca-basicos', etiqueta: 'Aire retenido: presión positiva al final de la espiración' }] }
            ] }
        ]
    },
    'neumo-asma-agudo': {
        guia: 'La respuesta tras la primera hora decide: PEFR ≥70 % a casa; una PaCO₂ de 42 mmHg pese al tratamiento, a la UCI.',
        paneles: [
            { tipo: 'flujo', titulo: 'Fig. 23.3: del PEFR al destino', nodos: [
                { fuente: '#nep-algoritmo', etiqueta: 'Evaluación inicial: grave si PEFR <40 %', color: 'amarillo' },
                { fuente: '#nep-algoritmo', etiqueta: 'SABA ± ipratropio cada 20 min ×3 + esteroides', color: 'dorado' },
                { fuente: '#nep-algoritmo', etiqueta: 'Reevaluación: PEFR ≥70 % sostenido 60 min → alta', color: 'verde' },
                { fuente: '#nep-paco2-42', etiqueta: 'PaCO₂ ≥42 mmHg pese al tratamiento → UCI', color: 'rojo' }
            ] },
            { tipo: 'escalera', titulo: 'Tabla 23.2: los fármacos y su régimen', nodos: [
                { fuente: '#nep-tabla-23-2', etiqueta: 'Albuterol: 2,5-5 mg cada 20 min ×3; mantenimiento 2,5 mg cada 4-6 h' },
                { fuente: '#nep-tabla-23-2', etiqueta: 'Ipratropio: 0,5 mg cada 20 min ×3; no seguir tras el ingreso' },
                { fuente: '#nep-tabla-23-2', etiqueta: 'Corticoides: 40-80 mg de prednisona o metilprednisolona; 7-10 días' },
                { fuente: '#nep-tabla-23-2', etiqueta: 'Magnesio: 2 g de MgSO₄ IV en 15-30 min' }
            ] },
            { tipo: 'barras', titulo: 'Tabla 23.3: potencia de cada corticoide', tabla: '#nep-tabla-23-3',
              series: [{ col: 2, nombre: 'Antiinflamatoria relativa', color: 'verde' }, { col: 3, nombre: 'Mineralocorticoide relativa', color: 'rojo' }] },
            { tipo: 'racimos', titulo: 'Si el asma no cede', grupos: [
                { titulo: 'Adyuvantes', color: 'purpura', nodos: [
                    { fuente: '#nep-magnesio', etiqueta: 'Magnesio IV 2 g: acelera la resolución; inhalado no se aconseja' },
                    { fuente: '#nep-ketamina', etiqueta: 'Ketamina 0,1-0,2 mg/kg de carga; infusión 0,15-0,25 mg/kg/h' }] },
                { titulo: 'Oxígeno y ventilación', color: 'dorado', nodos: [
                    { fuente: '#nep-o2-asma', etiqueta: 'O₂ para SaO₂ ≥90 %; alto flujo nasal si el flujo inspiratorio pasa de 60 L/min' },
                    { fuente: '#nep-vni-asma', etiqueta: 'Hipercapnia: ensayo de BiPAP; si no baja la PCO₂, intubar' }] }
            ] },
            { tipo: 'comparar', titulo: 'Efectos de los β₂-agonistas', columnas: [
                { titulo: 'Potasio bajo', color: 'amarillo', nodos: [{ fuente: '#neumo-saba-adversos', etiqueta: 'Entra en las células por los receptores β' }] },
                { titulo: 'Lactato alto', color: 'rojo', nodos: [{ fuente: '#neumo-saba-adversos', etiqueta: 'Probable aumento de la tasa metabólica, no metabolismo anaeróbico' }] }
            ] }
        ]
    },
    'neumo-epoc-vpp': {
        guia: 'En la exacerbación de EPOC: esteroides, SaO₂ 88-92 % y BiPAP primero; si se ventila, hay que evitar que el aire se quede atrapado.',
        paneles: [
            { tipo: 'escalera', titulo: 'Tabla 23.4: los fármacos y su régimen', nodos: [
                { fuente: '#nep-tabla-23-4', etiqueta: 'Albuterol: 2,5-5 mg por nebulizador o 2-8 puffs con espaciador cada 4-6 h' },
                { fuente: '#nep-tabla-23-4', etiqueta: 'Ipratropio: 0,5 mg por nebulizador o 2-8 puffs cada 4-6 h, si el SABA no basta' },
                { fuente: '#nep-tabla-23-4', etiqueta: 'Corticoides: 40 mg de prednisona al día, 5 días; la vía oral equivale a la IV' }
            ] },
            { tipo: 'comparar', titulo: 'Esteroides: beneficio | precio', columnas: [
                { titulo: 'Beneficio', color: 'verde', nodos: [{ fuente: '#nep-corticoides-epoc', etiqueta: 'Tratar a 9 evita 1 fracaso de tratamiento' }] },
                { titulo: 'Precio', color: 'rojo', nodos: [{ fuente: '#nep-corticoides-epoc', etiqueta: '1 de cada 6 tiene un evento adverso' }] }
            ] },
            { tipo: 'linea', titulo: 'Objetivo de SaO₂ en la EPOC con hipercapnia', min: 80, max: 100, unidad: '%', ticks: [80, 88, 92, 100],
              bandas: [{ desde: 80, hasta: 88, texto: 'Baja', color: 'amarillo' }, { desde: 88, hasta: 92, texto: 'Objetivo', color: 'verde' }, { desde: 92, hasta: 100, texto: 'Evitar', color: 'rojo', alinear: 'fin' }],
              nodos: [{ fuente: '#nep-o2-epoc', etiqueta: '88-92 %', en: 90, color: 'verde', fila: 'abajo' }] },
            { tipo: 'flujo', titulo: 'BiPAP primero, y cuándo intubar', nodos: [
                { fuente: '#nep-vni-epoc', etiqueta: 'Hipercapnia problemática: empezar con BiPAP', color: 'dorado' },
                { fuente: '#nep-vni-epoc', etiqueta: 'Reevaluar a la hora: la PCO₂ debe bajar 10 mmHg', color: 'amarillo' },
                { fuente: '#nep-vni-epoc', etiqueta: 'Si no baja: intubación y ventilación mecánica', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Hiperinflación dinámica y ventilación', grupos: [
                { titulo: 'Qué pasa', color: 'rojo', nodos: [
                    { fuente: '#nep-hiperinflacion', etiqueta: 'La espiración no se completa: gas atrapado y PEEP intrínseca' },
                    { fuente: '#nep-vpp-consecuencias', etiqueta: 'La presión positiva parte de una base más alta y agrava la hiperinflación' }] },
                { titulo: 'Cómo verlo', color: 'purpura', nodos: [{ fuente: '#nep-monitor-flujo', etiqueta: 'Flujo espiratorio al final de la espiración = hiperinflación dinámica' }] },
                { titulo: 'Qué hacer', color: 'verde', nodos: [
                    { fuente: 'Evitar volúmenes de insuflación', etiqueta: 'Volumen insuflado ≤6-8 mL/kg' },
                    { fuente: 'Maximizar el tiempo', etiqueta: 'Más tiempo para exhalar: frecuencia menor y flujo inspiratorio mayor' }] }
            ] }
        ]
    }
};
