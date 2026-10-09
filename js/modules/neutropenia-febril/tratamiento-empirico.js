import { focoTxData } from '../../data/foco-data.js';
import { escalonesSinFoco, PRIORIDAD_SIN_FOCO, notaCriticoConCr, sarmSinFoco, notaGramPositivoSinFoco } from '../../data/empirico-sin-foco-data.js';

// Escalón de la escalera ECIL-10 que manda con las casillas actuales.
export function escalonSinFocoActivo() {
    const marcado = id => {
        const e = escalonesSinFoco.find(x => x.id === id);
        return e.checkbox === null || document.getElementById(e.checkbox).checked;
    };
    return escalonesSinFoco.find(e => e.id === PRIORIDAD_SIN_FOCO.find(marcado));
}

function calcTxEmpirico() {
    const cr = document.getElementById('tx-cr').checked;
    const sarm = document.getElementById('tx-sarm').checked;
    const e = escalonSinFocoActivo();
    const box = document.getElementById('tx-recomendacion');

    const badge = e.grado ? ` <span class="grade-badge${e.gradoClase ? ' ' + e.gradoClase : ''}">${e.grado}</span>` : '';
    const contexto = e.id === 'cr' || e.id === 'inestable' ? '' : ` (${e.contexto})`;
    let html = `<strong style="color: ${e.color};">${e.titulo}</strong>${contexto}${badge}<br>${e.regimen}`;
    if (e.id === 'inestable' && cr) html += ` ${notaCriticoConCr}`;

    if (sarm) {
        const s = sarmSinFoco[e.id === 'inestable' ? 'inestable' : 'estable'];
        html += `<br><br><strong style="color: var(--accent-green);">${s.titulo}</strong> <span class="grade-badge">${s.grado}</span> ${s.texto}`;
    }
    html += `<br><br><span style="font-size: 0.75rem; color: var(--text-muted);">${notaGramPositivoSinFoco}</span>`;
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
        box.innerHTML = '✅ Se puede suspender el ABT empírico, independientemente del recuento de neutrófilos';
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
    ['tx-inestable', 'tx-mdr', 'tx-cr', 'tx-sarm'].forEach(id => {
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
