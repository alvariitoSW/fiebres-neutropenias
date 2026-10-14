// Atlas · 14 Ventrículo derecho: tamaño y función del VD, sobrecarga de presión y de volumen y TEP agudo.
// Reconstruido sobre el motor del latido y el corazón de la app (idea de The Heart by Ultrasound, cap. 13, sin su
// código ni sus valores: allí cada medida sigue una tabla de cifras interpoladas; aquí cada punto del deslizador es un
// corazón del motor y las medidas salen de su latido y de su geometría):
//   · Presión (hipertensión pulmonar crónica): sube la resistencia pulmonar y, con ella, baja la distensibilidad de la
//     arteria pulmonar (el producto R·C se mantiene: fisiología general); el VD primero se adapta (más contractilidad y
//     pared más gruesa) y después se dilata y falla. Su sístole dura más que la del VI (asincronía interventricular:
//     fisiología general), así que el tabique se aplana al final de la sístole.
//   · Volumen (insuficiencia tricuspídea grave): el orificio regurgitante del motor (eroaTricus), retención de líquido y
//     un VD dilatado y algo más rígido; el tabique se aplana en la telediástole, cuando la presión del VD supera a la del VI.
//   · TEP agudo: sube de golpe la resistencia pulmonar sobre un VD sin hipertrofia (pared fina) que se contrae peor.
// Lo que sale del modelo (motor y geometría): el diámetro basal y las áreas del VD en el plano apical de 4 cámaras, la
// FAC, el TAPSE, el grosor de la pared, el índice de excentricidad del VI, la velocidad de la IT (gradiente VD-AD), la
// PSVD (con la PAD estimada por la VCI, como en el cap. 08) y el tiempo de aceleración del TSVD. Lo que no: S′ (el
// modelo mueve el anillo según lo que se vacía el VD y esa velocidad queda por debajo de la real), la muesca
// mesosistólica del flujo pulmonar (hace falta reflexión de ondas, y el lecho pulmonar es un compartimento), el signo de
// McConnell (movimiento regional de la pared libre) y los trombos. Las magnitudes de cada sobrecarga son ilustrativas.
import { crearMotor, BASE } from '../motor.mjs';
import { baseGeometrica, construirCorazon, PHI_SEPTO } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { planoVista, crearEcografo, enPlano } from '../ecografia.mjs';
import { areasAnillo } from '../doppler.mjs';
import { modeloVci } from '../abdomen.mjs';
import { estimarPad } from './hemodinamica.mjs';
import { lienzo, colores, texto, deslizador, segmentos, lecturas, enVivo, casilla, animar, reducirMovimiento, coma } from './figura.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const c01 = (x) => clamp(x, 0, 1);
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

export const CARGAS = ['presion', 'volumen', 'tep'];
export const NOMBRE_CARGA = { presion: 'Presión (HP crónica)', volumen: 'Volumen (IT grave)', tep: 'TEP agudo' };

/**
 * Parámetros del motor en el punto s (0-1) de cada sobrecarga. motor: opciones de crearMotor (estados crónicos, que el
 * corazón ya tiene al empezar); agudo: lo que cambia de golpe sobre un corazón normal ya asentado (el TEP). Ilustrativos,
 * elegidos para que cada sobrecarga recorra lo que describe el texto.
 */
export function ajustesVd(carga, s) {
  const x = c01(s), B = BASE;
  if (carga === 'presion') {
    const k = 1 + 11 * x;                                           // resistencia pulmonar ×1 a ×12
    const ees = x < 0.6 ? 1 + 2.4 * x / 0.6 : 3.4 - 1.9 * (x - 0.6) / 0.4;   // se adapta y después falla
    return { motor: { rPul: B.rPul * k, cAp: B.cAp / k ** 0.9, durVd: 1 + 0.25 * x, mioVd: 1 + 1.4 * Math.min(1, x / 0.7),
      vSangre: B.vSangre + 700 * c01((x - 0.6) / 0.4),
      vd: { ees: B.vd.ees * ees, b: B.vd.b * (1 + x), v0: B.vd.v0 + 160 * c01((x - 0.5) / 0.5) ** 1.5 } } };
  }
  if (carga === 'volumen') {
    return { motor: { eroaTricus: 1.0 * x, vSangre: B.vSangre + 900 * x,
      vd: { v0: B.vd.v0 + 50 * x, b: B.vd.b * (1 + 0.7 * x) }, ad: { v0: B.ad.v0 + 10 * x } } };
  }
  return { motor: {}, agudo: (m) => { m.p.rPul *= 1 + 12 * x; m.p.cAp /= 1 + 6 * x; m.p.vd.ees *= 1 - 0.6 * x; } };
}

