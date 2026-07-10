import { initTabs } from '../../core/tabs.js';

function calcCVC() {
    let risks = Array.from(document.querySelectorAll('.cvc-risk')).some(c => c.checked);
    let poorAccess = document.getElementById('cvc-poor-access').checked;
    let box = document.getElementById('cvc-result-box');
    let title = document.getElementById('cvc-result-text');
    let sub = document.getElementById('cvc-result-sub');

    if (risks) {
        box.style.borderColor = 'var(--accent-red)'; box.style.background = 'rgba(255, 51, 102, 0.1)';
        title.style.color = 'var(--accent-red)'; title.innerText = 'RETIRADA OBLIGATORIA';
        sub.innerText = "Mejora el pronóstico y evita embolismos sépticos (Grado A-II).";
    } else if (poorAccess) {
        box.style.borderColor = 'var(--accent-green)'; box.style.background = 'rgba(0, 255, 204, 0.1)';
        title.style.color = 'var(--accent-green)'; title.innerText = 'CONSERVAR + SELLADO';
        sub.innerText = "Solo válido para gérmenes poco virulentos e infección no complicada.";
    } else {
        box.style.borderColor = 'rgba(255,255,255,0.1)'; box.style.background = 'rgba(0,0,0,0.6)';
        title.style.color = 'var(--text-main)'; title.innerText = 'Retirada Electiva / Valorar';
        sub.innerText = "Considerar retirada si es posible, según dificultad de acceso.";
    }
}

function calcSuspension() {
    let activeTabBtn = document.querySelector('.tab.active');
    if (!activeTabBtn) return;
    let tabID = activeTabBtn.getAttribute('data-tab');
    
    if (tabID === 'tab-perfiles') {
        document.getElementById('suspension-result-area').style.display = 'none';
        return;
    } else {
        document.getElementById('suspension-result-area').style.display = 'block';
    }

    let isClinica = (tabID === 'tab-clinica');

    let afebrile = parseInt(document.getElementById(isClinica ? 'susp-afebrile-days-clin' : 'susp-afebrile-days-micro').value) || 0;
    let abt = parseInt(document.getElementById('susp-abt-days-micro').value) || 0;
    let neutro = document.getElementById('susp-neutro-persists').checked;
    
    let title = document.getElementById('susp-final-result');
    let sub = document.getElementById('susp-final-sub');

    let canStop = false;
    let reason = "";

    if (isClinica) {
        canStop = (afebrile >= 3);
        reason = `Requiere ≥3 días afebril. (Actual: ${afebrile})`;
    } else {
        canStop = (afebrile >= 4 && abt >= 7);
        reason = `Requiere ≥4 días afebril y ≥7 de ABT. (Actual: ${afebrile}d afeb., ${abt}d ABT)`;
    }

    if (canStop) {
        title.style.color = 'var(--accent-green)'; title.innerText = '✅ LUZ VERDE PARA SUSPENDER';
        sub.style.color = 'var(--accent-green)'; sub.innerText = "Criterios cumplidos con resolución clínica.";
        if (neutro) sub.innerHTML += `<br><span style="color:var(--accent-yellow); font-weight:bold;">Vigilar 24-48h. Valorar reiniciar profilaxis antibacteriana.</span>`;
    } else {
        title.style.color = 'var(--accent-yellow)'; title.innerText = '⏳ MANTENER TRATAMIENTO';
        sub.style.color = 'var(--text-muted)'; sub.innerText = reason;
    }
}

function updateMDRUI() {
    let bug = document.getElementById('mdr-bug-select').value;
    let mods = document.getElementById('mdr-modifiers');
    
    ['sepsis', 'inoculum', 'cre', 'borderline'].forEach(m => document.getElementById(`mdr-mod-${m}`).style.display = 'none');
    
    if (bug === 'none') { mods.style.display = 'none'; }
    else { mods.style.display = 'block'; }

    if (bug === 'blee' || bug === 'ampc') {
        document.getElementById('mdr-mod-sepsis').style.display = 'block';
        document.getElementById('mdr-mod-inoculum').style.display = 'block';
    } else if (bug === 'cre') {
        document.getElementById('mdr-mod-cre').style.display = 'block';
    } else if (bug === 'pseudomonas' || bug === 'acineto') {
        document.getElementById('mdr-mod-borderline').style.display = 'block';
    }

    calcMDR();
}

