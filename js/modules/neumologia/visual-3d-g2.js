// Vista Visual del bloque 3D, grupo G2 (ver autonomo/bloques/b3/estudio-3d/encargo.md). Recetas para core/visual-kit.js;
// nodos por id (fuente: '#nep-…'). Fichas 10 y 11 (ventilación no invasiva, Marino cap. 26). Las Figs. 26.1-26.3 y 26.6-26.8
// son texto en la ficha (sin imagen); las Figs. 26.4 y 26.5 se dibujan desde sus tablas de datos.
export const RECETAS_3D_G2 = {
    'neumo-vni-metodos': {
        guia: 'La CPAP sube la capacidad residual funcional pero no el volumen tidal; el bilevel y la presión de soporte dan volumen porque el paciente dispara. La mascarilla es donde más falla.',
        paneles: [
            { tipo: 'comparar', titulo: 'Tres métodos', columnas: [
                { titulo: 'CPAP', color: 'dorado', nodos: [{ fuente: '#nep-cpap-presion', etiqueta: 'Presión constante de 5-10 cmH₂O: sube la CRF, no el Vt' }] },
                { titulo: 'Bilevel', color: 'purpura', nodos: [{ fuente: '#nep-bipap', etiqueta: 'Pico 10-20 y PEEP 5-10; el paciente dispara' }] },
                { titulo: 'Presión de soporte', color: 'verde', nodos: [{ fuente: '#nep-psv-4-puntos', etiqueta: 'Interactiva: el flujo decide el final' }] }
            ] },
            { tipo: 'flujo', titulo: 'Los cuatro puntos de la presión de soporte', nodos: [
                { fuente: '#nep-psv-4-puntos', etiqueta: '1. El paciente dispara: hundimiento de la presión', color: 'dorado' },
                { fuente: '#nep-psv-4-puntos', etiqueta: '2. Flujo alto: la presión sube rápido', color: 'purpura' },
                { fuente: '#nep-psv-4-puntos', etiqueta: '3. Servo: el flujo sigue la demanda y la presión se mantiene', color: 'verde' },
                { fuente: '#nep-psv-4-puntos', etiqueta: '4. Corte: el flujo cae al 25 % del pico', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Otros modos e interfaces', grupos: [
                { titulo: 'PAV', color: 'gris', nodos: [{ fuente: '#nep-pav', etiqueta: 'Ajusta la presión a la mecánica; sin ventaja demostrada' }] },
                { titulo: 'Mascarillas', color: 'amarillo', nodos: [
                    { fuente: '#nep-mascarillas', etiqueta: 'Nasal: CPAP de bajo nivel; facial: BiPAP' },
                    { fuente: '#nep-mascarilla-intolerancia', etiqueta: 'La intolerancia: 18 % de los fracasos' }] },
                { titulo: 'Casco', color: 'verde', nodos: [{ fuente: '#nep-casco', etiqueta: 'Menos intubaciones y muertes; rara vez en adultos' }] }
            ] }
        ]
    },
    'neumo-vni-uso': {
        guia: 'La VNI se decide por una lista y se juzga a la hora. En el corazón que falla, la presión positiva ayuda porque baja la poscarga; en el sano o el hipovolémico frena el llenado.',
        paneles: [
            { tipo: 'racimos', titulo: 'Tabla 26.1: ¿puede recibir VNI?', grupos: [
                { titulo: 'Si hay alguna, no VNI', color: 'rojo', tabla: '#nep-tabla-26-1' },
                { titulo: 'Si todas son NO', color: 'verde', nodos: [{ fuente: '#nep-vni-candidatos', etiqueta: 'Candidato a ventilación no invasiva' }] }
            ] },
            { tipo: 'barras', titulo: 'Fig. 26.4: VNI en la exacerbación de EPOC (%)', nota: 'Las cifras son las etiquetas de la figura; las alturas dibujadas en el PDF no coinciden exactamente con ellas.', tabla: '#nep-fig-26-4',
              series: [{ col: 1, nombre: 'Sin VNI', color: 'rojo' }, { col: 2, nombre: 'Con VNI', color: 'verde' }] },
            { tipo: 'barras', titulo: 'Fig. 26.5: fracaso de la VNI según la causa (%)', tabla: '#nep-fig-26-5',
              series: [{ col: 1, nombre: 'Fracaso', color: 'amarillo' }] },
            { tipo: 'calculadora', titulo: 'Respuesta a la primera hora (evaluador de la ficha)', campos: ['#neumo-vni-respuesta-tipo', '#neumo-vni-respuesta-basal', '#neumo-vni-respuesta-1h'], resultado: ['#neumo-vni-respuesta-resultado'] },
            { tipo: 'comparar', titulo: 'Presión positiva según el corazón', columnas: [
                { titulo: 'Corazón sano', color: 'amarillo', nodos: [{ fuente: '#nep-corazon-papel', etiqueta: 'Precarga empinada, poscarga plana: el gasto tiende a bajar' }] },
                { titulo: 'Corazón que falla', color: 'verde', nodos: [{ fuente: '#nep-corazon-papel', etiqueta: 'Precarga plana, poscarga empinada: el gasto tiende a subir' }] }
            ] },
            { tipo: 'flujo', titulo: 'Cuatro formas de frenar el llenado', nodos: [
                { fuente: '#nep-precarga-vias', etiqueta: '1. Menos gradiente de entrada venosa: llena menos el VD', color: 'dorado' },
                { fuente: '#nep-precarga-vias', etiqueta: '2. Comprime las venas pulmonares: llena menos el VI', color: 'purpura' },
                { fuente: '#nep-precarga-vias', etiqueta: '3. Baja la presión transmural: más efecto en el VD', color: 'amarillo' },
                { fuente: '#nep-precarga-vias', etiqueta: '4. Sube la resistencia pulmonar: si el VD falla, el septo empuja al VI', color: 'rojo' },
                { fuente: '#nep-precarga-vpp', etiqueta: 'La hipovolemia lo magnifica', color: 'rojo' }
            ] },
            { tipo: 'flujo', titulo: 'Poscarga = presión de la cámara − presión pleural', nodos: [
                { fuente: '#nep-ec-26-1', etiqueta: 'Ec. 26.1: la pleural resta', color: 'dorado' },
                { fuente: '#nep-pulso-paradojico-26', etiqueta: 'Pleural negativa: poscarga ↑; si es exagerada, pulso paradójico (>10)', color: 'amarillo' },
                { fuente: '#nep-poscarga-vpp', etiqueta: 'Pleural positiva: poscarga ↓, el volumen sistólico tiende a subir', color: 'verde' }
            ] }
        ]
    }
};
