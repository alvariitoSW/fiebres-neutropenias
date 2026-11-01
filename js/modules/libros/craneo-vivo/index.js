// Cráneo vivo · el corte con la cara (Marino caps. 45-47): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre (lo resuelve el listener delegado de home/index.js):
// <button data-especialidad="libros" data-view="craneoVivo" data-craneo-vivo="abundio:3">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js). El estado es un paciente (abundio, segismundo, clotilde,
// petronila, leovigildo) con un paso de su explicación guiada («abundio:3»). Lo pesado se monta en el primer abrir.
// Piezas comunes para el Estudiar: cara.js (dibujarCara, pupilaDe, textoPupila, dibujarMano) y U de js/data/craneo-vivo-data.js.
import { marcarVolver } from '../../../core/volver-ficha.js';

let raiz = null, pagina = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('crv-volver'), raiz, origen);
    cargando = cargando || import('./pagina.js').then(m => { pagina = m; });
    await cargando;
    pagina.abrirEstado(String(clave || ''));
    requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('crv-raiz');
    return { abrir: abrirEstado };
}
