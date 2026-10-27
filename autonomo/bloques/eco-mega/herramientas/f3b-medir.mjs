// F3b: mide la AI del motor en cada escenario (antes/después de calibrar). Uso: node f3b-medir.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
const f = (x, d = 1) => Number(x).toFixed(d);
for (const k of ['normal', 'hipertrofia', 'dilatada', 'tep', 'hemorragia', 'derrame']) {
  const m = crearMotor(JSON.parse(process.env.AJ || '{}')); m.correr(12); ESCENARIOS[k].aplicar(m);
  if (k !== 'normal') m.correr(ESCENARIOS[k].forma || k === 'hemorragia' ? ASENTAR_FORMA : 40);
  const o = m.onda, u = m.ultimo;
  const A = o.filter(x => x.fase === 'A');
  const ai = o.map(x => x.vai), pai = o.map(x => x.pai);
  const vA = A.length ? (A[0].vai - Math.min(...A.map(x => x.vai))) : 0;      // vaciado de la AI en la fase A
  const vtd = Math.max(...o.map(x => x.vvi)), vts = Math.min(...o.map(x => x.vvi));
  const mit = o.map(x => x.qMit);
  const E = Math.max(...o.filter(x => 'EFG'.includes(x.fase) && x.t < 0.9 * (o[o.length-1].t)).map(x => x.qMit));
  const Aq = Math.max(...A.map(x => x.qMit));
  const qv = o.map(x => x.qVp);
  const D = Math.max(0, ...o.filter(x => 'FG'.includes(x.fase)).map(x => x.qVp));
  const iAm = A.reduce((a, x, i) => (x.qVp < A[a].qVp ? i : a), 0), S = Math.max(...A.slice(iAm).map(x => x.qVp), ...o.filter(x => 'BCDE'.includes(x.fase)).map(x => x.qVp)), Ar = -Math.min(0, ...A.map(x => x.qVp));
  const dtm = o.length > 1 ? (o[1].t - o[0].t) : 0.002, bomba = A.reduce((a, x) => a + Math.max(0, x.qMit) * dtm, 0), llen = o.reduce((a, x) => a + Math.max(0, x.qMit) * dtm, 0);
  console.log(k.padEnd(11), `PAM ${f(u.pam,0)} PCP ${f(u.pcp)} PVC ${f(u.pvc)} GC ${f(u.gc,2)} | VAI ${f(Math.min(...ai),0)}-${f(Math.max(...ai),0)} vaciaA ${f(vA,1)}mL (${f(100*vA/ai[0],0)}%AI, ${f(100*vA/vtd,0)}%VTD ${f(100*vA/(vtd-vts+0),0)}%VS) | bombaA ${f(bomba,1)}mL = ${f(100*bomba/llen,0)}% del llenado (${f(llen,0)}) | pAI ${f(Math.min(...pai))}-${f(Math.max(...pai))} media ${f(pai.reduce((a,b)=>a+b)/pai.length)} | qVp ${f(Math.min(...qv),0)}..${f(Math.max(...qv),0)} S ${f(S,0)} D ${f(D,0)} Ar ${f(Ar,0)} (mL/s) | E/A ${f(E/Aq,2)} (E ${f(E,0)} A ${f(Aq,0)})`);
}
