// Abdomen alto bajo el corazón: hígado, diafragma y apófisis xifoides (mallas de Z-Anatomy, fijas al cuerpo, en
// abdomen-data.mjs) y, dibujadas aquí, la vena cava inferior, las tres venas suprahepáticas y la porta.
//
// Lo fijo se decodifica una vez y se reutiliza (mismos arrays: la tarjeta gráfica no los vuelve a subir). La VCI
// cambia de calibre cada fotograma: su diámetro máximo y su colapso inspiratorio salen de la PVC del motor y de un
// reloj respiratorio propio (el motor no respira), con cifras ilustrativas elegidas para caer en las bandas de la
// tabla de FATE de la app (Manual UMI): PVC 0-5 → <21 mm y colapso >50%; 10-20 → >21 mm y <50%. Su extremo de
// arriba sale de la AD y se mueve con el corazón (geo.flujo); por debajo del hiato, la vena está quieta.
//
// Todo en el sistema propio del corazón (mm), como el resto de piezas: el renderizador y la ecografía las tratan
// igual. Las venas suprahepáticas y la porta de Z-Anatomy son muñones de pocos milímetros; por eso se dibujan como
// tubos, con direcciones anatómicas aproximadas, recortados para quedar dentro del hígado.
import { ABDOMEN } from './abdomen-data.mjs';
import { PUNTOS_ABDOMEN as PA } from './abdomen-puntos.mjs';
import { MODELO, m4, nrm, dot, cruz } from './mat.mjs';
import { tubo, suave } from './corazon-geo.mjs';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const paso = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

export const COLORES_ABD = {
  higado: [0.47, 0.19, 0.15], diafragma: [0.72, 0.46, 0.42], xifoides: [0.90, 0.86, 0.76],
  vena: [0.38, 0.30, 0.60], porta: [0.50, 0.36, 0.62],
};

// del cuerpo (RAS: derecha, delante, arriba) al sistema del corazón: la traspuesta de MODELO (es ortogonal)
const Mi = [MODELO[0], MODELO[4], MODELO[8], 0, MODELO[1], MODELO[5], MODELO[9], 0, MODELO[2], MODELO[6], MODELO[10], 0, 0, 0, 0, 1];
export const dirCuerpo = (ras) => nrm(m4.apply3(Mi, ras));
export const ARRIBA = dirCuerpo([0, 0, 1]);

// ---- calibre de la VCI (ilustrativo; ver la cabecera)
/** Diámetro en espiración (mm), colapso inspiratorio (fracción) y diámetro en inspiración, para una PVC (mmHg). */
export function modeloVci(pvc) {
  const dmax = clamp(11 + pvc, 7, 28), colapso = clamp(0.75 - 0.045 * pvc, 0.05, 0.75);
  return { dmax, colapso, dmin: dmax * (1 - colapso) };
}
export const PERIODO_RESP = 4;      // s (15/min), ilustrativo
/** Inspiración (0 = espiración, 1 = final de la inspiración) en el instante t (s, tiempo del motor). */
export function respiracion(t) {
  const f = (((t % PERIODO_RESP) + PERIODO_RESP) % PERIODO_RESP) / PERIODO_RESP;
  return f < 0.375 ? paso(0, 0.375, f) : 1 - paso(0.375, 0.8, f);
}

// ---- mallas fijas
const decodificar = (b64, Tipo) => { const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return new Tipo(u8.buffer); };
function malla(m) {
  const q = decodificar(m.pos, Int16Array), pos = new Float32Array(q.length);
  for (let i = 0; i < q.length; i++) pos[i] = q[i] / 10;
  return { pos, idx: Uint32Array.from(decodificar(m.idx, Uint16Array)) };
}
const centroDe = (pos) => { const c = [0, 0, 0], n = pos.length / 3; for (let i = 0; i < pos.length; i += 3) { c[0] += pos[i] / n; c[1] += pos[i + 1] / n; c[2] += pos[i + 2] / n; } return c; };

