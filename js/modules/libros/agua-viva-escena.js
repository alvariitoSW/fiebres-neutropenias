// Río y mar: la escena viva. El estuario de noche (río = plasma, marisma =
// intersticio, mar = células), sus mareógrafos y la lectura Na⁺ · Posm · Hto,
// las partículas que viajan, las dos lupas (orilla y neurona) y el bucle de
// dibujo. Un solo estado (`estado`) y lo que se deriva de él (`D`, con
// derivar() de js/data/agua-viva-data.js). La interfaz y la capa de estudio
// viven en agua-viva.js.
//
// Las partículas se dibujan con js/core/particulas.js (tabla única de
// formas, js/data/formas-iones.js); solo los «destellos» de la sal, que no son
// una especie sino el brillo de la osmolalidad, se dibujan aquí.
//
// Rendimiento (como la maqueta): el paisaje fijo se pinta aparte y solo se
// repinta si cambia; el bucle se para cuando nada se mueve o la vista está
// oculta; con «reducir movimiento» se pinta el estado final, sin bucle.
import { pintarParticula, colorParticula } from '../../core/particulas.js';
import { pintarFormula } from '../../core/formula.js';
import { sinMovimiento } from '../../core/motion.js';
import { dibujarOrina, puntoOrina, filasLecturaOrina } from './agua-viva-orina.js';
import { Tubo } from './agua-viva-tubo.js';
import {
    COMP, HTO0, NA0, FLUIDOS, estadoBase, derivar, clamp, copia, fmt, fmtD,
} from '../../data/agua-viva-data.js';

