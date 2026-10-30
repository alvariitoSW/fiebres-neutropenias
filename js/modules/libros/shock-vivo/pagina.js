// El shock a pie de cama (Marino caps. 14-17): une el motor (soporte.mjs sobre js/modules/eco/motor.mjs), el monitor, la
// escena (el paciente en grabado o el aparato) y los modos Explorar y «¿Qué shock es?». Y la Mayéutica (guía, examen, repaso y el caso).
// montarShock(raiz) se llama una vez, al primer abrir (index.js): lo pesado (ecógrafo, bucle) no corre al arrancar la app.
import { instalarIso } from '../../../core/dibujo-iso.js';
import { crearCabecera, perfusion, avanzarLab, textoGravedad, gDePosparo, horasDePosparo, POSPARO_H } from './soporte.mjs';
import { monitorDelShock, CANALES } from './canales.js';
import { instalarMonitor, pintarCifras as pintarColumna } from '../../../core/monitor.js';
import { crearDock } from '../../../core/dock.js';
import { montarImpella, montarBalon, montarEcmo } from './aparatos.js';
import { montarDespieceImpella, montarDespieceBalon, montarDespieceEcmo, LEYENDA_IMPELLA, LEYENDA_BALON, LEYENDA_ECMO } from './despiece.js';
import { montarCorazon, montarRecorrido, crearEco } from './corazon.js';
import { crearTope } from '../../../core/tope.js';
import { mandosDiseccion, cambioDiseccion, CLAVES_DISEC, AJUSTE_DISEC } from './diseccion.js';
import * as D from '../../../data/shock-vivo-data.js';
import { crearConsolaBalon } from './consola-balon.js';
import { calcularTopes, bolosQueNoCaben } from './topes.js';
import { ECO_REAL } from '../../eco/eco-real.mjs';
import { montarMayeutica } from './mayeutica-shock.js';

const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coma = (x, d = 0) => (+x).toFixed(d).replace('.', ',');
const NS = 'http://www.w3.org/2000/svg';
const IMG = 'js/modules/cardiologia/img/';
instalarIso(); instalarMonitor();
export const pagTxt = (p) => /[-,]/.test(String(p)) ? `pp. ${p}` : `p. ${p}`;

// Repinta un contenedor SIN rehacer lo que no cambia: los botones y mandos siguen siendo los mismos nodos (el foco, el
// toque en curso y los marcadores de las pruebas no se pierden). Si la forma cambia, se reemplaza esa parte.
function parchear(dest, html) {
  const nuevo = document.createElement('div'); nuevo.innerHTML = html;
  const igual = (a, b) => {
    if (a.nodeType !== b.nodeType) return false;
    if (a.nodeType !== 1) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return true; }
    if (a.tagName !== b.tagName || a.childNodes.length !== b.childNodes.length) return false;
    for (const at of [...a.attributes]) if (!b.hasAttribute(at.name) && !at.name.startsWith('data-j')) a.removeAttribute(at.name);
    for (const at of [...b.attributes]) if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
    if (a.tagName === 'INPUT' && a.value !== b.getAttribute('value')) a.value = b.getAttribute('value');
    const hijos = [...a.childNodes];
    [...b.childNodes].forEach((x, i) => { if (!igual(hijos[i], x)) a.replaceChild(x.cloneNode(true), hijos[i]); });
    return true;
  };
  const a = [...dest.childNodes], b = [...nuevo.childNodes];
  if (a.length !== b.length) { dest.innerHTML = html; return; }
  b.forEach((x, i) => { if (!igual(a[i], x)) dest.replaceChild(x.cloneNode(true), a[i]); });
}

