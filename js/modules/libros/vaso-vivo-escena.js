// El vaso que sangra: la escena viva (la lámina en grabado). Arriba, una arteriola en corte con su pared en capas
// (colágeno, endotelio de adoquines y el glucocálix, hierba dorada que ondea); dentro corre la sangre. Abajo, la red de
// capilares que acaba en cuatro medallones (pulmón, riñón, cerebro y piel) o, en los estados de reponer, la gráfica, la
// balanza, las bolsas o el recambio. La herida de la pared se abre como una lupa grande (la dirección B de la maqueta,
// fundida con la A): al tocarla o en sus 4 tiempos. Las lupas pequeñas: la plaqueta, el frotis, el tubo y el
// complemento; la de la cascada es grande, con la máquina del telar (pieza común 5).
//
// Un solo estado (`estado`, la hoja de órdenes) y lo que se deriva de él (`D`, con derivar() de
// js/data/vaso-vivo-data.js). La interfaz y la capa de estudio viven en vaso-vivo.js. Viene de la maqueta aprobada
// autonomo/maquetas/b2-vaso.html. Las partículas salen de js/core/particulas.js (tabla única de formas); la bolsa, de
// js/core/bolsa.js; el tubo, de js/core/tubo.js; la máquina de la trombina y la plaqueta con FP4, del telar
// (telar-vivo-escena.js). Rendimiento: el bucle solo corre con la lámina a la vista; con «reducir movimiento» se pinta
// el estado final (en la herida, el tiempo 4). Todos los ids llevan el prefijo vso-. Rótulos ≥ 7,6 de cuerpo.
import { svgParticula } from '../../core/particulas.js';
import { svgBolsa } from '../../core/bolsa.js';
import { svgTuboEdta } from '../../core/tubo.js';
import { sinMovimiento } from '../../core/motion.js';
import { svgMaquinaTrombina, svgPlaquetaFp4, fp4Posiciones } from './telar-vivo-escena.js';
import { estadoBase, derivar, tableroDe, CELDAS, FIG132, FIB_CASO, FIB_CRIO, clamp } from '../../data/vaso-vivo-data.js';

export const $ = id => document.getElementById('vso-' + id);
const n2 = x => +(+x).toFixed(2);
const hashN = (i, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };   // pseudoazar fijo
export let REDUCIR = false;
const P = (clave, x, y, r, o = {}) => svgParticula(clave, x, y, r, o);

/* ============================================================
   Estado (solo esta pieza lo cambia, con aplicarModelo)
   ============================================================ */
export let estado = estadoBase();
export let D = derivar(estado);
export const ocultos = new Set();   // casillas tapadas con «?» hasta contestar ('organos': los medallones, apagados)
let lupaSel = null;                 // null: la que toca al estado; false: cerrada; 'herida' | 'cascada' | 'plaqueta'…: la pedida
let tCambio = 0, tLupa = 0, lupaPrevia = null;

// Rótulo con halo del color del fondo (se lee sobre la trama). Nunca por debajo de 7,6 de cuerpo.
function tx(x, y, t, { s = 8.2, c = 'text-dim', a = 'start', it = true, b = false, id = '' } = {}) {
    s = Math.max(7.6, s);
    return `<text${id ? ` id="vso-${id}"` : ''} x="${n2(x)}" y="${n2(y)}" font-size="${s}" text-anchor="${a}" style="fill:var(--${c});font-family:${it ? 'Georgia,serif;font-style:italic' : 'system-ui,sans-serif'}${b ? ';font-weight:700' : ''};paint-order:stroke;stroke:var(--bg-main);stroke-width:2.6;stroke-linejoin:round">${t}</text>`;
}
const DEFS = `<defs>
    <pattern id="vso-p-rayado" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-yellow)" stroke-opacity=".22" stroke-width=".7"/></pattern>
    <pattern id="vso-p-rayado-fino" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="2.6" style="stroke:var(--text-dim)" stroke-opacity=".18" stroke-width=".5"/></pattern>
    <pattern id="vso-p-colageno" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="3.2" style="stroke:var(--accent-red)" stroke-opacity=".22" stroke-width=".6"/></pattern>
    <pattern id="vso-p-punteado" width="7" height="6" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.5" r=".6" style="fill:var(--text-dim)" fill-opacity=".22"/><circle cx="5.1" cy="4.5" r=".5" style="fill:var(--text-dim)" fill-opacity=".16"/></pattern>
    <pattern id="vso-p-cruzado" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0L6 6M6 0L0 6" style="stroke:var(--text-muted)" stroke-opacity=".2" stroke-width=".5"/></pattern>
    <pattern id="vso-p-sangre" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--accent-red)" stroke-opacity=".16" stroke-width="1.2"/></pattern>
    <linearGradient id="vso-g-luz" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--accent-red)" stop-opacity=".1"/><stop offset=".5" style="stop-color:var(--accent-red)" stop-opacity=".05"/><stop offset="1" style="stop-color:var(--accent-red)" stop-opacity=".12"/></linearGradient>
    <radialGradient id="vso-g-vineta" cx="50%" cy="45%" r="75%"><stop offset="60%" style="stop-color:var(--bg-main)" stop-opacity="0"/><stop offset="100%" style="stop-color:var(--bg-main)" stop-opacity=".85"/></radialGradient>
    <radialGradient id="vso-g-brillo" cx="50%" cy="50%" r="50%"><stop offset="0" style="stop-color:var(--accent-red)" stop-opacity=".55"/><stop offset="1" style="stop-color:var(--accent-red)" stop-opacity="0"/></radialGradient>
    <clipPath id="vso-clip-lg"><circle cx="180" cy="196" r="137"/></clipPath>
    <clipPath id="vso-clip-lp"><circle cx="262" cy="92" r="77"/></clipPath>
  </defs>`;

/* ============================================================
   Geometría. A: la arteriola de la lámina, a escala 1. B: la herida de cerca (×2,1), dentro de la lupa grande:
   su centro (168, 150) cae en el de la lupa (180, 196).
   ============================================================ */
const GEO = {
    A: { s: 1, x0: 0, x1: 360, adv: [6, 14], sub: [14, 40], endo: [40, 48], gly: [48, 53], lumen: [53, 115], glyB: [115, 120], endoB: [120, 128], subB: [128, 146], advB: [146, 152],
        gap: [148, 212], gapG: [122, 238], rR: 4.2, rP: 2.4, rPlug: 3.5, cellW: 20, grass: 5,
        lanes: [60, 68, 76, 84, 92, 100, 108], n: { rbc: 16, plaq: 16, at: 3, factor: 3, dim: 6, fib: 4, ft: 5, gota: 8, bolsa: 6 } },
    B: { s: 2.1, x0: 28, x1: 308, adv: [4, 8], sub: [8, 60], endo: [60, 76], gly: [76, 86], lumen: [86, 292],
        gap: [118, 218], gapG: [84, 252], rR: 9, rP: 5, rPlug: 6.4, cellW: 40, grass: 10,
        lanes: [104, 124, 146, 168, 190, 212, 234, 256, 276], n: { rbc: 12, plaq: 11, at: 2, factor: 0, dim: 3, fib: 2, ft: 3, gota: 6, bolsa: 0 },
        rios: { tf: 'M214 66C254 112 226 190 158 200S112 196 104 193', ct: 'M30 214C52 214 70 206 80 197', ii: [92, 192], iia: [134, 170], hilo: 'M146 164Q156 152 160 138' } },
};
const LG = { cx: 180, cy: 196, r: 138, dx: 12, dy: 46 };   // la lupa grande (herida y cascada)
const LP = { cx: 262, cy: 92, r: 78 };                     // la lupa pequeña
const huecoDe = G => (estado.lesion === 'grande' ? G.gapG : G.gap);
function slotsDe(G, grande) {
    const [a, b] = grande ? G.gapG : G.gap, r = G.rPlug, dx = r * 2.15, dy = r * 1.85, out = [];
    for (let k = 0; k < 5; k++) {
        const enc = [0, 0.3, 0.75, 1.35, 2.1][k] * dx, y = G.endo[0] + r * 1.1 + k * dy, xa = a + r * 1.4 + enc, xb = b - r * 1.4 - enc;
        if (xb < xa - 0.5) break;
        const n = Math.max(1, Math.floor((xb - xa) / dx) + 1);
        for (let i = 0; i < n; i++) out.push({ x: n === 1 ? (xa + xb) / 2 : xa + i * (xb - xa) / (n - 1), y, k, i, n });
    }
    return out;
}

/* ---------- La pared en capas ---------- */
function pared(G, abajo, pre) {
    const s = G.s, h = [];
    const capa = abajo ? { sub: G.subB, endo: G.endoB, gly: G.glyB, adv: G.advB } : { sub: G.sub, endo: G.endo, gly: G.gly, adv: G.adv };
    const herida = !abajo && estado.lesion !== 'ninguna', [g0, g1] = herida ? huecoDe(G) : [0, 0];
    const enHueco = x => herida && x > g0 && x < g1;
    h.push(`<rect x="${G.x0}" y="${capa.adv[0]}" width="${G.x1 - G.x0}" height="${capa.adv[1] - capa.adv[0]}" style="fill:url(#vso-p-cruzado)"/>`);
    h.push(`<rect x="${G.x0}" y="${capa.sub[0]}" width="${G.x1 - G.x0}" height="${capa.sub[1] - capa.sub[0]}" style="fill:url(#vso-p-colageno)"/>`);
    // Fibras de colágeno: cordones ondulados terracota; en la herida asoman hacia la luz
    const alto = capa.sub[1] - capa.sub[0], fibras = [];
    for (let f = 0; f < 3; f++) {
        const yc = capa.sub[0] + alto * (f + 0.6) / 3.4, fase = f * 1.7;
        let d = '';
        for (let x = G.x0 - 4; x <= G.x1 + 4; x += 3 * s) {
            let y = yc + 2.3 * s * Math.sin(x / (8.5 * s) + fase);
            if (herida && f === 2) { const m = (g0 + g1) / 2, w = (g1 - g0) / 2, u = (x - m) / w; if (Math.abs(u) < 1) y += (4.5 * s) * Math.cos(u * Math.PI / 2) ** 2; }
            d += `${d ? 'L' : 'M'}${n2(x)} ${n2(y)}`;
        }
        fibras.push(`<path d="${d}" style="fill:none;stroke:var(--accent-red)" stroke-width="${n2(1.5 * s)}" stroke-opacity=".62" stroke-linecap="round"/><path d="${d}" style="fill:none;stroke:var(--text-main)" stroke-width="${n2(0.35 * s)}" stroke-opacity=".28" transform="translate(0 ${n2(-0.4 * s)})"/>`);
    }
    h.push(`<g${!abajo && pre === 'h' ? ' id="vso-h-colageno"' : ''}>${fibras.join('')}</g>`);
    // Lesión estructural: la pared se abre entera
    if (herida && estado.lesion === 'grande') h.push(`<path d="M${g0 + 8 * s} ${capa.adv[0] - 2}L${g0 + 2 * s} ${capa.sub[0] + 6 * s}L${g0 + 6 * s} ${capa.endo[0]}L${g1 - 6 * s} ${capa.endo[0]}L${g1 - 1 * s} ${capa.sub[0] + 5 * s}L${g1 - 7 * s} ${capa.adv[0] - 2}Z" style="fill:var(--bg-main)" opacity=".92"/>`);
    // Endotelio: adoquines con su núcleo; en la herida faltan y los del borde se levantan
    const w = G.cellW, hc = capa.endo[1] - capa.endo[0];
    for (let x = G.x0 - (abajo ? w / 2 : 0); x < G.x1; x += w) {
        const cx = x + w / 2;
        if (enHueco(cx)) continue;
        const borde = herida && (Math.abs(cx - g0) < w || Math.abs(cx - g1) < w), giro = borde ? (cx < g0 + w ? -16 : 16) : 0;
        h.push(`<g transform="rotate(${giro} ${n2(cx)} ${n2(capa.endo[abajo ? 0 : 1])})"><rect x="${n2(x + 0.6 * s)}" y="${capa.endo[0]}" width="${n2(w - 1.2 * s)}" height="${hc}" rx="${n2(hc / 2.2)}" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width="${n2(0.6 * s)}" stroke-opacity=".7"/><ellipse cx="${n2(cx)}" cy="${n2((capa.endo[0] + capa.endo[1]) / 2)}" rx="${n2(w * 0.16)}" ry="${n2(hc * 0.22)}" style="fill:var(--text-muted)" opacity=".6"/></g>`);
    }
    // Glucocálix: hierba fina que ondea con el flujo (el grupo se inclina en el bucle)
    let d = '';
    const base = abajo ? capa.gly[1] : capa.gly[0], dir = abajo ? -1 : 1;
    for (let x = G.x0; x < G.x1; x += 2.1 * s) {
        if (enHueco(x) || (herida && (Math.abs(x - g0) < 5 * s || Math.abs(x - g1) < 5 * s) && hashN(x) > 0.4)) continue;
        const l = G.grass * (0.7 + 0.5 * hashN(x, 3));
        d += `M${n2(x)} ${n2(base)}q${n2(0.9 * s)} ${n2(dir * l * 0.5)} ${n2(0.5 * s)} ${n2(dir * l)}`;
    }
    h.push(`<g id="vso-gly-${pre}${abajo ? 'b' : 't'}" data-base="${base}"><path d="${d}" style="fill:none;stroke:var(--accent-blue)" stroke-width="${n2(0.55 * s)}" stroke-opacity=".7" stroke-linecap="round"/></g>`);
    return h.join('');
}

