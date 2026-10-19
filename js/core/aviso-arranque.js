// Aviso de arranque (script clásico, se carga antes que main.js).
// Si una pieza de la app no se descarga o tiene un error, el módulo principal no llega a arrancar y la portada
// se ve pero no responde (le pasó al usuario en el móvil, octubre 2026). Este aviso dice en pantalla qué falló,
// para que se pueda arreglar. main.js marca window.__appLista cuando termina de arrancar.
(function () {
    var errores = [];
    function pintar() {
        if (!errores.length) return;
        var caja = document.getElementById('aviso-arranque');
        if (!caja) {
            caja = document.createElement('div');
            caja.id = 'aviso-arranque';
            caja.setAttribute('role', 'alert');
            caja.className = 'aviso-arranque';
            document.body.prepend(caja);
        }
        caja.innerHTML = '<strong>Una parte de la app no se ha cargado.</strong> Recarga la página. Si vuelve a pasar, ' +
            'manda una captura de este aviso:<br><code></code>';
        caja.querySelector('code').textContent = errores.slice(0, 4).join(' · ');
    }
    function apuntar(texto) {
        if (window.__appLista) return;
        errores.push(texto);
        if (document.body) pintar(); else document.addEventListener('DOMContentLoaded', pintar);
    }
    // Errores de código y piezas (scripts, módulos) que no se descargan.
    window.addEventListener('error', function (e) {
        var t = e.target;
        if (t && t !== window && (t.src || t.href)) apuntar('No se descargó ' + (t.src || t.href).split('/').slice(-2).join('/'));
        else if (e.message) apuntar(e.message + (e.filename ? ' (' + e.filename.split('/').slice(-2).join('/') + ')' : ''));
    }, true);
    window.addEventListener('unhandledrejection', function (e) {
        apuntar(String(e.reason && e.reason.message || e.reason));
    });
    // Si en 20 s no ha arrancado y nadie ha dado error, también se avisa.
    setTimeout(function () { if (!window.__appLista && !errores.length) apuntar('Sigue sin arrancar tras 20 s'); }, 20000);
})();
