// Diagnóstico de Remedios: volúmenes por compartimento y presiones medias a distintas gravedades.
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const gs = process.argv.slice(2).map(Number); if (!gs.length) gs.push(0, 0.3, 1);
for (const g of gs) {
  const c = S.crearCabecera({ ...S.RECETA_REMEDIOS, g }); c.correr(40);
  const m = c.motor ?? c.m; const s = (m ?? c).s;
  const o = {}; for (const k of ['vven','vao','vap','vvp','vai','vad','vvi','vvd','vEdema','vRelleno','pven','paoDist','pap','pvp','pai','pad','pvi','pvd']) o[k] = +(s[k] ?? NaN).toFixed(1);
  console.log('g' + g, JSON.stringify(o), Object.keys(c).join());
}
