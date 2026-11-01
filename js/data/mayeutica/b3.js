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
import { MAYEUTICA_SCA } from './b3b-sca.js';
import { MAYEUTICA_DISECCION } from './b3b-diseccion.js';
import { MAYEUTICA_TEP } from './b3b-tep.js';
import { MAYEUTICA_RESPIRADOR } from './b3d-respirador.js';
import { MAYEUTICA_PEEP_OCULTA } from './b3d-peep.js';
import { MAYEUTICA_EPOC } from './b3d-epoc.js';
import { MAYEUTICA_ASMA } from './b3d-asma.js';
import { MAYEUTICA_VNI } from './b3d-vni.js';
import { MAYEUTICA_SDRA } from './b3d-sdra.js';
import { MAYEUTICA_SDRA_2 } from './b3d-sdra-2.js';
import { MAYEUTICA_OXIGENO } from './b3d-oxigeno.js';
import { MAYEUTICA_OXIGENO_2 } from './b3d-oxigeno-2.js';
import { MAYEUTICA_TUBO } from './b3d-tubo.js';
import { MAYEUTICA_DESTETE } from './b3d-destete.js';
import { MAYEUTICA_NAV } from './b3d-nav.js';
import { MAYEUTICA_NAV_2 } from './b3d-nav-2.js';

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
    ...MAYEUTICA_SCA,
    ...MAYEUTICA_DISECCION,
    ...MAYEUTICA_TEP,
    ...MAYEUTICA_RESPIRADOR,
    ...MAYEUTICA_PEEP_OCULTA,
    ...MAYEUTICA_EPOC,
    ...MAYEUTICA_ASMA,
    ...MAYEUTICA_VNI,
    ...MAYEUTICA_SDRA,
    ...MAYEUTICA_SDRA_2,
    ...MAYEUTICA_OXIGENO,
    ...MAYEUTICA_OXIGENO_2,
    ...MAYEUTICA_TUBO,
    ...MAYEUTICA_DESTETE,
    ...MAYEUTICA_NAV,
    ...MAYEUTICA_NAV_2,
};
