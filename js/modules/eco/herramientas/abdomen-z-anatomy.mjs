// Genera abdomen-data.mjs (mallas) y abdomen-puntos.mjs (puntos): hígado, diafragma y apófisis xifoides de Z-Anatomy, más el eje de la VCI y el tronco
// portal, ya colocados bajo NUESTRO corazón. No forma parte de la app (no hay build): se ejecuta a mano y su salida
// se guarda en el repositorio.
//
//   npm pack @authorod/svitylo-3d-anatomy-data@1.1.0 meshoptimizer@1.3.0   (y descomprimir cada .tgz)
//   node herramientas/abdomen-z-anatomy.mjs <svitylo/package/releases/1.1.0> <meshoptimizer/package>
//
// Mallas: Z-Anatomy (CC BY-SA 4.0), derivado de BodyParts3D (DBCLS). meshoptimizer (MIT) solo se usa aquí, para
// leer los GLB comprimidos y simplificar; la app no lo carga.
//
// Registro: el cuerpo de Z-Anatomy (x izquierda, y arriba, z delante, mm) se pasa a RAS (x derecha, y delante,
// z arriba), se traslada para que el centro de su aurícula derecha caiga en el de la nuestra (estado de referencia)
// y se baja DZ mm para que el diafragma no corte los ventrículos; después se lleva al sistema propio del corazón con
// la inversa de MODELO (mat.mjs). Escala 1: las aurículas de Z-Anatomy y las nuestras miden lo mismo (±5%).
import { readFileSync, writeFileSync } from 'node:fs';
import { construirCorazon } from '../corazon-geo.mjs';
import { MODELO, m4 } from '../mat.mjs';

const [RAIZ, MO] = process.argv.slice(2);
if (!RAIZ || !MO) { console.error('uso: node abdomen-z-anatomy.mjs <releases/1.1.0> <meshoptimizer/package>'); process.exit(1); }
const { MeshoptDecoder } = await import(MO + '/meshopt_decoder.mjs');
const { MeshoptSimplifier } = await import(MO + '/meshopt_simplifier.js');
await MeshoptDecoder.ready; await MeshoptSimplifier.ready;

// ---- lector de GLB con EXT_meshopt_compression + KHR_mesh_quantization; devuelve posiciones (mm) por _ID
async function leer(ruta) {
  const b = readFileSync(ruta), dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let off = 12, json = null, bin = null;
  while (off < b.length) { const len = dv.getUint32(off, true), tipo = dv.getUint32(off + 4, true), d = b.subarray(off + 8, off + 8 + len);
    if (tipo === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(d)); else bin = d; off += 8 + len; }
  const vistas = json.bufferViews.map((v) => { const e = v.extensions?.EXT_meshopt_compression;
    if (!e) return bin.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength);
    const out = new Uint8Array(e.count * e.byteStride);
    MeshoptDecoder.decodeGltfBuffer(out, e.count, e.byteStride, bin.subarray(e.byteOffset || 0, (e.byteOffset || 0) + e.byteLength), e.mode, e.filter || 'NONE'); return out; });
  const N = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }, TAM = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 }, MAX = { 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 };
  const acc = (i) => { const a = json.accessors[i], bv = json.bufferViews[a.bufferView], raw = vistas[a.bufferView], n = N[a.type];
    const stride = bv.extensions?.EXT_meshopt_compression?.byteStride || bv.byteStride || TAM[a.componentType] * n, d = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
    const lee = { 5120: (o) => d.getInt8(o), 5121: (o) => d.getUint8(o), 5122: (o) => d.getInt16(o, true), 5123: (o) => d.getUint16(o, true), 5125: (o) => d.getUint32(o, true), 5126: (o) => d.getFloat32(o, true) }[a.componentType];
    const out = new Float64Array(a.count * n);
    for (let k = 0; k < a.count; k++) for (let c = 0; c < n; c++) { let v = lee((a.byteOffset || 0) + k * stride + c * TAM[a.componentType]); if (a.normalized) v = Math.max(v / MAX[a.componentType], -1); out[k * n + c] = v; }
    return out; };
  const nodo = json.nodes.find(n => n.mesh != null), prim = json.meshes[nodo.mesh].primitives[0];
  const P = acc(prim.attributes.POSITION), I = acc(prim.indices), ID = acc(prim.attributes._ID), s = nodo.scale || [1, 1, 1], t = nodo.translation || [0, 0, 0];
  for (let i = 0; i < P.length; i += 3) for (let c = 0; c < 3; c++) P[i + c] = (P[i + c] * s[c] + t[c]) * 1000;
  const n = P.length / 3, idDe = (v) => (ID.length === 2 * n ? ID[2 * v] : ID[v]);
  return (id) => { const tri = []; for (let k = 0; k < I.length; k += 3) if (idDe(I[k]) === id) tri.push(I[k], I[k + 1], I[k + 2]);
    const us = [...new Set(tri)], rm = new Map(us.map((v, i) => [v, i]));
    return { pos: us.flatMap(v => [P[3 * v], P[3 * v + 1], P[3 * v + 2]]), idx: tri.map(v => rm.get(v)) }; };
}
const glb = async (f) => leer(`${RAIZ}/standard/${f}.glb`);
const venas2 = await glb('cardiovascular/systemic_veins.2'), venas = await glb('cardiovascular/systemic_veins'), corazon = await glb('cardiovascular/arterial_system');
const za = { higado: (await glb('visceral/digestive_system'))(2324), diafragma: (await glb('muscular/scapulohumeral_muscles--diaphragm'))(914),
  xifoides: (await glb('skeletal/thoracic_skeleton'))(1169), vciT: venas2(2176), vciA: venas2(2178), porta: venas(2175), ad: corazon(1638) };