/* ---------- El tapón (se repinta mientras se forma) ---------- */
function tapon(G, p, pre) {
    if (estado.lesion === 'ninguna') return '';
    const s = G.s, grande = estado.lesion === 'grande', slots = slotsDe(G, grande), [ga, gb] = huecoDe(G), cx = (ga + gb) / 2;
    const t = estado.t, anim = !REDUCIR && p < 1, base = G.endo[0];
    let vis = slots.filter((_, i) => i < Math.round(slots.length * D.fill));
    if (t === 1) vis = vis.filter(q => q.k === 0);
    const contr = t === 4 ? (anim ? p : 1) : 0;
    const pos = q => ({ x: cx + (q.x - cx) * (1 - 0.14 * contr), y: base + (q.y - base) * (1 - 0.38 * contr) });
    const llega = q => { const nueva = (t === 1 && q.k === 0) || (t === 2 && q.k > 0), u = nueva && anim ? p : 1; return { dx: -26 * s * (1 - u), dy: 16 * s * (1 - u), op: n2(0.25 + 0.75 * u) }; };
    const h = [];
    // FvW: hilos que bajan de las células de alrededor y anclan el tapón (tiempo 2 en adelante)
    if (t >= 2 && vis.length) {
        const op = n2(t === 2 && anim ? p : 1), anc = [vis.find(q => q.k === 1 && q.i === 0) || vis[0], vis.find(q => q.k === 1 && q.i === q.n - 1) || vis[vis.length - 1]];
        const hilos = [[ga - G.cellW * 0.45, anc[0]], [gb + G.cellW * 0.45, anc[1]]].map(([x0, q], j) => {
            const P0 = pos(q), y0 = G.endo[1] + 1, c1 = [x0 + (j ? -2 : 2) * s, y0 + 9 * s], c2 = [P0.x + (j ? 9 : -9) * s, P0.y + 7 * s];
            let g = `<path d="M${n2(x0)} ${n2(y0)}C${n2(c1[0])} ${n2(c1[1])} ${n2(c2[0])} ${n2(c2[1])} ${n2(P0.x)} ${n2(P0.y)}" style="fill:none;stroke:var(--accent-blue)" stroke-width="${n2(1.1 * s)}" stroke-linecap="round"/>`;
            for (let k = 1; k < 5; k++) { const u = k / 5, X = (1 - u) ** 3 * x0 + 3 * (1 - u) ** 2 * u * c1[0] + 3 * (1 - u) * u * u * c2[0] + u ** 3 * P0.x, Y = (1 - u) ** 3 * y0 + 3 * (1 - u) ** 2 * u * c1[1] + 3 * (1 - u) * u * u * c2[1] + u ** 3 * P0.y; g += `<circle cx="${n2(X)}" cy="${n2(Y)}" r="${n2(0.95 * s)}" style="fill:var(--accent-blue);stroke:var(--bg-main)" stroke-width="${n2(0.3 * s)}"/>`; }
            return g;
        });
        h.push(`<g${pre === 'h' ? ' id="vso-h-fvw"' : ''} opacity="${op}">${hilos.join('')}</g>`);
    }
    const plaq = vis.map(q => { const P0 = pos(q), L = llega(q); return P(t >= 2 ? 'plaquetaActiva' : 'plaqueta', P0.x + L.dx, P0.y + L.dy, G.rPlug * (t >= 2 ? 0.86 : 1), { opacidad: L.op }); });
    // Fibrinógeno: lo agarran las GPIIb/IIIa (tiempo 2-3); en el 3 se teje la fibrina encima
    const fib = [];
    if (t >= 2 && vis.length > 2) {
        const op = n2(t === 2 && anim ? p : t >= 3 ? 0.55 : 1);
        vis.forEach((q, i) => { const v = vis[i + 1]; if (!v || v.k !== q.k || i % 2) return; const A = pos(q), B = pos(v); fib.push(P('fibrinogeno', (A.x + B.x) / 2, (A.y + B.y) / 2 + 0.4 * s, G.rPlug * 0.42, { opacidad: op, giro: Math.atan2(B.y - A.y, B.x - A.x) * 180 / Math.PI })); });
    }
    // Ca²⁺: lo sueltan las plaquetas (tiempo 2)
    const ca = [];
    if (t === 2) { const u = anim ? p : 1; vis.filter(q => q.k === 2 || q.k === 3).slice(0, 5).forEach((q, i) => { const P0 = pos(q), a = i * 1.3 + 0.6; ca.push(P('ca', P0.x + Math.cos(a) * (3 + 9 * u) * s, P0.y + (4 + 8 * u) * s, 1.25 * s, { opacidad: n2(u) })); }); }
    // Fibrina: la red que teje la trombina (tiempos 3 y 4), con dos hematíes presos
    const red = [];
    if (t >= 3 && vis.length > 3) {
        const u = t === 3 && anim ? p : 1, top = Math.max(...vis.map(q => pos(q).y));
        for (let j = 0; j < 6; j++) {
            const yA = base + (j + 0.5) * (top - base + 4 * s) / 6, xa = ga + 2 * s + j * 2.5 * s, xb = gb - 2 * s - (5 - j) * 2.2 * s, yB = base + (5 - j + 0.6) * (top - base + 4 * s) / 6;
            red.push(`<path d="M${n2(xa)} ${n2(yA)}C${n2(xa + (xb - xa) * 0.35)} ${n2(yA + 6 * s)} ${n2(xa + (xb - xa) * 0.65)} ${n2(yB - 6 * s)} ${n2(xb)} ${n2(yB)}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${n2(1 - u)}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="${n2(0.75 * s)}" stroke-opacity=".95" stroke-linecap="round"/>`);
        }
        if (D.fill >= 1) [[0.22, 1], [0.78, -1]].forEach(([f, sg]) => red.push(P('rbc', ga + (gb - ga) * f, top + 1.5 * s, G.rR * 0.85, { opacidad: n2(u), giro: sg * 25 })));
    }
    h.push(`<g${pre === 'h' ? ' id="vso-h-tapon"' : ''}>${plaq.join('')}${fib.join('')}${ca.join('')}${red.length ? `<g${pre === 'h' ? ' id="vso-h-fibrina"' : ''}>${red.join('')}</g>` : ''}</g>`);
    return h.join('');
}
// Los dos ríos de la cascada bajo la herida (tiempo 3; en el 4, tenues): factor tisular (grueso, la principal) y contacto
function rios(G) {
    if (estado.lesion === 'ninguna' || estado.t < 3 || estado.causa === 'cid' || D.masiva || estado.plaq < 100000) return '';
    const s = G.s, c = G.rios, op = estado.t === 3 ? 1 : 0.32, [ga, gb] = G.gap;
    let h = `<g id="vso-h-rios" opacity="${op}">`;
    h += `<path d="${c.tf}" class="vso-rio" stroke-dasharray="${n2(5 * s)} ${n2(3 * s)}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="${n2(3.4 * s)}" stroke-opacity=".55" stroke-linecap="round"/>`;
    h += `<path d="${c.ct}" class="vso-rio" stroke-dasharray="${n2(3 * s)} ${n2(3 * s)}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="${n2(1.1 * s)}" stroke-opacity=".7" stroke-linecap="round"/>`;
    [[ga + 10 * s, G.endo[0] + 4 * s], [gb - 8 * s, G.endo[0] + 2 * s], [(ga + gb) / 2 + 14 * s, G.endo[0] - 2 * s]].forEach(([x, y]) => { h += P('ft', x, y, 1.9 * s); });
    h += P('fII', c.ii[0], c.ii[1], 8);
    h += `<path d="M${n2(c.ii[0] + 10)} ${n2(c.ii[1] - 3)}L${n2(c.iia[0] - 16)} ${n2(c.iia[1] + 2)}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="${n2(0.8 * s)}" stroke-dasharray="${n2(1.6 * s)} ${n2(1.2 * s)}"/>`;
    h += `<g transform="translate(${c.iia[0]} ${c.iia[1]}) scale(${n2(0.62 * s)}) rotate(-28)"><path d="M-13 0Q0 -8.5 13 0Q0 8.5 -13 0Z" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-width="1.3"/><path d="M-12 0L-17 -1M12 0L17 1" style="stroke:var(--accent-yellow)" stroke-width="1.1"/></g>`;
    h += `<path d="${c.hilo}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="${n2(0.8 * s)}" stroke-dasharray="${n2(2 * s)} ${n2(1.4 * s)}" class="vso-rio"/>`;
    if (estado.t === 3) h += tx(c.iia[0] - 2, c.iia[1] + 26, 'IIa', { s: 9, c: 'accent-yellow', a: 'middle', it: false, b: true }) + tx(228, 160, 'factor tisular', { s: 8.6, c: 'accent-yellow' }) + tx(58, 232, 'contacto', { s: 8.6, c: 'accent-yellow' });
    return h + '</g>';
}
function sangre(G) {
    if (!D.sangra) return '';
    const [ga, gb] = huecoDe(G), m = (ga + gb) / 2;
    return `<ellipse cx="${n2(m)}" cy="${n2((G.sub[0] + G.endo[0]) / 2)}" rx="${n2((gb - ga) * (D.sangra > 1 ? 0.7 : 0.45))}" ry="${n2((G.endo[0] - G.sub[0]) * 0.55)}" style="fill:url(#vso-g-brillo)" opacity="${D.sangra > 1 ? 0.9 : 0.6}"/>`;
}

/* ============================================================
   Aguas abajo: la red de capilares y los órganos
   ============================================================ */
