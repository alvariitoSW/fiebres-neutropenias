// Módulo "Neutropenias Febriles": triaje + MASCC, arquitectura diagnóstica,
// tratamiento empírico, tratamiento dirigido/PK-PD y microorganismos, con
// navegación entre esas 5 vistas. Cada pieza vive en su propio archivo.
import { init as initTriajeMascc } from './triaje-mascc.js';
import { initEscaleraMascc } from './mascc-escalera.js';
import { initTriajeCuerpo } from './triaje-cuerpo.js';
import { initDiagnosticoLinea } from './diagnostico-linea.js';
import { initEmpiricoEscalera } from './empirico-escalera.js';
import { initEmpiricoFocos } from './empirico-focos.js';
import { initEvolucionRegla } from './evolucion-regla.js';
import { initCateterBalanza } from './cateter-balanza.js';
import { init as initDiagnostico } from './diagnostico.js';
import { init as initTratamientoEmpirico } from './tratamiento-empirico.js';
import { init as initCateterMdr } from './cateter-mdr.js';
import { init as initPkpd } from './pkpd.js';
import { init as initMicroorganismos } from './microorganismos.js';
import { init as initNavigation } from './navigation.js';

export function init() {
    initNavigation();
    initTriajeMascc();
    // Vistas Visual: después de las calculadoras, porque escriben en sus casillas.
    initTriajeCuerpo();
    initEscaleraMascc();
    initDiagnostico();
    initDiagnosticoLinea();
    initTratamientoEmpirico();
    initEmpiricoEscalera();
    initEmpiricoFocos();
    initCateterMdr();
    // Escriben en calculadoras del empírico y del dirigido: van después de ambas.
    initEvolucionRegla();
    initCateterBalanza();
    initPkpd();
    initMicroorganismos();
}
