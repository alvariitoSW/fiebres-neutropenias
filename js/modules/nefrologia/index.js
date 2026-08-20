// Módulo "Nefrología". Nivel 0: mapa del riñón (rinon.js), con 7 nodos por
// objetivo de rotación. Uno de ellos ("Fisiopatología renal") hace zoom a
// la nefrona interactiva ya construida (nefrona.js); el resto abre vistas
// de categoría propias (placeholder + bibliografía hasta que tengan
// contenido clínico). Este archivo solo orquesta el switcher de nivel
// medio y resuelve qué vista abrir desde cada nodo/segmento.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { initNefrona } from './nefrona.js';
import { initRinon } from './rinon.js';
import { init as initFisiologia } from './fisiologia.js';
import { init as initHta } from './hta.js';
import { init as initErc } from './erc.js';
import { init as initFra } from './fra.js';
import { init as initTrr } from './trr.js';
import { init as initNefrotoxicidad } from './nefrotoxicidad.js';
import { preguntasNefrologia, temasNefrologia } from '../../data/nefrologia-preguntas.js';
import { preguntasHTA, temasHTA } from '../../data/hta-preguntas.js';
import { preguntasERC, temasERC } from '../../data/erc-preguntas.js';
import { preguntasFRA, temasFRA } from '../../data/fra-preguntas.js';
import { preguntasTRR, temasTRR } from '../../data/trr-preguntas.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Nefrología expone aquí su banco/temas ya
// combinados en vez de llamar a initQuiz() directamente, para que main.js
// pueda fusionarlos con los de Hematología en una única llamada.
export const quizTriggerId = ['btn-nefro-repasar', 'btn-hta-repasar', 'btn-erc-repasar', 'btn-fra-repasar', 'btn-trr-repasar'];
export const quizBanco = [...preguntasNefrologia, ...preguntasHTA, ...preguntasERC, ...preguntasFRA, ...preguntasTRR];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js).
const ASIGNATURA = 'Nefrología';
export const quizTemas = [
    ...temasNefrologia.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Fisiología renal y electrolitos' })),
    ...temasHTA.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Hipertensión Arterial' })),
    ...temasERC.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Enfermedad Renal Crónica' })),
    ...temasFRA.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Fracaso Renal Agudo' })),
    ...temasTRR.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Terapias de Reemplazo Renal' })),
];

function mostrarEnPreparacion() {
    const cont = document.getElementById('nefro-segmento-categorias');
    if (cont) cont.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted);">🚧 Contenido clínico de esta zona en preparación.</p>';
}

export function init() {
    const nefroLevel = createViewSwitcher({
        kidney: document.getElementById('nefro-kidney-view'),
        nefrona: document.getElementById('nefro-menu-view'),
        diureticosAsa: document.getElementById('nefro-diureticos-asa-view'),
        hta: document.getElementById('nefro-hta-view'),
        erc: document.getElementById('nefro-erc-view'),
        fra: document.getElementById('nefro-fra-view'),
        nefrotoxicidad: document.getElementById('nefro-nefrotoxicidad-view'),
        tratamiento: document.getElementById('nefro-tratamiento-view'),
        trr: document.getElementById('nefro-trr-view'),
    });

    document.querySelectorAll('.btn-volver-nefro-kidney').forEach(b =>
        b.addEventListener('click', () => { nefroLevel.show('kidney'); nefrona.reset(); }));

    // Categorías de contenido clínico de cada segmento de la nefrona. La
    // mayoría abren directamente una ficha del cuaderno de campo de
    // fisiología (mismo panel, no hace falta cambiar de vista porque
    // fisio-corkboard vive en la misma página que la nefrona) — solo
    // 'diureticos-asa' cambia de vista porque es una página aparte.
    const categoriaDisponible = {
        'diureticos-asa': () => nefroLevel.show('diureticosAsa'),
        'fisio-filtracion': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-filtracion'),
        'fisio-regulacion': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-regulacion'),
        'fisio-tubular': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-tubular'),
        'fisio-agua-regulacion': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-agua-regulacion'),
        'fisio-potasio-regulacion': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-potasio-regulacion'),
        'fisio-hipopotasemia': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-hipopotasemia'),
        'fisio-hiponatremia': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-hiponatremia'),
        'fisio-hipernatremia': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-hipernatremia'),
        'fisio-hiperpotasemia': () => openCorkboardTopic('panel-fisio-tabs', 'fisio-hiperpotasemia'),
    };

    const nefrona = initNefrona({
        onCategoria: (key) => categoriaDisponible[key]?.() ?? mostrarEnPreparacion(),
    });

    const rutasRinon = {
        fisiopatologia: () => nefroLevel.show('nefrona'),
        hta: () => nefroLevel.show('hta'),
        erc: () => nefroLevel.show('erc'),
        fra: () => nefroLevel.show('fra'),
        nefrotoxicidad: () => nefroLevel.show('nefrotoxicidad'),
        tratamiento: () => nefroLevel.show('tratamiento'),
        trr: () => nefroLevel.show('trr'),
    };
    const rinon = initRinon({
        onRoute: (key) => rutasRinon[key]?.(),
    });

    // Enlaces internos de la guía transversal de tratamiento IRA/ERC:
    // saltan a una vista distinta del propio switcher (ERC/FRA/TRR/
    // Nefrotoxicidad) y, si llevan panel/tab, abren directamente esa
    // ficha del cuaderno de campo destino — mismo patrón que usa el Atlas
    // Hematológico para enlazar a Síndromes Urgentes desde otro módulo.
    document.querySelectorAll('.tx-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const { view, panel, tab } = btn.dataset;
            if (view) nefroLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        });
    });

    initFisiologia();
    initHta();
    initErc();
    initFra();
    initTrr();
    initNefrotoxicidad();

    nefroLevel.show('kidney');

    // Deja Nefrología lista para volver a mostrar siempre el mapa del riñón
    // al reentrar desde Especialidades — mismo comportamiento que goHome()
    // ya da al Atlas de Hematología. Lo usa home/index.js.
    return {
        volverAlMapa: () => {
            nefroLevel.show('kidney');
            rinon.reset();
            nefrona.reset();
        },
        // Usado desde Hematología (home/index.js) para saltar directamente
        // al buscador de ajuste de fármacos por función renal — p. ej.
        // desde la Matriz de Combate MDR de Neutropenia Febril, cuyos
        // antibióticos ya están en esa misma tabla.
        irANefrotoxicidad: () => nefroLevel.show('nefrotoxicidad'),
    };
}
