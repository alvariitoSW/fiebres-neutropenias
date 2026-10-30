// Asincronías paciente-respirador (maqueta mv-papel-pulmon, lámina 3). Sin DOM. Un compartimento con esfuerzo del paciente.
// Ecuación del movimiento (LA2 pdf 47 = p. 511): Pmus + Pvent = flujo × R + V/C + PEEP.
//   · Respirador insuflando (VC, flujo constante Q): Paw = Q·R + V/C + PEEP − Pmus.
//   · Respirador esperando (circuito a la PEEP con resistencia Rc): q = (Pmus − V/C)/(R + Rc); Paw = PEEP − Rc·q. El sensor ve la
//     caída de Paw: se dispara a −2 cmH₂O (M27 pdf 8: «2 a 3 cmH₂O»). Con esfuerzo débil la caída no llega: esfuerzo ineficaz.
//   · Pmus = A·sen²(π·t/Ti_neural), A en cmH₂O: ILUSTRATIVO. Las asincronías salen de esta dinámica (idea de VentLoop), no de un dibujo.
export const ORIGEN = 'ilustrativo';
export const P_ASINC = { c: 60, r: 8, rc: 10, peep: 5, vt: 400, flujo: 60, umbral: 2, tBackup: 5, dt: 0.005 };
export const TOPES = { esfuerzoMax: 15, esfuerzoAviso: 12 };
export const ESCENARIOS = {
  sincronico: { nombre: 'Sincrónico', tn: 3, tin: 0.7, a: 8, retraso: null },
  ineficaz: { nombre: 'Esfuerzo ineficaz', tn: 3, tin: 0.8, a: 3, retraso: null },
  doble: { nombre: 'Doble disparo', tn: 4, tin: 1.2, a: 11, retraso: null },
  inverso: { nombre: 'Disparo inverso', tn: null, tin: 1.0, a: 11, retraso: 0.3 },   // el esfuerzo llega 0,3 s después de la insuflación
};
const pmusDe = (A, tin, t) => (t < 0 || t > tin ? 0 : A * Math.sin(Math.PI * t / tin) ** 2);

export function simularAsinc(escenario, { esfuerzo, duracion = 24, params = {} } = {}) {
  const E = ESCENARIOS[escenario], p = { ...P_ASINC, ...params }, A = esfuerzo ?? E.a, dt = p.dt;
  const Q = p.flujo / 60, tiVent = (p.vt / 1000) / Q;
  let V = 0, fase = 'esp', tFaseIns = 0, vIns = 0, tUltimo = 0, tUltFin = 0, finBreath = -9;
  let effT0 = E.tn ? 0.4 : null;   // inicio del esfuerzo en curso (null: aún no empezado)
  const t = [], paw = [], flujo = [], vol = [], pmus = [], ciclos = [], esfuerzos = [];
  let actual = null, esf = null;
  const abrirEsf = (t0) => { esf = { t0, t1: t0 + E.tin, a: A, vtEntregado: 0, disparos: 0 }; esfuerzos.push(esf); };
  for (let tt = 0; tt < duracion; tt += dt) {
    if (E.tn) { if (effT0 != null && tt >= effT0 && !esf) { abrirEsf(effT0); } if (esf && tt >= esf.t1 + 1e-9) { esf = null; effT0 += E.tn; } }
    const pm = esf ? pmusDe(A, E.tin, tt - esf.t0) : 0;
    let q, pw;
    if (fase === 'insp') {
      q = Q; pw = q * p.r + V / p.c * 1000 / 1000 * 1 + 0;           // V en L
      pw = q * p.r + (V / 1000) / (p.c / 1000) + p.peep - pm;
      V += q * 1000 * dt; vIns += q * 1000 * dt;
      if (vIns >= p.vt) { fase = 'esp'; actual.t1 = tt; actual.vt = vIns; ciclos.push(actual); finBreath = tt; }
    } else {
      q = (pm - (V / 1000) / (p.c / 1000)) / (p.r + p.rc); pw = p.peep - p.rc * q;
      V = Math.max(0, V + q * 1000 * dt);
      const porEsfuerzo = p.peep - pw >= p.umbral, porTiempo = tt - tUltimo >= p.tBackup;
      if (porEsfuerzo || porTiempo) {
        fase = 'insp'; vIns = 0; tUltimo = tt; actual = { t0: tt, tipo: porEsfuerzo ? 'esfuerzo' : 'tiempo', vt: 0, vtotal: 0 };
        if (porEsfuerzo && esf) { esf.disparos++; }
        if (E.retraso != null && !porEsfuerzo) { abrirEsf(tt + E.retraso); }
        if (esf) actual.esf = esf;
      }
    }
    // el esfuerzo del disparo inverso se crea al insuflar por tiempo y empieza con retraso
    if (E.retraso != null && !esf) { const f = esfuerzos[esfuerzos.length - 1]; if (f && tt < f.t0) { /* esperando */ } }
    t.push(tt); paw.push(pw); flujo.push(q * 60); vol.push(V); pmus.push(pm);
  }
  // clasificación (la hace el motor, de las trazas)
  for (const e of esfuerzos) {
    const dentro = ciclos.filter((c) => c.t0 >= e.t0 - 1e-9 && c.t0 <= e.t1);
    e.vtEntregado = dentro.reduce((s, c) => s + c.vt, 0); e.disparos = dentro.length;
  }
  const clasif = [];
  for (const e of esfuerzos) {
    const cs = ciclos.filter((c) => c.t0 >= e.t0 - 1e-9 && c.t0 <= e.t1);
    const previo = ciclos.find((c) => c.t0 < e.t0 && c.t0 >= e.t0 - 0.5);   // insuflación que empezó antes del esfuerzo (disparo inverso)
    let tipo = 'sincronico';
    if (cs.length === 0 && !previo) tipo = 'ineficaz';
    else if (E.retraso != null && previo && previo.tipo === 'tiempo' && cs.length >= 1) tipo = 'inverso';
    else if (cs.length >= 2 && cs[1].t0 - cs[0].t1 < (p.vt / 1000 / Q) / 2) tipo = 'doble';
    clasif.push({ tipo, t0: e.t0, t1: e.t1, vt: cs.reduce((s, c) => s + c.vt, 0) + (previo ? previo.vt : 0), gap: cs.length >= 2 ? cs[1].t0 - cs[0].t1 : null, ciclos: cs, a: e.a });
  }
  return { t, paw, flujo, vol, pmus, ciclos, esfuerzos: clasif, tiVent, params: p };
}

export function selloAsinc(r, { esfuerzo }) {
  if (esfuerzo >= TOPES.esfuerzoMax) { const vtMax = Math.max(0, ...r.esfuerzos.map((e) => e.vt));
    return { clave: 'esfuerzo', titulo: 'Esfuerzo en el tope', origen: 'ilustrativo', cita: 'LA2 pdf 94-95',
      texto: `Con un esfuerzo de ${esfuerzo} cmH₂O llegan a ${Math.round(vtMax)} mL en una sola respuesta: el disparo doble apila volumen y el libro avisa del riesgo de sobredistensión.` }; }
  return null;
}
