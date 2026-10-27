// La pantalla del respirador del pulmón (b3-pulmon): la configuración de la pieza común comun/respirador.js y la
// traducción de la lectura del modelo (pulmon.mjs) y de los topes (topes.js) a casillas, mandos y alarmas.
// Origen: curvas y casillas = el modelo (fisiología general); límites = topes.js con su origen; FiO₂, hora, batería,
// iconos y teclas grises = ilustrativo (interfaz).
import { crearRespirador, canalesPantalla } from '../comun/respirador.js';
import { T as TOPE } from './topes.js';
import { ORIGEN_MODELO } from './pulmon.mjs';
import * as D from './datos.js';

const { C } = D;
const f1 = (n) => (n == null || !isFinite(n) ? null : String(Math.round(n * 10) / 10).replace('.', ','));
const f0 = (n) => (n == null || !isFinite(n) ? null : String(Math.round(n)));

export const MODOS = [
  { k: 'vcv', et: 'VC-AC' },
  { k: 'simv', et: 'VC-SIMV', apagado: 'no en este modelo (sin respiración espontánea)' },
  { k: 'spn', et: 'SPN-CPAP/PS', apagado: 'no en este modelo (sin respiración espontánea)' },
  { k: 'pcv', et: 'PC-AC' },
  { k: 'otros', et: 'Otros modos', apagado: 'no en este modelo (sin respiración espontánea)' },
];
const SIN_ESP = 'sin respiración espontánea en este modelo';
// Cada casilla: nombre y unidad, qué es y de dónde sale (se lee al tocarla)
export const CASILLAS = [
  { k: 'pico', et: 'Ppico', u: 'mbar', que: 'Presión pico de la vía aérea (resistencia + elasticidad). Límite: tu Pmáx (ajuste).', c: C.ec271 },
  { k: 'meseta', et: 'EIP', u: 'mbar', que: 'Presión al final de la inspiración = meseta. Vacía si no hay pausa: pulsa «Insp. mantenida». Límite 30: ficha.', c: C.meseta },
  { k: 'peeptot', et: 'PEEP', u: 'mbar', que: 'La PEEP aplicada. Con «Espiración mantenida», la total y la oculta. Límite de la total, 20: fisiología general.', c: C.oclusion28 },
  { k: 'pmedia', et: 'Pmedia', u: 'mbar', que: 'Presión media de la vía aérea durante el ciclo.', c: C.pMedia },
  { k: 'frmand', et: 'FRmand', u: '/min', que: 'La frecuencia que pones (mandatoria). Sin límite de alarma: la ficha no da uno.', c: C.t271 },
  { k: 'fr', et: 'FR', u: '/min', que: 'La frecuencia real: si la espiración no cabe, el ciclo se alarga y baja. Sin límite de alarma: la ficha no da uno.', c: C.flujoIE },
  { k: 'vt', et: 'VTe', u: 'mL', que: 'Volumen corriente espirado (y por kg de peso ideal). Límite 12 mL/kg: ilustrativo (normal 6-7, ficha).', c: C.t271 },
  { k: 'vm', et: 'VMe', u: 'L/min', que: 'Volumen minuto espirado = VTe × FR. Límites 2 y 20: fisiología general.', c: C.t271 },
  { k: 'ie', et: 'I:E', u: '', que: 'Relación inspiración:espiración. La ficha pide 1:2 o más.', c: C.flujoIE },
  { k: 'fio2', et: 'FiO₂', u: 'Vol%', ilu: true, que: 'Copia el mando FiO₂. Este modelo no tiene gases: no cambia nada (ilustrativo).' },
  { k: 'frespon', et: 'FRespon', u: '/min', ilu: true, que: `Frecuencia espontánea: vacía, ${SIN_ESP}.` },
  { k: 'vmespon', et: 'VMe espon', u: 'L/min', ilu: true, que: `Volumen minuto espontáneo: vacío, ${SIN_ESP}.` },
];
const MANDOS = [
  { k: 'fio2', et: 'FiO₂', u: 'Vol%', ilu: true, min: 21, max: 100, paso: 1, nota: 'Ilustrativo: este modelo no tiene gases y la FiO₂ no cambia nada.' },
  { k: 'vt', et: 'VT', u: 'mL', min: 200, max: 800, paso: 10 },
  { k: 'ti', et: 'Ti', u: 's' },
  { k: 'fr', et: 'FR', u: '/min', min: 8, max: 35, paso: 1, nota: 'Ficha: no pasar de 35.' },
  { k: 'peep', et: 'PEEP', u: 'mbar', min: 0, max: 20, paso: 1, nota: 'Ficha: 5-8 de inicio.' },
  { k: 'dpsop', et: 'ΔPsop', u: 'mbar' },
  { k: 'rampa', et: 'Rampa', u: 's' },
  { k: 'flujo', et: 'Flujo', u: 'L/min', min: 30, max: 100, paso: 5, nota: 'Ficha: 60 L/min, ≥80 si hay distrés.' },
  { k: 'pinsp', et: 'Pinsp', u: 'mbar', min: 5, max: 30, paso: 1, nota: 'Presión de insuflación, sobre la PEEP.' },
  { k: 'pmax', et: 'Pmáx', u: 'mbar', min: 30, max: TOPE.pmaxMax, paso: 5, nota: 'Límite de presión: al llegar, el respirador corta la insuflación (ilustrativo; la ficha quiere la meseta ≤30).' },
];
const TECLAS = [
  { k: 'alarmas', et: 'Alarmas', ico: '🔔', tipo: 'accion' },
  { k: 'vistas', et: 'Vistas', ico: '▤', tipo: 'accion' },
  { k: 'tend', et: 'Tendencias', ico: '📈', tipo: 'deco' },
  { k: 'sens', et: 'Sensores', ico: '◎', tipo: 'deco' },
  { k: 'proc', et: 'Procedim.', ico: '☰', tipo: 'deco' },
  { k: 'inspmant', et: 'Insp. mantenida', ico: '⏸', tipo: 'tog' },
  { k: 'espmant', et: 'Esp. mantenida', ico: '⏹', tipo: 'tog' },
  { k: 'congelar', id: 'pausa', et: 'Congelar', ico: '❄', tipo: 'tog' },
  { k: 'o2', et: 'O₂ succión', ico: 'O₂', tipo: 'deco' },
  { k: 'nebu', et: 'Nebulización', ico: '≋', tipo: 'deco' },
];
const PIE = `Curvas y casillas: el modelo (${ORIGEN_MODELO}, un compartimento). Límites de alarma: cada uno con su origen (toca una casilla). FiO₂, hora, batería, iconos y teclas grises: ilustrativo. Unidades en mbar: 1 mbar ≈ 1 cmH₂O; el Marino usa cmH₂O (la cifra es la misma).`;

