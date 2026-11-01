// El modelo: un estado pequeño y una lectura, sin DOM. Dirección de cada efecto: Marino (páginas en datos.js); magnitudes: ilustrativas.
import { U, ESTADOS, PRESETS } from './datos.js';
import { bloqueoDe } from './bloqueo-motor.js';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const fmt = (x, d = 0) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',') : '—');
const base = (e, peso, k, f0) => ({ est: e, peso, k, f0, dia: 0, t0: null, igiv: null, ses: 0, piri: false, piriOk: false, hielo: 0, farm: null, rel: null, min: 0, via: false, perf: 0, perfT: null, neo: 0, neoOk: false, neoT: null, sug: 0, sugOk: false, sugT: null, cort: false, estim: 'unico', dSin: 0, dStop: null, cvFijo: null });
export const nuevo = (c = 'flor') => { const p = PRESETS[c]; return base(p.est, p.peso, p.k, p.f0); };
export const cambiar = (s, e) => Object.assign(s, base(e, s.peso, s.k, ESTADOS[e].f0));
export function leer(s) {
  const gbs = s.est === 'gbs', mg = s.est === 'miastenia', mcc = s.est === 'mcc', blq = s.est === 'bloqueo';
  let tof = 4;
  if (blq && s.rel) tof = bloqueoDe(s).tof;   // inicio, meseta y fin de la Tabla 46.7; neostigmina y sugammadex en el motor (bloqueo-motor.js)
  let f;
  if (blq) f = [0, 25, 50, 75, 100][tof];
  else if (gbs) f = s.f0 - 3 * Math.min(s.dia, s.t0 == null ? s.dia : s.t0, s.dStop == null ? s.dia : s.dStop);
  else if (mcc) f = s.f0 - s.dia * (s.cort && (s.rel || s.perf) ? 3 : 1.5);
  else f = s.f0;
  if (gbs || mg) {
    const gi = s.igiv != null && s.dia - s.igiv >= 4 ? Math.min(30, 6 * (s.dia - s.igiv - 3)) : 0, gp = s.ses >= 2 ? Math.min(30, 8 * (s.ses - 1)) : 0;
    f += Math.max(gi, gp);
  }
  if (mg && s.farm) f -= 10;
  if (mg && s.piri && s.piriOk) f += 10;
  f = clamp(Math.round(f), 3, 100);
  const cvkg = s.cvFijo ? s.cvFijo.cvkg : 70 * f / 100, cv = s.cvFijo ? s.cvFijo.cv : cvkg * s.peso, pim = -f;   // intubado: la CV queda la de ese momento
  const crit = (gbs || mg) && (cvkg <= U.cvkg || cv < U.cvL || f <= U.pim), intub = crit && !s.via;
  const aut = gbs && s.dia >= 3;
  const impar = s.dia % 2 === 1, fc = aut ? (impar ? '48' : '132') : String(Math.round(78 - s.neo * 0.3)), pa = aut ? (impar ? '190/100' : '80/40') : '120/75';   // inestabilidad autonómica: oscila por día (cifras ilustrativas; N p. 27 solo da el rasgo)
  return { tof, aut, f, cvkg, cv, pim, crit, intub, cond: gbs ? 'lenta' : 'normal', ref: gbs || s.est === 'pnc' || mcc ? '↓' : '=', lcr: gbs ? 'prot. ↑' : 'normal', fc, pa, sec: s.neo > 0 || s.piri, ptosis: s.hielo ? (mg ? 3 : 0) : null };
}
// Sacudidas del pulgar (0-1) según el estímulo. Fatiga solo en la miastenia (N p. 24-25) y en el bloqueo no despolarizante; el hielo la reduce (ilustrativa).
export function sacudidas(s, L) {
  const A = L.f / 100, mg = s.est === 'miastenia', blq = s.est === 'bloqueo' && s.rel, fa = mg ? (s.hielo ? 0.3 : 0.6) : 0;
  if (s.estim === 'unico') return [A];
  const n = s.estim === 'tof' ? 4 : 10;
  if (blq && s.estim === 'tof') return Array.from({ length: 4 }, (_, i) => (i < L.tof ? (s.rel === 'succi' ? 1 : 1 - 0.1 * i) : 0));
  return Array.from({ length: n }, (_, i) => A * (1 - fa * (1 - Math.exp(-i / 2.5))));
}
