// La interfaz de Joaquín a las 08:25 (disección aórtica, b3-paso4 g5 pieza 5d): los mandos de la pestaña Fármacos y sus topes.
// Los datos (paciente, estado, citas) están en js/data/shock-vivo-diseccion.js; los efectos de cada fármaco en diseccion-farmacos.mjs.
// Marino cap. 20, p. 46-47 y 50-52, Tabla 20.5. Los botones los repinta pagina.js en su sitio (parchear): no se rehacen.
import { DISEC } from './diseccion-farmacos.mjs';
import { CITAS_DISEC as K, OBJETIVO_PAS, FC_BAJA, FC_BRADI, PAS_TOLERADA, sinBetabloqueo, conVaso, enObjetivo } from '../../../data/shock-vivo-diseccion.js';

const c1 = (x) => (+x).toFixed(1).replace('.', ',');
const BETA = { f: 'mc-sca-tratamiento', id: 'mc-betabloqueo-sca-pas', sitio: 'Betabloqueantes: cuándo no', p: '46-47' };
export const CLAVES_DISEC = ['dsEsmolol', 'dsNic', 'dsLab', 'dsNit', 'dsPas', 'dsBradi', 'dsCizalla', 'dsObjetivo', 'dsReloj'];
export const AJUSTE_DISEC = ['esmolol', 'nicardipino', 'labetalol', 'nitroprusiato', 'opioide', 'esmoloBolo'];
const SUBE = ['[data-ds="es-sube"]', '[data-ds="ni-sube"]', '[data-ds="lab"]', '[data-ds="nit"]:not([data-v="0"])'];
const NIT = [0, 0.2, 1, 2, 3, 4, 5];

// ---------------------------------------------------------------- los mandos (HTML de la pestaña Fármacos)
export function mandosDiseccion(a) {
  const es = a.esmolol || 0, ni = a.nicardipino || 0, lab = a.labetalol || 0, nit = a.nitroprusiato || 0;
  const b = (ds, tx, peq, { v, on, off } = {}) => `<button type="button" class="tog${off ? ' tope-apagado' : ''}" data-ds="${ds}"${v != null ? ` data-v="${v}"` : ''}${on != null ? ` aria-pressed="${on}"` : ''}${off ? ' disabled' : ''}>${tx}<small>${peq}</small></button>`;
  const f = (n, titulo, cuerpo) => `<div class="formato" style="gap:5px"><span class="tipo">${titulo}</span><div class="rejilla" style="--n:${n}">${cuerpo}</div></div>`;
  return [
    `<div class="rejilla" style="--n:2">${b('opioide', 'Opioide IV', 'quita el dolor', { on: !!a.opioide })}${b('cero', 'Quitar todo', 'vuelve a la llegada')}</div>`,
    f(3, 'Esmolol (Tabla 20.5)', b('es-bolo', 'Bolo', '500 µg/kg', { on: !!a.esmoloBolo }) + b('es-sube', es ? `${es} → ${Math.min(DISEC.esmolol.max, es + 25)}` : 'Empezar: 50', 'µg/kg/min · tras un bolo', { off: !a.esmoloBolo || es >= DISEC.esmolol.max }) + b('es-baja', 'Bajar', es ? `${es} → ${es > 50 ? es - 25 : 0}` : 'sin infusión', { off: !es })),
    f(3, 'Labetalol', b('lab', '+20 mg', `acumulado ${lab} de 300`, { v: 20, off: lab + 20 > DISEC.labetalol.max }) + b('lab', '+40 mg', 'cada 10 min', { v: 40, off: lab + 40 > DISEC.labetalol.max }) + b('lab', 'Parar', 'queda lo dado', { v: 0, off: !lab })),
    f(3, 'Nicardipino', b('ni-sube', ni ? `${c1(ni)} → ${c1(Math.min(DISEC.nicardipino.max, ni + 2.5))}` : 'Empezar: 5', 'mg/h · +2,5 cada 5 min', { off: ni >= DISEC.nicardipino.max }) + b('ni-baja', 'Bajar', ni ? `${c1(ni)} → ${ni > 5 ? c1(ni - 2.5) : 0}` : 'sin infusión', { off: !ni })),
    `<div class="seg" role="group" aria-label="Nitroprusiato, en µg/kg/min">${NIT.map((v) => `<button type="button" data-ds="nit" data-v="${v}" aria-pressed="${nit === v}">${v ? String(v).replace('.', ',') : 'Sin'}<small>${v ? 'µg/kg/min' : 'nitroprus.'}</small></button>`).join('')}</div>`,
    `<p class="dock-nota">Nitroprusiato: más de 3 µg/kg/min prolongado arriesga cianuro; no se usa con fallo hepático o renal ni con isquemia coronaria (p. 52): nada de eso consta en Joaquín. Nicardipino y nitroprusiato, solo con un betabloqueante (p. 52). Los efectos en el monitor son del modelo (ilustrativo); la dirección, de la ficha.</p>`,
  ];
}

