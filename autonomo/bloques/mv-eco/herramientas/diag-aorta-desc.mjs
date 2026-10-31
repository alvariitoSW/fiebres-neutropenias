// diagnóstico: dónde queda el centro de la aorta descendente (y su distancia al plano) en el A4C y el PLAX, frente a la AI (uso: ECO_DIBUJO=2 [LATAO=-33] node diag-aorta-desc.mjs)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { planoVista, enPlano } from '../../../../js/modules/eco/ecografia.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo } from '../../../../js/modules/eco/formas.mjs';
const m = crearMotor(); m.correr(12);
const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
const c = construirCorazon(estadoGeo(td, { vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD, liquidoPeri: 0 }), { pericardio: true, detalle: true });
const cen = (pos) => { let x = 0, y = 0, z = 0, n = pos.length / 3; for (let i = 0; i < pos.length; i += 3) { x += pos[i]; y += pos[i + 1]; z += pos[i + 2]; } return [x / n, y / n, z / n]; };
const A = c.partes.find(p => p.nombre === 'Aorta descendente'), AI = c.partes.find(p => p.nombre === 'AI');
for (const v of ['a4c', 'plax']) { const P = planoVista(v, td);
  const f = (p) => enPlano(P, cen(p.pos)).map(x => x.toFixed(0)).join(', ');
  console.log(v, '(u, prof, fuera de plano) mm · aorta', f(A), '· AI', f(AI)); }
// puntos de la aorta a menos de 3 mm del plano: su (u, prof) mínimo y máximo
for (const v of ['a4c', 'plax']) { const P = planoVista(v, td); const us = [], ds = [];
  for (let i = 0; i < A.pos.length; i += 3) { const [u, d, n] = enPlano(P, [A.pos[i], A.pos[i + 1], A.pos[i + 2]]); if (Math.abs(n) < 3) { us.push(u); ds.push(d); } }
  console.log(v, 'cortes de la aorta: n', us.length, us.length ? `u ${Math.min(...us).toFixed(0)}..${Math.max(...us).toFixed(0)} prof ${Math.min(...ds).toFixed(0)}..${Math.max(...ds).toFixed(0)}` : ''); }
import { aEje } from '../../../../js/modules/eco/torax.mjs';
{ const P = planoVista('a4c', td), ai = enPlano(P, cen(AI.pos)); let u0 = 1e9, u1 = -1e9; // ancho de la AI en el plano
  for (let i = 0; i < AI.pos.length; i += 3) { const [u, d, n] = enPlano(P, [AI.pos[i], AI.pos[i + 1], AI.pos[i + 2]]); if (Math.abs(n) < 3) { u0 = Math.min(u0, u); u1 = Math.max(u1, u); } }
  console.log('A4C AI en plano u', u0.toFixed(0), '..', u1.toFixed(0));
  const ca = cen(AI.pos), r = P.r, d = P.d; for (const du of [8, 14, 20]) { const p = [0, 1, 2].map(k => ca[k] + (u1 + du - ai[0]) * r[k]); console.log('  objetivo u=', (u1 + du).toFixed(0), '-> lat, ant, alt', aEje(p).map(x => x.toFixed(0)).join(', ')); }
  console.log('  AI centro lat, ant, alt', aEje(ca).map(x => x.toFixed(0)).join(', '));
  const pa = enPlano(P, cen(A.pos)); console.log('  aorta fuera de plano n=', pa[2].toFixed(0), 'n vector (lat,ant,alt)', aEje(P.n).map(x => x.toFixed(2)).join(', '), 'r', aEje(P.r).map(x => x.toFixed(2)).join(', ')); }
{ const P = planoVista('plax', td), ca = cen(AI.pos); console.log('PLAX AI centro lat,ant,alt', aEje(ca).map(x => x.toFixed(0)).join(', '), 'n', aEje(P.n).map(x => x.toFixed(2)).join(', ')); }