/** Motor asentado en el punto s de una sobrecarga (con el barorreflejo, como un paciente). */
export function motorVd(carga, s) {
  const a = ajustesVd(carga, s), m = crearMotor(a.motor);
  m.correr(10); a.agudo?.(m); m.correr(30);
  return m;
}

/** Corte del plano apical de 4 cámaras en una muestra: áreas del VD y del VI y su diámetro máximo en el tercio basal. */
function corteA4c(P, s, extra) {
  const est = estadoGeo(s, extra), g = baseGeometrica(est), h = 0.7;
  let nVd = 0, nVi = 0; const fVd = new Map(), fVi = new Map();
  const fila = (m, v, u) => { const a = m.get(v); if (a) { a[0] = Math.min(a[0], u); a[1] = Math.max(a[1], u); } else m.set(v, [u, u]); };
  for (let v = 0; v <= P.prof; v += h) for (let u = -70; u <= 70; u += h) {
    const p = sum(P.O, sum(esc(P.r, u), esc(P.d, v))), z = p[2]; if (z >= 0) continue;
    const rho = Math.hypot(p[0], p[1]), f = Math.atan2(p[1], p[0]);
    if (z > -g.vi.L && rho < g.rEndoVi(z, f)) { nVi++; if (z > -g.vi.L / 3) fila(fVi, v, u); continue; }
    if (z > -g.Lvd && g.ventana(f) > 0) { const re = g.rEpiVi(z, f); if (rho > re && rho < re + g.wRV(z, f)) { nVd++; if (z > -g.Lvd / 3) fila(fVd, v, u); } }
  }
  const mayor = (m) => { let best = null; for (const [v, [a, b]] of m) if (!best || b - a > best[1] - best[0]) best = [a, b, v]; return best ? { d: (best[1] - best[0] + h) / 10, u0: best[0], u1: best[1], v: best[2] } : { d: 0 }; };
  return { g, est, aVd: nVd * h * h / 100, aVi: nVi * h * h / 100, dVd: mayor(fVd), dVi: mayor(fVi), pared: g.tvdW(30) };
}

/** Índice de excentricidad del VI en el eje corto a la altura de los músculos papilares: D2 (paralelo al tabique) / D1. */
export function indiceExcentricidad(g, z) {
  const d1 = g.rEndoVi(z, PHI_SEPTO) + g.rEndoVi(z, PHI_SEPTO + Math.PI), d2 = g.rEndoVi(z, PHI_SEPTO + Math.PI / 2) + g.rEndoVi(z, PHI_SEPTO - Math.PI / 2);
  return { d1, d2, ei: d2 / d1 };
}
// nivel del eje corto de los papilares (ecografia.mjs, VISTAS.psaxPm): −0,45 de la longitud del VI telediastólico
const nivelPm = (g) => -0.45 * g.vi.L;

/** Muestras clave del último latido: telediástole (VI lleno), telesístole del VI (final de su relajación isovolumétrica, VI
 *  todavía en su volumen mínimo) y el máximo y el mínimo del VD. */
export function muestrasClave(o) {
  const td = o.reduce((a, x) => (x.vvi > a.vvi ? x : a));
  const iE = o.filter(x => x.fase === 'E'), es = iE.length ? iE[iE.length - 1] : o.reduce((a, x) => (x.vvi < a.vvi ? x : a));
  return { td, es, tdD: o.reduce((a, x) => (x.vvd > a.vvd ? x : a)), tsD: o.reduce((a, x) => (x.vvd < a.vvd ? x : a)) };
}

/** Tiempo de aceleración del TSVD (ms): del comienzo del flujo sistólico a su pico (desde que empieza la sístole). */
export function aceleracionTsvd(o) {
  const ia = Math.max(0, o.findIndex(x => x.fase === 'B'));
  let ip = ia; for (let i = ia; i < o.length; i++) if (o[i].qPul > o[ip].qPul) ip = i;
  let i0 = ia; for (let i = ia; i <= ip; i++) if (o[i].qPul <= o[i0].qPul + 0.5) i0 = i;
  let i1 = ip; while (i1 < o.length - 1 && o[i1].qPul > 0.5) i1++;
  return { act: (o[ip].t - o[i0].t) * 1000, et: (o[i1].t - o[i0].t) * 1000, i0, ip, i1 };
}

