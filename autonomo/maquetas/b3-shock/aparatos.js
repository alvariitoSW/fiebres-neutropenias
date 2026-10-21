// Los tres aparatos del soporte mecánico como objetos reales (maqueta b3-shock v2; en la app irán a
// js/modules/eco/soporte/{balon,impella,ecmo}.js). Método Anatomy con la pieza propia comun/dibujo-iso.js.
// Cada aparato tiene tres planos: «Dentro» (el corte del corazón y la aorta con el aparato funcionando, movido por el
// MISMO motor que pinta el monitor), «Despiece» (el aparato solo, desmontado en sus conjuntos, con su leyenda numerada)
// y «Recorrido» (por dónde entra y dónde queda la punta). Lo que la fuente no da («pide fuente») no se dibuja.
// El paciente va en grabado (tonos crema y sangre); la máquina, en isométrico técnico (gris cálido, una pieza en oro).
import * as I from '../comun/dibujo-iso.js';
import { montarFrente, estadoCorte } from './corazon.js';
import { crearCorazonCorte } from '../comun/corazon-corte.js';

const NS = 'http://www.w3.org/2000/svg';
const f1 = I.f1;
export const W = 360, H = 270;
const LMIN = 1000 / 60;

// ---------------------------------------------------------------- utilidades del plano de corte (y = 0)
const enPlano = (P, [x, z]) => P.iso([x, 0, z]);
const caminoPlano = (P, pts, cerrado) => I.camino(pts.map((p) => enPlano(P, p)), cerrado);
function curva2(pts, porTramo = 6) { return I.suave2(pts, porTramo); }
function desplazar2(pts, d) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1;
    const dd = typeof d === 'function' ? d(i / (pts.length - 1)) : d;
    return [p[0] + nx / l * dd, p[1] + ny / l * dd];
  });
}
const largo2 = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
function enLargo(pts, s) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (s <= l) { const t = l ? s / l : 0; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    s -= l;
  }
  return pts[pts.length - 1];
}
// sub-tramo de una polilínea entre dos distancias
function tramo(pts, s0, s1) {
  const out = [enLargo(pts, s0)]; let acc = 0;
  for (let i = 1; i < pts.length; i++) { acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (acc > s0 && acc < s1) out.push(pts[i]); }
  out.push(enLargo(pts, s1)); return out;
}

// Un vaso cortado por la mitad (la mitad de delante quitada): pared en corte con su grabado, la luz (la cara interna de
// detrás) y, si se pide, el corte transversal de un extremo (media corona: la de detrás).
function vasoCortado(P, centro, radio, grosor, { finales = [false, false] } = {}) {
  const izqI = desplazar2(centro, (t) => radio(t)), derI = desplazar2(centro, (t) => -radio(t));
  const izqE = desplazar2(centro, (t) => radio(t) + grosor), derE = desplazar2(centro, (t) => -radio(t) - grosor);
  const luz = caminoPlano(P, [...izqI, ...derI.slice().reverse()], true);
  const paredI = caminoPlano(P, [...izqE, ...izqI.slice().reverse()], true);
  const paredD = caminoPlano(P, [...derI, ...derE.slice().reverse()], true);
  let rayas = '';
  const L = largo2(centro), n = Math.max(4, Math.round(L / 4.5));
  for (const [ext, int] of [[izqE, izqI], [derE, derI]]) {
    for (let j = 1; j < n; j++) {
      const k = Math.round(j / n * (ext.length - 1)), a = ext[k], b = int[k];
      rayas += caminoPlano(P, [[a[0] + (b[0] - a[0]) * 0.2, a[1] + (b[1] - a[1]) * 0.2], [a[0] + (b[0] - a[0]) * 0.7, a[1] + (b[1] - a[1]) * 0.7]]);
    }
  }
  const intima = caminoPlano(P, izqI) + caminoPlano(P, derI);
  const adv = caminoPlano(P, izqE) + caminoPlano(P, derE);
  // extremos cortados en sección: media corona de detrás (y < 0)
  let secciones = '';
  for (const [i, k] of [[0, 0], [1, centro.length - 1]]) {
    if (!finales[i]) continue;
    const c = centro[k], q = centro[Math.max(0, Math.min(centro.length - 1, k + (i ? -1 : 1)))];
    const t = I.unit([c[0] - q[0], 0, c[1] - q[1]]), nrm = [-t[2], 0, t[0]];
    const r0 = radio(i), r1 = r0 + grosor, pts0 = [], pts1 = [];
    for (let j = 0; j <= 24; j++) { const th = Math.PI * j / 24; const e = [Math.cos(th), -Math.sin(th)]; pts0.push(P.iso([c[0] + nrm[0] * r0 * e[0], r0 * e[1], c[1] + nrm[2] * r0 * e[0]])); pts1.push(P.iso([c[0] + nrm[0] * r1 * e[0], r1 * e[1], c[1] + nrm[2] * r1 * e[0]])); }
    secciones += `<path class="pared" d="${I.camino([...pts1, ...pts0.slice().reverse()], true)}"/><path class="intima" d="${I.camino(pts0)}"/><path class="adv" d="${I.camino(pts1)}"/>`;
  }
  return { luz, paredI, paredD, rayas, intima, adv, secciones, izqI, derI, centro };
}
const svgVaso = (V, clase = 'art') => `<g class="vaso ${clase}"><path class="luz" d="${V.luz}"/>${V.secciones}<path class="pared" d="${V.paredI}"/><path class="pared" d="${V.paredD}"/>`
  + `<path class="grab" d="${V.rayas}"/><path class="intima" d="${V.intima}"/><path class="adv" d="${V.adv}"/></g>`;

// ---------------------------------------------------------------- partículas por corrientes (en pantalla)
class Corrientes {
  constructor(g, n = 90) {
    this.g = g; this.pool = []; this.rios = [];
    for (let i = 0; i < n; i++) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '1.25'); c.style.display = 'none'; g.appendChild(c); this.pool.push(c); }
  }
  rio(nombre, pts, { dens = 6, clase = 'art', r = 1.25 } = {}) {
    const L = largo2(pts), n = Math.max(1, Math.round(L / 100 * dens));
    this.rios.push({ nombre, pts, L, n, v: 0, fase: Math.random() * L, clase, r, on: 0 });
  }
  poner(nombre, v, on = 1) { for (const r of this.rios) if (r.nombre === nombre) { r.v = v; r.on = on; } }
  tick(dt) {
    let k = 0;
    for (const r of this.rios) {
      r.fase = ((r.fase + r.v * dt) % r.L + r.L) % r.L;
      for (let i = 0; i < r.n && k < this.pool.length; i++, k++) {
        const c = this.pool[k];
        if (r.on <= 0.02) { c.style.display = 'none'; continue; }
        const s = (r.fase + i * r.L / r.n) % r.L, p = enLargo(r.pts, s);
        const a = Math.min(1, s / 12, (r.L - s) / 12) * r.on;
        c.style.display = ''; c.setAttribute('cx', f1(p[0])); c.setAttribute('cy', f1(p[1])); c.setAttribute('opacity', f1(Math.max(0, a)));
        c.setAttribute('class', 'hematie ' + r.clase); c.setAttribute('r', r.r);
      }
    }
    for (; k < this.pool.length; k++) this.pool[k].style.display = 'none';
  }
}

