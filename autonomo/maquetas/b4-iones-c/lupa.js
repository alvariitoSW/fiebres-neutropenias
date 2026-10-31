// La lupa de la célula (Fig. 1) y las dos figuras vivas: la 36.2 (K⁺ total frente a sérico) y la 38.1 (tres fracciones del calcio).
// Partículas de la leyenda común (js/core/particulas.js; claves k, mg, ca, p).
import { svgParticula, leyendaParticulas } from '../../../js/core/particulas.js';
import { PEND, ks, mgSero, po4, caIonico, caFracciones, deficitTabla, dDeKSero, kSeroDeD } from './motor.js';

const R = 4.2, c = (x, n = 1) => x.toFixed(n).replace('.', ',');
function nube(clave, n, x0, y0, w, h) {
  const cols = Math.max(1, Math.floor(w / (2.6 * R))), gap = w / cols, filas = Math.max(1, Math.floor(h / (2.6 * R))); let s = '';
  for (let i = 0; i < Math.min(n, cols * filas); i++) s += svgParticula(clave, x0 + gap * ((i % cols) + 0.5), y0 + R + Math.floor(i / cols) * 2.6 * R, R);
  return s;
}
export function montarLeyenda(el) { el.innerHTML = leyendaParticulas(['k', 'mg', 'ca', 'p'], { titulo: 'Qué es cada partícula' }); }

// Fig. 1: plasma arriba, célula abajo (K⁺ 98 % dentro), hueso a la derecha (Ca 99 %, Mg algo más de la mitad)
export function pintarCelula(svg, s) {
  const k = ks(s), mg = mgSero(s), p = po4(s), ca = caIonico(s);
  const nk = Math.max(1, Math.round(k * 1.6)), nmg = Math.max(1, Math.round(mg * 3)), nca = Math.max(1, Math.round(ca * 6)), np = Math.max(1, Math.round(p * 1.6));
  const dentroK = 22 - Math.round(s.nutri * 6 + s.ins * 2), flecha = (s.ins + s.nutri) > 0.15;
  svg.setAttribute('viewBox', '0 0 360 262');
  svg.innerHTML = `<rect width="360" height="262" fill="var(--bg-main)"/>
  <g font-family="system-ui,sans-serif" font-size="9.5" fill="var(--text-main)">
  <rect x="6" y="6" width="236" height="82" rx="10" fill="none" stroke="var(--text-dim)" stroke-dasharray="4 3"/>
  <text x="12" y="19" fill="var(--text-dim)">Plasma (lo que mide el tubo)</text>
  ${nube('k', nk, 12, 24, 100, 60)}${nube('mg', nmg, 116, 24, 28, 60)}${nube('ca', nca, 150, 24, 34, 60)}${nube('p', np, 190, 24, 44, 60)}
  <text x="12" y="83" fill="var(--text-dim)">K⁺ ${c(k)}</text><text x="120" y="83" fill="var(--text-dim)">Mg ${c(mg)}</text><text x="152" y="83" fill="var(--text-dim)">Ca ${c(ca, 2)}</text><text x="190" y="83" fill="var(--text-dim)">P ${c(p)}</text>
  <ellipse cx="124" cy="176" rx="116" ry="72" fill="var(--bg-card)" stroke="var(--accent-green)" stroke-width="1.5"/>
  <text x="124" y="136" text-anchor="middle" fill="var(--text-dim)">Célula · 98 % del K⁺ dentro</text>
  ${nube('k', dentroK, 40, 146, 168, 50)}${nube('p', 6, 68, 200, 112, 20)}${nube('mg', 5, 60, 224, 126, 20)}
  <path d="M124 92v22" stroke="${flecha ? 'var(--accent-yellow)' : 'var(--text-dim)'}" stroke-width="2" marker-end="url(#fl)"/>
  <text x="132" y="99" fill="${flecha ? 'var(--accent-yellow)' : 'var(--text-dim)'}">${flecha ? 'insulina + glucosa:' : 'sin movimiento'}</text><text x="132" y="110" fill="var(--accent-yellow)">${flecha ? 'K⁺, Mg²⁺ y P entran' : ''}</text>
  <defs><marker id="fl" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="${flecha ? 'var(--accent-yellow)' : 'var(--text-dim)'}"/></marker></defs>
  <rect x="252" y="6" width="102" height="250" rx="12" fill="var(--bg-card)" stroke="var(--text-dim)"/>
  <text x="303" y="22" text-anchor="middle" fill="var(--text-main)" font-weight="700">Hueso</text>
  ${nube('ca', 30, 262, 30, 82, 130)}${nube('mg', 12, 262, 170, 82, 46)}
  <text x="303" y="232" text-anchor="middle" fill="var(--text-dim)">Ca: 99 % aquí</text><text x="303" y="246" text-anchor="middle" fill="var(--text-dim)">Mg: más de la mitad</text>
  </g>`;
}

