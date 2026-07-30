// Módulo "Coagulación Intravascular Diseminada (CID)": definición 2025,
// calculadoras interactivas de Overt DIC 2025 y SIC, terminología y
// esquemas de progresión/tratamiento por fenotipo.
import {
    cidOvertDicItems,
    cidSicItems,
    cidTerminologia,
    cidEtiologias,
    cidPredominioAnchos,
    cidTratamientoFenotipo,
    cidCausas,
    cidHallazgosLaboratorio,
    cidSvgFenotipos,
    cidSvgAlgoritmo
} from '../../data/sindromes-urgentes-data.js';

const OVERT_DIC_MAX = 8;
const SIC_MAX = 6;

function buscarPuntos(valor, tramos) {
    const tramo = tramos.find(t => valor >= t.min && valor <= t.max);
    return tramo ? tramo.puntos : 0;
}

function actualizarGauge(prefijo, total, max, cumple) {
    const fill = document.getElementById(`${prefijo}-gauge-fill`);
    const num = document.getElementById(`${prefijo}-gauge-num`);
    if (!fill || !num) return;
    fill.style.width = `${Math.min(100, (total / max) * 100)}%`;
    fill.style.background = cumple ? 'var(--accent-red)' : 'var(--accent-green)';
    fill.style.boxShadow = cumple ? 'var(--glow-red)' : 'var(--glow-green)';
    num.textContent = `${total}/${max}`;
}

function calcOvertDic() {
    const plqEl = document.getElementById('cid-overt-plaquetas');
    const ddEl = document.getElementById('cid-overt-dimero');
    const ptEl = document.getElementById('cid-overt-pt');
    const fibEl = document.getElementById('cid-overt-fibrinogeno');
    const box = document.getElementById('cid-overt-resultado');

    if (plqEl.value === '' || ptEl.value === '' || fibEl.value === '') {
        box.innerHTML = 'Introduce plaquetas, prolongación de TP y fibrinógeno para calcular.';
        box.style.color = '';
        actualizarGauge('cid-overt', 0, OVERT_DIC_MAX, false);
        document.getElementById('cid-overt-gauge-num').textContent = '—';
        return;
    }

    const plaquetas = parseFloat(plqEl.value);
    const pt = parseFloat(ptEl.value);
    const fibrinogeno = parseFloat(fibEl.value);

    const pPlq = buscarPuntos(plaquetas, cidOvertDicItems.plaquetas);
    const pPt = buscarPuntos(pt, cidOvertDicItems.ptProlongado);
    const pFib = fibrinogeno < 100 ? 1 : 0;
    const pDd = cidOvertDicItems.dimeroD.find(d => d.value === ddEl.value).puntos;

    const total = pPlq + pPt + pFib + pDd;
    const cumple = total >= cidOvertDicItems.corte;

    box.innerHTML = `
        <div style="font-size: 1.7rem; font-weight: bold;">${total} puntos</div>
        <div style="margin-top: 6px; font-size: 0.85rem;">${cumple ? '✅ Compatible con CID franca (Overt DIC 2025)' : '⏳ No alcanza el corte de CID franca (≥5)'}</div>
    `;
    box.style.color = cumple ? 'var(--accent-red)' : 'var(--accent-green)';
    actualizarGauge('cid-overt', total, OVERT_DIC_MAX, cumple);
}

function calcSic() {
    const plqEl = document.getElementById('cid-sic-plaquetas');
    const inrEl = document.getElementById('cid-sic-inr');
    const sofaEls = ['resp', 'cv', 'hep', 'renal'].map(k => document.getElementById(`cid-sic-sofa-${k}`));
    const box = document.getElementById('cid-sic-resultado');

    if (plqEl.value === '' || inrEl.value === '') {
        box.innerHTML = 'Introduce plaquetas e INR para calcular.';
        box.style.color = '';
        actualizarGauge('cid-sic', 0, SIC_MAX, false);
        document.getElementById('cid-sic-gauge-num').textContent = '—';
        return;
    }

    const plaquetas = parseFloat(plqEl.value);
    const inr = parseFloat(inrEl.value);
    const sofaSuma = sofaEls.reduce((acc, el) => acc + parseInt(el.value, 10), 0);

    const pPlq = buscarPuntos(plaquetas, cidSicItems.plaquetas);
    const pInr = buscarPuntos(inr, cidSicItems.inr);
    const pSofa = sofaSuma === 0 ? 0 : (sofaSuma === 1 ? 1 : 2);

    const total = pPlq + pInr + pSofa;
    const hemostasia = pPlq + pInr;
    const cumple = total >= cidSicItems.corte && hemostasia > cidSicItems.corteHemostasia;

    box.innerHTML = `
        <div style="font-size: 1.7rem; font-weight: bold;">${total} puntos</div>
        <div style="margin-top: 6px; font-size: 0.85rem;">${cumple ? '✅ Compatible con SIC (Sepsis-Induced Coagulopathy)' : '⏳ No cumple criterios de SIC'}</div>
        <div style="margin-top: 4px; font-size: 0.7rem; color: var(--text-muted);">Subscore hemostático (plaquetas + INR): ${hemostasia} ${hemostasia > cidSicItems.corteHemostasia ? '(> 2, cumple)' : '(debe ser > 2)'}</div>
    `;
    box.style.color = cumple ? 'var(--accent-red)' : 'var(--accent-green)';
    actualizarGauge('cid-sic', total, SIC_MAX, cumple);
}

