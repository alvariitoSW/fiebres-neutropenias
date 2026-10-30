// Pruebas de la GRAVEDAD de los escenarios de shock (escenarios.mjs): hemorragia, fallo del VI, derrame y TEP.
// Se ejecutan con:  node --test 'js/modules/eco/pruebas/*.test.mjs'
// Cada mando va de 0 (sin lesión) a 1 (shock a fondo) sin saltos y, en todo su recorrido, el motor muestra un paciente
// posible (CLAUDE.md §12 y autonomo/REGLAS.md §1.7; rangos de la cobertura del bloque 3, §4.1). A fondo, shock: PAM 45-60,
// sin ceros, NaN ni RVS negativa. El estado de una gravedad se lee asentado: 40 s después de aplicarla, como las maniobras.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor, BASE, escalarRPul } from '../motor.mjs';
import { ESCENARIOS, aplicarEscenario } from '../escenarios.mjs';
import { faltaParaAsentar } from '../maniobras.mjs';

const CON_GRAVEDAD = ['hemorragia', 'fallo', 'derrame', 'tep'];
const PASOS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1];
const SEGUNDOS_LARGO = 120;
// Paciente posible: PAM, FC, IC, PVC, PCP, VS y SvO₂ (%)
const POSIBLE = { pam: [40, 130], fc: [40, 170], ic: [1.2, 5], pvc: [0, 25], pcp: [2, 35], vs: [15, 110], svo2: [30, 85] };
// Excepción, a la vista: la PCP de una hemorragia o un TEP graves baja de 2 mmHg. En los dos el VI se llena poco (Tabla
// 14.1: PCP ↓ en el hipovolémico; en el TEP el VD dilatado no le pasa sangre) y, con un VS de ~20 mL, la curva diastólica
// del VI (la misma que da la PCP normal, ~7,6) lo llena a 1-2 mmHg. Subirla exigiría cambiar esa curva y todo lo calibrado
// con ella (onda E, TDE, PCP normal). Se exige ≥1
const PCP_MIN = { hemorragia: 1, tep: 1 };
const sv = (u) => ({ ...u, svo2: u.svo2 * 100 });

// El escenario con su gravedad, como lo pondría la app: motor normal 12 s, se aplica y se asienta (el mismo estado que
// aplicarEscenario + faltaParaAsentar, pero mirando desde el primer segundo). Mientras se asienta, cada segundo, se apunta
// la PAM mínima y se comprueba que todo es finito y ninguna cámara queda con volumen negativo
function paciente(k, g, extra = 0) {
  const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); m.p.tEscenario = m.s.t;
  const fin = m.s.t + faltaParaAsentar(m) + extra;
  let pamMin = Infinity, roto = null;
  while (m.s.t < fin - 1e-9) {
    m.correr(Math.min(1, fin - m.s.t));
    const u = m.ultimo;
    if (!['pam', 'fc', 'gc', 'pvc', 'pcp', 'rvs', 'vs', 'svo2'].every(v => Number.isFinite(u[v]))) roto ??= `NaN a los ${m.s.t.toFixed(0)} s`;
    if (!(u.rvs > 0)) roto ??= `RVS ${u.rvs} a los ${m.s.t.toFixed(0)} s`;
    for (const x of m.onda) for (const v of ['vad', 'vvd', 'vai', 'vvi']) if (!(x[v] > 0)) roto ??= `${v} ${x[v]} mL a los ${m.s.t.toFixed(0)} s`;
    pamMin = Math.min(pamMin, u.pam);
  }
  return { u: sv(m.ultimo), pamMin, roto, m };
}
const r = (x, d = 1) => x.toFixed(d).replace('.', ',');
const resumen = (u) => `PAM ${r(u.pam, 0)} · FC ${r(u.fc, 0)} · IC ${r(u.ic, 2)} · PVC ${r(u.pvc)} · PCP ${r(u.pcp)} · RVS ${r(u.rvs, 0)} · VS ${r(u.vs, 0)} · SvO₂ ${r(u.svo2, 0)} %`;
function posible(k, etiqueta, u) {
  for (const [v, [a, b]] of Object.entries(POSIBLE)) {
    const min = v === 'pcp' && PCP_MIN[k] != null ? PCP_MIN[k] : a;
    assert.ok(u[v] >= min && u[v] <= b, `${etiqueta}: ${v} = ${u[v].toFixed(2)} (posible ${min}-${b}) · ${resumen(u)}`);
  }
}

const normal = paciente('normal').u;

