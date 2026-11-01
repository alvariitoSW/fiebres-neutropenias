// Zoom ×2 en a4cVd: caja (mm del plano) del ápex del VD, la pared libre, el anillo tricuspídeo y la AD, frente a la ventana del zoom.
// uso: node zoom2-caja.mjs   (lienzo 585x468, el del móvil de 390 px con dpr 1,5)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { baseGeometrica, usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { planoVista, enPlano, regionZoom } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(2);
const sum = (a, b) => a.map((x, i) => x + b[i]), esc = (a, s) => a.map(x => x * s), f = (x) => x.toFixed(0);
for (const e of [null, 'tep', 'hpcronica']) {
  const m = crearMotor(); m.correr(12); if (e) { ESCENARIOS[e].aplicar(m, 1); m.correr(ASENTAR_FORMA); }
  const td = m.onda.reduce((b, x) => x.vvd > b.vvd ? x : b), est = estadoGeo(td, extraDeMotor(m)), g = baseGeometrica(est), P = planoVista('a4cVd', est);
  const cav = { u0: 1e9, u1: -1e9, v0: 1e9, v1: -1e9 };
  for (let u = -90; u <= 90; u += 1) for (let v = 10; v <= P.prof; v += 1) {
    const p = sum(P.O, sum(esc(P.r, u), esc(P.d, v))), zp = p[2]; if (zp >= 0 || zp < -g.Lvd) continue;
    const fi = Math.atan2(p[1], p[0]), rho = Math.hypot(p[0], p[1]);
    if (g.ventana(fi) > 0) { const re = g.rEpiVi(zp, fi); if (rho > re && rho < re + g.wRV(zp, fi)) { cav.u0 = Math.min(cav.u0, u); cav.u1 = Math.max(cav.u1, u); cav.v0 = Math.min(cav.v0, v); cav.v1 = Math.max(cav.v1, v); } } }
  const partes = construirCorazon(est, { pericardio: false, detalle: false }).partes, caja = (nom) => { const q = partes.find(p => p.nombre === nom), A = { u0: 1e9, u1: -1e9, v0: 1e9, v1: -1e9 };
    for (let i = 0; i < q.pos.length; i += 3) { const [u, v, n] = enPlano(P, [q.pos[i], q.pos[i + 1], q.pos[i + 2]]); if (Math.abs(n) < 3 && v > 5 && v < P.prof) { A.u0 = Math.min(A.u0, u); A.u1 = Math.max(A.u1, u); A.v0 = Math.min(A.v0, v); A.v1 = Math.max(A.v1, v); } } return A; };
  const AD = caja('AD'), TR = caja('Tricúspide');
  const ancho = 585, alto = 468, k = Math.min((alto - 8) / P.prof, (ancho - 6) / (2 * P.prof * Math.sin(P.mitad)));
  const R = regionZoom(P, est), wu = ancho / 2 / k, wv = alto / 2 / k, m4 = 4, hi = R.v0 - m4, lo = R.vAnillo + m4 - wv, alt = R.v1 - R.v0;
  const vt = alt + 2 * m4 <= wv ? R.v0 - m4 - (wv - alt - 2 * m4) / 2 : lo <= hi ? Math.min(hi, Math.max(lo, (R.v0 + R.v1) / 2 - wv / 2)) : hi, ut = R.u - wu / 2;
  const dentro = (a, b) => f(100 * Math.max(0, Math.min(b, vt + wv) - Math.max(a, vt)) / (b - a));
  console.log(e || 'normal', '| ventana v', f(vt), f(vt + wv), 'u', f(ut), f(ut + wu), '| ápex VD v', f(cav.v0), cav.v0 >= vt, '| pared libre u', f(cav.u0), f(cav.u1), cav.u0 >= ut && cav.u1 <= ut + wu,
    '| anillo v', f(TR.v0), f(TR.v1), TR.v1 <= vt + wv, '| AD v', f(AD.v0), f(AD.v1), dentro(AD.v0, AD.v1) + '% dentro', '| caja alto', f(R.v1 - R.v0));
}