// ---------- Utilidades ----------
export const $ = id => document.getElementById('agv-' + id);
export const C = {};                 // colores de los tokens (se leen al iniciar)
export let REDUCIR = false;
const rgbCache = {};
function rgb(h) {
    if (rgbCache[h]) return rgbCache[h];
    let r;
    if (h.startsWith('rgb')) r = h.match(/\d+/g).slice(0, 3).map(Number);
    else { const s = h.replace('#', ''); r = [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]; }
    return (rgbCache[h] = r);
}
const rgbaCache = new Map();   // cada color se construye una vez: menos basura por fotograma
const rgba = (h, a) => {
    const al = Math.round(a * 100) / 100, k = h + al; let v = rgbaCache.get(k);
    if (!v) { const [r, g, b] = rgb(h); v = `rgba(${r},${g},${b},${al})`; rgbaCache.set(k, v); }
    return v;
};
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;
function azar(sem) { let s = sem >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const sprites = {};
function brilloSprite(color) {
    if (sprites[color]) return sprites[color];
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, rgba(color, 1)); gr.addColorStop(0.25, rgba(color, 0.55)); gr.addColorStop(1, rgba(color, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (sprites[color] = c);
}

// ---------- Estado ----------
// `estado` y `D` se exportan como enlaces vivos: solo esta pieza los cambia
// (aplicarModelo); la interfaz los lee.
export let estado = estadoBase();
export let D = derivar(estado);
export const ocultos = new Set();   // cifras tapadas con «?» hasta contestar (campo `ocultar`)
export let ultimaAccion = { tipo: 'nada' };    // el último fluido manda en lo que se ve en la lupa

let lienzo, ctx, capaTinta, ctxT, fondo, vineta, paisajeCv;
let W = 0, H = 0, DPR = 1;           // 0 hasta que la vista se ve y se mide
let tiempo = 0;
// Lo que se ve: se acerca a D poco a poco (los mareógrafos suben con un muelle)
const vis = { rio: 0, marisma: 0, mar: 0, hto: HTO0, ton: 1 };
const nivel = { rio: { v: 0, vel: 0 }, marisma: { v: 0, vel: 0 }, mar: { v: 0, vel: 0 }, edema: { v: 0, vel: 0 } };
let parts = [];                          // partículas que viajan (≤ 230)
const MAX_PARTS = 230;
let flechasAlb = -1;                     // flechas de la marisma al río tras la albúmina al 25 %
let modoEstudio = () => false;           // la interfaz dice si la escena va en pequeño (Conceptos y Mayéutica)

const P_AGUA = () => ({ agua: C.texto, brillo: C.oro });

function vis1(d, S, Amas, Amenos) { const A = d >= 0 ? Amas : (Amenos ?? Amas); return Math.sign(d) * A * (1 - Math.exp(-Math.abs(d) / S)); }
let tintaViva = -1;
function tinta(x, y, color, r, a) { ctxT.globalAlpha = a; ctxT.drawImage(brilloSprite(color), x - r, y - r, r * 2, r * 2); ctxT.globalAlpha = 1; tintaViva = tiempo + 4; }

// Una partícula de la tabla única (s = tamaño de la maqueta). Solo giran las
// que giraban en la maqueta (hematíes, glucosa y urea).
const GIRAN = new Set(['rbc', 'glu', 'urea']);
function pinta(g, clave, x, y, s, alfa = 1, giro = 0) {
    if (clave === 'brillo') { brillo(g, x, y, s, C.oro, alfa); return; }
    const a0 = g.globalAlpha; g.globalAlpha = alfa;
    pintarParticula(g, clave, x, y, Math.round(s * 0.9 * 100) / 100, GIRAN.has(clave) ? { giro: clave === 'rbc' ? giro * 0.3 : giro } : undefined);
    g.globalAlpha = a0;
}
// Destellos de la sal: el brillo de la osmolalidad, no una especie.
function brillo(g, x, y, s, color, alfa) {
    g.globalAlpha = alfa; g.fillStyle = color; g.strokeStyle = color;
    g.fillRect(x - s * 0.45, y - s * 0.45, s * 0.9, s * 0.9);
    g.lineWidth = 0.8; g.beginPath(); g.moveTo(x - s * 1.4, y); g.lineTo(x + s * 1.4, y); g.moveTo(x, y - s * 1.4); g.lineTo(x, y + s * 1.4); g.stroke();
    g.globalAlpha = 1;
}
// El mismo destello como icono SVG (leyenda).
export const SVG_BRILLO = (tam = 16) => `<svg width="${tam}" height="${tam}" viewBox="-8 -8 16 16" aria-hidden="true" focusable="false"><path d="M-6 0H6M0 -6V6" style="stroke:var(--accent-blue);stroke-width:1.2"/><circle r="2" style="fill:var(--accent-blue)"/></svg>`;

function texto(g, t, x, y, { size = 10, color = C.dim, align = 'left', italic = true, peso = '', caja = false, base = 'alphabetic' } = {}) {
    g.font = `${italic ? 'italic ' : ''}${peso} ${size}px Georgia, serif`;
    g.textAlign = align; g.textBaseline = base;
    if (caja) {
        const w = g.measureText(t).width; const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
        g.fillStyle = rgba(C.bg, 0.8); g.beginPath(); g.roundRect(x0 - 4, y - size + 0.5, w + 8, size + 5, 4); g.fill();
    }
    g.fillStyle = color; g.fillText(t, x, y);
}

function cr(p0, p1, p2, p3, t) {
    const t2 = t * t, t3 = t2 * t;
    return [
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
    ];
}
function muelle(n, objetivo, dt) {
    if (REDUCIR) { n.v = objetivo; n.vel = 0; return; }
    const k = 26, c = 4.2; const a = k * (objetivo - n.v) - c * n.vel;
    n.vel += a * dt; n.v += n.vel * dt;
}

/* Tonicidad para el dibujo: la célula como osmómetro (fisiología general); el tamaño exagera (ilustrativo) */
function factorCelula() {
    let s = 285 / D.posmEf;
    // hipernatremia: osmolitos desde las 9 h, completo en 48 h (mr-hiperna-cerebro)
    if (s < 1 && D.posmEf > 295) s = estado.reloj === 'dias' ? 1 : estado.reloj === '8-12h' ? lerp(s, 1, 0.4) : s;
    s -= 0.035 * D.tendNa;   // tendencia sin cifra (ADH con hipotónicos, pérdidas hipotónicas)
    return s;
}

export const Estuario = {
    layout() {
        const r = azar(7);
        this.puertas = [0.15, 0.4, 0.64, 0.87].map(f => ({ x: f * W, luz: 0, dir: 0 }));
        this.vasija = { x: 0.085 * W, y: this.rioY(0.03 * W) - 30 };
        this.herida = { x: 0.6 * W };
        this.islotes = [];
        const cand = [[0.2, 0.47, 11], [0.36, 0.44, 8], [0.5, 0.81, 15], [0.8, 0.46, 9], [0.16, 0.8, 10], [0.93, 0.72, 8], [0.68, 0.84, 9], [0.06, 0.58, 13]];
        for (const [fx, fy, rr] of cand) {
            const x = fx * W, y = fy * H, rad = rr * W / 360;
            if (Math.abs(y - this.rioY(x)) > rad + 22 && y > this.dunaAbajo(x) + rad + 2 && y < this.marismaAbajo(x) - rad - 2) this.islotes.push({ x, y, r: rad });
        }
        this.islotes.push({ x: this.vasija.x, y: this.vasija.y + 6, r: 15 * W / 360, vasija: true });
        this.juncos = [];
        for (const is of this.islotes) for (let i = 0; i < 4; i++) {
            const a = r() * TAU, d = is.r * (0.7 + r() * 0.5);
            this.juncos.push({ x: is.x + Math.cos(a) * d, y: is.y + Math.sin(a) * d, n: 3 + Math.floor(r() * 3), l: 6 + r() * 5, s: r() * 10 });
        }
        for (let i = 0; i < 26; i++) {
            const x = r() * W; const y0 = this.dunaAbajo(x) + 4, y1 = this.marismaAbajo(x) - 2;
            const y = r() < 0.5 ? y0 + r() * 12 : y1 - r() * 12;
            if (Math.abs(y - this.rioY(x)) < 22) continue;
            this.juncos.push({ x, y, n: 3 + Math.floor(r() * 3), l: 6 + r() * 6, s: r() * 10 });
        }
        this.estrellas = Array.from({ length: 60 }, () => ({ x: r() * W, y: r(), f: r() * TAU, z: 0.4 + r() * 0.8 }));
        this.limo = Array.from({ length: 16 }, () => ({ s: r() * W, o: r() * 1.6 - 0.8 }));
        this.discos = Array.from({ length: 26 }, (_, i) => ({ s: (i / 26) * (W + 20), o: r() * 1.4 - 0.7, g: r() * TAU }));
        this.cristales = Array.from({ length: 16 }, () => ({ s: r() * W, o: r() * 1.4 - 0.7, g: r() * TAU, m: r() }));
        this.ureas = Array.from({ length: 24 }, () => ({ x: r() * W, f: r() * TAU, v: 0.04 + r() * 0.05 }));
        this.pradoHierba = Array.from({ length: 150 }, () => ({ x: r() * W, y: H * (0.7 + r() * 0.3), a: -Math.PI / 2 + (r() - 0.5) * 2.2, l: 2 + r() * 3 }));
        this.fondo();
    },
    orillaMar(x) { return H * 0.245 + H * 0.02 * Math.sin(x / W * 5.1 + 0.6) + H * 0.009 * Math.sin(x / W * 13 + 2.1); },
    dunaArriba(x) { return H * 0.315 + H * 0.008 * Math.sin(x / W * 7 + 1); },
    dunaAbajo(x) { return this.dunaArriba(x) + H * 0.058 + 2.5 * Math.sin(x / W * 11); },
    rioY(x) { return H * 0.615 + H * 0.075 * Math.sin(x / W * Math.PI * 1.9 + 0.5); },
    marismaAbajo(x) { const u = (x / W - 0.5) * 2; return H * 0.9 - H * 0.13 * u ** 4 + H * 0.014 * Math.sin(x / W * 9 + 0.3); },
    anchoRio() { return 9 * W / 360 + nivel.rio.v; },
    offMar() { return nivel.mar.v; },
    offMarisma() { return nivel.marisma.v + nivel.edema.v; },
    objetivos() {
        const dR = vis.rio - D.base.rio, dM = vis.marisma - D.base.marisma, dC = vis.mar - D.base.mar;
        const s = W / 360;
        const ton = (vis.ton - 1) * 120 * s;                   // tonicidad: ilustrativo
        const perd = estado.perdida ? -6 * s : 0;               // pérdidas hipotónicas: ilustrativo
        const edema = (estado.albBaja ? 9 : 0) + (estado.inflamacion ? 11 : 0);
        return {
            rio: vis1(dR, 650, 10 * s, 5 * s) + (estado.albBaja || estado.inflamacion ? -1.2 * s : 0),
            marisma: vis1(dM, 1500, 15 * s, 7 * s) + perd * 0.5,
            mar: vis1(dC, 1200, 15 * s, 13 * s) + clamp(ton, -18 * s, 18 * s) + perd,
            edema: edema * s,
        };
    },
    fondo() {
        const g = fondo.getContext('2d'); fondo.width = W * DPR; fondo.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0);
        g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
        const r = azar(11);
        const gr = g.createLinearGradient(0, H * 0.4, 0, H);
        gr.addColorStop(0, rgba(C.verde, 0.03)); gr.addColorStop(1, rgba(C.verde, 0.08));
        g.fillStyle = gr; g.fillRect(0, H * 0.35, W, H * 0.65);
        for (let i = 0; i < 900; i++) { g.fillStyle = rgba(r() < 0.6 ? C.muted : C.verde, 0.04 + r() * 0.08); g.fillRect(r() * W, r() * H, 1, 1); }
        g.strokeStyle = rgba(C.verde, 0.22); g.lineWidth = 0.7;
        g.beginPath(); for (const h of this.pradoHierba) { g.moveTo(h.x, h.y); g.lineTo(h.x + Math.cos(h.a) * h.l, h.y + Math.sin(h.a) * h.l); } g.stroke();
        // playa (fija)
        g.beginPath(); g.moveTo(0, 0);
        for (let x = 0; x <= W; x += 6) g.lineTo(x, this.dunaArriba(x) + 1);
        g.lineTo(W, 0); g.closePath(); g.fillStyle = rgba(C.ambar, 0.13); g.fill();
        // duna (fija), con estrías
        g.beginPath(); for (let x = 0; x <= W; x += 6) g.lineTo(x, this.dunaArriba(x)); for (let x = W; x >= 0; x -= 6) g.lineTo(x, this.dunaAbajo(x)); g.closePath();
        const gd = g.createLinearGradient(0, H * 0.31, 0, H * 0.38); gd.addColorStop(0, rgba(C.ambar, 0.3)); gd.addColorStop(0.55, rgba(C.dim, 0.26)); gd.addColorStop(1, rgba(C.muted, 0.2));
        g.fillStyle = gd; g.fill();
        g.strokeStyle = rgba(C.ambar, 0.3); g.lineWidth = 0.7;
        for (let k = 1; k < 4; k++) { g.beginPath(); for (let x = 0; x <= W; x += 6) g.lineTo(x, lerp(this.dunaArriba(x), this.dunaAbajo(x), k / 4) + 1.2 * Math.sin(x * 0.15 + k)); g.stroke(); }
        // juncos (grabado fijo)
        g.strokeStyle = rgba(C.verde, 0.6); g.lineWidth = 0.8; g.beginPath();
        for (const j of this.juncos) {
            for (let i = 0; i < j.n; i++) {
                const a = -Math.PI / 2 + (i / (j.n - 1) - 0.5) * 1.9 + Math.sin(j.s + i) * 0.2; const l = j.l * (0.7 + 0.5 * ((i * 7 + j.s) % 1));
                g.moveTo(j.x, j.y); g.quadraticCurveTo(j.x + Math.cos(a) * l * 0.5, j.y + Math.sin(a) * l * 0.6, j.x + Math.cos(a) * l, j.y + Math.sin(a) * l * 0.85);
            }
        }
        g.stroke();
        g.fillStyle = rgba(C.ambar, 0.45); g.beginPath(); for (const j of this.juncos) { g.moveTo(j.x + 0.9, j.y - j.l * 0.8); g.arc(j.x, j.y - j.l * 0.8, 0.9, 0, TAU); } g.fill();
        const v = vineta.getContext('2d'); vineta.width = W * DPR; vineta.height = H * DPR; v.setTransform(DPR, 0, 0, DPR, 0, 0);
        const rv = v.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.35, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
        rv.addColorStop(0, rgba(C.bg, 0)); rv.addColorStop(1, rgba(C.bg, 0.7));
        v.fillStyle = rv; v.fillRect(0, 0, W, H);
        this._firma = null;
    },
    puntoRio(x, o = (Math.random() * 1.4 - 0.7)) { return [x, this.rioY(x) + o * this.anchoRio()]; },
    caminoRio(x0, x1) { const pts = []; const n = Math.max(1, Math.round(Math.abs(x1 - x0) / 26)); for (let i = 0; i <= n; i++) pts.push(this.puntoRio(lerp(x0, x1, i / n), (Math.random() - 0.5) * 0.6)); return pts; },
    puntoMarisma(cerca) {
        for (let k = 0; k < 60; k++) {
            const x = cerca != null ? clamp(cerca + (Math.random() - 0.5) * 70, 8, W - 8) : 8 + Math.random() * (W - 16);
            const y0 = this.dunaAbajo(x) + 6, y1 = this.marismaAbajo(x) + this.offMarisma() - 6;
            const y = lerp(y0, y1, Math.random());
            if (Math.abs(y - this.rioY(x)) > this.anchoRio() + 7 && !this.islotes.some(i => Math.hypot(i.x - x, i.y - y) < i.r + 3)) return [x, y];
        }
        return [W / 2, this.dunaAbajo(W / 2) + 10];
    },
    puntoMar(cerca) {
        const x = cerca != null ? clamp(cerca + (Math.random() - 0.5) * 90, 6, W - 6) : 6 + Math.random() * (W - 12);
        const y = lerp(H * 0.03, this.orillaMar(x) + this.offMar() - 8, Math.random() ** 0.8);
        return [x, y];
    },
    ruta(p) {
        const { de, a } = p; const V = this.vasija;
        const boca = [V.x + 13, V.y + 2], caida = [V.x + 15, this.rioY(V.x + 15)];
        const pts = [];
        if (de === 'fuente') {
            pts.push(boca, caida);
            if (a === 'rio') { const xr = 0.15 * W + Math.random() * 0.8 * W; pts.push(...this.caminoRio(V.x + 15, xr)); }
            else if (a === 'marisma') {
                const destino = this.puntoMarisma(); const xb = clamp(destino[0], V.x + 30, W - 10);
                pts.push(...this.caminoRio(V.x + 15, xb));
                const lado = destino[1] < this.rioY(xb) ? -1 : 1;
                pts.push([xb, this.rioY(xb) + lado * (this.anchoRio() + 5)], destino);
            } else if (a === 'mar') {
                const pu = this.puertas[Math.floor(Math.random() * this.puertas.length)];
                pts.push(...this.caminoRio(V.x + 15, pu.x));
                pts.push([pu.x, this.rioY(pu.x) - this.anchoRio() - 5], [pu.x + (Math.random() - 0.5) * 10, this.dunaAbajo(pu.x) + 6], [pu.x, (this.dunaArriba(pu.x) + this.dunaAbajo(pu.x)) / 2], [pu.x, this.dunaArriba(pu.x) - 3], this.puntoMar(pu.x));
                p.puerta = pu;
            }
        } else if (de === 'mar') {
            const pu = this.puertas[Math.floor(Math.random() * this.puertas.length)]; p.puerta = pu;
            pts.push(this.puntoMar(pu.x), [pu.x, this.orillaMar(pu.x) + this.offMar() - 2], [pu.x, (this.dunaArriba(pu.x) + this.dunaAbajo(pu.x)) / 2], [pu.x, this.dunaAbajo(pu.x) + 6]);
            if (a === 'marisma') pts.push(this.puntoMarisma(pu.x));
            else { pts.push([pu.x + (Math.random() - 0.5) * 20, this.rioY(pu.x) - this.anchoRio() - 6], this.puntoRio(pu.x + 10)); }
        } else if (de === 'marisma') {
            const m = this.puntoMarisma(); const lado = m[1] < this.rioY(m[0]) ? -1 : 1;
            pts.push(m, [m[0], this.rioY(m[0]) + lado * (this.anchoRio() + 5)], this.puntoRio(m[0] + 8));
        } else if (de === 'rio') {
            const h = this.herida.x; const x0 = h - 60 - Math.random() * 60;
            pts.push(...this.caminoRio(x0, h), [h + 2, this.rioY(h) + this.anchoRio() + 4], [h + 8, lerp(this.rioY(h), H, 0.45)], [h + 20, H + 12]);
        }
        return pts;
    },
    asentar(p) {
        if (p.a === 'herida') { p.quitar = true; return; }
        if (p.a === 'rio') p.o = clamp((p.y - this.rioY(p.x)) / Math.max(1, this.anchoRio()), -0.8, 0.8);
        p.bx = p.x; p.by = p.y;
    },
    colocar(p) {
        if (p.a === 'herida') { p.quitar = true; return; }
        let q;
        if (p.a === 'rio') { q = this.puntoRio(Math.random() * W); p.o = (q[1] - this.rioY(q[0])) / this.anchoRio(); }
        else if (p.a === 'marisma') q = this.puntoMarisma();
        else q = this.puntoMar();
        p.x = q[0]; p.y = q[1]; p.bx = q[0]; p.by = q[1];
    },
    mover(p, dt) {
        if (p.a === 'rio') {
            p.x += dt * (20 + 8 * Math.sin(tiempo * 0.7 + p.semilla)) * W / 360;
            if (p.x > W + 8) p.x = -8;
            p.y = this.rioY(p.x) + p.o * this.anchoRio() * 0.85;
        } else if (p.a === 'marisma') {
            p.x = p.bx + Math.sin(tiempo * 0.25 + p.semilla) * 2.5; p.y = p.by + Math.cos(tiempo * 0.21 + p.semilla) * 2;
        } else {
            p.x = p.bx + Math.sin(tiempo * 0.35 + p.semilla) * 3.5; p.y = p.by + Math.sin(tiempo * 0.6 + p.semilla * 2) * 1.5;
            const tope = this.orillaMar(p.x) + this.offMar() - 5; if (p.y > tope) p.by -= 0.6;
        }
    },
    zona(x, y) {
        if (y < this.orillaMar(x) + this.offMar()) return 'mar';
        if (y < this.dunaAbajo(x)) return 'duna';
        if (Math.abs(y - this.rioY(x)) < this.anchoRio() + 10) return 'rio';
        if (y < this.marismaAbajo(x) + this.offMarisma()) return 'marisma';
        return null;
    },
    punto(obj) {
        const s = W / 360;
        if (obj === 'rio') { const x = 0.46 * W; return [x, this.rioY(x)]; }
        if (obj === 'marisma') { const x = 0.7 * W; return [x, lerp(this.dunaAbajo(x), this.rioY(x) - this.anchoRio(), 0.5)]; }
        if (obj === 'mar') return [0.42 * W, H * 0.12];
        if (obj === 'herida') return [this.herida.x, this.rioY(this.herida.x) + this.anchoRio() + 10 * s];
        if (obj === 'orina') return puntoOrina(W, H, x => this.rioY(x), this.anchoRio());
        if (obj === 'compuertas') { const pu = this.puertas[1]; return [pu.x, (this.dunaArriba(pu.x) + this.dunaAbajo(pu.x)) / 2]; }
        return [W / 2, H / 2];
    },
    firma() {
        const q = v => Math.round(v / 3);
        return [lienzo.width, lienzo.height, q(this.offMar()), q(this.offMarisma()), q(this.anchoRio() * 2), estado.hemorragia > 0 ? 1 : 0,
            Math.round(nivel.edema.v), Math.round(clamp(D.naMed / 140, 0.6, 1.4) * 10)].join(',');
    },
    pintarPaisaje() {
        const f = this.firma(); if (f === this._firma) return;
        if (enMarcha && this._firma && performance.now() - (this._ultimo || 0) < 220) return;   // como mucho ~4-5 repintados por segundo
        this._firma = f; this._ultimo = performance.now();
        const cv = paisajeCv; if (cv.width !== lienzo.width || cv.height !== lienzo.height) { cv.width = lienzo.width; cv.height = lienzo.height; }
        const g = cv.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
        const P = P_AGUA(), s = W / 360;
        const offMar = this.offMar(), offM = this.offMarisma(), hw = this.anchoRio();
        const sal = clamp(D.naMed / 140, 0.6, 1.4);
        g.drawImage(fondo, 0, 0, W, H);
        /* el mar */
        if (offMar < -1) {
            g.beginPath(); for (let x = 0; x <= W; x += 6) g.lineTo(x, this.orillaMar(x)); for (let x = W; x >= 0; x -= 6) g.lineTo(x, this.orillaMar(x) + offMar);
            g.closePath(); g.fillStyle = rgba(P.agua, 0.06); g.fill();
            g.strokeStyle = rgba(C.dim, 0.25); g.setLineDash([2, 4]); g.beginPath(); for (let x = 0; x <= W; x += 6) g.lineTo(x, this.orillaMar(x)); g.stroke(); g.setLineDash([]);
        }
        g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= W; x += 6) g.lineTo(x, this.orillaMar(x) + offMar); g.lineTo(W, 0); g.closePath();
        const gm = g.createLinearGradient(0, 0, 0, H * 0.3); gm.addColorStop(0, rgba(C.ambar, 0.08)); gm.addColorStop(0.6, rgba(C.texto, 0.15)); gm.addColorStop(1, rgba(C.texto, 0.27));
        g.fillStyle = gm; g.fill();
        g.save(); g.clip();
        const lx = W * 0.7;
        g.globalAlpha = 0.35; g.drawImage(brilloSprite(P.brillo), lx - 55, -40, 110, 90); g.globalAlpha = 1;
        g.strokeStyle = rgba(P.brillo, 0.28); g.lineWidth = 1; g.beginPath();
        for (let i = 0; i < 40; i++) {
            const yy = (i / 40) * H * 0.3; const ancho = 10 + 13 * (1 - yy / (H * 0.3)); const desv = Math.sin(i * 12.9) * ancho * 0.6;
            g.moveTo(lx + desv - 3 - i % 3, yy); g.lineTo(lx + desv + 3 + i % 4, yy);
        }
        g.stroke();
        const nEst = Math.round(clamp(30 * sal, 8, 60));
        g.fillStyle = rgba(C.oro, 0.55); g.strokeStyle = rgba(C.oro, 0.45); g.lineWidth = 0.8; g.beginPath();
        for (let i = 8; i < nEst; i++) {
            const e = this.estrellas[i]; const y = e.y * (this.orillaMar(e.x) + offMar - 6), r0 = 1.5 * e.z * 1.4;
            g.moveTo(e.x - r0, y); g.lineTo(e.x + r0, y); g.moveTo(e.x, y - r0); g.lineTo(e.x, y + r0);
        }
        g.stroke();
        g.restore();
        g.strokeStyle = rgba(P.brillo, 0.5); g.lineWidth = 1.3; g.beginPath();
        for (let x = 0; x <= W; x += 6) g.lineTo(x, this.orillaMar(x) + offMar + 1.2 * Math.sin(x * 0.05));
        g.stroke();
        /* compuertas (la base; la luz va en la capa animada) */
        for (const pu of this.puertas) {
            const ya = this.dunaArriba(pu.x) - 1, yb = this.dunaAbajo(pu.x) + 1, ym = lerp(ya, yb, 0.5);
            g.fillStyle = rgba(P.agua, 0.16); g.fillRect(pu.x - 3.5, ya, 7, yb - ya);
            g.fillStyle = rgba(C.bg, 0.85); g.fillRect(pu.x - 6, ya - 1, 2.5, yb - ya + 2); g.fillRect(pu.x + 3.5, ya - 1, 2.5, yb - ya + 2);
            g.fillStyle = rgba(C.ambar, 0.55); g.fillRect(pu.x - 6.5, ym - 1, 13, 2);
        }
        /* la marisma */
        const bajo = x => this.marismaAbajo(x) + offM;
        g.beginPath(); for (let x = 0; x <= W; x += 6) g.lineTo(x, this.dunaAbajo(x) + 1); for (let x = W; x >= 0; x -= 6) g.lineTo(x, bajo(x)); g.closePath();
        const gma = g.createLinearGradient(0, H * 0.4, 0, H * 0.9); gma.addColorStop(0, rgba(C.texto, 0.12)); gma.addColorStop(0.5, rgba(C.texto, 0.18)); gma.addColorStop(1, rgba(C.texto, 0.12));
        g.fillStyle = gma; g.fill();
        if (nivel.edema.v > 0.5) {
            const e = clamp(nivel.edema.v / (20 * s), 0, 1);
            for (const [fx, ancho, alto] of [[0.1, 0.15, 0.1], [0.38, 0.17, 0.08], [0.68, 0.15, 0.1], [0.94, 0.12, 0.09]]) {
                const cx = fx * W; const cy = bajo(cx);
                g.beginPath(); g.ellipse(cx, cy + alto * H * 0.4 * e, ancho * W * (0.5 + 0.5 * e), alto * H * e, 0, 0, TAU);
                g.fillStyle = rgba(P.agua, 0.2 * e); g.fill();
                g.setLineDash([3, 4]); g.strokeStyle = rgba(P.brillo, 0.55 * e); g.lineWidth = 1; g.stroke(); g.setLineDash([]);
            }
        }
        g.strokeStyle = rgba(P.brillo, 0.3); g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= W; x += 6) g.lineTo(x, bajo(x)); g.stroke();
        const nSalM = Math.round(clamp(9 * sal, 3, 16));
        g.strokeStyle = rgba(C.oro, 0.5); g.lineWidth = 0.8; g.beginPath();
        for (let i = 0; i < nSalM; i++) {
            const e = this.estrellas[(i * 7) % this.estrellas.length]; const x = (e.x * 1.7 + i * 37) % W; const y = lerp(this.dunaAbajo(x) + 6, bajo(x) - 4, (e.y * 3.1 + i * 0.13) % 1);
            if (Math.abs(y - this.rioY(x)) < hw + 4) continue;
            g.moveTo(x - 1.8, y); g.lineTo(x + 1.8, y); g.moveTo(x, y - 1.8); g.lineTo(x, y + 1.8);
        }
        g.stroke();
        for (const is of this.islotes) {
            const rr = Math.max(is.vasija ? is.r : 2, is.r - offM * 0.55);
            g.beginPath(); g.ellipse(is.x, is.y, rr * 1.25, rr * 0.85, 0.3, 0, TAU);
            g.fillStyle = rgba(C.bg, 0.92); g.fill(); g.fillStyle = rgba(C.muted, 0.18); g.fill();
            g.strokeStyle = rgba(C.dim, 0.18); g.lineWidth = 0.8; g.stroke();
        }
        /* la herida */
        if (estado.hemorragia > 0) {
            const h = this.herida.x;
            g.strokeStyle = rgba(C.rojo, 0.6); g.lineWidth = 2.5; g.beginPath();
            g.moveTo(h, this.rioY(h) + hw); g.quadraticCurveTo(h + 4, lerp(this.rioY(h), H, 0.5), h + 20, H + 2); g.stroke();
        }
        /* el cauce del río */
        g.lineCap = 'round'; g.lineJoin = 'round';
        if (!this.camino || this.caminoW !== W) {
            this.camino = new Path2D(); for (let x = -12; x <= W + 12; x += 6) this.camino[x === -12 ? 'moveTo' : 'lineTo'](x, this.rioY(x));
            this.hilos = [-0.45, 0.05, 0.5].map(desv => { const p = []; for (let x = -12; x <= W + 12; x += 8) p.push([x, this.rioY(x)]); return { desv, p }; });
            this.caminoW = W;
        }
        g.strokeStyle = rgba(P.brillo, 0.07); g.lineWidth = hw * 2 + 16; g.stroke(this.camino);
        g.strokeStyle = rgba(C.muted, 0.5); g.lineWidth = hw * 2 + 6; g.stroke(this.camino);
        g.strokeStyle = rgba(C.bg, 1); g.lineWidth = hw * 2 + 1; g.stroke(this.camino);
        g.strokeStyle = rgba(P.agua, 0.34); g.lineWidth = hw * 2; g.stroke(this.camino);
        g.strokeStyle = rgba(P.agua, 0.18); g.lineWidth = hw * 0.9; g.stroke(this.camino);
        g.drawImage(vineta, 0, 0, W, H);
    },
    dibujar(g) {
        const P = P_AGUA(); const t = tiempo; const s = W / 360;
        this.pintarPaisaje();
        g.drawImage(paisajeCv, 0, 0, W, H);
        const offMar = this.offMar(), hw = this.anchoRio();
        const sal = clamp(D.naMed / 140, 0.6, 1.4);
        // crestas de ola y unos pocos destellos que titilan
        g.lineWidth = 1;
        for (let k = 0; k < 3; k++) {
            const fase = ((t * 0.07) + k / 3) % 1; const dist = (1 - fase) * H * 0.2 + 4;
            g.strokeStyle = rgba(P.brillo, 0.4 * Math.sin(fase * Math.PI)); g.setLineDash([16 + k * 6, 11 + k * 3]); g.lineDashOffset = k * 17;
            g.beginPath(); for (let x = 0; x <= W; x += 12) g.lineTo(x, this.orillaMar(x) + offMar - dist + 2 * Math.sin(x * 0.04 + k)); g.stroke();
        }
        g.setLineDash([]);
        for (let i = 0; i < 8; i++) {
            const e = this.estrellas[i]; const y = e.y * (this.orillaMar(e.x) + offMar - 6);
            brillo(g, e.x, y, 1.6 * e.z, C.oro, (0.25 + 0.7 * Math.max(0, Math.sin(t * 1.6 + e.f))));
        }
        // luz de las compuertas al pasar el agua
        for (const pu of this.puertas) {
            if (pu.luz <= 0.05) { pu.luz = 0; continue; }
            const ya = this.dunaArriba(pu.x) - 1, yb = this.dunaAbajo(pu.x) + 1, ym = lerp(ya, yb, 0.5), d = pu.dir;
            g.fillStyle = rgba(P.agua, 0.35 * pu.luz); g.fillRect(pu.x - 3.5, ya, 7, yb - ya);
            g.strokeStyle = rgba(P.brillo, pu.luz); g.lineWidth = 1.4; g.beginPath();
            g.moveTo(pu.x - 4, ym - 3 * d); g.lineTo(pu.x, ym + 3 * d); g.lineTo(pu.x + 4, ym - 3 * d); g.stroke();
            pu.luz = Math.max(0, pu.luz - 0.02);
        }
        // corriente del río
        const vels = [34, 46, 28], alfas = [0.5, 0.65, 0.4];
        this.hilos.forEach((h, k) => {
            g.setLineDash([5 + 4 * alfas[k], 16]); g.lineDashOffset = -t * vels[k] * s; g.strokeStyle = rgba(P.brillo, alfas[k] * 0.6);
            g.beginPath(); h.p.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y + h.desv * hw)); g.stroke();
        });
        g.setLineDash([]);
        // hematíes: discos terracota; más separados cuanto más bajo el Hto
        const nDisc = Math.round(clamp(vis.hto / 45, 0.2, 1.3) * 18);
        for (let i = 0; i < nDisc; i++) {
            const d = this.discos[i]; const x = (((i / nDisc) * (W + 20) + t * 26 * s) % (W + 20)) - 10;
            pinta(g, 'rbc', x, this.rioY(x) + d.o * hw * 0.75, 2.3, 0.92, d.g + t * 0.6);
        }
        // el limo (albúmina) del río
        const albInf = estado.infusiones.filter(i => i.f.startsWith('alb')).length;
        const nLimo = clamp((estado.albBaja ? 5 : 12) + albInf * 2, 0, 16);
        for (let i = 0; i < nLimo; i++) { const l = this.limo[i]; const x = ((l.s + t * 22 * s) % (W + 20)) - 10, y = this.rioY(x) + l.o * hw * 0.8; pinta(g, 'alb', x, y, 1.1, 0.8); }
        const nSalR = Math.round(clamp(6 * sal, 2, 12));
        g.strokeStyle = rgba(C.oro, 0.75); g.lineWidth = 0.8; g.beginPath();
        for (let i = 0; i < nSalR; i++) { const x = ((i * 53.7 + t * 30 * s) % (W + 20)) - 10, y = this.rioY(x) + Math.sin(i * 2.1) * hw * 0.6; g.moveTo(x - 1.8, y); g.lineTo(x + 1.8, y); g.moveTo(x, y - 1.8); g.lineTo(x, y + 1.8); }
        g.stroke();
        // glucosa sin insulina: cristales ocres en el río y la marisma (no entran en el mar)
        const nGlu = Math.round(clamp((estado.glucosa - 100) / 500, 0, 1) * 16);
        for (let i = 0; i < nGlu; i++) {
            const c = this.cristales[i];
            if (c.m < 0.5) { const x = ((c.s + t * 24 * s) % (W + 20)) - 10; pinta(g, 'glu', x, this.rioY(x) + c.o * hw * 0.7, 2.1, 0.85, c.g + t); }
            else { const x = (c.s * 1.3) % W; const y = lerp(this.dunaAbajo(x) + 6, this.marismaAbajo(x) - 6, c.m); if (Math.abs(y - this.rioY(x)) > hw + 4) pinta(g, 'glu', x, y, 2, 0.7, c.g); }
        }
        // urea: hexágonos topo que cruzan todas las orillas
        if (estado.urea) for (const u of this.ureas) {
            const fase = (Math.sin(t * u.v * 6 + u.f) + 1) / 2; const x = u.x + Math.sin(t * 0.3 + u.f) * 6;
            pinta(g, 'urea', x, lerp(H * 0.08, this.marismaAbajo(x) - 10, fase), 2.4, 0.85, t * 0.5 + u.f);
        }
        if (estado.hemorragia > 0) { const h = this.herida.x; g.globalAlpha = 0.3 + 0.2 * Math.sin(t * 3); g.fillStyle = C.rojo; g.beginPath(); g.arc(h, this.rioY(h) + hw, 5, 0, TAU); g.fill(); g.globalAlpha = 1; }
        if (nivel.edema.v > 1) this.flechasOrilla(g, +1, clamp(nivel.edema.v / (20 * s), 0.3, 1), P);
        if (D.relleno > 0) this.flechasOrilla(g, -1, estado.reloj === 'dias' ? 0.55 : 1, P);
        else if (tiempo < flechasAlb) this.flechasOrilla(g, -1, clamp((flechasAlb - tiempo) / 3, 0, 1), P);
        if (tintaViva > tiempo) g.drawImage(capaTinta, 0, 0, W, H);
        this.dibujarVasija(g);
    },
    flechasOrilla(g, sentido, fuerza, P) {
        const hw = this.anchoRio();
        for (let i = 0; i < 8; i++) {
            const x = (i + 0.5) / 8 * W + 12 * Math.sin(i * 3);
            for (const lado of [-1, 1]) {
                const fase = ((tiempo * 0.6 + i * 0.37 + (lado > 0 ? 0.5 : 0)) % 1);
                const y0 = this.rioY(x) + lado * (hw + 2), d = 12 * W / 360;
                const ya = sentido > 0 ? y0 + lado * fase * d : y0 + lado * (1 - fase) * d;
                const a = Math.sin(fase * Math.PI) * 0.75 * fuerza;
                g.strokeStyle = rgba(sentido > 0 ? P.brillo : C.verde, a); g.lineWidth = 1.2; g.beginPath();
                const dir = sentido * lado;
                g.moveTo(x - 2.5, ya - 2.5 * dir); g.lineTo(x, ya); g.lineTo(x + 2.5, ya - 2.5 * dir); g.stroke();
            }
        }
    },
    dibujarVasija(g) {
        const V = this.vasija; const vertiendo = parts.some(p => p.de === 'fuente' && !p.asentada);
        this.giro = lerp(this.giro || 0, vertiendo ? 0.75 : 0.15, REDUCIR ? 1 : 0.08);
        g.save(); g.translate(V.x, V.y); g.rotate(this.giro);
        const s = W / 360;
        g.beginPath(); g.ellipse(0, 0, 9 * s, 11 * s, 0, 0, TAU);
        g.fillStyle = rgba(C.ambar, 0.32); g.fill(); g.strokeStyle = rgba(C.ambar, 0.95); g.lineWidth = 1.2; g.stroke();
        g.beginPath(); g.moveTo(-3.5 * s, -10 * s); g.lineTo(-3 * s, -15 * s); g.lineTo(3 * s, -15 * s); g.lineTo(3.5 * s, -10 * s); g.stroke();
        g.beginPath(); g.ellipse(0, -15.5 * s, 4.6 * s, 1.6 * s, 0, 0, TAU); g.stroke();
        g.beginPath(); g.arc(-9 * s, -4 * s, 4 * s, Math.PI * 0.6, Math.PI * 1.5); g.stroke();
        g.beginPath(); g.arc(9 * s, -4 * s, 4 * s, -Math.PI * 0.5, Math.PI * 0.4); g.stroke();
        g.restore();
        texto(g, 'vasija', V.x, V.y + 22 * s, { size: 9, color: C.muted, align: 'center' });
    },
    mareografos(g) {
        const s = W / 360, compacto = H < 280;
        const marca = (x, y, nombre, c, alto) => {
            const d = vis[c] - D.base[c]; const nivelF = clamp(0.5 + d / 4000, 0.06, 0.94);
            const h = alto * s, w = 6 * s;
            g.fillStyle = rgba(C.bg, 0.85); g.fillRect(x - w / 2 - 1, y - h - 1, w + 2, h + 2);
            g.fillStyle = rgba(C.texto, 0.55); g.fillRect(x - w / 2, y - h * nivelF, w, h * nivelF);
            g.strokeStyle = rgba(C.dim, 0.75); g.lineWidth = 0.7;
            for (let k = 0; k <= 8; k++) { const yy = y - h * k / 8; g.beginPath(); g.moveTo(x - w / 2, yy); g.lineTo(x - w / 2 + (k % 4 === 0 ? w : w * 0.5), yy); g.stroke(); }
            g.strokeStyle = rgba(C.oro, 0.95); g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - w / 2 - 3, y - h * 0.5); g.lineTo(x + w / 2 + 3, y - h * 0.5); g.stroke();
            const tx = x + w / 2 + 5;
            texto(g, nombre, tx, y - h + 8 * s, { size: 9.5 * s, color: C.dim, italic: false, peso: '600', caja: true });
            const col = d > 0.5 ? C.oro : d < -0.5 ? C.rojo : C.dim;
            const fl = c === 'mar' && D.marFlecha ? (D.marFlecha > 0 ? ' ↑' : ' ↓') : '';
            const sinCifraMar = fl && Math.abs(d) < 0.5;   // el mar se mueve sin cifra: la flecha, no «±0 mL»
            texto(g, ocultos.has(c) ? '? mL' : sinCifraMar ? fl.trim() + ' sin cifra' : fmtD(d) + ' mL' + fl, tx, y - h + (compacto ? 20 : 21) * s, { size: 12 * s, color: ocultos.has(c) ? C.dim : col, italic: false, peso: 'bold', caja: true });
        };
        marca(0.05 * W, 0.235 * H + (compacto ? 12 : 0), 'MAR', 'mar', compacto ? 28 : 40);
        const xr = 0.27 * W; marca(xr, this.rioY(xr) - 2, 'RÍO', 'rio', compacto ? 30 : 40);
        const xm = 0.79 * W; marca(xm, Math.min(this.marismaAbajo(xm) - 6, H - 50 * s), 'MARISMA', 'marisma', compacto ? 30 : 40);
        if (D.marFlecha) texto(g, `el mar ${D.marFlecha > 0 ? 'se hincha' : 'se encoge'} · sin cifra, ilustrativo`, W * 0.03, 0.235 * H + (compacto ? 25 : 14) * s, { size: 8.5 * s, color: D.marFlecha > 0 ? C.rojo : C.oro, align: 'left', caja: true });
        texto(g, 'acuaporinas', (this.puertas[1].x + this.puertas[2].x) / 2, (this.dunaArriba(W * 0.52) + this.dunaAbajo(W * 0.52)) / 2 + 3.5, { size: 9 * s, color: C.dim, align: 'center', italic: true, peso: '600' });
        if (estado.albBaja || estado.inflamacion) texto(g, 'la marisma desborda · ilustrativo', W * 0.5, H - 52 * s, { size: 9.5 * s, color: C.rojo, align: 'center', caja: true });
        if (estado.hemorragia > 0 && !compacto) texto(g, `herida · −${estado.hemorragia} %`, this.herida.x - 4 * s, H - 56 * s, { size: 9 * s, color: C.rojo, align: 'right', caja: true });
        dibujarOrina(g, { o: D.orina, W, H, rioY: x => this.rioY(x), anchoRio: this.anchoRio(), texto, rgba, C, tiempo, ocultar: ocultos.has('orina'), reducir: REDUCIR });
        if (D.relleno > 0) texto(g, 'la marisma cede agua · hasta 1 L', W * 0.5, this.rioY(W * 0.5) + this.anchoRio() + 22 * s, { size: 9 * s, color: C.verde, align: 'center', caja: true });
    },
};

