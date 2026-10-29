// M0 (b3-paso4 g3): cifras del motor antes/después del arreglo de la PVC y del VD.
// Uso: node m0-cifras.mjs  → escenarios de la eco (motor solo, gravedad por defecto) y pacientes del shock vivo (cabecera)
const R = (p) => new URL('../../../../' + p, import.meta.url);
const { crearMotor } = await import(R('js/modules/eco/motor.mjs'));
const { ESCENARIOS } = await import(R('js/modules/eco/escenarios.mjs'));
const S = await import(R('js/modules/libros/shock-vivo/soporte.mjs'));
const f = (x, d = 1) => (typeof x === 'number' ? x.toFixed(d) : String(x));
function fila(tag, u, ic, pvcCab) {
  const irvs = (u.pam - u.pvc) / Math.max(0.3, ic);
  console.log(tag.padEnd(26), `PA ${f(u.pas, 0)}/${f(u.pad_, 0)} PAM ${f(u.pam, 0)} FC ${f(u.fc, 0)} IC ${f(ic, 2)} PCP ${f(u.pcp)} PVC ${f(u.pvc)}${pvcCab != null ? ` (cab ${f(pvcCab)})` : ''} PAP ${f(u.paps, 0)}/${f(u.papd, 0)} FEVI ${f(u.fe * 100, 0)} VTD VI ${f(u.edv, 0)} VTD VD ${f(u.edvD, 0)} VD/VI ${f(u.edvD / u.edv, 2)} pperi ${f(u.pperi)} IRVS ${f(irvs, 0)}`);
}
console.log('== Escenarios de la eco (motor solo, g por defecto, 12 s + 40 s)');
for (const k of Object.keys(ESCENARIOS)) {
  const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m); m.correr(40);
  fila(k, m.ultimo, m.ultimo.ic);
}
const rec = (r, tocar) => { const c = S.crearCabecera(r); if (tocar) tocar(c); c.correr(40); const L = c.lectura; return { u: c.m.ultimo, ic: L.icTotal, pvcCab: L.u.pvc }; };
const pac = (tag, r, tocar) => { const x = rec(r, tocar); fila(tag, x.u, x.ic, x.pvcCab); };
console.log('== Pacientes del shock vivo (cabecera, 40 s)');
const { PACIENTES } = await import(R('js/data/shock-vivo-data.js'));
const au = PACIENTES.find((p) => p.k === 'aurelio').rec;
pac('Aurelio 0 h (receta)', au);
pac('Aurelio 0 h +250 mL', au, (c) => { c.correr(40); c.volumen(250); });
pac('Aurelio 18 h (g.92 v0)', { esc: 'fallo', g: 0.92, volemia: 0, hb: 14 });
pac('Aurelio receta g .92 (pagina)', { ...au, g: 0.92 });
pac('Aurelio receta g 1 (G3)', { ...au, g: 1, volemia: 0 });
pac('Benito (papilar)', { esc: 'fallo', g: 0.75, eroaMitral: 0.8, volemia: 0, hb: 14 });
for (const h of [0, 24, 72]) pac(`Virginia ${h} h`, { esc: 'posparo', g: S.gDePosparo(h), hb: 12.6 });
pac('fallo g.9 vol 0', { esc: 'fallo', g: 0.9, hb: 14 });
for (const e of [0.6, 0.3, 0.15, 0.1]) pac(`iam-vd eesVd ${e}`, { esc: 'fallo', g: 0.05, eesVd: e, hb: 14 });
for (const v of [1000, 1250, 2000]) pac(`iam-vd .15 +${v} mL`, { esc: "fallo", g: 0.05, eesVd: 0.15, volemia: v, hb: 14 });
pac("iam-vd g0 .1 +1250 mL", { esc: "fallo", g: 0, eesVd: 0.1, volemia: 1250, hb: 14 });
