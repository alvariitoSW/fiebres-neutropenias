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

import { construirCorazon2, baseGeometrica2 } from './corazon-geo-2.mjs';
import { earcut } from './earcut.mjs';
import { PUNTOS_ABDOMEN } from './abdomen-puntos.mjs';
import { construirTorax } from './torax.mjs';
import { REF, LIMITES, VOL_MIN, geomVi, tapseDeLatido, acortamientoVd, ACORT_LONG_VD, FE_VD_REF, R_LINEAL_ACORT_VD, REFUERZO_ACORT_VD, SB, balaExacta, N_VOL, volPerfil, paso,
  bala, perfil, escalaAnillo, ALFA_SEPTO, PHI_SEPTO, RVOT, EXP_AREA_VD, radioConCuerda, areaCuerda, U_VI, viConSeptal, anillosDe, paredVdDe, paredesDe } from './anatomia.mjs';
// API antigua: estos nombres siguen saliendo de aquí (ahora viven en anatomia.mjs, el lado del corazón)
export { PHI_SEPTO, EXP_AREA_VD, radioConCuerda, anillosDe, paredesDe, paredVdDe, viConSeptal };
export { REF, LIMITES, VOL_MIN, geomVi, tapseDeLatido, acortamientoVd, ACORT_LONG_VD, FE_VD_REF, R_LINEAL_ACORT_VD, REFUERZO_ACORT_VD };

const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const mix = (a, b, t) => a + (b - a) * t;
export const CONTRAE_TSVD = 0.2;      // fracción del diámetro del infundíbulo que se cierra con la eyección normal (ilustrativo)
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

// Perfil del VD de la base al ápex: (1 − s^e)^p. Con 2,2 / 0,6 el VD era un tubo de lados paralelos con el ápex romo; con
// 1,5 / 0,85 se estrecha de forma casi lineal y en el A4C sale triangular, «bastante más pequeño en área» que el VI
// (Mitchell 2019, p. 26). Ilustrativo; las medidas (basal, medio, largo) se comprueban con Lang 2015 p. 20 (N2)
const PERFIL_VD = [1.5, 0.85];

// ---- Perfil del VI: base casi fija (anillo) que se funde en una bala ---------

