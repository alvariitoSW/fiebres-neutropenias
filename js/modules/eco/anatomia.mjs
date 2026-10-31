// Anatomía del corazón (mv-eco-2a5, B-045 opción A): las medidas que el corazón da a la imagen. Puro: no importa corazon-geo,
// formas, ecografia ni doppler (la imagen lee de aquí, nunca al revés). corazon-geo.mjs lo importa y reexporta todo con el
// mismo nombre de antes (API antigua viva). Contiene el tamaño de referencia (REF), el perfil del VI y su pared (geomVi),
// el TAPSE (tapseDeLatido, acortamientoVd), los mínimos de volumen (VOL_MIN, LIMITES) y (P3b) los anillos valvulares (anillosDe),
// las paredes (paredesDe, paredVdDe) y la masa del VI, con el perfil, el tabique aplanado y su cuerda que esas medidas necesitan. Cifras sin cambio respecto a corazon-geo.
const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const paso = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

// Mínimos de volumen (mL): por debajo, la geometría del corazón no se define (VI 8 mL, VD 20 mL, aurículas 15 mL). Son del
// corazón, no del dibujo: la imagen solo los lee. Ilustrativos: ninguna fuente de `docs/` da un mínimo de cavidad; son el
// límite donde el modelo geométrico (perfil del VI, tapas, anillos) sigue siendo válido. escenarios.mjs sube los volúmenes
// de reposo (suelo()) para que las formas de enfermedad no bajen de ellos. Los máximos (320, 330, 140 mL), igual: ilustrativos.
export const VOL_MIN = { vi: 8, vd: 20, au: 15 };
// Límites de la geometría: fuera de ellos el dibujo deja de seguir al motor (se avisa en la página).
export const LIMITES = { vi: [VOL_MIN.vi, 320], vd: [VOL_MIN.vd, 330], au: [VOL_MIN.au, 140] };

// lVi: largo del VI con 120 mL (de 78 a 80 mm al afinar el ápex, B2: con la misma pared, la bala estrecha necesita
// algo más de largo para el mismo volumen). lVdRel: el VD de Lang mide 71 ± 6 mm de base a ápex (Tabla 8, p. 20) y
// su ápex trabeculado llega cerca del ápex del VI (Mitchell 2019, p. 26); con 0,83 sale ~78 mm en el A4C del normal y ≤83 en el fallo del VI, de VI más largo (N2)
export const REF = {
  vVi: 120, lVi: 80, vMioVi: 130,
  vVd: 140, phiA: 1.15, phiB: 4.45, lVdRel: 0.83, paredVd: 4.0,
  vAi: 40, vAd: 35,
};


export const SB = 0.22, EXP_BALA = [2.0, 0.6];
export const balaExacta = (s) => Math.pow(Math.max(0, 1 - Math.pow(clamp(s, 0, 1), EXP_BALA[0])), EXP_BALA[1]);
// Volumen del perfil con 48 cortes. Las posiciones relativas de los cortes no dependen de L, así que
// r_i = (1 − w_i)·Rb + w_i·b_i·Rm y el volumen es una cuadrática en (Rb, Rm): se precalculan las sumas.
export const N_VOL = 48; let S00 = 0, S01 = 0, S11 = 0;
for (let i = 0; i < N_VOL; i++) { const sv = (i + 0.5) / N_VOL, w = paso(0, SB, sv), b = balaExacta(sv);
  S00 += (1 - w) * (1 - w); S01 += (1 - w) * w * b; S11 += w * w * b * b; }
export const volPerfil = (Rb, Rm, L) => Math.PI * L / N_VOL / 1000 * (Rb * Rb * S00 + 2 * Rb * Rm * S01 + Rm * Rm * S11);   // mL
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


