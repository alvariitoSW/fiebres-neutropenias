// Cifras de los tres estados nuevos del grupo 3 (Benito, Fermín, Remedios) con su mando de gravedad (b3-paso4 g3).
// Uso: node autonomo/bloques/b3/herramientas/g3-estados-cifras.mjs
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
// SatAP como la app (pagina.js): con shunt, mezcla la saturación arterial del monitor (P.sao2), no la SaO₂ fija del motor.
const r = (x, d = 1) => typeof x === 'number' ? +x.toFixed(d) : x;
function m(nombre, rec) {
  const c = S.crearCabecera(rec); c.correr(40);
  const L = c.lectura, u = L.u, P = S.perfusion(L, rec);
  console.log(nombre.padEnd(20), JSON.stringify({ PA: `${r(u.pas, 0)}/${r(u.pad_, 0)}`, PAM: r(u.pam, 0), FC: r(u.fc, 0), IC: r(L.icTotal, 2), PCP: r(u.pvp), PAP: `${r(u.paps, 0)}/${r(u.papd, 0)}`, PVC: r(u.pvc), FEVIa: r(u.fe * 100, 0), FEVItot: r(u.feTotal * 100, 0), FR: r(u.fr * 100, 0), 'Qp:Qs': r(u.qpqs, 2), SatAD: r(u.satAd * 100, 0), SatAP: r((u.qp > 0.05 && u.qsh > 0 ? (u.qs * u.satAd + u.qsh * P.sao2) / u.qp : u.satAp) * 100, 0), SpO2: P.spo2, edema: r(u.vEdema, 0), 'VTD VD/VI': r(u.edvD / u.edv, 2), lact: r(P.lactObj) }));
}
for (const g of [0, 0.3, 0.5, 0.71, 0.72, 0.8, 1]) m(`Benito g${g}`, { ...S.RECETA_BENITO, g });
for (const g of [0, 0.45, 0.9, 0.95, 1]) m(`Fermin g${g}`, { ...S.RECETA_FERMIN, g });
for (const g of [0, 0.1, 0.3, 0.5, 0.7, 0.85, 1]) m(`Remedios g${g}`, { ...S.RECETA_REMEDIOS, g });
