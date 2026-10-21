// Pruebas del motor del latido. Se ejecutan con:  node --test 'js/modules/eco/pruebas/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor, BASE, conCodo } from '../motor.mjs';
import { evaluar } from '../referencias.mjs';
import { ESCENARIOS, PATRONES, FUENTE_PATRONES, direccion, cumple } from '../escenarios.mjs';

// Un solo latido normal estable para todo el archivo (40 s: también se asienta el barorreflejo)
const normal = crearMotor(); normal.correr(40);
const u = normal.ultimo, o = normal.onda;

// --- Cifras del latido normal frente a su referencia (ficha de la app o fisiología general) ---
for (const r of evaluar(u, o)) {
  const nombre = `latido normal · ${r.nombre}: ${r.v.toFixed(r.dec ?? 0)} ${r.unidad} (ref. ${r.texto}, ${r.fuente ?? 'fisiología general'})`;
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
// Lo que entra y sale de la sangre: la hemorragia (perdido), el relleno transcapilar (vRelleno) y el edema de pulmón (vEdema)
const balance = (u) => BASE.vSangre - u.perdido + u.vRelleno - u.vEdema;
test('el volumen total de sangre se conserva (lo que falta es lo que se ha perdido, rellenado o salido al pulmón)', () => {
  const m = crearMotor(); m.correr(20);
  assert.ok(Math.abs(m.ultimo.vTotal - balance(m.ultimo)) < 0.5, `vTotal ${m.ultimo.vTotal}`);
  assert.ok(m.ultimo.vRelleno < 5 && m.ultimo.vEdema === 0, `en reposo apenas entra ni sale nada: relleno ${m.ultimo.vRelleno.toFixed(1)} · edema ${m.ultimo.vEdema}`);
  ESCENARIOS.hemorragia.aplicar(m); m.correr(15);
  assert.equal(m.ultimo.perdido, 1000, 'la hemorragia de 1 L se ha ido entera');
  assert.ok(Math.abs(m.ultimo.vTotal - balance(m.ultimo)) < 0.5, `tras la hemorragia ${m.ultimo.vTotal}`);
  assert.ok(Math.abs(m.ultimo.vTotal - (BASE.vSangre - 1000)) < 40, `el relleno es lento: ${m.ultimo.vTotal.toFixed(0)} mL`);
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

// --- Gravedad del shock (octubre 2026): lo que rompía el motor, en su origen ---
const finito = (u) => ['pam', 'pas', 'pad_', 'fc', 'gc', 'pvc', 'pcp', 'rvs', 'vs', 'svo2'].every(k => Number.isFinite(u[k]));
test('venas con codo: la presión venosa es continua, derivable y nunca 0 al vaciarse (antes, max(0, …))', () => {
  const c = BASE.codoVen, e = 1e-6;
  assert.ok(Math.abs(conCodo(c - e, c) - conCodo(c + e, c)) < 1e-5, 'salto en el codo');
  assert.ok(Math.abs((conCodo(c + e, c) - conCodo(c - 3 * e, c)) / (4 * e) - 1) < 1e-3, 'la pendiente cambia en el codo');
  for (const x of [-20, -5, -1, 0, 1]) assert.ok(conCodo(x, c) > 0, `x ${x}`);
  for (const x of [6, 10, 20]) assert.equal(conCodo(x, c), x, 'por encima del codo, la recta de siempre');
});
test('una hemorragia de 2,5 L (más allá del mando) no da ceros, NaN ni RVS negativa', () => {
  const m = crearMotor(); m.correr(12); m.p.hemorragia = 2500;
  for (let i = 0; i < 60; i++) {
    m.correr(1); const u = m.ultimo;
    assert.ok(finito(u) && u.pam > 15 && u.rvs > 0 && u.gc > 0, `t ${i + 1} s: PAM ${u.pam} RVS ${u.rvs} GC ${u.gc}`);
  }
});
test('un derrame de 550 o 600 mL (más allá del mando) no da NaN ni cámaras con volumen negativo', () => {
  for (const L of [550, 600]) {
    const m = crearMotor(); m.correr(12); m.p.liquidoPeri = L;
    for (let i = 0; i < 40; i++) {
      m.correr(1);
      assert.ok(m.ultimo && finito(m.ultimo), `${L} mL, t ${i + 1} s: NaN`);
      for (const x of m.onda) for (const v of ['vad', 'vvd', 'vai', 'vvi']) assert.ok(x[v] > 0, `${L} mL, t ${i + 1} s: ${v} = ${x[v].toFixed(1)} mL`);
    }
    // no cabe entero: deja de entrar cuando el saco llega a la presión que lo empuja (pFuenteDerrame)
    assert.ok(m.s.liquidoPeri < L && m.ultimo.pperi <= BASE.pFuenteDerrame + 3, `${L} mL: entran ${m.s.liquidoPeri.toFixed(0)} a ${m.ultimo.pperi.toFixed(1)} mmHg`);
  }
});
test('el derrame entra a su ritmo (ritmoDerrame), no de golpe', () => {
  const m = crearMotor(); m.correr(12); m.p.liquidoPeri = 260; m.correr(2);
  assert.ok(Math.abs(m.s.liquidoPeri - 2 * BASE.ritmoDerrame) < 0.5, `a los 2 s, ${m.s.liquidoPeri.toFixed(1)} mL`);
});
test('relleno transcapilar: tras una hemorragia entra líquido del intersticio, nunca más de 1 L (Marino, cap. 15, p. 21)', () => {
  // con un ritmo muy acelerado (tauRelleno 15 s) para ver su tope en un minuto; en la app tarda mucho más
  const r = (ajustes) => { const m = crearMotor(ajustes); m.correr(12); m.p.hemorragia = 1800; m.correr(90); return m.ultimo; };
  const con = r({ tauRelleno: 15 }), sin = r({ rellenoMax: 0 });
  assert.ok(con.vRelleno > 300 && con.vRelleno <= BASE.rellenoMax, `relleno ${con.vRelleno.toFixed(0)} mL`);
  assert.ok(con.pam > sin.pam + 5, `PAM con relleno ${con.pam.toFixed(0)} · sin ${sin.pam.toFixed(0)}`);
  const muchisimo = crearMotor({ tauRelleno: 5, cInt: 1000 }); muchisimo.correr(12); muchisimo.p.hemorragia = 2500; muchisimo.correr(60);
  assert.ok(muchisimo.ultimo.vRelleno <= BASE.rellenoMax, `tope: ${muchisimo.ultimo.vRelleno.toFixed(0)} mL`);
});
test('edema de pulmón: por debajo de su umbral no sale nada; al fallar el VI, la PCP no sube sin límite', () => {
  const a = (ajustes) => { const m = crearMotor(ajustes); m.correr(12); m.p.vi.ees = 0.3; m.correr(40); return m.ultimo; };
  const con = a({}), sin = a({ kEdema: 0 });
  assert.ok(sin.pcp > 35, `sin edema, la sangre se acumula en el pulmón: PCP ${sin.pcp.toFixed(1)}`);
  assert.ok(con.pcp <= 35 && con.vEdema > 0, `con edema, PCP ${con.pcp.toFixed(1)} · ${con.vEdema.toFixed(0)} mL al pulmón`);
  assert.equal(u.vEdema, 0, 'el latido normal no hace edema');
});
