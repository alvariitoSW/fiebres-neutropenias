// Renderizador WebGL propio (sin librerías): Lambert + especular suave, dos caras,
// transparencias ordenadas. Consume las piezas de corazon-geo.
import { m4, MODELO, det3 } from './mat.mjs';
const VS = `#version 300 es
in vec3 p; in vec3 n; in float ao; in vec3 p2; in vec3 n2; in float ao2; uniform float mezcla;
uniform mat4 MVP; uniform mat4 MV; uniform mat3 NM;
out vec3 vN; out vec3 vP; out vec3 vO; out float vAO;
// mezcla de dos formas precalculadas (formas.mjs): con mezcla = 0 solo cuenta la primera
void main(){ vec3 q = mix(p, p2, mezcla); gl_Position = MVP * vec4(q,1.0); vN = NM * mix(n, n2, mezcla); vP = (MV * vec4(q,1.0)).xyz; vO = q; vAO = mix(ao, ao2, mezcla); }`;
// Materiales (ilustrativos): 1 miocardio con fibras helicoidales, 2 endocardio liso y claro,
// 3 grasa lobulada, 4 valva, 5 vaso brillante, 6 sangre, 7 pericardio, 8 víscera (hígado, diafragma), 9 hueso.
// Luz: principal cálida, relleno frío desde abajo, ambiente de hemisferio, brillo "húmedo" en dos lóbulos.
const FS = `#version 300 es
precision mediump float; in vec3 vN; in vec3 vP; in vec3 vO; in float vAO;
uniform vec3 color; uniform float alfa; uniform vec3 luz; uniform vec3 luz2; uniform int mat; out vec4 o;
float fibras(vec3 q){ float a = atan(q.y, q.x); float h = a * 24.0 + q.z * (0.45 + 0.004 * q.z);
  float s = 0.5 + 0.5 * sin(h + 0.6 * sin(q.z * 0.21 + a * 3.0));
  float g = 0.5 + 0.5 * sin(q.x * 0.73 + q.y * 0.61 - q.z * 0.97) * sin(q.y * 1.1 - q.z * 0.4);
  return mix(s, g, 0.35); }
float lobulos(vec3 q){ return 0.5 + 0.5 * sin(q.x * 1.3) * sin(q.y * 1.1 + 0.7) * sin(q.z * 1.25 + 1.3); }
void main(){
  vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N; vec3 V = normalize(-vP);
  vec3 L1 = normalize(luz), L2 = normalize(luz2);
  vec3 base = color; float brillo = 0.22, duro = 40.0;
  if (mat == 1) { base *= 0.9 + 0.16 * fibras(vO); brillo = 0.28; }
  else if (mat == 2) { base *= 1.04; brillo = 0.3; duro = 60.0; }
  else if (mat == 3) { float l = lobulos(vO); base *= 0.86 + 0.2 * l; brillo = 0.35; duro = 30.0; }
  else if (mat == 4) { brillo = 0.18; duro = 20.0; }
  else if (mat == 5) { brillo = 0.45; duro = 70.0; }
  else if (mat == 6) { brillo = 0.1; }
  else if (mat == 8) { base *= 0.92 + 0.12 * lobulos(vO * 0.35); brillo = 0.32; duro = 34.0; }
  else if (mat == 9) { base *= 0.94 + 0.08 * lobulos(vO * 1.4); brillo = 0.12; duro = 16.0; }
  float d1 = max(dot(N, L1), 0.0), d2 = max(dot(N, L2), 0.0);
  vec3 cielo = vec3(0.34, 0.31, 0.32), suelo = vec3(0.13, 0.10, 0.12);
  vec3 amb = mix(suelo, cielo, 0.5 + 0.5 * N.y);
  vec3 dif = amb + d1 * vec3(1.0, 0.95, 0.9) * 0.85 + d2 * vec3(0.55, 0.62, 0.78) * 0.32;
  float h1 = max(dot(N, normalize(L1 + V)), 0.0);
  float sp = pow(h1, duro) * brillo + pow(h1, 10.0) * brillo * 0.25;
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.16;
  float a = vAO;
  vec3 c = base * dif * a + (sp + rim * vec3(1.0, 0.9, 0.9)) * (0.4 + 0.6 * a);
  o = vec4(c, alfa); }`;
// Partículas de sangre: punto redondo con borde más oscuro; tamaño en mm del modelo
const VSP = `#version 300 es
in vec3 p; in float tipo; uniform mat4 MVP; uniform mat4 MV; uniform float escala; out float vTipo;
void main(){ gl_Position = MVP * vec4(p,1.0); vec4 e = MV * vec4(p,1.0); gl_PointSize = escala / max(1.0, -e.z); vTipo = tipo; }`;
const FSP = `#version 300 es
precision mediump float; in float vTipo; uniform float alfa; out vec4 o;
// glóbulo: centro claro, color y un borde oscuro para que destaque sobre el miocardio
void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard;
  vec3 ox = vec3(1.0, 0.42, 0.30), ven = vec3(0.62, 0.58, 1.0); vec3 c = mix(ven, ox, vTipo);
  c = mix(vec3(1.0, 0.95, 0.9), c, smoothstep(0.0, 0.22, r));
  c = mix(c, vec3(0.08, 0.02, 0.04), smoothstep(0.34, 0.46, r)); o = vec4(c, alfa); }`;
