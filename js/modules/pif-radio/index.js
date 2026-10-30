// Módulo «Radiología · PIF»: contenido de la rotación PIF de Radiología (sección de tórax).
// Hoy, un cuaderno («Placa portátil de UCI»); los demás objetivos salen en su menú como pendientes,
// con enlace a lo que ya hay en la app.
import { createViewSwitcher } from '../../core/navigation.js';
import { temasPifRadio, preguntasPifRadio } from '../../data/pif-radio-preguntas.js';
import { init as initPlaca } from './radio-placa.js';

export const quizTriggerId = ['btn-pif-radio-repasar'];
export const quizBanco = [...preguntasPifRadio];
const ASIGNATURA = 'Radiología · PIF';
export const quizTemas = temasPifRadio.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Placa portátil de UCI' }));

export function init() {
    const nivel = createViewSwitcher({
        menu: document.getElementById('pif-radio-menu-view'),
        placa: document.getElementById('pif-radio-placa-view'),
    });
    document.getElementById('btn-pif-radio-placa').addEventListener('click', () => nivel.show('placa'));
    document.querySelectorAll('.btn-volver-pif-radio-menu').forEach(b => b.addEventListener('click', () => nivel.show('menu')));
    initPlaca();
    nivel.show('menu');
    return {
        volverAlMenu: () => nivel.show('menu'),
        irAFicha: nivel.irAFicha,
    };
}