// ---------------------------------------------------------------- la consola (máquina sobre su base, con su pantalla)
// Pantalla en el plano de la cara frontal; el texto que muestra la máquina es parte del objeto. Devuelve el SVG y los
// ids de las líneas de la pantalla.
export function consola(P, lz, { x, y, z = 0, w = 44, d = 24, h = 34, pre, lineas = 3, clase = 'p-consola', mandos = 2, asa = true }) {
  let s = '';
  const base = { x: x - 3, y: y - 3, w: w + 6, d: d + 6, r: 3 };
  const halo = I.camino(I.envolvente(I.anilloRedondeado(base, 3).map(([a, b]) => P.iso([a, b, z - 2]))), true);
  s += `<path class="iso-halo" d="${halo}"/>`;
  for (const [fx, fy] of [[base.x + 4, base.y + 4], [base.x + base.w - 4, base.y + 4], [base.x + 4, base.y + base.d - 4], [base.x + base.w - 4, base.y + base.d - 4]].sort((a, b) => P.prof([a[0], a[1], 0]) - P.prof([b[0], b[1], 0])))
    s += lz.torno(I.torno([[0, 1.9], [2.2, 1.9]], I.marco([fx, fy, z - 2.2], [0, 0, 1]), P, { pasos: 20 }), { linea: 'lo' });
  s += lz.prisma(I.caja(base, z, 3, P, { bisel: 0.6 }), { linea: 'lo' });
  const zc = z + 3, cuerpo = I.caja({ x, y, w, d, r: 2.2 }, zc, h, P, { bisel: 0.8 });
  // ranuras de ventilación en el lateral (+x) y la placa con su remache
  const lat = I.caraMatriz(P, [x + w, y + d - 2, zc + h - 4], [0, -1, 0], [0, 0, -1]);
  let ranuras = ''; for (let j = 0; j < 5; j++) ranuras += `<rect x="${3 + j * 3.6}" y="4" width="1.6" height="${h * 0.42}" rx=".8" class="ranura"/>`;
  const fr = I.caraMatriz(P, [x, y + d, zc + h], [1, 0, 0], [0, 0, -1]);
  const pw = w - 8, ph = h * 0.5;
  let pant = `<g transform="${fr}"><rect x="4" y="3.5" width="${pw}" height="${ph}" rx="1.2" class="pantalla-marco" vector-effect="non-scaling-stroke"/>`
    + `<rect x="5.2" y="4.7" width="${pw - 2.4}" height="${ph - 2.4}" rx=".8" class="pantalla"/>`;
  const ids = [];
  // la pantalla enseña una curva y unas barras (sin texto: las cifras van en la consola del monitor, legibles)
  let curva = ''; for (let i = 0; i <= 24; i++) { const t = i / 24, y = 4.7 + (ph - 2.4) * (0.62 - 0.32 * Math.exp(-(((t * 3 % 1) - 0.25) ** 2) / 0.006) - 0.1 * Math.sin(t * 18)); curva += `${i ? 'L' : 'M'}${(6.4 + (pw - 4.8) * t).toFixed(1)} ${y.toFixed(1)}`; }
  pant += `<path d="${curva}" class="pantalla-curva" vector-effect="non-scaling-stroke"/>`;
  for (let i = 0; i < 3; i++) pant += `<rect x="${7 + i * 5}" y="${4.7 + (ph - 2.4) * 0.82}" width="3.4" height="${(ph - 2.4) * 0.1}" class="pantalla-barra"/>`;
  // placa con tres líneas (texto impreso) y dos remaches
  pant += `<rect x="4" y="${h - 9}" width="${w * 0.42}" height="6" rx=".6" class="placa" vector-effect="non-scaling-stroke"/>`
    + `<path class="placa-txt" data-free="1" vector-effect="non-scaling-stroke" d="M6.5 ${h - 7.4}h${w * 0.3}M6.5 ${h - 5.9}h${w * 0.22}M6.5 ${h - 4.4}h${w * 0.26}"/>`
    + `<circle cx="5.2" cy="${h - 3.9}" r=".5" class="remache"/><circle cx="${4 + w * 0.42 - 1.2}" cy="${h - 3.9}" r=".5" class="remache"/></g>`;
  s += lz.prisma(cuerpo, { dentro: `<g transform="${lat}">${ranuras}</g>${pant}` , clase });
  // mandos moleteados en el frente (eje hacia el observador)
  for (let j = 0; j < mandos; j++) {
    const cx = x + w - 7 - j * 9, cz = zc + h * 0.24;
    const M = I.marco([cx, y + d, cz], [0, 1, 0]);
    const T = I.torno([[0, 3.1], [2.6, 3.1], [3.2, 2.6]], M, P, { pasos: 28 });
    const mol = I.rayas(M, 0.3, 2.5, 3.1, 26, P);
    const pun = I.puntoEn(M, 3.2, 2.2, 1.1), cen = I.puntoEn(M, 3.2, 0, 0);
    s += lz.torno(T, { dentro: I.lineas(mol, 'lo') + `<path class="iso-l hi" d="${I.camino([P.iso(cen), P.iso(pun)])}"/>` });
  }
  // asa: dos postes y la barra
  if (asa) {
    const zt = zc + h;
    const postes = [[x + 7, y + d / 2], [x + w - 7, y + d / 2]];
    for (const [px, py] of postes) s += lz.torno(I.torno([[0, 1.3], [7, 1.3]], I.marco([px, py, zt], [0, 0, 1]), P, { pasos: 18 }), { linea: 'lo' });
    s += lz.tubo(I.tubo([[x + 7, y + d / 2, zt + 7], [x + w - 7, y + d / 2, zt + 7]], 1.2, P, { suave: false }));
    s += I.tornillos([[x + 2.5, y + 2.5], [x + w - 2.5, y + 2.5], [x + 2.5, y + d - 2.5], [x + w - 2.5, y + d - 2.5]].map(([a, b]) => P.iso([a, b, zt])), 0.5);
  }
  return { svg: s, ids, puertoIzq: [x, y + d * 0.5, zc + h * 0.35], puertoDer: [x + w, y + d * 0.5, zc + h * 0.3], arriba: zc + h };
}

