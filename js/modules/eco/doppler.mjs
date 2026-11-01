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
import { anillosDe } from './anatomia.mjs';
import { AREA_VENA_PULMONAR_CM2 } from './referencias.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const largo = (a) => Math.hypot(a[0], a[1], a[2]);

export const VALV = Object.fromEntries(VALVULAS.map(v => [v.n, v]));
// radio de cada vena pulmonar (mm), el que dibuja corazon-geo (tubo de radio 5; ilustrativo). Sección de la vena medida (cm²): vena pulmonar superior derecha, 14,5 mm de diámetro (ficha: Cronin 2007, ver referencias.mjs). Amortiguación de la A reversa: ilustrativo
export const R_VENA_PULMONAR = 5, AMORTIGUA_AR = 0.35, AREA_VENA_PULMONAR = AREA_VENA_PULMONAR_CM2;
export const NOMBRE_FUENTE = { mitral: 'Mitral', tricus: 'Tricúspide', aortica: 'Aórtica', pulmonar: 'Pulmonar' };
const SALIDA = { aortica: true, pulmonar: true };

/** Áreas de los anillos (mm²) a partir de la geometría (corazon-geo, baseGeometrica). */
/** Áreas de los anillos (mm²) del corazón (anillosDe, anatomia.mjs): no hace falta construir el dibujo. Mismas cifras que areasAnillo(baseGeometrica). */
export const areasAnilloDe = (vvi, vvd) => anillosDe(vvi, vvd).areas;
/** API antigua: desde la geometría ya dibujada. */
export const areasAnillo = (g) => ({ mitral: Math.PI * g.aM * g.bM, tricus: Math.PI * g.rT * g.rT, aortica: Math.PI * g.rA * g.rA, pulmonar: Math.PI * g.aR * g.bR });

/** Velocidad en el orificio (cm/s) de una válvula en una muestra del motor (0 si está cerrada). */
export function velOrificio(n, s, areas) {
  const v = VALV[n], q = s[v.q] || 0, ap = apertura(v, s);
  if (q <= 0 || ap <= 0.02) return 0;
  return q / (areas[n] / 100 * Math.max(0.15, ap));
}

/**
 * Velocidad (cm/s) del chorro regurgitante mitral en una muestra del motor: Q / EROA, con Q = EROA · 50 · √ΔP (motor.mjs),
 * es decir v = 50·√ΔP cm/s (= √ΔP/2 m/s: Bernoulli, ΔP = 4v²; ~5 m/s con ΔP VI−AI de 100 mmHg). 0 sin reflujo.
 */
export const velRegMitral = (s, eroa) => (eroa > 0 && (s.qMitReg || 0) > 0 ? s.qMitReg / eroa : 0);

/**
 * Velocidad (cm/s) del chorro de la insuficiencia tricuspídea: Q / EROA con Q = EROA · 50 · ΔP/√(ΔP+0,25) (motor.mjs), es
 * decir v ≈ 50·√ΔP cm/s = √(ΔP VD−AD / 4) m/s (Bernoulli simplificado). Sale de la presión del motor (pvd − pad), igual que
 * la mitral. 0 sin reflujo; con EROA 0 (tricúspide competente) la IT trivial fisiológica no se pinta.
 */
export const velRegTricus = (s, eroa) => (eroa > 0 && (s.qTriReg || 0) > 0 ? s.qTriReg / eroa : 0);

