// Contrato = motor de hoy (mv-eco-1, B-045 paso 1). El contrato (contrato.mjs + contrato-puente-hoy.mjs) debe dar lo mismo
// que el código de hoy (medirForma / la medida de la maqueta m12-comun, solo como control) ±2 %, y la tabla §3 de
// autonomo/maquetas/eco-reforma/mapa-motor.md como control grueso ±5 %. Los fallos conocidos del motor se CONGELAN
// (todo), no se tapan. Cada motor se corre una vez por caso y se reutiliza.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA, aplicarEscenario } from '../escenarios.mjs';
import { CAMPOS, ORIGENES, contratoDe, validarContrato } from '../contrato.mjs';
import { puenteHoy } from '../contrato-puente-hoy.mjs';
import { BANDAS } from './bandas-paciente.mjs';
import { CASOS_FORMA, medirForma } from './medir-forma.mjs';
import { medir as medirMaqueta } from '../../../../autonomo/maquetas/eco-reforma/m12-comun.mjs';   // control, no es de la app

const T0 = Date.now();
const clave = (k, g) => k + (g === undefined ? '' : ':' + g);
// modo 'forma': el asentamiento de medirForma/J1 (40 s también en hemorragia, fallo y derrame). modo 'app': aplicarEscenario, que es
// lo que ve la app y con lo que se hizo la tabla §3 (10 s en los shocks). Para las formas (tep, hpcronica…) y el normal son iguales.
const motorDe = (k, g, modo = 'forma') => {
  const m = crearMotor(); m.correr(12);
  if (modo === 'app') return aplicarEscenario(m, k, g === 'def' ? undefined : g);
  if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
  return m;
};
const cache = new Map();
const caso = (k, g, modo = 'forma') => {
  const igual = k === 'normal' || ESCENARIOS[k].forma;   // medirForma asienta igual que la app solo aquí: se reutiliza el motor
  if (igual) modo = 'forma';
  const c = clave(k, g) + '/' + modo;
  if (!cache.has(c)) {
    const m = motorDe(k, g, modo), puente = puenteHoy(m);
    cache.set(c, { m, puente, c: contratoDe(m, puente), hoy: igual ? medirForma(k, g) : null, mq: medirMaqueta(m) });
  }
  return cache.get(c);
};
// ±pct %, o media unidad de la última cifra que imprime la tabla (la tabla redondea: PVC 4,3 se imprime 4)
const cerca = (a, b, pct, nombre, redondeo = false) => {
  const dec = (String(b).split('.')[1] || '').length, mitad = redondeo ? 0.5 * 10 ** -dec : 0;
  assert.ok(Math.abs(a - b) <= Math.max(Math.abs(b) * pct / 100, mitad) + 1e-9, `${nombre}: contrato ${a} vs ${b} (±${pct} %)`);
};

// Fallos conocidos, congelados. Clave de PENDIENTES de paciente-doppler.test.mjs cuando existe.
const CONOCIDOS = {
  'tep:def': 'J1:tep:def',            // E/e′ 1,8 (ePrima del atlas + fusión E-A): fuera de Nagueh 2025 p. 551
};

// Tabla §3 de mapa-motor.md (control grueso ±5 %): [clave, k, g, FEVD, TAPSE, PSAP, PAPd, PVC, PAM, GC, VD/VI vol, pared VD, E/e′]
const TABLA = [
  ['normal', 'normal', undefined, 53, 23, 22, 12, 4, 87, 5.0, 1.15, 4.0, 8.3],
  ['TEP 50 %', 'tep', 0.5, 33, 14.6, 33, 22, 6, 83, 4.3, 1.74, 3.8, 7.7],
  ['TEP defecto', 'tep', 'def', 13, 8.4, 43, 34, 9, 67, 2.8, 3.78, 3.5, 1.8],
  ['TEP 100 %', 'tep', 1, 9, 6.6, 40, 33, 9, 58, 2.3, 4.83, 3.5, 8.3],
  ['HP crónica defecto', 'hpcronica', 'def', 32, 14.1, 97, 30, 7, 81, 4.0, 1.76, 8.2, 7.8],
  ['HP crónica 100 %', 'hpcronica', 1, 15, 9.3, 95, 37, 15, 77, 3.1, 3.69, 8.2, 7.4],
  ['Taponamiento 100 %', 'derrame', 1, 33, 13.4, 14, 12, 9, 64, 2.8, 0.66, 6.0, 4.0],
  ['Fallo VI 100 %', 'fallo', 1, 33, 16.1, 32, 24, 5, 64, 2.9, 0.85, 4.1, 23.7],
];
// TRV: la tabla usa √((PSAP−PVC)/4) con las cifras medias; el contrato, el gradiente máximo instantáneo VD−AD (menor): ±10 %
const TRV_TABLA = { normal: 2.1, 'TEP 50 %': 2.6, 'TEP defecto': 2.9, 'TEP 100 %': 2.8, 'HP crónica defecto': 4.7, 'HP crónica 100 %': 4.5 };   // la tabla lo calculó con √((PSAP−PVC)/4)

