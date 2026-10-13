// Manual UMI Negrín: manual de orientación interno de la Unidad de
// Medicina Intensiva (Hospital Universitario de Gran Canaria Dr. Negrín),
// consolidado en una única guía con sus 30 fichas (las 12 últimas, XIX-XXX,
// son el bloque neurocrítico y la meningitis). Los enlaces cruzados
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
    const requerimientos = peso; // 1 mEq/kg/día
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

// ---------------------------------------------------------------------
// Bloque neurocrítico (Fichas XIX-XXX)
// ---------------------------------------------------------------------
function pintar(box, estado, html) {
    box.className = `tfg-estado tfg-estado-${estado}`;
    box.innerHTML = html;
}

// Lee un campo numérico; null si está vacío o no es un número (nunca 0 por un campo vacío).
function leerNumero(id) {
    const el = document.getElementById(id);
    if (!el || el.value === '') return null;
    const n = Number(el.value);
    return Number.isNaN(n) ? null : n;
}

const RASS_TEXTO = {
    4: 'Combativo', 3: 'Muy agitado', 2: 'Agitado', 1: 'Ansioso', 0: 'Alerta y tranquilo',
    '-1': 'Adormilado', '-2': 'Sedación ligera', '-3': 'Sedación moderada',
    '-4': 'Sedación profunda', '-5': 'Sedación muy profunda',
};

// Ficha XIX — la RASS en los 3 pasos del manual: cada paso solo aparece
// si el anterior no ha dado ya la puntuación.
function calcRass() {
    const p1 = document.getElementById('umi-rass-paso1');
    const p2 = document.getElementById('umi-rass-paso2');
    const p3 = document.getElementById('umi-rass-paso3');
    const g2 = document.getElementById('umi-rass-grupo2');
    const g3 = document.getElementById('umi-rass-grupo3');
    const box = document.getElementById('umi-rass-resultado');
    if (!p1 || !p2 || !p3 || !g2 || !g3 || !box) return;
    g2.hidden = p1.value !== 'no';
    g3.hidden = g2.hidden || p2.value !== 'no';
    let valor = null;
    if (p1.value !== '' && p1.value !== 'no') valor = p1.value;
    else if (!g2.hidden && p2.value !== '' && p2.value !== 'no') valor = p2.value;
    else if (!g3.hidden && p3.value !== '') valor = p3.value;
    if (valor === null) {
        const paso = g2.hidden ? 'qué ves al observarle' : (g3.hidden ? 'qué hace al llamarle' : 'qué hace al estimularle');
        pintar(box, 'ok', `Elige ${paso}.`);
        return;
    }
    const n = Number(valor);
    const estado = n >= 2 || n <= -4 ? 'danger' : (n === 0 ? 'ok' : 'warn');
    const signo = n > 0 ? `+${n}` : `${n}`;
    pintar(box, estado, `RASS <strong>${signo}</strong> — ${RASS_TEXTO[valor]}.`);
}

// Ficha XXI — indicación de monitorizar la PIC en el TCE grave.
function calcIndicacionPic() {
    const tac = document.getElementById('umi-pic-tac');
    const crit = document.getElementById('umi-pic-criterios');
    const box = document.getElementById('umi-pic-resultado');
    if (!tac || !crit || !box) return;
    crit.hidden = tac.value !== 'normal';
    if (tac.value !== 'normal') {
        pintar(box, 'danger', '<strong>Monitorizar la PIC</strong>: TCE grave con TAC patológica (nivel II).');
        return;
    }
    const n = ['umi-pic-edad', 'umi-pic-focal', 'umi-pic-tas'].filter(id => document.getElementById(id)?.checked).length;
    if (n >= 2) pintar(box, 'warn', `<strong>Monitorizar la PIC</strong>: TAC normal con ${n} de 3 criterios al ingreso (nivel III).`);
    else pintar(box, 'ok', `TAC normal con ${n} de 3 criterios: por este motivo no está indicada (hacen falta 2). Revisa las otras indicaciones de la lista.`);
}

