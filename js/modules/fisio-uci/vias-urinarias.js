import { initCorkboard } from '../../core/corkboard.js';

// Relación inversa creatinina↔TFG (ilustrativa, no una calculadora clínica):
// asumiendo producción de creatinina estable, la depuración es proporcional
// a 1/creatinina, así que creatinina relativa ≈ 100 / TFG relativa × 100.
// El valor se recorta a 400% en el gráfico (la curva ya es prácticamente
// vertical por debajo de TFG 25%) pero el texto sigue mostrando la cifra real.
function calcCreatininaTfgCurva() {
    const slider = document.getElementById('vu-tfg-relativa');
    if (!slider) return;

    const tfg = Number(slider.value);
    document.getElementById('vu-tfg-relativa-valor').textContent = `${tfg}%`;
    document.getElementById('vu-tfg-relativa-out').textContent = `${tfg}%`;

    const crReal = Math.round((100 / tfg) * 100);
    document.getElementById('vu-cr-relativa-out').textContent = `${crReal}%`;

    const crClip = Math.min(400, crReal);
    const x = 20 + ((tfg - 10) / 90) * 260;
    const y = 140 - ((crClip - 100) / 300) * 120;
    const marcador = document.getElementById('vu-tfg-curva-marcador');
    marcador.setAttribute('cx', x.toFixed(1));
    marcador.setAttribute('cy', y.toFixed(1));

    let estado, mensaje;
    if (tfg >= 75) {
        estado = 'ok';
        mensaje = `✅ Creatinina relativa ≈${crReal}% — cambios de TFG en este rango apenas mueven la creatinina, justo lo que explica por qué detecta tarde: hace falta perder ~50% de la TFG antes de que suba de forma clara.`;
    } else if (tfg >= 40) {
        estado = 'warn';
        mensaje = `⚠️ Creatinina relativa ≈${crReal}% — ya se ha perdido una fracción sustancial de la TFG; la pendiente de la curva empieza a acentuarse.`;
    } else {
        estado = 'danger';
        mensaje = `🔴 Creatinina relativa ≈${crReal}% — zona de pendiente muy pronunciada: pequeñas caídas adicionales de TFG producen subidas grandes de creatinina, el rango en el que la LRA establecida suele hacerse evidente en el laboratorio.`;
    }
    const box = document.getElementById('vu-tfg-curva-estado');
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.textContent = mensaje;
}

// Cockcroft-Gault y CKD-EPI (versión 2009, con coeficiente racial) — fórmulas
// literales de la Tabla 6 de esta ficha. Solo para dosificación de fármacos
// en la LRA (aviso KDIGO 2012 ya citado arriba en el texto), nunca para
// estimar la función renal real del paciente crítico.
function calcCockcroftCkdEpi() {
    const pesoEl = document.getElementById('vu-cg-peso');
    const edadEl = document.getElementById('vu-cg-edad');
    const crsEl = document.getElementById('vu-cg-crs');
    const sexoEl = document.getElementById('vu-cg-sexo');
    const razaEl = document.getElementById('vu-cg-raza');
    const cgOut = document.getElementById('vu-cg-resultado');
    const ckdOut = document.getElementById('vu-ckdepi-resultado');
    if (!pesoEl || !edadEl || !crsEl || !sexoEl || !razaEl || !cgOut || !ckdOut) return;

    if ([pesoEl, edadEl, crsEl].some(el => el.value === '')) return;
    const peso = Number(pesoEl.value);
    const edad = Number(edadEl.value);
    const crs = Number(crsEl.value);
    if (!peso || !edad || !crs) return;
    const sexo = sexoEl.value;
    const raza = razaEl.value;

    let ccr = ((140 - edad) * peso) / (crs * 72);
    if (sexo === 'F') ccr *= 0.85;
    cgOut.textContent = `${ccr.toFixed(1)} mL/min`;

    const kappa = sexo === 'F' ? 0.7 : 0.9;
    const alphaLow = sexo === 'F' ? -0.329 : -0.411;
    const alphaHigh = -1.209;
    const A = sexo === 'F'
        ? (raza === 'negra' ? 166 : 144)
        : (raza === 'negra' ? 163 : 141);
    const ratio = crs / kappa;
    const alpha = ratio <= 1 ? alphaLow : alphaHigh;
    const ckdepi = A * Math.pow(ratio, alpha) * Math.pow(0.993, edad);
    ckdOut.textContent = `${ckdepi.toFixed(1)} mL/min/1,73m²`;
}

export function init() {
    initCorkboard('vu-corkboard', 'panel-vu-tabs');

    const tfgSlider = document.getElementById('vu-tfg-relativa');
    if (tfgSlider) {
        tfgSlider.addEventListener('input', calcCreatininaTfgCurva);
        calcCreatininaTfgCurva();
    }

    ['vu-cg-peso', 'vu-cg-edad', 'vu-cg-crs', 'vu-cg-sexo', 'vu-cg-raza'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcCockcroftCkdEpi);
    });
    calcCockcroftCkdEpi();
}
