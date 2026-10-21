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

// --- Segunda vuelta del motor para el shock (21/10/2026) ---
// Rango de un paciente posible (cobertura del bloque 3, §4.1; el mismo de escenarios.test.mjs)
const POSIBLE = { pam: [40, 130], fc: [40, 170], ic: [1.2, 5], pvc: [0, 25], pcp: [2, 35], vs: [15, 110], svo2: [30, 85] };
const fueraDeRango = (u) => Object.entries(POSIBLE).filter(([v, [a, b]]) => !((v === 'svo2' ? u.svo2 * 100 : u[v]) >= a && (v === 'svo2' ? u.svo2 * 100 : u[v]) <= b))
  .map(([v]) => `${v} ${(v === 'svo2' ? u.svo2 * 100 : u[v]).toFixed(1)}`);
const camarasPositivas = (m) => m.onda.every(x => ['vad', 'vvd', 'vai', 'vvi'].every(v => x[v] > 0));

// 1. Derrame: el motor que nace con derrame es un paciente que ya lo tenía (pericardio estirado), no uno al que le entran
// 550 mL de golpe
test('derrame establecido: crearMotor({ liquidoPeri }) no da NaN y se asienta en un taponamiento posible (PVC ≈ PCP, cap. 18 p. 4)', () => {
  for (const L of [550, 1000, 2000]) {
    const m = crearMotor({ liquidoPeri: L });
    for (let i = 0; i < 40; i++) {
      m.correr(1);
      assert.ok(m.ultimo == null || (finito(m.ultimo) && camarasPositivas(m)), `${L} mL, t ${i + 1} s: NaN o cámara vacía`);
      if (m.ultimo) assert.ok(m.ultimo.pam >= 40, `${L} mL, t ${i + 1} s: PAM ${m.ultimo.pam.toFixed(1)} mientras se asienta`);
    }
    const t = m.ultimo;
    assert.equal(m.s.liquidoPeri, L, `${L} mL: todo el derrame acaba en el saco`);
    assert.deepEqual(fueraDeRango(t), [], `${L} mL: paciente posible`);
    assert.ok(t.pvc > u.pvc + 3 && Math.abs(t.pvc - t.pcp) < 2, `${L} mL: PVC ${t.pvc.toFixed(1)} ≈ PCP ${t.pcp.toFixed(1)} (igualación del taponamiento)`);
    assert.ok(t.ic < u.ic * 0.75 && t.fc > u.fc + 15, `${L} mL: el gasto cae y la FC sube (IC ${t.ic.toFixed(2)}, FC ${t.fc.toFixed(0)})`);
  }
});
test('derrame establecido: si cabe sin apretar (≤ derrameTolerado), el saco no se estira; y el agudo sigue siendo agudo', () => {
  assert.equal(crearMotor({ liquidoPeri: 200 }).s.estiraPeri, 0);
  assert.equal(crearMotor({ liquidoPeri: 550 }).s.estiraPeri, 550 - BASE.derrameTolerado);
  // el mismo volumen, agudo (con el motor en marcha), aprieta más que establecido
  const agudo = crearMotor(); agudo.correr(12); agudo.p.liquidoPeri = BASE.derrameTolerado + 40; agudo.correr(40);
  const establecido = crearMotor({ liquidoPeri: BASE.derrameTolerado + 40 }); establecido.correr(40);
  assert.ok(agudo.ultimo.pperi > establecido.ultimo.pperi + 1 && agudo.ultimo.pam < establecido.ultimo.pam,
    `agudo ${agudo.ultimo.pperi.toFixed(1)} mmHg (PAM ${agudo.ultimo.pam.toFixed(0)}) · establecido ${establecido.ultimo.pperi.toFixed(1)} (PAM ${establecido.ultimo.pam.toFixed(0)})`);
});

