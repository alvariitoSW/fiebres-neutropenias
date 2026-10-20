// Lecturas del motor del latido para la hemodinámica de Marino (sin DOM): la recta de retorno venoso de Guyton, la
// presión en la punta del catéter de arteria pulmonar y la curva de termodilución. Solo LEEN el estado del motor: la
// fisiología del latido no cambia. Las usan los paneles de diagramas.mjs y las pruebas (pruebas/maniobras.test.mjs).
import { CURVAS_GUYTON } from './guyton-tablas.mjs';

// ---------------------------------------------------------------- Guyton
/**
 * Recta de retorno venoso del estado actual: RV = (Pms − PAD) / Rv (Marino, Ec. 11.1-11.2, ficha #mar-rv-ecuacion),
 * con Rv = (Pms − PVC) / GC del último latido. Pasa por el punto del paciente (PVC, GC) y corta el eje en PAD = Pms.
 * Devuelve null si no hay latido completo.
 */
export function guyton(motor) {
  const u = motor.ultimo;
  if (!u) return null;
  const pms = u.pmls, pvc = u.pvc, gc = u.gc, rv = (pms - pvc) / gc;
  const rvEn = (pad) => Math.max(0, (pms - pad) / rv);
  return { pms, pvc, gc, vs: u.vs, rv, gradiente: pms - pvc, rvEn, punto: { x: pvc, y: gc }, corte: pms };
}

/** Curva de función cardíaca precalculada de un escenario (guyton-tablas.mjs), ordenada por PVC: [{ x: PVC, y: GC }]. */
export function curvaFuncion(escenario) {
  const t = CURVAS_GUYTON[escenario];
  if (!t) return null;
  return t.pvc.map((x, i) => ({ x, y: t.gc[i] })).sort((a, b) => a.x - b.x);
}

/** GC de la curva de función a una PVC dada (interpolación lineal; null fuera de la tabla). */
export function funcionEn(curva, pvc) {
  if (!curva?.length || pvc < curva[0].x || pvc > curva[curva.length - 1].x) return null;
  for (let i = 1; i < curva.length; i++) {
    const a = curva[i - 1], b = curva[i];
    if (pvc <= b.x) return b.x === a.x ? a.y : a.y + (b.y - a.y) * (pvc - a.x) / (b.x - a.x);
  }
  return curva[curva.length - 1].y;
}

// ---------------------------------------------------------------- catéter de arteria pulmonar
// Recorrido de la Figura 8.2 y #mar-cap-pasos (Marino, cap. 8, docs/marino-2024-practicas-monitorizacion-caps5-9.pdf
// p. 52). En el enclavamiento, con el globo hinchado no hay flujo y la punta lee la presión venosa del lado izquierdo
// (#mar-enclavamiento-ondas: «es la presión venosa del lado izquierdo»; #mar-enclavamiento-principio: P_W = P_C = P_AI):
// en el motor, la presión de las venas pulmonares (pvp), que desembocan en la AI.
export const LUGARES = {
  ad: { clave: 'pad', nombre: 'Aurícula derecha', corto: 'AD' },
  vd: { clave: 'pvd', nombre: 'Ventrículo derecho', corto: 'VD' },
  ap: { clave: 'pap', nombre: 'Arteria pulmonar', corto: 'AP' },
  enclavado: { clave: 'pvp', nombre: 'Enclavamiento', corto: 'Encl.' },
};
export const ORDEN_LUGARES = ['ad', 'vd', 'ap', 'enclavado'];

/** Presión (mmHg) en la punta del catéter para el estado mostrado (motor.s o una muestra del último latido). */
export function presionEnPunta(estado, lugar) {
  const L = LUGARES[lugar];
  if (!L || !estado) return null;
  return estado[L.clave];
}

/**
 * Lo que leería el monitor en cada sitio, del último latido completo:
 * AD media (PVC); VD sistólica y telediastólica (la telediastólica del VD = la PVC, ficha #mar-termodilucion);
 * AP sistólica, diastólica y media; enclavamiento medio.
 */
