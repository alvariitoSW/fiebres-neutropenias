// Río y mar (el agua del cuerpo): datos y modelo, sin DOM. Los usa
// js/modules/libros/agua-viva.js (el estuario, las lupas, Conceptos y
// Mayéutica). Viene de la maqueta aprobada autonomo/maquetas/marino-agua-v2.html
// (plan Marino, fase 4; aprobada por el usuario el 19/10/2026).
//
// Toda la medicina sale de las fichas de la app; cada cifra lleva su
// ficha#elemento:
//   js/modules/libros/marino-fundamentos.html (Marino caps. 10-11: mar-*),
//   js/modules/libros/marino-renal.html (Marino caps. 31 y 35: mr-*),
//   js/modules/cardiologia/merino-cardiologia.html (Marino cap. 15: mc-hemorragico-*).
// El paciente de los casos se inventa; la medicina, no.
//
// Las partículas usan la tabla única de formas (js/data/formas-iones.js): cada
// fluido dice su `particula` (clave de esa tabla).

import { CASO_TERESA } from './agua-viva-caso-teresa.js';

// ---------- Utilidades de formato (las usan las frases de cada fluido) ----------
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const copia = o => JSON.parse(JSON.stringify(o));
export function fmt(n) { return Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
export function fmtD(n) { const r = Math.round(n); return r > 0 ? '+' + fmt(r) : r < 0 ? '−' + fmt(r) : '±0'; }
export function fmtL(ml) { return ml >= 1000 ? (ml / 1000).toString().replace('.', ',') + ' L' : ml + ' mL'; }
export function dec(n, d = 1) { return n.toFixed(d).replace('.', ','); }

// ---------- Datos: todas las cifras, con su ficha ----------
export const COMP = ['rio', 'marisma', 'mar'];

// Tabla 10.1 (mar-tabla-10-1) y Tabla 11.1 (mar-tabla-11-1); volemia del cap. 15 (mc-hemorragico-clasificacion)
export const PACIENTES = {
  varon: { nombre: 'varón de 75 kg', peso: 75, act: 45000, mar: 29000, ext: 16000, marisma: 13000, rio: 3000,
    volemiaKg: 66, plasmaKg: 40, deficit15: 450 },
  mujer: { nombre: 'mujer de 60 kg', peso: 60, act: 30000, mar: 20000, ext: 10000, marisma: 8000, rio: 2000,
    volemiaKg: 60, plasmaKg: 36, deficit15: 300 }
};
export const HTO0 = 45;            // Hto normal (Fig. 15.1, mc-hemorragico-clasificacion)
export const NA0 = 140, GLU0 = 90, BUN0 = 14;   // valores del ejemplo de la Ec. 35.3 (mr-osmolalidad): Posm 290
export const BUN_ALTO = 84;        // urea alta: valor de ejemplo, ilustrativo (BUN 84 mg/dL)

/* Cada fluido: lo que hace por su volumen de referencia (ref) y de qué ficha sale.
   delta null = la ficha no da cifra (se dibuja sin mover el mareógrafo). */
export const FLUIDOS = {
  glucosado: {
    nombre: 'glucosado al 5 %', corto: 'Glucosado', sub: '5 % · agua dulce', particula: 'dulce',
    ref: 1000, cantidades: [250, 500, 1000, 2000], hipotonico: true,
    delta: { rio: 100, marisma: 250, mar: 650 },
    org: { rio: 'ficha · mar-fig-10-1', marisma: 'ficha · mar-fig-10-1', mar: 'ficha · mar-glucosado-volumen' },
    lupa: { vasoInter: 1, interCel: 1, sal: 0 },
    frase: ml => `Agua dulce: la glucosa se la beben las células y el agua la sigue. <span class="hl-rojo">Dos tercios acaban en el mar</span>; al río llegan ${fmt(100 * ml / 1000)} mL.`,
    fuente: 'ficha · mar-fig-10-1 · mar-glucosado-volumen',
    dato: '278 mOsm/L, cerca del plasma; la glucosa entra en las células y se metaboliza.'
  },
  salino: {
    nombre: 'salino al 0,9 %', corto: 'Salino', sub: '0,9 % · Cl⁻ 154', particula: 'cl',
    ref: 1000, cantidades: [250, 500, 1000, 2000],
    delta: { rio: 275, marisma: 825, mar: -100 },
    org: { rio: 'ficha · mar-fig-10-1', marisma: 'ficha · mar-fig-10-1', mar: 'ficha · mar-salino (resta)' },
    lupa: { vasoInter: 1, interCel: -0.25, sal: 1 },
    frase: ml => `De ${fmtL(ml)} de salino, <span class="hl-rojo">solo ${fmt(275 * ml / 1000)} mL se quedan en el río</span>: el resto inunda la marisma. Es algo salado (308 mOsm/L): saca agua del mar.`,
    fuente: 'ficha · mar-fig-10-1 · mar-salino',
    dato: 'Na⁺ 154, Cl⁻ 154 frente a 103 del plasma (Tabla 10.2).'
  },
  ringer: {
    nombre: 'Ringer lactato', corto: 'Ringer', sub: 'lactato · Cl⁻ 109', particula: 'ringer',
    ref: 1000, cantidades: [250, 500, 1000, 2000], hipotonico: true,
    delta: { rio: 200, marisma: 800, mar: null },
    org: { rio: 'ficha · mar-cristaloide-reparto (20 %)', marisma: 'ficha · mar-cristaloide-reparto (80 %)', mar: 'sin cifra en la ficha' },
    lupa: { vasoInter: 1, interCel: 0, sal: 0.5 },
    frase: ml => `Ringer: <span class="hl">el 20 % se queda en el río</span> (${fmt(200 * ml / 1000)} mL) y el 80 % se va a la marisma. Su cloro, 109, se parece al del plasma.`,
    fuente: 'ficha · mar-cristaloide-reparto · mar-tabla-10-2',
    dato: 'Na⁺ 130, Cl⁻ 109, 273 mOsm/L (Tabla 10.2).'
  },
  plasmalyte: {
    nombre: 'Plasma-Lyte', corto: 'Plasma-Lyte', sub: 'Cl⁻ 98', particula: 'plasmalyte',
    ref: 1000, cantidades: [250, 500, 1000, 2000],
    delta: { rio: 200, marisma: 800, mar: null },
    org: { rio: 'ficha · mar-cristaloide-reparto (20 %)', marisma: 'ficha · mar-cristaloide-reparto (80 %)', mar: 'sin cifra en la ficha' },
    lupa: { vasoInter: 1, interCel: 0, sal: 0.6 },
    frase: ml => `Plasma-Lyte: <span class="hl">el 20 % se queda en el río</span> (${fmt(200 * ml / 1000)} mL). Cl⁻ 98 y 295 mOsm/L: el más parecido al plasma.`,
    fuente: 'ficha · mar-cristaloide-reparto · mar-tabla-10-2',
    dato: 'Na⁺ 140, Cl⁻ 98, 295 mOsm/L (Tabla 10.2).'
  },
  alb5: {
    nombre: 'albúmina al 5 %', corto: 'Albúmina', sub: '5 %', particula: 'alb',
    ref: 1000, cantidades: [250, 500, 1000],
    delta: { rio: 700, marisma: 300, mar: 0 },
    org: { rio: 'ficha · mar-fig-10-1', marisma: 'ficha · mar-fig-10-1', mar: 'ficha · mar-fig-10-1 (700 + 300)' },
    lupa: { vasoInter: 0.3, interCel: 0, sal: 0, limo: 1 },
    frase: ml => `El limo de la albúmina no cruza la orilla: <span class="hl">${fmt(700 * ml / 1000)} de ${fmt(ml)} mL se quedan en el río</span>, unas 3 veces más que con salino.`,
    fuente: 'ficha · mar-fig-10-1 · mar-coloides',
    dato: 'Oncótica 20 mmHg, alícuotas de 250 mL (mar-albumina).'
  },
  alb25: {
    nombre: 'albúmina al 25 %', corto: 'Albúmina', sub: '25 % · 50-100 mL', particula: 'alb25',
    ref: 100, cantidades: [50, 100], rango: [3, 4],
    delta: { rio: 350, marisma: -250, mar: null },
    org: { rio: 'ficha · mar-tabla-10-3 (×3-4)', marisma: 'ficha · mar-albumina (sale de aquí)', mar: 'sin cifra en la ficha' },
    lupa: { vasoInter: -1, interCel: 0, sal: 0, limo: 2 },
    frase: ml => `Limo espeso: <span class="hl">${ml} mL hacen crecer el río ${fmt(3 * ml)}-${fmt(4 * ml)} mL</span>: ${ml} son el vial y ${fmt(2 * ml)}-${fmt(3 * ml)} salen de la marisma. <span class="hl-rojo">Mueve agua; no repone.</span>`,
    fuente: 'ficha · mar-tabla-10-3 · mar-albumina',
    dato: 'Oncótica 70 mmHg; expande el plasma 3-4 veces su volumen (Tabla 10.3).'
  },
  hiper: {
    nombre: 'salino al 7,5 %', corto: 'Salino', sub: '7,5 % · 250 mL', particula: 'salino75',
    ref: 250, cantidades: [250], unaVez: true,
    delta: { rio: 535, marisma: 700, mar: -985 },
    org: { rio: 'ficha · mar-fig-10-1', marisma: 'ficha · mar-fig-10-1', mar: 'ficha · mar-hipertonico (resta)' },
    lupa: { vasoInter: 0.6, interCel: -1.6, sal: 2 },
    frase: () => '250 mL de agua muy salada sacan agua del mar: <span class="hl">el río y la marisma ganan 1.235 mL</span>, unas 5 veces lo infundido. El Na⁺ sube: la ficha no da cuánto.',
    fuente: 'ficha · mar-fig-10-1 · mar-hipertonico',
    dato: '2.567 mOsm/L, 9 veces el plasma.'
  },
  salino3: {
    nombre: 'salino al 3 %', corto: 'Salino', sub: '3 % · bolo', particula: 'salino3',
    ref: null, bolo: true, cantidades: [0],
    delta: { rio: null, marisma: null, mar: null },
    org: { rio: 'sin cifra en la ficha', marisma: 'sin cifra en la ficha', mar: 'se encoge · ilustrativo' },
    lupa: { vasoInter: 0.4, interCel: -1, sal: 1.6 },
    frase: () => 'Bolo de salino al 3 %: el Na⁺ sube <span class="hl">hasta 2 mEq/L por bolo</span>. Se repite cada pocas horas hasta que cedan los síntomas, sin pasar los límites.',
    fuente: 'ficha · mr-tabla-35-3',
    dato: 'Na⁺ 513 mEq/L (la tabla impresa da 153: errata, ver la nota de fidelidad), 1.026 mOsm/L; bolos de 2 mL/kg o 150 mL, repetidos cada pocas horas, por vía periférica si hace falta.'
  },
  sangre: {
    nombre: 'sangre completa', corto: 'Sangre', sub: 'completa', particula: 'rbc',
    ref: 1000, cantidades: [500, 1000, 1500, 2000], sangre: true,
    delta: { rio: 0, marisma: 0, mar: 0 },   // el río (plasma) gana el 55 %: se calcula en derivar()
    org: { rio: 'Hto 45 %: el 55 % es plasma · fisiología general', marisma: 'no sale del vaso', mar: 'no sale del vaso' },
    lupa: { vasoInter: 0, interCel: 0, sal: 0, hematies: 1 },
    frase: ml => `Sangre completa: plasma y hematíes en proporción. <span class="hl-verde">El Hto no cambia</span> y todo se queda en el río.`,
    fuente: 'ficha · mc-hemorragico-clasificacion (Fig. 15.1)',
    dato: 'Repone plasma y hematíes en proporción (Fig. 15.1).'
  }
};
export const ORDEN_FLUIDOS = ['glucosado', 'salino', 'ringer', 'plasmalyte', 'alb5', 'alb25', 'hiper', 'salino3', 'sangre'];

// Pérdidas hipotónicas: Na⁺ de cada líquido (Tabla 35.1, mr-tabla-35-1)
export const PERDIDAS = {
  sudor: { nombre: 'sudor', na: 65 },
  diarrea: { nombre: 'diarrea secretora', na: 90 },
  diuretico: { nombre: 'orina con diurético', na: 80 }
};

// Tabla 15.1 (mc-hemorragico-clasificacion)
export function claseHemorragia(pct) {
  const p = Math.round(pct);
  if (p <= 0) return { n: 0, nombre: 'Sin pérdida' };
  if (p < 15) return { n: 1, nombre: 'Clase I', fase: 'fase asintomática', rean: 'ninguna' };
  if (p <= 30) return { n: 2, nombre: 'Clase II', fase: 'fase compensada', rean: 'cristaloides' };
  if (p <= 40) return { n: 3, nombre: 'Clase III', fase: 'fase de shock', rean: 'sangre' };
  return { n: 4, nombre: 'Clase IV', fase: 'shock avanzado', rean: 'transfusión masiva' };
}
// ---------- Un solo estado y una sola función que deriva las cifras ----------
export function estadoBase() {
  return {
    paciente: 'varon',
    infusiones: [],          // [{ f: 'salino', ml: 1000 }]
    hemorragia: 0,           // % de la volemia (Tabla 15.1)
    reloj: '1h',             // '1h' · '8-12h' · 'dias'
    albBaja: false, inflamacion: false,
    adh: false, glucosa: GLU0, urea: false, perdida: null,
    na0: NA0, bolos3: 0, periodo3: '2h',
    pseudo: false,           // pseudohiponatremia: el Na⁺ medido (fijo.na) baja sin que baje el del agua; la Posm medida es normal
    fijo: {},                // cifras que pone un caso clínico (Na, Hto): «dato del caso»
    orina: null,             // la salida «orina»: null (no se muestra) o { tipo: 'central'|'nefro', osm, mlh, vaso } (ver orinaDe)
    tocado: null             // compartimento tocado en una pregunta
  };
}

// La orina (Marino cap. 35, mr-di-dx, E p. 7): osmolalidad y diuresis de quien las pone el caso (`dato del caso`; Nicolás: 110 y
// 400 mL/h). Con vasopresina, en la DI central la osmolalidad sube al menos un 50 %: se da el MÍNIMO (×1,5), no un valor; en la
// nefrogénica no cambia. Cifras de la nefrogénica del modelo: ilustrativas, dentro de 200-500. Pieza común de `di`,
// `sobrecorreccion` y `desmopresina`.
export const ORINA = { central: { osm: 110, mlh: 400, rango: '<200' }, nefro: { osm: 300, mlh: 400, rango: '200-500' }, vasoMin: 0.5 };
export function orinaDe(o) {
  if (!o) return null;
  const central = o.tipo === 'central', osm = o.osm;
  const osmVaso = o.vaso ? (central ? Math.ceil(osm * (1 + ORINA.vasoMin)) : osm) : null;
  return { tipo: o.tipo, osm, mlh: o.mlh, vaso: !!o.vaso, osmVaso, subeMin: central, rango: ORINA[o.tipo]?.rango || '',
    respuesta: !o.vaso ? '' : central ? `≥ ${osmVaso} (sube ≥50 %): central` : 'sin cambio: nefrogénica' };
}

export function deltaFluido(inf) {
  const f = FLUIDOS[inf.f];
  if (f.bolo) return { rio: null, marisma: null, mar: null };
  if (f.sangre) return { rio: 0.55 * inf.ml, marisma: 0, mar: 0 };   // 55 % plasma con Hto 45 % (fisiología general)
  const k = inf.ml / f.ref, d = {};
  for (const c of COMP) d[c] = f.delta[c] == null ? null : f.delta[c] * k;
  return d;
}

export function derivar(e) {
  const P = PACIENTES[e.paciente];
  const base = { rio: P.rio, marisma: P.marisma, mar: P.mar };
  const delta = { rio: 0, marisma: 0, mar: 0 };
  const sinCifra = { rio: false, marisma: false, mar: false };
  const rango = { rio: [0, 0], marisma: [0, 0], hay: false };
  let plasmaFluidos = 0, sangreMl = 0, proporcional = false, hipotonicos = 0, salino = 0;
  for (const inf of e.infusiones) {
    const f = FLUIDOS[inf.f], d = deltaFluido(inf);
    for (const c of COMP) { if (d[c] == null) sinCifra[c] = true; else delta[c] += d[c]; }
    if (f.rango) {
      rango.hay = true;
      rango.rio[0] += f.rango[0] * inf.ml - d.rio; rango.rio[1] += f.rango[1] * inf.ml - d.rio;
      rango.marisma[0] += -(f.rango[0] - 1) * inf.ml - d.marisma; rango.marisma[1] += -(f.rango[1] - 1) * inf.ml - d.marisma;
    }
    if (f.sangre) sangreMl += inf.ml; else if (d.rio != null) plasmaFluidos += d.rio;
    if (f.ref && inf.ml !== f.ref) proporcional = true;
    if (f.hipotonico) hipotonicos += inf.ml;
    if (inf.f === 'salino') salino += inf.ml;
  }
  // Hemorragia (Tabla 15.1): se pierde sangre entera; el río pierde el mismo % (pérdida proporcional, Fig. 15.1)
  const V0 = P.volemiaKg * P.peso;
  const fr = clamp(e.hemorragia, 0, 45) / 100;
  const perdidaSangre = fr * V0, perdidaRio = fr * P.rio;
  delta.rio -= perdidaRio;
  // Relleno transcapilar: «hasta 1 L», a costa del intersticio; el Hto baja a las 8-12 h (mc-hemorragico-clasificacion)
  const relleno = fr > 0 && e.reloj !== '1h' ? Math.min(1000, perdidaSangre) : 0;
  delta.rio += relleno; delta.marisma -= relleno;
  // Hto = hematíes ÷ volemia (fisiología general), partiendo de 45 % (Fig. 15.1)
  const celulas = HTO0 / 100 * V0 * (1 - fr) + HTO0 / 100 * sangreMl;
  const volemia = V0 * (1 - fr) + plasmaFluidos + relleno + sangreMl;
  const htoCalc = 100 * celulas / volemia;
  const hto = e.fijo.hto != null ? e.fijo.hto : htoCalc;
  // Sodio y osmolalidad (Ec. 35.3-35.5)
  const naCorrCalc = e.na0 + 2 * e.bolos3;                 // salino 3 %: hasta 2 mEq/L por bolo (Tabla 35.3)
  const dilucion = 2.4 * Math.max(0, e.glucosa - 100) / 100;
  const naMed = e.fijo.na != null ? e.fijo.na : naCorrCalc - dilucion;
  const naCorr = naMed + dilucion;
  const bun = e.urea ? BUN_ALTO : BUN0;
  const naOsm = e.pseudo ? naCorrCalc - dilucion : naMed;   // pseudohiponatremia: la osmolalidad medida sale del Na⁺ del agua (E p. 9)
  const posm = 2 * naOsm + e.glucosa / 18 + bun / 2.8;
  const posmEf = 2 * naOsm + e.glucosa / 18;
  // Límites del salino 3 % (Tabla 35.3), con la peor subida posible (2 por bolo) o la del caso
  const avisos = [];
  const subida = e.bolos3 > 0 ? Math.round(naCorr - e.na0) : 0;
  if (e.bolos3 > 0) {
    const lim = e.periodo3 === '2h' ? 5 : 10;
    const txt = e.periodo3 === '2h' ? 'en 2 h' : e.periodo3 === '5h' ? 'en 5 h' : 'el primer día';
    if (subida >= 5) avisos.push('Ha subido 5 o más: valora. Con +5-6 deberían mejorar los síntomas; si no, busca otra causa.');
    if (subida > lim) avisos.push(`Sube ${subida} mEq/L ${txt}: pasa del límite de ${lim}.`);
    else if (subida === lim) avisos.push(`Sube ${subida} mEq/L ${txt}: en el límite de ${lim}.`);
    if (Math.round(naCorr) > 130) avisos.push(`Na⁺ final ${Math.round(naCorr)}: pasa de 130 mEq/L.`);
    if (e.fijo.na != null && subida > 2 * e.bolos3) avisos.push(`Sube más de lo que dan los bolos (hasta 2 cada uno): diuresis acuosa, sobrecorrección.`);
  }
  // Tendencias sin cifra en la ficha
  let tendNa = 0;
  const hiper = e.infusiones.some(i => i.f === 'hiper');
  if (e.adh && hipotonicos > 0) tendNa -= 1;
  if (e.perdida) tendNa += 1;
  if (hiper) tendNa += 1;              // 7,5 %: el Na⁺ sube, sin cifra en la ficha
  // El mar (células) se hincha o se encoge sin cifra en la ficha: flecha ilustrativa
  let m = 0;
  if (posmEf < 283.5) m += 1; else if (posmEf > 286.5 && !(posmEf > 295 && e.reloj === 'dias')) m -= 1;   // en 48 h los osmolitos devuelven el volumen (mr-hiperna-cerebro)
  m -= Math.sign(tendNa);
  if (e.bolos3) m -= 1;
  const marFlecha = Math.sign(m);
  return {
    orina: orinaDe(e.orina),
    P, base, delta, sinCifra, rango, proporcional, V0, perdidaSangre, perdidaRio, relleno,
    clase: claseHemorragia(e.hemorragia), hto, htoCalc, naMed, naOsm, naCorr, bun, posm, posmEf, avisos, subida,
    tendNa, marFlecha, hipotonicos, salino, sangreMl
  };
}

// Ec. 31.2 y 31.1: [H⁺] = 24 × PaCO₂ / HCO₃⁻ ; pH = 9 − log₁₀[H⁺] (nunca Henderson-Hasselbalch, plan v2)
export function phDe(paco2, hco3) { return 9 - Math.log10(24 * paco2 / hco3); }

// Pruebas: los mL de cada fluido (anexo 2 del plan), la mujer, la hemorragia y el salino 3 %
const ANEXO2 = {
  glucosado: { rio: 100, marisma: 250, mar: 650 }, salino: { rio: 275, marisma: 825, mar: -100 },
  ringer: { rio: 200, marisma: 800, mar: 'sin cifra' }, plasmalyte: { rio: 200, marisma: 800, mar: 'sin cifra' },
  alb5: { rio: 700, marisma: 300, mar: 0 }, alb25: { rio: '300-400', marisma: '−200 a −300', mar: 'sin cifra' },
  hiper: { rio: 535, marisma: 700, mar: -985 }
};
export function pruebasAguaViva() {
  const r = { fluidos: {}, mujer: null, hemorragia: {}, salino3: [], ph: {}, todoCoincide: true };
  for (const k of Object.keys(ANEXO2)) {
    const f = FLUIDOS[k], e = estadoBase(); e.infusiones = [{ f: k, ml: f.ref }];
    const d = derivar(e);
    const v = c => d.sinCifra[c] ? 'sin cifra' : Math.round(d.delta[c]);
    const o = { ml: f.ref, rio: v('rio'), marisma: v('marisma'), mar: v('mar') };
    if (d.rango.hay) { o.rio = `${Math.round(d.delta.rio + d.rango.rio[0])}-${Math.round(d.delta.rio + d.rango.rio[1])}`; o.marisma = `−${Math.round(-(d.delta.marisma + d.rango.marisma[0]))} a −${Math.round(-(d.delta.marisma + d.rango.marisma[1]))}`; }
    o.anexo2 = ANEXO2[k];
    o.coincide = String(o.rio) === String(ANEXO2[k].rio) && String(o.marisma) === String(ANEXO2[k].marisma) && String(o.mar) === String(ANEXO2[k].mar);
    if (!o.coincide) r.todoCoincide = false;
    r.fluidos[k] = o;
  }
  const em = estadoBase(); em.paciente = 'mujer'; const dm = derivar(em);
  r.mujer = { act: dm.P.act, mar: dm.base.mar, marisma: dm.base.marisma, rio: dm.base.rio, volemia: dm.V0 };
  const h = estadoBase(); h.hemorragia = 20; h.reloj = '1h';
  r.hemorragia.h20_1h = +derivar(h).hto.toFixed(1);
  const hs = copia(h); hs.infusiones = [{ f: 'salino', ml: 1000 }]; r.hemorragia.h20_1h_salino1L = +derivar(hs).hto.toFixed(1);
  const hb = copia(h); hb.infusiones = [{ f: 'sangre', ml: 1000 }]; r.hemorragia.h20_1h_sangre1L = +derivar(hb).hto.toFixed(1);
  const hd = copia(h); hd.reloj = '8-12h'; r.hemorragia.h20_8a12h = +derivar(hd).hto.toFixed(1);
  for (const [na0, bolos, periodo] of [[120, 1, '2h'], [120, 2, '2h'], [120, 3, '2h'], [126, 3, '5h'], [128, 2, '24h']]) {
    const e = estadoBase(); e.na0 = na0; e.bolos3 = bolos; e.periodo3 = periodo; const d = derivar(e);
    r.salino3.push({ na0, bolos, periodo, na: Math.round(d.naCorr), subidaPorBolo: (d.naCorr - na0) / bolos, avisos: d.avisos });
  }
  r.ph.casoW2 = +phDe(30, 16).toFixed(2);
  const eg = estadoBase(); eg.na0 = 142; eg.glucosa = 600; r.glucosa600 = { naMedido: +derivar(eg).naMed.toFixed(1) };
  const eu = estadoBase(); eu.urea = true; const du = derivar(eu); r.urea = { posm: Math.round(du.posm), posmEf: Math.round(du.posmEf) };
  const e0 = derivar(estadoBase()); r.normal = { posm: Math.round(e0.posm), posmEf: Math.round(e0.posmEf), hto: e0.hto };
  return r;
}

// ---------- Contenido de estudio: Conceptos, Mayéutica y casos ----------
// Toda la medicina sale de las fichas (fuente = ficha#elemento); el paciente de
// los casos se inventa. Las acciones de los conceptos son datos: `anillo`
// (señala un sitio), `poner` (estado nuevo), `cambiar` (cambia campos),
// `sumar` (añade una infusión), `bolo` (un bolo de salino al 3 %) y `lupa`.

export const CONCEPTOS = [
  { titulo: 'El río es pequeño',
    texto: 'El plasma son <span class="hl">3 de los 45 L</span> de agua del varón de 75 kg, el 6-7 %. La marisma (intersticio) lleva 13 L y el mar (células), 29 L.',
    hacer: 'toca cada cuerpo de agua, y cambia de paciente.', mirar: 'rio', estado: {},
    acciones: [{ t: 'Río', anillo: 'rio' }, { t: 'Marisma', anillo: 'marisma' }, { t: 'Mar', anillo: 'mar' },
      { t: 'Mujer de 60 kg', cambiar: { paciente: 'mujer' } }],
    mira: 'los mareógrafos: 3.000, 13.000 y 29.000 mL; en la mujer, 2.000, 8.000 y 20.000.',
    fuente: 'mar-cristaloides#mar-tabla-10-1' },
  { titulo: 'El agua va donde hay más partículas',
    texto: 'Si la membrana no deja pasar el soluto, <span class="hl-azul">el agua va del lado con menos partículas al de más</span> (tonicidad). Cuenta el número de partículas, no su tamaño. El sodio manda en el extracelular.',
    hacer: 'infunde 250 mL de salino al 7,5 % con la lupa abierta.', estado: {}, lupa: 'orilla',
    acciones: [{ t: 'Infundir 250 mL de salino 7,5 %', poner: { infusiones: [{ f: 'hiper', ml: 250 }] }, lupa: 'orilla' }],
    mira: 'el agua sale de las células por las compuertas: el mar pierde 985 mL y el río y la marisma ganan 1.235.',
    fuente: 'mar-cristaloides#mar-osmosis · mr-osmolalidad#mr-osm-efectiva' },
  { titulo: 'El cristaloide se reparte',
    texto: 'Un cristaloide se reparte por todo el extracelular: <span class="hl">el 20 % queda en el río</span> y <span class="hl-rojo">el 80 % va a la marisma</span>. Su efecto principal es expandir el intersticio, y eso favorece el edema. (Ringer 273 mOsm/L; Plasma-Lyte 295.)',
    hacer: 'infunde 1 L de Ringer y después 1 L de Plasma-Lyte.', estado: {}, mirar: 'marisma',
    acciones: [{ t: 'Infundir 1 L de Ringer', sumar: { f: 'ringer', ml: 1000 } },
      { t: 'Infundir 1 L de Plasma-Lyte', sumar: { f: 'plasmalyte', ml: 1000 } }],
    mira: 'cada litro: el río sube 200 mL y la marisma 800. En el mar, la ficha no da cifra.',
    fuente: 'mar-retorno-venoso#mar-cristaloide-reparto' },
  { titulo: 'El agua dulce acaba en el mar',
    texto: 'El glucosado al 5 % tiene 278 mOsm/L, casi como el plasma, pero <span class="hl-azul">la glucosa entra en las células</span> y se metaboliza: el agua la sigue. De 1 L, <span class="hl-rojo">dos tercios acaban dentro</span>.',
    hacer: 'infunde 1 L de glucosado con la lupa abierta.', estado: {}, mirar: 'mar', lupa: 'orilla',
    acciones: [{ t: 'Infundir 1 L de glucosado 5 %', poner: { infusiones: [{ f: 'glucosado', ml: 1000 }] }, lupa: 'orilla' }],
    mira: 'el mar sube 650 mL; al río solo llegan 100.',
    fuente: 'mar-cristaloides#mar-glucosado-volumen' },
  { titulo: 'El limo no cruza la orilla',
    texto: 'La albúmina hace el <span class="hl">80 % de la presión oncótica</span>. La del 5 % deja 700 de 1.000 mL en el río. La del 25 % saca agua de la marisma: <span class="hl-rojo">mueve, no repone</span>.',
    hacer: 'compara las dos albúminas, y baja la del paciente.', estado: {}, lupa: 'orilla',
    acciones: [{ t: '1 L de albúmina 5 %', poner: { infusiones: [{ f: 'alb5', ml: 1000 }] }, lupa: 'orilla' },
      { t: '100 mL de albúmina 25 %', poner: { infusiones: [{ f: 'alb25', ml: 100 }] }, lupa: 'orilla' },
      { t: 'Albúmina del paciente baja', poner: { albBaja: true }, lupa: 'orilla' }],
    mira: 'en la lupa, los granos chocan con la pared y no pasan. Con 100 mL al 25 %, el río gana 300-400 mL: 100 son el vial y 200-300 salen de la marisma.',
    fuente: 'mar-coloides#mar-tabla-10-3 · mar-albumina · mar-agravantes' },
  { titulo: 'La urea es sal que no mueve agua',
    texto: 'La urea cruza las membranas: <span class="hl-azul">hiperosmótica, pero no hipertónica</span>. La osmolalidad efectiva no la cuenta: 2 × Na + glucosa/18 = <span class="hl">285</span>. El sodio explica el 98 %.',
    hacer: 'sube la urea; después, compárala con la glucosa sin insulina.', estado: {}, lupa: 'orilla', mirar: 'lectura',
    acciones: [{ t: 'Urea alta', poner: { urea: true }, lupa: 'orilla' },
      { t: 'Glucosa 600 sin insulina', poner: { glucosa: 600 }, lupa: 'neurona' }],
    mira: 'con urea alta, la Posm sube a 315 (BUN 84, ilustrativo) y la efectiva sigue en 285: nada se mueve. La glucosa sí saca agua de las células.',
    fuente: 'mr-osmolalidad#mr-osm-efectiva-calc · mr-osmolalidad#mr-sodio-98' },
  { titulo: 'La hemorragia no baja el Hto al principio',
    texto: 'Se pierde sangre entera: <span class="hl-rojo">a la hora el Hto sigue en 45 %</span>. Baja con el relleno transcapilar (hasta 1 L, se nota a las 8-12 h) y con los fluidos sin hematíes.',
    hacer: 'mueve el reloj y elige con qué repones.', estado: { hemorragia: 20 }, mirar: 'lectura',
    acciones: [{ t: 'Reloj: 8-12 h', cambiar: { reloj: '8-12h' } },
      { t: '1 h + 1 L de salino', poner: { hemorragia: 20, infusiones: [{ f: 'salino', ml: 1000 }] } },
      { t: '1 h + 1 L de sangre', poner: { hemorragia: 20, infusiones: [{ f: 'sangre', ml: 1000 }] } }],
    mira: 'el Hto de la lectura y los discos del río: 45 % a la hora; baja con el relleno y con el salino; no cambia con la sangre completa.',
    fuente: 'mc-hemorragico-clasificacion (Fig. 15.1)' },
  { titulo: 'La hiponatremia es exceso de agua',
    texto: 'La hiponatremia es <span class="hl-rojo">exceso de agua, no falta de sodio</span>: el plasma hipotónico mete agua en el cerebro. Los síntomas, no la cifra, piden salino al 3 %.',
    hacer: 'pon el estrés con sueros hipotónicos, baja el Na⁺ y da un bolo.', estado: {}, lupa: 'neurona',
    acciones: [{ t: 'Estrés + 1 L de glucosado', poner: { adh: true, infusiones: [{ f: 'glucosado', ml: 1000 }] }, lupa: 'neurona' },
      { t: 'Na⁺ 122', poner: { adh: true, na0: 122 }, lupa: 'neurona' },
      { t: 'Bolo de salino 3 %', bolo: true }],
    mira: 'la neurona se hincha con el Na⁺ bajo; cada bolo sube el Na⁺ hasta 2. El tamaño es exagerado e ilustrativo.',
    fuente: 'mr-hiponatremia-tto#mr-agua-no-sodio · mr-hiponatremia-tto#mr-encefalopatia-hipona · mr-hiponatremia-tto#mr-tabla-35-3' }
];

export const totalDe = (e, f) => e.infusiones.filter(i => i.f === f).reduce((a, i) => a + i.ml, 0);

export const PREGUNTAS = [
  { id: 'ag-01', corto: 'plasma', tipo: 'test', fuente: 'mar-cristaloides#mar-tabla-10-1 · mc-hemorragico-clasificacion',
    estado: {},
    tocar: { mandos: ['compartimento'], mirar: null, ocultar: ['rio', 'marisma', 'mar'], instruccion: 'toca el río en el estuario y lee su mareógrafo.', confirma: 'el río del varón de 75 kg lleva 3.000 mL.', comprobar: e => e.tocado === 'rio', pista: 'El río es la franja que serpentea por el medio.', bueno: { tocado: 'rio' } },
    enunciado: 'Varón de 75 kg: ¿cuánto plasma tiene? Contesta y después lo compruebas en el estuario.',
    opciones: [
      { t: '5 L', ok: false, porque: 'Eso es la volemia (66 mL/kg de sangre entera: plasma y hematíes). Si repones pensando en 5 L de plasma, calculas déficits de más.' },
      { t: '3 L', ok: true },
      { t: '16 L', ok: false, porque: 'Es todo el extracelular: el río más la marisma.' }],
    explicacion: 'El plasma es el <span class="hl">20 % del extracelular</span>: 3 de 16 L, y solo el <span class="hl-rojo">6-7 % del agua</span> del cuerpo.' },
  { id: 'ag-02', corto: 'salino', tipo: 'test', fuente: 'mar-cristaloides#mar-fig-10-1 · mar-salino',
    estado: {},
    tocar: { mandos: ['infundir:salino:1000'], mirar: 'rio', ocultar: ['rio', 'marisma', 'mar'], instruccion: 'infúndelo y lee los mareógrafos.', confirma: 'río +275, marisma +825, mar −100.', comprobar: e => totalDe(e, 'salino') >= 1000, pista: 'Pulsa «Infundir 1 L de salino».', bueno: { infusiones: [{ f: 'salino', ml: 1000 }] } },
    enunciado: 'Vas a infundir 1 L de salino al 0,9 %. ¿Cuánto se quedará en el río, y por qué el río y la marisma ganarán más de 1.000 mL?',
    opciones: [
      { t: '1.000 mL: es isotónico y el sodio no sale del vaso', ok: false, porque: 'El sodio se reparte por todo el extracelular, y el plasma es solo el 20 %: tres cuartas partes acaban en el intersticio.' },
      { t: '700 mL, y los otros 300 se reparten por el intersticio', ok: false, porque: 'Eso es la albúmina al 5 %: su limo no cruza la orilla. La sal sí.' },
      { t: '275 mL; es algo hipertónico y saca agua de las células', ok: true }],
    explicacion: '1 L de salino: <span class="hl-rojo">275 mL al plasma</span> y 825 al intersticio (Fig. 10.1). Con 308 mOsm/L es algo hipertónico: el mar pierde unos 100 mL (la resta).' },
  { id: 'ag-cloro', corto: 'cloro', tipo: 'test', fuente: 'mar-cristaloides#mar-salino · mar-cristaloides#mar-tabla-10-2',
    estado: { infusiones: [{ f: 'salino', ml: 1000 }] }, mirar: 'rio', acidobase: 'paso-3',
    enunciado: 'Cirugía ginecológica: salino al 0,9 % a 30 mL/kg/h. ¿Qué le pasa al pH, y qué cambia con Ringer lactato al mismo ritmo?',
    opciones: [
      { t: 'Nada: es «fisiológico», el pH se mantiene en 7,41', ok: false, porque: 'No es normal ni química ni fisiológicamente: Cl⁻ 154 frente a 103 del plasma, y pH 5,7. Lo que más importa es el cloro.' },
      { t: 'Baja de 7,41 a 7,28 por el cloro; con Ringer no cambió', ok: true },
      { t: 'Baja igual con Ringer: lo hace cualquier cristaloide a ese ritmo', ok: false, porque: 'En la Fig. 10.2 el pH no cambió con Ringer lactato infundido al mismo ritmo: el culpable es el cloro.' }],
    explicacion: 'Fig. 10.2: con salino (Cl⁻ 154), el pH bajó de <span class="hl-rojo">7,41 a 7,28</span>; con Ringer (Cl⁻ 109), no cambió. Es una <span class="hl-rojo">acidosis metabólica hiperclorémica</span>; su cloro también causa vasoconstricción renal. Míralo en el ácido-base vivo.' },
  { id: 'ag-03', corto: 'glucosado', tipo: 'test', fuente: 'mar-cristaloides#mar-glucosado-volumen',
    estado: {}, despues: { infusiones: [{ f: 'glucosado', ml: 1000 }] }, mirar: 'mar',
    enunciado: 'El glucosado al 5 % tiene 278 mOsm/L, casi como el plasma. ¿Dónde acaba 1 L?',
    opciones: [
      { t: 'Como el salino: unos 275 mL en el plasma y 825 en el intersticio', ok: false, porque: 'La glucosa entra en las células y se metaboliza; el agua la sigue. No se queda en el extracelular como el sodio.' },
      { t: 'Dos tercios dentro de las células; 100 mL al plasma', ok: true },
      { t: 'Todo en el plasma: es isotónico', ok: false, porque: 'Es isosmótico en la bolsa, pero la glucosa se metaboliza y el agua pasa a las células.' }],
    explicacion: 'De 1 L, <span class="hl-rojo">dos tercios acaban dentro</span> de las células (edema celular): fuera quedan unos 350 mL, 100 en el plasma. Míralo ahora en el estuario.' },
  { id: 'ag-04', corto: 'urea', tipo: 'destapa', fuente: 'mr-osmolalidad#mr-osm-efectiva-calc · mr-osmolalidad#mr-sodio-98',
    estado: { urea: true }, lupa: 'orilla', mirar: 'lectura', ocultar: ['efect'],
    enunciado: 'Un urémico tiene la osmolalidad alta (mírala en la lectura). ¿Se deshidratan sus células? Son dos cosas.',
    puntos: ['La urea <span class="hl-azul">cruza las membranas</span>: es hiperosmótica, pero <span class="hl-rojo">no hipertónica</span>; no mueve agua.',
      'La osmolalidad efectiva no la cuenta: <span class="hl">2 × Na + glucosa/18 = 285</span>; el sodio explica el 98 %.'],
    explicacion: 'En la lupa, los hexágonos de urea cruzan todas las orillas y el agua no se mueve.' },
  { id: 'ag-05', corto: 'albúmina 25 %', tipo: 'test', fuente: 'mar-coloides#mar-tabla-10-3 · mar-albumina',
    estado: {}, lupa: 'orilla',
    tocar: { mandos: ['infundir:alb25:100'], mirar: 'marisma', ocultar: ['rio', 'marisma', 'mar'], instruccion: 'infúndela y mira la marisma.', confirma: 'el río gana 300-400 mL y la marisma pierde 200-300.', comprobar: e => totalDe(e, 'alb25') >= 100, pista: 'Pulsa «Infundir 100 mL de albúmina al 25 %».', bueno: { infusiones: [{ f: 'alb25', ml: 100 }] } },
    enunciado: 'Vas a infundir 100 mL de albúmina al 25 %. ¿De dónde saldrá el agua que gane el río?',
    opciones: [
      { t: 'Del mar: la albúmina saca agua de las células', ok: false, porque: 'La albúmina tira con presión oncótica a través de la pared del capilar, no de la membrana celular: el agua sale del intersticio.' },
      { t: 'Del vial: aporta 400 mL', ok: false, porque: 'El vial lleva 100 mL. Los otros 200-300 los saca del intersticio: por eso no sirve para reponer pérdidas.' },
      { t: 'De la marisma: mueve agua, no repone', ok: true }],
    explicacion: 'El río crece 3-4 veces lo infundido. Oncótica de <span class="hl">70 mmHg</span>, 2,5 veces la del plasma: <span class="hl-rojo">no repone pérdidas, solo mueve líquido</span>.' },
  { id: 'ag-06', corto: 'salino 7,5 %', tipo: 'test', fuente: 'mar-cristaloides#mar-hipertonico · mar-fig-10-1',
    estado: {}, despues: { infusiones: [{ f: 'hiper', ml: 250 }] }, lupa: 'orilla',
    enunciado: '250 mL de salino al 7,5 % añaden 1.235 mL al extracelular. ¿De dónde sale el resto?',
    opciones: [
      { t: 'Del intersticio, como con la albúmina al 25 %', ok: false, porque: 'El intersticio también gana (+700): el agua viene de dentro de las células, que pierden casi 1 L.' },
      { t: 'De las células: el líquido hipertónico les saca agua', ok: true },
      { t: 'Es un error de medida: no se puede ganar más de lo infundido', ok: false, porque: 'Se puede, si el líquido es hipertónico: 2.567 mOsm/L, 9 veces el plasma, saca agua de las células.' }],
    explicacion: '<span class="hl">Unas 5 veces lo infundido</span>, sacando agua de las células. En el trauma no ha mostrado mejor supervivencia.' },
  { id: 'ag-07', corto: 'déficit', tipo: 'test', fuente: 'mar-retorno-venoso#mar-tabla-11-1 · mar-retorno-venoso#mar-deficit-pequeno',
    estado: {}, despues: { infusiones: [{ f: 'ringer', ml: 2250 }] },
    enunciado: 'Varón de 75 kg con un déficit clínico del 15 % del plasma. ¿Cuánto falta y cuánto Ringer lo repone según el cap. 11?',
    opciones: [
      { t: '750 mL; 750 mL de Ringer', ok: false, porque: '750 mL sería el 15 % de la volemia (5 L); la Tabla 11.1 calcula el déficit sobre el plasma (3 L). Y el Ringer no se queda en el vaso.' },
      { t: '450 mL; 450 mL de Ringer, porque el Ringer se queda en el vaso', ok: false, porque: 'Solo el 20 % del cristaloide se queda en el plasma: repondrías 90 mL.' },
      { t: '450 mL; 2,25 L de Ringer, porque solo se queda el 20 %', ok: true }],
    explicacion: 'El déficit que dispara la reposición es <span class="hl">pequeño: 450 mL</span> en el varón y 300 en la mujer. Del Ringer, 20 % al plasma y <span class="hl-rojo">80 % al intersticio</span>: de los 2,25 L, 1,8 L van al intersticio.',
    nota: '<b>Nota de fuentes.</b> Cap. 11: 450 mL → 2,25 L (×5, se queda el 20 %). Tabla 15.4 (cap. 15): ×3, «estimación conservadora» porque se queda el 20-25 %. Y la Fig. 10.1 da 275 de 1.000 mL de salino en el plasma (27,5 %). Las tres son de Marino; no gana ninguna.<br><b>Nota de fidelidad.</b> El texto (p. 25) habla de un déficit del 15 % de la volemia; la Tabla 11.1 aplica el 15 % al plasma (450 mL de 3 L). La pregunta sigue la tabla.' },
  { id: 'ag-08', corto: 'Hto', tipo: 'test', fuente: 'mc-hemorragico-clasificacion (Hemoglobina y hematocrito, Fig. 15.1)',
    estado: { reloj: '8-12h' },
    tocar: { mandos: ['hemorragia', 'reloj'], mirar: 'lectura', ocultar: ['hto'], instruccion: '1 L de unos 5 L de volemia: pon la hemorragia y el reloj en «1 h», y lee el Hto.', confirma: 'a la hora, el Hto sigue en 45 %.', comprobar: e => e.hemorragia >= 19 && e.hemorragia <= 21 && e.reloj === '1h', pista: '1 L de 5 L es un 20 %. El reloj, en «1 h».', bueno: { hemorragia: 20, reloj: '1h' } },
    enunciado: 'Hemorragia de 1 L hace una hora en un varón de 75 kg. ¿Qué Hto esperas?',
    opciones: [
      { t: 'Bajo, proporcional a la pérdida', ok: false, porque: 'Eso llega después: con el relleno transcapilar (8-12 h) y con los fluidos que pongas.' },
      { t: 'Alto, por hemoconcentración', ok: false, porque: 'Se pierde sangre entera, no agua: la proporción no cambia.' },
      { t: 'El de antes: 45 %, sin cambio', ok: true }],
    explicacion: 'Se pierden plasma y hematíes en proporción: a la hora, <span class="hl-rojo">el Hto no ve la hemorragia</span>. Baja con el relleno (8-12 h, días) y con el fluido que elijas.' },
  { id: 'ag-09', corto: 'signos', tipo: 'test', fuente: 'mar-retorno-venoso#mar-constantes-volemia',
    estado: { hemorragia: 15 },
    enunciado: '¿Qué signo aparece antes en una hipovolemia?',
    opciones: [
      { t: 'La taquicardia en decúbito, ya con un 15 % de déficit', ok: false, porque: 'No aparece en la mayoría de las hemorragias agudas, ni con déficits del 25 %; la bradicardia puede ser incluso más frecuente.' },
      { t: 'El aumento ortostático de la FC ≥30 lpm', ok: true },
      { t: 'La hipotensión en decúbito', ok: false, porque: 'No aparece hasta déficits de más del 30 %: si la esperas, llegas tarde.' }],
    explicacion: 'El ortostatismo es <span class="hl">el marcador más sensible</span>, pero en la UCI muchos pacientes no pueden ponerse de pie.',
    nota: '<b>Nota de fuentes.</b> La Tabla 15.1 (cap. 15) pone la FC ↑ ya en la clase II; el cap. 11 dice que la taquicardia en decúbito no aparece en la mayoría de las hemorragias agudas, ni con déficits del 25 %. Las dos son de Marino; el libro no las concilia. <span class="agv-org" data-org="ficha · mc-hemorragico-clasificacion · mar-constantes-volemia">ficha</span>' },
  { id: 'ag-10', corto: 'PVC', tipo: 'error', fuente: 'mar-retorno-venoso#mar-pvc-volemia · #mar-rv-ecuacion · #mar-rv-pvc · #mar-vci-volemia · #mar-pms-fluidos',
    estado: {},
    enunciado: 'Nota del R1 de guardia sobre un paciente hipotenso.',
    frases: [
      { t: 'PVC 4: está seco; damos fluidos hasta PVC 12.', mal: true, c: 'La PVC <span class="hl-rojo">no se relaciona con la volemia</span> (r = 0,17 en 112 pares de medidas) y nunca debe decidir la fluidoterapia.' },
      { t: 'La reposición busca aumentar el gradiente Pms − PVC.', mal: false },
      { t: 'Cada mmHg de presión en la aurícula derecha, sin cambiar el volumen, baja el retorno venoso un 14 % de media.', mal: false },
      { t: 'Según Marino, la variación respiratoria de la VCI es fiable para la volemia.', mal: true, c: 'Para Marino <span class="hl-rojo">resultó poco fiable</span>. Nota de fuentes: el Manual UMI usa el diámetro y la colapsabilidad de la VCI en la ecografía FATE para estimar la PAD.' },
      { t: 'Una sobrecarga siempre sube la Pms; responde el que aumenta Pms − PVC.', mal: false }],
    explicacion: 'Retorno venoso = (Pms − PVC) / Rv: <span class="hl-azul">la PVC frena el retorno</span>; no mide la volemia.' },
  { id: 'ag-hiperna', corto: 'hipernatremia', tipo: 'test', fuente: 'mr-hipernatremia#mr-hiperna-tto · mr-hipernatremia#mr-hiperna-ritmo · mr-hipernatremia#mr-hiperna-cerebro',
    estado: { na0: 160, reloj: 'dias' }, lupa: 'neurona',
    tocar: { mandos: ['infundir:salino:1000'], mirar: 'lectura', instruccion: 'infunde 1 L de salino y mira el Na⁺ y la neurona.', confirma: 'el Na⁺ sigue en 160; la neurona ya había recuperado su volumen con osmolitos.', comprobar: e => totalDe(e, 'salino') >= 1000, pista: 'Pulsa «Infundir 1 L de salino al 0,9 %».', bueno: { infusiones: [{ f: 'salino', ml: 1000 }] } },
    enunciado: 'Na⁺ 160 desde hace días, con hipotensión. ¿Qué hará 1 L de salino al 0,9 %, y qué más necesitas?',
    opciones: [
      { t: 'Corrige la hipotensión y también la hipernatremia: con el salino basta', ok: false, porque: 'El salino isotónico corrige la hipotensión, no la hipernatremia: el Na⁺ sigue en 160.' },
      { t: 'Bajar el Na⁺ a 145 en unas horas con glucosado al 5 % o agua por la sonda', ok: false, porque: 'Las neuronas ya acumularon osmolitos: se teme el edema cerebral. Lo tradicional es ≤0,5 mEq/L/h.' },
      { t: 'Corrige la hipotensión, no la hipernatremia: añade agua, ≤0,5 mEq/L/h', ok: true }],
    explicacion: 'Glucosado al 5 % o agua por la sonda; como también se ha perdido sodio, al autor le parece más adecuado el <span class="hl">salino 0,45 %</span>. Ritmo tradicional <span class="hl-rojo">≤0,5 mEq/L/h</span> (el óptimo no se conoce): la neurona ya recuperó volumen con osmolitos.' },
  { id: 'ag-11', corto: 'glucosa y Na⁺', tipo: 'test', fuente: 'mr-hiponatremia-dx#mr-hiperglucemia-na',
    estado: { na0: 142, glucosa: 100 }, lupa: 'neurona',
    tocar: { mandos: ['glucosa'], mirar: 'lectura', ocultar: ['na', 'posm'], instruccion: 'sube la glucosa sin insulina hasta 600 y lee el Na⁺ y el corregido.', confirma: 'Na⁺ medido 130, corregido 142; la neurona se encoge.', comprobar: e => e.glucosa >= 590, pista: 'Lleva la glucosa al final, a 600 mg/dL, y mira el Na⁺.', bueno: { glucosa: 600 } },
    enunciado: 'Diabético sin insulina, glucosa 600: el laboratorio da Na⁺ 130. ¿Cuál es el Na⁺ corregido?',
    opciones: [
      { t: '130: es una hiponatremia verdadera y hay que tratarla', ok: false, porque: 'La glucosa que no entra en las células les saca agua y diluye el sodio (hiponatremia espuria).' },
      { t: '142: la glucosa saca agua de las células y diluye el sodio', ok: true },
      { t: '118: la corrección se resta', ok: false, porque: 'Se suma: 2,4 mEq/L por cada 100 mg/dL por encima de 100. 130 + 2,4 × 5 = 142.' }],
    explicacion: 'Na corregido = Na + <span class="hl">2,4 × (glucosa − 100)/100</span> (Ec. 35.5). La glucosa que no entra en las células les saca agua y diluye el sodio (hiponatremia espuria).' },
  { id: 'ag-12', corto: 'salino 3 %', tipo: 'destapa', fuente: 'mr-hiponatremia-tto#mr-tabla-35-3 · mr-hiponatremia-tto#mr-encef-cuando',
    estado: { na0: 120, adh: true }, lupa: 'neurona',
    enunciado: 'Hiponatremia aguda que convulsiona. ¿Cómo das el salino al 3 %, cuándo valoras y con qué límites? Son cinco cosas.',
    puntos: ['Bolos de <span class="hl">2 mL/kg (o 150 mL)</span>, repetidos cada pocas horas hasta que ceden los síntomas; por vía periférica si hace falta.',
      'Valora cuando el Na⁺ haya subido <span class="hl">5</span>: con +5-6 deberían mejorar los síntomas; si no, busca otra causa.',
      'Subida inicial <span class="hl-rojo">≤5 mEq/L en 2 h</span> y ≤10 en 5 h.',
      '<span class="hl-rojo">≤10 el primer día</span> y 8 los siguientes.',
      'Na⁺ final <span class="hl">≤130</span>.'],
    explicacion: 'La cifra de Na⁺ no decide si dar el 3 %: <span class="hl-rojo">deciden los síntomas</span>. Cada bolo sube el Na⁺ hasta 2 mEq/L.' }
];

export const CASOS = [
  { id: 'w-1', titulo: 'Pablo, 32 años: la hemorragia que el Hto no veía', corto: 'Caso 1 · Pablo', sub: 'fractura de fémur, 75 kg',
    paciente: { Edad: '32 años', Peso: '75 kg (volemia ≈ 5 L)', Motivo: 'Fractura de fémur en un accidente de moto' },
    pasos: [
      { momento: 'Llegada · 1 h', datos: { FC: '110 lpm', PA: '118/70 mmHg', Diuresis: 'conservada', Lactato: 'normal', Hto: '45 %', Pérdida: '≈ 1 L (estimada)' }, nuevo: ['FC', 'PA', 'Diuresis', 'Lactato', 'Hto', 'Pérdida'],
        estado: { hemorragia: 20, reloj: '1h' }, mirar: 'herida',
        pregunta: { id: 'w1-1', tipo: 'test', fuente: 'mc-hemorragico-clasificacion (Tabla 15.1)',
          enunciado: '¿Qué clase de hemorragia tiene y qué haces?',
          opciones: [
            { t: 'Hto 45 %: no ha sangrado mucho; observar', ok: false, porque: 'La pérdida aguda no baja el Hto: se pierde sangre entera. Esperar deja sin reponer una pérdida del 20 %.' },
            { t: 'Clase III por la taquicardia: transfundir ya', ok: false, porque: 'PA, diuresis y lactato normales: aún compensa. La clase III es la del shock: hipotensión, oliguria y lactato alto.' },
            { t: 'Clase II (15-30 %): fase compensada; cristaloides', ok: true }],
          explicacion: '1 L de 5 L es un <span class="hl">20 %</span> (13 mL/kg): Clase II. La PA se mantiene por vasoconstricción.' } },
      { momento: '1 h', datos: {}, nuevo: [],
        estado: { hemorragia: 20, reloj: '1h' }, calculadora: { nombre: 'Volumen de reanimación', ids: 'mc-vr-*', ir: 'mc-vr-peso' },
        pregunta: { id: 'w1-2', tipo: 'test', fuente: 'mc-hemorragico-fluidos (Tabla 15.4)',
          despues: { hemorragia: 20, reloj: '1h', infusiones: [{ f: 'ringer', ml: 1800 }] },
          enunciado: 'Su plasma, según la Tabla 15.4: 40 mL/kg × 75 = 3.000 mL, y ha perdido un 20 %. ¿Cuánto infundes?',
          opciones: [
            { t: '600 mL de Ringer: lo mismo que el déficit de plasma', ok: false, porque: 'Solo el 20-25 % del cristaloide se queda en el plasma: repondrías unos 120-150 mL.' },
            { t: '1,8 L de cristaloide (×3) o 600 mL de coloide', ok: true },
            { t: '5 L de Ringer: lo que mide su volemia', ok: false, porque: 'Confundes el plasma (3 L) con la volemia (5 L) y repones la volemia entera: sobrecarga.' }],
          explicacion: 'Tabla 15.4: <span class="hl">déficit = plasma × % de pérdida</span>; ×3 con cristaloides (estimación conservadora) y ×1 con coloides. Mira cómo se reparten 1,8 L de Ringer.' } },
      { momento: '1 h 30', datos: { Fluidos: 'Ringer lactato 1,8 L' }, nuevo: ['Fluidos'],
        estado: { hemorragia: 20, reloj: '1h', infusiones: [{ f: 'ringer', ml: 1800 }] }, mirar: 'marisma',
        pregunta: { id: 'w1-3', tipo: 'destapa', fuente: 'mc-hemorragico-fluidos · mar-retorno-venoso#mar-deficit-pequeno',
          enunciado: 'El R2: «En el cap. 11, para 450 mL salen 2,25 L de Ringer: es ×5, no ×3». ¿Por qué no coinciden? Son dos cosas.',
          puntos: ['Tabla 15.4 (cap. 15): ×3 es una <span class="hl">estimación conservadora</span>, porque solo el 20-25 % del cristaloide se queda en el plasma.',
            'Cap. 11: se queda <span class="hl">el 20 %</span>, así que 450 mL piden <span class="hl">2,25 L</span> de Ringer (×5). Las dos son de Marino: no gana ninguna.'],
          explicacion: 'En el estuario, 1,8 L de Ringer: el río gana 360 mL y la marisma 1.440 (20/80).' } },
      { momento: '3 h', datos: { Hto: '41 % (cálculo del modelo, fisiología general)' }, nuevo: ['Hto'],
        estado: { hemorragia: 20, reloj: '1h', infusiones: [{ f: 'ringer', ml: 1800 }] }, mirar: 'lectura',
        pregunta: { id: 'w1-4', tipo: 'test', fuente: 'mc-hemorragico-clasificacion (Fig. 15.1)',
          enunciado: 'El Hto ha bajado de 45 % a 41 % tras el Ringer. ¿Sigue sangrando?',
          opciones: [
            { t: 'Sí: cada punto que baja es sangre perdida', ok: false, porque: 'El Ringer expande el plasma y no los hematíes: diluye. En las primeras horas el Hto refleja la reanimación, no la pérdida.' },
            { t: 'No: es el relleno transcapilar, que ya ha terminado', ok: false, porque: 'El relleno tarda 8-12 h en notarse en el Hto y días en completarse: a las 3 h todavía no se nota en el Hto.' },
            { t: 'No se sabe por el Hto: refleja los fluidos', ok: true }],
          explicacion: 'En las primeras horas, <span class="hl-rojo">el Hto refleja la reanimación</span>, no la pérdida. El modelo lo calcula: hematíes ÷ volemia = 41 % <span class="agv-org agv-ilu">fisiología general, cálculo del modelo; la Fig. 15.1 solo da la dirección</span>.' } },
      { momento: '4 h · el giro', datos: { FC: '130 lpm', PA: '85/50 mmHg', Diuresis: 'oliguria', Lactato: 'alto' }, nuevo: ['FC', 'PA', 'Diuresis', 'Lactato'],
        estado: { hemorragia: 35, reloj: '1h', infusiones: [{ f: 'ringer', ml: 1800 }] }, mirar: 'herida',
        pregunta: { id: 'w1-5', tipo: 'error', fuente: 'mc-hemorragico-clasificacion · mc-hemorragico-fluidos · mar-retorno-venoso#mar-pvc-volemia',
          enunciado: 'Ha seguido sangrando. Plan que deja escrito el R1.',
          frases: [
            { t: 'Ahora es Clase III: hipotensión, oliguria y lactato alto.', mal: false },
            { t: 'Seguimos con Ringer a chorro hasta PVC 12.', mal: true, c: 'La PVC no se relaciona con la volemia y nunca decide los fluidos; y <span class="hl-rojo">el cristaloide agresivo agrava el sangrado</span> al diluir los factores de la coagulación.' },
            { t: 'Los hematíes no suben el gasto por su viscosidad: los damos para el transporte de O₂.', mal: false },
            { t: 'Ponemos un catéter central de 8 pulgadas para infundir más rápido que por el periférico de 16G.', mal: true, c: 'Al revés: por gravedad, el periférico corto de 16G pasa 10,8 L/h y el central de 8 pulgadas, 2,3: <span class="hl-rojo">unas 5 veces más</span> (Fig. 15.2).' },
            { t: 'Objetivo de Hb ≥7-9 g/dL (Fig. 15.6).', mal: false }],
          explicacion: 'Pierde ya un <span class="hl-rojo">35 %</span>: fase de shock, se reanima con sangre.',
          nota: '<b>Nota de fuentes.</b> La Fig. 15.6 da Hb ≥7-9 g/dL en el shock hemorrágico; el texto de la hemorragia sin shock, 7-8 g/dL. El libro no explica la diferencia.' } },
      { momento: 'Día 2', datos: { Sangrado: 'controlado', Hto: 'sigue bajando' }, nuevo: ['Sangrado', 'Hto'],
        estado: { hemorragia: 35, reloj: 'dias', infusiones: [{ f: 'ringer', ml: 1800 }] }, mirar: 'rio',
        pregunta: { id: 'w1-6', tipo: 'destapa', fuente: 'mc-hemorragico-clasificacion',
          enunciado: '¿Por qué baja el Hto si ya no sangra? Son dos cosas.',
          puntos: ['El <span class="hl-azul">relleno transcapilar</span>: el intersticio cede hasta 1 L al plasma.',
            '<span class="hl-azul">ADH y aldosterona</span> retienen agua y sodio: tarda 8-12 h en notarse y días en completarse.'],
          explicacion: 'En el modelo, la marisma cede agua y los discos del río se separan. El modelo no cuenta los hematíes que se hayan transfundido.' } }
    ],
    lleva: ['El Hto no mide la hemorragia en las primeras horas: refleja lo que infundes.',
      'El cristaloide se va al intersticio: ×3 (Tabla 15.4) o ×5 (cap. 11) del déficit, según el capítulo.',
      'Catéter periférico corto y grueso; la PVC no decide los fluidos.'],
    volver: { nombre: 'Shock hemorrágico', ficha: 'mc-hemorragico-clasificacion (Merino Cardiología)', estado: { hemorragia: 35, reloj: '1h' }, pestana: 'sangrado' } },

  { id: 'w-2', titulo: 'Rosa, 68 años: el salino que se fue a la marisma', corto: 'Caso 2 · Rosa', sub: 'shock séptico urinario, 60 kg',
    paciente: { Edad: '68 años', Peso: '60 kg (río de 2 L)', Motivo: 'Shock séptico de origen urinario' },
    pasos: [
      { momento: 'Urgencias', datos: { Fluidos: '2 L de salino 0,9 %' }, nuevo: ['Fluidos'],
        estado: { paciente: 'mujer' },
        pregunta: { id: 'w2-1', tipo: 'test', fuente: 'mar-cristaloides#mar-fig-10-1 · mar-tabla-10-1',
          tocar: { mandos: ['infundir:salino:2000'], mirar: 'rio', ocultar: ['rio', 'marisma', 'mar'], instruccion: 'infunde 2 L de salino y lee los mareógrafos.', confirma: 'río ≈ +550 mL, marisma ≈ +1.650 (proporcional a la Fig. 10.1).', comprobar: e => e.paciente === 'mujer' && totalDe(e, 'salino') >= 2000, pista: 'Pulsa «Infundir 2 L de salino».', bueno: { paciente: 'mujer', infusiones: [{ f: 'salino', ml: 2000 }] } },
          enunciado: 'Rosa va a recibir 2 L de salino. ¿Cuánto quedará en su río?',
          opciones: [
            { t: '2.000 mL: es isotónico y se queda en el vaso', ok: false, porque: 'El sodio se reparte por todo su extracelular (10 L), y el plasma es solo el 20 %.' },
            { t: '≈ 550 mL; unos 1.650 a la marisma', ok: true },
            { t: '1.400 mL (70 %)', ok: false, porque: 'Eso haría la albúmina al 5 %: su limo se queda en el río; la sal no.' }],
          explicacion: 'Proporcional a la Fig. 10.1 (ilustrativo para 2 L): <span class="hl-rojo">275 mL por litro de salino</span> se quedan en el vaso.' } },
      { momento: 'UCI · hora 2', datos: { 'Na⁺ / Cl⁻ / HCO₃⁻': '140 / 114 / 16', 'PaCO₂': '30 mmHg', pH: `${dec(phDe(30, 16), 2)} (Ec. 31.2)`, Albúmina: '2,0 g/dL', Lactato: 'alto' }, nuevo: ['Na⁺ / Cl⁻ / HCO₃⁻', 'PaCO₂', 'pH', 'Albúmina', 'Lactato'],
        estado: { paciente: 'mujer', infusiones: [{ f: 'salino', ml: 2000 }], albBaja: true }, acidobase: 'paso-3',
        pregunta: { id: 'w2-2', tipo: 'test', fuente: 'mr-acidobase-gaps#mr-ag-albumina · mr-acidobase-gaps#mr-delta-menor · mar-cristaloides',
          enunciado: '¿Qué trastorno ácido-base tiene?',
          opciones: [
            { t: 'HA 10, normal: solo una acidosis hiperclorémica del salino', ok: false, porque: 'Con albúmina 2, el HA esconde 6 mEq: corregido = 10 + 2,5 × (4,5 − 2) = 16. Te habrías perdido el lactato.' },
            { t: 'Alcalosis respiratoria: la PaCO₂ está en 30', ok: false, porque: 'Es la compensación esperada: 40 − 1,2 × (24 − 16) = 30,4. El pH es ácido: el primario es metabólico.' },
            { t: 'HAc 16 (lactato) y delta <1: hiperclorémica añadida', ok: true }],
          explicacion: 'HA = 140 − (114 + 16) = 10; <span class="hl">corregido 16</span> (Ec. 31.15): el lactato que escondía la albúmina. Delta (Ec. 31.16) = (10 − 12)/(24 − 16) = <span class="hl-rojo">−0,25</span>: por debajo de 1, el HCO₃⁻ ha bajado mucho más de lo que ha subido el HA. Acidosis hiperclorémica añadida: el salino trae Cl⁻ 154.',
          nota: '<b>Nota de fuentes.</b> Marino corrige el hiato por la albúmina (Ec. 31.15), pero no dice si el delta se calcula con el hiato corregido; con el corregido saldría (16 − 12)/(24 − 16) = 0,5. Los dos quedan por debajo de 1. <span class="agv-org" data-org="ficha · mr-ag-albumina · mr-delta-gap">ficha</span>' } },
      { momento: 'Hora 3', datos: { PA: 'sigue hipotensa', Exploración: 'edemas' }, nuevo: ['PA', 'Exploración'],
        estado: { paciente: 'mujer', infusiones: [{ f: 'salino', ml: 2000 }], albBaja: true, inflamacion: true }, lupa: 'orilla',
        pregunta: { id: 'w2-3', tipo: 'test', fuente: 'mar-coloides#mar-fluido-a-medida · mar-albumina',
          despues: { paciente: 'mujer', infusiones: [{ f: 'salino', ml: 2000 }, { f: 'alb25', ml: 100 }], albBaja: true, inflamacion: true },
          enunciado: '¿Qué fluido propone Marino para la hipovolemia con hipoalbuminemia?',
          opciones: [
            { t: 'Otros 2 L de salino: sigue hipotensa y necesita volumen', ok: false, porque: 'El 80 % iría a una marisma que ya desborda, con más cloro.' },
            { t: 'Albúmina al 25 %, 50-100 mL (propuesta del autor)', ok: true },
            { t: 'Glucosado al 5 %, para no dar más sodio ni cloro', ok: false, porque: 'Dos tercios acaban en las células; y con compromiso hemodinámico, hasta el 85 % de la glucosa acaba en lactato.' }],
          explicacion: '«Un fluido para cada situación», propone el autor. Aviso: <span class="hl-rojo">la hiperoncótica se ha asociado a daño renal en el shock</span>.' } },
      { momento: 'Día 3 · el giro', datos: { Balance: '+6 L', PVC: '6 mmHg', Exploración: 'crepitantes, edemas' }, nuevo: ['Balance', 'PVC', 'Exploración'],
        estado: { paciente: 'mujer', infusiones: [{ f: 'salino', ml: 2000 }, { f: 'alb25', ml: 100 }, { f: 'salino', ml: 2000 }, { f: 'salino', ml: 2000 }], albBaja: true, inflamacion: true }, mirar: 'marisma',
        pregunta: { id: 'w2-4', tipo: 'error', fuente: 'mar-retorno-venoso#mar-pvc-volemia · #mar-constantes-volemia · #mar-agravantes',
          enunciado: 'Nota de evolución del R1.',
          frases: [
            { t: 'Lleva +6 L, pero la PVC es 6: necesita más volumen.', mal: true, c: 'La PVC no se relaciona con la volemia: <span class="hl-rojo">+6 L es sobrecarga</span>, y la sobrecarga iatrogénica empeora la morbimortalidad.' },
            { t: 'Los cristaloides isotónicos expanden más el intersticio que el plasma.', mal: false },
            { t: 'La albúmina baja y la permeabilidad alta suelen coexistir y empeoran el edema.', mal: false },
            { t: 'La taquicardia en decúbito es el mejor marcador de hipovolemia en la UCI.', mal: true, c: '<span class="hl-rojo">No aparece</span> en la mayoría de las hemorragias agudas, ni con un 25 % de déficit; el más sensible es el aumento ortostático de la FC.' },
            { t: 'La sobrecarga de volumen iatrogénica empeora la morbimortalidad.', mal: false }],
          explicacion: 'En el estuario, la marisma desborda los prados y el río apenas subió.' } },
      { momento: 'Día 3', datos: {}, nuevo: [],
        estado: { paciente: 'mujer', infusiones: [{ f: 'salino', ml: 2000 }, { f: 'alb25', ml: 100 }, { f: 'salino', ml: 2000 }, { f: 'salino', ml: 2000 }], albBaja: true, inflamacion: true }, lupa: 'orilla',
        pregunta: { id: 'w2-5', tipo: 'destapa', fuente: 'mar-retorno-venoso#mar-cristaloide-reparto · #mar-agravantes',
          enunciado: '¿Por qué se acumula el agua en su marisma? Son tres cosas.',
          puntos: ['El cristaloide va el <span class="hl">80 % al intersticio</span>.', 'La <span class="hl-rojo">albúmina baja</span>: hace el 80 % de la presión oncótica.', 'La <span class="hl-rojo">permeabilidad alta</span> de la inflamación.'],
          explicacion: 'Fig. 11.3: en 50 shocks sépticos, la volemia estaba un <span class="hl-rojo">29 % por encima</span> de lo esperado y el plasma un 37 %: sobrecarga iatrogénica.' } }
    ],
    lleva: ['Cada litro de salino deja 275 mL en el vaso (Fig. 10.1); en la mujer de 60 kg, el río es de 2 L.',
      'El salino trae cloro: una acidosis hiperclorémica que el delta descubre (y la albúmina baja esconde el lactato).',
      'Con albúmina baja e inflamación la marisma se inunda, y la PVC no lo ve.'],
    volver: { nombre: 'Retorno venoso y sobrecarga', ficha: 'mar-retorno-venoso (Marino cap. 11)', estado: { paciente: 'mujer', infusiones: [{ f: 'salino', ml: 2000 }, { f: 'salino', ml: 2000 }, { f: 'salino', ml: 2000 }], albBaja: true, inflamacion: true }, pestana: 'paciente' } },

  { id: 'w-3', titulo: 'Elena, 45 años: el suero que la hizo convulsionar', corto: 'Caso 3 · Elena', sub: 'posoperatorio, 60 kg',
    paciente: { Edad: '45 años', Peso: '60 kg', Motivo: 'Posoperatorio de colecistectomía' },
    pasos: [
      { momento: 'Día 0', datos: { 'Na⁺': '139 mEq/L', Sueros: 'glucosado 5 % y Ringer, 3 L al día' }, nuevo: ['Na⁺', 'Sueros'],
        estado: { paciente: 'mujer', na0: 139, adh: true, infusiones: [{ f: 'glucosado', ml: 1500 }, { f: 'ringer', ml: 1500 }] }, mirar: 'mar',
        pregunta: { id: 'w3-1', tipo: 'test', fuente: 'mr-hiponatremia-dx#mr-estres-adh · mar-tabla-10-2',
          enunciado: '¿Qué riesgo ves?',
          opciones: [
            { t: 'Hipernatremia por el sodio del Ringer, 3 L al día', ok: false, porque: 'El Ringer lleva menos sodio que el plasma: 130 frente a 140.' },
            { t: 'Ninguno: el Ringer es isotónico y el glucosado se metaboliza', ok: false, porque: 'Con 273 mOsm/L es algo hipotónico (Tabla 10.2); y del glucosado, la glucosa se metaboliza y el agua pasa a las células.' },
            { t: 'Hiponatremia por ADH de estrés y sueros hipotónicos', ok: true }],
          explicacion: 'El estrés libera ACTH y también ADH: <span class="hl-rojo">riesgo en el posoperatorio</span> y en el crítico. Los sueros hipotónicos como el Ringer añaden riesgo.' } },
      { momento: 'Día 1 · 30 h', datos: { 'Na⁺': '124 mEq/L', Glucosa: '90 mg/dL', BUN: '14 mg/dL', Osmolalidad: '258 mOsm/kg', Clínica: 'cefalea, náuseas' }, nuevo: ['Na⁺', 'Glucosa', 'BUN', 'Osmolalidad', 'Clínica'],
        estado: { paciente: 'mujer', na0: 124, adh: true, infusiones: [{ f: 'glucosado', ml: 1500 }, { f: 'ringer', ml: 1500 }] }, lupa: 'neurona',
        pregunta: { id: 'w3-2', tipo: 'test', fuente: 'mr-hiponatremia-dx#mr-pseudo-dx · mr-osmolalidad',
          enunciado: '¿Es una hiponatremia verdadera?',
          opciones: [
            { t: 'Puede ser una pseudohiponatremia: hay que esperar a los lípidos', ok: false, porque: 'En la pseudohiponatremia la osmolalidad es normal (285-295). Esperar retrasaría el tratamiento de una encefalopatía que empieza.' },
            { t: 'Sí: la osmolalidad está baja (<275)', ok: true },
            { t: 'Hay que corregirlo por la glucosa', ok: false, porque: 'Con glucosa 90 no hay nada que corregir: la Ec. 35.5 es para la hiperglucemia.' }],
          explicacion: 'Osmolalidad <span class="hl-rojo">baja (<275)</span>: verdadera. La Ec. 35.3 da lo mismo: 2 × 124 + 90/18 + 14/2,8 = 258. Mira la neurona.' } },
      { momento: '32 h · el giro', datos: { Clínica: 'convulsión generalizada' }, nuevo: ['Clínica'],
        estado: { paciente: 'mujer', na0: 124, adh: true, infusiones: [{ f: 'glucosado', ml: 1500 }, { f: 'ringer', ml: 1500 }] }, lupa: 'neurona',
        pregunta: { id: 'w3-3', tipo: 'test', fuente: 'mr-hiponatremia-tto#mr-tabla-35-3 · mr-hiponatremia-tto#mr-encef-cuando',
          despues: { paciente: 'mujer', na0: 124, adh: true, bolos3: 1, infusiones: [{ f: 'glucosado', ml: 1500 }, { f: 'ringer', ml: 1500 }] },
          enunciado: '¿Qué haces?',
          opciones: [
            { t: 'Na⁺ 124 no es tan bajo: restricción hídrica y repetir el Na⁺', ok: false, porque: 'La cifra no decide: no hay correlación entre la gravedad de la hiponatremia y la de la encefalopatía. Una convulsión es edema cerebral: amenaza vital.' },
            { t: 'Salino 3 %: bolo de 120 o 150 mL, cada pocas horas', ok: true },
            { t: 'Salino al 0,9 %, 1 L, para subirlo sin riesgo', ok: false, porque: 'No trata la encefalopatía: hace falta salino hipertónico, que sube el Na⁺ deprisa.' }],
          explicacion: 'Bolos de <span class="hl">2 mL/kg (120 mL en sus 60 kg) o 150 mL</span>, repetidos cada pocas horas hasta que ceden los síntomas; por vía periférica si hace falta. Cada bolo sube el Na⁺ hasta 2. <span class="hl-azul">Valora cuando haya subido 5</span>: con +5-6 deberían mejorar los síntomas; si no, busca otra causa.' } },
      { momento: '34 h', datos: { 'Na⁺': '129 mEq/L, 2 h después del bolo', Clínica: 'ceden los síntomas', Diuresis: '250 mL/h' }, nuevo: ['Na⁺', 'Clínica', 'Diuresis'],
        estado: { paciente: 'mujer', na0: 124, bolos3: 1, periodo3: '2h', fijo: { na: 129 }, infusiones: [{ f: 'glucosado', ml: 1500 }, { f: 'ringer', ml: 1500 }] }, lupa: 'neurona', mirar: 'lectura',
        pregunta: { id: 'w3-4', tipo: 'error', fuente: 'mr-hiponatremia-tto#mr-sdo · #mr-sobrecorreccion · #mr-tabla-35-4 · mr-hiponatremia-dx#mr-estres-adh',
          enunciado: 'Plan del R1 de guardia.',
          frases: [
            { t: 'Ha subido 5 en 2 h: estamos en el límite; no repetimos el bolo.', mal: false },
            { t: 'Objetivo: Na⁺ 140 hoy, para que no repita.', mal: true, c: 'Límites: <span class="hl-rojo">≤10 el primer día</span> y Na⁺ final ≤130. Llegar a 140 hoy sería sobrecorregir y arriesgar la desmielinización.' },
            { t: 'Diuresis acuosa >100 mL/h: valoramos desmopresina 2 µg SC cada 12 h, con restricción hídrica.', mal: false },
            { t: 'Si mañana está bien, ya no hay riesgo de desmielinización.', mal: true, c: 'La desmielinización tiene un <span class="hl-rojo">curso bifásico</span>: mejora y después empeora.' },
            { t: 'Cambiamos los sueros hipotónicos.', mal: false }],
          explicacion: 'Un bolo sube hasta 2: el resto lo pone la <span class="hl-rojo">diuresis acuosa</span>, que concentra el sodio (sobrecorrección, hasta en un 25 %).',
          nota: '<b>Nota de fuentes (desmopresina).</b> La Tabla 35.4 la indica si la diuresis sube de golpe (p. ej., >100 mL/h) con salino hipertónico, pero <b>no la aconseja si la hiponatremia se debe a una liberación no regulada de ADH</b>. Y el texto (p. 11) pone el estrés fisiológico entre las causas de liberación no osmótica de ADH. El libro no concilia las dos cosas; aquí no se elige. <span class="agv-org" data-org="ficha · mr-tabla-35-4 · mr-estres-adh">ficha</span>' } },
      { momento: 'Día 2', datos: { Familia: 'su hija: «¿Le falta sal?»' }, nuevo: ['Familia'],
        estado: { paciente: 'mujer', na0: 129 }, lupa: 'neurona',
        pregunta: { id: 'w3-5', tipo: 'destapa', fuente: 'mr-hiponatremia-tto#mr-agua-no-sodio · mr-hiponatremia-tto#mr-encefalopatia-hipona',
          enunciado: '¿Qué le explicas a la hija? Son dos cosas.',
          puntos: ['La hiponatremia es <span class="hl-rojo">exceso de agua</span>, no falta de sodio.', 'El plasma hipotónico <span class="hl-azul">mete agua en el cerebro</span>: edema cerebral.'],
          explicacion: 'Por eso la neurona se hinchaba con el Na⁺ bajo.' } }
    ],
    lleva: ['Posoperatorio y sueros hipotónicos: riesgo de hiponatremia (ADH por estrés).',
      'Los síntomas, no la cifra, deciden el salino al 3 %: bolos de 2 mL/kg o 150 mL.',
      'Límites: ≤5 en 2 h, ≤10 en 5 h y el primer día, final ≤130. Si se dispara la diuresis, valorar desmopresina (el libro no la aconseja con ADH no regulada y no lo concilia con el estrés).'],
    volver: { nombre: 'Hiponatremia: encefalopatía y salino al 3 %', ficha: 'mr-hiponatremia-tto (Marino cap. 35)', estado: { paciente: 'mujer', na0: 124, adh: true, bolos3: 1, periodo3: '2h' }, pestana: 'sueros', fluido: 'salino3', lupa: 'neurona' } },

  CASO_TERESA
];


// ---------- Estados con nombre ----------
// Los abren los botones de las fichas, los menús y el buscador con el enlace
// cruzado de siempre (data-especialidad="libros" data-view="aguaViva"
// data-agua-viva="<estado>"). Son estados de la maqueta (sus conceptos y sus
// preguntas): ninguna cifra nueva. La vuelta de cada caso (`volver`) usa los mismos campos. `pestana` y `fluido` dejan el dock en ese
// tema; `lupa` abre la lupa.
export const ESTADOS_ANCLA = {
  inicio: { estado: {}, pestana: 'sueros' },
  salino: { estado: { infusiones: [{ f: 'salino', ml: 1000 }] }, pestana: 'sueros', fluido: 'salino' },
  glucosado: { estado: { infusiones: [{ f: 'glucosado', ml: 1000 }] }, pestana: 'sueros', fluido: 'glucosado' },
  ringer: { estado: { infusiones: [{ f: 'ringer', ml: 1000 }] }, pestana: 'sueros', fluido: 'ringer' },
  albumina5: { estado: { infusiones: [{ f: 'alb5', ml: 1000 }] }, pestana: 'sueros', fluido: 'alb5' },
  albumina25: { estado: { infusiones: [{ f: 'alb25', ml: 100 }] }, pestana: 'sueros', fluido: 'alb25' },
  hipertonico: { estado: { infusiones: [{ f: 'hiper', ml: 250 }] }, pestana: 'sueros', fluido: 'hiper' },
  salino3: { estado: { na0: 120, adh: true, bolos3: 1 }, pestana: 'sueros', fluido: 'salino3', lupa: 'neurona' },
  hemorragia: { estado: { hemorragia: 20, reloj: '1h' }, pestana: 'sangrado' },
  reanimacion: { estado: { hemorragia: 20, reloj: '1h', infusiones: [{ f: 'ringer', ml: 1800 }] }, pestana: 'sangrado', fluido: 'ringer' },
  hiponatremia: { estado: { adh: true, na0: 122 }, pestana: 'sodio', lupa: 'neurona' },
  hipernatremia: { estado: { na0: 160, reloj: 'dias' }, pestana: 'sodio', lupa: 'neurona' },
  osmolalidad: { estado: { urea: true }, pestana: 'solutos', lupa: 'orilla' },
  hiperglucemia: { estado: { glucosa: 600 }, pestana: 'solutos', lupa: 'neurona' },
  // Nicolás (dato del caso): Na⁺ 156, orina 110 mOsm/kg y 400 mL/h; Posm 322 sale de la Ec. 35.3 con glucosa 90 y BUN 14
  di: { estado: { fijo: { na: 156 }, orina: { tipo: 'central', osm: 110, mlh: 400, vaso: false } }, pestana: 'sodio', lupa: 'neurona' },
  pseudo: { estado: { na0: 140, pseudo: true, fijo: { na: 128 } }, pestana: 'sodio', lupa: 'tubo' },
};

// ---------- La explicación guiada de cada estado con nombre ----------
// (REGLAS §7.10; core/explicacion-guiada.js): 3-5 pasos cortos. Cada paso: { t, mirar (el anillo del estuario: rio,
// marisma, mar, herida, compuertas, lectura), resalta (un marco: un mareógrafo, la lectura o la lupa), e (cómo
// cambia el estado en ese paso), lupa, cita (core/citas.js: ficha, párrafo y página del PDF), org }. Todo sale de las
// fichas de Marino: caps. 10-11 (fluidoterapia), 15 (shock hemorrágico) y 35 (sodio y osmolalidad).
const PDF_F = 'docs/marino-2024-fluidoterapia-caps10-11.pdf', PDF_E = 'docs/marino-2024-electrolitos-caps35-38.pdf', PDF_S = 'docs/marino-2024-shock-caps14-17.pdf';
const CR = (id, pag) => ({ libro: 'Marino, cap. 10', ficha: 'mar-cristaloides', id, pag, pdf: PDF_F });
const CO = (id, pag) => ({ libro: 'Marino, cap. 10', ficha: 'mar-coloides', id, pag, pdf: PDF_F });
const RV = (id, pag) => ({ libro: 'Marino, cap. 11', ficha: 'mar-retorno-venoso', id, pag, pdf: PDF_F });
const HC = (id, pag) => ({ libro: 'Marino, cap. 15', ficha: 'mc-hemorragico-clasificacion', id, pag, pdf: PDF_S });
const HF = (id, pag) => ({ libro: 'Marino, cap. 15', ficha: 'mc-hemorragico-fluidos', id, pag, pdf: PDF_S });
const OS = (id, pag) => ({ libro: 'Marino, cap. 35', ficha: 'mr-osmolalidad', id, pag, pdf: PDF_E });
const HD = (id, pag) => ({ libro: 'Marino, cap. 35', ficha: 'mr-hiponatremia-dx', id, pag, pdf: PDF_E });
const HT = (id, pag) => ({ libro: 'Marino, cap. 35', ficha: 'mr-hiponatremia-tto', id, pag, pdf: PDF_E });
const HP = (id, pag) => ({ libro: 'Marino, cap. 35', ficha: 'mr-hipernatremia', id, pag, pdf: PDF_E });
const MAREA = k => ['#agv-tot-' + k, '#agv-dl-' + k];
export const NOMBRE_ESTADO = { inicio: 'El agua del cuerpo', salino: 'Salino 0,9 %', glucosado: 'Glucosado 5 %', ringer: 'Ringer lactato', albumina5: 'Albúmina 5 %',
  albumina25: 'Albúmina 25 %', hipertonico: 'Salino 7,5 %', salino3: 'Salino 3 %: un bolo', hemorragia: 'Hemorragia del 20 %', reanimacion: 'Reanimación con Ringer',
  hiponatremia: 'Hiponatremia', hipernatremia: 'Hipernatremia', osmolalidad: 'Osmolalidad y urea', hiperglucemia: 'Hiperglucemia', di: 'Diabetes insípida', pseudo: 'Pseudohiponatremia' };
export const GUIAS = {
  inicio: [
    { t: 'Varón de 75 kg: el agua corporal es 0,6 × su peso magro, <span class="hl">45 L</span>.', mirar: 'mar', cita: CR('mar-tabla-10-1', 3) },
    { t: 'Dos tercios están dentro de las células: el mar, 29 L.', mirar: 'mar', resalta: MAREA('mar'), cita: CR('mar-tabla-10-1', 3) },
    { t: 'El extracelular, 16 L: 13 en el intersticio (la marisma) y solo 3 en el plasma (el río).', mirar: 'marisma', resalta: [MAREA('marisma'), MAREA('rio')].flat(), cita: CR('mar-tabla-10-1', 3) },
    { t: 'El plasma es solo el 6-7 % del agua corporal, y es <span class="hl-rojo">lo que la fluidoterapia quiere sostener</span>.', mirar: 'rio', resalta: MAREA('rio'), cita: CR('mar-plasma-fluidoterapia', 3) },
  ],
  salino: [
    { t: '1 L de salino al 0,9 %: el sodio se reparte por todo el extracelular, y el plasma es solo el 20 % de él.', mirar: 'rio', cita: CR('mar-salino', 5) },
    { t: 'Solo <span class="hl-rojo">275 mL se quedan en el río</span>; 825 mL van a la marisma (Fig. 10.1).', resalta: [MAREA('rio'), MAREA('marisma')].flat(), cita: [CR('mar-fig-10-1', 6), CR('mar-salino', 5)] },
    { t: 'El total (1.100 mL) supera lo infundido: es algo hipertónico (308 mOsm/L) y saca agua de las células.', mirar: 'mar', resalta: MAREA('mar'), cita: CR('mar-salino', 5), org: 'los 100 mL del mar: la resta' },
    { t: 'Lo que más importa es el cloro: 154 frente a 103. A 30 mL/kg/h el pH bajó de 7,41 a 7,28 con salino; con Ringer, no cambió (Fig. 10.2).', mirar: 'rio', cita: [CR('mar-salino', 6), CR('mar-tabla-10-2', 5)] },
  ],
  glucosado: [
    { t: 'Glucosado al 5 %: 278 mOsm/L, cerca del plasma. Pero la glucosa entra en las células y se metaboliza.', mirar: 'compuertas', cita: CR('mar-glucosado-volumen', 11) },
    { t: 'El agua la sigue: <span class="hl-rojo">dos tercios acaban dentro de las células</span> (edema celular).', mirar: 'mar', resalta: MAREA('mar'), cita: CR('mar-glucosado-volumen', 11) },
    { t: 'Fuera quedan unos 350 mL; al río llegan solo 100 (Fig. 10.1).', resalta: [MAREA('rio'), MAREA('marisma')].flat(), cita: [CR('mar-glucosado-volumen', 11), CR('mar-fig-10-1', 6)] },
    { t: 'Hasta un 90 % de los pacientes de UCI tiene hiperglucemia en algún momento: parece razonable evitar los sueros con dextrosa.', mirar: 'rio', cita: CR('mar-glucosado-hiperglucemia', 12) },
  ],
  ringer: [
    { t: 'Ringer lactato: Na⁺ 130, Cl⁻ 109, 273 mOsm/L. Su cloro se parece al del plasma (103): no da acidosis hiperclorémica.', mirar: 'rio', cita: [CR('mar-tabla-10-2', 5), CR('mar-ringer', 7)] },
    { t: 'Como todo cristaloide se reparte por el extracelular: <span class="hl">el 20 % queda en el río</span> y el 80 % va a la marisma.', resalta: [MAREA('rio'), MAREA('marisma')].flat(), cita: RV('mar-cristaloide-reparto', 26) },
    { t: 'Su efecto principal es expandir el intersticio, no el plasma, y eso favorece el edema.', mirar: 'marisma', cita: RV('mar-cristaloide-reparto', 26) },
    { t: 'Es algo hipotónico: con el estrés, que libera ADH, los sueros hipotónicos como el Ringer añaden riesgo de hiponatremia.', e: { adh: true }, mirar: 'rio', cita: HD('mr-estres-adh', 12) },
  ],
  albumina5: [
    { t: 'Albúmina al 5 %: un coloide. Sus moléculas grandes no cruzan la orilla y retienen agua en el río: presión oncótica.', mirar: 'rio', cita: [CO('mar-coloide-definicion', 13), CR('mar-oncotica', 3)] },
    { t: 'De 1 L, <span class="hl">700 mL se quedan en el río</span> y 300 van a la marisma (Fig. 10.1).', resalta: [MAREA('rio'), MAREA('marisma')].flat(), cita: [CR('mar-fig-10-1', 6), CO('mar-coloide-definicion', 13)] },
    { t: 'Unas 3 veces más eficaz que el salino (275 mL): el mismo aumento de plasma con un 30 % del volumen de cristaloide.', mirar: 'rio', cita: CO('mar-coloide-definicion', 13) },
    { t: 'Su efecto empieza a irse a las 6 h y suele perderse a las 12 h; la Tabla 10.3 le da 24 h. <span class="hl-purpura">Las fuentes discrepan</span>.', mirar: 'rio', cita: [CO('mar-albumina', 13), CO('mar-nota-albumina-duracion', 13)], org: 'las fuentes discrepan' },
  ],
  albumina25: [
    { t: 'Albúmina al 25 %: hiperoncótica, 70 mmHg, 2,5 veces la presión oncótica del plasma.', mirar: 'rio', cita: [CO('mar-oncotica-expansion', 13), CO('mar-tabla-10-3', 13)] },
    { t: '100 mL hacen crecer el río <span class="hl">300-400 mL</span>: lo que falta lo saca de la marisma.', resalta: [MAREA('rio'), MAREA('marisma')].flat(), cita: [CO('mar-tabla-10-3', 13), CO('mar-albumina', 14)], org: 'el dibujo usa ×3,5: ilustrativo' },
    { t: '<span class="hl-rojo">Mueve líquido, no repone pérdidas</span>: no es un fluido de reanimación.', mirar: 'marisma', cita: CO('mar-albumina', 14) },
    { t: 'Se usa para subir rápido el plasma en pacientes con edemas, sobre todo por hipoalbuminemia.', mirar: 'rio', cita: CO('mar-albumina', 14) },
  ],
  hipertonico: [
    { t: 'Salino al 7,5 %: 2.567 mOsm/L, nueve veces el plasma.', mirar: 'rio', cita: CR('mar-hipertonico', 9) },
    { t: '250 mL añaden 1.235 mL al extracelular, unas 5 veces lo infundido, <span class="hl">sacando agua de las células</span>.', mirar: 'mar', resalta: MAREA('mar'), cita: CR('mar-hipertonico', 9), org: 'los −985 mL del mar: la resta' },
    { t: 'Al río, 535 mL; a la marisma, 700 (Fig. 10.1).', resalta: [MAREA('rio'), MAREA('marisma')].flat(), cita: CR('mar-fig-10-1', 6) },
    { t: 'En animales con hemorragia mantuvo el gasto con 1/5 del volumen de salino isotónico, pero en el trauma no ha mostrado mejor supervivencia.', mirar: 'rio', cita: CR('mar-hipertonico', 9) },
  ],
  salino3: [
    { t: 'Hiponatremia con síntomas: el plasma hipotónico mete agua en el cerebro. <span class="hl-rojo">Edema cerebral</span>, una amenaza vital inmediata.', resalta: '#agv-lupa', cita: HT('mr-encefalopatia-hipona', 12) },
    { t: 'Pide salino hipertónico: NaCl al 3 %, Na⁺ 513 mEq/L. Bolos de 2 mL/kg (o 150 mL), repetidos cada pocas horas hasta que ceden los síntomas.', mirar: 'na', cita: HT('mr-tabla-35-3', 13) },
    { t: 'Cada bolo puede subir el Na⁺ hasta 2 mEq/L: de 120 a 122.', resalta: '#agv-lectura', cita: HT('mr-sal3-bolo', 13) },
    { t: 'Sin pasar los límites: no más de 5 mEq/L en 2 h ni 10 en 5 h, ni 10 el primer día; el Na⁺ final, ≤130. Corregir deprisa daña la mielina.', resalta: '#agv-lupa', cita: [HT('mr-tabla-35-3', 13), HT('mr-sdo', '13-14')] },
  ],
  hemorragia: [
    { t: 'Varón de 75 kg: volemia de 66 mL/kg de peso magro, unos 5 L.', mirar: 'rio', cita: HC('mc-volemia', 21) },
    { t: 'Pierde el 20 %, unos 990 mL: <span class="hl">clase II</span> (15-30 %). Fase compensada: la PA se mantiene por vasoconstricción; se reanima con cristaloides.', mirar: 'herida', cita: [HC('mc-tabla-15-1', 22), HC('mc-clase-2', 23)], org: '990 mL: calculado' },
    { t: 'A la hora, <span class="hl-rojo">el Hto sigue en 45 %</span>: se pierde sangre entera, plasma y hematíes en proporción.', mirar: 'hto', cita: [HC('mc-hto-trampa', 23), HC('mc-fig-15-1', 24)] },
    { t: 'Después, la caída de PA moviliza agua de la marisma al río (relleno transcapilar, hasta 1 L) y el Hto baja.', e: { reloj: '8-12h' }, mirar: 'marisma', cita: [HC('mc-compensacion', 21), HC('mc-hto-trampa', 23)], org: 'el ritmo: ilustrativo' },
    { t: 'En las primeras horas, la Hb y el Hto reflejan la reanimación, no la magnitud de la pérdida.', mirar: 'hto', cita: HC('mc-hto-reanimacion', 23) },
  ],
  reanimacion: [
    { t: 'Tabla 15.4: plasma de 40 mL/kg en el varón, 3 L. Una pérdida del 20 % deja un déficit de 600 mL.', mirar: 'rio', cita: HF('mc-tabla-15-4', 29) },
    { t: 'Con cristaloide, el déficit × 3: <span class="hl">1,8 L de Ringer</span>.', resalta: MAREA('rio'), cita: HF('mc-tabla-15-4', 29) },
    { t: 'El ×3 es una estimación conservadora: solo el 20-25 % se queda en el plasma; el resto inunda la marisma.', resalta: MAREA('marisma'), cita: [HF('mc-tabla-15-4-nota', 29), RV('mar-cristaloide-reparto', 26)] },
    { t: 'El cap. 11 hace la cuenta con el 20 % que se queda en el plasma (450/0,2 = 2,25 L: ×5); el cap. 15 usa ×3. El cap. 15 lo explica: llama al ×3 «estimación conservadora» y parte del mismo reparto (20-25 % en el plasma).', mirar: 'marisma', cita: [RV('mar-deficit-calc', 26), HF('mc-tabla-15-4-nota', 29)] },
    { t: 'Y el Hto cae: el cristaloide expande el plasma pero no los hematíes, y lo diluye.', mirar: 'hto', cita: HC('mc-hto-fluido', 23) },
  ],
  hiponatremia: [
    { t: 'Na⁺ 122: plasma hipotónico. El agua va del lado con menos actividad osmótica al de más: <span class="hl-rojo">entra en las células</span>.', mirar: 'mar', cita: [OS('mr-osm-efectiva', 2), OS('mr-osm-resumen', 2)] },
    { t: 'La neurona se hincha: edema cerebral difuso con hipertensión intracraneal.', resalta: '#agv-lupa', cita: HT('mr-encefalopatia-hipona', 12), org: 'cuánto se hincha: ilustrativo' },
    { t: 'Aquí, por estrés: se libera ADH y el riñón retiene agua. Retención de agua con poca pérdida de sodio.', resalta: '#agv-lectura', cita: [HD('mr-estres-adh', 11), HD('mr-hipona-normovolemica', 11)] },
    { t: 'Na⁺ <135: probablemente la alteración electrolítica más frecuente, en el 30-40 % de los hospitalizados.', resalta: '#agv-lectura', cita: HD('mr-hipona-def', 8) },
  ],
  hipernatremia: [
    { t: 'Na⁺ 160: la hipertonía <span class="hl-rojo">saca agua de las células</span> y las encoge, sobre todo en el cerebro.', resalta: '#agv-lupa', cita: HP('mr-hiperna-cerebro', 5) },
    { t: 'Las neuronas empiezan a recuperar volumen a las 9 h acumulando osmolitos, y en 48 h pueden haberlo recuperado del todo.', resalta: '#agv-lupa', cita: HP('mr-hiperna-cerebro', 5) },
    { t: 'Por eso se teme corregir deprisa: edema cerebral. El ritmo óptimo no se conoce; lo tradicional, ≤0,5 mEq/L/h, aunque se han usado ritmos mayores sin edema cerebral.', resalta: '#agv-lectura', cita: HP('mr-hiperna-ritmo', 6) },
    { t: 'Se recomienda glucosado al 5 % o agua por la sonda. El salino isotónico corrige la hipotensión, no la hipernatremia.', mirar: 'mar', cita: HP('mr-hiperna-tto', '5-6') },
    { t: 'Como la pérdida de líquido hipotónico también se lleva sodio, al autor le parece más adecuado el salino al 0,45 % que el glucosado.', mirar: 'mar', cita: HP('mr-hiperna-tto', 6), org: 'opinión del autor' },
  ],
  osmolalidad: [
    { t: 'Osmolalidad calculada: 2 × Na + glucosa/18 + BUN/2,8. Con valores normales, 290.', resalta: '#agv-lectura', cita: OS('mr-osm-calculada', 4) },
    { t: 'Con la urea alta (BUN 84, un ejemplo) sube a 315.', resalta: '#agv-lectura', cita: OS('mr-osm-calculada', 4), org: 'BUN 84: ilustrativo' },
    { t: 'Pero la urea cruza las membranas: la uremia es hiperosmótica, <span class="hl-azul">no hipertónica</span>. La efectiva (sin la urea) sigue en 285.', resalta: '#agv-lupa', cita: OS('mr-osm-efectiva-calc', 4) },
    { t: 'Si la membrana deja pasar el soluto, los dos lados acaban con la misma actividad osmótica: solo los solutos que no cruzan (la tonicidad) mueven agua.', resalta: '#agv-lupa', cita: [OS('mr-osm-relativa', 2), OS('mr-osm-efectiva', 2)] },
  ],
  hiperglucemia: [
    { t: 'Glucosa 600: cuando no entra con facilidad en las células, <span class="hl">les saca agua</span>.', mirar: 'mar', cita: HD('mr-hiperglucemia-na', 9) },
    { t: 'Ese agua diluye el sodio: 2,4 mEq/L menos por cada 100 mg/dL de glucosa. El Na⁺ medido baja a 128.', resalta: '#agv-lectura', cita: HD('mr-hiperglucemia-na', 9) },
    { t: 'Na corregido = Na medido + 2,4 × (glucosa − 100)/100: con 600, <span class="hl-azul">140</span>. El ejemplo de la ficha: 130 con 600 → 142.', resalta: '#agv-lectura', cita: HD('mr-hiperglucemia-na', 9) },
  ],
  di: [
    { t: 'Diabetes insípida: el riñón pierde la acción de la ADH y elimina <span class="hl-rojo">una orina casi sin solutos</span>. Aquí, 400 mL/h con osmolalidad de 110 (cifras del caso).', mirar: 'orina', cita: HP('mr-di-dx', 7) },
    { t: 'Es agua libre que se va: el Na⁺ sube (156) y la osmolalidad del plasma, 322. La orina diluida con plasma hipertónico es la marca de la DI.', resalta: '#agv-lectura', cita: [HP('mr-di-dx', 7), HP('mr-hiperna-normo', 6)], org: 'Na⁺ y Posm: dato del caso' },
    { t: 'El plasma hipertónico saca agua de la neurona y la encoge.', resalta: '#agv-lupa', cita: HP('mr-hiperna-cerebro', 5) },
    { t: 'Para distinguir la central de la nefrogénica: osmolalidad de orina <200 en la central y 200-500 en la nefrogénica; con vasopresina, sube al menos un 50 % solo en la central.', e: { orina: { tipo: 'central', osm: 110, mlh: 400, vaso: true } }, resalta: '#agv-lectura', cita: HP('mr-di-dx', 7) },
    { t: 'El primer paso del diagnóstico es la restricción hídrica completa: si la osmolalidad urinaria no sube más de 30 en unas horas, es DI. En la central se repone la acción con desmopresina, 1 μg SC o 2 μg IV cada 12 h.', mirar: 'orina', cita: [HP('mr-di-dx', 7), HP('mr-desmopresina-di', 7)] },
  ],
  pseudo: [
    { t: 'El plasma tiene una fase acuosa, con el sodio, y otra <span class="hl-azul">no acuosa</span>, con lípidos y proteínas. El laboratorio mide las dos; como el plasma es un 95 % agua, normalmente da casi igual.', lupa: 'tubo', cita: HD('mr-pseudohipona', 8) },
    { t: 'Con proteínas de <span class="hl-rojo">12 g/dL</span> (normal 5,5-8) o triglicéridos de <span class="hl-rojo">1.500 mg/dL</span> (normal 25-175), la fase no acuosa crece: el Na⁺ medido baja y el del agua no.', lupa: 'tubo', resalta: '#agv-lupa', cita: HD('mr-pseudohipona', 8), org: 'el valor medido de 128 es un dato del caso: la ficha no dice cuánto baja' },
    { t: 'Se descubre midiendo la osmolalidad: <span class="hl">normal (285-295)</span> en la pseudohiponatremia y baja (<275) en la hiponatremia verdadera.', lupa: 'tubo', resalta: '#agv-lectura', cita: HD('mr-pseudo-dx', 9) },
    { t: 'La neurona no cambia: el sodio del agua plasmática es el mismo y el agua no se mueve entre el plasma y las células.', lupa: 'neurona', resalta: '#agv-lupa', cita: [HD('mr-pseudohipona', 8), HD('mr-pseudo-dx', 9)] },
    { t: 'Aparece con hiperproteinemia (mieloma, gammapatías, inmunoglobulinas) o hipertrigliceridemia (pancreatitis, cetoacidosis diabética, alcohol): hay que pensar en ella antes de tratar un Na⁺ bajo.', lupa: 'tubo', cita: HD('mr-tabla-35-2', 8) },
  ],
};
// Cada estado con nombre: su nombre y sus fuentes como lista (REGLAS §7.11), sin repetir, en el orden de la
// explicación. Otro libro puede añadir las suyas (ESTADOS_ANCLA[k].fuentes.push) sin rehacer el modelo; nunca se funden.
for (const [k, s] of Object.entries(ESTADOS_ANCLA)) {
  s.n = NOMBRE_ESTADO[k];
  const vistos = new Set();
  s.fuentes = (GUIAS[k] || []).flatMap(p => [].concat(p.cita || []))
    .filter(c => { const id = `${c.ficha}#${c.id}`; if (vistos.has(id)) return false; vistos.add(id); return true; });
}
