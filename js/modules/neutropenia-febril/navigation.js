// Navegación entre las 5 vistas del módulo (principal, diagnóstico,
// tratamiento empírico, tratamiento dirigido y microorganismos). Cada botón
// "VER →" muestra su vista y oculta las demás; los botones "VOLVER" de las 4
// subvistas regresan a la principal. El "VOLVER" de la vista principal NO es
// de este módulo (lleva .btn-volver-citopenias-menu, lo resuelve home/index.js).
import { createViewSwitcher } from '../../core/navigation.js';

export function init() {
    const subvistas = {
        diag: document.getElementById('hemato-diagnostico-view'),
        trat: document.getElementById('hemato-tratamiento-view'),
        diri: document.getElementById('hemato-dirigido-view'),
        micro: document.getElementById('hemato-microorganismos-view'),
    };
    const nivel = createViewSwitcher({ main: document.getElementById('hemato-main-view'), ...subvistas });

    document.getElementById('btn-diagnostico').addEventListener('click', () => nivel.show('diag'));
    document.getElementById('btn-tratamiento').addEventListener('click', () => nivel.show('trat'));
    document.getElementById('btn-dirigido').addEventListener('click', () => nivel.show('diri'));
    document.getElementById('btn-microorganismos').addEventListener('click', () => nivel.show('micro'));
    // Acotado a las subvistas propias: .back-btn es la clase visual de los ~45
    // "← VOLVER" de TODA la app, un querySelectorAll global aquí los engancharía todos.
    Object.values(subvistas).forEach(v =>
        v.querySelectorAll('.back-btn').forEach(b => b.addEventListener('click', () => nivel.show('main'))));
}
