// Formas del corazón precalculadas a lo largo del latido y mezcladas en cada fotograma.
//
// Idea tomada de The Heart by Ultrasound (D. Ouyang, douyang/echodemo; reconstruida, no copiada): en vez de rehacer
// toda la geometría en cada fotograma, se calculan unas pocas formas una vez y en cada fotograma solo se mezclan.
// Allí las formas son fijas (un latido dibujado a mano); aquí salen del último latido completo del motor
// (motor.onda): cada forma es construirCorazon() con el estado exacto de un instante de ese latido, así que todo lo
// que acopla las cámaras (tabique, anillos, aurículas sobre la base) es exacto en cada forma.
//
// Un estado por fotograma, sin trampas: la mezcla solo se usa si lo que interpola (volúmenes y apertura de las
// válvulas) coincide con el estado que se muestra dentro de una tolerancia; si no (el latido aún está cambiando
// tras un escenario, o el corte cambia la topología), el fotograma se construye entero como antes.
// La mezcla de posiciones y normales la hace la tarjeta gráfica (render-webgl.mjs): por fotograma no se crea
// ningún array grande ni se sube nada.
import { construirCorazon } from './corazon-geo.mjs';
import { acortamientoVd } from './anatomia.mjs';   // fisiología del lado del corazón (P3a): la imagen solo lee
import { normalesSuaves } from './render-webgl.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const mix = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

// Apertura según el flujo que pasa (raíz: a poco flujo ya se separan las valvas) y carga según el gradiente
// inverso cuando está cerrada (la válvula soporta la presión y se abomba). Ilustrativo. Función pura del estado.
// R3 · La tricúspide usa qRef 250 mL/s (no 600): su llenado rápido (F) es de ~130-280 mL/s en el motor, la mitad que el de la mitral;
// con 600 apenas separaba las valvas (3 mm). Ilustrativo.
// Apertura/carga: dibujo de válvula (ilustrativo). Contrato: valv.* (abierta/cerrada) y q.* (caudal) son su entrada.
export const VALVULAS = [
  { n: 'mitral', abierta: 'vMit', q: 'qMit', arriba: 'pai', abajo: 'pvi', qRef: 600, pRef: 100, nombre: 'Mitral' },
  { n: 'tricus', abierta: 'vTri', q: 'qTri', arriba: 'pad', abajo: 'pvd', qRef: 250, pRef: 20, nombre: 'Tricúspide' },
  { n: 'aortica', abierta: 'vAo', q: 'qAo', arriba: 'pvi', abajo: 'pao', qRef: 500, pRef: 100, nombre: 'Aórtica' },
  { n: 'pulmonar', abierta: 'vPul', q: 'qPul', arriba: 'pvd', abajo: 'pap', qRef: 350, pRef: 20, nombre: 'Pulmonar' },
];
export const apertura = (v, s) => s[v.q] > 0 ? Math.min(1, Math.pow(s[v.q] / v.qRef, 0.35)) : 0;
export const carga = (v, s) => s[v.q] > 0 ? 0 : clamp((s[v.abajo] - s[v.arriba]) / v.pRef, 0, 1);
// Estado que necesita la geometría a partir de un estado del motor (o de una muestra de motor.onda)
// Lo que la geometría necesita del último latido además del estado del instante: los volúmenes telediastólicos
// (fijan cuánto ha bajado la base y la pared libre del VD) y el derrame.
// mioVi: masa del VI de la forma de enfermedad elegida (escenarios.mjs; 1 = normal). mioVd: grosor de la pared libre del VD
// (hipertrofia del VD, Atlas · 14; 1 = normal).
// El derrame es el que ya hay en el saco (motor.s.liquidoPeri: entra a su ritmo), no el pedido (motor.p.liquidoPeri)
// Qué dato del contrato (contrato.mjs, CAMPOS) es cada uno de los que lee de aquí. Se leen del motor y no del contrato porque
// el contrato no da el valor idéntico (otra unidad, otro instante o sin dato): feLatido = 'fe' (el contrato en %, esto en 0-1);
// vviTd/vvdTd = máximo de vol.vi/vol.vd del latido (el contrato no lo expone como campo); liquidoPeri = 'derrame' (el contrato
// cae a 0, esto al pedido); eroaMitral/tenting/vRegMitral/vaiMax/mioVi/mioVd: sin campo de contrato (vRegMitral ~ q.reg.im).
export const extraDeMotor = (motor) => ({ vviTd: motor.ultimo?.edv, vvdTd: motor.ultimo?.edvD, feLatido: motor.ultimo?.fe, liquidoPeri: motor.s.liquidoPeri ?? motor.p.liquidoPeri, tenting: Math.min(1, (motor.p.eroaMitral ?? 0) / 0.35), eroaMitral: motor.p.eroaMitral ?? 0, vRegMitral: motor.ultimo?.vReg ?? 0,
  vaiMax: motor.onda?.length ? Math.max(...motor.onda.map(m => m.vai)) : undefined, mioVi: motor.p.mioVi ?? 1, mioVd: motor.p.mioVd ?? 1 });