const FOSA = { a: 7, b: 3 };            // semiejes (mm) de la fosa oval en el tabique interauricular (ilustrativo, N1)
const EUSTAQUIO = { radio: 8, largo: 12 };   // orificio de la cava inferior y largo del pliegue (mm, ilustrativo, N1)
// margen del cuello de cada aurícula sobre su anillo AV (mm, ilustrativo)
const MARGEN_AU = { ai: 3, ad: 3 };
// alto / ancho de las aurículas: eje mayor / eje menor de la AD del varón en Lang 2015, p. 30 (Tabla 13): 2,4 / 1,9 cm/m².
// La AI usa la misma proporción (sus ejes están en el Suplemento de Lang, que no tenemos: hueco; ilustrativo)
const PROPORCION_AU = 2.4 / 1.9;
const RM_NORMAL = 27.8;   // radio medio de la cavidad del VI normal en telediástole (mm; sale de geomVi con 119 mL)
const ELONGA_AD = 0.15;   // elongación del cuello de la AD en el plano del A4C (ajustes.auVolumen; ilustrativo)
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
function rellenarEnvolvente(env, piezas, { zTop, zBot0, dz, df, wZ, wF, NF, NP, fase = 0 }) {
  const wj = new Float64Array(8);
  for (const pz of piezas) { const Q = pz.pos;
    for (let i = 0; i < Q.length; i += 3) {
      const z = Q[i + 2]; if (z < zBot0) continue;
      const c = centroSaco(z), x = Q[i] - c[0], y = Q[i + 1] - c[1];
      const r = Math.sqrt(x * x + y * y), f = Math.atan2(y, x) - fase;
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
  const la = (v.largoMm ?? l * (v.largoAbierta ?? 1.05)) * vv;
  // thPunta (dibujo nuevo): el ángulo crece de thAbierta en el anillo a thPunta en el borde libre (sin gancho en la base)
  const girada = (th) => { if (v.haciaSepto) { const f = th * (1 + (v.thPunta / v.thAbierta - 1) * vv * vv); return sum(B, sum(esc(v.haciaSepto, la * Math.sin(f)), esc(v.n, la * Math.cos(f)))); } const t = v.thPunta === undefined ? th : th * (1 + (v.thPunta / v.thAbierta - 1) * vv * vv); return sum(B, sum(esc(w, la * Math.cos(t)), esc(v.n, la * Math.sin(t)))); };
  const media = girada(v.thAbierta / 2), abie = girada(v.thAbierta);
  const k0 = (1 - a) * (1 - 2 * a), k1 = 4 * a * (1 - a), k2 = a * (2 * a - 1);
  return [0, 1, 2].map(c => k0 * cerr[c] + k1 * media[c] + k2 * abie[c]);
}

// ---- Construcción --------------------------------------------------------------
// estado: { vvi, vvd, vai, vad, mitral, tricus, aortica, pulmonar (0..1), liquidoPeri }
// opciones: { corte: null | { phi }, detalle, pericardio, calidad }
export function construirCorazonHoy(estado, opciones = {}) {
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
  const NPS = 2 * NP;   // R1b: el saco lleva el doble de columnas (una lámina lisa, no un polígono)
  const NR = Math.max(20, Math.round(40 * q));          // puntos por anillo (válvulas, aurículas, vasos)
  const phi0 = corte ? corte.phi : 0, span = corte ? Math.PI : TAU;
  const dentroCorte = (phi) => !corte || (corte.nx * Math.cos(phi) + corte.ny * Math.sin(phi) >= -1e-9);
  const geo = baseGeometricaHoy(estado, opciones.ajustes);
  const { alfaZ, vi, rEndoVi, rEpiVi, endoVi, epiVi, Lvd, A, ventana, Wb, wRV, tvdW, endoVd, epiVd,
    anilloMitral, mc, aM, bM, U, anilloAortico, ac, rA, anilloTricus, ct, rT, anilloRVOT, cR, aR, bR, phiR, ReB, rimRV } = geo;

  // Trabéculas: crestas que entran en la cavidad (ilustrativo). VI: finas, en el tercio apical; VD: gruesas,
  // en los dos tercios apicales (la entrada y el ápex son trabeculados; el infundíbulo es liso)
  const kPap = opciones.ajustes?.papilaresEscala ? Math.pow(clamp((estado.vviTd ? geomVi(estado.vviTd, geo.mio, 0, opciones.ajustes?.esfericidad ?? null) : vi).Rm / RM_NORMAL, 0.45, 1), opciones.ajustes?.papilaresExp ?? 1) : 1;
  const cresta = (a, b) => { const x = Math.max(0, Math.sin(a)), y = Math.max(0, Math.sin(b)); return x * x * x + 0.6 * y * y * y; };
  // ajustes.papilaresLibres (dibujo nuevo): ni trabéculas ni papilares en el arco plano del tabique: quedan en la pared libre (anterolateral y posteromedial)
  const libreSeptal = (z, f) => { if (!opciones.ajustes?.papilaresLibres) return 1; const a = alfaZ(z); if (a <= 0) return 1;
    return paso(a + 0.05, a + 0.55, Math.abs(Math.atan2(Math.sin(f - PHI_SEPTO), Math.cos(f - PHI_SEPTO)))); };
  const trabVi = (z, f) => { const s = f * rEndoVi(z); return libreSeptal(z, f) * kPap * paso(0.45, 0.85, -z / vi.L) * cresta(0.55 * s + 0.12 * z, 0.34 * s - 0.25 * z); };
  const trabVd = (z, f) => { const s = f * (rEpiVi(z, f) + wRV(z, f)); return 1.8 * paso(0.2, 0.55, -z / Lvd) * cresta(0.42 * s + 0.15 * z, 0.26 * s - 0.3 * z + 1.3); };
  // cerca del ápex la cavidad se cierra: las trabéculas se desvanecen con el radio (si no, quedaba una "aguja")
  const endoViT = (z, f) => { const re = rEndoVi(z, f), r = Math.max(0, re - trabVi(z, f) * Math.pow(clamp(re / 7, 0, 1), 2)); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const endoVdT = (z, f) => { const re = rEpiVi(z, f), w = wRV(z, f); const r = re + Math.max(0.3 * w, w - trabVd(z, f) * clamp(w / 6, 0, 1)); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const NZe = corte ? Math.round(44 * q) : NZ, NPe = corte ? Math.round(110 * q) : Math.round(96 * q),   // R3: 96 columnas en el VI (con 48 el eje corto del TEP salía de 7,5° en 7,5°, como un polígono)
     NPVe = corte ? Math.round(84 * q) : NPV;
  // oclusión: la cavidad se oscurece hacia el ápex; el epicardio, en los surcos interventriculares
  const aoEndoVi = (x, y, z) => 0.55 + 0.45 * Math.pow(1 - clamp(-z / vi.L, 0, 1), 0.7);
  const aoEndoVd = (x, y, z) => 0.6 + 0.4 * Math.pow(1 - clamp(-z / Lvd, 0, 1), 0.7);
  const surcoIV = (f, z) => z < -Lvd ? 0 : Math.max(Math.exp(-Math.pow((anguloNorm(f) - REF.phiA) / 0.1, 2)), Math.exp(-Math.pow((anguloNorm(f) - REF.phiB) / 0.1, 2)));
  const aoEpiVi = (x, y, z) => 1 - 0.32 * surcoIV(Math.atan2(y, x), z);
  const aoEpiVd = (x, y, z) => { const f = Math.atan2(y, x), w = wRV(z, f); return 0.7 + 0.3 * paso(0, 7, w); };

  // --- Ventrículo izquierdo ---
  const zEndo = (u) => -vi.L * (1 - Math.pow(1 - u, 1.6));
  const zEpi = (u) => -vi.Le * (1 - Math.pow(1 - u, 1.6));
  anadir('VI endocardio', conAO(invertir(rejilla(NZe, NPe, (u, v) => endoViT(zEndo(u), phi0 + v * span))), aoEndoVi), COLORES.endocardio, opciones.ajustes?.cavidadNitida ? { dobleCara: true, radioCavidad: vi.Rm } : { dobleCara: true });   // radioCavidad (mm, dibujo nuevo): el eco afina el borde del VI pequeño
  anadir('VI epicardio', conAO(rejilla(NZ, NPe, (u, v) => epiVi(zEpi(u), phi0 + v * span)), aoEpiVi), COLORES.miocardio);
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
  const LeTd = estado.vviTd ? geomVi(estado.vviTd, geo.mio, 0, opciones.ajustes?.esfericidad ?? null).Le : geo.mio === 1 ? LE_REF : geomVi(REF.vVi, geo.mio).Le;
  const descenso = clamp(vi.Le - LeTd, -18, 6);
  // (el TAPSE: la pared libre del VD baja más; explicado en «mover»)
  // F5: acortamiento longitudinal de la pared libre = fracción del largo telediastólico del VD, según lo que el VD se ha vaciado
  const LvdTd = (estado.vviTd ? geomVi(estado.vviTd, geo.mio, 0, opciones.ajustes?.esfericidad ?? null).Le : vi.Le) * REF.lVdRel, vdTd = estado.vvdTd ?? REF.vVd;
  const excVd = clamp(acortamientoVd(1 - estado.vvd / vdTd) * LvdTd, 0, 35);
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
  // P1 · Colapso de la pared libre de la AD (formas.mjs, plieguePared, desde la presión transmural del motor) · R2: la pared
  // libre se INVAGINA, no se borra la cámara. Un hundimiento en campana, local, centrado en el tercio medio de la pared
  // lateral (la que no toca el tabique, hacia fuera del anillo tricúspide, ángulo phiT; σ de 0,45 rad y de 0,3 rad de
  // altura): la pared entra hacia la luz hasta el 80 % de su radio (≈40 % del diámetro de la cámara a pliegue 1) y deja
  // luz a los lados, arriba y abajo del pliegue; el tabique, el suelo (anillo) y el techo (cavas) no se mueven. Es el
  // colapso de la AD de Klein 2013 (p. 987, p. 23 del PDF: la duración del colapso de la AD «excede un tercio del ciclo», ver
  // fuente-p3.md); su duración sale del motor. Forma, anchura y profundidad: ilustrativas
  const PSI_PLIEGUE_AD = 3.23;
  const factorPliegue = (psi, a, plg) => { if (!(plg > 0)) return 1;
    const d = Math.atan2(Math.sin(psi - PSI_PLIEGUE_AD), Math.cos(psi - PSI_PLIEGUE_AD)), e = (a - 0.62) / 0.3;
    return 1 - 0.8 * plg * Math.exp(-(d / 0.45) * (d / 0.45)) * Math.exp(-e * e); };
  // v2 Forma · Tabique interauricular: un solo plano vertical que comparten la AI y la AD, perpendicular a la línea que une
  // los centros de la mitral y la tricúspide, a media pared del tabique interventricular (ReB − t/2: el tabique de las
  // aurículas sigue al de los ventrículos en la cruz del corazón). Cada aurícula llega a él con su pared septal y ninguna
  // lo cruza: en el corte, las dos paredes caen en la misma línea (antes, dos cúpulas separadas por ~25 mm de nada, con
  // una franja negra entre dos paredes en el A4C). Anatomía general (Mitchell 2019, p. 25-26: el tabique interauricular
  // se ve en el A4C entre las dos aurículas); posición y forma: ilustrativas
  const nTab = norm([ct[0] - mc[0], ct[1] - mc[1], 0]), RTAB = ReB - 0.6 * vi.t;
  // En la cruz, el suelo de cada aurícula solo se abre hasta la mitad del camino al tabique (SUELO_CRUZ) y la pared septal llega
  // al plano a ~1 cm sobre el plano AV (A_CRUZ, ángulo de la cúpula): debajo queda el triángulo fibroso de la cruz, entre las
  // dos paredes y la base (anatomía general). Si el suelo llegara entero al tabique, el volumen del motor dejaba las
  // aurículas bajas y anchas. Ilustrativo
  const SUELO_CRUZ = 0, A_CRUZ = 0.15;
  const ladoTab = (p) => p[0] * nTab[0] + p[1] * nTab[1];          // > RTAB: lado de la AD
  // distancia desde c al tabique en la dirección psi (Infinity si en esa dirección no se llega)
  const hastaTabique = (c0, c1, psi) => { const den = Math.cos(psi) * nTab[0] + Math.sin(psi) * nTab[1], L = (RTAB - c0 * nTab[0] - c1 * nTab[1]) / den; return L > 0 ? L : Infinity; };
  // sep = { w }: peso (0-1) de la pared septal en cada dirección del suelo. Con peso, la pared sube pegada al plano hasta
  // ~el 90 % de la altura y luego cierra el techo; sin peso, la cúpula solo se recorta en el plano
  const cupulaPunto = (c, rho, H, inclin, bulto, a, psi, encoger = 0, plg = 0, sep = null) => {
    const k = ((psi / TAU) * NR % NR + NR) % NR, k0 = Math.floor(k), f = k - k0;
    let rr = mix(rho[k0], rho[(k0 + 1) % NR], f) * Math.pow(Math.cos(a), 0.5) * (1 + bulto * Math.sin(2 * a)) * factorPliegue(psi, a, plg) - encoger;
    const s = Math.sin(a), cx = c[0] + inclin[0] * s, cy = c[1] + inclin[1] * s;
    if (sep) { const L = hastaTabique(cx, cy, psi) - encoger;
      if (L < Infinity) { const ws = mix(sep.w[k0], sep.w[(k0 + 1) % NR], f) * paso(0, A_CRUZ, a) * (1 - paso(0.86, 1, a / (Math.PI / 2))); rr = Math.min(mix(rr, L, ws), L); } }
    return [cx + rr * Math.cos(psi), cy + rr * Math.sin(psi), 0.3 + (H - encoger) * Math.pow(s, 0.85)];
  };
  // Pared septal del suelo: el tabique ocupa la cuerda del plano dentro del VI (sin la raíz aórtica). En las direcciones del
  // suelo que llegan a esa cuerda sin pasar por la raíz aórtica, el suelo va hasta el plano (peso 1, con bordes suaves)
  const medioTab = Math.sqrt(Math.max(0, (ReB - 1) * (ReB - 1) - RTAB * RTAB));
  const tabiqueSuelo = (c, rhoCuello) => {
    let w = rhoCuello.map((r, k) => { const psi = k / NR * TAU, L = hastaTabique(c[0], c[1], psi); if (!(L < 90)) return 0;
      const dx = Math.cos(psi), dy = Math.sin(psi), hx = c[0] + L * dx, hy = c[1] + L * dy, tau = -hx * nTab[1] + hy * nTab[0];
      const t = clamp((ac[0] - c[0]) * dx + (ac[1] - c[1]) * dy, 0, L), dAo = Math.hypot(c[0] + t * dx - ac[0], c[1] + t * dy - ac[1]);
      return (1 - paso(medioTab - 2, medioTab + 4, Math.abs(tau))) * paso(rA, rA + 3, dAo); });
    w = w.map((x, k) => Math.max(x, w[(k + NR - 1) % NR], w[(k + 1) % NR]));
    const rho = rhoCuello.map((r, k) => { const L = hastaTabique(c[0], c[1], k / NR * TAU); return L < Infinity ? Math.min(mix(r, L, SUELO_CRUZ * w[k]), L) : r; });
    return { rho, sep: { w } };
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
  // Con pliegue (plg), cada sección pierde área: fa(a) = Σρ²·F² / Σρ² la cuenta, y la cúpula sube lo justo para conservar el volumen
  // v2 Forma: con la pared septal (dom = { c, inclin, sep }), el área de cada sección se suma punto a punto con la misma
  // cupulaPunto que dibuja (la pared plana del tabique no sigue la fórmula cerrada); sin dom, la fórmula de antes
  const alturaAu = (v, rho, b, baja = descenso, plg = 0, dom = null) => {
    let A0 = 0; for (const r of rho) A0 += r * r; A0 *= Math.PI / NR;           // ½·Σρ²·Δψ, mm²
    const vObj = clamp(v, LIMITES.au[0], LIMITES.au[1]) * 1000, N = 32;
    const fa = new Float64Array(N).fill(1);
    if (dom) for (let i = 0; i < N; i++) { const a = (i + 0.5) / N * Math.PI / 2, c = Math.cos(a), k = 1 + b * Math.sin(2 * a); let sA = 0;
      for (let j = 0; j < NR; j++) { const psi = j / NR * TAU, p = cupulaPunto(dom.c, rho, 40, dom.inclin, b, a, psi, 0, plg, dom.sep), s = Math.sin(a);
        const dx = p[0] - dom.c[0] - dom.inclin[0] * s, dy = p[1] - dom.c[1] - dom.inclin[1] * s; sA += dx * dx + dy * dy; }
      fa[i] = (sA * Math.PI / NR) / (A0 * c * k * k); }
    else if (plg > 0) for (let i = 0; i < N; i++) { const a = (i + 0.5) / N * Math.PI / 2; let sF = 0, s0 = 0;
      for (let k = 0; k < NR; k++) { const F = factorPliegue(k / NR * TAU, a, plg); sF += rho[k] * rho[k] * F * F; s0 += rho[k] * rho[k]; } fa[i] = sF / s0; }
    let H = 40;
    for (let it = 0; it < 4; it++) {
      let G = 0;
      for (let i = 0; i < N; i++) { const a = (i + 0.5) / N * Math.PI / 2, c = Math.cos(a), k = 1 + b * Math.sin(2 * a), s = Math.sin(a);
        const t = clamp((0.3 + H * Math.pow(s, 0.85)) / 45, 0, 1), estira = 1 - baja * 6 * t * (1 - t) / 45;
        G += c * k * k * 0.85 * Math.pow(s, -0.15) * c * estira * fa[i] * (Math.PI / 2 / N); }
      H = clamp(vObj / (A0 * G), 12, 90);
    }
    return H;
  };
  // Forma: el bulto (cuánto se ensancha por encima del cuello) se elige para que alto / ancho máximo sea
  // PROPORCION_AU; con él, la altura da el volumen del motor. Así la aurícula conserva su forma al llenarse y
  // vaciarse (antes: más volumen = más alta con el mismo suelo). Si ni sin bulto llega a esa proporción (poco
  // volumen sobre un cuello ancho), se queda sin bulto, más baja.
  const formaAu = (v, rho, baja = descenso, plg = 0, dom = null) => {
    // el ancho de la forma se mide sin la pared septal (si no, el suelo ensanchado hacia el tabique la dejaba en un cono bajo)
    let rMed = 0; for (const r of dom?.rho0 ?? rho) rMed += r / rho.length;
    const ancho = (b) => { let w = 0; for (let i = 1; i < 16; i++) { const a = i / 16 * Math.PI / 2; w = Math.max(w, Math.sqrt(Math.cos(a)) * (1 + b * Math.sin(2 * a))); } return 2 * rMed * w; };
    // alto tal como se verá: el techo casi no baja con la base y el suelo baja entero (ver «mover»)
    // (la forma se elige sin la pared septal, como antes: con ella, en las aurículas pequeñas la proporción no se alcanzaba y la
    // altura saltaba con cada mL; la altura final sí la cuenta, para que el volumen dibujado sea el del motor)
    const alto = (b) => { const H = alturaAu(v, rho, b, baja, plg); return H - baja * paso(0, 45, 0.3 + H); };
    let lo = -0.2, hi = 1.2;
    if (alto(lo) / ancho(lo) < PROPORCION_AU) return { b: lo, H: alturaAu(v, rho, lo, baja, plg, dom) };
    for (let i = 0; i < 10; i++) { const b = (lo + hi) / 2; alto(b) / ancho(b) > PROPORCION_AU ? lo = b : hi = b; }
    const b = (lo + hi) / 2; return { b, H: alturaAu(v, rho, b, baja, plg, dom) };
  };
  const cupula = (c, rho, H, inclin, bulto, encoger = 0, plg = 0, sep = null) =>
    rejilla(Math.round(18 * q), NR, (u, v) => cupulaPunto(c, rho, H, inclin, bulto, u * Math.PI / 2, v * TAU, encoger, plg, sep));
  const salida = (psi, subir = 0.25) => norm([Math.cos(psi), Math.sin(psi), subir]);
  // AI: sobre la tapa del VI, detrás; se para a 2 mm de la raíz aórtica
  const elipseM = (d) => 1 / Math.sqrt(Math.pow(d[0] * Math.cos(U) + d[1] * Math.sin(U), 2) / (aM * aM) + Math.pow(-d[0] * Math.sin(U) + d[1] * Math.cos(U), 2) / (bM * bM));
  const okAi = (p) => Math.hypot(p[0], p[1]) < ReB - 2 && ladoTab(p) < RTAB;
  const libreAi = huella(mc, okAi, (d) => elipseM(d) + 1, [[ac, rA + 2]]);
  const cuelloAi = cuello(libreAi, elipseM, MARGEN_AU.ai), { rho: rhoAi, sep: sepAi } = tabiqueSuelo(mc, cuelloAi), incAi = [18 * nTab[0], -8 + 18 * nTab[1]];
  const { b: bAi, H: HAi } = formaAu(estado.vai, rhoAi, descenso, 0, { c: mc, inclin: incAi, sep: sepAi, rho0: cuelloAi });
  // AD: sobre la tapa del VD, a la derecha; se para antes del tabique, del borde y de la salida del VD
  const okAd = (p) => { const r = Math.hypot(p[0], p[1]), f = Math.atan2(p[1], p[0]);
    return ventana(f) > 0.05 && r < rimRV(f) - 2 && !dentroHuella(cR, rhoInf, p, 2) && (r > ReB + 0.5 || ladoTab(p) > RTAB); };
  // el VI (salvo por encima del tabique interauricular, que se apoya en el interventricular) y la raíz aórtica, con corte continuo
  const libreAd = huella(ct, okAd, () => rT + 1.5, [[ac, rA + 3]]), incAd = [-4, 0];
  // opciones.ajustes.auVolumen (dibujo nuevo, P4a-2): el cuello de la AD se alarga en el plano del A4C (eje mc→ct) y se estrecha en el
  // perpendicular, con el mismo ancho medio: la altura sale del volumen del motor (alturaAu), así que el volumen no cambia, y el
  // corte A4C, que pasa por el eje largo, recoge el área que da el área-longitud monoplano con ese volumen (Lang 2015, p. 29,
  // Tabla 12: V = 8/(3π)·A²/L); con el cuello redondo el corte daba el 91-94 % (el corte de una cúpula redonda con tabique plano
  // queda por debajo de la elipse). El estiramiento (ELONGA_AD) es ilustrativo; la huella (libreAd) sigue mandando
  const psiPl = Math.atan2(nTab[1], nTab[0]);
  const anilloAd = opciones.ajustes?.auVolumen ? (d) => rT * (1 + ELONGA_AD * Math.cos(2 * (Math.atan2(d[1], d[0]) - psiPl))) : () => rT;
  const cuelloAd = cuello(libreAd, anilloAd, MARGEN_AU.ad), { rho: rhoAd, sep: sepAd } = tabiqueSuelo(ct, cuelloAd);
  // el suelo de la AD baja además lo que baja la pared libre del VD junto al anillo (pesoVd, media sobre el cuello)
  const bajaAd = descenso + extraVd * rhoAd.reduce((m, r, k) => { const psi = k / NR * TAU; return m + pesoVd(ct[0] + r * Math.cos(psi), ct[1] + r * Math.sin(psi), 0) / NR; }, 0);
  const pliAd = clamp(estado.pliegueAd ?? 0, 0, 1);
  const { b: bAd, H: HAd } = formaAu(estado.vad, rhoAd, bajaAd, pliAd, { c: ct, inclin: incAd, sep: sepAd, rho0: cuelloAd });
  const aoAur = (x, y, z) => 0.72 + 0.28 * paso(0, 9, z);
  anadirR('AI', conAO(cupula(mc, rhoAi, HAi, incAi, bAi, 0, 0, sepAi), aoAur), COLORES.auricula, { dobleCara: true });
  anadirR('AD', conAO(cupula(ct, rhoAd, HAd, incAd, bAd, 0, pliAd, sepAd), aoAur), COLORES.auricula, { dobleCara: true });
  // el saco no se hunde con el pliegue (el líquido llena el hueco): para su envolvente, la AD sin plegar
  const adSinPliegue = pliAd > 0 ? cupula(ct, rhoAd, HAd, incAd, bAd, 0, 0, sepAd).pos : null;
  if (corte) {
    anadirR('AI sangre', cupula(mc, rhoAi, HAi, incAi, bAi, 2, 0, sepAi), COLORES.sangreOx, { alfa: 0.3, dobleCara: true });
    anadirR('AD sangre', cupula(ct, rhoAd, HAd, incAd, bAd, 2, pliAd, sepAd), COLORES.sangreVen, { alfa: 0.3, dobleCara: true });
  }
  // N1 · Fosa oval: la zona central del tabique interauricular donde la pared es más fina (una sola lámina, no dos). Se quita
  // el parche de triángulos del tabique (los que están en el plano, dentro de una elipse) a la AI y a la AD, y la AD lo aporta
  // como pieza «Fosa oval» (misma malla, se mueve con ella), que la imagen dibuja más fina y débil (TEJIDOS.fosaOval).
  // Mitchell 2019, p. 25 (PSAX, «interatrial septum», PDF 25) y p. 31 (subcostal 4C, PDF 31: «particularly important to assess
  // the interatrial ... septa for defects»): el tabique se ve y se evalúa en esas vistas; el libro no da tamaño ni grosor de la
  // fosa: FOSA (semiejes 7 × 3 mm más 4 mm de borde) y su altura son ilustrativos. Se centra donde el A4C corta el tabique (plano por mc y ct).
  if (!corte) {
    const ai = partes.find(p => p.nombre === 'AI'), ad = partes.find(p => p.nombre === 'AD');
    if (ai && ad) {
      const tauDe = (x, y) => -x * nTab[1] + y * nTab[0], tau0 = tauDe(mc[0], mc[1]), z0 = Math.max(13, 0.42 * Math.min(HAi, HAd));
      const enParche = (pos, idx, t, m = 0) => { let sx = 0, sy = 0, sz = 0;
        for (let j = 0; j < 3; j++) { const i = idx[t + j] * 3; if (Math.abs(ladoTab(pos.subarray(i, i + 2)) - RTAB) > 0.4) return false; sx += pos[i]; sy += pos[i + 1]; sz += pos[i + 2]; }
        const du = (tauDe(sx / 3, sy / 3) - tau0) / (FOSA.a + m), dz = (sz / 3 - z0) / (FOSA.b + m); return du * du + dz * dz < 1; };
      const triangulos = (pz, dentro) => { const v = []; for (let t = 0; t < pz.idx.length; t += 3) if (dentro(t)) v.push(pz.idx[t], pz.idx[t + 1], pz.idx[t + 2]); return new Uint32Array(v); };
      // la lámina de la fosa (de la malla de la AD) cubre además un anillo de 4 mm: el borde grueso de la fosa, el limbo (anatomía
      // general). La AD cede a la lámina todo ese anillo (la AD y su lámina suman la malla de antes: mismo volumen); la AI solo cede la
      // elipse y la lámina tapa su agujero aunque las mallas de las dos aurículas no coincidan vértice a vértice
      const lamina = triangulos(ad, t => enParche(ad.pos, ad.idx, t, 4)), huecoAi = triangulos(ai, t => enParche(ai.pos, ai.idx, t));
      ad.idx = triangulos(ad, t => !enParche(ad.pos, ad.idx, t, 4)); ai.idx = triangulos(ai, t => !enParche(ai.pos, ai.idx, t));
      if (lamina.length) anadir('Fosa oval', { pos: new Float32Array(ad.pos), idx: lamina, ao: ad.ao }, COLORES.auricula, { dobleCara: true });
      if (huecoAi.length) anadir('Fosa oval', { pos: new Float32Array(ai.pos), idx: huecoAi, ao: ai.ao }, COLORES.auricula, { dobleCara: true });
    }
  }
  const enAi = (a, psi) => cupulaPunto(mc, rhoAi, HAi, incAi, bAi, a, psi, 0, 0, sepAi);
  const enAd = (a, psi) => cupulaPunto(ct, rhoAd, HAd, incAd, bAd, a, psi, 0, pliAd, sepAd);
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
  // (v2 Forma: nace de la pared anterior de la AD, 0,6 rad por delante de la línea hacia la aorta; antes nacía en la pared
  // que ahora es el tabique y en el A4C engrosaba el tabique interauricular)
  { const psi = Math.atan2(ac[1] - ct[1], ac[0] - ct[0]) + 0.6, p = enAd(0.5, psi), d = salida(psi, 0);
    anadirR('Orejuela derecha', tubo(suave([res(p, esc(d, 3)), p, sum(p, [d[0] * 9, d[1] * 9 + 3, 1]), sum(p, [d[0] * 13 + 2, d[1] * 13 + 10, -3])]), 9, 12, u => 9 * kAd * (1 - 0.6 * u) * Math.sqrt(Math.max(0, 1 - Math.pow(paso(0.8, 1, u), 2)))), COLORES.auricula); }
  // cavas a la AD: superior por el techo, inferior por detrás y abajo
  // (v2 Forma: el tubo empieza 2 mm dentro del techo, no 6: sus paredes cruzaban la AD y en el A4C eran una banda brillante)
  { const p = enAd(0.88, 0.3), eje = suave([[p[0], p[1], p[2] - 2], p, [p[0], p[1] + 2, p[2] + 24], [p[0] + 2, p[1] + 4, p[2] + 48]]);
    anadirR('Vena cava superior', tubo(eje, 8.5, 14), COLORES.vena); vias.vcs = eje.slice().reverse(); }
  // la inferior sale de la AD hacia el hiato del diafragma (abdomen-puntos.mjs). Aquí solo su primer tramo, como vía
  // de la sangre: la malla (calibre que cambia con la PVC y la respiración) la dibuja abdomen.mjs, porque por debajo
  // del diafragma la vena está fija al cuerpo y no puede moverse con el latido
  { const p = enAd(0.18, -1.75), d = norm(res(PUNTOS_ABDOMEN.hiato, p));
    vias.vci = [sum(p, esc(d, 14)), sum(p, esc(d, 7)), p, res(p, esc(d, 4))];
    // N1 · Válvula de Eustaquio: pliegue fino en forma de media luna en el borde anterior del orificio de la cava inferior,
    // inclinado hacia el tabique (la fosa oval). Mitchell 2019, p. 26 (PDF 26, vista del seno coronario: «the Eustachian valve may be visualized
    // in the right atrium») y p. 25 (vista de entrada del VD: «Eustachian valve, Eustachian ridge, coronary sinus ... proximal
    // inferior vena cava»). Tamaño (orificio de 8 mm de radio, pliegue de 12 mm): ilustrativo
    if (!opciones.vistaBase) {
      const delante = [0, 1, 0], e1 = norm(res(delante, esc(d, pto(delante, d)))), e2 = cruz(d, e1);
      anadirR('Válvula de Eustaquio', rejilla(Math.round(4 * q), Math.round(16 * q), (u, v) => { const a = (v - 0.5) * Math.PI, h = u * EUSTAQUIO.largo * Math.cos(a);
        const r = EUSTAQUIO.radio; return [0, 1, 2].map(k => p[k] + r * (Math.cos(a) * e1[k] + Math.sin(a) * e2[k]) - h * d[k] - 0.3 * h * nTab[k]); }), COLORES.valva, { dobleCara: true }); } }

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
  // F5: el infundíbulo (TSVD) se contrae con la eyección del VD (estrechamiento ilustrativo: la fuente no da cifra, hueco)
  const inf = infundibulo(geo, rhoInf, NR, CONTRAE_TSVD * clamp((estado.vvdTd ? 1 - estado.vvd / estado.vvdTd : 0) / FE_VD_REF, 0, 1.3));
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
  // ajustes.velosFinos (dibujo nuevo): velos con la malla fina (24 pasos del anillo al borde y 24 a lo ancho): el corte del plano sale
  // como una línea suave y no como una poligonal de 7 tramos («cuencos»); el grosor lo da la imagen (TEJIDOS.valva), ilustrativo.
  const NV_V = opciones.ajustes?.velosFinos ? 24 : 7, NI_T = opciones.ajustes?.velosFinos ? 24 : 12;
  const valva = (v) => rejilla(NI_T, NV_V, (uu, vv) => puntoValva(v, uu, vv));
  const abajo = [0, 0, -1], arriba = [0, 0, 1];
  const u3 = [Math.cos(U), Math.sin(U), 0], uP3 = [-Math.sin(U), Math.cos(U), 0];
  // Mitral: anterior (1/3 del anillo, 2/3 del área) y posterior; cierran en una "sonrisa" desplazada hacia atrás
  const enAnilloM = (x, y) => [mc[0] + aM * x * u3[0] + bM * y * uP3[0], mc[1] + aM * x * u3[1] + bM * y * uP3[1], 0];
  // P5a · Tenting (IM funcional): con el VI dilatado los papilares se desplazan y tiran de ambos velos hacia el ápex, y la
  // línea de coaptación queda por debajo del plano del anillo (Zoghbi 2017, pp. 320-321). Zoghbi no da cifras de tenting
  // (p. 321): la profundidad máxima, TENTING_MM, es ilustrativa. estado.tenting (0-1) lo da extraDeMotor (formas.mjs)
  const TENTING_MM = 8;   // mm bajo el anillo a tenting 1 (ilustrativo)
  const tentM = clamp(estado.tenting ?? 0, 0, 1) * TENTING_MM * (1 - ap('mitral'));
  const coapM = (t) => { const s0 = 1 - t, P0 = [0.508, 0.79], P1 = [-1.2, 0], P2 = [0.508, -0.79];
    const q = enAnilloM(s0 * s0 * P0[0] + 2 * s0 * t * P1[0] + t * t * P2[0], s0 * s0 * P0[1] + 2 * s0 * t * P1[1] + t * t * P2[1]); return [q[0], q[1], q[2] - tentM]; };
  const baseM = { anillo: anilloMitral, cierre: coapM, n: abajo, prof: 5, pot: 1.3, hundir: 0, abomba: 2.2, apertura: ap('mitral'), carga: cg('mitral'), thAbierta: opciones.ajustes?.mitralTh ?? 1.2, thPunta: opciones.ajustes?.mitralThPunta, largoAbierta: opciones.ajustes?.mitralLargo, largoMm: opciones.ajustes?.mitralLargoMm };
  if (opciones.ajustes?.mitralSepto) { const d = [ac[0] - mc[0], ac[1] - mc[1]], nd = Math.hypot(d[0], d[1]) || 1; baseM.haciaSepto = [d[0] / nd, d[1] / nd, 0]; }   // dibujo nuevo: la valva anterior abierta se curva hacia el tabique (dirección centro mitral → centro aórtico)
  // C1 · Festones (Carpentier, Hahn 2013 p. 942-943): uu = 0 es la comisura posteromedial (ψ = 1) y uu = 1 la anterolateral
  // (ψ = −1), en las dos valvas, que cierran en la misma línea con el mismo uu: así A1-A3 quedan frente a P1-P3. Posterior:
  // tres festones con dos hendiduras (P2, el central, el mayor); anterior: sin hendiduras, solo las mismas tres regiones.
  // Límites 0,3 / 0,7 (P2 el 40 %) y hondura de la hendidura (35 % del largo, solo con la valva abierta): ilustrativos.
  const FESTONES_M = (l) => [[l + '3', 0, 0.3], [l + '2', 0.3, 0.7], [l + '1', 0.7, 1]];
  const HENDIDURA = 0.35, ANCHO_HEND = 0.05, NU_M = 20;
  const hendidura = (v) => v.hendido ? (uu) => 1 - HENDIDURA * v.apertura * Math.max(0, ...[0.3, 0.7].map(s => 1 - Math.abs(uu - s) / ANCHO_HEND)) : () => 1;
  const valvasM = [{ ...baseM, nombre: 'Mitral anterior', psi: (t) => 1 - 2 * t, festones: FESTONES_M('A') },
    { ...baseM, thPunta: undefined, largoAbierta: undefined, largoMm: undefined, haciaSepto: undefined, nombre: 'Mitral posterior', psi: (t) => 1 + (TAU - 2) * t, festones: FESTONES_M('P'), hendido: true }];
  for (const v of valvasM) { v.alto = hendidura(v); v.borde = (uu) => puntoValva(v, uu, v.alto(uu));
    anadirR(v.nombre, rejilla(NU_M, NV_V, (uu, vv) => puntoValva(v, uu, vv * v.alto(uu))), COLORES.valva, { dobleCara: true, segmentos: v.festones, malla: [NU_M, NV_V] }); }
  // B5 · Cortina aorto-mitral: la continuidad fibrosa entre la raíz aórtica (cúspides no coronaria e izquierda) y la valva
  // anterior de la mitral. Una cinta que parte de la raíz (a 3 mm, donde cuelga el anillo valvular aórtico) y llega al anillo
  // mitral (z = 0), en el tramo de la valva anterior más cercano a la raíz (ψ ±0,75 de 1: hasta 6-9 mm de separación). Se
  // mueve con el resto (mover) y su geometría sale del anillo mitral y de la raíz del propio latido: anatomía, fisiología general.
  anadirR('Cortina aorto-mitral', rejilla(8, 6, (uu, vv) => { const m = anilloMitral(-0.75 + 1.5 * uu), a = Math.atan2(m[1] - ac[1], m[0] - ac[0]),
    r = rRaiz(3, a), R = [ac[0] + r * Math.cos(a), ac[1] + r * Math.sin(a)];
    return [R[0] + (m[0] - R[0]) * vv, R[1] + (m[1] - R[1]) * vv, 3 * (1 - vv) * (1 - vv)]; }), COLORES.valva, { dobleCara: true });
  // Valvas en estrella (tricúspide y semilunares): cada una cierra contra las dos vecinas en el centro
  const estrella = (anillo, centro, a, b, ins) => {
    const Ca = lerp(centro, anillo(a), ins), Cb = lerp(centro, anillo(b), ins);
    return (t) => t < 0.5 ? lerp(Ca, centro, 2 * t) : lerp(centro, Cb, 2 * t - 1);
  };
  const cT3 = [ct[0], ct[1], 0], valvasT = [];
  // C1 · Valvas con nombre (Hahn 2013 p. 950): anterior (hacia el infundíbulo), posterior (pared inferior) y septal (junto al
  // tabique), con su proporción en el anillo 1 : 0,75 : 1 (anterior : posterior : septal), Hahn p. 950.
  const VALVAS_T = [['anterior', 0.4, 2.685], ['posterior', 2.685, 4.399], ['septal', 4.399, 0.4 + TAU]];
  for (const [nombreT, a, b] of VALVAS_T) {
    const v = { anillo: anilloTricus, psi: (t) => mix(a, b, t), cierre: estrella(anilloTricus, cT3, a, b, 0.88), n: abajo, prof: 5, pot: 1.3, hundir: 0, abomba: 1.5, apertura: ap('tricus'), carga: cg('tricus'), thAbierta: 1.2 };
    valvasT.push(v); anadirR('Tricúspide', valva(v), COLORES.valva, { dobleCara: true, segmentos: [[nombreT, 0, 1]], malla: [NI_T, NV_V] }); }
  const anilloAoV = (psi) => [ac[0] + (rA - 0.4) * Math.cos(psi), ac[1] + (rA - 0.4) * Math.sin(psi), 3];
  const cAo3 = [ac[0], ac[1], 3];
  // C1 · Cúspides con nombre (Hahn 2013 p. 945): cada una por la coronaria que nace de su seno (ostios en ψ 1,66 y −0,44, abajo)
  const CUSPIDES_AO = ['coronaria derecha', 'no coronaria', 'coronaria izquierda'];
  for (let k = 0; k < 3; k++) { const a = Math.PI / 6 + k * TAU / 3, b = a + TAU / 3;
    anadirR('Aórtica', valva({ anillo: anilloAoV, psi: (t) => mix(a, b, t), cierre: estrella(anilloAoV, cAo3, a, b, 0.92), n: arriba, prof: opciones.ajustes?.cuspidesPlanas ? 0 : 2.5, pot: 3, hundir: opciones.ajustes?.cuspidesPlanas ? 0 : 2, abomba: opciones.ajustes?.cuspidesPlanas ? 0 : 2.5, apertura: ap('aortica'), carga: cg('aortica'), thAbierta: 1.35 }), COLORES.valva, { dobleCara: true, segmentos: [[CUSPIDES_AO[k], 0, 1]], malla: [12, 7] }); }
  const mT = inf.marcos[NK];
  const anilloPuV = (psi) => sum(P, sum(esc(mT.e1, (rP - 0.4) * Math.cos(psi)), esc(mT.e2, (rP - 0.4) * Math.sin(psi))));
  for (let k = 0; k < 3; k++) { const a = k * TAU / 3, b = a + TAU / 3;
    anadirR('Pulmonar', valva({ anillo: anilloPuV, psi: (t) => mix(a, b, t), cierre: estrella(anilloPuV, P, a, b, 0.92), n: TP, prof: opciones.ajustes?.cuspidesPlanas ? 0.4 : 2.5, pot: 3, hundir: opciones.ajustes?.cuspidesPlanas ? 0 : 2, abomba: opciones.ajustes?.cuspidesPlanas ? 1.2 : 2.5, apertura: ap('pulmonar'), carga: cg('pulmonar'), thAbierta: 1.35 }), COLORES.valva, { dobleCara: true }); }

  // --- Grasa del surco AV (rodea la base salvo delante, donde sube el infundíbulo) ---
  const surco = [];
  for (let k = 0; k <= 16; k++) { const f = mix(1.92, REF.phiB, k / 16); const r = rimRV(f) + 0.5; surco.push([r * Math.cos(f), r * Math.sin(f), 2.5]); }
  for (let k = 1; k <= 16; k++) { const f = mix(REF.phiB, TAU + 1.0, k / 16); const r = ReB + 0.5; surco.push([r * Math.cos(f), r * Math.sin(f), 2.5]); }
  anadirR('Grasa del surco AV', tubo(suave(surco, 3), 4.2, 10), COLORES.grasa);

  if (opciones.detalle !== false) {
    // Músculos papilares del VI y cuerdas tendinosas (al borde libre de las valvas mitrales)
    const cuerdas = [];
    const papilares = [];
    // B4: cada papilar nace de la pared (anterolateral y posteromedial), sigue pegado a ella en sus dos tercios inferiores y
    // solo despega la punta, que apunta a las valvas. En sístole se acorta a LP_SIS de su largo (activación del VI, estado.eVi,
    // la misma de la torsión) y se engruesa para conservar su volumen (radio ÷ √largo). La base cuelga de la pared de ese
    // instante, así que baja y se mueve con ella. Largo telesistólico / telediastólico 0,75-0,9: ilustrativo (fisiología general)
    // El largo cambia con vi.L (las fracciones zB/zT cuelgan de él), así que se compensa para que el largo total sea
    // objetivo × el telediastólico. El radio sale del largo medido del trazado (÷ √ el cociente con el de telediástole),
    // así que largo × radio² se conserva (B4).
    const LP_SIS = 0.82, objetivo = 1 - (1 - LP_SIS) * clamp(estado.eVi ?? 0, 0, 1);
    const viTd = estado.vviTd ? geomVi(estado.vviTd, geo.mio, 0, opciones.ajustes?.esfericidad ?? null) : vi, lp = clamp(objetivo * viTd.L / vi.L, 0.5, 1.25);
    // v2 Forma: la punta se cierra en el último 15 % y la base en el primer 6 %, metida en la pared (radio → 0): con la punta abierta, un corte oblicuo no cerraba y el papilar se
    // dibujaba como un lazo en S dentro del VI (A4C del TEP en telesístole); cerrado, el corte es una mancha rellena
    // ajustes.papilaresEscala (dibujo nuevo): el radio de los papilares (5,5 mm en el VI normal) y la altura de las trabéculas siguen al radio
    // de la cavidad (Rm del VI de telediástole sobre el normal, tope 1): en un VI pequeño (HP, TEP) no llenan la cavidad. Proporción ilustrativa.
    const DEP_PAP = 1.0, R0 = 5.5 * kPap, radioDe = (rB) => (u) => rB * (1 - 0.6 * u) * Math.sqrt(Math.max(0, 1 - Math.pow(paso(0.85, 1, u), 2))) * Math.sqrt(Math.max(0, 1 - Math.pow(1 - paso(0, 0.06, u), 2)));
    // trazado del eje: pared(z) → [x, y, z] de la pared en el ángulo del papilar; viX: el VI de ese instante
    const trazarPap = (pared, zB, zT, lpX, rB) => [0, 0.2, 0.4, 0.6, 0.8, 1].map((s) => {
      const z = zB + (zT - zB) * s * lpX, W = pared(z), rW = Math.hypot(W[0], W[1]), rad = radioDe(rB);
      // profundidad hacia el eje: 0 en la base (centro sobre la pared); pegado (60 % del radio) hasta el 85 %; punta al 40 % del radio
      const dep = s <= 0.85 ? DEP_PAP * rad(s) * paso(0, 0.25, s) : mix(DEP_PAP * rad(0.85), 0.4 * rW, paso(0.85, 1, s));
      return [W[0] * (rW - dep) / rW, W[1] * (rW - dep) / rW, z]; });
    const largoPap = (pts) => pts.slice(1).reduce((t, q, i) => t + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1], q[2] - pts[i][2]), 0);
    for (const [phP0, nombre] of [[0.55, 'anterolateral'], [3.95, 'posteromedial']]) {
      // fuera del arco plano, los dos a ≥ 0,55 rad (~31°) de sus uniones con el círculo: dos bultos separados en la pared libre, no en las puntas de la «D»
      const aPap = alfaZ(-vi.L * 0.45), sep = 0.5 * clamp(aPap, 0, 1), phP = opciones.ajustes?.papilaresLibres ? (phP0 > 3 ? Math.max(phP0 + sep, Math.min(5.3, PHI_SEPTO + aPap + 0.55)) : Math.min(phP0 - sep, PHI_SEPTO - aPap - 0.55)) : phP0;   // sep: con el tabique plano, se abren hacia la pared libre
      const zB = -vi.L * 0.6, zT = -vi.L * 0.28, zBd = -viTd.L * 0.6, zTd = -viTd.L * 0.28;
      const paredTd = (z) => { const r = perfil(z, viTd.Rb, viTd.Rm, viTd.L); return [r * Math.cos(phP), r * Math.sin(phP), z]; };
      const p0 = trazarPap((z) => endoVi(z, phP), zB, zT, lp, R0);
      const rBase = R0 * Math.sqrt(largoPap(trazarPap(paredTd, zBd, zTd, 1, R0)) / largoPap(p0));
      const pts = trazarPap((z) => endoVi(z, phP), zB, zT, lp, rBase);
      papilares.push(pts[pts.length - 1]);
      if (!corte || dentroCorte(phP)) anadir('Papilar ' + nombre, tubo(suave(pts, 3), rBase, 10, radioDe(rBase)), COLORES.papilar);
    }
    // C1 · Cuerdas por festón (Hahn 2013 p. 942-943): el papilar anterolateral da cuerdas a la mitad lateral de las dos valvas
    // y el posteromedial a la mitad medial; dos por festón (a ¼ y ¾ de su anchura), al borde libre: A2 y P2 reciben de los dos.
    const PAP_DE = (uu) => uu >= 0.5 ? papilares[0] : papilares[1];
    for (const v of valvasM) for (const [, a, b] of v.festones) for (const f of [0.25, 0.75]) {
      const uu = a + (b - a) * f, tip = v.borde(uu), pc = PAP_DE(uu);
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
      const a = entra(epiVi(zB, phB), -1.5), b = entra(endoVd(zB - 4, phB), Math.min(1.5, 0.5 * tvdW(wRV(zB - 4, phB)))), m = lerp(a, b, 0.5);   // el extremo entra 1,5 mm, o la mitad del grosor si la pared es fina
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
    const da = [bifurc, sobreEpi(1, REF.phiA - 0.06, 3.8)]; for (let i = 1; i <= 12; i++) da.push(sobreEpi(-vi.Le * 0.92 * i / 12, REF.phiA - 0.06 - 0.12 * i / 12, 2.0));
    const cx = [bifurc]; for (let i = 1; i <= 10; i++) cx.push(enSurcoVi(mix(0.52, -1.45, i / 10)));
    const om = [enSurcoVi(-0.3)]; for (let i = 1; i <= 7; i++) om.push(sobreEpi(-vi.Le * 0.6 * i / 7, -0.3 - 0.05 * i / 7, 1.3));
    const cd = [oR, [oR[0] - 3, oR[1] + 7, 9]]; for (let i = 0; i <= 12; i++) cd.push(enSurcoVd(mix(1.95, REF.phiB - 0.05, i / 12)));
    for (let i = 1; i <= 9; i++) cd.push(sobreEpi(-vi.Le * 0.72 * i / 9, REF.phiB + 0.03, 2.0));
    const mg = [enSurcoVd(3.45)]; for (let i = 1; i <= 7; i++) mg.push(sobreEpi(-Lvd * 0.55 * i / 7, 3.45, 1.3));
    const daGrasa = []; for (let i = 0; i <= 12; i++) daGrasa.push(sobreEpi(-vi.Le * 0.9 * i / 12, REF.phiA - 0.06 - 0.12 * i / 12, 0.3));
    const dpGrasa = []; for (let i = 0; i <= 9; i++) dpGrasa.push(sobreEpi(-vi.Le * 0.7 * i / 9, REF.phiB + 0.03, 0.3));
    // v2 Forma: las arterias y la grasa de los surcos van hundidas en el epicardio (antes, 2-4 mm por fuera y la grasa de 3,4 mm de
    // radio): en el eje corto de los papilares salían como bultos redondos fuera del anillo del VI. Ilustrativo
    anadirR('Grasa del surco interventricular anterior', tubo(suave(daGrasa, 3), 2.6, 8), COLORES.grasa);
    anadirR('Grasa del surco interventricular posterior', tubo(suave(dpGrasa, 3), 2.6, 8), COLORES.grasa);
    for (const [n, p, r] of [['Tronco coronario izquierdo', tronCI, 2.2], ['Descendente anterior', da, 1.7], ['Circunfleja', cx, 1.7], ['Obtusa marginal', om, 1.2], ['Coronaria derecha', cd, 1.8], ['Marginal aguda', mg, 1.2]])
      anadirR('Coronaria · ' + n, tubo(suave(p, 3), r, 7), COLORES.coronaria);
    // Seno coronario: por el surco AV posterior hasta la AD, junto a la cava inferior
    const sc = []; for (let i = 0; i <= 8; i++) { const f = mix(-0.5, -1.8, i / 8); sc.push([(ReB + 3.5) * Math.cos(f), (ReB + 3.5) * Math.sin(f), 3.5]); }
    { const p = enAd(0.1, -1.2); sc.push([mix(sc[sc.length - 1][0], p[0], 0.5), mix(sc[sc.length - 1][1], p[1], 0.5) - 3, 4], p); }
    anadirR('Seno coronario', tubo(suave(sc, 3), 3.2, 8, u => 2.4 + 1.6 * u), COLORES.venaCoronaria);
  }

  if (opciones.pericardio && !opciones.vistaBase) {
    // P1 · SACO PERICÁRDICO (capa parietal; la visceral es el epicardio de cada cámara). Antes, por encima del plano AV
    // el saco era una cúpula redonda de 56 mm de radio: dejaba un hueco grande alrededor de las aurículas (líquido
    // oscuro en la imagen sin derrame) y el derrame era un anillo uniforme (3 mm + 0,06 mm por mL en todas partes).
    // Ahora (anatomía general; formas y cifras ilustrativas):
    //  · el saco ABRAZA las aurículas como a los ventrículos: en cada altura, la envolvente convexa (una lámina tensa)
    //    de todo lo que va dentro, a HOLGURA_SACO mm; entre alturas no se hunde más de 1 mm por mm (no se mete en los
    //    surcos) y por encima de lo más alto (las raíces) cierra un tejado, donde se refleja sobre los grandes vasos, que
    //    salen por arriba; las venas pulmonares y las cavas lo atraviesan (reflexiones del seno oblicuo, detrás de la AI);
    //  · el DERRAME se reparte con la gravedad (paciente tumbado: detrás primero), se hace circunferencial al crecer
    //    (delante, alrededor del VD y de la AD), detrás de la AI se queda fino (el seno oblicuo está cerrado por las
    //    reflexiones de las venas pulmonares) y se adelgaza hacia arriba, donde el saco se refleja;
    //  · el volumen que se dibuja entre el saco sin derrame y el saco con derrame es el líquido del motor
    //    (motor.s.liquidoPeri): el grosor se escala con una cuadrática exacta (ver abajo).
    // El saco no se hunde con el pliegue de la AD o del VD (el líquido llena el hueco): sigue a las paredes sin plegar.
    // la rejilla del saco no se mueve al latir (zTop fijo salvo aurículas muy altas): si sus filas cambiaran de altura en
    // cada fotograma, la mezcla de formas precalculadas se separaría de la geometría exacta
    const Z_TOP_SACO = 64;
    const HOLGURA_SACO = 3, SUAVE_SACO = 2, ALTURA_TEJADO = 6, ALTURA_RAIZ = 20, Z_APEX_SACO = 42, liq = Math.max(0, estado.liquidoPeri || 0);
    const { epiVdSinPliegue } = geo;
    const rVentr = (z, f) => Math.hypot(...((ventana(f) > 0.001 && z > -Lvd) ? epiVdSinPliegue(z, f) : epiVi(Math.max(z, -vi.Le * 0.999), f)).slice(0, 2));
    const dentroSaco = partes.filter(pz => pz.pos && /^(VD borde|Base V|AI$|AD$|Orejuela|Infundíbulo|Raíz aórtica|Grasa|Coronaria|Seno coronario)/.test(pz.nombre))
      .map(pz => pz.nombre === 'AD' && adSinPliegue ? { nombre: 'AD', pos: adSinPliegue } : pz);
    let zMax = 0; for (const pz of dentroSaco) for (let i = 2; i < pz.pos.length; i += 3) zMax = Math.max(zMax, pz.pos[i]);
    // el polo de abajo: lo que haga falta para el líquido del ápex (cota holgada; las filas que sobran quedan en r = 0)
    const NP = NPS;
    const NF = NZ + 12, zTop = Math.max(Z_TOP_SACO, zMax + 8), zBot0 = -vi.Le - HOLGURA_SACO - 3 - 0.08 * liq;
    const dz = (zTop - zBot0) / NF, df = TAU / NP, wZ = 1.5 * dz, wF = 1.5 * df;   // núcleo de una celda, rampa de media
    const env = new Float32Array((NF + 1) * NP);
    // las columnas del saco van a medio paso de los ejes (fase): así ninguna cae justo en un plano de simetría del modelo
    const FASE = 0.5 * df;
    rellenarEnvolvente(env, dentroSaco, { zTop, zBot0, dz, df, wZ, wF, NF, NP, fase: FASE });
    const zFila = (fi) => zTop - dz * fi;
    // 1) radio de lo que va dentro, fila a fila: ventrículos (sin pliegue) y la envolvente de lo demás (coronarias, grasa,
    //    aurículas, raíces); 2) envolvente convexa de cada fila; 3) sin bajar más de 1 mm por mm entre filas
    const R0 = new Float64Array((NF + 1) * NP), RAW = new Float64Array((NF + 1) * NP), xs = new Float64Array(NP), ys = new Float64Array(NP);
    const filaConvexa = (fi) => {
      const z = zFila(fi); let n = 0;
      for (let j = 0; j < NP; j++) {
        const f = j * df + FASE; let r = env[fi * NP + j];
        if (z < 0 && z >= -vi.Le) r = Math.max(r, rVentr(z, f));
        R0[fi * NP + j] = r; RAW[fi * NP + j] = r; if (r > 0) n++;
      }
      if (n < 3) return;
      // envolvente convexa (cadena monótona) de los puntos de la fila y radio de cada rayo sobre ella
      const pts = []; for (let j = 0; j < NP; j++) { const r = R0[fi * NP + j]; if (r > 0) pts.push([r * Math.cos(j * df + FASE), r * Math.sin(j * df + FASE)]); }
      pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], hi = [];
      for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
      for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
      const casco = lo.slice(0, -1).concat(hi.slice(0, -1));
      for (let j = 0; j < NP; j++) { const dx = Math.cos(j * df + FASE), dy = Math.sin(j * df + FASE); let best = R0[fi * NP + j];
        for (let k = 0; k < casco.length; k++) { const a = casco[k], b = casco[(k + 1) % casco.length];
          const ex = b[0] - a[0], ey = b[1] - a[1], den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
          const t = (a[0] * ey - a[1] * ex) / den, s = (a[0] * dy - a[1] * dx) / den;
          if (t > 0 && s >= -1e-6 && s <= 1 + 1e-6) best = Math.max(best, t); }
        xs[j] = best; }
      for (let j = 0; j < NP; j++) R0[fi * NP + j] = xs[j];
    };
    for (let fi = 1; fi < NF; fi++) filaConvexa(fi);
    // sin hundirse más de 1 mm por mm de altura (lámina tensa sobre la base y entre las aurículas), por encima del ápex
    const pendiente = (A, fMin = 1) => {
    for (let fi = fMin; fi < NF; fi++) { const z = zFila(fi); if (z < -vi.Le + 12) continue;
      // máximo suave (log-suma-exp, 2 mm): nunca menor que el máximo, y sin esquinas cuando cambia la fila que manda (si no,
      // el saco se mueve a saltos al latir y la mezcla de formas precalculadas se separa de la geometría exacta)
      for (let j = 0; j < NP; j++) { let mx = A[fi * NP + j];
        for (let g = fMin; g < NF; g++) { const zg = zFila(g); if (zg < -vi.Le + 12) continue; const v = A[g * NP + j] - Math.abs(zg - z); if (v > mx) mx = v; }
        let sum = 0; for (let g = fMin; g < NF; g++) { const zg = zFila(g); if (zg < -vi.Le + 12 && g !== fi) continue; const v = g === fi ? A[g * NP + j] : A[g * NP + j] - Math.abs(zg - z); sum += Math.exp((v - mx) / SUAVE_SACO); }
        ys[j] = mx + SUAVE_SACO * Math.log(sum); }
      for (let j = 0; j < NP; j++) A[fi * NP + j] = ys[j]; } };
    pendiente(R0);
    // R1b · saco lleno que sigue la silueta del corazón (sin envolvente convexa): en cada fila, el radio de lo que hay dentro
    // por ángulo (los huecos se rellenan uniendo los vecinos), con la misma pendiente máxima entre filas, alisado con un
    // filtro suave en ángulo y en altura y con un margen local que lo mantiene fuera del corazón. Cuanto más líquido, más
    // se parece a esa lámina; con poco, la envolvente convexa de siempre. El volumen que cambia se descuenta del líquido
    // que reparte kDer: el volumen dibujado sigue siendo el del motor.
    // El tejado (con y sin derrame): media elipse de Z_APEX_SACO − 26 a Z_APEX_SACO mm de altura (lo más alto de dentro, las raíces, queda unos 6-8 mm por debajo); antes era un cono hasta zTop (33 mm de negro sobre el corazón).
    const sRed = paso(120, 388, liq); let extraRed = 0;
    let f1 = 1; while (f1 + 1 < NF && zFila(f1 + 1) >= -vi.Le) f1++;
    // el cierre es fijo (salvo aurículas muy altas): la AI sube y baja 8 mm en cada latido y, si el tejado la siguiera, la mezcla de formas precalculadas se separaría de la exacta
    const zApex = Math.max(Z_APEX_SACO, zMax + 3.5), zb = zApex - ALTURA_RAIZ - ALTURA_TEJADO, hD = zApex - zb;
    let fb = 1; while (fb < f1 && zFila(fb) > zb) fb++;   // primera fila a la altura de la base del tejado o por debajo
    const tejado = (A) => { for (let fi = 1; fi < fb; fi++) { const t = (zFila(fi) - zb) / hD, k = t >= 1 ? 0 : Math.sqrt(1 - t * t);
      for (let j = 0; j < NP; j++) A[fi * NP + j] = Math.max(Math.min(A[fi * NP + j], A[fb * NP + j] * k), RAW[fi * NP + j]); } };
    const SIGMA_SACO = 16, RHO_SACO = 4, OVALO_SACO = 0, MARGEN_SACO = 0, BARRIGA_SACO = 0;   // mm (ilustrativo)
    if (sRed > 0 && fb < f1) {
      const Rn = new Float64Array(R0.length), fila = new Float64Array(NP), tmp = new Float64Array(NP);
      for (let fi = fb; fi <= f1; fi++) {   // silueta por ángulo, con los huecos unidos en línea recta (en x-y) entre vecinos
        let n = 0; for (let j = 0; j < NP; j++) if (RAW[fi * NP + j] > 0) n++;
        if (n < 3) { for (let j = 0; j < NP; j++) Rn[fi * NP + j] = R0[fi * NP + j]; continue; }
        for (let j = 0; j < NP; j++) { if (RAW[fi * NP + j] > 0) { fila[j] = RAW[fi * NP + j]; continue; }
          let a = 1, b = 1; while (RAW[fi * NP + (j - a + NP * 4) % NP] <= 0) a++; while (RAW[fi * NP + (j + b) % NP] <= 0) b++;
          const ja = (j - a + NP * 4) % NP, jb = (j + b) % NP, ra = RAW[fi * NP + ja], rb = RAW[fi * NP + jb];
          const pa = [ra * Math.cos(ja * df), ra * Math.sin(ja * df)], pb = [rb * Math.cos(jb * df), rb * Math.sin(jb * df)], t = a / (a + b);
          fila[j] = Math.hypot(pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1])); }
        for (let j = 0; j < NP; j++) Rn[fi * NP + j] = fila[j]; }
      pendiente(Rn, fb);
      tejado(Rn);
      // filtro gaussiano circular en ángulo (σ en mm de arco según el radio de la fila) y [1 2 1] en altura
      const gauss = (A, fi) => { let m = 0; for (let j = 0; j < NP; j++) m += A[fi * NP + j]; m /= NP;
        const sg = SIGMA_SACO / (Math.max(m, 20) * df), K = Math.ceil(3 * sg); let ws = 0; const w = []; for (let k = -K; k <= K; k++) { const v = Math.exp(-0.5 * (k / sg) ** 2); w.push(v); ws += v; }
        for (let j = 0; j < NP; j++) { let acc = 0; for (let k = -K; k <= K; k++) acc += w[k + K] * A[fi * NP + (j + k + NP * 8) % NP]; tmp[j] = acc / ws; }
        for (let j = 0; j < NP; j++) A[fi * NP + j] = tmp[j]; };
      const gaussZ = (A) => { const sg = SIGMA_SACO / dz, K = Math.ceil(3 * sg), w = [], T = Float64Array.from(A); let ws = 0; for (let k = -K; k <= K; k++) { const v = Math.exp(-0.5 * (k / sg) ** 2); w.push(v); ws += v; }
        for (let fi = 1; fi <= f1; fi++) for (let j = 0; j < NP; j++) { let acc = 0; for (let k = -K; k <= K; k++) acc += w[k + K] * T[Math.min(f1, Math.max(1, fi + k)) * NP + j]; A[fi * NP + j] = acc / ws; } };
      // dilatación con un disco de RHO_SACO mm (en altura y en arco): redondea las esquinas salientes; el filtro, las entrantes
      const dil = (A) => { const T = Float64Array.from(A), a = Math.max(1, Math.round(RHO_SACO / dz));
        for (let fi = 1; fi <= f1; fi++) { let m = 0; for (let j = 0; j < NP; j++) m += T[fi * NP + j]; m /= NP; const rj = Math.max(m, 20) * df;
          for (let j = 0; j < NP; j++) { let mx = T[fi * NP + j];
            for (let di = -a; di <= a; di++) { const ii = fi + di; if (ii < 1 || ii > f1) continue; const w = Math.sqrt(Math.max(0, RHO_SACO * RHO_SACO - di * dz * di * dz)), b = Math.floor(w / rj);
              for (let dj = -b; dj <= b; dj++) { const v = T[ii * NP + (j + dj + NP * 4) % NP]; if (v > mx) mx = v; } }
            A[fi * NP + j] = mx; } } };
      // ovalado: en cada fila se mezcla con la elipse más pequeña (ejes del modelo) que envuelve la silueta, para que los lados
      // largos y rectos del contorno se curven como en un saco real
      for (let fi = 1; fi <= f1; fi++) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, n = 0;
        for (let j = 0; j < NP; j++) { const r = Rn[fi * NP + j]; if (r <= 0) continue; n++; const x = r * Math.cos(j * df + FASE), y = r * Math.sin(j * df + FASE); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        if (n < 8 || x1 - x0 < 10 || y1 - y0 < 10) continue;
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ax = (x1 - x0) / 2, ay = (y1 - y0) / 2; let sc = 1;
        for (let j = 0; j < NP; j++) { const r = Rn[fi * NP + j]; if (r <= 0) continue; sc = Math.max(sc, Math.hypot((r * Math.cos(j * df + FASE) - cx) / ax, (r * Math.sin(j * df + FASE) - cy) / ay)); }
        for (let j = 0; j < NP; j++) { const c = Math.cos(j * df + FASE), sn = Math.sin(j * df + FASE), A2 = (c / (sc * ax)) ** 2 + (sn / (sc * ay)) ** 2, B2 = -2 * (cx * c / (sc * ax) ** 2 + cy * sn / (sc * ay) ** 2), C2 = (cx / (sc * ax)) ** 2 + (cy / (sc * ay)) ** 2 - 1;
          const disc = B2 * B2 - 4 * A2 * C2; if (disc <= 0) continue; const te = (-B2 + Math.sqrt(disc)) / (2 * A2);
          if (te > Rn[fi * NP + j]) Rn[fi * NP + j] += OVALO_SACO * (te - Rn[fi * NP + j]); } }
      // vientre: el saco distendido es más redondo que el corazón (que es un cono): se abomba en altura, nulo en los dos polos
      for (let fi = 1; fi <= f1; fi++) { const t = (zFila(fi) + vi.Le) / (zApex + vi.Le), b = BARRIGA_SACO * Math.sin(Math.PI * Math.min(1, Math.max(0, t))) ** 2;
        for (let j = 0; j < NP; j++) if (Rn[fi * NP + j] > 0) Rn[fi * NP + j] += b; }
      dil(Rn); for (let it = 0; it < 2; it++) { for (let fi = 1; fi <= f1; fi++) gauss(Rn, fi); gaussZ(Rn); }
      // margen local: lo que queda del corazón por fuera, ensanchado y alisado, se suma (el corazón sigue dentro)
      const D = new Float64Array(R0.length); for (let fi = 1; fi <= f1; fi++) for (let j = 0; j < NP; j++) D[fi * NP + j] = Math.max(0, RAW[fi * NP + j] - MARGEN_SACO - Rn[fi * NP + j]);
      const D2 = new Float64Array(R0.length), dzM = Math.max(1, Math.round(SIGMA_SACO / dz));
      for (let fi = 1; fi <= f1; fi++) { const bM = Math.max(1, Math.round(1.5 * SIGMA_SACO / (Math.max(20, Rn[fi * NP]) * df)));
        for (let j = 0; j < NP; j++) { let mx = 0; for (let di = -dzM; di <= dzM; di++) { const ii = fi + di; if (ii < 1 || ii > f1) continue; for (let dj = -bM; dj <= bM; dj++) mx = Math.max(mx, D[ii * NP + (j + dj + NP * 4) % NP]); } D2[fi * NP + j] = mx; } }
      for (let fi = 1; fi <= f1; fi++) gauss(D2, fi);
      for (let fi = 1; fi <= f1; fi++) for (let j = 0; j < NP; j++) Rn[fi * NP + j] = Math.max(Rn[fi * NP + j] + D2[fi * NP + j], RAW[fi * NP + j] - MARGEN_SACO);
      tejado(R0);   // la envolvente convexa también, para mezclar (el tejado de Rn ya está dentro)
      for (let fi = 1; fi <= f1; fi++) for (let j = 0; j < NP; j++) { const a = R0[fi * NP + j], b = a + sRed * (Rn[fi * NP + j] - a);
        R0[fi * NP + j] = b; extraRed += 0.5 * ((b + HOLGURA_SACO) ** 2 - (a + HOLGURA_SACO) ** 2); }
      extraRed *= df * dz / 1000; }
    else tejado(R0);
    // arriba: por encima de lo más alto, la misma lámina tensa (1 mm por mm) cierra un tejado sobre las raíces, donde el
    // saco se refleja sobre los grandes vasos; en zTop, el polo
    // DERRAME: peso de cada punto del saco (ilustrativo). post: 1 detrás (−y, lo declive con el paciente tumbado), 0 delante.
    // circ: parte circunferencial, que crece con el volumen (de ~20 % con poco líquido a ~80 % con mucho)
    const circ = 0.2 + 0.6 * paso(60, 300, liq);
    // seno oblicuo: detrás de la AI (−y), un poco hacia la izquierda del paciente (+x), que es donde queda la AI
    const fSeno = Math.atan2(-1, 0.45);
    const peso = (z, f) => {
      const post = 0.5 * (1 - Math.sin(f)), d = Math.atan2(Math.sin(f - fSeno), Math.cos(f - fSeno));
      const senoOblicuo = 1 - 0.8 * paso(2, 14, z) * Math.exp(-(d / 0.6) * (d / 0.6));
      const reflexion = 1 - paso(zMax - 22, zMax, z);
      return ((1 - circ) * post * post + circ) * senoOblicuo * reflexion;
    };
    let iUlt = 1; while (iUlt + 1 < NF && zFila(iUlt + 1) >= -vi.Le) iUlt++;   // última fila del saco sobre el ápex
    // R1b · casquete del ápex: con el saco lleno, media elipse tan alta como la mitad del radio (con 3 mm era un disco plano, una esquina
    // y un lado recto en el corte). El volumen del casquete (1/3 · altura · Σ r² · Δθ) se descuenta del líquido que reparte kDer.
    let alturaCasco = 0;
    if (sRed > 0) { let sr2 = 0; for (let j = 0; j < NP; j++) sr2 += (R0[iUlt * NP + j] + HOLGURA_SACO) ** 2;
      alturaCasco = Math.min(30, Math.max(0, 0.5 * Math.sqrt(sr2 / NP) - 3)) * sRed; extraRed += alturaCasco * sr2 * df / 3000; }
    // grosor = k · peso, con k tal que el volumen entre el saco sin derrame y con derrame = liq (cuadrática exacta)
    let kDer = 0;
    if (liq > 0) { let a1 = 0, a2 = 0;
      for (let fi = 1; fi < NF; fi++) { const z = zFila(fi); if (z < -vi.Le) break;
        for (let j = 0; j < NP; j++) { const r = R0[fi * NP + j] + HOLGURA_SACO, w = peso(z, j * df + FASE); a1 += r * w; a2 += 0.5 * w * w; } }
      a1 *= df * dz; a2 *= df * dz; kDer = (-a1 + Math.sqrt(a1 * a1 + 4 * a2 * Math.max(0, liq - extraRed) * 1000)) / (2 * a2); }
    const pesoApice = (f) => peso(-vi.Le, f);
    // bajo el ápex, las filas se reparten entre −Le y el polo (a la holgura más el líquido más fino que hay ahí)
    let hPolo = Infinity; for (let j = 0; j < NP; j++) hPolo = Math.min(hPolo, HOLGURA_SACO + kDer * pesoApice(j * df + FASE));
    hPolo += alturaCasco;
    // hacia: cuánto se mete hacia dentro (0 el saco; el derrame, 1,5 mm por dentro, así queda dentro fila a fila)
    const saco = (hacia) => rejilla(NF, NP, (u, v, fi, j) => {
      const f = v * TAU + FASE; let z = zFila(fi), r;
      z = Math.min(z, zApex - hacia);   // las filas por encima del cierre del tejado se apilan en su vértice
      if (u === 0) { z -= hacia; r = 0; }   // los dos polos cierran el saco
      else if (u === 1) { z = -vi.Le - hPolo + hacia; r = 0; }
      else if (z < -vi.Le && sRed > 0) {   // saco redondeado: el casquete del ápex sigue al radio de la última fila (media elipse) y no deja escalón
        const t = (-vi.Le - z) / (-vi.Le - zBot0) * hPolo, rU = R0[iUlt * NP + (j % NP)] + HOLGURA_SACO + kDer * peso(-vi.Le, f);
        z = -vi.Le - t; r = (1 - sRed) * Math.sqrt(Math.max(0, (HOLGURA_SACO + kDer * pesoApice(f)) ** 2 - t * t)) + sRed * rU * Math.sqrt(Math.max(0, 1 - (t / hPolo) ** 2)); }
      else if (z < -vi.Le) { const t = (-vi.Le - z) / (-vi.Le - zBot0) * hPolo, hA = HOLGURA_SACO + kDer * pesoApice(f);
        z = -vi.Le - t; r = Math.sqrt(Math.max(0, hA * hA - t * t)); }
      else r = R0[fi * NP + (j % NP)] + HOLGURA_SACO + kDer * peso(z, f);
      r = Math.max(0, r - hacia);
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
  // TORSIÓN (B3). Sale de la contracción del motor, no del volumen: la activación del VI (estado.eVi, la misma que mueve
  // la elastancia) por la contractilidad del latido (FE del último latido, estado.feLatido). Así un VI vacío por
  // precarga (TEP, hemorragia) con FE normal no gira más, y el fallo y la dilatada (FE baja) giran menos.
  // · Giro neto máximo ápex − base = 7,7° (Mor-Avi 2011, PDF 14, p. 290; voluntarios sanos), con FE normal del modelo (0,62).
  // · Destorsión: tau sigue a eVi^0,35. Esa forma (ilustrativa) deja que se deshaga el 59 % del giro entre el pico y la
  //   apertura de la mitral, dentro del 50-70 % en la relajación isovolumétrica de Mor-Avi (PDF 12, p. 288); el resto, en el llenado precoz.
  // · La FE a la que el giro se anula (0,24) es ilustrativa: Mor-Avi (p. 15) dice que cae con la FE, sin cifra.
  // · Rotación basal y apical por separado: hueco (la fuente solo da el giro neto). Sentido: ápex antihorario y base
  //   horaria vistos desde el ápex (aquí ápex +, base −). El perfil de mover() da neto = 1,33 × tau.
  const FE_NORMAL = 0.62, FE_CERO = 0.24, TORSION_NETA = 7.7 * Math.PI / 180, PERFIL_NETO = 1.33;
  const contrFe = clamp(((estado.feLatido ?? FE_NORMAL) - FE_CERO) / (FE_NORMAL - FE_CERO), 0, 1.15);
  const tau = TORSION_NETA / PERFIL_NETO * contrFe * Math.pow(clamp(estado.eVi ?? 0, 0, 1), 0.35);
  // F5 · La pared libre del VD (y el anillo tricuspídeo lateral, donde se mide el TAPSE) se acorta en sentido longitudinal
  // más que el plano AV común: el TAPSE es ese acortamiento, la fracción ACORT_LONG_VD del largo del VD multiplicada por lo
  // que el VD llega a vaciarse (su activación eVd y la poscarga ya están en ese vaciado: en el TEP no puede vaciar y el
  // anillo apenas baja). Normal ≈ 24 mm (Lang 2015, Tabla 10, p. 23; anormal <17). El exceso sobre el descenso común se
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
  const enAur = (c, rho, H, inclin, bulto, [u, f, r], plg = 0, sep = null) => { const a = 0.15 + u * 1.15; return lerp(ejeAur(c, H, inclin, a), cupulaPunto(c, rho, H, inclin, bulto, a, f * TAU, 0, plg, sep), 0.8 * r); };
  const enCamara = {
    vi: ([u, f, r]) => { const z = -vi.L * (0.05 + 0.8 * u), ph = f * TAU, rr = 0.85 * r * rEndoVi(z, ph); return [rr * Math.cos(f * TAU), rr * Math.sin(f * TAU), z]; },
    vd: ([u, f, r]) => { const z = -Lvd * (0.05 + 0.75 * u), ph = REF.phiA + (0.1 + 0.8 * f) * (REF.phiB - REF.phiA); const rr = rEpiVi(z, ph) + wRV(z, ph) * (0.2 + 0.6 * r); return [rr * Math.cos(ph), rr * Math.sin(ph), z]; },
    ai: (n) => enAur(mc, rhoAi, HAi, incAi, bAi, n, 0, sepAi),
    ad: (n) => enAur(ct, rhoAd, HAd, incAd, bAd, n, pliAd, sepAd),
  };
  const valvulas = { mitral: [mc[0], mc[1], 0], tricus: [ct[0], ct[1], 0], aortica: [ac[0], ac[1], 2], pulmonar: [geo.cR[0], geo.cR[1], -2] };
  const largos = {};
  const largoVia = (pts) => { let l = 0; for (let i = 1; i < pts.length; i++) l += largo(res(pts[i], pts[i - 1])); return l; };
  const viaPorNombre = (n) => n.startsWith('vp') ? vias.vp[+n.slice(2)] : vias[n];
  const flujo = {
    enCamara, valvulas,
    // P5b · origen del chorro de la IM funcional (central): el eje del anillo mitral, a la profundidad de la coaptación (con el
    // tenting de este fotograma). La línea de cierre se desplaza ~4 mm hacia atrás del centro; el chorro sale por el centro (ilustrativo)
    coaptacionMitral: [mc[0], mc[1], -tentM],
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
  // C1 · comisuras de la mitral (los extremos de la línea de cierre, junto al anillo), ya movidas
  // y el punto más hondo de esa línea (el centro de la «sonrisa», frente a A2 y P2)
  const comisuras = { anterolateral: coapM(1), posteromedial: coapM(0), centro: coapM(0.5) }; for (const p of Object.values(comisuras)) mover(p);
  return { partes, vi, A, Lvd, geo, descenso, descensoVd: -excVd, anilloTricLateral, flujo, comisuras };
}

// ---- Dimensiones de la base y funciones de superficie -------------------------
// ajustes (opcional; solo el dibujo nuevo, corazon-geo-2.mjs): { paredVdNormal, septoContinuo, auVolumen, vdLargoPropio } — sin ajustes, el dibujo de hoy idéntico.
// el largo del VD solo crece con un VD dilatado (raíz cúbica por encima de su volumen normal): uno vacío (hipovolemia, 20 mL) no se acorta, el volumen va al ancho; así conserva luz (≥ 3 mm a media altura)
const LVD_PISO_REL = 1;
const GANANCIA_SEPTO = 8;   // 8 (antes 4): con pVD > pVI el tabique ya está plano y el IE de la TEP en telesístole no baja del de telediástole (Ryan 1985 JACC 5:918: máximo en telesístole); el motor da menos gradiente en telesístole (4 frente a 9 mmHg) y con 4 el dibujo seguía ese gradiente; ilustrativo
const LVD_TOPE_ILUSTRATIVO = 112;
export function baseGeometricaHoy(estado, ajustes = {}) {
  // Formas de enfermedad (escenarios.mjs): mioVi = masa del VI respecto a la normal; septo (0-1) = cuánto se aplana
  // el tabique en este instante (formas.mjs, aplanamientoSeptal: sale del gradiente de presión VI−VD)
  // ajustes.septoContinuo (dibujo nuevo, P4b): el tabique sigue el septoSigno continuo del motor (0…1, contrato.mjs) con una
  // ganancia GANANCIA_SEPTO que lo satura sin escalón; así aplana ya con pVD ≈ pVI. El umbral clínico (LVEI >1,1 en HP/TEP
  // graves) es de ESC/ERS 2022 p. 3645 Tabla 10; la curva, ilustrativa.
  const septoIn = ajustes.septoContinuo && estado.septoSigno != null ? Math.tanh(GANANCIA_SEPTO * estado.septoSigno) / Math.tanh(GANANCIA_SEPTO) : estado.septo;
  const mio = estado.mioVi ?? 1, septo = clamp(septoIn ?? 0, 0, 1);
  // ajustes.septoRecto (dibujo nuevo): las uniones del tabique plano con el círculo se redondean menos (KU < 1): el eje corto se ve en «D»
  // (ESC/ERS 2022 p. 3645 Tabla 10: tabique aplanado) y el LVEI no se diluye en el redondeo. La escala es ilustrativa.
  const KU = ajustes.septoRecto ? ajustes.septoRecto : 1;
  // septoRectoEndo (dibujo nuevo): solo el endocardio septal (la cavidad) con uniones aún más vivas; el epicardio sigue con KU (no toca el VD)
  const KUe = ajustes.septoRectoEndo ? ajustes.septoRectoEndo : KU;
  // Tabique aplanado: en la zona media del VI, la parte del tabique se corta por una cuerda (corte en «D»). La pared
  // conserva su grosor (el epicardio se corta por una cuerda paralela). α: medio ángulo del arco aplanado (ilustrativo)
  const { vi, alfa } = viConSeptal(estado.vvi, mio, septo, KUe, ajustes.septoHondo || 0, ajustes.esfericidad ?? null);   // anatomia.mjs
  const vvd = clamp(estado.vvd, LIMITES.vd[0], LIMITES.vd[1]);
  // se piden muchas veces con el mismo z o el mismo ángulo (filas y columnas de las rejillas)
  const rEndoViC = memo((z) => perfil(z, vi.Rb, vi.Rm, vi.L));
  const rEpiViC = memo((z) => perfil(Math.max(z, -vi.Le), vi.ReB, vi.Rme, vi.Le));
  const alfaZ = memo((z) => alfa(z, vi.L));
  // radio del VI en (z, ángulo), con el tabique aplanado si toca
  // el tabique aplanado se une al círculo con uniones redondeadas (radioConCuerda, R3)
  const rEndoVi = (z, f) => { const r = rEndoViC(z); if (f === undefined) return r; const a = alfaZ(z); if (a <= 0) return r;
    return radioConCuerda(r, r * Math.cos(a), a, f, KUe); };
  const rEpiVi = (z, f) => { const r = rEpiViC(z); if (f === undefined) return r; const a = alfaZ(z); if (a <= 0) return r;
    return radioConCuerda(r, r - rEndoViC(z) * (1 - Math.cos(a)), a, f, KU); };
  const endoVi = (z, f) => { const r = rEndoVi(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const epiVi = (z, f) => { const r = rEpiVi(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const ReB = vi.ReB;

  // Anillos del VI: aórtico (fijo) delante-derecha, mitral (se contrae) detrás-izquierda, con 1,5 mm de continuidad mitroaórtica
  const anil = anillosDe(estado.vvi, estado.vvd), kM = anil.kM;
  const U = U_VI, u = [Math.cos(U), Math.sin(U)], uP = [-u[1], u[0]];
  const rA = anil.rA, dA = vi.Rb - rA - 2, ac = [dA * u[0], dA * u[1]];
  const aM = anil.aM, bM = anil.bM, dM = dA - rA - 1.5 - aM, mc = [dM * u[0], dM * u[1]];
  const anilloMitral = (psi) => [mc[0] + aM * Math.cos(psi) * u[0] + bM * Math.sin(psi) * uP[0], mc[1] + aM * Math.cos(psi) * u[1] + bM * Math.sin(psi) * uP[1], 0];
  const anilloAortico = (psi) => [ac[0] + rA * Math.cos(psi), ac[1] + rA * Math.sin(psi), 0];

  // VD: media luna en torno al VI; en la base, un contorno casi fijo (entrada tricuspídea y salida)
  // ajustes.vdLargoPropio (dibujo nuevo): el largo del VD sale de su volumen, no del largo del VI. Normal: el de hoy
  // (LE_REF·lVdRel); al crecer vvd, con la raíz cúbica. Tope con fuente 83 mm (Lang 2015 Tabla 8 p. 20: 71 ± 6, 2 DE); más allá,
  // sinFuente e ilustrativo, hasta 112 mm (techo de un VD de paciente posible: ápex que alcanza o pasa el del VI)
  // Con VD/VI de volumen >1,3 el ápex del VD sube hasta el nivel del ápex del VI (Mukherjee 2025 Fig. 4B-C, p. 172: «apical traction»,
  // el ápex del VD traccionado y cámaras derechas más grandes; que alcance el ápex del VI es ilustrativo); la transición 1,3→1,8 es ilustrativa.
  const Lvd0 = ajustes.vdLargoPropio ? Math.min(LVD_TOPE_ILUSTRATIVO, LE_REF * REF.lVdRel * Math.cbrt(Math.max(LVD_PISO_REL, clamp(estado.vvdTd ?? vvd, LIMITES.vd[0], LIMITES.vd[1]) / REF.vVd))) * (estado.vviTd ? vi.Le / geomVi(estado.vviTd, mio, 0, ajustes.esfericidad ?? null).Le : 1) : 0;   // el largo sale del volumen de telediástole del VD y sigue al VI en el latido (como el de siempre: nunca pasa el ápex del VI)
  const Lvd = ajustes.vdLargoPropio ? Math.min(LVD_TOPE_ILUSTRATIVO, mix(Lvd0, Math.max(Lvd0, vi.Le), paso(1.3, 1.8, (estado.vvdTd ?? estado.vvd) / (estado.vviTd ?? estado.vvi)))) : vi.Le * REF.lVdRel;
  const ventana = memo((phi) => { const f = anguloNorm(phi); if (f < REF.phiA || f > REF.phiB) return 0; const a = (f - REF.phiA) / (REF.phiB - REF.phiA);
    return Math.pow(Math.sin(Math.PI * a), 0.7) * paso(0, 0.12, a) * paso(0, 0.12, 1 - a); });
  const gauss = (f, c, s) => Math.exp(-Math.pow((anguloNorm(f) - c) / s, 2));
  // el anillo y la base del VD se contraen con el volumen. Por encima del volumen normal, la base crece más deprisa que la
  // raíz cúbica del volumen: el VD dilatado pasa de semiluna a esfera y el anillo tricuspídeo se dilata (Mukherjee 2025,
  // en Atlas · 14). El ritmo (0,9 por cada 110 mL) es ilustrativo
  const kT = anil.kT;   // anatomia.mjs (anillosDe)
  const Wb = memo((f) => kT * Math.sqrt(ventana(f)) * (18 + 13 * gauss(f, 3.23, 0.66) + 15 * gauss(f, 1.72, 0.38)));
  const perfilZ = memo((z) => Math.pow(Math.max(0, 1 - Math.pow(-z / Lvd, PERFIL_VD[0])), PERFIL_VD[1]));
  const SBR = 0.40, wz = (z) => paso(0, SBR, -z / Lvd);
  // P1 · Colapso diastólico de la pared libre del VD (formas.mjs, plieguePared: sale de la presión transmural del motor) ·
  // R2: la pared libre (de delante a la cara diafragmática, la que ven el paraesternal y el subcostal) se INVAGINA hacia el
  // tabique en el tercio medio: un hundimiento en campana (σ de 0,35 rad en el contorno y de 0,2 de la altura, centrado a
  // 0,4 de la altura) hasta el 75 % de la luz a pliegue 1; la luz queda a los lados, arriba y abajo del pliegue. Ni la base
  // (anillo, infundíbulo) ni el ápex se mueven. Como el pliegue entra en la cuadrática de A, el resto de la cavidad se
  // abomba lo justo para que el VD siga teniendo el volumen del motor. Forma, centro (2,4 rad), anchura y profundidad:
  // ilustrativos
  const pliVd = clamp(estado.pliegueVd ?? 0, 0, 1);
  const plieg = pliVd > 0 ? memo((f) => Math.exp(-Math.pow((anguloNorm(f) - 2.4) / 0.35, 2))) : null;
  const pliegZ = (z) => { const e = (-z / Lvd - 0.4) / 0.2; return Math.exp(-e * e); };
  const fVd = pliVd > 0 ? (z, f) => 1 - 0.75 * pliVd * plieg(f) * pliegZ(z) : () => 1;
  // M3 · McConnell (ajuste mcconnell, dibujo nuevo; estado.mcconnell 0-1 lo da contrato.mjs, mcconnellDe): la pared libre MEDIA del VD
  // no se mueve (acinesia) y el ápex se contrae con normalidad (McConnell 1996, Am J Cardiol 78:469-73, PMID 8752195: excursión de la
  // línea media −0,2 ± 0,8 mm en la pared libre media y 5,7 ± 0,8 mm en el ápex, normal). La luz de esa zona se queda en la de la
  // telediástole (Atd, el A del volumen telediastólico); el resto de la cavidad cede el volumen y el ápex se cierra más. Como la luz
  // sigue siendo a + A·b (con b recortada por (1−s)), el volumen del motor se conserva exacto. Zona (centro 0,45 del largo, σ 0,16;
  // σ angular 0,8 en torno a la pared libre, 2,4 rad): ilustrativa.
  const mcc = ajustes.mcconnell && estado.vvdTd ? clamp(estado.mcconnell ?? 0, 0, 1) : 0;
  const sReg = mcc > 0 ? (z, f) => { const e = (-z / Lvd - 0.45) / 0.16, d = (anguloNorm(f) - 2.4) / 0.8; return mcc * Math.exp(-e * e - d * d); } : () => 0;
  // El ápex, en cambio, se cierra con la sístole (excursión normal, 5,7 mm de McConnell sobre una luz apical de unos 11 mm: cierra
  // APEX_CIERRE = 0,5 de su luz: el ápex se mueve ~5,7 mm, la cifra de McConnell 1996 (5,7 ± 0,8 mm; pubmed 8752195). La v2g lo subió a 0,85 (9,6 mm) para leerse mejor; el director lo devolvió a 0,5: no se exagera la fuente, la legibilidad va por el foco VD); p = 1 en cuanto el VD expulsa algo (≥ 5 % de su telediástole), 0 en telediástole. Cifras ilustrativas.
  const APEX_CIERRE = 0.5, pSis = mcc > 0 ? clamp((1 - vvd / estado.vvdTd) / 0.05, 0, 1) : 0;
  const qApex = mcc > 0 ? (z, f) => { const e = (-z / Lvd - 0.85) / 0.15, d = (anguloNorm(f) - 2.4) / 0.8; return 1 - APEX_CIERRE * mcc * pSis * Math.exp(-e * e - d * d); } : () => 1;
  // El endocardio de esa zona se queda donde estaba en la telediástole (radio de la geometría del volumen telediastólico): luz objetivo
  // = radio de la telediástole − radio del epicardio del VI de ahora. Así tampoco lo arrastra el tabique. La luz sigue siendo a + A·b con
  // (1−s) en a y b, y el volumen del motor se conserva exacto.
  const gTd = mcc > 0 ? baseGeometricaHoy({ ...estado, vvd: clamp(estado.vvdTd, LIMITES.vd[0], LIMITES.vd[1]), vvi: estado.vviTd ?? estado.vvi, mcconnell: 0, pliegueVd: 0, septo: estado.septoTd ?? estado.septo, septoSigno: estado.septoSignoTd ?? estado.septoSigno }, ajustes) : null;
  const lObj = mcc > 0 ? (z, f) => gTd.rEpiVi(z, f) + gTd.wRV0(z, f) - rEpiVi(z, f) : null;
  const coefs = (conTd) => { let c0 = 0, c1 = 0, c2 = 0;
    const nz = 20, nf = 40, span = REF.phiB - REF.phiA, df = span / nf;
    for (let i = 0; i < nz; i++) { const z = -Lvd * (i + 0.5) / nz, w = wz(z), pz = perfilZ(z);
      for (let j = 0; j < nf; j++) { const f = REF.phiA + span * (j + 0.5) / nf, re = rEpiVi(z, f), k = fVd(z, f), sr = conTd ? sReg(z, f) : 0;
        const b0 = w * ventana(f) * pz * k * (conTd ? qApex(z, f) : 1), a = (1 - sr) * (1 - w) * Wb(f) * k + (sr > 0 ? sr * lObj(z, f) : 0), b = (1 - sr) * b0;
        c0 += (re * a + 0.5 * a * a) * df * (Lvd / nz); c1 += (re * b + a * b) * df * (Lvd / nz); c2 += 0.5 * b * b * df * (Lvd / nz); } }
    return [c0, c1, c2]; };
  const resolverA = ([c0, c1, c2], Vm) => c0 >= Vm ? 1 : Math.max(1, (-c1 + Math.sqrt(c1 * c1 - 4 * c2 * (c0 - Vm))) / (2 * c2));
  const V = vvd * 1000;
  const sinMc = coefs(false);
  const A = resolverA(mcc > 0 ? coefs(true) : sinMc, V);
  const C0 = sinMc[0];
  // pared libre del VD: más fina al dilatarse; mioVd la engrosa (hipertrofia del VD por sobrecarga de presión, Atlas · 14)
  // B4: engrosa en sístole al activarse el VD (estado.eVd). La parte crónica (dilatación, mioVd) sigue al volumen
  // telediastólico del latido; la sistólica, a la activación, y conserva el volumen de la pared: grosor × área constante, con el
  // área de la pared libre ∝ volumen^EXP_AREA_VD (ilustrativo, se comprueba en las pruebas). Si la cavidad está por debajo de la mitad
  // de su telediástole sin activación (estados extremos), la pared también está gruesa: el miocardio no cambia de volumen. Grosor sistólico del VD: hueco
  // (la fuente da 1-5 mm en diástole, Lang 2015 Tabla 8, p. 20, y no dice cuánto engrosa). Sin estado.vvdTd no engrosa.
  const tVd = paredVdDe(estado);   // anatomia.mjs (mismo cálculo; el grosor lo da el corazón)
  const tvdW = (w) => tVd * paso(0, 8, w);
  // wRV0: la luz sin pliegue (de ella sale el grosor de la pared, que no adelgaza al plegarse, y el saco, que no se hunde)
  const wRV0 = (z, f) => { const l = mix(Wb(f), A * ventana(f) * perfilZ(z) * qApex(z, f), wz(z)), sr = sReg(z, f); return sr > 0 ? (1 - sr) * l + sr * lObj(z, f) : l; };
  const wRV = pliVd > 0 ? (z, f) => wRV0(z, f) * fVd(z, f) : wRV0;
  const endoVd = (z, f) => { const r = rEpiVi(z, f) + wRV(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; };
  // ajustes.paredVdNormal (dibujo nuevo, P4a-1): el grosor tVd se pone en la dirección del radio desde el eje del VI, y
  // donde la pared libre va oblicua a ese radio (el VD dilatado que se abomba) el grosor perpendicular, el que mide la eco,
  // queda corto (HP crónica g=1: 6,4 mm por 8,2). Con el ajuste, el radio se alarga por 1/cos del ángulo entre el radio y
  // la normal de la superficie endocárdica sin pliegue: grosor perpendicular = paredVdDe (Lang 2015 Tabla 8 p. 20, pared
  // libre del VD medida perpendicular a ella). Tope del factor 2 (ilustrativo: evita picos en los bordes de la ventana).
  const oblicua = ajustes.paredVdNormal ? (z, f) => {
    const h = 0.5, dfh = 0.01, rE = (zz, ff) => rEpiVi(zz, ff) + wRV0(zz, ff), r0 = rE(z, f);
    const gz = (rE(z + h, f) - rE(z - h, f)) / (2 * h), gf = (rE(z, f + dfh) - rE(z, f - dfh)) / (2 * dfh * Math.max(r0, 1));
    const k = Math.sqrt(1 + gz * gz + gf * gf);
    return Number.isFinite(k) ? Math.min(2, k) : 1;   // fuera del dominio (bordes de z): sin ajuste
  } : () => 1;
  const epiVd = (z, f) => { const r = rEpiVi(z, f) + wRV(z, f) + tvdW(wRV0(z, f)) * oblicua(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; };
  const epiVdSinPliegue = pliVd > 0 ? (z, f) => { const w = wRV0(z, f); const r = rEpiVi(z, f) + w + tvdW(w) * oblicua(z, f); return [r * Math.cos(f), r * Math.sin(f), z]; } : epiVd;
  const rimRV = (f) => { const w = Wb(f); return ReB + w + tvdW(w); };
  // anillo tricúspide y orificio de salida (infundíbulo) dentro de la media luna
  const phiT = 3.23, rT = anil.rT, dT = ReB + 2 + rT, ct = [dT * Math.cos(phiT), dT * Math.sin(phiT)];
  const anilloTricus = (psi) => [ct[0] + rT * Math.cos(psi), ct[1] + rT * Math.sin(psi), 0];
  // el infundíbulo crece menos que la base: su ventana angular es estrecha y,
  // con el VD muy dilatado, un orificio que creciera con kT se saldría de ella
  const kR = anil.kR;
  const phiR = 1.72, aR = anil.aR, bR = anil.bR, dR = ReB + 2 + aR, cR = [dR * Math.cos(phiR), dR * Math.sin(phiR)];
  const e1R = [Math.cos(phiR), Math.sin(phiR)], e2R = [-Math.sin(phiR), Math.cos(phiR)];
  const anilloRVOT = (psi) => [cR[0] + aR * Math.cos(psi) * e1R[0] + bR * Math.sin(psi) * e2R[0], cR[1] + aR * Math.cos(psi) * e1R[1] + bR * Math.sin(psi) * e2R[1], 0];
  return { alfaZ, vi, mio, septo, rEndoVi, rEpiVi, endoVi, epiVi, ReB, Lvd, A, C0, ventana, Wb, wRV, wRV0, tvdW, endoVd, epiVd, epiVdSinPliegue, rimRV, kM, kT,
    U, anilloMitral, mc, aM, bM, anilloAortico, ac, rA, anilloTricus, ct, rT, anilloRVOT, cR, aR, bR, phiR, e1R, e2R };
}

// Infundíbulo: tubo desde el orificio de salida del VD (z = 0) hasta el anillo pulmonar,
// con marcos por transporte paralelo para que la elipse de abajo pase a círculo arriba sin girar.
function infundibulo(g, rhoInf, NR, contraccion = 0) {
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
    const kc = 1 - contraccion * (1 - paso(0.8, 1, m.t));        // F5: el cuerpo del infundíbulo se estrecha en sístole; la válvula no
    const a = mix(g.aR, rP, s) * kc + extra, b = mix(g.bR, rP, s) * kc + extra;
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

// ---- Fachada única: elige entre el dibujo de hoy y el nuevo (corazon-geo-2.mjs) --------------------------------
// Los importadores no cambian: la imagen, los planos y las medidas usan siempre el mismo dibujo.
// Por defecto, el dibujo nuevo (encendido el 01/11/2026, realismo 9,5). ?dibujo=1 en la URL (navegador), ECO_DIBUJO=1 (Node)
// o usarDibujo(1) (pruebas y jueces) devuelven el dibujo de antes.
let dibujoNuevo = !((typeof process !== 'undefined' && process.env?.ECO_DIBUJO === '1') ||
  (typeof globalThis.location?.search === 'string' && /[?&]dibujo=1(&|$)/.test(globalThis.location.search)));
export function usarDibujo(n) { const antes = dibujoNuevo ? 2 : 1; dibujoNuevo = Number(n) === 2; return antes; }
export function construirCorazon(estado, opciones = {}) { return dibujoNuevo ? construirCorazon2(estado, opciones) : construirCorazonHoy(estado, opciones); }
export function baseGeometrica(estado) { return dibujoNuevo ? baseGeometrica2(estado) : baseGeometricaHoy(estado); }
