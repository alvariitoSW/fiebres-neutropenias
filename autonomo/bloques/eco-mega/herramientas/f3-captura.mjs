// F3 (eco-mega, parada 3) · A4C en tres instantes (inicio de A, nadir de la AI, fin de la sístole) + espectro de la vena pulmonar.
// uso: node f3-captura.mjs  → /tmp/plan-socialista/eco-mega/capturas/f3-*.png
import fs from 'node:fs'; import zlib from 'node:zlib';
import { crearEcografo, planoVista } from '../../../../js/modules/eco/ecografia.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import * as D from '../../../../js/modules/eco/doppler.mjs';
import { baseGeometrica } from '../../../../js/modules/eco/corazon-geo.mjs';
const et = process.argv[2] || 'x';
const crc = (b) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } let r = 0xffffffff; for (const x of b) r = t[(r ^ x) & 255] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; };
function png(w, h, rgba) { const raw = Buffer.alloc((w * 4 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ch = (t, d) => { const b = Buffer.concat([Buffer.from(t), d]), o = Buffer.alloc(4 + b.length + 4); o.writeUInt32BE(d.length, 0); b.copy(o, 4); o.writeUInt32BE(crc(b), 4 + b.length); return o; };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); }


const dir = '/tmp/plan-socialista/eco-mega/capturas/';
const motorEn = (k = 'normal') => { const m = crearMotor(); m.correr(12); if (k !== 'normal') { ESCENARIOS[k].aplicar(m); m.correr(10); } return m; };
const m = motorEn(), ex = extraDeMotor(m), ec = crearEcografo({ ancho: 540, alto: 450 });
const A = m.onda.filter(s => s.fase === 'A'), fin = (f) => m.onda.filter(s => s.fase === f).at(-1);
for (const [et, s] of [['1-inicioA', A[0]], ['2-nadirA', A.reduce((a, b) => (b.vai < a.vai ? b : a))], ['3-finD', fin('D')]]) {
  const e = estadoGeo(s, ex), geo = construirCorazon(e, { detalle: true }), im = ec.formar(process.env.SOLO ? geo.partes.filter(p => new RegExp(process.env.SOLO).test(p.nombre)) : geo.partes, planoVista('a4c', e));
  fs.writeFileSync(`${dir}f3-a4c${process.env.SOLO ? '-aur' : ''}-${et}.png`, png(im.ancho, im.alto, im.pix)); console.log(et, 't', s.t.toFixed(2), 'vai', s.vai.toFixed(1));
}
// espectro de la vena pulmonar: curva de un latido (cada columna, un instante del motor), eje cm/s ±100
const W = 436, H = 200, VM = 100, pix = new Uint8ClampedArray(W * H * 4).fill(0);
for (const k of (process.argv[2] || 'normal').split(',')) {
  const mm = motorEn(k), t = mm.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a)), areas = D.areasAnillo(baseGeometrica(t)), g = construirCorazon(estadoGeo(t, {}), { detalle: true });
  const F = D.fuentesFlujo(g.flujo, t, areas, [], { rRetorno: mm.p.rRetorno, pvc: mm.ultimo.pvc }), v = F.vasos.find(x => x.tipo === 'pulmonar');
  const fu = { tipo: 'vaso', vasoTipo: 'pulmonar', r: v.r, factor: 1 }, curva = D.curvaLatido(mm.onda, fu, 1, areas, { rRetorno: mm.p.rRetorno, pvc: mm.ultimo.pvc });
  console.log(k, JSON.stringify(D.medidasLatido(curva, fu), (a, x) => typeof x === 'number' ? +x.toFixed(1) : x));
  const out = new Uint8ClampedArray(W * H * 4).fill(0); for (let i = 3; i < out.length; i += 4) out[i] = 255;
  for (let x = 0; x < W; x++) { const col = D.columnaEspectro([curva[Math.min(curva.length - 1, Math.floor(x / W * curva.length))].v], H, VM, x + 1);
    for (let y = 0; y < H; y++) for (let c = 0; c < 3; c++) out[(y * W + x) * 4 + c] = col[3 * y + c]; }
  for (let x = 0; x < W; x++) { const o = (H / 2 * W + x) * 4; out[o] = out[o + 1] = out[o + 2] = 120; }
  fs.writeFileSync(`${dir}f3-pulmonar-${k}.png`, png(W, H, out));
}
