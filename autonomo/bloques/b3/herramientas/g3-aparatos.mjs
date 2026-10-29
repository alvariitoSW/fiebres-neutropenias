// Aparatos (balón, Impella, ECMO VA) sobre Benito y Remedios (b3-paso4 g3 arreglos). Uso: node g3-aparatos.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 0) => +x.toFixed(d);
const casos = { Benito: S.RECETA_BENITO, Remedios: S.RECETA_REMEDIOS, Aurelio: { esc: 'fallo', g: 0.8, hb: 14 } };
const aj = { ninguno: {}, balon: { soporte: 'balon' }, impella: { soporte: 'impella' }, 'ecmo 4,5': { soporte: 'ecmo' }, 'ecmo+balon': { soporte: 'ecmo', venteo: 'balon' }, 'ecmo+impella': { soporte: 'ecmo', venteo: 'impella' } };
for (const [n, rec] of Object.entries(casos)) for (const [a, x] of Object.entries(aj)) {
  const c = S.crearCabecera(rec); Object.assign(c.ajuste, x); c.correr(40); const L = c.lectura, u = L.u, P = S.perfusion(L, rec);
  console.log(`${n} ${a}`.padEnd(24), `PA ${r(u.pas)}/${r(u.pad_)} PAM ${r(u.pam)} FC ${r(u.fc)} IC ${r(L.icTotal, 2)} PCP ${r(u.pvp, 1)} PAPd ${r(u.papd)} PVC ${r(u.pvc, 1)} FEVI ${r(u.feTotal * 100)} Qp/Qs ${r(u.qpqs, 2)} SpO2 ${P.spo2} lact ${r(P.lactObj, 1)}`);
}
