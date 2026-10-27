// N1 · dónde corta el plano el tabique: por fila de profundidad, cuántas paredes (AD, AI, Fosa oval) hay en el tabique.
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
const m = crearMotor(); m.correr(12); const ex = extraDeMotor(m), td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
const e = estadoGeo(td, ex), g = construirCorazon(e, { pericardio: true, detalle: true });
const vista = process.argv[2] || 'a4c', P = planoVista(vista, e);
console.log('piezas', g.partes.filter(p => /Fosa|Eustaquio|Seno/.test(p.nombre)).map(p => p.nombre + ':' + p.idx.length / 3));
for (const n of ['AD', 'AI', 'Fosa oval']) { const pz = g.partes.find(p => p.nombre === n); if (!pz) continue; const s = cortarPieza(pz, P).seg, f = new Map();
  for (let i = 0; i < s.length; i += 4) { const v = Math.round((s[i + 1] + s[i + 3]) / 2 / 3) * 3; (f.get(v) || f.set(v, []).get(v)).push(((s[i] + s[i + 2]) / 2).toFixed(0)); }
  console.log(n, [...f].sort((a, b) => a[0] - b[0]).map(([v, u]) => v + ':' + u.sort((a, b) => a - b).join('/')).join('  ')); }
// dónde corta el plano las piezas sueltas: nº de segmentos y su centro (u, v) y extensión
for (const n of (process.argv[3] || 'Seno coronario,Válvula de Eustaquio').split(',')) { const pz = g.partes.find(p => p.nombre === n); if (!pz) { console.log(n, 'no existe'); continue; }
  const s = cortarPieza(pz, P).seg; let cu = 0, cv = 0, k = 0, u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
  for (let i = 0; i < s.length; i += 4) { cu += s[i] + s[i + 2]; cv += s[i + 1] + s[i + 3]; k += 2; u0 = Math.min(u0, s[i], s[i + 2]); u1 = Math.max(u1, s[i], s[i + 2]); v0 = Math.min(v0, s[i + 1], s[i + 3]); v1 = Math.max(v1, s[i + 1], s[i + 3]); }
  console.log(n, 'segmentos', s.length / 4, k ? `centro u=${(cu / k).toFixed(0)} v=${(cv / k).toFixed(0)} u[${u0.toFixed(0)},${u1.toFixed(0)}] v[${v0.toFixed(0)},${v1.toFixed(0)}]` : ''); }
