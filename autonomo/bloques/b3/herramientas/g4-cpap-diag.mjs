// Diagnóstico CPAP (b3-paso4 g4): bucle presión-volumen del VI y retorno venoso con CPAP 0/5/10/15.
// Uso: node autonomo/bloques/b3/herramientas/g4-cpap-diag.mjs [ic|seco|sano]
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +(+x).toFixed(d);
const que = process.argv[2] || 'ic';
const rec = { ic: { ...S.RECETA_IC, g: 1 }, seco: { esc: 'hemorragia', g: 0.5, hb: 13.8 }, sano: { esc: 'hemorragia', g: 0, hb: 13.8 } }[que];
for (const cpap of [0, 5, 10, 15]) {
  const c = S.crearCabecera(rec); c.ajustar({ cpap }); c.correr(40);
  const u = c.lectura.u, s = c.m.s, p = c.m.p;
  console.log(cpap, JSON.stringify({ VS: r(u.vs, 0), edv: r(u.edv, 0), esv: r(u.esv, 0), ptdvi: r(u.ptdvi), pvimax: r(u.pvi_max, 0), pas: r(u.pas,0), eesVi: r(s.eesVi * (1 + s.efEes), 2), pam: r(u.pam, 0), pven: r(u.pven), pvc: r(u.pvc), efR: r(s.efR, 2), efVu: r(s.efVu, 2), fc: r(u.fc, 0), vven: r(s.vven, 0), vvp: r(s.vvp, 0), vap: r(s.vap, 0) }));
}
const c = S.crearCabecera(rec); c.correr(5); console.log(Object.keys(c.lectura.u).join(' '));