/** Lo que mide el ecografista en el último latido, más lo que daría un catéter (el motor). */
export function medirVd(m) {
  const o = m.onda, u = m.ultimo, extra = extraDeMotor(m), k = muestrasClave(o);
  const estTd = estadoGeo(k.td, extra), P4 = planoVista('a4c', estTd);
  const D = corteA4c(P4, k.tdD, extra), S = corteA4c(P4, k.tsD, extra), Dv = corteA4c(P4, k.td, extra);
  const zP = nivelPm(baseGeometrica(estTd));
  const eiDe = (s) => { const g = baseGeometrica(estadoGeo(s, extra)), des = g.vi.Le - baseGeometrica(estTd).vi.Le; return indiceExcentricidad(g, zP - des); };
  let grad = 0; for (const x of o) if (!x.vTri && (x.eVd ?? x.eVen) > 0) grad = Math.max(grad, x.pvd - x.pad);
  const vTr = Math.sqrt(Math.max(0, grad) / 4), vci = modeloVci(u.pvc), pad = estimarPad(vci.dmax, vci.colapso);
  const ac = aceleracionTsvd(o);
  const v = {
    dVd: D.dVd.d, dVi: Dv.dVi.d, ratio: D.dVd.d / Math.max(0.1, Dv.dVi.d), dVdLinea: D.dVd,
    aD: D.aVd, aS: S.aVd, fac: (D.aVd - S.aVd) / Math.max(0.1, D.aVd) * 100, pared: D.pared,
    tapse: Math.min(35, 0.285 * (u.edvD - u.esvD)),
    eiD: eiDe(k.td).ei, eiS: eiDe(k.es).ei,
    vTr, gradTr: grad, padEst: pad.pad, vci, rvsp: grad + pad.pad,
    act: ac.act, et: ac.et,
    paps: u.paps, papm: u.papm, pvc: u.pvc, pcp: u.pcp, gc: u.gc, pam: u.pam, fe: u.fe, feD: u.feD,
    edvD: u.edvD, esvD: u.esvD, frT: u.frT ?? 0, vRegT: u.vRegT ?? 0, adMax: Math.max(...o.map(x => x.vad)),
  };
  v.bandas = Object.fromEntries(Object.keys(BANDAS).map(c => [c, banda(c, v[c])]));
  v.patron = patronSepto(v.eiD, v.eiS);
  v.tep = signosTep(v);
  return v;
}

// Bandas de la guía ASE 2025 (Mukherjee, Tabla 1, versión corregida): normal, leve, moderada, grave. [texto, prueba]
export const BANDAS = {
  dVd: [['<4,1', (x) => x < 4.1], ['4,1-4,4', (x) => x <= 4.4], ['4,5-4,9', (x) => x <= 4.9], ['>4,9', () => true]],
  pared: [['<5', (x) => x < 5], ['5-7', (x) => x <= 7], ['7,1-9', (x) => x <= 9], ['>9', () => true]],
  aD: [['<25', (x) => x < 25], ['25-28', (x) => x <= 28], ['28,1-32', (x) => x <= 32], ['>32', () => true]],
  aS: [['<14', (x) => x < 14], ['14-16', (x) => x <= 16], ['16,1-19', (x) => x <= 19], ['>19', () => true]],
  fac: [['>35', (x) => x > 35], ['30-35', (x) => x >= 30], ['23-29', (x) => x >= 23], ['≤22', () => true]],
  tapse: [['>17', (x) => x > 17], ['14-17', (x) => x >= 14], ['11-13', (x) => x >= 11], ['≤10', () => true]],
  vTr: [['<2,8', (x) => x < 2.8], ['2,8-3,1', (x) => x <= 3.1], ['3,2-3,5', (x) => x <= 3.5], ['≥3,6', () => true]],
  rvsp: [['≤34', (x) => x <= 34], ['35-49', (x) => x <= 49], ['50-69', (x) => x <= 69], ['≥70', () => true]],
  act: [['>105', (x) => x > 105], ['80-105', (x) => x >= 80], ['60-79', (x) => x >= 60], ['<60', () => true]],
};
export const GRADO = ['normal', 'leve', 'moderado', 'grave'];
export const banda = (c, x) => (Number.isFinite(x) ? BANDAS[c].findIndex(([, f]) => f(x)) : -1);

