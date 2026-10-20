// Especialidad "Libros": un sitio central para los libros de texto de la app
// (The ICU Book de Marino y El Libro Azul). La pantalla de entrada es un
// índice de capítulos que lleva a la ficha donde vive cada uno (casi todos
// siguen en su especialidad); los caps. 1-11 de Marino, que no encajan en
// ninguna especialidad, viven aquí mismo (Marino · Fundamentos), igual que los
// caps. 31-53 (ácido-base, renal y electrolitos; abdomen y temperatura;
// neurología; nutrición y endocrino; tóxicos y apéndices).
import { createViewSwitcher } from '../../core/navigation.js';
import { preguntasMarinoFundamentos, temasMarinoFundamentos } from '../../data/marino-fundamentos-preguntas.js';
import { preguntasMarinoRenal, temasMarinoRenal } from '../../data/marino-renal-preguntas.js';
import { preguntasMarinoAbdomen, temasMarinoAbdomen } from '../../data/marino-abdomen-preguntas.js';
import { preguntasMarinoNeuro, temasMarinoNeuro } from '../../data/marino-neuro-preguntas.js';
import { preguntasMarinoNutricion, temasMarinoNutricion } from '../../data/marino-nutricion-preguntas.js';
import { preguntasMarinoToxicos, temasMarinoToxicos } from '../../data/marino-toxicos-preguntas.js';
import { init as initMarinoFundamentos } from './marino-fundamentos.js';
import { init as initMarinoRenal } from './marino-renal.js';
import { init as initMarinoAbdomen } from './marino-abdomen.js';
import { init as initMarinoNeuro } from './marino-neuro.js';
import { init as initMarinoNutricion } from './marino-nutricion.js';
import { init as initMarinoToxicos } from './marino-toxicos.js';
import { initVisualMarinoCaps45a53 } from './visual-marino-caps45-53.js';
import { initVisualMarinoCaps31a44 } from './visual-marino-caps31-44.js';
import { initVisualMarino } from './visual-marino.js';
import { initIndice, idRepaso } from './indice.js';
import { init as initAguaViva } from './agua-viva.js';
import { init as initCapilarVivo } from './capilar-vivo.js';
import { init as initCateterVivo } from './cateter-vivo.js';
import { init as initMurallaViva } from './muralla-viva.js';
import { init as initTelarVivo } from './telar-vivo.js';
import { init as initInmersionViva } from './inmersion-viva.js';
import { montarMayeutica } from '../../core/mayeutica.js';
import { MAYEUTICA_B1 } from '../../data/mayeutica/b1.js';
import { librosIndice } from '../../data/libros-indice.js';

// Mismo patrón que el resto de especialidades: main.js fusiona banco, temas
// y botones en la única llamada a initQuiz().
export const quizTriggerId = ['btn-marino-fund-repasar', 'btn-marino-renal-repasar', 'btn-marino-abd-repasar', 'btn-marino-neuro-repasar', 'btn-marino-nutri-repasar', 'btn-marino-tox-repasar', ...librosIndice.filter(l => l.quiz?.length).map(idRepaso)];
export const quizBanco = [...preguntasMarinoFundamentos, ...preguntasMarinoRenal, ...preguntasMarinoAbdomen, ...preguntasMarinoNeuro, ...preguntasMarinoNutricion, ...preguntasMarinoToxicos];
const enBloque = (temas, bloque) => temas.map(t => ({ ...t, asignatura: 'Libros', bloque }));
export const quizTemas = [
    ...enBloque(temasMarinoFundamentos, 'Marino · Fundamentos (caps. 1-11)'),
    ...enBloque(temasMarinoRenal, 'Marino · Ácido-base, renal y electrolitos (caps. 31-38)'),
    ...enBloque(temasMarinoAbdomen, 'Marino · Abdomen y temperatura (caps. 39-44)'),
    ...enBloque(temasMarinoNeuro, 'Marino · Neurología (caps. 45-47)'),
    ...enBloque(temasMarinoNutricion, 'Marino · Nutrición y endocrino (caps. 48-51)'),
    ...enBloque(temasMarinoToxicos, 'Marino · Tóxicos y apéndices (caps. 52-53)'),
];

