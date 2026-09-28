// Módulo "Neumología": manejo respiratorio en el paciente crítico. Mismo
// patrón de submenú de guías que Cardiología — hoy con una sola guía
// (Merino Neumología), extensible si llegan más fuentes en el futuro.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { preguntasMerinoNeumologia, temasMerinoNeumologia } from '../../data/merino-neumologia-preguntas.js';
import { init as initMerinoNeumologia } from './merino-neumologia.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Neumología expone aquí su banco/temas para
// que main.js los fusione con el resto de especialidades.
export const quizTriggerId = ['btn-merino-neumo-repasar'];
export const quizBanco = [...preguntasMerinoNeumologia];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js).
const ASIGNATURA = 'Neumología';
export const quizTemas = [
    ...temasMerinoNeumologia.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Merino Neumología' })),
];

export function init() {
    const neumoLevel = createViewSwitcher({
        menu: document.getElementById('neumologia-menu-view'),
        merinoNeumologia: document.getElementById('merino-neumo-view'),
    });

    document.getElementById('btn-merino-neumo').addEventListener('click', () => neumoLevel.show('merinoNeumologia'));
    document.querySelectorAll('.btn-volver-neumo-menu').forEach(b => b.addEventListener('click', () => neumoLevel.show('menu')));

    initMerinoNeumologia();

    neumoLevel.show('menu');

    // Deja siempre el submenú de guías como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // cardiologia.volverAlMenu() da a Cardiología.
    return {
        volverAlMenu: () => neumoLevel.show('menu'),
        // Salto genérico desde OTRAS especialidades, mismo patrón que
        // irAFicha() ya exponen nefrologia/fisio-uci/uci-papers/cardiologia.
        irAFicha: (view, panel, tab) => {
            neumoLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        },
    };
}
