// Modelo del hepatocito: amonio arterial = producción × (1 − frenos) / (depuración del hígado + basal + CVVH). Todo ilustrativo salvo los umbrales (p. 7-8).
import { FIG } from './datos.js';
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const fmt = (x) => String(Math.round(x));
export const nuevo = (o = {}) => ({ func: 100, prod: 1, dep: 0, rifa: 0, cvvh: 0, vit: null, ...o });
export function amonio(s, conCvvh = s.cvvh) {
  const p = FIG.prod[s.prod] * (1 - FIG.lactPorDep * Math.min(s.dep, FIG.lactMaxDep)) * (s.rifa ? FIG.rifa : 1);
  return Math.min(FIG.cap, FIG.A0 * p / (s.func / 100 + FIG.kBasal + (conCvvh ? FIG.kCvvh : 0)));
}
export const umbral = (s) => (s.prod === 2 && s.func < 30 ? FIG.umbralRapido : FIG.umbral);
export const westHaven = (s) => (s.func >= 60 ? 0 : s.func >= 40 ? 1 : s.func >= 15 ? 2 : s.func >= 5 ? 3 : 4);
export function leer(s) {
  const a = amonio(s), sw0 = clamp((a - FIG.normal) / (FIG.cap - FIG.normal), 0, 1), sw = s.edema ? Math.max(sw0, 0.8) : sw0;
  const n = Math.round(FIG.prod[s.prod] * 4 * (1 - FIG.lactPorDep * Math.min(s.dep, FIG.lactMaxDep)) * (s.rifa ? FIG.rifa : 1));
  return { a, sw, wh: westHaven(s), carril: s.func, sinCvvh: amonio(s, 0), nProd: n, nSale: clamp(Math.round(a / 30), 0, 8), nGlu: Math.round(sw * 6), edema: !!s.edema || a > umbral(s), manda: !!s.edema && a <= umbral(s) };
}
export function topes(s) {
  const L = leer(s), t = [], a = fmt(L.a), rapido = umbral(s) !== FIG.umbral;
  if (L.edema) t.push({ c: 'edema', n: 'sello', titulo: 'Edema cerebral', texto: L.manda ? `La TC muestra edema (surcos borrados, como la Fig. 39.2) aunque el modelo marque ${a} µmol/L: la TC manda, no la cifra. West Haven ${L.wh}. Lactulosa y rifaximina no bastan en el fallo agudo.` : `Amonio arterial ${a} µmol/L (más de ${umbral(s)}${rapido ? ': umbral rápido de 120, opinión del autor, no de la ficha' : ''}): el astrocito se hincha, West Haven ${L.wh}; la TC se parece a la Fig. 39.2. Lactulosa y rifaximina no bastan en el fallo agudo: CVVH.`, pag: 7, origen: L.manda ? 'ficha · p. 6-7 (la TC manda)' : !rapido ? 'ficha · p. 7-8' : 'ficha · p. 7 (>150); umbral 120: opinión del autor', off: ['[data-dep]', '#r-rifa'] });
  if (s.dep === 4) t.push({ c: 'diarrea', n: 'aviso', titulo: 'Diarrea osmótica', texto: 'Más de 3 deposiciones al día: reduce o para la lactulosa; el objetivo son 2-3 blandas.', pag: 7, origen: 'ficha · p. 7', bajo: '#m-dep' });
  if (s.dep >= 6) t.push({ c: 'hipovol', n: 'sello', titulo: 'Hipovolemia', texto: 'Seis deposiciones o más: pérdida de líquido, PA 85/50 y FC 115. Para la lactulosa.', pag: 7, origen: 'fisiología general; cifras ilustrativas', off: ['[data-dep="6"]'] });
  if (s.cvvh && L.sinCvvh <= umbral(s)) t.push({ c: 'cvvh', n: 'aviso', titulo: 'No indicada todavía', texto: `CVVH con amonio ${fmt(L.sinCvvh)} sin ella (no pasa de ${umbral(s)}), sin oliguria ni edema: no cumple ninguno de los tres criterios.`, pag: 8, origen: 'ficha · p. 8', bajo: '#m-cvvh' });
  if (s.rifa > 0 && s.rifa < 10) t.push({ c: 'rifa', n: 'aviso', titulo: 'Mínimo 10 días', texto: `Llevas ${s.rifa} día${s.rifa > 1 ? 's' : ''}: la rifaximina 400 mg tres veces al día se da al menos 10 días y suele combinarse con lactulosa. Un ciclo más corto no es el que describe el libro.`, pag: 7, origen: 'ficha · p. 7', bajo: '#m-rifa' });
  if (L.a < 10) t.push({ c: 'nofis', n: 'aviso', titulo: 'Combinación no fisiológica', texto: `Amonio ${a} µmol/L: ni con hígado sano y producción mínima baja tanto.`, pag: 6, origen: 'fisiología general' });
  return t;
}
export function vitales(s) {
  if (s.dep >= 6) return { pa: '85/50', fc: '115' };
  return s.vit || { pa: '118/72', fc: '76' };
}
