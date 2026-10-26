// Geometría procedural del corazón (paso 2). Puro: devuelve piezas (triángulos)
// a partir del estado del motor; la dibujan igual WebGL y Canvas 2D.
//
// Coordenadas (mm, "corazón-local"): origen en el eje del VI sobre el plano AV;
// z hacia la base y las aurículas; x = izquierda del paciente; y = anterior.
// El ápex apunta a −z; la posición anatómica la pone el renderizador.
//
// Base del corazón (plano AV, z = 0): cada anillo valvular tiene un tamaño casi
// fijo (se contrae ~20% en sístole, el aórtico no). Las tapas del VI y del VD
// son superficies planas trianguladas con los orificios como agujeros; las
// aurículas nacen de su anillo AV, la raíz aórtica de su anillo y el
// infundíbulo del VD de su orificio, con los mismos puntos de borde (sin grietas).
// Todo ilustrativo: proporciones de anatomía general, no medidas de una fuente.

import { earcut } from './earcut.mjs';
import { PUNTOS_ABDOMEN } from './abdomen-puntos.mjs';
import { construirTorax } from './torax.mjs';

const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const mix = (a, b, t) => a + (b - a) * t;
// mm de excursión del anillo tricuspídeo lateral por mL vaciado del VD (ver «TAPSE» en mover)
export const TAPSE_POR_ML = 0.285;
const paso = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const pto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const largo = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = largo(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const lerp = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
const anguloNorm = (f) => ((f % TAU) + TAU) % TAU;
// recuerda resultados por argumento exacto (vale solo dentro de un fotograma: se crea en cada construcción)
const memo = (fn) => { const m = new Map(); return (x) => { let r = m.get(x); if (r === undefined) { r = fn(x); m.set(x, r); } return r; }; };

export const COLORES = {
  miocardio: [0.60, 0.25, 0.22], endocardio: [0.78, 0.42, 0.40], sangreOx: [0.80, 0.16, 0.14],
  sangreVen: [0.45, 0.20, 0.45], auricula: [0.66, 0.30, 0.28], arteria: [0.82, 0.22, 0.18],
  vena: [0.38, 0.30, 0.60], valva: [0.93, 0.88, 0.78], coronaria: [0.62, 0.12, 0.10],
  venaCoronaria: [0.36, 0.22, 0.42], pericardio: [0.75, 0.75, 0.85], papilar: [0.62, 0.28, 0.25],
  cuerda: [0.95, 0.92, 0.85], tapa: [0.70, 0.30, 0.28], grasa: [0.88, 0.74, 0.44],
  hueso: [0.90, 0.86, 0.76], pulmon: [0.85, 0.62, 0.60],
};

// lVi: largo del VI con 120 mL (de 78 a 80 mm al afinar el ápex, B2: con la misma pared, la bala estrecha necesita
// algo más de largo para el mismo volumen). lVdRel: el VD de Lang mide 71 ± 6 mm de base a ápex (Tabla 8, p. 20) y
// su ápex trabeculado llega cerca del ápex del VI (Mitchell 2019, p. 26); con 0,83 sale ~78 mm en el A4C del normal y ≤83 en el fallo del VI, de VI más largo (N2)
export const REF = {
  vVi: 120, lVi: 80, vMioVi: 130,
  vVd: 140, phiA: 1.15, phiB: 4.45, lVdRel: 0.83, paredVd: 4.0,
  vAi: 40, vAd: 35,
};

// Perfil del VD de la base al ápex: (1 − s^e)^p. Con 2,2 / 0,6 el VD era un tubo de lados paralelos con el ápex romo; con
// 1,5 / 0,85 se estrecha de forma casi lineal y en el A4C sale triangular, «bastante más pequeño en área» que el VI
// (Mitchell 2019, p. 26). Ilustrativo; las medidas (basal, medio, largo) se comprueban con Lang 2015 p. 20 (N2)
const PERFIL_VD = [1.5, 0.85];
// Orificio de salida del VD (z = 0) y anillo pulmonar: semiejes (mm) a tamaño normal y radio del tubo en la válvula
// pulmonar. Se eligen para que el TSVD salga en Lang 2015, p. 20 (Tabla 8): PLAX 25 ± 2,5, proximal 28 ± 3,5, distal 22 ± 2,5
const RVOT = { a: 10, b: 11.5, rP: 12 };

// ---- Perfil del VI: base casi fija (anillo) que se funde en una bala ---------
const N_BALA = 2.4, SB = 0.22, EXP_BALA = [2.0, 0.6];
// Perfil del VI desde la base (s = 0) al ápex (s = 1). Antes, (1 − s^2,3)^0,55: casi media elipse, con los lados
// paralelos hasta la mitad y un ápex romo («bala»). Ahora el VI se estrecha poco a poco desde el tercio basal y
// acaba en un ápex redondeado más estrecho (anatomía general, ilustrativo; Lang 2015 p. 6 avisa de que la forma de
// bala del método área-longitud no siempre se cumple; la relación largo/ancho normal está en su Suplemento: hueco)
const balaExacta = (s) => Math.pow(Math.max(0, 1 - Math.pow(clamp(s, 0, 1), EXP_BALA[0])), EXP_BALA[1]);
// tabla con interpolación (la bala se evalúa en cada vértice de cada fotograma)
const N_TABLA = 2048, TABLA_BALA = new Float32Array(N_TABLA + 1);
for (let i = 0; i <= N_TABLA; i++) TABLA_BALA[i] = balaExacta(i / N_TABLA);
const bala = (s) => { const x = clamp(s, 0, 1) * N_TABLA, i = Math.min(N_TABLA - 1, x | 0); return mix(TABLA_BALA[i], TABLA_BALA[i + 1], x - i); };
function perfil(z, Rb, Rm, L) {
  const s = -z / L; if (s >= 1) return 0;
  return mix(Rb, Rm * bala(s), paso(0, SB, Math.max(0, s)));
}
// Volumen del perfil con 48 cortes. Las posiciones relativas de los cortes no dependen de L, así que
// r_i = (1 − w_i)·Rb + w_i·b_i·Rm y el volumen es una cuadrática en (Rb, Rm): se precalculan las sumas.
const N_VOL = 48; let S00 = 0, S01 = 0, S11 = 0;
for (let i = 0; i < N_VOL; i++) { const sv = (i + 0.5) / N_VOL, w = paso(0, SB, sv), b = balaExacta(sv);
  S00 += (1 - w) * (1 - w); S01 += (1 - w) * w * b; S11 += w * w * b * b; }
const volPerfil = (Rb, Rm, L) => Math.PI * L / N_VOL / 1000 * (Rb * Rb * S00 + 2 * Rb * Rm * S01 + Rm * Rm * S11);   // mL
// Escala de los anillos: se contraen ~20% de diástole a sístole (ilustrativo)
const escalaAnillo = (v, v0, v1) => 0.8 + 0.2 * clamp((v - v0) / (v1 - v0), 0, 1.75);

// Tabique aplanado (formas de enfermedad): centro de la media luna del VD y medio ángulo máximo del arco que se
// aplana (~55°, ilustrativo)
export const PHI_SEPTO = (REF.phiA + REF.phiB) / 2;
// medio ángulo del tabique aplanado del todo (rad): con 1,1, el índice de excentricidad del VI llega a ~1,4 (Ryan 1985:
// 1,44 ± 0,16 en telesístole en la sobrecarga de presión; Atlas · 14). Ilustrativo
const ALFA_SEPTO = 1.1;
// Límites de la geometría: fuera de ellos el dibujo deja de seguir al motor (se avisa en la página).
export const LIMITES = { vi: [35, 320], vd: [45, 330], au: [15, 140] };
// margen del cuello de cada aurícula sobre su anillo AV (mm, ilustrativo)
const MARGEN_AU = { ai: 3, ad: 3 };
// alto / ancho de las aurículas: eje mayor / eje menor de la AD del varón en Lang 2015, p. 30 (Tabla 13): 2,4 / 1,9 cm/m².
// La AI usa la misma proporción (sus ejes están en el Suplemento de Lang, que no tenemos: hueco; ilustrativo)
const PROPORCION_AU = 2.4 / 1.9;
// mio: masa del VI respecto a la normal (formas de enfermedad, escenarios.mjs); extra: volumen que se añade al
// radio (no a la longitud) para compensar lo que el tabique aplanado le quita a la cavidad (baseGeometrica)
export function geomVi(vMotor, mio = 1, extra = 0) {
  const v = clamp(vMotor, LIMITES.vi[0], LIMITES.vi[1]), vc = v + extra;
  const L = REF.lVi * Math.pow(v / REF.vVi, 0.27);
  const Rb = 25.5 * (0.88 + 0.12 * clamp((v - 40) / 80, 0, 2));
  // Rm: raíz positiva de la cuadrática del volumen
  const k = Math.PI * L / N_VOL / 1000, a = k * S11, b = 2 * k * Rb * S01, c = k * Rb * Rb * S00 - vc;
  const Rm = Math.max(1, (-b + Math.sqrt(Math.max(0, b * b - 4 * a * c))) / (2 * a));
  // pared de volumen constante: epicardio = perfil (Rb+t, Rm+t, L+t)
  const vMio = REF.vMioVi * mio;
  let tl = 1.5, th = 30;
  for (let i = 0; i < 30; i++) { const t = (tl + th) / 2; (volPerfil(Rb + t, Rm + t, L + t) - vc) > vMio ? th = t : tl = t; }
  const t = (tl + th) / 2;
  return { L, Rb, Rm, t, Le: L + t, ReB: Rb + t, Rme: Rm + t, R: Rm, Re: Rm + t };
}

const LE_REF = geomVi(REF.vVi).Le;
// ---- Mallas genéricas -----------------------------------------------------------
// La topología de una rejilla solo depende de su tamaño: los índices se crean una vez y se reutilizan
// (el renderizador WebGL no vuelve a subirlos si el array es el mismo).
const INDICES = new Map();
function indicesRejilla(ni, nj, inv) {
  const clave = ni + 'x' + nj + (inv ? 'i' : ''); let idx = INDICES.get(clave);
  if (!idx) { idx = new Uint32Array(ni * nj * 6); let k = 0;
    for (let i = 0; i < ni; i++) for (let j = 0; j < nj; j++) { const a = i * (nj + 1) + j, b = a + nj + 1;
      if (inv) idx.set([a, a + 1, b, a + 1, b + 1, b], k); else idx.set([a, b, a + 1, a + 1, b, b + 1], k); k += 6; }
    INDICES.set(clave, idx); }
  return idx;
}
// Envolvente del saco pericárdico (ver construirCorazon): cada punto empuja los vértices del saco cercanos hasta
// su radio, con peso en rampa. Fuera de construirCorazon para que el compilador optimice este bucle caliente.
const rampa = (d, w, n) => d <= n ? 1 : d >= w ? 0 : (w - d) / (w - n);
// centro de cada fila del saco: sobre el eje a la altura de los ventrículos; corrido hacia las aurículas en la cúpula
const centroSaco = (z) => { const k = paso(0, 22, z); return [-6 * k, -4 * k]; };
function rellenarEnvolvente(env, piezas, { zTop, zBot0, dz, df, wZ, wF, NF, NP }) {
  const wj = new Float64Array(8);
  for (const pz of piezas) { const Q = pz.pos;
    for (let i = 0; i < Q.length; i += 3) {
      const z = Q[i + 2]; if (z < zBot0) continue;
      const c = centroSaco(z), x = Q[i] - c[0], y = Q[i + 1] - c[1];
      const r = Math.sqrt(x * x + y * y), f = Math.atan2(y, x);
      const i0 = Math.max(1, Math.ceil((zTop - z - wZ) / dz)), i1 = Math.min(NF - 1, Math.floor((zTop - z + wZ) / dz));
      const j0 = Math.ceil((f - wF) / df), nj = Math.floor((f + wF) / df) - j0 + 1;
      for (let a = 0; a < nj; a++) wj[a] = r * rampa(Math.abs((j0 + a) * df - f), wF, df);
      for (let fi = i0; fi <= i1; fi++) { const wz = rampa(Math.abs(zTop - fi * dz - z), wZ, dz); if (wz === 0) continue;
        const fila = fi * NP;
        for (let a = 0, j = ((j0 % NP) + NP) % NP; a < nj; a++, j = j + 1 === NP ? 0 : j + 1) { const v = wz * wj[a]; if (v > env[fila + j]) env[fila + j] = v; } }
    }
  }
}

function rejilla(ni, nj, fn) {
  const pos = new Float32Array((ni + 1) * (nj + 1) * 3);
  let k = 0;
  for (let i = 0; i <= ni; i++) for (let j = 0; j <= nj; j++) { const p = fn(i / ni, j / nj, i, j); pos[k++] = p[0]; pos[k++] = p[1]; pos[k++] = p[2]; }
  return { pos, idx: indicesRejilla(ni, nj, false), ni, nj };
}
function invertir(m) {
  if (m.ni !== undefined) { m.idx = indicesRejilla(m.ni, m.nj, true); return m; }
  const idx = m.idx; for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } return m;
}
export function tubo(puntos, radio, nSeg = 10, radioFn = null) {
  const n = puntos.length - 1;
  // marco por transporte paralelo (sin giros bruscos en las curvas)
  const T = [], A = [], B = [];
  for (let i = 0; i <= n; i++) T.push(norm(res(puntos[Math.min(n, i + 1)], puntos[Math.max(0, i - 1)])));
  let a0 = norm(cruz(T[0], Math.abs(T[0][2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
  for (let i = 0; i <= n; i++) { a0 = norm(res(a0, esc(T[i], pto(a0, T[i])))); A.push(a0); B.push(cruz(T[i], a0)); }
  return rejilla(n, nSeg, (u, v, i) => {
    const r = radioFn ? radioFn(u) : radio, th = v * TAU, p = puntos[i];
    return sum(p, sum(esc(A[i], r * Math.cos(th)), esc(B[i], r * Math.sin(th))));
  });
}
export function suave(pts, k = 6) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map(c => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
// Tapa plana (z = 0) con agujeros: contorno exterior y anillos, como listas de [x,y]
function tapa(exterior, agujeros, z = 0) {
  const d = [], ini = [];
  for (const p of exterior) d.push(p[0], p[1]);
  for (const h of agujeros) { ini.push(d.length / 2); for (const p of h) d.push(p[0], p[1]); }
  const idx = earcut(d, ini);
  const pos = new Float32Array(d.length / 2 * 3);
  for (let i = 0; i < d.length / 2; i++) { pos[i * 3] = d[i * 2]; pos[i * 3 + 1] = d[i * 2 + 1]; pos[i * 3 + 2] = z; }
  return { pos, idx: new Uint32Array(idx) };
}
/** El plano del corte ({ phi } de las opciones) con su normal (nx, ny) y d; null sin corte. */
export const planoCorte = (c) => c ? { phi: c.phi, nx: -Math.sin(c.phi), ny: Math.cos(c.phi), d: 0 } : null;
// Recorte por el plano del corte (se conserva nx·x + ny·y ≥ d)
export function recortar(m, corte) {
  if (!corte) return m;
  const { nx, ny, d } = corte;
  const nv = m.pos.length / 3, nt = m.idx.length / 3;
  const lado = new Float32Array(nv); let fuera = 0;
  for (let i = 0; i < nv; i++) { lado[i] = nx * m.pos[i * 3] + ny * m.pos[i * 3 + 1] - d; if (lado[i] < 0) fuera++; }
  if (fuera === 0) return m;                                   // entera a este lado: no se toca
  if (fuera === nv) return { pos: new Float32Array(0), idx: new Uint32Array(0) };
  const pos = new Float32Array((nv + 2 * nt) * 3); pos.set(m.pos);
  const ao = m.ao ? new Float32Array(nv + 2 * nt) : null; if (ao) ao.set(m.ao);
  const idx = new Uint32Array(nt * 6); let nP = nv, nI = 0;
  const inter = (a, b) => {
    const t = lado[a] / (lado[a] - lado[b]);
    for (let c = 0; c < 3; c++) pos[nP * 3 + c] = mix(pos[a * 3 + c], pos[b * 3 + c], t);
    if (ao) ao[nP] = mix(ao[a], ao[b], t);
    return nP++;
  };
  const v = [0, 0, 0], s = [false, false, false];
  for (let i = 0; i < m.idx.length; i += 3) {
    let n = 0; for (let c = 0; c < 3; c++) { v[c] = m.idx[i + c]; s[c] = lado[v[c]] >= 0; if (s[c]) n++; }
    if (n === 3) { idx[nI++] = v[0]; idx[nI++] = v[1]; idx[nI++] = v[2]; }
    else if (n === 0) continue;
    else if (n === 1) { const k = s.indexOf(true); const a = v[k], b = v[(k + 1) % 3], c = v[(k + 2) % 3]; const ib = inter(a, b), ic = inter(a, c); idx[nI++] = a; idx[nI++] = ib; idx[nI++] = ic; }
    else { const k = s.indexOf(false); const o = v[k], a = v[(k + 1) % 3], b = v[(k + 2) % 3]; const ia = inter(a, o), ib = inter(b, o); idx[nI++] = a; idx[nI++] = b; idx[nI++] = ia; idx[nI++] = b; idx[nI++] = ib; idx[nI++] = ia; }
  }
  return { pos: pos.slice(0, nP * 3), idx: idx.slice(0, nI), ao: ao ? ao.slice(0, nP) : undefined };
}

// ---- Valvas: tres formas a lo largo de un arco -----------------------------------
// Idea tomada de The Heart by Ultrasound (D. Ouyang, douyang/echodemo; reconstruida, no copiada): la valva no pasa de
// cerrada a abierta en línea recta, sino por tres formas (cerrada, a medio abrir y abierta) que la hacen girar sobre su
// bisagra en el anillo. Cerrada llega a la línea de coaptación K (se junta con la vecina) y se abomba contra el flujo
// (−n) con la carga; a medio abrir y abierta es una lámina de la misma longitud girada θ/2 y θ hacia n (sentido del
// flujo). Entre las tres se interpola con la parábola que pasa por ellas (Lagrange en 0, ½ y 1), así que el borde libre
// recorre casi un arco y la valva no se encoge a mitad de camino (en línea recta perdía ~15% de su longitud).
// v: { anillo(psi), psi(uu), cierre(uu), n, prof, pot, hundir, abomba, carga, thAbierta, apertura }
export function puntoValva(v, uu, vv) {
  const B = v.anillo(v.psi(uu)), K = v.cierre(uu);
  const BK = res(K, B), l = largo(BK);
  const cerr = sum(lerp(B, K, vv), esc(v.n, v.prof * Math.pow(vv, v.pot) - (v.hundir + v.abomba * v.carga) * Math.sin(Math.PI * vv)));
  const a = clamp(v.apertura, 0, 1);
  if (a === 0) return cerr;
  let w = res(BK, esc(v.n, pto(BK, v.n))); w = esc(w, 1 / (largo(w) || 1));
  const la = l * 1.05 * vv;
  const girada = (th) => sum(B, sum(esc(w, la * Math.cos(th)), esc(v.n, la * Math.sin(th))));
  const media = girada(v.thAbierta / 2), abie = girada(v.thAbierta);
  const k0 = (1 - a) * (1 - 2 * a), k1 = 4 * a * (1 - a), k2 = a * (2 * a - 1);
  return [0, 1, 2].map(c => k0 * cerr[c] + k1 * media[c] + k2 * abie[c]);
}

// ---- Construcción --------------------------------------------------------------
// estado: { vvi, vvd, vai, vad, mitral, tricus, aortica, pulmonar (0..1), liquidoPeri }
// opciones: { corte: null | { phi }, detalle, pericardio, calidad }
export function construirCorazon(estado, opciones = {}) {
  const partes = [];
  const q = opciones.calidad || 1;
  const corte = planoCorte(opciones.corte);
  // material: 1 miocardio, 2 endocardio, 3 grasa, 4 valva, 5 vaso, 6 sangre, 7 pericardio (lo usa el renderizador)
  const MAT = new Map([[COLORES.miocardio, 1], [COLORES.auricula, 1], [COLORES.tapa, 1], [COLORES.papilar, 1], [COLORES.endocardio, 2], [COLORES.grasa, 3], [COLORES.valva, 4],
    [COLORES.arteria, 5], [COLORES.vena, 5], [COLORES.coronaria, 5], [COLORES.venaCoronaria, 5], [COLORES.sangreOx, 6], [COLORES.sangreVen, 6], [COLORES.pericardio, 7]]);
  const anadir = (nombre, m, color, extra = {}) => { if (m.idx.length) partes.push({ nombre, pos: m.pos, idx: m.idx, ao: m.ao, color, mat: MAT.get(color) || 1, ...extra }); };
  // oclusión ambiental barata: un valor por vértice calculado con la posición (antes de mover la base)
  const conAO = (m, f) => { const ao = new Float32Array(m.pos.length / 3); for (let i = 0; i < ao.length; i++) ao[i] = f(m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]); m.ao = ao; return m; };
  const anadirR = (nombre, m, color, extra = {}) => anadirFiltrado(nombre, recortar(m, corte), color, extra);
  // Vista de la base (aurículas y grandes vasos retirados): solo ventrículos, raíces, válvulas y coronarias
  const RETIRADAS_BASE = ['AI', 'AD', 'AI sangre', 'AD sangre', 'Orejuela izquierda', 'Orejuela derecha', 'Vena pulmonar', 'Vena cava superior', 'Vena cava inferior', 'Aorta', 'Tronco pulmonar', 'AP derecha', 'AP izquierda', 'Seno coronario'];
  const anadirOriginal = anadir;
  const anadirFiltrado = (nombre, ...resto) => { if (opciones.vistaBase && RETIRADAS_BASE.includes(nombre)) return; anadirOriginal(nombre, ...resto); };
  const NZ = Math.round(26 * q), NP = Math.round(48 * q), NPV = Math.round(36 * q);
  const NR = Math.max(20, Math.round(40 * q));          // puntos por anillo (válvulas, aurículas, vasos)
  const phi0 = corte ? corte.phi : 0, span = corte ? Math.PI : TAU;
  const dentroCorte = (phi) => !corte || (corte.nx * Math.cos(phi) + corte.ny * Math.sin(phi) >= -1e-9);
  const geo = baseGeometrica(estado);
  const { vi, rEndoVi, rEpiVi, endoVi, epiVi, Lvd, A, ventana, Wb, wRV, tvdW, endoVd, epiVd,
    anilloMitral, mc, aM, bM, U, anilloAortico, ac, rA, anilloTricus, ct, rT, anilloRVOT, cR, aR, bR, phiR, ReB, rimRV } = geo;

  // Trabéculas: crestas que entran en la cavidad (ilustrativo). VI: finas, en el tercio apical; VD: gruesas,
  // en los dos tercios apicales (la entrada y el ápex son trabeculados; el infundíbulo es liso)
  const cresta = (a, b) => { const x = Math.max(0, Math.sin(a)), y = Math.max(0, Math.sin(b)); return x * x * x + 0.6 * y * y * y; };
  const trabVi = (z, f) => { const s = f * rEndoVi(z); return 1.0 * paso(0.45, 0.85, -z / vi.L) * cresta(0.55 * s + 0.12 * z, 0.34 * s - 0.25 * z); };
  const trabVd = (z, f) => { const s = f * (rEpiVi(z, f) + wRV(z, f)); return 1.8 * paso(0.2, 0.55, -z / Lvd) * cresta(0.42 * s + 0.15 * z, 0.26 * s - 0.3 * z + 1.3); };
  // cerca del ápex la cavidad se cierra: las trabéculas se desvanecen con el radio (si no, quedaba una "aguja")
  const endoViT = (z, f) => { const re = rEndoVi(z, f), r = Math.max(0, re - trabVi(z, f) * Math.pow(clamp(re / 7, 0, 1), 2)); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const endoVdT = (z, f) => { const re = rEpiVi(z, f), w = wRV(z, f); const r = re + Math.max(0.3 * w, w - trabVd(z, f) * clamp(w / 6, 0, 1)); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const NZe = corte ? Math.round(44 * q) : NZ, NPe = corte ? Math.round(110 * q) : NP, NPVe = corte ? Math.round(84 * q) : NPV;
  // oclusión: la cavidad se oscurece hacia el ápex; el epicardio, en los surcos interventriculares
  const aoEndoVi = (x, y, z) => 0.55 + 0.45 * Math.pow(1 - clamp(-z / vi.L, 0, 1), 0.7);
  const aoEndoVd = (x, y, z) => 0.6 + 0.4 * Math.pow(1 - clamp(-z / Lvd, 0, 1), 0.7);
  const surcoIV = (f, z) => z < -Lvd ? 0 : Math.max(Math.exp(-Math.pow((anguloNorm(f) - REF.phiA) / 0.1, 2)), Math.exp(-Math.pow((anguloNorm(f) - REF.phiB) / 0.1, 2)));
  const aoEpiVi = (x, y, z) => 1 - 0.32 * surcoIV(Math.atan2(y, x), z);
  const aoEpiVd = (x, y, z) => { const f = Math.atan2(y, x), w = wRV(z, f); return 0.7 + 0.3 * paso(0, 7, w); };

  // --- Ventrículo izquierdo ---
  const zEndo = (u) => -vi.L * (1 - Math.pow(1 - u, 1.6));
  const zEpi = (u) => -vi.Le * (1 - Math.pow(1 - u, 1.6));
  anadir('VI endocardio', conAO(invertir(rejilla(NZe, NPe, (u, v) => endoViT(zEndo(u), phi0 + v * span))), aoEndoVi), COLORES.endocardio, { dobleCara: true });
  anadir('VI epicardio', conAO(rejilla(NZ, NP, (u, v) => epiVi(zEpi(u), phi0 + v * span)), aoEpiVi), COLORES.miocardio);
  if (corte) {
    for (const ph of [phi0, phi0 + Math.PI])
      anadir('VI tapa', rejilla(NZe, 1, (u, v) => { const z = zEndo(u); return lerp(endoViT(z, ph), epiVi(z * vi.Le / vi.L, ph), v); }), COLORES.tapa, { dobleCara: true });
    anadir('VI sangre', rejilla(NZ, 1, (u, v) => { const z = zEndo(u); return lerp(endoVi(z, phi0), endoVi(z, phi0 + Math.PI), v); }), COLORES.sangreOx, { alfa: 0.55, dobleCara: true });
  }

  // --- Ventrículo derecho ---
  const spanVd = REF.phiB - REF.phiA;
  const zVd = (u) => -Lvd * (1 - Math.pow(1 - u, 1.4));
  anadirR('VD endocardio', conAO(invertir(rejilla(NZe, NPVe, (u, v) => endoVdT(zVd(u), REF.phiA + v * spanVd))), aoEndoVd), COLORES.endocardio, { dobleCara: true });
  anadirR('VD epicardio', conAO(rejilla(NZ, NPV, (u, v) => epiVd(zVd(u), REF.phiA + v * spanVd)), aoEpiVd), COLORES.miocardio);
  for (const ph of [REF.phiA, REF.phiB]) {
    if (!dentroCorte(ph)) continue;
    anadir('VD borde', rejilla(NZ, 1, (u, v) => { const z = zVd(u); return lerp(endoVd(z, ph), epiVd(z, ph), v); }), COLORES.tapa, { dobleCara: true });
  }
  if (corte) {
    for (const ph of [phi0, phi0 + Math.PI]) {
      if (ventana(ph) <= 0.001) continue;
      anadir('VD tapa', rejilla(NZe, 1, (u, v) => { const z = zVd(u); return lerp(endoVdT(z, ph), epiVd(z, ph), v); }), COLORES.tapa, { dobleCara: true });
      anadir('VD sangre', rejilla(NZ, 1, (u, v) => { const z = zVd(u); return lerp(epiVi(z, ph), endoVd(z, ph), v); }), COLORES.sangreVen, { alfa: 0.55, dobleCara: true });
    }
  }

  // --- Plano AV: tapas con los orificios ---
  const anillo2d = (f) => { const o = []; for (let k = 0; k < NR; k++) { const p = f(k / NR * TAU); o.push([p[0], p[1]]); } return o; };
  const NC = Math.round(96 * q);
  const contornoVi = []; for (let k = 0; k < NC; k++) { const f = k / NC * TAU; contornoVi.push([ReB * Math.cos(f), ReB * Math.sin(f)]); }
  anadirR('Base VI', tapa(contornoVi, [anillo2d(anilloMitral), anillo2d(anilloAortico)]), COLORES.miocardio, { dobleCara: true, mat: 2 });
  const NO = Math.round(64 * q), NI = Math.round(40 * q), contornoVd = [];
  for (let k = 0; k <= NO; k++) { const f = REF.phiA + spanVd * k / NO; const r = rimRV(f); contornoVd.push([r * Math.cos(f), r * Math.sin(f)]); }
  for (let k = NI - 1; k >= 1; k--) { const f = REF.phiA + spanVd * k / NI; contornoVd.push([ReB * Math.cos(f), ReB * Math.sin(f)]); }
  anadirR('Base VD', tapa(contornoVd, [anillo2d(anilloTricus), anillo2d(anilloRVOT)]), COLORES.miocardio, { dobleCara: true, mat: 2 });

  // Obstáculos circulares (la raíz aórtica) con un corte continuo: un rayo que pasa a menos de R del
  // centro se para en el borde; uno que pasa entre R y R + ANCHO_ROCE llega más lejos poco a poco. Con
  // un corte de sí o no, un rayo casi tangente pasaba de pararse a no pararse y la huella saltaba ~8 mm.
  const ANCHO_ROCE = 5;
  const cortarRayo = (c, d, t, obst) => {
    for (const [o, R] of obst) {
      const ox = o[0] - c[0], oy = o[1] - c[1], tc = ox * d[0] + oy * d[1];
      if (tc <= 0) continue;
      const b = Math.abs(ox * d[1] - oy * d[0]);
      if (b < R) t = Math.min(t, tc - Math.sqrt(R * R - b * b));
      else if (b < R + ANCHO_ROCE) t = Math.min(t, tc + (t - tc) * paso(R, R + ANCHO_ROCE, b));
    }
    return t;
  };
  const huella = (c, ok, rMin, obst = []) => {
    let rho = [];
    for (let k = 0; k < NR; k++) { const psi = k / NR * TAU, d = [Math.cos(psi), Math.sin(psi)]; let t = rMin(d);
      while (t < 70 && ok([c[0] + (t + 0.5) * d[0], c[1] + (t + 0.5) * d[1]])) t += 0.5;
      rho.push(Math.max(rMin(d), cortarRayo(c, d, t, obst))); }
    for (let pasada = 0; pasada < 3; pasada++) rho = rho.map((r, k) => 0.25 * rho[(k + NR - 1) % NR] + 0.5 * r + 0.25 * rho[(k + 1) % NR]);
    return rho.map((r, k) => { const psi = k / NR * TAU; return Math.max(r, rMin([Math.cos(psi), Math.sin(psi)])); });
  };
  const dentroHuella = (c, rho, p, margen = 0) => { const dx = p[0] - c[0], dy = p[1] - c[1], psi = Math.atan2(dy, dx);
    const k = ((psi / TAU) * NR % NR + NR) % NR, k0 = Math.floor(k); return Math.hypot(dx, dy) < mix(rho[k0], rho[(k0 + 1) % NR], k - k0) + margen; };
  // Hombro del infundíbulo: su base se abre hasta el borde del VD (sin repisa delante)
  const rhoInf = huella(cR, (p) => { const r = Math.hypot(p[0], p[1]), f = Math.atan2(p[1], p[0]);
    return ventana(f) > 0.02 && r > ReB + 0.5 && r < rimRV(f) - 1 && Math.hypot(p[0] - ct[0], p[1] - ct[1]) > rT + 3 && Math.hypot(p[0] - cR[0], p[1] - cR[1]) < 24; }, (d) => Math.max(aR, bR) + 3.5);
  // Descenso de la base (MAPSE): se usa al final, en «mover»; aquí ya, porque estira las aurículas (alturaAu)
  const LeTd = estado.vviTd ? geomVi(estado.vviTd, geo.mio).Le : geo.mio === 1 ? LE_REF : geomVi(REF.vVi, geo.mio).Le;
  const descenso = clamp(vi.Le - LeTd, -18, 6);
  // (el TAPSE: la pared libre del VD baja más; explicado en «mover»)
  const excVd = clamp(TAPSE_POR_ML * ((estado.vvdTd ?? REF.vVd) - estado.vvd), 0, 35);
  const extraVd = clamp(-excVd - descenso, -25, 6);
  const angTric = Math.atan2(geo.ct[1], geo.ct[0]), ReBase = geo.ReB;
  const pesoVd = (x, y, z) => {
    if (!extraVd) return 0;
    let da = Math.abs(Math.atan2(y, x) - angTric); if (da > Math.PI) da = 2 * Math.PI - da;
    const w = (1 - paso(0.7, 1.3, da)) * paso(ReBase + 2, ReBase + 18, Math.hypot(x, y));
    return w * (z < 0 ? clamp(1 + z / Lvd, 0, 1) : 1 - paso(0, 45, z));
  };
  // --- Aurículas: cúpulas sobre una "huella" en el plano AV ---
  // La huella rodea el anillo (el suelo de la aurícula es la tapa de la base, con el orificio
  // valvular) y llega hasta el surco AV, sin pisar la raíz aórtica ni la salida del VD.
  const kAu = (v, ref) => Math.pow(clamp(v, LIMITES.au[0], LIMITES.au[1]) / ref, 0.45);
  const kAi = kAu(estado.vai, REF.vAi), kAd = kAu(estado.vad, REF.vAd);
  // forma de la cúpula: a = 0 en el suelo, π/2 en el techo
  const cupulaPunto = (c, rho, H, inclin, bulto, a, psi, encoger = 0) => {
    const k = ((psi / TAU) * NR % NR + NR) % NR, k0 = Math.floor(k), f = k - k0;
    const rr = mix(rho[k0], rho[(k0 + 1) % NR], f) * Math.pow(Math.cos(a), 0.5) * (1 + bulto * Math.sin(2 * a)) - encoger;
    const s = Math.sin(a);
    return [c[0] + inclin[0] * s + rr * Math.cos(psi), c[1] + inclin[1] * s + rr * Math.sin(psi), 0.3 + (H - encoger) * Math.pow(s, 0.85)];
  };
  // Cuello: la aurícula nace de su anillo (con un margen de MARGEN_AU mm) y se ensancha por encima, en vez de
  // ocupar todo el surco AV (antes, una «torta» de ~63 mm de ancho y ~24 de alto). Anatomía general, ilustrativo.
  const cuello = (rho, anillo, m) => rho.map((r, k) => { const psi = k / NR * TAU; return Math.min(r, anillo([Math.cos(psi), Math.sin(psi)]) + m); });
  // Altura: la que da a la cúpula el volumen del motor (un estado por fotograma: la aurícula dibujada tiene los mL
  // de la aurícula del motor, como el VI). Volumen = H · área del cuello · G(bulto), con la sección
  // rr(a)² = ρ²·cos a·(1 + b·sen 2a)² y z = H·sen(a)^0,85 (cupulaPunto). Antes la altura salía de 30·(V/40)^0,45 mm
  // y la cúpula dibujada tenía ~2 veces los mL del motor.
  // En sístole la base baja (descenso, ver «mover») y estira la cúpula: cada sección z se estira por
  // 1 − descenso·paso′(z) (paso de 0 a 45 mm); se cuenta aquí para que el volumen sea el del motor tras moverla.
  const alturaAu = (v, rho, b, baja = descenso) => {
    let A0 = 0; for (const r of rho) A0 += r * r; A0 *= Math.PI / NR;           // ½·Σρ²·Δψ, mm²
    const vObj = clamp(v, LIMITES.au[0], LIMITES.au[1]) * 1000, N = 32;
    let H = 40;
    for (let it = 0; it < 4; it++) {
      let G = 0;
      for (let i = 0; i < N; i++) { const a = (i + 0.5) / N * Math.PI / 2, c = Math.cos(a), k = 1 + b * Math.sin(2 * a), s = Math.sin(a);
        const t = clamp((0.3 + H * Math.pow(s, 0.85)) / 45, 0, 1), estira = 1 - baja * 6 * t * (1 - t) / 45;
        G += c * k * k * 0.85 * Math.pow(s, -0.15) * c * estira * (Math.PI / 2 / N); }
      H = clamp(vObj / (A0 * G), 12, 90);
    }
    return H;
  };
  // Forma: el bulto (cuánto se ensancha por encima del cuello) se elige para que alto / ancho máximo sea
  // PROPORCION_AU; con él, la altura da el volumen del motor. Así la aurícula conserva su forma al llenarse y
  // vaciarse (antes: más volumen = más alta con el mismo suelo). Si ni sin bulto llega a esa proporción (poco
  // volumen sobre un cuello ancho), se queda sin bulto, más baja.
  const formaAu = (v, rho, baja = descenso) => {
    let rMed = 0; for (const r of rho) rMed += r / rho.length;
    const ancho = (b) => { let w = 0; for (let i = 1; i < 16; i++) { const a = i / 16 * Math.PI / 2; w = Math.max(w, Math.sqrt(Math.cos(a)) * (1 + b * Math.sin(2 * a))); } return 2 * rMed * w; };
    // alto tal como se verá: el techo casi no baja con la base y el suelo baja entero (ver «mover»)
    const alto = (b) => { const H = alturaAu(v, rho, b, baja); return H - baja * paso(0, 45, 0.3 + H); };
    let lo = -0.2, hi = 1.2;
    if (alto(lo) / ancho(lo) < PROPORCION_AU) return { b: lo, H: alturaAu(v, rho, lo, baja) };
    for (let i = 0; i < 10; i++) { const b = (lo + hi) / 2; alto(b) / ancho(b) > PROPORCION_AU ? lo = b : hi = b; }
    const b = (lo + hi) / 2; return { b, H: alturaAu(v, rho, b, baja) };
  };
  const cupula = (c, rho, H, inclin, bulto, encoger = 0) =>
    rejilla(Math.round(18 * q), NR, (u, v) => cupulaPunto(c, rho, H, inclin, bulto, u * Math.PI / 2, v * TAU, encoger));
  const salida = (psi, subir = 0.25) => norm([Math.cos(psi), Math.sin(psi), subir]);
  // AI: sobre la tapa del VI, detrás; se para a 2 mm de la raíz aórtica
  const elipseM = (d) => 1 / Math.sqrt(Math.pow(d[0] * Math.cos(U) + d[1] * Math.sin(U), 2) / (aM * aM) + Math.pow(-d[0] * Math.sin(U) + d[1] * Math.cos(U), 2) / (bM * bM));
  const okAi = (p) => Math.hypot(p[0], p[1]) < ReB - 2;
  const rhoAi = cuello(huella(mc, okAi, (d) => elipseM(d) + 1, [[ac, rA + 2]]), elipseM, MARGEN_AU.ai);
  const { b: bAi, H: HAi } = formaAu(estado.vai, rhoAi), incAi = [0, -8];
  // AD: sobre la tapa del VD, a la derecha; se para antes del tabique, del borde y de la salida del VD
  const okAd = (p) => { const r = Math.hypot(p[0], p[1]), f = Math.atan2(p[1], p[0]);
    return ventana(f) > 0.05 && r < rimRV(f) - 2 && !dentroHuella(cR, rhoInf, p, 2); };
  // el tabique (el círculo del VI) y la raíz aórtica, con corte continuo
  const rhoAd = cuello(huella(ct, okAd, () => rT + 1.5, [[[0, 0], ReB + 0.5], [ac, rA + 3]]), () => rT, MARGEN_AU.ad);
  // el suelo de la AD baja además lo que baja la pared libre del VD junto al anillo (pesoVd, media sobre el cuello)
  const bajaAd = descenso + extraVd * rhoAd.reduce((m, r, k) => { const psi = k / NR * TAU; return m + pesoVd(ct[0] + r * Math.cos(psi), ct[1] + r * Math.sin(psi), 0) / NR; }, 0);
  const { b: bAd, H: HAd } = formaAu(estado.vad, rhoAd, bajaAd), incAd = [-4, 0];
  const aoAur = (x, y, z) => 0.72 + 0.28 * paso(0, 9, z);
  anadirR('AI', conAO(cupula(mc, rhoAi, HAi, incAi, bAi), aoAur), COLORES.auricula, { dobleCara: true });
  anadirR('AD', conAO(cupula(ct, rhoAd, HAd, incAd, bAd), aoAur), COLORES.auricula, { dobleCara: true });
  if (corte) {
    anadirR('AI sangre', cupula(mc, rhoAi, HAi, incAi, bAi, 2), COLORES.sangreOx, { alfa: 0.3, dobleCara: true });
    anadirR('AD sangre', cupula(ct, rhoAd, HAd, incAd, bAd, 2), COLORES.sangreVen, { alfa: 0.3, dobleCara: true });
  }
  const enAi = (a, psi) => cupulaPunto(mc, rhoAi, HAi, incAi, bAi, a, psi);
  const enAd = (a, psi) => cupulaPunto(ct, rhoAd, HAd, incAd, bAd, a, psi);
  const vasoDesde = (p, d, tramos) => { const pts = [res(p, esc(d, 4)), p]; for (const [dist, dz] of tramos) pts.push(sum(sum(p, esc(d, dist)), [0, 0, dz])); return suave(pts); };
  // Vías por donde corre la sangre (eje de cada vaso, en el sentido del flujo): las usa el flujo de partículas
  const vias = { vp: [] };
  // 4 venas pulmonares por la pared posterior de la AI
  for (const [a, psi] of [[0.62, -2.2], [0.3, -2.2], [0.62, -0.75], [0.3, -0.75]]) {
    const d = salida(psi, a > 0.5 ? 0.2 : -0.05), eje = vasoDesde(enAi(a, psi), d, [[10, 0], [24, a > 0.5 ? 3 : -3]]);
    anadirR('Vena pulmonar', tubo(eje, 5, 10), COLORES.arteria); vias.vp.push(eje.slice().reverse());
  }
  // orejuelas: la izquierda baja junto al tronco pulmonar; la derecha abraza la raíz aórtica
  { const p = enAi(0.5, 0.55), d = salida(0.55, 0);
    anadirR('Orejuela izquierda', tubo(suave([res(p, esc(d, 3)), p, sum(p, [d[0] * 8, d[1] * 8 + 5, -3]), sum(p, [d[0] * 9 - 3, d[1] * 9 + 13, -8])]), 7, 12, u => 7 * kAi * (1 - 0.55 * u) * Math.sqrt(Math.max(0, 1 - Math.pow(paso(0.8, 1, u), 2)))), COLORES.auricula); }
  { const psi = Math.atan2(ac[1] - ct[1], ac[0] - ct[0]), p = enAd(0.5, psi), d = salida(psi, 0);
    anadirR('Orejuela derecha', tubo(suave([res(p, esc(d, 3)), p, sum(p, [d[0] * 9, d[1] * 9 + 3, 1]), sum(p, [d[0] * 13 + 2, d[1] * 13 + 10, -3])]), 9, 12, u => 9 * kAd * (1 - 0.6 * u) * Math.sqrt(Math.max(0, 1 - Math.pow(paso(0.8, 1, u), 2)))), COLORES.auricula); }
  // cavas a la AD: superior por el techo, inferior por detrás y abajo
  { const p = enAd(0.88, 0.3), eje = suave([[p[0], p[1], p[2] - 6], p, [p[0], p[1] + 2, p[2] + 24], [p[0] + 2, p[1] + 4, p[2] + 48]]);
    anadirR('Vena cava superior', tubo(eje, 8.5, 14), COLORES.vena); vias.vcs = eje.slice().reverse(); }
  // la inferior sale de la AD hacia el hiato del diafragma (abdomen-puntos.mjs). Aquí solo su primer tramo, como vía
  // de la sangre: la malla (calibre que cambia con la PVC y la respiración) la dibuja abdomen.mjs, porque por debajo
  // del diafragma la vena está fija al cuerpo y no puede moverse con el latido
  { const p = enAd(0.18, -1.75), d = norm(res(PUNTOS_ABDOMEN.hiato, p));
    vias.vci = [sum(p, esc(d, 14)), sum(p, esc(d, 7)), p, res(p, esc(d, 4))]; }

  // --- Raíz aórtica con 3 senos de Valsalva, aorta ---
  const zST = 20;
  const rRaiz = (z, psi) => rA * (1 + 0.28 * Math.sin(Math.PI * clamp(z / zST, 0, 1)) * (0.5 + 0.5 * Math.cos(3 * (psi - Math.PI / 2))));
  anadirR('Raíz aórtica', rejilla(Math.round(10 * q), NR, (u, v) => { const z = u * zST, psi = v * TAU, r = rRaiz(z, psi); return [ac[0] + r * Math.cos(psi), ac[1] + r * Math.sin(psi), z]; }), COLORES.arteria, { dobleCara: true });
  { const rhoAo = huella(ac, (p) => Math.hypot(p[0], p[1]) < ReB + 2 && !dentroHuella(mc, rhoAi, p, 1) && !dentroHuella(ct, rhoAd, p, 1) && !dentroHuella(cR, rhoInf, p, 1) && Math.hypot(p[0] - ac[0], p[1] - ac[1]) < rA + 15, () => rA + 0.5);
    anadirR('Grasa periaórtica', rejilla(Math.round(6 * q), NR, (u, v) => { const psi = v * TAU, k = Math.round(v * NR) % NR;
      const pie = [ac[0] + rhoAo[k] * Math.cos(psi), ac[1] + rhoAo[k] * Math.sin(psi), 0.3], z = 10, rr = rRaiz(z, psi) + 0.4;
      const cima = [ac[0] + rr * Math.cos(psi), ac[1] + rr * Math.sin(psi), z]; const w = Math.pow(u, 0.6);
      return [mix(pie[0], cima[0], w), mix(pie[1], cima[1], w), mix(pie[2], cima[2], paso(0, 1, u))]; }), COLORES.grasa, { dobleCara: true }); }
  const aorta = suave([[ac[0], ac[1], zST], [ac[0], ac[1], zST + 8], [ac[0] - 2, ac[1] + 1, 42], [ac[0] - 1, ac[1] - 4, 62], [0, -14, 75], [14, -34, 72], [21, -54, 54]]);   // el arco acaba aquí; la aorta descendente la dibuja torax.mjs (N3)
  anadirR('Aorta', tubo(aorta, rA, 16, u => rA * (1 + 0.14 * paso(0, 0.08, u) - 0.22 * paso(0.35, 0.7, u))), COLORES.arteria, { dobleCara: true });

  // --- Infundíbulo del VD (tracto de salida) y tronco pulmonar ---
  const inf = infundibulo(geo, rhoInf, NR);
  const NK = inf.marcos.length - 1, paredInf = 3;
  anadirR('Infundíbulo', rejilla(NK, NR, (u, v, i) => inf.anillo(i, v * TAU, 0)), COLORES.endocardio, { dobleCara: true });
  anadirR('Infundíbulo epicardio', rejilla(NK, NR, (u, v, i) => inf.anilloExt(i, v * TAU, paredInf)), COLORES.miocardio, { dobleCara: true });
  anadirR('Infundíbulo borde', rejilla(1, NR, (u, v) => lerp(inf.anillo(NK, v * TAU, 0), inf.anillo(NK, v * TAU, paredInf), u)), COLORES.tapa, { dobleCara: true });
  const P = inf.P, TP = inf.marcos[NK].T, rP = inf.rP, bif = [12, 2, 54];
  const tronco = suave([P, sum(P, esc(TP, 7)), [14, 10, 46], bif]);
  anadirR('Tronco pulmonar', tubo(tronco, rP + paredInf, 16), COLORES.vena, { dobleCara: true });
  const apD = suave([bif, [-10, -14, 56], [-36, -22, 56], [-62, -26, 54]]), apI = suave([bif, [22, -6, 58], [44, -16, 56], [60, -22, 54]]);
  anadirR('AP derecha', tubo(apD, 8, 12), COLORES.vena, { dobleCara: true });
  anadirR('AP izquierda', tubo(apI, 8, 12), COLORES.vena, { dobleCara: true });
  { const salidaVd = inf.marcos.map(m => m.c); vias.ao = [[ac[0], ac[1], 2], ...aorta];
    vias.apD = [...salidaVd, ...tronco.slice(1), ...apD.slice(1)]; vias.apI = [...salidaVd, ...tronco.slice(1), ...apI.slice(1)]; }

  // --- Válvulas: cierran en una línea de coaptación y se abomban con la presión que soportan ---
  // estado.mitral… = apertura (0 cerrada, 1 abierta); estado.carga_mitral… = gradiente inverso con la válvula cerrada (0-1)
  const ap = (k) => clamp(estado[k] ?? 0, 0, 1), cg = (k) => clamp(estado['carga_' + k] ?? 0, 0, 1);
  const valva = (v) => rejilla(12, 7, (uu, vv) => puntoValva(v, uu, vv));
  const abajo = [0, 0, -1], arriba = [0, 0, 1];
  const u3 = [Math.cos(U), Math.sin(U), 0], uP3 = [-Math.sin(U), Math.cos(U), 0];
  // Mitral: anterior (1/3 del anillo, 2/3 del área) y posterior; cierran en una "sonrisa" desplazada hacia atrás
  const enAnilloM = (x, y) => [mc[0] + aM * x * u3[0] + bM * y * uP3[0], mc[1] + aM * x * u3[1] + bM * y * uP3[1], 0];
  const coapM = (t) => { const s0 = 1 - t, P0 = [0.508, 0.79], P1 = [-1.2, 0], P2 = [0.508, -0.79];
    return enAnilloM(s0 * s0 * P0[0] + 2 * s0 * t * P1[0] + t * t * P2[0], s0 * s0 * P0[1] + 2 * s0 * t * P1[1] + t * t * P2[1]); };
  const baseM = { anillo: anilloMitral, cierre: coapM, n: abajo, prof: 5, pot: 1.3, hundir: 0, abomba: 2.2, apertura: ap('mitral'), carga: cg('mitral'), thAbierta: 1.2 };
  const valvasM = [{ ...baseM, nombre: 'Mitral anterior', psi: (t) => 1 - 2 * t }, { ...baseM, nombre: 'Mitral posterior', psi: (t) => 1 + (TAU - 2) * t }];
  for (const v of valvasM) anadirR(v.nombre, valva(v), COLORES.valva, { dobleCara: true });
  // Valvas en estrella (tricúspide y semilunares): cada una cierra contra las dos vecinas en el centro
  const estrella = (anillo, centro, a, b, ins) => {
    const Ca = lerp(centro, anillo(a), ins), Cb = lerp(centro, anillo(b), ins);
    return (t) => t < 0.5 ? lerp(Ca, centro, 2 * t) : lerp(centro, Cb, 2 * t - 1);
  };
  const cT3 = [ct[0], ct[1], 0], valvasT = [];
  for (let k = 0; k < 3; k++) { const a = 0.4 + k * TAU / 3, b = a + TAU / 3;
    const v = { anillo: anilloTricus, psi: (t) => mix(a, b, t), cierre: estrella(anilloTricus, cT3, a, b, 0.88), n: abajo, prof: 5, pot: 1.3, hundir: 0, abomba: 1.5, apertura: ap('tricus'), carga: cg('tricus'), thAbierta: 1.2 };
    valvasT.push(v); anadirR('Tricúspide', valva(v), COLORES.valva, { dobleCara: true }); }
  const anilloAoV = (psi) => [ac[0] + (rA - 0.4) * Math.cos(psi), ac[1] + (rA - 0.4) * Math.sin(psi), 3];
  const cAo3 = [ac[0], ac[1], 3];
  for (let k = 0; k < 3; k++) { const a = Math.PI / 6 + k * TAU / 3, b = a + TAU / 3;
    anadirR('Aórtica', valva({ anillo: anilloAoV, psi: (t) => mix(a, b, t), cierre: estrella(anilloAoV, cAo3, a, b, 0.92), n: arriba, prof: 2.5, pot: 3, hundir: 2, abomba: 2.5, apertura: ap('aortica'), carga: cg('aortica'), thAbierta: 1.35 }), COLORES.valva, { dobleCara: true }); }
  const mT = inf.marcos[NK];
  const anilloPuV = (psi) => sum(P, sum(esc(mT.e1, (rP - 0.4) * Math.cos(psi)), esc(mT.e2, (rP - 0.4) * Math.sin(psi))));
  for (let k = 0; k < 3; k++) { const a = k * TAU / 3, b = a + TAU / 3;
    anadirR('Pulmonar', valva({ anillo: anilloPuV, psi: (t) => mix(a, b, t), cierre: estrella(anilloPuV, P, a, b, 0.92), n: TP, prof: 2.5, pot: 3, hundir: 2, abomba: 2.5, apertura: ap('pulmonar'), carga: cg('pulmonar'), thAbierta: 1.35 }), COLORES.valva, { dobleCara: true }); }

  // --- Grasa del surco AV (rodea la base salvo delante, donde sube el infundíbulo) ---
  const surco = [];
  for (let k = 0; k <= 16; k++) { const f = mix(1.92, REF.phiB, k / 16); const r = rimRV(f) + 0.5; surco.push([r * Math.cos(f), r * Math.sin(f), 2.5]); }
  for (let k = 1; k <= 16; k++) { const f = mix(REF.phiB, TAU + 1.0, k / 16); const r = ReB + 0.5; surco.push([r * Math.cos(f), r * Math.sin(f), 2.5]); }
  anadirR('Grasa del surco AV', tubo(suave(surco, 3), 4.2, 10), COLORES.grasa);

  if (opciones.detalle !== false) {
    // Músculos papilares del VI y cuerdas tendinosas (al borde libre de las valvas mitrales)
    const cuerdas = [];
    const papilares = [];
    for (const [phP, nombre] of [[0.55, 'anterolateral'], [3.95, 'posteromedial']]) {
      const zB = -vi.L * 0.6, zT = -vi.L * 0.28;
      const base = endoVi(zB, phP), b2 = endoVi(zT, phP); const pc = [mix(b2[0], 0, 0.45), mix(b2[1], 0, 0.45), zT];
      papilares.push(pc);
      if (!corte || dentroCorte(phP)) anadir('Papilar ' + nombre, tubo([base, [mix(base[0], pc[0], 0.5), mix(base[1], pc[1], 0.5), mix(zB, zT, 0.5)], pc], 5.5, 10, u => 5.5 * (1 - 0.6 * u)), COLORES.papilar);
    }
    for (const v of valvasM) for (let j = 0; j < 4; j++) {
      const tip = puntoValva(v, 0.15 + 0.233 * j, 1);
      const pc = papilares.reduce((m, p) => Math.hypot(p[0] - tip[0], p[1] - tip[1]) < Math.hypot(m[0] - tip[0], m[1] - tip[1]) ? p : m);
      const enCorte = !corte || (corte.nx * tip[0] + corte.ny * tip[1] >= 0 && corte.nx * pc[0] + corte.ny * pc[1] >= 0);
      if (enCorte) cuerdas.push(pc, tip);
    }
    // VD: papilar anterior (el mayor, de la pared libre, donde llega la banda moderadora), posterior y septal (pequeño)
    const papVd = [];
    for (const [phP, zr, grosor, nombre, septal] of [[2.55, 0.58, 5, 'anterior del VD', false], [3.95, 0.5, 4, 'posterior del VD', false], [3.05, 0.18, 2.6, 'septal del VD', true]]) {
      const zB = -Lvd * zr, raiz = septal ? epiVi(zB, phP) : endoVd(zB, phP);
      const pc = lerp(raiz, [ct[0], ct[1], zB * 0.45 - 4], septal ? 0.35 : 0.42);
      // el tubo empieza un grosor hacia dentro: si no, su extremo redondo asomaba fuera de la pared libre (y del saco)
      const base = sum(raiz, esc(norm(res(pc, raiz)), 0.8 * grosor));
      papVd.push(pc);
      if (!corte || dentroCorte(phP)) anadir('Papilar ' + nombre, tubo([base, lerp(base, pc, 0.5), pc], grosor, 10, u => grosor * (1 - 0.55 * u)), COLORES.papilar);
    }
    for (const v of valvasT) for (let j = 0; j < 3; j++) {
      const tip = puntoValva(v, 0.2 + 0.3 * j, 1);
      const pc = papVd.reduce((m, p) => Math.hypot(p[0] - tip[0], p[1] - tip[1]) < Math.hypot(m[0] - tip[0], m[1] - tip[1]) ? p : m);
      const enCorte = !corte || (corte.nx * tip[0] + corte.ny * tip[1] >= 0 && corte.nx * pc[0] + corte.ny * pc[1] >= 0);
      if (enCorte) cuerdas.push(pc, tip);
    }
    if (cuerdas.length) partes.push({ nombre: 'Cuerdas', lineas: new Float32Array(cuerdas.flat()), color: COLORES.cuerda });
    // Banda moderadora del VD
    // Cruza la cavidad del VD del tabique a la pared libre, en el tercio apical y en el plano de la vista apical de 4 cámaras
    // (phB ≈ 3,2: allí corta el A4C), un poco más baja en la pared libre (arqueada). Los extremos entran 1,5 mm en cada pared.
    { const zB = -Lvd * 0.64, phB = 3.2, entra = (p, d) => { const r = Math.hypot(p[0], p[1]); return [p[0] * (r + d) / r, p[1] * (r + d) / r, p[2]]; };
      const a = entra(epiVi(zB, phB), -1.5), b = entra(endoVd(zB - 4, phB), 1.5), m = lerp(a, b, 0.5);
      if (!corte || dentroCorte(phB)) anadir('Banda moderadora', tubo([a, [m[0], m[1], m[2] - 3], b], 3.2, 8), COLORES.papilar); }
    // Coronarias: nacen de los senos de Valsalva y corren por los surcos
    const sobreEpi = (z, ph, extra) => {
      const f = anguloNorm(ph); const p = (ventana(f) > 0.001 && z > -Lvd) ? epiVd(z, f) : epiVi(Math.max(z, -vi.Le * 0.98), f);
      const r = Math.hypot(p[0], p[1]) + extra; return [r * Math.cos(f), r * Math.sin(f), z];
    };
    const ostio = (psi, z = 11) => { const r = rRaiz(z, psi) - 0.5; return [ac[0] + r * Math.cos(psi), ac[1] + r * Math.sin(psi), z]; };
    const enSurcoVi = (f, z = 3) => [(ReB + 2.2) * Math.cos(f), (ReB + 2.2) * Math.sin(f), z];
    const enSurcoVd = (f, z = 3) => { const r = rimRV(f) + 2.2; return [r * Math.cos(f), r * Math.sin(f), z]; };
    const oL = ostio(-0.44), oR = ostio(1.66);
    const bifurc = enSurcoVi(0.52, 4);
    const tronCI = [oL, [oL[0] + 6, oL[1] + 3, 10], [mix(oL[0], bifurc[0], 0.6), mix(oL[1], bifurc[1], 0.6), 7], bifurc];
    const da = [bifurc, sobreEpi(1, REF.phiA - 0.06, 3.8)]; for (let i = 1; i <= 12; i++) da.push(sobreEpi(-vi.Le * 0.92 * i / 12, REF.phiA - 0.06 - 0.12 * i / 12, 3.8));
    const cx = [bifurc]; for (let i = 1; i <= 10; i++) cx.push(enSurcoVi(mix(0.52, -1.45, i / 10)));
    const om = [enSurcoVi(-0.3)]; for (let i = 1; i <= 7; i++) om.push(sobreEpi(-vi.Le * 0.6 * i / 7, -0.3 - 0.05 * i / 7, 2.2));
    const cd = [oR, [oR[0] - 3, oR[1] + 7, 9]]; for (let i = 0; i <= 12; i++) cd.push(enSurcoVd(mix(1.95, REF.phiB - 0.05, i / 12)));
    for (let i = 1; i <= 9; i++) cd.push(sobreEpi(-vi.Le * 0.72 * i / 9, REF.phiB + 0.03, 3.8));
    const mg = [enSurcoVd(3.45)]; for (let i = 1; i <= 7; i++) mg.push(sobreEpi(-Lvd * 0.55 * i / 7, 3.45, 2.2));
    const daGrasa = []; for (let i = 0; i <= 12; i++) daGrasa.push(sobreEpi(-vi.Le * 0.9 * i / 12, REF.phiA - 0.06 - 0.12 * i / 12, 1.0));
    const dpGrasa = []; for (let i = 0; i <= 9; i++) dpGrasa.push(sobreEpi(-vi.Le * 0.7 * i / 9, REF.phiB + 0.03, 1.0));
    anadirR('Grasa del surco interventricular anterior', tubo(suave(daGrasa, 3), 3.4, 8), COLORES.grasa);
    anadirR('Grasa del surco interventricular posterior', tubo(suave(dpGrasa, 3), 3.4, 8), COLORES.grasa);
    for (const [n, p, r] of [['Tronco coronario izquierdo', tronCI, 2.2], ['Descendente anterior', da, 1.7], ['Circunfleja', cx, 1.7], ['Obtusa marginal', om, 1.2], ['Coronaria derecha', cd, 1.8], ['Marginal aguda', mg, 1.2]])
      anadirR('Coronaria · ' + n, tubo(suave(p, 3), r, 7), COLORES.coronaria);
    // Seno coronario: por el surco AV posterior hasta la AD, junto a la cava inferior
    const sc = []; for (let i = 0; i <= 8; i++) { const f = mix(-0.5, -1.8, i / 8); sc.push([(ReB + 3.5) * Math.cos(f), (ReB + 3.5) * Math.sin(f), 3.5]); }
    { const p = enAd(0.1, -1.2); sc.push([mix(sc[sc.length - 1][0], p[0], 0.5), mix(sc[sc.length - 1][1], p[1], 0.5) - 3, 4], p); }
    anadirR('Seno coronario', tubo(suave(sc, 3), 3.2, 8, u => 2.4 + 1.6 * u), COLORES.venaCoronaria);
  }

  if (opciones.pericardio && !opciones.vistaBase) {
    // Saco: sigue a los ventrículos con holgura y cierra una cúpula sobre las aurículas y las raíces. El centro
    // de la cúpula se corre hacia las aurículas (la AD llega lejos a la derecha); a la altura de los ventrículos,
    // no (centroSaco): corrido también ahí, el saco se metía ~4 mm dentro de la pared lateral del VI.
    const h = 3 + 0.06 * (estado.liquidoPeri || 0);
    const rVentr = (z, f) => Math.hypot(...((ventana(f) > 0.001 && z > -Lvd) ? epiVd(z, f) : epiVi(Math.max(z, -vi.Le * 0.999), f)).slice(0, 2));
    // Envolvente de lo demás que va dentro del saco (los ventrículos ya los sigue rVentr): coronarias y grasa de
    // los surcos, aurículas, orejuelas, infundíbulo y raíz aórtica. Cada punto empuja los vértices del saco que
    // tiene a menos de una celda de altura y de ángulo hasta su propio radio (así la malla no lo corta entre dos
    // vértices), con bordes en rampa para que el saco no salte cuando un punto entra o sale de esa ventana al latir.
    const dentroSaco = partes.filter(pz => pz.pos && /^(VD borde|Base V|AI$|AD$|Orejuela|Infundíbulo|Raíz aórtica|Grasa|Coronaria|Seno coronario)/.test(pz.nombre));
    // la cúpula sube lo que haga falta para tapar la aurícula más alta (con volúmenes muy grandes pasan de 56 mm)
    let zMax = 0; for (const pz of dentroSaco) for (let i = 2; i < pz.pos.length; i += 3) zMax = Math.max(zMax, pz.pos[i]);
    const NF = NZ + 10, zTop = Math.max(56, zMax + 10), zBot0 = -vi.Le - h;
    const dz = (zTop - zBot0) / NF, df = TAU / NP, wZ = 1.5 * dz, wF = 1.5 * df;   // núcleo de una celda, rampa de media
    const env = new Float32Array((NF + 1) * NP);
    rellenarEnvolvente(env, dentroSaco, { zTop, zBot0, dz, df, wZ, wF, NF, NP });
    // hacia: cuánto se mete hacia dentro (0 el saco; el derrame, 1,5 mm por dentro a las mismas alturas, así
    // queda dentro fila a fila; solo sus dos polos se mueven hacia dentro)
    const saco = (hacia) => rejilla(NF, NP, (u, v, fi, j) => {
      const f = v * TAU; let z = zTop - dz * fi;
      if (u === 0) z -= hacia; else if (u === 1) z += hacia;
      const cupula = 56 * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(z, 0) / zTop, 2))) * (1 - paso(0, 22, -z));
      let r;
      if (z <= -vi.Le) r = Math.sqrt(Math.max(0, h * h - (z + vi.Le) * (z + vi.Le)));
      else if (z >= 0) r = Math.max(cupula, (rVentr(0, f) + h) * Math.sqrt(Math.max(0, 1 - Math.pow(z / zTop, 2))));
      else r = Math.max(rVentr(z, f) + h, cupula);
      const e = env[fi * NP + j % NP]; if (e > 0) r = Math.max(r, e + h - 1.5);
      r = (u === 0 || u === 1) ? 0 : Math.max(0, r - hacia);   // los dos polos cierran el saco
      const c = centroSaco(z);
      return [r * Math.cos(f) + c[0], r * Math.sin(f) + c[1], z];
    });
    anadirR('Pericardio', saco(0), COLORES.pericardio, { alfa: 0.15, dobleCara: true });
    if (estado.liquidoPeri > 0) anadirR('Derrame', saco(1.5), [0.85, 0.75, 0.3], { alfa: 0.3, dobleCara: true });
  }
  // --- La base baja hacia un ápex casi fijo (MAPSE) y el VI se retuerce (ilustrativo) ---
  // Todo lo que está por debajo del plano AV baja entero; las aurículas y las raíces se estiran
  // (el estiramiento auricular es el que las llena en la sístole ventricular); los vasos de arriba no se mueven.
  // El descenso se mide desde el telediástole del propio corazón (estado.vviTd, el del último latido): un
  // corazón pequeño no queda con la base hundida, sino entero más corto. Acotado por si acaso.
  const contr = clamp((REF.vVi - estado.vvi) / 75, 0, 1.15), tau = 0.12 * contr;   // ~7° al final de la sístole
  // La pared libre del VD (y el anillo tricuspídeo lateral, donde se mide el TAPSE) baja más que el plano AV
  // común: el VD se vacía sobre todo acortándose. Su excursión sale de lo que se ha vaciado el VD desde su
  // telediástole (estado.vvdTd), así que cae si cae el volumen sistólico del VD. TAPSE_POR_ML está calibrado
  // para ~21 mm con el VS del VD normal del motor (~74 mL); ilustrativo (la app cita TAPSE normal >16 mm en la
  // Ficha 5 y >17 mm en la Ficha 11 de Fisiopatología UCI · Cardiología). El exceso sobre el descenso común se
  // reparte con un peso: máximo en la pared libre junto al anillo tricuspídeo, nulo en el tabique, el resto del
  // VI, el infundíbulo y el ápex del VD.
  const mover = (pos) => {
    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i], y = pos[i + 1], z = pos[i + 2];
      const ang = tau * (1.4 * Math.max(0, -z) / vi.Le - 0.4) * (1 - paso(0, 15, z));     // ápex +, base −
      const c = Math.cos(ang), s = Math.sin(ang);
      pos[i] = c * x - s * y; pos[i + 1] = s * x + c * y; pos[i + 2] = z + descenso * (1 - paso(0, 45, z)) + extraVd * pesoVd(x, y, z);
    }
  };
  for (const pz of partes) { if (pz.pos) { if (!pz.propia) pz.pos = new Float32Array(pz.pos); mover(pz.pos); } if (pz.lineas) mover(pz.lineas); }
  // --- Tórax (N3): aorta descendente, columna y pleura-pulmón, fijos al cuerpo (no los mueve la base) ---
  let torax = null;
  if (!opciones.vistaBase) {
    torax = construirTorax(partes, { tubo, suave, rA, arranque: aorta[aorta.length - 1], colores: COLORES });
    for (const { nombre, pos, idx, color, ...resto } of torax.piezas) anadirR(nombre, { pos, idx }, color, resto);
  }

  // --- Interior para el flujo de sangre: puntos dentro de cada cavidad a partir de coordenadas
  // normalizadas (se mueven con las paredes), centros valvulares y vías de los vasos ---
  const ejeAur = (c, H, inclin, a) => { const sa = Math.sin(a); return [c[0] + inclin[0] * sa, c[1] + inclin[1] * sa, 0.3 + H * Math.pow(sa, 0.85)]; };
  const enAur = (c, rho, H, inclin, bulto, [u, f, r]) => { const a = 0.15 + u * 1.15; return lerp(ejeAur(c, H, inclin, a), cupulaPunto(c, rho, H, inclin, bulto, a, f * TAU), 0.8 * r); };
  const enCamara = {
    vi: ([u, f, r]) => { const z = -vi.L * (0.05 + 0.8 * u), ph = f * TAU, rr = 0.85 * r * rEndoVi(z, ph); return [rr * Math.cos(f * TAU), rr * Math.sin(f * TAU), z]; },
    vd: ([u, f, r]) => { const z = -Lvd * (0.05 + 0.75 * u), ph = REF.phiA + (0.1 + 0.8 * f) * (REF.phiB - REF.phiA); const rr = rEpiVi(z, ph) + wRV(z, ph) * (0.2 + 0.6 * r); return [rr * Math.cos(ph), rr * Math.sin(ph), z]; },
    ai: (n) => enAur(mc, rhoAi, HAi, incAi, bAi, n),
    ad: (n) => enAur(ct, rhoAd, HAd, incAd, bAd, n),
  };
  const valvulas = { mitral: [mc[0], mc[1], 0], tricus: [ct[0], ct[1], 0], aortica: [ac[0], ac[1], 2], pulmonar: [geo.cR[0], geo.cR[1], -2] };
  const largos = {};
  const largoVia = (pts) => { let l = 0; for (let i = 1; i < pts.length; i++) l += largo(res(pts[i], pts[i - 1])); return l; };
  const viaPorNombre = (n) => n.startsWith('vp') ? vias.vp[+n.slice(2)] : vias[n];
  const flujo = {
    enCamara, valvulas,
    largo: (n) => largos[n] ?? (largos[n] = largoVia(viaPorNombre(n))),
    enVia: (n, t) => { const pts = viaPorNombre(n), L = flujo.largo(n) * clamp(t, 0, 1); let acc = 0;
      for (let i = 1; i < pts.length; i++) { const d = largo(res(pts[i], pts[i - 1])); if (acc + d >= L) return lerp(pts[i - 1], pts[i], d ? (L - acc) / d : 0); acc += d; }
      return pts[pts.length - 1]; },
    // misma deformación (descenso de la base y torsión) que las piezas
    transformar: (p) => { const a = [p[0], p[1], p[2]]; mover(a); return a; },
    visible: (p) => !corte || corte.nx * p[0] + corte.ny * p[1] >= 0,
  };
  // el anillo tricuspídeo lateral (el punto más alejado del VI), ya movido: es donde se mide el TAPSE
  const tl = Math.hypot(geo.ct[0], geo.ct[1]), anilloTricLateral = [geo.ct[0] * (1 + geo.rT / tl), geo.ct[1] * (1 + geo.rT / tl), 0];
  mover(anilloTricLateral);
  return { partes, vi, A, Lvd, geo, descenso, descensoVd: -excVd, anilloTricLateral, flujo };
}

// ---- Dimensiones de la base y funciones de superficie -------------------------
export function baseGeometrica(estado) {
  // Formas de enfermedad (escenarios.mjs): mioVi = masa del VI respecto a la normal; septo (0-1) = cuánto se aplana
  // el tabique en este instante (formas.mjs, aplanamientoSeptal: sale del gradiente de presión VI−VD)
  const mio = estado.mioVi ?? 1, septo = clamp(estado.septo ?? 0, 0, 1);
  // Tabique aplanado: en la zona media del VI, la parte del tabique se corta por una cuerda (corte en «D»). La pared
  // conserva su grosor (el epicardio se corta por una cuerda paralela). α: medio ángulo del arco aplanado (ilustrativo)
  const alfa = (z, L) => { const sv = -z / L; return ALFA_SEPTO * septo * paso(0, 0.2, sv) * (1 - paso(0.7, 0.95, sv)); };
  let vi = geomVi(estado.vvi, mio);
  if (septo > 0) {            // lo que la cuerda le quita a la cavidad se devuelve al radio, para que el volumen siga al motor
    let quitado = 0; const dz = vi.L / N_VOL;
    for (let i = 0; i < N_VOL; i++) { const z = -(i + 0.5) * dz, r = perfil(z, vi.Rb, vi.Rm, vi.L), a = alfa(z, vi.L);
      quitado += r * r * (a - Math.sin(a) * Math.cos(a)) * dz; }
    vi = geomVi(estado.vvi, mio, quitado / 1000);
  }
  const vvd = clamp(estado.vvd, LIMITES.vd[0], LIMITES.vd[1]);
  // se piden muchas veces con el mismo z o el mismo ángulo (filas y columnas de las rejillas)
  const rEndoViC = memo((z) => perfil(z, vi.Rb, vi.Rm, vi.L));
  const rEpiViC = memo((z) => perfil(Math.max(z, -vi.Le), vi.ReB, vi.Rme, vi.Le));
  const alfaZ = memo((z) => alfa(z, vi.L));
  // radio del VI en (z, ángulo), con el tabique aplanado si toca
  const rEndoVi = (z, f) => { const r = rEndoViC(z); if (f === undefined) return r; const a = alfaZ(z); if (a <= 0) return r;
    const c = Math.cos(f - PHI_SEPTO); return c > 0 ? Math.min(r, r * Math.cos(a) / c) : r; };
  const rEpiVi = (z, f) => { const r = rEpiViC(z); if (f === undefined) return r; const a = alfaZ(z); if (a <= 0) return r;
    const c = Math.cos(f - PHI_SEPTO); return c > 0 ? Math.min(r, (r - rEndoViC(z) * (1 - Math.cos(a))) / c) : r; };
  const endoVi = (z, f) => { const r = rEndoVi(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const epiVi = (z, f) => { const r = rEpiVi(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const ReB = vi.ReB;

  // Anillos del VI: aórtico (fijo) delante-derecha, mitral (se contrae) detrás-izquierda, con 1,5 mm de continuidad mitroaórtica
  const kM = escalaAnillo(estado.vvi, 40, 120);
  const U = 2.234, u = [Math.cos(U), Math.sin(U)], uP = [-u[1], u[0]];
  const rA = 10, dA = vi.Rb - rA - 2, ac = [dA * u[0], dA * u[1]];
  const aM = 11 * kM, bM = 15 * kM, dM = dA - rA - 1.5 - aM, mc = [dM * u[0], dM * u[1]];
  const anilloMitral = (psi) => [mc[0] + aM * Math.cos(psi) * u[0] + bM * Math.sin(psi) * uP[0], mc[1] + aM * Math.cos(psi) * u[1] + bM * Math.sin(psi) * uP[1], 0];
  const anilloAortico = (psi) => [ac[0] + rA * Math.cos(psi), ac[1] + rA * Math.sin(psi), 0];

  // VD: media luna en torno al VI; en la base, un contorno casi fijo (entrada tricuspídea y salida)
  const Lvd = vi.Le * REF.lVdRel;
  const ventana = memo((phi) => { const f = anguloNorm(phi); if (f < REF.phiA || f > REF.phiB) return 0; const a = (f - REF.phiA) / (REF.phiB - REF.phiA);
    return Math.pow(Math.sin(Math.PI * a), 0.7) * paso(0, 0.12, a) * paso(0, 0.12, 1 - a); });
  const gauss = (f, c, s) => Math.exp(-Math.pow((anguloNorm(f) - c) / s, 2));
  // el anillo y la base del VD se contraen con el volumen. Por encima del volumen normal, la base crece más deprisa que la
  // raíz cúbica del volumen: el VD dilatado pasa de semiluna a esfera y el anillo tricuspídeo se dilata (Mukherjee 2025,
  // en Atlas · 14). El ritmo (0,9 por cada 110 mL) es ilustrativo
  const kT = 0.62 + 0.38 * clamp((vvd - 30) / 110, 0, 1) + 0.9 * Math.max(0, vvd - 140) / 110;
  const Wb = memo((f) => kT * Math.sqrt(ventana(f)) * (18 + 13 * gauss(f, 3.23, 0.66) + 15 * gauss(f, 1.72, 0.38)));
  const perfilZ = memo((z) => Math.pow(Math.max(0, 1 - Math.pow(-z / Lvd, PERFIL_VD[0])), PERFIL_VD[1]));
  const SBR = 0.40, wz = (z) => paso(0, SBR, -z / Lvd);
  // volumen del VD = C0 + C1·A + C2·A² (cuadrática exacta en A)
  let C0 = 0, C1 = 0, C2 = 0;
  { const nz = 20, nf = 40, span = REF.phiB - REF.phiA, df = span / nf, dz = Lvd / nz;
    for (let i = 0; i < nz; i++) { const z = -Lvd * (i + 0.5) / nz, w = wz(z), pz = perfilZ(z);
      for (let j = 0; j < nf; j++) { const f = REF.phiA + span * (j + 0.5) / nf, re = rEpiVi(z, f); const a = (1 - w) * Wb(f), b = w * ventana(f) * pz;
        C0 += (re * a + 0.5 * a * a) * df * dz; C1 += (re * b + a * b) * df * dz; C2 += 0.5 * b * b * df * dz; } } }
  const V = vvd * 1000;
  const A = C0 >= V ? 1 : Math.max(1, (-C1 + Math.sqrt(C1 * C1 - 4 * C2 * (C0 - V))) / (2 * C2));
  // pared libre del VD: más fina al dilatarse; mioVd la engrosa (hipertrofia del VD por sobrecarga de presión, Atlas · 14)
  const tVd = REF.paredVd * Math.pow(REF.vVd / Math.max(40, vvd), 0.33) * (estado.mioVd ?? 1);
  const tvdW = (w) => tVd * paso(0, 8, w);
  const wRV = (z, f) => mix(Wb(f), A * ventana(f) * perfilZ(z), wz(z));
  const endoVd = (z, f) => { const r = rEpiVi(z, f) + wRV(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const epiVd = (z, f) => { const w = wRV(z, f); const r = rEpiVi(z, f) + w + tvdW(w); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const rimRV = (f) => { const w = Wb(f); return ReB + w + tvdW(w); };
  // anillo tricúspide y orificio de salida (infundíbulo) dentro de la media luna
  const phiT = 3.23, rT = 12 * kT, dT = ReB + 2 + rT, ct = [dT * Math.cos(phiT), dT * Math.sin(phiT)];
  const anilloTricus = (psi) => [ct[0] + rT * Math.cos(psi), ct[1] + rT * Math.sin(psi), 0];
  // el infundíbulo crece menos que la base: su ventana angular es estrecha y,
  // con el VD muy dilatado, un orificio que creciera con kT se saldría de ella
  const kR = Math.min(kT, 1.3);
  const phiR = 1.72, aR = RVOT.a * kR, bR = RVOT.b * kR, dR = ReB + 2 + aR, cR = [dR * Math.cos(phiR), dR * Math.sin(phiR)];
  const e1R = [Math.cos(phiR), Math.sin(phiR)], e2R = [-Math.sin(phiR), Math.cos(phiR)];
  const anilloRVOT = (psi) => [cR[0] + aR * Math.cos(psi) * e1R[0] + bR * Math.sin(psi) * e2R[0], cR[1] + aR * Math.cos(psi) * e1R[1] + bR * Math.sin(psi) * e2R[1], 0];
  return { vi, mio, septo, rEndoVi, rEpiVi, endoVi, epiVi, ReB, Lvd, A, C0, ventana, Wb, wRV, tvdW, endoVd, epiVd, rimRV, kM, kT,
    U, anilloMitral, mc, aM, bM, anilloAortico, ac, rA, anilloTricus, ct, rT, anilloRVOT, cR, aR, bR, phiR, e1R, e2R };
}

// Infundíbulo: tubo desde el orificio de salida del VD (z = 0) hasta el anillo pulmonar,
// con marcos por transporte paralelo para que la elipse de abajo pase a círculo arriba sin girar.
function infundibulo(g, rhoInf, NR) {
  const rP = RVOT.rP, P = [g.cR[0] + 2, g.cR[1] - 10, 26], nTop = norm([0.05, -0.35, 0.94]);
  const C0 = [g.cR[0], g.cR[1], 0], C1 = [g.cR[0], g.cR[1], 12], C2 = res(P, esc(nTop, 10)), C3 = P;
  const bez = (t) => { const s = 1 - t; return [0, 1, 2].map(c => s * s * s * C0[c] + 3 * s * s * t * C1[c] + 3 * s * t * t * C2[c] + t * t * t * C3[c]); };
  const der = (t) => { const s = 1 - t; return norm([0, 1, 2].map(c => 3 * s * s * (C1[c] - C0[c]) + 6 * s * t * (C2[c] - C1[c]) + 3 * t * t * (C3[c] - C2[c]))); };
  const NK = 10, marcos = [];
  let e1 = [g.e1R[0], g.e1R[1], 0];
  for (let k = 0; k <= NK; k++) {
    const t = k / NK, T = der(t);
    e1 = norm(res(e1, esc(T, pto(e1, T))));
    marcos.push({ t, c: bez(t), T, e1, e2: cruz(T, e1) });
  }
  const anillo = (k, psi, extra) => {
    const m = marcos[k], s = paso(0, 1, m.t);
    const a = mix(g.aR, rP, s) + extra, b = mix(g.bR, rP, s) + extra;
    return sum(m.c, sum(esc(m.e1, a * Math.cos(psi)), esc(m.e2, b * Math.sin(psi))));
  };
  // cara externa: en la base sigue la huella del hombro y se funde con el tubo hacia la mitad
  const anilloExt = (k, psi, pared) => {
    const m = marcos[k], tubo = anillo(k, psi, pared);
    const f = g.phiR + psi, kk = ((f / TAU) * NR % NR + NR) % NR, k0 = Math.floor(kk);
    const r = mix(rhoInf[k0], rhoInf[(k0 + 1) % NR], kk - k0);
    const base = [g.cR[0] + r * Math.cos(f), g.cR[1] + r * Math.sin(f), 0];
    const w = paso(0, 0.6, m.t);
    return lerp([base[0], base[1], tubo[2] * 0.6], tubo, w);
  };
  return { rP, P, marcos, anillo, anilloExt };
}

/** Diámetros del TSVD (infundíbulo) como los mide Lang 2015, p. 20 (Tabla 8), sobre el mismo tubo que se dibuja:
 *  proximal = eje mayor del orificio (z = 0); PLAX = eje anteroposterior a media altura del tubo (entre el orificio y la
 *  válvula pulmonar); distal = diámetro justo antes de la válvula pulmonar. mm. Ilustrativo: el método es el nuestro. */
export function diametrosTSVD(g) {
  const inf = infundibulo(g, new Array(40).fill(0), 40), NK = inf.marcos.length - 1;
  const a = (k) => mix(g.aR, inf.rP, paso(0, 1, inf.marcos[k].t)), b = (k) => mix(g.bR, inf.rP, paso(0, 1, inf.marcos[k].t));
  return { proximal: 2 * Math.max(a(0), b(0)), plax: 2 * a(Math.round(NK / 2)), distal: 2 * a(NK - 1) };
}
