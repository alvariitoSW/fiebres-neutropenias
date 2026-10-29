// Borrador de js/modules/eco/soporte.mjs (maqueta b3-shock v2, plan socialista, bloque 3). Sin DOM: se usa igual en
// node (pruebas) y en el navegador. Lee y mueve el MISMO motor del latido de la app (js/modules/eco/motor.mjs), sin
// copiarlo: cada cifra del monitor, de las consolas y de los aparatos sale de aquí.
//
// Los aparatos ya están en el motor (entrada p.soporte = { impella, ecmo, venteo (L/min), balon (mL) }: motor.mjs,
// función soporte(), Marino cap. 16, p. 45-49, docs/marino-2024-shock-caps14-17.pdf): el balón se hincha al cerrarse la
// aórtica y se vacía con la onda R; el Impella saca del VI y el ECMO de las venas, y las dos bombas pierden flujo si el VI o
// las venas se vacían. Aquí solo queda lo que es de la maqueta (en la app irá a js/modules/eco/soporte.mjs):
//   · los mandos de cada aparato (cuál está puesto, el venteo, los 35-40 mL del balón) traducidos a p.soporte;
//   · el modo «gasto total» del Impella: un lazo mide el gasto por la válvula y ajusta solo la bomba para llegar al total
//     pedido (p. 47; el lazo, ilustrativo);
//   · lo que la cabecera lee por latido: cuántos latidos abre la aórtica, el pico diastólico y la presión al abrirse.
//   · FÁRMACOS (pieza 4 de la cobertura): mueven parámetros del motor en la DIRECCIÓN de la ficha; la magnitud,
//     ilustrativa. Noradrenalina: β (contractilidad y FC) por debajo de 10 µg/min, α (resistencias y venoconstricción)
//     por encima, techo a 30 (Marino, cap. 14, p. 12-13). Vasopresina 0,03 U/min: vasoconstricción (p. 15-16).
//     Dobutamina 5 µg/kg/min: contractilidad, FC +5-15 lpm (p. 43) y algo de vasodilatación (cap. 22, p. 11).
//   · PACIENTES: un escenario del motor (escenarios.mjs) con su gravedad con nombre, más dos que aún no existen allí
//     (sepsis y anafilaxia con gravedad) y la volemia baja del infarto con la PCP que no sube (p. 40).
//   · PERFUSIÓN: ScvO₂, gap de PCO₂ y PETCO₂ con la función del capilar vivo (js/data/capilar-vivo-data.js, derivar),
//     que es la pieza 3 de la cobertura; lactato y diuresis, ilustrativos (la fuente no da fórmula), con su reloj.
import { crearMotor, BASE } from '../../eco/motor.mjs';
import { ESCENARIOS } from '../../eco/escenarios.mjs';
import { bolo } from '../../eco/maniobras.mjs';
import { derivar, estadoDe, satDe } from '../../../data/capilar-vivo-data.js';

export const LMIN = 1000 / 60;             // mL/s por cada L/min

