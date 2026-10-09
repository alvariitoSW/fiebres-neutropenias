// Módulo "UCI / Papers Tuiter": resúmenes de papers de Medicina Intensiva
// compartidos en redes sociales. Cada paper es una entrada de un submenú
// propio (mismo patrón que Citopenias/Trasplante en Hematología) y, dentro
// de él, un cuaderno de campo con sus bloques temáticos — nunca se fabrica
// contenido clínico sin una fuente real (ver CLAUDE.md).
import { createViewSwitcher } from '../../core/navigation.js';
import { initCorkboard } from '../../core/corkboard.js';
import { preguntasShockSeptico, temasShockSeptico } from '../../data/shock-septico-preguntas.js';
import { preguntasOxidoNitrico, temasOxidoNitrico } from '../../data/oxido-nitrico-preguntas.js';
import { preguntasVdLra, temasVdLra } from '../../data/vd-lra-preguntas.js';
import { preguntasVexus, temasVexus } from '../../data/vexus-preguntas.js';
import { preguntasExtubacionPuma, temasExtubacionPuma } from '../../data/extubacion-puma-preguntas.js';
import { preguntasCitratoTrr, temasCitratoTrr } from '../../data/citrato-trr-preguntas.js';
import { init as initExtubacionPuma } from './extubacion-puma.js';
import { init as initCitratoTrr } from './citrato-trr.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). UCI/Papers Tuiter expone aquí su
// banco/temas para que main.js los fusione con los de Hematología y
// Nefrología en una única llamada.
export const quizTriggerId = ['btn-uci-shock-repasar', 'btn-no-repasar', 'btn-vdlra-repasar', 'btn-vexus-repasar', 'btn-extub-repasar', 'btn-citrato-repasar'];
export const quizBanco = [...preguntasShockSeptico, ...preguntasOxidoNitrico, ...preguntasVdLra, ...preguntasVexus, ...preguntasExtubacionPuma, ...preguntasCitratoTrr];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js) —
// aquí cada "bloque" es directamente un paper, ya que cada uno es su propio
// submenú de nivel medio en la navegación real de la app.
const ASIGNATURA = 'UCI / Papers Tuiter';
export const quizTemas = [
    ...temasShockSeptico.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: '25 años de resucitación en shock séptico' })),
    ...temasOxidoNitrico.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Óxido nítrico inhalado' })),
    ...temasVdLra.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Disfunción del VD y LRA postoperatoria' })),
    ...temasVexus.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'VExUS: ecografía de la congestión venosa' })),
    ...temasExtubacionPuma.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Guías PUMA de extubación traqueal' })),
    ...temasCitratoTrr.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Toxicidad sistémica por citrato en TRR' })),
];

export function init() {
    const uciLevel = createViewSwitcher({
        menu: document.getElementById('uci-papers-menu-view'),
        shockSeptico: document.getElementById('uci-paper-shock-view'),
        oxidoNitrico: document.getElementById('uci-paper-no-view'),
        vdLra: document.getElementById('uci-paper-vdlra-view'),
        vexus: document.getElementById('uci-paper-vexus-view'),
        extubacionPuma: document.getElementById('uci-paper-extub-view'),
        citratoTrr: document.getElementById('uci-paper-citrato-view'),
    });

    document.getElementById('btn-paper-shock').addEventListener('click', () => uciLevel.show('shockSeptico'));
    document.getElementById('btn-paper-no').addEventListener('click', () => uciLevel.show('oxidoNitrico'));
    document.getElementById('btn-paper-vdlra').addEventListener('click', () => uciLevel.show('vdLra'));
    document.getElementById('btn-paper-vexus').addEventListener('click', () => uciLevel.show('vexus'));
    document.getElementById('btn-paper-extub').addEventListener('click', () => uciLevel.show('extubacionPuma'));
    document.getElementById('btn-paper-citrato').addEventListener('click', () => uciLevel.show('citratoTrr'));
    document.querySelectorAll('.btn-volver-uci-menu').forEach(b => b.addEventListener('click', () => uciLevel.show('menu')));

    initCorkboard('uci-shock-corkboard', 'panel-uci-shock-tabs');
    initCorkboard('no-corkboard', 'panel-no-tabs');
    initCorkboard('vdlra-corkboard', 'panel-vdlra-tabs');
    initCorkboard('vexus-corkboard', 'panel-vexus-tabs');
    initExtubacionPuma();
    initCitratoTrr();

    uciLevel.show('menu');

    // Deja siempre el submenú de papers como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // nefrologia.volverAlMenu() y atlas.reset() ya dan a Nefrología y
    // Hematología. Lo usa home/index.js.
    return {
        volverAlMenu: () => uciLevel.show('menu'),
        // Salto a una ficha concreta (enlaces `[data-especialidad="uciPapers"]`,
        // tanto desde otras especialidades como entre papers de este submenú).
        irAFicha: uciLevel.irAFicha,
    };
}
