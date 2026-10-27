// Pruebas de la geometría del corazón y del flujo de sangre (sin navegador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baseGeometrica, construirCorazon, LIMITES, puntoValva } from '../corazon-geo.mjs';
import { crearMotor } from '../motor.mjs';
import { crearFlujo, VOL_PARTICULA } from '../flujo-sangre.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { planoVista, cortarPieza } from '../ecografia.mjs';
import { aplicarEscenario } from '../escenarios.mjs';
import { TORAX, aEje } from '../torax.mjs';

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

// ¿p queda dentro de la malla cerrada? Paridad de los cortes de un rayo en una dirección cualquiera; los
// triángulos se reparten en una rejilla sobre el plano perpendicular al rayo, para no probarlos todos.
const dentroDeMalla = (pz) => {
  const D = [0.5773, 0.5774, 0.5773], E1 = [0.7071, -0.7071, 0], E2 = [D[1] * E1[2] - D[2] * E1[1], D[2] * E1[0] - D[0] * E1[2], D[0] * E1[1] - D[1] * E1[0]];
  const pr = (p) => [p[0] * E1[0] + p[1] * E1[1] + p[2] * E1[2], p[0] * E2[0] + p[1] * E2[1] + p[2] * E2[2]], C = 4, rej = new Map();
  const tri = []; for (let k = 0; k < pz.idx.length; k += 3) tri.push([0, 1, 2].map(j => [0, 1, 2].map(c => pz.pos[3 * pz.idx[k + j] + c])));
  tri.forEach((t, n) => { const q = t.map(pr), [x0, x1] = [Math.min(...q.map(a => a[0])), Math.max(...q.map(a => a[0]))], [y0, y1] = [Math.min(...q.map(a => a[1])), Math.max(...q.map(a => a[1]))];
    for (let i = Math.floor(x0 / C); i <= Math.floor(x1 / C); i++) for (let j = Math.floor(y0 / C); j <= Math.floor(y1 / C); j++) { const k = i + ',' + j; if (!rej.has(k)) rej.set(k, []); rej.get(k).push(n); } });
  return (p) => { let n = 0; const q = pr(p);
    for (const i of rej.get(Math.floor(q[0] / C) + ',' + Math.floor(q[1] / C)) || []) {
      const [a, b, c] = tri[i], e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const h = [D[1] * e2[2] - D[2] * e2[1], D[2] * e2[0] - D[0] * e2[2], D[0] * e2[1] - D[1] * e2[0]], det = e1[0] * h[0] + e1[1] * h[1] + e1[2] * h[2];
      if (Math.abs(det) < 1e-12) continue;
      const s = [p[0] - a[0], p[1] - a[1], p[2] - a[2]], u = (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]) / det; if (u < 0 || u > 1) continue;
      const w = [s[1] * e1[2] - s[2] * e1[1], s[2] * e1[0] - s[0] * e1[2], s[0] * e1[1] - s[1] * e1[0]], v = (D[0] * w[0] + D[1] * w[1] + D[2] * w[2]) / det;
      if (v < 0 || u + v > 1) continue;
      if ((e2[0] * w[0] + e2[1] * w[1] + e2[2] * w[2]) / det > 1e-9) n++;
    }
    return n % 2 === 1; };
};

test('el corazón queda dentro del saco pericárdico (y el derrame, entre los dos), en todo el latido y con volúmenes extremos', () => {
  // dentro del saco: ventrículos, aurículas, orejuelas, infundíbulo, raíz aórtica, surcos con su grasa y coronarias;
  // los grandes vasos salen por arriba (ahí se refleja el pericardio)
  const dentro = /^(VI |VD |Infundíbulo|AI$|AD$|Orejuela|Base V|Raíz aórtica|Papilar|Banda|Grasa|Coronaria|Seno coronario)/;
  const m = crearMotor(); m.correr(12);
  const est = [...m.onda.filter((_, i) => i % 120 === 0), ...ESTADOS.map(e => ({ ...m.onda[0], ...e }))];
  for (const liquidoPeri of [0, 10, 150]) for (const s of est) {
    const g = construirCorazon({ ...s, vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD, liquidoPeri }, { pericardio: true, detalle: true });
    const saco = g.partes.find(p => p.nombre === 'Pericardio'), derrame = g.partes.find(p => p.nombre === 'Derrame');
    const enSaco = dentroDeMalla(saco), enDerrame = derrame && dentroDeMalla(derrame);
    for (const p of g.partes) {
      if (!p.pos || !dentro.test(p.nombre)) continue;
      for (let i = 0; i < p.pos.length; i += 3) {
        const q = [p.pos[i], p.pos[i + 1], p.pos[i + 2]], donde = `${p.nombre} (${q.map(x => x.toFixed(0))}) vvi ${s.vvi.toFixed(0)} derrame ${liquidoPeri}`;
        assert.ok(enSaco(q), `fuera del saco: ${donde}`);
        if (enDerrame) assert.ok(enDerrame(q), `fuera del derrame: ${donde}`);
      }
    }
    if (derrame) for (let i = 0; i < derrame.pos.length; i += 3 * 7) { const q = [derrame.pos[i], derrame.pos[i + 1], derrame.pos[i + 2]]; assert.ok(enSaco(q), `el derrame se sale del saco (${q.map(x => x.toFixed(1))}) vvi ${s.vvi.toFixed(0)}`); }
  }
});