export function lecturaCateter(onda, u, lugar) {
  if (!onda?.length || !u) return null;
  const k = LUGARES[lugar]?.clave; if (!k) return null;
  let max = -Infinity, min = Infinity, suma = 0;
  for (const x of onda) { max = Math.max(max, x[k]); min = Math.min(min, x[k]); suma += x[k]; }
  const media = suma / onda.length;
  if (lugar === 'ad') return { media: u.pvc, max, min };
  if (lugar === 'vd') return { sistolica: u.pvd_max, diastolica: telediastolicaVd(onda, u), media, max, min };
  if (lugar === 'ap') return { sistolica: u.paps, diastolica: u.papd, media: u.papm, max, min };
  return { media, max, min };
}

/** Presión del VD al final de la diástole: la última muestra antes de que se cierre la tricúspide. */
export function telediastolicaVd(onda, u) {
  const t = u.tTriCierra;
  if (t == null) return Math.min(...onda.map(x => x.pvd));
  let previa = onda[0];
  for (const x of onda) { if (x.t >= t) break; previa = x; }
  return previa.pvd;
}

// ---------------------------------------------------------------- termodilución
// El principio (#mar-termo-metodo, Marino cap. 8, p. 57): el área bajo la curva de temperatura es inversamente
// proporcional al gasto. La forma (Fig. 8.7, p. 59) es ilustrativa: una curva gamma, t² · e^(−t/τ), cuyo tiempo de
// tránsito τ es un volumen de mezcla entre el gasto (con más gasto, sube y baja antes: área pequeña). El pico no
// depende del gasto. Con insuficiencia tricuspídea (#mar-termo-errores, p. 60) el frío se recicla: la curva queda más
// baja y más larga y su área crece, así que el gasto medido sale por debajo del real. Todas las constantes, ilustrativas.
export const TERMO = { volMezcla: 8 / 60, pico: 1, dt: 0.1, duracion: 30, inyectado: 10 };   // L, °C, s, s, mL (10 mL: ficha)
const AREA_X_GC = 2 * TERMO.pico * TERMO.volMezcla * 60;       // área (°C·s) × GC (L/min) = constante del monitor

/**
 * Curva de termodilución para un gasto gc (L/min) y una insuficiencia tricuspídea qRegT (flujo regurgitante, L/min;
 * 0 = válvula competente). Devuelve { puntos: [{ t, dT }], area, gcMedido, fr }.
 */
export function curvaTermo(gc, qRegT = 0) {
  if (!(gc > 0)) return null;
  const fr = qRegT > 0 ? qRegT / (qRegT + gc) : 0;
  const tau = TERMO.volMezcla * 60 / gc * (1 + 2 * fr);
  const A = TERMO.pico / (1 + fr);
  const puntos = [];
  for (let t = 0; t <= TERMO.duracion + 1e-9; t += TERMO.dt) {
    const x = t / tau;
    puntos.push({ t: +t.toFixed(2), dT: A * x * x * Math.exp(-x) });
  }
  const area = 2 * A * tau;                  // ∫ A (t/τ)² e^(−t/τ) dt = 2Aτ (la cola que falta tras 30 s es despreciable)
  return { puntos, area, gcMedido: AREA_X_GC / area, fr, tau };
}

/** Área numérica (trapecios) de una curva, para comprobar la analítica. */
export function areaNumerica(puntos) {
  let a = 0;
  for (let i = 1; i < puntos.length; i++) a += (puntos[i].t - puntos[i - 1].t) * (puntos[i].dT + puntos[i - 1].dT) / 2;
  return a;
}

/** Varias medidas seguidas: la media y si difieren ≤10 % (#mar-termo-cuantas, Marino cap. 8, p. 59). */
export function medidasTermo(gcs) {
  if (!gcs.length) return null;
  const media = gcs.reduce((a, b) => a + b, 0) / gcs.length;
  const dif = (Math.max(...gcs) - Math.min(...gcs)) / Math.min(...gcs);
  return { media, dif, fiables: gcs.length >= 3 && Math.round(dif * 1000) <= 100 };
}
