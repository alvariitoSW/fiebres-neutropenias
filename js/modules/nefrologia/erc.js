// Repaso esquematizado de Enfermedad Renal Crónica (cuaderno de campo) +
// calculadora de FGe y categorización CGA. Fuente: KDIGO 2024 Clinical
// Practice Guideline for the Evaluation and Management of Chronic Kidney
// Disease. Kidney Int. 2024;105(4S):S117-S314.
import { initCorkboard } from '../../core/corkboard.js';

// Ecuación CKD-EPI de creatinina 2021 (sin coeficiente de raza), la
// recomendada por KDIGO 2024 como primera aproximación en adultos:
// eGFR = 142 x min(Scr/k,1)^a x max(Scr/k,1)^-1.200 x 0.9938^edad x 1.012 [mujer]
function ckdEpi2021(creatinina, edad, sexo) {
    const k = sexo === 'mujer' ? 0.7 : 0.9;
    const a = sexo === 'mujer' ? -0.241 : -0.302;
    const ratio = creatinina / k;
    const fge = 142
        * Math.pow(Math.min(ratio, 1), a)
        * Math.pow(Math.max(ratio, 1), -1.200)
        * Math.pow(0.9938, edad)
        * (sexo === 'mujer' ? 1.012 : 1);
    return fge;
}

function categoriaG(fge) {
    if (fge >= 90) return 'G1';
    if (fge >= 60) return 'G2';
    if (fge >= 45) return 'G3a';
    if (fge >= 30) return 'G3b';
    if (fge >= 15) return 'G4';
    return 'G5';
}

function categoriaA(acr) {
    if (acr < 30) return 'A1';
    if (acr <= 300) return 'A2';
    return 'A3';
}

// Nivel de riesgo 1-4 (verde/amarillo/naranja/rojo) según el "mapa de
// calor" G x A estándar de KDIGO 2012/2024.
const MAPA_RIESGO = {
    G1: { A1: 1, A2: 2, A3: 3 },
    G2: { A1: 1, A2: 2, A3: 3 },
    G3a: { A1: 2, A2: 3, A3: 4 },
    G3b: { A1: 3, A2: 4, A3: 4 },
    G4: { A1: 4, A2: 4, A3: 4 },
    G5: { A1: 4, A2: 4, A3: 4 },
};

const RIESGO_TEXTO = {
    1: 'riesgo bajo (verde)',
    2: 'riesgo moderadamente aumentado (amarillo)',
    3: 'riesgo alto (naranja)',
    4: 'riesgo muy alto (rojo)',
};

function calcCgaCategorizador() {
    const crEl = document.getElementById('erc-cr');
    const edadEl = document.getElementById('erc-edad');
    const sexoEl = document.getElementById('erc-sexo');
    const acrEl = document.getElementById('erc-acr');
    const box = document.getElementById('erc-cga-resultado');
    if (!crEl || !edadEl || !sexoEl || !acrEl || !box) return;

    const creatinina = Number(crEl.value);
    const edad = Number(edadEl.value);
    const sexo = sexoEl.value;
    if (!creatinina || !edad || acrEl.value === '') return;
    const acr = Number(acrEl.value);
    if (Number.isNaN(acr)) return;

    const fge = ckdEpi2021(creatinina, edad, sexo);
    const g = categoriaG(fge);
    const a = categoriaA(acr);
    const nivel = MAPA_RIESGO[g][a];

    let estado;
    if (nivel === 1) estado = 'ok';
    else if (nivel === 2) estado = 'warn';
    else estado = 'danger';

    let erc = '';
    if (fge < 60 || acr >= 30) {
        erc = ' → cumple criterio de ERC (FGe &lt;60 y/o albuminuria persistente ≥30 mg/g, si se confirma a los ≥3 meses).';
    } else {
        erc = ' → sin criterios de ERC con estos valores aislados (FGe ≥60 y ACR &lt;30).';
    }

    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `FGe (CKD-EPI 2021): <strong>${fge.toFixed(0)} ml/min/1,73m²</strong> — Categoría <strong>${g}${a}</strong>, ${RIESGO_TEXTO[nivel]}${erc}`;
}

