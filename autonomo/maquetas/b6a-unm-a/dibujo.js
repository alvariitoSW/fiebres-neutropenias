// El dibujo (360×300): terminal del nervio, hendidura con ACh y fármacos, placa con copas y tijeras, fibra, TOF del pulgar y CV/PIM.
// Reutiliza sinMovimiento de js/core/motion.js (la animación vive en anim.js). Los cuadros se redibujan; los botones, no.
import { fmt } from './modelo.js';
import { UMBRAL as U } from './datos.js';
export const NC = 6, XC = (i) => 45 + 54 * i, XV = (i) => 52 + 56 * i, XA = (i) => XC(i) + 27;
export const ZONAS = { nervio: [18, 6, 324, 54], hend: [18, 62, 324, 50], copas: [18, 108, 324, 28], musculo: [18, 136, 324, 44], pulgar: [18, 186, 196, 108], cv: [216, 186, 126, 108] };
// Posiciones de las 6 ACh según el paso (0 reposo · 1 impulso · 2 salen · 3 ocupan copas · 4 la enzima · 5 relajado)
export function posicionesAch(paso, libres) {
  return Array.from({ length: NC }, (_, i) => {
    if (paso === 2) return { x: XV(i), y: 70 + (i % 2) * 8, o: 1 };
    if (paso === 3) return i < libres ? { x: XC(i), y: 121, o: 1 } : { x: XC(i) + (i % 2 ? 10 : -10), y: 92, o: 1 };
    if (paso === 4) return { x: XA(Math.min(i, NC - 2)) + (i === NC - 1 ? 8 : 0), y: 104, o: i < 3 ? 1 : 0.35 };
    return { x: XV(i), y: 66, o: 0 };
  });
}
const f = (n) => n.toFixed(1);
export function escena(s, L, paso, foco, oculto) {
  const libresTot = Math.max(1, Math.ceil(NC * L.recEf / 100 > NC ? NC : NC * Math.min(100, L.recEf) / 100)), bloq = Math.round(L.lvl * libresTot), libres = libresTot - bloq;
  const tipo = L.suc > Math.max(L.roc, L.cis) ? 'suc' : 'roc', contrae = paso === 3 || paso === 4 ? L.fuerza / 100 : 0, enc = 12 * contrae;
  const o = [];
  o.push(`<rect class="nervio" x="20" y="8" width="320" height="50" rx="14"/><text x="30" y="21">terminal del nervio</text>`);
  o.push(`<text class="oro" x="334" y="21" text-anchor="end">${paso ? `${paso} · ${['', 'impulso', 'salen vesículas', 'ocupan copas', 'la enzima corta', 'relajado'][paso]}` : 'reposo'}</text>`);
  for (let i = 0; i < NC; i++) o.push(`<circle class="ves" cx="${XV(i)}" cy="44" r="8"/><circle class="ach-v" cx="${XV(i)}" cy="44" r="${paso === 2 ? 0 : 3}"/>`);
  if (paso === 1) o.push(`<path id="imp" class="imp" d="M180 6 L180 2" /><path class="imp" d="M60 34 L300 34" stroke-dasharray="6 4"/>`);
  o.push(`<rect class="hend" x="20" y="58" width="320" height="52"/><text class="min" x="334" y="74" text-anchor="end">hendidura</text>`);
  // membrana con copas y tijeras
  o.push(`<path class="mem" d="M20 112 H340"/>`);
  for (let i = 0; i < NC; i++) {
    const x = XC(i), viva = i < libresTot, bl = viva && i >= libres;
    if (!viva) o.push(`<path class="copa rota" d="M${x - 9} 112 q0 14 9 14 q9 0 9 -14"/><path class="anti" d="M${x - 7} 96 L${x} 104 L${x + 7} 96 M${x} 104 L${x} 112"/>`);
    else o.push(`<path class="copa ${bl && tipo === 'suc' ? 'abierta' : ''}" d="M${x - 9} 112 q0 14 9 14 q9 0 9 -14"/>`);
    if (bl) o.push(tipo === 'suc' ? `<circle class="suc" cx="${x - 3}" cy="118" r="3"/><circle class="suc" cx="${x + 3}" cy="118" r="3"/><path class="suc" d="M${x - 3} 118 H${x + 3}"/>` : `<path class="roc" d="M${x - 5} 117 l2.5 -4.5 h5 l2.5 4.5 l-2.5 4.5 h-5 Z"/>`);
    if (bl && s.sug && s.t - s.sug.t0 < 2.5 && tipo === 'roc') o.push(`<circle class="anillo" cx="${x}" cy="117" r="11"/>`);
    if (i < NC - 1) { const a = XA(i); o.push(`<path class="tijera" d="M${a - 6} 99 L${a + 6} 111 M${a + 6} 99 L${a - 6} 111"/>${s.neo ? `<path class="neo" d="M${a - 7} 113 L${a + 7} 113 L${a} 103 Z"/>` : ''}`); }
  }
  o.push(`<text class="min" x="${XA(1)}" y="96" text-anchor="middle">AChE</text>`);
  // fibra y K+
  o.push(`<rect class="fibra" x="${20 + enc}" y="${136 + contrae * 4}" width="${320 - 2 * enc}" height="${40 - contrae * 8}" rx="8"/><text class="min" x="180" y="${160}" text-anchor="middle">fibra muscular${contrae ? ' · se contrae' : ''}</text>`);
  if (s.suc && s.t - s.suc.t0 < 30) for (let i = 0; i < 3; i++) o.push(`<rect class="kdot" x="${80 + i * 90}" y="139" width="7" height="7"/>`);
  // ACh
  const pos = posicionesAch(paso, libres);
  pos.forEach((p, i) => o.push(`<circle class="ach" data-i="${i}" cx="${f(p.x)}" cy="${f(p.y)}" r="4" opacity="${p.o}"/>`));
  // TOF
  o.push(`<text x="24" y="198">${s.est ? 'Pulgar · TOF 2 Hz' : 'Pulgar · estímulo único'}</text><line class="eje" x1="24" y1="270" x2="200" y2="270"/>`);
  const n = s.est ? 4 : 1;
  for (let i = 0; i < n; i++) { const h = oculto ? 0 : L.amp[i] * 0.5; o.push(`<rect class="barra" x="${34 + 40 * i}" y="${f(270 - h)}" width="26" height="${f(h)}" rx="2"/><text class="min" x="${47 + 40 * i}" y="283" text-anchor="middle">${s.est ? 'T' + (i + 1) : 'T1'}</text>`); }
  o.push(`<text class="oro" x="196" y="198" text-anchor="end">${s.est ? (oculto ? 'TOF ?' : `TOF ${L.tof}/4`) : ''}</text>`);
  // CV y PIM
  const cvh = oculto ? 0 : Math.min(60, L.cv * 6 / 7), pimh = oculto ? 0 : Math.min(60, -L.pim * 0.6);
  o.push(`<rect class="caja" x="232" y="210" width="30" height="60"/><rect class="barra ${L.crit ? 'roja' : ''}" x="232" y="${f(270 - cvh)}" width="30" height="${f(cvh)}"/><line class="umbral" x1="228" y1="257" x2="266" y2="257"/><text class="min" x="268" y="260">15</text>`);
  o.push(`<rect class="caja" x="296" y="210" width="30" height="60"/><rect class="barra ${L.crit ? 'roja' : ''}" x="296" y="${f(270 - pimh)}" width="30" height="${f(pimh)}"/><line class="umbral" x1="292" y1="258" x2="330" y2="258"/><text class="min" x="332" y="256">−20</text>`);
  o.push(`<text x="247" y="283" text-anchor="middle">CV</text><text x="311" y="283" text-anchor="middle">PIM</text><text class="oro" x="247" y="204" text-anchor="middle">${s.via ? 'VM' : oculto ? '?' : fmt(L.cv)}</text><text class="oro" x="311" y="204" text-anchor="middle">${s.via ? 'VM' : oculto ? '?' : fmt(L.pim)}</text>`);
  for (const z of foco) { const r = ZONAS[z]; if (r) o.push(`<rect class="foco" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="8"/>`); }
  return o.join('');
}
