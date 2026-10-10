// Muestra una vista de un grupo y oculta el resto. Reutilizable por cualquier
// nivel de navegación de la app (menú principal, submenú de una categoría, etc.).
import { openCorkboardTopic } from './corkboard.js';

// `alMostrar(key, vista)` (opcional) se llama cada vez que cambia la vista.
export function createViewSwitcher(views, alMostrar) {
    let actual = null;
    function show(key) {
        actual = key;
        Object.keys(views).forEach(k => {
            views[k].style.display = (k === key) ? 'block' : 'none';
        });
        alMostrar?.(key, views[key]);
    }
    // Salto a una ficha concreta de un cuaderno de campo de este nivel:
    // cambia de vista (si se indica) y abre la ficha (si se indican panel y
    // tab). Es lo que expone cada especialidad como `irAFicha` para los
    // enlaces cruzados `[data-especialidad]` resueltos en home/index.js.
    function irAFicha(view, panel, tab) {
        if (view) show(view);
        if (panel && tab) openCorkboardTopic(panel, tab);
    }
    return { show, irAFicha, actual: () => actual };
}
