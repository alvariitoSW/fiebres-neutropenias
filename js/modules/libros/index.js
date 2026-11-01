// Especialidad "Libros": un sitio central para los libros de texto de la app
// (The ICU Book de Marino y El Libro Azul). La pantalla de entrada es la
// estantería (solo los dos libros). Marino abre su portada (Índice | Modelos
// vivos | Repasar): los 6 bloques que viven aquí (caps. 1-11 y 31-53), más el
// de los caps. 12-13, que vive en Hematología (enlace cruzado), sus
// modelos vivos y el índice completo plegado; El Libro Azul abre su índice,
// que lleva a sus fichas de Fisiopatología UCI.
import { createViewSwitcher } from '../../core/navigation.js';
import { arrancar } from '../../core/ui.js';
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
import { nombreFicha } from '../../core/corkboard.js';
import { progresoEstudio } from '../../core/pomodoro.js';
import { init as initAguaViva } from './agua-viva.js';
import { init as initCapilarVivo } from './capilar-vivo.js';
import { init as initCateterVivo } from './cateter-vivo.js';
import { init as initMurallaViva } from './muralla-viva.js';
import { init as initTelarVivo } from './telar-vivo.js';
import { init as initInmersionViva } from './inmersion-viva.js';
import { init as initVasoVivo } from './vaso-vivo.js';
import { init as initShockVivo } from './shock-vivo/index.js';
import { init as initPulmonVivo } from './pulmon-vivo/index.js';
import { init as initRitmoVivo } from './ritmo-vivo/index.js';
import { init as initReceptorVivo } from './receptor-vivo/index.js';
import { init as initIonesVivos } from './iones-vivos/index.js';
import { init as initHepatocitoVivo } from './hepatocito-vivo/index.js';
import { init as initTermostatoVivo } from './termostato-vivo/index.js';
import { init as initEjeVivo } from './eje-vivo/index.js';
import { montarMayeutica } from '../../core/mayeutica.js';
import { MAYEUTICA_B1 } from '../../data/mayeutica/b1.js';
import { MAYEUTICA_APENDICES } from '../../data/mayeutica/b6b-apendices.js';
import { MAYEUTICA_HIGADO } from '../../data/mayeutica/b6b-higado.js';
import { MAYEUTICA_EJE } from '../../data/mayeutica/b6b-eje.js';
import { MAYEUTICA_CUANTO } from '../../data/mayeutica/b6b-cuanto.js';
import { MAYEUTICA_ENTERAL } from '../../data/mayeutica/b6b-enteral.js';
import { MAYEUTICA_NPT } from '../../data/mayeutica/b6b-npt.js';
import { MAYEUTICA_RECEPTOR } from '../../data/mayeutica/b6b-receptor.js';
import { MAYEUTICA_OXIGENO } from '../../data/mayeutica/b6b-oxigeno.js';
import { MAYEUTICA_B5 } from '../../data/mayeutica/b5.js';
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

