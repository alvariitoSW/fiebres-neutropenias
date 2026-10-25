// Copia de trabajo del renderizador de la ecografía (propuesta, no es parte de la app).
//
// Parte de crearEcografo() de js/modules/eco/ecografia.mjs y le añade, cada una con su intensidad (0 = como hoy):
//   moteado   · los dispersores se interpolan entre los nudos de su retícula: el moteado se desliza con la pared en
//               vez de «hervir» cuando el tejido se mueve menos de una celda; la sangre deriva despacio en vez de
//               parpadear; el tejido es más heterogéneo
//   sombra    · cada haz pierde energía al cruzar lo muy ecogénico (pericardio, valvas, hueso, costilla) y menos en
//               la sangre que en el tejido: sombra detrás de lo brillante, refuerzo detrás del líquido
//   reverb    · neblina de campo cercano más densa y bandas de reverberación de la pared torácica a 2×, 3× y 4× su
//               profundidad, fijas en la pantalla (no se mueven con el corazón)
//   especular · el borde brilla más cuando el haz lo corta de frente y se apaga cuando le pasa paralelo; el músculo
//               paralelo al haz se ve más gris (anisotropía)
//   tgc       · ganancia por profundidad con 4 mandos (en dB)
//   foco      · el haz es más estrecho en el foco y se ensancha por delante, por detrás y hacia los bordes del sector
//   ventana   · ventana pobre: pared más gruesa con grasa, más pérdida, más ruido y más neblina; con más intensidad,
//               el borde del pulmón tapa un lado del sector y entra y sale con la respiración
//
// Reutiliza del módulo real (import, sin copiar): el corte del corazón con el plano, el ajuste del movimiento y el
// campo de desplazamiento. Lo que cambia es la formación de la imagen. Valores ilustrativos (física general de los
// ultrasonidos); idea de «The Heart by Ultrasound» (D. Ouyang), reconstruida, sin su código.
import { elementosDelCorte, ajusteAfin, campoDesplazamiento, desplazar, DB } from '../../../js/modules/eco/ecografia.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const amp = (db) => Math.pow(10, db / 20);
const PARED = 12;                                   // la misma pared torácica que ecografia.mjs (mm)
const SIG_AX = 0.3, DB_LO = -34, DB_HI = 30;        // los mismos que ecografia.mjs
const SIG_LAT0 = (r) => Math.max(0.45, 0.0085 * r);

// dispersores: ruido gaussiano complejo con la misma semilla que la app (apagado todo, la misma imagen)
const NG = 1 << 16, GR = new Float32Array(NG), GI = new Float32Array(NG);
{ let a = 0x9e3779b9 >>> 0; const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < NG; i++) { const m = Math.sqrt(-2 * Math.log(rnd() + 1e-12)) / Math.SQRT2, f = 2 * Math.PI * rnd(); GR[i] = m * Math.cos(f); GI[i] = m * Math.sin(f); } }
const hash = (i, j) => { let h = Math.imul(i, 0x27d4eb2d) ^ Math.imul(j, 0x165667b1); h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h ^= h >>> 13; return h & (NG - 1); };
// variación lenta del tejido (retícula de 5 mm), con su intensidad: tabla por exponente
let VLk = -1, VL = new Float32Array(NG);
function tablaLenta(k) { if (k === VLk) return; VLk = k; for (let i = 0; i < NG; i++) VL[i] = Math.pow(10, (GR[i] * 1.6 * k) / 20); }
function lento(x, y) {
  const fx = x / 5, fy = y / 5, ix = Math.floor(fx), iy = Math.floor(fy); let tx = fx - ix, ty = fy - iy;
  tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
  const a = VL[hash(ix, iy)], b = VL[hash(ix + 1, iy)], c = VL[hash(ix, iy + 1)], d = VL[hash(ix + 1, iy + 1)];
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}
// pulso axial: pesos de una campana por recurrencia (cada peso sale del anterior: w(i+1) = w(i)·q^(2i+1), con
// q = e^(−1/2σ²)), simétricos, hasta 2,5 σ (como mucho «tope» muestras a cada lado), y que suman 1
function pulsoAxial(sig, tope) {
  const media = clamp(Math.ceil(2.5 * sig), 1, tope), q = Math.exp(-0.5 / (sig * sig)), mitad = [1];
  for (let i = 0; i < media; i++) mitad.push(mitad[i] * Math.pow(q, 2 * i + 1));
  const total = mitad.reduce((a, w, i) => a + (i ? 2 * w : w), 0), pesos = new Float32Array(2 * media + 1);
  mitad.forEach((w, i) => { pesos[media + i] = pesos[media - i] = w / total; });
  return pesos;
}
// potencia del ruido tras dos cajas de semiancho h (para devolverla a 1)
const S2 = Array.from({ length: 16 }, (_, h) => { const w = 2 * h + 1; let s = 0; for (let t = -2 * h; t <= 2 * h; t++) { const c = (w - Math.abs(t)) / (w * w); s += c * c; } return s; });

