// Módulo "Nefrología". Nivel 0: mapa del riñón (rinon.js), con 7 nodos por
// objetivo de rotación. Uno de ellos ("Fisiopatología renal") hace zoom a
// la nefrona viva (nefrona-viva.js); el resto abre vistas
// de categoría propias (placeholder + bibliografía hasta que tengan
// contenido clínico). Este archivo solo orquesta el switcher de nivel
// medio y resuelve qué vista abrir desde cada nodo/segmento.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { initNefronaViva } from './nefrona-viva.js';
import { initRinon } from './rinon.js';
import { init as initFisiologia } from './fisiologia.js';
import { init as initHta } from './hta.js';
import { init as initErc } from './erc.js';
import { init as initFra } from './fra.js';
import { init as initTrr } from './trr.js';
import { init as initNefrotoxicidad } from './nefrotoxicidad.js';
import { init as initTrasplanteRenal } from './trasplante-renal.js';
import { preguntasNefrologia, temasNefrologia } from '../../data/nefrologia-preguntas.js';
import { preguntasHTA, temasHTA } from '../../data/hta-preguntas.js';
import { preguntasERC, temasERC } from '../../data/erc-preguntas.js';
import { preguntasFRA, temasFRA } from '../../data/fra-preguntas.js';
import { preguntasTRR, temasTRR } from '../../data/trr-preguntas.js';
import { preguntasTrasplanteRenal, temasTrasplanteRenal } from '../../data/trasplante-renal-preguntas.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Nefrología expone aquí su banco/temas ya
// combinados en vez de llamar a initQuiz() directamente, para que main.js
// pueda fusionarlos con los de Hematología en una única llamada.
export const quizTriggerId = ['btn-nefro-repasar', 'btn-hta-repasar', 'btn-erc-repasar', 'btn-fra-repasar', 'btn-trr-repasar', 'btn-trasplante-renal-repasar'];
export const quizBanco = [...preguntasNefrologia, ...preguntasHTA, ...preguntasERC, ...preguntasFRA, ...preguntasTRR, ...preguntasTrasplanteRenal];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js).
const ASIGNATURA = 'Nefrología';
export const quizTemas = [
    ...temasNefrologia.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Fisiología renal y electrolitos' })),
    ...temasHTA.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Hipertensión Arterial' })),
    ...temasERC.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Enfermedad Renal Crónica' })),
    ...temasFRA.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Fracaso Renal Agudo' })),
    ...temasTRR.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Terapias de Reemplazo Renal' })),
    ...temasTrasplanteRenal.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Trasplante renal y enfermedades glomerulares' })),
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
        trasplanteRenal: document.getElementById('nefro-trasplante-renal-view'),
    });

    document.querySelectorAll('.btn-volver-nefro-kidney').forEach(b =>
        b.addEventListener('click', () => { nefroLevel.show('kidney'); nefrona.reset(); }));
    // Diuréticos de asa cuelga de la nefrona: su "← VOLVER" vuelve a ella.
    document.querySelectorAll('.btn-volver-nefro-menu').forEach(b =>
        b.addEventListener('click', () => nefroLevel.show('nefrona')));

    // Categorías de contenido clínico de cada segmento de la nefrona
    // (nefrona-data.js). Las claves 'fisio-*' son directamente el id de una
    // ficha del cuaderno de fisiología, que vive en la misma página que la
    // nefrona (no hace falta cambiar de vista); solo 'diureticos-asa' es
    // una página aparte. Cualquier otra clave: "en preparación".
    const nefrona = initNefronaViva({
        mostrarVista: () => nefroLevel.show('nefrona'),
        onCategoria: (key) => {
            if (key === 'diureticos-asa') nefroLevel.show('diureticosAsa');
            else if (key.startsWith('fisio-') && document.getElementById(key)) openCorkboardTopic('panel-fisio-tabs', key);
            else mostrarEnPreparacion();
        },
    });

    // Nodo del mapa del riñón → vista de este switcher. 'fisiopatologia'
    // hace zoom a la nefrona ya construida; el resto abre su vista propia.
    const vistaPorNodoRinon = {
        fisiopatologia: 'nefrona', hta: 'hta', erc: 'erc', fra: 'fra', nefrotoxicidad: 'nefrotoxicidad',
        tratamiento: 'tratamiento', trr: 'trr', trasplanteRenal: 'trasplanteRenal',
    };
    const rinon = initRinon({
        onRoute: (key) => { if (vistaPorNodoRinon[key]) nefroLevel.show(vistaPorNodoRinon[key]); },
    });

    initFisiologia();
    initHta();
    initErc();
    initFra();
    initTrr();
    initNefrotoxicidad();
    initTrasplanteRenal();

    nefroLevel.show('kidney');

    // Deja Nefrología lista para volver a mostrar siempre el mapa del riñón
    // (su "menú") al reentrar desde Especialidades — mismo comportamiento
    // que goHome() ya da al Atlas de Hematología. Lo usa home/index.js.
    return {
        volverAlMenu: () => {
            nefroLevel.show('kidney');
            rinon.reset();
            nefrona.reset();
        },
        // Salto a una ficha concreta (ERC/FRA/TRR/fisiología...) — lo usan
        // los enlaces cruzados `[data-especialidad="nefrologia"]`, tanto
        // desde otras especialidades como desde la propia Nefrología
        // (guía transversal IRA/ERC, PNT del mapa del riñón).
        irAFicha: nefroLevel.irAFicha,
    };
}