// Lo que hace cada botón: el cambio de ajuste que pide (o null)
export function cambioDiseccion(d, a) {
  const es = a.esmolol || 0, ni = a.nicardipino || 0, lab = a.labetalol || 0, v = +d.v;
  switch (d.ds) {
    case 'opioide': return { opioide: !a.opioide };
    case 'cero': return { esmolol: 0, nicardipino: 0, labetalol: 0, nitroprusiato: 0, opioide: false, esmoloBolo: false };
    case 'es-bolo': return { esmoloBolo: !a.esmoloBolo };
    case 'es-sube': return a.esmoloBolo && es < DISEC.esmolol.max ? { esmolol: es ? es + DISEC.esmolol.paso : DISEC.esmolol.ini, esmoloBolo: false } : null;   // un bolo antes de cada subida (p. 51)
    case 'es-baja': return { esmolol: es > DISEC.esmolol.ini ? es - DISEC.esmolol.paso : 0 };
    case 'lab': return v ? (lab + v <= DISEC.labetalol.max ? { labetalol: lab + v } : null) : { labetalol: 0 };   // «Parar» deja de dar: el efecto se va (no queda dosis acumulada en el modelo)
    case 'ni-sube': return { nicardipino: ni ? Math.min(DISEC.nicardipino.max, ni + DISEC.nicardipino.paso) : DISEC.nicardipino.ini };
    case 'ni-baja': return { nicardipino: ni > DISEC.nicardipino.ini ? ni - DISEC.nicardipino.paso : 0 };
    case 'nit': return { nitroprusiato: v };
    default: return null;
  }
}

