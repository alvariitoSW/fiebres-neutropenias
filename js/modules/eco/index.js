// Eco cardíaca: vista de la app con el simulador (simulador.mjs).
//
// - El simulador (WebGL, motor del latido, ecografía, formas precalculadas) es lo más pesado de la app: se importa
//   la primera vez que la vista se ve en pantalla, nunca al arrancar.
// - Solo anima mientras la vista está en pantalla y la pestaña visible.
// - Cualquier botón con data-eco-vista / data-eco-escenario / data-eco-medir / data-eco-panel (junto a
//   data-especialidad="eco", que hace la navegación en home/index.js) deja el simulador en esa vista, ese escenario,
//   esa medida del modo M o con ese panel abierto (guyton, epp, cateter, termo: la hemodinámica de Marino). Con
//   data-eco-panel, el «← VOLVER» vuelve a la ficha de origen (core/volver-ficha.js, por modelosVivos).
// - "Qué mirar en esta vista" copia líneas reales de otras fichas (que-mirar.js).
import { QUE_MIRAR, ESCENARIO_TIPO, FORMA_NOTA } from './que-mirar.js';
import { ATLAS_VISTA, ATLAS_ESCENARIO, ATLAS_MODO, atlasUrl } from './atlas-ouyang.js';
import { initAtlas, enApp } from './atlas/atlas.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { preguntasAtlasEco, temasAtlasEco } from '../../data/eco-atlas-preguntas.js';

// Repaso del Atlas de ecocardiografía (main.js fusiona los de todas las especialidades).
export const quizTriggerId = ['btn-eco-atlas-repasar', 'btn-eco-atlas-repasar-todo'];
export const quizBanco = preguntasAtlasEco;
export const quizTemas = temasAtlasEco.map(t => ({ ...t, asignatura: 'Eco cardíaca', bloque: 'Atlas de ecocardiografía' }));

