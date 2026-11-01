// El modelo: un estado pequeño y una lectura. Sin DOM. Cada cifra suya es ilustrativa salvo la curva y los topes (datos.js).
import { CURVA_K, CA, P, TOPES, PRESETS, VITALES_ORIGEN } from '../../../data/iones-vivos-data.js';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export function curvaK(d) {
  const c = CURVA_K; if (d <= c[0][0]) return c[0][1]; if (d >= c[c.length - 1][0]) return c[c.length - 1][1];
  for (let i = 1; i < c.length; i++) if (d <= c[i][0]) { const [x0, y0] = c[i - 1], [x1, y1] = c[i]; return y0 + (y1 - y0) * (d - x0) / (x1 - x0); }
}
// t: reloj en minutos · bombas: lo que está pasando ahora ({ clk: { rate } } en mEq/h)
export const nuevo = (o = {}) => ({ dK: 0, dMg: 0, po4b: 3.5, alb: 4, ph: 7.4, units: 0, ins: 0, caIV: 0, mgBolo: 0, t: 0, bombas: {}, ...o });
// Lo que cada dosis de insulina mueve del suero a la célula (ilustrativo; la fuente da la dirección): en unidades del suero y en partículas del dibujo
export const flujos = (s) => ({ kShift: P.kInsulina * s.ins, mgShift: P.mgInsulina * s.ins, pShift: P.poInsulina * s.ins, partK: s.ins ? Math.min(6, 2 + 2 * s.ins) : 0, partP: 3 * s.ins });
// Avanza el reloj `min` minutos: las bombas dan su dosis; el bolo de Mg baja con el tiempo (el libro dice que empieza a caer a los 15 min, p. 38, sin dar semivida: el ritmo es ilustrativo) y el efecto del calcio IV se acaba a los 30 min (p. 46; 30-60 min en hiperK, p. 27). Los tiempos son ilustrativos.
// Acople Mg→K. Libro (E p. 35): «the hypokalemia that accompanies Mg depletion can be refractory to K+ replacement, and Mg replacement is necessary before the hypokalemia can be corrected». La fracción que se pierde es ilustrativa (P.clkPerdidaMax).
export const fraccionPerdida = (mg) => P.clkPerdidaMax * clamp((P.mgUmbral - mg) / (P.mgUmbral - P.mgPiso), 0, 1);
export function avanzar(s, min) {
  if (s.bombas.clk) { const dosis = s.bombas.clk.rate * min / 60, perd = dosis * fraccionPerdida(leer(s).mg); s.clkPerdido = perd; s.dK = Math.min(FIG.dKmax, s.dK + dosis - perd); }
  s.mgBolo *= 0.5 ** (min / 15); s.caIV = Math.max(0, s.caIV * (1 - min / 30)); s.t += min;
}
export const FIG = { dKmin: -900, dKmax: 300 };
export function leer(s) {
  const dKef = s.dK + P.kPorUnidad * s.units;   // los concentrados traen 2-3 mEq de K⁺ cada uno (E p. 25)
  const f = flujos(s), k = curvaK(dKef) - f.kShift - P.phK * (s.ph - 7.4);
  const mg = P.mgBase + P.mgPendiente * s.dMg - f.mgShift + s.mgBolo * 0.4 / P.mgPlasmaL;
  // Alcalosis respiratoria (E p. 49): «Respiratory alkalosis can increase intracellular pH... glucose and PO4 movement into cells»: solo con pH alto de origen respiratorio
  const po4 = Math.max(0, s.po4b - f.pShift - (s.resp && s.ph > 7.4 ? P.poResp * (s.ph - 7.4) / 0.1 : 0));
  const unidos = CA.albumina * s.alb / 4;
  const ion = Math.max(0.8, CA.ion - P.phCa * (s.ph - 7.4) - P.citrato * s.units + P.caIVpor100 * s.caIV / 100);
  const total = CA.ion + CA.quelatos + unidos;             // el ensayo mide las tres fracciones: el pH y el citrato no lo mueven
  const caQuel = CA.quelatos + P.citrato * s.units, caAlb = Math.max(0.2, total - ion - caQuel);
  return { k, mg, po4, caIon: ion, caIonMmol: ion * 0.25, caTotal: total, caAlb, caQuel, mgTotal: 2000 + s.dMg, mgPlasma: 6 * mg / P.mgBase, kTotal: 3500 + dKef, dKef };
}
// Los topes que dependen del estado (los de ClK y calcio IV dependen además de lo que está elegido en el dock)
export function topes(s, e = {}) {
  const L = leer(s), t = [];
  if (e.via === 'cava' && e.rate > TOPES.clk.max) t.push({ c: 'clk', n: 'sello', titulo: 'Asistolia', texto: 'ClK por la cava superior a más de 20 mEq/h: riesgo de asistolia. PA 0/0, FC 0 (parada).', pag: 23, origen: TOPES.clk.origen, off: ['#iov-b-clk'] });
  else if (e.rate >= 40) t.push({ c: 'clk', n: 'aviso', titulo: 'Ritmo de hipopotasemia grave', texto: '40 mEq/h puede hacer falta en la hipopotasemia grave; mejor por una vía central grande, si es posible (E p. 23).', pag: 23, origen: TOPES.clk.origen });
  if (s.mgBolo > 16) t.push({ c: 'mgbolo', n: 'aviso', titulo: 'Ritmo ilustrativo', texto: 'Más de 2 g de MgSO₄ de golpe: el libro da 2 g en 2-5 min solo en riesgo vital y 6 g en 3 h (E p. 37). Aquí el bolo es instantáneo, ilustrativo.', pag: 37, origen: 'ficha · p. 37; bolo instantáneo: ilustrativo' });
  if (L.mg > TOPES.mg.parada) t.push({ c: 'mg', n: 'sello', titulo: 'Parada', texto: `Mg²⁺ ${L.mg.toFixed(1).replace('.', ',')} mEq/L: más de 13, parada cardíaca. PA 0/0.`, pag: 39, origen: TOPES.mg.origen, off: ['#iov-b-mg'] });
  else if (L.mg > TOPES.mg.bloqueo) t.push({ c: 'mg', n: 'aviso', titulo: 'Bloqueo AV completo', texto: 'Mg²⁺ por encima de 10 mEq/L: bloqueo AV completo. No sigas.', pag: 39, origen: TOPES.mg.origen });
  if (L.caIonMmol < TOPES.ca.grave) t.push({ c: 'ca', n: 'sello', titulo: 'Hipotensión y ectopia', texto: `Ca iónico ${L.caIonMmol.toFixed(2).replace('.', ',')} mmol/L (<0,65): PA 84/50, FC 112 con extrasístoles ventriculares (constantes ilustrativas).`, pag: 45, origen: TOPES.ca.origen });
  else if (L.caIonMmol < TOPES.ca.severa) t.push({ c: 'ca', n: 'aviso', titulo: 'Hipocalcemia grave', texto: 'Ca iónico <0,9 mmol/L: grave en la transfusión masiva (E p. 44). Se acerca a 0,65.', pag: 44, origen: TOPES.ca.origen });
  if (L.po4 < TOPES.po4.grave) t.push({ c: 'po4', n: 'sello', titulo: 'Hipofosfatemia grave', texto: `Fosfato ${L.po4.toFixed(1).replace('.', ',')} mg/dL (<1): debilidad respiratoria. FR 28, SatO₂ 89 % (constantes ilustrativas).`, pag: 49, origen: TOPES.po4.origen, off: ['#iov-b-real'] });
  if (e.caMg > TOPES.caIV.bolo) t.push({ c: 'caiv', n: 'sello', titulo: 'Bolo de calcio excesivo', texto: `${e.caMg} mg de calcio elemental de golpe: por encima de los 200 mg del bolo recomendado (después, 1-2 mg/kg/h); el calcio IV puede dañar la célula (p. 46). Tope ilustrativo.`, pag: 45, origen: TOPES.caIV.origen, off: ['#iov-b-ca'] });
  if (L.dKef <= -900 || L.dKef >= 300) t.push({ c: 'nofis', n: 'sello', titulo: 'Combinación no fisiológica', texto: 'El potasio total sale de la Fig. 36.2: el suero y el total ya no caben en la curva.', pag: 20, origen: 'ficha · p. 20', off: ['#iov-b-furo', '#iov-b-clk'] });
  else if (L.k < 1.5) t.push({ c: 'nofis', n: 'sello', titulo: 'Combinación no fisiológica', texto: 'K⁺ por debajo de 1,5 mEq/L: no es un paciente posible; la curva de la Fig. 36.2 acaba en 1,9. Corrige el pH o la insulina.', pag: 20, origen: 'ficha · p. 20; tope 1,5: ilustrativo', off: ['#iov-b-furo', '#iov-b-real'] });
  if (L.k >= 7) t.push({ c: 'hiperk', n: 'sello', titulo: 'Hiperpotasemia grave', texto: `K⁺ ${fmt(L.k)} mEq/L: riesgo de bloqueo cardíaco y parada; el ECG puede ser normal. PA 90/54, FC 46 (ilustrativo).`, pag: 25, origen: 'ficha · p. 25-26; PA y FC: ilustrativo', off: ['#iov-b-clk'] });
  else if (L.k >= 6) t.push({ c: 'hiperk', n: 'aviso', titulo: 'Hiperpotasemia', texto: 'K⁺ ≥6 mEq/L: la enseñanza clásica espera cambios del ECG, pero no hay relación previsible entre el K⁺ y el ECG (E p. 26).', pag: 26, origen: 'ficha · p. 26', bajo: '#dock-panel' });
  return t;
}
// Constantes del paciente según el sello que manda. Cada regla con su página; las cifras de PA/FC son ilustrativas (el libro no las da).
export function vitales(s, e = {}, preset = 'normal') {
  const act = topes(s, e).filter((t) => t.n === 'sello').map((t) => t.c), [pa, fc] = PRESETS[preset].vit, o = VITALES_ORIGEN;
  if (act.includes('clk') || act.includes('mg')) return { pa: '0/0', fc: 0, extra: 'parada', regla: 'ClK >20 mEq/h por la cava superior (p. 23) o Mg²⁺ >13 mEq/L (p. 39)' };
  if (act.includes('ca')) return { pa: '84/50', fc: 112, extra: 'ectopia · ' + o, regla: 'Ca iónico <0,65 mmol/L (p. 45)' };
  if (act.includes('hiperk')) return { pa: '90/54', fc: 46, extra: 'bradicardia · ' + o, regla: 'K⁺ ≥7 mEq/L (ilustrativo; el libro: grave >6,5, p. 27)' };
  if (act.includes('po4')) return { pa, fc: Math.max(fc, 96), extra: 'FR 28 · SatO₂ 89 % (ilustrativas) · ' + o, regla: 'Fosfato <1 mg/dL (p. 49)' };
  return { pa, fc, extra: o, regla: '' };
}
export const fmt = (x, d = 1) => (+x).toFixed(d).replace('.', ',');
// Lo que el monitor y la ventanita enseñan del K⁺: nunca una cifra que la curva no da. Con el sello «no fisiológica», el límite
// (<1,5 por debajo del tope; 8,0 en el extremo de la curva de la Fig. 36.2, p. 20).
export const kVer = (k) => (k < 1.5 ? '<1,5' : k > 8 ? '>8,0' : fmt(k));
// ¿El corazón está parado (sello de ClK por la cava o de Mg²⁺)? Entonces el ECG se pinta plano (el trazo del ritmo no se inventa).
export const enParada = (s, e = {}) => topes(s, e).some((t) => t.n === 'sello' && (t.c === 'clk' || t.c === 'mg'));
