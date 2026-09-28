// Manual UMI Negrín: manual de orientación interno de la Unidad de
// Medicina Intensiva (Hospital Universitario de Gran Canaria Dr. Negrín),
// consolidado en una única guía con sus 18 fichas. Los enlaces cruzados
// hacia otras especialidades (.especialidad-link) los engancha el listener
// genérico ya existente en home/index.js, no hace falta wiring aquí.
//
// Calculadoras interactivas de las fórmulas reales del manual (todas con
// el guard `.value === ''` ya establecido en el resto del proyecto para
// no tratar un campo vacío como 0).
import { initCorkboard } from '../../core/corkboard.js';

// ---------------------------------------------------------------------
// Ficha II — Electrolitos: TTKG y déficit de K⁺
// ---------------------------------------------------------------------
function calcTTKG() {
    const koEl = document.getElementById('umi-ttkg-ko');
    const osoEl = document.getElementById('umi-ttkg-oso');
    const kpEl = document.getElementById('umi-ttkg-kp');
    const ospEl = document.getElementById('umi-ttkg-osp');
    const box = document.getElementById('umi-ttkg-resultado');
    if (!koEl || !osoEl || !kpEl || !ospEl || !box) return;
    if ([koEl, osoEl, kpEl, ospEl].some(el => el.value === '')) return;
    const ko = Number(koEl.value), oso = Number(osoEl.value), kp = Number(kpEl.value), osp = Number(ospEl.value);
    if ([ko, oso, kp, osp].some(Number.isNaN) || !kp || !oso) return;
    if (oso < osp) {
        box.className = 'tfg-estado tfg-estado-warn';
        box.innerHTML = '⚠️ La orina está menos concentrada que el plasma (Osm orina &lt; Osm plasma) — el TTKG pierde fiabilidad en este contexto, porque asume capacidad renal de dilución/concentración conservada.';
        return;
    }
    const ttkg = (ko * osp) / (kp * oso);
    let estado, interpretacion;
    if (ttkg < 2) {
        estado = 'ok';
        interpretacion = 'sugiere causa extrarrenal (respuesta renal apropiada de conservación de K⁺)';
    } else if (ttkg > 4) {
        estado = 'danger';
        interpretacion = 'sugiere pérdida renal inapropiada de K⁺';
    } else {
        estado = 'warn';
        interpretacion = 'zona intermedia, no discriminativa por sí sola';
    }
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `TTKG ≈ <strong>${ttkg.toFixed(1)}</strong> — ${interpretacion}.<br><span style="font-size:0.75rem;">Cortes &lt;2 / &gt;4 de referencia general para hipopotasemia (no citados explícitamente por el manual, que solo da la fórmula).</span>`;
}

function calcDeficitK() {
    const pesoEl = document.getElementById('umi-defk-peso');
    const krealEl = document.getElementById('umi-defk-kreal');
    const diuresisEl = document.getElementById('umi-defk-diuresis');
    const box = document.getElementById('umi-defk-resultado');
    if (!pesoEl || !krealEl || !box) return;
    if (pesoEl.value === '' || krealEl.value === '') return;
    const peso = Number(pesoEl.value), kreal = Number(krealEl.value);
    const diuresis = diuresisEl && diuresisEl.value !== '' ? Number(diuresisEl.value) : 0;
    if ([peso, kreal, diuresis].some(Number.isNaN) || peso <= 0) return;
    const deficitBase = Math.max(0, 3.5 - kreal) * peso;
    const requerimientos = peso * 1;
    const porDiuresis = 30 * diuresis;
    const total = deficitBase + requerimientos + porDiuresis;
    const estado = kreal < 2.5 ? 'danger' : (kreal < 3.5 ? 'warn' : 'ok');
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `Reposición de K⁺ estimada en 24h: <strong>${total.toFixed(0)} mEq</strong> (déficit ${deficitBase.toFixed(0)} + requerimientos diarios ${requerimientos.toFixed(0)}${diuresis ? ` + ${porDiuresis.toFixed(0)} por diuresis` : ''}) — repartir sin superar 200 mEq/día ni los límites de velocidad de infusión de la tabla de arriba.`;
}

