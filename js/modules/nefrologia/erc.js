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
    const acr = Number(acrEl.value);
    if (!creatinina || !edad || acr === '' || Number.isNaN(acr)) return;

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

export function init() {
    initCorkboard('erc-corkboard', 'panel-erc-tabs');

    ['erc-cr', 'erc-edad', 'erc-sexo', 'erc-acr'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcCgaCategorizador);
    });
    calcCgaCategorizador();
}