// ---- registro
const ras = (pos) => { const o = []; for (let i = 0; i < pos.length; i += 3) o.push([-pos[i], pos[i + 2], pos[i + 1]]); return o; };
const centro = (a) => a.reduce((s, p) => [s[0] + p[0] / a.length, s[1] + p[1] / a.length, s[2] + p[2] / a.length], [0, 0, 0]);
const g = construirCorazon({ vvi: 120, vvd: 140, vai: 40, vad: 35, mitral: 0, tricus: 0, aortica: 0, pulmonar: 0 }, { detalle: true });
const ad = []; for (const p of g.partes.filter(p => p.nombre === 'AD')) for (let i = 0; i < p.pos.length; i += 3) ad.push(m4.apply(MODELO, [p.pos[i], p.pos[i + 1], p.pos[i + 2]]));
const DZ = -13;
const T = centro(ad).map((v, k) => v - centro(ras(za.ad.pos))[k] + (k === 2 ? DZ : 0));
// inversa de MODELO: es ortogonal (rotaciones y un espejo), así que basta con la traspuesta
const Mi = [MODELO[0], MODELO[4], MODELO[8], 0, MODELO[1], MODELO[5], MODELO[9], 0, MODELO[2], MODELO[6], MODELO[10], 0, 0, 0, 0, 1];
const local = (p) => m4.apply(Mi, [p[0] + T[0], p[1] + T[1], p[2] + T[2]]);

// ---- simplificación y empaquetado (posiciones en décimas de mm, Int16; índices Uint16; base64)
const b64 = (ta) => Buffer.from(ta.buffer, ta.byteOffset, ta.byteLength).toString('base64');
function malla(m, tris) {
  const pos = new Float32Array(ras(m.pos).flatMap(local));
  const [idx] = MeshoptSimplifier.simplify(new Uint32Array(m.idx), pos, 3, Math.min(m.idx.length, tris * 3), 0.02, []);
  const [rm, n] = MeshoptSimplifier.compactMesh(idx), q = new Int16Array(n * 3);
  for (let v = 0; v < rm.length; v++) { const nv = rm[v]; if (nv === 0xffffffff) continue; for (let c = 0; c < 3; c++) q[3 * nv + c] = Math.round(pos[3 * v + c] * 10); }
  return { pos: b64(q), idx: b64(new Uint16Array(idx)), vertices: n, triangulos: idx.length / 3 };
}
// eje de un vaso: centros de cortes de 6 mm en altura (RAS z), de arriba abajo
function eje(pos, paso = 6) {
  const pts = ras(pos), zs = pts.map(p => p[2]), z1 = Math.max(...zs), z0 = Math.min(...zs), out = [];
  for (let z = z1 - paso / 2; z > z0; z -= paso) { const s = pts.filter(p => Math.abs(p[2] - z) < paso / 2); if (s.length < 4) continue;
    const c = centro(s); out.push({ c, r: s.reduce((a, p) => a + Math.hypot(p[0] - c[0], p[1] - c[1]), 0) / s.length }); }
  return out;
}
const vci = [...eje(za.vciT.pos), ...eje(za.vciA.pos)];
// hiato: el punto del eje de la VCI más cercano a la cara superior del diafragma (vértices del diafragma a < 15 mm del eje)
const dia = ras(za.diafragma.pos);
let hiato = null, mejor = Infinity;
for (const { c } of vci) { const cerca = dia.filter(p => Math.hypot(p[0] - c[0], p[1] - c[1]) < 15); if (!cerca.length) continue;
  const zSup = Math.max(...cerca.map(p => p[2])), d = Math.abs(zSup - c[2]); if (d < mejor) { mejor = d; hiato = c; } }
