import { microorganismosData, microorganismosOrden } from '../../data/microorganismos-data.js';

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

        <div class="card">
            <h3>Epidemiología</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.epidemiologia}</p>
        </div>

        <div class="card" style="border-top: 1px solid var(--accent-purple);">
            <h3 style="color: var(--accent-purple); text-shadow: var(--glow-purple);">Mecanismo de resistencia</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.mecanismo}</p>
            ${m.mecanismoSvg || ''}
        </div>

        <div class="card" style="border-top: 1px solid var(--accent-blue);">
            <h3 style="color: var(--accent-blue); text-shadow: var(--glow-blue);">Clínica</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.clinica}</p>
        </div>

        <div class="card">
            <h3>Diagnóstico</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.diagnostico}</p>
        </div>

        <div class="card" style="border-top: 1px solid var(--accent-green);">
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

        <div class="card" style="border-top: 1px solid var(--accent-yellow);">
            <h3 style="color: var(--accent-yellow);">Profilaxis</h3>
            <p style="font-size: 0.85rem; line-height: 1.5;">${m.profilaxis}</p>
        </div>
    `;
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
