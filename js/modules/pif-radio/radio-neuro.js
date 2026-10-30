// «Neuro urgente» (PIF Radiología): cuaderno de campo con sus fichas y tarjetas Sí/No.
import { initCorkboard } from '../../core/corkboard.js';

export function init() {
    if (!document.getElementById('pif-radio-neuro-corkboard')) return;
    initCorkboard('pif-radio-neuro-corkboard', 'panel-pif-radio-neuro-tabs');
}
