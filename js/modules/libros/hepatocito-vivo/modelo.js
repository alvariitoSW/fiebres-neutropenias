// Modelo del hepatocito: amonio arterial = producción × (1 − frenos) / (depuración del hígado + basal + CVVH). Todo ilustrativo salvo los umbrales (p. 7-8).
import { FIG, FLUIDOS, TX, viaDe } from '../../../data/hepatocito-vivo-data.js';
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const fmt = (x) => String(Math.round(x));
export const nuevo = (o = {}) => ({ func: 100, prod: 1, dep: 0, rifa: 0, cvvh: 0, vit: null, via: 'urea', dosis: 4, h: 0, par: 0, glut: 100, nac: 0, bebedor: 0, rep: 0, alc: 'eg', ph: 7.4, ga: null, go: null, lact: null, fomep: 0, hd: 0, coad: 0, vision: 0, lab: null, ...o });
// ---- Tóxicos (ilustrativo salvo los umbrales de la ficha; ver NOTAS) ----
// Glutatión: 100 % hasta saturar la conjugación (4 g/día; con alcohol crónico antes) y baja 20 puntos por gramo; −70 % (30 %) = daño (Marino cap. 52, p. 4-5).
export const glutDe = (s) => Math.round(clamp(100 - (s.dosis - (s.bebedor ? TX.alcoholU : TX.saturaG)) * TX.pendiente, 0, 100));
export const p450 = (s) => +(s.dosis * (0.1 + 0.4 * clamp((s.dosis - TX.saturaG) / 11, 0, 1))).toFixed(1);
export const conjugado = (s) => +(s.dosis - p450(s)).toFixed(1);
// Reloj: fase 1 (<24 h) sin daño, fase 2 (24-72 h) el daño sube, fase 3 (72-96 h) lo completa (p. 5). La NAC frena el daño.
export function funcDe(s) {
  const D = s.glut < TX.glutDano ? Math.min(95, 40 + 55 * (TX.glutDano - s.glut) / TX.glutDano) : 0, h = s.h;
  const fase = h < 24 ? 0 : h <= 72 ? 0.6 * (h - 24) / 48 : 0.6 + 0.4 * Math.min(1, (h - 72) / 24);
  return clamp(Math.round((100 - D * fase * (s.nac ? TX.nacFreno : 1)) / 5) * 5, 0, 100);
}
// Opacidad y marca de las cuatro estaciones de la vía activa
export function nodosVia(s) {
  if (s.via === 'paracetamol') {
    const sat = s.dosis > TX.saturaG, ag = s.glut < TX.glutDano;
    return [{ op: 1, tag: sat ? 'saturada' : '' }, { op: +clamp(0.35 + 0.65 * p450(s) / 3, 0.35, 1).toFixed(2), tag: '' }, { op: +clamp(s.glut / 100, 0.35, 1).toFixed(2), tag: ag ? 'agotado' : '', off: ag }, { op: s.nac ? 1 : 0.35, tag: s.nac ? 'en marcha' : 'sin NAC', off: !s.nac }];
  }
  if (s.via === 'alcoholes') return [{ op: 1, tag: s.fomep ? 'bloqueada' : '', off: !!s.fomep }, { op: s.fomep ? 0.35 : 1, tag: '' }, { op: s.fomep ? 0.35 : 1, tag: s.coad ? 'desvío' : '' }, { op: s.fomep ? 0.35 : 1, tag: '' }];
  return [];
}
export const nombresVia = (s) => (s.via === 'alcoholes' && s.alc === 'met' ? viaDe('alcoholes').nodosMet : viaDe(s.via).nodos) || [];
export function amonio(s, conCvvh = s.cvvh) {
  const p = FIG.prod[s.prod] * (1 - FIG.lactPorDep * Math.min(s.dep, FIG.lactMaxDep)) * (s.rifa ? FIG.rifa : 1);
  return Math.min(FIG.cap, FIG.A0 * p / (s.func / 100 * (s.tips ? FIG.tipsFrac : 1) + FIG.kBasal + (conCvvh ? FIG.kCvvh : 0)));
}
export const umbral = (s) => (s.prod === 2 && s.func < 30 ? FIG.umbralRapido : FIG.umbral);
export const westHaven = (s) => (s.func >= 60 ? 0 : s.func >= 40 ? 1 : s.func >= 15 ? 2 : s.func >= 5 ? 3 : 4);
export function leer(s) {
  const a = amonio(s), sw0 = clamp((a - FIG.normal) / (FIG.cap - FIG.normal), 0, 1), sw = s.edema ? Math.max(sw0, 0.8) : clamp(sw0 + (s.fl === 'rl' ? FIG.rl : 0), 0, 1);
  const n = Math.round(FIG.prod[s.prod] * 4 * (1 - FIG.lactPorDep * Math.min(s.dep, FIG.lactMaxDep)) * (s.rifa ? FIG.rifa : 1));
  return { a, sw, wh: westHaven(s), carril: s.func, sinCvvh: amonio(s, 0), nProd: n, nSale: clamp(Math.round(a / 30), 0, 8), nGlu: Math.round(sw * 6), edema: !!s.edema || a > umbral(s), manda: !!s.edema && a <= umbral(s) };
}
export function topes(s) {
  const L = leer(s), t = [...topesTx(s)], a = fmt(L.a), rapido = umbral(s) !== FIG.umbral;
  if (L.edema) t.push({ c: 'edema', n: 'sello', titulo: L.manda ? 'Edema cerebral' : 'Riesgo alto de edema', texto: L.manda ? `La TC muestra edema (surcos borrados, como la Fig. 39.2) aunque el modelo marque ${a} µmol/L: la TC manda, no la cifra. West Haven ${L.wh}. En el fallo agudo la CVVH es superior a la lactulosa y la rifaximina.` : `Amonio arterial ${a} µmol/L (más de ${umbral(s)}${rapido ? ': umbral rápido de 120, opinión del autor, no de la ficha' : ''}): riesgo aumentado de edema: el astrocito tiende a hincharse (West Haven ${L.wh}); la TC acaba pareciéndose a la Fig. 39.2. En el fallo agudo la CVVH es superior a la lactulosa y la rifaximina.`, pag: 7, origen: L.manda ? 'ficha · p. 6-7 (la TC manda)' : !rapido ? 'ficha · p. 7-8' : 'ficha · p. 7 (>150); umbral 120: opinión del autor', off: ['#hpv-raiz [data-dep]', '#hpv-r-rifa'] });
  if (s.dep === 4) t.push({ c: 'diarrea', n: 'aviso', titulo: 'Diarrea osmótica', texto: 'Con 4 deposiciones ya pasas del objetivo de 2-3 blandas al día: reduce o para la lactulosa si hay diarrea.', pag: 7, origen: 'ficha · p. 7 (objetivo 2-3; reducir ante diarrea); el umbral de 4: opinión del autor', bajo: '#hpv-m-dep' });
  if (s.dep >= 6) t.push({ c: 'hipovol', n: 'sello', titulo: 'Hipovolemia', texto: 'Seis deposiciones o más: pérdida de líquido, PA 85/50 y FC 115. Para la lactulosa.', pag: null, origen: 'fisiología general; cifras ilustrativas', off: ['#hpv-raiz [data-dep="6"]'] });
  if (s.cvvh && !s.edema && L.sinCvvh <= FIG.umbral) t.push({ c: 'cvvh', n: 'aviso', titulo: 'Sin criterio de amonio', texto: `CVVH con amonio ${fmt(L.sinCvvh)} sin ella (no pasa de ${FIG.umbral}). El modelo no mide la diuresis; la ficha pide oliguria, amonio >150 o edema.`, pag: 8, origen: 'ficha · p. 8', bajo: '#hpv-m-cvvh' });
  if (s.rifa > 0 && s.rifa < 10) t.push({ c: 'rifa', n: 'aviso', titulo: 'Mínimo 10 días', texto: `Llevas ${s.rifa} día${s.rifa > 1 ? 's' : ''}: la rifaximina 400 mg tres veces al día se da al menos 10 días y suele combinarse con lactulosa. Un ciclo más corto no es el que describe el libro.`, pag: 7, origen: 'ficha · p. 7', bajo: '#hpv-m-rifa' });
  if (s.tips) t.push({ c: 'tips', n: 'aviso', titulo: 'Cambia un problema por otro', texto: 'El TIPS alivia la hipertensión portal, pero al saltarse el hígado aumenta el riesgo de encefalopatía: sube el amonio arterial.', pag: 10, origen: 'ficha · p. 10; cuánto sube: ilustrativo', bajo: '#hpv-m-tips' });
  if (s.fl === 'alb') t.push({ c: 'fl', n: 'sello', tono: 'ok', titulo: 'Albúmina 5 %: el 70 % se queda en el vaso', texto: 'Su concentración (5 g/dL) se parece a la del plasma y cerca del 70 % del volumen infundido expande el plasma; es el fluido que recomienda la ficha, sobre todo con albúmina <3 g/dL.', pag: 5, origen: 'ficha · p. 5; cambios de PA y FC: ilustrativos', bajo: '#hpv-m-fl' });
  if (s.fl === 'rl') t.push({ c: 'fl', n: 'aviso', titulo: 'Ringer lactato: no recomendado', texto: 'Es hipotónico: favorece la hiponatremia y empeora el edema cerebral de la encefalopatía hepática. Mira cómo se hincha el astrocito.', pag: 5, origen: 'ficha · p. 5 y 9', bajo: '#hpv-m-fl' });
  if (L.a < 10) t.push({ c: 'nofis', n: 'aviso', titulo: 'Combinación no fisiológica', texto: `Amonio ${a} µmol/L: ni con hígado sano y producción mínima baja tanto.`, pag: 6, origen: 'fisiología general' });
  return t;
}
export function vitales(s) {
  if (s.dep >= 6) return { pa: '85/50', fc: '115' };
  const b = s.vit || { pa: '118/72', fc: '76' }, f = FLUIDOS[s.fl]; if (!f) return b;
  const [sy, di] = b.pa.split('/').map(Number); return { ...b, pa: `${sy + f.dpa[0]}/${di + f.dpa[1]}`, fc: String(+b.fc + f.dfc) };
}

