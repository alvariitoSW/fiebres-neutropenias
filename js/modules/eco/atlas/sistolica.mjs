// Atlas · 09 Función sistólica: volúmenes y FEVI por el método biplano de discos (Simpson modificado), medidos sobre el
// corazón de la app. Reconstruido sobre nuestra geometría y nuestro motor (idea de The Heart by Ultrasound, cap. 09,
// sin su código): allí el VI es un dibujo cuyo volumen se elige con un deslizador y el acortamiento resta la misma
// fracción a los dos volúmenes; aquí el VI es el de la geometría de la app movido por el motor del latido, los planos
// son las vistas apicales del simulador (ecografia.mjs, planoVista) y el acortamiento es un plano que entra por la base
// pero no pasa por el ápex verdadero: el contorno, L y los discos salen del corte, y el error, de la geometría.
//   · Cavidad del VI en un punto: dentro del perfil endocárdico de baseGeometrica, con la base que baja hacia el ápex
//     igual que en el corazón 3D (corazon-geo: descenso = Le − Le telediastólica).
//   · Volumen real: el del motor en ese instante (la geometría se construye para tener exactamente ese volumen).
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { baseGeometrica, geomVi } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { planoVista } from '../ecografia.mjs';
import { lienzo, colores, texto, deslizador, segmentos, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export const CORAZONES_SIS = ['normal', 'fallo', 'dilatada', 'hipertrofia'];
export const N_DISCOS = 20;

/** Motor asentado con un corazón del simulador (sin escenario o con uno de escenarios.mjs). */
export function motorSistolico(clave = 'normal') {
  const m = crearMotor(); m.correr(10);
  const e = ESCENARIOS[clave]; e.aplicar(m);
  m.correr(e.forma ? ASENTAR_FORMA : 12);
  return m;
}

/**
 * El plano apical de una vista ('a4c' | 'a2c') con el ápex acortado x mm: el transductor se aparta x mm del ápex
 * (perpendicular al plano) y el haz sigue apuntando al mismo punto de la base, así que el corte entra por la base pero
 * pasa por fuera del ápex verdadero. x = 0 es la vista estándar.
 */
export function planoApical(clave, estTd, x = 0) {
  const P = planoVista(clave, estTd);
  if (!x) return P;
  const dBase = -P.O[2] / Math.max(0.3, P.d[2]);      // profundidad del plano AV a lo largo del haz
  const T = sum(P.O, esc(P.d, dBase)), O = sum(P.O, esc(P.n, x)), d = nrm(res(T, O));
  const r = nrm(res(P.r, esc(d, dot(P.r, d))));
  return { ...P, O, d, r, n: nrm(cruz(r, d)) };
}

/** ¿Está el punto p (mm, en el espacio del corazón telediastólico) dentro de la cavidad del VI en el estado s? */
function dentroVi(g, descenso) {
  return (p) => {
    const z = p[2] - descenso;
    if (z >= 0 || z <= -g.vi.L) return false;
    return Math.hypot(p[0], p[1]) < g.rEndoVi(z, Math.atan2(p[1], p[0]));
  };
}
function dentroEpi(g, descenso) {
  return (p) => {
    const z = p[2] - descenso;
    if (z >= 0 || z <= -g.vi.Le) return false;
    return Math.hypot(p[0], p[1]) < g.rEpiVi(z, Math.atan2(p[1], p[0]));
  };
}

/** La geometría de una muestra del motor y su descenso de la base (igual que construirCorazon). */
export function geomMuestra(s, extra) {
  const est = estadoGeo(s, extra), g = baseGeometrica(est);
  const leTd = extra.vviTd ? geomVi(extra.vviTd, g.mio).Le : g.vi.Le;
  return { g, est, descenso: clamp(g.vi.Le - leTd, -18, 6) };
}

/**
 * Trazado del VI en el plano P y discos de Simpson. Devuelve en coordenadas del plano (u a la derecha, v en
 * profundidad, mm): la línea del anillo (b1, b2), su punto medio M, el ápex del trazado, L (mm), el eje y los 20
 * diámetros, el contorno (para dibujarlo) y el volumen de un solo plano (mL).
 */
export function trazarVi(P, gm, n = N_DISCOS) {
  const dentro = dentroVi(gm.g, gm.descenso);
  const en3d = (u, v) => sum(P.O, sum(esc(P.r, u), esc(P.d, v)));
  const dentroUV = (u, v) => dentro(en3d(u, v));
  // el anillo: la intersección del plano con el plano AV (z = descenso), justo por debajo, dentro de la cavidad
  const zB = gm.descenso - 0.6;
  // puntos (u, v) con z = zB: z = O.z + u r.z + v d.z → v = (zB − O.z − u r.z) / d.z
  const vEn = (u) => (zB - P.O[2] - u * P.r[2]) / P.d[2];
  let b1 = null, b2 = null;
  for (let u = -60; u <= 60; u += 0.25) { if (dentroUV(u, vEn(u))) { if (!b1) b1 = [u, vEn(u)]; b2 = [u, vEn(u)]; } }
  if (!b1) return null;
  const M = [(b1[0] + b2[0]) / 2, (b1[1] + b2[1]) / 2];
  // ápex del trazado: el punto de la cavidad más lejano de M (rejilla de 1 mm hacia el transductor)
  let ap = M, dmax = 0;
  for (let v = 0; v < M[1]; v += 1) for (let u = -60; u <= 60; u += 1) {
    if (!dentroUV(u, v)) continue; const d = Math.hypot(u - M[0], v - M[1]); if (d > dmax) { dmax = d; ap = [u, v]; }
  }
  // afina el ápex a lo largo de su dirección
  const ax0 = [(ap[0] - M[0]) / (dmax || 1), (ap[1] - M[1]) / (dmax || 1)];
  let lo = dmax, hi = dmax + 2; for (let i = 0; i < 20; i++) { const mid = (lo + hi) / 2; dentroUV(M[0] + ax0[0] * mid, M[1] + ax0[1] * mid) ? lo = mid : hi = mid; }
  const L = lo, ax = ax0, pe = [-ax[1], ax[0]];
  // borde a cada lado a lo largo de la perpendicular, desde el eje
  const borde = (c, sg) => { let lo = 0, hi = 40; if (!dentroUV(c[0], c[1])) return 0;
    while (dentroUV(c[0] + pe[0] * sg * hi, c[1] + pe[1] * sg * hi) && hi < 120) hi += 20;
    for (let i = 0; i < 22; i++) { const mid = (lo + hi) / 2; dentroUV(c[0] + pe[0] * sg * mid, c[1] + pe[1] * sg * mid) ? lo = mid : hi = mid; }
    return lo; };
  const discos = [];
  for (let i = 0; i < n; i++) {
    const s = (i + 0.5) / n * L, c = [M[0] + ax[0] * s, M[1] + ax[1] * s], a = borde(c, 1), b = borde(c, -1);
    discos.push({ c, a, b, d: a + b });
  }
  // contorno fino (60 niveles) para dibujar
  const izq = [], der = [];
  for (let i = 0; i <= 60; i++) { const s = Math.min(L - 0.05, i / 60 * L), c = [M[0] + ax[0] * s, M[1] + ax[1] * s];
    const a = borde(c, 1), b = borde(c, -1); izq.push([c[0] + pe[0] * a, c[1] + pe[1] * a]); der.push([c[0] - pe[0] * b, c[1] - pe[1] * b]); }
  const contorno = [b1, ...izq.slice(1), [M[0] + ax[0] * L, M[1] + ax[1] * L], ...der.slice(1).reverse(), b2];
  // longitud del borde endocárdico (sin la línea del anillo): para el strain longitudinal
  let perimetro = 0; for (let i = 1; i < contorno.length; i++) perimetro += Math.hypot(contorno[i][0] - contorno[i - 1][0], contorno[i][1] - contorno[i - 1][1]);
  const vol1 = Math.PI / 4 * discos.reduce((acc, x) => acc + x.d * x.d, 0) * L / n / 1000;
  return { b1, b2, M, apex: [M[0] + ax[0] * L, M[1] + ax[1] * L], L, ax, pe, discos, contorno, perimetro, vol1 };
}

/** Volumen biplano (mL): π/4 Σ aᵢ bᵢ · L/n, con L la mayor de las dos vistas. */
export function volumenBiplano(t4, t2) {
  const L = Math.max(t4.L, t2.L), n = t4.discos.length;
  let s = 0; for (let i = 0; i < n; i++) s += t4.discos[i].d * t2.discos[i].d;
  return Math.PI / 4 * s * L / n / 1000;
}

/** Telediástole y telesístole del último latido: volumen real (motor) y biplano (geometría) con el ápex acortado x mm. */
export function medirSistolica(m, x = 0) {
  const o = m.onda, extra = extraDeMotor(m);
  const td = o.reduce((a, s) => (s.vvi > a.vvi ? s : a)), ts = o.reduce((a, s) => (s.vvi < a.vvi ? s : a));
  const estTd = estadoGeo(td, extra), P4 = planoApical('a4c', estTd, x), P2 = planoApical('a2c', estTd, x);
  const fr = (s) => { const gm = geomMuestra(s, extra); const t4 = trazarVi(P4, gm), t2 = trazarVi(P2, gm);
    return { real: s.vvi, t4, t2, biplano: volumenBiplano(t4, t2) }; };
  const D = fr(td), S = fr(ts), sc = m.p.sc;
  return { D, S, P4, P2, td, ts, sc,
    feReal: (D.real - S.real) / D.real, feBiplano: (D.biplano - S.biplano) / D.biplano,
    edvi: D.biplano / sc, esvi: S.biplano / sc,
    gls: (S.t4.perimetro - D.t4.perimetro) / D.t4.perimetro * 100 };
}

/** Banda de la FEVI (Lang 2015) y categoría de IC (Heidenreich 2022). */
export function bandaFe(fe, sexo = 'varon') {
  const p = fe * 100, lim = sexo === 'mujer' ? [54, 74] : [52, 72];
  const banda = p >= lim[0] && p <= lim[1] ? 'normal' : p > lim[1] ? 'por encima de lo normal' : p >= 41 ? 'levemente reducida' : p >= 30 ? 'moderadamente reducida' : 'gravemente reducida';
  const ic = p <= 40 ? 'IC con FE reducida (≤40%)' : p < 50 ? 'IC con FE levemente reducida (41-49%)' : 'IC con FE preservada (≥50%)';
  return { banda, ic, lim };
}

// ---------------------------------------------------------------------------------------------------- figura
const NOMBRE = { normal: 'Normal', fallo: 'Fallo del VI', dilatada: 'Dilatada', hipertrofia: 'Hipertrofia' };

export function montar(el) {
  const st = { corazon: 'normal', x: 0, cuadro: 'cine', sexo: 'varon', t: 0, ver: 'td' };
  const cache = {};
  const motor = (k) => cache[k] ?? (cache[k] = motorSistolico(k));
  let med = null, m = null, imgs = null;

  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  segmentos(mandos, { etiqueta: 'Corazón', opciones: CORAZONES_SIS.map(k => [k, NOMBRE[k]]), valor: st.corazon, onChange: (v) => { st.corazon = v; recalcular(); } });
  deslizador(mandos, { etiqueta: 'Acortamiento del ápex', min: 0, max: 24, paso: 1, valor: 0, fmt: (v) => `${v} mm`,
    onInput: (v) => { st.x = v; recalcular(); } });
  segmentos(mandos, { etiqueta: 'Cuadro', opciones: [['cine', 'Cine'], ['td', 'Telediástole'], ['ts', 'Telesístole']], valor: st.cuadro, onChange: (v) => { st.cuadro = v; pintar(); } });
  segmentos(mandos, { etiqueta: 'Sexo (límites de la FEVI)', opciones: [['varon', 'Varón'], ['mujer', 'Mujer']], valor: st.sexo, onChange: (v) => { st.sexo = v; pintar(); } });

  const fila = document.createElement('div'); fila.className = 'at-par'; el.appendChild(fila);
  const L4 = lienzo(fila, 1.15, 'Apical 4 cámaras del corazón de la app con el trazado del VI, la línea L y los 20 discos');
  const L2 = lienzo(fila, 1.15, 'Apical 2 cámaras del corazón de la app con el trazado del VI, la línea L y los 20 discos');
  const lect = lecturas(el), vivo = enVivo(el);

  // imagen de la vista: rejilla de 1 mm en el plano; miocardio del VI (entre endo y epi), cavidad, y el resto oscuro
  function imagenVista(P, gm, W, H, esc, u0, v0) {
    const dE = dentroVi(gm.g, gm.descenso), dP = dentroEpi(gm.g, gm.descenso), img = new ImageData(W, H), pix = img.data;
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const u = u0 + i / esc, v = v0 + j / esc, k = 4 * (j * W + i);
      const ang = Math.atan2(u, v); if (v < 0 || Math.abs(ang) > P.mitad || Math.hypot(u, v) > P.prof) { pix[k + 3] = 0; continue; }
      const p = sum(P.O, sum(esc3(P.r, u), esc3(P.d, v)));
      const h = ((i * 73856093) ^ (j * 19349663)) >>> 0, ruido = (h % 1000) / 1000;
      let g = 14 + ruido * 10;
      if (dP(p) && !dE(p)) g = 120 + ruido * 90; else if (dE(p)) g = 4 + ruido * 6;
      pix[k] = pix[k + 1] = pix[k + 2] = g; pix[k + 3] = 255;
    }
    return img;
  }
  const esc3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

  // cada cuadro (24 por latido en cine, más el TD y el TS) se calcula una vez: imagen y trazados
  const cuadros = new Map(), N_CINE = 24;
  function recalcular() { m = motor(st.corazon); med = medirSistolica(m, st.x); cuadros.clear(); pintar(); }

  function cuadro(s, clave, W4, H4) {
    const k = `${clave}|${W4}x${H4}`; let q = cuadros.get(k);
    if (!q) {
      const gm = geomMuestra(s, extraDeMotor(m));
      const t4 = s === med.td ? med.D.t4 : s === med.ts ? med.S.t4 : trazarVi(med.P4, gm);
      const t2 = s === med.td ? med.D.t2 : s === med.ts ? med.S.t2 : trazarVi(med.P2, gm);
      q = { gm, t4, t2, i4: imagenLienzo(med.P4, gm, W4, H4, med.D.t4.M[0]), i2: imagenLienzo(med.P2, gm, W4, H4, med.D.t2.M[0]) };
      cuadros.set(k, q);
    }
    return q;
  }

  // encuadre: de 10 a 125 mm de profundidad (el VI entero), centrado en el punto medio del anillo de cada vista
  const V0 = 10, PROF = 115;
  const encuadre = (W, H, k, uc) => { const top = 18 * k, escala = (H - top - 4 * k) / PROF; return { top, escala, u0: uc - W / 2 / escala }; };
  function imagenLienzo(P, gm, W, H, uc) {
    const k = W / 300, { top, escala, u0 } = encuadre(W, H, k, uc);
    const iw = Math.max(60, Math.round(W / 3)), ih = Math.max(60, Math.round((H - top) / 3));
    const img = imagenVista(P, gm, iw, ih, iw / (W / escala), u0, V0);
    const c = document.createElement('canvas'); c.width = iw; c.height = ih; c.getContext('2d').putImageData(img, 0, 0);
    return c;
  }

  function dibujar(L, P, tr, imagen, titulo, uc) {
    L.ajustar(); const c = colores(el), { ctx, W, H, k } = L;
    ctx.clearRect(0, 0, W, H);
    const { top, escala, u0 } = encuadre(W, H, W / 300, uc);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(imagen, 0, top, W, H - top);
    const X = (u) => (u - u0) * escala, Y = (v) => top + (v - V0) * escala;
    texto(ctx, titulo, 6 * k, 13 * k, c.text, k, { tam: 10, peso: 'bold' });
    if (!tr) return;
    ctx.strokeStyle = c.b; ctx.lineWidth = 1 * k; ctx.globalAlpha = 0.85;
    for (const d of tr.discos) { ctx.beginPath(); ctx.moveTo(X(d.c[0] + tr.pe[0] * d.a), Y(d.c[1] + tr.pe[1] * d.a)); ctx.lineTo(X(d.c[0] - tr.pe[0] * d.b), Y(d.c[1] - tr.pe[1] * d.b)); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c.y; ctx.lineWidth = 1.8 * k; ctx.beginPath();
    tr.contorno.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = c.r; ctx.setLineDash([4 * k, 3 * k]); ctx.beginPath(); ctx.moveTo(X(tr.M[0]), Y(tr.M[1])); ctx.lineTo(X(tr.apex[0]), Y(tr.apex[1])); ctx.stroke(); ctx.setLineDash([]);
    texto(ctx, `L ${coma(tr.L / 10, 1)} cm`, X(tr.apex[0]) + 6 * k, Y(tr.apex[1]) + 12 * k, c.r, k, { tam: 9, halo: c.bg });
  }

  function pintar() {
    if (!med) return;
    L4.ajustar(); L2.ajustar();
    const o = m.onda;
    let s, clave;
    if (st.cuadro === 'td') { s = med.td; clave = 'td'; }
    else if (st.cuadro === 'ts') { s = med.ts; clave = 'ts'; }
    else { const i = Math.floor((st.t % 1) * N_CINE), idx = Math.min(o.length - 1, Math.round(i / N_CINE * o.length)); s = o[idx]; clave = 'c' + i; }
    const q = cuadro(s, clave, L4.W, L4.H);
    dibujar(L4, med.P4, q.t4, q.i4, 'Apical 4 cámaras', med.D.t4.M[0]);
    dibujar(L2, med.P2, q.t2, q.i2, 'Apical 2 cámaras', med.D.t2.M[0]);
    const fe = med.feBiplano, b = bandaFe(fe, st.sexo), lims = st.sexo === 'mujer' ? { d: [29, 61], s: [8, 24] } : { d: [34, 74], s: [11, 31] };
    lect.pintar([
      { k: 'VTD · VTS biplano', v: `${coma(med.D.biplano, 0)} · ${coma(med.S.biplano, 0)}`, u: 'mL', fuente: 'discos sobre la geometría' },
      { k: 'VTD · VTS reales', v: `${coma(med.D.real, 0)} · ${coma(med.S.real, 0)}`, u: 'mL', fuente: 'motor' },
      { k: 'FEVI biplano', v: coma(fe * 100, 0), u: `% · ${b.banda}`, aviso: b.banda !== 'normal', fuente: `Lang 2015 (${st.sexo === 'mujer' ? 'mujer 54-74' : 'varón 52-72'})` },
      { k: 'FEVI real', v: coma(med.feReal * 100, 0), u: '%', fuente: 'motor' },
      { k: 'VTD indexado', v: coma(med.edvi, 0), u: `mL/m² · normal ${lims.d.join('-')}`, aviso: med.edvi < lims.d[0] || med.edvi > lims.d[1], fuente: 'Lang 2015' },
      { k: 'VTS indexado', v: coma(med.esvi, 0), u: `mL/m² · normal ${lims.s.join('-')}`, aviso: med.esvi < lims.s[0] || med.esvi > lims.s[1], fuente: 'Lang 2015' },
      { k: 'L telediastólica (4C · 2C)', v: `${coma(med.D.t4.L / 10, 1)} · ${coma(med.D.t2.L / 10, 1)}`, u: 'cm', fuente: 'se usa la mayor' },
      { k: 'Categoría de IC por FEVI', v: b.ic, u: '', fuente: 'Heidenreich 2022' },
      { k: 'Acortamiento del borde (4C)', v: coma(med.gls, 1).replace('-', '−'), u: '% · strain normal < −18', aviso: med.gls > -18, fuente: 'aproximación geométrica al strain; ilustrativo' },
    ]);
    const err = (a, r) => (a - r) / r * 100;
    vivo.pintar(`<b>${NOMBRE[st.corazon]}${st.x ? `, ápex acortado ${st.x} mm` : ''}.</b> ${st.x
      ? `El plano entra por la base pero pasa ${st.x} mm por fuera del ápex: L baja a ${coma(med.D.t4.L / 10, 1)} cm, el ápex del trazado se redondea y el biplano infraestima el VTD un ${coma(-err(med.D.biplano, med.D.real), 0)}% y el VTS un ${coma(-err(med.S.biplano, med.S.real), 0)}%; la FEVI pasa de ${coma(med.feReal * 100, 0)}% a ${coma(fe * 100, 0)}%.`
      : `Con los dos planos por el eje del VI, el biplano da ${coma(med.D.biplano, 0)} mL frente a ${coma(med.D.real, 0)} mL reales en telediástole (${coma(err(med.D.biplano, med.D.real), 0)}%).`} ${b.ic}.`);
  }

  recalcular();
  // el latido a la mitad de su velocidad real (st.t en latidos)
  const anim = reducirMovimiento() ? null : animar(L4.c, (dt) => { if (st.cuadro !== 'cine' || !m) return; st.t += dt * 0.5 / m.ultimo.periodo; pintar(); });
  const ro = new ResizeObserver(() => pintar()); ro.observe(L4.c);
  return { parar() { anim?.parar(); ro.disconnect(); } };
}
