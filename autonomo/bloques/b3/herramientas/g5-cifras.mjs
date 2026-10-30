// Las 4 recetas de la disección (b3-paso4 g5, 5d): base · nicardipino solo · esmolol · esmolol + nicardipino.
// Uso: node autonomo/bloques/b3/herramientas/g5-cifras.mjs [--json]
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 0) => +x.toFixed(d);
const REC = S.RECETA_DISECCION;
const recetas = [['base', {}], ['nicardipino 10 solo', { nicardipino: 10 }], ['esmolol 100', { esmolol: 100 }], ['esmolol 100 + nicardipino 7,5', { esmolol: 100, nicardipino: 7.5 }],
  ['labetalol 200', { labetalol: 200 }], ['nitroprusiato 2', { nitroprusiato: 2 }], ['opioide', { opioide: true }], ['esmolol 200 + nic 15', { esmolol: 200, nicardipino: 15 }], ['nic 15 solo', { nicardipino: 15 }]];
for (const [n, aj] of recetas) {
  const c = S.crearCabecera(REC, { asentar: 30 }); c.ajustar(aj); c.correr(60);
  const L = c.lectura, u = L.u;
  console.log(n.padEnd(30), `PA ${r(u.pas)}/${r(u.pad_)} PAM ${r(u.pam)} FC ${r(u.fc)} IC ${r(L.icTotal, 2)} PVC ${r(u.pvc, 1)} PCP ${r(u.pvp, 1)}`);
}
