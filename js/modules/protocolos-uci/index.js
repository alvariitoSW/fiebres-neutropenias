// Módulo "Protocolos UCI": protocolos prácticos de guardia transversales a
// cualquier órgano — no ligados a una especialidad de órgano concreta (a
// diferencia de Cardiología/Nefrología/Neumología). Mismo patrón de
// submenú de guías que Cardiología/Neumología/UCI Papers Tuiter — hoy con
// una sola guía (Manual UMI Negrín), extensible si llegan más fuentes.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { preguntasManualUmiProtocolos, temasManualUmiProtocolos } from '../../data/manual-umi-protocolos-preguntas.js';
import { init as initManualUmiProtocolos } from './manual-umi-protocolos.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Protocolos UCI expone aquí su banco/temas
// para que main.js los fusione con el resto de especialidades.
export const quizTriggerId = ['btn-umi-protocolos-repasar'];
export const quizBanco = [...preguntasManualUmiProtocolos];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js).
const ASIGNATURA = 'Protocolos UCI';
export const quizTemas = [
    ...temasManualUmiProtocolos.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Manual UMI Negrín' })),
];

export function init() {
    const protocolosLevel = createViewSwitcher({
        menu: document.getElementById('protocolos-uci-menu-view'),
        manualUmi: document.getElementById('umi-protocolos-view'),
    });

    document.getElementById('btn-umi-protocolos').addEventListener('click', () => protocolosLevel.show('manualUmi'));
    document.querySelectorAll('.btn-volver-protocolos-menu').forEach(b => b.addEventListener('click', () => protocolosLevel.show('menu')));

    initManualUmiProtocolos();

    protocolosLevel.show('menu');

    // Deja siempre el submenú de guías como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // cardiologia.volverAlMenu()/neumologia.volverAlMenu() ya dan.
    return {
        volverAlMenu: () => protocolosLevel.show('menu'),
        // Salto genérico desde OTRAS especialidades, mismo patrón que
        // irAFicha() ya exponen el resto de especialidades con submenú.
        irAFicha: (view, panel, tab) => {
            protocolosLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        },
    };
}