const ORGANOS = [['pulmon', 'pulmón'], ['rinon', 'riñón'], ['cerebro', 'cerebro'], ['piel', 'piel']];
const RED = { medY: 280, medR: 23, cx: [66, 146, 226, 306], tronco: 186, venaY: 330 };
function organo(nombre, r) {
    const L = (d, w = 0.8, c = 'text-dim', op = 0.8) => `<path d="${d}" style="fill:none;stroke:var(--${c})" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const k = r / 23;
    if (nombre === 'pulmon') {
        let h = `<path d="M${-14 * k} ${-12 * k}C${-20 * k} ${-4 * k} ${-19 * k} ${12 * k} ${-8 * k} ${15 * k}C${-3 * k} ${15 * k} ${-2 * k} ${6 * k} ${-2 * k} ${-6 * k}ZM${14 * k} ${-12 * k}C${20 * k} ${-4 * k} ${19 * k} ${12 * k} ${8 * k} ${15 * k}C${3 * k} ${15 * k} ${2 * k} ${6 * k} ${2 * k} ${-6 * k}Z" style="fill:url(#vso-p-rayado-fino);stroke:var(--text-dim)" stroke-width=".8" stroke-opacity=".7"/>`;
        h += L(`M0 ${-19 * k}V${-9 * k}M0 ${-9 * k}Q${-4 * k} ${-6 * k} ${-8 * k} ${-1 * k}M0 ${-9 * k}Q${4 * k} ${-6 * k} ${8 * k} ${-1 * k}M${-8 * k} ${-1 * k}L${-11 * k} ${6 * k}M${-8 * k} ${-1 * k}L${-5 * k} ${7 * k}M${8 * k} ${-1 * k}L${11 * k} ${6 * k}M${8 * k} ${-1 * k}L${5 * k} ${7 * k}`, 1.1);
        for (const [x, y] of [[-11, 8], [-5, 9], [11, 8], [5, 9], [-13, 2], [13, 2]]) h += `<circle cx="${x * k}" cy="${y * k}" r="${1.9 * k}" style="fill:none;stroke:var(--text-dim)" stroke-width=".7" stroke-opacity=".75"/>`;
        return h;
    }
    if (nombre === 'rinon') {
        let h = `<path d="M${2 * k} ${-16 * k}C${16 * k} ${-17 * k} ${17 * k} ${15 * k} ${2 * k} ${16 * k}C${-6 * k} ${16 * k} ${-5 * k} ${6 * k} ${-1 * k} ${3 * k}C${-4 * k} ${1 * k} ${-4 * k} ${-1 * k} ${-1 * k} ${-3 * k}C${-5 * k} ${-6 * k} ${-6 * k} ${-16 * k} ${2 * k} ${-16 * k}Z" style="fill:url(#vso-p-rayado-fino);stroke:var(--text-dim)" stroke-width=".9" stroke-opacity=".8"/>`;
        h += L(`M${-1 * k} 0H${-13 * k}M${-6 * k} 0Q${-9 * k} ${7 * k} ${-11 * k} ${14 * k}`, 0.9, 'text-dim', 0.6);
        h += `<circle cx="${7 * k}" cy="${-4 * k}" r="${3 * k}" style="fill:none;stroke:var(--accent-red)" stroke-width=".8" stroke-opacity=".8"/>`;
        return h;
    }
    if (nombre === 'cerebro') {
        let h = `<path d="M${-16 * k} ${4 * k}C${-19 * k} ${-8 * k} ${-8 * k} ${-17 * k} ${2 * k} ${-15 * k}C${13 * k} ${-14 * k} ${19 * k} ${-6 * k} ${17 * k} ${3 * k}C${16 * k} ${9 * k} ${9 * k} ${11 * k} ${3 * k} ${9 * k}C${-4 * k} ${12 * k} ${-13 * k} ${11 * k} ${-16 * k} ${4 * k}Z" style="fill:url(#vso-p-rayado-fino);stroke:var(--text-dim)" stroke-width=".9" stroke-opacity=".8"/>`;
        h += L(`M${-12 * k} ${-2 * k}q${3 * k} ${-5 * k} ${6 * k} 0t${6 * k} ${-1 * k}t${6 * k} ${1 * k}t${6 * k} ${-2 * k}M${-11 * k} ${5 * k}q${4 * k} ${-4 * k} ${8 * k} 0t${8 * k} 0M${-4 * k} ${-12 * k}q${2 * k} ${4 * k} ${-1 * k} ${8 * k}M${7 * k} ${-12 * k}q${-2 * k} ${4 * k} ${1 * k} ${8 * k}`, 0.7, 'text-dim', 0.65);
        return h;
    }
    let h = `<path d="M${-22 * k} ${-6 * k}Q${-16 * k} ${-9 * k} ${-11 * k} ${-6 * k}T0 ${-6 * k}T${11 * k} ${-6 * k}T${22 * k} ${-6 * k}V${22 * k}H${-22 * k}Z" style="fill:url(#vso-p-rayado-fino);stroke:var(--text-dim)" stroke-width=".9" stroke-opacity=".75"/>`;
    h += L(`M${-22 * k} ${-1 * k}Q${-16 * k} ${-4 * k} ${-11 * k} ${-1 * k}T0 ${-1 * k}T${11 * k} ${-1 * k}T${22 * k} ${-1 * k}`, 0.6, 'text-dim', 0.5);
    h += L(`M${5 * k} ${-17 * k}L${7 * k} ${-6 * k}L${8 * k} ${8 * k}`, 0.9, 'text-dim', 0.7);
    h += L(`M${-16 * k} ${12 * k}q${5 * k} ${-4 * k} ${10 * k} 0t${10 * k} 0`, 0.9, 'accent-red', 0.55);
    return h;
}
function bez(Pt, u) { const v = 1 - u; return [0, 1].map(k => v * v * v * Pt[0][k] + 3 * v * v * u * Pt[1][k] + 3 * v * u * u * Pt[2][k] + u * u * u * Pt[3][k]); }
function muestrear(...curvas) { const out = []; curvas.forEach((Pt, j) => { for (let i = j ? 1 : 0; i <= 20; i++) out.push(bez(Pt, i / 20)); }); return out; }
function caminoCapilar(cx, off, y0, y1) {
    const ym = y0 + (y1 - y0) * 0.55, y38 = y0 + (y1 - y0) * 0.38;
    return { d: `M${cx} ${y0}C${n2(cx + off * 0.6)} ${n2(y0 + (y1 - y0) * 0.2)} ${n2(cx + off * 1.1)} ${n2(y38)} ${n2(cx + off)} ${n2(ym)}S${n2(cx + off * 0.45)} ${n2(y1 - 4)} ${n2(cx + off * 0.3)} ${y1}`,
        pts: muestrear([[cx, y0], [cx + off * 0.6, y0 + (y1 - y0) * 0.2], [cx + off * 1.1, y38], [cx + off, ym]], [[cx + off, ym], [cx + off * 0.9, ym + (ym - y38)], [cx + off * 0.45, y1 - 4], [cx + off * 0.3, y1]]) };
}
const enCamino = (pts, u) => { const f = clamp(u, 0, 0.9999) * (pts.length - 1), i = Math.floor(f), r = f - i, a = pts[i], b = pts[i + 1] || a; return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]; };
const organosVis = () => (ocultos.has('organos') ? { estado: { pulmon: 0, rinon: 0, cerebro: 0, piel: 0 }, rot: {} } : { estado: D.organos, rot: D.rotOrg });
function red() {
    const R = RED, h = [], O = organosVis(), hit = estado.causa === 'hit';
    h.push(`<rect id="vso-zona-red" x="4" y="158" width="352" height="178" rx="12" style="fill:url(#vso-p-punteado);stroke:var(--border-color)" stroke-width=".8"/>`);
    h.push(tx(22, 172, 'aguas abajo: la red de capilares', { s: 8.2, c: 'text-muted' }));
    const tronco = `M330 150L330 ${R.tronco - 10}Q330 ${R.tronco} 320 ${R.tronco}L36 ${R.tronco}`;
    h.push(`<path d="${tronco}" style="fill:none;stroke:var(--text-dim)" stroke-width="8" stroke-opacity=".45" stroke-linejoin="round"/><path d="${tronco}" style="fill:none;stroke:var(--bg-main)" stroke-width="5" stroke-linejoin="round"/><path d="${tronco}" style="fill:none;stroke:var(--accent-red)" stroke-width="2.6" stroke-opacity=".5" stroke-linejoin="round"/>`);
    if (hit) { const vena = `M330 ${R.venaY}L22 ${R.venaY}Q14 ${R.venaY} 14 ${R.venaY - 8}L14 196`; h.push(`<path d="${vena}" style="fill:none;stroke:var(--accent-purple)" stroke-width="6" stroke-opacity=".45"/><path d="${vena}" style="fill:none;stroke:var(--bg-main)" stroke-width="3.4"/><path d="M14 200l-3 6h6z" style="fill:var(--accent-purple)" opacity=".8"/>`); }
    R.cx.forEach((cx, i) => {
        [-13, 0, 13].map(off => caminoCapilar(cx, off, R.tronco, R.medY - R.medR + 2)).forEach(c => h.push(`<path d="${c.d}" style="fill:none;stroke:var(--text-dim)" stroke-width="4.4" stroke-opacity=".38"/><path d="${c.d}" style="fill:none;stroke:var(--bg-main)" stroke-width="2.6"/><path d="${c.d}" style="fill:none;stroke:var(--accent-red)" stroke-width="1.3" stroke-opacity=".42"/>`));
        if (hit) h.push(`<path d="M${cx - 16} ${R.medY + 16}Q${cx - 22} ${R.venaY} ${cx - 32} ${R.venaY}" style="fill:none;stroke:var(--accent-purple)" stroke-width="2.6" stroke-opacity=".45"/>`);
        const [k, nombre] = ORGANOS[i], est = O.estado[k], col = est === 2 ? 'accent-red' : est === 1 ? 'accent-yellow' : 'text-dim';
        h.push(`<g id="vso-med-${k}"><circle cx="${cx}" cy="${R.medY}" r="${R.medR + 7}" style="fill:url(#vso-g-brillo)" opacity="${est === 2 ? 1 : 0}"/>
            <circle cx="${cx}" cy="${R.medY}" r="${R.medR}" style="fill:var(--bg-main);stroke:var(--${col})" stroke-width="${est ? 1.8 : 0.9}"${est === 1 ? ' stroke-dasharray="3 2"' : ''}/>
            <g transform="translate(${cx} ${R.medY})" opacity="${est === 2 && k === 'rinon' && estado.causa === 'shu' ? 0.45 : 1}">${organo(k, R.medR - 2)}</g>
            ${est ? `<circle cx="${cx + 17}" cy="${R.medY - 17}" r="6.4" style="fill:var(--${col});stroke:var(--bg-main)" stroke-width="1.2"/>${tx(cx + 17, R.medY - 13.6, '!', { s: 9.4, c: 'bg-main', a: 'middle', it: false, b: true })}` : ''}
            ${tx(cx, R.medY + R.medR + 13, nombre + (O.rot[k] ? ' · ' + O.rot[k] : ''), { s: 8.4, c: col, a: 'middle', b: !!est })}</g>`);
    });
    return h.join('');
}
function nudo(x, y, tipo) {
    let h = `<g transform="translate(${n2(x)} ${n2(y)})">`;
    h += tipo === 'fvw' ? '<path d="M-4 -3C-1 0 1 -4 4 1" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.1"/>' : '<path d="M-4 -2L4 2M-4 2L4 -2M-3 -3.5L3 3.5" style="fill:none;stroke:var(--accent-yellow)" stroke-width=".8"/>';
    return h + P('plaquetaActiva', -1.6, 0.6, 1.3) + P('plaquetaActiva', 1.7, -0.5, 1.2) + '</g>';
}
const trombo = (x, y, vena) => `<g transform="translate(${x} ${y})"><ellipse rx="${vena ? 4.2 : 8}" ry="${vena ? 9 : 4.2}" style="fill:var(--text-main);stroke:var(--accent-red)" stroke-width="1" opacity=".85"/><path d="${vena ? 'M-3 -6L3 6M3 -6L-3 6M-3 0H3' : 'M-6 -3L6 3M-6 3L6 -3M0 -3V3'}" style="stroke:var(--accent-yellow)" stroke-width=".7"/></g>`;
function nudos() {
    const R = RED, h = [];
    R.cx.forEach((cx, i) => {
        const n = D.nudos[ORGANOS[i][0]] || 0;
        for (let j = 0; j < Math.min(3, n); j++) { const [x, y] = enCamino(caminoCapilar(cx, [-13, 0, 13][j], R.tronco, R.medY - R.medR + 2).pts, 0.5); h.push(nudo(x, y, D.tipoNudo)); }
    });
    if (estado.causa === 'hit') {
        h.push(`<g id="vso-trombo-arterial">${trombo(268, R.tronco, false)}${tx(268, R.tronco + 17, 'trombo arterial', { s: 8, c: 'accent-red', a: 'middle', b: true })}</g>`);
        h.push(`<g id="vso-trombo-venoso">${trombo(14, 252, true)}${tx(24, 300, 'trombo venoso', { s: 8, c: 'accent-red', b: true })}</g>`);
    }
    return h.join('');
}

/* ============================================================
   Las lupas pequeñas (coordenadas propias: círculo de radio 78 alrededor de 0, 0)
   ============================================================ */
const LUPA_NOMBRE = { herida: 'la herida', cascada: 'la cascada', plaqueta: 'la plaqueta', frotis: 'el frotis', tubo: 'el tubo', complemento: 'el complemento' };
export const LUPAS_GRANDES = new Set(['herida', 'cascada']);
function lupaPequena(tipo) {
    const h = [];
    if (tipo === 'plaqueta' && estado.causa === 'hit') {
        // La plaqueta con FP4 del telar (pieza común 5), a la escala de esta lupa; los rótulos, aquí a ≥ 7,6
        const r = 28, fp4 = fp4Posiciones(0, 6, r);
        h.push(`<g id="vso-l-fp4">${svgPlaquetaFp4({ pre: 'vso', cx: 0, cy: 6, r, rotulos: false, trama: '#vso-p-rayado-fino' })}</g>`);
        fp4.forEach(([x, y, g], i) => {
            const a = g * Math.PI / 180;
            if (i % 2 === 0 && estado.hep === 'curso') h.push(P('heparina', x + Math.cos(a) * 9, y + Math.sin(a) * 9, 3.2, { giro: g + 90 }));
            if (i !== 3) h.push(P('igg', x + Math.cos(a) * 17, y + Math.sin(a) * 17, 4.6, { giro: g + 90 }));
        });
        for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.3; h.push(`<path d="M${n2(Math.cos(a) * (r + 1))} ${n2(6 + Math.sin(a) * (r + 1))}L${n2(Math.cos(a) * (r + 7))} ${n2(6 + Math.sin(a) * (r + 7))}" style="stroke:var(--text-main)" stroke-width="1.1" stroke-linecap="round"/>`); }
        h.push(tx(0, 9, 'plaqueta', { s: 8.4, c: 'text-main', a: 'middle' }));
        h.push(tx(-46, -38, 'FP4', { s: 8.4, c: 'text-main', a: 'middle', it: false, b: true }));
        h.push(tx(10, -50, estado.hep === 'curso' ? 'heparina' : 'sin heparina', { s: 8.2, c: 'accent-purple', b: true }));
        h.push(tx(50, 20, 'IgG', { s: 8.4, c: 'accent-red', it: false, b: true }));
        h.push(tx(0, 52, 'se enciende:', { s: 8.2, c: 'text-main', a: 'middle' }), tx(0, 63, 'trombosis', { s: 8.6, c: 'accent-red', a: 'middle', b: true }));
        return h.join('');
    }
    if (tipo === 'plaqueta' && estado.causa === 'ptt') {
        h.push(`<g id="vso-l-fvw"><path d="M-80 -6C-50 -24 -20 14 0 -4S50 -26 80 -6" style="fill:none;stroke:var(--accent-blue)" stroke-width="2.2"/>`);
        for (let i = 0; i < 9; i++) h.push(`<circle cx="${n2(-70 + i * 17.5)}" cy="${n2(-8 + 9 * Math.sin(i * 1.1))}" r="2.2" style="fill:var(--accent-blue)"/>`);
        [[-50, -4], [-22, 6], [6, -9], [34, -14], [58, -8]].forEach(([x, y], i) => h.push(P('plaquetaActiva', x, y + 8, 6.2, { giro: i * 30 })));
        h.push('</g><g id="vso-l-adamts">');
        [[-30, 34], [26, 34]].forEach(([x, y]) => h.push(P('adamts13', x, y, 7), P('igg', x - 10, y - 10, 4.4, { giro: -30 }), P('igg', x + 11, y - 9, 4.4, { giro: 30 })));
        h.push('</g>');
        h.push(tx(0, -34, 'FvW sin cortar', { s: 8.4, c: 'accent-blue', a: 'middle', b: true }), tx(-2, 56, 'ADAMTS-13 atada', { s: 8.4, c: 'accent-green', a: 'middle', b: true }), tx(0, 67, 'por anticuerpos', { s: 8.2, c: 'accent-red', a: 'middle' }));
        return h.join('');
    }
    if (tipo === 'plaqueta') {   // la adhesión: colágeno, FvW, GPIIb/IIIa, fibrinógeno y Ca²⁺
        h.push('<rect x="-80" y="-62" width="62" height="18" rx="8" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width=".8"/><ellipse cx="-50" cy="-53" rx="9" ry="4" style="fill:var(--text-muted)" opacity=".6"/>');
        h.push('<path d="M-10 -66C4 -60 22 -66 40 -58S64 -60 80 -54" style="fill:none;stroke:var(--accent-red)" stroke-width="3" stroke-opacity=".7"/>');
        h.push('<g id="vso-l-fvw"><path d="M-30 -44C-34 -30 -20 -24 -12 -14" style="fill:none;stroke:var(--accent-blue)" stroke-width="2"/>' + [[-31, -38], [-27, -28], [-19, -20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.1" style="fill:var(--accent-blue)"/>`).join('') + '</g>');
        h.push(P('plaquetaActiva', 0, 6, 17));
        [[-9, -10, -30], [16, -4, 40], [-17, 14, -120], [12, 20, 130]].forEach(([x, y, g]) => h.push(`<g transform="translate(${x} ${y}) rotate(${g})"><path d="M-2.6 0V-4.4M2.6 0V-4.4M-2.6 0H2.6" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.6" stroke-linecap="round"/></g>`));
        h.push(P('plaquetaActiva', 54, 22, 10), P('fibrinogeno', 33, 15, 4.4, { giro: 20 }));
        [[-38, 30], [-28, 42], [-12, 38]].forEach(([x, y]) => h.push(P('ca', x, y, 2.6)));
        h.push(tx(-46, -26, 'FvW', { s: 8.6, c: 'accent-blue', a: 'end', it: false, b: true }), tx(44, -40, 'colágeno', { s: 8.2, c: 'accent-red', a: 'middle' }), tx(22, -14, 'GPIIb/IIIa', { s: 8.2, c: 'accent-yellow', it: false, b: true }), tx(36, 46, 'fibrinógeno', { s: 8.2, c: 'accent-yellow', a: 'middle' }), tx(-34, 60, 'Ca²⁺', { s: 8.4, c: 'text-main', a: 'middle', it: false, b: true }));
        return h.join('');
    }
    if (tipo === 'frotis') {
        const cid = estado.causa === 'cid';
        h.push('<rect x="-80" y="-80" width="160" height="160" style="fill:url(#vso-p-punteado)"/><path d="M-80 -24H80M-80 24H80" style="stroke:var(--text-dim)" stroke-width="2.2" stroke-opacity=".6"/>');
        h.push(cid ? '<path d="M-4 -24C4 -8 -8 8 2 24M4 -24C-2 -6 10 6 -4 24" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.4"/>' : `<g>${P('plaquetaActiva', -2, -15, 4.4)}${P('plaquetaActiva', 6, -9, 4)}${P('plaquetaActiva', -4, -3, 4)}</g>`);
        h.push(`<g id="vso-lupa-hematie">${P('rbc', 0, 0, 9)}</g><g id="vso-lupa-casco" display="none">${P('esquisto', 0, 0, 9)}${P('esquisto', 4, 10, 4, { giro: 160 })}</g>`);
        [[34, 6, 20], [58, -8, -30]].forEach(([x, y, g]) => h.push(P('esquisto', x, y, 7.5, { giro: g })));
        h.push(tx(-46, -32, 'hematíe', { s: 8.4, c: 'accent-red', a: 'middle' }), tx(4, -32, cid ? 'fibrina' : 'microtrombo', { s: 8.4, c: cid ? 'accent-yellow' : 'text-main' }), tx(30, 44, 'esquistocitos', { s: 8.4, c: 'accent-red', a: 'middle', b: true }), tx(0, 58, 'se rompe al pasar', { s: 8.2, c: 'text-dim', a: 'middle' }));
        return h.join('');
    }
    if (tipo === 'tubo') {
        // El tubo (pieza común 3): con EDTA, grumos; al lado, el mismo sin anticuerpos contra el EDTA (citrato o heparina)
        const k = 0.6, en = (x, y) => `translate(${n2(x - 110 * k)} ${n2(y - 120 * k)}) scale(${k})`;
        h.push(`<g transform="${en(-30, -2)}">${svgTuboEdta({ prefijo: 'vso-t-edta', grumos: true })}</g>`);
        h.push(`<g transform="${en(30, -2)}">${svgTuboEdta({ prefijo: 'vso-t-citrato', grumos: false })}<rect x="94" y="58" width="32" height="10" rx="3" style="fill:var(--text-muted)"/></g>`);
        h.push(tx(-30, -48, 'EDTA', { s: 8.4, c: 'accent-purple', a: 'middle', it: false, b: true }), tx(30, -48, 'citrato', { s: 8.4, c: 'text-dim', a: 'middle', it: false, b: true }));
        h.push(tx(-30, 44, 'grumos', { s: 8.2, c: 'accent-red', a: 'middle', b: true }), tx(-30, 55, '= «leucocitos»', { s: 7.8, c: 'text-dim', a: 'middle' }), tx(30, 44, 'sueltas', { s: 8.2, c: 'accent-green', a: 'middle', b: true }), tx(30, 55, 'cuenta real', { s: 7.8, c: 'text-dim', a: 'middle' }));
        return h.join('');
    }
    if (tipo === 'complemento') {
        h.push('<path d="M-80 40H80" style="stroke:var(--text-dim)" stroke-width="10" stroke-opacity=".3"/>');
        for (let x = -72; x <= 72; x += 20) h.push(`<rect x="${x - 8}" y="35" width="16" height="10" rx="4" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width=".7"/>`);
        [[-46, -10, true], [-6, 14, false], [36, -22, true], [52, 16, false]].forEach(([x, y, frenado]) => {
            h.push(`<circle cx="${x}" cy="${y}" r="9" style="fill:var(--bg-card);stroke:var(--accent-green)" stroke-width="1.4"/>`, tx(x, y + 3, 'C5', { s: 7.8, c: 'accent-green', a: 'middle', it: false, b: true }));
            h.push(frenado ? P('igg', x + 10, y - 10, 5, { giro: 40 }) : `<path d="M${x} ${y + 10}L${x + 2} ${y + 22}" style="stroke:var(--accent-green)" stroke-width="1.2" stroke-dasharray="2 2"/>`);
        });
        h.push(tx(0, -44, 'el complemento, sin control', { s: 8.2, c: 'accent-green', a: 'middle', b: true }), tx(0, 58, 'eculizumab, una IgG', { s: 7.8, c: 'accent-red', a: 'middle' }), tx(0, 68, 'que se une a C5', { s: 7.8, c: 'accent-red', a: 'middle' }));
        return h.join('');
    }
    return '';
}
// Dónde señala cada lupa pequeña en la lámina
function objetivoLupa(L) {
    if (L === 'plaqueta' && estado.causa === 'hit') return [92, 82];
    if (L === 'plaqueta' && estado.causa === 'ptt') return [104, 84];
    if (L === 'plaqueta') return [180, 50];
    if (L === 'frotis') return [146, 230];
    if (L === 'complemento') return [146, 262];
    if (L === 'tubo') return [180, 84];
    return null;
}

