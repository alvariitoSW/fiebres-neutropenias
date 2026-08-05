// Módulo "Complicaciones post-TPH": neutropenia febril, infección de
// catéter, tratamiento antifúngico, infecciones víricas, EICH agudo y
// complicaciones no infecciosas (endoteliales, digestivas, urológicas).
import { initTabs } from '../../core/tabs.js';
import {
    focoInfeccionData,
    germenMultiRData,
    criteriosEortcData,
    tratamientoHongoData,
    cmvEscenarioData,
    otrasInfeccionesViricasData,
    eichAgudoGradoData,
    eichAgudoSegundaLineaData,
    cistitisEtiologiaData,
    complicacionesNoInfecciosasData
} from '../../data/complicaciones-tph-data.js';

function renderAccordionList(elementId, items) {
    document.getElementById(elementId).innerHTML = items.map(i => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('active')">
                <span>${i.titulo}</span> <span class="toggle-icon">+</span>
            </div>
            <div class="micro-prof-body">${i.texto}</div>
        </div>
    `).join('');
}

function calcFoco() {
    const select = document.getElementById('comp-foco-select');
    document.getElementById('comp-foco-texto').innerHTML = focoInfeccionData[select.value] || '';
}

function calcGermen() {
    const select = document.getElementById('comp-germen-select');
    document.getElementById('comp-germen-texto').innerHTML = germenMultiRData[select.value] || '';
}

function calcEortc() {
    const select = document.getElementById('comp-eortc-select');
    document.getElementById('comp-eortc-texto').innerHTML = criteriosEortcData[select.value] || '';
}

function calcHongo() {
    const select = document.getElementById('comp-hongo-select');
    document.getElementById('comp-hongo-texto').innerHTML = tratamientoHongoData[select.value] || '';
}

function calcCmv() {
    const select = document.getElementById('comp-cmv-select');
    document.getElementById('comp-cmv-texto').innerHTML = cmvEscenarioData[select.value] || '';
}

function calcEichGrado() {
    const select = document.getElementById('comp-eich-grado-select');
    document.getElementById('comp-eich-grado-texto').innerHTML = eichAgudoGradoData[select.value] || '';
}

function calcCistitis() {
    const select = document.getElementById('comp-cistitis-select');
    document.getElementById('comp-cistitis-texto').innerHTML = cistitisEtiologiaData[select.value] || '';
}

export function init() {
    initTabs(document.getElementById('panel-tph-comp-tabs'));

    document.getElementById('comp-foco-select').addEventListener('change', calcFoco);
    calcFoco();

    document.getElementById('comp-germen-select').addEventListener('change', calcGermen);
    calcGermen();

    document.getElementById('comp-eortc-select').addEventListener('change', calcEortc);
    calcEortc();

    document.getElementById('comp-hongo-select').addEventListener('change', calcHongo);
    calcHongo();

    document.getElementById('comp-cmv-select').addEventListener('change', calcCmv);
    calcCmv();
    renderAccordionList('comp-otras-viricas-lista', otrasInfeccionesViricasData);

    document.getElementById('comp-eich-grado-select').addEventListener('change', calcEichGrado);
    calcEichGrado();
    renderAccordionList('comp-eich-segunda-lista', eichAgudoSegundaLineaData);

    renderAccordionList('comp-noinfecciosas-lista', complicacionesNoInfecciosasData);
    document.getElementById('comp-cistitis-select').addEventListener('change', calcCistitis);
    calcCistitis();
}
