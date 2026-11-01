// v4m · barrido del reloj auricular (picoAurAntes) y de la diástole izquierda: cierre de las AV respecto a pr, eAur al cerrar,
// gradiente telediastólico VD−AD (normal, HP 1, TEP 1), PVC, y la diástole del atlas 10 (E, A, E/A, TDE, grado) + dilatada + IM del 07.
//   node autonomo/bloques/mv-eco/herramientas/v4m-reloj.mjs '[0,0.02,0.05]' ['{"ai":{"ees":0.37}}']   (base del motor a fundir en BASE)
import { BASE } from '../../../../js/modules/eco/motor.mjs';
import { medir } from './m1-chorro.mjs';
import { CORAZONES_LLENADO, motorLlenado, medirLlenado, algoritmoAse } from '../../../../js/modules/eco/atlas/diastolica.mjs';
import { PRESETS, asentar, medidasAsa } from '../../../../js/modules/eco/atlas/asa.mjs';
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
const vals = JSON.parse(process.argv[2] || '[0]'), extra = JSON.parse(process.argv[3] || '{}');
if (process.env.LLENADO) JSON.parse(process.env.LLENADO).forEach((c, i) => Object.assign(CORAZONES_LLENADO[i], c));   // LLENADO='[{},{"relajacion":3}]'
for (const [k, v] of Object.entries(extra)) { if (typeof v === 'object') Object.assign(BASE[k], v); else BASE[k] = v; }
for (const pa of vals) {
  BASE.picoAurAntes = pa;
  const m = crearMotor(); m.correr(12); const o = m.onda, pr = m.p.pr, t0 = o[0].t;
  const cierre = (f) => { const i = o.findIndex((s, j) => j > 0 && s.t >= pr - 0.02 && f(s)); return i < 0 ? NaN : o[i]; };
  const ct = cierre(s => s.pvd > s.pad), cm = cierre(s => s.pvi > s.pai);
  const lin = [`pAA ${pa}`, `tric cierra ${((ct.t - pr) * 1000).toFixed(0)}ms eAur ${ct.eAur.toFixed(2)}`, `mitral cierra ${((cm.t - pr) * 1000).toFixed(0)}ms eAur ${cm.eAur.toFixed(2)}`];
  for (const [k, g] of [['normal'], ['hpcronica', 1], ['tep', 1]]) { const r = medir(k, g); lin.push(`${k[0]}${g ?? ''} gd ${r.gd.toFixed(1)} PVC ${r.pvc.toFixed(1)}`); }
  console.log(lin.join(' | '));
  const d = [0, 1, 2, 3].map(f => { const v = medirLlenado(motorLlenado(f)); return `f${f} E ${v.E.toFixed(0)} A ${v.A.toFixed(0)} E/A ${v.ea?.toFixed(2)} TDE ${v.tde?.toFixed(0)} TRIV ${v.triv.toFixed(0)} PAI ${v.pai.toFixed(1)} g ${algoritmoAse(v).grado}`; });
  console.log('  ' + d.join(' | '));
  const md = crearMotor(); md.correr(12); ESCENARIOS.dilatada.aplicar(md); md.correr(ASENTAR_FORMA); const vd = medirLlenado(md);
  const im = medidasAsa(asentar(PRESETS.im));
  console.log(`  dilatada E/A ${vd.ea.toFixed(2)} TDE ${vd.tde?.toFixed(0)} e′ ${vd.avg.toFixed(1)} PAI ${vd.pai.toFixed(1)} g ${algoritmoAse(vd).grado} | IM caidaB ${im.caidaB.toFixed(2)} ptd ${im.ptd.toFixed(1)}`);
}
