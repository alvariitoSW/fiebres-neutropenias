// Pruebas de la geometría del corazón y del flujo de sangre (sin navegador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baseGeometrica, construirCorazon, LIMITES, puntoValva } from '../corazon-geo.mjs';
import { crearMotor } from '../motor.mjs';
import { crearFlujo, VOL_PARTICULA } from '../flujo-sangre.mjs';

const TAU = Math.PI * 2;

test('los orificios valvulares caben en la base sin tocar paredes ni entre sí, en todo el rango de volúmenes', () => {
  let lv = Infinity, sep = Infinity, rv = Infinity;
  for (const vvi of [30, 45, 60, 90, 120, 160, 220]) for (const vvd of [40, 60, 90, 140, 200, 260]) {
    const g = baseGeometrica({ vvi, vvd });
    for (const f of [g.anilloMitral, g.anilloAortico]) for (let k = 0; k < 120; k++) { const p = f(k / 120 * TAU); lv = Math.min(lv, g.vi.Rb - Math.hypot(p[0], p[1])); }
    for (let k = 0; k < 120; k++) { const p = g.anilloMitral(k / 120 * TAU); sep = Math.min(sep, Math.hypot(p[0] - g.ac[0], p[1] - g.ac[1]) - g.rA); }
    for (const f of [g.anilloTricus, g.anilloRVOT]) for (let k = 0; k < 120; k++) {
      const p = f(k / 120 * TAU), r = Math.hypot(p[0], p[1]), ph = Math.atan2(p[1], p[0]);
      rv = Math.min(rv, r - g.ReB, g.ReB + g.Wb(ph) - r);
    }
  }
  assert.ok(lv >= 1.5, `margen VI ${lv.toFixed(2)} mm`);
  assert.ok(sep >= 1.0, `continuidad mitroaórtica ${sep.toFixed(2)} mm`);
  assert.ok(rv >= 1.5, `margen VD ${rv.toFixed(2)} mm`);
});

// estados de prueba: normal, sístole, extremos fuera de los límites del dibujo, con y sin corte
const ESTADOS = [
  { vvi: 120, vvd: 140, vai: 40, vad: 35 }, { vvi: 45, vvd: 60, vai: 50, vad: 45 },
  { vvi: 5, vvd: 5, vai: 2, vad: 2 }, { vvi: 500, vvd: 500, vai: 300, vad: 300 },
];
const OPCIONES = [{ detalle: true, pericardio: true }, { detalle: true, corte: { phi: 2.6 } }, { vistaBase: true, detalle: true }];

test('ninguna pieza tiene coordenadas no finitas ni índices fuera de rango (también con volúmenes extremos)', () => {
  for (const e of ESTADOS) for (const op of OPCIONES) {
    const g = construirCorazon({ ...e, mitral: 0.5, tricus: 0.5, aortica: 0.3, pulmonar: 0.3, carga_mitral: 0.5 }, op);
    assert.ok(g.partes.length > 10);
    for (const p of g.partes) {
      const arr = p.pos || p.lineas;
      for (let i = 0; i < arr.length; i++) assert.ok(Number.isFinite(arr[i]), `${p.nombre}: coordenada no finita (${JSON.stringify(e)})`);
      if (p.idx) { const n = p.pos.length / 3; for (let i = 0; i < p.idx.length; i++) assert.ok(p.idx[i] < n, `${p.nombre}: índice fuera de rango`); }
    }
    assert.ok(g.descenso >= -18 && g.descenso <= 6, `descenso ${g.descenso}`);
  }
});

test('los volúmenes fuera de rango se dibujan en su límite', () => {
  const a = construirCorazon({ vvi: 5, vvd: 140, vai: 40, vad: 35 }), b = construirCorazon({ vvi: LIMITES.vi[0], vvd: 140, vai: 40, vad: 35 });
  assert.equal(a.vi.L, b.vi.L);
});

test('la sangre de cada cavidad sigue a su volumen y entra y sale por las válvulas', () => {
  const m = crearMotor(), fl = crearFlujo(); m.correr(5);
  let g = construirCorazon({ vvi: m.s.vvi, vvd: m.s.vvd, vai: m.s.vai, vad: m.s.vad }, { detalle: false });
  const FLUJOS = ['qMit', 'qTri', 'qAo', 'qPul', 'qVp', 'qRet'];
  let salidasAorta = 0;
  for (let k = 0; k < 300; k++) {                       // 3 s en pasos de 10 ms
    const pasado = Object.fromEntries(FLUJOS.map(f => [f, 0]));
    for (let i = 0; i < 100; i++) { m.paso(0.0001); for (const f of FLUJOS) if (m.s[f] > 0) pasado[f] += m.s[f] * 0.0001; }
    g = construirCorazon({ vvi: m.s.vvi, vvd: m.s.vvd, vai: m.s.vai, vad: m.s.vad }, { detalle: false });
    const antes = fl.particulas.filter(p => p.lugar === 'via' && p.via === 'ao').length;
    fl.actualizar(0.01, m.s, g.flujo, pasado);
    salidasAorta += Math.max(0, fl.particulas.filter(p => p.lugar === 'via' && p.via === 'ao').length - antes);
  }
  for (const c of ['vi', 'vd', 'ai', 'ad']) {
    const n = fl.particulas.filter(p => p.lugar === c).length, obj = m.s['v' + c] / VOL_PARTICULA;
    assert.ok(Math.abs(n - obj) <= 6, `${c}: ${n} partículas para ${obj.toFixed(0)} esperadas`);
  }
  assert.ok(salidasAorta > 40, `por la aorta salieron ${salidasAorta} partículas en 3 s`);
  const pts = fl.puntos(g.flujo);
  for (let i = 0; i < pts.pos.length; i++) assert.ok(Number.isFinite(pts.pos[i]), 'posición de partícula no finita');
});

test('la valva gira sobre su bisagra sin encogerse: el borde libre recorre un arco al abrir', () => {
  // valva de prueba: bisagra en (10, 0, 0), coaptación en el centro, flujo hacia −z, abre 1,2 rad
  for (const th of [1.2, 1.35]) {
    const v = { anillo: () => [10, 0, 0], psi: () => 0, cierre: () => [0, 0, 0], n: [0, 0, -1], prof: 0, pot: 1, hundir: 0, abomba: 0, carga: 0, thAbierta: th };
    let min = Infinity, max = 0, angPrev = -1;
    for (let i = 0; i <= 20; i++) {
      const p = puntoValva({ ...v, apertura: i / 20 }, 0, 1), d = Math.hypot(p[0] - 10, p[1], p[2]);
      min = Math.min(min, d); max = Math.max(max, d);
      const ang = Math.atan2(-p[2], 10 - p[0]);            // ángulo girado hacia el flujo
      assert.ok(ang >= angPrev - 1e-9, `el giro retrocede en apertura ${i / 20}`); angPrev = ang;
    }
    assert.ok(min > 9.6 && max < 10.8, `longitud del borde libre entre ${min.toFixed(2)} y ${max.toFixed(2)} mm (cerrada 10)`);
    assert.ok(Math.abs(angPrev - th) < 1e-6, 'abierta del todo no llega a su ángulo');
  }
});
