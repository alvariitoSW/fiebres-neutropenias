// Vista Visual del bloque 3D, grupo G2 (ver autonomo/bloques/b3/estudio-3d/encargo.md). Recetas para core/visual-kit.js;
// nodos por id (fuente: '#nep-…'). Fichas 10 y 11 (ventilación no invasiva, Marino cap. 26). Las Figs. 26.1-26.3 y 26.6-26.8
// son texto en la ficha (sin imagen); las Figs. 26.4 y 26.5 se dibujan desde sus tablas de datos.

// Figuras 26.4 y 26.5 y el evaluador de la primera hora, plegados: secundarios en la Mira (siguen enteros en la ficha).
const ENLACE = (id, txt) => `<button type="button" class="especialidad-link" data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs" data-tab="neumo-vni-uso" data-resaltar="#${id}">${txt}</button>`;
function barrasDeTabla(idTabla, series) {
    const t = document.getElementById(idTabla);
    if (!t) return '';
    const filas = [...t.rows].filter(r => r.cells[0]?.tagName === 'TD');
    const num = c => parseFloat((c?.textContent || '').replace(',', '.')) || 0;
    const max = Math.max(...filas.flatMap(r => series.map(se => num(r.cells[se.col])))) || 1;
    const leyenda = series.length > 1 ? `<div class="vk-barras-leyenda">${series.map(se => `<span style="--vk:${se.color}">${se.nombre}</span>`).join('')}</div>` : '';
    return leyenda + '<div class="vk-barras">' + filas.map(r => `<div class="vk-barra-fila"><span class="vk-barra-etq">${r.cells[0].textContent.trim()}</span><span class="vk-barra-pistas">${series.map(se => `<span class="vk-barra" style="--vk:${se.color}"><i style="width:${Math.max(1.5, num(r.cells[se.col]) / max * 100)}%"></i><em>${r.cells[se.col].textContent.trim()}</em></span>`).join('')}</span></div>`).join('') + '</div>';
}
function pintarCifrasVni(cuerpo) {
    if (cuerpo.hasChildNodes()) return;
    cuerpo.innerHTML = `
        <details class="nota-plegable"><summary>Fig. 26.4: VNI en la exacerbación de EPOC (%)</summary><p>Las cifras son las etiquetas de la figura; las alturas dibujadas en el PDF no coinciden exactamente con ellas.</p>${barrasDeTabla('nep-fig-26-4', [{ col: 1, nombre: 'Sin VNI', color: 'var(--accent-red)' }, { col: 2, nombre: 'Con VNI', color: 'var(--accent-green)' }])}<p>${ENLACE('nep-fig-26-4', 'Ver en el texto')}</p></details>
        <details class="nota-plegable"><summary>Fig. 26.5: fracaso de la VNI según la causa (%)</summary>${barrasDeTabla('nep-fig-26-5', [{ col: 1, nombre: 'Fracaso', color: 'var(--accent-yellow)' }])}<p>${ENLACE('nep-fig-26-5', 'Ver en el texto')}</p></details>
        <details class="nota-plegable"><summary>Respuesta a la primera hora, hipovolemia y poscarga</summary><p>La hipovolemia magnifica el frenado del llenado. ${ENLACE('nep-precarga-vpp', 'Ver en el texto')}</p><p>El evaluador de la primera hora (tipo de insuficiencia, valor basal y valor a la hora) está en la ficha: ${ENLACE('neumo-vni-respuesta-resultado', 'Abrir el evaluador')}</p><p>Poscarga = presión de la cámara − presión pleural (Ec. 26.1): con pleural negativa sube (si es exagerada, pulso paradójico, &gt;10 mmHg); con pleural positiva baja y el volumen sistólico tiende a subir. ${ENLACE('nep-ec-26-1', 'Ver en el texto')}</p></details>`;
}
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
            { tipo: 'propio', titulo: 'La presión de soporte, en el pulmón vivo',
              nota: 'Mismos cuatro puntos, con el respirador delante: el hundimiento de la presión al disparar y el corte cuando el flujo cae al 25 % de su pico.',
              render(cuerpo) {
                  if (cuerpo.hasChildNodes()) return;
                  cuerpo.innerHTML = '<button type="button" class="may-b may-modelo" data-especialidad="libros" data-view="pulmonVivo" data-pulmon-vivo="psv-disparo">🫁 Ver el disparo y el corte de la PSV en el pulmón vivo →</button>';
              } },
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
            { tipo: 'propio', titulo: 'Cifras y evaluador (plegados)', render: pintarCifrasVni },
            { tipo: 'comparar', titulo: 'Presión positiva según el corazón', columnas: [
                { titulo: 'Corazón sano', color: 'amarillo', nodos: [{ fuente: '#nep-corazon-papel', etiqueta: 'Precarga empinada, poscarga plana: el gasto tiende a bajar' }] },
                { titulo: 'Corazón que falla', color: 'verde', nodos: [{ fuente: '#nep-corazon-papel', etiqueta: 'Precarga plana, poscarga empinada: el gasto tiende a subir' }] }
            ] },
            { tipo: 'flujo', titulo: 'Cuatro formas de frenar el llenado', nodos: [
                { fuente: '#nep-precarga-vias', etiqueta: '1. Menos gradiente venoso: llena menos el VD', color: 'dorado' },
                { fuente: '#nep-precarga-vias', etiqueta: '2. Comprime venas pulmonares: llena menos el VI', color: 'purpura' },
                { fuente: '#nep-precarga-vias', etiqueta: '3. Baja la presión transmural (más en el VD)', color: 'amarillo' },
                { fuente: '#nep-precarga-vias', etiqueta: '4. Sube la resistencia pulmonar: el septo empuja al VI', color: 'rojo' }
            ] }
        ]
    }
};