export function montarShock(raiz) {
const $ = (id) => document.getElementById('shv-' + id);

// ---------------------------------------------------------------- citas: «Ver en la ficha» y el PDF de segunda opción
function cita(c) {
  const [[esp, view, panel], titulo, corto, pdf] = D.FICHA[c.f];
  const btn = `<button type="button" class="cita-ir" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${c.f}" data-resaltar="#${c.id}" data-titulo="${titulo}" data-sitio="${c.sitio}">Ver en la ficha: ${corto} · ${c.sitio} →</button>`;
  const enlace = pdf && c.p != null ? `<a class="cita-pdf" href="${pdf}#page=${String(c.p).match(/\d+/)[0]}" target="_blank" rel="noopener">PDF, ${pagTxt(c.p)}</a>` : '';
  return `<span class="cita">${btn}${enlace}</span>`;
}
const org = (t, ilu = true) => `<span class="org${ilu ? ' ilu' : ''}">${t}</span>`;

// ---------------------------------------------------------------- estado
const est = { modo: 'explorar', pac: D.PACIENTES[0], g: D.PACIENTES[0].rec.g, rec: null, horas: 0, lab: null, tabla: 'marino', aparato: 'no', vista: 'paciente', plano: 'dentro', foco: null,
  pausa: false, tapado: false, canales: 'todos', pest: 'grav', historia: [] };
let cab = null, R = null;
const monitor = monitorDelShock($('trazas'));
const iabp = crearConsolaBalon($('iabp'), { cab: () => cab, cita, org, citaIabp: D.C.iabp, alCambiar: (c) => trabajar(() => cab.ajustar(c)) }); monitor.alMuestrear(iabp.muestra);

function recDe(pac, extra = {}) { return { ...pac.rec, g: est.g, ...extra }; }
function nuevoPaciente(pac, { g, rec, ajuste = {}, volumen = 0, horas = 0, asentar = 30 } = {}) {
  // la gravedad: la que se pide, si no la de la receta que llega, si no la del paciente (antes, «¿Qué shock es?» perdía la suya)
  est.pac = pac; est.g = g ?? rec?.g ?? pac.rec.g; est.rec = { ...pac.rec, ...(rec || {}), g: est.g };
  cab = crearCabecera(est.rec, { asentar });
  const ap = ajuste.soporte ?? 'no';
  est.aparato = ap;
  cab.ajustar({ ...ajuste, soporte: D.indicacion(pac, ap).ok || ap === 'no' ? ap : 'no' });
  if (volumen) cab.volumen(volumen);
  cab.correr(volumen ? 22 : 8);
  est.horas = 0; est.historia = [];
  const P0 = perfusion(cab.lectura, est.rec);
  est.lab = { lact: P0.lactObj, diur: P0.diurObj };
  apuntarHistoria();
  if (horas) avanzarReloj(horas, { silencioso: true });
  monitor.montar(); monitor.llenar(cab, ctxMon());
}
function reconstruir(conservar = false) {   // al cambiar la gravedad: mismo paciente, mismos mandos (conservar: sigue el reloj y el laboratorio)
  const aj = { ...cab.ajuste }, inf = cab.infundido, h = est.horas;
  cab = crearCabecera(recDe(est.pac), { asentar: 24 });
  est.rec = recDe(est.pac);
  cab.ajustar({ na: aj.na, vaso: aj.vaso, dobuta: aj.dobuta, soporte: aj.soporte, impella: aj.impella, ecmo: aj.ecmo, venteo: aj.venteo, total: aj.total, cpap: aj.cpap, ...Object.fromEntries(AJUSTE_DISEC.map((k) => [k, aj[k]])) });
  if (inf.cris) cab.volumen(inf.cris); if (inf.sangre) cab.volumen(inf.sangre, 'sangre');
  cab.correr(8);
  // la gravedad define al paciente que llega: el laboratorio vuelve a ser el de la hora 0 (v3: antes la clase I llegaba con el
  // lactato de la clase III)
  if (conservar) return;
  est.horas = 0; est.historia = [];
  const P0 = perfusion(cab.lectura, est.rec);
  est.lab = { lact: P0.lactObj, diur: P0.diurObj };
  apuntarHistoria();
}
// Posparo: el reloj de la RCE es el de la Ees (horasDePosparo); al pasar las horas, el aturdimiento se recupera hasta las 72 h
const hPosparo = () => est.pac.tipo === 'posparo' ? horasDePosparo(est.g) : 0;
function avanzarReloj(horas, { silencioso = false } = {}) {
  if (est.pac.tipo === 'posparo') { est.g = gDePosparo(Math.min(POSPARO_H, hPosparo() + horas)); reconstruir(true); }
  cab.redistribuir(); cab.correr(8);
  est.lab = avanzarLab(est.lab, perfusion(cab.lectura, est.rec), horas, { pam: cab.lectura.u.pam });
  est.horas += horas;
  apuntarHistoria();
  if (!silencioso) refrescar(true);
}
function apuntarHistoria() { const u = cab.lectura.u; est.historia.push({ h: est.horas, pam: u.pam, lact: est.lab.lact, diur: est.lab.diur, na: cab.ajuste.na }); }

// ---------------------------------------------------------------- la lectura del momento (redondeada: lo que se ve y se compara)
function leer() {
  const L = cab.lectura, u = L.u, P = perfusion(L, est.rec);
  const r = {
    fc: Math.round(u.fc), pas: Math.round(u.pas), pad: Math.round(u.pad_), pam: Math.round(u.pam), pvc: Math.round(u.pvc), pvc0: Math.round(L.pvc0), pcp: Math.round(u.pvp),
    paps: Math.round(u.paps), papd: Math.round(u.papd), papm: Math.round(u.papm), ic: +L.icTotal.toFixed(1), icNat: L.gcNativo / cab.m.p.sc, gcTotal: L.gcTotal,
    spo2: P.spo2, ven: P.scvo2, gap: P.gap, etco2: P.petco2, lact: +est.lab.lact.toFixed(1), diur: +est.lab.diur.toFixed(1),
    imp: L.imp, ecmo: L.ecmo, impPide: L.impPide, ecmoPide: L.ecmoPide, totalPide: L.totalPide, aoAbre: L.aoAbre, aoDe: L.aoDe, edema: u.vEdema, picoDia: Math.round(L.picoDia), picoNo: L.picoNo != null ? Math.round(L.picoNo) : null, teleNo: L.teleNo != null ? Math.round(L.teleNo) : null, teleDia: L.teleDia != null ? Math.round(L.teleDia) : null,
    vs: Math.round(u.vs), fevi: Math.round(u.feTotal * 100), frmit: Math.round(u.fr * 100), qpqs: +u.qpqs.toFixed(2), satAd: P.scvo2, satAp: Math.round((u.qp > 0.05 && u.qsh > 0 ? (u.qs * (P.scvo2 / 100) + u.qsh * P.sao2) / u.qp : P.scvo2 / 100) * 100),   // SatAD = la misma venosa que enseña el monitor (ScvO₂);   // la sangre que pasa del VI al VD lleva la saturación arterial del monitor, no la SaO₂ fija del motor
    vdvi: +(u.edvD / Math.max(1, u.edv)).toFixed(2),
    perdida: Math.round((est.rec.esc === 'hemorragia' ? est.g * 42 : 0)),
  };
  r.irvs = Math.round((u.pam - u.pvc) / Math.max(0.3, L.icTotal));
  return r;
}
const ctxX = () => ({ g: est.g, hPos: hPosparo(), pac: est.pac, aparato: est.aparato, ajuste: cab.ajuste, infundido: cab.infundido, texto: D.GRAVEDAD[est.pac.tipo]?.texto(est.g, est.pac)[1] || '' });
function ctxMon() {
  const P = cab.lectura ? perfusion(cab.lectura, est.rec) : { petco2: 35 };
  return { fr: est.pac.fr || 16, etco2: P.petco2, amplPleth: est.pac.tipo === 'septico' ? 1 : 0.65, voltajeBajo: est.pac.tipo === 'tapon' ? 0.6 : null };
}

// ---------------------------------------------------------------- objetivos por fuente
function tablaActual() {
  if (est.modo === 'qs') return 'marino-14-5';
  if (est.tabla === 'umi' && est.pac.tipo === 'septico') return 'umi-sepsis-6h';
  return est.pac.obj;
}
const conSoporte = () => cab && cab.ajuste.soporte !== 'no';
function marca(k, v) {
  const T = D.OBJETIVOS[tablaActual()], f = T.filas[k];
  if (!f) return { cls: '', html: '' };
  if (k === 'pcp' && conSoporte()) return { cls: '', html: '<span class="marca sin" title="Con soporte mecánico, la fuente no da una PCP objetivo">—</span>', obj: 'con soporte: sin meta' };
  if (k === 'pcp' && est.pac.tipo === 'septo') return { cls: '', html: '<span class="marca sin" title="Con el cortocircuito, el VI se descarga hacia el VD y la PCP no mide cuánto se inunda el pulmón">—</span>', obj: 'cortocircuito: sin meta' };
  const ok = f[1](v);
  return { cls: ok ? 'si' : 'no', html: `<span class="marca ${ok ? 'si' : 'no'}">${ok ? '✓' : '✗'}</span>`, obj: `obj. ${f[0]}` };
}

// ---------------------------------------------------------------- el monitor: cifras, cálculos, consola
const FILAS_MON = [
  { k: 'fc', canal: 'ecg', cls: 'c-ecg', et: ['FC', 'lpm'] },
  { k: 'pa', canal: 'art', cls: 'c-art', et: ['ART', 'mmHg'] },
  { k: 'pcp', canal: 'pap', cls: 'c-pap', et: ['PAP', 'mmHg'] },
  { k: 'pvc', canal: 'pvc', cls: 'c-pvc', et: ['PVC', 'mmHg'] },
  { k: 'spo2', canal: 'pleth', cls: 'c-sat', et: ['SpO₂', '%'] },
  { k: 'fr', canal: 'co2', cls: 'c-co2', et: ['EtCO₂', 'FR'] },
];
const CALC = [{ k: 'ic', et: 'IC', u: 'L/min/m²', d: 1, cat: true }, { k: 'irvs', et: 'IRVS', u: 'UW·m²', cat: true }, { k: 'ven', et: 'ScvO₂', u: '%', cat: true }, { k: 'gap', et: 'Gap CO₂', u: 'mmHg', cat: true }];
// Lo propio de cada estado del infarto: celdas de más bajo las del IC (el origen de cada una, al tocarla)
const EXTRA = {
  papilar: [{ k: 'frmit', et: 'FR mitral', u: '%', t: 'fracción regurgitante' }, { k: 'fevi', et: 'FEVI', u: '%', t: 'por volúmenes' }],
  vd: [{ k: 'fevi', et: 'FEVI', u: '%', t: 'por volúmenes' }, { k: 'vdvi', et: 'VTD VD/VI', u: '×', d: 1, t: 'volumen del VD sobre el del VI' }, { k: 'pvcpcp', et: 'PVC/PCP', u: '', d: 1, t: 'cociente' }],
  ic: [{ k: 'vs', et: 'VS', u: 'mL', t: 'volumen sistólico, por latido' }],
  septo: [{ k: 'qpqs', et: 'Qp:Qs', u: '', d: 1, t: 'flujo pulmonar sobre sistémico' }, { k: 'satad', et: 'SatO₂ AD', u: '%', t: 'sangre venosa mixta' }, { k: 'satap', et: 'SatO₂ AP', u: '%', t: 'tras el cortocircuito' }, { k: 'fevi', et: 'FEVI', u: '%', t: 'a la aorta y al VD' }],
};
const calcDe = () => [...CALC, ...(EXTRA[est.pac.tipo] || [])];
function canalesVisibles() { return est.canales === 'cabecera' ? ['ecg', 'art', 'pleth', 'co2'] : CANALES.map((c) => c.k); }
function pintarCifras() {
  const tap = est.tapado, vis = new Set(canalesVisibles());
  const filas = FILAS_MON.filter((f) => vis.has(f.canal));
  pintarColumna($('cifras'), filas.map((f) => {
    const c = CANALES.find((x) => x.k === f.canal);
    let v = '', obj = '', mk = { html: '' };
    if (tap) v = '?';
    else if (f.k === 'fc') v = R.fc;
    else if (f.k === 'pa') { v = `${R.pas}/${R.pad}`; mk = marca('pam', R.pam); obj = `PAM <b>${R.pam}</b> · ${(mk.obj || '').replace('obj. ', '')}`; }
    else if (f.k === 'pcp') { if (monitor.enclavado) { v = `${R.pcp}`; mk = marca('pcp', R.pcp); obj = (mk.obj || '').replace('obj. ', 'obj '); } else { v = `${R.paps}/${R.papd}`; mk = marca('pcp', R.pcp); obj = `PCP <b>${R.pcp}</b> ${mk.html || ''}`; mk = { html: '' }; } }
    else if (f.k === 'pvc') { v = R.pvc; mk = marca('pvc', R.pvc); }
    else if (f.k === 'spo2') { v = R.spo2; mk = marca('spo2', R.spo2); }
    else if (f.k === 'fr') { v = `${R.etco2}`; obj = `FR ${est.pac.fr || 16}`; }
    const et = f.k === 'pcp' && monitor.enclavado ? ['PCP', 'mmHg'] : f.et;
    return { k: f.k, cls: f.cls, et: et[0], u: et[1], marca: mk.html, v, obj, alto: c.alto + 4 };
  }), { tapado: tap });
  const T = D.OBJETIVOS[tablaActual()];
  $('calc').hidden = est.canales === 'cabecera';
  parchear($('calc'), calcDe().map((p) => {
    const v = p.k === 'satad' ? R.satAd : p.k === 'satap' ? R.satAp : p.k === 'pvcpcp' ? +(R.pvc / Math.max(1, R.pcp)).toFixed(1) : R[p.k], m = tap ? { cls: '', html: '' } : marca(p.k, v);
    const et = p.k === 'ven' ? T.venosa : p.et;
    let t = p.t ?? (T.filas[p.k] ? 'obj. ' + T.filas[p.k][0] : 'sin objetivo en esta tabla');
    if (p.k === 'ven' && tablaActual() === 'umi-sepsis-6h') t = 'obj. ≥70 % · Marino >50 % ⚖';
    if (p.k === 'ic' && conSoporte()) t = 'total: bomba + corazón';
    return `<button type="button" class="celda ${m.cls}" data-fila="${p.k}" title="${t}"><span class="k"><span>${et}</span>${m.html}</span><span class="g">${tap ? '?' : coma(v, p.d || 0)}<small>${p.u}</small></span><span class="t">${t}</span></button>`;
  }).join(''));
  // las fuentes que discrepan, a la vista (no solo en las notas)
  const dis = $('discrepa');
  dis.hidden = tap || tablaActual() !== 'umi-sepsis-6h';
  if (!dis.hidden) dis.innerHTML = `<span class="nota-tipo">Las fuentes discrepan</span><span>ScvO₂ ≥70 % (Manual UMI) frente a >50 % (Marino); PAM ≥65-70 frente a ≥65. El monitor no elige.</span><button type="button" class="chip-b" data-nota="scvo2-fuentes">Ver la nota</button>`;
  remarcar();
  $('mon-quien').textContent = est.modo === 'qs' ? 'Paciente sin nombre' : `${est.pac.nombre} · ${horaTxt()}`;
}
const horaTxt = () => est.horas === 0 ? 'ahora' : est.horas >= 24 ? `+${Math.floor(est.horas / 24)} d ${est.horas % 24 ? (est.horas % 24) + ' h' : ''}`.trim() : `+${est.horas} h`;
function pintarConsola() {
  const ap = cab.ajuste.soporte, el = $('consola');
  const consolaBalon = ap === 'balon' && !est.tapado; $('iabp').hidden = !consolaBalon; if (consolaBalon) { iabp.cifras(); iabp.pintar(); }
  if (ap === 'no' || est.tapado || consolaBalon) { el.hidden = true; return; }
  el.hidden = false;
  if (ap === 'impella') el.innerHTML = `<span>IMPELLA</span>${R.totalPide != null ? `<span>total pedido <b>${coma(R.totalPide, 1)}</b></span>` : ''}<span>bomba <b>${coma(R.imp, 1)}</b>${D.bombaNoLlega(R) ? ` de ${coma(R.impPide, 1)}` : ''}</span><span>corazón <b>${coma(R.icNat * 1.85, 1)}</b></span><span>total <b>${coma(R.gcTotal, 1)}</b> L/min</span><span>aórtica ${R.aoAbre}/${R.aoDe}</span>`
    + (D.bombaNoLlega(R) ? `<span class="consola-aviso">⚠ La bomba no llega: el VI está casi vacío. Llénalo antes (pestaña Volumen).</span>` : '');
  else if (ap === 'balon') el.innerHTML = `<span>BALÓN</span><span><b>${Math.round(cab.ajuste.balon)}</b> mL helio</span><span>disparo: onda R</span><span>pico diastólico <b>${R.picoDia}</b></span>${R.teleDia != null ? `<span>telediastólica <b>${R.teleDia}</b></span>` : ''}`;
  else el.innerHTML = `<span>ECMO VA</span><span>flujo <b>${coma(R.ecmo, 1)}</b>${R.ecmoPide - R.ecmo > 0.3 ? ` de ${coma(R.ecmoPide, 1)}` : ''}</span><span>corazón <b>${coma(R.icNat * 1.85, 1)}</b> L/min</span><span>aórtica ${R.aoAbre}/${R.aoDe}</span>${cab.ajuste.venteo !== 'no' ? `<span>venteo: ${({ balon: 'balón', impella: 'Impella', drenaje: 'drenaje' })[cab.ajuste.venteo]}</span>` : ''}`;
  el.insertAdjacentHTML('beforeend', org('cifras: el modelo'));
}
// Tocar una cifra: de dónde sale y su objetivo
const EXPLICA = {
  fc: ['Sin objetivo en las tablas. Sube la primera en la hemorragia (Tabla 15.1).', D.C.t151], pa: ['PAM ≥65 mmHg (Tabla 14.5). El Manual UMI pide 65-70 en el séptico (ver la nota).', D.C.t145],
  pcp: ['PCP óptima para dar volumen en el cardiogénico: 18-20 (19-20 en la Tabla 16.2). Con soporte mecánico la fuente no da meta.', D.C.llenado],
  pvc: ['La PVC separa los shocks: baja en el hipovolémico y el séptico; alta en el cardiogénico y el obstructivo (Tabla 14.1).', D.C.t141],
  spo2: ['SaO₂ >90 % es objetivo en la Fig. 15.6 (shock hemorrágico).', D.C.f156], fr: ['La EtCO₂ y la FR: formas y cifras del modelo, ilustrativas en este capítulo.', D.C.t141],
  ic: ['IC ≥2,5 L/min/m² (Tablas 14.5 y 16.2). Con un aparato, el IC del monitor es el total; la consola da la parte del corazón.', D.C.t145],
  irvs: ['IRVS = (PAM − PVC) / IC. Objetivo 25-30 solo en la Tabla 16.2. (Aquí la resistencia basal del modelo sale algo alta: valor ilustrativo.)', D.C.t162],
  ven: ['ScvO₂ >50 % (Tabla 14.5); ≥70 % en el Manual UMI para el séptico (ver la nota). En la sepsis engaña: sube aunque falte perfusión.', D.C.scvo2],
  gap: ['Gap de PCO₂ <6 mmHg; solo depende del flujo (p. 10).', D.C.gap],
  frmit: ['Fracción regurgitante: la parte de lo que el VI expulsa que vuelve a la aurícula. Cifra del modelo (fisiología general); la ficha solo dice «insuficiencia mitral aguda» (p. 38).', D.C.papilar],
  vs: ['Volumen sistólico: lo que el VI expulsa en cada latido (VTD − VTS). Cifra del modelo (fisiología general); el gasto es VS × FC. La Fig. 18.3 (p. 6) lo dibuja en mL, y sus cifras no cuadran entre sí con el índice cardíaco.', D.C.icFig],
  fevi: ['FEVI por volúmenes (telediastólico menos telesistólico): cuenta todo lo que sale del VI, por la aorta y por donde sea (la aurícula o el VD). Fisiología general; la cifra, del modelo. En el fallo del VD la ficha la da como normal (p. 40).', D.C.vd],
  vdvi: ['Volumen telediastólico del VD sobre el del VI: sube cuando el VD se dilata. La ficha dice «VD dilatado» (p. 40) sin cifra; el sano del modelo ronda 1,2. Cifra: modelo.', D.C.vd],
  pvcpcp: ['Cociente PVC/PCP: sube cuando falla el VD (p. 40). La ficha no da el valor; las cifras, del modelo.', D.C.vd],
  qpqs: ['Qp:Qs: flujo pulmonar sobre flujo sistémico; 1 sin cortocircuito. La ficha solo dice «gran shunt izquierda-derecha» (p. 38). El cociente es del modelo (su definición, fisiología general).', D.C.septo],
  satad: ['Saturación de la sangre venosa mixta que llega a la aurícula derecha. Cifra del modelo (fisiología general).', D.C.septo],
  satap: ['Saturación en la arteria pulmonar: sube respecto a la AD porque llega sangre oxigenada del VI. El salto es la huella del cortocircuito; el umbral numérico no está en la ficha. Cifra: modelo.', D.C.septo],
};
$('monitor').addEventListener('click', (ev) => {
  const c = ev.target.closest('[data-fila]'); if (!c || est.tapado) return;
  const [t, ci] = EXPLICA[c.dataset.fila] || []; if (!t) return;
  const d = $('detalle'); d.hidden = false; d.innerHTML = `<span>${t}</span>${cita(ci)}` + (c.dataset.fila === 'spo2' ? '<span>Con ECMO el valor es una mezcla: la ficha no lo dice; ver la revisión de Torre y Pirri 2025 en la nota.</span><button type="button" class="chip-b" data-nota="spo2-ecmo">Ver la nota</button>' : '');
});

// ---------------------------------------------------------------- la escena
let escena = null, escTipo = '';
const eco = crearEco($('esc-eco'));
let ecoCab = null;
function vistaEscena() {
  if (est.vista === 'eco') return 'eco';
  if (est.vista === 'paciente' || est.aparato === 'no') return 'corazon';
  return `${est.aparato}:${est.plano}`;
}
function montarEscena() {
  const k = vistaEscena();
  if (k === escTipo && escena && !(k === 'eco' && ecoCab !== cab)) return;
  escTipo = k; const svg = $('esc-svg');
  svg.setAttribute('class', 'escena-aparato');
  svg.toggleAttribute('hidden', k === 'eco'); $('esc-eco').hidden = k !== 'eco';
  if (k !== 'eco') { eco.parar(); ecoCab = null; }
  if (k === 'eco') { ecoCab = cab; eco.preparar(cab); escena = { actualizar: (cb, dt, q) => eco.tick(dt, q) }; }
  else if (k === 'corazon') { const c = montarCorazon(svg); escena = { actualizar: (cb, dt, q) => c.pintar(cb, dt, q) }; }
  else {
    const [ap, pl] = k.split(':');
    if (pl === 'recorrido') { const r = montarRecorrido(svg); r.poner(ap); escena = { actualizar: (cb, dt, q) => r.tick(dt, q, cb), get texto() { return r.texto; } }; }
    else if (pl === 'dentro') escena = { impella: montarImpella, balon: montarBalon, ecmo: montarEcmo }[ap](svg);
    else escena = { impella: montarDespieceImpella, balon: montarDespieceBalon, ecmo: montarDespieceEcmo }[ap](svg);
  }
  est.foco = null; pintarLeyenda(); pintarPestEscena();
}
function infoEscena() { const ap = est.aparato; return { on: ap !== 'no' && D.indicacion(est.pac, ap).ok }; }
function pintarPestEscena() {
  if (est.modo === 'qs') {
    // «¿Qué shock es?»: la eco (ecógrafo de la app) desde el segundo tiempo; tras contestar, también el corte
    $('esc-pest').innerHTML = qs?.hecho ? ['eco', 'paciente'].map((v) => `<button type="button" class="chip-b" data-vista="${v}" aria-pressed="${est.vista === v}">${v === 'eco' ? 'Eco' : 'Corte'}</button>`).join('') + '<span class="sep"></span><span class="org">eco y corte: el mismo motor</span>'
      : `<span class="org">${qs?.etapa >= 2 ? 'eco · apical de cuatro cámaras' : 'la eco, en el segundo tiempo'}</span>`;
    $('escena').classList.remove('gris'); $('sello').hidden = true; return;
  }
  const ap = est.aparato, nom = { balon: 'Balón', impella: 'Impella', ecmo: 'ECMO VA' }[ap];
  let h = `<button type="button" class="chip-b" data-vista="paciente" aria-pressed="${(est.vista === 'paciente' || ap === 'no') && est.vista !== 'eco'}">Paciente</button><button type="button" class="chip-b" data-vista="eco" aria-pressed="${est.vista === 'eco'}">Eco</button>`;
  if (ap !== 'no') {
    h += `<button type="button" class="chip-b" data-vista="aparato" aria-pressed="${est.vista === 'aparato'}">${nom}</button><span class="sep"></span>`;
    if (est.vista === 'aparato') h += ['dentro', 'despiece', 'recorrido'].map((p) => `<button type="button" class="chip-b" data-plano="${p}" aria-pressed="${est.plano === p}">${({ dentro: 'Dentro', despiece: 'Despiece', recorrido: 'Recorrido' })[p]}</button>`).join('');
  } else h += `<span class="sep"></span><span class="org">elige un aparato en «Soporte»</span>`;
  $('esc-pest').innerHTML = h;
  const ind = ap !== 'no' ? D.indicacion(est.pac, ap) : { ok: true };
  $('escena').classList.toggle('gris', !ind.ok && est.vista === 'aparato');
  const s = $('sello'); s.hidden = ind.ok || est.vista !== 'aparato';
  if (!ind.ok) s.innerHTML = `${ind.sello}<small>${ind.txt}</small>`;
}
$('esc-pest').addEventListener('click', (ev) => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.vista) est.vista = b.dataset.vista;
  if (b.dataset.plano) est.plano = b.dataset.plano;
  montarEscena(); pintarPestEscena(); refrescar(false);
});
const LEY_DENTRO = {
  impella: [['01', '.p-pigtail', 'Punta en «pigtail», en el VI', D.C.f164], ['02', '.p-entrada', 'Entrada: aspira del VI', D.C.impella], ['03', '.p-canula', 'Cánula a través de la válvula aórtica', D.C.f164], ['04', '.p-jaula', 'Hélice en su jaula: suelta en la aorta', D.C.impella], ['05', '.p-motor', 'Motor', D.C.f164], ['06', '.p-cateter', 'Catéter hacia la femoral', D.C.impella], ['07', '.maquina', 'Consola: bomba, corazón y total', D.C.impella]],
  balon: [['01', '.p-balon', 'Balón en la aorta descendente', D.C.iabp], ['02', '.p-cateter', 'Catéter hacia la femoral', D.C.iabp], ['03', '.vaso', 'Cayado: el balón queda bajo la subclavia izquierda', D.C.f163], ['04', '.maquina', 'Bomba con el helio', D.C.iabp]],
  ecmo: [['01', '.p-canula-v', 'Cánula venosa hasta cerca de la AD', D.C.ecmo], ['02', '.p-bomba', 'Bomba centrífuga', D.C.f165], ['03', '.p-oxigenador', 'Oxigenador de membrana', D.C.f165], ['04', '.p-calentador', 'Calentador a 37 °C', D.C.f165], ['05', '.p-canula-a', 'Cánula arterial: la sangre sube al revés', D.C.ecmo], ['06', '#ecm-corazon', 'El VI que se dilata si no abre', D.C.ecmoPoscarga]],
};
function pintarLeyenda() {
  const k = vistaEscena(); let items = [];
  if (k === 'corazon') { $('discrepa-ap').hidden = true; $('leyenda').innerHTML = ''; $('leyenda-txt').innerHTML = `El corazón en corte de cuatro cámaras, la VCI y una arteriola, movidos por el motor. ${org('el dibujo: ilustrativo; las cifras, del modelo')}`; $('fig-esq').textContent = ''; $('pierna').hidden = true; return; }
  if (k === 'eco') { $('discrepa-ap').hidden = true; $('leyenda').innerHTML = ''; $('pierna').hidden = true; $('fig-esq').textContent = ''; $('leyenda-txt').innerHTML = `Eco apical de cuatro cámaras, formada con el ecógrafo de la app sobre el mismo motor que el monitor. ${org('la imagen: el modelo; no es una eco real')}`; return; }
  const [ap, pl] = k.split(':');
  if (pl === 'despiece') items = ({ impella: LEYENDA_IMPELLA, balon: LEYENDA_BALON, ecmo: LEYENDA_ECMO })[ap].map((x) => [x.n, '.pz-' + x.k, `${x.t}: ${x.d}`, { ...D.C.mcs, f: 'mc-soporte-mecanico', id: { balon: 'mc-iabp', impella: 'mc-impella', ecmo: 'mc-ecmo' }[ap], sitio: { balon: 'Balón de contrapulsación', impella: 'Catéteres Impella', ecmo: 'ECMO venoarterial' }[ap], p: x.p }]);
  else if (pl === 'dentro') items = LEY_DENTRO[ap];
  $('leyenda').innerHTML = items.map(([n, sel, t], i) => `<button type="button" data-ley="${i}" aria-pressed="${est.foco === i}"><b>${n}</b>${t.split(':')[0]}</button>`).join('');
  $('leyenda').onclick = (ev) => {
    const b = ev.target.closest('[data-ley]'); if (!b) return; const i = +b.dataset.ley;
    est.foco = est.foco === i ? null : i; enfocar(items); pintarLeyenda();
  };
  $('leyenda-txt').innerHTML = est.foco != null ? `<b>${items[est.foco][0]}</b> ${items[est.foco][2]} ${cita(items[est.foco][3])}` : (pl === 'recorrido' ? escena.texto + ' ' + cita({ balon: D.C.iabp, impella: D.C.impella, ecmo: D.C.ecmo }[ap]) : 'Toca una pieza para iluminarla y leer qué hace.');
  enfocar(items);
  const indOk = D.indicacion(est.pac, ap).ok;
  $('pierna').hidden = !(ap === 'balon' && indOk);
  if (ap === 'balon' && indOk) pintarPierna();
  const da = $('discrepa-ap');
  da.hidden = ap !== 'impella';
  if (ap === 'impella') da.innerHTML = `<span class="nota-tipo">Las fuentes discrepan</span><span>Marino: «bomba centrífuga miniatura», 2,5-5,5 L/min. Guía ESC 2026: «flujo microaxial», hasta 4-5,5 L/min.</span><button type="button" class="chip-b" data-nota="impella-fuentes">Ver la nota</button>`;
}
let itemsFoco = null;
function enfocar(items) {
  itemsFoco = items;
  const svg = $('esc-svg');
  svg.querySelectorAll('.lit-sel').forEach((e) => e.classList.remove('lit-sel'));
  svg.querySelectorAll('[data-foco]').forEach((e) => e.removeAttribute('data-foco'));
  if (est.foco == null) return;
  const sel = items[est.foco][1];
  svg.querySelectorAll('.iso-pieza, .iso-tubo, .dp, .vaso').forEach((e) => { if (!e.closest(sel) && !e.matches(sel) && !e.querySelector(sel)) e.setAttribute('data-foco', 'fuera'); });
  svg.querySelectorAll(sel).forEach((e) => { e.classList.add('lit-sel'); e.removeAttribute('data-foco'); e.querySelectorAll('[data-foco]').forEach((x) => x.removeAttribute('data-foco')); });
}
// La pierna del balón: la regla de la p. 46 (complicación principal)
const pierna = { pulso: true, func: true };
function pintarPierna() {
  const v = pierna.pulso ? 'Pulso pedio presente: el balón sigue.' : pierna.func ? '<span class="hl-verde">Sin pulsos, pero con sensibilidad y movimiento: no obliga a retirarlo.</span> Se vigila.' : '<span class="hl-rojo">Sin sensibilidad ni movimiento: se retira de inmediato</span>; puede hacer falta cirugía.';
  $('pierna').innerHTML = `<div class="formato" style="gap:6px"><span class="tipo">La pierna con el balón · la complicación principal</span>
    <div class="rejilla" style="--n:2"><button type="button" class="tog" data-pi="pulso" aria-pressed="${pierna.pulso}">Pulso pedio<small>${pierna.pulso ? 'presente' : 'ausente'}</small></button><button type="button" class="tog" data-pi="func" aria-pressed="${pierna.func}">Sensibilidad y movimiento<small>${pierna.func ? 'intactos' : 'perdidos'}</small></button></div>
    <p class="para">${v}</p>${cita(D.C.iabpCompl)}</div>`;
}
$('pierna').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pi]'); if (!b) return; pierna[b.dataset.pi] = !pierna[b.dataset.pi]; pintarPierna(); });

