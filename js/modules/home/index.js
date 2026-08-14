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

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Hematología expone aquí su banco/temas ya
// combinados en vez de llamar a initQuiz() directamente, para que main.js
// pueda fusionarlos con los de Nefrología en una única llamada.
export const quizTriggerId = ['btn-nf-repasar', 'btn-recon-repasar', 'btn-sind-repasar', 'btn-tph-repasar'];
export const quizBanco = [...preguntasNeutropeniaFebril, ...preguntasReconocimiento, ...preguntasSindromes, ...preguntasTrasplante];
export const quizTemas = [...temasNeutropeniaFebril, ...temasReconocimiento, ...temasSindromes, ...temasTrasplante];

// Referencia a la API que devuelve nefrologia.init() (ver
// modules/nefrologia/index.js). nefrologia.init() se llama después de
// home.init() en main.js, así que se inyecta aquí perezosamente en vez de
// recibirla como parámetro — el listener de #btn-nefrologia la lee en el
// momento del click, no en el momento de registrarse.
let nefrologiaApi = null;
export function onNefrologiaListo(api) {
    nefrologiaApi = api;
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
        nefrologia: document.getElementById('nefrologia-view'),
        uciPapers: document.getElementById('uci-papers-view'),
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
    document.getElementById('btn-uci-papers').addEventListener('click', () => topLevel.show('uciPapers'));
    document.querySelectorAll('.btn-volver-especialidades').forEach(b => b.addEventListener('click', () => topLevel.show('especialidades')));

    document.getElementById('btn-escalas-generales').addEventListener('click', () => topLevel.show('escalas'));
    document.querySelectorAll('.btn-volver-home').forEach(b => b.addEventListener('click', goHome));

    // Enlaces cruzados entre especialidades (p. ej. la Matriz de Combate
    // MDR de Neutropenia Febril saltando al buscador de ajuste de
    // fármacos por función renal de Nefrología). Cambia de especialidad
    // en el switcher raíz y delega en la API que expone nefrologia.init().
    document.querySelectorAll('.especialidad-link').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.target === 'nefrotoxicidad') {
                topLevel.show('nefrologia');
                nefrologiaApi?.irANefrotoxicidad();
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
