// El modelo: un estado pequeño y una lectura. Sin DOM. Cada cifra suya es ilustrativa salvo la curva y los topes (datos.js).
import { CURVA_K, CA, P, TOPES } from './datos.js';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export function curvaK(d) {
  const c = CURVA_K; if (d <= c[0][0]) return c[0][1]; if (d >= c[c.length - 1][0]) return c[c.length - 1][1];
  for (let i = 1; i < c.length; i++) if (d <= c[i][0]) { const [x0, y0] = c[i - 1], [x1, y1] = c[i]; return y0 + (y1 - y0) * (d - x0) / (x1 - x0); }
}
export const nuevo = (o = {}) => ({ dK: 0, dMg: 0, po4b: 3.5, alb: 4, ph: 7.4, units: 0, ins: 0, caIV: 0, mgBolo: 0, ...o });
export const FIG = { dKmin: -900, dKmax: 300 };
export function leer(s) {
  const dKef = s.dK + P.kPorUnidad * s.units;   // los concentrados traen 2-3 mEq de K⁺ cada uno (E p. 25)
  const k = curvaK(dKef) - P.kInsulina * s.ins - P.phK * (s.ph - 7.4);
  const mg = P.mgBase + P.mgPendiente * s.dMg - P.mgInsulina * s.ins + s.mgBolo * 0.4 / P.mgPlasmaL;
  const po4 = Math.max(0, s.po4b - P.poInsulina * s.ins);
  const unidos = CA.albumina * s.alb / 4;
  const ion = Math.max(0.8, CA.ion - P.phCa * (s.ph - 7.4) - P.citrato * s.units + P.caIVpor100 * s.caIV / 100);
  const total = CA.ion + CA.quelatos + unidos;             // el ensayo mide las tres fracciones: el pH y el citrato no lo mueven
  const caQuel = CA.quelatos + P.citrato * s.units, caAlb = Math.max(0.2, total - ion - caQuel);
  return { k, mg, po4, caIon: ion, caIonMmol: ion * 0.25, caTotal: total, caAlb, caQuel, mgTotal: 2000 + s.dMg, mgPlasma: 6 * mg / P.mgBase, kTotal: 3500 + dKef, dKef };
}
// Los topes que dependen del estado (los de ClK y calcio IV dependen además de lo que está elegido en el dock)
export function topes(s, e = {}) {
  const L = leer(s), t = [];
  if (e.via === 'cava' && e.rate > TOPES.clk.max) t.push({ c: 'clk', n: 'sello', titulo: 'Asistolia', texto: 'ClK por la cava superior a más de 20 mEq/h: riesgo de asistolia. PA 0/0, FC 0 (parada).', pag: 23, origen: TOPES.clk.origen, off: ['#b-clk'] });
  else if (e.rate >= 40) t.push({ c: 'clk', n: 'aviso', titulo: 'Ritmo de hipopotasemia grave', texto: '40 mEq/h solo si es grave y por vía central, con monitor.', pag: 23, origen: TOPES.clk.origen });
  if (L.mg > TOPES.mg.parada) t.push({ c: 'mg', n: 'sello', titulo: 'Parada', texto: `Mg²⁺ ${L.mg.toFixed(1).replace('.', ',')} mEq/L: más de 13, parada cardíaca. PA 0/0.`, pag: 39, origen: TOPES.mg.origen, off: ['#b-mg'] });
  else if (L.mg > TOPES.mg.bloqueo) t.push({ c: 'mg', n: 'aviso', titulo: 'Bloqueo AV completo', texto: 'Mg²⁺ por encima de 10 mEq/L: bloqueo AV completo. No sigas.', pag: 39, origen: TOPES.mg.origen });
  if (L.caIonMmol < TOPES.ca.grave) t.push({ c: 'ca', n: 'sello', titulo: 'Hipotensión y ectopia', texto: `Ca iónico ${L.caIonMmol.toFixed(2).replace('.', ',')} mmol/L (<0,65): PA 84/50, FC 112 con extrasístoles ventriculares.`, pag: 45, origen: TOPES.ca.origen });
  else if (L.caIonMmol < TOPES.ca.severa) t.push({ c: 'ca', n: 'aviso', titulo: 'Hipocalcemia grave', texto: 'Ca iónico <0,9 mmol/L: grave. Se acerca a 0,65.', pag: 44, origen: TOPES.ca.origen });
  if (L.po4 < TOPES.po4.grave) t.push({ c: 'po4', n: 'sello', titulo: 'Hipofosfatemia grave', texto: `Fosfato ${L.po4.toFixed(1).replace('.', ',')} mg/dL (<1): debilidad respiratoria. FR 28, SatO₂ 89 %.`, pag: 49, origen: TOPES.po4.origen, off: ['#b-real'] });
  if (e.caMg > TOPES.caIV.bolo) t.push({ c: 'caiv', n: 'sello', titulo: 'Bolo de calcio excesivo', texto: `${e.caMg} mg de calcio elemental de golpe: el bolo es de 200 mg como máximo; después, 1-2 mg/kg/h.`, pag: 45, origen: TOPES.caIV.origen, off: ['#b-ca'] });
  if (L.dKef <= -900 || L.dKef >= 300) t.push({ c: 'nofis', n: 'sello', titulo: 'Combinación no fisiológica', texto: 'El potasio total sale de la Fig. 36.2: el suero y el total ya no caben en la curva.', pag: 20, origen: 'ficha · p. 20', off: ['#b-furo', '#b-clk'] });
  else if (L.k < 1.5) t.push({ c: 'nofis', n: 'sello', titulo: 'Combinación no fisiológica', texto: `K⁺ ${fmt(L.k)} mEq/L: por debajo de 1,5 no es un paciente posible; la curva de la Fig. 36.2 acaba en 1,9. Corrige el pH o la insulina.`, pag: 20, origen: 'ficha · p. 20; tope 1,5: ilustrativo', off: ['#b-furo', '#b-real'] });
  if (L.k >= 7) t.push({ c: 'hiperk', n: 'sello', titulo: 'Hiperpotasemia grave', texto: `K⁺ ${fmt(L.k)} mEq/L: riesgo de bloqueo cardíaco y parada; el ECG puede ser normal. PA 90/54, FC 46 (ilustrativo).`, pag: 25, origen: 'ficha · p. 25-26; PA y FC: ilustrativo', off: ['#b-clk'] });
  else if (L.k >= 6) t.push({ c: 'hiperk', n: 'aviso', titulo: 'Hiperpotasemia', texto: 'K⁺ ≥6 mEq/L: la enseñanza clásica espera cambios del ECG, pero no hay relación previsible entre el K⁺ y el ECG (E p. 26).', pag: 26, origen: 'ficha · p. 26', bajo: '#dock-panel' });
  return t;
}
export const fmt = (x, d = 1) => (+x).toFixed(d).replace('.', ',');
