// Estado y lectura del eje. Ninguna cifra sale de aquí sin su origen: topes.js y pagina.js las rotulan (ficha / fisiología general / ilustrativo).
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const fmt = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toString().replace('.', ',');
export const nuevo = (p = {}) => ({ gl: 'adr', estres: 0, circi: false, dias: 0, farm: '', pat: 'sano', acth: false, hc: false, hcD: null, taper: false, at: false, atD: null, levo: false, levoD: null, lio: false, yodo: false, prop: false, asma: false, dia: 0, intYodo: false, intLevo: false, ov: {}, ...p });
export const PROD = [20, 60, 150, 350];            // mg/día: 15-25 reposo y 350 máximo son de la ficha (p. 48); 60 y 150 ilustrativos
const CORT = [14, 30, 42, 50], CORT_SUPR = [6, 22, 25, 28], CORT_ETO = [5, 12, 15, 18];   // µg/dL, ilustrativos salvo los umbrales de la ficha
const T = { sano: [1.3, 1.5], graves: [2.9, 0.005], t3: [1.5, 0.05], hipoP: [0.2, 48], hipoS: [0.4, 0.1] };   // T4 libre ng/dL · TSH mU/mL (ilustrativos; 2,9 / 0,2 / 48 son de los casos)
export function filaPatron(t4, tsh) {
  const a = t4 > 1.8 ? 'u' : t4 < 0.8 ? 'd' : 'n', b = tsh > 4.5 ? 'u' : tsh < 0.3 ? 'd' : 'n';
  return { nu: 'normal', ud: 'hyper', nd: 't3tox', un: 'hiperx', du: 'hipoP', dd: 'hipoS', dn: 'euS' }[(a + b === 'nn') ? 'nu' : a + b] || null;
}
export function leer(s) {
  const L = { gl: s.gl }, e = s.estres;
  const bloq = s.circi && e >= 2, eto = s.farm === 'eto' || s.farm === 'keto', supr = s.dias >= 14;
  // ---- suprarrenal
  L.supr = supr; L.eto = eto; L.bloq = bloq; L.atrofia = supr;
  const tab = bloq ? CORT_SUPR.map(() => 8) : supr ? CORT_SUPR : eto ? CORT_ETO : CORT;
  L.cort = s.ov.cort ?? tab[e]; L.prod = bloq || supr || eto ? null : PROD[e];
  L.delta = bloq ? 12 : (supr || eto) ? 6 : 12;
  L.acthN = supr || bloq ? '↓' : eto ? '↑' : e >= 1 ? '↑' : 'N';
  L.cable = !supr;                                        // el cable frena de verdad (Younes): con corticoide ≥14 días, el freno viene de fuera
  const falla = (bloq || supr || eto) && e >= 1;
  const mejoraHC = s.hc && s.hcD != null;
  const dh = mejoraHC ? s.dia - s.hcD : 0;
  L.na = falla && !s.hc ? 0.4 : e >= 2 && !falla ? 0.1 : mejoraHC && dh < 3 && falla ? 0.1 : 0;
  L.lac = falla && !s.hc ? 3.8 : falla ? (dh < 3 ? 2.2 : 1.6) : e >= 3 ? 2.2 : 1.6;
  L.pa = falla && !s.hc ? '78/40' : falla ? '104/62' : e >= 2 ? '100/58' : '120/74';
  L.fc = falla && !s.hc ? 112 : e >= 2 ? 104 : e === 1 ? 88 : 76;
  L.t = e >= 2 ? 38.4 : 36.8; L.na_s = 140;
  // ---- tiroides
  let [t4, tsh] = T[s.pat]; let t3 = s.pat === 'graves' || s.pat === 't3' ? '↑' : 'N';
  if (s.pat === 'sano' && (s.farm === 'amio' || s.farm === 'hep')) { t4 = 2.4; tsh = 1.8; if (s.farm === 'amio') t3 = '↓'; }
  else if (s.pat === 'sano' && e >= 2) { t3 = '↓'; if (e === 3) { t4 = 0.6; tsh = 2.1; } }
  const de = (d0) => (d0 == null ? 0 : clamp((s.dia - d0) / 14, 0, 1));
  if (s.at && (s.pat === 'graves' || s.pat === 't3')) t4 = t4 - (t4 - 1.4) * de(s.atD);
  if (s.levo && (s.pat === 'hipoP' || s.pat === 'hipoS')) { t4 = t4 + (1.1 - t4) * de(s.levoD); if (s.pat === 'hipoP') tsh = tsh - (tsh - 2.5) * de(s.levoD); }
  if (s.lio && s.pat === 'hipoP') t3 = 'N';
  L.t4 = s.ov.t4 ?? t4; L.tsh = s.ov.tsh ?? tsh; L.t3 = t3; L.fila = filaPatron(L.t4, L.tsh);
  L.tijera = s.pat === 'sano' && (e >= 2 || s.farm === 'amio') ? 'rota' : 'ok';   // desyodasa: oxidada (Huang-Bianco) o bloqueada (amiodarona, p. 54)
  L.tormenta = s.gl === 'tir' && s.pat === 'graves' && e >= 1; L.mixed = s.gl === 'tir' && s.pat === 'hipoP' && e >= 1;
  if (s.gl === 'tir') { L.t = L.tormenta ? 40.8 : L.mixed ? 33.5 : e >= 2 ? 38.4 : 36.8; L.fc = L.tormenta ? 152 : L.mixed ? 48 : s.pat === 'graves' ? 118 : e >= 2 ? 104 : 76; L.na_s = L.mixed ? 122 : 140; L.pa = L.mixed ? '96/54' : L.tormenta ? '132/62' : e >= 2 ? '100/58' : '120/74'; L.na = 0; L.lac = 1.6; }
  L.fa = L.tormenta && L.fc >= 140;
  return L;
}