// ---------------------------------------------------------------- aparatos: las cifras de la fuente
export const APARATO = {
  balon: { volumen: [35, 40], gas: 'helio', pagina: 45 },          // p. 45
  impella: { flujo: [2.5, 5.5], pagina: 47 },                         // p. 47
  ecmo: { flujoMax: [5, 6], temperatura: 37, pagina: 48 },            // p. 48-49
};
// Constantes de la maqueta (ilustrativas: la fuente no las da)
const VENTEO_DRENAJE = 0.8;                    // L/min que drena la cánula del VI (ilustrativo)
const TAU_TOTAL = 3;                           // s del lazo del «gasto total» del Impella (ilustrativo)
// Las bombas no sacan lo que no hay (motor.mjs, succionVi/succionVen): en la maqueta los umbrales son más anchos que los del
// motor ([6, 22] mL y [0,15, 1,2] mmHg), para que el Impella pierda flujo en cuanto el VI se queda con poco volumen y el
// ECMO cuando las venas se vacían, sin oscilar (v3: con [6, 22] el Impella a 5,5 sobre un VI seco entraba en una oscilación
// lenta de succión y la FC iba a destiempo de la PAM; y con el ECMO a 6 más un Impella el total llegaba a 8,5 L/min con una
// PAM de 130). Fisiología general; los números, ilustrativos
const SUCCION_VI = [12, 60];                   // mL del VI entre los que la bomba del Impella pierde su flujo
const SUCCION_VEN = [0.3, 2.2];                    // mmHg de las venas entre los que el ECMO pierde su flujo
// El pulmón empieza a encharcarse en las venas pulmonares por encima de P_EDEMA: 18, el extremo bajo de la «presión de llenado
// óptima» de 18-20 de la ficha (Marino, cap. 16, p. 42: la más alta que sube el gasto sin edema). Cuánto líquido pasa por cada
// mmHg de más (K_EDEMA) no lo da la fuente: ilustrativo (motor: 28 y 0,1). Con 4 mL/s por mmHg un paciente que entra con la PCP
// del VI por encima de 18 perdía ~1,3 L al pulmón en 40 s y la PVC caía a 1-2 (M0): el ritmo es ahora de minutos (0,3 mL/s por
// mmHg: a PCP 25, ~2 mL/s ≈ 7 L/h, ilustrativo). Lo que empeora el intercambio de entrada es el agua del intersticio, que sigue a
// la PCP y no al edema ya formado: la PaO₂ cae PAO2_PCP mmHg por cada mmHg de PCP sobre P_EDEMA (ver perfusion)
const P_EDEMA = 18, K_EDEMA = 0.5;
const PAO2_PCP = 10;                             // mmHg de PaO₂ por mmHg de PCP sobre P_EDEMA (ilustrativo)
const TEP_CAP = 0.85;                           // la arteria pulmonar del TEP a fondo, un 20 % de distensible (ilustrativo)
const HEM_SIMPATICO = 0.35;
// Las bombas de flujo continuo (centrífuga del ECMO, microaxial del Impella) dan menos flujo cuanta más presión tienen que
// vencer (física de la bomba; la curva de cada aparato no está en la fuente): desde POSCARGA_DESDE mmHg en la aorta el flujo
// cae linealmente hasta quedarse en POSCARGA_MIN a POSCARGA_DESDE + POSCARGA_ANCHO. Ilustrativo. Sin esto, ECMO 6 + Impella
// 2,5 sumaban 8,5 L/min con una PAM de 130 (v3)
const POSCARGA_DESDE = 90, POSCARGA_ANCHO = 70, POSCARGA_MIN = 0.4;
export const factorPoscarga = (pao) => Math.max(POSCARGA_MIN, 1 - Math.max(0, pao - POSCARGA_DESDE) / POSCARGA_ANCHO);                    // la hemorragia dispara el simpático más allá del barorreflejo: FC basal ×(1 + 0,35·g)