/** ¿Está p dentro de una malla cerrada? (paridad de un rayo, Möller-Trumbore) */
export function dentroMalla(m, p, dir = [0.577, 0.577, 0.578]) {
  const P = m.pos, I = m.idx; let n = 0;
  for (let k = 0; k < I.length; k += 3) {
    const a = 3 * I[k], b = 3 * I[k + 1], c = 3 * I[k + 2];
    const e1 = [P[b] - P[a], P[b + 1] - P[a + 1], P[b + 2] - P[a + 2]], e2 = [P[c] - P[a], P[c + 1] - P[a + 1], P[c + 2] - P[a + 2]];
    const h = cruz(dir, e2), det = dot(e1, h); if (Math.abs(det) < 1e-9) continue;
    const s = [p[0] - P[a], p[1] - P[a + 1], p[2] - P[a + 2]], u = dot(s, h) / det; if (u < 0 || u > 1) continue;
    const q = cruz(s, e1), v = dot(dir, q) / det; if (v < 0 || u + v > 1) continue;
    if (dot(e2, q) / det > 0) n++;
  }
  return n % 2 === 1;
}

let FIJO = null;
function fijo() {
  if (FIJO) return FIJO;
  const higado = malla(ABDOMEN.higado), diafragma = malla(ABDOMEN.diafragma), xifoides = malla(ABDOMEN.xifoides);
  const pieza = (nombre, m, color, mat, alfa) => ({ nombre, pos: m.pos, idx: m.idx, color, mat, alfa, dobleCara: true, clave: 'abd:' + nombre, centro: centroDe(m.pos), fijo: true });
  // eje de la VCI por debajo del hiato (hasta 120 mm), en el sentido del flujo invertido: de arriba abajo
  const H = PA.hiato, alto = (p) => dot(res(p, H), ARRIBA);
  const ejeVci = [H, ...PA.vci.map(v => v.slice(0, 3)).filter(p => alto(p) < -6 && alto(p) > -120)];
  // venas suprahepáticas: desembocan en la VCI justo bajo el diafragma; van hacia delante y abajo, abriéndose
  const J = sum(H, esc(ARRIBA, -14));
  const dentro = (p) => dentroMalla(higado, p);
  const rama = (desde, ras, max, curva = 0.0025) => {
    const d = dirCuerpo(ras), pts = [desde]; let entro = false, ultimoDentro = 0;
    for (let s = 2; s <= max; s += 2) { const p = sum(sum(desde, esc(d, s)), esc(ARRIBA, -curva * s * s));
      const ok = dentro(p); if (ok) { entro = true; ultimoDentro = s; } else if (entro || s > 30) break; pts.push(p); }
    // se para 6 mm antes de salir del hígado
    // (un punto cada 8 mm basta: después se suaviza)
    const fin = Math.max(10, ultimoDentro - 6), sel = pts.filter((_, i) => i === 0 || (2 * i <= fin && i % 4 === 0));
    if (2 * (sel.length - 1) * 4 < fin) sel.push(pts[Math.floor(fin / 2)]);
    return suave(sel, 3);
  };
  const suprahepaticas = [['derecha', [1, -0.25, -0.35], 95], ['media', [0.35, 0.85, -0.4], 85], ['izquierda', [-0.8, 0.5, -0.2], 75]]
    .map(([n, d, max]) => ({ nombre: 'Vena suprahepática ' + n, eje: rama(J, d, max) }));
  const [P0, P1] = PA.porta;
  const portal = [{ nombre: 'Vena porta', eje: suave([P0, sum(P0, esc(res(P1, P0), 0.5)), P1], 4), r: 6 },
    { nombre: 'Rama portal derecha', eje: rama(P1, [1, -0.1, 0.15], 60, 0), r: 4.2 },
    { nombre: 'Rama portal izquierda', eje: rama(P1, [-0.85, 0.45, 0.1], 55, 0), r: 3.8 }];
  const porta = portal.map(v => ({ nombre: v.nombre, ...tubo(v.eje, v.r, 12), color: COLORES_ABD.porta, mat: 5, clave: 'abd:' + v.nombre, fijo: true }));
  FIJO = {
    higado, ejeVci, suprahepaticas, J, portal,
    estaticas: [pieza('Hígado', higado, COLORES_ABD.higado, 8, 0.42), pieza('Diafragma', diafragma, COLORES_ABD.diafragma, 8, 0.3),
      pieza('Apófisis xifoides', xifoides, COLORES_ABD.xifoides, 9, 0.7), ...porta],
  };
  return FIJO;
}

