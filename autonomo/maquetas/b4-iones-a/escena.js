// La escena: plasma arriba, salidas, célula abajo, cajones hueso y tubo a la derecha, Fig. 36.2 y Fig. 38.1 vivas y el ECG.
// Las partículas son las de la leyenda común (js/core/particulas.js + js/data/formas-iones.js). El número de partículas
// sale del modelo (modelo.js); no están a escala: cada una vale lo que dice el pie.
import { svgParticula } from '../../../js/core/particulas.js';
import { N, kSer, mgSer, caFr, pSer, kTotal, curvaK, mgdl } from './modelo.js';
import { crearEcg } from './ecg.js';
const NS = 'http://www.w3.org/2000/svg';
export const Z = {
  plasma: { x: 10, y: 28, w: 250, h: 70 }, celula: { x: 10, y: 172, w: 250, h: 108 }, hueso: { x: 272, y: 112, w: 78, h: 168 },
  tubo: { x: 272, y: 28, w: 78, h: 70 },
};
const SAL = { orina: { x: 10, w: 80, n: 'Orina' }, heces: { x: 95, w: 80, n: 'Heces' }, dial: { x: 180, w: 80, n: 'Diálisis' } };
const ION = ['k', 'mg', 'ca', 'p'], R = { k: 3.6, mg: 3.9, ca: 3.9, p: 4 };
const coma = (n, d = 1) => n.toFixed(d).replace('.', ',');
const e = (tag, at = {}, hijo) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(at)) n.setAttribute(k, v); if (hijo != null) n.textContent = hijo; return n; };
const rotulo = (txt, x, y, o = {}) => e('text', { x, y, 'font-size': o.t || 9.6, fill: o.c || 'var(--text-dim)', 'text-anchor': o.a || 'start', 'font-weight': o.w || 400, ...(o.id ? { id: o.id } : {}) }, txt);
export function crearEscena(svg, { reducido = false } = {}) {
  svg.innerHTML = '';
  const fondo = (id, z, nombre, extra = '') => { const g = e('g', { id, class: 'pieza', tabindex: 0, 'data-nombre': nombre }); g.append(e('rect', { class: 'marco', x: z.x, y: z.y, width: z.w, height: z.h, rx: 10, fill: 'var(--bg-main)', stroke: 'var(--border-color)', 'stroke-width': 1.4 })); svg.append(g); return g; };
  const gPl = fondo('esc-plasma', Z.plasma, 'Plasma: lo que mide el análisis de sangre'), gCe = fondo('esc-celula', Z.celula, 'Célula: donde está casi todo el potasio');
  const gHu = fondo('esc-hueso', Z.hueso, 'Hueso: 99 % del calcio y algo más de la mitad del magnesio'), gTu = fondo('esc-tubo', Z.tubo, 'Tubo de muestra: lo que el laboratorio lee');
  gPl.append(rotulo('Plasma (lo que mide la analítica)', 16, 41, { c: 'var(--text-muted)' }));
  gCe.append(rotulo('Célula · bomba Na⁺/K⁺ al fondo', 16, 186, { c: 'var(--text-muted)' }));
  for (let i = 0; i < 4; i++) gCe.append(e('path', { d: `M${70 + i * 52} 272 l0 -10 m-4 4 l4 -4 l4 4`, stroke: 'var(--text-muted)', fill: 'none', 'stroke-width': 1.3 }));
  gHu.append(rotulo('Hueso', 311, 126, { a: 'middle', c: 'var(--text-muted)' }), rotulo('Ca 99 %', 311, 268, { a: 'middle', c: 'var(--text-dim)' }));
  const tuboL = e('g', { id: 'esc-tubo-l' }); gTu.append(rotulo('Tubo', 311, 41, { a: 'middle', c: 'var(--text-muted)' }), tuboL);
  // salidas
  for (const [c, o] of Object.entries(SAL)) {
    const g = e('g', { id: 'esc-sal-' + c, class: 'pieza', tabindex: 0, 'data-nombre': o.n + ': por aquí se pierden K⁺ y Mg²⁺' });
    g.append(e('rect', { class: 'marco', x: o.x, y: 108, width: o.w, height: 34, rx: 8, fill: 'var(--bg-main)', stroke: 'var(--border-color)', 'stroke-width': 1.2 }), rotulo(o.n, o.x + 6, 121, { c: 'var(--text-muted)' }), rotulo('', o.x + 6, 136, { id: 'esc-sal-t-' + c, c: 'var(--text-main)' }));
    svg.append(g);
  }
  // Fig. 36.2 viva
  const g362 = e('g', { id: 'esc-fig362', class: 'pieza', tabindex: 0, 'data-nombre': 'Fig. 36.2: el K⁺ sérico frente al K⁺ total del cuerpo' }); svg.append(g362);
  const CX = { x: 30, y: 330, w: 144, h: 54 }, xT = d => CX.x + CX.w * (d + 700) / 1100, yK = k => CX.y + CX.h * (1 - (k - 1) / 6.2);
  g362.append(e('rect', { class: 'marco', x: 10, y: 296, width: 170, height: 106, rx: 8, fill: 'var(--bg-main)', stroke: 'var(--border-color)', 'stroke-width': 1.2 }), rotulo('Fig. 36.2 · K⁺ sérico y total', 16, 309, { c: 'var(--text-muted)' }),
    e('path', { d: `M${CX.x} ${CX.y} V${CX.y + CX.h} H${CX.x + CX.w}`, stroke: 'var(--text-muted)', fill: 'none', 'stroke-width': 1 }));
  let dc = ''; for (let d = -700; d <= 400; d += 25) dc += (d === -700 ? 'M' : 'L') + xT(d).toFixed(1) + ' ' + yK(curvaK(d)).toFixed(1);
  g362.append(e('path', { d: dc, stroke: 'var(--accent-yellow)', fill: 'none', 'stroke-width': 2 }), e('line', { x1: xT(0), x2: xT(0), y1: CX.y, y2: CX.y + CX.h, stroke: 'var(--border-color)', 'stroke-dasharray': '2 3' }));
  const punto = e('circle', { id: 'esc-punto', r: 4.6, fill: 'var(--accent-red)', stroke: 'var(--bg-main)', 'stroke-width': 1.5 }); g362.append(punto);
  g362.append(rotulo('déficit ←  total  → exceso', 102, 394, { a: 'middle', c: 'var(--text-dim)' }), rotulo('', 16, 322, { id: 'esc-f362-t', c: 'var(--text-main)' }));
  // Fig. 38.1 viva
  const g381 = e('g', { id: 'esc-fig381', class: 'pieza', tabindex: 0, 'data-nombre': 'Fig. 38.1: las tres fracciones del calcio del plasma' }); svg.append(g381);
  g381.append(e('rect', { class: 'marco', x: 188, y: 296, width: 162, height: 106, rx: 8, fill: 'var(--bg-main)', stroke: 'var(--border-color)', 'stroke-width': 1.2 }), rotulo('Fig. 38.1 · Ca del plasma', 194, 309, { c: 'var(--text-muted)' }));
  const barras = e('g', { id: 'esc-barras' }); g381.append(barras);
  // ECG
  const gE = e('g', { id: 'esc-ecg', class: 'pieza', tabindex: 0, 'data-nombre': 'ECG: el del ritmo vivo, derivación II' }); svg.append(gE);
  gE.append(e('rect', { class: 'marco', x: 10, y: 410, width: 340, height: 86, rx: 8, fill: 'var(--bg-main)', stroke: 'var(--border-color)', 'stroke-width': 1.2 }), rotulo('ECG · derivación II', 16, 423, { c: 'var(--text-muted)' }));
  const eEstado = rotulo('', 344, 423, { a: 'end', c: 'var(--text-dim)' }); gE.append(eEstado);
  const gTraza = e('g'); gE.append(gTraza);
  const ecg = crearEcg(gTraza, { x: 14, y: 426, w: 332, h: 66 });
  const capa = e('g', { id: 'esc-particulas' }); svg.append(capa);
  // ---------- partículas ----------
  const P = []; const pz = (z, m = 5) => ({ x0: z.x + m, y0: z.y + (z === Z.celula || z === Z.plasma ? 18 : 16), x1: z.x + z.w - m, y1: z.y + z.h - (z === Z.celula ? 14 : m) });
  const caja = { plasma: pz(Z.plasma), celula: pz(Z.celula), hueso: { ...pz(Z.hueso), y1: Z.hueso.y + Z.hueso.h - 22 } };
  const azar = (a, b) => a + Math.random() * (b - a);
  function nueva(clave, zona, desde) {
    const c = caja[zona], q = { clave, zona, x: desde ? desde.x : azar(c.x0, c.x1), y: desde ? desde.y : azar(c.y0, c.y1), vx: azar(-9, 9), vy: azar(-9, 9), dest: null, sal: null, el: e('g') };
    q.el.innerHTML = svgParticula(clave, 0, 0, R[clave]); q.el.setAttribute('transform', `translate(${q.x} ${q.y})`); capa.append(q.el); P.push(q); return q;
  }
  const objetivo = s => {
    const k = kSer(s), cel = 36 + Math.round((s.kDef + s.kShift) / 12);
    return { plasma: { k: Math.round(k * 2), mg: Math.round(mgSer(s) * 2.4), ca: Math.round(caFr(s).ion * 3.6), p: Math.max(1, Math.round(pSer(s) * 1.4)) },
      celula: { k: Math.max(2, cel), mg: Math.max(1, 8 - Math.round(s.mgDef / 15) + Math.round(s.mgShift * 20)), ca: 2, p: Math.max(1, 7 + Math.round(s.pShift * 8) - Math.round((N.p - s.p0) * 2.5)) },
      hueso: { k: 0, mg: 7, ca: 16, p: 7 } };
  };
  function sync(s) {
    const o = objetivo(s);
    for (const ion of ION) {
      const exceso = [], falta = [];
      for (const z of Object.keys(caja)) {
        const lista = P.filter(q => q.clave === ion && (q.dest || q.zona) === z && !q.sal), d = o[z][ion] - lista.length;
        if (d < 0) exceso.push(...lista.filter(q => !q.dest).slice(0, -d)); else for (let i = 0; i < d; i++) falta.push(z);
      }
      for (const z of falta) {
        const q = exceso.pop();
        if (q) { q.dest = z; } else if (z === 'plasma') nueva(ion, 'plasma', { x: azar(30, 240), y: Z.plasma.y + 4 }).dest = 'plasma'; else nueva(ion, z);
      }
      for (const q of exceso) { if (q.zona === 'plasma') q.sal = 'orina'; else { q.el.remove(); P.splice(P.indexOf(q), 1); } }
    }
  }
  const sino = (q) => (q.sal && q.sal !== 'plasma') ? { x: SAL[q.sal].x + SAL[q.sal].w / 2, y: 126 } : null;
  function mover(dt) {
    for (let i = P.length - 1; i >= 0; i--) {
      const q = P[i], c = caja[q.zona]; let tx = null, ty = null;
      if (q.dest) { const d = caja[q.dest]; if (q.tx == null) { q.tx = azar(d.x0, d.x1); q.ty = azar(d.y0, d.y1); } tx = q.tx; ty = q.ty; }
      else if (q.sal && q.sal !== 'plasma') { const s = sino(q); tx = s.x; ty = s.y; }
      if (tx != null) {
        const dx = tx - q.x, dy = ty - q.y, L = Math.hypot(dx, dy), pas = (reducido ? 400 : 85) * dt;
        if (L <= pas) { q.x = tx; q.y = ty; if (q.dest) { q.zona = q.dest; q.dest = null; q.tx = null; } else { q.el.remove(); P.splice(i, 1); continue; } } else { q.x += dx / L * pas; q.y += dy / L * pas; }
      } else if (!reducido) {
        q.x += q.vx * dt; q.y += q.vy * dt;
        if (q.x < c.x0 || q.x > c.x1) { q.vx = -q.vx; q.x = Math.min(c.x1, Math.max(c.x0, q.x)); } if (q.y < c.y0 || q.y > c.y1) { q.vy = -q.vy; q.y = Math.min(c.y1, Math.max(c.y0, q.y)); }
      }
      q.el.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
    }
  }
  // ---------- lecturas ----------
  function pintar(s, extra) {
    const k = kSer(s), f = caFr(s);
    const d = s.kDef; punto.setAttribute('cx', xT(d).toFixed(1)); punto.setAttribute('cy', yK(Math.min(7.2, Math.max(1, k))).toFixed(1));
    svg.querySelector('#esc-f362-t').textContent = `K⁺ ${coma(k)} · total ${s.kDef > 0 ? '+' : s.kDef < 0 ? '−' : ''}${Math.abs(Math.round(s.kDef))}`;
    barras.innerHTML = '';
    const H = 70, y0 = 384, sc = H / 2.8, col = (x, fr, trazo) => { let y = y0; for (const [v, c, n] of [[fr.ion, 'var(--text-main)', 'iónico'], [fr.alb, 'var(--accent-purple)', 'albúmina'], [fr.comp, 'var(--text-muted)', 'aniones']]) { const h = v * sc; y -= h; barras.append(e('rect', { x, y, width: 26, height: h, fill: c, opacity: .75, stroke: 'var(--bg-main)', 'stroke-width': trazo })); } };
    col(198, caFr({ ...s, alb: N.alb, ph: N.ph, cit: 0, caPico: 0 }), 0.6); barras.lastChild.setAttribute('stroke-dasharray', '2 2');
    col(228, f, 0.6);
    barras.append(rotulo('normal', 211, 396, { a: 'middle' }), rotulo('ahora', 241, 396, { a: 'middle' }),
      rotulo(`ión ${coma(f.ion, 2)} mmol/L`, 262, 322, { c: 'var(--text-main)' }), rotulo(`total ${coma(mgdl(f.total))} mg/dL`, 262, 336, { c: 'var(--text-dim)' }), rotulo('+ albúmina', 262, 350, { c: 'var(--accent-purple)' }), rotulo('+ aniones', 262, 364, { c: 'var(--text-muted)' }));
    tuboL.innerHTML = '';
    [['K⁺', coma(extra.kMed), 'mEq/L'], ['Mg²⁺', coma(mgSer(s)), 'mEq/L'], ['Ca ión', coma(f.ion, 2), 'mmol/L'], ['P', coma(pSer(s)), 'mg/dL']].forEach(([n, v, u], i) => {
      tuboL.append(rotulo(n, 278, 55 + i * 11.5, { c: 'var(--text-muted)' }), rotulo(v, 346, 55 + i * 11.5, { a: 'end', c: 'var(--text-main)', w: 600 }));
    });
    for (const c of ['orina', 'heces', 'dial']) svg.querySelector('#esc-sal-t-' + c).textContent = c === 'orina' ? `K ${Math.round(s.orina.k)} · Mg ${Math.round(s.orina.mg)} mEq` : '—';
    eEstado.textContent = extra.estadoEcg || '';
  }
  return { sync, mover, pintar, ecg, el: svg, Z };
}
