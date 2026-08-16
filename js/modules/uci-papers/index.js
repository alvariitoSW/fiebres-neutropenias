// Módulo "UCI / Papers Tuiter": resúmenes de papers de Medicina Intensiva
// compartidos en redes sociales. Cada paper es una entrada de un submenú
// propio (mismo patrón que Citopenias/Trasplante en Hematología) y, dentro
// de él, un cuaderno de campo con sus bloques temáticos — nunca se fabrica
// contenido clínico sin una fuente real (ver CLAUDE.md).
import { createViewSwitcher } from '../../core/navigation.js';
import { initCorkboard } from '../../core/corkboard.js';
import { preguntasShockSeptico, temasShockSeptico } from '../../data/shock-septico-preguntas.js';
import { preguntasOxidoNitrico, temasOxidoNitrico } from '../../data/oxido-nitrico-preguntas.js';
import { preguntasVdLra, temasVdLra } from '../../data/vd-lra-preguntas.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). UCI/Papers Tuiter expone aquí su
// banco/temas para que main.js los fusione con los de Hematología y
// Nefrología en una única llamada.
export const quizTriggerId = ['btn-uci-shock-repasar', 'btn-no-repasar', 'btn-vdlra-repasar'];
export const quizBanco = [...preguntasShockSeptico, ...preguntasOxidoNitrico, ...preguntasVdLra];
export const quizTemas = [...temasShockSeptico, ...temasOxidoNitrico, ...temasVdLra];

export function init() {
    const uciLevel = createViewSwitcher({
        menu: document.getElementById('uci-papers-menu-view'),
        shockSeptico: document.getElementById('uci-paper-shock-view'),
        oxidoNitrico: document.getElementById('uci-paper-no-view'),
        vdLra: document.getElementById('uci-paper-vdlra-view'),
    });

    document.getElementById('btn-paper-shock').addEventListener('click', () => uciLevel.show('shockSeptico'));
    document.getElementById('btn-paper-no').addEventListener('click', () => uciLevel.show('oxidoNitrico'));
    document.getElementById('btn-paper-vdlra').addEventListener('click', () => uciLevel.show('vdLra'));
    document.querySelectorAll('.btn-volver-uci-menu').forEach(b => b.addEventListener('click', () => uciLevel.show('menu')));

    initCorkboard('uci-shock-corkboard', 'panel-uci-shock-tabs');
    initCorkboard('no-corkboard', 'panel-no-tabs');
    initCorkboard('vdlra-corkboard', 'panel-vdlra-tabs');

    uciLevel.show('menu');

    // Deja siempre el submenú de papers como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // nefrologia.volverAlMapa() y atlas.reset() ya dan a Nefrología y
    // Hematología. Lo usa home/index.js.
    return {
        volverAlMenu: () => uciLevel.show('menu'),
    };
}
