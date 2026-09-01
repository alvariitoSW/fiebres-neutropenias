// Módulo "Cardiología": guías de práctica clínica de manejo (no
// fisiopatología — eso vive en Fisiopatología UCI → Cardiología, fuente
// distinta, El Libro Azul). Mismo patrón de submenú de bloques que
// UCI/Papers Tuiter y Fisiopatología UCI: cada guía es una entrada de este
// submenú con su propio cuaderno de campo.
import { createViewSwitcher } from '../../core/navigation.js';
import { initCorkboard, openCorkboardTopic } from '../../core/corkboard.js';
import { preguntasInsuficienciaCardiaca, temasInsuficienciaCardiaca } from '../../data/insuficiencia-cardiaca-preguntas.js';
import { init as initInsuficienciaCardiaca } from './insuficiencia-cardiaca.js';
import { preguntasMerinoCardiologia, temasMerinoCardiologia } from '../../data/merino-cardiologia-preguntas.js';
import { init as initMerinoCardiologia } from './merino-cardiologia.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Cardiología expone aquí su banco/temas para
// que main.js los fusione con el resto de especialidades.
export const quizTriggerId = ['btn-cardio-ic-repasar', 'btn-merino-cardio-repasar'];
export const quizBanco = [...preguntasInsuficienciaCardiaca, ...preguntasMerinoCardiologia];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js) —
// aquí cada "bloque" es directamente una guía, ya que cada una es su propio
// submenú de nivel medio en la navegación real de la app.
const ASIGNATURA = 'Cardiología';
export const quizTemas = [
    ...temasInsuficienciaCardiaca.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Insuficiencia Cardíaca (ESC 2026)' })),
    ...temasMerinoCardiologia.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Merino Cardiología' })),
];

export function init() {
    const cardioLevel = createViewSwitcher({
        menu: document.getElementById('cardiologia-menu-view'),
        insuficienciaCardiaca: document.getElementById('cardio-ic-view'),
        merinoCardiologia: document.getElementById('merino-cardio-view'),
    });

    document.getElementById('btn-cardio-ic').addEventListener('click', () => cardioLevel.show('insuficienciaCardiaca'));
    document.getElementById('btn-merino-cardio').addEventListener('click', () => cardioLevel.show('merinoCardiologia'));
    document.querySelectorAll('.btn-volver-cardio-menu').forEach(b => b.addEventListener('click', () => cardioLevel.show('menu')));

    initInsuficienciaCardiaca();
    initMerinoCardiologia();

    // Enlaces cruzados entre las 2 guías de Cardiología (misma especialidad,
    // ambas ya colgando de este mismo cardioLevel) — shock cardiogénico se
    // trata desde 2 ángulos: fisiopatología detallada en Merino Cardiología,
    // recomendaciones graduadas en la guía ESC de IC. Nunca se usa .tx-link
    // aquí (ese listener global vive en nefrologia/index.js y solo conoce
    // las claves de nefroLevel) — cardioLevel.show() ya está en el cierre
    // de este init(), así que basta un listener propio y local.
    document.querySelectorAll('.cardio-cross-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const { view, tab } = btn.dataset;
            cardioLevel.show(view);
            openCorkboardTopic('panel-merino-cardio-tabs', tab);
        });
    });
    const linkAScai = document.getElementById('mc-link-a-scai');
    if (linkAScai) linkAScai.addEventListener('click', () => {
        cardioLevel.show('insuficienciaCardiaca');
        openCorkboardTopic('panel-cardio-ic-tabs', 'ic-descompensada');
    });
    const linkAMcsEsc = document.getElementById('mc-link-a-mcs-esc');
    if (linkAMcsEsc) linkAMcsEsc.addEventListener('click', () => {
        cardioLevel.show('insuficienciaCardiaca');
        openCorkboardTopic('panel-cardio-ic-tabs', 'ic-descompensada');
    });

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