/** Chorro libre de la IM (ilustrativo): tangente del semiángulo del cono (20°), radio a mitad de altura a la distancia s (mm) y velocidad del eje / v0. */
export const CONO_CHORRO = 0.37;
export const chorroLibreAncho = (a, s) => a + CONO_CHORRO * s;
export const chorroLibreEje = (a, s) => 1 / (1 + s / (3 * a));

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
  // P5b · chorro de la insuficiencia mitral: VI → AI desde la coaptación (central en la IM funcional). Existe en geom si hay
  // EROA (para reconocerlo con la muestra) y en valvulas solo en sístole, con la mitral cerrada. Q y v son los del motor.
  const eroa = m.eroaMitral || 0;
  if (eroa > 0 && flujo.coaptacionMitral) {
    const c = T(flujo.coaptacionMitral), dir = nrm(res(T(flujo.enCamara.ai([0.5, 0, 0])), c)), a = Math.sqrt(eroa * 100 / Math.PI);   // orificio: EROA en mm²
    geom.push({ n: 'regMitral', c, dir, a, v0: 1, vTubo: 1, salida: false, libre: true });
    const v0 = velRegMitral(s, eroa); if (v0 > 0 && !s.vMit) valvulas.push({ n: 'regMitral', c, dir, a, aTubo: a, v0, vTubo: 0, salida: false, libre: true });
  }
  // P5f · chorro de la insuficiencia tricuspídea: VD → AD desde el centro del anillo, solo en sístole (qTriReg > 0)
  const eroaT = m.eroaTricus || 0;
  if (eroaT > 0) {
    const c = T(V.tricus), dir = nrm(res(T(flujo.enCamara.ad([0.5, 0.5, 0])), c)), a = Math.sqrt(eroaT * 100 / Math.PI);
    geom.push({ n: 'regTricus', c, dir, a, v0: 1, vTubo: 1, salida: false, libre: true });
    const v0 = velRegTricus(s, eroaT); if (v0 > 0) valvulas.push({ n: 'regTricus', c, dir, a, aTubo: a, v0, vTubo: 0, salida: false, libre: true });
  }
  // F3 · las 4 venas pulmonares (eje en el sentido del flujo, hacia la AI; las mismas que dibuja la geometría y mueve el latido)
  const vp = [];
  if (flujo.enVia) for (let k = 0; k < 4; k++) {
    try { vp.push({ nombre: 'Vena pulmonar', tipo: 'pulmonar', r: R_VENA_PULMONAR, pts: [0, 0.25, 0.5, 0.75, 1].map(t => T(flujo.enVia('vp' + k, t))) }); } catch { break; }
  }
  // vasos: velocidad media a lo largo del eje (signo: en el sentido de sus puntos)
  return { valvulas, vasos: [...vasos, ...vp].map(x => ({ ...x, vm: velVaso(x.tipo, x.r, s, m) })), geom };
}

/**
 * Velocidad media (cm/s) de un vaso del abdomen en una muestra del motor, en el sentido de sus puntos (VCI y
 * suprahepáticas, hacia el corazón; porta, hepatópeta). tipo: 'vci' | 'hepatica' | 'porta'; r: radio (mm);
 * m: { rRetorno, pvc }. Una sola copia para el espectro, el color y las medidas del latido.
 */
