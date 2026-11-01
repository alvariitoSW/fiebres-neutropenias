// Dibujo de la cama 4 (SVG 360×360): arriba el paciente en la cama con tres marcadores; abajo la lupa elegida.
// Reutiliza de la app (importado): svgParticula (partículas), tope/frase-vista (en pagina.js). aparatos.js del shock vivo no exporta cama ni
// paciente (solo los tres aparatos): el cuerpo es un dibujo propio, rotulado «ilustrativo».
import { svgParticula } from '../../../js/core/particulas.js';
import { clamp } from './modelo.js';
export const ZONAS = { cabeza: [6, 36, 78, 76], higado: [100, 40, 90, 70], abdomen: [150, 40, 100, 70] };
export const NOMBRE = { cabeza: 'Cabeza', higado: 'Hígado', abdomen: 'Abdomen' };
const T = (x, y, s, c = '', a = 'start') => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${s}</text>`;
const P = (clave, x, y, r = 4.4) => `<g transform="translate(${x} ${y})">${svgParticula(clave, 0, 0, r)}</g>`;
// ---- la cara de West Haven (ilustrativa): 0 sin encefalopatía · 1 distraído · 2 apático · 3 estuporoso · 4 coma
export function cara(g, cx, cy, r, ict) {
  const ojo = (dx) => { const x = cx + dx * r * 0.38, y = cy - r * 0.12, w = r * 0.2;
    if (g >= 3) return `<path d="M${x - w} ${y}q${w} ${w * 0.7} ${2 * w} 0" class="trazo"/>`;
    if (g === 2) return `<path d="M${x - w} ${y}h${2 * w}" class="trazo"/><path d="M${x - w} ${y}q${w} ${w * 0.9} ${2 * w} 0" class="trazo fino"/>`;
    return `<circle cx="${x}" cy="${y}" r="${w * 0.85}" class="blanco"/><circle cx="${x + (g === 1 ? w * 0.5 : 0)}" cy="${y}" r="${w * 0.4}" class="pupila"/>`; };
  const boca = g === 4 ? `<ellipse cx="${cx}" cy="${cy + r * 0.45}" rx="${r * 0.14}" ry="${r * 0.2}" class="pupila"/>` : g === 3 ? `<ellipse cx="${cx}" cy="${cy + r * 0.45}" rx="${r * 0.12}" ry="${r * 0.08}" class="pupila"/>`
    : g === 0 ? `<path d="M${cx - r * 0.25} ${cy + r * 0.38}q${r * 0.25} ${r * 0.2} ${r * 0.5} 0" class="trazo"/>` : `<path d="M${cx - r * 0.22} ${cy + r * 0.45}h${r * 0.44}" class="trazo"/>`;
  const ceja = g === 1 ? `<path d="M${cx - r * 0.55} ${cy - r * 0.4}l${r * 0.3} ${-r * 0.08}M${cx + r * 0.25} ${cy - r * 0.48}l${r * 0.3} ${r * 0.08}" class="trazo fino"/>` : '';
  return `<circle cx="${cx}" cy="${cy}" r="${r}" class="${ict ? 'piel ict' : 'piel'}"/>${ojo(-1)}${ojo(1)}${ceja}${boca}${g === 4 ? T(cx + r + 4, cy - r + 6, 'z z', 'min') : ''}`;
}
// ---- la mano con asterixis: pivota en la muñeca (el ángulo lo mueve pagina.js con la clase .mano)
const mano = (x, y, k = 1) => `<g class="mano" data-px="${x}" data-py="${y}" transform="translate(${x} ${y})"><path d="M0 0v${-14 * k}" class="antebrazo" style="stroke-width:${3.2 * k}"/><path d="M${-6 * k} ${-14 * k}h${12 * k}v${-12 * k}h${-12 * k}z" class="palma"/><path d="M${-6 * k} ${-26 * k}v${-7 * k}M${-2 * k} ${-26 * k}v${-9 * k}M${2 * k} ${-26 * k}v${-9 * k}M${6 * k} ${-26 * k}v${-7 * k}" class="dedos" style="stroke-width:${2 * k}"/></g>`;
export function escena(s, L, lupa, oculto) {
  const g = oculto ? 0 : L.wh;
  let o = `<rect x="0" y="0" width="360" height="360" class="fondo"/>`;
  // la cama
  o += `<rect x="6" y="104" width="348" height="14" rx="5" class="colchon"/><path d="M14 118v16M346 118v16" class="pata"/><ellipse cx="42" cy="98" rx="30" ry="9" class="almohada"/>`;
  o += `<path d="M70 96 C70 62 90 56 120 56 L246 56 C262 56 262 92 262 96 Z" class="torso"/><path d="M262 82 C300 76 332 82 346 94 L346 100 L262 100Z" class="sabana"/>`;
  o += cara(g, 42, 80, 21, L.ictericia && !oculto);
  if (oculto) o += T(42, 84, '?', 'gran', 'middle');
  o += mano(138, 62, 1);                              // brazo con asterixis (se mueve según el grado)
  o += `<ellipse cx="200" cy="74" rx="15" ry="9" class="${L.f < 0.9 ? 'higado dano' : 'higado'}"/>`;
  if (L.ictericia && !oculto) o += T(110, 120, 'ictericia · ilustrativo', 'min');
  if (s.cvvh) o += `<path d="M230 98 C240 112 262 112 276 118" class="linea"/>` + T(280, 126, 'CVVH', 'min');
  if (s.tips) o += `<path d="M190 70 C200 60 210 60 214 72" class="tips"/>`;
  // marcadores y conexión con la lupa
  const mk = { cabeza: [42, 80, 28], higado: [200, 74, 22], abdomen: [212, 84, 40] };
  const ctr = { cabeza: 42, higado: 200, abdomen: 226 };
  for (const [k, [x, y, r]] of Object.entries(mk)) if (k === lupa) o += `<ellipse cx="${k === 'abdomen' ? 214 : x}" cy="${k === 'abdomen' ? 80 : y}" rx="${k === 'abdomen' ? 52 : r}" ry="${k === 'abdomen' ? 26 : r}" class="marca"/>`;
  o += `<path d="M${ctr[lupa]} ${lupa === 'abdomen' ? 106 : 104}L${ctr[lupa]} 140" class="hilo"/>`;
  o += `<rect x="3" y="140" width="354" height="217" rx="12" class="lupa"/>`;
  o += lupa === 'cabeza' ? lupaCabeza(s, L, g, oculto) : lupa === 'higado' ? lupaHigado(s, L) : lupaAbdomen(s, L);
  return o;
}
function lupaCabeza(s, L, g, oculto) {
  let o = T(10, 156, 'Lupa cabeza', 'rot') + T(350, 156, 'cara y manos: ilustrativo', 'min', 'end');
  o += cara(g, 66, 232, 42, L.ictericia && !oculto) + (oculto ? T(66, 242, '?', 'gran', 'middle') : '');
  o += T(66, 290, oculto ? 'West Haven: ¿?' : `West Haven ${g}`, 'rot', 'middle');
  const lineas = ['Sin encefalopatía', 'Distraído, cambia de humor', 'Apático, desorientado en el tiempo', 'Estuporoso, responde', 'Coma'];
  o += T(66, 303, oculto ? 'se lee en la cara' : lineas[g], 'min', 'middle');
  o += mano(138, 262, 1.5) + mano(170, 262, 1.5) + T(154, 278, g === 4 ? 'sin temblor: coma' : 'asterixis', 'min', 'middle');
  // astrocito
  const hin = oculto ? 0 : clamp((L.nh - 60) / 240, 0, 1), r = 22 + 20 * hin;
  o += `<circle cx="285" cy="232" r="${r}" class="astro"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; o += `<path d="M${285 + Math.cos(a) * r} ${232 + Math.sin(a) * r}l${Math.cos(a) * 12} ${Math.sin(a) * 12}" class="trazo fino"/>`; }
  const n = oculto ? 3 : Math.round(clamp(L.nh / 40, 1, 7));
  for (let i = 0; i < n; i++) o += P('nh4', 232 + (i % 3) * 8, 196 + Math.floor(i / 3) * 11 + (i % 3) * 6, 4);
  o += T(285, 236, oculto ? 'glutamina' : hin > 0.5 ? 'agua entra' : 'glutamina', 'min2', 'middle');
  o += T(285, 290, 'Astrocito: NH₃ → glutamina → agua', 'min', 'middle') + T(285, 302, hin > 0.5 && !oculto ? 'se hincha: edema citotóxico' : 'amonio dentro de la célula', 'min', 'middle');
  o += T(180, 340, 'Fuente: p. 6 · cifras del monitor: ilustrativo', 'min', 'middle');
  return o;
}
function lupaHigado(s, L) {
  let o = T(10, 156, 'Lupa hígado: el cordón de hepatocitos', 'rot') + T(10, 170, 'El hígado convierte NH₃ en urea', 'min');
  o += T(30, 197, 'vena porta', 'min', 'middle') + T(318, 197, 'vena hepática', 'min', 'middle');
  const vivas = Math.ceil(5 * clamp(s.func, 0, 100) / 100);
  for (let i = 0; i < 5; i++) { const x = 55 + i * 50, v = i < vivas; o += `<rect x="${x}" y="206" width="44" height="42" rx="9" class="${v ? 'hep' : 'hep muerto'}"/>`; if (v) o += P('urea', x + 22, 232, 4.2); }
  o += `<path d="M10 208h40M310 208h40" class="linea"/>`;
  o += T(150, 223, 'ciclo de la urea', 'min2', 'middle').replace('class="min2"', 'class="min2"');
  const ent = Math.max(2, Math.round(3 + 3 * (1 - L.f))), sal = Math.round(clamp(L.nh / 50, 0, 6));
  for (let i = 0; i < ent; i++) o += P('nh4', 18 + (i % 2) * 14, 210 + Math.floor(i / 2) * 11, 4);
  for (let i = 0; i < sal; i++) o += P('nh4', 322 + (i % 2) * 14, 210 + Math.floor(i / 2) * 11, 4);
  o += T(180, 267, `${vivas} de 5 hepatocitos trabajan (${Math.round(s.func)} %)`, 'min', 'middle');
  if (s.tips) { o += `<path d="M30 200 C70 150 290 150 330 200" class="tips"/>` + T(180, 183, 'TIPS: salta el cordón', 'rot', 'middle'); for (let i = 0; i < 3; i++) o += P('nh4', 110 + i * 70, 158 + (i === 1 ? -6 : 0), 4); }
  o += T(10, 292, 'Otras vías, cerradas aquí (se abren en otras fichas):', 'min');
  ['paracetamol', 'cetonas', 'lactato', 'alcoholes'].forEach((t, i) => { const x = 10 + i * 87; o += `<rect x="${x}" y="298" width="80" height="22" rx="6" class="puerta"/><path d="M${x + 7} 312v-6h6v6z" class="cand"/>` + T(x + 17, 313, t, 'min'); });
  o += T(180, 345, 'p. 6 · reparto de la sangre y cifras: ilustrativo', 'min', 'middle');
  return o;
}
function lupaAbdomen(s, L) {
  let o = T(10, 156, 'Lupa abdomen', 'rot') + T(350, 156, 'figura real abajo', 'min', 'end');
  o += `<path d="M20 175 h170 q16 0 16 20 v22 q0 14 -16 14 h-60 v-14 h-90 v14 h-20 z" class="${s.dep > 0 ? 'colon acido' : 'colon'}"/>`;
  const n = Math.round(4 + 8 * L.prod * (s.tips ? 1 : 1)); for (let i = 0; i < n; i++) o += P('nh4', 30 + (i % 8) * 20, 188 + Math.floor(i / 8) * 14, 3.8);
  o += T(26, 238, s.dep > 0 ? 'colon acidificado: menos bacterias productoras' : 'colon: bacterias → NH₃', 'min');
  if (s.rif > 0) o += T(26, 250, `rifaximina ${s.rif} d: menos bacterias`, 'min');
  o += `<path d="M20 268 q80 -14 160 0 q10 30 -20 44 q-70 12 -130 -4 q-20 -16 -10 -40z" class="ascitis"/>` + T(100, 296, 'ascitis (cirrosis)', 'min', 'middle') + T(100, 308, '→ PBE y SHR: otras fichas', 'min', 'middle');
  // CVVH
  o += `<rect x="248" y="190" width="98" height="92" rx="10" class="${s.cvvh ? 'filtro on' : 'filtro'}"/>` + T(297, 206, 'Filtro CVVH', 'rot', 'middle') + T(297, 220, s.cvvh ? 'encendido' : 'apagado', 'min', 'middle');
  o += `<path d="M206 214 C222 214 232 230 248 232" class="${s.cvvh ? 'linea on' : 'linea'}"/>`;
  if (s.cvvh) for (let i = 0; i < Math.max(1, Math.round(L.nhSin / 70)); i++) o += P('nh4', 262 + (i % 4) * 18, 244 + Math.floor(i / 4) * 14, 4);
  o += T(297, 296, 'filtro vivo →', 'min', 'middle');
  o += T(180, 345, `amonio ${s.cvvh ? 'con' : 'sin'} filtro · p. 8 · cifras: ilustrativo`, 'min', 'middle');
  return o;
}