// ---------------------------------------------------------------- anatomía compartida: VI, raíz aórtica y aorta
// Plano del corte: X a la derecha, Z arriba (unidades del dibujo). Eje del aparato: de la aorta hacia el VI.
const VC = [150, 150], EJE = [-0.5, -0.866], PERP = [0.866, -0.5];
const enEje = (s, l = 0) => [VC[0] + EJE[0] * s + PERP[0] * l, VC[1] + EJE[1] * s + PERP[1] * l];
function centroAorta({ arcoHasta = 0, descHasta = -60 } = {}) {
  const pts = [];
  for (let s = 0; s >= -70; s -= 5) pts.push(enEje(s));
  const c = [enEje(-70)[0] + 40, enEje(-70)[1]];
  for (let a = 180; a >= arcoHasta; a -= 10) { const r = a * Math.PI / 180; pts.push([c[0] + 40 * Math.cos(r), c[1] + 40 * Math.sin(r)]); }
  if (arcoHasta <= 0) for (let z = c[1] - 10; z >= descHasta; z -= 10) pts.push([c[0] + 40, z]);
  return { pts, cayado: c };
}
const radioRaiz = (L) => (t) => { const s = t * L; return 15 + 4 * Math.exp(-((s - 11) ** 2) / 70) - (s < 3 ? (3 - s) * 0.6 : 0); };
const A1 = [163, 142.5], M1 = [101, 158], M2 = [131, 163];
const BASE_VI = [(A1[0] + M1[0]) / 2, (A1[1] + M1[1]) / 2];
const VV = (() => { const d = [A1[0] - M1[0], A1[1] - M1[1]], l = Math.hypot(...d); return [d[0] / l, d[1] / l]; })();
const UU = (() => { const d = [-0.45, -0.89], l = Math.hypot(...d); return [d[0] / l, d[1] / l]; })();
function cavidadVi(f = 1, n = 30) {
  const Wb = Math.hypot(A1[0] - M1[0], A1[1] - M1[1]) / 2, L = 104, out = [];
  for (let i = 0; i <= n; i++) {
    const ph = Math.PI * i / n, base = Math.min(1, Math.sin(ph) * 3);
    const w = Wb * Math.cos(ph) * (1 + (Math.pow(f, 0.9) - 1) * base), l = L * Math.pow(Math.sin(ph), 0.8) * (1 + (Math.pow(f, 0.6) - 1) * base);
    out.push([BASE_VI[0] + VV[0] * w + UU[0] * l, BASE_VI[1] + VV[1] * w + UU[1] * l]);
  }
  return out;
}
// El VI en corte: miocardio con su grabado de fibras, trabéculas, músculo papilar con sus cuerdas
function viSvg(P, f, grosor) {
  const cav = cavidadVi(f);
  const gr = (t) => grosor * (0.55 + 0.45 * Math.min(1, Math.sin(Math.PI * t) * 2.2));
  const ext = desplazar2(cav, gr);
  let fibras = '';
  for (let j = 1; j < cav.length - 1; j++) { const a = cav[j], b = ext[j]; fibras += caminoPlano(P, [[a[0] + (b[0] - a[0]) * 0.18, a[1] + (b[1] - a[1]) * 0.18], [a[0] + (b[0] - a[0]) * 0.82 + (j % 2 ? 1.2 : -1.2), a[1] + (b[1] - a[1]) * 0.82]]); }
  let trab = '';
  for (let j = 3; j < cav.length - 3; j += 2) { const a = cav[j], b = ext[j], m = [a[0] + (a[0] - b[0]) * 0.22, a[1] + (a[1] - b[1]) * 0.22]; trab += caminoPlano(P, [a, m]); }
  const k1 = Math.round(cav.length * 0.8), k0 = Math.round(cav.length * 0.75), k2 = Math.round(cav.length * 0.85);
  const pB = cav[k1], hacia = [BASE_VI[0] - pB[0], BASE_VI[1] - pB[1]], lh = Math.hypot(...hacia);
  const punta = [pB[0] + hacia[0] / lh * 19, pB[1] + hacia[1] / lh * 19];
  const pap = caminoPlano(P, curva2([cav[k0], [punta[0] - 3, punta[1] - 4], punta, [punta[0] + 2, punta[1] + 3], cav[k2]], 4), true);
  const svg = `<path class="miocardio" d="${caminoPlano(P, [...ext, ...cav.slice().reverse()], true)}"/><path class="fibras" d="${fibras}"/>`
    + `<path class="cav-luz" d="${caminoPlano(P, cav, true)}"/><path class="trab" d="${trab}"/><path class="miocardio papilar" d="${pap}"/>`
    + `<path class="endo" d="${caminoPlano(P, cav)}"/><path class="epi" d="${caminoPlano(P, ext)}"/>`;
  return { svg, punta };
}
// velos aórticos (cerrados sobre algo de radio rCierre) y mitral
function velosAorticos(P, fAo, rCierre = 0) {
  const velo = (lado) => {
    const anillo = enEje(0, lado * 15), cerr = enEje(4, lado * rCierre), abie = enEje(-15, lado * 12.5);
    const tip = [cerr[0] + (abie[0] - cerr[0]) * fAo, cerr[1] + (abie[1] - cerr[1]) * fAo];
    const vientre = [anillo[0] + (tip[0] - anillo[0]) * 0.5 - EJE[0] * 3 * (1 - fAo) + PERP[0] * lado * 2 * fAo, anillo[1] + (tip[1] - anillo[1]) * 0.5 - EJE[1] * 3 * (1 - fAo) + PERP[1] * lado * 2 * fAo];
    return caminoPlano(P, curva2([anillo, vientre, tip], 6));
  };
  const t3 = enEje(3 - 16 * fAo, 0), a3 = enEje(0, -12), b3 = enEje(0, 12);
  return {
    delante: `<path class="velo" d="${velo(1)}"/><path class="velo" d="${velo(-1)}"/>`,
    detras: `<path class="velo detras" d="${caminoPlano(P, curva2([a3, [t3[0] - PERP[0] * 4, t3[1] - PERP[1] * 4], t3, [t3[0] + PERP[0] * 4, t3[1] + PERP[1] * 4], b3], 5))}"/>`,
  };
}
function mitralSvg(P, fMit, pap) {
  const coapta = [118, 147];
  const tipA = [coapta[0] + (M2[0] - 12 - coapta[0]) * fMit, coapta[1] + (138 - coapta[1]) * fMit];
  const tipP = [coapta[0] - 2 + (M1[0] + 2 - coapta[0]) * fMit, coapta[1] - 1 + (140 - coapta[1]) * fMit];
  return `<path class="velo" d="${caminoPlano(P, curva2([M2, [M2[0] - 4, M2[1] - 10], tipA], 6))}"/>`
    + `<path class="velo" d="${caminoPlano(P, curva2([M1, [M1[0] + 6, M1[1] - 6], tipP], 6))}"/>`
    + `<path class="cuerda" d="${caminoPlano(P, [tipP, pap]) + caminoPlano(P, [tipA, pap])}"/>`;
}
function auriculaIzq(P) {
  const ai = curva2([M1, [90, 168], [92, 184], [106, 192], [124, 188], [134, 176], M2], 6);
  const vena = vasoCortado(P, curva2([[94, 182], [82, 188], [74, 190]], 4), () => 3, 1.1, { finales: [false, true] });
  return svgVaso(vena) + `<path class="cav-luz" d="${caminoPlano(P, ai, true)}"/><path class="pared-fina" d="${caminoPlano(P, desplazar2(ai, 1.8))}"/>`;
}
function coronarias(P) {
  const os = enEje(-10, 18.5);
  const cor = vasoCortado(P, curva2([os, [os[0] + 14, os[1] + 4], [os[0] + 30, os[1] - 4]], 4), () => 2.6, 1.2, { finales: [false, true] });
  const os2 = P.iso([...enEje(-12, -6).slice(0, 1), -6, enEje(-12, -6)[1]]);
  return { svg: svgVaso(cor) + `<ellipse class="ostium" cx="${f1(os2[0])}" cy="${f1(os2[1])}" rx="3.4" ry="2.2"/>`, ruta: [enEje(-2, 10), os, [os[0] + 14, os[1] + 4], [os[0] + 30, os[1] - 4]] };
}