// F5 · TAPSE = acortamiento longitudinal de la pared libre del VD (ver «TAPSE» en mover). Fracción del largo base-ápex
// del VD que baja el anillo lateral con la eyección normal: 24 mm de TAPSE (Lang 2015, Tabla 10, p. 23) sobre 71 mm de
// largo del VD (Tabla 8, p. 20) = 0,34. Se escala con lo que el VD llega a vaciarse (que ya contiene su activación eVd y
// la poscarga del motor) respecto a la FE normal del VD (58 %, Lang p. 23). Ilustrativo: la fuente no da la relación.
export const ACORT_LONG_VD = 24 / 71, FE_VD_REF = 0.58;
// p3-tapse · El acortamiento longitudinal NO cae lineal hasta 0 con la FE del VD: aunque la pared libre apenas se contraiga
// (sobrecarga de presión, FE del VD de 10-15 %), el anillo tricuspídeo sigue bajando por la tracción del VI (tabique y
// plano AV comunes) y por el movimiento del corazón entero. Por eso el TAPSE del fallo grave del VD queda en unos 6-9 mm y
// no en 3-5 mm. Con r = FE/FE normal: lineal (como en F5) a partir de r = 0,7, y por debajo r·(1 + 1,6·(1 − r/0,7)²):
// empalme suave, pendiente finita en 0 (la mezcla entre fotogramas interpola bien), vale 0 sin eyección (el anillo no baja
// en telediástole) y deja el VD normal exactamente como estaba (23 mm). Con FE del VD de 9-13 % da 6-8 mm.
// Ilustrativa (fisiología general; las fuentes de `docs/` dan el umbral, no la ley: Lang p. 23 <17 mm anormal;
// Mukherjee 2025 p. 145 llama grave a ≤10 mm, no a 4 mm).
export const R_LINEAL_ACORT_VD = 0.7, REFUERZO_ACORT_VD = 1.6;
export const acortamientoVd = (feVd) => { const r = clamp(feVd / FE_VD_REF, 0, 1.3), q = Math.max(0, 1 - r / R_LINEAL_ACORT_VD);
  return ACORT_LONG_VD * r * (1 + REFUERZO_ACORT_VD * q * q); };
/** TAPSE (mm) de un latido del motor (motor.ultimo): acortamiento × largo telediastólico del VD. */
export const tapseDeLatido = (u, mio = 1) => Math.min(35, acortamientoVd(u.feD) * geomVi(u.edv, mio).Le * REF.lVdRel);

