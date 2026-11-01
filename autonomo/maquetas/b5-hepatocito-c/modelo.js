// Modelo de «El paciente de la cama 4»: funciones puras. Todo número entre 40 y 300 µmol/L es ilustrativo (la fuente solo da 60 y 150, p. 7).
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const TOPE = { nhMax: 300, normal: 60, edema: 150, mlSobrecarga: 3000, mlBolo: 500 };
export const nuevo = (o = {}) => { const s = { func: 52, dep: 0, rif: 0, cvvh: false, tips: false, alb: 2.4, oligu: false, sys: 85, dia: 50, fc0: 118, ml: { alb: 0, sal: 0, rl: 0 }, ult: null, ...o }; s.pam0 = (s.sys + 2 * s.dia) / 3; return s; };
const fLac = (d) => (d <= 0 ? 1 : d <= 3 ? 0.85 : 0.8), fRif = (r) => (r >= 10 ? 0.9 : r > 0 ? 0.95 : 1);
export function amonio(s, conCvvh = s.cvvh) {
  const f = s.func / 100; let nh = 40 + 260 * Math.pow(1 - f, 2);
  nh *= fLac(s.dep) * fRif(s.rif) * (s.tips ? 1 + 1.25 * (1 - f) : 1) * (conCvvh ? 0.55 : 1);
  return clamp(nh, 40 * 0.55, TOPE.nhMax);
}
export const whDe = (nh) => (nh < 60 ? 0 : nh < 110 ? 1 : nh < 200 ? 2 : nh < 260 ? 3 : 4);
export const WH = ['Sin encefalopatía', 'Grado 1 · distraído', 'Grado 2 · apático, desorientado en el tiempo', 'Grado 3 · estuporoso', 'Grado 4 · coma'];
export function leer(s) {
  const nh = amonio(s), nhSin = amonio(s, false), f = s.func / 100;
  const edema = (s.func <= 0 && !s.cvvh) || nh >= 250;
  let wh = whDe(nh); if (s.func <= 0 && !s.cvvh) wh = 4; if (s.ml.rl > 0) wh = Math.min(4, wh + 1);
  const mlTot = s.ml.alb + s.ml.sal + s.ml.rl;
  const d = 30 * (1 - Math.exp(-(s.ml.alb + (s.ml.sal + s.ml.rl) * 0.375) / 1000)) - (s.dep >= 7 ? 12 : 0) - (s.dep >= 5 && s.dep < 7 ? 3 : 0);
  const sys = Math.round(s.sys + d), dia = Math.round(s.dia + 0.6 * d), pam = Math.round((sys + 2 * dia) / 3);
  const fc = Math.round(clamp(s.fc0 - 1.2 * (pam - s.pam0), 68, 140));
  const prod = fLac(s.dep) * fRif(s.rif) * (s.tips ? 1 : 1);
  return { nh, nhSin, wh, edema, sys, dia, pam, fc, mlTot, f, prod, ictericia: s.func < 70, oligu: s.oligu || s.func <= 0 };
}
// Topes: cada uno con su página y su origen. nivel 'aviso' | 'sello' (tono 'ok' = objetivo cumplido).
export function topes(s, L) {
  const t = []; const poner = (c, n, titulo, texto, pag, origen, off = [], tono = '') => t.push({ c, n, titulo, texto, pag, origen, off, tono });
  if (L.edema) poner('edema', 'sello', 'Edema cerebral', 'West Haven 4: el astrocito se hincha y el TC se parece a la Fig. 39.2. Lactulosa y rifaximina no bastan: la CVVH es superior en el fallo agudo.', '6', 'ficha · p. 6-8', ['[data-lac]', '[data-rif]']);
  else if (L.nh > 150 && !s.cvvh) poner('nh150', 'aviso', 'Amonio >150 µmol/L', 'Riesgo de edema cerebral: es una de las tres puertas de la CVVH.', '7a', 'ficha · p. 7');
  if (s.dep >= 7) poner('lac', 'sello', 'Hipovolemia', 'Diarrea osmótica profusa: la PA baja y la FC sube. Reduce o para la lactulosa.', '7', 'fisiología general; «reducir o parar» p. 7', ['[data-lac="5"]', '[data-lac="7"]']);
  else if (s.dep >= 5) poner('lac', 'aviso', 'Diarrea osmótica', 'Más de 2-3 deposiciones blandas al día: reduce o para la lactulosa.', '7', 'ficha · p. 7');
  if (s.rif > 0 && s.rif < 10) poner('rif', 'aviso', 'Rifaximina', 'La dosis eficaz es 400 mg 3 veces al día al menos 10 días: con menos, no cuenta como completa.', '7r', 'ficha · p. 7');
  if (s.cvvh && L.nhSin < 150 && !L.oligu && !(L.nhSin >= 250)) poner('cvvh', 'aviso', 'CVVH: no indicada todavía', 'Faltan las tres puertas: sin oliguria persistente, amonio ≤150 ni edema cerebral.', '8', 'ficha · p. 8');
  if (s.ml.rl > 0) poner('rl', 'aviso', 'Hiponatremia', 'El Ringer lactato empeora el edema cerebral: la cara pasa un grado.', '5', 'ficha · p. 5');
  if (s.ml.alb > 0 && s.alb < 3) poner('albok', 'sello', 'El 70 % se queda en el vaso', 'Albúmina 5 % con albúmina sérica <3 g/dL: expande el plasma y no promueve hiponatremia.', '5', 'ficha · p. 5', [], 'ok');
  else if (s.ml.alb > 0) poner('albok', 'aviso', 'Albúmina sérica ≥3 g/dL', 'La ficha la recomienda sobre todo cuando es <3 g/dL.', '5', 'ficha · p. 5');
  if (L.mlTot >= TOPE.mlSobrecarga) poner('vol', 'sello', 'Sobrecarga de volumen', 'Con ascitis y albúmina baja el exceso de líquido se queda fuera del vaso: edema y ascitis a tensión.', '9', 'fisiología general; tope ilustrativo', ['#b-fluido']);
  else if (L.mlTot > 0 && L.pam >= 65) poner('pam', 'aviso', 'Objetivo cumplido', 'PAM ≥65 mmHg: no hace falta más líquido (Tabla 39.3).', '9t', 'ficha · p. 9');
  if (s.tips) poner('tips', 'aviso', 'TIPS', 'Cambia un problema por otro: salta el hígado y sube el riesgo de encefalopatía.', '10', 'ficha · p. 10');
  return t;
}
export const fmt = (x, d = 0) => Number(x).toFixed(d).replace('.', ',');
