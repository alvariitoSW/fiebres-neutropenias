// Dibujo común de las partículas (iones y moléculas) de los modelos vivos,
// desde la tabla única de js/data/formas-iones.js: en lienzo 2D
// (pintarParticula), en SVG (svgParticula) y como leyenda (leyendaParticulas).
// Ningún modelo dibuja sus formas por su cuenta: así una especie tiene la
// misma forma en todos.
//
// No confundir con js/modules/eco/formas.mjs (formas de enfermedad del eco).
//
// La geometría de cada forma se escribe una sola vez como trazados SVG
// centrados en 0,0 (radio base `r`); el lienzo los usa con Path2D. Cada forma
// es una lista de partes: 'lleno' (relleno con borde fino oscuro detrás) o
// 'trazo' (línea con su borde oscuro). `color` de una parte: token propio
// (p. ej. el anillo del citrato); si no, el de la especie.
import { FORMAS_IONES, BORDE_PARTICULA } from '../data/formas-iones.js';

const n2 = x => +x.toFixed(2);
const poligono = (n, r, giro) => {
    let d = '';
    for (let i = 0; i < n; i++) { const a = giro + i * 2 * Math.PI / n; d += `${i ? 'L' : 'M'}${n2(Math.cos(a) * r)} ${n2(Math.sin(a) * r)}`; }
    return d + 'Z';
};
const elipse = (rx, ry) => `M${n2(rx)} 0A${n2(rx)} ${n2(ry)} 0 1 1 ${n2(-rx)} 0A${n2(rx)} ${n2(ry)} 0 1 1 ${n2(rx)} 0Z`;
// Un círculo de radio r centrado en (cx, cy): para las formas hechas de bolitas (collar, FP4, gránulos)
const circ = (cx, cy, r) => `M${n2(cx + r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 1 ${n2(cx - r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 1 ${n2(cx + r)} ${n2(cy)}Z`;
const lleno = (d, extra = {}) => ({ d, tipo: 'lleno', ...extra });
const trazo = (d, w, extra = {}) => ({ d, tipo: 'trazo', w, ...extra });