/* ============================================================
   La lupa grande: la herida de cerca (la B de la maqueta) o la cascada (la máquina del telar)
   ============================================================ */
function lupaHerida() {
    const G = GEO.B;
    let h = `<rect width="360" height="340" style="fill:var(--bg-main)"/><g transform="translate(${LG.dx} ${LG.dy})"><rect x="0" y="0" width="360" height="300" style="fill:url(#vso-g-luz)"/>`;
    h += pared(G, false, 'h') + `<g id="vso-h-sangre">${sangre(G)}</g>` + '<g id="vso-g-flujo-h"></g>' + `<g id="vso-g-tapon-h">${tapon(G, 1, 'h')}</g>` + rios(G) + '<g id="vso-g-gotas-h"></g>';
    h += '</g>';
    return h;
}
function rotulosHerida() {
    const a = (x, y) => [x + LG.dx, y + LG.dy];
    const R = (x, y, t, o) => { const [X, Y] = a(x, y); return tx(X, Y, t, o); };
    const h = [R(96, 40, 'colágeno', { s: 9, c: 'accent-red', b: true }), R(58, 72, 'endotelio', { s: 8.6, c: 'text-dim' }), R(48, 100, 'glucocálix', { s: 8.6, c: 'accent-blue' })];
    if (estado.causa === 'ninguna' && !D.masiva && estado.plaq >= 100000) {
        if (estado.t === 1) h.push(R(168, 116, 'se pegan al colágeno', { s: 8.8, c: 'text-main', a: 'middle' }));
        if (estado.t === 2) h.push(R(70, 124, 'FvW', { s: 9, c: 'accent-blue', it: false, b: true }), R(236, 124, 'GPIIb/IIIa', { s: 8.6, c: 'accent-yellow', it: false, b: true }), R(168, 152, 'fibrinógeno', { s: 8.6, c: 'accent-yellow', a: 'middle' }), R(120, 152, 'Ca²⁺', { s: 8.6, c: 'text-main', a: 'end', it: false, b: true }));
        if (estado.t === 3) h.push(R(168, 148, 'fibrina', { s: 9, c: 'accent-yellow', a: 'middle', b: true }));
        if (estado.t === 4) h.push(R(168, 130, 'se contrae', { s: 9, c: 'text-main', a: 'middle' }), R(168, 236, 'el flujo vuelve →', { s: 9, c: 'accent-green', a: 'middle', b: true }));
    } else if (D.sangra) h.push(R(168, 124, estado.plaq < 100000 ? 'pocas plaquetas: no cierra' : 'no cierra', { s: 8.8, c: 'accent-red', a: 'middle', b: true }));
    if (D.sangra === 2) h.push(R(168, 20, 'sangra', { s: 9.4, c: 'accent-red', a: 'middle', b: true }));
    h.push(R(168, 260, `tiempo ${estado.t} de 4 · ${['se pegan', 'se anclan', 'fibrina', 'se contrae'][estado.t - 1]}`, { s: 8.4, c: 'accent-yellow', a: 'middle', it: false, b: true }));
    return h.join('');
}
// La cascada: los dos ríos llegan a la máquina del telar (el Xa, la protrombina y la trombina que teje la fibrina);
// abajo, la despensa de los factores que dependen de la vitamina K (II, VII, IX y X)
function lupaCascada() {
    const warf = estado.rep === 'warf-pfc', ccp = estado.rep === 'ccp4f', arg = estado.causa === 'hit' && estado.hep === 'argatroban';
    const xa = [214, 132], ii = [174, 120], iia = [150, 236];
    let h = '<rect width="360" height="340" style="fill:var(--bg-main)"/><rect x="40" y="58" width="280" height="280" style="fill:url(#vso-p-punteado)" opacity=".7"/>';
    h += '<g id="vso-cas-rios">';
    h += '<path d="M60 88C110 96 160 104 196 124" class="vso-rio" stroke-dasharray="6 4" style="fill:none;stroke:var(--accent-yellow)" stroke-width="6" stroke-opacity=".55" stroke-linecap="round"/>';
    h += '<path d="M302 92C276 100 248 110 226 122" class="vso-rio" stroke-dasharray="3 3" style="fill:none;stroke:var(--accent-yellow)" stroke-width="2" stroke-opacity=".75" stroke-linecap="round"/>';
    h += tx(92, 120, 'vía del factor tisular', { s: 8.2, c: 'accent-yellow' }) + tx(96, 131, '(la principal)', { s: 7.8, c: 'text-dim' }) + tx(272, 124, 'de contacto', { s: 8.2, c: 'accent-yellow', a: 'end' });
    h += '</g>';
    h += `<g id="vso-cas-maquina">${svgMaquinaTrombina({ pre: 'vso', xa, ii, iia })}</g>`;
    // de la tejedora sale la fibrina: el fibrinógeno (I) se hace hilo
    h += `<g id="vso-cas-fibrina">${P('fibrinogeno', 210, 226, 5.2)}<path d="M228 226H244" style="stroke:var(--accent-yellow)" stroke-width="1.1"/>${P('fibrina', 262, 226, 7)}${tx(210, 214, 'fibrinógeno (I)', { s: 7.8, c: 'accent-yellow', a: 'middle' })}${tx(262, 244, 'fibrina', { s: 8, c: 'accent-yellow', a: 'middle' })}</g>`;
    if (arg) h += `<g id="vso-cas-arg"><path d="M${iia[0] - 11} ${iia[1] - 11}L${iia[0] + 11} ${iia[1] + 11}M${iia[0] + 11} ${iia[1] - 11}L${iia[0] - 11} ${iia[1] + 11}" style="stroke:var(--bg-main)" stroke-width="5.5" stroke-linecap="round"/><path d="M${iia[0] - 11} ${iia[1] - 11}L${iia[0] + 11} ${iia[1] + 11}M${iia[0] + 11} ${iia[1] - 11}L${iia[0] - 11} ${iia[1] + 11}" style="stroke:var(--accent-red)" stroke-width="2.8" stroke-linecap="round"/>${tx(100, 206, 'argatrobán:', { s: 8.4, c: 'accent-red', a: 'middle', b: true })}${tx(100, 217, 'frena la IIa', { s: 8.2, c: 'accent-red', a: 'middle' })}</g>`;
    // la despensa de la vitamina K
    h += `<g id="vso-cas-despensa">${tx(180, 286, warf ? 'warfarina: la despensa, vacía' : ccp ? 'CCP4F: la despensa, llena' : 'dependen de la vitamina K', { s: 8, c: warf ? 'accent-red' : ccp ? 'accent-green' : 'text-muted', a: 'middle', b: warf || ccp })}`;
    ['fII', 'fVII', 'fIX', 'fX'].forEach((f, i) => { h += P(f, 132 + i * 32, 304, 9, warf ? { hueco: true } : {}); });
    h += '</g>';
    h += tx(180, 96, 'la máquina del telar', { s: 7.8, c: 'text-muted', a: 'middle' });
    return h;
}