// ---------------------------------------------------------------------
// Ficha III — Nutrición: peso ideal/ajustado, IMC, TEB (Harris-Benedict), CED
// ---------------------------------------------------------------------
function calcNutricion() {
    const sexoEl = document.getElementById('umi-nut-sexo');
    const alturaEl = document.getElementById('umi-nut-altura');
    const pesoEl = document.getElementById('umi-nut-peso');
    const edadEl = document.getElementById('umi-nut-edad');
    const faEl = document.getElementById('umi-nut-fa');
    const box = document.getElementById('umi-nut-resultado');
    if (!sexoEl || !alturaEl || !pesoEl || !edadEl || !faEl || !box) return;
    if ([alturaEl, pesoEl, edadEl].some(el => el.value === '')) return;
    const altura = Number(alturaEl.value), peso = Number(pesoEl.value), edad = Number(edadEl.value);
    const fa = Number(faEl.value);
    if ([altura, peso, edad, fa].some(Number.isNaN) || altura <= 0 || peso <= 0) return;
    const esHombre = sexoEl.value === 'h';
    const pesoIdeal = esHombre ? (0.75 * altura - 62.5) : (0.675 * altura - 56.25);
    const pesoAjustado = peso > pesoIdeal ? 0.25 * (peso - pesoIdeal) + pesoIdeal : pesoIdeal;
    const imc = peso / Math.pow(altura / 100, 2);
    const teb = esHombre
        ? (13.75 * peso) + (5 * altura) - (6.76 * edad) + 66.5
        : (9.56 * peso) + (1.85 * altura) - (4.68 * edad) + 66.5;
    const ced = teb * fa;
    let imcTexto;
    if (imc < 18.5) imcTexto = 'insuficiencia ponderal';
    else if (imc < 25) imcTexto = 'normal';
    else if (imc < 30) imcTexto = 'sobrepeso';
    else if (imc < 35) imcTexto = 'obesidad I';
    else if (imc < 40) imcTexto = 'obesidad II';
    else imcTexto = 'obesidad III';
    box.className = `tfg-estado ${imc >= 30 ? 'tfg-estado-warn' : 'tfg-estado-ok'}`;
    box.innerHTML = `Peso ideal: <strong>${pesoIdeal.toFixed(1)} kg</strong> · Peso ajustado: <strong>${pesoAjustado.toFixed(1)} kg</strong> · IMC: <strong>${imc.toFixed(1)}</strong> (${imcTexto})<br>TEB (Harris-Benedict, con el peso introducido): <strong>${teb.toFixed(0)} kcal/día</strong> · CED = TEB×FA: <strong>${ced.toFixed(0)} kcal/día</strong>${imc >= 30 ? ' — en obesidad, usa el peso ajustado (no el real) en el campo "peso" para un cálculo más fiel.' : ''}`;
}

// ---------------------------------------------------------------------
// Ficha IX — Respirador: PBW y volumen tidal objetivo
// ---------------------------------------------------------------------
function calcPbwVt() {
    const sexoEl = document.getElementById('umi-vt-sexo');
    const alturaEl = document.getElementById('umi-vt-altura');
    const mlkgEl = document.getElementById('umi-vt-mlkg');
    const box = document.getElementById('umi-vt-resultado');
    if (!sexoEl || !alturaEl || !mlkgEl || !box) return;
    if (alturaEl.value === '' || mlkgEl.value === '') return;
    const altura = Number(alturaEl.value), mlkg = Number(mlkgEl.value);
    if ([altura, mlkg].some(Number.isNaN) || altura <= 0) return;
    const pbw = sexoEl.value === 'h' ? (50 + 0.91 * (altura - 152.4)) : (45.5 + 0.91 * (altura - 152.4));
    const vt = pbw * mlkg;
    const estado = mlkg > 8 ? 'danger' : (mlkg > 7 ? 'warn' : 'ok');
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `PBW (peso corporal predicho): <strong>${pbw.toFixed(1)} kg</strong> · Volumen tidal a ${mlkg} ml/kg: <strong>${vt.toFixed(0)} ml</strong>.`;
}

