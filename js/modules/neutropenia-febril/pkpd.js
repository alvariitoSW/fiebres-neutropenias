import { pkpdData } from '../../data/pkpd-data.js';

function calcPKPD(btn) {
    if(!btn) return;
    document.querySelectorAll('.pkpd-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let drug = btn.getAttribute('data-drug');
    let severe = document.getElementById('pkpd-severe-toggle').checked;
    let renalStatus = document.getElementById('pkpd-renal').value;
    
    let box = document.getElementById('pkpd-result-dose');
    let panelInfo = document.getElementById('pkpd-info-panel');
    let textInter = document.getElementById('pkpd-inter');
    let textContra = document.getElementById('pkpd-contra');

    let severityKey = severe ? 'severe' : 'normal';
    let dose = pkpdData[drug].doses[severityKey][renalStatus];
    
    box.innerText = dose;
    box.style.color = severe ? 'var(--accent-red)' : 'var(--accent-blue)';
    box.style.textShadow = severe ? 'var(--glow-red)' : 'var(--glow-blue)';

    textInter.innerText = pkpdData[drug].inter;
    textContra.innerText = pkpdData[drug].contra;
    panelInfo.style.display = 'block';
}

export function init() {
    document.querySelectorAll('.pkpd-btn').forEach(btn => {
        btn.addEventListener('click', () => calcPKPD(btn));
    });
    document.getElementById('pkpd-severe-toggle').addEventListener('change', () => {
        const active = document.querySelector('.pkpd-btn.active');
        if (active) calcPKPD(active);
    });
    document.getElementById('pkpd-renal').addEventListener('change', () => {
        const active = document.querySelector('.pkpd-btn.active');
        if (active) calcPKPD(active);
    });
}
