// Puente «de hoy» del contrato (mv-eco-1): lo que HOY sale del dibujo o del atlas y no del motor. Cada valor lleva
// origen 'puente-hoy' y la función de hoy que lo da. Es lo que el paso 2 moverá al motor; así contrato.mjs no importa
// nada del dibujo. Solo lee el motor (no llama a paso()). La medida es la de pruebas/medir-forma.mjs (misma lógica).
import { tapseDeLatido, anillosDe, paredesDe, LIMITES } from './anatomia.mjs';
import { estadoGeo, extraDeMotor, aplanamientoSeptal } from './formas.mjs';
import * as D from './doppler.mjs';

// Escala del septo de hoy: 0-1 (0 normal; 1 aplanado, binario desde TEP 50 %). El −1…+1 continuo llega en el paso 2.
export const ESCALA_SEPTO_HOY = '0-1 (aplanamientoSeptal de formas.mjs); el −1…+1 llega en el paso 2';

export function puenteHoy(motor) {
  const o = motor.onda, u = motor.ultimo;
  if (!o?.length || !u) return { valores: {}, funcion: {}, serie: { septo: [] } };
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const est = estadoGeo(td, extraDeMotor(motor));
  const an = anillosDe(est.vvi, est.vvd), areas = an.areas;   // mm² (anatomia.mjs: del corazón, sin pasar por el dibujo)
  const mc = paredesDe(est);                                  // paredVi, paredVd, masaIndice (anatomia.mjs); el septo entra como dato
  const fm = { tipo: 'valvula', n: 'mitral', factor: 1 };
  const mit = D.medidasLatido(D.curvaLatido(o, fm, 1, areas, {}), fm);
  const e = u.ePrima;   // e′ del motor (motor.mjs: ePrimaDeOnda)
  const vdTd = Math.max(...o.map(x => x.vvd)), vdTs = Math.min(...o.map(x => x.vvd));
    const valores = {
    'anillo.excursion.tri': tapseDeLatido(u),
    'pared.vd': mc.paredVd, 'pared.vi': mc.paredVi, 'masa.vi': mc.masaIndice,
    'anillo.mit': an.cm2.mit, 'anillo.tri': an.cm2.tri, 'anillo.ao': an.cm2.ao, 'anillo.pul': an.cm2.pul,
    'anillo.vel.e': e.avg, eSep: e.sep, eLat: e.lat,
    E: mit.E, A: mit.A, ea: mit.ea, dt: mit.tde, fusion: !!mit.fusion, eE: mit.E / e.avg,
    // raíz aórtica: la geometría de hoy solo da el anillo (rA); la raíz (senos) es ilustrativa en el dibujo → hueco
    fueraDeMarco: vdTd > LIMITES.vd[1] || vdTs < LIMITES.vd[0] || Math.max(...o.map(x => x.vvi)) > LIMITES.vi[1],
  };
  const funcion = {
    'anillo.excursion.tri': 'tapseDeLatido (anatomia.mjs)', 'pared.vd': 'paredesDe (anatomia.mjs)',
    'pared.vi': 'paredesDe (anatomia.mjs)', 'masa.vi': 'paredesDe (anatomia.mjs)',
    'anillo.mit': 'anillosDe (anatomia.mjs)', 'anillo.tri': 'anillosDe (anatomia.mjs)', 'anillo.ao': 'anillosDe (anatomia.mjs)',
    'anillo.pul': 'anillosDe (anatomia.mjs)', 'anillo.vel.e': 'ePrimaDeOnda (motor.mjs)', eSep: 'ePrimaDeOnda', eLat: 'ePrimaDeOnda',
    E: 'medidasLatido (doppler.mjs)', A: 'medidasLatido', ea: 'medidasLatido', dt: 'medidasLatido (tde)', fusion: 'medidasLatido',
    eE: 'medidasLatido / ePrimaDeOnda', fueraDeMarco: 'LIMITES (anatomia.mjs)', limites: 'LIMITES (anatomia.mjs)', septo: 'aplanamientoSeptal (formas.mjs)',
  };
  return { valores, limites: LIMITES, funcion, serie: { septo: o.map(aplanamientoSeptal) } };
}
