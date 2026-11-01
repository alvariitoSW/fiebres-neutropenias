// Mayéutica del bloque 5 (Marino caps. 39-44: abdomen y temperatura): un archivo por grupo de fichas.
// Para añadir uno: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo monta libros/index.js.
import { MAYEUTICA_B5_5A_1 } from './b5-5a-1.js';
import { MAYEUTICA_B5_5A_2 } from './b5-5a-2.js';

export const MAYEUTICA_B5 = {
    ...MAYEUTICA_B5_5A_1,
    ...MAYEUTICA_B5_5A_2,
};
