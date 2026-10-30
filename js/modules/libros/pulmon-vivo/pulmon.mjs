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

import { pbw, C_TUBULADURA, PSV, T_DISPARO, SEMILLA, tau } from '../../../data/ventilacion-data.js';
import { perfilRacimo, pesoApertura, volumenRacimo, presionDe, complianceRacimo, estadoInicial, volumenReposo } from './racimo.mjs';
export { pbw, C_TUBULADURA, tau };
export const ORIGEN_MODELO = 'fisiología general';
const TI_MAX_PSV = 3;            // s: tope técnico del ciclado por flujo si el flujo no cae (ilustrativo)
function azar(semilla) {          // mulberry32: la variación entre respiraciones, con semilla fija (dos corridas dan lo mismo)
  let a = semilla >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const T_PAUSA = 0.5;      // s de pausa inspiratoria (inflation-hold)
export const T_OCLUSION = 1.0;   // s de oclusión al final de la espiración
// Esfuerzo del paciente (E4a). Ecuación del movimiento (Libro azul IV parte 2, pdf 47 = p. 511): Pmus + Pvent = flujo × R + Vt/C + PEEP.
// Pmus = pmus · sen²(π·t/tin): 0-15 cmH₂O, ILUSTRATIVO. El respirador dispara cuando el esfuerzo baja la Paw 2 cmH₂O por debajo de la PEEP
// (Marino cap. 27 p. 8: 2 a 3). Las asincronías salen de esta dinámica, no de un dibujo.
export const UMBRAL_DISPARO = 2;   // cmH₂O (ficha: 2-3)
export const RC_DISPARO = 10;      // cmH₂O por L/s: resistencia del circuito de disparo (ilustrativo)
export const T_REFRACTARIO = 0.25;  // s tras acabar la insuflación en que el respirador no vuelve a disparar (ilustrativo)
const TAU_VALVULA = 0.04;        // s: lo que tarda la presión proximal en igualarse al cerrar una válvula (ilustrativo)

// resp: { modo: 'vcv' | 'pcv' | 'psv', vt (mL, VCV), fr (rpm), peep (cmH₂O), flujo (L/min, VCV), pinsp (cmH₂O sobre la PEEP,
//   PCV), ie (parte espiratoria de la relación 1:ie, PCV), pmax (alarma de presión, cmH₂O; 40 si no se dice),
//   ps (cmH₂O sobre la PEEP, PSV), frEsp (rpm del paciente, PSV; ilustrativo) }
// pulmon: { c (mL/cmH₂O), r (cmH₂O/(L/s)), rEsp (opcional, = r) }
// maniobras: { pausa, oclusion } (booleanos; en PSV no valen: el paciente respira por su cuenta)
// Los mandos (resp) cambian en la respiración SIGUIENTE: S.resp es lo pedido; A, lo activo en este ciclo. ajustarYa() los pone ya.
export function crearPulmon(resp, pulmon, maniobras = {}) {
  const S = { resp: { ...resp }, pulmon: { ...pulmon }, man: { ...maniobras } }, A = { ...resp };
  const rnd = azar(SEMILLA);
  // El pulmón arranca en su reposo a la PEEP aplicada (V = C · PEEP); si la PEEP cambia en vivo, se adapta ciclo a ciclo.
  // El racimo (racimo.mjs, E2): 4 unidades que se abren y se cierran con la presión alveolar. Con pulmon.racimo ausente o 'sano' no hace nada
  // y el pulmón es el de un compartimento de siempre (V = C·Palv).
  let perfil = perfilRacimo(pulmon.racimo), U = estadoInicial(perfil, resp.peep || 0);
  let V = volumenReposo(perfil, pulmon.c || 0, resp.peep || 0), t = 0, tFase = 0, tCiclo = 0, fase = 'insp', paw = resp.peep || 0, q = 0, alarma = false;
  let pm = 0, esf = null, eNext = 0.4, eInv = null, disp = false, breath = null, ultimoEsf = null;
  const ventilaciones = [], esfuerzos = [];   // cada insuflación {t0, t1, vt, tipo}; cada esfuerzo clasificado al acabar
  const asist = () => (A.pmus || 0) > 0 && A.modo === 'vcv';
  const sen2 = (x) => Math.sin(Math.PI * Math.min(1, Math.max(0, x))) ** 2;
  function cerrarEsfuerzo() {
    const bs = ventilaciones.filter((b) => b.t0 >= esf.t0 - 1e-9 && b.t0 <= esf.t0 + esf.tin), ti = tiempos().ti;
    let tipo = 'sincronico';
    const pac = bs.filter((b) => b.tipo === 'esfuerzo');   // las que disparó el paciente (no las de respaldo por tiempo)
    if (esf.enInsp) tipo = 'inverso';
    else if (pac.length === 0) tipo = 'ineficaz';
    else if (pac.length >= 2 && pac[1].t0 - pac[0].t1 < ti / 2) tipo = 'doble';
    ultimoEsf = { tipo, t0: esf.t0, a: esf.a, vt: pac.reduce((x, b) => x + b.vt, 0) + (esf.enInsp && esf.previo ? esf.previo.vt : 0), valle: pac.length >= 2 ? pac[1].t0 - pac[0].t1 : null, disparos: pac.length, ti };
    esfuerzos.push(ultimoEsf); if (esfuerzos.length > 30) esfuerzos.shift();
    eNext = esf.t0 + 60 / (A.frNeural || 20); esf = null;
  }
  function esfuerzoPaso() {
    if (!asist()) { if (esf) esf = null; if (pm && A.modo !== 'psv') pm = 0; return; }
    if (!esf && ((A.retraso == null && t >= eNext) || (A.retraso != null && eInv != null && t >= eInv))) {
      esf = { t0: t, disp: 0, a: A.pmus, tin: A.tin || 0.8, enInsp: A.retraso != null && fase === 'insp', previo: fase === 'insp' ? breath : null }; eInv = null;
    }
    if (esf && t - esf.t0 >= esf.tin) cerrarEsfuerzo();
    pm = esf ? esf.a * sen2((t - esf.t0) / esf.tin) : 0;
  }
  function registrar(tipo) {   // una insuflación empieza: por esfuerzo del paciente o por tiempo (respaldo del respirador)
    breath = { t0: t, t1: null, vt: 0, tipo }; ventilaciones.push(breath); if (ventilaciones.length > 40) ventilaciones.shift();
    if (tipo === 'esfuerzo') disp = true;   // la marca bajo la Paw es solo del disparo del paciente
    if (esf && tipo === 'esfuerzo') esf.disp++;
    if (tipo === 'tiempo' && A.retraso != null && asist()) eInv = t + A.retraso;   // disparo inverso: el esfuerzo llega tras empezar la insuflación
  }
  let qPico = 0, tiMed = 0, dip = 0, tDisp = T_DISPARO, qFin = 0;
  const ciclo = { pico: 0, mesetaMedida: null, peepTotMedida: null, palvFinInsp: 0, palvFinEsp: 0, vFinInsp: 0, vFinEsp: 0, flujoFinEsp: 0, vtIns: 0, sumaPaw: 0, nPaw: 0, ti: 0, te: 0, tPausa: 0 };
  let ultimo = null;   // la lectura del último ciclo completo
  const C = () => complianceRacimo(perfil, U, S.pulmon.c), Ri = () => S.pulmon.r, Re = () => S.pulmon.rEsp ?? S.pulmon.r;
  const palv = () => presionDe(perfil, U, S.pulmon.c, V);
  const reposo = () => volumenReposo(perfil, S.pulmon.c, A.peep);   // volumen a la PEEP con las unidades que no se cierran
  const psv = () => A.modo === 'psv';
  const man = () => (psv() ? {} : S.man);
  const tiempos = () => {
    const r = A;
    if (psv()) { const T = 60 / r.frEsp; return { T, ti: tiMed, tp: 0, te: T - tiMed }; }
    const T = 60 / r.fr;
    let ti = r.modo === 'vcv' ? r.vt / (r.flujo * 1000 / 60) : T / (1 + r.ie);
    const tp = man().pausa ? T_PAUSA : 0;   // la pausa (como la oclusión) alarga el ciclo: no roba tiempo a la espiración
    const te = Math.max(0.2, T - ti);
    return { T, ti, tp, te };
  };
  function cerrarCiclo() {
    const { ti, te } = tiempos(), r = A;
    const vtExh = Math.max(0, ciclo.vFinInsp - ciclo.vFinEsp);
    const peepTot = ciclo.palvFinEsp, autoPeep = Math.max(0, peepTot - r.peep);
    const meseta = ciclo.mesetaMedida, peepTotMed = ciclo.peepTotMedida;
    ultimo = {
      pico: ciclo.pico, meseta, peepTot: peepTotMed, autoPeep: peepTotMed != null ? Math.max(0, peepTotMed - r.peep) : null,
      // las cifras «reales» del modelo (sin maniobra): para las pruebas y para el dibujo del alvéolo
      palvFinInsp: ciclo.palvFinInsp, palvFinEsp: peepTot, autoPeepReal: autoPeep,
      pres: ciclo.pico - ciclo.palvFinInsp,
      // Cstat y presión de conducción: con la PEEP total si se ocluyó; si no, con la aplicada (y se rotula así)
      cstat: meseta != null && meseta > (peepTotMed ?? r.peep) ? Math.max(0, vtExh - C_TUBULADURA * (meseta - (peepTotMed ?? r.peep))) / (meseta - (peepTotMed ?? r.peep)) : null,
      dp: meseta != null ? meseta - (peepTotMed ?? r.peep) : null, conPeepTotal: peepTotMed != null,
      vtIns: ciclo.vtIns, vtExh, vm: vtExh * (psv() ? r.frEsp : r.fr) / 1000, flujoFinEsp: ciclo.flujoFinEsp,
      pMedia: ciclo.nPaw ? ciclo.sumaPaw / ciclo.nPaw : 0,
      ti, te, ie: te / ti, vAtrapado: Math.max(0, ciclo.vFinEsp - reposo()),
      // el racimo: cuántas unidades se abrieron y se cerraron en este ciclo (atelectrauma) y cuántas quedan abiertas
      unidades: U.map((x, i) => ({ abierta: x.abierta, abreCierra: x.abrio && x.cerro, sobre: ciclo.palvFinInsp > perfil.unidades[i].pSob })),
      nAbreCierra: U.filter((x) => x.abrio && x.cerro).length, nAbiertas: U.filter((x) => x.abierta).length,
      // constante de tiempo (LA2 pdf 50-51): τ = R · C; cuántas τ caben en la espiración
      tauInsp: tau(Ri(), C()), tauEsp: tau(Re(), C()), teTau: te / tau(Re(), C()),
      // «combinación no fisiológica»: la inspiración no deja sitio a la espiración en el ciclo
      cabe: psv() ? true : ti + 0.2 <= 60 / r.fr,
      // la alarma de presión del respirador (pmax): en VCV corta la insuflación y el Vt no se entrega entero
      alarmaPresion: alarma,
      // FR real: si la inspiración no deja sitio, tiempos() fija la espiración en 0,2 s y el ciclo se alarga
      frReal: psv() ? 60 / tCiclo : 60 / (ti + te),
      // PSV: flujo pico, flujo al ciclar (fracción del pico) y esfuerzo de disparo de esta respiración (variación con semilla fija)
      psv: psv() ? { qPico: qPico * 60 / 1000, qCiclo: qPico > 0 ? qFin / qPico : null, disparo: dip, ps: r.ps } : null,
    };
    U.forEach((x) => { x.abrio = false; x.cerro = false; });
    Object.assign(ciclo, { pico: 0, mesetaMedida: null, peepTotMedida: null, vtIns: 0, sumaPaw: 0, nPaw: 0 }); alarma = false;
  }
  // Fin de un ciclo: se cierra la lectura, entran los mandos pedidos y empieza la inspiración siguiente
  function empezar() { cerrarCiclo(); Object.assign(A, S.resp); fase = 'insp'; tFase = 0; tCiclo = 0; qPico = 0; }
  // Histéresis: se abre al llegar a su presión de apertura y se cierra por debajo de la de cierre (más baja). Al abrirse, el volumen
  // se conserva (el aire sale de las demás: la presión cae); al cerrarse, su aire se exhala (V baja y la presión es continua).
  function racimo(p) {
    if (perfil.lineal) return;
    let cambio = false;
    perfil.unidades.forEach((un, i) => {
      const x = U[i]; if (un.pCi < -90) return;
      if (!x.abierta && p >= un.pAp) { x.abierta = true; x.abrio = true; x.pMax = p; }
      else if (x.abierta && p < un.pCi) { x.abierta = false; x.cerro = true; x.eff = 0; cambio = true; }
      if (x.abierta) { x.pMax = Math.max(x.pMax, p); x.eff = pesoApertura(un, x.pMax); }
    });
    if (cambio) V = Math.min(V, volumenRacimo(perfil, U, S.pulmon.c, p));
  }
  function paso(dt) {
    const r = A, { ti, tp, te, T } = tiempos();
    racimo(palv());
    const pa = palv();
    if (r.modo !== 'psv') esfuerzoPaso();
    if (fase === 'insp') {
      if (r.modo === 'vcv') { q = r.flujo * 1000 / 60; V += q * dt; paw = palv() + Ri() * q / 1000 - (asist() ? pm : 0); }
      else if (r.modo === 'psv') { paw = r.peep + r.ps; if (paw > (r.pmax ?? 40)) { paw = r.pmax ?? 40; alarma = true; } pm = (r.pmus || 0) > 0 ? r.pmus * sen2(tFase / (r.tin || 1)) : 0; q = Math.max(0, (paw - pa + pm) / Ri() * 1000); V += q * dt; if (q > qPico) qPico = q; }
      else { paw = r.peep + r.pinsp; if (paw > (r.pmax ?? 40)) { paw = r.pmax ?? 40; alarma = true; } q = Math.max(0, (paw - pa) / Ri() * 1000); V += q * dt; }   // PCV: el respirador no pasa de pmax (limita la presión; el tiempo inspiratorio sigue)
      ciclo.vtIns += q * dt; if (breath && breath.t1 == null && asist()) breath.vt += q * dt;
      if (paw > ciclo.pico) ciclo.pico = paw;
      const pmax = r.pmax ?? 40, corta = r.modo === 'vcv' && paw > pmax;
      if (corta) { alarma = true; ciclo.pico = asist() ? pmax : Math.max(pmax, palv()); }   // con esfuerzo del paciente, la Paw medida es la que el respirador limita (pmax); la palv incluye el empuje del paciente
      // PSV: la insuflación acaba cuando el flujo cae al 25 % del pico (M22 pdf 78); el Ti lo decide el paciente
      const fin = r.modo === 'psv' ? (tFase >= 0.05 && q <= PSV.ciclado * qPico) || tFase >= TI_MAX_PSV : tFase >= ti || corta;
      if (fin) { if (breath && breath.t1 == null) breath.t1 = t; qFin = q; tiMed = tFase; ciclo.palvFinInsp = palv(); ciclo.vFinInsp = V; fase = tp ? 'pausa' : 'esp'; tFase = 0; }
    } else if (fase === 'pausa') {
      q = 0; paw += (pa - paw) * (1 - Math.exp(-dt / TAU_VALVULA));
      if (tFase >= tp) { ciclo.mesetaMedida = pa; fase = 'esp'; tFase = 0; }
    } else if (fase === 'esp') {
      pm = r.modo === 'psv' ? 0 : pm;
      const as = asist();
      if (as) { const qL = (pm - (pa - r.peep)) / (Re() + RC_DISPARO); q = qL * 1000; paw = r.peep - RC_DISPARO * qL; V = Math.max(0, V + q * dt); }
      else { paw += (r.peep - paw) * (1 - Math.exp(-dt / TAU_VALVULA)); q = pa > r.peep ? -(pa - r.peep) / Re() * 1000 : 0; V = Math.max(0, V + q * dt); }
      if (as && r.peep - paw >= UMBRAL_DISPARO && tFase >= T_REFRACTARIO) {
        ciclo.palvFinEsp = palv(); ciclo.vFinEsp = V; ciclo.flujoFinEsp = q * 60 / 1000;
        // segundo disparo del mismo esfuerzo (doble disparo): los dos volúmenes se apilan en el mismo ciclo, sin espiración entre ambos
        if (esf && esf.disp > 0) { fase = 'insp'; tFase = 0; } else empezar();
        registrar('esfuerzo');
      } else if (r.modo === 'psv') {
        // el paciente dispara cuando le toca su ritmo; el esfuerzo (−2 a −3 cmH₂O) y su tiempo varían un poco, con semilla fija (ilustrativo)
        if (tCiclo >= T - T_DISPARO * 1.2) {
          ciclo.palvFinEsp = palv(); ciclo.vFinEsp = V; ciclo.flujoFinEsp = q * 60 / 1000;
          dip = PSV.disparoMin + (PSV.disparoMax - PSV.disparoMin) * rnd(); tDisp = T_DISPARO * (0.8 + 0.4 * rnd()); fase = 'disparo'; tFase = 0;
        }
      } else if (tFase >= te) {
        ciclo.palvFinEsp = palv(); ciclo.vFinEsp = V; ciclo.flujoFinEsp = q * 60 / 1000;
        if (man().oclusion) { fase = 'oclusion'; tFase = 0; } else { empezar(); if (as) registrar('tiempo'); }
      }
    } else if (fase === 'disparo') {
      // el esfuerzo del paciente baja la presión de la vía aérea por debajo de la PEEP; al llegar al umbral, la válvula se abre
      paw = r.peep - dip * Math.min(1, tFase / tDisp);
      q = pa > r.peep ? -(pa - r.peep) / Re() * 1000 : 0; V = Math.max(0, V + q * dt);
      if (tFase >= tDisp) empezar();
    } else if (fase === 'oclusion') {
      q = 0; paw += (pa - paw) * (1 - Math.exp(-dt / TAU_VALVULA));
      if (tFase >= T_OCLUSION) { ciclo.peepTotMedida = pa; empezar(); }
    }
    ciclo.sumaPaw += paw; ciclo.nPaw++;
    t += dt; tFase += dt; tCiclo += dt;
  }
  return {
    paso, S,
    get t() { return t; }, get fase() { return fase; }, get paw() { return paw; }, get palv() { return palv(); },
    get pmus() { return pm; },                                      // esfuerzo del paciente ahora (cmH₂O, + inspiratorio)
    get disparo() { const d = disp; disp = false; return d; },        // true una vez por cada insuflación que dispara el paciente
    get asinc() { return ultimoEsf; },                               // el último esfuerzo clasificado: { tipo, vt, valle, disparos, a }
    get ventilaciones() { return ventilaciones; }, get esfuerzos() { return esfuerzos; },
    get unidades() { return U; },                                  // el racimo: { abierta, eff, abrio, cerro } por unidad
    get flujo() { return q * 60 / 1000; },                       // L/min (+ inspiratorio, − espiratorio)
    get vol() { return Math.max(0, V - reposo()); },                      // mL por encima del reposo a la PEEP activa
    get volAbs() { return V; },
    get activo() { return A; },
    // duración del ciclo de este momento (s): lo que la página necesita para llenar la pantalla
    duracion() { const { T, tp } = tiempos(); return T + tp + (man().oclusion ? T_OCLUSION : 0); },
    // mandos pedidos que aún no han entrado (entran al empezar la respiración siguiente)
    pendientes() { return Object.keys(S.resp).filter((k) => S.resp[k] !== A[k]); },
    lectura: () => ultimo,
    ajustar(o) { Object.assign(S.resp, o); },                    // entra en la respiración siguiente
    ajustarYa(o) { Object.assign(S.resp, o); Object.assign(A, o); },
    pulmonAjustar(o) {
      // al cambiar C, el volumen se reescala para conservar la presión alveolar (V = C · Palv): sin esto Palv = V/C salta de golpe
      if (o.c != null && o.c !== S.pulmon.c && S.pulmon.c > 0) V *= o.c / S.pulmon.c;
      Object.assign(S.pulmon, o);
      if (o.racimo != null && perfilRacimo(o.racimo) !== perfil) { perfil = perfilRacimo(o.racimo); U = estadoInicial(perfil, A.peep); V = reposo(); }   // otro pulmón: reposo a la PEEP
    }, maniobra(o) { Object.assign(S.man, o); },
  };
}

// Corre varios ciclos (hasta el estado estable) y devuelve las curvas de la ventana final y la lectura del último ciclo.
export function simular(resp, pulmon, maniobras = {}, { ciclos = 10, dt = 0.005, ventana = 12 } = {}) {
  const p = crearPulmon(resp, pulmon, maniobras);
  const psvM = resp.modo === 'psv', T = 60 / (psvM ? resp.frEsp : resp.fr) + (!psvM && maniobras.oclusion ? T_OCLUSION : 0) + (!psvM && maniobras.pausa ? T_PAUSA : 0), total = ciclos * T;
  const t = [], paw = [], flujo = [], vol = [], fase = [], palv = [];
  for (let tt = 0; tt < total; tt += dt) {
    p.paso(dt);
    if (tt >= total - ventana) { t.push(Math.round((tt - (total - ventana)) * 1000) / 1000); paw.push(p.paw); flujo.push(p.flujo); vol.push(p.vol); fase.push(p.fase); palv.push(p.palv); }
  }
  return { t, paw, flujo, vol, fase, palv, lectura: p.lectura() };
}

// Aviso de ajuste imposible (no recorta el modelo): volumen por kg de peso ideal y volumen minuto.
//  · Vt > 8 mL/kg PBW: por encima del protocolo protector (parte de 6 y baja hasta 4; Tabla 24.5, Marino cap. 24 p. 48).
//  · Vt > 12 mL/kg PBW o VM > 20 L/min: «combinación no fisiológica» (fisiología general).
export function avisosAjuste(l, kg) {
  const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
  const out = [], kgVt = l && l.vtExh != null ? Math.round(l.vtExh / kg * 10) / 10 : 0;
  if (kgVt > 8) out.push({ k: 'vtkg', txt: `Volumen por kg peligroso: ${f1(kgVt)} mL/kg de peso ideal. El protocolo protector parte de 6 y baja hasta 4 mL/kg (Tabla 24.5, Marino p. 48).${kgVt > 12 ? ' Combinación no fisiológica: un pulmón sano no tolera tanto (fisiología general).' : ''}` });
  if (l && l.vm != null && l.vm > 20) out.push({ k: 'vm', txt: `Combinación no fisiológica: volumen minuto de ${f1(l.vm)} L/min; por encima de 20 casi nadie lo mantiene (fisiología general).` });
  if (l && l.vm != null && l.vm < 2) out.push({ k: 'sinvent', txt: `Sin ventilación eficaz: Vt ${f1(l.vtExh)} mL y volumen minuto de ${f1(l.vm)} L/min (fisiología general).` });
  return out;
}
