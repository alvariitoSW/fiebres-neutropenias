// Ficha 3 · Ritmo (PIF Cardiología): ¿la FC cabe en una taquicardia sinusal?
// Fuente: López Ramírez JH. La alegría de leer el electrocardiograma, 3.ª ed., 2012, p. 16: FC máx = 220 − edad.
import { clamp } from '../../core/ui.js';

export function fcMaxima(edad) { return 220 - edad; }

function calcFcMax() {
    const out = document.getElementById('ecg-f3-calc-resultado');
    if (!out) return;
    const edadEl = document.getElementById('ecg-f3-calc-edad');
    const fcEl = document.getElementById('ecg-f3-calc-fc');
    if (edadEl.value === '') { out.className = 'result-box'; out.textContent = 'Escribe la edad y la FC.'; return; }
    const edad = clamp(Math.round(Number(edadEl.value)), 1, 110);
    const max = fcMaxima(edad);
    let txt = `<strong>FC máx = 220 − ${edad} = ${max} lpm.</strong>`;
    let cls = 'result-box';
    if (fcEl.value !== '') {
        const fc = clamp(Math.round(Number(fcEl.value)), 30, 400);
        if (fc > max) { cls = 'result-box tfg-estado-warn'; txt += ` Una FC de ${fc} supera ese máximo: según el libro, busca otra arritmia.`; }
        else if (fc >= 100) { cls = 'result-box tfg-estado-ok'; txt += ` Una FC de ${fc} cabe en una taquicardia sinusal.`; }
        else { cls = 'result-box tfg-estado-neutro'; txt += ` Una FC de ${fc} no es taquicardia (≥ 100 lpm).`; }
    }
    out.className = cls;
    out.innerHTML = txt;
}

export function init() {
    ['ecg-f3-calc-edad', 'ecg-f3-calc-fc'].forEach(id => document.getElementById(id)?.addEventListener('input', calcFcMax));
}
