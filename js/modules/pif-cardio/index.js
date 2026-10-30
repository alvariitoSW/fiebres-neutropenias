// Módulo «Cardiología · PIF»: contenido de la rotación PIF de Cardiología.
// Seis objetivos: «ECG y arritmias» tiene su cuaderno; los otros cinco son los capítulos de un segundo cuaderno
// («Objetivos de la rotación»): el objetivo literal, «léelo en orden» y los enlaces a lo que ya hay en la app.
import { createViewSwitcher } from '../../core/navigation.js';
import { temasPifEcgA, preguntasPifEcgA } from '../../data/pif-ecg-preguntas-a.js';
import { temasPifEcgB, preguntasPifEcgB } from '../../data/pif-ecg-preguntas-b.js';
import { temasPifEcgC, preguntasPifEcgC } from '../../data/pif-ecg-preguntas-c.js';
import { temasPifEcgD, preguntasPifEcgD } from '../../data/pif-ecg-preguntas-d.js';
import { temasPifEcgE, preguntasPifEcgE } from '../../data/pif-ecg-ejercicios.js';
import { init as initEcg } from './ecg-arritmias.js';
import { init as initEjercicios } from './ecg-ejercicios.js';
import { arrancar } from '../../core/ui.js';
import { initCorkboard } from '../../core/corkboard.js';
import { rotacionesPif } from '../../data/pif-rotaciones.js';

export const quizTriggerId = ['btn-pif-ecg-repasar'];
export const quizBanco = [...preguntasPifEcgA, ...preguntasPifEcgB, ...preguntasPifEcgD, ...preguntasPifEcgC, ...preguntasPifEcgE];
const ASIGNATURA = 'Cardiología · PIF';
export const quizTemas = [...temasPifEcgA, ...temasPifEcgB, ...temasPifEcgD, ...temasPifEcgC, ...temasPifEcgE]
    .map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'ECG y arritmias' }));

// El objetivo de cada capítulo se lee tal cual de los datos del PIF (nunca se copia a mano).
function initObjetivos() {
    initCorkboard('pif-cardio-obj-corkboard', 'panel-pif-cardio-obj-tabs');
    const obj = rotacionesPif.R1.find(r => r.id === 'cardio-pif')?.objetivos || [];
    document.querySelectorAll('.pifobj-objetivo').forEach(p => { p.textContent = obj[Number(p.dataset.objetivo)] || ''; });
}

export function init() {
    const nivel = createViewSwitcher({
        menu: document.getElementById('pif-cardio-menu-view'),
        ecgArritmias: document.getElementById('pif-ecg-view'),
        objetivos: document.getElementById('pif-cardio-objetivos-view'),
    });
    document.getElementById('btn-pif-ecg').addEventListener('click', () => nivel.show('ecgArritmias'));
    document.querySelectorAll('.btn-volver-pif-cardio-menu').forEach(b => b.addEventListener('click', () => nivel.show('menu')));
    initEcg();
    arrancar('pif-cardio-objetivos', initObjetivos);
    arrancar('pif-ecg-ejercicios', initEjercicios);
    nivel.show('menu');
    return {
        volverAlMenu: () => nivel.show('menu'),
        irAFicha: nivel.irAFicha,
    };
}
