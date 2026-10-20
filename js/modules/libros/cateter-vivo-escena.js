// Catéter vivo: la escena. Una lámina en grabado (SVG, 360 × 330) con el pie de gotero y su regla, la bolsa, el tubo,
// el catéter en oro con su longitud real (8 px por cm) entrando en un brazo en corte (piel, grasa y la vena) y la
// probeta que se llena al ritmo del flujo. Encima, las tres lupas: B (la piel, las 4 vías del germen y la
// biopelícula, la Fig. 3.2 recreada), C (la punta y el aire) y D (pinchar con eco, esquema 2D). Además la lectura
// (como un monitor, con el origen de cada cifra), el anillo que señala lo que hay que mirar y el bucle de dibujo.
// Un solo estado (`estado`) y lo que se deriva de él (`D`, con derivar() de js/data/cateter-vivo-data.js). La
// interfaz y la capa de estudio viven en cateter-vivo.js.
//
// Partículas (gota, hematíe, Ca²⁺, fosfato, coco y burbuja): js/core/particulas.js (tabla única de formas).
// Rendimiento: el bucle solo corre con la lámina a la vista; con «reducir movimiento» se pinta el estado final.
// Los ids del SVG llevan el prefijo ctv- (todas las vistas comparten el DOM).
import { svgParticula } from '../../core/particulas.js';
import { sinMovimiento } from '../../core/motion.js';
import {
    estadoBase, derivar, catDe, resuelta, clamp, dec, fmt, BOMBAS, OCLUSIONES, BIO, HC, AIRE,
} from '../../data/cateter-vivo-data.js';

export const $ = id => document.getElementById('ctv-' + id);
export const REDUCIR = sinMovimiento();
const IMG = 'js/modules/libros/img/';

/* ============================================================
   Estado (enlaces vivos: solo esta pieza los cambia, con aplicarModelo)
   ============================================================ */
export let estado = estadoBase();
export let D = derivar(estado);

/* ============================================================
   La lámina A (el flujo) y las lupas B, C y D
   ============================================================ */
const SVGNS = 'http://www.w3.org/2000/svg';
let svg = null;
const Y0 = 236, KCM = 1.75;                       // regla de la bolsa: 0 cm en el punto de punción; 1,75 px por cm
const yBolsa = cm => Y0 - cm * KCM;
export const PROB = { x: 304, y: 92, w: 40, h: 112 };     // la probeta
const HUB = { x: 154, y: 211 };
export const VENA_Y = 244;
const LUPA = { cx: 180, cy: 166, r: 150 };
const t = (x, y, txt, { s = 7, c = 'text-muted', a = 'start', i = true, w = '', id = '' } = {}) =>
    `<text${id ? ` id="ctv-${id}"` : ''} x="${x}" y="${y}" font-size="${+(s * 1.22).toFixed(1)}" text-anchor="${a}" style="fill:var(--${c});font-family:Georgia,serif${i ? ';font-style:italic' : ''}${w ? ';font-weight:' + w : ''}">${txt}</text>`;
const numero = (x, y, n) => `<g transform="translate(${x} ${y})"><circle r="8" style="fill:var(--accent-yellow);stroke:var(--bg-main);stroke-width:1.5"/><text y="3.2" font-size="9" text-anchor="middle" style="fill:var(--bg-main);font-family:Georgia,serif;font-weight:700">${n}</text></g>`;

function defs() {
    return `<defs>
        <pattern id="ctv-p-rayado" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--accent-yellow)" stroke-opacity=".3" stroke-width=".8"/></pattern>
        <pattern id="ctv-p-rayado-fino" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="3" style="stroke:var(--accent-yellow)" stroke-opacity=".28" stroke-width=".6"/></pattern>
        <pattern id="ctv-p-ciruela" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-purple)" stroke-opacity=".55" stroke-width=".7"/></pattern>
        <pattern id="ctv-p-punteado" width="7" height="6" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.5" r=".75" style="fill:var(--text-dim)" fill-opacity=".38"/><circle cx="5.1" cy="4.4" r=".6" style="fill:var(--text-dim)" fill-opacity=".3"/></pattern>
        <pattern id="ctv-p-cruzado" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" style="stroke:var(--text-muted)" stroke-opacity=".18" stroke-width=".6"/></pattern>
        <pattern id="ctv-p-hueso" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(60)"><line x1="0" y1="0" x2="0" y2="3.4" style="stroke:var(--text-main)" stroke-opacity=".45" stroke-width=".9"/></pattern>
        <pattern id="ctv-p-moteado" width="11" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" style="fill:var(--text-dim)" fill-opacity=".32"/><circle cx="7" cy="5" r=".7" style="fill:var(--text-dim)" fill-opacity=".22"/><circle cx="4.5" cy="7.5" r=".6" style="fill:var(--text-main)" fill-opacity=".2"/><circle cx="9.5" cy="1" r=".5" style="fill:var(--text-dim)" fill-opacity=".25"/></pattern>
        <pattern id="ctv-p-turbio" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="2" r="1" style="fill:var(--text-main)" fill-opacity=".45"/><circle cx="4.5" cy="4.6" r=".8" style="fill:var(--text-dim)" fill-opacity=".4"/></pattern>
        <clipPath id="ctv-clip-lupa"><circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r - 2}"/></clipPath>
        <clipPath id="ctv-clip-micro"><rect x="74" y="92" width="212" height="162" rx="6"/></clipPath>
        <clipPath id="ctv-clip-pantalla"><path d="M112 100 L248 100 L304 292 L56 292 Z"/></clipPath>
    </defs>`;
}

