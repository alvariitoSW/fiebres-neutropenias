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

const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/**
 * Dibujos del Wiggers (canvas cw) y del asa P-V (canvas cp).
 * pintar(estado, motor, lado) dibuja ese estado y devuelve lo que ha dibujado: { t, puntos },
 * para que las pruebas comprueben que el cursor está en el mismo instante que el corazón.
 */
export function crearDiagramas(cw, cp) {
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
    const cam = motor.p[L.camara], ees = motor.ef[L.ees];
    h.save(); h.beginPath(); h.rect(cpb.x0, cpb.y0, cpb.x1 - cpb.x0, cpb.y1 - cpb.y0); h.clip();
    h.setLineDash([5 * kp, 4 * kp]); h.lineWidth = 1.5 * kp;
    // ESPVR: P = Ees·(V − V0); EDPVR: P = A·(e^(B·(V − V0)) − 1). Sin tabique ni pericardio.
    h.strokeStyle = css('--r'); h.beginPath(); h.moveTo(xV(cam.v0), yPp(0)); h.lineTo(xV(cam.v0 + esc.pvPMax / ees), yPp(esc.pvPMax)); h.stroke();
    h.strokeStyle = css('--p'); h.beginPath();
    for (let v = cam.v0; v <= esc.pvVMax; v += 2) { const p = cam.a * (Math.exp(cam.b * (v - cam.v0)) - 1); v === cam.v0 ? h.moveTo(xV(v), yPp(p)) : h.lineTo(xV(v), yPp(p)); if (p > esc.pvPMax) break; }
    h.stroke(); h.setLineDash([]); h.restore();
    // leyenda arriba a la derecha (el asa no llega ahí)
    h.font = `${10 * kp}px Georgia`; h.textAlign = 'right';
    h.fillStyle = css('--r'); h.fillText('ESPVR · Ees del modelo', cpb.x1 - 6 * kp, cpb.y0 + 14 * kp);
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
