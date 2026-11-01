// Mayéutica del bloque 5, grupo C · La fiebre en la UCI (Marino caps. 42 y 44): fichas 13 ma-fiebre-basicos,
// 10 ma-infecciones-nosocomiales, 11 ma-itu-sonda y 12 ma-candiduria. Dos archivos por tamaño; este los junta.
import { MAYEUTICA_FIEBRE_1 } from './b5-fiebre-1.js';
import { MAYEUTICA_FIEBRE_2 } from './b5-fiebre-2.js';

export const MAYEUTICA_FIEBRE = {
    ...MAYEUTICA_FIEBRE_1,
    ...MAYEUTICA_FIEBRE_2,
};
