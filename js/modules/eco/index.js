// Eco cardíaca: vista de la app con el simulador (simulador.mjs).
//
// - El simulador (WebGL, motor del latido, ecografía, formas precalculadas) es lo más pesado de la app: se importa
//   la primera vez que la vista se ve en pantalla, nunca al arrancar.
// - Solo anima mientras la vista está en pantalla y la pestaña visible.
// - Cualquier botón con data-eco-vista / data-eco-escenario / data-eco-medir (junto a data-especialidad="eco", que
//   hace la navegación en home/index.js) deja el simulador en esa vista, ese escenario o esa medida del modo M.
// - "Qué mirar en esta vista" copia líneas reales de otras fichas (que-mirar.js).
import { QUE_MIRAR, ESCENARIO_TIPO } from './que-mirar.js';

// Sin banco de repaso propio todavía (main.js fusiona los de todas las especialidades).
export const quizTriggerId = [];
export const quizBanco = [];
export const quizTemas = [];

export function init() {
    const raiz = document.getElementById('cv-sim');
    if (!raiz) return { volverAlMenu() {}, irAFicha() {} };
    let sim = null, carga = null, visible = false;
    let pendiente = {};

    function aplicarPendiente() {
        if (!sim) return;
        if (pendiente.escenario && pendiente.escenario !== sim.escenarioActual) sim.escenario(pendiente.escenario);
        if (pendiente.vista && pendiente.vista !== sim.vistaActual) sim.vista(pendiente.vista);
        if (pendiente.medir) { sim.modo('M'); sim.medir(pendiente.medir); }
        pendiente = {};
    }
    function actualizarActivo() { sim?.activo(visible && !document.hidden); }

    function cargar() {
        if (carga) return carga;
        carga = import('./simulador.mjs').then(({ montarSimulador }) => {
            // un fotograma para que se vea "Cargando…" antes de calcular el latido inicial (bloquea un momento)
            return new Promise(r => requestAnimationFrame(() => setTimeout(r, 0))).then(() => {
                document.getElementById('cv-contenido').hidden = false;
                sim = montarSimulador(raiz, { onVista: pintarQueMirar, onEscenario: pintarEscenario });
                document.getElementById('cv-cargando').hidden = true;
                pintarQueMirar(sim.vistaActual); pintarEscenario(sim.escenarioActual);
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
        const b = e.target.closest('[data-eco-vista], [data-eco-escenario], [data-eco-medir]');
        if (!b) return;
        pendiente = { vista: b.dataset.ecoVista, escenario: b.dataset.ecoEscenario, medir: b.dataset.ecoMedir };
        aplicarPendiente();
    });

    function pintarEscenario(k) {
        const nota = document.getElementById('cv-escenario-nota');
        const tipo = ESCENARIO_TIPO[k];
        nota.innerHTML = tipo
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
            const cuerpo = el.tagName === 'TR' ? `<p>${contenido}</p>` : contenido;
            return `<div class="cv-qm-item">
                <div class="cv-qm-cuerpo">${cuerpo}</div>
                ${it.pendiente ? `<p class="cv-muted cv-qm-pendiente">${it.pendiente}</p>` : ''}
                <button type="button" class="especialidad-link cv-qm-ir" data-especialidad="${it.especialidad}" data-view="${it.view}" data-panel="${it.panel}" data-tab="${it.tab}" data-resaltar="${it.fuente}">${it.ficha} →</button>
            </div>`;
        }).join('');
    }

    return {
        // entrar desde un menú: arriba del todo, sin tocar la vista ni el escenario elegidos
        volverAlMenu() { window.scrollTo(0, 0); },
        // llegar desde un enlace de otra ficha: arriba del todo (la página venía desplazada de la ficha de origen)
        irAFicha() { window.scrollTo(0, 0); },
    };
}
