// Tórax que rodea al corazón: aorta descendente, columna y pleura-pulmón (N3, eco-mega parada 2).
//
// Son piezas del cuerpo, no del corazón: se colocan detrás del saco pericárdico de cada fotograma (después de que
// la base baje, ver construirCorazon). Todo es ilustrativo: ninguna de las fuentes de la app da un diámetro ni una
// posición (anatomía general, sin página: la aorta descendente va detrás de la AI en el eje largo
// paraesternal y en el supraesternal; las medidas son «hueco»).
//
// Se trabaja en coordenadas del cuerpo alrededor del eje vertical (ARRIBA): lat (+ = derecha del paciente), ant
// (+ = delante) y alt (+ = arriba), con el mismo origen que el corazón. Las pasa a y desde el sistema del corazón
// el par aEje / deEje.
//  · Aorta descendente: sale del final del arco, baja por la izquierda detrás de la AI y se apoya en el saco: se
//    coloca lo más cerca que deja el saco (la sangre del derrame queda delante de ella, que es lo que enseña a
//    distinguir el derrame pericárdico del pleural). Su posición sigue al saco de cada fotograma, en pasos de 2 mm.
//  · Columna: ocho vértebras (cuerpos) en fila, detrás de la aorta. El hueso brilla en su cara de delante y deja
//    una sombra negra detrás (ecografia.mjs).
//  · Pleura-pulmón: dos láminas detrás y a los lados del corazón (de 100° a 175° a cada lado, medidos desde la
//    línea media delantera). La interfaz tejido-aire refleja casi todo: línea brillante y, detrás, líneas A en
//    lugar de tejido (ecografia.mjs). Delante no hay pulmón (ahí están las ventanas, la escotadura cardíaca).
import { ARRIBA, DELANTE, DERECHA } from './mat.mjs';
import { usarDibujo } from './corazon-geo.mjs';   // solo dentro de funciones (ciclo de importación)
const dibujoNuevo = () => { const d = usarDibujo(1); usarDibujo(d); return d === 2; };

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const perp = (a, b) => nrm([a[0] - dot(a, b) * b[0], a[1] - dot(a, b) * b[1], a[2] - dot(a, b) * b[2]]);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const paso = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const L = perp(DERECHA, ARRIBA), F = perp(DELANTE, ARRIBA);
export const aEje = (p) => [dot(p, L), dot(p, F), dot(p, ARRIBA)];
export const deEje = (lat, ant, alt) => [L[0] * lat + F[0] * ant + ARRIBA[0] * alt, L[1] * lat + F[1] * ant + ARRIBA[1] * alt, L[2] * lat + F[2] * ant + ARRIBA[2] * alt];

/** Dibujo nuevo: la aorta sube hasta el nivel de la AI (alt 30), lateral y detrás de ella, para que el A4C y el PLAX la corten donde la eco real. Ilustrativo. */
export const TORAX_NUEVO = { latAo: -28, rAo: 10,   // ~20 mm (v2g: era 22), ilustrativo (anatomía general: lateral a la AI en el A4C y detrás de ella en el PLAX; sin fuente con página)
  antAo: -28 };
/** Medidas (mm). Todas «ilustrativo»: ninguna tiene página en las fuentes (hueco). */
export const TORAX = {
  latAo: -33,            // la aorta descendente, a la izquierda de la línea media del corazón (detrás del borde izquierdo de la AI)
  rAo: 9,                // diámetro ~18 mm (el plan decía ~20: hueco; Mitchell p. 61 no da cifra)
  paso: 2,               // la posición se redondea a pasos de 2 mm para que no tiemble con el latido
  vertebra: { semiLat: 17, semiAnt: 13, alto: 22, paso: 26, n: 8, altBase: -150, hueco: 5, antes: 16 },
  pulmon: { desde: 105, hasta: 175, holgura: 4 },   // grados desde delante; mm de separación del saco (v2 Forma: de 100 a 105°, con la AD
                                                    // apoyada en el tabique el borde del pulmón derecho asomaba en el fondo del A4C)
  origen: 'ilustrativo',
};