const portaPts = ras(za.porta.pos), zP = portaPts.map(p => p[2]);
const portaArriba = centro(portaPts.filter(p => p[2] > Math.max(...zP) - 6)), portaAbajo = centro(portaPts.filter(p => p[2] < Math.min(...zP) + 6));
const xif = ras(za.xifoides.pos), puntaXif = xif.reduce((a, p) => (p[2] - 0.3 * p[1] < a[2] - 0.3 * a[1] ? p : a));
const f1 = (p) => p.map(v => +v.toFixed(1));
const datos = { higado: malla(za.higado, 2400), diafragma: malla(za.diafragma, 2800), xifoides: malla(za.xifoides, 220) };
const puntos = {
  vci: vci.map(({ c, r }) => [...f1(local(c)), +r.toFixed(1)]),
  hiato: f1(local(hiato)), porta: [f1(local(portaAbajo)), f1(local(portaArriba))], xifoides_punta: f1(local(puntaXif)),
};
const json = (d) => JSON.stringify(d, null, 1).replace(/\n\s+(-?[\d.]+,?)/g, ' $1').replace(/\n\s+\]/g, ' ]');
// dos archivos: las mallas (grandes) y los puntos (pequeños; corazon-geo solo necesita el hiato y no debe cargar el hígado)
const texto = `// Generado por herramientas/abdomen-z-anatomy.mjs: no editar a mano.
// Hígado, diafragma y apófisis xifoides de Z-Anatomy (CC BY-SA 4.0, https://www.z-anatomy.com), derivado de
// BodyParts3D (© DBCLS), simplificados y colocados bajo nuestro corazón (sistema propio del corazón, mm).
// pos: Int16 en décimas de mm; idx: Uint16; los dos en base64 (little-endian). Los puntos (VCI, hiato, porta,
// xifoides) van en abdomen-puntos.mjs.
export const ABDOMEN = ${json(datos)};
`;
const textoPuntos = `// Generado por herramientas/abdomen-z-anatomy.mjs: no editar a mano.
// Puntos del abdomen de Z-Anatomy (CC BY-SA 4.0, https://www.z-anatomy.com; derivado de BodyParts3D, © DBCLS), en el
// sistema propio del corazón (mm). Aparte de las mallas (abdomen-data.mjs) para que corazon-geo, que solo necesita el
// hiato, no cargue el hígado.
// vci: eje de la vena cava inferior de arriba abajo [x, y, z, radio de Z-Anatomy]; hiato: donde cruza el diafragma;
// porta: tronco portal [abajo, arriba (hilio)]; xifoides_punta: donde se apoya la sonda subcostal.
export const PUNTOS_ABDOMEN = ${json(puntos)};
`;
writeFileSync(new URL('../abdomen-data.mjs', import.meta.url), texto);
writeFileSync(new URL('../abdomen-puntos.mjs', import.meta.url), textoPuntos);
console.log('T', f1(T), 'hígado', datos.higado.triangulos, 'diafragma', datos.diafragma.triangulos, 'xifoides', datos.xifoides.triangulos, 'bytes', texto.length, 'hiato', puntos.hiato, 'distancia hiato-diafragma', mejor.toFixed(1));
