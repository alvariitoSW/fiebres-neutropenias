// Renderizador WebGL propio (sin librerías): Lambert + especular suave, dos caras,
// transparencias ordenadas. Consume las piezas de corazon-geo.
import { m4, MODELO, det3 } from './mat.mjs';
const VS = `#version 300 es
in vec3 p; in vec3 n; in float ao; uniform mat4 MVP; uniform mat4 MV; uniform mat3 NM;
out vec3 vN; out vec3 vP; out vec3 vO; out float vAO;
void main(){ gl_Position = MVP * vec4(p,1.0); vN = NM * n; vP = (MV * vec4(p,1.0)).xyz; vO = p; vAO = ao; }`;
// Materiales (ilustrativos): 1 miocardio con fibras helicoidales, 2 endocardio liso y claro,
// 3 grasa lobulada, 4 valva, 5 vaso brillante, 6 sangre, 7 pericardio.
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
  const u = { MVP: U(pr, 'MVP'), MV: U(pr, 'MV'), NM: U(pr, 'NM'), color: U(pr, 'color'), alfa: U(pr, 'alfa'), luz: U(pr, 'luz'), luz2: U(pr, 'luz2'), mat: U(pr, 'mat') };
  const uL = { MVP: U(prL, 'MVP'), color: U(prL, 'color') };
  const uP = { MVP: U(prP, 'MVP'), MV: U(prP, 'MV'), escala: U(prP, 'escala'), alfa: U(prP, 'alfa') };
  const bufP = { p: gl.createBuffer(), t: gl.createBuffer() };
  const bufs = new Map();   // por nombre de pieza (se reutilizan)
  const buf = (clave) => { if (!bufs.has(clave)) bufs.set(clave, { p: gl.createBuffer(), n: gl.createBuffer(), i: gl.createBuffer(), a: gl.createBuffer() }); return bufs.get(clave); };
  const loc = { p: gl.getAttribLocation(pr, 'p'), n: gl.getAttribLocation(pr, 'n'), ao: gl.getAttribLocation(pr, 'ao'), pL: gl.getAttribLocation(prL, 'p'),
    pP: gl.getAttribLocation(prP, 'p'), tP: gl.getAttribLocation(prP, 'tipo') };
  // sube un array al búfer solo si ha cambiado (los índices de las rejillas se comparten entre fotogramas)
  const subir = (b, campo, tipo, datos) => { if (b[campo + 'Ref'] === datos) return; gl.bindBuffer(tipo, b[campo]); gl.bufferData(tipo, datos, gl.DYNAMIC_DRAW); b[campo + 'Ref'] = datos; };
  gl.enable(gl.DEPTH_TEST);
  return {
    gl,
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
      const prof = ([pz]) => { let cx = 0, cy = 0, cz = 0; const n = pz.pos.length / 3; for (let i = 0; i < pz.pos.length; i += 3) { cx += pz.pos[i]; cy += pz.pos[i + 1]; cz += pz.pos[i + 2]; } return m4.apply(MV, [cx / n, cy / n, cz / n])[2]; };
      trans.sort((a, b) => prof(a) - prof(b));
      const dib = ([pz, k]) => {
        const b = buf(pz.nombre + '#' + k);
        subir(b, 'p', gl.ARRAY_BUFFER, pz.pos); gl.bindBuffer(gl.ARRAY_BUFFER, b.p);
        gl.enableVertexAttribArray(loc.p); gl.vertexAttribPointer(loc.p, 3, gl.FLOAT, false, 0, 0);
        subir(b, 'n', gl.ARRAY_BUFFER, pz.normales || (pz.normales = normalesSuaves(pz.pos, pz.idx))); gl.bindBuffer(gl.ARRAY_BUFFER, b.n);
        gl.enableVertexAttribArray(loc.n); gl.vertexAttribPointer(loc.n, 3, gl.FLOAT, false, 0, 0);
        subir(b, 'i', gl.ELEMENT_ARRAY_BUFFER, pz.idx); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.i);
        if (pz.ao) { subir(b, 'a', gl.ARRAY_BUFFER, pz.ao); gl.bindBuffer(gl.ARRAY_BUFFER, b.a); gl.enableVertexAttribArray(loc.ao); gl.vertexAttribPointer(loc.ao, 1, gl.FLOAT, false, 0, 0); }
        else { gl.disableVertexAttribArray(loc.ao); gl.vertexAttrib1f(loc.ao, 1.0); }
        gl.uniform3fv(u.color, pz.color); gl.uniform1f(u.alfa, pz.alfa ?? 1); gl.uniform1i(u.mat, pz.mat || 1);
        if (pz.dobleCara) gl.disable(gl.CULL_FACE); else { gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); }
        gl.drawElements(gl.TRIANGLES, pz.idx.length, gl.UNSIGNED_INT, 0);
      };
      gl.disable(gl.BLEND); gl.depthMask(true); opacas.forEach(dib);
      // sangre: primero lo que se ve (con profundidad) y luego, tenue, lo que queda tras las paredes
      if (puntos && puntos.pos.length) {
        gl.useProgram(prP); gl.disableVertexAttribArray(loc.n); gl.disableVertexAttribArray(loc.ao);
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
      gl.disableVertexAttribArray(loc.n); gl.disableVertexAttribArray(loc.ao);
      partes.forEach((pz, k) => { if (!pz.lineas) return; const b = buf(pz.nombre + '#' + k);
        subir(b, 'p', gl.ARRAY_BUFFER, pz.lineas); gl.bindBuffer(gl.ARRAY_BUFFER, b.p);
        gl.enableVertexAttribArray(loc.pL); gl.vertexAttribPointer(loc.pL, 3, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(uL.color, pz.color); gl.drawArrays(gl.LINES, 0, pz.lineas.length / 3); });
    },
  };
}
