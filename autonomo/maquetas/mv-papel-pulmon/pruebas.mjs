// Prueba Node de la maqueta mv-papel-pulmon: node autonomo/maquetas/mv-papel-pulmon/pruebas.mjs
// La página la importa y enseña su resultado. Pares «paciente posible» del encargo (no cifras de fuente).
import { simular, pbw } from '../b3-pulmon/pulmon.mjs';
import { simularHisteresis, selloHisteresis, crearHisteresis, TOPES as TH } from './histeresis.mjs';
import { simularAsinc, selloAsinc, ESCENARIOS, TOPES as TA } from './asincronias.mjs';

export function correr() {
  const out = []; let fallos = 0;
  const ok = (c, m) => { out.push((c ? '✓ ' : '✗ ') + m); if (!c) fallos++; };
  const entre = (v, a, b) => v != null && isFinite(v) && v >= a && v <= b;
  const MAN = { pausa: true, oclusion: true };
  // 1. pares con simular de M3
  let L = simular({ modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60 }, { c: 60, r: 5 }, MAN).lectura;
  ok(entre(L.meseta, 12.5, 14) && entre(L.pico, 17.5, 19.5), `C 60/R 5, Vt 500, 60 L/min, PEEP 5: meseta ${L.meseta.toFixed(1)}, pico ${L.pico.toFixed(1)}`);
  L = simular({ modo: 'vcv', vt: 400, fr: 14, peep: 5, flujo: 60 }, { c: 20, r: 5 }, MAN).lectura;
  ok(entre(L.meseta, 24, 26), `C 20, Vt 400, PEEP 5: meseta ${L.meseta.toFixed(1)}`);
  L = simular({ modo: 'vcv', vt: 500, fr: 24, peep: 5, flujo: 60 }, { c: 60, r: 20 }, MAN).lectura;
  ok(L.flujoFinEsp < -1.5, `R 20, FR 24: flujo al final de la espiración ${L.flujoFinEsp.toFixed(1)} L/min (no llega a cero)`);
  // 2. histéresis
  const pb = pbw(175, 'v');
  for (const perfil of ['normal', 'sdra']) {
    const c = simularHisteresis({ perfil, peep: 5, vtKg: 6 });
    let mal = 0;
    for (let p = c.peep + 1; p < c.pMeseta - 0.5; p += 1) {
      const vi = c.insp.reduce((b, x) => (Math.abs(x.p - p) < Math.abs(b.p - p) ? x : b)).v;
      const ve = c.esp.reduce((b, x) => (Math.abs(x.p - p) < Math.abs(b.p - p) ? x : b)).v;
      if (ve < vi - 1) mal++;
    }
    ok(mal === 0, `${perfil}: a igual presión, el volumen espiratorio ≥ el inspiratorio`);
  }
  let c = simularHisteresis({ perfil: 'sdra', peep: 0, vtKg: 6 });
  ok(c.nAbreCierra >= 1, `SDRA reclutable, PEEP 0: ${c.nAbreCierra}/4 unidades abren y cierran`);
  c = simularHisteresis({ perfil: 'sdra', peep: 10, vtKg: 6 });
  ok(c.nAbreCierra === 0, `SDRA reclutable, PEEP 10: ${c.nAbreCierra}/4 unidades abren y cierran`);
  c = simularHisteresis({ perfil: 'normal', peep: 5, vtKg: 6 });
  ok(entre(c.pMeseta, 8, 20) && c.nAbreCierra === 0, `Normal, PEEP 5, 6 mL/kg: meseta ${c.pMeseta.toFixed(1)}, Cstat ${c.cstat.toFixed(0)}`);
  // 3. asincronías
  const ine = simularAsinc('ineficaz').esfuerzos.filter((e) => e.tipo === 'ineficaz');
  ok(ine.length >= 2 && ine.every((e) => e.vt === 0), `Ineficaz: ${ine.length} esfuerzos sin disparo, Vt del ciclo 0`);
  const dob = simularAsinc('doble').esfuerzos.find((e) => e.tipo === 'doble');
  const ti = simularAsinc('doble').tiVent;
  ok(dob && dob.ciclos.length === 2 && dob.gap < ti / 2, `Doble: 2 disparos con ${dob ? dob.gap.toFixed(2) : '—'} s entre ellos (< Ti/2 = ${(ti / 2).toFixed(2)} s)`);
  const inv = simularAsinc('inverso').esfuerzos.find((e) => e.tipo === 'inverso');
  ok(!!inv && inv.vt > 700, `Inverso: esfuerzo tras la insuflación, ${inv ? Math.round(inv.vt) : '—'} mL apilados`);
  const sin = simularAsinc('sincronico').esfuerzos;
  ok(sin.every((e) => e.tipo === 'sincronico'), 'Sincrónico: todos los esfuerzos disparan una sola respuesta');
  for (const k of Object.keys(ESCENARIOS)) for (const a of [0, 7.5, TA.esfuerzoMax]) {
    const r = simularAsinc(k, { esfuerzo: a });
    const bien = [r.paw, r.flujo, r.vol, r.pmus].every((v) => v.every((x) => isFinite(x))) && Math.min(...r.vol) >= 0 && Math.max(...r.vol) <= 1000 && Math.max(...r.paw) <= 50 && Math.min(...r.paw) > -10;
    ok(bien, `${k}, esfuerzo ${a}: sin NaN, volumen 0-1000, Paw −10..50`);
  }
  // 4. topes
  c = simularHisteresis({ perfil: 'normal', peep: TH.peepMax, vtKg: 6 });
  ok(selloHisteresis(c, { vtKg: 6, peep: TH.peepMax })?.clave === 'peep' || c.pMeseta > 30, `PEEP 20 da sello (meseta ${c.pMeseta.toFixed(0)})`);
  c = simularHisteresis({ perfil: 'normal', peep: 5, vtKg: 10 });
  ok(selloHisteresis(c, { vtKg: 10, peep: 5 })?.clave === 'vt', 'Vt 10 mL/kg da el sello «fuera de la protectora»');
  c = simularHisteresis({ perfil: 'sdra', peep: 0, vtKg: 6 });
  ok(selloHisteresis(c, { vtKg: 6, peep: 0 })?.clave === 'atelectrauma' || c.pMeseta > 30, 'SDRA con PEEP 0 da el sello de abrir y cerrar');
  for (const perfil of ['normal', 'sdra']) for (const peep of [0, 10, 20]) for (const vtKg of [4, 6, 8, 10]) {
    const r = simularHisteresis({ perfil, peep, vtKg });
    if (!(r.pMeseta <= 50 && r.vt <= 1000)) ok(false, `${perfil} PEEP ${peep} ${vtKg} mL/kg: meseta ${r.pMeseta}, Vt ${r.vt}`);
  }
  ok(true, 'Ningún mando llevado al tope pasa de meseta 50 ni de Vt 1000 mL');
  ok(selloAsinc(simularAsinc('doble', { esfuerzo: 15 }), { esfuerzo: 15 })?.clave === 'esfuerzo', 'Esfuerzo 15 da su sello');
  return { out, fallos };
}
if (typeof process !== 'undefined' && process.argv[1] && process.argv[1].endsWith('mv-papel-pulmon/pruebas.mjs')) {
  const { out, fallos } = correr(); console.log(out.join('\n')); console.log(fallos ? `${fallos} fallos` : 'todo en orden'); process.exit(fallos ? 1 : 0);
}