// ---------------------------------------------------------------- la frase, el estado y sus fuentes
let claveActual = '';
function pintarFrase() {
  const k = D.nombreEstado(R, ctxX()), E = D.ESTADOS[k]; claveActual = k;
  if (!E) return;
  $('frase-txt').innerHTML = `<span class="estado">${typeof E.tit === 'function' ? E.tit(R, ctxX()) : E.tit}</span>${E.frase(R, ctxX())} ${org(typeof E.org === 'function' ? E.org(R) : E.org, false)}`;
  const vistas = new Set(), lis = [];
  for (const p of E.guia) { const c = p.c; const kk = c.f + c.id + c.sitio; if (vistas.has(kk)) continue; vistas.add(kk); lis.push(c); }
  const T = D.OBJETIVOS[tablaActual()].cita; lis.push(T);
  $('fuentes').innerHTML = lis.map((c) => `<li><span>${D.FICHA[c.f][4]} · ${c.sitio}${c.p != null ? ` (${pagTxt(c.p)})` : ''}</span>${cita(c)}</li>`).join('');
}

// ---------------------------------------------------------------- laboratorio y tendencias
function pintarLab() {
  const T = D.OBJETIVOS[tablaActual()];
  const celdas = [['lact', 'Lactato', 'mmol/L', 1], ['diur', 'Diuresis', 'mL/kg/h', 1], ['hb', 'Hb', 'g/dL', 1]];
  $('lab').innerHTML = celdas.map(([k, et, u, d]) => {
    const v = k === 'hb' ? est.rec.hb ?? 14 : R[k], m = k === 'hb' ? { cls: '', html: '' } : marca(k, v);
    const t = k === 'hb' ? 'en la hemorragia, no baja hasta las 8-12 h' : T.filas[k] ? 'obj. ' + T.filas[k][0] : '';
    return `<div class="celda ${est.tapado ? '' : m.cls}"><span class="k"><span>${et}</span>${est.tapado ? '' : m.html}</span><span class="g">${est.tapado ? '?' : coma(v, d)}<small>${u}</small></span><span class="t">${t}</span></div>`;
  }).join('');
  // tendencias: PAM, lactato y diuresis por hora
  const H = est.historia; let s = '';
  if (H.length > 1) {
    const hMax = Math.max(1, H[H.length - 1].h), x = (h) => 30 + 320 * h / hMax;
    const serie = (k, min, max, col) => H.map((p, i) => `${i ? 'L' : 'M'}${x(p.h).toFixed(1)} ${(58 - 50 * (Math.min(max, Math.max(min, p[k])) - min) / (max - min)).toFixed(1)}`).join('');
    s += `<path class="tend-l" stroke="var(--accent-red)" d="${serie('pam', 40, 110)}"/><path class="tend-l" stroke="var(--accent-yellow)" d="${serie('lact', 0, 8)}"/><path class="tend-l" stroke="var(--accent-purple)" d="${serie('diur', 0, 1.5)}"/>`;
    s += H.map((p) => `<text x="${x(p.h).toFixed(1)}" y="63" class="tend-t" text-anchor="middle">${p.h >= 24 ? 'd' + (Math.floor(p.h / 24) + 1) : 'h' + p.h}</text>`).join('');
  }
  s += '<text x="2" y="10" class="tend-t">PAM · lactato · diuresis</text>';
  $('tend').innerHTML = s;
  $('lab-nota').innerHTML = `Lactato y diuresis: de laboratorio y de la bolsa de orina, con su hora (${horaTxt()}). El lactato tarda en bajar. ${org('lactato y diuresis: ilustrativo (la fuente no da fórmula). El flujo renal se autorregula hasta una PAM de ~70: Marino cap. 18, p. 7')}`;
}