// El tabique: plano por encima de 1,1 (ESC/ERS 2022, Humbert, Tabla 10). Patrones del texto (Mukherjee 2025)
export const PLANO = 1.1;
export function patronSepto(eiD, eiS) {
  const d = eiD > PLANO, s = eiS > PLANO;
  return s ? (d ? 'ambos' : 'presion') : d ? 'volumen' : 'ninguno';
}
export const PATRON_TEXTO = {
  ninguno: 'redondo en los dos tiempos: sin patrón de sobrecarga',
  volumen: 'plano solo en telediástole: sobrecarga de volumen del VD',
  presion: 'plano en telesístole: sobrecarga de presión del VD',
  ambos: 'plano en los dos tiempos: sobrecarga de presión del VD, con o sin sobrecarga de volumen',
};

/** Signos de sobrecarga del VD de la guía ESC 2019 de TEP (Konstantinides): sí, no o null (el modelo no lo da). */
export function signosTep(v) {
  return [
    ['VD/VI basal >1,0', v.ratio > 1.0],
    ['Tabique aplanado', v.eiD > PLANO || v.eiS > PLANO],
    ['VCI dilatada con menos colapso inspiratorio', v.vci.dmax > 21 && v.vci.colapso < 0.5],
    ['TAPSE <16 mm', v.tapse < 16],
    ['S′ <9,5 cm/s', null],
    ['Signo 60/60 (TA del TSVD <60 ms con gradiente de IT <60 mmHg)', v.act < 60 && v.gradTr < 60],
    ['Signo de McConnell', null],
    ['Trombo móvil en cavidades derechas', null],
  ];
}

/** Curvas Doppler del último latido desde la onda R: chorro de IT (m/s, del gradiente VD-AD) y flujo del TSVD (m/s). */
export function curvasVd(m) {
  const o = m.onda, T = m.ultimo.periodo, pr = m.p.pr, k = muestrasClave(o);
  const areaTsvd = areasAnillo(baseGeometrica(estadoGeo(k.td, extraDeMotor(m)))).pulmonar / 100;    // cm²
  const desdeR = (t) => ((t - pr) % T + T) % T;
  const it = o.map(x => ({ t: desdeR(x.t), v: (!x.vTri && (x.eVd ?? x.eVen) > 0 && x.pvd > x.pad) ? Math.sqrt((x.pvd - x.pad) / 4) : 0 })).sort((a, b) => a.t - b.t);
  const tsvd = o.map(x => ({ t: desdeR(x.t), v: Math.max(0, x.qPul) / areaTsvd / 100 })).sort((a, b) => a.t - b.t);
  const ac = aceleracionTsvd(o);
  return { it, tsvd, T, t0: desdeR(o[ac.i0].t), tp: desdeR(o[ac.ip].t) };
}

// ---------------------------------------------------------------------------------------------------- figura
const NIVELES = ['normal', 'leve', 'moderada', 'grave'];