// ---------------------------------------------------------------------
// Ficha X — Extubación: brecha aniónica
// ---------------------------------------------------------------------
function calcAnionGap() {
    const naEl = document.getElementById('umi-ag-na');
    const kEl = document.getElementById('umi-ag-k');
    const clEl = document.getElementById('umi-ag-cl');
    const hco3El = document.getElementById('umi-ag-hco3');
    const box = document.getElementById('umi-ag-resultado');
    if (!naEl || !clEl || !hco3El || !box) return;
    if ([naEl, clEl, hco3El].some(el => el.value === '')) return;
    const na = Number(naEl.value), cl = Number(clEl.value), hco3 = Number(hco3El.value);
    const k = kEl && kEl.value !== '' ? Number(kEl.value) : 0;
    if ([na, cl, hco3, k].some(Number.isNaN)) return;
    const ag = (na + k) - (cl + hco3);
    const estado = ag >= 15 ? 'danger' : 'ok';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `Brecha aniónica${k ? ' (con K⁺)' : ''}: <strong>${ag.toFixed(1)} mEq/l</strong> — ${ag >= 15 ? 'elevada (&gt;15): pensar en metanol, urea, cetosis, paraldehído, isoniacida, hierro, lactato, etanol, salicilato.' : 'dentro del rango normal (&lt;15).'}`;
}

// ---------------------------------------------------------------------
// Ficha XII — Cirugía cardiaca: titulación de heparina por rAPTT
// ---------------------------------------------------------------------
function calcRaptt() {
    const el = document.getElementById('umi-raptt-ratio');
    const box = document.getElementById('umi-raptt-resultado');
    if (!el || !box) return;
    if (el.value === '') return;
    const r = Number(el.value);
    if (Number.isNaN(r) || r < 0) return;
    let estado, accion, control;
    if (r < 1.2) { estado = 'danger'; accion = '80 UI/kg bolo, subir la perfusión (PC) en 4 UI/kg/h'; control = 'repetir APTT a las 6h'; }
    else if (r < 1.5) { estado = 'warn'; accion = '40 UI bolo, subir la PC en 2 UI/kg/h'; control = 'repetir APTT a las 6h'; }
    else if (r <= 2.3) { estado = 'ok'; accion = 'sin cambios'; control = 'APTT a las 24h'; }
    else if (r <= 3) { estado = 'warn'; accion = 'bajar la PC en 2 UI/kg/h'; control = 'repetir APTT a las 6h'; }
    else { estado = 'danger'; accion = 'detener la PC 1h, luego bajar en 3 UI/kg/h'; control = 'repetir APTT a las 6h'; }
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `rAPTT ${r.toFixed(2)} (objetivo 1,5-2,3): <strong>${accion}</strong> — ${control}.`;
}

