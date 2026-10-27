// R2 (eco-mega, parada 3) · contorno del corte (AD y VD) a 388 mL en el instante de pliegue máximo, a 6 px/mm.
// uso: node r2-contorno.mjs <etiqueta> [ruta-de-corazon-geo.mjs]  → /tmp/plan-socialista/eco-mega/capturas/r2-<etiqueta>-cont-<ad-a4c|vd-a4c|vd-psaxMv>.png
// Exporta también contornoPared() para la prueba: bucle de la AD / del VD cortado por el plano de la vista.
import fs from 'node:fs'; import zlib from 'node:zlib';
import { planoVista, elementosDelCorte } from '../../../../js/modules/eco/ecografia.mjs';
import { pacienteDerrame, estadoGeo, bucleMayor, remuestrear } from './saco-contorno.mjs';
export async function contornoPared(estado, pieza, vista, ruta = '../../../../js/modules/eco/corazon-geo.mjs') {
  const { construirCorazon } = await import(ruta);
  const geo = construirCorazon(estado, { pericardio: true, detalle: true }), els = elementosDelCorte(geo.partes, planoVista(vista, estado));
  const el = els.filter(e => e.grupo === pieza && e.seg).sort((a, b) => b.seg.length - a.seg.length)[0];
  return { els, pts: remuestrear(bucleMayor(el.seg), 1.5) };
}
export const area = (b) => Math.abs(b.reduce((s, p, i) => s + p[0] * b[(i + 1) % b.length][1] - b[(i + 1) % b.length][0] * p[1], 0)) / 2;
const crc = (b) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } let r = 0xffffffff; for (const x of b) r = t[(r ^ x) & 255] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; };
function png(w, h, rgba) { const raw = Buffer.alloc((w * 4 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ch = (t, d) => { const b = Buffer.concat([Buffer.from(t), d]), o = Buffer.alloc(4 + b.length + 4); o.writeUInt32BE(d.length, 0); b.copy(o, 4); o.writeUInt32BE(crc(b), 4 + b.length); return o; };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); }
if (process.argv[1]?.endsWith('r2-contorno.mjs')) {
  const et = process.argv[2] || 'x', ruta = process.argv[3] || '../../../../js/modules/eco/corazon-geo.mjs';
  const p = pacienteDerrame(1), es = p.o.map(s => estadoGeo(s, p.ex));
  for (const [k, pieza, vista] of [['pliegueAd', 'AD', 'a4c'], ['pliegueVd', 'VD', 'a4c'], ['pliegueVd', 'VD', 'psaxPm']]) {
    let i = 0; es.forEach((x, j) => { if (x[k] > es[i][k]) i = j; });
    const { els, pts } = await contornoPared(es[i], pieza, vista, ruta);
    const W = 640, H = 520, xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), x0 = Math.min(...xs) - 15, x1 = Math.max(...xs) + 15, y0 = Math.min(...ys) - 15, y1 = Math.max(...ys) + 15, s = Math.min(600 / (x1 - x0), 480 / (y1 - y0)), px = new Uint8ClampedArray(W * H * 4); for (let j = 3; j < px.length; j += 4) px[j] = 255;
    const set = (x, y, c) => { const X = Math.round(20 + (x - x0) * s), Y = Math.round(20 + (y - y0) * s); if (X >= 0 && X < W && Y >= 0 && Y < H) { const o = (Y * W + X) * 4; px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; } };
    const lin = (a, b, c) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * s * 2) + 1; for (let j = 0; j <= n; j++) set(a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n, c); };
    for (const e of els) if (e.seg && /^(VI|VD|Pericardio|AI|AD)$/.test(e.grupo) && e.tipo !== 'relleno') for (let j = 0; j < e.seg.length; j += 4) lin([e.seg[j], e.seg[j + 1]], [e.seg[j + 2], e.seg[j + 3]], e.grupo === pieza ? [255, 255, 255] : [110, 110, 110]);
    fs.writeFileSync(`/tmp/plan-socialista/eco-mega/capturas/r2-${et}-cont-${pieza.toLowerCase()}-${vista}.png`, png(W, H, px));
    console.log(pieza, vista, 'puntos', pts.length, 'área', area(pts).toFixed(0), 'mm²');
  }
}
