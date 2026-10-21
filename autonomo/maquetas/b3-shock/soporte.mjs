// Borrador de js/modules/eco/soporte.mjs (maqueta b3-shock v2, plan socialista, bloque 3). Sin DOM: se usa igual en
// node (pruebas) y en el navegador. Lee y mueve el MISMO motor del latido de la app (js/modules/eco/motor.mjs), sin
// copiarlo: cada cifra del monitor, de las consolas y de los aparatos sale de aquí.
//
// Lo que el motor aún no tiene y este archivo le añade (en la app irá dentro de flujos() y presiones() del motor, con
// pruebas en js/modules/eco/pruebas/soporte.test.mjs; aquí envuelve su paso() y mueve el volumen tras cada paso de
// 0,1 ms, que es lo mismo con un desfase de un paso):
//   · BALÓN DE CONTRAPULSACIÓN: volumen que desplaza en la aorta. Se hincha al cerrarse la aórtica (fases E-G y A del
//     motor) y se vacía al empezar la fase B (contracción isovolumétrica), como dice Marino (cap. 16, p. 45,
//     docs/marino-2024-shock-caps14-17.pdf#page=45). Entra como volumen sin tensión de la aorta que se resta:
//     paoDist = (vao + vBalon − vuAo) / cAo. El pico diastólico y la muesca de antes de la eyección salen solos.
//     35-40 mL de helio (p. 45); la velocidad de inflado y vaciado, ilustrativa.
//   · IMPELLA: fuente de flujo continuo del VI a la aorta, 2,5-5,5 L/min según el catéter (p. 47). Cae si el VI se vacía
//     (las paredes se tocan: fisiología general; el umbral, ilustrativo). Modo «gasto total»: un lazo mide el gasto
//     nativo y ajusta solo la bomba para llegar al total pedido (p. 47).
//   · ECMO VENOARTERIAL: saca sangre de las venas y la devuelve a la aorta (p. 48-49), hasta 5-6 L/min. Cae si las
//     venas se vacían (ilustrativo). VENTEO: drenaje del VI hacia el circuito (p. 48-49), o el balón o el Impella a la
//     vez (p. 48). Que la presión de la aorta frene al VI débil, que este se dilate y que suba la PCP no se escribe: sale
//     del motor.
//   · FÁRMACOS (pieza 4 de la cobertura): mueven parámetros del motor en la DIRECCIÓN de la ficha; la magnitud,
//     ilustrativa. Noradrenalina: β (contractilidad y FC) por debajo de 10 µg/min, α (resistencias y venoconstricción)
//     por encima, techo a 30 (Marino, cap. 14, p. 12-13). Vasopresina 0,03 U/min: vasoconstricción (p. 15-16).
//     Dobutamina 5 µg/kg/min: contractilidad, FC +5-15 lpm (p. 43) y algo de vasodilatación (cap. 22, p. 11).
//   · PACIENTES: un escenario del motor (escenarios.mjs) con su gravedad con nombre, más dos que aún no existen allí
//     (sepsis y anafilaxia con gravedad) y la volemia baja del infarto con la PCP que no sube (p. 40).
//   · PERFUSIÓN: ScvO₂, gap de PCO₂ y PETCO₂ con la función del capilar vivo (js/data/capilar-vivo-data.js, derivar),
//     que es la pieza 3 de la cobertura; lactato y diuresis, ilustrativos (la fuente no da fórmula), con su reloj.
import { crearMotor, BASE } from '../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../js/modules/eco/escenarios.mjs';
import { bolo } from '../../../js/modules/eco/maniobras.mjs';
import { derivar, estadoDe, satDe } from '../../../js/data/capilar-vivo-data.js';

export const LMIN = 1000 / 60;             // mL/s por cada L/min
const suave = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);

