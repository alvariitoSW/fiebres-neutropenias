// Toxicidad sistémica por citrato en TRR continua — cuaderno de campo +
// calculadora del ratio calcio total/calcio iónico (T/iCa). Fuente:
// Redant S, Attou R, Talpos MT, Honoré PM. J Clin Med. 2026;15:6564.
import { initCorkboard } from '../../core/corkboard.js';

// Ratio T/iCa = calcio total / calcio iónico (ambos en mmol/l). Umbral
// >2.5 usado comúnmente en la fuente como sugestivo de acumulación
// sistémica de citrato — nunca interpretado de forma aislada (ver
// nota en citrato-trr.html).
function calcRatioTiCa() {
    const totalEl = document.getElementById('citrato-ca-total');
    const ionicoEl = document.getElementById('citrato-ca-ionico');
    const box = document.getElementById('citrato-ratio-resultado');
    if (!totalEl || !ionicoEl || !box) return;

    if (totalEl.value === '' || ionicoEl.value === '') {
        box.className = 'tfg-estado tfg-estado-ok';
        box.textContent = 'Completa ambos valores para calcular el ratio T/iCa.';
        return;
    }

    const total = Number(totalEl.value);
    const ionico = Number(ionicoEl.value);
    if (!ionico) return;

    const ratio = total / ionico;
    let estado, mensaje;
    if (ratio > 3.0) {
        estado = 'danger';
        mensaje = `Ratio T/iCa = ${ratio.toFixed(2)} — por encima de 3,0, un hallazgo que, si persiste pese a optimización, apoya considerar la discontinuación de la RCA. Interpreta siempre junto al Ca iónico, los requerimientos de calcio, el estado ácido-base y su tendencia.`;
    } else if (ratio >= 2.5) {
        estado = 'warn';
        mensaje = `Ratio T/iCa = ${ratio.toFixed(2)} — por encima del umbral de 2,5 comúnmente usado como sugestivo de acumulación de citrato. Evalúa Ca iónico, requerimientos de calcio, acidosis metabólica y lactato antes de concluir nada.`;
    } else {
        estado = 'ok';
        mensaje = `Ratio T/iCa = ${ratio.toFixed(2)} — por debajo de 2,5, baja probabilidad de acumulación sistémica de citrato. Si hay hipocalcemia, considera otras causas.`;
    }

    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = mensaje;
}

export function init() {
    initCorkboard('citrato-corkboard', 'panel-citrato-tabs');

    ['citrato-ca-total', 'citrato-ca-ionico'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calcRatioTiCa);
    });
    calcRatioTiCa();
}
