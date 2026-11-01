// Vista «A4C foco VD» (ecografia.mjs, VISTAS.a4cVd): Mitchell 2019 p. 26 y Tabla 3 (p. 30); Lang 2015 p. 17.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { baseGeometrica, usarDibujo } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { VISTAS, planoVista, enPlano, desviacion } from '../ecografia.mjs';

const tdDe = (m) => { const ex = extraDeMotor(m), td = m.onda.reduce((b, x) => x.vvd > b.vvd ? x : b); return estadoGeo(td, ex); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
for (const dib of [1, 2]) test(`foco VD, dibujo ${dib}: plano bien formado, cerca del A4C, con el ápex y el VD dentro del sector`, () => {
  usarDibujo(dib);
  for (const esc of [null, 'tep', 'hpcronica']) {
    const m = crearMotor(); m.correr(12); if (esc) { ESCENARIOS[esc].aplicar(m, 1); m.correr(ASENTAR_FORMA); }
    const est = tdDe(m), g = baseGeometrica(est), P = planoVista('a4cVd', est), A = planoVista('a4c', est);
    assert.ok(VISTAS.a4cVd && P && P.clave === 'a4cVd');
    assert.ok(Math.abs(dot(P.r, P.d)) < 1e-9 && Math.abs(dot(P.n, P.d)) < 1e-9, 'plano ortonormal');
    assert.ok(desviacion(A, P).grados < 40, `${esc}: «ligeramente» girado respecto al A4C (Mitchell p. 26)`);
    const apex = enPlano(P, [0, 0, -g.vi.Le]);
    assert.ok(Math.abs(apex[2]) < 4 && apex[1] > 10, 'el eje del VI sigue en el plano (no se inclina al cinco cámaras)');
    // el sector se centra en la pared libre del VD: su punto medio en profundidad cae dentro del sector, a la izquierda del eje del VI
    const vd = enPlano(P, g.epiVd(-g.Lvd * 0.5, 2.4));
    assert.ok(Math.abs(Math.atan2(vd[0], vd[1])) < P.mitad + 0.05, `${esc}: la pared libre del VD entra en el sector`);
  }
});
test('foco VD: la sección del VD en el plano no es menor (≥90 %) que la del A4C', () => {
  usarDibujo(2);
  const m = crearMotor(); m.correr(12); const est = tdDe(m), g = baseGeometrica(est);
  const area = (P) => { let n = 0; for (let u = -90; u <= 90; u += 2) for (let v = 10; v <= 170; v += 2) {
    const p = [P.O[0] + P.r[0] * u + P.d[0] * v, P.O[1] + P.r[1] * u + P.d[1] * v, P.O[2] + P.r[2] * u + P.d[2] * v];
    if (p[2] >= 0 || p[2] < -g.Lvd) continue;
    const f = Math.atan2(p[1], p[0]), rho = Math.hypot(p[0], p[1]);
    if (g.ventana(f) > 0) { const re = g.rEpiVi(p[2], f); if (rho > re && rho < re + g.wRV(p[2], f)) n++; } } return n; };
  const aF = area(planoVista('a4cVd', est)), a4 = area(planoVista('a4c', est)); assert.ok(aF >= 0.9 * a4, `foco ${aF} frente a A4C ${a4}`);
});
// Mitchell 2019 p. 26: el foco VD no se inclina al cinco cámaras. Se cuentan las celdas del plano (rejilla de 1 mm, hasta 160 mm de profundidad) dentro de la
// raíz aórtica (radio 1,28·rA, de z -15 a 16: TSVI y raíz); han de ser 0 en cada escenario y dibujo, y el rótulo «Ao» (|dd| < 14 a z=16) no sale.
for (const dib of [1, 2]) test(`foco VD, dibujo ${dib}: el plano no corta la raíz aórtica ni el TSVI`, () => {
  usarDibujo(dib);
  for (const esc of [null, 'tep', 'hpcronica']) {
    const m = crearMotor(); m.correr(12); if (esc) { ESCENARIOS[esc].aplicar(m, 1); m.correr(ASENTAR_FORMA); }
    const est = tdDe(m), g = baseGeometrica(est), P = planoVista('a4cVd', est); let n = 0;
    for (let u = -80; u <= 80; u += 1) for (let v = 0; v <= 160; v += 1) {
      const p = [P.O[0] + P.r[0] * u + P.d[0] * v, P.O[1] + P.r[1] * u + P.d[1] * v, P.O[2] + P.r[2] * u + P.d[2] * v];
      if (p[2] >= -15 && p[2] <= 16 && Math.hypot(p[0] - g.ac[0], p[1] - g.ac[1]) < 1.28 * g.rA) n++; }
    assert.equal(n, 0, `${esc}: área de Ao en el corte`);
    assert.ok(Math.abs(enPlano(P, [g.ac[0], g.ac[1], 16])[2]) >= 14, `${esc}: sin rótulo Ao`);
  }
});
