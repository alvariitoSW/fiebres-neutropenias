// Modelo del sinusoide. Dirección de cada efecto: Marino cap. 39 (p. 6-8, 10). Factores numéricos: ilustrativos (la fuente no los da).
export const TOPE_NH3 = 150, NORMAL = 60, TECHO = 300, A0 = 34.65;
export const nuevo = () => ({ fn: 100, dep: 0, rif: 0, rifd: 10, cvvh: 0, tips: 0, oliguria: 0, wh: null, pa: null, fc: null });
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const fmt = (v) => String(Math.round(v));
export function leer(s) {
  let prod = 1 - 0.04 * Math.min(s.dep, 3); if (s.rif) prod *= 0.95;           // lactulosa y rifaximina bajan la producción en el colon (p. 7)
  const limpia = Math.max(0.1, (s.fn / 100) * (s.tips ? 0.6 : 1));              // el TIPS salta el cordón (p. 10)
  const crudo = A0 * prod / limpia, sinCvvh = Math.min(TECHO, crudo);
  const nh3 = Math.min(TECHO, crudo * (s.cvvh ? 0.4 : 1));                     // la CVVH retira amonio de la sangre (p. 8)
  const whDer = nh3 < NORMAL ? 0 : nh3 < 100 ? 1 : nh3 < 140 ? 2 : nh3 < 210 ? 3 : 4;
  const hinchado = nh3 > TOPE_NH3;
  const d = Math.max(0, s.dep - 3);
  const pa = s.pa || [118 - 9 * d, 72 - 6 * d], fc = s.fc || 78 + 10 * d;
  return { nh3, sinCvvh, wh: s.wh ?? whDer, hinchado, pa, fc, celulas: Math.ceil(s.fn / 12.5), r: 30 + clamp((nh3 - NORMAL) / (TECHO - NORMAL), 0, 1) * 20 };
}
export function topes(s, l) {
  const t = [];
  if (l.hinchado) t.push({ c: 'edema', n: 'sello', titulo: 'Riesgo de edema cerebral', texto: `Amonio ${fmt(l.nh3)} µmol/L (>150): el astrocito se hincha. Lactulosa y rifaximina no bastan: CVVH.`, pag: '7|ma-eh-nh3', origen: 'ficha · p. 7 y 8; la cifra del mando es ilustrativa', off: ['#m-dep-mas', '#m-dep-menos', '#m-rif', '#m-rifd'] });
  if ((l.hinchado || s.oliguria) && !s.cvvh) t.push({ c: 'cvvh-ya', n: 'aviso', titulo: 'CVVH indicada', texto: 'Oliguria persistente, amonio >150 o edema cerebral: CVVH cuanto antes, sea cual sea la creatinina.', pag: '8|ma-eh-cvvh', origen: 'ficha · p. 8', bajo: '#m-cvvh' });
  if (s.cvvh && l.sinCvvh <= TOPE_NH3 && !s.oliguria) t.push({ c: 'cvvh-no', n: 'aviso', titulo: 'No indicada todavía', texto: 'Con amonio ≤150, sin oliguria ni edema, la CVVH aún no está indicada.', pag: '8|ma-eh-cvvh', origen: 'ficha · p. 8', bajo: '#m-cvvh' });
  if (s.dep === 4 || s.dep === 5) t.push({ c: 'diarrea', n: 'aviso', titulo: 'Diarrea osmótica: reducir o parar', texto: 'Se ajusta a 2-3 deposiciones blandas al día; con más, baja la dosis.', pag: '7|ma-eh-lactulosa', origen: 'ficha · p. 7', bajo: '#m-dep' });
  if (s.dep >= 6) t.push({ c: 'hipovol', n: 'sello', titulo: 'Hipovolemia', texto: `Seis deposiciones al día: la paciente pierde volumen, PA ${l.pa[0]}/${l.pa[1]}, FC ${l.fc}.`, pag: '7|ma-eh-lactulosa', origen: 'dosis: ficha p. 7; PA y FC: fisiología general, ilustrativo', off: ['#m-dep-mas'] });
  if (s.rif && s.rifd < 10) t.push({ c: 'rif', n: 'aviso', titulo: 'Rifaximina: mínimo 10 días', texto: `Se da 400 mg tres veces al día al menos 10 días; llevas ${s.rifd}.`, pag: '7|ma-eh-rifaximina', origen: 'ficha · p. 7', bajo: '#m-rif' });
  if (s.tips) t.push({ c: 'tips', n: 'aviso', titulo: 'TIPS: cambia un problema por otro', texto: 'Alivia la presión portal, pero salta el hígado y aumenta el riesgo de encefalopatía.', pag: '10|ma-var-tips', origen: 'ficha · p. 10', bajo: '#m-tips' });
  if (l.sinCvvh >= TECHO && !s.cvvh) t.push({ c: 'techo', n: 'aviso', titulo: 'Techo del mando', texto: 'Marino no da un amonio máximo: 300 µmol/L es el techo ilustrativo de esta pantalla.', pag: '7|ma-eh-nh3', origen: 'ilustrativo', bajo: '#m-fn' });
  return t;
}
