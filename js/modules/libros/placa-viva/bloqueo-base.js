// Motor del bloqueo neuromuscular y de la fuerza: estado pequeño y lectura sin DOM. Dirección y umbrales: Marino (páginas en datos.js); magnitudes: ilustrativas.
import { DOSIS as D, NEO, ILUS as I, UMBRAL as U, PRESETS_BASE } from '../../../data/placa-viva-data.js';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const fmt = (x, d = 0) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',') : '—');
export const nuevo = (clave = 'mel') => ({ ...PRESETS_BASE[clave].s, t: 0, est: true, hielo: 0, suc: null, roc: null, cis: null, perf: 0, perfT: null, neo: 0, neoT: null, neoOk: false, sug: null, piri: false, emp: false, via: false, sed: false });
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
