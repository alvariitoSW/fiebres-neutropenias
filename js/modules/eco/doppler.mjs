// Doppler (fase 4): velocidades de la sangre a partir de los flujos del motor, sin DOM.
//
// Válvulas: cada una abierta es un chorro. Su velocidad en el orificio es v0 = Q / área (cm/s, con Q en mL/s del
// motor y el área del anillo de la propia geometría por la fracción de apertura). Aguas abajo, el chorro se ensancha y
// se frena; aguas arriba, en las auriculoventriculares la sangre converge hacia el orificio y en las sigmoideas llega
// por el tracto de salida como por un tubo. Vasos (abdomen.mjs): perfil casi plano a lo largo del eje, con la velocidad
// media del flujo que les toca: VCI 2/3 del retorno venoso del motor, cada suprahepática 1/15 (fisiología general;
// ilustrativo), porta hepatópeta ~20 cm/s (VExUS, UCI Papers) que se vuelve pulsátil al subir la PVC (ilustrativo).
//
// Lo que se mide (E, A, E/A, TDE, ITV) sale de las muestras del último latido del motor (cada 2 ms), no de los
// fotogramas: así no depende de cuántas imágenes por segundo dé el móvil. El espectro y el color sí van por fotograma.
import { nrm, dot, cruz } from './mat.mjs';
import { VALVULAS, apertura } from './formas.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const largo = (a) => Math.hypot(a[0], a[1], a[2]);

export const VALV = Object.fromEntries(VALVULAS.map(v => [v.n, v]));
export const NOMBRE_FUENTE = { mitral: 'Mitral', tricus: 'Tricúspide', aortica: 'Aórtica', pulmonar: 'Pulmonar' };
const SALIDA = { aortica: true, pulmonar: true };

/** Áreas de los anillos (mm²) a partir de la geometría (corazon-geo, baseGeometrica). */
export const areasAnillo = (g) => ({ mitral: Math.PI * g.aM * g.bM, tricus: Math.PI * g.rT * g.rT, aortica: Math.PI * g.rA * g.rA, pulmonar: Math.PI * g.aR * g.bR });

/** Velocidad en el orificio (cm/s) de una válvula en una muestra del motor (0 si está cerrada). */
export function velOrificio(n, s, areas) {
  const v = VALV[n], q = s[v.q] || 0, ap = apertura(v, s);
  if (q <= 0 || ap <= 0.02) return 0;
  return q / (areas[n] / 100 * Math.max(0.15, ap));
}

/** Velocidad media en el anillo (cm/s): la del tracto de salida bajo una sigmoidea abierta. */
export const velTubo = (n, s, areas) => Math.max(0, s[VALV[n].q] || 0) / (areas[n] / 100);

/**
 * Fuentes de flujo de este instante. flujo: el de la geometría del fotograma (centros de las válvulas y su
 * transformación con el latido); s: estado del motor; areas: areasAnillo; vasos: abdomen.vasos (o []);
 * m: { rRetorno, pvc }.
 */
export function fuentesFlujo(flujo, s, areas, vasos = [], m = {}) {
  const T = (p) => flujo.transformar(p), V = flujo.valvulas;
  const destino = {
    mitral: flujo.enCamara.vi([0.35, 0, 0]),
    tricus: flujo.enCamara.vd([0.3, 0.5, 0.5]),
    aortica: [V.aortica[0], V.aortica[1], V.aortica[2] + 18],
    pulmonar: (() => { let mejor = 0, dm = Infinity; for (let t = 0; t <= 0.6; t += 0.02) { const d = largo(res(flujo.enVia('apD', t), V.pulmonar)); if (d < dm) { dm = d; mejor = t; } }
      return flujo.enVia('apD', Math.min(1, mejor + 0.08)); })(),
  };
  // geom: las cuatro, abiertas del todo y a velocidad 1 (para saber qué chorro cae en la muestra aunque esté cerrada)
  const valvulas = [], geom = [];
  for (const n of Object.keys(NOMBRE_FUENTE)) {
    const c = T(V[n]), dir = nrm(res(T(destino[n]), c));
    geom.push({ n, c, dir, a: Math.sqrt(areas[n] / Math.PI), v0: 1, vTubo: 1, salida: !!SALIDA[n] });
    const v0 = velOrificio(n, s, areas); if (!v0) continue;
    const ap = Math.max(0.15, apertura(VALV[n], s));
    // vTubo: en el tracto de salida, por debajo de la válvula, la sangre llena todo el anillo (Q / área)
    valvulas.push({ n, c, dir, a: Math.sqrt(areas[n] * ap / Math.PI), aTubo: Math.sqrt(areas[n] / Math.PI), v0, vTubo: velTubo(n, s, areas), salida: !!SALIDA[n] });
  }
  // vasos: velocidad media a lo largo del eje (signo: en el sentido de sus puntos)
  return { valvulas, vasos: vasos.map(x => ({ ...x, vm: velVaso(x.tipo, x.r, s, m) })), geom };
}

