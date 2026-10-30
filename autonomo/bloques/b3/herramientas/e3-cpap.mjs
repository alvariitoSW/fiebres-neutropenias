// E3: VS y GC con pTorax (CPAP) 0/5/10/15 en normal, Ramiro con PCP>=12 (etapas 1-3) y paciente seco (PCP<12).
// Uso: node autonomo/bloques/b3/herramientas/e3-cpap.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +x.toFixed(d);
export const PAC = { 'Normal': { esc: 'normal', hb: 14 }, 'Ramiro g=0.25': { ...S.RECETA_IC, g: 0.25 }, 'Ramiro g=0.5': { ...S.RECETA_IC, g: 0.5 }, 'Ramiro g=1': { ...S.RECETA_IC, g: 1 },
  'Seco (hemorragia g=0.2)': { esc: 'hemorragia', g: 0.2, hb: 13.8 } };
if (process.argv[1].endsWith('e3-cpap.mjs')) for (const [n, rec] of Object.entries(PAC)) {
  console.log('\n' + n); let vs0;
  for (const cpap of [0, 5, 10, 15]) {
    const c = S.crearCabecera(rec); c.ajustar({ cpap }); c.correr(40);
    const L = c.lectura, u = L.u; if (cpap === 0) vs0 = u.vs;
    console.log(`  CPAP ${String(cpap).padStart(2)}`, JSON.stringify({ PCP: r(u.pvp), VS: r(u.vs, 1), dVS: r(100 * (u.vs / vs0 - 1), 1) + '%', GC: r(L.gcTotal, 2), IC: r(L.icTotal, 2), PAM: r(u.pam, 0), PVC: r(u.pvc), FC: r(u.fc, 0) }));
  }
}
