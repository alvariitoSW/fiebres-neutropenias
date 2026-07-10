// Muestra una vista de un grupo y oculta el resto. Reutilizable por cualquier
// nivel de navegación de la app (menú principal, submenú de una categoría, etc.).
export function createViewSwitcher(views) {
    function show(key) {
        Object.keys(views).forEach(k => {
            views[k].style.display = (k === key) ? 'block' : 'none';
        });
    }
    return { show };
}
