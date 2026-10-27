// R3 (eco-mega, parada 3) · A4C y PSAX de aórtica/inflow en F (llenado rápido) y separación de puntas de la tricúspide.
// uso: node r3-captura.mjs <etiqueta>  → /tmp/plan-socialista/eco-mega/capturas/r3-<etiqueta>-<vista>.png
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

export function puntasTric(geo) { // distancias (mm) entre las puntas de las 3 valvas
  const ps = geo.partes.filter(q => q.nombre === 'Tricúspide' && q.malla).map(q => { const [ni, nj] = q.malla, k = (ni / 2) * (nj + 1) + nj; return [q.pos[3 * k], q.pos[3 * k + 1], q.pos[3 * k + 2]]; });
  const d = []; for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) d.push(Math.hypot(ps[i][0] - ps[j][0], ps[i][1] - ps[j][1], ps[i][2] - ps[j][2]));
  return d;
}
export function latido(esc) { const m = crearMotor(); m.correr(10); if (esc) { aplicarEscenario(m, esc, 1); m.correr(30); } return { o: m.onda, ex: extraDeMotor(m) }; }
// instante F: pico del flujo mitral
export const instanteF = (p) => p.o.reduce((a, b) => (b.qMit > a.qMit ? b : a));
if (process.argv[1].endsWith('r3-captura.mjs')) {
  const p = latido(), sF = instanteF(p), sS = p.o.reduce((a, b) => (b.qAo > a.qAo ? b : a));
  const ec = crearEcografo({ ancho: 540, alto: 450 });
  for (const [nom, s] of [['F', sF], ['sistole', sS]]) { const e = estadoGeo(s, p.ex), geo = construirCorazon(e, { detalle: true });
    console.log(nom, 'qMit', s.qMit.toFixed(0), 'qTri', s.qTri.toFixed(0), 'tricus', e.tricus.toFixed(2), 'mitral', e.mitral.toFixed(2), 'puntas mm', puntasTric(geo).map(x => x.toFixed(1)).join(' '));
    for (const v of ['a4c', 'psaxAo']) { const im = ec.formar(geo.partes, planoVista(v, e)); fs.writeFileSync(`/tmp/plan-socialista/eco-mega/capturas/r3-${et}-${nom}-${v}.png`, png(im.ancho, im.alto, im.pix)); } }
}