// Cuánto se aplana el tabique (0-1) según el gradiente de presión transeptal VI−VD de este instante. Fuente de lo
// que se ve (que el tabique se aplana cuando el VD se sobrecarga): Merino, Fig. 18.2 (septo aplanado en diástole) y
// Fisiopatología UCI · Cardiología, Ficha 11 (movimiento septal plano o paradójico). Que lo decida el gradiente es
// fisiología general, y los umbrales (empieza a +1 mmHg, del todo a −2 mmHg) son ilustrativos: un corazón normal
// nunca baja de ~+1 mmHg en el modelo; con el VD sobrecargado, el VD supera al VI en diástole.
export function aplanamientoSeptal(s) {
  if (s.pvi == null || s.pvd == null) return 0;
  const t = clamp((1 - (s.pvi - s.pvd)) / 3, 0, 1);
  return t * t * (3 - 2 * t);
}

// P1 · Pliegue (0-1) de la pared libre de la AD o del VD en el taponamiento, desde la presión TRANSMURAL del motor
// (cámara − saco; motor.mjs, ptmAd/ptmVd). Lo que se ve: el colapso pasivo de la pared libre de la AD es de los signos
// más precoces y precede al colapso diastólico del VD (Fisiopatología UCI · Cardiología, Ficha 11, «Taponamiento
// cardíaco»; El Libro Azul, parte 2, p. 65; Marino, cap. 21, p. 64 del PDF: «diastolic collapse of the right
// ventricle»). Que lo decida la transmural es fisiología general: la pared se hunde cuando lo que la mantiene abierta
// (la transmural) cae por debajo de lo que la empuja (el saco). Umbral de 1 mmHg: ilustrativo (plan de ideas, P1). Con
// el saco sin tensión (pperi < 1 mmHg, el corazón normal) no hay nada que la empuje: min(pperi, 1). Y sin líquido
// tampoco: el saco tenso de un corazón grande (fallo, dilatada) toca la pared y no puede meterse en ella; hace falta
// una capa de líquido entre los dos (hasta LIQUIDO_PLIEGUE mL, ilustrativo, el pliegue crece con ella).
export const UMBRAL_PLIEGUE = 1, LIQUIDO_PLIEGUE = 40;
export function plieguePared(ptm, pperi, liquido) {
  if (ptm == null || pperi == null || !(liquido > 0)) return 0;
  const t = clamp((Math.min(pperi, UMBRAL_PLIEGUE) - ptm) / UMBRAL_PLIEGUE, 0, 1) * clamp(liquido / LIQUIDO_PLIEGUE, 0, 1);
  return t * t * (3 - 2 * t);
}

export function estadoGeo(s, extra = {}) {
  const e = { vvi: s.vvi, vvd: s.vvd, vai: s.vai, vad: s.vad, septo: aplanamientoSeptal(s), eVi: s.eVi ?? 0, eVd: s.eVd ?? 0,
    pliegueAd: plieguePared(s.ptmAd, s.pperi, s.liquidoPeri), pliegueVd: plieguePared(s.ptmVd, s.pperi, s.liquidoPeri), ...extra };
  for (const v of VALVULAS) { e[v.n] = apertura(v, s); e['carga_' + v.n] = carga(v, s); }
  return e;
}

