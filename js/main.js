// Punto de entrada de la aplicación.
// 1. Carga los fragmentos HTML de cada calculadora (data-include).
// 2. Activa el comportamiento genérico de acordeones.
// 3. Inicializa cada módulo clínico (listeners + cálculo inicial).
import { includeAll } from './core/include.js';
import { initAccordions } from './core/accordion.js';
import { initLightbox } from './core/lightbox.js';
import { initStudyMode } from './core/pomodoro.js';
import { initSearch } from './core/search.js';
import { initVistaVisual } from './core/vista-visual.js';
import * as home from './modules/home/index.js';
import * as generales from './modules/generales/index.js';
import * as neutropeniaFebril from './modules/neutropenia-febril/index.js';
import * as reconocimiento from './modules/reconocimiento/index.js';
import * as sindromesUrgentes from './modules/sindromes-urgentes/index.js';
import * as trasplante from './modules/trasplante/index.js';
import * as merinoHemato from './modules/merino-hemato/index.js';
import * as nefrologia from './modules/nefrologia/index.js';
import * as uciPapers from './modules/uci-papers/index.js';
import * as fisioUci from './modules/fisio-uci/index.js';
import * as cardiologia from './modules/cardiologia/index.js';
import * as neumologia from './modules/neumologia/index.js';
import * as sobrevivirUmi from './modules/sobrevivir-umi/index.js';
import { initQuiz } from './modules/quiz/quiz.js';

async function start() {
    await includeAll();
    initAccordions();
    initLightbox();
    // Interruptor "Texto | Visual" en cada .card[data-visual] (core/vista-visual.js).
    initVistaVisual();
    const homeApi = home.init();
    // Módulos de Hematología, que cuelgan del propio switcher raíz de home.
    [generales, neutropeniaFebril, reconocimiento, sindromesUrgentes, trasplante, merinoHemato].forEach(m => m.init());
    // Especialidades con switcher medio propio: cada init() devuelve
    // { volverAlMenu, irAFicha }, que home registra bajo la misma clave que
    // su vista raíz (ver registrarEspecialidad en home/index.js).
    const especialidades = { nefrologia, uciPapers, fisioUci, cardiologia, neumologia, sobrevivirUmi };
    Object.entries(especialidades).forEach(([key, mod]) => home.registrarEspecialidad(key, mod.init()));

    // Única llamada a initQuiz() de toda la app — el modal
    // (#quiz-modal-overlay) es un partial compartido, así que cada
    // especialidad expone su banco/temas ya combinados en vez de llamar
    // a initQuiz() cada una por su lado (ver comentario en quiz.js).
    const modulosQuiz = [home, ...Object.values(especialidades)];
    const quizBancoCompleto = modulosQuiz.flatMap(m => m.quizBanco);
    initQuiz({
        triggerId: modulosQuiz.flatMap(m => m.quizTriggerId),
        banco: quizBancoCompleto,
        temas: modulosQuiz.flatMap(m => m.quizTemas),
    });

    // Modo Estudio: estimación de pomodoros por ficha (lectura + preguntas
    // del quiz ya fusionado de arriba) y reloj Pomodoro flotante — ver
    // core/pomodoro.js. Genérico: no requiere tocar ningún módulo de
    // especialidad, igual que core/corkboard.js.
    initStudyMode({ quizBanco: quizBancoCompleto });

    // Buscador global (header, botón "🔍 Buscar"): indexa en vivo todas las
    // fichas de todas las especialidades — ver core/search.js. La
    // navegación a cada resultado reutiliza el router que home.init() ya
    // expone para los botones .especialidad-link.
    initSearch({ navegar: homeApi?.irAResultadoBusqueda });
}

start();
