// Ecografía modo B cortada del corazón vivo. Puro (sin DOM): las pruebas lo usan en Node y la página
// copia el resultado a un lienzo.
//
// Idea reconstruida, sin copiar código ni modelos, de «The Heart by Ultrasound» (David Ouyang,
// douyang/echodemo; ver README, Créditos): cada vista es un plano fijo en el cuerpo, el corazón se mueve
// a través de él, la malla se corta con el plano y el corte se convierte en una imagen ecográfica
// (moteado que viaja con el tejido, borde brillante donde el haz incide de frente, desenfoque del haz,
// compresión logarítmica). Aquí todo sale de NUESTRA geometría y del MISMO estado que el resto de la
// página (un estado por fotograma).
//
// Coordenadas: las del corazón (mm). El plano es { O (transductor), d (haz, hacia dentro), r (derecha de
// la pantalla), n = r × d }. En el plano, u = r·(p − O) (mm a la derecha) y v = d·(p − O) (profundidad).
// Las vistas se definen solo con puntos anatómicos (centros valvulares, eje del VI, surcos), así que la
// imagen no depende de cómo se oriente el modelo en el espacio.
//
// Valores de ecogenicidad, resolución y ganancia: ilustrativos (física general de la ecografía), no de
// una fuente concreta.
import { baseGeometrica, REF } from './corazon-geo.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const perp = (a, b) => nrm(res(a, esc(b, dot(a, b))));        // a sin su componente en b (b unitario)
const amp = (db) => Math.pow(10, db / 20);

// ---------------------------------------------------------------------------- vistas
// prof (mm) y ángulo del sector (grados), como se suelen ajustar en un adulto. nivel: altura del corte
// transversal (mm sobre el plano AV, en telediástole; el ápex está a −Le).
export const VISTAS = {
  plax: { corto: 'PLAX', nombre: 'Paraesternal eje largo', ventana: 'paraesternal', prof: 160, angulo: 80 },
  psaxAo: { corto: 'PSAX', nombre: 'Paraesternal eje corto · válvula aórtica', ventana: 'paraesternal', prof: 130, angulo: 80, nivel: () => 6 },
  psaxMv: { corto: 'PSAX', nombre: 'Paraesternal eje corto · válvula mitral', ventana: 'paraesternal', prof: 140, angulo: 80, nivel: () => -7 },
  psaxPm: { corto: 'PSAX', nombre: 'Paraesternal eje corto · músculos papilares', ventana: 'paraesternal', prof: 140, angulo: 80, nivel: (vi) => -0.45 * vi.L },
  a4c: { corto: 'A4C', nombre: 'Apical 4 cámaras', ventana: 'apical', prof: 170, angulo: 80 },
  a2c: { corto: 'A2C', nombre: 'Apical 2 cámaras', ventana: 'apical', prof: 170, angulo: 80 },
  a3c: { corto: 'A3C', nombre: 'Apical 3 cámaras (eje largo)', ventana: 'apical', prof: 170, angulo: 80 },
};

// Grosor de la pared torácica bajo el transductor (mm) y separación hasta el pericardio: así el corazón
// empieza a unos 2-2,5 cm de profundidad, como en un adulto delgado.
const PARED = 12, HUECO = 22;

/**
 * El plano de una vista para un corazón con estos volúmenes telediastólicos ({ vvi, vvd }). Se calcula
 * una vez por latido estable: el transductor no se mueve con el corazón (el corazón cruza el plano).
 */
export function planoVista(clave, est) {
  const v = VISTAS[clave]; if (!v) return null;
  const g = baseGeometrica(est), vi = g.vi;
  const Z = [0, 0, 1], A = (p2, z) => [p2[0], p2[1], z], mix2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // hacia la aorta desde el eje: anterior (el VD y el infundíbulo quedan delante); es el haz paraesternal
  const u = [Math.cos(g.U), Math.sin(g.U), 0];
  let O, d, r;
  // apical: el transductor sobre el ápex, en el eje, apuntando a la base
  const apical = (T, r0) => { O = [0, 0, -vi.Le - HUECO]; d = nrm(res(T, O)); r = perp(r0, d); };
  if (v.ventana === 'apical') {
    if (clave === 'a4c') apical(A(mix2(g.ct, g.mc, 0.55), 8), [g.mc[0] - g.ct[0], g.mc[1] - g.ct[1], 0]);      // VI a la derecha
    else if (clave === 'a3c') apical(A(mix2(g.mc, g.ac, 0.5), 8), [g.ac[0] - g.mc[0], g.ac[1] - g.mc[1], 0]);  // aorta a la derecha
    else {
      // 2 cámaras: el plano por el eje que menos toca la media luna del VD (que abarca más de media vuelta),
      // con la pared anterior (junto al surco interventricular anterior) a la derecha
      const th = (REF.phiA + REF.phiB - Math.PI) / 2;
      apical(A(g.mc, 8), [Math.cos(th), Math.sin(th), 0]);
    }
  } else {
    // paraesternal: el transductor delante, a la altura del tercio basal del VI, haz hacia atrás
    const zSonda = -0.3 * vi.L, pVd = g.epiVd(zSonda, g.U), D = Math.hypot(pVd[0], pVd[1]) + HUECO;
    d = esc(u, -1);
    if (clave === 'plax') { O = sum(A([0, 0], zSonda), esc(u, D)); r = perp(Z, d); }                       // base y aorta a la derecha
    else {
      // eje corto: plano perpendicular al eje del VI; a la derecha la pared lateral (lejos del tabique),
      // como se ve desde el ápex
      const z = v.nivel(vi); O = sum(A([0, 0], z), esc(u, D));
      r = [-u[1], u[0], 0]; const fs = (REF.phiA + REF.phiB) / 2;
      if (r[0] * Math.cos(fs) + r[1] * Math.sin(fs) > 0) r = esc(r, -1);
    }
  }
  return { clave, nombre: v.nombre, corto: v.corto, O, d, r, n: nrm(cruz(r, d)), prof: v.prof, mitad: v.angulo / 2 * Math.PI / 180 };
}

