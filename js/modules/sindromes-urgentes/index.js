// Módulo "Síndromes Hematológicos Urgentes": CID, PTT y Síndrome de Lisis
// Tumoral, navegados como pestañas dentro de una única vista.
import { initTabs } from '../../core/tabs.js';
import { init as initCid } from './cid.js';
import { init as initPtt } from './ptt.js';

export function init() {
    initTabs(document.getElementById('panel-sindromes-tabs'));
    initCid();
    initPtt();
}