// Evaluación independiente de cada parámetro del panel analítico de una
// visita (ACR, potasio, bicarbonato, hemoglobina) frente a los umbrales ya
// citados en las fichas de esta sección (Fichas 1, 7 y 8). Los campos se
// evalúan de forma independiente y se omiten si están vacíos — nunca se
// inventa un umbral numérico para parámetros donde la fuente (KDIGO 2024)
// explícitamente evita un único valor de corte (calcio, fósforo, PTH,
// ácido úrico, LDL); esos quedan fuera de esta calculadora a propósito y
// se explican en la tabla maestra de la propia ficha.
function filaPanel(icono, color, texto) {
    return `<div style="border-left:3px solid var(${color}); padding:8px 10px; margin-bottom:6px; font-size:0.8rem; background:rgba(255,255,255,0.03);">${icono} ${texto}</div>`;
}

function calcPanelAnalitico() {
    const acrEl = document.getElementById('erc-panel-acr');
    const kEl = document.getElementById('erc-panel-k');
    const hco3El = document.getElementById('erc-panel-hco3');
    const hbEl = document.getElementById('erc-panel-hb');
    const sexoEl = document.getElementById('erc-panel-sexo');
    const box = document.getElementById('erc-panel-resultado');
    if (!acrEl || !kEl || !hco3El || !hbEl || !sexoEl || !box) return;

    const filas = [];

    if (acrEl.value !== '') {
        const acr = Number(acrEl.value);
        if (acr < 30) filas.push(filaPanel('✅', '--accent-green', `ACR ${acr} mg/g — categoría A1, en objetivo.`));
        else if (acr <= 300) filas.push(filaPanel('⚠️', '--accent-yellow', `ACR ${acr} mg/g — categoría A2, moderadamente elevada. Revisar bloqueo del SRAA y criterio de iSGLT2 (Ficha 5-6).`));
        else filas.push(filaPanel('🔴', '--accent-red', `ACR ${acr} mg/g — categoría A3, gravemente elevada. Intensificar bloqueo del SRAA e iSGLT2 si procede (Ficha 5-6); valorar derivación (Ficha 3).`));
    }

    if (kEl.value !== '') {
        const k = Number(kEl.value);
        if (k < 3.5) filas.push(filaPanel('⚠️', '--accent-yellow', `Potasio ${k} mEq/l — hipopotasemia, investigar causa.`));
        else if (k <= 5.0) filas.push(filaPanel('✅', '--accent-green', `Potasio ${k} mEq/l — en rango normal.`));
        else if (k <= 5.9) filas.push(filaPanel('⚠️', '--accent-yellow', `Potasio ${k} mEq/l — hiperpotasemia leve-moderada. Iniciar manejo escalonado (Ficha 7).`));
        else if (k < 6.5) filas.push(filaPanel('🔴', '--accent-red', `Potasio ${k} mEq/l — hiperpotasemia moderada. Evaluar y tratar (Ficha 7).`));
        else filas.push(filaPanel('🔴', '--accent-red', `Potasio ${k} mEq/l — hiperpotasemia grave. Actuación inmediata, ECG y monitorización (Ficha 7).`));
    }

    if (hco3El.value !== '') {
        const hco3 = Number(hco3El.value);
        if (hco3 < 18) filas.push(filaPanel('🔴', '--accent-red', `Bicarbonato ${hco3} mEq/l — por debajo de 18, considerar suplementación oral con álcalis (Ficha 7).`));
        else if (hco3 < 22) filas.push(filaPanel('⚠️', '--accent-yellow', `Bicarbonato ${hco3} mEq/l — algo bajo, vigilar evolución (Ficha 7).`));
        else filas.push(filaPanel('✅', '--accent-green', `Bicarbonato ${hco3} mEq/l — en rango normal.`));
    }

    if (hbEl.value !== '') {
        const hb = Number(hbEl.value);
        const umbral = sexoEl.value === 'varon' ? 12 : 11;
        if (hb < umbral) filas.push(filaPanel('⚠️', '--accent-yellow', `Hemoglobina ${hb} g/dl — por debajo de ${umbral} g/dl, compatible con anemia asociada a la ERC (Ficha 8).`));
        else filas.push(filaPanel('✅', '--accent-green', `Hemoglobina ${hb} g/dl — en rango.`));
    }

    box.innerHTML = filas.length > 0
        ? filas.join('')
        : '<p style="font-size:0.78rem; color:var(--text-muted);">Introduce al menos un valor para ver la evaluación.</p>';
}

