// Módulo "Sobrevivir a la UMI": manual de orientación interno de la Unidad
// de Medicina Intensiva (HUGCDN), protocolos prácticos de guardia
// transversales a cualquier órgano — no ligados a una especialidad de
// órgano concreta (a diferencia de Cardiología/Nefrología/Neumología).
// Desde el rediseño (ver CLAUDE.md), ya no es una única guía: son 4,
// conviviendo en el mismo .constellation del submenú — el Manual UMI
// Negrín (18 fichas, manual-umi.html, sin cambios), más 3 guías nuevas
// con un patrón de interacción distinto cada una porque no son "más
// fichas de estudio": Dudas de guardia (bitácora agrupada por tema, con
// un formulario real para añadir dudas nuevas desde el dispositivo — ver
// dudas-guardia.js), Preguntas MC difíciles (portada de un
// banco de quiz "modo examen", resuelto por quiz.js) y Técnicas R1
// (índice de solo navegación, cero contenido propio — conecta con
// fichas ya construidas en Manual UMI/Merino Cardiología/UCI Papers
// Tuiter). Mismo patrón de submenú con switcher medio propio de siempre.
import { createViewSwitcher } from '../../core/navigation.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { preguntasManualUmi, temasManualUmi } from '../../data/manual-umi-preguntas.js';
import { preguntasMcDificiles, temasMcDificiles } from '../../data/preguntas-mc-dificiles.js';
import { init as initManualUmi } from './manual-umi.js';
import { init as initDudasGuardia } from './dudas-guardia.js';

// El modal de repaso (#quiz-modal-overlay) es un único partial compartido
// por TODA la app — solo puede existir una llamada activa a initQuiz() en
// toda la página (ver quiz.js). Sobrevivir a la UMI expone aquí su
// banco/temas para que main.js los fusione con el resto de especialidades.
// 'Preguntas MC difíciles' es un bloque más dentro de la misma asignatura
// (no un banco aparte): aparece en el selector de 3 niveles igual que
// 'Manual UMI Negrín', pero su propio botón de entrada
// (#btn-mc-dificiles-repasar, en preguntas-mc.html) lleva además
// data-quiz-asignatura/data-quiz-bloque — quiz.js, con el cambio mínimo
// descrito en su propio comentario, salta directo a ese bloque sin pasar
// por la pantalla de "elige asignatura", porque la propia guía ya es
// monotemática (no tendría sentido elegir asignatura solo para volver a
// elegir el único bloque que hay).
export const quizTriggerId = ['btn-manual-umi-repasar', 'btn-mc-dificiles-repasar'];
export const quizBanco = [...preguntasManualUmi, ...preguntasMcDificiles];
// Menú del quiz en 3 niveles (asignatura → bloque → ficha, ver quiz.js).
const ASIGNATURA = 'Sobrevivir a la UMI';
export const quizTemas = [
    ...temasManualUmi.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Manual UMI Negrín' })),
    ...temasMcDificiles.map(t => ({ ...t, asignatura: ASIGNATURA, bloque: 'Preguntas MC difíciles' })),
];

export function init() {
    const sobrevivirLevel = createViewSwitcher({
        menu: document.getElementById('sobrevivir-umi-menu-view'),
        manualUmi: document.getElementById('manual-umi-view'),
        dudasGuardia: document.getElementById('dudas-guardia-view'),
        preguntasMc: document.getElementById('preguntas-mc-view'),
        tecnicasR1: document.getElementById('tecnicas-r1-view'),
    });

    document.getElementById('btn-manual-umi').addEventListener('click', () => sobrevivirLevel.show('manualUmi'));
    document.getElementById('btn-dudas-guardia').addEventListener('click', () => sobrevivirLevel.show('dudasGuardia'));
    document.getElementById('btn-preguntas-mc').addEventListener('click', () => sobrevivirLevel.show('preguntasMc'));
    document.getElementById('btn-tecnicas-r1').addEventListener('click', () => sobrevivirLevel.show('tecnicasR1'));
    document.querySelectorAll('.btn-volver-sobrevivir-umi-menu').forEach(b => b.addEventListener('click', () => sobrevivirLevel.show('menu')));

    // Índice rápido por bloque temático (ver sobrevivir-umi-menu.html): cada
    // bloque salta a la primera ficha real de ese tema dentro del cuaderno
    // de campo único de 18 fichas — mismo patrón data-route→onRoute ya usado
    // por el Atlas Hematológico (rutasAtlas), aquí sin pantalla de zona
    // intermedia porque todos los bloques comparten el mismo destino
    // (manual-umi-view), solo cambia la ficha de entrada.
    const rutasCategoria = {
        guardia: 'umi-rutinas',
        shock: 'umi-shock-septico',
        respiratorio: 'umi-rsi',
        cardiovascular: 'umi-cirugia-cardiaca',
    };
    document.querySelectorAll('[data-categoria-route]').forEach(btn => {
        btn.addEventListener('click', () => {
            sobrevivirLevel.show('manualUmi');
            const tab = rutasCategoria[btn.dataset.categoriaRoute];
            if (tab) openCorkboardTopic('panel-manual-umi-tabs', tab);
        });
    });

    initManualUmi();
    initDudasGuardia();

    // Recuentos de la portada de Preguntas MC derivados del banco real, para
    // que no se queden desactualizados al añadir preguntas al archivo de datos.
    const nRedactar = preguntasMcDificiles.filter(p => p.tipo === 'redactar').length;
    const statTotal = document.getElementById('mc-stat-total');
    const statTipos = document.getElementById('mc-stat-tipos');
    if (statTotal) statTotal.textContent = preguntasMcDificiles.length;
    if (statTipos) statTipos.textContent = `${preguntasMcDificiles.length - nRedactar}+${nRedactar}`;

    sobrevivirLevel.show('menu');

    // Deja siempre el submenú de guías como pantalla de entrada al
    // reentrar desde Especialidades — mismo comportamiento que
    // cardiologia.volverAlMenu()/neumologia.volverAlMenu() ya dan.
    return {
        volverAlMenu: () => sobrevivirLevel.show('menu'),
        // Salto a una ficha concreta (enlaces `[data-especialidad="sobrevivirUmi"]`,
        // incluidos los de Técnicas R1 hacia el Manual UMI).
        irAFicha: sobrevivirLevel.irAFicha,
    };
}
