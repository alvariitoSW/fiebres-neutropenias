// «ECG y arritmias» (PIF Cardiología): cuaderno de campo y calculadora de frecuencia.
// Fuente: López Ramírez JH. La alegría de leer el electrocardiograma, 3.ª ed., 2012, cap. 2 (pp. 10-11).
import { initCorkboard } from '../../core/corkboard.js';
import { clamp } from '../../core/ui.js';

// Método 2 (1500 / mm entre R y R) y método 3 (QRS en 5 s × 12, o en 6 s × 10).
// Un campo vacío nunca es 0. Los umbrales (60 y 100) se comparan con el valor redondeado.
export function frecuenciaPorMm(mm) { return 1500 / mm; }
export function frecuenciaPorConteo(qrs, factor) { return qrs * factor; }

function veredicto(fc) {
    if (fc <= 59) return ['tfg-estado-warn', 'bradicardia (≤ 59 lpm)'];
    if (fc >= 100) return ['tfg-estado-warn', 'taquicardia (≥ 100 lpm)'];
    return ['tfg-estado-ok', 'dentro de 60-99 lpm'];
}

function calcFrecuencia() {
    const out = document.getElementById('ecg2-calc-resultado');
    if (!out) return;
    const mmEl = document.getElementById('ecg2-calc-mm');
    const qrsEl = document.getElementById('ecg2-calc-qrs');
    const factor = Number(document.getElementById('ecg2-calc-ventana').value);
    const partes = [];
    let estado = 'result-box';
    if (mmEl.value !== '') {
        const mm = clamp(Number(mmEl.value), 3, 100);
        const fc = Math.round(frecuenciaPorMm(mm));
        const [cls, txt] = veredicto(fc);
        estado = `result-box ${cls}`;
        let t = `<strong>1500 ÷ ${mm} mm = ${fc} lpm</strong> · ${txt}.`;
        if (mm < 5) t += ' Más de 300 lpm es una combinación poco fisiológica: revisa los milímetros contados.';
        partes.push(t);
    }
    if (qrsEl.value !== '') {
        const qrs = clamp(Math.round(Number(qrsEl.value)), 0, 80);
        const fc = Math.round(frecuenciaPorConteo(qrs, factor));
        const [cls, txt] = veredicto(fc);
        if (mmEl.value === '') estado = `result-box ${cls}`;
        partes.push(`<strong>${qrs} QRS × ${factor} = ${fc} lpm</strong> · ${txt}. Método muy inexacto: solo para ritmo irregular (FA).`);
    }
    out.className = estado;
    out.innerHTML = partes.length ? partes.join('<br>') : 'Escribe los milímetros entre dos R, o los QRS contados.';
}

export function init() {
    initCorkboard('pif-ecg-corkboard', 'panel-pif-ecg-tabs');
    ['ecg2-calc-mm', 'ecg2-calc-qrs'].forEach(id => document.getElementById(id)?.addEventListener('input', calcFrecuencia));
    document.getElementById('ecg2-calc-ventana')?.addEventListener('change', calcFrecuencia);
}