const VSL = `#version 300 es
in vec3 p; uniform mat4 MVP; void main(){ gl_Position = MVP*vec4(p,1.0); }`;
const FSL = `#version 300 es
precision mediump float; uniform vec3 color; out vec4 o; void main(){ o = vec4(color,1.0); }`;

function programa(gl, vs, fs) {
  const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; };
  const pr = gl.createProgram(); gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr)); return pr;
}
export function normalesSuaves(pos, idx) {
  const n = new Float32Array(pos.length);
  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    n[a] += nx; n[a + 1] += ny; n[a + 2] += nz; n[b] += nx; n[b + 1] += ny; n[b + 2] += nz; n[c] += nx; n[c + 1] += ny; n[c + 2] += nz;
  }
  return n;
}
export function crearWebGL(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
  if (!gl) return null;
  const pr = programa(gl, VS, FS), prL = programa(gl, VSL, FSL), prP = programa(gl, VSP, FSP);
  const U = (p, n) => gl.getUniformLocation(p, n);
  const u = { MVP: U(pr, 'MVP'), MV: U(pr, 'MV'), NM: U(pr, 'NM'), color: U(pr, 'color'), alfa: U(pr, 'alfa'), luz: U(pr, 'luz'), luz2: U(pr, 'luz2'), mat: U(pr, 'mat'), mezcla: U(pr, 'mezcla') };
  const uL = { MVP: U(prL, 'MVP'), color: U(prL, 'color') };
  const uP = { MVP: U(prP, 'MVP'), MV: U(prP, 'MV'), escala: U(prP, 'escala'), alfa: U(prP, 'alfa') };
  const bufP = { p: gl.createBuffer(), t: gl.createBuffer() };
  const bufs = new Map();   // por nombre de pieza (se reutilizan)
  const buf = (clave) => { if (!bufs.has(clave)) bufs.set(clave, { p: gl.createBuffer(), n: gl.createBuffer(), i: gl.createBuffer(), a: gl.createBuffer() }); return bufs.get(clave); };
  const loc = { p: gl.getAttribLocation(pr, 'p'), n: gl.getAttribLocation(pr, 'n'), ao: gl.getAttribLocation(pr, 'ao'),
    p2: gl.getAttribLocation(pr, 'p2'), n2: gl.getAttribLocation(pr, 'n2'), ao2: gl.getAttribLocation(pr, 'ao2'), pL: gl.getAttribLocation(prL, 'p'),
    pP: gl.getAttribLocation(prP, 'p'), tP: gl.getAttribLocation(prP, 'tipo') };
  // sube un array al búfer solo si ha cambiado (los índices de las rejillas se comparten entre fotogramas)
  const subir = (b, campo, tipo, datos) => { if (b[campo + 'Ref'] === datos) return; gl.bindBuffer(tipo, b[campo]); gl.bufferData(tipo, datos, gl.DYNAMIC_DRAW); b[campo + 'Ref'] = datos; };
  gl.enable(gl.DEPTH_TEST);
  return {
    gl,
    // borra de la tarjeta gráfica los búferes cuya clave empieza por este prefijo (formas de una tabla antigua)
    liberar(prefijo) {
      for (const [clave, b] of bufs) if (clave.startsWith(prefijo)) { for (const x of [b.p, b.n, b.i, b.a]) gl.deleteBuffer(x); bufs.delete(clave); }
    },
    dibujar(partes, cam, fondo = [0.07, 0.07, 0.09], puntos = null) {
      const w = canvas.width, h = canvas.height; gl.viewport(0, 0, w, h);
      gl.clearColor(fondo[0], fondo[1], fondo[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const { V, P } = cam.vista(w / h);
      const MV = m4.mul(V, MODELO), MVP = m4.mul(P, MV);
      const NM = [MV[0], MV[1], MV[2], MV[4], MV[5], MV[6], MV[8], MV[9], MV[10]];
      gl.frontFace(det3(MV) < 0 ? gl.CW : gl.CCW);   // con espejo, la cara delantera es la de giro horario
      gl.useProgram(pr);
      gl.uniformMatrix4fv(u.MVP, false, MVP); gl.uniformMatrix4fv(u.MV, false, MV); gl.uniformMatrix3fv(u.NM, false, NM);
      gl.uniform3f(u.luz, -0.4, 0.5, 0.75); gl.uniform3f(u.luz2, 0.55, -0.6, 0.35);
      const opacas = [], trans = [];
      partes.forEach((pz, k) => { if (pz.lineas) return; (pz.alfa && pz.alfa < 1 ? trans : opacas).push([pz, k]); });
      // transparentes de atrás hacia delante (por el centro de la pieza)
      const prof = ([pz]) => { if (pz.centro) return m4.apply(MV, pz.centro)[2]; let cx = 0, cy = 0, cz = 0; const n = pz.pos.length / 3; for (let i = 0; i < pz.pos.length; i += 3) { cx += pz.pos[i]; cy += pz.pos[i + 1]; cz += pz.pos[i + 2]; } return m4.apply(MV, [cx / n, cy / n, cz / n])[2]; };
      trans.sort((a, b) => prof(a) - prof(b));
      // atributo de vértice desde un búfer (o un valor fijo si la pieza no lo trae)
      const atributo = (b, campo, l, n, datos, fijo) => {
        if (l < 0) return;
        if (datos) { subir(b, campo, gl.ARRAY_BUFFER, datos); gl.bindBuffer(gl.ARRAY_BUFFER, b[campo]); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, 0, 0); }
        else { gl.disableVertexAttribArray(l); fijo?.(); }
      };
      const dib = ([pz, k]) => {
        // pieza normal: un juego de búferes por pieza, que se rehacen cada fotograma; pieza mezclada (formas.mjs):
        // dos formas precalculadas con sus propios búferes (se suben una vez) y la mezcla la hace el sombreador
        const b = buf(pz.clave || (pz.nombre + '#' + k)), b2 = pz.pos2 ? buf(pz.clave2) : null;
        atributo(b, 'p', loc.p, 3, pz.pos);
        atributo(b, 'n', loc.n, 3, pz.normales || (pz.normales = normalesSuaves(pz.pos, pz.idx)));
        atributo(b, 'a', loc.ao, 1, pz.ao, () => gl.vertexAttrib1f(loc.ao, 1.0));
        if (b2) {
          atributo(b2, 'p', loc.p2, 3, pz.pos2); atributo(b2, 'n', loc.n2, 3, pz.normales2);
          atributo(b2, 'a', loc.ao2, 1, pz.ao2, () => gl.vertexAttrib1f(loc.ao2, 1.0));
        } else for (const l of [loc.p2, loc.n2, loc.ao2]) if (l >= 0) gl.disableVertexAttribArray(l);
        gl.uniform1f(u.mezcla, b2 ? pz.mezcla : 0);
        const bi = pz.claveIdx ? buf(pz.claveIdx) : b;
        subir(bi, 'i', gl.ELEMENT_ARRAY_BUFFER, pz.idx); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bi.i);
        gl.uniform3fv(u.color, pz.color); gl.uniform1f(u.alfa, pz.alfa ?? 1); gl.uniform1i(u.mat, pz.mat || 1);
        if (pz.dobleCara) gl.disable(gl.CULL_FACE); else { gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); }
        gl.drawElements(gl.TRIANGLES, pz.idx.length, gl.UNSIGNED_INT, 0);
      };
      // sin VAO, los atributos activados siguen activos al cambiar de programa: se apagan los de la malla
      const apagarMalla = () => { for (const l of [loc.n, loc.ao, loc.p2, loc.n2, loc.ao2]) if (l >= 0) gl.disableVertexAttribArray(l); };
      gl.disable(gl.BLEND); gl.depthMask(true); opacas.forEach(dib);
      // sangre: primero lo que se ve (con profundidad) y luego, tenue, lo que queda tras las paredes
      if (puntos && puntos.pos.length) {
        gl.useProgram(prP); apagarMalla();
        gl.uniformMatrix4fv(uP.MVP, false, MVP); gl.uniformMatrix4fv(uP.MV, false, MV);
        gl.uniform1f(uP.escala, 4.2 * P[5] * h / 2);                           // ~4 mm de diámetro (borde incluido)
        gl.bindBuffer(gl.ARRAY_BUFFER, bufP.p); gl.bufferData(gl.ARRAY_BUFFER, puntos.pos, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(loc.pP); gl.vertexAttribPointer(loc.pP, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufP.t); gl.bufferData(gl.ARRAY_BUFFER, puntos.tipo, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(loc.tP); gl.vertexAttribPointer(loc.tP, 1, gl.UNSIGNED_BYTE, false, 0, 0);
        gl.uniform1f(uP.alfa, 1); gl.drawArrays(gl.POINTS, 0, puntos.pos.length / 3);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.depthFunc(gl.GREATER);
        gl.uniform1f(uP.alfa, 0.22); gl.drawArrays(gl.POINTS, 0, puntos.pos.length / 3);
        gl.depthFunc(gl.LESS); gl.depthMask(true); gl.disable(gl.BLEND); gl.disableVertexAttribArray(loc.tP);
        gl.useProgram(pr);
      }
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); trans.forEach(dib); gl.depthMask(true); gl.disable(gl.BLEND);
      // líneas (cuerdas tendinosas)
      gl.useProgram(prL); gl.uniformMatrix4fv(uL.MVP, false, MVP);
      apagarMalla();
      partes.forEach((pz, k) => { if (!pz.lineas) return; const b = buf(pz.nombre + '#' + k);
        subir(b, 'p', gl.ARRAY_BUFFER, pz.lineas); gl.bindBuffer(gl.ARRAY_BUFFER, b.p);
        gl.enableVertexAttribArray(loc.pL); gl.vertexAttribPointer(loc.pL, 3, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(uL.color, pz.color); gl.drawArrays(gl.LINES, 0, pz.lineas.length / 3); });
    },
  };
}
