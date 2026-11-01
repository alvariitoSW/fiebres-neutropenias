// Mayéutica del grupo 5D · El termostato (Marino caps. 43-44): las cuatro fichas ma-calor, ma-hipertermia-farmacos, ma-hipotermia y ma-antipireticos.
// Los datos viven en dos archivos (mismo formato que b1-fluidos.js) para no pasar de 700 líneas; aquí se juntan.
import { MAYEUTICA_TERMOSTATO_CALOR } from './b5-termostato-calor.js';
import { MAYEUTICA_TERMOSTATO_FRIO } from './b5-termostato-frio.js';

export const MAYEUTICA_TERMOSTATO = {
    ...MAYEUTICA_TERMOSTATO_CALOR,
    ...MAYEUTICA_TERMOSTATO_FRIO,
};
