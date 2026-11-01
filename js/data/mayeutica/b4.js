// Mayéutica del bloque 4 (Marino caps. 31-38: ácido-base, riñón, agua e iones): un archivo por grupo de Estudiar.
// Para añadir uno: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo monta libros/index.js en las
// fichas mr- de Marino · Ácido-base, renal y electrolitos (después de su vista Visual).
import { MAYEUTICA_GASOMETRIA_1 } from './b4a-gasometria-1.js';   // 4A · la gasometría
import { MAYEUTICA_GASOMETRIA_2 } from './b4a-gasometria-2.js';   // 4A · la gasometría
import { MAYEUTICA_RINON_1 } from './b4-rinon-1.js';   // 4B · el riñón que falla (fichas 7, 8, 10)
import { MAYEUTICA_RINON_2 } from './b4-rinon-2.js';   // 4B · el riñón que falla (fichas 9, 11)
import { MAYEUTICA_B4C } from './b4c-agua.js';         // 4C · el agua y el sodio (fichas 12-15)
import { MAYEUTICA_IONES_1 } from './b4d-iones-1.js';  // 4D · los iones de la célula: potasio (fichas 16, 17, 18)
import { MAYEUTICA_IONES_2 } from './b4d-iones-2.js';  // 4D · los iones de la célula: magnesio (fichas 19, 20)
import { MAYEUTICA_IONES_3 } from './b4d-iones-3.js';  // 4D · los iones de la célula: calcio y fósforo (fichas 21, 22, 23)

export const MAYEUTICA_B4 = {
    ...MAYEUTICA_GASOMETRIA_1,
    ...MAYEUTICA_GASOMETRIA_2,
    ...MAYEUTICA_RINON_1,
    ...MAYEUTICA_RINON_2,
    ...MAYEUTICA_B4C,
    ...MAYEUTICA_IONES_1,
    ...MAYEUTICA_IONES_2,
    ...MAYEUTICA_IONES_3,
};
