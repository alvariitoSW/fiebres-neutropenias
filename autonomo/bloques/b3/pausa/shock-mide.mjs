// Arnés: mide pacientes y aparatos de la maqueta del shock con el motor real (sin navegador).
// node mide.mjs [pacientes|aparatos|hemo|todo]
import { crearCabecera, perfusion, avanzarLab } from '/tmp/wt-b3-shock/autonomo/maquetas/b3-shock/soporte.mjs';
import * as D from '/tmp/wt-b3-shock/autonomo/maquetas/b3-shock/datos.js';

const r1 = (x) => Math.round(x * 10) / 10;
function lee(cab, rec) {
  const L = cab.lectura, u = L.u, P = perfusion(L, rec);
  const ic = L.icTotal, irvs = (u.pam - u.pvc) / Math.max(0.3, ic);
  return { fc: Math.round(u.fc), pa: `${Math.round(u.pas)}/${Math.round(u.pad_)}`, pam: Math.round(u.pam), pvc: Math.round(u.pvc), pcp: Math.round(u.pvp),
    pap: `${Math.round(u.paps)}/${Math.round(u.papd)}`, ic: r1(ic), icNat: r1(L.gcNativo / cab.m.p.sc), irvs: Math.round(irvs), vs: Math.round(u.vs), edv: Math.round(u.edv),
    imp: r1(L.imp), pide: r1(L.impPide), ecmo: r1(L.ecmo), ao: `${L.aoAbre}/${L.aoDe}`, spo2: P.spo2, scvo2: P.scvo2, gap: P.gap, lact: r1(P.lactObj), diur: r1(P.diurObj), edema: Math.round(u.vEdema || 0) };
}
const fila = (tag, o) => console.log(tag.padEnd(34), Object.entries(o).map(([k, v]) => `${k} ${v}`).join(' · '));
const modo = process.argv[2] || 'todo';

if (modo === 'pacientes' || modo === 'todo') {
  for (const p of D.PACIENTES) for (const g of [0, 0.5, 1, p.rec.g]) {
    const rec = { ...p.rec, g }; const cab = crearCabecera(rec, { asentar: 30 }); cab.correr(8);
    fila(`${p.nombre} g=${g}`, lee(cab, rec));
  }
}
if (modo === 'hemo' || modo === 'todo') {
  const p = D.PACIENTES[0];
  for (const g of [0.3, 0.5, 0.7, 0.83, 0.95, 1]) { const rec = { ...p.rec, g }; const cab = crearCabecera(rec, { asentar: 30 }); cab.correr(8); fila(`Mateo g=${g} (${Math.round(g * 42)} %)`, lee(cab, rec)); }
  const rec = { ...p.rec, g: 0.83 }; const cab = crearCabecera(rec, { asentar: 30 }); cab.correr(8);
  cab.volumen(2000); cab.correr(20); fila('Mateo 0,83 +2 L', lee(cab, rec)); cab.redistribuir(); cab.correr(10); fila('  +1 h', lee(cab, rec));
  cab.volumen(1000, 'sangre'); cab.correr(20); fila('  +1 L sangre', lee(cab, rec));
}
if (modo === 'aparatos' || modo === 'todo') {
  const p = D.PACIENTES[2];
  const mk = (extra = {}, vol = 0, aj = {}) => { const rec = { ...p.rec, ...extra }; const cab = crearCabecera(rec, { asentar: 30 }); cab.ajustar(aj); if (vol) cab.volumen(vol); cab.correr(vol ? 22 : 8); return [cab, rec]; };
  let [cab, rec] = mk(); fila('Aurelio base', lee(cab, rec));
  cab.volumen(250); cab.correr(22); fila('  +250', lee(cab, rec));
  cab.volumen(250); cab.correr(22); fila('  +500', lee(cab, rec));
  [cab, rec] = mk({}, 0, { soporte: 'balon' }); fila('Aurelio balón 40', lee(cab, rec));
  for (const f of [2.5, 3.5, 5.5]) { [cab, rec] = mk({}, 0, { soporte: 'impella', impella: f }); fila(`Aurelio Impella ${f}`, lee(cab, rec)); }
  for (const f of [2.5, 5.5]) { [cab, rec] = mk({}, 250, { soporte: 'impella', impella: f }); fila(`Aurelio +250 Impella ${f}`, lee(cab, rec)); }
  [cab, rec] = mk({}, 250, { soporte: 'impella', impella: 2.5 }); cab.ajustar({ impella: 5.5 }); cab.correr(10); fila('G2: +250, 2,5 → 5,5', lee(cab, rec));
  [cab, rec] = mk({}, 0, { soporte: 'impella', impella: 5.5 }); cab.ajustar({ impella: 2.5 }); cab.correr(10); fila('Impella 5,5 → 2,5', lee(cab, rec));
  for (const f of [1, 3, 4.5, 6]) { [cab, rec] = mk({}, 0, { soporte: 'ecmo', ecmo: f }); fila(`Aurelio ECMO ${f}`, lee(cab, rec)); }
  for (const v of ['balon', 'impella', 'drenaje']) { [cab, rec] = mk({}, 0, { soporte: 'ecmo', ecmo: 6, venteo: v, ...(v === 'impella' ? { impella: 2.5 } : {}) }); fila(`Aurelio ECMO 6 + ${v}`, lee(cab, rec)); }
  [cab, rec] = mk({ g: 1, volemia: -600 }, 0, { soporte: 'ecmo', ecmo: 3 }); fila('G3 g=1 ECMO 3', lee(cab, rec)); cab.ajustar({ ecmo: 6 }); cab.correr(10); fila('G3 → 6', lee(cab, rec));
  [cab, rec] = mk({ eroaMitral: 0.8, pao2: 56 }, 250, { na: 5, dobuta: true }); fila('Caso h18 (IM aguda)', lee(cab, rec)); cab.ajustar({ soporte: 'ecmo', ecmo: 4.5 }); cab.correr(10); fila('  ECMO 4,5', lee(cab, rec));
  // la sepsis con reloj
  const a = D.PACIENTES[1]; const reca = { ...a.rec }; const ca = crearCabecera(reca, { asentar: 30 }); ca.correr(8);
  let lab = { lact: perfusion(ca.lectura, reca).lactObj, diur: perfusion(ca.lectura, reca).diurObj }; fila('Amparo h0', { ...lee(ca, reca), lab: JSON.stringify(lab) });
  for (const h of [1, 5, 18]) { lab = avanzarLab(lab, perfusion(ca.lectura, reca), h, { pam: ca.lectura.u.pam }); console.log(`  +${h} h lact ${r1(lab.lact)} diur ${r1(lab.diur)}`); }
}
