// Especialidad "Libros": un sitio central para los libros de texto de la app
// (The ICU Book de Marino y El Libro Azul). La pantalla de entrada es un
// índice de capítulos que lleva a la ficha donde vive cada uno (casi todos
// siguen en su especialidad); los caps. 1-11 de Marino, que no encajan en
// ninguna especialidad, viven aquí mismo (Marino · Fundamentos).
import { createViewSwitcher } from '../../core/navigation.js';
import { preguntasMarinoFundamentos, temasMarinoFundamentos } from '../../data/marino-fundamentos-preguntas.js';
import { init as initMarinoFundamentos } from './marino-fundamentos.js';
import { initVisualMarino } from './visual-marino.js';
import { initIndice } from './indice.js';

// Mismo patrón que el resto de especialidades: main.js fusiona banco, temas
// y botones en la única llamada a initQuiz().
export const quizTriggerId = ['btn-marino-fund-repasar'];
export const quizBanco = [...preguntasMarinoFundamentos];
export const quizTemas = temasMarinoFundamentos.map(t => ({ ...t, asignatura: 'Libros', bloque: 'Marino · Fundamentos (caps. 1-11)' }));

export function init() {
    const librosLevel = createViewSwitcher({
        menu: document.getElementById('libros-menu-view'),
        marinoFundamentos: document.getElementById('marino-fund-view'),
    });

    document.getElementById('btn-marino-fund').addEventListener('click', () => librosLevel.show('marinoFundamentos'));
    document.querySelectorAll('.btn-volver-libros-menu').forEach(b => b.addEventListener('click', () => librosLevel.show('menu')));

    initIndice();
    initMarinoFundamentos();
    initVisualMarino();

    librosLevel.show('menu');

    return {
        volverAlMenu: () => librosLevel.show('menu'),
        irAFicha: librosLevel.irAFicha,
    };
}