/** Un punto del corazón en el plano: [u, v, distancia al plano]. */
export function enPlano(P, p) { const q = res(p, P.O); return [dot(q, P.r), dot(q, P.d), dot(q, P.n)]; }

// ---------------------------------------------------------------------------- qué es cada pieza en la imagen
// clase: pared (miocardio de dos superficies, endo y epi: se rellena lo de en medio), tubo (relleno si su
// corte cierra; si no, línea), linea (pared fina de una sola superficie: aurículas, vasos), valva,
// pericardio. db: ecogenicidad frente al miocardio. ancho (mm) de las líneas.
const TIPOS = [
  [/^VI (endo|epi)cardio$/, { grupo: 'VI', clase: 'pared', db: 0 }],
  [/^VD (endocardio|epicardio|borde)$/, { grupo: 'VD', clase: 'pared', db: 0 }],
  [/^Infundíbulo/, { grupo: 'Infundíbulo', clase: 'pared', db: 0 }],
  [/^(Papilar|Banda moderadora)/, { clase: 'tubo', db: 1, ancho: 3.5 }],
  [/^(AI|AD|Orejuela)/, { clase: 'linea', db: -1, ancho: 2.6 }],
  [/^Base V[ID]$/, { clase: 'linea', db: 0, ancho: 2 }],
  [/^(Raíz aórtica|Aorta|Tronco pulmonar|AP )/, { clase: 'linea', db: 6, ancho: 2.2 }],
  [/^(Vena|Seno coronario)/, { clase: 'linea', db: -3, ancho: 1.3 }],
  [/^Grasa/, { clase: 'linea', db: 3, ancho: 3.5 }],
  [/^Coronaria/, { clase: 'linea', db: 5, ancho: 1.4 }],
  [/^(Mitral|Tricúspide|Aórtica|Pulmonar)/, { clase: 'valva', db: 13, ancho: 1.4 }],
  [/^Pericardio$/, { clase: 'pericardio', db: 14, ancho: 2 }],
];
export const DB = { sangre: -42, extracardiaco: -20, borde: -9, especular: 9 };
const tipoDe = (nombre) => { for (const [re, t] of TIPOS) if (re.test(nombre)) return t; return null; };

// posición del vértice i de una pieza (mezclada si viene de las formas precalculadas)
const lector = (p) => {
  const a = p.pos, b = p.pos2, w = p.mezcla || 0;
  return b && w ? (k) => a[k] + (b[k] - a[k]) * w : (k) => a[k];
};

/**
 * Corta una pieza con el plano. Devuelve los segmentos en el plano [ua, va, ub, vb], las claves de las
 * aristas cortadas (para saber qué puntos comparten triángulos) y, si se da la misma pieza en la forma de
 * referencia (misma topología), dónde estaban esos mismos puntos materiales: con eso el moteado viaja con
 * el tejido. Se descartan los triángulos casi paralelos al plano (su corte sería un borrón).
 */
export function cortarPieza(p, P, ref = null, base = 0) {
  const pos = lector(p), n = p.pos.length / 3, I = p.idx;
  const { O, r, d } = P, nn = P.n;
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) { const k = 3 * i; const x = (pos(k) - O[0]) * nn[0] + (pos(k + 1) - O[1]) * nn[1] + (pos(k + 2) - O[2]) * nn[2]; s[i] = x === 0 ? 1e-6 : x; }
  const R = ref && ref.pos && ref.pos.length === p.pos.length ? ref.pos : null;
  const seg = [], segRef = [], claves = [];
  const punto = (a, b, out) => {
    const t = s[a] / (s[a] - s[b]), ka = 3 * a, kb = 3 * b;
    const x = pos(ka) + (pos(kb) - pos(ka)) * t - O[0], y = pos(ka + 1) + (pos(kb + 1) - pos(ka + 1)) * t - O[1], z = pos(ka + 2) + (pos(kb + 2) - pos(ka + 2)) * t - O[2];
    out.push(x * r[0] + y * r[1] + z * r[2], x * d[0] + y * d[1] + z * d[2]);
    if (R) { const X = R[ka] + (R[kb] - R[ka]) * t - O[0], Y = R[ka + 1] + (R[kb + 1] - R[ka + 1]) * t - O[1], Zr = R[ka + 2] + (R[kb + 2] - R[ka + 2]) * t - O[2];
      segRef.push(X * r[0] + Y * r[1] + Zr * r[2], X * d[0] + Y * d[1] + Zr * d[2]); }
    claves.push((base + Math.min(a, b)) * 2097152 + (base + Math.max(a, b)));
  };
  for (let f = 0; f < I.length; f += 3) {
    const a = I[f], b = I[f + 1], c = I[f + 2];
    const pa = s[a] > 0, pb = s[b] > 0, pc = s[c] > 0;
    if (pa === pb && pb === pc) continue;
    // normal del triángulo: si es casi perpendicular al haz de corte (paralelo al plano), fuera
    const ka = 3 * a, kb = 3 * b, kc = 3 * c;
    const ux = pos(kb) - pos(ka), uy = pos(kb + 1) - pos(ka + 1), uz = pos(kb + 2) - pos(ka + 2);
    const vx = pos(kc) - pos(ka), vy = pos(kc + 1) - pos(ka + 1), vz = pos(kc + 2) - pos(ka + 2);
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, ln = Math.hypot(nx, ny, nz) || 1;
    if (Math.abs(nx * nn[0] + ny * nn[1] + nz * nn[2]) / ln > 0.97) continue;
    if (pa !== pb) punto(a, b, seg);
    if (pb !== pc) punto(b, c, seg);
    if (pc !== pa) punto(c, a, seg);
  }
  return { seg, segRef: R ? segRef : null, claves };
}

