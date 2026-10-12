// Álgebra mínima de matrices 4×4 (column-major, como WebGL) y cámara orbital compartida
export const m4 = {
  ident: () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
  mul(a, b) { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; },
  persp(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2); return [t / asp,0,0,0, 0,t,0,0, 0,0,(f + n) / (n - f),-1, 0,0,2 * f * n / (n - f),0]; },
  lookAt(e, c, up) { const z = nrm(sub(e, c)), x = nrm(cruz(up, z)), y = cruz(z, x);
    return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x, e),-dot(y, e),-dot(z, e),1]; },
  rotX(a) { const c = Math.cos(a), s = Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; },
  rotY(a) { const c = Math.cos(a), s = Math.sin(a); return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; },
  rotZ(a) { const c = Math.cos(a), s = Math.sin(a); return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]; },
  apply(m, p) { const x = p[0], y = p[1], z = p[2]; const w = m[3] * x + m[7] * y + m[11] * z + m[15];
    return [(m[0] * x + m[4] * y + m[8] * z + m[12]) / w, (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, (m[2] * x + m[6] * y + m[10] * z + m[14]) / w]; },
  apply3(m, p) { return [m[0] * p[0] + m[4] * p[1] + m[8] * p[2], m[1] * p[0] + m[5] * p[1] + m[9] * p[2], m[2] * p[0] + m[6] * p[1] + m[10] * p[2]]; },
};
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// Posición anatómica: ápex hacia la izquierda del paciente (+x), delante (+y) y abajo.
// La geometría usa x = izquierda del paciente, y = anterior, z = superior. Esos tres ejes forman un sistema
// "zurdo" en anatomía, así que antes de dibujar se invierte x (pasa a ser la derecha del paciente, como en un
// sistema anatómico diestro RAS). Sin esta inversión el corazón sale en espejo (aspecto de dextrocardia).
// Después: ápex hacia la izquierda del paciente (−x), delante (+y) y abajo.
export const ESPEJO = [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
export const MODELO = m4.mul(m4.mul(m4.rotX(0.3), m4.rotY(0.5)), ESPEJO);
// Del cuerpo (RAS: derecha del paciente, delante, arriba) al sistema del corazón: la traspuesta de MODELO (es ortogonal).
const MODELO_INV = [MODELO[0], MODELO[4], MODELO[8], 0, MODELO[1], MODELO[5], MODELO[9], 0, MODELO[2], MODELO[6], MODELO[10], 0, 0, 0, 0, 1];
export const dirCuerpo = (ras) => nrm(m4.apply3(MODELO_INV, ras));
export const ARRIBA = dirCuerpo([0, 0, 1]), DELANTE = dirCuerpo([0, 1, 0]), DERECHA = dirCuerpo([1, 0, 0]);
// determinante de la parte 3×3: negativo = la transformación invierte el sentido de giro de los triángulos
export const det3 = (m) => m[0] * (m[5] * m[10] - m[9] * m[6]) - m[4] * (m[1] * m[10] - m[9] * m[2]) + m[8] * (m[1] * m[6] - m[5] * m[2]);

export function crearCamara() {
  const c = { yaw: 0, pitch: 0.12, dist: 330, centro: [0, 0, -22], fov: 0.62 };
  c.vista = (asp) => {
    const e = [c.centro[0] + c.dist * Math.sin(c.yaw) * Math.cos(c.pitch), c.centro[1] + c.dist * Math.cos(c.yaw) * Math.cos(c.pitch), c.centro[2] + c.dist * Math.sin(c.pitch)];
    const V = m4.lookAt(e, c.centro, c.arriba || [0, 0, 1]);
    return { V, P: m4.persp(c.fov, asp, 20, 2000), ojo: e };
  };
  // Gestos: con ratón, arrastrar gira en los dos ejes y la rueda acerca. Con el dedo, deslizar en horizontal
  // gira; en vertical se deja desplazar la página (touch-action: pan-y); con dos dedos, pellizcar acerca y
  // deslizar arriba/abajo inclina. Así el corazón no "atrapa" el scroll de la página en el móvil.
  c.enganchar = (el, onCambio) => {
    el.style.touchAction = 'pan-y';
    const punteros = new Map(); let ini = null;
    const medio = () => { const p = [...punteros.values()]; return [(p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2, Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1])]; };
    const empezar = () => { ini = { yaw: c.yaw, pitch: c.pitch, dist: c.dist, p: [...punteros.values()][0].slice(), m: punteros.size === 2 ? medio() : null }; };
    el.addEventListener('pointerdown', (ev) => { punteros.set(ev.pointerId, [ev.clientX, ev.clientY, ev.pointerType]); if (ev.pointerType === 'mouse') el.setPointerCapture(ev.pointerId); empezar(); });
    el.addEventListener('pointermove', (ev) => {
      if (!punteros.has(ev.pointerId) || !ini) return;
      punteros.set(ev.pointerId, [ev.clientX, ev.clientY, ev.pointerType]);
      if (punteros.size >= 2 && ini.m) { const m = medio();
        c.dist = Math.max(120, Math.min(800, ini.dist * ini.m[2] / Math.max(1, m[2])));
        c.pitch = Math.max(-1.4, Math.min(1.4, ini.pitch - (m[1] - ini.m[1]) * 0.01));
        c.yaw = ini.yaw + (m[0] - ini.m[0]) * 0.01; }
      else if (punteros.size === 1) { const p = punteros.get(ev.pointerId);
        c.yaw = ini.yaw + (p[0] - ini.p[0]) * 0.01;
        if (p[2] === 'mouse') c.pitch = Math.max(-1.4, Math.min(1.4, ini.pitch - (p[1] - ini.p[1]) * 0.01)); }
      onCambio && onCambio();
    });
    const soltar = (ev) => { punteros.delete(ev.pointerId); if (punteros.size) empezar(); else ini = null; };
    el.addEventListener('pointerup', soltar); el.addEventListener('pointercancel', soltar); el.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') soltar(ev); });
    el.addEventListener('wheel', (ev) => { c.dist = Math.max(120, Math.min(800, c.dist * (1 + Math.sign(ev.deltaY) * 0.1))); onCambio && onCambio(); ev.preventDefault(); }, { passive: false });
  };
  return c;
}
