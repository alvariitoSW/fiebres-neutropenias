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
//   · LÍQUIDOS que entran y salen de la sangre (para que la gravedad de un shock no rompa el motor): venas que no se
//     vacían de golpe (codo), relleno transcapilar, edema de pulmón y derrame que entra a su ritmo. Ver BASE
// Integración de Euler explícito a 0,1 ms (estable con estas constantes de tiempo).

// Las 7 fases del ciclo de Wiggers (A-G), como en Fisiopatología UCI · Cardiología
export const FASES = {
  A: 'Contracción auricular', B: 'Contracción isovolumétrica', C: 'Eyección rápida', D: 'Eyección lenta',
  E: 'Relajación isovolumétrica', F: 'Llenado rápido', G: 'Diástasis',
};

export const BASE = {
  fc: 70,
  // cámaras: Ees sistólica (mmHg/mL), V0, A y B de la curva diastólica
  vi: { ees: 3.1,  v0: 10, a: 1.8, b: 0.017 },
  // VD: a 2,0 → 1,9 (calibración del 20/10/2026, con la AD, vuVen y rRetorno: su presión telediastólica tiene que bajar
  // con la PVC, porque el catéter las lee iguales, #mar-termodilucion). Ilustrativo
  vd: { ees: 0.50, v0: 25, a: 1.9, b: 0.012 },
  ai: { ees: 0.70, v0: 5,  a: 0.20, b: 0.090 },
  // AD: reservorio más distensible (a 0,15 → 0,13; b 0,090 → 0,080; calibración del 20/10/2026, ilustrativo). Con la
  // curva de antes, la AD se llenaba en la sístole ventricular hasta la presión de las venas y el retorno se paraba: la
  // meseta de ~6,5 mmHg de toda la sístole subía la PVC media a 5,02 (Tabla 8.1 de Marino: 0-5). Ahora, 4,19. Más baja
  // no cabe sin sacar la VD sistólica de 20-25 (Ficha 5) o pasar de 40 mmHg las venas pulmonares en la hipertrofia con
  // 1,5 L y EPP (pruebas/maniobras.test.mjs, paciente posible)
  ad: { ees: 0.70, v0: 5,  a: 0.13, b: 0.080 },
  // tiempos de activación (s). Las sístoles escalan con √(periodo).
  pr: 0.16, tsAur: 0.10, tsVen: 0.45, fSubida: 0.62, qSubida: 0.55,
  // relajación del VI: multiplica la constante de tiempo de la cola exponencial de su activación (1 = normal; >1 =
  // relajación lenta, como en la disfunción diastólica). Ver activacionVi
  relajacion: 1,
  // pericardio: P = kPeri·exp((Vcorazón − v0Peri)/phiPeri); liquido = derrame extra
  kPeri: 0.1, v0Peri: 300, phiPeri: 40, liquidoPeri: 0,
  tabique: 0.05,            // fracción de la presión del otro ventrículo que se transmite
  // válvulas (mmHg·s/mL)
  rMitral: 0.005, rTricus: 0.005, rAortica: 0.004, rPulmonar: 0.004,
  // inercia de la sangre que cruza la mitral (mmHg·s²/mL; 0 = sin inercia). Sin ella, el flujo seguía al gradiente al
  // instante y la onda E se cortaba en ~115 ms (TDE corto); con ella la E decelera como en el corazón real (Thomas y
  // Weyman: el TDE depende de la inercia y de la rigidez del VI). Valor ilustrativo, calibrado a E/A 1-1,5 y TDE 140-250
  lMit: 0.0005,
  // insuficiencia mitral: orificio regurgitante efectivo (cm²). 0 = válvula competente. El chorro sigue la
  // ecuación del orificio con Bernoulli simplificado: v (m/s) = √(ΔP/4) → Q (mL/s) = EROA · 50 · √ΔP
  eroaMitral: 0,
  // estenosis aórtica: área efectiva del orificio (cm²; 0 = válvula normal, sin término de Bernoulli) y diámetro de
  // la aorta ascendente (cm), del que depende la recuperación de presión. En la vena contracta cae 4v² (v = Q ÷ área);
  // pasado el orificio, el chorro frena y recupera 4v² · 2r(1 − r), con r = área ÷ área de la aorta (Baumgartner 2017)
  areaAortica: 0, dAorta: 3.0,
  // lecho sistémico (cAo/vuAo: aorta y grandes arterias, distal a la raíz)
  // (calibración del 20/10/2026, con la AD y el VD: vuVen 2210 → 2300 y rRetorno 0,02 → 0,025, para que la Pms siga
  // en ~7, el gradiente Pms − PVC del normal pase de ~2,5 a ~2,9 mmHg y el resto de cifras del normal no cambie. Ilustrativo)
  cAo: 1.5, vuAo: 700, rSis: 1.05, cVen: 160, vuVen: 2300, rRetorno: 0.025,
  // CODO DE LAS VENAS (mmHg). El volumen sin tensión no es un umbral: al vaciarse, las venas se colapsan poco a poco y su
  // retroceso elástico sigue empujando. Por encima del codo, P = (V − Vu)/C (la recta de siempre); por debajo, la presión
  // cae en exponencial, con la misma pendiente en el codo (sin salto), y nunca llega a 0: parte del volumen «sin tensión»
  // se recluta al vaciarse. Antes era max(0, …): con una hemorragia mayor que el volumen con tensión más lo que recluta el
  // barorreflejo, la presión venosa era 0 exacto y el retorno se paraba de golpe (2 L → PAM 11). La forma curva cerca de
  // 0 es fisiología general (la recta solo extrapola el volumen sin tensión); el codo, ilustrativo. No toca el normal
  // (venas a ~6,4 mmHg) y apenas la hemorragia de 1 L (~3,4 → 3,6 mmHg)
  codoVen: 5,
  // RELLENO TRANSCAPILAR: «la caída de la presión mueve líquido intersticial a la sangre; puede añadir hasta un litro al
  // plasma» (Marino, cap. 15, p. 21, docs/marino-2024-shock-caps14-17.pdf#page=21). Lo mueve la caída de la presión capilar
  // (fisiología general, Starling): pCap = pven + (P arterial − pven) · rPost / rSis efectiva, con la resistencia
  // poscapilar fija (fCap de la basal), así que la vasoconstricción precapilar y la PA baja la bajan. El volumen que entra
  // tiende a rellenoMax · tanh(cInt · caída / rellenoMax) (tope de la fuente) con la constante de tiempo tauRelleno.
  // pCap0: presión capilar funcional normal, ~17 mmHg (fisiología general); el modelo normal da ~17,4, así que en reposo
  // no entra nada. cInt y tauRelleno son ilustrativos: la fuente da el tope, no el ritmo; que el Hto tarde 8-12 h en bajar
  // (p. 23) dice que es lento, así que en los segundos que se ven en pantalla apenas cuenta
  rellenoMax: 1000, cInt: 100, tauRelleno: 1200, fCap: 0.12, pCap0: 17,
  // DERRAME: ritmo al que entra el líquido en el saco (mL/s, ilustrativo). Antes entraba entero en un instante y, con la
  // curva exponencial del pericardio, 550 mL daban ~10⁵ mmHg en el primer paso: volúmenes negativos y NaN. p.liquidoPeri
  // es el derrame pedido; s.liquidoPeri, el que ya hay (el que aprieta y el que se dibuja). Y el líquido solo entra mientras
  // la presión del saco está por debajo de la que lo empuja (pFuenteDerrame, la capilar, ~25 mmHg, ilustrativo; frena en
  // los últimos 5 mmHg): sin eso, 600 mL agudos cabían en el saco a ~180 mmHg con las cámaras a volumen negativo
  ritmoDerrame: 40, pFuenteDerrame: 25,
  // HEMORRAGIA: p.hemorragia es la sangre perdida pedida (mL) y s.perdido la que ya se ha ido, a ritmoHemorragia mL/s
  // (ilustrativo). Perder el 42 % de la volemia en un instante no le pasa a nadie: la PAM caía a 28 en los primeros
  // segundos, antes de que el barorreflejo respondiera. Si el mando baja, la sangre vuelve (una transfusión)
  hemorragia: 0, ritmoHemorragia: 80,
  // CONTRACTILIDAD: la Ees de cada ventrículo sigue a la pedida (p.vi.ees, p.vd.ees) con esta constante de tiempo (s). Un
  // miocardio que deja de recibir sangre pierde la contracción en segundos, no en un instante (fisiología general; el
  // número, ilustrativo). Antes, bajar la Ees del VI de 3,1 a 0,3 de golpe dejaba dos latidos sin eyección (GC 0,
  // RVS infinita, SvO₂ NaN) y la PAM caía a 36 antes de que el barorreflejo respondiera
  tauContractilidad: 4,
  // EDEMA DE PULMÓN: por encima de pEdema mmHg en las venas pulmonares (≈ capilar pulmonar) sale líquido de los vasos al
  // pulmón, kEdema mL/s por cada mmHg de más, y no vuelve (en minutos-horas, fuera de lo que se simula). Sin esta salida, al
  // fallar el VI la sangre se acumulaba en el pulmón sin límite: con Ees 0,45 la PCP llegaba a 41 mmHg con la PAM en 81,
  // y no había shock cardiogénico posible con una PCP humana. Que el edema empiece cuando la presión capilar supera a la
  // oncótica del plasma (~25 mmHg) es fisiología general; la ficha pide no pasar de 18-20 mmHg para no producirlo
  // (Marino, cap. 18), que es donde empieza a verse. El ritmo, ilustrativo
  kEdema: 5, pEdema: 28,
  // aorta proximal: impedancia característica (mmHg·s/mL), inercia del tracto de salida (mmHg·s²/mL)
  // y volumen de reflujo que cierra la válvula (mL)
  zAo: 0.03, lAo: 0.00025, vCierreAo: 1.5,
  // efecto de la eyección (s/mL): resistencia interna del VI proporcional a su presión (Shroff), fisiología general.
  // Con 0 el flujo aórtico pica a los ~40 ms con ~850 mL/s; con 0,001, a ~90 ms con ~400 mL/s (tiempo de
  // aceleración y cociente pico/media ~1,6 de un tracto de salida normal). Valor ilustrativo, calibrado a eso
  kEyec: 0.001,
  // tracto de salida del VD: el mismo efecto de la eyección (kEyecVd) e inercia de la sangre que cruza la pulmonar
  // (lPul, mmHg·s²/mL). Sin ellos, el flujo pulmonar picaba a los ~20 ms con ~660 mL/s; con ellos, a ~140 ms con
  // ~320 mL/s, en una eyección de ~340 ms (tiempo de aceleración normal del TSVD >105 ms: Mukherjee 2025, en Atlas · 14).
  // Con ellos el VD pierde algo de presión, así que su Ees sube de 0,40 a 0,50 para seguir en 20-25 mmHg (Ficha 5).
  // Valores ilustrativos, calibrados a eso
  kEyecVd: 0.002, lPul: 0.002,
  // duración de la sístole del VD respecto a la del VI (1 = igual). En la sobrecarga de presión crónica el VD se
  // contrae más tiempo que el VI (asincronía interventricular; fisiología general): su presión sigue alta cuando el VI
  // ya se relaja y el tabique se aplana al final de la sístole. Ver Atlas · 14
  durVd: 1,
  // insuficiencia tricuspídea: orificio regurgitante efectivo (cm²), igual que eroaMitral. 0 = competente
  eroaTricus: 0,
  // barorreflejo: consigna de PAM, constantes de tiempo (s) y ganancias máximas (fracción; + al bajar la PAM)
  barorreflejo: true, pamConsigna: 100, tauSensor: 2.0,
  // (gravedad del shock, octubre 2026; la pendiente cerca de la consigna, 1/0,35, no cambia, así que las compensaciones
  // pequeñas son las de antes. Lo que cambia es el techo:)
  //  · resistencias: techo +60 % → +15 %. Lo que cuenta es la cifra absoluta: la RVS basal del modelo ya es 1.488 (la
  //    Ficha 5 da 900-1.200; calibración pendiente en el README) y +60 % la llevaba a ~2.300. Con PAM − PVC = IC · SC ·
  //    RVS / 80, un shock a fondo con PAM 55-60 tenía entonces un IC ~1,0 (y el taponamiento, con la PVC ~12, menos):
  //    ningún escenario llegaba a shock con un gasto humano (IC ≥1,2). Con +15 %, techo ~1.700 dyn·s·cm⁻⁵
  //  Ilustrativo, como todo el barorreflejo
  baro: { fc: { tau: 1.5, sube: 0.9, baja: 0.35 }, r: { tau: 6, sube: 0.15, baja: 0.35 },
    vu: { tau: 10, sube: 0.25, baja: 0.08 }, ees: { tau: 6, sube: 0.45, baja: 0.25 } },
  // lecho pulmonar
  // (codoPul: el mismo codo de las venas sistémicas en la arteria y las venas pulmonares, que en la hemorragia grave también
  // se vacían por debajo de su volumen sin tensión; ilustrativo)
  cAp: 4.0, vuAp: 100, rPul: 0.08, cVp: 8.0, vuVp: 200, rVp: 0.01, codoPul: 3,
  // volumen de sangre total (mL)
  vSangre: 4850,
  // transporte de O₂ (Fick, por latido)
  hb: 14, sao2: 0.97, pao2: 95, vo2: 250, sc: 1.85,
};

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
// Recta con codo: x por encima del codo; por debajo, exponencial con el mismo valor y la misma pendiente en el codo
// (continua y derivable), siempre > 0. Ver codoVen
const VCOLAPSO = 3, KCOLAPSO = 2;
// x se acerca a objetivo como mucho «paso» (y llega exacto)
const hacia = (x, objetivo, paso) => Math.abs(objetivo - x) <= paso ? objetivo : x + Math.sign(objetivo - x) * paso;
export const conCodo = (x, codo) => codo > 0 && x < codo ? codo * Math.exp(x / codo - 1) : Math.max(0, x);

