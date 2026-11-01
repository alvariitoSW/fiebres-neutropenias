// Modelo de «El termostato de pared»: funciones puras. Cifras de la ficha: variación diaria ±0,6 °C y calor metabólico ≈1 °C/h (p. 45),
// golpe ≥41 °C (p. 47), parar a 38 °C y evaporativo 0,3 °C/min (p. 47), gases 2,5 °C/h (p. 56), paracetamol máx 3 g (p. 72), tabla 43.6 (p. 54).
// Todo lo demás (cargas por hora, tandas de enfriar, FC, CK) es ilustrativo.
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const TOPE = { max: 42, min: 22, golpe: 41, parar: 38, paraMax: 3, tirita: 30 };
export const PIR = [0, 38.3, 39.4, 40];                     // 0 = sin pirógeno; categorías de la Fig. 44.5 (p. 70-71); 40 = «>39,4» ilustrativo
export const CALOR = [0, 1.4, 2.6, 2.0];                    // °C/h que añade ambiente / esfuerzo / fármaco (ilustrativo)
export const FRIO = [0, 0.8, 4.5, 1.2];                     // °C/h que quita aire / agua <15 °C / alcohol (ilustrativo)
export const ENF = { evap: 1.5, inm: 2.0, hielo: 1.2, sal: 1.0, manta: 0.8 };   // °C por tanda de 5 min; evap = 0,3 °C/min × 5 (ficha), el resto ilustrativo
export const REC = { pasivo: 0.3, activo: 1.0, gases: 2.5, fcal: 0, f21: -0.5, ecmo: 3.0 };
export const nuevo = (o = {}) => ({ real: 37, pir: 0, dial: null, anti: 0, calor: 0, frio: 0, h: 0, paraG: 0, ck: 140, hCalor: 0, flags: {}, ...o });
export const esFiebre = (s) => !!(s.pir || s.dial != null);
export const ajuste = (s) => (s.dial != null ? s.dial : s.pir ? Math.max(37, PIR[s.pir] - s.anti) : 37);
const sudaOk = (s) => s.real < TOPE.golpe;
export function pasar(s) {            // una hora: la regulación persigue el dial, las cargas la empujan
  const aj = ajuste(s); let t = s.real + CALOR[s.calor] - (s.calor ? 0 : FRIO[s.frio]);   // calor y frío a la vez: se anula el frío («combinación no fisiológica»)
  if (t > aj && sudaOk(s)) t -= Math.min(1, t - aj);             // radiador: vasos abiertos y sudor
  else if (t < aj && s.real >= TOPE.tirita) t += Math.min(1, aj - t);   // caldera: escalofrío (cesa por debajo de 30 °C)
  s.real = clamp(t, TOPE.min, TOPE.max); s.h++; s.flags = {};
  if (s.real >= 40) s.hCalor++; s.ck = 140 + 900 * s.hCalor;
}
export function enfriar(s, k) {
  s.flags = {}; const fiebre = esFiebre(s);
  if (k === 'manta' && fiebre) { s.flags.manta = true; s.real = clamp(s.real + 0.4, TOPE.min, TOPE.max); return; }   // vasoconstricción y escalofrío (p. 72)
  if (!fiebre && s.real <= TOPE.parar) { s.flags.parar = true; s.real = clamp(s.real + 0.4, TOPE.min, TOPE.max); return; }   // pasarse de 38: el escalofrío la sube (p. 47)
  s.real = clamp(s.real - ENF[k], TOPE.min, TOPE.max); if (!fiebre && s.real <= TOPE.parar) s.flags.parar = true;
}
export function recalentar(s, k) {
  s.flags = {}; if (k === 'f21') s.flags.f21 = true; if (k === 'gases') s.flags.gases = true; if (k === 'fcal') s.flags.fcal = true;
  const d = REC[k]; s.real = clamp(d >= 0 ? Math.min(s.real + d, Math.max(s.real, ajuste(s))) : s.real + d, TOPE.min, TOPE.max);
}
export function antipiretico(s, k) {
  s.flags = {}; if (k === 'para') s.paraG += 1;
  if (!s.pir && s.dial == null) { s.flags.sinEfecto = true; return; }          // dial en 37: no es fiebre, no hay nada que bajar (p. 45)
  s.anti += k === 'para' ? 1.0 : 1.5; if (s.dial != null) s.dial = Math.max(37, s.dial - (k === 'para' ? 1.0 : 1.5));
}
export function leer(s) {
  const aj = ajuste(s), t = s.real, d = t - aj;
  const estado = t < 35 ? 'hipo' : esFiebre(s) ? (t >= 37.3 || aj > 37.3 ? 'fiebre' : 'normal') : t >= 37.8 ? 'hiper' : 'normal';
  const caldera = d < -0.05 && t >= TOPE.tirita, radiador = d > 0.05, anhidrosis = t >= TOPE.golpe;
  const sudor = radiador && !anhidrosis, tirita = caldera;
  const fc = t >= 32 ? Math.round(clamp(70 + 9 * (t - 37), 60, 130) + (t < 35 ? 15 : 0)) : t >= 30 ? 56 : t >= 28 ? 46 : t >= 24 ? 38 : 0;
  const ritmo = t < 24 ? 'asistolia' : t < 28 ? 'FV' : t < 32 ? 'bradicardia' : 'sinusal';
  const snc = t >= TOPE.golpe ? 'delirio' : t < 28 ? 'coma' : t < 32 ? 'letargia' : t < 35 ? 'confuso' : 'normal';
  return { aj, t, d, estado, caldera, radiador, anhidrosis, sudor, tirita, fc, ritmo, snc, ck: s.ck };
}
export function topes(s, L) {
  const t = [], f = s.flags; const poner = (c, n, titulo, texto, pag, origen, off = [], tono = '') => t.push({ c, n, titulo, texto, pag, origen, off, tono });
  if (L.t >= TOPE.max) poner('tmax', 'sello', 'Tope del termómetro: 42 °C', 'Más allá no hay paciente que modelar: la fuente no da la temperatura máxima compatible con la vida.', '47', 'ilustrativo; la ficha no lo dice', ['[data-calor]', '#b-hora']);
  if (L.t >= TOPE.golpe) poner('golpe', 'sello', 'Golpe de calor', 'Temperatura ≥41 °C con delirio: el radiador falla, la piel pierde el sudor y aparece el fallo multiorgánico. Hay que enfriar ya.', '47', 'ficha · p. 47');
  else if (L.t >= 39 && s.calor) poner('agot', 'aviso', 'Se acerca al golpe de calor', 'El agotamiento por calor llega a 38-39 °C sin afectar al sistema nervioso; a ≥41 °C con delirio es golpe.', '47', 'ficha · p. 46-47');
  if (f.parar) poner('parar', 'aviso', 'Parar a 38 °C', 'Enfriar por debajo de 38 °C no aporta: el cuerpo tirita y la temperatura vuelve a subir.', '47e', 'ficha · p. 47');
  if (f.sinEfecto) poner('sin', 'sello', 'Sin efecto: no es fiebre', 'El dial está en 37 °C: la temperatura sube porque el radiador no da abasto, no porque el hipotálamo la pida. El antipirético solo mueve el dial.', '45', 'ficha · p. 45', ['#b-para', '#b-ibu']);
  if (f.manta) poner('manta', 'sello', 'Contraproducente: escalofrío y vasoconstricción', 'En la fiebre el cuerpo ya se comporta como si estuviera bajo una manta fría; añadir una lo agrava. Su sitio es el golpe de calor.', '72m', 'ficha · p. 72', ['[data-enf="manta"]']);
  if (s.paraG > TOPE.paraMax) poner('para', 'sello', 'Máximo 3 g al día', 'Paracetamol hepatotóxico: la dosis máxima segura es 3 g (FDA 2011); el cap. 6 del mismo libro admite 4 g. Contraindicado en insuficiencia hepática.', '72', 'ficha · p. 72; fuentes discrepan', ['#b-para']);
  else if (s.paraG === TOPE.paraMax) poner('para', 'aviso', 'Has llegado a 3 g', 'Es el máximo diario (FDA 2011; cap. 6: 4 g). Contraindicado en insuficiencia hepática.', '72', 'ficha · p. 72');
  if (s.pir === 3) poner('pir', 'aviso', 'Más temperatura, menos mortalidad', 'En 2.225 pacientes con sepsis grave la mortalidad hospitalaria bajaba al subir la temperatura inicial (Fig. 44.5); suprimirla de rutina no está indicado.', '71', 'ficha · p. 70-71');
  if (s.calor && s.frio) poner('comb', 'aviso', 'Combinación no fisiológica', 'Calor y frío a la vez: el modelo ignora el frío mientras dure la carga de calor.', '45', 'ilustrativo');
  if (L.t < 32 && L.t >= 28) poner('bradi', 'aviso', 'Bradicardia y bradipnea', 'Por debajo de 32 °C el corazón y la respiración se enlentecen; el escalofrío cesa por debajo de 30 °C.', '54', 'ficha · p. 54, 56');
  if (L.t < 28 && L.t >= 24) poner('fv', 'aviso', 'Riesgo de fibrilación ventricular', 'Por debajo de 28 °C: coma, pupilas fijas y riesgo de FV; el escalofrío ya no existe.', '56a', 'ficha · p. 54, 56');
  if (L.t < 24) poner('fria', 'sello', 'No declarar la muerte: recalentar', 'Apnea y asistolia son esperables por debajo de 24 °C; no se declara la muerte hasta recalentar al paciente.', '54', 'ficha · p. 54', ['[data-frio]', '#b-hora']);
  if (f.f21) poner('f21', 'aviso', 'Enfrían más', 'Un fluido a 21 °C enfría al paciente hipotérmico: los fluidos se calientan.', '56v', 'ficha · p. 56');
  if (f.fcal) poner('fcal', 'aviso', 'Calientes, pero no recalientan', 'Los fluidos calientes evitan que siga enfriándose; no suben la temperatura.', '56v', 'ficha · p. 56');
  if (f.gases) poner('gases', 'aviso', 'Gases a 40-45 °C: +2,5 °C/h', 'En el intubado, calentar los gases inhalados sube la temperatura central unos 2,5 °C por hora.', '56i', 'ficha · p. 56');
  return t;
}
export const fmt = (x, d = 1) => Number(x).toFixed(d).replace('.', ',');
export const CLAVES = ['tmax', 'golpe', 'agot', 'parar', 'sin', 'manta', 'para', 'pir', 'comb', 'bradi', 'fv', 'fria', 'f21', 'fcal', 'gases'];