// ---------------------------------------------------------------- el dock de Explorar
function pintarDock() {
  raiz.querySelectorAll('#shv-dock-tabs [data-pest]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.pest === est.pest)));
  const p = est.pac, t = p.tipo, h = [], aj = cab.ajuste;
  if (est.pest === 'grav' && t === 'diseccion') {
    h.push(`<p class="dock-nota">${D.GRAVEDAD.diseccion.nota} ${cita(D.GRAVEDAD.diseccion.cita)}</p>`);
  } else if (est.pest === 'grav') {
    const G = D.GRAVEDAD[t], [a, b] = G.texto(est.g, p);
    h.push(`<div class="deslizador"><input type="range" id="shv-d-grav" min="0" max="${G.horas ? G.max : 100}" step="1" value="${G.horas ? Math.round(horasDePosparo(est.g)) : Math.round(est.g * 100)}" aria-label="Gravedad"><output id="shv-o-grav">${a}<small>${b}</small></output></div><p class="dock-nota">${G.nota} ${org('la escala del mando: el modelo')}</p>`);
  } else if (est.pest === 'vol') {
    const no = bolosQueNoCaben(R, ctxX()), off = (mL) => no(mL) ? ' disabled class="tog tope-apagado"' : ' class="tog"';
    h.push(`<div class="rejilla" style="--n:${t === 'hemo' ? 4 : 3}"><button type="button"${off(250)} data-vol="250">+250 mL<small>cristaloide</small></button><button type="button"${off(500)} data-vol="500">+500 mL<small>cristaloide</small></button><button type="button"${off(2000)} data-vol="2000">+2 L<small>cristaloide</small></button>${t === 'hemo' ? `<button type="button"${off(1000)} data-sangre="1000">+1 L<small>sangre completa</small></button>` : ''}</div>`);
    h.push(`<p class="dock-nota">Llevas ${cab.infundido.cris.toLocaleString('es-ES')} mL de cristaloide${cab.infundido.sangre ? ` y ${cab.infundido.sangre} mL de sangre` : ''}. Al pasar la hora, 3/4 del cristaloide se van al intersticio (p. 11).</p>`);
  } else if (est.pest === 'far' && t === 'diseccion') {
    h.push(...mandosDiseccion(aj));
  } else if (est.pest === 'far') {
    h.push(`<div class="seg" role="group" aria-label="Noradrenalina">${[0, 5, 10, 25, 30].map((d) => `<button type="button" data-na="${d}" aria-pressed="${aj.na === d}">${d}<small>${d ? 'µg/min' : 'sin NA'}</small></button>`).join('')}</div>`);
    h.push(`<div class="rejilla" style="--n:2"><button type="button" class="tog" data-far="vaso" aria-pressed="${aj.vaso}">Vasopresina<small>0,03 U/min · ver la nota</small></button><button type="button" class="tog" data-far="dobuta" aria-pressed="${aj.dobuta}">Dobutamina<small>5 µg/kg/min</small></button></div>`);
  } else if (est.pest === 'sop') {
    h.push(`<div class="seg" role="group" aria-label="Soporte mecánico">${[['no', 'Ninguno'], ['balon', 'Balón'], ['impella', 'Impella'], ['ecmo', 'ECMO VA']].map(([k, n]) => `<button type="button" data-sop="${k}" aria-pressed="${est.aparato === k}">${n}</button>`).join('')}</div>`);
    if (est.aparato === 'no') h.push(`<p class="dock-nota">La fuente lo reserva para el shock cardiogénico refractario (p. 45): pruébalo con Aurelio.</p>`);
    if (t === 'ic') h.push(`<div class="seg" role="group" aria-label="CPAP, en cmH₂O">${[0, 5, 10, 15].map((v) => `<button type="button" data-cpap="${v}" aria-pressed="${aj.cpap === v}">${v ? v : 'Sin'}<small>${v ? 'cmH₂O' : 'CPAP'}</small></button>`).join('')}</div><p class="dock-nota">CPAP: presión de la vía aérea, «usualmente 5-10 cmH₂O» (Marino resp. p. 77; el 15 es para ver el tope). En el corazón que falla (Ramiro) no le quita gasto, se lo sube, y le seca el pulmón (resp. p. 85, 88). ${org('ficha · resp. p. 77, 85, 88 · las cifras: modelo')}</p>`);
    if (t === 'ic') h.push(`<p class="dock-nota"><b>Límite del modelo:</b> Marino (p. 83, 88) y Bradley 1992 (PMID 1736745: +22 % de VS indexado con CPAP 5 en 11 pacientes con PCP ≥12; con PCP &lt;12 el gasto bajó, IC 3,14→2,89). El modelo da el sentido y el orden de magnitud: el VI débil nota más el alivio de la poscarga (tensión de la pared y reserva del músculo, su Ees); el normal, nada. La retirada simpática y el menor trabajo respiratorio del paciente real no están en el modelo. Tampoco mejora la SpO₂: el modelo no reproduce la apertura de los alvéolos que Marino atribuye a la CPAP (resp. p. 77).</p>`);
    const ok = est.aparato !== 'no' && D.indicacion(p, est.aparato).ok;
    if (ok) h.push(`<p class="dock-nota">Los mandos del aparato, bajo su dibujo.</p>`);
    if (!ok && est.aparato !== 'no') h.push(`<p class="dock-nota">${D.indicacion(p, est.aparato).txt}</p>`);
  } else {
    h.push(`<div class="rejilla" style="--n:3">${[[1, '+1 hora'], [5, '+5 horas'], [18, '+18 horas']].map(([n, tx]) => `<button type="button"${(t === 'posparo' ? hPosparo() + n > D.TOPES.horasPosparo + 0.01 : est.horas + n > D.TOPES.horas) ? ' disabled class="tog tope-apagado"' : ' class="tog"'} data-h="${n}">${tx}</button>`).join('')}</div><p class="dock-nota">Ahora: ${horaTxt()}. El lactato tarda; la diuresis va por horas. ${org('el ritmo: ilustrativo')}</p>`);
  }
  parchear($('dock-panel'), h.join(''));
  aplicarTopes(true);
  const dg = $('d-grav');
  if (dg) { dg.oninput = () => { est.g = D.GRAVEDAD[t].horas ? gDePosparo(+dg.value) : +dg.value / 100; const [a, b] = D.GRAVEDAD[t].texto(est.g, p); $('o-grav').innerHTML = `${a}<small>${b}</small>`; }; dg.onchange = () => { trabajar(() => reconstruir()); }; }
  medirDock();
}
// Los mandos del aparato (bajo su dibujo): flujo del Impella y su modo de gasto total, flujo del ECMO y su venteo,
// volumen del balón
function pintarMandos() {
  const ap = est.aparato, aj = cab.ajuste, ok = ap !== 'no' && D.indicacion(est.pac, ap).ok, h = [];
  if (ok && ap === 'impella') {
    h.push(`<div class="deslizador"><input type="range" id="shv-d-imp" min="25" max="55" step="1" value="${Math.round(aj.impella * 10)}" aria-label="Flujo del Impella" ${aj.total != null ? 'disabled' : ''}><output>${coma(aj.impella, 1)} L/min<small>2,5-5,5 según el catéter (p. 47)</small></output></div>`);
    h.push(`<button type="button" class="tog" data-total="1" aria-pressed="${aj.total != null}">Gasto total pedido: 5,0 L/min<small>mide el gasto propio y ajusta la bomba (p. 47)</small></button>`);
  }
  if (ok && ap === 'ecmo') h.push(`<div class="deslizador"><input type="range" id="shv-d-ecmo" min="10" max="60" step="1" value="${Math.round(aj.ecmo * 10)}" aria-label="Flujo del ECMO"><output>${coma(aj.ecmo, 1)} L/min<small>hasta 5-6 (p. 48)</small></output></div><div class="seg" role="group" aria-label="Venteo del VI">${[['no', 'Sin venteo'], ['balon', 'Balón'], ['impella', 'Impella'], ['drenaje', 'Drenaje']].map(([k, n]) => `<button type="button" data-vent="${k}" aria-pressed="${aj.venteo === k}">${n}</button>`).join('')}</div><p class="dock-nota">Venteo: un balón o un Impella a la vez, o drenar el VI (p. 48-49). Por dónde se drena, la fuente no lo dice.</p>`);
  if (ok && ap === 'balon') h.push(`<div class="seg" role="group" aria-label="Volumen del balón">${[35, 40].map((v) => `<button type="button" data-bal="${v}" aria-pressed="${aj.balon === v}">${v} mL<small>de helio (p. 45)</small></button>`).join('')}</div>`);
  parchear($('mandos'), h.length ? `<div class="formato" style="gap:5px"><span class="tipo">Los mandos del aparato</span>${h.join('')}</div>` : '');
  const di = $('d-imp'); if (di) di.onchange = () => trabajar(() => cab.ajustar({ impella: +di.value / 10 }));
  const de = $('d-ecmo'); if (de) de.onchange = () => trabajar(() => cab.ajustar({ ecmo: +de.value / 10 }));
}
$('mandos').addEventListener('click', (ev) => {
  const b = ev.target.closest('button'); if (!b) return; const d = b.dataset;
  if (d.vent) trabajar(() => cab.ajustar({ venteo: d.vent, ...(d.vent === 'impella' ? { impella: 2.5 } : {}) }));
  if (d.bal) trabajar(() => cab.ajustar({ balon: +d.bal }));
  if (d.total) trabajar(() => cab.ajustar({ total: cab.ajuste.total != null ? null : 5.0 }), 14);
});
$('dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; est.pest = b.dataset.pest; pintarDock(); });
$('dock-panel').addEventListener('click', (ev) => {
  const b = ev.target.closest('button'); if (!b || b.disabled) return;
  const d = b.dataset;
  if (d.vol) trabajar(() => cab.volumen(+d.vol), 20);
  if (d.sangre) trabajar(() => cab.volumen(+d.sangre, 'sangre'), 20);
  if (d.na) trabajar(() => cab.ajustar({ na: +d.na }));
  if (d.cpap != null && d.cpap !== '') trabajar(() => cab.ajustar({ cpap: +d.cpap }));
  if (d.ds) { const c = cambioDiseccion(d, cab.ajuste); if (c) trabajar(() => cab.ajustar(c), 25); }
  if (d.far) trabajar(() => cab.ajustar({ [d.far]: !cab.ajuste[d.far] }));
  if (d.sop) { est.aparato = d.sop; est.vista = d.sop === 'no' ? 'paciente' : 'aparato'; est.plano = 'dentro'; trabajar(() => cab.ajustar({ soporte: D.indicacion(est.pac, d.sop).ok || d.sop === 'no' ? d.sop : 'no' })); monitor.llenar(cab, ctxMon()); monitor.pintar();
    if (d.sop !== 'no') { dock.plegar(true); $('escena').scrollIntoView({ block: 'start', behavior: REDUCIR ? 'auto' : 'smooth' }); } }
  if (d.h) trabajar(() => avanzarReloj(+d.h, { silencioso: true }));
});
// Un cambio: asienta el motor unos segundos (el barorreflejo tarda ~10 s) y repinta
function trabajar(f, seg = 8) { f(); cab.correr(seg); refrescar(true); pintarDock(); pintarMandos(); }

// ---------------------------------------------------------------- refresco
function refrescar(todo) {
  if (!cab?.lectura) return;
  R = leer();
  pintarCifras(); pintarConsola(); aplicarTopes(false);
  if (est.modo === 'explorar') { pintarFrase(); pintarLab(); }
  if (todo) { montarEscena(); pintarPestEscena(); escena.actualizar(cab, 0, true, infoEscena()); if (REDUCIR || est.pausa) monitor.llenar(cab, ctxMon()); monitor.pintar(); pintarMandos(); }
  $('obj-umi').disabled = est.pac.tipo !== 'septico' || est.modo === 'qs';
  $('obj-umi').title = est.pac.tipo !== 'septico' ? 'El Manual UMI da sus objetivos para el shock séptico' : '';
  medirDock();
}
$('obj-marino').onclick = () => { est.tabla = 'marino'; $('obj-marino').setAttribute('aria-pressed', 'true'); $('obj-umi').setAttribute('aria-pressed', 'false'); refrescar(false); };
$('obj-umi').onclick = () => { est.tabla = 'umi'; $('obj-umi').setAttribute('aria-pressed', 'true'); $('obj-marino').setAttribute('aria-pressed', 'false'); refrescar(false); };
$('enclavar').onclick = () => { monitor.enclavar(!monitor.enclavado); $('enclavar').setAttribute('aria-pressed', String(monitor.enclavado)); monitor.llenar(cab, ctxMon()); monitor.pintar(); refrescar(false); };
$('pausa').onclick = () => { est.pausa = !est.pausa; $('pausa').setAttribute('aria-pressed', String(est.pausa)); $('pausa').textContent = est.pausa ? 'Seguir' : 'Pausa'; };
const dock = crearDock($('dock'), { plegables: [$('dock-tabs'), $('dock-panel')] });
// Los topes de los mandos (topes.js): avisos ámbar bajo el mando y sellos en el monitor, con su origen
const tope = crearTope({ monitor: $('monitor'), dock: $('dock'), cita });
const topeVisto = {};
function aplicarTopes(forzar) {
  if (!cab?.lectura || !R) return;
  const hay = est.modo === 'qs' ? {} : calcularTopes(R, ctxX(), est.horas, horaTxt);
  for (const k of ['sobrecarga', 'edema', 'tep', 'reposicion', 'vaso', 'reloj', 'gravedad', 'cpap', ...CLAVES_DISEC]) {
    const t = hay[k], firma = t ? JSON.stringify(t) : '';
    if (!forzar && topeVisto[k] === firma) continue;
    topeVisto[k] = firma; if (t) tope.poner(k, t); else tope.quitar(k);
  }
}
function medirDock() { dock.medir(); }
// La figura sigue a la vista al tocar un mando (REGLAS §4.8 R1): si menos de la mitad de la escena se ve sobre el dock, se
// sube o se baja la página lo justo para verla entera.
function verEscena(forzar, enseguida) {   // enseguida: sin esperar dos cuadros (tras un cálculo largo, el cuadro tarda y la imagen aún no se ve)
  if (guia && !forzar) return;
  if (est.modo !== 'explorar') return;
  const ir = enseguida ? (f) => f() : (f) => requestAnimationFrame(() => requestAnimationFrame(f));
  ir(() => {
    const e = $('escena'), r = e.getBoundingClientRect(), tope = $('dock').getBoundingClientRect().top;
    if (!r.height || raiz.getClientRects().length === 0) return;
    const ve = Math.max(0, Math.min(r.bottom, tope) - Math.max(r.top, 0)) / r.height;
    if (ve >= 0.6) return;
    scrollBy({ top: r.top < 0 ? r.top - 8 : r.bottom - tope + 8, behavior: 'instant' });
  });
}
$('dock').addEventListener('click', () => verEscena());
$('pacientes').addEventListener('click', () => verEscena());
$('mandos').addEventListener('click', () => verEscena());

// ---------------------------------------------------------------- pacientes (Explorar)
function pintarPacientes() {
  parchear($('pacientes'), D.PACIENTES.map((p) => `<button type="button" data-pac="${p.k}" aria-pressed="${est.pac === p}">${p.nombre}<small>${p.chip}</small></button>`).join(''));
  const G = D.GRAVEDAD[est.pac.tipo];
  $('ficha-pac').innerHTML = `<b>${est.pac.nombre}</b>, ${est.pac.linea}`;
}
$('pacientes').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-pac]'); if (!b) return;
  const p = D.PACIENTES.find((x) => x.k === b.dataset.pac);
  // Asentar al paciente nuevo son ~1,5 s de motor: el toque responde al instante (marca el botón) y el cálculo corre después,
  // para que el hilo no quede ocupado dentro del propio toque (en el móvil el botón parecía colgado)
  $('pacientes').querySelectorAll('[data-pac]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  const mio = ++cambioPac;
  setTimeout(() => {
    if (mio !== cambioPac) return;   // otro toque más reciente: manda ese
    if (guia) cerrarGuia();   // la explicación era del paciente anterior: se cierra y la figura vuelve a la vista
    est.vista = 'paciente'; est.aparato = 'no';
    nuevoPaciente(p); if (p.tipo === 'diseccion') est.pest = 'far'; pintarPacientes(); refrescar(true); pintarDock(); pintarMandos();
    verEscena(true, true);
  }, 0);
});
let cambioPac = 0;

