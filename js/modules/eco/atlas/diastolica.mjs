// Atlas · 10 Función diastólica: del llenado normal al restrictivo, con el algoritmo de la guía ASE 2025 (Nagueh).
// Reconstruido sobre el motor del latido de la app (idea de The Heart by Ultrasound, cap. 11, sin su código ni sus
// valores: allí cada patrón son cifras fijas interpoladas; aquí cada punto del deslizador es un corazón del motor):
//   · relajación lenta: la cola exponencial de la activación del VI se alarga (motor.relajacion; τ del modelo)
//   · rigidez: el coeficiente de la curva diastólica del VI sube (vi.b)
//   · presión de llenado: más volumen de sangre (vSangre)
//   · remodelado de la AI con la presión crónica: su volumen sin tensión sube (ai.v0) — ilustrativo
// E, A, TDE y TRIV salen del motor (el flujo mitral, con la inercia de la sangre, entre el área del anillo de la
// geometría: lo mismo que mide el Doppler del simulador). La velocidad del chorro de IT, del gradiente VD-AD. La AI, de
// su volumen. e′ es ilustrativo: depende de la relajación del motor (la guía: «depende directamente de la relajación»).
// El cociente S/D de las venas pulmonares no se calcula: el motor no tiene el efecto pistón del plano AV ni la
// relajación auricular que dan la onda S. En el paso 3 se usan el volumen de la AI, el strain de reservorio (aproximado
// por volumen) y el TRIV, que la Figura 3 de la guía da como alternativa.
import { crearMotor } from '../motor.mjs';
import { geomVi, baseGeometrica } from '../corazon-geo.mjs';
import { areasAnillo, velOrificio, tdeDe } from '../doppler.mjs';
import { estadoGeo } from '../formas.mjs';
import { lienzo, colores, texto, deslizador, lecturas, enVivo, casilla, animar, coma } from './figura.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const mix = (a, b, t) => a + (b - a) * t;

// Cuatro corazones de referencia del deslizador (0 normal, 1 relajación lenta, 2 presión de la AI elevada, 3
// restrictivo). Entre ellos, interpolación de los parámetros (no de los resultados: cada punto es un motor). Valores
// ilustrativos, elegidos para que cada corazón caiga en su patrón de la guía.
export const CORAZONES_LLENADO = [
  { relajacion: 1.0, rigidez: 1.0, volumen: 0, aiV0: 5 },
  { relajacion: 2.8, rigidez: 1.0, volumen: 0, aiV0: 5 },
  { relajacion: 2.8, rigidez: 1.6, volumen: 500, aiV0: 18 },
  { relajacion: 2.8, rigidez: 2.3, volumen: 850, aiV0: 28 },
];

/** Parámetros del motor en el punto f (0-3) del deslizador. */
export function ajustesLlenado(f) {
  const x = clamp(f, 0, 3), i = Math.min(2, Math.floor(x)), u = x - i, a = CORAZONES_LLENADO[i], b = CORAZONES_LLENADO[i + 1];
  const k = (c) => mix(a[c], b[c], u);
  return { relajacion: k('relajacion'), rigidez: k('rigidez'), volumen: k('volumen'), aiV0: k('aiV0') };
}

/** Motor asentado en el punto f, sin barorreflejo (el patrón de llenado, sin la respuesta refleja). */
export function motorLlenado(f, segundos = 12) {
  const a = ajustesLlenado(f);
  const m = crearMotor({ barorreflejo: false, relajacion: a.relajacion, vi: { b: 0.017 * a.rigidez }, ai: { v0: a.aiV0 }, vSangre: 4850 + a.volumen });
  m.correr(segundos);
  return m;
}

// e′ del anillo lateral normal (cm/s) y cuánto cae con la relajación lenta: e′ = 12 / relajación^0,6. El septal, el
// 80% del lateral. Ilustrativo (fisiología general: e′ depende sobre todo de la relajación; el septal es menor)
export const E_PRIMA_NORMAL = 12, E_PRIMA_EXP = 0.6, SEPTAL = 0.8;
export function ePrima(relajacion) {
  const lat = E_PRIMA_NORMAL / Math.pow(relajacion, E_PRIMA_EXP), sep = SEPTAL * lat;
  return { lat, sep, avg: (lat + sep) / 2 };
}

