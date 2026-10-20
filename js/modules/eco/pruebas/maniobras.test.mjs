// Pruebas de la capa de lectura de la hemodinámica de Marino (maniobras.mjs, lecturas.mjs, guyton-tablas.mjs).
// Se ejecutan con:  node --test 'js/modules/eco/pruebas/*.test.mjs'
// Regla (CLAUDE de eco): si el motor no llega a una referencia, la cifra se marca `pendiente` en referencias.mjs y se
// arregla el modelo; nunca se cambia la referencia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { evaluar } from '../referencias.mjs';
import { epp, bolo, EPP_ML, SEGUNDOS_MANIOBRA } from '../maniobras.mjs';
import { guyton, curvaFuncion, funcionEn, presionEnPunta, lecturaCateter, curvaTermo, areaNumerica, medidasTermo, LUGARES } from '../lecturas.mjs';
import { CURVAS_GUYTON } from '../guyton-tablas.mjs';

// El paciente de cada escenario, ya asentado (40 s tras aplicarlo: el barorreflejo también)
function paciente(k) {
  const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m); m.correr(k === 'normal' ? 28 : 40);
  return m;
}
const normal = paciente('normal'), u = normal.ultimo, o = normal.onda;
const tep = paciente('tep');

// ---- 1. Normal: Tabla 8.1 (#mar-tabla-8-1)
for (const r of evaluar(u, o).filter(r => r.id === 'pvc-t81' || r.id === 'pawp-t81')) {
  const nombre = `1 · normal · ${r.nombre}: ${r.v.toFixed(r.dec ?? 0)} ${r.unidad} (ref. ${r.texto}, ${r.fuente})`;
  if (r.pendiente) {
    test(nombre, { todo: 'pendiente: ' + r.pendiente }, () => assert.ok(r.ok, 'fuera de rango (ya se sabía)'));
    test(`1 · ${r.nombre}: la marca de pendiente sigue haciendo falta`, () => assert.ok(!r.ok, 'ya cumple: quita "pendiente" en referencias.mjs'));
  } else test(nombre, () => assert.ok(r.ok, `fuera de rango: ${r.v.toFixed(2)} (esperado ${r.min}-${r.max})`));
}

// ---- 2. Catéter, en la dirección de la ficha (#mar-cap-pasos, Fig. 8.2)
test('2 · presionEnPunta lee AD, VD, AP y venas pulmonares del mismo estado', () => {
  const s = normal.s;
  assert.equal(presionEnPunta(s, 'ad'), s.pad); assert.equal(presionEnPunta(s, 'vd'), s.pvd);
  assert.equal(presionEnPunta(s, 'ap'), s.pap); assert.equal(presionEnPunta(s, 'enclavado'), s.pvp);
  assert.equal(presionEnPunta(s, 'aorta'), null);
  for (const x of o.slice(0, 50)) for (const l of Object.keys(LUGARES)) assert.ok(Number.isFinite(presionEnPunta(x, l)));
});
test('2 · catéter en el normal: la diastólica del VD ≈ la PAD media (±2)', () => {
  const vd = lecturaCateter(o, u, 'vd'), ad = lecturaCateter(o, u, 'ad');
  assert.ok(Math.abs(vd.diastolica - ad.media) <= 2, `VD telediastólica ${vd.diastolica.toFixed(1)} · AD media ${ad.media.toFixed(1)}`);
});
test('2 · catéter en el normal: al pasar a la AP sube la diastólica y la sistólica no cambia (±3)', () => {
  const vd = lecturaCateter(o, u, 'vd'), ap = lecturaCateter(o, u, 'ap');
  assert.ok(ap.diastolica > vd.diastolica, `AP diastólica ${ap.diastolica.toFixed(1)} · VD ${vd.diastolica.toFixed(1)}`);
  assert.ok(Math.abs(ap.sistolica - vd.sistolica) <= 3, `AP sistólica ${ap.sistolica.toFixed(1)} · VD ${vd.sistolica.toFixed(1)}`);
});
test('2 · catéter en el normal: el enclavamiento ≈ la diastólica de la AP (±4)', () => {
  const ap = lecturaCateter(o, u, 'ap'), en = lecturaCateter(o, u, 'enclavado');
  assert.ok(Math.abs(en.media - ap.diastolica) <= 4, `enclavamiento ${en.media.toFixed(1)} · AP diastólica ${ap.diastolica.toFixed(1)}`);
});
test('2 · en el TEP el enclavamiento queda por debajo de la diastólica de la AP (#mar-enclavamiento-ondas)', () => {
  const ap = lecturaCateter(tep.onda, tep.ultimo, 'ap'), en = lecturaCateter(tep.onda, tep.ultimo, 'enclavado');
  assert.ok(en.media < ap.diastolica - 4, `enclavamiento ${en.media.toFixed(1)} · AP diastólica ${ap.diastolica.toFixed(1)}`);
});
test('2 · el enclavamiento es mucho menos pulsátil que la AP (la onda pulsátil desaparece)', () => {
  const ap = lecturaCateter(o, u, 'ap'), en = lecturaCateter(o, u, 'enclavado');
  assert.ok(en.max - en.min < 0.6 * (ap.max - ap.min), `oscila ${(en.max - en.min).toFixed(1)} frente a ${(ap.max - ap.min).toFixed(1)} mmHg`);
});

