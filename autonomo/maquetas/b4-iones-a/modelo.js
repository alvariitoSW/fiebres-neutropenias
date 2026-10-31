// El modelo de los cuatro iones: UNA sola verdad de la que salen las partículas, el tubo, las curvas y el ECG.
// Datos puros, sin DOM. Cada constante lleva su origen: F = ficha (Marino 2024, cap. 35-38; página del PDF E),
// G = fisiología general, I = ilustrativo (la dirección sale de la fuente; la magnitud, no).
export const E_PDF = 'docs/marino-2024-electrolitos-caps35-38.pdf';
export const N = {
  k: 4.0,        // K⁺ sérico normal; la ficha lo toma como ejemplo (E p. 19)
  kTot: 3500,    // 50 mEq/kg × 70 kg (E p. 18)
  kEcf: 70,      // K⁺ extracelular, 2 % (E p. 18)
  mg: 1.7,       // mEq/L: mitad del rango 1,4-2,0 (E p. 33, Tabla 37.2 → 1,7 mg/dL = 1,4 mEq/L; aquí valor central ilustrativo)
  ca: 1.2,       // Ca iónico mmol/L (1,15-1,25, E p. 43, Tabla 38.1)
  alb: 4.0,      // g/dL (G)
  ph: 7.40,
  p: 3.5,        // mg/dL (2,5-5,0, E p. 43)
};
export const PEND = { def: 300, exc: 150 };   // mEq por cada mEq/L: déficit 200-400, exceso 100-200 (E p. 19); punto medio, ilustrativo
export const VEC_K = 17.5;                     // mEq que mueven 1 mEq/L del K⁺ sérico (70 mEq / 4 mEq/L; E p. 18)
export const MG_POR_G = 8;                     // mEq de Mg elemental por g de MgSO₄·7H₂O (E p. 36)
export const CA_MG = { gluconato: 9, cloruro: 27 };   // mg de calcio elemental por mL (E p. 27 y 45)

export function nuevo(o = {}) {
  return { nombre: 'Sano', kDef: 0, kShift: 0, kPico: 0, mgDef: 0, mgShift: 0, mgPico: 0, p0: N.p, pShift: 0,
    alb: N.alb, ph: N.ph, cit: 0, caPico: 0, caEcg: 0, bolo10: 0, rate: 0, via: 'periferica', furoH: 0, hemolisis: false,
    horas: 0, orina: { k: 0, mg: 0 }, parada: '', ...o };
}
export const kSer = s => N.k + (s.kDef < 0 ? s.kDef / PEND.def : s.kDef / PEND.exc) - s.kShift / VEC_K + s.kPico / VEC_K;
export const kMedido = s => kSer(s) + (s.hemolisis ? 0.8 : 0);     // puño y vacío: sube el tubo, no el paciente (E p. 23-24; cuánto: I)
export const mgSer = s => Math.max(0, N.mg - s.mgDef / 150 - s.mgShift + s.mgPico);
export function caFr(s) {
  const ion = Math.max(0.05, N.ca - 0.05 * ((s.ph - N.ph) / 0.1) - 0.045 * s.cit + s.caPico);   // alcalosis la baja (E p. 44); 0,05 por 0,1 de pH: G; 0,045 por unidad: I, ajustado a los 0,84 del caso de Valentín
  const alb = 0.96 * s.alb / N.alb, comp = 0.24;                                           // mitad iónica, 80 % del resto a la albúmina, 20 % a aniones (E p. 42)
  return { ion, alb, comp, total: ion + alb + comp };
}
export const mgdl = mmol => mmol * 4;   // factor 0,25 (E p. 43, Tabla 38.1)
export const pSer = s => Math.max(0.1, s.p0 - s.pShift);
export const kTotal = s => N.kTot + s.kDef;
// Fig. 36.2: K⁺ sérico frente a K⁺ total (la curva, con las dos pendientes del texto)
export const curvaK = def => N.k + (def < 0 ? def / PEND.def : def / PEND.exc);