// ---------------------------------------------------------------- aparatos: las cifras de la fuente
export const APARATO = {
  balon: { volumen: [35, 40], gas: 'helio', pagina: 45 },          // p. 45
  impella: { flujo: [2.5, 5.5], pagina: 47 },                         // p. 47
  ecmo: { flujoMax: [5, 6], temperatura: 37, pagina: 48 },            // p. 48-49
};
// Constantes del modelo (ilustrativas: la fuente no las da)
const TAU_INFLA = 0.03, TAU_VACIA = 0.02;      // s: el helio entra y sale rápido (p. 45: «rapidly»), cuánto, ilustrativo
const VI_SUCCION = [6, 22];                    // mL del VI: por debajo de 6 la bomba no saca nada; desde 22, todo
const VEN_SUCCION = [0.15, 1.2];                 // mmHg venosos: lo mismo para la cánula del ECMO
const VENTEO_DRENAJE = 0.8;                    // L/min que drena la cánula del VI (ilustrativo)
const TAU_TOTAL = 3;                           // s del lazo del «gasto total» del Impella (ilustrativo)

// ---------------------------------------------------------------- pacientes: escenario del motor + gravedad con nombre
// (Los que no están en escenarios.mjs se escriben aquí con la forma que tendrían allí.)
export const ESCENARIOS_EXTRA = {
  sepsis: {
    nombre: 'Shock séptico', tipo: 'vasodilatador',
    // vasodilatación «de arterias y venas» (Marino, cap. 14, p. 4) y fuga capilar con hipovolemia (cap. 17, p. 57-58,
    // sin cifra): resistencias × (1 − 0,6 g), volumen venoso sin tensión × (1 + 0,35 g) y una fuga del 6 % de la
    // volemia a fondo. Todo ilustrativo; la dirección, de la ficha
    texto: (g) => `resistencias al ${Math.round(100 * (1 - 0.6 * g))} % y fuga de ${Math.round(0.06 * g * BASE.vSangre / 10) * 10} mL`,
    aplicar: (m, g = 0.7) => { m.p.rSis *= 1 - 0.6 * g; m.p.vuVen *= 1 + 0.35 * g; m.p.hemorragia = 0.06 * g * BASE.vSangre; },
  },
  anafilaxia: {
    nombre: 'Shock anafiláctico', tipo: 'vasodilatador',
    // vasodilatación y una fuga capilar que puede llevarse hasta el 35 % del volumen intravascular (cap. 17, p. 66-67)
    texto: (g) => `fuga del ${Math.round(35 * g)} % de la volemia y vasodilatación`,
    aplicar: (m, g = 0.6) => { m.p.rSis *= 1 - 0.45 * g; m.p.vuVen *= 1 + 0.4 * g; m.p.hemorragia = 0.35 * g * BASE.vSangre * 0.55; },
  },
};
const ESC = { ...ESCENARIOS, ...ESCENARIOS_EXTRA };
export const textoGravedad = (k, g) => ESC[k]?.gravedad?.texto?.(g) ?? ESC[k]?.texto?.(g) ?? '';

// Receta del paciente: { esc, g, volemia (mL que faltan o sobran, ilustrativo), util: 'sepsis' | 'normal', pao2, hb }
export function prepararMotor(rec, segundos = 40) {
  const m = crearMotor();
  m.correr(12);
  if (rec.kEdema != null) m.p.kEdema = rec.kEdema;
  ESC[rec.esc]?.aplicar(m, rec.g);
  if (rec.volemia) m.s.vven += rec.volemia;
  m.p.tEscenario = m.s.t;
  return m;
}

