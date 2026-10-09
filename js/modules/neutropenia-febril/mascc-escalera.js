// Vista Visual del Índice MASCC: "la escalera de los 26 puntos".
//
// Cada ítem es un bloque cuya altura es su puntuación; los presentes se
// apilan desde el suelo y lo perdido queda como hueco encima, así que la
// altura sólida ES la puntuación y se compara a ojo con la línea del corte.
//
// No tiene estado propio: lee y escribe las mismas casillas/select de la
// vista Texto (generadas desde mascc-data.js) y dispara su evento `change`,
// de modo que calcMASCC() sigue siendo la única que decide el resultado.

import { masccCarga, masccItems, MASCC_MAX, MASCC_CORTE } from '../../data/mascc-data.js';
import { hayRedFlags, puntuacionMascc } from './triaje-mascc.js';
import { irAlTexto, resaltar } from '../../core/vista-visual.js';

const U = 15; // px por punto → pila de 26 × 15 = 390 px

// Lista unificada: la carga clínica (3 niveles) + los ítems binarios.
const BLOQUES = [
    { id: masccCarga.id, max: masccCarga.max, esCarga: true },
    ...masccItems.map(it => ({ id: it.id, max: it.pts, item: it }))
];

let sel = null; // id del último bloque tocado (panel de detalle)

const $ = id => document.getElementById(id);

function ptsActuales(b) {
    const el = $(b.id);
    if (b.esCarga) return parseInt(el.value, 10) || 0;
    return el.checked ? b.max : 0;
}

function etiquetas(b, pts) {
    if (b.esCarga) {
        const op = masccCarga.opciones.find(o => o.pts === pts) || masccCarga.opciones[0];
        return { solido: op.texto, hueco: pts === 0 ? 'Síntomas graves' : 'Carga clínica perdida' };
    }
    return { solido: b.item.corto, hueco: b.item.perdido };
}

// Cambia el input real y avisa a la calculadora como si lo hubiera tocado el usuario.
function cambiarInput(b, accion) {
    const el = $(b.id);
    if (b.esCarga) {
        const actual = parseInt(el.value, 10) || 0;
        el.value = accion === 'devolver' ? String(masccCarga.max) : String(actual === 5 ? 3 : 0);
    } else {
        el.checked = accion === 'devolver';
    }
    el.dispatchEvent(new Event('change', { bubbles: true }));
}

function lineaFuente(b) {
    const el = $(b.id);
    return b.esCarga ? el.closest('.form-group') : el.closest('label');
}

function construir(cont) {
    const botones = BLOQUES.map(b => `
        <button type="button" class="mascc-bloque" data-id="${b.id}" data-tipo="solido"></button>
        <button type="button" class="mascc-bloque mascc-hueco" data-id="${b.id}" data-tipo="hueco"></button>`).join('');
    cont.innerHTML = `
        <p class="mascc-esc-guia">Altura = puntos. Toca un bloque para quitárselo al paciente; toca el hueco para devolverlo.</p>
        <div class="mascc-esc">
            <div class="mascc-esc-pila" style="height:${MASCC_MAX * U}px">
                ${botones}
                <div class="mascc-esc-corte" style="bottom:${MASCC_CORTE * U}px"><span>${MASCC_CORTE}</span></div>
                <div class="mascc-esc-invalidado" hidden>
                    <strong>Invalidado</strong>
                    <span>Hay una red flag en el triaje: alto riesgo automático, el MASCC no se calcula.</span>
                    <button type="button" class="mascc-esc-link" data-accion="triaje">Ver el triaje ↑</button>
                </div>
            </div>
            <div class="mascc-esc-lectura">
                <div class="mascc-esc-total"><b id="mascc-esc-score"></b><small>/ ${MASCC_MAX}</small></div>
                <div class="mascc-esc-estado" id="mascc-esc-estado"></div>
                <div class="mascc-esc-margen" id="mascc-esc-margen"></div>
                <div class="mascc-esc-manejo" id="mascc-esc-manejo"></div>
                <button type="button" class="mascc-esc-reset" data-accion="reset">Devolver todos</button>
            </div>
        </div>
        <div class="mascc-esc-detalle" id="mascc-esc-detalle" hidden></div>`;
}

