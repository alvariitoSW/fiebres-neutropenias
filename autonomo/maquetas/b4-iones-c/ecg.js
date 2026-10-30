// El ECG de la maqueta: el MISMO motor del ritmo vivo (solo MOTOR y aplicarK; ni su página ni sus ayudas).
// aplicarK solo da el K⁺ alto (5,5-8,6). Con K⁺ bajo o Ca²⁺ bajo se pinta el trazo que hay y un rótulo «pendiente».
import { MOTOR } from '../../../js/modules/libros/ritmo-vivo/motor.js';
import { aplicarK } from '../../../js/data/ritmo-vivo-data.js';

const PXS = 110, ANCHO = 352, MM = 4.4, Y0 = 50, SEG = ANCHO / PXS;
const NS = 'http://www.w3.org/2000/svg';
export function crearEcg(svg) {
  svg.setAttribute('viewBox', `0 0 360 92`);
  svg.innerHTML = `<rect width="360" height="92" fill="var(--bg-main)"/><g id="ec-papel" stroke="var(--text-dim)" stroke-opacity=".25"></g>
    <path id="ec-traza" fill="none" stroke="var(--accent-green)" stroke-width="1.5" stroke-linejoin="round"/>
    <text id="ec-rot" x="4" y="11" font-size="9.5" fill="var(--text-dim)" font-family="system-ui,sans-serif">II · 25 mm/s · 10 mm/mV</text>
    <text id="ec-pend" x="356" y="11" font-size="9.5" text-anchor="end" fill="var(--accent-yellow)" font-family="system-ui,sans-serif"></text>
    <text id="ec-plano" x="180" y="52" font-size="11" text-anchor="middle" fill="var(--accent-red)" font-family="system-ui,sans-serif" hidden></text>`;
  let papel = ''; for (let x = 0; x <= 360; x += MM * 5) papel += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="92"/>`; for (let y = Y0 % (MM * 5); y <= 92; y += MM * 5) papel += `<line x1="0" y1="${y.toFixed(1)}" x2="360" y2="${y.toFixed(1)}"/>`;
  svg.querySelector('#ec-papel').innerHTML = papel;
  const traza = svg.querySelector('#ec-traza'), pend = svg.querySelector('#ec-pend'), plano = svg.querySelector('#ec-plano');
  let mo = null, t = 20, kUsado = null, fcUsada = null, parada = '';
  function rehacer(k, fc) {
    mo = MOTOR.crear({ semilla: 11 }); mo.m.fcSA = fc; mo.m.ramaD = true; mo.m.ramaI = true;
    if (k > 5.5) aplicarK(mo, k);
    mo.reiniciarSA(t - 6 + 0.05); mo.avanzar(t + 0.07); kUsado = k; fcUsada = fc;
  }
  function pintar(dt, k, fc, nota) {
    t += dt;
    if (!mo || Math.abs(Math.max(k, 4) - Math.max(kUsado, 4)) > 0.05 || fc !== fcUsada) rehacer(k, fc);
    mo.avanzar(t + 0.07);
    plano.hidden = !parada; plano.textContent = parada ? `${parada} (trazo plano: ilustrativo)` : '';
    pend.textContent = nota || '';
    let d = '';
    for (let i = 0; i < ANCHO; i += 2) { const y = parada ? Y0 : Y0 - MOTOR.voltaje(mo, t - SEG + i / PXS, 'II', {}) * 10 * MM; d += (i ? 'L' : 'M') + (4 + i) + ' ' + Math.max(14, Math.min(90, y)).toFixed(1); }
    traza.setAttribute('d', d);
  }
  return { pintar, parada: p => { parada = p; }, get mo() { return mo; }, estatico: (k, fc) => { rehacer(k, fc); pintar(0, k, fc); } };
}
export { MOTOR };