// Tolerancia de la mezcla frente al estado mostrado
export const TOLERANCIA = { volumen: 2, apertura: 0.2, septo: 0.15, activacion: 0.1, pliegue: 0.15, acortVd: 0.007 };   // acortVd: fracción del largo del VD (0,007 ≈ 0,5 mm de TAPSE); la curva del TAPSE no es lineal en vvd, hay que vigilarla
const VOLS = ['vvi', 'vvd', 'vai', 'vad'];

// Valor de una muestra del latido en el instante t, interpolando entre las dos muestras vecinas (cada 2 ms)
export function valorEn(onda, t, k) {
  let lo = 0, hi = onda.length - 1;
  if (t <= onda[0].t) return onda[0][k]; if (t >= onda[hi].t) return onda[hi][k];
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; onda[mid].t <= t ? lo = mid : hi = mid; }
  const a = onda[lo], b = onda[hi]; return mix(a[k], b[k], (t - a.t) / (b.t - a.t));
}

// Instantes del latido donde se calcula una forma. Se eligen solos, con error acotado: entre dos formas seguidas,
// interpolar en línea recta los volúmenes y la apertura de las válvulas se separa de las muestras reales del latido
// menos de la mitad de la tolerancia. Así hay pocas formas en la diástole lenta y muchas donde todo cambia deprisa
// (contracción auricular, apertura y cierre de las válvulas). Tope de separación: 60 ms.
export function instantesClave(onda, { maxSeparacion = 0.06 } = {}) {
  const vdTd = Math.max(...onda.map(m => m.vvd));
  const vals = onda.map(m => { const e = estadoGeo(m); return [...VOLS.map(k => e[k]), ...VALVULAS.map(v => e[v.n]), e.septo, e.eVi, e.eVd, e.pliegueAd, e.pliegueVd, acortamientoVd(1 - e.vvd / vdTd)]; });
  const tol = [...VOLS.map(() => TOLERANCIA.volumen / 2), ...VALVULAS.map(() => TOLERANCIA.apertura / 2), TOLERANCIA.septo / 2, TOLERANCIA.activacion / 2, TOLERANCIA.activacion / 2, TOLERANCIA.pliegue / 2, TOLERANCIA.pliegue / 2, TOLERANCIA.acortVd / 2];
  const cabe = (i, j) => {
    if (onda[j].t - onda[i].t > maxSeparacion) return false;
    for (let k = i + 1; k < j; k++) { const w = (onda[k].t - onda[i].t) / (onda[j].t - onda[i].t);
      for (let c = 0; c < tol.length; c++) if (Math.abs(mix(vals[i][c], vals[j][c], w) - vals[k][c]) > tol[c]) return false; }
    return true;
  };
  const out = [onda[0]]; let i = 0;
  while (i < onda.length - 1) { let j = i + 1; while (j + 1 < onda.length && cabe(i, j + 1)) j++; out.push(onda[j]); i = j; }
  return out;
}

// ¿Son casi iguales dos latidos? (el corazón está estable y vale la pena precalcular sus formas)
export function semejantes(a, b, tol = TOLERANCIA.volumen / 2) {
  if (!a?.length || !b?.length) return false;
  for (const m of a) for (const k of VOLS) if (Math.abs(valorEn(b, m.t, k) - m[k]) > tol) return false;
  return true;
}

// Estructura de una forma (piezas, número de vértices): dos formas solo se mezclan si coinciden
const firma = (g) => g.partes.map(p => p.nombre + ':' + (p.pos ? p.pos.length : 'l' + p.lineas.length)).join('|');

