// El dibujo: el depósito grande (lo que hay), la ventanita del suero (lo que ve el laboratorio) y la figura de cada ion.
import { svgParticula } from '../../../js/core/particulas.js';
import { CURVA_K, MG_REPARTO, K_TOTAL } from './datos.js';
import { fmt, FIG, clamp } from './modelo.js';
const R = 4.2;
const h = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const caja = (x, y, w, hh, cls = 'z') => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${hh}" rx="6"/>`;
const txt = (x, y, t, o = '') => `<text x="${x}" y="${y}" ${o}>${t}</text>`;
// n partículas dentro de un rectángulo (posición fija por índice); `vacias` al final, huecas: lo que falta
function nube(clave, x, y, w, hh, n, vacias = 0, sem = 0) {
  let s = ''; const tot = n + vacias;
  for (let i = 0; i < tot; i++) s += svgParticula(clave, x + 6 + h(i + sem) * (w - 12), y + 6 + h(i * 3 + sem + 9) * (hh - 12), R, { hueco: i >= n, opacidad: i >= n ? 0.9 : 1 });
  return s;
}
// Partículas que pasan de «fuera» a «dentro» con la insulina (4-6, más con cada dosis): trayecto punteado y movimiento que sube y baja.
// Con «reducir movimiento» (CSS) quedan ya dentro, en su sitio final.
function entran(clave, ins, [dx, dy], pos) {
  if (!ins) return '';
  const n = Math.min(6, 2 + 2 * ins); let o = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = pos(i);
    o += `<line class="guia" x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}"/><g class="entra" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${(i * 0.3).toFixed(2)}s">${svgParticula(clave, x, y, R, {})}</g>`;
  }
  return o;
}
const ION = { k: 'k', mg: 'mg', ca: 'ca', p: 'p' };
const NOM = { k: 'K⁺', mg: 'Mg²⁺', ca: 'Ca²⁺', p: 'Fosfato' };
const VAL = { k: ['mEq/L', '3,5-5,5'], mg: ['mEq/L', '1,4 normal'], ca: ['mg/dL iónico', '4,6-5,0'], p: ['mg/dL', '2,5-5,0'] };
// El depósito: bandas con el reparto de la fuente; las partículas dicen cuánto hay y las huecas cuánto falta.
function deposito(ion, s, L) {
  const x = 8, y = 24, w = 228, H = 214; let o = caja(x, y, w, H, 'tanque');
  o += txt(14, y + 12, 'LO QUE HAY · todo el cuerpo', 'class="rot"');
  if (ion === 'k') {
    const falta = Math.max(0, Math.round(-L.dKef / 50)), sobra = Math.max(0, Math.round(L.dKef / 50)), n = Math.round(K_TOTAL / 50 * 0.98);
    o += caja(x + 4, y + 18, w - 8, 26, 'fuera') + txt(x + 10, y + 34, 'Fuera de la célula · 2 % (el suero)', 'class="rot"');
    o += caja(x + 4, y + 48, w - 8, H - 54, 'dentro') + txt(x + 10, y + 61, 'Dentro de la célula · 98 %', 'class="rot"');
    o += nube('k', x + 4, y + 66, w - 8, H - 72, Math.min(n, 66) + sobra, falta, 1);
    o += entran('k', s.ins, [0, 58], (i) => [x + 20 + i * 34, y + 31]);
    o += txt(x + 10, y + H - 4, `1 partícula = 50 mEq · total ${fmt(L.kTotal, 0)} mEq`, 'class="min"');
  } else if (ion === 'mg') {
    const alt = [78, 46, 38, 16], col = ['Hueso 53 %', 'Músculo 27 %', 'Tejido blando 19 %', 'Hematíes 0,7 %'];
    let yy = y + 18; const nn = [26, 13, 10, 1], falta = Math.max(0, Math.round(-s.dMg / 25));
    alt.forEach((a, i) => { o += caja(x + 4, yy, w - 8, a, 'dentro') + txt(x + 10, yy + 12, col[i], 'class="rot"'); o += nube('mg', x + 4, yy + 14, w - 8, a - 14, nn[i], i === 1 ? falta : 0, i * 5); yy += a + 3; });
    o += caja(x + 4, yy, w - 8, 14, 'fuera') + txt(x + 10, yy + 11, 'Plasma 0,3 % · 6 mEq (Tabla 37.1)', 'class="rot"');
    o += txt(x + 10, y + H - 4, '1 partícula = 25 mEq · total ' + fmt(L.mgTotal, 0) + ' mEq', 'class="min"');
  } else if (ion === 'ca') {
    o += caja(x + 4, y + 18, w - 8, H - 62, 'dentro') + txt(x + 10, y + 31, 'Hueso · 99 %', 'class="rot"') + nube('ca', x + 4, y + 34, w - 8, H - 80, 44, 0, 3);
    o += caja(x + 4, y + H - 40, w - 8, 22, 'fuera') + txt(x + 10, y + H - 25, 'Plasma · 1 % (lo que mide el suero)', 'class="rot"');
    o += txt(x + 10, y + H - 4, 'Más de medio kilo de calcio en el adulto (E p. 42)', 'class="min"');
  } else {
    o += caja(x + 4, y + 18, w - 8, H - 62, 'dentro') + txt(x + 10, y + 31, 'Dentro de las células · casi todo', 'class="rot"') + nube('p', x + 4, y + 34, w - 8, H - 80, 40 - Math.round((s.ins) * 6), s.ins * 6, 7);
    o += caja(x + 4, y + H - 40, w - 8, 22, 'fuera') + txt(x + 10, y + H - 25, 'Plasma · lo que mide el suero', 'class="rot"');
    o += txt(x + 10, y + H - 4, 'El libro no da el reparto en cifras (nota)', 'class="min"');
  }
  return o;
}
// La ventanita: el número del suero. Con `oculto`, no enseña la cifra (apuesta y error: primero predices).
function ventana(ion, L, oculto) {
  const v = ion === 'k' ? L.k : ion === 'mg' ? L.mg : ion === 'ca' ? L.caIon : L.po4;
  const n = Math.max(1, Math.round(v * (ion === 'k' ? 1.2 : ion === 'mg' ? 3 : ion === 'ca' ? 1.1 : 1.6)));
  let o = `<line class="hilo" x1="236" y1="40" x2="250" y2="40"/>` + caja(250, 24, 102, 128, 'ventana');
  o += txt(256, 36, 'EL LAB VE', 'class="rot"') + nube(ION[ion], 252, 42, 98, 46, Math.min(n, 18), 0, 11);
  o += txt(301, 114, oculto ? '?' : fmt(v, ion === 'k' || ion === 'mg' || ion === 'ca' ? 1 : 1), 'class="gran" text-anchor="middle"');
  o += txt(301, 128, NOM[ion] + ' · ' + VAL[ion][0], 'class="min" text-anchor="middle"') + txt(301, 142, 'normal ' + VAL[ion][1], 'class="min" text-anchor="middle"');
  return o;
}
function figK(s, L, oculto) {
  const X = (d) => 36 + (d - FIG.dKmin) / 1200 * 300, Y = (v) => 420 - v / 8 * 140;
  let o = txt(10, 262, 'Fig. 36.2 viva · el suero frente al total', 'class="rot"') + `<line class="eje" x1="36" y1="420" x2="336" y2="420"/><line class="eje" x1="36" y1="280" x2="36" y2="420"/>`;
  o += CURVA_K.map(([d]) => txt(X(d), 432, d > 0 ? '+' + d : d, 'class="min" text-anchor="middle"')).filter((_, i) => i % 2 === 0).join('') + [0, 2, 4, 6, 8].map((v) => txt(10, Y(v) + 3, v, 'class="min"')).join('');
  o += `<path class="curva" d="${CURVA_K.map(([d, v], i) => (i ? 'L' : 'M') + X(d).toFixed(1) + ' ' + Y(v).toFixed(1)).join('')}"/>`;
  const dx = X(clamp(L.dKef, FIG.dKmin, FIG.dKmax)), y0 = Y(Math.min(8, Math.max(1.9, L.k + (L.k < 8 ? 0 : 0)))); const yc = Y(L.k);
  o += `<line class="guia" x1="${dx}" y1="420" x2="${dx}" y2="${yc}"/><circle class="punto" cx="${dx}" cy="${yc}" r="6"/>`;
  o += txt(Math.min(300, Math.max(40, dx + 8)), Math.max(292, yc - 10), `K⁺ ${oculto ? '?' : fmt(L.k)} · Δ ${L.dKef > 0 ? '+' : ''}${Math.round(L.dKef)} mEq`, 'class="rot"');
  o += txt(44, 300, 'Plano a la izquierda: déficit de 200-400 mEq por 1 mEq/L', 'class="min"') + txt(120, 314, 'a la derecha: 100-200', 'class="min"');
  return o + (s.ins ? txt(44, 330, 'Insulina: el suero baja, el total no cambia', 'class="min"') : '');
}
function figMg(s, L) {
  const w = 300, f = L.mgTotal / 2000;
  let o = txt(10, 262, 'El número del suero es el 0,3 % del total', 'class="rot"');
  o += caja(26, 276, w, 24, 'dentro') + caja(26, 276, w * Math.min(1, f), 24, 'lleno') + txt(32, 292, `Total ${fmt(L.mgTotal, 0)} mEq (de 2.000)`, 'class="rot"');
  o += caja(26, 316, w, 24, 'fuera') + caja(26, 316, Math.max(2, w * L.mgPlasma / 2000), 24, 'lleno') + txt(32, 332, `Plasma ${fmt(L.mgPlasma)} mEq → suero ${fmt(L.mg)} mEq/L`, 'class="rot"');
  o += txt(26, 362, MG_REPARTO.map(([n, p]) => `${n} ${String(p).replace('.', ',')} %`).join(' · '), 'class="min"');
  return o + txt(26, 380, 'Tabla 37.1: el Mg puede ser normal con el total vacío', 'class="min"');
}
function figCa(s, L, oculto) {
  const Y = (v) => 420 - v * 14, col = (x, ion, quel, alb, tit, ocultar) => {
    let o = `<rect class="ca-i" x="${x}" y="${Y(ion)}" width="70" height="${ion * 14}"/><rect class="ca-q" x="${x}" y="${Y(ion + quel)}" width="70" height="${quel * 14}"/><rect class="ca-a" x="${x}" y="${Y(ion + quel + alb)}" width="70" height="${alb * 14}"/>`;
    return o + txt(x + 35, 434, tit, 'class="min" text-anchor="middle"') + txt(x + 35, Y(ion + quel + alb) - 4, 'total ' + fmt(ion + quel + alb), 'class="min" text-anchor="middle"') + (ocultar ? '' : txt(x + 35, Y(ion / 2) + 3, 'iónico ' + fmt(ion), 'class="min2" text-anchor="middle"'));
  };
  let o = txt(10, 262, 'Fig. 38.1 viva · tres fracciones (mg/dL)', 'class="rot"') + col(40, 4.6, 0.94, 3.76, 'Normal', oculto) + col(130, L.caIon, L.caQuel, L.caAlb, 'Ahora', oculto);
  o += `<g class="ley">${txt(220, 300, '■ albúmina (80 % del resto)', 'class="min ca-at"')}${txt(220, 316, '■ complejos (20 %)', 'class="min ca-qt"')}${txt(220, 332, '■ iónico (la mitad)', 'class="min ca-it"')}</g>`;
  return o + txt(220, 352, 'Menos albúmina baja el total', 'class="min"') + txt(220, 366, 'sin tocar el iónico', 'class="min"');
}
function figP(s, L, oculto) {
  const dentro = Math.max(0, 14 - Math.round(s.ins * 3)), fuera = oculto ? 3 : Math.max(0, Math.min(8, Math.round(L.po4 * 1.6)));
  let o = txt(10, 262, 'El suero baja cuando entra en la célula', 'class="rot"') + caja(10, 270, 120, 70, 'fuera') + txt(16, 284, 'Suero', 'class="rot"') + nube('p', 10, 286, 120, 54, fuera, 0, 21);
  o += caja(200, 270, 150, 70, 'dentro') + txt(206, 284, 'Célula', 'class="rot"') + nube('p', 200, 286, 150, 54, dentro, 0, 5);
  o += entran('p', s.ins, [190, 0], (i) => [24 + Math.floor(i / 3) * 24, 296 + (i % 3) * 14]);
  o += txt(10, 358, 'Insulina y glucosa meten fosfato en las células (E p. 49):', 'class="min"') + txt(10, 372, 'el suero cae aunque el total no cambie.', 'class="min"');
  return o + `<rect class="ca-i" x="30" y="${416 - L.po4 * 14}" width="60" height="${L.po4 * 14}"/>` + txt(60, 432, oculto ? '?' : `${fmt(L.po4)} mg/dL`, 'class="min" text-anchor="middle"') + `<line class="guia" x1="20" y1="${416 - 14}" x2="150" y2="${416 - 14}"/>` + txt(156, 406, '1 mg/dL: debajo, grave (p. 49)', 'class="min"');
}
export function escena(ion, s, L, oculto = false) {
  const fig = ion === 'k' ? figK(s, L, oculto) : ion === 'mg' ? figMg(s, L) : ion === 'ca' ? figCa(s, L, oculto) : figP(s, L, oculto);
  return deposito(ion, s, L) + ventana(ion, L, oculto) + fig;
}
export const NOMBRE = NOM;
