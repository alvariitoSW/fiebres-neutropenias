// Motor de la circulación viva — modelo de compartimentos EN EL TIEMPO (paso 1).
// Puro: sin DOM. Se usa igual en node (pruebas) y en el navegador (escena).
//
// Lo que simula (fisiología general / ilustrativo — las cifras de las fichas
// se cotejan en los medidores, no aquí):
//   · 4 cámaras (AD, VD, AI, VI) con elastancia variable en el tiempo:
//       P = e(t)·Ees·(V−V0) + (1−e(t))·A·(exp(B·(V−V0))−1) + P_pericardio (+ tabique)
//   · 4 válvulas que abren y cierran por GRADIENTE de presión (nunca por reloj)
//   · pericardio con curva exponencial propia (el taponamiento sale de aquí)
//   · tabique compartido: interdependencia ventricular (coeficiente cruzado)
//   · aorta/arterias (elásticas), venas como reservorio con volumen sin tensión,
//     arteria pulmonar y venas pulmonares
//   · perfusión coronaria = PA diastólica − PTDVI (derivada por latido)
//   · válvula aórtica con INERCIA e impedancia característica de la aorta (windkessel de 3 elementos):
//     al final de la eyección la sangre frena y da un breve reflujo que cierra la válvula; ese reflujo
//     baja la presión de la raíz (incisura) y al cerrarse vuelve a subir (onda dícrota)
//   · BARORREFLEJO: la PAM filtrada se compara con su punto de consigna; el error mueve, cada uno con su
//     retraso, la FC (vagal, rápido), las resistencias, el volumen venoso sin tensión (venoconstricción)
//     y la contractilidad (simpático, lentos). Saturación con tanh. Todo ilustrativo.
// Integración de Euler explícito a 0,1 ms (estable con estas constantes de tiempo).

// Las 7 fases del ciclo de Wiggers (A-G), como en Fisiopatología UCI · Cardiología
export const FASES = {
  A: 'Contracción auricular', B: 'Contracción isovolumétrica', C: 'Eyección rápida', D: 'Eyección lenta',
  E: 'Relajación isovolumétrica', F: 'Llenado rápido', G: 'Diástasis',
};

export const BASE = {
  fc: 70,
  // cámaras: Ees sistólica (mmHg/mL), V0, A y B de la curva diastólica
  vi: { ees: 3.2,  v0: 10, a: 1.8, b: 0.017 },
  vd: { ees: 0.40, v0: 25, a: 2.0, b: 0.012 },
  ai: { ees: 0.70, v0: 5,  a: 0.20, b: 0.090 },
  ad: { ees: 0.70, v0: 5,  a: 0.15, b: 0.090 },
  // tiempos de activación (s). Las sístoles escalan con √(periodo).
  pr: 0.16, tsAur: 0.10, tsVen: 0.45,
  // pericardio: P = kPeri·exp((Vcorazón − v0Peri)/phiPeri); liquido = derrame extra
  kPeri: 0.1, v0Peri: 300, phiPeri: 40, liquidoPeri: 0,
  tabique: 0.05,            // fracción de la presión del otro ventrículo que se transmite
  // válvulas (mmHg·s/mL)
  rMitral: 0.005, rTricus: 0.005, rAortica: 0.004, rPulmonar: 0.004,
  // lecho sistémico (cAo/vuAo: aorta y grandes arterias, distal a la raíz)
  cAo: 1.5, vuAo: 700, rSis: 1.05, cVen: 160, vuVen: 2210, rRetorno: 0.02,
  // aorta proximal: impedancia característica (mmHg·s/mL), inercia del tracto de salida (mmHg·s²/mL)
  // y volumen de reflujo que cierra la válvula (mL)
  zAo: 0.03, lAo: 0.00025, vCierreAo: 1.5,
  // barorreflejo: consigna de PAM, constantes de tiempo (s) y ganancias máximas (fracción; + al bajar la PAM)
  barorreflejo: true, pamConsigna: 100, tauSensor: 2.0,
  baro: { fc: { tau: 1.5, sube: 0.9, baja: 0.35 }, r: { tau: 6, sube: 0.6, baja: 0.35 },
    vu: { tau: 10, sube: 0.25, baja: 0.08 }, ees: { tau: 6, sube: 0.45, baja: 0.25 } },
  // lecho pulmonar
  cAp: 4.0, vuAp: 100, rPul: 0.08, cVp: 8.0, vuVp: 200, rVp: 0.01,
  // volumen de sangre total (mL)
  vSangre: 4850,
  // transporte de O₂ (Fick, por latido)
  hb: 14, sao2: 0.97, pao2: 95, vo2: 250, sc: 1.85,
};

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// Activación en doble coseno: sube en t1, baja en t2 (0 fuera).
function activacion(t, t1, t2) {
  if (t < 0) return 0;
  if (t < t1) return 0.5 * (1 - Math.cos(Math.PI * t / t1));
  if (t < t1 + t2) return 0.5 * (1 + Math.cos(Math.PI * (t - t1) / t2));
  return 0;
}