/** Hasta dónde llega el saco (y todo lo demás) hacia atrás a la altura lateral lat, para un tubo de radio R. */
function holguraAtras(pos, lat, R) {
  let m = Infinity;
  for (const p of pos) for (let i = 0; i < p.length; i += 3) {
    const x = p[i], y = p[i + 1], z = p[i + 2];
    const la = L[0] * x + L[1] * y + L[2] * z, d = Math.abs(la - lat); if (d >= R) continue;
    const an = F[0] * x + F[1] * y + F[2] * z - Math.sqrt(R * R - d * d); if (an < m) m = an;
  }
  return m;
}

// malla de revolución elíptica alrededor de un eje vertical del cuerpo, con un radio que varía con la altura
function cuerpoVertebral(lat, ant, alt, semiLat, semiAnt, alto, nSeg = 24) {
  const filas = 3, pos = new Float32Array((filas + 1) * (nSeg + 1) * 3), idx = new Uint32Array(filas * nSeg * 6);
  let k = 0;
  for (let i = 0; i <= filas; i++) { const u = i / filas, cintura = 1 - 0.08 * Math.sin(Math.PI * u);   // el cuerpo vertebral es algo más estrecho en medio
    for (let j = 0; j <= nSeg; j++) { const th = (j / nSeg) * Math.PI * 2;
      const p = deEje(lat + semiLat * cintura * Math.cos(th), ant + semiAnt * cintura * Math.sin(th), alt + alto * (u - 0.5));
      pos[k++] = p[0]; pos[k++] = p[1]; pos[k++] = p[2]; } }
  k = 0;
  for (let i = 0; i < filas; i++) for (let j = 0; j < nSeg; j++) { const a = i * (nSeg + 1) + j, b = a + nSeg + 1; idx.set([a, b, a + 1, a + 1, b, b + 1], k); k += 6; }
  return { pos, idx };
}

// lámina vertical (extruida a lo largo de ARRIBA) por una curva del plano axial: pts = [[lat, ant], …]
function lamina(pts, altA, altB) {
  const n = pts.length, pos = new Float32Array(2 * n * 3), idx = new Uint32Array((n - 1) * 6);
  pts.forEach(([la, an], j) => { const a = deEje(la, an, altA), b = deEje(la, an, altB); pos.set(a, j * 3); pos.set(b, (n + j) * 3); });
  for (let j = 0; j < n - 1; j++) idx.set([j, n + j, j + 1, j + 1, n + j, n + j + 1], j * 6);
  return { pos, idx };
}

/**
 * Las piezas del tórax para el corazón de este fotograma.
 * partes: las del corazón (ya con la base bajada); ctx: { tubo, suave (de corazon-geo), rA, arranque: el final del arco
 * en coordenadas del corazón, colores }. Devuelve { piezas, aorta: { lat, ant, r }, columna: { lat, ant }, envolvente }.
 * soloEco: las láminas del pulmón no se dibujan en el 3D (taparían el corazón).
 */
