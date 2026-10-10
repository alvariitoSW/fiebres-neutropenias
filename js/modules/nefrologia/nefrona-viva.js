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

function modelo(sit, farm, glucemia) {
    const situacion = situacionesNefrona.find(x => x.id === sit);
    if (situacion.fra) return modeloFra(situacion, farm);
    const a = situacion.adh;
    const furo = farm === 'furosemida', tiaz = farm === 'tiazida', ahorr = farm === 'espironolactona' || farm === 'amilorida';
    const acet = farm === 'acetazolamida', sglt = farm === 'isglt2';
    // Gradiente medular (máximo del intersticio) y dilución mínima posible.
    const M = furo ? 380 : CIF.osmMax;
    const Umin = furo ? 280 : tiaz ? 150 : CIF.osmMin;
    const Uosm = Umin + (M - Umin) * a;
    // Agua: la rama descendente depende del gradiente.
    const rDesc = 0.667 * Math.max(0, (M - 300) / 900);
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
    const kSec = 0.10 * Math.sqrt(naTcd / 0.039) * (ahorr ? 0.2 : 1);
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
        hco3: { tp1: acet ? 0.15 : 0.5, tp2: parte(acet ? 0.30 : 0.80, acet ? 0.15 : 0.5), tal: 0.15, col: acet ? 0.55 : 0.97 },
    };
    return { a, M, Umin, Uosm, V, aguaCol, rDesc, fena, naTcd, kSec, kRel, gGdia, hco3, r, gluSpawn: sit === 'hiperglucemia' ? glucemia / 100 : 1, tfg: 1 };
}