export function crearMotor(ajustes = {}) {
  const p = { ...BASE, ...ajustes };
  for (const c of ['vi', 'vd', 'ai', 'ad']) p[c] = { ...BASE[c], ...(ajustes[c] || {}) };

  // Estado: volúmenes (mL) — la suma se conserva.
  const s = {
    t: 0, tLatido: 0,            // tiempo total y tiempo dentro del latido
    // arranca cerca del régimen estable (principio de un latido normal), para no esperar al asentamiento
    vad: 43, vvd: 110, vai: 46, vvi: 105,
    vao: 837, vven: 3294, vap: 151, vvp: 265, reflujoAo: 0,
    pad: 0, pvd: 0, pai: 0, pvi: 0, pao: 0, pven: 0, pap: 0, pvp: 0, pperi: 0,
    qMit: 0, qTri: 0, qAo: 0, qPul: 0, qSis: 0, qRet: 0, qPulm: 0, qVp: 0,
    vMit: false, vTri: false, vAo: false, vPul: false,
    nLatido: 0, fase: 'G', _aoAbrio: false, _aoCerro: false, _mitAbrio: false, _pviPrev: 0,
    // barorreflejo: PAM que "siente" el seno carotídeo y efecto de cada brazo (0 = sin cambio)
    pamSensor: null, efFc: 0, efR: 0, efVu: 0, efEes: 0, fc: p.fc, paoDist: 0,
  };
  const volTotal = () => s.vad + s.vvd + s.vai + s.vvi + s.vao + s.vven + s.vap + s.vvp;
  // Ajusta el total al volumen de sangre pedido repartiéndolo en las venas.
  s.vven += p.vSangre - volTotal();
  s.pamSensor = p.pamConsigna;

  let periodo = 60 / p.fc;
  // valores efectivos tras el barorreflejo (los de p son los basales que fija el usuario)
  const ef = { rSis: p.rSis, vuVen: p.vuVen, eesVi: p.vi.ees, eesVd: p.vd.ees };
  const acum = nuevoAcum();
  let ultimo = null;        // métricas del último latido completo
  let onda = [];            // muestras del latido en curso (cada 2 ms)
  let ondaUltima = [];
  let tMuestra = 0;

  function presionCamara(c, v, e, pperi, ees = c.ees) {
    const dv = v - c.v0;
    const sis = ees * dv;
    const dia = c.a * (Math.exp(c.b * dv) - 1);
    return e * sis + (1 - e) * dia + pperi;
  }

  function presiones() {
    const T = periodo, k = Math.sqrt(T / (60 / 70));
    const tl = s.tLatido;
    const eAur = activacion(tl, 0.5 * p.tsAur * k, 0.5 * p.tsAur * k);
    const eVen = activacion(tl - p.pr, 0.75 * p.tsVen * k, 0.25 * p.tsVen * k);
    s.eAur = eAur; s.eVen = eVen;
    const vCor = s.vad + s.vvd + s.vai + s.vvi + p.liquidoPeri;
    s.pperi = p.kPeri * Math.exp((vCor - p.v0Peri) / p.phiPeri);
    const pviLibre = presionCamara(p.vi, s.vvi, eVen, 0, ef.eesVi);
    const pvdLibre = presionCamara(p.vd, s.vvd, eVen, 0, ef.eesVd);
    // tabique: cada ventrículo "siente" una fracción de la presión del otro
    s.pvi = pviLibre + p.tabique * pvdLibre + s.pperi;
    s.pvd = pvdLibre + p.tabique * pviLibre + s.pperi;
    s.pai = presionCamara(p.ai, s.vai, eAur, s.pperi);
    s.pad = presionCamara(p.ad, s.vad, eAur, s.pperi);
    // s.paoDist: presión del depósito elástico; s.pao: la de la raíz (la que se mide y ve la válvula)
    s.paoDist = Math.max(0, (s.vao - p.vuAo) / p.cAo);
    s.pao = s.paoDist + p.zAo * s.qAo;
    s.pven = Math.max(0, (s.vven - ef.vuVen) / p.cVen);
    s.pap = Math.max(0, (s.vap - p.vuAp) / p.cAp);
    s.pvp = Math.max(0, (s.vvp - p.vuVp) / p.cVp);
  }

  function flujos(dt) {
    // válvulas: diodo por gradiente
    s.qTri = s.pad > s.pvd ? (s.pad - s.pvd) / p.rTricus : 0;
    s.qPul = s.pvd > s.pap ? (s.pvd - s.pap) / p.rPulmonar : 0;
    s.qMit = s.pai > s.pvi ? (s.pai - s.pvi) / p.rMitral : 0;
    // aórtica: abre por gradiente; abierta, el flujo tiene inercia y puede invertirse un instante;
    // cierra cuando el reflujo acumulado llega al volumen de cierre
    if (!s.vAo) { if (s.pvi > s.paoDist) { s.vAo = true; s.reflujoAo = 0; } }
    if (s.vAo) {
      s.qAo += (s.pvi - s.paoDist - (p.rAortica + p.zAo) * s.qAo) / p.lAo * dt;
      if (s.qAo < 0) { s.reflujoAo -= s.qAo * dt; if (s.reflujoAo > p.vCierreAo) { s.vAo = false; s.qAo = 0; } }
    }
    s.pao = s.paoDist + p.zAo * s.qAo;
    s.vTri = s.qTri > 0; s.vPul = s.qPul > 0; s.vMit = s.qMit > 0;
    // lechos (pueden invertirse si la aurícula supera a la vena: onda v)
    s.qSis = (s.paoDist - s.pven) / ef.rSis;
    s.qRet = (s.pven - s.pad) / p.rRetorno;
    s.qPulm = (s.pap - s.pvp) / p.rPul;
    s.qVp = (s.pvp - s.pai) / p.rVp;
  }

  // Barorreflejo: filtro del sensor y de cada brazo efector (primer orden) con saturación tanh
  function barorreflejo(dt) {
    s.pamSensor += (s.pao - s.pamSensor) * dt / p.tauSensor;
    const err = p.barorreflejo ? (p.pamConsigna - s.pamSensor) / p.pamConsigna : 0;   // + si la PA baja
    const brazo = (g, actual) => { const obj = err >= 0 ? g.sube * Math.tanh(err / (0.35 * g.sube) ) : g.baja * Math.tanh(err / (0.35 * g.baja));
      return actual + (obj - actual) * dt / g.tau; };
    const b = p.baro;
    s.efFc = brazo(b.fc, s.efFc); s.efR = brazo(b.r, s.efR); s.efVu = brazo(b.vu, s.efVu); s.efEes = brazo(b.ees, s.efEes);
    ef.rSis = p.rSis * (1 + s.efR); ef.vuVen = p.vuVen * (1 - s.efVu);
    ef.eesVi = p.vi.ees * (1 + s.efEes); ef.eesVd = p.vd.ees * (1 + s.efEes);
    s.fc = clamp(p.fc * (1 + s.efFc), 35, 190);
  }

  function paso(dt = 0.0001) {
    barorreflejo(dt);
    presiones();
    flujos(dt);       // el flujo aórtico (con inercia) se actualiza antes que los volúmenes: Euler semiimplícito
    s.vad += (s.qRet - s.qTri) * dt;
    s.vvd += (s.qTri - s.qPul) * dt;
    s.vap += (s.qPul - s.qPulm) * dt;
    s.vvp += (s.qPulm - s.qVp) * dt;
    s.vai += (s.qVp - s.qMit) * dt;
    s.vvi += (s.qMit - s.qAo) * dt;
    s.vao += (s.qAo - s.qSis) * dt;
    s.vven += (s.qSis - s.qRet) * dt;
    s.t += dt; s.tLatido += dt;
    fase();
    acumular(dt);
    if (s.t >= tMuestra) { onda.push(muestra()); tMuestra += 0.002; }
    if (s.tLatido >= periodo) {
      s.tLatido -= periodo;
      s._aoAbrio = s._aoCerro = s._mitAbrio = s._picoLlenado = false;
      ultimo = cerrarLatido();
      ondaUltima = onda; onda = [];
      s.nLatido++;
      periodo = 60 / s.fc;   // la FC cambia entre latidos (barorreflejo, o la que fije el usuario)
    }
  }

  // A hasta que empieza la activación ventricular; B hasta que abre la aórtica; C mientras sube la
  // presión del VI y D cuando ya baja; E hasta que abre la mitral; F mientras el llenado es rápido; G después.
  function fase() {
    if (s.vAo) s._aoAbrio = true;
    if (s._aoAbrio && !s.vAo) s._aoCerro = true;
    if (s._aoCerro && s.vMit) s._mitAbrio = true;
    let f;
    if (!s._aoAbrio) f = s.tLatido < p.pr ? 'A' : 'B';
    else if (!s._aoCerro) f = s.pvi >= s._pviPrev ? 'C' : 'D';
    else if (!s._mitAbrio) f = 'E';
    else { if (s.qMit > 120) s._picoLlenado = true; f = (!s._picoLlenado || s.qMit > 120) ? 'F' : 'G'; }
    // C → D solo una vez por latido (el pico de presión del VI)
    if (s.fase === 'D' && f === 'C') f = 'D';
    s.fase = f; s._pviPrev = s.pvi;
  }

  function muestra() {
    return {
      t: +s.tLatido.toFixed(4), pvi: s.pvi, pai: s.pai, pao: s.pao, vvi: s.vvi,
      pvd: s.pvd, pad: s.pad, pap: s.pap, vvd: s.vvd, vai: s.vai, vad: s.vad,
      qAo: s.qAo, qMit: s.qMit, qPul: s.qPul, qTri: s.qTri, pven: s.pven, pvp: s.pvp,
      pperi: s.pperi, eVen: s.eVen, eAur: s.eAur, fase: s.fase,
      vMit: s.vMit, vAo: s.vAo, vTri: s.vTri, vPul: s.vPul,
    };
  }

  function nuevoAcum() {
    return { dt: 0, pao: 0, pad: 0, pai: 0, pap: 0, pven: 0, pvp: 0, qAo: 0, qPul: 0,
      paoMax: -1, paoMin: 1e9, papMax: -1, papMin: 1e9, pviMax: -1, pvdMax: -1,
      vviMax: -1, vviMin: 1e9, vvdMax: -1, vvdMin: 1e9, padMax: -1, paiMax: -1,
      pviEnMitralCierre: null, ultimoMit: false, ultimoAo: false, ultimoPul: false, ultimoTri: false,
      tS1: null, tS2: null, tS2p: null, tAoAbre: null, tMitAbre: null, tTriCierra: null, tPulAbre: null,
      paoDiaEnCierreMit: null, pperi: 0 };
  }
  function acumular(dt) {
    const a = acum;
    a.dt += dt; a.pao += s.pao * dt; a.pad += s.pad * dt; a.pai += s.pai * dt; a.pap += s.pap * dt;
    a.pven += s.pven * dt; a.pvp += s.pvp * dt; a.qAo += s.qAo * dt; a.qPul += s.qPul * dt; a.pperi += s.pperi * dt;
    a.paoMax = Math.max(a.paoMax, s.pao); a.paoMin = Math.min(a.paoMin, s.pao);
    a.papMax = Math.max(a.papMax, s.pap); a.papMin = Math.min(a.papMin, s.pap);
    a.pviMax = Math.max(a.pviMax, s.pvi); a.pvdMax = Math.max(a.pvdMax, s.pvd);
    a.vviMax = Math.max(a.vviMax, s.vvi); a.vviMin = Math.min(a.vviMin, s.vvi);
    a.vvdMax = Math.max(a.vvdMax, s.vvd); a.vvdMin = Math.min(a.vvdMin, s.vvd);
    a.padMax = Math.max(a.padMax, s.pad); a.paiMax = Math.max(a.paiMax, s.pai);
    // tonos y aperturas: transiciones de las válvulas
    const sis = s.eVen > 0;
    if (sis && a.tS1 == null && s.pvi - s.pai > 0.5) { a.tS1 = s.tLatido; a.pviEnMitralCierre = s.pvi; }
    if (!a.ultimoMit && s.vMit && a.tS2 != null && a.tMitAbre == null) a.tMitAbre = s.tLatido;
    if (!a.ultimoAo && s.vAo && a.tAoAbre == null) a.tAoAbre = s.tLatido;
    if (a.ultimoAo && !s.vAo && a.tAoAbre != null) a.tS2 = s.tLatido;
    if (a.ultimoPul && !s.vPul && a.tPulAbre != null) a.tS2p = s.tLatido;
    if (!a.ultimoPul && s.vPul && a.tPulAbre == null) a.tPulAbre = s.tLatido;
    if (sis && a.tTriCierra == null && s.pvd - s.pad > 0.5) a.tTriCierra = s.tLatido;
    a.ultimoMit = s.vMit; a.ultimoAo = s.vAo; a.ultimoPul = s.vPul; a.ultimoTri = s.vTri;
  }
  function cerrarLatido() {
    const a = acum, T = a.dt;
    const vs = a.qAo, vsD = a.qPul;
    const fcLatido = 60 / T, gc = vs * fcLatido / 1000;
    const m = {
      fc: fcLatido, periodo: T,
      pas: a.paoMax, pad_: a.paoMin, pam: a.pao / T,
      pvc: a.pad / T, pcp: a.pai / T,
      paps: a.papMax, papd: a.papMin, papm: a.pap / T,
      pvi_max: a.pviMax, pvd_max: a.pvdMax,
      edv: a.vviMax, esv: a.vviMin, vs, fe: vs / a.vviMax,
      edvD: a.vvdMax, esvD: a.vvdMin, vsD, feD: vsD / a.vvdMax,
      ptdvi: a.pviEnMitralCierre,       // presión al cerrar la mitral ≈ PTDVI
      gc, ic: gc / p.sc,
      rvs: (a.pao / T - a.pad / T) / gc * 80,     // dyn·s·cm⁻⁵
      rvp: (a.pap / T - a.pai / T) / gc * 80,
      pven: a.pven / T, pvp: a.pvp / T, pperi: a.pperi / T,
      ppc: a.paoMin - (a.pviEnMitralCierre ?? 0),  // presión de perfusión coronaria
      tS1: a.tS1, tS2: a.tS2, tS2p: a.tS2p, tAoAbre: a.tAoAbre, tMitAbre: a.tMitAbre,
      tPulAbre: a.tPulAbre, tTriCierra: a.tTriCierra,
      // volumen comprometido total y presión media de llenado sistémico (referencia Guyton)
      vEstresado: (s.vao - p.vuAo) + (s.vven - ef.vuVen) + (s.vap - p.vuAp) + (s.vvp - p.vuVp),
      pmls: ((s.vven - ef.vuVen) + (s.vao - p.vuAo)) / (p.cVen + p.cAo),
      vTotal: volTotal(),
      // estado del barorreflejo al cerrar el latido (fracción de cambio sobre lo basal)
      baro: { fc: s.efFc, r: s.efR, vu: s.efVu, ees: s.efEes, sensor: s.pamSensor },
    };
    // Fick
    const cao2 = 1.34 * p.hb * p.sao2 + 0.003 * p.pao2;
    m.do2 = gc * cao2 * 10; m.do2i = m.do2 / p.sc;
    m.vo2 = Math.min(p.vo2, m.do2 * 0.7); m.er = m.vo2 / m.do2;
    m.svo2 = p.sao2 * (1 - m.er);
    Object.assign(acum, nuevoAcum());
    return m;
  }

  function correr(segundos, dt = 0.0001) {
    const n = Math.round(segundos / dt);
    for (let i = 0; i < n; i++) paso(dt);
    return ultimo;
  }

  return { p, s, ef, paso, correr, get ultimo() { return ultimo; }, get onda() { return ondaUltima; } };
}