// ---------------------------------------------------------------- pacientes: escenario del motor + gravedad con nombre
// (Los que no están en escenarios.mjs se escriben aquí con la forma que tendrían allí.)
export const ESCENARIOS_EXTRA = {
  // la hemorragia del motor (escenarios.mjs), más la respuesta simpática del traumatizado que sangra: la taquicardia de la
  // Tabla 15.1 (solo flechas, cap. 15, p. 22; las cifras de FC son ilustrativas) es más de lo que da el barorreflejo del
  // motor solo (FC 110 con un 35 % perdido). Ilustrativo: la dirección es de la tabla
  hemorragia: { ...ESCENARIOS.hemorragia, aplicar: (m, g = 0.5) => { ESCENARIOS.hemorragia.aplicar(m, g); m.p.fc = BASE.fc * (1 + HEM_SIMPATICO * g); } },
  // el TEP del motor, con la arteria pulmonar menos distensible cuanto más resistencia (el producto resistencia × distensibilidad
  // del lecho pulmonar se mantiene: fisiología general): así la pulmonar late (≈45/20 a fondo) en vez de 40/33. Ilustrativo
  tep: { ...ESCENARIOS.tep, aplicar: (m, g) => { ESCENARIOS.tep.aplicar(m, g); m.p.cAp *= 1 - TEP_CAP * g; m.p.rigAp += 20 * g; } },
  sepsis: {
    nombre: 'Shock séptico', tipo: 'vasodilatador',
    // vasodilatación «de arterias y venas» (Marino, cap. 14, p. 4) y fuga capilar con hipovolemia (cap. 17, p. 57-58,
    // sin cifra): resistencias × (1 − 0,6 g), volumen venoso sin tensión × (1 + 0,35 g) y una fuga del 6 % de la
    // volemia a fondo. Todo ilustrativo; la dirección, de la ficha
    texto: (g) => `resistencias al ${Math.round(100 * (1 - 0.6 * g))} % y fuga de ${Math.round(0.06 * g * BASE.vSangre / 10) * 10} mL`,
    // y la diastólica baja con un pulso amplio (cap. 17, p. 57): las arterias vacían deprisa con la resistencia baja y las
    // grandes arterias se vuelven menos distensibles (cAo ×(1 − 0,45 g), ilustrativo); así el pulso se ensancha en vez de
    // estrecharse (v3: antes 66/41, más estrecho que el sano)
    aplicar: (m, g = 0.7) => { m.p.rSis *= 1 - 0.6 * g; m.p.vuVen *= 1 + 0.35 * g; m.p.hemorragia = 0.06 * g * BASE.vSangre; m.p.cAo *= 1 - 0.45 * g; },
  },
  // Posparo (Marino cap. 21, p. 65): el VI aturdido (Ees baja, como el «fallo» del motor) que «suele resolverse en 72 h», más la
  // respuesta inflamatoria sistémica «casi universal» tras el paro, que puede dar shock circulatorio (resistencias algo más
  // bajas). La Ees sigue a g; la vasodilatación inflamatoria, a g también (se va con el aturdimiento). La magnitud: ilustrativa
  posparo: {
    nombre: 'Posparo cardíaco', tipo: 'cardiogenico',
    texto: (g) => `horas tras la RCE: ${Math.round(horasDePosparo(g))}`,
    aplicar: (m, g = POSPARO_G0) => { ESCENARIOS.fallo.aplicar(m, g); m.p.vd.ees = BASE.vd.ees * (1 - (1 - POSPARO_VD0) * g / POSPARO_G0); m.p.rSis *= 1 - POSPARO_VASODILATACION * (g / POSPARO_G0); m.s.vven -= POSPARO_FUGA * (g / POSPARO_G0); },
  },
  anafilaxia: {
    nombre: 'Shock anafiláctico', tipo: 'vasodilatador',
    // vasodilatación y una fuga capilar que puede llevarse hasta el 35 % del volumen intravascular (cap. 17, p. 66-67)
    texto: (g) => `fuga del ${Math.round(35 * g)} % de la volemia y vasodilatación`,
    aplicar: (m, g = 0.6) => { m.p.rSis *= 1 - 0.45 * g; m.p.vuVen *= 1 + 0.4 * g; m.p.hemorragia = 0.35 * g * BASE.vSangre * 0.55; },
  },
};
// El reloj del posparo: la gravedad de la Ees (g, como en el «fallo») cae con las horas desde la RCE hasta 0 a las 72 h («suele
// resolverse en 72 h», p. 65). La forma de la curva (lineal) y la gravedad de partida: ilustrativas
export const POSPARO_H = 72, POSPARO_G0 = 0.82, POSPARO_VASODILATACION = 0.25;
// El aturdimiento es BIVENTRICULAR (cap. 21, p. 65; qué ventrículo: fisiología general, la ficha no lo dice): la Ees del VD cae con la misma curva que la del VI y vuelve a la normal a
// las 72 h; a las 0 h, POSPARO_VD0 de la normal (cuánto: ilustrativo). La fuga capilar de la respuesta inflamatoria (POSPARO_FUGA,
// mL a las 0 h): ilustrativa. Antes era 1100 mL y, con el edema rápido, la PVC de Virginia quedaba en 1,5 (M0, b3-paso4 g3)
export const POSPARO_FUGA = 300, POSPARO_VD0 = 0.3;
export const gDePosparo = (h) => POSPARO_G0 * (1 - Math.min(POSPARO_H, Math.max(0, h)) / POSPARO_H);
export const horasDePosparo = (g) => POSPARO_H * (1 - Math.max(0, g) / POSPARO_G0);
const ESC = { ...ESCENARIOS, ...ESCENARIOS_EXTRA };
// Rotura del septo (estado rotura-septo; Marino cap. 16, p. 38 solo da la dirección: un gran cortocircuito izquierda-derecha que
// inunda la circulación pulmonar y desvía flujo de la sistémica). Las cifras son fisiología general o ilustrativas:
// RECETA_ROTURA_SEPTO: IAM con fallo del VI (g 0,7) y orificio de 0,3 cm² (ilustrativo; motor: civ, misma fórmula que eroaMitral).
// Medido con autonomo/bloques/b3/herramientas/3b-barrido.mjs: PA 75/60 (PAM 67), FC 109, IC 1,57, Qp/Qs 2,2, SvO₂ = SatAD 44 → SatAP 65 % (medido con g-estados-cifras)
// (salto 25 puntos; el umbral numérico de «cortocircuito» no está en la ficha: ilustrativo), PCP 21, PVC 6,1, VD/VI 1,2.
// CIV_TOPE (0,7 cm², ilustrativo): Qp/Qs 3,1 y PAM 58; por encima el sello «cortocircuito masivo». CIV_COLAPSO (1,0 cm², ilustrativo):
// con él el motor da IC 0,9 y PAM ≈ 42 (colapso); el motor no deja pasar de ahí
export const RECETA_ROTURA_SEPTO = { esc: 'fallo', g: 0.7, civ: 0.3, hb: 14 };
export const CIV_TOPE = 0.7, CIV_COLAPSO = 1.0;
// Los tres estados del infarto con el mando de gravedad propio (b3-paso4 g3): el deslizador (g de 0 a 1) mueve una pieza del motor
// y el fallo del VI (gEsc) queda fijo. Todo ilustrativo salvo la dirección (Marino cap. 16, p. 38 y 40); medido con
// autonomo/bloques/b3/herramientas/g3-estados-cifras.mjs
//  · papilar (Benito): orificio mitral de 0,3 a 1,0 cm²; el 0,8 es el que ya usa el motor (EROA_TOPE): por encima, sello
//  · vd (Fermín): Ees del VD de 0,6 (g 0) a 0,10 (g 1) de la normal; con g 0,9 (0,15) van los 1.250 mL de líquidos de RECETA_IAM_VD
//    (la receta del M0c); por debajo de 0,1 el motor no es un paciente. Los líquidos crecen con g hasta g 0,9
//  · septo (Remedios): orificio de 0 a CIV_COLAPSO (1,0 cm²); CIV_TOPE (0,7) es el del sello
export const EROA_MIN = 0.3, EROA_MAX = 1.0, EROA_TOPE = 0.8;
export const VD_G_RECETA = 0.9, VD_EES_0 = 0.6, VD_EES_1 = 0.1, VD_LIQUIDOS = 1250;
const red2 = (x) => Math.round(x * 100) / 100;
export const eroaDeG = (g) => red2(EROA_MIN + (EROA_MAX - EROA_MIN) * g);
export const eesVdDeG = (g) => red2(VD_EES_0 - (VD_EES_0 - VD_EES_1) * g);
export const liquidosDeG = (g) => Math.round(VD_LIQUIDOS * Math.min(1, g / VD_G_RECETA) / 25) * 25;
export const civDeG = (g) => red2(CIV_COLAPSO * g);
export const RECETA_BENITO = { esc: 'fallo', gEsc: 0.65, mando: 'papilar', g: 0.5, hb: 14 };        // eroa 0,65
export const RECETA_FERMIN = { esc: 'fallo', gEsc: 0.05, mando: 'vd', g: VD_G_RECETA, liquidos: VD_LIQUIDOS, hb: 14 };       // eesVd 0,15 + 1.250 mL
export const RECETA_REMEDIOS = { esc: 'fallo', gEsc: 0.7, mando: 'septo', g: 0.3, hb: 14 };           // civ 0,3
export const textoGravedad = (k, g) => ESC[k]?.gravedad?.texto?.(g) ?? ESC[k]?.texto?.(g) ?? '';

