// Mayéutica del bloque 1 (Marino caps. 1-11, Libros → Marino → Fundamentos): un archivo por grupo de fichas.
// Para añadir un grupo: su archivo (mismo formato que b1-fluidos.js) y una línea aquí. Lo monta libros/index.js.
import { MAYEUTICA_FLUIDOS } from './b1-fluidos.js';
import { MAYEUTICA_HEMODINAMICA } from './b1-hemodinamica.js';
import { MAYEUTICA_SIN_MODELO } from './b1-sin-modelo.js';

export const MAYEUTICA_B1 = {
    ...MAYEUTICA_FLUIDOS,
    ...MAYEUTICA_HEMODINAMICA,
    ...MAYEUTICA_SIN_MODELO,
};