// TAPSE: el anillo tricuspídeo lateral baja más que el plano AV común (MAPSE) y su excursión sale de lo que se vacía
// el VD. Referencia de la app: TAPSE normal >16 mm (Fisiopatología UCI · Cardiología, Ficha 5) y >17 mm (Ficha 11).
// El valor exacto del modelo es ilustrativo (calibrado ~21 mm); se exige que el normal pase las dos referencias,
// que supere al MAPSE y que caiga cuando el VD expulsa menos.
test('TAPSE: normal por encima de 17 mm y mayor que el MAPSE; sigue siendo normal en hemorragia y derrame y cae en el TEP (F5)', async () => {
  const { estadoGeo, extraDeMotor } = await import('../formas.mjs');
  const { ESCENARIOS } = await import('../escenarios.mjs');
  const medir = (k) => {
    const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m); m.correr(14);
    const ex = extraDeMotor(m); let zMin = Infinity, zMax = -Infinity, dMin = Infinity, dMax = -Infinity;
    for (const [i, s] of m.onda.entries()) { if (i % 5) continue;
      const g = construirCorazon(estadoGeo(s, ex), { pericardio: false, detalle: false, calidad: 0.5 });
      zMin = Math.min(zMin, g.anilloTricLateral[2]); zMax = Math.max(zMax, g.anilloTricLateral[2]);
      dMin = Math.min(dMin, g.descenso); dMax = Math.max(dMax, g.descenso); }
    return { tapse: zMax - zMin, mapse: dMax - dMin, vsD: m.ultimo.vsD };
  };
  const n = medir('normal');
  assert.ok(n.tapse > 17 && n.tapse < 26, `TAPSE normal ${n.tapse.toFixed(1)} mm`);
  assert.ok(n.tapse > n.mapse + 4, `TAPSE ${n.tapse.toFixed(1)} frente a MAPSE ${n.mapse.toFixed(1)}`);
  // F5: el TAPSE es el acortamiento de la pared libre (no los mL vaciados). Con la FE del VD conservada, la hemorragia y el
  // derrame mantienen un TAPSE normal (la fuente, Lang p. 19 y 23, no dice que caiga con la precarga); el TEP lo hunde.
  for (const k of ['hemorragia', 'derrame']) { const r = medir(k);
    assert.ok(r.vsD < n.vsD && r.tapse >= 17, `${k}: TAPSE ${r.tapse.toFixed(1)} mm con VS del VD ${r.vsD.toFixed(0)} mL`); }
  const { ASENTAR_FORMA } = await import('../escenarios.mjs');
  const tep = (() => { const m = crearMotor(); m.correr(12); ESCENARIOS.tep.aplicar(m); m.correr(ASENTAR_FORMA); const ex = extraDeMotor(m); let a = Infinity, b = -Infinity;
    for (const [i, s] of m.onda.entries()) { if (i % 5) continue; const z = construirCorazon(estadoGeo(s, ex), { pericardio: false, detalle: false, calidad: 0.5 }).anilloTricLateral[2]; a = Math.min(a, z); b = Math.max(b, z); }
    return b - a; })();
  assert.ok(tep < 17, `TEP: TAPSE ${tep.toFixed(1)} mm`);
});

test('las aurículas no saltan entre dos fotogramas seguidos (rayos casi tangentes a la aorta y al tabique)', () => {
  const m = crearMotor(); m.correr(8);
  const T = m.periodo || 0.85; let prev = null, peor = 0;
  for (let i = 0; i < 300; i++) {
    m.correr(T / 300); const s = m.s;
    const g = construirCorazon({ vvi: s.vvi, vvd: s.vvd, vai: s.vai, vad: s.vad }, { detalle: false });
    const cur = Object.fromEntries(g.partes.filter(p => p.nombre === 'AI' || p.nombre === 'AD').map(p => [p.nombre, p.pos]));
    if (prev) for (const n of ['AI', 'AD']) { const a = cur[n], b = prev[n];
      for (let k = 0; k < a.length; k += 3) peor = Math.max(peor, Math.hypot(a[k] - b[k], a[k + 1] - b[k + 1], a[k + 2] - b[k + 2])); }
    prev = cur;
  }
  assert.ok(peor < 2, `salto máximo ${peor.toFixed(2)} mm`);
});