// Esquema de riesgo de Mehran et al. (J Am Coll Cardiol 2004;44:1393-1399)
// para nefropatía inducida por contraste (NIC) — score aditivo simple, a
// diferencia de la KFRE (regresión compleja, deliberadamente no
// implementada en esta app). Fuente: PNT-NEF-20 (HUGCDN).
function calcMehran() {
    const ids = ['mehran-hipotension', 'mehran-iabp', 'mehran-icc', 'mehran-edad', 'mehran-anemia', 'mehran-dm'];
    const box = document.getElementById('mehran-resultado');
    const volEl = document.getElementById('mehran-volumen');
    const renalEl = document.getElementById('mehran-renal');
    if (!box || !volEl || !renalEl) return;
    if (ids.some(id => !document.getElementById(id))) return;

    let puntos = 0;
    const pesos = { 'mehran-hipotension': 5, 'mehran-iabp': 5, 'mehran-icc': 5, 'mehran-edad': 4, 'mehran-anemia': 3, 'mehran-dm': 3 };
    ids.forEach(id => { if (document.getElementById(id).checked) puntos += pesos[id]; });

    if (volEl.value !== '') puntos += Math.floor(Number(volEl.value) / 100);
    if (renalEl.value !== '') puntos += Number(renalEl.value);

    let estado, riesgoNic, riesgoDialisis;
    if (puntos <= 5) { estado = 'ok'; riesgoNic = '7,5%'; riesgoDialisis = '0,04%'; }
    else if (puntos <= 10) { estado = 'warn'; riesgoNic = '14,0%'; riesgoDialisis = '0,12%'; }
    else if (puntos <= 16) { estado = 'warn'; riesgoNic = '26,1%'; riesgoDialisis = '1,09%'; }
    else { estado = 'danger'; riesgoNic = '57,3%'; riesgoDialisis = '12,6%'; }

    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `<strong>Puntuación de Mehran: ${puntos}</strong> — riesgo de nefropatía por contraste ≈ <strong>${riesgoNic}</strong>, riesgo de requerir diálisis ≈ <strong>${riesgoDialisis}</strong>.`;
}

export function init() {
    initCorkboard('erc-corkboard', 'panel-erc-tabs');

    ['mehran-hipotension', 'mehran-iabp', 'mehran-icc', 'mehran-edad', 'mehran-anemia', 'mehran-dm'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', calcMehran);
    });
    document.getElementById('mehran-volumen')?.addEventListener('input', calcMehran);
    document.getElementById('mehran-renal')?.addEventListener('change', calcMehran);
    calcMehran();

    ['erc-cr', 'erc-edad', 'erc-sexo', 'erc-acr'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcCgaCategorizador);
    });
    calcCgaCategorizador();

    ['erc-panel-acr', 'erc-panel-k', 'erc-panel-hco3', 'erc-panel-hb', 'erc-panel-sexo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcPanelAnalitico);
    });
    calcPanelAnalitico();
}
