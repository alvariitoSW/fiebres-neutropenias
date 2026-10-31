// El ECG es el del ritmo vivo (solo MOTOR y aplicarK, importados; no se edita nada de ese módulo).
import { MOTOR } from '../ritmo-vivo/motor.js';
import { aplicarK } from '../../../data/ritmo-vivo-data.js';
const VENTANA = 4, N = 200, ESC = 26;
let mo = null, t = 20;
export function iniciar() { mo = MOTOR.crear({ semilla: 11 }); mo.avanzar(t + 0.07); }
export const reloj = () => t;
// kEff: el potasio que «ve» el corazón. aplicarK solo cambia algo por encima de 5,5 (E p. 22 y De Sequera p. 21).
export function avanzar(dt, kEff) { aplicarK(mo, kEff); t += dt; mo.avanzar(t + 0.07); }
export function traza(w = 340, alto = 70) {
  let d = '', vmax = 0;
  for (let i = 0; i <= N; i++) { const tt = t - VENTANA + VENTANA * i / N, v = MOTOR.voltaje(mo, tt, 'II', {}); vmax = Math.max(vmax, Math.abs(v)); d += (i ? 'L' : 'M') + (w * i / N).toFixed(1) + ' ' + (alto * 0.62 - v * ESC).toFixed(1); }
  return { d, vmax };
}
export const PLANO = 'M0 43.4L340 43.4';   // el trazo con el sello de parada: línea plana (no se inventa un ritmo de parada)