/* ============================================================
   Debajo de la arteriola, en vez de la red: la Fig. 13.2 viva, la balanza, la hemorragia masiva o el recambio
   ============================================================ */
const PIE_TITULO = { fig132: 'Fig. 13.2, viva: lo que sube cada transfusión', balanza: 'La balanza del INR', masiva: 'Hemorragia masiva: bolsas y fibrinógeno', recambio: 'El recambio plasmático, cada día' };
// Una bolsa simple (sin rótulo de producto) para el plasma que se desecha
const bolsaGris = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-10 -10Q-10 -14 -6 -14H6Q10 -14 10 -10V10Q10 15 0 16Q-10 15 -10 10Z" style="fill:var(--bg-card);stroke:var(--text-muted)" stroke-width="1.3"/><path d="M-8 -2V9Q-8 13 0 14Q8 13 8 9V-2Z" style="fill:var(--text-muted)" opacity=".35"/></g>`;
function pie() {
    const h = [], e = estado;
    if (D.pie === 'fig132') {
        // la bolsa de plaquetas (pieza común 2) y la gráfica: barras a la hora y a las 24 h, con la banda del texto
        h.push(`<g id="vso-bolsa">${svgBolsa('plaquetas', { x: 30, y: 20, tubo: 20, rotulo: 'der', id: 'vso-bolsa-plaq', gota: 0 })}</g>`);
        const y0 = 112, k = 1.15, X = { 1: 170, 3: 238, 5: 306 }, x0 = 128, x1 = 346;
        h.push(tx(x0, 10, 'miles/µL', { s: 7.6, c: 'text-muted', it: false }));
        [0, 20, 40, 60].forEach(v => { h.push(`<path d="M${x0} ${n2(y0 - v * k)}H${x1}" style="stroke:var(--text-muted)" stroke-width=".4" stroke-opacity=".5"/>`, tx(x0 - 4, y0 - v * k + 3, String(v), { s: 7.6, c: 'text-muted', a: 'end', it: false })); });
        h.push(`<rect id="vso-f132-banda" x="${x0}" y="${n2(y0 - 50 * k)}" width="${x1 - x0}" height="${n2(15 * k)}" style="fill:url(#vso-p-rayado)" stroke-dasharray="3 2" stroke="var(--accent-green)" stroke-width=".8"/>`);
        h.push(tx(x1, 22, 'banda verde: el texto, 35-50 mil', { s: 7.8, c: 'accent-green', a: 'end', it: false, b: true }));
        for (const nn of [1, 3, 5]) {
            const [a, b] = FIG132[nn], x = X[nn], sel = nn === e.previas;
            h.push(`<g id="vso-f132-${nn}"><rect x="${x - 22}" y="${n2(y0 - a * k)}" width="20" height="${n2(a * k)}" style="fill:var(--accent-blue);stroke:var(--${sel ? 'text-main' : 'bg-main'})" stroke-width="${sel ? 1.4 : 0.6}" opacity="${sel ? 0.95 : 0.55}"/><rect x="${x + 2}" y="${n2(y0 - b * k)}" width="20" height="${n2(b * k)}" style="fill:url(#vso-p-sangre);stroke:var(--accent-red)" stroke-width="${sel ? 1.4 : 0.8}" opacity="${sel ? 1 : 0.6}"/>${tx(x, y0 + 12, `${nn}.ª`, { s: 8, c: sel ? 'text-main' : 'text-muted', a: 'middle', it: false, b: sel })}</g>`);
        }
        h.push(`<rect x="${x0}" y="138" width="10" height="7" style="fill:var(--accent-blue)"/>` + tx(x0 + 14, 145, 'a la hora', { s: 7.8, c: 'text-dim', it: false }));
        h.push(`<rect x="${x0 + 74}" y="138" width="10" height="7" style="fill:url(#vso-p-sangre);stroke:var(--accent-red)" stroke-width=".8"/>` + tx(x0 + 88, 145, 'a las 24 h', { s: 7.8, c: 'text-dim', it: false }));
        h.push(tx(x1, 145, 'transfusión', { s: 7.8, c: 'text-muted', a: 'end', it: false }));
        h.push(tx(14, 100, 'lectura', { s: 7.8, c: 'text-muted' }), tx(14, 110, 'aproximada', { s: 7.8, c: 'text-muted' }));
        return h.join('');
    }
    if (D.pie === 'balanza') {
        const warf = e.rep === 'warf-pfc', ccp = e.rep === 'ccp4f', pfc = e.rep === 'pfc', vacio = warf;
        const giro = pfc ? -2 : warf ? 5 : 0;
        h.push('<path d="M180 46V112M160 116H200" style="stroke:var(--text-dim)" stroke-width="2"/>');
        let g = `<g id="vso-b-fiel" transform="rotate(${giro} 180 46)"><path d="M66 46H294" style="stroke:var(--accent-yellow)" stroke-width="2.4"/><circle cx="180" cy="46" r="3.4" style="fill:var(--accent-yellow)"/>`;
        g += '<path d="M66 46L36 80M66 46L96 80M294 46L264 80M294 46L324 80" style="stroke:var(--text-dim)" stroke-width=".7"/>';
        g += '<g id="vso-b-izq"><path d="M30 80Q66 94 102 80Z" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width="1"/>';
        [['fII', 54, 72], ['fVII', 78, 72], ['fIX', 54, 56], ['fX', 78, 56]].forEach(([f, x, y]) => { g += P(f, x, y, 8, vacio ? { hueco: true } : {}); });
        g += '</g><g id="vso-b-der"><path d="M258 80Q294 94 330 80Z" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width="1"/>';
        g += P('at', 276, 70, 6.4) + `<circle cx="300" cy="72" r="7.6" style="fill:var(--bg-card);stroke:var(--accent-blue)" stroke-width="1.2"/><circle cx="318" cy="66" r="7.6" style="fill:var(--bg-card);stroke:var(--accent-blue)" stroke-width="1.2"/>`;
        g += tx(300, 75, 'C', { s: 8, c: 'accent-blue', a: 'middle', it: false, b: true }) + tx(318, 69, 'S', { s: 8, c: 'accent-blue', a: 'middle', it: false, b: true }) + (pfc ? P('at', 288, 56, 6.4) : '') + '</g></g>';
        h.push(g);
        h.push(tx(66, 108, 'lo que mide el INR', { s: 7.8, c: 'accent-blue', a: 'middle', it: false, b: true }), tx(66, 119, 'II, VII, IX y X', { s: 7.8, c: 'text-dim', a: 'middle', it: false }));
        h.push(tx(294, 108, 'anticoagulantes', { s: 7.8, c: 'accent-blue', a: 'middle', it: false, b: true }), tx(294, 119, 'antitrombina, proteínas C y S', { s: 7.6, c: 'text-dim', a: 'middle', it: false }));
        // el dial del INR, bajo el fiel
        const v = pfc ? 1.4 : warf ? 2.2 : ccp ? 1.1 : 1, a = Math.PI * (1 - clamp((v - 1) / 1.5, 0, 1));
        h.push(`<g id="vso-b-dial"><path d="M160 104A20 20 0 0 1 200 104" style="fill:none;stroke:var(--text-muted)" stroke-width="3"/><path d="M180 104L${n2(180 + Math.cos(a) * 18)} ${n2(104 - Math.sin(a) * 18)}" style="stroke:var(--accent-red)" stroke-width="1.8" stroke-linecap="round"/>${tx(180, 98, 'INR', { s: 7.6, c: 'text-muted', a: 'middle', it: false })}</g>`);
        if (pfc) {
            h.push(`<g id="vso-b-pfc">${svgBolsa('pfc', { x: 180, y: -2, tubo: 10, rotulo: false })}</g>`, tx(196, 14, 'PFC 12 mL/kg', { s: 7.8, c: 'text-dim', it: false }));
            h.push(tx(66, 136, 'INR: 1,8 → 1,4', { s: 8, c: 'accent-green', a: 'middle', it: false, b: true }), tx(294, 136, 'antitrombina: 38 → 50 %', { s: 8, c: 'accent-red', a: 'middle', it: false, b: true }));
        } else if (warf || ccp) {
            h.push(`<g id="vso-b-vitk"><rect x="134" y="-1" width="92" height="16" rx="8" style="fill:var(--bg-card);stroke:var(--accent-green)" stroke-width="1"/>${tx(180, 11, '1.º vitamina K', { s: 8, c: 'accent-green', a: 'middle', it: false, b: true })}</g>`);
            h.push(`<g id="vso-b-pfc" opacity="${ccp ? 0.5 : 1}">${svgBolsa('pfc', { x: 22, y: 122, tubo: 2, rotulo: false })}${tx(38, 134, 'PFC 10-15 mL/kg:', { s: 7.8, c: 'text-main', it: false })}${tx(38, 145, 'descongelar y volumen', { s: 7.6, c: 'text-dim', it: false })}</g>`);
            h.push(`<g id="vso-b-ccp" opacity="${ccp ? 1 : 0.6}">${svgBolsa('ccp4f', { x: 200, y: 122, tubo: 2, rotulo: false })}${tx(214, 134, 'CCP4F: 100 mL,', { s: 7.8, c: ccp ? 'accent-green' : 'text-main', it: false, b: ccp })}${tx(214, 145, 'menos de 30 min', { s: 7.6, c: 'text-dim', it: false })}</g>`);
        }
        return h.join('');
    }
    if (D.pie === 'masiva') {
        const fib = e.rep === 'crio' ? FIB_CASO + FIB_CRIO : FIB_CASO;
        h.push(`<g id="vso-m-bolsas">${['ch', 'ch', 'pfc', 'ch', 'pfc'].map((t, i) => svgBolsa(t, { x: 22 + i * 26, y: 18, escala: 0.9, tubo: 6, rotulo: false }) + tx(22 + i * 26, 64, t === 'ch' ? 'CH' : 'PFC', { s: 7.6, c: t === 'ch' ? 'accent-red' : 'accent-yellow', a: 'middle', it: false, b: true })).join('')}`);
        h.push(tx(74, 80, '1 PFC por cada 1-2 CH', { s: 7.8, c: 'text-main', a: 'middle', it: false, b: true }), tx(74, 91, 'perder la volemia en 24 h', { s: 7.8, c: 'text-dim', a: 'middle', it: false }), '</g>');
        [[16, 112], [34, 118], [52, 110], [70, 116], [88, 112], [106, 118], [124, 112]].forEach(([x, y]) => h.push(P('agua', x, y, 3)));
        h.push(tx(74, 136, 'los sueros diluyen el fibrinógeno', { s: 7.8, c: 'text-dim', a: 'middle', it: false }));
        const X = v => 170 + v * 0.42;
        h.push(`<g id="vso-m-fib">${tx(170, 20, 'Fibrinógeno (mg/dL)', { s: 7.8, c: 'text-muted', it: false })}`);
        h.push(`<rect x="${X(0)}" y="40" width="${n2(X(400) - X(0))}" height="12" rx="6" style="fill:var(--bg-card);stroke:var(--text-muted)" stroke-width=".6"/><rect x="${X(200)}" y="40" width="${n2(X(400) - X(200))}" height="12" style="fill:url(#vso-p-rayado-fino)" stroke="var(--accent-green)" stroke-dasharray="2 2" stroke-width=".7"/><rect x="${X(150)}" y="40" width="${n2(X(200) - X(150))}" height="12" style="fill:var(--accent-yellow)" opacity=".55"/>`);
        [0, 100, 200, 300, 400].forEach(v => h.push(tx(X(v), 64, String(v), { s: 7.6, c: 'text-muted', a: 'middle', it: false })));
        h.push(tx(X(300), 35, 'normal (fisiol.)', { s: 7.6, c: 'accent-green', a: 'middle', it: false }), tx(X(175), 78, 'crio en el trauma: 150-200', { s: 7.8, c: 'accent-yellow', a: 'middle', it: false, b: true }));
        h.push(`<path d="M${n2(X(fib))} 32V56" style="stroke:var(--accent-red)" stroke-width="2.2"/><path d="M${n2(X(fib) - 4)} 30h8l-4 5z" style="fill:var(--accent-red)"/>`);
        h.push(tx(258, 98, e.rep === 'crio' ? '120 + 50 con 1 U/10 kg, sin sangrado' : e.rep === 'fibconc' ? 'concentrado: 20 g/L, sin descongelar' : '120 (del caso): el primero que se agota', { s: 7.8, c: 'accent-red', a: 'middle', it: false, b: true }));
        if (e.rep === 'crio') h.push(tx(258, 110, 'sangrando, hará falta más', { s: 7.8, c: 'text-dim', a: 'middle', it: false }), svgBolsa('crio', { x: 214, y: 116, tubo: 4, rotulo: 'der', escala: 0.9 }));
        if (e.rep === 'fibconc') h.push(svgBolsa('fibrinogeno', { x: 214, y: 114, tubo: 4, rotulo: 'der', escala: 0.9 }));
        h.push('</g>');
        return h.join('');
    }
    if (D.pie === 'recambio') {
        h.push(`<g id="vso-r-separador"><rect x="146" y="34" width="68" height="44" rx="10" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-width="1.2"/>${tx(180, 52, 'separador', { s: 8, c: 'accent-yellow', a: 'middle', it: false, b: true })}${tx(180, 66, '1,5 volúmenes', { s: 7.6, c: 'text-dim', a: 'middle', it: false })}</g>`);
        h.push(`<circle cx="42" cy="56" r="20" style="fill:url(#vso-p-sangre);stroke:var(--accent-red)" stroke-width="1.2"/>${tx(42, 90, 'la paciente', { s: 7.8, c: 'text-dim', a: 'middle', it: false })}`);
        h.push(`<path d="M64 46H140" class="vso-rio" stroke-dasharray="5 3" style="fill:none;stroke:var(--accent-red)" stroke-width="3" stroke-opacity=".7"/>${tx(102, 40, 'su sangre', { s: 7.8, c: 'accent-red', a: 'middle', it: false })}`);
        h.push(`<path d="M140 68H64" class="vso-rio" stroke-dasharray="5 3" style="fill:none;stroke:var(--accent-red)" stroke-width="3" stroke-opacity=".7"/>${tx(102, 82, 'sus hematíes', { s: 7.8, c: 'accent-red', a: 'middle', it: false })}`);
        h.push(`<path d="M220 46H290" style="fill:none;stroke:var(--accent-yellow)" stroke-width="2" stroke-dasharray="3 2"/>${bolsaGris(312, 40)}${tx(304, 72, 'su plasma: se desecha', { s: 7.8, c: 'text-dim', a: 'middle', it: false })}`);
        h.push(`<g id="vso-r-donante">${svgBolsa('pfc', { x: 150, y: 86, tubo: 4, rotulo: false })}<path d="M140 116Q118 116 112 92" style="fill:none;stroke:var(--accent-yellow)" stroke-width="2" class="vso-rio" stroke-dasharray="4 3"/>${tx(172, 104, 'plasma de un donante sano', { s: 7.8, c: 'accent-yellow', it: false, b: true })}</g>`);
        h.push(`<g id="vso-r-pauta">${tx(172, 118, 'cada día, hasta 2 días seguidos', { s: 7.6, c: 'text-dim', it: false })}${tx(172, 129, 'con plaquetas normales', { s: 7.6, c: 'text-dim', it: false })}</g>`);
        return h.join('');
    }
    return '';
}

