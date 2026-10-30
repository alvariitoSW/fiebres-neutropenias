// El cuerpo de la maqueta: K⁺, Mg²⁺, Ca²⁺ y fosfato de un paciente, minuto a minuto. Sin DOM.
// La DIRECCIÓN de cada efecto sale de la ficha (Marino, caps. 36-38, página al lado); cuánto cambia cada cosa es ilustrativo
// y ajustado para que los pacientes de los casos den las cifras del caso. El rótulo «ilustrativo» se ve en pantalla.
import { PACIENTES } from './datos.js';

export const ECF = 14;                      // L de líquido extracelular (fisiología general): reparte lo que entra en vena
const HV = { ins: 90, cit: 180, caB: 30, caP: 45, po4: 240, mg: 15 };   // vidas medias en min. Insulina «30-60 min» (p. 28), Ca «30-60 min» (p. 26), Mg «15 min» (p. 38); el resto ilustrativo
const dec = (x, dt, h) => x * Math.pow(0.5, dt / h);

// --- Fig. 36.2: K⁺ total frente a sérico. Bajo 4: 200-400 mEq por mEq/L (punto medio 300); sobre 4: 100-200 (punto medio 150) (p. 19)
export const PEND = { bajo: 300, bajoMin: 200, bajoMax: 400, alto: 150, altoMin: 100, altoMax: 200 };
export const kSeroDeD = D => (D >= 0 ? 4 - D / PEND.bajo : 4 - D / PEND.alto);        // D>0 déficit (mEq); D<0 exceso
export const dDeKSero = k => (k <= 4 ? (4 - k) * PEND.bajo : (4 - k) * PEND.alto);
export const deficitTabla = k => (k <= 3.4 ? Math.round(350 * (3.5 - k)) : 0);          // Tabla 36.1 (p. 22): 3,0 → 175

export function nuevo(id) {
  const p = PACIENTES[id];
  const alb0 = p.alb;
  return {
    id, p, min: 0, ph: p.ph, alb: p.alb, renal: p.renal,
    D: dDeKSero(p.k), Dm: (1.7 - p.mg) * 150, ins: 0, nutri: 0, nutriOn: false, po4X: 0, kPl: 0, mgPl: 0, caB: 0, caP: 0, cit: 0, uni: 0, caBolos: [], tDosis: [],
    bombas: { clk: { on: false, tasa: 20, via: 'periferica' }, mg: { on: false, mEq: 0, resta: 0 }, ca: { on: false, tasa: 0 } },
    sellos: {}, calcio0: alb0,
  };
}
// Un minuto de vida
export function paso(s, dt = 1) {
  s.min += dt;
  const b = s.bombas;
  // ClK por la bomba (p. 23): el K⁺ entra al déficit; con Mg bajo, la orina se lleva más (p. 21, 23: «resistente a la reposición»)
  if (b.clk.on) { const pierde = mgSero(s) < 1.2 ? 0.5 : 0.1; s.D -= b.clk.tasa * dt / 60 * (1 - pierde); }
  // MgSO4: cada minuto una parte de la dosis; la mitad se va por la orina si el riñón funciona (p. 37)
  if (b.mg.on) {
    const x = Math.min(b.mg.resta, b.mg.mEq * dt / b.mg.min), orina = s.renal ? 0 : 0.5;
    b.mg.resta -= x; s.mgPl += x / ECF; s.Dm -= x * (1 - orina); if (b.mg.resta <= 0.001) b.mg.on = false;
  }
  if (b.ca.on) s.caP += 0.06 * b.ca.tasa * dt / 20;     // sube hacia un nivel estable; ilustrativo
  // lo que se disipa
  s.ins = dec(s.ins, dt, HV.ins); s.cit = dec(s.cit, dt, HV.cit); s.caB = dec(s.caB, dt, HV.caB); s.caP = b.ca.on ? s.caP : dec(s.caP, dt, HV.caP);
  s.po4X = dec(s.po4X, dt, HV.po4); s.kPl = dec(s.kPl, dt, s.renal ? 360 : 90); s.mgPl = dec(s.mgPl, dt, HV.mg);
  s.nutri += ((s.nutriOn ? 1 : 0) - s.nutri) * (1 - Math.pow(0.5, dt / (s.nutriOn ? 180 : 1440)));   // lo que entró en la célula tarda en salir
  s.caBolos = s.caBolos.filter(x => s.min - x.t < 10);
}
export const avanzar = (s, min) => { for (let i = 0; i < min; i++) paso(s, 1); };

