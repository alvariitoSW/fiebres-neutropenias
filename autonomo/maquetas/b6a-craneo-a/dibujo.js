// El corte sagital rígido con sus tres compartimentos (cerebro · sangre · LCR) y la masa; a la derecha, la curva (ilustrativa).
import { leer, picDe, nuevo, fmt } from './modelo.js';
const f1 = (x) => x.toFixed(1);
export const ZONAS = { craneo: [4, 22, 232, 200], curva: [240, 20, 116, 190], leyenda: [4, 226, 232, 32], pupilas: [4, 262, 232, 32] };
export const focoSvg = (zs = []) => zs.map((z) => { const [x, y, w, h] = ZONAS[z]; return `<rect class="foco" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`; }).join('');
const NOM = { hematoma: 'Hematoma', hv: 'Hematoma con sangre ventricular', edema: 'Edema', lcr: 'LCR retenido' };
export const NOMBRE_MASA = NOM;
function pupilas(pup, cx, y) {
  // forma además de color: tamaño y relleno distintos; «normales» = 2 medianas con luz; una dilatada = grande a un lado
  const r = { normales: [8, 8, 'luz'], 'una dilatada fija': [13, 5, 'fija'], 'dilatadas fijas': [14, 14, 'fija'], 'medias fijas': [9, 9, 'fija'] }[pup];
  const ojo = (x, rr, t) => `<circle class="iris" cx="${x}" cy="${y}" r="17"/><circle class="${t === 'luz' ? 'pup' : 'pup fija'}" cx="${x}" cy="${y}" r="${rr}"/>`;
  return ojo(cx - 22, r[0], r[2]) + ojo(cx + 22, r[1], r[2]);
}
export function escena(s, L, oculto) {
  const comp = Math.min(L.v, 15) / 15, grande = Math.min(1, Math.max(0, (L.v - 15) / 15));
  const k = 1 - 0.1 * Math.min(1, L.v / 30);          // el cerebro se comprime
  const venoso = 7 - 4.5 * comp;                       // senos venosos que se vacían primero
  const lcr = (1 - 0.55 * comp) * (L.hidro ? 1.9 : 1) * (1 - 0.3 * grande);
  const r = s.m ? 6 + Math.sqrt(s.m) * 1.35 : 0;
  const rojo = 'color-mix(in srgb, var(--accent-red) 55%, var(--bg-main))';
  let o = '';
  o += `<path class="hueso" d="M14 150 C 8 60, 70 22, 124 22 C 190 22, 232 64, 228 140 C 226 176, 205 208, 168 214 L 78 214 C 40 208, 18 184, 14 150 Z"/>`;
  o += `<path class="hueso2" d="M78 214 L 70 232 M168 214 L 176 232"/>`;
  // sangre venosa: seno sagital pegado a la bóveda; arterias: árbol que sube de la base
  o += `<path class="seno" style="stroke-width:${f1(venoso)}px" d="M30 120 C 34 60, 80 36, 124 36 C 176 36, 214 66, 216 120"/>`;
  o += `<path class="arteria" d="M120 208 L120 150 M120 176 L92 150 L78 128 M120 176 L150 150 L164 126 M120 160 L120 118"/>`;
  // cerebro: lóbulos redondos
  const lob = [[78, 96, 36], [122, 80, 40], [168, 98, 34], [92, 150, 30], [150, 152, 30]];
  o += lob.map(([x, y, rr]) => `<circle class="lobulo" cx="${f1(120 + (x - 120) * k)}" cy="${f1(130 + (y - 130) * k)}" r="${f1(rr * k)}"/>`).join('');
  // LCR: ventrículos en mariposa (punteados)
  o += `<g class="lcr" transform="translate(120 112) scale(${f1(lcr)})"><ellipse cx="-13" cy="0" rx="12" ry="7"/><ellipse cx="13" cy="0" rx="12" ry="7"/></g>`;
  // la masa
  if (r) {
    const cx = s.tipo === 'edema' ? 152 : 158, cy = 108;
    if (s.tipo === 'lcr') o += `<circle class="masa-lcr" cx="${cx}" cy="${cy}" r="${f1(r)}"/>`;
    else if (s.tipo === 'edema') o += `<circle class="masa-edema" cx="${cx}" cy="${cy}" r="${f1(r * 1.2)}"/><circle class="masa-nucleo" cx="${cx}" cy="${cy}" r="${f1(r * 0.45)}"/>`;
    else o += `<circle class="masa" cx="${cx}" cy="${cy}" r="${f1(r)}" style="fill:${rojo}"/>`;
  }
  if (s.tipo === 'hv' && s.m) o += `<ellipse class="masa" cx="120" cy="112" rx="${f1(8 + 6 * lcr)}" ry="5" style="fill:${rojo}"/>`;
  if (L.hidro) o += `<path class="cateter" d="M104 26 L 114 100"/><text x="14" y="28">Catéter</text>`;
  if (L.tope) o += `<text class="alerta" x="124" y="204" text-anchor="middle">flujo detenido</text>`;
  // leyenda: forma + palabra (no solo color)
  o += `<g class="ley"><circle class="lobulo" cx="12" cy="236" r="5"/><text x="21" y="239">Cerebro</text>`;
  o += `<ellipse class="lcr-l" cx="82" cy="236" rx="6" ry="3.5"/><text x="92" y="239">LCR</text>`;
  o += `<path class="arteria" d="M130 241 L136 231 M136 241 L140 231"/><text x="144" y="239">Sangre</text>`;
  o += `<circle class="masa" cx="12" cy="252" r="4.5" style="fill:${rojo}"/><text x="21" y="255">Masa: ${NOM[s.tipo]}</text></g>`;
  // pupilas
  o += pupilas(L.pup, 60, 278) + `<text x="104" y="276">Pupilas</text><text x="104" y="288">${L.pup}</text>`;
  // curva presión-volumen (ilustrativa)
  const X = (v) => 252 + (v / 32) * 98, Y = (p) => 196 - (p / 80) * 164;
  let d = ''; for (let v = 0; v <= 32; v += 0.5) d += (v ? 'L' : 'M') + f1(X(v)) + ' ' + f1(Y(Math.min(80, picDe(v)))) + ' ';
  o += `<path class="eje" d="M252 32 L252 196 L352 196"/><path class="curva" d="${d}"/>`;
  o += `<line class="guia" x1="252" y1="${f1(Y(20))}" x2="352" y2="${f1(Y(20))}"/><text x="256" y="${f1(Y(20)) - 3}">PIC 20</text><text x="258" y="26">PIC ↑</text>`;
  const px = X(Math.min(L.v, 32)), py = Y(Math.min(L.pic, 80));
  o += oculto ? '' : `<line class="guia" x1="${f1(px)}" y1="${f1(py)}" x2="${f1(px)}" y2="196"/><circle class="punto" cx="${f1(px)}" cy="${f1(py)}" r="5"/>`;
  o += `<text x="252" y="209">volumen de la masa →</text><text class="min" x="244" y="222">ilustrativo,</text><text class="min" x="244" y="233">sin cifras de volumen</text><text class="min" x="244" y="244">(Marino no la trae)</text>`;
  return o;
}
export { nuevo, leer, fmt };