function render() {
    const cont = $('mascc-escalera');
    if (!cont || !$(masccCarga.id)) return;

    // Sólidos abajo, en orden de la tabla; huecos encima de todo.
    let fondo = 0;
    const colocar = (btn, alto) => {
        btn.hidden = alto === 0;
        btn.style.bottom = `${fondo * U}px`;
        btn.style.height = `${alto * U - 3}px`;
        fondo += alto;
    };
    const estados = BLOQUES.map(b => ({ b, pts: ptsActuales(b) }));
    estados.forEach(({ b, pts }) => {
        const btn = cont.querySelector(`.mascc-bloque[data-id="${b.id}"][data-tipo="solido"]`);
        const et = etiquetas(b, pts);
        btn.innerHTML = `<span>${et.solido}</span><b>+${pts}</b>`;
        btn.setAttribute('aria-label', `${et.solido}, ${pts} puntos. Quitar.`);
        btn.classList.toggle('sel', sel === b.id);
        colocar(btn, pts);
    });
    estados.forEach(({ b, pts }) => {
        const btn = cont.querySelector(`.mascc-bloque[data-id="${b.id}"][data-tipo="hueco"]`);
        const perdido = b.max - pts;
        const et = etiquetas(b, pts);
        btn.innerHTML = `<span>${et.hueco}</span><b>−${perdido}</b>`;
        btn.setAttribute('aria-label', `${et.hueco}, ${perdido} puntos perdidos. Devolver.`);
        btn.classList.toggle('sel', sel === b.id);
        colocar(btn, perdido);
    });

    const score = puntuacionMascc();
    const invalidado = hayRedFlags();
    const bajo = score >= MASCC_CORTE;
    const card = $('mascc-card');
    card.classList.toggle('mascc-invalidado', invalidado);
    cont.querySelector('.mascc-esc-invalidado').hidden = !invalidado;

    const color = invalidado ? 'var(--text-muted)' : bajo ? 'var(--accent-green)' : 'var(--accent-red)';
    $('mascc-esc-score').textContent = score;
    $('mascc-esc-score').style.color = color;
    const estado = $('mascc-esc-estado');
    estado.textContent = invalidado ? 'Invalidado por red flags' : bajo ? 'Bajo riesgo' : 'Alto riesgo';
    estado.style.color = invalidado ? 'var(--accent-red)' : color;
    $('mascc-esc-margen').textContent = invalidado ? ''
        : bajo ? `Margen: ${score - MASCC_CORTE} punto${score - MASCC_CORTE === 1 ? '' : 's'} antes de cruzar la línea.`
        : `Faltan ${MASCC_CORTE - score} para bajo riesgo.`;
    $('mascc-esc-manejo').textContent = invalidado ? 'Ingreso + antibiótico iv.'
        : bajo ? 'Candidato a antibiótico oral y manejo ambulatorio. Control 48-72 h.'
        : 'Ingreso + antibiótico iv. Hemocultivos inmediatos.';

    renderDetalle();
}

function renderDetalle() {
    const caja = $('mascc-esc-detalle');
    const b = BLOQUES.find(x => x.id === sel);
    if (!b) { caja.hidden = true; return; }
    const pts = ptsActuales(b);
    const fuente = b.esCarga
        ? `${masccCarga.etiqueta}: ${masccCarga.opciones.map(o => `${o.texto} (${o.pts})`).join(' · ')}`
        : `${b.item.texto} (${b.item.pts} pts)`;
    const situacion = pts === b.max ? `presente, suma ${pts}`
        : pts === 0 ? `ausente, pierde ${b.max}` : `suma ${pts} de ${b.max}`;
    caja.hidden = false;
    caja.innerHTML = `
        <div class="mascc-esc-detalle-titulo">${etiquetas(b, pts).solido} · ${situacion}</div>
        <div class="mascc-esc-detalle-fuente">Texto original: «${fuente}»</div>
        <button type="button" class="mascc-esc-link" data-accion="fuente">Ver en el texto ↓</button>`;
}

export function initEscaleraMascc() {
    const cont = $('mascc-escalera');
    if (!cont) return;
    construir(cont);

    cont.addEventListener('click', e => {
        const bloque = e.target.closest('.mascc-bloque');
        if (bloque) {
            const b = BLOQUES.find(x => x.id === bloque.dataset.id);
            sel = b.id;
            cambiarInput(b, bloque.dataset.tipo === 'hueco' ? 'devolver' : 'quitar');
            return; // el `change` disparado repinta
        }
        const accion = e.target.closest('[data-accion]')?.dataset.accion;
        const card = $('mascc-card');
        if (accion === 'reset') {
            BLOQUES.forEach(b => cambiarInput(b, 'devolver'));
        } else if (accion === 'fuente') {
            const b = BLOQUES.find(x => x.id === sel);
            if (b) irAlTexto(card, lineaFuente(b));
        } else if (accion === 'triaje') {
            resaltar($('triaje-card'));
        }
    });

    // Repinta ante cualquier cambio de MASCC o del triaje (red flags), venga
    // de la vista Texto, de esta escalera o del botón de reinicio.
    document.addEventListener('change', e => {
        if (e.target.matches?.('.mascc-input, .triage-input')) render();
    });
    render();
}
