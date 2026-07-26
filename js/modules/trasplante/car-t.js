// Módulo "CAR-T y complicaciones que llevan a UCI": indicaciones, infusión,
// selector de grado de SLC/CRS y selector de grado de neurotoxicidad (ICANS).
import { initTabs } from '../../core/tabs.js';
import {
    productosCarT,
    criteriosSeleccionCarT,
    slcGradosData,
    icansGradosData
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

export function init() {
    initTabs(document.getElementById('panel-cart-tabs'));
    renderProductos();
    renderCriterios();

    document.getElementById('cart-slc-select').addEventListener('change', calcSlc);
    calcSlc();

    document.getElementById('cart-icans-select').addEventListener('change', calcIcans);
    calcIcans();
}
