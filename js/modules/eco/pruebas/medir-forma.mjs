// Medidor de una forma de paciente en un punto de su mando: lo usan el juez J1/J2 (paciente-doppler.test.mjs) y
// la tabla de autonomo/bloques/eco-mega/herramientas/calibra-tabla.mjs. Un solo sitio para la medida.
// medirForma('tep', 'def' | 0 | 1) → { E, A, ea, dt, eSep, eLat, eAvg, eE, S, D, Ar, sd, bombaAI, bombaAD, tapse,
//   vdTd, vdTs, viTd, pam, fc, pcp, paps, pvc, gc, aAI, aAD, fuera: [texto de cada muestra fuera de LIMITES] }
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { tapseDeLatido, LIMITES, baseGeometrica } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import * as D from '../doppler.mjs';
import { ePrima } from '../atlas/diastolica.mjs';

const f = (x, d = 0) => (x == null || Number.isNaN(x)) ? '-' : Number(x).toFixed(d);

export function medirForma(k, g) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') {
    if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g);
    m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
  }
  const o = m.onda, u = m.ultimo;
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const areas = D.areasAnillo(baseGeometrica(estadoGeo(td, extraDeMotor(m))));
  const mit = D.medidasLatido(D.curvaLatido(o, { tipo: 'valvula', n: 'mitral', factor: 1 }, 1, areas, {}), { tipo: 'valvula', n: 'mitral', factor: 1 });
  const pv = D.medidasLatido(D.curvaLatido(o, { tipo: 'vaso', vasoTipo: 'pulmonar', factor: 1, r: 5 }, 1, areas, { rRetorno: m.p.rRetorno, pvc: u.pvc }), { tipo: 'vaso', vasoTipo: 'pulmonar', factor: 1 });
  const e = ePrima(m.p.relajacion, u.fe);
  const dt = o[1].t - o[0].t, A = o.filter(x => x.fase === 'A');
  const aW = (key) => Math.max(...A.map(x => x[key])) - A[0][key];
  const bomba = (q) => { const ll = o.reduce((a, x) => a + Math.max(0, x[q]) * dt, 0); return 100 * A.reduce((a, x) => a + Math.max(0, x[q]) * dt, 0) / ll; };
  const vdTd = Math.max(...o.map(x => x.vvd)), vdTs = Math.min(...o.map(x => x.vvd)), viTd = Math.max(...o.map(x => x.vvi));
  const fuera = [];
  const ch = (n, vals, lim) => { const mx = Math.max(...vals), mn = Math.min(...vals); if (mx > lim[1]) fuera.push(`${n}+${f(mx - lim[1])}(${f(mx)})`); if (mn < lim[0]) fuera.push(`${n}-${f(lim[0] - mn)}(${f(mn)})`); };
  ch('VI', o.map(x => x.vvi), LIMITES.vi); ch('VD', o.map(x => x.vvd), LIMITES.vd);
  ch('AI/AD', o.flatMap(x => [x.vai, x.vad]), LIMITES.au);
  const feVd = 100 * (vdTd - vdTs) / vdTd;
  return {
    E: mit.E, A: mit.A, ea: mit.ea, dt: mit.tde, eSep: e.sep, eLat: e.lat, eAvg: e.avg, eE: mit.E / e.avg,
    S: pv.S, D: pv.D, Ar: pv.Ar, sd: pv.sd, bombaAI: bomba('qMit'), bombaAD: bomba('qTri'),
    tapse: tapseDeLatido(u), vdTd, vdTs, viTd, pam: u.pam, fc: u.fc, pcp: u.pcp, paps: u.paps, pvc: u.pvc, gc: u.gc,
    aAI: aW('pai'), aAD: aW('pad'), feVd, tapsePaps: tapseDeLatido(u) / u.paps, fuera,
  };
}

// Las 12 formas/puntos de la tabla: 3 fijas y 6 con mando × (0, def, 1)
export const CASOS_FORMA = [['normal'], ['vasoplejia'], ['dilatada']];
for (const k of ['hemorragia', 'fallo', 'derrame', 'tep', 'hpcronica', 'hipertrofia']) CASOS_FORMA.push([k, 0], [k, 'def'], [k, 1]);
export const claveCaso = (k, g) => `${k}:${g ?? '-'}`;