export function init() {
    const librosLevel = createViewSwitcher({
        menu: document.getElementById('libros-menu-view'),
        marinoFundamentos: document.getElementById('marino-fund-view'),
        marinoRenal: document.getElementById('marino-renal-view'),
        marinoAbdomen: document.getElementById('marino-abd-view'),
        marinoNeuro: document.getElementById('marino-neuro-view'),
        marinoNutricion: document.getElementById('marino-nutri-view'),
        marinoToxicos: document.getElementById('marino-tox-view'),
        // Modelo vivo: río y mar (el agua del cuerpo), junto a la fluidoterapia (caps. 10-11)
        aguaViva: document.getElementById('agua-viva-view'),
        // Modelo vivo: capilar y oxígeno (del pulmón a la mitocondria), junto al grupo oxígeno (caps. 7 y 9)
        capilarVivo: document.getElementById('capilar-vivo-view'),
        // Modelo vivo: catéter vivo (flujo, piel y biopelícula), junto al grupo accesos vasculares (caps. 1-3)
        cateterVivo: document.getElementById('cateter-vivo-view'),
        // Modelo vivo: la cama 7 · la muralla de papel (microbioma y úlcera de estrés), junto al cap. 4
        murallaViva: document.getElementById('muralla-viva-view'),
        // Modelo vivo: la cama 7 · el telar de la trombina (tromboprofilaxis), junto al cap. 5
        telarVivo: document.getElementById('telar-vivo-view'),
        // Modelo vivo: la cama 7 · la inmersión (analgesia y sedación), junto al cap. 6
        inmersionViva: document.getElementById('inmersion-viva-view'),
    });

    document.getElementById('btn-marino-fund').addEventListener('click', () => librosLevel.show('marinoFundamentos'));
    document.getElementById('btn-marino-renal').addEventListener('click', () => librosLevel.show('marinoRenal'));
    document.getElementById('btn-marino-abd').addEventListener('click', () => librosLevel.show('marinoAbdomen'));
    document.getElementById('btn-marino-neuro').addEventListener('click', () => librosLevel.show('marinoNeuro'));
    document.getElementById('btn-marino-nutri').addEventListener('click', () => librosLevel.show('marinoNutricion'));
    document.getElementById('btn-marino-tox').addEventListener('click', () => librosLevel.show('marinoToxicos'));
    document.querySelectorAll('.btn-volver-libros-menu').forEach(b => b.addEventListener('click', () => librosLevel.show('menu')));

    initIndice();
    initMarinoFundamentos();
    initVisualMarino();
    // Texto | Visual | Mayéutica en las fichas del bloque 1 que ya la tienen (después de su vista Visual)
    Object.entries(MAYEUTICA_B1).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    initMarinoRenal();
    initMarinoAbdomen();
    initVisualMarinoCaps31a44();
    initMarinoNeuro();
    initMarinoNutricion();
    initMarinoToxicos();
    initVisualMarinoCaps45a53();
    // Cada modelo vivo arranca por separado: si uno falla (p. ej. una forma de partícula que falta), los demás y el
    // resto de Libros siguen funcionando, y el error queda en la consola.
    const arrancar = (nombre, init) => { try { return init(); } catch (e) { console.error(`Modelo vivo «${nombre}» no arrancó:`, e); return null; } };
    const aguaViva = arrancar('río y mar', initAguaViva);
    const capilarVivo = arrancar('capilar', initCapilarVivo);
    const cateterVivo = arrancar('catéter', initCateterVivo);
    const murallaViva = arrancar('muralla', initMurallaViva);
    const telarVivo = arrancar('telar', initTelarVivo);
    const inmersionViva = arrancar('inmersión', initInmersionViva);

    librosLevel.show('menu');

    return {
        volverAlMenu: () => librosLevel.show('menu'),
        irAFicha: librosLevel.irAFicha,
        // data-agua-viva="<estado>" en un enlace cruzado abre el río y mar en ese estado;
        // data-capilar-vivo="<estado>", el capilar y oxígeno; data-cateter-vivo="<estado>", el catéter vivo;
        // data-muralla-viva="<estado>", la muralla de papel
        modelosVivos: {
            aguaViva: (estadoClave, origen) => aguaViva?.abrir(estadoClave, origen),
            capilarVivo: (estadoClave, origen) => capilarVivo?.abrir(estadoClave, origen),
            cateterVivo: (estadoClave, origen) => cateterVivo?.abrir(estadoClave, origen),
            murallaViva: (estadoClave, origen) => murallaViva?.abrir(estadoClave, origen),
            telarVivo: (estadoClave, origen) => telarVivo?.abrir(estadoClave, origen),
            inmersionViva: (estadoClave, origen) => inmersionViva?.abrir(estadoClave, origen),
        },
    };
}
