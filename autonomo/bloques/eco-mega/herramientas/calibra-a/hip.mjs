import { medirForma } from '/home/user/fiebres-neutropenias/js/modules/eco/pruebas/medir-forma.mjs';
import { ESCENARIOS } from '/home/user/fiebres-neutropenias/js/modules/eco/escenarios.mjs';
const [r, bm, vv, ae] = process.argv.slice(2).map(Number);
ESCENARIOS.hipertrofia.aplicar = (m) => { m.p.mioVi = 1.6; m.p.vi.b *= bm; m.p.rSis *= 1.25; m.p.relajacion = r; m.s.vven += vv; m.p.ai.ees *= (ae||1); };
const x = medirForma('hipertrofia');
const f=(v,d=1)=>Number(v).toFixed(d);
console.log(`r${r} b×${bm} v+${vv}: E${f(x.E,0)} A${f(x.A,0)} E/A${f(x.ea,2)} DT${f(x.dt,0)} e'${f(x.eSep)}/${f(x.eLat)} E/e'${f(x.eE)} PCP${f(x.pcp)} S${f(x.S,0)} D${f(x.D,0)} PAPs${f(x.paps,0)} GC${f(x.gc,2)} PAM${f(x.pam,0)} fuera ${x.fuera}`);
