// Barrido de la dilatada y el fallo (eco-calibra-a s2, dilfallo). Uso:
// node dilfallo.mjs <forma> <g|def|-> 'm.p.vi.b*=1.3; m.s.vven-=200'  (el tercer argumento se ejecuta tras aplicar)
const R = new URL('../../../../../js/modules/eco/', import.meta.url).href;
const { medirForma } = await import(R + 'pruebas/medir-forma.mjs');
const { ESCENARIOS } = await import(R + 'escenarios.mjs');
const { crearMotor } = await import(R + 'motor.mjs');
const { ASENTAR_FORMA } = await import(R + 'escenarios.mjs');
const { medirLlenado, algoritmoAse } = await import(R + 'atlas/diastolica.mjs');
const [k, gs = 'def', extra = ''] = process.argv.slice(2);
const g = gs === 'def' || gs === '-' ? undefined : Number(gs);
const ap = ESCENARIOS[k].aplicar;
ESCENARIOS[k].aplicar = (m, gg) => { gg === undefined ? ap(m) : ap(m, gg); new Function('m', extra)(m); };
const x = medirForma(k, g);
const f = (v, d = 1) => v == null || Number.isNaN(v) ? '-' : Number(v).toFixed(d);
const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
const v = medirLlenado(m), a = algoritmoAse(v), u = m.ultimo;
console.log(`${k}:${gs} [${extra}] E${f(x.E, 0)} A${f(x.A, 0)} E/A${f(x.ea, 2)} DT${f(x.dt, 0)} e'${f(x.eSep)}/${f(x.eLat)} E/e'${f(x.eE)} | PCP${f(x.pcp)} PAM${f(x.pam, 0)} FC${f(x.fc, 0)} GC${f(x.gc, 2)} PVC${f(x.pvc)} PAPs${f(x.paps, 0)} | S${f(x.S, 0)} D${f(x.D, 0)} S/D${f(x.sd, 2)} bombaAI${f(x.bombaAI, 0)} | FE${f(u.fe * 100, 0)} VTD${f(u.edv, 0)} PTDVI${f(u.ptdvi)} | ASE rama ${a.rama} grado ${a.grado} | fuera ${x.fuera.join(',') || 'no'}`);
