// Módulo "Nefrología". Nivel 0: mapa del riñón (rinon.js), con 7 nodos por
// objetivo de rotación. Uno de ellos ("Fisiopatología renal") hace zoom a
// la nefrona interactiva ya construida (nefrona.js); el resto abre vistas
// de categoría propias (placeholder + bibliografía hasta que tengan
// contenido clínico). Este archivo solo orquesta el switcher de nivel
// medio y resuelve qué vista abrir desde cada nodo/segmento.
import { createViewSwitcher } from '../../core/navigation.js';
import { initNefrona } from './nefrona.js';
import { initRinon } from './rinon.js';
import { init as initFisiologia } from './fisiologia.js';
import { init as initHta } from './hta.js';
import { init as initErc } from './erc.js';
import { init as initFra } from './fra.js';
import { init as initTrr } from './trr.js';
import { initQuiz } from '../quiz/quiz.js';
import { preguntasNefrologia, temasNefrologia } from '../../data/nefrologia-preguntas.js';
import { preguntasHTA, temasHTA } from '../../data/hta-preguntas.js';
import { preguntasERC, temasERC } from '../../data/erc-preguntas.js';
import { preguntasFRA, temasFRA } from '../../data/fra-preguntas.js';
import { preguntasTRR, temasTRR } from '../../data/trr-preguntas.js';

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

    const categoriaDisponible = {
        'diureticos-asa': () => nefroLevel.show('diureticosAsa'),
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

    initFisiologia();
    initHta();
    initErc();
    initFra();
    initTrr();
    initQuiz({
        triggerId: ['btn-nefro-repasar', 'btn-hta-repasar', 'btn-erc-repasar', 'btn-fra-repasar', 'btn-trr-repasar'],
        banco: [...preguntasNefrologia, ...preguntasHTA, ...preguntasERC, ...preguntasFRA, ...preguntasTRR],
        temas: [...temasNefrologia, ...temasHTA, ...temasERC, ...temasFRA, ...temasTRR],
    });

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
    };
}
