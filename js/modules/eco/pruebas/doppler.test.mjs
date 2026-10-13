// Pruebas del Doppler (sin navegador): velocidades a partir de los flujos del motor y medidas con referencia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS } from '../escenarios.mjs';
import { construirCorazon, baseGeometrica } from '../corazon-geo.mjs';
import { construirAbdomen } from '../abdomen.mjs';
import { estadoGeo } from '../formas.mjs';
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