export function crearTablaFormas({ construir = construirCorazon, porFotograma = 2 } = {}) {
  let formas = null, gen = 0;               // la tabla en uso: [{ t, est, geo }] ordenada por t, y el periodo
  let pendiente = null;                     // la que se está construyendo, poco a poco
  let periodo = 0;

  function prepararForma(m, opciones, extra) {
    const est = estadoGeo(m, extra), geo = construir(est, opciones);
    for (const p of geo.partes) if (p.pos) {
      if (!p.normales) p.normales = normalesSuaves(p.pos, p.idx);
      if (p.alfa && p.alfa < 1) { const c = [0, 0, 0], n = p.pos.length / 3;   // para ordenar las transparentes
        for (let i = 0; i < p.pos.length; i += 3) { c[0] += p.pos[i] / n; c[1] += p.pos[i + 1] / n; c[2] += p.pos[i + 2] / n; } p.centro = c; }
    }
    return { t: m.t, est, geo };
  }

  return {
    get lista() { return !!formas; },
    get generacion() { return gen; },
    get construyendo() { return !!pendiente; },
    get numero() { return formas ? formas.length : 0; },
    // Empieza a construir una tabla nueva para este latido (se termina con trabajar(), unas pocas formas por llamada)
    pedir(onda, u, opciones, extra) {
      if (opciones.corte || !onda.length || !u) { pendiente = null; return; }   // el corte cambia la topología
      pendiente = { muestras: instantesClave(onda), opciones, extra, hechas: [], periodo: u.periodo };
    },
    // ¿Hace falta una tabla nueva? Sí si no hay, o si el latido que se le pasa ya no se parece al de la tabla.
    caduca(onda) {
      if (!formas) return true;
      if (!onda.length) return true;
      for (const f of formas) for (const k of VOLS) if (Math.abs(valorEn(onda, f.t, k) - f.est[k]) > TOLERANCIA.volumen / 2) return true;
      return false;
    },
    // Construye unas pocas formas; al terminar, la tabla nueva sustituye a la anterior. Devuelve la generación
    // anterior si la tabla ha cambiado (para liberar sus búferes en la tarjeta gráfica), o null.
    trabajar() {
      if (!pendiente) return null;
      const p = pendiente;
      for (let i = 0; i < porFotograma && p.hechas.length < p.muestras.length; i++)
        p.hechas.push(prepararForma(p.muestras[p.hechas.length], p.opciones, p.extra));
      if (p.hechas.length < p.muestras.length) return null;
      pendiente = null;
      const f0 = firma(p.hechas[0].geo);
      if (p.hechas.some(f => firma(f.geo) !== f0)) { const vieja = gen; formas = null; gen++; return vieja; }
      const vieja = gen; formas = p.hechas; periodo = p.periodo; gen++;
      return vieja;
    },
    olvidar() { const vieja = gen; formas = null; pendiente = null; gen++; return vieja; },
    // Mezcla para el estado s (el que se muestra). null si no hay tabla o si la mezcla no representa a s.
    mezclar(s, extra) {
      if (!formas) return null;
      const t = s.tLatido, n = formas.length;
      // la forma anterior y la siguiente al instante t, dando la vuelta al latido por los dos extremos
      let ia = -1; for (let i = 0; i < n; i++) if (formas[i].t <= t) ia = i; else break;
      let ib, tA, tB;
      if (ia < 0) { ia = n - 1; ib = 0; tA = formas[ia].t - periodo; tB = formas[0].t; }
      else if (ia === n - 1) { ib = 0; tA = formas[ia].t; tB = formas[0].t + periodo; }
      else { ib = ia + 1; tA = formas[ia].t; tB = formas[ib].t; }
      const A = formas[ia], B = formas[ib];
      const w = tB > tA ? clamp((t - tA) / (tB - tA), 0, 1) : 0;
      // ¿representa la mezcla al estado mostrado?
      const objetivo = estadoGeo(s, extra);
      for (const k of VOLS) if (Math.abs(mix(A.est[k], B.est[k], w) - objetivo[k]) > TOLERANCIA.volumen) return null;
      for (const v of VALVULAS) if (Math.abs(mix(A.est[v.n], B.est[v.n], w) - objetivo[v.n]) > TOLERANCIA.apertura) return null;
      if (Math.abs(mix(A.est.septo, B.est.septo, w) - objetivo.septo) > TOLERANCIA.septo) return null;
      if (Math.abs(mix(A.est.eVi, B.est.eVi, w) - objetivo.eVi) > TOLERANCIA.activacion) return null;   // fija la torsión y los papilares
      if (Math.abs(mix(A.est.eVd, B.est.eVd, w) - objetivo.eVd) > TOLERANCIA.activacion) return null;   // fija el grosor del VD
      { const ac = (e) => acortamientoVd(1 - e.vvd / (e.vvdTd ?? 140)); if (Math.abs(mix(ac(A.est), ac(B.est), w) - ac(objetivo)) > TOLERANCIA.acortVd) return null; }   // TAPSE (p3-tapse)
      for (const k of ['pliegueAd', 'pliegueVd']) if (Math.abs(mix(A.est[k] ?? 0, B.est[k] ?? 0, w) - (objetivo[k] ?? 0)) > TOLERANCIA.pliegue) return null;   // P1
      if (Math.abs((extra?.feLatido ?? 0) - (A.est.feLatido ?? 0)) > 0.03) return null;               // contractilidad del latido (torsión)
      if ((extra?.liquidoPeri || 0) !== (A.est.liquidoPeri || 0)) return null;
      if ((extra?.mioVi ?? 1) !== (A.est.mioVi ?? 1)) return null;          // otra forma de enfermedad
      if (Math.abs((extra?.vviTd ?? 0) - (A.est.vviTd ?? 0)) > TOLERANCIA.volumen) return null;   // fija el descenso de la base
      if (Math.abs((extra?.vvdTd ?? 0) - (A.est.vvdTd ?? 0)) > TOLERANCIA.volumen) return null;   // fija el descenso del VD
      const pa = A.geo.partes, pb = B.geo.partes, partes = new Array(pa.length);
      for (let j = 0; j < pa.length; j++) {
        const a = pa[j], b = pb[j];
        if (a.lineas) {                       // cuerdas: pocas, se mezclan aquí
          const l = new Float32Array(a.lineas.length); for (let i = 0; i < l.length; i++) l[i] = mix(a.lineas[i], b.lineas[i], w);
          partes[j] = { ...a, lineas: l }; continue;
        }
        const cerca = w < 0.5 ? ia : ib;
        partes[j] = { ...a, pos2: b.pos, normales2: b.normales, ao2: b.ao, mezcla: w,
          clave: `f${gen}:${ia}#${j}`, clave2: `f${gen}:${ib}#${j}`, idx: (w < 0.5 ? a : b).idx, claveIdx: `f${gen}:${cerca}#${j}` };
      }
      return { partes, flujo: mezclarFlujo(A.geo.flujo, B.geo.flujo, w), descenso: mix(A.geo.descenso, B.geo.descenso, w),
        mezcla: { a: ia, b: ib, w, est: objetivo } };
    },
  };
}