// ---------------------------------------------------------------- la envoltura: aparatos + fármacos sobre el motor
export function crearCabecera(rec, { asentar = 40 } = {}) {
  const m = prepararMotor(rec);
  const base = { rSis: m.p.rSis, vuVen: m.p.vuVen, viEes: m.p.vi.ees, vdEes: m.p.vd.ees, fc: m.p.fc, vuAo: m.p.vuAo };
  const ajuste = { soporte: 'no', impella: 3.5, total: null, ecmo: 4.5, venteo: 'no', balon: 40, na: 0, vaso: false, dobuta: false };
  const st = { vBalon: 0, qImp: 0, qImpObj: 3.5 * LMIN, qEcmo: 0, qVent: 0, impTotalObj: 3.5 * LMIN, rotor: 0, rodete: 0 };
  let acum = nuevo(), ultimoLat = m.s.nLatido, lectura = null, historiaAo = [];
  let cris = 0, sangre = 0;
  function nuevo() { return { dt: 0, imp: 0, ecmo: 0, vent: 0, balonMax: 0, aoAbre: false, picoDia: 0, teleDia: null, aoAntes: false }; }

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
    const s = m.s, p = m.p;
    const conBalon = ajuste.soporte === 'balon' || (ajuste.soporte === 'ecmo' && ajuste.venteo === 'balon');
    const conImp = ajuste.soporte === 'impella' || (ajuste.soporte === 'ecmo' && ajuste.venteo === 'impella');
    const conEcmo = ajuste.soporte === 'ecmo';
    // balón: inflado de E a A (tras cerrarse la aórtica, toda la diástole), vacío de B a D
    const hinchar = conBalon && (s.fase === 'E' || s.fase === 'F' || s.fase === 'G' || (s.fase === 'A' && s.nLatido > 0));
    const objB = hinchar ? ajuste.balon : 0;
    st.vBalon += (objB - st.vBalon) * (1 - Math.exp(-dt / (hinchar ? TAU_INFLA : TAU_VACIA)));
    p.vuAo = base.vuAo - st.vBalon;
    m.paso(dt);
    // Impella: del VI a la aorta
    if (conImp) {
      if (ajuste.total != null && ajuste.soporte === 'impella') st.qImpObj += (st.impTotalObj - st.qImpObj) * dt / TAU_TOTAL;
      else st.qImpObj = ajuste.impella * LMIN;
      const f = suave((s.vvi - VI_SUCCION[0]) / (VI_SUCCION[1] - VI_SUCCION[0]));
      st.qImp = st.qImpObj * f;
      s.vvi -= st.qImp * dt; s.vao += st.qImp * dt;
      st.rotor += st.qImpObj / LMIN * dt;               // vueltas del dibujo (ralentizado; las rpm reales, sin fuente)
    } else st.qImp = 0;
    // ECMO: de las venas (y del VI si se ventea) a la aorta
    if (conEcmo) {
      const f = suave((s.pven - VEN_SUCCION[0]) / (VEN_SUCCION[1] - VEN_SUCCION[0]));
      st.qEcmo = ajuste.ecmo * LMIN * f;
      st.qVent = ajuste.venteo === 'drenaje' ? Math.min(st.qEcmo, VENTEO_DRENAJE * LMIN * suave((s.vvi - VI_SUCCION[0]) / (VI_SUCCION[1] - VI_SUCCION[0]))) : 0;
      s.vven -= (st.qEcmo - st.qVent) * dt; s.vvi -= st.qVent * dt; s.vao += st.qEcmo * dt;
      st.rodete += ajuste.ecmo * dt * 0.6;
    } else { st.qEcmo = 0; st.qVent = 0; }
    // por latido
    acum.dt += dt; acum.imp += st.qImp * dt; acum.ecmo += st.qEcmo * dt; acum.vent += st.qVent * dt;
    acum.balonMax = Math.max(acum.balonMax, st.vBalon); if (s.vAo && s.qAo > 2) acum.aoAbre = true;
    if (st.vBalon > 20) acum.picoDia = Math.max(acum.picoDia, s.pao);
    // la presión de la aorta cuando se abre la válvula (la que el vaciado del balón baja, p. 45)
    if (s.vAo && !acum.aoAntes && acum.teleDia == null) acum.teleDia = s.paoDist;
    acum.aoAntes = s.vAo;
    if (s.nLatido !== ultimoLat) { ultimoLat = s.nLatido; cerrar(); }
  }
  function cerrar() {
    const u = m.ultimo; if (!u) { acum = nuevo(); return; }
    const T = acum.dt || u.periodo;
    const imp = acum.imp / T / LMIN, ecmo = acum.ecmo / T / LMIN, vent = acum.vent / T / LMIN;
    historiaAo.push(acum.aoAbre); if (historiaAo.length > 6) historiaAo.shift();
    const gcNativo = Math.max(0, u.gc);                       // lo que sale por la válvula aórtica (el reflujo de cierre, fuera)
    const gcTotal = gcNativo + imp + ecmo;                    // lo que llega al cuerpo (el venteo va dentro del ECMO)
    if (ajuste.total != null && ajuste.soporte === 'impella') st.impTotalObj = Math.min(5.5, Math.max(2.5, ajuste.total - gcNativo)) * LMIN;
    lectura = { u, gcNativo, gcTotal, icTotal: gcTotal / m.p.sc, imp, ecmo, vent, balon: acum.balonMax,
      aoAbre: historiaAo.filter(Boolean).length, aoDe: historiaAo.length, pcp: u.pvp, edema: u.vEdema,
      picoDia: acum.picoDia, teleDia: acum.teleDia };
    // si la aórtica no abre, el motor no cierra bien la fase; la RVS se lee con el flujo que cruza el lecho (ya lo hace)
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
    if (tipo === 'sangre') sangre += mL; else cris += mL;
    bolo(m, mL);                                // maniobras.mjs: entra en las venas
  }
  // El reloj: al pasar las horas, 3/4 del cristaloide se van al intersticio (Marino, cap. 14, p. 11)
  function redistribuir() { const sale = 0.75 * cris; if (sale > 0) { m.s.vven -= sale; cris = 0; } return sale; }

  correr(asentar);
  return { m, ajuste, st, base, paso, correr, ajustar, volumen, redistribuir, get lectura() { return lectura; },
    get infundido() { return { cris, sangre }; } };
}