/** Curvas del último latido desde la onda R: flujo mitral (cm/s) y velocidad del anillo lateral (cm/s, + hacia el ápex). */
export function curvasLlenado(m) {
  const o = m.onda, u = m.ultimo, T = u.periodo, pr = m.p.pr;
  const td = o.reduce((a, x) => (x.vvi > a.vvi ? x : a));
  const areas = areasAnillo(baseGeometrica(estadoGeo(td)));
  const desdeR = (t) => ((t - pr) % T + T) % T;
  const mitral = o.map(x => ({ t: desdeR(x.t), v: velOrificio('mitral', x, areas), fase: x.fase })).sort((a, b) => a.t - b.t);
  // anillo: lo que cambia la longitud del VI en la geometría de la app (la base baja hacia el ápex al vaciarse y
  // sube al llenarse); la onda de llenado rápido se escala a e′ (relajación), ver ePrima
  const mio = m.p.mioVi ?? 1, le = o.map(x => geomVi(x.vvi, mio).Le);
  let anillo = o.map((x, i) => { const a = le[(i - 1 + o.length) % o.length], b = le[(i + 1) % o.length];
    return { t: desdeR(x.t), v: -(b - a) / (2 * 0.002) / 10, fase: x.fase }; }).sort((a, b) => a.t - b.t);
  const tMvo = desdeR(u.tMitAbre), finE = anillo.filter(x => x.t > tMvo && (x.fase === 'F' || x.fase === 'E'));
  const picoE = finE.reduce((a, x) => Math.max(a, -x.v), 0), e = ePrima(m.p.relajacion);
  if (picoE > 0) { const k = e.lat / picoE; const fin = finE.length ? finE[finE.length - 1].t : tMvo;
    anillo = anillo.map(x => (x.t >= tMvo && x.t <= fin + 0.04 && x.v < 0 ? { ...x, v: x.v * (x.t <= fin ? k : mix(k, 1, (x.t - fin) / 0.04)) } : x)); }
  return { mitral, anillo, T, tMvo, tAvc: desdeR(u.tS2), tAvo: desdeR(u.tAoAbre), tS1: desdeR(u.tS1) };
}

/** Lo que mide el ecografista en el último latido, más la presión de la AI del motor (lo que daría un catéter). */
export function medirLlenado(m) {
  const o = m.onda, u = m.ultimo, c = curvasLlenado(m);
  const pico = (xs) => xs.reduce((a, x) => (x.v > a.v ? x : a), { v: 0, t: 0 });
  const enF = (fs) => c.mitral.filter(x => fs.includes(x.fase));
  const E = pico(enF('FG')), A = pico(enF('A'));
  const e = ePrima(m.p.relajacion);
  const vaiMax = Math.max(...o.map(x => x.vai)), vaiMin = Math.min(...o.map(x => x.vai));
  const dtr = Math.max(0, ...o.filter(x => x.eVen > 0).map(x => x.pvd - x.pad));
  return {
    E: E.v, A: A.v, ea: A.v ? E.v / A.v : null, tde: tdeDe(c.mitral, c.mitral.indexOf(E), 1),
    sep: e.sep, lat: e.lat, avg: e.avg,
    eeSep: E.v / e.sep, eeLat: E.v / e.lat, eeAvg: E.v / e.avg,
    vTr: Math.sqrt(dtr / 4), psvd: u.pvd_max, lavi: vaiMax / m.p.sc, lars: (Math.cbrt(vaiMax / vaiMin) - 1) * 100,
    triv: (u.tMitAbre - u.tS2) * 1000, pai: u.pcp, ptdvi: u.ptdvi, fe: u.fe, fc: u.fc, pas: u.pas,
    // τ de la relajación activa del modelo (ms): la constante de tiempo de la cola de la activación del VI
    tau: 0.162 * (1 - m.p.fSubida) * m.p.tsVen * Math.sqrt(u.periodo / (60 / 70)) * m.p.relajacion * 1000,
  };
}