// ---------- Mandos ----------
export function realimentar(s) { s.kShift += 12; s.pShift += 0.3; s.mgShift += 0.12; }       // insulina + glucosa (E p. 20-21, 34, 49): entran en la célula; magnitud: I
export function furosemida(s) { s.furoH = 6; }                                                // 6 h de efecto: I
export function setClk(s, rate, via) { s.rate = rate; s.via = via; }
export function mgso4(s, g) { const m = g * MG_POR_G; s.mgDef = Math.max(0, s.mgDef - 0.5 * m); s.mgPico += m / 17.5; s.orina.mg += 0.5 * m; }   // el 50 % a la orina (E p. 37); pico que cae a los 15 min (E p. 37-38)
export function fosfatoK(s, mmol) { s.p0 += mmol * 0.03; s.kDef += mmol * 1.43; }                // 1 mmol de P ≈ 0,03 mg/dL (I); K⁺: 4,3 mEq por 3 mmol (E p. 51; E p. 23 dice 4,5)
export function calcioIV(s, forma, ml) {
  const mg = CA_MG[forma] * ml; s.caPico += mg * 0.0017; s.caEcg = 1; s.bolo10 += mg; return mg;   // 1,7 µmol/L por mg: I
}
export function unidad(s) { s.cit += 1; s.kPico += 2.5; }                                       // 2-3 mEq de K⁺ por unidad (E p. 24-25)
export function pasar(s, h) {
  const m = x => 0.5 ** (h / x);
  s.horas += h; s.kShift *= m(4); s.pShift *= m(4); s.mgShift *= m(4); s.mgPico *= m(0.25); s.caPico *= m(0.4); s.caEcg *= m(0.7);
  s.cit *= m(1); s.kPico *= m(2); if (h >= 0.16) s.bolo10 = 0;
  s.kDef += s.rate * h;                    // la perfusión de ClK (E p. 23)
  const f = Math.min(h, s.furoH); s.furoH -= f; s.kDef -= 8 * f; s.mgDef += 2 * f; s.orina.k += 8 * f; s.orina.mg += 2 * f;   // furosemida: K⁺ y Mg²⁺ a la orina (E p. 33-34); magnitud: I
}
// ---------- Topes (cada uno con su origen en E) ----------
export const TOPES = {
  clk: { max: 20, txt: 'ClK >20 mEq/h por la cava superior: riesgo de asistolia', pag: 23 },
  mg: { max: 13, txt: 'Mg >13 mEq/L: parada cardíaca', pag: 39 },
  ca: { min: 0.65, txt: 'Ca iónico <0,65 mmol/L: hipotensión y ectopia ventricular', pag: 45 },
  p: { min: 1.0, txt: 'Fosfato <1 mg/dL: grave', pag: 50 },
  bolo: { max: 200, txt: 'Calcio IV: bolo de 200 mg como máximo; después 1-2 mg/kg/h', pag: 45 },
  k: { min: 1.5, max: 9.0 },
};
export function evaluar(s) {
  const t = [], k = kSer(s), mg = mgSer(s), f = caFr(s), p = pSer(s);
  if (s.via === 'cava' && s.rate > TOPES.clk.max) t.push({ c: 'clk', sello: true });
  if (mg >= TOPES.mg.max) t.push({ c: 'mg', sello: true }); else if (mg >= 4) t.push({ c: 'mgAviso', sello: false });
  if (f.ion < TOPES.ca.min) t.push({ c: 'ca', sello: true }); else if (f.ion < 0.9) t.push({ c: 'caAviso', sello: false });
  if (p < TOPES.p.min) t.push({ c: 'p', sello: true });
  if (s.bolo10 > TOPES.bolo.max) t.push({ c: 'bolo', sello: true });
  if (k < TOPES.k.min || k > TOPES.k.max) t.push({ c: 'k', sello: true });
  return t;
}
export const asistolia = s => (s.via === 'cava' && s.rate > TOPES.clk.max) || mgSer(s) >= TOPES.mg.max;
// Los pacientes (cifras de pacientes posibles; el caso se inventa, la medicina sale de la ficha)
export const PACIENTES = {
  sano: { nombre: 'Persona sana', s: () => nuevo() },
  damian: { nombre: 'Damián, 52 · NPT, alcohólico', s: () => nuevo({ nombre: 'Damián', kDef: -300, mgDef: 90, p0: 1.4, alb: 3.2 }) },
  rufino: { nombre: 'Rufino, 74 · SNG + furosemida', s: () => nuevo({ nombre: 'Rufino', kDef: -360, mgDef: 105, ph: 7.52 }) },
  valentin: { nombre: 'Valentín, 45 · 10 concentrados', s: () => nuevo({ nombre: 'Valentín', cit: 10, kPico: 25, kDef: 70, alb: 3.0, ph: 7.22 }) },
};