export function init() {
    const raiz = document.getElementById('cv-sim');
    if (!raiz) return { volverAlMenu() {}, irAFicha() {} };
    let sim = null, carga = null, visible = false;
    let pendiente = {};

    // ---- Dos secciones: el simulador y el Atlas de ecocardiografía (atlas/atlas.js) ----
    const secAtlas = document.getElementById('cv-seccion-atlas');
    const atlas = initAtlas({ alAbrirSimulador: (modo) => { seccion('sim'); pendiente = { modo }; cargar(); aplicarPendiente(); raiz.scrollIntoView({ block: 'start' }); } });
    function seccion(k) {
        const enAtlas = k === 'atlas';
        raiz.hidden = enAtlas; secAtlas.hidden = !enAtlas;
        document.querySelectorAll('.cv-secciones [data-seccion]').forEach(b => { const on = b.dataset.seccion === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
        enAtlas ? atlas.mostrar() : atlas.ocultar();
    }
    document.querySelector('.cv-secciones').addEventListener('click', (e) => { const b = e.target.closest('[data-seccion]'); if (b) seccion(b.dataset.seccion); });

    function aplicarPendiente() {
        if (!sim) return;
        // con un panel de hemodinámica, el paciente empieza limpio aunque sea el mismo escenario (sin bolos ni EPP previos)
        if (pendiente.escenario && (pendiente.escenario !== sim.escenarioActual || pendiente.panel)) sim.escenario(pendiente.escenario);
        if (pendiente.vista && pendiente.vista !== sim.vistaActual) sim.vista(pendiente.vista);
        if (pendiente.medir) { sim.modo('M'); sim.medir(pendiente.medir); }
        if (pendiente.modo) sim.modo(pendiente.modo);
        if (pendiente.panel) sim.panel(pendiente.panel);
        pendiente = {};
        pintarAtlasAqui();
    }
    function actualizarActivo() { sim?.activo(visible && !document.hidden); }

    function cargar() {
        if (carga) return carga;
        carga = import('./simulador.mjs').then(({ montarSimulador }) => {
            // un fotograma para que se vea "Cargando…" antes de calcular el latido inicial (bloquea un momento)
            return new Promise(r => requestAnimationFrame(() => setTimeout(r, 0))).then(() => {
                document.getElementById('cv-contenido').hidden = false;
                sim = montarSimulador(raiz, { onVista: (k) => { pintarQueMirar(k); pintarAtlasAqui(); }, onEscenario: (k) => { pintarEscenario(k); pintarAtlasAqui(); } });
                document.getElementById('cv-cargando').hidden = true;
                pintarQueMirar(sim.vistaActual); pintarEscenario(sim.escenarioActual); pintarAtlasAqui();
                aplicarPendiente(); actualizarActivo();
            });
        }).catch(err => {
            console.error('[eco] no se pudo cargar el simulador', err);
            const c = document.getElementById('cv-cargando');
            c.textContent = 'No se pudo cargar el simulador. Comprueba la conexión y vuelve a entrar.';
            carga = null;
        });
        return carga;
    }

    new IntersectionObserver((e) => {
        visible = e[0].isIntersecting;
        if (visible) cargar();
        actualizarActivo();
    }).observe(raiz);
    document.addEventListener('visibilitychange', actualizarActivo);

    // Enlaces desde otras fichas: la navegación la hace el listener de [data-especialidad] de home.
    document.addEventListener('click', (e) => {
        const a = e.target.closest('[data-eco-atlas]');
        if (a) { seccion('atlas'); a.dataset.ecoAtlas ? atlas.abrir(a.dataset.ecoAtlas) : atlas.verIndice(); return; }
        const b = e.target.closest('[data-eco-vista], [data-eco-escenario], [data-eco-medir], [data-eco-panel]');
        if (!b) return;
        seccion('sim');
        pendiente = { vista: b.dataset.ecoVista, escenario: b.dataset.ecoEscenario, medir: b.dataset.ecoMedir, panel: b.dataset.ecoPanel };
        aplicarPendiente();
    });

    // "En el atlas": los capítulos de lo que se ve ahora (vista, escenario, modo o medida), sin repetir.
    function pintarAtlasAqui() {
        const caja = document.getElementById('cv-atlas-aqui');
        if (!caja || !sim) return;
        const modo = raiz.querySelector('[data-modo].on')?.dataset.modo;
        const medir = modo === 'M' ? raiz.querySelector('[data-medir].on')?.dataset.medir : null;
        const lista = [...(ATLAS_VISTA[sim.vistaActual] || []), ...(ATLAS_ESCENARIO[sim.escenarioActual] || []),
            ...(ATLAS_MODO[medir] || ATLAS_MODO[modo] || [])];
        const vistos = new Set();
        const enlaces = lista.filter(e => !vistos.has(e.clave) && vistos.add(e.clave));
        caja.innerHTML = enlaces.length ? `<p class="cv-muted">En el Atlas de ecocardiografía (los marcados ↗, aún solo en el original en inglés):</p>
            <div class="cv-fila">${enlaces.map(e => enApp(e.clave)
                ? `<button type="button" class="cv-mini" data-eco-atlas="${e.clave}">📖 ${e.titulo}</button>`
                : `<a class="cv-mini" href="${atlasUrl(e.clave)}" target="_blank" rel="noopener">${e.titulo} ↗</a>`).join('')}</div>` : '';
    }
    raiz.addEventListener('click', (e) => { if (e.target.closest('[data-modo], [data-medir]')) requestAnimationFrame(pintarAtlasAqui); });

    function pintarEscenario(k) {
        const nota = document.getElementById('cv-escenario-nota');
        const tipo = ESCENARIO_TIPO[k];
        nota.innerHTML = FORMA_NOTA[k] ? `${FORMA_NOTA[k]} Mira cómo cambian el corazón, la eco y las cifras; debajo, cada medida frente a su ficha.`
            : tipo
            ? `Patrón de shock <b>${tipo}</b>: el modelo reproduce la dirección de PVC, gasto y RVS de la Tabla 14.1 de Merino (lo comprueban sus pruebas automáticas). Las magnitudes son ilustrativas. ` +
              `<button type="button" class="especialidad-link" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="mc-definiciones">Ver la Tabla 14.1 →</button>`
            : 'Latido normal en reposo. Elige un escenario para ver cómo cambian el corazón, la eco y las cifras.';
    }

    function copiaLinea(el) {
        if (el.tagName === 'TR') {
            return [...el.cells].map(c => c.textContent.trim()).join(' — ');
        }
        const c = el.cloneNode(true);
        c.removeAttribute('id');
        c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
        c.querySelectorAll('[onclick]').forEach(x => x.removeAttribute('onclick'));
        // un acordeón se copia abierto y sin su "+"
        c.querySelectorAll('.micro-prof-body').forEach(x => x.classList.add('active'));
        c.querySelectorAll('.toggle-icon').forEach(x => x.remove());
        return c.outerHTML;
    }

    function pintarQueMirar(k) {
        const caja = document.getElementById('cv-que-mirar'), card = document.getElementById('cv-que-mirar-card');
        const items = (QUE_MIRAR[k] || []).map(it => ({ it, el: document.querySelector(it.fuente) })).filter(x => x.el);
        card.hidden = false;
        if (!items.length) {
            caja.innerHTML = '<p class="cv-muted">La app todavía no tiene texto propio sobre esta vista. Llegará con los documentos de ecocardiografía.</p>';
            return;
        }
        caja.innerHTML = items.map(({ it, el }) => {
            const contenido = copiaLinea(el);
            // una tabla copiada sin el contenedor que la deja desplazarse desbordaría la página en el móvil
            const cuerpo = el.tagName === 'TR' ? `<p>${contenido}</p>` : el.tagName === 'TABLE' ? `<div style="overflow-x:auto;">${contenido}</div>` : contenido;
            return `<div class="cv-qm-item">
                <div class="cv-qm-cuerpo">${cuerpo}</div>
                ${it.pendiente ? `<p class="cv-muted cv-qm-pendiente">${it.pendiente}</p>` : ''}
                <button type="button" class="especialidad-link cv-qm-ir" data-especialidad="${it.especialidad}" data-view="${it.view}" data-panel="${it.panel}" data-tab="${it.tab}" data-resaltar="${it.fuente}">${it.ficha} →</button>
            </div>`;
        }).join('');
    }

    // «← VOLVER»: a la pantalla de origen (home/index.js) o, si se entró por un panel de hemodinámica desde una ficha,
    // a esa ficha (marcarVolver le pone el enlace cruzado de vuelta). Cualquier otra entrada lo deja como siempre.
    const volver = document.getElementById('btn-volver-eco');
    return {
        // entrar desde un menú: arriba del todo, sin tocar la vista ni el escenario elegidos
        volverAlMenu() { marcarVolver(volver, null, null); window.scrollTo(0, 0); },
        // llegar desde un enlace de otra ficha: arriba del todo (la página venía desplazada de la ficha de origen)
        irAFicha() { marcarVolver(volver, null, null); window.scrollTo(0, 0); },
        // data-eco-panel: home/index.js lo llama tras irAFicha con la ficha de la que se sale
        modelosVivos: { ecoPanel: (_panel, origen) => marcarVolver(volver, null, origen) },
    };
}