// Cortes de la Figura 3 de la guía ASE 2025 (Nagueh)
export const CORTES = {
  sep: (v) => v.sep <= 6, lat: (v) => v.lat <= 7, avg: (v) => v.avg <= 6.5,
  eeSep: (v) => v.eeSep >= 15, eeLat: (v) => v.eeLat >= 13, eeAvg: (v) => v.eeAvg >= 14,
  tr: (v) => v.vTr >= 2.8, lars: (v) => v.lars <= 18, lavi: (v) => v.lavi > 34, triv: (v) => v.triv <= 70,
};

/**
 * Algoritmo de la guía ASE 2025 en ritmo sinusal (Nagueh 2025, Figura 3). Paso 1: e′ reducida, E/e′ elevado y
 * velocidad de IT ≥2,8 m/s. Paso 2: rama según cuáles son anómalas. Paso 3 (si hace falta): S/D ≤0,67, strain de
 * reservorio de la AI ≤18%, volumen de la AI >34 mL/m², o el TRIV ≤70 ms como alternativa. Paso 4: con la PAI
 * elevada, E/A <2 es grado 2 y ≥2, grado 3. Sin S/D (el modelo no lo da), el paso 3 usa los otros tres.
 */
export function algoritmoAse(v) {
  const eRed = CORTES.sep(v) || CORTES.lat(v) || CORTES.avg(v);
  const eeUp = CORTES.eeSep(v) || CORTES.eeLat(v) || CORTES.eeAvg(v);
  const trUp = CORTES.tr(v), n = eRed + eeUp + trUp;
  const paso1 = { eRed, eeUp, trUp, n }, grado = v.ea >= 2 ? 3 : 2;
  if (n === 0) return { paso1, rama: 'a', pai: 'normal', grado: 0 };
  if (n === 3) return { paso1, rama: 'e', pai: 'elevada', grado };
  if (n === 1 && eRed && v.ea <= 0.8) return { paso1, rama: 'b', pai: 'normal', grado: 1 };
  const rama = n === 1 && eRed ? 'c' : 'd';
  const paso3 = { lars: CORTES.lars(v), lavi: CORTES.lavi(v), triv: CORTES.triv(v) };
  if (paso3.lars || paso3.lavi || paso3.triv) return { paso1, paso3, rama, pai: 'elevada', grado };
  return { paso1, paso3, rama, pai: 'normal', grado: null };
}

export const NOMBRE_RESULTADO = (r) => r.grado === 0 ? 'Función diastólica normal' : r.grado === 1 ? 'Disfunción diastólica de grado 1'
  : r.grado === null ? 'PAI normal, sin grado' : `Disfunción diastólica de grado ${r.grado}`;
const PATRON = (r) => r.grado === 0 ? 'normal' : r.grado === 1 ? 'relajación lenta' : r.grado === null ? 'PAI normal' : r.grado === 2 ? 'PAI elevada (seudonormal)' : 'restrictivo';
const RAMA = { a: 'las tres normales', b: 'solo e′ reducida y E/A ≤0,8', c: 'solo e′ reducida y E/A >0,8', d: 'una o dos anómalas', e: 'las tres anómalas' };