// Fracaso renal agudo: la orina es la de la Tabla 3 de la ficha (en `fra`),
// y el reparto por tramos se ajusta para que la animación llegue a ella.
function modeloFra(s, farm) {
    const f = s.fra;
    const M = f.M, Umin = CIF.osmMin, a = s.adh;
    const rDesc = 0.667 * Math.max(0, (M - 300) / 900);
    const aguaCol = CIF.filtradoL * f.tfg * (1 - CIF.aguaProximal) * (1 - rDesc);
    const naTal = (1 - f.rTp) * (1 - 0.30) * (1 - f.rTal);
    const reTcd = Math.min(naTal * 0.60, 0.07), naTcd = naTal - reTcd;
    const rColNa = f.fena == null ? 0 : clamp01(1 - f.fena / naTcd);
    const r = {
        h2o: { tp1: 0.35, tp2: parte(f.nta ? 0.45 : CIF.aguaProximal, 0.35), desc: rDesc, col: f.obstruccion ? 0 : clamp01(1 - f.V / aguaCol) },
        na: { tp1: f.rTp * 0.6, tp2: parte(f.rTp, f.rTp * 0.6), ascd: 0.30, tal: f.rTal, tcd: reTcd / naTal, col: rColNa },
        k: { tp1: 0.40, tp2: parte(0.65, 0.40), tal: f.nta ? 0.3 : 0.86 },
        glu: f.nta ? { tp1: 0.5, tp2: 0.5 } : { tp1: 0.90, tp2: 1 },
        hco3: { tp1: 0.5, tp2: parte(f.nta ? 0.5 : 0.80, 0.5), tal: 0.15, col: 0.97 },
    };
    return { a, M, Umin, Uosm: f.uosm ?? 300, V: f.V, aguaCol, rDesc, fena: f.fena ?? 0, naTcd, kSec: f.nta ? 0.04 : 0.08, kRel: 1, gGdia: 0, hco3: 0.005, r,
        gluSpawn: 1, tfg: f.tfg, fra: f };
}
const clamp01 = v => Math.max(0, Math.min(1, v));

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
export const panelNefronaViva = botones => ({
    tipo: 'propio', titulo: 'En la nefrona viva', nota: 'Abre la simulación de la nefrona con esta situación ya puesta.',
    render: c => { c.innerHTML = `<div class="nv-chips">${botones.map(([v, et]) => `<button type="button" class="visual-link" data-nefrona-viva="${v}">${et} →</button>`).join('')}</div>`; },
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
    const ESPECIES = {
        h2o: { nombre: 'Agua', color: C.texto, forma: 'punto', tasa: 22 },
        na: { nombre: 'Na⁺', color: CLARO.oro, forma: 'circulo', tasa: 10 },
        k: { nombre: 'K⁺', color: CLARO.na, forma: 'cuadrado', tasa: 5 },
        glu: { nombre: 'Glucosa', color: CLARO.verde, forma: 'rombo', tasa: 4 },
        hco3: { nombre: 'HCO₃⁻', color: CLARO.rojo, forma: 'triangulo', tasa: 4 },
        celula: { nombre: 'Célula desprendida (NTA)', color: '#9c7a52', forma: 'circulo', tasa: 0, r: 3.4 },
    };
    const ION = { na: ['Na⁺', CLARO.oro, 'circulo'], k: ['K⁺', CLARO.na, 'cuadrado'], glu: ['Glucosa', CLARO.verde, 'rombo'], hco3: ['HCO₃⁻', CLARO.rojo, 'triangulo'], h: ['H⁺', '#f0e6c8', 'anillo'], cl: ['Cl⁻', '#9fb2a4', 'circulo'], ca: ['Ca²⁺/Mg²⁺', C.oro, 'circulo'], h2o: ['H₂O', C.texto, 'punto'] };
    const RADIO = { punto: 1.5, circulo: 2.4, cuadrado: 2.1, rombo: 2.2, triangulo: 2.3 };

    const estado = { sit: 'normal', farm: 'ninguno', glucemia: 350, nivel: 'foto', seg: null, pausa: false, vel: 1 };
    let M = modelo('normal', 'ninguno', 350);

    // ---------- Canvas ----------
    const lienzo = $('#nv-lienzo'), ctx = lienzo.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = W * dpr; lienzo.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fondo = document.createElement('canvas');
    fondo.width = W * dpr; fondo.height = H * dpr;
    const fctx = fondo.getContext('2d'); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    function forma(c, f, x, y, r) {
        c.beginPath();
        if (f === 'punto' || f === 'circulo') c.arc(x, y, r, 0, Math.PI * 2);
        else if (f === 'cuadrado') c.rect(x - r, y - r, 2 * r, 2 * r);
        else if (f === 'rombo') { c.moveTo(x, y - r * 1.3); c.lineTo(x + r * 1.3, y); c.lineTo(x, y + r * 1.3); c.lineTo(x - r * 1.3, y); c.closePath(); }
        else { c.moveTo(x, y - r * 1.3); c.lineTo(x + r * 1.2, y + r); c.lineTo(x - r * 1.2, y + r); c.closePath(); }
    }
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
        c.fillStyle = alfa(C.rojo, 0.18);
        for (const [x, y, r] of [[30, 30, 10], [52, 92, 9], [150, 26, 8], [180, 128, 7], [330, 24, 9], [348, 104, 8]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
        c.font = '9px "Courier New", monospace'; c.fillStyle = C.suave; c.textAlign = 'center';
        for (const [t, y] of [['CORTEZA', 70], ['MÉDULA EXTERNA', 220], ['MÉDULA INTERNA', 380]]) { c.save(); c.translate(10, y); c.rotate(-Math.PI / 2); c.fillText(t, 0, 0); c.restore(); }
        c.textAlign = 'left'; c.fillStyle = alfa(C.texto, 0.45); c.fillText('mOsm/kg', 22, 154);
        c.fillStyle = alfa(C.texto, 0.6);
        for (const y of [180, 260, 340, 440]) c.fillText(String(Math.round(intersticio(y, M) / 10) * 10), 22, y + 3);
        // Vasa recta y capilares peritubulares
        c.lineCap = 'round'; c.lineJoin = 'round';
        c.strokeStyle = alfa(C.rojo, 0.55); c.lineWidth = 2.4;
        trazar(c, catmull([[301, 166], [302, 220], [303, 404], [308, 412], [313, 404], [314, 220], [315, 166]], 4));
        c.strokeStyle = alfa(C.rojo, 0.28); c.lineWidth = 1.6;
        trazar(c, catmull([[248, 40], [270, 34], [304, 44], [314, 76], [306, 100], [336, 112], [342, 136]], 4));
        trazar(c, catmull([[120, 120], [140, 112], [168, 116], [196, 108], [214, 112]], 4));
        // Arteriolas aferente (ancha) y eferente (estrecha)
        c.strokeStyle = C.rojo; c.lineWidth = 7;
        trazar(c, catmull([[150, 8], [184, 30], [212, 54]], 3));
        c.lineWidth = 4.5; c.strokeStyle = '#8f4530';
        trazar(c, catmull([[212, 66], [186, 58], [160, 46], [140, 50]], 3));
        c.font = '8px Georgia, serif'; c.fillStyle = alfa(C.texto, 0.6);
        c.fillText('aferente', 130, 14); c.fillText('eferente', 108, 60);
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
            if (M.fra?.nta && (t === 'tp1' || t === 'tp2' || t === 'tal')) { // células desprendidas: huecos en la pared
                c.fillStyle = '#1c1410';
                for (let s = LIMITES[t][0] + 8, i = 0; s < LIMITES[t][1] - 4; s += 17, i++) {
                    const p = enS(s), lado = i % 2 ? 1 : -1, d = (ext + luz) / 4;
                    c.beginPath(); c.ellipse(p.x + p.nx * d * lado, p.y + p.ny * d * lado, 3, 2, Math.atan2(p.ny, p.nx), 0, 7); c.fill();
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
        // Bloqueo del fármaco
        const f = farmacosNefrona.find(x => x.id === estado.farm);
        if (f.segmento) {
            const t = SEG_TRAMO[f.segmento], [a, b] = LIMITES[t];
            const marcas = t === 'col' ? [0.22, 0.42] : t === 'tal' ? [0.25, 0.55, 0.8] : [0.35, 0.7];
            c.strokeStyle = CLARO.rojo; c.lineWidth = 2.2;
            for (const u of marcas) {
                const p = enS(a + (b - a) * u), x = p.x + p.nx * 11, y = p.y + p.ny * 11;
                c.beginPath(); c.moveTo(x - 4, y - 4); c.lineTo(x + 4, y + 4); c.moveTo(x + 4, y - 4); c.lineTo(x - 4, y + 4); c.stroke();
            }
            const p = enS(a + (b - a) * marcas[0]);
            etiqueta(c, f.nombre, p.x + p.nx * 18, p.y + p.ny * 18 - 8, CLARO.rojo);
        }
        // FRA: cilindros en el colector, obstrucción y perfusión
        if (M.fra) {
            const hialino = !M.fra.nta && !M.fra.obstruccion;
            if (!M.fra.obstruccion) for (const y of [300, 384]) {
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
            if (M.fra.nta) etiqueta(c, 'células desprendidas', 300, 186, CLARO.rojo, 'right');
        }
        // Lo que sigue en la luz (L/día)
        etiqueta(c, `${num(CIF.filtradoL * M.tfg)} L`, 252, 22, C.texto);
        etiqueta(c, `${num(CIF.filtradoL * M.tfg * (1 - CIF.aguaProximal))} L`, 318, 152, C.texto, 'right');
        etiqueta(c, `${num(M.aguaCol)} L`, 274, 452, C.texto, 'right');
        etiqueta(c, `${num(M.aguaCol)} L`, 120, 128, C.texto, 'left');
        etiqueta(c, M.fra?.obstruccion ? `${num(M.V)} L` : `${num(M.V)} L · ${Math.round(M.Uosm)}`, 104, 462, C.oro, 'left');
    }

    // ---------- Partículas ----------
    let parts = [];
    const acum = {};
    const globulos = Array.from({ length: 9 }, (_, i) => ({ a: i * 0.7, r: 4 + (i % 3) * 3, v: 1.2 + (i % 4) * 0.25 }));
    function nacer(esp) {
        const r = M.r[esp];
        let fin = LARGO, salir = false;
        for (const t of TRAMOS) {
            if (Math.random() < (r[t] || 0)) { const [a, b] = LIMITES[t]; fin = a + (b - a) * (0.1 + 0.85 * Math.random()); salir = true; break; }
        }
        const ang = Math.random() * Math.PI * 2, rr = Math.random() * 10;
        parts.push({ esp, s: 0, fin, salir, modo: 'nace', t: 0, ox: Math.cos(ang) * rr, oy: Math.sin(ang) * rr, lat: Math.random() - 0.5, vel: 62 + Math.random() * 22 });
    }
    function secretarK() {
        const [a, b] = LIMITES.col;
        parts.push({ esp: 'k', s: a + (b - a) * (0.08 + 0.8 * Math.random()), fin: LARGO, salir: false, modo: 'entra', t: 0, lado: Math.random() < 0.5 ? -1 : 1, lat: Math.random() - 0.5, vel: 62 + Math.random() * 20 });
    }
    function paso(dt) {
        for (const esp in ESPECIES) {
            acum[esp] = (acum[esp] || 0) + ESPECIES[esp].tasa * (esp === 'glu' ? M.gluSpawn : 1) * M.tfg * (reducido ? 0.5 : 1) * dt;
            while (acum[esp] >= 1) { acum[esp] -= 1; nacer(esp); }
        }
        acum.ksec = (acum.ksec || 0) + 24 * M.kSec * dt;
        while (acum.ksec >= 1) { acum.ksec -= 1; secretarK(); }
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
        ctx.fillStyle = '#d9604a'; // hematíes: circulan por el ovillo y nunca pasan
        for (const g of globulos) { ctx.beginPath(); ctx.ellipse(G.x + Math.cos(g.a) * g.r, G.y + Math.sin(g.a * 1.3) * g.r * 0.8, 2.2, 1.5, g.a, 0, 7); ctx.fill(); }
        // Por especie, un solo trazado por color.
        for (const esp in ESPECIES) {
            const e = ESPECIES[esp];
            ctx.fillStyle = e.color;
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
                forma(ctx, e.forma, x, y, e.r || RADIO[e.forma]);
                ctx.fill();
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
    function glifo(tipo, x, y) {
        const [, color, f] = ION[tipo];
        if (f === 'cuadrado') return `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="${color}"/>`;
        if (f === 'rombo') return `<path d="M${x} ${y - 5}L${x + 5} ${y}L${x} ${y + 5}L${x - 5} ${y}Z" fill="${color}"/>`;
        if (f === 'triangulo') return `<path d="M${x} ${y - 5}L${x + 5} ${y + 4}L${x - 5} ${y + 4}Z" fill="${color}"/>`;
        if (f === 'anillo') return `<circle cx="${x}" cy="${y}" r="3.6" fill="none" stroke="${color}" stroke-width="1.8"/>`;
        return `<circle cx="${x}" cy="${y}" r="${f === 'punto' ? 3 : 4.2}" fill="${color}"/>`;
    }
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
        return f.segmento === seg && f.canal === canal ? f : null;
    };
    const txt = (x, y, t, { size = 8.5, color = C.texto, ancla = 'start', peso = '', fam = 'Georgia' } = {}) =>
        `<text x="${x}" y="${y}" text-anchor="${ancla}" font-size="${size}" fill="${color}" font-family="${fam}"${peso ? ` font-weight="${peso}"` : ''}>${t}</text>`;
    function svgCelula(seg) {
        if (seg === 'glomerulo') return svgGlomerulo();
        const d = segmentosNefrona[seg];
        const para = seg === 'asa-ascendente-delgada', medular = seg === 'asa-descendente' || para;
        const osmInt = medular ? Math.round(M.M) : 300;
        const osmLuzSeg = { 'tubulo-proximal': 300, 'asa-descendente': Math.round(M.M), 'asa-ascendente-delgada': Math.round(M.M * 0.9), 'asa-ascendente-gruesa': M.Umin >= 280 ? 320 : 200, 'tubulo-distal': finTcd(M), colector: Math.round(M.Uosm) }[seg];
        const n = d.canales.length;
        const filasY = para ? [236] : n === 1 ? [200] : n === 2 ? [150, 290] : [118, 228, 338];
        const ahorr = estado.farm === 'espironolactona' || estado.farm === 'amilorida';
        let capas = '', textos = '';
        d.canales.forEach((cn, i) => {
            const y = filasY[i], bl = bloqueado(seg, cn.nombre);
            const esAqp2 = cn.nombre === 'Acuaporina-2', sinCanal = esAqp2 && M.a === 0, off = bl || sinCanal;
            let veces = 3, dur = 3.2;
            if (cn.nombre === 'ROMK') { const f = Math.sqrt(M.naTcd / 0.039) * (ahorr ? 0.3 : 1); veces = Math.max(1, Math.min(6, Math.round(3 * f))); dur = 3.6 / Math.max(0.6, Math.min(2, f)); }
            if (esAqp2) veces = Math.round(M.a * 5);
            (cn.flujo || []).forEach(([ion, dir], k) => {
                const yy = y - 10 + k * 13, col = ION[ion][1];
                const ida = para ? `M18 ${yy} L318 ${yy}` : `M18 ${yy} L92 ${yy} C150 ${yy} 160 ${yy + 22} 200 ${yy + 22} S258 ${yy} 272 ${yy} L320 ${yy}`;
                // El H⁺ sale de la propia célula; el K⁺ viene de la sangre.
                const vuelta = ion === 'h' ? `M210 ${yy + 22} C160 ${yy + 22} 130 ${yy} 92 ${yy} L18 ${yy}` : para ? `M318 ${yy} L18 ${yy}` : `M320 ${yy} L272 ${yy} C258 ${yy} 240 ${yy + 22} 200 ${yy + 22} S150 ${yy} 92 ${yy} L18 ${yy}`;
                capas += `<path d="${dir === 's' ? vuelta : ida}" fill="none" stroke="${col}" stroke-width="1.2" stroke-dasharray="2 5" opacity="${off ? 0.18 : 0.45}"/>`;
                const ruta = off ? (dir === 's' ? (ion === 'h' ? `M210 ${yy + 22} L100 ${yy}` : `M320 ${yy} L276 ${yy}`) : `M18 ${yy} L86 ${yy}`) : (dir === 's' ? vuelta : ida);
                const cuantos = off ? 2 : Math.max(1, veces);
                for (let q = 0; q < cuantos; q++) capas += viajero(ion, ruta, off ? 1.6 : dur, -(q * (off ? 0.8 : dur / cuantos) + k * 0.4).toFixed(2), off);
                textos += ion === 'h' ? txt(216, yy + 13, 'H⁺ (sale de la célula)', { size: 8, color: col })
                    : txt(dir === 's' ? 352 : 8, yy - 5, ION[ion][0], { size: 8, color: col, ancla: dir === 's' ? 'end' : 'start' });
            });
            if (para) textos += txt(180, y - 22, 'Unión entre células: paso pasivo', { size: 10, ancla: 'middle', peso: 'bold' });
            else {
                for (let q = 0; q < (esAqp2 ? veces : 1); q++) {
                    const yy = esAqp2 ? y - 22 + q * 11 : y - 2;
                    capas += `<rect x="83" y="${yy - 9}" width="12" height="${esAqp2 ? 9 : 22}" rx="4" fill="${off ? '#5a4a3a' : C.oro}" stroke="#17140f"/>`;
                }
                textos += txt(104, y + 30, `${cn.nombre}${esAqp2 && !sinCanal ? ` ×${veces} (ADH)` : ''}`, { size: 10, peso: 'bold' });
                if (cn.nombre === 'ROMK' && !off) textos += txt(104, y + 42, veces > 3 ? 'más flujo distal: secreta más' : veces < 3 ? 'menos ENaC: secreta menos' : 'secreción basal', { size: 8, color: C.suave });
            }
            if (sinCanal) textos += txt(104, y + 42, 'Sin ADH: no hay acuaporinas en la membrana', { color: CLARO.rojo });
            if (bl?.danio) textos += txt(104, y + 42, 'Célula dañada (NTA): apenas reabsorbe', { color: CLARO.rojo });
            else if (bl) {
                capas += `<path d="M78 ${y - 14} L100 ${y + 12} M100 ${y - 14} L78 ${y + 12}" stroke="${CLARO.rojo}" stroke-width="3.2"/>`;
                textos += txt(104, y + 42, `Bloqueado: ${bl.nombre}${bl.receptor ? ' (receptor de aldosterona)' : ''}`, { color: CLARO.rojo });
            }
        });
        const danada = M.fra?.nta && (seg === 'tubulo-proximal' || seg === 'asa-ascendente-gruesa');
        const celulas = danada
            ? `<path d="M88 52 h184 v396 h-184z" fill="rgba(205,184,154,.08)" stroke="#cdb89a" stroke-dasharray="6 5"/><path d="M84 120 q-14 18 -6 36 M80 300 q-12 14 -4 30" stroke="#9c7a52" stroke-width="5" fill="none"/>`
            : para
            ? `<path d="M88 52 h184 v172 q-92 10 -184 0z" fill="rgba(205,184,154,.16)" stroke="#cdb89a"/><path d="M88 248 q92 -10 184 0 v200 h-184z" fill="rgba(205,184,154,.16)" stroke="#cdb89a"/>`
            : `<path d="M88 52 h184 v396 h-184z" fill="rgba(205,184,154,.16)" stroke="#cdb89a"/>`;
        const mito = ['asa-ascendente-gruesa', 'tubulo-proximal', 'tubulo-distal'].includes(seg)
            ? [[240, 78], [246, 186], [128, 300], [246, 300], [246, 410]].map(([x, y]) => `<g transform="translate(${x} ${y}) rotate(${(x + y) % 50 - 25})"><ellipse rx="15" ry="6" fill="${alfa(C.purpura, 0.25)}" stroke="${alfa(CLARO.na, 0.6)}"/><path d="M-9 -3 v6 M-3 -4 v8 M3 -4 v8 M9 -3 v6" stroke="${alfa(CLARO.na, 0.5)}"/></g>`).join('') : '';
        const cepillo = seg === 'tubulo-proximal' && !danada ? Array.from({ length: 64 }, (_, i) => `<path d="M88 ${54 + i * 6.1} h-8" stroke="#cdb89a" stroke-width="1.6"/>`).join('') : '';
        const bomba = !medular;
        const fam = 'Courier New';
        return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Célula de ${d.nombre}">
            <rect width="${W}" height="${H}" fill="#120f0b"/>
            <rect x="0" y="40" width="80" height="420" fill="${colorOsm(osmLuzSeg, 0.3)}"/>
            <rect x="272" y="40" width="88" height="420" fill="${colorOsm(osmInt, 0.22)}"/>
            <rect x="300" y="56" width="40" height="392" rx="20" fill="${alfa(C.rojo, 0.22)}" stroke="${alfa(C.rojo, 0.55)}"/>
            ${[96, 176, 262, 344, 414].map(yy => `<ellipse cx="320" cy="${yy}" rx="9" ry="5" fill="${C.rojo}" opacity=".55"/>`).join('')}
            ${celulas}${cepillo}${mito}
            <ellipse cx="${para ? 180 : 186}" cy="${para ? 140 : 420}" rx="24" ry="14" fill="${alfa(C.purpura, 0.32)}" stroke="${alfa(C.purpura, 0.7)}"/>
            ${bomba ? filasY.map(y => `<rect x="266" y="${y + 6}" width="12" height="18" rx="5" fill="${C.verde}"/>`).join('') : ''}
            ${capas}${textos}
            ${txt(40, 28, `LUZ · ${osmLuzSeg}`, { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(180, 28, 'CÉLULA', { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${txt(316, 28, `SANGRE · ${osmInt}`, { size: 9, color: C.suave, ancla: 'middle', fam })}
            ${bomba ? txt(262, 466, 'verde: Na⁺/K⁺-ATPasa basolateral', { size: 8, color: C.verde, ancla: 'end' }) : ''}
            ${txt(8, 466, d.nombre.replace('Asa de Henle — ', '').replace(/ \(.*\)$/, ''), { size: 9, color: C.oro, peso: 'bold' })}
        </svg>`;
    }
    function svgGlomerulo() {
        const peq = ['h2o', 'na', 'glu', 'k', 'h2o', 'na', 'hco3', 'h2o'];
        const pasan = peq.map((ion, i) => `<g class="nv-pasa" style="animation-delay:${(i * 0.3).toFixed(1)}s">${glifo(ion, 70, 90 + i * 40)}</g>`).join('');
        const quedan = [0, 1, 2, 3].map(i => `<g class="nv-rebota" style="animation-delay:${(i * 0.55).toFixed(2)}s"><ellipse cx="52" cy="${120 + i * 80}" rx="11" ry="7" fill="#d9604a"/></g><g class="nv-rebota" style="animation-delay:${(i * 0.55 + 0.3).toFixed(2)}s"><circle cx="40" cy="${150 + i * 80}" r="6" fill="${C.purpura}"/></g>`).join('');
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
        estado.seg = seg;
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
        const parte = el.matches('dl') ? el.querySelector('dd') : el.querySelector('.micro-prof-body') || el;
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
    function pintarMedidores() {
        if (M.fra) {
            const t = M.fra.tabla;
            const items = [['Volumen', t.volumen], ['Osmolalidad', t.osm], ['Na⁺ en orina', t.naOrina], ['FENa', t.fena], ['Sedimento', t.sedimento]];
            $('#nv-medidores').innerHTML = items.map(([n, v]) => `
                <div class="nv-medidor"><div class="nv-medidor-nombre"><span>${n}</span><span class="nv-fuente ficha">ficha</span></div>
                <div class="nv-medidor-valor${v.length > 18 ? ' largo' : ''}">${v}</div></div>`).join('') + `
                <div class="nv-medidor"><div class="nv-medidor-nombre"><span>Filtrado</span><span class="nv-fuente">ilustrativo</span></div>
                <div class="nv-medidor-valor malo">↓ ${num(CIF.filtradoL * M.tfg)} L/día</div><div class="nv-medidor-nota">Normal: ${CIF.filtradoL} L/día</div></div>`;
            return;
        }
        const base = estado.farm === 'ninguno' && estado.sit !== 'hiperglucemia';
        const fen = M.fena * 100;
        const items = [
            ['Volumen', `${num(M.V)} L/día`, base, signo(M.V, REF.V), M.V >= M.aguaCol - 0.01 ? 'Sale todo lo que llega al colector' : 'Solutos ÷ osmolalidad'],
            ['Osmolalidad', `${Math.round(M.Uosm)} mOsm/kg`, base && estado.sit !== 'normal', signo(M.Uosm, REF.Uosm), M.Uosm < 280 ? 'Orina diluida' : M.Uosm > 600 ? 'Orina concentrada' : 'Cerca de la del plasma'],
            ['Na⁺ excretado', `${fen < 1.95 ? fen.toFixed(1).replace('.', ',') : Math.round(fen)}% del filtrado`, estado.farm === 'ninguno', signo(M.fena, REF.fena, 0.3), 'El resto se reabsorbe'],
            ['K⁺ en orina', `×${num(M.kRel)}`, false, signo(M.kRel, 1, 0.12), M.kRel > 1.15 ? 'Se pierde K⁺' : M.kRel < 0.85 ? 'Se ahorra K⁺' : 'Respecto a lo normal'],
            ['Glucosa', M.gGdia > 0.5 ? `${Math.round(M.gGdia)} g/día` : 'No', M.gGdia <= 0.5 && estado.farm !== 'isglt2', M.gGdia > 0.5 ? 'sube' : '', M.gGdia > 0.5 ? 'Glucosuria' : 'Se reabsorbe el 100%'],
            ['HCO₃⁻', M.hco3 > 0.05 ? 'Sale' : 'Casi nada', false, M.hco3 > 0.05 ? 'sube' : '', M.hco3 > 0.05 ? 'Orina alcalina' : 'Lo recupera el proximal'],
        ];
        $('#nv-medidores').innerHTML = items.map(([n, v, ficha, s, nota]) => `
            <div class="nv-medidor"><div class="nv-medidor-nombre"><span>${n}</span><span class="nv-fuente${ficha ? ' ficha' : ''}">${ficha ? 'ficha' : 'ilustrativo'}</span></div>
            <div class="nv-medidor-valor ${s}">${s === 'sube' ? '↑ ' : s === 'baja' ? '↓ ' : ''}${v}</div><div class="nv-medidor-nota">${nota}</div></div>`).join('');
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
        ].join('');
        $('#nv-explica').innerHTML = cuerpo + `<div class="nv-botones">${botones}</div>`;
        const av = [];
        if (f.id === 'furosemida') av.push('Sin NKCC2 el intersticio medular pierde su gradiente: la rama descendente casi no saca agua y el colector ya no puede concentrar aunque haya ADH.');
        if (f.id === 'furosemida' || f.id === 'tiazida') av.push('Llega más Na⁺ al colector, el flujo arrastra la secreción de K⁺ por ROMK y el K⁺ se pierde en la orina.');
        if (f.id === 'tiazida') av.push('El túbulo distal deja de diluir: con ADH presente se retiene agua libre, de ahí el riesgo de hiponatremia.');
        if (f.id === 'espironolactona' || f.id === 'amilorida') av.push('Menos Na⁺ reabsorbido por ENaC y menos K⁺ secretado por ROMK: ahorra K⁺.');
        if (f.id === 'acetazolamida') av.push('El HCO₃⁻ que no recupera el proximal sale por la orina; el Na⁺ que lo acompaña se recupera casi entero más adelante.');
        if (f.id === 'isglt2' || (estado.sit === 'hiperglucemia' && M.gGdia > 0.5)) av.push('La glucosa que queda en la luz arrastra agua: diuresis osmótica.');
        if (estado.sit === 'hiperglucemia' && estado.glucemia <= CIF.glucosaUmbral && f.id !== 'isglt2') av.push(`Por debajo de ~${CIF.glucosaUmbral} mg/dl el túbulo proximal todavía recupera toda la glucosa.`);
        if (estado.sit === 'siadh') av.push('Mismas acuaporinas que en la deshidratación, pero sin que el cuerpo lo necesite: el agua retenida diluye el sodio.');
        if (estado.sit === 'prerrenal') av.push('Llega poca sangre: se filtra menos, pero el túbulo sano recupera casi todo el sodio y la ADH concentra la orina.');
        if (estado.sit === 'nta') av.push('Las células que se caen viajan con la orina y forman cilindros granulosos en el colector.');
        if (estado.sit === 'obstruccion') av.push('La orina no puede salir: se acumula en el colector y la presión sube hacia atrás hasta el glomérulo.');
        if (estado.sit === 'di') av.push('Mismo dibujo que al beber mucha agua, pero aquí la pérdida de agua no está justificada.');
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
                return `<div class="nv-canal${bl ? ' bloq' : ''}"><h4>${cn.nombre}${bl ? ` <span>· ${bl.danio ? 'célula dañada (NTA)' : `bloqueado por ${bl.nombre}`}</span>` : ''}</h4>${cn.funcion}<div class="nv-canal-diana">Diana: ${cn.diana}</div></div>`;
            }).join('');
        cats.innerHTML = d.categorias.map(cat =>
            `<button class="accordion-btn nav-btn nefro-categoria-btn" data-categoria="${cat.key}" style="border-left: 4px solid var(--accent-green);">
                <span>${cat.etiqueta}</span><span style="font-size: 0.8rem; color: var(--accent-green);">[ VER → ]</span>
            </button>`).join('');
    }
    function chips(id, lista, clave) {
        const cont = $(id);
        cont.innerHTML = lista.map((x, i) => (x.grupo === 'fra' && lista[i - 1]?.grupo !== 'fra' ? '<span class="nv-chips-grupo">Fracaso renal agudo</span>' : '')
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
        pintarFondo(); pintarMedidores(); pintarExplica();
        if (estado.seg) pintarDetalle();
        if (estado.nivel === 'celula') capaCel.innerHTML = svgCelula(estado.seg);
        if (estado.nivel !== 'nefrona') parts = [];
        dibujar();
    }
    $('#nv-glucemia').addEventListener('input', e => {
        estado.glucemia = +e.target.value;
        $('#nv-glucemia-out').textContent = `${estado.glucemia} mg/dl`;
        actualizar();
    });
    // Leyenda de partículas con las mismas formas del dibujo.
    $('#nv-especies').innerHTML = Object.values(ESPECIES).map(e => {
        const c = document.createElement('canvas'); c.width = c.height = 24;
        const x = c.getContext('2d'); x.fillStyle = e.color; forma(x, e.forma, 12, 12, RADIO[e.forma] * 3); x.fill();
        return `<span><img src="${c.toDataURL()}" width="12" height="12" alt="">${e.nombre}</span>`;
    }).join('') + '<span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><ellipse cx="6" cy="6" rx="5" ry="3.5" fill="#d9604a"/></svg>Hematíes (no se filtran)</span>';

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
