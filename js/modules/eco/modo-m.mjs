// Modo M: el barrido en el tiempo de una línea del modo B, y los calibres para medir sobre él.
//
// Cada columna sale de UNA imagen B (ecografia.mjs, im.columna): misma vista, mismo corte, mismo instante. Así el
// modo M nunca se adelanta ni se retrasa respecto al corazón y a la eco. La columna se coloca según el tiempo del
// motor (no según el fotograma): con pocas imágenes por segundo, cada una ocupa más ancho, pero el eje de tiempo
// sigue siendo real.
//
// Dos lienzos superpuestos: `lienzo` guarda el trazado (solo se pintan las columnas nuevas) y `capa` lleva lo que
// cambia sin tocar el trazado (escala, cursor de escritura, calibres).

export const BARRIDO = 2;          // s de tiempo del motor que caben en la pantalla
const HUECO = 0.04;                // fracción borrada delante del cursor, como en los monitores

export function crearModoM(lienzo, capa, { onMedida } = {}) {
  const ctx = lienzo.getContext('2d'), cc = capa.getContext('2d');
  let prof = 160, img = null, W = 0, H = 0, xPrev = null, tPrev = null, tEscrito = null;
  let A = null, B = null, activo = null;           // calibres en fracciones del lienzo { x, y }

  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.round(lienzo.clientWidth * dpr);
    if (!w || w === W) return false;
    W = w; H = Math.round(w * 0.55);
    for (const c of [lienzo, capa]) { c.width = W; c.height = H; }
    img = ctx.createImageData(W, H); limpiar(); return true;
  }
  function limpiar() {
    if (img) { img.data.fill(0); for (let i = 3; i < img.data.length; i += 4) img.data[i] = 255; ctx.putImageData(img, 0, 0); }
    xPrev = null; tPrev = null; tEscrito = null; dibujarCapa();
  }
  function setProf(p) { if (p !== prof) { prof = p; limpiar(); } }

  // pinta la columna en las x de [x0, x1] (con vuelta al principio) y borra un hueco por delante
  function pintarTramo(x0, x1, col) {
    const d = img.data;
    const pintar = (a, b) => { for (let x = a; x <= b; x++) for (let y = 0; y < H; y++) { const o = 4 * (y * W + x); d[o] = col[3 * y]; d[o + 1] = col[3 * y + 1]; d[o + 2] = col[3 * y + 2]; } };
    const borrar = (a, b) => { for (let x = a; x <= b; x++) for (let y = 0; y < H; y++) { const o = 4 * (y * W + x); d[o] = d[o + 1] = d[o + 2] = 0; } };
    const tramos = x1 >= x0 ? [[x0, x1]] : [[x0, W - 1], [0, x1]];
    for (const [a, b] of tramos) pintar(a, b);
    const h0 = (x1 + 1) % W, h1 = (x1 + Math.round(HUECO * W)) % W;
    const huecos = h1 >= h0 ? [[h0, h1]] : [[h0, W - 1], [0, h1]];
    for (const [a, b] of huecos) borrar(a, b);
    for (const [a, b] of [...tramos, ...huecos]) ctx.putImageData(img, 0, 0, a, 0, b - a + 1, H);
  }

  /** Añade la columna del instante t (s, tiempo del motor); columna(filas) → RGB por fila. */
  function anadir(t, columna) {
    if (!img) return;
    const x = Math.floor(((t % BARRIDO) / BARRIDO) * W) % W;
    // si ha pasado más de un barrido o el tiempo ha ido hacia atrás (otro escenario), se empieza de cero
    if (tPrev == null || t < tPrev || t - tPrev > BARRIDO * 0.5) { xPrev = null; }
    const col = columna(H);
    pintarTramo(xPrev == null ? x : (xPrev + 1) % W, x, col);
    xPrev = x; tPrev = t; tEscrito = t; dibujarCapa();
  }

  // ---- capa: escala de profundidad (cm), marcas de tiempo, cursor y calibres
  function dibujarCapa() {
    if (!W) return;
    const k = W / (capa.clientWidth || W);
    cc.clearRect(0, 0, W, H);
    cc.fillStyle = 'rgba(220,214,196,.75)'; cc.font = `${Math.round(10 * k)}px system-ui,sans-serif`; cc.textAlign = 'right'; cc.textBaseline = 'middle';
    for (let cm = 1; cm * 10 < prof; cm++) { const y = cm * 10 / prof * H; cc.fillRect(W - (cm % 5 ? 4 : 8) * k, y - 0.5 * k, (cm % 5 ? 4 : 8) * k, 1 * k);
      if (cm % 5 === 0) cc.fillText(cm + ' cm', W - 10 * k, y); }
    cc.textAlign = 'center'; cc.textBaseline = 'bottom';
    for (let i = 1; i < BARRIDO / 0.1; i++) { const x = i * 0.1 / BARRIDO * W, largo = i % 5 === 0;
      cc.fillRect(x - 0.5 * k, H - (largo ? 7 : 4) * k, 1 * k, (largo ? 7 : 4) * k); }
    if (tEscrito != null) { const x = ((tEscrito % BARRIDO) / BARRIDO) * W; cc.fillStyle = 'rgba(212,175,55,.85)'; cc.fillRect(x, 0, 1.5 * k, H); }
    // calibres: cruces amarillas; la línea entre ellas con sus dos componentes (vertical = mm, horizontal = ms)
    if (A) cruz(A, k); if (B) cruz(B, k);
    if (A && B) {
      cc.strokeStyle = 'rgba(212,175,55,.9)'; cc.setLineDash([4 * k, 3 * k]); cc.lineWidth = 1.2 * k;
      cc.beginPath(); cc.moveTo(A.x * W, A.y * H); cc.lineTo(A.x * W, B.y * H); cc.lineTo(B.x * W, B.y * H); cc.stroke(); cc.setLineDash([]);
    }
  }
  function cruz(p, k) {
    const x = p.x * W, y = p.y * H, r = 7 * k;
    cc.strokeStyle = '#000'; cc.lineWidth = 3.5 * k; cc.beginPath(); cc.moveTo(x - r, y); cc.lineTo(x + r, y); cc.moveTo(x, y - r); cc.lineTo(x, y + r); cc.stroke();
    cc.strokeStyle = '#f1c94a'; cc.lineWidth = 1.6 * k; cc.beginPath(); cc.moveTo(x - r, y); cc.lineTo(x + r, y); cc.moveTo(x, y - r); cc.lineTo(x, y + r); cc.stroke();
  }

  /** La medida entre los dos calibres: { mm (vertical), ms (horizontal) } o null. */
  const medida = () => (A && B ? { mm: Math.abs(A.y - B.y) * prof, ms: Math.abs(A.x - B.x) * BARRIDO * 1000 } : null);

  // ---- tocar: el primer toque pone A, el segundo B; tocar cerca de uno lo arrastra; un tercero vuelve a empezar
  const punto = (ev) => { const r = capa.getBoundingClientRect(); return { x: Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)) }; };
  const cerca = (p, q) => q && Math.hypot((p.x - q.x) * capa.clientWidth, (p.y - q.y) * capa.clientHeight) < 22;
  capa.addEventListener('pointerdown', (ev) => {
    const p = punto(ev);
    if (cerca(p, A)) activo = 'A'; else if (cerca(p, B)) activo = 'B';
    else if (!A || (A && B)) { A = p; B = null; activo = 'A'; } else { B = p; activo = 'B'; }
    if (activo === 'A') A = p; else B = p;
    capa.setPointerCapture?.(ev.pointerId); dibujarCapa(); onMedida?.(medida());
  });
  capa.addEventListener('pointermove', (ev) => { if (!activo) return; const p = punto(ev); if (activo === 'A') A = p; else B = p; dibujarCapa(); onMedida?.(medida()); });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) capa.addEventListener(t, () => { activo = null; });

  function borrarCalibres() { A = B = null; dibujarCapa(); onMedida?.(null); }
  return { ajustar, limpiar, setProf, anadir, medida, borrarCalibres, dibujarCapa,
    // para las pruebas: poner los calibres en coordenadas del lienzo (0-1)
    ponerCalibres(a, b) { A = a; B = b; dibujarCapa(); onMedida?.(medida()); },
    get estado() { return { W, H, prof, tEscrito, columnas: xPrev } }, };
}
