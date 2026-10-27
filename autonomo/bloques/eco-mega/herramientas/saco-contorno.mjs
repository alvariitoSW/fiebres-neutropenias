// R1 (eco-mega, parada 3) · contorno del saco pericárdico cortado por un plano: bucle ordenado, remuestreado,
// ángulos interiores y distancia al corazón. Lo usan la prueba de taponamiento y el script de capturas.
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { aplicarEscenario } from '../../../../js/modules/eco/escenarios.mjs';
import { planoVista, elementosDelCorte, distSeg } from '../../../../js/modules/eco/ecografia.mjs';

export function pacienteDerrame(g = 1) {
  const m = crearMotor(); m.correr(10); aplicarEscenario(m, 'derrame', g); m.correr(30);
  return { m, o: m.onda, ex: extraDeMotor(m) };
}
export const telediastole = (p) => p.o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
// bucles cerrados de una sopa de segmentos [x0,y0,x1,y1,…]; devuelve el de mayor perímetro como lista de [x,y]
export function bucleMayor(seg) {
  const k = (x, y) => Math.round(x * 500) + ',' + Math.round(y * 500), ady = new Map();
  for (let i = 0; i < seg.length; i += 4) { const a = k(seg[i], seg[i + 1]), b = k(seg[i + 2], seg[i + 3]); if (a === b) continue;
    for (const [u, v, x, y] of [[a, b, seg[i + 2], seg[i + 3]], [b, a, seg[i], seg[i + 1]]]) { if (!ady.has(u)) ady.set(u, []); ady.get(u).push({ k: v, x, y }); } }
  const usado = new Set(), bucles = [];
  const pos = new Map(); for (let i = 0; i < seg.length; i += 4) { pos.set(k(seg[i], seg[i + 1]), [seg[i], seg[i + 1]]); pos.set(k(seg[i + 2], seg[i + 3]), [seg[i + 2], seg[i + 3]]); }
  for (const ini of ady.keys()) { if (usado.has(ini)) continue;
    const b = [ini]; usado.add(ini); let cur = ini, prev = null;
    for (;;) { const sig = (ady.get(cur) || []).find(n => !usado.has(n.k)); if (!sig) break; usado.add(sig.k); b.push(sig.k); prev = cur; cur = sig.k; }
    bucles.push(b.map(c => pos.get(c))); }
  const per = (b) => b.reduce((s, p, i) => s + Math.hypot(p[0] - b[(i + 1) % b.length][0], p[1] - b[(i + 1) % b.length][1]), 0);
  return bucles.sort((a, b) => per(b) - per(a))[0] || [];
}
// remuestreo a paso fijo (mm) a lo largo del bucle cerrado
export function remuestrear(b, paso) {
  const n = b.length, L = []; let tot = 0;
  for (let i = 0; i < n; i++) { L.push(tot); tot += Math.hypot(b[(i + 1) % n][0] - b[i][0], b[(i + 1) % n][1] - b[i][1]); }
  const m = Math.max(8, Math.round(tot / paso)), out = []; let i = 0;
  for (let s = 0; s < m; s++) { const t = s * tot / m; while (i < n - 1 && L[i + 1] <= t) i++;
    const a = b[i], c = b[(i + 1) % n], l = (L[i + 1] ?? tot) - L[i], f = l > 0 ? (t - L[i]) / l : 0; out.push([a[0] + f * (c[0] - a[0]), a[1] + f * (c[1] - a[1])]); }
  return out;
}
// ángulo interior (°) en cada vértice: 180 = recto, <120 = esquina
export function angulos(p, k = 4) { const n = p.length;
  return p.map((q, i) => { const a = p[(i + n - k) % n], c = p[(i + k) % n], u = [a[0] - q[0], a[1] - q[1]], v = [c[0] - q[0], c[1] - q[1]];
    return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v) || 1)))) * 180 / Math.PI; }); }
// distancia de cada punto del saco a la pared del corazón cortada (relleno de cámaras y paredes)
export function distancias(p, els) { const seg = els.filter(e => e.tipo === 'relleno').flatMap(e => e.seg);
  return p.map(q => distSeg(q[0], q[1], seg)); }
export function cortes(g, vista, e) {
  const geo = construirCorazon(e, { pericardio: true, detalle: true }), P = planoVista(vista, e), els = elementosDelCorte(geo.partes, P);
  const pts = remuestrear(bucleMayor(els[0].seg), 3);
  return { geo, P, els, pts, ang: angulos(pts), dist: distancias(pts, els) };
}
export { estadoGeo };
