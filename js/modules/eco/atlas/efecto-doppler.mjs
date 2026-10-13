// Atlas · 03 Doppler: la ecuación Doppler, el ángulo del haz y el límite de Nyquist; Doppler pulsado, continuo y color.
// Reconstruido para la app (idea de The Heart by Ultrasound, cap. 03, sin su código). Física exacta:
//   Δf = 2 · f0 · v · cos θ ÷ c   ·   PRF = c ÷ (2 · profundidad)   ·   Nyquist = PRF ÷ 2 en frecuencia = c² ÷ (8 · prof · f0) en velocidad
// La forma de la onda de velocidad (un latido con un pico sistólico) es ilustrativa.
import { lienzo, colores, texto, deslizador, segmentos, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

const C = 1540;

/** Pura: la usan la figura y las pruebas. v en m/s, prof en cm, f0 en MHz, ángulo en grados. */
export function doppler({ v, angulo, prof, f0, modo }) {
  const cos = Math.cos(angulo * Math.PI / 180), vm = v * cos;
  const desplazamiento = 2 * f0 * 1e6 * vm / C;                  // Hz
  const prf = C / (2 * prof / 100);                              // Hz: el eco más profundo marca el ritmo de pulsos
  const nyquist = C * prf / (4 * f0 * 1e6);                      // m/s = c² / (8 · prof · f0)
  return { vm, desplazamiento, prf, nyquist, infra: 1 - cos, aliasing: modo !== 'continuo' && vm > nyquist };
}

/** Velocidad mostrada con aliasing: lo que pasa del límite aparece al otro lado de la línea de base. */
export const enrollar = (v, lim) => (Number.isFinite(lim) ? ((((v + lim) % (2 * lim)) + 2 * lim) % (2 * lim)) - lim : v);

// un latido de 0,86 s (70 lpm): pico sistólico a los 0,12 s y casi nada en diástole (ilustrativo)
const onda = (t) => { const u = t % 0.86; return u < 0.3 ? Math.sin(Math.PI * u / 0.3) ** 1.6 : 0; };

export function montar(el) {
  const st = { modo: 'pulsado', angulo: 0, v: 1.0, prof: 10, f0: 2.5, t: 0 };
  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  segmentos(mandos, { etiqueta: 'Modo', valor: st.modo, onChange: (v) => { st.modo = v; pintar(); },
    opciones: [['pulsado', 'Pulsado'], ['continuo', 'Continuo'], ['color', 'Color']] });
  deslizador(mandos, { etiqueta: 'Ángulo del haz con el flujo', min: 0, max: 80, paso: 1, valor: st.angulo, fmt: (v) => `${v}°`, onInput: (v) => { st.angulo = v; pintar(); } });
  deslizador(mandos, { etiqueta: 'Velocidad máxima real', min: 0.2, max: 5, paso: 0.05, valor: st.v, fmt: (v) => `${coma(v, 2)} m/s`, onInput: (v) => { st.v = v; pintar(); } });
  deslizador(mandos, { etiqueta: 'Profundidad de la muestra', min: 3, max: 20, paso: 0.5, valor: st.prof, fmt: (v) => `${coma(v, 1)} cm`, onInput: (v) => { st.prof = v; pintar(); } });
  deslizador(mandos, { etiqueta: 'Frecuencia Doppler', min: 1.5, max: 5, paso: 0.1, valor: st.f0, fmt: (v) => `${coma(v, 1)} MHz`, onInput: (v) => { st.f0 = v; pintar(); } });
  const L = lienzo(el, 0.95, 'El haz Doppler frente al vaso y el espectro de velocidades que registra');
  const lect = lecturas(el), vivo = enVivo(el);

  function pintar() {
    L.ajustar();
    const { ctx, W, H, k } = L, col = colores(el), D = doppler(st);
    ctx.clearRect(0, 0, W, H);
    // 1) geometría: el vaso horizontal, el flujo hacia la izquierda; el haz llega desde arriba a la izquierda
    const yV = H * 0.25, rV = 18 * k, xc = W * 0.55;
    ctx.fillStyle = '#3a1416'; ctx.fillRect(10 * k, yV - rV, W - 20 * k, 2 * rV);
    ctx.strokeStyle = '#b9785f'; ctx.lineWidth = 2 * k; ctx.strokeRect(10 * k, yV - rV, W - 20 * k, 2 * rV);
    if (st.modo === 'color') {
      // perfil parabólico; color = velocidad media en cada punto (rojo hacia la sonda, azul alejándose), con aliasing
      const lim = D.nyquist;
      for (let y = -rV; y < rV; y += 1) {
        const media = D.vm * 0.5 * (1 - (y / rV) ** 2) * 2 * onda(st.t), vv = enrollar(media, lim), a = Math.min(1, Math.abs(vv) / lim);
        ctx.fillStyle = vv >= 0 ? `rgba(${200 + 55 * a},${60 + 160 * a * a},40,${0.25 + 0.7 * a})` : `rgba(40,${80 + 150 * a * a},${200 + 55 * a},${0.25 + 0.7 * a})`;
        ctx.fillRect(xc - 60 * k, yV + y, 120 * k, 1.2);
      }
      ctx.strokeStyle = col.y; ctx.setLineDash([4 * k, 3 * k]); ctx.strokeRect(xc - 60 * k, yV - rV, 120 * k, 2 * rV); ctx.setLineDash([]);
    }
    // flechas del flujo
    ctx.fillStyle = '#f0c0b0';
    for (let i = 0; i < 5; i++) { const x = W - 30 * k - ((st.t * 90 * k * (0.5 + st.v / 3) + i * W / 5) % (W - 40 * k));
      ctx.beginPath(); ctx.moveTo(x, yV); ctx.lineTo(x + 9 * k, yV - 5 * k); ctx.lineTo(x + 9 * k, yV + 5 * k); ctx.fill(); }
    texto(ctx, 'flujo', W - 14 * k, yV - rV - 4 * k, col.muted, k, { tam: 9, alinear: 'right' });
    // el haz: forma un ángulo θ con la dirección del flujo (que va hacia la izquierda, hacia la sonda)
    const th = st.angulo * Math.PI / 180, dx = Math.cos(th), dy = Math.sin(th) || 0.0001;
    const largo = Math.min((yV - 6 * k) / Math.max(0.17, dy), (xc - 16 * k) / Math.max(0.05, dx)), xs = xc - dx * largo, ys = yV - dy * largo;
    ctx.strokeStyle = col.y; ctx.lineWidth = 2 * k; ctx.beginPath(); ctx.moveTo(xs, ys); ctx.lineTo(xc + dx * 30 * k, yV + dy * 30 * k); ctx.stroke();
    ctx.fillStyle = col.text; ctx.beginPath(); ctx.arc(xs, ys, 5 * k, 0, Math.PI * 2); ctx.fill();
    if (st.modo === 'pulsado') { ctx.strokeStyle = col.text; ctx.lineWidth = 2 * k; ctx.beginPath(); ctx.moveTo(xc - 7 * k * dy, yV + 7 * k * dx); ctx.lineTo(xc + 7 * k * dy, yV - 7 * k * dx); ctx.stroke(); }
    texto(ctx, `θ = ${st.angulo}°`, xc + 8 * k, yV + rV + 14 * k, col.y, k, { tam: 10, peso: 'bold' });

    // 2) espectro: velocidad frente al tiempo (2 latidos). Escala: ±Nyquist en pulsado, ajustada en continuo.
    const y0 = H * 0.5, y1 = H - 16 * k, x0 = 34 * k, x1 = W - 8 * k, base = (y0 + y1) / 2;
    const escala = st.modo === 'continuo' ? Math.max(1, Math.ceil(D.vm * 1.25 * 2) / 2) : D.nyquist;
    const yv = (v) => base - (v / escala) * (y1 - y0) / 2;
    ctx.fillStyle = '#050507'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.moveTo(x0, base); ctx.lineTo(x1, base); ctx.stroke();
    texto(ctx, `+${coma(escala, 2)}`, x0 - 3 * k, y0 + 9 * k, col.muted, k, { tam: 8.5, alinear: 'right' });
    texto(ctx, `−${coma(escala, 2)}`, x0 - 3 * k, y1, col.muted, k, { tam: 8.5, alinear: 'right' });
    texto(ctx, 'm/s', 2 * k, base + 3 * k, col.muted, k, { tam: 8.5 });
    const ancho = st.modo === 'continuo' ? 0.55 : 0.12;   // el continuo mezcla todas las profundidades: espectro relleno
    const T = 1.72, tCursor = st.t % T;
    for (let px = 0; px < x1 - x0; px += 1) {
      const t = (px / (x1 - x0)) * T; if (t > tCursor && st.modo !== 'color') continue;
      const vmax = D.vm * onda(t);
      if (vmax < 0.01) continue;
      for (let f = 1 - ancho; f <= 1; f += 0.04) {
        const v = enrollar(vmax * f, st.modo === 'continuo' ? Infinity : D.nyquist);
        ctx.fillStyle = `rgba(235,235,225,${0.25 + 0.5 * f})`; ctx.fillRect(x0 + px, yv(v) - 1, 1.2, 2);
      }
    }
    if (st.modo === 'color') texto(ctx, 'Color: la media de cada punto · espectro del pulsado en el centro', x0 + 4 * k, y0 + 11 * k, col.muted, k, { tam: 8 });
    else if (st.modo === 'pulsado') {
      ctx.setLineDash([4 * k, 3 * k]); ctx.strokeStyle = col.r; ctx.beginPath(); ctx.moveTo(x0, yv(D.nyquist) + 1); ctx.lineTo(x1, yv(D.nyquist) + 1); ctx.stroke(); ctx.setLineDash([]);
      texto(ctx, 'límite de Nyquist', x1 - 4 * k, yv(D.nyquist) + 11 * k, col.r, k, { tam: 8.5, alinear: 'right' });
    }

    lect.pintar([
      { k: 'Velocidad medida', v: coma(D.vm, 2), u: 'm/s', fuente: 'v × cos θ' },
      { k: 'Infraestimación', v: coma(D.infra * 100, 0), u: '%', aviso: D.infra > 0.06 },
      { k: 'Desplazamiento Doppler', v: coma(D.desplazamiento / 1000, 2), u: 'kHz', fuente: '2 f0 v cos θ ÷ c' },
      ...(st.modo === 'continuo' ? [{ k: 'Límite de Nyquist', v: 'sin límite', u: '(continuo)' }] : [
        { k: 'Frecuencia de repetición (PRF)', v: coma(D.prf / 1000, 1), u: 'kHz', fuente: 'c ÷ (2 × prof.)' },
        { k: 'Límite de Nyquist', v: coma(D.nyquist, 2), u: 'm/s', aviso: D.aliasing, fuente: 'c² ÷ (8 · prof. · f0)' }]),
    ]);
    let txt = `Con el haz a ${st.angulo}° del flujo, el ecógrafo mide ${coma(D.vm, 2)} m/s de ${coma(st.v, 2)} reales` +
      (st.angulo >= 20 ? ` (un ${coma(D.infra * 100, 0)}% menos).` : '.');
    if (st.modo === 'continuo') txt += ' El Doppler continuo emite y recibe sin parar: no tiene límite de Nyquist, pero no dice a qué profundidad está el pico.';
    else if (D.aliasing) txt += ` <span class="cv-aviso">La velocidad supera el límite de Nyquist (${coma(D.nyquist, 2)} m/s) y se enrolla al otro lado de la línea de base: aliasing.</span> Acerca la muestra, baja la frecuencia o pasa a continuo.`;
    else txt += ` Una muestra a ${coma(st.prof, 1)} cm permite una PRF de ${coma(D.prf / 1000, 1)} kHz: se miden sin aliasing velocidades de hasta ${coma(D.nyquist, 2)} m/s.`;
    vivo.pintar(txt);
  }

  pintar();
  const anim = reducirMovimiento() ? null : animar(L.c, (dt) => { st.t += dt; pintar(); });
  const ro = new ResizeObserver(() => pintar()); ro.observe(L.c);
  return { parar() { anim?.parar(); ro.disconnect(); } };
}