function renderTerminologia() {
    const cont = document.getElementById('cid-terminologia-lista');
    if (!cont) return;
    cont.innerHTML = cidTerminologia.map(t => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.nextElementSibling.classList.toggle('active')">
                <span>${t.termino}</span> <span>+</span>
            </div>
            <div class="micro-prof-body">
                ${t.definicion}
                ${t.sinonimos ? `<br><br><strong style="color: var(--accent-blue);">Sinónimos:</strong> ${t.sinonimos}` : ''}
            </div>
        </div>
    `).join('');
}

function renderEtiologias() {
    const cont = document.getElementById('cid-etiologias-lista');
    if (!cont) return;
    cont.innerHTML = cidEtiologias.map(e => {
        const anchos = cidPredominioAnchos[e.predominio];
        return `
        <div class="phenotype-row">
            <div class="phenotype-label"><strong>${e.sigla} — ${e.nombre}</strong></div>
            <div class="phenotype-bar">
                <div class="phenotype-bar-tromb" style="width: ${anchos.trombotico}%;"></div>
                <div class="phenotype-bar-hemo" style="width: ${anchos.hemorragico}%;"></div>
            </div>
        </div>
    `;
    }).join('');
}

function renderTratamientoFenotipo() {
    const cont = document.getElementById('cid-tto-fenotipo');
    if (!cont) return;
    const t = cidTratamientoFenotipo.trombotica;
    const h = cidTratamientoFenotipo.hemorragica;
    cont.innerHTML = `
        <div class="compare-row">
            <div class="compare-box blue">
                <strong style="color: var(--accent-blue);">${t.titulo}</strong><br><br>
                <span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Fase precoz</span>
                <ul style="margin: 4px 0 8px 16px;">${t.precoz.map(x => `<li>${x}</li>`).join('')}</ul>
                <span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Fase tardía</span>
                <ul style="margin: 4px 0 0 16px;">${t.tardia.map(x => `<li>${x}</li>`).join('')}</ul>
            </div>
            <div class="compare-box red">
                <strong style="color: var(--accent-red);">${h.titulo}</strong><br><br>
                <span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Fase precoz</span>
                <ul style="margin: 4px 0 8px 16px;">${h.precoz.map(x => `<li>${x}</li>`).join('')}</ul>
                <span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Fase tardía</span>
                <ul style="margin: 4px 0 0 16px;">${h.tardia.map(x => `<li>${x}</li>`).join('')}</ul>
            </div>
        </div>
        <p style="font-size: 0.78rem; line-height: 1.5; margin-top: 8px;">${cidTratamientoFenotipo.nota}</p>
    `;
}

function renderCausas() {
    const cont = document.getElementById('cid-causas-lista');
    if (!cont) return;
    cont.innerHTML = cidCausas.map(c => `
        <li><strong>${c.categoria}</strong>${c.items.length ? ': ' + c.items.join(', ') : ''}</li>
    `).join('');
}

function renderAlgoritmo() {
    const cont = document.getElementById('cid-algoritmo-lista');
    if (!cont) return;
    cont.innerHTML = cidSvgAlgoritmo;
}

function renderFenotiposSvg() {
    const cont = document.getElementById('cid-fenotipos-svg');
    if (!cont) return;
    cont.innerHTML = cidSvgFenotipos;
}

function renderLaboratorio() {
    const cont = document.getElementById('cid-laboratorio-lista');
    if (!cont) return;
    cont.innerHTML = cidHallazgosLaboratorio.map(h => `
        <div class="micro-prof-item">
            <div class="micro-prof-head" onclick="this.nextElementSibling.classList.toggle('active')">
                <span>${h.titulo}</span> <span>+</span>
            </div>
            <div class="micro-prof-body">${h.texto}</div>
        </div>
    `).join('');
}

export function init() {
    renderTerminologia();
    renderEtiologias();
    renderTratamientoFenotipo();
    renderCausas();
    renderAlgoritmo();
    renderLaboratorio();
    renderFenotiposSvg();

    document.querySelectorAll('.cid-overt-input').forEach(el => el.addEventListener('input', calcOvertDic));
    document.getElementById('cid-overt-dimero').addEventListener('change', calcOvertDic);
    calcOvertDic();

    document.querySelectorAll('.cid-sic-input').forEach(el => el.addEventListener('input', calcSic));
    document.querySelectorAll('.cid-sic-sofa').forEach(el => el.addEventListener('change', calcSic));
    calcSic();
}