// ---------------------------------------------------------------- explicación guiada
let guia = null, gi = 0;
function abrirGuia(E, alSalir) {
  guia = { E, alSalir }; gi = 0;
  $('dock-tabs').hidden = true; $('dock-panel').hidden = true; $('btn-guia').hidden = true; $('dock-est').hidden = true; $('dock-guia').hidden = false;   // la frase viva se queda a la vista
  dock.plegar(false); dock.asa.hidden = true; pintarGuia();
}
function cerrarGuia() {
  borrarSenal(); const f = guia?.alSalir; guia = null; $('dock-guia').hidden = true;
  $('dock-tabs').hidden = false; $('dock-panel').hidden = false; $('btn-guia').hidden = false; if (est.modo === 'explorar') $('dock-explorar').hidden = false;
  dock.asa.hidden = est.modo !== 'explorar'; medirDock(); f?.();
}
function pintarGuia() {
  const E = guia.E, p = E.guia[gi], n = E.guia.length;
  const t = typeof p.t === 'function' ? p.t(R, ctxX()) : p.t;
  $('dock-guia').innerHTML = `<div class="guia"><div class="guia-cab"><span class="guia-n">Paso ${gi + 1} de ${n}</span><span class="guia-tit">${typeof E.tit === 'function' ? E.tit(R, ctxX()) : E.tit}</span><button type="button" class="guia-x" id="shv-guia-x" aria-label="Cerrar la explicación">×</button></div>
    <p class="guia-txt">${t}${p.org ? ' ' + org(p.org) : ''}</p>${cita(p.c)}
    <div class="guia-nav"><button type="button" class="guia-b" id="shv-guia-ant" ${gi === 0 ? 'disabled' : ''}>← Atrás</button><span class="guia-puntos">${E.guia.map((_, i) => `<i class="${i < gi ? 'hecho' : i === gi ? 'aqui' : ''}"></i>`).join('')}</span><button type="button" class="guia-b prim" id="shv-guia-sig">${gi === n - 1 ? 'Hecho' : 'Siguiente →'}</button></div></div>`;
  $('guia-x').onclick = cerrarGuia; $('guia-ant').onclick = () => { gi--; pintarGuia(); };
  $('guia-sig').onclick = () => { if (gi === n - 1) cerrarGuia(); else { gi++; pintarGuia(); } };
  medirDock(); requestAnimationFrame(() => senalar(p.s)); if (gi === 0) verEscena(true);
}
let senalActual = null;
function borrarSenal() { senalActual = null; raiz.querySelectorAll('.guia-anillo').forEach((e) => e.remove()); raiz.querySelectorAll('.guia-marco').forEach((e) => e.classList.remove('guia-marco')); }
// Las cifras del monitor se repintan cada 0,35 s: el marco de lo señalado se vuelve a poner tras cada repintado
function remarcar() { if (!senalActual) return; for (const s of senalActual) for (const el of raiz.querySelectorAll(s)) if (!el.ownerSVGElement) el.classList.add('guia-marco'); }
function senalar(sels) {
  borrarSenal(); let primero = null;
  // la eco no tiene las piezas del corazón en corte: si el paso señala una, la escena vuelve al paciente
  if (est.vista === 'eco' && est.modo === 'explorar' && (sels || []).some((x) => x.startsWith('#cor-'))) { est.vista = 'paciente'; montarEscena(); pintarPestEscena(); escena.actualizar(cab, 0, true, infoEscena()); }
  senalActual = sels || null;
  for (const s of sels || []) for (const el of raiz.querySelectorAll(s)) {
    const svg = el.ownerSVGElement;
    if (svg) {
      let b; try { b = el.getBBox(); } catch { continue; } if (!b.width && !b.height) continue;
      const m = svg.getScreenCTM().inverse().multiply(el.getScreenCTM());
      const xs = [b.x, b.x + b.width].flatMap((x) => [b.y, b.y + b.height].map((y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]));
      const r = document.createElementNS(NS, 'rect'), x0 = Math.min(...xs.map((p) => p[0])), y0 = Math.min(...xs.map((p) => p[1]));
      r.setAttribute('class', 'guia-anillo'); r.setAttribute('x', x0 - 3); r.setAttribute('y', y0 - 3); r.setAttribute('width', Math.max(...xs.map((p) => p[0])) - x0 + 6); r.setAttribute('height', Math.max(...xs.map((p) => p[1])) - y0 + 6); r.setAttribute('rx', 6);
      svg.appendChild(r); primero = primero || r;
    } else { el.classList.add('guia-marco'); primero = primero || el; if (el.tagName === 'DETAILS') el.open = true; if (el.closest('details')) el.closest('details').open = true; }
  }
  if (primero) { const c = primero.getBoundingClientRect(), alto = innerHeight - $('dock').offsetHeight; if (c.top < 6 || c.bottom > alto - 6) scrollBy({ top: c.top - (alto - c.height) / 2, behavior: REDUCIR ? 'auto' : 'smooth' }); }
}
$('btn-guia').addEventListener('click', () => { const E = D.ESTADOS[claveActual]; if (E) abrirGuia(E); });

