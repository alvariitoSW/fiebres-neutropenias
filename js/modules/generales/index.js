// Módulo "Escalas Generales": qSOFA, criterios SRIS, SOFA y Glasgow.
// Cada escala vive en su propio archivo; este índice solo las agrupa.
import { init as initQSOFA } from './qsofa.js';
import { init as initSRIS } from './sris.js';
import { init as initSOFA } from './sofa.js';
import { init as initGlasgow } from './glasgow.js';

export function init() {
    initQSOFA();
    initSRIS();
    initSOFA();
    initGlasgow();
}
