// N1 (eco-mega, parada 3) · A4C, SC4C, PLAX con fosa oval, seno coronario y válvula de Eustaquio.
// uso: node n1-captura.mjs <etiqueta>  → /tmp/plan-socialista/eco-mega/capturas/n1-<etiqueta>-<vista>.png
import fs from 'node:fs'; import zlib from 'node:zlib';
import { crearEcografo, planoVista } from '../../../../js/modules/eco/ecografia.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { aplicarEscenario } from '../../../../js/modules/eco/escenarios.mjs';
const et = process.argv[2] || 'x';
const crc = (b) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } let r = 0xffffffff; for (const x of b) r = t[(r ^ x) & 255] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; };
function png(w, h, rgba) { const raw = Buffer.alloc((w * 4 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ch = (t, d) => { const b = Buffer.concat([Buffer.from(t), d]), o = Buffer.alloc(4 + b.length + 4); o.writeUInt32BE(d.length, 0); b.copy(o, 4); o.writeUInt32BE(crc(b), 4 + b.length); return o; };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); }

const m = crearMotor(); m.correr(12); const ex = extraDeMotor(m), td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
const ec = crearEcografo({ ancho: 540, alto: 450 });
const e = estadoGeo(td, ex), geo = construirCorazon(e, { detalle: true, pericardio: true });
for (const v of (process.argv[3] || 'a4c,sc4c,plax').split(',')) { const solo = process.env.SOLO && new RegExp(process.env.SOLO), im = ec.formar(solo ? geo.partes.filter(p => solo.test(p.nombre)) : geo.partes, planoVista(v, e)); fs.writeFileSync(`/tmp/plan-socialista/eco-mega/capturas/n1-${et}-${v}.png`, png(im.ancho, im.alto, im.pix)); }
