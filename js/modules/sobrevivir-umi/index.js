// Módulo "Sobrevivir a la UMI": manual de orientación interno de la Unidad
// de Medicina Intensiva (HUGCDN), protocolos prácticos de guardia
// transversales a cualquier órgano — no ligados a una especialidad de
// órgano concreta (a diferencia de Cardiología/Nefrología/Neumología).
// Consolidado en una única guía con sus 18 fichas (ver manual-umi.html) —
// mismo patrón de submenú que el resto de especialidades con switcher
// medio propio, aunque hoy solo tenga una entrada.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { preguntasManualUmi, temasManualUmi } from '../../data/manual-umi-preguntas.js';
import { init as initManualUmi } from './manual-umi.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Sobrevivir a la UMI expone aquí su
// banco/temas para que main.js los fusione con el resto de especialidades.
export const quizTriggerId = ['btn-manual-umi-repasar'];
export const quizBanco = [...preguntasManualUmi];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js).
const ASIGNATURA = 'Sobrevivir a la UMI';
export const quizTemas = [
    ...temasManualUmi.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Manual UMI Negrín' })),
];

export function init() {
    const sobrevivirLevel = createViewSwitcher({
        menu: document.getElementById('sobrevivir-umi-menu-view'),
        manualUmi: document.getElementById('manual-umi-view'),
    });

    document.getElementById('btn-manual-umi').addEventListener('click', () => sobrevivirLevel.show('manualUmi'));
    document.querySelectorAll('.btn-volver-sobrevivir-umi-menu').forEach(b => b.addEventListener('click', () => sobrevivirLevel.show('menu')));

    initManualUmi();

    sobrevivirLevel.show('menu');

    // Deja siempre el submenú de guías como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // cardiologia.volverAlMenu()/neumologia.volverAlMenu() ya dan.
    return {
        volverAlMenu: () => sobrevivirLevel.show('menu'),
        // Salto genérico desde OTRAS especialidades, mismo patrón que
        // irAFicha() ya exponen el resto de especialidades con submenú.
        irAFicha: (view, panel, tab) => {
            sobrevivirLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        },
    };
}
