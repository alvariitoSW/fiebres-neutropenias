// Nefrona viva (vista "nefrona" de Nefrología). Escenario de 3 niveles de
// zoom en el mismo recuadro:
//   1. Corte real: la foto anatómica (img/nefrona-anatomia.jpg); al tocarla
//      hace zoom hacia la nefrona yuxtamedular.
//   2. Nefrona: un <canvas> con la misma orientación que la foto (corteza
//      arriba, colector a la izquierda, asa a la derecha). El filtrado sale
//      del glomérulo como partículas que se reabsorben tramo a tramo; el
//      color de la luz y del intersticio es la osmolalidad.
//   3. Célula: un SVG luz | célula | sangre del tramo tocado, con los iones
//      de cada transportador viajando (SMIL) y el bloqueo del fármaco elegido.
// Los transportadores, fármacos y situaciones salen de js/data/nefrona-data.js;
// las explicaciones se leen de las líneas reales de las fichas de esta misma
// página (ids nv-t-*), y "Texto ↓" lleva a ellas. Como la foto con puntos de
// antes, no conoce el contenido clínico: delega en onCategoria(key).
import { segmentosNefrona, situacionesNefrona, farmacosNefrona, cifrasNefrona } from '../../data/nefrona-data.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { irAlTexto } from '../../core/vista-visual.js';
import { CLARO, alfa } from './potasio-escena.js';
import { clamp } from '../../core/ui.js';
import { fraDe, montarVolumen, repintarVolumen, dibujarRabdo, avisosRabdo } from './nefrona-viva-b4.js';
import { pintarParticula, svgParticula, colorParticula, leyendaParticulas } from '../../core/particulas.js';

const CIF = cifrasNefrona;
const W = 360, H = 470;
const BANDAS = { corteza: [0, 140], externa: [140, 300], interna: [300, 458] };
const G = { x: 232, y: 58, r: 21 };
const TRAMOS = ['bow', 'tp1', 'tp2', 'desc', 'ascd', 'tal', 'tcd', 'col'];
const TRAMO_SEG = { bow: 'glomerulo', tp1: 'tubulo-proximal', tp2: 'tubulo-proximal', desc: 'asa-descendente', ascd: 'asa-ascendente-delgada', tal: 'asa-ascendente-gruesa', tcd: 'tubulo-distal', col: 'colector' };
const SEG_TRAMO = { 'asa-ascendente-gruesa': 'tal', 'tubulo-distal': 'tcd', colector: 'col', 'tubulo-proximal': 'tp1' };
// Puntos de control de cada tramo (se suavizan con Catmull-Rom).
const CTRL = {
    bow: [[232, 58], [244, 62], [253, 62]],
    tp1: [[253, 62], [266, 50], [284, 50], [296, 64]],
    tp2: [[296, 64], [296, 84], [280, 94], [286, 112], [308, 120], [322, 132], [326, 150]],
    desc: [[326, 150], [326, 280], [326, 418]],
    ascd: [[326, 418], [322, 436], [308, 441], [294, 435], [290, 420], [290, 360], [290, 300]],
    tal: [[290, 300], [290, 220], [289, 160], [280, 128], [250, 100], [222, 84]],
    tcd: [[222, 84], [204, 92], [186, 80], [168, 96], [150, 86], [134, 102], [114, 98], [98, 112]],
    col: [[98, 112], [92, 140], [92, 300], [92, 452]],
};
// Grosor de la pared y de la luz de cada tramo.
const GROSOR = { bow: [8, 4], tp1: [14, 6], tp2: [14, 6], desc: [8, 3.5], ascd: [8, 3.5], tal: [13, 5], tcd: [11, 5], col: [15, 8] };
const GROSOR_OBSTRUIDO = { ...GROSOR, col: [19, 12] };

// ---------- Modelo ----------
// Reabsorción de cada especie en cada tramo (fracción de lo que entra). De
// las fichas: 180 L, 70% del agua en el proximal, orina de 50-1200 mOsm/kg
// con 900 mOsm/día de solutos (de 18 a 0,75 L/día), Tm de la glucosa. Lo
// demás es ilustrativo y la vista lo dice.
const NA_FILTRADO = CIF.naFiltradoG * 1000 / 23; // mmol/día
const parte = (total, primera) => 1 - (1 - total) / (1 - primera); // reparte una fracción en dos tramos seguidos
// Gradiente medular: una parte es ClNa (rama gruesa) y otra urea, que solo
// sale del colector con ADH. Con ADH máxima llega a 1.200 mOsm/kg (ficha).
const gradiente = a => 780 + 420 * a;
const M_NORMAL = gradiente(0.4825);
// La rama descendente recupera el 20% del agua que le llega con el gradiente
// normal (fuente: Carracedo y Ramírez); más con más gradiente, menos con menos.
const rDescDe = M => CIF.aguaDescendente * Math.max(0, (M - 300) / (M_NORMAL - 300));

function modelo(sit, farm, glucemia) {
    const situacion = situacionesNefrona.find(x => x.id === sit);
    if (situacion.fra) return modeloFra(situacion, farm);
    const a = situacion.adh, ac = situacion.acido || {}, mi = situacion.mineral || {};
    // ATR IV: sin aldosterona el colector se comporta como con un ahorrador de K⁺.
    const furo = farm === 'furosemida', tiaz = farm === 'tiazida', ahorr = farm === 'espironolactona' || farm === 'amilorida' || !!ac.ahorraK;
    const acet = farm === 'acetazolamida', sglt = farm === 'isglt2';
    // Gradiente medular (máximo del intersticio) y dilución mínima posible.
    const M = furo ? 380 : gradiente(a);
    const Umin = furo ? 280 : tiaz ? 150 : CIF.osmMin;
    const Uosm = Umin + (M - Umin) * a;
    // Agua: la rama descendente depende del gradiente.
    const rDesc = rDescDe(M);
    const aguaCol = CIF.filtradoL * (1 - CIF.aguaProximal) * (1 - rDesc);
    // Na⁺: el distal y el colector tienen techo; lo que llega de más se pierde.
    const rTp = acet ? 0.55 : sglt ? 0.62 : 0.65;
    let na = 1 - rTp;
    na *= 1 - 0.30;
    na *= 1 - (furo ? 0.05 : 0.60); const naTal = na;
    const reTcd = Math.min(na * (tiaz ? 0.05 : 0.60), 0.07); na -= reTcd; const naTcd = na;
    const reCol = Math.min(na * (ahorr ? 0.50 : 0.87), 0.04); na -= reCol;
    const fena = na;
    // K⁺: casi todo se recupera antes del distal; la orina la decide la secreción del colector.
    const kSec = 0.10 * Math.sqrt(naTcd / 0.039) * (ahorr ? 0.2 : 1) * (ac.kMult ?? 1);
    const kRel = (0.35 * (1 - (furo ? 0.05 : 0.86)) + kSec) / (0.35 * 0.14 + 0.10);
    // Glucosa: SGLT2 (90%) + SGLT1 (10%) con su Tm.
    const gFilt = (sit === 'hiperglucemia' ? glucemia : 100) * 1.25; // mg/min con TFG 125 ml/min
    const w = 0.12 * CIF.glucosaTm;
    let gExc = 0;
    if (sglt) gExc = 0.40;
    else if (sit === 'hiperglucemia' && glucemia > CIF.glucosaUmbral) gExc = Math.min(1, w * Math.log1p(Math.exp((gFilt - CIF.glucosaTm) / w)) / gFilt);
    const gGdia = gExc * gFilt * 1.44;
    const hco3 = acet ? 0.25 : 0.005;
    const solutos = CIF.cargaOsmolar + 2 * (fena - 0.005) * NA_FILTRADO + gGdia * 1000 / 180 + (acet ? 300 : 0);
    const V = Math.min(aguaCol, solutos / Uosm);
    const r = {
        h2o: { tp1: 0.35, tp2: parte(CIF.aguaProximal, 0.35), desc: rDesc, col: 1 - V / aguaCol },
        na: { tp1: 0.40, tp2: parte(rTp, 0.40), ascd: 0.30, tal: furo ? 0.05 : 0.60, tcd: reTcd / naTal, col: reCol / naTcd },
        k: { tp1: 0.40, tp2: parte(0.65, 0.40), tal: furo ? 0.05 : 0.86 },
        glu: sglt ? { tp1: 0, tp2: 0.60 } : gExc > 0 ? { tp1: 0.9 * (1 - gExc), tp2: parte(1 - gExc, 0.9 * (1 - gExc)) } : { tp1: 0.90, tp2: 1 },
        hco3: hco3R(acet ? 0.30 : ac.hco3Proximal ?? 0.80, acet ? 0.55 : 0.97, ac.hco3Proximal ? 0.4 : 0.15),
        urea: ureaR(a),
        ...mineralR({ furo, tiaz, mi }),
    };
    return { a, M, Umin, Uosm, V, aguaCol, rDesc, fena, naTcd, kSec, kRel, gGdia, hco3, r, gluSpawn: sit === 'hiperglucemia' ? glucemia / 100 : 1, tfg: 1,
        hco3Spawn: ac.hco3Spawn ?? 1, hSec: ac.hSec ?? 1, nh4Sec: ac.nh4Sec ?? 1, caSpawn: mi.caSpawn ?? 1,
        acido: situacion.acido, mineral: situacion.mineral, efectos: efectosDe(situacion) };
}

// Fracaso renal agudo: la orina es la de la Tabla 3 de la ficha (en `fra`),
// y el reparto por tramos se ajusta para que la animación llegue a ella.
function modeloFra(s, farm) {
    const f = fraDe(s);
    const M = f.M, Umin = CIF.osmMin, a = s.adh;
    const rDesc = rDescDe(M);
    const aguaCol = CIF.filtradoL * f.tfg * (1 - CIF.aguaProximal) * (1 - rDesc);
    const naTal = (1 - f.rTp) * (1 - 0.30) * (1 - f.rTal);
    const reTcd = Math.min(naTal * 0.60, 0.07), naTcd = naTal - reTcd;
    const rColNa = f.fena == null ? 0 : clamp01(1 - f.fena / naTcd);
    const r = {
        h2o: { tp1: 0.35, tp2: parte(f.nta ? 0.45 : CIF.aguaProximal, 0.35), desc: rDesc, col: f.obstruccion ? 0 : clamp01(1 - f.V / aguaCol) },
        na: { tp1: f.rTp * 0.6, tp2: parte(f.rTp, f.rTp * 0.6), ascd: 0.30, tal: f.rTal, tcd: reTcd / naTal, col: rColNa },
        k: { tp1: 0.40, tp2: parte(0.65, 0.40), tal: f.nta ? 0.3 : 0.86 },
        glu: { tp1: 0.90, tp2: 1 },
        hco3: hco3R(f.nta ? 0.5 : 0.80, 0.97),
        urea: ureaR(f.nta ? 0.3 : a),
        ...mineralR({ nta: f.nta, mi: {} }),
    };
    return { a, M, Umin, Uosm: f.uosm ?? 300, V: f.V, aguaCol, rDesc, fena: f.fena ?? 0, naTcd, kSec: f.nta ? 0.04 : 0.08, kRel: 1, gGdia: 0, hco3: 0.005, r,
        gluSpawn: 1, tfg: f.tfg, fra: f, hco3Spawn: 1, hSec: f.nta ? 0.4 : 1, nh4Sec: f.nta ? 0.4 : 1, caSpawn: 1, efectos: [] };
}
const clamp01 = v => Math.max(0, Math.min(1, v));
// Lo que una situación frena ('bloquea') o estimula ('activa') en un canal.
const efectosDe = s => s.efectos ?? (s.defecto ? [{ ...s.defecto, tipo: 'bloquea' }] : []);
// Ca²⁺, Mg²⁺ y fosfato, con el reparto por tramos de las fichas (Rodelo-Haad
// 2025): Ca²⁺ 70% proximal, 20-25% rama gruesa, 5-10% distal; Mg²⁺ 25%
// proximal, 65% asa, 5% distal, ~5% excretado; fosfato con RTP >80% (FEP
// 5-20%) en el proximal. Las tiazidas causan hipocalciuria porque la
// contracción de volumen sube la reabsorción proximal de Ca²⁺; los diuréticos
// de asa la pierden al quitar el gradiente de la rama gruesa. Cuánto cambia
// cada tramo con un fármaco o una situación es ilustrativo.
function mineralR({ furo, tiaz, nta, mi }) {
    const pp = mi.pProx ?? (nta ? 0.5 : 0.88);
    const caTp = tiaz ? 0.80 : 0.70;
    return {
        ca: { tp1: 0.40, tp2: parte(caTp, 0.40), tal: furo ? 0.1 : nta ? 0.3 : mi.ca?.tal ?? 0.75, tcd: mi.ca?.tcd ?? 0.86 },
        mg: { tp1: 0.12, tp2: parte(0.25, 0.12), tal: furo ? 0.1 : nta ? 0.3 : 0.867, tcd: tiaz ? 0.2 : 0.5 },
        p: { tp1: pp * 0.6, tp2: parte(pp, pp * 0.6) },
    };
}
// Fracción de lo filtrado que llega a la orina.
const excretado = r => TRAMOS.reduce((x, t) => x * (1 - (r[t] || 0)), 1);
// HCO₃⁻: el proximal recupera `prox` del filtrado (la mitad en su primer tramo);
// en la ATR II la rama gruesa recupera más de lo que le llega de más (ilustrativo).
function hco3R(prox, col, tal = 0.15) { const t1 = prox === 0.80 ? 0.5 : prox / 2; return { tp1: t1, tp2: parte(prox, t1), tal, col }; }
// Urea: el proximal recupera la mitad; el colector distal la deja salir a la médula según la ADH.
function ureaR(a) { const t1 = CIF.ureaProximal / 2; return { tp1: t1, tp2: parte(CIF.ureaProximal, t1), col: 0.15 + 0.6 * a }; }