/**
 * Velocidad media (cm/s) de un vaso del abdomen en una muestra del motor, en el sentido de sus puntos (VCI y
 * suprahepáticas, hacia el corazón; porta, hepatópeta). tipo: 'vci' | 'hepatica' | 'porta'; r: radio (mm);
 * m: { rRetorno, pvc }. Una sola copia para el espectro, el color y las medidas del latido.
 */
export function velVaso(tipo, r, s, m = {}) {
  const pvc = m.pvc ?? s.pad, q = m.rRetorno ? (s.pven - s.pad) / m.rRetorno : 0, area = Math.PI * (r / 10) * (r / 10);
  if (tipo === 'vci') return 0.67 * q / area;
  if (tipo === 'hepatica') return q / 15 / area;
  return 20 * (1 - clamp((pvc - 6) / 8, 0, 1.3) * clamp((s.pad - pvc) / 4, -1, 1));
}

/** Velocidad de la sangre (vector, cm/s) en el punto p. */
export function velocidad(p, F) {
  let vx = 0, vy = 0, vz = 0;
  for (const j of F.valvulas) {
    const d = res(p, j.c), s = dot(d, j.dir), lat = res(d, esc(j.dir, s)), rho = largo(lat);
    let mag = 0, dir = j.dir;
    if (s >= 0 && j.salida) {
      // pasada la sigmoidea, el chorro va por la raíz (aórtica o tronco pulmonar): un tubo corto, sin abrirse
      const a = j.aTubo ?? j.a; if (s > 35 || rho > 1.15 * a) continue;
      mag = j.v0 * Math.exp(-Math.pow(rho / (1.05 * j.a + 0.15 * s), 4)) * Math.exp(-s / 90);
    } else if (s >= 0) { const w = j.a * (1 + s / 80); if (rho > 1.6 * w || s > 90) continue; mag = j.v0 * (j.a / w) * (j.a / w) * Math.exp(-2 * (rho / w) * (rho / w)) * Math.exp(-s / 70); }
    else if (j.salida) { const a = j.aTubo ?? j.a; if (s < -28 || rho > 1.15 * a) continue; mag = j.vTubo * 0.92 * Math.exp(-Math.pow(rho / (1.05 * a), 4)); }
    else { const r2 = s * s + rho * rho; if (r2 > 4.8 * j.a * j.a) continue; mag = j.v0 * j.a * j.a / (j.a * j.a + r2); dir = nrm(res(j.c, p)); }
    vx += dir[0] * mag; vy += dir[1] * mag; vz += dir[2] * mag;
  }
  for (const v of F.vasos) {
    const P = v.pts; let mejor = Infinity, tan = null;
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], ab = res(P[i], a), l2 = dot(ab, ab) || 1e-9, t = clamp(dot(res(p, a), ab) / l2, 0, 1);
      const q = sum(a, esc(ab, t)), d = largo(res(p, q)); if (d < mejor) { mejor = d; tan = ab; }
    }
    if (mejor >= v.r) continue;
    const x2 = (mejor / v.r) * (mejor / v.r), mag = v.vm * (1 - x2 * x2), t = nrm(tan);   // perfil casi plano (venas)
    vx += t[0] * mag; vy += t[1] * mag; vz += t[2] * mag;
  }
  return [vx, vy, vz];
}

/** Solo las fuentes que pueden tocar el plano P (con margen): abarata el color, que evalúa miles de puntos. */
export function fuentesCerca(F, P, margen = 6) {
  const dist = (q) => Math.abs(dot(res(q, P.O), P.n));
  return {
    valvulas: F.valvulas.filter(j => dist(j.c) < 4 * j.a + 60 * Math.abs(dot(j.dir, P.n)) + margen),
    vasos: F.vasos.filter(v => v.pts.some(q => dist(q) < v.r + margen)),
  };
}