// ---------------------------------------------------------------- los topes (los pone pagina.js con core/tope.js)
export function topesDiseccion(R, X, horas, horaTxt) {
  const a = X.ajuste, out = {}, es = a.esmolol || 0, ni = a.nicardipino || 0, lab = a.labetalol || 0, nit = a.nitroprusiato || 0;
  const cif = `PA ${R.pas}/${R.pad}, FC ${R.fc}, IC ${c1(R.ic)}`;
  // esmolol: máx 200 µg/kg/min (p. 51); aviso al acercarse
  if (es >= DISEC.esmolol.max) out.dsEsmolol = { nivel: 'aviso', titulo: 'Esmolol en su máximo', texto: `${es} µg/kg/min es el máximo de la Tabla 20.5: ${cif}. Si hace falta más descenso, se añade otro fármaco.`, cita: K.tabla, origen: 'ficha · Tabla 20.5, p. 51', deshabilita: ['[data-ds="es-sube"]'], bajo: '#shv-dock-panel .rejilla' };
  else if (es >= DISEC.esmolol.max - DISEC.esmolol.paso) out.dsEsmolol = { nivel: 'aviso', titulo: 'Cerca del máximo del esmolol', texto: `${es} µg/kg/min: el máximo es ${DISEC.esmolol.max}.`, cita: K.tabla, origen: 'ficha · Tabla 20.5, p. 51', bajo: '#shv-dock-panel .rejilla' };
  // nicardipino: máx 15 mg/h (p. 52)
  if (ni >= DISEC.nicardipino.max) out.dsNic = { nivel: 'aviso', titulo: 'Nicardipino en su máximo', texto: `${c1(ni)} mg/h es el máximo de la Tabla 20.5: ${cif}.`, cita: K.tabla, origen: 'ficha · Tabla 20.5, p. 52', deshabilita: ['[data-ds="ni-sube"]'], bajo: '#shv-dock-panel .rejilla' };
  else if (ni >= DISEC.nicardipino.max - 2.5) out.dsNic = { nivel: 'aviso', titulo: 'Cerca del máximo del nicardipino', texto: `${c1(ni)} mg/h: el máximo es ${DISEC.nicardipino.max}.`, cita: K.tabla, origen: 'ficha · Tabla 20.5, p. 52', bajo: '#shv-dock-panel .rejilla' };
  // labetalol: máx 300 mg acumulados (p. 52)
  if (lab >= DISEC.labetalol.max - 20) out.dsLab = { nivel: 'aviso', titulo: lab >= DISEC.labetalol.max ? 'Labetalol en su máximo' : 'Cerca del máximo del labetalol', texto: `${lab} mg acumulados; el máximo es ${DISEC.labetalol.max} mg: ${cif}.`, cita: K.tabla, origen: 'ficha · Tabla 20.5, p. 52', deshabilita: lab >= DISEC.labetalol.max ? ['[data-ds="lab"]:not([data-v="0"])'] : [], bajo: '#shv-dock-panel .rejilla' };
  // nitroprusiato: aviso por encima de 3, tope 5 (p. 52)
  if (nit > 3) out.dsNit = { nivel: 'aviso', titulo: nit >= 5 ? 'Nitroprusiato en su tope' : 'Riesgo de cianuro', texto: `${String(nit).replace('.', ',')} µg/kg/min: más de 3 mantenido arriesga cianuro (se puede añadir tiosulfato); la dosis eficaz típica es 2-5.`, cita: K.tabla, origen: 'ficha · Tabla 20.5, p. 52', bajo: '#shv-dock-panel .seg' };
  // la cizalla: un vasodilatador sin betabloqueante (p. 52)
  if (conVaso(a) && sinBetabloqueo(a)) out.dsCizalla = { nivel: 'sello', titulo: 'Cizalla ↑', texto: `${cif}: bajar la PA sin betabloqueante da taquicardia refleja y más gasto, y eso aumenta las fuerzas de cizalla que propagan la disección.`, cita: K.manejo, origen: 'ficha · p. 51-52 · las cifras: modelo' };   // sin apagar el mando: hay que poder subirlo para ver cómo sube la FC
  // PAS bajo lo tolerado (p. 52) y bradicardia (p. 46-47)
  if (R.pas < PAS_TOLERADA) out.dsPas = { nivel: 'sello', titulo: 'Por debajo de lo tolerado', texto: `PAS ${R.pas}: la ficha pide 120 y dice que hasta 90 suele tolerarse. ${cif}. Baja la dosis.`, cita: K.objetivos, origen: 'ficha · p. 52 · las cifras: modelo', deshabilita: SUBE };
  else if (R.pas < PAS_TOLERADA + 10) out.dsPas = { nivel: 'aviso', titulo: 'Cerca de lo tolerado', texto: `PAS ${R.pas}: hasta 90 suele tolerarse. No subas la dosis.`, cita: K.objetivos, origen: 'ficha · p. 52 (el 90) · el aviso a 100: ilustrativo', bajo: '#shv-dock-panel .rejilla' };
  if (R.fc < FC_BRADI) out.dsBradi = { nivel: 'sello', titulo: 'Bradicardia', texto: `FC ${R.fc}: el betabloqueo frena demasiado el corazón. ${cif}. La ficha lo desaconseja con bradicardia o hipotensión (p. 46-47).`, cita: BETA, origen: 'ficha · p. 46-47 (la contraindicación) · el 50: ilustrativo', deshabilita: SUBE };
  // el objetivo: PAS cerca de 120 con la FC baja, sin cizalla (p. 52)
  if (enObjetivo(R) && !out.dsCizalla && !out.dsPas && !out.dsBradi) out.dsObjetivo = { nivel: 'sello', tono: 'ok', titulo: 'Objetivo', texto: `PAS ${R.pas} con FC ${R.fc} e IC ${c1(R.ic)}: la PA ha bajado sin taquicardia ni más gasto. El tratamiento definitivo es la cirugía.`, cita: K.objetivos, origen: `ficha · p. 52 (PAS 120) · el margen ${OBJETIVO_PAS[0]}-${OBJETIVO_PAS[1]} y la FC <${FC_BAJA}: ilustrativo` };
  // el reloj: +1-2 % de mortalidad por hora sin cirugía (p. 50, 52)
  if (horas > 0) out.dsReloj = { nivel: 'aviso', titulo: `${horaTxt()} sin cirugía`, texto: `La mortalidad sube un 1-2 % por hora desde el inicio: unos ${horas}-${2 * horas} puntos más. Con reparación quirúrgica pronta puede bajar hasta ~10 %; sin cirugía fallecen ~60 %.`, cita: K.objetivos, origen: 'ficha · p. 50 y 52 (la suma de horas: cuenta simple)', bajo: '#shv-dock-panel .rejilla' };
  return out;
}
