// Orquesta la navegación jerárquica de la app: menú de especialidades,
// Atlas Hematológico (menú principal de Hematología), submenú de
// Citopenias y submenú de Trasplante. La lógica de cada calculadora vive
// en su propio módulo; aquí solo se decide qué vista se ve en cada momento.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { hayVisualEn } from '../../core/vista-visual.js';
import { initAtlas } from './atlas.js';
import { initPifManifiesto } from './pif-manifiesto.js';
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

// APIs que devuelve el init() de cada especialidad con switcher medio
// propio ({ volverAlMenu, irAFicha }, ver p. ej. modules/nefrologia/index.js).
// Se registran desde main.js DESPUÉS de home.init() (cada especialidad se
// inicializa después que home), así que los listeners de abajo las leen en
// el momento del click, no al registrarse. La clave es la misma que la vista
// raíz de esa especialidad en `topLevel`.
const apis = {};
export function registrarEspecialidad(key, api) {
    apis[key] = api;
}
// Botón del menú (raíz o intermedio) que entra en cada especialidad.
const BOTONES_ESPECIALIDAD = {
    nefrologia: 'btn-nefrologia',
    uciPapers: 'btn-uci-papers',
    fisioUci: 'btn-fisio-uci',
    cardiologia: 'btn-cardiologia',
    neumologia: 'btn-neumologia',
    sobrevivirUmi: 'btn-sobrevivir-umi',
};

export function init() {
    // Renderiza la tile PIF del menú raíz y el manifiesto de rotación de
    // #pif-menu-view — incluye los botones #btn-hematologia/#btn-nefrologia,
    // así que va ANTES de que este init() les enganche sus listeners más
    // abajo (ver pif-manifiesto.js).
    initPifManifiesto();

    const topLevel = createViewSwitcher({
        especialidades: document.getElementById('especialidades-view'),
        pifMenu: document.getElementById('pif-menu-view'),
        cardiorrespiMenu: document.getElementById('cardiorrespi-menu-view'),
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
        sobrevivirUmi: document.getElementById('sobrevivir-umi-view'),
    }, (key, vista) => {
        // El botón "🖼️ Visual" de la cabecera solo aparece donde hay vistas
        // Visual, o en el menú de un tema que lleva a ellas (data-con-visual).
        document.body.classList.toggle('hay-vista-visual', hayVisualEn(vista) || !!vista?.hasAttribute('data-con-visual'));
    });

    function goHome() {
        topLevel.show('home');
        atlas.reset();
    }

    // Las 4 puertas de la raíz: PIF y Fisiopatología UCI (grupo
    // Cardio+Neumo+Fisio UCI, id interno "cardiorrespi" sin cambiar) son
    // menús combinados intermedios (ver index.html), sin API propia que
    // inyectar — solo cambian de vista. UCI/Papers Tuiter y Sobrevivir a
    // la UMI siguen siendo puertas directas, sin nivel intermedio.
    document.getElementById('btn-pif').addEventListener('click', () => topLevel.show('pifMenu'));
    document.getElementById('btn-cardiorrespi').addEventListener('click', () => topLevel.show('cardiorrespiMenu'));

    document.getElementById('btn-hematologia').addEventListener('click', goHome);
    // Entrar en una especialidad deja siempre su propio menú/mapa como
    // pantalla de entrada (volverAlMenu), igual que goHome() resetea el Atlas.
    Object.entries(BOTONES_ESPECIALIDAD).forEach(([key, btnId]) => {
        document.getElementById(btnId).addEventListener('click', () => {
            topLevel.show(key);
            apis[key]?.volverAlMenu();
        });
    });
    document.querySelectorAll('.btn-volver-especialidades').forEach(b => b.addEventListener('click', () => topLevel.show('especialidades')));
    // Hematología/Nefrología viven ahora un nivel más abajo, dentro de PIF;
    // Cardiología/Neumología/Fisiopatología UCI dentro del grupo
    // "Fisiopatología UCI" (id interno cardiorrespiMenu, sin cambiar) —
    // su "← VOLVER" propio regresa al menú combinado, no a la raíz.
    document.querySelectorAll('.btn-volver-pif-menu').forEach(b => b.addEventListener('click', () => topLevel.show('pifMenu')));
    document.querySelectorAll('.btn-volver-cardiorrespi-menu').forEach(b => b.addEventListener('click', () => topLevel.show('cardiorrespiMenu')));

    // Escalas Generales se abre desde la cabecera en cualquier pantalla: su
    // "← VOLVER" regresa a donde estabas, no siempre a Hematología.
    let antesDeEscalas = null;
    function abrirEscalas() {
        if (topLevel.actual() !== 'escalas') antesDeEscalas = topLevel.actual();
        topLevel.show('escalas');
    }
    document.getElementById('btn-escalas-generales').addEventListener('click', abrirEscalas);
    document.querySelectorAll('.btn-volver-home').forEach(b => b.addEventListener('click', () => {
        if (topLevel.actual() === 'escalas' && antesDeEscalas && antesDeEscalas !== 'home') topLevel.show(antesDeEscalas);
        else goHome();
    }));

    // Router genérico de "ir a una ficha concreta de cualquier especialidad"
    // — usado por los enlaces cruzados `[data-especialidad]` (ver más abajo)
    // y por el buscador global (core/search.js, inyectado como `navegar`
    // desde main.js). `especialidad` es la clave de la vista raíz en
    // topLevel; para las especialidades con switcher medio propio se delega
    // en su `irAFicha(view, panel, tab)` registrado. El caso 'home'
    // (Hematología) usa el propio switcher raíz + `trasplanteLevel` para las
    // 3 subvistas de Trasplante.
    function irAResultadoBusqueda({ especialidad, view, panel, tab, trasplante }) {
        if (especialidad === 'home') {
            if (view) topLevel.show(view);
            if (trasplante) trasplanteLevel.show(trasplante);
            if (panel && tab) openCorkboardTopic(panel, tab);
            return;
        }
        const api = apis[especialidad];
        if (!api) return; // clave desconocida: no tocar ningún switcher
        topLevel.show(especialidad);
        api.irAFicha(view, panel, tab);
    }

    // ÚNICO mecanismo de enlace cruzado de toda la app — tanto entre
    // especialidades como dentro de una misma especialidad (p. ej. de una
    // ficha de ERC a otra de FRA, o entre dos fichas del mismo cuaderno):
    // cualquier `<button data-especialidad="...">` con `data-view`/
    // `data-panel`/`data-tab` (todos opcionales; `data-trasplante` solo con
    // `data-especialidad="home"` para las 3 subvistas de Trasplante). Las
    // clases `.tx-link`/`.especialidad-link`/`.paper-link`/... son hoy solo
    // visuales. Delegado en document para cubrir también botones generados
    // por JS después de arrancar.
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-especialidad]');
        if (!btn) return;
        const { especialidad, view, panel, tab, trasplante } = btn.dataset;
        irAResultadoBusqueda({ especialidad, view, panel, tab, trasplante });
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
        'citopenias-neutropenia': () => { topLevel.show('citopenias'); document.getElementById('btn-neutropenia-febril').click(); },
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
        onCompass: abrirEscalas,
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

    // Expuesto para que main.js lo inyecte en core/search.js como la
    // función `navegar` del buscador global — ver el comentario de
    // irAResultadoBusqueda más arriba.
    return { irAResultadoBusqueda };
}
