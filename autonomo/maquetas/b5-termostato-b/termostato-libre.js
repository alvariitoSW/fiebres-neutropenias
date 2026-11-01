// Modelo continuo del estado «Juega» (idea y funciones de la maqueta A, copiadas y corregidas; B las usa sin mover el dibujo).
// Cifras de la ficha (Marino 2024): ajuste/fiebre p. 45, golpe ≥41 °C y parar a 38 °C, evaporativo 0,3 °C/min p. 47, tabla de hipotermia p. 54,
// gases 2,5 °C/h p. 56, paracetamol máx. 3 g (cap. 44, p. 72; el cap. 6 admite 4 g). Cargas por hora, tandas, FC y CK son ILUSTRATIVAS.
// Arreglos sobre A: «Sin efecto» solo si T > ajuste; la CK solo sube con esfuerzo, fármaco o escalofrío; un fármaco manda a HM/SNM/SS, no al golpe.
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const TOPE = { max: 42, min: 22, golpe: 41, parar: 38, paraMax: 3, para6: 4, tirita: 30 };
export const PIR = [0, 38.3, 39.4, 40];
export const CALOR = [0, 1.4, 2.6, 2.0];   // °C/h: ninguna / ambiente / esfuerzo / fármaco (ilustrativo)
export const FRIO = [0, 0.8, 4.5, 1.2];    // °C/h: ninguno / aire / agua <15 °C / alcohol (ilustrativo; 4,5 °C/h no es de Marino)
export const ENF = { evap: 1.5, inm: 2.0, hielo: 1.2, sal: 1.0, manta: 0.8 };   // °C por tanda de 5 min; evap = 0,3 °C/min × 5 (ficha), el resto ilustrativo
export const REC = { pasivo: 0.3, activo: 1.0, gases: 2.5, fcal: 0, f21: -0.5, ecmo: 3.0 };
export const nuevoLibre = (o = {}) => ({ real: 37, pir: 0, dial: null, anti: 0, calor: 0, frio: 0, h: 0, paraG: 0, ck: 140, hCk: 0, tir: 0, flags: {}, ...o });
export const esFiebre = (s) => !!(s.pir || s.dial != null);
export const ajuste = (s) => (s.dial != null ? s.dial : s.pir ? Math.max(37, PIR[s.pir] - s.anti) : 37);
export function pasar(s) {            // una hora
  const aj = ajuste(s); let t = s.real + CALOR[s.calor] - (s.calor ? 0 : FRIO[s.frio]);   // calor y frío a la vez: se ignora el frío
  s.tir = 0;
  if (t > aj && s.real < TOPE.golpe) t -= Math.min(1, t - aj);              // radiador: vasos abiertos y sudor
  else if (t < aj && s.real >= TOPE.tirita) { t += Math.min(1, aj - t); s.tir = 1; }   // caldera: escalofrío (cesa por debajo de 30 °C)
  s.real = clamp(t, TOPE.min, TOPE.max); s.h++; s.flags = {};
  if (s.real >= 40 && (s.calor >= 2 || s.tir)) s.hCk++;            // CK solo con esfuerzo, fármaco o escalofrío
  s.ck = 140 + 900 * s.hCk;
}
export function enfriar(s, k) {
  s.flags = {}; const fiebre = esFiebre(s);
  if (k === 'manta' && fiebre) { s.flags.manta = true; s.real = clamp(s.real + 0.4, TOPE.min, TOPE.max); return; }   // p. 72
  if (!fiebre && s.real <= TOPE.parar) { s.flags.parar = true; s.real = clamp(s.real + 0.4, TOPE.min, TOPE.max); return; }   // p. 47
  s.real = clamp(s.real - ENF[k], TOPE.min, TOPE.max); if (!fiebre && s.real <= TOPE.parar) s.flags.parar = true;
}
export function recalentar(s, k) {
  s.flags = {}; if (k === 'f21') s.flags.f21 = true; if (k === 'fcal') s.flags.fcal = true; if (k === 'gases') s.flags.gases = true;
  const d = REC[k]; s.real = clamp(d >= 0 ? Math.min(s.real + d, Math.max(s.real, ajuste(s))) : s.real + d, TOPE.min, TOPE.max);
}
export function antipiretico(s, k) {
  s.flags = {}; if (k === 'para') s.paraG += 1;
  if (!esFiebre(s)) { if (s.real > ajuste(s) + 0.05) s.flags.sinEfecto = true; return; }   // sello solo si T > ajuste
  s.anti += k === 'para' ? 1.0 : 1.5; if (s.dial != null) s.dial = Math.max(37, s.dial - (k === 'para' ? 1.0 : 1.5));
}
// Lectura con la forma que pinta el dibujo de B (T, pt, fc, esc, sud, cap…).
export function leerLibre(s) {
  const t = s.real, aj = ajuste(s), d = t - aj, caldera = d < -0.05 && t >= TOPE.tirita, radiador = d > 0.05, anhid = t >= TOPE.golpe;
  const fc = t >= 32 ? Math.round(clamp(70 + 9 * (t - 37), 60, 130) + (t < 35 ? 15 : 0)) : t >= 30 ? 56 : t >= 28 ? 46 : t >= 24 ? 38 : 0;
  const ritmo = t < 24 ? 'asistolia' : t < 28 ? 'FV' : t < 32 ? 'bradicardia' : 'sinusal';
  const snc = t >= TOPE.golpe ? 'delirio' : t < 28 ? 'coma' : t < 32 ? 'letargia' : t < 35 ? 'confuso' : 'normal';
  return { T: t, pt: aj, fc, esc: caldera ? 1 : 0, sud: radiador && !anhid ? 1 : 0, cap: caldera ? 0 : 1, rig: 0, ca: 0, ck: s.ck, d, ritmo, snc,
    extra: `hora ${s.h} · ${snc}${ritmo !== 'sinusal' ? ' · ' + ritmo : ''}` };
}
export function topesLibre(s, l) {
  const t = [], f = s.flags, fm = s.calor === 3;
  const poner = (c, n, titulo, texto, pag, origen, off = []) => t.push({ c, n, titulo, texto, pag, origen, off });
  const fmt = (x) => x.toFixed(1).replace('.', ',');
  if (l.T >= TOPE.max) poner('tmax', 'sello', 'Tope del termómetro: 42 °C', `T ${fmt(l.T)} °C, FC ${l.fc}, ${l.snc}: más allá no hay paciente que modelar; la fuente no da la temperatura máxima compatible con la vida.`, '47|ma-calor-golpe', 'ilustrativo; la ficha no lo dice', ['#j-calor', '#j-hora']);
  if (l.T >= TOPE.golpe && !fm) poner('golpe', 'sello', 'Golpe de calor', `T ${fmt(l.T)} °C, FC ${l.fc}, ${l.snc} y sin sudor: el radiador falla. Enfriar ya, hasta 38 °C.`, '46|ma-calor-golpe', 'ficha · p. 46-47; FC ilustrativa');
  else if (l.T >= TOPE.golpe && fm) poner('farm', 'sello', 'Calor por fármaco: ¿HM, SNM o SS?', `T ${fmt(l.T)} °C con un fármaco como causa: no es golpe de calor. Mira los estados Hipertermia maligna, SNM y síndrome serotoninérgico.`, '48|ma-hipertermia-farmacos', 'ficha · p. 48-52');
  else if (l.T >= 39 && s.calor) poner('agot', 'aviso', 'Se acerca al golpe de calor', 'El agotamiento por calor llega a 38-39 °C sin afectar al sistema nervioso; a ≥41 °C con delirio es golpe.', '46|ma-calor-agotamiento', 'ficha · p. 46-47');
  if (f.parar) poner('parar', 'aviso', 'Parar a 38 °C', 'Enfriar por debajo de 38 °C no aporta: el cuerpo tirita y la temperatura vuelve a subir.', '47|ma-calor-golpe', 'ficha · p. 47');
  if (f.sinEfecto) poner('sin', 'sello', 'Sin efecto: no es fiebre', 'El ajuste está en 37 °C: la temperatura sube porque el radiador no da abasto, no porque el hipotálamo la pida. El antipirético solo mueve el ajuste.', '45|ma-calor-hipertermia', 'ficha · p. 45', ['#j-para', '#j-ibu']);
  if (f.manta) poner('manta', 'sello', 'Contraproducente: escalofrío', 'En la fiebre el cuerpo ya se comporta como bajo una manta fría; añadir una lo agrava (la piel se cierra y tirita).', '72|ma-antip-mantas', 'ficha · p. 72', ['#j-enf']);
  const dis = ['#j-para'];
  if (s.paraG > TOPE.para6) poner('para', 'sello', 'Más de 4 g al día', 'Pasas el máximo del cap. 6 (4 g) y el del cap. 44 (3 g, FDA 2011). Contraindicado en insuficiencia hepática.', '72|ma-antipireticos', 'ficha · p. 72 y cap. 6; las fuentes discrepan', dis);
  else if (s.paraG > TOPE.paraMax) poner('para', 'aviso', 'Pasas de 3 g (el cap. 6 admite 4 g)', 'El cap. 44 pone el máximo seguro en 3 g al día (FDA 2011); el cap. 6 del mismo libro admite 4 g. Las fuentes discrepan.', '72|ma-antipireticos', 'ficha · p. 72 y cap. 6; las fuentes discrepan');
  else if (s.paraG === TOPE.paraMax) poner('para', 'aviso', 'Has llegado a 3 g', 'Es el máximo diario del cap. 44 (cap. 6: 4 g). Contraindicado en insuficiencia hepática.', '72|ma-antipireticos', 'ficha · p. 72; las fuentes discrepan');
  if (s.pir === 3) poner('pir', 'aviso', 'Más temperatura, menos mortalidad', 'En 2.225 pacientes con sepsis grave la mortalidad bajaba al subir la temperatura inicial (Fig. 44.5); la fiebre no se suprime de rutina.', '71|ma-antipireticos', 'ficha · p. 70-71');
  if (s.calor && s.frio) poner('comb', 'aviso', 'Combinación no fisiológica', 'Calor y frío a la vez: el modelo ignora el frío mientras dure la carga de calor.', '45|ma-calor-hipertermia', 'ilustrativo');
  if (l.T < 32 && l.T >= 28) poner('bradi', 'aviso', 'Bradicardia y bradipnea', 'Por debajo de 32 °C el corazón y la respiración se enlentecen; el escalofrío cesa por debajo de 30 °C.', '54|ma-hipo-grados', 'ficha · p. 54');
  if (l.T < 28 && l.T >= 24) poner('fv', 'aviso', 'Riesgo de fibrilación ventricular', 'Por debajo de 28 °C: coma, pupilas fijas y riesgo de FV; el escalofrío ya no existe.', '55|ma-hipo-osborn', 'ficha · p. 54-56');
  if (l.T < 24) poner('fria', 'sello', 'No declarar la muerte: recalentar', `T ${fmt(l.T)} °C, FC ${l.fc}: apnea y asistolia son esperables por debajo de 24 °C; no se declara la muerte sin haber recalentado al paciente.`, '54|ma-hipo-grados', 'ficha · p. 54; FC ilustrativa', ['#j-frio', '#j-hora']);
  if (f.f21) poner('f21', 'aviso', 'Enfrían más', 'Un fluido a 21 °C enfría al paciente hipotérmico: los fluidos se calientan.', '56|ma-hipo-externo', 'ficha · p. 56');
  if (f.fcal) poner('fcal', 'aviso', 'Calientes, pero no recalientan', 'Los fluidos calientes evitan que siga enfriándose; no suben la temperatura.', '56|ma-hipo-externo', 'ficha · p. 56');
  if (f.gases) poner('gases', 'aviso', 'Gases a 40-45 °C: +2,5 °C/h', 'En el intubado, calentar los gases inhalados sube la temperatura central unos 2,5 °C por hora.', '56|ma-hipo-externo', 'ficha · p. 56');
  return t;
}
// Frase viva: lo que pasa ahora, con su página.
export function fraseLibre(s, l) {
  const f = s.flags; let x, p, o = 'ficha';
  if (f.sinEfecto) return ['El ajuste no se ha movido: el antipirético no tiene nada que bajar.', 45, 'ficha · p. 45'];
  if (f.manta) return ['La manta cierra la piel y provoca escalofrío: sube más calor.', 72, 'ficha · p. 72'];
  if (f.parar) return ['A unos 38 °C se deja de enfriar: más frío provoca escalofrío.', 47, 'ficha · p. 47'];
  if (l.T >= TOPE.golpe) return [`${l.snc}, sin sudor: la piel seca ya no evapora.`, 46, 'ficha · p. 46; cifras ilustrativas'];
  if (l.d < -0.05 && l.T >= TOPE.tirita) { x = `T ${l.T.toFixed(1).replace('.', ',')} por debajo del ajuste: la piel se cierra y el músculo tirita.`; p = 45; o = 'ficha · p. 45 y 53'; }
  else if (l.d > 0.05) { x = `T ${l.T.toFixed(1).replace('.', ',')} por encima del ajuste: vasos abiertos y sudor para perder calor.`; p = 45; o = 'ficha · p. 45'; }
  else { x = 'La temperatura sigue al ajuste del hipotálamo.'; p = 45; }
  return [x, p, o + '; cifras ilustrativas'];
}
