// Dibujo isométrico: pieza propia (pieza común de la app).
// Sigue el MÉTODO «Anatomy» (github.com/wheresryan22/anatomy, MIT): el objeto real es la explicación, sólidos (no
// alambres) con cuatro tonos por orientación, orden del pintor de atrás adelante, líneas que acaban en algo, una sola
// pieza iluminada y movimiento tranquilo basado en el tiempo. El CÓDIGO es propio (decisión del usuario, 21/10/2026: «kit
// de Anatomy, no; pieza propia»): ni una línea copiada de su kit.
//
// Lo que hay:
//   · camara()/ajustar(): proyección paralela (azimut y elevación) y encaje en un viewBox.
//   · caja(), prisma(): sólidos extruidos del suelo, con caras sombreadas por orientación y tapa más clara.
//   · torno(): cuerpos de revolución sobre CUALQUIER eje (cánulas, motores, bombas, balones), con sombreado suave
//     (un degradado por banda, perpendicular al eje en pantalla) y silueta analítica (sin facetas en el contorno).
//   · tubo(): tubos y cables por una ruta 3D, con cuerpo, sombra y brillo que siguen la curva.
//   · anillo(), arco(): costuras y bandas sobre un cuerpo, solo la mitad visible (acaban en la silueta).
//   · Lienzo: junta las piezas en una cadena SVG con sus degradados (ids propios por escena).
//   · seguir(), muelle(), bucle(): movimiento basado en el tiempo; parado fuera de pantalla y con «reducir movimiento».
//   · El grabado rápido (láminas y aparatos pequeños: el corazón eléctrico, el receptor vivo, la bomba de jeringa):
//     isometrica() y oblicua(), dos proyecciones fijas con la MISMA forma que camara() (iso, dir, V, L, k); caja3(), la
//     caja de tres tonos que elige sola sus caras visibles; cilindroV(), cilindroH(), tuboPlano(), tornillo() y regla(),
//     piezas planas en la lámina; GRABADO_CSS y GRABADO_DEFS (tonos por clase y tramas) con instalarGrabado().
//   · instalarCss(): cada pieza pone su CSS una sola vez (así pasa a js/core sin tocar el CSS de la app).
// Colores: solo los tokens de css/variables.css (las mezclas de dos tokens, con color-mix).