// 2. Fallo del VI: la PVC no baja de la normal (Tabla 14.1: PVC alta en el cardiogénico) y el edema es lento
test('fallo del VI: la PVC nunca baja de la normal y a fondo sube (Tabla 14.1); la PCP no pasa de 35 ni a los 2 min', () => {
  for (const g of [0.25, 0.5, 0.75, 0.9, 1]) {
    const m = crearMotor(); m.correr(12); ESCENARIOS.fallo.aplicar(m, g); m.correr(40);
    assert.ok(m.ultimo.pvc >= u.pvc - 0.2, `${g * 100} %: PVC ${m.ultimo.pvc.toFixed(2)} · normal ${u.pvc.toFixed(2)}`);
    if (g === 1) {
      assert.ok(m.ultimo.pvc > u.pvc + 1, `a fondo la PVC sube: ${m.ultimo.pvc.toFixed(2)}`);
      m.correr(120);
      assert.ok(m.ultimo.pvc > u.pvc + 0.5 && m.ultimo.pcp <= 35, `a los 2 min: PVC ${m.ultimo.pvc.toFixed(2)} · PCP ${m.ultimo.pcp.toFixed(1)}`);
    }
  }
});
test('edema de pulmón: por debajo de su umbral no sale nada; por encima sale a su ritmo, lento (minutos), y no vuelve', () => {
  assert.equal(u.vEdema, 0, 'el latido normal no hace edema');
  const m = crearMotor(); m.correr(12); m.p.vi.ees = 0.3; m.correr(40);
  const a = m.ultimo; m.correr(60); const b = m.ultimo;
  assert.ok(a.vEdema > 0 && a.vEdema < 100, `en 40 s, ${a.vEdema.toFixed(0)} mL al pulmón (antes, ~500)`);
  assert.ok(b.vEdema > a.vEdema, 'sigue saliendo mientras la PCP pasa del umbral');
  const ritmo = (b.vEdema - a.vEdema) / 60, esperado = BASE.kEdema * ((a.pvp + b.pvp) / 2 - BASE.pEdema);
  assert.ok(Math.abs(ritmo - esperado) < 0.3 * esperado + 0.05, `ritmo ${ritmo.toFixed(2)} mL/s · kEdema × exceso ${esperado.toFixed(2)}`);
});
test('isquemia del VD: aparece cuando su presión se acerca a la de la aorta (fallo del VI y TEP a fondo), no en el normal, la hemorragia ni el derrame', () => {
  assert.ok(u.isqVd < 0.01, `normal ${u.isqVd}`);
  const a = (k) => { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, 1); m.correr(40); return m.ultimo; };
  for (const k of ['fallo', 'tep']) assert.ok(a(k).isqVd > 0.2, `${k}: ${a(k).isqVd.toFixed(2)}`);
  for (const k of ['hemorragia', 'derrame']) assert.ok(a(k).isqVd < 0.05, `${k}: ${a(k).isqVd.toFixed(2)}`);
  // la hipertrofia del VD (mioVd) la protege: la misma presión con una pared gruesa no la produce
  const hp = crearMotor({ rPul: BASE.rPul * 6, mioVd: 2.4 }); hp.correr(40);
  assert.ok(hp.ultimo.isqVd < 0.05 && hp.ultimo.pvd_max > 40, `VD hipertrófico: isquemia ${hp.ultimo.isqVd.toFixed(2)} con PVD ${hp.ultimo.pvd_max.toFixed(0)}`);
});

// 3. Calibración: la RVS del normal (IRVS 25-30, Tabla 8.1: lo comprueban las referencias de arriba) y la pulmonar posible
test('arteria pulmonar: el normal no cambia (22/12) y con la pulmonar alta late (presión de pulso ≥6 mmHg; antes 55/53)', () => {
  assert.ok(u.paps >= 20 && u.paps <= 25 && u.papd >= 6 && u.papd <= 12, `normal ${u.paps.toFixed(0)}/${u.papd.toFixed(0)}`);
  for (const [k, g] of [['tep', 1], ['tep', undefined], ['fallo', 1], ['fallo', 0.8]]) {
    const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); m.correr(40);
    assert.ok(m.ultimo.paps - m.ultimo.papd >= 6, `${k} ${g ?? 'defecto'}: ${m.ultimo.paps.toFixed(0)}/${m.ultimo.papd.toFixed(0)}`);
  }
});