// Perfil del VI desde la base (s = 0) al ápex (s = 1). Antes, (1 − s^2,3)^0,55: casi media elipse, con los lados
// paralelos hasta la mitad y un ápex romo («bala»). Ahora el VI se estrecha poco a poco desde el tercio basal y
// acaba en un ápex redondeado más estrecho (anatomía general, ilustrativo; Lang 2015 p. 6 avisa de que la forma de
// bala del método área-longitud no siempre se cumple; la relación largo/ancho normal está en su Suplemento: hueco)
// tabla con interpolación (la bala se evalúa en cada vértice de cada fotograma)
const N_TABLA = 2048, TABLA_BALA = new Float32Array(N_TABLA + 1);
for (let i = 0; i <= N_TABLA; i++) TABLA_BALA[i] = balaExacta(i / N_TABLA);
export const bala = (s) => { const x = clamp(s, 0, 1) * N_TABLA, i = Math.min(N_TABLA - 1, x | 0); return mix(TABLA_BALA[i], TABLA_BALA[i + 1], x - i); };
export function perfil(z, Rb, Rm, L) {
  const s = -z / L; if (s >= 1) return 0;
  return mix(Rb, Rm * bala(s), paso(0, SB, Math.max(0, s)));
}
// Escala de los anillos: se contraen ~20% de diástole a sístole (ilustrativo)
export const escalaAnillo = (v, v0, v1) => 0.8 + 0.2 * clamp((v - v0) / (v1 - v0), 0, 1.75);
// Tabique aplanado (formas de enfermedad): centro de la media luna del VD y medio ángulo máximo del arco que se
// aplana (~55°, ilustrativo)
export const PHI_SEPTO = (REF.phiA + REF.phiB) / 2;
// medio ángulo del tabique aplanado del todo (rad): con 1,1, el índice de excentricidad del VI llega a ~1,4 (Ryan 1985:
// 1,44 ± 0,16 en telesístole en la sobrecarga de presión; Atlas · 14). Ilustrativo
export const ALFA_SEPTO = 1.1;
const ANCHO_UNION = 1.05, KERNEL_UNION = 1.0;   // rad: hasta dónde se redondea y cuánto promedia (ver radioConCuerda)
// Orificio de salida del VD (z = 0) y anillo pulmonar: semiejes (mm) a tamaño normal y radio del tubo en la válvula
// pulmonar. Se eligen para que el TSVD salga en Lang 2015, p. 20 (Tabla 8): PLAX 25 ± 2,5, proximal 28 ± 3,5, distal 22 ± 2,5
export const RVOT = { a: 10, b: 11.5, rP: 12 };
export const EXP_AREA_VD = 0.58;
// R3 · Radio de un contorno redondo de radio r al que una cuerda (a distancia `num` del centro, medio ángulo a, centrada en
// PHI_SEPTO) le quita el segmento. El mínimo simple deja dos esquinas de ~117° (el VI del TEP salía facetado, como un
// polígono): se redondean con un promedio del radio en ±KERNEL_UNION rad alrededor de cada unión (peso coseno, 17 muestras);
// el centro de la cuerda (donde se mide el índice de excentricidad) y el resto del círculo no cambian. Ilustrativo.
export function radioConCuerda(r, num, a, f) {
  const crudo = (g) => { const c = Math.cos(g - PHI_SEPTO); return c > 0 ? Math.min(r, num / c) : r; };
  const d = Math.abs(Math.abs(Math.atan2(Math.sin(f - PHI_SEPTO), Math.cos(f - PHI_SEPTO))) - a), w = 1 - paso(0, ANCHO_UNION, d);
  if (w <= 0) return crudo(f);
  let sum = 0, ws = 0; for (let i = -8; i <= 8; i++) { const k = 1 + Math.cos(Math.PI * i / 9); sum += k * crudo(f + i * KERNEL_UNION / 8); ws += k; }
  return mix(crudo(f), sum / ws, w);
}
// Área (por r², rad) que la cuerda redondeada le quita al círculo unidad según su medio ángulo a: tabla de 0 a ALFA_SEPTO, calculada una vez
let TABLA_CUERDA = null;
export function areaCuerda(a) {
  if (!TABLA_CUERDA) { const N = 40, NA = 120; TABLA_CUERDA = [];
    for (let i = 0; i <= N; i++) { const ai = ALFA_SEPTO * i / N; let q = 0;
      for (let j = 0; j < NA; j++) { const f = PHI_SEPTO + (j + 0.5) / NA * TAU - Math.PI, rs = radioConCuerda(1, Math.cos(ai), ai, f); q += 0.5 * (1 - rs * rs) * TAU / NA; }
      TABLA_CUERDA.push(q); } }
  const x = clamp(a / ALFA_SEPTO, 0, 1) * 40, i = Math.min(39, Math.floor(x)); return TABLA_CUERDA[i] + (TABLA_CUERDA[i + 1] - TABLA_CUERDA[i]) * (x - i);
}

// ---- P3b · anillos, paredes y masa: el corazón los da, el dibujo los lee ----------------------------------------------------
export const U_VI = 2.234;   // ángulo del eje mitroaórtico en el plano basal (rad)
/** VI con el tabique aplanado (septo 0-1): la cuerda que se le quita a la cavidad se devuelve al radio (volumen = motor). */
export function viConSeptal(vvi, mio = 1, septoIn = 0) {
  const septo = clamp(septoIn, 0, 1);
  const alfa = (z, L) => { const sv = -z / L; return ALFA_SEPTO * septo * paso(0, 0.2, sv) * (1 - paso(0.7, 0.95, sv)); };
  let vi = geomVi(vvi, mio);
  if (septo > 0) {
    let quitado = 0; const dz = vi.L / N_VOL;
    for (let i = 0; i < N_VOL; i++) { const z = -(i + 0.5) * dz, r = perfil(z, vi.Rb, vi.Rm, vi.L), a = alfa(z, vi.L);
      if (a <= 0) continue;
      const q = r * r * areaCuerda(a);
      quitado += q * dz; }
    vi = geomVi(vvi, mio, quitado / 1000);
  }
  return { vi, alfa, septo };
}
/** Factores y semiejes (mm) de los anillos: mitral y aórtico del VI (escala con el volumen del VI), tricuspídeo y pulmonar del VD
 *  (escala con el volumen del VD, ya limitado a LIMITES.vd). Áreas en mm² (`areas`) y cm² (`cm2`). Mismo cálculo de siempre. */