// ---- 3. EPP (#mar-epp, #mar-epp-pasos)
function conEpp(k) {
  const m = paciente(k), vs0 = m.ultimo.vs, vu0 = m.p.vuVen;
  epp(m, true); assert.equal(m.p.vuVen, vu0 - EPP_ML);
  epp(m, true); assert.equal(m.p.vuVen, vu0 - EPP_ML, 'activarla dos veces no mueve más sangre');
  m.correr(SEGUNDOS_MANIOBRA); const vsEpp = m.ultimo.vs;
  epp(m, false); assert.equal(m.p.vuVen, vu0);
  m.correr(30); const vsFin = m.ultimo.vs;
  return { vs0, vsEpp, vsFin, sube: vsEpp / vs0 - 1 };
}
const eppHem = conEpp('hemorragia');
test('3 · EPP en la hemorragia: el VS sube ≥10 %', () => assert.ok(eppHem.sube >= 0.10, `${(eppHem.sube * 100).toFixed(1)} %`));
for (const k of ['fallo', 'dilatada']) {
  test(`3 · EPP en «${ESCENARIOS[k].nombre}»: el VS sube <10 %`, () => { const r = conEpp(k); assert.ok(r.sube < 0.10, `${(r.sube * 100).toFixed(1)} %`); });
}
test('3 · al quitar la EPP, el VS vuelve a ±3 % del de antes (paso 3)', () => {
  const d = eppHem.vsFin / eppHem.vs0 - 1;
  assert.ok(Math.abs(d) <= 0.03, `${(d * 100).toFixed(1)} %`);
});

// ---- 4. Bolo de 500 mL (#mar-pms-fluidos)
for (const k of Object.keys(ESCENARIOS)) {
  test(`4 · bolo de 500 mL en «${ESCENARIOS[k].nombre}»: la Pms sube`, () => {
    const m = paciente(k), antes = m.ultimo.pmls, vol = m.ultimo.vTotal;
    assert.equal(bolo(m, 500), 500);
    m.correr(SEGUNDOS_MANIOBRA);
    assert.ok(m.ultimo.pmls > antes + 0.5, `Pms ${antes.toFixed(1)} → ${m.ultimo.pmls.toFixed(1)}`);
    assert.ok(Math.abs(m.ultimo.vTotal - vol - 500) < 0.5, 'el bolo entra entero y se conserva');
  });
}
test('4 · bolo de 500 mL en el fallo del VI: el gradiente Pms − PVC cambia ≤1 mmHg (no responde)', () => {
  const m = paciente('fallo'), g0 = m.ultimo.pmls - m.ultimo.pvc;
  bolo(m, 500); m.correr(SEGUNDOS_MANIOBRA);
  const g1 = m.ultimo.pmls - m.ultimo.pvc;
  assert.ok(Math.abs(g1 - g0) <= 1, `gradiente ${g0.toFixed(2)} → ${g1.toFixed(2)}`);
});
test('4 · un bolo no válido no cambia nada', () => {
  const m = paciente('normal'), v = m.s.vven;
  bolo(m, 0); bolo(m, -200); bolo(m, 'x');
  assert.equal(m.s.vven, v);
});

// ---- 5. Guyton
test('5 · la recta de retorno venoso corta el eje en PAD = Pms (±0,5) y pasa por el paciente', () => {
  for (const m of [normal, tep]) {
    const g = guyton(m);
    assert.ok(Math.abs(g.rvEn(g.pms)) < 1e-9 && Math.abs(g.corte - m.ultimo.pmls) <= 0.5);
    assert.ok(Math.abs(g.rvEn(g.pvc) - g.gc) < 1e-9, 'el punto del paciente está sobre la recta');
    assert.ok(g.rv > 0, `Rv ${g.rv}`);
  }
});
for (const k of Object.keys(ESCENARIOS)) {
  test(`5 · «${ESCENARIOS[k].nombre}»: el punto del paciente queda sobre su curva de función precalculada (±5 %)`, () => {
    const m = k === 'normal' ? normal : k === 'tep' ? tep : paciente(k), g = guyton(m), c = curvaFuncion(k);
    const y = funcionEn(c, g.pvc);
    assert.ok(y != null, `PVC ${g.pvc.toFixed(1)} fuera de la tabla`);
    assert.ok(Math.abs(y / g.gc - 1) <= 0.05, `GC ${g.gc.toFixed(2)} · curva ${y.toFixed(2)}`);
  });
}
test('5 · tras la EPP en la hemorragia, el paciente sigue sobre la misma curva de función (±5 %)', () => {
  const m = paciente('hemorragia'); epp(m, true); m.correr(30);
  const g = guyton(m), y = funcionEn(curvaFuncion('hemorragia'), g.pvc);
  assert.ok(Math.abs(y / g.gc - 1) <= 0.05, `GC ${g.gc.toFixed(2)} · curva ${y.toFixed(2)}`);
});
test('5 · las tablas cubren todos los escenarios, ordenadas y con la PVC creciente con el volumen', () => {
  assert.deepEqual(Object.keys(CURVAS_GUYTON).sort(), Object.keys(ESCENARIOS).sort());
  for (const [k, t] of Object.entries(CURVAS_GUYTON)) {
    for (let i = 1; i < t.pvc.length; i++) assert.ok(t.pvc[i] > t.pvc[i - 1] && t.pms[i] > t.pms[i - 1], `${k} punto ${i}`);
    assert.ok(t.gc.every(x => x > 1.5 && x < 10), `${k}: GC fuera de lo humano`);
  }
});

