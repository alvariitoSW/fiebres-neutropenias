// Neumotórax: presión pleural directa (pleura) frente a la vía de la CPAP. Uso: node autonomo/bloques/b3/herramientas/e4c-pleura.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +x.toFixed(d);
for (const tipo of ['normal', 'ic']) for (const pleura of [0, 5, 10, 15, 20, 25, 30]) {
  const rec = tipo === 'ic' ? { ...S.RECETA_IC, g: 1 } : { esc: 'normal', hb: 14 };
  const c = S.crearCabecera(rec); c.ajustar({ pleura }); c.correr(30);
  const L = c.lectura, u = L.u; console.log(tipo, 'pleura', pleura, JSON.stringify({ VS: r(u.vs), GC: r(L.gcTotal, 2), PAM: r(u.pam, 0), FC: r(u.fc, 0), PVC: r(u.pvc) }));
}
