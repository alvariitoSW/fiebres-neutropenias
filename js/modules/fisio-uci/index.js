// Módulo "Fisiopatología UCI": repaso esquematizado de capítulos de "El
// Libro Azul: Bases Fisiopatológicas de la Medicina Crítica". Mismo patrón
// que UCI/Papers Tuiter — un submenú de bloques y, dentro de cada uno, un
// cuaderno de campo con sus temas — nunca se fabrica contenido clínico sin
// una fuente real (ver CLAUDE.md).
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import * as hematologia from './hematologia.js';
import * as viasUrinarias from './vias-urinarias.js';
import * as cardiologia from './cardiologia.js';
import * as inmunologia from './inmunologia.js';
import { preguntasFuciHematologia, temasFuciHematologia } from '../../data/fisio-uci-hematologia-preguntas.js';
import { preguntasFuciViasUrinarias, temasFuciViasUrinarias } from '../../data/fisio-uci-vias-urinarias-preguntas.js';
import { preguntasCardiologia, temasCardiologia } from '../../data/fisio-uci-cardiologia-preguntas.js';
import { preguntasFuciInmunologia, temasFuciInmunologia } from '../../data/fisio-uci-inmunologia-preguntas.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Fisiopatología UCI expone aquí su
// banco/temas para que main.js los fusione con los del resto de
// especialidades en una única llamada.
export const quizTriggerId = ['btn-fuci-hemato-repasar', 'btn-fuci-vu-repasar', 'btn-fuci-cardio-repasar', 'btn-fuci-inmuno-repasar'];
export const quizBanco = [...preguntasFuciHematologia, ...preguntasFuciViasUrinarias, ...preguntasCardiologia, ...preguntasFuciInmunologia];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js) —
// cada "bloque" es uno de los 4 bloques del submenú de Fisiopatología UCI.
const ASIGNATURA = 'Fisiopatología UCI';
export const quizTemas = [
    ...temasFuciHematologia.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Hematología y Hemostasia' })),
    ...temasFuciViasUrinarias.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Vías Urinarias' })),
    ...temasCardiologia.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Cardiología' })),
    ...temasFuciInmunologia.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Inmunología' })),
];

export function init() {
    const fisioUciLevel = createViewSwitcher({
        menu: document.getElementById('fisio-uci-menu-view'),
        hematologia: document.getElementById('fisio-uci-hematologia-view'),
        viasUrinarias: document.getElementById('fisio-uci-vias-urinarias-view'),
        cardiologia: document.getElementById('fisio-uci-cardiologia-view'),
        inmunologia: document.getElementById('fisio-uci-inmunologia-view'),
    });

    document.getElementById('btn-fuci-hematologia').addEventListener('click', () => fisioUciLevel.show('hematologia'));
    document.getElementById('btn-fuci-vias-urinarias').addEventListener('click', () => fisioUciLevel.show('viasUrinarias'));
    document.getElementById('btn-fuci-cardiologia').addEventListener('click', () => fisioUciLevel.show('cardiologia'));
    document.getElementById('btn-fuci-inmunologia').addEventListener('click', () => fisioUciLevel.show('inmunologia'));
    document.querySelectorAll('.btn-volver-fuci-menu').forEach(b => b.addEventListener('click', () => fisioUciLevel.show('menu')));

    hematologia.init();
    viasUrinarias.init();
    cardiologia.init();
    inmunologia.init();

    fisioUciLevel.show('menu');

    // Deja siempre el submenú de bloques como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // uciPapers.volverAlMenu() y nefrologia.volverAlMapa().
    return {
        volverAlMenu: () => fisioUciLevel.show('menu'),
        // Salto genérico desde OTRAS especialidades (p. ej. la guía
        // transversal de tratamiento IRA/ERC de Nefrología, enlazando a
        // una ficha concreta de Vías Urinarias) — mismo patrón que
        // `irAFicha` expone en nefrologia/index.js, en la dirección
        // contraria.
        irAFicha: (view, panel, tab) => {
            fisioUciLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        },
    };
}
