// Vista Visual del bloque 3D, grupo G5 (tubo y barotrauma): fichas 14 neumo-vias-artificiales y 15 neumo-cuidado-barotrauma
// (Marino, cap. 28, págs. 17-31 del PDF). Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`);
// la calculadora del tamaño del tubo es la de la ficha. Las Figs. 28.1, 28.2, 28.4, 28.5, 28.6 y 28.7 son imágenes reales de la
// ficha (láminas); la 28.8 es una tabla y se ve como escalera. En las fichas con Estudiar, es el paso «Mira».

export const RECETAS_3D_G5 = {
    'neumo-vias-artificiales': {
        guia: 'El tubo se elige por la altura y la punta queda a 3-5 cm de la carina; el manguito no pasa de 25 y una fuga se resuelve en orden; la traqueostomía se plantea tras una semana.',
        paneles: [
            { tipo: 'calculadora', titulo: 'Tamaño del tubo según la altura (calculadora de la ficha)', campos: ['#neumo-et-altura'], resultado: ['#neumo-et-resultado'] },
            { tipo: 'figuras', titulo: 'Las radiografías del libro', nota: 'Fig. 28.1: tubo bien colocado. Fig. 28.2: tubo en el bronquio derecho. Tócalas para ampliarlas.', nodos: ['#nep-fig-28-1', '#nep-fig-28-2'] },
            { tipo: 'escalera', titulo: 'Colocar el tubo: tamaño, profundidad y límites', nodos: [
                { fuente: '#nep-tamano', etiqueta: 'Tamaño 7 (≤157,5 cm), 7,5 (160-177,8) u 8 (≥180,3)' },
                { fuente: '#nep-insercion', etiqueta: 'Longitud: incisivos → ángulo de Louis, cabeza extendida' },
                { fuente: '#nep-posicion', etiqueta: 'Punta a 3-5 cm de la carina (T4-T5); la flexión mueve 2 cm' },
                { fuente: '#nep-migracion', etiqueta: 'Límite en los dientes: ≤21 cm en la mujer, ≤23 cm en el hombre' }
            ] },
            { tipo: 'comparar', titulo: 'Traqueostomía precoz | tardía', columnas: [
                { titulo: 'Precoz (1.ª semana)', color: 'verde', nodos: [{ fuente: '#nep-momento', etiqueta: 'Menos sedantes y menos tiempo de ventilación' }] },
                { titulo: 'Tardía (≥2 semanas)', color: 'gris', nodos: [{ fuente: '#nep-momento', etiqueta: 'Sin diferencia en neumonía ni en mortalidad' }] }
            ] },
            { tipo: 'racimos', titulo: 'Complicaciones de la traqueostomía', grupos: [
                { titulo: 'Agudas', color: 'rojo', nodos: [
                    { fuente: '#nep-complicaciones-traqueo', etiqueta: 'Mortalidad <1 %, sangrado mayor <5 %, infección 2-10 %' },
                    { fuente: '#nep-decanulacion', etiqueta: 'Decanulación antes de la semana: reintubar por la boca' }] },
                { titulo: 'Tardía', color: 'amarillo', nodos: [{ fuente: '#nep-estenosis', etiqueta: 'Estenosis: 0-15 %, igual en quirúrgica y percutánea' }] }
            ] },
            { tipo: 'comparar', titulo: 'El tope del manguito: dos unidades', columnas: [
                { titulo: 'Al medir con manómetro', color: 'dorado', nodos: [{ fuente: '#nep-cuff-presion', etiqueta: 'No pasar de 25 mmHg: presión de los capilares de la pared' }] },
                { titulo: 'Al reponer aire', color: 'purpura', nodos: [{ fuente: '#nep-cuff-solucion', etiqueta: 'Comprobar que no pasa de 25 cmH₂O' }] }
            ] },
            { tipo: 'flujo', titulo: 'Fuga del manguito: qué hacer', nodos: [
                { fuente: '#nep-cuff-fuga', etiqueta: 'Se oye al insuflar; fuga = Vt programado − Vt exhalado', color: 'amarillo' },
                { fuente: '#nep-cuff-solucion', etiqueta: 'Separar del ventilador y ventilar con bolsa; mirar el balón piloto', color: 'dorado' },
                { fuente: '#nep-cuff-solucion', etiqueta: 'Piloto inflado: reposicionar, reinflar (≤25 cmH₂O); si sigue, tubo mayor', color: 'verde' },
                { fuente: '#nep-cuff-solucion', etiqueta: 'Piloto desinflado: válvula o manguito; si no se llena, cambiar el tubo', color: 'rojo' }
            ] }
        ]
    },
    'neumo-cuidado-barotrauma': {
        guia: 'Se aspira solo con evidencia de secreciones y sin salino; el gas que escapa del alvéolo se busca en el cuello y, en supino, delante de las bases; el tensión se descomprime ya.',
        paneles: [
            { tipo: 'racimos', titulo: 'Cuándo aspirar', grupos: [
                { titulo: 'Los mejores indicadores', color: 'verde', nodos: [
                    { fuente: '#nep-indicaciones-aspiracion', etiqueta: 'Secreciones visibles en el tubo' },
                    { fuente: '#nep-indicaciones-aspiracion', etiqueta: 'Secreciones en la auscultación' },
                    { fuente: '#nep-indicaciones-aspiracion', etiqueta: 'Dientes de sierra en la curva de flujo' }] },
                { titulo: 'Otras posibles', color: 'gris', nodos: [
                    { fuente: '#nep-indicaciones-aspiracion', etiqueta: 'Atelectasia segmentaria en la Rx' },
                    { fuente: '#nep-indicaciones-aspiracion', etiqueta: 'Caída brusca de la oxigenación' }] }
            ] },
            { tipo: 'comparar', titulo: 'Suero salino | N-acetilcisteína', columnas: [
                { titulo: 'Salino', color: 'rojo', nodos: [
                    { fuente: '#nep-viscosidad', etiqueta: 'No fluidifica: la capa viscosa es hidrofóbica' },
                    { fuente: '#nep-salino', etiqueta: '5 mL desprenden hasta 300.000 colonias del tubo' }] },
                { titulo: 'NAC', color: 'verde', nodos: [
                    { fuente: '#nep-nac', etiqueta: 'Rompe los puentes disulfuro' },
                    { fuente: '#nep-tabla-28-1', etiqueta: 'Aerosol 10 % o inyección traqueal 20 %, cada 8 h' }] }
            ] },
            { tipo: 'flujo', titulo: 'Barotrauma: adónde va el gas', nodos: [
                { fuente: '#nep-barotrauma', etiqueta: 'Alvéolo roto: el gas escapa', color: 'rojo' },
                { fuente: '#nep-presentacion-baro', etiqueta: 'Enfisema intersticial y mediastino', color: 'amarillo' },
                { fuente: '#nep-presentacion-baro', etiqueta: 'Cuello (subcutáneo) o abdomen (neumoperitoneo)', color: 'dorado' },
                { fuente: '#nep-presentacion-baro', etiqueta: 'Pleura visceral rota: neumotórax', color: 'purpura' }
            ] },
            { tipo: 'figuras', titulo: 'Las imágenes del libro', nota: 'Fig. 28.4: biofilm. 28.5: Rx y TC supinas. 28.6: línea pleural. 28.7: neumotórax a tensión. Tócalas para ampliarlas.', nodos: ['#nep-fig-28-4', '#nep-fig-28-5', '#nep-fig-28-6', '#nep-fig-28-7'] },
            { tipo: 'escalera', titulo: 'Del hallazgo a la descompresión', nodos: [
                { fuente: '#nep-neumo-clinica', etiqueta: 'Enfisema subcutáneo en el cuello: lo más específico' },
                { fuente: '#nep-rx-supino', etiqueta: 'En supino: aire delante de las bases, no en el vértice' },
                { fuente: '#nep-eco-pleural', etiqueta: 'Eco: sin deslizamiento sugiere; punto pulmonar confirma' },
                { fuente: '#nep-neumotorax-tension', etiqueta: 'Tensión: hipoxemia o hipotensión inexplicadas' },
                { fuente: '#nep-descompresion', etiqueta: '14 G de 8 cm, 5.º espacio por delante de la línea axilar media' }
            ] },
            { tipo: 'escalera', titulo: 'Drenaje de tres cámaras', nodos: [
                { fuente: '#nep-tubo-toracico', etiqueta: 'Tubo: 4.º-5.º espacio, axilar media; delante y arriba para el aire' },
                { fuente: '#nep-fig-28-8', etiqueta: 'Cámara 1: recoge líquido sin hacer contrapresión' },
                { fuente: '#nep-sello-agua', etiqueta: 'Cámara 2: sello de agua de 2 cm; burbujas = fístula' },
                { fuente: '#nep-succion', etiqueta: 'Cámara 3: succión (−20); si burbujea con succión, apagarla' }
            ] }
        ]
    }
};
