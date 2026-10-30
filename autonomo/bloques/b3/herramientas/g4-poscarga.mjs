// Sensibilidad del VS a la poscarga (b3-paso4 g4): motor solo, rSis ×1 / ×0,8 / ×0,6 y pleural sola en el VI.
// Uso: node autonomo/bloques/b3/herramientas/g4-poscarga.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +(+x).toFixed(d);
const PAC = { 'Ramiro etapa 3': { ...S.RECETA_IC, g: 1 }, 'Normal': { esc: 'hemorragia', g: 0, hb: 14 } };
for (const [n, rec] of Object.entries(PAC)) for (const f of [1, 0.8, 0.6]) {
  const m = S.prepararMotor(rec); m.p.rSis *= f; m.correr(40); const L = m.ultimo;
  console.log(n, 'rSis×' + f, JSON.stringify({ VS: r(L.vs, 0), GC: r(L.gc, 2), PAM: r(L.pam, 0), PCP: r(L.pvp ?? L.pcp), ees: r(m.s.eesVi * (1 + m.s.efEes), 2), efR: r(m.s.efR, 2) }));
}