// --- Lecturas ---
export const ks = s => kSeroDeD(s.D) + s.kPl - 0.6 * s.ins - 0.6 * s.nutri;                       // la insulina baja ≥0,6 (p. 28); 0,6 de la nutrición: ilustrativo
export const mgSero = s => 1.7 - s.Dm / 150 + s.mgPl - 0.3 * s.nutri - 0.05 * s.ins;       // Mg que entra en la célula con insulina/glucosa (p. 34): ilustrativo
export const po4 = s => Math.max(0.3, s.p.po4 - 1.2 * s.nutri - 0.2 * s.ins + 1.0 * s.po4X);   // glucosa arrastra fosfato (p. 49)
export const ph = s => s.ph;
export const hco3 = s => 0.03 * s.p.paco2 * Math.pow(10, s.ph - 6.1);
export const caIonico = s => Math.max(0.3, s.p.caI - 0.5 * (s.ph - 7.4) - 0.04 * s.cit + 0.1 * s.caB + s.caP);   // alcalosis y citrato lo bajan (p. 44)
export function caFracciones(s) {                        // Fig. 38.1 (p. 42-43), en mg/dL
  const I = 4 * s.p.caI, alb = 0.8 * I * (s.alb / 4.0), cplx = 0.2 * I, dosis = 4 * (0.1 * s.caB + s.caP);
  const ion = 4 * caIonico(s), total = I + alb + cplx + dosis, ligado = total - ion - cplx - 0.06 * 4 * s.cit * 0;
  return { total, ion, albumina: Math.max(0, ligado), complejos: cplx };
}
export const kPlasmaTotal = s => ks(s);
// ¿Caben juntos el K⁺ total y el sérico en la Fig. 36.2? (combinación no fisiológica)
export const combinacionValida = s => { const k = ks(s); return k > 1.5 && k < 9.0 && Math.abs(kSeroDeD(s.D) - k) < 3.2; };
export function pa(s) {
  const c = caIonico(s), bajar = c < 0.9 ? (0.9 - c) * 70 : 0;
  return { pas: Math.round(s.p.pas - bajar), pad: Math.round(s.p.pad - bajar * 0.6) };
}
// El K⁺ que «nota» la membrana: el calcio la protege sin tocar el K⁺ sérico (p. 26); ilustrativo
export const kEficaz = s => ks(s) - 2.0 * Math.min(1, s.caB * 10 + s.caP * 8);

// --- Mandos ---
export function realimentar(s) { s.nutriOn = true; s.ins = Math.min(1, s.ins + 0.2); }
export function parar(s) { s.nutriOn = false; }
export function insulinaGlucosa(s) { s.ins = 1; }                       // 10 U + 50 mL G50 (Tabla 36.3, p. 27)
export function furosemida(s) { s.D += 15; s.Dm += 4; }                  // ilustrativo; dirección p. 21, 34
export function fosfatoIV(s) { s.po4X += 1.0; s.D -= 0; }               // 40 mmol, 61-80 kg (Tabla 38.5, p. 51); ilustrativo
export function transfundir(s, n = 1) { for (let i = 0; i < n; i++) { s.uni++; s.cit += 1; s.kPl += 2.5 / ECF; } }   // 2-3 mEq de K⁺ por unidad (p. 25); sin riñón, todo se queda
export function calcioBolo(s, tipo) {                                    // 10 mL: gluconato 90 mg, cloruro 270 mg (p. 26, 45)
  const mg = tipo === 'cloruro' ? 270 : 90; s.caB += mg / 900; s.caBolos.push({ t: s.min, mg }); return mg;
}
export const mgBolo = (s, g) => { const m = s.bombas.mg; m.on = true; m.mEq = (m.resta > 0 ? m.resta : 0) + g * 8; m.resta = m.mEq; m.min = g <= 2 ? 5 : 180; };   // 8 mEq por g (p. 36)
export function clkIniciar(s, tasa, via) { Object.assign(s.bombas.clk, { on: true, tasa, via }); }
export const calcioRecientes = s => s.caBolos.reduce((a, x) => a + x.mg, 0);
export const lecturas = s => ({ k: ks(s), mg: mgSero(s), ca: caIonico(s), po4: po4(s), ph: s.ph, hco3: hco3(s), fr: caFracciones(s), pa: pa(s), kEf: kEficaz(s) });

// --- Topes: cada uno con su causa. Devuelve { clave: true } de los sellos y avisos activos. ---
export function topes(s) {
  const L = lecturas(s), b = s.bombas, t = {};
  t.clk = b.clk.on && b.clk.via === 'cava' && b.clk.tasa > 20;
  t.clkAviso = b.clk.on && b.clk.via === 'cava' && b.clk.tasa === 20;
  t.mg = L.mg > 13; t.mgAviso = L.mg > 4 && L.mg <= 13;
  t.ca = L.ca < 0.65; t.caAviso = L.ca >= 0.65 && L.ca < 0.9 && s.uni > 0;
  t.po4 = L.po4 < 1;
  t.caiv = calcioRecientes(s) > 200; t.caivInf = b.ca.on && b.ca.tasa > 2;
  t.comb = !combinacionValida(s);
  return t;
}