// =====================================================================================================================
// IMPELLA · Dentro
// =====================================================================================================================
const S_VALV = 50;                    // la cánula cruza el anillo 50 por encima de la entrada
const VUELTAS_POR_LMIN = 0.45;        // vueltas por segundo del dibujo por cada L/min: muy ralentizado (rpm reales: sin fuente)
export function montarImpella(svg) {
  const az = 22, el = 24;
  const caja = [[56, 0, 30], [236, 0, 30], [56, 0, 262], [236, 0, 262], [302, 44, 30], [302, 44, 130]];
  const P = I.ajustar(caja, W, H, { pad: 2, az, el });
  const lz = new I.Lienzo('imp');
  const A = centroAorta({ arcoHasta: 70 });
  const aorta = vasoCortado(P, A.pts, radioRaiz(largo2(A.pts)), 3.2, { finales: [false, true] });
  const tronco = vasoCortado(P, curva2([[A.cayado[0] + 54 * Math.cos(2.6), A.cayado[1] + 54 * Math.sin(2.6)], [A.cayado[0] + 48 * Math.cos(2.6) - 6, A.cayado[1] + 72]], 4), () => 6, 1.6, { finales: [false, true] });
  const ent = enEje(S_VALV);
  const M = I.marco([ent[0], 0, ent[1]], [-EJE[0], 0, -EJE[1]], [0, 1, 0]);
  const pos = (s, l = 0) => I.puntoEn(M, s, l, 0);
  const tornoS = (perfil) => I.torno(perfil, M, P, { pasos: 56 });
  const R = { ent: 4.4, can: 4.2, jau: 4.7, mot: 5.1 };
  const Tent = tornoS([[0, 2.6], [1.5, 3.9], [3, R.ent], [15, R.ent]]), Tcan = tornoS([[15, R.can], [56, R.can]]);
  const Tjau = tornoS([[56, R.jau], [69, R.jau]]), Tmot = tornoS([[69, 4.8], [70, R.mot], [89, R.mot], [92, 4.0], [96, 2.2]]);
  const base = Math.atan2(I.pto(M.v, P.V), I.pto(M.u, P.V));
  const ranuras = (s0, s1, r, n, fase, w = 0.42) => {
    let d = ''; for (let j = 0; j < n; j++) {
      const th = fase + (j / n) * 2 * Math.PI; if (Math.cos(th - base) < 0.25) continue;
      const pts = [];
      for (let k = 0; k <= 8; k++) pts.push(P.iso(I.puntoEn(M, s0 + (s1 - s0) * k / 8, r, th - w / 2)));
      for (let k = 8; k >= 0; k--) pts.push(P.iso(I.puntoEn(M, s0 + (s1 - s0) * k / 8, r, th + w / 2)));
      d += I.camino(pts, true);
    }
    return d;
  };
  const ventanas = ranuras(4, 13, R.ent + 0.02, 4, 0.4), huecos = ranuras(57.5, 67.5, R.jau + 0.02, 6, 0.1, 0.62);
  const rutaCat = [pos(96), ...A.pts.filter((p, i) => i > 9).map(([x, z]) => [x - 2, 0, z]), [A.cayado[0] + 40 * Math.cos(1.1) + 6, 0, A.cayado[1] + 40 * Math.sin(1.1) + 8]];
  const Tcat = I.tubo(rutaCat, 2.0, P);
  const pg = [];
  for (let k = 0; k <= 26; k++) { const t = k / 26, a = Math.PI * 0.2 + t * Math.PI * 1.75, r = 8.5 - 3.2 * t; pg.push([ent[0] + EJE[0] * 9 + r * Math.cos(a) - 6, 0.2, ent[1] + EJE[1] * 9 + r * Math.sin(a) - 2]); }
  const Tpig = I.tubo([pos(0), pos(-4), ...pg], 1.5, P);
  const cons = consola(P, lz, { x: 244, y: 16, z: 34, w: 56, d: 26, h: 40, pre: 'imp-c', lineas: 3 });
  const cor = coronarias(P);

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<g class="iso">
    <g>${auriculaIzq(P)}</g>
    <g id="imp-vi"></g>
    ${svgVaso(tronco)}${svgVaso(aorta)}
    <g>${cor.svg}</g>
    <g id="imp-velos-detras"></g><g id="imp-mitral"></g>
    <g id="imp-rios-detras"></g>
    <g id="imp-velos"></g>
    <g class="aparato">
      ${lz.tubo(Tpig, { clase: 'p-pigtail' })}
      ${lz.torno(Tent, { clase: 'p-entrada', dentro: `<path class="hueco" d="${ventanas}"/>` })}
      ${lz.torno(Tcan, { clase: 'p-canula', dentro: `<path class="iso-l faint" d="${I.arco(M, 30, R.can, P)}"/>` })}
      ${lz.torno(Tjau, { clase: 'p-jaula lit', familia: 'iso', dentro: `<path class="hueco" d="${huecos}"/><g id="imp-rotor"></g>` })}
      ${lz.torno(Tmot, { clase: 'p-motor', dentro: `<path class="iso-l faint" d="${I.arco(M, 74, R.mot, P) + I.arco(M, 84, R.mot, P)}"/>` })}
      ${lz.tubo(Tcat, { clase: 'p-cateter' })}
    </g>
    <g id="imp-rios"></g>
    <g class="maquina">${cons.svg}</g>
  </g>`;
  svg.querySelector('.iso').insertAdjacentHTML('afterbegin', lz.defsSvg());
  const rios = new Corrientes(svg.querySelector('#imp-rios'), 110), riosD = new Corrientes(svg.querySelector('#imp-rios-detras'), 40);
  const toS = (pts) => pts.map((p) => p.length === 3 ? P.iso(p) : enPlano(P, p));
  for (const [l, ds] of [[-12, 0], [12, 3], [-18, 6]]) rios.rio('entra', toS([[ent[0] + PERP[0] * l + EJE[0] * 14, ent[1] + PERP[1] * l + EJE[1] * 14], [ent[0] + PERP[0] * l * 0.5 - EJE[0] * (6 + ds), ent[1] + PERP[1] * l * 0.5 - EJE[1] * (6 + ds)], pos(8 + ds, R.ent)]), { dens: 8 });
  for (const l of [-8, 0, 8]) rios.rio('sale', toS([pos(62, l * 0.6), ...A.pts.slice(3).map(([x, z]) => [x + PERP[0] * l * 0.9, z + PERP[1] * l * 0.9])]), { dens: 5 });
  for (const l of [-10, 10]) riosD.rio('nativo', toS([enEje(40, l * 0.6), enEje(0, l), enEje(-30, l), enEje(-62, l * 0.8)]), { dens: 6 });
  for (const l of [-14, 14]) riosD.rio('llena', toS([[M1[0] + 14, M1[1] + 30], [M1[0] + 16, M1[1] + 4], [BASE_VI[0] - 6 + l * 0.3, BASE_VI[1] - 30]]), { dens: 6 });

  const st = { fAo: 0, fMit: 1, f: 1, fase: 0 };
  const g = (id) => svg.querySelector('#' + id);
  const rotor = g('imp-rotor');
  function pintarRotor(fase) {
    const a = I.aspas(M, 57, 68, 1.4, R.jau - 0.4, 0.5, fase, 3, P, 14);
    rotor.innerHTML = `<clipPath id="imp-clip"><path d="${huecos}"/></clipPath><g clip-path="url(#imp-clip)"><path class="rotor-fondo" d="${huecos}"/><path class="aspa detras" d="${a.detras}"/><path class="aspa" d="${a.delante}"/></g>`;
  }
  function pintar(f, fAo, fMit) {
    const vi = viSvg(P, f, 11 / Math.max(0.8, f));
    g('imp-vi').innerHTML = vi.svg;
    const v = velosAorticos(P, fAo, R.can + 0.5);
    g('imp-velos').innerHTML = v.delante; g('imp-velos-detras').innerHTML = v.detras;
    g('imp-mitral').innerHTML = mitralSvg(P, fMit, vi.punta);
  }
  pintar(1, 0, 1); pintarRotor(0);
  function actualizar(cab, dt, quieto, info) {
    const s = cab.m.s, on = info.on;
    const edv = cab.lectura?.u?.edv || 120;
    const f = Math.max(0.6, Math.min(1.15, Math.cbrt(s.vvi / 150)));
    st.f = quieto ? Math.cbrt(edv / 150) : I.seguir(st.f, f, dt, 0.04);
    st.fAo = quieto ? 0 : I.seguir(st.fAo, s.vAo ? 1 : 0, dt, 0.03);
    st.fMit = quieto ? 1 : I.seguir(st.fMit, s.vMit ? 1 : 0, dt, 0.03);
    pintar(st.f, st.fAo, st.fMit);
    if (on && !quieto) st.fase += dt * 2 * Math.PI * VUELTAS_POR_LMIN * (cab.st.qImpObj / LMIN);
    pintarRotor(st.fase);
    const q = on ? cab.st.qImp / LMIN : 0;
    rios.poner('entra', q * 7, on && q > 0.05 ? 1 : 0); rios.poner('sale', q * 10, on && q > 0.05 ? 1 : 0);
    riosD.poner('nativo', Math.max(0, s.qAo) * 0.1, s.vAo && s.qAo > 5 ? 1 : 0);
    riosD.poner('llena', Math.max(0, s.qMit) * 0.08, s.vMit && s.qMit > 5 ? 1 : 0);
    if (!quieto) { rios.tick(dt); riosD.tick(dt); }
  }
  return { actualizar };
}
const coma = (x, d = 0) => (+x).toFixed(d).replace('.', ',');

// =====================================================================================================================
// BALÓN DE CONTRAPULSACIÓN · Dentro (la aorta torácica tumbada a lo largo del plano: la cabeza a la izquierda)
// =====================================================================================================================
export function montarBalon(svg) {
  const az = 20, el = 26;
  // línea central de la aorta en el plano (X: de la cabeza a los pies; Z: de detrás adelante)
  const centro = curva2([[60, 70], [50, 86], [34, 101], [14, 109], [-8, 103], [-24, 86], [-30, 64], [-24, 46]], 6)
    .concat([[-14, 40.5], [40, 34.8], [100, 28.5], [160, 22.2], [220, 15.9], [280, 9.6], [312, 6.2]]);
  const L = largo2(centro);
  const radio = (t) => { const s = t * L; return s < 14 ? 15 + 3.5 * Math.exp(-((s - 9) ** 2) / 30) : Math.max(8.5, 15 - (s - 14) * 0.02); };
  const caja = [[-60, 0, 0], [312, 0, 0], [-60, 0, 128], [312, 0, 128], [210, 30, 150], [300, 30, 150]];
  const P = I.ajustar(caja, W, H, { pad: 2, az, el });
  const lz = new I.Lienzo('iab');
  const aorta = vasoCortado(P, centro, radio, 2.6, { finales: [false, true] });
  // troncos del cayado y renales (estas, como ostia en la pared de detrás)
  const sAp = (s) => enLargo(centro, s);
  // tronco braquiocefálico, carótida izquierda y subclavia izquierda: salen de la cara craneal del cayado
  const troncos = [[[-6, 104], [-14, 122], [-24, 136], 6.0], [[-20, 92], [-36, 104], [-50, 112], 4.6], [[-27, 74], [-44, 80], [-60, 82], 4.4]].map(([a, b2, c, r]) =>
    vasoCortado(P, curva2([a, b2, c], 4), () => r, 1.4, { finales: [false, true] }));
  const sRen = L - 118, ren = [sAp(sRen), sAp(sRen + 6)];
  // la raíz: velos y coronaria (en el sistema propio de la raíz: eje hacia arriba a la izquierda)
  const VB = [60, 70], DA = I.unit([-0.55, 0, 0.83]);
  const raiz = (s, l) => [VB[0] - DA[0] * s + DA[2] * l, VB[1] - DA[2] * s - DA[0] * l];
  // balón: de justo por debajo de la subclavia izquierda (s ≈ 112) hacia los pies, 150 de largo
  // la descendente empieza (recta) en el último punto del cayado; la punta, algo más allá: «justo por debajo» de la
  // subclavia izquierda (p. 45)
  let sDesc = 0; { let acc = 0; for (let i = 1; i < centro.length; i++) { acc += Math.hypot(centro[i][0] - centro[i - 1][0], centro[i][1] - centro[i - 1][1]); if (centro[i][0] === -14) { sDesc = acc; break; } } }
  const s0 = sDesc + 2, s1 = s0 + 150, cB = tramo(centro, s0, s1);
  const Mb = I.marco([cB[0][0], 0, cB[0][1]], [cB[cB.length - 1][0] - cB[0][0], 0, cB[cB.length - 1][1] - cB[0][1]], [0, 1, 0]);
  const LB = Math.hypot(cB[cB.length - 1][0] - cB[0][0], cB[cB.length - 1][1] - cB[0][1]);
  const rutaCat = [...tramo(centro, s1 - 4, L)].map(([x, z]) => [x, 0, z]);
  const Tcat = I.tubo(rutaCat, 1.6, P, { suave: false });
  const Tvas = I.torno([[-3, 0.9], [LB + 3, 0.9]], Mb, P, { pasos: 20 });       // la luz central por dentro del balón
  const cons = consola(P, lz, { x: 214, y: 30, z: 100, w: 50, d: 24, h: 38, pre: 'iab-c', lineas: 3 });
  // bombona de helio con su manómetro (sin cifras: la presión, sin fuente)
  const bx = 282, by = 40, bz = 100;
  const Mbot = I.marco([bx, by, bz], [0, 0, 1]);
  const bombona = I.torno([[0, 6], [26, 6], [29, 5], [31, 3], [33, 2], [36, 2]], Mbot, P, { pasos: 40 });
  const Mman = I.marco([bx, by + 2, bz + 39], [0, 1, 0]);
  const man = I.torno([[0, 5.2], [2, 5.2], [2.4, 4.6]], Mman, P, { pasos: 36 });
  const svgMan = (ang) => {
    let ticks = '';
    for (let j = 0; j <= 10; j++) { const a = -2.2 + 4.4 * j / 10; const r0 = 4.0, r1 = j % 5 ? 3.3 : 2.8; ticks += I.camino([P.iso(I.puntoEn(Mman, 2.42, r0, a + Math.PI / 2)), P.iso(I.puntoEn(Mman, 2.42, r1, a + Math.PI / 2))]); }
    return `<path class="iso-l lo" d="${ticks}"/><path class="iso-l hi" d="${I.camino([P.iso(I.puntoEn(Mman, 2.44, 0, 0)), P.iso(I.puntoEn(Mman, 2.44, 3.6, ang + Math.PI / 2))])}"/>`;
  };
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const cor = vasoCortado(P, curva2([raiz(-8, 17.5), raiz(-4, 30), raiz(-12, 44)], 4), () => 2.6, 1.2, { finales: [false, true] });
  const tsvi = vasoCortado(P, curva2([raiz(34, 0), raiz(14, 0), raiz(0, 0)], 4), () => 14.5, 6, { finales: [true, false] });
  svg.innerHTML = `<g class="iso">
    <g class="vi-tracto">${svgVaso(tsvi)}</g>
    ${troncos.map((t) => svgVaso(t)).join('')}${svgVaso(aorta)}${svgVaso(cor)}
    ${ren.map((p, i) => { const q = enPlano(P, [p[0] + (i ? 6 : -6), p[1]]); return `<ellipse class="ostium" cx="${f1(q[0])}" cy="${f1(q[1])}" rx="2.6" ry="1.7"/>`; }).join('')}
    <g id="iab-velos"></g>
    <g id="iab-rios-detras"></g>
    <g class="aparato">${lz.tubo(Tcat, { clase: 'p-cateter' })}${lz.torno(Tvas, { clase: 'p-cateter' })}<g id="iab-balon"></g></g>
    <g id="iab-rios"></g>
    <g class="maquina">${lz.tubo(I.tubo([[cons.puertoDer[0], cons.puertoDer[1], cons.puertoDer[2]], [272, 40, 112], [276, 30, 70], [300, 0, 40], [320, 0, 30]], 1.3, P), { clase: 'p-linea', familia: 'helio' })}
      ${cons.svg}${lz.torno(bombona, { clase: 'p-bombona', dentro: `<path class="iso-l faint" d="${I.arco(Mbot, 8, 6, P) + I.arco(Mbot, 20, 6, P)}"/>` })}
      ${lz.torno(man, { clase: 'p-manometro', dentro: svgMan(0.6) })}</g>
  </g>`;
  svg.querySelector('.iso').insertAdjacentHTML('afterbegin', lz.defsSvg());
  const g = (id) => svg.querySelector('#' + id);
  const rios = new Corrientes(g('iab-rios'), 110), riosD = new Corrientes(g('iab-rios-detras'), 60);
  const toS = (pts) => pts.map((p) => enPlano(P, p));
  // eyección: de la raíz por el cayado hacia los pies
  for (const l of [-6, 4]) riosD.rio('eyeccion', toS(desplazar2(tramo(centro, 0, 230), l)), { dens: 5 });
  // al hincharse: hacia la raíz y las coronarias (Fig. 16.3, flechas) y hacia los pies
  const sube = tramo(centro, 2, s0 - 2).reverse();
  for (const l of [-5, 5]) rios.rio('sube', toS(desplazar2(sube, l)), { dens: 7 });
  rios.rio('coronaria', toS([raiz(-2, 6), raiz(-8, 17.5), raiz(-4, 30), raiz(-12, 44)]), { dens: 10 });
  for (const l of [-4, 4]) rios.rio('baja', toS(desplazar2(tramo(centro, s1 - 10, L), l)), { dens: 6 });
  const st = { fAo: 0, vPrev: 0 };
  function pintarBalon(v) {
    const rM = 7.6 * Math.sqrt(Math.max(0, v) / 40) + 0.95;           // radio con el volumen (40 mL = casi la luz)
    const perfil = [[0, 0.95], [6, Math.max(0.95, rM * 0.55)], [14, rM * 0.92], [24, rM], [LB - 24, rM], [LB - 12, rM * 0.9], [LB - 4, Math.max(0.95, rM * 0.5)], [LB, 0.95]];
    const T = I.torno(perfil.map(([s, r]) => [s, r]), Mb, P, { pasos: 48 });
    const lzb = new I.Lienzo('iabb');
    g('iab-balon').innerHTML = `<defs>${''}</defs>` + lzb.torno(T, { clase: 'p-balon lit', familia: 'helio', linea: 'hi', dentro: `<path class="iso-l faint" d="${I.arco(Mb, 24, rM, P) + I.arco(Mb, LB - 24, rM, P)}"/>` });
    g('iab-balon').insertAdjacentHTML('afterbegin', lzb.defsSvg());
  }
  function pintarVelos(fAo) {
    const velo = (lado) => {
      const anillo = raiz(0, lado * 15), cerr = raiz(-4, lado * 0.6), abie = raiz(-15, lado * 12.5);
      const tip = [cerr[0] + (abie[0] - cerr[0]) * fAo, cerr[1] + (abie[1] - cerr[1]) * fAo];
      return caminoPlano(P, curva2([anillo, [(anillo[0] + tip[0]) / 2 + DA[0] * 2, (anillo[1] + tip[1]) / 2 + DA[2] * 2], tip], 6));
    };
    g('iab-velos').innerHTML = `<path class="velo" d="${velo(1)}"/><path class="velo" d="${velo(-1)}"/>`;
  }
  pintarBalon(0); pintarVelos(0);
  function actualizar(cab, dt, quieto, info) {
    const s = cab.m.s, on = info.on;
    const v = on ? cab.st.vBalon : 0;
    pintarBalon(quieto ? (on ? 40 : 0) : v);
    st.fAo = quieto ? 0 : I.seguir(st.fAo, s.vAo ? 1 : 0, dt, 0.03);
    pintarVelos(st.fAo);
    const dv = (v - st.vPrev) / Math.max(1e-3, dt); st.vPrev = v;     // mL/s que entra (+) o sale (−)
    const empuja = Math.max(0, dv);
    rios.poner('sube', empuja * 0.9, empuja > 5 ? 1 : 0); rios.poner('coronaria', empuja * 0.5, empuja > 5 ? 1 : 0); rios.poner('baja', empuja * 0.7, empuja > 5 ? 1 : 0);
    riosD.poner('eyeccion', Math.max(0, s.qAo) * 0.12, s.vAo && s.qAo > 5 ? 1 : 0);
    if (!quieto) { rios.tick(dt); riosD.tick(dt); }
  }
  return { actualizar };
}

// =====================================================================================================================
// ECMO VENOARTERIAL · el circuito: el paciente de frente (el mismo grabado del «Recorrido», con su corazón en corte) y la
// máquina en su carro (isométrico). La cánula venosa sube por la femoral y la cava inferior hasta cerca de la AD; la
// arterial devuelve la sangre por la femoral y sube por la aorta al revés (p. 48). Una lupa enseña el corazón de cerca.
// =====================================================================================================================
export function montarEcmo(svg) {
  const lz = new I.Lienzo('ecm');
  // --- el paciente: el grupo de frente, escalado a la izquierda
  const FR = { x: -38, y: 0, k: 0.88 }, aG = ([x, y]) => [FR.x + x * FR.k, FR.y + y * FR.k];
  // --- la máquina: el carro con la consola y el cabezal de la bomba; el oxigenador y el calentador apoyados en el
  // carro, cada uno en su soporte (isométrico). Nada flota: cada pieza descansa en otra
  const P = I.camara({ az: 32, el: 26, k: 1.6, o: [298, 186] });
  const carro = { x: -34, y: -20, w: 64, d: 40, r: 3 };
  let maq = '';
  const ruedas = [[carro.x + 4, carro.y + 4], [carro.x + carro.w - 4, carro.y + 4], [carro.x + 4, carro.y + carro.d - 4], [carro.x + carro.w - 4, carro.y + carro.d - 4]].sort((a, b) => P.prof([a[0], a[1], 0]) - P.prof([b[0], b[1], 0]));
  maq += `<path class="iso-halo" d="${I.camino(I.envolvente(I.anilloRedondeado(carro, 3).map(([a, b]) => P.iso([a, b, -6]))), true)}"/>`;
  for (const [x, y] of ruedas) maq += lz.torno(I.torno([[0, 2.6], [2.4, 2.6]], I.marco([x - 1.2, y, -4], [1, 0, 0]), P, { pasos: 20 }), { linea: 'lo' });
  maq += lz.prisma(I.caja(carro, -2, 3, P, { bisel: 0.6 }), { linea: 'lo', k: 0.6 });
  const ox = { x: carro.x + 3, y: carro.y + 3, w: 16, d: 12, r: 1.5 };
  maq += lz.prisma(I.caja({ x: ox.x + 3, y: ox.y + 3, w: 10, d: 6, r: 1 }, 1, 4, P), { linea: 'lo', k: 0.7 });
  const oxi = I.caja(ox, 5, 18, P, { bisel: 0.5 });
  const frO = I.caraMatriz(P, [ox.x, ox.y + ox.d, 23], [1, 0, 0], [0, 0, -1]);
  let fibras = ''; for (let j = 0; j < 9; j++) fibras += `<path d="M${2 + j * 1.5} 3V15" class="fibra"/>`;
  maq += lz.prisma(oxi, { clase: 'p-oxigenador', dentro: `<g transform="${frO}"><rect x="1.4" y="2.4" width="13.2" height="13.2" rx="1" class="ventana-oxi" vector-effect="non-scaling-stroke"/><g>${fibras}</g></g>` });
  const ca = { x: carro.x + carro.w - 18, y: carro.y + 3, w: 14, d: 9, r: 1.2 };
  maq += lz.prisma(I.caja({ x: ca.x + 3, y: ca.y + 2, w: 8, d: 5, r: 1 }, 1, 4, P), { linea: 'lo', k: 0.7 });
  const cal = I.caja(ca, 5, 10, P, { bisel: 0.5 });
  const frC = I.caraMatriz(P, [ca.x, ca.y + ca.d, 15], [1, 0, 0], [0, 0, -1]);
  maq += lz.prisma(cal, { clase: 'p-calentador', dentro: `<g transform="${frC}"><rect x="1.5" y="1.6" width="11" height="6" rx=".8" class="pantalla"/><rect x="3" y="3.4" width="6.4" height="2.4" class="pantalla-barra"/></g>` });
  const cons = consola(P, lz, { x: -14, y: -2, z: 1, w: 28, d: 18, h: 18, pre: 'ecm-c', lineas: 2, mandos: 1, asa: false });
  maq += cons.svg;
  const Mb = I.marco([0, 7, cons.arriba], [0, 0, 1]);
  const cuerpoBomba = I.torno([[0, 8], [5, 8], [6, 6.5], [8, 3.2], [11, 2.2]], Mb, P, { pasos: 48 });
  maq += lz.torno(cuerpoBomba, { clase: 'p-bomba', dentro: '<g id="ecm-rodete"></g>' });
  const pBombaIn = P.iso([0, 7, cons.arriba + 11]), pBombaOut = P.iso([8, 7, cons.arriba + 3]);
  const pOxiIn = P.iso([ox.x + ox.w, ox.y + ox.d / 2, 12]), pOxiOut = P.iso([ox.x + ox.w / 2, ox.y + ox.d / 2, 23]);
  const pCalIn = P.iso([ca.x, ca.y + ca.d / 2, 11]), pCalOut = P.iso([ca.x + ca.w, ca.y + ca.d / 2, 10]);
  const pGas = P.iso([ox.x, ox.y + ox.d / 2, 18]);
  const gq = { x: carro.x + 2, y: carro.y + carro.d - 12, w: 8, d: 7, r: 1 };
  maq += lz.prisma(I.caja(gq, 1, 9, P, { bisel: 0.4 }), { clase: 'p-gas' });
  const pCaud = P.iso([gq.x + gq.w / 2, gq.y + gq.d / 2, 10]);

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<g class="iso">
    <g class="grabado" id="ecm-frente" transform="translate(${FR.x} ${FR.y}) scale(${FR.k})"></g>
    <g id="ecm-cuerpo" transform="translate(${FR.x} ${FR.y}) scale(${FR.k})"><g id="ecm-venteo"></g><g class="aparato" id="ecm-canulas"></g><g id="ecm-rios-cuerpo"></g></g>
    <g class="circuito" id="ecm-circuito"></g>
    <g class="maquina">${maq}</g>
    <g id="ecm-rios"></g>
    <g id="ecm-lupa"></g>
  </g>`;
  svg.querySelector('.iso').insertAdjacentHTML('afterbegin', lz.defsSvg());
  const g = (id) => svg.querySelector('#' + id);
  const F = montarFrente(g('ecm-frente'), { pre: 'ecmf' });
  // --- las cánulas, dentro del cuerpo (coordenadas del grupo de frente)
  const venosa = I.suave2([...F.VENA_D.slice(0, -1), ...F.vci.slice(0, -1), F.vciEntrada], 3);
  const arterial = F.IL_I.slice().reverse().slice(0, 9);
  const lzc = new I.Lienzo('ecmc');
  g('ecm-canulas').innerHTML = `<g class="p-canula-v">${lzc.tubo(I.tuboPantalla(venosa, 3.6), { familia: 'venosa' })}<circle cx="${f1(F.vciEntrada[0])}" cy="${f1(F.vciEntrada[1])}" r="2.2" class="punta-canula"/></g>`
    + `<g class="p-canula-a">${lzc.tubo(I.tuboPantalla(arterial, 3.4), { familia: 'sangre' })}<circle cx="${f1(arterial[arterial.length - 1][0])}" cy="${f1(arterial[arterial.length - 1][1])}" r="2" class="punta-canula"/></g>`;
  g('ecm-canulas').insertAdjacentHTML('afterbegin', lzc.defsSvg());
  // --- los tubos del circuito (en pantalla): de la ingle (la cánula venosa) a la bomba; del calentador a la ingle izquierda
  const hubV = aG(F.VENA_D[0]), hubA = aG(F.IL_I[F.IL_I.length - 1]);
  const tVen = I.suave2([[hubV[0], hubV[1]], [hubV[0] + 4, hubV[1] + 16], [hubV[0] + 30, 266], [214, 266], [236, 244], [240, pBombaIn[1] - 30], [pBombaIn[0] - 14, pBombaIn[1] - 34], pBombaIn], 8);
  const tPO = I.suave2([pBombaOut, [pBombaOut[0] + 10, pBombaOut[1] - 6], [pBombaOut[0] + 4, pBombaOut[1] - 26], [pOxiIn[0] + 10, pOxiIn[1] - 24], pOxiIn], 8);
  const tOC = I.suave2([pOxiOut, [pOxiOut[0] + 4, pOxiOut[1] - 22], [pCalIn[0] - 20, pCalIn[1] - 40], [pCalIn[0] - 10, pCalIn[1] - 6], pCalIn], 8);
  const tArt = I.suave2([pCalOut, [pCalOut[0] + 12, pCalOut[1] + 8], [354, 236], [342, 256], [262, 256], [hubA[0] + 24, 256], [hubA[0] + 4, hubA[1] + 12], [hubA[0], hubA[1]]], 8);
  g('ecm-circuito').innerHTML = lz.tubo(I.tuboPantalla(tVen, 4.4), { familia: 'venosa', clase: 'p-linea-v' }) + lz.tubo(I.tuboPantalla(tPO, 4.4), { familia: 'venosa', clase: 'p-linea-v' })
    + lz.tubo(I.tuboPantalla(tOC, 4.4), { familia: 'sangre', clase: 'p-linea-a' }) + lz.tubo(I.tuboPantalla(tArt, 4.4), { familia: 'sangre', clase: 'p-linea-a' })
    + lz.tubo(I.tuboPantalla(I.suave2([pGas, [pGas[0] - 10, pGas[1] + 2], [pCaud[0] - 6, pCaud[1] - 12], pCaud], 6), 1.4), { familia: 'helio', clase: 'p-gas' })
    + [hubV, hubA].map((h) => `<circle cx="${f1(h[0])}" cy="${f1(h[1])}" r="3" class="conector"/>`).join('');
  // --- la lupa: el corazón de cerca (el mismo corte, más grande), con su anillo y la línea a su sitio en el pecho
  const LU = { x: 306, y: 60, r: 50 }, corG = aG(F.vi);
  g('ecm-lupa').innerHTML = `<path class="lupa-linea" d="M${f1(corG[0] + 16)} ${f1(corG[1] - 8)} L${f1(LU.x - LU.r * 0.92)} ${f1(LU.y + LU.r * 0.3)}"/><ellipse class="lupa-marca" cx="${f1(corG[0] - 4)}" cy="${f1(corG[1] - 6)}" rx="26" ry="30"/>`
    + `<clipPath id="ecm-lupa-clip"><circle cx="${LU.x}" cy="${LU.y}" r="${LU.r - 2}"/></clipPath><circle cx="${LU.x}" cy="${LU.y}" r="${LU.r + 2}" class="lupa-aro"/>`
    + `<g clip-path="url(#ecm-lupa-clip)"><rect x="${LU.x - LU.r}" y="${LU.y - LU.r}" width="${2 * LU.r}" height="${2 * LU.r}" class="lupa-fondo"/><g class="grabado" id="ecm-corazon" transform="translate(${f1(LU.x - 128 * 0.42)} ${f1(LU.y - 118 * 0.42)}) scale(.42)"></g></g>`
    + `<text x="${LU.x}" y="${LU.y + LU.r + 13}" class="rot-g" text-anchor="middle">el corazón, de cerca</text>`;
  const corLupa = crearCorazonCorte(g('ecm-corazon'), { pre: 'ecml', rotulos: true, vci: 40, aorta: 'corta', saco: true });
  // --- la sangre: por el circuito, por la aorta al revés (desde la cánula arterial) y la que eyecta el VI
  const rios = new Corrientes(g('ecm-rios'), 130), riosC = new Corrientes(g('ecm-rios-cuerpo'), 90);
  rios.rio('ven', [...venosa.slice().reverse().map(aG), ...tVen], { dens: 3, clase: 'ven' });
  rios.rio('ven2', tPO, { dens: 6, clase: 'ven' });
  rios.rio('art', [...tOC, ...tArt], { dens: 4, clase: 'art' });
  const aortaArriba = F.aorta.slice().reverse();
  riosC.rio('retro', [...arterial, ...F.IL_I.slice().reverse().slice(9), ...aortaArriba.slice(0, Math.round(aortaArriba.length * 0.86))], { dens: 5, clase: 'art', r: 1.6 });
  riosC.rio('nativo', F.aorta.slice(0, Math.round(F.aorta.length * 0.5)), { dens: 6, clase: 'art', r: 1.6 });
  const st = { fase: 0 };
  function venteo(tipo, vB) {
    let s = '';
    const lzv = new I.Lienzo('ecmv');
    if (tipo === 'drenaje') {
      // una cánula desde la punta del VI que se une a la línea venosa (por dónde entra, la fuente no lo dice: ilustrativo)
      const ap = F.vi, une = venosa[Math.round(venosa.length * 0.62)];
      s = lzv.tubo(I.tuboPantalla(I.suave2([[ap[0] + 6, ap[1] + 10], [ap[0] + 2, ap[1] + 34], [une[0] + 18, une[1] - 6], une], 6), 2.2), { familia: 'venosa', clase: 'p-venteo' }) + `<circle cx="${f1(une[0])}" cy="${f1(une[1])}" r="2.4" class="conector"/>`;
    }
    if (tipo === 'impella') {
      const ruta = [...F.IL_D.slice().reverse(), ...F.aorta.slice().reverse(), F.valvAo, F.vi];
      s = lzv.tubo(I.tuboPantalla(I.suave2(ruta, 2), 1.6), { clase: 'p-venteo' }) + `<rect x="${f1(F.valvAo[0] - 2.6)}" y="${f1(F.valvAo[1] - 6)}" width="5.2" height="12" rx="2.6" class="rodete-mini"/>`;
    }
    if (tipo === 'balon') {
      const i0 = F.aorta.findIndex((p) => p[0] > F.subcl[0] + 2 && p[1] > F.subcl[1] + 10), tramo = F.aorta.slice(i0, i0 + Math.round(F.aorta.length * 0.32));
      const r = 1 + 3.4 * Math.sqrt(Math.max(0, vB) / 40);
      s = lzv.tubo(I.tuboPantalla(I.suave2([...F.IL_D.slice().reverse(), ...F.aorta.slice(i0 + tramo.length).reverse()], 2), 1.2), { clase: 'p-venteo' })
        + `<path class="balon-mini" d="${I.camino(tramo)}" stroke-width="${f1(2 * r)}" stroke-linecap="round" fill="none"/>`;
    }
    g('ecm-venteo').innerHTML = lzv.defsSvg() + s;
  }
  let ventPrev = '';
  function actualizar(cab, dt, quieto, info) {
    const s = cab.m.s, on = info.on;
    F.pintar(cab, dt, quieto); corLupa.pintar(estadoCorte(cab), dt, quieto);
    const q = on ? cab.st.qEcmo / LMIN : 0;
    if (on && !quieto) st.fase += dt * q * 0.9;
    // rodete visto por arriba a través de la tapa: cinco álabes que giran (ralentizado)
    let al = ''; for (let j = 0; j < 5; j++) { const a = st.fase + j * 2 * Math.PI / 5, pts = []; for (let k = 0; k <= 6; k++) { const r = 1.6 + 5.4 * k / 6, th = a + 0.8 * k / 6; pts.push(P.iso([r * Math.cos(th), 7 + r * Math.sin(th), cons.arriba + 5.2])); } al += I.camino(pts); }
    g('ecm-rodete').innerHTML = `<path class="alabe" d="${al}"/>`;
    const vt = on ? cab.ajuste.venteo : 'no', clave = vt + (vt === 'balon' ? Math.round(cab.st.vBalon / 4) : '');
    if (clave !== ventPrev) { ventPrev = clave; venteo(vt, cab.st.vBalon); }
    rios.poner('ven', q * 12, on && q > 0.05 ? 1 : 0); rios.poner('ven2', q * 8, on && q > 0.05 ? 1 : 0); rios.poner('art', q * 12, on && q > 0.05 ? 1 : 0);
    riosC.poner('retro', q * 10, on && q > 0.05 ? 1 : 0);
    riosC.poner('nativo', Math.max(0, s.qAo) * 0.12, s.vAo && s.qAo > 5 ? 1 : 0);
    if (!quieto) { rios.tick(dt); riosC.tick(dt); }
  }
  return { actualizar };
}