for (const [nombre, k, g, ...t] of TABLA) {
  test(`contrato = motor de hoy · ${nombre}`, () => {
    const { c, hoy, mq, puente } = caso(k, g, 'app'), L = c.latido;
    const [fevd, tapse, psap, papd, pvc, pam, gc, vdvi, pared, ee] = t;
    // contra el código de hoy ±2 %
    cerca(L.feVd, mq.fevd, 2, 'FEVD maqueta'); cerca(L.tapse, mq.tapse, 2, 'TAPSE maqueta'); cerca(L.eE, mq.ee, 2, 'E/e′ maqueta');
    cerca(L.paps, mq.psap, 2, 'PSAP maqueta'); cerca(L.pvc, mq.pvc, 2, 'PVC maqueta'); cerca(L.pam, mq.pam, 2, 'PAM maqueta'); cerca(L.gc, mq.gc, 2, 'GC maqueta');
    cerca(L.vdvi, mq.vdvi, 2, 'VD/VI maqueta');
    if (hoy) {   // medirForma (J1) en el mismo asentamiento
      cerca(L.feVd, hoy.feVd, 2, 'FEVD'); cerca(L.tapse, hoy.tapse, 2, 'TAPSE'); cerca(L.paps, hoy.paps, 2, 'PSAP'); cerca(L.pvc, hoy.pvc, 2, 'PVC');
      cerca(L.pam, hoy.pam, 2, 'PAM'); cerca(L.gc, hoy.gc, 2, 'GC'); cerca(L.vdvi, hoy.vdTd / hoy.viTd, 2, 'VD/VI vol'); cerca(L.eE, hoy.eE, 2, 'E/e′');
    }
    cerca(L['pared.vd'], mq.paredVd, 2, 'pared VD maqueta'); cerca(L.papd, mq.papd, 2, 'PAPd');
    assert.equal(L['anillo.excursion.tri'], L.tapse);
    // contra la tabla §3 ±5 % (lo que la tabla redondea a una cifra no se exige más fino)
    cerca(L.feVd, fevd, 5, 'FEVD tabla', true); cerca(L.tapse, tapse, 5, 'TAPSE tabla', true); cerca(L.paps, psap, 5, 'PSAP tabla', true);
    cerca(L.papd, papd, 5, 'PAPd tabla', true); cerca(L.pvc, pvc, 5, 'PVC tabla', true); cerca(L.pam, pam, 5, 'PAM tabla', true); cerca(L.gc, gc, 5, 'GC tabla', true);
    cerca(L.vdvi, vdvi, 5, 'VD/VI tabla', true); cerca(L['pared.vd'], pared, 5, 'pared VD tabla', true); cerca(L.eE, ee, 5, 'E/e′ tabla', true);
    if (TRV_TABLA[nombre]) cerca(L.trv, TRV_TABLA[nombre], 10, 'TRV tabla', true);
    // septo de hoy: 0 en el normal y el taponamiento/fallo; 1 en TEP y HP (tabla)
    const septoMax = Math.max(...c.instantes.map(i => i.septo));
    const esperado = ['tep', 'hpcronica'].includes(k) && !(k === 'tep' && g === 0) ? 1 : 0;
    assert.ok(Math.abs(septoMax - esperado) <= 0.05, `septo ${septoMax} vs ${esperado}`);
    assert.ok(puente.funcion.septo);
  });
}

test('esquema: cada campo con unidad, origen y valor coherente (hueco = null, puente-hoy = con su función)', () => {
  const { c, puente } = caso('normal');
  for (const cp of Object.values(CAMPOS)) {
    assert.ok(cp.unidad && cp.que && ORIGENES.includes(cp.origen) && cp.usa.length, cp.clave);
    if (cp.ambito === 'latido') {
      assert.ok(cp.clave in c.latido, 'falta en latido: ' + cp.clave);
      if (cp.origen === 'hueco') assert.equal(c.latido[cp.clave], null, cp.clave);
      else assert.notEqual(c.latido[cp.clave], undefined, cp.clave);
    }
    assert.equal(c.origen[cp.clave], cp.origen);
  }
  for (const k of Object.keys(c.latido)) assert.ok(CAMPOS[k], 'sin esquema: ' + k);
  for (const k of ['anillo.excursion.tri', 'pared.vd', 'anillo.mit', 'anillo.vel.e', 'eE']) assert.ok(puente.funcion[k], 'puente sin función: ' + k);
  const i = c.instantes[0];
  assert.ok(c.instantes.length > 100 && 'vi' in i.vol && 'peri' in i.pres && 'vp' in i.q && 'iao' in i.q.reg && 'pul' in i.valv);
});

