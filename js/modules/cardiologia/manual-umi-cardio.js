// Manual UMI Negrín — Cardiología práctica: protocolos internos de la UMI
// (Hospital Universitario de Gran Canaria Dr. Negrín). Solo cuaderno de
// campo por ahora, sin calculadoras propias en este primer pase — mismo
// criterio ya aplicado a otros bloques iniciales de la app (p. ej. el
// bloque de Hematología de Fisiopatología UCI en su primera versión).
import { initCorkboard } from '../../core/corkboard.js';

export function init() {
    initCorkboard('umi-cardio-corkboard', 'panel-umi-cardio-tabs');
}
