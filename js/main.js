// Punto de entrada de la aplicación.
// 1. Carga los fragmentos HTML de cada calculadora (data-include).
// 2. Activa el comportamiento genérico de acordeones.
// 3. Inicializa cada módulo clínico (listeners + cálculo inicial).
import { includeAll } from './core/include.js';
import { initAccordions } from './core/accordion.js';
import * as generales from './modules/generales/index.js';
import * as neutropeniaFebril from './modules/neutropenia-febril/index.js';

async function start() {
    await includeAll();
    initAccordions();
    generales.init();
    neutropeniaFebril.init();
}

start();
