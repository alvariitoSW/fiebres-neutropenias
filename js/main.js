// Punto de entrada de la aplicación.
// 1. Carga los fragmentos HTML de cada calculadora (data-include).
// 2. Activa el comportamiento genérico de acordeones.
// 3. Inicializa cada módulo clínico (listeners + cálculo inicial).
import { includeAll } from './core/include.js';
import { initAccordions } from './core/accordion.js';
import { initLightbox } from './core/lightbox.js';
import * as home from './modules/home/index.js';
import * as generales from './modules/generales/index.js';
import * as neutropeniaFebril from './modules/neutropenia-febril/index.js';
import * as reconocimiento from './modules/reconocimiento/index.js';
import * as sindromesUrgentes from './modules/sindromes-urgentes/index.js';
import * as trasplante from './modules/trasplante/index.js';
import * as nefrologia from './modules/nefrologia/index.js';
import * as uciPapers from './modules/uci-papers/index.js';
import * as fisioUci from './modules/fisio-uci/index.js';
import * as cardiologia from './modules/cardiologia/index.js';
import { initQuiz } from './modules/quiz/quiz.js';

async function start() {
    await includeAll();
    initAccordions();
    initLightbox();
    home.init();
    generales.init();
    neutropeniaFebril.init();
    reconocimiento.init();
    sindromesUrgentes.init();
    trasplante.init();
    const nefrologiaApi = nefrologia.init();
    home.onNefrologiaListo(nefrologiaApi);
    const uciPapersApi = uciPapers.init();
    home.onUciPapersListo(uciPapersApi);
    const fisioUciApi = fisioUci.init();
    home.onFisioUciListo(fisioUciApi);
    const cardiologiaApi = cardiologia.init();
    home.onCardiologiaListo(cardiologiaApi);

    // Única llamada a initQuiz() de toda la app — el modal
    // (#quiz-modal-overlay) es un partial compartido, así que cada
    // especialidad expone su banco/temas ya combinados en vez de llamar
    // a initQuiz() cada una por su lado (ver comentario en quiz.js).
    initQuiz({
        triggerId: [...home.quizTriggerId, ...nefrologia.quizTriggerId, ...uciPapers.quizTriggerId, ...fisioUci.quizTriggerId, ...cardiologia.quizTriggerId],
        banco: [...home.quizBanco, ...nefrologia.quizBanco, ...uciPapers.quizBanco, ...fisioUci.quizBanco, ...cardiologia.quizBanco],
        temas: [...home.quizTemas, ...nefrologia.quizTemas, ...uciPapers.quizTemas, ...fisioUci.quizTemas, ...cardiologia.quizTemas],
    });
}

start();
