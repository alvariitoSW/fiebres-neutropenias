// Mayéutica del bloque 4 (Marino caps. 31-38: ácido-base, riñón, agua e iones): un archivo por grupo de fichas.
// Para añadir uno: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo monta libros/index.js (fichas mr-).
import { MAYEUTICA_RINON_1 } from './b4-rinon-1.js';   // 4B · el riñón que falla (fichas 7, 8, 10)
import { MAYEUTICA_RINON_2 } from './b4-rinon-2.js';   // 4B · el riñón que falla (fichas 9, 11)

export const MAYEUTICA_B4 = {
    ...MAYEUTICA_RINON_1,
    ...MAYEUTICA_RINON_2,
};
