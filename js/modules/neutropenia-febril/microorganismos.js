import { microorganismosData, microorganismosOrden } from '../../data/microorganismos-data.js';
import { initVistaVisual, irAlTexto } from '../../core/vista-visual.js';

// Secciones de la ficha: id de su tarjeta en la vista Texto, título y color.
// La vista Visual las encadena y cada nodo lleva a su tarjeta.
const SECCIONES = [
    { clave: 'epidemiologia', id: 'micro-sec-epi', titulo: 'Epidemiología', color: 'var(--text-muted)' },
    { clave: 'mecanismo', id: 'micro-sec-mec', titulo: 'Mecanismo de resistencia', color: 'var(--accent-purple)' },
    { clave: 'clinica', id: 'micro-sec-cli', titulo: 'Clínica', color: 'var(--accent-blue)' },
    { clave: 'diagnostico', id: 'micro-sec-dx', titulo: 'Diagnóstico', color: 'var(--text-muted)' }
];

// Primera frase del texto de la fuente, como pista del nodo (el texto
// completo se ve al tocarlo).
function primeraFrase(html) {
    const t = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    // Corte en un punto seguido de mayúscula: así no corta en "S. aureus" ni
    // en "C. albicans".
    const m = /^(.{25,}?\.)\s+(?=[A-ZÁÉÍÓÚÑ¿(])/.exec(t);
    const f = m ? m[1] : t;
    return f.length > 120 ? f.slice(0, 118) + '…' : f;
}

function renderVisual(m) {
    const cadena = SECCIONES.map(sec => `
        <button type="button" class="micro-eslabon" data-sec="${sec.clave}" style="--vk:${sec.color}">
            <b>${sec.titulo}</b><span>${primeraFrase(m[sec.clave])}</span>
        </button>`).join('<div class="vk-flecha" aria-hidden="true">↓</div>');
    const chips = (lista, clase) => lista.map(x => `<li class="${clase}">${x}</li>`).join('');
    return `
        <p class="visual-guia">De dónde viene y cómo resiste, cómo se presenta y cómo se confirma; abajo, qué fármacos sí y cuáles no. Toca un eslabón para leerlo entero.</p>
        <div class="micro-cadena">${cadena}</div>
        <div class="visual-detalle" data-micro-detalle hidden></div>
        ${m.mecanismoSvg ? `<div class="micro-visual-svg">${m.mecanismoSvg}</div>` : ''}
        <div class="micro-semaforo">
            <div class="micro-semaforo-col si"><b>✅ Indicados</b><ul>${chips(m.farmacosSi, 'si')}</ul></div>
            <div class="micro-semaforo-col no"><b>❌ Evitar</b><ul>${chips(m.farmacosNo, 'no')}</ul></div>
        </div>
        <button type="button" class="micro-eslabon profilaxis" data-sec="profilaxis" style="--vk:var(--accent-yellow)"><b>Profilaxis</b><span>${primeraFrase(m.profilaxis)}</span></button>
        <div class="visual-detalle" data-micro-detalle-prof hidden></div>
        <button type="button" class="visual-link" data-ir="micro-sec-tto">Ver el tratamiento en el texto ↓</button>`;
}

function renderTabsGrid() {
    const grid = document.getElementById('micro-tabs-grid');
    grid.innerHTML = microorganismosOrden.map(id => {
        const m = microorganismosData[id];
        return `<button class="micro-tab-btn" data-micro="${id}">
            <span class="micro-tab-emoji">${m.emoji}</span>
            <span class="micro-tab-name">${m.nombre}</span>
            <span class="micro-tab-tag">${m.tag}</span>
        </button>`;
    }).join('');
}

function renderDrugList(items, cssClass) {
    return `<ul class="micro-drug-list ${cssClass}">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

function renderDetail(id) {
    const m = microorganismosData[id];
    const content = document.getElementById('micro-detail-content');
    content.innerHTML = `
        <div class="card" style="border-top: 1px solid var(--accent-red);">
            <h3 style="color: var(--accent-red); text-shadow: var(--glow-red);">${m.emoji} ${m.nombre}</h3>
            <p class="subtitle">${m.categoria} · ${m.tag}</p>
            ${m.imagen}
        </div>

        <div class="vista-grupo" id="micro-grupo" data-visual>
        <div class="vista-grupo-titulo">Ficha del microorganismo</div>
        <div class="vista-texto">
        <div class="card" id="micro-sec-epi">
            <h3>Epidemiología</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.epidemiologia}</p>
        </div>

        <div class="card" id="micro-sec-mec" style="border-top: 1px solid var(--accent-purple);">
            <h3 style="color: var(--accent-purple); text-shadow: var(--glow-purple);">Mecanismo de resistencia</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.mecanismo}</p>
            ${m.mecanismoSvg || ''}
        </div>

        <div class="card" id="micro-sec-cli" style="border-top: 1px solid var(--accent-blue);">
            <h3 style="color: var(--accent-blue); text-shadow: var(--glow-blue);">Clínica</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.clinica}</p>
        </div>

        <div class="card" id="micro-sec-dx">
            <h3>Diagnóstico</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.diagnostico}</p>
        </div>

        <div class="card" id="micro-sec-tto" style="border-top: 1px solid var(--accent-green);">
            <h3 style="color: var(--accent-green);">Tratamiento</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.tratamiento}</p>
            <div class="micro-drug-cols">
                <div>
                    <div class="micro-drug-heading si">✅ Fármacos indicados</div>
                    ${renderDrugList(m.farmacosSi, 'si')}
                </div>
                <div>
                    <div class="micro-drug-heading no">❌ Evitar / contraindicados</div>
                    ${renderDrugList(m.farmacosNo, 'no')}
                </div>
            </div>
        </div>

        <div class="card" id="micro-sec-prof" style="border-top: 1px solid var(--accent-yellow);">
            <h3 style="color: var(--accent-yellow);">Profilaxis</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.profilaxis}</p>
        </div>
        </div>
        <div class="vista-visual card">${renderVisual(m)}</div>
        </div>
    `;
    initVistaVisual(content);
    const grupo = document.getElementById('micro-grupo');
    grupo.querySelector('.vista-visual').addEventListener('click', e => {
        const ir = e.target.closest('[data-ir]');
        if (ir) { irAlTexto(grupo, document.getElementById(ir.dataset.ir)); return; }
        const eslabon = e.target.closest('[data-sec]');
        if (eslabon) {
            const sec = eslabon.dataset.sec;
            const det = grupo.querySelector(sec === 'profilaxis' ? '[data-micro-detalle-prof]' : '[data-micro-detalle]');
            const info = SECCIONES.find(x => x.clave === sec) || { id: 'micro-sec-prof', titulo: 'Profilaxis' };
            grupo.querySelectorAll('[data-sec]').forEach(b => b.classList.toggle('sel', b === eslabon));
            det.hidden = false;
            det.innerHTML = `<div class="visual-detalle-titulo">${info.titulo}</div>
                <div class="vk-detalle-cuerpo">${m[sec]}</div>
                <button type="button" class="visual-link" data-ir="${info.id}">Ver en el texto ↓</button>`;
        }
    });
}

function showMicro(id) {
    renderDetail(id);
    document.getElementById('micro-view-index').style.display = 'none';
    document.getElementById('micro-view-detail').style.display = 'block';
}

function showIndex() {
    document.getElementById('micro-view-detail').style.display = 'none';
    document.getElementById('micro-view-index').style.display = 'block';
}

export function init() {
    renderTabsGrid();

    document.getElementById('micro-tabs-grid').addEventListener('click', e => {
        const btn = e.target.closest('.micro-tab-btn');
        if (btn) showMicro(btn.getAttribute('data-micro'));
    });

    document.getElementById('btn-volver-micro-index').addEventListener('click', showIndex);
    document.getElementById('btn-volver-micro-index-bottom').addEventListener('click', showIndex);

    const jumpBtn = document.getElementById('btn-jump-microorganismos');
    if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
            document.getElementById('btn-microorganismos').click();
            showIndex();
        });
    }
}
