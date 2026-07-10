// Módulo "Reconocimiento Temprano": por ahora solo contenido de referencia
// (fracaso respiratorio agudo, basado en Azoulay et al. 2024), sin
// calculadoras propias. Lo único interactivo son las pestañas.
import { initTabs } from '../../core/tabs.js';

export function init() {
    initTabs(document.getElementById('panel-reconocimiento-tabs'));
}
