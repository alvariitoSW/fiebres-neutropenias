// El ECG del ritmo vivo (no el onda() de la escena del potasio): solo se importan MOTOR y aplicarK.
// aplicarK cubre el K⁺ alto (5,5-8,6; De Sequera 2024 p. 21). La hipopotasemia (onda U, T plana, QT largo) NO está en el
// ritmo vivo: se pinta el trazo que hay y un rótulo «pendiente». Con asistolia, línea plana (no hay actividad que sumar).
import { MOTOR } from '../../../js/modules/libros/ritmo-vivo/motor.js';
import { aplicarK } from '../../../js/data/ritmo-vivo-data.js';
const NS = 'http://www.w3.org/2000/svg';
export function crearEcg(g, { x, y, w, h, seg = 3.2 }) {
  const mo = MOTOR.crear({ semilla: 11 });
  let t = 20; mo.avanzar(t + 0.07);
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'var(--accent-green)'); path.setAttribute('stroke-width', '1.4'); path.setAttribute('stroke-linejoin', 'round');
  g.append(path);
  const base = y + h * 0.7, esc = h * 0.6, N = 170;
  let kUsado = 4, plano = false, ultimoK = null;
  // kEcg: lo que el ritmo vivo sabe pintar. Con calcio en el tubo, el ECG se pinta como el de 5,5 (el K⁺ del paciente no cambia).
  function dibujar() {
    let d = '';
    for (let i = 0; i <= N; i++) {
      const tt = t - seg + seg * i / N, v = plano ? 0 : MOTOR.voltaje(mo, tt, 'II', {});
      d += (i ? 'L' : 'M') + (x + w * i / N).toFixed(1) + ' ' + (base - v * esc).toFixed(1);
    }
    path.setAttribute('d', d);
  }
  return {
    // s: estado ya evaluado { k, caEcg, parada }; devuelve el K⁺ con el que se pintó
    tick(dt, k, protegido, parada) {
      plano = !!parada;
      const ke = protegido ? Math.min(k, 5.5) : k;
      if (ke !== ultimoK) { aplicarK(mo, Math.max(ke, 4)); ultimoK = ke; }
      t += dt; mo.avanzar(t + 0.07); dibujar(); return ke;
    },
    pintarFijo(k, protegido, parada) { this.tick(0.001, k, protegido, parada); },
  };
}
