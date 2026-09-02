// Orquesta la navegación jerárquica de la app: menú de especialidades,
// Atlas Hematológico (menú principal de Hematología), submenú de
// Citopenias y submenú de Trasplante. La lógica de cada calculadora vive
// en su propio módulo; aquí solo se decide qué vista se ve en cada momento.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { initAtlas } from './atlas.js';
import { preguntasNeutropeniaFebril, temasNeutropeniaFebril } from '../../data/neutropenia-febril-preguntas.js';
import { preguntasReconocimiento, temasReconocimiento } from '../../data/reconocimiento-preguntas.js';
import { preguntasSindromes, temasSindromes } from '../../data/sindromes-urgentes-preguntas.js';
import { preguntasTrasplante, temasTrasplante } from '../../data/trasplante-preguntas.js';
import { preguntasMerino, temasMerino } from '../../data/merino-hemato-preguntas.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Hematología expone aquí su banco/temas ya
// combinados en vez de llamar a initQuiz() directamente, para que main.js
// pueda fusionarlos con los de Nefrología en una única llamada.
export const quizTriggerId = ['btn-nf-repasar', 'btn-recon-repasar', 'btn-sind-repasar', 'btn-tph-repasar', 'btn-merino-repasar'];
export const quizBanco = [...preguntasNeutropeniaFebril, ...preguntasReconocimiento, ...preguntasSindromes, ...preguntasTrasplante, ...preguntasMerino];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js):
// cada tema se etiqueta aquí con su `asignatura` (Hematología) y su
// `bloque` — Trasplante se reparte en 3 bloques según el prefijo real de
// sus claves (tph-/cart-/comp-), reflejando las 3 subvistas ya existentes
// del módulo (Introducción/CAR-T/Complicaciones post-TPH) en vez de dejarlo
// como un único bloque de 18 fichas.
const ASIGNATURA = 'Hematología';
export const quizTemas = [
    ...temasNeutropeniaFebril.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Manejo Citopenias' })),
    ...temasReconocimiento.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Reconocimiento Temprano' })),
    ...temasSindromes.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Síndromes Urgentes' })),
    ...temasTrasplante.map(t => ({
        ...t,
        asignatura: ASIGNATURA,
        bloque: t.key.startsWith('cart-') ? 'Trasplante: CAR-T'
            : t.key.startsWith('comp-') ? 'Trasplante: Complicaciones post-TPH'
            : 'Trasplante: Introducción',
    })),
    ...temasMerino.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Merino HEMATO' })),
];

// Referencia a la API que devuelve nefrologia.init() (ver
// modules/nefrologia/index.js). nefrologia.init() se llama después de
// home.init() en main.js, así que se inyecta aquí perezosamente en vez de
// recibirla como parámetro — el listener de #btn-nefrologia la lee en el
// momento del click, no en el momento de registrarse.
let nefrologiaApi = null;
export function onNefrologiaListo(api) {
    nefrologiaApi = api;
}

// Mismo patrón de inyección perezosa que nefrologiaApi, para la API que
// devuelve uciPapers.init() (ver modules/uci-papers/index.js).
let uciPapersApi = null;
export function onUciPapersListo(api) {
    uciPapersApi = api;
}

// Mismo patrón de inyección perezosa, para la API que devuelve
// fisioUci.init() (ver modules/fisio-uci/index.js).
let fisioUciApi = null;
export function onFisioUciListo(api) {
    fisioUciApi = api;
}

// Mismo patrón de inyección perezosa, para la API que devuelve
// cardiologia.init() (ver modules/cardiologia/index.js).
let cardiologiaApi = null;
export function onCardiologiaListo(api) {
    cardiologiaApi = api;
}

// Mismo patrón de inyección perezosa, para la API que devuelve
// neumologia.init() (ver modules/neumologia/index.js).
let neumologiaApi = null;
export function onNeumologiaListo(api) {
    neumologiaApi = api;
}

