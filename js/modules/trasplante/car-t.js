// Módulo "CAR-T y complicaciones que llevan a UCI": indicaciones, infusión,
// selector de grado de SLC/CRS y selector de grado de neurotoxicidad (ICANS).
import { initTabs } from '../../core/tabs.js';
import {
    productosCarT,
    criteriosSeleccionCarT,
    slcGradosData,
    icansGradosData,
    iceScoreItems,
    slcGradingMatrixData,
    icansGradingMatrixData
} from '../../data/car-t-data.js';

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

function renderMatrizTabla(elementId, matrizData) {
    const tabla = document.getElementById(elementId);
    matrizData.forEach(fila => {
        tabla.innerHTML += `<tr><td>${fila.signo}</td><td>${fila.g1}</td><td>${fila.g2}</td><td>${fila.g3}</td><td>${fila.g4}</td></tr>`;
    });
}

function calcIce() {
    const checks = document.querySelectorAll('.cart-ice-check');
    const puntuacion = Array.from(checks).filter(c => c.checked).length;
    const box = document.getElementById('cart-ice-resultado');
    let interpretacion;
    if (puntuacion === 10) {
        interpretacion = 'Sin alteración cognitiva — no cumple criterios de ICANS por puntuación (grado 0).';
    } else if (puntuacion >= 7) {
        interpretacion = 'Compatible con ICANS grado 1 (ICE 7-9), si el paciente está despierto espontáneamente.';
    } else if (puntuacion >= 3) {
        interpretacion = 'Compatible con ICANS grado 2 (ICE 3-6), si el paciente despierta tras estímulo auditivo.';
    } else {
        interpretacion = 'ICE 0-2: compatible con ICANS grado 3 si el paciente despierta solo a estímulo táctil, o grado 4 si no despierta ni a estímulos táctiles repetidos — la puntuación por sí sola no distingue grado 3 de grado 4, lo hace el nivel de conciencia.';
    }
    box.innerHTML = `Puntuación ICE: <strong>${puntuacion}/10</strong><br>${interpretacion}`;
}

function calcSlc() {
    const select = document.getElementById('cart-slc-select');
    const data = slcGradosData[select.value];
    if (!data) return;
    document.getElementById('cart-slc-titulo').innerText = data.titulo;
    document.getElementById('cart-slc-criterio').innerHTML = data.criterio;
    document.getElementById('cart-slc-tratamiento').innerHTML = data.tratamiento;
}

function calcIcans() {
    const select = document.getElementById('cart-icans-select');
    const data = icansGradosData[select.value];
    if (!data) return;
    document.getElementById('cart-icans-titulo').innerText = data.titulo;
    document.getElementById('cart-icans-criterio').innerHTML = data.criterio;
    document.getElementById('cart-icans-tratamiento').innerHTML = data.tratamiento;
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

export function init() {
    initTabs(document.getElementById('panel-cart-tabs'));
    renderProductos();
    renderCriterios();

    document.getElementById('cart-slc-select').addEventListener('change', calcSlc);
    calcSlc();
    renderMatrizTabla('cart-slc-matriz-tabla', slcGradingMatrixData);

    document.getElementById('cart-icans-select').addEventListener('change', calcIcans);
    calcIcans();
    renderMatrizTabla('cart-icans-matriz-tabla', icansGradingMatrixData);

    renderIceChecklist();
    document.querySelectorAll('.cart-ice-check').forEach(c => c.addEventListener('change', calcIce));
    calcIce();
}
