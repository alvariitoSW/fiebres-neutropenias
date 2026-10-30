// Puente «de hoy» del contrato (mv-eco-1): lo que HOY sale del dibujo o del atlas y no del motor. Cada valor lleva
// origen 'puente-hoy' y la función de hoy que lo da. Es lo que el paso 2 moverá al motor; así contrato.mjs no importa
// nada del dibujo. Solo lee el motor (no llama a paso()). La medida es la de pruebas/medir-forma.mjs (misma lógica).
import { tapseDeLatido, baseGeometrica, LIMITES } from './corazon-geo.mjs';
import { estadoGeo, extraDeMotor, aplanamientoSeptal } from './formas.mjs';
import { medidasCorazon } from './ecografia.mjs';
import * as D from './doppler.mjs';
import { ePrima } from './atlas/diastolica.mjs';

// Escala del septo de hoy: 0-1 (0 normal; 1 aplanado, binario desde TEP 50 %). El −1…+1 continuo llega en el paso 2.
export const ESCALA_SEPTO_HOY = '0-1 (aplanamientoSeptal de formas.mjs); el −1…+1 llega en el paso 2';

export function puenteHoy(motor) {
  const o = motor.onda, u = motor.ultimo;
  if (!o?.length || !u) return { valores: {}, funcion: {}, serie: { septo: [] } };
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const est = estadoGeo(td, extraDeMotor(motor));
  const g = baseGeometrica(est);
  const areas = D.areasAnillo(g);                       // mm²
  const mc = medidasCorazon(est);
  const fm = { tipo: 'valvula', n: 'mitral', factor: 1 };
  const mit = D.medidasLatido(D.curvaLatido(o, fm, 1, areas, {}), fm);
  const e = ePrima(motor.p.relajacion, u.fe);
  const vdTd = Math.max(...o.map(x => x.vvd)), vdTs = Math.min(...o.map(x => x.vvd));
  const cm2 = (x) => x / 100;
  const valores = {
    'anillo.excursion.tri': tapseDeLatido(u),
    'pared.vd': mc.paredVd, 'pared.vi': mc.paredPost, 'masa.vi': mc.masaIndice,
    'anillo.mit': cm2(areas.mitral), 'anillo.tri': cm2(areas.tricus), 'anillo.ao': cm2(areas.aortica), 'anillo.pul': cm2(areas.pulmonar),
    'anillo.vel.e': e.avg, eSep: e.sep, eLat: e.lat,
    E: mit.E, A: mit.A, ea: mit.ea, dt: mit.tde, fusion: !!mit.fusion, eE: mit.E / e.avg,
    // raíz aórtica: la geometría de hoy solo da el anillo (rA); la raíz (senos) es ilustrativa en el dibujo → hueco
    fueraDeMarco: vdTd > LIMITES.vd[1] || vdTs < LIMITES.vd[0] || Math.max(...o.map(x => x.vvi)) > LIMITES.vi[1],
  };
  const funcion = {
    'anillo.excursion.tri': 'tapseDeLatido (corazon-geo.mjs)', 'pared.vd': 'medidasCorazon().paredVd (ecografia.mjs)',
    'pared.vi': 'medidasCorazon().paredPost (ecografia.mjs)', 'masa.vi': 'medidasCorazon().masaIndice (ecografia.mjs)',
    'anillo.mit': 'areasAnillo (doppler.mjs)', 'anillo.tri': 'areasAnillo (doppler.mjs)', 'anillo.ao': 'areasAnillo (doppler.mjs)',
    'anillo.pul': 'areasAnillo (doppler.mjs)', 'anillo.vel.e': 'ePrima (atlas/diastolica.mjs)', eSep: 'ePrima', eLat: 'ePrima',
    E: 'medidasLatido (doppler.mjs)', A: 'medidasLatido', ea: 'medidasLatido', dt: 'medidasLatido (tde)', fusion: 'medidasLatido',
    eE: 'medidasLatido / ePrima', fueraDeMarco: 'LIMITES (corazon-geo.mjs)', limites: 'LIMITES (corazon-geo.mjs)', septo: 'aplanamientoSeptal (formas.mjs)',
  };
  return { valores, limites: LIMITES, funcion, serie: { septo: o.map(aplanamientoSeptal) } };
}