function calcMDR() {
    let bug = document.getElementById('mdr-bug-select').value;
    let title = document.getElementById('mdr-result-title');
    let text = document.getElementById('mdr-result-text');

    let sepsis = document.getElementById('mdr-is-sepsis').checked;
    let inoculum = document.getElementById('mdr-high-inoculum').checked;
    let cmiMero = document.getElementById('mdr-cmi-mero').checked;
    let borderline = document.getElementById('mdr-borderline').checked;

    if (bug === 'none') {
        title.innerText = "Esperando datos..."; text.innerText = "Selecciona un microorganismo."; return;
    }

    if (bug === 'blee') {
        title.style.color = 'var(--accent-blue)'; title.innerText = "Enterobacteria BLEE";
        if (sepsis) { text.innerHTML = `<strong style="color:var(--accent-red);">Carbapenems</strong> (Grado C-I). El paciente está inestable.`; }
        else if (inoculum) { text.innerHTML = `Evitar Pip-Tazo (Efecto inóculo). Usar <strong style="color:var(--accent-yellow);">Carbapenems</strong>.`; }
        else { text.innerHTML = `<strong style="color:var(--accent-green);">BLBLI (Pip-Tazo / Amoxi-Clav)</strong> (Grado B-II). Opciones seguras en paciente estable.`; }
    } 
    else if (bug === 'ampc') {
        title.style.color = 'var(--accent-yellow)'; title.innerText = "Grupo ESCPM (AmpC)";
        let base = `⚠️ <span style="color:var(--accent-red);">Riesgo de Derrepresión:</span> Cuidado con cefalosporinas de 3ª/BLBLI.<br><br>`;
        if (sepsis) { text.innerHTML = base + `<strong style="color:var(--accent-red);">Carbapenems</strong> al estar el paciente inestable.`; }
        else { text.innerHTML = base + `<strong style="color:var(--accent-green);">Cefepime o Fluoroquinolonas</strong> (No son sustrato de AmpC).`; }
    }
    else if (bug === 'cre') {
        title.style.color = 'var(--accent-red)'; title.innerText = "CRE (KPC / OXA-48)";
        let rec = `<strong style="color:var(--accent-red);">Terapia combinada obligatoria</strong> (≥2 fármacos activos).<br>`;
        if (cmiMero) rec += `✅ <strong style="color:var(--accent-green);">Incluir Meropenem optimizado</strong> (2g/8h en 3h).<br>`;
        else rec += `❌ Meropenem EXCLUIDO (CMI ≥16).<br>`;
        rec += `Considerar Ceftazidima-Avibactam si no es metalo-betalactamasa.`;
        text.innerHTML = rec;
    }
    else if (bug === 'pseudomonas') {
        title.style.color = 'var(--accent-purple)'; title.innerText = "P. aeruginosa XDR";
        let rec = `❌ NUNCA Aminoglucósidos en monoterapia.<br>`;
        if (borderline) rec += `⚠️ Sensibilidad límite: <strong style="color:var(--accent-yellow);">Combinar 2 agentes optimizados</strong>. Considerar rescate con Ceftolozano-Tazobactam.`;
        else rec += `✅ <strong style="color:var(--accent-green);">Monoterapia optimizada</strong> (Priorizar Betalactámicos > Colistina).`;
        text.innerHTML = rec;
    }
    else if (bug === 'acineto') {
        title.style.color = 'var(--accent-purple)'; title.innerText = "A. baumannii XDR";
        text.innerHTML = `❌ NUNCA Tigeciclina en monoterapia para bacteriemia.<br>✅ <strong style="color:var(--accent-green);">Monoterapia optimizada</strong>. Priorizar <strong style="color:var(--accent-yellow);">Sulbactam</strong> (dosis altas) > Colistina.`;
    }
    else if (bug === 'steno') {
        title.style.color = 'var(--accent-blue)'; title.innerText = "S. maltophilia";
        text.innerHTML = `✅ <strong style="color:var(--accent-green);">Co-trimoxazol</strong> (Trimetoprim 15mg/kg/día).<br><span style="color:var(--text-muted);">Asumir riesgo de mielotoxicidad por alta letalidad de la infección.</span>`;
    }
}

export function init() {
    document.querySelectorAll('.cvc-risk').forEach(e => e.addEventListener('change', calcCVC));
    document.getElementById('cvc-poor-access').addEventListener('change', calcCVC);

    initTabs(document, calcSuspension);
    document.querySelectorAll('.susp-inputs').forEach(input => {
        input.addEventListener('input', calcSuspension);
        input.addEventListener('change', calcSuspension);
    });

    document.getElementById('mdr-bug-select').addEventListener('change', updateMDRUI);
    ['mdr-is-sepsis', 'mdr-high-inoculum', 'mdr-cmi-mero', 'mdr-borderline'].forEach(id => {
        document.getElementById(id).addEventListener('change', calcMDR);
    });

    calcCVC();
    calcSuspension();
    updateMDRUI();
}
