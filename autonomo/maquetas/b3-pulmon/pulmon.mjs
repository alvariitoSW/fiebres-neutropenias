// El pulmón con respirador, pieza 1: UN compartimento (maqueta; en la app, js/modules/libros/pulmon-vivo-motor.mjs).
// Sin DOM: lo usa la página (muestra a muestra, para el monitor) y la prueba Node (pruebas.mjs).
//
// Origen: FISIOLOGÍA GENERAL (Marino no da resistencia ni constantes de tiempo). El modelo:
//   Palv = V / C                 (V: volumen por encima del reposo a presión cero; C: compliance, mL/cmH₂O)
//   dV/dt = (Paw − Palv) / R     (R: resistencia, cmH₂O por L/s; en la espiración, rEsp: en el broncoespasmo la
//                                 resistencia espiratoria es mayor que la inspiratoria, ilustrativo)
//   espiración pasiva: Paw = PEEP, así que el flujo cae con τ = R · C
// Lo que Marino sí da y aquí se reproduce: Ppico = Pres + Pel (Ec. 27.1), meseta = Palv = Pel (27.2), pico − meseta =
// Pres (27.3), Cstat = Vt / (meseta − PEEP total) (27.4), la PEEP oculta como flujo que no llega a cero (Fig. 23.5) y
// la oclusión espiratoria que la mide (Fig. 28.9).
//
//   crearPulmon(resp, pulmon, maniobras) → { paso(dt), lectura(), fase, t, ... }
//   simular(resp, pulmon, maniobras, { ciclos, dt }) → { t[], paw[], flujo[], vol[], fase[], lectura }
//   pbw(tallaCm, sexo)  peso corporal predicho (Tabla 24.5 / 27.1)

export const ORIGEN_MODELO = 'fisiología general';
export const T_PAUSA = 0.5;      // s de pausa inspiratoria (inflation-hold)
export const T_OCLUSION = 1.0;   // s de oclusión al final de la espiración
const TAU_VALVULA = 0.04;        // s: lo que tarda la presión proximal en igualarse al cerrar una válvula (ilustrativo)

// Tabla 24.5 (cap. 24 p. 48) = Tabla 27.1 (cap. 27 p. 14): varones 50 + 2,3 × (pulgadas − 60); mujeres 45,5 + …
export function pbw(tallaCm, sexo) {
  const pulg = tallaCm / 2.54;
  return Math.round(((sexo === 'm' ? 45.5 : 50) + 2.3 * (pulg - 60)) * 10) / 10;
}

