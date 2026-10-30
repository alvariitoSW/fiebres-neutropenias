// 3b (b3-paso4 g3): barrido del orificio del septo (civ, cm²) sobre IAM con fallo del VI. Uso: node 3b-barrido.mjs [g]
const R = (p) => new URL('../../../../' + p, import.meta.url);
const S = await import(R('js/modules/libros/shock-vivo/soporte.mjs'));
const f = (x, d = 1) => x.toFixed(d);
const g = +(process.argv[2] ?? 0.6);
for (const civ of [0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0, 1.3, 2.0]) {
  const c = S.crearCabecera({ esc: 'fallo', g, hb: 14, civ }); c.correr(40);
  const u = c.m.ultimo, L = c.lectura;
  console.log(`civ ${civ}`.padEnd(8), `PA ${f(u.pas,0)}/${f(u.pad_,0)} PAM ${f(u.pam,0)} FC ${f(u.fc,0)} IC ${f(L.icTotal,2)} Qp/Qs ${f(u.qpqs,2)} Qsh ${f(u.qsh,2)} SatAD ${f(u.satAd*100,0)} SatAP ${f(u.satAp*100,0)} PCP ${f(u.pcp)} PVC ${f(u.pvc)} PAP ${f(u.paps,0)}/${f(u.papd,0)} FEVI ${f(u.fe*100,0)} VD/VI ${f(u.edvD/u.edv,2)}`);
}
