// Mayéutica del bloque 6a (Marino caps. 45-47: neurología): un archivo por grupo de fichas.
// Para añadir uno: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo monta libros/marino-neuro.js.
import { MAYEUTICA_CRANEO_1 } from './b6a-craneo-1.js';
import { MAYEUTICA_CRANEO_2 } from './b6a-craneo-2.js';

export const MAYEUTICA_B6A = {
    ...MAYEUTICA_CRANEO_1,
    ...MAYEUTICA_CRANEO_2,
};
