import { medirForma } from '/home/user/fiebres-neutropenias/js/modules/eco/pruebas/medir-forma.mjs';
import { ESCENARIOS } from '/home/user/fiebres-neutropenias/js/modules/eco/escenarios.mjs';
const [r, bm, vv] = process.argv.slice(2).map(Number);
const ap = ESCENARIOS.dilatada.aplicar;
ESCENARIOS.dilatada.aplicar = (m) => { ap(m); m.p.relajacion = r; m.p.vi.b *= bm; m.s.vven += vv; m.p.ai.ees *= (process.argv[5]||1); };
const x = medirForma('dilatada');
const f=(v,d=1)=>Number(v).toFixed(d);
console.log(`r${r} b×${bm}: E${f(x.E,0)} A${f(x.A,0)} E/A${f(x.ea,2)} DT${f(x.dt,0)} e'${f(x.eSep)}/${f(x.eLat)} E/e'${f(x.eE)} PCP${f(x.pcp)} S${f(x.S,0)} D${f(x.D,0)} S/D${f(x.sd,2)} GC${f(x.gc,2)} PAM${f(x.pam,0)} fuera ${x.fuera}`);