// ---- N3: aorta descendente, columna y pleura-pulmón (torax.mjs) ----
const corazonDe = (k, liquido) => { const m = crearMotor(); m.correr(12); aplicarEscenario(m, k);
  const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ex = extraDeMotor(m); if (liquido != null) ex.liquidoPeri = liquido;
  return { g: construirCorazon(estadoGeo(td, ex), { pericardio: true, detalle: true }), td }; };
const rango = (seg) => { const r = [Infinity, -Infinity, Infinity, -Infinity]; for (let i = 0; i < seg.length; i += 2) { r[0] = Math.min(r[0], seg[i]); r[1] = Math.max(r[1], seg[i]); r[2] = Math.min(r[2], seg[i + 1]); r[3] = Math.max(r[3], seg[i + 1]); } return r; };
const pieza = (g, n) => g.partes.find(p => p.nombre === n);

test('N3: en la PLAX la aorta descendente es un círculo detrás de la AI, de unos 20 mm (ilustrativo)', () => {
  const { g, td } = corazonDe('normal'), P = planoVista('plax', td);
  const ao = rango(cortarPieza(pieza(g, 'Aorta descendente'), P).seg), ai = rango(cortarPieza(pieza(g, 'AI'), P).seg);
  assert.ok(ao[2] > ai[3], `la aorta (d ${ao[2].toFixed(0)}) empieza detrás de la AI (d hasta ${ai[3].toFixed(0)})`);
  assert.ok(ao[0] < ai[1] && ao[1] > ai[0], 'a la altura de la AI (su rango en el plano se solapa)');
  assert.ok(ao[3] <= P.prof + 3, 'cabe en la profundidad de la vista');
  const diametro = Math.min(ao[1] - ao[0], ao[3] - ao[2]); assert.ok(diametro > 10 && diametro < 24, `diámetro del corte ${diametro.toFixed(1)} mm`);
});

test('N3: la aorta descendente no cruza ninguna pieza del corazón ni el saco, ni con el derrame grande', () => {
  const casos = [['normal'], ['hemorragia'], ['fallo'], ['derrame'], ['derrame', 500], ['tep'], ['dilatada'], ['hipertrofia'], ['vasoplejia']];
  for (const [k, liq] of casos) {
    const { g } = corazonDe(k, liq), ao = pieza(g, 'Aorta descendente'), R = TORAX.rAo, nSeg = 16;
    const anillos = ao.pos.length / 3 / (nSeg + 1); let peor = Infinity;
    for (let a = 3; a < anillos; a++) { const c = [0, 0, 0]; for (let j = 0; j <= nSeg; j++) for (let t = 0; t < 3; t++) c[t] += ao.pos[(a * (nSeg + 1) + j) * 3 + t] / (nSeg + 1);
      for (const p of g.partes) { if (!p.pos || /^(Aorta|Derrame|Vértebra|Pulmón)/.test(p.nombre) || /sangre$/.test(p.nombre)) continue;
        for (let i = 0; i < p.pos.length; i += 3) peor = Math.min(peor, Math.hypot(p.pos[i] - c[0], p.pos[i + 1] - c[1], p.pos[i + 2] - c[2])); } }
    assert.ok(peor >= R - 1.5, `${k}${liq ? ' ' + liq : ''}: el eje de la aorta queda a ${peor.toFixed(1)} mm de otra pieza (radio ${R})`);
  }
});

