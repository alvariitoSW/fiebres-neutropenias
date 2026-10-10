// Vista Visual de la ficha "Hiperpotasemia" (Nefrología → Fisiología): una
// simulación del K⁺ entre plasma, célula y salidas (riñón, intestino,
// diálisis), con el corazón y su ECG, que arranca desde la causa y responde a
// cada fármaco de la tabla de tratamiento con su mecanismo y sus tiempos.
//
// Reglas (las mismas que el resto de vistas Visual de la app):
// - Una sola fuente de datos: la tabla de tratamiento de la vista Texto y la
//   simulación salen de js/data/hiperpotasemia-data.js.
// - Lo que la ficha no da (cuántos mEq/l mueve cada medida, a qué ritmo sale
//   el K⁺ en cada causa) es ILUSTRATIVO y la propia vista lo avisa.
// - Cada "Texto ↓" lleva a su línea real de la ficha (irAlTexto).
// - La animación solo corre mientras la vista Visual está en pantalla.

import { montarVisual } from '../../core/visual-kit.js';
import { irAlTexto, marcar } from '../../core/vista-visual.js';
import { clamp, pintarGauge } from '../../core/ui.js';
import {
    tratamientoHiperpotasemia as TABLA, farmacosHiperpotasemia as FARMACOS,
    gruposHiperpotasemia as GRUPOS, causasHiperpotasemia as CAUSAS,
    magnitudesHiperpotasemia as MAG,
} from '../../data/hiperpotasemia-data.js';

const TAB_ID = 'fisio-hiperpotasemia';
const POR_MEQ = 4, K_MIN = 3.5, T_MAX = 720;
const DESPLAZAN = FARMACOS.filter(f => f.grupo === 'desplaza');
const ELIMINAN = FARMACOS.filter(f => f.grupo === 'elimina');
const GRAVEDAD = [['Sin hiperpotasemia', ''], ['Ligera', ''], ['Moderada', 'yellow'], ['Grave', 'red']];
const ESTADO_GAUGE = ['ok', 'ok', 'warn', 'danger'];
// Tonos claros del dibujo, sin token propio en variables.css.
const CLARO = { rojo: '#e08a6c', oro: '#f0cf5a', verde: '#a8b97c', na: '#c882aa' };