// Los topes (claves de topes.js) → casilla y texto de la barra de alarmas
const SELLO_A = { sinvent: ['vm', 'VMe bajo'], vmalto: ['vm', 'VMe alto'], vtalto: ['vt', 'VTe alto'], hiper: ['peeptot', 'PEEP total alta'] };
const AVISO_A = { vm: ['vm', 'VMe alto'], vtkg: ['vt', null], meseta: ['meseta', 'EIP > 30'], pmax: ['pico', 'Pmáx muy alta'], cabe: ['ie', 'No cabe la espiración'] };

export function montarPantalla(cont, { P, PBW, est, seg, cita, alMando, alModo, alTecla }) {
  const R = crearRespirador(cont, {
    canales: canalesPantalla({ peep: () => P.S.resp.peep, pmax: () => P.S.resp.pmax ?? 40 }),
    modos: MODOS, casillas: CASILLAS, mandos: MANDOS, teclas: TECLAS, interfaz: 'Tubo', pie: PIE,
    alMando, alModo, alTecla,
    alCasilla(k) { const c = CASILLAS.find((x) => x.k === k); if (c) R.info(`<b>${c.et}</b> · ${c.que} ${c.ilu ? '' : `Cifra: modelo (${ORIGEN_MODELO}).`} ${c.c ? cita(c.c) : ''}`); },
  });
  let alarmasVivas = [];

  // valores de las casillas, de los mandos y de las alarmas a partir de la lectura y los topes
  function pintar(L, hay, { tapado = false, detenido = false } = {}) {
    const r = P.S.resp, kg = PBW(), l = detenido ? { pico: r.peep, pMedia: r.peep, frReal: 0, vtExh: 0, vm: 0 } : (L || {});
    const marca = {};   // casilla → 'alarma' | 'aviso'
    const lista = [];
    const subir = (k, n) => { if (!k) return; if (marca[k] !== 'alarma') marca[k] = n; };
    if (detenido) { lista.push({ k: 'det', nivel: 'alarma', texto: 'Ventilación detenida' }); subir('vm', 'alarma'); }
    for (const [clave, t] of Object.entries(detenido ? {} : hay)) {
      if (!t) continue;
      const sello = t.nivel === 'sello';
      const [cas, txt] = AVISO_A[clave] || SELLO_A[t.k] || [null, t.titulo];
      subir(cas, sello ? 'alarma' : 'aviso');
      lista.push({ k: clave, nivel: sello ? 'alarma' : 'aviso', texto: txt || t.titulo.replace(/^Volumen (alto|bajo)$/, 'VTe $1') });
    }
    if (l.alarmaPresion) { subir('pico', 'alarma'); lista.push({ k: 'pres', nivel: 'alarma', texto: `Pmáx alcanzada (${r.pmax ?? 40})` }); }
    alarmasVivas = lista;
    R.alarmas(tapado ? [] : lista);
    const vtMax = Math.round(TOPE.vtkgMax * kg);
    const v = (x) => (tapado ? '?' : x);
    const val = {
      pico: { v: v(f1(l.pico)), lim: `≤${r.pmax ?? 40}` },
      meseta: { v: v(f1(l.meseta)), sub: l.meseta == null && !tapado ? 'pausa: Insp. mant.' : '', lim: `≤${TOPE.meseta}` },
      peeptot: l.peepTot != null ? { v: v(f1(l.peepTot)), sub: tapado ? '' : `total · oculta ${f1(l.autoPeep) ?? '—'}`, lim: `≤${TOPE.peepTotMax}` } : { v: v(f0(r.peep)), sub: 'aplicada', lim: `≤${TOPE.peepTotMax}` },
      pmedia: { v: v(f1(l.pMedia)) },
      frmand: { v: f0(r.fr) },
      fr: { v: v(f0(l.frReal)) },
      vt: { v: v(f0(l.vtExh)), sub: tapado || l.vtExh == null ? '' : `${f1(l.vtExh / kg)} /kg`, lim: `≤${vtMax}` },
      vm: { v: v(f1(l.vm)), lim: `<span>${TOPE.vmMax}</span><span>${TOPE.vmMin}</span>` },
      ie: { v: v(l.ie != null && isFinite(l.ie) ? `1:${f1(l.ie)}` : null) },
      fio2: { v: f0(est.fio2) }, frespon: {}, vmespon: {},
    };
    for (const [k, n] of Object.entries(marca)) if (val[k] && !tapado) val[k].estado = n;
    R.casillas(val);
    // mandos: rango, nota y si están apagados en este modo
    const vcv = r.modo === 'vcv', ti = l.ti ?? (vcv ? r.vt / (r.flujo * 1000 / 60) : 60 / r.fr / (1 + r.ie));
    const vtTope = Math.max(r.vt, Math.min(800, Math.floor(TOPE.vtkgMax * kg / 10) * 10));
    R.mandos({
      fio2: { v: est.fio2 },
      vt: vcv ? { v: r.vt, max: vtTope, nota: `${f1(r.vt / kg)} mL/kg de peso ideal (${f1(kg)} kg). Tope 12 mL/kg: ilustrativo; normal 6-7 (ficha).` } : { v: r.vt, apagado: 'En PC-AC no se fija el volumen: se fija la presión.' },
      ti: vcv ? { v: f1(ti), txt: f1(ti), et: 'Flujo (mueve el Ti)', mueve: 'flujo', vRango: r.flujo, txtDesl: `${r.flujo} L/min`, min: 30, max: 100, paso: 5, u: '', nota: `Ti ${f1(ti)} s. En este modelo el Ti sale del flujo: Ti = VT ÷ flujo (sube el flujo y el Ti se acorta). Ficha: 60 L/min, ≥80 si hay distrés.` }
        : { v: f1(ti), txt: f1(ti), et: 'I:E (mueve el Ti)', mueve: 'ie', vRango: r.ie, txtDesl: `1:${f1(r.ie)}`, min: 1, max: 4, paso: 0.5, u: '', nota: `Ti ${f1(ti)} s · I:E 1:${f1(r.ie)}. En este modelo el Ti sale de la relación I:E y de la FR.` },
      fr: { v: r.fr }, peep: { v: r.peep },
      dpsop: { v: null, txt: '—', apagado: 'Presión de soporte: para la respiración espontánea; no en este modelo.' },
      rampa: { v: null, txt: '—', apagado: 'Rampa: no en este modelo (ilustrativo).' },
      flujo: vcv ? { v: r.flujo } : { v: r.flujo, txt: '—', apagado: 'En PC-AC no se fija el flujo.' },
      pinsp: vcv ? { v: r.pinsp, txt: '—', apagado: 'Solo en PC-AC.' } : { v: r.pinsp },
      pmax: { v: r.pmax ?? 40 },
    });
    R.modo(r.modo, { detenido });
    R.tecla('inspmant', !!P.S.man.pausa); R.tecla('espmant', !!P.S.man.oclusion); R.tecla('congelar', !!est.pausa); R.congelado(est.pausa && !detenido);
  }
  function infoAlarmas() {
    const t = alarmasVivas.length ? alarmasVivas.map((a) => `${a.nivel === 'alarma' ? '⛔' : '⚠'} ${a.texto}`).join(' · ') : 'Sin alarmas';
    R.info(`<b>Alarmas</b> · ${t}. Límites: VMe ${TOPE.vmMin}-${TOPE.vmMax} L/min y PEEP total ≤${TOPE.peepTotMax} (fisiología general); EIP ≤${TOPE.meseta} (ficha); VTe ≤12 mL/kg (ilustrativo); Ppico ≤ tu Pmáx. FR: sin límite (la ficha no lo da). ${cita(C.riesgo)}`);
  }
  let conVol = true;
  function vistas() { conVol = !conVol; R.ver(conVol ? ['paw', 'flujo', 'vol'] : ['paw', 'flujo']); R.info(`<b>Vistas</b> · ${conVol ? 'Paw, flujo y volumen' : 'Paw y flujo (sin la curva de volumen)'}.`); }
  return { R, mon: R.mon, pintar, infoAlarmas, vistas };
}
