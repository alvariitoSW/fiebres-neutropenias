// Permite ampliar a pantalla completa cualquier imagen dentro de
// .article-figure. Se llama una sola vez desde main.js; funciona con
// cualquier imagen añadida después por cualquier módulo.
export function initLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<span class="lightbox-close">&times;</span><img alt="">';
    document.body.appendChild(overlay);
    const overlayImg = overlay.querySelector('img');

    function close() {
        overlay.classList.remove('active');
    }

    overlay.addEventListener('click', close);

    document.querySelectorAll('.article-figure img').forEach(img => {
        img.addEventListener('click', () => {
            overlayImg.src = img.src;
            overlayImg.alt = img.alt;
            overlay.classList.add('active');
        });
    });
}
