// Radio del endocardio del VI en el PSAX (papilares) según el ángulo, para ver si el tabique sale recto.
//   node diag-d-psax.mjs [escenario] [g]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
const k = process.argv[2] || 'hpcronica', g = +(process.argv[3] ?? 1);
const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? 200 : 40);
const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
const e = estadoGeo(td, extraDeMotor(m)); console.log('septo', e.septo, 'mioVi', e.mioVi, 'vvi', td.vvi);
const C = contornosVista('psaxPm', e, 'nuevo');
for (const nom of ['viEndo', 'viEpi']) { const ps = C[nom].cad.flatMap(c => c.ps), cx = ps.reduce((a, p) => a + p[0], 0) / ps.length, cy = ps.reduce((a, p) => a + p[1], 0) / ps.length;
  const o = []; for (let d = -180; d < 180; d += 30) { let best = null; for (const p of ps) { const a = Math.atan2(p[1] - cy, p[0] - cx) * 180 / Math.PI; const dd = Math.abs(((a - d + 540) % 360) - 180); if (!best || dd < best[0]) best = [dd, Math.hypot(p[0] - cx, p[1] - cy)]; } o.push(d + ':' + best[1].toFixed(1)); }
  console.log(nom, 'n', ps.length, o.join(' ')); }
if (process.env.SVG) { const { writeFileSync } = await import('node:fs'); const col = { viEndo: 'red', viEpi: 'orange', vdEndo: 'blue' }; let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -80 160 160" width="480" height="480"><rect x="-80" y="-80" width="160" height="160" fill="white"/>';
  for (const [n, c] of Object.entries(col)) for (const ch of C[n]?.cad ?? []) s += `<polyline fill="none" stroke="${c}" points="${ch.ps.map(p => p.join(',')).join(' ')}"/>`; writeFileSync(process.env.SVG, s + '</svg>'); }
