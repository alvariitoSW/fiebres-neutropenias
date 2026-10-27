// Pruebas del Doppler (sin navegador): velocidades a partir de los flujos del motor y medidas con referencia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS } from '../escenarios.mjs';
import { construirCorazon, baseGeometrica } from '../corazon-geo.mjs';
import { construirAbdomen } from '../abdomen.mjs';
import { estadoGeo, mezclarFlujo } from '../formas.mjs';
import { planoVista, enPlano, direccionHaz } from '../ecografia.mjs';
import * as D from '../doppler.mjs';
import { nrm, cruz } from '../mat.mjs';

const motorEn = (k = 'normal') => { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m); if (k !== 'normal') m.correr(10); return m; };
const td = (m) => m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
// la muestra donde la pone el simulador: pasadas las valvas (AV) o justo por debajo (sigmoideas)
function enMuestra(m, vista, n, off) {
  const t = td(m), areas = D.areasAnillo(baseGeometrica(t)), g = construirCorazon(estadoGeo(t, {}), { detalle: true });
  const F = D.fuentesFlujo(g.flujo, t, areas, [], { rRetorno: m.p.rRetorno, pvc: m.ultimo.pvc }), j = F.geom.find(x => x.n === n);
  const P = planoVista(vista, t), [u, v] = enPlano(P, [j.c[0] + j.dir[0] * off, j.c[1] + j.dir[1] * off, j.c[2] + j.dir[2] * off]);
  const gpt = [0, 1, 2].map(k => P.O[k] + P.r[k] * u + P.d[k] * v), haz = direccionHaz(P, Math.atan2(u, v));
  const fu = D.fuenteEnMuestra(D.puntosMuestra(P, gpt, haz), haz, F);
  return { fu, med: D.medidasLatido(D.curvaLatido(m.onda, fu, fu.factor, areas, { rRetorno: m.p.rRetorno, pvc: m.ultimo.pvc }), fu), areas };
}

test('mitral (A4C): E/A del modelo en el rango normal de la Ficha 5 (1-1,5); la muestra reconoce la mitral', () => {
  const { fu, med } = enMuestra(motorEn(), 'a4c', 'mitral', 8);
  assert.equal(fu.n, 'mitral'); assert.equal(med.tipo, 'llenado');
  assert.ok(med.ea >= 1 && med.ea <= 1.5, `E/A ${med.ea}`);
  assert.ok(med.E > 0 && med.A > 0 && med.E > med.A);
});

test('mitral: TDE en el rango de la Ficha 5 (140-250 ms) (inercia mitral del motor)', () => {
  const { med } = enMuestra(motorEn(), 'a4c', 'mitral', 8);
  assert.ok(med.tde >= 140 && med.tde <= 250, `TDE ${med.tde}`);
});

test('TSVI (A3C): ITV en el rango de la Ficha 11 (18-22 cm) y GC por Doppler cerca del del motor', () => {
  const m = motorEn(), { fu, med, areas } = enMuestra(m, 'a3c', 'aortica', -7);
  assert.equal(fu.n, 'aortica'); assert.ok(fu.tubo, 'la muestra debe caer en el tracto de salida');
  assert.ok(med.itv >= 18 && med.itv <= 22, `ITV ${med.itv}`);
  const gc = med.itv * areas.aortica / 100 * m.ultimo.fc / 1000;
  assert.ok(Math.abs(gc - m.ultimo.gc) / m.ultimo.gc < 0.15, `GC Doppler ${gc} frente a ${m.ultimo.gc}`);
  // en la hemorragia, el ITV baja (menos volumen sistólico)
  const hem = enMuestra(motorEn('hemorragia'), 'a3c', 'aortica', -7).med;
  assert.ok(hem.itv < med.itv, `${hem.itv} frente a ${med.itv}`);
});

test('el flujo de entrada (mitral, desde el ápex) va hacia la sonda y el de salida (TSVI) se aleja', () => {
  assert.ok(enMuestra(motorEn(), 'a4c', 'mitral', 8).fu.factor > 0);
  assert.ok(enMuestra(motorEn(), 'a3c', 'aortica', -7).fu.factor < 0);
});

test('espectro: aliasing por encima de la escala y filtro de pared por debajo de 4 cm/s', () => {
  const fila = (col, v, vmax, filas) => { const y = Math.round((1 - v / vmax) / 2 * filas - 0.5); return col[3 * y]; };
  const c = D.columnaEspectro([90], 200, 60, 3);    // 90 con escala ±60 se enrolla a −30
  assert.ok(fila(c, -30, 60, 200) > 150 && fila(c, 30, 60, 200) < 120);
  const quieto = D.columnaEspectro([2, -2, 3], 200, 60, 3);
  assert.ok(Math.max(...quieto) < 60);
});

