// CPAP (b3-paso4 g4, pieza 4b): tabla CPAP 0/5/10/15 cmH2O x paciente congestionado (Ramiro etapa 3, PCP ~30) y paciente seco (PCP ~8).
// PCP = la que mide el monitor (dentro del vaso); PCPtm = PCP - CPAP*0,74 (transmural); PAMtm = PAM - CPAP*0,74 (la que "ve" el VI).
// Uso: node autonomo/bloques/b3/herramientas/g4-cpap-cifras.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +x.toFixed(d);
const PAC = { 'Ramiro etapa 3 (PCP alta)': { ...S.RECETA_IC, g: 1 }, 'Ramiro etapa 1': { ...S.RECETA_IC, g: 0.25 },
  'Seco (hemorragia leve)': { esc: 'hemorragia', g: 0.2, hb: 13.8 }, 'Seco (hemorragia moderada)': { esc: 'hemorragia', g: 0.5, hb: 13.8 } };
for (const [n, rec] of Object.entries(PAC)) {
  console.log('\n' + n);
  for (const cpap of [0, 5, 10, 15]) {
    const c = S.crearCabecera(rec); c.ajustar({ cpap }); c.correr(40);
    const L = c.lectura, u = L.u, t = cpap * 0.74;
    console.log(`  CPAP ${String(cpap).padStart(2)}`, JSON.stringify({ PCP: r(u.pvp), PCPtm: r(u.pvp - t), VS: r(u.vs, 0), GC: r(L.gcTotal, 2), IC: r(L.icTotal, 2), PAM: r(u.pam, 0), PAMtm: r(u.pam - t, 0), PVC: r(u.pvc), FC: r(u.fc, 0), edema: r(u.vEdema, 0) }));
  }
}