// ---------------------------------------------------------------- vectores
export const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const pto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const largo = (a) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a) => { const l = largo(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const mezcla = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const f1 = (n) => Math.round(n * 10) / 10;
const D = (p) => `${f1(p[0])} ${f1(p[1])}`;
export const camino = (pts, cerrado = false) => pts.length ? 'M' + pts.map(D).join('L') + (cerrado ? 'Z' : '') : '';

// ---------------------------------------------------------------- cámara
// x e y en el suelo, z hacia arriba. az: giro del suelo (grados); el: elevación de la mirada (grados).
export function camara({ az = 45, el = 30, k = 1, o = [0, 0] } = {}) {
  const a = az * Math.PI / 180, e = el * Math.PI / 180;
  const ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
  // hacia el observador (más «profundidad» = más cerca)
  const V = [sa * ce, ca * ce, se];
  // luz: de arriba, algo a la izquierda y por delante (fija para todas las escenas)
  const L = unit([-0.55, 0.35, 0.9]);
  const P = {
    az, el, k, o, V, L,
    iso: (p) => [o[0] + k * (p[0] * ca - p[1] * sa), o[1] + k * ((p[0] * sa + p[1] * ca) * se - p[2] * ce)],
    prof: (p) => pto(p, V),
    // vector de pantalla de un vector 3D (sin el origen)
    dir: (d) => [k * (d[0] * ca - d[1] * sa), k * ((d[0] * sa + d[1] * ca) * se - d[2] * ce)],
  };
  return P;
}
export function ajustar(puntos, ancho, alto, { pad = 14, az = 45, el = 30 } = {}) {
  const P0 = camara({ az, el });
  const sp = puntos.map(P0.iso);
  const xs = sp.map((p) => p[0]), ys = sp.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((ancho - 2 * pad) / (x1 - x0 || 1), (alto - 2 * pad) / (y1 - y0 || 1));
  return camara({ az, el, k, o: [ancho / 2 - k * (x0 + x1) / 2, alto / 2 - k * (y0 + y1) / 2] });
}

// brillo (0-1) de una cara con normal n; tono (0-3) en cuatro escalones
export const brillo = (n, P) => Math.max(0, Math.min(1, 0.5 + 0.5 * pto(unit(n), P.L)));
export const tono = (n, P) => Math.max(0, Math.min(3, Math.floor(brillo(n, P) * 4)));

// Marco ortonormal con el eje a (u y v perpendiculares)
export function marco(o, a, cerca = [0, 0, 1]) {
  const ax = unit(a);
  let u = cruz(ax, cerca); if (largo(u) < 1e-3) u = cruz(ax, [1, 0, 0]);
  u = unit(u); const v = unit(cruz(ax, u));
  return { o, a: ax, u, v };
}
const enMarco = (M, s, r, th) => sum(M.o, sum(esc(M.a, s), sum(esc(M.u, r * Math.cos(th)), esc(M.v, r * Math.sin(th)))));

// ---------------------------------------------------------------- envolvente convexa (pantalla)
export function envolvente(pts) {
  const p = pts.map((q) => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const q of p) { while (lo.length >= 2 && x(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (hi.length >= 2 && x(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  return lo.slice(0, -1).concat(hi.slice(0, -1));
}

// ---------------------------------------------------------------- prismas (del suelo hacia arriba)
// anillo: puntos [x, y] del contorno en el suelo (antihorario visto desde arriba)
export function anilloRedondeado({ x, y, w, d, r = 0 }, pasos = 4) {
  r = Math.min(r, w / 2, d / 2);
  if (r <= 0) return [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];
  const c = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + d - r, 0], [x + r, y + d - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  const out = [];
  for (const [cx, cy, a0] of c) for (let i = 0; i <= pasos; i++) { const a = a0 + (i / pasos) * Math.PI / 2; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return out;
}
export function prisma(anillo, z0, h, P, { bisel = 0 } = {}) {
  const n = anillo.length, abajo = anillo.map(([x, y]) => [x, y, z0]), arriba = anillo.map(([x, y]) => [x, y, z0 + h]);
  // orientación del anillo (área con signo en el suelo)
  let area = 0; for (let i = 0; i < n; i++) { const a = anillo[i], b = anillo[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
  const sg = area >= 0 ? 1 : -1;
  const caras = [];
  for (let i = 0; i < n; i++) {
    const a = anillo[i], b = anillo[(i + 1) % n];
    const nrm = [sg * (b[1] - a[1]), -sg * (b[0] - a[0]), 0];
    if (pto(nrm, P.V) <= 1e-6) continue;
    caras.push({ d: camino([abajo[i], abajo[(i + 1) % n], arriba[(i + 1) % n], arriba[i]].map(P.iso), true), b: brillo(nrm, P), t: tono(nrm, P) });
  }
  const tapaVisible = P.V[2] > 0;
  const tapa = tapaVisible ? { d: camino(arriba.map(P.iso), true), b: Math.min(1, brillo([0, 0, 1], P) + 0.08) } : null;
  const contorno = camino(envolvente([...abajo, ...arriba].map(P.iso)), true);
  // pliegue: borde de la tapa que da a las caras visibles
  const vis = []; for (let i = 0; i < n; i++) { const a = anillo[i], b = anillo[(i + 1) % n]; const nrm = [sg * (b[1] - a[1]), -sg * (b[0] - a[0]), 0]; vis.push(pto(nrm, P.V) > 1e-6); }
  let pliegue = '';
  for (let i = 0; i < n; i++) if (vis[i]) pliegue += `M${D(P.iso(arriba[i]))}L${D(P.iso(arriba[(i + 1) % n]))}`;
  let biselD = '';
  if (bisel > 0 && tapaVisible) {
    const cx = anillo.reduce((s, p) => s + p[0], 0) / n, cy = anillo.reduce((s, p) => s + p[1], 0) / n;
    const dentro = anillo.map(([x, y]) => { const dx = cx - x, dy = cy - y, l = Math.hypot(dx, dy) || 1; return [x + dx / l * bisel, y + dy / l * bisel, z0 + h]; });
    for (let i = 0; i < n; i++) if (vis[i]) biselD += `M${D(P.iso(dentro[i]))}L${D(P.iso(dentro[(i + 1) % n]))}`;
  }
  return { relleno: contorno, caras, tapa, pliegue, bisel: biselD, contorno, centro: [anillo.reduce((s, p) => s + p[0], 0) / n, anillo.reduce((s, p) => s + p[1], 0) / n, z0 + h / 2] };
}
export const caja = (plan, z0, h, P, { pasos = 3, bisel = 0 } = {}) => prisma(anilloRedondeado(plan, pasos), z0, h, P, { bisel });

// ---------------------------------------------------------------- cuerpos de revolución
// perfil: [[s, r], …] a lo largo del eje del marco M (s creciente). Devuelve la silueta analítica, una banda por tramo
// con su degradado (el sombreado suave) y las tapas de los extremos que miran al observador.
export function torno(perfil, M, P, { pasos = 64, tapas = [true, true] } = {}) {
  const A = pto(M.u, P.V), B = pto(M.v, P.V), aV = pto(M.a, P.V);
  const R = Math.hypot(A, B), base = Math.atan2(B, A);
  // ángulos de la silueta en un anillo con pendiente dr/ds
  const sil = (dr) => { const c = Math.max(-0.999, Math.min(0.999, R > 1e-6 ? dr * aV / R : 0)); const q = Math.acos(c); return [base + q, base - q]; };
  const izq = [], der = [], bandas = [];
  const pend = (i) => { const a = perfil[Math.max(0, i - 1)], b = perfil[Math.min(perfil.length - 1, i + 1)]; return (b[1] - a[1]) / ((b[0] - a[0]) || 1e-6); };
  for (let i = 0; i < perfil.length; i++) {
    const [s, r] = perfil[i]; const [t1, t2] = sil(pend(i));
    izq.push(P.iso(enMarco(M, s, r, t1))); der.push(P.iso(enMarco(M, s, r, t2)));
  }
  // degradado de cada banda: brillo de la normal en los ángulos de la mitad visible, proyectado al ancho en pantalla
  const ejeP = P.dir(M.a), ejeL = Math.hypot(ejeP[0], ejeP[1]) || 1, perp = [-ejeP[1] / ejeL, ejeP[0] / ejeL];
  for (let i = 0; i < perfil.length - 1; i++) {
    const [s0, r0] = perfil[i], [s1, r1] = perfil[i + 1];
    if (Math.abs(s1 - s0) < 1e-6) continue;
    const dr = (r1 - r0) / (s1 - s0), sm = (s0 + s1) / 2, rm = Math.max(0.01, (r0 + r1) / 2);
    const [t1, t2] = sil(dr);
    const cen = P.iso(enMarco(M, sm, 0, 0));
    const proy = (th) => { const q = P.iso(enMarco(M, sm, rm, th)); return (q[0] - cen[0]) * perp[0] + (q[1] - cen[1]) * perp[1]; };
    const pA = proy(t1), pB = proy(t2);
    const stops = [];
    const N = 9;
    // recorre la mitad que mira al observador (entre las dos siluetas, por el lado de «base»)
    let ta = t1, tb = t2; if (Math.cos(((ta + tb) / 2) - base) < 0) tb += 2 * Math.PI;
    for (let j = 0; j <= N; j++) {
      const th = ta + (tb - ta) * j / N;
      const nrm = unit(sum(sum(esc(M.u, Math.cos(th)), esc(M.v, Math.sin(th))), esc(M.a, -dr)));
      const off = (proy(th) - pA) / ((pB - pA) || 1);
      stops.push([Math.max(0, Math.min(1, off)), brillo(nrm, P)]);
    }
    stops.sort((a, b) => a[0] - b[0]);
    const g = { x1: cen[0] + perp[0] * pA, y1: cen[1] + perp[1] * pA, x2: cen[0] + perp[0] * pB, y2: cen[1] + perp[1] * pB, stops };
    bandas.push({ d: camino([izq[i], izq[i + 1], der[i + 1], der[i]], true), g, s0, s1 });
  }
  // tapas (elipses) en los extremos que miran al observador
  const tapasD = [];
  const elipse = (s, r) => { const pts = []; for (let j = 0; j < pasos; j++) pts.push(P.iso(enMarco(M, s, r, (j / pasos) * 2 * Math.PI))); return pts; };
  const [sA, rA] = perfil[0], [sZ, rZ] = perfil[perfil.length - 1];
  if (tapas[0] && rA > 0.05 && aV < 0) tapasD.push({ d: camino(elipse(sA, rA), true), b: brillo(esc(M.a, -1), P) });
  if (tapas[1] && rZ > 0.05 && aV > 0) tapasD.push({ d: camino(elipse(sZ, rZ), true), b: brillo(M.a, P) });
  // relleno: bandas + elipses de los extremos (para que nada de detrás asome)
  const relleno = bandas.map((b) => b.d).join('') + camino(elipse(sA, Math.max(rA, 0.01)), true) + camino(elipse(sZ, Math.max(rZ, 0.01)), true);
  // contorno: las dos siluetas; en cada extremo, la elipse entera si mira hacia aquí y, si no, solo su mitad de
  // delante (la de detrás la tapa el propio cuerpo: nada de bordes vistos a través)
  const arcoDelante = (s, r, dr) => { const [t1, t2] = sil(dr); let a = t1, b = t2; if (Math.cos((a + b) / 2 - base) < 0) b += 2 * Math.PI; const pts = []; for (let j = 0; j <= pasos / 2; j++) pts.push(P.iso(enMarco(M, s, r, a + (b - a) * j / (pasos / 2)))); return pts; };
  let contorno = camino(izq) + camino(der);
  contorno += aV < 0 ? camino(elipse(sA, rA), true) : camino(arcoDelante(sA, rA, pend(0)));
  contorno += aV > 0 ? camino(elipse(sZ, rZ), true) : camino(arcoDelante(sZ, rZ, pend(perfil.length - 1)));
  // pliegues: los escalones del perfil (donde r cambia de golpe en el mismo s), su mitad delantera
  let pliegues = '';
  for (let i = 1; i < perfil.length - 1; i++) {
    if (Math.abs(perfil[i][0] - perfil[i - 1][0]) < 1e-6) pliegues += arco(M, perfil[i][0], Math.max(perfil[i][1], perfil[i - 1][1]), P);
    else if (perfil[i][2] === 'pliegue') pliegues += arco(M, perfil[i][0], perfil[i][1], P);
  }
  return { relleno, bandas, tapas: tapasD, contorno, pliegues, izq, der, M, perfil, prof: P.prof(enMarco(M, (sA + sZ) / 2, 0, 0)) };
}
// La mitad visible de un anillo (costura, banda) en el cuerpo: acaba en la silueta
export function arco(M, s, r, P, pasos = 32) {
  const A = pto(M.u, P.V), B = pto(M.v, P.V), base = Math.atan2(B, A);
  const pts = []; for (let j = 0; j <= pasos; j++) pts.push(P.iso(enMarco(M, s, r, base - Math.PI / 2 + Math.PI * j / pasos)));
  return camino(pts);
}
export const elipse3 = (M, s, r, P, pasos = 40) => { const pts = []; for (let j = 0; j < pasos; j++) pts.push(P.iso(enMarco(M, s, r, 2 * Math.PI * j / pasos))); return camino(pts, true); };
export const puntoEn = (M, s, r, th) => enMarco(M, s, r, th);
// Matriz SVG que lleva un plano local (u hacia la derecha, v hacia abajo) a una cara: para pantallas y placas
export function caraMatriz(P, origen, ejeU, ejeV) {
  const o = P.iso(origen), a = P.dir(ejeU), b = P.dir(ejeV);
  return `matrix(${[a[0], a[1], b[0], b[1], o[0], o[1]].map((x) => +x.toFixed(4)).join(' ')})`;
}
// Líneas a lo largo del eje sobre la mitad visible (moleteado, varillas, ventanas): devuelve [{d, a}] con alfa que se
// desvanece hacia la silueta (una textura que acaba en un borde o se desvanece, nunca de golpe)
export function rayas(M, s0, s1, r, n, P, { fase = 0 } = {}) {
  const A = pto(M.u, P.V), B = pto(M.v, P.V), base = Math.atan2(B, A), out = [];
  for (let j = 0; j < n; j++) {
    const th = fase + (j / n) * 2 * Math.PI, c = Math.cos(th - base);
    if (c <= 0.05) continue;
    out.push({ d: camino([P.iso(enMarco(M, s0, r, th)), P.iso(enMarco(M, s1, r, th))]), a: Math.min(1, c * 1.6) });
  }
  return out;
}
// Hélice (álabe) sobre un cuerpo: desde s0 a s1 dando «vueltas»; solo los tramos de la mitad visible (con su alfa)
export function helice(M, s0, s1, r, vueltas, fase, P, pasos = 60) {
  const A = pto(M.u, P.V), B = pto(M.v, P.V), base = Math.atan2(B, A), out = [];
  let cur = [];
  for (let j = 0; j <= pasos; j++) {
    const t = j / pasos, th = fase + vueltas * 2 * Math.PI * t, s = s0 + (s1 - s0) * t;
    const vis = Math.cos(th - base) > 0;
    if (vis) cur.push(P.iso(enMarco(M, s, r, th))); else if (cur.length) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out.filter((c) => c.length > 1).map((c) => camino(c)).join('');
}

// Aspas de una hélice como cintas (de la raíz en el cubo a la punta): cuadriláteros pequeños repartidos entre los de
// detrás y los de delante del cubo, para pintarlos en su orden (detrás → cubo → delante)
export function aspas(M, s0, s1, rh, rt, vueltas, fase, n, P, pasos = 18) {
  const A = pto(M.u, P.V), B = pto(M.v, P.V), base = Math.atan2(B, A);
  let detras = '', delante = '';
  for (let j = 0; j < n; j++) {
    const f0 = fase + j * 2 * Math.PI / n;
    for (let k = 0; k < pasos; k++) {
      const t0 = k / pasos, t1 = (k + 1) / pasos;
      const a0 = f0 + vueltas * 2 * Math.PI * t0, a1 = f0 + vueltas * 2 * Math.PI * t1;
      const q = [P.iso(enMarco(M, s0 + (s1 - s0) * t0, rh, a0)), P.iso(enMarco(M, s0 + (s1 - s0) * t1, rh, a1)), P.iso(enMarco(M, s0 + (s1 - s0) * t1, rt, a1)), P.iso(enMarco(M, s0 + (s1 - s0) * t0, rt, a0))];
      const d = camino(q, true);
      if (Math.cos((a0 + a1) / 2 - base) > 0) delante += d; else detras += d;
    }
  }
  return { detras, delante };
}

// ---------------------------------------------------------------- tubos por una ruta
// ruta: puntos 3D (se suaviza con un Catmull-Rom). Devuelve la línea central en pantalla y el ancho (en una proyección
// paralela, un tubo de radio r mide 2·r·k en pantalla en cualquier dirección). La sombra y el brillo se dibujan como
// trazos desplazados hacia el lado de la luz.
export function suavizar(ruta, porTramo = 8) {
  if (ruta.length < 3) return ruta;
  const out = [];
  for (let i = 0; i < ruta.length - 1; i++) {
    const p0 = ruta[Math.max(0, i - 1)], p1 = ruta[i], p2 = ruta[i + 1], p3 = ruta[Math.min(ruta.length - 1, i + 2)];
    for (let j = 0; j < porTramo; j++) {
      const t = j / porTramo, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((c) => 0.5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
    }
  }
  out.push(ruta[ruta.length - 1]);
  return out;
}
export function tubo(ruta, r, P, { suave = true } = {}) {
  const pts3 = suave ? suavizar(ruta) : ruta;
  const pts = pts3.map(P.iso);
  const w = 2 * r * P.k;
  // desplazamiento de pantalla hacia la luz (la luz viene de arriba a la izquierda en pantalla)
  const desplazar = (f) => {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      if (nx * -0.6 + ny * -0.8 < 0) { nx = -nx; ny = -ny; }       // hacia arriba-izquierda
      out.push([pts[i][0] + nx * f * w / 2, pts[i][1] + ny * f * w / 2]);
    }
    return out;
  };
  return { d: camino(pts), w, brillo: camino(desplazar(0.42)), sombra: camino(desplazar(-0.45)), pts3, pts };
}

// El mismo tubo para una ruta ya en pantalla (2D): cables y tubos del circuito que unen el grabado y la máquina
export function tuboPantalla(pts2, w) {
  const pts = pts2;
  const desplazar = (f) => pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    if (nx * -0.6 + ny * -0.8 < 0) { nx = -nx; ny = -ny; }
    return [p[0] + nx * f * w / 2, p[1] + ny * f * w / 2];
  });
  return { d: camino(pts), w, brillo: camino(desplazar(0.42)), sombra: camino(desplazar(-0.45)), pts };
}
// Curva suave por puntos de pantalla (Catmull-Rom)
export function suave2(pts, porTramo = 8) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < porTramo; j++) { const t = j / porTramo, t2 = t * t, t3 = t2 * t; out.push([0, 1].map((c) => 0.5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3))); }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// ---------------------------------------------------------------- el lienzo: piezas → SVG con sus degradados
// Los tonos son variables CSS de la escena (definidas con tokens en ISO_CSS). b: brillo 0-1.
const pct = (b) => Math.round(Math.max(0, Math.min(1, b)) * 100);
export class Lienzo {
  constructor(prefijo) { this.p = prefijo; this.n = 0; this.defs = []; }
  // degradado lineal en espacio de pantalla; familia: 'iso' (gris cálido), 'lit' (oro) o 'sangre'
  grad(g, familia = 'iso') {
    const id = `${this.p}g${this.n++}`;
    const stops = g.stops.map(([o, b]) => `<stop offset="${f1(o * 100)}%" style="stop-color:color-mix(in srgb,var(--${familia}-claro) ${pct(b)}%,var(--${familia}-oscuro))"/>`).join('');
    this.defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f1(g.x1)}" y1="${f1(g.y1)}" x2="${f1(g.x2)}" y2="${f1(g.y2)}">${stops}</linearGradient>`);
    return id;
  }
  // Un cuerpo de revolución: relleno de papel, bandas con degradado, tapas, pliegues y costuras («dentro») y contorno
  torno(T, { familia = 'iso', linea = 'mid', dentro = '', clase = '', attrs = '', k = 1 } = {}) {
    let s = `<g class="iso-pieza ${clase}" ${attrs}><path class="iso-papel" d="${T.relleno}"/>`;
    for (const b of T.bandas) { const id = this.grad(k === 1 ? b.g : { ...b.g, stops: b.g.stops.map(([o, v]) => [o, v * k]) }, familia); s += `<path d="${b.d}" fill="url(#${id})" stroke="url(#${id})" stroke-width=".35"/>`; }
    for (const t of T.tapas) s += `<path class="iso-cara" d="${t.d}" style="fill:color-mix(in srgb,var(--${familia}-claro) ${pct(t.b + 0.06)}%,var(--${familia}-oscuro))"/>`;
    s += `<path class="iso-l faint" d="${T.pliegues}"/>${dentro}<path class="iso-l ${linea}" d="${T.contorno}"/></g>`;
    return s;
  }
  // Un prisma o una caja
  prisma(S, { familia = 'iso', linea = 'mid', dentro = '', clase = '', attrs = '', k = 1 } = {}) {
    let s = `<g class="iso-pieza ${clase}" ${attrs}><path class="iso-papel" d="${S.relleno}"/>`;
    for (const c of S.caras) s += `<path d="${c.d}" style="fill:color-mix(in srgb,var(--${familia}-claro) ${pct(c.b * 0.85 * k)}%,var(--${familia}-oscuro))"/>`;
    if (S.tapa) s += `<path d="${S.tapa.d}" style="fill:color-mix(in srgb,var(--${familia}-claro) ${pct(S.tapa.b * k)}%,var(--${familia}-oscuro))"/>`;
    s += `<path class="iso-l faint" d="${S.pliegue}"/>${S.bisel ? `<path class="iso-l bisel" d="${S.bisel}"/>` : ''}${dentro}<path class="iso-l ${linea}" d="${S.contorno}"/></g>`;
    return s;
  }
  // Un tubo: contorno, cuerpo, sombra y brillo (de color «familia»)
  tubo(T, { familia = 'iso', clase = '', attrs = '', cap = 'round' } = {}) {
    return `<g class="iso-tubo ${clase}" ${attrs} fill="none" stroke-linecap="${cap}" stroke-linejoin="round">`
      + `<path d="${T.d}" class="tb-borde" stroke-width="${f1(T.w + 1)}"/>`
      + `<path d="${T.d}" style="stroke:color-mix(in srgb,var(--${familia}-claro) 52%,var(--${familia}-oscuro))" stroke-width="${f1(T.w)}"/>`
      + `<path d="${T.sombra}" style="stroke:color-mix(in srgb,var(--${familia}-claro) 30%,var(--${familia}-oscuro))" stroke-width="${f1(T.w * 0.32)}"/>`
      + `<path d="${T.brillo}" style="stroke:color-mix(in srgb,var(--${familia}-claro) 88%,var(--${familia}-oscuro))" stroke-width="${f1(Math.max(0.5, T.w * 0.16))}"/></g>`;
  }
  defsSvg() { return `<defs>${this.defs.join('')}</defs>`; }
}
export const lineas = (lista, clase = 'lo') => lista.map((x) => `<path class="iso-l ${clase}" d="${x.d}" opacity="${f1(x.a)}"/>`).join('');
export const tornillos = (pts, r = 0.55) => pts.map((p) => tornillo(p[0], p[1], r)).join('');

// El CSS de la pieza: tonos hechos con dos tokens cada uno (papel = fondo de la app)
export const ISO_CSS = `
/* la pastilla de origen («ficha · p. 22», «ilustrativo»): una línea, recortada con puntos si no cabe (las tres maquetas) */
.org { display: inline-block; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom; }
.iso { --iso-oscuro: var(--bg-main); --iso-claro: color-mix(in srgb, var(--text-main) 46%, var(--bg-main));
  --lit-oscuro: color-mix(in srgb, var(--accent-yellow) 30%, var(--bg-main)); --lit-claro: var(--accent-blue);
  --sangre-oscuro: color-mix(in srgb, var(--accent-red) 40%, var(--bg-main)); --sangre-claro: color-mix(in srgb, var(--accent-red) 80%, var(--text-main));
  --venosa-oscuro: color-mix(in srgb, var(--accent-purple) 40%, var(--bg-main)); --venosa-claro: color-mix(in srgb, var(--accent-purple) 80%, var(--text-main));
  --helio-oscuro: color-mix(in srgb, var(--text-dim) 25%, var(--bg-main)); --helio-claro: color-mix(in srgb, var(--text-main) 70%, var(--bg-main)); }
.iso .iso-papel { fill: var(--bg-main); }
.iso .iso-l { fill: none; stroke-width: .6; stroke-linecap: round; stroke-linejoin: round; }
.iso .iso-l.hi { stroke: var(--text-main); } .iso .iso-l.mid { stroke: var(--text-dim); } .iso .iso-l.lo { stroke: var(--text-muted); }
.iso .iso-l.faint { stroke: color-mix(in srgb, var(--text-muted) 45%, var(--bg-main)); }
.iso .iso-l.bisel { stroke: color-mix(in srgb, var(--text-main) 55%, var(--bg-main)); stroke-width: .45; }
.iso .iso-l.lit { stroke: var(--accent-blue); stroke-width: .9; }
.iso .iso-tornillo { fill: var(--text-dim); }
.iso .tb-borde { stroke: var(--text-dim); }
.iso .iso-halo { fill: var(--bg-main); opacity: .9; filter: blur(3px) brightness(.35); }
`;

// ---------------------------------------------------------------- movimiento tranquilo
export const seguir = (x, obj, dt, tau = 0.2) => x + (obj - x) * (1 - Math.exp(-dt / tau));
// muelle críticamente amortiguado (estado {x, v}); devuelve si sigue moviéndose
export function muelle(st, obj, dt, seg = 0.4) {
  const w = 1 / seg; for (let i = 0; i < 4; i++) { const h = dt / 4; st.v += (w * w * (obj - st.x) - 2 * w * st.v) * h; st.x += st.v * h; }
  if (Math.abs(obj - st.x) < 1e-4 && Math.abs(st.v) < 1e-4) { st.x = obj; st.v = 0; return false; }
  return true;
}
// Un bucle por figura: dt en segundos (como mucho 1/30), parado fuera de pantalla; con «reducir movimiento», un
// fotograma y quieto. tick(dt, quieto) devuelve true si quiere seguir.
export function bucle(el, tick) {
  const quieto = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0, ultimo = 0, visible = true;
  const f = (t) => { const dt = ultimo ? Math.min((t - ultimo) / 1000, 1 / 30) : 1 / 60; ultimo = t; const sigue = tick(dt, quieto.matches); raf = visible && sigue && !quieto.matches ? requestAnimationFrame(f) : 0; };
  const arrancar = () => { if (!raf && visible) { ultimo = 0; raf = requestAnimationFrame(f); } };
  new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) arrancar(); }, { rootMargin: '120px 0px' }).observe(el);
  return { arrancar, parar: () => { cancelAnimationFrame(raf); raf = 0; } };
}


// ---------------------------------------------------------------- grabado rápido: proyecciones fijas
// La isométrica de 30°: x e y avanzan cos 30° y sen 30° en pantalla y z sube 1 (con k = 1). Es camara() con la mirada a
// 35,26° (la diagonal del cubo), así que todo lo de arriba (torno, tubo, caraMatriz) vale igual.
const ISO_EL = Math.asin(1 / Math.sqrt(3)) * 180 / Math.PI;
export const isometrica = ({ x = 0, y = 0, k = 1 } = {}) => camara({ az: 45, el: ISO_EL, k: k * Math.sqrt(1.5), o: [x, y] });
// La oblicua (caballera reducida): el frente (x, z) sin deformar y la profundidad y, que sube hacia la derecha
// (a = 0,42 y b = 0,34 por unidad). Se ven el frente (y = 0), la tapa y el costado derecho.
export function oblicua({ x = 0, y = 0, a = 0.42, b = 0.34, k = 1 } = {}) {
  const V = unit([a, -1, b]), L = unit([-0.55, 0.35, 0.9]);
  return { k, o: [x, y], V, L, iso: (p) => [x + k * (p[0] + a * p[1]), y - k * (p[2] + b * p[1])],
    dir: (d) => [k * (d[0] + a * d[1]), -k * (d[2] + b * d[1])], prof: (p) => pto(p, V) };
}

// ---------------------------------------------------------------- grabado rápido: la caja de tres tonos
// Una caja de [x, y, z] a [x + w, y + d, z + h] con cualquier proyección. Elige sola sus caras visibles (normal hacia el
// observador) y les da el tono por la luz: la tapa, la cara clara y la oscura. Dos pieles:
//   · por clase (el grabado del receptor, con trama): t-sup, t-<tono> y t-osc (+ «lit», el único acento);
//   · por tonos (el banco plano del corazón eléctrico): { sup, supOp, claro, oscuro }, con su trazo.
// id, clase y attrs van en el <g>; dentro, lo que se pinta encima (tornillos, rótulos).
export function caja3(P, [x, y, z], [w, d, h], { tonos = null, tono = 'med', lit = false, id = '', clase = '', attrs = '', dentro = '' } = {}) {
  const v = (i, j, k) => [x + i * w, y + j * d, z + k * h];
  const lados = [
    { n: [1, 0, 0], q: [v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1)] },
    { n: [-1, 0, 0], q: [v(0, 0, 0), v(0, 1, 0), v(0, 1, 1), v(0, 0, 1)] },
    { n: [0, 1, 0], q: [v(0, 1, 0), v(1, 1, 0), v(1, 1, 1), v(0, 1, 1)] },
    { n: [0, -1, 0], q: [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)] },
  ].filter((c) => pto(c.n, P.V) > 1e-6).map((c) => ({ ...c, b: brillo(c.n, P) })).sort((a, b) => a.b - b.b);
  const sup = [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)];
  const dd = (q) => camino(q.map(P.iso), true), L = lit ? ' lit' : '';
  // con una sola cara lateral a la vista, esa es la clara
  const rol = (i) => (lados.length === 1 || i > 0 ? 'claro' : 'oscuro');
  let s = '';
  if (tonos) {
    const st = 'stroke="var(--text-main)" stroke-width=".55" stroke-linejoin="round"';
    lados.forEach((c, i) => { s += `<path d="${dd(c.q)}" fill="${rol(i) === 'claro' ? tonos.claro || 'var(--card2)' : tonos.oscuro || 'var(--bg-card)'}" ${st}/>`; });
    if (P.V[2] > 0) s += `<path d="${dd(sup)}" fill="${tonos.sup || 'var(--text-muted)'}" fill-opacity="${tonos.supOp ?? 0.55}" ${st}/>`;
  } else {
    lados.forEach((c, i) => { s += `<path class="${rol(i) === 'claro' ? `t-${tono}` : 't-osc'}${L}" d="${dd(c.q)}"/>`; });
    if (P.V[2] > 0) s += `<path class="t-sup${L}" d="${dd(sup)}"/>`;
  }
  return `<g${id ? ` id="${id}"` : ''}${clase ? ` class="${clase}"` : ''}${attrs ? ' ' + attrs : ''}>${s}${dentro}</g>`;
}