// Los 9 bloques de Marino (6 viven en Libros; Sangre, Corazón y Pulmón, en Merino): vista → su cuaderno, su banco de preguntas y los modelos vivos que enlazan sus fichas
// (los botones de la pestaña Modelos vivos de la portada, por id).
const BLOQUES = {
    marinoFundamentos: { vista: 'marino-fund-view', panel: 'panel-marino-fund-tabs', nombre: 'Fundamentos', preguntas: preguntasMarinoFundamentos, vivos: ['ctv-menu-libros', 'mur-menu-libros', 'tel-menu-libros', 'inm-menu-libros', 'cpv-menu-libros', 'agv-menu-libros'] },
    // Bloque 2 (caps. 12-13): sus fichas viven en Hematología → Merino HEMATO (su botón es un enlace cruzado, no una vista
    // de Libros); aquí solo cuenta sus fichas y pone la tira de sus modelos vivos en ese cuaderno. Sus preguntas de
    // repaso están en el quiz de Hematología.
    marinoSangre: { vista: 'merino-hemato-view', panel: 'panel-merino-tabs', nombre: 'Sangre y hemostasia', preguntas: [], vivos: ['cpv-menu-libros', 'vso-menu-libros', 'tel-menu-libros'] },
    // Caps. 14-21 (Merino Cardiología) y 22-30 (Merino Neumología): igual que Sangre, enlaces cruzados a sus cuadernos;
    // aquí solo cuentan sus fichas y ponen la tira de sus modelos vivos. Sus preguntas, en el quiz de cada especialidad.
    marinoCorazon: { vista: 'merino-cardio-view', panel: 'panel-merino-cardio-tabs', nombre: 'Corazón y shock', preguntas: [], vivos: ['shv-menu-libros', 'rcv-menu-libros', 'rtv-menu-libros'] },
    marinoPulmon: { vista: 'merino-neumo-view', panel: 'panel-merino-neumo-tabs', nombre: 'Pulmón y respirador', preguntas: [], vivos: ['pul-menu-libros'] },
    marinoRenal: { vista: 'marino-renal-view', panel: 'panel-marino-renal-tabs', nombre: 'Ácido-base, renal y electrolitos', preguntas: preguntasMarinoRenal, vivos: ['abv-menu-libros', 'agv-menu-libros', 'iov-menu-libros'] },
    marinoAbdomen: { vista: 'marino-abd-view', panel: 'panel-marino-abd-tabs', nombre: 'Abdomen y temperatura', preguntas: preguntasMarinoAbdomen, vivos: ['hpv-menu-libros', 'tmv-menu-libros'] },
    marinoNeuro: { vista: 'marino-neuro-view', panel: 'panel-marino-neuro-tabs', nombre: 'Neurología', preguntas: preguntasMarinoNeuro, vivos: [] },
    marinoNutricion: { vista: 'marino-nutri-view', panel: 'panel-marino-nutri-tabs', nombre: 'Nutrición y endocrino', preguntas: preguntasMarinoNutricion, vivos: [] },
    marinoToxicos: { vista: 'marino-tox-view', panel: 'panel-marino-tox-tabs', nombre: 'Tóxicos y apéndices', preguntas: preguntasMarinoToxicos, vivos: ['abv-menu-libros'] },
};
const MODELOS = new Set(['aguaViva', 'capilarVivo', 'cateterVivo', 'murallaViva', 'telarVivo', 'inmersionViva', 'vasoVivo', 'shockVivo', 'pulmonVivo', 'ritmoVivo', 'receptorVivo', 'ionesVivos', 'hepatocitoVivo', 'termostatoVivo', 'ejeVivo']);

// Tira «Modelos vivos de este bloque» arriba de cada bloque: copia los atributos del enlace cruzado de su botón
// en la portada (una sola fuente) y se pinta tras la cabecera del bloque.
function tiraModelos(vista, ids) {
    const botones = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!vista || !botones.length) return;
    const tira = document.createElement('div');
    tira.className = 'lib-tira-vivos';
    tira.innerHTML = '<p class="lib-tira-vivos-titulo">Modelos vivos de este bloque</p><div class="lib-tira-vivos-fila"></div>';
    botones.forEach(b => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lib-vivo-chip';
        Object.entries(b.dataset).filter(([k]) => !k.startsWith('lib')).forEach(([k, v]) => { chip.dataset[k] = v; });
        chip.textContent = `${b.querySelector('.const-orb')?.textContent.trim() ?? ''} ${b.dataset.libCorto}`;
        chip.title = b.querySelector('.const-title')?.textContent ?? '';
        tira.lastElementChild.append(chip);
    });
    (vista.querySelector('.diag-header') ?? vista.firstElementChild).after(tira);
}

