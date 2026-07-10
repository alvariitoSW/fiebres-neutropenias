import { focoData } from '../../data/foco-data.js';

function calcDiferencial() {
    let cvcRaw = document.getElementById('micro-cvc-time').value;
    let periRaw = document.getElementById('micro-periph-time').value;
    let d = document.getElementById('micro-diff-display');
    let t = document.getElementById('micro-diff-eval');
    
    if (cvcRaw === "" && periRaw === "") {
        d.innerText = '-- h';
        d.style.color = 'var(--accent-green)'; t.innerText = 'Introduce ambos tiempos o deja uno en blanco si no se extrajo'; t.style.color = 'var(--text-muted)';
        return;
    } else if (cvcRaw !== "" && periRaw === "") {
        d.innerText = 'N/A';
        d.style.color = 'var(--accent-yellow)'; 
        t.innerHTML = 'Solo CVC. Inviable hacer diferencial de tiempo.<br><span style="color:var(--text-muted)">Alternativa: Cultivo de punta >15 UFC/mL = Infección de CVC.</span>'; 
        t.style.color = 'var(--accent-yellow)';
        return;
    } else if (cvcRaw === "" && periRaw !== "") {
        d.innerText = 'N/A';
        d.style.color = 'var(--accent-yellow)'; 
        t.innerText = 'Solo Periférica. No evalúa catéter.'; 
        t.style.color = 'var(--accent-yellow)';
        return;
    }

    let cvc = parseFloat(cvcRaw);
    let peri = parseFloat(periRaw);
    let diff = peri - cvc;
    d.innerText = `${diff.toFixed(1)} h`;

    if (diff >= 2) {
        d.style.color = 'var(--accent-red)'; t.innerText = 'Sugiere bacteriemia por catéter'; t.style.color = 'var(--accent-red)';
    } else {
        d.style.color = 'var(--accent-green)'; t.innerText = 'No sugiere origen de catéter'; t.style.color = 'var(--text-muted)';
    }
}

function updateFocoTecnica() {
    let key = document.getElementById('foco-select').value;
    let data = focoData[key];
    if(!data) return;
    document.getElementById('foco-tecnica').innerText = data.tecnica;
    document.getElementById('foco-tiempo').innerHTML = data.tiempo;
    document.getElementById('foco-nota').innerHTML = data.nota;
}

function toggleProfilaxisFungica() {
    let conProfilaxis = document.getElementById('gm-profilaxis-toggle').checked;
    document.getElementById('branch-sin').classList.toggle('active', !conProfilaxis);
    document.getElementById('branch-con').classList.toggle('active', conProfilaxis);
}

function interpretarGM() {
    let sample = document.getElementById('gm-sample-type').value;
    let value = parseFloat(document.getElementById('gm-value').value);
    let display = document.getElementById('gm-result-display');
    let text = document.getElementById('gm-result-text');

    if (isNaN(value)) {
        display.innerText = '—'; text.innerText = 'Selecciona muestra e introduce el valor'; return;
    }

    let threshold, label;
    if (sample === 'serum1') { threshold = 0.7; label = 'corte ECIL ≥0.7 (1 determinación)'; }
    else if (sample === 'serum2') { threshold = 0.5; label = 'corte >0.5 (2 determinaciones)'; }
    else { threshold = 1; label = 'corte en BAL ≥1'; }

    let isPositive = value >= threshold;
    display.innerText = isPositive ? 'POSITIVO' : 'NEGATIVO';
    display.style.color = isPositive ? 'var(--accent-red)' : 'var(--accent-green)';
    display.style.textShadow = isPositive ? 'var(--glow-red)' : 'var(--glow-green)';

    if (isPositive) {
        text.innerHTML = sample === 'bal' ? `Supera el ${label}. Junto con PCR panfúngica en BAL, apoya el diagnóstico.` : `Supera el ${label}. → Siguiente paso: <strong>TC de tórax</strong>, aunque no haya clínica respiratoria.`;
    } else {
        text.innerHTML = `Por debajo del ${label}. Mantener seguimiento según sospecha clínica.`;
    }
}

function interpretarPCR() {
    let value = parseFloat(document.getElementById('pcr-value').value);
    let display = document.getElementById('pcr-result-display');
    let text = document.getElementById('pcr-result-text');

    if (isNaN(value)) { display.innerText = '-- mg/dL'; text.innerText = 'Introduce el valor'; return; }
    
    display.innerText = `${value} mg/dL`;
    if (value > 30) {
        display.style.color = 'var(--accent-red)'; display.style.textShadow = 'var(--glow-red)';
        text.innerText = 'Rango asociado a mayor mortalidad (Grado C-III)'; text.style.color = 'var(--accent-red)';
    } else if (value >= 20) {
        display.style.color = 'var(--accent-yellow)'; display.style.textShadow = 'none';
        text.innerText = 'Zona límite (20-30 mg/dL): vigilar evolución'; text.style.color = 'var(--accent-yellow)';
    } else {
        display.style.color = 'var(--accent-green)'; display.style.textShadow = 'var(--glow-green)';
        text.innerText = 'Sin correlación de mortalidad descrita a este nivel'; text.style.color = 'var(--text-muted)';
    }
}

export function init() {
    document.querySelectorAll('.micro-input').forEach(e => e.addEventListener('input', calcDiferencial));
    document.getElementById('foco-select').addEventListener('change', updateFocoTecnica);
    document.getElementById('gm-profilaxis-toggle').addEventListener('change', toggleProfilaxisFungica);
    document.getElementById('gm-sample-type').addEventListener('change', interpretarGM);
    document.getElementById('gm-value').addEventListener('input', interpretarGM);
    document.getElementById('pcr-value').addEventListener('input', interpretarPCR);

    calcDiferencial();
    updateFocoTecnica();
    interpretarGM();
    interpretarPCR();
}
