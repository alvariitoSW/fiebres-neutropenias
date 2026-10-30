// Mayéutica del bloque 3 (Marino caps. 14-22: shock, corazón y embolia de pulmón): un archivo por sub-bloque.
// Para añadir uno: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo montan cardiologia/merino-cardiologia.js
// (fichas mc-) y neumologia/merino-neumologia.js (fichas neumo-).
import { MAYEUTICA_SHOCK_1 } from './b3a-shock-1.js';
import { MAYEUTICA_SHOCK_2 } from './b3a-shock-2.js';
import { MAYEUTICA_SHOCK_3 } from './b3a-shock-3.js';
import { MAYEUTICA_TAQUI_1 } from './b3c-taqui-1.js';
import { MAYEUTICA_TAQUI_2 } from './b3c-taqui-2.js';
import { MAYEUTICA_PARO_1 } from './b3c-paro-1.js';
import { MAYEUTICA_PARO_2 } from './b3c-paro-2.js';
import { MAYEUTICA_CARDIOGENICO_1 } from './b3b-cardiogenico-1.js';
import { MAYEUTICA_CARDIOGENICO_2 } from './b3b-cardiogenico-2.js';
import { MAYEUTICA_CARDIOGENICO_3 } from './b3b-cardiogenico-3.js';
import { MAYEUTICA_IC } from './b3b-ic.js';
import { MAYEUTICA_DISECCION } from './b3b-diseccion.js';

export const MAYEUTICA_B3 = {
    ...MAYEUTICA_SHOCK_1,
    ...MAYEUTICA_SHOCK_2,
    ...MAYEUTICA_SHOCK_3,
    ...MAYEUTICA_TAQUI_1,
    ...MAYEUTICA_TAQUI_2,
    ...MAYEUTICA_PARO_1,
    ...MAYEUTICA_PARO_2,
    ...MAYEUTICA_CARDIOGENICO_1,
    ...MAYEUTICA_CARDIOGENICO_2,
    ...MAYEUTICA_CARDIOGENICO_3,
    ...MAYEUTICA_IC,
    ...MAYEUTICA_DISECCION,
};