// ---------------------------------------------------------------- notas, láminas y profundizar
raiz.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-nota]'); if (!b) return;
  const n = $('nota-' + b.dataset.nota); if (!n) return;
  n.closest('details').open = true; n.scrollIntoView({ block: 'center', behavior: REDUCIR ? 'auto' : 'smooth' }); n.classList.add('guia-marco'); setTimeout(() => n.classList.remove('guia-marco'), 2400);
});
function pintarFijos() {
  $('notas').innerHTML = D.NOTAS.map((n) => `<div class="nota" id="shv-nota-${n.k}"><span class="nota-tipo ${D.NOTA_TIPO[n.tipo][1]}">${D.NOTA_TIPO[n.tipo][0]}</span><span>${n.txt}</span>${n.citas.map(cita).join('')}</div>`).join('');
  $('profundizar').innerHTML = D.PROFUNDIZAR.map((p) => `<li><span>${p.t}</span>${cita(p.c)}</li>`).join('');
  const LAM = [['mc-fig16-3-iabp.jpg', 'Fig. 16.3 · balón', 'El balón se infla al empezar la diástole (izquierda) y se vacía al final (derecha); encima, la curva aórtica.', D.C.f163],
    ['mc-fig16-4-impella.jpg', 'Fig. 16.4 · Impella', 'La punta en el VI; las aspas, a través de la válvula aórtica, pasan sangre a la aorta.', D.C.f164],
    ['mc-fig16-5-ecmo-circuito.jpg', 'Fig. 16.5 · ECMO VA', 'El circuito: vena femoral → bomba → oxigenador → calentador → arteria femoral.', D.C.f165]];
  $('tira').innerHTML = LAM.map((l, i) => `<button type="button" class="lamina-libro" data-lam="${i}"><img src="${IMG + l[0]}" alt="${l[1]}" loading="lazy"><span>${l[1]}</span></button>`).join('');
  $('tira').onclick = (ev) => { const b = ev.target.closest('[data-lam]'); if (!b) return; const l = LAM[+b.dataset.lam]; $('visor-img').src = IMG + l[0]; $('visor-img').alt = l[1]; $('visor-txt').textContent = l[2]; $('visor-cita').innerHTML = cita(l[3]); $('visor').showModal(); };
  $('visor-cerrar').onclick = () => $('visor').close();
}