// Receta del paciente: { esc, g, volemia (mL que faltan o sobran, ilustrativo), util: 'sepsis' | 'normal', pao2, hb,
// eroaMitral (cm², la insuficiencia mitral del motor), viDiast (factor sobre la rigidez diastólica del VI: <1, un VI que
// admite volumen con poca presión: el shock del infarto con la PCP no alta, el 30 % de la p. 40; ilustrativo) }
// IAM del VD (estado iam-vd, M0c 29/10/2026): VI casi normal (fallo g 0,05), VD infartado (eesVd 0,15) y +1.250 mL de
// LÍQUIDOS (volemia: la carga de volumen del fallo derecho; cuánto, ilustrativo). Sin ellos la PVC no pasa de ~7,4: la PVC
// no supera la presión media de llenado (~7 + la venoconstricción del barorreflejo) si no entra volumen. Con ellos y el
// tabique que se desplaza hacia el VI (motor.mjs, septoDesplaza; Marino cap. 16, p. 40): PVC 14,1 > PCP 9,7, IC 1,99,
// PA 94/69, FEVI 52 %, VTD VD/VI 2,6 (medido con autonomo/bloques/b3/herramientas/m0-cifras.mjs)
export const RECETA_IAM_VD = { esc: 'fallo', g: 0.05, eesVd: 0.15, volemia: 1250, hb: 14 };

