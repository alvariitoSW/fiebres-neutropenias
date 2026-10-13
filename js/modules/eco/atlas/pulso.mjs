// Atlas · 01 Pulso: una línea de exploración paraesternal. Un pulso corto cruza la pared torácica y el corazón; cada
// cambio de impedancia devuelve un eco; el ecógrafo convierte su tiempo de llegada en profundidad.
// Reconstruido para la app (idea de The Heart by Ultrasound, cap. 01, sin su código). El corte atraviesa el MISMO
// corazón del simulador en telediástole (tabique 9,5 mm, VI 53 mm, pared posterior 9,5 mm, VD 21 mm: medidasCorazon).
// Constantes físicas: tabla 12.1 del manual del IAEA (Lacefield 2014), las mismas que usa el atlas original.
import { lienzo, colores, texto, deslizador, segmentos, casilla, lecturas, enVivo, animar, reducirMovimiento, coma } from './figura.mjs';

export const C = 1540;                // m/s, la velocidad que supone todo ecógrafo en tejido blando
export const ALFA = 0.5;              // dB/cm/MHz, media del tejido blando (la usa la compensación de ganancia)
export const Z = { aire: 0.0004, grasa: 1.38, sangre: 1.61, musculo: 1.70 };          // MRayl
export const ATEN = { aire: 12, grasa: 0.52, sangre: 0.17, musculo: 1.2 };            // dB/cm a 1 MHz
const RUIDO = -80;                    // dB, suelo de ruido del modelo (ilustrativo)
const DMAX = 16;                      // cm

// Capas a lo largo del haz (cm). Las cardíacas, del corazón del simulador; la pared torácica, ilustrativa.
export const CAPAS = [
  { de: 0, a: 0.7, nombre: 'Piel y grasa', tipo: 'grasa' },
  { de: 0.7, a: 2.4, nombre: 'Músculo de la pared', tipo: 'musculo' },
  { de: 2.4, a: 2.9, nombre: 'Pared del VD', tipo: 'musculo' },
  { de: 2.9, a: 4.96, nombre: 'Cavidad del VD', tipo: 'sangre' },
  { de: 4.96, a: 5.91, nombre: 'Tabique', tipo: 'musculo' },
  { de: 5.91, a: 11.21, nombre: 'Cavidad del VI', tipo: 'sangre' },
  { de: 11.21, a: 12.16, nombre: 'Pared posterior', tipo: 'musculo' },
  { de: 12.16, a: DMAX, nombre: 'Pulmón (aire)', tipo: 'aire' },
];
const PARED_POST = 11.21;

export const reflexion = (z1, z2) => ((z2 - z1) / (z2 + z1)) ** 2;
const dB = (r) => 10 * Math.log10(Math.max(r, 1e-12));

/** Ecos a lo largo del haz: interfaces (nivel de reflexión en dB) y el moteado débil del músculo. */
function ecos() {
  const out = [];
  for (let i = 1; i < CAPAS.length; i++) {
    const a = CAPAS[i - 1].tipo, b = CAPAS[i].tipo;
    if (a !== b) out.push({ d: CAPAS[i].de, nivel: dB(reflexion(Z[a], Z[b])), nombre: `${CAPAS[i - 1].nombre} / ${CAPAS[i].nombre}` });
  }
  let s = 7; const azar = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (const L of CAPAS) if (L.tipo === 'musculo') for (let d = L.de + 0.12; d < L.a - 0.05; d += 0.1 + azar() * 0.12) out.push({ d, nivel: -44 - 6 * azar(), moteado: true });
  return out.sort((x, y) => x.d - y.d);
}
const ECOS = ecos();

/** Atenuación de ida (dB a 1 MHz) desde la piel hasta la profundidad d, capa a capa. */
function perdidaIda(d) {
  let s = 0;
  for (const L of CAPAS) { if (d <= L.de) break; s += (Math.min(d, L.a) - L.de) * ATEN[L.tipo]; }
  return s;
}

/** Física de la línea para una frecuencia (MHz) y un nº de ciclos. Pura: la usan la figura y las pruebas. */
export function fisica(f, ciclos) {
  const lambda = C / (f * 1e6) * 1000;            // mm
  const lpe = ciclos * lambda;                    // longitud espacial del pulso, mm
  const axial = lpe / 2;                          // mm
  const us = (dcm) => (2 * dcm / 100) / C * 1e6;  // ida y vuelta, µs
  const perdida = (dcm) => 2 * f * perdidaIda(dcm);   // ida y vuelta, dB
  const sangreMusculo = dB(reflexion(Z.musculo, Z.sangre));
  // profundidad a la que el eco sangre/músculo cae bajo el suelo de ruido, en tejido blando medio (ilustrativo)
  const util = (sangreMusculo - RUIDO) / (2 * ALFA * f);
  return { f, lambda, lpe, axial, us, perdida, util, sangreMusculo };
}

const COLOR_CAPA = { grasa: '#d9c27a', musculo: '#b9785f', sangre: '#5a1f22', aire: '#2b2d33' };

