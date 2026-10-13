// Atlas · 02 Imagen: una imagen sectorial hecha línea a línea, su frecuencia de imagen y cuatro artefactos.
// Reconstruido para la app (idea de The Heart by Ultrasound, cap. 02, sin su código). El maniquí es un eje corto del VI
// (cavidad con pared), un reflector fuerte superficial, una calcificación y la pleura; ilustrativo.
// La física (tiempo por línea = 2 × profundidad ÷ c; una imagen = líneas × zonas focales × tiempo por línea) es exacta.
import { lienzo, colores, texto, deslizador, segmentos, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

const C = 1540;

/** Frecuencia de imagen. Pura: la usan la figura y las pruebas. densidad en líneas por grado. */
export function frecuenciaImagen(profCm, sectorGrados, densidad, zonas = 1) {
  const lineas = Math.max(8, Math.round(sectorGrados * densidad));
  const tLinea = 2 * (profCm / 100) / C;           // s
  const tImagen = lineas * zonas * tLinea;
  return { lineas, tLinea, tImagen, fps: 1 / tImagen };
}

// Maniquí en coordenadas cartesianas (cm; x lateral, y profundidad), devuelve ecogenicidad 0-1
const VI = { x: 0.4, y: 8.5, r: 2.6, pared: 0.95 };
const REFL_SUP = { y: 2.6, x0: -1.2, x1: 1.2 };          // reflector fuerte superficial (p. ej. un anillo protésico)
const PARED = 1.6;                                       // pared torácica hasta 1,6 cm
const CALCIO = { x: -2.2, y: 3.9, r: 0.35 };
const PLEURA = 12.6;
function maniqui(x, y) {
  if (y < PARED) return 0.45 + 0.25 * Math.sin(y * 9 + x * 3);
  const d = Math.hypot(x - VI.x, y - VI.y);
  if (d < VI.r) return 0.04;
  if (d < VI.r + VI.pared) return 0.55 + 0.2 * Math.sin(d * 23 + Math.atan2(y - VI.y, x - VI.x) * 7);
  if (Math.abs(y - REFL_SUP.y) < 0.12 && x > REFL_SUP.x0 && x < REFL_SUP.x1) return 1;
  if (Math.hypot(x - CALCIO.x, y - CALCIO.y) < CALCIO.r) return 1;
  if (Math.abs(y - PLEURA) < 0.15) return 0.95;
  return 0.18 + 0.08 * Math.sin(x * 5.1 + y * 3.7);
}

export function montar(el) {
  const st = { prof: 16, sector: 60, densidad: 1.2, foco: 9, zonas: 1, artefacto: 'ninguno', t: 0 };
  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  const cambiar = () => { construir(); pintar(); };
  deslizador(mandos, { etiqueta: 'Profundidad', min: 6, max: 30, paso: 1, valor: st.prof, fmt: (v) => `${v} cm`, onInput: (v) => { st.prof = v; cambiar(); } });
  deslizador(mandos, { etiqueta: 'Anchura del sector', min: 30, max: 90, paso: 5, valor: st.sector, fmt: (v) => `${v}°`, onInput: (v) => { st.sector = v; cambiar(); } });
  deslizador(mandos, { etiqueta: 'Densidad de líneas', min: 0.5, max: 2.5, paso: 0.1, valor: st.densidad, fmt: (v) => `${coma(v, 1)} líneas/°`, onInput: (v) => { st.densidad = v; cambiar(); } });
  deslizador(mandos, { etiqueta: 'Profundidad del foco', min: 3, max: 20, paso: 0.5, valor: st.foco, fmt: (v) => `${coma(v, 1)} cm`, onInput: (v) => { st.foco = v; cambiar(); } });
  segmentos(mandos, { etiqueta: 'Zonas focales', opciones: [[1, '1'], [2, '2'], [3, '3']], valor: st.zonas, onChange: (v) => { st.zonas = Number(v); cambiar(); } });
  segmentos(mandos, { etiqueta: 'Artefacto', valor: st.artefacto, onChange: (v) => { st.artefacto = v; cambiar(); },
    opciones: [['ninguno', 'Ninguno'], ['reverb', 'Reverberación'], ['sombra', 'Sombra'], ['espejo', 'Espejo'], ['lobulo', 'Lóbulo lateral']] });
  const L = lienzo(el, 0.78, 'Imagen sectorial de un maniquí, construida línea a línea, con el artefacto elegido');
  const lect = lecturas(el), vivo = enVivo(el);
  const img = document.createElement('canvas');
  let geo = null;

  // La imagen solo se recalcula al cambiar un mando (a baja resolución, escalada); el barrido de la línea es barato.
  function construir() {
    const F = frecuenciaImagen(st.prof, st.sector, st.densidad, st.zonas);
    const nx = 200, ny = Math.round(nx * 0.78);
    img.width = nx; img.height = ny;
    const g = img.getContext('2d'), d = g.createImageData(nx, ny);
    const semi = st.sector / 2 * Math.PI / 180, escala = st.prof / (ny - 6);   // cm por píxel
    const ox = nx / 2, oy = 3;
    const anguloLinea = (th) => { const i = Math.round((th + semi) / (2 * semi) * (F.lineas - 1)); return -semi + i / (F.lineas - 1) * 2 * semi; };
    const muestra = (r, th) => maniqui(r * Math.sin(th), r * Math.cos(th));
    for (let py = 0; py < ny; py++) for (let px = 0; px < nx; px++) {
      const x = (px - ox) * escala, y = (py - oy) * escala, r = Math.hypot(x, y), th0 = Math.atan2(x, y);
      let v = 0;
      if (y > 0 && r <= st.prof && Math.abs(th0) <= semi) {
        const th = anguloLinea(th0);
        // anchura del haz: mínima en el foco (~1-2 mm), más ancha lejos de él (ilustrativo)
        const ancho = (0.12 + 0.05 * Math.abs(r - st.foco) / (st.zonas)) / Math.max(r, 0.5);
        v = (muestra(r, th) * 2 + muestra(r, th - ancho) + muestra(r, th + ancho)) / 4;
        // artefactos (cada uno viola una suposición de la formación de la imagen)
        const xr = r * Math.sin(th), yr = r * Math.cos(th);
        if (st.artefacto === 'reverb' && xr > REFL_SUP.x0 && xr < REFL_SUP.x1) {
          const sep = REFL_SUP.y - PARED;
          for (const [n, a] of [[2, 0.7], [3, 0.45]]) if (Math.abs(yr - (PARED + n * sep)) < 0.12) v = Math.max(v, a);
        }
        if (st.artefacto === 'sombra') {
          const thC = Math.atan2(CALCIO.x, CALCIO.y), rC = Math.hypot(CALCIO.x, CALCIO.y);
          if (r > rC + CALCIO.r && Math.abs(th - thC) < CALCIO.r / rC) v *= 0.06;
        }
        if (st.artefacto === 'espejo' && r > PLEURA + 0.15 && r < 2 * PLEURA) v = Math.max(v * 0.4, 0.55 * muestra(2 * PLEURA - r, th));
        if (st.artefacto === 'lobulo') {
          // la calcificación (reflector fuerte) se repite como un arco a su misma profundidad, a ambos lados
          const thC = Math.atan2(CALCIO.x, CALCIO.y), rC = Math.hypot(CALCIO.x, CALCIO.y), dth = Math.abs(th - thC);
          if (Math.abs(r - rC) < 0.16 && dth < 0.6) v = Math.max(v, 0.9 * (1 - dth / 0.6));
        }
        v = Math.min(1, v * (1 - 0.25 * r / 30));
      }
      const c = Math.round(255 * Math.pow(v, 0.8)), o = (py * nx + px) * 4;
      d.data[o] = c; d.data[o + 1] = c; d.data[o + 2] = Math.round(c * 0.95); d.data[o + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    geo = { F, semi };
  }

  function pintar() {
    if (!geo) construir();
    L.ajustar();
    const { ctx, W, H, k } = L, col = colores(el), F = geo.F;
    ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(img, 0, 0, W, H);
    // barrido: la línea que se está adquiriendo, a velocidad real dividida por 400 para que se vea
    const lento = 400, fr = ((st.t / lento) % F.tImagen) / F.tImagen;
    const th = -geo.semi + fr * 2 * geo.semi, ox = W / 2, oy = 3 * k * (W / 200) / k, R = H - 6 * (W / 200);
    ctx.strokeStyle = col.y; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.5 * k;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + R * Math.sin(th), oy + R * Math.cos(th)); ctx.stroke(); ctx.globalAlpha = 1;
    texto(ctx, `${F.lineas} líneas · ${coma(F.fps, 0)} imágenes/s`, 8 * k, H - 8 * k, '#e9e2cf', k, { tam: 10, halo: 'rgba(0,0,0,0.7)' });
    texto(ctx, `${st.prof} cm`, W - 8 * k, H - 8 * k, '#e9e2cf', k, { tam: 10, alinear: 'right', halo: 'rgba(0,0,0,0.7)' });

    lect.pintar([
      { k: 'Tiempo por línea', v: coma(F.tLinea * 1e6, 0), u: 'µs', fuente: '2 × profundidad ÷ c' },
      { k: 'Líneas por imagen', v: String(F.lineas), u: st.zonas > 1 ? `× ${st.zonas} zonas focales` : '' },
      { k: 'Tiempo por imagen', v: coma(F.tImagen * 1000, 1), u: 'ms' },
      { k: 'Frecuencia de imagen', v: coma(F.fps, 0), u: 'imágenes/s', aviso: F.fps < 30 },
    ]);
    const art = {
      ninguno: '',
      reverb: ' <b>Reverberación:</b> el pulso rebota entre la pared torácica y el reflector fuerte; aparecen copias a 2 y 3 veces su distancia, medidas desde la pared.',
      sombra: ' <b>Sombra:</b> la calcificación refleja y atenúa casi todo el haz; detrás de ella no hay ecos.',
      espejo: ' <b>Imagen en espejo:</b> la pleura actúa de espejo acústico y pinta detrás de ella una copia de lo que tiene delante.',
      lobulo: ' <b>Lóbulo lateral:</b> la energía fuera del eje devuelve ecos de la calcificación como si vinieran del haz principal: un arco a su misma profundidad.',
    }[st.artefacto];
    vivo.pintar(`Cada línea tarda ${coma(F.tLinea * 1e6, 0)} µs (el eco más profundo tiene que volver antes del siguiente pulso); con ${F.lineas} líneas${st.zonas > 1 ? ` y ${st.zonas} zonas focales` : ''}, cada imagen tarda ${coma(F.tImagen * 1000, 1)} ms: <b>${coma(F.fps, 0)} imágenes por segundo</b>.` +
      (F.fps < 30 ? ' <span class="cv-aviso">Pocas imágenes por segundo para un corazón que late: reduce la profundidad o el sector.</span>' : '') + art);
  }

  construir(); pintar();
  const anim = reducirMovimiento() ? null : animar(L.c, (dt) => { st.t += dt; pintar(); });
  const ro = new ResizeObserver(() => pintar()); ro.observe(L.c);
  return { parar() { anim?.parar(); ro.disconnect(); } };
}
