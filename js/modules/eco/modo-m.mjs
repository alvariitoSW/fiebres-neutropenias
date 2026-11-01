// Modo M: el barrido en el tiempo de una línea del modo B, y los calibres para medir sobre él.
//
// Cada columna sale de UNA imagen B (ecografia.mjs, im.columna): misma vista, mismo corte, mismo instante. Así el
// modo M nunca se adelanta ni se retrasa respecto al corazón y a la eco. La columna se coloca según el tiempo del
// motor (no según el fotograma): con pocas imágenes por segundo, cada una ocupa más ancho, pero el eje de tiempo
// sigue siendo real.
//
// Dos lienzos superpuestos: `lienzo` guarda el trazado (solo se pintan las columnas nuevas) y `capa` lleva lo que
// cambia sin tocar el trazado (escala, cursor de escritura, calibres).
//
// El mismo barrido sirve para el espectro del Doppler pulsado (doppler.mjs): con { eje: 'vel' } el eje vertical son
// velocidades (cm/s, positivas hacia la sonda, arriba de la línea de base) y los calibres miden velocidad y tiempo.

export const BARRIDO = 2;          // s de tiempo del motor que caben en la pantalla (por defecto; setBarrido lo cambia)
const HUECO = 0.04;                // fracción borrada delante del cursor, como en los monitores