// ---------- Ruta del túbulo ----------
function catmull(pts, paso) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / paso));
        for (let k = 0; k < n; k++) {
            const t = k / n, t2 = t * t, t3 = t2 * t;
            const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
            out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
        }
    }
    out.push(pts[pts.length - 1]);
    return out;
}
const RUTA = [], LIMITES = {};
(function () {
    let s = 0;
    for (const t of TRAMOS) {
        const ini = s;
        catmull(CTRL[t], 3).forEach((p, i) => {
            if (RUTA.length && i === 0) return;
            const prev = RUTA[RUTA.length - 1];
            if (prev) s += Math.hypot(p[0] - prev.x, p[1] - prev.y);
            RUTA.push({ x: p[0], y: p[1], s, tramo: t });
        });
        LIMITES[t] = [ini, s];
    }
    RUTA.forEach((p, i) => {
        const a = RUTA[Math.max(0, i - 1)], b = RUTA[Math.min(RUTA.length - 1, i + 1)];
        const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        p.nx = -(b.y - a.y) / l; p.ny = (b.x - a.x) / l;
    });
})();
const LARGO = RUTA[RUTA.length - 1].s;
function enS(s) {
    let lo = 0, hi = RUTA.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (RUTA[m].s < s) lo = m; else hi = m; }
    const a = RUTA[lo], b = RUTA[hi], t = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, nx: a.nx, ny: a.ny, tramo: a.tramo };
}

// ---------- Color de la osmolalidad ----------
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
let ESCALA = [];
function colorOsm(o, a = 1) {
    o = Math.max(50, Math.min(1200, o));
    let i = 0; while (i < ESCALA.length - 2 && o > ESCALA[i + 1][0]) i++;
    const [o1, c1] = ESCALA[i], [o2, c2] = ESCALA[i + 1], t = (o - o1) / (o2 - o1);
    const c = c1.map((v, k) => Math.round(v + (c2[k] - v) * t));
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}
const profundidad = y => Math.max(0, Math.min(1, (y - BANDAS.externa[0]) / (BANDAS.interna[1] - BANDAS.externa[0])));
const intersticio = (y, m) => 300 + (m.M - 300) * profundidad(y);
const finTcd = m => m.Umin >= 280 ? 300 : m.Umin === 150 ? 150 : 100;
function osmLuz(p, m) {
    const [a, b] = LIMITES[p.tramo], u = (p.s - a) / (b - a || 1);
    const tal0 = Math.max(300, intersticio(300, m) * 0.92), talFin = m.Umin >= 280 ? 300 : 110, tcdFin = finTcd(m);
    switch (p.tramo) {
        case 'desc': return intersticio(p.y, m);
        case 'ascd': return intersticio(p.y, m) * 0.9;
        case 'tal': return tal0 + (talFin - tal0) * u;
        case 'tcd': return talFin + (tcdFin - talFin) * u;
        case 'col':
            if (m.Uosm >= tcdFin) return Math.min(tcdFin + (m.Uosm - tcdFin) * Math.pow(u, 0.7), Math.max(300, intersticio(p.y, m)));
            return tcdFin + (m.Uosm - tcdFin) * u;
        default: return 300;
    }
}

// Panel de una receta de la vista Visual con botones que abren la nefrona viva
// con una situación (y un fármaco) ya puestos: [valor 'situacion|farmaco', etiqueta].
// Llevan también data-especialidad/data-view para que funcionen desde
// cualquier especialidad (el enlazador único de home/index.js cambia a
// Nefrología; este módulo pone la situación).
export const panelNefronaViva = botones => ({
    tipo: 'propio', titulo: 'En la nefrona viva', nota: 'Abre la simulación de la nefrona con esta situación ya puesta.',
    render: c => { c.innerHTML = `<div class="nv-chips">${botones.map(([v, et]) => `<button type="button" class="visual-link" data-especialidad="nefrologia" data-view="nefrona" data-nefrona-viva="${v}">${et} →</button>`).join('')}</div>`; },
});

const num = v => v >= 10 ? String(Math.round(v)) : v.toFixed(v >= 1 ? 1 : 2).replace('.', ',');
const quitarIds = el => { el.removeAttribute('id'); el.querySelectorAll('[id]').forEach(n => n.removeAttribute('id')); return el; };