// resp: { modo: 'vcv' | 'pcv', vt (mL, VCV), fr (rpm), peep (cmH₂O), flujo (L/min, VCV), pinsp (cmH₂O sobre la PEEP,
//   PCV), ie (parte espiratoria de la relación 1:ie, PCV), pmax (alarma de presión, cmH₂O; 40 si no se dice) }
// pulmon: { c (mL/cmH₂O), r (cmH₂O/(L/s)), rEsp (opcional, = r) }
// maniobras: { pausa, oclusion } (booleanos)
export function crearPulmon(resp, pulmon, maniobras = {}) {
  const S = { resp: { ...resp }, pulmon: { ...pulmon }, man: { ...maniobras } };
  // El pulmón arranca en su reposo a la PEEP aplicada (V = C · PEEP); si la PEEP cambia en vivo, se adapta ciclo a ciclo.
  let V = (pulmon.c || 0) * (resp.peep || 0), t = 0, tFase = 0, fase = 'insp', paw = resp.peep || 0, q = 0, alarma = false;
  const ciclo = { pico: 0, mesetaMedida: null, peepTotMedida: null, palvFinInsp: 0, palvFinEsp: 0, vFinInsp: 0, vFinEsp: 0, flujoFinEsp: 0, vtIns: 0, sumaPaw: 0, nPaw: 0, ti: 0, te: 0, tPausa: 0 };
  let ultimo = null;   // la lectura del último ciclo completo
  const C = () => S.pulmon.c, Ri = () => S.pulmon.r, Re = () => S.pulmon.rEsp ?? S.pulmon.r;
  const palv = () => V / C();
  const tiempos = () => {
    const r = S.resp, T = 60 / r.fr;
    let ti = r.modo === 'vcv' ? r.vt / (r.flujo * 1000 / 60) : T / (1 + r.ie);
    const tp = S.man.pausa ? T_PAUSA : 0;   // la pausa (como la oclusión) alarga el ciclo: no roba tiempo a la espiración
    const te = Math.max(0.2, T - ti);
    return { T, ti, tp, te };
  };
  function cerrarCiclo() {
    const { ti, tp, te } = tiempos(), r = S.resp;
    const vtExh = ciclo.vFinInsp - ciclo.vFinEsp;
    const peepTot = ciclo.palvFinEsp, autoPeep = Math.max(0, peepTot - r.peep);
    const meseta = ciclo.mesetaMedida, peepTotMed = ciclo.peepTotMedida;
    ultimo = {
      pico: ciclo.pico, meseta, peepTot: peepTotMed, autoPeep: peepTotMed != null ? Math.max(0, peepTotMed - r.peep) : null,
      // las cifras «reales» del modelo (sin maniobra): para las pruebas y para el dibujo del alvéolo
      palvFinInsp: ciclo.palvFinInsp, palvFinEsp: peepTot, autoPeepReal: autoPeep,
      pres: ciclo.pico - ciclo.palvFinInsp,
      cstat: meseta != null && peepTotMed != null && meseta > peepTotMed ? vtExh / (meseta - peepTotMed) : null,
      dp: meseta != null && peepTotMed != null ? meseta - peepTotMed : null,
      vtIns: ciclo.vtIns, vtExh, vm: vtExh * r.fr / 1000, flujoFinEsp: ciclo.flujoFinEsp,
      pMedia: ciclo.nPaw ? ciclo.sumaPaw / ciclo.nPaw : 0,
      ti, te, ie: te / ti, vAtrapado: Math.max(0, ciclo.vFinEsp - C() * r.peep),
      // «combinación no fisiológica»: la inspiración no deja sitio a la espiración en el ciclo
      cabe: ti + 0.2 <= 60 / r.fr,
      // la alarma de presión del respirador (pmax): en VCV corta la insuflación y el Vt no se entrega entero
      alarmaPresion: alarma,
    };
    Object.assign(ciclo, { pico: 0, mesetaMedida: null, peepTotMedida: null, vtIns: 0, sumaPaw: 0, nPaw: 0 }); alarma = false;
  }
  function paso(dt) {
    const r = S.resp, { ti, tp, te } = tiempos();
    const pa = palv();
    if (fase === 'insp') {
      if (r.modo === 'vcv') { q = r.flujo * 1000 / 60; V += q * dt; paw = palv() + Ri() * q / 1000; }
      else { paw = r.peep + r.pinsp; q = Math.max(0, (paw - pa) / Ri() * 1000); V += q * dt; }
      ciclo.vtIns += q * dt;
      if (paw > ciclo.pico) ciclo.pico = paw;
      const pmax = r.pmax ?? 40, corta = r.modo === 'vcv' && paw > pmax;
      if (corta) { alarma = true; ciclo.pico = pmax; }
      if (tFase >= ti || corta) { ciclo.palvFinInsp = palv(); ciclo.vFinInsp = V; fase = tp ? 'pausa' : 'esp'; tFase = 0; }
    } else if (fase === 'pausa') {
      q = 0; paw += (pa - paw) * (1 - Math.exp(-dt / TAU_VALVULA));
      if (tFase >= tp) { ciclo.mesetaMedida = pa; fase = 'esp'; tFase = 0; }
    } else if (fase === 'esp') {
      paw += (r.peep - paw) * (1 - Math.exp(-dt / TAU_VALVULA));
      q = pa > r.peep ? -(pa - r.peep) / Re() * 1000 : 0;
      V = Math.max(0, V + q * dt);
      if (tFase >= te) {
        ciclo.palvFinEsp = palv(); ciclo.vFinEsp = V; ciclo.flujoFinEsp = q * 60 / 1000;
        if (S.man.oclusion) { fase = 'oclusion'; tFase = 0; } else { cerrarCiclo(); fase = 'insp'; tFase = 0; }
      }
    } else if (fase === 'oclusion') {
      q = 0; paw += (pa - paw) * (1 - Math.exp(-dt / TAU_VALVULA));
      if (tFase >= T_OCLUSION) { ciclo.peepTotMedida = pa; cerrarCiclo(); fase = 'insp'; tFase = 0; }
    }
    ciclo.sumaPaw += paw; ciclo.nPaw++;
    t += dt; tFase += dt;
  }
  return {
    paso, S,
    get t() { return t; }, get fase() { return fase; }, get paw() { return paw; }, get palv() { return palv(); },
    get flujo() { return q * 60 / 1000; },                       // L/min (+ inspiratorio, − espiratorio)
    get vol() { return V - C() * S.resp.peep; },                 // mL por encima del reposo a la PEEP aplicada
    get volAbs() { return V; },
    lectura: () => ultimo,
    ajustar(o) { Object.assign(S.resp, o); }, pulmonAjustar(o) { Object.assign(S.pulmon, o); }, maniobra(o) { Object.assign(S.man, o); },
  };
}

// Corre varios ciclos (hasta el estado estable) y devuelve las curvas de la ventana final y la lectura del último ciclo.
export function simular(resp, pulmon, maniobras = {}, { ciclos = 10, dt = 0.005, ventana = 12 } = {}) {
  const p = crearPulmon(resp, pulmon, maniobras);
  const T = 60 / resp.fr + (maniobras.oclusion ? T_OCLUSION : 0) + (maniobras.pausa ? T_PAUSA : 0), total = ciclos * T;
  const t = [], paw = [], flujo = [], vol = [], fase = [];
  for (let tt = 0; tt < total; tt += dt) {
    p.paso(dt);
    if (tt >= total - ventana) { t.push(Math.round((tt - (total - ventana)) * 1000) / 1000); paw.push(p.paw); flujo.push(p.flujo); vol.push(p.vol); fase.push(p.fase); }
  }
  return { t, paw, flujo, vol, fase, lectura: p.lectura() };
}