/**
 * Pares de extremos sueltos: un corte de endo y epi (superficies abiertas en la base) deja curvas abiertas;
 * cada extremo se une al extremo suelto más cercano (los dos bordes de la pared en el plano AV), y lo que
 * coincide (< 0,6 mm, el mismo punto en dos piezas) se da por unido. Así la pared queda cerrada y se puede
 * rellenar por paridad sin rayas.
 */
function cerrarExtremos(trozos, maxPuente = 30) {
  const grado = new Map(), punto = new Map();
  for (const t of trozos) for (let i = 0; i < t.claves.length; i++) {
    grado.set(t.claves[i], (grado.get(t.claves[i]) || 0) + 1);
    punto.set(t.claves[i], [t.seg[2 * i], t.seg[2 * i + 1], t.segRef ? t.segRef[2 * i] : null, t.segRef ? t.segRef[2 * i + 1] : null]);
  }
  const sueltos = []; for (const [k, g] of grado) if (g === 1) sueltos.push(punto.get(k));
  const usado = new Uint8Array(sueltos.length), puentes = [], puentesRef = [];
  const pares = [];
  for (let i = 0; i < sueltos.length; i++) for (let j = i + 1; j < sueltos.length; j++) pares.push([Math.hypot(sueltos[i][0] - sueltos[j][0], sueltos[i][1] - sueltos[j][1]), i, j]);
  pares.sort((a, b) => a[0] - b[0]);
  let abiertos = 0;
  for (const [dd, i, j] of pares) {
    if (usado[i] || usado[j] || dd > maxPuente) continue;
    usado[i] = usado[j] = 1;
    if (dd < 0.6) continue;
    const a = sueltos[i], b = sueltos[j];
    puentes.push(a[0], a[1], b[0], b[1]);
    if (a[2] != null && b[2] != null) puentesRef.push(a[2], a[3], b[2], b[3]);
  }
  for (const x of usado) if (!x) abiertos++;
  return { puentes, puentesRef, abiertos };
}

/** Segmentos de las cuerdas (líneas 3D) dentro de ±h mm del plano, proyectados; con su distancia. */
function cortarLineas(p, P, h = 2) {
  const L = p.lineas, out = [];
  for (let i = 0; i < L.length; i += 6) {
    const a = enPlano(P, [L[i], L[i + 1], L[i + 2]]), b = enPlano(P, [L[i + 3], L[i + 4], L[i + 5]]);
    // recorte al grosor del corte
    let t0 = 0, t1 = 1; const da = a[2], db = b[2];
    for (const [lim, sg] of [[h, 1], [-h, -1]]) {
      const fa = sg * (da - lim), fb = sg * (db - lim);       // > 0: fuera
      if (fa > 0 && fb > 0) { t0 = 1; t1 = 0; break; }
      if (fa > 0) t0 = Math.max(t0, fa / (fa - fb)); else if (fb > 0) t1 = Math.min(t1, fa / (fa - fb));
    }
    if (t1 <= t0) continue;
    const P0 = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], P1 = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
    const dm = Math.abs(da + (db - da) * (t0 + t1) / 2);
    out.push([P0, P1, dm / h]);
  }
  return out;
}

/**
 * Lo que se ve en el plano, como elementos de imagen, en orden de dibujo (lo de después tapa lo de antes):
 *   { tipo: 'mascara', seg }                       dentro del pericardio
 *   { tipo: 'relleno', seg, db, grupo, puntos, puntosRef, abiertos }   miocardio, papilares cortados
 *   { tipo: 'linea', seg, db, ancho, especular?, grupo, puntos, puntosRef }
 * puntos / puntosRef: pares (actual, referencia) para que el moteado siga al tejido.
 * ref: las mismas piezas en la forma de referencia (telediástole), o null.
 */
export function elementosDelCorte(partes, P, ref = null) {
  const grupos = new Map(), lineas = [], valvas = [], tubos = [], mascara = { tipo: 'mascara', seg: [] }, peri = [];
  let base = 0;
  partes.forEach((p, k) => {
    if (p.lineas) {
      if (p.nombre === 'Cuerdas') for (const [a, b, f] of cortarLineas(p, P)) valvas.push({ tipo: 'linea', seg: [a[0], a[1], b[0], b[1]], db: 4 - 6 * f, ancho: 0.9, grupo: 'Cuerdas' });
      return;
    }
    const t = tipoDe(p.nombre); if (!t || !p.idx) { base += p.pos ? p.pos.length / 3 : 0; return; }
    const r = ref && ref[k] && ref[k].nombre === p.nombre ? ref[k] : null;
    const c = cortarPieza(p, P, r, base); base += p.pos.length / 3;
    if (!c.seg.length) return;
    const el = { seg: c.seg, segRef: c.segRef, claves: c.claves, nombre: p.nombre };
    if (t.clase === 'pared') { if (!grupos.has(t.grupo)) grupos.set(t.grupo, { db: t.db, trozos: [] }); grupos.get(t.grupo).trozos.push(el); }
    else if (t.clase === 'pericardio') { mascara.seg.push(...c.seg); peri.push({ tipo: 'linea', seg: c.seg, segRef: c.segRef, db: t.db, ancho: t.ancho, grupo: 'Pericardio' }); }
    else if (t.clase === 'tubo') tubos.push({ ...el, t });
    else (t.clase === 'valva' ? valvas : lineas).push({ tipo: 'linea', seg: c.seg, segRef: c.segRef, db: t.db, ancho: t.ancho, grupo: p.nombre });
  });
  const out = [mascara];
  for (const [g, { db, trozos }] of grupos) {
    const { puentes, puentesRef, abiertos } = cerrarExtremos(trozos);
    const seg = trozos.flatMap(x => x.seg).concat(puentes);
    const conRef = trozos.every(x => x.segRef);
    const segRef = conRef ? trozos.flatMap(x => x.segRef).concat(puentesRef) : null;
    out.push({ tipo: 'relleno', seg, segRef, db, grupo: g, abiertos });
    // borde de la pared: más brillante donde el haz le da de frente (reflexión especular)
    out.push({ tipo: 'linea', seg, segRef, db: DB.borde, ancho: 1.1, especular: DB.especular, grupo: g });
  }
  for (const x of tubos) {
    // cerrado: cada extremo suelto tiene otro en el mismo sitio (la costura de la rejilla del tubo)
    const cerrado = cerrarExtremos([x], 0.6).abiertos === 0;
    out.push(cerrado ? { tipo: 'relleno', seg: x.seg, segRef: x.segRef, db: x.t.db, grupo: x.nombre, abiertos: 0 }
      : { tipo: 'linea', seg: x.seg, segRef: x.segRef, db: x.t.db, ancho: x.t.ancho, grupo: x.nombre });
  }
  return out.concat(lineas, valvas, peri);
}

