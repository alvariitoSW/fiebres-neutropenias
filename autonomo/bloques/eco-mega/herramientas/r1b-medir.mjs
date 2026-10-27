// R1b · medidas del contorno del saco: ángulo mínimo a 12 mm, tramo recto más largo (desviación < 0,5 mm) y relación de curvatura.
import { cortes, estadoGeo, pacienteDerrame, telediastole } from './saco-contorno.mjs';
export function tramoRecto(pts, tol = 1) { const n = pts.length; let mx = 0;
  for (let i = 0; i < n; i++) { let l = 2; for (; l < n / 2; l++) { const a = pts[i], b = pts[(i + l) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]); let dm = 0;
      for (let k = 1; k < l; k++) { const q = pts[(i + k) % n]; dm = Math.max(dm, Math.abs((b[0] - a[0]) * (a[1] - q[1]) - (a[0] - q[0]) * (b[1] - a[1])) / (L || 1)); }
      if (dm > tol) break; }
    mx = Math.max(mx, (l - 1) * 3); } return mx; }
// tramo recto por giro: seguidos de puntos cuyo giro a ±12 mm es < gMax grados (3 mm entre puntos)
export function tramoGiro(ang, gMax = 6) { const n = ang.length; let mx = 0;
  for (let i = 0; i < n; i++) { let l = 0; while (l < n && 180 - ang[(i + l) % n] < gMax) l++; mx = Math.max(mx, l * 3); } return l0(mx); }
const l0 = (x) => x;
if (process.argv[1].endsWith('r1b-medir.mjs')) {
  const p = pacienteDerrame(1), e = estadoGeo(telediastole(p), p.ex);
  for (const v of ['a4c', 'sc4c', 'plax']) { const c = cortes(1, v, e); console.log(v, 'angmin12', Math.min(...c.ang.map((_, i) => 0)) , 'ang', Math.min(...c.ang).toFixed(0), 'recto', tramoRecto(c.pts), 'mm, por giro', tramoGiro(c.ang), 'mm'); }
}
