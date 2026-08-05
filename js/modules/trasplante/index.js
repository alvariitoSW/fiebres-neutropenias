// Módulo "Introducción al TPH": selección de donante, ingreso/planta,
// fallo de injerto, productos de terapia celular y criterios de alta.
import { initCorkboard } from '../../core/corkboard.js';
import {
    falloInjertoData,
    causasFalloInjerto,
    manejoFalloInjertoData,
    criteriosDonanteData,
    intensidadAcondicionamientoData,
    regimenesAcondicionamientoData,
    soporteComunAcondicionamiento,
    irradiacionCorporalTotalData,
    clostridioidesData,
    mucositisGradosData,
    dolorEtiologiaData
} from '../../data/trasplante-data.js';
import { init as initCarT } from './car-t.js';
import { init as initComplicaciones } from './complicaciones.js';

function calcDonante() {
    const select = document.getElementById('tph-donante-select');
    const data = criteriosDonanteData[select.value];
    if (!data) return;
    document.getElementById('tph-donante-titulo').innerText = data.titulo;
    document.getElementById('tph-donante-definicion').innerHTML = data.definicion;
    document.getElementById('tph-donante-jerarquia').innerHTML = data.jerarquia;
}

function calcInjerto() {
    const select = document.getElementById('tph-injerto-select');
    const data = falloInjertoData[select.value];
    if (!data) return;
    document.getElementById('tph-injerto-titulo').innerText = data.titulo;
    document.getElementById('tph-injerto-definicion').innerHTML = data.definicion;
    document.getElementById('tph-injerto-incidencia').innerHTML = data.incidencia;
}

function calcManejo() {
    const select = document.getElementById('tph-manejo-select');
    const data = manejoFalloInjertoData[select.value];
    if (!data) return;
    document.getElementById('tph-manejo-titulo').innerText = data.titulo;
    document.getElementById('tph-manejo-texto').innerHTML = data.manejo;
}

function renderCausas() {
    const lista = document.getElementById('tph-causas-lista');
    lista.innerHTML = causasFalloInjerto.map(c => `<li>${c}</li>`).join('');
}

function renderAcondicionamiento() {
    document.getElementById('tph-intensidad-lista').innerHTML = intensidadAcondicionamientoData.map(i => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('active')">
                <span>⚗️ ${i.nivel}</span> <span class="toggle-icon">+</span>
            </div>
            <div class="micro-prof-body">${i.descripcion}</div>
        </div>
    `).join('');

    const tabla = document.getElementById('tph-regimenes-tabla');
    regimenesAcondicionamientoData.forEach(r => {
        tabla.innerHTML += `<tr><td>${r.diagnostico}</td><td>${r.regimen}</td><td>${r.tipo}</td></tr>`;
    });

    document.getElementById('tph-soporte-lista').innerHTML = soporteComunAcondicionamiento.map(s => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('active')">
                <span>${s.titulo}</span> <span class="toggle-icon">+</span>
            </div>
            <div class="micro-prof-body">${s.texto}</div>
        </div>
    `).join('');

    document.getElementById('tph-ict-indicacion').innerHTML = irradiacionCorporalTotalData.indicacion;
    document.getElementById('tph-ict-dosis').innerHTML = irradiacionCorporalTotalData.dosis;
    document.getElementById('tph-ict-antiemesis').innerHTML = irradiacionCorporalTotalData.antiemesis;
}

function renderClostridioides() {
    document.getElementById('tph-cdiff-factores').innerHTML = clostridioidesData.factoresRiesgo;
    document.getElementById('tph-cdiff-diagnostico').innerHTML = clostridioidesData.diagnostico;
    document.getElementById('tph-cdiff-leve').innerHTML = clostridioidesData.tratamiento.leveMod;
    document.getElementById('tph-cdiff-grave').innerHTML = clostridioidesData.tratamiento.grave;
    document.getElementById('tph-cdiff-complicada').innerHTML = clostridioidesData.tratamiento.complicada;
    document.getElementById('tph-cdiff-recidiva').innerHTML = clostridioidesData.tratamiento.primeraRecidiva;
    document.getElementById('tph-cdiff-aislamiento').innerHTML = clostridioidesData.aislamiento;
}

function calcMucositis() {
    const select = document.getElementById('tph-mucositis-select');
    const data = mucositisGradosData[select.value];
    if (!data) return;
    document.getElementById('tph-mucositis-criterio').innerHTML = data.criterio;
    document.getElementById('tph-mucositis-tratamiento').innerHTML = data.tratamiento;
}

function calcDolor() {
    const select = document.getElementById('tph-dolor-select');
    const texto = dolorEtiologiaData[select.value];
    if (!texto) return;
    document.getElementById('tph-dolor-texto').innerHTML = texto;
}

function calcAlta() {
    const checks = document.querySelectorAll('.tph-alta-check');
    const count = Array.from(checks).filter(c => c.checked).length;
    const box = document.getElementById('tph-alta-resultado');
    if (count === 3) {
        box.innerHTML = '✅ Cumple criterios de alta';
        box.style.color = 'var(--accent-green)';
    } else {
        box.innerHTML = `⏳ Mantener ingreso — cumple ${count}/3 criterios`;
        box.style.color = 'var(--accent-yellow)';
    }
}

export function init() {
    initCorkboard('tph-corkboard', 'panel-tph-tabs');

    document.getElementById('tph-donante-select').addEventListener('change', calcDonante);
    calcDonante();

    renderAcondicionamiento();
    renderClostridioides();

    document.getElementById('tph-injerto-select').addEventListener('change', calcInjerto);
    calcInjerto();
    renderCausas();

    document.getElementById('tph-manejo-select').addEventListener('change', calcManejo);
    calcManejo();

    document.querySelectorAll('.tph-alta-check').forEach(c => c.addEventListener('change', calcAlta));
    calcAlta();

    document.getElementById('tph-mucositis-select').addEventListener('change', calcMucositis);
    calcMucositis();

    document.getElementById('tph-dolor-select').addEventListener('change', calcDolor);
    calcDolor();

    initCarT();
    initComplicaciones();
}
