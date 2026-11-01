// Placa motora viva · del nervio al pulgar (Marino cap. 46): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre (lo resuelve el listener delegado de home/index.js):
// <button data-especialidad="libros" data-view="placaViva" data-placa-viva="sera:2">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js). El estado es un paciente (flor, sera, mel), con un paso de su guía
// («sera:2»), o «pnc» / «mcc» para la guía de la polineuropatía y la miopatía del crítico. Lo pesado se monta en el primer abrir.
import { marcarVolver } from '../../../core/volver-ficha.js';

let raiz = null, pagina = null, cargando = null;

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export async function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('plv-volver'), raiz, origen);
    cargando = cargando || import('./pagina.js').then(m => { pagina = m; });
    await cargando;
    pagina.abrirEstado(String(clave || ''));
    // Con «paciente:paso», pagina.abrirEstado ya centra la caja del paso; subir al principio la dejaría bajo el pliegue.
    if (!String(clave || '').includes(':')) requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
    raiz = document.getElementById('plv-raiz');
    return { abrir: abrirEstado };
}