export function prepararMotor(rec, segundos = 40) {
  const m = crearMotor();
  m.correr(12);
  m.p.kEdema = rec.kEdema ?? K_EDEMA; m.p.pEdema = rec.pEdema ?? P_EDEMA;
  m.p.succionVi = SUCCION_VI; m.p.succionVen = SUCCION_VEN;
  ESC[rec.esc]?.aplicar(m, rec.gEsc ?? rec.g);
  if (rec.mando) {                            // el mando de gravedad de los estados del infarto (ver arriba)
    if (rec.mando === 'papilar') rec = { ...rec, eroaMitral: eroaDeG(rec.g) };
    else if (rec.mando === 'vd') rec = { ...rec, eesVd: eesVdDeG(rec.g), volemia: rec.liquidos ?? 0 };
    else if (rec.mando === 'septo') rec = { ...rec, civ: civDeG(rec.g) };
  }
  if (rec.viDiast) m.p.vi.b *= rec.viDiast;
  if (rec.volemia) m.s.vven += rec.volemia;
  // eesVd: la Ees del VD como fracción de la normal (1 = normal; 0,5 = la mitad). Un VD infartado o aturdido (cap. 16, p. 40:
  // sube la PVC o la PCP «según el ventrículo que falle»). Se pide como p.vd.ees y el motor la sigue con su tauContractilidad,
  // antes del barorreflejo (motor.mjs, barorreflejo). Por debajo de 0,1 no es un paciente (ilustrativo)
  if (rec.eesVd != null) m.p.vd.ees = BASE.vd.ees * Math.max(0.1, Math.min(1, rec.eesVd));
  if (rec.eroaMitral) m.p.eroaMitral = rec.eroaMitral;   // rotura del papilar: insuficiencia mitral aguda (cap. 16, p. 38); el orificio, ilustrativo
  // civ: orificio de la rotura del septo (cm²), cortocircuito VI → VD en el motor. Se recorta en CIV_COLAPSO (ver arriba)
  if (rec.civ) m.p.civ = Math.min(rec.civ, CIV_COLAPSO);
  m.p.tEscenario = m.s.t;
  return m;
}

