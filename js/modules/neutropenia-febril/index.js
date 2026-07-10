// Módulo "Neutropenias Febriles": triaje + MASCC, arquitectura diagnóstica,
// tratamiento empírico y tratamiento dirigido/PK-PD, con navegación entre
// esas 4 vistas. Cada pieza vive en su propio archivo.
import { init as initTriajeMascc } from './triaje-mascc.js';
import { init as initDiagnostico } from './diagnostico.js';
import { init as initTratamientoEmpirico } from './tratamiento-empirico.js';
import { init as initCateterMdr } from './cateter-mdr.js';
import { init as initPkpd } from './pkpd.js';
import { init as initNavigation } from './navigation.js';

export function init() {
    initNavigation();
    initTriajeMascc();
    initDiagnostico();
    initTratamientoEmpirico();
    initCateterMdr();
    initPkpd();
}
