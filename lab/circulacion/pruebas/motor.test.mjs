// Pruebas del motor del latido. Se ejecutan con:  node --test lab/circulacion/pruebas/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor, BASE } from '../motor.mjs';
import { evaluar } from '../referencias.mjs';
import { ESCENARIOS, PATRONES, FUENTE_PATRONES, direccion, cumple } from '../escenarios.mjs';

// Un solo latido normal estable para todo el archivo (40 s: también se asienta el barorreflejo)
const normal = crearMotor(); normal.correr(40);
const u = normal.ultimo, o = normal.onda;

// --- Cifras del latido normal frente a su referencia (ficha de la app o fisiología general) ---
for (const r of evaluar(u, o)) {
  const nombre = `latido normal · ${r.nombre}: ${r.v.toFixed(r.dec ?? 0)} ${r.unidad} (ref. ${r.texto}, ${r.origen === 'ficha' ? r.fuente : 'fisiología general'})`;
  if (r.pendiente) {
    test(nombre, { todo: 'pendiente de calibrar: ' + r.pendiente }, () => {
      assert.ok(r.ok, 'fuera de rango (ya se sabía)');
    });
    // si un día se cumple, hay que quitar la marca de pendiente
    test(`${r.nombre}: la marca de pendiente sigue haciendo falta`, () => assert.ok(!r.ok, 'ya cumple: quita "pendiente" en referencias.mjs'));
  } else {
    test(nombre, () => assert.ok(r.ok, `fuera de rango: ${r.v.toFixed(2)} (esperado ${r.min}-${r.max})`));
  }
}

// --- Invariantes físicos ---
test('el volumen total de sangre se conserva', () => {
  const m = crearMotor(); m.correr(20);
  assert.ok(Math.abs(m.ultimo.vTotal - BASE.vSangre) < 0.5, `vTotal ${m.ultimo.vTotal}`);
  ESCENARIOS.hemorragia.aplicar(m); m.correr(10);
  assert.ok(Math.abs(m.ultimo.vTotal - (BASE.vSangre - 1000)) < 0.5, `tras la hemorragia ${m.ultimo.vTotal}`);
});

test('el motor es determinista', () => {
  const a = crearMotor(), b = crearMotor(); a.correr(5); b.correr(5);
  assert.equal(a.s.vvi, b.s.vvi); assert.equal(a.s.pao, b.s.pao);
});

test('las 7 fases de Wiggers aparecen una vez y en orden', () => {
  const secuencia = []; for (const x of o) if (secuencia[secuencia.length - 1] !== x.fase) secuencia.push(x.fase);
  assert.deepEqual(secuencia, ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
});

test('nunca están abiertas a la vez la mitral y la aórtica, ni la tricúspide y la pulmonar', () => {
  assert.ok(!o.some(x => x.vMit && x.vAo), 'mitral y aórtica abiertas a la vez');
  assert.ok(!o.some(x => x.vTri && x.vPul), 'tricúspide y pulmonar abiertas a la vez');
});

test('en las fases isovolumétricas (B, E) el volumen del VI no cambia', () => {
  for (const f of ['B', 'E']) { const v = o.filter(x => x.fase === f).map(x => x.vvi); assert.ok(Math.max(...v) - Math.min(...v) < 0.5, `fase ${f}: varía ${Math.max(...v) - Math.min(...v)} mL`); }
});

test('la curva aórtica tiene incisura al cerrarse la válvula', () => {
  const i = o.findIndex((x, k) => k > 0 && o[k - 1].vAo && !x.vAo);
  assert.ok(i > 0, 'no se cierra la aórtica');
  const antes = o.slice(Math.max(0, i - 15), i), min = Math.min(...antes.map(x => x.pao)), despues = o.slice(i, i + 15).map(x => x.pao);
  assert.ok(o[i - 1].qAo < 0, 'no hay reflujo antes del cierre');
  assert.ok(Math.max(...despues) > min + 2, `sin rebote tras la incisura (mín ${min.toFixed(1)}, después ${Math.max(...despues).toFixed(1)})`);
});

test('en reposo el barorreflejo no actúa', () => {
  for (const k of ['fc', 'r', 'vu', 'ees']) assert.ok(Math.abs(u.baro[k]) < 0.03, `${k}: ${u.baro[k]}`);
  assert.ok(Math.abs(u.fc - BASE.fc) < 1.5, `FC ${u.fc}`);
});

test('el barorreflejo compensa una hemorragia (PAM más alta y FC más rápida que sin él)', () => {
  const r = (baro) => { const m = crearMotor({ barorreflejo: baro }); m.correr(10); ESCENARIOS.hemorragia.aplicar(m); m.correr(40); return m.ultimo; };
  const con = r(true), sin = r(false);
  assert.ok(con.pam > sin.pam + 10, `PAM con ${con.pam.toFixed(0)} · sin ${sin.pam.toFixed(0)}`);
  assert.ok(con.fc > sin.fc + 5, `FC con ${con.fc.toFixed(0)} · sin ${sin.fc.toFixed(0)}`);
});

// --- Cada escenario reproduce el patrón de su tipo de shock en la fuente ---
const VAR = { pvc: (x) => x.pvc, gc: (x) => x.gc, rvs: (x) => x.rvs, pcp: (x) => x.pcp };
for (const [clave, esc] of Object.entries(ESCENARIOS)) {
  if (!esc.tipo) continue;
  const m = crearMotor(); m.correr(10); esc.aplicar(m); m.correr(40);
  for (const [v, esperado] of Object.entries(PATRONES[esc.tipo])) {
    const obtenido = direccion(v, VAR[v](u), VAR[v](m.ultimo));
    test(`escenario «${esc.nombre}» (shock ${esc.tipo}) · ${v.toUpperCase()} ${esperado} (${FUENTE_PATRONES})`, () =>
      assert.ok(cumple(esperado, obtenido), `${v}: normal ${VAR[v](u).toFixed(1)} → ${VAR[v](m.ultimo).toFixed(1)} (${obtenido}), se esperaba ${esperado}`));
  }
}