// Partes de una forma de radio base r.
function partesDe(forma, r, e = {}) {
    switch (forma) {
        case 'gota': return [lleno(`M0 ${n2(-1.5 * r)}C${n2(0.55 * r)} ${n2(-0.75 * r)} ${n2(1.05 * r)} ${n2(-0.15 * r)} ${n2(1.05 * r)} ${n2(0.35 * r)}A${n2(1.05 * r)} ${n2(1.05 * r)} 0 0 1 ${n2(-1.05 * r)} ${n2(0.35 * r)}C${n2(-1.05 * r)} ${n2(-0.15 * r)} ${n2(-0.55 * r)} ${n2(-0.75 * r)} 0 ${n2(-1.5 * r)}Z`)];
        case 'anillo': return [trazo(elipse(r, r), 0.34)];
        case 'circulo': return [lleno(elipse(r, r))];
        case 'grano': return [lleno(elipse(1.6 * r, 1.6 * r))];
        case 'cuadrado': return [lleno(`M${n2(-0.92 * r)} ${n2(-0.92 * r)}h${n2(1.84 * r)}v${n2(1.84 * r)}h${n2(-1.84 * r)}Z`)];
        case 'rombo': return [lleno(`M0 ${n2(-1.35 * r)}L${n2(0.92 * r)} 0L0 ${n2(1.35 * r)}L${n2(-0.92 * r)} 0Z`)];
        case 'grano1': return [trazo(elipse(2.4 * r, 2.4 * r), 0.2, { opacidad: 0.6, sinBorde: true }), ...partesDe('grano', r)];
        case 'pajarita': return [lleno(`M${n2(-1.3 * r)} ${n2(-0.95 * r)}L0 0L${n2(-1.3 * r)} ${n2(0.95 * r)}ZM${n2(1.3 * r)} ${n2(-0.95 * r)}L0 0L${n2(1.3 * r)} ${n2(0.95 * r)}Z`)];
        case 'rombo1': case 'rombo2': {
            const halo = rr => trazo(elipse(rr, rr), 0.2, { opacidad: 0.6, sinBorde: true });
            return [halo(1.85 * r), ...(forma === 'rombo2' ? [halo(2.45 * r)] : []), ...partesDe('rombo', r)];
        }
        case 'triangulo': return [lleno(`M0 ${n2(-1.25 * r)}L${n2(1.15 * r)} ${n2(0.85 * r)}L${n2(-1.15 * r)} ${n2(0.85 * r)}Z`)];
        case 'trianguloHueco': return [trazo(`M0 ${n2(-1.25 * r)}L${n2(1.15 * r)} ${n2(0.85 * r)}L${n2(-1.15 * r)} ${n2(0.85 * r)}Z`, 0.3)];
        case 'trianguloInv': return [lleno(`M0 ${n2(1.25 * r)}L${n2(1.15 * r)} ${n2(-0.85 * r)}L${n2(-1.15 * r)} ${n2(-0.85 * r)}Z`)];
        case 'cruz': { const a = n2(1.1 * r), b = n2(0.38 * r); return [lleno(`M${-b} ${-a}H${b}V${-b}H${a}V${b}H${b}V${a}H${-b}V${b}H${-a}V${-b}H${-b}Z`)]; }
        case 'pentagono': return [lleno(poligono(5, 1.2 * r, -Math.PI / 2))];
        case 'hexagono': return [lleno(poligono(6, 1.2 * r, Math.PI / 6))];
        case 'voluta': {
            let d = '';
            for (let a = 0, i = 0; a <= Math.PI * 2.6; a += 0.25, i++) { const rr = r * (0.15 + a / 6.2); d += `${i ? 'L' : 'M'}${n2(Math.cos(a) * rr)} ${n2(Math.sin(a) * rr)}`; }
            return [trazo(d, 0.3)];
        }
        case 'estrella': {
            let d = '';
            for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 0.58 * r : 1.45 * r; d += `${i ? 'L' : 'M'}${n2(Math.cos(a) * rr)} ${n2(Math.sin(a) * rr)}`; }
            return [trazo(d + 'Z', 0.28)];
        }
        case 'copo': {
            let d = '';
            for (let i = 0; i < 3; i++) { const a = Math.PI / 2 + i * Math.PI / 3, x = Math.cos(a) * 1.4 * r, y = Math.sin(a) * 1.4 * r; d += `M${n2(x)} ${n2(y)}L${n2(-x)} ${n2(-y)}`; }
            return [trazo(d, 0.36)];
        }
        case 'ovalo': return [lleno(elipse(1.4 * r, 0.82 * r))];
        case 'ovaloHueco': return [trazo(elipse(1.3 * r, 0.74 * r), 0.3)];
        case 'disco': return [lleno(elipse(1.35 * r, r)), lleno(elipse(0.55 * r, 0.36 * r), { color: BORDE_PARTICULA, opacidad: 0.55, sinBorde: true })];
        case 'trebol': return [lleno([-90, 30, 150].map(g => { const a = g * Math.PI / 180, cx = Math.cos(a) * 0.62 * r, cy = Math.sin(a) * 0.62 * r, rr = n2(0.62 * r); return `M${n2(cx + rr)} ${n2(cy)}A${rr} ${rr} 0 1 1 ${n2(cx - rr)} ${n2(cy)}A${rr} ${rr} 0 1 1 ${n2(cx + rr)} ${n2(cy)}Z`; }).join(''))];
        case 'aro': return [trazo(elipse(1.9 * r, 1.4 * r), 0.28)];
        case 'caCitrato': return [trazo(elipse(1.9 * r, 1.4 * r), 0.28, { color: e.anillo, sinBorde: true }), ...partesDe('ovalo', 0.85 * r)];
        case 'celula': return [trazo(elipse(1.4 * r, 1.4 * r), 0.38), lleno(elipse(0.45 * r, 0.45 * r), { sinBorde: true })];
        case 'luna': { const R = 1.15 * r; return [lleno(`M${n2(0.5275 * R)} ${n2(-0.8495 * R)}A${n2(R)} ${n2(R)} 0 1 0 ${n2(0.5275 * R)} ${n2(0.8495 * R)}A${n2(0.85 * R)} ${n2(0.85 * R)} 0 0 1 ${n2(0.5275 * R)} ${n2(-0.8495 * R)}Z`)]; }
        // O₂: dos bolitas unidas por una barra (O=O). Lactato: trípode, medio copo.
        case 'pesa': {
            const bola = (cx, rr) => `M${n2(cx + rr)} 0A${n2(rr)} ${n2(rr)} 0 1 1 ${n2(cx - rr)} 0A${n2(rr)} ${n2(rr)} 0 1 1 ${n2(cx + rr)} 0Z`;
            return [trazo(`M${n2(-0.9 * r)} 0H${n2(0.9 * r)}`, 0.34), lleno(bola(-0.9 * r, 0.6 * r) + bola(0.9 * r, 0.6 * r))];
        }
        case 'tripode': {
            let d = '';
            for (const g of [90, 210, 330]) { const a = g * Math.PI / 180; d += `M0 0L${n2(Math.cos(a) * 1.4 * r)} ${n2(Math.sin(a) * 1.4 * r)}`; }
            return [trazo(d, 0.38)];
        }
        // Catéter vivo (Marino caps. 1-3). Coco: círculo lleno con 8 adhesinas cortas (el círculo va primero: «hueco»,
        // la bacteria muerta, es su contorno). Burbuja de aire: aro fino con un reflejo arriba a la izquierda.
        case 'coco': {
            let d = '';
            for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2, c = Math.cos(a), s = Math.sin(a); d += `M${n2(c * 1.08 * r)} ${n2(s * 1.08 * r)}L${n2(c * 1.6 * r)} ${n2(s * 1.6 * r)}`; }
            return [lleno(elipse(r, r)), trazo(d, 0.26)];
        }
        case 'burbuja': return [trazo(elipse(1.15 * r, 1.15 * r), 0.2), trazo(`M${n2(-0.72 * r)} ${n2(-0.2 * r)}A${n2(0.75 * r)} ${n2(0.75 * r)} 0 0 1 ${n2(-0.2 * r)} ${n2(-0.72 * r)}`, 0.24, { sinBorde: true })];
        // La muralla de papel (Marino cap. 4). Bacilo: bastón de extremos redondos. Huso: la flora residente
        // (anaerobios). Linfocito: círculo claro con núcleo grande. Cadena corta: zigzag abierto de cuatro tramos.
        case 'bacilo': { const L = 1.55 * r, w = 0.62 * r; return [lleno(`M${n2(-L + w)} ${n2(-w)}H${n2(L - w)}A${n2(w)} ${n2(w)} 0 0 1 ${n2(L - w)} ${n2(w)}H${n2(-L + w)}A${n2(w)} ${n2(w)} 0 0 1 ${n2(-L + w)} ${n2(-w)}Z`)]; }
        case 'huso': { const L = 1.5 * r, w = 0.55 * r; return [lleno(`M${n2(-L)} 0Q0 ${n2(-2 * w)} ${n2(L)} 0Q0 ${n2(2 * w)} ${n2(-L)} 0Z`)]; }
        case 'linfocito': return [lleno(elipse(1.15 * r, 1.15 * r), { color: '--text-dim' }), lleno(elipse(0.78 * r, 0.78 * r), { color: '--accent-purple', sinBorde: true })];
        case 'cadena': return [trazo(`M${n2(-1.4 * r)} ${n2(0.4 * r)}L${n2(-0.7 * r)} ${n2(-0.4 * r)}L0 ${n2(0.4 * r)}L${n2(0.7 * r)} ${n2(-0.4 * r)}L${n2(1.4 * r)} ${n2(0.4 * r)}`, 0.3)];
        // El telar de la trombina (Marino cap. 5). Escudo: la antitrombina. Collar: la heparina (5 cuentas en arco).
        // FP4: cuatro bolitas en cuadrado. IgG: una Y. Plaqueta: disco con gránulos (con 8 espinas al activarse).
        // Hilo: la fibrina.
        case 'escudo': return [lleno(`M0 ${n2(-1.35 * r)}L${n2(1.1 * r)} ${n2(-0.9 * r)}L${n2(1.02 * r)} ${n2(0.25 * r)}Q${n2(0.7 * r)} ${n2(1.05 * r)} 0 ${n2(1.45 * r)}Q${n2(-0.7 * r)} ${n2(1.05 * r)} ${n2(-1.02 * r)} ${n2(0.25 * r)}L${n2(-1.1 * r)} ${n2(-0.9 * r)}Z`)];
        case 'collar': return [lleno([-2, -1, 0, 1, 2].map(i => circ(i * 0.62 * r, Math.abs(i) * 0.22 * r - 0.25 * r, 0.32 * r)).join(''))];
        case 'fp4': return [lleno([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => circ(a * 0.55 * r, b * 0.55 * r, 0.5 * r)).join(''))];
        case 'igg': return [trazo(`M0 ${n2(1.35 * r)}L0 0M0 0L${n2(-0.95 * r)} ${n2(-1.1 * r)}M0 0L${n2(0.95 * r)} ${n2(-1.1 * r)}`, 0.42)];
        case 'plaqueta': return [lleno(elipse(r, r)), lleno(circ(-0.35 * r, -0.2 * r, 0.2 * r) + circ(0.3 * r, -0.3 * r, 0.17 * r) + circ(0.05 * r, 0.38 * r, 0.19 * r), { color: BORDE_PARTICULA, opacidad: 0.6, sinBorde: true })];
        case 'plaquetaActiva': { let d = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.3, c = Math.cos(a), s = Math.sin(a); d += `M${n2(c * 0.95 * r)} ${n2(s * 0.95 * r)}L${n2(c * 1.75 * r)} ${n2(s * 1.75 * r)}`; } return [trazo(d, 0.28), ...partesDe('plaqueta', r)]; }
        case 'hilo': return [trazo(`M${n2(-1.5 * r)} ${n2(0.4 * r)}C${n2(-0.7 * r)} ${n2(-0.9 * r)} ${n2(0.1 * r)} ${n2(0.9 * r)} ${n2(0.7 * r)} ${n2(-0.3 * r)}S${n2(1.5 * r)} ${n2(-0.2 * r)} ${n2(1.5 * r)} ${n2(-0.6 * r)}`, 0.26)];
    }
    return [lleno(elipse(r, r))];
}
// Hasta dónde llega cada forma, en radios (para que quepa en un icono).
const ALCANCE = { gota: 1.55, grano: 1.7, grano1: 2.5, pajarita: 1.35, rombo1: 2, rombo2: 2.6, caCitrato: 2.05, aro: 2.05, estrella: 1.5, celula: 1.6, ovalo: 1.45, ovaloHueco: 1.45, disco: 1.4, copo: 1.5, pesa: 1.55, tripode: 1.45, coco: 1.65, burbuja: 1.3, bacilo: 1.6, huso: 1.55, linfocito: 1.2, cadena: 1.5, escudo: 1.5, collar: 1.65, fp4: 1.1, igg: 1.4, plaqueta: 1.05, plaquetaActiva: 1.8, hilo: 1.6 };

