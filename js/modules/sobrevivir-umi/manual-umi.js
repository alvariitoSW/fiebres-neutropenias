// Manual UMI Negrín: manual de orientación interno de la Unidad de
// Medicina Intensiva (Hospital Universitario de Gran Canaria Dr. Negrín),
// consolidado en una única guía con sus 18 fichas — sin calculadoras
// propias en este primer pase. Los enlaces cruzados hacia otras
// especialidades (.especialidad-link) los engancha el listener genérico
// ya existente en home/index.js, no hace falta wiring aquí.
import { initCorkboard } from '../../core/corkboard.js';

export function init() {
    initCorkboard('manual-umi-corkboard', 'panel-manual-umi-tabs');
}
