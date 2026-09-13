// Módulo "Escalas Generales": qSOFA, criterios SRIS, SOFA, Glasgow,
// APACHE II y el índice de comorbilidad de Charlson.
// Cada escala vive en su propio archivo; este índice solo las agrupa.
import { init as initQSOFA } from './qsofa.js';
import { init as initSRIS } from './sris.js';
import { init as initSOFA } from './sofa.js';
import { init as initGlasgow } from './glasgow.js';
import { init as initApache2 } from './apache2.js';
import { init as initCharlson } from './charlson.js';

export function init() {
    initQSOFA();
    initSRIS();
    initSOFA();
    initGlasgow();
    // APACHE II lee el GCS ya calculado por initGlasgow(), así que se
    // inicializa después de que sus selects .gcs-input ya existan.
    initApache2();
    initCharlson();
}
