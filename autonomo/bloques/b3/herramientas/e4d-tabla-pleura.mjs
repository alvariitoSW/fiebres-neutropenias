// Tabla VS / GC / PAM de Ramiro (g=1) y el normal con pleura 0-30 y CPAP 5/10/15. Uso: node autonomo/bloques/b3/herramientas/e4d-tabla-pleura.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +x.toFixed(d);
for (const [n, rec] of [['ramiro', { ...S.RECETA_IC, g: 1 }], ['normal', { esc: 'normal', hb: 14 }]])
  for (const aj of [0, 10, 15, 20, 25, 30].map(pleura => ({ pleura })).concat([5, 10, 15].map(cpap => ({ cpap })))) {
    const c = S.crearCabecera(rec); c.ajustar(aj); c.correr(40); const L = c.lectura;
    console.log(n, JSON.stringify(aj), 'VS', r(L.u.vs), 'GC', r(L.gcTotal, 2), 'PAM', r(L.u.pam, 0));
  }