// ---- 6. Termodilución (#mar-termo-metodo, #mar-termo-cuantas)
test('6 · el área de la curva es inversamente proporcional al GC (±2 %)', () => {
  const ref = curvaTermo(5);
  for (const gc of [2, 3.5, 5, 8, 15]) {
    const c = curvaTermo(gc), k = (c.area * gc) / (ref.area * 5);
    assert.ok(Math.abs(k - 1) <= 0.02, `GC ${gc}: área × GC = ${k.toFixed(3)} de la de referencia`);
    assert.ok(Math.abs(c.gcMedido / gc - 1) <= 0.02, `GC ${gc}: medido ${c.gcMedido.toFixed(2)}`);
    // la curva dibujada tiene el área que se dice (la cola tras 30 s es despreciable con gasto ≥3,5)
    if (gc >= 3.5) assert.ok(Math.abs(areaNumerica(c.puntos) / c.area - 1) <= 0.02, `GC ${gc}: área dibujada`);
  }
  assert.equal(curvaTermo(0), null);
});
test('6 · con insuficiencia tricuspídea la curva es más baja y más larga y el gasto sale por debajo', () => {
  const a = curvaTermo(5), b = curvaTermo(5, 2);
  const pico = (c) => Math.max(...c.puntos.map(p => p.dT)), tPico = (c) => c.puntos.find(p => p.dT === pico(c)).t;
  assert.ok(pico(b) < pico(a) && tPico(b) > tPico(a) && b.gcMedido < 5);
});
test('6 · tres medidas seguidas del motor difieren ≤10 % (y la regla las da por fiables)', () => {
  const m = paciente('normal'), gcs = [];
  for (let i = 0; i < 3; i++) { m.correr(m.periodo + 0.01); gcs.push(curvaTermo(m.ultimo.gc).gcMedido); }
  const r = medidasTermo(gcs);
  assert.ok(r.dif <= 0.10 && r.fiables, `difieren ${(r.dif * 100).toFixed(1)} %`);
  assert.equal(medidasTermo([5, 5.6, 5.1]).fiables, false, '12 % no es fiable');
  assert.equal(medidasTermo([5, 5.1]).fiables, false, 'con dos no basta');
});

// ---- 7. Paciente posible en cada maniobra (extremos y punto medio)
const HUMANO = { pas: [60, 200], pad_: [35, 120], pvc: [-2, 25], pvp: [0, 40], pcp: [0, 40], gc: [1.5, 10], fc: [40, 180], paps: [10, 70] };
function humano(etiqueta, x) {
  for (const [k, [a, b]] of Object.entries(HUMANO)) assert.ok(x[k] >= a && x[k] <= b, `${etiqueta}: ${k} = ${x[k].toFixed(1)} (humano ${a}-${b})`);
}
for (const k of Object.keys(ESCENARIOS)) {
  test(`7 · «${ESCENARIOS[k].nombre}»: presiones, volúmenes y GC de un humano con EPP y con bolos de 250 a 1.500 mL`, () => {
    const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m);
    if (k !== 'normal') m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 10);   // como lo ve la app
    humano('basal', m.ultimo);
    epp(m, true); m.correr(SEGUNDOS_MANIOBRA); humano('EPP', m.ultimo);
    epp(m, false); m.correr(SEGUNDOS_MANIOBRA); humano('EPP quitada', m.ultimo);
    bolo(m, 250); m.correr(SEGUNDOS_MANIOBRA); humano('bolo 250', m.ultimo);
    for (let i = 0; i < 2; i++) { bolo(m, 500); m.correr(SEGUNDOS_MANIOBRA); }
    bolo(m, 250); m.correr(SEGUNDOS_MANIOBRA); humano('bolos 1.500 mL', m.ultimo);
    epp(m, true); m.correr(SEGUNDOS_MANIOBRA); humano('bolos 1.500 mL + EPP', m.ultimo);
    for (const x of m.onda) assert.ok(x.vvi > 10 && x.vvi < 300 && x.vvd > 20 && x.vvd < 320, `volúmenes ${x.vvi.toFixed(0)}/${x.vvd.toFixed(0)}`);
  });
}