for (const k of CON_GRAVEDAD) {
  const esc = ESCENARIOS[k];
  const pts = PASOS.map(g => ({ g, ...paciente(k, g) }));
  const en = (g) => pts.find(p => p.g === g);

  test(`«${esc.nombre}»: sin gravedad, el escenario de siempre (gravedad.defecto)`, () => {
    const a = crearMotor(), b = crearMotor();
    esc.aplicar(a); esc.aplicar(b, esc.gravedad.defecto);
    assert.deepEqual(a.p, b.p);
    const d = crearMotor(); esc.aplicar(d);
    const esperado = { hemorragia: () => d.p.hemorragia === 1000, fallo: () => Math.abs(d.p.vi.ees - 0.9) < 1e-9,
      derrame: () => Math.abs(d.p.liquidoPeri - 260) < 1e-9,
      // P5a: el defecto del TEP ya no es ×8 y ees ×0,65 (extremo: FEVD 13 %, PAM 67) sino el submasivo: g = 0,7 con u = g^0,6 →
      // resistencia ×9^u (~×5,9) y ees × (1 − 0,376 u) (~0,70). Es una DEFINICIÓN, no un umbral clínico
      tep: () => { const u = 0.7 ** 0.6; return Math.abs(d.p.rPul - escalarRPul(BASE, 9 ** u)) < 1e-9 && Math.abs(d.p.vd.ees / BASE.vd.ees - (1 - 0.35 / (Math.log(8) / Math.log(9)) * u)) < 1e-9; } };
    assert.ok(esperado[k](), 'el defecto no reproduce el escenario de antes');
  });

  test(`«${esc.nombre}» al 0 %: el corazón normal (±1 en PAM, FC, PVC y PCP; ±3 % en el IC)`, () => {
    const u = en(0).u;
    for (const v of ['pam', 'fc', 'pvc', 'pcp']) assert.ok(Math.abs(u[v] - normal[v]) <= 1, `${v} ${u[v].toFixed(1)} · normal ${normal[v].toFixed(1)}`);
    assert.ok(Math.abs(u.ic / normal.ic - 1) <= 0.03, `IC ${u.ic.toFixed(2)} · normal ${normal.ic.toFixed(2)}`);
  });

  // (PAM: antes 80-99 con el normal en 100; con la RVS calibrada el normal es ~87, y el 80 % de la normal, ~70)
  test(`«${esc.nombre}» al 50 %: entre el normal y el shock (PAM del 80 % de la normal hacia arriba, IC 1,8-2,7) · ${resumen(en(0.5).u)}`, () => {
    const u = en(0.5).u;
    assert.ok(u.pam >= 0.8 * normal.pam && u.pam < normal.pam - 0.5, `PAM ${u.pam.toFixed(1)}`);
    assert.ok(u.ic >= 1.8 && u.ic <= 2.7, `IC ${u.ic.toFixed(2)}`);
  });

  test(`«${esc.nombre}» al 100 %: shock posible, PAM 45-60, sin ceros, NaN ni RVS negativa · ${resumen(en(1).u)}`, () => {
    const u = en(1).u;
    assert.ok(u.pam >= 45 && u.pam <= 60, `PAM ${u.pam.toFixed(1)}`);
    assert.ok(u.rvs > normal.rvs * 1.05, `la RVS sube (vasoconstricción compensadora): ${u.rvs.toFixed(0)} · normal ${normal.rvs.toFixed(0)}`);
    assert.ok(u.fc > normal.fc + 30, `taquicardia: FC ${u.fc.toFixed(0)}`);
  });

  test(`«${esc.nombre}»: paciente posible en todo el recorrido del mando (0-100 %, asentado)`, () => {
    for (const p of pts) {
      assert.equal(p.roto, null, `${Math.round(p.g * 100)} %: ${p.roto}`);
      posible(k, `${Math.round(p.g * 100)} % (${esc.gravedad.texto(p.g)})`, p.u);
    }
  });

  // Segunda vuelta (21/10/2026). Fallo del VI: la PVC no baja de la normal en ningún punto (Tabla 14.1: PVC alta en el
  // cardiogénico; antes, el edema rápido la dejaba en 2,8 a fondo). TEP: la pulmonar media no pasa de 40 mmHg (un VD sin
  // hipertrofia no la sostiene; fisiología general) y la pulmonar late (antes, 55/53 a fondo)
  if (k === 'fallo') test(`«${esc.nombre}»: la PVC no baja de la normal en todo el recorrido (Tabla 14.1)`, () => {
    for (const p of pts) assert.ok(p.u.pvc >= normal.pvc - 0.2, `${Math.round(p.g * 100)} %: PVC ${p.u.pvc.toFixed(2)} · normal ${normal.pvc.toFixed(2)}`);
  });
  if (k === 'tep') test(`«${esc.nombre}»: la pulmonar media no pasa de 40 mmHg y late (presión de pulso ≥6; antes, 2-4) en todo el recorrido`, () => {
    for (const p of pts) assert.ok(p.u.papm <= 40 && p.u.paps - p.u.papd >= 6, `${Math.round(p.g * 100)} %: ${p.u.paps.toFixed(0)}/${p.u.papd.toFixed(0)} (media ${p.u.papm.toFixed(0)})`);
  });
  // a fondo, la vasoconstricción compensadora deja la RVS alta pero humana: IRVS (PAM − PVC) ÷ IC entre 30 y 45 unidades Wood
  // (la normal, 25-30: Tabla 8.1). Antes, con la RVS basal sin calibrar y el techo del reflejo de +15 %, ~39
  test(`«${esc.nombre}» al 100 %: IRVS alta y humana (30-45 unidades Wood)`, () => {
    const u = en(1).u, irvs = (u.pam - u.pvc) / u.ic;
    assert.ok(irvs >= 30 && irvs <= 45, `IRVS ${irvs.toFixed(1)}`);
  });

  test(`«${esc.nombre}»: sin saltos (la PAM baja siempre y nunca más de 15 mmHg cada 10 %)`, () => {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], d = a.u.pam - b.u.pam, tramo = (b.g - a.g) / 0.1;
      assert.ok(d > -0.5, `${Math.round(a.g * 100)} → ${Math.round(b.g * 100)} %: la PAM sube (${a.u.pam.toFixed(1)} → ${b.u.pam.toFixed(1)})`);
      assert.ok(d <= 15 * tramo, `${Math.round(a.g * 100)} → ${Math.round(b.g * 100)} %: salto de ${d.toFixed(1)} mmHg`);
    }
  });

  test(`«${esc.nombre}» al 100 %: mientras se asienta, la PAM no baja de 40`, () => {
    assert.ok(en(1).pamMin >= 40, `PAM mínima ${en(1).pamMin.toFixed(1)}`);
  });

  test(`«${esc.nombre}» al 100 %, ${SEGUNDOS_LARGO} s más: sigue siendo un paciente posible`, () => {
    const p = paciente(k, 1, SEGUNDOS_LARGO);
    assert.equal(p.roto, null, p.roto);
    posible(k, `${SEGUNDOS_LARGO} s`, p.u);
    assert.ok(p.u.pam >= 45 && p.u.pam <= 65, `PAM ${p.u.pam.toFixed(1)}`);
  });
}

