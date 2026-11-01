// Eje B · el estado del enfermo, las constantes del monitor, los dos ejes y los topes. Todo lo numérico del suero y la noradrenalina es ilustrativo.
import { PRES } from './datos.js';
export const U = { vol: 3000, na: 1.0, na02: 0.2 };
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export function nuevo(c) { const P = PRES[c]; return { pac: c, vol: P.vol0, na: P.na0, hc: 0, atd: 'ninguno', yodo: false, bb: 'ninguno', hor: 'ninguna', crisis: false, intento: '' }; }
export function leer(s) {
  const P = PRES[s.pac];
  const crudo = P.pam + 6 * (1 - Math.exp(-s.vol / 1500)) + 21.8 * (1 - Math.exp(-s.na / 0.5)) + P.hcEf * s.hc;
  const pam = Math.round(clamp(crudo, 30, 140) * 10) / 10;
  let fc = P.fc; if (fc > 90) { const d = { prop: 35, meto: 30, esmolol: 45 }[s.bb] || 0; fc = Math.max(80, fc - d); }
  return { crudo, pam, pas: Math.round(pam * 1.48), pad: Math.round(pam * 0.76), fc, ritmo: P.ritmo, t: P.t, na: P.na, gluc: P.gluc, lact: P.lact };
}
// ---- los dos ejes: niveles 0-1 (solo dibujo), texto del laboratorio solo cuando el caso lo da ----
const SR = {
  toribio: { need: .9, crh: .35, acth: .3, cort: .35, bl: ['hip', 'glan', 'org'], atro: 0, lab: 'Cortisol: no hace falta pedirlo' },
  bibiana: { need: .6, crh: .05, acth: .05, cort: .2, bl: ['hip'], atro: .8, ext0: .5, lab: 'Cortisol aleatorio 22 µg/dL' },
  sinforoso: { need: .3, crh: .3, acth: .3, cort: .3, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
  lucrecia: { need: .8, crh: .6, acth: .6, cort: .45, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
  obdulia: { need: .6, crh: .5, acth: .5, cort: .3, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
  fulgencio: { need: .6, crh: .4, acth: .35, cort: .8, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
};
const TI = {
  toribio: { trh: .5, tsh: .5, t4: .5, t3: .5, tam: 1, tij: 0, lab: 'Tiroides: no pedido' },
  bibiana: { trh: .5, tsh: .5, t4: .5, t3: .5, tam: 1, tij: 0, lab: 'Tiroides: no pedido' },
  sinforoso: { trh: .1, tsh: 0, t4: 1, t3: 1, tam: 1.25, tij: 0, lab: 'TSH <0,01 · T4 libre 2,9 ng/dL' },
  lucrecia: { trh: .1, tsh: 0, t4: 1, t3: 1, tam: 1.25, tij: 0, lab: 'Graves: T4 alta, TSH baja' },
  obdulia: { trh: .8, tsh: 1, t4: .1, t3: .2, tam: .55, tij: 0, lab: 'TSH 48 mU/mL · T4 libre 0,2 ng/dL' },
  fulgencio: { trh: .4, tsh: .5, t4: .3, t3: .15, tam: 1, tij: 1, lab: 'T3 libre baja · T4 libre 0,6 ng/dL · TSH 2,1 mU/mL' },
};
export function eje(s) {
  const a = { ...SR[s.pac] }, t = { ...TI[s.pac] };
  a.ext = a.ext0 || 0; a.bloqueos = [...a.bl];
  if (s.hc) { a.ext = 1; a.crh *= .4; a.acth *= .4; a.cort = Math.max(a.cort, .9); }
  a.estado = a.cort >= a.need ? 'cubierto' : 'falta';
  t.bloq = [];
  if (s.atd !== 'ninguno') t.bloq.push('sint'); if (s.atd === 'ptu') t.bloq.push('tij');
  if (s.yodo) t.bloq.push('sint', 'sec');
  if (s.bb === 'prop' && s.pac === 'lucrecia' && !t.bloq.includes('tij')) t.bloq.push('tij');
  if (s.hc && s.pac === 'lucrecia' && !t.bloq.includes('tij')) t.bloq.push('tij');
  if (t.bloq.includes('sint')) { t.t4 *= .6; t.t3 *= .6; }
  if (t.bloq.includes('tij')) t.t3 *= .6;
  t.ext = s.hor === 'levo' ? 'T4' : s.hor === 'lio' ? 'T3' : '';
  if (s.hor === 'levo') { t.t4 = Math.max(t.t4, .55); t.tsh *= .6; } if (s.hor === 'lio') t.t3 = Math.max(t.t3, .6);
  return { a, t };
}
// ---- topes: cada uno con título, consecuencia, página, origen y los botones que apaga ----
export function topes(s, L) {
  const P = PRES[s.pac], T = [];
  const sello = (c, titulo, texto, pag, ficha, origen, off = []) => T.push({ c, n: 'sello', titulo, texto, pag, ficha, origen, off });
  const aviso = (c, titulo, texto, pag, ficha, origen) => T.push({ c, n: 'aviso', titulo, texto, pag, ficha, origen, off: [] });
  if (s.vol >= U.vol) sello('vol', 'Más suero no sube la PA', P.circ && L.pam < 65 ? 'La hipotensión que no responde a volumen apunta a la insuficiencia suprarrenal del crítico: hidrocortisona.' : 'Tope de la maqueta: 3 L de suero.', P.circ ? 50 : 0, 'mu-sr-clinica', P.circ ? 'ficha p. 50 · tope 3 L: fisiología general' : 'fisiología general', ['[data-a="vol"]']);
  else if (s.vol >= 2500) aviso('vol', 'Cerca del tope de suero', 'En la maqueta el tope es 3 L.', 0, '', 'fisiología general');
  if (s.na >= U.na) sello('nat', 'Noradrenalina al máximo', P.circ && !s.hc && L.pam < 65 ? 'PA baja con el máximo de noradrenalina: insuficiencia suprarrenal del crítico, pon hidrocortisona.' : 'Tope de la maqueta: 1 µg/kg/min.', P.circ ? 51 : 0, 'mu-sr-practica', 'fisiología general', ['[data-a="na+"]']);
  else if (s.na > U.na02) aviso('na2', 'Noradrenalina >0,2 µg/kg/min', 'Con esa dosis, la nutrición baja a 10-15 kcal/kg/día, no 25 × peso.', 4, 'mu-gasto-energetico', 'ficha p. 4 y 19');
  if (L.t > 40) sello('tormenta', 'Tormenta tiroidea', 'Fiebre mayor de 40 °C, delirio e insuficiencia cardíaca de gasto alto: mortalidad hasta el 25 %.', 53, 'mu-ti-tormenta', 'ficha p. 53');
  if (L.fc >= 140) aviso('fc140', 'FC de 140 o más', 'En la tormenta, la taquicardia grave lleva a insuficiencia cardíaca de gasto alto.', 53, 'mu-ti-tormenta', 'ficha p. 53');
  if (L.t < 35 && !s.hc) sello('mixedema', 'Mixedema: hidrocortisona primero', 'Hipotermia, Na⁺ bajo y conciencia deprimida: mortalidad hasta el 60 %. La hidrocortisona va antes de la hormona.', 56, 'mu-hipo-coma', 'ficha p. 56-57');
  if (s.intento === 'levo' && !s.hc) sello('levo', 'Primero la hidrocortisona', 'Suele haber insuficiencia suprarrenal: la primera dosis de hidrocortisona va antes de la hormona tiroidea.', 57, 'mu-hipo-coma-tto', 'ficha p. 57', ['[data-a="levo"]', '[data-a="lio"]']);
  if (s.intento === 'yodo') sello('yodo', 'Siempre con un antitiroideo', 'El yodo se da junto al antitiroideo, nunca solo.', 55, 'mu-ti-yodo', 'ficha p. 55', ['[data-a="yodo"]']);
  if (s.intento === 'eutiro') sello('eutiro', 'Eutiroideo enfermo: no se trata', 'La T3 baja con TSH normal no es hipotiroidismo clínico: no está indicada ninguna hormona ni antitiroideo.', 57, 'mu-hipo-eutiroideo-tto', 'ficha p. 57', ['[data-a="levo"]', '[data-a="lio"]', '[data-atd]', '[data-a="yodo"]']);
  if (s.crisis && (s.bb !== 'ninguno' || s.intento === 'bb')) sello('asma', 'Betabloqueantes contraindicados', 'En la crisis de asma todos los betabloqueantes están contraindicados.', 54, 'mu-tabla-51-3', 'ficha p. 54', ['[data-bb]']);
  if (s.pac === 'lucrecia' && s.atd === 'mti') aviso('ptu', 'En la tormenta, mejor propiltiouracilo', 'El metimazol es el preferido en la tirotoxicosis, no en la tormenta.', 55, 'mu-tabla-51-4', 'ficha p. 55');
  if (s.pac === 'lucrecia' && s.bb === 'prop' && !s.crisis) aviso('prop', 'Propranolol no selectivo', 'Con asma, el metoprolol es la alternativa (nunca en una crisis).', 54, 'mu-tabla-51-3', 'ficha p. 54');
  if (L.crudo !== undefined && (s.vol > U.vol || s.na > U.na + 1e-9 || L.crudo < 30 || L.fc > 180 || L.fc < 30)) sello('imposible', 'Cifra imposible', 'Ningún paciente vivo tiene esa constante: el modelo se para.', 0, '', 'fisiología general');
  return T;
}
