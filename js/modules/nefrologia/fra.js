// Repaso esquematizado de Insuficiencia Renal Aguda (cuaderno de campo) +
// calculadora de estadio KDIGO (por creatinina) y de FENa/IFR. Fuente:
// Rodríguez Benítez P, Ramos Terrades N, Poch E. Insuficiencia Renal
// Aguda. Nefrología al día (SEN), actualizado 22/9/2025.
import { initCorkboard } from '../../core/corkboard.js';

// Clasificador orientativo de estadio KDIGO (Tabla 1 de la fuente),
// basado únicamente en el criterio de creatinina (delta absoluto o razón
// sobre la basal) — el criterio de diuresis, dependiente del tiempo y
// restringido a UCI, no se recrea aquí y puede elevar el estadio de
// forma independiente.
function calcEstadioKdigo() {
    const basalEl = document.getElementById('fra-cr-basal');
    const actualEl = document.getElementById('fra-cr-actual');
    const box = document.getElementById('fra-estadio-resultado');
    if (!basalEl || !actualEl || !box) return;

    const basal = Number(basalEl.value);
    const actual = Number(actualEl.value);
    if (!basal || !actual) return;

    const delta = actual - basal;
    const razon = actual / basal;

    let estadio = 0;
    if (razon >= 3 || actual >= 4) estadio = 3;
    else if (razon >= 2) estadio = 2;
    else if (delta >= 0.3 || razon >= 1.5) estadio = 1;

    let estado, mensaje;
    if (estadio === 0) {
        estado = 'ok';
        mensaje = `Δcreatinina ${delta.toFixed(2)} mg/dl (razón ${razon.toFixed(2)}× la basal) — no cumple criterio de creatinina de la Tabla 1 KDIGO. Recuerda que el criterio de diuresis puede establecer un estadio de forma independiente.`;
    } else if (estadio === 1) {
        estado = 'warn';
        mensaje = `Δcreatinina ${delta.toFixed(2)} mg/dl (razón ${razon.toFixed(2)}× la basal) — compatible con Estadio 1 por criterio de creatinina.`;
    } else if (estadio === 2) {
        estado = 'warn';
        mensaje = `Δcreatinina ${delta.toFixed(2)} mg/dl (razón ${razon.toFixed(2)}× la basal) — compatible con Estadio 2 por criterio de creatinina.`;
    } else {
        estado = 'danger';
        mensaje = `Δcreatinina ${delta.toFixed(2)} mg/dl (razón ${razon.toFixed(2)}× la basal) — compatible con Estadio 3 por criterio de creatinina.`;
    }

    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = mensaje;
}

// FENa = [(Nao x Crs)/(Nas x Cro)] x 100; IFR = (Crs x Nao)/Cro — fórmulas
// literales de la Tabla 3 de la fuente. La interpretación automática se
// basa solo en la FENa (cortes <1%/>2% inequívocos en la fuente); el IFR
// se muestra como dato adicional sin veredicto automático porque la
// propia Tabla 3 no lo discrimina con un corte distinto entre hipoperfusión
// y NTA (ver nota en fra.html).
function calcFenaIfr() {
    const naoEl = document.getElementById('fra-na-orina');
    const nasEl = document.getElementById('fra-na-serico');
    const croEl = document.getElementById('fra-cr-orina');
    const crsEl = document.getElementById('fra-cr-serica');
    const box = document.getElementById('fra-fena-resultado');
    if (!naoEl || !nasEl || !croEl || !crsEl || !box) return;

    const nao = Number(naoEl.value);
    const nas = Number(nasEl.value);
    const cro = Number(croEl.value);
    const crs = Number(crsEl.value);
    if (!nao || !nas || !cro || !crs) return;

    const fena = ((nao * crs) / (nas * cro)) * 100;
    const ifr = (crs * nao) / cro;

    let estado, interpretacion;
    if (fena < 1) {
        estado = 'ok';
        interpretacion = 'sugiere IRA por hipoperfusión (prerrenal)';
    } else if (fena > 2) {
        estado = 'danger';
        interpretacion = 'sugiere necrosis tubular aguda (NTA)';
    } else {
        estado = 'warn';
        interpretacion = 'zona intermedia, no discriminativa por sí sola';
    }

    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `FENa: <strong>${fena.toFixed(2)}%</strong> — ${interpretacion}. IFR: <strong>${ifr.toFixed(2)}%</strong> (dato adicional). Ambos índices pierden fiabilidad bajo tratamiento diurético.`;
}

export function init() {
    initCorkboard('fra-corkboard', 'panel-fra-tabs');

    ['fra-cr-basal', 'fra-cr-actual'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcEstadioKdigo);
    });
    calcEstadioKdigo();

    ['fra-na-orina', 'fra-na-serico', 'fra-cr-orina', 'fra-cr-serica'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcFenaIfr);
    });
    calcFenaIfr();
}
