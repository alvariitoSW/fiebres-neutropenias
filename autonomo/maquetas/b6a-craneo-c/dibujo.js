// El dibujo (360×300): la arteria con la mano de la PIC, el lecho capilar sobre el hemisferio con su penumbra, el gráfico flujo-PAM y el Doppler.
import { svgParticula } from '../../../js/core/particulas.js';
import { ILUS } from './datos.js';
import { fmt, clamp } from './modelo.js';
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const ZONAS = { art: [4, 126, 132, 48], mano: [58, 104, 62, 92], hem: [206, 38, 148, 176], pen: [230, 68, 124, 144], graf: [4, 212, 178, 86], dtc: [188, 212, 168, 86] };
const T = (x, y, t, c = '', a = '') => `<text x="${x}" y="${y}" class="${c}" ${a}>${t}</text>`;
const CAMINOS = ['M132 150C175 150 200 100 252 96', 'M132 150L252 150', 'M132 150C175 150 200 200 252 198'];
export function escena(s, L, oculto, foco = []) {
  const ppc0 = s.pam0 - s.pic0, w = L.me ? 1 : clamp(2 + 16 * L.flujo / 100, 2, 24);
  let o = `<rect class="fondo" width="360" height="300" rx="12"/>`;
  // arteria (PAM) y mano (PIC)
  o += `<rect class="pared" x="8" y="139" width="124" height="22" rx="4"/><rect class="sangre" x="8" y="${150 - w / 2}" width="124" height="${w}" rx="3"/>`;
  o += `<rect class="mano" x="70" y="${150 - w / 2 - 20}" width="40" height="20" rx="5"/><rect class="mano" x="70" y="${150 + w / 2}" width="40" height="20" rx="5"/>`;
  o += T(90, 150 - w / 2 - 24, `PIC ${fmt(L.picEf)}`, 'rot', 'text-anchor="middle"') + T(10, 134, `PAM ${fmt(s.pam)}`, 'oro');
  o += T(8, 50, oculto ? 'PPC ?' : `PPC ${fmt(L.ppc)}`, 'gran') + T(8, 66, `= PAM − PIC (${fmt(s.pam)} − ${fmt(L.picEf)})`, 'min');
  if (s.fio2 > 21) o += T(8, 100, `O₂ al ${s.fio2} %: vasos más estrechos`, 'min');
  // hemisferio, infarto y penumbra
  o += `<ellipse class="hem" cx="280" cy="128" rx="72" ry="84"/>`;
  const anillos = [[58, 68], [46, 54], [34, 40]];
  anillos.forEach(([rx, ry], i) => { const viva = !oculto && i >= 3 - L.vivos; o += `<ellipse class="${oculto ? 'anillo duda' : viva ? 'anillo viva' : 'anillo muerta'}" cx="292" cy="140" rx="${rx}" ry="${ry}" ${viva && !REDUCIR ? `style="animation-delay:${i * 0.4}s"` : ''}/>`; });
  o += `<ellipse class="nucleo" cx="292" cy="140" rx="20" ry="26"/>` + T(292, 143, 'Infarto', 'min', 'text-anchor="middle"');
  o += T(282, 36, oculto ? 'Penumbra: ¿cuántos anillos?' : `Penumbra: ${L.vivos} de 3 viva${L.vivos === 1 ? '' : 's'}`, 'rot', 'text-anchor="middle"');
  // lecho capilar: hematíes y oxígeno que avanzan con el flujo
  CAMINOS.forEach((d, k) => { o += `<path class="vena" d="${d}"/>`; });
  if (L.flujo > 0) {
    const n = Math.max(1, Math.ceil(L.flujo / 100 * 2.4)), dur = clamp(5 / (Math.max(L.flujo, 12) / 100), 2, 14);
    CAMINOS.forEach((d, k) => { for (let i = 0; i < n; i++) o += `<g>${REDUCIR ? '' : `<animateMotion dur="${dur.toFixed(1)}s" repeatCount="indefinite" begin="-${(i * dur / n + k * 0.7).toFixed(1)}s" path="${d}"/>`}${svgParticula(i % 2 ? 'o2' : 'rbc', REDUCIR ? 150 + 40 * i + 6 * k : 0, REDUCIR ? 150 : 0, 3.6)}</g>`; });
  } else o += T(150, 120, 'sin flujo', 'rot oro', 'text-anchor="middle"');
  // gráfico flujo-PAM
  const X = (p) => 28 + (p - 45) / 135 * 146, Y = (f) => 280 - clamp(f, 0, 150) / 150 * 58, f = (p) => Math.max(0, (p - L.picEf) / ppc0 * 100 * (1 - ILUS.o2Max * (s.fio2 - 21) / 79));
  o += `<line class="eje" x1="28" y1="218" x2="28" y2="280"/><line class="eje" x1="28" y1="280" x2="176" y2="280"/>`;
  o += `<path class="sano" d="M${X(45)} ${Y(38)}L${X(82)} ${Y(96)}L${X(150)} ${Y(100)}L${X(180)} ${Y(128)}"/><path class="curva" d="M${X(45)} ${Y(f(45))}L${X(180)} ${Y(f(180))}"/>`;
  o += `<circle class="punto" cx="${X(s.pam)}" cy="${Y(oculto ? 100 : L.flujo)}" r="5"/>` + T(34, 230, '━ ictus: sigue a la PAM', 'min') + T(34, 242, '╌ sano (ilustrativo)', 'min') + T(30, 292, 'flujo', 'min') + T(176, 292, 'PAM →', 'min', 'text-anchor="end"');
  // Doppler transcraneal
  o += `<rect class="caja" x="190" y="214" width="164" height="82" rx="8"/>` + T(196, 228, 'Doppler transcraneal', 'rot');
  const h = L.dtc == null ? 0 : clamp(L.dtc / 160 * 44, 4, 46); let d = '';
  for (let b = 0; b < 3; b++) { const x = 198 + b * 50; d += L.dtc == null ? '' : `M${x} 276C${x + 6} 276 ${x + 8} ${276 - h} ${x + 13} ${276 - h}C${x + 20} ${276 - h} ${x + 24} ${276 - h * 0.45} ${x + 31} ${276 - h * 0.55}S${x + 44} 276 ${x + 50} 276`; }
  o += `<path class="onda" d="${L.dtc == null ? 'M198 276H346' : d}"/>` + T(348, 292, L.dtc == null ? 'sin señal' : oculto ? '? cm/s' : `${fmt(L.dtc)} cm/s · ilustrativo`, 'min', 'text-anchor="end"');
  foco.forEach((z) => { const [x, y, ww, hh] = ZONAS[z]; o += `<rect class="foco" x="${x}" y="${y}" width="${ww}" height="${hh}" rx="8"/>`; });
  return o;
}
