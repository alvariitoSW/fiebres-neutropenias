// Navegación entre las 4 vistas del módulo (principal, diagnóstico,
// tratamiento empírico y tratamiento dirigido). Cada botón "VER →" muestra
// su vista y oculta las demás; los botones "VOLVER" regresan a la principal.
function showView(showKey) {
    const views = {
        main: document.getElementById('hemato-main-view'),
        diag: document.getElementById('hemato-diagnostico-view'),
        trat: document.getElementById('hemato-tratamiento-view'),
        diri: document.getElementById('hemato-dirigido-view')
    };
    Object.keys(views).forEach(k => {
        views[k].style.display = (k === showKey) ? 'block' : 'none';
    });
}

export function init() {
    document.getElementById('btn-diagnostico').addEventListener('click', () => showView('diag'));
    document.getElementById('btn-tratamiento').addEventListener('click', () => showView('trat'));
    document.getElementById('btn-dirigido').addEventListener('click', () => showView('diri'));
    document.querySelectorAll('.back-btn').forEach(b => b.addEventListener('click', () => showView('main')));
}
