// uso: node r1-captura.mjs <etiqueta> [gravedad=1]  → /tmp/plan-socialista/eco-mega/capturas/r1b-<etiqueta>-<vista>.png
import fs from 'node:fs'; import zlib from 'node:zlib';
import { crearEcografo } from '../../../../js/modules/eco/ecografia.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { planoVista } from '../../../../js/modules/eco/ecografia.mjs';
import { pacienteDerrame, telediastole, estadoGeo, cortes } from './saco-contorno.mjs';
const [, , et = 'x', gs = '1'] = process.argv, g = +gs;
const crc = (b) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } let r = 0xffffffff; for (const x of b) r = t[(r ^ x) & 255] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; };
function png(w, h, rgba) { const raw = Buffer.alloc((w * 4 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ch = (t, d) => { const b = Buffer.concat([Buffer.from(t), d]), o = Buffer.alloc(4 + b.length + 4); o.writeUInt32BE(d.length, 0); b.copy(o, 4); o.writeUInt32BE(crc(b), 4 + b.length); return o; };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); }
const p = pacienteDerrame(g), s = telediastole(p), e = estadoGeo(s, p.ex);
const ec = crearEcografo({ ancho: 540, alto: 450 });
for (const v of ['a4c', 'sc4c', 'plax', 'psaxMv']) {
  const geo = construirCorazon(e, { pericardio: true, detalle: true }), P = planoVista(v, e), im = ec.formar(geo.partes, P);
  fs.writeFileSync(`/tmp/plan-socialista/eco-mega/capturas/r1b-${et}-${v}.png`, png(im.ancho, im.alto, im.pix));
  const c = cortes(g, v, e); const mn = Math.min(...c.ang), dd = c.dist.map((d, i) => Math.abs(d - c.dist[(i + 1) % c.dist.length]));
  console.log(v, 'puntos', c.pts.length, 'ángulo mín', mn.toFixed(0), 'dist saco-corazón', Math.min(...c.dist).toFixed(1), '-', Math.max(...c.dist).toFixed(1), 'salto máx/3mm', Math.max(...dd).toFixed(1));
}
// contorno del saco (blanco) y paredes del corazón (gris) en mm, a 4 px/mm: r1-<etiqueta>-cont-<vista>.png
for (const v of ['a4c', 'sc4c', 'plax']) {
  const c = cortes(g, v, e), W = 640, H = 520, xs = c.pts.map(q => q[0]), ys = c.pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), k = Math.min(600 / (x1 - x0), 480 / (y1 - y0)), px = new Uint8ClampedArray(W * H * 4).fill(0); for (let i = 3; i < px.length; i += 4) px[i] = 255;
  const set = (x, y, col) => { const X = Math.round(20 + (x - x0) * k), Y = Math.round(20 + (y - y0) * k); if (X >= 0 && X < W && Y >= 0 && Y < H) { const o = (Y * W + X) * 4; px[o] = col[0]; px[o + 1] = col[1]; px[o + 2] = col[2]; } };
  const lin = (a, b, col) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * k * 2) + 1; for (let i = 0; i <= n; i++) set(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n, col); };
  for (const el of c.els) if (el.tipo === 'relleno') for (let i = 0; i < el.seg.length; i += 4) lin([el.seg[i], el.seg[i + 1]], [el.seg[i + 2], el.seg[i + 3]], [120, 120, 120]);
  c.pts.forEach((q, i) => { lin(q, c.pts[(i + 1) % c.pts.length], c.ang[i] < 135 ? [255, 60, 60] : [255, 255, 255]); });
  fs.writeFileSync(`/tmp/plan-socialista/eco-mega/capturas/r1b-${et}-cont-${v}.png`, png(W, H, px));
}