// ---------------------------------------------------------------------------- Doppler pulsado
/** Puntos del volumen de muestra (3 mm) alrededor de g, en el plano P y a ambos lados de él. */
export function puntosMuestra(P, g, haz) {
  const lat = nrm(cruz(haz, P.n)), out = [];
  for (const a of [-1.5, 0, 1.5]) for (const b of [-1.2, 0, 1.2]) out.push(sum(sum(g, esc(haz, a)), esc(lat, b)));
  out.push(sum(g, esc(P.n, 1.2)), sum(g, esc(P.n, -1.2)));
  return out;
}
/** Velocidades medidas en la muestra (cm/s; + hacia la sonda). */
export const velocidadesMuestra = (pts, haz, F) => pts.map(p => -dot(velocidad(p, F), haz));

/** Columna del espectro (RGB por fila) para unas velocidades medidas; escala ±vmax, con aliasing. */
export function columnaEspectro(us, filas, vmax, semilla = 1) {
  const out = new Uint8ClampedArray(filas * 3);
  let a = (semilla * 2654435761) >>> 0; const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const envolver = (u) => ((u + vmax) % (2 * vmax) + 2 * vmax) % (2 * vmax) - vmax;
  for (let y = 0; y < filas; y++) {
    const vy = vmax * (1 - 2 * (y + 0.5) / filas); let I = 0;
    for (const u0 of us) { if (Math.abs(u0) < 4) continue;          // filtro de pared
      const u = envolver(u0), sg = 2.5 + 0.05 * Math.abs(u0), z = (vy - u) / sg;
      I += Math.exp(-z * z) + (vy * u > 0 && Math.abs(vy) < Math.abs(u) ? 0.12 : 0); }   // relleno hasta la línea de base
    I = I / us.length * (0.7 + 0.6 * rnd()) + 0.03 * rnd();
    const g = 255 * Math.min(1, Math.pow(I, 0.6) * 1.35);
    out[3 * y] = g; out[3 * y + 1] = g * 0.97; out[3 * y + 2] = g * 0.9;
  }
  return out;
}

// ---------------------------------------------------------------------------- Doppler color
/**
 * Velocidad hacia la sonda (cm/s) en cada celda de sangre de la imagen (im de ecografia.formar); NaN donde no hay
 * sangre. Se calcula en una rejilla gruesa (cada 2 haces y 3 muestras) y se reparte a sus celdas.
 */
export function mapaColor(P, im, F) {
  const { nb, ns, tag, x: X, y: Y } = im, out = new Float32Array(nb * ns).fill(NaN), Fc = fuentesCerca(F, P);
  if (!Fc.valvulas.length && !Fc.vasos.length) return out;
  for (let j = 1; j < ns; j += 3) for (let i = 0; i < nb; i += 2) {
    const q = j * nb + i; if (tag[q] !== 255) continue;
    const u = X[q], v = Y[q], p = sum(P.O, sum(esc(P.r, u), esc(P.d, v))), haz = nrm(sum(esc(P.r, u), esc(P.d, v)));
    const w = -dot(velocidad(p, Fc), haz);
    for (let jj = j - 1; jj <= Math.min(ns - 1, j + 1); jj++) for (let ii = i; ii <= Math.min(nb - 1, i + 1); ii++) { const k = jj * nb + ii; if (tag[k] === 255) out[k] = w; }
  }
  return out;
}

// ---------------------------------------------------------------------------- medidas sobre el último latido
/**
 * Curva de velocidad (cm/s, con signo hacia la sonda) del último latido en el volumen de muestra, a partir de las
 * muestras del motor (onda). fuente: la que domina en la muestra ({ tipo: 'valvula', n } o { tipo: 'vaso', ... }),
 * factor: cuánto de su velocidad llega a la muestra en el fotograma actual (forma del chorro y ángulo con el haz).
 */
export function curvaLatido(onda, fuente, factor, areas, m) {
  if (fuente.tipo === 'valvula') return onda.map(s => ({ t: s.t, fase: s.fase, v: factor * (fuente.tubo ? velTubo(fuente.n, s, areas) : velOrificio(fuente.n, s, areas)) }));
  return onda.map(s => ({ t: s.t, fase: s.fase, v: factor * velVaso(fuente.vasoTipo, fuente.r, s, m) }));
}