export function montar(el) {
  const st = { f: 3, ciclos: 2, tgc: true, t: 0 };
  const mandos = document.createElement('div'); mandos.className = 'at-mandos'; el.appendChild(mandos);
  deslizador(mandos, { etiqueta: 'Frecuencia del transductor', min: 1, max: 10, paso: 0.1, valor: st.f,
    fmt: (v) => `${coma(v, 1)} MHz`, marcas: ['1 MHz', 'adulto transtorácico: 2-5 MHz', '10 MHz'], onInput: (v) => { st.f = v; pintar(); } });
  segmentos(mandos, { etiqueta: 'Ciclos por pulso', opciones: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], valor: st.ciclos,
    onChange: (v) => { st.ciclos = Number(v); pintar(); } });
  casilla(mandos, { etiqueta: 'Compensación de ganancia en profundidad (TGC)', valor: st.tgc, onChange: (v) => { st.tgc = v; pintar(); } });
  const L = lienzo(el, 0.98, 'Línea de exploración: capas del tórax y del corazón, ecos en modo A y zoom de la resolución axial');
  const lect = lecturas(el), vivo = enVivo(el);

  function pintar() {
    L.ajustar();
    const { ctx, W, H, k } = L, col = colores(el), F = fisica(st.f, st.ciclos);
    ctx.clearRect(0, 0, W, H);
    const x0 = 36 * k, x1 = W - 10 * k, xD = (d) => x0 + (d / DMAX) * (x1 - x0);
    // 1) capas a lo largo del haz, con el pulso que viaja
    const yB0 = 18 * k, yB1 = H * 0.27;
    for (const c of CAPAS) { ctx.fillStyle = COLOR_CAPA[c.tipo]; ctx.fillRect(xD(c.de), yB0, xD(c.a) - xD(c.de), yB1 - yB0); }
    texto(ctx, 'Profundidad →', x0, yB0 - 5 * k, col.muted, k, { tam: 9 });
    // rótulos de las capas grandes, en vertical para que quepan
    ctx.save(); ctx.beginPath(); ctx.rect(x0, yB0, x1 - x0, yB1 - yB0); ctx.clip();
    for (const c of CAPAS) {
      const w = xD(c.a) - xD(c.de); if (w < 13 * k) continue;
      ctx.save(); ctx.translate((xD(c.de) + xD(c.a)) / 2 + 3 * k, yB1 - 4 * k); ctx.rotate(-Math.PI / 2);
      texto(ctx, c.nombre, 0, 0, '#f3ead8', k, { tam: 8.5, halo: 'rgba(0,0,0,0.55)' }); ctx.restore();
    }
    ctx.restore();
    // transductor
    ctx.fillStyle = col.text; ctx.fillRect(x0 - 16 * k, yB0 + 4 * k, 12 * k, yB1 - yB0 - 8 * k);
    // pulso viajando (ida) y su eco más fuerte volviendo; 3 s por recorrido completo
    const ciclo = 3, fr = (st.t % ciclo) / ciclo;
    const dPulso = fr < 0.5 ? fr * 2 * DMAX : null;
    if (dPulso != null) { ctx.fillStyle = col.y; ctx.beginPath(); ctx.arc(xD(dPulso), (yB0 + yB1) / 2, 5 * k, 0, Math.PI * 2); ctx.fill(); }
    else { const dv = (1 - (fr - 0.5) * 2) * PARED_POST; ctx.strokeStyle = col.y; ctx.lineWidth = 2 * k; ctx.beginPath();
      ctx.arc(xD(dv), (yB0 + yB1) / 2, 5 * k, 0, Math.PI * 2); ctx.stroke(); }

    // 2) modo A: nivel del eco (dB) frente a la profundidad
    const yA0 = H * 0.33, yA1 = H * 0.66, dbMin = -100, dbMax = 0;
    const yDb = (v) => yA1 - ((Math.max(dbMin, Math.min(dbMax, v)) - dbMin) / (dbMax - dbMin)) * (yA1 - yA0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1 * k; ctx.strokeRect(x0, yA0, x1 - x0, yA1 - yA0);
    for (const v of [0, -40, -80]) { texto(ctx, String(v), x0 - 4 * k, yDb(v) + 3 * k, col.muted, k, { tam: 8.5, alinear: 'right' }); }
    texto(ctx, 'dB', 2 * k, yA0 + 9 * k, col.muted, k, { tam: 8.5 });
    ctx.setLineDash([4 * k, 3 * k]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(x0, yDb(RUIDO)); ctx.lineTo(x1, yDb(RUIDO)); ctx.stroke(); ctx.setLineDash([]);
    texto(ctx, 'suelo de ruido', x1 - 4 * k, yDb(RUIDO) - 3 * k, col.muted, k, { tam: 8, alinear: 'right' });
    const ganancia = (d) => (st.tgc ? 2 * ALFA * st.f * d : 0);
    for (const e of ECOS) {
      const v = e.nivel - F.perdida(e.d) + ganancia(e.d);
      if (v <= RUIDO) continue;
      ctx.strokeStyle = e.moteado ? col.muted : col.g; ctx.lineWidth = (e.moteado ? 1 : 2) * k;
      ctx.beginPath(); ctx.moveTo(xD(e.d), yDb(RUIDO)); ctx.lineTo(xD(e.d), yDb(v)); ctx.stroke();
    }
    // la profundidad útil (el eco sangre/músculo bajo el ruido)
    if (F.util < DMAX) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(xD(F.util), yA0, x1 - xD(F.util), yA1 - yA0);
      texto(ctx, 'sin señal útil', Math.min(x1 - 4 * k, xD(F.util) + 4 * k), yA0 + 12 * k, col.r, k, { tam: 8.5, alinear: xD(F.util) > x1 - 70 * k ? 'right' : 'left' }); }
    for (let d = 0; d <= DMAX; d += 4) texto(ctx, `${d} cm`, xD(d), yA1 + 12 * k, col.muted, k, { tam: 8.5, alinear: 'center' });

    // 3) zoom: dos reflectores a 0,4 mm dentro de la pared posterior; el eco de cada uno dura media longitud de pulso
    const yZ0 = H * 0.74, yZ1 = H - 14 * k, zMin = -1, zMax = 1.4, sep = 0.4;     // mm alrededor del primer reflector
    const xZ = (mm) => x0 + ((mm - zMin) / (zMax - zMin)) * (x1 - x0), yMid = (yZ0 + yZ1) / 2, amp = (yZ1 - yZ0) * 0.42;
    ctx.strokeStyle = col.line; ctx.strokeRect(x0, yZ0, x1 - x0, yZ1 - yZ0);
    texto(ctx, 'Zoom: 2 reflectores a 0,4 mm', x0 + 4 * k, yZ0 + 11 * k, col.muted, k, { tam: 8.5 });
    const env = (x, c) => { const u = (x - c) / (F.axial); return u >= 0 && u <= 1 ? Math.sin(Math.PI * u) : 0; };
    ctx.strokeStyle = col.y; ctx.lineWidth = 1.6 * k; ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const mm = zMin + (i / 400) * (zMax - zMin);
      const e = Math.max(env(mm, 0), env(mm, sep)), rf = e * Math.cos(2 * Math.PI * mm / (F.lambda / 2));
      const y = yMid - rf * amp; i ? ctx.lineTo(xZ(mm), y) : ctx.moveTo(xZ(mm), y);
    }
    ctx.stroke();
    for (const c of [0, sep]) { ctx.strokeStyle = col.g; ctx.lineWidth = 1 * k; ctx.beginPath(); ctx.moveTo(xZ(c), yZ1); ctx.lineTo(xZ(c), yZ1 - 7 * k); ctx.stroke(); }
    const separados = F.axial < sep;
    texto(ctx, separados ? 'se ven 2 ecos' : 'los 2 ecos se funden en uno', x1 - 4 * k, yZ0 + 11 * k, separados ? col.g : col.r, k, { tam: 9, peso: 'bold', alinear: 'right' });

    const perdPost = F.perdida(PARED_POST), llegaPost = F.util > PARED_POST;
    lect.pintar([
      { k: 'Longitud de onda', v: coma(F.lambda, 2), u: 'mm', fuente: 'c ÷ f' },
      { k: 'Longitud espacial del pulso', v: coma(F.lpe, 2), u: 'mm' },
      { k: 'Resolución axial', v: coma(F.axial, 2), u: 'mm', fuente: 'ciclos × λ ÷ 2' },
      { k: 'Eco de la pared posterior', v: coma(F.us(PARED_POST), 0), u: 'µs', fuente: 'ida y vuelta' },
      { k: 'Pérdida hasta la pared posterior', v: coma(perdPost, 0), u: 'dB ida y vuelta', fuente: 'capa a capa' },
      { k: 'Profundidad útil', v: coma(Math.min(F.util, 99), 1), u: 'cm', aviso: !llegaPost, fuente: 'ilustrativo' },
    ]);
    vivo.pintar(`A ${coma(st.f, 1)} MHz la longitud de onda es de ${coma(F.lambda, 2)} mm y, con ${st.ciclos} ciclo${st.ciclos > 1 ? 's' : ''}, la resolución axial de ${coma(F.axial, 2)} mm: ` +
      (separados ? 'los dos reflectores del zoom se ven separados. ' : '<b>los dos reflectores del zoom se funden en un solo eco.</b> ') +
      (llegaPost ? `El eco de la pared posterior (a ${coma(PARED_POST, 1)} cm) vuelve a los ${coma(F.us(PARED_POST), 0)} µs con señal suficiente.`
        : `<span class="cv-aviso">A esta frecuencia el pulso no penetra hasta la pared posterior (${coma(PARED_POST, 1)} cm): su eco queda bajo el ruido.</span>`) +
      (st.tgc ? '' : ' Sin TGC, los ecos profundos llegan mucho más débiles que los superficiales.'));
  }

  pintar();
  const anim = reducirMovimiento() ? null : animar(L.c, (dt) => { st.t += dt; pintar(); });
  const ro = new ResizeObserver(() => pintar()); ro.observe(L.c);
  return { parar() { anim?.parar(); ro.disconnect(); } };
}
