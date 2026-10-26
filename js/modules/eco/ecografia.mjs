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
import { PUNTOS_ABDOMEN } from './abdomen-puntos.mjs';
import { ARRIBA, DELANTE, DERECHA } from './mat.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const perp = (a, b) => nrm(res(a, esc(b, dot(a, b))));        // a sin su componente en b (b unitario)
const perpV = (a, b) => res(a, esc(b, dot(a, b)));             // lo mismo sin normalizar
// normal del plano que pasa por o y mejor ajusta los puntos: el autovector menor de Σ (p − o)(p − o)ᵀ
function normalAjustada(o, pts) {
  const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of pts) { const q = res(p, o); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) M[i][j] += q[i] * q[j]; }
  const tr = M[0][0] + M[1][1] + M[2][2], N = M.map((f, i) => f.map((x, j) => (i === j ? tr : 0) - x));     // el menor de M es el mayor de tr·I − M
  let v = nrm(cruz(res(pts[0], o), res(pts[pts.length - 1], o)));
  for (let k = 0; k < 60; k++) v = nrm([0, 1, 2].map(i => N[i][0] * v[0] + N[i][1] * v[1] + N[i][2] * v[2]));
  return v;
}
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
  // subcostal: la sonda bajo la apófisis xifoides, el haz hacia arriba y a la izquierda a través del hígado
  sc4c: { corto: 'SC4C', nombre: 'Subcostal 4 cámaras', ventana: 'subcostal', prof: 230, angulo: 80 },
  scVci: { corto: 'SC VCI', nombre: 'Subcostal · vena cava inferior', ventana: 'subcostal', prof: 170, angulo: 70 },
  // supraesternal: la sonda en la escotadura yugular, el haz hacia abajo, por el plano del arco aórtico
  sse: { corto: 'SSN', nombre: 'Supraesternal · arco aórtico', ventana: 'supraesternal', prof: 130, angulo: 75 },
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
  // plano por el transductor o que mejor pasa por los puntos pts (mínimos cuadrados con el plano obligado a pasar
  // por o), con el haz hacia c y hacia la derecha de la imagen lo que señala q (desde c)
  const ajustado = (o, pts, c, q) => { O = o; const n0 = normalAjustada(o, pts);
    d = nrm(perpV(res(c, o), n0)); r = perp(perpV(res(q, c), n0), d); };
  const porTres = (o, p, q, c) => { O = o; d = nrm(res(c, O)); r = perp(res(q, p), d); };
  if (v.ventana === 'subcostal') {
    // sobre la piel (la pared abdominal, ~8 mm por delante del borde del hígado), 40 mm por debajo de la punta del
    // xifoides y 20 mm a su derecha: el haz sube hacia la izquierda atravesando el lóbulo izquierdo del hígado, y el
    // VD queda algo más cerca del hígado que el VI (con nuestra anatomía, no tanto como en un paciente)
    const X = PUNTOS_ABDOMEN.xifoides_punta, piel = sum(sum(sum(X, esc(DELANTE, 8)), esc(ARRIBA, -40)), esc(DERECHA, 20));
    const apex = [0, 0, -vi.Le], mit = A(g.mc, 0), tri = A(g.ct, 0), ai = [g.mc[0], g.mc[1] - 10, 18], ad = [g.ct[0] - 5, g.ct[1], 16];
    if (clave === 'sc4c') {
      // el plano que mejor pasa por el ápex, las dos válvulas AV y las dos aurículas; el ápex a la derecha
      const pts = [apex, mit, tri, ai, ad], c = esc(pts.reduce(sum), 1 / pts.length);
      ajustado(piel, pts, c, apex);
    } else {
      // por el eje de la VCI, de 45 mm bajo el hiato (izquierda de la imagen) a la AD (derecha). La sonda, más
      // vertical: sobre la piel delante del tramo de la VCI que se mira (a la altura del xifoides en profundidad,
      // 8 mm por delante del hígado), con el haz hacia atrás, para que la vena cruce la imagen casi en horizontal
      const V = PUNTOS_ABDOMEN.vci.map(x => x.slice(0, 3)), H = PUNTOS_ABDOMEN.hiato, alto = (p) => dot(res(p, H), ARRIBA);
      const abajo = V.reduce((a, p) => (Math.abs(alto(p) + 45) < Math.abs(alto(a) + 45) ? p : a)), medio = sum(esc(abajo, 0.5), esc(ad, 0.5));
      const sonda = sum(sum(medio, esc(ARRIBA, -25)), esc(DELANTE, dot(res(X, medio), DELANTE) + 8));
      ajustado(sonda, [abajo, H, ad], medio, ad);
    }
  } else if (v.ventana === 'supraesternal') {
    // la escotadura yugular: 35 mm por encima del techo del arco y 15 mm por delante, en la línea media (el plano
    // sagital que pasa por el xifoides); corte por la aorta ascendente (izquierda) y la descendente (derecha)
    const techo = [0, -14, 75], asc = [g.ac[0] - 1, g.ac[1] - 4, 65], desc = [21, -54, 50];
    let o = sum(sum(techo, esc(ARRIBA, 35)), esc(DELANTE, 15));
    o = res(o, esc(DERECHA, dot(res(o, PUNTOS_ABDOMEN.xifoides_punta), DERECHA)));
    porTres(o, asc, desc, sum(esc(asc, 0.5), esc(desc, 0.5)));
  } else if (v.ventana === 'apical') {
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

// ---------------------------------------------------------------------------- medidas del corazón
/**
 * Lo que mediría un ecografista en la forma de este estado (normalmente el telediastólico), para cotejar las formas de
 * enfermedad (escenarios.mjs) con las cifras de las fichas. Todo en mm salvo lo indicado.
 * - tabique, paredPost, lvdd, vdDiam: en el eje largo paraesternal, a un 30% de la longitud del VI desde la base (el
 *   mismo nivel que la vista PLAX), igual que la tabla de dimensiones de FATE.
 * - rwt: grosor relativo de pared = 2 × pared posterior / LVDd (la guía ESC de IC lo usa con corte >0,42).
 * - masaIndice (g/m²): volumen de miocardio del VI × 1,05 g/mL (densidad del miocardio: fisiología general) / superficie.
 * - areaVdVi: área de la cavidad del VD sobre la del VI en el plano apical de 4 cámaras (Ficha 11: relación VD/VI).
 */
export function medidasCorazon(est, sc = 1.85) {
  const g = baseGeometrica(est), vi = g.vi, z = -0.3 * vi.L, U = g.U, Up = U + Math.PI;
  const pared = (f) => g.rEpiVi(z, f) - g.rEndoVi(z, f);
  const lvdd = g.rEndoVi(z, U) + g.rEndoVi(z, Up), paredPost = pared(Up);
  // áreas en el plano A4C: se cuenta qué puntos del plano caen en cada cavidad (bajo el plano AV)
  const P = planoVista('a4c', est), h = 0.6; let nVi = 0, nVd = 0;
  for (let u = -70; u <= 70; u += h) for (let v = 0; v <= P.prof; v += h) {
    const p = sum(P.O, sum(esc(P.r, u), esc(P.d, v))), zp = p[2];
    if (zp >= 0) continue;
    const rho = Math.hypot(p[0], p[1]), f = Math.atan2(p[1], p[0]);
    if (zp > -vi.L && rho < g.rEndoVi(zp, f)) { nVi++; continue; }
    if (zp > -g.Lvd && g.ventana(f) > 0) { const re = g.rEpiVi(zp, f); if (rho > re && rho < re + g.wRV(zp, f)) nVd++; }
  }
  return { tabique: pared(U), paredPost, lvdd, vdDiam: g.wRV(z, U), rwt: 2 * paredPost / lvdd,
    masaIndice: REF.vMioVi * g.mio * 1.05 / sc, areaVdVi: nVi ? nVd / nVi : 0, septo: g.septo };
}

// ---------------------------------------------------------------------------- sonda libre
// La sonda se mueve a partir de la vista estándar, con los movimientos que se enseñan con un transductor real
// (en grados y mm, desde la vista estándar; todos con el transductor como pivote salvo el deslizamiento):
//   rot  · rotar: girar la sonda sobre su eje (el haz central); el plano gira alrededor del haz
//   incl · inclinar en abanico: el plano barre perpendicular a sí mismo (p. ej. de la base al ápex)
//   bal  · balancear: inclinar dentro del propio plano (lo que se ve se desplaza a un lado de la imagen)
//   desl · deslizar: mover la sonda sobre la piel, perpendicular al plano
export const SONDA_CERO = Object.freeze({ rot: 0, incl: 0, bal: 0, desl: 0 });
const rotarEje = (v, k, a) => { const c = Math.cos(a), s = Math.sin(a), kv = cruz(k, v), kd = dot(k, v) * (1 - c);
  return [v[0] * c + kv[0] * s + k[0] * kd, v[1] * c + kv[1] * s + k[1] * kd, v[2] * c + kv[2] * s + k[2] * kd]; };
/** El plano de una vista con la sonda movida (rot, incl, bal en grados; desl en mm). Sin movimiento, el mismo plano. */
export function planoLibre(P, s = SONDA_CERO) {
  const g = Math.PI / 180; let { O, d, r, n } = P;
  if (s.rot) { r = rotarEje(r, d, s.rot * g); n = rotarEje(n, d, s.rot * g); }
  if (s.incl) { d = rotarEje(d, r, s.incl * g); n = rotarEje(n, r, s.incl * g); }
  if (s.bal) { d = rotarEje(d, n, s.bal * g); r = rotarEje(r, n, s.bal * g); }
  if (s.desl) O = sum(O, esc(n, s.desl));
  return { ...P, O, d: nrm(d), r: nrm(r), n: nrm(n), sonda: { ...SONDA_CERO, ...s } };
}
export const sondaMovida = (s) => !!s && [s.rot, s.incl, s.bal, s.desl].some(x => x);
/**
 * Cuánto se aparta el corte P de la vista Q: grados (el mayor entre el giro del plano y el del haz central) y mm (a
 * qué distancia del corte queda el centro de la imagen de Q, a 6 cm del transductor). Lo que importa es si la
 * imagen muestra lo mismo, no por dónde entra la sonda.
 */
export function desviacion(P, Q) {
  const deg = (x) => Math.acos(clamp(x, -1, 1)) * 180 / Math.PI;
  const grados = Math.max(deg(Math.abs(dot(P.n, Q.n))), deg(dot(P.d, Q.d)));
  const centro = sum(Q.O, esc(Q.d, 60));
  return { grados, mm: Math.abs(enPlano(P, centro)[2]) };
}
/** La vista estándar de la misma ventana (apical o paraesternal) a la que más se parece el corte P. */
export function vistaMasParecida(P, est, ventana) {
  let mejor = null;
  for (const k of Object.keys(VISTAS)) {
    if (ventana && VISTAS[k].ventana !== ventana) continue;
    const dv = desviacion(P, planoVista(k, est)), total = dv.grados + dv.mm;
    if (!mejor || total < mejor.total) mejor = { clave: k, ...dv, total };
  }
  return mejor;
}

/** Distancia (mm) de un punto del plano al segmento más cercano de una lista [x0,y0,x1,y1,…]. */
export function distSeg(x, y, seg) {
  let best = Infinity;
  for (let i = 0; i < seg.length; i += 4) {
    const ax = seg[i], ay = seg[i + 1], ux = seg[i + 2] - ax, uy = seg[i + 3] - ay, l2 = ux * ux + uy * uy || 1e-9;
    const t = Math.max(0, Math.min(1, ((x - ax) * ux + (y - ay) * uy) / l2)), d = Math.hypot(x - ax - t * ux, y - ay - t * uy);
    if (d < best) best = d;
  }
  return best;
}

/** Distancia mínima (mm) de los extremos de una lista de segmentos a otra lista de segmentos. */
export function distMin(seg, pared) {
  let m = Infinity;
  for (let i = 0; i < seg.length; i += 2) m = Math.min(m, distSeg(seg[i], seg[i + 1], pared));
  return m;
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
  [/^Raíz aórtica$/, { clase: 'linea', db: 6, ancho: 2.2 }],
  // grandes vasos: luz con sangre aunque salgan del pericardio (el arco en la supraesternal, la aorta descendente
  // detrás de la AI en el eje largo)
  [/^(Aorta|Tronco pulmonar|AP )/, { clase: 'vaso', db: 6, ancho: 2.2 }],
  // abdomen (abdomen.mjs): hígado y diafragma se rellenan como una pared (el diafragma, una banda muy ecogénica);
  // los vasos de dentro, luz con sangre y una pared fina (brillante en la porta, por su vaina fibrosa)
  [/^Hígado$/, { grupo: 'Hígado', clase: 'pared', db: 1 }],
  [/^Diafragma$/, { grupo: 'Diafragma', clase: 'pared', db: 9 }],
  [/^Apófisis xifoides$/, { grupo: 'Xifoides', clase: 'pared', db: 12 }],
  [/^Vena cava inferior$/, { clase: 'vaso', db: 1, ancho: 1.2 }],
  [/^Vena suprahepática/, { clase: 'vaso', db: -2, ancho: 0.8 }],
  [/^(Vena porta|Rama portal)/, { clase: 'vaso', db: 9, ancho: 1.3 }],
  [/^(Vena|Seno coronario)/, { clase: 'linea', db: -3, ancho: 1.3 }],
  [/^Grasa/, { clase: 'linea', db: 3, ancho: 3.5 }],
  [/^Coronaria/, { clase: 'linea', db: 5, ancho: 1.4 }],
  [/^(Mitral|Tricúspide|Aórtica|Pulmonar)/, { clase: 'valva', db: 13, ancho: 1.4 }],
  [/^Pericardio$/, { clase: 'pericardio', db: 14, ancho: 2 }],
];
export const CUERDA_H = 4;      // medio grosor (mm) de la losa en que las cuerdas entran en la imagen
/** Un papilar cortado se desvanece entre PAPILAR_FADE[0] y [1] mm de distancia mínima a la pared del VI: más lejos, suelto, ya no hay tejido. */
export const PAPILAR_FADE = [3, 6];
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

/** Segmentos de las cuerdas (líneas 3D) dentro de ±h mm del plano, proyectados; con su distancia (0-1 del grosor del corte). */
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
export function elementosDelCorte(partes, P, ref = null, { cuerdasYPapilares = true } = {}) {
  const grupos = new Map(), lineas = [], valvas = [], tubos = [], mascara = { tipo: 'mascara', seg: [] }, peri = [];
  let base = 0;
  partes.forEach((p, k) => {
    if (p.lineas) {
      // cuerdas como losa de ±CUERDA_H mm: brillan al cruzar el centro del plano (8 dB, siempre por debajo de la valva)
      // y se apagan con la distancia: a 3 mm ya están 7,5 dB más oscuras; de ahí al borde de la losa, mucho más rápido
      if (p.nombre === 'Cuerdas' && !cuerdasYPapilares) for (const [a, b, f] of cortarLineas(p, P)) valvas.push({ tipo: 'linea', seg: [a[0], a[1], b[0], b[1]], db: 4 - 6 * f, ancho: 0.9, grupo: 'Cuerdas' });   // la línea fina de antes
      else if (p.nombre === 'Cuerdas') for (const [a, b, f] of cortarLineas(p, P, CUERDA_H)) { const mm = f * CUERDA_H;
        valvas.push({ tipo: 'linea', seg: [a[0], a[1], b[0], b[1]], db: 8 - 2.5 * mm - (mm > 3 ? 10 * (mm - 3) : 0), ancho: 0.7 + 0.8 * (1 - f), grupo: 'Cuerdas' }); }
      return;
    }
    const t = tipoDe(p.nombre); if (!t || !p.idx) { base += p.pos ? p.pos.length / 3 : 0; return; }
    const r = ref && ref[k] && ref[k].nombre === p.nombre ? ref[k] : null;
    const c = cortarPieza(p, P, r, base); base += p.pos.length / 3;
    if (!c.seg.length) return;
    const el = { seg: c.seg, segRef: c.segRef, claves: c.claves, nombre: p.nombre };
    if (t.clase === 'pared') { if (!grupos.has(t.grupo)) grupos.set(t.grupo, { db: t.db, trozos: [] }); grupos.get(t.grupo).trozos.push(el); }
    else if (t.clase === 'pericardio') { mascara.seg.push(...c.seg); peri.push({ tipo: 'linea', seg: c.seg, segRef: c.segRef, db: t.db, ancho: t.ancho, grupo: 'Pericardio' }); }
    else if (t.clase === 'tubo' || t.clase === 'vaso') tubos.push({ ...el, t });
    else (t.clase === 'valva' ? valvas : lineas).push({ tipo: 'linea', seg: c.seg, segRef: c.segRef, db: t.db, ancho: t.ancho, grupo: p.nombre });
  });
  const out = [mascara];
  for (const [g, { db, trozos }] of grupos) {
    // hasta 50 mm: las vistas que rozan la base (supraesternal, subcostal) dejan el epicardio abierto con sus dos
    // extremos en el borde de la base a 30-35 mm (hasta ~46 mm con la pared gruesa de la hipertrofia del VI). Los
    // puentes van de menor a mayor distancia, así que subir el tope no cambia los que ya se cerraban: solo cierra
    // los que antes quedaban abiertos
    const { puentes, puentesRef, abiertos } = cerrarExtremos(trozos, 50);
    const seg = trozos.flatMap(x => x.seg).concat(puentes);
    const conRef = trozos.every(x => x.segRef);
    const segRef = conRef ? trozos.flatMap(x => x.segRef).concat(puentesRef) : null;
    out.push({ tipo: 'relleno', seg, segRef, db, grupo: g, abiertos });
    // borde de la pared: más brillante donde el haz le da de frente (reflexión especular)
    out.push({ tipo: 'linea', seg, segRef, db: DB.borde, ancho: 1.1, especular: DB.especular, grupo: g });
  }
  // papilares y trabéculas: nacen de la pared, así que lo que queda lejos de ella se desvanece (en formar)
  const paredVI = cuerdasYPapilares && grupos.has('VI') ? grupos.get('VI').trozos.flatMap(x => x.seg) : null;
  for (const x of tubos) {
    // cerrado: cada extremo suelto tiene otro en el mismo sitio (la costura de la rejilla del tubo)
    const cerrado = cerrarExtremos([x], 0.6).abiertos === 0;
    if (x.t.clase === 'vaso') {
      // vaso: luz con sangre y la pared encima. Cortado a lo largo (la VCI en la subcostal) el contorno son dos
      // líneas que acaban donde acaba el tubo: se cierran uniendo sus extremos, como las paredes
      const c = cerrado ? null : cerrarExtremos([x], 45);
      if (cerrado || c.abiertos === 0) out.push({ tipo: 'relleno', seg: cerrado ? x.seg : x.seg.concat(c.puentes), segRef: null, db: DB.sangre, sangre: true, grupo: x.nombre, abiertos: 0 });
      out.push({ tipo: 'linea', seg: x.seg, segRef: x.segRef, db: x.t.db, ancho: x.t.ancho, grupo: x.nombre });
      continue;
    }
    out.push(cerrado ? { tipo: 'relleno', seg: x.seg, segRef: x.segRef, db: x.t.db, grupo: x.nombre, abiertos: 0, distPared: paredVI && /^Papilar/.test(x.nombre) ? distMin(x.seg, paredVI) : null }
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
// retícula y variación lenta (ver las mejoras de moteado)
const hash = (i, j) => { let h = Math.imul(i, 0x27d4eb2d) ^ Math.imul(j, 0x165667b1); h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h ^= h >>> 13; return h & (NG - 1); };
// variación lenta del tejido (retícula de 5 mm), con su intensidad: tabla por exponente
let VLk = -1, VL = new Float32Array(NG);
function tablaLenta(k) { if (k === VLk) return; VLk = k; for (let i = 0; i < NG; i++) VL[i] = Math.pow(10, (GR[i] * 1.6 * k) / 20); }
function lento(x, y) {
  const fx = x / 5, fy = y / 5, ix = Math.floor(fx), iy = Math.floor(fy); let tx = fx - ix, ty = fy - iy;
  tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
  const a = VL[hash(ix, iy)], b = VL[hash(ix + 1, iy)], c = VL[hash(ix, iy + 1)], d = VL[hash(ix + 1, iy + 1)];
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}

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

// ---------------------------------------------------------------------------- formación de la imagen
// Haz (2,5 MHz con armónicos, ilustrativo): ~0,3 mm de resolución axial (σ) y lateral que crece con la
// profundidad (σ ≈ 0,0085·r, mínimo 0,45 mm). Ventana de visualización: DB_LO..DB_HI.
const SIG_AX = 0.3, DB_LO = -34, DB_HI = 30;
const SIG_LAT0 = (r) => Math.max(0.45, 0.0085 * r);
// pulso axial: pesos de una campana por recurrencia (cada peso sale del anterior: w(i+1) = w(i)·q^(2i+1), con
// q = e^(−1/2σ²)), simétricos, hasta 2,5 σ (como mucho «tope» muestras a cada lado), y que suman 1
function pulsoAxial(sig, tope) {
  const media = clamp(Math.ceil(2.5 * sig), 1, tope), q = Math.exp(-0.5 / (sig * sig)), mitad = [1];
  for (let i = 0; i < media; i++) mitad.push(mitad[i] * Math.pow(q, 2 * i + 1));
  const total = mitad.reduce((a, w, i) => a + (i ? 2 * w : w), 0), pesos = new Float32Array(2 * media + 1);
  mitad.forEach((w, i) => { pesos[media + i] = pesos[media - i] = w / total; });
  return pesos;
}
// potencia del ruido tras dos cajas de semiancho h (para devolverla a 1)
const S2 = Array.from({ length: 16 }, (_, h) => { const w = 2 * h + 1; let s = 0; for (let t = -2 * h; t <= 2 * h; t++) { const c = (w - Math.abs(t)) / (w * w); s += c * c; } return s; });

/**
 * Las mejoras de la imagen (todo ilustrativo, física general de los ultrasonidos), cada una con su intensidad de 0 a 1;
 * con 0 el ecógrafo da exactamente la imagen de antes de las mejoras:
 *   paredes   · el borde de la pared ya no es una línea brillante: interfase fina y músculo gris medio
 *   moteado   · los dispersores se interpolan entre los nudos de su retícula: el moteado se desliza con la pared en
 *               vez de «hervir», la sangre deriva despacio y el tejido es más heterogéneo
 *   sombra    · cada haz pierde energía al cruzar lo muy ecogénico (pericardio, valvas, costilla) y menos en la sangre
 *               que en el tejido: sombra detrás de lo brillante, refuerzo detrás del líquido
 *   reverb    · neblina de campo cercano y bandas de reverberación de la pared torácica a 2×, 3× y 4× su profundidad,
 *               fijas en la pantalla (no se mueven con el corazón)
 *   especular · el borde brilla más cuando el haz lo corta de frente y se apaga cuando le pasa paralelo (anisotropía)
 *   tgc       · ganancia por profundidad con 4 mandos (o.tgc, en dB); 0 la ignora
 *   foco      · el haz es más estrecho en el foco (o.focoMm) y se ensancha por delante, por detrás y hacia los bordes
 *   ventana   · ventana pobre: pared más gruesa, más pérdida, más ruido; con más intensidad, el borde del pulmón tapa un
 *               lado del sector y entra y sale con la respiración (por defecto apagada: es un reto)
 */
export const MEJORAS_CERO = Object.freeze({ paredes: 0, moteado: 0, sombra: 0, reverb: 0, especular: 0, tgc: 0, foco: 0, ventana: 0, trabeculas: 0 });
export const MEJORAS_DEFECTO = Object.freeze({ trabeculas: 1, paredes: 0.9, moteado: 0.7, sombra: 0.7, reverb: 0.6, especular: 0.7, tgc: 1, foco: 0.7, ventana: 0 });

/**
 * Un ecógrafo de NB haces por NS muestras. formar() devuelve la imagen del sector en un búfer RGBA de ancho × alto
 * píxeles (vértice del sector arriba en el centro) y la rejilla polar en dB (para pruebas).
 * formar(partes, P, o): partes, las del corazón en este fotograma; P, el plano; o.ref, las piezas de la forma de
 * referencia (para el moteado); o.t, tiempo (s); o.ganancia (dB); o.m, intensidades 0..1 de cada mejora (MEJORAS_DEFECTO);
 * o.tgc, 4 dB de arriba abajo; o.focoMm, profundidad del foco; o.ventanaVista, 'apical', 'paraesternal', 'subcostal'…
 */
export function crearEcografo({ ancho = 360, alto = 300, nb = 192, ns = 448 } = {}) {
  let G = null, geoNueva = false;      // geoNueva: este fotograma ha tenido que construir la rejilla (tarda más de lo normal)
  const geometria = (P, o) => {
    const m = o.m, clave = [P.prof, P.mitad.toFixed(4), ancho, alto, m.reverb, m.foco, o.focoMm, m.ventana, m.sombra > 0, o.ventanaVista, m.moteado].join('|');
    if (G && G.clave === clave) return G;
    geoNueva = true;
    const N = nb * ns, dth = 2 * P.mitad / nb, dr = P.prof / ns;
    const X = new Float32Array(N), Y = new Float32Array(N), Rr = new Float32Array(ns), EB = new Float32Array(nb);
    for (let j = 0; j < ns; j++) { const rr = (j + 0.5) * dr; Rr[j] = rr; for (let i = 0; i < nb; i++) { const th = -P.mitad + (i + 0.5) * dth; X[j * nb + i] = rr * Math.sin(th); Y[j * nb + i] = rr * Math.cos(th); } }
    for (let i = 0; i < nb; i++) EB[i] = (-P.mitad + (i + 0.5) * dth) / P.mitad;
    const kAx = pulsoAxial(SIG_AX / dr, 6); let s2a = 0; for (const w of kAx) s2a += w * w;
    // desenfoque lateral por muestra: sin la mejora, el de hoy (solo la profundidad); con ella, foco y bordes
    const HB = new Uint8Array(N), NORM = new Float32Array(N), I = m.foco, f = o.focoMm ?? 80;
    for (let j = 0; j < ns; j++) {
      const rr = Math.max(4, Rr[j]), s0 = SIG_LAT0(rr), sF = Math.max(0.45, 0.55 + 0.012 * Math.abs(rr - f) + 0.004 * rr);
      for (let i = 0; i < nb; i++) {
        const e = EB[i], M = m.moteado;
        // con el grano real, el haz nunca baja de ~1 mm de ancho: el grano sale alargado de lado y corto en profundidad
        const sig = Math.max(0.45 + 0.6 * M, ((1 - I) * s0 + I * sF) * (1 + 0.25 * M)) * (1 + 0.9 * I * e * e);
        const sg = sig / (rr * dth), h = Math.max(0, Math.min(15, Math.round((Math.sqrt(1 + 6 * sg * sg) - 1) / 2)));
        HB[j * nb + i] = h; NORM[j * nb + i] = 1 / (S2[h] * s2a);
      }
    }
    // pared torácica: con ventana pobre, más gruesa (la grasa crece) y con más pérdida
    const W = m.ventana, pared = PARED + 8 * W, grasa = 0.35 + 0.25 * W;
    const PT = new Float32Array(N).fill(-1), ABS = new Uint8Array(N);
    for (let q = 0; q < N; q++) { const y = Y[q]; if (y >= pared) continue; const x = X[q], fr = y / pared + 0.04 * Math.sin(x * 0.9);
      PT[q] = amp(y < 1 ? 4 : fr < grasa ? -13 - 3 * W : fr < 0.85 ? -4 + 3 * Math.sin(y * 3.1 + x * 0.3) : 7); }
    // costilla (con la sombra, fuera de la subcostal): un arco brillante en el borde izquierdo del sector
    if (m.sombra > 0 && o.ventanaVista !== 'subcostal') for (let j = 0; j < ns; j++) for (let i = 0; i < nb; i++) {
      const q = j * nb + i, r = Rr[j], e = EB[i];
      if (e < -0.74 && r > pared - 6 && r < pared - 1) { PT[q] = amp(12); ABS[q] = 1; }
    }
    // neblina y reverberación: fijas en la pantalla (el ruido de su moteado no se mueve con el corazón)
    const R = m.reverb, CL = new Float32Array(N), kW = 1 + 1.5 * W;
    for (let j = 0; j < ns; j++) for (let i = 0; i < nb; i++) {
      const q = j * nb + i, y = Y[q], r = Rr[j]; let c = 0;
      if (y >= pared && y < 50 + 40 * R) c = amp(-18 + 6 * R - (0.55 - 0.3 * R) * (y - pared));
      // en el apical el ápex cae en el campo cercano: más niebla en los primeros 3-4 cm
      if (R > 0 && o.ventanaVista === 'apical' && y >= pared && y < pared + 40) c += R * amp(-15 - 0.35 * (y - pared));
      if (R > 0) for (let k = 2; k <= 4; k++) { const d = r - k * pared; if (Math.abs(d) < 4) c += R * amp(4 - 6 * k) * Math.exp(-(d * d) / 3.5); }
      CL[q] = c * kW;
    }
    // ganancia que no depende del tejido: la de hoy (caída con la profundidad y en los bordes)
    const GAN = new Float32Array(N);
    for (let j = 0; j < ns; j++) for (let i = 0; i < nb; i++) { const e = EB[i]; GAN[j * nb + i] = -0.025 * Math.max(0, Rr[j] - 60) - 6 * Math.pow(e, 8); }
    const k = Math.min((alto - 8) / P.prof, (ancho - 6) / (2 * P.prof * Math.sin(P.mitad))), cx = ancho / 2, top = 4;
    const PIX = [], FB = [], FS = [];
    for (let py = 0; py < alto; py++) for (let px = 0; px < ancho; px++) {
      const x = (px + 0.5 - cx) / k, y = (py + 0.5 - top) / k; if (y <= 0) continue;
      const rr = Math.hypot(x, y), th = Math.atan2(x, y); if (rr >= P.prof || Math.abs(th) >= P.mitad) continue;
      PIX.push(py * ancho + px); FB.push(clamp((th + P.mitad) / dth - 0.5, 0, nb - 1.001)); FS.push(clamp(rr / dr - 0.5, 0, ns - 1.001));
    }
    G = { clave, N, dth, dr, X, Y, Rr, EB, PT, ABS, CL, kAx, HB, NORM, GAN, pared, k, cx, top,
      PIX: Int32Array.from(PIX), FB: Float32Array.from(FB), FS: Float32Array.from(FS),
      A: new Float32Array(N), TAG: new Uint8Array(N), DEN: new Uint8Array(N), FILL: new Uint8Array(N), OR: new Float32Array(N), OD: new Float32Array(N),
      I: new Float32Array(N), Q: new Float32Array(N), T: new Float32Array(N), E: new Float32Array(N), PS: new Float64Array(nb + 1),
      pix: new Uint8ClampedArray(ancho * alto * 4), filas: Array.from({ length: ns }, () => []) };
    return G;
  };
  const LUT = new Uint8Array(1024 * 3);
  for (let i = 0; i < 1024; i++) { const v = Math.pow(i / 1023, 1.35); LUT[3 * i] = 6 + v * 244; LUT[3 * i + 1] = 6 + v * 240; LUT[3 * i + 2] = 8 + v * 230; }

  const aRejilla = (P, u, v) => [(Math.atan2(u, Math.max(v, 1e-3)) + P.mitad) / G.dth - 0.5, Math.hypot(u, v) / G.dr - 0.5];
  function rellenar(P, seg, fn) {
    const filas = G.filas; for (const f of filas) f.length = 0;
    for (let i = 0; i < seg.length; i += 4) {
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
  /**
   * Línea gruesa. espec: brillo extra de frente (dB); S: intensidad de la mejora especular (0 = la fórmula de hoy,
   * cos⁴). Con S > 0, apunta además en una franja de 5 mm la orientación del borde (para la anisotropía del músculo).
   */
  function trazar(P, seg, ancho, dbBase, espec, tag, S, realce = 1, etiquetar = false) {
    const { A, TAG, X, Y, OR, OD, FILL, dth, dr } = G, h = ancho / 2, banda = espec && S > 0 ? 6 : 0, hh = Math.max(h + 0.35, banda);
    for (let i = 0; i < seg.length; i += 4) {
      const ax = seg[i], ay = seg[i + 1], bx = seg[i + 2], by = seg[i + 3];
      let db = dbBase, c = 1;
      if (espec) {
        const tx = bx - ax, ty = by - ay, tl = Math.hypot(tx, ty) || 1, mx = (ax + bx) / 2, my = (ay + by) / 2, ml = Math.hypot(mx, my) || 1;
        c = Math.abs((-ty * mx + tx * my) / (tl * ml));
        const p = 4 + 4 * S;
        db += (espec + 4 * S * realce) * Math.pow(c, p) - 6 * S * (1 - c) * (1 - c);
      }
      const a = amp(db);
      const ra = Math.hypot(ax, ay), rb = Math.hypot(bx, by), ta = Math.atan2(ax, ay), tb = Math.atan2(bx, by);
      const rmin = Math.max(1, Math.min(ra, rb) - hh), mth = Math.asin(Math.min(1, hh / rmin)) + dth;
      const i0 = Math.max(0, Math.floor((Math.min(ta, tb) - mth + P.mitad) / dth)), i1 = Math.min(nb - 1, Math.ceil((Math.max(ta, tb) + mth + P.mitad) / dth));
      const j0 = Math.max(0, Math.floor((Math.min(ra, rb) - hh) / dr - 1)), j1 = Math.min(ns - 1, Math.ceil((Math.max(ra, rb) + hh) / dr));
      const ux = bx - ax, uy = by - ay, l2 = ux * ux + uy * uy || 1e-9;
      for (let j = j0; j <= j1; j++) for (let ii = i0; ii <= i1; ii++) {
        const q = j * nb + ii;
        const px = X[q] - ax, py = Y[q] - ay;
        const t = clamp((px * ux + py * uy) / l2, 0, 1), dx = px - t * ux, dy = py - t * uy, dd = Math.sqrt(dx * dx + dy * dy);
        if (banda && dd < banda && dd < OD[q]) { OD[q] = dd; OR[q] = c; }
        if (dd >= h + 0.35) continue;
        const cc = clamp((h - dd) / 0.35 + 0.5, 0, 1);
        if (espec) { if (cc * a > A[q]) A[q] = cc * a; if (cc >= 0.5) { FILL[q] = 0; if (etiquetar && !TAG[q]) TAG[q] = tag; } }
        else { A[q] += cc * (a - A[q]); if (cc >= 0.5) { TAG[q] = tag; FILL[q] = 0; } }
      }
    }
  }
  // desenfoque lateral con semiancho propio en cada muestra: dos cajas por fila con sumas acumuladas
  function desenfocar(F) {
    const T = G.T, HB = G.HB, PS = G.PS;
    for (let j = 0; j < ns; j++) {
      const o = j * nb;
      for (let pasada = 0; pasada < 2; pasada++) {
        const src = pasada ? T : F, dst = pasada ? F : T;
        PS[0] = 0; for (let i = 0; i < nb; i++) PS[i + 1] = PS[i] + src[o + i];
        for (let i = 0; i < nb; i++) { const h = HB[o + i], a = Math.max(0, i - h), b = Math.min(nb, i + h + 1); dst[o + i] = (PS[b] - PS[a]) / (b - a); }
      }
    }
  }

  function formar(partes, P, o = {}) {
    const m = { ...MEJORAS_DEFECTO, ...(o.m || {}) };
    geoNueva = false; geometria(P, { ...o, m });
    const { N, A, TAG, DEN, FILL, OR, OD, X, Y, Rr, EB } = G, reloj = [performance.now()];
    const els = elementosDelCorte(partes, P, o.ref || null, { cuerdasYPapilares: m.trabeculas > 0 }); reloj.push(performance.now());
    DEN.fill(0); rellenar(P, els[0].seg, (q) => { DEN[q] = 1; });
    // grano real: la sangre no es negro absoluto; un eco muy bajo que asoma al subir la ganancia
    const aS = amp(DB.sangre + 4 * m.moteado), aE = amp(DB.extracardiaco), PT = G.PT;
    for (let q = 0; q < N; q++) {
      if (PT[q] >= 0) { A[q] = PT[q]; TAG[q] = 0; }
      else if (DEN[q]) { A[q] = aS; TAG[q] = 255; } else { A[q] = aE; TAG[q] = 0; }
    }
    FILL.fill(0); OD.fill(1e9); OR.fill(1);
    const mov = [null], etiqueta = new Map(), campo = [null]; let abiertos = 0;
    const tagDe = (el) => { if (!etiqueta.has(el.grupo)) { etiqueta.set(el.grupo, mov.length); mov.push(ajusteAfin(el.seg, el.segRef)); campo.push(campoDesplazamiento(el.seg, el.segRef)); } return etiqueta.get(el.grupo); };
    for (const el of els.slice(1)) {
      if (el.tipo === 'relleno' && el.sangre) { const a = amp(el.db); rellenar(P, el.seg, (q) => { A[q] = a; TAG[q] = 255; }); continue; }
      const tag = Math.min(254, tagDe(el));
      if (el.tipo === 'relleno') { abiertos += el.abiertos; const mus = el.db <= 1, a = amp(el.db - (mus ? (7 + (el.grupo === 'VD' ? 3 : 0)) * m.paredes : 0));   // paredes reales: músculo gris medio (la pared libre del VD, más fina, algo más tenue)
        // papilar o trabécula sin pared cerca: se funde con la sangre entero (nace de la pared; suelto sería un «trombo»)
        const [f0, f1] = PAPILAR_FADE, u = el.distPared == null ? 0 : clamp((el.distPared - f0) / (f1 - f0), 0, 1);
        if (u < 1) { const a2 = u > 0 ? amp((el.db - (mus ? 7 * m.paredes : 0)) * (1 - u) + (DB.sangre + 4 * m.moteado) * u) : a;
          rellenar(P, el.seg, (q) => { A[q] = a2; TAG[q] = tag; FILL[q] = u === 0 && mus ? 1 : 0; }); } }
      else {
        // con la mejora especular, también el pericardio depende del ángulo
        const espec = el.especular || (m.especular > 0 && el.grupo === 'Pericardio' ? 3 : 0);
        // paredes reales: el borde de la pared ya no es una línea brillante; queda una interfase fina, algo más clara
        // que el músculo solo donde el haz llega de frente (el pericardio y las válvulas siguen siendo líneas)
        const W2 = m.paredes, borde = !!el.especular && W2 > 0;
        if (borde) trazar(P, el.seg, el.ancho * (1 - (el.grupo === 'VD' ? 0.65 : 0.45) * W2), el.db - (el.grupo === 'VD' ? 7 : 3) * W2, espec - (el.grupo === 'VD' ? 6 : 3) * W2, tag, m.especular, 1 - W2);
        // paredes reales: las aurículas y el anillo de la base (una sola capa) tampoco son líneas gruesas y brillantes
        else if (W2 > 0 && /^(AI|AD|Orejuela|Base V)/.test(el.grupo)) trazar(P, el.seg, el.ancho * (1 - (/^AD/.test(el.grupo) ? 0.7 : 0.4) * W2), el.db - (/^AD/.test(el.grupo) ? 15 : 8) * W2, espec, tag, m.especular);
        else trazar(P, el.seg, el.ancho, el.db, espec, tag, m.especular, 1, el.grupo === 'Pericardio');   // el pericardio es solo una línea: lleva su etiqueta aunque dependa del ángulo
      }
    }
    // anisotropía: el músculo paralelo al haz devuelve menos eco
    if (m.especular > 0) { const k = -(22 - 5 * m.paredes) * m.especular; for (let q = 0; q < N; q++) if (FILL[q] && OD[q] < 6) { const c = 1 - OR[q]; A[q] *= Math.pow(10, k * c * Math.sqrt(c) / 20); } }
    // ventana pobre: el borde del pulmón tapa el lado derecho del sector (entra y sale con la respiración, ciclo de 5 s)
    const W = m.ventana;
    let pulmon = null;
    if (W > 0.25 && o.ventanaVista !== 'subcostal') {
      const resp = 0.5 - 0.5 * Math.cos(2 * Math.PI * ((o.t || 0) % 5) / 5), borde = 1 - (W - 0.25) * 0.6 * (0.5 + 0.5 * resp), rl = G.pared + 4;
      pulmon = { borde, rl };
      for (let i = 0; i < nb; i++) { if (EB[i] < borde) continue;
        for (let j = 0; j < ns; j++) { const r = Rr[j]; if (r < rl) continue; const q = j * nb + i, k = Math.round(r / rl), d = r - k * rl;
          A[q] = Math.abs(d) < 1.2 ? amp(10 - 7 * (k - 1)) : amp(-38); TAG[q] = 0; } }
    }
    reloj.push(performance.now());
    // sombra y refuerzo: cada haz, de la sonda hacia abajo, pierde lo que no atraviesa
    const S = m.sombra;
    if (S > 0 || W > 0) {
      const dr = G.dr, ABS = G.ABS, a6 = amp(6), fT = amp(-W * 0.5 * dr), fB = amp(S * 0.24 * dr), fH = amp(-S * 7.5 * dr), kb = -S * 1.2 * dr / 6, tope = amp(12);
      for (let i = 0; i < nb; i++) { let at = 1;
        for (let j = 0, q = i; j < ns; j++, q += nb) {
          const a = A[q]; A[q] = a * at;
          if (Rr[j] < G.pared) at *= fT;
          if (S > 0) {
            if (ABS[q]) at *= fH;
            else if (a > a6) at *= Math.pow(a / a6, kb);      // lo muy ecogénico refleja y deja pasar menos
            else if (TAG[q] === 255 && at < tope) at *= fB;   // la sangre atenúa menos que el tejido (refuerzo)
          }
        }
      }
    }
    reloj.push(performance.now());
    // dispersores
    const { I, Q, CL } = G, t = o.t || 0, fr = Math.floor(t / 0.02), M = m.moteado;
    tablaLenta(1 + 1.5 * M);
    const ruido = amp(-40 + 8 * W);
    if (M > 0) {
      // retícula de 0,3 mm con interpolación bilineal: el patrón se desliza con el tejido
      const RT = 1 / 0.3, du = t * 9, dv = t * 5;
      for (let q = 0; q < N; q++) {
        const tg = TAG[q]; let mu = X[q], mv = Y[q];
        if (tg === 255) { mu += du; mv += dv; }
        else if (tg) { const F = campo[tg], d = F ? desplazar(F, mu, mv) : null;
          if (d) { mu = d[0]; mv = d[1]; }
          else { const mm = mov[tg]; if (mm) { const x = mu - mm[0], y = mv - mm[1]; mu = mm[2] + mm[4] * x + mm[5] * y; mv = mm[3] + mm[6] * x + mm[7] * y; } } }
        const gx = mu * RT, gy = mv * RT, ix = Math.floor(gx), iy = Math.floor(gy), tx = gx - ix, ty = gy - iy;
        const h00 = hash(ix, iy), h10 = hash(ix + 1, iy), h01 = hash(ix, iy + 1), h11 = hash(ix + 1, iy + 1);
        const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty, wn = 1 / Math.sqrt(w00 * w00 + w10 * w10 + w01 * w01 + w11 * w11);
        const sr = (GR[h00] * w00 + GR[h10] * w10 + GR[h01] * w01 + GR[h11] * w11) * wn, si = (GI[h00] * w00 + GI[h10] * w10 + GI[h01] * w01 + GI[h11] * w11) * wn;
        const hn = hash(q, fr + 17), hc = hash(q, 3);
        const a = tg && tg !== 255 ? A[q] * lento(mu, mv) : A[q], c = CL[q];
        I[q] = a * sr + ruido * GR[hn] + c * GR[hc]; Q[q] = a * si + ruido * GI[hn] + c * GI[hc];
      }
    } else {
      // el de hoy: una celda de 0,15 mm por muestra; la sangre salta a otro patrón cada 20 ms
      const RET = 1 / 0.15, offU = (Math.imul(fr, 7919) & 1023) * 0.37, offV = (Math.imul(fr, 104729) & 1023) * 0.53;
      for (let q = 0; q < N; q++) {
        const tg = TAG[q]; let mu = X[q], mv = Y[q];
        if (tg === 255) { mu += offU; mv += offV; }
        else if (tg) { const F = campo[tg], d = F ? desplazar(F, mu, mv) : null;
          if (d) { mu = d[0]; mv = d[1]; }
          else { const mm = mov[tg]; if (mm) { const x = mu - mm[0], y = mv - mm[1]; mu = mm[2] + mm[4] * x + mm[5] * y; mv = mm[3] + mm[6] * x + mm[7] * y; } } }
        const h = hash(Math.floor(mu * RET), Math.floor(mv * RET)), hn = hash(q, fr + 17), hc = hash(q, 3);
        const a = tg && tg !== 255 ? A[q] * lento(mu, mv) : A[q], c = CL[q];
        I[q] = a * GR[h] + ruido * GR[hn] + c * GR[hc]; Q[q] = a * GI[h] + ruido * GI[hn] + c * GI[hc];
      }
    }
    reloj.push(performance.now());
    desenfocar(I); desenfocar(Q); reloj.push(performance.now());
    // ganancia por profundidad: 4 mandos repartidos de arriba abajo, interpolados
    const TG = new Float32Array(ns);
    if (m.tgc > 0 && o.tgc) for (let j = 0; j < ns; j++) { const f = j / (ns - 1) * 3, k = Math.min(2, Math.floor(f)), u = f - k; TG[j] = o.tgc[k] + (o.tgc[k + 1] - o.tgc[k]) * u; }
    const { E, T, NORM, GAN } = G, kAx = G.kAx, ra = (kAx.length - 1) >> 1;
    for (let j = 0; j < ns; j++) {
      const oo = j * nb; E.fill(0, oo, oo + nb); T.fill(0, oo, oo + nb);
      for (let p = -ra; p <= ra; p++) { const w = kAx[p + ra], o2 = clamp(j + p, 0, ns - 1) * nb; for (let i = 0; i < nb; i++) { E[oo + i] += w * I[o2 + i]; T[oo + i] += w * Q[o2 + i]; } }
      const tg = TG[j];
      for (let i = 0; i < nb; i++) { const a = E[oo + i], b = T[oo + i]; E[oo + i] = 4.342944819 * Math.log((a * a + b * b) * NORM[oo + i] + 1e-12) + GAN[oo + i] + tg; }
    }
    reloj.push(performance.now());
    const { PIX, FB, FS, pix } = G, lo = DB_LO - (o.ganancia || 0), esc = 1023 / (DB_HI - DB_LO);
    pix.fill(0);
    for (let mm = 0; mm < PIX.length; mm++) {
      const fb = FB[mm], fs = FS[mm], b = fb | 0, s = fs | 0, tb = fb - b, ts = fs - s, q = s * nb + b;
      const e0 = E[q] + (E[q + 1] - E[q]) * tb, e1 = E[q + nb] + (E[q + nb + 1] - E[q + nb]) * tb;
      const kk = clamp(((e0 + (e1 - e0) * ts - lo) * esc) | 0, 0, 1023) * 3, o4 = 4 * PIX[mm];
      pix[o4] = LUT[kk]; pix[o4 + 1] = LUT[kk + 1]; pix[o4 + 2] = LUT[kk + 2]; pix[o4 + 3] = 255;
    }
    reloj.push(performance.now());
    const tiempos = { corte: reloj[1] - reloj[0], raster: reloj[2] - reloj[1], sombra: reloj[3] - reloj[2], moteado: reloj[4] - reloj[3], haz: reloj[5] - reloj[4], envolvente: reloj[6] - reloj[5], pantalla: reloj[7] - reloj[6], total: reloj[7] - reloj[0] };

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
    return { tiempos, columna, tag: TAG, etiquetas: etiqueta, campos: campo, x: X, y: Y, pix, ancho, alto, escala: G.k, cx: G.cx, arriba: G.top, db: E, nb, ns, dth: G.dth, dr: G.dr, abiertos, elementos: els, geometriaNueva: geoNueva,
      mitad: P.mitad, prof: P.prof, pared: G.pared, pulmon, apagado: (q) => FILL[q] && OD[q] < 6 && OR[q] < 0.35 };
  }

  /**
   * Doppler color sobre la última imagen: vel[q] = velocidad hacia la sonda (cm/s) de cada celda, NaN sin color.
   * Rojo-amarillo hacia la sonda, azul-cian alejándose; por encima de ±nyq la velocidad se "enrolla" al color
   * contrario (aliasing). Por debajo de 4 cm/s no se pinta (filtro de pared).
   */
  function colorear(vel, nyq) {
    const { PIX, FB, FS, pix } = G;
    for (let m = 0; m < PIX.length; m++) {
      const u = vel[Math.round(FS[m]) * nb + Math.round(FB[m])]; if (!(Math.abs(u) >= 4)) continue;
      const w = ((u + nyq) % (2 * nyq) + 2 * nyq) % (2 * nyq) - nyq, f = Math.min(1, Math.abs(w) / nyq), o4 = 4 * PIX[m];
      const fuerte = 70 + 185 * Math.min(1, f * 1.5), claro = 235 * Math.max(0, (f - 0.55) / 0.45);
      if (w > 0) { pix[o4] = fuerte; pix[o4 + 1] = claro; pix[o4 + 2] = 12; } else { pix[o4] = 12; pix[o4 + 1] = claro * 0.9; pix[o4 + 2] = fuerte; }
    }
  }
  return { formar, colorear, rejilla: (P) => geometria(P, { m: MEJORAS_DEFECTO }), nb, ns };
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
