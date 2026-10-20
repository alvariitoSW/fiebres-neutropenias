// La explicación guiada de un modelo vivo (REGLAS §7.10, decisión del usuario del 20/10/2026: «que te diga, pues mira,
// en una sepsis pasa esto, pasa esto, como puedes ver en la imagen»). Cada estado con nombre de un modelo lleva 3-5
// pasos cortos que se leen uno a uno («Siguiente»); cada paso señala en el dibujo lo que cuenta (un anillo sobre una
// parte del SVG, o el marco de una cifra del tablero) y lleva su «Ver en la ficha» (core/citas.js). No sustituye a la
// Mayéutica: Explorar explica; la Mayéutica pregunta.
//
// Los pasos viven en los datos del modelo; esta pieza no sabe nada de ningún modelo:
//   { t: 'texto del paso (HTML corto)',
//     resalta: '#id' | ['#id', '.clase'],   lo que se señala (dentro de `raiz`): en un SVG, un anillo; fuera, un marco
//     cita: { ficha, id, pag, pdf } | [citas],  «Ver en la ficha» y el PDF (core/citas.js)
//     org: 'ilustrativo' | 'fisiología general' | …,  el origen de las cifras del paso que no salen de la cita
//     …y lo que el modelo quiera (estado, lupa, mirar…): se lo pasa alPaso() antes de señalar }
//
// Uso:
//   const guia = crearExplicacion({ cont, raiz, alPaso(paso, i), alSalir(), citaOpciones });
//   guia.abrir({ titulo: 'Anemia que compensa', pasos, fuentes });   guia.cerrar();   guia.refrescar();
// Con «reducir movimiento», el anillo no late y el texto no entra con animación (lo hace el CSS).
import { citaHTML, citasHTML } from './citas.js';

const NS = 'http://www.w3.org/2000/svg';
const n2 = x => +x.toFixed(1);
const lista = x => (Array.isArray(x) ? x : x ? [x] : []);

// La caja de un elemento del SVG en las coordenadas de su <svg> (vale con transformaciones de CSS y de SVG por
// medio, como la lupa que se abre con un muelle).
function cajaEnSvg(el, svg) {
    const m0 = svg.getScreenCTM(), m1 = el.getScreenCTM && el.getScreenCTM();
    if (!m0 || !m1) return null;
    let b; try { b = el.getBBox(); } catch { return null; }
    if (!b || (!b.width && !b.height)) return null;
    const m = m0.inverse().multiply(m1);
    const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
        .map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
}

