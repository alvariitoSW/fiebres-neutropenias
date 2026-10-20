// Wiggers y asa presión-volumen que siguen al corazón 3D.
//
// Regla (la misma que usa The Heart by Ultrasound, estudiada en echodemo): no hay dos relojes que
// sincronizar. En cada fotograma la página decide UN estado —el del motor mientras corre, o una
// muestra del último latido cuando se revisa un instante a mano— y con ese mismo objeto dibuja el
// corazón, el cursor del Wiggers, el punto del asa, la barra del ciclo y las cifras.
//
// Las curvas de fondo son el último latido completo (motor.onda); encima, mientras corre, el latido
// en curso (motor.ondaActual), que termina justo en el punto del cursor.
//
// Las funciones puras (fases, muestras, escalas) no usan el DOM y las comprueban las pruebas.
//
// Al final, los tres paneles de la hemodinámica de Marino (Guyton con la EPP y el bolo, el catéter que avanza y la
// termodilución): leen el mismo estado del fotograma con lecturas.mjs y mueven volumen con maniobras.mjs.
import { epp, bolo, SEGUNDOS_MANIOBRA, faltaParaAsentar } from './maniobras.mjs';
import { guyton, curvaFuncion, presionEnPunta, lecturaCateter, curvaTermo, medidasTermo, LUGARES, ORDEN_LUGARES } from './lecturas.mjs';
import { REFERENCIAS } from './referencias.mjs';
import { cargarMotion, sinMovimiento } from '../../core/motion.js';

// Colores opacos de las fases A-G (los mismos de la barra del ciclo)
export const COLOR_FASE = { A: '#8aa37b', B: '#cf9a3e', C: '#c9534a', D: '#e0958e', E: '#e6c483', F: '#9b7bb8', G: '#cbb8dd' };

// Qué curvas lleva cada lado. Los eventos son claves de motor.ultimo.
export const LADOS = {
  izquierdo: {
    presiones: [['pao', 'Aorta', '--r'], ['pvi', 'VI', '--b'], ['pai', 'AI', '--p']],
    vol: 'vvi', volNombre: 'Volumen VI', pv: 'pvi', camara: 'vi', ees: 'eesVi', pMin: 140,
    eventos: [['tS1', 'S1'], ['tAoAbre', 'abre Ao'], ['tS2', 'S2'], ['tMitAbre', 'abre mitral']],
  },
  derecho: {
    presiones: [['pap', 'Pulmonar', '--r'], ['pvd', 'VD', '--b'], ['pad', 'AD', '--p']],
    vol: 'vvd', volNombre: 'Volumen VD', pv: 'pvd', camara: 'vd', ees: 'eesVd', pMin: 40,
    eventos: [['tTriCierra', 'cierra tric.'], ['tPulAbre', 'abre Pul'], ['tS2p', 'P2']],
  },
};

/** Tramos de cada fase del latido [{ f, t0, t1 }], contiguos de 0 al periodo. */
export function segmentosFase(onda, periodo) {
  const seg = [];
  for (const x of onda) if (!seg.length || seg[seg.length - 1].f !== x.fase) seg.push({ f: x.fase, t0: seg.length ? x.t : 0 });
  seg.forEach((g, i) => { g.t1 = i + 1 < seg.length ? seg[i + 1].t0 : periodo; });
  return seg;
}

/** La muestra del latido más cercana al tiempo t (búsqueda binaria; las muestras van cada 2 ms). */
export function muestraEn(onda, t) {
  if (!onda.length) return null;
  let a = 0, b = onda.length - 1;
  while (b - a > 1) { const m = (a + b) >> 1; if (onda[m].t <= t) a = m; else b = m; }
  return Math.abs(onda[a].t - t) <= Math.abs(onda[b].t - t) ? onda[a] : onda[b];
}

/** El estado que se muestra al revisar un instante del último latido (mismas claves que motor.s). */
export function estadoRevision(onda, t) {
  const m = muestraEn(onda, t);
  return m ? { ...m, tLatido: m.t, revisando: true } : null;
}

/** La muestra del latido más cercana a un punto del asa P-V (distancia normalizada por las escalas). */
export function muestraCercanaPV(onda, kv, kp, v, pr, escV, escP) {
  let mejor = null, d = Infinity;
  for (const m of onda) { const e = ((m[kv] - v) / escV) ** 2 + ((m[kp] - pr) / escP) ** 2; if (e < d) { d = e; mejor = m; } }
  return mejor;
}

const arriba = (x, paso) => Math.ceil(x / paso) * paso;
const abajo = (x, paso) => Math.floor(x / paso) * paso;

/** Escalas del Wiggers y del asa para un latido (se recalculan una vez por latido). */
export function escalas(onda, lado, periodo) {
  const L = LADOS[lado];
  let pMax = 0, vMin = Infinity, vMax = 0;
  for (const m of onda) { for (const [k] of L.presiones) pMax = Math.max(pMax, m[k]); vMin = Math.min(vMin, m[L.vol]); vMax = Math.max(vMax, m[L.vol]); }
  if (!onda.length) { vMin = 40; vMax = 160; }
  const pasoP = L.pMin > 60 ? 20 : 10;
  return {
    T: periodo,
    pMax: Math.max(L.pMin, arriba(pMax + 5, pasoP)), pasoP,
    vMin: Math.max(0, abajo(vMin - 10, 10)), vMax: arriba(vMax + 10, 10),
    // el asa: ejes fijos desde 0 para que un cambio de escenario se vea como un desplazamiento del asa
    pvVMax: Math.max(200, arriba(vMax + 20, 50)), pvPMax: Math.max(L.pMin, arriba(pMax + 5, pasoP)),
  };
}


/**
 * Dibujos del Wiggers (canvas cw) y del asa P-V (canvas cp).
 * pintar(estado, motor, lado) dibuja ese estado y devuelve lo que ha dibujado: { t, puntos },
 * para que las pruebas comprueben que el cursor está en el mismo instante que el corazón.
 */
