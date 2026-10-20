// Mayéutica del bloque 2 (Marino caps. 12-13, Hematología → Merino HEMATO): un archivo por grupo de fichas.
// Para añadir un grupo: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo monta merino-hemato/index.js.
import { MAYEUTICA_SANGRE } from './b2-sangre.js';
import { MAYEUTICA_HEMOSTASIA } from './b2-hemostasia.js';

export const MAYEUTICA_B2 = {
    ...MAYEUTICA_SANGRE,
    ...MAYEUTICA_HEMOSTASIA,
};