// El interior por donde corre la sangre, mezclado igual que las paredes
export function mezclarFlujo(fa, fb, w) {
  const L = (p, q) => lerp3(p, q, w);
  return {
    enCamara: Object.fromEntries(Object.keys(fa.enCamara).map(c => [c, (n) => L(fa.enCamara[c](n), fb.enCamara[c](n))])),
    valvulas: Object.fromEntries(Object.keys(fa.valvulas).map(k => [k, L(fa.valvulas[k], fb.valvulas[k])])),
    coaptacionMitral: fa.coaptacionMitral && fb.coaptacionMitral ? L(fa.coaptacionMitral, fb.coaptacionMitral) : undefined,
    largo: (n) => mix(fa.largo(n), fb.largo(n), w),
    enVia: (n, t) => L(fa.enVia(n, t), fb.enVia(n, t)),
    transformar: (p) => L(fa.transformar(p), fb.transformar(p)),
    visible: () => true,
  };
}

// Posiciones de una pieza mezclada, en la CPU (para pruebas y para quien no use la tarjeta gráfica)
export function posicionesMezcladas(p) {
  if (!p.pos2) return p.pos;
  const out = new Float32Array(p.pos.length);
  for (let i = 0; i < out.length; i++) out[i] = mix(p.pos[i], p.pos2[i], p.mezcla);
  return out;
}
