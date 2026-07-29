// Módulo "CAR-T y complicaciones que llevan a UCI": indicaciones, infusión,
// matriz interactiva de grados de SLC/CRS y de neurotoxicidad (ICANS) con
// calculadora de puntuación ICE.
import { initTabs } from '../../core/tabs.js';
import {
    productosCarT,
    criteriosSeleccionCarT,
    slcMonitorizacionData,
    slcRefractarioData,
    icansMonitorizacionData,
    icansRefractarioData,
    icansAlertasRevaluacion,
    iceScoreItems
} from '../../data/car-t-data.js';

const GRADOS = [1, 2, 3, 4];

function renderProductos() {
    const cont = document.getElementById('cart-productos-lista');
    cont.innerHTML = productosCarT.map(p => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.nextElementSibling.classList.toggle('active')">
                <span>💊 ${p.nombre}</span> <span>+</span>
            </div>
            <div class="micro-prof-body">${p.indicacion}</div>
        </div>
    `).join('');
}

function renderCriterios() {
    document.getElementById('cart-inclusion-lista').innerHTML =
        criteriosSeleccionCarT.inclusionComunes.map(c => `<li>${c}</li>`).join('');
    document.getElementById('cart-exclusion-lista').innerHTML =
        criteriosSeleccionCarT.exclusion.map(c => `<li>${c}</li>`).join('');
}

// Construye la matriz grado 1-4: cabecera clicable (resalta columna) + filas
// de signos/criterios + filas de tratamiento de primera y segunda línea.
function renderGradeMatrix(tableId, data, filas) {
    const tabla = document.getElementById(tableId);
    const head = tabla.querySelector('thead tr');
    head.innerHTML = '<th></th>' + GRADOS.map(g =>
        `<th class="grade-matrix-head g${g}" data-grado="${g}">Grado ${g}</th>`
    ).join('');

    const body = tabla.querySelector('tbody');
    const filasSignos = filas.map(f => `
        <tr><th>${f.label}</th>${GRADOS.map(g => `<td data-grado="${g}">${data[g].signos[f.key]}</td>`).join('')}</tr>
    `).join('');
    const filaPrimera = `
        <tr class="grade-matrix-tto"><th>1ª línea</th>${GRADOS.map(g => `<td data-grado="${g}">${data[g].primeraLinea}</td>`).join('')}</tr>
    `;
    const filaSegunda = `
        <tr class="grade-matrix-tto"><th>2ª línea</th>${GRADOS.map(g => `<td data-grado="${g}">${data[g].segundaLinea}</td>`).join('')}</tr>
    `;
    body.innerHTML = filasSignos + filaPrimera + filaSegunda;

    tabla.querySelectorAll('.grade-matrix-head').forEach(th => {
        th.addEventListener('click', () => highlightGrade(tableId, th.dataset.grado));
    });
}

function highlightGrade(tableId, grado) {
    const tabla = document.getElementById(tableId);
    tabla.classList.remove('hl-1', 'hl-2', 'hl-3', 'hl-4');
    tabla.querySelectorAll('.grade-matrix-head').forEach(h => h.classList.remove('selected'));
    if (!grado) return;
    tabla.classList.add('hl-' + grado);
    const th = tabla.querySelector(`.grade-matrix-head[data-grado="${grado}"]`);
    if (th) th.classList.add('selected');
}

function renderIceChecklist() {
    let grupoActual = '';
    document.getElementById('cart-ice-lista').innerHTML = iceScoreItems.map(item => {
        const encabezado = item.grupo !== grupoActual
            ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin: 8px 0 2px 0;">${item.grupo}</div>`
            : '';
        grupoActual = item.grupo;
        return `${encabezado}<label class="checkbox-label"><input type="checkbox" class="cart-ice-check"> ${item.label}</label>`;
    }).join('');
}

function calcIce() {
    const checks = document.querySelectorAll('.cart-ice-check');
    const puntuacion = Array.from(checks).filter(c => c.checked).length;
    const box = document.getElementById('cart-ice-resultado');
    let interpretacion;
    let gradoSugerido = null;
    if (puntuacion === 10) {
        interpretacion = 'Sin alteración cognitiva — no cumple criterios de ICANS por puntuación (grado 0).';
    } else if (puntuacion >= 7) {
        interpretacion = 'Compatible con ICANS grado 1, si el paciente está despierto espontáneamente.';
        gradoSugerido = 1;
    } else if (puntuacion >= 3) {
        interpretacion = 'Compatible con ICANS grado 2, si el paciente despierta tras estímulo auditivo.';
        gradoSugerido = 2;
    } else {
        interpretacion = 'ICE 0-2: compatible con grado 3 si el paciente despierta solo a estímulo táctil, o grado 4 si no despierta ni a estímulos táctiles repetidos — la puntuación por sí sola no distingue grado 3 de grado 4, lo hace el nivel de conciencia. Selecciona la columna correspondiente en la tabla.';
    }
    box.innerHTML = `Puntuación ICE: <strong>${puntuacion}/10</strong><br>${interpretacion}`;
    highlightGrade('cart-icans-matriz', gradoSugerido);
}

export function init() {
    initTabs(document.getElementById('panel-cart-tabs'));
    renderProductos();
    renderCriterios();

    renderGradeMatrix('cart-slc-matriz', slcMonitorizacionData, [
        { label: 'Temperatura', key: 'temperatura' },
        { label: 'TA sistólica', key: 'tas' },
        { label: 'Necesidad de O₂', key: 'o2' }
    ]);
    document.getElementById('cart-slc-refractario-criterio').innerHTML = slcRefractarioData.criterio;
    document.getElementById('cart-slc-refractario-tratamiento').innerHTML = slcRefractarioData.tratamiento;

    renderGradeMatrix('cart-icans-matriz', icansMonitorizacionData, [
        { label: 'Puntuación ICE', key: 'ice' },
        { label: 'Nivel de conciencia', key: 'conciencia' },
        { label: 'Crisis comicial', key: 'crisis' },
        { label: 'Debilidad muscular', key: 'debilidad' },
        { label: 'HIC / edema cerebral', key: 'hic' }
    ]);
    document.getElementById('cart-icans-refractario-criterio').innerHTML = icansRefractarioData.criterio;
    document.getElementById('cart-icans-refractario-tratamiento').innerHTML = icansRefractarioData.tratamiento;
    document.getElementById('cart-icans-alertas-lista').innerHTML =
        icansAlertasRevaluacion.map(a => `<li>${a}</li>`).join('');

    renderIceChecklist();
    document.querySelectorAll('.cart-ice-check').forEach(c => c.addEventListener('change', calcIce));
    calcIce();
}
