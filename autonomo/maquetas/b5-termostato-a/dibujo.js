// Escena del termostato: dial del hipotálamo (aguja dorada, redonda) · termómetro (columna y triángulo) · radiador (piel) · caldera (músculo).
import { fmt } from './modelo.js';
export const ZONAS = { dial: [6, 6, 150, 152], termo: [158, 6, 56, 268], radiador: [222, 10, 134, 138], caldera: [222, 154, 134, 134] };
const TMIN = 22, TMAX = 42, YT = 30, YB = 230;           // tubo del termómetro
const yDe = (t) => YB - ((Math.max(TMIN, Math.min(TMAX, t)) - TMIN) / (TMAX - TMIN)) * (YB - YT);
const pt = (cx, cy, r, t) => { const a = Math.PI * (1 + (Math.max(34, Math.min(42, t)) - 34) / 8); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
const ET = { normal: ['NORMAL', ['El dial está en 37 °C y', 'la real lo sigue (±0,6 °C).']], fiebre: ['FIEBRE', ['El dial subió: la regulación', 'funciona. El antipirético', 'baja el dial.']], hiper: ['HIPERTERMIA', ['El dial sigue en 37 °C: falla', 'la regulación. El antipirético', 'no sirve; hay que enfriar.']], hipo: ['HIPOTERMIA', ['La real cae bajo el dial: la', 'caldera tirita hasta <30 °C', 'y luego se apaga.']] };
export function escena(s, L, foco) {
  const g = [], X = (h) => g.push(h);
  X('<rect class="fondo" x="0" y="0" width="360" height="296"/>');
  // dial
  X('<text class="rot" x="12" y="18">Dial · hipotálamo</text>');
  const cx = 82, cy = 112, r = 56; X(`<path class="arco" d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}"/>`);
  for (const t of [34, 36, 38, 40, 42]) { const [a, b] = pt(cx, cy, r - 5, t), [c, d] = pt(cx, cy, r, t), [e, f] = pt(cx, cy, r + 11, t); X(`<line class="marca-d" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/><text class="min" text-anchor="middle" x="${e}" y="${f + 3}">${t}</text>`); }
  const [nx, ny] = pt(cx, cy, r - 8, L.aj); X(`<line class="aguja" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}"/><circle class="cubo" cx="${cx}" cy="${cy}" r="7"/>`);
  X(`<text class="gran" text-anchor="middle" x="${cx}" y="${cy + 30}">${fmt(L.aj)} °C</text><text class="min" text-anchor="middle" x="${cx}" y="${cy + 44}">punto de ajuste</text>`);
  // termómetro
  X(`<rect class="tubo" x="172" y="${YT - 4}" width="16" height="${YB - YT + 8}" rx="8"/><circle class="tubo" cx="180" cy="${YB + 16}" r="14"/>`);
  X(`<rect class="liq ${L.estado}" x="176" y="${yDe(L.t)}" width="8" height="${YB - yDe(L.t) + 4}"/><circle class="liq ${L.estado}" cx="180" cy="${YB + 16}" r="10"/>`);
  for (const t of [26, 30, 34, 38, 42]) X(`<line class="marca-d" x1="188" y1="${yDe(t)}" x2="194" y2="${yDe(t)}"/><text class="min" x="196" y="${yDe(t) + 3}">${t}</text>`);
  const ya = yDe(L.aj), yr = yDe(L.t);
  X(`<line class="ajl" x1="164" y1="${ya}" x2="194" y2="${ya}"/><text class="min oro" text-anchor="end" x="161" y="${ya + 3}">ajuste</text>`);
  X(`<path class="tri" d="M 192 ${yr} L 204 ${yr - 6} L 204 ${yr + 6} Z"/><text class="rot" x="148" y="18">Termómetro</text>`);
  X(`<text class="rot" text-anchor="middle" x="180" y="${YB + 44}">${fmt(L.t)} °C</text><text class="min" text-anchor="middle" x="180" y="${YB + 55}">real</text>`);
  // regla y flechas
  X(`<path class="flecha ${L.radiador ? 'on' : ''}" d="M 206 ${yr} L 222 78"/><path class="flecha ${L.caldera ? 'on' : ''}" d="M 206 ${yr} L 222 218"/>`);
  // radiador
  X(`<rect class="caja ${L.radiador ? 'on' : ''}" x="226" y="10" width="130" height="138" rx="8"/><text class="rot" x="234" y="26">Radiador · piel</text><text class="min" x="234" y="38">si real &gt; ajuste</text>`);
  for (let i = 0; i < 6; i++) X(`<rect class="aleta ${L.radiador ? 'abierta' : ''}" x="${236 + i * 19}" y="46" width="${L.radiador ? 11 : 6}" height="44" rx="3"/>`);
  X(`<text class="min" x="234" y="104">${L.radiador ? 'vasos abiertos' : 'vasos de la piel cerrados'}</text>`);
  if (L.sudor) for (let i = 0; i < 4; i++) X(`<path class="gota" style="animation-delay:${i * 0.35}s" d="M ${244 + i * 28} 108 q -4 7 0 10 q 4 -3 0 -10 z"/>`);
  X(`<text class="min ${L.anhidrosis ? 'rojo' : ''}" x="234" y="134">${L.anhidrosis ? 'sin sudor (anhidrosis)' : L.sudor ? 'sudor: 1 L = 580 kcal' : 'sin sudor'}</text>`);
  // caldera
  X(`<rect class="caja ${L.caldera ? 'on' : ''}" x="226" y="154" width="130" height="132" rx="8"/><text class="rot" x="234" y="170">Caldera · músculo</text><text class="min" x="234" y="182">si real &lt; ajuste</text>`);
  X(`<path class="llama ${L.caldera ? 'on' : ''}" d="M 262 246 q -20 -22 -2 -44 q 2 14 12 18 q 4 -12 -4 -26 q 26 18 22 40 q -2 12 -10 12 z"/>`);
  if (L.tirita) for (let i = 0; i < 3; i++) X(`<path class="tiembla" style="animation-delay:${i * 0.12}s" d="M ${302 + i * 16} 200 l 3 8 l -6 8 l 3 8 l -3 8"/>`);
  X(`<text class="min" x="234" y="262">${L.tirita ? 'escalofrío: vasos cerrados' : L.t < 30 && L.d < 0 ? 'sin escalofrío (<30 °C)' : 'apagada'}</text>`);
  X(`<text class="min" x="234" y="276">${L.tirita ? '≈1 °C/h de calor' : ''}</text>`);
  // etiqueta de estado
  const [nom, ls] = ET[L.estado]; X(`<rect class="estado ${L.estado}" x="8" y="178" width="148" height="108" rx="8"/><text class="rot" x="16" y="196">${L.estado === 'fiebre' ? '▲' : L.estado === 'hiper' ? '◆' : L.estado === 'hipo' ? '▼' : '●'} ${nom}</text>`);
  ls.forEach((l, i) => X(`<text class="min" x="16" y="${210 + i * 12}">${l}</text>`));
  X(`<text class="min oro" x="16" y="270">real − ajuste = ${L.d >= 0 ? '+' : '−'}${fmt(Math.abs(L.d))} °C</text>`);
  if (foco) { const z = ZONAS[foco]; X(`<rect class="foco" x="${z[0]}" y="${z[1]}" width="${z[2]}" height="${z[3]}" rx="10"/>`); }
  return g.join('');
}