export function construirLamina() {
    svg = $('lamina');
    const reglaTicks = [];
    for (let cm = 0; cm <= 110; cm += 10) { const y = yBolsa(cm); reglaTicks.push(`<line x1="${cm % 50 ? 54 : 51}" y1="${y}" x2="58" y2="${y}" style="stroke:var(--text-muted)" stroke-width=".8"/>`); } reglaTicks.push(t(49, Y0 + 3, '0 cm', { s: 6, a: 'end', i: false }));
    const probTicks = [];
    for (let i = 1; i < 10; i++) { const y = PROB.y + PROB.h - i * PROB.h / 10; probTicks.push(`<line x1="${PROB.x + 2}" y1="${y}" x2="${PROB.x + (i % 5 ? 8 : 13)}" y2="${y}" style="stroke:var(--text-dim)" stroke-opacity=".7" stroke-width=".7"/>`); }
    const pelos = [118, 131, 186, 203, 222, 247, 262, 288, 318, 341].map((x, i) => `<path d="M${x} 222 q ${i % 2 ? 3 : -3} -5 ${i % 2 ? 7 : 2} -8" style="fill:none;stroke:var(--text-muted)" stroke-width=".7"/>`).join('');
    svg.innerHTML = `${defs()}
    <rect width="360" height="330" style="fill:var(--bg-main)"/>
    <g id="ctv-lamA">
        <!-- brazo en corte -->
        <g id="ctv-g-brazo">
            <rect x="100" y="222" width="260" height="108" style="fill:var(--bg-card)"/>
            <rect x="100" y="222" width="260" height="6" style="fill:var(--text-main)" fill-opacity=".14"/><rect x="100" y="222" width="260" height="6" fill="url(#ctv-p-rayado)"/>
            <line x1="100" y1="222" x2="360" y2="222" style="stroke:var(--text-dim)" stroke-width="1"/>
            ${pelos}
            <rect id="ctv-grasa" x="100" y="228" width="260" height="28" fill="url(#ctv-p-punteado)"/>
            <rect x="100" y="298" width="260" height="32" fill="url(#ctv-p-cruzado)"/>
            <g id="ctv-g-vena"></g>
            <g id="ctv-g-hueso" display="none">
                <rect x="100" y="246" width="260" height="12" style="fill:var(--text-main)" fill-opacity=".12"/><rect x="100" y="246" width="260" height="12" fill="url(#ctv-p-hueso)"/>
                <rect x="100" y="258" width="260" height="44" fill="url(#ctv-p-punteado)"/><rect x="100" y="258" width="260" height="44" style="fill:var(--accent-red)" fill-opacity=".1"/>
                <rect x="100" y="302" width="260" height="12" style="fill:var(--text-main)" fill-opacity=".12"/><rect x="100" y="302" width="260" height="12" fill="url(#ctv-p-hueso)"/>
                ${t(232, 284, 'médula · ≈30 mmHg', { s: 7.5, c: 'text-dim' })}${t(232, 255, 'cortical', { s: 6.5 })}
            </g>
            <g id="ctv-g-hematies"></g>
            ${t(104, 234, 'piel', { s: 6.5 })}${t(104, 274, 'grasa', { s: 6.5 })}
            <text id="ctv-rot-vena" x="104" y="${VENA_Y + 3}" font-size="7" style="fill:var(--accent-purple);font-family:Georgia,serif;font-style:italic">vena</text>
            ${t(356, 326, 'brazo en corte', { s: 6, a: 'end' })}
        </g>
        <!-- pie de gotero y regla -->
        <line x1="10" y1="14" x2="10" y2="318" style="stroke:var(--text-dim)" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M10 318 L2 327 M10 318 L18 327" style="stroke:var(--text-dim)" stroke-width="1.8" stroke-linecap="round"/>
        <g id="ctv-g-regla">
            <line x1="58" y1="${yBolsa(110)}" x2="58" y2="${Y0}" style="stroke:var(--text-muted)" stroke-width=".9"/>
            ${reglaTicks.join('')}
            <g id="ctv-marcas-altura">
                <line x1="50" y1="${yBolsa(68)}" x2="62" y2="${yBolsa(68)}" style="stroke:var(--accent-yellow)" stroke-width="1.6"/>
                ${t(49, yBolsa(68) - 1.5, '68 cm', { s: 6.6, a: 'end', c: 'accent-yellow', i: false, w: 600 })}${t(49, yBolsa(68) + 7.5, '50 mmHg', { s: 6.2, a: 'end', c: 'text-dim', i: false, id: 'mmhg-68' })}
                <line x1="50" y1="${yBolsa(100)}" x2="62" y2="${yBolsa(100)}" style="stroke:var(--accent-yellow)" stroke-width="1.6"/>
                ${t(49, yBolsa(100) - 1.5, '100 cm', { s: 6.6, a: 'end', c: 'accent-yellow', i: false, w: 600 })}${t(49, yBolsa(100) + 7.5, '75 mmHg', { s: 6.2, a: 'end', c: 'text-dim', i: false, id: 'mmhg-100' })}
            </g>
            <g id="ctv-altura-fig" display="none">${t(52, 172, 'la Fig. 1.1', { s: 6.2, a: 'end' })}${t(52, 181, 'no dice', { s: 6.2, a: 'end' })}${t(52, 190, 'la altura', { s: 6.2, a: 'end' })}</g>
            <line x1="50" y1="${Y0}" x2="152" y2="${Y0}" style="stroke:var(--text-muted)" stroke-dasharray="2 3" stroke-width=".6"/>
        </g>
        <!-- tubo, bolsa y bomba -->
        <path id="ctv-ruta" d="" fill="none" stroke="none"/>
        <path id="ctv-g-tubo-fuera" d="" style="fill:none;stroke:var(--text-dim)" stroke-width="4.2" stroke-linecap="round"/>
        <path id="ctv-g-tubo-dentro" d="" style="fill:none;stroke:var(--bg-main)" stroke-width="2" stroke-linecap="round"/>
        <g id="ctv-g-bolsa"></g>
        <!-- el catéter en el brazo (esquema) -->
        <g id="ctv-g-cat-brazo"></g>
        <g id="ctv-g-oclusion"></g>
        <g id="ctv-g-gotas"></g>
        <g id="ctv-g-bomba"></g>
        <!-- el catéter, a escala -->
        <!-- la probeta (caudalímetro) -->
        <g id="ctv-g-probeta">
            <rect id="ctv-prob-agua" x="${PROB.x + 1}" y="${PROB.y + PROB.h}" width="${PROB.w - 2}" height="0" style="fill:var(--text-main)" fill-opacity=".18"/>
            <rect id="ctv-prob-rayado" x="${PROB.x + 1}" y="${PROB.y + PROB.h}" width="${PROB.w - 2}" height="0" fill="url(#ctv-p-rayado)"/>
            <line id="ctv-prob-menisco" x1="${PROB.x + 1}" x2="${PROB.x + PROB.w - 1}" y1="${PROB.y + PROB.h}" y2="${PROB.y + PROB.h}" style="stroke:var(--text-main)" stroke-width="1"/>
            <path d="M${PROB.x} ${PROB.y - 4} L${PROB.x} ${PROB.y + PROB.h} Q${PROB.x} ${PROB.y + PROB.h + 3} ${PROB.x + 3} ${PROB.y + PROB.h + 3} L${PROB.x + PROB.w - 3} ${PROB.y + PROB.h + 3} Q${PROB.x + PROB.w} ${PROB.y + PROB.h + 3} ${PROB.x + PROB.w} ${PROB.y + PROB.h} L${PROB.x + PROB.w} ${PROB.y - 4}" style="fill:none;stroke:var(--text-dim)" stroke-width="1.3"/>
            <path d="M${PROB.x - 4} ${PROB.y - 4} L${PROB.x + 4} ${PROB.y - 4} M${PROB.x + PROB.w - 2} ${PROB.y - 4} L${PROB.x + PROB.w + 5} ${PROB.y - 7}" style="stroke:var(--text-dim)" stroke-width="1.3"/>
            <rect x="${PROB.x - 6}" y="${PROB.y + PROB.h + 3}" width="${PROB.w + 12}" height="4" rx="1.5" style="fill:var(--text-dim)" fill-opacity=".5"/>
            ${probTicks.join('')}
            <circle id="ctv-prob-gota" cx="${PROB.x + PROB.w / 2}" cy="${PROB.y - 10}" r="0"/>
            ${t(PROB.x - 5, PROB.y + PROB.h - 2, 'probeta', { s: 6.5, a: 'end', id: 'rot-probeta' })}
            <g id="ctv-prob-io" display="none"></g>
        </g>
        <text id="ctv-rot-alarma" x="${HUB.x - 2}" y="${HUB.y - 12}" font-size="8" text-anchor="end" style="fill:var(--accent-red);font-family:system-ui,sans-serif;font-weight:700" display="none">⚠ no pasa</text>
    </g>
    <!-- las lupas -->
    <g id="ctv-lupa" display="none">
        <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r + 6}" style="fill:var(--bg-main)" fill-opacity=".72"/>
        <g clip-path="url(#ctv-clip-lupa)">
            <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r}" style="fill:var(--bg-main)"/>
            <g id="ctv-lupaB"></g><g id="ctv-lupaC"></g><g id="ctv-lupaD"></g>
        </g>
        <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r}" style="fill:none;stroke:var(--accent-blue)" stroke-width="1.4"/>
        <circle cx="${LUPA.cx}" cy="${LUPA.cy}" r="${LUPA.r + 3.5}" style="fill:none;stroke:var(--accent-blue)" stroke-width=".8"/>
        <g id="ctv-lupa-tit"></g>
    </g>`;
    // partículas fijas en número: gotas (agua), hematíes (disco)
    const gG = $('g-gotas');
    for (let i = 0; i < 12; i++) { const g = document.createElementNS(SVGNS, 'g'); g.innerHTML = svgParticula('agua', 0, 0, 2.3); g.setAttribute('display', 'none'); gG.appendChild(g); Anim.gotas.push({ el: g, u: i / 12 }); }
    const gH = $('g-hematies');
    for (let i = 0; i < 9; i++) { const g = document.createElementNS(SVGNS, 'g'); g.innerHTML = svgParticula('rbc', 0, 0, 3.1); gH.appendChild(g); Anim.rbc.push({ el: g, x: 150 + i * 24 + (i % 3) * 5, fy: ((i * 37) % 9) / 9 - 0.5 }); }
}

/* Geometría que depende del estado */
const KCAT = 8;                                     // el catéter del brazo: 8 px por cm (longitud real); grosor × 3 px por mm
function geoCatBrazo(e) {
    const c = catDe(e);
    const grosor = Math.max(1.6, c.mm * 3);
    if (e.io) return { d: `M200 212 L200 282`, tip: [200, 282], grosor: Math.max(1.6, c.mm * 3), mid: [200, 262], sigue: false };
    const L = c.cm * KCAT, x0 = HUB.x + 4, y0 = 222;
    const diag = Math.min(L, (VENA_Y - y0) * Math.SQRT2);           // entra a 45° hasta el centro de la vena
    const dx = diag / Math.SQRT2, resto = L - diag;
    const xMax = 356, xf = Math.min(xMax, x0 + dx + resto), sigue = x0 + dx + resto > xMax;
    const d = `M${HUB.x} ${HUB.y} L${x0} ${y0} L${(x0 + dx).toFixed(1)} ${(y0 + dx).toFixed(1)}` + (resto > 0 ? ` L${xf.toFixed(1)} ${VENA_Y}` : '');
    const tip = resto > 0 ? [xf, VENA_Y] : [x0 + dx, y0 + dx];
    const f = 0.6, mid = resto > diag * 0.5 ? [x0 + dx + (xf - x0 - dx) * f, VENA_Y] : [x0 + dx * f, y0 + dx * f];
    return { d, tip, grosor, mid, sigue, cm: c.cm };
}
function dTubo(e) {
    const yb = yBolsa(e.banco === 'fig' && !e.io ? 100 : e.altura) + 2;
    if (e.io) return `M80 ${yb} C80 ${Math.max(yb + 40, 190)} 150 ${HUB.y - 16} 200 207`;
    return `M80 ${yb} C80 ${Math.max(yb + 40, 196)} 104 ${HUB.y - 2} ${HUB.x} ${HUB.y}`;
}