// Activación en doble coseno: sube en t1, baja en t2 (0 fuera).
function activacion(t, t1, t2, q = 1) {
  if (t < 0) return 0;
  if (t < t1) return (0.5 * (1 - Math.cos(Math.PI * t / t1))) ** q;
  if (t < t1 + t2) return 0.5 * (1 + Math.cos(Math.PI * (t - t1) / t2));
  return 0;
}
// Activación del VI: igual que la de arriba hasta el 70% de la caída; desde ahí sigue una exponencial con la misma
// pendiente logarítmica en ese punto (τ = 0,162·t2), multiplicada por r (relajación lenta)
const U_COLA = 0.7, E_COLA = 0.5 * (1 + Math.cos(Math.PI * U_COLA)), K_COLA = E_COLA / (0.5 * Math.PI * Math.sin(Math.PI * U_COLA));
function activacionVi(t, t1, t2, q, r) {
  if (t < t1 + U_COLA * t2) return activacion(t, t1, t2, q);
  return E_COLA * Math.exp(-(t - t1 - U_COLA * t2) / (K_COLA * t2 * r));
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
    qMit: 0, qMitReg: 0, qTri: 0, qTriReg: 0, qAo: 0, dpVc: 0, dpNeto: 0, qPul: 0, qSis: 0, qRet: 0, qPulm: 0, qVp: 0,
    vMit: false, vTri: false, vAo: false, vPul: false,
    nLatido: 0, fase: 'G', _aoAbrio: false, _aoCerro: false, _mitAbrio: false, _pviPrev: 0,
    // barorreflejo: PAM que "siente" el seno carotídeo y efecto de cada brazo (0 = sin cambio)
    pamSensor: null, efFc: 0, efR: 0, efVu: 0, efEes: 0, fc: p.fc, paoDist: 0,
    // líquido que hay ya en el saco (sigue a p.liquidoPeri a ritmoDerrame) y volumen que ha entrado del intersticio
    liquidoPeri: p.liquidoPeri, perdido: 0, eesVi: p.vi.ees, eesVd: p.vd.ees, vRelleno: 0, pCap: 0, qRelleno: 0, vEdema: 0, qEdema: 0,
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

  // Por debajo de VCOLAPSO mL las paredes se tocan: la presión cae en parábola (KCOLAPSO mmHg/mL²) y la cámara no puede
  // vaciarse más. Antes, la curva diastólica se quedaba en −a por debajo de V0 y, con el saco a tensión, una cámara
  // seguía vaciándose hasta volúmenes negativos (AD −133 mL con 550 mL de derrame). Nunca actúa en un latido normal
  // (los volúmenes mínimos son de decenas de mL). Fisiología general; los números, ilustrativos
  function presionCamara(c, v, e, pperi, ees = c.ees) {
    const dv = v - c.v0;
    const sis = ees * dv;
    const dia = c.a * (Math.exp(c.b * dv) - 1);
    const colapso = v < VCOLAPSO ? -KCOLAPSO * (VCOLAPSO - v) ** 2 : 0;
    return e * sis + (1 - e) * dia + colapso + pperi;
  }

  function presiones() {
    const T = periodo, k = Math.sqrt(T / (60 / 70));
    const tl = s.tLatido;
    const eAur = activacion(tl, 0.5 * p.tsAur * k, 0.5 * p.tsAur * k);
    const eVen = activacion(tl - p.pr, p.fSubida * p.tsVen * k, (1 - p.fSubida) * p.tsVen * k, p.qSubida);
    // el VI puede relajarse más despacio que el VD (relajacion): solo se alarga la caída de su activación
    s.eVi = activacionVi(tl - p.pr, p.fSubida * p.tsVen * k, (1 - p.fSubida) * p.tsVen * k, p.qSubida, p.relajacion);
    // activación del VD: la del VI salvo que su sístole dure más (durVd)
    const eVd = p.durVd === 1 ? eVen : activacion(tl - p.pr, p.fSubida * p.tsVen * k * p.durVd, (1 - p.fSubida) * p.tsVen * k * p.durVd, p.qSubida);
    s.eAur = eAur; s.eVen = eVen; s.eVd = eVd;
    const vCor = s.vad + s.vvd + s.vai + s.vvi + s.liquidoPeri;
    s.pperi = p.kPeri * Math.exp((vCor - p.v0Peri) / p.phiPeri);
    // efecto de la eyección (resistencia interna del VI): mientras expulsa, la presión del VI cae una fracción
    // proporcional al flujo; redondea la onda de flujo y retrasa su pico, como en el ventrículo real
    const pviLibre = presionCamara(p.vi, s.vvi, s.eVi, 0, ef.eesVi) * (1 - p.kEyec * Math.max(0, s.qAo));
    const pvdLibre = presionCamara(p.vd, s.vvd, eVd, 0, ef.eesVd) * (1 - p.kEyecVd * Math.max(0, s.qPul));
    // tabique: cada ventrículo "siente" una fracción de la presión del otro
    s.pvi = pviLibre + p.tabique * pvdLibre + s.pperi;
    s.pvd = pvdLibre + p.tabique * pviLibre + s.pperi;
    s.pai = presionCamara(p.ai, s.vai, eAur, s.pperi);
    s.pad = presionCamara(p.ad, s.vad, eAur, s.pperi);
    // s.paoDist: presión del depósito elástico; s.pao: la de la raíz (la que se mide y ve la válvula)
    s.paoDist = Math.max(0, (s.vao - p.vuAo) / p.cAo);
    s.pao = s.paoDist + p.zAo * s.qAo;
    s.pven = conCodo((s.vven - ef.vuVen) / p.cVen, p.codoVen);
    s.pap = conCodo((s.vap - p.vuAp) / p.cAp, p.codoPul);
    s.pvp = conCodo((s.vvp - p.vuVp) / p.cVp, p.codoPul);
  }

  function flujos(dt) {
    // válvulas: diodo por gradiente
    s.qTri = s.pad > s.pvd ? (s.pad - s.pvd) / p.rTricus : 0;
    if (p.lPul > 0) {
      // pulmonar con inercia, como la mitral: abre por gradiente y cierra cuando el flujo llega a 0
      if (!s.vPul && s.pvd > s.pap) s.vPul = true;
      if (s.vPul) { s.qPul += (s.pvd - s.pap - p.rPulmonar * s.qPul) / p.lPul * dt; if (s.qPul <= 0) { s.qPul = 0; s.vPul = false; } }
    } else s.qPul = s.pvd > s.pap ? (s.pvd - s.pap) / p.rPulmonar : 0;
    if (p.lMit > 0) {
      // con inercia, la sangre que entra sigue entrando un momento aunque el gradiente ya se haya invertido (por eso la
      // onda E decelera en vez de cortarse), y la válvula cierra cuando el flujo llega a 0
      if (!s.vMit && s.pai > s.pvi) s.vMit = true;
      if (s.vMit) { s.qMit += (s.pai - s.pvi - p.rMitral * s.qMit) / p.lMit * dt; if (s.qMit <= 0) { s.qMit = 0; s.vMit = false; } }
    } else s.qMit = s.pai > s.pvi ? (s.pai - s.pvi) / p.rMitral : 0;
    // reflujo VI → AI por el orificio regurgitante (raíz suavizada cerca de 0 para no romper Euler)
    const dpReg = s.pvi - s.pai;
    s.qMitReg = p.eroaMitral > 0 && dpReg > 0 ? p.eroaMitral * 50 * dpReg / Math.sqrt(dpReg + 0.25) : 0;
    const dpTri = s.pvd - s.pad;
    s.qTriReg = p.eroaTricus > 0 && dpTri > 0 ? p.eroaTricus * 50 * dpTri / Math.sqrt(dpTri + 0.25) : 0;
    // aórtica: abre por gradiente; abierta, el flujo tiene inercia y puede invertirse un instante;
    // cierra cuando el reflujo acumulado llega al volumen de cierre
    if (!s.vAo) { if (s.pvi > s.paoDist) { s.vAo = true; s.reflujoAo = 0; } }
    s.dpVc = 0; s.dpNeto = 0;
    if (s.vAo && p.areaAortica > 0 && s.qAo > 0) {
      const v = s.qAo / (100 * p.areaAortica), r = Math.min(1, p.areaAortica / (Math.PI * (p.dAorta / 2) ** 2));
      s.dpVc = 4 * v * v; s.dpNeto = s.dpVc * (1 - 2 * r * (1 - r));
    }
    if (s.vAo) {
      s.qAo += (s.pvi - s.paoDist - (p.rAortica + p.zAo) * s.qAo - s.dpNeto) / p.lAo * dt;
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
    s.eesVi += (p.vi.ees - s.eesVi) * dt / p.tauContractilidad; s.eesVd += (p.vd.ees - s.eesVd) * dt / p.tauContractilidad;
    ef.eesVi = s.eesVi * (1 + s.efEes); ef.eesVd = s.eesVd * (1 + s.efEes);
    s.fc = clamp(p.fc * (1 + s.efFc), 35, 190);
  }

  // El derrame entra a su ritmo; el relleno transcapilar sigue a la caída de la presión capilar y el edema sale del pulmón
  // por encima de pEdema (ver BASE)
  function liquidos(dt) {
    const entra = p.liquidoPeri > s.liquidoPeri ? clamp((p.pFuenteDerrame - s.pperi) / 5, 0, 1) : 1;
    s.liquidoPeri = hacia(s.liquidoPeri, p.liquidoPeri, p.ritmoDerrame * entra * dt);
    const antes = s.perdido;
    s.perdido = hacia(s.perdido, p.hemorragia, p.ritmoHemorragia * dt);
    s.vven -= s.perdido - antes;
    s.pCap = s.pven + (s.paoDist - s.pven) * p.fCap * BASE.rSis / ef.rSis;
    const caida = Math.max(0, p.pCap0 - s.pCap);
    const objetivo = p.rellenoMax > 0 ? p.rellenoMax * Math.tanh(p.cInt * caida / p.rellenoMax) : 0;
    s.qRelleno = (objetivo - s.vRelleno) / p.tauRelleno;
    s.vRelleno += s.qRelleno * dt; s.vven += s.qRelleno * dt;
    s.qEdema = p.kEdema * Math.max(0, s.pvp - p.pEdema);
    s.vEdema += s.qEdema * dt; s.vvp -= s.qEdema * dt;
  }

  function paso(dt = 0.0001) {
    barorreflejo(dt);
    presiones();
    flujos(dt);       // el flujo aórtico (con inercia) se actualiza antes que los volúmenes: Euler semiimplícito
    liquidos(dt);
    s.vad += (s.qRet - s.qTri + s.qTriReg) * dt;
    s.vvd += (s.qTri - s.qPul - s.qTriReg) * dt;
    s.vap += (s.qPul - s.qPulm) * dt;
    s.vvp += (s.qPulm - s.qVp) * dt;
    s.vai += (s.qVp - s.qMit + s.qMitReg) * dt;
    s.vvi += (s.qMit - s.qAo - s.qMitReg) * dt;
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
      qAo: s.qAo, dpVc: s.dpVc, qMit: s.qMit, qMitReg: s.qMitReg, qPul: s.qPul, qTri: s.qTri, qTriReg: s.qTriReg, pven: s.pven, pvp: s.pvp,
      pperi: s.pperi, eVen: s.eVen, eVd: s.eVd, eVi: s.eVi, eAur: s.eAur, fase: s.fase, qVp: s.qVp,
      vMit: s.vMit, vAo: s.vAo, vTri: s.vTri, vPul: s.vPul,
    };
  }

  function nuevoAcum() {
    return { dt: 0, pao: 0, pad: 0, pai: 0, pap: 0, pven: 0, pvp: 0, qAo: 0, qSis: 0, qPul: 0, qReg: 0, qRegT: 0,
      paoMax: -1, paoMin: 1e9, papMax: -1, papMin: 1e9, pviMax: -1, pvdMax: -1,
      vviMax: -1, vviMin: 1e9, vvdMax: -1, vvdMin: 1e9, padMax: -1, paiMax: -1,
      pviEnMitralCierre: null, ultimoMit: false, ultimoAo: false, ultimoPul: false, ultimoTri: false,
      tS1: null, tS2: null, tS2p: null, tAoAbre: null, tMitAbre: null, tTriCierra: null, tPulAbre: null,
      paoDiaEnCierreMit: null, pperi: 0 };
  }
  function acumular(dt) {
    const a = acum;
    a.dt += dt; a.pao += s.pao * dt; a.pad += s.pad * dt; a.pai += s.pai * dt; a.pap += s.pap * dt;
    a.pven += s.pven * dt; a.pvp += s.pvp * dt; a.qAo += s.qAo * dt; a.qSis += s.qSis * dt; a.qReg += s.qMitReg * dt; a.qRegT += s.qTriReg * dt; a.qPul += s.qPul * dt; a.pperi += s.pperi * dt;
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
      // insuficiencia mitral: volumen y fracción regurgitantes; vs es el volumen anterógrado (aorta) y la FE
      // total cuenta lo que sale por las dos vías (sin insuficiencia, ≈ fe)
      vReg: a.qReg, fr: a.qReg / Math.max(1e-6, a.qReg + vs), feTotal: (a.vviMax - a.vviMin) / a.vviMax,
      edvD: a.vvdMax, esvD: a.vvdMin, vsD, feD: vsD / a.vvdMax,
      // insuficiencia tricuspídea: volumen y fracción regurgitantes (vsD es el anterógrado, por la pulmonar)
      vRegT: a.qRegT, frT: a.qRegT / Math.max(1e-6, a.qRegT + vsD),
      ptdvi: a.pviEnMitralCierre,       // presión al cerrar la mitral ≈ PTDVI
      gc, ic: gc / p.sc,
      // RVS con el flujo que cruza el lecho sistémico (en un latido estable es el GC; en uno sin eyección, sigue habiendo
      // flujo y la RVS no se vuelve infinita)
      rvs: (a.pao / T - a.pad / T) / (a.qSis * fcLatido / 1000) * 80,     // dyn·s·cm⁻⁵
      rvp: (a.pap / T - a.pai / T) / gc * 80,
      pven: a.pven / T, pvp: a.pvp / T, pperi: a.pperi / T,
      ppc: a.paoMin - (a.pviEnMitralCierre ?? 0),  // presión de perfusión coronaria
      tS1: a.tS1, tS2: a.tS2, tS2p: a.tS2p, tAoAbre: a.tAoAbre, tMitAbre: a.tMitAbre,
      tPulAbre: a.tPulAbre, tTriCierra: a.tTriCierra,
      // volumen comprometido total y presión media de llenado sistémico (referencia Guyton)
      vEstresado: (s.vao - p.vuAo) + (s.vven - ef.vuVen) + (s.vap - p.vuAp) + (s.vvp - p.vuVp),
      pmls: ((s.vven - ef.vuVen) + (s.vao - p.vuAo)) / (p.cVen + p.cAo),
      // perdido: la hemorragia que ya se ha ido; vRelleno: lo que ha entrado del intersticio; vEdema: lo que ha salido al
      // pulmón (vTotal = vSangre − perdido + vRelleno − vEdema ± lo que muevan a mano las maniobras)
      vTotal: volTotal(), perdido: s.perdido, vRelleno: s.vRelleno, vEdema: s.vEdema, liquidoPeri: s.liquidoPeri, pCap: s.pCap,
      // estado del barorreflejo al cerrar el latido (fracción de cambio sobre lo basal)
      baro: { fc: s.efFc, r: s.efR, vu: s.efVu, ees: s.efEes, sensor: s.pamSensor },
    };
    // Fick
    const cao2 = 1.34 * p.hb * p.sao2 + 0.003 * p.pao2;
    m.do2 = gc * cao2 * 10; m.do2i = m.do2 / p.sc;
    // (sin aporte, la extracción tiende a su techo de 0,7: el límite, no 0/0)
    m.vo2 = Math.min(p.vo2, m.do2 * 0.7); m.er = m.do2 > 0 ? m.vo2 / m.do2 : 0.7;
    m.svo2 = p.sao2 * (1 - m.er);
    Object.assign(acum, nuevoAcum());
    return m;
  }

  function correr(segundos, dt = 0.0001) {
    const n = Math.round(segundos / dt);
    for (let i = 0; i < n; i++) paso(dt);
    return ultimo;
  }

  // onda: el último latido completo; ondaActual: el latido en curso (crece hasta cerrarse);
  // periodo: la duración del latido en curso
  return { p, s, ef, paso, correr, get ultimo() { return ultimo; }, get onda() { return ondaUltima; },
    get ondaActual() { return onda; }, get periodo() { return periodo; } };
}