// ---------------------------------------------------------------- «¿Qué shock es?» 2.0
let qs = null;
function barajar(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
function empezarQS() { qs = { lista: barajar(D.QS).slice(0, 10), i: 0, puntos: 0, etapa: 0, elegido: null, primero: null }; pintarQS(); }
function prepararQS() {
  const c = qs.lista[qs.i], base = D.PACIENTES.find((p) => p.k === c.pac) || D.PACIENTES[1];
  const pac = c.pac === 'begona' || c.pac === 'nerea' ? { ...D.PACIENTES[1], k: c.pac, nombre: c.real.split(':')[0], peso: c.peso, tipo: 'septico', rec: { esc: c.esc, g: c.g, util: c.esc === 'sepsis' ? 'sepsis' : 'normal', hb: 12.5 }, fr: 26 } : { ...base, tipo: c.tipo === 'no' ? 'tep' : base.tipo };
  est.vista = 'paciente'; est.aparato = 'no';
  nuevoPaciente(pac, { g: c.g, rec: { ...(c.esc ? { esc: c.esc } : {}), ...(c.volemia != null ? { volemia: c.volemia } : {}) } });
}
function pintarQS() {
  const z = $('zona-qs');
  $('bajo-escena').before($('escena'));   // la escena sale de la tarjeta antes de repintarla
  if (qs.i >= qs.lista.length) {
    z.innerHTML = `<h2>${qs.puntos} puntos de ${qs.lista.length * 3}</h2><p class="para">3 puntos si aciertas con la cabecera, 2 con la eco y 1 con el catéter. La regla de la Tabla 14.1: primero la PVC (¿falta volumen o sobra?), luego el gasto y la resistencia; la PCP frente a la PVC dice qué ventrículo falla.</p>${cita(D.C.t141)}<div class="fila"><button type="button" class="b prim" id="shv-qs-otra">Otros 10 pacientes</button></div>`;
    $('qs-otra').onclick = () => { empezarQS(); };
    return;
  }
  if (qs.etapa === 0) { prepararQS(); qs.etapa = 1; qs.elegido = null; qs.primero = null; }
  const c = qs.lista[qs.i];
  est.canales = qs.etapa === 1 ? 'cabecera' : qs.etapa === 2 ? 'cabecera' : 'todos';
  monitor.ver(est.canales === 'cabecera' ? ['ecg', 'art', 'pleth', 'co2'] : CANALES.map((x) => x.k)); monitor.llenar(cab, ctxMon());
  $('velo-esc').hidden = qs.etapa >= 2; $('velo-esc').textContent = 'La eco, en el segundo tiempo.';
  est.vista = qs.etapa >= 2 ? 'eco' : 'paciente';
  refrescar(true);
  const etapas = ['Cabecera', 'Eco', 'Catéter'].map((t, i) => `<span class="${i < qs.etapa ? 'on' : ''}">${i + 1} · ${t}</span>`).join('');
  const lab = `Lactato <b>${coma(R.lact, 1)}</b> mmol/L · diuresis <b>${coma(R.diur, 1)}</b> mL/kg/h`;
  const pide = qs.etapa === 1 ? 'Con la cabecera: PA, FC, SpO₂, FR y el laboratorio.' : qs.etapa === 2 ? 'Ahora tienes la eco, aquí debajo. ¿Lo confirmas o lo cambias?' : 'Ahora, el catéter de arteria pulmonar: PVC, PCP, IC e IRVS.';
  z.innerHTML = `<div class="cab-preg"><span class="num">${qs.i + 1} de ${qs.lista.length}</span><span class="tipo">Llega a urgencias</span></div><div class="etapas">${etapas}</div>
    <p class="para">${lab} ${org('del modelo')}</p><p class="pregunta">${pide} <b>¿Qué shock es?</b></p>
    <div class="op" id="shv-qs-ops">${D.OPC_QS.map(([k, n]) => `<button type="button" class="b${qs.elegido === k ? ' marcada' : ''}" data-qs="${k}">${n}</button>`).join('')}</div>
    <div class="fila">${qs.etapa < 3 ? `<button type="button" class="b" id="shv-qs-mas" ${qs.elegido ? '' : 'disabled'}>${qs.etapa === 1 ? 'Ver la eco →' : 'Ver el catéter →'}</button>` : ''}<button type="button" class="b prim" id="shv-qs-resp" ${qs.elegido ? '' : 'disabled'}>Es este</button></div><div id="shv-qs-res"></div>`;
  // la eco va dentro de la tarjeta, entre la pregunta y las opciones (en el primer tiempo, aún no)
  $('escena').hidden = qs.etapa < 2; if (qs.etapa >= 2) z.querySelector('.pregunta').after($('escena'));
}
$('zona-qs').addEventListener('click', (ev) => {
  const b = ev.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.qs && !qs.hecho) { qs.elegido = b.dataset.qs; if (!qs.primero) qs.primero = { k: b.dataset.qs, etapa: qs.etapa }; pintarQS(); return; }
  if (b.id === 'shv-qs-mas') { qs.etapa++; pintarQS(); return; }
  if (b.id === 'shv-qs-resp') {
    const c = qs.lista[qs.i], ok = qs.elegido === c.tipo, pts = ok ? 4 - qs.etapa : 0; qs.puntos += pts; qs.hecho = true;
    est.canales = 'todos'; monitor.ver(CANALES.map((x) => x.k)); monitor.llenar(cab, ctxMon()); $('velo-esc').hidden = true; est.vista = 'paciente'; refrescar(true);
    const nombre = D.OPC_QS.find((o) => o[0] === c.tipo)[1], H = D.HUELLA[c.tipo];
    const real = c.real || `${est.pac.nombre}: ${D.PACIENTES.find((p) => p.k === c.pac)?.linea || ''}`;
    raiz.querySelectorAll('#shv-qs-ops button').forEach((x) => { x.disabled = true; if (x.dataset.qs === c.tipo) x.classList.add('bien'); else if (x.dataset.qs === qs.elegido) x.classList.add('malb'); });
    $('qs-res').innerHTML = `<div class="respuesta"><span class="${ok ? 'ok' : 'mal'}">${ok ? `✓ ${nombre}: +${pts}` : `✗ Era ${nombre}`}</span><p>${real}.</p>${ok ? '' : `<p>Si fuera lo que elegiste, verías ${D.HUELLA[qs.elegido].seria}.</p>`}
      <p><b>Lo que lo delataba</b> (toca «Señalar»):</p><ul class="lista">${H.pistas.map((p, i) => `<li><span>${p.t}${p.org ? ' ' + org(p.org) : ''}</span><button type="button" class="b" data-senal="${i}" style="min-height:36px; width:fit-content">Señalar</button>${cita(p.c)}</li>`).join('')}</ul>
      <div class="fila"><button type="button" class="b prim" id="shv-qs-sig">${qs.i === qs.lista.length - 1 ? 'Ver el resultado' : 'Otro paciente →'}</button></div></div>`;
    return;
  }
  if (b.dataset.senal) { if (est.vista === 'eco') { est.vista = 'paciente'; montarEscena(); pintarPestEscena(); escena.actualizar(cab, 0, true, infoEscena()); } senalar(D.HUELLA[qs.lista[qs.i].tipo].pistas[+b.dataset.senal].s); return; }
  if (b.id === 'shv-qs-sig') { borrarSenal(); qs.i++; qs.etapa = 0; qs.hecho = false; est.vista = 'paciente'; pintarQS(); scrollTo({ top: 0, behavior: REDUCIR ? 'auto' : 'smooth' }); }
});