// Ficha XXI — PPC = PAM − PIC (fisiología general) contra los umbrales del manual.
function calcPpc() {
    const pam = leerNumero('umi-ppc-pam');
    const pic = leerNumero('umi-ppc-pic');
    const box = document.getElementById('umi-ppc-resultado');
    if (!box || pam === null || pic === null) return;
    const ppc = pam - pic;
    const avisos = [];
    if (pic > 20) avisos.push('PIC &gt;20 mmHg (factor de mal pronóstico)');
    let estado = 'ok';
    if (ppc < 50) { estado = 'danger'; avisos.unshift('PPC &lt;50 mmHg: el manual pide evitarla (nivel III)'); }
    else if (ppc < 70) { estado = 'warn'; avisos.unshift('PPC &lt;70 mmHg (factor de mal pronóstico)'); }
    if (pic > 20 && estado === 'ok') estado = 'warn';
    pintar(box, estado, `PPC = <strong>${ppc} mmHg</strong>.${avisos.length ? '<br>' + avisos.join('<br>') : ''}`);
}

// Ficha XXII — la onda de PIC entre las 2 de la figura del manual: P2 pasa
// de ser menor que P1 (cráneo distensible) a dominar la onda (cráneo rígido).
// x del dibujo: los picos se definen en 36-190 y se estiran al ancho del eje (36-290).
const xPic = x => 36 + (x - 36) * 1.65;