export function crearExplicacion({ cont, raiz, alPaso = () => {}, alSalir = () => {}, citaOpciones = {} }) {
    let datos = null, i = 0;
    const marcados = new Set();

    function borrar() {
        raiz.querySelectorAll('g.guia-capa').forEach(g => g.remove());
        marcados.forEach(el => el.classList.remove('guia-marco'));
        marcados.clear();
    }
    // Señala en el dibujo lo que cuenta el paso: un anillo por SVG (la caja de todo lo señalado en él) o un marco.
    function senalar() {
        borrar();
        const paso = datos && datos.pasos[i];
        if (!paso) return;
        const porSvg = new Map();
        for (const sel of lista(paso.resalta)) {
            for (const el of raiz.querySelectorAll(sel)) {
                const svg = el.ownerSVGElement;
                if (svg) { if (!porSvg.has(svg)) porSvg.set(svg, []); porSvg.get(svg).push(el); }
                else if (el.getClientRects().length) { el.classList.add('guia-marco'); marcados.add(el); }
            }
        }
        for (const [svg, els] of porSvg) {
            const cajas = els.map(el => cajaEnSvg(el, svg)).filter(Boolean);
            if (!cajas.length) continue;
            const x0 = Math.min(...cajas.map(c => c.x)), y0 = Math.min(...cajas.map(c => c.y));
            const x1 = Math.max(...cajas.map(c => c.x + c.w)), y1 = Math.max(...cajas.map(c => c.y + c.h));
            const vb = svg.viewBox.baseVal, pad = 4;
            // dentro del dibujo: el anillo no se sale por los bordes
            const x = Math.max(vb.x + 1.5, x0 - pad), y = Math.max(vb.y + 1.5, y0 - pad);
            const w = Math.min(vb.x + vb.width - 1.5, x1 + pad) - x, h = Math.min(vb.y + vb.height - 1.5, y1 + pad) - y;
            const g = document.createElementNS(NS, 'g');
            g.setAttribute('class', 'guia-capa'); g.setAttribute('aria-hidden', 'true');
            g.innerHTML = `<rect class="guia-anillo" x="${n2(x)}" y="${n2(y)}" width="${n2(Math.max(8, w))}" height="${n2(Math.max(8, h))}" rx="8"/>`;
            svg.appendChild(g);
        }
    }

    function pintar() {
        const paso = datos.pasos[i], n = datos.pasos.length, ultimo = i === n - 1;
        const citas = lista(paso.cita);
        cont.innerHTML = `<div class="guia" role="region" aria-label="Explicación paso a paso">
            <div class="guia-cab"><span class="guia-n">Paso ${i + 1} de ${n}</span><b class="guia-tit">${datos.titulo}</b>
              <button type="button" class="guia-x" data-guia="salir" aria-label="Cerrar la explicación">×</button></div>
            <p class="guia-txt" aria-live="polite">${paso.t}${paso.org ? ` <span class="guia-org">${paso.org}</span>` : ''}</p>
            ${citas.length ? `<div class="guia-citas">${citas.map(c => citaHTML(c, citaOpciones)).join('')}</div>` : ''}
            ${ultimo && datos.fuentes && datos.fuentes.length ? `<details class="guia-fuentes"><summary>De dónde sale este estado (${datos.fuentes.length})</summary>${citasHTML(datos.fuentes, citaOpciones)}</details>` : ''}
            <div class="guia-nav">
              <button type="button" class="guia-b" data-guia="-1" ${i === 0 ? 'disabled' : ''}>← Anterior</button>
              <span class="guia-puntos" aria-hidden="true">${datos.pasos.map((_, j) => `<i class="${j < i ? 'hecho' : j === i ? 'aqui' : ''}"></i>`).join('')}</span>
              <button type="button" class="guia-b guia-prim" data-guia="${ultimo ? 'salir' : '1'}">${ultimo ? 'Terminar' : 'Siguiente →'}</button>
            </div></div>`;
        const g = cont.querySelector('.guia');
        g.classList.remove('guia-entra'); void g.offsetWidth; g.classList.add('guia-entra');
    }

    function ir(k) {
        if (!datos) return;
        i = Math.max(0, Math.min(datos.pasos.length - 1, k));
        borrar();
        alPaso(datos.pasos[i], i);
        pintar();
        // el modelo se repinta (y la lupa se abre) antes de medir dónde está lo que se señala
        requestAnimationFrame(() => requestAnimationFrame(senalar));
    }

    cont.addEventListener('click', ev => {
        const b = ev.target.closest('[data-guia]');
        if (!b || !datos) return;
        if (b.dataset.guia === 'salir') { api.cerrar(); return; }
        ir(i + (+b.dataset.guia));
    });

    const api = {
        get activo() { return !!datos; },
        get paso() { return i; },
        get datos() { return datos; },
        abrir(d) { datos = d; cont.hidden = false; ir(0); },
        ir,
        cerrar() {
            if (!datos) return;
            const d = datos; datos = null;
            borrar(); cont.innerHTML = ''; cont.hidden = true;
            alSalir(d);
        },
        // Volver a señalar (si el modelo repintó su dibujo y se llevó el anillo)
        refrescar() { if (datos) senalar(); },
    };
    return api;
}
