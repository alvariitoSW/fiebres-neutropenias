// Módulo "Fisiopatología UCI": repaso esquematizado de capítulos de "El
// Libro Azul: Bases Fisiopatológicas de la Medicina Crítica". Mismo patrón
// que UCI/Papers Tuiter — un submenú de bloques y, dentro de cada uno, un
// cuaderno de campo con sus temas — nunca se fabrica contenido clínico sin
// una fuente real (ver CLAUDE.md).
import { createViewSwitcher } from '../../core/navigation.js';
import * as hematologia from './hematologia.js';
import * as viasUrinarias from './vias-urinarias.js';
import * as cardiologia from './cardiologia.js';
import { preguntasFuciHematologia, temasFuciHematologia } from '../../data/fisio-uci-hematologia-preguntas.js';
import { preguntasFuciViasUrinarias, temasFuciViasUrinarias } from '../../data/fisio-uci-vias-urinarias-preguntas.js';
import { preguntasCardiologia, temasCardiologia } from '../../data/fisio-uci-cardiologia-preguntas.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Fisiopatología UCI expone aquí su
// banco/temas para que main.js los fusione con los del resto de
// especialidades en una única llamada.
export const quizTriggerId = ['btn-fuci-hemato-repasar', 'btn-fuci-vu-repasar', 'btn-fuci-cardio-repasar'];
export const quizBanco = [...preguntasFuciHematologia, ...preguntasFuciViasUrinarias, ...preguntasCardiologia];
export const quizTemas = [...temasFuciHematologia, ...temasFuciViasUrinarias, ...temasCardiologia];

export function init() {
    const fisioUciLevel = createViewSwitcher({
        menu: document.getElementById('fisio-uci-menu-view'),
        hematologia: document.getElementById('fisio-uci-hematologia-view'),
        viasUrinarias: document.getElementById('fisio-uci-vias-urinarias-view'),
        cardiologia: document.getElementById('fisio-uci-cardiologia-view'),
    });

    document.getElementById('btn-fuci-hematologia').addEventListener('click', () => fisioUciLevel.show('hematologia'));
    document.getElementById('btn-fuci-vias-urinarias').addEventListener('click', () => fisioUciLevel.show('viasUrinarias'));
    document.getElementById('btn-fuci-cardiologia').addEventListener('click', () => fisioUciLevel.show('cardiologia'));
    document.querySelectorAll('.btn-volver-fuci-menu').forEach(b => b.addEventListener('click', () => fisioUciLevel.show('menu')));

    hematologia.init();
    viasUrinarias.init();
    cardiologia.init();

    fisioUciLevel.show('menu');

    // Deja siempre el submenú de bloques como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // uciPapers.volverAlMenu() y nefrologia.volverAlMapa().
    return {
        volverAlMenu: () => fisioUciLevel.show('menu'),
    };
}
