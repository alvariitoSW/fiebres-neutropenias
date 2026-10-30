// Los datos de la ventilación mecánica, una sola vez: los usan el motor del pulmón (pulmon.mjs), la calculadora de la
// página y las pruebas. Sin DOM. Origen de cada cifra a su lado (ficha = Marino 2024; LA2 = El libro azul, sección IV, parte 2).

// Peso corporal predicho (PBW): Tabla 24.5 (cap. 24 p. 48) = Tabla 27.1 (cap. 27 p. 14). Varones 50 + 2,3 × (pulgadas − 60); mujeres 45,5 + …
export const PBW = { varon: 50, mujer: 45.5, porPulgada: 2.3, base: 60, cmPorPulgada: 2.54, origen: 'ficha · Tabla 27.1 (cap. 27 p. 14)' };
export function pbw(tallaCm, sexo) {
  const pulg = tallaCm / PBW.cmPorPulgada;
  return Math.round(((sexo === 'm' ? PBW.mujer : PBW.varon) + PBW.porPulgada * (pulg - PBW.base)) * 10) / 10;
}

// Compliance estática (cap. 27 p. 6-7): Cstat = Vt corregido / (meseta − PEEP); normal 50-80; en el SDRA, <25; la tubuladura se queda con 3 mL por cmH₂O
export const C_TUBULADURA = 3;
export const CSTAT = { normalMin: 50, normalMax: 80, bajo: 25, origen: 'ficha · cap. 27 p. 6-7' };
// La presión de conducción es meseta − PEEP. Marino no da un objetivo numérico: la calculadora no pone ninguno (ver nota «dp-sin-objetivo»)
export const DP = { objetivo: null, origen: 'ficha: sin objetivo (cap. 27 p. 6-7)' };
export const VT_KG = { aviso: 8, min: 4, max: 12 };   // Tabla 24.5 (p. 48): 8 → 6 → 4; 12 = brazo tradicional de ARDS Network 2000

// Constante de tiempo (LA2 pdf 50-51 = pp. 514-515): τ = distensibilidad estática × resistencia; en una τ el alvéolo se llena o vacía un 63,2 %;
// 4-5 τ de espiración eliminan la auto-PEEP. El par R 20 / C 60 da 1,2 s: es una cifra del modelo (ilustrativa), no de la fuente.
export const TAU = { fraccion: 63.2, constantesAutoPeep: [4, 5], parR: 20, parC: 60, origen: 'LA2 pdf 50-51 (pp. 514-515)' };
export const tau = (r, c) => r * c / 1000;   // s (R en cmH₂O/(L/s), C en mL/cmH₂O)

// Presión de soporte: disparo por presión negativa de 2 a 3 cmH₂O (cap. 27 p. 8), ciclado al 25 % del flujo pico (cap. 26 p. 78 del PDF), PSV de 10 en IMV (cap. 27 p. 10)
export const PSV = { disparoMin: 2, disparoMax: 3, ciclado: 0.25, psTipica: 10, origen: 'ficha · cap. 27 p. 8 (disparo) y cap. 26, PDF p. 78 (ciclado)' };
export const T_DISPARO = 0.1;   // s que tarda el esfuerzo en llegar al umbral: ilustrativo
export const SEMILLA = 20261030; // semilla fija de la variación entre respiraciones (reproducible)

// Calculadora: PBW, Vt por kg, Cstat y ΔP. Un campo vacío es null (nunca 0). Devuelve las cifras y los avisos.
const num = (v) => (v == null || v === '' || !isFinite(+v) ? null : +v);
const clamp = (v, a, b) => (v == null ? null : Math.min(b, Math.max(a, v)));
export function calcVentilacion({ talla, sexo, vt, meseta, peep }) {
  const t = clamp(num(talla), 120, 210), v = clamp(num(vt), 100, 1000), ms = clamp(num(meseta), 5, 60), pe = clamp(num(peep), 0, 30);
  const out = { pbw: t == null ? null : pbw(t, sexo), vtkg: null, dp: null, cstat: null, avisos: [] };
  if (out.pbw != null && v != null) {
    out.vtkg = Math.round(v / out.pbw * 10) / 10;
    if (out.vtkg > VT_KG.max) out.avisos.push('Combinación no fisiológica: más de 12 mL/kg de peso ideal.');
    else if (out.vtkg > VT_KG.aviso) out.avisos.push('Por encima de 8 mL/kg de peso ideal: el protocolo protector parte de 8 y baja hasta 4 (Tabla 24.5).');
    else if (out.vtkg < VT_KG.min) out.avisos.push('Por debajo de 4 mL/kg: el mínimo del protocolo.');
  }
  if (ms != null && pe != null) {
    if (Math.round(ms * 10) <= Math.round(pe * 10)) out.avisos.push('Combinación no fisiológica: la meseta no puede ser menor o igual que la PEEP.');
    else {
      out.dp = Math.round((ms - pe) * 10) / 10;
      if (v != null) out.cstat = Math.round(Math.max(0, v - C_TUBULADURA * out.dp) / out.dp * 10) / 10;
      if (Math.round(ms) > 30) out.avisos.push('Meseta por encima de 30 cmH₂O: riesgo de rotura alveolar (cap. 27 p. 4).');
    }
  }
  return out;
}
