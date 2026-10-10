import { pkpdData } from '../../data/pkpd-data.js';

// Solo los botones de fármaco de esta calculadora: la clase .pkpd-btn la
// reutilizan también enlaces de bibliografía de otras vistas.
const botonesFarmaco = () => document.querySelectorAll('#pkpd-card .pkpd-btn[data-drug]');
const activo = () => document.querySelector('#pkpd-card .pkpd-btn[data-drug].active');

function calcPKPD(btn) {
    if(!btn) return;
    botonesFarmaco().forEach(b => b.classList.remove('active'));
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
    botonesFarmaco().forEach(btn => {
        btn.addEventListener('click', () => calcPKPD(btn));
    });
    document.getElementById('pkpd-severe-toggle').addEventListener('change', () => calcPKPD(activo()));
    document.getElementById('pkpd-renal').addEventListener('change', () => calcPKPD(activo()));
}
