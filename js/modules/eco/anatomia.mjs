// Anatomía del corazón (mv-eco-2a5, B-045 opción A): las medidas que el corazón da a la imagen. Puro: no importa corazon-geo,
// formas, ecografia ni doppler (la imagen lee de aquí, nunca al revés). corazon-geo.mjs lo importa y reexporta todo con el
// mismo nombre de antes (API antigua viva). Contiene el tamaño de referencia (REF), el perfil del VI y su pared (geomVi),
// el TAPSE (tapseDeLatido, acortamientoVd) y los mínimos de volumen (VOL_MIN, LIMITES). Cifras sin cambio respecto a corazon-geo.
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