/* Partículas que viajan (25 mL cada una, ilustrativo) */
const REPARTO = {   // por volumen de referencia del fluido
    glucosado: [['fuente', 'rio', 4], ['fuente', 'marisma', 10], ['fuente', 'mar', 26]],
    salino: [['fuente', 'rio', 11], ['fuente', 'marisma', 29], ['mar', 'marisma', 4]],
    ringer: [['fuente', 'rio', 8], ['fuente', 'marisma', 32]],
    plasmalyte: [['fuente', 'rio', 8], ['fuente', 'marisma', 32]],
    alb5: [['fuente', 'rio', 28], ['fuente', 'marisma', 12]],
    alb25: [['fuente', 'rio', 4], ['marisma', 'rio', 10]],
    hiper: [['fuente', 'rio', 10], ['mar', 'rio', 11], ['mar', 'marisma', 28]],
    salino3: [['fuente', 'rio', 4], ['mar', 'marisma', 5]],
    sangre: [['fuente', 'rio', 22]],
};
function lanzar(clave, ml, retraso0 = 0) {
    const f = FLUIDOS[clave]; const k = f.ref ? ml / f.ref : 1;
    const lista = [];
    for (const [de, a, n] of REPARTO[clave]) for (let i = 0; i < Math.max(1, Math.round(n * Math.min(k, 2))); i++) lista.push({ de, a });
    for (let i = lista.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
    lista.sort((p, q) => (p.de === 'fuente' ? 0 : 1) - (q.de === 'fuente' ? 0 : 1));
    let iF = 0, iO = 0;
    for (const p of lista) {
        const ret = p.de === 'fuente' ? retraso0 + (iF++) * 0.05 : retraso0 + 1.0 + (iO++) * 0.07 + Math.random() * 0.3;
        // lo que sale del mar o de la marisma es agua; lo que cae de la vasija, el fluido
        const clave2 = p.de === 'mar' || p.de === 'marisma' ? 'agua' : f.particula;
        parts.push(nueva(p.de, p.a, clave2, ret));
    }
    recortar();
}
// Lo que se va por la herida es sangre entera: hematíes (y su plasma).
function lanzarSangrado(ml) {
    const n = clamp(Math.round(ml / 40), 2, 30);
    for (let i = 0; i < n; i++) parts.push(nueva('rio', 'herida', 'rbc', i * 0.09));
    recortar();
}
function lanzarRelleno(ml) {
    const n = clamp(Math.round(ml / 40), 2, 25);
    for (let i = 0; i < n; i++) parts.push(nueva('marisma', 'rio', 'agua', i * 0.12));
    recortar();
}
function nueva(de, a, clave, espera) {
    return { de, a, clave, espera, viva: false, pts: null, seg: 0, t: 0, x: 0, y: 0, asentada: false, edad: 0,
        semilla: Math.random() * 1000, vel: 100 + Math.random() * 50 };
}
function recortar() {
    if (parts.length <= MAX_PARTS) return;
    const sobra = parts.length - MAX_PARTS;
    const asentadas = parts.filter(p => p.asentada).sort((a, b) => b.edad - a.edad);
    asentadas.slice(0, sobra).forEach(p => { p.quitar = true; });
    parts = parts.filter(p => !p.quitar);
    if (parts.length > MAX_PARTS) parts = parts.slice(parts.length - MAX_PARTS);
}
function finalizarParticulas() {
    for (const p of parts) { if (p.asentada) continue; p.viva = true; p.asentada = true; p.edad = 30; Estuario.colocar(p); }
    parts = parts.filter(p => !p.quitar);
}

/* ============================================================
   Las lupas: el corte de la orilla (vaso · intersticio · células) y una neurona.
   Muestran el mecanismo; sus cantidades son ilustrativas.
   ============================================================ */
export { rgba, pinta, texto, brillo };
export const Lupa = {
    abierta: null, parts: [], MAX: 60, S: 200, dpr: 1, el: null, cv: null, tit: null, btnX: null,
    abrir(tipo) {
        this.abierta = tipo; this.parts = []; this.acum = {};
        this.el.hidden = false; this.btnX.hidden = false; $('escena').classList.add('agv-con-lupa');
        $('lupa-orilla').setAttribute('aria-pressed', String(tipo === 'orilla'));
        $('lupa-tubo').setAttribute('aria-pressed', String(tipo === 'tubo'));
        $('lupa-neurona').setAttribute('aria-pressed', String(tipo === 'neurona'));
        this.colocar(); this.sembrar();
        if (!REDUCIR && window.Motion) {
            const z = { v: 0.2 };
            window.Motion.animate(z, { v: 1 }, { type: 'spring', stiffness: 170, damping: 18, onUpdate: () => { this.el.style.transform = `scale(${z.v})`; } });
        }
        if (REDUCIR) pintarUnaVez(); else arrancar();
    },
    cerrar() {
        this.abierta = null; this.parts = []; this.el.hidden = true; this.btnX.hidden = true; this.el.style.transform = ''; $('escena').classList.remove('agv-con-lupa');
        $('lupa-tubo').setAttribute('aria-pressed', 'false');
        $('lupa-orilla').setAttribute('aria-pressed', 'false'); $('lupa-neurona').setAttribute('aria-pressed', 'false');
        if (REDUCIR) pintarUnaVez();
    },
    colocar() {
        if (!this.abierta) return;
        // dos sitios posibles: debajo de la lectura (centrada) o a su izquierda; se elige el más grande
        const lec = $('lectura'), lw = lec.offsetWidth || 130, lb = (lec.offsetTop || 6) + (lec.offsetHeight || 80);
        const sA = Math.min(W * 0.72, H - lb - 6), sB = Math.min(H - 8, W - lw - 16);
        let S, x, y;
        if (sA >= sB) { S = Math.round(sA); x = Math.round((W - S) / 2); y = Math.round(lb + 2); }
        else { S = Math.round(sB); x = 6; y = Math.round((H - S) / 2); }
        this.S = S;
        Object.assign(this.el.style, { left: x + 'px', top: y + 'px', width: S + 'px', height: S + 'px' });
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        this.cv.width = Math.round(S * this.dpr); this.cv.height = Math.round(S * this.dpr);
        const dc = (S / 2 - 30) * 0.707;   // el «×» entero dentro del círculo, arriba a la izquierda
        Object.assign(this.btnX.style, { left: Math.round(x + S / 2 - dc - 22) + 'px', top: Math.round(y + S / 2 - dc - 22) + 'px' });
        const r = azar(31);
        this.granos = Array.from({ length: 40 }, () => ({ x: r(), y: r(), r: 0.5 + r() * 1.4 }));
        // neurona piramidal a plumilla: dendritas en árbol (2 niveles), axón con mielina, punteado del fondo
        const rama = (a, l, nivel) => ({ a, l, hijos: nivel < 2 ? [rama(a - 0.45 - r() * 0.3, l * (0.55 + r() * 0.15), nivel + 1), rama(a + 0.4 + r() * 0.3, l * (0.5 + r() * 0.15), nivel + 1)] : [] });
        this.arbol = [rama(-Math.PI / 2, 0.24, 0)];   // dendrita apical
        for (const a of [-2.55, -0.55, 2.35, 0.95, -1.75]) this.arbol.push(rama(a + (r() - 0.5) * 0.3, 0.13 + r() * 0.05, 1));
        this.punteado = Array.from({ length: 140 }, () => [r(), r(), 0.3 + r() * 0.7]);
        this.nucleoPts = Array.from({ length: 22 }, () => [r() * TAU, Math.sqrt(r())]);
        this._f = null;
    },
    flujos() {
        const f = ultimaAccion.tipo === 'fluido' ? FLUIDOS[ultimaAccion.f] : null;
        let vi = f ? f.lupa.vasoInter : 0, ic, sal = f ? f.lupa.sal : 0;
        if (estado.albBaja) vi += 0.6;
        if (estado.inflamacion) vi += 0.8;
        if (D.relleno > 0) vi -= 1;
        const ton = factorCelula();
        ic = f && Math.abs(f.lupa.interCel) > 0.1 ? f.lupa.interCel : clamp((ton - 1) * 12, -1.5, 1.5);
        if (Math.abs(ic) < 0.08) ic = 0;
        return { vi: clamp(vi, -1.6, 1.6), ic, sal, limo: f && f.lupa.limo ? f.lupa.limo : 0 };
    },
    sembrar() {
        // lo que vive siempre en la lupa: hematíes y limo en el vaso; glucosa; urea
        const S = this.S;
        if (this.abierta !== 'orilla') return;
        const yW = 0.36 * S;
        const nH = Math.round(clamp(vis.hto / 45, 0.3, 1.3) * 7);
        for (let i = 0; i < nH; i++) this.parts.push({ tipo: 'hematie', x: Math.random() * S, y: lerp(0.08 * S, yW - 8, Math.random()), fijo: true, g: Math.random() * TAU });
        const nL = (estado.albBaja ? 3 : 7) + Math.min(4, estado.infusiones.filter(i => i.f.startsWith('alb')).length * 2);
        for (let i = 0; i < nL; i++) this.parts.push({ tipo: 'limo', x: Math.random() * S, y: lerp(0.1 * S, yW - 6, Math.random()), vx: (Math.random() - 0.5) * 14, vy: (Math.random() - 0.5) * 14, fijo: true });
        const nG = Math.round(clamp((estado.glucosa - 100) / 500, 0, 1) * 8);
        for (let i = 0; i < nG; i++) this.parts.push({ tipo: 'glucosa', x: Math.random() * S, y: i % 2 ? lerp(0.1 * S, yW - 6, Math.random()) : lerp(yW + 8, 0.66 * S, Math.random()), fijo: true, g: Math.random() * TAU });
    },
    emitir(tipo, de, a, viaX, yCruce) {
        if (this.parts.length >= this.MAX) return;
        const S = this.S;
        const banda = { vaso: [0.1 * S, 0.33 * S], inter: [0.4 * S, 0.64 * S], cel: [0.74 * S, 0.9 * S] };
        const x0 = clamp(viaX + (Math.random() - 0.5) * 40, 10, S - 10);
        const y0 = lerp(...banda[de], Math.random()), y1 = lerp(...banda[a], Math.random());
        const x1 = clamp(viaX + (Math.random() - 0.5) * 50, 10, S - 10);
        this.parts.push({ tipo, pts: [[x0, y0], [viaX, yCruce], [x1, y1]], t: 0, vel: 0.55 + Math.random() * 0.3, g: Math.random() * TAU });
    },
    dibujar(dt) {
        if (this.abierta === 'tubo') return Tubo.dibujar(this, dt);
        const g = this.cv.getContext('2d'); const S = this.S;
        g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        const firma = this.abierta + '|' + S + '|' + (this.abierta === 'orilla' ? this.firmaOrilla() : this.firmaNeurona());
        if (firma !== this._f) { this._f = firma; this.pintarFijo(); }
        g.drawImage(this.fijoCv, 0, 0, S, S);
        if (this.abierta === 'orilla') this.orillaVivo(g, dt); else this.neuronaVivo(g, dt);
        g.drawImage(this.frenteCv, 0, 0, S, S);
    },
    // lo que no se mueve se pinta una vez (fondo y rótulos) y solo se repinta si cambia el estado
    pintarFijo() {
        const S = this.S, d = this.dpr;
        for (const k of ['fijoCv', 'frenteCv']) { if (!this[k]) this[k] = document.createElement('canvas'); this[k].width = Math.round(S * d); this[k].height = Math.round(S * d); }
        const f = this.fijoCv.getContext('2d'); f.setTransform(d, 0, 0, d, 0, 0); f.fillStyle = C.bg; f.fillRect(0, 0, S, S);
        const fr = this.frenteCv.getContext('2d'); fr.setTransform(d, 0, 0, d, 0, 0); fr.clearRect(0, 0, S, S);
        if (this.abierta === 'orilla') this.orillaFijo(f, fr); else this.neuronaFijo(f, fr);
        this.pie(fr);
        fr.strokeStyle = rgba(C.oro, 0.5); fr.lineWidth = 2; fr.beginPath(); fr.arc(S / 2, S / 2, S / 2 - 2, 0, TAU); fr.stroke();
    },
    pie(g) {
        const S = this.S, s = S / 200, txt = this.tit.textContent;
        g.fillStyle = rgba(C.bg, 0.86); g.fillRect(0, S * 0.8, S, S * 0.2);
        g.font = `600 ${8.6 * s}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = C.dim;
        const pal = txt.split(' '), lineas = []; let l = '';
        for (const w of pal) { const t = l ? l + ' ' + w : w; if (g.measureText(t).width > S * 0.5 && l) { lineas.push(l); l = w; } else l = t; }
        if (l) lineas.push(l);
        lineas.slice(0, 3).forEach((t, i) => g.fillText(t, S / 2, S * 0.85 + i * 10 * s));
    },
    geomOrilla() {
        const S = this.S;
        return { yW: 0.36 * S, yM: 0.69 * S, poros: [0.12, 0.32, 0.52, 0.72, 0.9].map(f => f * S), acuas: [0.24, 0.5, 0.76].map(f => f * S) };
    },
    textoOrilla(F) {
        let fr = 'La sal y el agua cruzan la orilla; el limo no.';
        if (estado.urea) fr = 'La urea cruza todas las orillas: no mueve agua.';
        else if (F.ic < -0.3) fr = 'El agua sale de las células por las compuertas.';
        else if (F.ic > 0.3) fr = 'El agua entra en las células por las compuertas.';
        else if (F.vi < -0.3) fr = 'El agua vuelve del intersticio al vaso.';
        else if (estado.inflamacion) fr = 'Inflamación: la orilla deja pasar hasta el limo.';
        else if (estado.albBaja) fr = 'Poco limo: el agua se escapa a la marisma.';
        else if (F.limo) fr = 'El limo no cruza la orilla y sujeta el agua.';
        return fr + ' · ilustrativo';
    },
    firmaOrilla() {
        const dM = clamp((vis.marisma - D.base.marisma) / 3000, -0.3, 0.6);
        this.tit.textContent = this.textoOrilla(this.flujos());
        return [Math.round(factorCelula() * 60), estado.inflamacion, estado.albBaja, Math.round(dM * 30), this.tit.textContent].join('|');
    },
    orillaFijo(g, fr) {
        const S = this.S, s = S / 200, { yW, yM, poros, acuas } = this.geomOrilla();
        const anchoPoro = (estado.inflamacion ? 9 : 4) * s;
        g.fillStyle = rgba(C.texto, 0.16); g.fillRect(0, 0, S, yW);
        const dM = clamp((vis.marisma - D.base.marisma) / 3000, -0.3, 0.6) + (estado.albBaja ? 0.15 : 0) + (estado.inflamacion ? 0.2 : 0);
        g.fillStyle = rgba(C.muted, 0.1); g.fillRect(0, yW, S, yM - yW);
        const yAgua = clamp(lerp(yM - 4, yW + 4, 0.55 + dM * 0.6), yW + 4, yM - 4);
        g.fillStyle = rgba(C.texto, 0.13); g.fillRect(0, yAgua, S, yM - yAgua);
        g.strokeStyle = rgba(C.oro, 0.45); g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= S; x += 6) g.lineTo(x, yAgua + Math.sin(x * 0.08) * 1.2); g.stroke();
        g.fillStyle = rgba(C.muted, 0.35); g.beginPath();
        for (const gr of this.granos) { const x = gr.x * S, y = lerp(yW + 6, yM - 6, gr.y); g.moveTo(x + gr.r * s, y); g.arc(x, y, gr.r * s, 0, TAU); }
        g.fill();
        g.fillStyle = rgba(C.rojo, 0.85); g.fillRect(0, yW - 3 * s, S, 6 * s);
        for (const px of poros) { g.fillStyle = C.bg; g.fillRect(px - anchoPoro / 2, yW - 3 * s, anchoPoro, 6 * s); g.fillStyle = rgba(C.texto, 0.35); g.fillRect(px - anchoPoro / 2, yW - 3 * s, anchoPoro, 6 * s); }
        g.strokeStyle = rgba(C.dim, 0.6); g.setLineDash([2, 2.5]);
        for (const d of [-2, 2]) { g.beginPath(); g.moveTo(0, yM + d); g.lineTo(S, yM + d); g.stroke(); }
        g.setLineDash([]);
        for (const ax of acuas) {
            g.fillStyle = C.bg; g.fillRect(ax - 5 * s, yM - 6 * s, 10 * s, 12 * s);
            g.fillStyle = rgba(C.oro, 0.85); g.beginPath(); g.moveTo(ax - 5 * s, yM - 6 * s); g.lineTo(ax + 5 * s, yM - 6 * s); g.lineTo(ax + 1.3 * s, yM); g.lineTo(ax + 5 * s, yM + 6 * s); g.lineTo(ax - 5 * s, yM + 6 * s); g.lineTo(ax - 1.3 * s, yM); g.closePath(); g.fill();
        }
        const sc = clamp(1 + 2.2 * (factorCelula() - 1), 0.72, 1.35);
        g.save(); g.beginPath(); g.rect(0, yM + 3, S, S - yM); g.clip();
        for (const cx of [0.18, 0.5, 0.82]) {
            const r = 0.16 * S * sc, cy = yM + 0.2 * S;
            const gc = g.createRadialGradient(cx * S - r * 0.3, cy - r * 0.3, r * 0.1, cx * S, cy, r);
            gc.addColorStop(0, rgba(C.purpura, 0.45)); gc.addColorStop(1, rgba(C.purpura, 0.18));
            g.fillStyle = gc; g.beginPath(); g.arc(cx * S, cy, r, 0, TAU); g.fill();
            g.strokeStyle = rgba(C.purpura, 0.9); g.lineWidth = 1.3; g.stroke();
            g.fillStyle = rgba(C.purpura, 0.6); g.beginPath(); g.arc(cx * S + r * 0.15, cy + r * 0.1, r * 0.25, 0, TAU); g.fill();
        }
        g.restore();
        const rot = (txt, y) => texto(fr, txt, S * 0.5, y, { size: 9.5 * s, color: C.dim, align: 'center', caja: true, italic: true });
        rot('río · plasma', 0.07 * S + 8 * s);
        rot('marisma · intersticio', yW + 16 * s);
        rot('mar · células', yM + 18 * s);
    },
    orillaVivo(g, dt) {
        const S = this.S, t = tiempo, s = S / 200, { yW, yM, poros, acuas } = this.geomOrilla();
        const F = this.flujos();
        g.lineWidth = 1; g.strokeStyle = rgba(C.oro, 0.35); g.setLineDash([6, 14]);
        for (let k = 0; k < 3; k++) {
            g.lineDashOffset = -t * (30 + k * 6);
            const y = (0.12 + k * 0.08) * S; g.beginPath(); g.moveTo(0, y); g.lineTo(S, y); g.stroke();
        }
        g.setLineDash([]);
        // emitir según los flujos
        if (!REDUCIR) {
            const ac = this.acum; const tasa = (k, v) => { ac[k] = (ac[k] || 0) + Math.abs(v) * 3.2 * dt; const n = Math.floor(ac[k]); ac[k] -= n; return n; };
            for (let i = tasa('vi', F.vi); i > 0; i--) { const px = poros[Math.floor(Math.random() * poros.length)]; F.vi > 0 ? this.emitir('gota', 'vaso', 'inter', px, yW) : this.emitir('gota', 'inter', 'vaso', px, yW); }
            for (let i = tasa('sal', F.sal); i > 0; i--) { const px = poros[Math.floor(Math.random() * poros.length)]; this.emitir('sal', 'vaso', 'inter', px, yW); }
            for (let i = tasa('ic', F.ic); i > 0; i--) { const ax = acuas[Math.floor(Math.random() * acuas.length)]; F.ic > 0 ? this.emitir('gota', 'inter', 'cel', ax, yM) : this.emitir('gota', 'cel', 'inter', ax, yM); }
            if (estado.urea) for (let i = tasa('urea', 1.2); i > 0; i--) { const sube = Math.random() < 0.5; const x = 10 + Math.random() * (S - 20); if (Math.random() < 0.5) this.emitir('urea', sube ? 'inter' : 'vaso', sube ? 'vaso' : 'inter', x, yW); else this.emitir('urea', sube ? 'cel' : 'inter', sube ? 'inter' : 'cel', x, yM); }
        }
        // mover y pintar
        for (const p of this.parts) {
            if (p.fijo) {
                if (p.tipo === 'hematie') { p.x = (p.x + dt * 22 * s) % (S + 10); pinta(g, 'rbc', p.x - 5, p.y + Math.sin(t * 2 + p.g) * 1.5, 3.4 * s, 0.9, p.g + t * 0.5); }
                else if (p.tipo === 'limo') {
                    p.x += p.vx * dt; p.y += p.vy * dt;
                    if (p.x < 6 || p.x > S - 6) p.vx *= -1;
                    if (p.y < 0.06 * S) p.vy = Math.abs(p.vy);
                    if (p.y > yW - 6 * s) {
                        if (estado.inflamacion && Math.random() < 0.004) { p.y = yW + 8 * s; p.fuera = true; }
                        else if (!p.fuera) { p.vy = -Math.abs(p.vy); p.choque = 1; }
                    }
                    if (p.fuera) { p.vy = Math.abs(p.vy) * 0.3 + 2; if (p.y > yM - 8) p.vy = -Math.abs(p.vy); }
                    pinta(g, 'alb', p.x, p.y, 2 * s, 0.95);
                    if (p.choque > 0.05) { g.strokeStyle = rgba(C.oro, p.choque); g.lineWidth = 1; g.beginPath(); g.arc(p.x, yW - 3 * s, 5 * s * (1.4 - p.choque), Math.PI, TAU); g.stroke(); p.choque -= dt * 2; }
                } else if (p.tipo === 'glucosa') pinta(g, 'glu', p.x + Math.sin(t + p.g) * 2, p.y, 3 * s, 0.85, p.g + t * 0.3);
                continue;
            }
            p.t += dt * p.vel; if (p.t >= 2) { p.muere = true; continue; }
            const seg = p.t < 1 ? 0 : 1, u = p.t - seg;
            const a = p.pts[seg], b = p.pts[seg + 1];
            const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u);
            const alfa = Math.min(1, p.t * 3, (2 - p.t) * 3);
            if (p.tipo === 'gota') pinta(g, 'agua', x, y, 2.8 * s, 0.9 * alfa);
            else if (p.tipo === 'sal') brillo(g, x, y, 2 * s, C.oro, 0.9 * alfa);
            else if (p.tipo === 'urea') pinta(g, 'urea', x, y, 2.8 * s, 0.95 * alfa, p.g);
        }
        if (this.parts.some(p => p.muere)) this.parts = this.parts.filter(p => !p.muere);
    },
    geomNeurona() { const S = this.S, sc = clamp(1 + 2.2 * (factorCelula() - 1), 0.72, 1.4); return { S, s: S / 200, cx: S * 0.5, cy: S * 0.47, sc, R: 0.12 * S * sc }; },
    firmaNeurona() {
        this.tit.textContent = `Posm efectiva ${Math.round(D.posmEf)} · tamaño exagerado, ilustrativo`;
        return [Math.round(factorCelula() * 100), estado.reloj, Math.round(D.naMed), Math.round(D.posmEf)].join('|');
    },
    neuronaFijo(g, fr) {
        const S = this.S, s = S / 200;
        const cx = S * 0.5, cy = S * 0.47;
        const ton = factorCelula();
        const sc = clamp(1 + 2.2 * (ton - 1), 0.72, 1.4);
        const R = 0.12 * S * sc;
        const tinta = rgba(C.texto, 0.9), sombra = rgba(C.texto, 0.22);
        // fondo grabado: punteado y la sal del plasma
        g.fillStyle = rgba(C.muted, 0.35);
        for (const [px, py, k] of this.punteado) g.fillRect(px * S, py * S, k * s, k * s);
        const nS = Math.round(clamp(D.naMed / 140, 0.6, 1.4) * 12);
        g.strokeStyle = rgba(C.oro, 0.55); g.lineWidth = 0.8; g.beginPath();
        for (let i = 0; i < nS; i++) { const a = i * 2.4, rr = (0.3 + (i % 5) * 0.075) * S, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.9; g.moveTo(x - 2, y); g.lineTo(x + 2, y); g.moveTo(x, y - 2); g.lineTo(x, y + 2); }
        g.stroke();
        // árbol dendrítico: cada rama, dos trazos (halo oscuro y tinta) que adelgazan
        g.lineCap = 'round';
        const pintaRama = (x0, y0, rm, w) => {
            const l = rm.l * S * (0.85 + 0.15 * sc), x1 = x0 + Math.cos(rm.a) * l, y1 = y0 + Math.sin(rm.a) * l;
            const mx = (x0 + x1) / 2 + Math.cos(rm.a + 1.57) * l * 0.08, my = (y0 + y1) / 2 + Math.sin(rm.a + 1.57) * l * 0.08;
            g.strokeStyle = rgba(C.bg, 1); g.lineWidth = w + 2.4; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(mx, my, x1, y1); g.stroke();
            g.strokeStyle = tinta; g.lineWidth = w; g.stroke();
            // espinas
            if (!rm.hijos.length) { g.lineWidth = 0.7; g.beginPath(); for (let k = 1; k < 4; k++) { const u = k / 4, xx = lerp(x0, x1, u), yy = lerp(y0, y1, u); g.moveTo(xx, yy); g.lineTo(xx + Math.cos(rm.a + 1.2) * 3 * s, yy + Math.sin(rm.a + 1.2) * 3 * s); } g.stroke(); }
            for (const h of rm.hijos) pintaRama(x1, y1, h, Math.max(0.7, w * 0.6));
        };
        for (const rm of this.arbol) pintaRama(cx + Math.cos(rm.a) * R * 0.85, cy + Math.sin(rm.a) * R * 0.85, rm, (rm === this.arbol[0] ? 3.6 : 2.6) * s * sc);
        // axón con vaina de mielina hasta el borde
        const ax0 = [cx + R * 0.25, cy + R * 0.95], ax1 = [cx + S * 0.2, S * 0.79];
        g.strokeStyle = rgba(C.bg, 1); g.lineWidth = 4.4 * s; g.beginPath(); g.moveTo(...ax0); g.lineTo(...ax1); g.stroke();
        g.strokeStyle = tinta; g.lineWidth = 1.6 * s; g.stroke();
        for (let k = 1; k <= 3; k++) {
            const u = 0.2 + k * 0.2, x = lerp(ax0[0], ax1[0], u), y = lerp(ax0[1], ax1[1], u), an = Math.atan2(ax1[1] - ax0[1], ax1[0] - ax0[0]);
            g.save(); g.translate(x, y); g.rotate(an); g.fillStyle = rgba(C.ambar, 0.25); g.strokeStyle = rgba(C.ambar, 0.9); g.lineWidth = 1;
            g.beginPath(); g.roundRect(-8 * s, -3.2 * s, 16 * s, 6.4 * s, 3 * s); g.fill(); g.stroke(); g.restore();
        }
        // soma piramidal: se redondea al hincharse y se arruga al encogerse
        const pir = clamp(1.25 - sc, 0.15, 0.6), arruga = clamp((1 - sc) * 1.2, 0, 0.25);
        const borde = k => { const a = k / 48 * TAU; const r = R * (1 + pir * Math.max(0, -Math.sin(a)) ** 3 * 0.9 - pir * 0.25 * Math.max(0, Math.sin(a)) + arruga * 0.25 * Math.sin(a * 9)); return [cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r]; };
        g.beginPath(); for (let k = 0; k <= 48; k++) g[k ? 'lineTo' : 'moveTo'](...borde(k)); g.closePath();
        g.fillStyle = rgba(C.purpura, 0.32); g.fill();
        g.fillStyle = rgba(C.texto, clamp((sc - 1) * 0.4, 0, 0.14)); g.fill();
        // sombreado a plumilla (rayado diagonal en la mitad en sombra)
        g.save(); g.clip(); g.strokeStyle = sombra; g.lineWidth = 0.7; g.beginPath();
        for (let d = -R * 2; d < R * 2; d += 3.2 * s) { if (d < -R * 0.2) continue; g.moveTo(cx + d - R, cy + R * 1.3); g.lineTo(cx + d + R * 0.6, cy - R * 0.3); }
        g.stroke(); g.restore();
        // membrana doble (se rehace el contorno: el rayado dejó otro trazo como trazo actual)
        g.beginPath(); for (let k = 0; k <= 48; k++) g[k ? 'lineTo' : 'moveTo'](...borde(k)); g.closePath();
        g.strokeStyle = tinta; g.lineWidth = 1.5 * s; g.stroke();
        g.beginPath(); for (let k = 0; k <= 48; k++) { const [x, y] = borde(k); g[k ? 'lineTo' : 'moveTo'](lerp(cx, x, 0.9), lerp(cy, y, 0.9)); } g.closePath();
        g.setLineDash([2, 3]); g.strokeStyle = rgba(C.purpura, 0.9); g.lineWidth = 0.8; g.stroke(); g.setLineDash([]);
        // núcleo punteado y nucléolo
        const rn = R * 0.36, nx = cx + R * 0.05, ny = cy + R * 0.12;
        g.beginPath(); g.arc(nx, ny, rn, 0, TAU); g.fillStyle = rgba(C.bg, 0.55); g.fill(); g.strokeStyle = tinta; g.lineWidth = 1; g.stroke();
        g.fillStyle = rgba(C.dim, 0.6); for (const [a, u] of this.nucleoPts) g.fillRect(nx + Math.cos(a) * u * rn * 0.85, ny + Math.sin(a) * u * rn * 0.85, 0.9 * s, 0.9 * s);
        g.beginPath(); g.arc(nx + rn * 0.25, ny - rn * 0.2, rn * 0.22, 0, TAU); g.fillStyle = tinta; g.fill();
        // osmolitos (hipernatremia: desde las 9 h; completo en 48 h): su forma propia de la tabla, la pajarita
        if (D.posmEf > 295 && estado.reloj !== '1h') {
            const n = estado.reloj === 'dias' ? 14 : 7;
            for (let i = 0; i < n; i++) { const a = i * 2.39, rr = R * (0.5 + (i % 3) * 0.13); pinta(g, 'osmol', cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 2.2 * s, 0.95); }
        }
        let estadoN = 'volumen normal';
        if (sc > 1.06) estadoN = 'se hincha: entra agua';
        else if (sc < 0.94) estadoN = 'se encoge: sale agua';
        if (D.posmEf > 295 && estado.reloj !== '1h') estadoN = estado.reloj === 'dias' ? 'recupera volumen: osmolitos (48 h)' : 'empieza a recuperar volumen (9 h)';
        texto(fr, estadoN, S / 2, S * 0.74, { size: 10 * s, color: sc > 1.06 ? C.rojo : C.dim, align: 'center', caja: true, italic: false, peso: '600' });
        texto(fr, 'axón', ax1[0] + 6 * s, ax1[1] - 4 * s, { size: 8.5 * s, color: C.muted });
        texto(fr, 'dendrita', cx + 8 * s, cy - R - 0.14 * S, { size: 8.5 * s, color: C.muted });
    },
    neuronaVivo(g, dt) {
        const { s, cx, cy, sc, R } = this.geomNeurona();
        // agua que entra o sale por la membrana
        if (!REDUCIR) {
            const v = clamp((sc - 1) * 6, -1.5, 1.5);
            this.acum.n = (this.acum.n || 0) + Math.abs(v) * 4 * dt;
            while (this.acum.n >= 1 && this.parts.length < 24) {
                this.acum.n -= 1; const a = Math.random() * TAU;
                const fuera = [cx + Math.cos(a) * (R + 26 * s), cy + Math.sin(a) * (R + 26 * s)], dentro = [cx + Math.cos(a) * R * 0.6, cy + Math.sin(a) * R * 0.6];
                this.parts.push({ tipo: 'gota', pts: v > 0 ? [fuera, dentro] : [dentro, fuera], t: 0, vel: 0.8 + Math.random() * 0.4 });
            }
            this.acum.n = Math.min(this.acum.n, 1);
        }
        for (const p of this.parts) {
            p.t += dt * p.vel; if (p.t >= 1) { p.muere = true; continue; }
            pinta(g, 'agua', lerp(p.pts[0][0], p.pts[1][0], p.t), lerp(p.pts[0][1], p.pts[1][1], p.t), 2.6 * s, Math.min(1, p.t * 4, (1 - p.t) * 4) * 0.95);
        }
        if (this.parts.some(p => p.muere)) this.parts = this.parts.filter(p => !p.muere);
    },
};

/* ============================================================
   Lectura viva (Na⁺ · Posm · Hto) y mareógrafos (totales, cambio y origen)
   ============================================================ */
const poner = (el, k, v) => { if (el['_' + k] !== v) { el['_' + k] = v; el[k] = v; } };
export function pintarLectura() {
    const f = estado.fijo, flecha = D.tendNa < 0 ? ' ↓' : D.tendNa > 0 ? ' ↑' : '';
    const caso = '<span class="agv-t" style="color:var(--accent-red)">del caso</span>';
    const naOrg = f.na != null ? caso : D.tendNa ? '<span class="agv-t">sin cifra</span>' : estado.na0 !== NA0 || estado.bolos3 ? '<span class="agv-t">ilustr.</span>' : '<span class="agv-t">ficha</span>';
    const q = (k, v) => ocultos.has(k) ? '?' : v;
    let h = `<span class="agv-k">Na⁺</span><b>${q('na', `${estado.bolos3 && f.na == null ? '≤' : ''}${Math.round(D.naMed)}${flecha}`)}</b>${naOrg}`;
    if (estado.glucosa > 100) h += `<span class="agv-k">corr.</span><b>${q('na', Math.round(D.naCorr))}</b><span class="agv-t">ficha</span>`;
    if (estado.pseudo) h += `<span class="agv-k">agua</span><b>${Math.round(estado.na0)}</b><span class="agv-t">ilustr.</span>`;
    h += `<span class="agv-k">Posm</span><b>${q('posm', Math.round(D.posm))}</b><span class="agv-t">ficha</span>`;
    if (estado.urea) h += `<span class="agv-k">efect.</span><b>${q('efect', Math.round(D.posmEf))}</b><span class="agv-t">ficha</span>`;
    h += `<span class="agv-k">Hto</span><b>${q('hto', `${Math.round(D.hto)} %`)}</b>${f.hto != null ? caso : '<span class="agv-t">fisiol.</span>'}`;
    h += filasLecturaOrina(D.orina, ocultos.has('orina'));
    h += '<span class="agv-pie">Ec. 35.3-35.5 · Hto = hematíes ÷ volemia</span>';
    const el = $('lectura'); el.style.gridTemplateColumns = 'auto auto auto'; poner(el, 'innerHTML', h);
    // «fórmula → números → resultado»: las cifras que ya calculó derivar() (D.posm, D.posmEf), con el mismo redondeo
    const num = `2 × ${Math.round(D.naOsm)} + ${Math.round(estado.glucosa)}/18`, l = [];
    if (!ocultos.has('posm') && !ocultos.has('na')) l.push({ titulo: 'Posm (Ec. 35.3)', formula: '2 × Na + glucosa/18 + BUN/2,8', numeros: `${num} + ${Math.round(D.bun)}/2,8`, resultado: String(Math.round(D.posm)), unidad: 'mOsm/kg', origen: 'ficha · mr-osm-calculada' + (estado.urea ? ' · BUN: ilustrativo' : '') });
    if (!ocultos.has('efect') && !ocultos.has('posm') && !ocultos.has('na')) l.push({ titulo: 'Posm efectiva (Ec. 35.4)', formula: '2 × Na + glucosa/18 (sin la urea)', numeros: num, resultado: String(Math.round(D.posmEf)), unidad: 'mOsm/kg', origen: 'ficha · mr-osm-efectiva-calc' });
    pintarFormula($('formula'), l);
}
function origenDe(c) {
    const partes = [];
    const tipos = [...new Set(estado.infusiones.map(i => i.f))];
    if (!tipos.length && !estado.hemorragia) return 'ficha · mar-tabla-10-1' + (c === 'mar' && D.marFlecha ? ' · flecha: ilustrativo' : '');
    if (tipos.length === 1) partes.push(FLUIDOS[tipos[0]].org[c]);
    else if (tipos.length > 1) partes.push('suma de fluidos · tabla de abajo');
    if ((estado.hemorragia && c === 'rio') || (D.relleno && c !== 'mar')) partes.push('ficha · mc-hemorragico-clasificacion');
    if (D.proporcional) partes.push('proporcional: ilustrativo');
    if (c === 'mar' && D.marFlecha) partes.push('flecha: ilustrativo');
    return partes.filter(Boolean).join(' · ');
}
let formatoOrigen = t => t.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
// La interfaz convierte las fichas citadas en enlaces (agua-viva.js, origenHTML).
export function ponerFormatoOrigen(fn) { formatoOrigen = fn; }
export function pintarMareas() {
    for (const c of COMP) {
        const v = vis[c], d = v - D.base[c];
        const rangoTxt = D.rango.hay && c !== 'mar' && Math.abs(v - (D.base[c] + D.delta[c])) < 5
            ? `${fmtD(D.delta[c] + D.rango[c][0])} a ${fmtD(D.delta[c] + D.rango[c][1]).replace('+', '')}` : null;
        poner($('tot-' + c), 'textContent', ocultos.has(c) ? '? mL' : (D.rango.hay && c !== 'mar' ? '≈ ' : '') + fmt(v) + ' mL');
        const dl = $('dl-' + c);
        const flecha = c === 'mar' && D.marFlecha ? `${D.marFlecha > 0 ? '↑' : '↓'} sin cifra` : '';
        // el mar que se hincha o se encoge sin cifra en la ficha: «↑ sin cifra», no «±0 mL» (se leía como «no cambia»)
        const txtDl = flecha && Math.abs(d) < 0.5 ? flecha : (rangoTxt || fmtD(d)) + ' mL' + (flecha ? ' · ' + flecha : D.sinCifra[c] && Math.abs(d) < 0.5 ? ' · sin cifra' : '');
        poner(dl, 'innerHTML', ocultos.has(c) ? '?' : txtDl);
        poner(dl, 'className', 'agv-dl' + (d > 0.5 ? ' agv-sube' : d < -0.5 ? ' agv-baja' : ''));
        const o = $('org-' + c); const txt = origenDe(c); if (o._txt !== txt) { o._txt = txt; o.innerHTML = formatoOrigen(txt); }
    }
}
export function setOcultos(arr) { ocultos.clear(); (arr || []).forEach(k => ocultos.add(k)); pintarLectura(); pintarMareas(); if (!enMarcha) dibujar(); }

/* ============================================================
   Aplicar un estado nuevo al modelo: lanza lo que cambia (fluidos, sangrado,
   relleno) y deja la escena lista. Devuelve el estado anterior.
   ============================================================ */
export function aplicarModelo(nuevo, op = {}) {
    const viejo = estado; const Dv = D;
    estado = nuevo; D = derivar(estado);
    const mismoPaciente = viejo.paciente === nuevo.paciente;
    const prefijo = mismoPaciente && !op.reiniciar && viejo.infusiones.length <= nuevo.infusiones.length &&
        viejo.infusiones.every((x, i) => x.f === nuevo.infusiones[i].f && x.ml === nuevo.infusiones[i].ml);
    if (!prefijo) { parts = []; ctxT.clearRect(0, 0, W, H); flechasAlb = -1; }
    const nuevas = prefijo ? nuevo.infusiones.slice(viejo.infusiones.length) : nuevo.infusiones;
    nuevas.forEach((inf, i) => lanzar(inf.f, inf.ml, i * 0.7));
    if (nuevo.bolos3 > (prefijo ? viejo.bolos3 : 0)) { for (let i = 0; i < nuevo.bolos3 - (prefijo ? viejo.bolos3 : 0); i++) lanzar('salino3', 0, i * 0.5); ultimaAccion = { tipo: 'fluido', f: 'salino3' }; }
    if (nuevas.length) ultimaAccion = { tipo: 'fluido', f: nuevas[nuevas.length - 1].f };
    else if (!prefijo) ultimaAccion = { tipo: 'nada' };
    if (nuevas.some(x => x.f === 'alb25')) flechasAlb = tiempo + 7;
    const dS = D.perdidaSangre - (prefijo ? Dv.perdidaSangre : 0); if (dS > 1) lanzarSangrado(dS);
    const dR = D.relleno - (prefijo ? Dv.relleno : 0); if (dR > 1) lanzarRelleno(dR);
    if (!mismoPaciente || !prefijo || op.inmediato) {
        // estado nuevo (otra pregunta, otro paso, otro paciente): las cifras saltan al valor final, sin pasar por cifras intermedias
        vis.rio = D.base.rio + D.delta.rio; vis.marisma = D.base.marisma + D.delta.marisma; vis.mar = D.base.mar + D.delta.mar; vis.hto = D.hto;
    }
    if (Lupa.abierta) { Lupa.parts = []; Lupa.sembrar(); }
    pintarLectura();
    return viejo;
}
export const copiaEstado = () => copia(estado);

/* ============================================================
   Lienzo y bucle
   ============================================================ */
export function medir() {
    const ancho = lienzo.parentElement.clientWidth;
    if (!ancho) return;                       // vista oculta: se mide al mostrarse
    W = Math.round(ancho);
    H = modoEstudio() ? Math.round(clamp(W * 0.64, 200, 250)) : Math.round(clamp(W * 0.87, 270, 400));
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    lienzo.width = Math.round(W * DPR); lienzo.height = Math.round(H * DPR); lienzo.style.height = H + 'px';
    capaTinta.width = lienzo.width; capaTinta.height = lienzo.height; ctxT.setTransform(DPR, 0, 0, DPR, 0, 0);
    Estuario.camino = null;
    Estuario.layout();
    for (const p of parts) if (p.asentada) Estuario.colocar(p);
    if (parts.some(p => !p.asentada)) finalizarParticulas();
    parts = parts.filter(p => !p.quitar);
    const o = Estuario.objetivos(); for (const k in nivel) { nivel[k].v = o[k]; nivel[k].vel = 0; }
    Lupa.colocar();
    if (!enMarcha) dibujar();
}

function paso(dt) {
    tiempo += dt;
    const E = Estuario;
    if (tintaViva > tiempo && (cuadro++ % 6 === 0)) { ctxT.save(); ctxT.globalCompositeOperation = 'destination-out'; ctxT.fillStyle = rgba(C.bg, 0.22); ctxT.fillRect(0, 0, W, H); ctxT.restore(); }
    else if (tintaViva > 0 && tintaViva <= tiempo) { ctxT.clearRect(0, 0, W, H); tintaViva = -1; }
    // los valores visibles se acercan a los derivados
    const k = REDUCIR ? 1 : 1 - Math.exp(-dt * 2.2);
    vis.rio = lerp(vis.rio, D.base.rio + D.delta.rio, k);
    vis.marisma = lerp(vis.marisma, D.base.marisma + D.delta.marisma, k);
    vis.mar = lerp(vis.mar, D.base.mar + D.delta.mar, k);
    vis.hto = lerp(vis.hto, D.hto, k);
    vis.ton = lerp(vis.ton, factorCelula(), k);
    for (const c of COMP) { const obj = D.base[c] + D.delta[c]; if (Math.abs(vis[c] - obj) < 0.6) vis[c] = obj; }
    if (Math.abs(vis.hto - D.hto) < 0.05) vis.hto = D.hto;
    if (Math.abs(vis.ton - factorCelula()) < 0.002) vis.ton = factorCelula();
    for (const p of parts) {
        if (p.asentada) { p.edad += dt; E.mover(p, dt); continue; }
        if (!p.viva) { p.espera -= dt; if (p.espera > 0) continue; p.viva = true; p.pts = E.ruta(p); p.seg = 0; p.t = 0; [p.x, p.y] = p.pts[0]; }
        const pts = p.pts; const a = pts[p.seg], b = pts[p.seg + 1];
        const largo = Math.max(4, Math.hypot(b[0] - a[0], b[1] - a[1]));
        p.t += dt * p.vel * (W / 360) / largo;
        while (p.t >= 1 && !p.asentada) {
            p.t -= 1; p.seg++;
            if (p.puerta && Math.abs(pts[p.seg][0] - p.puerta.x) < 2) { p.puerta.luz = 1; p.puerta.dir = pts[p.seg + 1] && pts[p.seg + 1][1] < pts[p.seg][1] ? -1 : 1; }
            if (p.seg >= pts.length - 1) { p.x = b[0]; p.y = b[1]; p.asentada = true; p.edad = 0; E.asentar(p); if (!p.quitar && p.a !== 'herida') tinta(p.x, p.y, colorParticula(p.clave), 16, 0.14); break; }
        }
        if (p.asentada) continue;
        const i = p.seg; const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        [p.x, p.y] = cr(p0, p1, p2, p3, clamp(p.t, 0, 1));
        p.y += Math.sin(tiempo * 6 + p.semilla) * 0.6;
    }
    if (parts.some(p => p.quitar)) parts = parts.filter(p => !p.quitar);
    const o = E.objetivos(); for (const n in nivel) muelle(nivel[n], o[n], dt);
}

const fotogramas = [];
export function dibujar() {
    if (!W || !lienzo.width) return;
    const g = ctx; g.setTransform(DPR, 0, 0, DPR, 0, 0);
    Estuario.dibujar(g);
    const t = tiempo;
    for (const p of parts) {
        if (!p.viva && !p.asentada) continue;
        const viejo = p.asentada ? clamp(1 - (p.edad - 20) / 20, 0.45, 1) : 1;
        pinta(g, p.clave, p.x, p.y, 2.6, 0.95 * viejo, t * 1.5 + p.semilla);
    }
    Estuario.mareografos(g);
    pintarMareas();
}

let tPrev = 0, visible = false, enMarcha = false, cuadro = 0, quietos = 0;
function enReposo() {   // nada viaja, ningún muelle se mueve y ninguna cifra cambia: el bucle se para
    if (Lupa.abierta || tiempo < flechasAlb || tintaViva > tiempo) return false;
    if (parts.some(p => !p.asentada)) return false;
    const o = Estuario.objetivos();
    for (const k in nivel) if (Math.abs(nivel[k].vel) > 0.03 || Math.abs(nivel[k].v - o[k]) > 0.03) return false;
    for (const c of COMP) if (vis[c] !== D.base[c] + D.delta[c]) return false;
    if (vis.hto !== D.hto || vis.ton !== factorCelula()) return false;
    return !Estuario.puertas.some(p => p.luz > 0);
}
function bucle(ahora) {
    const t0 = performance.now();
    const dt = Math.min(0.05, (ahora - tPrev) / 1000); tPrev = ahora;
    paso(dt); dibujar();
    if (Lupa.abierta) Lupa.dibujar(dt);
    fotogramas.push(performance.now() - t0); if (fotogramas.length > 240) fotogramas.shift();
    quietos = enReposo() ? quietos + 1 : 0;
    if (visible && !document.hidden && !REDUCIR && quietos < 20) requestAnimationFrame(bucle); else enMarcha = false;
}
export function arrancar() {
    if (REDUCIR) { pintarUnaVez(); return; }
    quietos = 0; if (enMarcha || !visible || !W) return;
    enMarcha = true; tPrev = performance.now(); requestAnimationFrame(bucle);
}
export function pintarUnaVez() {
    vis.rio = D.base.rio + D.delta.rio; vis.marisma = D.base.marisma + D.delta.marisma; vis.mar = D.base.mar + D.delta.mar; vis.hto = D.hto; vis.ton = factorCelula();
    finalizarParticulas();
    if (!W) return;
    const o = Estuario.objetivos(); for (const k in nivel) { nivel[k].v = o[k]; nivel[k].vel = 0; }
    dibujar(); if (Lupa.abierta) Lupa.dibujar(0);
}
export function ponerVisible(v) { visible = v; if (v) arrancar(); }
export const zonaEn = (x, y) => Estuario.zona(x, y);
export const puntoDe = obj => Estuario.punto(obj);

// Para las pruebas (window.__agvPruebas): qué hace el bucle y cuánto tarda.
export function estadoBucle() {
    const a = fotogramas.slice(-120); const m = a.reduce((x, y) => x + y, 0) / (a.length || 1);
    const o = Estuario.objetivos ? Estuario.objetivos() : {};
    return {
        enMarcha, visible,
        fotogramas: { n: a.length, medio: +m.toFixed(2), max: +Math.max(0, ...a).toFixed(2) },
        particulas: { estuario: parts.length, lupa: Lupa.parts.length, maximo: MAX_PARTS + Lupa.MAX },
        porQue: { lupa: !!Lupa.abierta, flechas: tiempo < flechasAlb, tinta: tintaViva > tiempo, viajan: parts.filter(p => !p.asentada).length,
            muelles: Object.keys(nivel).filter(k => Math.abs(nivel[k].vel) > 0.03 || Math.abs(nivel[k].v - o[k]) > 0.03) },
    };
}
export function vaciarFotogramas() { fotogramas.length = 0; }

/* ============================================================
   Inicio: lee los tokens y prepara los lienzos (después de cargar los partials)
   ============================================================ */
export function initEscena({ enEstudio }) {
    REDUCIR = sinMovimiento();
    modoEstudio = enEstudio;
    const raiz = getComputedStyle(document.documentElement);
    const tok = n => raiz.getPropertyValue(n).trim();
    Object.assign(C, {
        bg: tok('--bg-main'), texto: tok('--text-main'), muted: tok('--text-muted'), dim: tok('--text-dim'),
        verde: tok('--accent-green'), rojo: tok('--accent-red'), ambar: tok('--accent-yellow'), oro: tok('--accent-blue'),
        purpura: tok('--accent-purple'),
    });
    lienzo = $('lienzo'); ctx = lienzo.getContext('2d');
    capaTinta = document.createElement('canvas'); ctxT = capaTinta.getContext('2d');
    fondo = document.createElement('canvas'); vineta = document.createElement('canvas'); paisajeCv = document.createElement('canvas');
    Object.assign(Lupa, { el: $('lupa'), cv: $('lupa-lienzo'), tit: $('lupa-tit'), btnX: $('lupa-cerrar') });
    D = derivar(estado);
    vis.rio = D.base.rio; vis.marisma = D.base.marisma; vis.mar = D.base.mar;
    return lienzo;
}
