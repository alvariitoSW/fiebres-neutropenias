// La bomba de jeringa: UNA pieza para todas las maquetas (pieza común de la app). La usan el
// carro de aparatos del corazón eléctrico (en isométrica, piel plana) y las bombas del dock del receptor vivo (de
// frente, piel de grabado). Se dibuja con js/core/dibujo-iso.js (caja3, caraMatriz): cualquier cámara vale.
//
// Coordenadas propias (unidades ≈ px con k = 1): el cuerpo va de [0, 0, 0] a [100, 34, 28]; el frente es la cara y = 34
// (pantalla de dos líneas y teclado); encima, la cuna, la jeringa graduada (x 8-66) y el émbolo con su empujador, que
// avanza de x = 86 (lleno) a x = 66 (vacío). La línea sale de la punta de la jeringa: SALIDA.
//
//   bomba(P, { l1, l2, avance, candado, piel, id, idL1, idL2, idEmbolo, sombra }) → cadena SVG
//   embolo(P, avance, piel) → el émbolo y su empujador (para moverlo sin repintar la bomba)
//   bombaMini({ l1, l2, avance, candado }) → <svg> pequeño (112 × 58) para un mando: la misma bomba, de frente
//
// Lo que se lee en la pantalla lo decide quien la usa (el fármaco y su dosis). Ninguna cifra sale de aquí.
import { caja3, caraMatriz, camino, ajustar, instalarGrabado } from './dibujo-iso.js';

export const SALIDA = [2, 17, 35];
const f1 = (n) => Math.round(n * 10) / 10;
const PLANA = {
  cuerpo: { sup: 'var(--text-muted)', supOp: 0.45 },
  cuna: { sup: 'var(--text-dim)', supOp: 0.4 },
  jeringa: { sup: 'var(--text-main)', supOp: 0.28, claro: 'var(--text-dim)', oscuro: 'var(--text-muted)' },
  pieza: { sup: 'var(--text-main)', supOp: 0.55 },
  empujador: { sup: 'var(--text-dim)', supOp: 0.6 },
};
// piel: 'plana' (tonos) o 'grabado' (clases t-*, con trama; necesita instalarGrabado())
const estilo = (piel, k, tono = 'med') => (piel === 'plana' ? { tonos: PLANA[k] } : { tono });

// La escala de la cara frontal en pantalla (raíz del área: cuenta la inclinación de la isométrica): los rótulos de la
// pantalla se leen igual de grandes con cualquier cámara
const escV = (P) => { const u = P.dir([1, 0, 0]), v = P.dir([0, 0, -1]); return Math.sqrt(Math.abs(u[0] * v[1] - u[1] * v[0])) || 1; };

export function embolo(P, avance = 0.35, piel = 'plana') {
  const x = 66 + 20 * (1 - Math.max(0, Math.min(1, avance)));
  return caja3(P, [66, 15, 34], [x - 66 + 0.01, 4, 4], estilo(piel, 'pieza', 'sup'))
    + caja3(P, [x, 12, 31], [3, 10, 10], estilo(piel, 'pieza', 'sup'))
    + caja3(P, [x + 3, 13, 28], [8, 8, 14], estilo(piel, 'empujador'));
}