// Topes de los tóxicos: cada uno con su página del PDF TX (la cita 'TX:<página>:<id de la ficha>' la entiende pagina.js)
const tx = (p, id) => `TX:${p}:${id}`;
export function topesTx(s) {
  const t = [];
  if (s.via === 'paracetamol') {
    if (s.dosis >= TX.tope) t.push({ c: 'dosis', n: 'sello', titulo: 'Dosis de 30 g: tope del mando', texto: 'Más de 15 g es una ingestión tóxica casi segura (p. 5). No la confundas con la aspirina: 10-30 g de ácido acetilsalicílico serían mortales (p. 14), otra vía.', pag: tx(5, 'mt-para-dosis'), origen: 'ficha · p. 5 y 14; el tope de 30 g: fisiología general', bajo: '#hpv-m-via' });
    else if (s.dosis >= TX.aviso) t.push({ c: 'dosis', n: 'sello', titulo: 'Ingestión tóxica casi segura', texto: `${s.dosis} g: por encima de 15 g la toxicidad es casi segura. El glutatión se agota y, sin NAC, el hígado se daña en la fase 2 (24-72 h).`, pag: tx(5, 'mt-para-dosis'), origen: 'ficha · p. 5', bajo: '#hpv-m-via' });
    else if (s.dosis >= TX.tox) t.push({ c: 'dosis', n: 'aviso', titulo: 'Dosis tóxica', texto: `${s.dosis} g: dentro del rango tóxico (7,5-15 g; muchos centros usan 10 g). La conjugación está saturada y el glutatión baja.`, pag: tx(5, 'mt-para-dosis'), origen: 'ficha · p. 5', bajo: '#hpv-m-via' });
    if (s.h >= 72 && s.glut < TX.glutDano) t.push({ c: 'fase3', n: 'sello', titulo: 'Fase 3 (72-96 h)', texto: 'Con el glutatión agotado y sin freno, a las 72-96 h aparecen encefalopatía y lactato: el hepatocito deja de depurar y sube el amonio (el astrocito se hincha).', pag: tx(5, 'mt-para-fases'), origen: 'ficha · p. 5; el grado exacto: ilustrativo', bajo: '#hpv-m-via' });
    if (s.par > TX.hdPar) t.push({ c: 'hd', n: 'sello', titulo: 'Más de 900 µg/mL', texto: 'Con encefalopatía, hemodiálisis (y NAC a 12,5 mg/kg/h como mínimo, p. 8). Es un nivel de paciente en peligro: lo pide la ficha, no es una cifra de adorno.', pag: tx(8, 'mt-nac-hd-txt'), origen: 'ficha · p. 8', bajo: '#hpv-m-via' });
    else if (s.h === 4 && s.par > TX.nomo && !s.rep) t.push({ c: 'nomo', n: 'aviso', titulo: 'Sobre la línea de las 4 h', texto: `${s.par} µg/mL a las 4 h está por encima de 150: se trata con NAC. La línea baja hasta 5 a las 24 h; el nivel solo vale con una ingestión aguda de hora conocida.`, pag: tx(6, 'mt-para-nomograma'), origen: 'ficha · p. 6', bajo: '#hpv-m-via' });
    if (s.rep || s.h > 24) t.push({ c: 'nomo2', n: 'aviso', titulo: s.rep ? 'Dosis repetidas: el nivel no predice' : 'Pasadas 24 h el nomograma no sirve', texto: s.rep ? 'Con dosis repetidas no hay hora de ingestión: el nomograma no vale y se decide por la clínica y la ALT.' : 'El nomograma llega hasta las 24 h: después se decide por la ALT y la clínica, aunque el paracetamol sea indetectable.', pag: tx(6, 'mt-para-nomograma'), origen: 'ficha · p. 6', bajo: '#hpv-m-via' });
    if (s.bebedor) t.push({ c: 'alcohol', n: 'aviso', titulo: 'Con alcohol, tóxico por debajo de 4 g', texto: 'El alcohol crónico induce el P450 y baja el glutatión: la dosis tóxica es menor (desnutrición e inductores, igual).', pag: tx(5, 'mt-para-riesgo'), origen: 'ficha · p. 5; cuánto baja el umbral: ilustrativo', bajo: '#hpv-m-via' });
    if (s.nac) t.push({ c: 'nac', n: 'aviso', titulo: 'NAC en marcha', texto: 'IV: 150 mg/kg en 1 h, 50 mg/kg en 4 h y 100 mg/kg en 16 h (300 mg/kg en 21 h). Se para con paracetamol <10, AST/ALT normales o −25-50 %, INR <2 y el paciente bien; si no, 6,25 mg/kg/h como mínimo.', pag: tx(7, 'mt-tabla-52-1'), origen: 'ficha · p. 7', bajo: '#hpv-m-via' });
  }
  if (s.via === 'alcoholes') {
    if (s.ph < TX.phDialisis) t.push({ c: 'phdial', n: 'sello', titulo: `pH ${String(s.ph).replace('.', ',')}: diálisis ya`, texto: 'Con pH <7,1 o daño orgánico, hemodiálisis; con fomepizol cada 4 h mientras dura. Es un paciente en acidosis grave.', pag: tx(28, 'mt-alc-hd'), origen: 'ficha · p. 28', bajo: '#hpv-m-via' });
    if (s.alc === 'met' && s.vision && !s.hd) t.push({ c: 'vision', n: 'aviso', titulo: 'Alteración visual: diálisis', texto: 'En el metanol, la alteración visual también indica diálisis (aparece a las 6-24 h).', pag: tx(29, 'mt-alc-hd'), origen: 'ficha · p. 28-29', bajo: '#hpv-m-via' });
    if (s.fomep && !s.hd && s.ph >= TX.phDialisis) t.push({ c: 'fomep', n: 'aviso', titulo: 'Fomepizol', texto: 'Bloquea la alcohol deshidrogenasa: deja de fabricarse el ácido. Mejor en las primeras 4 h; no corrige el ácido que ya hay.', pag: tx(28, 'mt-tabla-53-2'), origen: 'ficha · p. 27-28', bajo: '#hpv-m-via' });
    if (s.hd) t.push({ c: 'hdal', n: 'aviso', titulo: 'Hemodiálisis', texto: 'Quita el alcohol y los ácidos. Con diálisis el fomepizol pasa a cada 4 h.', pag: tx(28, 'mt-alc-hd'), origen: 'ficha · p. 28-29', bajo: '#hpv-m-via' });
  }
  return t;
}