export function montar(el) {
  const st = { carga: 'presion', s: 0, cuadro: 'cine', t: 0, jugar: false, pendiente: null };
  const cache = new Map();
  const motorEn = (carga, s) => { const k = `${carga}|${Math.round(s * 20)}`; let r = cache.get(k); if (!r) { const m = motorVd(carga, Math.round(s * 20) / 20); r = { m, v: medirVd(m), c: curvasVd(m) }; cache.set(k, r); } return r; };

  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  segmentos(mandos, { etiqueta: 'Sobrecarga', opciones: CARGAS.map(k => [k, NOMBRE_CARGA[k]]), valor: st.carga,
    onChange: (v) => { st.carga = v; st.jugar = false; anima.el.checked = false; pedir(); } });
  const desl = deslizador(mandos, { etiqueta: 'Gravedad', min: 0, max: 1, paso: 0.05, valor: 0, fmt: (v) => NIVELES[Math.min(3, Math.round(v * 3))],
    marcas: NIVELES, onInput: (v) => { st.s = v; st.jugar = false; anima.el.checked = false; pedir(); } });
  segmentos(mandos, { etiqueta: 'Cuadro', opciones: [['cine', 'Cine'], ['td', 'Telediástole'], ['ts', 'Telesístole']], valor: st.cuadro, onChange: (v) => { st.cuadro = v; pintar(); } });
  const anima = casilla(mandos, { etiqueta: 'Recorrer la progresión', valor: false, onChange: (v) => { st.jugar = v; if (v && st.s >= 0.99) { st.s = 0; desl.set(0); pedir(); } } });

  const fila = document.createElement('div'); fila.className = 'at-par'; el.appendChild(fila);
  const LA = lienzo(fila, 1.0, 'Apical 4 cámaras del corazón de la app con el diámetro basal del VD');
  const LP = lienzo(fila, 1.0, 'Eje corto a la altura de los músculos papilares con los diámetros del índice de excentricidad del VI');
  const LD = lienzo(el, 0.62, 'Doppler continuo del chorro de insuficiencia tricuspídea y Doppler pulsado del tracto de salida del VD');
  const lect = lecturas(el), signos = document.createElement('div'); signos.className = 'at-algo'; el.appendChild(signos);
  const vivo = enVivo(el);

  // ecógrafos (uno por vista: cada uno guarda la rejilla de su plano) y fotogramas: 16 por latido en cine, más TD y TS
  const W_ECO = 300, H_ECO = 260, N_CINE = 16;
  const ecoA = crearEcografo({ ancho: W_ECO, alto: H_ECO }), ecoP = crearEcografo({ ancho: W_ECO, alto: H_ECO });
  let actual = null, planos = null, ref = null;
  const fotos = new Map();
  function prepararPlanos() {
    const { m } = actual, extra = extraDeMotor(m), k = muestrasClave(m.onda), estTd = estadoGeo(k.td, extra);
    planos = { A: planoVista('a4c', estTd), P: planoVista('psaxPm', estTd), k, extra, gTd: baseGeometrica(estTd) };
    ref = construirCorazon(estTd, { pericardio: true }).partes;
    fotos.clear();
  }
  function foto(s, clave) {
    let f = fotos.get(clave); if (f) return f;
    const { extra, gTd, P } = planos, est = estadoGeo(s, extra), geo = construirCorazon(est, { pericardio: true });
    const lienzoDe = (eco, plano) => { const im = eco.formar(geo.partes, plano, { ref, t: s.t ?? 0 }); const c = document.createElement('canvas'); c.width = W_ECO; c.height = H_ECO;
      c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(im.pix), W_ECO, H_ECO), 0, 0); return { c, cx: im.cx, arriba: im.arriba, k: im.escala }; };
    // diámetros del índice de excentricidad, en el nivel del plano: los puntos de la geometría, movidos como la malla
    const g = baseGeometrica(est), des = g.vi.Le - gTd.vi.Le, z = nivelPm(gTd) - des, ie = indiceExcentricidad(g, z);
    const pt = (f) => enPlano(P, geo.flujo.transformar(g.endoVi(z, f)));
    f = { A: lienzoDe(ecoA, planos.A), P: lienzoDe(ecoP, P), ie,
      d1: [pt(PHI_SEPTO), pt(PHI_SEPTO + Math.PI)], d2: [pt(PHI_SEPTO + Math.PI / 2), pt(PHI_SEPTO - Math.PI / 2)] };
    fotos.set(clave, f);
    return f;
  }

  function pedir() {
    if (st.pendiente) return;
    st.pendiente = requestAnimationFrame(() => { st.pendiente = null; actual = { ...motorEn(st.carga, st.s), carga: st.carga, s: st.s }; prepararPlanos(); pintar(); });
  }

  function dibujarEco(L, img, titulo, extra) {
    L.ajustar(); const c = colores(el), { ctx, W, H, k } = L;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const e = Math.min(W / W_ECO, H / H_ECO), ox = (W - W_ECO * e) / 2, oy = (H - H_ECO * e) / 2;
    ctx.imageSmoothingEnabled = true; ctx.drawImage(img.c, ox, oy, W_ECO * e, H_ECO * e);
    const X = (u) => ox + (img.cx + u * img.k) * e, Y = (v) => oy + (img.arriba + v * img.k) * e;
    texto(ctx, titulo, 6 * k, 14 * k, '#eee', k, { tam: 10, peso: 'bold' });
    extra?.(ctx, X, Y, k, c);
  }
  const linea = (ctx, a, b, color, k, X, Y, discontinua) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.8 * k; if (discontinua) ctx.setLineDash([4 * k, 3 * k]);
    ctx.beginPath(); ctx.moveTo(X(a[0]), Y(a[1])); ctx.lineTo(X(b[0]), Y(b[1])); ctx.stroke(); ctx.restore();
  };

  function dibujarDoppler(v, cv) {
    LD.ajustar(); const c = colores(el), { ctx, W, H, k } = LD; ctx.clearRect(0, 0, W, H);
    const x0 = 34 * k, x1 = W - 8 * k, T = cv.T, xT = (t) => x0 + t / T * (x1 - x0);
    const banda = (yA, yB, vmax, curva, color, relleno, titulo, marcas) => {
      const y0 = yA + 16 * k, yv = (x) => y0 + x / vmax * (yB - y0);   // hacia abajo: se aleja de la sonda
      ctx.strokeStyle = c.line; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.moveTo(x0, y0); ctx.lineTo(x0, yB); ctx.stroke();
      texto(ctx, titulo, x0 + 4 * k, yA + 11 * k, c.text, k, { tam: 10, peso: 'bold' });
      for (const [val, t] of marcas) texto(ctx, t, x0 - 4 * k, yv(val) + 3 * k, c.muted, k, { tam: 8, alinear: 'right' });
      ctx.beginPath(); ctx.moveTo(x0, y0); for (const p of curva) ctx.lineTo(xT(p.t), yv(p.v)); ctx.lineTo(x1, y0); ctx.closePath();
      ctx.fillStyle = relleno; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.5 * k; ctx.stroke();
      return yv;
    };
    const mid = H * 0.5;
    const vmaxIt = Math.max(3, Math.ceil(v.vTr + 0.3));
    const yIt = banda(0, mid - 6 * k, vmaxIt, cv.it, c.r, 'rgba(200,90,70,0.2)', 'IT · Doppler continuo (apical)', [[0, '0'], [2, '−2'], ...(vmaxIt >= 4 ? [[4, '−4 m/s']] : [])]);
    const pk = cv.it.reduce((a, p) => (p.v > a.v ? p : a), { v: 0, t: 0 });
    if (pk.v > 0) texto(ctx, `${coma(pk.v, 1)} m/s`, xT(pk.t) + 6 * k, yIt(pk.v) + 4 * k, c.r, k, { tam: 9, halo: c.bg });
    // escala ajustada al flujo (con el VD que falla, el flujo del TSVD es pequeño)
    const vmaxT = Math.max(0.6, Math.ceil(Math.max(...cv.tsvd.map(p => p.v)) * 5) / 5);
    const yT = banda(mid, H - 6 * k, vmaxT, cv.tsvd, c.b, 'rgba(212,175,55,0.18)', 'TSVD · Doppler pulsado (paraesternal)', [[0, '0'], [vmaxT, `−${coma(vmaxT, 1)} m/s`]]);
    // tiempo de aceleración
    const p0 = cv.tsvd.find(p => p.t >= cv.t0) || cv.tsvd[0], pp = cv.tsvd.find(p => p.t >= cv.tp) || p0;
    ctx.save(); ctx.strokeStyle = c.r; ctx.lineWidth = 1.4 * k; ctx.setLineDash([4 * k, 3 * k]);
    ctx.beginPath(); ctx.moveTo(xT(cv.t0), yT(0)); ctx.lineTo(xT(cv.tp), yT(pp.v)); ctx.stroke(); ctx.restore();
    texto(ctx, `TA ${coma(v.act, 0)} ms`, xT(cv.tp) + 6 * k, yT(pp.v * 0.6), c.r, k, { tam: 9, halo: c.bg });
  }

  function pintar() {
    if (!actual) return;
    const { m, v, c: cv } = actual, k = planos.k, o = m.onda;
    let s, clave;
    if (st.cuadro === 'td') { s = k.td; clave = 'td'; }
    else if (st.cuadro === 'ts') { s = k.es; clave = 'ts'; }
    else { const i = Math.floor((st.t % 1) * N_CINE); s = o[Math.min(o.length - 1, Math.round(i / N_CINE * o.length))]; clave = 'c' + i; }
    // cada fotograma se calcula una vez (en cine, uno nuevo por fotograma de pantalla como mucho)
    const f = foto(s, clave);
    const cs = colores(el);
    dibujarEco(LA, f.A, 'Apical 4 cámaras', (ctx, X, Y, kk) => {
      if (st.cuadro === 'td' || st.cuadro === 'cine') {
        const d = v.dVdLinea; if (d.d && st.cuadro === 'td') { linea(ctx, [d.u0, d.v], [d.u1, d.v], cs.r, kk, X, Y); texto(ctx, `VD basal ${coma(d.d, 1)} cm`, Math.max(X(d.u0), 4 * kk), Y(d.v) + 14 * kk, cs.r, kk, { tam: 9, halo: '#000' }); }
      }
      texto(ctx, 'VD', X(-35), Y(95), '#ddd', kk, { tam: 9, halo: '#000' }); texto(ctx, 'VI', X(25), Y(95), '#ddd', kk, { tam: 9, halo: '#000' });
    });
    dibujarEco(LP, f.P, 'Eje corto · papilares', (ctx, X, Y, kk) => {
      linea(ctx, f.d1[0], f.d1[1], cs.r, kk, X, Y); linea(ctx, f.d2[0], f.d2[1], cs.y, kk, X, Y, true);
      texto(ctx, `IE ${coma(f.ie.ei, 2)}`, X(f.d2[0][0]) + 6 * kk, Y(f.d2[0][1]) - 6 * kk, cs.y, kk, { tam: 9, halo: '#000' });
      texto(ctx, 'D1', X(f.d1[1][0]) + 4 * kk, Y(f.d1[1][1]) + 10 * kk, cs.r, kk, { tam: 9, halo: '#000' });
    });
    dibujarDoppler(v, cv);
    const B = v.bandas, g = (c) => (B[c] > 0 ? ` · ${GRADO[B[c]]}` : '');
    const fila = (kk, val, u, c, fuente) => ({ k: kk, v: val, u: `${u}${c ? g(c) : ''}`, aviso: c ? B[c] > 0 : false, fuente });
    const filas = [
      fila('Diámetro basal del VD (TD)', coma(v.dVd, 1), 'cm · normal <4,1', 'dVd', 'geometría (A4C)'),
      fila('Pared libre del VD (TD)', coma(v.pared, 1), 'mm · normal <5', 'pared', 'geometría'),
      fila('Área del VD TD · TS', `${coma(v.aD, 0)} · ${coma(v.aS, 0)}`, 'cm² · normal <25 · <14', v.bandas.aD >= v.bandas.aS ? 'aD' : 'aS', 'geometría (A4C)'),
      fila('FAC', coma(v.fac, 0), '% · normal >35', 'fac', 'geometría'),
      fila('TAPSE', coma(v.tapse, 0), 'mm · normal >17', 'tapse', 'modelo (lo que se vacía el VD)'),
      { k: 'S′', v: '—', u: 'normal >9,5 cm/s', fuente: 'el modelo no lo da' },
      fila('Velocidad máxima de la IT', coma(v.vTr, 1), 'm/s', 'vTr', 'motor (gradiente VD-AD)'),
      fila('PSVD = 4v² + PAD', coma(v.rvsp, 0), `mmHg · PAD ${v.padEst} por la VCI`, 'rvsp', 'motor + VCI'),
      fila('Tiempo de aceleración del TSVD', coma(v.act, 0), 'ms · normal >105', 'act', 'motor'),
      { k: 'IE del VI · TD · TS', v: `${coma(v.eiD, 2)} · ${coma(v.eiS, 2)}`, u: `plano >1,1`, aviso: v.patron !== 'ninguno', fuente: 'geometría (eje corto)' },
      { k: 'VD/VI basal', v: coma(v.ratio, 2), u: 'TEP: >1,0', aviso: v.ratio > 1, fuente: 'geometría (A4C)' },
      { k: 'AP sistólica · media (catéter)', v: `${coma(v.paps, 0)} · ${coma(v.papm, 0)}`, u: 'mmHg · HP: media >20', aviso: v.papm > 20, fuente: 'motor' },
      { k: 'PVC · GC (catéter)', v: `${coma(v.pvc, 0)} · ${coma(v.gc, 1)}`, u: 'mmHg · L/min', fuente: 'motor' },
    ];
    if (v.frT > 0.02) filas.push({ k: 'Fracción regurgitante tricuspídea', v: coma(v.frT * 100, 0), u: '%', fuente: 'motor' });
    lect.pintar(filas);
    pintarSignos(v);
    vivo.pintar(textoVivo(v));
  }

  function pintarSignos(v) {
    if (st.carga !== 'tep') { signos.innerHTML = `<h4>El tabique</h4><div class="at-paso on">${PATRON_TEXTO[v.patron]} (IE ${coma(v.eiD, 2)} en telediástole y ${coma(v.eiS, 2)} en telesístole).</div>`; return; }
    const est = (x) => (x === null ? '<span class="at-gris">el modelo no lo da</span>' : x ? '<b class="at-mal">sí</b>' : '<span class="at-bien">no</span>');
    const dil = v.dVd > 4.0, dis = v.ratio >= 1 && v.tapse < 16, esp = v.act < 60 && v.gradTr < 60;
    signos.innerHTML = `<h4>Signos de sobrecarga del VD en el TEP (ESC 2019)</h4><ul>${v.tep.map(([t, x]) => `<li>${t}: ${est(x)}</li>`).join('')}</ul>
      <div class="at-paso on"><b>Hallazgo</b> · ${esp ? 'signo específico (60/60)' : dis ? 'disfunción del VD (VD/VI ≥1,0 con TAPSE <16 mm)' : dil ? 'dilatación del VD (diámetro basal >4,0 cm)' : 'sin dilatación del VD'}. Son hallazgos ecocardiográficos, no clases de riesgo.</div>`;
  }

  function textoVivo(v) {
    const n = NIVELES[Math.min(3, Math.round(st.s * 3))], p = PATRON_TEXTO[v.patron];
    if (st.s < 0.05) return `<b>Corazón normal.</b> El VD es más pequeño que el VI y el VI forma el ápex; el tabique es redondo en los dos tiempos (IE ${coma(v.eiD, 2)}). El flujo del TSVD tarda ${coma(v.act, 0)} ms en llegar a su pico.`;
    if (st.carga === 'presion') return `<b>Sobrecarga de presión ${n}.</b> La resistencia pulmonar sube y la arteria pulmonar se vuelve más rígida: el flujo del TSVD llega antes a su pico (TA ${coma(v.act, 0)} ms) y la IT sube a ${coma(v.vTr, 1)} m/s. ${
      v.fac > 35 ? 'El VD se adapta: la pared se engruesa' : 'El VD ya no se adapta: se dilata y su función cae'} (pared ${coma(v.pared, 1)} mm, FAC ${coma(v.fac, 0)}%, TAPSE ${coma(v.tapse, 0)} mm). El tabique: ${p}.${
      st.s > 0.85 ? ` Con el VD fallando, la presión pulmonar ya no sube (PSVD ${coma(v.rvsp, 0)} mmHg): la velocidad de la IT depende también de la fuerza del VD.` : ''}`;
    if (st.carga === 'volumen') return `<b>Sobrecarga de volumen ${n}.</b> La insuficiencia tricuspídea devuelve un ${coma(v.frT * 100, 0)}% de lo que expulsa el VD: las cavidades derechas se dilatan (VD ${coma(v.dVd, 1)} cm) con una presión casi normal, y la función del VD se mantiene (FAC ${coma(v.fac, 0)}%, TAPSE ${coma(v.tapse, 0)} mm). La velocidad de la IT cae a ${coma(v.vTr, 1)} m/s: en la IT grave infraestima el gradiente VD-AD. El tabique: ${p}.`;
    return `<b>TEP ${n}.</b> Sobre un VD sin hipertrofia (pared ${coma(v.pared, 1)} mm), la poscarga sube de golpe: el VD se dilata (VD/VI ${coma(v.ratio, 2)}), su función cae (TAPSE ${coma(v.tapse, 0)} mm, FAC ${coma(v.fac, 0)}%) y el GC baja a ${coma(v.gc, 1)} L/min, pero la IT solo llega a ${coma(v.vTr, 1)} m/s (gradiente ${coma(v.gradTr, 0)} mmHg). El tabique: ${p}.`;
  }

  pedir();
  let acum = 0;
  const anim = animar(LA.c, (dt) => {
    if (st.jugar) { acum += dt; if (acum > 0.6) { acum = 0; st.s = Math.min(1, Math.round((st.s + 0.05) * 20) / 20); desl.set(st.s); pedir(); if (st.s >= 1) { st.jugar = false; anima.el.checked = false; } } }
    if (st.cuadro === 'cine' && actual && !reducirMovimiento()) { st.t += dt * 0.5 / actual.m.ultimo.periodo; pintar(); }
  });
  const ro = new ResizeObserver(() => pintar()); ro.observe(LA.c);
  return { parar() { anim.parar(); ro.disconnect(); if (st.pendiente) cancelAnimationFrame(st.pendiente); } };
}
