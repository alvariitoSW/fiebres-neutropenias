// Mayéutica del bloque 6a (Marino caps. 45-47, Libros → Marino → Neurología): un archivo por grupo de fichas.
// Para añadir un grupo: su archivo (mismo formato que b1-fluidos.js) y una línea aquí (cada grupo, solo la suya).
// Lo monta libros/index.js después de la vista Visual de los caps. 45-53.
import { MAYEUTICA_COMA } from './b6a-coma.js';
import { MAYEUTICA_CRISIS } from './b6a-crisis.js';
import { MAYEUTICA_CRANEO_1 } from './b6a-craneo-1.js';
import { MAYEUTICA_CRANEO_2 } from './b6a-craneo-2.js';

export const MAYEUTICA_B6A = {
    ...MAYEUTICA_COMA,
    ...MAYEUTICA_CRISIS,
    ...MAYEUTICA_CRANEO_1,
    ...MAYEUTICA_CRANEO_2,
};
