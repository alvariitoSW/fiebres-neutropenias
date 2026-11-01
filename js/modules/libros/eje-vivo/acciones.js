// Eje hormonal vivo · lo que hace cada mando (puro: cambia el estado del enfermo `s` y devuelve la frase viva y la lupa que toca). Los números del suero,
// la noradrenalina y el reloj son ilustrativos; el sentido de cada cambio es el de la ficha (Marino cap. 51, p. 48-57).
import { PRES } from '../../../data/eje-vivo-data.js';
import { leer, topes, clamp, toribioRet, U, acthVals } from './modelo.js';
const num = (x) => String(x).replace('.', ',');
const notrata = (s) => (s.pac === 'fulgencio' ? 'eutiro' : s.pac === 'policarpo' && (s.farm === 'amio' || s.farm === 'hep') ? 'hiperx' : '');
function relojFrase(s) {
  const L = leer(s), c = (x) => num(x), p = s.pac;
  const q = p === 'lucrecia' ? `T ${c(L.t)} °C y FC ${L.fc}.` : p === 'sinforoso' ? `FC ${L.fc}.` : p === 'obdulia' ? `T ${c(L.t)} °C, FC ${L.fc} y Na⁺ ${L.na}.` : p === 'toribio' && s.hc ? `lactato ${c(L.lact)} mmol/L.` : 'sin cambios a la vista.';
  return `Día ${s.dia}: ${q}`;
}
function dosis(a, v, s) {
  const t = s.pac === 'lucrecia', P = PRES[s.pac];
  const m = {
    vol: ['Suero 500 mL: la PA sube muy poco si falla el eje. El tope del modelo es 3 L.', 'cuánto sube: ilustrativo · tope: fisiología general'],
    'na+': [`Noradrenalina ${num(s.na.toFixed(1))} µg/kg/min: sube la PA, pero no arregla el eje.`, 'cuánto sube: ilustrativo'], 'na-': [`Noradrenalina ${num(s.na.toFixed(1))} µg/kg/min.`, 'ilustrativo'],
    hc: t ? ['Hidrocortisona 300 mg IV de carga y 100 mg cada 8 h, solo en la tormenta: entra por fuera y frena la ACTH.', 'dosis: ficha p. 55 · freno: Libro Azul p. 4-6, Younes'] : [`Hidrocortisona 100 mg IV cada 8 h: entra por fuera y frena la ACTH${P.circ ? '; la PA sube' : ''}.`, `dosis: ficha p. ${s.pac === 'obdulia' ? 57 : 51} · freno: Libro Azul p. 4-6, Younes · cuánto sube la PA: ilustrativo`],
    ptu: t ? ['Propiltiouracilo: carga de 500-1.000 mg y 250 mg cada 4 h. Bloquea la síntesis de T4 y su conversión a T3.', 'ficha p. 55 (Tabla 51.4)'] : ['Propiltiouracilo 50-150 mg cada 8 h. Bloquea la síntesis de T4 y su conversión a T3.', 'ficha p. 55 (Tabla 51.4)'],
    mti: t ? ['Metimazol 60-80 mg al día en la tormenta; bloquea la síntesis de T4.', 'ficha p. 55 (Tabla 51.4)'] : ['Metimazol 10-20 mg una vez al día; bloquea la síntesis de T4.', 'ficha p. 55 (Tabla 51.4)'],
    yodo: ['Yoduro potásico saturado, 5 gotas (250 mg de yodo) cada 6 h, junto al antitiroideo: bloquea la síntesis y la secreción de T4.', 'ficha p. 55 (Tabla 51.4)'],
    prop: t ? ['Propranolol 60-80 mg por vía oral cada 4 h: frena la taquicardia y, a dosis altas, la conversión de T4 a T3.', 'ficha p. 54 (Tabla 51.3; la modelo enseña solo la vía oral)'] : ['Propranolol 10-40 mg por vía oral, 3-4 veces al día: frena la taquicardia.', 'ficha p. 54 (Tabla 51.3)'],
    meto: ['Metoprolol 25-50 mg por vía oral, 2-3 veces al día: relativamente β1, útil con asma o insuficiencia cardíaca.', 'ficha p. 54 (Tabla 51.3)'], esmolol: ['Esmolol 50-100 µg/kg/min en infusión continua: se ajusta en minutos.', 'ficha p. 54 (Tabla 51.3)'],
    levo: ['Levotiroxina en bolo IV lento de 200-400 µg; después 50-100 µg al día por vía oral (la IV, el 75 % de esa dosis).', 'ficha p. 57'],
    d1: [relojFrase(s), 'el reloj y cuánto cambia: ilustrativo · sentido: ficha p. 51-57'], d7: [relojFrase(s), 'el reloj y cuánto cambia: ilustrativo · sentido: ficha p. 51-57'], retg: [relojFrase(s), 'el reloj y cuánto cambia: ilustrativo · sentido: ficha p. 51'],
    ret: ['Retirada gradual de la hidrocortisona: se hace al resolverse la causa, sin vasopresor y con el lactato normal.', 'ficha p. 51'],
    'es+': [`Estrés ${s.estres}: sube la demanda de cortisol; una glándula sana llega como mucho a 350 mg/día.`, 'ficha p. 48 · cuánto cae la PA sin cobertura: ilustrativo'], 'es-': [`Estrés ${s.estres}: baja la demanda de cortisol.`, 'ficha p. 48'],
    acth: (() => { const q = acthVals(s); return q ? [`Prueba de ACTH, 250 µg: el cortisol sube de ${q.b} a ${q.post} µg/dL, un aumento de ${q.d}${q.d < 9 ? ', menor de 9: supresión' : ', de 9 o más: no descarta la secundaria'}.`, 'ficha p. 50-51 · cifras ilustrativas'] : null; })(),
    farm: [`${{ amio: 'Amiodarona', hep: 'Heparina', eto: 'Etomidato', keto: 'Ketoconazol' }[v]}: ${{ amio: 'bloquea la conversión de T4 a T3; T4 alta, TSH normal y T3 baja. No se trata.', hep: 'activa la lipoproteína lipasa y los ácidos grasos libres desplazan la T4: T4 alta con TSH normal. No se trata.', eto: 'inhibe la síntesis de cortisol: cortisol bajo y ACTH alta.', keto: 'inhibe la síntesis de cortisol: cortisol bajo y ACTH alta.' }[v]}`, 'ficha p. 50 y 54'],
    pat: [s.pat === 't3tox' ? 'T3-toxicosis: T4 libre normal con TSH baja (Tabla 51.2).' : s.pat === 'hipoS' ? 'Hipotiroidismo secundario: T4 libre baja con TSH baja, el fallo es hipotálamo-hipofisario.' : 'El laboratorio del caso.', 'ficha, Tabla 51.2 (p. 53) · las cifras son ilustrativas'], lio: ['Liotironina IV: carga de 5-20 µg y 2,5-10 µg cada 8 h hasta que despierte.', 'ficha p. 57'],
  };
  return m[a === 'atd' || a === 'bb' ? v : a];
}
export function hacer(s, a, v) {
  let lup = null;
  const P = PRES[s.pac]; s.intento = '';
  if (a === 'vol') { if (s.vol >= 3000) return; s.vol += 500; }
  else if (a === 'na+') s.na = clamp(Math.round((s.na + 0.1) * 10) / 10, 0, 1); else if (a === 'na-') s.na = clamp(Math.round((s.na - 0.1) * 10) / 10, 0, 1);
  else if (a === 'hc') { s.hc = 1; s.hcD = s.dia; }
  else if (a === 'd1' || a === 'd7') s.dia = Math.min(U.dia, s.dia + (a === 'd1' ? 1 : 7));
  else if (a === 'retg') { s.dia = Math.min(U.dia, s.dia + 3); s.na = 0; }
  else if (a === 'ret') { if (s.pac === 'toribio' && s.hc && !toribioRet(s, leer(s))) s.ret = true; }
  else if (a === 'es+') s.estres = Math.min(3, s.estres + 1); else if (a === 'es-') s.estres = Math.max(0, s.estres - 1);
  else if (a === 'farm') { s.farm = v; s.acth = false; lup = v === 'eto' || v === 'keto' ? 'sr' : 'ti'; } else if (a === 'acth') { s.acth = true; lup = 'sr'; } else if (a === 'pat') s.pat = v;
  else if (a === 'atd') { if (notrata(s) && v !== 'ninguno') s.intento = notrata(s); else { s.atd = v; s.atdD = v === 'ninguno' ? null : s.dia; } }
  else if (a === 'yodo') { if (notrata(s)) s.intento = notrata(s); else if (s.atd === 'ninguno') s.intento = 'yodo'; else { s.yodo = !s.yodo; s.yodoD = s.yodo ? s.dia : null; } }
  else if (a === 'bb') { if (s.crisis && v !== 'ninguno') s.intento = 'bb'; else { s.bb = v; s.bbD = v === 'ninguno' ? null : s.dia; } }
  else if (a === 'levo' || a === 'lio') { if (notrata(s)) s.intento = notrata(s); else if (P.t < 35 && !s.hc) s.intento = 'levo'; else { s.hor = s.hor === a ? 'ninguna' : a; s.horD = s.hor === 'ninguna' ? null : s.dia; } }
  else if (a === 'asma') s.crisis = !s.crisis;
  const m = dosis(a, v, s);
  let f = m;
  if (s.intento) { const t = topes(s, leer(s)).find((x) => x.c === s.intento || (s.intento === 'bb' && x.c === 'asma')); if (t) f = [`No se aplica: ${t.texto}`, t.origen]; }
  return { frase: f, lup, anima: ['hc', 'atd', 'yodo', 'bb', 'levo', 'lio'].includes(a) && !s.intento };
}
