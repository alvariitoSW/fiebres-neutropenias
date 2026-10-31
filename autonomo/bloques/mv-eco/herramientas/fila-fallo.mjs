// Fila «Fallo VI 100 %» de contrato.test.mjs: fevd, tapse, psap, papd, pvc, pam, gc, vd/vi, pared, E/e′ (contrato de la app)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { contratoDe } from '../../../../js/modules/eco/contrato.mjs';
import { puenteHoy } from '../../../../js/modules/eco/contrato-puente-hoy.mjs';
import { aplicarEscenario } from '../../../../js/modules/eco/escenarios.mjs';
const m = aplicarEscenario((() => { const x = crearMotor(); x.correr(12); return x; })(), 'fallo', 1);   // como la app (10 s)
const L = contratoDe(m, puenteHoy(m)).latido;
console.log(Object.fromEntries(['feVd','tapse','paps','papd','pvc','pam','gc','vdvi','pared','eE'].map(k => [k, L[k]])));
