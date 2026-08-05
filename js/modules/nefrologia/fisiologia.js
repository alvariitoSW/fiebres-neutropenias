// Repaso esquematizado de fisiología renal (cuaderno de campo) + simulador
// interactivo de autorregulación de la TFG. Fuente: Carracedo J, Ramírez R.
// "Fisiología Renal". Nefrología al día (SEN), actualizado 5/10/2020.
import { initCorkboard } from '../../core/corkboard.js';

// Modelo simplificado con fines didácticos (no una calculadora clínica):
// entre 80-180 mmHg de PAM la autorregulación (miogénica + retroalimentación
// túbulo-glomerular) mantiene la TFG prácticamente constante; fuera de ese
// rango el mecanismo se ve superado y la TFG cae (por debajo) o sube muy
// poco (por encima), tal como describe la fuente.
function calcTfgSimulador() {
    const slider = document.getElementById('tfg-pam');
    if (!slider) return;

    const pam = Number(slider.value);
    document.getElementById('tfg-pam-valor').textContent = `${pam} mmHg`;

    let phg, tfg, aferente, estado, mensaje;
    const eferente = 45;

    if (pam >= 80 && pam <= 180) {
        phg = 55;
        tfg = 125;
        aferente = 70 - ((pam - 80) / 100) * 30;
        estado = 'ok';
        mensaje = '✅ Autorregulación intacta. El mecanismo miogénico (la propia arteriola aferente se contrae o dilata según el estiramiento de su pared) y la retroalimentación túbulo-glomerular (la mácula densa detecta el Na⁺/Cl⁻ que llega al túbulo distal) mantienen la TFG prácticamente constante, sin necesidad de hormonas ni del sistema nervioso.';
    } else if (pam < 80) {
        phg = Math.round(0.6875 * pam);
        tfg = Math.max(0, Math.round(125 * Math.pow(pam / 80, 2)));
        aferente = 80;
        if (pam < 60) {
            estado = 'danger';
            mensaje = '🔴 Autorregulación superada. La arteriola aferente ya está dilatada al máximo y no puede compensar más — el filtrado cae con fuerza. Este es el sustrato fisiopatológico de la lesión renal aguda prerrenal.';
        } else {
            estado = 'warn';
            mensaje = '⚠️ Cerca del límite inferior (80 mmHg). La arteriola aferente se dilata al máximo intentando sostener el flujo capilar glomerular.';
        }
    } else {
        const exceso = pam - 180;
        phg = Math.round(55 + exceso * 0.15);
        tfg = Math.round(125 + exceso * 0.3);
        aferente = 25;
        estado = 'warn';
        mensaje = '⚠️ Por encima del límite superior (180 mmHg). La arteriola aferente se contrae con fuerza para proteger el glomérulo — la TFG sube, pero muy poco.';
    }

    document.getElementById('tfg-phg').textContent = `${phg} mmHg`;
    document.getElementById('tfg-valor').textContent = `${tfg} mL/min`;
    document.getElementById('tfg-aferente').style.width = `${aferente}%`;
    document.getElementById('tfg-eferente').style.width = `${eferente}%`;

    const estadoBox = document.getElementById('tfg-estado');
    estadoBox.className = `tfg-estado tfg-estado-${estado}`;
    estadoBox.textContent = mensaje;
}

export function init() {
    initCorkboard('fisio-corkboard', 'panel-fisio-tabs');

    const slider = document.getElementById('tfg-pam');
    if (slider) {
        slider.addEventListener('input', calcTfgSimulador);
        calcTfgSimulador();
    }
}
