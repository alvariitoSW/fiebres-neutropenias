// Mayéutica del bloque 5 (Marino caps. 39-44: abdomen y temperatura): un archivo por grupo de fichas.
// Para añadir uno: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo monta libros/index.js.
import { MAYEUTICA_B5_5A_1 } from './b5-5a-1.js';
import { MAYEUTICA_B5_5A_2 } from './b5-5a-2.js';
import { MAYEUTICA_ABDOMEN_1 } from './b5-abdomen-1.js';   // 5B: pancreatitis (fichas 5-6) y el caso de Bartolomé
import { MAYEUTICA_ABDOMEN_2 } from './b5-abdomen-2.js';   // 5B: colecistitis, peritonitis y C. difficile (fichas 7-9)
import { MAYEUTICA_FIEBRE } from './b5-fiebre.js';            // 5C: la fiebre en la UCI (fichas 10-13), casos de Celestino y Felisa
import { MAYEUTICA_TERMOSTATO } from './b5-termostato.js';   // 5D: el termostato (calor, fármacos, hipotermia, antipiréticos)

export const MAYEUTICA_B5 = {
    ...MAYEUTICA_B5_5A_1,
    ...MAYEUTICA_B5_5A_2,
    ...MAYEUTICA_ABDOMEN_1,
    ...MAYEUTICA_ABDOMEN_2,
    ...MAYEUTICA_FIEBRE,
    ...MAYEUTICA_TERMOSTATO,
};