// Grosor del borde oscuro: fino, pero visible también en partículas pequeñas.
const borde = r => Math.max(0.22 * r, 0.8);

function especie(clave) {
    const e = FORMAS_IONES[clave];
    if (!e) throw new Error(`Partícula sin forma en la tabla: ${clave}`);
    return e;
}

// ---------- Colores (los tokens se leen una vez) ----------
const resueltos = new Map();
export function colorToken(token) {
    if (!token.startsWith('--')) return token;
    if (!resueltos.has(token)) resueltos.set(token, getComputedStyle(document.documentElement).getPropertyValue(token).trim());
    return resueltos.get(token);
}
// Color de una especie (hex), para rótulos o guías del mismo color que la partícula.
export const colorParticula = clave => colorToken(especie(clave).color);
export const nombreParticula = clave => especie(clave).nombre;

// ---------- Lienzo 2D ----------
const caminos = new Map();
function partesLienzo(forma, r, e) {
    const k = `${forma}|${r}|${e.anillo || ''}`;
    if (!caminos.has(k)) caminos.set(k, partesDe(forma, r, e).map(p => ({ ...p, camino: new Path2D(p.d) })));
    return caminos.get(k);
}
// Pinta una partícula en (x, y). Opciones: `color` (token o hex; por defecto
// el de la tabla: p. ej. el K⁺ del potasio, coloreado por sitio), `giro`
// (radianes), `borde` (false = sin borde oscuro) y `hueco` (solo el
// contorno, discontinuo: «lo que falta»). Respeta el globalAlpha del lienzo.
export function pintarParticula(ctx, clave, x, y, r, { color, giro = 0, borde: conBorde = true, hueco = false } = {}) {
    const e = especie(clave);
    const col = colorToken(color ?? e.color), fondo = colorToken(BORDE_PARTICULA);
    const alfa0 = ctx.globalAlpha;
    ctx.save();
    ctx.translate(x, y);
    if (giro) ctx.rotate(giro);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const p of partesLienzo(e.forma, r, e)) {
        const c = p.color ? colorToken(p.color) : col;
        ctx.globalAlpha = alfa0 * (p.opacidad ?? 1);
        if (hueco) {
            ctx.setLineDash([r * 0.7, r * 0.55]);
            ctx.strokeStyle = c; ctx.lineWidth = Math.max(0.9, r * 0.3); ctx.stroke(p.camino);
            ctx.setLineDash([]);
            break;
        }
        if (p.tipo === 'lleno') {
            if (conBorde && !p.sinBorde) { ctx.strokeStyle = fondo; ctx.lineWidth = borde(r) * 2; ctx.stroke(p.camino); }
            ctx.fillStyle = c; ctx.fill(p.camino);
        } else {
            if (conBorde && !p.sinBorde) { ctx.strokeStyle = fondo; ctx.lineWidth = r * p.w + borde(r) * 1.2; ctx.stroke(p.camino); }
            ctx.strokeStyle = c; ctx.lineWidth = r * p.w; ctx.stroke(p.camino);
        }
    }
    ctx.restore();
    ctx.globalAlpha = alfa0;
}