// 4. Soporte mecánico: gasto que se informa con sentido y punto de entrada de cada aparato (Marino, cap. 16, p. 45-48)
const conSoporte = (soporte, g = 1) => { const m = crearMotor(); m.correr(12); ESCENARIOS.fallo.aplicar(m, g); m.correr(40); m.p.soporte = soporte; m.correr(30); return m; };
const enFallo = (() => { const m = crearMotor(); m.correr(12); ESCENARIOS.fallo.aplicar(m, 1); m.correr(70); return m.ultimo; })();
test('sin soporte, el gasto es el de la válvula aórtica y las bombas no mueven nada', () => {
  assert.equal(u.gc, u.gcValvula); assert.equal(u.gcImpella + u.gcEcmo + u.gcVenteo + u.balon, 0);
});
test('soporte: el gasto por la válvula nunca es negativo (el reflujo de cierre no es gasto) y el total suma las bombas', () => {
  for (const imp of [2.5, 3, 3.5, 4, 5.5]) {
    const m = conSoporte({ impella: imp });
    for (let i = 0; i < 8; i++) {
      m.correr(0.5); const x = m.ultimo;
      assert.ok(x.gcValvula >= 0 && x.vs >= 0, `Impella ${imp}: válvula ${x.gcValvula}`);
      assert.ok(Math.abs(x.gc - (x.gcValvula + x.gcImpella + x.gcEcmo)) < 1e-9);
      assert.ok(finito(x) && camarasPositivas(m), `Impella ${imp}: NaN o cámara vacía`);
    }
  }
});
test('Impella: flujo continuo del VI a la aorta (p. 47); descarga el VI y baja la PCP', () => {
  const x = conSoporte({ impella: 3.5 }).ultimo;
  assert.ok(Math.abs(x.gcImpella - 3.5) < 0.1, `Impella ${x.gcImpella.toFixed(2)} L/min`);
  assert.ok(x.gc > enFallo.gc + 0.5 && x.pcp < enFallo.pcp - 3 && x.pam > enFallo.pam + 5, `GC ${x.gc.toFixed(2)} · PCP ${x.pcp.toFixed(1)} · PAM ${x.pam.toFixed(0)} (sin: ${enFallo.gc.toFixed(2)} · ${enFallo.pcp.toFixed(1)} · ${enFallo.pam.toFixed(0)})`);
});
test('ECMO VA: de las venas a la aorta (p. 48); sube la PA y, sin ventear, la poscarga del VI sube la PCP; el venteo la baja', () => {
  const e = conSoporte({ ecmo: 4.5 }).ultimo, v = conSoporte({ ecmo: 4.5, venteo: 0.8 }).ultimo;
  assert.ok(Math.abs(e.gcEcmo - 4.5) < 0.1 && e.pam > enFallo.pam + 10, `ECMO ${e.gcEcmo.toFixed(2)} · PAM ${e.pam.toFixed(0)}`);
  assert.ok(e.pcp > enFallo.pcp + 3, `PCP con ECMO ${e.pcp.toFixed(1)} · sin ${enFallo.pcp.toFixed(1)}`);
  assert.ok(v.gcVenteo > 0.7 && v.pcp < e.pcp - 3, `venteo ${v.gcVenteo.toFixed(2)} L/min · PCP ${v.pcp.toFixed(1)}`);
});
test('balón: se hincha en la diástole y se vacía al empezar la sístole (p. 45-46): pico diastólico, menos presión al abrir la aórtica y más VS', () => {
  const presionAlAbrir = (m) => { const o = m.onda, i = o.findIndex((x, k) => k > 0 && x.vAo && !o[k - 1].vAo); return o[i].pao; };
  const sin = conSoporte(null), con = conSoporte({ balon: 40 });
  const o = con.onda, cierre = o.findIndex((x, k) => k > 0 && !x.vAo && o[k - 1].vAo);
  // lleno en la diástole; en la eyección, casi vacío (empieza a vaciarse con la onda R, ~40 ms antes) y vacío al acabar
  assert.ok(Math.max(...o.slice(cierre).map(x => x.vBalon)) > 38, 'el balón se llena en la diástole');
  assert.ok(o.filter(x => x.fase === 'C').every(x => x.vBalon < 8) && o.filter(x => x.fase === 'D').every(x => x.vBalon < 1), 'el balón se vacía antes de la eyección');
  const picoDia = Math.max(...o.slice(cierre).map(x => x.pao));
  assert.ok(picoDia > con.ultimo.pas - 15, `pico diastólico ${picoDia.toFixed(0)} · PAS ${con.ultimo.pas.toFixed(0)}`);
  assert.ok(presionAlAbrir(con) < presionAlAbrir(sin) - 3, `al abrir la aórtica: ${presionAlAbrir(con).toFixed(0)} con balón · ${presionAlAbrir(sin).toFixed(0)} sin`);
  assert.ok(con.ultimo.vs > sin.ultimo.vs + 2 && con.ultimo.pam > sin.ultimo.pam + 3, `VS ${con.ultimo.vs.toFixed(0)} · ${sin.ultimo.vs.toFixed(0)}; PAM ${con.ultimo.pam.toFixed(0)} · ${sin.ultimo.pam.toFixed(0)}`);
});
test('con soporte, el volumen de sangre se conserva (las bombas solo lo cambian de sitio)', () => {
  for (const so of [{ impella: 4 }, { ecmo: 5, venteo: 0.8 }, { balon: 40 }]) {
    const x = conSoporte(so).ultimo;
    assert.ok(Math.abs(x.vTotal - balance(x)) < 0.5, `${JSON.stringify(so)}: ${x.vTotal.toFixed(1)} · ${balance(x).toFixed(1)}`);
  }
});
