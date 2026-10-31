// Brillo medio (0-255, escala de grises de la imagen) por zona, en A4C, PSAX y PLAX, normal y HP g=1, con el dibujo de hoy y el nuevo.
//   node autonomo/bloques/mv-eco/herramientas/brillo-zonas.mjs [listar]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { construirCorazon, usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { planoVista, crearEcografo } from '../../../../js/modules/eco/ecografia.mjs';
const LISTAR = process.argv[2] === 'listar';
const VISTAS = ['a4c', 'psaxPm', 'plax'];
const ZONAS = ['tabique', 'pared libre VD', 'pared lateral VI', 'pericardio', 'sangre VI', 'sangre VD'];
const ec = crearEcografo({});
function medir(esc, g, vista, dib) {
  usarDibujo(dib);
  const m = crearMotor(); m.correr(12);
  if (esc !== 'normal') { ESCENARIOS[esc].aplicar(m, g); m.correr(ESCENARIOS[esc].forma ? 200 : 40); }
  const o = m.onda, td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const geo = construirCorazon(estadoGeo(td, extraDeMotor(m)), { pericardio: true, detalle: true });
  const P = planoVista(vista, td), im = ec.formar(geo.partes, P, { ref: geo.partes, t: 0, m: { ventana: 0 } });
  if (LISTAR) { console.log(vista, [...im.etiquetas.keys()].join(' | ')); return null; }
  const gris = (x, y) => { const px = Math.round(im.cx + x * im.escala), py = Math.round(im.arriba + y * im.escala); if (px < 0 || py < 0 || px >= im.ancho || py >= im.alto) return null; const q = 4 * (py * im.ancho + px); return (im.pix[q] + im.pix[q + 1] + im.pix[q + 2]) / 3; };
  const T = (re) => new Set([...im.etiquetas].filter(([k]) => re.test(k)).map(([, v]) => v));
  const tVI = T(/^VI$/), tVD = T(/^VD$/), tPer = T(/^Pericardio$/);
  const cel = (f) => { const a = []; for (let q = 0; q < im.tag.length; q++) if (f(im.tag[q], q)) a.push(q); return a; };
  const cen = (a) => [a.reduce((s, q) => s + im.x[q], 0) / a.length, a.reduce((s, q) => s + im.y[q], 0) / a.length];
  const wVI = cel(t => tVI.has(t)), wVD = cel(t => tVD.has(t)), sang = cel(t => t === 255);
  const cVI = cen(wVI), cVD = cen(wVD), ax = [cVD[0] - cVI[0], cVD[1] - cVI[1]], ln = Math.hypot(...ax) || 1;
  const proj = (q) => ((im.x[q] - cVI[0]) * ax[0] + (im.y[q] - cVI[1]) * ax[1]) / ln;
  const cuarto = (a, alto) => { const o = [...a].sort((p, q) => proj(p) - proj(q)); const n = Math.floor(o.length / 4); return alto ? o.slice(-n) : o.slice(0, n); };
  const sangreDe = (cv) => sang.filter(q => Math.hypot(im.x[q] - cv[0], im.y[q] - cv[1]) < 40 && Math.hypot(im.x[q] - cVI[0], im.y[q] - cVI[1]) <= Math.hypot(im.x[q] - cVD[0], im.y[q] - cVD[1]) === (cv === cVI));
  const grupos = { 'tabique': cuarto(wVI, true), 'pared libre VD': cuarto(wVD, false), 'pared lateral VI': cuarto(wVI, false), 'pericardio': cel(t => tPer.has(t)), 'sangre VI': sangreDe(cVI), 'sangre VD': sangreDe(cVD) };
  const r = {};
  for (const [z, a] of Object.entries(grupos)) {
    const acc = { medio: [0, 0], lejos: [0, 0], todo: [0, 0] };
    for (const q of a) { const rr = Math.hypot(im.x[q], im.y[q]), v = gris(im.x[q], im.y[q]); if (v == null) continue; const k = rr >= 50 && rr <= 100 ? 'medio' : rr > 100 ? 'lejos' : null; acc.todo[0] += v; acc.todo[1]++; if (k) { acc[k][0] += v; acc[k][1]++; } }
    r[z] = ['medio', 'lejos', 'todo'].map(k => acc[k][1] > 15 ? (acc[k][0] / acc[k][1]).toFixed(0) : '-').join('/');
  }
  return r;
}
const filas = [];
for (const [esc, g] of [['normal', undefined], ['hpcronica', 1]]) for (const vista of VISTAS) for (const dib of [1, 2]) {
  const r = medir(esc, g, vista, dib); if (r) filas.push([esc, vista, dib === 2 ? 'nuevo' : 'hoy', ...Object.values(r)]);
}
if (!LISTAR) { console.log(['caso', 'vista', 'dibujo', ...ZONAS].join('\t') + '   (medio 50-100 mm / lejano >100 mm / todo)'); for (const f of filas) console.log(f.join('\t')); }