/** Qué fuente domina en la muestra y con qué factor (velocidad medida / velocidad de la fuente). */
export function fuenteEnMuestra(pts, haz, F) {
  let mejor = null;
  const medir = (Fx) => { const us = velocidadesMuestra(pts, haz, Fx); return us.reduce((a, b) => a + b, 0) / us.length; };
  // a velocidad 1: u es directamente el factor (forma del chorro o del perfil, y ángulo con el haz)
  const g = pts[0 + 4];        // el centro de la muestra (puntosMuestra lo pone en el índice 4)
  for (const j of F.geom) { const u = medir({ valvulas: [j], vasos: [] }); if (!mejor || Math.abs(u) > Math.abs(mejor.factor))
    mejor = { tipo: 'valvula', n: j.n, nombre: NOMBRE_FUENTE[j.n] + (j.salida && dot(res(g, j.c), j.dir) < 0 ? ' · tracto de salida' : ''), tubo: j.salida && dot(res(g, j.c), j.dir) < 0, factor: u }; }
  for (const v of F.vasos) { const u = medir({ valvulas: [], vasos: [{ ...v, vm: 1 }] }); if (!mejor || Math.abs(u) > Math.abs(mejor.factor)) mejor = { tipo: 'vaso', vasoTipo: v.tipo, nombre: v.nombre, r: v.r, factor: u }; }
  return mejor && Math.abs(mejor.factor) > 0.08 ? mejor : null;
}

/**
 * Tiempo de desaceleración de la onda E (ms): la pendiente desde su pico hasta la mitad, extrapolada a cero (2 × el
 * tiempo hasta la mitad). Si la E se funde con la A antes de caer a la mitad (relajación lenta, frecuencia alta), la
 * pendiente se toma hasta el 75% (4 × ese tiempo). null si no cae ni eso antes de la A.
 */
export function tdeDe(curva, iE, sg = 1) {
  const E = iE >= 0 ? sg * curva[iE].v : 0; if (!(E > 0)) return null;
  let t75 = null;
  for (let i = iE + 1; i < curva.length; i++) {
    if (curva[i].fase === 'A') break;
    const v = sg * curva[i].v;
    if (t75 == null && v <= 0.75 * E) t75 = curva[i].t;
    if (v <= E / 2) return 2 * (curva[i].t - curva[iE].t) * 1000;
  }
  return t75 == null ? null : 4 * (t75 - curva[iE].t) * 1000;
}

/**
 * Medidas del último latido según la fuente. Llenado AV (mitral, tricúspide): E (pico en F-G), A (pico en A), E/A
 * y tiempo de desaceleración (TDE: la pendiente de E desde su pico hasta la mitad, extrapolada a cero).
 * Eyección (aórtica, pulmonar): pico e integral velocidad-tiempo (ITV). Venas hepáticas: S (sístole, B-D),
 * D (diástole, E-G) y A (onda retrógrada, A). Porta y VCI: media y pulsatilidad ((máx − mín) / máx).
 */
export function medidasLatido(curva, fuente) {
  if (!curva.length) return null;
  // sentido del flujo (+ = hacia la sonda): el de la propia fuente, que factor ya trae (los puntos de un vaso van en
  // el sentido de su flujo: hacia el corazón o hepatópeta; un chorro, en el de su dirección). No se deduce de la onda
  // más alta, que en la congestión puede ser la retrógrada.
  const sg = Math.sign(fuente.factor || 0) || Math.sign(curva.reduce((a, c) => (Math.abs(c.v) > Math.abs(a) ? c.v : a), 0)) || 1;
  const en = (fs) => curva.filter(c => fs.includes(c.fase));
  const pico = (xs) => xs.reduce((a, c) => (sg * c.v > sg * a.v ? c : a), { v: 0, t: 0 });
  if (fuente.tipo === 'valvula' && !SALIDA[fuente.n]) {
    const E = pico(en('FG')), A = pico(en('A'));
    return { tipo: 'llenado', E: Math.abs(E.v), A: Math.abs(A.v), ea: A.v ? Math.abs(E.v / A.v) : null, tde: tdeDe(curva, curva.indexOf(E), sg) };
  }
  if (fuente.tipo === 'valvula') {
    let itv = 0; for (let i = 1; i < curva.length; i++) { const v = sg * curva[i].v; if (v > 0) itv += v * (curva[i].t - curva[i - 1].t); }
    return { tipo: 'eyeccion', pico: Math.abs(pico(curva).v), itv };
  }
  if (fuente.vasoTipo === 'hepatica') {
    // hacia el corazón (S y D) es el sentido de sg; la A va al revés
    const S = pico(en('BCD')), D = pico(en('EFG')), A = en('A').reduce((a, c) => (-sg * c.v > -sg * a.v ? c : a), { v: 0 });
    return { tipo: 'hepatica', S: sg * S.v, D: sg * D.v, A: -sg * A.v };
  }
  const vs = curva.map(c => sg * c.v), max = Math.max(...vs), min = Math.min(...vs);
  return { tipo: 'vena', media: vs.reduce((a, b) => a + b, 0) / vs.length, pulsatilidad: max > 0 ? (max - min) / max : null };
}