// ---------------------------------------------------------------- Mayéutica (enganches en mayeutica-shock.js)
const { May, CASOS_V } = montarMayeutica({ raiz, $, est, monitor, cita, org, coma, REDUCIR, nuevoPaciente, refrescar, trabajar, medirDock, setModo, pintarPacientes, pintarDock, ctxMon, tapar,
  get R() { return R; }, get cab() { return cab; } });
function tapar(on) { est.tapado = on; $('velo-mon').hidden = !on; $('velo-esc').hidden = !on; $('velo-esc').textContent = 'El dibujo y la consola, al contestar.'; }

// ---------------------------------------------------------------- modos
function setModo(m) {
  if (guia) cerrarGuia();
  $('bajo-escena').before($('escena')); $('escena').hidden = false;
  est.modo = m; borrarSenal(); tapar(false);
  for (const [id, k] of [['modo-explorar', 'explorar'], ['modo-qs', 'qs'], ['modo-may', 'may']]) $(id).setAttribute('aria-selected', String(m === k));
  $('zona-pac').hidden = m !== 'explorar'; $('abajo').hidden = m !== 'explorar';
  $('zona-qs').hidden = m !== 'qs'; $('zona-may').hidden = m !== 'may';
  $('dock-explorar').hidden = m !== 'explorar'; $('dock-est').hidden = m !== 'may';
  $('dock').hidden = m === 'qs'; dock.asa.hidden = m !== 'explorar'; dock.plegar(false);   // el asa solo pliega los mandos de Explorar
  $('velo-esc').hidden = true; est.canales = 'todos'; monitor.ver(CANALES.map((x) => x.k));
  if (m === 'explorar') { est.aparato = 'no'; est.vista = 'paciente'; nuevoPaciente(D.PACIENTES[0]); pintarPacientes(); refrescar(true); pintarDock(); }
  if (m === 'qs') empezarQS();
  if (m === 'may') May.entrar();
  medirDock();
}
$('modo-explorar').onclick = () => setModo('explorar');
$('modo-qs').onclick = () => setModo('qs');
$('modo-may').onclick = () => setModo('may');
addEventListener('resize', () => { monitor.montar(); iabp.montar(); if (cab) { monitor.llenar(cab, ctxMon()); monitor.pintar(); } medirDock(); });

// ---------------------------------------------------------------- el bucle: un reloj, el del motor
let ultimo = 0, cuenta = 0, corriendo = false;
function bucle(t) {
  if (raiz.getClientRects().length === 0) { corriendo = false; return; }   // la vista está oculta: el bucle se para
  const dt = ultimo ? Math.min(1 / 30, (t - ultimo) / 1000) : 1 / 60; ultimo = t;
  if (cab && !est.pausa && !document.hidden) {
    monitor.avanzar(cab, dt, ctxMon()); monitor.pintar(); iabp.pintar();
    if (!est.tapado) { escena.actualizar(cab, dt, false, infoEscena()); if (est.foco != null && itemsFoco) enfocar(itemsFoco); }   // el balón se redibuja en cada fotograma: el foco se repone
    cuenta += dt; if (cuenta > 0.35) { cuenta = 0; R = leer(); pintarCifras(); pintarConsola(); if (est.modo === 'explorar') { pintarFrase(); } }
  }
  requestAnimationFrame(bucle);
}
function reanudar() { if (REDUCIR || corriendo) return; corriendo = true; ultimo = 0; requestAnimationFrame(bucle); medirDock(); }
function lecturaFig() {
  if (!R || est.vista !== 'aparato' || est.aparato === 'no' || !infoEscena().on) return '';
  if (est.aparato === 'impella') return `bomba ${coma(R.imp, 1)} · corazón ${coma(R.icNat * 1.85, 1)} L/min (modelo)`;
  if (est.aparato === 'balon') return `${Math.round(cab.ajuste.balon)} mL · pico diastólico ${R.picoDia} (modelo)`;
  return `${coma(R.ecmo, 1)} L/min · aórtica ${R.aoAbre}/${R.aoDe} · PCP ${R.pcp} (modelo)`;
}

// «Así se ve de verdad» (eco real de uso libre junto a nuestra eco A4C y al corte del corazón): la misma imagen y el mismo pie con autor y licencia que la eco
function pintarReal() {
  const it = ECO_REAL.a4c.find((x) => x.tipo === 'imagen'); if (!it) return;
  const src = new URL('../../eco/' + it.src, import.meta.url).href;
  const lic = it.licenciaUrl ? `<a href="${it.licenciaUrl}" target="_blank" rel="noopener">${it.licencia}</a>` : it.licencia;
  $('real-fig').innerHTML = `<img loading="lazy" src="${src}" width="${it.ancho}" height="${it.alto}" alt="${it.pie}">
    <figcaption>${it.pie} Es una eco real de otro paciente: compárala con el dibujo del corte y con la eco A4C de arriba (las cuatro cámaras, el tabique y las válvulas). Autor: ${it.autor} · Licencia: ${lic} · <a href="${it.original}" target="_blank" rel="noopener">Ver original ↗</a></figcaption>`;
}
// arranque
pintarFijos(); pintarReal();
nuevoPaciente(D.PACIENTES[0]); pintarPacientes(); refrescar(true); pintarDock();
reanudar();

// Abrir en un estado de la tabla F de la lista del bloque (hemo, septico, cardio, tapon, tep, balon, impella, ecmo, qs)
const ESTADO_PAC = { 'ic-etapa-1': 'ramiro', 'ic-etapa-2': 'ramiro', 'ic-etapa-3': 'ramiro', 'ic-cpap': 'ramiro', 'rotura-papilar': 'benito', 'iam-vd': 'fermin', 'rotura-septo': 'remedios', posparo: 'virginia', hemo: 'mateo', septico: 'amparo', cardio: 'aurelio', tapon: 'joaquin', diseccion: 'joaquin-0', tep: 'consuelo', balon: 'aurelio', impella: 'aurelio', ecmo: 'aurelio' };
function abrirEstado(clave) {
  if (!clave) { reanudar(); medirDock(); return; }
  setModo(clave === 'qs' ? 'qs' : 'explorar');
  if (clave === 'qs') { reanudar(); return; }
  const p = D.PACIENTES.find((x) => x.k === ESTADO_PAC[clave]); if (!p) { reanudar(); return; }
  const ap = ['balon', 'impella', 'ecmo'].includes(clave) ? clave : 'no';
  est.aparato = ap; est.vista = ap === 'no' ? 'paciente' : 'aparato'; est.plano = 'dentro';
  est.pest = { diseccion: 'far', 'ic-etapa-1': 'grav', 'ic-etapa-2': 'grav', 'ic-etapa-3': 'grav', 'ic-cpap': 'sop', 'rotura-papilar': 'grav', 'iam-vd': 'grav', 'rotura-septo': 'grav', posparo: 'grav', hemo: 'vol', tep: 'vol', septico: 'far', cardio: 'vol', tapon: 'grav', balon: 'sop', impella: 'sop', ecmo: 'sop' }[clave];
  nuevoPaciente(p, { ajuste: ap === 'no' ? (clave === 'ic-cpap' ? { cpap: 10 } : {}) : { soporte: ap }, g: clave.startsWith('ic-etapa-') ? D.IC_G_ETAPA[+clave.slice(-1) - 1] : clave === 'ic-cpap' ? D.IC_G_ETAPA[2] : undefined });
  if (clave === 'tapon') est.vista = 'eco';
  if (monitor.enclavado !== (clave === 'cardio')) { monitor.enclavar(clave === 'cardio'); $('enclavar').setAttribute('aria-pressed', String(monitor.enclavado)); monitor.llenar(cab, ctxMon()); }
  pintarPacientes(); refrescar(true); pintarDock(); pintarMandos(); reanudar();
}
const api = { abrirEstado, reanudar, get corriendo() { return corriendo; }, est, get cab() { return cab; }, get R() { return R; }, D, monitor, setModo, nuevoPaciente, refrescar, trabajar, tapar, pintarPacientes, pintarDock, pintarMandos, ctxMon, cita, org, coma, dock, raiz };
window.__shvPruebas = () => api;
return api;
}