// El patrón de cada tipo a fondo (Tabla 14.1 de Marino, la misma fuente que el patrón del escenario de siempre en
// motor.test.mjs). En el fallo del VI, la PCP (Fig. 16.2: «la PVC o la PCP, según el ventrículo que falla»)
test('a fondo, cada shock con su patrón: hemorragia PVC y PCP ↓; fallo del VI PCP ↑; derrame y TEP PVC ↑; todos GC ↓', () => {
  const a = Object.fromEntries(CON_GRAVEDAD.map(k => [k, paciente(k, 1).u]));
  assert.ok(a.hemorragia.pvc < normal.pvc - 0.5 && a.hemorragia.pcp < normal.pcp - 0.5, resumen(a.hemorragia));
  assert.ok(a.fallo.pcp > 18, `fallo: ${resumen(a.fallo)}`);
  assert.ok(a.derrame.pvc > normal.pvc + 3, `derrame: ${resumen(a.derrame)}`);
  assert.ok(a.tep.pvc > normal.pvc + 3, `TEP: ${resumen(a.tep)}`);
  for (const k of CON_GRAVEDAD) assert.ok(a[k].gc < normal.gc * 0.6, `${k}: GC ${a[k].gc.toFixed(2)}`);
});
test('el TEP a fondo es el de alto riesgo (con inestabilidad: PAM <65) y el de siempre, el intermedio (Marino, cap. 22, p. 7)', () => {
  assert.ok(paciente('tep', 1).u.pam < 65);
  assert.ok(paciente('tep').u.pam >= 65);
});
test('aplicarEscenario con gravedad deja al paciente en el mismo estado que la prueba', () => {
  const m = crearMotor(); m.correr(12); aplicarEscenario(m, 'derrame', 1); m.correr(faltaParaAsentar(m));
  assert.equal(m.ultimo.pam, paciente('derrame', 1).u.pam);
});
