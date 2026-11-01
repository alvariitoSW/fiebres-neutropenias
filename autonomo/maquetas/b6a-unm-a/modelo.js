// El modelo: estado pequeño y lectura sin DOM. Dirección y umbrales: Marino (páginas en datos.js); magnitudes: ilustrativas.
import { DOSIS as D, NEO, ILUS as I, UMBRAL as U, PRESETS } from './datos.js';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const fmt = (x, d = 0) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',') : '—');
export const nuevo = (clave = 'sera') => ({ ...PRESETS[clave].s, t: 0, est: true, hielo: 0, suc: null, roc: null, cis: null, perf: 0, perfT: null, neo: 0, neoT: null, neoOk: false, sug: null, piri: false, emp: false, via: false, sed: false });
const prof = (a, t) => (t < 0 ? 0 : t < a.on ? t / a.on : t <= a.pl ? 1 : t < a.fin ? (a.fin - t) / (a.fin - a.pl) : 0);
const nivelDe = (k, x, t) => (x ? clamp(x.dosis / D[k].lleno, 0, 1) * prof(D[k], t - x.t0) : 0);
export function leer(s) {
  const t = s.t, suc = nivelDe('suc', s.suc, t); let roc = nivelDe('roc', s.roc, t), cis = nivelDe('cis', s.cis, t);
  const perf = s.perf && s.perfT != null ? I.perf[s.perf] * clamp((t - s.perfT) / D.cis.on, 0, 1) : 0; cis = Math.max(cis, perf);
  const sugAct = s.sug && t - s.sug.t0 >= 2.5; if (sugAct) roc *= s.sug.ok ? 0 : 0.5;
  let lvl = Math.max(suc, roc, cis);
  const neoEf = s.neo && s.neoOk ? clamp(s.neo / NEO.max, 0, 1) * clamp((t - s.neoT - NEO.espera) / (NEO.fin - NEO.espera), 0, 1) : 0;
  lvl *= 1 - 0.6 * neoEf;
  const recEf = clamp(s.rec - (s.emp ? I.emp : 0), 5, 100) * (s.piri ? I.piri : 1);
  const hie = s.rec < 100 ? I.hielo * Math.min(s.hielo, U.hielo) / U.hielo : 0;
  const reposo = Math.min(100, I.margen * recEf + hie), fuerza = reposo * (1 - lvl);
  const tof = lvl >= I.tofCortes[0] ? 0 : lvl >= I.tofCortes[1] ? 1 : lvl >= I.tofCortes[2] ? 2 : lvl >= I.tofCortes[3] ? 3 : 4;
  const d = I.fatiga * (1 - Math.min(1, recEf / 100));
  const n = s.est ? 4 : 1, amp = Array.from({ length: n }, (_, i) => (s.est && i >= tof ? 0 : Math.max(0, fuerza * (1 - d * i))));
  const cv = I.cv0 * fuerza / 100, cvL = cv * s.peso / 1000, pim = -I.pim0 * fuerza / 100;
  const k = s.k0 + (s.suc && t - s.suc.t0 < 30 ? 0.5 : 0);
  const fc = I.fc0 - I.neoFc * s.neo - (s.suc && t - s.suc.t0 < 10 ? 12 : 0), secr = Math.round(s.neo / NEO.paso) + (s.piri ? 1 : 0);
  const ptosis = s.rec < 100 && s.hielo > 0 ? +((100 - s.rec) / 100 * 4 * Math.min(s.hielo, U.hielo) / U.hielo).toFixed(1) : 0;
  const crit = !s.via && s.rec < 100 && lvl < 0.5 && (cv <= U.cvMl || cvL < U.cvL || -pim <= U.pim);
  return { lvl, suc, roc, cis, fuerza, reposo, tof, amp, cv, cvL, pim, k, fc, secr, ptosis, crit, recEf, neoEf, sugAct, perfLv: perf };
}
// Sellos y avisos. c clave · n nivel · off selectores de mandos que se apagan · pag cita «pág:id»
export function topes(s, L) {
  const o = []; const T = (c, n, titulo, texto, pag, origen, off = [], tono = '') => o.push({ c, n, titulo, texto, pag, origen, off, tono });
  const dosisSello = (c, k, x, nom, fin, id) => { if (!x) return; if (x.dosis >= D[k].max) T(c, 'sello', `Dosis máxima de ${nom}`, `${fmt(x.dosis, k === 'cis' ? 2 : 1)} mg/kg (${fmt(x.dosis * s.peso)} mg): ${fin}`, id, 'ficha', [`#b-${k}`]); else if (x.dosis >= D[k].lleno) T(c + 'C', 'aviso', `${nom}: ya es la dosis completa`, `Más allá de ${fmt(D[k].max, k === 'cis' ? 2 : 1)} mg/kg no hay margen.`, id, 'ficha'); };
  dosisSello('sucMax', 'suc', s.suc, 'succinilcolina', 'tope de 1-1,5 mg/kg; más prolonga la bradicardia y la hiperpotasemia.', '29:mn-bnm-succi');
  dosisSello('rocMax', 'roc', s.roc, 'rocuronio', 'dosis de intubación 1 mg/kg; no se repite.', '29:mn-bnm-rocuronio');
  dosisSello('cisMax', 'cis', s.cis, 'cisatracurio', 'tope de 0,15-0,2 mg/kg.', '29:mn-bnm-cisatracurio');
  if (s.neo >= NEO.max) T('neo70', 'sello', 'Nunca más de 70 µg/kg de neostigmina', `Parasimpaticomimético: la FC cae a ${fmt(L.fc)} y las secreciones suben.`, '31:mn-bnm-neostigmina', 'ficha', ['#b-neo']);
  else if (s.neo >= NEO.paso) T('neoC', 'aviso', 'Neostigmina cerca del tope', `${s.neo} de 70 µg/kg; la FC ya baja a ${fmt(L.fc)}.`, '31:mn-bnm-neostigmina', 'ficha; caída de FC ilustrativa');
  if (s.neo * s.peso / 1000 > NEO.fda) T('fda', 'aviso', 'Más de 5 mg de neostigmina', 'La FDA limita la dosis total a 5 mg (nota de la ficha).', '31:mn-bnm-neostigmina', 'ficha');
  if (L.k >= U.k) T('succK', 'sello', 'Hiperpotasemia mortal con succinilcolina', `K⁺ ${fmt(L.k, 1)} mEq/L: la despolarización mantenida suma +0,5. Contraindicada con hiperpotasemia.`, '30:mn-bnm-contra', 'ficha', ['#b-suc']);
  else if (L.k >= U.kCerca && !s.suc) T('succCerca', 'aviso', 'K⁺ cerca del tope', `K⁺ ${fmt(L.k, 1)}: la succinilcolina suma +0,5 mEq/L y pasaría de 5,5.`, '30:mn-bnm-contra', 'ficha');
  if (s.roc && !s.via && s.t - s.roc.t0 >= 3 && L.roc > 0.5) T('rocVia', 'sello', 'Rocuronio sin vía aérea: dura una hora', 'Apnea con 3 min de bloqueo. Revierte con sugammadex 16 mg/kg (2-3 min) o asegura la vía.', '30:mn-bnm-rocuronio', 'ficha', ['#b-roc', '#b-cis']);
  if (s.sug && !s.roc && (s.suc || s.cis || s.perf)) T('sugNo', 'sello', 'Sugammadex: solo aminoesteroides', 'No revierte la succinilcolina ni el cisatracurio; sin rocuronio no hay nada que envolver.', '31:mn-bnm-sugammadex', 'ficha', ['#b-sug2', '#b-sug4', '#b-sug16']);
  if (s.perf && L.tof === 0 && s.t - s.perfT >= D.cis.on) T('tof0', 'sello', 'Bloqueo excesivo: objetivo 1-2 respuestas', 'TOF 0/4 con perfusión: baja la perfusión.', '30:mn-bnm-monitor', 'ficha', ['#b-perf-mas']);
  if (L.lvl > 0.5 && !s.sed) T('desp', 'aviso', 'Paralizado sin sedación', 'Siempre sedación profunda y analgesia: despierto y paralizado es horrible y doloroso.', '31:mn-bnm-ruego', 'ficha');
  if (s.t >= U.horas48 && L.lvl > 0.5) T('p48', 'aviso', 'Más de 48 h paralizado', 'Sin EEG no se sabe si la sedación basta; riesgo de miopatía, neumonía hipostática, TEV y úlceras.', '31:mn-bnm-ruego', 'ficha');
  if (L.crit) { T('intubar', 'sello', 'Pensar en intubar', `CV ${fmt(L.cv)} mL/kg (${fmt(L.cvL * 1000)} mL) y PIM ${fmt(L.pim)}: criterio CV ≤15 mL/kg o <1 L, o PIM −20.`, '25:mn-mg-intubacion', 'ficha; CV y PIM del modelo ilustrativas', []); T('piri', 'sello', 'Piridostigmina no en el fracaso respiratorio', 'Aumenta las secreciones.', '26:mn-mg-piridostigmina', 'ficha', ['#b-piri']); }
  else if (!s.via && s.rec < 100 && L.lvl < 0.5 && L.cv <= 25) T('cvC', 'aviso', 'CV cerca del umbral', `CV ${fmt(L.cv)} mL/kg: el umbral es 15 mL/kg (o 1 L). No esperes al in extremis.`, '25:mn-mg-cv', 'ficha; margen de aviso ilustrativo');
  if (s.hielo >= U.hielo) T('hielo2', 'sello', 'Hielo: 2 min, sin más efecto', `Ptosis mejora ${fmt(L.ptosis, 1)} mm (positivo si ≥2 mm; S y E 80 %).`, '25:mn-mg-hielo', 'ficha', ['#b-hielo'], 'ok'); else if (s.hielo >= 1) T('hieloC', 'aviso', 'Hielo: falta 1 min', 'El efecto no crece más allá de 2 min.', '25:mn-mg-hielo', 'ficha');
  if (s.emp && s.rec < 100) T('emp', 'sello', 'Fármaco que empeora la miastenia', 'Aminoglucósidos y magnesio (Tabla 46.5) dificultan la transmisión: la fuerza cae.', '24:mn-mg-farmaco', 'ficha; mecanismo: otra fuente pendiente', ['#b-gent', '#b-mg']);
  if (s.rec <= 5) T('rec5', 'sello', 'Tope del modelo: 5 % de receptores', 'Por debajo no queda transmisión (ilustrativo).', '24:mn-mg-anticuerpos', 'ilustrativo', ['#b-recm']); else if (s.rec <= 15 && s.rec < 100) T('recC', 'aviso', 'Pocos receptores', `${s.rec} % de receptores (ilustrativo).`, '24:mn-mg-anticuerpos', 'ilustrativo');
  return o;
}