function pintarLaminaA(e) {
    const yb = yBolsa(e.banco === 'fig' && !e.io ? 100 : e.altura);
    const fig = e.banco === 'fig' && !e.io;
    // bolsa
    $('g-bolsa').innerHTML = `<g transform="translate(0 ${yb})" ${fig ? 'opacity=".55"' : ''}>
            <path d="M10 ${16 - yb} L80 ${16 - yb} L80 -52" style="fill:none;stroke:var(--text-dim)" stroke-width="1.4"/>
            <rect x="65" y="-50" width="30" height="33" rx="5" style="fill:var(--text-main)" fill-opacity=".08"/>
            <rect x="66" y="-40" width="28" height="22" rx="4" style="fill:var(--text-main)" fill-opacity=".12"/><rect x="66" y="-40" width="28" height="22" rx="4" fill="url(#ctv-p-rayado)"/>
            <rect x="65" y="-50" width="30" height="33" rx="5" style="fill:none;stroke:var(--text-dim)" stroke-width="1.2"/>
            <rect x="76" y="-15" width="8" height="15" rx="2" style="fill:none;stroke:var(--text-dim)" stroke-width="1"/>
            <line x1="80" y1="-17" x2="80" y2="-15" style="stroke:var(--text-dim)" stroke-width="2"/>
            <circle id="ctv-gota-camara" cx="80" cy="-12" r="1.4" style="fill:var(--text-main)"/>
            ${t(80, -28, 'suero', { s: 6, a: 'middle', c: 'text-dim' })}
        </g>`;
    $('marcas-altura').setAttribute('opacity', fig ? '.35' : '1');
    $('altura-fig').setAttribute('display', fig ? 'inline' : 'none');
    // tubo y ruta de las gotas
    const g = geoCatBrazo(e);
    const dt = dTubo(e);
    $('g-tubo-fuera').setAttribute('d', dt); $('g-tubo-dentro').setAttribute('d', dt);
    $('ruta').setAttribute('d', dt + ' ' + g.d.replace(/^M[\d.]+ [\d.]+/, ''));
    // vena o hueso
    const io = e.io;
    $('g-hueso').setAttribute('display', io ? 'inline' : 'none');
    $('grasa').setAttribute('height', io ? 18 : 70);
    const r = e.vena === 'grande' ? 16 : 7;
    $('g-vena').innerHTML = io ? '' : `
        <path d="M360 ${VENA_Y - r} L150 ${VENA_Y - r} A${r * 0.6} ${r} 0 0 0 150 ${VENA_Y + r} L360 ${VENA_Y + r} Z" style="fill:var(--accent-purple)" fill-opacity=".26"/>
        <path d="M360 ${VENA_Y - r} L150 ${VENA_Y - r} A${r * 0.6} ${r} 0 0 0 150 ${VENA_Y + r} L360 ${VENA_Y + r} Z" fill="url(#ctv-p-ciruela)"/>
        <path d="M360 ${VENA_Y - r} L150 ${VENA_Y - r} A${r * 0.6} ${r} 0 0 0 150 ${VENA_Y + r} L360 ${VENA_Y + r}" style="fill:none;stroke:var(--accent-purple)" stroke-width="1.6"/>`;
    $('rot-vena').setAttribute('display', io ? 'none' : 'inline');
    $('rot-vena').textContent = e.vena === 'grande' ? 'vena grande' : 'vena pequeña';
    $('g-hematies').setAttribute('display', io ? 'none' : 'inline');
    Anim.venaR = r;
    // el catéter en el brazo
    const c = catDe(e);
    let salidas = '';
    if (c.luz) {
        const [tx, ty] = g.tip;
        const pos = { distal: tx, medial: tx - 13, proximal: tx - 26 };
        salidas = Object.entries(pos).map(([k, x]) => `<circle cx="${x - (k === 'distal' ? 0 : 0)}" cy="${ty - (k === 'distal' ? 0 : g.grosor / 2)}" r="${k === c.luz ? 2.4 : 1.6}" style="fill:${k === c.luz ? 'var(--text-main)' : 'var(--bg-main)'};stroke:var(--bg-main)" stroke-width=".6"/>`).join('')
            + t(g.tip[0] - 13, ty + g.grosor + 9, `luz ${c.luz}`, { s: 6.4, a: 'middle', c: 'text-dim' });
    }
    $('g-cat-brazo').innerHTML = `
        <path d="${g.d}" style="fill:none;stroke:var(--bg-main)" stroke-width="${g.grosor + 2}" stroke-linecap="round"/>
        <path d="${g.d}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="${g.grosor}" stroke-linecap="round"/>
        <path d="${g.d}" style="fill:none;stroke:var(--bg-main)" stroke-opacity=".55" stroke-width="${Math.max(0.6, g.grosor * 0.32)}" stroke-linecap="round"/>
        ${io ? `<rect x="193" y="204" width="14" height="10" rx="2" style="fill:var(--accent-yellow);stroke:var(--bg-main)"/>${t(212, 214, '15 G · 25 mm', { s: 6.5, c: 'text-dim' })}`
            : `<rect x="${HUB.x - 8}" y="${HUB.y - 4}" width="12" height="8" rx="2" transform="rotate(48 ${HUB.x - 2} ${HUB.y})" style="fill:var(--accent-yellow);stroke:var(--bg-main)"/>`}
        ${salidas}
        ${io ? t(212, 236, 'aguja intraósea en la tibia', { s: 6, c: 'text-muted' }) : t(HUB.x + 10, HUB.y - 4, `${dec(c.cm, c.cm % 1 ? 1 : 0)} cm · ${dec(c.mm, (c.mm * 10) % 1 ? 2 : 1)} mm`, { s: 6.6, c: 'text-dim', i: false })}
        ${g.sigue ? `<path d="M${g.tip[0] - 4} ${VENA_Y - 8} l4 16 M${g.tip[0] - 9} ${VENA_Y - 8} l4 16" style="stroke:var(--text-main)" stroke-width="1"/>${t(354, VENA_Y + 26, `sigue: ${c.cm} cm →`, { s: 6.8, a: 'end', c: 'accent-yellow', i: false, w: 600 })}` : ''}
        ${io ? '' : `<line x1="296" y1="320" x2="336" y2="320" style="stroke:var(--text-dim)" stroke-width="1.4"/><line x1="296" y1="317" x2="296" y2="323" style="stroke:var(--text-dim)"/><line x1="336" y1="317" x2="336" y2="323" style="stroke:var(--text-dim)"/>${t(294, 323, '5 cm', { s: 6, a: 'end', c: 'text-dim', i: false })}${t(356, 310, 'longitud a escala · grosor ×4', { s: 5.8, a: 'end' })}`}`;
    // bomba
    const D0 = D;
    if (e.bomba === 'gravedad') $('g-bomba').innerHTML = '';
    else {
        const B = BOMBAS[e.bomba];
        const pant = D0.alarma ? 'ALARMA' : e.bomba === 'infusor' ? (c.rapido ? '1,5 L/min' : '¿catéter?') : '≤' + fmt(B.max) + ' mL/h';
        $('g-bomba').innerHTML = `<g transform="translate(${e.io ? 120 : 96} 186)">
            <rect width="52" height="26" rx="4" style="fill:var(--bg-card);stroke:var(--text-dim)" stroke-width="1.1"/>
            <rect x="4" y="4" width="44" height="11" rx="2" style="fill:var(--bg-main);stroke:${D0.alarma ? 'var(--accent-red)' : 'var(--text-muted)'}" stroke-width=".8"/>
            <text x="26" y="12.6" font-size="7" text-anchor="middle" style="fill:${D0.alarma ? 'var(--accent-red)' : 'var(--accent-yellow)'};font-family:system-ui,sans-serif;font-weight:700">${pant}</text>
            <text x="26" y="22.4" font-size="5.6" text-anchor="middle" style="fill:var(--text-dim);font-family:Georgia,serif;font-style:italic">${e.bomba === 'infusor' ? 'infusor rápido' : e.bomba === 'jeringa' ? 'jeringa' : 'volumétrica'}</text></g>`;
    }
    // oclusión
    const oc = e.oclusion && !resuelta(e) ? e.oclusion : null;
    let ho = '';
    if (oc && !io) {
        const [x0, y0] = g.mid;
        if (oc === 'trombo') ho = [[-6, -1], [-2, 1], [2, -1], [6, 1], [0, 0]].map(([dx, dy]) => svgParticula('rbc', x0 + dx, y0 + dy, 1.7)).join('') + `<path d="M${x0 - 8} ${y0 - 2} L${x0 + 8} ${y0 + 2} M${x0 - 8} ${y0 + 2} L${x0 + 8} ${y0 - 2}" style="stroke:var(--text-main)" stroke-opacity=".6" stroke-width=".5"/>`;
        else if (oc === 'mineral') ho = [[-6, 0, 'ca'], [-2, -1, 'p'], [2, 1, 'ca'], [6, 0, 'p'], [0, 1, 'ca']].map(([dx, dy, k]) => svgParticula(k, x0 + dx, y0 + dy, 1.6)).join('');
        else if (oc === 'lipidos') ho = [[-5, 0, 3], [1, -1, 2.5], [6, 1, 2.2]].map(([dx, dy, rr]) => `<ellipse cx="${x0 + dx}" cy="${y0 + dy}" rx="${rr}" ry="${rr * 0.7}" style="fill:var(--text-main);stroke:var(--bg-main)" fill-opacity=".7" stroke-width=".4"/>`).join('');
        else ho = `<path d="M${x0 - 8} ${y0 - 2} l4 -1 l3 3 l4 -2 l5 2 l-1 3 l-6 1 l-4 -2 l-5 1 Z" style="fill:var(--text-dim);stroke:var(--bg-main)" fill-opacity=".85" stroke-width=".5"/><path d="M${x0 - 8} ${y0 - 2} l4 -1 l3 3 l4 -2 l5 2 l-1 3 l-6 1 l-4 -2 l-5 1 Z" fill="url(#ctv-p-rayado)"/>`;
        ho += t(x0, y0 - 9, OCLUSIONES[oc].nombre.toLowerCase(), { s: 6.6, a: 'middle', c: 'accent-red', i: false, w: 600 });
    }
    $('g-oclusion').innerHTML = ho;
    $('rot-alarma').setAttribute('display', D0.ocluido && !D0.alarma ? 'inline' : 'none');   // con bomba, el «ALARMA» lo dice la propia bomba
    $('rot-alarma').textContent = '⚠ no gotea';
    // intraósea: la probeta enseña una barra relativa, sin L/h
    $('prob-io').setAttribute('display', io ? 'inline' : 'none');
    // intraósea: la probeta pasa a ser una barra relativa (25 % de una periférica), sin L/h
    if (io) $('prob-io').innerHTML = `<line x1="${PROB.x + 1}" x2="${PROB.x + PROB.w - 1}" y1="${PROB.y + 1}" y2="${PROB.y + 1}" style="stroke:var(--text-dim)" stroke-dasharray="3 2" stroke-width="1"/>
        ${t(PROB.x + PROB.w / 2, PROB.y + 11, '100 %', { s: 6, a: 'middle', i: false, c: 'text-dim' })}${t(PROB.x + PROB.w / 2, PROB.y + PROB.h * 0.75 - 4, '25 %', { s: 6.6, a: 'middle', i: false, c: 'accent-yellow', w: 700 })}`;
    $('rot-probeta').textContent = io ? '% de una periférica' : 'probeta';
    Anim.rutaLen = $('ruta').getTotalLength();
    Anim.tuboLen = (() => { const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', dt); svg.appendChild(p); const l = p.getTotalLength(); p.remove(); return l; })();
    Anim.uOcl = oc && !io ? (Anim.tuboLen + 0.6 * (Anim.rutaLen - Anim.tuboLen)) / Anim.rutaLen - 0.01 : 2;
    Anim.camaraY = yb;
}

/* ---------- Lupa B: la piel y la biopelícula (Fig. 3.2 recreada, la punta y la foto real) ---------- */
const RUTA3 = [[192, 162], [146, 234]];   // trayecto subcutáneo (vía 3), del punto de entrada a la vena
export function pintarLupaB(e) {
    const vista = e.zoomB;
    const d = derivar(e).bio;
    let h = '';
    if (vista === 'vias') {
        // Fig. 3.2 recreada en el mismo encuadre: tubo (1), conector (2), piel con el trayecto (3) y sangre (4)
        const sinCat = e.manejo === 'retirar', guia = e.manejo === 'guia';
        const pelos = [70, 92, 140, 304, 322].map((x, i) => `<path d="M${x} 156 q ${i % 2 ? 4 : -2} -6 ${i % 2 ? 9 : 4} -10" style="fill:none;stroke:var(--text-muted)" stroke-width=".8"/>`).join('');
        const catD = 'M236 132 C218 142 202 152 192 162 L146 234 Q136 248 112 250 L86 250';
        h += `<rect x="20" y="156" width="320" height="10" style="fill:var(--text-main)" fill-opacity=".16"/><rect x="20" y="156" width="320" height="10" fill="url(#ctv-p-rayado)"/>
            <line x1="20" y1="156" x2="340" y2="156" style="stroke:var(--text-dim)" stroke-width="1"/>${pelos}
            <rect x="20" y="166" width="320" height="56" fill="url(#ctv-p-punteado)"/>
            <rect x="20" y="228" width="320" height="40" style="fill:var(--accent-purple)" fill-opacity=".26"/><rect x="20" y="228" width="320" height="40" fill="url(#ctv-p-ciruela)"/>
            <line x1="20" y1="228" x2="340" y2="228" style="stroke:var(--accent-purple)" stroke-width="2"/><line x1="20" y1="268" x2="340" y2="268" style="stroke:var(--accent-purple)" stroke-width="2"/>
            <rect x="20" y="268" width="320" height="60" fill="url(#ctv-p-cruzado)"/>
            ${t(40, 165, 'piel', { s: 7 })}${t(40, 198, 'grasa', { s: 7 })}${t(312, 244, 'vena', { s: 7.5, c: 'accent-purple', a: 'end' })}`;
        // apósito
        if (e.aposito === 'gasa') h += `<rect x="166" y="147" width="60" height="9" rx="2" style="fill:var(--text-main)" fill-opacity=".22"/><rect x="166" y="147" width="60" height="9" rx="2" fill="url(#ctv-p-cruzado)"/>${t(232, 154, 'gasa', { s: 6.5 })}`;
        else {
            h += `<path d="M164 155 L228 155" style="stroke:var(--text-main)" stroke-opacity=".6" stroke-width="1.8"/>${t(232, 154, e.aposito === 'esponja' ? 'film + esponja' : 'film transparente', { s: 6.4 })}`;
            if (e.aposito === 'esponja') h += `<ellipse cx="194" cy="157" rx="11" ry="3.4" style="fill:var(--accent-green)" fill-opacity=".6"/>`;
            if (e.aposito === 'humedo') h += [172, 182, 206, 216].map(x => svgParticula('agua', x, 160, 1.9)).join('') + t(196, 182, 'humedad debajo', { s: 6.6, a: 'middle', c: 'accent-red', i: false, w: 600 });
        }
        // puertas del paquete de inserción (cualitativo)
        const puertas = ['manos', 'barreras', 'clorhex'];
        h += puertas.map((k, i) => { const x = 96 + i * 11, cerrada = e.paquete[k]; return `<rect x="${x}" y="${cerrada ? 148 : 151}" width="7" height="${cerrada ? 8 : 5}" style="fill:${cerrada ? 'var(--accent-yellow)' : 'none'};stroke:var(--accent-yellow)" stroke-width=".8"/>`; }).join('') + t(108, 142, `puertas: ${d.puertasCerradas} de 3`, { s: 6.2, a: 'middle', c: 'text-dim' });
        // tubo, conector y catéter
        h += `<path d="M356 70 C330 92 296 114 260 124" style="fill:none;stroke:var(--text-dim)" stroke-width="8" stroke-linecap="round"/><path d="M356 70 C330 92 296 114 260 124" style="fill:none;stroke:var(--bg-main)" stroke-width="5" stroke-linecap="round"/>
            <g transform="rotate(-22 249 128)"><rect x="236" y="121" width="26" height="14" rx="3" style="fill:var(--text-main);stroke:var(--bg-main)" fill-opacity=".85"/><rect x="244" y="119" width="4" height="18" rx="1" style="fill:var(--bg-main)"/></g>`;
        if (!sinCat) h += `<path d="${catD}" style="fill:none;stroke:var(--bg-main)" stroke-width="7" stroke-linecap="round"/><path d="${catD}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="5" stroke-linecap="round"/>`
            + (guia ? t(60, 214, 'nuevo, por el mismo sitio: el libro lo desaconseja', { s: 6.2, c: 'accent-red', i: false }) : '');
        else h += `<path d="M192 162 L146 234" style="fill:none;stroke:var(--text-muted)" stroke-dasharray="3 3" stroke-width="1.2"/>${t(60, 214, 'retirado: otro, en un sitio nuevo', { s: 6.4, c: 'text-dim' })}`;
        // biopelícula en la punta
        const niv = sinCat || guia ? 0 : d.nivel;
        if (niv) { const rx = 8 + niv * 5, ry = 5 + niv * 2.2; h += `<ellipse cx="${90 + niv}" cy="250" rx="${rx}" ry="${ry}" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" fill-opacity=".14" stroke-dasharray="2 2" stroke-width=".8"/><ellipse cx="${90 + niv}" cy="250" rx="${rx}" ry="${ry}" fill="url(#ctv-p-rayado)"/>`; }
        // cocos: vía 3 (piel, por el trayecto), vía 2 (conector), vía 4 (sangre); cantidades ilustrativas
        const cocos = [];
        const n3 = sinCat ? 0 : d.piel;
        for (let i = 0; i < n3; i++) { const f = n3 === 1 ? 0.2 : i / (n3 - 1) * Math.min(1, 0.25 + e.tiempo / 100); cocos.push([RUTA3[0][0] + (RUTA3[1][0] - RUTA3[0][0]) * f + 5, RUTA3[0][1] + (RUTA3[1][1] - RUTA3[0][1]) * f + 2, false]); }
        if (!sinCat && niv) for (let i = 0; i < niv * 2; i++) cocos.push([82 + (i * 7) % 22, 244 + (i * 5) % 12, false]);
        if (!sinCat && e.tiempo >= 168) cocos.push([250, 127, false]);
        if (e.tiempo >= 48 && !sinCat) { cocos.push([168, 258, true]); cocos.push([222, 242, true]); }
        h += `<g id="ctv-b-cocos">${cocos.map(([x, y, libre]) => svgParticula('coco', x, y, 2.4, { hueco: libre && e.antibiotico })).join('')}</g>`;
        // los números de la Fig. 3.2
        h += numero(300, 126, 1) + numero(224, 112, 2) + numero(160, 136, 3) + numero(200, 258, 4)
            + `<path d="M190 257 L120 252" style="stroke:var(--text-main)" stroke-opacity=".7" stroke-width="2"/><path d="M125 248 L117 252 L125 256" style="fill:none;stroke:var(--text-main)" stroke-opacity=".7" stroke-width="1.6"/>`
            + t(200, 284, '¿del intestino? opinión del autor', { s: 6.4, a: 'middle', c: 'text-muted' });
        if (e.antibiotico && e.tiempo >= 48) h += t(180, 292, 'las libres mueren (contorno)', { s: 6.6, a: 'middle', c: 'accent-yellow', i: false });
    } else if (vista === 'punta') {
        const sinCat = e.manejo === 'retirar';
        h += `<rect x="20" y="10" width="320" height="320" style="fill:var(--accent-purple)" fill-opacity=".16"/><rect x="20" y="10" width="320" height="320" fill="url(#ctv-p-ciruela)" opacity=".5"/>`;
        const niv = sinCat || e.manejo === 'guia' ? 0 : d.nivel;
        if (!sinCat) h += `<path d="M16 110 L214 206" style="stroke:var(--bg-main)" stroke-width="40" stroke-linecap="butt"/><path d="M16 110 L214 206" style="stroke:var(--accent-yellow)" stroke-width="36" stroke-linecap="butt"/><path d="M16 110 L214 206" style="stroke:url(#ctv-p-rayado-fino)" stroke-width="36"/>
            <ellipse cx="214" cy="206" rx="10" ry="18" transform="rotate(26 214 206)" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width="2"/>${t(46, 94, e.manejo === 'guia' ? 'nuevo sobre guía (el libro lo desaconseja)' : 'la punta del catéter', { s: 7.2, c: 'accent-yellow', i: false, w: 600 })}`;
        else h += t(180, 170, 'sin catéter: sin superficie donde pegarse', { s: 8, a: 'middle', c: 'text-dim' });
        if (niv) {
            const blob = `M${110 - niv * 6} ${160 - niv * 4} C${130} ${132 - niv * 8} ${200 + niv * 6} ${160 - niv * 4} ${232 + niv * 6} ${188 - niv * 2} C${250 + niv * 4} ${220 + niv * 6} ${200} ${246 + niv * 6} ${150 - niv * 4} ${216 + niv * 4} C${110 - niv * 6} ${200} ${92 - niv * 6} ${180} ${110 - niv * 6} ${160 - niv * 4}Z`;
            h += `<path d="${blob}" style="fill:var(--accent-yellow);stroke:var(--accent-yellow)" fill-opacity=".16" stroke-width="1" stroke-dasharray="3 2"/><path d="${blob}" fill="url(#ctv-p-rayado)"/>`;
            const pegados = [];
            for (let i = 0; i < 4 + niv * 5; i++) { const f = (i * 0.618) % 1, lado = i % 2 ? -1 : 1; pegados.push([120 + f * 100 + (i % 3) * 3, 160 + f * 50 + lado * (20 + (i % 4) * 2.5)]); }
            h += pegados.map(([x, y]) => svgParticula('coco', x, y, 4)).join('');
            h += t(60, 268, 'biopelícula: la matriz', { s: 7, c: 'accent-yellow', i: false }) + t(60, 278, '(slime) que los protege', { s: 7, c: 'accent-yellow', i: false });
        }
        const libres = [[70, 236], [262, 112], [282, 254], [56, 172], [304, 176], [236, 290]];
        if (e.tiempo >= 24) h += `<g id="ctv-b-libres">${libres.map(([x, y]) => svgParticula('coco', x, y, 4, { hueco: e.antibiotico })).join('')}</g>`;
        h += [[96, 296], [292, 214], [150, 304], [120, 70]].map(([x, y]) => svgParticula('rbc', x, y, 5.5)).join('');
        if (e.antibiotico) h += `<rect x="150" y="256" width="150" height="30" rx="8" style="fill:var(--bg-main);stroke:var(--accent-yellow)" fill-opacity=".88" stroke-width=".8"/>${t(225, 268, 'mueren las libres (contorno)', { s: 6.8, a: 'middle', c: 'text-main', i: false })}${t(225, 280, `en la matriz: ×${BIO.factorAntibiotico}`, { s: 6.8, a: 'middle', c: 'accent-red', i: false, w: 600 })}`;
        if (!e.tiempo) h += t(180, 276, '0 h: aún nada pegado (ilustrativo)', { s: 7, a: 'middle', c: 'text-muted' });
    } else if (vista === 'micro') {
        h += `<rect x="20" y="10" width="320" height="320" style="fill:var(--bg-main)"/>
            <image href="${IMG}mar-fig3-3-biofilm.jpg" x="74" y="92" width="212" height="162" preserveAspectRatio="xMidYMid meet" clip-path="url(#ctv-clip-micro)"/>
            <rect x="74" y="92" width="212" height="162" rx="6" style="fill:none;stroke:var(--accent-blue)" stroke-width="1"/>
            ${t(120, 84, 'así es de verdad', { s: 9, a: 'middle', c: 'accent-yellow', i: false, w: 600 })}
            ${t(180, 270, 'Fig. 3.3 · S. epidermidis en su biopelícula', { s: 7.2, a: 'middle', c: 'text-dim' })}
            ${t(180, 282, 'microscopía electrónica, coloreada', { s: 6.8, a: 'middle', c: 'text-muted' })}
            ${t(180, 293, 'barra: 1 µm', { s: 6.8, a: 'middle', c: 'text-muted' })}`;
    } else if (vista === 'frascos') {
        const hora = Anim.hcHora;
        const frasco = (x, nombre, hPos) => { const pos = hora >= hPos, op = pos ? clamp((hora - hPos) / 1.5, 0.25, 1) : 0;
            return `<g transform="translate(${x} 14)">
                <path d="M-10 78 L-10 100 L-30 136 L-30 228 Q-30 236 -22 236 L22 236 Q30 236 30 228 L30 136 L10 100 L10 78 Z" style="fill:var(--text-main);stroke:var(--text-dim)" fill-opacity=".06" stroke-width="1.4"/>
                <path d="M-29 150 L29 150 L29 228 Q29 235 22 235 L-22 235 Q-29 235 -29 228 Z" style="fill:var(--accent-red)" fill-opacity=".22"/>
                <path d="M-29 150 L29 150 L29 228 Q29 235 22 235 L-22 235 Q-29 235 -29 228 Z" fill="url(#ctv-p-turbio)" opacity="${op}"/>
                ${pos ? [[-12, 196], [6, 210], [14, 178], [-6, 222], [-16, 168]].slice(0, 2 + Math.round(op * 3)).map(([cx, cy]) => svgParticula('coco', cx, cy, 2.6)).join('') : ''}
                <rect x="-13" y="70" width="26" height="9" rx="2" style="fill:var(--text-dim)"/>
                ${t(0, 250, nombre, { s: 8, a: 'middle', c: 'text-main', i: false, w: 600 })}
                ${t(0, 261, pos ? `positivo a las ${dec(hPos, hPos % 1 ? 1 : 0)} h` : 'aún claro', { s: 7, a: 'middle', c: pos ? 'accent-red' : 'text-muted', i: false })}
            </g>`; };
        h += frasco(125, 'del catéter', HC.horaCateter) + frasco(235, 'periférico', HC.horaCateter + HC.difCaso);
        if (hora >= HC.horaCateter + HC.difCaso) h += t(180, 292, '2,5 h antes: el catéter es la fuente', { s: 7.2, a: 'middle', c: 'accent-yellow', i: false, w: 600 });
    }
    $('lupaB').innerHTML = h;
}

/* ---------- Lupa C: la punta y el aire ---------- */
export const PUNTA_XY = { yugular: [131, 46], 'vcs-alta': [150, 128], carina: [150, 158], auricula: [146, 206] };
function rutaCateterC(e) {
    if (e.izquierdo) return 'M312 120 C270 112 236 110 214 116 C190 122 170 128 156 134';
    const [x, y] = PUNTA_XY[e.punta];
    if (e.punta === 'yugular') return `M52 120 C84 114 116 110 136 108 C134 90 132 66 ${x} ${y}`;
    return `M52 120 C84 114 116 110 136 108 C146 112 150 118 150 124 L${x} ${y}`;
}
function pintarLupaC(e) {
    const d = derivar(e);
    let h = `<g id="ctv-c-torax">
        <path d="M40 300 C40 170 70 100 120 92 M320 300 C320 170 290 100 240 92" style="fill:none;stroke:var(--text-muted)" stroke-width="1" stroke-dasharray="1 0"/>
        ${[0, 1, 2, 3, 4].map(i => `<path d="M${64 - i * 4} ${134 + i * 34} Q120 ${120 + i * 34} 166 ${142 + i * 34} M${296 + i * 4} ${134 + i * 34} Q240 ${120 + i * 34} 194 ${142 + i * 34}" style="fill:none;stroke:var(--text-muted)" stroke-opacity=".35" stroke-width="2.2"/>`).join('')}
        <path d="M48 98 Q110 88 168 102 M312 98 Q250 88 192 102" style="fill:none;stroke:var(--text-dim)" stroke-width="4" stroke-linecap="round"/>
        <path d="M172 18 L172 146 Q166 156 150 182 M188 18 L188 146 Q194 156 210 182" style="fill:none;stroke:var(--text-dim)" stroke-width="1.6"/>
        <path d="M172 146 Q180 150 188 146" style="fill:none;stroke:var(--text-dim)" stroke-width="1.6"/>
        ${t(196, 152, 'carina', { s: 7.4, c: 'text-dim' })}
        <line x1="140" y1="158" x2="196" y2="158" style="stroke:var(--accent-yellow)" stroke-dasharray="2 2" stroke-width=".7"/>
        <!-- venas: yugular y subclavia derechas, innominadas, cava superior y aurícula -->
        <path d="M126 14 L136 106" style="stroke:var(--accent-purple)" stroke-opacity=".5" stroke-width="9" stroke-linecap="round"/>
        <path d="M40 122 C84 114 116 108 136 106 L150 122" style="fill:none;stroke:var(--accent-purple)" stroke-opacity=".5" stroke-width="9" stroke-linecap="round"/>
        <path d="M320 122 C270 112 236 108 214 114 L152 126" style="fill:none;stroke:var(--accent-purple)" stroke-opacity=".42" stroke-width="8" stroke-linecap="round"/>
        <path d="M150 120 L150 182" style="stroke:var(--accent-purple)" stroke-opacity=".55" stroke-width="16"/>
        <ellipse cx="146" cy="212" rx="24" ry="30" style="fill:var(--accent-purple)" fill-opacity=".38"/>
        <path d="M168 196 C210 180 252 196 262 240 C270 280 220 300 184 280 C170 270 166 240 168 196Z" style="fill:var(--accent-red)" fill-opacity=".16"/>
        <path d="M168 196 C210 180 252 196 262 240 C270 280 220 300 184 280 C170 270 166 240 168 196Z" fill="url(#ctv-p-rayado)"/>
        ${t(122, 216, 'AD', { s: 8, c: 'text-main', i: false, w: 600 })}${t(222, 246, 'VD', { s: 8, c: 'text-main', i: false, w: 600 })}${t(116, 150, 'cava sup.', { s: 6.6, c: 'text-dim', a: 'end' })}
        ${t(120, 30, 'yugular', { s: 6.6, c: 'text-dim', a: 'end' })}${t(60, 112, 'subclavia', { s: 6.6, c: 'text-dim' })}
    </g>`;
    // el catéter y su punta (se arrastra)
    const ruta = rutaCateterC(e);
    h += `<path id="ctv-c-ruta" d="${ruta}" style="fill:none;stroke:var(--bg-main)" stroke-width="5.4" stroke-linecap="round"/><path d="${ruta}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="3.4" stroke-linecap="round"/>`;
    const pIzq = [156, 134], tip = e.izquierdo ? pIzq : PUNTA_XY[e.punta];
    const hub = e.izquierdo ? [312, 120] : [52, 120];
    h += `<rect x="${hub[0] - 6}" y="${hub[1] - 5}" width="12" height="10" rx="2" style="fill:var(--text-main);stroke:var(--bg-main)"/>${e.aire.abierto ? t(hub[0] + (e.izquierdo ? -2 : 2), hub[1] + 18, 'conector abierto', { s: 6.6, c: 'accent-red', a: e.izquierdo ? 'end' : 'start', i: false, w: 700 }) : ''}`;
    const ok = d.punta.ok;
    h += `<circle id="ctv-c-asa" cx="${tip[0]}" cy="${tip[1]}" r="9" style="fill:none;stroke:${ok === false ? 'var(--accent-red)' : 'var(--accent-blue)'}" stroke-width="1.4" stroke-dasharray="3 2"/>
        <circle cx="${tip[0]}" cy="${tip[1]}" r="2.6" style="fill:${ok === false ? 'var(--accent-red)' : 'var(--text-main)'}"/>`;
    if (e.izquierdo) h += `<path d="M144 128 L144 140" style="stroke:var(--accent-red)" stroke-width="2.4"/>${t(160, 112, 'apoya en la pared', { s: 7, c: 'accent-red', i: false, w: 700 })}`;
    if (!e.izquierdo && !e.aire.abierto) h += t(tip[0] + 14, tip[1] + 3, 'arrastra la punta', { s: 6.4, c: 'text-muted' });
    if (e.aire.abierto && e.aire.postura !== 'espontanea') h += `<rect x="62" y="260" width="236" height="26" rx="7" style="fill:var(--bg-main);stroke:var(--accent-yellow)" stroke-width=".8"/>${t(180, 271, e.aire.postura === 'trendelenburg' ? 'Trendelenburg: sube la presión venosa' : 'Femoral: el catéter no entra en el tórax', { s: 7.2, a: 'middle', c: 'text-main', i: false })}${t(180, 281, e.aire.postura === 'trendelenburg' ? 'menos riesgo; cuánto, el libro no lo dice' : 'sin presión negativa, no entra aire', { s: 7.2, a: 'middle', c: 'accent-yellow', i: false, w: 600 })}`;
    h += `<g id="ctv-c-burbujas"></g>`;
    $('lupaC').innerHTML = h;
    Anim.burbujas = [];
    const gB = $('c-burbujas');
    for (let i = 0; i < 14; i++) { const g = document.createElementNS(SVGNS, 'g'); g.innerHTML = svgParticula('burbuja', 0, 0, 3); g.setAttribute('display', 'none'); gB.appendChild(g); Anim.burbujas.push({ el: g, u: i / 14 }); }
    Anim.rutaC = $('c-ruta');
}

/* ---------- Lupa D: pinchar con eco, esquema 2D ---------- */
function pintarLupaD(e) {
    const E = e.eco, d = derivar(e).eco;
    const col = k => k === 'rojo' ? 'var(--accent-red)' : 'var(--accent-blue)';
    const yS = E.comprimir ? 94 : 86;   // la sonda baja al comprimir
    let h = `<rect x="20" y="10" width="320" height="320" style="fill:var(--bg-main)"/>
        <g clip-path="url(#ctv-clip-pantalla)"><rect x="40" y="100" width="280" height="200" style="fill:var(--bg-card)"/><rect x="40" y="100" width="280" height="200" fill="url(#ctv-p-moteado)"/>
            <path d="M40 ${yS + 22} Q180 ${E.comprimir ? yS + 28 : yS + 22} 320 ${yS + 22}" style="fill:none;stroke:var(--text-main)" stroke-opacity=".45" stroke-width="2"/>`;
    if (E.eje === 'corto') {
        const ry = d.venaColapsa ? 3 : 22;
        h += `<ellipse id="ctv-d-vena" cx="146" cy="196" rx="${d.venaColapsa ? 36 : 32}" ry="${ry}" style="fill:${d.colorVena ? col(d.colorVena) : 'var(--bg-main)'};stroke:var(--text-dim)" fill-opacity="${d.colorVena ? 0.75 : 1}" stroke-width="1.2"/>`;
        if (E.trombosada) h += `<ellipse cx="146" cy="196" rx="30" ry="20" fill="url(#ctv-p-moteado)"/><ellipse cx="146" cy="196" rx="30" ry="20" fill="url(#ctv-p-moteado)"/>`;
        h += `<circle id="ctv-d-arteria" cx="214" cy="206" r="15" style="fill:${d.colorArteria ? col(d.colorArteria) : 'var(--bg-main)'};stroke:var(--text-main)" fill-opacity="${d.colorArteria ? 0.75 : 1}" stroke-width="3"/>`;
        if (d.colorVena) h += t(146, 200, d.colorVena === 'rojo' ? '↑' : '↓', { s: 11, a: 'middle', c: 'text-main', i: false, w: 700 }) + t(214, 210, d.colorArteria === 'rojo' ? '↑' : '↓', { s: 11, a: 'middle', c: 'text-main', i: false, w: 700 });
        if (d.aguja === 'punto') h += `<circle cx="140" cy="${d.venaColapsa ? 196 : 190}" r="3" style="fill:var(--text-main)"/>`;
        h += `</g>${t(146, d.venaColapsa ? 214 : 232, E.trombosada ? 'vena trombosada' : 'vena', { s: 8, a: 'middle', c: 'text-main', i: false, w: 600 })}${t(214, 236, 'arteria', { s: 8, a: 'middle', c: 'text-main', i: false, w: 600 })}`;
        if (E.comprimir) h += t(180, 258, d.venaColapsa ? 'la vena se colapsa; la arteria no' : 'la trombosada no se comprime', { s: 7.4, a: 'middle', c: 'accent-yellow', i: false });
    } else {
        h += `<rect x="40" y="${d.venaColapsa ? 192 : 176}" width="280" height="${d.venaColapsa ? 6 : 38}" style="fill:${d.colorVena ? col(d.colorVena) : 'var(--bg-main)'};stroke:var(--text-dim)" fill-opacity="${d.colorVena ? 0.75 : 1}" stroke-width="1.2"/>`;
        if (d.colorVena) h += t(180, 200, d.colorVena === 'rojo' ? '← hacia la sonda' : 'se aleja →', { s: 8, a: 'middle', c: 'text-main', i: false, w: 700 });
        if (d.aguja === 'linea') h += `<path d="M76 ${yS + 24} L176 192" style="stroke:var(--text-main)" stroke-width="2.6" stroke-linecap="round"/>`;
        h += `</g>${t(60, 170, 'vena (eje largo)', { s: 8, c: 'text-main', i: false, w: 600 })}${t(180, 240, 'no se ve la arteria vecina', { s: 7.2, a: 'middle', c: 'text-dim' })}`;
    }
    // sonda (el punto marca su lado) y escala de color
    h += `<rect x="118" y="${yS}" width="124" height="14" rx="4" style="fill:var(--accent-yellow);stroke:var(--bg-main)"/>
        <circle cx="${E.girada ? 234 : 126}" cy="${yS + 7}" r="3" style="fill:var(--bg-main)"/>
        ${t(112, yS + 10, E.eje === 'corto' ? 'sonda · corto' : 'sonda · largo', { s: 6.6, a: 'end', c: 'text-dim' })}`;
    if (E.doppler) h += `<rect x="300" y="150" width="8" height="34" style="fill:var(--accent-red)"/><rect x="300" y="184" width="8" height="34" style="fill:var(--accent-blue)"/>
        ${t(296, 160, 'hacia', { s: 6.2, a: 'end', c: 'text-dim' })}${t(296, 168, 'la sonda', { s: 6.2, a: 'end', c: 'text-dim' })}${t(296, 204, 'se', { s: 6.2, a: 'end', c: 'text-dim' })}${t(296, 212, 'aleja', { s: 6.2, a: 'end', c: 'text-dim' })}`;
    h += t(180, 287, 'esquema, no el ecógrafo', { s: 6.4, a: 'middle', c: 'text-muted' });
    $('lupaD').innerHTML = h;
}

/* ============================================================
      5. Animación: gotas, cámara de goteo, probeta, hematíes, burbujas, pulso y frascos
      ============================================================ */
export const Anim = { gotas: [], rbc: [], burbujas: [], rutaLen: 1, tuboLen: 1, uOcl: 2, camaraY: 0, venaR: 8, nivel: 0, fase: 0, hcHora: 0, aireMl: 0, reloj: 0, rutaC: null, ultimaHc: -1 };
let enMarcha = false, tPrev = 0, visible = false;
const fotogramas = [];   // ms de cada paso, para la prueba de rendimiento

function paso(dt) {
    Anim.reloj += dt;
    const e = estado;
    if (e.lupa === 'A') {
        const s = D.rel;
        const ruta = $('ruta');
        const vel = s > 0 ? 0.05 + 0.5 * s : 0;
        Anim.gotas.forEach((g, k) => {
            g.u += vel * dt / Math.max(0.6, Anim.rutaLen / 260);
            if (g.u > 1) g.u -= 1;
            let u = g.u;
            if (D.ocluido) u = Math.min(u, Anim.uOcl - 0.015 * (k % 4));
            const visibleGota = s > 0 || D.ocluido;
            if (!visibleGota || (D.ocluido && g.u > Anim.uOcl)) { g.el.setAttribute('display', 'none'); return; }
            const p = ruta.getPointAtLength(u * Anim.rutaLen);
            g.el.setAttribute('display', 'inline');
            g.el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
            g.el.setAttribute('opacity', u > 0.96 ? ((1 - u) / 0.04).toFixed(2) : '1');
        });
        // cámara de goteo y gota de la probeta
        const gc = $('gota-camara');
        if (gc) {
            if (s > 0) { Anim.fase = (Anim.fase + dt * (0.5 + 4 * s)) % 1; gc.setAttribute('cy', (-12 + Anim.fase * 11).toFixed(1)); gc.setAttribute('r', '1.4'); }
            else gc.setAttribute('r', '0');
        }
        if (e.io) Anim.nivel = 0.25; else { Anim.nivel += dt * s * 0.12; if (Anim.nivel > 1) Anim.nivel = 0; }
        pintarProbeta(s);
        // hematíes de la vena: no dependen del catéter
        if (!e.io) Anim.rbc.forEach(b => { b.x += 16 * dt; if (b.x > 362) b.x = 150; const y = VENA_Y + b.fy * Math.max(2, Anim.venaR * 1.5); b.el.setAttribute('transform', `translate(${b.x.toFixed(1)} ${y.toFixed(1)})`); });
    }
    if (e.lupa === 'C') {
        const corre = e.aire.abierto && (D.aire.tasa > 0 || D.aire.reducido);
        if (corre && D.aire.tasa > 0 && Anim.aireMl < 350) { Anim.aireMl = Math.min(350, Anim.aireMl + D.aire.tasa * dt); pintarLectura(); }
        if (corre && D.aire.reducido) Anim.aireMl = Math.min(66, Anim.aireMl + 6 * dt);   // solo para el dibujo: pocas burbujas, despacio (ilustrativo)
        const n = corre ? Math.min(14, Math.ceil(Anim.aireMl / 22)) : 0;
        const rc = Anim.rutaC, L = rc ? rc.getTotalLength() : 0;
        Anim.burbujas.forEach((b, k) => {
            if (k >= n || !rc) { b.el.setAttribute('display', 'none'); return; }
            b.u += dt * (D.aire.reducido ? 0.2 : 0.7); if (b.u > 1.35) b.u -= 1.35;
            let x, y;
            if (b.u <= 1) { const p = rc.getPointAtLength(b.u * L); x = p.x; y = p.y; }
            else { const f = (b.u - 1) / 0.35; x = 146 + f * 70 + Math.sin(k * 2.1) * 8; y = 206 + f * 36 + Math.cos(k * 1.7) * 10; }
            b.el.setAttribute('display', 'inline'); b.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.8 + (k % 3) * 0.25).toFixed(2)})`);
        });
        const tor = $('c-torax'); if (tor) { const k = 1 + 0.012 * Math.sin(Anim.reloj * 2 * Math.PI / 4); tor.setAttribute('transform', `translate(180 166) scale(${k.toFixed(4)}) translate(-180 -166)`); }
    }
    if (e.lupa === 'D') { const a = $('d-arteria'); if (a) a.setAttribute('r', (15 + 1.3 * Math.sin(Anim.reloj * 2 * Math.PI * 1.1)).toFixed(2)); }
    if (e.lupa === 'B' && e.zoomB === 'frascos' && e.hcIncubado && Anim.hcHora < 16) {
        Anim.hcHora = Math.min(16, Anim.hcHora + dt * 4);
        const q = Math.floor(Anim.hcHora * 4); if (q !== Anim.ultimaHc) { Anim.ultimaHc = q; pintarLupaB(estado); pintarLectura(); }
    }
}
function pintarProbeta(s) {
    const hNivel = Anim.nivel * PROB.h, y = PROB.y + PROB.h - hNivel;
    for (const id of ['prob-agua', 'prob-rayado']) { const r = $(id); r.setAttribute('y', y.toFixed(1)); r.setAttribute('height', hNivel.toFixed(1)); }
    const m = $('prob-menisco'); m.setAttribute('y1', y.toFixed(1)); m.setAttribute('y2', y.toFixed(1));
    const g = $('prob-gota');
    if (s > 0) { g.setAttribute('r', '1.6'); g.setAttribute('cy', (PROB.y - 10 + Anim.fase * (y - PROB.y + 8)).toFixed(1)); g.style.fill = 'var(--text-main)'; }
    else g.setAttribute('r', '0');
}
export function pintarUnaVez() {
    // «Reducir movimiento»: el estado final, quieto
    const s = D.rel;
    Anim.gotas.forEach((g, k) => {
        let u = (k + 0.5) / Anim.gotas.length;
        if (D.ocluido) u = Math.min(u, Anim.uOcl - 0.015 * (k % 4));
        if (s === 0 && !D.ocluido) { g.el.setAttribute('display', 'none'); return; }
        if (D.ocluido && (k + 0.5) / Anim.gotas.length > Anim.uOcl) { g.el.setAttribute('display', 'none'); return; }
        const p = $('ruta').getPointAtLength(u * Anim.rutaLen); g.el.setAttribute('display', 'inline'); g.el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    });
    Anim.nivel = estado.io ? 0.25 : s > 0 ? clamp(0.15 + s * 0.7, 0, 0.9) : 0; Anim.fase = 0.5; pintarProbeta(s);
    Anim.rbc.forEach(b => { const y = VENA_Y + b.fy * Math.max(2, Anim.venaR * 1.5); b.el.setAttribute('transform', `translate(${b.x} ${y.toFixed(1)})`); });
    if (estado.lupa === 'C' && estado.aire.abierto && (D.aire.tasa > 0 || D.aire.reducido)) { Anim.aireMl = D.aire.reducido ? 66 : 300; Anim.burbujas.forEach((b, k) => { const rc = Anim.rutaC; if (!rc) return; const p = rc.getPointAtLength((k / 14) * rc.getTotalLength()); b.el.setAttribute('display', 'inline'); b.el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); }); pintarLectura(); }
    if (estado.lupa === 'B' && estado.zoomB === 'frascos' && estado.hcIncubado && Anim.hcHora < 16) { Anim.hcHora = 16; pintarLupaB(estado); pintarLectura(); }
}
function bucle(ahora) {
    const dt = clamp((ahora - tPrev) / 1000, 0, 0.05); tPrev = ahora;
    if (!visible || document.hidden || REDUCIR) { enMarcha = false; return; }
    const t0 = performance.now();
    paso(dt);
    fotogramas.push(performance.now() - t0); if (fotogramas.length > 240) fotogramas.shift();
    requestAnimationFrame(bucle);
}
export function arrancar() { if (REDUCIR) { pintarUnaVez(); return; } if (enMarcha || !visible) return; enMarcha = true; tPrev = performance.now(); requestAnimationFrame(bucle); }
export function ponerVisible(v) { visible = v; if (v) arrancar(); }
export function estadoBucle() {
    const a = fotogramas.slice(-120); const m = a.reduce((x, y) => x + y, 0) / (a.length || 1);
    return { enMarcha, visible, fotogramas: { n: a.length, medio: +m.toFixed(2), max: +Math.max(0, ...a).toFixed(2) } };
}
export function vaciarFotogramas() { fotogramas.length = 0; }

let lupaAnim = null;
export const TITULO_LUPA = { A: 'lámina A · el flujo', B: 'lupa B · la piel y la biopelícula', C: 'lupa C · la punta y el aire', D: 'lupa D · pinchar con eco' };
export function abrirLupa(l, antes) {
    const g = $('lupa');
    $('chapa').textContent = TITULO_LUPA[l];
    $('lupa-cerrar').hidden = l === 'A';
    svg.style.touchAction = l === 'C' ? 'none' : 'pan-y';
    ['B', 'C', 'D'].forEach(k => $('lupa' + k).setAttribute('display', k === l ? 'inline' : 'none'));
    if (lupaAnim) { lupaAnim.stop?.(); lupaAnim = null; }
    $('lamA').setAttribute('opacity', l === 'A' ? '1' : '.3');
    $('escena').classList.toggle('ctv-con-lupa', l !== 'A');
    if (l === 'A') { g.setAttribute('display', 'none'); return; }
    g.setAttribute('display', 'inline');
    const tr = k => g.setAttribute('transform', `translate(${LUPA.cx} ${LUPA.cy}) scale(${k.toFixed(3)}) translate(${-LUPA.cx} ${-LUPA.cy})`);
    if (antes && antes !== 'A' || REDUCIR || !window.Motion) { tr(1); return; }
    tr(0.2);
    lupaAnim = window.Motion.animate(0.2, 1, { duration: 0.45, ease: [0.2, 0.8, 0.2, 1], onUpdate: tr });
}

/* Lectura viva (como un monitor): la cifra grande con su unidad y su origen */
export const ocultos = new Set();
export function setOcultos(arr) { ocultos.clear(); (arr || []).forEach(k => ocultos.add(k)); pintarLectura(); }
const q = (k, v) => ocultos.has(k) ? '?' : v;
const orgT = (org, ilu) => `<span class="ctv-t${ilu || /ilustrativo|sin cifra|50\/75/.test(org) ? ' ctv-ilu' : ''}">${/ilustrativo/.test(org) ? 'ilustr.' : /sin cifra/.test(org) ? 'sin cifra' : /50\/75/.test(org) ? 'calculado' : 'ficha'}</span>`;
export function pintarLectura() {
    const e = estado, el = $('lectura');
    // lo que la pregunta tapa también se tapa en la lámina: los mmHg de la regla y la barra de la intraósea
    $('mmhg-68').textContent = ocultos.has('presion') ? '? mmHg' : '50 mmHg'; $('mmhg-100').textContent = ocultos.has('presion') ? '? mmHg' : '75 mmHg';
    if (e.io) $('prob-io').setAttribute('display', ocultos.has('flujo') ? 'none' : 'inline');
    let h = '', pie = '';
    if (e.lupa === 'A') {
        const c = D.cat;
        if (e.io && e.bomba === 'gravedad' && !D.ocluido) {
            h += `<span class="ctv-k">Flujo</span><span class="ctv-grande">${q('flujo', '25 %')}</span><span class="ctv-t">ficha</span>`;
            h += `<span class="ctv-k"></span><b style="font:600 .66rem var(--ctv-sans);color:var(--text-dim)">de una periférica</b><span></span>`;
            h += `<span class="ctv-k">Médula</span><b>${q('presion', '≈30 mmHg')}</b><span class="ctv-t">ficha</span>`;
            pie = 'barra relativa, sin L/h: la ficha no dice qué periférica';
        } else {
            const alarma = D.ocluido ? ' class="ctv-alarma"' : '';
            const valor = D.ocluido ? '0' : D.texto;
            h += `<span class="ctv-k">Flujo</span><span${alarma}><span class="ctv-grande">${q('flujo', valor)}<small>${D.unidad}</small></span></span>${orgT(D.org, D.ilu)}`;
            h += `<span class="ctv-k">Catéter</span><b>${c.nombre}</b><span></span>`;
            if (e.io) h += `<span class="ctv-k">Médula</span><b>${q('presion', '≈30 mmHg')}</b><span class="ctv-t">ficha</span>`;
            else if (e.banco === 'fig') h += `<span class="ctv-k">Altura</span><b>¿?</b><span class="ctv-t ctv-ilu">no la dice</span>`;
            else h += `<span class="ctv-k">ΔP</span><b>${q('presion', `${D.presion} mmHg`)}</b><span class="ctv-t">ficha</span>`;
            pie = D.ocluido ? (D.alarma ? 'ocluido: la bomba alarma por presión' : 'ocluido: no gotea, cuesta aspirar') : e.bomba !== 'gravedad' ? `${BOMBAS[e.bomba].nombre}: ${BOMBAS[e.bomba].rango}` : e.altura === 68 && e.banco === 'tablas' ? 'calculado: tabla × 50/75 (Q ∝ ΔP)' : c.fr;
        }
    } else if (e.lupa === 'B') {
        if (e.zoomB === 'frascos') {
            const hora = Anim.hcHora, pc = hora >= D.hc.cateter, pp = hora >= D.hc.periferico;
            h += `<span class="ctv-k">Catéter</span><b>${q('hc', pc ? `+${D.hc.cateter} h` : '—')}</b><span class="ctv-t ctv-ilu">ilustr.</span>`;
            h += `<span class="ctv-k">Periférico</span><b>${q('hc', pp ? `+${dec(D.hc.periferico)} h` : '—')}</b><span class="ctv-t ctv-ilu">ilustr.</span>`;
            h += `<span class="ctv-k">Diferencia</span><span class="ctv-grande">${q('hc', pp ? '2,5' : '—')}<small>h</small></span><span class="ctv-t" style="color:var(--accent-red)">caso</span>`;
            pie = `reloj ${dec(Math.min(Anim.hcHora, 16), 0)} h (ilustr.) · criterio ≥2 h (91 %)`;
        } else {
            const b = D.bio;
            h += `<span class="ctv-k">Tiempo</span><span class="ctv-grande">${e.tiempo >= 168 ? 'día ' + e.tiempo / 24 : e.tiempo + '<small>h</small>'}</span><span></span>`;
            h += `<span class="ctv-k">Biopelícula</span><b>${q('bio', e.manejo === 'retirar' ? 'se fue' : e.manejo === 'guia' ? '—' : b.visible ? 'visible' : 'aún no')}</b><span class="ctv-t">${e.manejo === 'guia' ? '<span class="ctv-ilu">el libro no lo dice</span>' : e.tiempo > 48 ? '<span class="ctv-ilu">ritmo ilustr.</span>' : 'ficha'}</span>`;
            h += `<span class="ctv-k">Clínica</span><b>${q('bio', b.clinicaPosible ? 'puede haber' : 'aún no (<48 h)')}</b><span class="ctv-t">ficha</span>`;
            pie = e.antibiotico ? 'antibiótico: ×100-1.000 para la biopelícula' : `puertas de la piel: ${b.puertasCerradas} de 3 · cualitativo`;
        }
    } else if (e.lupa === 'C') {
        const ml = Math.round(Anim.aireMl);
        const letal = ml >= 200;
        if (D.aire.reducido && e.aire.abierto) h += `<span class="ctv-k">Aire</span><span class="ctv-grande">${q('aire', 'menos')}<small>riesgo</small></span><span class="ctv-t ctv-ilu">sin cifra</span>`;
        else h += `<span class="ctv-k">Aire</span><span${letal ? ' class="ctv-alarma"' : ''}><span class="ctv-grande">${q('aire', fmt(D.aire.tasa ? ml : 0))}<small>mL</small></span></span><span class="ctv-t">${!e.aire.abierto ? 'cerrado' : D.aire.tasa ? 'en ' + dec(ml / AIRE.tasa, 1) + ' s' : '0 mL/s'}</span>`;
        h += `<span class="ctv-k">Mortal</span><b>200-300 mL</b><span class="ctv-t">ficha</span>`;
        h += `<span class="ctv-k">Punta</span><b>${q('punta', D.punta.ok === true ? '✓ carina' : D.punta.ok === false ? '✗ mal' : e.punta === 'auricula' ? 'aurícula' : 'alta')}</b><span class="ctv-t">ficha</span>`;
        pie = `100 mL/s · 3-5 mL/kg = 210-350 en 70 kg`;
    } else {
        const d = D.eco;
        h += `<span class="ctv-k">Vena</span><b>${q('eco', estado.eco.comprimir ? (d.venaColapsa ? 'colapsada' : 'no se comprime') : 'abierta')}</b><span class="ctv-t">ficha</span>`;
        h += `<span class="ctv-k">Arteria</span><b>${estado.eco.eje === 'largo' ? 'no se ve' : 'redonda, late'}</b><span class="ctv-t">ficha</span>`;
        h += `<span class="ctv-k">Doppler</span><b>${q('eco', estado.eco.doppler ? (estado.eco.girada ? 'girada' : 'activo') : 'apagado')}</b><span class="ctv-t">ficha</span>`;
        pie = 'el color es dirección, no tipo de vaso';
    }
    h += `<span class="ctv-pie">${pie}</span>`;
    el.innerHTML = h;
}

/* ---------- Anillo dorado que late sobre lo que hay que mirar ---------- */
export const ANCLAS = { probeta: [PROB.x + PROB.w / 2, PROB.y + PROB.h / 2, 70], bolsa: [80, null, 56], vena: [280, VENA_Y, 60], escala: [220, VENA_Y, 80], punta: [null, null, 44], cocos: [150, 200, 80], frascos: [180, 170, 120], conector: [225, 112, 50], eco: [180, 180, 110] };
let anilloAnim = null;
export function anillo(obj) {
    const a = $('anillo');
    if (anilloAnim) { anilloAnim.stop?.(); anilloAnim = null; }
    // La lectura es un rectángulo: se resalta con su propio borde, no con el anillo
    $('lectura').classList.toggle('ctv-mira', obj === 'lectura');
    if (!obj || obj === 'lectura') { a.hidden = true; return; }
    const r0 = $('escena').getBoundingClientRect();
    let x, y, tam;
    {
        let [sx, sy, st] = ANCLAS[obj];
        if (obj === 'bolsa') sy = yBolsa(estado.banco === 'fig' ? 100 : estado.altura) - 30;
        if (obj === 'punta') [sx, sy] = estado.izquierdo ? [156, 134] : PUNTA_XY[estado.punta];
        const rs = svg.getBoundingClientRect(), k = rs.width / 360;
        x = rs.left - r0.left + sx * k; y = rs.top - r0.top + sy * k; tam = st * k;
    }
    a.style.left = x + 'px'; a.style.top = y + 'px'; a.style.width = a.style.height = tam + 'px'; a.style.margin = `-${tam / 2}px 0 0 -${tam / 2}px`; a.hidden = false;
    if (!REDUCIR && window.Motion) anilloAnim = window.Motion.animate(a, { transform: ['scale(0.88)', 'scale(1.08)', 'scale(0.88)'], opacity: [0.95, 0.5, 0.95] }, { duration: 1.4, repeat: Infinity, easing: 'ease-in-out' });
}

/* ============================================================
   Aplicar un estado: todo se repinta desde aquí. Devuelve el estado anterior.
   ============================================================ */
export function pintarEscena() {
    if (!svg) return;
    pintarLaminaA(estado);
    if (estado.lupa === 'B') pintarLupaB(estado);
    if (estado.lupa === 'C') pintarLupaC(estado);
    if (estado.lupa === 'D') pintarLupaD(estado);
    pintarLectura();
}
export function aplicarModelo(nuevo, op = {}) {
    const viejo = estado;
    estado = nuevo; D = derivar(estado);
    if (viejo.lupa !== nuevo.lupa || op.forzar) abrirLupa(nuevo.lupa, viejo.lupa);
    if (viejo.aire.abierto !== nuevo.aire.abierto || viejo.aire.postura !== nuevo.aire.postura || viejo.izquierdo !== nuevo.izquierdo) Anim.aireMl = 0;
    if (!nuevo.hcIncubado || (nuevo.hcIncubado && !viejo.hcIncubado)) { Anim.hcHora = 0; Anim.ultimaHc = -1; }
    pintarEscena();
    if (REDUCIR) pintarUnaVez(); else arrancar();
    return viejo;
}
// La primera vez que la lámina se ve, se mide de nuevo (getTotalLength no funciona con la vista oculta en todos los
// navegadores).
export function medir() { if (svg && (!Anim.rutaLen || Anim.rutaLen < 2)) pintarEscena(); }

/* ============================================================
   Inicio (después de cargar los partials)
   ============================================================ */
export function initEscena() {
    construirLamina();
    D = derivar(estado);
    pintarEscena(); abrirLupa('A');
}