// ---------- SVG ----------
const pintura = c => c.startsWith('--') ? `var(${c})` : c;
// La partícula como SVG (texto), centrada en (x, y). Mismas opciones que en
// el lienzo, más `halo` (token: anillo alrededor, p. ej. «metido en la
// célula») y `opacidad`.
export function svgParticula(clave, x = 0, y = 0, r = 4, { color, borde: conBorde = true, hueco = false, halo, opacidad } = {}) {
    const e = especie(clave);
    const col = pintura(color ?? e.color), fondo = pintura(BORDE_PARTICULA);
    let s = halo ? `<circle r="${n2(1.75 * r)}" style="fill:none;stroke:${pintura(halo)};stroke-width:${n2(Math.max(0.8, 0.28 * r))};opacity:.8"/>` : '';
    for (const p of partesDe(e.forma, r, e)) {
        const c = p.color ? pintura(p.color) : col, op = p.opacidad != null ? `;opacity:${p.opacidad}` : '';
        if (hueco) { s += `<path d="${p.d}" style="fill:none;stroke:${c};stroke-width:${n2(Math.max(0.9, 0.3 * r))};stroke-dasharray:${n2(0.7 * r)} ${n2(0.55 * r)}"/>`; break; }
        if (p.tipo === 'lleno') {
            const bd = conBorde && !p.sinBorde ? `;stroke:${fondo};stroke-width:${n2(borde(r) * 2)};paint-order:stroke;stroke-linejoin:round` : '';
            s += `<path d="${p.d}" style="fill:${c}${bd}${op}"/>`;
        } else {
            if (conBorde && !p.sinBorde) s += `<path d="${p.d}" style="fill:none;stroke:${fondo};stroke-width:${n2(r * p.w + borde(r) * 1.2)};stroke-linejoin:round;stroke-linecap:round"/>`;
            s += `<path d="${p.d}" style="fill:none;stroke:${c};stroke-width:${n2(r * p.w)};stroke-linejoin:round;stroke-linecap:round${op}"/>`;
        }
    }
    const g = x || y ? `transform="translate(${n2(x)} ${n2(y)})"` : '';
    return `<g${g ? ' ' + g : ''}${opacidad != null ? ` opacity="${opacidad}"` : ''}>${s}</g>`;
}

