// Módulo "UCI / Papers Tuiter": resúmenes de papers de Medicina Intensiva
// compartidos en redes sociales. Cada paper es una entrada de un submenú
// propio (mismo patrón que Citopenias/Trasplante en Hematología) y, dentro
// de él, un cuaderno de campo con sus bloques temáticos — nunca se fabrica
// contenido clínico sin una fuente real (ver CLAUDE.md).
import { createViewSwitcher } from '../../core/navigation.js';
import { initCorkboard, openCorkboardTopic } from '../../core/corkboard.js';
import { preguntasShockSeptico, temasShockSeptico } from '../../data/shock-septico-preguntas.js';
import { preguntasOxidoNitrico, temasOxidoNitrico } from '../../data/oxido-nitrico-preguntas.js';
import { preguntasVdLra, temasVdLra } from '../../data/vd-lra-preguntas.js';
import { preguntasVexus, temasVexus } from '../../data/vexus-preguntas.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). UCI/Papers Tuiter expone aquí su
// banco/temas para que main.js los fusione con los de Hematología y
// Nefrología en una única llamada.
export const quizTriggerId = ['btn-uci-shock-repasar', 'btn-no-repasar', 'btn-vdlra-repasar', 'btn-vexus-repasar'];
export const quizBanco = [...preguntasShockSeptico, ...preguntasOxidoNitrico, ...preguntasVdLra, ...preguntasVexus];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js) —
// aquí cada "bloque" es directamente un paper, ya que cada uno es su propio
// submenú de nivel medio en la navegación real de la app.
const ASIGNATURA = 'UCI / Papers Tuiter';
export const quizTemas = [
    ...temasShockSeptico.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: '25 años de resucitación en shock séptico' })),
    ...temasOxidoNitrico.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Óxido nítrico inhalado' })),
    ...temasVdLra.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Disfunción del VD y LRA postoperatoria' })),
    ...temasVexus.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'VExUS: ecografía de la congestión venosa' })),
];

export function init() {
    const uciLevel = createViewSwitcher({
        menu: document.getElementById('uci-papers-menu-view'),
        shockSeptico: document.getElementById('uci-paper-shock-view'),
        oxidoNitrico: document.getElementById('uci-paper-no-view'),
        vdLra: document.getElementById('uci-paper-vdlra-view'),
        vexus: document.getElementById('uci-paper-vexus-view'),
    });

    document.getElementById('btn-paper-shock').addEventListener('click', () => uciLevel.show('shockSeptico'));
    document.getElementById('btn-paper-no').addEventListener('click', () => uciLevel.show('oxidoNitrico'));
    document.getElementById('btn-paper-vdlra').addEventListener('click', () => uciLevel.show('vdLra'));
    document.getElementById('btn-paper-vexus').addEventListener('click', () => uciLevel.show('vexus'));
    document.querySelectorAll('.btn-volver-uci-menu').forEach(b => b.addEventListener('click', () => uciLevel.show('menu')));

    initCorkboard('uci-shock-corkboard', 'panel-uci-shock-tabs');
    initCorkboard('no-corkboard', 'panel-no-tabs');
    initCorkboard('vdlra-corkboard', 'panel-vdlra-tabs');
    initCorkboard('vexus-corkboard', 'panel-vexus-tabs');

    // Enlaces entre papers de este mismo submenú (p. ej. VExUS ↔ VD y LRA
    // postoperatoria, que ya se citaban mutuamente antes de que VExUS
    // tuviera su propia ficha completa). Clase propia (`.paper-link`), NO
    // `.tx-link`, para no colisionar con el listener global de `.tx-link`
    // ya registrado por nefrologia/index.js (que trataría un `data-view`
    // como "vdLra" como una clave inválida de SU PROPIO switcher y
    // ocultaría todas sus vistas — mismo problema ya detectado y evitado
    // con `.especialidad-link` entre especialidades).
    document.querySelectorAll('.paper-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const { view, panel, tab } = btn.dataset;
            if (view) uciLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        });
    });

    uciLevel.show('menu');

    // Deja siempre el submenú de papers como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // nefrologia.volverAlMapa() y atlas.reset() ya dan a Nefrología y
    // Hematología. Lo usa home/index.js.
    return {
        volverAlMenu: () => uciLevel.show('menu'),
        // Salto genérico desde OTRAS especialidades (p. ej. FRA en
        // Nefrología, enlazando a la ficha VExUS) — mismo patrón que
        // `irAFicha` ya exponen nefrologia/index.js y fisio-uci/index.js.
        irAFicha: (view, panel, tab) => {
            uciLevel.show(view);
            if (panel && tab) openCorkboardTopic(panel, tab);
        },
    };
}
