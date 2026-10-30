// M0c (b3-paso4 g3): barrido del desplazamiento septal. Uso: SEPTO=0.5 node m0c-barrido.mjs
// Escenarios que tocan el VD (tep, hpcronica) y recetas iam-vd (fallo g, eesVd, volemia «líquidos»)
const R = (p) => new URL('../../../../' + p, import.meta.url);
const { crearMotor } = await import(R('js/modules/eco/motor.mjs'));
const { ESCENARIOS } = await import(R('js/modules/eco/escenarios.mjs'));
const S = await import(R('js/modules/libros/shock-vivo/soporte.mjs'));
const f = (x, d = 1) => x.toFixed(d);
const fila = (t, u, ic) => console.log(t.padEnd(24), `PA ${f(u.pas, 0)}/${f(u.pad_, 0)} FC ${f(u.fc, 0)} IC ${f(ic, 2)} PCP ${f(u.pcp)} PVC ${f(u.pvc)} FEVI ${f(u.fe * 100, 0)} VTD VI ${f(u.edv, 0)} VD ${f(u.edvD, 0)} VD/VI ${f(u.edvD / u.edv, 2)} pperi ${f(u.pperi)}`);
for (const k of (process.env.ESC ?? 'tep,hpcronica').split(',').filter(Boolean)) { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m); m.correr(40); fila(k, m.ultimo, m.ultimo.ic); }
const gs = (process.env.G ?? '0.05').split(',').map(Number), es = (process.env.EES ?? '0.15').split(',').map(Number), vs = (process.env.VOL ?? '0,1000,1500').split(',').map(Number);
for (const g of gs) for (const e of es) for (const v of vs) { const c = S.crearCabecera({ esc: 'fallo', g, eesVd: e, volemia: v, hb: 14 }); c.correr(40); fila(`iam-vd g${g} ees${e} +${v}`, c.m.ultimo, c.lectura.icTotal); }
