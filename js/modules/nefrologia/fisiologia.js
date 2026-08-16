// Repaso esquematizado de fisiología renal (cuaderno de campo) + simulador
// interactivo de autorregulación de la TFG. Fuente: Carracedo J, Ramírez R.
// "Fisiología Renal". Nefrología al día (SEN), actualizado 5/10/2020.
import { initCorkboard } from '../../core/corkboard.js';
import {
    hiponatremiaPorVolemia, hipernatremiaDiagnosticoDiferencial,
    factoresDistribucionPotasio, sindromesHipopotasemicos, mecanismosHiperpotasemia,
} from '../../data/agua-potasio-data.js';
import {
    alcalosisMetabolicaPorCloro, hipocalcemiaPorPTH, hipercalcemiaDiferencial,
    fosforoMecanismos, magnesioMecanismos,
} from '../../data/acidobase-cafomg-data.js';

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
        aferente = Math.min(85, 70 + (80 - pam) * 0.5);
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
        aferente = Math.max(20, 40 - exceso * 0.5);
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

// Clasificador de gasometrías con fines didácticos, siguiendo el mismo
// método que describe la fuente (Figura 1 + Tabla 2: comparar el pH con la
// dirección de HCO3-/pCO2, y comprobar si la respuesta secundaria del otro
// parámetro encaja con la compensación esperada). No sustituye el
// razonamiento clínico ante gasometrías complejas.
function calcAcidoBaseClasificador() {
    const phEl = document.getElementById('ab-ph');
    const pco2El = document.getElementById('ab-pco2');
    const hco3El = document.getElementById('ab-hco3');
    const naEl = document.getElementById('ab-na');
    const clEl = document.getElementById('ab-cl');
    const box = document.getElementById('ab-clasificador-resultado');
    if (!phEl || !pco2El || !hco3El || !box) return;

    const ph = Number(phEl.value);
    const pco2 = Number(pco2El.value);
    const hco3 = Number(hco3El.value);
    if (!ph || !pco2 || !hco3) return;

    let estado, mensaje;

    if (ph < 7.35) {
        if (hco3 < 22 && pco2 > 45) {
            estado = 'danger';
            mensaje = `🔴 Trastorno mixto: acidosis metabólica + acidosis respiratoria. El HCO₃⁻ (${hco3}) está bajo y la pCO₂ (${pco2}) alta a la vez — ninguno puede ser la compensación del otro, porque la compensación de una acidosis metabólica es bajar la pCO₂, no subirla.`;
        } else if (hco3 < 22) {
            const lo = 40 - (25 - hco3) * 1.2, hi = 40 - (25 - hco3) * 0.85;
            if (pco2 < lo - 2) {
                estado = 'warn';
                mensaje = `⚠️ Acidosis metabólica + alcalosis respiratoria sobreañadida. Con HCO₃⁻ ${hco3}, la pCO₂ esperada era ${lo.toFixed(0)}-${hi.toFixed(0)} mmHg; la pCO₂ real (${pco2}) está más baja — hiperventilación adicional a la esperada (p. ej. sepsis, salicilatos).`;
            } else if (pco2 > hi + 2) {
                estado = 'warn';
                mensaje = `⚠️ Acidosis metabólica + acidosis respiratoria sobreañadida. Con HCO₃⁻ ${hco3}, la pCO₂ esperada era ${lo.toFixed(0)}-${hi.toFixed(0)} mmHg; la pCO₂ real (${pco2}) no ha bajado lo suficiente — sospechar un componente respiratorio añadido (p. ej. fatiga muscular, sedación).`;
            } else {
                estado = 'ok';
                mensaje = `✅ Acidosis metabólica simple, con compensación respiratoria adecuada (pCO₂ esperada ${lo.toFixed(0)}-${hi.toFixed(0)} mmHg, real ${pco2}). Siguiente paso: calcular el hiato aniónico.`;
            }
        } else if (pco2 > 45) {
            const aguda = 25 + (pco2 - 40) / 10, cronica = 25 + (pco2 - 40) / 10 * 3;
            if (hco3 < aguda - 1.5) {
                estado = 'warn';
                mensaje = `⚠️ Acidosis respiratoria + acidosis metabólica sobreañadida. Con pCO₂ ${pco2}, el HCO₃⁻ esperado era ${aguda.toFixed(1)} (aguda) a ${cronica.toFixed(1)} (crónica); el real (${hco3}) está por debajo de ambos.`;
            } else if (hco3 > cronica + 1.5) {
                estado = 'warn';
                mensaje = `⚠️ Acidosis respiratoria + alcalosis metabólica sobreañadida. El HCO₃⁻ (${hco3}) supera incluso la compensación renal crónica esperada (${cronica.toFixed(1)}).`;
            } else {
                estado = 'ok';
                mensaje = `✅ Acidosis respiratoria (HCO₃⁻ esperado: ${aguda.toFixed(1)} si aguda, ${cronica.toFixed(1)} si crónica — el real, ${hco3}, orienta a cuál de las dos).`;
            }
        } else {
            estado = 'warn';
            mensaje = '⚠️ pH ácido pero HCO₃⁻ y pCO₂ dentro de rango — revisa los valores introducidos o considera un trastorno complejo con varios componentes.';
        }
    } else if (ph > 7.45) {
        if (hco3 > 26 && pco2 < 35) {
            estado = 'danger';
            mensaje = `🔴 Trastorno mixto: alcalosis metabólica + alcalosis respiratoria. El HCO₃⁻ (${hco3}) está alto y la pCO₂ (${pco2}) baja a la vez — ninguno puede ser la compensación del otro.`;
        } else if (hco3 > 26) {
            const esperado = 40 + (hco3 - 25) * 0.7;
            if (Math.abs(pco2 - esperado) > 3) {
                estado = 'warn';
                mensaje = `⚠️ Alcalosis metabólica con compensación fuera de rango. Con HCO₃⁻ ${hco3}, la pCO₂ esperada era ≈${esperado.toFixed(0)} mmHg; la real es ${pco2} — sospechar trastorno respiratorio sobreañadido.`;
            } else {
                estado = 'ok';
                mensaje = `✅ Alcalosis metabólica simple, con compensación respiratoria adecuada (pCO₂ esperada ≈${esperado.toFixed(0)} mmHg). Siguiente paso: valorar volemia/TA y cloro en orina.`;
            }
        } else if (pco2 < 35) {
            const aguda = 25 - (40 - pco2) / 10 * 2.25, cronica = 25 - (40 - pco2) / 10 * 5;
            if (hco3 > aguda + 1.5) {
                estado = 'warn';
                mensaje = `⚠️ Alcalosis respiratoria + alcalosis metabólica sobreañadida. El HCO₃⁻ (${hco3}) está por encima de lo esperado (${aguda.toFixed(1)} aguda, ${cronica.toFixed(1)} crónica).`;
            } else if (hco3 < cronica - 1.5) {
                estado = 'warn';
                mensaje = `⚠️ Alcalosis respiratoria + acidosis metabólica sobreañadida. El HCO₃⁻ (${hco3}) está por debajo incluso de la compensación crónica esperada (${cronica.toFixed(1)}).`;
            } else {
                estado = 'ok';
                mensaje = `✅ Alcalosis respiratoria (HCO₃⁻ esperado: ${aguda.toFixed(1)} si aguda, ${cronica.toFixed(1)} si crónica).`;
            }
        } else {
            estado = 'warn';
            mensaje = '⚠️ pH alcalino pero HCO₃⁻ y pCO₂ dentro de rango — revisa los valores introducidos o considera un trastorno complejo con varios componentes.';
        }
    } else {
        if (hco3 < 22 || hco3 > 26 || pco2 < 35 || pco2 > 45) {
            estado = 'warn';
            mensaje = '⚠️ pH normal pero HCO₃⁻ y/o pCO₂ alterados: sugiere un trastorno mixto que se compensa mutuamente (p. ej. acidosis metabólica + alcalosis respiratoria, o viceversa) — nunca basta con mirar el pH aislado.';
        } else {
            estado = 'ok';
            mensaje = '✅ pH, pCO₂ y HCO₃⁻ dentro de rango normal.';
        }
    }

    // Δ-gap / Δ-ratio opcional: si se aportan Na+ y Cl-, calcula el hiato
    // aniónico y comprueba si un trastorno metabólico adicional se esconde
    // dentro de una acidosis con hiato elevado (p. ej. una alcalosis
    // metabólica o una acidosis normoclorémica sobreañadidas) — método
    // Δ-ratio = (HA − 12) / (24 − HCO3-), complementario a la comparación
    // pCO2/HCO3 de arriba, que por sí sola no detecta este tipo de mixto.
    // Exige ph < 7.35 (trastorno primario ya clasificado como acidosis)
    // además de hco3 < 24, para no activarse con gasometrías de alcalosis
    // respiratoria compensada que también puedan tener HCO3 bajo e hiato
    // aniónico algo elevado — el Δ-ratio solo tiene sentido en el contexto
    // de una acidosis metabólica real.
    if (naEl && clEl && naEl.value && clEl.value && ph < 7.35 && hco3 < 24) {
        const na = Number(naEl.value), cl = Number(clEl.value);
        const hiatoAnionico = na - (cl + hco3);
        if (hiatoAnionico > 12) {
            const deltaRatio = (hiatoAnionico - 12) / (24 - hco3);
            if (deltaRatio < 0.4) {
                mensaje += ` Hiato aniónico ${hiatoAnionico.toFixed(0)} mEq/l (Δ-ratio ${deltaRatio.toFixed(2)}): el HCO₃⁻ ha bajado más de lo que explica el hiato elevado — sugiere una acidosis hiperclorémica (hiato normal) sobreañadida.`;
            } else if (deltaRatio <= 2) {
                mensaje += ` Hiato aniónico ${hiatoAnionico.toFixed(0)} mEq/l (Δ-ratio ${deltaRatio.toFixed(2)}): compatible con una acidosis metabólica con hiato elevado "pura", sin otro trastorno metabólico añadido.`;
            } else {
                mensaje += ` Hiato aniónico ${hiatoAnionico.toFixed(0)} mEq/l (Δ-ratio ${deltaRatio.toFixed(2)}): el HCO₃⁻ ha bajado menos de lo esperado para ese hiato — sugiere una alcalosis metabólica sobreañadida (o una acidosis respiratoria crónica compensada previa).`;
            }
        }
    }

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = mensaje;
}