// ---------------------------------------------------------------------------- moteado
// Dispersores: una tabla de ruido gaussiano complejo (semilla fija) leída por un hash de la posición del
// punto material en una retícula de 0,15 mm. El tejido lleva sus dispersores consigo (ajuste afín de cada
// estructura entre el corte actual y la forma de referencia); la sangre los cambia cada fotograma.
const NG = 1 << 16, GR = new Float32Array(NG), GI = new Float32Array(NG);
{ let a = 0x9e3779b9 >>> 0; const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < NG; i++) { const m = Math.sqrt(-2 * Math.log(rnd() + 1e-12)) / Math.SQRT2, f = 2 * Math.PI * rnd(); GR[i] = m * Math.cos(f); GI[i] = m * Math.sin(f); } }
const RET = 1 / 0.15;
// ruido de valor suave (retícula de 5 mm, interpolación bilineal suavizada): factor de amplitud de 0,8 a 1,25
const VL = new Float32Array(NG); for (let i = 0; i < NG; i++) VL[i] = Math.pow(10, (GR[i] * 1.6) / 20);
function lento(x, y) {
  const fx = x / 5, fy = y / 5, ix = Math.floor(fx), iy = Math.floor(fy); let tx = fx - ix, ty = fy - iy;
  tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
  const a = VL[hash(ix, iy)], b = VL[hash(ix + 1, iy)], c = VL[hash(ix, iy + 1)], d = VL[hash(ix + 1, iy + 1)];
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}
const hash = (i, j) => { let h = Math.imul(i, 0x27d4eb2d) ^ Math.imul(j, 0x165667b1); h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h ^= h >>> 13; return h & (NG - 1); };

/**
 * Ajuste afín (mínimos cuadrados con un tirón hacia «sin deformación») que lleva los puntos del corte
 * actual a donde estaban en la forma de referencia: q ≈ cR + M·(p − c). Devuelve [cx, cy, rx, ry, a, b, c, d].
 */
/**
 * Campo de desplazamiento suave de una estructura: en una retícula de 3 mm, la media de cuánto se ha movido el
 * tejido cortado (de ahora a la referencia) en cada celda; las celdas vacías se rellenan con la media de sus
 * vecinas (unas pasadas). Sigue también lo que un ajuste afín no puede: la pared que engorda (el endocardio se
 * mueve más que el epicardio). Sin bastantes puntos, null (se usa el ajuste afín).
 */
export function campoDesplazamiento(seg, segRef, celda = 3, pasadas = 5) {
  const n = seg.length / 2; if (!segRef || n < 8) return null;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < seg.length; i += 2) { x0 = Math.min(x0, seg[i]); x1 = Math.max(x1, seg[i]); y0 = Math.min(y0, seg[i + 1]); y1 = Math.max(y1, seg[i + 1]); }
  x0 -= 2 * celda; y0 -= 2 * celda;
  const nx = Math.ceil((x1 - x0) / celda) + 3, ny = Math.ceil((y1 - y0) / celda) + 3;
  const DX = new Float32Array(nx * ny), DY = new Float32Array(nx * ny), C = new Float32Array(nx * ny);
  for (let i = 0; i < seg.length; i += 2) {
    const fx = (seg[i] - x0) / celda, fy = (seg[i + 1] - y0) / celda, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
    const dx = segRef[i] - seg[i], dy = segRef[i + 1] - seg[i + 1];
    for (const [a, b, w] of [[0, 0, (1 - tx) * (1 - ty)], [1, 0, tx * (1 - ty)], [0, 1, (1 - tx) * ty], [1, 1, tx * ty]]) {
      const k = (iy + b) * nx + ix + a; DX[k] += w * dx; DY[k] += w * dy; C[k] += w; }
  }
  for (let k = 0; k < C.length; k++) if (C[k] > 0.05) { DX[k] /= C[k]; DY[k] /= C[k]; C[k] = 1; } else { DX[k] = DY[k] = 0; C[k] = 0; }
  const vec = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let p = 0; p < pasadas; p++) {
    const nuevos = [];
    for (let iy = 0; iy < ny; iy++) for (let ix = 0; ix < nx; ix++) { const k = iy * nx + ix; if (C[k]) continue;
      let sx = 0, sy = 0, c = 0; for (const [a, b] of vec) { const jx = ix + a, jy = iy + b; if (jx < 0 || jy < 0 || jx >= nx || jy >= ny) continue; const q = jy * nx + jx; if (C[q] === 1) { sx += DX[q]; sy += DY[q]; c++; } }
      if (c) nuevos.push(k, sx / c, sy / c); }
    for (let i = 0; i < nuevos.length; i += 3) { DX[nuevos[i]] = nuevos[i + 1]; DY[nuevos[i]] = nuevos[i + 2]; C[nuevos[i]] = 1; }
  }
  return { x0, y0, celda, nx, ny, DX, DY, C };
}
/** Dónde estaba en la referencia el tejido que ahora está en (x, y), según el campo; null si queda fuera. */
export function desplazar(F, x, y) {
  const fx = (x - F.x0) / F.celda, fy = (y - F.y0) / F.celda, ix = Math.floor(fx), iy = Math.floor(fy);
  if (ix < 0 || iy < 0 || ix >= F.nx - 1 || iy >= F.ny - 1) return null;
  const tx = fx - ix, ty = fy - iy, k = iy * F.nx + ix, C = F.C;
  if (!(C[k] && C[k + 1] && C[k + F.nx] && C[k + F.nx + 1])) return null;
  const b = (A) => A[k] + (A[k + 1] - A[k]) * tx + (A[k + F.nx] - A[k]) * ty + (A[k] - A[k + 1] - A[k + F.nx] + A[k + F.nx + 1]) * tx * ty;
  return [x + b(F.DX), y + b(F.DY)];
}