export function construirTorax(partes, ctx) {
  const nuevo = dibujoNuevo(), T = nuevo ? { ...TORAX, ...TORAX_NUEVO } : TORAX, R = T.rAo, R0 = 0.78 * ctx.rA;            // el arco acaba en 0,78 rA (ver 'Aorta' en corazon-geo)
  const resto = partes.filter(p => p.pos && !/^(Aorta|Derrame)$/.test(p.nombre) && !/sangre$/.test(p.nombre)).map(p => p.pos);
  // aorta: lo más cerca del saco que deja el saco, en pasos de T.paso (siempre hacia atrás)
  const hacia = (lat) => Math.floor((holguraAtras(resto, lat, R) - 1) / T.paso) * T.paso;
  const P0 = aEje(ctx.arranque), antAo = nuevo ? Math.min(hacia(T.latAo), T.antAo) : hacia(T.latAo), latM = (P0[0] + T.latAo) / 2;
  const antM = Math.min(hacia(latM), (P0[1] + antAo) / 2, P0[1]);
  const ejeAx = [P0, ...(nuevo ? [[T.latAo, antAo, 38], [T.latAo, antAo, 30]] : [[latM, antM, 20]]), [T.latAo, antAo, 4], [T.latAo, antAo, -50], [T.latAo, antAo, -100], [T.latAo, antAo, -150]];
  const eje = ctx.suave(ejeAx.map(p => deEje(p[0], p[1], p[2])), 5);
  const aorta = ctx.tubo(eje, R, 16, (u) => R0 + (R - R0) * paso(0, 0.25, u));
  const piezas = [{ nombre: 'Aorta descendente', ...aorta, color: ctx.colores.arteria, dobleCara: true }];
  // columna: detrás de la aorta, un poco hacia la derecha del paciente (la aorta queda a su izquierda)
  const V = T.vertebra, latC = T.latAo + V.antes, antC = antAo - R - V.hueco - V.semiAnt;
  for (let k = 0; k < V.n; k++) {
    const m = cuerpoVertebral(latC, antC, V.altBase + k * V.paso, V.semiLat, V.semiAnt, V.alto);
    piezas.push({ nombre: 'Vértebra ' + (k + 1), ...m, color: ctx.colores.hueso, dobleCara: true, mat: 9 });
  }
  // pleura-pulmón: la envolvente del corazón, la aorta y la columna en el plano axial, vista desde su centro
  const todos = resto.concat(piezas.map(p => p.pos));
  let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
  for (const pos of resto) for (let i = 0; i < pos.length; i += 3) {
    const la = L[0] * pos[i] + L[1] * pos[i + 1] + L[2] * pos[i + 2], an = F[0] * pos[i] + F[1] * pos[i + 1] + F[2] * pos[i + 2];
    if (la < a0) a0 = la; if (la > a1) a1 = la; if (an < b0) b0 = an; if (an > b1) b1 = an;
  }
  const c = [(a0 + a1) / 2, (b0 + b1) / 2], NB = 72, env = new Float32Array(NB);
  for (const pos of todos) for (let i = 0; i < pos.length; i += 3) {
    const la = L[0] * pos[i] + L[1] * pos[i + 1] + L[2] * pos[i + 2] - c[0], an = F[0] * pos[i] + F[1] * pos[i + 1] + F[2] * pos[i + 2] - c[1];
    const fi = Math.atan2(-la, an), b = Math.min(NB - 1, Math.floor((fi + Math.PI) / (2 * Math.PI) * NB)), r = Math.hypot(la, an); if (r > env[b]) env[b] = r;
  }
  const filtrada = env.map((_, b) => Math.max(env[(b + NB - 1) % NB], env[b], env[(b + 1) % NB]));
  const radio = (fi) => { const x = (fi + Math.PI) / (2 * Math.PI) * NB - 0.5, b = Math.floor(x), w = x - b;
    return (1 - w) * filtrada[(b + NB) % NB] + w * filtrada[(b + 1 + NB) % NB] + T.pulmon.holgura; };
  const arco = (g0, g1) => { const pts = [], n = 28; for (let j = 0; j <= n; j++) { const fi = (g0 + (g1 - g0) * j / n) * Math.PI / 180, r = radio(fi);
    pts.push([c[0] - r * Math.sin(fi), c[1] + r * Math.cos(fi)]); } return pts; };
  const { desde, hasta } = T.pulmon;
  piezas.push({ nombre: 'Pulmón izquierdo', ...lamina(arco(desde, hasta), -150, 70), color: ctx.colores.pulmon, alfa: 0.12, dobleCara: true, soloEco: true });
  piezas.push({ nombre: 'Pulmón derecho', ...lamina(arco(-desde, -hasta), -150, 70), color: ctx.colores.pulmon, alfa: 0.12, dobleCara: true, soloEco: true });
  return { piezas, aorta: { lat: T.latAo, ant: antAo, r: R }, columna: { lat: latC, ant: antC }, centro: c };
}
