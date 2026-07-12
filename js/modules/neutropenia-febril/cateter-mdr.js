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
    let activeTabBtn = document.querySelector('#panel-suspension-perfiles .tab.active');
    if (!activeTabBtn) return;
    let tabID = activeTabBtn.getAttribute('data-tab');
    document.getElementById('suspension-result-area').style.display = 'block';

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
        reason = `Requiere ≥3 días (72h) afebril. (Actual: ${afebrile})`;
    } else {
        canStop = (afebrile >= 3 && abt >= 7);
        reason = `Requiere ≥3 días (72h) afebril y ≥7 de ABT. (Actual: ${afebrile}d afeb., ${abt}d ABT)`;
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
    let carbapenemasaBox = document.getElementById('mdr-mod-carbapenemasa');

    ['sepsis', 'inoculum', 'cre', 'borderline'].forEach(m => document.getElementById(`mdr-mod-${m}`).style.display = 'none');
    carbapenemasaBox.style.display = 'none';

    if (bug === 'none') { mods.style.display = 'none'; }
    else { mods.style.display = 'block'; }

    if (bug === 'blee' || bug === 'ampc') {
        document.getElementById('mdr-mod-sepsis').style.display = 'block';
        document.getElementById('mdr-mod-inoculum').style.display = 'block';
    } else if (bug === 'cre') {
        carbapenemasaBox.style.display = 'block';
        document.getElementById('mdr-mod-cre').style.display = 'block';
    } else if (bug === 'pseudomonas') {
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
    let carbapenemasa = document.getElementById('mdr-carbapenemasa-tipo').value;

    if (bug === 'none') {
        title.innerText = "Esperando datos..."; text.innerText = "Selecciona un microorganismo."; return;
    }

    if (bug === 'blee') {
        title.style.color = 'var(--accent-blue)'; title.innerText = "Enterobacteria BLEE";
        if (sepsis) { text.innerHTML = `<strong style="color:var(--accent-red);">Carbapenems</strong> <span class="grade-badge red">C-I</span>. El paciente está inestable.`; }
        else if (inoculum) { text.innerHTML = `Evitar Pip-Tazo <span class="grade-badge">B-II</span> (efecto inóculo, CMI ≥4). Usar <strong style="color:var(--accent-yellow);">Carbapenems</strong>.`; }
        else { text.innerHTML = `<strong style="color:var(--accent-green);">BLBLI (Pip-Tazo / Amoxi-Clav)</strong> <span class="grade-badge">B-II</span>. Opciones seguras en paciente estable, con sensibilidad in vitro confirmada.`; }
    }
    else if (bug === 'ampc') {
        title.style.color = 'var(--accent-yellow)'; title.innerText = "Grupo ESCPM (AmpC)";
        let base = `⚠️ <span style="color:var(--accent-red);">Riesgo de Derrepresión:</span> Cuidado con cefalosporinas de 3ª.<br><br>`;
        if (sepsis) { text.innerHTML = base + `<strong style="color:var(--accent-red);">Carbapenems</strong> <span class="grade-badge red">C-I</span> al estar el paciente inestable, o sin otras opciones disponibles.`; }
        else if (inoculum) { text.innerHTML = base + `Evitar Pip-Tazo <span class="grade-badge">B-III</span> (efecto inóculo, CMI ≥4). Usar <strong style="color:var(--accent-yellow);">Carbapenems</strong>.`; }
        else { text.innerHTML = base + `<strong style="color:var(--accent-green);">Cefepime o Fluoroquinolonas</strong> <span class="grade-badge">B-II</span> (no son sustrato de AmpC). Pip-Tazo es opción válida si hay sensibilidad in vitro <span class="grade-badge">B-II</span>.`; }
    }
    else if (bug === 'cre') {
        title.style.color = 'var(--accent-red)';
        let rec = '';
        if (carbapenemasa === 'kpc') {
            title.innerText = "CPE: KPC (Ambler clase A)";
            rec = `<strong style="color:var(--accent-green);">1ª línea: Ceftazidima-avibactam</strong> <span class="grade-badge">A-IItu</span>.<br>Alternativas: Meropenem-vaborbactam <span class="grade-badge">B-IItu</span>, Imipenem-cilastatina-relebactam <span class="grade-badge">C-IIt</span>, Cefiderocol <span class="grade-badge red">C-IIt</span>.`;
        } else if (carbapenemasa === 'oxa48') {
            title.innerText = "CPE: OXA-48-like (Ambler clase D)";
            rec = `<strong style="color:var(--accent-green);">1ª línea: Ceftazidima-avibactam</strong> <span class="grade-badge">A-IItu</span>.<br>Alternativa: Cefiderocol <span class="grade-badge red">C-IIt</span>.`;
        } else if (carbapenemasa === 'mbl') {
            title.innerText = "CPE: MBL — NDM/VIM/IMP (Ambler clase B)";
            rec = `<strong style="color:var(--accent-red);">Ceftazidima-avibactam + AZTREONAM</strong> <span class="grade-badge">A-IItu</span> — el avibactam NO inhibe metalo-betalactamasas, el aztreonam es obligatorio.<br>Alternativa: Cefiderocol <span class="grade-badge">B-IIt</span>.`;
        } else {
            title.innerText = "CRE — carbapenemasa desconocida";
            rec = `Cubrir empíricamente <strong style="color:var(--accent-yellow);">Ceftazidima-avibactam + aztreonam</strong> (cubre KPC/OXA-48/MBL a la vez) o Cefiderocol, hasta identificar el tipo de carbapenemasa y ajustar.`;
        }
        if (cmiMero) rec += `<br><br>⚠️ Crítico / foco no controlado / CMI cerca del punto de corte: <strong style="color:var(--accent-yellow);">considerar añadir un no-betalactámico activo</strong> (típicamente aminoglucósido) <span class="grade-badge">C-III</span> — la combinación de rutina con un no-betalactámico no está recomendada fuera de estos escenarios.`;
        text.innerHTML = rec;
    }
    else if (bug === 'pseudomonas') {
        title.style.color = 'var(--accent-purple)'; title.innerText = "P. aeruginosa difícil de tratar (XDR/CRPA)";
        let rec = `❌ NUNCA Aminoglucósidos en monoterapia.<br><strong style="color:var(--accent-green);">Opciones (monoterapia):</strong> Ceftolozano-tazobactam (dosis alta, 9g/día) <span class="grade-badge">A-IItur</span>, Ceftazidima-avibactam <span class="grade-badge">A-IItu</span>, Imipenem-cilastatina-relebactam <span class="grade-badge">B-IIt</span>, Cefiderocol <span class="grade-badge red">B-IItur</span>.`;
        if (borderline) rec += `<br><br>⚠️ Crítico, foco no controlado o CMI cerca del punto de corte: <strong style="color:var(--accent-yellow);">añadir un no-betalactámico activo</strong> (aminoglucósido, fluoroquinolona o fosfomicina) al fármaco elegido.`;
        text.innerHTML = rec;
    }
    else if (bug === 'acineto') {
        title.style.color = 'var(--accent-purple)'; title.innerText = "A. baumannii resistente a carbapenems (CRAB)";
        text.innerHTML = `<strong style="color:var(--accent-green);">Preferido: Sulbactam-durlobactam + imipenem dosis alta</strong> <span class="grade-badge">A-IIt</span> (durlobactam no está aprobado por la EMA en Europa).<br>Si no disponible: <strong style="color:var(--accent-yellow);">Sulbactam altas dosis (≥9g/día) + colistina</strong> (preferido) o cefiderocol/tigeciclina/minociclina/fosfomicina <span class="grade-badge">B-IIt</span>.<br>Terapia combinada recomendada de entrada en pacientes inmunocomprometidos con CRAB, hasta conocer el antibiograma.`;
    }
    else if (bug === 'steno') {
        title.style.color = 'var(--accent-blue)'; title.innerText = "S. maltophilia";
        text.innerHTML = `<strong style="color:var(--accent-green);">Cotrimoxazol (TMP 8-12mg/kg/día) EN COMBINACIÓN</strong> <span class="grade-badge">B-IItu</span> con levofloxacino (si sensible, sobre todo si neumonía), tetraciclina en dosis altas (minociclina/tigeciclina) o cefiderocol — no monoterapia, dada la mortalidad &gt;50%.<br>Si cotrimoxazol no es viable: combinación de 2 de los anteriores, o triple terapia con ceftazidima-avibactam + aztreonam + levofloxacino/tetraciclina.<br>Desescalar a monoterapia tras respuesta clínica favorable y sensibilidad confirmada.`;
    }
}

export function init() {
    document.querySelectorAll('.cvc-risk').forEach(e => e.addEventListener('change', calcCVC));
    document.getElementById('cvc-poor-access').addEventListener('change', calcCVC);

    initTabs(document.getElementById('panel-suspension-perfiles'), calcSuspension);
    document.querySelectorAll('.susp-inputs').forEach(input => {
        input.addEventListener('input', calcSuspension);
        input.addEventListener('change', calcSuspension);
    });

    document.getElementById('mdr-bug-select').addEventListener('change', updateMDRUI);
    document.getElementById('mdr-carbapenemasa-tipo').addEventListener('change', calcMDR);
    ['mdr-is-sepsis', 'mdr-high-inoculum', 'mdr-cmi-mero', 'mdr-borderline'].forEach(id => {
        document.getElementById(id).addEventListener('change', calcMDR);
    });

    calcCVC();
    calcSuspension();
    updateMDRUI();
}
