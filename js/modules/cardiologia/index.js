// Módulo "Cardiología": guías de práctica clínica de manejo (no
// fisiopatología — eso vive en Fisiopatología UCI → Cardiología, fuente
// distinta, El Libro Azul). Mismo patrón de submenú de bloques que
// UCI/Papers Tuiter y Fisiopatología UCI: cada guía es una entrada de este
// submenú con su propio cuaderno de campo.
import { createViewSwitcher } from '../../core/navigation.js';
import { initCorkboard, openCorkboardTopic } from '../../core/corkboard.js';
import { preguntasInsuficienciaCardiaca, temasInsuficienciaCardiaca } from '../../data/insuficiencia-cardiaca-preguntas.js';
import { init as initInsuficienciaCardiaca } from './insuficiencia-cardiaca.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Cardiología expone aquí su banco/temas para
// que main.js los fusione con el resto de especialidades.
export const quizTriggerId = ['btn-cardio-ic-repasar'];
export const quizBanco = [...preguntasInsuficienciaCardiaca];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js) —
// aquí cada "bloque" es directamente una guía, ya que cada una es su propio
// submenú de nivel medio en la navegación real de la app.
const ASIGNATURA = 'Cardiología';
export const quizTemas = [
    ...temasInsuficienciaCardiaca.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Insuficiencia Cardíaca (ESC 2026)' })),
];

export function init() {
    const cardioLevel = createViewSwitcher({
        menu: document.getElementById('cardiologia-menu-view'),
        insuficienciaCardiaca: document.getElementById('cardio-ic-view'),
    });

    document.getElementById('btn-cardio-ic').addEventListener('click', () => cardioLevel.show('insuficienciaCardiaca'));
    document.querySelectorAll('.btn-volver-cardio-menu').forEach(b => b.addEventListener('click', () => cardioLevel.show('menu')));

    initInsuficienciaCardiaca();

    cardioLevel.show('menu');

    // Deja siempre el submenú de guías como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // uciPapers.volverAlMenu()/fisioUci.volverAlMenu() ya dan a sus
    // especialidades.
    return {
        volverAlMenu: () => cardioLevel.show('menu'),
        // Salto genérico desde OTRAS especialidades, mismo patrón que
        // irAFicha() ya exponen nefrologia/fisio-uci/uci-papers.
        irAFicha: (view, panel, tab) => {
            cardioLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        },
    };
}
