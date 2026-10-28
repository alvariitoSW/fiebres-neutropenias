// Calculadora de QTc de la ficha 7 («ECG y arritmias»).
// Fuente: López Ramírez JH. La alegría de leer el electrocardiograma, 3.ª ed., 2012, pp. 108-109:
// QTc = QT / √RR; normal 0,36-0,42 s (varón) y hasta 0,43 s (mujer); > 0,45 s cuidado; > 0,50 s alto riesgo.
import { clamp } from '../../core/ui.js';

const S_POR_MM = 0.04; // 25 mm/s (p. 3 del libro)

export function qtcSegundos(qtS, rrS) { return qtS / Math.sqrt(rrS); }

// Los umbrales se comparan con el valor redondeado a 2 decimales, el mismo que se muestra.
export const redondea2 = n => Math.round((n + 1e-9) * 100) / 100;

export function veredictoQtc(qtc, sexo) {
    const v = redondea2(qtc);
    const maxNormal = sexo === 'm' ? 0.43 : 0.42;
    if (v > 0.50) return ['tfg-estado-danger', 'QTc > 0,50 s: alto riesgo de arritmias ventriculares, sobre todo torsades de pointes'];
    if (v > 0.45) return ['tfg-estado-warn', 'QTc > 0,45 s: merece cuidado'];
    if (v > maxNormal) return ['tfg-estado-warn', `por encima de lo normal (hasta ${String(maxNormal).replace('.', ',')} s) pero sin pasar de 0,45 s`];
    if (v < 0.36) return ['tfg-estado-neutro', 'por debajo de 0,36 s: el libro lo asocia a hipercalcemia o digital'];
    return ['tfg-estado-ok', 'dentro de lo normal del libro (0,36-0,42 s en varón, hasta 0,43 s en mujer)'];
}

const coma = (n, d = 2) => n.toFixed(d).replace('.', ',');

export function calcQtc() {
    const out = document.getElementById('ecg-f7-calc-resultado');
    if (!out) return;
    const qtEl = document.getElementById('ecg-f7-calc-qt-mm');
    const rrEl = document.getElementById('ecg-f7-calc-rr-mm');
    const sexo = document.getElementById('ecg-f7-calc-sexo').value;
    if (qtEl.value === '' || rrEl.value === '') {
        out.className = 'result-box';
        out.textContent = 'Escribe el QT y el RR en milímetros.';
        return;
    }
    const qtMm = clamp(Number(qtEl.value), 5, 40);
    const rrMm = clamp(Number(rrEl.value), 6, 75);
    const qt = qtMm * S_POR_MM, rr = rrMm * S_POR_MM;
    const qtc = qtcSegundos(qt, rr);
    const [cls, txt] = veredictoQtc(qtc, sexo);
    let t = `<strong>QTc = ${coma(qt)} ÷ √${coma(rr)} = ${coma(redondea2(qtc))} s</strong> (FC ${Math.round(1500 / rrMm)} lpm) · ${txt}.`;
    if (qt >= rr || qtc > 0.7) t += ' Combinación no fisiológica: revisa las medidas (el QT no puede igualar al RR).';
    out.className = `result-box ${cls}`;
    out.innerHTML = t;
}

export function init() {
    ['ecg-f7-calc-qt-mm', 'ecg-f7-calc-rr-mm'].forEach(id => document.getElementById(id)?.addEventListener('input', calcQtc));
    document.getElementById('ecg-f7-calc-sexo')?.addEventListener('change', calcQtc);
}