export const MEJORAS_CERO = Object.freeze({ paredes: 0, moteado: 0, sombra: 0, reverb: 0, especular: 0, tgc: 0, foco: 0, ventana: 0 });

/**
 * El ecógrafo «después». formar(partes, P, o) como el de la app, más o.m (intensidades 0..1 de cada mejora),
 * o.tgc (4 dB, de arriba abajo), o.focoMm (profundidad del foco) y o.ventanaVista ('apical', 'paraesternal'…).
 */
export function crearEcografoV2({ ancho = 360, alto = 300, nb = 192, ns = 448 } = {}) {
  let G = null;
  const geometria = (P, o) => {
    const m = o.m, clave = [P.prof, P.mitad.toFixed(4), ancho, alto, m.reverb, m.foco, o.focoMm, m.ventana, m.sombra > 0, o.ventanaVista, m.moteado].join('|');
    if (G && G.clave === clave) return G;
    const N = nb * ns, dth = 2 * P.mitad / nb, dr = P.prof / ns;
    const X = new Float32Array(N), Y = new Float32Array(N), Rr = new Float32Array(ns), EB = new Float32Array(nb);
    for (let j = 0; j < ns; j++) { const rr = (j + 0.5) * dr; Rr[j] = rr; for (let i = 0; i < nb; i++) { const th = -P.mitad + (i + 0.5) * dth; X[j * nb + i] = rr * Math.sin(th); Y[j * nb + i] = rr * Math.cos(th); } }
    for (let i = 0; i < nb; i++) EB[i] = (-P.mitad + (i + 0.5) * dth) / P.mitad;
    const kAx = pulsoAxial(SIG_AX / dr, 6); let s2a = 0; for (const w of kAx) s2a += w * w;
    // desenfoque lateral por muestra: sin la mejora, el de hoy (solo la profundidad); con ella, foco y bordes
    const HB = new Uint8Array(N), NORM = new Float32Array(N), I = m.foco, f = o.focoMm ?? 80;
    for (let j = 0; j < ns; j++) {
      const rr = Math.max(4, Rr[j]), s0 = SIG_LAT0(rr), sF = Math.max(0.45, 0.55 + 0.012 * Math.abs(rr - f) + 0.004 * rr);
      for (let i = 0; i < nb; i++) {
        const e = EB[i], M = m.moteado;
        // con el grano real, el haz nunca baja de ~1 mm de ancho: el grano sale alargado de lado y corto en profundidad
        const sig = Math.max(0.45 + 0.6 * M, ((1 - I) * s0 + I * sF) * (1 + 0.25 * M)) * (1 + 0.9 * I * e * e);
        const sg = sig / (rr * dth), h = Math.max(0, Math.min(15, Math.round((Math.sqrt(1 + 6 * sg * sg) - 1) / 2)));
        HB[j * nb + i] = h; NORM[j * nb + i] = 1 / (S2[h] * s2a);
      }
    }
    // pared torácica: con ventana pobre, más gruesa (la grasa crece) y con más pérdida
    const W = m.ventana, pared = PARED + 8 * W, grasa = 0.35 + 0.25 * W;
    const PT = new Float32Array(N).fill(-1), ABS = new Uint8Array(N);
    for (let q = 0; q < N; q++) { const y = Y[q]; if (y >= pared) continue; const x = X[q], fr = y / pared + 0.04 * Math.sin(x * 0.9);
      PT[q] = amp(y < 1 ? 4 : fr < grasa ? -13 - 3 * W : fr < 0.85 ? -4 + 3 * Math.sin(y * 3.1 + x * 0.3) : 7); }
    // costilla (con la sombra, fuera de la subcostal): un arco brillante en el borde izquierdo del sector
    if (m.sombra > 0 && o.ventanaVista !== 'subcostal') for (let j = 0; j < ns; j++) for (let i = 0; i < nb; i++) {
      const q = j * nb + i, r = Rr[j], e = EB[i];
      if (e < -0.74 && r > pared - 6 && r < pared - 1) { PT[q] = amp(12); ABS[q] = 1; }
    }
    // neblina y reverberación: fijas en la pantalla (el ruido de su moteado no se mueve con el corazón)
    const R = m.reverb, CL = new Float32Array(N), kW = 1 + 1.5 * W;
    for (let j = 0; j < ns; j++) for (let i = 0; i < nb; i++) {
      const q = j * nb + i, y = Y[q], r = Rr[j]; let c = 0;
      if (y >= pared && y < 50 + 40 * R) c = amp(-18 + 6 * R - (0.55 - 0.3 * R) * (y - pared));
      // en el apical el ápex cae en el campo cercano: más niebla en los primeros 3-4 cm
      if (R > 0 && o.ventanaVista === 'apical' && y >= pared && y < pared + 40) c += R * amp(-15 - 0.35 * (y - pared));
      if (R > 0) for (let k = 2; k <= 4; k++) { const d = r - k * pared; if (Math.abs(d) < 4) c += R * amp(-2 - 5 * k) * Math.exp(-(d * d) / 2.2); }
      CL[q] = c * kW;
    }
    // ganancia que no depende del tejido: la de hoy (caída con la profundidad y en los bordes)
    const GAN = new Float32Array(N);
    for (let j = 0; j < ns; j++) for (let i = 0; i < nb; i++) { const e = EB[i]; GAN[j * nb + i] = -0.025 * Math.max(0, Rr[j] - 60) - 6 * Math.pow(e, 8); }
    const k = Math.min((alto - 8) / P.prof, (ancho - 6) / (2 * P.prof * Math.sin(P.mitad))), cx = ancho / 2, top = 4;
    const PIX = [], FB = [], FS = [];
    for (let py = 0; py < alto; py++) for (let px = 0; px < ancho; px++) {
      const x = (px + 0.5 - cx) / k, y = (py + 0.5 - top) / k; if (y <= 0) continue;
      const rr = Math.hypot(x, y), th = Math.atan2(x, y); if (rr >= P.prof || Math.abs(th) >= P.mitad) continue;
      PIX.push(py * ancho + px); FB.push(clamp((th + P.mitad) / dth - 0.5, 0, nb - 1.001)); FS.push(clamp(rr / dr - 0.5, 0, ns - 1.001));
    }
    G = { clave, N, dth, dr, X, Y, Rr, EB, PT, ABS, CL, kAx, HB, NORM, GAN, pared, k, cx, top,
      PIX: Int32Array.from(PIX), FB: Float32Array.from(FB), FS: Float32Array.from(FS),
      A: new Float32Array(N), TAG: new Uint8Array(N), DEN: new Uint8Array(N), FILL: new Uint8Array(N), OR: new Float32Array(N), OD: new Float32Array(N),
      I: new Float32Array(N), Q: new Float32Array(N), T: new Float32Array(N), E: new Float32Array(N), PS: new Float64Array(nb + 1),
      pix: new Uint8ClampedArray(ancho * alto * 4), filas: Array.from({ length: ns }, () => []) };
    return G;
  };
  const LUT = new Uint8Array(1024 * 3);
  for (let i = 0; i < 1024; i++) { const v = Math.pow(i / 1023, 1.35); LUT[3 * i] = 6 + v * 244; LUT[3 * i + 1] = 6 + v * 240; LUT[3 * i + 2] = 8 + v * 230; }

  const aRejilla = (P, u, v) => [(Math.atan2(u, Math.max(v, 1e-3)) + P.mitad) / G.dth - 0.5, Math.hypot(u, v) / G.dr - 0.5];
  function rellenar(P, seg, fn) {
    const filas = G.filas; for (const f of filas) f.length = 0;
    for (let i = 0; i < seg.length; i += 4) {
      const L = Math.hypot(seg[i + 2] - seg[i], seg[i + 3] - seg[i + 1]), m = Math.max(1, Math.ceil(L / 1));
      let [pb, ps] = aRejilla(P, seg[i], seg[i + 1]);
      for (let q = 1; q <= m; q++) {
        const f = q / m, [b, s] = aRejilla(P, seg[i] + (seg[i + 2] - seg[i]) * f, seg[i + 1] + (seg[i + 3] - seg[i + 1]) * f);
        const lo = Math.min(ps, s), hi = Math.max(ps, s);
        for (let j = Math.max(0, Math.ceil(lo)); j <= Math.min(ns - 1, Math.ceil(hi) - 1); j++) if (j >= lo && j < hi) filas[j].push(pb + (b - pb) * (j - ps) / (s - ps));
        pb = b; ps = s;
      }
    }
    for (let j = 0; j < ns; j++) { const f = filas[j]; if (f.length < 2) continue; f.sort((a, b) => a - b);
      for (let q = 0; q + 1 < f.length; q += 2) { const i0 = Math.max(0, Math.ceil(f[q])), i1 = Math.min(nb - 1, Math.floor(f[q + 1])); for (let i = i0; i <= i1; i++) fn(j * nb + i); } }
  }
  /**
   * Línea gruesa. espec: brillo extra de frente (dB); S: intensidad de la mejora especular (0 = la fórmula de hoy,
   * cos⁴). Con S > 0, apunta además en una franja de 5 mm la orientación del borde (para la anisotropía del músculo).
   */
  function trazar(P, seg, ancho, dbBase, espec, tag, S, realce = 1) {
    const { A, TAG, X, Y, OR, OD, FILL, dth, dr } = G, h = ancho / 2, banda = espec && S > 0 ? 6 : 0, hh = Math.max(h + 0.35, banda);
    for (let i = 0; i < seg.length; i += 4) {
      const ax = seg[i], ay = seg[i + 1], bx = seg[i + 2], by = seg[i + 3];
      let db = dbBase, c = 1;
      if (espec) {
        const tx = bx - ax, ty = by - ay, tl = Math.hypot(tx, ty) || 1, mx = (ax + bx) / 2, my = (ay + by) / 2, ml = Math.hypot(mx, my) || 1;
        c = Math.abs((-ty * mx + tx * my) / (tl * ml));
        const p = 4 + 4 * S;
        db += (espec + 4 * S * realce) * Math.pow(c, p) - 6 * S * (1 - c) * (1 - c);
      }
      const a = amp(db);
      const ra = Math.hypot(ax, ay), rb = Math.hypot(bx, by), ta = Math.atan2(ax, ay), tb = Math.atan2(bx, by);
      const rmin = Math.max(1, Math.min(ra, rb) - hh), mth = Math.asin(Math.min(1, hh / rmin)) + dth;
      const i0 = Math.max(0, Math.floor((Math.min(ta, tb) - mth + P.mitad) / dth)), i1 = Math.min(nb - 1, Math.ceil((Math.max(ta, tb) + mth + P.mitad) / dth));
      const j0 = Math.max(0, Math.floor((Math.min(ra, rb) - hh) / dr - 1)), j1 = Math.min(ns - 1, Math.ceil((Math.max(ra, rb) + hh) / dr));
      const ux = bx - ax, uy = by - ay, l2 = ux * ux + uy * uy || 1e-9;
      for (let j = j0; j <= j1; j++) for (let ii = i0; ii <= i1; ii++) {
        const q = j * nb + ii;
        const px = X[q] - ax, py = Y[q] - ay;
        const t = clamp((px * ux + py * uy) / l2, 0, 1), dx = px - t * ux, dy = py - t * uy, dd = Math.sqrt(dx * dx + dy * dy);
        if (banda && dd < banda && dd < OD[q]) { OD[q] = dd; OR[q] = c; }
        if (dd >= h + 0.35) continue;
        const cc = clamp((h - dd) / 0.35 + 0.5, 0, 1);
        if (espec) { if (cc * a > A[q]) A[q] = cc * a; if (cc >= 0.5) FILL[q] = 0; }
        else { A[q] += cc * (a - A[q]); if (cc >= 0.5) { TAG[q] = tag; FILL[q] = 0; } }
      }
    }
  }
  // desenfoque lateral con semiancho propio en cada muestra: dos cajas por fila con sumas acumuladas
  function desenfocar(F) {
    const T = G.T, HB = G.HB, PS = G.PS;
    for (let j = 0; j < ns; j++) {
      const o = j * nb;
      for (let pasada = 0; pasada < 2; pasada++) {
        const src = pasada ? T : F, dst = pasada ? F : T;
        PS[0] = 0; for (let i = 0; i < nb; i++) PS[i + 1] = PS[i] + src[o + i];
        for (let i = 0; i < nb; i++) { const h = HB[o + i], a = Math.max(0, i - h), b = Math.min(nb, i + h + 1); dst[o + i] = (PS[b] - PS[a]) / (b - a); }
      }
    }
  }

  function formar(partes, P, o = {}) {
    const m = { ...MEJORAS_CERO, ...(o.m || {}) };
    geometria(P, { ...o, m });
    const { N, A, TAG, DEN, FILL, OR, OD, X, Y, Rr, EB } = G, reloj = [performance.now()];
    const els = elementosDelCorte(partes, P, o.ref || null); reloj.push(performance.now());
    DEN.fill(0); rellenar(P, els[0].seg, (q) => { DEN[q] = 1; });
    const aS = amp(DB.sangre), aE = amp(DB.extracardiaco), PT = G.PT;
    for (let q = 0; q < N; q++) {
      if (PT[q] >= 0) { A[q] = PT[q]; TAG[q] = 0; }
      else if (DEN[q]) { A[q] = aS; TAG[q] = 255; } else { A[q] = aE; TAG[q] = 0; }
    }
    FILL.fill(0); OD.fill(1e9); OR.fill(1);
    const mov = [null], etiqueta = new Map(), campo = [null];
    const tagDe = (el) => { if (!etiqueta.has(el.grupo)) { etiqueta.set(el.grupo, mov.length); mov.push(ajusteAfin(el.seg, el.segRef)); campo.push(campoDesplazamiento(el.seg, el.segRef)); } return etiqueta.get(el.grupo); };
    for (const el of els.slice(1)) {
      if (el.tipo === 'relleno' && el.sangre) { const a = amp(el.db); rellenar(P, el.seg, (q) => { A[q] = a; TAG[q] = 255; }); continue; }
      const tag = Math.min(254, tagDe(el));
      if (el.tipo === 'relleno') { const mus = el.db <= 1, a = amp(el.db - (mus ? 7 * m.paredes : 0));   // paredes reales: músculo gris medio
        rellenar(P, el.seg, (q) => { A[q] = a; TAG[q] = tag; FILL[q] = mus ? 1 : 0; }); }
      else {
        // con la mejora especular, también el pericardio depende del ángulo
        const espec = el.especular || (m.especular > 0 && el.grupo === 'Pericardio' ? 3 : 0);
        // paredes reales: el borde de la pared ya no es una línea brillante; queda una interfase fina, algo más clara
        // que el músculo solo donde el haz llega de frente (el pericardio y las válvulas siguen siendo líneas)
        const W2 = m.paredes, borde = !!el.especular && W2 > 0;
        if (borde) trazar(P, el.seg, el.ancho * (1 - 0.45 * W2), el.db - 3 * W2, espec - 3 * W2, tag, m.especular, 1 - W2);
        else trazar(P, el.seg, el.ancho, el.db, espec, tag, m.especular);
      }
    }
    // anisotropía: el músculo paralelo al haz devuelve menos eco
    if (m.especular > 0) { const k = -(22 - 8 * m.paredes) * m.especular; for (let q = 0; q < N; q++) if (FILL[q] && OD[q] < 6) { const c = 1 - OR[q]; A[q] *= Math.pow(10, k * c * Math.sqrt(c) / 20); } }
    // ventana pobre: el borde del pulmón tapa el lado derecho del sector (entra y sale con la respiración, ciclo de 5 s)
    const W = m.ventana;
    let pulmon = null;
    if (W > 0.25 && o.ventanaVista !== 'subcostal') {
      const resp = 0.5 - 0.5 * Math.cos(2 * Math.PI * ((o.t || 0) % 5) / 5), borde = 1 - (W - 0.25) * 0.6 * (0.5 + 0.5 * resp), rl = G.pared + 4;
      pulmon = { borde, rl };
      for (let i = 0; i < nb; i++) { if (EB[i] < borde) continue;
        for (let j = 0; j < ns; j++) { const r = Rr[j]; if (r < rl) continue; const q = j * nb + i, k = Math.round(r / rl), d = r - k * rl;
          A[q] = Math.abs(d) < 1.2 ? amp(10 - 7 * (k - 1)) : amp(-38); TAG[q] = 0; } }
    }
    reloj.push(performance.now());
    // sombra y refuerzo: cada haz, de la sonda hacia abajo, pierde lo que no atraviesa
    const S = m.sombra;
    if (S > 0 || W > 0) {
      const dr = G.dr, ABS = G.ABS, a6 = amp(6), fT = amp(-W * 0.5 * dr), fB = amp(S * 0.24 * dr), fH = amp(-S * 7.5 * dr), kb = -S * 1.2 * dr / 6, tope = amp(12);
      for (let i = 0; i < nb; i++) { let at = 1;
        for (let j = 0, q = i; j < ns; j++, q += nb) {
          const a = A[q]; A[q] = a * at;
          if (Rr[j] < G.pared) at *= fT;
          if (S > 0) {
            if (ABS[q]) at *= fH;
            else if (a > a6) at *= Math.pow(a / a6, kb);      // lo muy ecogénico refleja y deja pasar menos
            else if (TAG[q] === 255 && at < tope) at *= fB;   // la sangre atenúa menos que el tejido (refuerzo)
          }
        }
      }
    }
    reloj.push(performance.now());
    // dispersores
    const { I, Q, CL } = G, t = o.t || 0, fr = Math.floor(t / 0.02), M = m.moteado;
    tablaLenta(1 + 1.5 * M);
    const ruido = amp(-40 + 8 * W);
    if (M > 0) {
      // retícula de 0,3 mm con interpolación bilineal: el patrón se desliza con el tejido
      const RT = 1 / 0.3, du = t * 9, dv = t * 5;
      for (let q = 0; q < N; q++) {
        const tg = TAG[q]; let mu = X[q], mv = Y[q];
        if (tg === 255) { mu += du; mv += dv; }
        else if (tg) { const F = campo[tg], d = F ? desplazar(F, mu, mv) : null;
          if (d) { mu = d[0]; mv = d[1]; }
          else { const mm = mov[tg]; if (mm) { const x = mu - mm[0], y = mv - mm[1]; mu = mm[2] + mm[4] * x + mm[5] * y; mv = mm[3] + mm[6] * x + mm[7] * y; } } }
        const gx = mu * RT, gy = mv * RT, ix = Math.floor(gx), iy = Math.floor(gy), tx = gx - ix, ty = gy - iy;
        const h00 = hash(ix, iy), h10 = hash(ix + 1, iy), h01 = hash(ix, iy + 1), h11 = hash(ix + 1, iy + 1);
        const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty, wn = 1 / Math.sqrt(w00 * w00 + w10 * w10 + w01 * w01 + w11 * w11);
        const sr = (GR[h00] * w00 + GR[h10] * w10 + GR[h01] * w01 + GR[h11] * w11) * wn, si = (GI[h00] * w00 + GI[h10] * w10 + GI[h01] * w01 + GI[h11] * w11) * wn;
        const hn = hash(q, fr + 17), hc = hash(q, 3);
        const a = tg && tg !== 255 ? A[q] * lento(mu, mv) : A[q], c = CL[q];
        I[q] = a * sr + ruido * GR[hn] + c * GR[hc]; Q[q] = a * si + ruido * GI[hn] + c * GI[hc];
      }
    } else {
      // el de hoy: una celda de 0,15 mm por muestra; la sangre salta a otro patrón cada 20 ms
      const RET = 1 / 0.15, offU = (Math.imul(fr, 7919) & 1023) * 0.37, offV = (Math.imul(fr, 104729) & 1023) * 0.53;
      for (let q = 0; q < N; q++) {
        const tg = TAG[q]; let mu = X[q], mv = Y[q];
        if (tg === 255) { mu += offU; mv += offV; }
        else if (tg) { const F = campo[tg], d = F ? desplazar(F, mu, mv) : null;
          if (d) { mu = d[0]; mv = d[1]; }
          else { const mm = mov[tg]; if (mm) { const x = mu - mm[0], y = mv - mm[1]; mu = mm[2] + mm[4] * x + mm[5] * y; mv = mm[3] + mm[6] * x + mm[7] * y; } } }
        const h = hash(Math.floor(mu * RET), Math.floor(mv * RET)), hn = hash(q, fr + 17), hc = hash(q, 3);
        const a = tg && tg !== 255 ? A[q] * lento(mu, mv) : A[q], c = CL[q];
        I[q] = a * GR[h] + ruido * GR[hn] + c * GR[hc]; Q[q] = a * GI[h] + ruido * GI[hn] + c * GI[hc];
      }
    }
    reloj.push(performance.now());
    desenfocar(I); desenfocar(Q); reloj.push(performance.now());
    // ganancia por profundidad: 4 mandos repartidos de arriba abajo, interpolados
    const TG = new Float32Array(ns);
    if (m.tgc > 0 && o.tgc) for (let j = 0; j < ns; j++) { const f = j / (ns - 1) * 3, k = Math.min(2, Math.floor(f)), u = f - k; TG[j] = o.tgc[k] + (o.tgc[k + 1] - o.tgc[k]) * u; }
    const { E, T, NORM, GAN } = G, kAx = G.kAx, ra = (kAx.length - 1) >> 1;
    for (let j = 0; j < ns; j++) {
      const oo = j * nb; E.fill(0, oo, oo + nb); T.fill(0, oo, oo + nb);
      for (let p = -ra; p <= ra; p++) { const w = kAx[p + ra], o2 = clamp(j + p, 0, ns - 1) * nb; for (let i = 0; i < nb; i++) { E[oo + i] += w * I[o2 + i]; T[oo + i] += w * Q[o2 + i]; } }
      const tg = TG[j];
      for (let i = 0; i < nb; i++) { const a = E[oo + i], b = T[oo + i]; E[oo + i] = 4.342944819 * Math.log((a * a + b * b) * NORM[oo + i] + 1e-12) + GAN[oo + i] + tg; }
    }
    reloj.push(performance.now());
    const { PIX, FB, FS, pix } = G, lo = DB_LO - (o.ganancia || 0), esc = 1023 / (DB_HI - DB_LO);
    pix.fill(0);
    for (let mm = 0; mm < PIX.length; mm++) {
      const fb = FB[mm], fs = FS[mm], b = fb | 0, s = fs | 0, tb = fb - b, ts = fs - s, q = s * nb + b;
      const e0 = E[q] + (E[q + 1] - E[q]) * tb, e1 = E[q + nb] + (E[q + nb + 1] - E[q + nb]) * tb;
      const kk = clamp(((e0 + (e1 - e0) * ts - lo) * esc) | 0, 0, 1023) * 3, o4 = 4 * PIX[mm];
      pix[o4] = LUT[kk]; pix[o4 + 1] = LUT[kk + 1]; pix[o4 + 2] = LUT[kk + 2]; pix[o4 + 3] = 255;
    }
    reloj.push(performance.now());
    const tiempos = { corte: reloj[1] - reloj[0], raster: reloj[2] - reloj[1], sombra: reloj[3] - reloj[2], moteado: reloj[4] - reloj[3], haz: reloj[5] - reloj[4], envolvente: reloj[6] - reloj[5], pantalla: reloj[7] - reloj[6], total: reloj[7] - reloj[0] };
    return { tiempos, pix, ancho, alto, escala: G.k, cx: G.cx, arriba: G.top, tag: TAG, db: E, nb, ns, dth: G.dth, dr: G.dr, mitad: P.mitad, prof: P.prof,
      pared: G.pared, pulmon, apagado: (q) => FILL[q] && OD[q] < 6 && OR[q] < 0.35 };
  }
  return { formar, nb, ns };
}
