// Repaso esquematizado de fisiología renal (cuaderno de campo) + simulador
// interactivo de autorregulación de la TFG. Fuente: Carracedo J, Ramírez R.
// "Fisiología Renal". Nefrología al día (SEN), actualizado 5/10/2020.
import { initCorkboard } from '../../core/corkboard.js';
import {
    hiponatremiaPorVolemia, hipernatremiaDiagnosticoDiferencial,
    factoresDistribucionPotasio, sindromesHipopotasemicos, mecanismosHiperpotasemia,
} from '../../data/agua-potasio-data.js';

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

// Modelo simplificado con fines didácticos: entre 275-295 mOsm/kg la ADH y
// la osmolalidad urinaria varían de forma aproximadamente lineal con la
// osmolalidad plasmática; por debajo la ADH está suprimida (orina diluida al
// máximo) y por encima está en su máximo (orina concentrada al máximo). El
// umbral de la sed (292-295 mOsm/kg, cambio del 2-3%) se marca aparte según
// la fuente.
function calcAguaSimulador() {
    const slider = document.getElementById('agua-osm');
    if (!slider) return;

    const osm = Number(slider.value);
    document.getElementById('agua-osm-valor').textContent = `${osm} mOsm/kg`;

    const lo = 275, hi = 295;
    const frac = Math.max(0, Math.min(1, (osm - lo) / (hi - lo)));
    const adh = Math.round(frac * 100);
    const osmoOrina = Math.round(50 + frac * (1200 - 50));
    const diuresis = (18 - frac * (18 - 0.75)).toFixed(2);

    document.getElementById('agua-adh-barra').style.width = `${adh}%`;
    document.getElementById('agua-osmo-orina').textContent = `${osmoOrina} mOsm/kg`;
    document.getElementById('agua-diuresis').textContent = `${diuresis} L/día`;

    let estado, mensaje;
    if (osm < lo) {
        estado = 'ok';
        mensaje = '✅ ADH suprimida. Sin estímulo osmótico para la sed — el riñón elimina el exceso de agua con una orina muy diluida.';
    } else if (osm < 292) {
        estado = 'ok';
        mensaje = '✅ Rango fisiológico: los osmorreceptores hipotalámicos ajustan la ADH de forma gradual (sensibles a cambios de solo 1-2%).';
    } else if (osm < 295) {
        estado = 'warn';
        mensaje = '⚠️ Umbral de la sed (cambio del 2-3%, ≈290-295 mOsm/kg): el centro de la sed empieza a activarse, además de la ADH.';
    } else {
        estado = 'danger';
        mensaje = '🔴 ADH máxima y sed intensa. El riñón ya concentra al máximo (1200 mOsm/kg) — a partir de aquí, solo aumentar la ingesta de agua puede corregir la osmolalidad; ni la máxima ADH basta por sí sola.';
    }

    const estadoBox = document.getElementById('agua-estado');
    estadoBox.className = `tfg-estado tfg-estado-${estado}`;
    estadoBox.textContent = mensaje;
}

function wireSelectExplicacion(selectId, boxId, datos, render) {
    const select = document.getElementById(selectId);
    const box = document.getElementById(boxId);
    if (!select || !box) return;
    select.addEventListener('change', () => {
        const item = datos[select.value];
        if (!item) {
            box.style.display = 'none';
            return;
        }
        box.style.display = 'block';
        box.innerHTML = render(item);
    });
}

export function init() {
    initCorkboard('fisio-corkboard', 'panel-fisio-tabs');

    const slider = document.getElementById('tfg-pam');
    if (slider) {
        slider.addEventListener('input', calcTfgSimulador);
        calcTfgSimulador();
    }

    const aguaSlider = document.getElementById('agua-osm');
    if (aguaSlider) {
        aguaSlider.addEventListener('input', calcAguaSimulador);
        calcAguaSimulador();
    }

    wireSelectExplicacion('agua-volemia-select', 'agua-volemia-explicacion', hiponatremiaPorVolemia, (item) => `
        <strong>${item.etiqueta}</strong>
        <p>${item.texto}</p>
        <p style="color: var(--text-muted); font-size: 0.75rem;">${item.detalle}</p>
        <p><strong>Tratamiento:</strong> ${item.tratamiento}</p>
    `);

    wireSelectExplicacion('agua-di-select', 'agua-di-explicacion', hipernatremiaDiagnosticoDiferencial, (item) => `
        <strong>${item.etiqueta}</strong>
        <p>${item.texto}</p>
        <p style="color: var(--text-muted); font-size: 0.75rem;">${item.detalle}</p>
        <p><strong>Tratamiento:</strong> ${item.tratamiento}</p>
    `);

    wireSelectExplicacion('k-factor-select', 'k-factor-explicacion', factoresDistribucionPotasio, (item) => `
        <strong>${item.etiqueta}</strong> — <span style="color: var(--accent-yellow);">favorece la ${item.direccion} de K⁺</span>
        <p>${item.texto}</p>
        <p style="color: var(--text-muted); font-size: 0.75rem;">${item.detalle}</p>
    `);

    wireSelectExplicacion('k-sindrome-select', 'k-sindrome-explicacion', sindromesHipopotasemicos, (item) => `
        <strong>${item.etiqueta}</strong>
        <dl class="kv-row"><dt>Herencia</dt><dd>${item.herencia}</dd></dl>
        <dl class="kv-row"><dt>Inicio</dt><dd>${item.inicio}</dd></dl>
        <dl class="kv-row"><dt>Tensión arterial</dt><dd>${item.ta}</dd></dl>
        <dl class="kv-row"><dt>Aldosterona</dt><dd>${item.aldosterona}</dd></dl>
        <dl class="kv-row"><dt>Otras características</dt><dd>${item.otras}</dd></dl>
    `);

    wireSelectExplicacion('k-hiper-select', 'k-hiper-explicacion', mecanismosHiperpotasemia, (item) => `
        <strong>${item.etiqueta}</strong>
        <p>${item.texto}</p>
        <p style="color: var(--text-muted); font-size: 0.75rem;">${item.detalle}</p>
    `);
}