/**
 * Las piezas del abdomen para un fotograma. geo: el corazón de este fotograma (exacto o mezclado: solo se usa su
 * flujo, para saber dónde está ahora la desembocadura de la VCI en la AD); m: { pvc, pad, t } del motor.
 * Devuelve { partes, vci: { d, dmax, dmin, colapso, inspiracion } }.
 */
export function construirAbdomen(geo, m) {
  const F = fijo(), mod = modeloVci(m.pvc), insp = respiracion(m.t || 0);
  // latido: la onda de presión de la AD pasa un poco a la vena (como mucho ±2%, con ±5 mmHg alrededor de la PVC),
  // poco para que el diámetro no salte de una banda de FATE a otra dentro de un latido
  const latido = 1 + 0.02 * clamp(((m.pad ?? m.pvc) - m.pvc) / 5, -1, 1);
  const d = mod.dmax * (1 - mod.colapso * insp) * latido, r = d / 2;
  // tramo de arriba: desde dentro de la AD hasta 14 mm fuera, movido con el corazón
  const f = geo.flujo, arriba = [1, 0.66, 0.33, 0].map(t => f.transformar(f.enVia('vci', t)));
  // de abajo arriba: el marco del tubo se ancla en el extremo quieto, y así lo que no se mueve queda idéntico
  const eje = suave([...F.ejeVci].reverse().concat(arriba.reverse()), 3);
  const vci = { nombre: 'Vena cava inferior', ...tubo(eje, r, 16), color: COLORES_ABD.vena, mat: 5, clave: 'abd:vci' };
  // suprahepáticas: el calibre sigue a la PVC con la mitad de colapso
  const rh = clamp(2.6 + 0.17 * m.pvc, 2.4, 7) * (1 - 0.5 * mod.colapso * insp) * latido;
  const sh = F.suprahepaticas.map(v => ({ nombre: v.nombre, ...tubo(v.eje, rh, 12, (u) => rh * (1 - 0.35 * u)), color: COLORES_ABD.vena, mat: 5, clave: 'abd:' + v.nombre }));
  // vasos para el Doppler: eje en el sentido del flujo (VCI y suprahepáticas, hacia el corazón; porta, hepatópeta)
  const vasos = [{ nombre: 'Vena cava inferior', tipo: 'vci', pts: eje, r },
    ...F.suprahepaticas.map(v => ({ nombre: v.nombre, tipo: 'hepatica', pts: v.eje.slice().reverse(), r: 0.85 * rh })),
    ...F.portal.map(v => ({ nombre: v.nombre, tipo: 'porta', pts: v.eje, r: v.r }))];
  return { partes: [...F.estaticas, vci, ...sh], vasos, vci: { d, ...mod, inspiracion: insp } };
}

/** Datos fijos (para pruebas y para la vista subcostal): hígado, hiato, desembocadura de las suprahepáticas, xifoides. */
export function anatomiaAbdomen() { const F = fijo(); return { higado: F.higado, hiato: PA.hiato, J: F.J, xifoides: PA.xifoides_punta, ejeVci: F.ejeVci, suprahepaticas: F.suprahepaticas }; }
