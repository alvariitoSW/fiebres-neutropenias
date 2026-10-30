// Cifras del motor para Virginia (posparo) a 0/24/72 h. Uso: node posparo-cifras.mjs
const S = await import(new URL('../../../../js/modules/libros/shock-vivo/soporte.mjs', import.meta.url));
const { PACIENTES } = await import(new URL('../../../../js/data/shock-vivo-data.js', import.meta.url)).catch(() => ({}));
const rec0 = { esc: 'posparo', hb: 12.6 };
for (const h of [0, 24, 72]) {
  const rec = { ...rec0, g: S.gDePosparo(h), ...(process.env.REC ? JSON.parse(process.env.REC) : {}) };
  const c = S.crearCabecera(rec); c.correr?.(40);
  const L = c.lectura ?? c.cab?.lectura; const u = L.u;
  console.log(h, 'h', Object.fromEntries(Object.entries({ pas: u.pas, pad: u.pad_, pam: u.pam, fc: u.fc, ic: L.icTotal, pcp: L.pcp, pvc: u.pvc, papd: u.papd, fevi: u.fe*100, lac: 0 }).map(([k, v]) => [k, typeof v === 'number' ? +v.toFixed(2) : v])), Object.keys(u).join(','));
}