test('venas: suprahepáticas con S y D hacia el corazón y A retrógrada; porta hepatópeta y más pulsátil con PVC alta', () => {
  const m = motorEn(), t = td(m), g = construirCorazon(estadoGeo(t, {}), { detalle: true });
  const abd = construirAbdomen(g, { pvc: m.ultimo.pvc, pad: t.pad, t: 0 }), areas = D.areasAnillo(baseGeometrica(t));
  const F = D.fuentesFlujo(g.flujo, t, areas, abd.vasos, { rRetorno: m.p.rRetorno, pvc: m.ultimo.pvc });
  // muestra en el centro de una suprahepática, con el haz a lo largo del vaso (como alineado en la subcostal)
  // PVC alta: la misma onda de presión de la AD desplazada hacia arriba (y el retorno con ella)
  const medir = (nombre, sube = 0) => {
    const pvc = m.ultimo.pvc + sube, onda = m.onda.map(s => ({ ...s, pad: s.pad + sube, pven: s.pven + sube }));
    const v = F.vasos.find(x => x.nombre === nombre), i = Math.floor(v.pts.length / 2), c = v.pts[i], tan = nrm(v.pts[i + 1].map((x, k) => x - v.pts[i - 1][k]));
    const haz = tan.map(x => -x), n = nrm(cruz(haz, Math.abs(haz[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), P = { O: c, n };
    const fu = D.fuenteEnMuestra(D.puntosMuestra(P, c, haz), haz, F);
    return { fu, med: D.medidasLatido(D.curvaLatido(onda, fu, fu.factor, areas, { rRetorno: m.p.rRetorno, pvc }), fu) };
  };
  const h = medir('Vena suprahepática media');
  assert.equal(h.fu.vasoTipo, 'hepatica'); assert.equal(h.med.tipo, 'hepatica');
  assert.ok(h.med.S > 0 && h.med.D > 0 && h.med.A > 0, JSON.stringify(h.med));
  const pn = medir('Vena porta'), pa = medir('Vena porta', 9);
  assert.ok(pn.med.media > 15 && pn.med.media < 25, `porta ${pn.med.media}`);
  assert.ok(pa.med.pulsatilidad > pn.med.pulsatilidad + 0.2, `${pn.med.pulsatilidad} → ${pa.med.pulsatilidad}`);
});

test('VExUS: el sentido hacia el corazón sale de la fuente, no de la onda más alta (congestión con A retrógrada dominante)', () => {
  // una suprahepática congestiva: S y D hacia el corazón y una A retrógrada más alta que las dos
  const onda = [['B', 20], ['C', 18], ['D', 10], ['E', 6], ['F', 15], ['G', 8], ['A', -50]].map(([fase, v], i) => ({ t: i * 0.1, fase, v }));
  for (const signo of [1, -1]) {          // con la sonda viendo el flujo hacia el corazón como + o como −
    const curva = onda.map(c => ({ ...c, v: signo * c.v }));
    const m = D.medidasLatido(curva, { tipo: 'vaso', vasoTipo: 'hepatica', factor: 0.8 * signo });
    assert.deepEqual([m.S, m.D, m.A], [20, 15, 50], `signo ${signo}: ${JSON.stringify(m)}`);
  }
  // una porta con flujo invertido en parte del latido: la media sigue midiéndose hepatópeta
  const porta = D.medidasLatido([{ t: 0, fase: 'A', v: -30 }, { t: 0.1, fase: 'B', v: 10 }], { tipo: 'vaso', vasoTipo: 'porta', factor: 1 });
  assert.equal(porta.media, -10);
});

test('velVaso: una sola fórmula para el espectro (fuentesFlujo) y para las medidas del latido (curvaLatido)', () => {
  const s = { pven: 12, pad: 6 }, m = { rRetorno: 0.04, pvc: 8 };
  const g = construirCorazon({ vvi: 120, vvd: 140, vai: 40, vad: 35, mitral: 0, tricus: 0, aortica: 0, pulmonar: 0 });
  const F = D.fuentesFlujo(g.flujo, s, D.areasAnillo(g.geo), [{ tipo: 'porta', r: 6, pts: [] }, { tipo: 'vci', r: 10, pts: [] }], m);
  assert.equal(F.vasos[0].vm, D.velVaso('porta', 6, s, m));
  assert.equal(F.vasos[1].vm, D.velVaso('vci', 10, s, m));
  const c = D.curvaLatido([{ t: 0, fase: 'A', ...s }], { tipo: 'vaso', vasoTipo: 'vci', r: 10 }, 0.5, {}, m);
  assert.equal(c[0].v, 0.5 * D.velVaso('vci', 10, s, m));
});

// ---- P5b · chorro de la insuficiencia mitral (Zoghbi 2017; Q y v del motor)
const MD = (m) => ({ rRetorno: m.p.rRetorno, pvc: m.ultimo.pvc, eroaMitral: m.p.eroaMitral });
const flujoEn = (m, t) => { const g = construirCorazon(estadoGeo(t, { tenting: Math.min(1, m.p.eroaMitral / 0.35) }), { detalle: true }); return { g, F: D.fuentesFlujo(g.flujo, t, D.areasAnillo(baseGeometrica(t)), [], MD(m)) }; };
const sistole = (m) => m.onda.reduce((a, b) => (b.qMitReg > a.qMitReg ? b : a));

test('IM funcional: el normal (EROA 0) no tiene chorro regurgitante y la AI está quieta en sístole', () => {
  const m = motorEn(), t = m.onda.reduce((a, b) => (b.pvi > a.pvi ? b : a)), { g, F } = flujoEn(m, t);
  assert.equal(m.p.eroaMitral, 0);
  assert.ok(!F.valvulas.some(j => j.n === 'regMitral') && !F.geom.some(j => j.n === 'regMitral'));
  const p = g.flujo.transformar(g.flujo.enCamara.ai([0.5, 0, 0]));
  assert.ok(Math.hypot(...D.velocidad(p, F)) < 5, 'sin flujo en la AI en sístole');
});

test('IM funcional (dilatada): en sístole el flujo VI→AI en la AI es de 4-6 m/s y el caudal cuadra con vRegMitral', () => {
  const m = motorEn('dilatada'), eroa = m.p.eroaMitral, t = sistole(m), { g, F } = flujoEn(m, t);
  assert.ok(eroa > 0);
  const j = F.valvulas.find(x => x.n === 'regMitral'); assert.ok(j, 'chorro presente en sístole');
  assert.ok(!t.vMit, 'mitral cerrada');
  assert.ok(j.v0 >= 400 && j.v0 <= 600, `v0 ${j.v0} cm/s`);
  // Bernoulli: 4v² ≈ ΔP VI−AI (fisiología general)
  assert.ok(Math.abs(4 * (j.v0 / 100) ** 2 - (t.pvi - t.pai)) / (t.pvi - t.pai) < 0.05, 'v = √ΔP / 2');
  // el chorro, un poco aguas abajo de la coaptación (ya en la AI), va hacia la AI = se aleja del ápex, a v0
  const p = [0, 1, 2].map(k => j.c[k] + j.dir[k] * 1.5), v = D.velocidad(p, F);
  assert.ok(Math.hypot(...v) > 0.9 * j.v0 && Math.hypot(...v) < 1.05 * j.v0);
  const haz = nrm([p[0] - 0, p[1] - 0, p[2] - 0]);   // (la dirección exacta del haz no importa: solo el sentido hacia la AI)
  assert.ok(v[0] * j.dir[0] + v[1] * j.dir[1] + v[2] * j.dir[2] > 0 && haz.length === 3);
  // la AI queda por encima de la coaptación: el chorro apunta hacia su centro
  const ai = g.flujo.transformar(g.flujo.enCamara.ai([0.5, 0, 0])), hacia = [0, 1, 2].map(k => ai[k] - j.c[k]);
  assert.ok(hacia[0] * j.dir[0] + hacia[1] * j.dir[1] + hacia[2] * j.dir[2] > 0);
  // caudal coherente: ∫ v · EROA dt de las muestras del latido = volumen regurgitante del motor
  let vol = 0; for (let i = 1; i < m.onda.length; i++) vol += D.velRegMitral(m.onda[i], eroa) * eroa * (m.onda[i].t - m.onda[i - 1].t);
  assert.ok(m.ultimo.vReg > 20 && Math.abs(vol - m.ultimo.vReg) / m.ultimo.vReg < 0.08, `∫Q ${vol} frente a vReg ${m.ultimo.vReg}`);
});

test('IM funcional: en diástole no hay chorro regurgitante; la muestra en el chorro lee velocidad negativa (se aleja de la sonda)', () => {
  const m = motorEn('dilatada'), dia = td(m), s = sistole(m);
  assert.ok(!flujoEn(m, dia).F.valvulas.some(j => j.n === 'regMitral'));
  const { g, F } = flujoEn(m, s), j = F.valvulas.find(x => x.n === 'regMitral');
  const P = planoVista('a4c', s), gp = [0, 1, 2].map(k => j.c[k] + j.dir[k] * 4), [u, w] = enPlano(P, gp);
  const g2 = [0, 1, 2].map(k => P.O[k] + P.r[k] * u + P.d[k] * w), haz = direccionHaz(P, Math.atan2(u, w));
  const us = D.velocidadesMuestra(D.puntosMuestra(P, g2, haz), haz, F), media = us.reduce((a, b) => a + b, 0) / us.length;
  assert.ok(media < -100, `velocidad media en la muestra ${media} cm/s`);
  const fu = D.fuenteEnMuestra(D.puntosMuestra(P, g2, haz), haz, F);
  assert.equal(fu.n, 'regMitral'); assert.ok(fu.factor < 0);
  const med = D.medidasLatido(D.curvaLatido(m.onda, fu, fu.factor, D.areasAnillo(baseGeometrica(s)), MD(m)), fu);
  assert.equal(med.tipo, 'regurgitacion'); assert.ok(med.pico > 100 && med.pico <= j.v0 * 1.01, `pico ${med.pico}`);
});

test('IM funcional: la geometría mezclada de las formas precalculadas conserva el origen del chorro', () => {
  const m = motorEn('dilatada'), t = sistole(m), { g } = flujoEn(m, t), mz = mezclarFlujo(g.flujo, g.flujo, 0.5);
  assert.deepEqual(mz.coaptacionMitral.map(Math.round), g.flujo.coaptacionMitral.map(Math.round));
  assert.ok(D.fuentesFlujo(mz, t, D.areasAnillo(baseGeometrica(t)), [], MD(m)).valvulas.some(j => j.n === 'regMitral'));
});

// F3 · venas pulmonares: S (relajación de la AI + sístole), D y Ar reversa, del flujo de la AI del motor [Lang 2015 p. 24: reservorio / conducto / bomba; Nagueh 2025: S, D, Ar]
function pulmonarEn(m) {
  const t = td(m), areas = D.areasAnillo(baseGeometrica(t)), g = construirCorazon(estadoGeo(t, {}), { detalle: true });
  const F = D.fuentesFlujo(g.flujo, t, areas, [], { rRetorno: m.p.rRetorno, pvc: m.ultimo.pvc }), v = F.vasos.find(x => x.tipo === 'pulmonar');
  const i = Math.floor(v.pts.length / 2), c = v.pts[i], haz = nrm(v.pts[i + 1].map((x, k) => x - v.pts[i - 1][k])).map(x => -x);
  const n = nrm(cruz(haz, Math.abs(haz[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), fu = D.fuenteEnMuestra(D.puntosMuestra({ O: c, n }, c, haz), haz, F);
  return { fu, med: D.medidasLatido(D.curvaLatido(m.onda, fu, fu.factor, areas, { rRetorno: m.p.rRetorno, pvc: m.ultimo.pvc }), fu), F };
}
test('venas pulmonares (normal): cuatro venas; S ≥ D y A reversa pequeña (Ar < 35 cm/s, Nagueh 2025)', () => {
  const { fu, med, F } = pulmonarEn(motorEn());
  assert.equal(F.vasos.filter(v => v.tipo === 'pulmonar').length, 4);
  assert.equal(fu.vasoTipo, 'pulmonar'); assert.equal(med.tipo, 'pulmonar');
  assert.ok(med.S >= med.D && med.D > 0, JSON.stringify(med));
  assert.ok(med.Ar > 0 && med.Ar < 35 && med.Ar < med.S / 2, JSON.stringify(med));
});
test('venas pulmonares: la A es reversa (hacia las venas) en la contracción auricular y el flujo va hacia la AI el resto del latido', () => {
  const m = motorEn(), s = { qVp: -300 }, e = { qVp: 300 };
  assert.ok(D.velVaso('pulmonar', 5, s) < 0 && D.velVaso('pulmonar', 5, e) > 0);
  const A = m.onda.filter(x => x.fase === 'A'), mn = A.reduce((a, b) => (b.qVp < a.qVp ? b : a));
  assert.ok(mn.qVp < 0 && m.onda.filter(x => 'FG'.includes(x.fase)).every(x => x.qVp > 0));
});
