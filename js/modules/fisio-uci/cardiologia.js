import { initCorkboard } from '../../core/corkboard.js';

// Principio de Fick (Ficha 1: Fisiología cardíaca aplicada) — CaO2, DO2 y,
// si se dan datos venosos, CvO2/VO2/EO2. DO2/VO2 se multiplican x10 para
// convertir el CaO2 (mL/dL) x GC (L/min) a mL/min, igual que la Tabla 12
// del Capítulo 5 (ver Ficha 5, IDO2).
function calcFickTransporte() {
    const ids = ['cardio-fick-hb', 'cardio-fick-sao2', 'cardio-fick-pao2', 'cardio-fick-fc', 'cardio-fick-vs', 'cardio-fick-sc'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('cardio-fick-resultado');
    if (els.some(e => !e) || !box) return;
    if (els.some(e => e.value === '')) { box.style.display = 'none'; return; }

    const [hb, sao2, pao2, fc, vs, sc] = els.map(e => Number(e.value));
    const gc = (fc * vs) / 1000;
    const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * 0.003;
    const do2 = gc * cao2 * 10;
    const ic = gc / sc;
    const do2i = do2 / sc;

    let lineas = [
        `GC = FC × VS = ${gc.toFixed(2)} L/min (IC = ${ic.toFixed(2)} L/min/m²)`,
        `CaO₂ = Hb×1,34×SaO₂ + PaO₂×0,003 = ${cao2.toFixed(1)} mL/dL`,
        `DO₂ = GC × CaO₂ × 10 = ${do2.toFixed(0)} mL/min (DO₂I = ${do2i.toFixed(0)} mL/min/m²)`,
    ];

    let estado = 'ok';
    if (do2i < 450) estado = 'danger';
    else if (do2i < 530) estado = 'warn';

    const svo2El = document.getElementById('cardio-fick-svo2');
    const pvo2El = document.getElementById('cardio-fick-pvo2');
    if (svo2El && pvo2El && svo2El.value !== '' && pvo2El.value !== '') {
        const svo2 = Number(svo2El.value);
        const pvo2 = Number(pvo2El.value);
        const cvo2 = hb * 1.34 * (svo2 / 100) + pvo2 * 0.003;
        const vo2 = gc * (cao2 - cvo2) * 10;
        const eo2 = do2 > 0 ? (vo2 / do2) * 100 : 0;
        lineas.push(`CvO₂ = ${cvo2.toFixed(1)} mL/dL`);
        lineas.push(`VO₂ = GC × (CaO₂ − CvO₂) × 10 = ${vo2.toFixed(0)} mL/min`);
        lineas.push(`EO₂ = VO₂/DO₂ = ${eo2.toFixed(1)}%`);
        if (eo2 > 35 && estado === 'ok') estado = 'warn';
    }

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = lineas.join('<br>') +
        `<br><span style="font-size:0.72rem;opacity:0.85;">Valores normales de referencia (Tabla 3): DO₂I 530-600 mL/min/m², EO₂ 25-35%.</span>`;
}

// Resistencias vasculares (ley de Hagen-Poiseuille), Ficha 1.
function calcResistenciasVasculares() {
    const gcEl = document.getElementById('cardio-rv-gc');
    const pamEl = document.getElementById('cardio-rv-pam');
    const padEl = document.getElementById('cardio-rv-pad');
    const box = document.getElementById('cardio-rv-resultado');
    if (!gcEl || !pamEl || !padEl || !box) return;
    if (gcEl.value === '' || pamEl.value === '' || padEl.value === '') { box.style.display = 'none'; return; }

    const gc = Number(gcEl.value);
    const pam = Number(pamEl.value);
    const pad = Number(padEl.value);
    if (gc === 0) { box.style.display = 'none'; return; }

    const rvs = (pam - pad) / gc;
    let lineas = [`RVS = (PAM − PAD) / GC = ${rvs.toFixed(1)} unidades de Wood (mmHg·min/L) ≈ ${(rvs * 80).toFixed(0)} dyn·s·cm⁻⁵`];

    const pampEl = document.getElementById('cardio-rv-pamp');
    const paiEl = document.getElementById('cardio-rv-pai');
    if (pampEl && paiEl && pampEl.value !== '' && paiEl.value !== '') {
        const pamp = Number(pampEl.value);
        const pai = Number(paiEl.value);
        const rvp = (pamp - pai) / gc;
        lineas.push(`RVP = (PAMP − PAI) / GC = ${rvp.toFixed(2)} unidades de Wood ≈ ${(rvp * 80).toFixed(0)} dyn·s·cm⁻⁵`);
    }

    box.style.display = 'block';
    box.className = 'tfg-estado tfg-estado-ok';
    box.innerHTML = lineas.join('<br>') +
        '<br><span style="font-size:0.72rem;opacity:0.85;">Recuerda: la fuente advierte que RVS/RVP no reflejan fielmente la poscarga real, por el acoplamiento matemático con el propio GC.</span>';
}

// Costo de funcionamiento miocárdico (doble/triple producto, presión de
// perfusión coronaria, índice aporte-consumo), Ficha 2.
function calcCostoFuncionamiento() {
    const fcEl = document.getElementById('cardio-costo-fc');
    const pasEl = document.getElementById('cardio-costo-pas');
    const cunaEl = document.getElementById('cardio-costo-cuna');
    const padEl = document.getElementById('cardio-costo-pad-sist');
    const ladoEl = document.getElementById('cardio-costo-lado');
    const pvcEl = document.getElementById('cardio-costo-pvc');
    const pvcGroup = document.getElementById('cardio-costo-pvc-group');
    const box = document.getElementById('cardio-costo-resultado');
    if (!fcEl || !pasEl || !cunaEl || !padEl || !ladoEl || !pvcEl || !box) return;

    const esDerecho = ladoEl.value === 'der';
    if (pvcGroup) pvcGroup.style.display = esDerecho ? 'block' : 'none';

    if (fcEl.value === '' || pasEl.value === '' || cunaEl.value === '' || padEl.value === '' || (esDerecho && pvcEl.value === '')) {
        box.style.display = 'none';
        return;
    }

    const fc = Number(fcEl.value);
    const pas = Number(pasEl.value);
    const cuna = Number(cunaEl.value);
    const padSist = Number(padEl.value);
    const referencia = esDerecho ? Number(pvcEl.value) : cuna;

    const dobleProducto = fc * pas;
    const tripleProducto = dobleProducto * cuna;
    const ppc = padSist - referencia;
    const indiceAporteConsumo = tripleProducto > 0 ? ppc / (tripleProducto / 1000) : null;

    let estado = 'ok';
    if (dobleProducto > 12000 || tripleProducto > 120000) estado = 'danger';
    else if (ppc < 60 || (indiceAporteConsumo !== null && indiceAporteConsumo < 0.6)) estado = 'warn';

    const lineas = [
        `Doble producto = FC × PAS = ${dobleProducto.toLocaleString('es')} (normal máx. 12.000)`,
        `Triple producto = doble producto × presión en cuña = ${tripleProducto.toLocaleString('es')} (normal máx. 120.000)`,
        `Presión de perfusión coronaria (${esDerecho ? 'VD, PAD−PVC' : 'VI, PAD−cuña'}) = ${ppc.toFixed(0)} mmHg (objetivo &gt;60 mmHg)`,
        indiceAporteConsumo !== null ? `Índice de aporte-consumo = PPC / (triple producto/1000) = ${indiceAporteConsumo.toFixed(2)} (normal &gt;0,6)` : '',
    ].filter(Boolean);

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = lineas.join('<br>');
}

// Índice de aporte de oxígeno (IDO2 = IC x CaO2), Ficha 2 — versión x10
// (mL/min/m²) cruzada con el rango normal 520-650 de la Tabla 12 del
// Capítulo 5 (ver Ficha 5).
function calcIDO2Ficha2() {
    const ids = ['cardio-ido2-gc', 'cardio-ido2-sc', 'cardio-ido2-hb', 'cardio-ido2-sao2', 'cardio-ido2-pao2'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('cardio-ido2-resultado');
    if (els.some(e => !e) || !box) return;
    if (els.some(e => e.value === '')) { box.style.display = 'none'; return; }

    const [gc, sc, hb, sao2, pao2] = els.map(e => Number(e.value));
    if (sc === 0) { box.style.display = 'none'; return; }

    const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * 0.003;
    const ic = gc / sc;
    const ido2 = ic * cao2 * 10;

    let estado = 'ok';
    if (ido2 < 450) estado = 'danger';
    else if (ido2 < 520) estado = 'warn';

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `IC = GC/SC = ${ic.toFixed(2)} L/min/m²<br>` +
        `CaO₂ = ${cao2.toFixed(1)} mL/dL<br>` +
        `IDO₂ = IC × CaO₂ × 10 = ${ido2.toFixed(0)} mL/min/m²` +
        '<br><span style="font-size:0.72rem;opacity:0.85;">Valor normal de referencia (Tabla 12, Capítulo 5): 520-650 mL/min/m².</span>';
}

// Tensión de la pared ventricular, ley de Laplace (Ficha 3): T = (P×R)/2t.
function calcLaplaceTension() {
    const pEl = document.getElementById('cardio-laplace-p');
    const rEl = document.getElementById('cardio-laplace-r');
    const tEl = document.getElementById('cardio-laplace-t');
    const box = document.getElementById('cardio-laplace-resultado');
    if (!pEl || !rEl || !tEl || !box) return;
    if (pEl.value === '' || rEl.value === '' || tEl.value === '') { box.style.display = 'none'; return; }

    const p = Number(pEl.value);
    const r = Number(rEl.value);
    const t = Number(tEl.value);
    if (t === 0) { box.style.display = 'none'; return; }

    const tension = (p * r) / (2 * t);

    box.style.display = 'block';
    box.className = 'tfg-estado tfg-estado-ok';
    box.innerHTML = `T = (P × R) / 2t = (${p} × ${r}) / (2 × ${t}) = <strong>${tension.toFixed(1)}</strong> (unidades de presión×longitud/longitud)` +
        '<br><span style="font-size:0.72rem;opacity:0.85;">A mayor radio (dilatación) o menor grosor de pared, mayor tensión para la misma presión — la hipertrofia (↑t) es el mecanismo compensador que busca normalizarla.</span>';
}

export function init() {
    initCorkboard('cardio-corkboard', 'panel-cardio-tabs');

    document.querySelectorAll('#cardio-fick-hb, #cardio-fick-sao2, #cardio-fick-pao2, #cardio-fick-fc, #cardio-fick-vs, #cardio-fick-sc, #cardio-fick-svo2, #cardio-fick-pvo2')
        .forEach(el => el && el.addEventListener('input', calcFickTransporte));
    calcFickTransporte();

    document.querySelectorAll('#cardio-rv-gc, #cardio-rv-pam, #cardio-rv-pad, #cardio-rv-pamp, #cardio-rv-pai')
        .forEach(el => el && el.addEventListener('input', calcResistenciasVasculares));
    calcResistenciasVasculares();

    document.querySelectorAll('#cardio-costo-fc, #cardio-costo-pas, #cardio-costo-cuna, #cardio-costo-pad-sist, #cardio-costo-pvc')
        .forEach(el => el && el.addEventListener('input', calcCostoFuncionamiento));
    const ladoEl = document.getElementById('cardio-costo-lado');
    if (ladoEl) ladoEl.addEventListener('change', calcCostoFuncionamiento);
    calcCostoFuncionamiento();

    document.querySelectorAll('#cardio-laplace-p, #cardio-laplace-r, #cardio-laplace-t')
        .forEach(el => el && el.addEventListener('input', calcLaplaceTension));
    calcLaplaceTension();

    document.querySelectorAll('#cardio-ido2-gc, #cardio-ido2-sc, #cardio-ido2-hb, #cardio-ido2-sao2, #cardio-ido2-pao2')
        .forEach(el => el && el.addEventListener('input', calcIDO2Ficha2));
    calcIDO2Ficha2();
}
