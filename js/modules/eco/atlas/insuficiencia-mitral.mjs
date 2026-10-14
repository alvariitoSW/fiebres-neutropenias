// Atlas · 18 Insuficiencia mitral: el orificio regurgitante del motor del latido (eroaMitral), con el remodelado crónico
// del VI y de la AI, y el método PISA y los grados de la ASE 2017 aplicados a lo que da el motor. Reconstruido sobre
// nuestro motor (idea de The Heart by Ultrasound, cap. 18, sin su código ni su tabla de cifras interpoladas: allí cada
// medida sigue una curva escrita a mano dentro de las bandas de la ASE; aquí el deslizador mueve el orificio y el
// resto sale del latido del motor).
//   · Orificio (EROA, cm²): el mando. El motor hace el chorro con la ecuación del orificio y Bernoulli (v = √(ΔP/4));
//     de él salen el volumen y la fracción regurgitantes (ultimo.vReg, ultimo.fr), la velocidad pico del chorro (la
//     mayor diferencia de presión VI-AI) y su VTI. El volumen regurgitante es EROA × VTI del chorro del motor.
//   · Remodelado crónico (ilustrativo, fisiología general): con el orificio, el VI se vuelve más distensible y se
//     dilata (más volumen, V0 mayor y curva diastólica más blanda), la AI también, y las resistencias sistémicas suben
//     algo; con el orificio grande, la contractilidad (Ees) cae y la FEVI acaba cayendo.
//   · PISA (capítulo): flujo = EROA × velocidad pico; r = √(flujo ÷ (2π·Va)); VReg = EROA × VTI. La velocidad pico es la
//     del motor; Va = 32 cm/s es la del ejemplo del capítulo (la ASE aconseja 30-40).
//   · Grados (Zoghbi 2017, Figura 18): cortes de EROA, volumen y fracción regurgitantes; el grado intermedio de los tres
//     es una regla del sitio del original (la figura no da ninguna), y los criterios específicos que se pueden calcular
//     con el motor, que son solo una parte de los seis de cada conjunto.
//   · Diámetros del VI: los de la geometría de la app (medidasCorazon: eje largo paraesternal, como la tabla de FATE).
// Lo que NO da el motor: vena contracta, área del chorro de color, flujo de las venas pulmonares, ondas E y A, y el
// aspecto del chorro CW (su densidad en el dibujo es una regla del original). El hemisferio y el chorro del esquema son
// dibujos: ilustrativos.
import { crearMotor, BASE } from '../motor.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { medidasCorazon } from '../ecografia.mjs';
import { lienzo, colores, texto, deslizador, casilla, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/** Velocidad de aliasing del ejemplo del capítulo (cm/s). La ASE aconseja bajarla a unos 30-40. */
export const VA = 32;
/** EROA máximo del mando (cm²) y paso (cm²). El remodelado llega a su máximo con el EROA máximo. */
export const EROA_MAX = 0.7, PASO = 0.05, EROA_REMODELADO = 0.7;

// ---------------------------------------------------------------------------------------------------- PISA y grados
/**
 * Método PISA del capítulo. flujo = 2π r² Va = EROA × velocidad pico (mL/s; EROA en cm², velocidad en m/s, ×100 → cm/s);
 * r = √(flujo ÷ (2π Va)) (cm); VReg = EROA × VTI (mL; VTI en cm).
 */
export function pisa({ eroa, vmax, va = VA, vti = null }) {
  const flujo = eroa * vmax * 100;
  return { flujo, r: Math.sqrt(flujo / (2 * Math.PI * va)), vReg: vti == null ? null : eroa * vti };
}
/** La ecuación inversa: el EROA que corresponde a un radio medido, a una velocidad de aliasing y a una velocidad pico. */
export const eroaDeRadio = (r, vmax, va = VA) => 2 * Math.PI * r * r * va / (vmax * 100);

/** Cortes de los grados II, III y IV (Zoghbi 2017, Figura 18 y Tabla 8): EROA en cm², volumen en mL, fracción en %. */
export const CORTES = { eroa: [0.2, 0.3, 0.4], vreg: [30, 45, 60], freg: [30, 40, 50] };
/** Grado (1 a 4) de una medida: 1 + los cortes que alcanza. */
export const grado = (clave, x) => 1 + CORTES[clave].filter(c => x >= c).length;
/** Grado cuantitativo global: el intermedio de los tres. Regla del sitio del original: la Figura 18 no da ninguna. */
export const gradoCuantitativo = (e, v, f) => [e, v, f].sort((a, b) => a - b)[1];
export const ROMANO = ['', 'I', 'II', 'III', 'IV'];

/** FEVI y diámetro telesistólico del VI que definen la disfunción del VI en la IM grave (ACC/AHA 2020: estadio C2). */
export const disfuncionVi = (fevi, dtsvi) => fevi <= 60 || dtsvi >= 40;

/** Las medidas que usan los criterios, redondeadas como se muestran (así ninguna cifra contradice su grado). */
export function redondear(med) {
  const r = (x, d = 0) => +x.toFixed(d);
  return { eroa: r(med.eroa, 2), vReg: r(med.vReg), fr: r(med.fr), fevi: r(med.fevi), dtd: r(med.dtd), dts: r(med.dts), ivai: r(med.ivai), r: r(med.r, 2) };
}

/**
 * Criterios específicos (Zoghbi 2017, Figura 18) que se pueden calcular con el motor. Cada uno: true, false o null (el
 * motor no lo da). Las cifras que la figura de Zoghbi no da y rellena el sitio: VReg <30 mL (chorro CW suave), VI y AI
 * normales (DTDVI ≤58 mm e IVAI ≤34 mL/m², Lang 2015) y FEVI >60 % (función normal).
 */
export function criterios(x, flail = false) {
  const leves = [
    { t: 'Jet central pequeño, estrecho (<20% de la AI)', ok: null, sitio: true },
    { t: 'Vena contracta ≤0,3 cm', ok: null },
    { t: 'Radio PISA ausente o ≤0,3 cm', ok: x.r <= 0.3 },
    { t: 'Influjo mitral con onda A dominante', ok: null },
    { t: 'Jet CW suave o incompleto (VReg <30 mL)', ok: x.vReg < 30, sitio: true },
    { t: 'VI y AI de tamaño normal (DTDVI ≤58 mm e IVAI ≤34 mL/m²)', ok: x.dtd <= 58 && x.ivai <= 34, sitio: true },
  ];
  const graves = [
    { t: 'Valva flácida (flail)', ok: flail },
    { t: 'Vena contracta ≥0,7 cm', ok: null },
    { t: 'Radio PISA ≥1,0 cm', ok: x.r >= 1.0 },
    { t: 'Jet central grande (>50% de la AI)', ok: null },
    { t: 'Inversión sistólica del flujo de las venas pulmonares', ok: null },
    { t: 'VI agrandado con función normal (DTDVI >58 mm y FEVI >60%)', ok: x.dtd > 58 && x.fevi > 60, sitio: true },
  ];
  const cuenta = (l) => l.filter(c => c.ok === true).length;
  return { leves, graves, nLeves: cuenta(leves), nGraves: cuenta(graves), calculables: 3 };
}

/**
 * Resultado del algoritmo con lo que se puede calcular. Sin orificio, no hay IM. Con ≥4 criterios específicos
 * decidiría el grado; solo hay tres calculables por conjunto, así que decide el grado cuantitativo (I leve, II y III
 * moderada, IV grave), y el III con 3 criterios específicos de IM grave es grave. En la IM grave, la FEVI ≤60% o el
 * DTSVI ≥40 mm marcan el estadio C2; si no, C1 (ACC/AHA 2020, en ausencia de síntomas).
 */
export function resultado(med, flail = false) {
  const x = redondear(med), cr = criterios(x, flail);
  if (x.eroa <= 0) return { x, cr, tipo: 'ninguna', texto: 'Sin insuficiencia mitral', razon: 'sin orificio regurgitante', grave: false };
  const ge = grado('eroa', x.eroa), gv = grado('vreg', x.vReg), gf = grado('freg', x.fr), q = gradoCuantitativo(ge, gv, gf);
  let tipo = ['', 'leve', 'moderada', 'moderada', 'grave'][q], razon = `grado cuantitativo ${ROMANO[q]}`;
  if (q === 3 && cr.nGraves >= 3) { tipo = 'grave'; razon = 'grado III y 3 criterios específicos de IM grave'; }
  const grave = tipo === 'grave', lvd = disfuncionVi(x.fevi, x.dts);
  return { x, cr, ge, gv, gf, q, tipo, razon, grave, lvd, estadio: grave ? (lvd ? 'C2' : 'C1') : null,
    texto: tipo === 'grave' && lvd ? 'Insuficiencia mitral grave con disfunción del VI' : `Insuficiencia mitral ${tipo}` };
}

// ---------------------------------------------------------------------------------------------------- motor
/**
 * Ajustes del motor para un EROA: el orificio y el remodelado crónico. f = EROA ÷ 0,70 (0 a 1); g, la fase de fallo
 * (desde f = 0,6, EROA 0,42). Magnitudes ilustrativas, elegidas para que la IM crónica recorra lo que dice el texto: VI y
 * AI se dilatan y la FEVI acaba cayendo, sin que la presión arterial se hunda. Las direcciones son fisiología general.
 * En la fase de fallo, la Ees cae (−60%) y el VI se dilata aún más (V0 +30 mL).
 */
export function ajustesMr(eroa) {
  const f = clamp(eroa / EROA_REMODELADO, 0, 1), g = clamp((f - 0.6) / 0.4, 0, 1);
  return { volumen: 100 * f, motor: { barorreflejo: true, eroaMitral: eroa, rSis: BASE.rSis * (1 + 0.2 * f),
    vi: { ees: BASE.vi.ees * (1 - 0.6 * g), b: BASE.vi.b * (1 - 0.08 * f), v0: BASE.vi.v0 + 8 * f + 30 * g },
    ai: { v0: BASE.ai.v0 + 10 * f, b: BASE.ai.b * (1 - 0.15 * f) } } };
}

/** Motor asentado con un EROA (con el barorreflejo del motor, que sostiene la presión). Puro: lo usan la figura y las pruebas. */
export function motorMr(eroa, segundos = 14) {
  const a = ajustesMr(eroa), m = crearMotor(a.motor);
  m.s.vven += a.volumen; m.correr(segundos);
  return m;
}

/** El chorro del último latido: velocidad (m/s) a cada instante a partir de la diferencia de presión VI-AI (4v² = ΔP). */
export function chorro(o) {
  let dpMax = 0, tPico = 0, vti = 0, t0 = null, t1 = null; const curva = [];
  for (let i = 0; i < o.length; i++) {
    const x = o[i], dp = x.qMitReg > 0 ? Math.max(0, x.pvi - x.pai) : 0, v = Math.sqrt(dp / 4);
    const dt = i < o.length - 1 ? o[i + 1].t - x.t : x.t - o[i - 1].t;
    curva.push({ t: x.t, v });
    if (v > 0) { vti += v * 100 * dt; if (t0 == null) t0 = x.t; t1 = x.t; }
    if (dp > dpMax) { dpMax = dp; tPico = x.t; }
  }
  return { vmax: Math.sqrt(dpMax / 4), dpMax, tPico, vti, t0, t1, dur: t0 == null ? 0 : t1 - t0, curva };
}

/** Lo que dan el motor y la geometría de la app en el último latido, más el PISA con la velocidad pico del motor. */
export function medirMr(m) {
  const u = m.ultimo, o = m.onda, extra = extraDeMotor(m), eroa = m.p.eroaMitral;
  const td = o.reduce((a, x) => (x.vvi > a.vvi ? x : a)), ts = o.reduce((a, x) => (x.vvi < a.vvi ? x : a));
  const dtd = medidasCorazon(estadoGeo(td, extra), m.p.sc).lvdd, dts = medidasCorazon(estadoGeo(ts, extra), m.p.sc).lvdd;
  const j = chorro(o), p = pisa({ eroa, vmax: j.vmax, vti: j.vti });
  const sist = o.filter(x => x.fase === 'C' || x.fase === 'D' || x.fase === 'E');
  const v = sist.reduce((a, x) => (x.pai > a.pai ? x : a), sist[0] || o[0]);
  return { eroa, vReg: u.vReg, fr: u.fr * 100, fevi: u.feTotal * 100, vtd: u.edv, vts: u.esv, vsAorta: u.vs, dtd, dts,
    ivai: Math.max(...o.map(x => x.vai)) / m.p.sc, vmax: j.vmax, dpMax: j.dpMax, vti: j.vti, flujo: p.flujo, r: p.r,
    pas: u.pas, ptd: u.ptdvi, pcp: u.pcp, ondaV: v.pai, tOndaV: v.t, chorro: j, periodo: u.periodo };
}

// ---------------------------------------------------------------------------------------------------- figura
export function montar(el) {
  const st = { eroa: 0.3, flail: false, jugar: false, t: 0, pendiente: null };
  const cache = new Map();
  const motorEn = (e) => { const k = Math.round(e / PASO); let r = cache.get(k); if (!r) { const m = motorMr(k * PASO), med = medirMr(m); r = { m, med }; cache.set(k, r); } return r; };
  let actual = null;

  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  const desl = deslizador(mandos, { etiqueta: 'Gravedad · EROA del orificio', min: 0, max: EROA_MAX, paso: PASO, valor: st.eroa,
    fmt: (v) => `${coma(v, 2)} cm²`, marcas: ['sin IM', 'II 0,20', 'III 0,30', 'IV 0,40'],
    onInput: (v) => { st.eroa = v; st.jugar = false; anima.el.checked = false; pedir(); } });
  casilla(mandos, { etiqueta: 'Valva flácida (flail)', valor: false, onChange: (v) => { st.flail = v; pintar(); } });
  const anima = casilla(mandos, { etiqueta: 'Recorrer la progresión', valor: false, onChange: (v) => { st.jugar = v; if (v && st.eroa >= EROA_MAX - 1e-6) { st.eroa = 0; desl.set(0); pedir(); } } });

  const fila = document.createElement('div'); fila.className = 'at-par'; el.appendChild(fila);
  const LE = lienzo(fila, 1.0, 'Esquema de la aurícula y el ventrículo izquierdos con el hemisferio de la convergencia de flujo');
  const LZ = lienzo(fila, 1.0, 'Zoom de la convergencia de flujo (PISA) con su radio frente a los límites de 0,3 y 1,0 cm');
  const LT = lienzo(el, 0.95, 'Presiones del VI y de la AI con la onda v, y Doppler continuo del chorro de insuficiencia mitral');
  const lect = lecturas(el), crit = document.createElement('div'); crit.className = 'at-algo'; el.appendChild(crit);
  const vivo = enVivo(el);

  function pedir() {
    if (st.pendiente) return;
    st.pendiente = requestAnimationFrame(() => { st.pendiente = null; actual = motorEn(st.eroa); pintar(); });
  }

  // ----- esquema: AI y VI como elipsoides con el volumen y el diámetro de la app, orificio, hemisferio del PISA
  function dibujarEsquema(med) {
    LE.ajustar(); const c = colores(el), { ctx, W, H, k } = LE; ctx.clearRect(0, 0, W, H);
    const vaiMax = med.ivai * 1.85, dLa = Math.cbrt(6 * vaiMax / Math.PI);            // cm: esfera con el volumen máximo de la AI
    const dVi = med.dtd / 10, lVi = 6 * med.vtd / (Math.PI * dVi * dVi);              // cm: elipsoide con el VTD y el DTDVI
    const alto = dLa + lVi + 0.8, s = Math.min(H * 0.84 / alto, W * 0.82 / Math.max(dVi, dLa)), yP = H * 0.08 + dLa * s + 0.2 * s, xc = W / 2;
    const elipse = (cx, cy, rx, ry, color, alfa) => { ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI); ctx.globalAlpha = alfa; ctx.fillStyle = color; ctx.fill();
      ctx.globalAlpha = 1; ctx.strokeStyle = color; ctx.lineWidth = 1.5 * k; ctx.stroke(); ctx.restore(); };
    elipse(xc, yP - dLa * s / 2 + 0.2 * s, dLa * s / 2, dLa * s / 2, c.p, 0.12);
    elipse(xc, yP + lVi * s / 2 - 0.2 * s, dVi * s / 2, lVi * s / 2, c.r, 0.12);
    // plano mitral con el orificio (diámetro del círculo equivalente al EROA) y las valvas
    const w = med.eroa > 0 ? 2 * Math.sqrt(med.eroa / Math.PI) : 0, a = Math.min(dVi, 4.2) * s / 2;
    ctx.save(); ctx.strokeStyle = c.text; ctx.lineWidth = 2 * k; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(xc - a, yP); ctx.lineTo(xc - w * s / 2, yP); ctx.moveTo(xc + w * s / 2, yP); ctx.lineTo(xc + a, yP); ctx.stroke();
    if (st.flail) { ctx.strokeStyle = c.r; ctx.beginPath(); ctx.moveTo(xc + w * s / 2, yP); ctx.quadraticCurveTo(xc + 0.3 * s, yP - 0.9 * s, xc - 0.2 * s, yP - 1.1 * s); ctx.stroke(); }
    ctx.restore();
    // hemisferio hacia el VI (radio r a Va 32 cm/s)
    if (med.eroa > 0) { ctx.save(); ctx.beginPath(); ctx.arc(xc, yP, Math.max(1.5 * k, med.r * s), 0, Math.PI); ctx.closePath(); ctx.globalAlpha = 0.35; ctx.fillStyle = c.y; ctx.fill(); ctx.restore(); }
    texto(ctx, 'AI', xc - dLa * s / 2 + 6 * k, yP - dLa * s * 0.62, c.p, k, { tam: 10, peso: 'bold' });
    texto(ctx, 'VI', xc - dVi * s / 2 + 6 * k, yP + lVi * s * 0.7, c.r, k, { tam: 10, peso: 'bold' });
    texto(ctx, `DTDVI ${coma(med.dtd, 0)} mm`, W - 5 * k, H - 6 * k, c.muted, k, { tam: 8.5, alinear: 'right' });
    texto(ctx, 'esquema · ilustrativo', 5 * k, 12 * k, c.muted, k, { tam: 8.5 });
  }

  // ----- zoom de la PISA: hemisferio de radio r frente a los límites de 0,3 y 1,0 cm; el chorro (dibujo)
  function dibujarZoom(med) {
    LZ.ajustar(); const c = colores(el), { ctx, W, H, k } = LZ; ctx.clearRect(0, 0, W, H);
    const s = W * 0.3, xc = W / 2, yP = H * 0.4, w = med.eroa > 0 ? 2 * Math.sqrt(med.eroa / Math.PI) : 0;
    texto(ctx, `PISA · Va ${VA} cm/s`, 5 * k, 12 * k, c.text, k, { tam: 9, peso: 'bold' });
    // límites: 0,3 cm (convergencia pequeña de la IM leve) y 1,0 cm (IM grave)
    const arco = (r, color, dash) => { ctx.save(); ctx.setLineDash(dash ? [4 * k, 3 * k] : []); ctx.strokeStyle = color; ctx.lineWidth = 1.2 * k; ctx.beginPath(); ctx.arc(xc, yP, r * s, 0, Math.PI); ctx.stroke(); ctx.restore(); };
    arco(1.0, c.r, true); arco(0.3, c.g, true);
    texto(ctx, '1,0 cm', xc + 1.0 * s + 3 * k, yP + 11 * k, c.r, k, { tam: 8.5, alinear: 'left' });
    texto(ctx, '0,3', xc + 0.3 * s + 3 * k, yP + 11 * k, c.g, k, { tam: 8.5 });
    if (med.eroa > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(xc, yP, med.r * s, 0, Math.PI); ctx.closePath(); ctx.globalAlpha = 0.35; ctx.fillStyle = c.y; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = c.y; ctx.lineWidth = 2 * k; ctx.stroke(); ctx.restore();
      // chorro hacia la AI (dibujo: su anchura sigue el orificio; el área del chorro no la da el motor)
      ctx.save(); ctx.beginPath(); ctx.moveTo(xc - w * s / 2, yP); ctx.lineTo(xc - w * s * 0.9, yP - H * 0.3); ctx.lineTo(xc + w * s * 0.9, yP - H * 0.3); ctx.lineTo(xc + w * s / 2, yP); ctx.closePath();
      ctx.globalAlpha = 0.3; ctx.fillStyle = c.r; ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = c.y; ctx.lineWidth = 1.4 * k; ctx.beginPath(); ctx.moveTo(xc, yP); ctx.lineTo(xc, yP + med.r * s); ctx.stroke(); ctx.restore();
      texto(ctx, `r ${coma(med.r, 2)} cm`, xc + 4 * k, yP + med.r * s * 0.5 + 3 * k, c.y, k, { tam: 9, peso: 'bold', halo: c.bg });
    }
    // plano mitral con el orificio (círculo equivalente al EROA)
    ctx.save(); ctx.strokeStyle = c.text; ctx.lineWidth = 2.2 * k; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(4 * k, yP); ctx.lineTo(xc - w * s / 2, yP); ctx.moveTo(xc + w * s / 2, yP); ctx.lineTo(W - 4 * k, yP); ctx.stroke();
    if (st.flail) { ctx.strokeStyle = c.r; ctx.beginPath(); ctx.moveTo(xc + w * s / 2, yP); ctx.quadraticCurveTo(xc + 0.7 * s, yP - 0.5 * s, xc + 0.3 * s, yP - 0.9 * s); ctx.stroke(); }
    ctx.restore();
    texto(ctx, 'AI', 5 * k, yP - 6 * k, c.p, k, { tam: 9, peso: 'bold' }); texto(ctx, 'VI', 5 * k, yP + 14 * k, c.r, k, { tam: 9, peso: 'bold' });
    texto(ctx, st.flail ? 'valva flácida' : 'dibujo ilustrativo', W - 5 * k, H - 6 * k, st.flail ? c.r : c.muted, k, { tam: 8.5, alinear: 'right' });
    if (med.eroa === 0) texto(ctx, 'sin orificio', xc, yP + 40 * k, c.muted, k, { tam: 10, alinear: 'center' });
  }

  // ----- presiones del VI y de la AI y CW del chorro, con el cursor del latido
  function dibujarTiempo(med, m) {
    LT.ajustar(); const c = colores(el), { ctx, W, H, k } = LT; ctx.clearRect(0, 0, W, H);
    const o = m.onda, T = med.periodo, x0 = 34 * k, x1 = W - 8 * k, xT = (t) => x0 + clamp(t / T, 0, 1) * (x1 - x0);
    const pMax = Math.max(40, Math.ceil(Math.max(...o.map(x => x.pvi)) * 1.15 / 40) * 40), mid = H * 0.5;
    // panel 1: presiones
    const yA = 16 * k, yB = mid - 12 * k, yP = (p) => yB - p / pMax * (yB - yA);
    ctx.strokeStyle = c.line; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.moveTo(x0, yA); ctx.lineTo(x0, yB); ctx.lineTo(x1, yB); ctx.stroke();
    // cursor del latido (la línea va debajo de todo; los rótulos llevan halo y la tapan)
    const tc = (st.t % 1) * T, xc = xT(tc), cur = o.reduce((a, x) => (Math.abs(x.t - tc) < Math.abs(a.t - tc) ? x : a), o[0]);
    ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1 * k; ctx.setLineDash([3 * k, 3 * k]); ctx.beginPath(); ctx.moveTo(xc, yA); ctx.lineTo(xc, H - 6 * k); ctx.stroke(); ctx.restore();
    texto(ctx, 'Presión del VI y de la AI (mmHg)', x0 + 4 * k, 11 * k, c.text, k, { tam: 10, peso: 'bold', halo: c.bg });
    for (let p = 0; p <= pMax; p += pMax / 2) texto(ctx, String(p), x0 - 4 * k, yP(p) + 3 * k, c.muted, k, { tam: 8, alinear: 'right' });
    if (med.eroa > 0) {                                  // la diferencia de presión VI-AI es la que mueve el chorro
      const ini = o.filter(x => x.pvi > x.pai && x.qMitReg > 0);
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = c.y; ctx.beginPath();
      if (ini.length) { ctx.moveTo(xT(ini[0].t), yP(ini[0].pai)); for (const x of ini) ctx.lineTo(xT(x.t), yP(x.pvi)); for (let i = ini.length - 1; i >= 0; i--) ctx.lineTo(xT(ini[i].t), yP(ini[i].pai)); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    const traza = (clave, color) => { ctx.strokeStyle = color; ctx.lineWidth = 1.8 * k; ctx.beginPath(); o.forEach((x, i) => (i ? ctx.lineTo(xT(x.t), yP(x[clave])) : ctx.moveTo(xT(x.t), yP(x[clave])))); ctx.stroke(); };
    traza('pvi', c.r); traza('pai', c.p);
    const pk = o.reduce((a, x) => (x.pvi > a.pvi ? x : a), o[0]);
    texto(ctx, 'VI', xT(pk.t), Math.max(yP(pk.pvi) - 5 * k, 26 * k), c.r, k, { tam: 9, peso: 'bold', alinear: 'center', halo: c.bg });
    texto(ctx, 'AI', x0 + 6 * k, yP(o[0].pai) - 6 * k, c.p, k, { tam: 9, peso: 'bold', halo: c.bg });
    if (med.eroa > 0) {
      texto(ctx, `onda v ${coma(med.ondaV, 0)}`, clamp(xT(med.tOndaV), x0 + 40 * k, x1 - 10 * k), yP(med.ondaV) - 11 * k, c.p, k, { tam: 9, peso: 'bold', alinear: 'center', halo: c.bg });
      const mp = o.reduce((a, x) => (Math.abs(x.t - med.chorro.tPico) < Math.abs(a.t - med.chorro.tPico) ? x : a), o[0]);
      texto(ctx, `ΔP máx. ${coma(med.dpMax, 0)}`, xT(mp.t), yP((mp.pvi + mp.pai) / 2) + 3 * k, c.text, k, { tam: 9, peso: 'bold', alinear: 'center', halo: c.bg });
    }
    // panel 2: Doppler continuo (el chorro se aleja de la sonda apical: hacia abajo)
    const yC0 = mid + 34 * k, yC1 = H - 6 * k, vTop = 6, yV = (v) => yC0 + v / vTop * (yC1 - yC0);
    texto(ctx, 'Doppler continuo del chorro de IM (m/s)', x0 + 4 * k, mid + 11 * k, c.text, k, { tam: 10, peso: 'bold', halo: c.bg });
    ctx.strokeStyle = c.line; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.moveTo(x0, yC0); ctx.lineTo(x1, yC0); ctx.moveTo(x0, yC0); ctx.lineTo(x0, yC1); ctx.stroke();
    for (const v of [0, 2, 4, 6]) texto(ctx, v ? `−${v}` : '0', x0 - 4 * k, yV(v) + 3 * k, c.muted, k, { tam: 8, alinear: 'right' });
    if (med.eroa > 0) {
      const j = med.chorro, dens = clamp(med.vReg / 60, 0.15, 1);                         // densidad: regla del original (ilustrativa)
      ctx.save(); ctx.globalAlpha = 0.15 + 0.5 * dens; ctx.fillStyle = c.g; ctx.beginPath(); ctx.moveTo(xT(j.curva[0].t), yC0);
      for (const p of j.curva) ctx.lineTo(xT(p.t), yV(Math.min(vTop, p.v))); ctx.lineTo(xT(j.curva[j.curva.length - 1].t), yC0); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = c.g; ctx.lineWidth = 1.5 * k; ctx.beginPath(); j.curva.forEach((p, i) => (i ? ctx.lineTo(xT(p.t), yV(Math.min(vTop, p.v))) : ctx.moveTo(xT(p.t), yV(Math.min(vTop, p.v))))); ctx.stroke();
      texto(ctx, `pico ${coma(j.vmax, 1)} m/s · VTI ${coma(j.vti, 0)} cm`, x0 + 4 * k, mid + 24 * k, c.g, k, { tam: 9, peso: 'bold', halo: c.bg });
    } else texto(ctx, 'sin regurgitación', (x0 + x1) / 2, yV(2), c.muted, k, { tam: 10, alinear: 'center' });
    // puntos del cursor sobre las dos presiones
    for (const [cl, col] of [['pvi', c.r], ['pai', c.p]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(xc, yP(cur[cl]), 3 * k, 0, 2 * Math.PI); ctx.fill(); }
  }

  function filas(med, res) {
    const x = res.x, G = (g) => (res.q ? ` · grado ${ROMANO[g]}` : '');
    const av = (cond) => !!cond;
    return [
      { k: 'EROA (el orificio, mando)', v: coma(med.eroa, 2), u: `cm²${res.ge ? ` · grado ${ROMANO[res.ge]}` : ''} · grave ≥0,40`, fuente: 'mando del motor · cortes: ficha (Zoghbi 2017)', aviso: av(x.eroa >= 0.4) },
      { k: 'Volumen regurgitante', v: coma(med.vReg, 0), u: `mL${res.gv ? G(res.gv) : ''} · grave ≥60`, fuente: 'motor (ultimo.vReg) · cortes: ficha', aviso: av(x.vReg >= 60) },
      { k: 'Fracción regurgitante', v: coma(med.fr, 0), u: `%${res.gf ? G(res.gf) : ''} · grave ≥50`, fuente: 'motor (ultimo.fr) · cortes: ficha', aviso: av(x.fr >= 50) },
      { k: 'Grado cuantitativo', v: res.q ? ROMANO[res.q] : '—', u: 'el intermedio de los tres', fuente: 'regla del sitio del original (Zoghbi no da ninguna)', aviso: res.q === 4 },
      { k: 'Velocidad pico del chorro', v: coma(med.vmax, 2), u: `m/s · ΔP ${coma(med.dpMax, 0)} mmHg`, fuente: 'motor (4v² = ΔP VI-AI) · el capítulo usa 5,0' },
      { k: 'VTI del chorro', v: coma(med.vti, 0), u: `cm · VReg = EROA × VTI = ${coma(med.eroa * med.vti, 0)} mL`, fuente: 'motor · el capítulo usa 150 (holosistólico)' },
      { k: 'Flujo en la PISA', v: coma(med.flujo, 0), u: 'mL/s = EROA × velocidad × 100', fuente: 'fórmula del capítulo (ficha)' },
      { k: `Radio PISA a ${VA} cm/s`, v: coma(med.r, 2), u: 'cm = √(flujo ÷ 2π·Va) · ≥1,0 grave', fuente: 'fórmula del capítulo (ficha) · Va del ejemplo', aviso: av(x.r >= 1.0) },
      { k: 'VTD / VTS · FEVI', v: `${coma(med.vtd, 0)} / ${coma(med.vts, 0)} · ${coma(med.fevi, 0)}`, u: 'mL · %', fuente: 'motor (FE total: la fracción que sale por las dos vías)', aviso: av(res.grave && x.fevi <= 60) },
      { k: 'DTDVI · DTSVI', v: `${coma(med.dtd, 0)} · ${coma(med.dts, 0)}`, u: 'mm · C2 si DTSVI ≥40', fuente: 'geometría de la app (eje largo paraesternal)', aviso: av(res.grave && x.dts >= 40) },
      { k: 'Índice de volumen de la AI', v: coma(med.ivai, 0), u: 'mL/m² · normal ≤34 (Lang 2015, varones)', fuente: 'motor (volumen máximo de la AI ÷ 1,85 m²)', aviso: av(x.ivai > 34) },
      { k: 'PAS · PTDVI', v: `${coma(med.pas, 0)} · ${coma(med.ptd, 0)}`, u: 'mmHg', fuente: 'motor (con su barorreflejo)' },
      { k: 'Estadio ACC/AHA', v: res.estadio ?? '—', u: res.grave ? (res.lvd ? 'FEVI ≤60% o DTSVI ≥40 mm' : 'sin síntomas · FEVI >60% y DTSVI <40 mm') : 'solo en la IM grave', fuente: 'umbrales: ficha (Otto 2020)', aviso: res.estadio === 'C2' },
    ];
  }

  function pintarCriterios(res) {
    const cr = res.cr, est = (ok) => (ok === null ? '<span class="at-gris">el motor no lo da</span>' : ok ? '<b class="at-mal">sí</b>' : '<span class="at-bien">no</span>');
    const lista = (l) => `<ul>${l.map(c => `<li>${c.t}${c.sitio ? ' <i>(cifra del sitio)</i>' : ''}: ${est(c.ok)}</li>`).join('')}</ul>`;
    crit.innerHTML = `<h4>Criterios específicos (algoritmo de la ASE)</h4>
      <div class="at-paso on"><b>De IM leve</b> · ${cr.nLeves} de los ${cr.calculables} que se pueden calcular (son 6) ${lista(cr.leves)}</div>
      <div class="at-paso on"><b>De IM grave</b> · ${cr.nGraves} de los ${cr.calculables} que se pueden calcular (son 6) ${lista(cr.graves)}</div>
      <div class="at-paso on"><b>Resultado</b> · ${res.texto} <span class="at-gris">(${res.razon}${res.grave && res.estadio ? ` · estadio ${res.estadio}` : ''})</span></div>`;
  }

  function textoVivo(med, res) {
    if (med.eroa === 0) return '<b>No hay insuficiencia mitral.</b> Sube el orificio o pulsa «Recorrer la progresión»: el motor abre un orificio regurgitante entre el VI y la AI y recalcula el latido.';
    let t = `<b>${res.texto}.</b> El EROA es ${coma(med.eroa, 2)} cm², el volumen regurgitante ${coma(med.vReg, 0)} mL y la fracción regurgitante ${coma(med.fr, 0)}%: ${res.razon}. `;
    t += `El chorro sale a ${coma(med.vmax, 1)} m/s (ΔP VI-AI ${coma(med.dpMax, 0)} mmHg); con ese pico y Va ${VA} cm/s, la PISA da un radio de ${coma(med.r, 2)} cm. `;
    t += `La AI recibe el volumen regurgitante en sístole: su índice de volumen es ${coma(med.ivai, 0)} mL/m² y la onda v llega a ${coma(med.ondaV, 0)} mmHg. `;
    if (res.grave) t += res.lvd ? `<span class="at-mal">FEVI ${coma(med.fevi, 0)}% y DTSVI ${coma(med.dts, 0)} mm: cumple al menos un criterio del estadio C2 (FEVI ≤60% o DTSVI ≥40 mm).</span> ` : `FEVI ${coma(med.fevi, 0)}% y DTSVI ${coma(med.dts, 0)} mm: estadio C1 en ausencia de síntomas. `;
    if (med.eroa >= 0.4) { const f0 = motorEn(0).med.fevi;              // solo si la FEVI ya está por debajo de la que tiene sin IM
      if (med.fevi < f0) t += `La FEVI ha bajado de ${coma(f0, 0)}% (sin IM) a ${coma(med.fevi, 0)}%: con el orificio grande, el modelo hace caer la contractilidad del VI (ilustrativo), y la disfunción sistólica aparece tarde. `; }
    return t;
  }

  function pintar() {
    if (!actual) return;
    const { med, m } = actual, res = resultado(med, st.flail);
    dibujarEsquema(med); dibujarZoom(med); dibujarTiempo(med, m);
    lect.pintar(filas(med, res)); pintarCriterios(res); vivo.pintar(textoVivo(med, res));
  }

  pedir();
  let acum = 0;
  const anim = animar(LT.c, (dt) => {
    if (st.jugar) { acum += dt; if (acum > 0.7) { acum = 0; st.eroa = Math.min(EROA_MAX, Math.round((st.eroa + PASO) / PASO) * PASO); desl.set(st.eroa); pedir(); if (st.eroa >= EROA_MAX - 1e-6) { st.jugar = false; anima.el.checked = false; } } }
    if (actual && !reducirMovimiento()) { st.t += dt * 0.5 / actual.med.periodo; pintar(); }
  });
  const ro = new ResizeObserver(() => pintar()); ro.observe(LT.c);
  return { parar() { anim.parar(); ro.disconnect(); if (st.pendiente) cancelAnimationFrame(st.pendiente); } };
}
