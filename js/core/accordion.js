// Comportamiento genérico de abrir/cerrar para cualquier bloque .accordion-btn
// con un atributo data-target. Lo reutiliza cualquier categoría nueva sin
// tener que reescribir esta lógica.
export function initAccordions(root = document) {
    root.querySelectorAll('.accordion-btn[data-target]').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const status = document.getElementById(targetId + '-status');
            const isActive = content.classList.contains('active');
            content.classList.toggle('active', !isActive);
            if (status) status.innerText = isActive ? '[ ABRIR ]' : '[ CERRAR ]';
        });
    });
}
