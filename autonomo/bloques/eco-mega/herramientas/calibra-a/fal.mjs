import { medirForma } from '/home/user/fiebres-neutropenias/js/modules/eco/pruebas/medir-forma.mjs';
import { ESCENARIOS } from '/home/user/fiebres-neutropenias/js/modules/eco/escenarios.mjs';
const [g, bm, vv] = process.argv.slice(2).map(Number);
const ap = ESCENARIOS.fallo.aplicar;
ESCENARIOS.fallo.aplicar = (m, gg) => { ap(m, gg); m.p.vi.b *= bm; m.s.vven += vv; };
const x = medirForma('fallo', g);
const f=(v,d=1)=>Number(v).toFixed(d);
console.log(`g${g} b×${bm} v+${vv}: E${f(x.E,0)} A${f(x.A,0)} E/A${f(x.ea,2)} DT${f(x.dt,0)} E/e'${f(x.eE)} PCP${f(x.pcp)} S${f(x.S,0)} D${f(x.D,0)} S/D${f(x.sd,2)} GC${f(x.gc,2)} PAM${f(x.pam,0)} FC${f(x.fc,0)} ${x.fuera}`);
