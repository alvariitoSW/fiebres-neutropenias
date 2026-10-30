// Calibración de fPleura (b3-paso4 g4): VS con CPAP 0/5/10/15 para varias fracciones pleurales.
// Referencia: Jellinek 2000 (PMID 10710387), 15 cmH2O bajan el VS un 23 ± 22 % en pacientes normovolémicos.
// Uso: node autonomo/bloques/b3/herramientas/g4-fpleura.mjs 0.37 0.5 0.6
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const PAC = { normal: { esc: 'hemorragia', g: 0, hb: 14 }, ramiro3: { ...S.RECETA_IC, g: 1 }, seco05: { esc: 'hemorragia', g: 0.5, hb: 13.8 } };
for (const f of process.argv.slice(2).map(Number)) for (const [n, rec] of Object.entries(PAC)) {
  const fila = [0, 5, 10, 15].map((cpap) => { const c = S.crearCabecera(rec); c.m.p.fPleura = f; c.ajustar({ cpap }); c.correr(40);
    const u = c.lectura.u; return `${Math.round(u.vs)}/${c.lectura.gcTotal.toFixed(2)}/${Math.round(u.pam)}/${u.pvp.toFixed(0)}`; });
  console.log(`f ${f} ${n.padEnd(8)} VS/GC/PAM/PCP:`, fila.join('  '));
}