// ---------------------------------------------------------------------
// Ficha XIII — Hemodinámica invasiva
// ---------------------------------------------------------------------
function calcHemodinamica() {
    const ids = ['umi-hemo-pas', 'umi-hemo-pad', 'umi-hemo-pvc', 'umi-hemo-gc', 'umi-hemo-sc', 'umi-hemo-hb', 'umi-hemo-sat'];
    const els = {};
    for (const id of ids) {
        els[id] = document.getElementById(id);
        if (!els[id]) return;
    }
    const box = document.getElementById('umi-hemo-resultado');
    if (!box) return;
    if (ids.some(id => els[id].value === '')) return;
    const pas = Number(els['umi-hemo-pas'].value);
    const pad = Number(els['umi-hemo-pad'].value);
    const pvc = Number(els['umi-hemo-pvc'].value);
    const gc = Number(els['umi-hemo-gc'].value);
    const sc = Number(els['umi-hemo-sc'].value);
    const hb = Number(els['umi-hemo-hb'].value);
    const sat = Number(els['umi-hemo-sat'].value);
    if ([pas, pad, pvc, gc, sc, hb, sat].some(Number.isNaN) || gc <= 0 || sc <= 0) return;
    if (pad > pas) {
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '⚠️ Combinación no fisiológica: la PA diastólica no puede superar a la sistólica. Revisa los datos.';
        return;
    }
    if (sat > 100 || sat < 0) {
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '⚠️ La SatO₂ arterial debe estar entre 0 y 100%.';
        return;
    }

    const pam = pad + (pas - pad) / 3;
    const ic = gc / sc;
    const rvs = ((pam - pvc) / gc) * 80;
    const do2 = gc * (1.34 * hb * (sat / 100)) * 10;
    const do2i = do2 / sc;

    let resultado = `PAM: <strong>${pam.toFixed(0)} mmHg</strong> · IC: <strong>${ic.toFixed(2)} L/min/m²</strong> · RVS: <strong>${rvs.toFixed(0)} dina·s·cm⁻⁵</strong> · DO₂: <strong>${do2.toFixed(0)} ml/min</strong> (DO₂I ${do2i.toFixed(0)} ml/min/m²)`;

    const satvEl = document.getElementById('umi-hemo-satv');
    if (satvEl && satvEl.value !== '') {
        const satv = Number(satvEl.value);
        if (!Number.isNaN(satv)) {
            if (satv > sat) {
                resultado += '<br>⚠️ La SatVO₂ no puede superar a la SatO₂ arterial — revisa los datos.';
            } else {
                const vo2 = ic * 1.34 * hb * ((sat - satv) / 100) * 10;
                resultado += `<br>VO₂: <strong>${vo2.toFixed(0)} ml/min/m²</strong>`;
            }
        }
    }

    const pmapEl = document.getElementById('umi-hemo-pmap');
    const poapEl = document.getElementById('umi-hemo-poap');
    if (pmapEl && poapEl && pmapEl.value !== '' && poapEl.value !== '') {
        const pmap = Number(pmapEl.value), poap = Number(poapEl.value);
        if (!Number.isNaN(pmap) && !Number.isNaN(poap)) {
            const rvp = ((pmap - poap) * 80) / gc;
            resultado += `<br>RVP: <strong>${rvp.toFixed(0)} dina·s·cm⁻⁵</strong>`;
        }
    }

    let estado = 'ok';
    if (pam < 65) estado = 'danger';
    else if (pam < 70) estado = 'warn';
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = resultado;
}

// ---------------------------------------------------------------------
// Ficha XIV — FATE: fracción de acortamiento/FEVI e índice de VCI
// ---------------------------------------------------------------------
function calcFsFevi() {
    const lvddEl = document.getElementById('umi-fs-lvdd');
    const lvsdEl = document.getElementById('umi-fs-lvsd');
    const box = document.getElementById('umi-fs-resultado');
    if (!lvddEl || !lvsdEl || !box) return;
    if (lvddEl.value === '' || lvsdEl.value === '') return;
    const lvdd = Number(lvddEl.value), lvsd = Number(lvsdEl.value);
    if ([lvdd, lvsd].some(Number.isNaN) || lvdd <= 0) return;
    if (lvsd >= lvdd) {
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '⚠️ Combinación no fisiológica: el diámetro sistólico no puede ser mayor o igual al diastólico. Revisa los datos.';
        return;
    }
    const fs = (lvdd - lvsd) / lvdd;
    const fevi = Math.min(100, fs * 2 * 100);
    const estado = fevi >= 50 ? 'ok' : (fevi >= 40 ? 'warn' : 'danger');
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = `FS: <strong>${(fs * 100).toFixed(0)}%</strong> · FEVI estimada (≈2×FS): <strong>${fevi.toFixed(0)}%</strong>.`;
}

