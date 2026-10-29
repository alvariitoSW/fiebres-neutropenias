// Barrido de Remedios: gEsc (fallo del VI de fondo) x g (orificio). Uso: node ... gEsc1,gEsc2 g1,g2
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const ge = (process.argv[2] ?? '0.7').split(',').map(Number), gs = (process.argv[3] ?? '0,0.3,1').split(',').map(Number);
const r = (x, d = 1) => +x.toFixed(d);
for (const e of ge) for (const g of gs) {
  const rec = { ...S.RECETA_REMEDIOS, gEsc: e, g }; if (process.env.VD) rec.viDiastFn = 1;  const c = S.crearCabecera(rec); c.correr(40);
  const L = c.lectura, u = L.u, P = S.perfusion(L, rec);
  console.log(`gEsc${e} g${g}`.padEnd(14), `PAM ${r(u.pam,0)} IC ${r(L.icTotal,2)} PCP ${r(u.pvp)} PAPd ${r(u.papd,0)} PVC ${r(u.pvc)} QpQs ${r(u.qpqs,2)} SatAD ${r(u.satAd*100,0)} SpO2 ${P.spo2} edema ${r(u.vEdema,0)} FE ${r(u.fe*100,0)}`);
}