// ---------------------------------------------------------------- la envoltura: aparatos + fármacos sobre el motor
export function crearCabecera(rec, { asentar = 40 } = {}) {
  const m = prepararMotor(rec);
  const base = { rSis: m.p.rSis, vuVen: m.p.vuVen, viEes: m.p.vi.ees, vdEes: m.p.vd.ees, fc: m.p.fc };
  const ajuste = { soporte: 'no', impella: 3.5, total: null, ecmo: 4.5, venteo: 'no', balon: 40, razon: 1, na: 0, vaso: false, dobuta: false };
  // lo que miran los dibujos: el balón y las bombas, del motor; lo que pide el Impella y las vueltas, de la maqueta
  const ms = m.s;
  const st = { qImpObj: 3.5 * LMIN, impTotalObj: 3.5 * LMIN, rotor: 0, rodete: 0,
    get vBalon() { return ms.vBalon; }, get qImp() { return ms.qImp; }, get qEcmo() { return ms.qEcmo; }, get qVent() { return ms.qVent; } };
  let acum = nuevo(), ultimoLat = m.s.nLatido, lectura = null, historiaAo = [];
  let cris = 0, sangre = 0, crisTotal = 0, edemaVisto = 0, vvenBase = 0, pvc0 = 0;
  function nuevo() { return { aoAbre: false, picoDia: 0, picoD: 0, sis: 0, teleDia: null, aoAntes: false }; }
  // Balón 1:2 y 1:3: solo se asiste uno de cada «razon» latidos. Se asiste la diástole del latido n (tras su sístole); antes de
  // la onda R (tLatido < pr) todavía es la diástole del latido anterior. Lo no asistido se lee aparte (ilustrativo: el reparto
  // es de la consola; la ficha, p. 45, solo dice que se hincha en cada diástole que se elige)
  const asiste = (n) => ajuste.razon <= 1 || ((n % ajuste.razon) + ajuste.razon) % ajuste.razon === 0;
  const ult = { sis: 0, as: { pico: null, tele: null }, no: { pico: null, tele: null } };

  // Fármacos y vasopresores: multiplicadores sobre lo basal del paciente (dirección de la ficha; magnitud ilustrativa)
  function aplicarFarmacos() {
    const na = Math.min(ajuste.na, 40);
    const b = Math.min(na, 10) / 10;                        // tramo β (<10 µg/min)
    const a = Math.max(0, Math.min(na, 30) - 10) / 20;      // tramo α (10-30); por encima de 30, casi nada más (p. 13)
    const a2 = Math.max(0, na - 30) / 10 * 0.08;
    let fR = 1 + 0.10 * b + 0.5 * a + a2, fVu = 1 - 0.06 * b - 0.10 * a, fEes = 1 + 0.18 * b + 0.04 * a, fFc = 1 + 0.06 * b;
    if (ajuste.vaso) fR *= 1.25;                                                   // V1: vasoconstricción (p. 15-16)
    let dFc = 0;
    if (ajuste.dobuta) { fEes *= 1.25; dFc += 10; fR *= 0.92; }                    // p. 43 (FC +5-15); vasodilatadora (cap. 22, p. 11)
    m.p.rSis = base.rSis * fR; m.p.vuVen = base.vuVen * fVu;
    m.p.vi.ees = base.viEes * fEes; m.p.vd.ees = base.vdEes * fEes;
    m.p.fc = base.fc * fFc + dFc;
  }

  function paso(dt = 0.0001) {
    const conBalon = ajuste.soporte === 'balon' || (ajuste.soporte === 'ecmo' && ajuste.venteo === 'balon');
    const conImp = ajuste.soporte === 'impella' || (ajuste.soporte === 'ecmo' && ajuste.venteo === 'impella');
    const conEcmo = ajuste.soporte === 'ecmo';
    if (conImp && ajuste.total != null && ajuste.soporte === 'impella') st.qImpObj += (st.impTotalObj - st.qImpObj) * dt / TAU_TOTAL;
    else st.qImpObj = ajuste.impella * LMIN;
    const fPos = factorPoscarga(m.s.pamSensor);   // la presión media que vence la bomba (el sensor del barorreflejo ya la filtra)
    const nDias = m.s.nLatido - (m.s.tLatido < m.p.pr + Math.max(0, ajuste.tim?.des || 0) ? 1 : 0);   // con el vaciado tarde, la diástole asistida llega hasta pasada la R
    m.p.soporte = conBalon || conImp || conEcmo ? { balon: conBalon && asiste(nDias) ? ajuste.balon : 0, tim: ajuste.tim, impella: conImp ? st.qImpObj / LMIN * fPos : 0,
      ecmo: conEcmo ? ajuste.ecmo * fPos : 0, venteo: conEcmo && ajuste.venteo === 'drenaje' ? VENTEO_DRENAJE : 0 } : null;
    m.paso(dt);
    const s = m.s;
    if (conImp) st.rotor += st.qImpObj / LMIN * dt;         // vueltas del dibujo (ralentizado; las rpm reales, sin fuente)
    if (conEcmo) st.rodete += ajuste.ecmo * dt * 0.6;
    // por latido: si abre la aórtica, el pico diastólico con el balón y la presión de la aorta al abrirse la válvula
    if (s.vAo && s.qAo > 2) acum.aoAbre = true;
    if (s.vBalon > 20 && s.tLatido >= m.p.pr) acum.picoDia = Math.max(acum.picoDia, s.pao);
    if (s.vAo) acum.sis = Math.max(acum.sis, s.pao);   // la sistólica propia del paciente (durante la eyección)
    if (acum.aoAbre && !s.vAo && s.tLatido >= m.p.pr) acum.picoD = Math.max(acum.picoD, s.pao);   // el máximo de la diástole
    if (s.vAo && !acum.aoAntes && acum.teleDia == null) acum.teleDia = s.paoDist;
    acum.aoAntes = s.vAo;
    if (s.nLatido !== ultimoLat) { ultimoLat = s.nLatido; cerrar(); }
  }
  function cerrar() {
    let u = m.ultimo; if (!u) { acum = nuevo(); return; }
    // La PVC no pasa a la PCP si el VD no falla (fisiología general; solo el TEP y el taponamiento las igualan o la invierten,
    // ficha cap. 18 p. 4): el motor sube la aurícula derecha con el volumen y en la sepsis la pasaba (PVC 22-24 con PCP 19).
    // Con el VD que falla (rec.eesVd < 1: IAM del VD) no se toca: ahí la PVC pasa a la PCP (cap. 16, p. 40)
    const vdFalla = rec.mando === 'vd' || (rec.eesVd != null && rec.eesVd < 1);
    if (rec.esc !== 'tep' && rec.esc !== 'derrame' && !vdFalla && u.pvc >= u.pcp - 1) u = { ...u, pvc: Math.max(0, u.pcp - 1) };
    // lo asistido y lo no asistido (el latido que se cierra es el nLatido − 1; su teledistólica viene de la diástole del anterior)
    const nCerrado = m.s.nLatido - 1, conBalon = ajuste.soporte === 'balon' || (ajuste.soporte === 'ecmo' && ajuste.venteo === 'balon');
    if (!conBalon) { ult.as = { pico: acum.picoDia || null, tele: acum.teleDia }; ult.no = { pico: null, tele: null }; }
    else {
      if (acum.picoD > 0) { if (asiste(nCerrado)) ult.as.pico = acum.picoD; else ult.no.pico = acum.picoD; }
      if (acum.teleDia != null) { if (asiste(nCerrado - 1)) ult.as.tele = acum.teleDia; else ult.no.tele = acum.teleDia; }
      if (ajuste.razon <= 1) ult.no = { pico: null, tele: null };
    }
    if (acum.sis > 0) ult.sis = acum.sis;
    historiaAo.push(acum.aoAbre); if (historiaAo.length > 6) historiaAo.shift();
    // el motor separa el gasto: por la válvula (gcValvula, ≥0), el Impella, el ECMO (con el venteo dentro) y el total (gc)
    const gcNativo = u.gcValvula, imp = u.gcImpella, ecmo = u.gcEcmo, vent = u.gcVenteo, gcTotal = u.gc;
    if (ajuste.total != null && ajuste.soporte === 'impella') st.impTotalObj = Math.min(5.5, Math.max(2.5, ajuste.total - gcNativo)) * LMIN;
    // lo que pide cada bomba (L/min): si saca menos, es que no le llega sangre (el VI o las venas, casi vacíos)
    const impPide = (ajuste.soporte === 'impella' || (ajuste.soporte === 'ecmo' && ajuste.venteo === 'impella')) ? st.qImpObj / LMIN : 0;
    const ecmoPide = ajuste.soporte === 'ecmo' ? ajuste.ecmo : 0;
    lectura = { u, gcNativo, gcTotal, icTotal: gcTotal / m.p.sc, imp, ecmo, vent, impPide, ecmoPide, totalPide: ajuste.soporte === 'impella' ? ajuste.total : null, balon: u.balon,
      aoAbre: historiaAo.filter(Boolean).length, aoDe: historiaAo.length, pcp: u.pvp, edema: u.vEdema, get pvc0() { return pvc0; },
      picoDia: ult.as.pico ?? acum.picoDia, teleDia: ult.as.tele, sisPropia: ult.sis, picoNo: ult.no.pico, teleNo: ult.no.tele, razon: ajuste.razon };
    acum = nuevo();
  }
  function correr(seg, dt = 0.0001) { const n = Math.round(seg / dt); for (let i = 0; i < n; i++) paso(dt); return lectura; }

  function ajustar(cambio = {}) {
    Object.assign(ajuste, cambio);
    if ('na' in cambio || 'vaso' in cambio || 'dobuta' in cambio) aplicarFarmacos();
    if (ajuste.soporte !== 'impella') ajuste.total = ajuste.total;   // (el modo total solo actúa con el Impella solo)
    if (cambio.soporte && cambio.soporte !== 'ecmo') ajuste.venteo = 'no';
  }
  function volumen(mL, tipo = 'cristaloide') {
    if (tipo === 'sangre') sangre += mL; else { cris += mL; crisTotal += mL; }
    bolo(m, mL);                                // maniobras.mjs: entra en las venas
  }
  // El reloj: al pasar las horas, 3/4 del cristaloide se van al intersticio (Marino, cap. 14, p. 11). El motor ya sacó parte
  // al pulmón (edema) mientras tanto: eso cuenta como ya salido, y de las venas no puede irse más de lo que tienen por
  // encima de lo basal. Se reparte en tramos (la hora), no de golpe (26/10/2026: restar todo de golpe daba PA 15/5).
  function redistribuir() {
    const yaEdema = Math.max(0, m.s.vEdema - edemaVisto);
    let falta = Math.max(0, 0.75 * cris - yaEdema), total = 0;
    const TRAMOS = 6, trozo = falta / TRAMOS;
    // El motor corre siempre el tramo entero (9 s), aunque no quede cristaloide que repartir: con el VI distendido el pulmón
    // sigue encharcándose mientras pasan las horas (v3: con cris 0 no simulaba ni un segundo y el paciente mejoraba)
    for (let i = 0; i < TRAMOS; i++) {
      const sale = trozo > 0 ? Math.min(trozo, Math.max(0, m.s.vven - vvenBase)) : 0;
      m.s.vven -= sale; total += sale; correr(1.5);
    }
    cris = 0; edemaVisto = m.s.vEdema;
    return total;
  }

  correr(asentar);
  edemaVisto = m.s.vEdema; vvenBase = m.s.vven; pvc0 = lectura ? lectura.u.pvc : 0;
  return { m, ajuste, st, base, paso, correr, ajustar, volumen, redistribuir, get lectura() { return lectura; },
    get infundido() { return { cris, sangre, crisTotal }; } };
}