function calcVciColapso() {
    const modoEl = document.getElementById('umi-vci-modo');
    const dmaxEl = document.getElementById('umi-vci-dmax');
    const dminEl = document.getElementById('umi-vci-dmin');
    const box = document.getElementById('umi-vci-resultado');
    if (!modoEl || !dmaxEl || !dminEl || !box) return;
    if (dmaxEl.value === '' || dminEl.value === '') return;
    const dmax = Number(dmaxEl.value), dmin = Number(dminEl.value);
    if ([dmax, dmin].some(Number.isNaN) || dmax <= 0) return;
    if (dmin > dmax) {
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '⚠️ El diámetro mínimo no puede ser mayor que el máximo. Revisa los datos.';
        return;
    }
    const modo = modoEl.value;
    let icvci, corte, etiqueta;
    if (modo === 'espontanea') {
        icvci = ((dmax - dmin) / dmax) * 100;
        corte = 40; etiqueta = 'ventilación espontánea';
    } else if (modo === 'vm-sin-esfuerzo') {
        icvci = dmin > 0 ? ((dmax - dmin) * 100) / dmin : NaN;
        corte = 18; etiqueta = 'VM sin esfuerzo respiratorio';
    } else {
        icvci = ((dmax - dmin) * 100) / (0.5 * (dmin + dmax));
        corte = 12; etiqueta = 'VM, fórmula general';
    }
    if (Number.isNaN(icvci) || !Number.isFinite(icvci)) return;
    const respondedor = icvci > corte;
    box.className = `tfg-estado tfg-estado-${respondedor ? 'warn' : 'ok'}`;
    box.innerHTML = `Índice de colapsabilidad (${etiqueta}): <strong>${icvci.toFixed(0)}%</strong> — ${respondedor ? `&gt;${corte}%, sugiere respuesta a volumen` : `≤${corte}%, no sugiere respuesta a volumen`}.`;
}

// ---------------------------------------------------------------------
// Ficha XV — Marcapasos: constructor del código NBG
// ---------------------------------------------------------------------
const NBG_DESC = {
    1: { A: 'la aurícula', V: 'el ventrículo', D: 'aurícula y ventrículo (doble)', S: 'una única cavidad (single)' },
    2: { A: 'la aurícula', V: 'el ventrículo', D: 'aurícula y ventrículo (doble)', S: 'una única cavidad (single)' },
    3: { T: 'disparado (trigger)', I: 'inhibido', D: 'disparado + inhibido' },
    4: { C: 'comunicación/telemetría', P: 'mono o biprogramable', M: 'multiprogramable', R: 'frecuencia variable (adaptativa)' },
    5: { P: 'estimulación antitaquicardia', S: 'choque', D: 'estimulación + choque' },
};

function actualizarNbg() {
    const ids = ['umi-nbg-1', 'umi-nbg-2', 'umi-nbg-3', 'umi-nbg-4', 'umi-nbg-5'];
    const els = ids.map(id => document.getElementById(id));
    const box = document.getElementById('umi-nbg-resultado');
    if (els.some(el => !el) || !box) return;
    const [v1, v2, v3, v4, v5] = els.map(el => el.value);
    if (!v1 || !v2 || !v3) {
        box.className = 'tfg-estado tfg-estado-warn';
        box.innerHTML = 'Elige al menos las 3 primeras posiciones (estimulación, detección, respuesta) para construir el código.';
        return;
    }
    let codigo = v1 + v2 + v3;
    const descripciones = [
        `${v1} = estimula ${NBG_DESC[1][v1]}`,
        `${v2} = detecta en ${NBG_DESC[2][v2]}`,
        `${v3} = respuesta ${NBG_DESC[3][v3]}`,
    ];
    if (v4) { codigo += v4; descripciones.push(`${v4} = ${NBG_DESC[4][v4]}`); }
    if (v5) { codigo += v5; descripciones.push(`${v5} = antitaquicardia por ${NBG_DESC[5][v5]}`); }
    box.className = 'tfg-estado tfg-estado-ok';
    box.innerHTML = `Código: <strong>${codigo}</strong><br><span style="font-size:0.8rem;">${descripciones.join(' · ')}</span>`;
}

// ---------------------------------------------------------------------
// Ficha XVIII — Glucemia: dosis por pauta móvil SC y por algoritmo IV
// ---------------------------------------------------------------------
const TABLA_INSULINA_IV = [
    { min: 61, max: 119, dosis: [0, 0, 0, 0, 0.5, 0.5] },
    { min: 120, max: 149, dosis: [0, 0.5, 1, 1.5, 2, 3] },
    { min: 150, max: 179, dosis: [0.5, 1, 2, 3, 4, 5] },
    { min: 180, max: 209, dosis: [1, 1.5, 3, 4, 6, 8] },
    { min: 210, max: 239, dosis: [1.5, 2, 4, 6, 9, 12] },
    { min: 240, max: 269, dosis: [2, 3, 5, 8, 12, 16] },
    { min: 270, max: 299, dosis: [3, 4, 6, 10, 16, 22] },
    { min: 300, max: 349, dosis: [4, 5, 8, 12, 20, 28] },
    { min: 350, max: 400, dosis: [5, 6, 10, 16, 24, 36] },
    { min: 401, max: Infinity, dosis: [6, 7, 12, 20, 30, 44] },
];