// ---------- Leyenda ----------
// Icono de leyenda (SVG de `tam` px) de una especie, con las opciones de svgParticula.
export function iconoParticula(clave, tam = 14, opciones = {}) {
    const e = especie(clave);
    const alcance = opciones.halo ? 1.9 : ALCANCE[e.forma] ?? 1.45;
    const r = n2((tam / 2 - 0.9) / alcance);
    return `<svg width="${tam}" height="${tam}" viewBox="${-tam / 2} ${-tam / 2} ${tam} ${tam}" aria-hidden="true" focusable="false">${svgParticula(clave, 0, 0, r, opciones)}</svg>`;
}
// Leyenda de partículas. `items`: claves de la tabla o { clave, nombre,
// color, hueco, halo, opacidad } para variantes de un modelo (p. ej. el K⁺
// por sitio). Con `envolver: false` devuelve solo las entradas, para un
// contenedor que ya existe. Usa la clase .nv-especies (css/components.css).
export function leyendaParticulas(items, { envolver = true, titulo = 'Qué es cada partícula' } = {}) {
    const entradas = items.map(it => {
        const o = typeof it === 'string' ? { clave: it } : it;
        const { clave, nombre, ...opc } = o;
        return `<span>${iconoParticula(clave, 14, opc)}${nombre ?? especie(clave).nombre}</span>`;
    }).join('');
    return envolver ? `<div class="nv-especies" role="group" aria-label="${titulo}">${entradas}</div>` : entradas;
}
