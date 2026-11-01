// Eje B · el estado del enfermo, las constantes del monitor, los dos ejes y los topes. Todo lo numérico del suero, la noradrenalina y el reloj es ilustrativo;
// el SENTIDO de cada cambio (qué sube, qué baja con el tratamiento) es el de la ficha (Marino cap. 51, p. 50-57).
import { PRES } from '../../../data/eje-vivo-data.js';
export const U = { vol: 3000, na: 1.0, na02: 0.2, dia: 28 };
export const PROD = [20, 60, 150, 350];   // mg/día de cortisol: 15-25 en reposo y 350 con estrés máximo son de la ficha (p. 48); 60 y 150, ilustrativos
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export function nuevo(c) { return { pac: c, vol: PRES[c].vol0, na: PRES[c].na0, hc: 0, hcD: null, atd: 'ninguno', atdD: null, yodo: false, yodoD: null, bb: 'ninguno', bbD: null, hor: 'ninguna', horD: null, crisis: false, intento: '', dia: 0, ret: false, estres: 0, acth: false, pat: '', parada: false, farm: c === 'policarpo' ? 'amio' : '' }; }
const fEje = (s) => s.pac === 'policarpo' && (s.farm === 'eto' || s.farm === 'keto');   // etomidato y ketoconazol inhiben la síntesis de cortisol (p. 50)
export const FARM = { amio: 'Amiodarona', hep: 'Heparina', eto: 'Etomidato', keto: 'Ketoconazol' };
// prueba de ACTH: cortisol basal y a los 60 min (µg/dL). Bibiana es del caso; el resto, ilustrativo; los cortes (aumento <9) son de la ficha (p. 50-51).
export function acthVals(s) { const v = { bibiana: [22, 28], fulgencio: [20, 32], policarpo: fEje(s) ? [8, 14] : [14, 26] }[s.pac]; return v ? { b: v[0], post: v[1], d: v[1] - v[0] } : null; }
const rp = (s, d, n) => (d == null ? 0 : clamp((s.dia - d) / n, 0, 1));   // cuánto del efecto ya se ha dado a los n días de empezar
// ---- laboratorio del tiroides: T4 libre (ng/dL) y TSH (mU/mL). Los de los casos son del caso; las de los patrones, ilustrativas. ----
const LAB0 = { sinforoso: { t4: 2.9, tsh: 0.005 }, lucrecia: { t4: 3.2, tsh: 0.005 }, obdulia: { t4: 0.2, tsh: 48 }, fulgencio: { t4: 0.6, tsh: 2.1 }, policarpo: { t4: 2.4, tsh: 1.8 } };
export const PAT = { t3tox: { t4: 1.5, tsh: 0.05 }, hipoS: { t4: 0.4, tsh: 0.1 } };
export function lab(s) {
  const b = s.pat ? PAT[s.pat] : fEje(s) ? { t4: 1.3, tsh: 1.5 } : LAB0[s.pac]; if (!b) return null;
  let { t4, tsh } = b;
  if (s.atd !== 'ninguno' && t4 > 1.8) t4 -= (t4 - 1.4) * rp(s, s.atdD, 14);
  if (s.hor === 'levo' && t4 < 0.8) { t4 += (1.1 - t4) * rp(s, s.horD, 14); if (tsh > 4.5) tsh -= (tsh - 2.5) * rp(s, s.horD, 14); }
  return { t4, tsh };
}
export const FILAS = { normal: ['Normal', 'N', 'N'], hyper: ['Hipertiroidismo primario', '↑', '↓'], t3tox: ['T3-toxicosis', 'N', '↓'], hiperx: ['Hipertiroxinemia eutiroidea', '↑', 'N'], hipoP: ['Hipotiroidismo primario', '↓', '↑'], hipoS: ['Hipotiroidismo secundario', '↓', '↓'], euS: ['Eutiroideo enfermo', '↓', 'N'] };
export function filaPatron(t4, tsh) {
  const a = t4 > 1.8 ? 'u' : t4 < 0.8 ? 'd' : 'n', b = tsh > 4.5 ? 'u' : tsh < 0.3 ? 'd' : 'n';
  return { nn: 'normal', ud: 'hyper', nd: 't3tox', un: 'hiperx', du: 'hipoP', dd: 'hipoS', dn: 'euS' }[a + b] || null;
}
export function leer(s) {
  const P = PRES[s.pac], hcOn = !!s.hc, toribio = s.pac === 'toribio';
  const falta = !!P.estres && !hcOn && s.estres >= 1;               // Bibiana: el estrés sin cobertura (p. 50)
  const sinHcLevo = s.pac === 'obdulia' && s.hor !== 'ninguna' && !hcOn;   // hormona antes que la hidrocortisona (p. 57): la PA cae
  const resol = toribio && hcOn ? 12 * rp(s, s.hcD, 3) * clamp(1 - s.na / 0.4, 0, 1) : 0;   // la sepsis cede con los días: sin vasopresor mantiene la PA (ilustrativo)
  const crudo = P.pam + resol + 6 * (1 - Math.exp(-s.vol / 1500)) + 21.8 * (1 - Math.exp(-s.na / 0.5)) + P.hcEf * s.hc - (falta ? 9 * s.estres : 0) - (sinHcLevo ? 12 : 0) - (s.parada ? 8 : 0);
  const pam = Math.round(clamp(crudo, 30, 140) * 10) / 10;
  let fc = P.fc, t = P.t, na = P.na, lact = P.lact;
  // tirotoxicosis: antitiroideo, yodo, betabloqueante e hidrocortisona bajan T y FC en días (sentido p. 53-55)
  if (s.pac === 'lucrecia' || s.pac === 'sinforoso') {
    const ef = 0.3 * (s.atd !== 'ninguno' ? rp(s, s.atdD, 4) : 0) + 0.25 * (s.yodo ? rp(s, s.yodoD, 4) : 0) + 0.15 * (s.bb !== 'ninguno' ? rp(s, s.bbD, 4) : 0) + (s.pac === 'lucrecia' && hcOn ? 0.3 * rp(s, s.hcD, 4) : 0);
    if (s.pac === 'lucrecia') t = Math.round((ef < 0.6 ? P.t - 1.5 * ef : P.t - 0.9 - 6.25 * (ef - 0.6)) * 10) / 10;
    fc = Math.round(P.fc - (s.pac === 'lucrecia' ? 55 : 40) * ef);
  }
  // mixedema: hidrocortisona y hormona suben T, FC y Na⁺ en días (sentido p. 56-57)
  if (s.pac === 'obdulia') { const e2 = 0.4 * (hcOn ? rp(s, s.hcD, 4) : 0) + 0.6 * (s.hor !== 'ninguna' ? rp(s, s.horD, 4) : 0); t = Math.round((P.t + 3.2 * e2) * 10) / 10; fc = Math.round(P.fc + 27 * e2); na = Math.round(P.na + 14 * e2); }
  // CIRCI: con la hidrocortisona el lactato baja en días (p. 51: se retira con el lactato normal)
  if (toribio && hcOn) { lact = Math.round((P.lact - 2.6 * rp(s, s.hcD, 3)) * 10) / 10; fc = Math.round(P.fc - 23 * rp(s, s.hcD, 3)); }   // FC 118 → ≈95 al resolverse: ilustrativo
  if (s.parada) fc += 12;   // rebote por la retirada brusca (p. 51): cifras ilustrativas
  if (falta) { fc += 8 * s.estres; lact = Math.round((P.lact + 0.7 * s.estres) * 10) / 10; } else if (P.estres) fc += 3 * s.estres;
  if (fc > 90) { const d = { prop: 35, meto: 30, esmolol: 45 }[s.bb] || 0; fc = Math.max(80, fc - d); }
  return { crudo, pam, pas: Math.round(pam * 1.48), pad: Math.round(pam * 0.76), fc, ritmo: P.ritmo, t, na, gluc: P.gluc, lact, falta };
}
// ---- los dos ejes: niveles 0-1 (solo dibujo), texto del laboratorio solo cuando el caso lo da ----
const SR = {
  toribio: { need: .9, crh: .2, acth: .2, cort: .3, bl: ['hip', 'glan', 'org'], atro: 0, lab: 'Acción insuficiente (Fig. 51.1) · el «↓» del dibujo: ilustrativo' },
  bibiana: { need: .15, crh: .05, acth: .05, cort: .2, bl: ['hip'], atro: .8, ext0: .5, lab: 'Cortisol aleatorio 22 µg/dL' },
  sinforoso: { need: .3, crh: .3, acth: .3, cort: .3, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
  lucrecia: { need: .8, crh: .6, acth: .6, cort: .45, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
  obdulia: { need: .6, crh: .5, acth: .5, cort: .3, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
  policarpo: { need: .3, crh: .3, acth: .3, cort: .3, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
  fulgencio: { need: .6, crh: .4, acth: .35, cort: .8, bl: [], atro: 0, lab: 'Cortisol: no pedido' },
};
const TI = {
  toribio: { trh: .5, tsh: .5, t4: .5, t3: .5, tam: 1, tij: 0, lab: 'Tiroides: no pedido' },
  bibiana: { trh: .5, tsh: .5, t4: .5, t3: .5, tam: 1, tij: 0, lab: 'Tiroides: no pedido' },
  sinforoso: { t3: 1, tam: 1.25, tij: 0 }, lucrecia: { t3: 1, tam: 1.25, tij: 0 }, obdulia: { t3: .2, tam: .55, tij: 0 },
  policarpo: { t3: .2, tam: 1, tij: 1, r3: 0 }, fulgencio: { t3: .15, tam: 1, tij: 1, r3: 1 },
};
const fmt = (x) => (x < 0.01 ? '<0,01' : x < 1 ? String(Math.round(x * 100) / 100) : String(Math.round(x * 10) / 10)).replace('.', ',');
export function eje(s) {
  const a = { ...SR[s.pac] }, t = { ...TI[s.pac] }, lb = lab(s);
  a.ext = a.ext0 || 0; a.bloqueos = [...a.bl];
  if (s.pac === 'bibiana') { a.need = .15 + .15 * s.estres; a.lab = `Cortisol aleatorio 22 µg/dL · necesita ≈${PROD[s.estres]} mg/día${s.estres === 0 || s.estres === 3 ? '' : ' (ilustrativo)'}`; }
  if (fEje(s)) { a.cort = .1; a.crh = .6; a.acth = .8; a.bloqueos = ['glan']; a.lab = 'Cortisol aleatorio 8 µg/dL (ilustrativo)'; }
  if (s.hc && !s.parada) { a.ext = 1; a.crh *= .4; a.acth *= .4; a.cort = Math.max(a.cort, .9); }
  if (s.parada) a.lab = 'Retirada brusca · tejido insuficiente · rebote (ilustrativo)';
  a.estado = a.cort >= a.need ? 'cubierto' : 'falta';
  if (lb) {
    const q = lb.t4 > 1.8 ? 1 : lb.t4 < 0.8 ? .1 : .5, r = lb.tsh > 4.5 ? 1 : lb.tsh < 0.3 ? 0 : .5;
    t.t4 = q; t.tsh = r; t.trh = r >= 1 ? .8 : r <= 0 ? .1 : .4;
    if (s.pat === 't3tox') { t.t3 = 1; t.tam = 1.25; } else if (s.pat === 'hipoS') { t.t3 = .2; t.tam = .8; } else if (t.t3 === 1 && q === .5) t.t3 = .5;
    t.lab = `${s.pac === 'fulgencio' ? 'T3 libre baja · ' : ''}T4 libre ${fmt(lb.t4)} ng/dL · TSH ${fmt(lb.tsh)} mU/mL`; t.fila = filaPatron(lb.t4, lb.tsh);
  }
  if (s.pac === 'policarpo' && s.farm !== 'amio') { t.tij = 0; t.t3 = .5; }   // solo la amiodarona bloquea la conversión (p. 54); la heparina desplaza la T4 de sus proteínas
  t.bloq = [];
  if (s.atd !== 'ninguno') t.bloq.push('sint'); if (s.atd === 'ptu') t.bloq.push('tij');
  if (s.yodo) t.bloq.push('sint', 'sec');
  if (s.bb === 'prop' && s.pac === 'lucrecia' && !t.bloq.includes('tij')) t.bloq.push('tij');
  if (s.hc && s.pac === 'lucrecia' && !t.bloq.includes('tij')) t.bloq.push('tij');
  t.ext = s.hor === 'levo' ? 'T4' : s.hor === 'lio' ? 'T3' : '';
  if (s.hor === 'levo' && !lb) { t.t4 = Math.max(t.t4, .55); t.tsh *= .6; } if (s.hor === 'lio') t.t3 = Math.max(t.t3, .6);
  return { a, t, lb };
}
// ---- topes: cada uno con título, consecuencia, página, origen y los botones que apaga ----
// Los títulos de sello van en mayúsculas en la app: ninguna unidad con «µ» en el título (saldría «Μ»); la unidad va en el texto.
export function topes(s, L) {
  const P = PRES[s.pac], T = [];
  const sello = (c, titulo, texto, pag, ficha, origen, off = []) => T.push({ c, n: 'sello', titulo, texto, pag, ficha, origen, off });
  const aviso = (c, titulo, texto, pag, ficha, origen, off = []) => T.push({ c, n: 'aviso', titulo, texto, pag, ficha, origen, off });
  const c1 = (x) => String(x).replace('.', ',');
  if (s.vol >= U.vol) sello('vol', 'Más suero no sube la PA', P.circ && L.pam < 65 ? 'La hipotensión que no responde a volumen apunta a la insuficiencia suprarrenal del crítico: hidrocortisona.' : 'Tope del modelo: 3 L de suero.', P.circ ? 50 : 0, 'mu-sr-clinica', P.circ ? 'ficha p. 50 · tope 3 L: fisiología general' : 'fisiología general', ['[data-a="vol"]']);
  else if (s.vol >= 2500) aviso('vol', 'Cerca del tope de suero', 'En este modelo el tope es 3 L.', 0, '', 'fisiología general');
  if (s.na >= U.na) sello('nat', 'Noradrenalina al máximo', P.circ && !s.hc && L.pam < 65 ? 'PA baja con el máximo de noradrenalina: insuficiencia suprarrenal del crítico, pon hidrocortisona.' : 'Tope del modelo: 1 µg/kg/min.', P.circ ? 51 : 0, 'mu-sr-practica', 'fisiología general', ['[data-a="na+"]']);
  else if (s.na > U.na02) aviso('na2', 'Noradrenalina >0,2 µg/kg/min', 'Con esa dosis, la nutrición baja a 10-15 kcal/kg/día, no 25 × peso.', 4, 'mu-gasto-energetico', 'ficha p. 4 y 19');
  if (L.t > 40) sello('tormenta', 'Tormenta tiroidea', `T ${c1(L.t)} °C y FC ${L.fc}: fiebre mayor de 40 °C, delirio e insuficiencia cardíaca de gasto alto; mortalidad hasta el 25 %. Antitiroideo, yodo, betabloqueante e hidrocortisona, y dar tiempo.`, 53, 'mu-ti-tormenta', 'ficha p. 53 · días y cuánto baja: ilustrativo');
  if (L.fc >= 140) aviso('fc140', 'FC de 140 o más', 'En la tormenta, la taquicardia grave lleva a insuficiencia cardíaca de gasto alto.', 53, 'mu-ti-tormenta', 'ficha p. 53');
  if (L.t < 35 && !s.hc) sello('mixedema', 'Mixedema: hidrocortisona primero', `T ${c1(L.t)} °C, Na⁺ ${L.na}, FC ${L.fc}: mortalidad hasta el 60 %. La hidrocortisona va antes de la hormona.`, 56, 'mu-hipo-coma', 'ficha p. 56-57');
  if (s.intento === 'levo' && !s.hc) sello('levo', 'Primero la hidrocortisona', 'Suele haber insuficiencia suprarrenal: la primera dosis de hidrocortisona va antes de la hormona tiroidea. Que la PA caiga sin ella es inferencia del modelo: la ficha solo dice que la hidrocortisona va antes.', 57, 'mu-hipo-coma-tto', 'ficha p. 57 · la caída de la PA: inferencia, ilustrativo', ['[data-a="levo"]', '[data-a="lio"]']);
  if (s.intento === 'yodo') sello('yodo', 'Con un antitiroideo', 'La ficha da el yodo añadido al antitiroideo, en combinación: pon antes propiltiouracilo o metimazol.', 55, 'mu-ti-yodo', 'ficha p. 55', ['[data-a="yodo"]']);
  if (s.intento === 'eutiro') sello('eutiro', 'Eutiroideo enfermo: no se trata', 'La T3 baja con TSH normal no es hipotiroidismo clínico: no está indicada ninguna hormona ni antitiroideo.', 57, 'mu-hipo-eutiroideo-tto', 'ficha p. 57', ['[data-a="levo"]', '[data-a="lio"]', '[data-atd]', '[data-a="yodo"]']);
  if (s.intento === 'hiperx') sello('hiperx', 'Amiodarona: no se trata', 'T4 alta con TSH normal por amiodarona no es hipertiroidismo: la ficha no la trata.', 54, 'mu-ti-hipertiroxinemia', 'ficha p. 54', ['[data-atd]', '[data-a="yodo"]', '[data-a="levo"]', '[data-a="lio"]']);
  if (s.pac === 'policarpo' && (s.farm === 'amio' || s.farm === 'hep')) aviso('amio', 'Hipertiroxinemia eutiroidea', `T4 libre alta con TSH normal por ${s.farm === 'amio' ? 'amiodarona' : 'heparina'}: no se trata.`, 54, 'mu-ti-hipertiroxinemia', 'ficha p. 54');
  if (s.crisis && (s.bb !== 'ninguno' || s.intento === 'bb')) sello('asma', 'Betabloqueantes contraindicados', 'En la crisis de asma todos los betabloqueantes están contraindicados.', 54, 'mu-tabla-51-3', 'ficha p. 54', ['[data-bb]']);
  if (s.pac === 'lucrecia' && s.atd === 'mti') aviso('ptu', 'En la tormenta, mejor propiltiouracilo', 'El metimazol es el preferido en la tirotoxicosis, no en la tormenta.', 55, 'mu-tabla-51-4', 'ficha p. 55');
  if (s.pac === 'lucrecia' && s.bb === 'prop' && !s.crisis) aviso('prop', 'Propranolol no selectivo', 'Con asma, el metoprolol es la alternativa (nunca en una crisis).', 54, 'mu-tabla-51-3', 'ficha p. 54');
  if (fEje(s) && !s.hc) sello('farmEje', 'Fármaco que corta el eje', `${FARM[s.farm]} inhibe la síntesis de cortisol (p. 50): cortisol aleatorio 8 µg/dL, menor de 10, la mejor señal de supresión. Con hipotensión que no responde al volumen, se trata con hidrocortisona.`, 50, 'mu-sr-causas', 'ficha p. 50 · el 8 es ilustrativo (el corte, <10, es de la ficha)');
  const av = acthVals(s);
  if (s.acth && av) { if (av.d < 9) sello('deltaBajo', 'Aumento menor de 9', `El cortisol sube de ${av.b} a ${av.post} µg/dL tras 250 µg de ACTH: aumento de ${av.d}, menor de 9 µg/dL. La suprarrenal no responde: supresión.`, 50, 'mu-sr-acth', 'ficha p. 50 · las cifras son del caso o ilustrativas');
    else aviso('deltaAlto', 'Aumento de 9 o más: no descarta la secundaria', `El cortisol sube de ${av.b} a ${av.post} µg/dL (aumento de ${av.d}, de 9 o más): respuesta normal, pero no excluye la supresión secundaria por fallo hipotálamo-hipofisario; la diagnostica la ACTH plasmática.`, 51, 'mu-sr-practica', 'ficha p. 51 · cifras ilustrativas'); }
  if (s.parada) sello('rebote', 'Retirada brusca: rebote', `La hidrocortisona retirada de golpe da un rebote de mediadores proinflamatorios: PA ${L.pas}/${L.pad} y FC ${L.fc}. Retírala poco a poco, al menos unos días.`, 51, 'mu-sr-retirada', 'ficha p. 51 · PA y FC: ilustrativo');
  // reloj, estrés y retirada
  if (s.dia >= U.dia) sello('dia', 'Reloj al máximo: 28 días', 'Tope del modelo: pasado un mes ya no se ve nada nuevo.', 0, '', 'fisiología general', ['[data-a="d1"]', '[data-a="d7"]']);
  if (s.pac === 'bibiana') {
    if (s.estres >= 3) sello('estresMax', 'Tope: 350 mg al día', `El estrés máximo no da más: una glándula sana produce como mucho 350 mg/día (reposo, 15-25; Langouche 2023 da en el crítico ~30-60, ver notas). Con PA ${L.pas}/${L.pad} y FC ${L.fc}, la suya no llega ni a eso: cobertura con hidrocortisona.`, 48, 'mu-sr-cortisol', 'ficha p. 48 · PA y FC: ilustrativo', ['[data-a="es+"]']);
    else if (s.estres === 2) aviso('estres2', 'Cerca del tope', 'A un paso del máximo de 350 mg/día de cortisol.', 48, 'mu-sr-cortisol', 'ficha p. 48');
    if (L.falta) aviso('sincob', 'Estrés sin cobertura', `PA ${L.pas}/${L.pad} y FC ${L.fc}: el estrés sube la demanda de cortisol y la glándula atrofiada no responde.`, 50, 'mu-sr-clinica', 'ficha p. 50 · cuánto cae: ilustrativo');
  }
  if (toribioRet(s, L)) aviso('retirar', 'Aún no retires', `Sigue el vasopresor, el lactato (${c1(L.lact)}) no es normal o la PA aún es baja: espera a quitar la noradrenalina, a un lactato por debajo de 2 y a una PAM de 65 o más.`, 51, 'mu-sr-retirada', 'ficha p. 51 · lactato normal; corte de 2 mmol/L: fisiología general', ['[data-a="ret"]']);
  if (L.crudo !== undefined && (s.vol > U.vol || s.na > U.na + 1e-9 || L.crudo < 30 || L.fc > 180 || L.fc < 30)) sello('imposible', 'Cifra imposible', 'Ningún paciente vivo tiene esa constante: el modelo se para.', 0, '', 'fisiología general');
  return T;
}
export const toribioRet = (s, L) => s.pac === 'toribio' && s.hc && !s.ret && (s.na > 0 || L.lact >= 2 || L.pam < 65);
