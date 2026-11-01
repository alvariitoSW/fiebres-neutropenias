// Animación con Motion (js/vendor/motion.js vía core/motion.js). Sin Motion o con «reducir movimiento»: estado final directo.
// Gotcha de SVG: se anima un número de 0 a 1 y se escriben los atributos a mano; la opacidad es un atributo.
import { cargarMotion, sinMovimiento } from '../../../js/core/motion.js';
let M = null;
// En la maqueta, la ruta de js/vendor/motion.js es otra que en la app: se carga el script desde aquí y cargarMotion() lo encuentra en window.Motion.
const cargarMaqueta = () => window.Motion ? Promise.resolve() : new Promise((ok) => { const s = document.createElement('script'); s.src = '../../js/vendor/motion.js?v=11.18.2'; s.onload = ok; s.onerror = ok; document.head.appendChild(s); });
export async function prepararMotion() { if (!sinMovimiento() && !M) { await cargarMaqueta(); M = await cargarMotion().catch(() => null); } return !!M; }
/** Mueve las ACh desde sus posiciones previas a las nuevas (los círculos ya están en las nuevas). */
export function moverAch(svg, previas, nuevas, dur = 0.9) {
  const nodos = [...svg.querySelectorAll('.ach')];
  const poner = (v) => nodos.forEach((c, i) => { const a = previas[i] || nuevas[i], b = nuevas[i]; c.setAttribute('cx', a.x + (b.x - a.x) * v); c.setAttribute('cy', a.y + (b.y - a.y) * v); c.setAttribute('opacity', a.o + (b.o - a.o) * v); });
  if (!M || sinMovimiento() || !previas.length) { poner(1); return Promise.resolve(); }
  poner(0); return M.animate(0, 1, { duration: dur, ease: 'easeInOut', onUpdate: poner }).finished.catch(() => poner(1));
}
export function pulso(svg) {
  const e = svg.querySelector('#imp'); const l = svg.querySelectorAll('.imp'); if (!M || sinMovimiento() || !l.length) return;
  M.animate(0, 1, { duration: 0.9, onUpdate: (v) => l.forEach((x) => x.setAttribute('opacity', 1 - v * 0.6)) });
}