export function ajusteAfin(seg, segRef) {
  const n = seg.length / 2; if (!segRef || !n) return null;
  let cx = 0, cy = 0, rx = 0, ry = 0;
  for (let i = 0; i < seg.length; i += 2) { cx += seg[i]; cy += seg[i + 1]; rx += segRef[i]; ry += segRef[i + 1]; }
  cx /= n; cy /= n; rx /= n; ry /= n;
  let sxx = 0, sxy = 0, syy = 0, aX = 0, aY = 0, bX = 0, bY = 0;
  for (let i = 0; i < seg.length; i += 2) {
    const x = seg[i] - cx, y = seg[i + 1] - cy, X = segRef[i] - rx, Y = segRef[i + 1] - ry;
    sxx += x * x; sxy += x * y; syy += y * y; aX += x * X; aY += y * X; bX += x * Y; bY += y * Y;
  }
  const lam = n * 4;                       // mm²: con pocos puntos o en línea, se queda cerca de la identidad
  const m11 = sxx + lam, m12 = sxy, m22 = syy + lam, det = m11 * m22 - m12 * m12;
  const a = (m22 * (aX + lam) - m12 * aY) / det, b = (m11 * aY - m12 * (aX + lam)) / det;
  const c = (m22 * bX - m12 * (bY + lam)) / det, d = (m11 * (bY + lam) - m12 * bX) / det;
  return [cx, cy, rx, ry, a, b, c, d];
}

// ---------------------------------------------------------------------------- formación de la imagen
// Haz (2,5 MHz con armónicos, ilustrativo): ~0,3 mm de resolución axial (σ) y lateral que crece con la
// profundidad (σ ≈ 0,0085·r, mínimo 0,45 mm). Ventana de visualización: DB_LO..DB_HI.
const SIG_AX = 0.3, SIG_LAT = (r) => Math.max(0.45, 0.0085 * r), DB_LO = -34, DB_HI = 30;

function gauss(sig, cap) { const r = Math.min(cap, Math.max(1, Math.ceil(sig * 2.5))); const k = new Float32Array(2 * r + 1); let s = 0;
  for (let i = -r; i <= r; i++) { const v = Math.exp(-(i * i) / (2 * sig * sig)); k[i + r] = v; s += v; } for (let i = 0; i < k.length; i++) k[i] /= s; return k; }

/**
 * Un ecógrafo de NB haces por NS muestras. formar() devuelve la imagen del sector en un búfer RGBA de
 * ancho × alto píxeles (vértice del sector arriba en el centro) y la rejilla polar en dB (para pruebas).
 */