/* ============================================================
   Lo que se añade dentro de la arteriola: macrófagos, hilos de FvW sin cortar, la bolsa que gotea en la CID
   ============================================================ */
function extraArteriola() {
    const G = GEO.A, s = G.s, h = [], [y0, y1] = G.lumen;
    if (estado.causa === 'sepsis') {
        h.push('<g id="vso-macrofagos">');
        [[72, 94], [262, 98]].forEach(([x, y]) => h.push(P('macrofago', x, y, 5.4 * s), P('plaqueta', x - 1.5, y + 0.5, 1.5, { opacidad: 0.9 }), P('plaqueta', x + 2, y - 1.5, 1.4, { opacidad: 0.9 })));
        h.push('</g>');
    }
    if (estado.causa === 'ptt') {
        [40, 104, 252, 318].forEach((x, i) => {
            const top = i % 2 === 0, ya = top ? y0 : y1, yb = top ? y0 + (y1 - y0) * 0.62 : y0 + (y1 - y0) * 0.38;
            h.push(`<path d="M${x} ${ya}C${x + 8} ${n2((ya + yb) / 2)} ${x - 8} ${n2((ya + yb) / 2)} ${x + 3} ${n2(yb)}" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.1" stroke-opacity=".9"/>`);
            [0.35, 0.7, 0.95].forEach((u, j) => h.push(P('plaquetaActiva', x + (j - 1) * 2.5, ya + (yb - ya) * u, G.rP * 0.95)));
        });
    }
    if (estado.rep === 'lena') h.push(`<g id="vso-bolsa">${svgBolsa('plaquetas', { x: 84, y: 54, escala: 0.9, tubo: 12, rotulo: false, id: 'vso-bolsa-lena', gota: 0 })}${svgBolsa('pfc', { x: 110, y: 54, escala: 0.9, tubo: 12, rotulo: false })}${tx(72, 109, 'plaquetas y factores', { s: 7.8, c: 'text-main', b: true })}</g>`);
    return h.join('');
}
function rotulosArteriola(L) {
    const h = [tx(4, 25, 'colágeno', { s: 8.2, c: 'accent-red' }), tx(4, 47, 'endotelio', { s: 8, c: 'text-dim' }), tx(4, 63, 'glucocálix', { s: 8, c: 'accent-blue' })];
    if (estado.lesion === 'ninguna' && !L) h.push(tx(180, 11, 'toca la pared para abrir una herida', { s: 7.8, c: 'text-muted', a: 'middle' }));
    if (L && L !== 'herida' && L !== 'cascada') return h.join('');
    if (L) return h.join('');
    if (D.sangra === 2) h.push(tx(estado.lesion === 'grande' ? 244 : 220, 25, 'sangra', { s: 8.4, c: 'accent-red', b: true }));
    if (estado.causa === 'sepsis') h.push(tx(72, 112, 'macrófago', { s: 8, c: 'text-dim', a: 'middle' }));
    if (estado.causa === 'ptt') h.push(tx(180, 84, 'FvW sin cortar', { s: 8.2, c: 'accent-blue', a: 'middle', b: true }));
    if (estado.causa === 'hit') h.push(tx(180, 84, 'plaquetas encendidas por la IgG', { s: 8, c: 'text-main', a: 'middle' }));
    if (estado.causa === 'edta') h.push(tx(180, 84, 'en el paciente, las plaquetas son normales', { s: 8, c: 'text-main', a: 'middle' }));
    if (estado.causa === 'cid') h.push(tx(180, 84, 'factor tisular en toda la sangre', { s: 8, c: 'accent-yellow', a: 'middle' }));
    return h.join('');
}

