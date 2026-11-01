// Vista Visual del bloque 3D, G4b: ficha 9 neumo-o2-toxicidad (Marino, cap. 25, págs. 66-73 del PDF).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`). La ficha no tiene
// estado propio en los modelos vivos (no hay gases ni radicales): aquí el paso «Mira» hace el trabajo.
export const RECETAS_3D_G4B = {
    'neumo-o2-toxicidad': {
        guia: 'El O₂ llega a agua en cuatro electrones, de uno en uno, y por el camino deja radicales; los antioxidantes los frenan, y por eso la FiO₂ tolerable en el crítico es más baja que el 60 %.',
        paneles: [
            { tipo: 'flujo', titulo: 'Figura 25.6: del O₂ al agua, un electrón cada vez', nodos: [
                { fuente: '#nep-tox-fig-25-6', etiqueta: 'O₂ + 1 e⁻ → superóxido (radical)', color: 'amarillo' },
                { fuente: '#nep-tox-fig-25-6', etiqueta: 'Superóxido + 1 e⁻ + 2H⁺ (SOD) → peróxido de hidrógeno', color: 'dorado' },
                { fuente: '#nep-tox-fig-25-6', etiqueta: 'H₂O₂ + 1 e⁻ (Fe²⁺ → Fe³⁺) → hidroxilo (radical)', color: 'rojo' },
                { fuente: '#nep-tox-fig-25-6', etiqueta: 'Hidroxilo + 1 e⁻ + 2H⁺ → 2 H₂O', color: 'verde' },
                { fuente: '#nep-tox-porcentaje', etiqueta: 'Normal: ≥95 % llega a agua; ~3 % deja ROS', color: 'gris' }
            ] },
            { tipo: 'comparar', titulo: 'Las tres ROS: ¿radical? ¿hasta dónde llega?', columnas: [
                { titulo: 'Superóxido', color: 'amarillo', nodos: [{ fuente: '#nep-tox-ros', etiqueta: 'Radical libre, muy reactivo' }] },
                { titulo: 'H₂O₂', color: 'dorado', nodos: [{ fuente: '#nep-tox-ros', etiqueta: 'No es radical; oxidante potente que cruza membranas y viaja' }] },
                { titulo: 'Hidroxilo', color: 'rojo', nodos: [{ fuente: '#nep-tox-ros', etiqueta: 'Radical; reacciona a 3 diámetros moleculares; el más destructivo' }] }
            ] },
            { tipo: 'racimos', titulo: 'Quién frena a los oxidantes', grupos: [
                { titulo: 'Enzimas y glutatión', color: 'verde', nodos: [
                    { fuente: '#nep-sod-enzima', etiqueta: 'SOD: quita superóxido, pero fabrica H₂O₂' },
                    { fuente: '#nep-tox-glutation', etiqueta: 'Glutatión: principal antioxidante intracelular' },
                    { fuente: '#nep-tox-nac', etiqueta: 'N-acetilcisteína: cruza la membrana, sustituye al glutatión' },
                    { fuente: '#nep-tox-selenio', etiqueta: 'Selenio: cofactor de la glutatión peroxidasa' }] },
                { titulo: 'Vitaminas', color: 'purpura', nodos: [
                    { fuente: '#nep-tox-vit-e', etiqueta: 'Vitamina E: rompe la cadena de la peroxidación lipídica' },
                    { fuente: '#nep-tox-vit-c', etiqueta: 'Vitamina C: barre radicales y regenera la E' }] },
                { titulo: 'Plasma', color: 'gris', nodos: [
                    { fuente: '#nep-tox-cerulo', etiqueta: 'Ceruloplasmina oxida el hierro; la transferrina lo une' }] }
            ] },
            { tipo: 'linea', titulo: 'FiO₂ y toxicidad pulmonar', min: 20, max: 100, unidad: '%', ticks: [21, 40, 60, 80, 100],
              bandas: [{ desde: 20, hasta: 60, texto: 'Bajo el umbral clásico', color: 'gris' }, { desde: 60, hasta: 100, texto: 'Sobre el 60 %', color: 'rojo', alinear: 'fin' }],
              nodos: [
                { fuente: '#nep-tox-fio2', etiqueta: '60: umbral (menos en críticos)', en: 60, color: 'amarillo', fila: 'abajo' },
                { fuente: '#nep-tox-humanos', etiqueta: '100: 6-12 h → traqueobronquitis', en: 100, color: 'rojo', fila: 'abajo' }
              ] },
            { tipo: 'escalera', titulo: 'Cóctel antioxidante del estudio en trauma', nodos: [
                { fuente: '#nep-tox-coctel', etiqueta: 'Vitamina C 1000 mg cada 8 h' },
                { fuente: '#nep-tox-coctel', etiqueta: 'Vitamina E 1000 unidades cada 8 h' },
                { fuente: '#nep-tox-coctel', etiqueta: 'Selenio 200 µg al día' },
                { fuente: '#nep-tox-coctel', etiqueta: 'Durante 7 días: menos fallo respiratorio y dependencia del ventilador' }
            ] },
            { tipo: 'flujo', titulo: 'Ecuación 25.3: por qué más O₂ no da más aporte', nodos: [
                { fuente: '#nep-tox-ec-25-3', etiqueta: 'DO₂ = CaO₂ × GC', color: 'dorado' },
                { fuente: '#nep-tox-vasoconstrictor', etiqueta: 'O₂ inhalado: CaO₂ ↑', color: 'verde' },
                { fuente: '#nep-tox-vasoconstrictor', etiqueta: 'Vasoconstricción: GC ↓', color: 'rojo' },
                { fuente: '#nep-tox-vasoconstrictor', etiqueta: 'Aporte de O₂ sin cambios', color: 'purpura' },
                { fuente: '#nep-tox-final', etiqueta: 'Defensa antioxidante del organismo', color: 'gris' }
            ] }
        ]
    }
};