// ---------------------------------------------------------------------------------------------------- figura
export function montar(el) {
  const st = { f: 0, jugar: false, pendiente: null };
  const cache = new Map();
  const motorEn = (f) => { const k = Math.round(f * 20) / 20; let m = cache.get(k); if (!m) { m = motorLlenado(k); cache.set(k, m); } return m; };

  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  const desl = deslizador(mandos, { etiqueta: 'Patrón de llenado', min: 0, max: 3, paso: 0.05, valor: 0,
    fmt: (v) => coma(v, 2), marcas: ['normal', 'relajación lenta', 'PAI elevada', 'restrictivo'],
    onInput: (v) => { st.f = v; st.jugar = false; anima.el.checked = false; pedir(); } });
  const anima = casilla(mandos, { etiqueta: 'Recorrer la progresión', valor: false, onChange: (v) => { st.jugar = v; if (v && st.f >= 2.99) { st.f = 0; desl.set(0); pedir(); } } });

  const caja = document.createElement('div'); caja.className = 'at-diag'; el.appendChild(caja);
  const L1 = lienzo(caja, 0.5, 'Doppler pulsado del llenado mitral del motor: ondas E y A con el tiempo de desaceleración');
  const L2 = lienzo(caja, 0.42, 'Doppler tisular del anillo mitral lateral: ondas s′, e′ y a′');
  const lect = lecturas(el), algo = document.createElement('div'); algo.className = 'at-algo'; el.appendChild(algo);
  const vivo = enVivo(el);

  let ultimo = null;
  function pedir() {
    // el motor tarda ~0,1-0,4 s: se calcula en el siguiente fotograma, y si llegan más cambios, solo el último
    if (st.pendiente) return;
    st.pendiente = requestAnimationFrame(() => { st.pendiente = null; ultimo = { f: st.f, m: motorEn(st.f) }; pintar(); });
  }

  const eje = (L, curvas, { max, min, titulo, etiquetas, c }) => {
    const { ctx, W, H, k } = L; ctx.clearRect(0, 0, W, H);
    const x0 = 34 * k, x1 = W - 8 * k, y0 = 18 * k, y1 = H - 18 * k, T = curvas.T;
    const yV = (v) => y0 + (max - v) / (max - min) * (y1 - y0), xT = (t) => x0 + t / T * (x1 - x0);
    ctx.strokeStyle = c.line; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.moveTo(x0, yV(0)); ctx.lineTo(x1, yV(0)); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
    // las dos marcas suelen estar juntas (el TRIV): el rótulo del cierre a la izquierda de su línea, el de la apertura
    // a la derecha de la suya
    for (const [t, n, al] of [[curvas.tAvc, 'cierre Ao', 'right'], [curvas.tMvo, 'apertura M', 'left']]) {
      ctx.setLineDash([3 * k, 3 * k]); ctx.beginPath(); ctx.moveTo(xT(t), y0); ctx.lineTo(xT(t), y1); ctx.stroke(); ctx.setLineDash([]);
      texto(ctx, n, xT(t) + (al === 'left' ? 3 : -3) * k, y1 - 2 * k, c.muted, k, { tam: 8, alinear: al, halo: c.bg });
    }
    texto(ctx, titulo, x0 + 4 * k, y0 - 5 * k, c.text, k, { tam: 10, peso: 'bold' });
    for (const [v, n] of etiquetas) texto(ctx, n, x0 - 4 * k, yV(v) + 3 * k, c.muted, k, { tam: 8, alinear: 'right' });
    return { xT, yV, x0, x1, y0, y1, ctx, k };
  };
  const trazo = (g, pts, color, relleno) => {
    const { ctx, xT, yV, k } = g; ctx.beginPath(); ctx.moveTo(xT(pts[0].t), yV(0));
    for (const p of pts) ctx.lineTo(xT(p.t), yV(p.v)); ctx.lineTo(xT(pts[pts.length - 1].t), yV(0)); ctx.closePath();
    ctx.fillStyle = relleno; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.6 * k; ctx.stroke();
  };

  function pintar() {
    if (!ultimo) return;
    L1.ajustar(); L2.ajustar();
    const c = colores(el), m = ultimo.m, cv = curvasLlenado(m), v = medirLlenado(m), r = algoritmoAse(v);
    // mitral
    const vmax = Math.max(1.6, Math.ceil(Math.max(v.E, v.A) / 50) * 0.5);
    const g1 = eje(L1, cv, { max: vmax * 100, min: -10, titulo: 'Llenado mitral (Doppler pulsado)', etiquetas: [[0, '0'], [100, '1 m/s'], ...(vmax >= 2 ? [[200, '2']] : [])], c });
    trazo(g1, cv.mitral, c.b, 'rgba(212,175,55,0.18)');
    const iE = cv.mitral.reduce((a, x, i, arr) => ('FG'.includes(x.fase) && x.v > arr[a].v ? i : a), cv.mitral.findIndex(x => 'FG'.includes(x.fase)));
    const pE = cv.mitral[iE], pA = cv.mitral.filter(x => x.fase === 'A').reduce((a, x) => (x.v > a.v ? x : a), { v: 0, t: 0 });
    texto(g1.ctx, 'E', g1.xT(pE.t), g1.yV(pE.v) - 4 * g1.k, c.text, g1.k, { tam: 11, peso: 'bold', alinear: 'center', halo: c.bg });
    if (pA.v > 3) texto(g1.ctx, 'A', g1.xT(pA.t), g1.yV(pA.v) - 4 * g1.k, c.text, g1.k, { tam: 11, peso: 'bold', alinear: 'center', halo: c.bg });
    if (v.tde) { const { ctx, xT, yV, k } = g1; ctx.strokeStyle = c.r; ctx.lineWidth = 1.4 * k; ctx.setLineDash([4 * k, 3 * k]);
      ctx.beginPath(); ctx.moveTo(xT(pE.t), yV(pE.v)); ctx.lineTo(xT(pE.t + v.tde / 1000), yV(0)); ctx.stroke(); ctx.setLineDash([]);
      texto(ctx, `TDE ${coma(v.tde, 0)} ms`, xT(pE.t + v.tde / 2000) + 4 * k, yV(pE.v / 2), c.r, k, { tam: 9, halo: c.bg }); }
    // anillo
    const g2 = eje(L2, cv, { max: 14, min: -16, titulo: 'Anillo mitral lateral (Doppler tisular)', etiquetas: [[0, '0'], [10, '10'], [-10, '−10 cm/s']], c });
    trazo(g2, cv.anillo, c.g, 'rgba(120,170,110,0.18)');
    const pS = cv.anillo.filter(x => 'BCD'.includes(x.fase)).reduce((a, x) => (x.v > a.v ? x : a), { v: 0, t: 0 });
    const pe = cv.anillo.filter(x => x.t > cv.tMvo && 'EF'.includes(x.fase)).reduce((a, x) => (x.v < a.v ? x : a), { v: 0, t: 0 });
    const pa = cv.anillo.filter(x => x.fase === 'A').reduce((a, x) => (x.v < a.v ? x : a), { v: 0, t: 0 });
    texto(g2.ctx, 's′', g2.xT(pS.t), g2.yV(pS.v) - 4 * g2.k, c.text, g2.k, { tam: 10, peso: 'bold', alinear: 'center', halo: c.bg });
    texto(g2.ctx, 'e′', g2.xT(pe.t) + 10 * g2.k, g2.yV(pe.v) + 4 * g2.k, c.text, g2.k, { tam: 10, peso: 'bold', alinear: 'center', halo: c.bg });
    if (pa.v < -1) texto(g2.ctx, 'a′', g2.xT(pa.t), g2.yV(pa.v) + 12 * g2.k, c.text, g2.k, { tam: 10, peso: 'bold', alinear: 'center', halo: c.bg });

    const fila = (k, val, u, mal, fuente) => ({ k, v: val, u, aviso: mal, fuente });
    lect.pintar([
      fila('E · A', `${coma(v.E / 100, 2)} · ${coma(v.A / 100, 2)}`, 'm/s', false, 'motor'),
      fila('E/A', coma(v.ea, 2), '', v.ea <= 0.8 || v.ea >= 2, 'motor'),
      fila('TDE', v.tde ? coma(v.tde, 0) : '—', 'ms', false, 'motor'),
      fila('e′ septal · lateral', `${coma(v.sep, 1)} · ${coma(v.lat, 1)}`, 'cm/s · corte ≤6 · ≤7', CORTES.sep(v) || CORTES.lat(v), 'ilustrativo (relajación del motor)'),
      fila('E/e′ medio', coma(v.eeAvg, 1), 'corte ≥14', CORTES.eeAvg(v), 'motor e ilustrativo'),
      fila('Velocidad de IT', coma(v.vTr, 2), 'm/s · corte ≥2,8', CORTES.tr(v), 'motor (gradiente VD-AD)'),
      fila('Volumen de la AI', coma(v.lavi, 0), 'mL/m² · corte >34', CORTES.lavi(v), 'motor'),
      fila('Strain de reservorio AI', coma(v.lars, 0), '% · corte ≤18', CORTES.lars(v), 'aproximado por volumen (ilustrativo)'),
      fila('TRIV', coma(v.triv, 0), 'ms · corte ≤70', CORTES.triv(v), 'motor'),
      fila('Relajación del modelo', coma(v.tau, 0), 'ms (constante τ)', false, 'relajación activa'),
      fila('PAI media (catéter)', coma(v.pai, 1), 'mmHg · ref. 6-12', v.pai > 12, 'motor · Ficha 5'),
      fila('FEVI', coma(v.fe * 100, 0), '%', v.fe < 0.5, 'motor'),
    ]);
    pintarAlgoritmo(v, r);
    const acierto = (r.pai === 'elevada') === (v.pai > 12);
    vivo.pintar(`<b>Patrón ${PATRON(r)}.</b> ${{
      0: 'Relajación normal: el VI se relaja deprisa y aspira la sangre al abrirse la mitral, así que la E domina y la contracción auricular aporta poco.',
      1: 'La relajación es lenta (τ alargado): el TRIV se alarga, la presión del VI baja tarde, la E cae y el llenado se desplaza a la contracción auricular (A alta). La presión de la AI todavía es normal.',
      2: 'El VI se ha hecho más rígido y la presión de la AI sube: empuja la E de nuevo hacia arriba, así que el llenado mitral parece normal (seudonormal), pero e′ sigue baja y E/e′ sube.',
      3: 'Rigidez alta y presión de la AI muy elevada: la mitral se abre pronto (TRIV corto), la E es alta y decelera muy deprisa (TDE corto) y la aurícula, que empuja contra un VI ya lleno, aporta poco.',
    }[Math.round(ultimo.f)]} Con el algoritmo: <b>${NOMBRE_RESULTADO(r)}</b> (PAI ${r.pai}); la presión de la AI del motor es ${coma(v.pai, 0)} mmHg${acierto ? ', que coincide' : ', que <b>no</b> coincide del todo (ver el texto: el algoritmo acierta en el 86%)'}.`);
  }

  function pintarAlgoritmo(v, r) {
    const ok = (b) => b ? '<b class="at-mal">anómalo</b>' : '<span class="at-bien">normal</span>';
    const p1 = r.paso1, p3 = r.paso3;
    const caja = (on, html) => `<div class="at-paso${on ? ' on' : ''}">${html}</div>`;
    algo.innerHTML = `<h4>Algoritmo ASE 2025 (ritmo sinusal) con estas medidas</h4>
      ${caja(true, `<b>Paso 1</b><ul><li>e′ reducida (septal ≤6, lateral ≤7 o media ≤6,5 cm/s): ${ok(p1.eRed)}</li>
        <li>E/e′ elevado (septal ≥15, lateral ≥13 o medio ≥14): ${ok(p1.eeUp)}</li>
        <li>Velocidad de IT ≥2,8 m/s: ${ok(p1.trUp)}</li></ul>`)}
      ${caja(true, `<b>Paso 2</b> · ${RAMA[r.rama]}${r.rama === 'b' || r.rama === 'c' ? ` (E/A ${coma(v.ea, 2)})` : ''}`)}
      ${caja(!!p3, p3 ? `<b>Paso 3</b><ul><li>Strain de reservorio de la AI ≤18%: ${ok(p3.lars)}</li><li>Volumen de la AI >34 mL/m²: ${ok(p3.lavi)}</li>
        <li>TRIV ≤70 ms (alternativa): ${ok(p3.triv)}</li><li>S/D de las venas pulmonares ≤0,67: <span class="at-gris">no lo da el modelo</span></li></ul>`
        : '<b>Paso 3</b> · no hace falta')}
      ${caja(true, `<b>Resultado</b> · PAI ${r.pai}${r.pai === 'elevada' ? ` → paso 4: E/A ${coma(v.ea, 2)} ${v.ea >= 2 ? '≥2' : '<2'}` : ''} → <b>${NOMBRE_RESULTADO(r)}</b>`)}`;
  }

  pedir();
  let acum = 0;
  const anim = animar(L1.c, (dt) => {
    if (!st.jugar) return;
    acum += dt; if (acum < 0.45) return; acum = 0;
    st.f = Math.min(3, Math.round((st.f + 0.1) * 20) / 20); desl.set(st.f); pedir();
    if (st.f >= 3) { st.jugar = false; anima.el.checked = false; }
  });
  const ro = new ResizeObserver(() => pintar()); ro.observe(L1.c);
  return { parar() { anim.parar(); ro.disconnect(); if (st.pendiente) cancelAnimationFrame(st.pendiente); } };
}