/* ============================================================
   Construir la lámina (en cada cambio de estado o de lupa)
   ============================================================ */
export const lupaActual = () => (lupaSel === false ? null : lupaSel || D.lupaAuto);
function construir() {
    const svg = $('lamina'), G = GEO.A, L = lupaActual();
    let h = DEFS + '<rect width="360" height="360" style="fill:var(--bg-main)"/>';
    h += `<rect id="vso-zona-luz" x="0" y="${G.lumen[0]}" width="360" height="${G.lumen[1] - G.lumen[0]}" style="fill:url(#vso-g-luz)"/>`;
    h += `<g id="vso-g-pared">${pared(G, false, 'a')}${pared(G, true, 'a')}</g>`;
    h += `<rect id="vso-zona-glucocalix" x="0" y="${G.endo[1]}" width="360" height="${G.gly[1] - G.endo[1] + 3}" style="fill:none"/>`;
    h += `<g id="vso-g-mancha">${sangre(G)}</g><g id="vso-g-flujo"></g><g id="vso-g-extra">${extraArteriola()}</g><g id="vso-g-tapon">${tapon(G, 1, 'a')}</g><g id="vso-g-gotas"></g>`;
    h += `<g id="vso-g-rot">${rotulosArteriola(L)}</g>`;
    const [ga, gb] = huecoDe(G);
    h += `<rect id="vso-zona-herida" x="${ga - 4}" y="${G.sub[0]}" width="${gb - ga + 8}" height="${G.lumen[0] - G.sub[0] + 6}" style="fill:none"/>`;
    if (D.pie) h += `<g id="vso-zona-pie"><rect x="4" y="158" width="352" height="178" rx="12" style="fill:var(--bg-main);stroke:var(--border-color)" stroke-width=".8"/><g transform="translate(0 166)">${tx(14, 13, PIE_TITULO[D.pie], { s: 8.2, c: 'text-muted' })}<g transform="translate(0 16)">${pie()}</g></g></g>`;
    else h += `<g id="vso-g-red">${red()}</g><g id="vso-g-nudos">${nudos()}</g><g id="vso-g-flujo-red"></g>`;
    // Zona que se toca: la pared de arriba (abre la herida o su lupa)
    h += `<rect data-vso-toca="herida" role="button" aria-label="La herida de la pared" x="108" y="0" width="144" height="60" fill="transparent" style="cursor:pointer"/>`;
    if (L && LUPAS_GRANDES.has(L)) {
        const conector = `<path d="M${ga} 46L${LG.cx - 64} ${LG.cy - 122}M${gb} 46L${LG.cx + 64} ${LG.cy - 122}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1" stroke-dasharray="3 2"/><rect x="${ga - 2}" y="12" width="${gb - ga + 4}" height="${G.lumen[0] - 10}" rx="6" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.2"/>`;
        h += `${conector}<g id="vso-lupa-grande"><circle cx="${LG.cx}" cy="${LG.cy}" r="${LG.r + 3}" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width=".6" stroke-opacity=".6"/>`;
        h += `<g clip-path="url(#vso-clip-lg)">${L === 'herida' ? lupaHerida() : lupaCascada()}<rect width="360" height="340" style="fill:url(#vso-g-vineta)" opacity=".45" pointer-events="none"/></g>`;
        h += `<circle cx="${LG.cx}" cy="${LG.cy}" r="${LG.r}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="2.4"/>`;
        h += L === 'herida' ? rotulosHerida() : '';
        if (L === 'cascada') h += tx(LG.cx, LG.cy - LG.r + 18, `lupa: ${LUPA_NOMBRE[L]}`, { s: 8.4, c: 'accent-yellow', a: 'middle', it: false, b: true });
        h += '</g>';
    } else if (L) {
        const T = objetivoLupa(L);
        h += '<g id="vso-lupa-peq">';
        if (T) { const a = Math.atan2(T[1] - LP.cy, T[0] - LP.cx); h += `<path d="M${n2(LP.cx + Math.cos(a) * 80)} ${n2(LP.cy + Math.sin(a) * 80)}L${T[0]} ${T[1]}" style="stroke:var(--accent-yellow)" stroke-width="1" stroke-dasharray="3 2"/><circle cx="${T[0]}" cy="${T[1]}" r="7" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.2"/>`; }
        h += `<circle cx="${LP.cx}" cy="${LP.cy}" r="80" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width="2.4"/><g clip-path="url(#vso-clip-lp)"><g transform="translate(${LP.cx} ${LP.cy})">${lupaPequena(L)}</g></g>`;
        h += `<circle cx="${LP.cx}" cy="${LP.cy}" r="77" style="fill:none;stroke:var(--accent-yellow)" stroke-width=".6" stroke-opacity=".7"/>${tx(LP.cx, 9, 'lupa: ' + LUPA_NOMBRE[L], { s: 8.2, c: 'accent-yellow', a: 'middle', it: false, b: true })}</g>`;
    }
    svg.innerHTML = h;
    document.querySelectorAll('[data-vso-lupa]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vsoLupa === L)));
    if (L !== lupaPrevia) { tLupa = performance.now(); lupaPrevia = L; }
    crearPools(L);
    if (REDUCIR) colocarLupa(1);
}

/* ============================================================
   Las partículas que corren (la luz de la arteriola, la de la lupa de la herida, los capilares y la sangre que sale)
   ============================================================ */
let pools = [], polyRed = null;
const mem = {};
function poolLuz(G, flujo, gotas, tag, conGotas) {
    if (!flujo) return [];
    const out = [], hb = [];
    const add = (kind, n, visibles, fn) => {
        const m = mem[tag + kind] ||= [];
        for (let i = 0; i < n; i++) {
            if (!m[i]) m[i] = { x: G.x0 + hashN(i, kind.length) * (G.x1 - G.x0), lane: G.lanes[Math.floor(hashN(i + 3, kind.length + 1) * G.lanes.length)], ph: hashN(i, 9) * 6.28 };
            hb.push({ kind, i, m: m[i], vis: i < visibles, svg: fn(i), G });
        }
    };
    const mat = D.mat, hit = estado.causa === 'hit' && estado.hep === 'curso';
    add('rbc', G.n.rbc, G.n.rbc, i => P(mat && i % 3 === 0 ? 'esquisto' : 'rbc', 0, 0, G.rR, { giro: (hashN(i) - 0.5) * 40 }));
    add('plaq', G.n.plaq, Math.max(estado.plaq >= 5000 ? 1 : 0, Math.round(G.n.plaq * D.fPlaq)), () => (hit ? `<g>${P('plaquetaActiva', 0, 0, G.rP)}${P('igg', G.rP * 1.6, -G.rP * 1.4, G.rP * 0.8, { giro: 30 })}</g>` : P('plaqueta', 0, 0, G.rP)));
    add('at', G.n.at, G.n.at, () => P('at', 0, 0, G.rP * 1.05));
    add('factor', G.n.factor, Math.round(G.n.factor * D.fFactor), i => P(['fII', 'fX', 'fVII'][i % 3], 0, 0, 7.6, D.factorHueco ? { hueco: true } : {}));
    add('dim', G.n.dim, estado.causa === 'cid' ? G.n.dim : 0, i => P('dimero', 0, 0, G.rP * 0.95, { giro: hashN(i) * 90 }));
    add('fib', G.n.fib, estado.causa === 'cid' ? G.n.fib : 0, i => P('fibrina', 0, 0, G.rP * 2.1, { giro: hashN(i, 4) * 120 }));
    add('ft', G.n.ft, estado.causa === 'cid' ? G.n.ft : 0, () => P('ft', 0, 0, G.rP * 1.3));
    add('bolsa', G.n.bolsa, D.bolsa ? G.n.bolsa : 0, () => P('plaqueta', 0, 0, G.rP * 1.05));
    flujo.innerHTML = hb.map((p, j) => `<g data-p="${j}"${p.vis ? '' : ' display="none"'}>${p.svg}</g>`).join('');
    const els = flujo.children;
    hb.forEach((p, j) => { p.el = els[j]; out.push(p); });
    if (conGotas && D.sangra && gotas) {
        const nG = D.sangra === 2 ? G.n.gota : Math.ceil(G.n.gota / 2), [ga, gb] = huecoDe(G);
        gotas.innerHTML = Array.from({ length: nG }, () => `<g>${P('rbc', 0, 0, G.rR * 0.9)}</g>`).join('');
        [...gotas.children].forEach((el, i) => out.push({ kind: 'gota', el, vis: true, G, m: { u: hashN(i, 5), x: ga + (gb - ga) * (0.25 + 0.5 * hashN(i, 7)) } }));
    }
    return out;
}
function largo(pts) { const segs = []; let L = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push([pts[i - 1], pts[i], L, l]); L += l; } return { segs, L }; }
function enLinea(Pl, u) { const d = u * Pl.L; for (const [a, b, L0, l] of Pl.segs) if (d <= L0 + l) { const r = (d - L0) / l; return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]; } return Pl.segs[Pl.segs.length - 1][1]; }
function crearPools(L) {
    pools = [...poolLuz(GEO.A, $('g-flujo'), $('g-gotas'), 'a', true)];
    if (L === 'herida') pools.push(...poolLuz(GEO.B, $('g-flujo-h'), $('g-gotas-h'), 'h', true));
    polyRed = null;
    const red = $('g-flujo-red');
    if (!red) return;
    const R = RED, caps = [];
    R.cx.forEach((cx, i) => [-13, 0, 13].forEach((off, j) => caps.push({ pts: caminoCapilar(cx, off, R.tronco, R.medY - R.medR + 2).pts, nudo: j < (D.nudos[ORGANOS[i][0]] || 0) })));
    polyRed = { tronco: largo([[330, 150], [330, R.tronco - 10], [326, R.tronco - 2], [320, R.tronco], [36, R.tronco]]), vena: largo([[330, R.venaY], [22, R.venaY], [16, R.venaY - 4], [14, R.venaY - 10], [14, 196]]) };
    let hr = '';
    caps.forEach(() => { for (let q = 0; q < 2; q++) hr += `<g><g>${P('rbc', 0, 0, 1.8)}</g><g display="none">${P('esquisto', 0, 0, 1.9)}</g></g>`; });
    for (let q = 0; q < 7; q++) hr += `<g>${P('rbc', 0, 0, 2.2)}</g>`;
    const hit = estado.causa === 'hit';
    if (hit) for (let q = 0; q < 6; q++) hr += `<g opacity=".6">${P('rbc', 0, 0, 1.9)}</g>`;
    red.innerHTML = hr;
    const els = [...red.children]; let j = 0;
    caps.forEach((c, k) => { for (let q = 0; q < 2; q++) { const el = els[j++]; pools.push({ kind: 'cap', el, a: el.children[0], b: el.children[1], c, mat: D.mat, m: mem['cap' + k + q] ||= { u: (q * 0.5 + hashN(k, 2) * 0.5) % 1 }, vis: true }); } });
    for (let q = 0; q < 7; q++) pools.push({ kind: 'tronco', el: els[j++], vis: true, m: mem['tr' + q] ||= { u: q / 7 } });
    if (hit) for (let q = 0; q < 6; q++) pools.push({ kind: 'vena', el: els[j++], vis: true, m: mem['vn' + q] ||= { u: q / 6 } });
}
// El techo de la luz junto al tapón (las partículas pasan por debajo)
function techo(G, x) {
    if (estado.lesion === 'ninguna') return G.lumen[0];
    const [ga, gb] = huecoDe(G), m = (ga + gb) / 2, w = (gb - ga) / 2 + 6 * G.s, u = (x - m) / w;
    if (Math.abs(u) >= 1) return G.lumen[0];
    const filas = estado.t === 1 ? 1 : Math.max(1, Math.round(5 * Math.sqrt(D.fill))), alto = G.endo[0] + G.rPlug * (1.1 + 1.85 * (filas - 1) + 1.2) - G.lumen[0];
    return G.lumen[0] + Math.max(0, alto * (estado.t === 4 ? 0.62 : 1)) * Math.cos(u * Math.PI / 2) ** 2;
}
function mover(dt) {
    for (const p of pools) {
        if (!p.el || !p.vis) continue;
        const m = p.m;
        if (p.kind === 'gota') {
            const G = p.G, s = G.s, y0 = G.lumen[0] + 4 * s, y1 = D.sangra === 2 && estado.lesion === 'grande' ? G.adv[0] - 10 : G.sub[0] + 6 * s;
            m.u = (m.u + dt * (D.sangra === 2 ? 0.45 : 0.22)) % 1;
            p.el.setAttribute('transform', `translate(${n2(m.x + Math.sin(m.u * 9 + m.x) * 2 * s)} ${n2(y0 + (y1 - y0) * m.u)})`); p.el.setAttribute('opacity', n2(Math.min(1, (1 - m.u) * 2.2)));
            continue;
        }
        if (p.kind === 'cap') {
            m.u = (m.u + dt * 0.16 * (p.c.nudo && m.u > 0.38 && m.u < 0.5 ? 0.3 : 1)) % 1;
            const [x, y] = enCamino(p.c.pts, m.u); p.el.setAttribute('transform', `translate(${n2(x)} ${n2(y)})`);
            const roto = p.mat && p.c.nudo && m.u > 0.5;
            if (roto !== p.roto) { p.roto = roto; p.a.setAttribute('display', roto ? 'none' : 'inline'); p.b.setAttribute('display', roto ? 'inline' : 'none'); }
            continue;
        }
        if (p.kind === 'tronco' || p.kind === 'vena') {
            m.u = (m.u + dt * (p.kind === 'tronco' ? 0.09 : 0.06)) % 1;
            const [x, y] = enLinea(p.kind === 'tronco' ? polyRed.tronco : polyRed.vena, m.u); p.el.setAttribute('transform', `translate(${n2(x)} ${n2(y)})`);
            continue;
        }
        const G = p.G, s = G.s, ancho = G.x1 - G.x0 + 40;
        m.x += (p.kind === 'rbc' ? 34 : p.kind === 'factor' ? 22 : 30) * s * (0.85 + 0.3 * hashN(p.i, 2)) * dt;
        if (m.x > G.x1 + 20) m.x -= ancho;
        let y = m.lane + Math.sin(m.ph + m.x / (14 * s)) * 1.6 * s;
        if (p.kind === 'bolsa') y = G.lumen[0] + 10 + (p.i % 3) * 8;
        if (p.kind === 'factor') y = clamp(y, G.lumen[0] + 10, G.lumen[1] - 10);
        const t = techo(G, m.x) + (p.kind === 'rbc' ? G.rR : G.rP) + 2 * s;
        if (y < t) y = t + (m.lane - G.lanes[0]) * 0.35;
        p.el.setAttribute('transform', `translate(${n2(m.x)} ${n2(y)})`);
    }
}
function pintarTapon(p) {
    const a = $('g-tapon'); if (a) a.innerHTML = tapon(GEO.A, p, 'a');
    const b = $('g-tapon-h'); if (b) b.innerHTML = tapon(GEO.B, p, 'h');
}
// La lupa se abre con un muelle (un número de 0 a 1 y el atributo transform: Motion no escala un <g>)
function colocarLupa(u) {
    const g = $('lupa-grande') || $('lupa-peq');
    if (!g) return;
    const c = g.id === 'vso-lupa-grande' ? LG : LP, k = n2(0.3 + 0.7 * (1 - Math.pow(1 - u, 3)));
    g.setAttribute('transform', u >= 1 ? '' : `translate(${c.cx} ${c.cy}) scale(${k}) translate(${-c.cx} ${-c.cy})`);
    g.setAttribute('opacity', u >= 1 ? '1' : n2(0.3 + 0.7 * u));
}

