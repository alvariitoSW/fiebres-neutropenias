// E4b (pieza de motor): el corazón normal con presión torácica 0-30 (neumotórax a tensión): VS, GC y PAM bajan.
// Uso: node autonomo/bloques/b3/herramientas/e4b-torax.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +x.toFixed(d);
for (const cpap of [0, 5, 10, 15, 20, 25, 30]) {
  const c = S.crearCabecera({ esc: 'normal', hb: 14 }); c.ajustar({ cpap }); c.correr(30);
  const L = c.lectura, u = L.u; console.log('pTorax', cpap, JSON.stringify({ VS: r(u.vs), GC: r(L.gcTotal, 2), PAM: r(u.pam, 0), FC: r(u.fc, 0), PVC: r(u.pvc) }));
}
