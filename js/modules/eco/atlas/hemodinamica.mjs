// Atlas · 08 Hemodinámica por Doppler: continuidad, Bernoulli, recuperación de presión, PSVD y PAD por la VCI.
// Reconstruido sobre el motor del latido de la app (idea de The Heart by Ultrasound, cap. 08, sin su código):
//   · Flujo y presión: el flujo aórtico es el del motor, con la estenosis aórtica del propio motor (areaAortica: en
//     la vena contracta cae 4v²; pasado el orificio, el chorro recupera 4v² · 2r(1 − r) según el diámetro de la aorta,
//     Baumgartner 2017). Las velocidades salen de ese flujo y del área de cada nivel (el TSVI, el orificio).
//   · PSVD y VCI: la velocidad de un chorro de insuficiencia tricuspídea sale del gradiente VD-AD del motor
//     (v = √(ΔP/4)); el calibre de la VCI, de la PVC del motor (modeloVci, el mismo del simulador); la PAD se estima con
//     las tres categorías de la guía ASE 2025 (Mukherjee) y se compara con la PVC y la PSVD reales del motor.
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { modeloVci } from '../abdomen.mjs';
import { lienzo, colores, texto, deslizador, segmentos, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

const areaCirculo = (dCm) => Math.PI * (dCm / 2) ** 2;      // cm²

/** Motor asentado con una válvula aórtica y una aorta dadas, sin barorreflejo (para ver el efecto puro). */
export function motorFlujo({ area = 3.0, dAorta = 3.0, volumen = 0 } = {}, segundos = 14) {
  const m = crearMotor({ barorreflejo: false, areaAortica: area, dAorta });
  m.s.vven += volumen;
  m.correr(segundos);
  return m;
}

/** Medidas Doppler del último latido. dReal: diámetro verdadero del TSVI; dMedido: el que mide el ecografista (cm).
 *  Pura: la usan la figura y las pruebas. */
export function analizarFlujo(m, { dReal = 2.0, dMedido = dReal } = {}) {
  const o = m.onda, u = m.ultimo, eoa = m.p.areaAortica || areaCirculo(dReal);
  const aL = areaCirculo(dReal), aMed = areaCirculo(dMedido);
  const ej = o.filter(x => x.t >= u.tAoAbre && x.t <= u.tS2 && x.qAo > 0);
  const dt = o.length > 1 ? o[1].t - o[0].t : 0.002;
  let vtiL = 0, vtiA = 0, vMaxL = 0, vMaxA = 0, sumaGrad = 0, sumaV = 0, cat = 0, vol = 0;
  for (const x of ej) {
    vol += x.qAo * dt;
    const vl = x.qAo / (100 * aL), va = x.qAo / (100 * eoa);
    vtiL += vl * dt * 100; vtiA += va * dt * 100;            // cm
    vMaxL = Math.max(vMaxL, vl); vMaxA = Math.max(vMaxA, va);
    sumaGrad += 4 * va * va; sumaV += va;
  }
  for (const x of o) if (x.vAo) cat = Math.max(cat, x.pvi - x.pao);
  const n = Math.max(1, ej.length), r = Math.min(1, eoa / areaCirculo(m.p.dAorta));
  const gradMax = 4 * vMaxA * vMaxA;
  return {
    eoa, aL, aMed, vtiL, vtiA, vMaxL, vMaxA, gradMax,
    gradCorregido: 4 * (vMaxA * vMaxA - vMaxL * vMaxL),
    gradMedio: sumaGrad / n, gradDeVelMedia: 4 * (sumaV / n) ** 2,
    recuperacion: gradMax * 2 * r * (1 - r), cateter: cat,
    vsReal: vol, vsDoppler: aMed * vtiL, avaCont: aMed * vtiL / Math.max(1e-6, vtiA), cociente: vMaxL / Math.max(1e-6, vMaxA),
    gc: u.gc, fc: u.fc, pas: u.pas, pviMax: u.pvi_max, et: (u.tS2 - u.tAoAbre) * 1000,
  };
}

/** PAD estimada por la VCI (guía ASE 2025): 3, 8 o 15 mmHg; null en ventilación con presión positiva.
 *  colapso en fracción; corte de 50% con sniff y de 20% con respiración tranquila (si el paciente no puede hacer sniff). */
export function estimarPad(dmaxMm, colapso, respiracion = 'sniff') {
  if (respiracion === 'vm') return { pad: null, patron: 'vm' };
  const corte = respiracion === 'tranquila' ? 0.2 : 0.5, ancha = dmaxMm > 21, colapsa = colapso >= corte;
  if (!ancha && colapsa) return { pad: 3, patron: 'normal', rango: '0-5', corte };
  if (ancha && !colapsa) return { pad: 15, patron: 'alta', rango: '10-20', corte };
  return { pad: 8, patron: 'mixto', rango: '5-10', corte };
}

/** Con respiración tranquila la VCI colapsa menos que con sniff: fracción ilustrativa del colapso del sniff. */
export const COLAPSO_TRANQUILA = 0.45;

/** Velocidad del chorro tricuspídeo (si lo hubiera), PSVD y PVC del motor. Pura. */
export function analizarDerechas(m) {
  const o = m.onda, u = m.ultimo;
  let grad = 0;
  for (const x of o) if (!x.vTri && x.eVen > 0) grad = Math.max(grad, x.pvd - x.pad);
  const vTr = Math.sqrt(Math.max(0, grad) / 4);
  return { vTr, gradTr: grad, pvdMax: u.pvd_max, paps: u.paps, pvc: u.pvc, curva: o.map(x => ({ t: x.t, v: (!x.vTri && x.eVen > 0 && x.pvd > x.pad) ? Math.sqrt((x.pvd - x.pad) / 4) : 0 })) };
  // (solo en sístole ventricular: con un VD rígido y la AD vaciándose tras su contracción, la tricúspide puede cerrarse
  // antes de la sístole, pero el chorro de IT que se mide es el sistólico)
}

export const ESCENARIOS_DERECHAS = ['normal', 'hemorragia', 'fallo', 'derrame', 'tep'];
export function motorEscenario(clave) {
  const m = crearMotor(); m.correr(10);
  const e = ESCENARIOS[clave]; e.aplicar(m);
  m.correr(e.forma ? ASENTAR_FORMA : 12);
  return m;
}

export function montar(el) {
  const st = { modo: 'flujo', area: 3.0, dReal: 2.0, errorMm: 0, dAorta: 3.0, volumen: 0, escenario: 'normal', resp: 'sniff', t: 0.1 };
  let m = motorFlujo(st), F = analizarFlujo(m, { dReal: st.dReal, dMedido: st.dReal }), mD = null, R = null, espera = 0;
  const cacheEsc = {};

  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  const grupoF = document.createElement('div'), grupoD = document.createElement('div');
  segmentos(mandos, { etiqueta: 'Mostrar', valor: 'flujo', opciones: [['flujo', 'Flujo y presión'], ['derechas', 'PSVD y VCI']],
    onChange: (v) => { st.modo = v; grupoF.hidden = v !== 'flujo'; grupoD.hidden = v !== 'derechas'; if (v === 'derechas') prepararDerechas(); pintar(); } });
  mandos.append(grupoF, grupoD); grupoD.hidden = true;
  const recalcular = () => { clearTimeout(espera); espera = setTimeout(() => { m = motorFlujo(st); medir(); pintar(); }, 120); };
  const medir = () => { F = analizarFlujo(m, { dReal: st.dReal, dMedido: st.dReal + st.errorMm / 10 }); };
  deslizador(grupoF, { etiqueta: 'Área valvular aórtica', min: 0.6, max: 3.0, paso: 0.05, valor: st.area, fmt: (v) => `${coma(v, 2)} cm²`, onInput: (v) => { st.area = v; recalcular(); } });
  deslizador(grupoF, { etiqueta: 'Diámetro real del TSVI', min: 1.8, max: 2.6, paso: 0.05, valor: st.dReal, fmt: (v) => `${coma(v, 2)} cm`, onInput: (v) => { st.dReal = v; medir(); pintar(); } });
  deslizador(grupoF, { etiqueta: 'Error al medir el TSVI', min: -3, max: 3, paso: 0.5, valor: 0, fmt: (v) => `${v > 0 ? '+' : ''}${coma(v, 1)} mm`, onInput: (v) => { st.errorMm = v; medir(); pintar(); } });
  deslizador(grupoF, { etiqueta: 'Aorta ascendente', min: 2.2, max: 4.5, paso: 0.1, valor: st.dAorta, fmt: (v) => `${coma(v, 1)} cm`, onInput: (v) => { st.dAorta = v; recalcular(); } });
  deslizador(grupoF, { etiqueta: 'Flujo (volemia)', min: -600, max: 800, paso: 50, valor: 0, fmt: (v) => `${v > 0 ? '+' : ''}${v} mL`, onInput: (v) => { st.volumen = v; recalcular(); } });
  segmentos(grupoD, { etiqueta: 'Corazón', valor: 'normal', opciones: ESCENARIOS_DERECHAS.map(k => [k, ESCENARIOS[k].nombre]),
    onChange: (v) => { st.escenario = v; prepararDerechas(); pintar(); } });
  segmentos(grupoD, { etiqueta: 'Respiración', valor: 'sniff', opciones: [['sniff', 'Sniff'], ['tranquila', 'Tranquila'], ['vm', 'Ventilación mecánica']],
    onChange: (v) => { st.resp = v; pintar(); } });

  function prepararDerechas() {
    if (!cacheEsc[st.escenario]) cacheEsc[st.escenario] = motorEscenario(st.escenario);
    mD = cacheEsc[st.escenario]; R = analizarDerechas(mD);
  }

  const L1 = lienzo(el, 0.72, 'Tracto de salida del VI, válvula aórtica y aorta, con la sangre y la presión a lo largo del eje');
  const L2 = lienzo(el, 0.5, 'Doppler espectral: velocidades del latido');
  const lect = lecturas(el), vivo = enVivo(el);

  // ---------------- modo flujo
  function geometria(W, H, k) {
    const x0 = 8 * k, x1 = W - 8 * k, yc = H * 0.3, esc = (H * 0.38) / 4.6;      // px por cm de diámetro
    const xL = x0 + (x1 - x0) * 0.32, xV = x0 + (x1 - x0) * 0.42, xVc = x0 + (x1 - x0) * 0.47, xExp = x0 + (x1 - x0) * 0.72;
    const dVc = 2 * Math.sqrt(F.eoa / Math.PI);
    // diámetro de la luz (o del chorro) en cada x
    const d = (x) => x < xL ? st.dReal * (1.6 - 0.6 * (x - x0) / (xL - x0))
      : x < xV ? st.dReal : x < xVc ? st.dReal + (dVc - st.dReal) * (x - xV) / (xVc - xV)
        : x < xExp ? dVc + (st.dAorta - dVc) * (x - xVc) / (xExp - xVc) : st.dAorta;
    return { x0, x1, yc, esc, xL, xV, xVc, xExp, d, dVc };
  }

  function pintarFlujo() {
    L1.ajustar(); L2.ajustar();
    const { ctx, W, H, k } = L1, col = colores(el), o = m.onda, u = m.ultimo, T = u.periodo;
    ctx.clearRect(0, 0, W, H);
    const G = geometria(W, H, k);
    const tl = st.t % T, mu = o.reduce((a, b) => (Math.abs(b.t - tl) < Math.abs(a.t - tl) ? b : a));
    // paredes: VI y TSVI, aorta (la del chorro se dibuja aparte)
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2 * k;
    const pared = (x) => (x < G.xV ? G.d(x) : st.dAorta);      // VI y TSVI hasta la válvula; después, la aorta
    for (const s of [-1, 1]) {
      ctx.beginPath();
      for (let x = G.x0; x <= G.x1; x += 2 * k) { const y = G.yc + s * pared(x) / 2 * G.esc; x === G.x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
    }
    // valvas: de la pared del TSVI al borde del orificio
    const abierta = mu.vAo, dOr = abierta ? G.dVc : 0.05;
    ctx.strokeStyle = col.y; ctx.lineWidth = 3 * k;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(G.xV, G.yc + s * st.dReal / 2 * G.esc); ctx.lineTo(G.xVc, G.yc + s * dOr / 2 * G.esc); ctx.stroke(); }
    // chorro (vena contracta que se expande)
    if (abierta) {
      ctx.fillStyle = col.r; ctx.globalAlpha = 0.16; ctx.beginPath();
      for (let x = G.xVc; x <= G.xExp; x += 2 * k) ctx.lineTo(x, G.yc - G.d(x) / 2 * G.esc);
      for (let x = G.xExp; x >= G.xVc; x -= 2 * k) ctx.lineTo(x, G.yc + G.d(x) / 2 * G.esc);
      ctx.fill(); ctx.globalAlpha = 1;
    }
    // sangre: partículas que avanzan a la velocidad local (Q ÷ área de la luz o del chorro)
    const q = Math.max(0, mu.qAo), rel = 0.18;            // cámara lenta
    ctx.fillStyle = col.r;
    for (let i = 0; i < 70; i++) {
      const fila = ((i * 0.7548777) % 1) * 0.9 - 0.45, semilla = (i * 0.5698403) % 1;
      let x = G.x0 + ((semilla * (G.x1 - G.x0)) + avance[i]) % (G.x1 - G.x0);
      const dd = G.d(x), y = G.yc + fila * dd * G.esc;
      ctx.beginPath(); ctx.arc(x, y, 1.6 * k, 0, 7); ctx.fill();
    }
    texto(ctx, 'VI', G.x0 + 4 * k, G.yc - G.d(G.x0) / 2 * G.esc - 4 * k, col.muted, k, { tam: 10 });
    texto(ctx, 'TSVI', (G.xL + G.xV) / 2, G.yc - st.dReal / 2 * G.esc - 4 * k, col.muted, k, { tam: 10, alinear: 'center' });
    texto(ctx, 'Aorta', G.x1 - 4 * k, G.yc - st.dAorta / 2 * G.esc - 4 * k, col.muted, k, { tam: 10, alinear: 'right' });
    if (abierta) texto(ctx, 'vena contracta', G.xVc, G.yc + Math.max(st.dReal, st.dAorta) / 2 * G.esc + 12 * k, col.r, k, { tam: 9, alinear: 'center', halo: col.bg });
    // presión a lo largo del eje en este instante
    const yTit = H * 0.62, yT = yTit + 18 * k, yB = H - 10 * k;
    const vL = q / (100 * F.aL), vVc = q / (100 * F.eoa);
    const pLv = mu.pvi, pL = pLv - 4 * vL * vL, pVc = abierta ? pLv - 4 * vVc * vVc : pLv, pAo = mu.pao;
    const pts = [[G.x0, pLv], [G.xL, pLv], [G.xV, pL], [G.xVc, pVc], [G.xExp, pAo], [G.x1, pAo]];
    // escala de al menos 40 mmHg centrada en las presiones del instante (una caída de 2 mmHg no debe parecer enorme)
    const ps = pts.map(p => p[1]), lo = Math.min(...ps), hi = Math.max(...ps), medio = (lo + hi) / 2, semi = Math.max(20, (hi - lo) / 2 + 4);
    const pmin = medio - semi, pmax = medio + semi;
    const yP = (p) => yB - (p - pmin) / (pmax - pmin) * (yB - yT);
    ctx.strokeStyle = col.b; ctx.lineWidth = 2 * k; ctx.beginPath();
    if (abierta) pts.forEach(([x, p], i) => (i ? ctx.lineTo(x, yP(p)) : ctx.moveTo(x, yP(p))));
    else { ctx.moveTo(G.x0, yP(pLv)); ctx.lineTo(G.xVc, yP(pLv)); ctx.moveTo(G.xVc, yP(pAo)); ctx.lineTo(G.x1, yP(pAo)); }
    ctx.stroke();
    texto(ctx, `VI ${coma(pLv, 0)}`, G.x0 + 2 * k, yP(pLv) - 5 * k, col.b, k, { tam: 9, halo: col.bg });
    if (abierta) texto(ctx, `${coma(pVc, 0)}`, G.xVc, yP(pVc) + 12 * k, col.b, k, { tam: 9, alinear: 'center', halo: col.bg });
    texto(ctx, `Ao ${coma(pAo, 0)} mmHg`, G.x1 - 2 * k, yP(pAo) - 5 * k, col.b, k, { tam: 9, alinear: 'right', halo: col.bg });
    texto(ctx, abierta ? `Presión a lo largo del eje (mmHg) · flujo ${coma(q, 0)} mL/s` : 'Válvula aórtica cerrada (diástole)', G.x0, yTit, col.muted, k, { tam: 9 });

    // espectro: CW aórtico y PW del TSVI, hacia abajo (vista apical), con el cursor
    const c2 = L2.ctx, W2 = L2.W, H2 = L2.H, k2 = L2.k, yb = 14 * k2, xa = 30 * k2, xb = W2 - 8 * k2;
    c2.clearRect(0, 0, W2, H2);
    const vTope = Math.max(2, Math.ceil(F.vMaxA + 0.5)), yV = (v) => yb + v / vTope * (H2 - yb - 16 * k2), xT = (t) => xa + t / T * (xb - xa);
    c2.strokeStyle = col.line; c2.lineWidth = 1 * k2; c2.beginPath(); c2.moveTo(xa, yb); c2.lineTo(xb, yb); c2.stroke();
    for (let v = 1; v <= vTope; v++) texto(c2, `${v}`, xa - 4 * k2, yV(v) + 3 * k2, col.muted, k2, { tam: 9, alinear: 'right' });
    texto(c2, 'm/s', xa - 4 * k2, yb - 3 * k2, col.muted, k2, { tam: 9, alinear: 'right' });
    const traza = (area, color, relleno) => {
      c2.beginPath(); c2.moveTo(xT(0), yb);
      for (const x of o) c2.lineTo(xT(x.t), yV(Math.max(0, x.qAo) / (100 * area)));
      c2.lineTo(xT(T), yb);
      if (relleno) { c2.fillStyle = color; c2.globalAlpha = 0.25; c2.fill(); c2.globalAlpha = 1; }
      c2.strokeStyle = color; c2.lineWidth = 1.8 * k2; c2.stroke();
    };
    traza(F.eoa, col.r, true); traza(F.aL, col.g, false);
    texto(c2, `CW aórtico ${coma(F.vMaxA, 1)} m/s`, xb, H2 - 4 * k2, col.r, k2, { tam: 9, alinear: 'right', halo: col.bg });
    texto(c2, `PW TSVI ${coma(F.vMaxL, 1)} m/s`, xa + 4 * k2, H2 - 4 * k2, col.g, k2, { tam: 9, halo: col.bg });
    c2.strokeStyle = col.text; c2.globalAlpha = 0.6; c2.beginPath(); c2.moveTo(xT(tl), yb - 4 * k2); c2.lineTo(xT(tl), H2 - 14 * k2); c2.stroke(); c2.globalAlpha = 1;

    const errVs = (F.vsDoppler / F.vsReal - 1) * 100, err = st.errorMm !== 0;
    const grave = F.vMaxA >= 4 || F.avaCont < 1;
    lect.pintar([
      { k: 'Velocidad aórtica máxima', v: coma(F.vMaxA, 2), u: 'm/s', aviso: F.vMaxA >= 4 },
      { k: 'Gradiente máximo (4v²)', v: coma(F.gradMax, 0), u: 'mmHg', fuente: 'Bernoulli simplificado' },
      ...(F.vMaxL > 1.5 ? [{ k: 'Con la velocidad del TSVI, 4(V₂² − V₁²)', v: coma(F.gradCorregido, 0), u: 'mmHg', aviso: true, fuente: 'V₁ > 1,5 m/s' }] : []),
      { k: 'Gradiente medio', v: coma(F.gradMedio, 0), u: `mmHg (con la velocidad media saldría ${coma(F.gradDeVelMedia, 0)})` },
      { k: 'Caída neta VI → aorta (catéter)', v: coma(F.cateter, 0), u: `mmHg · recuperación ≈ ${coma(F.recuperacion, 0)}`, fuente: 'motor' },
      { k: 'ITV del TSVI / aórtica', v: `${coma(F.vtiL, 1)} / ${coma(F.vtiA, 1)}`, u: 'cm' },
      { k: 'VS = área del TSVI × ITV', v: coma(F.vsDoppler, 0), u: `mL · real ${coma(F.vsReal, 0)}${err ? ` (${errVs > 0 ? '+' : ''}${coma(errVs, 0)}%)` : ''}`, aviso: Math.abs(errVs) > 10 },
      { k: 'Área valvular por continuidad', v: coma(F.avaCont, 2), u: `cm² · real ${coma(F.eoa, 2)}`, aviso: grave },
      { k: 'Cociente de velocidades', v: coma(F.cociente, 2), u: '≤0,25 sugiere estenosis grave', aviso: F.cociente <= 0.25 },
      { k: 'Gasto cardíaco', v: coma(F.gc, 1), u: `L/min · PAS ${coma(F.pas, 0)} · PVI máx ${coma(F.pviMax, 0)} mmHg`, fuente: 'motor' },
    ]);
    const txt = [];
    txt.push(`En el pico de la eyección, el mismo flujo pasa por el TSVI a ${coma(F.vMaxL, 2)} m/s y por el orificio a ${coma(F.vMaxA, 2)} m/s: donde el área cae, la velocidad sube y la presión baja.`);
    if (F.recuperacion > 3) txt.push(`Pasado el orificio el chorro frena y la presión vuelve a subir: el Doppler mide ${coma(F.gradMax, 0)} mmHg y el catéter ${coma(F.cateter, 0)}${st.dAorta < 3 ? ' (aorta de menos de 30 mm: la recuperación pesa)' : ''}.`);
    if (err) txt.push(`Un error de ${coma(Math.abs(st.errorMm), 1)} mm en el diámetro del TSVI cambia el volumen sistólico calculado un ${coma(Math.abs(errVs), 0)}%: el diámetro va al cuadrado.`);
    if (F.vMaxA >= 4) txt.push('<b>Velocidad ≥4 m/s: estenosis aórtica grave.</b>');
    vivo.pintar(txt.join(' '));
  }

  // ---------------- modo derechas
  function pintarDerechas() {
    L1.ajustar(); L2.ajustar();
    const col = colores(el);
    const u = mD.ultimo, T = u.periodo, vci = modeloVci(R.pvc);
    const colapso = st.resp === 'tranquila' ? vci.colapso * COLAPSO_TRANQUILA : st.resp === 'vm' ? 0 : vci.colapso;
    const est = estimarPad(vci.dmax, colapso, st.resp);
    // CW tricuspídeo (lienzo 1, parte de arriba) y VCI en modo M (lienzo 2)
    { const { ctx, W, H, k } = L1; ctx.clearRect(0, 0, W, H);
      const yb = 16 * k, xa = 30 * k, xb = W - 8 * k, vTope = Math.max(3, Math.ceil(R.vTr + 0.5));
      const yV = (v) => yb + v / vTope * (H - yb - 20 * k), xT = (t) => xa + (t % T) / T * (xb - xa);
      ctx.strokeStyle = col.line; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.moveTo(xa, yb); ctx.lineTo(xb, yb); ctx.stroke();
      for (let v = 1; v <= vTope; v++) texto(ctx, `${v}`, xa - 4 * k, yV(v) + 3 * k, col.muted, k, { tam: 9, alinear: 'right' });
      texto(ctx, 'm/s', xa - 4 * k, yb - 4 * k, col.muted, k, { tam: 9, alinear: 'right' });
      ctx.beginPath(); ctx.moveTo(xT(0), yb);
      for (const p of R.curva) ctx.lineTo(xT(p.t), yV(p.v));
      ctx.lineTo(xT(T * 0.999), yb); ctx.fillStyle = col.p; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.p; ctx.lineWidth = 1.8 * k; ctx.stroke();
      ctx.setLineDash([4 * k, 4 * k]); ctx.strokeStyle = col.r; ctx.beginPath(); ctx.moveTo(xa, yV(2.9)); ctx.lineTo(xb, yV(2.9)); ctx.stroke(); ctx.setLineDash([]);
      texto(ctx, '2,9 m/s', xb, yV(2.9) - 3 * k, col.r, k, { tam: 9, alinear: 'right', halo: col.bg });
      texto(ctx, `IT (CW) · pico ${coma(R.vTr, 2)} m/s → ${coma(R.gradTr, 0)} mmHg`, xa + 4 * k, H - 6 * k, col.p, k, { tam: 9, halo: col.bg });
      const tl = st.t % T; ctx.strokeStyle = col.text; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(xT(tl), yb - 4 * k); ctx.lineTo(xT(tl), H - 16 * k); ctx.stroke(); ctx.globalAlpha = 1;
    }
    { const { ctx, W, H, k } = L2; ctx.clearRect(0, 0, W, H);
      const xa = 30 * k, xb = W - 8 * k, yc = H * 0.5, esc = (H * 0.75) / 30, ciclo = 6;    // 6 s visibles
      ctx.fillStyle = '#0b0b0e'; ctx.fillRect(xa, 8 * k, xb - xa, H - 20 * k);
      const diam = (t) => {
        if (st.resp === 'vm') return vci.dmax * (1 - 0.06 * Math.max(0, Math.sin(2 * Math.PI * t / 4)));   // apenas cambia
        const f = (t % 4) / 4;
        if (st.resp === 'sniff') { const s = f > 0.55 && f < 0.75 ? Math.sin(Math.PI * (f - 0.55) / 0.2) : 0; return vci.dmax * (1 - colapso * s); }
        return vci.dmax * (1 - colapso * Math.max(0, Math.sin(2 * Math.PI * f)) ** 2);
      };
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.strokeStyle = '#d8d0bd'; ctx.lineWidth = 3 * k;
        for (let x = xa; x <= xb; x += 2 * k) { const t = (x - xa) / (xb - xa) * ciclo, y = yc + s * diam(t) / 2 * esc; x === xa ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); }
      texto(ctx, `VCI · modo M · ${coma(vci.dmax / 10, 1)} cm, colapso ${coma(colapso * 100, 0)}% (${{ sniff: 'sniff', tranquila: 'respiración tranquila', vm: 'ventilación' }[st.resp]})`, xa + 4 * k, H - 3 * k, col.muted, k, { tam: 9 });
      ctx.setLineDash([3 * k, 3 * k]); ctx.strokeStyle = col.y; ctx.lineWidth = 1 * k;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(xa, yc + s * 21 / 2 * esc); ctx.lineTo(xb, yc + s * 21 / 2 * esc); ctx.stroke(); }
      ctx.setLineDash([]); texto(ctx, '2,1 cm', xb - 2 * k, yc - 21 / 2 * esc - 3 * k, col.y, k, { tam: 9, alinear: 'right', halo: '#0b0b0e' });
    }
    const psvdEst = est.pad == null ? null : R.gradTr + est.pad, errPsvd = psvdEst == null ? null : Math.round(psvdEst) - Math.round(R.pvdMax);
    lect.pintar([
      { k: 'Velocidad máxima de la IT', v: coma(R.vTr, 2), u: 'm/s', aviso: R.vTr >= 2.9, fuente: 'del gradiente VD-AD del motor' },
      { k: 'Gradiente VD-AD = 4v²', v: coma(R.gradTr, 0), u: 'mmHg' },
      { k: 'VCI', v: `${coma(vci.dmax / 10, 1)} cm · ${coma(colapso * 100, 0)}%`, u: st.resp === 'vm' ? 'el colapso no se interpreta' : `corte ${coma(est.corte * 100, 0)}%`, aviso: vci.dmax > 21, fuente: 'ilustrativo' },
      { k: 'PAD estimada (ASE 2025)', v: est.pad == null ? '—' : `${est.pad}`, u: est.pad == null ? 'medida invasiva, o 8 si persiste la duda' : `mmHg (rango ${est.rango})${est.patron === 'mixto' ? ' · patrón mixto: deciden los signos secundarios' : ''}`, aviso: est.patron === 'mixto' },
      { k: 'PVC real del motor', v: coma(R.pvc, 1), u: 'mmHg', fuente: 'motor' },
      { k: 'PSVD = 4v² + PAD', v: psvdEst == null ? '—' : coma(psvdEst, 0), u: psvdEst == null ? '' : `mmHg · real ${coma(R.pvdMax, 0)} (${errPsvd >= 0 ? '+' : ''}${coma(errPsvd, 0)})`, aviso: psvdEst != null && Math.abs(errPsvd) > 5 },
      { k: 'PAPs del motor', v: coma(R.paps, 0), u: 'mmHg (sin obstrucción del TSVD, = PSVD)', fuente: 'motor' },
    ]);
    const t = [];
    t.push(`Si hubiera un chorro de insuficiencia tricuspídea, su velocidad máxima reflejaría el gradiente VD-AD de este corazón: ${coma(R.vTr, 2)} m/s, ${coma(R.gradTr, 0)} mmHg.`);
    if (R.vTr >= 2.9) t.push('<b>Una velocidad ≥2,9 m/s sugiere hipertensión pulmonar.</b>');
    if (est.pad != null) t.push(`La VCI da una PAD de ${est.pad} mmHg (la real del motor es ${coma(R.pvc, 0)}), y la PSVD estimada es ${coma(psvdEst, 0)} mmHg frente a ${coma(R.pvdMax, 0)} reales: la PAD por categorías redondea.`);
    else t.push('Con ventilación con presión positiva el colapso de la VCI no estima la PAD.');
    vivo.pintar(t.join(' '));
  }

  const avance = new Float32Array(70);
  function pintar() { st.modo === 'flujo' ? pintarFlujo() : pintarDerechas(); }
  pintar();
  const anim = reducirMovimiento() ? null : animar(L1.c, (dt) => {
    st.t += dt * 0.3;
    if (st.modo === 'flujo') {                                   // las partículas avanzan a la velocidad local, en cámara lenta
      const o = m.onda, T = m.ultimo.periodo, tl = st.t % T;
      const mu = o.reduce((a, b) => (Math.abs(b.t - tl) < Math.abs(a.t - tl) ? b : a)), q = Math.max(0, mu.qAo);
      const { W, H, k } = L1, G = geometria(W, H, k), ancho = G.x1 - G.x0;
      for (let i = 0; i < avance.length; i++) {
        const x = G.x0 + (((i * 0.5698403) % 1) * ancho + avance[i]) % ancho, dd = G.d(x);
        avance[i] = (avance[i] + (q / (100 * Math.PI * (dd / 2) ** 2)) * dt * 0.3 * 40 * k) % ancho;
      }
    }
    pintar();
  });
  const ro = new ResizeObserver(() => pintar()); ro.observe(L1.c);
  return { parar() { anim?.parar(); ro.disconnect(); clearTimeout(espera); } };
}