// ---------------------------------------------------------------- perfusión (con la función del capilar vivo)
// pao2 baja con el edema de pulmón que calcula el motor (ilustrativo: 10 mmHg por cada 100 mL) y con la PCP por encima de
// P_EDEMA (agua intersticial: PAO2_PCP por mmHg, ilustrativo; la fuente no da la cifra); con ECMO, la sangre que
// vuelve del oxigenador se toma como arterializada (98 %: ilustrativo, la fuente no da la saturación de salida)
export function perfusion(L, rec) {
  const u = L.u;
  const pao2 = Math.max(50, (rec.pao2 ?? 90) - 0.1 * (u.vEdema || 0) - PAO2_PCP * Math.max(0, (u.pvp ?? u.pcp ?? 0) - P_EDEMA));
  const satNativa = satDe(pao2);
  const sao2 = L.ecmo > 0 ? ((L.gcNativo + L.imp) * satNativa + L.ecmo * 0.98) / Math.max(0.1, L.gcTotal) : satNativa;
  const d = derivar(estadoDe({ hb: rec.hb ?? 14, pao2, gcFijo: L.gcTotal, util: rec.util || 'normal', espacio: rec.espacio || 'no' }));
  // derivar usa la SaO₂ de la PaO₂: con ECMO se corrige la ScvO₂ con la mezcla
  const do2i = L.gcTotal * 1.34 * (rec.hb ?? 14) * sao2 * 10 / BASE.sc;
  // Lactato objetivo (ilustrativo; la fuente no da fórmula): sube cuando el aporte cae por debajo de ~380 mL/min/m²
  // (la Tabla 14.5 pide DO₂ >300) y, en la sepsis, aunque sobre O₂ (cap. 17, p. 59)
  // en la sepsis, el lactato que sube aunque sobre O₂ (cap. 17, p. 59) crece con la gravedad del cuadro (3 mmol/L a fondo, con
  // g²: a media gravedad apenas asoma; ilustrativo). Antes era fijo y Amparo sin sepsis (g 0) tenía 4 de lactato
  const lactObj = 1 + 0.035 * Math.max(0, 380 - do2i) + (rec.util === 'sepsis' ? 3 * (rec.g ?? 1) ** 2 : 0);
  // Diuresis (ilustrativo): la autorregulación renal la sostiene hasta una PAM de 70 (cap. 18, p. 7); por debajo cae
  const diurObj = u.pam >= 70 ? 1.0 : Math.max(0.05, 1.0 - 0.95 * (70 - u.pam) / 25);
  // la SpO₂ del monitor: la mezcla de lo que eyecta el VI y lo que devuelve el ECMO (dónde se mide y el reparto por la aorta
  // —el «arlequín»— no los da la fuente: ver la nota «spo2-ecmo»)
  return { spo2: Math.round(sao2 * 100), sao2, scvo2: Math.round(d.scvo2 * 100), gap: Math.round(d.gap), petco2: Math.round(d.petco2),
    lactObj, diurObj, do2i: Math.round(do2i), er: d.o2er };
}

// Laboratorio con su hora: el lactato tarda (τ 2 h, ilustrativo); la diuresis se mide por horas (τ 0,5 h). Con la
// hipoperfusión mantenida (PAM <65) el lactato sigue subiendo con las horas (LACT_HORA mmol/L por hora, ilustrativo: la
// fuente dice que la acidosis láctica y el fallo de órganos llegan con el tiempo, Tabla 15.1, sin fórmula)
export const LACT_HORA = 0.2;
export function avanzarLab(lab, perf, horas, { pam = null } = {}) {
  const k = (tau) => 1 - Math.exp(-horas / tau);
  const hipo = pam != null && pam < 65 ? LACT_HORA * horas : 0;
  return { lact: lab.lact + (perf.lactObj + hipo - lab.lact) * k(2) + hipo * (1 - k(2)), diur: lab.diur + (perf.diurObj - lab.diur) * k(0.5) };
}