function dosisSC(gluc) {
    if (gluc < 151) return 0;
    if (gluc <= 180) return 4;
    if (gluc <= 200) return 6;
    if (gluc <= 250) return 8;
    if (gluc <= 300) return 10;
    if (gluc <= 350) return 12;
    return null;
}

function calcInsulinaDosis() {
    const algEl = document.getElementById('umi-ins-algoritmo');
    const glucEl = document.getElementById('umi-ins-glucemia');
    const box = document.getElementById('umi-ins-resultado');
    if (!algEl || !glucEl || !box) return;
    if (glucEl.value === '') return;
    const gluc = Number(glucEl.value);
    if (Number.isNaN(gluc)) return;
    if (gluc < 60) {
        box.className = 'tfg-estado tfg-estado-danger';
        box.innerHTML = '⚠️ Hipoglucemia (&lt;60 mg/dl) — ninguna de las 2 tablas aplica, actuar según el protocolo de hipoglucemia.';
        return;
    }
    const algIdx = Number(algEl.value);
    const filaIv = TABLA_INSULINA_IV.find(f => gluc >= f.min && gluc <= f.max);
    const dosisIv = filaIv ? filaIv.dosis[algIdx] : null;

    const scDosis = dosisSC(gluc);
    const scTexto = scDosis === null ? '<strong>AVISAR</strong> (fuera de rango)' : `<strong>${scDosis} UI</strong>`;

    box.className = `tfg-estado ${scDosis === null && dosisIv === null ? 'tfg-estado-danger' : 'tfg-estado-ok'}`;
    box.innerHTML = `Pauta móvil subcutánea: ${scTexto}<br>Perfusión IV, Algoritmo ${['I', 'II', 'III', 'IV', 'V', 'VI'][algIdx]}: <strong>${dosisIv !== null ? dosisIv + ' UI/h' : '—'}</strong>`;
}

export function init() {
    initCorkboard('manual-umi-corkboard', 'panel-manual-umi-tabs');

    ['umi-ttkg-ko', 'umi-ttkg-oso', 'umi-ttkg-kp', 'umi-ttkg-osp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcTTKG);
    });
    calcTTKG();

    ['umi-defk-peso', 'umi-defk-kreal', 'umi-defk-diuresis'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcDeficitK);
    });
    calcDeficitK();

    ['umi-nut-sexo', 'umi-nut-altura', 'umi-nut-peso', 'umi-nut-edad', 'umi-nut-fa'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcNutricion);
    });
    calcNutricion();

    ['umi-vt-sexo', 'umi-vt-altura', 'umi-vt-mlkg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcPbwVt);
    });
    calcPbwVt();

    ['umi-ag-na', 'umi-ag-k', 'umi-ag-cl', 'umi-ag-hco3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcAnionGap);
    });
    calcAnionGap();

    const rapttEl = document.getElementById('umi-raptt-ratio');
    if (rapttEl) rapttEl.addEventListener('input', calcRaptt);
    calcRaptt();

    ['umi-hemo-pas', 'umi-hemo-pad', 'umi-hemo-pvc', 'umi-hemo-gc', 'umi-hemo-sc', 'umi-hemo-hb', 'umi-hemo-sat', 'umi-hemo-satv', 'umi-hemo-pmap', 'umi-hemo-poap'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcHemodinamica);
    });
    calcHemodinamica();

    ['umi-fs-lvdd', 'umi-fs-lvsd'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcFsFevi);
    });
    calcFsFevi();

    ['umi-vci-modo', 'umi-vci-dmax', 'umi-vci-dmin'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcVciColapso);
    });
    calcVciColapso();

    ['umi-nbg-1', 'umi-nbg-2', 'umi-nbg-3', 'umi-nbg-4', 'umi-nbg-5'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', actualizarNbg);
    });
    actualizarNbg();

    ['umi-ins-algoritmo', 'umi-ins-glucemia'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcInsulinaDosis);
    });
    calcInsulinaDosis();
}
