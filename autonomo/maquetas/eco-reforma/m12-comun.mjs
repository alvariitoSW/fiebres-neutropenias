// Pieza común de M1 y M2 (maqueta, no es parte de la app): crea el motor real, aplica el escenario y mide
// lo que mediría un ecografista con el mismo código que usa la app (ver mapa-motor.md §3).
import { crearMotor } from '../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, aplicarEscenario } from '../../../js/modules/eco/escenarios.mjs';
import { tapseDeLatido, baseGeometrica } from '../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../js/modules/eco/formas.mjs';
import { ePrima } from '../../../js/modules/eco/atlas/diastolica.mjs';
import { medidasCorazon } from '../../../js/modules/eco/ecografia.mjs';
import * as D from '../../../js/modules/eco/doppler.mjs';

export const PACIENTES = [
  { id: 'normal', k: 'normal', nombre: 'Normal' },
  { id: 'tep', k: 'tep', nombre: 'TEP' },
  { id: 'hp', k: 'hpcronica', nombre: 'HP crónica' },
  { id: 'fallo', k: 'fallo', nombre: 'Fallo VI' },
  { id: 'tapon', k: 'derrame', nombre: 'Taponamiento' },
];
export const defectoDe = (k) => ESCENARIOS[k]?.gravedad?.defecto ?? 0;

// g = undefined -> el defecto de la app; g numérico -> ese 0-1 (el mismo que el deslizador de la app)
export function crearPaciente(k, g) {
  const m = crearMotor(); m.correr(12);
  aplicarEscenario(m, k, g);
  return m;
}

export function medir(m) {
  const o = m.onda, u = m.ultimo;
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const est = estadoGeo(td, extraDeMotor(m));
  const areas = D.areasAnillo(baseGeometrica(est));
  const f = { tipo: 'valvula', n: 'mitral', factor: 1 };
  const mit = D.medidasLatido(D.curvaLatido(o, f, 1, areas, {}), f);
  const e = ePrima(m.p.relajacion, u.fe);
  const vdTd = Math.max(...o.map(x => x.vvd)), vdTs = Math.min(...o.map(x => x.vvd));
  return {
    fevi: 100 * u.fe, fevd: 100 * (vdTd - vdTs) / vdTd, tapse: tapseDeLatido(u),
    psap: u.paps, papd: u.papd, pvc: u.pvc, gc: u.gc, pam: u.pam, fc: u.fc,
    ee: mit.E / e.avg, eprima: e.avg, E: mit.E,
    vdvi: vdTd / Math.max(...o.map(x => x.vvi)),
    paredVd: medidasCorazon(est).paredVd, mioVd: m.p.mioVd ?? 1, triv: (u.tMitAbre - u.tS2) * 1000,
  };
}
export const coma = (x, d = 0) => Number(x).toFixed(d).replace('.', ',');