const azar = (a, b) => a + Math.random() * (b - a);
const coma = n => n.toFixed(1).replace('.', ',');
const fmtT = m => { m = Math.round(m); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`; };
const enlace = id => ` <button type="button" class="visual-link" data-ver="${id}">Texto ↓</button>`;
// Color de un token (#rrggbb) con transparencia.
const alfa = (hex, a) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;

// ---------- Vista Texto: la tabla de tratamiento, desde los datos ----------
function renderTablaTratamiento() {
    const tbody = document.getElementById('hk-tto-tabla');
    if (!tbody || tbody.rows.length) return;
    tbody.innerHTML = TABLA.map(f =>
        `<tr id="hk-tto-${f.id}"><td>${f.agente}</td><td>${f.dosis}</td><td>${f.tiempo}</td><td>${f.mecanismo}</td></tr>`).join('');
}

export function initHiperpotasemiaSim() {
    renderTablaTratamiento();
    montarVisual(TAB_ID, montar);
}

// ---------- Marcado de la vista Visual ----------
const MARCADO = `
<p class="visual-guia">El K⁺ es una nube de puntos que vive en el plasma, en la célula o sale del cuerpo. Elige la causa, da los fármacos de la tabla y corre el reloj.</p>
<div class="hk-escenario">
  <div class="hk-campo"><label for="hk-causa">Causa</label><select id="hk-causa">${Object.entries(CAUSAS).map(([k, c]) => `<option value="${k}">${c.etiqueta}</option>`).join('')}</select></div>
  <p class="hk-causa-detalle" id="hk-causa-detalle"></p>
  <div class="hk-campo"><label for="hk-renal">Función renal</label><select id="hk-renal"><option value="ok">Conservada</option><option value="ir">Insuficiencia renal grave</option></select></div>
  <div class="hk-campo"><label for="hk-ecg-modo">ECG</label><select id="hk-ecg-modo"><option value="tipico">Cambios típicos para el K⁺ (Fig. 9)</option><option value="ninguno">Normal pese al K⁺ alto</option><option value="precoz">Cambios ya con K⁺ moderado</option></select></div>
</div>
<div class="hk-escena">
  <canvas id="hk-escena" aria-label="Simulación del potasio entre plasma, célula, corazón, analítica y vías de salida"></canvas>
  <canvas id="hk-ecg" aria-label="Electrocardiograma"></canvas>
</div>
<div class="hk-marcador">
  <div class="hk-k" id="hk-k" aria-live="polite"></div>
  <span class="grade-badge" id="hk-gravedad"></span>
  <div class="hk-k-real hk-fila" id="hk-k-real" hidden><span id="hk-k-real-txt"></span><button type="button" class="visual-mini hk-primario" id="hk-repetir">Repetir la analítica</button></div>
  <div class="hk-nota hk-fila" id="hk-ecg-texto"></div>
  <div class="kinetic-row hk-fila" id="hk-riesgo-row">
    <div class="kinetic-label"><span>Riesgo cardíaco</span><strong id="hk-riesgo-num"></strong></div>
    <div class="kinetic-track"><div class="kinetic-fill" id="hk-riesgo-fill"></div></div>
  </div>
  <div class="hk-nota hk-fila" id="hk-riesgo-txt"></div>
  <div class="hk-nota hk-fila" id="hk-reparto"></div>
</div>
<div class="hk-avisos" id="hk-avisos" aria-live="polite"></div>
<div class="hk-controles">
  <button type="button" class="visual-mini hk-primario" id="hk-play"></button>
  <button type="button" class="visual-mini" id="hk-rapido" aria-pressed="false">×4</button>
  <button type="button" class="visual-mini" id="hk-reiniciar">Reiniciar</button>
  <span class="hk-reloj" id="hk-reloj"></span>
</div>
<div id="hk-farmacos">${Object.entries(GRUPOS).map(([g, info]) =>
    `<p class="section-label">${info.rotulo}</p>` + FARMACOS.filter(f => f.grupo === g).map(f => `
  <div class="hk-farmaco"><span class="hk-tira" style="background:${info.color}"></span>
    <div><div class="hk-nombre">${f.nombre}</div>
      <div class="hk-meta">${f.tiempo || 'Inicio/duración: ' + TABLA.find(t => t.id === f.fila).tiempo}</div>
      ${f.fidelidad ? `<div class="hk-fidelidad">${f.fidelidad}</div>` : ''}
      <div class="hk-estado" id="hk-estado-${f.id}"></div></div>
    <div class="hk-acciones"><button type="button" class="visual-mini hk-dar" id="hk-dar-${f.id}" data-dar="${f.id}">Dar</button>
      <button type="button" class="visual-link" data-ver="hk-tto-${f.fila}${f.extra ? ',' + f.extra : ''}" aria-label="Ver ${f.nombre} en el texto">Texto ↓</button></div></div>`).join('')).join('')}
</div>
<p class="hk-aviso-modelo">Modelo didáctico. Los tiempos de inicio y duración salen de la tabla de la ficha; la ficha no dice cuántos mEq/l mueve cada medida ni a qué ritmo sale el K⁺ en cada causa, así que esas cantidades son ilustrativas. "Minutos/hora" (diálisis) y "horas" (diuréticos) no son cifras cerradas: en el modelo la diálisis empieza en unos minutos y ambos siguen mientras corre el reloj. Los puntos no están a escala: en la célula hay 150 mEq/l frente a 4 en el plasma.</p>`;

// ---------- Geometría de la escena (coordenadas lógicas 360×320) ----------
const W = 360, H = 320, EW = 360, EH = 74;
const VASO = { x: 10, y: 22, w: 282, h: 50 };
const CEL = { x: 10, y: 108, w: 228, h: 110 };
const BOMBAS = [62, 124, 186];
const ROTURAS = [93, 155];
const CORAZON = { x: 302, y: 160 };
const TUBO = { x: 326, y: 20 };
const SALIDAS = { orina: { x: 62, rot: 'Orina' }, heces: { x: 180, rot: 'Heces' }, dial: { x: 298, rot: 'Diálisis' } };
const CANAL_X = 252, Y_REPARTO = 236, Y_ICONO = 262;

// ---------- Modelo (sin DOM) ----------
function actividadDosis(f, u) {
    const [a, b] = f.ini;
    const subida = b > a ? b - a : Math.max(2, a * 0.3);
    const ini0 = b > a ? a : a - subida;
    if (u < ini0) return 0;
    if (u < ini0 + subida) return (u - ini0) / subida;
    if (!f.fin) return 1;
    const [c, d] = f.fin;
    if (u <= c) return 1;
    if (u < d) return 1 - (u - c) / (d - c);
    return 0;
}
// Actividad 0-1 de cada fármaco en el minuto t. Varias dosis no suman: cuenta
// la que más actúa en ese momento.
function actividades(S) {
    const act = {};
    for (const f of FARMACOS) act[f.id] = (S.dados[f.id] || []).reduce((m, td) => Math.max(m, S.t >= td ? actividadDosis(f, S.t - td) : 0), 0);
    return act;
}
const actividadRuta = (act, ruta) => Math.max(...ELIMINAN.filter(f => f.ruta === ruta).map(f => act[f.id]));

function modelo(S, act) {
    const c = S.c;
    const anadido = S.anadido.acido + S.anadido.lisis + S.anadido.aporte;
    const eliminado = S.eliminado.orina + S.eliminado.heces + S.eliminado.dial;
    let desplazado = 0;
    for (const f of DESPLAZAN) {
        const mag = typeof f.magnitud === 'number' ? f.magnitud
            : c.acido ? Math.min(f.magnitud.conAcidosis, S.anadido.acido) : f.magnitud.sinAcidosis;
        desplazado += mag * act[f.id];
    }
    desplazado = clamp(desplazado, 0, Math.max(0, c.base + anadido - eliminado - K_MIN));
    const k = c.base + anadido - eliminado - desplazado;
    return {
        k, desplazado, eliminado,
        medido: k + (c.pseudo && !S.repetido ? c.pseudo : 0),
        calcio: act.calcio,
        bomba: Math.min(1, act.insulina + act.salbutamol),
    };
}

function avanzar(S, dt) {
    const c = S.c;
    if (c.acido) S.anadido.acido = Math.min(c.acido, S.anadido.acido + c.acido * dt / 4);
    if (c.aporte) S.anadido.aporte = Math.min(c.aporte, S.anadido.aporte + c.aporte * dt / 15);
    if (c.lisis) S.anadido.lisis += c.lisis * dt / 60;
    const act = actividades(S), m = modelo(S, act);
    if (S.renal === 'ok') S.eliminado.orina += MAG.renalBasal * clamp((m.k - 4.5) / 0.5, 0, 1) * dt / 60;
    const freno = clamp((m.k - K_MIN) / 0.6, 0, 1);
    for (const f of ELIMINAN) {
        if (!act[f.id]) continue;
        const enIR = f.id === 'diuretico' && S.renal === 'ir' ? MAG.diureticoEnIR : 1;
        S.eliminado[f.ruta] += f.magnitud * act[f.id] * (dt / 60) * freno * enIR;
    }
    S.picoDesplazado = Math.max(S.picoDesplazado, m.desplazado);
    S.t += dt;
}

// ---------- ECG y gravedad (Figuras 9 y 7 de la ficha) ----------
// Las T picudas son siempre el primer cambio, así que "hay cambios" = r.t.
function rasgosECG(S, k) {
    if (S.ecg === 'ninguno') return { t: false, qrs: false, fv: false };
    return { t: k >= (S.ecg === 'precoz' ? 5 : 6.2), qrs: k >= 7, fv: k >= 8 };
}
// Figura 7: 5-6 ligera (moderada con ECG), 6,1-6,5 moderada (grave con ECG), >6,5 grave.
const nivelGravedad = (k, ecg) => k > 6.5 ? 3 : k > 6 ? 2 + ecg : k >= 5 ? 1 + ecg : 0;
function textoECG(S, r) {
    if (S.ecg === 'ninguno') return '<strong>ECG sin cambios.</strong> La ficha avisa: baja sensibilidad, puede haber arritmias con cualquier grado.' + enlace('hk-ecg-sensibilidad');
    if (r.fv) return '<strong>Arritmia ventricular</strong> (taquicardia, fibrilación) → paro cardíaco. Figura 9: &gt;8 mEq/l.' + enlace('hk-fig9');
    if (r.qrs) return '<strong>↑PR, se pierde la onda P, ↑QRS</strong>, con T picudas. Figura 9: &gt;7 mEq/l.' + enlace('hk-fig9');
    if (r.t) return (S.ecg === 'precoz' ? '<strong>Ondas T picudas</strong> con un K⁺ por debajo de lo típico: el ECG no sigue al número.' : '<strong>Ondas T picudas.</strong> Figura 9: ≈6,5 mEq/l.') + enlace('hk-fig9');
    return 'Sin cambios típicos. Baja sensibilidad: no descarta riesgo.' + enlace('hk-ecg-sensibilidad');
}

// Frases de la propia ficha que aparecen según lo que se hace.
function avisos(S, m, r, nivel) {
    const a = [], c = S.c, dado = id => (S.dados[id] || []).length > 0;
    if (c.pseudo && !S.repetido) a.push(['danger', 'Antes de tratar, confirma con una nueva analítica: una muestra hemolizada da un K⁺ falsamente alto.' + enlace('hk-confirmar')]);
    if (c.pseudo && Object.keys(S.dados).length) a.push(['danger', 'El K⁺ real del paciente es normal: tratar baja un potasio que no estaba alto.']);
    if (r.t && !dado('calcio')) a.push(['danger', 'Hay cambios en el ECG: la ficha pone el gluconato cálcico como primera medida.' + enlace('hk-tto-nota')]);
    if (r.t && dado('calcio') && m.calcio === 0) a.push(['danger', 'El efecto del calcio (30-60 min) ya ha pasado y el ECG sigue alterado. Puedes repetir la dosis.']);
    if (S.ecg === 'ninguno' && nivel === 3) a.push(['warn', 'ECG normal con K⁺ grave: la gravedad sigue siendo grave (Figura 7).' + enlace('hk-fig7')]);
    if (m.k > 6 && !c.pseudo) a.push(['warn', 'K⁺ &gt;6 mmol/l: monitorización ECG aunque no haya cambios típicos.' + enlace('hk-monitorizacion')]);
    if (dado('salbutamol') && !dado('insulina')) a.push(['warn', 'La monoterapia con β-agonistas falla en el 20-40% de los pacientes; con insulina-glucosa es más eficaz.']);
    if (S.picoDesplazado > 0.3 && m.desplazado < S.picoDesplazado - 0.25 && m.eliminado < 0.5) a.push(['danger', 'El K⁺ vuelve a subir: meterlo en la célula no lo saca del cuerpo.']);
    if (dado('bicarbonato') && !c.acido) a.push(['warn', 'Sin acidosis el bicarbonato aporta poco: la ficha lo reserva para la acidosis metabólica concomitante.']);
    if (dado('diuretico') && S.renal === 'ir') a.push(['warn', 'Con insuficiencia renal grave el diurético apenas saca K⁺: la hemodiálisis es el método más rápido y seguro en IR grave.']);
    if (dado('dialisis')) a.push(['warn', 'Diálisis con baños sin glucosa, para no estimular la liberación de insulina.']);
    if (c.aporte && S.renal === 'ok' && S.t > 30) a.push(['warn', 'Con el riñón conservado, el K⁺ del aporte se va por la orina: la ficha dice que el aporte solo es relevante si hay insuficiencia renal.']);
    if (c.lisis && S.t > 120 && m.eliminado < 0.5) a.push(['warn', 'La célula sigue soltando K⁺: hace falta sacarlo del cuerpo, no solo desplazarlo.']);
    return a.map(([e, x]) => `<div class="tfg-estado tfg-estado-${e}">${x}</div>`).join('');
}

function estadoTexto(S, f, act) {
    const dosis = S.dados[f.id] || [];
    if (!dosis.length) return '';
    const td = dosis[dosis.length - 1], u = S.t - td, a = act[f.id];
    const veces = dosis.length > 1 ? ` (${dosis.length}ª dosis)` : '';
    const empieza = f.ini[0] >= 60 ? fmtT(f.ini[0]) : `${f.ini[0]}${f.ini[1] > f.ini[0] ? '-' + f.ini[1] : ''} min`;
    if (u < f.ini[0] && a === 0) return `Dado a los ${fmtT(td)}${veces}. Empieza a los ${empieza}.`;
    if (a === 0) return `Dado a los ${fmtT(td)}${veces}. Efecto terminado.`;
    if (f.fin && u > f.fin[0]) return `Actuando, pero se está acabando (${Math.round(a * 100)}%).`;
    return `Actuando (${Math.round(a * 100)}%)${veces}.`;
}

// ---------- Montaje de la vista ----------
function montar(tab, texto, visual) {
    visual.innerHTML = MARCADO;
    const $ = id => visual.querySelector('#' + id);
    const E = {}; // referencias a los elementos que se reescriben, buscadas una sola vez
    for (const id of ['hk-k', 'hk-gravedad', 'hk-k-real', 'hk-k-real-txt', 'hk-repetir', 'hk-ecg-texto', 'hk-riesgo-txt',
        'hk-riesgo-fill', 'hk-reparto', 'hk-avisos', 'hk-reloj', 'hk-play', 'hk-rapido', 'hk-causa', 'hk-renal', 'hk-ecg-modo', 'hk-causa-detalle']) E[id] = $(id);
    for (const f of FARMACOS) { E['estado-' + f.id] = $('hk-estado-' + f.id); E['dar-' + f.id] = $('hk-dar-' + f.id); }
    // Escribe en el DOM solo si el valor ha cambiado (la vista se lee en cada fotograma).
    const previo = new Map();
    const poner = (clave, el, prop, v) => { if (previo.get(clave) !== v) { previo.set(clave, v); el[prop] = v; } };

    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const C = Object.fromEntries(Object.entries({ ink: '--text-main', muted: '--text-muted', rojo: '--accent-red', oro: '--accent-blue', verde: '--accent-green' })
        .map(([k, v]) => [k, css.getPropertyValue(v).trim()]));

    // ---------- Estado ----------
    let S;
    let P = [], FONDO = [], NA = [], HPLUS = [], TUBO_K = [];
    const nacidos = { acido: 0, lisis: 0, aporte: 0 };
    const trazo = new Float32Array(EW).fill(NaN);
    let rapido = false;

    // ---------- Partículas ----------
    const puntoPlasma = () => ({ x: azar(VASO.x + 18, VASO.x + VASO.w - 16), y: azar(VASO.y + 20, VASO.y + VASO.h - 7) });
    const puntoCelula = () => ({ x: azar(CEL.x + 16, CEL.x + CEL.w - 16), y: azar(CEL.y + 44, CEL.y + CEL.h - 24) });
    const nuevaK = (pos, fuente) => ({ cat: 'plasma', x: pos.x, y: pos.y, ruta: [], vx: azar(0.15, 0.45), fuente });

    function crearParticulas() {
        NA = []; HPLUS = [];
        nacidos.acido = nacidos.lisis = nacidos.aporte = 0;
        P = Array.from({ length: Math.round(S.c.base * POR_MEQ) }, () => nuevaK(puntoPlasma()));
        FONDO = Array.from({ length: 70 }, () => ({ ...puntoCelula(), fase: Math.random() * 6.28 }));
        TUBO_K = Array.from({ length: S.c.pseudo ? 10 : 0 }, () => ({ x: TUBO.x + azar(-4, 4), y: TUBO.y + azar(18, 42), fase: Math.random() * 6.28 }));
    }
    function mover(p, cat) {
        const desde = p.x;
        p.cat = cat;
        if (cat === 'celula') {
            const bx = BOMBAS.reduce((m, b) => Math.abs(b - desde) < Math.abs(m - desde) ? b : m);
            p.ruta = [{ x: bx, y: VASO.y + VASO.h + 4 }, { x: bx, y: CEL.y }, puntoCelula()];
        } else if (cat === 'plasma') {
            const gx = ROTURAS[Math.floor(Math.random() * ROTURAS.length)];
            p.ruta = [{ x: gx, y: CEL.y + 4 }, { x: gx, y: VASO.y + VASO.h - 4 }, puntoPlasma()];
        } else {
            const x = SALIDAS[cat].x;
            p.ruta = [{ x: CANAL_X, y: VASO.y + VASO.h }, { x: CANAL_X, y: Y_REPARTO }, { x, y: Y_REPARTO }, { x: x + azar(-22, 22), y: Y_ICONO + azar(18, 32) }];
        }
    }
    // K⁺ nuevo de una causa: el aporte entra desde fuera; la acidosis y la
    // lisis lo sacan de la célula por la membrana.
    function nacer(fuente) {
        if (fuente === 'aporte') {
            const p = nuevaK({ x: VASO.x + 30 + azar(-8, 8), y: 2 }, fuente);
            p.ruta = [{ x: p.x, y: VASO.y + 10 }, puntoPlasma()];
            P.push(p);
        } else {
            const p = nuevaK(puntoCelula(), fuente);
            mover(p, 'plasma');
            P.push(p);
        }
    }
    // Recoloca partículas para que cada compartimento tenga las que dice el modelo.
    function cuadrar(m) {
        for (const f of ['acido', 'lisis', 'aporte']) {
            for (const n = Math.round(S.anadido[f] * POR_MEQ); nacidos[f] < n; nacidos[f]++) nacer(f);
        }
        const cuenta = { plasma: 0, celula: 0, orina: 0, heces: 0, dial: 0 }, libres = [];
        for (const p of P) { cuenta[p.cat]++; if (p.cat === 'plasma' && !p.ruta.length) libres.push(p); }
        const quiero = { celula: Math.round(m.desplazado * POR_MEQ) };
        for (const r of ['orina', 'heces', 'dial']) quiero[r] = Math.round(S.eliminado[r] * POR_MEQ);
        for (const cat of ['orina', 'heces', 'dial', 'celula']) {
            for (let falta = quiero[cat] - cuenta[cat]; falta > 0; falta--) {
                const p = libres.length ? libres.splice(Math.floor(Math.random() * libres.length), 1)[0] : P.find(q => q.cat === 'plasma');
                if (!p) break;
                mover(p, cat);
            }
        }
        for (let sobra = cuenta.celula - quiero.celula; sobra > 0; sobra--) mover(P.find(q => q.cat === 'celula'), 'plasma');
    }

    // ---------- Dibujo ----------
    const cv = $('hk-escena'), ctx = cv.getContext('2d');
    const ecv = $('hk-ecg'), ectx = ecv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ecv.width = EW * dpr; ecv.height = EH * dpr; ectx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
    let fuenteActual = '';
    function rotulo(txt, x, y, color = C.muted, size = 9.5, align = 'left', peso = '') {
        const f = `${peso} ${size}px Georgia, serif`;
        if (f !== fuenteActual) { ctx.font = f; fuenteActual = f; }
        ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(txt, x, y);
    }
    // Varios círculos del mismo color en un solo trazado.
    function puntos(lista, color, radio, ox = 0, oy = 0) {
        if (!lista.length) return;
        ctx.fillStyle = color; ctx.beginPath();
        for (const p of lista) { const x = p.x + (ox ? ox(p) : 0), y = p.y + (oy ? oy(p) : 0); ctx.moveTo(x + radio, y); ctx.arc(x, y, radio, 0, 6.29); }
        ctx.fill();
    }
    let giroBomba = 0, reloj = 0, barrido = 0;

    function dibujar(m, act, nivel) {
        const c = S.c;
        ctx.clearRect(0, 0, W, H);
        if (c.aporte) {
            const entrando = S.anadido.aporte < c.aporte;
            rotulo(entrando ? 'Aporte oral/IV ↓' : 'Aporte oral/IV', VASO.x + 46, 13, entrando ? C.ink : C.muted);
        }
        // plasma
        rr(VASO.x, VASO.y, VASO.w, VASO.h, 24); ctx.fillStyle = alfa(C.rojo, 0.13); ctx.fill();
        ctx.strokeStyle = alfa(C.rojo, 0.55); ctx.lineWidth = 1.2; ctx.stroke();
        rotulo('PLASMA · ≈4 mEq/l normal · 2% del K⁺', VASO.x + 16, VASO.y + 14, C.muted, 9);
        dibujarTubo(m);
        // célula
        rr(CEL.x, CEL.y, CEL.w, CEL.h, 16); ctx.fillStyle = alfa(C.oro, 0.06); ctx.fill();
        ctx.strokeStyle = alfa(C.oro, 0.5); ctx.lineWidth = 2; ctx.stroke();
        rotulo('CÉLULA · 150 mEq/l · 98% del K⁺', CEL.x + 12, CEL.y + CEL.h - 9, C.muted, 9);
        if (c.lisis || c.acido) {
            ctx.strokeStyle = CLARO.rojo; ctx.lineWidth = 2; ctx.beginPath();
            for (const gx of ROTURAS) { ctx.moveTo(gx - 7, CEL.y - 3); ctx.lineTo(gx - 3, CEL.y + 3); ctx.lineTo(gx + 1, CEL.y - 3); ctx.lineTo(gx + 5, CEL.y + 3); }
            ctx.stroke();
        }
        // canal y salidas
        ctx.strokeStyle = alfa(C.verde, 0.3); ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(CANAL_X, VASO.y + VASO.h - 2); ctx.lineTo(CANAL_X, Y_REPARTO);
        ctx.moveTo(SALIDAS.orina.x, Y_REPARTO); ctx.lineTo(SALIDAS.dial.x, Y_REPARTO);
        for (const s of Object.values(SALIDAS)) { ctx.moveTo(s.x, Y_REPARTO); ctx.lineTo(s.x, Y_ICONO - 12); }
        ctx.stroke(); ctx.lineCap = 'butt';
        const ir = S.renal === 'ir';
        dibujarRinon(SALIDAS.orina.x, Y_ICONO, Math.max(ir ? 0 : 0.5, act.diuretico * (ir ? MAG.diureticoEnIR : 1)), ir);
        dibujarIntestino(SALIDAS.heces.x, Y_ICONO, actividadRuta(act, 'heces'));
        dibujarDializador(SALIDAS.dial.x, Y_ICONO, actividadRuta(act, 'dial'));
        for (const [r, s] of Object.entries(SALIDAS)) rotulo(r === 'orina' && ir ? 'Orina (IR grave)' : s.rot, s.x, 314, C.muted, 9.5, 'center');
        // K⁺ intracelular de fondo (el 98%)
        puntos(FONDO, alfa(C.oro, 0.3), 2, f => Math.sin(reloj * 0.6 + f.fase) * 1.2, f => Math.cos(reloj * 0.5 + f.fase) * 1.2);
        // bombas Na⁺/K⁺
        const activa = m.bomba > 0.05, vel = 0.4 + 3.2 * m.bomba;
        if (!reducido) giroBomba += 0.03 * vel;
        BOMBAS.forEach((bx, i) => {
            ctx.save(); ctx.translate(bx, CEL.y);
            if (activa) { ctx.shadowColor = C.oro; ctx.shadowBlur = 8 * m.bomba; }
            rr(-9, -8, 18, 16, 5); ctx.fillStyle = alfa(C.oro, activa ? 0.35 : 0.12); ctx.fill();
            ctx.strokeStyle = C.oro; ctx.lineWidth = 1; ctx.stroke(); ctx.shadowBlur = 0;
            ctx.rotate(giroBomba + i); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, 4.4); ctx.stroke();
            ctx.restore();
            if (activa && !reducido && Math.random() < 0.03 * vel) NA.push({ x: bx + azar(-4, 4), y: CEL.y - 8, vy: -azar(0.4, 0.8), vida: 1 });
        });
        NA = NA.filter(n => (n.vida -= 0.02) > 0);
        for (const n of NA) n.y += n.vy;
        puntos(NA, alfa(CLARO.na, 0.7), 1.7);
        if (activa) for (const bx of BOMBAS) rotulo('Na⁺↑', bx + 12, CEL.y - 12, CLARO.na, 8.5);
        rotulo(activa ? 'Bomba Na⁺/K⁺ acelerada: salen 3 Na⁺, entran 2 K⁺' : 'Bomba Na⁺/K⁺ a ritmo basal', CEL.x + 12, CEL.y + 20, activa ? C.ink : C.muted);
        // acidosis y lisis
        if (c.acido) {
            const bicarb = act.bicarbonato;
            if (!reducido && Math.random() < 0.1 * (1 - bicarb)) HPLUS.push({ x: azar(CEL.x + 30, CEL.x + CEL.w - 30), y: VASO.y + VASO.h - 2, vida: 1 });
            rotulo(bicarb > 0.5 ? 'Bicarbonato: sale H⁺, vuelve a entrar K⁺' : 'Acidosis: entra H⁺ y sale K⁺', CEL.x + 12, CEL.y + 34, CLARO.rojo);
        }
        if (c.lisis) rotulo('Lisis: la célula rota suelta K⁺', CEL.x + 12, CEL.y + 34, CLARO.rojo);
        HPLUS = HPLUS.filter(h => (h.vida -= 0.012) > 0);
        for (const h of HPLUS) { h.y += 0.7; ctx.globalAlpha = h.vida; rotulo('H⁺', h.x, h.y, CLARO.rojo, 8, 'center'); }
        ctx.globalAlpha = 1;
        // K⁺: mueve y agrupa por color para dibujar cada grupo en un trazado
        const grupos = { plasma: [], nuevo: [], celula: [], fuera: [] };
        for (const p of P) {
            if (p.ruta.length) {
                const d = p.ruta[0], dx = d.x - p.x, dy = d.y - p.y, dist = Math.hypot(dx, dy), v = reducido ? 999 : 2.2;
                if (dist <= v) { p.x = d.x; p.y = d.y; p.ruta.shift(); } else { p.x += dx / dist * v; p.y += dy / dist * v; }
            } else if (p.cat === 'plasma' && !reducido) {
                p.x += p.vx; if (p.x > VASO.x + VASO.w - 14) p.x = VASO.x + 14;
            }
            grupos[p.cat === 'plasma' ? (p.fuente && p.ruta.length ? 'nuevo' : 'plasma') : p.cat === 'celula' ? 'celula' : 'fuera'].push(p);
        }
        puntos(grupos.plasma, C.ink, 2.8);
        puntos(grupos.nuevo, CLARO.rojo, 2.8);
        puntos(grupos.fuera, CLARO.verde, 2.4);
        puntos(grupos.celula, CLARO.oro, 3.2);
        if (grupos.celula.length) {
            ctx.strokeStyle = alfa(CLARO.oro, 0.45); ctx.lineWidth = 1; ctx.beginPath();
            for (const p of grupos.celula) { ctx.moveTo(p.x + 5.5, p.y); ctx.arc(p.x, p.y, 5.5, 0, 6.29); }
            ctx.stroke();
        }
        dibujarCorazon(m, nivel);
    }
    function dibujarTubo(m) {
        const { x, y } = TUBO, hemolisis = S.c.pseudo && !S.repetido;
        ctx.strokeStyle = C.muted; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 8, y + 40); ctx.arc(x, y + 40, 8, Math.PI, 0, true); ctx.lineTo(x + 8, y); ctx.stroke();
        ctx.fillStyle = alfa(C.rojo, hemolisis ? 0.55 : 0.25);
        ctx.beginPath(); ctx.moveTo(x - 7, y + 14); ctx.lineTo(x - 7, y + 40); ctx.arc(x, y + 40, 7, Math.PI, 0, true); ctx.lineTo(x + 7, y + 14); ctx.fill();
        if (hemolisis) {
            puntos(TUBO_K, CLARO.rojo, 1.8, k => Math.sin(reloj + k.fase));
            rotulo('hemolizada', x, y + 62, CLARO.rojo, 8.5, 'center');
        }
        rotulo('Analítica', x, y + 74, C.muted, 9, 'center');
        rotulo(coma(m.medido), x, y + 86, hemolisis ? CLARO.rojo : C.ink, 10, 'center', 'bold');
    }
    function dibujarCorazon(m, nivel) {
        const { x, y } = CORAZON, latido = 1 + 0.05 * Math.max(0, Math.sin(reloj * 7));
        ctx.save(); ctx.translate(x, y); ctx.scale(latido, latido);
        ctx.beginPath(); ctx.moveTo(0, 24); ctx.bezierCurveTo(-32, 4, -24, -24, 0, -11); ctx.bezierCurveTo(24, -24, 32, 4, 0, 24);
        ctx.fillStyle = alfa(C.rojo, 0.3 + 0.55 * (nivel / 3) * (1 - 0.6 * m.calcio)); ctx.fill();
        ctx.strokeStyle = C.rojo; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
        if (m.calcio > 0.02) {
            ctx.save(); ctx.globalAlpha = m.calcio;
            ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.lineDashOffset = -reloj * 8;
            ctx.beginPath(); ctx.arc(x, y + 2, 36, 0, 6.29); ctx.stroke();
            ctx.restore();
            rotulo('Ca²⁺', x + 34, y - 30, C.ink, 9.5, 'center', 'bold');
        }
        rotulo('Corazón', x, y + 50, C.muted, 9.5, 'center');
        if (m.calcio > 0.3) rotulo('membrana protegida', x, y + 62, C.ink, 9, 'center');
    }
    const brillo = a => { if (a > 0.05) { ctx.shadowColor = C.verde; ctx.shadowBlur = 10 * a; } };
    function dibujarRinon(x, y, a, cerrado) {
        ctx.save(); brillo(a);
        ctx.beginPath(); ctx.moveTo(x + 2, y - 11);
        ctx.bezierCurveTo(x - 18, y - 14, x - 18, y + 14, x + 2, y + 11);
        ctx.bezierCurveTo(x + 8, y + 9, x + 4, y + 3, x + 7, y);
        ctx.bezierCurveTo(x + 4, y - 3, x + 8, y - 9, x + 2, y - 11);
        ctx.fillStyle = alfa(C.verde, a > 0.05 ? 0.75 : 0.3); ctx.fill();
        ctx.restore();
        if (cerrado) { ctx.strokeStyle = CLARO.rojo; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 8, y - 8); ctx.lineTo(x + 6, y + 8); ctx.moveTo(x + 6, y - 8); ctx.lineTo(x - 8, y + 8); ctx.stroke(); }
    }
    function dibujarIntestino(x, y, a) {
        ctx.save(); brillo(a); ctx.strokeStyle = alfa(C.verde, a > 0.05 ? 1 : 0.35); ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - 16, y - 6); ctx.bezierCurveTo(x - 4, y - 14, x + 4, y + 2, x + 16, y - 6);
        ctx.moveTo(x - 16, y + 4); ctx.bezierCurveTo(x - 4, y - 4, x + 4, y + 12, x + 16, y + 4); ctx.stroke(); ctx.restore();
    }
    function dibujarDializador(x, y, a) {
        ctx.save(); brillo(a);
        rr(x - 8, y - 12, 16, 24, 5); ctx.fillStyle = alfa(C.verde, a > 0.05 ? 0.55 : 0.25); ctx.fill();
        ctx.strokeStyle = C.verde; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
        ctx.strokeStyle = alfa(C.ink, 0.4); ctx.lineWidth = 1; ctx.beginPath();
        for (let i = -4; i <= 4; i += 4) { ctx.moveTo(x + i, y - 9); ctx.lineTo(x + i, y + 9); }
        ctx.stroke();
    }
    const gauss = (u, c, w) => Math.exp(-((u - c) ** 2) / (2 * w * w));
    function latido(u, r) {
        if (r.fv) return 0.55 * Math.sin(u * 6.28 * 2.2) + 0.25 * Math.sin(u * 6.28 * 5.3 + 1);
        const qrsW = r.qrs ? 2.2 : 1, q = 0.32 + (r.qrs ? 0.04 : 0);
        return (r.qrs ? 0 : 0.13) * gauss(u, 0.16, 0.025) - 0.1 * gauss(u, q - 0.025 * qrsW, 0.008 * qrsW) + gauss(u, q, 0.011 * qrsW)
            - 0.25 * gauss(u, q + 0.03 * qrsW, 0.01 * qrsW) + (r.t ? 0.8 : 0.26) * gauss(u, 0.62, r.t ? 0.026 : 0.055);
    }
    let ecgEstatico = '';
    function dibujarECG(r) {
        if (!reducido) {
            for (let i = 0; i < 3; i++) {
                const col = Math.floor(barrido) % EW;
                trazo[col] = latido((barrido % 120) / 120, r);
                for (let j = 1; j < 12; j++) trazo[(col + j) % EW] = NaN;
                barrido += 1;
            }
        } else {
            // Sin movimiento: el trazo solo se recalcula cuando cambian los rasgos.
            const clave = `${r.t}${r.qrs}${r.fv}`;
            if (clave === ecgEstatico) return;
            ecgEstatico = clave;
            for (let c = 0; c < EW; c++) trazo[c] = latido((c % 120) / 120, r);
        }
        ectx.clearRect(0, 0, EW, EH);
        ectx.strokeStyle = alfa(C.verde, 0.12); ectx.lineWidth = 1; ectx.beginPath();
        for (let x = 0; x < EW; x += 15) { ectx.moveTo(x, 0); ectx.lineTo(x, EH); }
        ectx.stroke();
        ectx.strokeStyle = CLARO.verde; ectx.lineWidth = 1.6; ectx.beginPath();
        let abierto = false;
        for (let c = 0; c < EW; c++) {
            if (Number.isNaN(trazo[c])) { abierto = false; continue; }
            const y = 50 - trazo[c] * 32;
            if (abierto) ectx.lineTo(c, y); else { ectx.moveTo(c, y); abierto = true; }
        }
        ectx.stroke();
        ectx.fillStyle = C.muted; ectx.font = '9px Georgia, serif'; ectx.textAlign = 'left'; ectx.fillText('ECG', 6, 12);
    }

    // ---------- Lecturas (solo se escribe lo que cambia) ----------
    function leer(m, r, nivel, act) {
        const pendiente = S.c.pseudo && !S.repetido;
        const [nombre, color] = GRAVEDAD[nivel];
        poner('k', E['hk-k'], 'innerHTML', `${coma(m.medido)} <small>mEq/l en la analítica</small>`);
        poner('grav', E['hk-gravedad'], 'textContent', pendiente ? 'Sin confirmar' : nombre);
        poner('gravc', E['hk-gravedad'], 'className', 'grade-badge ' + (pendiente ? 'hk-pendiente' : color));
        poner('real', E['hk-k-real'], 'hidden', !S.c.pseudo);
        if (S.c.pseudo) {
            poner('realtxt', E['hk-k-real-txt'], 'textContent', S.repetido ? `Analítica repetida: el K⁺ real es ${coma(m.k)}.` : 'El K⁺ que circula en el plasma es otro.');
            poner('repetir', E['hk-repetir'], 'hidden', S.repetido);
        }
        poner('ecg', E['hk-ecg-texto'], 'innerHTML', textoECG(S, r));
        const protegido = m.calcio > 0.3 && nivel > 0;
        const claveRiesgo = `${nivel}${protegido}${pendiente}`;
        if (previo.get('riesgo') !== claveRiesgo) {
            previo.set('riesgo', claveRiesgo);
            pintarGauge('hk-riesgo', [8, 33, 66, 100][nivel], 100, ESTADO_GAUGE[nivel], pendiente ? 'sin confirmar' : protegido ? 'protegido' : nombre.toLowerCase());
            if (protegido) Object.assign(E['hk-riesgo-fill'].style, { background: `repeating-linear-gradient(135deg, ${C.ink} 0 4px, ${alfa(C.ink, 0.35)} 4px 8px)`, boxShadow: 'none' });
            E['hk-riesgo-txt'].innerHTML = pendiente ? 'Pendiente de confirmar: el K⁺ de la analítica puede ser falso.'
                : (protegido ? `Membrana protegida por el calcio. El K⁺ y la gravedad (${nombre.toLowerCase()}) no han cambiado.` : `Según la gravedad de la Figura 7: ${nombre.toLowerCase()}.`) + enlace('hk-fig7');
        }
        const e = S.eliminado;
        poner('rep', E['hk-reparto'], 'textContent', `En la célula, de forma temporal: ${coma(m.desplazado)} · Fuera del cuerpo: ${coma(m.eliminado)} (orina ${coma(e.orina)}, heces ${coma(e.heces)}, diálisis ${coma(e.dial)})`);
        poner('reloj', E['hk-reloj'], 'textContent', fmtT(S.t));
        poner('avisos', E['hk-avisos'], 'innerHTML', avisos(S, m, r, nivel));
        poner('play', E['hk-play'], 'textContent', S.t >= T_MAX ? 'Fin del reloj (12 h)' : S.corriendo ? '❚❚ Pausar' : '▶ Correr el reloj');
        for (const f of FARMACOS) {
            poner('est' + f.id, E['estado-' + f.id], 'textContent', estadoTexto(S, f, act));
            const dosis = S.dados[f.id] || [];
            const enCurso = act[f.id] > 0 || (dosis.length && S.t - dosis[dosis.length - 1] < f.ini[1]);
            const [txt, off] = !dosis.length ? ['Dar', false] : f.repetible && !enCurso ? ['Repetir', false] : ['Dado', true];
            poner('dar' + f.id, E['dar-' + f.id], 'textContent', txt);
            poner('off' + f.id, E['dar-' + f.id], 'disabled', off);
        }
    }

    // ---------- Un fotograma: avanza el reloj (si corre), recoloca, lee y dibuja ----------
    let ultimo = 0;
    function paso(ahora = performance.now()) {
        const dt = ultimo ? clamp((ahora - ultimo) / 1000, 0, 0.1) : 0;
        ultimo = ahora;
        reloj += dt;
        if (S.corriendo) {
            const sub = (1.5 + S.t / 18) * (rapido ? 4 : 1) * dt / 4;
            for (let i = 0; i < 4 && S.t < T_MAX; i++) avanzar(S, sub);
            if (S.t >= T_MAX) { S.t = T_MAX; S.corriendo = false; }
        }
        const act = actividades(S), m = modelo(S, act);
        cuadrar(m);
        const r = rasgosECG(S, m.k), nivel = nivelGravedad(m.k, r.t);
        leer(m, r, nivel, act);
        dibujar(m, act, nivel);
        dibujarECG(r);
    }

    function reiniciar(desdeCausa) {
        const c = CAUSAS[E['hk-causa'].value];
        if (desdeCausa) E['hk-renal'].value = c.renal;
        S = {
            c, renal: E['hk-renal'].value, ecg: E['hk-ecg-modo'].value, t: 0, corriendo: false, dados: {}, repetido: false,
            anadido: { acido: 0, lisis: 0, aporte: 0 }, eliminado: { orina: 0, heces: 0, dial: 0 }, picoDesplazado: 0,
        };
        E['hk-causa-detalle'].innerHTML = c.texto + enlace(c.fuente);
        crearParticulas();
        trazo.fill(NaN);
        ecgEstatico = '';
        paso();
    }

    // ---------- Controles ----------
    E['hk-play'].addEventListener('click', () => { if (S.t < T_MAX) { S.corriendo = !S.corriendo; paso(); } });
    E['hk-rapido'].addEventListener('click', () => {
        rapido = !rapido;
        E['hk-rapido'].setAttribute('aria-pressed', String(rapido));
        E['hk-rapido'].classList.toggle('hk-primario', rapido);
    });
    $('hk-reiniciar').addEventListener('click', () => reiniciar(false));
    E['hk-causa'].addEventListener('change', () => reiniciar(true));
    E['hk-renal'].addEventListener('change', () => { S.renal = E['hk-renal'].value; paso(); });
    E['hk-ecg-modo'].addEventListener('change', () => { S.ecg = E['hk-ecg-modo'].value; paso(); });
    E['hk-repetir'].addEventListener('click', () => { S.repetido = true; paso(); });
    visual.addEventListener('click', e => {
        const dar = e.target.closest('[data-dar]');
        if (dar && !dar.disabled) { (S.dados[dar.dataset.dar] ||= []).push(S.t); paso(); return; }
        const ver = e.target.closest('[data-ver]');
        if (!ver) return;
        const [primero, ...otros] = ver.dataset.ver.split(',').map(id => texto.querySelector('#' + id)).filter(Boolean);
        irAlTexto(tab, primero);
        otros.forEach(marcar); // p. ej. la fila "Inicio de acción" de la tabla de quelantes
    });

    // La animación solo corre mientras alguna parte de la vista Visual está en
    // pantalla (la ficha vive en el DOM aunque esté oculta, como todas las de
    // la app). Se observa el bloque entero, no solo el dibujo: así el reloj
    // sigue corriendo al bajar a pulsar los fármacos.
    let visible = false, raf = 0;
    const bucle = t => { paso(t); raf = visible ? requestAnimationFrame(bucle) : 0; };
    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) { ultimo = 0; raf = requestAnimationFrame(bucle); }
    }).observe(visual);

    reiniciar(true);
}
