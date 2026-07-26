// Módulo "Introducción al TPH": selección de donante, ingreso/planta,
// fallo de injerto, productos de terapia celular y criterios de alta.
import { initTabs } from '../../core/tabs.js';
import {
    falloInjertoData,
    causasFalloInjerto,
    manejoFalloInjertoData,
    criteriosDonanteData
} from '../../data/trasplante-data.js';

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
    initTabs(document.getElementById('panel-tph-tabs'));

    document.getElementById('tph-donante-select').addEventListener('change', calcDonante);
    calcDonante();

    document.getElementById('tph-injerto-select').addEventListener('change', calcInjerto);
    calcInjerto();
    renderCausas();

    document.getElementById('tph-manejo-select').addEventListener('change', calcManejo);
    calcManejo();

    document.querySelectorAll('.tph-alta-check').forEach(c => c.addEventListener('change', calcAlta));
    calcAlta();
}
