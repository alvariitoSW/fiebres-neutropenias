import { focoTxData } from '../../data/foco-data.js';

function calcTxEmpirico() {
    let inestable = document.getElementById('tx-inestable').checked;
    let mdr = document.getElementById('tx-mdr').checked;
    let sarm = document.getElementById('tx-sarm').checked;
    
    let box = document.getElementById('tx-recomendacion');
    let html = '';

    if (inestable) {
        html += `<strong style="color: var(--accent-red);">🚨 Paciente inestable — terapia inmediata:</strong><br>Betalactámico antipseudomónico + cobertura BGN-MDR (aminoglucósido o colistina) + cobertura SARM (daptomicina o vancomicina).`;
    } else if (mdr) {
        html += `<strong style="color: var(--accent-blue);">▼ Vía de Desescalada</strong> (riesgo BGN-MDR / BLEE):<br>Imipenem o meropenem en monoterapia, o betalactámico antipseudomónico + aminoglucósido. Evitar cefalosporinas o pip-tazo solas.`;
    } else {
        html += `<strong style="color: var(--accent-blue);">▲ Vía de Escalada</strong> (presentación no complicada, sin MDR):<br>Piperacilina-tazobactam, Cefepime o Ceftazidima en monoterapia, dosis mínima eficaz (ampliar si falla).`;
    }

    if (sarm && !inestable) html += `<br><br><strong style="color: var(--accent-green);">Colonización SARM confirmada:</strong> añadir daptomicina (nunca si sospecha respiratoria) o vancomicina.`;
    box.innerHTML = html;
}

function calcFocoTx() {
    let key = document.getElementById('foco-tx-select').value;
    let data = focoTxData[key];
    if(!data) return;
    document.getElementById('foco-tx-tratamiento').innerText = data.tratamiento;
    document.getElementById('foco-tx-comentario').innerHTML = data.comentario;
}

function calcSuspensionEmpirica() {
    let checks = document.querySelectorAll('.tx-suspension-check');
    let count = Array.from(checks).filter(c => c.checked).length;
    let box = document.getElementById('susp-resultado-empirico');
    if (count === 3) {
        box.innerHTML = '✅ Se puede suspender el ABT empírico';
        box.style.color = 'var(--accent-green)';
    } else {
        box.innerHTML = `⏳ Mantener tratamiento — cumple ${count}/3 criterios`;
        box.style.color = 'var(--accent-yellow)';
    }
}

function updateOral() {
    let checks = document.querySelectorAll('.tx-oral-exclusion');
    let count = Array.from(checks).filter(c => c.checked).length;
    let resultBox = document.getElementById('oral-resultado');
    let regimenBox = document.getElementById('oral-regimen');
    if (count > 0) {
        resultBox.innerHTML = '❌ NO candidato a vía oral — ingreso hospitalario';
        resultBox.style.color = 'var(--accent-red)';
        regimenBox.innerHTML = '';
    } else {
        resultBox.innerHTML = '✅ Candidato a manejo ambulatorio';
        resultBox.style.color = 'var(--accent-green)';
        regimenBox.innerHTML = `<strong style="color: var(--accent-blue);">Régimen (Grado A-I):</strong> Ciprofloxacino 750mg/12h VO + Amoxicilina-clavulánico 875mg/8h VO.<br><br>⚠️ No usar quinolona si ya se recibía como profilaxis.`;
    }
}

function updateAntifungico() {
    let conProfilaxis = document.getElementById('tx-profilaxis-previa').checked;
    let dias = parseFloat(document.getElementById('tx-dias-fiebre').value) || 0;
    let inestableF = document.getElementById('tx-inestable-fungico').checked;
    let box = document.getElementById('antifungico-resultado');
    let html = '';

    if (!conProfilaxis) {
        if (dias >= 4 && inestableF) {
            html = `<strong style="color: var(--accent-red);">Iniciar antifúngico empírico</strong> <span class="grade-badge red">B-II</span><br>Fiebre sin causa 4-5 días con ABT amplio espectro + inestabilidad. <br><span style="color:var(--text-muted);">Elección: Equinocandina. (Si riesgo filamentosos: Amfo B. Liposomal).</span>`;
        } else {
            html = `<strong style="color: var(--accent-blue);">Aún no indicado.</strong><br>Esperar fiebre 4-5 días + inestabilidad, o preferir estrategia guiada por diagnóstico (GM/BDG).`;
        }
    } else {
        if (dias > 10 && inestableF) {
            html = `<strong style="color: var(--accent-yellow);">Considerar como rescate</strong><br>Fiebre >10 días sin causa + inestabilidad. Cambiar familia de antifúngico respecto a la profilaxis.`;
        } else {
            html = `<strong style="color: var(--accent-green);">Generalmente NO indicado</strong> <span class="grade-badge">A-II</span><br>Incidencia IFI irruptiva ~3%. Descartar bien otras causas.`;
        }
    }
    box.innerHTML = html;
}

export function init() {
    ['tx-inestable', 'tx-mdr', 'tx-sarm'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calcTxEmpirico);
    });
    document.getElementById('foco-tx-select').addEventListener('change', calcFocoTx);
    document.querySelectorAll('.tx-suspension-check').forEach(e => e.addEventListener('change', calcSuspensionEmpirica));
    document.querySelectorAll('.tx-oral-exclusion').forEach(e => e.addEventListener('change', updateOral));
    document.getElementById('tx-profilaxis-previa').addEventListener('change', updateAntifungico);
    document.getElementById('tx-dias-fiebre').addEventListener('input', updateAntifungico);
    document.getElementById('tx-inestable-fungico').addEventListener('change', updateAntifungico);

    calcTxEmpirico();
    calcFocoTx();
    calcSuspensionEmpirica();
    updateOral();
    updateAntifungico();
}
