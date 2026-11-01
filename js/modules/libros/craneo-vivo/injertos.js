// Injertos de la vuelta 2b: caja cerrada (curva presión-volumen y reparto de Monro-Kellie), PPC con el vaso apretado, autorregulación y CO₂,
// penumbra del ictus y Doppler. La curva sale del motor de B (`leer`): no hay una segunda regla. Cifras de «otra fuente» (otra-fuente.md 1-4), no de Marino.
import { leer, clamp, U } from './modelo.js';
import { cita } from '../../../data/craneo-vivo-data.js';
const D = 'docs/libro-azul-seccion-viii-neurologia-parte', pdf = (n, p, t) => `<a class="cita-pdf" href="${D}${n}.pdf#page=${p}" target="_blank" rel="noopener">${t}</a>`;
const ST = 'https://www.statpearls.com/point-of-care/23700';
const F = 10.3, tx = (x, y, t, a = 'start', c = 'var(--text-main)') => `<text x="${x}" y="${y}" font-size="${F}" text-anchor="${a}" fill="${c}">${t}</text>`;
const DIM = 'var(--text-muted)', ROJO = 'var(--accent-red)', VERDE = 'var(--accent-green)', ORO = 'var(--accent-yellow)';
export const FUENTES_EXTRA = [[`Libro Azul, neurología, parte 1 · p. 3-5 (Monro-Kellie, curva presión-volumen), p. 11 (meseta 50-150), p. 30-31 (CO₂)`, 'otra fuente'], [`Libro Azul, neurología, parte 2 · p. 30-31 (cifras de la caja cerrada, curva)`, 'otra fuente'], [`StatPearls, reparto cerebro 80 % · sangre 10 % · LCR 10 % (<a href="${ST}" target="_blank" rel="noopener">enlace</a>)`, 'otra fuente']];
export const NOTAS_EXTRA = [['la fuente no lo dice', 'La curva presión-volumen y el reparto 80/10/10 no son de Marino: vienen del Libro Azul y de StatPearls. Los ejes de la curva son «unidades arbitrarias» (Libro Azul): el volumen que se compensa no tiene cifra en las fuentes y el modelo no la inventa.'], ['ilustrativo', 'La velocidad del Doppler (60 cm/s; sube a ~90 en los días 4-14), la forma de la meseta y el número de anillos vivos de la penumbra son ilustrativos: las fuentes dicen la dirección, no la medida.']];
export const hsaDtc = (s, L) => (L.me ? null : L.hsaDiasEsp ? 90 : 60);
// ---- curva presión-volumen + barra de Monro-Kellie (un solo SVG) ----
export function svgCaja(s, L) {
  const X = (m) => 22 + m * 1.5, Y = (p) => 116 - (p - 4) / 76 * 96; let d = '';
  for (let m = 0; m <= 100; m += 4) d += `${m ? 'L' : 'M'}${X(m).toFixed(1)},${Y(leer({ ...s, masa: m }).pic).toFixed(1)} `;
  const take = 0.15 * s.masa / 100 * 170, lcr = Math.max(0, 17 - take), sang = Math.max(0, 17 - Math.max(0, take - 17)), cer = 136 - Math.max(0, take - 34), x0 = 204;
  const seg = (x, w, c, e = '') => `<rect x="${x.toFixed(1)}" y="52" width="${Math.max(0, w).toFixed(1)}" height="26" fill="${c}" stroke="var(--border-color)" ${e}/>`;
  return `<path d="M22,16 L22,116 L176,116" fill="none" stroke="${DIM}"/><path d="${d}" fill="none" stroke="${ORO}" stroke-width="2.2"/>
    <path d="M22,${Y(20)} L176,${Y(20)}" stroke="${DIM}" stroke-dasharray="3 3"/>${tx(26, Y(20) - 3, 'PIC 20', 'start', DIM)}${tx(22, 12, 'PIC ↑')}${tx(176, 128, 'masa →', 'end')}${tx(22, 142, 'unidades arbitrarias', 'start', DIM)}
    <circle cx="${X(s.masa)}" cy="${Y(L.pic)}" r="5" fill="${ROJO}" stroke="var(--bg-main)" stroke-width="1.5"/>
    ${tx(x0, 40, 'Lo que ocupa la caja')}${seg(x0, cer, 'var(--bg-card)')}${seg(x0 + cer, sang, 'color-mix(in srgb, var(--accent-red) 35%, var(--bg-card))', 'stroke-dasharray="2 2"')}${seg(x0 + cer + sang, lcr, 'var(--bg-main)', 'stroke-dasharray="5 2"')}${seg(x0 + 170 - Math.min(take, 170), Math.min(take, 170), ROJO)}
    ${tx(x0, 96, 'Cerebro · sangre · LCR · masa', 'start', DIM)}${tx(x0, 110, s.masa >= 60 ? 'LCR y sangre ya no dan más' : s.masa > 0 ? 'Gasta antes el LCR y la sangre' : 'Sin masa: todo cabe', 'start', s.masa >= 60 ? ROJO : DIM)}`;
}
export const textoCaja = `<b>Cerebro 80 % · sangre 10 % · LCR 10 %</b> del volumen (<a class="cita-pdf" href="${ST}" target="_blank" rel="noopener">StatPearls</a>). La caja no se expande: lo que entra obliga a salir al LCR y a la sangre venosa, y cuando ya no pueden, un poco más de volumen sube mucho la presión (${pdf(1, 4, 'Libro Azul parte 1, p. 4-5')}). Ejemplo con cifras: cerebro 1200-1300 mL, LCR 35-180 mL, sangre 55-110 mL, hematoma de 150 mL (${pdf(2, 30, 'parte 2, p. 30-31')}). En agudos (hematoma) la compensación no llega a desarrollarse (${pdf(1, 5, 'parte 1, p. 5')}). <span class="org">Otra fuente, no Marino · el tamaño de la masa es ilustrativo</span>`;
// ---- PPC = PAM − PIC con el vaso apretado ----
export function svgPpc(L) {
  const w = L.me ? 1 : clamp(2 + L.ppc / 100 * 14, 2, 16);
  return `${tx(4, 22, 'PPC = PAM − PIC', 'start').replace(`font-size="${F}"`, 'font-size="14" font-weight="700"')}
    <rect x="196" y="${17 - w / 2}" width="190" height="${w}" fill="${ROJO}" opacity=".55"/><rect x="250" y="${17 - w / 2 - 9}" width="30" height="8" rx="3" fill="${DIM}"/><rect x="250" y="${17 + w / 2 + 1}" width="30" height="8" rx="3" fill="${DIM}"/>
    ${tx(380, 10, `${L.P} − ${L.pic} = ${L.ppc}`, 'end', ORO).replace(`font-size="${F}"`, 'font-size="10.5" font-weight="700"')}${tx(196, 32, 'PIC aprieta el vaso', 'start', DIM)}`;
}
// ---- autorregulación (meseta 50-150) ----
export function svgAuto(s, L) {
  const X = (p) => 28 + p * 0.78, Y = (f) => 106 - clamp(f, 0, 150) / 150 * 86, sano = (p) => (p < 50 ? p * 1.6 : p <= 150 ? 80 + (p - 50) * 0.05 : 85 + (p - 150) * 0.6), ict = (p) => p * 0.8;
  let a = '', b = ''; for (let p = 0; p <= 200; p += 5) { a += `${p ? 'L' : 'M'}${X(p).toFixed(1)},${Y(sano(p)).toFixed(1)} `; b += `${p ? 'L' : 'M'}${X(p).toFixed(1)},${Y(ict(p)).toFixed(1)} `; }
  const pp = clamp(L.ppc, 0, 200);
  return `<path d="M28,16 L28,106 L186,106" fill="none" stroke="${DIM}"/><path d="${a}" fill="none" stroke="${VERDE}" stroke-width="2.2"/><path d="${b}" fill="none" stroke="${ORO}" stroke-width="2" stroke-dasharray="5 3"/>
    <path d="M${X(50)},106 L${X(50)},20 M${X(150)},106 L${X(150)},20" stroke="${DIM}" stroke-dasharray="2 3"/>${tx(X(50), 118, '50', 'middle')}${tx(X(150), 118, '150', 'middle')}${tx(28, 12, 'flujo')}${tx(186, 118, 'PPC →', 'end', DIM)}
    <circle cx="${X(pp)}" cy="${Y(s.tipo === 'edema' ? ict(pp) : sano(pp))}" r="5" fill="${ROJO}" stroke="var(--bg-main)" stroke-width="1.5"/>
    ${tx(200, 34, '━ sano: meseta 50-150')}${tx(200, 48, '╌ ictus: sigue a la presión')}${tx(200, 66, `Tú: PPC ${L.ppc}`, 'start', ORO)}${tx(200, 84, 'forma ilustrativa,', 'start', DIM)}${tx(200, 96, 'sin cifras de flujo', 'start', DIM)}`;
}
export const textoAuto = `El flujo se mantiene con PPC entre 50 y 150 mmHg (${pdf(1, 11, 'Libro Azul parte 1, p. 11')}; ${pdf(2, 31, 'parte 2, p. 31')}). El CO₂ lo cambia: el flujo cerebral varía un 3-4 % por cada mmHg de PaCO₂ (${pdf(1, 30, 'parte 1, p. 30-31')}); por eso hiperventilar baja la PIC pero también el flujo, y solo se hace un rato, nunca 24 h (Manual UMI). <span class="org">Otra fuente, no Marino</span>`;
export const textoCo2 = (s) => (s.vent === 'hv' ? 'Hiperventilando, la PaCO₂ baja: con 10 mmHg menos (de 40 a 30) el flujo cae un 30-40 % (3-4 % por mmHg). Úsalo un rato, no 24 h.' : 'Con PaCO₂ normal el flujo no se desvía. Prueba «Hiperventilar» en el panel Presión y respirador.');
// ---- penumbra en anillos (ictus) ----
export const vivos = (L) => (L.me ? 0 : L.ppc >= 60 ? 3 : L.ppc >= 50 ? 2 : L.ppc >= 40 ? 1 : 0);
export function svgPenumbra(L) {
  const v = vivos(L), r = [[56, 40], [42, 30], [28, 20]];
  return r.map(([rx, ry], i) => `<ellipse cx="72" cy="55" rx="${rx}" ry="${ry}" fill="none" stroke="${i >= 3 - v ? VERDE : DIM}" stroke-width="${i >= 3 - v ? 2.5 : 1.2}" stroke-dasharray="${i >= 3 - v ? 'none' : '2 3'}"/>`).join('') +
    `<ellipse cx="72" cy="55" rx="20" ry="13" fill="${ROJO}"/>${tx(72, 58, 'Infarto', 'middle', 'var(--bg-main)')}${tx(148, 38, `Penumbra: ${v} de 3 anillos vivos`, 'start', v < 3 ? ROJO : VERDE)}${tx(148, 54, `PPC ${L.ppc}: el flujo sigue a la presión`)}${tx(148, 70, 'Anillo vivo = trazo continuo', 'start', DIM)}`;
}
const c = (p, f) => cita(p, f);
export const ICTUS = () => `<ul class="lista"><li>Sin trombólisis, solo se baja la PA si supera 220/120, y como mucho un 15 % en 24 h ${c(36, 'mn-isq-hta')}</li><li>Tras trombólisis, por debajo de 180/105 ${c(36, 'mn-isq-hta')}</li><li>SaO₂ por encima de 94 % empeora el pronóstico ${c(35, 'mn-isq-o2-recomendacion')}</li><li>Glucosa 140-180 mg/dL y vigilar la fiebre ${c(37, 'mn-isq-hipotension')}</li><li>Tope del modelo: PAM ≤${U.pamMax} (fisiología general)</li></ul>`;