export function bomba(P, { l1 = '', l2 = '', avance = 0.35, candado = false, piel = 'plana', id = '', idL1 = '', idL2 = '', idEmbolo = '', sombra = true } = {}) {
  const e = escV(P), ANCHO = 55;
  // el rótulo cabe en la pantalla: baja de tamaño hasta 8,2 px en pantalla (7,5 a 360 px de ancho) y, si aún no cabe, se aprieta
  const ajusta = (txt, px) => { const n = String(txt).length || 1, fs = Math.max(8.2 / e, Math.min(px / e, ANCHO / (n * 0.6))); return { fs: f1(fs), lt: n * 0.6 * fs > ANCHO ? ` textLength="${ANCHO}" lengthAdjust="spacingAndGlyphs"` : '' }; };
  const a1 = ajusta(l1, 8.4), a2 = ajusta(l2, 10.6);
  const linea = (a, b, extra) => { const p = P.iso(a), q = P.iso(b); return `<line x1="${f1(p[0])}" y1="${f1(p[1])}" x2="${f1(q[0])}" y2="${f1(q[1])}" ${extra}/>`; };
  const cara = (pts) => camino(pts.map(P.iso), true);
  let h = `<g${id ? ` id="${id}"` : ''} class="bomba-jeringa">`;
  if (sombra) { const c = P.iso([50, 18, 0]); h += `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] + 4 * P.k / 1.22)}" rx="${f1(57 * P.k)}" ry="${f1(11 * P.k)}" fill="var(--bg-main)" fill-opacity=".7"/>`; }
  // el cuerpo, sus tornillos y la rejilla del costado
  h += caja3(P, [0, 0, 0], [100, 34, 28], estilo(piel, 'cuerpo'));
  for (const [x, z] of [[3, 2.5], [97, 2.5], [3, 25.5], [97, 25.5]]) { const p = P.iso([x, 34, z]); h += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(Math.max(0.7, 0.95 * P.k))}" fill="none" stroke="var(--text-main)" stroke-width=".4"/>`; }
  if (P.V[0] > 0.05) {
    h += `<path d="${cara([[100, 6, 6], [100, 28, 6], [100, 28, 18], [100, 6, 18]])}" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".4"/>`;
    h += [8, 11, 14].map((z, i) => linea([100, 9, z], [100, 9 + [16, 12, 14][i], z], 'stroke="var(--text-muted)" stroke-width=".6"')).join('');
  }
  // la pantalla (dos líneas: qué y cuánto) y el teclado
  h += `<path d="${cara([[5, 34, 4], [66, 34, 4], [66, 34, 26], [5, 34, 26]])}" fill="var(--bg-main)" stroke="var(--text-main)" stroke-width=".5"/>`;
  h += `<g transform="${caraMatriz(P, [7.5, 34, 26], [1, 0, 0], [0, 0, -1])}">`
    + `<text${idL1 ? ` id="${idL1}"` : ''} x="0" y="9" font-size="${a1.fs}"${a1.lt} fill="var(--text-dim)" font-weight="600" style="font-family:system-ui, sans-serif">${l1}</text>`
    + `<text${idL2 ? ` id="${idL2}"` : ''} x="0" y="19.5" font-size="${a2.fs}"${a2.lt} fill="var(--accent-blue)" font-weight="700" style="font-family:system-ui, sans-serif">${l2}</text>`;
  if (candado) h += `<g transform="translate(52 6) scale(${f1(1 / e)})"><path d="M-3.4 0v-3a3.4 3.4 0 0 1 6.8 0v3" style="fill:none;stroke:var(--accent-blue);stroke-width:1.4"/><rect x="-5" y="0" width="10" height="7.5" rx="1.5" style="fill:var(--accent-blue)"/><circle cx="0" cy="3.6" r="1.1" style="fill:var(--bg-main)"/></g>`;
  h += `</g>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) h += `<path d="${cara([[70 + i * 9, 34, 7 + j * 9], [77 + i * 9, 34, 7 + j * 9], [77 + i * 9, 34, 13 + j * 9], [70 + i * 9, 34, 13 + j * 9]])}" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".4"/>`;
  // la cuna, la jeringa graduada con su punta y el émbolo
  h += caja3(P, [4, 8, 28], [90, 18, 3], estilo(piel, 'cuna', 'sup'));
  h += `<g class="bomba-jeringa-cuerpo">` + caja3(P, [8, 12, 31], [58, 10, 9], estilo(piel, 'jeringa', 'sup'));
  for (let x = 12; x <= 62; x += 4) h += linea([x, 22, 33], [x, 22, x % 8 === 0 ? 37 : 35], 'stroke="var(--bg-main)" stroke-width=".45"');
  h += caja3(P, [2, 15, 33], [6, 4, 4], estilo(piel, 'pieza', 'sup')) + `</g>`;
  h += `<g${idEmbolo ? ` id="${idEmbolo}"` : ''}>${embolo(P, avance, piel)}</g>`;
  return h + `</g>`;
}

// La misma bomba, de frente y pequeña, para el mando de un fármaco. Con «grabado», pone su CSS y sus tramas.
export function bombaMini({ l1 = '', l2 = '', avance = 0, candado = false, piel = 'grabado' } = {}) {
  if (piel === 'grabado') instalarGrabado();
  const pts = [];
  for (const x of [-6, 100]) for (const y of [0, 34]) for (const z of [0, 42]) pts.push([x, y, z]);
  const P = ajustar(pts, 112, 58, { pad: 2, az: 12, el: 16 });
  const s = P.iso(SALIDA);
  const tubo = `<path d="M${f1(s[0])} ${f1(s[1])}C${f1(s[0] - 4)} ${f1(s[1])} 2 ${f1(s[1] + 6)} 0 ${f1(s[1] + 12)}" fill="none" stroke="var(--text-main)" stroke-width="1.4" stroke-opacity=".7"/>`;
  return `<svg class="bomba-dib dib" viewBox="0 0 112 58" aria-hidden="true"><rect width="112" height="58" fill="var(--bg-main)"/>${tubo}${bomba(P, { l1, l2, avance, candado, piel, sombra: false })}</svg>`;
}