export function crearModoM(lienzo, capa, { onMedida, eje = 'prof' } = {}) {
  const ctx = lienzo.getContext('2d'), cc = capa.getContext('2d');
  let prof = 160, vmax = 100, base = 0.5, barrido = BARRIDO, img = null, W = 0, H = 0, xPrev = null, tPrev = null, tEscrito = null, colPrev = null;
  let A = null, B = null, activo = null;           // calibres en fracciones del lienzo { x, y }

  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.round(lienzo.clientWidth * dpr);
    if (!w || w === W) return false;
    W = w; H = Math.round(w * 0.55);
    for (const c of [lienzo, capa]) { c.width = W; c.height = H; }
    img = ctx.createImageData(W, H); limpiar(); return true;
  }
  // borra el trazado y, con él, los calibres: medían sobre lo borrado (y con otra escala o profundidad, si cambió)
  function limpiar() {
    if (img) { img.data.fill(0); for (let i = 3; i < img.data.length; i += 4) img.data[i] = 255; ctx.putImageData(img, 0, 0); }
    const habia = A || B; A = B = null; activo = null;
    xPrev = null; tPrev = null; tEscrito = null; colPrev = null; dibujarCapa();
    if (habia) onMedida?.(null);
  }
  function setProf(p) { if (p !== prof) { prof = p; limpiar(); } }
  // segundos que caben en la pantalla: la VCI necesita ver una respiración entera (4 s en el modelo)
  function setBarrido(s) { if (s !== barrido) { barrido = s; limpiar(); } }
  // Doppler: escala de ±vmax cm/s con la línea de base en el centro
  function setEscala(v) { if (v !== vmax) { vmax = v; limpiar(); } }
  // la línea de base se puede subir o bajar (fracción de la altura desde arriba; 0,5 = centro) como en los ecógrafos: con un chorro
  // que se aleja de la sonda (IT, IM) se sube, y la pantalla no queda medio vacía. La escala sigue siendo ±vmax con la base al centro.
  function setBase(b) { if (b !== base) { base = b; limpiar(); } }
  const velDeY = (y) => 2 * vmax * (base - y), yDeVel = (v) => base - v / (2 * vmax);

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

  /** Añade la columna del instante t (s, tiempo del motor); columna(filas) → RGB por fila.
   *  Modo M (eje 'prof'): entre la columna anterior y esta se pintan las de cada 2 ms (muestreo del motor) con el desplazamiento
   *  de cada tramo de pared interpolado (emparejado por bloques), para que las paredes tracen una curva y no escalones. */
  function anadir(t, columna) {
    if (!img) return;
    // si ha pasado más de un barrido o el tiempo ha ido hacia atrás (otro escenario), se empieza de cero
    if (tPrev == null || t < tPrev || t - tPrev > barrido * 0.5) { xPrev = null; colPrev = null; }
    const col = columna(H);
    if (eje === 'prof' && colPrev && colPrev.length === col.length && t - tPrev > 0.004) {
      const n = Math.min(40, Math.round((t - tPrev) / 0.002)), d = desplazamientos(colPrev, col);
      for (let i = 1; i <= n; i++) { const k = i / n; pintarColumna(tPrev + (t - tPrev) * k, interpolar(colPrev, col, d, k)); }
    } else pintarColumna(t, col);
    colPrev = col; tPrev = t; tEscrito = t; dibujarCapa();
  }
  /** Varias columnas de golpe [{ t, columna }] en orden de tiempo (el espectro: una por muestra del motor); la capa se redibuja una vez. */
  function anadirLote(lote) {
    if (!img || !lote.length) return;
    if (tPrev == null || lote[0].t < tPrev || lote[0].t - tPrev > barrido * 0.5) { xPrev = null; colPrev = null; }
    let ult = tPrev ?? -Infinity;
    for (const { t, columna } of lote) { if (t <= ult) continue; pintarColumna(t, columna(H)); ult = t; }   // nunca hacia atrás: pintarTramo lo tomaría por una vuelta entera
    tPrev = ult; tEscrito = tPrev; dibujarCapa();
  }
  function pintarColumna(t, col) {
    const x = Math.floor(((t % barrido) / barrido) * W) % W;
    // misma x que la columna anterior (2 ms son menos de un píxel): se repinta esa x; si no, el tramo iría «hacia atrás» y daría la vuelta entera
    pintarTramo(xPrev == null || x === xPrev ? x : (xPrev + 1) % W, x, col);
    xPrev = x;
  }
  // desplazamiento (filas) de cada fila entre dos columnas: mejor coincidencia de la luminancia en un bloque de ±7 filas, buscando ±MAXD
  const MAXD = 14;
  function desplazamientos(a, b) {
    const n = a.length / 3, d = new Int8Array(n), la = new Float32Array(n), lb = new Float32Array(n);
    for (let y = 0; y < n; y++) { la[y] = a[3 * y]; lb[y] = b[3 * y]; }
    for (let y = 0; y < n; y += 2) {
      let mejor = 0, em = Infinity;
      for (let s = -MAXD; s <= MAXD; s++) { let e = 0;
        for (let j = -7; j <= 7; j += 2) { const ya = Math.min(n - 1, Math.max(0, y + j)), yb = Math.min(n - 1, Math.max(0, y + j + s)); const q = la[ya] - lb[yb]; e += q * q; }
        e += 4 * Math.abs(s); if (e < em) { em = e; mejor = s; } }
      d[y] = mejor; if (y + 1 < n) d[y + 1] = mejor;
    }
    return d;
  }
  // columna intermedia (k de 0 a 1): lo de la anterior que avanzó k·d y lo de la nueva que le falta (1−k)·d, mezclado
  function interpolar(a, b, d, k) {
    const n = a.length / 3, out = new Uint8ClampedArray(a.length), cl = (v) => Math.min(n - 1, Math.max(0, Math.round(v)));
    for (let y = 0; y < n; y++) { const ya = cl(y - k * d[y]), yb = cl(y + (1 - k) * d[y]);
      for (let c = 0; c < 3; c++) out[3 * y + c] = (1 - k) * a[3 * ya + c] + k * b[3 * yb + c]; }
    return out;
  }

  // ---- capa: escala de profundidad (cm), marcas de tiempo, cursor y calibres
  function dibujarCapa() {
    if (!W) return;
    const k = W / (capa.clientWidth || W);
    cc.clearRect(0, 0, W, H);
    cc.fillStyle = 'rgba(220,214,196,.75)'; cc.font = `${Math.round(10 * k)}px system-ui,sans-serif`; cc.textAlign = 'right'; cc.textBaseline = 'middle';
    if (eje === 'vel') {
      // línea de base y marcas: cada 100 cm/s (1 m/s, como Zoghbi 2017 Fig. 29) con ±500; en escalas menores cada 50 o 20 según quepa (≥ 16 px entre rótulos de 10 px)
      const pxCm = (capa.clientHeight || H) / (2 * vmax), paso = [20, 50, 100, 200].find(p => p * pxCm >= 16) ?? 200;
      cc.fillRect(0, yDeVel(0) * H - 0.5 * k, W, 1 * k);
      for (let v = paso; v < 2 * vmax; v += paso) for (const sg of [1, -1]) { const y = yDeVel(sg * v) * H; if (y < 8 * k || y > H - 8 * k) continue; cc.fillRect(W - 6 * k, y - 0.5 * k, 6 * k, 1 * k); cc.fillText((sg * v) + '', W - 9 * k, y); }
      cc.textAlign = 'left'; cc.fillText('cm/s', 4 * k, 9 * k);
    } else for (let cm = 1; cm * 10 < prof; cm++) { const y = cm * 10 / prof * H; cc.fillRect(W - (cm % 5 ? 4 : 8) * k, y - 0.5 * k, (cm % 5 ? 4 : 8) * k, 1 * k);
      if (cm % 5 === 0) cc.fillText(cm + ' cm', W - 10 * k, y); }
    cc.textAlign = 'center'; cc.textBaseline = 'bottom';
    // marcas de tiempo: cada 0,1 s (larga cada 0,5 s); con barridos largos, cada 0,5 s (larga cada segundo)
    const pasoT = barrido > 3 ? 0.5 : 0.1, cadaLarga = barrido > 3 ? 2 : 5;
    for (let i = 1; i < barrido / pasoT; i++) { const x = i * pasoT / barrido * W, largo = i % cadaLarga === 0;
      cc.fillRect(x - 0.5 * k, H - (largo ? 7 : 4) * k, 1 * k, (largo ? 7 : 4) * k); }
    if (tEscrito != null) { const x = ((tEscrito % barrido) / barrido) * W; cc.fillStyle = 'rgba(212,175,55,.85)'; cc.fillRect(x, 0, 1.5 * k, H); }
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

  /** La medida entre los dos calibres: { mm (vertical), ms (horizontal) } o null; en Doppler, { va, vb (cm/s), ms }. */
  const medida = () => (!(A && B) ? null : eje === 'vel'
    ? { va: velDeY(A.y), vb: velDeY(B.y), ms: Math.abs(A.x - B.x) * barrido * 1000 }
    : { mm: Math.abs(A.y - B.y) * prof, ms: Math.abs(A.x - B.x) * barrido * 1000 });

  // ---- tocar: el primer toque pone A, el segundo B; con los dos puestos, tocar cerca de uno lo arrastra; un tercero vuelve a empezar
  const punto = (ev) => { const r = capa.getBoundingClientRect(); return { x: Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)) }; };
  const cerca = (p, q) => q && Math.hypot((p.x - q.x) * capa.clientWidth, (p.y - q.y) * capa.clientHeight) < 22;
  capa.addEventListener('pointerdown', (ev) => {
    const p = punto(ev);
    // con un solo calibre, el segundo toque pone siempre B (la VCI mide ≈10 px/cm: dos paredes quedan a <22 px)
    if (A && B && cerca(p, A)) activo = 'A'; else if (A && B && cerca(p, B)) activo = 'B';
    else if (!A || (A && B)) { A = p; B = null; activo = 'A'; } else { B = p; activo = 'B'; }
    if (activo === 'A') A = p; else B = p;
    capa.setPointerCapture?.(ev.pointerId); dibujarCapa(); onMedida?.(medida());
  });
  capa.addEventListener('pointermove', (ev) => { if (!activo) return; const p = punto(ev); if (activo === 'A') A = p; else B = p; dibujarCapa(); onMedida?.(medida()); });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) capa.addEventListener(t, () => { activo = null; });

  function borrarCalibres() { A = B = null; dibujarCapa(); onMedida?.(null); }
  return { ajustar, limpiar, setProf, setEscala, setBase, setBarrido, anadir, anadirLote, medida, borrarCalibres, dibujarCapa,
    // para las pruebas: poner los calibres en coordenadas del lienzo (0-1)
    ponerCalibres(a, b) { A = a; B = b; dibujarCapa(); onMedida?.(medida()); },
    get estado() { return { W, H, prof, vmax, base, barrido, tEscrito, columnas: xPrev } }, };
}
