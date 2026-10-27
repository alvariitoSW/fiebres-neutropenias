// El receptor vivo: vasopresores e inotrópicos (Marino caps. 14 y 16). Modelo vivo de Libros.
// Interfaz común: init() devuelve { abrir(estadoClave, origen) }. Se abre con el enlace cruzado de siempre:
// <button data-especialidad="libros" data-view="receptorVivo" data-receptor-vivo="na-alta">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js).
// Lo pesado (dibujos, monitor, lupa) se monta al primer abrir; el bucle de dibujo se para solo al salir.
import { marcarVolver } from '../../../core/volver-ficha.js';
import { instalarCssReceptor } from './receptor-vivo-css.js';

let raiz = null, pagina = null, cargando = null;

function montar() {
    if (!cargando) {
        instalarCssReceptor();
        cargando = import('./pagina.js').then(m => { pagina = m; return m; });
    }
    return cargando;
}

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export function abrirEstado(clave, origen) {
    if (origen !== undefined) marcarVolver(document.getElementById('rcv-volver'), raiz, origen);
    montar().then(m => {
        requestAnimationFrame(() => {
            if (clave) m.ponerEstado(clave);
            m.reanudar();
            raiz.scrollIntoView({ block: 'start' });
        });
    });
}

export function init() {
    raiz = document.getElementById('rcv-raiz');
    // «Verlo vivo» bajo los receptores animados de la ficha de vasopresores: el estado sigue al fármaco elegido allí.
    const selector = document.getElementById('mc-receptor-farmaco'), enlace = document.querySelector('#rcv-enlace-mc-receptores button');
    if (selector && enlace) {
        const ESTADO_DE = { norepi: 'na-alta', epi: 'adrenalina', dopa: 'dopamina', fenil: 'fenilefrina', dobuta: 'dobutamina' };
        selector.addEventListener('change', () => {
            const est = ESTADO_DE[selector.value];
            enlace.parentElement.hidden = !est && !!selector.value;
            if (est) enlace.dataset.receptorVivo = est;
        });
    }
    return { abrir: abrirEstado };
}