test('N3: la columna va detrás de la aorta y la corta la supraesternal; el pulmón solo detrás y a los lados', () => {
  const { g, td } = corazonDe('normal'), vert = g.partes.filter(p => /^Vértebra/.test(p.nombre));
  assert.equal(vert.length, TORAX.vertebra.n);
  const ant = (p) => { let s = 0; for (let i = 0; i < p.pos.length; i += 3) s += aEje([p.pos[i], p.pos[i + 1], p.pos[i + 2]])[1]; return s / (p.pos.length / 3); };
  const aoAnt = ant(pieza(g, 'Aorta descendente')); // media del tubo: la parte vertical domina
  for (const v of vert) assert.ok(ant(v) < aoAnt, 'la vértebra queda detrás de la aorta');
  const P = planoVista('sse', td);
  assert.ok(vert.filter(v => cortarPieza(v, P).seg.length).length >= 3, 'la supraesternal corta varias vértebras');
  // pulmón: ningún punto delante del centro del corazón (ahí están las ventanas)
  for (const n of ['Pulmón izquierdo', 'Pulmón derecho']) { const p = pieza(g, n); let maxAnt = -Infinity;
    for (let i = 0; i < p.pos.length; i += 3) maxAnt = Math.max(maxAnt, aEje([p.pos[i], p.pos[i + 1], p.pos[i + 2]])[1]);
    assert.ok(maxAnt < 10, `${n}: no pasa a la parte de delante (ant máx ${maxAnt.toFixed(0)})`); }
  // en el apical, lo que el pulmón corta dentro del sector queda en los bordes o en el fondo (último 10 %), nunca delante del corazón
  const A = planoVista('a4c', td);
  for (const n of ['Pulmón izquierdo', 'Pulmón derecho']) { const s = cortarPieza(pieza(g, n), A).seg;
    for (let i = 0; i < s.length; i += 2) if (s[i + 1] > 0 && s[i + 1] < 0.9 * A.prof) assert.ok(Math.abs(Math.atan2(s[i], s[i + 1])) > 0.45, `${n}: en el A4C solo en los bordes del sector o en el fondo`); }
});

test('B5: la cortina aorto-mitral une la raíz aórtica con la valva anterior de la mitral en todo el latido y todos los escenarios, sin cruzar la cavidad', () => {
  const casos = ['normal', 'hemorragia', 'fallo', 'derrame', 'vasoplejia', 'hipertrofia', 'dilatada', 'tep'];
  const cerca = (A, B) => { let peor = 0; for (let i = 0; i < A.length; i += 3) { let d = Infinity;
    for (let k = 0; k < B.length; k += 3) d = Math.min(d, Math.hypot(A[i] - B[k], A[i + 1] - B[k + 1], A[i + 2] - B[k + 2])); peor = Math.max(peor, d); } return peor; };
  for (const k of casos) {
    const m = crearMotor(); m.correr(12); aplicarEscenario(m, k); m.correr(10);
    const ex = extraDeMotor(m);
    for (const s of m.onda.filter((_, i) => i % 100 === 0)) {
      const g = construirCorazon(estadoGeo(s, { ...ex, vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD }), { pericardio: true, detalle: true });
      const c = pieza(g, 'Cortina aorto-mitral'), raiz = pieza(g, 'Raíz aórtica'), ant = pieza(g, 'Mitral anterior');
      assert.ok(c && raiz && ant, `${k}: faltan piezas`);
      const lado = (j) => { const o = []; for (let i = 0; i <= 8; i++) o.push(...c.pos.slice((i * 7 + j) * 3, (i * 7 + j) * 3 + 3)); return o; };
      const dRaiz = cerca(lado(0), raiz.pos), dMitral = cerca(lado(6), ant.pos);
      assert.ok(dRaiz < 2.5, `${k}: el borde de la cortina está a ${dRaiz.toFixed(2)} mm de la raíz aórtica`);
      assert.ok(dMitral < 4.5, `${k}: el otro borde está a ${dMitral.toFixed(2)} mm de la valva anterior (rejilla de 4 mm)`);
      // sin cruzar la cavidad: ningún vértice por debajo del anillo mitral (el plano de la base, ya movido con el latido)
      let zMin = Infinity, zAnillo = Infinity; for (let i = 2; i < c.pos.length; i += 3) zMin = Math.min(zMin, c.pos[i]);
      for (let i = 0; i <= 12; i++) zAnillo = Math.min(zAnillo, ant.pos[(i * 8) * 3 + 2]);
      assert.ok(zMin >= zAnillo - 0.5, `${k}: la cortina baja a z ${zMin.toFixed(2)}, bajo el anillo (${zAnillo.toFixed(2)})`);
      // ancho: entre la raíz y el anillo (separación 1-10 mm + el desnivel de 3 mm), nunca un puente largo
      let anchoMax = 0; for (let i = 0; i <= 8; i++) { const a = (i * 7) * 3, b = (i * 7 + 6) * 3; anchoMax = Math.max(anchoMax, Math.hypot(c.pos[a] - c.pos[b], c.pos[a + 1] - c.pos[b + 1], c.pos[a + 2] - c.pos[b + 2])); }
      assert.ok(anchoMax < 14, `${k}: ancho de la cortina ${anchoMax.toFixed(1)} mm`);
    }
  }
});