export function initNefronaViva({ onCategoria, mostrarVista }) {
    const raiz = document.getElementById('nefrona-viva');
    if (!raiz) return { reset: () => {} };
    const $ = sel => raiz.querySelector(sel);
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const tk = v => css.getPropertyValue(v).trim();
    const C = { texto: tk('--text-main'), suave: tk('--text-muted'), verde: tk('--accent-green'), rojo: tk('--accent-red'), amarillo: tk('--accent-yellow'), oro: tk('--accent-blue'), purpura: tk('--accent-purple') };
    // Escala de la osmolalidad: agua clara → isotónico (amarillo) → hipertónico (rojo → púrpura).
    ESCALA = [[50, [233, 226, 207]], [300, hex(C.amarillo)], [700, hex(C.rojo)], [1200, hex(C.purpura)]];
    // Partículas: la forma y el color salen de la tabla única (js/data/formas-iones.js).
    // `clave` = especie de la tabla; `r` = radio de dibujo; `tasa` = las que nacen por segundo.
    const ESPECIES = {
        h2o: { nombre: 'Agua', clave: 'agua', tasa: 22, r: 1.5 },
        na: { nombre: 'Na⁺', clave: 'na', tasa: 10, r: 2.4 },
        k: { nombre: 'K⁺', clave: 'k', tasa: 5, r: 2.3 },
        glu: { nombre: 'Glucosa', clave: 'glu', tasa: 4, r: 2.2 },
        hco3: { nombre: 'HCO₃⁻', clave: 'hco3', tasa: 4, r: 2.3 },
        urea: { nombre: 'Urea', clave: 'urea', tasa: 3.5, r: 2.2 },
        // H⁺ y NH₄⁺ no se filtran: los secreta el colector (la acidificación de la orina).
        h: { nombre: 'H⁺ (secretado)', clave: 'h', tasa: 0, r: 2.4 },
        nh4: { nombre: 'NH₄⁺', clave: 'nh4', tasa: 0, r: 2.3 },
        ca: { nombre: 'Ca²⁺', clave: 'ca', tasa: 2.5, r: 2 },
        mg: { nombre: 'Mg²⁺', clave: 'mg', tasa: 2, r: 2 },
        p: { nombre: 'Fosfato', clave: 'p', tasa: 2.5, r: 2.2 },
        celula: { nombre: 'Célula desprendida (NTA)', clave: 'celula', tasa: 0, r: 2.4 },
    };
    // Vista de célula: [nombre del rótulo, color (para rótulos y guías), especie de la tabla].
    // `ca` es el paso de Ca²⁺ y Mg²⁺ entre las células: alterna las dos formas.
    const ION = Object.fromEntries(Object.entries({
        ca2: ['Ca²⁺', 'ca'], mg2: ['Mg²⁺', 'mg'], p: ['Fosfato', 'p'], na: ['Na⁺', 'na'], k: ['K⁺', 'k'], glu: ['Glucosa', 'glu'],
        hco3: ['HCO₃⁻', 'hco3'], h: ['H⁺', 'h'], cl: ['Cl⁻', 'cl'], ca: ['Ca²⁺/Mg²⁺', 'ca'], h2o: ['H₂O', 'agua'], urea: ['Urea', 'urea'], co2: ['CO₂', 'co2'],
    }).map(([k, [n, clave]]) => [k, [n, colorParticula(clave), clave]]));

    const estado = { sit: 'normal', farm: 'ninguno', glucemia: 350, nivel: 'foto', seg: null, pausa: false, vel: 1 };
    let M = modelo('normal', 'ninguno', 350);

    // ---------- Canvas ----------
    const lienzo = $('#nv-lienzo'), ctx = lienzo.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = W * dpr; lienzo.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fondo = document.createElement('canvas');
    fondo.width = W * dpr; fondo.height = H * dpr;
    const fctx = fondo.getContext('2d'); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const trazar = (c, pts) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) c.lineTo(p[0], p[1]); c.stroke(); };
    function etiqueta(c, t, x, y, color, alinea = 'center') {
        c.font = 'bold 9px Georgia, serif';
        const w = c.measureText(t).width + 8;
        const x0 = alinea === 'center' ? x - w / 2 : alinea === 'right' ? x - w : x;
        c.fillStyle = 'rgba(23,20,15,.82)'; c.strokeStyle = alfa(color, 0.6); c.lineWidth = 0.8;
        c.beginPath(); c.roundRect(x0, y - 7, w, 13, 4); c.fill(); c.stroke();
        c.fillStyle = color; c.textAlign = 'left'; c.fillText(t, x0 + 4, y + 3);
    }

    const grosor = () => M.fra?.obstruccion ? GROSOR_OBSTRUIDO : GROSOR;
    // Capa fija: se repinta solo cuando cambia el modelo o el tramo elegido.
    function pintarFondo() {
        const c = fctx;
        c.clearRect(0, 0, W, H);
        c.fillStyle = '#2a1712'; c.fillRect(0, 0, W, BANDAS.corteza[1]);
        for (let y = BANDAS.corteza[1]; y < H; y += 2) {
            c.fillStyle = colorOsm(intersticio(y, M), 0.16 + 0.24 * profundidad(y));
            c.fillRect(0, y, W, 2);
        }
        c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, BANDAS.corteza[1], W, 1);
        c.font = '9px "Courier New", monospace'; c.fillStyle = C.suave; c.textAlign = 'center';
        for (const [t, y] of [['CORTEZA', 70], ['MÉDULA EXTERNA', 220], ['MÉDULA INTERNA', 380]]) { c.save(); c.translate(10, y); c.rotate(-Math.PI / 2); c.fillText(t, 0, 0); c.restore(); }
        c.textAlign = 'left'; c.fillStyle = alfa(C.texto, 0.45); c.fillText('mOsm/kg', 22, 154);
        c.fillStyle = alfa(C.texto, 0.6);
        for (const y of [180, 260, 340, 440]) c.fillText(String(Math.round(intersticio(y, M) / 10) * 10), 22, y + 3);
        // Otra nefrona, cortical (asa corta), que desemboca en el mismo colector: en segundo plano.
        c.lineCap = 'round'; c.lineJoin = 'round';
        c.strokeStyle = alfa('#c9a678', 0.32); c.lineWidth = 5;
        trazar(c, catmull([[52, 42], [62, 54], [74, 48], [80, 62], [70, 76], [64, 92], [64, 150], [64, 196], [70, 206], [76, 196], [76, 150], [76, 112], [84, 120], [90, 132]], 3));
        c.strokeStyle = alfa(C.texto, 0.35); c.lineWidth = 1.6; c.beginPath(); c.arc(46, 36, 9, 0, 7); c.stroke();
        c.fillStyle = alfa('#9b3f2a', 0.45); c.beginPath(); c.arc(46, 36, 6.5, 0, 7); c.fill();
        c.font = '8px Georgia, serif'; c.fillStyle = alfa(C.texto, 0.5); c.textAlign = 'left'; c.fillText('nefrona cortical', 24, 16);
        // Arteriola eferente → capilares peritubulares (corteza) → vasa recta (médula) → vena.
        const efer = [[212, 66], [196, 72], [186, 88], [196, 110], [232, 122], [276, 136], [301, 166]];
        c.strokeStyle = alfa(C.rojo, 0.3); c.lineWidth = 1.5;
        trazar(c, catmull([[186, 88], [160, 104], [134, 112], [112, 124]], 4));
        trazar(c, catmull([[232, 122], [256, 102], [300, 96], [318, 76], [300, 42], [268, 36]], 4));
        c.strokeStyle = alfa(C.rojo, 0.55); c.lineWidth = 2.4;
        trazar(c, catmull([[301, 166], [302, 220], [303, 404], [308, 412], [313, 404], [314, 220], [315, 166], [326, 138], [344, 122], [362, 116]], 4));
        c.strokeStyle = '#8f4530'; c.lineWidth = 4.5;
        trazar(c, catmull(efer.slice(0, 4), 3));
        c.lineWidth = 3; trazar(c, catmull(efer.slice(3), 3));
        // Arteriola aferente (más ancha)
        c.strokeStyle = C.rojo; c.lineWidth = 7;
        trazar(c, catmull([[150, 8], [184, 30], [212, 54]], 3));
        c.font = '8px Georgia, serif'; c.fillStyle = alfa(C.texto, 0.6);
        c.fillText('aferente', 130, 14); c.fillText('eferente', 168, 138);
        c.fillStyle = alfa(C.rojo, 0.75); c.textAlign = 'right'; c.fillText('vasa recta', 284, 380); c.textAlign = 'left';
        // Glomérulo: cápsula de Bowman y ovillo capilar
        if (estado.seg === 'glomerulo') { c.strokeStyle = C.oro; c.lineWidth = 6; c.beginPath(); c.arc(G.x, G.y, G.r + 4, 0, 7); c.stroke(); }
        c.strokeStyle = alfa(C.texto, 0.7); c.lineWidth = 3;
        c.beginPath(); c.arc(G.x, G.y, G.r + 3, 0.15, Math.PI * 2 - 0.15); c.stroke();
        c.fillStyle = alfa(C.amarillo, 0.18); c.beginPath(); c.arc(G.x, G.y, G.r + 1, 0, 7); c.fill();
        const ovillo = [[-6, -6, 7], [5, -7, 6.5], [-8, 5, 6.5], [4, 6, 7.5], [10, 0, 5.5], [-1, 0, 6]];
        c.fillStyle = '#9b3f2a';
        for (const [dx, dy, r] of ovillo) { c.beginPath(); c.arc(G.x + dx, G.y + dy, r, 0, 7); c.fill(); }
        c.strokeStyle = alfa(CLARO.rojo, 0.6); c.lineWidth = 1;
        for (const [dx, dy, r] of ovillo.slice(0, 4)) { c.beginPath(); c.arc(G.x + dx, G.y + dy, r - 2, 0, 7); c.stroke(); }
        // Túbulo: pared con células y luz coloreada por la osmolalidad
        for (const t of TRAMOS.slice(1)) {
            const [ext, luz] = grosor()[t];
            const pts = RUTA.filter(p => p.s >= LIMITES[t][0] - 3 && p.s <= LIMITES[t][1] + 3);
            const xy = pts.map(p => [p.x, p.y]);
            if (estado.seg === TRAMO_SEG[t]) { c.strokeStyle = C.oro; c.lineWidth = ext + 7; c.lineCap = 'round'; trazar(c, xy); }
            c.strokeStyle = t === 'col' ? '#cdb89a' : t === 'desc' || t === 'ascd' ? '#bfa98a' : '#c9a678';
            c.lineWidth = ext; c.lineCap = 'round'; trazar(c, xy);
            c.strokeStyle = 'rgba(70,45,25,.55)'; c.lineWidth = 0.8;
            for (let s = LIMITES[t][0] + 3; s < LIMITES[t][1] - 2; s += t === 'desc' || t === 'ascd' ? 9 : 7) {
                const p = enS(s);
                for (const lado of [-1, 1]) {
                    const r1 = luz / 2 + 0.6, r2 = ext / 2;
                    c.beginPath(); c.moveTo(p.x + p.nx * r1 * lado, p.y + p.ny * r1 * lado); c.lineTo(p.x + p.nx * r2 * lado, p.y + p.ny * r2 * lado); c.stroke();
                }
            }
            if (ext >= 11) {
                c.fillStyle = 'rgba(110,70,90,.55)';
                for (let s = LIMITES[t][0] + 6; s < LIMITES[t][1] - 3; s += 7) {
                    const p = enS(s), d = (ext + luz) / 4;
                    for (const lado of [-1, 1]) { c.beginPath(); c.arc(p.x + p.nx * d * lado, p.y + p.ny * d * lado, 0.9, 0, 7); c.fill(); }
                }
            }
            if (M.fra?.nta && (t === 'tp1' || t === 'tp2' || t === 'tal')) { // células desprendidas: huecos irregulares con la membrana basal desnuda
                const r1 = luz / 2 + 0.4, r2 = ext / 2;
                for (let s0 = LIMITES[t][0] + 6, i = 0; s0 < LIMITES[t][1] - 8; i++) {
                    const h = Math.abs(Math.sin(i * 12.9898 + t.length * 78.233)), largo = 3 + h * 6, lado = h > 0.5 ? 1 : -1;
                    const pts = []; for (let u = 0; u <= largo; u += 1) pts.push(enS(s0 + u));
                    c.fillStyle = 'rgba(28,20,16,.85)'; c.beginPath();
                    pts.forEach((p, k) => c[k ? 'lineTo' : 'moveTo'](p.x + p.nx * r1 * lado, p.y + p.ny * r1 * lado));
                    pts.slice().reverse().forEach(p => c.lineTo(p.x + p.nx * (r2 - 0.8) * lado, p.y + p.ny * (r2 - 0.8) * lado));
                    c.closePath(); c.fill();
                    c.strokeStyle = alfa(C.texto, 0.7); c.lineWidth = 0.7; c.beginPath();
                    pts.forEach((p, k) => c[k ? 'lineTo' : 'moveTo'](p.x + p.nx * (r2 - 0.4) * lado, p.y + p.ny * (r2 - 0.4) * lado)); c.stroke();
                    c.fillStyle = '#9c7a52'; const q = pts[Math.floor(pts.length / 2)];
                    c.beginPath(); c.arc(q.x + q.nx * (r1 - 1.2) * lado, q.y + q.ny * (r1 - 1.2) * lado, 1.1, 0, 7); c.fill();
                    s0 += 12 + h * 22;
                }
            }
            c.lineWidth = luz; c.lineCap = 'butt';
            for (let i = 1; i < pts.length; i++) {
                c.strokeStyle = colorOsm(osmLuz(pts[i], M), 0.95);
                c.beginPath(); c.moveTo(pts[i - 1].x, pts[i - 1].y); c.lineTo(pts[i].x, pts[i].y); c.stroke();
            }
            if (t === 'tp1' || t === 'tp2') { // ribete en cepillo
                c.strokeStyle = alfa(C.texto, 0.35); c.lineWidth = 0.6;
                for (let s = LIMITES[t][0]; s < LIMITES[t][1]; s += 2.2) {
                    const p = enS(s);
                    for (const lado of [-1, 1]) { c.beginPath(); c.moveTo(p.x + p.nx * luz / 2 * lado, p.y + p.ny * luz / 2 * lado); c.lineTo(p.x + p.nx * (luz / 2 - 1.4) * lado, p.y + p.ny * (luz / 2 - 1.4) * lado); c.stroke(); }
                }
            }
        }
        c.lineCap = 'round';
        c.fillStyle = C.verde; c.beginPath(); c.arc(214, 78, 3.3, 0, 7); c.fill(); // mácula densa
        // Acuaporinas-2 en el colector según la ADH
        const nAqp = Math.round(M.a * 16);
        c.fillStyle = alfa(C.texto, 0.9);
        for (let i = 0; i < nAqp; i++) {
            const p = enS(LIMITES.col[0] + 20 + (i + 0.5) * ((LIMITES.col[1] - LIMITES.col[0] - 40) / nAqp));
            for (const lado of [-1, 1]) c.fillRect(p.x + 7.5 * lado - 1, p.y - 1.5, 2, 3);
        }
        // Bloqueo del fármaco y fallo de la situación (ATR): ✕ sobre el tramo.
        // lado: 1 = el del fármaco; -1 = el contrario (para que no se pisen).
        const marcar = (segmento, texto, marcas, lado = 1, tramo = SEG_TRAMO[segmento], en = null) => {
            const t = tramo, [a, b] = LIMITES[t];
            c.strokeStyle = CLARO.rojo; c.lineWidth = 2.2;
            for (const u of marcas) {
                const p = enS(a + (b - a) * u), x = p.x + p.nx * 11 * lado, y = p.y + p.ny * 11 * lado;
                c.beginPath(); c.moveTo(x - 4, y - 4); c.lineTo(x + 4, y + 4); c.moveTo(x + 4, y - 4); c.lineTo(x - 4, y + 4); c.stroke();
            }
            if (en) { etiqueta(c, texto, en[0], en[1], CLARO.rojo); return; }
            const p = enS(a + (b - a) * marcas[0]), dx = p.nx * lado;
            etiqueta(c, texto, p.x + dx * 18, p.y + p.ny * lado * 18 - 8, CLARO.rojo, lado === 1 ? 'center' : dx > 0.5 ? 'left' : dx < -0.5 ? 'right' : 'center');
        };
        const f = farmacosNefrona.find(x => x.id === estado.farm);
        if (f.segmento) { const t = SEG_TRAMO[f.segmento]; marcar(f.segmento, f.nombre, t === 'col' ? [0.22, 0.42] : t === 'tal' ? [0.25, 0.55, 0.8] : [0.35, 0.7]); }
        for (const d of M.efectos) {
            const t = d.tramo ?? SEG_TRAMO[d.segmento];
            if (d.tipo === 'bloquea') { marcar(d.segmento, d.etiqueta, t === 'col' ? [0.6, 0.78] : [0.3, 0.7], -1, t, d.etiquetaEn); continue; }
            const [a, b] = LIMITES[t], p = enS(a + (b - a) * 0.5); // estimula: rótulo verde, sin ✕
            if (d.etiqueta) etiqueta(c, d.etiqueta, d.etiquetaEn?.[0] ?? p.x - p.nx * 18, d.etiquetaEn?.[1] ?? p.y - p.ny * 18, C.verde);
        }
        if (M.acido?.etiqueta) etiqueta(c, M.acido.etiqueta, 190, 250, CLARO.rojo);
        // FRA: cilindros en el colector, obstrucción y perfusión
        if (M.fra) {
            const hialino = !M.fra.nta && !M.fra.obstruccion;
            if (!M.fra.obstruccion && !M.fra.volumenOn) for (const y of [300, 384]) {
                c.fillStyle = hialino ? alfa(C.texto, 0.4) : '#7a5230';
                c.beginPath(); c.roundRect(88.5, y, 7, 24, 3.5); c.fill();
                if (!hialino) { c.fillStyle = '#c9a678'; for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(90.5 + (k % 2) * 3, y + 4 + k * 4, 0.9, 0, 7); c.fill(); } }
            }
            if (M.fra.obstruccion) {
                c.fillStyle = '#3b2a1c'; c.strokeStyle = alfa(C.texto, 0.5); c.lineWidth = 1;
                c.beginPath(); c.ellipse(92, 452, 10, 7, 0, 0, 7); c.fill(); c.stroke();
                etiqueta(c, 'obstrucción', 160, 436, CLARO.rojo);
                etiqueta(c, '↑ presión hacia atrás', 160, 300, CLARO.rojo);
            }
            if (!M.fra.nta && !M.fra.obstruccion) etiqueta(c, '↓ perfusión renal', 76, 40, CLARO.rojo);
            dibujarRabdo(c, M.fra, etiqueta, CLARO.rojo, C.verde);
            if (M.fra.nta) etiqueta(c, 'células desprendidas', 300, 186, CLARO.rojo, 'right');
        }
        // Lo que sigue en la luz (L/día)
        etiqueta(c, `${num(CIF.filtradoL * M.tfg)} L`, 252, 22, C.texto);
        etiqueta(c, `${num(CIF.filtradoL * M.tfg * (1 - CIF.aguaProximal))} L`, 318, 152, C.texto, 'right');
        etiqueta(c, `${num(M.aguaCol)} L`, 274, 452, C.texto, 'right');
        etiqueta(c, `${num(M.aguaCol)} L`, 120, 128, C.texto, 'left');
        etiqueta(c, M.fra?.obstruccion ? `${num(M.V)} L` : enPico() ? `${num(M.V * 1000 / 1440)} ml/min en el pico` : `${num(M.V)} L · ${Math.round(M.Uosm)}`, 104, 462, C.oro, 'left');
    }

    // ---------- Partículas ----------
    let parts = [];
    const acum = {};
    const globulos = Array.from({ length: 9 }, (_, i) => ({ a: i * 0.7, r: 4 + (i % 3) * 3, v: 1.2 + (i % 4) * 0.25 }));
    function nacer(esp) {
        const r = M.r[esp];
        let fin = LARGO, salir = false;
        for (const t of TRAMOS) {
            if (Math.random() < (r[t] || 0)) { const [a, b] = LIMITES[t], u0 = esp === 'urea' && t === 'col' ? 0.6 : 0.1; fin = a + (b - a) * (u0 + (0.95 - u0) * Math.random()); salir = true; break; }
        }
        const ang = Math.random() * Math.PI * 2, rr = Math.random() * 10;
        parts.push({ esp, s: 0, fin, salir, modo: 'nace', t: 0, ox: Math.cos(ang) * rr, oy: Math.sin(ang) * rr, lat: Math.random() - 0.5, vel: 62 + Math.random() * 22 });
    }
    function secretar(esp) {
        const [a, b] = LIMITES.col;
        parts.push({ esp, s: a + (b - a) * (0.08 + 0.8 * Math.random()), fin: LARGO, salir: false, modo: 'entra', t: 0, lado: Math.random() < 0.5 ? -1 : 1, lat: Math.random() - 0.5, vel: 62 + Math.random() * 20 });
    }
    // Urea que vuelve de la médula interna a la rama ascendente delgada (se recicla).
    function secretarUrea() {
        const [a, b] = LIMITES.ascd, s = a + (b - a) * (0.05 + 0.5 * Math.random());
        const [c0, c1] = LIMITES.col, sale = Math.random() < M.r.urea.col;
        parts.push({ esp: 'urea', s, fin: sale ? c0 + (c1 - c0) * (0.6 + 0.35 * Math.random()) : LARGO, salir: sale, modo: 'entra', t: 0, lado: Math.random() < 0.5 ? -1 : 1, lat: Math.random() - 0.5, vel: 62 + Math.random() * 20 });
    }
    function paso(dt) {
        for (const esp in ESPECIES) {
            acum[esp] = (acum[esp] || 0) + ESPECIES[esp].tasa * (esp === 'glu' ? M.gluSpawn : esp === 'hco3' ? M.hco3Spawn : esp === 'ca' ? M.caSpawn : 1) * M.tfg * (reducido ? 0.5 : 1) * dt;
            while (acum[esp] >= 1) { acum[esp] -= 1; nacer(esp); }
        }
        acum.urea = (acum.urea || 0) + 4 * M.r.urea.col * M.tfg * dt;
        while (acum.urea >= 1) { acum.urea -= 1; secretarUrea(); }
        acum.ksec = (acum.ksec || 0) + 24 * M.kSec * dt;
        while (acum.ksec >= 1) { acum.ksec -= 1; secretar('k'); }
        acum.hsec = (acum.hsec || 0) + 3 * M.hSec * dt;
        while (acum.hsec >= 1) { acum.hsec -= 1; secretar('h'); }
        acum.nh4 = (acum.nh4 || 0) + 2 * M.nh4Sec * dt;
        while (acum.nh4 >= 1) { acum.nh4 -= 1; secretar('nh4'); }
        if (M.fra?.nta) {
            acum.cel = (acum.cel || 0) + 1.4 * dt;
            while (acum.cel >= 1) {
                acum.cel -= 1;
                const t = ['tp1', 'tp2', 'tal'][Math.floor(Math.random() * 3)], [a, b] = LIMITES[t];
                parts.push({ esp: 'celula', s: a + (b - a) * Math.random(), fin: LARGO, salir: false, modo: 'entra', t: 0, lado: Math.random() < 0.5 ? -1 : 1, lat: 0, vel: 55 });
            }
        }
        for (const p of parts) {
            p.t += dt;
            if (p.modo === 'nace') { if (p.t > 0.45) { p.modo = 'luz'; p.t = 0; } }
            else if (p.modo === 'entra') { if (p.t > 0.6) { p.modo = 'luz'; p.t = 0; } }
            else if (p.modo === 'luz') {
                p.s += p.vel * dt;
                if (p.salir && p.s >= p.fin) { p.modo = 'sale'; p.t = 0; p.lado = Math.random() < 0.5 ? -1 : 1; }
                else if (p.s >= LARGO) {
                    // Con obstrucción no sale: se queda en el colector y se va acumulando.
                    if (M.fra?.obstruccion) { p.modo = 'retenida'; p.s = LARGO - 4 - Math.random() * 70; } else p.modo = 'orina';
                    p.t = 0;
                }
            }
        }
        parts = parts.filter(p => !(p.modo === 'sale' && p.t > 0.8) && !(p.modo === 'orina' && p.t > 1.1) && !(p.modo === 'retenida' && p.t > 9));
        for (const g of globulos) g.a += g.v * dt;
    }
    function dibujar() {
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(fondo, 0, 0, W, H);
        // Hematíes: circulan por el ovillo y nunca pasan.
        for (const g of globulos) pintarParticula(ctx, 'rbc', G.x + Math.cos(g.a) * g.r, G.y + Math.sin(g.a * 1.3) * g.r * 0.8, 1.6, { giro: g.a });
        for (const esp in ESPECIES) {
            const e = ESPECIES[esp];
            for (const p of parts) {
                if (p.esp !== esp) continue;
                let x, y, al = 1;
                if (p.modo === 'nace') {
                    const u = p.t / 0.45, q = enS(0);
                    x = G.x + p.ox * (1 - u) + (q.x - G.x) * u * 0.6; y = G.y + p.oy * (1 - u) + (q.y - G.y) * u * 0.6; al = Math.min(1, u * 2);
                } else {
                    const q = enS(Math.min(p.s, LARGO)), half = grosor()[q.tramo][1] / 2 - 0.6;
                    x = q.x + q.nx * p.lat * half * 1.6; y = q.y + q.ny * p.lat * half * 1.6;
                    if (p.modo === 'sale') { const d = p.t / 0.8; x += q.nx * p.lado * d * 16; y += q.ny * p.lado * d * 16; al = 1 - d; }
                    if (p.modo === 'entra') { const d = 1 - p.t / 0.6; x += q.nx * p.lado * d * 14; y += q.ny * p.lado * d * 14; al = 1 - d * 0.5; }
                    if (p.modo === 'orina') { y += p.t * 14; al = 1 - p.t / 1.1; }
                }
                ctx.globalAlpha = Math.max(0, al) * (esp === 'h2o' ? 0.65 : 1);
                pintarParticula(ctx, e.clave, x, y, e.r);
            }
        }
        ctx.globalAlpha = 1;
    }
    // Bucle: solo mientras el escenario se ve y está en el nivel de nefrona.
    let visible = false, ultimo = 0, raf = 0;
    function bucle(ts) {
        raf = 0;
        const dt = Math.min(0.05, (ts - (ultimo || ts)) / 1000); ultimo = ts;
        if (!estado.pausa) paso(dt * estado.vel);
        dibujar();
        programar();
    }
    function programar() { if (!raf && visible && estado.nivel === 'nefrona') raf = requestAnimationFrame(bucle); }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; ultimo = 0; programar(); }).observe($('#nv-escenario'));

    // ---------- Vista de célula ----------
    const glifo = (tipo, x, y, r = tipo === 'h2o' ? 2.8 : 3.5) => svgParticula(ION[tipo][2], x, y, r);
    // Un ion que viaja por una ruta (SMIL); con movimiento reducido se queda quieto.
    function viajero(ion, ruta, dur, retraso, apagado) {
        const g = glifo(ion, 0, 0);
        if (reducido) return `<g transform="translate(${ruta.match(/M(-?[\d.]+) (-?[\d.]+)/).slice(1).join(' ')})">${g}</g>`;
        const fade = apagado ? `<animate attributeName="opacity" values="1;1;0" keyTimes="0;.75;1" dur="${dur}s" begin="${retraso}s" repeatCount="indefinite"/>` : '';
        return `<g>${g}<animateMotion dur="${dur}s" begin="${retraso}s" repeatCount="indefinite" path="${ruta}"/>${fade}</g>`;
    }
    const bloqueado = (seg, canal) => {
        if (M.fra?.nta && (seg === 'tubulo-proximal' || seg === 'asa-ascendente-gruesa')) return { nombre: 'NTA', danio: true };
        const f = farmacosNefrona.find(x => x.id === estado.farm);
        if (f.segmento === seg && f.canal === canal) return f;
        return efecto(seg, canal, 'bloquea'); // lo que falla en la situación (ATR, PTH, FGF23)
    };
    const efecto = (seg, canal, tipo) => M.efectos.find(e => e.tipo === tipo && e.segmento === seg && e.canal === canal) || null;
    const txt = (x, y, t, { size = 8.5, color = C.texto, ancla = 'start', peso = '', fam = 'Georgia' } = {}) =>
        `<text x="${x}" y="${y}" text-anchor="${ancla}" font-size="${size}" fill="${color}" font-family="${fam}"${peso ? ` font-weight="${peso}"` : ''}>${t}</text>`;
    // Una fila por transportador, más la vía entre células, el agua y la bomba.
    // La célula tiene su forma (alta con ribete, cúbica o plana) y cada ion
    // entra y sale por su propia puerta; solo el Na⁺ sale por la bomba.
    const ALTO = { canal: n => 30 + 18 * n, aqp: 64, enzima: 76, para: 46, agua: 40, bomba: 66, divisor: 22 };
    // Si no caben (proximal: 3 transportadores + enzima + paso entre células + agua + bomba), filas más bajas y célula más alta.
    const ALTO_C = { canal: n => 28 + 16 * n, aqp: 60, enzima: 70, para: 42, agua: 36, bomba: 60, divisor: 20 };
    function filasCelula(d) {
        const out = [];
        let bombaPuesta = false;
        const ponerBomba = () => { if (d.bomba && !bombaPuesta) { out.push({ t: 'bomba' }); bombaPuesta = true; } };
        d.canales.forEach(cn => {
            if (cn.intercalar) { ponerBomba(); out.push({ t: 'divisor' }); }
            out.push(cn.enzima ? { t: 'enzima', cn } : { t: cn.nombre === 'Acuaporina-2' ? 'aqp' : 'canal', cn });
        });
        if (d.paracelular) out.push({ t: 'para' });
        if (d.agua) out.push({ t: 'agua' });
        ponerBomba();
        const medir = A => out.reduce((s, f) => s + (f.t === 'canal' ? A.canal(f.cn.flujo.length) : A[f.t]), 0);
        const compacta = medir(ALTO) + 4 * (out.length + 1) > 392;
        const A = compacta ? ALTO_C : ALTO, [y0, y1] = compacta ? [44, 456] : [52, 448];
        const hueco = Math.max(3, (y1 - y0 - 4 - medir(A)) / (out.length + 1));
        let y = y0 + 4 + hueco;
        for (const f of out) { f.y0 = y; f.h = f.t === 'canal' ? A.canal(f.cn.flujo.length) : A[f.t]; y += f.h + hueco; }
        out.y0 = y0; out.y1 = y1;
        return out;
    }
    function svgCelula(seg) {
        if (seg === 'glomerulo') return svgGlomerulo();
        const d = segmentosNefrona[seg];
        const plano = d.epitelio === 'plano';
        const xa = plano ? 148 : 88, xb = plano ? 204 : 272, xm = (xa + xb) / 2;
        const danada = M.fra?.nta && (seg === 'tubulo-proximal' || seg === 'asa-ascendente-gruesa');
        // Osmolalidad a la profundidad tocada: en las ramas delgadas la luz va un poco por debajo del intersticio.
        const medular = seg === 'asa-descendente' || seg === 'asa-ascendente-delgada';
        const yT = clamp(estado.tapY ?? 380, BANDAS.externa[0], BANDAS.interna[1]);
        const osmInt = medular ? Math.round(intersticio(yT, M)) : 300;
        const osmLuzSeg = medular ? Math.round(osmInt > 310 ? osmInt * 0.94 : 300)
            : { 'tubulo-proximal': 300, 'asa-ascendente-gruesa': M.Umin >= 280 ? 320 : 200, 'tubulo-distal': finTcd(M), colector: Math.round(M.Uosm) }[seg];
        const ahorr = estado.farm === 'espironolactona' || estado.farm === 'amilorida' || !!M.acido?.ahorraK;
        const filas = filasCelula(d);
        const lblX = plano ? xb + 8 : xa + 14;
        let fondo = '', capas = '', textos = '';
        const ida = y => `M10 ${y} L${xa} ${y} C${xm - 18} ${y} ${xm - 24} ${y + 14} ${xm} ${y + 14} S${xb - 12} ${y} ${xb} ${y} L322 ${y}`;
        const vuelta = y => `M322 ${y} L${xb} ${y} C${xb - 12} ${y} ${xm + 24} ${y + 14} ${xm} ${y + 14} S${xa + 18} ${y} ${xa} ${y} L10 ${y}`;
        const desdeCelula = y => `M${xm} ${y + 14} C${xm - 24} ${y + 14} ${xa + 18} ${y} ${xa} ${y} L10 ${y}`;
        const guia = (ruta, col, off) => `<path d="${ruta}" fill="none" stroke="${col}" stroke-width="1.2" stroke-dasharray="2 5" opacity="${off ? 0.16 : 0.42}"/>`;
        const flujoIones = (ruta, ion, n, dur, off, k = 0) => {
            let g = '';
            for (let q = 0; q < n; q++) g += viajero(ion === 'ca' ? (q % 2 ? 'mg2' : 'ca2') : ion, ruta, dur, -(q * dur / n + k * 0.4).toFixed(2), off);
            return g;
        };
        const puerta = (x, y, color, alto = 14) => `<rect x="${x - 5}" y="${y - alto / 2}" width="10" height="${alto}" rx="4" fill="${color}" stroke="#17140f"/>`;
        const rotuloPuerta = (t, y) => plano ? txt(xb + 8, y + 3, t, { size: 7, color: C.suave }) : txt(xb - 9, y - 7, t, { size: 7, color: C.suave, ancla: 'end' });
        const cruz = (x, y) => `<path d="M${x - 9} ${y - 10} L${x + 9} ${y + 10} M${x + 9} ${y - 10} L${x - 9} ${y + 10}" stroke="${CLARO.rojo}" stroke-width="3.2"/>`;

        // Cuerpo de las células: se parte en la vía entre células y entre la célula principal y la intercalar.
        const cortes = [];
        for (const f of filas) {
            if (f.t === 'para') cortes.push([f.y0 + f.h / 2 - 7, f.y0 + f.h / 2 + 7]);
            if (f.t === 'divisor') cortes.push([f.y0 + f.h / 2 - 1.5, f.y0 + f.h / 2 + 1.5]);
        }
        let yIni = filas.y0;
        const tramos = [];
        for (const [a, b] of cortes) { tramos.push([yIni, a]); yIni = b; }
        tramos.push([yIni, filas.y1]);
        for (const [a, b] of tramos) {
            fondo += danada
                ? `<rect x="${xa}" y="${a}" width="${xb - xa}" height="${b - a}" fill="rgba(205,184,154,.07)" stroke="#cdb89a" stroke-dasharray="6 5"/>`
                : `<rect x="${xa}" y="${a}" width="${xb - xa}" height="${b - a}" rx="${plano ? 3 : 6}" fill="rgba(205,184,154,.16)" stroke="#cdb89a"/>`;
        }
        if (danada) fondo += `<path d="M${xa - 4} 120 q-14 18 -6 36 M${xa - 8} 300 q-12 14 -4 30" stroke="#9c7a52" stroke-width="5" fill="none"/>`;
        if (d.cepillo && !danada) for (const [a, b] of tramos) for (let y = a + 3; y < b - 2; y += 6.1) fondo += `<path d="M${xa} ${y} h-8" stroke="#cdb89a" stroke-width="1.6"/>`;
        // Núcleo y mitocondrias, detrás de todo y en los huecos entre filas.
        const huecos = [];
        let prev = filas.y0;
        for (const f of filas) { huecos.push([prev, f.y0]); prev = f.y0 + f.h; }
        huecos.push([prev, filas.y1]);
        const grande = huecos.reduce((m, h) => h[1] - h[0] > m[1] - m[0] ? h : m, [0, 0]);
        if (grande[1] - grande[0] > 22) fondo += `<ellipse cx="${xm}" cy="${(grande[0] + grande[1]) / 2}" rx="${plano ? 14 : 24}" ry="${Math.min(14, (grande[1] - grande[0]) / 2 - 2)}" fill="${alfa(C.purpura, 0.3)}" stroke="${alfa(C.purpura, 0.65)}"/>`;
        for (let i = 0; i < (d.mito || 0); i++) {
            const y = 70 + (i + 0.5) * (370 / (d.mito || 1)), x = plano ? xm : (i % 2 ? xb - 30 : xa + 44);
            fondo += `<g opacity=".7" transform="translate(${x} ${y}) rotate(${(i * 37) % 50 - 25})"><ellipse rx="${plano ? 9 : 14}" ry="5" fill="${alfa(C.purpura, 0.22)}" stroke="${alfa(CLARO.na, 0.55)}"/><path d="M-6 -3 v6 M0 -4 v8 M6 -3 v6" stroke="${alfa(CLARO.na, 0.45)}"/></g>`;
        }
        if (filas.some(f => f.t === 'divisor')) textos += txt(xa + 6, 64, 'Célula principal', { size: 8, color: C.suave });

        for (const f of filas) {
            const y = f.y0 + 12;
            if (f.t === 'canal' || f.t === 'aqp') {
                const cn = f.cn, bl = bloqueado(seg, cn.nombre), act = efecto(seg, cn.nombre, 'activa');
                // ROMK de la rama gruesa recicla el K⁺ que trae NKCC2: sin NKCC2, no hay qué reciclar.
                const sinK = !bl && cn.depende && bloqueado(seg, cn.depende);
                const esAqp2 = f.t === 'aqp', esUrea = cn.nombre === 'Transportador de urea';
                let veces = 3, dur = 3.2;
                if (cn.nombre === 'ROMK') { const fk = Math.sqrt(M.naTcd / 0.039) * (ahorr ? 0.3 : 1) * (M.acido?.kMult ?? 1); veces = Math.max(1, Math.min(6, Math.round(3 * fk))); dur = 3.6 / clamp(fk, 0.6, 2); }
                if (esAqp2) veces = Math.round(M.a * 5);
                if (esUrea) veces = Math.round(M.a * 4);
                if (act) { veces = 5; dur = 2.4; }
                const sinCanal = (esAqp2 || esUrea) && veces === 0, off = !!bl || danada || sinCanal || !!sinK;
                const n = cn.flujo.length;
                const yy = k => (esAqp2 ? y + 22 : y) + k * 18;
                cn.flujo.forEach(([ion, dir, salida], k) => {
                    const yk = yy(k), col = ION[ion][1], desde = ion === 'h' || cn.desdeCelula;
                    const ruta = dir === 'r' ? ida(yk) : desde ? desdeCelula(yk) : vuelta(yk);
                    const corta = dir === 'r' ? `M10 ${yk} L${xa - 6} ${yk}` : desde ? `M${xm} ${yk + 14} L${xa + 8} ${yk}` : `M322 ${yk} L${xb + 6} ${yk}`;
                    capas += guia(ruta, col, off);
                    capas += flujoIones(off ? corta : ruta, ion, off ? 2 : Math.max(1, veces), off ? 1.6 : dur, off, k);
                    // Puerta basolateral: la bomba (verde) para el Na⁺; la suya propia para el resto.
                    if (dir === 'r' && !plano) capas += salida ? puerta(xb, yk, C.oro, 10) : `<circle cx="${xb}" cy="${yk}" r="5" fill="${C.verde}"/>`;
                    if (dir === 'r' && plano && salida) capas += puerta(xb, yk, C.oro, 10);
                    if (salida && !esUrea && salida !== cn.nombre) textos += rotuloPuerta(salida, yk);
                    textos += desde ? txt(xa - 6, yk - 6, ION[ion][0], { size: 8, color: col, ancla: 'end' })
                        : txt(dir === 's' ? 352 : 8, yk - 5, ION[ion][0], { size: 8, color: col, ancla: dir === 's' ? 'end' : 'start' });
                });
                // Puerta apical (con tantas acuaporinas como ADH haya).
                if (esAqp2) for (let q = 0; q < veces; q++) capas += puerta(xa, y + q * 9, off ? '#5a4a3a' : C.oro, 7);
                else if (cn.nombre !== 'Paso pasivo') capas += `<rect x="${xa - 6}" y="${y - 11}" width="12" height="${18 * (n - 1) + 22}" rx="5" fill="${off ? '#5a4a3a' : C.oro}" stroke="#17140f"/>`;
                const yl = f.y0 + f.h - 4;
                textos += txt(lblX, yl - (cn.intercalar || esAqp2 || cn.nombre === 'ROMK' || cn.depende || esUrea || bl || danada || sinCanal || act ? 11 : 0), `${cn.nombre}${esAqp2 && !sinCanal ? ` ×${veces} (ADH)` : ''}`, { size: plano ? 9 : 10, peso: 'bold' });
                let nota = '';
                if (danada) nota = 'Célula dañada (NTA): apenas reabsorbe';
                else if (bl) nota = bl.nota ?? `Bloqueado: ${bl.nombre}${bl.receptor ? ' (receptor de aldosterona)' : ''}`;
                else if (sinK) nota = `Sin K⁺ que reciclar: ${sinK.nombre} bloquea ${cn.depende}`;
                else if (act) nota = act.nota;
                else if (cn.depende) nota = `devuelve a la luz el K⁺ de ${cn.depende}`;
                else if (sinCanal) nota = esAqp2 ? 'Sin ADH: no hay acuaporinas en la membrana' : 'Sin ADH: apenas sale urea';
                else if (cn.nombre === 'ROMK' && M.acido?.kMult > 1) nota = 'secreta más K⁺: hipopotasemia (fisiología general)';
                else if (cn.nombre === 'ROMK') nota = veces > 3 ? 'más flujo distal: secreta más' : veces < 3 ? 'menos ENaC: secreta menos' : 'secreción basal';
                else if (esUrea) nota = 'con ADH sale a la médula interna';
                if (nota) textos += txt(lblX, yl, nota, { size: 8, color: danada || bl || sinCanal || sinK ? CLARO.rojo  : act ? C.verde : C.suave });
                if (bl && !danada) capas += cruz(xa, y + 4);
            } else if (f.t === 'enzima') {
                // H⁺ + HCO₃⁻ → CO₂ en la luz; el CO₂ entra y el HCO₃⁻ se regenera dentro y sale a la sangre.
                const bl = bloqueado(seg, f.cn.nombre), off = !!bl || danada;
                const yk = y + 6;
                const col = ION.hco3[1];
                capas += guia(`M10 ${yk} L${xa - 14} ${yk}`, col, false);
                capas += flujoIones(off ? `M10 ${yk} L${xa - 8} ${yk}` : `M10 ${yk} L${xa - 14} ${yk}`, 'hco3', 2, 2.4, true);
                textos += txt(8, yk - 5, 'HCO₃⁻ filtrado', { size: 8, color: col });
                if (!off) {
                    capas += guia(`M${xa - 14} ${yk} L${xm} ${yk + 14}`, ION.co2[1], false) + flujoIones(`M${xa - 14} ${yk} L${xm} ${yk + 14}`, 'co2', 2, 2.4, true, 1);
                    const sal = `M${xm} ${yk + 14} S${xb - 12} ${yk} ${xb} ${yk} L322 ${yk}`;
                    capas += guia(sal, col, false) + flujoIones(sal, 'hco3', 2, 2.4, false, 2) + puerta(xb, yk, C.oro, 10);
                    textos += rotuloPuerta('Salida HCO₃⁻', yk);
                }
                for (const [x, yy] of [[xa - 18, yk + 14], [xm + 16, yk + 26]]) {
                    capas += `<circle cx="${x}" cy="${yy}" r="7" fill="${off ? '#3a3027' : alfa(C.verde, 0.35)}" stroke="${off ? CLARO.rojo : C.verde}"/>` + txt(x, yy + 3, 'AC', { size: 7, ancla: 'middle', color: C.texto });
                    if (off) capas += `<path d="M${x - 6} ${yy - 6} L${x + 6} ${yy + 6}" stroke="${CLARO.rojo}" stroke-width="2"/>`;
                }
                const yl = f.y0 + f.h - 4;
                textos += txt(lblX, yl - 11, 'Anhidrasa carbónica (enzima)', { size: 10, peso: 'bold' });
                textos += txt(lblX, yl, off ? (danada ? 'Célula dañada (NTA)' : bl.nota ?? 'Bloqueada: el HCO₃⁻ se queda en la luz') : 'H⁺ + HCO₃⁻ → CO₂ + H₂O, y al revés dentro', { size: 8, color: off ? CLARO.rojo : C.suave });
            } else if (f.t === 'para') {
                const yc = f.y0 + f.h / 2;
                // Sin la carga positiva de la luz (NKCC2 bloqueado), el Ca²⁺ y el Mg²⁺ se quedan en la luz.
                const sinVoltaje = d.paracelular.depende && bloqueado(seg, d.paracelular.depende);
                const paraOff = danada || !!sinVoltaje;
                d.paracelular.iones.forEach((ion, k) => {
                    const yk = yc - 3 + k * 6 - (d.paracelular.iones.length - 1) * 3, ruta = `M10 ${yk} L322 ${yk}`;
                    capas += guia(ruta, ION[ion][1], paraOff) + flujoIones(sinVoltaje ? `M10 ${yk} L${xa - 6} ${yk}` : ruta, ion, sinVoltaje ? 2 : 3, sinVoltaje ? 1.6 : 2.8, !!sinVoltaje, k);
                    textos += txt(8 + k * 26, yk - 7, ION[ion][0], { size: 8, color: ION[ion][1] });
                });
                textos += txt(xm, f.y0 + 4, d.paracelular.etiqueta, { size: 8.5, ancla: 'middle', peso: 'bold' });
                if (sinVoltaje && !danada) textos += txt(xm, f.y0 + f.h, 'Sin luz positiva: se pierden en la orina', { size: 8, ancla: 'middle', color: CLARO.rojo });
                const actPara = !sinVoltaje && !danada && efecto(seg, 'paracelular', 'activa');
                if (actPara) textos += txt(xm, f.y0 + f.h, actPara.nota, { size: 8, ancla: 'middle', color: C.verde });
            } else if (f.t === 'agua') {
                const yk = f.y0 + 10;
                capas += guia(ida(yk), ION.h2o[1], danada) + flujoIones(danada ? `M10 ${yk} L${xa - 6} ${yk}` : ida(yk), 'h2o', 4, 2.6, danada);
                textos += txt(8, yk - 5, 'H₂O', { size: 8, color: ION.h2o[1] });
                textos += txt(lblX, f.y0 + f.h - 2, d.agua, { size: 8.5, color: C.suave });
            } else if (f.t === 'bomba') {
                // Na⁺/K⁺-ATPasa: saca 3 Na⁺ y mete 2 K⁺; en el proximal, el K⁺ vuelve a salir por canales de escape.
                const yb = f.y0 + 18;
                capas += `<ellipse cx="${xb}" cy="${yb}" rx="10" ry="17" fill="${C.verde}" stroke="#17140f"/>` + txt(xb, yb + 3, 'ATP', { size: 6.5, ancla: 'middle', color: '#17140f', peso: 'bold' });
                for (let q = 0; q < 3; q++) capas += viajero('na', `M${xm} ${yb - 6} L330 ${yb - 6}`, 2.4, -(q * 0.8).toFixed(2), false);
                for (let q = 0; q < 2; q++) capas += viajero('k', `M330 ${yb + 6} L${xm} ${yb + 6}`, 2.4, -(q * 1.2 + 0.4).toFixed(2), true);
                textos += txt(330, yb - 10, '3 Na⁺', { size: 8, color: ION.na[1], ancla: 'middle' }) + txt(330, yb + 20, '2 K⁺', { size: 8, color: ION.k[1], ancla: 'middle' });
                if (d.fugaK) {
                    const yk = yb + 28, ruta = `M${xm} ${yk} L330 ${yk}`;
                    capas += guia(ruta, ION.k[1], false) + flujoIones(ruta, 'k', 2, 2.6, false, 1) + puerta(xb, yk, C.oro, 10);
                    textos += rotuloPuerta('Escape de K⁺', yk);
                }
                textos += txt(lblX, f.y0 + f.h - 2, 'Na⁺/K⁺-ATPasa: saca 3 Na⁺, mete 2 K⁺', { size: 8.5, color: C.verde, peso: 'bold' });
            }
        }
        const fam = 'Courier New';
        return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Célula de ${d.nombre}${danada ? ', dañada por necrosis tubular aguda' : ''}${estado.farm !== 'ninguno' ? `, con ${farmacosNefrona.find(x => x.id === estado.farm).nombre}` : ''}">
            <rect width="${W}" height="${H}" fill="#120f0b"/>
            <rect x="0" y="40" width="${xa - 8}" height="420" fill="${colorOsm(osmLuzSeg, 0.3)}"/>
            <rect x="${xb}" y="40" width="${W - xb}" height="420" fill="${colorOsm(osmInt, 0.22)}"/>
            <rect x="304" y="56" width="40" height="392" rx="20" fill="${alfa(C.rojo, 0.22)}" stroke="${alfa(C.rojo, 0.55)}"/>
            ${[96, 176, 262, 344, 414].map(yy => `<ellipse cx="324" cy="${yy}" rx="9" ry="5" fill="${C.rojo}" opacity=".5"/>`).join('')}
            ${fondo}${capas}${textos}
            ${txt((xa - 8) / 2, 28, `LUZ · ${osmLuzSeg}`, { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(xm, 28, plano ? 'CÉL.' : 'CÉLULA', { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(324, 28, `SANGRE · ${osmInt}`, { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(8, 466, d.nombre.replace('Asa de Henle — ', '').replace(/ \(.*\)$/, ''), { size: 9, color: C.oro, peso: 'bold' })}
            ${medular ? txt(352, 466, `a ${Math.round(intersticio(yT, M))} mOsm/kg de profundidad`, { size: 8, color: C.suave, ancla: 'end' }) : ''}
        </svg>`;
    }
    function svgGlomerulo() {
        const peq = ['h2o', 'na', 'glu', 'k', 'h2o', 'na', 'hco3', 'h2o'];
        const pasan = peq.map((ion, i) => `<g class="nv-pasa" style="animation-delay:${(i * 0.3).toFixed(1)}s">${glifo(ion, 70, 90 + i * 40)}</g>`).join('');
        const quedan = [0, 1, 2, 3].map(i => `<g class="nv-rebota" style="animation-delay:${(i * 0.55).toFixed(2)}s">${svgParticula('rbc', 52, 120 + i * 80, 7.5)}</g><g class="nv-rebota" style="animation-delay:${(i * 0.55 + 0.3).toFixed(2)}s">${svgParticula('alb', 40, 150 + i * 80, 3.8)}</g>`).join('');
        const fam = 'Courier New';
        return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Barrera de filtración glomerular">
            <rect width="${W}" height="${H}" fill="#120f0b"/>
            <rect x="0" y="40" width="112" height="420" fill="${alfa(C.rojo, 0.22)}"/>
            <rect x="112" y="40" width="10" height="420" fill="#c9a678" opacity=".8"/>
            ${Array.from({ length: 20 }, (_, i) => `<rect x="112" y="${48 + i * 21}" width="10" height="7" fill="#120f0b"/>`).join('')}
            <rect x="128" y="40" width="16" height="420" fill="${alfa(C.oro, 0.35)}"/>
            ${Array.from({ length: 14 }, (_, i) => `<path d="M150 ${50 + i * 30} q16 -6 24 8 q-6 12 -24 10z" fill="#cdb89a" opacity=".75"/>`).join('')}
            <rect x="180" y="40" width="180" height="420" fill="${colorOsm(300, 0.18)}"/>
            ${quedan}${pasan}
            ${txt(56, 28, 'CAPILAR', { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(146, 28, 'BARRERA', { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(270, 28, 'ESPACIO DE BOWMAN', { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(117, 458, 'endotelio', { size: 7.5, ancla: 'middle' })}${txt(137, 448, 'm. basal', { size: 7.5, ancla: 'middle' })}${txt(164, 458, 'podocitos', { size: 7.5, ancla: 'middle' })}
            ${txt(270, 300, `Filtrado: ${CIF.filtradoL} L/día`, { size: 10, ancla: 'middle' })}
            ${txt(270, 316, 'agua, Na⁺, K⁺, glucosa, HCO₃⁻', { color: C.suave, ancla: 'middle' })}
            ${txt(56, 452, 'hematíes y proteínas', { color: CLARO.rojo, ancla: 'middle' })}${txt(56, 464, 'se quedan', { color: CLARO.rojo, ancla: 'middle' })}
        </svg>`;
    }

    // ---------- Niveles de zoom ----------
    const capaFoto = $('#nv-foto'), capaNef = $('#nv-nefrona'), capaCel = $('#nv-celula');
    function irNivel(nivel, origen) {
        estado.nivel = nivel;
        capaFoto.classList.toggle('entrando', nivel !== 'foto');
        capaNef.classList.toggle('visible', nivel === 'nefrona');
        if (nivel === 'celula') {
            if (origen) capaCel.style.transformOrigin = `${origen.x / W * 100}% ${origen.y / H * 100}%`;
            capaCel.innerHTML = svgCelula(estado.seg);
        }
        capaCel.classList.toggle('visible', nivel === 'celula');
        raiz.querySelectorAll('.nv-miga').forEach(b => {
            b.setAttribute('aria-current', b.dataset.nivel === nivel);
            if (b.dataset.nivel === 'celula') b.disabled = !estado.seg;
        });
        if (nivel === 'nefrona' && parts.length === 0) for (let i = 0; i < 260; i++) paso(0.05);
        dibujar();
        ultimo = 0; programar();
    }
    $('#nv-entrar').addEventListener('click', () => irNivel('nefrona'));
    capaFoto.addEventListener('click', () => { if (estado.nivel === 'foto') irNivel('nefrona'); });
    raiz.querySelector('.nv-migas').addEventListener('click', e => {
        const b = e.target.closest('.nv-miga');
        if (b && !b.disabled) irNivel(b.dataset.nivel);
    });
    $('#nv-pausa').addEventListener('click', e => {
        estado.pausa = !estado.pausa;
        e.currentTarget.textContent = estado.pausa ? '▶' : '⏸';
        e.currentTarget.setAttribute('aria-label', estado.pausa ? 'Reanudar la animación' : 'Pausar la animación');
    });
    $('#nv-vel').addEventListener('click', e => {
        estado.vel = estado.vel === 1 ? 2 : estado.vel === 2 ? 0.5 : 1;
        e.currentTarget.textContent = '×' + String(estado.vel).replace('.', ',');
    });
    // Toque sobre la nefrona: glomérulo o tramo más cercano.
    lienzo.addEventListener('click', ev => {
        const rc = lienzo.getBoundingClientRect();
        const x = (ev.clientX - rc.left) / rc.width * W, y = (ev.clientY - rc.top) / rc.height * H;
        let seg = null;
        if (Math.hypot(x - G.x, y - G.y) < G.r + 8) seg = 'glomerulo';
        else {
            let mejor = 18;
            for (const p of RUTA) { const d = Math.hypot(p.x - x, p.y - y); if (d < mejor) { mejor = d; seg = TRAMO_SEG[p.tramo]; } }
        }
        if (!seg) return;
        estado.seg = seg; estado.tapY = y;
        pintarFondo(); pintarDetalle();
        irNivel('celula', { x, y });
    });

    // ---------- Texto de las fichas ----------
    // "Texto ↓": abre la ficha de esta misma página que contiene la línea,
    // la pasa a vista Texto si estaba en Visual y la resalta.
    function irALinea(id) {
        const el = document.getElementById(id), tab = el?.closest('.tab-content');
        if (!el || !tab) return;
        openCorkboardTopic('panel-fisio-tabs', tab.id);
        irAlTexto(el.closest('[data-visual]'), el);
    }
    const enlaceTexto = id => `<button type="button" class="visual-link" data-ver="${id}">Texto ↓</button>`;
    // La explicación de la línea: el <dd> de un kv-row, el cuerpo de un acordeón o el elemento entero.
    function copiaLinea(id) {
        const el = document.getElementById(id);
        if (!el) return '';
        const parte = el.matches('dl') ? el.querySelector('dd') : el.querySelector('.micro-prof-body, .article-figure-caption') || el;
        return quitarIds(parte.cloneNode(true)).innerHTML;
    }
    raiz.addEventListener('click', e => {
        const ver = e.target.closest('[data-ver]');
        if (ver) { irALinea(ver.dataset.ver); return; }
        const ficha = e.target.closest('[data-ficha]');
        if (ficha) { openCorkboardTopic('panel-fisio-tabs', ficha.dataset.ficha); return; }
        const cat = e.target.closest('.nefro-categoria-btn');
        if (cat && onCategoria) onCategoria(cat.dataset.categoria);
    });

    // ---------- Paneles ----------
    const signo = (v, ref, tol = 0.08) => v > ref * (1 + tol) ? 'sube' : v < ref * (1 - tol) ? 'baja' : '';
    const REF = modelo('normal', 'ninguno', 350);
    // Los diuréticos se leen en el pico de su efecto (ml/min): extrapolar ese
    // pico a 24 h daría volúmenes que no se ven en clínica.
    const PICO = ['furosemida', 'tiazida', 'espironolactona', 'amilorida', 'acetazolamida'];
    const enPico = () => PICO.includes(estado.farm);
    const notaOsm = o => o < 280 ? 'Orina diluida' : o <= 350 ? 'Isotónica, como el plasma' : 'Orina concentrada';
    const medidor = ([n, v, ficha, s = '', nota = '']) => `
            <div class="nv-medidor"><div class="nv-medidor-nombre"><span>${n}</span><span class="nv-fuente${ficha ? ' ficha' : ''}">${ficha ? 'ficha' : 'ilustrativo'}</span></div>
            <div class="nv-medidor-valor ${s}${String(v).length > 18 ? ' largo' : ''}">${s === 'sube' ? '↑ ' : s === 'baja' ? '↓ ' : ''}${v}</div>${nota ? `<div class="nv-medidor-nota">${nota}</div>` : ''}</div>`;
    function pintarMedidores() {
        const sit = situacionesNefrona.find(x => x.id === estado.sit);
        if (M.fra) {
            const t = M.fra.tabla;
            $('#nv-medidores').innerHTML = [['Volumen', t.volumen], ['Osmolalidad', t.osm], ['Na⁺ en orina', t.naOrina], ['FENa', t.fena], ['Cro/Crs', t.crocrs], ['FE urea', t.feurea], ['Sedimento', t.sedimento]]
                .map(([n, v]) => medidor([n, v, true])).join('')
                + medidor(['Filtrado', `${num(CIF.filtradoL * M.tfg)} L/día`, false, 'baja', `Normal: ${CIF.filtradoL} L/día`]).replace('class="nv-medidor-valor baja', 'class="nv-medidor-valor baja malo');
            return;
        }
        if (M.mineral && estado.farm === 'ninguno') {
            const fichaRtp = estado.sit === 'fgf23';
            $('#nv-medidores').innerHTML = M.mineral.tabla.map(([n, v, sg]) => medidor([n, v, true, sg])).join('')
                + (M.mineral.pProx == null ? '' : medidor(['Fosfato reabsorbido (RTP)', `${Math.round(100 * (1 - excretado(M.r.p)))}%`, false, signo(1 - excretado(M.r.p), 1 - excretado(REF.r.p), 0.05), fichaRtp ? 'En la ficha: <90% = pérdida renal' : 'Lo que recupera el proximal']));
            return;
        }
        if (M.acido && estado.farm === 'ninguno') {
            const t = M.acido.tabla;
            $('#nv-medidores').innerHTML = [
                ['HCO₃⁻ en sangre', t.hco3, true, 'baja', 'Acidosis hiperclorémica (hiato aniónico normal)'],
                ['K⁺ en sangre', t.k === '↑' ? 'Alto' : 'Bajo', true, t.k === '↑' ? 'sube' : 'baja', t.k === '↑' ? 'Hiperpotasemia' : 'Hipopotasemia'],
                ['Hiato aniónico urinario', t.uag, true, '', '(Na⁺ + K⁺ − Cl⁻) en orina'],
                ['NH₄⁺ en orina', t.nh4, true, t.nh4 === 'Presente' ? '' : 'baja', t.nh4 === 'Presente' ? 'Mecanismo de acidificación intacto' : 'Origen renal'],
                ['pH urinario mínimo', t.ph, true, '', ''],
            ].map(medidor).join('');
            return;
        }
        const sinFarm = estado.farm === 'ninguno';
        // "ficha" solo donde la cifra es de la ficha: lo normal y los dos extremos de la ADH.
        const extremo = sinFarm && (estado.sit === 'deshidratacion' || estado.sit === 'agua');
        const fen = M.fena * 100;
        const items = [
            enPico()
                ? ['Ritmo de orina en el pico', `${num(M.V * 1000 / 1440)} ml/min`, false, 'sube', `≈ ${Math.round(M.V * 1000 / 24 / 10) * 10} ml/h mientras dura el efecto (horas, no todo el día)`]
                : ['Volumen', `${num(M.V)} L/día`, sinFarm && (estado.sit === 'normal' || extremo), signo(M.V, REF.V), M.V >= M.aguaCol - 0.01 ? 'Sale todo lo que llega al colector' : 'Solutos ÷ osmolalidad'],
            ['Osmolalidad', `${Math.round(M.Uosm)} mOsm/kg`, extremo, signo(M.Uosm, REF.Uosm), estado.sit === 'siadh' && sinFarm ? 'Ficha: >100 mOsm/kg, inapropiadamente concentrada' : notaOsm(M.Uosm)],
            sit.naOrina && sinFarm
                ? ['Na⁺ en orina', sit.naOrina, true, 'sube', 'Con ingesta normal de sal y agua']
                : [enPico() ? 'Na⁺ excretado en el pico' : 'Na⁺ excretado', `${fen < 1.95 ? fen.toFixed(1).replace('.', ',') : Math.round(fen)}% del filtrado`, sinFarm, signo(M.fena, REF.fena, 0.3), 'El resto se reabsorbe'],
            ['K⁺ en orina', `×${num(M.kRel)}`, false, signo(M.kRel, 1, 0.12), M.kRel > 1.15 ? 'Se pierde K⁺' : M.kRel < 0.85 ? 'Se ahorra K⁺' : 'Respecto a lo normal'],
            ['Glucosa', M.gGdia > 0.5 ? `${Math.round(M.gGdia)} g/día` : 'No', M.gGdia <= 0.5 && estado.farm !== 'isglt2', M.gGdia > 0.5 ? 'sube' : '', M.gGdia > 0.5 ? 'Glucosuria' : 'Se reabsorbe el 100%'],
            ['HCO₃⁻', M.hco3 > 0.05 ? 'Sale' : 'Casi nada', false, M.hco3 > 0.05 ? 'sube' : '', M.hco3 > 0.05 ? 'Orina alcalina' : 'Lo recupera el proximal'],
            ['Ca²⁺ en orina', `×${num(excretado(M.r.ca) / excretado(REF.r.ca))}`, false, signo(excretado(M.r.ca), excretado(REF.r.ca), 0.15), 'Respecto a lo normal'],
            ['Mg²⁺ en orina', `×${num(excretado(M.r.mg) / excretado(REF.r.mg))}`, sinFarm && estado.sit === 'normal', signo(excretado(M.r.mg), excretado(REF.r.mg), 0.15), sinFarm && estado.sit === 'normal' ? 'Ficha: 100 de 2.400 mg filtrados' : 'Respecto a lo normal'],
        ];
        if (sinFarm && sit.plasma) items.push(['Plasma', sit.plasma[0], true, '', sit.plasma[1]]);
        $('#nv-medidores').innerHTML = items.map(medidor).join('');
    }
    function pintarExplica() {
        const s = situacionesNefrona.find(x => x.id === estado.sit), f = farmacosNefrona.find(x => x.id === estado.farm);
        const fuente = f.id !== 'ninguno' ? f : s;
        $('#nv-explica-titulo').textContent = `Qué está pasando · ${fuente.nombre}`;
        const cuerpo = fuente.texto ? `<p>${fuente.texto}</p>` : fuente.fuentes.map(id => `<p>${copiaLinea(id)}</p>`).join('');
        const botones = [
            ...fuente.fuentes.map(enlaceTexto),
            fuente.ficha?.vista ? `<button type="button" class="visual-link" data-especialidad="nefrologia" data-view="${fuente.ficha.vista}" data-panel="${fuente.ficha.panel}" data-tab="${fuente.ficha.tabId}">${fuente.ficha.etiqueta}</button>`
                : fuente.ficha ? `<button type="button" class="visual-link" data-ficha="${fuente.ficha.tabId}">${fuente.ficha.etiqueta}</button>` : '',
            fuente.categoria ? `<button type="button" class="visual-link nefro-categoria-btn" data-categoria="${fuente.categoria.key}">${fuente.categoria.etiqueta}</button>` : '',
            // El mismo problema visto desde el glomérulo.
            estado.sit === 'prerrenal' && f.id === 'ninguno' ? '<button type="button" class="visual-link" data-especialidad="nefrologia" data-view="nefrona" data-panel="panel-fisio-tabs" data-tab="fisio-regulacion" data-glomerulo="deplecion">En el glomérulo: depleción de volumen →</button>' : '',
            f.id === 'isglt2' ? '<button type="button" class="visual-link" data-especialidad="nefrologia" data-view="erc" data-panel="panel-erc-tabs" data-tab="erc-nefroproteccion" data-glomerulo="isglt2">Su efecto en el glomérulo →</button>' : '',
        ].join('');
        $('#nv-explica').innerHTML = cuerpo + `<div class="nv-botones">${botones}</div>` + (fuente.general ? `<p class="nv-general">${fuente.general}</p>` : '');
        const av = [];
        if (f.id === 'furosemida') av.push('Sin NKCC2 el intersticio medular pierde su gradiente: la rama descendente casi no saca agua y el colector ya no puede concentrar aunque haya ADH.');
        if (f.id === 'furosemida' || f.id === 'tiazida') av.push('Llega más Na⁺ al colector, el flujo arrastra la secreción de K⁺ por ROMK y el K⁺ se pierde en la orina.');
        if (f.id === 'furosemida') av.push('Sin NaCl ni reciclaje de K⁺ en la rama gruesa se pierde la carga positiva de la luz que empuja el Ca²⁺ y el Mg²⁺ entre las células: se pierden en la orina (ficha «El riñón y el calcio»).');
        if (f.id === 'tiazida') av.push('Con tiazida baja el Ca²⁺ de la orina: la contracción de volumen aumenta la reabsorción de Na⁺ y Ca²⁺ en el túbulo proximal (ficha «El riñón y el calcio»). El Mg²⁺, en cambio, se pierde (ficha «El riñón y el magnesio»).');
        if (f.id === 'tiazida') av.push('El túbulo distal deja de diluir: con ADH presente se retiene agua libre, de ahí el riesgo de hiponatremia.');
        if (f.id === 'espironolactona' || f.id === 'amilorida') av.push('Menos Na⁺ reabsorbido por ENaC y menos K⁺ secretado por ROMK: ahorra K⁺.');
        if (f.id === 'acetazolamida') av.push('El HCO₃⁻ que no recupera el proximal sale por la orina; el Na⁺ que lo acompaña se recupera casi entero más adelante.');
        if (f.id === 'isglt2' || (estado.sit === 'hiperglucemia' && M.gGdia > 0.5)) av.push('La glucosa que queda en la luz arrastra agua: diuresis osmótica.');
        if (estado.sit === 'hiperglucemia' && estado.glucemia <= CIF.glucosaUmbral && f.id !== 'isglt2') av.push(`Por debajo de ~${CIF.glucosaUmbral} mg/dl el túbulo proximal todavía recupera toda la glucosa.`);
        if (estado.sit === 'siadh') av.push('La orina se parece a la de la deshidratación, pero la sangre no: la ADH actúa sin que el plasma lo pida, el agua retenida diluye el sodio y el riñón sigue eliminando Na⁺ (más de 40 mEq/l en orina).');
        if (estado.sit === 'prerrenal') av.push('Llega poca sangre: se filtra menos, pero el túbulo sano recupera casi todo el sodio y la ADH concentra la orina.');
        if (estado.sit === 'nta') av.push('Las células que se caen viajan con la orina y forman cilindros granulosos en el colector.');
        av.push(...avisosRabdo(estado));
        if (estado.sit === 'obstruccion') av.push('La orina no puede salir: se acumula en el colector y la presión sube hacia atrás hasta el glomérulo.');
        if (s.aviso && f.id === 'ninguno') av.push(s.aviso);
        if ((M.acido || M.mineral) && f.id !== 'ninguno') av.push('Con un fármaco puesto, las cifras de la orina son las del fármaco; quita el fármaco para ver las de la tabla de la ficha.');
        if (estado.sit === 'di') av.push('Mismo dibujo que al beber mucha agua, pero aquí la pérdida de agua no está justificada: si no bebe lo suficiente, sube el Na⁺ en la sangre.');
        $('#nv-avisos').innerHTML = av.map(t => `<div class="tfg-estado tfg-estado-warn">${t}</div>`).join('');
    }
    function pintarDetalle() {
        const d = segmentosNefrona[estado.seg];
        $('#nv-detalle-vacio').hidden = !!d;
        const cats = document.getElementById('nefro-segmento-categorias');
        if (!d) { $('#nv-detalle').innerHTML = ''; cats.innerHTML = ''; return; }
        $('#nv-detalle-titulo').textContent = `Tramo elegido · ${d.nombre}`;
        $('#nv-detalle').innerHTML = `<div class="nv-ficha">${copiaLinea(d.texto)}</div><div class="nv-botones">${enlaceTexto(d.texto)}</div>`
            + d.canales.map(cn => {
                const bl = bloqueado(estado.seg, cn.nombre);
                const sinK = !bl && cn.depende && bloqueado(estado.seg, cn.depende);
                const act = efecto(estado.seg, cn.nombre, 'activa');
                const estadoTxt = bl ? (bl.danio ? 'célula dañada (NTA)' : bl.nota ?? `bloqueado por ${bl.nombre}`) : sinK ? `sin K⁺ que reciclar (${sinK.nombre})` : act ? act.nota : '';
                return `<div class="nv-canal${bl || sinK ? ' bloq' : ''}"><h4>${cn.nombre}${estadoTxt ? ` <span>· ${estadoTxt}</span>` : ''}</h4>${cn.funcion}${cn.diana ? `<div class="nv-canal-diana">Diana: ${cn.diana}</div>` : ''}</div>`;
            }).join('')
            + (d.general ? `<p class="nv-general">${d.general}</p>` : '');
        cats.innerHTML = d.categorias.map(cat =>
            `<button class="accordion-btn nav-btn nefro-categoria-btn" data-categoria="${cat.key}" style="border-left: 4px solid var(--accent-green);">
                <span>${cat.etiqueta}</span><span style="font-size: 0.8rem; color: var(--accent-green);">[ VER → ]</span>
            </button>`).join('');
    }
    const GRUPOS = { fra: 'Fracaso renal agudo', acido: 'Acidosis hiperclorémica', mineral: 'Calcio, fósforo y magnesio' };
    function chips(id, lista, clave) {
        const cont = $(id);
        cont.innerHTML = lista.map((x, i) => (x.grupo && lista[i - 1]?.grupo !== x.grupo ? `<span class="nv-chips-grupo">${GRUPOS[x.grupo]}</span>` : '')
            + `<button type="button" class="visual-mini" data-id="${x.id}" aria-pressed="${estado[clave] === x.id}">${x.nombre}</button>`).join('');
        cont.addEventListener('click', e => {
            const b = e.target.closest('.visual-mini');
            if (!b) return;
            estado[clave] = b.dataset.id;
            actualizar();
        });
    }
    function actualizar() {
        M = modelo(estado.sit, estado.farm, estado.glucemia);
        raiz.querySelectorAll('#nv-situaciones .visual-mini').forEach(b => { const on = b.dataset.id === estado.sit; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
        raiz.querySelectorAll('#nv-farmacos .visual-mini').forEach(b => { const on = b.dataset.id === estado.farm; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
        $('#nv-glucemia-box').hidden = estado.sit !== 'hiperglucemia';
        repintarVolumen(raiz, estado); pintarFondo(); pintarMedidores(); pintarExplica();
        lienzo.setAttribute('aria-label', `Nefrona animada. ${situacionesNefrona.find(x => x.id === estado.sit).nombre}${estado.farm !== 'ninguno' ? ' con ' + farmacosNefrona.find(x => x.id === estado.farm).nombre : ''}: orina ${enPico() ? num(M.V * 1000 / 1440) + ' ml/min en el pico' : num(M.V) + ' L/día'}, ${Math.round(M.Uosm)} mOsm/kg.`);
        if (estado.seg) pintarDetalle();
        // Sin tramo elegido no hay célula que pintar (p. ej. un botón de la ficha
        // que pone otra situación con la célula abierta: luego vuelve a la nefrona).
        if (estado.nivel === 'celula' && estado.seg) capaCel.innerHTML = svgCelula(estado.seg);
        if (estado.nivel !== 'nefrona') parts = [];
        dibujar();
    }
    $('#nv-glucemia').addEventListener('input', e => {
        estado.glucemia = +e.target.value;
        $('#nv-glucemia-out').textContent = `${estado.glucemia} mg/dl`;
        actualizar();
    });
    // Leyenda de partículas: la de la tabla única, igual en todos los modelos.
    $('#nv-especies').innerHTML = leyendaParticulas([
        ...Object.values(ESPECIES).map(e => ({ clave: e.clave, nombre: e.nombre })),
        { clave: 'cl', nombre: 'Cl⁻ (en la célula)' }, { clave: 'co2', nombre: 'CO₂ (en la célula)' },
        { clave: 'rbc', nombre: 'Hematíes (no se filtran)' },
    ], { envolver: false });

    document.addEventListener('click', e => {
        const b = e.target.closest('[data-nefrona-viva]');
        if (!b) return;
        const [sit, farm = 'ninguno'] = b.dataset.nefronaViva.split('|');
        mostrarVista?.();
        Object.assign(estado, { sit, farm, seg: null });
        parts = [];
        actualizar();
        pintarDetalle();
        $('#nv-detalle-titulo').textContent = 'Tramo elegido';
        irNivel('nefrona');
        requestAnimationFrame(() => $('#nv-escenario').scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });

    chips('#nv-situaciones', situacionesNefrona, 'sit');
    chips('#nv-farmacos', farmacosNefrona, 'farm');
    montarVolumen(raiz, estado, actualizar);
    actualizar();

    return {
        // Al volver al mapa del riñón la nefrona arranca siempre en la foto,
        // sin tramo elegido y en situación normal.
        reset: () => {
            Object.assign(estado, { sit: 'normal', farm: 'ninguno', seg: null });
            parts = [];
            actualizar();
            pintarDetalle();
            $('#nv-detalle-titulo').textContent = 'Tramo elegido';
            irNivel('foto');
        },
    };
}
