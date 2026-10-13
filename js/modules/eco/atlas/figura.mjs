// Piezas comunes de las figuras del Atlas de ecocardiografía: lienzo con la densidad de la pantalla, colores de los
// tokens de la app, mandos (deslizador, botones segmentados, casilla) y lecturas. Cada capítulo con figura propia
// (pulso.mjs, imagen.mjs, efecto-doppler.mjs, ciclo.mjs, asa.mjs) exporta montar(contenedor) → { parar() } y usa esto.
// Sin estado global: cada figura guarda el suyo.

const coma = (x, d = 0) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',') : '—');
export { coma };

/** Colores del tema, leídos del propio contenedor (dentro de .cv-sim, que traduce los tokens de la app). */
export function colores(el) {
  const cs = getComputedStyle(el), v = (n) => cs.getPropertyValue(n).trim();
  return { bg: v('--bg'), text: v('--text'), muted: v('--muted'), line: v('--line'),
    g: v('--g'), r: v('--r'), y: v('--y'), b: v('--b'), p: v('--p') };
}

/** Un <canvas> de ancho CSS 100% con alto relativo; redimensiona a la densidad de la pantalla. */
export function lienzo(padre, proporcion = 0.62, etiqueta = '') {
  const c = document.createElement('canvas');
  c.className = 'at-lienzo';
  if (etiqueta) { c.setAttribute('role', 'img'); c.setAttribute('aria-label', etiqueta); }
  padre.appendChild(c);
  const ajustar = () => {
    const w = Math.max(280, c.clientWidth || padre.clientWidth || 340), dpr = Math.min(3, window.devicePixelRatio || 1);
    const ancho = Math.round(w * dpr), alto = Math.round(w * proporcion * dpr);
    if (c.width !== ancho || c.height !== alto) { c.width = ancho; c.height = alto; return true; }
    return false;
  };
  ajustar();
  // k: píxeles del lienzo por píxel CSS (letra y grosores van en px CSS × k)
  return { c, ctx: c.getContext('2d'), ajustar, get k() { return c.width / (c.clientWidth || 340); },
    get W() { return c.width; }, get H() { return c.height; } };
}

/** Texto con halo del color de fondo, para que se lea aunque lo cruce una curva. */
export function texto(ctx, t, x, y, color, k, { tam = 10, peso = '', alinear = 'left', halo = null } = {}) {
  ctx.save(); ctx.font = `${peso} ${tam * k}px Georgia`.trim(); ctx.textAlign = alinear;
  if (halo) { ctx.lineJoin = 'round'; ctx.lineWidth = 3 * k; ctx.strokeStyle = halo; ctx.strokeText(t, x, y); }
  ctx.fillStyle = color; ctx.fillText(t, x, y); ctx.restore();
}

/** Deslizador con su valor; onInput(valor) en cada cambio. */
export function deslizador(padre, { etiqueta, min, max, paso, valor, fmt = (v) => v, onInput, marcas }) {
  const id = 'at-' + Math.random().toString(36).slice(2, 9);
  const d = document.createElement('div'); d.className = 'at-mando';
  d.innerHTML = `<label for="${id}">${etiqueta} <output></output></label>
    <input type="range" id="${id}" min="${min}" max="${max}" step="${paso}" value="${valor}">
    ${marcas ? `<div class="at-marcas" aria-hidden="true">${marcas.map(m => `<span>${m}</span>`).join('')}</div>` : ''}`;
  padre.appendChild(d);
  const inp = d.querySelector('input'), out = d.querySelector('output');
  const pinta = () => { out.textContent = fmt(Number(inp.value)); };
  inp.addEventListener('input', () => { pinta(); onInput(Number(inp.value)); });
  pinta();
  return { el: inp, set(v) { inp.value = v; pinta(); }, get valor() { return Number(inp.value); } };
}

/** Botones segmentados (uno activo). opciones: [[valor, texto], …]. */
export function segmentos(padre, { etiqueta, opciones, valor, onChange }) {
  const d = document.createElement('div'); d.className = 'at-mando';
  d.innerHTML = `<span class="at-etq">${etiqueta}</span><div class="cv-fila at-seg" role="group" aria-label="${etiqueta}">${
    opciones.map(([v, t]) => `<button type="button" class="cv-mini" data-v="${v}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  padre.appendChild(d);
  const marcar = (v) => d.querySelectorAll('button').forEach(b => { const on = b.dataset.v === String(v); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  d.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (!b) return; marcar(b.dataset.v); onChange(b.dataset.v); });
  marcar(valor);
  return { set: marcar };
}

/** Casilla; onChange(marcada). */
export function casilla(padre, { etiqueta, valor = false, onChange }) {
  const l = document.createElement('label'); l.className = 'cv-mini at-casilla';
  l.innerHTML = `<input type="checkbox" ${valor ? 'checked' : ''}> ${etiqueta}`;
  padre.appendChild(l);
  const inp = l.querySelector('input');
  inp.addEventListener('change', () => onChange(inp.checked));
  return { el: inp };
}

/** Lista de lecturas: pintar([{ k, v, u, aviso, fuente }]). fuente: 'modelo' | 'ilustrativo' | 'fórmula'. */
export function lecturas(padre) {
  const dl = document.createElement('dl'); dl.className = 'at-lecturas'; padre.appendChild(dl);
  let ultima = '';
  return {
    pintar(filas) {
      const html = filas.map(f => `<div class="at-lectura${f.aviso ? ' aviso' : ''}"><dt>${f.k}</dt><dd>${f.v}${f.u ? ` <small>${f.u}</small>` : ''}${
        f.fuente ? ` <span class="at-fuente-lectura">${f.fuente}</span>` : ''}</dd></div>`).join('');
      if (html !== ultima) { dl.innerHTML = html; ultima = html; }
    },
  };
}

/** Párrafo "en vivo" bajo la figura: explica lo que se ve con los mandos actuales. */
export function enVivo(padre) {
  const p = document.createElement('p'); p.className = 'at-vivo'; p.setAttribute('aria-live', 'polite'); padre.appendChild(p);
  let ultima = '';
  return { pintar(html) { if (html !== ultima) { p.innerHTML = html; ultima = html; } } };
}

/** Bucle de animación que solo corre mientras el elemento está en pantalla y la pestaña visible. */
export function animar(el, paso) {
  let visible = false, id = 0, t0 = 0, vivo = true;
  const bucle = (t) => { if (!vivo) return; const dt = t0 ? Math.min(0.05, (t - t0) / 1000) : 0; t0 = t; paso(dt); id = requestAnimationFrame(bucle); };
  const arrancar = () => { if (!id && visible && !document.hidden && vivo) { t0 = 0; id = requestAnimationFrame(bucle); } };
  const parar = () => { if (id) cancelAnimationFrame(id); id = 0; };
  const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible ? arrancar() : parar(); });
  io.observe(el);
  const vis = () => (document.hidden ? parar() : arrancar());
  document.addEventListener('visibilitychange', vis);
  return { parar() { vivo = false; parar(); io.disconnect(); document.removeEventListener('visibilitychange', vis); } };
}

export const reducirMovimiento = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