export function crearDiagramas(cw, cp) {
  // colores del tema: se leen del propio lienzo, así la página que lo aloja puede definirlos en un contenedor
  const css = (n) => getComputedStyle(cw).getPropertyValue(n).trim();
  let claveFondo = '', esc = null, ultimaClave = '', motorFondo = null;
  // márgenes del Wiggers en px del lienzo (se escalan con la densidad)
  const caja = () => {
    // k: píxeles del lienzo por píxel CSS (la densidad); medidas y letra van en px CSS × k
    const k = cw.width / (cw.clientWidth || cw.width), W = cw.width, H = cw.height;
    const x0 = 30 * k, x1 = W - 8 * k, yBandas = 16 * k;
    const yP0 = 26 * k, yP1 = H * 0.6, yV0 = H * 0.66, yV1 = H - 20 * k;
    return { k, W, H, x0, x1, yBandas, yP0, yP1, yV0, yV1 };
  };
  const cajaPV = () => { const k = cp.width / (cp.clientWidth || cp.width); return { k, x0: 32 * k, x1: cp.width - 10 * k, y0: 14 * k, y1: cp.height - 34 * k }; };

  function xDeT(t, c = caja()) { return c.x0 + (t / esc.T) * (c.x1 - c.x0); }
  function tDeX(x, c = caja()) { return Math.max(0, Math.min(esc.T, (x - c.x0) / (c.x1 - c.x0) * esc.T)); }

  // texto con un halo del color del fondo, para que se lea aunque lo cruce una curva
  function conHalo(ctx, txt, x, y, color, k) {
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = 3 * k; ctx.strokeStyle = css('--bg'); ctx.strokeText(txt, x, y);
    ctx.fillStyle = color; ctx.fillText(txt, x, y); ctx.restore();
  }
  function trazo(ctx, onda, fx, fy, color, ancho, cerrar = false) {
    if (onda.length < 2) return;
    ctx.beginPath(); onda.forEach((m, i) => { const x = fx(m), y = fy(m); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    if (cerrar) ctx.closePath();
    ctx.strokeStyle = color; ctx.lineWidth = ancho; ctx.stroke();
  }

  // Fondo, una vez por latido, en 2 capas por diagrama: ejes (nítidos siempre) y curvas del último
  // latido completo (tenues mientras corre el motor, con el latido en curso encima; nítidas al revisar).
  const lienzo = (ref) => { const c = document.createElement('canvas'); c.width = ref.width; c.height = ref.height; return c; };
  let capas = null;
  function fondo(motor, lado) {
    const L = LADOS[lado], c = caja(), o = motor.onda, u = motor.ultimo, k = c.k;
    capas = { ejesW: lienzo(cw), trazasW: lienzo(cw), ejesP: lienzo(cp), trazasP: lienzo(cp) };
    const g = capas.ejesW.getContext('2d');
    const yP = (p) => c.yP1 - (p / esc.pMax) * (c.yP1 - c.yP0);
    const yV = (v) => c.yV1 - ((v - esc.vMin) / (esc.vMax - esc.vMin)) * (c.yV1 - c.yV0);
    const muted = css('--muted'), linea = css('--line');
    // bandas de fase, con su letra encima
    g.font = `bold ${11 * k}px Georgia`; g.textAlign = 'center';
    for (const s of segmentosFase(o, u.periodo)) {
      const a = xDeT(s.t0, c), b = xDeT(s.t1, c);
      g.globalAlpha = 0.13; g.fillStyle = COLOR_FASE[s.f]; g.fillRect(a, c.yBandas, b - a, c.yV1 - c.yBandas);
      g.globalAlpha = 1; g.fillRect(a, c.yBandas - 4 * k, b - a, 4 * k);
      if (b - a > 12 * k) { g.fillStyle = COLOR_FASE[s.f]; g.fillText(s.f, (a + b) / 2, c.yBandas - 7 * k); }
    }
    // rejilla y escalas
    g.font = `${10 * k}px Georgia`; g.lineWidth = 1 * k;
    for (let p = 0; p <= esc.pMax; p += esc.pasoP) {
      const y = yP(p); g.strokeStyle = linea; g.beginPath(); g.moveTo(c.x0, y); g.lineTo(c.x1, y); g.stroke();
      if (p % (esc.pasoP * 2) === 0 && p < esc.pMax) { g.fillStyle = muted; g.textAlign = 'right'; g.fillText(String(p), c.x0 - 4 * k, y + 3 * k); }
    }
    g.textAlign = 'left'; g.fillStyle = muted; g.fillText('mmHg', 2 * k, c.yP0 - 4 * k);
    g.textAlign = 'right'; for (const v of [esc.vMin, esc.vMax]) g.fillText(String(v), c.x0 - 4 * k, yV(v) + (v === esc.vMax ? 8 : 0) * k);
    g.strokeStyle = linea; g.strokeRect(c.x0, c.yV0, c.x1 - c.x0, c.yV1 - c.yV0);
    g.textAlign = 'center';
    for (let t = 0; t <= esc.T + 1e-6; t += 0.2) g.fillText(t.toFixed(1).replace('.', ','), xDeT(t, c), c.yV1 + 14 * k);
    g.textAlign = 'right'; g.fillText('s', c.x1, c.yV1 + 14 * k);
    // eventos del último latido: línea discontinua y rótulo arriba, en 2 filas alternas para que no se pisen
    g.setLineDash([4 * k, 4 * k]); g.textAlign = 'left'; g.font = `${10 * k}px Georgia`;
    L.eventos.forEach(([clave, txt], i) => {
      const t = u[clave]; if (t == null) return; const x = xDeT(t, c);
      g.strokeStyle = muted; g.beginPath(); g.moveTo(x, c.yP0); g.lineTo(x, c.yV1); g.stroke();
      conHalo(g, txt, x + 3 * k, c.yP0 + (i % 2 ? 22 : 10) * k, muted, k);
    });
    g.setLineDash([]);
    // leyenda de las curvas: abajo a la derecha del panel de presiones (zona libre en diástole tardía)
    g.font = `bold ${11 * k}px Georgia`; g.textAlign = 'right';
    let xl = c.x1 - 6 * k;
    const yLeyenda = yP(esc.pMax * 0.45);
    for (const [, nombre, col] of [...L.presiones].reverse()) { conHalo(g, nombre, xl, yLeyenda, css(col), k); xl -= g.measureText(nombre).width + 10 * k; }
    conHalo(g, L.volNombre + ' (mL)', c.x1 - 6 * k, c.yV1 - 6 * k, css('--g'), k);
    // curvas del último latido
    const t2 = capas.trazasW.getContext('2d');
    for (const [kk, , col] of L.presiones) trazo(t2, o, (m) => xDeT(m.t, c), (m) => yP(m[kk]), css(col), 2 * k);
    trazo(t2, o, (m) => xDeT(m.t, c), (m) => yV(m[L.vol]), css('--g'), 2 * k);

    // asa P-V: ejes y relaciones del modelo (ESPVR y EDPVR); en la otra capa, el asa del último latido
    const cpb = cajaPV(), kp = cpb.k, h = capas.ejesP.getContext('2d');
    const xV = (v) => cpb.x0 + (v / esc.pvVMax) * (cpb.x1 - cpb.x0), yPp = (p) => cpb.y1 - (p / esc.pvPMax) * (cpb.y1 - cpb.y0);
    h.font = `${10 * kp}px Georgia`; h.lineWidth = 1 * kp;
    for (let p = 0; p <= esc.pvPMax; p += esc.pasoP) { h.strokeStyle = linea; h.beginPath(); h.moveTo(cpb.x0, yPp(p)); h.lineTo(cpb.x1, yPp(p)); h.stroke();
      if (p % (esc.pasoP * 2) === 0 && p < esc.pvPMax) { h.fillStyle = muted; h.textAlign = 'right'; h.fillText(String(p), cpb.x0 - 4 * kp, yPp(p) + 3 * kp); } }
    h.textAlign = 'center'; for (let v = 0; v <= esc.pvVMax; v += 50) h.fillText(String(v), xV(v), cpb.y1 + 14 * kp);
    h.fillText('Volumen (mL)', (cpb.x0 + cpb.x1) / 2, cpb.y1 + 30 * kp); h.textAlign = 'left'; h.fillText('mmHg', 2 * kp, cpb.y0 + 4 * kp);
    h.strokeStyle = linea; h.strokeRect(cpb.x0, cpb.y0, cpb.x1 - cpb.x0, cpb.y1 - cpb.y0);
    const cam = motor.p[L.camara], ees = eesLatido(o, L, cam.v0) ?? motor.ef[L.ees];
    h.save(); h.beginPath(); h.rect(cpb.x0, cpb.y0, cpb.x1 - cpb.x0, cpb.y1 - cpb.y0); h.clip();
    h.setLineDash([5 * kp, 4 * kp]); h.lineWidth = 1.5 * kp;
    // ESPVR: P = Ees·(V − V0), con la Ees de un latido (por su esquina telesistólica); EDPVR: P = A·(e^(B·(V − V0)) − 1). Sin tabique ni pericardio.
    h.strokeStyle = css('--r'); h.beginPath(); h.moveTo(xV(cam.v0), yPp(0)); h.lineTo(xV(cam.v0 + esc.pvPMax / ees), yPp(esc.pvPMax)); h.stroke();
    h.strokeStyle = css('--p'); h.beginPath();
    for (let v = cam.v0; v <= esc.pvVMax; v += 2) { const p = cam.a * (Math.exp(cam.b * (v - cam.v0)) - 1); v === cam.v0 ? h.moveTo(xV(v), yPp(p)) : h.lineTo(xV(v), yPp(p)); if (p > esc.pvPMax) break; }
    h.stroke(); h.setLineDash([]); h.restore();
    // leyenda arriba a la derecha (el asa no llega ahí)
    h.font = `${10 * kp}px Georgia`; h.textAlign = 'right';
    h.fillStyle = css('--r'); h.fillText('ESPVR · Ees del latido', cpb.x1 - 6 * kp, cpb.y0 + 14 * kp);
    h.fillStyle = css('--p'); h.fillText('EDPVR · rigidez diastólica', cpb.x1 - 6 * kp, cpb.y0 + 28 * kp);
    trazo(capas.trazasP.getContext('2d'), o, (m) => xV(m[L.vol]), (m) => yPp(m[L.pv]), css('--b'), 2 * kp, true);
  }

  /**
   * Dibuja el estado mostrado. estado: motor.s mientras corre, o la muestra revisada.
   * Devuelve { t, v, p } en el que quedó el cursor (para las pruebas).
   */
  function pintar(estado, motor, lado) {
    if (!motor.ultimo || !motor.onda.length || !cw.width) return null;
    const L = LADOS[lado], u = motor.ultimo, enCurso = !estado.revisando;
    const T = enCurso ? Math.max(u.periodo, motor.periodo) : u.periodo;
    // el fondo se rehace al cerrar cada latido, al cambiar de lado o de tamaño, o con un motor nuevo (escenario)
    const clave = `${motor.s.nLatido}|${lado}|${cw.width}|${cp.width}|${T.toFixed(4)}`;
    if (clave !== claveFondo || motor !== motorFondo) { esc = escalas(motor.onda, lado, T); fondo(motor, lado); claveFondo = clave; motorFondo = motor; ultimaClave = ''; }
    const ahora = `${claveFondo}|${estado.tLatido}|${estado[L.pv]}|${enCurso}`;
    const res = { t: estado.tLatido, v: estado[L.vol], p: estado[L.pv] };
    if (ahora === ultimaClave) return res;   // nada ha cambiado (en pausa): no se redibuja
    ultimaClave = ahora;
    const c = caja(), k = c.k, g = cw.getContext('2d');
    const yP = (p) => c.yP1 - (p / esc.pMax) * (c.yP1 - c.yP0);
    const yV = (v) => c.yV1 - ((v - esc.vMin) / (esc.vMax - esc.vMin)) * (c.yV1 - c.yV0);
    g.clearRect(0, 0, c.W, c.H);
    g.drawImage(capas.ejesW, 0, 0); g.globalAlpha = enCurso ? 0.35 : 1; g.drawImage(capas.trazasW, 0, 0); g.globalAlpha = 1;
    if (enCurso) {
      const oa = motor.ondaActual;
      for (const [kk, , col] of L.presiones) trazo(g, oa, (m) => xDeT(m.t, c), (m) => yP(m[kk]), css(col), 2.6 * k);
      trazo(g, oa, (m) => xDeT(m.t, c), (m) => yV(m[L.vol]), css('--g'), 2.6 * k);
    }
    // cursor: el instante del estado mostrado, con un punto en cada curva
    const x = xDeT(Math.min(estado.tLatido, esc.T), c);
    g.strokeStyle = css('--text'); g.lineWidth = 2 * k; g.beginPath(); g.moveTo(x, c.yBandas); g.lineTo(x, c.yV1); g.stroke();
    for (const [kk, , col] of L.presiones) { g.fillStyle = css(col); g.beginPath(); g.arc(x, yP(estado[kk]), 4 * k, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = css('--g'); g.beginPath(); g.arc(x, yV(estado[L.vol]), 4 * k, 0, Math.PI * 2); g.fill();

    // asa P-V
    const cpb = cajaPV(), kp = cpb.k, h = cp.getContext('2d');
    const xV = (v) => cpb.x0 + (v / esc.pvVMax) * (cpb.x1 - cpb.x0), yPp = (p) => cpb.y1 - (p / esc.pvPMax) * (cpb.y1 - cpb.y0);
    h.clearRect(0, 0, cp.width, cp.height);
    h.drawImage(capas.ejesP, 0, 0); h.globalAlpha = enCurso ? 0.4 : 1; h.drawImage(capas.trazasP, 0, 0); h.globalAlpha = 1;
    if (enCurso) trazo(h, motor.ondaActual, (m) => xV(m[L.vol]), (m) => yPp(m[L.pv]), css('--b'), 3 * kp);
    h.fillStyle = COLOR_FASE[estado.fase] || css('--text'); h.strokeStyle = css('--text'); h.lineWidth = 2 * kp;
    h.beginPath(); h.arc(xV(estado[L.vol]), yPp(estado[L.pv]), 6 * kp, 0, Math.PI * 2); h.fill(); h.stroke();
    return res;
  }

  /** Tiempo del latido que corresponde a una x del Wiggers en px CSS. */
  function tiempoEnX(xCss) { if (!esc) return 0; return tDeX(xCss * cw.width / cw.clientWidth); }
  /** Muestra del último latido más cercana a un punto del asa en px CSS. */
  function muestraEnPV(motor, lado, xCss, yCss) {
    if (!esc) return null;
    const L = LADOS[lado], cpb = cajaPV(), sx = cp.width / cp.clientWidth;
    const v = (xCss * sx - cpb.x0) / (cpb.x1 - cpb.x0) * esc.pvVMax, p = (cpb.y1 - yCss * sx) / (cpb.y1 - cpb.y0) * esc.pvPMax;
    const m = muestraCercanaPV(motor.onda, L.vol, L.pv, v, p, esc.pvVMax, esc.pvPMax);
    return m ? { ...m, tLatido: m.t, revisando: true } : null;
  }
  /** Fuerza a redibujar el fondo (cambio de tamaño o de tema). */
  function invalidar() { claveFondo = ''; ultimaClave = ''; }
  return { pintar, tiempoEnX, muestraEnPV, invalidar };
}

/** Ees de un latido (método de un solo latido): la recta desde V0 hasta la esquina telesistólica (volumen mínimo).
 *  Con el efecto de la eyección del motor, la esquina de un latido que expulsa queda algo por debajo de la elastancia
 *  máxima del parámetro (como en el corazón real: los latidos que expulsan dan menos presión telesistólica que los
 *  isovolumétricos). L: lado de LADOS (o { vol, pv }). */
export function eesLatido(onda, L, v0) {
  if (!onda?.length) return null;
  const es = onda.reduce((a, x) => (x[L.vol] < a[L.vol] ? x : a));
  const dv = es[L.vol] - v0;
  return dv > 1 ? es[L.pv] / dv : null;
}

// ================================================================================================================
// Paneles de la hemodinámica de Marino (Fundamentos, caps. 8 y 11). La fuente es la ficha de la app; cada cifra lleva
// su origen: «ficha» (botón a la línea de la ficha), «fisiología general» o «ilustrativo». Las cifras del paciente son
// las del motor (modelo).
// ================================================================================================================
const MARINO = (tab, sel, texto) => ({ tab, sel, texto });
export const FUENTES_HEMO = {
  rv: MARINO('mar-retorno-venoso', '#mar-rv-ecuacion', 'Ec. 11.1-11.2 (Marino, cap. 11, p. 22)'),
  rvPvc: MARINO('mar-retorno-venoso', '#mar-rv-pvc', '14 % por mmHg, Fig. 11.2 (p. 23)'),
  pms: MARINO('mar-retorno-venoso', '#mar-pms', 'Pms 7-8 en animales, 14-20 en UCI (p. 23)'),
  pmsFluidos: MARINO('mar-retorno-venoso', '#mar-pms-fluidos', 'bolo de 250-500 mL (p. 23)'),
  sobrecarga: MARINO('mar-respuesta-fluidos', '#mar-sobrecarga-prueba', '500 mL, responde si VS >10 % (p. 31)'),
  epp: MARINO('mar-respuesta-fluidos', '#mar-epp', 'EPP: unos 300 mL; VS ≥10 %, S 85 %, E 92 % (p. 33)'),
  eppPasos: MARINO('mar-respuesta-fluidos', '#mar-epp-pasos', 'al bajar las piernas, desaparece (p. 35)'),
  capPasos: MARINO('mar-cateter-ap', '#mar-cap-pasos', 'Fig. 8.2 y pasos (Marino, cap. 8, p. 52)'),
  enclOndas: MARINO('mar-cateter-ap', '#mar-enclavamiento-ondas', 'presión venosa izquierda; en la HTP, por debajo (p. 53)'),
  t81: MARINO('mar-termodilucion', '#mar-tabla-8-1', 'Tabla 8.1 (p. 61)'),
  termoMetodo: MARINO('mar-termodilucion', '#mar-termo-metodo', '10 mL; área ∝ 1/GC (p. 57)'),
  termoCuantas: MARINO('mar-termodilucion', '#mar-termo-cuantas', '3 medidas que difieran ≤10 % (p. 59)'),
  termoErrores: MARINO('mar-termodilucion', '#mar-termo-errores', 'insuficiencia tricuspídea (p. 60)'),
};
/** Botón de origen «ficha»: un enlace cruzado de siempre que lleva a esa línea de la ficha y la resalta. */
export const chipFicha = (f) => `<button type="button" class="especialidad-link cvh-org" data-especialidad="libros" data-view="marinoFundamentos" data-panel="panel-marino-fund-tabs" data-tab="${f.tab}" data-resaltar="${f.sel}">📖 ficha · ${f.texto}</button>`;
export const chipOrigen = (t) => `<span class="cvh-org cvh-org-${t === 'ilustrativo' ? 'ilu' : t === 'modelo' ? 'mod' : 'gen'}">${t === 'ilustrativo' ? '✎' : t === 'modelo' ? '⚙' : '◇'} ${t}</span>`;
const REF = Object.fromEntries(REFERENCIAS.map(r => [r.id, r]));
const n0 = (x) => Math.round(x).toString();
const n1 = (x) => x.toFixed(1).replace('.', ',');
const n2 = (x) => x.toFixed(2).replace('.', ',');
const pct = (x) => (x >= 0 ? '+' : '−') + Math.abs(x * 100).toFixed(0) + ' %';

// lienzo al ancho de su caja (× densidad, hasta 2×); devuelve k = px del lienzo por px CSS, o 0 si está plegado
function ajustar(c, alto) {
  const w = c.clientWidth; if (!w) return 0;
  const d = Math.min(window.devicePixelRatio || 1, 2), n = Math.round(w * d);
  if (c.width !== n) { c.width = n; c.height = Math.round(n * alto); }
  return c.width / w;
}
/** Ejes con rejilla. caja = { x0, x1, y0, y1 } en px del lienzo; esc = { xmin, xmax, ymin, ymax, px, py }. */
function ejes(g, caja, esc, k, css, etqX, etqY) {
  const X = (x) => caja.x0 + (x - esc.xmin) / (esc.xmax - esc.xmin) * (caja.x1 - caja.x0);
  const Y = (y) => caja.y1 - (y - esc.ymin) / (esc.ymax - esc.ymin) * (caja.y1 - caja.y0);
  g.lineWidth = 1 * k; g.font = `${10 * k}px Georgia`; g.fillStyle = css('--muted');
  g.textAlign = 'right';
  for (let y = esc.ymin; y <= esc.ymax + 1e-9; y += esc.py) {
    g.strokeStyle = css('--line'); g.beginPath(); g.moveTo(caja.x0, Y(y)); g.lineTo(caja.x1, Y(y)); g.stroke();
    g.fillText(String(+y.toFixed(2)).replace('.', ','), caja.x0 - 4 * k, Y(y) + 3 * k);
  }
  g.textAlign = 'center';
  for (let x = esc.xmin; x <= esc.xmax + 1e-9; x += esc.px) g.fillText(String(+x.toFixed(2)).replace('.', ','), X(x), caja.y1 + 13 * k);
  g.strokeStyle = css('--line'); g.strokeRect(caja.x0, caja.y0, caja.x1 - caja.x0, caja.y1 - caja.y0);
  g.textAlign = 'right'; g.fillText(etqX, caja.x1, caja.y1 + 26 * k);
  g.textAlign = 'left'; g.fillText(etqY, 2 * k, caja.y0 - 6 * k);
  return { X, Y };
}
function rotulo(g, txt, x, y, color, k, alin = 'left') {
  g.save(); g.font = `bold ${10.5 * k}px Georgia`; g.textAlign = alin; g.lineJoin = 'round'; g.lineWidth = 3 * k;
  g.strokeStyle = g.canvas.__fondo || '#17140f'; g.strokeText(txt, x, y); g.fillStyle = color; g.fillText(txt, x, y); g.restore();
}

/**
 * Monta los tres paneles en `raiz` (el contenedor .cv-sim con el marcado de eco.html).
 * ctx: { motor(), escenario(), correr(s), paciente(), verTsvi() } — el pegamento lo da simulador.mjs.
 * Devuelve { pintar(estado), alCambiarMotor(), abrir(clave) }.
 */
export function crearPanelesHemo(raiz, ctx) {
  const $ = (s) => raiz.querySelector(s);
  const css = (n) => getComputedStyle(raiz).getPropertyValue(n).trim();
  const abierto = (id) => $(id)?.open;
  const TOPE_BOLO = 1500;     // mL en total: tope del simulador (ilustrativo)

  // ---------------------------------------------------------------- Guyton, EPP y bolo
  const cG = $('#cvh-guyton');
  let claveG = '', antes = null, ultimaManiobra = null, registro = [];
  const foto = (m) => { const g = guyton(m), u = m.ultimo; return g && { ...g, pas: u.pas, pad_: u.pad_, fc: u.fc, pcp: u.pvp }; };
  // Si el escenario acaba de empezar, el paciente se asienta antes (maniobras.mjs, faltaParaAsentar): la EPP y el bolo
  // se miden sobre un VS basal estable, como en las pruebas
  function asentar() {
    const falta = faltaParaAsentar(ctx.motor());
    if (falta < 0.05) return;
    ctx.correr(falta);
    registro.unshift(`El paciente se asienta ${n0(falta)} s más (el barorreflejo termina de compensar): así el VS de partida es estable`);
    registro = registro.slice(0, 4); claveG = '';
  }
  function maniobra(tipo, valor) {
    asentar();
    const m = ctx.motor(); antes = foto(m); ultimaManiobra = { tipo, valor };
    if (tipo === 'epp') epp(m, valor); else bolo(m, valor);
    ctx.correr(SEGUNDOS_MANIOBRA);
    const ahora = foto(ctx.motor()), d = ahora.vs / antes.vs - 1;
    const nombre = tipo === 'epp' ? (valor ? 'Subes las piernas' : 'Bajas las piernas') : `Bolo de ${valor} mL`;
    registro.unshift(`${nombre}: VS ${n0(antes.vs)} → ${n0(ahora.vs)} mL (${pct(d)})`); registro = registro.slice(0, 4);
    botonesG(); claveG = ''; pintarResG();
  }
  function botonesG() {
    const m = ctx.motor(), on = !!m.p.epp, total = m.p.boloTotal ?? 0;
    const b = $('#cvh-epp'); b.setAttribute('aria-pressed', on); b.classList.toggle('on', on);
    b.textContent = on ? '🦵 Bajar las piernas' : '🦵 Subir las piernas (EPP)';
    for (const ml of [250, 500]) $('#cvh-bolo' + ml).disabled = total + ml > TOPE_BOLO;
    $('#cvh-bolo-total').textContent = total ? `Llevas ${total} mL de bolos (tope del simulador: ${TOPE_BOLO} mL, ilustrativo).` : '';
  }
  $('#cvh-epp').addEventListener('click', () => maniobra('epp', !ctx.motor().p.epp));
  $('#cvh-bolo250').addEventListener('click', () => maniobra('bolo', 250));
  $('#cvh-bolo500').addEventListener('click', () => maniobra('bolo', 500));
  $('#cvh-paciente').addEventListener('click', () => ctx.paciente());
  $('#cvh-tsvi').addEventListener('click', () => ctx.verTsvi());

  function pintarResG() {
    const caja = $('#cvh-guyton-res'), m = ctx.motor(), g = foto(m);
    if (!g) { caja.innerHTML = ''; return; }
    const fila = (n, a, b, f = n1) => `<tr><td class="cvh-fila-nombre">${n}</td>${antes ? `<td>${f(a)}</td>` : ''}<td><b>${f(b)}</b></td></tr>`;
    const A = antes || {};
    let veredicto = '';
    if (antes && ultimaManiobra) {
      const d = g.vs / antes.vs - 1, esEpp = ultimaManiobra.tipo === 'epp';
      if (esEpp && ultimaManiobra.valor) {
        const si = Math.round(d * 1000) >= 100;
        veredicto = `<p class="tfg-estado ${si ? 'tfg-estado-ok' : 'tfg-estado-neutro'}">${si ? '✅ Responde' : '➖ No responde'}: el VS cambia ${pct(d)} con la EPP (corte ≥10 %: sensibilidad 85 %, especificidad 92 %). ${chipFicha(FUENTES_HEMO.epp)}</p>`;
      } else if (esEpp) {
        veredicto = `<p class="tfg-estado tfg-estado-neutro">Al bajar las piernas la respuesta debe desaparecer: si no, sospecha dolor. ${chipFicha(FUENTES_HEMO.eppPasos)}</p>`;
      } else {
        const si = Math.round(d * 1000) > 100;
        veredicto = `<p class="tfg-estado ${si ? 'tfg-estado-ok' : 'tfg-estado-neutro'}">${si ? '✅ Responde' : '➖ No responde'}: el VS cambia ${pct(d)} (responde si sube >10 %). La Pms sube siempre; el que responde es el que aumenta el gradiente Pms − PVC. ${chipFicha(FUENTES_HEMO.sobrecarga)} ${chipFicha(FUENTES_HEMO.pmsFluidos)}</p>`;
      }
    } else veredicto = `<p class="cv-muted">Antes de pulsar, <b>predice</b>: ¿este paciente subirá el VS un 10 % o más? Luego compruébalo.</p>`;
    caja.innerHTML = veredicto + `<table class="data-table cvh-tabla"><thead><tr><th></th>${antes ? '<th>Antes</th>' : ''}<th>${antes ? 'Ahora' : 'Paciente'}</th></tr></thead><tbody>` +
      fila('Pms (mmHg)', A.pms, g.pms) + fila('PVC (mmHg)', A.pvc, g.pvc) + fila('Pms − PVC', A.gradiente, g.gradiente) +
      fila('GC (L/min)', A.gc, g.gc, n2) + fila('VS (mL)', A.vs, g.vs, n0) +
      '</tbody></table>' +
      `<p class="cv-muted">PA ${antes ? `${n0(A.pas)}/${n0(A.pad_)} → ` : ''}<b>${n0(g.pas)}/${n0(g.pad_)}</b> mmHg · FC ${antes ? `${n0(A.fc)} → ` : ''}<b>${n0(g.fc)}</b> lpm · enclavamiento ${antes ? `${n1(A.pcp)} → ` : ''}<b>${n1(g.pcp)}</b> mmHg. ${chipOrigen('modelo')}</p>` +
      (registro.length ? `<ul class="cvh-registro">${registro.map(r => `<li>${r}</li>`).join('')}</ul>` : '');
  }

  function pintarG() {
    const k = ajustar(cG, 0.78); if (!k) return;
    const m = ctx.motor(), g = guyton(m); if (!g) return;
    const clave = `${m.s.nLatido}|${cG.width}|${ctx.escenario()}`; if (clave === claveG) return; claveG = clave;
    const curva = curvaFuncion(ctx.escenario()) || [];
    const xs = [g.pms, antes?.pms ?? 0, ...curva.map(p => p.x)], ys = [g.gc, ...curva.map(p => p.y)];
    const esc = { xmin: 0, xmax: Math.max(10, Math.ceil((Math.max(...xs) + 1) / 5) * 5), ymin: 0, ymax: Math.max(6, Math.ceil(Math.max(...ys) + 1)), px: 5, py: 2 };
    const ctx2 = cG.getContext('2d'); cG.__fondo = css('--bg');
    ctx2.clearRect(0, 0, cG.width, cG.height);
    const caja = { x0: 34 * k, x1: cG.width - 10 * k, y0: 22 * k, y1: cG.height - 32 * k };
    const { X, Y } = ejes(ctx2, caja, esc, k, css, 'PAD = PVC (mmHg)', 'GC = retorno venoso (L/min)');
    ctx2.save(); ctx2.beginPath(); ctx2.rect(caja.x0, caja.y0, caja.x1 - caja.x0, caja.y1 - caja.y0); ctx2.clip();
    // curva de función del corazón (tabla precalculada del escenario): línea gruesa con puntos
    if (curva.length) {
      ctx2.strokeStyle = css('--p'); ctx2.lineWidth = 3 * k; ctx2.beginPath();
      curva.forEach((p, i) => (i ? ctx2.lineTo(X(p.x), Y(p.y)) : ctx2.moveTo(X(p.x), Y(p.y)))); ctx2.stroke();
      ctx2.fillStyle = css('--p'); for (const p of curva) { ctx2.beginPath(); ctx2.arc(X(p.x), Y(p.y), 2.2 * k, 0, 7); ctx2.fill(); }
    }
    // recta de retorno venoso de antes (discontinua) y la de ahora
    const recta = (G, color, ancho, raya) => {
      ctx2.strokeStyle = color; ctx2.lineWidth = ancho * k; ctx2.setLineDash(raya.map(v => v * k)); ctx2.beginPath();
      ctx2.moveTo(X(0), Y(G.rvEn(0))); ctx2.lineTo(X(G.pms), Y(0)); ctx2.stroke(); ctx2.setLineDash([]);
    };
    if (antes) recta(antes, css('--muted'), 1.5, [5, 4]);
    recta(g, css('--b'), 2.5, []);
    ctx2.restore();
    // la Pms donde la recta corta el eje (retorno 0): rombo y rótulo
    const rombo = (x, color) => { ctx2.fillStyle = color; ctx2.beginPath(); ctx2.moveTo(x, caja.y1 - 6 * k); ctx2.lineTo(x + 5 * k, caja.y1); ctx2.lineTo(x, caja.y1 + 6 * k); ctx2.lineTo(x - 5 * k, caja.y1); ctx2.closePath(); ctx2.fill(); };
    if (antes) rombo(X(antes.pms), css('--muted'));
    rombo(X(g.pms), css('--b'));
    rotulo(ctx2, `Pms ${n1(g.pms)}`, X(g.pms) + 6 * k, caja.y1 - 8 * k, css('--b'), k);
    // punto del paciente (círculo) y el de antes (círculo hueco)
    if (antes) { ctx2.strokeStyle = css('--muted'); ctx2.lineWidth = 2 * k; ctx2.beginPath(); ctx2.arc(X(antes.pvc), Y(antes.gc), 5 * k, 0, 7); ctx2.stroke(); }
    ctx2.fillStyle = css('--text'); ctx2.strokeStyle = css('--r'); ctx2.lineWidth = 2.5 * k;
    ctx2.beginPath(); ctx2.arc(X(g.pvc), Y(g.gc), 6 * k, 0, 7); ctx2.fill(); ctx2.stroke();
    rotulo(ctx2, 'paciente', X(g.pvc) - 9 * k, Y(g.gc) - 9 * k, css('--text'), k, 'right');
    // rótulos de las dos curvas (la identidad no va solo por color)
    // función: debajo del principio de la curva; retorno venoso: junto al tramo bajo de la recta, a su derecha
    if (curva.length) { const p = curva[0]; rotulo(ctx2, 'función del corazón', Math.max(X(p.x), caja.x0 + 4 * k), Y(p.y) + 16 * k, css('--p'), k); }
    const yR = g.gc * 0.3, xR = g.pms - yR * g.rv;
    rotulo(ctx2, 'retorno venoso', Math.min(X(xR) + 8 * k, caja.x1 - 4 * k), Y(yR), css('--b'), k, X(xR) + 90 * k > caja.x1 ? 'right' : 'left');
    $('#cvh-guyton-14').innerHTML = `En esta recta, cada 1 mmHg más de PAD quita un <b>${n0(100 / g.pms)} %</b> del retorno que habría con la PAD en 0 (= 1 / Pms). ${chipFicha(FUENTES_HEMO.rvPvc)}`;
    pintarResG();
  }

  // ---------------------------------------------------------------- Catéter que avanza (Fig. 8.2)
  const svg = $('#cvh-cat-svg'), camino = $('#cvh-cat-camino'), cateter = $('#cvh-cat-linea'), globo = $('#cvh-cat-globo');
  const cT = $('#cvh-cat-traza');
  const FRAC = { ad: 0.2, vd: 0.47, ap: 0.78, enclavado: 0.985 };   // dónde queda la punta en cada sitio (en el camino)
  let pos = 0, hinchado = true, frac = FRAC.ad, radio = 1, animando = null;
  const lugarActual = () => (pos === 3 ? (hinchado ? 'enclavado' : 'ap') : ORDEN_LUGARES[pos]);
  let traza = [], ultimoT = -1, visitados = new Set(['ad']);
  function colocar(f, r) {
    const L = camino.getTotalLength(), p = camino.getPointAtLength(f * L);
    cateter.setAttribute('stroke-dasharray', `${f * L} ${L}`);
    globo.setAttribute('cx', p.x.toFixed(1)); globo.setAttribute('cy', p.y.toFixed(1)); globo.setAttribute('r', (2 + 4 * r).toFixed(2));
  }
  function moverA(nuevaFrac, nuevoRadio, animar = true) {
    const f0 = frac, r0 = radio; frac = nuevaFrac; radio = nuevoRadio;
    animando?.stop?.();
    // Motion solo se pide al mover el catéter (nunca al montar); con «reducir movimiento», el estado final
    if (!animar || sinMovimiento()) { colocar(frac, radio); return; }
    cargarMotion().then(({ animate }) => {
      animando = animate(0, 1, { duration: 0.9, ease: 'easeInOut', onUpdate: (v) => colocar(f0 + (frac - f0) * v, r0 + (radio - r0) * v) });
    }).catch(() => colocar(frac, radio));
  }
  function actualizarCat(animar = true) {
    moverA(FRAC[ORDEN_LUGARES[pos]], hinchado ? 1 : 0, animar);
    const l = lugarActual(); visitados.add(l);
    $('#cvh-cat-atras').disabled = pos === 0; $('#cvh-cat-avanza').disabled = pos === 3;
    const bg = $('#cvh-cat-globo-btn'); bg.hidden = pos !== 3; bg.textContent = hinchado ? '🎈 Deshinchar el globo' : '🎈 Hinchar el globo';
    svg.querySelectorAll('[data-sitio]').forEach(e => e.classList.toggle('on', e.dataset.sitio === (l === 'enclavado' ? 'enclavado' : ORDEN_LUGARES[pos])));
    claveC = '';
  }
  $('#cvh-cat-avanza').addEventListener('click', () => { if (pos < 3) { pos++; hinchado = true; actualizarCat(); } });
  $('#cvh-cat-atras').addEventListener('click', () => { if (pos > 0) { pos--; hinchado = true; actualizarCat(); } });
  $('#cvh-cat-globo-btn').addEventListener('click', () => { hinchado = !hinchado; actualizarCat(); });
  const PASO = {
    ad: 'Oscilaciones pequeñas; su media es la <b>PVC</b>.',
    vd: 'Al cruzar la tricúspide, onda pulsátil. La sistólica es la fuerza del VD; la <b>diastólica equivale a la PVC</b>.',
    ap: 'Al cruzar la pulmonar <b>sube bruscamente la diastólica</b> y la sistólica no cambia.',
    enclavado: 'El globo cierra la rama, <b>desaparece la onda pulsátil</b> y queda una presión baja, normalmente al nivel de la diastólica pulmonar. Deshincha el globo: debe volver la onda.',
  };
  let claveC = '';
  function lecturaHtml() {
    const m = ctx.motor(), o = m.onda, u = m.ultimo; if (!u) return '';
    const L = Object.fromEntries(ORDEN_LUGARES.map(l => [l, lecturaCateter(o, u, l)]));
    const ref = (id) => { const r = REF[id]; return `${r.texto}`; };
    const filas = {
      ad: `<tr><td class="cvh-fila-nombre">AD media (PVC)</td><td><b>${n0(L.ad.media)}</b></td><td>${ref('pvc-t81')}</td></tr>`,
      vd: `<tr><td class="cvh-fila-nombre">VD sistólica / diastólica</td><td><b>${n0(L.vd.sistolica)}/${n0(L.vd.diastolica)}</b></td><td>${ref('pvdmax')} / ≈ PVC</td></tr>`,
      ap: `<tr><td class="cvh-fila-nombre">AP sistólica / diastólica</td><td><b>${n0(L.ap.sistolica)}/${n0(L.ap.diastolica)}</b></td><td>${ref('paps')} / ${ref('papd')}</td></tr>`,
      enclavado: `<tr><td class="cvh-fila-nombre">Enclavamiento (media)</td><td><b>${n0(L.enclavado.media)}</b></td><td>${ref('pawp-t81')}</td></tr>`,
    };
    const l = lugarActual();
    let nota = '';
    if (l === 'enclavado' && L.enclavado.media < L.ap.diastolica - 4) nota = `<p class="tfg-estado tfg-estado-warn">El enclavamiento (${n0(L.enclavado.media)}) queda <b>por debajo</b> de la diastólica pulmonar (${n0(L.ap.diastolica)}): pasa en la hipertensión pulmonar, y entonces la diastólica pulmonar no sirve para estimarlo. ${chipFicha(FUENTES_HEMO.enclOndas)}</p>`;
    if (l === 'enclavado') nota += `<p class="tfg-estado tfg-estado-danger">⚠️ No dejes el globo hinchado: puede romper la arteria pulmonar o infartar el pulmón. ${chipFicha(FUENTES_HEMO.capPasos)}</p>`;
    return `<p class="cvh-paso"><b>${LUGARES[l].nombre}.</b> ${PASO[l]}</p>` + nota +
      `<table class="data-table cvh-tabla"><thead><tr><th>Lo que ha leído (mmHg)</th><th>Paciente</th><th>Normal</th></tr></thead><tbody>${ORDEN_LUGARES.filter(x => visitados.has(x)).map(x => filas[x]).join('')}</tbody></table>` +
      `<p class="cv-muted">Paciente: ${chipOrigen('modelo')} · Normal de la PVC y el enclavamiento: ${chipFicha(FUENTES_HEMO.t81)} · del VD y la AP: <span class="cvh-org cvh-org-gen">📖 ficha · Fisiopatología UCI · Cardiología, Ficha 5</span></p>`;
  }
  function pintarC(estado) {
    const k = ajustar(cT, 0.5); if (!k) return;
    const m = ctx.motor(), l = lugarActual(), enCurso = !estado.revisando;
    // la traza corre con el tiempo del motor; un salto (maniobra, escenario, «Avanzar 10 s») la reinicia con el último latido
    if (enCurso) {
      if (estado.t < ultimoT || estado.t - ultimoT > 0.5) {
        traza = []; const o = m.onda, T0 = estado.t - (m.ultimo?.periodo ?? 0.86);
        for (const x of o) traza.push({ t: T0 + x.t, p: presionEnPunta(x, l), l });
      }
      if (estado.t !== ultimoT) traza.push({ t: estado.t, p: presionEnPunta(estado, l), l });
      ultimoT = estado.t;
      const corte = estado.t - 3; while (traza.length && traza[0].t < corte) traza.shift();
    }
    const clave = `${m.s.nLatido}|${l}|${pos}|${hinchado}`;
    if (clave !== claveC) { claveC = clave; $('#cvh-cat-lect').innerHTML = lecturaHtml(); }
    const g = cT.getContext('2d'); cT.__fondo = css('--bg');
    g.clearRect(0, 0, cT.width, cT.height);
    const tFin = traza.length ? traza[traza.length - 1].t : 0;
    const pMax = Math.max(30, Math.ceil((Math.max(0, ...traza.map(x => x.p)) + 4) / 10) * 10);
    const caja = { x0: 30 * k, x1: cT.width - 8 * k, y0: 18 * k, y1: cT.height - 26 * k };
    const { X, Y } = ejes(g, caja, { xmin: -3, xmax: 0, ymin: 0, ymax: pMax, px: 1, py: 10 }, k, css, 's', 'mmHg');
    g.save(); g.beginPath(); g.rect(caja.x0, caja.y0, caja.x1 - caja.x0, caja.y1 - caja.y0); g.clip();
    g.strokeStyle = css('--y'); g.lineWidth = 2.2 * k; g.beginPath();
    traza.forEach((x, i) => (i ? g.lineTo(X(x.t - tFin), Y(x.p)) : g.moveTo(X(x.t - tFin), Y(x.p)))); g.stroke();
    // cada cambio de sitio, con su rótulo (como la tira de la Fig. 8.2)
    g.setLineDash([3 * k, 3 * k]); g.strokeStyle = css('--muted'); g.lineWidth = 1 * k;
    for (let i = 1; i < traza.length; i++) if (traza[i].l !== traza[i - 1].l) {
      const x = X(traza[i].t - tFin); g.beginPath(); g.moveTo(x, caja.y0); g.lineTo(x, caja.y1); g.stroke();
      rotulo(g, LUGARES[traza[i].l].corto, x + 3 * k, caja.y0 + 12 * k, css('--text'), k);
    }
    g.setLineDash([]); g.restore();
    rotulo(g, `${LUGARES[l].corto} ${n0(presionEnPunta(estado, l))} mmHg`, caja.x1 - 4 * k, caja.y0 + 12 * k, css('--y'), k, 'right');
    if (!enCurso) rotulo(g, '⏸ revisando', caja.x0 + 4 * k, caja.y0 + 12 * k, css('--muted'), k);
  }

  // ---------------------------------------------------------------- Termodilución
  const cTe = $('#cvh-termo');
  let medidas = [], semilla = 11, claveTe = '';
  // variación de una medida a otra por el momento de la inyección en la respiración (#mar-termo-errores): el modelo no
  // respira, así que es ilustrativa (±6 %), pseudoaleatoria y repetible
  const azar = () => { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; };
  function qRegT(u) {
    if (u.vRegT > 0.5) return { q: u.vRegT * u.fc / 1000, origen: 'modelo' };
    return $('#cvh-termo-it').checked ? { q: 0.6 * u.gc, origen: 'ilustrativo' } : { q: 0, origen: null };
  }
  $('#cvh-termo-inyectar').addEventListener('click', () => {
    const u = ctx.motor().ultimo; if (!u) return;
    const it = qRegT(u), gcReal = u.gc * (1 + (azar() - 0.5) * 0.12);
    const c = curvaTermo(gcReal, it.q * gcReal / u.gc);
    if (medidas.length >= 3) medidas = [];
    medidas.push({ c, gcModelo: u.gc, it: it.q > 0 });
    claveTe = ''; pintarTe();
  });
  $('#cvh-termo-borrar').addEventListener('click', () => { medidas = []; claveTe = ''; pintarTe(); });
  $('#cvh-termo-it').addEventListener('change', () => { medidas = []; claveTe = ''; pintarTe(); });
  const RAYAS = [[], [7, 4], [2, 3]];
  function pintarTe() {
    const k = ajustar(cTe, 0.6); if (!k) return;
    const clave = `${cTe.width}|${medidas.length}|${ctx.motor().s.nLatido > 0}`; if (clave === claveTe) return; claveTe = clave;
    const g = cTe.getContext('2d'); cTe.__fondo = css('--bg'); g.clearRect(0, 0, cTe.width, cTe.height);
    const caja = { x0: 34 * k, x1: cTe.width - 8 * k, y0: 20 * k, y1: cTe.height - 30 * k };
    const { X, Y } = ejes(g, caja, { xmin: 0, xmax: 30, ymin: 0, ymax: 0.6, px: 5, py: 0.2 }, k, css, 'tiempo (s)', '↓ temperatura (°C)');
    // con insuficiencia tricuspídea, la curva de ese mismo gasto con la válvula competente, de referencia (fina, gris)
    const conIt = medidas.find(m => m.it);
    if (conIt) {
      const ref = curvaTermo(conIt.gcModelo);
      g.strokeStyle = css('--muted'); g.lineWidth = 1.5 * k; g.setLineDash([2 * k, 4 * k]); g.beginPath();
      ref.puntos.forEach((p, j) => (j ? g.lineTo(X(p.t), Y(p.dT)) : g.moveTo(X(p.t), Y(p.dT)))); g.stroke(); g.setLineDash([]);
      const pr = ref.puntos.reduce((a, b) => (b.dT > a.dT ? b : a));
      rotulo(g, 'sin insuficiencia', X(pr.t) + 8 * k, Y(pr.dT) - 2 * k, css('--muted'), k);
    }
    medidas.forEach((m, i) => {
      g.strokeStyle = css(m.it ? '--r' : '--b'); g.lineWidth = 2.4 * k; g.setLineDash(RAYAS[i].map(v => v * k)); g.beginPath();
      m.c.puntos.forEach((p, j) => (j ? g.lineTo(X(p.t), Y(p.dT)) : g.moveTo(X(p.t), Y(p.dT)))); g.stroke();
      const pico = m.c.puntos.reduce((a, b) => (b.dT > a.dT ? b : a));
      rotulo(g, String(i + 1), X(pico.t) - 14 * k + i * 14 * k, Y(pico.dT) - 6 * k, css('--text'), k, 'center');
    });
    g.setLineDash([]);
    const caja2 = $('#cvh-termo-res'), u = ctx.motor().ultimo;
    if (!medidas.length) { caja2.innerHTML = `<p class="cv-muted">Pulsa «Inyectar» tres veces. Antes, <b>predice</b>: con un gasto alto, ¿la curva será más ancha o más estrecha?</p>`; return; }
    const r = medidasTermo(medidas.map(m => m.c.gcMedido));
    const lista = medidas.map((m, i) => `<li><b>${i + 1}</b> (${['línea continua', 'rayas', 'puntos'][i]}): GC ${n2(m.c.gcMedido)} L/min · área ${n1(m.c.area)} °C·s</li>`).join('');
    let veredicto = '';
    if (medidas.length === 3) veredicto = r.fiables
      ? `<p class="tfg-estado tfg-estado-ok">✅ Difieren un ${n1(r.dif * 100)} % (≤10 %): bastan. GC = su media, <b>${n2(r.media)} L/min</b>. ${chipFicha(FUENTES_HEMO.termoCuantas)}</p>`
      : `<p class="tfg-estado tfg-estado-warn">⚠️ Difieren un ${n1(r.dif * 100)} % (>10 %): no son fiables; repite. ${chipFicha(FUENTES_HEMO.termoCuantas)}</p>`;
    const it = medidas.some(m => m.it)
      ? `<p class="tfg-estado tfg-estado-warn">Con insuficiencia tricuspídea el frío se recicla: curva <b>más baja y más larga</b>, área mayor y un gasto medido <b>por debajo</b> del real (GC del modelo ${n2(u.gc)} L/min). Si el inyectado se calienta al reciclarse, lo sobrestima. ${chipFicha(FUENTES_HEMO.termoErrores)} ${chipOrigen('ilustrativo')}</p>` : '';
    caja2.innerHTML = `<ul class="cvh-registro">${lista}</ul>` + veredicto + it +
      `<p class="cv-muted">GC del modelo: ${n2(u.gc)} L/min ${chipOrigen('modelo')}. Variación entre medidas (±6 %, el momento de la inyección en la respiración) y forma de la curva: ${chipOrigen('ilustrativo')}</p>`;
  }

  // ---------------------------------------------------------------- comunes
  for (const id of ['#cv-plegable-guyton', '#cv-plegable-cateter', '#cv-plegable-termo']) $(id).addEventListener('toggle', () => { claveG = ''; claveC = ''; claveTe = ''; });
  function alCambiarMotor() {
    antes = null; ultimaManiobra = null; registro = []; medidas = []; claveG = ''; claveC = ''; claveTe = ''; traza = []; ultimoT = -1;
    botonesG();
  }
  function pintar(estado) {
    if (abierto('#cv-plegable-guyton')) pintarG();
    if (abierto('#cv-plegable-cateter')) pintarC(estado);
    if (abierto('#cv-plegable-termo')) pintarTe();
  }
  const PANEL = { guyton: '#cv-plegable-guyton', epp: '#cv-plegable-guyton', cateter: '#cv-plegable-cateter', termo: '#cv-plegable-termo' };
  function abrir(clave) {
    const d = $(PANEL[clave]); if (!d) return;
    d.open = true; claveG = ''; claveC = ''; claveTe = '';
    if (clave === 'guyton' || clave === 'epp') asentar();
    requestAnimationFrame(() => d.scrollIntoView({ block: 'start', behavior: sinMovimiento() ? 'auto' : 'smooth' }));
    if (clave === 'epp') { const b = $('#cvh-epp'); b.classList.add('cvh-destacar'); setTimeout(() => b.classList.remove('cvh-destacar'), 2400); }
  }
  botonesG(); actualizarCat(false);
  return { pintar, alCambiarMotor, abrir };
}