// ---------------------------------------------------------------- grabado rápido: piezas planas de la lámina
// (En coordenadas de la lámina: la oblicua del receptor las usa tal cual.)
const f2 = (x) => +(+x).toFixed(2);
// Un cilindro de eje vertical: tapa elíptica arriba y la sombra en el costado
export function cilindroV(cx, top, rx, ry, h, { tono = 'med', lit = false, id = '', attrs = '', tapa = true } = {}) {
  const L = lit ? ' lit' : '';
  const cuerpo = `M${f2(cx - rx)} ${f2(top)}v${f2(h)}a${f2(rx)} ${f2(ry)} 0 0 0 ${f2(2 * rx)} 0v${f2(-h)}`;
  const sombra = `M${f2(cx + rx * 0.35)} ${f2(top + ry * 0.94)}v${f2(h)}a${f2(rx)} ${f2(ry)} 0 0 0 ${f2(rx * 0.65)} ${f2(-ry * 0.94)}v${f2(-h)}a${f2(rx)} ${f2(ry)} 0 0 1 ${f2(-rx * 0.65)} ${f2(ry * 0.94)}Z`;
  return `<g${id ? ` id="${id}"` : ''}${attrs ? ' ' + attrs : ''}><path class="t-${tono}${L}" d="${cuerpo}"/><path class="t-osc" d="${sombra}" style="stroke:none"/>`
    + (tapa ? `<ellipse class="t-sup${L}" cx="${f2(cx)}" cy="${f2(top)}" rx="${f2(rx)}" ry="${f2(ry)}"/>` : '') + `</g>`;
}
// Un cilindro de eje horizontal (x): se ve la cara de la derecha; el cuerpo con su brillo arriba
export function cilindroH(x0, x1, cy, r, { tono = 'med', id = '', lit = false } = {}) {
  const ry = r, rx = r * 0.36, L = lit ? ' lit' : '';
  return `<g${id ? ` id="${id}"` : ''}><path class="t-${tono}${L}" d="M${f2(x0)} ${f2(cy - ry)}H${f2(x1)}a${f2(rx)} ${f2(ry)} 0 0 1 0 ${f2(2 * ry)}H${f2(x0)}a${f2(rx)} ${f2(ry)} 0 0 1 0 ${f2(-2 * ry)}Z"/>`
    + `<path class="linea-f" d="M${f2(x0 + 1)} ${f2(cy - ry * 0.55)}H${f2(x1 - 1)}"/><ellipse class="t-sup${L}" cx="${f2(x1)}" cy="${f2(cy)}" rx="${f2(rx)}" ry="${f2(ry)}"/></g>`;
}
// Un tubo a lo largo de una línea quebrada: contorno, relleno, la luz roja de dentro y un brillo fino
export function tuboPlano(pts, r, { id = '', luz = true } = {}) {
  const d = 'M' + pts.map((p) => `${f2(p[0])} ${f2(p[1])}`).join('L');
  return `<g${id ? ` id="${id}"` : ''}><path d="${d}" style="fill:none;stroke:var(--text-dim);stroke-width:${f2(2 * r + 1.4)};stroke-linejoin:round;stroke-linecap:round"/>`
    + `<path d="${d}" style="fill:none;stroke:var(--card2);stroke-width:${f2(2 * r)};stroke-linejoin:round;stroke-linecap:round"/>`
    + (luz ? `<path d="${d}" style="fill:none;stroke:var(--accent-red);stroke-opacity:.22;stroke-width:${f2(2 * r - 1.2)};stroke-linejoin:round;stroke-linecap:round"/>` : '')
    + `<path d="${d}" style="fill:none;stroke:var(--text-main);stroke-opacity:.35;stroke-width:.6;stroke-linejoin:round" transform="translate(0 ${f2(-r * 0.5)})"/></g>`;
}
// Un tornillo (cabeza y ranura). Por debajo de r 0,7, solo la cabeza
export const tornillo = (x, y, r = 1.5) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" style="fill:var(--card2);stroke:var(--text-dim);stroke-width:${r < 0.7 ? 0.3 : 0.5}"/>`
  + (r < 0.7 ? '' : `<path d="M${f2(x - r * 0.6)} ${f2(y)}h${f2(r * 1.2)}" style="stroke:var(--text-dim);stroke-width:.45"/>`);