export function velVaso(tipo, r, s, m = {}) {
  // Venas pulmonares: el flujo de la AI que da el motor (qVp, mL/s, + hacia la AI), repartido entre las 4 venas. La A reversa
  // (qVp < 0, la aurícula que se contrae empuja sangre hacia las venas) se amortigua: la distensibilidad de las venas absorbe parte (ilustrativo)
  // Área de la vena: la real de la superior derecha (1,65 cm², Cronin 2007; origen ficha). Con ella el S del normal sale ~50 cm/s frente a
  // 57-64 de varones y mujeres sanos (Wierzbowska-Drabik 2010): el ~12 % que falta es del flujo de la AI del motor, no del área.
  if (tipo === 'pulmonar') { const q = (s.qVp || 0) / 4; return (q < 0 ? AMORTIGUA_AR * q : q) / AREA_VENA_PULMONAR; }
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
    if (s >= 0 && j.libre) {
      // chorro libre turbulento (IM): tras la vena contracta se abre en cono y arrastra sangre; el ancho crece con la distancia y la
      // velocidad del eje cae ~1/distancia (Zoghbi 2017 p. 308: fisiología general); perfil gaussiano de ancho a mitad de altura 2w
      const w = chorroLibreAncho(j.a, s); if (s > 100 || rho > 2.2 * w) continue;
      mag = j.v0 * chorroLibreEje(j.a, s) * Math.exp(-Math.LN2 * (rho / w) * (rho / w));
    } else if (s >= 0 && j.salida) {
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
export function columnaEspectro(us, filas, vmax, semilla = 1, base = 0.5, modal = false) {
  const out = new Uint8ClampedArray(filas * 3);
  let a = (semilla * 2654435761) >>> 0; const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const lo = -2 * (1 - base) * vmax, envolver = (u) => ((u - lo) % (2 * vmax) + 2 * vmax) % (2 * vmax) + lo;   // el aliasing envuelve en el rango visible (con la base desplazada, también)
  for (let y = 0; y < filas; y++) {
    const vy = 2 * vmax * (base - (y + 0.5) / filas); let I = 0;
    for (const u0 of us) { if (Math.abs(u0) < 4) continue;          // filtro de pared
      const u = envolver(u0), sg = 2.5 + 0.05 * Math.abs(u0), z = (vy - u) / sg;
      I += Math.exp(-z * z) + (vy * u > 0 && Math.abs(vy) < Math.abs(u) ? (modal ? 0.03 + 0.1 * Math.pow(vy / u, 2) : 0.12) : 0); }   // relleno hasta la línea de base; con modal (CW de un chorro), borde denso e interior más tenue (densidad modal, Zoghbi 2017 Fig. 29)
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
  if (fuente.n === 'regMitral') return onda.map(s => ({ t: s.t, fase: s.fase, v: factor * velRegMitral(s, m.eroaMitral) }));
  if (fuente.n === 'regTricus') return onda.map(s => ({ t: s.t, fase: s.fase, v: factor * velRegTricus(s, m.eroaTricus) }));
  if (fuente.tipo === 'valvula') return onda.map(s => ({ t: s.t, fase: s.fase, v: factor * (fuente.tubo ? velTubo(fuente.n, s, areas) : velOrificio(fuente.n, s, areas)) }));
  return onda.map(s => ({ t: s.t, fase: s.fase, v: factor * velVaso(fuente.vasoTipo, fuente.r, s, m) }));
}

/**
 * Velocidad (cm/s, + hacia la sonda) que dibuja el espectro CW de una insuficiencia (IM, IT) en una muestra del motor: el chorro
 * sistólico (factor · v del chorro, negativo si se aleja) y, en diástole, el llenado de esa válvula (E y A) con el signo contrario,
 * porque el haz atraviesa el mismo orificio (Zoghbi 2017 Fig. 29: los tres paneles lo muestran). Solo para dibujar: las medidas
 * (curvaLatido) siguen leyendo el chorro. El ángulo del llenado se toma igual que el del chorro (ilustrativo).
 */
export function velCwReg(s, fuente, factor, areas, m) {
  const mit = fuente.n === 'regMitral', c0 = mit ? velRegMitral(s, m.eroaMitral) : velRegTricus(s, m.eroaTricus);
  // Bernoulli (ΔP = 4v²): por debajo de 0,6 m/s (ΔP ≈ 1,4 mmHg) no hay chorro, solo el flujo de cierre de la válvula; sin este corte quedaba una
  // meseta plana de decenas de cm/s en la contracción isovolumétrica (fisiología general; ilustrativo). E y A son la curva real del motor (velOrificio).
  const chorro = c0 < VCW_MIN_CHORRO ? 0 : c0;
  return factor * chorro - factor * velOrificio(mit ? 'mitral' : 'tricus', s, areas);
}
export const VCW_MIN_CHORRO = 60;

/**
 * Escalón del CW (cm/s, ilustrativo) para el espectro de una IM/IT. base: fracción de la altura a la que está la línea (0,2 = arriba).
 * Manda el chorro (abajo, cm/s): el escalón más pequeño en que cabe entero en su lado de la base (≤ 100 %), que lo deja en ≥ 60-70 % de su lado.
 * El llenado (arriba) entra solo si cabe sin bajar el chorro del 60 %: un pico de llenado que lo exigiría (la onda A de la tricúspide del motor) se sale por arriba.
 */
export const ESCALAS_CW = [150, 200, 225, 250, 300, 350, 400, 500, 700];
export function escalaCw(arriba, abajo, base) {
  const cabe = (e, ar) => abajo <= 2 * e * (1 - base) && (!ar || arriba <= 2 * e * base);
  const e0 = ESCALAS_CW.find(e => cabe(e, false)) ?? 700, e1 = ESCALAS_CW.find(e => cabe(e, true)) ?? 700;
  return abajo >= 0.6 * 2 * e1 * (1 - base) ? e1 : e0;
}

/** Qué fuente domina en la muestra y con qué factor (velocidad medida / velocidad de la fuente). */
export function fuenteEnMuestra(pts, haz, F) {
  let mejor = null;
  const medir = (Fx) => { const us = velocidadesMuestra(pts, haz, Fx); return us.reduce((a, b) => a + b, 0) / us.length; };
  // a velocidad 1: u es directamente el factor (forma del chorro o del perfil, y ángulo con el haz)
  const g = pts[0 + 4];        // el centro de la muestra (puntosMuestra lo pone en el índice 4)
  for (const j of F.geom) { const u = medir({ valvulas: [j], vasos: [] }); if (!mejor || Math.abs(u) > Math.abs(mejor.factor))
    mejor = { tipo: 'valvula', n: j.n, nombre: (NOMBRE_FUENTE[j.n] ?? (j.n === 'regTricus' ? 'Insuficiencia tricuspídea · chorro' : 'Insuficiencia mitral · chorro')) + (j.salida && dot(res(g, j.c), j.dir) < 0 ? ' · tracto de salida' : ''), tubo: j.salida && dot(res(g, j.c), j.dir) < 0, factor: u }; }
  for (const v of F.vasos) { const u = medir({ valvulas: [], vasos: [{ ...v, vm: 1 }] }); if (!mejor || Math.abs(u) > Math.abs(mejor.factor)) mejor = { tipo: 'vaso', vasoTipo: v.tipo, nombre: v.nombre, r: v.r, factor: u }; }
  // el chorro regurgitante, si la muestra cae de verdad en él, manda sobre la convergencia de la mitral (que no sabe de cierres)
  const reg = F.geom.find(j => j.n === 'regMitral');
  if (reg) { const u = medir({ valvulas: [reg], vasos: [] }); if (Math.abs(u) > 0.2) {
    // CW de la IM: igual que la IT, el haz atraviesa todo el chorro y se lee su máximo (vena contracta); solo cuenta el ángulo (cos θ)
    const cos = Math.abs(haz[0] * reg.dir[0] + haz[1] * reg.dir[1] + haz[2] * reg.dir[2]);
    return { tipo: 'valvula', n: 'regMitral', nombre: 'Insuficiencia mitral · chorro', tubo: false, factor: Math.sign(u) * cos }; } }
  const regT = F.geom.find(j => j.n === 'regTricus');
  if (regT) { const u = medir({ valvulas: [regT], vasos: [] }); if (Math.abs(u) > 0.2) {
    // Doppler continuo: la línea del haz atraviesa todo el chorro y el ecógrafo lee su máximo (la vena contracta), no la velocidad
    // a la distancia de la muestra, donde el chorro libre ya se abrió y frenó. Queda solo el ángulo (cos θ) entre el haz y el chorro.
    const cos = Math.abs(haz[0] * regT.dir[0] + haz[1] * regT.dir[1] + haz[2] * regT.dir[2]);
    return { tipo: 'valvula', n: 'regTricus', nombre: 'Insuficiencia tricuspídea · chorro', tubo: false, factor: Math.sign(u) * cos }; } }
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
export function medidasLatido(curva, fuente, m = {}) {
  if (!curva.length) return null;
  // sentido del flujo (+ = hacia la sonda): el de la propia fuente, que factor ya trae (los puntos de un vaso van en
  // el sentido de su flujo: hacia el corazón o hepatópeta; un chorro, en el de su dirección). No se deduce de la onda
  // más alta, que en la congestión puede ser la retrógrada.
  const sg = Math.sign(fuente.factor || 0) || Math.sign(curva.reduce((a, c) => (Math.abs(c.v) > Math.abs(a) ? c.v : a), 0)) || 1;
  const en = (fs) => curva.filter(c => fs.includes(c.fase));
  const pico = (xs) => xs.reduce((a, c) => (sg * c.v > sg * a.v ? c : a), { v: 0, t: 0 });
  if (fuente.n === 'regMitral') {   // sístole: pico del chorro (v = 4v² → ΔP VI−AI) e integral velocidad-tiempo
    let itv = 0; for (let i = 1; i < curva.length; i++) itv += Math.abs(curva[i].v) * (curva[i].t - curva[i - 1].t);
    return { tipo: 'regurgitacion', pico: Math.abs(pico(curva).v), itv };
  }
  if (fuente.n === 'regTricus') {   // IT: pico (vIT, m/s) e ITV; PSAP estimada = 4·vIT² + PVC (Bernoulli; ESC/ERS 2022: vIT > 3,4 m/s sugiere HP)
    let itv = 0; for (let i = 1; i < curva.length; i++) itv += Math.abs(curva[i].v) * (curva[i].t - curva[i - 1].t);
    const pico_ = Math.abs(pico(curva).v), vIT = pico_ / 100;
    return { tipo: 'regurgitacion', pico: pico_, itv, vIT, psap: Number.isFinite(m.pvc) ? 4 * vIT * vIT + m.pvc : null };
  }
  if (fuente.tipo === 'valvula' && !SALIDA[fuente.n]) {
    const E = pico(en('FG')), A = pico(en('A'));
    // fusión E-A: el «pico» de E es el primer punto tras la A y la onda ya venía más alta (la E cuelga de la rama descendente de
    // la A): no hay pico precoz propio y no se mide el TDE (Nagueh 2025, p. 547 (11): no medir el TDE con fusión)
    // ni (circular) cuando la E sube hasta el final del latido y la onda sigue subiendo hacia la A del latido siguiente (FC alta: la mitral abre dentro de la contracción auricular)
    const iE = curva.indexOf(E), sig = curva[(iE + 1) % curva.length];
    const fusion = (iE > 0 && curva[iE - 1].fase === 'A' && sg * curva[iE - 1].v >= sg * E.v) || (iE === curva.length - 1 && sig.fase === 'A' && sg * sig.v >= sg * E.v);
    // con fusión, el ecógrafo lee UNA onda (la fusionada): su pico es el mayor de los dos, no el «pico de E» que cuelga de la A
    // (a FC alta la E medida salía de 3-26 cm/s con una A de 126 y el E/e′ del TEP al 90-95 % caía a 0,2-1,7; mv-eco-2a5 P1).
    // A y E/A se quedan como estaban (E/A con el «pico» precoz)
    const Ev = fusion && Math.abs(E.v) < 0.5 * Math.abs(A.v) ? Math.abs(A.v) : Math.abs(E.v);   // solo si el «pico» de E es < ½ de A: no hay onda E propia (umbral ilustrativo)
    return { tipo: 'llenado', E: Ev, A: Math.abs(A.v), ea: A.v ? Math.abs(E.v / A.v) : null, tde: fusion ? null : tdeDe(curva, iE, sg), fusion };
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
  if (fuente.vasoTipo === 'pulmonar') {
    // Ar: el mayor flujo hacia las venas en la contracción auricular (A). S (suma de S1 y S2, Nagueh 2025): el mayor hacia la AI
    // desde que acaba la A reversa hasta que abre la mitral (relajación auricular + sístole ventricular); D: el de la diástole (E-G)
    const iA = curva.reduce((a, c, i) => (c.fase === 'A' && (a < 0 || -sg * c.v > -sg * curva[a].v) ? i : a), -1);
    const S = curva.filter((c, i) => (c.fase === 'A' ? i > iA : 'BCDE'.includes(c.fase))).reduce((a, c) => Math.max(a, sg * c.v), 0);
    const D = en('FG').reduce((a, c) => Math.max(a, sg * c.v), 0), Ar = iA >= 0 ? Math.max(0, -sg * curva[iA].v) : 0;
    return { tipo: 'pulmonar', S, D, Ar, sd: D > 0 ? S / D : null };
  }
  const vs = curva.map(c => sg * c.v), max = Math.max(...vs), min = Math.min(...vs);
  return { tipo: 'vena', media: vs.reduce((a, b) => a + b, 0) / vs.length, pulsatilidad: max > 0 ? (max - min) / max : null };
}
