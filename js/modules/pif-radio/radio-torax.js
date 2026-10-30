// «Tórax de UCI» (PIF Radiología): cuaderno de campo con sus fichas y tarjetas Sí/No.
import { initCorkboard } from '../../core/corkboard.js';

export function init() {
    if (!document.getElementById('pif-radio-torax-corkboard')) return;
    initCorkboard('pif-radio-torax-corkboard', 'panel-pif-radio-torax-tabs');
}
