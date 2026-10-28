// Módulo «Cardiología · PIF»: contenido de la rotación PIF de Cardiología.
// Hoy, un cuaderno («ECG y arritmias»); los demás objetivos de la rotación salen
// en su menú como pendientes, con enlace a lo que ya hay en la app.
import { createViewSwitcher } from '../../core/navigation.js';
import { temasPifEcgA, preguntasPifEcgA } from '../../data/pif-ecg-preguntas-a.js';
import { temasPifEcgB, preguntasPifEcgB } from '../../data/pif-ecg-preguntas-b.js';
import { temasPifEcgC, preguntasPifEcgC } from '../../data/pif-ecg-preguntas-c.js';
import { temasPifEcgD, preguntasPifEcgD } from '../../data/pif-ecg-preguntas-d.js';
import { temasPifEcgE, preguntasPifEcgE } from '../../data/pif-ecg-ejercicios.js';
import { init as initEcg } from './ecg-arritmias.js';
import { init as initEjercicios } from './ecg-ejercicios.js';
import { arrancar } from '../../core/ui.js';

export const quizTriggerId = ['btn-pif-ecg-repasar'];
export const quizBanco = [...preguntasPifEcgA, ...preguntasPifEcgB, ...preguntasPifEcgD, ...preguntasPifEcgC, ...preguntasPifEcgE];
const ASIGNATURA = 'Cardiología · PIF';
export const quizTemas = [...temasPifEcgA, ...temasPifEcgB, ...temasPifEcgD, ...temasPifEcgC, ...temasPifEcgE]
    .map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'ECG y arritmias' }));

export function init() {
    const nivel = createViewSwitcher({
        menu: document.getElementById('pif-cardio-menu-view'),
        ecgArritmias: document.getElementById('pif-ecg-view'),
    });
    document.getElementById('btn-pif-ecg').addEventListener('click', () => nivel.show('ecgArritmias'));
    document.querySelectorAll('.btn-volver-pif-cardio-menu').forEach(b => b.addEventListener('click', () => nivel.show('menu')));
    initEcg();
    arrancar('pif-ecg-ejercicios', initEjercicios);
    nivel.show('menu');
    return {
        volverAlMenu: () => nivel.show('menu'),
        irAFicha: nivel.irAFicha,
    };
}
