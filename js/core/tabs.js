// Comportamiento genérico de pestañas (.tab / .tab-content) dentro de un contenedor.
// onChange (opcional) se llama tras cada cambio de pestaña, por si el módulo
// necesita recalcular algo específico de esa pestaña.
export function initTabs(container, onChange) {
    if (!container) return;
    const tabs = container.querySelectorAll('.tab');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab')).classList.add('active');
            if (onChange) onChange();
        });
    });
}
