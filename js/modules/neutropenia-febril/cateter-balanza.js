// Vista Visual de "4. Manejo del catéter": una balanza retirar / conservar.
// Platillo izquierdo: los criterios de retirada; derecho: la única condición
// para conservar (mal acceso periférico) y su obligación (sellado). Los
// criterios y el mal acceso son las casillas REALES de la calculadora de
// catéter del tratamiento dirigido (se leen sus etiquetas y se escriben sus
// casillas); la inclinación la decide decisionCVC(), la misma función de
// calcCVC(). Así la balanza nunca puede contradecir a la calculadora.

import { decisionCVC } from './cateter-mdr.js';
import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const riesgos = () => [...document.querySelectorAll('.cvc-risk')];

function etiqueta(input) {
    const l = input.closest('label').cloneNode(true);
    l.querySelector('input').remove();
    return l.innerHTML.trim();
}

function construir(cont) {
    const chips = riesgos().map((r, i) =>
        `<button type="button" class="balanza-chip" data-riesgo="${i}">${etiqueta(r)}</button>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Un solo criterio de la izquierda inclina la balanza hacia retirar. Solo si no hay ninguno y el acceso periférico es malo, se conserva.</p>
        <div class="balanza">
            <div class="balanza-brazo" id="balanza-brazo">
                <div class="balanza-plato izq">Retirar</div>
                <div class="balanza-plato der">Conservar</div>
            </div>
            <div class="balanza-pie" aria-hidden="true"></div>
        </div>
        <div class="balanza-columnas">
            <div class="balanza-col retirar">
                <b>Retirada obligatoria si</b>
                <div class="balanza-chips">${chips}</div>
                <button type="button" class="visual-link" data-fuente="cat-retirada">Ver en el texto ↓</button>
            </div>
            <div class="balanza-col conservar">
                <b>Conservar solo si</b>
                <button type="button" class="balanza-chip" id="balanza-acceso">${etiqueta($('cvc-poor-access'))}</button>
                <p>e infección no complicada por germen poco virulento.</p>
                <p class="balanza-obligatorio">Obligatorio: sellado antibiótico + tratamiento sistémico.</p>
                <button type="button" class="visual-link" data-fuente="cat-conservar">Ver en el texto ↓</button>
            </div>
        </div>
        <div class="visual-veredicto" id="balanza-veredicto"></div>`;
}

const INCLINACION = { retirar: -9, conservar: 9, valorar: 0 };

function render() {
    const cont = $('cateter-balanza');
    if (!cont) return;
    riesgos().forEach((r, i) => {
        const b = cont.querySelector(`[data-riesgo="${i}"]`);
        b.classList.toggle('on', r.checked);
        b.setAttribute('aria-pressed', String(r.checked));
    });
    const acceso = $('cvc-poor-access').checked;
    $('balanza-acceso').classList.toggle('on', acceso);
    $('balanza-acceso').setAttribute('aria-pressed', String(acceso));

    const decision = decisionCVC();
    $('balanza-brazo').style.transform = `rotate(${INCLINACION[decision]}deg)`;
    const v = $('balanza-veredicto');
    const t = $('cvc-result-text');
    v.style.borderColor = t.style.color;
    v.style.color = t.style.color;
    v.innerHTML = `<strong>${t.textContent}</strong>${$('cvc-result-sub').textContent}`;
}

function alternar(input) {
    input.checked = !input.checked;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

export function initCateterBalanza() {
    const cont = $('cateter-balanza');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const r = e.target.closest('[data-riesgo]');
        if (r) { alternar(riesgos()[Number(r.dataset.riesgo)]); return; }
        if (e.target.closest('#balanza-acceso')) { alternar($('cvc-poor-access')); return; }
        const f = e.target.closest('[data-fuente]');
        if (f) irAlTexto($('cateter-card'), $(f.dataset.fuente));
    });
    document.addEventListener('change', e => {
        if (e.target.matches?.('.cvc-risk, #cvc-poor-access')) render();
    });
    render();
}