test('el motor no cambia al leerlo', () => {
  const prof = (x) => (x && typeof x === 'object') ? (Array.isArray(x) ? x.map(prof) : Object.fromEntries(Object.entries(x).map(([k, v]) => [k, prof(v)]))) : x;
  const m = motorDe('tep', 'def');
  const antes = [prof(m.s), prof(m.p), prof(m.onda), prof(m.ultimo)];
  contratoDe(m, puenteHoy(m)); contratoDe(m);
  assert.ok(isDeepStrictEqual(antes, [prof(m.s), prof(m.p), prof(m.onda), prof(m.ultimo)]), 'el motor cambió');
});

// validarContrato en los 21 casos de CASOS_FORMA
const SEPARADOS = {
  'fallo:1': { clave: 'salto', texto: 'el último instante no enlaza con el primero (pres.vi 30,1 → 25,6 mmHg, FC ≈121): salto al volver a empezar el latido (rúbrica, criterio 4)' },
};
for (const [k, g] of CASOS_FORMA) {
  const id = clave(k, g);
  test(`validarContrato · ${id}`, () => {
    const { c } = caso(k, g);
    const v = validarContrato(c, { bandas: BANDAS, clave: id });
    if (v.diagnostico.length) console.log(`  diagnóstico ${id}: ${v.diagnostico.join(' | ')}`);
    if (v.fueraDeRango.length) console.log(`  fueraDeRango ${id}: ${v.fueraDeRango.join(' | ')}`);
    if (SEPARADOS[id]) { assert.ok(v.errores.length > 0, 'ya pasa: quítalo de SEPARADOS'); assert.ok(v.errores.every(e => e.startsWith('salto al volver')), v.errores.join('\n')); return; }
    assert.deepEqual(v.errores, []);
    if (!CONOCIDOS[id]) assert.deepEqual(v.fueraDeRango, []);
    else assert.ok(v.fueraDeRango.length > 0 && v.fueraDeRango.some(x => x.startsWith('eE ')), 'el fallo conocido ya no sale: quita ' + id + ' de CONOCIDOS');
  });
}

// Fallos conocidos, congelados: la cifra mala se queda como está (mv-eco-2a5 la arregla); aquí el objetivo de la guía.
test('fallo conocido (lo arregla mv-eco-2a5) · tep:def E/e′ ≥ 4,0 [PENDIENTES J1:tep:def]', { todo: 'J1:tep:def' }, () => {
  const e = caso('tep', 'def').c.latido.eE;
  assert.ok(e >= 4.0, `E/e′ ${e.toFixed(2)} fuera de la banda normal 4,0-11,5 (Nagueh 2025, Tabla 5, p. 551)`);
});
test('fallo conocido (lo arregla mv-eco-2a5) · tep:def tiempo de aceleración pulmonar < 105 ms [sin clave en PENDIENTES]', { todo: 'mv-eco-2a5' }, () => {
  const ta = caso('tep', 'def').c.latido['tiempos.tap'];
  assert.ok(ta < 105, `TA pulmonar ${ta.toFixed(0)} ms; ESC/ERS 2022, Tabla 10 (PDF 28/p. 3645): <105 ms en el TEP`);
});
test('fallo conocido (lo arregla mv-eco-2a5) · fallo:1 el latido enlaza consigo mismo [sin clave en PENDIENTES]', { todo: 'mv-eco-2a5' }, () => {
  const v = validarContrato(caso('fallo', 1).c);
  assert.deepEqual(v.errores, []);
});
test.todo('fallo conocido · HP crónica: VD/VI 0,72 en la imagen (el motor da 1,76 en volumen); se mide en la imagen en mv-eco-2a5');
test.todo('hueco · regional (McConnell), septoFase, MAPSE, s′/a′, VCI, raíz aórtica, regurgitación aórtica por instante: sin dato en el motor ni fuente en docs/');

test('tiempo: la prueba entera < 60 s', () => {
  const s = (Date.now() - T0) / 1000;
  console.log(`  contrato.test: ${s.toFixed(1)} s`);
  assert.ok(s < 60, `${s.toFixed(1)} s`);
});