// ---------------------------------------------------------------- perfusión (con la función del capilar vivo)
// pao2 baja con el edema de pulmón que calcula el motor (ilustrativo: 10 mmHg por cada 100 mL); con ECMO, la sangre que
// vuelve del oxigenador se toma como arterializada (98 %: ilustrativo, la fuente no da la saturación de salida)
export function perfusion(L, rec) {
  const u = L.u;
  const pao2 = Math.max(50, (rec.pao2 ?? 90) - 0.03 * (u.vEdema || 0));
  const satNativa = satDe(pao2);
  const sao2 = L.ecmo > 0 ? (L.gcNativo * satNativa + L.ecmo * 0.98) / Math.max(0.1, L.gcTotal) : satNativa;
  const d = derivar(estadoDe({ hb: rec.hb ?? 14, pao2, gcFijo: L.gcTotal, util: rec.util || 'normal', espacio: rec.espacio || 'no' }));
  // derivar usa la SaO₂ de la PaO₂: con ECMO se corrige la ScvO₂ con la mezcla
  const do2i = L.gcTotal * 1.34 * (rec.hb ?? 14) * sao2 * 10 / BASE.sc;
  // Lactato objetivo (ilustrativo; la fuente no da fórmula): sube cuando el aporte cae por debajo de ~380 mL/min/m²
  // (la Tabla 14.5 pide DO₂ >300) y, en la sepsis, aunque sobre O₂ (cap. 17, p. 59)
  const lactObj = 1 + 0.035 * Math.max(0, 380 - do2i) + (rec.util === 'sepsis' ? 3 : 0);
  // Diuresis (ilustrativo): la autorregulación renal la sostiene hasta una PAM de 70 (cap. 18, p. 7); por debajo cae
  const diurObj = u.pam >= 70 ? 1.0 : Math.max(0.05, 1.0 - 0.95 * (70 - u.pam) / 25);
  return { spo2: Math.round(satNativa * 100), sao2, scvo2: Math.round(d.scvo2 * 100), gap: Math.round(d.gap), petco2: Math.round(d.petco2),
    lactObj, diurObj, do2i: Math.round(do2i), er: d.o2er };
}

// Laboratorio con su hora: el lactato tarda (τ 2 h, ilustrativo); la diuresis se mide por horas (τ 0,5 h)
export function avanzarLab(lab, perf, horas) {
  const k = (tau) => 1 - Math.exp(-horas / tau);
  return { lact: lab.lact + (perf.lactObj - lab.lact) * k(2), diur: lab.diur + (perf.diurObj - lab.diur) * k(0.5) };
}
