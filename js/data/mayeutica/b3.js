// Mayéutica del bloque 3 (Marino caps. 14-22: shock, corazón y embolia de pulmón): un archivo por sub-bloque.
// Para añadir uno: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo montan cardiologia/merino-cardiologia.js
// (fichas mc-) y neumologia/merino-neumologia.js (fichas neumo-).
import { MAYEUTICA_SHOCK_1 } from './b3a-shock-1.js';
import { MAYEUTICA_SHOCK_2 } from './b3a-shock-2.js';
import { MAYEUTICA_SHOCK_3 } from './b3a-shock-3.js';

export const MAYEUTICA_B3 = {
    ...MAYEUTICA_SHOCK_1,
    ...MAYEUTICA_SHOCK_2,
    ...MAYEUTICA_SHOCK_3,
};