export function crearEcografo({ ancho = 360, alto = 300, nb = 192, ns = 448 } = {}) {
  let G = null;
  const geometria = (P) => {
    const clave = [P.prof, P.mitad.toFixed(4), ancho, alto].join('|');
    if (G && G.clave === clave) return G;
    const N = nb * ns, dth = 2 * P.mitad / nb, dr = P.prof / ns;
    const X = new Float32Array(N), Y = new Float32Array(N);
    for (let j = 0; j < ns; j++) { const rr = (j + 0.5) * dr; for (let i = 0; i < nb; i++) { const th = -P.mitad + (i + 0.5) * dth; X[j * nb + i] = rr * Math.sin(th); Y[j * nb + i] = rr * Math.cos(th); } }
    // desenfoque: lateral por fila (en haces) y axial; NORM devuelve la potencia media a 1 por fila
    const kAx = gauss(SIG_AX / dr, 6); let s2a = 0; for (const w of kAx) s2a += w * w;
    // lateral: dos pasadas de caja (media móvil) por fila, de semiancho HB, con la varianza de la gaussiana del
    // haz a esa profundidad (2·h·(h+1)/3 = σ²); NORM devuelve la potencia media del ruido a 1 en cada fila
    const HB = new Int16Array(ns), NORM = new Float32Array(ns);
    for (let j = 0; j < ns; j++) {
      const rr = Math.max(4, (j + 0.5) * dr), sg = SIG_LAT(rr) / (rr * dth), h = Math.max(0, Math.min(12, Math.round((Math.sqrt(1 + 6 * sg * sg) - 1) / 2)));
      HB[j] = h; const w = 2 * h + 1; let s2 = 0;
      for (let t = -2 * h; t <= 2 * h; t++) { const c = (w - Math.abs(t)) / (w * w); s2 += c * c; }
      NORM[j] = 1 / (s2 * s2a);
    }
    // pared torácica bajo el transductor (fija): piel, grasa, músculo con estrías, fascia; −1 = no es pared
    // reverberaciones de la pared torácica: una neblina fija en los primeros centímetros (no se mueve con el corazón)
    const CL = new Float32Array(N);
    for (let q = 0; q < N; q++) { const y = Y[q]; if (y >= PARED && y < 50) CL[q] = amp(-18 - 0.55 * (y - PARED)); }
    const PT = new Float32Array(N).fill(-1);
    for (let q = 0; q < N; q++) { const y = Y[q]; if (y >= PARED) continue; const x = X[q], f = y / PARED + 0.04 * Math.sin(x * 0.9);
      PT[q] = amp(y < 1 ? 4 : f < 0.35 ? -13 : f < 0.85 ? -4 + 3 * Math.sin(y * 3.1 + x * 0.3) : 7); }
    // ganancia que no depende del tejido: caída suave con la profundidad y en los bordes del sector
    const GAN = new Float32Array(N);
    for (let j = 0; j < ns; j++) for (let i = 0; i < nb; i++) { const rr = (j + 0.5) * dr, e = (-P.mitad + (i + 0.5) * dth) / P.mitad;
      GAN[j * nb + i] = -0.025 * Math.max(0, rr - 60) - 6 * Math.pow(e, 8); }
    // conversión a la pantalla (píxeles dentro del sector → posición en la rejilla polar)
    const k = Math.min((alto - 8) / P.prof, (ancho - 6) / (2 * P.prof * Math.sin(P.mitad))), cx = ancho / 2, top = 4;
    const PIX = [], FB = [], FS = [];
    for (let py = 0; py < alto; py++) for (let px = 0; px < ancho; px++) {
      const x = (px + 0.5 - cx) / k, y = (py + 0.5 - top) / k; if (y <= 0) continue;
      const rr = Math.hypot(x, y), th = Math.atan2(x, y); if (rr >= P.prof || Math.abs(th) >= P.mitad) continue;
      PIX.push(py * ancho + px); FB.push(clamp((th + P.mitad) / dth - 0.5, 0, nb - 1.001)); FS.push(clamp(rr / dr - 0.5, 0, ns - 1.001));
    }
    G = { clave, N, dth, dr, X, Y, PT, CL, kAx, HB, NORM, GAN, k, cx, top, PIX: Int32Array.from(PIX), FB: Float32Array.from(FB), FS: Float32Array.from(FS),
      A: new Float32Array(N), TAG: new Uint8Array(N), DEN: new Uint8Array(N), I: new Float32Array(N), Q: new Float32Array(N), T: new Float32Array(N), E: new Float32Array(N),
      pix: new Uint8ClampedArray(ancho * alto * 4), filas: Array.from({ length: ns }, () => []) };
    return G;
  };
  // tabla de grises: 1024 niveles, con una pizca de calor como un monitor
  const LUT = new Uint8Array(1024 * 3);
  for (let i = 0; i < 1024; i++) { const v = Math.pow(i / 1023, 1.35); LUT[3 * i] = 6 + v * 244; LUT[3 * i + 1] = 6 + v * 240; LUT[3 * i + 2] = 8 + v * 230; }

  // ---- rasterizado en la rejilla polar
  const aRejilla = (P, u, v) => [(Math.atan2(u, Math.max(v, 1e-3)) + P.mitad) / G.dth - 0.5, Math.hypot(u, v) / G.dr - 0.5];
  /** Relleno por paridad de una sopa de segmentos (no hace falta que estén ordenados). */
  function rellenar(P, seg, fn) {
    const filas = G.filas; for (const f of filas) f.length = 0;
    for (let i = 0; i < seg.length; i += 4) {
      // los segmentos rectos del plano son curvos en la rejilla polar: se trocean cada ~1 mm
      const L = Math.hypot(seg[i + 2] - seg[i], seg[i + 3] - seg[i + 1]), m = Math.max(1, Math.ceil(L / 1));
      let [pb, ps] = aRejilla(P, seg[i], seg[i + 1]);
      for (let q = 1; q <= m; q++) {
        const f = q / m, [b, s] = aRejilla(P, seg[i] + (seg[i + 2] - seg[i]) * f, seg[i + 1] + (seg[i + 3] - seg[i + 1]) * f);
        const lo = Math.min(ps, s), hi = Math.max(ps, s);
        for (let j = Math.max(0, Math.ceil(lo)); j <= Math.min(ns - 1, Math.ceil(hi) - 1); j++) if (j >= lo && j < hi) filas[j].push(pb + (b - pb) * (j - ps) / (s - ps));
        pb = b; ps = s;
      }
    }
    for (let j = 0; j < ns; j++) { const f = filas[j]; if (f.length < 2) continue; f.sort((a, b) => a - b);
      for (let q = 0; q + 1 < f.length; q += 2) { const i0 = Math.max(0, Math.ceil(f[q])), i1 = Math.min(nb - 1, Math.floor(f[q + 1])); for (let i = i0; i <= i1; i++) fn(j * nb + i); } }
  }
  /** Línea gruesa: cada segmento como una cápsula, con el borde suavizado (~0,35 mm). */
  function trazar(P, seg, ancho, dbBase, espec, tag) {
    const { A, TAG, X, Y, dth, dr } = G, h = ancho / 2;
    for (let i = 0; i < seg.length; i += 4) {
      const ax = seg[i], ay = seg[i + 1], bx = seg[i + 2], by = seg[i + 3];
      let db = dbBase;
      if (espec) {
        const tx = bx - ax, ty = by - ay, tl = Math.hypot(tx, ty) || 1, mx = (ax + bx) / 2, my = (ay + by) / 2, ml = Math.hypot(mx, my) || 1;
        const c = Math.abs((-ty * mx + tx * my) / (tl * ml)), c4 = c * c * c * c;
        db += espec * c4;
      }
      const a = amp(db);
      const ra = Math.hypot(ax, ay), rb = Math.hypot(bx, by), ta = Math.atan2(ax, ay), tb = Math.atan2(bx, by);
      const rmin = Math.max(1, Math.min(ra, rb) - h), mth = Math.asin(Math.min(1, h / rmin)) + dth;
      const i0 = Math.max(0, Math.floor((Math.min(ta, tb) - mth + P.mitad) / dth)), i1 = Math.min(nb - 1, Math.ceil((Math.max(ta, tb) + mth + P.mitad) / dth));
      const j0 = Math.max(0, Math.floor((Math.min(ra, rb) - h) / dr - 1)), j1 = Math.min(ns - 1, Math.ceil((Math.max(ra, rb) + h) / dr));
      const ux = bx - ax, uy = by - ay, l2 = ux * ux + uy * uy || 1e-9;
      for (let j = j0; j <= j1; j++) for (let ii = i0; ii <= i1; ii++) {
        const q = j * nb + ii;
        const px = X[q] - ax, py = Y[q] - ay;
        const t = clamp((px * ux + py * uy) / l2, 0, 1), dx = px - t * ux, dy = py - t * uy, dd = Math.sqrt(dx * dx + dy * dy);
        if (dd >= h + 0.35) continue;
        const c = clamp((h - dd) / 0.35 + 0.5, 0, 1);
        if (espec) { if (c * a > A[q]) A[q] = c * a; }       // el borde solo suma brillo, nunca oscurece la pared
        else { A[q] += c * (a - A[q]); if (c >= 0.5) TAG[q] = tag; }
      }
    }
  }

  /**
   * partes: las del corazón en este fotograma (exactas o mezcladas); P: el plano; o.ref: las piezas de la
   * forma de referencia (para el moteado), o.t: tiempo (s; la sangre y el ruido cambian con él), o.ganancia (dB).
   */
  function formar(partes, P, o = {}) {
    geometria(P);
    const { N, A, TAG, DEN, X, Y } = G, reloj = [performance.now()];
    const els = elementosDelCorte(partes, P, o.ref || null); reloj.push(performance.now());
    // fondo: dentro del pericardio, sangre (o espacio pericárdico); fuera, tejido extracardíaco; arriba, la
    // pared torácica en capas (piel, grasa, músculo con estrías, fascia)
    DEN.fill(0); rellenar(P, els[0].seg, (q) => { DEN[q] = 1; });
    const aS = amp(DB.sangre), aE = amp(DB.extracardiaco);
    const PT = G.PT;
    for (let q = 0; q < N; q++) {
      if (PT[q] >= 0) { A[q] = PT[q]; TAG[q] = 0; }
      else if (DEN[q]) { A[q] = aS; TAG[q] = 255; } else { A[q] = aE; TAG[q] = 0; }
    }
    // estructuras: cada grupo con su etiqueta y su ajuste de movimiento
    const mov = [null]; const etiqueta = new Map();
    const campo = [null];
    const tagDe = (el) => { if (!etiqueta.has(el.grupo)) { etiqueta.set(el.grupo, mov.length); mov.push(ajusteAfin(el.seg, el.segRef)); campo.push(campoDesplazamiento(el.seg, el.segRef)); } return etiqueta.get(el.grupo); };
    let abiertos = 0;
    for (const el of els.slice(1)) {
      const tag = Math.min(254, tagDe(el));
      if (el.tipo === 'relleno') { abiertos += el.abiertos; const a = amp(el.db); rellenar(P, el.seg, (q) => { A[q] = a; TAG[q] = tag; }); }
      else trazar(P, el.seg, el.ancho, el.db, el.especular, tag);
    }
    reloj.push(performance.now());
    // dispersores: tejido con los suyos (siguen al tejido), sangre y pared torácica aparte
    const { I, Q, CL } = G, fr = Math.floor((o.t || 0) / 0.02);
    const offU = (Math.imul(fr, 7919) & 1023) * 0.37, offV = (Math.imul(fr, 104729) & 1023) * 0.53, ruido = amp(-40);
    for (let q = 0; q < N; q++) {
      const tg = TAG[q]; let mu = X[q], mv = Y[q];
      if (tg === 255) { mu += offU; mv += offV; }
      else if (tg) { const F = campo[tg], d = F ? desplazar(F, mu, mv) : null;
        if (d) { mu = d[0]; mv = d[1]; }
        else { const m = mov[tg]; if (m) { const x = mu - m[0], y = mv - m[1]; mu = m[2] + m[4] * x + m[5] * y; mv = m[3] + m[6] * x + m[7] * y; } } }
      const h = hash(Math.floor(mu * RET), Math.floor(mv * RET)), hn = hash(q, fr + 17), hc = hash(q, 3);
      // el tejido no es uniforme: una variación lenta (±2 dB, a escala de varios mm) que también viaja con él
      const a = tg && tg !== 255 ? A[q] * lento(mu, mv) : A[q], c = CL[q];
      I[q] = a * GR[h] + ruido * GR[hn] + c * GR[hc]; Q[q] = a * GI[h] + ruido * GI[hn] + c * GI[hc];
    }
    reloj.push(performance.now());
    desenfocar(I); desenfocar(Q); reloj.push(performance.now());
    // envolvente, a dB, con la ganancia propia de cada muestra
    // axial: por filas (los haces son contiguos en memoria); después, envolvente en dB con la ganancia
    const { E, T, NORM, GAN } = G, kAx = G.kAx, ra = (kAx.length - 1) >> 1;
    for (let j = 0; j < ns; j++) {
      const o = j * nb; E.fill(0, o, o + nb); T.fill(0, o, o + nb);
      for (let p = -ra; p <= ra; p++) { const w = kAx[p + ra], o2 = clamp(j + p, 0, ns - 1) * nb; for (let i = 0; i < nb; i++) { E[o + i] += w * I[o2 + i]; T[o + i] += w * Q[o2 + i]; } }
      const nm = NORM[j];
      for (let i = 0; i < nb; i++) { const a = E[o + i], b = T[o + i]; E[o + i] = 4.342944819 * Math.log((a * a + b * b) * nm + 1e-12) + GAN[o + i]; }
    }
    reloj.push(performance.now());
    // a la pantalla
    const { PIX, FB, FS, pix } = G, lo = DB_LO - (o.ganancia || 0), esc = 1023 / (DB_HI - DB_LO);
    pix.fill(0);
    for (let m = 0; m < PIX.length; m++) {
      const fb = FB[m], fs = FS[m], b = fb | 0, s = fs | 0, tb = fb - b, ts = fs - s, q = s * nb + b;
      const e0 = E[q] + (E[q + 1] - E[q]) * tb, e1 = E[q + nb] + (E[q + nb + 1] - E[q + nb]) * tb;
      const kk = clamp(((e0 + (e1 - e0) * ts - lo) * esc) | 0, 0, 1023) * 3, o4 = 4 * PIX[m];
      pix[o4] = LUT[kk]; pix[o4 + 1] = LUT[kk + 1]; pix[o4 + 2] = LUT[kk + 2]; pix[o4 + 3] = 255;
    }
    reloj.push(performance.now());
    const tiempos = { corte: reloj[1] - reloj[0], raster: reloj[2] - reloj[1], moteado: reloj[3] - reloj[2], haz: reloj[4] - reloj[3], envolvente: reloj[5] - reloj[4], pantalla: reloj[6] - reloj[5], total: reloj[6] - reloj[0] };
    /**
     * Modo M: la columna de ESTA imagen a lo largo del haz de ángulo theta (rad, 0 = centro del sector, + a la
     * derecha), de 0 a P.prof mm en `filas` filas, con la misma escala de grises que la imagen. RGB por fila.
     * Una columna por imagen: el modo M sale del mismo corte y del mismo instante que el modo B.
     */
    const columna = (theta, filas) => {
      const out = new Uint8ClampedArray(filas * 3), fb = clamp((theta + P.mitad) / G.dth - 0.5, 0, nb - 1.001), b = fb | 0, tb = fb - b;
      for (let y = 0; y < filas; y++) {
        const fs = clamp(((y + 0.5) / filas * P.prof) / G.dr - 0.5, 0, ns - 1.001), sj = fs | 0, ts = fs - sj, q = sj * nb + b;
        const e0 = E[q] + (E[q + 1] - E[q]) * tb, e1 = E[q + nb] + (E[q + nb + 1] - E[q + nb]) * tb;
        const kk = clamp(((e0 + (e1 - e0) * ts - lo) * esc) | 0, 0, 1023) * 3;
        out[3 * y] = LUT[kk]; out[3 * y + 1] = LUT[kk + 1]; out[3 * y + 2] = LUT[kk + 2];
      }
      return out;
    };
    return { tiempos, columna, tag: TAG, etiquetas: etiqueta, campos: campo, x: X, y: Y, pix, ancho, alto, escala: G.k, cx: G.cx, arriba: G.top, db: E, nb, ns, dth: G.dth, dr: G.dr, abiertos, elementos: els };
  }
  // desenfoque lateral: dos medias móviles por fila (semiancho HB[j]) sobre F, usando T de apoyo
  function desenfocar(F) {
    const T = G.T, HB = G.HB;
    for (let j = 0; j < ns; j++) {
      const h = HB[j], o = j * nb; if (!h) continue;
      for (let pasada = 0; pasada < 2; pasada++) {
        const src = pasada ? T : F, dst = pasada ? F : T; let s = 0, c = 0;
        for (let i = 0; i <= h && i < nb; i++) { s += src[o + i]; c++; }
        for (let i = 0; i < nb; i++) {
          dst[o + i] = s / c;
          const ia = i + h + 1, ir = i - h;
          if (ia < nb) { s += src[o + ia]; c++; }
          if (ir >= 0) { s -= src[o + ir]; c--; }
        }
      }
    }
  }
  return { formar, rejilla: (P) => geometria(P) };
}

/** Dirección (en el corazón) del haz de ángulo theta de un plano: d·cos θ + r·sin θ. */
export function direccionHaz(P, theta) { return nrm(sum(esc(P.d, Math.cos(theta)), esc(P.r, Math.sin(theta)))); }
/** Ángulo del haz que pasa por un punto del corazón (para colocar la línea M sobre una estructura). */
export function anguloHacia(P, p) { const [u, v] = enPlano(P, p); return Math.atan2(u, Math.max(1e-3, v)); }

/** El abanico del plano para el dibujo 3D: triángulos desde el transductor hasta la profundidad del sector. */
export function abanicoVista(P, n = 24) {
  const pos = [...P.O]; const idx = [];
  for (let k = 0; k <= n; k++) { const th = -P.mitad + 2 * P.mitad * k / n, dir = sum(esc(P.d, Math.cos(th)), esc(P.r, Math.sin(th)));
    pos.push(...sum(P.O, esc(dir, P.prof))); if (k) idx.push(0, k, k + 1); }
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx) };
}
