// Vista Visual del manejo del catéter: una balanza retirar / conservar.
// Platillo izquierdo: los criterios de retirada; derecho: la única condición
// para conservar (mal acceso periférico) y su obligación (sellado). Los
// criterios y el mal acceso son las casillas REALES de la calculadora de
// catéter del tratamiento dirigido (se leen sus etiquetas y se escriben sus
// casillas); la inclinación la decide decisionCVC(), la misma función de
// calcCVC(). Así la balanza nunca puede contradecir a la calculadora.
//
// Se monta en cada `.cateter-balanza` de la app (la tarjeta 4 de la vista
// principal y la calculadora del tratamiento dirigido). Cada contenedor
// indica con data-fuente-retirar / data-fuente-conservar a qué parte del
// texto lleva su "Ver en el texto".

import { decisionCVC } from './cateter-mdr.js';
import { irAlTexto } from '../../core/vista-visual.js';

const $ = id => document.getElementById(id);
const riesgos = () => [...document.querySelectorAll('.cvc-risk')];
const contenedores = () => [...document.querySelectorAll('.cateter-balanza')];

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
            <div class="balanza-brazo">
                <div class="balanza-plato izq">Retirar</div>
                <div class="balanza-plato der">Conservar</div>
            </div>
            <div class="balanza-pie" aria-hidden="true"></div>
        </div>
        <div class="balanza-columnas">
            <div class="balanza-col retirar">
                <b>Retirada obligatoria si</b>
                <div class="balanza-chips">${chips}</div>
                <button type="button" class="visual-link" data-fuente="${cont.dataset.fuenteRetirar}">Ver en el texto ↓</button>
            </div>
            <div class="balanza-col conservar">
                <b>Conservar solo si</b>
                <button type="button" class="balanza-chip" data-acceso>${etiqueta($('cvc-poor-access'))}</button>
                <p>e infección no complicada por germen poco virulento.</p>
                <p class="balanza-obligatorio">Obligatorio: sellado antibiótico + tratamiento sistémico.</p>
                <button type="button" class="visual-link" data-fuente="${cont.dataset.fuenteConservar}">Ver en el texto ↓</button>
            </div>
        </div>
        <div class="visual-veredicto" data-veredicto></div>`;
}

const INCLINACION = { retirar: -9, conservar: 9, valorar: 0 };

function render(cont) {
    riesgos().forEach((r, i) => {
        const b = cont.querySelector(`[data-riesgo="${i}"]`);
        b.classList.toggle('on', r.checked);
        b.setAttribute('aria-pressed', String(r.checked));
    });
    const acceso = $('cvc-poor-access').checked;
    const ba = cont.querySelector('[data-acceso]');
    ba.classList.toggle('on', acceso);
    ba.setAttribute('aria-pressed', String(acceso));

    cont.querySelector('.balanza-brazo').style.transform = `rotate(${INCLINACION[decisionCVC()]}deg)`;
    const v = cont.querySelector('[data-veredicto]');
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
    contenedores().forEach(cont => {
        construir(cont);
        cont.addEventListener('click', e => {
            const r = e.target.closest('[data-riesgo]');
            if (r) { alternar(riesgos()[Number(r.dataset.riesgo)]); return; }
            if (e.target.closest('[data-acceso]')) { alternar($('cvc-poor-access')); return; }
            const f = e.target.closest('[data-fuente]');
            if (f) irAlTexto(cont.closest('[data-visual]'), $(f.dataset.fuente));
        });
        render(cont);
    });
    document.addEventListener('change', e => {
        if (e.target.matches?.('.cvc-risk, #cvc-poor-access')) contenedores().forEach(render);
    });
}