// Fig. 36.2 viva: la curva del libro con su banda (200-400 abajo, 100-200 arriba) y el punto del paciente
export function pintarFig362(svg, s) {
  const W = 360, H = 170, x0 = 40, x1 = 345, y0 = 12, y1 = 138, kmin = 2, kmax = 7;
  const X = D => x0 + (x1 - x0) * (0.5 - D / 1500), Y = k => y1 - (y1 - y0) * (k - kmin) / (kmax - kmin);
  const pts = (m1, m2) => { let a = ''; for (let k = kmin; k <= kmax + 0.001; k += 0.25) { const D = k <= 4 ? (4 - k) * m1 : (4 - k) * m2; a += (a ? 'L' : 'M') + X(D).toFixed(1) + ' ' + Y(k).toFixed(1); } return a; };
  const k = ks(s), D = dDeKSero(Math.max(kmin, Math.min(kmax, k))), tab = deficitTabla(k);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<rect width="${W}" height="${H}" fill="var(--bg-main)"/><g font-family="system-ui,sans-serif" font-size="9.5" fill="var(--text-dim)">
  <path d="${pts(PEND.bajoMin, PEND.altoMin)}" fill="none" stroke="var(--text-dim)" stroke-dasharray="3 3"/><path d="${pts(PEND.bajoMax, PEND.altoMax)}" fill="none" stroke="var(--text-dim)" stroke-dasharray="3 3"/>
  <path d="${pts(PEND.bajo, PEND.alto)}" fill="none" stroke="var(--accent-green)" stroke-width="2"/>
  <line x1="${x0}" y1="${Y(4)}" x2="${x1}" y2="${Y(4)}" stroke="var(--text-dim)" stroke-opacity=".4"/><text x="${x0 + 2}" y="${Y(4) - 3}">normal 4</text>
  <text x="2" y="${y0 + 8}">K⁺ sérico</text><text x="${x1}" y="${H - 6}" text-anchor="end">K⁺ total del cuerpo →  (déficit a la izquierda)</text>
  <circle cx="${X(D)}" cy="${Y(Math.max(kmin, Math.min(kmax, k)))}" r="5.5" fill="var(--accent-yellow)" stroke="var(--bg-main)" stroke-width="1.5"/>
  <text x="${Math.min(X(D) + 9, 250)}" y="${Y(k) - 7}" fill="var(--text-main)">tú: K⁺ ${c(k)}</text>
  </g>`;
  return k < 3.5 ? `Tabla 36.1 (p. 22): con K⁺ ${c(k)} el déficit es de ${tab} mEq.` : '';
}

// Fig. 38.1 viva: total frente a iónico según la albúmina y el pH
export function pintarFig381(svg, s) {
  const f = caFracciones(s), W = 360, H = 150, esc = 12, bx = 90, bw = 70, y1 = 122;
  const u = v => v * esc * 0.9;
  const barra = (x, partes, tit) => { let y = y1, h = ''; for (const [v, col, rot] of partes) { const a = u(v); y -= a; h += `<rect x="${x}" y="${y.toFixed(1)}" width="${bw}" height="${a.toFixed(1)}" fill="${col}" fill-opacity=".85" stroke="var(--bg-main)"/>${a > 11 ? `<text x="${x + bw / 2}" y="${(y + a / 2 + 3).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="var(--bg-main)" font-weight="700">${rot}</text>` : ''}`; } return h + `<text x="${x + bw / 2}" y="${y1 + 13}" text-anchor="middle" font-size="9.5" fill="var(--text-main)">${tit}</text>`; };
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<rect width="${W}" height="${H}" fill="var(--bg-main)"/><g font-family="system-ui,sans-serif">
  ${barra(bx - 20, [[f.ion, 'var(--accent-green)', 'iónico'], [f.complejos, 'var(--accent-purple)', 'complejos'], [f.albumina, 'var(--accent-yellow)', 'albúmina']], 'Ca total ' + c(f.total))}
  ${barra(bx + 120, [[f.ion, 'var(--accent-green)', 'iónico']], 'Ca iónico ' + c(f.ion))}
  <text x="240" y="${y1 - 4}" font-size="9.5" fill="var(--text-dim)">mg/dL · alb. ${c(s.alb)} g/dL</text>
  </g>`;
}
