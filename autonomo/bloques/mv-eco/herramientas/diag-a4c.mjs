// diagnóstico: giro y apertura que da planoVista('a4c') con el dibujo nuevo, en normal y en HP (uso: node diag-a4c.mjs)
process.env.ECO_DIBUJO = '2';
import { planoVista, VISTAS } from '../../../../js/modules/eco/ecografia.mjs';
for (const [n, est] of [['normal', {}], ['vvi-grande', { vvi: 160, vvd: 260 }]]) { try { const P = planoVista('a4c', est);
  console.log(n, 'd', P.d.map(x => x.toFixed(2)), 'mitad°', (P.mitad * 180 / Math.PI).toFixed(1)); } catch (e) { console.log(n, e.message); } }
import { baseGeometrica } from '../../../../js/modules/eco/corazon-geo.mjs';
import { enPlano } from '../../../../js/modules/eco/ecografia.mjs';
{ const est = { vvi: 160, vvd: 260 }, g = baseGeometrica(est), P = planoVista('a4c', est); let mn = 9, mx = -9, lat = 0;
  for (let i = 0; i <= 14; i++) { const z = -g.vi.Le * 0.98 * (1 - i / 14); for (let j = 0; j < 90; j++) { const f = -Math.PI + 2 * Math.PI * j / 90;
    if (z > -g.Lvd) { const [u, v, dn] = enPlano(P, g.epiVd(z, f)); if (Math.abs(dn) < 5 && v > 35) { const a = Math.atan2(u, v); mn = Math.min(mn, a); mx = Math.max(mx, a); lat = Math.min(lat, u); } } } }
  console.log('VD ángulos°', (mn * 57.3).toFixed(0), (mx * 57.3).toFixed(0), 'u mín mm', lat.toFixed(0)); }