// Corrección de calcio total por albúmina — fórmula más usada en la
// práctica (Ca corregido = Ca medido + 0,8 × (4 − albúmina)); el propio
// texto de la ficha advierte que el Ca iónico medido directamente es más
// fiable cuando está disponible.
function calcCalcioCorregido() {
    const totalEl = document.getElementById('ca-corr-total');
    const albEl = document.getElementById('ca-corr-albumina');
    const box = document.getElementById('ca-corr-resultado');
    if (!totalEl || !albEl || !box) return;

    const total = Number(totalEl.value);
    const albumina = Number(albEl.value);
    if (!total || !albumina) return;

    const corregido = total + 0.8 * (4 - albumina);
    let estado, interpretacion;
    if (corregido < 8.5) {
        estado = 'danger';
        interpretacion = 'hipocalcemia';
    } else if (corregido > 10.5) {
        estado = 'warn';
        interpretacion = 'hipercalcemia';
    } else {
        estado = 'ok';
        interpretacion = 'rango normal';
    }

    box.style.display = 'block';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = `Ca corregido: ${corregido.toFixed(2)} mg/dl — ${interpretacion} (normal 8,5-10,5 mg/dl).`;
}

// Efecto estimado de 1 litro de suero sobre la natremia (fórmula de
// Adrogué-Madias: ΔNa por litro = (Na infundido + K infundido − Na sérico)
// / (agua corporal total + 1)). Estimación teórica de la respuesta a corto
// plazo — no sustituye la monitorización frecuente del Na+ real que exige
// el propio protocolo de tratamiento de la ficha.
function calcCorreccionSodio() {
    const pesoEl = document.getElementById('correc-peso');
    const sexoEl = document.getElementById('correc-sexo');
    const naEl = document.getElementById('correc-na-actual');
    const sueroEl = document.getElementById('correc-suero');
    const box = document.getElementById('correc-resultado');
    if (!pesoEl || !sexoEl || !naEl || !sueroEl || !box) return;

    const peso = Number(pesoEl.value);
    const coef = Number(sexoEl.value);
    const naActual = Number(naEl.value);
    const opt = sueroEl.selectedOptions[0];
    const naInfusado = Number(opt.value);
    const kInfusado = Number(opt.dataset.k);
    if (!peso || !naActual) return;

    const act = coef * peso;
    const deltaNaPorLitro = (naInfusado + kInfusado - naActual) / (act + 1);

    let estado = 'ok';
    if (Math.abs(deltaNaPorLitro) > 8) estado = 'danger';
    else if (Math.abs(deltaNaPorLitro) > 4) estado = 'warn';

    const signo = deltaNaPorLitro >= 0 ? 'sube' : 'baja';
    let mensaje = `Cada litro de este suero ${signo} el Na⁺ plasmático ≈${Math.abs(deltaNaPorLitro).toFixed(1)} mEq/l (agua corporal total estimada: ${act.toFixed(0)} l).`;
    if (deltaNaPorLitro !== 0) {
        const mlPor1mEq = Math.round(1000 / Math.abs(deltaNaPorLitro));
        mensaje += ` Para cambiar 1 mEq/l se necesitarían ≈${mlPor1mEq} ml.`;
    }
    mensaje += ' Estimación teórica inicial (no predice la diuresis acuosa posterior ni la evolución de la causa subyacente) — usar solo como guía y controlar el Na⁺ real cada 2-4h.';

    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = mensaje;
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

    ['ab-ph', 'ab-pco2', 'ab-hco3', 'ab-na', 'ab-cl'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcAcidoBaseClasificador);
    });

    ['ca-corr-total', 'ca-corr-albumina'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcCalcioCorregido);
    });
    calcCalcioCorregido();

    ['correc-peso', 'correc-na-actual'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcCorreccionSodio);
    });
    ['correc-sexo', 'correc-suero'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calcCorreccionSodio);
    });
    calcCorreccionSodio();

    wireSelectExplicacion('ab-alcalosis-select', 'ab-alcalosis-explicacion', alcalosisMetabolicaPorCloro, (item) => `
        <strong>${item.etiqueta}</strong>
        <dl class="kv-row"><dt>Na en orina</dt><dd>${item.na}</dd></dl>
        <dl class="kv-row"><dt>K en orina</dt><dd>${item.k}</dd></dl>
        <dl class="kv-row"><dt>Cl en orina</dt><dd>${item.cl}</dd></dl>
        <p style="color: var(--text-muted); font-size: 0.75rem;">${item.nota}</p>
    `);

    wireSelectExplicacion('ca-hipo-select', 'ca-hipo-explicacion', hipocalcemiaPorPTH, (item) => `
        <strong>${item.etiqueta}</strong>
        <p>${item.texto}</p>
        <p style="color: var(--text-muted); font-size: 0.75rem;">${item.detalle}</p>
    `);

    wireSelectExplicacion('ca-hiper-select', 'ca-hiper-explicacion', hipercalcemiaDiferencial, (item) => `
        <strong>${item.etiqueta}</strong>
        <dl class="kv-row"><dt>PTH</dt><dd>${item.pth}</dd></dl>
        <dl class="kv-row"><dt>Calcio en orina</dt><dd>${item.cao}</dd></dl>
        <dl class="kv-row"><dt>Vitamina D</dt><dd>${item.vitd}</dd></dl>
        <p>${item.texto}</p>
    `);

    wireSelectExplicacion('p-select', 'p-explicacion', fosforoMecanismos, (item) => `
        <strong>${item.etiqueta}</strong>
        <p>${item.texto}</p>
    `);

    wireSelectExplicacion('mg-select', 'mg-explicacion', magnesioMecanismos, (item) => `
        <strong>${item.etiqueta}</strong>
        <p>${item.texto}</p>
    `);
}
