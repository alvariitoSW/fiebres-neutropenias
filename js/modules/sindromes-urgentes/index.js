// Módulo "Síndromes Hematológicos Urgentes": CID, PTT y Síndrome de Lisis
// Tumoral, navegados desde un cuaderno de campo (fichas ilustradas) en vez
// de una barra de pestañas de texto.
import { initCorkboard } from '../../core/corkboard.js';
import { init as initCid } from './cid.js';
import { init as initPtt } from './ptt.js';
import { init as initSlt } from './slt.js';

export function init() {
    initCorkboard('sindromes-corkboard', 'panel-sindromes-tabs');
    initCid();
    initPtt();
    initSlt();
}