export function anillosDe(vvi, vvdIn) {
  const vvd = clamp(vvdIn, LIMITES.vd[0], LIMITES.vd[1]);
  const kM = escalaAnillo(vvi, 40, 120), rA = 10, aM = 11 * kM, bM = 15 * kM;
  // el anillo y la base del VD se contraen con el volumen; por encima del normal la base crece más deprisa (ver corazon-geo)
  const kT = 0.62 + 0.38 * clamp((vvd - 30) / 110, 0, 1) + 0.9 * Math.max(0, vvd - 140) / 110;
  const rT = 12 * kT, kR = Math.min(kT, 1.3), aR = RVOT.a * kR, bR = RVOT.b * kR;
  const areas = { mitral: Math.PI * aM * bM, tricus: Math.PI * rT * rT, aortica: Math.PI * rA * rA, pulmonar: Math.PI * aR * bR };
  const cm2 = { mit: areas.mitral / 100, tri: areas.tricus / 100, ao: areas.aortica / 100, pul: areas.pulmonar / 100 };
  return { kM, aM, bM, rA, kT, rT, kR, aR, bR, areas, cm2 };
}
/** Grosor (mm) de la pared libre del VD: más fina al dilatarse; mioVd la engrosa; engrosa en sístole (eVd) conservando volumen. */
export function paredVdDe(estado) {
  const vvd = clamp(estado.vvd, LIMITES.vd[0], LIMITES.vd[1]);
  const vvdCro = Math.max(40, estado.vvdTd ?? vvd);
  const engrosaVd = estado.vvdTd ? 1 + Math.max(paso(0.05, 0.5, estado.eVd ?? 0), paso(0.45, 0.75, 1 - vvd / estado.vvdTd)) * (clamp(Math.pow(estado.vvdTd / Math.max(vvd, 0.3 * estado.vvdTd), EXP_AREA_VD), 1, 1.8) - 1) : 1;
  return REF.paredVd * Math.pow(REF.vVd / vvdCro, 0.33) * (estado.mioVd ?? 1) * engrosaVd;
}
/** Pared posterior del VI (mm) a un 30 % del largo desde la base, en el lado opuesto al eje mitroaórtico (la que mide medidasCorazon). */
export function paredViDe(estado) {
  const { vi, alfa } = viConSeptal(estado.vvi, estado.mioVi ?? 1, estado.septo ?? 0);
  const z = -0.3 * vi.L, f = U_VI + Math.PI, a = alfa(z, vi.L);
  const rEndoC = perfil(z, vi.Rb, vi.Rm, vi.L), rEpiC = perfil(Math.max(z, -vi.Le), vi.ReB, vi.Rme, vi.Le);
  const rEndo = a <= 0 ? rEndoC : radioConCuerda(rEndoC, rEndoC * Math.cos(a), a, f);
  const rEpi = a <= 0 ? rEpiC : radioConCuerda(rEpiC, rEpiC - rEndoC * (1 - Math.cos(a)), a, f);
  return rEpi - rEndo;
}
/** Masa del VI indexada (g/m²): volumen de miocardio × 1,05 g/mL (densidad: fisiología general) / superficie corporal. */
export const masaIndiceDe = (mio = 1, sc = 1.85) => REF.vMioVi * mio * 1.05 / sc;
/** Paredes y masa que da el corazón (mm, mm, g/m²). `estado` = el que ya recibe baseGeometrica (vvi, vvd, mioVi, mioVd, septo, vvdTd, eVd). */
export const paredesDe = (estado, sc = 1.85) => ({ paredVi: paredViDe(estado), paredVd: paredVdDe(estado), masaIndice: masaIndiceDe(estado.mioVi ?? 1, sc) });
