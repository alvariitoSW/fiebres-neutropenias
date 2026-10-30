// Diagnóstico del tabique (b3-paso4): PARA PROBAR, necesita fGaar y civVd en motor.mjs (se revirtieron: no dieron la dirección). Env GE = subida de gEsc con g, G0 = gEsc de partida.
// Uso: node tab-diag.mjs fGaar civVd [g1,g2..]
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const fG = +(process.argv[2] ?? 0), cV = +(process.argv[3] ?? 0), gs = (process.argv[4] ?? '0,0.3,0.7,1').split(',').map(Number);
const r = (x, d = 1) => +x.toFixed(d);
for (const g of gs) {
  const rec = { ...S.RECETA_REMEDIOS, g, gEsc: (+process.env.G0 || 0.7) + (+process.env.GE || 0) * g }; const c = S.crearCabecera(rec);
  const m = c.motor ?? c.m; m.p.fGaar = fG; m.p.civVd = cV; c.correr(40);
  const L = c.lectura, u = L.u;
  console.log(`g${g}`.padEnd(6), `PAM ${r(u.pam,0)} IC ${r(L.icTotal,2)} PCP ${r(u.pvp)} PAPd ${r(u.papd,0)} PVC ${r(u.pvc)} QpQs ${r(u.qpqs,2)} SatAD ${r(u.satAd*100,0)} edema ${r(u.vEdema,0)}`);
}