/* ============================================================
   El bucle (se para cuando la escena no se ve; con «reducir movimiento», un solo dibujo)
   ============================================================ */
let tPrev = 0, tReloj = 0, visible = false, enMarcha = false, taponCerrado = true;
const fotogramas = [];
function bucle(ahora) {
    if (!visible || document.hidden || REDUCIR) { enMarcha = false; return; }
    const t0 = performance.now(), dt = Math.min(0.05, (ahora - tPrev) / 1000); tPrev = ahora; tReloj += dt;
    mover(dt);
    for (const id of ['gly-at', 'gly-ab', 'gly-ht']) { const g = $(id); if (g) { const b = +g.dataset.base; g.setAttribute('transform', `translate(0 ${b}) skewX(${n2(7 * Math.sin(tReloj * 2.1 + (id === 'gly-ab' ? 1 : 0)))}) translate(0 ${-b})`); } }
    const p = clamp((ahora - tCambio) / 1300, 0, 1);
    if (!taponCerrado) { pintarTapon(p); if (p >= 1) taponCerrado = true; }
    const ul = clamp((ahora - tLupa) / 380, 0, 1); if (ul <= 1) colocarLupa(ul);
    const rueda = $('xa-rueda'); if (rueda) rueda.setAttribute('transform', `rotate(${n2((tReloj * 40) % 360)})`);
    const lh = $('lupa-hematie'), lc = $('lupa-casco');
    if (lh && lc) { const x = -78 + ((tReloj * 34) % 150), roto = x > 4; lh.setAttribute('transform', `translate(${n2(x)} 2)`); lc.setAttribute('transform', `translate(${n2(x)} 2)`); lh.setAttribute('display', roto ? 'none' : 'inline'); lc.setAttribute('display', roto ? 'inline' : 'none'); }
    const gota = document.getElementById('vso-bolsa-plaq-gota') || document.getElementById('vso-bolsa-lena-gota');
    if (gota) { const u = (tReloj * 0.8) % 1; gota.setAttribute('cy', n2(+gota.dataset.y0 + +gota.dataset.largo * u)); }
    fotogramas.push(performance.now() - t0); if (fotogramas.length > 240) fotogramas.shift();
    requestAnimationFrame(bucle);
}
export function arrancar() {
    if (REDUCIR) { pintarUnaVez(); return; }
    if (enMarcha || !visible) return;
    enMarcha = true; tPrev = performance.now(); requestAnimationFrame(bucle);
}
export function pintarUnaVez() {
    mover(0); colocarLupa(1);
    const lh = $('lupa-hematie'), lc = $('lupa-casco');
    if (lh && lc) { lh.setAttribute('display', 'none'); lc.setAttribute('transform', 'translate(20 2)'); }
}
export function ponerVisible(v) { visible = v; if (v) arrancar(); }
export function estadoBucle() {
    const a = fotogramas.slice(-120), m = a.reduce((x, y) => x + y, 0) / (a.length || 1);
    return { enMarcha, visible, fotogramas: { n: a.length, medio: +m.toFixed(2), max: +Math.max(0, ...a).toFixed(2) } };
}
export function vaciarFotogramas() { fotogramas.length = 0; }

/* ============================================================
   El tablero (8 casillas, como un monitor) y lo que se mira
   ============================================================ */
export function pintarTablero() {
    const c = tableroDe(estado);
    for (const k of CELDAS) {
        const el = $('c-' + k), x = c[k], tap = ocultos.has(k);
        el.querySelector('.vso-k').textContent = x.n;
        el.querySelector('b').textContent = tap ? '?' : x.v;
        el.querySelector('.vso-u').textContent = tap ? '' : x.u;
        const o = el.querySelector('.vso-o'); o.textContent = tap ? '' : x.o; o.hidden = tap || !x.o; o.classList.toggle('vso-ilu', !!x.ilu);
        el.className = `vso-celda${tap ? '' : x.cls ? ' vso-' + x.cls : ''}${el.classList.contains('vso-mira') ? ' vso-mira' : ''}`;
    }
}
let celdaMirada = null;
export function mirar(k) {
    if (celdaMirada) celdaMirada.classList.remove('vso-mira');
    celdaMirada = k && $('c-' + k) ? $('c-' + k) : null;
    if (celdaMirada) celdaMirada.classList.add('vso-mira');
}

/* ============================================================
   Aplicar un estado: todo se repinta desde aquí. Devuelve el estado anterior. `lupa`: la lupa pedida (null: la que
   toca; false: ninguna); si no se da, se queda la que había pedido el usuario salvo que cambie el estado.
   ============================================================ */
export function aplicarModelo(nuevo, { lupa } = {}) {
    const viejo = estado;
    const cambia = JSON.stringify(viejo) !== JSON.stringify(nuevo);
    estado = nuevo; D = derivar(estado);
    if (lupa !== undefined) lupaSel = lupa;
    else if (cambia) lupaSel = null;
    if (cambia && (viejo.t !== nuevo.t || viejo.lesion !== nuevo.lesion || viejo.plaq !== nuevo.plaq || viejo.causa !== nuevo.causa)) { tCambio = performance.now(); taponCerrado = REDUCIR; }
    construir(); pintarTablero();
    if (REDUCIR) pintarUnaVez(); else arrancar();
    return viejo;
}
// El dibujo en su punto final, ya (la explicación guiada y las preguntas señalan lo que se ve: sin muelle ni tapón a medias)
export function fijar() { taponCerrado = true; tLupa = -1e9; pintarTapon(1); colocarLupa(1); }
export function ponerLupa(l) { lupaSel = l; construir(); if (REDUCIR) pintarUnaVez(); else arrancar(); }
export function setOcultos(arr) { ocultos.clear(); (arr || []).forEach(k => ocultos.add(k)); construir(); pintarTablero(); if (REDUCIR) pintarUnaVez(); }
export function initEscena() {
    REDUCIR = sinMovimiento();
    $('tablero').innerHTML = CELDAS.map(k => `<div class="vso-celda" id="vso-c-${k}"><span class="vso-k"></span><b>—</b><span class="vso-u"></span><span class="vso-o"></span></div>`).join('');
    D = derivar(estado);
    construir(); pintarTablero();
}
