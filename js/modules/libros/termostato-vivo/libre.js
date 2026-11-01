// Modelo continuo del estado «Juega» (idea y funciones de la maqueta A, copiadas y corregidas; B las usa sin mover el dibujo).
// Cifras de la ficha (Marino 2024): ajuste/fiebre p. 45, golpe ≥41 °C y parar a 38 °C, evaporativo 0,3 °C/min p. 47, tabla de hipotermia p. 54,
// gases 2,5 °C/h p. 56, paracetamol máx. 3 g (cap. 44, p. 72; el cap. 52 admite 4 g), ibuprofeno 10 mg/kg hasta 800 mg cada 6 h (p. 72). Cargas por hora, tandas, FC, CK y el mínimo de 22 °C son ILUSTRATIVOS.
// Arreglos sobre A: «Sin efecto» solo si T > ajuste; la CK solo sube con esfuerzo, fármaco o escalofrío; un fármaco manda a HM/SNM/SS, no al golpe.
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const TOPE = { ibuDosis24: 4, max: 42, min: 22, ckMax: 24000, ibuHoras: 6, golpe: 41, parar: 38, paraMax: 3, para6: 4, tirita: 30 };
export const PIR = [0, 38.3, 39.4, 40];
export const CALOR = [0, 1.4, 2.6, 2.0];   // °C/h: ninguna / ambiente / esfuerzo / fármaco (ilustrativo)
export const FRIO = [0, 0.8, 4.5, 1.2];    // °C/h: ninguno / aire / agua <15 °C / alcohol (ilustrativo; 4,5 °C/h no es de Marino)
export const ENF = { evap: 1.5, inm: 2.0, hielo: 1.2, sal: 1.0, manta: 0.8 };   // °C por tanda de 5 min; evap = 0,3 °C/min × 5 (ficha), el resto ilustrativo
export const REC = { pasivo: 0.3, activo: 1.0, gases: 2.5, fcal: 0, f21: -0.5, ecmo: 3.0 };
export const nuevoLibre = (o = {}) => ({ real: 37, pir: 0, dial: null, anti: 0, calor: 0, frio: 0, h: 0, paraG: 0, ibu: [], ck: 140, hCk: 0, tir: 0, flags: {}, ...o });
export const esFiebre = (s) => !!(s.pir || s.dial != null);
export const ajuste = (s) => (s.dial != null ? s.dial : s.pir ? Math.max(37, PIR[s.pir] - s.anti) : 37);
export function pasar(s) {            // una hora
  const aj = ajuste(s); let t = s.real + CALOR[s.calor] - (s.calor ? 0 : FRIO[s.frio]);   // calor y frío a la vez: se ignora el frío
  s.tir = 0;
  if (t > aj && s.real < TOPE.golpe) t -= Math.min(1, t - aj);              // radiador: vasos abiertos y sudor
  else if (t < aj && s.real >= TOPE.tirita) { t += Math.min(1, aj - t); s.tir = 1; }   // caldera: escalofrío (cesa por debajo de 30 °C)
  s.real = clamp(t, TOPE.min, TOPE.max); s.h++; s.flags = {};
  if (s.real >= 40 && (s.calor >= 2 || s.tir)) s.hCk++;            // CK solo con esfuerzo, fármaco o escalofrío
  s.ck = Math.min(140 + 900 * s.hCk, TOPE.ckMax);   // ilustrativo; la ficha solo da «≥5 veces lo normal» (p. 47)
}
export function enfriar(s, k) {
  s.flags = {}; const fiebre = esFiebre(s);
  if (k === 'manta' && fiebre) { s.flags.manta = true; s.real = clamp(s.real + 0.4, TOPE.min, TOPE.max); return; }   // +0,4: cifra ilustrativa; el efecto es de la p. 72
  if (fiebre) {   // el ajuste está alto: bajar de él es «frío» para el hipotálamo; escalofrío, con suelo 1 °C bajo el ajuste (p. 45 y 72 hablan de mantas; el resto es extensión ilustrativa)
    const aj = ajuste(s), nuevo = s.real - ENF[k];
    // +0,4 °C ilustrativos; nunca sube T ni baja más de 1 °C bajo el ajuste
    if (nuevo < aj) { s.flags.febrilFrio = true; s.real = clamp(Math.max(nuevo + 0.4, Math.min(s.real, aj - 1)), TOPE.min, TOPE.max); } else s.real = clamp(nuevo, TOPE.min, TOPE.max);
    return;
  }
  if (s.real <= TOPE.parar) { s.flags.parar = true; s.real = clamp(s.real + 0.4, TOPE.min, TOPE.max); return; }   // p. 47
  s.real = clamp(s.real - ENF[k], TOPE.min, TOPE.max); if (s.real <= TOPE.parar) s.flags.parar = true;
}
export function recalentar(s, k) {
  s.flags = {}; if (k === 'f21') s.flags.f21 = true; if (k === 'fcal') s.flags.fcal = true; if (k === 'gases') s.flags.gases = true;
  const d = REC[k]; s.real = clamp(d >= 0 ? Math.min(s.real + d, Math.max(s.real, ajuste(s))) : s.real + d, TOPE.min, TOPE.max);
}
export const ibuEn24 = (s) => s.ibu.filter((h) => s.h - h < 24).length;   // dosis en las últimas 24 h (contador ilustrativo)
export const ibuEn6 = (s) => s.ibu.filter((h) => s.h - h < TOPE.ibuHoras).length;   // pauta de la p. 72: una dosis cada 6 h
export function antipiretico(s, k) {
  s.flags = {}; if (k === 'para') s.paraG += 1; else s.ibu.push(s.h);
  if (!esFiebre(s)) { if (s.real > ajuste(s) + 0.05) s.flags.sinEfecto = true; return; }   // sello solo si T > ajuste
  s.anti += k === 'para' ? 1.0 : 1.5; if (s.dial != null) s.dial = Math.max(37, s.dial - (k === 'para' ? 1.0 : 1.5));
}
// Lectura con la forma que pinta el dibujo de B (T, pt, fc, esc, sud, cap…).
export function leerLibre(s) {
  const t = s.real, aj = ajuste(s), d = t - aj, caldera = d < -0.05 && t >= TOPE.tirita, radiador = d > 0.05, anhid = t >= TOPE.golpe;
  // FC ilustrativa: ≥41 °C coincide con el golpe guiado (140-150); en FV (24-28 °C) no hay frecuencia (null); asistolia bajo 24 °C (p. 54)
  const fc = t >= TOPE.golpe ? Math.round(140 + 10 * (t - TOPE.golpe)) : t >= 32 ? Math.round(clamp(70 + 9 * (t - 37), 60, 130) + (t < 35 ? 15 : 0)) : t >= 30 ? 56 : t >= 28 ? 46 : t >= 24 ? null : 0;
  const ritmo = t < 24 ? 'asistolia' : t < 28 ? 'FV' : t < 32 ? 'bradicardia' : 'sinusal';
  const snc = t >= TOPE.golpe ? 'delirio' : t < 28 ? 'coma' : t < 32 ? 'letargia' : t < 35 ? 'confuso' : 'normal';
  return { T: t, pt: aj, fc, esc: caldera ? 1 : 0, sud: radiador && !anhid ? 1 : 0, cap: caldera ? 0 : 1, rig: 0, ca: 0, ck: s.ck, d, ritmo, snc,
    extra: `hora ${s.h} · ${snc}${ritmo !== 'sinusal' ? ' · ' + ritmo : ''}` };
}
export function topesLibre(s, l) {
  const t = [], f = s.flags, fm = s.calor === 3;
  const poner = (c, n, titulo, texto, pag, origen, off = []) => t.push({ c, n, titulo, texto, pag, origen, off });
  const fmt = (x) => x.toFixed(1).replace('.', ',');
  if (l.T >= TOPE.max) poner('tmax', 'sello', 'Tope del termómetro: 42 °C', `T ${fmt(l.T)} °C, FC ${l.fc} (ilustrativa): más allá de 42 °C hay citotoxicidad, desnaturalización de las proteínas y fallo de órganos (Libro Azul).`, 'azul|30', 'Libro Azul, sección III, p. 30 del PDF; FC ilustrativa', ['#tmv-j-calor', '#tmv-j-hora']);
  if (l.T >= TOPE.golpe && !fm) poner('golpe', 'sello', 'Golpe de calor', `T ${fmt(l.T)} °C, FC ${l.fc}, ${l.snc} y sin sudor: el radiador falla. Enfriar ya, hasta 38 °C.`, '46|ma-calor-golpe', 'ficha · p. 46-47; FC ilustrativa');
  else if (l.T >= 40 && fm) poner('farm', 'sello', 'Calor por fármaco: ¿HM, SNM o SS?', `T ${fmt(l.T)} °C con un fármaco como causa: no es golpe de calor. Mira los estados Hipertermia maligna, SNM y síndrome serotoninérgico.`, '48|ma-hm-que', 'ficha · p. 48-52; umbral ≥40 °C de la hipertermia maligna, p. 49');
  else if (l.T >= 39 && s.calor) poner('agot', 'aviso', 'Se acerca al golpe de calor', 'El agotamiento por calor llega a 38-39 °C sin afectar al sistema nervioso; a ≥41 °C con delirio es golpe.', '46|ma-calor-agotamiento', 'ficha · p. 46-47');
  if (f.parar) poner('parar', 'aviso', 'Parar a 38 °C', 'Enfriar por debajo de 38 °C no aporta: el cuerpo tirita y la temperatura vuelve a subir.', '47|ma-calor-golpe', 'ficha · p. 47');
  if (f.sinEfecto) poner('sin', 'sello', 'Sin efecto: no es fiebre', 'El ajuste está en 37 °C: la temperatura sube porque el radiador no da abasto, no porque el hipotálamo la pida. El antipirético solo mueve el ajuste.', '45|ma-calor-hipertermia', 'ficha · p. 45', ['#tmv-j-para', '#tmv-j-ibu']);
  if (f.manta) poner('manta', 'sello', 'Contraproducente: escalofrío', 'En la fiebre el cuerpo ya se comporta como bajo una manta fría; añadir una lo agrava (la piel se cierra y tirita). Rebote tras la manta: sube 0,4 °C.', '72|ma-antip-mantas', 'ficha · p. 72; el +0,4 °C es cifra ilustrativa', ['#tmv-j-enf']);
  const dis = ['#tmv-j-para'], nIbu = ibuEn24(s);
  if (s.paraG > TOPE.para6) poner('para', 'sello', 'Más de 4 g al día', 'Por encima de 4 g al día la vía de eliminación segura se satura (cap. 52) y pasas también el máximo del cap. 44 (3 g, FDA 2011). Contraindicado en insuficiencia hepática.', '72|ma-antip-paracetamol', 'ficha · p. 72 y cap. 52; las fuentes discrepan', dis);
  else if (s.paraG > TOPE.paraMax) poner('para', 'aviso', 'Pasas de 3 g (el cap. 52 admite 4 g)', 'El cap. 44 pone el máximo seguro en 3 g al día (FDA 2011); el cap. 52 del mismo libro admite 4 g. Las fuentes discrepan.', '72|ma-antip-paracetamol', 'ficha · p. 72 y cap. 52; las fuentes discrepan');
  else if (s.paraG === TOPE.paraMax) poner('para', 'aviso', 'Has llegado a 3 g', 'Es el máximo diario del cap. 44 (cap. 52: 4 g). Contraindicado en insuficiencia hepática.', '72|ma-antip-paracetamol', 'ficha · p. 72; las fuentes discrepan');
  if (ibuEn6(s) >= 2) poner('ibu', 'sello', 'Dos dosis de ibuprofeno en menos de 6 h', `La pauta de la ficha es una dosis (10 mg/kg, hasta 800 mg) cada 6 h: llevas ${ibuEn6(s)} en las últimas 6 h. El libro no fija un máximo diario; habla de un miedo exagerado a la toxicidad renal y a la hemorragia digestiva y de poca experiencia con AINE en la UCI.`, '72|ma-antip-aine', 'ilustrativo (pauta de la p. 72: una dosis cada 6 h)', ['#tmv-j-ibu']);
  else if (nIbu >= 1) poner('ibu', 'aviso', `Ibuprofeno: ${nIbu} dosis (pauta cada 6 h)`, 'La ficha da 10 mg/kg (hasta 800 mg) cada 6 h; no fija un máximo diario. Una segunda dosis antes de 6 h sale de la pauta.', '72|ma-antip-aine', 'ilustrativo (pauta de la p. 72: una dosis cada 6 h)');
  if (f.febrilFrio) poner('febfrio', 'aviso', 'Enfriar a un febril: escalofrío', 'El hipotálamo febril tiene el ajuste alto: bajar de ahí es frío para él, cierra la piel y hace tiritar. La p. 72 lo dice de las mantas («contraproducente en la fiebre»); extenderlo a la evaporación, la inmersión, el hielo y el suero frío es una extrapolación.', '72|ma-antip-mantas', 'ficha · p. 45 y 72 (mantas); extensión y tamaño: ilustrativo');
  if (s.pir === 3) poner('pir', 'aviso', 'Más temperatura, menos mortalidad', 'En 2.225 pacientes con sepsis grave la mortalidad bajaba al subir la temperatura inicial (Fig. 44.5); la fiebre no se suprime de rutina.', '71|ma-antipireticos', 'ficha · p. 70-71');
  if (s.calor && s.frio) poner('comb', 'aviso', 'Combinación no fisiológica', 'Calor y frío a la vez: el modelo ignora el frío mientras dure la carga de calor.', '45|ma-calor-hipertermia', 'ilustrativo');
  if (l.T < 32 && l.T >= 28) poner('bradi', 'aviso', 'Bradicardia y bradipnea', 'Por debajo de 32 °C el corazón y la respiración se enlentecen; el escalofrío cesa por debajo de 30 °C.', '54|ma-hipo-grados', 'ficha · p. 54');
  if (l.T < 28 && l.T >= 24) poner('fv', 'aviso', 'Riesgo de fibrilación ventricular', 'Por debajo de 28 °C: coma, pupilas fijas y riesgo de FV (sin frecuencia cardíaca medible); el escalofrío ya no existe.', '55|ma-hipo-osborn', 'ficha · p. 54-56');
  if (l.T < 24) poner('fria', 'sello', 'No declarar la muerte: recalentar', `T ${fmt(l.T)} °C, asistolia: apnea y asistolia son esperables por debajo de 24 °C; no se declara la muerte sin haber recalentado al paciente.`, '54|ma-hipo-grados', 'ficha · p. 54; el mínimo de 22 °C del termómetro es ilustrativo', ['#tmv-j-frio', '#tmv-j-hora']);
  if (s.ck >= TOPE.ckMax) poner('ckmax', 'aviso', 'CK en el tope del modelo: 24.000 U/L', 'La ficha solo dice que la rabdomiólisis eleva la CK ≥5 veces lo normal; la cifra y su subida por hora son ilustrativas.', '47|ma-calor-rabdo', 'ilustrativo (ficha p. 47: CK ≥5 veces lo normal)');
  if (f.f21) poner('f21', 'aviso', 'Enfrían más', 'Un fluido a 21 °C enfría al paciente hipotérmico: los fluidos se calientan.', '56|ma-hipo-externo', 'ficha · p. 56');
  if (f.fcal) poner('fcal', 'aviso', 'Calientes, pero no recalientan', 'Los fluidos calientes evitan que siga enfriándose; no suben la temperatura.', '56|ma-hipo-externo', 'ficha · p. 56');
  if (f.gases) poner('gases', 'aviso', 'Gases a 40-45 °C: +2,5 °C/h', 'En el intubado, calentar los gases inhalados sube la temperatura central unos 2,5 °C por hora.', '56|ma-hipo-externo', 'ficha · p. 56');
  return t;
}
// Frase viva: lo que pasa ahora, con su página.
export function fraseLibre(s, l) {
  const f = s.flags; let x, p, o = 'ficha';
  if (f.sinEfecto) return ['El ajuste no se ha movido: el antipirético no tiene nada que bajar.', 45, 'ficha · p. 45'];
  if (f.manta) return ['La manta cierra la piel y provoca escalofrío: produce más calor.', 72, 'ficha · p. 72; cifra ilustrativa'];
  if (f.febrilFrio) return ['Enfriar a un febril lo hace tiritar: la piel se cierra y el músculo produce más calor (la p. 72 lo dice de las mantas).', 72, 'ficha · p. 45 y 72; extensión a otros métodos: ilustrativo'];
  if (f.parar) return ['A unos 38 °C se deja de enfriar: más frío provoca escalofrío.', 47, 'ficha · p. 47'];
  if (l.T >= TOPE.golpe) return [`Con ${l.snc} y sin sudor, la piel seca ya no evapora.`, 46, 'ficha · p. 46; cifras ilustrativas'];
  if (l.d < -0.05 && l.T >= TOPE.tirita) { x = `T ${l.T.toFixed(1).replace('.', ',')} por debajo del ajuste: la piel se cierra y el músculo tirita.`; p = 45; o = 'ficha · p. 45 y 53'; }
  else if (l.d > 0.05) { x = `T ${l.T.toFixed(1).replace('.', ',')} por encima del ajuste: vasos abiertos y sudor para perder calor.`; p = 45; o = 'ficha · p. 45'; }
  else { x = 'La temperatura sigue al ajuste del hipotálamo.'; p = 45; }
  return [x, p, o + '; cifras ilustrativas'];
}