// Las marcas de una regla que cuelgan de su borde (cada «paso»; una mayor cada 5)
export function regla(x0, x1, y, paso, alto = 2.4) {
  let h = '';
  for (let i = 0, x = x0; x <= x1 + 0.01; x += paso, i++) h += `<path class="${i % 5 ? 'linea-f' : 'linea'}" d="M${f2(x)} ${f2(y)}v${f2(i % 5 ? alto : alto * 1.8)}"/>`;
  return h;
}

// ---------------------------------------------------------------- grabado rápido: tonos por clase y tramas
// Tinta crema sobre fondo oscuro, sombra por trama: la tapa clara, el frente medio, el costado oscuro; .lit, el acento.
export const GRABADO_CSS = `
.dib .t-sup { fill: var(--card2); stroke: var(--text-dim); stroke-width: .7; stroke-linejoin: round; }
.dib .t-med { fill: url(#g-media); stroke: var(--text-dim); stroke-width: .7; stroke-linejoin: round; }
.dib .t-osc { fill: url(#g-densa); stroke: var(--text-dim); stroke-width: .7; stroke-linejoin: round; }
.dib .t-base { fill: var(--bg-main); stroke: var(--text-muted); stroke-width: .7; stroke-linejoin: round; }
.dib .linea { fill: none; stroke: var(--text-dim); stroke-width: .7; stroke-linecap: round; stroke-linejoin: round; }
.dib .linea-f { fill: none; stroke: var(--text-muted); stroke-width: .5; stroke-linecap: round; }
.dib .linea-h { fill: none; stroke: var(--text-main); stroke-width: .9; stroke-linecap: round; stroke-linejoin: round; }
.dib .lit { stroke: var(--text-main) !important; stroke-width: 1.2 !important; }
`;
export const GRABADO_DEFS = `<pattern id="g-media" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="3.2" height="3.2" style="fill:var(--bg-main)"/><line x1="0" y1="0" x2="0" y2="3.2" style="stroke:var(--text-dim)" stroke-opacity=".32" stroke-width=".6"/></pattern>
<pattern id="g-densa" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="2.2" height="2.2" style="fill:var(--bg-main)"/><line x1="0" y1="0" x2="0" y2="2.2" style="stroke:var(--text-dim)" stroke-opacity=".45" stroke-width=".6"/></pattern>`;

// Cada pieza pone su CSS (y sus tramas) una sola vez, aunque la usen varias figuras
const instalados = new Set();
export function instalarCss(clave, css, defs = '') {
  if (typeof document === 'undefined' || instalados.has(clave)) return;
  instalados.add(clave);
  const st = document.createElement('style'); st.dataset.pieza = clave; st.textContent = css; document.head.prepend(st);   // antes que el CSS de la página: la página manda
  if (defs) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.style.position = 'absolute'; svg.innerHTML = `<defs>${defs}</defs>`; document.body.prepend(svg);
  }
}
export const instalarGrabado = () => instalarCss('grabado', GRABADO_CSS, GRABADO_DEFS);
export const instalarIso = () => instalarCss('iso', ISO_CSS);
