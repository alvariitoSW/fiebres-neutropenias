// El dibujo estático de la maqueta b3-ritmo: el corte del corazón, las dos lupas (nodo AV y célula) y los aparatos.
import * as I from '../../../core/dibujo-iso.js';
import { bomba, SALIDA } from '../../../core/bomba.js';
import { MOTOR } from './motor.js';
import { $, clamp } from './ayudas.js';

/* ============================================================
   EL DIBUJO. Grabado anatómico: crema sobre fondo oscuro, muchas piezas pequeñas, un solo acento iluminado (el frente
   de onda). Nada se mueve «porque queda bien»: la tinta, los torniquetes, la aguja y los aparatos leen el MOTOR.
   ============================================================ */
export const G = MOTOR.grafo;
export const f1 = x => (+x).toFixed(1);
const pts = a => a.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
const suave = (a, cerrar) => { const c = G.curva(a, Math.max(8, a.length * 6)); return 'M' + pts(c) + (cerrar ? 'Z' : ''); };
const BANDA = Object.fromEntries(G.BANDAS.map(b => [b.id, b]));
const rev = a => [...a].reverse();

// ---------- 1. El corte del corazón (estático) ----------
function cavidades() {
  const B = BANDA;
  const ad = [...B.ad.a, [96, 152], [124, 152], ...rev(B.sia.a)];
  const ai = [...B.sia.b, [176, 152], [232, 153], ...rev(B.ai.a)];
  const vd = [...B.vd.a, ...rev(B.siv.a), [130, 168], [80, 169]];
  const vi = [...B.siv.b, ...rev(B.vi.a), [250, 168], [205, 169]];
  return { ad, ai, vd, vi };
}
export function dibujoEstatico() {
  const B = BANDA, cav = cavidades();
  let h = `<defs>
    <pattern id="rtv-trama" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="3" stroke="var(--text-main)" stroke-opacity=".16" stroke-width=".45"/></pattern>
    <pattern id="rtv-trama-densa" width="1.8" height="1.8" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line x1="0" y1="0" x2="0" y2="1.8" stroke="var(--bg-main)" stroke-opacity=".45" stroke-width=".5"/></pattern>
    <pattern id="rtv-punteado" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".35" fill="var(--text-main)" fill-opacity=".1"/><circle cx="3.7" cy="3.6" r=".3" fill="var(--text-main)" fill-opacity=".07"/></pattern>
    <pattern id="rtv-cicatriz-t" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="2.4" stroke="var(--text-muted)" stroke-opacity=".7" stroke-width=".7"/></pattern>
    <clipPath id="rtv-clip-av"><rect x="9" y="15" width="156" height="88" rx="5"/></clipPath>
    <clipPath id="rtv-clip-cel"><rect x="9" y="15" width="156" height="88" rx="5"/></clipPath>
  </defs>`;
  // Halo bajo el corazón
  h += `<ellipse cx="170" cy="300" rx="140" ry="9" fill="var(--bg-card)" fill-opacity=".55"/>`;
  // Vasos: cava superior (con su corte), cava inferior (su orificio), venas pulmonares, orejuelas
  h += `<g id="rtv-vasos" class="rtv-pieza" data-pieza="anillo" stroke="var(--text-main)" stroke-width=".9" stroke-linejoin="round">
    <path d="M92 53 L92 5 L119 5 L121 54 Z" fill="var(--card2)"/><path d="M92 53 L92 5 L119 5 L121 54 Z" fill="url(#rtv-trama)" stroke="none"/>
    <ellipse cx="105.5" cy="5" rx="13.5" ry="3.2" fill="var(--bg-main)"/><ellipse cx="105.5" cy="5" rx="10.5" ry="2" fill="none" stroke-width=".5" stroke-opacity=".6"/>
    <path d="M287 70 L334 67 L335 83 L288 88" fill="var(--card2)"/><path d="M288 104 L335 103 L336 119 L288 120" fill="var(--card2)"/>
    <path d="M287 70 L334 67 L335 83 L288 88 M288 104 L335 103 L336 119 L288 120" fill="url(#rtv-trama)" stroke="none"/>
    <ellipse cx="334.5" cy="75" rx="2.6" ry="8" fill="var(--bg-main)"/><ellipse cx="335.5" cy="111" rx="2.6" ry="8" fill="var(--bg-main)"/>
    <path d="M66 53 C58 40 42 41 37 51 C34 59 38 64 44 66" fill="var(--card2)"/><path d="M66 53 C58 40 42 41 37 51 C34 59 38 64 44 66" fill="url(#rtv-trama)" stroke="none"/>
    <path d="M178 44 C180 32 194 28 202 33 C206 36 205 41 200 42" fill="var(--card2)"/><path d="M178 44 C180 32 194 28 202 33 C206 36 205 41 200 42" fill="url(#rtv-trama)" stroke="none"/>
  </g>`;
  // Cavidades (sangre: un punteado apenas visible)
  for (const [k, a] of Object.entries(cav)) h += `<path class="rtv-cavidad" d="${suave(a, true)}" fill="var(--bg-main)"/><path d="${suave(a, true)}" fill="url(#rtv-punteado)"/>`;
  h += `<ellipse cx="68" cy="141" rx="10" ry="4.4" fill="var(--bg-main)" stroke="var(--text-main)" stroke-width=".7"/><path d="M59 138 C66 134 75 135 80 139" fill="none" stroke="var(--text-main)" stroke-width=".55" stroke-opacity=".7"/>
    <ellipse id="rtv-seno" cx="127" cy="143" rx="5" ry="2.6" fill="var(--bg-main)" stroke="var(--text-main)" stroke-width=".7"/>
    <ellipse cx="150.5" cy="100" rx="3.6" ry="10" fill="var(--bg-main)" fill-opacity=".5" stroke="var(--text-main)" stroke-width=".5" stroke-opacity=".7"/>`;
  // Músculos papilares, banda moderadora (con la rama derecha dentro)
  h += `<g fill="var(--card2)" stroke="var(--text-main)" stroke-width=".7">
    ${PAPILARES.map(d => `<path d="${d}"/>`).join('')}
  </g><g fill="url(#rtv-trama)">${PAPILARES.map(d => `<path d="${d}"/>`).join('')}</g>`;
  // Válvulas y cuerdas tendinosas (cuelgan del anillo)
  h += `<g id="rtv-valvulas" class="rtv-pieza" data-pieza="valvulas" stroke="var(--text-main)" stroke-width=".7">
    <path d="M62 167 C68 180 74 192 86 200 C82 188 76 176 72 167 Z" fill="var(--text-dim)" fill-opacity=".55"/>
    <path d="M141 166 C137 180 131 192 121 200 C123 188 129 176 131 166 Z" fill="var(--text-dim)" fill-opacity=".55"/>
    <path d="M190 167 C196 182 204 194 216 202 C212 190 204 176 200 167 Z" fill="var(--text-dim)" fill-opacity=".55"/>
    <path d="M271 168 C269 182 263 192 253 200 C255 188 261 176 261 168 Z" fill="var(--text-dim)" fill-opacity=".55"/>
    <g fill="none" stroke-width=".4" stroke-opacity=".75"><path d="M86 200 L68 228 M82 196 L70 228 M121 200 L72 229 M216 202 L222 238 M212 198 L224 238 M253 200 L271 220 M257 196 L273 220"/></g>
  </g>`;
  // Músculo: teselas (base grabada) y su tinta (la onda)
  h += `<g id="rtv-teselas-base">`;
  G.teselas.forEach((t, i) => { h += `<path data-t="${i}" d="" fill="var(--card2)" stroke="var(--bg-main)" stroke-width=".45"/>`; });
  h += `</g><g id="rtv-trama-musculo" fill="url(#rtv-trama)" stroke="none"></g>`;
  h += `<g id="rtv-tinta"><g id="rtv-aurs" class="rtv-pieza" data-pieza="aurs"></g><g id="rtv-vents" class="rtv-pieza" data-pieza="vents"></g></g>`;
  h += `<g id="rtv-contornos" fill="none" stroke="var(--text-main)" stroke-width="1" stroke-linejoin="round"></g>`;
  // La cicatriz (TV) y su circuito
  h += `<g id="rtv-cicatriz" class="rtv-pieza" data-pieza="cicatriz" opacity="0"><ellipse cx="${G.CICATRIZ.x}" cy="${G.CICATRIZ.y}" rx="${G.CICATRIZ.rx + 3}" ry="${G.CICATRIZ.ry + 3}" fill="var(--bg-main)"/><ellipse cx="${G.CICATRIZ.x}" cy="${G.CICATRIZ.y}" rx="${G.CICATRIZ.rx + 3}" ry="${G.CICATRIZ.ry + 3}" fill="url(#rtv-cicatriz-t)" stroke="var(--text-muted)" stroke-width=".6"/></g>
    <g id="rtv-circuito-tv" opacity="0"><ellipse cx="${G.CICATRIZ.x}" cy="${G.CICATRIZ.y}" rx="${G.CICATRIZ.rx}" ry="${G.CICATRIZ.ry}" fill="none" stroke="var(--accent-yellow)" stroke-width="1.6" stroke-dasharray="2.4 1.6"/></g>`;
  // El circuito del flúter
  h += `<g id="rtv-circuito-fl" class="rtv-pieza" data-pieza="flutter" opacity="0"><ellipse cx="96" cy="136" rx="40" ry="9" fill="none" stroke="var(--accent-yellow)" stroke-width="1.6" stroke-dasharray="2.4 1.6"/></g>`;
  // La lesión (ST)
  h += `<g id="rtv-lesion" class="rtv-pieza" data-pieza="lesion" opacity="0"></g>`;
  // El anillo fibroso: el aislante entre aurículas y ventrículos
  const anilloSup = [[30, 154], [60, 156], [100, 157], [140, 154], [170, 153], [200, 154], [250, 155], [304, 155]];
  const anilloInf = [[306, 165], [250, 166], [200, 166], [170, 167], [140, 166], [100, 167], [60, 167], [34, 165]];
  const anilloD = 'M' + pts(G.curva(anilloSup, 40)) + ' L' + pts(G.curva(anilloInf, 40)) + 'Z';
  h += `<g id="rtv-anillo" class="rtv-pieza" data-pieza="anillo"><path d="${anilloD}" fill="var(--text-dim)" fill-opacity=".82" stroke="var(--text-main)" stroke-width=".8"/><path d="${anilloD}" fill="url(#rtv-trama-densa)"/>
    <path d="M60 161 C82 155 120 155 142 161 M190 161 C210 155 248 155 270 161" fill="none" stroke="var(--bg-main)" stroke-width="1.1" stroke-opacity=".55"/>
    <path d="M146 154 L186 154 L188 168 L146 168 Z" fill="var(--text-main)" fill-opacity=".35"/></g>`;
  // El atajo (vía accesoria): un puente de músculo que cruza el anillo junto a la mitral
  h += `<g id="rtv-ap" class="rtv-pieza" data-pieza="ap" opacity="0"><path d="M280 146 C288 152 290 160 287 171 L294 173 C298 162 296 150 287 142 Z" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".8"/><path d="M280 146 C288 152 290 160 287 171 L294 173 C298 162 296 150 287 142 Z" fill="url(#rtv-trama)"/><path id="rtv-ap-luz" d="M283 145 C291 152 293 160 290 172" fill="none" stroke="var(--text-main)" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0"/></g>`;
  // El sistema de conducción: cable de oro con su vaina
  h += `<g id="rtv-conduccion" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
  for (const cad of CABLES) { const d = cableD(cad); h += cad.detras ? `<path d="${d}" stroke="var(--accent-yellow)" stroke-width="${cad.ancho}" stroke-opacity=".5" stroke-dasharray="2 2.4" data-cable="${cad.id}"/>` : `<path d="${d}" stroke="var(--bg-main)" stroke-width="${cad.ancho + 2.2}"/><path d="${d}" stroke="var(--accent-yellow)" stroke-width="${cad.ancho}" stroke-opacity=".85" data-cable="${cad.id}"/>`; }
  h += `<g id="rtv-purkinje" stroke="var(--accent-yellow)" stroke-width=".8" stroke-opacity=".7">${purkinjeD()}</g></g>`;
  h += `<g id="rtv-conduccion-luz" fill="none" stroke="var(--text-main)" stroke-linecap="round"></g>`;
  // Nodos: sinusal (media luna), AV (óvalo grabado), His y ramas (para señalarlos)
  const n = id => G.porId[id];
  h += `<g id="rtv-sa" class="rtv-pieza" data-pieza="sa"><path d="M${n('sa').x - 6} ${n('sa').y - 3} C${n('sa').x - 2} ${n('sa').y - 8} ${n('sa').x + 6} ${n('sa').y - 7} ${n('sa').x + 8} ${n('sa').y - 2} C${n('sa').x + 4} ${n('sa').y - 4} ${n('sa').x - 1} ${n('sa').y - 4} ${n('sa').x - 6} ${n('sa').y - 3} Z" fill="var(--accent-yellow)" stroke="var(--text-main)" stroke-width=".6"/><circle id="rtv-sa-luz" cx="${n('sa').x}" cy="${n('sa').y - 4}" r="4.5" fill="var(--text-main)" fill-opacity="0"/></g>`;
  h += `<g id="rtv-nav" class="rtv-pieza" data-pieza="nav"><ellipse cx="144" cy="150" rx="8" ry="3.6" fill="var(--accent-yellow)" stroke="var(--text-main)" stroke-width=".6"/><ellipse cx="144" cy="150" rx="8" ry="3.6" fill="url(#rtv-trama-densa)"/><ellipse id="rtv-nav-luz" cx="144" cy="150" rx="9.5" ry="5" fill="var(--text-main)" fill-opacity="0"/></g>`;
  h += `<g id="rtv-his" class="rtv-pieza" data-pieza="his"><path d="M150 153 L156 158 L164 168 L170 174" fill="none" stroke="transparent" stroke-width="8"/></g>`;
  h += `<g id="rtv-ramas" class="rtv-pieza" data-pieza="ramas"><path d="M170 174 L165 190 L168 208 L152 220 L108 228 L64 232 M170 174 L182 179 L212 190 L244 200 L276 222 M182 179 L192 212 L202 234 L218 254" fill="none" stroke="transparent" stroke-width="8"/><g id="rtv-rama-tachada"></g></g>`;
  // Rótulos grabados (pocos; el resto, al tocar)
  h += `<g font-size="10" fill="var(--text-muted)" font-weight="600" letter-spacing=".06em" pointer-events="none"><text x="76" y="104">AD</text><text x="214" y="102">AI</text><text x="96" y="252">VD</text><text x="240" y="256">VI</text></g>
    <text x="306" y="172" font-size="9.5" fill="var(--text-dim)" font-style="italic" pointer-events="none">anillo</text><text x="306" y="181" font-size="9.5" fill="var(--text-dim)" font-style="italic" pointer-events="none">fibroso</text>`;
  // las arterias coronarias en el surco AV (cortadas de través): derecha y circunfleja
  h += [[27, 160], [304, 157]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.2" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".7"/><circle cx="${x}" cy="${y}" r="2.2" fill="var(--bg-main)" stroke="var(--accent-red)" stroke-opacity=".7" stroke-width=".5"/>`).join('');
  // Gota del bolo (adenosina) y parches del desfibrilador
  h += `<g id="rtv-gota" opacity="0"><circle cx="105" cy="0" r="3.4" fill="var(--text-main)"/><circle cx="105" cy="0" r="6" fill="var(--text-main)" fill-opacity=".25"/></g>`;
  h += `<g id="rtv-parches" opacity="0"><rect x="6" y="28" width="22" height="16" rx="4" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".8"/><rect x="9.5" y="31.5" width="15" height="9" rx="2" fill="var(--text-dim)" fill-opacity=".35"/><path d="M6 36 L0 36" stroke="var(--text-main)" stroke-width="1.2"/>
    <rect x="300" y="282" width="22" height="16" rx="4" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".8"/><rect x="303.5" y="285.5" width="15" height="9" rx="2" fill="var(--text-dim)" fill-opacity=".35"/><path d="M322 290 L360 290" stroke="var(--text-main)" stroke-width="1.2"/>
    <rect id="rtv-destello" x="0" y="0" width="360" height="308" fill="var(--text-main)" fill-opacity="0"/></g>`;
  // El electrodo de la célula (un trozo de la pared lateral del VI) y su cable a la lupa
  const te = G.teselas.find(t => t.banda === 'vi' && t.i === 4 && t.c === 2);
  h += `<g id="rtv-electrodo" pointer-events="none"><path d="M${f1(te.x + 5)} ${f1(te.y)} C${f1(te.x + 22)} ${f1(te.y + 10)} 330 280 330 312" fill="none" stroke="var(--text-muted)" stroke-width=".7"/><circle cx="${f1(te.x + 3)}" cy="${f1(te.y)}" r="2.2" fill="var(--text-dim)" stroke="var(--bg-main)" stroke-width=".6"/></g>
    <g id="rtv-electrodo-nodo" pointer-events="none" opacity="0"><path d="M150 153 C178 170 220 280 236 312" fill="none" stroke="var(--text-muted)" stroke-width=".7"/><circle cx="149" cy="152" r="2" fill="var(--text-dim)" stroke="var(--bg-main)" stroke-width=".6"/></g>`;
  // Lupa: del nodo AV a su ventana
  h += `<g pointer-events="none"><path d="M137 155 C118 200 100 270 92 312" fill="none" stroke="var(--text-muted)" stroke-width=".6" stroke-dasharray="1.6 2"/><ellipse cx="144" cy="150" rx="12" ry="7" fill="none" stroke="var(--text-muted)" stroke-width=".7"/></g>`;
  h += `<line x1="0" y1="309" x2="360" y2="309" stroke="var(--border-color)" stroke-width=".6"/>`;
  h += `<g id="rtv-lupa-av" class="rtv-pieza" data-pieza="lupaAv" transform="translate(4 312)">${lupaAvEstatica()}</g>`;
  h += `<g id="rtv-celula" class="rtv-pieza" data-pieza="celula" transform="translate(182 312)">${celulaEstatica()}</g>`;
  return h;
}
// Los cables del sistema de conducción (ids de nodos del grafo)
const PAPILARES = ['M58 246 C56 236 62 228 70 226 C76 228 78 236 76 246 Z', 'M290 248 C282 240 274 230 270 220 C276 216 286 226 292 236 Z', 'M228 272 C222 260 220 248 222 238 C228 240 233 252 238 268 Z', 'M168 212 C140 218 104 222 74 224 L74 230 C104 229 140 226 170 220 Z'];
export const CABLES = [
  { id: 'tr1', ids: ['sa', 'ia1', 'ia2', 'navE'], ancho: 1.1 }, { id: 'tr2', ids: ['sa', 'im1', 'im2', 'navE'], ancho: 1.1 }, { id: 'tr3', ids: ['sa', 'ip1', 'ip2'], ancho: 1.1 }, { id: 'tr3b', ids: ['ip2', 'navE'], ancho: 1.1, detras: true },
  { id: 'bach', ids: ['sa', 'bm1', 'bm2', 'bm3', 'bm4'], ancho: 1.2 },
  { id: 'his', ids: ['navC', 'his1', 'his2', 'bif'], ancho: 2.4 },
  { id: 'rd', ids: ['bif', 'rb1', 'rb2', 'rb3', 'rb4', 'rb5'], ancho: 1.7 },
  { id: 'ri', ids: ['bif', 'lb0', 'ls1'], ancho: 1.9 }, { id: 'ria', ids: ['lb0', 'la1', 'la2', 'la3'], ancho: 1.5 }, { id: 'rip', ids: ['lb0', 'lp1', 'lp2', 'lp3'], ancho: 1.5 },
];
const cableD = cad => suave(cad.ids.map(id => [G.porId[id].x, G.porId[id].y]));
function purkinjeD() {
  let d = '';
  const porLado = {}; for (const n of G.nodos) if (n.tipo === 'pk') (porLado[n.banda + n.lado] ||= []).push(n);
  for (const lista of Object.values(porLado)) {
    d += `<path d="M${lista.map(n => f1(n.x) + ' ' + f1(n.y)).join(' L')}"/>`;
    for (const n of lista) { const t = n.entra; d += `<path d="M${f1(n.x)} ${f1(n.y)} L${f1(n.x + (t.x - n.x) * 0.55)} ${f1(n.y + (t.y - n.y) * 0.55)}" stroke-width=".55"/>`; }
  }
  return d;
}
// La forma de cada tesela con la pared contraída (δ en unidades del dibujo)
export function polyTesela(t, dv, da) {
  const b = BANDA[t.banda], d = t.reg === 'v' ? dv : da, [mA, mB] = b.mueve;
  const P = (k, f) => { const ax = b.a[k][0], ay = b.a[k][1], bx = b.b[k][0], by = b.b[k][1], s = d * (-mA * (1 - f) + mB * f); return [ax + (bx - ax) * f + b.n[k][0] * s, ay + (by - ay) * f + b.n[k][1] * s]; };
  const q = [P(t.i, t.f0), P(t.i + 1, t.f0), P(t.i + 1, t.f1), P(t.i, t.f1)];
  return 'M' + pts(q) + 'Z';
}
export function contornoBanda(b, d) {
  const [mA, mB] = b.mueve, a = [], c = [];
  for (let k = 0; k <= b.seg; k++) { a.push([b.a[k][0] - b.n[k][0] * d * mA, b.a[k][1] - b.n[k][1] * d * mA]); c.push([b.b[k][0] + b.n[k][0] * d * mB, b.b[k][1] + b.n[k][1] * d * mB]); }
  return `<path d="M${pts(a)}"/><path d="M${pts(c)}" stroke-width="1.15"/>`;
}