function curvaPic(t) {
    // t = 1 buena distensibilidad, 0 baja. Altura de cada pico.
    const h1 = 95, h2 = 52 + (1 - t) * 58, h3 = 42 + (1 - t) * 26;
    const pts = [
        [36, 128], [56, 128 - h1 * 0.55], [64, 128 - h1],
        [74, 128 - Math.min(h1, h2) * 0.78], [86, 128 - h2], [96, 128 - (h2 + h3) / 2 * 0.92],
        [110, 128 - h3], [140, 128 - h3 * 0.45], [170, 126], [190, 128],
    ].map(([x, y]) => [xPic(x), y]);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const cx = ((x0 + x1) / 2).toFixed(1);
        d += ` C${cx},${y0.toFixed(1)} ${cx},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    return { d, picos: [[64, 128 - h1], [86, 128 - h2], [110, 128 - h3]], p2p1: h2 / h1 };
}

function calcOndaPic() {
    const slider = document.getElementById('umi-pic-dist');
    const path = document.getElementById('umi-pic-path');
    const box = document.getElementById('umi-pic-onda-resultado');
    if (!slider || !path || !box) return;
    const t = Number(slider.value) / 100;
    const c = curvaPic(t);
    path.setAttribute('d', c.d);
    c.picos.forEach(([x, y], i) => {
        const l = document.getElementById(`umi-pic-l${i + 1}`);
        if (l) { l.setAttribute('x', (xPic(x) - 6).toFixed(1)); l.setAttribute('y', (y - 6).toFixed(1)); }
    });
    const valor = document.getElementById('umi-pic-dist-valor');
    if (valor) valor.textContent = t > 0.66 ? 'Buena' : (t > 0.33 ? 'Disminuyendo' : 'Baja');
    if (c.p2p1 < 0.85) pintar(box, 'ok', 'P1 domina la onda: cráneo con <strong>buena distensibilidad</strong> (onda de presión normal).');
    else if (c.p2p1 <= 1) pintar(box, 'warn', 'P2 se acerca a P1: la distensibilidad está bajando.');
    else pintar(box, 'danger', 'P2 supera a P1: cráneo con <strong>baja distensibilidad</strong> (onda de alta presión).');
}

// Ficha XXIII — índice de Evans.
function calcEvans() {
    const a = leerNumero('umi-evans-a');
    const b = leerNumero('umi-evans-b');
    const box = document.getElementById('umi-evans-resultado');
    if (!box || a === null || b === null || b <= 0) return;
    if (a >= b) {
        pintar(box, 'warn', '⚠️ Los cuernos frontales no pueden medir más que el diámetro biparietal: revisa los datos.');
        return;
    }
    const ie = a / b;
    if (ie > 0.3) pintar(box, 'danger', `Índice de Evans <strong>${ie.toFixed(2)}</strong> — &gt;0,3: hidrocefalia.`);
    else pintar(box, 'ok', `Índice de Evans <strong>${ie.toFixed(2)}</strong> — ≤0,3: no cumple el criterio de hidrocefalia.`);
}

// Ficha XXIV — volumen de cada dosis de t-PA intraventricular.
function calcFibrinolisis() {
    const dosis = leerNumero('umi-fiv-dosis');
    const conc = leerNumero('umi-fiv-conc');
    const box = document.getElementById('umi-fiv-resultado');
    if (!box || dosis === null || conc === null || conc <= 0 || dosis <= 0) return;
    const vol = dosis / conc;
    const avisos = [];
    let estado = 'ok';
    if (conc > 4) { estado = 'danger'; avisos.push('la concentración máxima es 4 mg/ml'); }
    if (dosis > 8) { estado = 'danger'; avisos.push('la dosis máxima es 8 mg (todos los ventrículos ocupados)'); }
    else if (dosis > 5 && estado === 'ok') { estado = 'warn'; avisos.push('por encima de la dosis habitual de 3-5 mg'); }
    else if (dosis < 3 && estado === 'ok') { estado = 'warn'; avisos.push('por debajo del rango de 3-8 mg'); }
    pintar(box, estado, `Volumen a inyectar: <strong>${vol.toFixed(1)} ml</strong> — retira antes el mismo volumen de LCR.${avisos.length ? '<br>⚠️ ' + avisos.join('; ') + '.' : ''}`);
}

// Ficha XXVI — Marshall con los cortes originales (>5 mm, 25 cc).
const MARSHALL = {
    I: ['Lesión difusa I', 'sin incidencia citada', 'ok'],
    II: ['Lesión difusa II', '28,6%', 'ok'],
    III: ['Lesión difusa III (swelling)', '63,2%', 'warn'],
    IV: ['Lesión difusa IV (desviación)', '100%', 'danger'],
    evacuada: ['Masa evacuada', '65,2%', 'warn'],
    noEvacuada: ['Masa no evacuada', '84,6%', 'danger'],
};

function calcMarshall() {
    const v = id => document.getElementById(id)?.value;
    const box = document.getElementById('umi-mar-resultado');
    if (!box) return;
    let tipo;
    if (v('umi-mar-evacuada') === 'si') tipo = 'evacuada';
    else if (v('umi-mar-masa') === 'si') tipo = 'noEvacuada';
    else if (v('umi-mar-desv') === '5') tipo = 'IV';
    else if (v('umi-mar-cisternas') === 'ausentes') tipo = 'III';
    else if (v('umi-mar-lesiones') === 'si') tipo = 'II';
    else tipo = 'I';
    const [nombre, htic, estado] = MARSHALL[tipo];
    pintar(box, estado, `<strong>${nombre}</strong> — incidencia de HTIC: ${htic}.`);
}

// Ficha XXVII — índice de Lindegaard con los cortes del algoritmo del manual.
function calcLindegaard() {
    const acm = leerNumero('umi-lin-acm');
    const aci = leerNumero('umi-lin-aci');
    const box = document.getElementById('umi-lin-resultado');
    if (!box || acm === null || aci === null || aci <= 0) return;
    const li = acm / aci;
    let estado, texto;
    if (acm < 120) { estado = 'ok'; texto = 'Fvm de la ACM &lt;120 cm/s: baja probabilidad de vasoespasmo.'; }
    else if (acm > 200) { estado = 'danger'; texto = 'Fvm de la ACM &gt;200 cm/s: alta probabilidad de vasoespasmo.'; }
    else if (li < 3) { estado = 'ok'; texto = 'Lindegaard &lt;3: baja probabilidad de vasoespasmo (la velocidad alta orienta a hiperemia).'; }
    else if (li <= 6) { estado = 'warn'; texto = 'Lindegaard 3-6: probabilidad de vasoespasmo indeterminada.'; }
    else { estado = 'danger'; texto = 'Lindegaard &gt;6: alta probabilidad de vasoespasmo.'; }
    pintar(box, estado, `Lindegaard = <strong>${li.toFixed(1)}</strong>.<br>${texto}`);
}

// Ficha XXVIII — vaina del nervio óptico.
function calcOnsd() {
    const mm = leerNumero('umi-onsd-mm');
    const box = document.getElementById('umi-onsd-resultado');
    if (!box || mm === null) return;
    if (mm > 5) pintar(box, 'danger', `DVNO <strong>${mm.toFixed(1)} mm</strong> — &gt;5 mm: sugiere PIC &gt;20 mmHg.`);
    else pintar(box, 'ok', `DVNO <strong>${mm.toFixed(1)} mm</strong> — ≤5 mm: no cumple el criterio de PIC &gt;20 mmHg.`);
}

// Ficha XXIX — Rankin sale de la ayuda que necesita; la GOS, de la vida
// independiente y la vuelta al trabajo (se preguntan aparte, sin deducir una de otra).
const RANKIN = { r0: 0, r1: 1, r2: 2, r3: 3, r4: 4, r5: 5, veg: 5, muerte: 6 };

function calcResultado() {
    const sit = document.getElementById('umi-res-situacion')?.value;
    const indep = document.getElementById('umi-res-indep')?.value;
    const trabajo = document.getElementById('umi-res-trabajo')?.value;
    const box = document.getElementById('umi-res-resultado');
    if (!box) return;
    if (!sit) { pintar(box, 'ok', 'Elige cómo está el paciente.'); return; }
    const rankin = RANKIN[sit];
    let gos;
    if (sit === 'muerte') gos = 1;
    else if (sit === 'veg') gos = 2;
    else if (indep === 'no') gos = 3;
    else gos = trabajo === 'si' ? 5 : 4;
    const estado = rankin >= 4 ? 'danger' : (rankin === 3 ? 'warn' : 'ok');
    const nota = sit === 'veg'
        ? '<br><span style="font-size:0.75rem;">Rankin no tiene un grado propio de estado vegetativo; su grado 5 (encamado, atención constante) es el más cercano.</span>'
        : '';
    pintar(box, estado, `Rankin modificada <strong>${rankin}</strong> · GOS <strong>${gos}</strong>${nota}`);
}

// Ficha XXX — criterios de Lozier.
function calcLozier() {
    const micro = document.getElementById('umi-loz-micro')?.value;
    const bioq = document.getElementById('umi-loz-bioq')?.value;
    const clin = document.getElementById('umi-loz-clinica')?.value;
    const box = document.getElementById('umi-loz-resultado');
    if (!box) return;
    const pos = micro !== 'neg';
    if (bioq === 'alterada') {
        if (clin === 'meningitis') return pintar(box, 'danger', '<strong>Ventriculitis</strong>: alteraciones bioquímicas y microbiológicas con fiebre alta y signos de meningitis.');
        if (pos && clin === 'otro') return pintar(box, 'danger', '<strong>Infección relacionada con la derivación</strong>: bioquímica alterada, Gram o cultivo positivo y un síntoma distinto de la fiebre.');
        return pintar(box, 'warn', `<strong>Sospecha de infección relacionada con el DVE</strong>: glucosa que baja y leucocitos y proteínas que suben${pos ? '' : ', aunque el Gram y el cultivo sean negativos'}.`);
    }
    if (micro === 'una' && clin === 'no') return pintar(box, 'ok', '<strong>Contaminación del DVE</strong>: una única muestra positiva, bioquímica normal y sin clínica.');
    if (micro === 'varias' && (clin === 'no' || clin === 'fiebre')) return pintar(box, 'warn', '<strong>Colonización del DVE</strong>: varias muestras positivas para el mismo germen, bioquímica normal, sin clínica salvo fiebre.');
    if (micro === 'neg' && clin === 'no') return pintar(box, 'ok', 'Microbiología, bioquímica y clínica normales: ningún criterio de Lozier.');
    pintar(box, 'warn', 'Esta combinación no está descrita en la tabla del manual: revisa la evolución del LCR (la bioquímica es la que separa colonización de infección).');
}

// Ficha XXX — ajuste de vancomicina y gentamicina intraventriculares por débito del DVE.
function calcDebitoDve() {
    const ml = leerNumero('umi-debito-ml');
    const box = document.getElementById('umi-debito-resultado');
    if (!box || ml === null) return;
    if (ml < 0) return;
    let texto, estado = 'ok';
    if (ml < 50) texto = 'Cada <strong>72 h</strong>.';
    else if (ml < 100) texto = 'Cada <strong>48 h</strong>.';
    else if (ml < 150) texto = 'Cada <strong>24 h</strong>.';
    else if (ml < 200) { texto = 'Cada 24 h, <strong>+5 mg de vancomicina o +1 mg de gentamicina</strong>.'; estado = 'warn'; }
    else if (ml <= 250) { texto = 'Cada 24 h, <strong>+10 mg de vancomicina o +2 mg de gentamicina</strong>.'; estado = 'warn'; }
    else { texto = 'El manual no da pauta por encima de 250 ml/día.'; estado = 'danger'; }
    pintar(box, estado, `Débito ${ml} ml/día: ${texto}`);
}

// [ids de campos, evento, función de cálculo] de cada calculadora de la
// guía — se enganchan en bucle y se pintan una vez al cargar.
const CALCULADORAS = [
    [['umi-ttkg-ko', 'umi-ttkg-oso', 'umi-ttkg-kp', 'umi-ttkg-osp'], 'input', calcTTKG],
    [['umi-defk-peso', 'umi-defk-kreal', 'umi-defk-diuresis'], 'input', calcDeficitK],
    [['umi-nut-sexo', 'umi-nut-altura', 'umi-nut-peso', 'umi-nut-edad', 'umi-nut-fa'], 'input', calcNutricion],
    [['umi-vt-sexo', 'umi-vt-altura', 'umi-vt-mlkg'], 'input', calcPbwVt],
    [['umi-ag-na', 'umi-ag-k', 'umi-ag-cl', 'umi-ag-hco3'], 'input', calcAnionGap],
    [['umi-raptt-ratio'], 'input', calcRaptt],
    [['umi-hemo-pas', 'umi-hemo-pad', 'umi-hemo-pvc', 'umi-hemo-gc', 'umi-hemo-sc', 'umi-hemo-hb', 'umi-hemo-sat', 'umi-hemo-satv', 'umi-hemo-pmap', 'umi-hemo-poap'], 'input', calcHemodinamica],
    [['umi-fs-lvdd', 'umi-fs-lvsd'], 'input', calcFsFevi],
    [['umi-vci-modo', 'umi-vci-dmax', 'umi-vci-dmin'], 'input', calcVciColapso],
    [['umi-nbg-1', 'umi-nbg-2', 'umi-nbg-3', 'umi-nbg-4', 'umi-nbg-5'], 'change', actualizarNbg],
    [['umi-ins-algoritmo', 'umi-ins-glucemia'], 'input', calcInsulinaDosis],
    [['umi-rass-paso1', 'umi-rass-paso2', 'umi-rass-paso3'], 'change', calcRass],
    [['umi-pic-tac', 'umi-pic-edad', 'umi-pic-focal', 'umi-pic-tas'], 'change', calcIndicacionPic],
    [['umi-ppc-pam', 'umi-ppc-pic'], 'input', calcPpc],
    [['umi-pic-dist'], 'input', calcOndaPic],
    [['umi-evans-a', 'umi-evans-b'], 'input', calcEvans],
    [['umi-fiv-dosis', 'umi-fiv-conc'], 'input', calcFibrinolisis],
    [['umi-mar-evacuada', 'umi-mar-masa', 'umi-mar-desv', 'umi-mar-cisternas', 'umi-mar-lesiones'], 'change', calcMarshall],
    [['umi-lin-acm', 'umi-lin-aci'], 'input', calcLindegaard],
    [['umi-onsd-mm'], 'input', calcOnsd],
    [['umi-res-situacion', 'umi-res-indep', 'umi-res-trabajo'], 'change', calcResultado],
    [['umi-loz-micro', 'umi-loz-bioq', 'umi-loz-clinica'], 'change', calcLozier],
    [['umi-debito-ml'], 'input', calcDebitoDve],
];

export function init() {
    initCorkboard('manual-umi-corkboard', 'panel-manual-umi-tabs');
    CALCULADORAS.forEach(([ids, evento, calc]) => {
        ids.forEach(id => document.getElementById(id)?.addEventListener(evento, calc));
        calc();
    });
}