export function init() {
    const topLevel = createViewSwitcher({
        especialidades: document.getElementById('especialidades-view'),
        home: document.getElementById('home-view'),
        escalas: document.getElementById('escalas-generales-view'),
        citopenias: document.getElementById('citopenias-view'),
        reconocimiento: document.getElementById('reconocimiento-view'),
        sindromes: document.getElementById('sindromes-view'),
        trasplante: document.getElementById('trasplante-view'),
        merinoHemato: document.getElementById('merino-hemato-view'),
        nefrologia: document.getElementById('nefrologia-view'),
        uciPapers: document.getElementById('uci-papers-view'),
        fisioUci: document.getElementById('fisio-uci-view'),
        cardiologia: document.getElementById('cardiologia-view'),
        neumologia: document.getElementById('neumologia-view'),
    });

    function goHome() {
        topLevel.show('home');
        atlas.reset();
    }

    document.getElementById('btn-hematologia').addEventListener('click', goHome);
    document.getElementById('btn-nefrologia').addEventListener('click', () => {
        topLevel.show('nefrologia');
        nefrologiaApi?.volverAlMapa();
    });
    document.getElementById('btn-uci-papers').addEventListener('click', () => {
        topLevel.show('uciPapers');
        uciPapersApi?.volverAlMenu();
    });
    document.getElementById('btn-fisio-uci').addEventListener('click', () => {
        topLevel.show('fisioUci');
        fisioUciApi?.volverAlMenu();
    });
    document.getElementById('btn-cardiologia').addEventListener('click', () => {
        topLevel.show('cardiologia');
        cardiologiaApi?.volverAlMenu();
    });
    document.getElementById('btn-neumologia').addEventListener('click', () => {
        topLevel.show('neumologia');
        neumologiaApi?.volverAlMenu();
    });
    document.querySelectorAll('.btn-volver-especialidades').forEach(b => b.addEventListener('click', () => topLevel.show('especialidades')));

    document.getElementById('btn-escalas-generales').addEventListener('click', () => topLevel.show('escalas'));
    document.querySelectorAll('.btn-volver-home').forEach(b => b.addEventListener('click', goHome));

    // Enlaces cruzados entre especialidades. Dos formas: 1) `data-target`
    // fijo para atajos ya nombrados (p. ej. la Matriz de Combate MDR de
    // Neutropenia Febril saltando al buscador de ajuste de fármacos por
    // función renal de Nefrología); 2) `data-especialidad` +
    // `data-view`/`data-panel`/`data-tab` genérico, para saltar a
    // CUALQUIER ficha de Nefrología, Fisiopatología UCI o UCI/Papers
    // Tuiter desde otra especialidad (p. ej. Vías Urinarias ↔ FRA/ERC, o
    // FRA ↔ VExUS) — mismo patrón que `.tx-link` ya usa dentro de un solo
    // módulo, aquí generalizado entre especialidades vía las `irAFicha()`
    // que exponen nefrologia/index.js, fisio-uci/index.js y
    // uci-papers/index.js.
    document.querySelectorAll('.especialidad-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const { target, especialidad, view, panel, tab } = btn.dataset;
            if (target === 'nefrotoxicidad') {
                topLevel.show('nefrologia');
                nefrologiaApi?.irANefrotoxicidad();
            } else if (especialidad === 'nefrologia') {
                topLevel.show('nefrologia');
                nefrologiaApi?.irAFicha(view, panel, tab);
            } else if (especialidad === 'fisioUci') {
                topLevel.show('fisioUci');
                fisioUciApi?.irAFicha(view, panel, tab);
            } else if (especialidad === 'uciPapers') {
                topLevel.show('uciPapers');
                uciPapersApi?.irAFicha(view, panel, tab);
            } else if (especialidad === 'cardiologia') {
                topLevel.show('cardiologia');
                cardiologiaApi?.irAFicha(view, panel, tab);
            } else if (especialidad === 'neumologia') {
                topLevel.show('neumologia');
                neumologiaApi?.irAFicha(view, panel, tab);
            }
        });
    });

    const citopeniasLevel = createViewSwitcher({
        menu: document.getElementById('citopenias-menu-view'),
        neutropeniaFebril: document.getElementById('neutropenia-febril-container'),
    });
    document.getElementById('btn-neutropenia-febril').addEventListener('click', () => citopeniasLevel.show('neutropeniaFebril'));
    document.querySelectorAll('.btn-volver-citopenias-menu').forEach(b => b.addEventListener('click', () => citopeniasLevel.show('menu')));

    const trasplanteLevel = createViewSwitcher({
        menu: document.getElementById('trasplante-menu-view'),
        intro: document.getElementById('tph-intro-view'),
        cart: document.getElementById('tph-cart-view'),
        complicaciones: document.getElementById('tph-complicaciones-view'),
    });
    document.getElementById('btn-tph-intro').addEventListener('click', () => trasplanteLevel.show('intro'));
    document.getElementById('btn-tph-cart').addEventListener('click', () => trasplanteLevel.show('cart'));
    document.getElementById('btn-tph-complicaciones').addEventListener('click', () => trasplanteLevel.show('complicaciones'));
    document.querySelectorAll('.btn-volver-trasplante-menu').forEach(b => b.addEventListener('click', () => trasplanteLevel.show('menu')));

    const rutasAtlas = {
        'citopenias-neutropenia': () => { topLevel.show('citopenias'); citopeniasLevel.show('neutropeniaFebril'); },
        reconocimiento: () => topLevel.show('reconocimiento'),
        'sindromes-cid': () => { topLevel.show('sindromes'); openCorkboardTopic('panel-sindromes-tabs', 'sind-cid'); },
        'sindromes-ptt': () => { topLevel.show('sindromes'); openCorkboardTopic('panel-sindromes-tabs', 'sind-ptt'); },
        'sindromes-slt': () => { topLevel.show('sindromes'); openCorkboardTopic('panel-sindromes-tabs', 'sind-slt'); },
        'trasplante-intro': () => { topLevel.show('trasplante'); trasplanteLevel.show('intro'); },
        'trasplante-cart': () => { topLevel.show('trasplante'); trasplanteLevel.show('cart'); },
        'trasplante-complicaciones': () => { topLevel.show('trasplante'); trasplanteLevel.show('complicaciones'); },
        'merino-hemato': () => topLevel.show('merinoHemato'),
    };
    const atlas = initAtlas({
        onRoute: (key) => rutasAtlas[key]?.(),
        onCompass: () => topLevel.show('escalas'),
    });

    // Enlaces cruzados entre módulos de Hematología fuera del propio Atlas
    // (p. ej. desde la ficha de Terapias Dirigidas de Reconocimiento hacia
    // el módulo completo de CAR-T) — reutilizan las mismas rutas de
    // rutasAtlas, sin duplicar lógica de navegación.
    document.querySelectorAll('[data-atlas-route]').forEach(btn =>
        btn.addEventListener('click', () => rutasAtlas[btn.dataset.atlasRoute]?.()));

    topLevel.show('especialidades');
    citopeniasLevel.show('menu');
    trasplanteLevel.show('menu');
}