// ---------- 2. La lupa del nodo AV: el torniquete (dos carriles) y el atajo ----------
// Coordenadas de la ventana (174 × 108). Proyección oblicua: la profundidad sube a la derecha.
export const TORN = { L: { x: 51, y: 50, g0: 30, g1: 72 }, R: { x: 105, y: 50, g0: 84, g1: 126 } };
const sCurva = (x, y0, y1, a) => { const out = []; for (let i = 0; i <= 24; i++) { const f = i / 24; out.push([x - a * Math.sin(f * 2 * Math.PI), y0 + (y1 - y0) * f]); } return out; };
export const CAMINO = {
  Lin: sCurva(51, 14, 38, 17),                                         // el carril lento: largo, serpentea
  Rin: [[105, 14], [105, 38]],                                         // el rápido: recto
  Lout: [[51, 62], [56, 74], [70, 82], [78, 86]], Rout: [[105, 62], [100, 74], [86, 82], [78, 86]], com: [[78, 86], [78, 106]],
  puente: [[153, 14], [152, 30], [152, 44], [152, 62], [152, 80], [153, 104]],
};
function surco(c) { const d = 'M' + pts(c); return `<path d="${d}" stroke="var(--text-main)" stroke-opacity=".5" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="var(--bg-main)" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
const muro = (x0, x1) => `<path d="M${x0} 48 L${x1} 48 L${x1 + 5} 43 L${x0 + 5} 43 Z" fill="var(--text-dim)" fill-opacity=".9" stroke="var(--text-main)" stroke-width=".5"/><path d="M${x0} 48 L${x1} 48 L${x1 + 5} 43 L${x0 + 5} 43 Z" fill="url(#rtv-trama-densa)"/>
  <rect x="${x0}" y="48" width="${x1 - x0}" height="14" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".5"/><rect x="${x0}" y="48" width="${x1 - x0}" height="14" fill="url(#rtv-trama-densa)"/>
  <path d="M${x1} 48 L${x1 + 5} 43 L${x1 + 5} 57 L${x1} 62 Z" fill="var(--bg-card)" stroke="var(--text-main)" stroke-width=".5"/>`;
function tornHtml(k) {
  const T = TORN[k];
  return `<g id="rtv-torn-${k.toLowerCase()}">
    <ellipse cx="${T.x}" cy="${T.y + 12}" rx="17" ry="4.6" fill="var(--bg-main)" fill-opacity=".7"/>
    <ellipse cx="${T.x}" cy="${T.y + 10}" rx="15" ry="4" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".6"/>
    <ellipse cx="${T.x}" cy="${T.y + 9.4}" rx="12" ry="3.1" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".4"/>
    ${[0, 1, 2, 3].map(i => { const a = i * Math.PI / 2 + 0.4; return `<circle cx="${f1(T.x + 13.4 * Math.cos(a))}" cy="${f1(T.y + 10 + 3.5 * Math.sin(a))}" r=".55" fill="var(--text-main)"/>`; }).join('')}
    <path id="rtv-rearme-${k}" d="" fill="none" stroke="var(--accent-yellow)" stroke-width="1.6" stroke-linecap="round"/>
    <g id="rtv-muelle-${k}"></g>
    <g id="rtv-brazos-${k}"></g>
    <circle cx="${T.g1 - 4}" cy="${T.y - 13}" r="2.8" fill="var(--bg-main)" stroke="var(--text-main)" stroke-width=".5"/>
    <circle id="rtv-lampara-${k}" cx="${T.g1 - 4}" cy="${T.y - 13}" r="1.8" fill="var(--accent-green)"/>
  </g>`;
}
function lupaAvEstatica() {
  return `<rect x="0" y="0" width="174" height="108" rx="9" fill="var(--card2)" stroke="var(--border-color)"/>
    <rect x="8" y="14" width="158" height="90" rx="6" fill="var(--bg-main)" stroke="var(--text-main)" stroke-opacity=".5" stroke-width=".7"/>
    ${[[5, 5], [169, 5], [5, 103], [169, 103]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="none" stroke="var(--text-muted)" stroke-width=".6"/><circle cx="${x}" cy="${y}" r=".6" fill="var(--text-muted)"/>`).join('')}
    <text x="12" y="10.5" font-size="9.5" fill="var(--text-dim)" font-weight="600" letter-spacing=".05em">EL NODO AV, DE CERCA</text>
    <text id="rtv-txt-puente" x="140" y="10.5" font-size="9.5" fill="var(--text-dim)" opacity="0">atajo</text>
    <g clip-path="url(#rtv-clip-av)">
      <rect x="8" y="14" width="158" height="29" fill="url(#rtv-trama)"/>
      <rect x="8" y="62" width="158" height="44" fill="url(#rtv-trama)" opacity=".55"/>
      ${surco(CAMINO.Lin)}${surco(CAMINO.Rin)}
      ${muro(8, 30)}${muro(72, 84)}${muro(126, 166)}
      <rect x="30" y="61" width="42" height="1.4" fill="var(--text-main)" fill-opacity=".35"/><rect x="84" y="61" width="42" height="1.4" fill="var(--text-main)" fill-opacity=".35"/>
      ${surco(CAMINO.Lout)}${surco(CAMINO.Rout)}${surco(CAMINO.com)}
      ${[[12, 55], [26, 55], [78, 55], [130, 55], [160, 55]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="none" stroke="var(--bg-main)" stroke-width=".5"/><circle cx="${x}" cy="${y}" r=".35" fill="var(--bg-main)"/>`).join('')}
      <g id="rtv-puente" opacity="0"><path d="M146 14 C146 30 145 38 145 44 L145 62 C145 72 146 90 146 106 L160 106 C160 90 161 72 161 62 L161 44 C161 38 160 30 160 14 Z" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".7"/>
        <path d="M145 44 L161 44 L164 40 L148 40 Z" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".5"/>
        ${[20, 26, 32, 38, 50, 56, 68, 74, 80, 86, 92, 98].map(y => `<path d="M146.5 ${y} L159.5 ${y}" stroke="var(--text-main)" stroke-opacity=".35" stroke-width=".5"/>`).join('')}
        <path d="M148 14 L148 106 M158 14 L158 106" stroke="var(--text-main)" stroke-opacity=".25" stroke-width=".4"/></g>
      ${tornHtml('L')}${tornHtml('R')}
      <g id="rtv-cerrojo" opacity="0"><rect x="30" y="42.6" width="98" height="3.2" rx="1.4" fill="var(--text-main)" stroke="var(--bg-main)" stroke-width=".5"/><rect x="126" y="38" width="11" height="12" rx="1.8" fill="var(--text-dim)" stroke="var(--text-main)" stroke-width=".6"/><path d="M128.6 38 C128.6 32.5 134.4 32.5 134.4 38" fill="none" stroke="var(--text-main)" stroke-width="1.2"/><circle cx="131.5" cy="44" r="1.1" fill="var(--bg-main)"/></g>
      <g id="rtv-fichas"></g>
    </g>
    <g font-size="9.5" fill="var(--text-dim)" pointer-events="none"><text x="12" y="76">lenta</text><text x="110" y="74">rápida</text><text x="82" y="101">His</text></g>`;
}
// Brazos (3 a 120°) y muelle de cada torniquete según el motor
export function pintarTorniquete(k, ang, rearme, dureza, luz, cerrado) {
  const T = TORN[k], R = 16, cy = T.y - 4;
  const brazos = [0, 1, 2].map(i => { const a = ang + i * 2 * Math.PI / 3; return { a, x: T.x + R * Math.cos(a), y: cy + R * 0.32 * Math.sin(a), z: Math.sin(a) }; }).sort((p, q) => p.z - q.z);
  let h = '';
  const brazo = b => `<path d="M${T.x} ${cy} L${f1(b.x)} ${f1(b.y)}" stroke="var(--bg-main)" stroke-width="4.2" stroke-linecap="round"/><path d="M${T.x} ${cy} L${f1(b.x)} ${f1(b.y)}" stroke="${luz ? 'var(--text-main)' : 'var(--text-dim)'}" stroke-width="2.8" stroke-linecap="round"/><circle cx="${f1(b.x)}" cy="${f1(b.y)}" r="2" fill="${luz ? 'var(--text-main)' : 'var(--text-dim)'}" stroke="var(--bg-main)" stroke-width=".5"/>`;
  for (const b of brazos) if (b.z < 0) h += brazo(b);
  h += `<rect x="${T.x - 3}" y="${cy - 10}" width="6" height="${T.y + 9 - (cy - 10)}" fill="var(--text-dim)" stroke="var(--text-main)" stroke-width=".5"/><rect x="${T.x - 1.4}" y="${cy - 10}" width="1.2" height="${T.y + 9 - (cy - 10)}" fill="var(--text-main)" fill-opacity=".45"/><ellipse cx="${T.x}" cy="${cy - 10}" rx="3" ry="1.1" fill="var(--text-main)"/>`;
  for (const b of brazos) if (b.z >= 0) h += brazo(b);
  $(`rtv-brazos-${k}`).innerHTML = h;
  // el muelle: de la columna del torniquete al marco; más espiras y más grueso cuanto más duro; tenso mientras rearma
  const x0 = T.x + 3.5, x1 = T.g1 - 1, y = cy - 7, n = Math.round(4 + 4 * (dureza - 1)), largo = x1 - x0;
  const paso = largo / (n + 1) * (0.55 + 0.45 * (1 - rearme));
  let m = `<path d="M${f1(x0)} ${f1(y)} L${f1(x1)} ${f1(y)}" stroke="var(--text-muted)" stroke-width=".6"/>`;
  for (let i = 1; i <= n; i++) m += `<ellipse cx="${f1(x1 - i * paso)}" cy="${f1(y)}" rx="1.6" ry="4.4" fill="none" stroke="var(--text-main)" stroke-width="${f1(0.7 + 0.55 * (dureza - 1))}"/>`;
  m += `<rect x="${f1(x1 - 1)}" y="${f1(y - 4)}" width="2" height="8" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".4"/>`;
  $(`rtv-muelle-${k}`).innerHTML = m;
  // la galga de rearme sobre la base
  const ar = clamp(rearme, 0, 1), a0 = Math.PI * 0.12, a1 = Math.PI * 0.88, aa = a0 + (a1 - a0) * ar;
  const p = a => [T.x + 15 * Math.cos(a), T.y + 10 + 4 * Math.sin(a)];
  $(`rtv-rearme-${k}`).setAttribute('d', ar > 0.01 ? `M${pts([p(a0)])} A15 4 0 0 1 ${pts([p(aa)])}` : '');
  const lamp = $(`rtv-lampara-${k}`);
  lamp.setAttribute('fill', cerrado ? 'var(--accent-red)' : rearme >= 0.999 ? 'var(--accent-green)' : 'var(--bg-main)');
}

// ---------- 3. La lupa de la célula: voltímetro, potencial de acción y canales ----------
export const VOLT = { x: 36, y: 62, r: 25 };
export const angV = v => (-215 + (clamp(v, -100, 50) + 100) / 150 * 250) * Math.PI / 180;
function celulaEstatica() {
  let h = `<rect x="0" y="0" width="174" height="108" rx="9" fill="var(--card2)" stroke="var(--border-color)"/>
    <rect x="8" y="14" width="158" height="90" rx="6" fill="var(--bg-main)" stroke="var(--text-main)" stroke-opacity=".5" stroke-width=".7"/>
    ${[[5, 5], [169, 5], [5, 103], [169, 103]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="none" stroke="var(--text-muted)" stroke-width=".6"/><circle cx="${x}" cy="${y}" r=".6" fill="var(--text-muted)"/>`).join('')}
    <text id="rtv-cel-tit" x="12" y="10.5" font-size="9.5" fill="var(--text-dim)" font-weight="600" letter-spacing=".05em">LA CÉLULA DEL VENTRÍCULO</text>
    <g id="rtv-volt">
      <circle cx="${VOLT.x}" cy="${VOLT.y + 2}" r="${VOLT.r + 4}" fill="var(--bg-main)" fill-opacity=".6"/>
      <circle cx="${VOLT.x}" cy="${VOLT.y}" r="${VOLT.r + 3}" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".6"/>
      <circle cx="${VOLT.x}" cy="${VOLT.y}" r="${VOLT.r}" fill="var(--text-main)" stroke="var(--bg-main)" stroke-width=".6"/>`;
  for (let v = -100; v <= 50; v += 10) { const a = angV(v), M = v % 50 === 0, r0 = VOLT.r - (M ? 6 : 3.5); h += `<line x1="${f1(VOLT.x + r0 * Math.cos(a))}" y1="${f1(VOLT.y + r0 * Math.sin(a))}" x2="${f1(VOLT.x + (VOLT.r - 1) * Math.cos(a))}" y2="${f1(VOLT.y + (VOLT.r - 1) * Math.sin(a))}" stroke="var(--bg-main)" stroke-width="${M ? 1 : .5}"/>`; }
  const arco = (v0, v1, r) => { const a0 = angV(v0), a1 = angV(v1); return `M${f1(VOLT.x + r * Math.cos(a0))} ${f1(VOLT.y + r * Math.sin(a0))} A${r} ${r} 0 0 1 ${f1(VOLT.x + r * Math.cos(a1))} ${f1(VOLT.y + r * Math.sin(a1))}`; };
  h += `<path d="${arco(-100, 50, VOLT.r - 1)}" fill="none" stroke="var(--bg-main)" stroke-width=".6"/>
      <text x="${VOLT.x}" y="${VOLT.y + 14}" font-size="9.5" fill="var(--bg-main)" text-anchor="middle">mV</text>
      <text x="${f1(VOLT.x + 13 * Math.cos(angV(-90)))}" y="${f1(VOLT.y + 13 * Math.sin(angV(-90)) + 3)}" font-size="9.5" fill="var(--bg-main)" text-anchor="middle">-90</text>
      <text x="${f1(VOLT.x + 13 * Math.cos(angV(0)))}" y="${f1(VOLT.y + 13 * Math.sin(angV(0)) + 3)}" font-size="9.5" fill="var(--bg-main)" text-anchor="middle">0</text>
      <path id="rtv-aguja" d="" stroke="var(--bg-main)" stroke-width="1.4" stroke-linecap="round"/>
      <circle cx="${VOLT.x}" cy="${VOLT.y}" r="2.6" fill="var(--accent-yellow)" stroke="var(--bg-main)" stroke-width=".6"/>
      <rect x="${VOLT.x - 12}" y="${VOLT.y + VOLT.r + 3}" width="24" height="7" rx="1.5" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".4"/>
      <circle cx="${VOLT.x - 7}" cy="${VOLT.y + VOLT.r + 6.5}" r="1.4" fill="var(--bg-main)"/><circle cx="${VOLT.x + 7}" cy="${VOLT.y + VOLT.r + 6.5}" r="1.4" fill="var(--bg-main)"/>
    </g>
    <g id="rtv-pa-traza"><rect x="70" y="17" width="92" height="46" rx="3" fill="var(--card2)" stroke="var(--text-main)" stroke-opacity=".35" stroke-width=".5"/>
      <line x1="72" y1="${yPA(0)}" x2="160" y2="${yPA(0)}" stroke="var(--text-muted)" stroke-width=".4" stroke-dasharray="2 2"/>
      <path id="rtv-pa-linea" d="" fill="none" stroke="var(--accent-yellow)" stroke-width="1.2" stroke-linejoin="round"/>
      <g id="rtv-pa-fases" font-size="9.5" fill="var(--text-main)" text-anchor="middle"></g></g>
    <g id="rtv-canales">
      <rect x="70" y="72" width="92" height="12" fill="var(--text-dim)" fill-opacity=".22"/>
      <line x1="70" y1="72" x2="162" y2="72" stroke="var(--text-main)" stroke-width=".6"/><line x1="70" y1="84" x2="162" y2="84" stroke="var(--text-main)" stroke-width=".6"/>
      ${Array.from({ length: 23 }, (_, i) => `<circle cx="${72 + i * 4}" cy="73.6" r="1" fill="var(--text-dim)" fill-opacity=".55"/><circle cx="${72 + i * 4}" cy="82.4" r="1" fill="var(--text-dim)" fill-opacity=".55"/>`).join('')}
      ${['na', 'ca', 'k'].map((c, i) => `<g id="rtv-canal-${c}" transform="translate(${88 + i * 30} 78)"></g>`).join('')}
      <g font-size="9.5" fill="var(--text-dim)" text-anchor="middle"><text x="88" y="96">Na⁺</text><text x="118" y="96">Ca²⁺</text><text x="148" y="96">K⁺</text></g>
    </g>`;
  return h;
}
export function yPA(v) { return 20 + (50 - clamp(v, -100, 50)) / 150 * 40; }
export function canalHtml(abierto, tapon, luz) {
  const g = abierto ? 3.2 : 0.6;
  return `<rect x="${-6 - g / 2}" y="-8" width="6" height="16" rx="2" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".5"/><rect x="${g / 2}" y="-8" width="6" height="16" rx="2" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".5"/>` +
    (abierto ? `<rect x="${-g / 2}" y="-6" width="${g}" height="12" fill="${luz ? 'var(--text-main)' : 'var(--accent-yellow)'}" fill-opacity=".9"/>` : '') +
    (tapon ? `<path d="M-5 -12 L5 -12 L3 -8 L-3 -8 Z" fill="var(--accent-red)" stroke="var(--text-main)" stroke-width=".5"/>` : '');
}
// El potencial de acción de una tesela (forma: El Libro Azul, -90 → +45 mV, ~300 ms, 5 fases; el nodo: fisiología general)
export function potencial(tau, apd, nodo, k) {
  const reposo = -90 + 6.4 * Math.max(0, (k || 4.2) - 4.6), pico = 45 - 6 * Math.max(0, (k || 4.2) - 5.5), sub = 0.0022 * (1 + 1.6 * Math.max(0, (k || 4.2) - 6.5));
  if (nodo) {   // célula del nodo: subida lenta (Ca²⁺), sin meseta
    const rep = -65; if (tau < 0) return rep; if (tau < 0.05) return rep + (20 + 65) * Math.sin(Math.PI / 2 * tau / 0.05);
    if (tau < apd) return 20 - (20 - rep) * (1 - Math.cos(Math.PI * (tau - 0.05) / (apd - 0.05))) / 2; return rep;
  }
  if (tau < 0 || tau > apd + 0.02) return reposo;
  if (tau < sub) return reposo + (pico - reposo) * tau / sub;                        // fase 0
  if (tau < 0.014) return pico - (pico - 18) * (tau - sub) / (0.014 - sub);          // fase 1
  const p2 = 0.62 * apd;
  if (tau < p2) return 18 - 16 * (tau - 0.014) / (p2 - 0.014);                        // fase 2
  if (tau < apd) return 2 - (2 - reposo) * (1 - Math.cos(Math.PI * (tau - p2) / (apd - p2))) / 2;   // fase 3
  return reposo;                                                                       // fase 4
}
export function fase(tau, apd, nodo) {
  if (nodo) return tau < 0 || tau >= apd ? 4 : tau < 0.05 ? 0 : 3;
  if (tau < 0 || tau >= apd) return 4; if (tau < 0.003) return 0; if (tau < 0.014) return 1; if (tau < 0.62 * apd) return 2; return 3;
}

// ---------- 4. Los aparatos: el grabado rápido y la bomba de las piezas comunes (js/core/dibujo-iso.js, js/core/bomba.js).
// Isometría de 30°; aquí solo se colocan (OB: la bomba; OD: el desfibrilador) y se pasan las cajas a la pieza común.
export const OB = I.isometrica({ x: 66, y: 60, k: 1.18 }), OD = I.isometrica({ x: 246, y: 44 });
const isoP = (o, x, y, z) => o.iso([x, y, z]);
const isoPath = (o, ps) => I.camino(ps.map(o.iso), true);
const caja = (o, x, y, z, w, d, hh, t = {}) => I.caja3(o, [x, y, z], [w, d, hh], { tonos: { sup: t.top, supOp: t.topOp, claro: t.izq, oscuro: t.der } });
const caraY = (o, x, y, z) => I.caraMatriz(o, [x, y, z], [1, 0, 0], [0, 0, -1]);
const tornillo = (o, x, y, z) => { const p = o.iso([x, y, z]); return I.tornillo(p[0], p[1], 1.1); };
export const bombaDe = b => bomba(OB, { l1: b ? b.nombre : 'EN ESPERA', l2: b ? b.dosis : '', avance: b ? 0.35 : 0, idEmbolo: 'rtv-embolo' });
export function aparatosEstatico() {
  let h = `<defs><pattern id="rtv-rejilla" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="var(--text-main)" fill-opacity=".12"/></pattern></defs>`;
  // Bandeja (el carro)
  h += `<path d="M6 148 L354 148 L354 156 L6 156 Z" fill="var(--card2)" stroke="var(--border-color)"/><path d="M6 148 L354 148" stroke="var(--text-main)" stroke-width=".5" stroke-opacity=".5"/>`;
  // --- Bomba de jeringa (pieza común) ---
  h += `<g id="rtv-bomba"><g id="rtv-bomba-cuerpo">${bombaDe(null)}</g>`;
  // la línea: llave de tres pasos con su jeringa de lavado y el tubo que sale hacia la vía
  const sal = OB.iso(SALIDA);
  h += `<path id="rtv-linea" d="M${f1(sal[0])} ${f1(sal[1])} C 24 44 18 58 12 62 C 8 65 4 66 0 66" fill="none" stroke="var(--text-main)" stroke-width="2.2" stroke-opacity=".75"/>
    <path d="M${f1(sal[0])} ${f1(sal[1])} C 24 44 18 58 12 62 C 8 65 4 66 0 66" fill="none" stroke="var(--bg-main)" stroke-width="1"/>
    <rect x="15" y="52" width="8" height="7" rx="1.2" fill="var(--text-dim)" stroke="var(--text-main)" stroke-width=".5"/><path d="M16 50 L22 50" stroke="var(--text-main)" stroke-width="1.4"/>
    <rect x="16.5" y="34" width="5" height="16" fill="var(--text-main)" fill-opacity=".3" stroke="var(--text-main)" stroke-width=".5"/><rect x="15.5" y="30" width="7" height="4" fill="var(--text-dim)" stroke="var(--text-main)" stroke-width=".5"/>
    <circle id="rtv-bolo" cx="0" cy="0" r="2.4" fill="var(--text-main)" opacity="0"/></g>`;
  // --- Desfibrilador ---
  h += `<g id="rtv-desfib"><ellipse cx="${isoP(OD, 42, 20, 0)[0]}" cy="${isoP(OD, 42, 20, 0)[1] + 4}" rx="66" ry="14" fill="var(--bg-main)" fill-opacity=".7"/>`;
  h += caja(OD, 0, 0, 0, 84, 40, 32, { top: 'var(--text-muted)', topOp: .45 });
  for (const [x, z] of [[3, 3], [81, 3], [3, 29], [81, 29]]) h += tornillo(OD, x, 40, z);
  // asa
  h += caja(OD, 10, 16, 32, 4, 8, 9) + caja(OD, 70, 16, 32, 4, 8, 9) + caja(OD, 10, 16, 41, 64, 8, 3, { top: 'var(--text-dim)', topOp: .5 });
  // pantalla (con su ECG en miniatura), mando de energía y botones
  h += `<path d="${isoPath(OD, [[5, 40, 9], [44, 40, 9], [44, 40, 28], [5, 40, 28]])}" fill="var(--bg-main)" stroke="var(--text-main)" stroke-width=".5"/>
    <g transform="${caraY(OD, 7, 40, 25)}"><text id="rtv-desfib-txt1" x="0" y="0" font-size="10" fill="var(--text-main)" font-weight="700">APAGADO</text><path id="rtv-desfib-ecg" d="" fill="none" stroke="var(--accent-green)" stroke-width=".8" transform="translate(0 3)"/></g>`;
  { const c = isoP(OD, 58, 40, 20); h += `<g transform="${caraY(OD, 58, 40, 20)}"><circle cx="0" cy="0" r="7" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".6"/>${Array.from({ length: 18 }, (_, i) => { const a = i / 18 * 2 * Math.PI; return `<line x1="${f1(6 * Math.cos(a))}" y1="${f1(6 * Math.sin(a))}" x2="${f1(7 * Math.cos(a))}" y2="${f1(7 * Math.sin(a))}" stroke="var(--bg-main)" stroke-width=".4"/>`; }).join('')}<line id="rtv-mando" x1="0" y1="0" x2="0" y2="-5.5" stroke="var(--bg-main)" stroke-width="1.2" stroke-linecap="round"/>${[-120, -60, 0, 60, 120].map(a => `<line x1="${f1(8.4 * Math.sin(a * Math.PI / 180))}" y1="${f1(-8.4 * Math.cos(a * Math.PI / 180))}" x2="${f1(10 * Math.sin(a * Math.PI / 180))}" y2="${f1(-10 * Math.cos(a * Math.PI / 180))}" stroke="var(--text-main)" stroke-width=".5"/>`).join('')}</g>`; void c; }
  h += [['CARGA', 49, 6], ['CHOQUE', 62, 6], ['SINC', 75, 6]].map(([t, x, z], i) => `<path id="rtv-btn-${i}" d="${isoPath(OD, [[x, 40, z], [x + 10, 40, z], [x + 10, 40, z + 6], [x, 40, z + 6]])}" fill="var(--text-muted)" stroke="var(--text-main)" stroke-width=".45"/>`).join('');
  // tomas de los cables en la cara derecha; cables a los parches
  const t1 = isoP(OD, 84, 26, 12), t2 = isoP(OD, 84, 32, 12);
  h += `<circle cx="${f1(t1[0])}" cy="${f1(t1[1])}" r="2" fill="var(--bg-main)" stroke="var(--text-main)" stroke-width=".5"/><circle cx="${f1(t2[0])}" cy="${f1(t2[1])}" r="2" fill="var(--bg-main)" stroke="var(--text-main)" stroke-width=".5"/>
    <path d="M${f1(t1[0])} ${f1(t1[1])} C ${f1(t1[0] + 16)} ${f1(t1[1] + 6)} 342 112 326 128" fill="none" stroke="var(--text-main)" stroke-width="1.2" stroke-opacity=".7"/>
    <path d="M${f1(t2[0])} ${f1(t2[1])} C ${f1(t2[0] + 10)} ${f1(t2[1] + 18)} 300 128 284 136" fill="none" stroke="var(--text-main)" stroke-width="1.2" stroke-opacity=".7"/>
    <g id="rtv-parches-carro"><path d="M316 124 L338 124 L344 132 L322 132 Z" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".6"/><path d="M320 126 L334 126 L338 130 L324 130 Z" fill="var(--text-dim)" fill-opacity=".4"/>
      <path d="M272 132 L294 132 L300 140 L278 140 Z" fill="var(--card2)" stroke="var(--text-main)" stroke-width=".6"/><path d="M276 134 L290 134 L294 138 L280 138 Z" fill="var(--text-dim)" fill-opacity=".4"/></g></g>`;
  // --- Generador de marcapasos (cerrado: pendiente de fuente): lata redondeada, cabezal de epoxi y el cable enrollado ---
  { const cx = 172, cy = 124, rx = 24, ry = 11, gros = 6;
    const lata = (dy) => `M${cx - rx} ${cy + dy} C${cx - rx} ${cy - ry * 1.2 + dy} ${cx + rx} ${cy - ry * 1.2 + dy} ${cx + rx} ${cy + dy} C${cx + rx} ${cy + ry * 1.2 + dy} ${cx - rx} ${cy + ry * 1.2 + dy} ${cx - rx} ${cy + dy} Z`;
    h += `<g id="rtv-marcapasos" opacity=".55"><ellipse cx="${cx}" cy="${cy + gros + 6}" rx="${rx + 6}" ry="${ry - 2}" fill="var(--bg-main)" fill-opacity=".7"/>
      <path d="${lata(gros)}" fill="var(--bg-card)" stroke="var(--text-main)" stroke-width=".55"/>
      <path d="M${cx - rx} ${cy} L${cx - rx} ${cy + gros} M${cx + rx} ${cy} L${cx + rx} ${cy + gros}" stroke="var(--text-main)" stroke-width=".55"/>
      <path d="${lata(0)}" fill="var(--text-muted)" fill-opacity=".75" stroke="var(--text-main)" stroke-width=".6"/>
      <path d="M${cx - rx + 5} ${cy - 2} C${cx - 8} ${cy - 9} ${cx + 8} ${cy - 9} ${cx + rx - 5} ${cy - 2}" fill="none" stroke="var(--text-main)" stroke-opacity=".5" stroke-width=".6"/>
      <ellipse cx="${cx - 4}" cy="${cy + 1}" rx="9" ry="3.4" fill="none" stroke="var(--text-main)" stroke-width=".45" stroke-dasharray="1.2 1.2"/>
      <path d="M${cx - 12} ${cy - 11} L${cx + 6} ${cy - 13} L${cx + 10} ${cy - 20} L${cx - 8} ${cy - 18} Z" fill="var(--text-main)" fill-opacity=".28" stroke="var(--text-main)" stroke-width=".55"/>
      <circle cx="${cx - 3}" cy="${cy - 16}" r="1.5" fill="var(--bg-main)"/><circle cx="${cx + 3}" cy="${cy - 17}" r="1.5" fill="var(--bg-main)"/>
      <path d="M${cx - 3} ${cy - 16} C${cx - 30} ${cy - 30} ${cx - 54} ${cy - 12} ${cx - 40} ${cy + 2} C${cx - 30} ${cy + 12} ${cx - 52} ${cy + 20} ${cx - 66} ${cy + 18}" fill="none" stroke="var(--text-main)" stroke-width="1" stroke-opacity=".6"/>
      <circle cx="${cx - 66}" cy="${cy + 18}" r="1.2" fill="var(--text-main)" fill-opacity=".6"/></g>`; }
  return h;
}