export function init() {
    // Recuerdos de esta sesión (en memoria, nada se guarda): el último bloque abierto (para «Seguir donde lo
    // dejaste») y adónde vuelve el «← VOLVER» de un modelo vivo (al bloque si se abrió desde su tira; si no, a la
    // portada). Si se abrió desde una ficha, core/volver-ficha.js lo lleva a la ficha, como siempre.
    let previa = null, ultimoBloque = null, volverDeModelo = 'marinoPortada';
    const librosLevel = createViewSwitcher({
        menu: document.getElementById('libros-menu-view'),
        // Portada de The ICU Book (Índice | Modelos vivos | Repasar) y el índice de El Libro Azul
        marinoPortada: document.getElementById('marino-portada-view'),
        libroAzul: document.getElementById('libro-azul-view'),
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
        // Modelo vivo: el vaso que sangra (la herida y la red), junto al bloque 2 (cap. 13; fichas en Merino HEMATO)
        vasoVivo: document.getElementById('vaso-vivo-view'),
        // Modelos vivos del bloque 3 (caps. 14-19; fichas en Merino Cardiología): shock, corazón eléctrico y receptor
        shockVivo: document.getElementById('shock-vivo-view'),
        pulmonVivo: document.getElementById('pulmon-vivo-view'),
        ritmoVivo: document.getElementById('ritmo-vivo-view'),
        receptorVivo: document.getElementById('receptor-vivo-view'),
        // Iones vivos (bloque 4, caps. 36-38; fichas en Marino Ácido-base, renal y electrolitos)
        ionesVivos: document.getElementById('iones-vivos-view'),
        hepatocitoVivo: document.getElementById('hepatocito-vivo-view'),
        // Termostato vivo (bloque 5, caps. 43-44; fichas en Marino Abdomen y temperatura)
        termostatoVivo: document.getElementById('termostato-vivo-view'),
        // Eje hormonal vivo (bloque 6b, cap. 51; fichas en Marino Nutrición y endocrino)
        ejeVivo: document.getElementById('eje-vivo-view'),
    }, (key) => {
        if (MODELOS.has(key) && !MODELOS.has(previa)) volverDeModelo = BLOQUES[previa] ? previa : 'marinoPortada';
        if (BLOQUES[key]) ultimoBloque = key;
        if (key === 'marinoPortada') pintarPortada();
        previa = key;
    });

    const portada = document.getElementById('marino-portada-view');
    // Pestañas de la portada (Índice | Modelos vivos | Repasar)
    portada.querySelector('.lib-pestanas').addEventListener('click', (e) => {
        const pest = e.target.closest('[data-lib-pestana]');
        if (!pest) return;
        portada.querySelectorAll('.lib-pestana').forEach(p => { p.classList.toggle('active', p === pest); p.setAttribute('aria-selected', String(p === pest)); });
        portada.querySelectorAll('.lib-panel').forEach(p => { p.hidden = p.id !== pest.getAttribute('aria-controls'); });
    });

    // Fichas de cada bloque, vistas (marca del cuaderno en esta sesión) o con estudio en Modo Estudio
    const fichasDe = key => [...document.querySelectorAll(`#${BLOQUES[key].panel} .tab-content[id]`)].map(t => t.id);
    function pintarPortada() {
        const prog = progresoEstudio();
        portada.querySelectorAll('[data-lib-bloque]').forEach(tile => {
            const key = tile.dataset.libBloque;
            const tabs = fichasDe(key);
            const vistas = tabs.filter(t => prog[t] > 0 || document.querySelector(`.field-card.visited[data-tab="${t}"]`)).length;
            tile.querySelector('[data-lib-fichas]').textContent = `${tabs.length} fichas`;
            const barra = tile.querySelector('[data-lib-progreso]');
            barra.hidden = !vistas;
            if (vistas) {
                barra.querySelector('i').style.width = `${Math.round(100 * vistas / tabs.length)}%`;
                barra.querySelector('.lib-bloque-progreso-txt').textContent = `${vistas} de ${tabs.length} vistas`;
            }
        });
        // «Seguir donde lo dejaste»: la ficha abierta del último bloque visitado
        const seguir = document.getElementById('lib-seguir');
        const bloque = BLOQUES[ultimoBloque];
        const panel = bloque && document.getElementById(bloque.panel);
        const ficha = panel && panel.style.display !== 'none' ? panel.querySelector('.tab-content.active[id]') : null;
        const tarjeta = ficha && document.querySelector(`.field-card[data-tab="${ficha.id}"]`);
        seguir.hidden = !tarjeta;
        if (!tarjeta) return;
        Object.assign(seguir.dataset, { especialidad: 'libros', view: ultimoBloque, panel: bloque.panel, tab: ficha.id });
        seguir.innerHTML = `<span class="lib-seguir-eyebrow">Seguir donde lo dejaste →</span><span class="lib-seguir-ficha"></span>`;
        seguir.lastElementChild.textContent = `${bloque.nombre} · ${nombreFicha(tarjeta, ficha.id)}`;
    }
    document.addEventListener('estudio-progreso', () => { if (librosLevel.actual() === 'marinoPortada') pintarPortada(); });

    // Lo que no cambia: cuántos modelos vivos tiene cada bloque, su tira dentro del bloque y cuántas preguntas
    portada.querySelectorAll('[data-lib-bloque]').forEach(tile => {
        const { vivos } = BLOQUES[tile.dataset.libBloque];
        const el = tile.querySelector('[data-lib-vivos]');
        el.hidden = !vivos.length;
        el.textContent = vivos.length === 1 ? '1 modelo vivo' : `${vivos.length} modelos vivos`;
    });
    portada.querySelectorAll('[data-lib-preguntas]').forEach(el => { el.textContent = `${BLOQUES[el.dataset.libPreguntas].preguntas.length} preguntas`; });
    Object.values(BLOQUES).forEach(b => tiraModelos(document.getElementById(b.vista), b.vivos));

    document.getElementById('btn-marino-fund').addEventListener('click', () => librosLevel.show('marinoFundamentos'));
    document.getElementById('btn-marino-renal').addEventListener('click', () => librosLevel.show('marinoRenal'));
    document.getElementById('btn-marino-abd').addEventListener('click', () => librosLevel.show('marinoAbdomen'));
    document.getElementById('btn-marino-neuro').addEventListener('click', () => librosLevel.show('marinoNeuro'));
    document.getElementById('btn-marino-nutri').addEventListener('click', () => librosLevel.show('marinoNutricion'));
    document.getElementById('btn-marino-tox').addEventListener('click', () => librosLevel.show('marinoToxicos'));
    document.getElementById('btn-libro-marino').addEventListener('click', () => librosLevel.show('marinoPortada'));
    document.getElementById('btn-libro-azul').addEventListener('click', () => librosLevel.show('libroAzul'));
    // «← VOLVER» de los bloques y de los modelos vivos de Libros: a la portada de Marino (o, el de un modelo, al
    // bloque desde cuya tira se abrió). El de la portada y el de El Libro Azul, a la estantería.
    document.querySelectorAll('.btn-volver-libros-menu').forEach(b => b.addEventListener('click', () => {
        librosLevel.show(MODELOS.has(librosLevel.actual()) ? volverDeModelo : 'marinoPortada');
    }));
    document.querySelectorAll('.btn-volver-libros-estante').forEach(b => b.addEventListener('click', () => librosLevel.show('menu')));

    initIndice();
    initMarinoFundamentos();
    initVisualMarino();
    // Texto | Visual | Mayéutica en las fichas del bloque 1 que ya la tienen (después de su vista Visual)
    Object.entries(MAYEUTICA_B1).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    initMarinoRenal();
    initMarinoAbdomen();
    initVisualMarinoCaps31a44();
    // Texto | Visual | Estudiar en las fichas del bloque 5 (abdomen y temperatura), después de su vista Visual
    Object.entries(MAYEUTICA_B5).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    initMarinoNeuro();
    initMarinoNutricion();
    initMarinoToxicos();
    initVisualMarinoCaps45a53();
    // Texto | Visual | Estudiar en las fichas de consulta de los apéndices (6L, después de su vista Visual)
    Object.entries(MAYEUTICA_APENDICES).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    // Estudiar en el hígado que se envenena (6I: paracetamol, NAC, alcoholes), con el hepatocito vivo como modelo
    Object.entries(MAYEUTICA_HIGADO).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    // Estudiar en el eje que calla (6H: suprarrenal, tiroides, hipotiroidismo), con el eje vivo como modelo
    Object.entries(MAYEUTICA_EJE).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    Object.entries(MAYEUTICA_CUANTO).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    Object.entries(MAYEUTICA_ENTERAL).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    // Texto | Visual | Estudiar en las fichas de nutrición parenteral (6G, después de su vista Visual)
    Object.entries(MAYEUTICA_NPT).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    Object.entries(MAYEUTICA_RECEPTOR).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    Object.entries(MAYEUTICA_OXIGENO).forEach(([ficha, datos]) => montarMayeutica(ficha, datos));
    // Cada modelo vivo arranca por separado: si uno falla (p. ej. una forma de partícula que falta), los demás y el
    // resto de Libros siguen funcionando, y el error queda en la consola.
    const aguaViva = arrancar('río y mar', initAguaViva);
    const capilarVivo = arrancar('capilar', initCapilarVivo);
    const cateterVivo = arrancar('catéter', initCateterVivo);
    const murallaViva = arrancar('muralla', initMurallaViva);
    const telarVivo = arrancar('telar', initTelarVivo);
    const inmersionViva = arrancar('inmersión', initInmersionViva);
    const vasoVivo = arrancar('vaso que sangra', initVasoVivo);
    const shockVivo = arrancar('shock', initShockVivo);
    const pulmonVivo = arrancar('pulmon', initPulmonVivo);
    const ritmoVivo = arrancar('ritmo', initRitmoVivo);
    const receptorVivo = arrancar('receptor', initReceptorVivo);
    const ionesVivos = arrancar('iones', initIonesVivos);
    const hepatocitoVivo = arrancar('hepatocito', initHepatocitoVivo);
    const termostatoVivo = arrancar('termostato', initTermostatoVivo);
    const ejeVivo = arrancar('eje', initEjeVivo);

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
            // data-vaso-vivo="<estado>", el vaso que sangra
            vasoVivo: (estadoClave, origen) => vasoVivo?.abrir(estadoClave, origen),
            shockVivo: (estadoClave, origen) => shockVivo?.abrir(estadoClave, origen),
            pulmonVivo: (estadoClave, origen) => pulmonVivo?.abrir(estadoClave, origen),
            ritmoVivo: (estadoClave, origen) => ritmoVivo?.abrir(estadoClave, origen),
            receptorVivo: (estadoClave, origen) => receptorVivo?.abrir(estadoClave, origen),
            // data-iones-vivos="<paciente>[:paso|:ion]", los iones vivos
            ionesVivos: (estadoClave, origen) => ionesVivos?.abrir(estadoClave, origen),
            // data-hepatocito-vivo="<paciente>[:tips]", el hepatocito vivo
            hepatocitoVivo: (estadoClave, origen) => hepatocitoVivo?.abrir(estadoClave, origen),
            // data-termostato-vivo="<estado>[:paso]", el termostato vivo
            termostatoVivo: (estadoClave, origen) => termostatoVivo?.abrir(estadoClave, origen),
            // data-eje-vivo="<paciente>[:paso]", el eje hormonal vivo
            ejeVivo: (estadoClave, origen) => ejeVivo?.abrir(estadoClave, origen),
        },
    };
}
