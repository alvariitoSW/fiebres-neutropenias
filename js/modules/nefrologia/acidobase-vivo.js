// Ácido-base vivo (Nefrología, junto a la nefrona viva). Pasa a la app la maqueta aprobada
// autonomo/maquetas/marino-acidobase-v2.html sin perder nada: el instrumento de latón con el móvil (el pH cuelga
// del cociente PaCO₂ / HCO₃⁻), alvéolo, plasma y riñón en tres saltos, la carta náutica, el laboratorio de 16
// estados y la capa de estudio Explorar | Conceptos | Mayéutica (14 preguntas, repaso y 4 casos).
//
// - Datos clínicos: js/data/acidobase-vivo-data.js. Cálculo (Ec. 31.1-31.17 y Reglas 1-4): acidobase-vivo-calculo.js.
// - Formas de las partículas: js/core/particulas.js (tabla única de js/data/formas-iones.js).
// - Motion con cargarMotion(); con «reducir movimiento», todo va al estado final.
// - Un solo requestAnimationFrame, solo con la vista visible y la pestaña en primer plano.
// - La Mayéutica guarda aciertos y fallos en este dispositivo (localStorage, clave propia; CLAUDE §2).
// - Se abre en un paso o un estado con data-acidobase-vivo="paso-3" o "vomitos" en el enlace cruzado de siempre
//   (home/index.js llama a abrir() a través de la API de Nefrología).
import { cargarMotion, sinMovimiento } from '../../core/motion.js';
import { pintarParticula, svgParticula, leyendaParticulas } from '../../core/particulas.js';
import { nombreFicha } from '../../core/corkboard.js';
import { rutaDePanel } from '../../core/search.js';
import { marcarVolver } from '../../core/volver-ficha.js';
import { CNM, OTROS_A, ALB_A, FUENTES, BASE, PASOS, FRASES_PASO, CAUSAS, CAUSA, CONCEPTOS, PREGUNTAS, CASOS } from '../../data/acidobase-vivo-data.js';
import { hNeq, calcPH, espPaco2, espHco3, haBase, derivar, palabraPH, r1, r2 } from './acidobase-vivo-calculo.js';

// ═════════════════════════════════════════════════════════════════════
// 0 · Utilidades y tokens
// ═════════════════════════════════════════════════════════════════════
let R = null;                  // la raíz de la vista (#abv-raiz): todo se busca dentro
let M = null;                  // Motion, cuando llegue
const QUIETO = sinMovimiento();
const NS = 'http://www.w3.org/2000/svg';
const $ = s => R.querySelector(s);
const $$ = s => [...R.querySelectorAll(s)];
const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let C = null;                  // los tokens de css/variables.css, leídos al construir
const leerTokens = () => ({ fondo: tok('--bg-main'), crema: tok('--text-main'), dim: tok('--text-dim'), muted: tok('--text-muted'),
  verde: tok('--accent-green'), rojo: tok('--accent-red'), ocre: tok('--accent-yellow'), oro: tok('--accent-blue'), ciruela: tok('--accent-purple') });
// transparencia de un token (sin escribir colores nuevos: se calcula desde el token)
const alfa = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
const fmt = (v, d = 0) => { const r = Math.round(v * 10 ** d) / 10 ** d; return (Object.is(r, -0) ? 0 : r).toFixed(d).replace('.', ','); };
const fmtA = v => fmt(v, Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1);       // 26 o 25,6
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const enFotograma = (n, fn) => (n > 0 ? requestAnimationFrame(() => enFotograma(n - 1, fn)) : fn());
const suave = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const azar = (a, b) => a + Math.random() * (b - a);
function el(tag, at = {}, padre) { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; }
// Chip de origen. 'f' = ficha (con ficha#elemento), 'g' = fisiología general, 'i' = ilustrativo.
// Varios chips juntos, plegados en una línea («De dónde sale»), para no apilarlos bajo cada figura
const plegarOrigen = html => { const n = (html.match(/class="abv-org /g) || []).length; return n <= 1 ? html : `<details class="abv-fuentes-mini"><summary>Fuentes (${n})</summary><span class="abv-origenes">${html}</span></details>`; };
// Las de tipo «ficha» con su ficha#elemento son un botón con el nombre de la ficha (y de la línea) que la abre y la
// resalta: el id interno no se ve.
const REF_FICHA = /^((?:mr|mt|mar|fisio|neumo)-[\w-]+)(?:#([\wñ-]+))?(?: · (.+))?$/;
const O = (t, x) => {
  const m = t === 'f' && x && REF_FICHA.exec(x);
  const at = m && attrFicha(m[1] + (m[2] ? '#' + m[2] : ''));
  if (at) return `<button type="button" class="abv-org abv-org-f abv-org-btn" ${at}>📖 ${etiquetaFicha(m[1], m[2])}${m[3] ? ' · ' + m[3] : ''}</button>`;
  return `<span class="abv-org abv-org-${t}">${{ f: 'ficha', g: 'fisiología general', i: 'ilustrativo' }[t]}${x ? ' · ' + x : ''}</span>`;
};
const orgDe = lista => lista.map(([t, x]) => O(t, x)).join('');
// Escritura de textos que se repintan a menudo: si el HTML no cambia, no se toca el DOM (cada escritura obliga a
// recalcular estilos y maquetar; era lo que alargaba los fotogramas al cambiar de paso)
const html = sel => { const e = $(sel); return { set innerHTML(h) { if (e && e._h !== h) { e.innerHTML = h; e._h = h; } } }; };

// Formas de las partículas: las de la tabla única (js/core/particulas.js). Los nombres cortos de la maqueta → especie.
const ESPECIE = { circ: 'na', cuad: 'k', rombo: 'cl', tri: 'hco3', cruz: 'h', pent: 'nh4', estrella: 'anion', voluta: 'co2', hex: 'urea' };
const icono = (k, s = 1) => svgParticula(k, 0, 0, 3.5 * s);              // SVG centrado en 0,0
function dibujo(c, forma, x, y, r, giro = 0) {                           // lienzo: una partícula, o el destello (anillo) de una reacción
  if (forma === 'anillo') { c.strokeStyle = C.oro; c.lineWidth = 1.3; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); return; }
  pintarParticula(c, ESPECIE[forma] || forma, x, y, r * .8, { giro });
}

const phTxt = (p, h) => fmt(calcPH(p, h), 2);
const oc = k => !!(E.ocultar && E.ocultar.includes(k));   // cifras tapadas con «?» hasta contestar (mayéutica)
let E = { ...BASE };
const estadoDe = (parcial) => ({ ...BASE, ...parcial });
const PASO_E = PASOS.map(p => estadoDe({ ...p.e, obj: p.obj }));

// Patrones de grabado (cada SVG con su prefijo: los ids no se repiten)
function grabado(p) {
  return `<defs>
  <pattern id="${p}-ray" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3.2" stroke="${C.muted}" stroke-width=".55" opacity=".5"/></pattern>
  <pattern id="${p}-cruz" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="3" stroke="${C.muted}" stroke-width=".5" opacity=".4"/></pattern>
  <pattern id="${p}-oro" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="2.6" stroke="${C.oro}" stroke-width=".55" opacity=".55"/></pattern>
  <pattern id="${p}-rojo" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3" stroke="${C.rojo}" stroke-width=".8"/></pattern>
  <pattern id="${p}-verde" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="3" stroke="${C.verde}" stroke-width=".8"/></pattern>
  <pattern id="${p}-pun" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="${C.muted}"/><circle cx="3" cy="3" r=".35" fill="${C.muted}" opacity=".6"/></pattern>
  </defs>`;
}
function semilla(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function ramas(x, y, ang, len, prof, rnd, hojas) {
  if (prof === 0 || len < 3) { hojas.push([x, y]); return ''; }
  const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
  const da = .38 + rnd() * .22;
  return `M${x.toFixed(1)} ${y.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}` + ramas(x2, y2, ang - da, len * .74, prof - 1, rnd, hojas) + ramas(x2, y2, ang + da * .9, len * .7, prof - 1, rnd, hojas);
}
// El pulmón a plumilla de la lámina A (medio pulmón; el otro, en espejo)
const PULMON_IZ = 'M160 82C140 84 116 104 104 132C92 160 88 190 95 212C112 220 142 216 166 206C170 190 165 174 169 158C172 140 168 110 160 82Z';
function pulmonGrabado(p, semillaN = 7) {
  const hojas = [], rnd = semilla(semillaN);
  const arbol = 'M176 120L166 134' + ramas(166, 134, Math.PI + .95, 17, 5, rnd, hojas) + ramas(166, 134, Math.PI + .12, 19, 6, rnd, hojas) + ramas(166, 136, Math.PI - .8, 22, 6, rnd, hojas);
  const alv = hojas.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.7" fill="none" stroke="${C.oro}" stroke-width=".5" opacity=".7"/>`).join('');
  let anillos = ''; for (let y = 52; y <= 116; y += 6) anillos += `<path d="M174 ${y}Q180 ${y + 2.6} 186 ${y}" stroke="${C.oro}" stroke-width=".6" fill="none" opacity=".8"/>`;
  return `<clipPath id="${p}-clip"><path d="${PULMON_IZ}"/></clipPath>
    <g id="${p}-pulmones"><g id="${p}-mitad">
      <path d="${PULMON_IZ}" fill="${C.fondo}" opacity=".9"/><path d="${PULMON_IZ}" fill="url(#${p}-ray)"/>
      <g clip-path="url(#${p}-clip)"><path d="M126 100C100 138 94 180 98 214L128 216C114 182 116 140 140 96Z" fill="url(#${p}-cruz)"/>
        <path d="${arbol}" stroke="${C.oro}" stroke-width=".7" fill="none" opacity=".85"/>${alv}</g>
      <path d="${PULMON_IZ}" fill="none" stroke="${C.oro}" stroke-width="1.1"/></g>
      <use href="#${p}-mitad" transform="translate(360 0) scale(-1 1)"/></g>
    <path d="M174 40V118L160 132M186 40V118L200 132" fill="none" stroke="${C.oro}" stroke-width="1"/>${anillos}`;
}

// ═════════════════════════════════════════════════════════════════════
// 4 · El instrumento: esfera de latón (A) + móvil de la Ec. 31.2 (C)
// ═════════════════════════════════════════════════════════════════════
const HUB = { x: 180, y: 124 }, RD = 104;
const angPH = ph => (clamp(ph, 6.8, 7.8) - 7.4) * 150;            // grados desde la vertical; 7,40 arriba
const pol = (r, a) => { const t = a * Math.PI / 180; return [HUB.x + r * Math.sin(t), HUB.y - r * Math.cos(t)]; };
const arcoD = (r, a0, a1) => { const [x0, y0] = pol(r, a0), [x1, y1] = pol(r, a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
const PIV = { x: 180, y: 186 }, BRAZO = 104, CUELGA = 50;
const INST = { ang: 0, psi: 0, nodos: {}, fichasL: [], fichasR: [], vuelos: [], fase: 0 };
let angMV = null;             // valor de Motion de la aguja (con muelle), cuando llegue Motion

function construirInstrumento() {
  const svg = $('#abv-inst');
  let t = grabado('abv-i');
  const rH = RD - 20;                                               // borde exterior de la luna de [H⁺]
  // la luna de la Fig. 31.1: su grosor es la [H⁺] (gruesa en la acidemia, fina en la alcalemia)
  let ext = '', int = '';
  for (let ph = 6.8; ph <= 7.8001; ph += .02) {
    const a = angPH(ph), H = 10 ** (9 - ph), [x, y] = pol(rH, a), [xi, yi] = pol(rH - H * .15, a);
    ext += `${ext ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; int = `L${xi.toFixed(1)} ${yi.toFixed(1)}` + int;
  }
  t += `<path id="abv-i-luna" d="${ext}${int}Z" fill="url(#abv-i-ray)" stroke="${C.muted}" stroke-width=".6" opacity=".95"/>`;
  for (const H of [100, 63, 40, 25, 16]) {
    const ph = 9 - Math.log10(H), a = angPH(ph), [x0, y] = pol(rH - H * .15 - 7, a);
    const x = H === 100 ? x0 - 3.5 : x0;                              // el «100», un poco fuera: no roza la esfera
    t += `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle" font-size="8.4" font-style="italic" fill="${C.muted}" class="abv-t-h">${H}</text>`;
  }
  { const [x, y] = pol(rH - 4, -100); t += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="7.6" font-style="italic" fill="${C.muted}" text-anchor="middle" class="abv-t-h">[H⁺]</text>`; }
  // arco de latón con sus tres tramos (y su forma: rayado, liso, contrarrayado)
  t += `<path d="${arcoD(RD + 7, -93, 63)}" fill="none" stroke="${C.oro}" stroke-width=".9"/>`;
  const banda = (ph0, ph1, fill, st) => { const a0 = angPH(ph0), a1 = angPH(ph1), r0 = RD - 8, r1 = RD;
    const [x0, y0] = pol(r1, a0), [x1, y1] = pol(r1, a1), [x2, y2] = pol(r0, a1), [x3, y3] = pol(r0, a0);
    return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)}A${r1} ${r1} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}A${r0} ${r0} 0 0 0 ${x3.toFixed(1)} ${y3.toFixed(1)}Z" fill="${fill}" stroke="${st}" stroke-width=".6"/>`; };
  t += banda(6.8, 7.36, 'url(#abv-i-rojo)', C.rojo) + banda(7.36, 7.44, alfa(C.oro, .45), C.oro) + banda(7.44, 7.8, 'url(#abv-i-verde)', C.verde);
  for (let i = 0; i <= 20; i++) {
    const ph = 6.8 + i * .05, a = angPH(ph), mayor = i % 2 === 0, [x0, y0] = pol(RD - 8, a), [x1, y1] = pol(RD - 8 - (mayor ? 7 : 3.5), a);
    t += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${C.oro}" stroke-width="${mayor ? .9 : .5}"/>`;
    if (i % 4 === 0) { const [lx, ly] = pol(RD + 16, a); t += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" font-size="${i === 12 ? 12 : 10.5}" fill="${i === 12 ? C.crema : C.oro}" class="abv-t-ph">${fmt(ph, 1)}</text>`; }
  }
  t += `<text x="46" y="146" text-anchor="middle" font-size="9.5" font-style="italic" fill="${C.rojo}" class="abv-t-lado">✚ ácido</text>`;
  t += `<text x="300" y="94" text-anchor="middle" font-size="9.5" font-style="italic" fill="${C.verde}" class="abv-t-lado">▲ alcalino</text>`;
  // tendencia (paso 5): arco discontinuo
  t += `<path id="abv-i-tend" d="" fill="none" stroke="${C.verde}" stroke-width="1.6" stroke-dasharray="3 3" opacity="0"/>`;
  // la varilla y el móvil
  t += `<path d="M${HUB.x} ${HUB.y}V${PIV.y}" stroke="${C.oro}" stroke-width="1.4"/>
    <g id="abv-i-cuerpo">
      <path d="M${PIV.x - BRAZO} ${PIV.y - 2}L${PIV.x} ${PIV.y - 4.5}L${PIV.x + BRAZO} ${PIV.y - 2}V${PIV.y + 2}L${PIV.x} ${PIV.y + 4.5}L${PIV.x - BRAZO} ${PIV.y + 2}Z" fill="${alfa(C.oro, .22)}" stroke="${C.oro}" stroke-width=".9"/>
      <circle cx="${PIV.x - BRAZO}" cy="${PIV.y}" r="2.6" fill="${C.fondo}" stroke="${C.oro}"/><circle cx="${PIV.x + BRAZO}" cy="${PIV.y}" r="2.6" fill="${C.fondo}" stroke="${C.oro}"/>
    </g>
    <circle cx="${PIV.x}" cy="${PIV.y}" r="4.5" fill="${C.fondo}" stroke="${C.oro}" stroke-width="1.1"/><circle cx="${PIV.x}" cy="${PIV.y}" r="1.6" fill="${C.oro}"/>`;
  for (const lado of ['L', 'R']) {
    t += `<path id="abv-i-hilos${lado}" d="" fill="none" stroke="${C.oro}" stroke-width=".7" stroke-dasharray="2.2 1.6" opacity=".85"/>
      <g id="abv-i-plato${lado}"><path d="M-40 0Q0 13 40 0Z" fill="${alfa(C.oro, .25)}" stroke="${C.oro}" stroke-width="1"/><g id="abv-i-pila${lado}"></g></g>`;
  }
  // órganos en miniatura, grabados: pulmón a la izquierda, riñón a la derecha
  t += `<g id="abv-i-org-pulmon" transform="translate(22 272)">
      <ellipse id="abv-i-aura-p" cx="40" cy="22" rx="46" ry="26" fill="${alfa(C.oro, .12)}" opacity="0"/>
      <g id="abv-i-lob" transform="translate(-14 -10) scale(.3)">${pulmonMini()}</g>
      <text x="96" y="20" font-size="12.5" fill="${C.oro}" id="abv-i-lee-p">PaCO₂ 40</text>
      <text x="96" y="33" font-size="9" font-style="italic" fill="${C.muted}" class="abv-t-sub">la carga el pulmón</text></g>
    <g id="abv-i-org-rinon" transform="translate(196 272)">
      <ellipse id="abv-i-aura-r" cx="104" cy="22" rx="40" ry="26" fill="${alfa(C.verde, .14)}" opacity="0"/>
      <path d="M118 2C138 0 150 14 149 31C148 46 136 52 123 51C110 50 103 44 106 35C108 30 110 27 108 22C104 14 103 4 118 2Z" fill="url(#abv-i-ray)" stroke="${C.oro}" stroke-width="1"/>
      <path d="M107 30C99 34 96 42 96 50" fill="none" stroke="${C.oro}" stroke-width=".8"/>
      <path d="M116 14C124 18 128 26 124 34M122 9C134 14 140 24 136 38" fill="none" stroke="${C.oro}" stroke-width=".5" opacity=".7"/>
      <text x="92" y="20" text-anchor="end" font-size="12.5" fill="${C.verde}" id="abv-i-lee-r">HCO₃⁻ 24</text>
      <text x="92" y="33" text-anchor="end" font-size="9" font-style="italic" fill="${C.muted}" class="abv-t-sub">la carga el riñón</text></g>`;
  // aguja (encima de todo menos del disco)
  const [nx, ny] = [HUB.x, HUB.y - RD + 4];
  t += `<g id="abv-i-aguja"><path d="M${HUB.x - 2.6} ${HUB.y - 46}L${nx} ${ny}L${HUB.x + 2.6} ${HUB.y - 46}Z" fill="${C.oro}"/><path d="M${nx} ${ny - 6}l4 7h-8z" fill="${C.oro}"/></g>`;
  // disco del pH (el número grande, con su palabra y su icono: nunca solo color)
  t += `<circle id="abv-i-disco" cx="${HUB.x}" cy="${HUB.y}" r="50" fill="${C.fondo}" stroke="${C.oro}" stroke-width="1.3"/>
    <circle cx="${HUB.x}" cy="${HUB.y}" r="45.5" fill="none" stroke="${C.oro}" stroke-width=".4" opacity=".7"/>
    <text x="${HUB.x}" y="${HUB.y - 25}" text-anchor="middle" font-size="11" font-style="italic" fill="${C.muted}">pH</text>
    <text id="abv-i-ph" x="${HUB.x}" y="${HUB.y + 14}" text-anchor="middle" font-size="46" fill="${C.crema}" style="font-variant-numeric:tabular-nums">7,40</text>
    <g id="abv-i-pal-ico" transform="translate(${HUB.x - 30} ${HUB.y + 28})"></g>
    <text id="abv-i-pal" x="${HUB.x + 5}" y="${HUB.y + 31}" text-anchor="middle" font-size="8" letter-spacing="1.2" fill="${C.dim}" style="font-family:${'system-ui, sans-serif'};font-weight:600">NORMAL</text>`;
  // capa de vuelos (fichas que viajan)
  t += `<g id="abv-i-vuelos"></g>`;
  svg.innerHTML = t;
  const n = INST.nodos;
  ['i-aguja', 'i-cuerpo', 'i-platoL', 'i-platoR', 'i-pilaL', 'i-pilaR', 'i-hilosL', 'i-hilosR', 'i-ph', 'i-pal', 'i-pal-ico', 'i-lob', 'i-aura-p', 'i-aura-r', 'i-lee-p', 'i-lee-r', 'i-vuelos', 'i-tend']
    .forEach(id => n[id] = svg.querySelector('#abv-' + id));
}
function pulmonMini() {   // el mismo pulmón grabado, reducido (sin ids: se usa una vez)
  return `<path d="${PULMON_IZ}" fill="url(#abv-i-ray)" stroke="${C.oro}" stroke-width="3.4"/>
    <path d="${PULMON_IZ}" transform="translate(360 0) scale(-1 1)" fill="url(#abv-i-ray)" stroke="${C.oro}" stroke-width="3.4"/>
    <path d="M174 40V118L150 140M186 40V118L210 140" fill="none" stroke="${C.oro}" stroke-width="3.4"/>`;
}
// posición de la ficha i en la pila (pirámide de 7, 6, 5…)
const posFicha = i => { let r = 0, cap = 7, k = i; while (k >= cap) { k -= cap; r++; cap = Math.max(1, cap - 1); } return { x: (k - (cap - 1) / 2) * 10.6, y: -7 - r * 9.6 }; };
function pintarMovil() {
  const n = INST.nodos, a = INST.ang;
  n['i-aguja'].setAttribute('transform', `rotate(${a.toFixed(2)} ${HUB.x} ${HUB.y})`);
  const psi = clamp(a * .2, -14, 14); INST.psi = psi;
  n['i-cuerpo'].setAttribute('transform', `rotate(${psi.toFixed(2)} ${PIV.x} ${PIV.y})`);
  const p = psi * Math.PI / 180;
  for (const [lado, s] of [['L', -1], ['R', 1]]) {
    const ex = PIV.x + s * BRAZO * Math.cos(p), ey = PIV.y + s * BRAZO * Math.sin(p), py = ey + CUELGA;
    n['i-plato' + lado].setAttribute('transform', `translate(${ex.toFixed(1)} ${py.toFixed(1)})`);
    n['i-hilos' + lado].setAttribute('d', `M${(ex - 38).toFixed(1)} ${py.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${(ex + 38).toFixed(1)} ${py.toFixed(1)}`);
    INST['abs' + lado] = { x: ex, y: py };
  }
}
// número de fichas de cada platillo (ilustrativo: 1 ficha ≈ 4 mmHg de CO₂ o 2,4 mEq/L de HCO₃⁻; a 40/24, diez y diez)
const nCO2 = p => Math.round(p / 4), nHCO3 = h => Math.round(h / 2.4);
function ajustarFichas(animar, modo) {
  const pilaL = INST.nodos['i-pilaL'], pilaR = INST.nodos['i-pilaR'];
  const quiereL = nCO2(E.paco2), quiereR = nHCO3(E.hco3);
  let cambio = false;
  while (INST.fichasL.length > quiereL) { const g = INST.fichasL.pop(); const p = absFicha('L', INST.fichasL.length); g.remove(); cambio = true; if (animar) vueloCO2Sale(p, modo); }
  while (INST.fichasL.length < quiereL) { const i = INST.fichasL.length, f = posFicha(i), g = el('g', { transform: `translate(${f.x} ${f.y})` }, pilaL); g.innerHTML = icono('co2', .95); INST.fichasL.push(g); cambio = true; if (animar) vueloCO2Entra(g, f, modo); }
  while (INST.fichasR.length > quiereR) { const g = INST.fichasR.pop(); const p = absFicha('R', INST.fichasR.length); g.remove(); cambio = true; if (animar) vueloHCO3Sale(p, modo); }
  while (INST.fichasR.length < quiereR) { const i = INST.fichasR.length, f = posFicha(i), g = el('g', { transform: `translate(${f.x} ${f.y})` }, pilaR); g.innerHTML = icono('hco3', 1.05); INST.fichasR.push(g); cambio = true; if (animar) vueloHCO3Entra(g, f, modo); }
  return cambio;
}
function absFicha(lado, i) { const f = posFicha(i), a = INST['abs' + lado] || { x: 0, y: 0 }; return { x: a.x + f.x, y: a.y + f.y }; }

// Vuelos: fichas que viajan entre los platillos y los órganos (curva de Catmull-Rom; sin Motion: un solo rAF)
function catmull(pts, t) {
  const n = pts.length - 1, s = Math.min(n - 1e-6, t * n), i = Math.floor(s), u = s - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  const f = (a, b, c, d) => .5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
}
function volar(html, pts, dur, op = {}) {
  if (QUIETO || INST.vuelos.length > 26) return Promise.resolve();
  const g = el('g', { opacity: 0 }, INST.nodos['i-vuelos']); g.innerHTML = html;
  return new Promise(res => INST.vuelos.push({ g, pts, dur, t0: performance.now() + (op.retraso || 0), op, res }));
}
function moverVuelos(ahora) {
  for (let i = INST.vuelos.length - 1; i >= 0; i--) {
    const v = INST.vuelos[i], t = (ahora - v.t0) / v.dur;
    if (t < 0) continue;
    const k = suave(clamp(t, 0, 1)), p = catmull(v.pts, k);
    const s = v.op.escala ? lerp(v.op.escala[0], v.op.escala[1], k) : 1, o = v.op.opac ? lerp(v.op.opac[0], v.op.opac[1], k) : 1;
    v.g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${((v.op.giro || 0) * k).toFixed(0)}) scale(${s.toFixed(3)})`);
    v.g.setAttribute('opacity', o.toFixed(2));
    if (t >= 1) { INST.vuelos.splice(i, 1); v.g.remove(); v.res(); }
  }
}
const PULMON_P = { x: 60, y: 290 }, RINON_P = { x: 320, y: 294 }, BOCA = { x: 8, y: 8 };
function exhalar(desde) { return volar(icono('co2', 1), [desde, { x: desde.x - 6, y: desde.y - 30 }, { x: desde.x - azar(10, 30), y: desde.y - azar(60, 90) }], 1600, { escala: [1, 2], opac: [1, 0], giro: azar(-120, 120) }); }
function vueloCO2Sale(p, modo) {      // el pulmón sopla: la ficha va al pulmón y sale como voluta
  volar(icono('co2', .95), [p, { x: p.x - 10, y: p.y + 20 }, PULMON_P], 900).then(() => exhalar({ x: 20, y: 270 }));
}
function vueloCO2Entra(g, f, modo) {  // el pulmón retiene: la ficha sube del pulmón al platillo
  g.setAttribute('opacity', 0);
  const fin = absFicha('L', INST.fichasL.indexOf(g));
  volar(icono('co2', .95), [PULMON_P, { x: PULMON_P.x + 10, y: PULMON_P.y - 30 }, fin], 1000).then(() => g.setAttribute('opacity', 1));
}
function vueloHCO3Sale(p, modo) {
  if (modo === 'orina' || modo === 'acetazolamida') {   // la pendrina o el proximal lo tiran a la orina
    volar(icono('hco3', 1.05), [p, { x: p.x + 14, y: p.y + 30 }, RINON_P, { x: RINON_P.x, y: 330 }], 1300, { opac: [1, .2] });
    return;
  }
  // H⁺ + HCO₃⁻ → CO₂ + H₂O: el triángulo sube, se cruza con una cruz y nace una voluta que va al pulmón
  const m = { x: lerp(p.x, HUB.x, .55), y: Math.min(p.y - 40, HUB.y + 62) };
  volar(icono('h', 1), [{ x: 356, y: m.y - 30 }, { x: m.x + 30, y: m.y - 10 }, m], 800);
  volar(icono('hco3', 1.05), [p, { x: p.x - 6, y: p.y - 26 }, m], 800).then(() => {
    volar(`<circle r="4" fill="none" stroke="${C.oro}" stroke-width="1.3"/>`, [m, m], 500, { escala: [1, 4], opac: [1, 0] });
    volar(icono('co2', 1), [m, { x: m.x - 60, y: m.y + 30 }, PULMON_P], 1300).then(() => exhalar({ x: 20, y: 270 }));
  });
}
function vueloHCO3Entra(g, f, modo) {
  g.setAttribute('opacity', 0);
  const fin = absFicha('R', INST.fichasR.indexOf(g));
  if (modo === 'vomito') {             // cada H⁺ vomitado deja un HCO₃⁻: la cruz se va por la boca
    const m = { x: fin.x - 20, y: fin.y - 40 };
    volar(icono('h', 1), [m, { x: m.x - 80, y: m.y - 60 }, BOCA], 1200, { opac: [1, .3] });
    volar(icono('hco3', 1.05), [m, fin], 900).then(() => g.setAttribute('opacity', 1));
    return;
  }
  const desde = modo === 'rinon' ? RINON_P : { x: fin.x + azar(-20, 20), y: fin.y - 70 };
  volar(icono('hco3', 1.05), [desde, { x: lerp(desde.x, fin.x, .5) - 10, y: lerp(desde.y, fin.y, .5) - 20 }, fin], 1100).then(() => g.setAttribute('opacity', 1));
}

// Pinta el instrumento desde el estado (números al momento; la aguja con muelle)
let ultimoObjetivo = null;
let textoT = 0;
function pintarInstrumento(animar, fotograma) {
  const textos = !fotograma || performance.now() - textoT > 120;   // en las transiciones, las cifras se reescriben ~8 veces por segundo
  if (textos) textoT = performance.now();
  const d = derivarRapido();
  const n = INST.nodos, ph = d.ph;
  const tend = E.tendencia;
  n['i-ph'].textContent = tend ? '↓' : oc('ph') ? '?' : fmt(ph, 2);
  const pal = tend ? 'tendencia' : oc('ph') ? '?' : palabraPH(ph);
  n['i-pal'].textContent = pal === 'acidemia' ? 'ACIDEMIA' : pal === 'alcalemia' ? 'ALCALEMIA' : pal === 'normal' ? 'NORMAL' : pal === '?' ? '¿?' : 'TENDENCIA';
  n['i-pal'].setAttribute('fill', pal === 'acidemia' ? C.rojo : pal === 'alcalemia' ? C.verde : C.dim);
  n['i-pal-ico'].innerHTML = pal === 'acidemia' ? icono('h', 1.05) : pal === 'alcalemia' ? icono('hco3', 1.05) : `<circle r="3.2" fill="${C.crema}"/>`;   // la palabra lleva su forma: nunca solo color
  n['i-lee-p'].textContent = tend ? 'PaCO₂ ↓' : `PaCO₂ ${fmtA(E.paco2)}`;
  n['i-lee-r'].textContent = tend ? (E.farmaco === 'bicarbonato' ? 'HCO₃⁻ ↑' : 'HCO₃⁻ ↓') : `HCO₃⁻ ${fmtA(E.hco3)}`;
  if (tend && E.farmaco === 'bicarbonato') n['i-lee-p'].textContent = 'PaCO₂ ↑ si no ventilas';
  // la aguja: el muelle de Motion (stiffness 120, damping 14); con «reducir movimiento», el final
  const phAguja = tend && E.paciente === 'B' ? calcPH(PASO_E[5].paco2, PASO_E[5].hco3) : ph;   // en la tendencia, la aguja sale del punto de partida
  const objetivo = angPH(phAguja);
  if (QUIETO || !animar || !angMV) { if (angMV) (angMV.jump ? angMV.jump(objetivo) : angMV.set(objetivo)); INST.ang = objetivo; pintarMovil(); }
  else if (ultimoObjetivo === null || Math.abs(objetivo - ultimoObjetivo) > .35) { M.animate(angMV, objetivo, { type: 'spring', stiffness: 120, damping: 14 }); }
  ultimoObjetivo = objetivo;
  // tendencia: arco discontinuo desde el pH de partida
  const tg = n['i-tend'];
  if (tend) { const a0 = angPH(phAguja), a1 = E.farmaco === 'bicarbonato' ? a0 + 18 : a0 - 18; tg.setAttribute('d', a1 > a0 ? arcoD(RD - 13, a0, a1) : arcoD(RD - 13, a1, a0)); tg.setAttribute('opacity', 1); }
  else tg.setAttribute('opacity', 0);
  ajustarFichas(animar && !QUIETO && !SIN_VUELOS, MODO_EVENTO);
  // los órganos se iluminan cuando trabajan
  const lec = d.lectura;
  const trabajaP = !E.teorico && E.reloj !== 'min' && Math.abs(E.paco2 - 40) > 3 && (lec.prim === 'acidMet' || lec.prim === 'alcMet' || E.respirador);
  const trabajaR = (E.reloj === 'dias' && (lec.prim === 'acidResp' || lec.prim === 'alcResp')) || E.clLuz === 'alto' && E.hco3 > 28 || !!E.farmaco && E.farmaco !== 'bicarbonato';
  n['i-aura-p'].setAttribute('opacity', trabajaP ? 1 : 0);
  n['i-aura-r'].setAttribute('opacity', trabajaR ? 1 : 0);
  // cociente con dueño (B)
  const coc = tend
    ? `Tendencia: ${E.farmaco === 'bicarbonato' ? 'HCO₃⁻ <b>↑</b> · CO₂ <b>↑</b> si no se ventila más' : 'Cl⁻ <b>↑</b> · HCO₃⁻ <b>↓</b> · PaCO₂ <b>↓</b> · pH <b>↓</b>'} <span class="abv-quien">(sin cifras: la ficha no da la curva)</span>`
    : `[H⁺] = 24 × <b class="abv-co2">${fmtA(E.paco2)}</b> <span class="abv-quien">pulmón</span> / <b class="abv-hco">${fmtA(E.hco3)}</b> <span class="abv-quien">riñón</span> = <b>${oc('ph') ? '?' : fmt(d.H)}</b> nEq/L`;
  if (textos && coc !== INST.coc) { $('#abv-cociente').innerHTML = coc; INST.coc = coc; }
  $('#abv-teorico').hidden = !(E.teorico || (E.reloj === 'min' && (lec.prim === 'acidMet' || lec.prim === 'alcMet')));
  // cabecera mini
  if (textos) $('#abv-mini-ph').textContent = tend ? '↓' : oc('ph') ? '?' : fmt(ph, 2);
  $('#abv-mini-pal').textContent = pal; $('#abv-mini-pal').style.color = pal === 'acidemia' ? C.rojo : pal === 'alcalemia' ? C.verde : C.dim;
  pintarMiniAguja(objetivo);
}
function pintarMiniAguja(a) {
  const s = $('#abv-mini-aguja');
  if (!s.firstChild) s.innerHTML = `<path d="M-20 0A20 20 0 0 1 20 0" fill="none" stroke="${C.oro}" stroke-width="1"/><path id="abv-mini-ag" d="M0 0L0 -18" stroke="${C.oro}" stroke-width="1.6" stroke-linecap="round"/><circle r="2.4" fill="${C.oro}"/>`;
  s.querySelector('#abv-mini-ag').setAttribute('transform', `rotate(${(a * .9).toFixed(1)})`);
}
let SIN_VUELOS = false;    // repintado sin vuelos (al cambiar de paciente)
let MODO_EVENTO = null;   // qué cuentan los vuelos en la transición en curso ('acido', 'vomito', 'orina'…)
// Derivar barato para cada fotograma
let _cacheE = null, _cacheD = null;
function derivarRapido() { if (_cacheE && _cacheE.paco2 === E.paco2 && _cacheE.hco3 === E.hco3 && _cacheE.cl === E.cl && _cacheE.alb === E.alb && _cacheE.na === E.na && _cacheE.osm === E.osm && _cacheE.fuente === E.fuente && _cacheE.reloj === E.reloj && _cacheE.teorico === E.teorico) return _cacheD; _cacheE = { ...E }; _cacheD = derivar(E); return _cacheD; }

// ═════════════════════════════════════════════════════════════════════
// 5 · Dentro del cuerpo: la cadena de tres objetivos (B) con el dibujo de A
// ═════════════════════════════════════════════════════════════════════
const DPR = Math.min(2, window.devicePixelRatio || 1);
const LIENZOS = {};          // id → { cv, ctx, w, h, s, visible }
function lienzo(id, w, h) {
  const cv = $('#abv-' + id), L = { cv, ctx: cv.getContext('2d'), w, h, s: 1, visible: false };
  LIENZOS[id] = L; return L;
}
function ajustarLienzo(L) {
  const r = L.cv.getBoundingClientRect(); if (!r.width) return;
  const w = Math.round(r.width * DPR), h = Math.round(r.height * DPR);
  if (L.cv.width !== w || L.cv.height !== h) { L.cv.width = w; L.cv.height = h; }
  L.s = r.width / L.w * DPR;
}
function construirCadena() {
  $('#abv-hilo-sangre').innerHTML = `<path d="M60 42C100 74 140 10 180 42C220 74 260 10 300 42" fill="none" stroke="${alfa(C.rojo, .25)}" stroke-width="7"/>
    <path d="M60 42C100 74 140 10 180 42C220 74 260 10 300 42" fill="none" stroke="${C.rojo}" stroke-width="1.2" stroke-dasharray="2 5" opacity=".9"><animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.6s" repeatCount="indefinite"/></path>`;
  if (QUIETO) $('#abv-hilo-sangre animate')?.remove();
  $('#abv-lente-alveolo').innerHTML = grabado('abv-la') + `<g transform="translate(-37 -30) scale(.205)">${PULMON_IZ ? `<path d="${PULMON_IZ}" fill="url(#abv-la-ray)" stroke="${C.oro}" stroke-width="4"/><path d="${PULMON_IZ}" transform="translate(360 0) scale(-1 1)" fill="url(#abv-la-ray)" stroke="${C.oro}" stroke-width="4"/><path d="M174 40V118L150 140M186 40V118L210 140" fill="none" stroke="${C.oro}" stroke-width="4"/>` : ''}</g>`;
  const r = semilla(3); let p = `<circle r="40" fill="${alfa(C.rojo, .06)}"/>`;
  const tipos = ['tri', 'rombo', 'circ', 'tri', 'estrella', 'rombo', 'circ', 'voluta', 'tri', 'rombo', 'circ', 'cruz'];
  tipos.forEach((f, i) => { const a = i * 2.4, d = 10 + r() * 22; p += `<g transform="translate(${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d).toFixed(1)})">${icono(ESPECIE[f], 1.1)}</g>`; });
  $('#abv-lente-plasma').innerHTML = p;
}
function abrirObjetivo(cual, latir) {
  const igual = !$('#abv-casa-' + cual).hidden && E.obj === cual;
  E.obj = cual;
  $$('.abv-obj').forEach(b => { const on = b.dataset.obj === cual; b.setAttribute('aria-pressed', String(on)); if (latir && on && !QUIETO) { b.classList.remove('abv-late'); void b.offsetWidth; b.classList.add('abv-late'); } });
  ['alveolo', 'plasma', 'rinon'].forEach(k => $('#abv-casa-' + k).hidden = k !== cual);
  if (!igual) requestAnimationFrame(() => { Object.values(LIENZOS).forEach(ajustarLienzo); pedirPintura(); });
}

// ───────── ① Alvéolo ─────────
const ALV = { vol: [], fase: 0, acum: 0 };
function construirAlveolo() {
  let costillas = '';
  for (let i = 0; i < 6; i++) { const y = 90 + i * 21; costillas += `<path d="M178 ${y}C152 ${y - 13} 110 ${y - 8} 84 ${y + 22}" fill="none" stroke="${C.muted}" stroke-width=".7" opacity=".45"/>`; }
  $('#abv-svg-alveolo').innerHTML = grabado('abv-a') + `
    <rect x="2" y="2" width="356" height="246" rx="3" fill="none" stroke="${C.oro}" stroke-width=".8"/>
    <rect x="6" y="6" width="348" height="238" fill="none" stroke="${C.oro}" stroke-width=".3" opacity=".6"/>
    <g id="abv-a-cost">${costillas}</g><use href="#abv-a-cost" transform="translate(360 0) scale(-1 1)"/>
    <g id="abv-a-resp">${pulmonGrabado('abv-a')}</g>
    <path d="M82 216Q130 186 180 208Q230 186 278 216" fill="none" stroke="${C.muted}" stroke-width=".8" opacity=".6"/>
    <text x="282" y="232" font-size="9" font-style="italic" fill="${C.muted}">diafragma</text>
    <text x="16" y="24" class="abv-t-cap" fill="${C.oro}">ALVÉOLO</text>
    <text id="abv-a-lee" x="344" y="24" text-anchor="end" font-size="13" fill="${C.oro}">PaCO₂ 40 mmHg</text>
    <text id="abv-a-esp" x="344" y="38" text-anchor="end" font-size="9.5" fill="${C.dim}"></text>
    <text x="344" y="50" text-anchor="end" font-size="8.6" font-style="italic" fill="${C.muted}">ritmo y volutas: ilustrativo</text>
    <g id="abv-a-tubo" opacity="0"><path d="M180 40V6" stroke="${C.oro}" stroke-width="5" opacity=".35"/><path d="M180 40V6" stroke="${C.oro}" stroke-width="1.2"/>
      <rect x="166" y="2" width="28" height="9" rx="2" fill="${C.fondo}" stroke="${C.oro}"/><text x="200" y="12" font-size="9.5" fill="${C.oro}">respirador</text></g>`;
}
function pintarAlveolo() {
  const d = derivarRapido();
  $('#abv-a-lee').textContent = E.tendencia && E.farmaco !== 'bicarbonato' ? 'PaCO₂ ↓' : `PaCO₂ ${fmtA(E.paco2)} mmHg`;
  const met = d.lectura.prim === 'acidMet' || d.lectura.prim === 'alcMet';
  $('#abv-a-esp').textContent = met && oc('paco2esp') ? 'esperada ?' : met ? `esperada ${fmt(d.eP.v, 1)} (Fig. 31.2)` : d.lectura.prim === 'normal' ? 'rango 36-44' : 'aquí manda el pulmón';
  $('#abv-a-tubo').setAttribute('opacity', E.respirador ? 1 : 0);
  const vent = ventilacion();
  let f;
  if (E.farmaco === 'bicarbonato') f = `Cada ampolla de bicarbonato trae CO₂ (una <span class="hl-azul">PCO₂ de 200 mmHg</span>): ventilado, <strong>sube la ventilación minuto</strong> para sacarlo.`;
  else if (E.teorico) f = `Instante teórico: <span class="hl-rojo">el pulmón aún no ha respondido</span>. La compensación respiratoria aparece en 30-120 minutos.`;
  else if (d.lectura.prim === 'acidMet') f = `El pulmón sopla: la PaCO₂ baja a ${fmtA(E.paco2)} (esperada ${fmt(d.eP.v, 1)}). <span class="hl-azul">Compensa, pero no corrige.</span>`;
  else if (d.lectura.prim === 'alcMet') f = `El pulmón retiene CO₂, <strong>con menos vigor</strong>: PaCO₂ ${fmtA(E.paco2)} (esperada ${fmt(d.eP.v, 1)}).`;
  else if (d.lectura.prim === 'acidResp') f = `Aquí el problema es el pulmón: no saca el CO₂ (PaCO₂ ${fmtA(E.paco2)}). Compensa el riñón, y tarda días.`;
  else if (d.lectura.prim === 'alcResp') f = `El pulmón saca CO₂ de más (PaCO₂ ${fmtA(E.paco2)}). Compensa el riñón, y tarda días.`;
  else f = `En reposo: PaCO₂ ${fmtA(E.paco2)}. Las volutas salen con calma.`;
  html('#abv-alveolo-frase').innerHTML = f;
  html('#abv-alveolo-org').innerHTML = plegarOrigen((E.farmaco === 'bicarbonato' ? O('f', 'mr-lactato-bicarbonato#mr-bicarb-contra') : O('f', 'mr-acidobase-analisis#mr-comp-acidosis-met')) + O('i', `ventilación ×${fmt(vent, 1)} (dibujo)`));
  $('#abv-obj-alveolo-l').textContent = E.tendencia ? 'PaCO₂ ↓' : `PaCO₂ ${fmtA(E.paco2)}`;
}
// ventilación del dibujo (ilustrativa): más cuanto más baja la PaCO₂ que mantiene
const ventilacion = () => clamp(40 / E.paco2, .5, 2.4) * (E.respirador && E.farmaco === 'bicarbonato' ? 1.3 : 1);
function moverAlveolo(dt) {
  const vent = ventilacion();
  ALV.fase += dt * Math.PI * 2 * .22 * vent;
  ALV.acum += dt * 1.4 * vent;
  if (ALV.acum >= 1 && ALV.vol.length < 40) { ALV.acum = 0; ALV.vol.push({ x: 180 + azar(-4, 4), y: 40, vy: azar(14, 22) * (.7 + vent * .3), vx: azar(-8, 8), edad: 0, vida: 2.2, giro: azar(0, 6), r: 4.8 }); }
  for (let i = ALV.vol.length - 1; i >= 0; i--) { const v = ALV.vol[i]; v.edad += dt; v.y -= v.vy * dt; v.x += v.vx * dt; v.giro += dt * 2.4; if (v.edad > v.vida) ALV.vol.splice(i, 1); }
  const s = 1 + (.5 - .5 * Math.cos(ALV.fase)) * .045 * Math.min(1.8, vent);
  $('#abv-a-resp').setAttribute('transform', `translate(180 122) scale(${(1 + (s - 1) * .75).toFixed(4)} ${s.toFixed(4)}) translate(-180 -122)`);
}
function dibujarAlveolo() {
  const L = LIENZOS['cv-alveolo']; if (!L || !L.visible) return;
  const c = L.ctx; c.setTransform(L.s, 0, 0, L.s, 0, 0); c.clearRect(0, 0, L.w, L.h);
  for (const v of ALV.vol) { c.globalAlpha = clamp(1 - v.edad / v.vida, 0, 1); dibujo(c, 'voluta', v.x, v.y, v.r, v.giro); }
  c.globalAlpha = 1;
}

// ───────── ② Plasma: el vaso y las dos columnas de pesas ─────────
const PLA = { base: 336, K: 1.25, xC: 40, xA: 196, w: 72, vaso: [14, 76], flujo: [], ev: [], hex: [], prev: null };
function construirPlasma() {
  const svg = $('#abv-svg-plasma');
  const [y0, y1] = PLA.vaso;
  svg.innerHTML = grabado('abv-p') + `
    <rect x="0" y="${y0 - 6}" width="360" height="6" fill="url(#abv-p-ray)"/><rect x="0" y="${y1}" width="360" height="6" fill="url(#abv-p-ray)"/>
    <path d="M0 ${y0}H360M0 ${y1}H360" stroke="${C.oro}" stroke-width=".9"/>
    <path d="M0 ${y0 - 6}H360M0 ${y1 + 6}H360" stroke="${C.oro}" stroke-width=".4" opacity=".6"/>
    <text x="356" y="${y1 + 18}" text-anchor="end" font-size="9" font-style="italic" fill="${C.muted}">← la sangre lleva el CO₂ al pulmón</text>
    <text id="abv-p-entra" x="6" y="${y1 + 18}" font-size="9.5" font-style="italic" fill="${C.ciruela}"></text>
    <text x="${PLA.xC + PLA.w / 2}" y="348" text-anchor="middle" class="abv-t-cap" fill="${C.oro}">CATIONES</text>
    <text x="${PLA.xA + PLA.w / 2}" y="348" text-anchor="middle" class="abv-t-cap" fill="${C.oro}">ANIONES</text>
    <path d="M${PLA.xC - 6} ${PLA.base}H${PLA.xA + PLA.w + 6}" stroke="${C.oro}" stroke-width="1.1"/>
    <g id="abv-p-colC"></g><g id="abv-p-colA"></g>
    <path id="abv-p-linea-na" d="" stroke="${C.oro}" stroke-width=".7" stroke-dasharray="2 3" fill="none"/>
    <rect id="abv-p-hiato" x="${PLA.xA - 4}" width="${PLA.w + 8}" fill="none" stroke="${C.oro}" stroke-width="1.4" stroke-dasharray="1.5 3.5" stroke-linecap="round" rx="3"/>
    <text id="abv-p-hiato-t1" x="${PLA.xA + PLA.w + 8}" font-size="10.5" font-style="italic" fill="${C.oro}">hiato</text>
    <text id="abv-p-hiato-t2" x="${PLA.xA + PLA.w + 8}" font-size="17" fill="${C.oro}"></text>
    <text id="abv-p-hiato-t3" x="${PLA.xA + PLA.w + 8}" font-size="9" fill="${C.dim}"></text>
    <g id="abv-p-hex"></g>
    <text id="abv-p-neutra" x="180" y="${y1 + 32}" text-anchor="middle" font-size="9.5" font-style="italic" fill="${C.dim}">cationes = aniones: la sangre es siempre neutra (Ec. 31.12)</text>`;
  $('#abv-leyenda-iones').innerHTML = leyendaParticulas(['na', 'cl', 'hco3', 'h', { clave: 'anion', nombre: 'anión no medido (cetoácido, lactato, fórmico)' }, 'co2', 'k', 'nh4'], { envolver: false });
  $('#abv-leyenda-inst').innerHTML = leyendaParticulas(['co2', 'hco3', 'h', 'cl', { clave: 'anion', nombre: 'aniones no medidos' }, 'na'], { envolver: false });
}
const bloquesC = () => [
  { k: 'na', v: E.na, et: `Na⁺ ${fmtA(E.na)}`, col: C.oro, forma: 'na' },
  { k: 'cnm', v: CNM, et: 'otros 11', sub: 'Ca 5 · K 4,5 · Mg 1,5', col: C.muted },
];
function bloquesA(d) {
  const tend = E.tendencia;
  return [
    { k: 'cl', v: E.cl, et: tend ? 'Cl⁻ ↑' : `Cl⁻ ${fmt(E.cl)}`, col: C.ciruela, forma: 'cl' },
    { k: 'hco3', v: E.hco3, et: tend ? 'HCO₃⁻ ↓' : `HCO₃⁻ ${fmtA(E.hco3)}`, col: C.verde, forma: 'hco3' },
    { k: 'an', v: d.aniones, et: d.aniones >= .5 ? `${{ ceto: 'cetoácidos', lact: 'lactato', formico: 'fórmico' }[E.anion] || 'aniones'} ${oc('hiato') ? '?' : fmt(d.aniones)}` : '', col: C.ocre, hex: true },
    { k: 'alb', v: Math.max(0, d.albBloque), et: 'albúmina', col: C.dim },
    { k: 'otros', v: OTROS_A, et: 'otros 8', sub: 'orgánicos 5 · fosfato 2 · sulfato 1', col: C.muted },
  ];
}
// Columnas: los nodos se crean una vez y luego solo cambian sus atributos (nada de innerHTML por fotograma)
function pintarColumna(g, lista, x, lado) {
  if (!g._n) g._n = {};
  let acum = 0;
  for (const b of lista) {
    const h = b.v * PLA.K, y = PLA.base - (acum + b.v) * PLA.K;
    let n = g._n[b.k];
    if (!n) {
      n = g._n[b.k] = { g: el('g', {}, g) };
      n.r = el('rect', { x, width: PLA.w, rx: 2, fill: b.hex ? alfa(b.col, .1) : alfa(b.col, .2), stroke: b.col, 'stroke-width': .9 }, n.g);   // relleno liso: un rayado que cambia de alto en cada fotograma cuesta pintarlo
      if (b.forma) { n.ico = el('g', {}, n.g); n.ico.innerHTML = icono(b.forma, .95); }
      n.t = el('text', { 'font-size': 10.5, fill: C.crema }, n.g); n.ultimo = null;
    }
    const vis = h > .3;
    n.g.setAttribute('display', vis ? 'inline' : 'none');
    if (vis) {
      n.r.setAttribute('y', y.toFixed(1)); n.r.setAttribute('height', h.toFixed(1));
      if (n.ray) { n.ray.setAttribute('y', y.toFixed(1)); n.ray.setAttribute('height', h.toFixed(1)); }
      if (n.ico) { n.ico.setAttribute('transform', `translate(${x + 9} ${(y + Math.min(h / 2, 12)).toFixed(1)})`); n.ico.setAttribute('display', h >= 10 ? 'inline' : 'none'); }
      const dentro = h >= 12 && !b.hex;
      const modoT = dentro ? 'dentro' : b.hex ? 'hex' : 'fuera';
      if (n.modoT !== modoT) {
        n.modoT = modoT;
        if (dentro) { n.t.setAttribute('x', x + PLA.w / 2 + (b.forma ? 5 : 0)); n.t.setAttribute('text-anchor', 'middle'); n.t.setAttribute('font-size', 10.5); n.t.setAttribute('fill', C.crema); }
        else { n.t.setAttribute('x', x - 6); n.t.setAttribute('text-anchor', 'end'); n.t.setAttribute('font-size', b.hex ? 9.5 : 9); n.t.setAttribute('fill', b.hex ? C.ocre : C.dim); }
      }
      n.t.setAttribute('y', (dentro ? y + Math.min(h / 2, 14) + 3.6 : y + h / 2 + 3).toFixed(1));
      if (n.ultimo !== b.et) { n.t.textContent = b.et; n.ultimo = b.et; }
    }
    b.y = y; b.h = h; acum += b.v;
  }
  return acum;
}
function pintarPlasma(ligero) {
  const d = derivarRapido();
  pintarColumna($('#abv-p-colC'), bloquesC(), PLA.xC, 'C');
  const ba = bloquesA(d); pintarColumna($('#abv-p-colA'), ba, PLA.xA, 'A');
  const yNa = PLA.base - E.na * PLA.K, yMed = PLA.base - (E.cl + E.hco3) * PLA.K;
  $('#abv-p-linea-na').setAttribute('d', `M${PLA.xC + PLA.w} ${yNa.toFixed(1)}H${PLA.xA - 4}`);
  const hi = $('#abv-p-hiato'); hi.setAttribute('y', Math.min(yNa, yMed).toFixed(1)); hi.setAttribute('height', Math.abs(yMed - yNa).toFixed(1));
  const ym = (yNa + yMed) / 2;
  $('#abv-p-hiato-t1').setAttribute('y', (ym - 9).toFixed(1));
  $('#abv-p-hiato-t2').setAttribute('y', (ym + 8).toFixed(1)); $('#abv-p-hiato-t2').textContent = oc('hiato') ? '?' : fmt(d.HA);
  const corr = Math.abs(d.HAc - d.HA) > .2;
  $('#abv-p-hiato-t3').setAttribute('y', (ym + 20).toFixed(1)); $('#abv-p-hiato-t3').textContent = corr && !oc('hiato') ? `corregido ${fmt(d.HAc)}` : '';
  // hexágonos dentro del hueco: 1 por cada 2 mEq/L (ilustrativo)
  const an = ba[2], nHex = Math.round(d.aniones / 2);
  sincronizarHex(nHex, an);
  if (ligero) return;
  $('#abv-p-entra').textContent = E.suero ? `↓ entra: ${E.suero}${E.suero.startsWith('Salino') ? ' (Cl⁻ 154)' : E.suero.startsWith('Ringer') ? ' (Cl⁻ 109)' : ''}` : E.vomito ? '↖ vómito: se van H⁺ y Cl⁻' : '';
  // frase de la albúmina y origen
  $('#abv-alb-col').value = E.alb; $('#abv-alb-col-out').textContent = `${fmt(E.alb, 1)} g/dL`;
  const albN = FUENTES[E.fuente].albN;
  let fa;
  if (E.alb >= albN - .05) fa = `Albúmina normal: el hiato que ves es el que hay${oc('hiato') ? '' : ` (<strong>${fmt(d.HA)}</strong>)`}. Bájala.`;
  else if (d.HA <= 12.5 && d.HAc > 12.5) fa = `Albúmina ${fmt(E.alb, 1)}: <span class="hl-verde">el hiato parece normal (${fmt(d.HA)})</span>, pero corregido es <span class="hl-rojo">${fmt(d.HAc)}</span>: hay un anión escondido.`;
  else fa = `Albúmina ${fmt(E.alb, 1)}: el bloque de la albúmina encoge y el hiato medido baja a ${fmt(d.HA)}; corregido, <strong>${fmt(d.HAc)}</strong>.`;
  html('#abv-alb-frase').innerHTML = fa;
  html('#abv-plasma-org').innerHTML = plegarOrigen(O('f', 'mr-acidobase-gaps#mr-ag-formula') + O('f', 'mr-acidobase-gaps#mr-ag-albumina') + (E.fuente === 'nefro' ? O('f', 'fisio-acidobase-acidosis · albúmina normal 4,4 (Figge)') : '') + O('g', 'H⁺ + HCO₃⁻ → CO₂ + H₂O') + O('i', 'alto del bloque de la albúmina; Cl⁻ que ocupa su sitio al bajar; partículas'));
  $('#abv-obj-plasma-l').textContent = `hiato ${oc('hiato') ? '?' : fmt(d.HA)}`;
  pintarOsmoles(d);
}
function sincronizarHex(n, bloque) {
  const capa = $('#abv-p-hex');
  const filas = Math.max(1, Math.ceil(n / 8)), porFila = Math.ceil(n / filas);
  while (PLA.hex.length < n) { const g = el('g', {}, capa); g.innerHTML = icono('anion', 1.05); PLA.hex.push({ g, y: QUIETO ? null : 44, x: azar(150, 330) }); }
  while (PLA.hex.length > n) { const h = PLA.hex.pop(); if (QUIETO) h.g.remove(); else PLA.ev.push({ tipo: 'hexSale', x: h.x, y: h.y ?? 200, vy: -60, edad: 0, vida: 1.1 }), h.g.remove(); }
  PLA.hex.forEach((h, i) => {
    const fila = Math.floor(i / porFila), col = i % porFila, enFila = Math.min(porFila, n - fila * porFila);
    const esc = clamp(bloque.h / filas / 9, .45, 1.05); h.esc = esc;
    h.tx = PLA.xA + PLA.w / 2 + (col - (enFila - 1) / 2) * 8.6; h.ty = bloque.y + bloque.h - (bloque.h / filas) * (fila + .5);
    if (h.y == null) { h.x = h.tx; h.y = h.ty; }
    h.g.setAttribute('transform', `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) scale(${(h.esc || 1).toFixed(2)})`);
  });
}
function moverHex(dt) {
  for (const h of PLA.hex) {
    if (h.tx == null) continue;
    h.x += (h.tx - h.x) * Math.min(1, dt * 5);
    if (h.y < h.ty) { h.vy = (h.vy || 0) + 700 * dt; h.y = Math.min(h.ty, h.y + h.vy * dt); if (h.y >= h.ty) h.vy = 0; }
    else h.y += (h.ty - h.y) * Math.min(1, dt * 6);
    h.g.setAttribute('transform', `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) scale(${(h.esc || 1).toFixed(2)})`);
  }
}
// El vaso: iones que corren de derecha a izquierda (proporcionales; ilustrativo) + eventos de las transiciones
const objetivoFlujo = d => ({ tri: Math.round(E.hco3 / 2), rombo: Math.round(E.cl / 7), circ: 12, estrella: Math.round(d.aniones / 1.6), voluta: Math.round(E.paco2 / 7) });
function sembrarFlujo() {
  PLA.flujo.length = 0; const obj = objetivoFlujo(derivarRapido());
  for (const k in obj) for (let j = 0; j < obj[k]; j++) PLA.flujo.push(nuevoFlujo(k, azar(8, 352), 1));
}
function nuevoFlujo(k, x, vis = 0) { const [a, b] = PLA.vaso; return { k, x, y: azar(a + 8, b - 8), v: azar(12, 20), fase: azar(0, 6), r: k === 'circ' ? 3.6 : k === 'voluta' ? 4.6 : 4.4, vis, giro: azar(0, 6) }; }
function moverPlasma(dt) {
  const d = derivarRapido(), obj = objetivoFlujo(d), cuenta = {};
  for (const f of PLA.flujo) if (!f.sale) cuenta[f.k] = (cuenta[f.k] || 0) + 1;
  for (const k in obj) {
    const hay = cuenta[k] || 0;
    if (hay < obj[k]) PLA.flujo.push(nuevoFlujo(k, 360 + azar(0, 20)));
    else if (hay > obj[k]) { const v = PLA.flujo.filter(f => f.k === k && !f.sale && f.x > 30 && f.x < 330); const f = v[Math.floor(Math.random() * v.length)]; if (f) f.sale = true; }
  }
  for (let i = PLA.flujo.length - 1; i >= 0; i--) {
    const f = PLA.flujo[i];
    f.x -= f.v * dt; f.fase += dt * 1.7; f.y += Math.sin(f.fase) * .14; f.giro += dt * 2;
    if (f.x < -10) f.x += 380;
    f.vis = f.sale ? Math.max(0, f.vis - dt * 2) : Math.min(1, f.vis + dt * 2);
    if (f.sale && f.vis <= 0) PLA.flujo.splice(i, 1);
  }
  // eventos (vienen de las diferencias entre fotogramas)
  if (PLA.prev && !QUIETO) eventosPlasma(PLA.prev, d);
  PLA.prev = { cl: E.cl, hco3: E.hco3, an: d.aniones };
  for (let i = PLA.ev.length - 1; i >= 0; i--) {
    const p = PLA.ev[i]; p.edad += dt;
    if (p.ruta) {
      let resto = p.vel * dt;
      while (resto > 0 && p.seg < p.ruta.length - 1) { const [x1, y1] = p.ruta[p.seg + 1], dx = x1 - p.x, dy = y1 - p.y, dd = Math.hypot(dx, dy); if (dd <= resto) { p.x = x1; p.y = y1; p.seg++; resto -= dd; } else { p.x += dx / dd * resto; p.y += dy / dd * resto; resto = 0; } }
      if (p.mutaEn != null && p.seg >= p.mutaEn && p.k !== 'voluta') { p.k = 'voluta'; PLA.ev.push({ tipo: 'flash', x: p.x, y: p.y, edad: 0, vida: .5, r: 2 }); }
      if (p.seg >= p.ruta.length - 1) PLA.ev.splice(i, 1);
      continue;
    }
    if (p.tipo === 'hexSale') { p.y += p.vy * dt; }
    if (p.tipo === 'flash') p.r += dt * 30;
    if (p.edad > p.vida) PLA.ev.splice(i, 1);
  }
}
let acumEv = { an: 0, cl: 0, hco3: 0 };
function eventosPlasma(a, d) {
  const [v0, v1] = PLA.vaso, ym = (v0 + v1) / 2;
  const dAn = d.aniones - a.an, dCl = E.cl - a.cl, dH = E.hco3 - a.hco3;
  acumEv.an += dAn; acumEv.cl += dCl; acumEv.hco3 += dH;
  const yCl = PLA.base - E.cl * PLA.K, yH = PLA.base - (E.cl + E.hco3) * PLA.K;
  const xa = PLA.xA + PLA.w / 2;
  // el HCO₃⁻ que se gasta sube al vaso y a mitad de camino es CO₂ (o baja al riñón si se va por la orina)
  while (acumEv.hco3 <= -2) { acumEv.hco3 += 2;
    const x = xa + azar(-24, 24);
    if (MODO_EVENTO === 'orina' || MODO_EVENTO === 'acetazolamida') PLA.ev.push({ k: 'tri', x, y: yH + 4, ruta: [[x, yH + 4], [x + 60, 330], [356, 344]], seg: 0, vel: 120, edad: 0 });
    else {
      PLA.ev.push({ k: 'cruz', x: 360, y: ym, ruta: [[360, ym], [x + 20, 90], [x, yH - 6]], seg: 0, vel: 260, edad: 0 });
      PLA.ev.push({ k: 'tri', x, y: yH + 4, ruta: [[x, yH + 4], [x - 10, 96], [x - 40, ym], [-12, ym - 6]], seg: 0, vel: 150, edad: 0, mutaEn: 2 });
    }
  }
  while (acumEv.hco3 >= 2) { acumEv.hco3 -= 2;
    const x = xa + azar(-24, 24);
    if (MODO_EVENTO === 'vomito') { PLA.ev.push({ k: 'cruz', x, y: yH, ruta: [[x, yH], [x - 60, ym + 10], [-12, v0 - 4]], seg: 0, vel: 200, edad: 0 }); }
    PLA.ev.push({ k: 'tri', x: x + 30, y: ym, ruta: [[x + 30, ym], [x, yH - 10]], seg: 0, vel: 140, edad: 0 });
  }
  // el Cl⁻ que entra cae del vaso a su columna; el que se va sale por la izquierda (vómito)
  while (acumEv.cl >= 2) { acumEv.cl -= 2; const x = xa + azar(-26, 26); PLA.ev.push({ k: 'rombo', x: 6, y: ym, ruta: [[6, ym], [x - 40, 92], [x, yCl - 4]], seg: 0, vel: 220, edad: 0 }); }
  while (acumEv.cl <= -2) { acumEv.cl += 2; const x = xa + azar(-26, 26); PLA.ev.push({ k: 'rombo', x, y: yCl + 8, ruta: [[x, yCl + 8], [x - 80, ym + 10], [-12, v0 - 4]], seg: 0, vel: 230, edad: 0 }); }
  acumEv.an = 0;   // los hexágonos los mueve sincronizarHex
}
function dibujarPlasma() {
  const L = LIENZOS['cv-plasma']; if (!L || !L.visible) return;
  const c = L.ctx; c.setTransform(L.s, 0, 0, L.s, 0, 0); c.clearRect(0, 0, L.w, L.h);
  for (const f of PLA.flujo) { const borde = clamp(Math.min((f.x + 4) / 16, (360 - f.x) / 16), 0, 1); c.globalAlpha = f.vis * borde * .92; dibujo(c, f.k, f.x, f.y, f.r, f.giro); }
  for (const p of PLA.ev) {
    if (p.tipo === 'flash') { c.globalAlpha = clamp(1 - p.edad / p.vida, 0, 1); dibujo(c, 'anillo', p.x, p.y, p.r); continue; }
    if (p.tipo === 'hexSale') { c.globalAlpha = clamp(1 - p.edad / p.vida, 0, 1); dibujo(c, 'estrella', p.x, p.y, 4.6); continue; }
    c.globalAlpha = 1; dibujo(c, p.k, p.x, p.y, 4.6, p.edad * 3);
  }
  c.globalAlpha = 1;
}

// Osmoles: medida frente a calculada (la misma idea que el hiato aniónico)
let osmClave = null;
function pintarOsmoles(d) {
  const clave = [E.osm, E.na, E.glu, E.bun, E.fuente, oc('osm'), d.HA > 12.5].join('|');   // solo se reconstruye si cambia algo
  if (clave === osmClave) return; osmClave = clave;
  const X = v => 64 + (clamp(v, 240, 346) - 240) * 2.75;
  const calc = d.osmCalc, med = E.osm, F = FUENTES[E.fuente];
  const na2 = 2 * E.na, g = E.glu / 18, u = E.bun / 2.8;
  let t = grabado('abv-o') + `
    <text x="4" y="40" font-size="10.5" fill="${C.dim}">calculada</text><text x="4" y="86" font-size="10.5" fill="${C.dim}">medida</text>
    <path d="M64 22l-4 6 4 6-4 6 4 6M64 68l-4 6 4 6-4 6 4 6" fill="none" stroke="${C.muted}" stroke-width=".8"/>
    <rect x="64" y="22" width="${(X(na2) - 64).toFixed(1)}" height="24" fill="${alfa(C.crema, .12)}" stroke="${C.crema}" stroke-width=".8"/>
    <text x="${((64 + X(na2)) / 2).toFixed(1)}" y="38" text-anchor="middle" font-size="10" fill="${C.crema}">2 × Na⁺${oc('osm') ? '' : ' = ' + fmtA(na2)}</text>
    <rect x="${X(na2).toFixed(1)}" y="22" width="${(X(na2 + g) - X(na2)).toFixed(1)}" height="24" fill="${alfa(C.ocre, .3)}" stroke="${C.ocre}" stroke-width=".7"/>
    <rect x="${X(na2 + g).toFixed(1)}" y="22" width="${(X(calc) - X(na2 + g)).toFixed(1)}" height="24" fill="${alfa(C.muted, .3)}" stroke="${C.muted}" stroke-width=".7"/>
    <text x="${(X(calc) + 4).toFixed(1)}" y="31" font-size="8.6" fill="${C.muted}">+ glucosa/18 ${fmt(g, 0)}</text>
    <text x="${(X(calc) + 4).toFixed(1)}" y="42" font-size="8.6" fill="${C.muted}">+ BUN/2,8 ${fmt(u, 0)}</text>
    <g transform="translate(${((X(na2 + g) + X(calc)) / 2).toFixed(1)} 34)">${icono('urea', .55)}</g>
    <text x="${X(calc).toFixed(1)}" y="16" text-anchor="middle" font-size="12" fill="${C.crema}">${oc('osm') ? '?' : fmtA(calc)}</text>`;
  if (med == null) t += `<text x="70" y="86" font-size="10" font-style="italic" fill="${C.muted}">sin osmolalidad medida: mueve el mando</text>`;
  else {
    const base = Math.min(med, calc);
    t += `<rect x="64" y="68" width="${(X(base) - 64).toFixed(1)}" height="24" fill="${alfa(C.crema, .12)}" stroke="${C.crema}" stroke-width=".8"/>
      <text x="${((64 + X(base)) / 2).toFixed(1)}" y="84" text-anchor="middle" font-size="10" fill="${C.crema}">lo que sí ve el cálculo</text>`;
    if (med > calc + .5) {
      t += `<rect x="${X(calc).toFixed(1)}" y="66" width="${(X(med) - X(calc)).toFixed(1)}" height="28" rx="3" fill="none" stroke="${C.oro}" stroke-width="1.5" stroke-dasharray="1.5 3.5" stroke-linecap="round"/>`;
      const nQ = Math.max(1, Math.min(6, Math.round((med - calc) / 5)));
      for (let i = 0; i < nQ; i++) t += `<text x="${(X(calc) + 8 + i * Math.max(9, (X(med) - X(calc) - 14) / Math.max(1, nQ - 1))).toFixed(1)}" y="85" font-size="11" fill="${C.oro}" text-anchor="middle">?</text>`;
    }
    t += `<text x="${X(med).toFixed(1)}" y="110" text-anchor="middle" font-size="12" fill="${C.crema}">${fmtA(med)}</text>`;
    if (med > calc + .5) t += `<text x="${Math.min(352, X(med) + 4).toFixed(1)}" y="64" text-anchor="end" font-size="11" font-style="italic" fill="${C.oro}">hiato ${oc('osm') ? '?' : fmtA(med - calc)}</text>`;
  }
  for (const v of [250, 270, 290, 310, 330]) t += `<path d="M${X(v).toFixed(1)} 118v4" stroke="${C.muted}"/><text x="${X(v).toFixed(1)}" y="132" text-anchor="middle" font-size="8.6" fill="${C.muted}">${v}</text>`;
  t += `<text x="352" y="148" text-anchor="end" font-size="8.6" font-style="italic" fill="${C.muted}">mOsm/kg H₂O (eje cortado)</text>`;
  $('#abv-svg-osm').innerHTML = t;
  $('#abv-osm-col').value = med ?? Math.round(calc); $('#abv-osm-col-out').textContent = med == null ? '—' : fmtA(med);
  const gap = d.osmGap;
  let f;
  if (gap == null) f = `Calculada = 2 × Na + glucosa/18 + BUN/2,8 = <strong>${fmtA(calc)}</strong>. Sube la medida.`;
  else if (E.fuente === 'nefro' ? gap <= 20 : gap < 10) f = `Medida ${fmtA(med)}, calculada ${fmtA(calc)}: diferencia ${fmtA(gap)}, <span class="hl-verde">${E.fuente === 'nefro' ? 'no pasa de 20 (Nefrología al día)' : 'normal (<10)'}</span>.`;
  else f = `Medida ${fmtA(med)}, calculada ${fmtA(calc)}: <span class="hl-rojo">${fmtA(gap)} de sal que el cálculo no ve</span>. ${d.HA > 12.5 ? 'Con HA alto, piensa en <strong>metanol o etilenglicol</strong>.' : 'Hay un soluto escondido.'}`;
  html('#abv-osm-frase').innerHTML = f;
  html('#abv-osm-org').innerHTML = plegarOrigen(O('f', 'mr-acidobase-gaps#mr-osm-gap') + O('f', 'mr-acidobase-gaps#mr-osm-oculto') + (E.fuente === 'nefro' ? O('f', 'fisio-acidobase-acidosis · >20 sugiere tóxico; usa urea/5,6 en vez de BUN/2,8') : '') + (med == null ? '' : O('i', 'osmolalidad medida: del caso o del mando')));
}

// ───────── ③ Riñón: foto → nefrona → célula del tramo ─────────
const RIN = { parts: [], pend: .12, pendMV: null, acum: { p: 0, a: 0, b: 0, px: 0, cl: 0 } };
function irNivel(n) {
  E.nivel = n; const r = $('#abv-rinon'); r.dataset.nivel = n;
  $('#abv-capa-foto').dataset.on = n === 0 ? '1' : '0'; $('#abv-capa-nefrona').dataset.on = n === 1 ? '1' : '0'; $('#abv-capa-celula').dataset.on = n === 2 ? '1' : '0';
  $$('.abv-saltos button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.nivel === n)));
  requestAnimationFrame(() => { ajustarLienzo(LIENZOS['cv-celula']); pedirPintura(); });
}
function construirNefrona() {
  $('#abv-svg-nefrona').innerHTML = grabado('abv-n') + `
    <text x="14" y="22" class="abv-t-cap" fill="${C.oro}">NEFRONA</text>
    <circle cx="84" cy="74" r="26" fill="url(#abv-n-pun)" stroke="${C.oro}" stroke-width="1.1"/>
    <path d="M70 68c6-10 18-10 22 0s-14 14-6 20 18-2 14-12" fill="none" stroke="${C.rojo}" stroke-width="1.1"/>
    <text x="84" y="116" text-anchor="middle" font-size="10.5" font-style="italic" fill="${C.muted}">glomérulo</text>
    <path id="abv-n-prox" d="M108 66C126 52 138 84 154 70S178 52 186 76C192 96 172 104 168 120V286" fill="none" stroke="${C.oro}" stroke-width="7" opacity=".25"/>
    <path d="M108 66C126 52 138 84 154 70S178 52 186 76C192 96 172 104 168 120V286" fill="none" stroke="${C.oro}" stroke-width="1.4"/>
    <path d="M168 286C168 312 196 312 196 286V140C196 124 214 112 232 116S262 136 270 120" fill="none" stroke="${C.muted}" stroke-width="1.2"/>
    <path d="M270 120C292 96 322 90 340 96V324" fill="none" stroke="${C.oro}" stroke-width="7" opacity=".25"/>
    <path d="M270 120C292 96 322 90 340 96V324" fill="none" stroke="${C.oro}" stroke-width="1.4"/>
    <path d="M340 324l-5-8M340 324l5-8" stroke="${C.oro}" stroke-width="1"/>
    <text x="210" y="300" font-size="10.5" font-style="italic" fill="${C.muted}">asa de Henle</text>
    <g data-tramo-ir="proximal" role="button" tabindex="0" aria-label="Ver la célula del túbulo proximal" style="cursor:pointer">
      <rect x="22" y="128" width="142" height="80" rx="10" fill="${alfa(C.oro, .07)}" stroke="${C.oro}" stroke-dasharray="2 3"/>
      <circle cx="40" cy="148" r="11" fill="${C.oro}"/><text x="40" y="152" text-anchor="middle" font-size="12" fill="${C.fondo}">1</text>
      <text x="56" y="152" font-size="12.5" fill="${C.crema}">proximal</text>
      <text x="30" y="172" font-size="10.5" fill="${C.dim}">recupera el 85-90 %</text><text x="30" y="186" font-size="10.5" fill="${C.dim}">del HCO₃⁻ filtrado</text>
      <text x="30" y="201" font-size="10.5" font-style="italic" fill="${C.oro}">tocar: ver la célula ▸</text></g>
    <g data-tramo-ir="colector" role="button" tabindex="0" aria-label="Ver las células del túbulo colector" style="cursor:pointer">
      <rect x="202" y="172" width="128" height="100" rx="10" fill="${alfa(C.oro, .07)}" stroke="${C.oro}" stroke-dasharray="2 3"/>
      <circle cx="220" cy="196" r="11" fill="${C.oro}"/><text x="220" y="200" text-anchor="middle" font-size="12" fill="${C.fondo}">2</text>
      <text x="236" y="200" font-size="12.5" fill="${C.crema}">colector</text>
      <text x="209" y="218" font-size="10.5" fill="${C.dim}">10-15 % del HCO₃⁻;</text><text x="209" y="233" font-size="10.5" fill="${C.dim}">secreta H⁺ y, con la</text><text x="209" y="248" font-size="10.5" fill="${C.dim}">pendrina, HCO₃⁻</text>
      <text x="209" y="264" font-size="10.5" font-style="italic" fill="${C.oro}">tocar: ver las células ▸</text></g>
    <text x="14" y="334" font-size="10.5" font-style="italic" fill="${C.muted}">esquema, no a escala</text>`;
}
// geometría de las células (viewBox 360 × 340): luz a la izquierda, sangre a la derecha
const CEL = { luz: [8, 62], cel: [72, 290], san: [300, 352] };
// y de cada célula del colector y sus carriles (las partículas van por los carriles; los rótulos, fuera de ellos)
const CY = { p: 24, a: 122, b: 224 };
function construirCelula() {
  const svg = $('#abv-svg-celula');
  const marco = (y, h, nombre, nx, ny) => `
    <rect x="${CEL.cel[0]}" y="${y}" width="${CEL.cel[1] - CEL.cel[0]}" height="${h}" rx="22" fill="${alfa(C.dim, .05)}" stroke="${C.oro}" stroke-width="1"/>
    <rect x="${CEL.cel[0] + 4}" y="${y + 4}" width="${CEL.cel[1] - CEL.cel[0] - 8}" height="${h - 8}" rx="18" fill="none" stroke="${C.oro}" stroke-width=".35" opacity=".55"/>
    <ellipse cx="${nx}" cy="${ny}" rx="17" ry="9" fill="${alfa(C.ciruela, .25)}" stroke="${C.muted}" stroke-width=".7"/>
    <text x="84" y="${y + 19}" class="abv-t-cap" style="font-size:10.5px" fill="${C.oro}">${nombre}</text>`;
  const comunes = `
    <text x="35" y="14" text-anchor="middle" class="abv-t-cap" style="font-size:10.5px" fill="${C.oro}">LUZ</text><text x="326" y="14" text-anchor="middle" class="abv-t-cap" style="font-size:10.5px" fill="${C.rojo}">SANGRE</text>
    <rect x="${CEL.luz[0]}" y="20" width="${CEL.luz[1] - CEL.luz[0]}" height="300" rx="6" fill="${alfa(C.muted, .06)}" stroke="${C.muted}" stroke-width=".6" stroke-dasharray="2 3"/>
    <rect x="${CEL.san[0]}" y="20" width="${CEL.san[1] - CEL.san[0]}" height="300" rx="6" fill="${alfa(C.rojo, .1)}" stroke="${C.rojo}" stroke-width=".6"/>
    <path d="M35 302V320M30 314L35 321L40 314" stroke="${C.muted}" stroke-width=".9" fill="none"/>
    <text id="abv-c-orina" x="8" y="336" font-size="10.5" fill="${C.ciruela}"></text>`;
  const p = CY.p, a = CY.a, b = CY.b;
  svg.innerHTML = comunes + `<g id="abv-c-colector">
      ${marco(p, 90, 'PRINCIPAL', 262, p + 22)}
      ${marco(a, 94, 'INTERCALAR A', 262, a + 22)}
      ${marco(b, 94, 'INTERCALAR B', 250, b + 80)}
      <circle cx="${CEL.cel[1]}" cy="${p + 58}" r="8" fill="${C.fondo}" stroke="${C.oro}" stroke-width="1.1"/>
      <text x="${CEL.cel[1] - 12}" y="${p + 62}" text-anchor="end" font-size="10.5" fill="${C.oro}">Na⁺/K⁺-ATPasa</text>
      <circle id="abv-c-hatp" cx="${CEL.cel[0]}" cy="${a + 50}" r="9" fill="${C.fondo}" stroke="${C.rojo}" stroke-width="1.2"/>
      <text x="${CEL.cel[0] + 14}" y="${a + 68}" font-size="10.5" fill="${C.rojo}">bomba de H⁺</text>
      <text x="170" y="${a + 37}" text-anchor="middle" font-size="10.5" font-style="italic" fill="${C.dim}">H₂CO₃ → H⁺ + HCO₃⁻</text>
      <text id="abv-c-aldo" x="0" y="0" font-size="10.5" fill="${C.ocre}" display="none"></text>
      <circle id="abv-c-pend-halo" cx="${CEL.cel[0]}" cy="${b + 56}" r="18" fill="${C.verde}" opacity=".1"/>
      <circle id="abv-c-pend" cx="${CEL.cel[0]}" cy="${b + 56}" r="10.5" fill="${C.verde}" fill-opacity=".25" stroke="${C.verde}" stroke-width="1.4"/>
      <g id="abv-c-pend-x" opacity="0"><path d="M${CEL.cel[0] - 7} ${b + 49}L${CEL.cel[0] + 7} ${b + 63}M${CEL.cel[0] + 7} ${b + 49}L${CEL.cel[0] - 7} ${b + 63}" stroke="${C.rojo}" stroke-width="2"/></g>
      <text x="${CEL.cel[0] + 28}" y="${b + 38}" font-size="10.5" fill="${C.verde}">pendrina (Cl⁻/HCO₃⁻)</text>
      <text id="abv-c-pend-est" x="${CEL.cel[1] - 10}" y="${b + 19}" text-anchor="end" font-size="10.5" font-style="italic"></text>
    </g>
    <g id="abv-c-proximal">
      ${marco(24, 296, 'TÚBULO PROXIMAL', 250, 160)}
      <path d="${Array.from({ length: 26 }, (_, i) => `M${CEL.cel[0]} ${34 + i * 11}h-6`).join('')}" stroke="${C.oro}" stroke-width=".8"/>
      <text x="84" y="62" font-size="10.5" font-style="italic" fill="${C.muted}">ribete en cepillo (lado de la luz)</text>
      <rect x="${CEL.cel[0] - 8}" y="94" width="16" height="22" rx="5" fill="${C.fondo}" stroke="${C.oro}" stroke-width="1.1"/>
      <text x="${CEL.cel[0] + 16}" y="90" font-size="10.5" fill="${C.oro}">NHE3: entra Na⁺, sale H⁺</text>
      <g id="abv-c-ac1"><circle cx="35" cy="160" r="11" fill="${C.fondo}" stroke="${C.ocre}" stroke-width="1.2"/><text x="35" y="164" text-anchor="middle" font-size="10.5" fill="${C.ocre}">AC</text></g>
      <g id="abv-c-ac2"><circle cx="160" cy="200" r="11" fill="${C.fondo}" stroke="${C.ocre}" stroke-width="1.2"/><text x="160" y="204" text-anchor="middle" font-size="10.5" fill="${C.ocre}">AC</text></g>
      <text x="150" y="238" text-anchor="middle" font-size="10.5" fill="${C.dim}">CO₂ + H₂O → H⁺ + HCO₃⁻</text>
      <rect x="${CEL.cel[1] - 8}" y="200" width="16" height="22" rx="5" fill="${C.fondo}" stroke="${C.verde}" stroke-width="1.1"/>
      <text x="${CEL.cel[1] - 12}" y="256" text-anchor="end" font-size="10.5" fill="${C.verde}">sale HCO₃⁻</text>
      <g id="abv-c-acx" opacity="0"><path d="M27 152L43 168M43 152L27 168M152 192L168 208M168 192L152 208" stroke="${C.rojo}" stroke-width="2.2"/></g>
      <text id="abv-c-prox-est" x="181" y="284" text-anchor="middle" font-size="10.5" fill="${C.ocre}"></text>
      <text x="181" y="306" text-anchor="middle" font-size="10.5" font-style="italic" fill="${C.dim}">recupera el 85-90 % del HCO₃⁻ filtrado</text>
    </g>`;
}
function pendrinaObjetivo() { if (E.clLuz === 'bajo') return 0; return clamp((E.hco3 - 24) / 10, .12, 1); }
let pendObjAnt = null;
function pintarRinon() {
  const prox = E.tramo === 'proximal';
  $('#abv-c-colector').setAttribute('display', prox ? 'none' : 'inline'); $('#abv-c-proximal').setAttribute('display', prox ? 'inline' : 'none');
  $$('[data-tramo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tramo === E.tramo)));
  $$('[data-clluz]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.clluz === (E.clLuz === 'bajo' ? 'bajo' : 'alto'))));
  $$('[data-aldo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.aldo === E.aldo)));
  $('#abv-seg-clluz').hidden = prox; $('#abv-seg-aldo').hidden = prox;
  const po = pendrinaObjetivo();
  if (po !== pendObjAnt) { if (RIN.pendMV && !QUIETO) M.animate(RIN.pendMV, po, { duration: .8, ease: 'easeInOut' }); else { RIN.pend = po; RIN.pendMV?.set?.(po); } pendObjAnt = po; }
  const bloq = E.clLuz === 'bajo';
  $('#abv-c-pend-x').setAttribute('opacity', bloq ? 1 : 0);
  const est = bloq ? ['pendrina apagada', C.rojo] : po > .5 ? ['pendrina encendida', C.verde] : ['casi apagada', C.muted];
  $('#abv-c-pend-est').textContent = est[0]; $('#abv-c-pend-est').setAttribute('fill', est[1]);
  $('#abv-c-hatp').setAttribute('stroke-width', E.aldo === 'alta' ? 2.4 : 1.2);
  $('#abv-c-orina').textContent = prox ? (E.farmaco === 'acetazolamida' ? 'NaHCO₃ a la orina' : '') : E.clOrina ? `Cl⁻ orina ${E.clOrina}` : '';
  $('#abv-c-acx').setAttribute('opacity', E.farmaco === 'acetazolamida' ? 1 : 0);
  const d = derivarRapido();
  const cronAcid = E.reloj === 'dias' && d.lectura.prim === 'acidResp', cronAlc = E.reloj === 'dias' && d.lectura.prim === 'alcResp';
  $('#abv-c-prox-est').textContent = E.farmaco === 'acetazolamida' ? 'acetazolamida: AC bloqueada' : cronAcid ? 'días: más HCO₃⁻ a la sangre' : cronAlc ? 'días: menos HCO₃⁻ a la sangre' : (d.lectura.prim === 'acidResp' || d.lectura.prim === 'alcResp') ? 'minutos: casi no cambia' : '';
  // frase del riñón
  let f, org;
  if (prox) {
    if (E.farmaco === 'acetazolamida') { f = `La acetazolamida <span class="hl-azul">inhibe la anhidrasa carbónica</span>: el HCO₃⁻ filtrado no se recupera y sale con Na⁺ (NaHCO₃). Por eso también es <strong>diurética</strong>, una ventaja en los edemas.`; org = O('f', 'mr-alcalosis-tratamiento#mr-acetazolamida'); }
    else if (cronAcid) { f = `Tras 2-3 días con la PaCO₂ alta, el proximal <span class="hl-azul">reabsorbe más HCO₃⁻</span>: HCO₃⁻ esperado = 24 + 0,4 × (PaCO₂ − 40) = <strong>${fmt(d.eH.cr, 1)}</strong>.`; org = O('f', 'mr-acidobase-analisis#mr-comp-cronico'); }
    else if (d.lectura.prim === 'acidResp' || d.lectura.prim === 'alcResp') { f = `El riñón es lento: en minutos el HCO₃⁻ apenas se mueve (agudo: <strong>${fmt(d.eH.ag, 1)}</strong>). Necesita <span class="hl-azul">2-3 días</span> (crónico: ${fmt(d.eH.cr, 1)}).`; org = O('f', 'mr-acidobase-analisis#mr-comp-agudo') + O('f', 'mr-acidobase-analisis#mr-comp-cronico'); }
    else { f = `Aquí se recupera el <strong>85-90 %</strong> del HCO₃⁻ filtrado (4.000-4.500 mEq al día). El NHE3 saca H⁺, que se une al HCO₃⁻ de la luz; entra como CO₂ y sale a la sangre como HCO₃⁻.`; org = O('f', 'mr-alcalosis-mecanismos#mr-alc-reabsorcion') + O('g', 'NHE3 y anhidrasa carbónica (como en la nefrona viva)'); }
  } else {
    if (bloq && E.hco3 > 28) { f = `<span class="hl-rojo">Sin Cl⁻ en la luz, la pendrina no puede tirar el HCO₃⁻</span>: los triángulos esperan en la puerta y la alcalosis se mantiene. Cl⁻ en orina <span class="hl-purpura">&lt;20 mEq/L</span>.`; org = O('f', 'mr-alcalosis-mecanismos#mr-alc-pendrina') + O('f', 'mr-alcalosis-mecanismos#mr-tabla-33-1'); }
    else if (bloq) { f = `Sin Cl⁻ en la luz, la pendrina queda apagada. Con el HCO₃⁻ normal, no hay nada que tirar.`; org = O('f', 'mr-alcalosis-mecanismos#mr-alc-pendrina'); }
    else if (po > .5) { f = `<span class="hl-verde">Llega Cl⁻ y la pendrina se enciende</span>: entra Cl⁻ y sale HCO₃⁻ por la orina.${E.aldo === 'alta' ? ' La aldosterona alta sigue secretando K⁺ y H⁺: no responde al cloro.' : ''}`; org = O('f', 'mr-alcalosis-mecanismos#mr-alc-pendrina') + (E.aldo === 'alta' ? O('f', 'mr-alcalosis-mecanismos#mr-tabla-33-1') : O('f', 'mr-alcalosis-tratamiento#mr-tabla-33-2')); }
    else { f = `En reposo la <strong>pendrina</strong> apenas trabaja; la intercalar A secreta H⁺ y devuelve HCO₃⁻ a la sangre.${E.aldo === 'alta' ? ' <span class="hl-azul">La aldosterona</span> reabsorbe Na⁺, secreta K⁺ y enciende la bomba de H⁺.' : ''}`; org = O('f', 'mr-alcalosis-mecanismos#mr-alc-pendrina'); }
  }
  html('#abv-rinon-frase').innerHTML = f; html('#abv-rinon-org').innerHTML = plegarOrigen(org + (prox ? '' : O('f', 'mr-alcalosis-mecanismos#mr-alc-reabsorcion') + O('g', 'nombres de las células: principal, intercalar A y B')) + O('i', 'cantidad y ritmo de las partículas'));
  html('#abv-celula-clave').innerHTML = prox
    ? `En la luz, la <strong>anhidrasa carbónica (AC)</strong> une H⁺ + HCO₃⁻ en CO₂ + H₂O; el CO₂ entra y dentro se rehace el HCO₃⁻, que sale a la sangre. La AC es la diana de la acetazolamida.`
    : `<strong>Principal</strong>: entra Na⁺, sale K⁺. <strong>Intercalar A</strong>: sale H⁺ y el HCO₃⁻ vuelve a la sangre. <strong>Intercalar B</strong>: la pendrina cambia Cl⁻ de la luz por HCO₃⁻ (Fig. 33.1).`;
  $('#abv-obj-rinon-l').textContent = prox ? (E.farmaco === 'acetazolamida' ? 'AC bloqueada' : 'proximal') : bloq ? 'pendrina ✕' : po > .5 ? 'pendrina ●' : 'pendrina ○';
  // salidas a la nefrona viva y al glomérulo (el enlace cruzado de siempre: data-especialidad)
  const sal = [];
  const c = causaActual();
  if (c && c.nefrona) sal.push(boton('nefrona', c.nefrona, `Abrir en la nefrona viva: ${c.t}`));
  if (E.vomito) sal.push(boton('glomerulo', 'deplecion', 'Ver en el glomérulo: depleción de volumen'));
  if (E.vomito || c?.id === 'vomitos') sal.push(boton('nefrona', 'normal|furosemida', 'Abrir en la nefrona viva: furosemida'));
  html('#abv-rinon-salidas').innerHTML = sal.join('');
}
function boton(tipo, valor, txt) {
  // El glomérulo vivo vive en la ficha «Regulación» de Fisiología renal (como el enlace de la nefrona viva)
  const at = tipo === 'nefrona' ? `data-especialidad="nefrologia" data-view="nefrona" data-nefrona-viva="${valor}"`
    : `data-especialidad="nefrologia" data-view="nefrona" data-panel="panel-fisio-tabs" data-tab="fisio-regulacion" data-glomerulo="${valor}"`;
  return `<button type="button" class="abv-b abv-link" ${at}>${txt} →</button>`;
}
// «ficha#elemento» → atributos del enlace cruzado (abre la ficha y resalta el elemento)
// (la ruta de cada cuaderno sale de PANEL_NAV del buscador: rutaDePanel)
function attrFicha(ref, resaltar) {
  const [tab, ancla] = ref.split('#');
  const panel = document.getElementById(tab)?.closest('[id^="panel-"]'), r = panel && rutaDePanel(panel.id);
  if (!r) return '';
  const res = resaltar || ancla;
  return `data-especialidad="${r.especialidad}" data-view="${r.view}" data-panel="${panel.id}" data-tab="${tab}"${res ? ` data-resaltar="#${res}"` : ''}`;
}
const enlaceFicha = (ref, txt, resaltar) => `<button type="button" class="abv-b abv-link" ${attrFicha(ref, resaltar)}>${txt}</button>`;
// Partículas de la célula (≤ 90)
function rutaR(forma, col, pts, vel, r = 3.4, extra = {}) { if (RIN.parts.length >= 90) return null; const p = { forma, col, x: pts[0][0], y: pts[0][1], pts, seg: 0, vel, r, edad: 0, alpha: 0, ...extra }; RIN.parts.push(p); return p; }
function moverCelula(dt) {
  const a = RIN.acum, prox = E.tramo === 'proximal', aldo = E.aldo === 'alta' ? 1.8 : 1;
  if (!prox) {
    a.p += dt * 1.2 * aldo; a.a += dt * 1.3 * aldo; a.b += dt * RIN.pend * 3 * (E.clLuz === 'bajo' ? 0 : 1);
    const p0 = CY.p, a0 = CY.a, b0 = CY.b;
    if (a.p >= 1) { a.p = 0; rutaR('circ', C.crema, [[30, p0 + 42], [CEL.cel[0], p0 + 44], [200, p0 + 46], [CEL.cel[1], p0 + 47], [330, p0 + 48], [330, p0 + 100]], 70);
      rutaR('cuad', C.dim, [[326, p0 + 74], [CEL.cel[1], p0 + 74], [160, p0 + 75], [CEL.cel[0], p0 + 76], [36, p0 + 78], [36, 300]], 60); }
    if (a.a >= 1) { a.a = 0; rutaR('cruz', C.rojo, [[200, a0 + 50], [CEL.cel[0], a0 + 50], [34, a0 + 54], [34, 300]], 70);
      rutaR('tri', C.verde, [[214, a0 + 78], [CEL.cel[1], a0 + 80], [328, a0 + 82], [328, a0 + 130]], 60);
      rutaR('rombo', C.ciruela, [[330, a0 + 60], [CEL.cel[1], a0 + 62], [236, a0 + 64]], 40, 3.3, { muere: true }); }
    if (a.b >= 1) { a.b = 0; rutaR('tri', C.verde, [[204, b0 + 58], [CEL.cel[0], b0 + 57], [36, b0 + 62], [36, 320]], 72);
      rutaR('rombo', C.ciruela, [[30, b0 + 40], [CEL.cel[0], b0 + 55], [176, b0 + 62]], 72, 3.3, { muere: true }); }
    // el Cl⁻ de la luz: abundante, escaso o ausente
    const quiere = E.clLuz === 'bajo' ? 1 : E.clLuz === 'alto' ? 14 : 6, hay = RIN.parts.filter(p => p.luzCl && !p.sale).length;
    if (hay < quiere) rutaR('rombo', C.ciruela, [[azar(14, 56), 22], [azar(14, 56), 320]], azar(14, 22), 3.2, { luzCl: true });
    else if (hay > quiere) { RIN.parts.filter(p => p.luzCl && !p.sale).slice(quiere).forEach(v => v.sale = true); }
  } else {
    const ac = E.farmaco !== 'acetazolamida';
    const d = derivarRapido(), k = E.reloj === 'dias' && d.lectura.prim === 'acidResp' ? 1.6 : E.reloj === 'dias' && d.lectura.prim === 'alcResp' ? .6 : 1;
    a.px += dt * 1.1;
    if (a.px >= 1) { a.px = 0;
      const y0 = azar(24, 60);
      if (ac && Math.random() < .9 * Math.min(1, k)) {
        // HCO₃⁻ filtrado + H⁺ (NHE3) → CO₂ entra → HCO₃⁻ sale a la sangre
        rutaR('tri', C.verde, [[azar(22, 48), y0], [36, 150], [36, 158]], 50, 3.6, { muere: true });
        rutaR('cruz', C.rojo, [[150, 112], [CEL.cel[0], 106], [44, 150]], 70, 3.2, { muere: true });
        rutaR('circ', C.crema, [[30, 104], [CEL.cel[0], 106], [200, 108], [CEL.cel[1], 110], [330, 112]], 70);
        rutaR('voluta', C.oro, [[36, 166], [CEL.cel[0], 172], [158, 198]], 48, 4.2, { muere: true, retraso: 1.4 });
        rutaR('tri', C.verde, [[172, 204], [CEL.cel[1], 211], [330, 213], [330, 300]], 54, 3.6, { retraso: 2.4 });
        if (k > 1.2) rutaR('tri', C.verde, [[180, 210], [CEL.cel[1], 213], [338, 216], [338, 300]], 54, 3.6, { retraso: 2.8 });
      } else {
        // sin anhidrasa: el HCO₃⁻ sigue por la luz hasta la orina, con su Na⁺
        rutaR('tri', C.verde, [[azar(22, 48), y0], [azar(26, 46), 320]], 40, 3.6);
        rutaR('circ', C.crema, [[azar(22, 48), y0 + 6], [azar(26, 46), 326]], 40, 3.4);
      }
    }
  }
  for (let i = RIN.parts.length - 1; i >= 0; i--) {
    const p = RIN.parts[i];
    if (p.retraso > 0) { p.retraso -= dt; continue; }
    p.edad += dt; p.alpha = p.sale ? Math.max(0, p.alpha - dt * 2) : Math.min(1, p.alpha + dt * 3);
    let resto = p.vel * dt;
    while (resto > 0 && p.seg < p.pts.length - 1) { const [x1, y1] = p.pts[p.seg + 1], dx = x1 - p.x, dy = y1 - p.y, dd = Math.hypot(dx, dy); if (dd <= resto) { p.x = x1; p.y = y1; p.seg++; resto -= dd; } else { p.x += dx / dd * resto; p.y += dy / dd * resto; resto = 0; } }
    if ((p.seg >= p.pts.length - 1 && (p.muere || p.y > 300)) || (p.sale && p.alpha <= 0)) { if (p.muere && p.alpha > 0 && !p.fade) { p.fade = true; p.sale = true; continue; } RIN.parts.splice(i, 1); }
  }
}
function dibujarCelula(t) {
  const L = LIENZOS['cv-celula']; if (!L || !L.visible || E.nivel !== 2) return;
  const c = L.ctx; c.setTransform(L.s, 0, 0, L.s, 0, 0); c.clearRect(0, 0, L.w, L.h);
  for (const p of RIN.parts) { if (p.retraso > 0) continue; c.globalAlpha = clamp(p.alpha, 0, 1); dibujo(c, p.forma, p.x, p.y, p.r, p.edad * 2.4); }
  if (E.tramo === 'colector' && E.clLuz === 'bajo' && E.hco3 > 28) {   // HCO₃⁻ que espera junto a la pendrina, sin cloro con el que cambiarse
    c.globalAlpha = .95;
    for (let i = 0; i < 4; i++) dibujo(c, 'tri', 104 + i * 12 + Math.sin(t / 300 + i) * 1.4, CY.b + 72 + (i % 2) * 7 + Math.cos(t / 260 + i) * 1.2, 3.6);
  }
  c.globalAlpha = 1;
  if (E.tramo === 'colector') {
    const v = RIN.pend, pulso = v > .5 && !QUIETO ? .5 + .5 * Math.sin(t / 320) : 0;
    $('#abv-c-pend-halo').setAttribute('r', (13 + v * 10 + pulso * 3).toFixed(1));
    $('#abv-c-pend-halo').setAttribute('opacity', (.05 + v * .3).toFixed(2));
    $('#abv-c-pend').setAttribute('fill-opacity', (.12 + v * .75).toFixed(2));
  }
}
// Con «reducir movimiento»: la célula quieta en su estado final
function estampaCelula() {
  RIN.parts.length = 0;
  const pon = (forma, col, x, y, r = 3.4) => RIN.parts.push({ forma, col, x, y, pts: [[x, y]], seg: 0, vel: 0, r, edad: 0, alpha: 1 });
  if (E.tramo === 'colector') {
    const n = E.clLuz === 'bajo' ? 1 : E.clLuz === 'alto' ? 9 : 5;
    for (let i = 0; i < n; i++) pon('rombo', C.ciruela, 22 + (i % 3) * 14, 40 + i * 30);
    pon('circ', C.crema, 200, CY.p + 46); pon('cuad', C.dim, 48, CY.p + 78); pon('cruz', C.rojo, 44, CY.a + 52); pon('tri', C.verde, 326, CY.a + 82);
    if (pendrinaObjetivo() > .5 && E.clLuz !== 'bajo') for (let i = 0; i < 4; i++) pon('tri', C.verde, 30 + (i % 2) * 12, CY.b + 66 + i * 9);
    RIN.pend = pendrinaObjetivo();
  } else {
    if (E.farmaco === 'acetazolamida') for (let i = 0; i < 6; i++) { pon('tri', C.verde, 28 + (i % 2) * 14, 80 + i * 38, 3.6); pon('circ', C.crema, 44 - (i % 2) * 14, 92 + i * 38); }
    else { pon('tri', C.verde, 36, 140, 3.6); pon('cruz', C.rojo, 50, 150); pon('voluta', C.oro, 120, 186, 4.2); pon('tri', C.verde, 318, 212, 3.6); pon('tri', C.verde, 330, 250, 3.6); pon('circ', C.crema, 220, 108); }
  }
}

// ═════════════════════════════════════════════════════════════════════
// 6 · La carta de la gasometría: carta náutica (A) + escalera (C) + cometa (B)
// ═════════════════════════════════════════════════════════════════════
const MX = p => 44 + (clamp(p, 10, 90) - 10) / 80 * 296, MY = h => 14 + (50 - clamp(h, 4, 50)) / 46 * 270;
const CARTA = { cola: [], estela: [], marcas: [], nodos: {}, arena: 0 };
function trazar(f, a, b, paso = .5) { let d = ''; for (let v = a; a < b ? v <= b + 1e-9 : v >= b - 1e-9; v += a < b ? paso : -paso) { const [p, h] = f(v); if (p < 10 || p > 90 || h < 4 || h > 50) continue; d += `${d ? 'L' : 'M'}${MX(p).toFixed(1)} ${MY(h).toFixed(1)}`; } return d; }
function construirCarta() {
  const svg = $('#abv-svg-carta');
  let t = grabado('abv-k').replace('</defs>', `<clipPath id="abv-k-clip"><rect x="44" y="14" width="296" height="270"/></clipPath></defs>`);
  t += `<rect x="44" y="14" width="296" height="270" fill="none" stroke="${C.oro}" stroke-width=".9"/><rect x="40" y="10" width="304" height="278" fill="none" stroke="${C.oro}" stroke-width=".45"/>`;
  for (let p = 10; p < 90; p += 10) t += `<rect x="${MX(p)}" y="284" width="${(MX(p + 5) - MX(p)).toFixed(1)}" height="4" fill="${C.oro}" opacity=".7"/><rect x="${MX(p)}" y="10" width="${(MX(p + 5) - MX(p)).toFixed(1)}" height="4" fill="${C.oro}" opacity=".7"/>`;
  for (let h = 4; h < 50; h += 8) t += `<rect x="40" y="${MY(h + 4)}" width="4" height="${(MY(h) - MY(h + 4)).toFixed(1)}" fill="${C.oro}" opacity=".7"/><rect x="340" y="${MY(h + 4)}" width="4" height="${(MY(h) - MY(h + 4)).toFixed(1)}" fill="${C.oro}" opacity=".7"/>`;
  t += [10, 30, 50, 70, 90].map(p => `<text x="${MX(p)}" y="300" text-anchor="middle" font-size="9.5" fill="${C.dim}">${p}</text>`).join('');
  t += [10, 20, 30, 40, 50].map(h => `<text x="36" y="${MY(h) + 3}" text-anchor="end" font-size="9.5" fill="${C.dim}">${h}</text>`).join('');
  t += `<text x="192" y="316" text-anchor="middle" font-size="9.5" font-style="italic" fill="${C.dim}">PaCO₂ (mmHg) · lo carga el pulmón</text>
        <text x="11" y="150" text-anchor="middle" font-size="9.5" font-style="italic" fill="${C.dim}" transform="rotate(-90 11 150)">HCO₃⁻ (mEq/L) · lo carga el riñón</text>`;
  t += `<g clip-path="url(#abv-k-clip)">`;
  t += `<g opacity=".16" stroke="${C.oro}" stroke-width=".4">${[0, 30, 60, 90, 120, 150].map(g => { const a = g * Math.PI / 180; return `<line x1="${(78 - 260 * Math.cos(a)).toFixed(1)}" y1="${(58 - 260 * Math.sin(a)).toFixed(1)}" x2="${(78 + 260 * Math.cos(a)).toFixed(1)}" y2="${(58 + 260 * Math.sin(a)).toFixed(1)}"/>`; }).join('')}</g>`;
  // isolíneas de pH (Ec. 31.2): rectas que pasan por el origen
  for (let i = 0; i <= 8; i++) {
    const ph = 6.9 + i / 10, Hn = 10 ** (9 - ph), h = p => 24 * p / Hn;
    const p0 = Math.max(10, 4 * Hn / 24), p1 = Math.min(90, 50 * Hn / 24), es = Math.abs(ph - 7.4) < .01;
    if (p0 >= p1) continue;
    t += `<path d="M${MX(p0).toFixed(1)} ${MY(h(p0)).toFixed(1)}L${MX(p1).toFixed(1)} ${MY(h(p1)).toFixed(1)}" stroke="${es ? C.oro : C.muted}" stroke-width="${es ? .7 : .45}" ${es ? 'stroke-dasharray="3 3"' : ''} opacity="${es ? .8 : .45}" fill="none"/>`;
    const lx = p1 < 90 ? MX(p1) - 3 : 336, ly = p1 < 90 ? 24 : MY(h(90)) - 3;
    t += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="end" font-size="8.4" font-style="italic" fill="${es ? C.oro : C.muted}">${fmt(ph, 1)}</text>`;
  }
  // rosa de los vientos
  t += `<g transform="translate(80 58)" opacity=".9"><circle r="21" fill="none" stroke="${C.oro}" stroke-width=".5"/><circle r="16" fill="none" stroke="${C.oro}" stroke-width=".35" stroke-dasharray="1 2"/>
      ${[0, 1, 2, 3].map(i => `<path d="M0 -24L3.4 -3.4L0 0Z" fill="${C.oro}" transform="rotate(${i * 90})"/><path d="M0 -24L-3.4 -3.4L0 0Z" fill="url(#abv-k-oro)" stroke="${C.oro}" stroke-width=".4" transform="rotate(${i * 90})"/>`).join('')}
      ${[0, 1, 2, 3].map(i => `<path d="M0 -14L2 -2L0 0L-2 -2Z" fill="none" stroke="${C.oro}" stroke-width=".5" transform="rotate(${45 + i * 90})"/>`).join('')}</g>`;
  // el puerto: rangos normales (pH 7,36-7,44 · PaCO₂ 36-44 · HCO₃⁻ 22-26)
  t += `<rect x="${MX(36)}" y="${MY(26)}" width="${(MX(44) - MX(36)).toFixed(1)}" height="${(MY(22) - MY(26)).toFixed(1)}" fill="url(#abv-k-ray)" stroke="${C.verde}" stroke-width=".9"/>
        <text x="${MX(44) + 3}" y="${MY(22) + 1}" font-size="8.4" font-style="italic" fill="${C.verde}">● normal</text>`;
  t += `<g id="abv-k-lineas"></g><path id="abv-k-brillo" d="" stroke="${C.oro}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>
        <path id="abv-k-estela" d="" stroke="${C.oro}" stroke-width="1.1" fill="none" stroke-dasharray="1.2 3" stroke-linecap="round"/>
        <g id="abv-k-marcas"></g><g id="abv-k-cola"></g><path id="abv-k-tend" d="" stroke="${C.verde}" stroke-width="2.2" fill="none" stroke-dasharray="5 4" stroke-linecap="round" opacity="0"/>
        <g id="abv-k-punto"><circle r="11" fill="${alfa(C.oro, .12)}" stroke="${C.oro}" stroke-width=".7"/><circle r="5.4" fill="${C.crema}" stroke="${C.oro}" stroke-width="1.6"/><circle r="1.6" fill="${C.fondo}"/></g>
        <text id="abv-k-punto-t" font-size="10" fill="${C.crema}"></text></g>`;
  // el reloj de arena (min · h · días)
  t += `<g transform="translate(306 236)"><path d="M-12 -22H12M-12 22H12" stroke="${C.oro}" stroke-width="1.5"/>
      <path d="M-10 -22C-10 -7 -2 -4 -2 0C-2 4 -10 7 -10 22M10 -22C10 -7 2 -4 2 0C2 4 10 7 10 22" stroke="${C.oro}" stroke-width=".9" fill="${alfa(C.fondo, .7)}"/>
      <path id="abv-k-arriba" d="" fill="${C.ocre}"/><path id="abv-k-abajo" d="" fill="${C.ocre}"/>
      <text y="36" text-anchor="middle" font-size="8.4"><tspan id="abv-k-r0">min</tspan> · <tspan id="abv-k-r1">h</tspan> · <tspan id="abv-k-r2">días</tspan></text></g>`;
  svg.innerHTML = t;
  ['k-lineas', 'k-brillo', 'k-estela', 'k-marcas', 'k-cola', 'k-tend', 'k-punto', 'k-punto-t', 'k-arriba', 'k-abajo'].forEach(id => CARTA.nodos[id] = svg.querySelector('#abv-' + id));
  pintarLineas();
}
function lineasDe(f) {
  if (f === 'nefro') return [
    { id: 'acid', d: trazar(h => [40 - 1.2 * (25 - h), h], 25, 4) + trazar(h => [40 - .85 * (25 - h), h], 4, 25).replace(/^M/, 'L') + 'Z', col: C.rojo, txt: 'acidosis metabólica (banda 0,85-1,2)', banda: true },
    { id: 'alc', d: trazar(h => [40 + .7 * (h - 25), h], 25, 50), col: C.ocre, txt: 'alcalosis metabólica' },
    { id: 'ag', d: trazar(p => [p, 25 + .1 * (p - 40)], 40, 90, 2) + trazar(p => [p, 25 - .2 * (40 - p)], 40, 10, 2) + trazar(p => [p, 25 - .25 * (40 - p)], 40, 10, 2), col: C.muted, dash: true, txt: 'respiratoria aguda (alcalosis: 0,2-0,25)' },
    { id: 'cr', d: trazar(p => [p, 25 + .3 * (p - 40)], 40, 90, 2) + trazar(p => [p, 25 - .5 * (40 - p)], 40, 10, 2), col: C.muted, txt: 'respiratoria crónica' },
  ];
  return [
    { id: 'acid', d: trazar(h => [40 - 1.2 * (24 - h), h], 24, 4), col: C.rojo, txt: 'acidosis metabólica' },
    { id: 'alc', d: trazar(h => [40 + .7 * (h - 24), h], 24, 50), col: C.ocre, txt: 'alcalosis metabólica' },
    { id: 'ag', d: trazar(p => [p, 24 + .1 * (p - 40)], 40, 90, 2) + trazar(p => [p, 24 - .2 * (40 - p)], 40, 10, 2), col: C.muted, dash: true, txt: 'respiratoria aguda' },
    { id: 'cr', d: trazar(p => [p, 24 + .4 * (p - 40)], 40, 90, 2) + trazar(p => [p, 24 - .4 * (40 - p)], 40, 10, 2), col: C.muted, txt: 'respiratoria crónica' },
  ];
}
let fuenteLineas = null;
function pintarLineas() {
  if (fuenteLineas === E.fuente) return; fuenteLineas = E.fuente;
  const L = lineasDe(E.fuente);
  CARTA.nodos['k-lineas'].innerHTML = L.map(l => `<path id="abv-k-l-${l.id}" d="${l.d}" stroke="${l.col}" stroke-width="${l.id === 'acid' || l.id === 'alc' ? 1.7 : .9}" fill="${l.banda ? alfa(l.col, .14) : 'none'}" ${l.dash ? 'stroke-dasharray="4 3"' : ''}/>`).join('')
    + `<text x="${MX(17)}" y="${MY(4.8)}" font-size="9" font-style="italic" fill="${C.rojo}">acidosis metabólica</text>
       <text x="${MX(47) + 6}" y="${MY(42) + 3}" font-size="9" font-style="italic" fill="${C.ocre}">alcalosis metabólica</text>
       <text x="${MX(66)}" y="${MY(34.6) - 4}" font-size="8.4" font-style="italic" fill="${C.muted}">crónica</text>
       <text x="${MX(70)}" y="${MY(27) + 10}" font-size="8.4" font-style="italic" fill="${C.muted}">aguda</text>`;
  $('#abv-leyenda-lineas').innerHTML = L.map(l => `<span><i class="${l.dash ? 'abv-dash' : ''}" style="--c:${l.col}"></i>${l.txt}</span>`).join('') + `<span><i class="abv-dash" style="--c:${C.oro}"></i>isolíneas de pH</span>`;
}
function pintarArena(f) {
  const ancho = y => 2 + 8 * Math.pow(Math.abs(y) / 22, .7), hA = 20 * (1 - f), hB = 20 * f;
  let d = ''; if (hA > .3) { const y0 = -2 - hA; d = `M${(-ancho(y0) + 1).toFixed(1)} ${y0.toFixed(1)}H${(ancho(y0) - 1).toFixed(1)}L1 -2H-1Z`; }
  CARTA.nodos['k-arriba'].setAttribute('d', d);
  let e = ''; if (hB > .3) { const y0 = 21 - hB; e = `M-9 21H9L${(ancho(y0) - 1.5).toFixed(1)} ${(y0 + 2).toFixed(1)}Q0 ${(y0 - 3).toFixed(1)} ${(-ancho(y0) + 1.5).toFixed(1)} ${(y0 + 2).toFixed(1)}Z`; }
  CARTA.nodos['k-abajo'].setAttribute('d', e);
}
const ARENA = { '0': 0, min: .18, h: .55, dias: .92 };
let arenaAnt = null;
function pintarReloj(animar) {
  const z = E.reloj;
  ['min', 'h', 'dias'].forEach((k, i) => { const ts = $('#abv-k-r' + i); ts.setAttribute('fill', z === k ? C.oro : C.muted); ts.setAttribute('font-weight', z === k ? '700' : '400'); });
  $$('.abv-reloj .abv-zonas span').forEach(s => s.classList.toggle('abv-on', s.dataset.z === z));
  const obj = ARENA[z] ?? 0;
  if (arenaAnt !== obj) {
    if (QUIETO || !animar || !M) { CARTA.arena = obj; pintarArena(obj); }
    else M.animate(CARTA.arena, obj, { duration: 1.4, ease: 'easeInOut', onUpdate: v => { CARTA.arena = v; pintarArena(v); } });
    // barras del dock: el pulmón llega en horas (≈1,5 s), el riñón en días (≈4 s); duraciones ilustrativas
    const bp = { '0': 0, min: 10, h: 100, dias: 100 }[z], br = { '0': 0, min: 0, h: 6, dias: 100 }[z];
    const bP = $('#abv-barra-pulmon b'), bR = $('#abv-barra-rinon b');
    if (QUIETO || !animar || !M) { bP.style.width = bp + '%'; bR.style.width = br + '%'; }
    else { M.animate(bP, { width: bp + '%' }, { duration: 1.5, ease: 'easeOut' }); M.animate(bR, { width: br + '%' }, { duration: 4, ease: 'easeOut' }); }
    arenaAnt = obj;
  }
}
// el cometa: punto + estela de 12 puntos que se desvanecen + la derrota entera en discontinua
function pintarCometa() {
  pintarLineas();
  const n = CARTA.nodos, x = MX(E.paco2), y = MY(E.hco3);
  const tapa = oc('punto');   // mayéutica: el punto no se enseña hasta contestar
  ['k-punto', 'k-punto-t', 'k-cola', 'k-estela'].forEach(k => n[k].setAttribute('visibility', tapa ? 'hidden' : 'visible'));
  n['k-punto'].setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const u = CARTA.estela[CARTA.estela.length - 1];
  if (!u || Math.hypot(u[0] - x, u[1] - y) > 1.4) {
    CARTA.estela.push([x, y]); if (CARTA.estela.length > 400) CARTA.estela.shift();
    CARTA.cola.push([x, y]); if (CARTA.cola.length > 12) CARTA.cola.shift();
    n['k-estela'].setAttribute('d', CARTA.estela.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(''));
    n['k-cola'].innerHTML = CARTA.cola.map((q, i) => `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(1.2 + i * .32).toFixed(2)}" fill="${C.oro}" opacity="${((i + 1) / CARTA.cola.length * .75).toFixed(2)}"/>`).join('');
  }
  const der = x > 250;
  // El pH del cometa, arriba o abajo del punto; si caería sobre el rótulo «alcalosis metabólica», al otro lado
  let ty = E.hco3 < 24 ? y + 19 : y - 10;
  const tx0 = der ? x - 58 : x + 13, alcX = MX(47) + 6, alcY = MY(42) + 3;
  if (Math.abs(ty - alcY) < 12 && tx0 + 45 > alcX && tx0 < alcX + 90) ty = E.hco3 < 24 ? y - 10 : y + 19;
  n['k-punto-t'].setAttribute('x', (der ? x - 13 : x + 13).toFixed(1)); n['k-punto-t'].setAttribute('y', ty.toFixed(1));
  n['k-punto-t'].setAttribute('text-anchor', der ? 'end' : 'start');
  n['k-punto-t'].textContent = E.tendencia ? 'pH ↓ (tendencia)' : `pH ${oc('ph') ? '?' : phTxt(E.paco2, E.hco3)}`;
}
function reiniciarEstela() { CARTA.estela = []; CARTA.cola = []; CARTA.nodos['k-cola'].innerHTML = ''; CARTA.nodos['k-estela'].setAttribute('d', ''); }
// la estela dibujada entera de golpe (reducir movimiento): eje primero, línea después
function estelaCanonica(desde, hasta) {
  reiniciarEstela();
  const pts = [[desde.paco2, desde.hco3], [desde.paco2, hasta.hco3], [hasta.paco2, hasta.hco3]];
  for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k <= 10; k++) { const p = lerp(pts[i][0], pts[i + 1][0], k / 10), h = lerp(pts[i][1], pts[i + 1][1], k / 10); CARTA.estela.push([MX(p), MY(h)]); }
  CARTA.cola = CARTA.estela.slice(-12);
  const n = CARTA.nodos;
  n['k-estela'].setAttribute('d', CARTA.estela.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(''));
  n['k-cola'].innerHTML = CARTA.cola.map((q, i) => `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(1.2 + i * .32).toFixed(2)}" fill="${C.oro}" opacity="${((i + 1) / 12 * .75).toFixed(2)}"/>`).join('');
}
function pintarMarcas() {
  CARTA.nodos['k-marcas'].innerHTML = CARTA.marcas.map(m => { const x = MX(m.p), y = MY(m.h); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${C.fondo}" stroke="${C.oro}" stroke-width=".9"/><text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle" font-size="8" fill="${C.oro}">${m.t}</text>`; }).join('');
}
function brilloLinea() {
  const d = derivarRapido(), b = CARTA.nodos['k-brillo'], l = d.lectura;
  const met = (l.prim === 'acidMet' || l.prim === 'alcMet') && l.anadido === 'no' && !E.tendencia;
  if (!met || oc('punto')) { b.setAttribute('opacity', 0); return; }
  const acid = l.prim === 'acidMet', f = E.fuente === 'nefro', base = f ? 25 : 24;
  const fn = acid ? (h => [40 - 1.2 * (base - h), h]) : (h => [40 + .7 * (h - base), h]);
  b.setAttribute('d', trazar(fn, base, E.hco3, acid ? .5 : .5));
  b.setAttribute('stroke', acid ? C.rojo : C.ocre); b.setAttribute('opacity', .3);
}
function tendenciaCarta() {
  const t = CARTA.nodos['k-tend'];
  if (!E.tendencia || E.farmaco === 'bicarbonato') { t.setAttribute('opacity', 0); return; }
  let d = ''; const off = -9;
  for (let h = 38; h >= 28; h -= .5) d += `${d ? 'L' : 'M'}${(MX(40 + .7 * (h - 24)) + off).toFixed(1)} ${MY(h).toFixed(1)}`;
  const xe = MX(40 + .7 * 4) + off, ye = MY(28);
  d += `M${(xe - 6).toFixed(1)} ${(ye - 8).toFixed(1)}L${xe.toFixed(1)} ${ye.toFixed(1)}L${(xe + 6).toFixed(1)} ${(ye - 6).toFixed(1)}`;
  t.setAttribute('d', d); t.setAttribute('opacity', 1);
}
function fraseCarta() {
  const d = derivarRapido(), l = d.lectura;
  let f;
  if (E.tendencia && E.farmaco !== 'bicarbonato') f = `La flecha verde es solo la <strong>dirección</strong>: vuelve hacia el puerto por la línea ocre. ${O('i', 'tendencia')}`;
  else if (E.tendencia) f = `Tendencia: el bicarbonato sube el HCO₃⁻, y su CO₂ sube la PaCO₂ si no se ventila más. ${O('i', 'sin cifras: hueco 8')}`;
  else if (E.teorico || (E.reloj === 'min' && (l.prim === 'acidMet' || l.prim === 'alcMet'))) f = `<span class="hl-rojo">Instante teórico</span>: bajó por el eje del HCO₃⁻ y aún no ha llegado a su línea (esperada ${fmt(d.eP.v, 1)}).`;
  else if (pasoActual === '3' && E.paciente === 'A' && E.cl > 108) f = `Mismo punto que en el paso 2: <span class="hl-purpura">el mapa no ve el cloro</span>. La hiperclorémica añadida solo la destapa el delta (${fmt(d.delta, 2)}).`;
  else if (l.prim === 'acidMet' || l.prim === 'alcMet') f = l.anadido === 'no' ? `Sobre su línea: <span class="hl-verde">compensación esperada</span> (PaCO₂ ${fmtA(E.paco2)}; esperada ${fmt(d.eP.v, 1)}).` : `Fuera de su línea: ${l.txt} (esperada ${fmt(d.eP.v, 1)}).`;
  else if (l.prim === 'acidResp' || l.prim === 'alcResp') f = `Respiratorio: HCO₃⁻ esperado ${fmt(d.eH.ag, 1)} agudo y ${fmt(d.eH.cr, 1)} crónico; el medido, ${fmtA(E.hco3)}: <strong>${l.txt}</strong>.`;
  else if (l.prim === 'mixto') f = `pH en rango con la PaCO₂ fuera: <span class="hl-rojo">${l.txt}</span> (Regla 2).`;
  else f = 'En el puerto: gasometría normal. El punto es el paciente; la línea de puntos, su derrota.';
  html('#abv-carta-frase').innerHTML = f;
  html('#abv-carta-org').innerHTML = plegarOrigen(O('f', 'mr-acidobase-analisis#mr-regla-3') + O('f', 'mr-acidobase-analisis#mr-regla-4') + (E.fuente === 'nefro' ? O('f', 'fisio-acidobase-acidosis · líneas desde HCO₃⁻ 25') : '') + O('g', 'isolíneas: la Ec. 31.2 a pH fijo'));
}

// ═════════════════════════════════════════════════════════════════════
// 7 · Motor: un estado, una transición por fases (primero el trastorno, luego el pulmón, al final el riñón)
// ═════════════════════════════════════════════════════════════════════
let pasoActual = '0', CAUSA_ACTUAL = null, modo = 'explorar';
const causaActual = () => CAUSA_ACTUAL ? CAUSA[CAUSA_ACTUAL] : null;
let token = 0;
const NUM = ['na', 'cl', 'hco3', 'paco2', 'alb'];
function animarNum(dur, fn) {
  if (QUIETO || !M) { fn(1); return Promise.resolve(); }
  return new Promise(res => { M.animate(0, 1, { duration: dur, ease: 'easeInOut', onUpdate: fn }).then(() => { fn(1); res(); }); });
}
const sobreLinea = e => { const h = e.hco3; if (Math.abs(h - 24) < 1) return null; const esp = espPaco2(h, e.fuente).v; return Math.abs(e.paco2 - esp) < 1.6 ? (h < 24 ? 'acid' : 'alc') : null; };
function planificar(a, b) {
  const lb = derivar(b).lectura, resp = lb.prim === 'acidResp' || lb.prim === 'alcResp' || (lb.prim === 'mixto' && Math.abs(b.paco2 - a.paco2) > Math.abs(b.hco3 - a.hco3));
  const metab = { na: b.na, cl: b.cl, hco3: b.hco3, alb: b.alb };
  const modoMet = b.vomito && b.hco3 > a.hco3 ? 'vomito' : (b.farmaco === 'acetazolamida' || (b.tendencia && b.hco3 < a.hco3 && b.paciente === 'B')) ? 'orina' : 'acido';
  const la = sobreLinea(a), lb2 = sobreLinea(b);
  if (la && la === lb2 && !b.teorico && Math.abs(a.hco3 - b.hco3) > .5) {   // se desliza por su línea
    const errA = a.paco2 - espPaco2(a.hco3, a.fuente).v, errB = b.paco2 - espPaco2(b.hco3, b.fuente).v;
    return [{ dur: 2.6, hacia: { ...metab }, desliza: [errA, errB], modo: b.hco3 > a.hco3 ? 'vuelve' : modoMet }];
  }
  const cambiaMet = NUM.filter(k => k !== 'paco2').some(k => Math.abs(b[k] - a[k]) > .05);
  const cambiaP = Math.abs(b.paco2 - a.paco2) > .05;
  const fP = { dur: 1.5, hacia: { paco2: b.paco2 }, modo: 'pulmon' };
  const fM = { dur: resp ? (b.reloj === 'dias' ? 4 : 1.2) : 2.1, hacia: metab, modo: resp ? 'rinon' : modoMet };
  if (resp) return [cambiaP && fP, cambiaMet && fM].filter(Boolean);
  return [cambiaMet && fM, cambiaP && fP].filter(Boolean);
}
async function irAEstado(dest, op = {}) {
  const t = ++token;
  const a = { ...E };
  if (op.reinicio) { reiniciarEstela(); CARTA.marcas = []; }
  if (QUIETO || op.inmediato || !M) {
    E = { ...dest }; MODO_EVENTO = null;
    if (!op.sinEstela && (QUIETO || !M)) estelaCanonica(op.desdeCanon || a, E);
    pintarTodo(!op.inmediato); return;
  }
  // los campos que no son números cambian al empezar (el reloj, el cloro de la luz, el fármaco…)
  const discretos = { ...dest }; NUM.forEach(k => discretos[k] = E[k]); discretos.osm = dest.osm;
  const otro = dest.paciente !== a.paciente || op.reinicio;
  if (otro) {   // otro paciente: la escena vuelve al punto de partida
    NUM.forEach(k => discretos[k] = BASE[k]); reiniciarEstela(); CARTA.marcas = [];
    PLA.prev = null; PLA.ev.length = 0; PLA.hex.forEach(h => h.g.remove()); PLA.hex = []; INST.fichasL.forEach(g => g.remove()); INST.fichasR.forEach(g => g.remove()); INST.fichasL = []; INST.fichasR = [];
    INST.vuelos.forEach(v => { v.g.remove(); v.res(); }); INST.vuelos.length = 0;
  }
  // Al cambiar de paciente, los platillos se rellenan de golpe (sin 20 vuelos a la vez: era el pico de la maqueta)
  SIN_VUELOS = otro; E = discretos; pintarTodo(true); SIN_VUELOS = false;
  const fases = op.juntos ? [{ dur: 2, hacia: Object.fromEntries(NUM.map(k => [k, dest[k]])), modo: 'rinon' }] : planificar(E, dest);
  for (const f of fases) {
    if (t !== token) return;
    MODO_EVENTO = f.modo;
    const desde = {}; for (const k in f.hacia) desde[k] = E[k];
    await animarNum(f.dur, k => {
      if (t !== token) return;
      for (const c in f.hacia) E[c] = lerp(desde[c], f.hacia[c], k);
      if (f.desliza) E.paco2 = espPaco2(E.hco3, E.fuente).v + lerp(f.desliza[0], f.desliza[1], k);
      pintarFotograma();
    });
  }
  if (t !== token) return;
  E = { ...dest }; MODO_EVENTO = null;
  pintarTodo(true);
}
// Durante una transición solo se repinta lo que se ve (las vistas fuera de pantalla esperan al final)
const VISIBLE = { carta: true };
function pintarFotograma() { pintarInstrumento(true, true); if (LIENZOS['cv-plasma']?.visible) pintarPlasma(true); if (VISIBLE.carta) pintarCometa(); if (VIVO) pintarEstudioVivo(); }
// El repintado completo se reparte en tres fotogramas (lo que se mueve, primero; el texto, después): ningún fotograma largo
let tandas = null;
function pintarTodo(animar) {
  _cacheE = null;
  pintarInstrumento(animar); pintarPlasma(true); pintarCometa(); pintarReloj(animar);
  if (QUIETO) { estampaCelula(); sembrarFlujo(); ALV.vol = Array.from({ length: Math.round(4 * ventilacion()) }, (_, i) => ({ x: 176 + i * 3, y: 34 - i * 7, edad: 0, vida: 2.2, giro: i, r: 4.8 })); }
  if (tandas) return;
  tandas = requestAnimationFrame(() => {
    _cacheE = null; pintarAlveolo(); pintarRinon(); brilloLinea(); tendenciaCarta(); pintarMarcas(); pedirPintura();
    tandas = requestAnimationFrame(() => {
      fraseCarta(); pintarTextos(); pintarPlasma(false);
      tandas = requestAnimationFrame(() => { sincronizarMandos(); pintarEstudioVivo?.(); tandas = null; });
    });
  });
}

// ═════════════════════════════════════════════════════════════════════
// 8 · Explorar: el caso guiado, la frase viva y los datos
// ═════════════════════════════════════════════════════════════════════
function fraseGenerica(d) {
  const l = d.lectura, c = causaActual();
  let f = `<strong>${E.etiqueta}</strong>: ${l.txt}${l.regla ? ` <span class="abv-sub">(${l.regla})</span>` : ''}. `;
  if (c && c.dice) f += c.dice + ' ';
  if (d.HA > 12.5 && !E.tendencia) f += `Hiato <span class="hl-rojo">${fmt(d.HA)}</span>${d.delta != null ? `, delta ${fmt(d.delta, 2)}` : ''}.`;
  else if (E.hco3 < 22 && !E.tendencia && (l.prim === 'acidMet' || l.anadido === 'acidMet')) f += `Hiato normal (${fmt(d.HA)}): hiperclorémica.`;
  const org = (c ? O('f', c.f) + (c.fd ? O('f', c.fd) : '') : O('f', 'mr-acidobase-analisis#mr-regla-1')) + (CAUSA_ACTUAL && !['normal', 'cad', 'vomitos'].includes(CAUSA_ACTUAL) && !['metanol', 'salic', 'lactica', 'hiperaldo', 'mixta', 'respAg', 'respCr', 'acetazol', 'bicarb'].includes(CAUSA_ACTUAL) ? O('i', 'HCO₃⁻ dentro del rango de la tabla; PaCO₂ la esperada') : '') + (CAUSA_ACTUAL && ['respAg', 'respCr', 'mixta', 'salic', 'hiperaldo'].includes(CAUSA_ACTUAL) ? O('i', 'Cl⁻ derivado para dejar el HA') : '') + (!CAUSA_ACTUAL && !PASOS.find(p => p.id === pasoActual) ? O('i', 'gasometría del laboratorio') : '');
  return [f, org];
}
function pintarTextos() {
  const d = derivarRapido(), p = PASOS.find(x => x.id === pasoActual);
  if (p && !CAUSA_ACTUAL) {
    $('#abv-paso-nombre').textContent = `Paso ${p.id} · ${p.nombre}`; $('#abv-paso-trastorno').textContent = p.trastorno;
    const fp = FRASES_PASO[p.id]; html('#abv-frase').innerHTML = T(fp.t); html('#abv-frase-org').innerHTML = plegarOrigen(orgDe(fp.org));
  } else {
    // sin paso ni causa: el laboratorio, o el paciente de un caso («Abrir el modelo en el estado del paciente»)
    $('#abv-paso-nombre').textContent = CAUSA_ACTUAL ? `Causa · ${causaActual().t}` : E.caso ? `Caso · ${E.etiqueta}` : 'Laboratorio';
    $('#abv-paso-trastorno').textContent = d.lectura.txt;
    const [f, o] = fraseGenerica(d); html('#abv-frase').innerHTML = f; html('#abv-frase-org').innerHTML = plegarOrigen(o);
  }
  // los datos, cada uno con su origen corto (el largo, en «De dónde sale cada cifra»)
  const tend = E.tendencia, n0 = BASE;
  const met = d.lectura.prim === 'acidMet' || d.lectura.prim === 'alcMet', resp = d.lectura.prim === 'acidResp' || d.lectura.prim === 'alcResp';
  const celdas = [
    ['Na⁺', tend ? '—' : fmtA(E.na), E.na !== n0.na, 'caso'],
    ['Cl⁻', tend ? '↑' : fmt(E.cl), Math.abs(E.cl - n0.cl) > .5, 'caso'],
    ['HCO₃⁻', tend ? (E.farmaco === 'bicarbonato' ? '↑' : '↓') : fmtA(E.hco3), Math.abs(E.hco3 - 24) > .5, 'caso'],
    ['PaCO₂', tend ? (E.farmaco === 'bicarbonato' ? '↑?' : '↓') : fmtA(E.paco2), Math.abs(E.paco2 - 40) > .5, 'caso'],
    ['Hiato', tend ? '12' : fmt(d.HA), d.HA > 12.5 || d.HA < 7.5, Math.abs(d.HAc - d.HA) > .4 ? `corr. ${fmt(d.HAc)}` : 'Ec. 31.14'],
    ['Delta', tend || d.delta == null ? '—' : fmt(d.delta, 2), d.delta != null && Math.abs(d.delta - 1) > .15, 'Ec. 31.16'],
    met ? ['PaCO₂ esp.', tend ? '—' : fmt(d.eP.v, 1), false, 'Fig. 31.2'] : resp ? ['HCO₃⁻ esp.', `${fmt(d.eH.ag, 0)}-${fmt(d.eH.cr, 0)}`, false, 'ag.-cr.'] : ['PaCO₂ esp.', '—', false, 'Fig. 31.2'],
    E.k != null ? ['K⁺', typeof E.k === 'number' ? fmt(E.k, 1) : E.k, true, typeof E.k === 'number' ? 'caso' : 'tabla PIF'] : d.osmGap != null ? ['Hiato osm.', fmt(d.osmGap), E.fuente === 'nefro' ? d.osmGap > 20 : d.osmGap >= 10, 'Ec. 31.17'] : ['Cl⁻ orina', E.clOrina || '—', !!E.clOrina, 'Tabla 33.1'],
  ];
  html('#abv-datos').innerHTML = celdas.map(([k, v, cambia, o]) => `<div><dt>${k}</dt><dd class="${cambia ? 'abv-cambia' : ''}">${v}<small>${o}</small></dd></div>`).join('');
  if ($('#abv-de-donde-det').open) html('#abv-de-donde').innerHTML = `<ul>
    <li>Na⁺, Cl⁻, HCO₃⁻, PaCO₂: ${pasoActual && !CAUSA_ACTUAL ? 'del caso guiado' : 'del estado elegido'} ${O('i', 'paciente inventado')}</li>
    <li>pH = 9 − log (24 × PaCO₂ / HCO₃⁻) ${O('f', 'mr-acidobase-analisis#mr-ecuacion-h')}</li>
    <li>Hiato = Na − (Cl + HCO₃⁻); corregido = HA + 2,5 × (${fmt(FUENTES[E.fuente].albN, 1)} − albúmina) ${O('f', 'mr-acidobase-gaps#mr-ag-formula')}${O('f', 'mr-acidobase-gaps#mr-ag-albumina')}</li>
    <li>Delta = (HA − 12) / (24 − HCO₃⁻) ${O('f', 'mr-acidobase-gaps#mr-delta-menor')}${E.fuente === 'nefro' ? ` · Nefrología al día: <0,4 hiperclorémica, 0,4-2 pura, >2 alcalosis ${O('f', 'fisio-acidobase-acidosis · Δ-ratio')}` : ''}</li>
    <li>PaCO₂ esperada 40 − 1,2 × (24 − HCO₃⁻) o 40 + 0,7 × (HCO₃⁻ − 24); HCO₃⁻ esperado 0,1 o 0,2 (agudo) y 0,4 (crónico) × ΔPaCO₂ ${O('f', 'mr-acidobase-analisis#mr-comp-acidosis-met')}${O('f', 'mr-acidobase-analisis#mr-comp-cronico')}</li>
    <li>Rangos: pH 7,36-7,44 · PaCO₂ 36-44 · HCO₃⁻ 22-26; tolerancias de la calculadora de la app (±1 en la Regla 3, ±0,5 en la 4), no de la fuente ${O('f', 'mr-acidobase-analisis#mr-regla-3')}</li>
    <li>Otros cationes 11, otros aniones 8, albúmina 15 (Tabla 31.2) ${O('f', 'mr-acidobase-gaps#mr-ag-formula')}</li>
    <li>Fichas de los platillos: 1 ≈ 4 mmHg o 2,4 mEq/L; partículas en proporción ${O('i', '')}</li></ul>`;
  // salidas de este paso
  const sal = [];
  if (pasoActual === '3' && !CAUSA_ACTUAL) {
    sal.push('<button type="button" class="abv-b abv-link" data-especialidad="libros" data-view="aguaViva" data-agua-viva="salino">Ver adónde va el salino en el río y mar →</button>');
    sal.push(enlaceFicha('mar-cristaloides', 'Ver el cloro de cada suero (Tabla 10.2) →', 'mar-tabla-10-2'));
  }
  const c = causaActual(); if (c && c.nefrona) sal.push(boton('nefrona', c.nefrona, `Abrir en la nefrona viva: ${c.t}`));
  html('#abv-salidas-paso').innerHTML = sal.join('');
  // dock
  $$('#abv-chips .abv-chip').forEach(b => { if (b.dataset.id === pasoActual && !CAUSA_ACTUAL) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  $('#abv-mini-paso').textContent = CAUSA_ACTUAL ? causaActual().t : pasoActual ? `paso ${pasoActual}` : E.caso ? E.etiqueta.split(' · ')[0] : 'laboratorio';
}
function construirDock() {
  $('#abv-chips').innerHTML = PASOS.map((p, i) => `<button type="button" class="abv-chip" data-i="${i}" data-id="${p.id}" aria-label="Paso ${p.id}: ${p.nombre}">${p.id}<small>${p.corto}</small></button>`).join('');
  $('#abv-chips').addEventListener('click', e => { const b = e.target.closest('.abv-chip'); if (b) irPaso(+b.dataset.i); });
  $('#abv-sig').addEventListener('click', () => { const i = PASOS.findIndex(p => p.id === pasoActual); irPaso(CAUSA_ACTUAL || i < 0 ? 0 : (i + 1) % PASOS.length); });
}
function marcasDe(id) {
  const lista = ['0', '4', '5'].includes(id) ? ['0', '4'] : ['0', '1', '2', '3', '3b'];
  const idx = lista.indexOf(id); if (idx < 0) return [];
  return lista.slice(0, idx).filter(k => !(k === '3' && id === '3b')).map(k => { const e = PASO_E[PASOS.findIndex(p => p.id === k)]; return { p: e.paco2, h: e.hco3, t: k }; });
}
function irPaso(i) {
  const p = PASOS[i], dest = PASO_E[i];
  const antes = pasoActual, desdeCanon = PASO_E[Math.max(0, PASOS.findIndex(x => x.id === antes))];
  CAUSA_ACTUAL = null; pasoActual = p.id;
  if (dest.obj === 'rinon') E.tramo = dest.tramo;
  // abrir la vista va en su propio fotograma, después de las tres tandas del repintado: así ningún fotograma junta
  // la maqueta de la vista nueva con los textos
  enFotograma(4, () => { if (dest.obj === 'rinon') irNivel(dest.nivel); abrirObjetivo(dest.obj, true); });
  const reinicio = i === 0 || (E.paciente !== dest.paciente);
  if (i === 0) { reiniciarEstela(); CARTA.marcas = []; }
  CARTA.marcas = marcasDe(p.id);
  irAEstado(dest, { reinicio: reinicio && i !== 0, desdeCanon: QUIETO ? (dest.paciente === 'B' ? PASO_E[0] : (p.id === '3b' ? PASO_E[2] : PASO_E[Math.max(0, i - 1)])) : desdeCanon });
}
function irCausa(id) {
  const c = CAUSA[id]; CAUSA_ACTUAL = id; pasoActual = null;
  const dest = estadoDe({ ...c.e, fuente: E.fuente });
  if (dest.obj === 'rinon') E.tramo = dest.tramo;
  enFotograma(4, () => { if (dest.obj === 'rinon') irNivel(2); abrirObjetivo(dest.obj, true); });
  CARTA.marcas = [];
  irAEstado(dest, { reinicio: true, desdeCanon: BASE });
}

// ═════════════════════════════════════════════════════════════════════
// 9 · Los mandos (laboratorio y tarjetas de estudio): una sola función mueve el estado
// ═════════════════════════════════════════════════════════════════════
// Devuelve el estado nuevo o {error}. Reglas: el HCO₃⁻ con el Cl⁻ quieto mueve el hiato; el Cl⁻ con el hiato quieto mueve
// el HCO₃⁻ (hiperclorémica); los aniones con el Cl⁻ quieto se comen el HCO₃⁻; la albúmina mueve el Cl⁻ (ilustrativo).
function mandar(campo, v, base = E) {
  let e = { ...base, teorico: false, etiqueta: 'Laboratorio', caso: false };
  if (base.tendencia) { const v4 = PASO_E[5]; if (base.paciente === 'B') Object.assign(e, { na: v4.na, cl: v4.cl, hco3: v4.hco3, paco2: v4.paco2 }); e.tendencia = false; }
  const d = derivar(e), HAb = haBase(e.alb, e.fuente);
  switch (campo) {
    case 'paco2': e.paco2 = v; break;
    case 'hco3': { e.hco3 = v; if (e.na - e.cl - v < HAb) e.cl = e.na - v - HAb; break; }
    case 'cl': { e.cl = v; e.hco3 = e.na - v - d.HA; break; }
    case 'aniones': { e.hco3 = e.na - e.cl - (HAb + v); break; }
    case 'alb': { e.alb = v; e.cl = e.na - e.hco3 - (haBase(v, e.fuente) + d.aniones); break; }
    case 'osm': e.osm = v; break;
    case 'clLuz': e.clLuz = v; e.clOrina = v === 'bajo' ? '<20' : v === 'alto' ? '>20' : null; break;
    default: e[campo] = v;
  }
  if (e.auto) {
    const l = derivar(e).lectura;
    if ((campo === 'paco2' || campo === 'reloj') && (l.prim === 'acidResp' || l.prim === 'alcResp' || Math.abs(e.hco3 - 24) < 9)) {
      const HA = derivar(e).HA, eh = espHco3(e.paco2, e.fuente);
      e.hco3 = r1(e.reloj === 'dias' ? eh.cr : eh.ag); e.cl = e.na - e.hco3 - HA;
    }
    if (campo === 'hco3' && e.reloj !== 'min') e.paco2 = r1(espPaco2(e.hco3, e.fuente).v);
  }
  e.cl = r1(e.cl); e.hco3 = r1(e.hco3);
  if (e.hco3 < 4 || e.hco3 > 50) return { error: 'No cabe: el HCO₃⁻ saldría de 4-50 mEq/L. Combinación no fisiológica.' };
  if (e.cl < 80 || e.cl > 120) return { error: 'No cabe: el Cl⁻ saldría de 80-120 mEq/L. Combinación no fisiológica.' };
  if (e.paco2 < 10 || e.paco2 > 90) return { error: 'La PaCO₂ del laboratorio va de 10 a 90 mmHg.' };
  const ph = r2(calcPH(e.paco2, e.hco3));
  if (ph < 6.8 || ph > 7.8) return { error: `pH ${fmt(ph, 2)}: fuera de 6,80-7,80, no es un paciente posible. El mando se detiene.` };
  return e;
}
let avisoT = null;
function avisar(txt) { const a = $('#abv-inst-aviso'); a.textContent = txt; a.hidden = false; clearTimeout(avisoT); avisoT = setTimeout(() => a.hidden = true, 2800); }
function aplicarMando(campo, v, op = {}) {
  const e = mandar(campo, v);
  if (e.error) { avisar(e.error); sincronizarMandos(); return false; }
  if (modo === 'explorar') { CAUSA_ACTUAL = null; pasoActual = null; }
  if (e.auto && (campo === 'reloj' || campo === 'paco2') && op.animar !== false) { irAEstado(e); return true; }
  token++; MODO_EVENTO = null;   // lo que toca el usuario manda: se corta la transición en curso
  E = e; pintarTodo(true); return true;
}
const MANDOS = {
  paco2: { tipo: 'rango', et: 'PaCO₂ (pulmón)', min: 10, max: 90, step: 1, u: ' mmHg', val: () => Math.round(E.paco2) },
  hco3: { tipo: 'rango', et: 'HCO₃⁻ (riñón)', min: 4, max: 50, step: .2, u: ' mEq/L', val: () => r1(E.hco3), f: 1 },
  cl: { tipo: 'rango', et: 'Cl⁻ plasmático', min: 80, max: 120, step: 1, u: ' mEq/L', val: () => Math.round(E.cl) },
  aniones: { tipo: 'rango', et: 'Aniones no medidos (cetoácidos, lactato)', min: 0, max: 20, step: 1, u: ' mEq/L', val: () => Math.round(derivarRapido().aniones) },
  alb: { tipo: 'rango', et: 'Albúmina', min: 2, max: 4.5, step: .1, u: ' g/dL', val: () => r1(E.alb), f: 1 },
  osm: { tipo: 'rango', et: 'Osmolalidad medida', min: 280, max: 340, step: 1, u: '', val: () => E.osm ?? Math.round(derivarRapido().osmCalc) },
  anion: { tipo: 'seg', et: 'Qué anión', ops: [['ceto', 'cetoácidos'], ['lact', 'lactato']] },
  reloj: { tipo: 'seg', et: 'Reloj', ops: [['min', 'minutos'], ['h', 'horas'], ['dias', 'días']] },
  auto: { tipo: 'seg', et: 'Compensación', ops: [[false, 'la mueves tú'], [true, 'pulmón y riñón solos']] },
  clLuz: { tipo: 'seg', et: 'Cl⁻ en la luz del colector', ops: [['bajo', 'bajo (<20)'], ['alto', 'alto (>20)']] },
  aldo: { tipo: 'seg', et: 'Aldosterona', ops: [['normal', 'normal'], ['alta', 'alta']] },
  respirador: { tipo: 'seg', et: 'Respirador', ops: [[false, 'no'], [true, 'ventilado']] },
  fuente: { tipo: 'seg', et: 'Fuente', ops: [['marino', 'Marino'], ['nefro', 'Nefrología al día']] },
};
function htmlMando(campo, extra = '') {
  const m = MANDOS[campo];
  if (m.tipo === 'rango') return `<label class="abv-mando"><span class="abv-val">${m.et} <output data-salida="${campo}"></output></span>
    <input type="range" data-mando="${campo}" min="${m.min}" max="${m.max}" step="${m.step}" value="${m.val()}" aria-label="${m.et}"></label>${extra}`;
  return `<div class="abv-mando"><span class="abv-val">${m.et}</span><div class="abv-seg" role="group" aria-label="${m.et}">${m.ops.map(([v, t]) => `<button type="button" data-mando="${campo}" data-v="${v}" aria-pressed="false">${t}</button>`).join('')}</div></div>${extra}`;
}
function sincronizarMandos() {
  $$('input[data-mando]').forEach(i => { const m = MANDOS[i.dataset.mando]; if (m && document.activeElement !== i) i.value = m.val(); });
  $$('output[data-salida]').forEach(o => { const m = MANDOS[o.dataset.salida]; if (m) o.textContent = (o.dataset.salida === 'osm' && E.osm == null ? '—' : fmt(m.val(), m.f || 0)) + m.u; });
  $$('button[data-mando]').forEach(b => { const cur = E[b.dataset.mando]; const v = b.dataset.v; b.setAttribute('aria-pressed', String(String(cur) === v || (b.dataset.mando === 'clLuz' && v === 'alto' && cur === 'normal'))); });
  $('#abv-alb-col-out').textContent = `${fmt(E.alb, 1)} g/dL`;
  frasesLab();
}
const valorDe = (campo, s) => { if (s === 'true') return true; if (s === 'false') return false; return MANDOS[campo]?.tipo === 'rango' ? parseFloat(s) : s; };
function construirLab() {
  $('#abv-lab-cuerpo').innerHTML = `
    <div class="abv-lab-grupo"><span class="abv-vista-tit">Causa · estados de un toque</span><div class="abv-causas">${CAUSAS.map(c => `<button type="button" class="abv-b" data-causa="${c.id}">${c.t}</button>`).join('')}</div></div>
    <div class="abv-lab-grupo">${htmlMando('paco2', '<p class="abv-frase-mando" id="abv-lf-paco2"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('hco3', '<p class="abv-frase-mando" id="abv-lf-hco3"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('cl', '<p class="abv-frase-mando" id="abv-lf-cl"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('aniones')}${htmlMando('anion', '<p class="abv-frase-mando" id="abv-lf-an"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('alb', '<p class="abv-frase-mando" id="abv-lf-alb"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('reloj')}${htmlMando('auto', '<p class="abv-frase-mando" id="abv-lf-reloj"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('clLuz')}${htmlMando('aldo', '<p class="abv-frase-mando" id="abv-lf-col"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('osm', '<p class="abv-frase-mando" id="abv-lf-osm"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('respirador', '<p class="abv-frase-mando" id="abv-lf-resp"></p>')}</div>
    <div class="abv-lab-grupo">${htmlMando('fuente', '<p class="abv-frase-mando" id="abv-lf-fuente"></p>')}
      <details class="abv-plegable"><summary>Nota de fuentes: Marino frente a Nefrología al día</summary><div class="abv-det">
        <p>Las dos se muestran; ninguna gana. Marino: líneas desde HCO₃⁻ 24, delta con corte en 1, albúmina normal 4,5, hiato osmolal normal &lt;10 ${O('f', 'mr-acidobase-gaps#mr-osm-gap')}. Nefrología al día: líneas desde HCO₃⁻ 25 (acidosis 0,85-1,2; respiratorias 0,1 y 0,3 o 0,2-0,25 y 0,5), Δ-ratio con cortes 0,4 y 2 (los de la calculadora de su ficha), corrección de Figge con 4,4, osmolalidad calculada con urea/5,6 (en vez de BUN/2,8) e hiato osmolal &gt;20 como sospecha de tóxico ${O('f', 'fisio-acidobase-acidosis#ab-hau')}.</p></div></details></div>`;
}
function frasesLab() {
  if (!$('#abv-lf-paco2') || !$('#abv-lab').open) return;   // dentro del desplegable cerrado no se ve: se pinta al abrirlo
  const d = derivarRapido(), l = d.lectura;
  const met = l.prim === 'acidMet' || l.prim === 'alcMet';
  html('#abv-lf-paco2').innerHTML = met ? `Con HCO₃⁻ ${fmtA(E.hco3)}, la PaCO₂ esperada es <strong>${fmt(d.eP.v, 1)}</strong>: más alta, acidosis respiratoria añadida; más baja, alcalosis respiratoria añadida. ${O('f', 'mr-acidobase-analisis#mr-regla-3')}` : `Ahora: ${l.txt}. ${O('f', 'mr-acidobase-analisis#mr-regla-1')}`;
  html('#abv-lf-hco3').innerHTML = `El mismo cambio de 0,4 unidades de pH pesa más en el lado ácido: de 7,40 a 7,00 la [H⁺] sube 60 nEq/L; de 7,40 a 7,80 baja solo 24. Ahora, [H⁺] ${fmt(d.H)} nEq/L. ${O('f', 'mr-acidobase-analisis#mr-ph-no-lineal')}`;
  html('#abv-lf-cl').innerHTML = `Sube el Cl⁻ con el hiato quieto: <span class="hl-purpura">el HCO₃⁻ tiene que bajar</span> (hiperclorémica). ${O('f', 'mr-acidobase-gaps#mr-ag-formula')}`;
  html('#abv-lf-an').innerHTML = `${d.aniones >= 1 ? `Los ${E.anion === 'lact' ? 'lactatos' : 'cetoácidos'} se comen el HCO₃⁻: el hueco crece a ${fmt(d.HA)}.` : 'Sin aniones de más: el hiato es el de siempre.'} ${O('f', 'mr-acidobase-gaps#mr-ag-concepto')}`;
  html('#abv-lf-alb').innerHTML = `Albúmina ${fmt(E.alb, 1)}: hiato ${fmt(d.HA)}; corregido, <strong>${fmt(d.HAc)}</strong> (2,5 mEq por gramo). ${O('f', 'mr-acidobase-gaps#mr-ag-albumina')}${O('i', 'el Cl⁻ ocupa el sitio')}`;
  html('#abv-lf-reloj').innerHTML = `El pulmón compensa en 30-120 min; el riñón tarda 2-3 días. ${E.reloj === 'dias' ? 'Hoy es crónica.' : 'Hoy es aguda.'} ${E.auto ? 'Con «solos», el riñón sigue a la PaCO₂ según el reloj y el pulmón sigue al HCO₃⁻.' : ''} ${O('f', 'mr-acidobase-analisis#mr-comp-agudo')}${O('f', 'mr-acidobase-analisis#mr-comp-cronico')}`;
  html('#abv-lf-col').innerHTML = `${E.clLuz === 'bajo' ? 'Sin cloro en la luz, la pendrina no puede tirar el HCO₃⁻.' : 'Con cloro en la luz, la pendrina puede cambiar Cl⁻ por HCO₃⁻.'} ${E.aldo === 'alta' ? 'La aldosterona reabsorbe Na⁺, secreta K⁺ y enciende la bomba de H⁺.' : ''} ${O('f', 'mr-alcalosis-mecanismos#mr-alc-pendrina')}`;
  html('#abv-lf-osm').innerHTML = d.osmGap == null ? `Calculada ${fmt(d.osmCalc)}. ${O('f', 'mr-acidobase-gaps#mr-osm-gap')}` : `Medida ${fmtA(E.osm)}, calculada ${fmt(d.osmCalc)}: ${fmt(d.osmGap)} de sal que el cálculo no ve. ${O('f', 'mr-acidobase-gaps#mr-osm-oculto')}`;
  html('#abv-lf-resp').innerHTML = `${E.respirador ? 'Ventilado: la ventilación minuto la pones tú. Si das bicarbonato, súbela para sacar su CO₂.' : 'Respira solo.'} ${O('f', 'mr-lactato-bicarbonato#mr-bicarb-contra')}`;
  html('#abv-lf-fuente').innerHTML = `${E.fuente === 'nefro' ? 'Nefrología al día: líneas desde 25, Δ-ratio 0,4 y 2, albúmina 4,4, hiato osmolal >20.' : 'Marino: líneas desde 24, delta 1, albúmina 4,5, hiato osmolal <10.'}`;
}
// Delegación única para los mandos (laboratorio, vistas y tarjetas), dentro de la vista
function escucharMandos() {
R.addEventListener('input', e => { const i = e.target.closest('input[data-mando]'); if (!i) return; const ok = aplicarMando(i.dataset.mando, parseFloat(i.value), { animar: false }); if (!ok) i.value = MANDOS[i.dataset.mando].val(); });
R.addEventListener('change', e => { const i = e.target.closest('input[data-mando]'); if (i && E.auto && i.dataset.mando === 'paco2') aplicarMando('paco2', parseFloat(i.value)); });
R.addEventListener('click', e => {
  if (ANILLO && modo === 'explorar') quitarAnillo();   // el anillo de la entrada se va al primer toque
  const b = e.target.closest('button[data-mando]'); if (b) { aplicarMando(b.dataset.mando, valorDe(b.dataset.mando, b.dataset.v)); return; }
  const c = e.target.closest('[data-causa]'); if (c) { irCausa(c.dataset.causa); return; }
  const o = e.target.closest('.abv-obj'); if (o) { abrirObjetivo(o.dataset.obj); return; }
  const n = e.target.closest('.abv-saltos button'); if (n) { irNivel(+n.dataset.nivel); return; }
  const tr = e.target.closest('[data-tramo]'); if (tr) { E.tramo = tr.dataset.tramo; RIN.parts.length = 0; pintarTodo(false); return; }
  const ti = e.target.closest('[data-tramo-ir]'); if (ti) { E.tramo = ti.dataset.tramoIr; RIN.parts.length = 0; irNivel(2); pintarTodo(false); return; }
  const cl = e.target.closest('[data-clluz]'); if (cl) { aplicarMando('clLuz', cl.dataset.clluz); return; }
  const al = e.target.closest('[data-aldo]'); if (al) { aplicarMando('aldo', al.dataset.aldo); return; }
  const m = e.target.closest('.abv-interruptor button'); if (m) { ponerModo(m.dataset.modo); return; }
});
}
let tostadaT = null;
function tostada(txt) { const t = $('#abv-toast'); t.textContent = txt; t.hidden = false; clearTimeout(tostadaT); tostadaT = setTimeout(() => t.hidden = true, 3200); }

// ═════════════════════════════════════════════════════════════════════
// 10 · Capa de estudio: Explorar | Conceptos | Mayéutica
// ═════════════════════════════════════════════════════════════════════
const VISTAS = { carta: 'vista-carta', plasma: 'vista-plasma', rinon: 'vista-rinon', alveolo: 'vista-alveolo', osmoles: 'vista-osmoles' };
const PRESTADAS = [];
function prestar(clave, slot) {
  const id = VISTAS[clave]; if (!id || !slot) return;
  const el = $('#abv-' + id);
  if (!PRESTADAS.find(p => p.el === el)) PRESTADAS.push({ el, casa: el.parentElement, sig: el.nextSibling });
  slot.appendChild(el);
  requestAnimationFrame(() => { Object.values(LIENZOS).forEach(ajustarLienzo); pedirPintura(); });
}
function devolverVistas() {
  quitarAnillo(); R.classList.remove('abv-sin-responder');
  while (PRESTADAS.length) { const p = PRESTADAS.pop(); p.casa.insertBefore(p.el, p.sig && p.sig.parentNode === p.casa ? p.sig : null); }
  if (modo === 'explorar') abrirObjetivo(E.obj);
}
// El anillo dorado que late sobre lo que hay que mirar
let ANILLO = null, anilloT = null;
function quitarAnillo() { ANILLO?.div.remove(); ANILLO = null; clearInterval(anilloT); }
function anillo(sel) {
  quitarAnillo(); if (!sel) return;
  const t = R.querySelector(sel.replace('#', '#abv-')); if (!t) return;
  const host = t.closest('.abv-vista, .abv-instrumento'); if (!host) return;
  const div = document.createElement('div'); div.className = 'abv-anillo'; host.appendChild(div);
  ANILLO = { div, t, host }; colocarAnillo();
  if (!QUIETO && M) M.animate(div, { opacity: [1, .35, 1], scale: [1, 1.1, 1] }, { duration: 1.4, repeat: 4, ease: 'easeInOut' });
  anilloT = setInterval(colocarAnillo, 400);
}
function colocarAnillo() {
  if (!ANILLO) return;
  const r = ANILLO.t.getBoundingClientRect(), h = ANILLO.host.getBoundingClientRect();
  const w = Math.max(30, r.width + 14), hh = Math.max(30, r.height + 14);
  Object.assign(ANILLO.div.style, { left: (r.left - h.left + r.width / 2 - w / 2) + 'px', top: (r.top - h.top + r.height / 2 - hh / 2) + 'px', width: w + 'px', height: hh + 'px', borderRadius: Math.abs(w - hh) < 20 ? '50%' : '14px' });
}
// pH y [H⁺] en los textos: SIEMPRE calculados ({ph:PaCO₂:HCO₃⁻})
// y el rótulo de origen {f:ficha#elemento}
const T = s => (s || '').replace(/\{ph:([\d.]+):([\d.]+)\}/g, (_, p, h) => phTxt(+p, +h)).replace(/\{h:([\d.]+):([\d.]+)\}/g, (_, p, h) => fmt(hNeq(+p, +h)))
  .replace(/\{f:([^}]+)\}/g, (_, x) => O('f', x));
// «Ver en el texto»: un botón por ficha (abre la ficha y resalta la primera línea citada) y sus orígenes exactos
const titulos = new Map();
const tituloFicha = tab => { if (!titulos.has(tab)) { const card = document.querySelector(`.field-card[data-tab="${tab}"]`); titulos.set(tab, card ? nombreFicha(card, tab) : tab); } return titulos.get(tab); };
// «Ficha · línea»: la línea es el rótulo (dt) del campo citado, si lo tiene
function etiquetaFicha(tab, ancla) {
  const dt = ancla && document.getElementById(ancla)?.querySelector(':scope > dt')?.textContent.trim();
  return tituloFicha(tab) + (dt ? ` · ${dt}` : '');
}
function verTexto(f) {
  const botones = [].concat(f).map(r => { const [tab, ancla] = r.split('#'); return enlaceFicha(r, `📖 ${etiquetaFicha(tab, ancla)}`); }).join('');
  return `<div class="abv-ver-texto"><p>Ver en el texto:</p><div class="abv-fila">${botones}</div></div>`;
}
let VIVO = null;
function pintarEstudioVivo() { if (!VIVO) return; const v = $((modo === 'conceptos' ? '#abv-m-conceptos' : '#abv-m-preguntas') + ' [data-vivo]'); if (v) v.innerHTML = VIVO(derivar(E)); }

function ponerModo(m) {
  if (m === modo && m !== 'explorar') { return; }
  modo = m; token++;
  $$('.abv-interruptor button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.modo === m)));
  R.classList.toggle('abv-estudio', m !== 'explorar');
  $('#abv-m-explorar').hidden = m !== 'explorar'; $('#abv-m-conceptos').hidden = m !== 'conceptos'; $('#abv-m-preguntas').hidden = m !== 'preguntas';
  $('#abv-dock-explorar').hidden = m !== 'explorar'; $('#abv-dock-estudio').hidden = m === 'explorar';
  R.style.setProperty('--abv-dock', m === 'explorar' ? '118px' : '76px');
  devolverVistas(); VIVO = null;
  $('#abv-mini').classList.remove('abv-on');
  if (m === 'explorar') { const i = Math.max(0, PASOS.findIndex(p => p.id === pasoActual)); E = { ...E, auto: false }; irPaso(i); }
  if (m === 'conceptos') mostrarConcepto(CI);
  if (m === 'preguntas') { if (FASE === 'caso') pintarCaso(); else if (FASE === 'casos') pintarCasos(); else if (FASE === 'repaso') pintarRepaso(); else mostrarRecorrido(QI); }
  subirAlEstudio();
}
// La página de la app hace scroll en la ventana: se sube al principio de la vista (Explorar) o justo bajo el interruptor
function subirAlEstudio() {
  if (!R.offsetParent) return;
  const y = modo === 'explorar' ? R.parentElement.getBoundingClientRect().top : $('.abv-interruptor').getBoundingClientRect().bottom + 12;
  window.scrollTo(0, Math.max(0, window.scrollY + y - (modo === 'explorar' ? 8 : 0)));
}
function dockEstudio(n, actual, marca, txt) {
  html('#abv-est-prog').innerHTML = Array.from({ length: n }, (_, i) => `<i class="${marca(i) ? 'abv-' + marca(i) : ''}${i === actual ? ' abv-ahora' : ''}"></i>`).join('');
  $('#abv-est-txt').textContent = txt;
}

// ───────── Conceptos (8; cada uno mueve el modelo) ─────────
let CI = 0;
function mostrarConcepto(i) {
  CI = i; const c = CONCEPTOS[i]; devolverVistas();
  const art = $('#abv-concepto');
  art.innerHTML = `<header><span class="abv-num">${i + 1}</span><span class="abv-tipo">Concepto ${i + 1} de ${CONCEPTOS.length}</span></header>
    <h3>${c.tit}</h3><p class="abv-dice">${c.dice}</p>
    <div class="abv-slot" id="abv-c-slot"></div>
    <div class="abv-tocar"><p class="abv-lee"><strong>Tócalo:</strong> ${c.toca}</p>
      ${(c.botones || []).length ? `<div class="abv-fila">${c.botones.map((b, j) => `<button type="button" class="abv-b" data-cbtn="${j}">${T(b.t)}</button>`).join('')}</div>` : ''}
      ${(c.mandos || []).map(m => htmlMando(m)).join('')}</div>
    <p class="abv-frase-mando" data-vivo></p>
    ${verTexto(c.fuente)}
    <div class="abv-fila"><button type="button" class="abv-b abv-flex" data-cnav="-1" ${i === 0 ? 'disabled' : ''}>◂ Anterior</button><button type="button" class="abv-b abv-prim abv-flex" data-cnav="1">${i === CONCEPTOS.length - 1 ? 'A la mayéutica ▸' : 'Siguiente concepto ▸'}</button></div>`;
  art.classList.remove('abv-entra'); void art.offsetWidth; art.classList.add('abv-entra');
  VIVO = VIVO_CONCEPTO[c.id];
  if (c.vista) prestar(c.vista, $('#abv-c-slot'));
  if (c.vista === 'rinon') { E.tramo = c.tramo || 'colector'; irNivel(2); }
  irAEstado(estadoDe({ ...c.estado, fuente: E.fuente }), { reinicio: true, desdeCanon: BASE }).then?.(() => anillo(c.mirar));
  setTimeout(() => anillo(c.mirar), QUIETO ? 0 : 900);
  dockEstudio(CONCEPTOS.length, i, j => j <= i ? 'on' : '', `Concepto ${i + 1} de ${CONCEPTOS.length}`);
  subirAlEstudio();
}
const desdeNormal = (campo, v) => { const e = mandar(campo, v, estadoDe({ fuente: E.fuente })); if (!e.error) irAEstado(e, { juntos: true }); };
// Los botones de los conceptos, declarados en los datos: un paso del caso, una causa, un mando desde lo normal o un estado
function hacerBoton(b) {
  if (b.paso) irAEstado(PASO_E[PASOS.findIndex(p => p.id === b.paso)]);
  else if (b.causa) irAEstado(estadoDe({ ...CAUSA[b.causa].e, fuente: E.fuente }));
  else if (b.desdeNormal) desdeNormal(...b.desdeNormal);
  else irAEstado(estadoDe({ ...b.estado, fuente: E.fuente }), b.juntos ? { juntos: true } : {});
}
// La frase viva de cada concepto: traduce a clínica lo que hace el modelo ahora mismo
const barritas = () => { const bp = { '0': 0, min: 10, h: 100, dias: 100 }[E.reloj], br = { '0': 0, min: 0, h: 6, dias: 100 }[E.reloj];
  return `<span class="abv-reloj" style="display:block;height:auto"><span class="abv-barra"><span>pulmón</span><i><b style="width:${bp}%;background:var(--accent-blue)"></b></i><span>30-120 min</span></span><span class="abv-barra"><span>riñón</span><i><b style="width:${br}%;background:var(--accent-green)"></b></i><span>2-3 días</span></span></span>`; };
const VIVO_CONCEPTO = {
  cociente: d => `[H⁺] = 24 × ${fmtA(E.paco2)} / ${fmtA(E.hco3)} = <strong>${fmt(d.H)}</strong> nEq/L → pH <strong>${fmt(d.ph, 2)}</strong>. ${Math.abs(E.paco2 / E.hco3 - 40 / 24) < .03 ? (Math.abs(E.paco2 - 40) > 1 ? '<span class="hl-verde">Pesan más (o menos) los dos platillos, pero en la misma proporción: la aguja no se mueve.</span>' : 'En equilibrio.') : 'El cociente ha cambiado: la aguja se mueve.'}`,
  'no-lineal': d => `pH ${fmt(d.ph, 2)} → [H⁺] <strong>${fmt(d.H)}</strong> nEq/L: ${d.H >= 40 ? `<span class="hl-rojo">+${fmt(d.H - 40)}</span>` : `<span class="hl-verde">−${fmt(40 - d.H)}</span>`} respecto a 40. Por el mismo 0,4 de pH, el lado ácido mueve unas <strong>2,5 veces</strong> más hidrogeniones.`,
  compensacion: d => `pH ${fmt(d.ph, 2)}: ${d.lectura.txt}. ${d.lectura.prim === 'acidMet' && E.paco2 < 39 ? '<span class="hl-azul">Vuelve hacia 7,40 sin llegar.</span>' : ''}${barritas()}`,
  'eje-linea': d => `PaCO₂ ${fmtA(E.paco2)} frente a <strong>${fmt(d.eP.v, 1)}</strong> esperada: ${d.lectura.txt}.`,
  neutra: d => `Cl⁻ ${fmtA(E.cl)} + HCO₃⁻ ${fmtA(E.hco3)} + hiato ${fmt(d.HA)} = Na⁺ ${fmtA(E.na)}. ${d.HA > 12.5 ? '<span class="hl-rojo">Lo ocupa un anión no medido: hiato elevado.</span>' : E.cl > 106 ? '<span class="hl-purpura">Lo ocupa el cloro: hiato normal, hiperclorémica.</span>' : 'En equilibrio.'}`,
  albumina: d => `Albúmina ${fmt(E.alb, 1)}: hiato ${fmt(d.HA)} · corregido <strong>${fmt(d.HAc)}</strong>. ${d.HA <= 12.5 && d.HAc > 12.5 ? '<span class="hl-rojo">Parece normal, y hay un anión escondido.</span>' : ''}`,
  cloro: () => `Cl⁻ en la luz ${E.clLuz === 'bajo' ? 'bajo: <span class="hl-rojo">pendrina apagada</span>, los triángulos esperan' : 'alto: <span class="hl-verde">pendrina encendida</span>, el HCO₃⁻ sale por la orina'}.`,
  osmolal: d => d.osmGap == null ? '' : `Medida ${fmtA(E.osm)} − calculada ${fmt(d.osmCalc)} = <strong>${fmt(d.osmGap)}</strong>${d.osmGap >= 10 ? ': <span class="hl-rojo">sal que el cálculo no ve</span>.' : ': normal (&lt;10).'}`,
};

// ───────── Mayéutica: recorrido, repaso de lo fallado y casos ─────────
let RES = {};                 // id → { ok, faltan: [índices de puntos no marcados] } (se guarda en este dispositivo)
let HECHOS = new Set();       // casos terminados (índices)
let QI = 0, FASE = 'recorrido', CASO_I = 0, CASO_P = 0, FICHA = {}, NUEVO = [];
function mostrarRecorrido(i) {
  FASE = 'recorrido'; QI = i;
  if (i >= PREGUNTAS.length) { pintarRepaso(); return; }
  pintarPregunta(PREGUNTAS[i], { num: i + 1, contenedor: $('#abv-preg'), alAcabar: () => mostrarRecorrido(i + 1) });
  dockEstudio(PREGUNTAS.length, i, j => RES[PREGUNTAS[j].id] ? (RES[PREGUNTAS[j].id].ok ? 'on' : 'mal') : '', `Recorrido · ${i + 1} de ${PREGUNTAS.length}`);
}
function navegar(k) {
  if (FASE === 'recorrido') mostrarRecorrido(clamp(QI + k, 0, PREGUNTAS.length));
  else if (FASE === 'repaso') { if (k > 0) pintarCasos(); else mostrarRecorrido(PREGUNTAS.length - 1); }
  else if (FASE === 'casos') { if (k < 0) pintarRepaso(); }
  else if (FASE === 'caso') { if (k < 0) pintarCasos(); }
}
const fallados = () => PREGUNTAS.filter(q => RES[q.id] && !RES[q.id].ok);
function pintarRepaso() {
  FASE = 'repaso'; devolverVistas(); VIVO = null;
  const f = fallados();
  $('#abv-preg').innerHTML = `<article class="abv-formato abv-entra" id="abv-repaso">
    <header><span class="abv-num">2</span><span class="abv-tipo">Otra vez lo que fallaste</span></header>
    ${f.length ? `<p class="abv-pregunta">Otra vez lo que fallaste: <strong>${f.length}</strong>. Cada una vuelve con el modelo en su estado; en las de destapar, solo lo que no marcaste.</p>
      <div class="abv-repaso-chips">${f.map(q => `<button type="button" class="abv-b" data-repaso="${q.id}">${PREGUNTAS.indexOf(q) + 1} · ${q.corto}</button>`).join('')}</div>`
      : `<p class="abv-pregunta">${Object.keys(RES).length ? '<span class="abv-ok">✓ No queda nada por repasar.</span>' : 'Aún no has hecho el recorrido: lo que falles aparecerá aquí.'}</p>`}
    <div class="abv-fila"><button type="button" class="abv-b" data-ir="recorrido">◂ Al recorrido</button><button type="button" class="abv-b abv-prim abv-flex" data-ir="casos">Casos clínicos ▸</button></div></article>`;
  dockEstudio(1, 0, () => 'on', `Repaso · ${f.length} por repasar`);
  subirAlEstudio();
}
function pintarCasos() {
  FASE = 'casos'; devolverVistas(); VIVO = null;
  $('#abv-preg').innerHTML = `<article class="abv-formato abv-entra"><header><span class="abv-num">3</span><span class="abv-tipo">Casos clínicos</span></header>
    <p class="abv-para">El paciente se inventa; la medicina, no. El modelo de arriba se mueve a cada paso.</p>
    <div class="abv-casos-lista">${CASOS.map((c, i) => `<button type="button" class="abv-b" data-caso="${i}" data-hecho="${HECHOS.has(i) ? 1 : 0}"><span>${c.titulo}</span><small>${c.sub} · ${c.pasos.length} pasos</small></button>`).join('')}</div>
    <div class="abv-fila"><button type="button" class="abv-b" data-ir="repaso">◂ Repaso</button></div></article>`;
  dockEstudio(CASOS.length, -1, i => HECHOS.has(i) ? 'on' : '', 'Casos clínicos');
  subirAlEstudio();
}
function empezarCaso(i) { CASO_I = i; CASO_P = 0; FICHA = { ...CASOS[i].paciente }; NUEVO = []; FASE = 'caso'; pintarCaso(); }
function pintarCaso() {
  const caso = CASOS[CASO_I], p = caso.pasos[CASO_P];
  if (CASO_P === 0) FICHA = { ...caso.paciente };
  NUEVO = Object.keys(p.datos || {}); Object.assign(FICHA, p.datos || {});
  const ficha = Object.entries(FICHA).map(([k, v]) => `<dt>${k}</dt><dd class="${NUEVO.includes(k) ? 'abv-cambia' : ''}">${T(v)}</dd>`).join('');
  pintarPregunta(p.pregunta, { contenedor: $('#abv-preg'), caso: { titulo: caso.titulo, momento: p.momento, ficha, i: CASO_P, n: caso.pasos.length, calc: p.calc, estado: p.estado, vista: p.vista, mirar: p.mirar, tramo: p.tramo }, alAcabar: () => { if (CASO_P < caso.pasos.length - 1) { CASO_P++; pintarCaso(); } else finCaso(); }, ultimo: CASO_P === caso.pasos.length - 1 });
  dockEstudio(caso.pasos.length, CASO_P, j => j < CASO_P ? 'on' : '', `${caso.titulo.split(' — ')[0]} · paso ${CASO_P + 1} de ${caso.pasos.length}`);
}
function finCaso() {
  const caso = CASOS[CASO_I]; HECHOS.add(CASO_I); guardar(); devolverVistas(); VIVO = null;
  $('#abv-preg').innerHTML = `<article class="abv-caso abv-entra"><span class="abv-dia">${caso.titulo}</span>
    <div class="abv-respuesta"><span class="abv-tipo">Lo que te llevas</span><ol class="abv-lleva">${caso.lleva.map(t => `<li>${t}</li>`).join('')}</ol>
    <div class="abv-fila">${enlaceFicha(caso.volver.ficha, `📖 Repasar en la ficha: ${tituloFicha(caso.volver.ficha)}`)}
      <button type="button" class="abv-b abv-link" data-abrir-modelo="${CASO_I}">Abrir el modelo en el estado del paciente</button>
      <button type="button" class="abv-b" data-ir="casos">Otro caso</button></div></div></article>`;
  dockEstudio(caso.pasos.length, caso.pasos.length, () => 'on', `${caso.titulo.split(' — ')[0]} · hecho`);
  subirAlEstudio();
}
function escucharPreguntas() {
$('#abv-m-preguntas').addEventListener('click', e => {
  const r = e.target.closest('[data-repaso]'); if (r) { const q = PREGUNTAS.find(x => x.id === r.dataset.repaso); FASE = 'repaso'; pintarPregunta(q, { num: PREGUNTAS.indexOf(q) + 1, repaso: true, contenedor: $('#abv-preg'), alAcabar: pintarRepaso }); return; }
  const ir = e.target.closest('[data-ir]'); if (ir) { const k = ir.dataset.ir; if (k === 'recorrido') mostrarRecorrido(Math.min(QI, PREGUNTAS.length - 1)); else if (k === 'casos') pintarCasos(); else pintarRepaso(); return; }
  const c = e.target.closest('[data-caso]'); if (c) { empezarCaso(+c.dataset.caso); return; }
  const a = e.target.closest('[data-abrir-modelo]'); if (a) { const caso = CASOS[+a.dataset.abrirModelo]; ponerModo('explorar'); CAUSA_ACTUAL = null; pasoActual = null; const dest = estadoDe({ ...caso.volver.estado, etiqueta: caso.volver.estado.etiqueta || caso.titulo.split(' — ')[0], caso: true });
    enFotograma(5, () => abrirObjetivo(dest.obj));   // después del irPaso de ponerModo
    irAEstado(dest, { reinicio: true }); return; }
});
}

// Las calculadoras de las fichas que el caso pide usar («… (mr-gap)» → la calculadora mr-gap-calc de su ficha)
const CALCULADORAS = { 'mr-gap': 'mr-acidobase-gaps', 'mr-cad': 'mr-cetoacidosis', 'mr-cloro': 'mr-alcalosis-tratamiento', 'mt-fome': 'mt-alcoholes' };
function calculadora(txt) {
  const k = (/\(([\w-]+)\)$/.exec(txt) || [])[1], ficha = CALCULADORAS[k];
  const nombre = txt.replace(/\s*\([\w-]+\)$/, '');
  if (!ficha) return '';
  return `<div class="abv-fila">${enlaceFicha(ficha, `🧮 Abrir la calculadora: ${nombre}`, `${k}-calc`)}</div>
    <p class="abv-para">El caso te espera aquí: vuelve con «Ácido-base vivo» del menú de Nefrología o de Marino.</p>`;
}
// Una pregunta (recorrido, repaso o paso de un caso): test con «piensa antes», destapa o encuentra el error
function pintarPregunta(q, ctx) {
  devolverVistas(); VIVO = null;
  const cs = ctx.caso;
  const estado = cs ? cs.estado : q.estado, vista = cs ? cs.vista : q.vista, mirar = cs ? cs.mirar : q.mirar, tramo = cs ? cs.tramo : q.tramo;
  const st = { tocarOk: !q.tocar, intentos: 0, etapa: 0, fallo: false };
  ctx.st = st;
  const repaso = ctx.repaso && RES[q.id];
  const puntos = q.tipo === 'destapa' ? q.puntos.map((t, i) => ({ t, i })).filter(p => !repaso || RES[q.id].faltan.includes(p.i)) : [];
  const tipoTxt = { test: q.tocar ? 'Test · predice y compruébalo en el modelo' : 'Test · piensa antes', destapa: 'Piensa y destapa', error: 'Encuentra el error' }[q.tipo];
  let h = cs
    ? `<article class="abv-caso abv-entra"><div class="abv-prog">${Array.from({ length: cs.n }, (_, i) => `<i class="${i <= cs.i ? 'abv-on' : ''}"></i>`).join('')}</div>
       <span class="abv-dia">${cs.momento}</span><dl class="abv-paciente">${cs.ficha}</dl>`
    : `<article class="abv-formato abv-entra"><header><span class="abv-num">${ctx.num}</span><span class="abv-tipo">${ctx.repaso ? 'Repaso · ' : ''}${tipoTxt}</span></header>`;
  h += `<p class="abv-pregunta">${T(q.enunciado)}</p>`;
  h += `<div class="abv-slot" id="abv-q-slot"></div>`;
  if (cs && cs.calc) h += calculadora(cs.calc);
  if (q.tipo === 'test') h += `<p class="abv-para">${q.tocar ? 'Predice antes de tocar nada; luego lo compruebas en el modelo.' : 'Piénsalo antes de ver las opciones.'}</p><div class="abv-fila"><button type="button" class="abv-b abv-prim" data-q="ops">Ya lo tengo: ver opciones</button></div>
      <div class="abv-op" id="abv-q-ops" hidden>${q.opciones.map((o, i) => `<button type="button" class="abv-b" data-op="${i}">${T(o.t)}</button>`).join('')}</div>`;
  if (q.tipo === 'destapa') h += `<p class="abv-para">Contesta en la cabeza: ${repaso ? `te faltaban ${['', 'una cosa', 'dos cosas', 'tres cosas', 'cuatro cosas'][puntos.length] || puntos.length + ' cosas'}` : `son ${['', 'una cosa', 'dos cosas', 'tres cosas', 'cuatro cosas'][q.puntos.length]}`}. Luego destápalo.</p>
      <div class="abv-fila"><button type="button" class="abv-b abv-prim" data-q="destapa">Ya lo tengo: destapar</button></div>
      <div class="abv-respuesta" id="abv-q-pts" hidden><p class="abv-para">Marca, uno a uno, lo que tenías:</p>${puntos.map(p => `<label class="abv-punto"><input type="checkbox" data-pi="${p.i}"> <span>${T(p.t)}</span></label>`).join('')}
      <div class="abv-fila"><button type="button" class="abv-b" data-q="hecho">Hecho</button></div></div>`;
  if (q.tipo === 'error') h += `<p class="abv-para">Toca las frases que creas falsas: ${q.cuantos || 'puede haber 0, 1 o 2 errores'}.</p><div class="abv-op">${q.frases.map((f, i) => `<button type="button" class="abv-frase-err" data-fr="${i}"><span class="abv-n">${i + 1}</span><span>${T(f.t)}</span></button>${f.mal ? `<div class="abv-correccion" id="abv-q-c${i}" hidden></div>` : ''}`).join('')}</div>
      <div class="abv-fila"><button type="button" class="abv-b abv-prim" data-q="corregir">Corregir</button></div>`;
  h += `<div id="abv-q-res"></div>${q.tocar ? '<div class="abv-tocar" id="abv-q-tocar" hidden></div>' : ''}<div id="abv-q-fin"></div></article>`;
  const cont = ctx.contenedor; cont.innerHTML = h;
  // el modelo se mueve al estado de la pregunta antes de preguntar
  if (vista) prestar(vista, $('#abv-q-slot'));
  if (vista === 'rinon') { E.tramo = tramo || 'colector'; irNivel(2); }
  R.classList.add('abv-sin-responder');      // hasta contestar, el modelo no chiva: frases de las vistas ocultas y cifras con «?»
  if (estado) irAEstado(estadoDe({ ...estado, fuente: E.fuente, ocultar: q.ocultar || null }), { reinicio: !cs || cs.i === 0, desdeCanon: cs && cs.i > 0 ? { ...E } : BASE });
  setTimeout(() => anillo(mirar), QUIETO ? 0 : 700);
  subirAlEstudio();
  // respuestas
  cont.onclick = e => {
    const a = e.target.closest('[data-q]')?.dataset.q;
    if (a === 'ops') { $('#abv-q-ops').hidden = false; e.target.closest('.abv-fila').remove(); return; }
    if (a === 'comprobar') { comprobarTocar(q, st); return; }
    if (a === 'destapa') { $('#abv-q-pts').hidden = false; e.target.closest('.abv-fila').remove(); return; }
    if (a === 'hecho') {
      const marcadas = $$('#abv-q-pts input').filter(i => i.checked).map(i => +i.dataset.pi), faltan = puntos.map(p => p.i).filter(i => !marcadas.includes(i));
      e.target.disabled = true; $$('#abv-q-pts input').forEach(i => i.disabled = true);
      registrar(q, faltan.length === 0, faltan, ctx);
      resultado(ctx, q, faltan.length === 0 ? `<span class="abv-ok">✓ ${ctx.repaso ? 'Ahora sí. Sale del repaso.' : 'Todo. Esta no vuelve.'}</span>` : `<span class="abv-mal">${puntos.length - faltan.length} de ${puntos.length}: lo que falta vuelve en el repaso.</span>`);
      return;
    }
    if (a === 'corregir') {
      let bien = 0;
      $$('#abv-preg .abv-frase-err').forEach(b => { const f = q.frases[b.dataset.fr], m = b.classList.contains('abv-marcada'), ok = m === !!f.mal; if (ok) bien++;
        b.classList.remove('abv-marcada'); b.classList.add(ok ? 'abv-acierto' : 'abv-fallo'); b.disabled = true;
        if (f.mal) { const c = $('#abv-q-c' + b.dataset.fr); c.hidden = false; c.innerHTML = `<b>Era falsa.</b> ¿Cómo sería la frase buena? <button type="button" class="abv-b abv-link" data-cor="${b.dataset.fr}">Pensado: ver</button>`; } });
      e.target.disabled = true;
      const nMal = q.frases.filter(f => f.mal).length;
      registrar(q, bien === q.frases.length, [], ctx);
      resultado(ctx, q, `<span class="${bien === q.frases.length ? 'abv-ok' : 'abv-mal'}">${bien} de ${q.frases.length} bien juzgadas (${nMal === 0 ? 'no había ningún error: todas eran verdaderas' : `había ${nMal === 1 ? 'un error' : 'dos errores'}: ${q.frases.map((f, i) => f.mal ? i + 1 : null).filter(Boolean).join(' y ')}`}).</span>`);
      return;
    }
    const cor = e.target.closest('[data-cor]'); if (cor) { cor.parentElement.innerHTML = '<b>Corrección:</b> ' + T(q.frases[cor.dataset.cor].c); return; }
    const fr = e.target.closest('[data-fr]'); if (fr && !fr.disabled) { fr.classList.toggle('abv-marcada'); return; }
    const op = e.target.closest('[data-op]');
    if (op && !op.disabled) {
      const o = q.opciones[+op.dataset.op];
      $$('#abv-q-ops button').forEach(b => b.disabled = true);
      op.style.borderColor = o.ok ? C.verde : C.rojo;
      registrar(q, o.ok && !st.fallo, [], ctx);
      resultado(ctx, q, `<span class="${o.ok ? 'ok' : 'mal'}">${o.ok ? (st.fallo ? '✓ Bien, pero el modelo lo tuviste que ver resuelto: vuelve en el repaso' : '✓ Bien') : '✗ Qué habría pasado'}</span>${o.ok ? '' : `<p>${T(o.porque)}</p>`}`);
      return;
    }
    if (e.target.closest('[data-sig]')) ctx.alAcabar();
  };
}
function registrar(q, ok, faltan, ctx) {
  if (ctx.caso) return;                                   // los pasos de los casos no entran en el repaso del recorrido
  if (ctx.repaso) { if (ok) RES[q.id] = { ok: true, faltan: [] }; else RES[q.id] = { ok: false, faltan: faltan.length ? faltan : RES[q.id].faltan }; guardar(); return; }
  RES[q.id] = { ok, faltan: q.tipo === 'destapa' ? faltan : [] };
  guardar();
}
function resultado(ctx, q, html) {
  R.classList.remove('abv-sin-responder');
  if (E.ocultar) { E = { ...E, ocultar: null }; pintarTodo(false); }
  if (q.despues) irAEstado(estadoDe({ ...q.despues, fuente: E.fuente }));   // «despues»: el estado que se enseña al responder
  $('#abv-q-res').innerHTML = `<div class="abv-respuesta abv-entra">${html}${q.explicacion ? `<p>${T(q.explicacion)}</p>` : ''}${q.salidas ? `<div class="abv-fila">${q.salidas.map(([v, t]) => boton('nefrona', v, t)).join('')}</div>` : ''}${q.nota ? `<details class="abv-plegable" open><summary>Nota de fuentes</summary><div class="abv-det"><p>${T(q.nota)}</p></div></details>` : ''}${verTexto(q.fuente)}</div>`;
  if (q.tocar) { const t = $('#abv-q-tocar'); t.hidden = false; TOCAR_CTX = ctx; pintarTocar(q, ctx.st); t.scrollIntoView?.({ block: 'nearest' }); }
  else botonSeguir(ctx);
  if (!ctx.caso && !ctx.repaso) dockEstudio(PREGUNTAS.length, QI, j => RES[PREGUNTAS[j].id] ? (RES[PREGUNTAS[j].id].ok ? 'on' : 'mal') : '', `Recorrido · ${QI + 1} de ${PREGUNTAS.length}`);
}
function botonSeguir(ctx) {
  const sig = ctx.repaso ? 'Volver al repaso' : ctx.caso ? (ctx.ultimo ? 'Ver lo que te llevas' : 'Siguiente: el paciente evoluciona →') : (ctx.num >= PREGUNTAS.length ? 'Al repaso de lo fallado ▸' : 'Siguiente pregunta ▸');
  $('#abv-q-fin').innerHTML = `<div class="abv-fila"><button type="button" class="abv-b abv-prim" data-sig>${sig}</button></div>`;
}
// «Comprobar» de los datos: { campo: [mín, máx] } o { campo: valor }; el pH, redondeado a 2 decimales
const cumple = (cond, e, d) => Object.entries(cond).every(([k, v]) => { const x = k === 'ph' ? r2(d.ph) : e[k]; return Array.isArray(v) ? x >= v[0] && x <= v[1] : x === v; });
// «Se responde tocando»: la tarjeta trae su mando, que mueve el MISMO estado; «Comprobar» lee el estado
let TOCAR_CTX = null;
function pintarTocar(q, st) {
  const et = [].concat(q.tocar)[st.etapa];
  if (et.prep) { const e = estadoDe({ ...et.prep, fuente: E.fuente }); irAEstado(e, { inmediato: false }); }
  $('#abv-q-tocar').innerHTML = `<p class="abv-lee"><strong>Compruébalo en el modelo:</strong> ${T(et.lee)}</p>${et.mandos.map(m => htmlMando(m)).join('')}
    <p class="abv-frase-mando" data-vivo></p><div class="abv-fila"><button type="button" class="abv-b abv-prim" data-q="comprobar">Comprobar</button></div><p class="abv-pista" id="abv-q-pista" hidden></p>`;
  VIVO = (d => `Ahora: PaCO₂ ${fmtA(E.paco2)} · HCO₃⁻ ${fmtA(E.hco3)} · pH <strong>${fmt(d.ph, 2)}</strong> · hiato ${fmt(d.HA)}`);
  sincronizarMandos(); pintarEstudioVivo();
}
function comprobarTocar(q, st) {
  const etapas = [].concat(q.tocar), et = etapas[st.etapa];
  if (cumple(et.comprobar, E, derivar(E))) {
    st.etapa++; st.intentos = 0;
    if (st.etapa < etapas.length) { tostada('✓ Eso es. Sigue.'); pintarTocar(q, st); return; }
    terminarTocar(q, st, '<span class="abv-ok">✓ El modelo está donde debe.</span>'); return;
  }
  st.intentos++;
  const p = $('#abv-q-pista'); p.hidden = false; p.innerHTML = `Aún no. Pista: ${T(et.pista)}`;
  if (st.intentos >= 2) {   // al segundo intento fallido: cuenta como fallo y el modelo se pone en su sitio
    st.fallo = true;
    if (et.solucion) { const sol = et.solucion.mandar ? mandar(...et.solucion.mandar, estadoDe(et.solucion.desde)) : estadoDe({ ...et.solucion, fuente: E.fuente }); if (!sol.error) irAEstado(sol); }
    st.etapa++; st.intentos = 0;
    if (st.etapa < etapas.length) { setTimeout(() => pintarTocar(q, st), 1400); return; }
    terminarTocar(q, st, '<span class="abv-mal">Así quedaba (cuenta como fallo: vuelve en el repaso).</span>');
  }
}
function terminarTocar(q, st, html) {
  st.tocarOk = true;
  $('#abv-q-tocar').insertAdjacentHTML('beforeend', `<p>${html}</p>`);
  $$('#abv-q-tocar [data-q="comprobar"]').forEach(b => b.disabled = true);
  const ctx = TOCAR_CTX;
  if (st.fallo && ctx && !ctx.caso) { RES[q.id] = { ok: false, faltan: [] }; guardar(); }   // no supo ponerlo en el modelo: vuelve en el repaso
  if (ctx) botonSeguir(ctx);
}



// ═════════════════════════════════════════════════════════════════════
// 14 · Bucle único de animación (solo lo visible; se para con la pestaña oculta)
// ═════════════════════════════════════════════════════════════════════
let antes = performance.now(), pedido = false, corriendo = false;
function pedirPintura() { if (QUIETO && !pedido) { pedido = true; requestAnimationFrame(t => { pedido = false; dibujarAlveolo(); dibujarPlasma(); dibujarCelula(t); }); } }
function cuadro(t) {
  const dt = Math.min(.05, (t - antes) / 1000); antes = t;
  moverVuelos(t);
  if (LIENZOS['cv-alveolo'].visible) { moverAlveolo(dt); dibujarAlveolo(); }
  moverHex(dt);
  if (LIENZOS['cv-plasma'].visible) { moverPlasma(dt); dibujarPlasma(); } else { PLA.prev = null; PLA.ev.length = 0; }
  if (LIENZOS['cv-celula'].visible && E.nivel === 2) { moverCelula(dt); dibujarCelula(t); }
  // se para con la pestaña en segundo plano o con la vista oculta (otra pantalla de la app)
  if (document.hidden || !R.offsetParent) { corriendo = false; return; }
  requestAnimationFrame(cuadro);
}
function arrancarBucle() { if (QUIETO || corriendo || !construido || !R.offsetParent) return; corriendo = true; antes = performance.now(); requestAnimationFrame(cuadro); }


// ═════════════════════════════════════════════════════════════════════
// 15 · Lo guardado en este dispositivo (Mayéutica: aciertos, fallos y casos hechos)
// ═════════════════════════════════════════════════════════════════════
// La excepción de persistencia del quiz (CLAUDE §2), con su clave propia. Sin almacenamiento, todo sigue funcionando.
const CLAVE = 'acidobase-vivo-v1';
function cargar() {
  RES = {}; HECHOS = new Set();
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE)) ?? {};
    const ids = new Set(PREGUNTAS.map(q => q.id));
    for (const [id, r] of Object.entries(g.res || {})) if (ids.has(id) && r && typeof r.ok === 'boolean') RES[id] = { ok: r.ok, faltan: Array.isArray(r.faltan) ? r.faltan : [] };
    if (Array.isArray(g.casos)) g.casos.filter(i => CASOS[i]).forEach(i => HECHOS.add(i));
  } catch { /* nada guardado o ilegible: se empieza de cero */ }
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify({ res: RES, casos: [...HECHOS] })); } catch { /* sin almacenamiento */ }
}

// ═════════════════════════════════════════════════════════════════════
// 16 · Arranque (la primera vez que se abre la vista: no pesa en el arranque de la app)
// ═════════════════════════════════════════════════════════════════════
let construido = false, motionListo = Promise.resolve();
function conectarMotion(m) {
  M = m;
  angMV = M.motionValue(INST.ang); angMV.on('change', v => { INST.ang = v; pintarMovil(); });
  RIN.pendMV = M.motionValue(RIN.pend); RIN.pendMV.on('change', v => { RIN.pend = v; });
}
function escucharEstudio() {
  $('#abv-est-ant').addEventListener('click', () => { if (modo === 'conceptos') mostrarConcepto(Math.max(0, CI - 1)); else navegar(-1); });
  $('#abv-est-sig').addEventListener('click', () => { if (modo === 'conceptos') mostrarConcepto(Math.min(CONCEPTOS.length - 1, CI + 1)); else navegar(1); });
  $('#abv-m-conceptos').addEventListener('click', e => {
    const b = e.target.closest('[data-cbtn]'); if (b) { hacerBoton(CONCEPTOS[CI].botones[+b.dataset.cbtn]); return; }
    const n = e.target.closest('[data-cnav]'); if (n) { const k = +n.dataset.cnav; if (CI + k >= CONCEPTOS.length) ponerModo('preguntas'); else mostrarConcepto(Math.max(0, CI + k)); }
  });
}
function construir() {
  if (construido) return;
  construido = true;
  C = leerTokens();
  cargar();
  construirInstrumento(); construirCadena(); construirAlveolo(); construirPlasma(); construirNefrona(); construirCelula(); construirCarta(); construirDock(); construirLab();
  lienzo('cv-alveolo', 360, 250); lienzo('cv-plasma', 360, 352); lienzo('cv-celula', 360, 340);
  const io = new IntersectionObserver(es => es.forEach(e => { const L = Object.values(LIENZOS).find(x => x.cv === e.target); if (L) { L.visible = e.isIntersecting; if (L.visible) { ajustarLienzo(L); pedirPintura(); arrancarBucle(); } } }), { rootMargin: '60px' });
  Object.values(LIENZOS).forEach(L => io.observe(L.cv));
  new IntersectionObserver(es => es.forEach(e => { VISIBLE.carta = e.isIntersecting; if (e.isIntersecting) pintarCometa(); }), { rootMargin: '60px' }).observe($('#abv-svg-carta'));
  addEventListener('resize', () => { if (R.offsetParent) { Object.values(LIENZOS).forEach(ajustarLienzo); pedirPintura(); } });
  // cabecera mini: aparece al salir el instrumento de la pantalla (solo en Explorar)
  new IntersectionObserver(es => es.forEach(e => $('#abv-mini').classList.toggle('abv-on', !!R.offsetParent && !e.isIntersecting && modo === 'explorar' && e.boundingClientRect.top < 0)), { threshold: 0 }).observe($('#abv-instrumento'));
  escucharMandos(); escucharEstudio(); escucharPreguntas();
  $('#abv-de-donde-det').addEventListener('toggle', () => { if ($('#abv-de-donde-det').open) pintarTextos(); });
  $('#abv-lab').addEventListener('toggle', () => { if ($('#abv-lab').open) frasesLab(); });
  // los rótulos «ficha …» escritos en el partial, también como botón a su ficha
  $$('span.abv-org-f').forEach(s => { const x = s.textContent.trim().replace(/^ficha\s+/, ''); if (REF_FICHA.test(x)) s.outerHTML = O('f', x); });
  E = { ...PASO_E[0] };
  abrirObjetivo('plasma'); irNivel(2);
  sembrarFlujo(); estampaCelula();
  pintarTodo(false);
  // Motion solo hace falta si hay movimiento; si no llega, todo va directo al estado final
  if (!QUIETO) motionListo = cargarMotion().then(conectarMotion).catch(() => {});
}
function mostrar() {
  construir();
  requestAnimationFrame(() => { Object.values(LIENZOS).forEach(ajustarLienzo); pedirPintura(); arrancarBucle(); });
}
function ocultar() {
  if (!construido) return;
  quitarAnillo(); $('#abv-mini').classList.remove('abv-on'); $('#abv-toast').hidden = true;
}

// Ancla de estado (data-acidobase-vivo): «paso-0»…«paso-5», «paso-3b»; una causa del laboratorio («vomitos», «cad»,
// «metanol»…) o su alias legible; «conceptos» o «mayeutica». Vacía: abre la herramienta donde se dejó.
const ALIAS = {
  cetoacidosis: 'cad', 'acidosis-lactica': 'lactica', salicilatos: 'salic', 'epoc-cronica': 'respCr', 'respiratoria-cronica': 'respCr',
  'respiratoria-aguda': 'respAg', hiperaldosteronismo: 'hiperaldo', etilenglicol: 'metanol', acetazolamida: 'acetazol', bicarbonato: 'bicarb',
};
// `origen`: la ficha de la que se entra (su «← VOLVER» vuelve a ella), null desde un menú o el buscador, o undefined
// desde el otro modelo vivo (se conserva el que había; ver core/volver-ficha.js).
async function abrir(ancla = '', origen) {
  if (origen !== undefined) marcarVolver(document.getElementById('abv-volver'), R, origen);
  construir();
  await motionListo;
  const a = String(ancla || '').trim();
  if (a === 'conceptos' || a === 'mayeutica' || a === 'preguntas') { ponerModo(a === 'conceptos' ? 'conceptos' : 'preguntas'); return; }
  const m = /^paso-(\w+)$/.exec(a), causa = CAUSA[a] ? a : ALIAS[a];
  let foco = null;
  if (m || causa) {
    const i = m ? PASOS.findIndex(p => p.id === m[1]) : -1;
    if (m && i < 0) return;
    if (modo !== 'explorar') ponerModo('explorar');
    if (m) irPaso(i); else irCausa(causa);
    foco = m ? (m[1] === '0' ? null : focoDe(PASO_E[i], 'paso-' + m[1])) : focoDe(estadoDe(CAUSA[causa].e), causa);
  }
  if (!foco) { requestAnimationFrame(subirAlEstudio); return; }
  // La vista del tema se abre a los cuatro fotogramas (irPaso / irCausa): se baja hasta ella después y se marca lo clave
  quitarAnillo();
  enFotograma(6, () => {
    const v = $(foco[0]); if (!v || !R.offsetParent) return;
    window.scrollTo({ top: Math.max(0, window.scrollY + v.getBoundingClientRect().top - 64), behavior: QUIETO ? 'auto' : 'smooth' });
    setTimeout(() => anillo(foco[1]), QUIETO ? 0 : 650);
  });
}
// Al entrar desde una ficha: qué vista enseñar ([lo que se baja a ver, lo que lleva el anillo]).
// La carta para los trastornos que se leen en ella; si no, la vista del objeto del estado (riñón, alvéolo, plasma).
const FOCO = {
  metanol: ['#abv-vista-osmoles', '#svg-osm'],
  salic: ['#abv-vista-carta', '#k-punto'], respCr: ['#abv-vista-carta', '#k-punto'], respAg: ['#abv-vista-carta', '#k-punto'],
  mixta: ['#abv-vista-carta', '#k-punto'],
};
function focoDe(e, clave) {
  if (FOCO[clave]) return FOCO[clave];
  if (e.obj === 'rinon') return ['#abv-vista-rinon', e.tramo === 'proximal' ? '#c-ac2' : e.aldo === 'alta' ? '#c-hatp' : '#c-pend'];
  if (e.obj === 'alveolo') return ['#abv-vista-alveolo', e.respirador ? '#a-tubo' : '#a-lee'];
  return ['#abv-vista-plasma', '#p-hiato'];
}

// Para las pruebas (Playwright): pH calculado de todas las gasometrías, el estado y el contador de partículas
function pruebas() {
  const r = e => e.tendencia && e.paciente === 'B' ? 'tendencia' : r2(calcPH(e.paco2, e.hco3));
  return {
    pasos: PASOS.map((p, i) => ({ paso: p.id, paco2: PASO_E[i].paco2, hco3: PASO_E[i].hco3, ph: r(PASO_E[i]) })),
    causas: CAUSAS.map(c => { const e = estadoDe(c.e); return { causa: c.id, paco2: e.paco2, hco3: e.hco3, ph: r(e), ha: r2(derivar(e).HA) }; }),
    casos: CASOS.flatMap(c => c.pasos.map(p => { const e = estadoDe(p.estado); return { caso: c.titulo.split(' — ')[0], momento: p.momento, ph: r(e), ha: r2(derivar(e).HA) }; })),
    construido, modo, fase: FASE, paso: pasoActual, causa: CAUSA_ACTUAL, motion: !!M, quieto: QUIETO, bucle: corriendo,
    estado: (({ paco2, hco3, cl, obj, tramo, clLuz, etiqueta }) => ({ paco2, hco3, cl, obj, tramo, clLuz, etiqueta }))(E),
    particulas: { alveolo: ALV.vol.length, plasma: PLA.flujo.length + PLA.ev.length, hexagonos: PLA.hex.length, celula: RIN.parts.length, vuelos: INST.vuelos.length,
      total: ALV.vol.length + PLA.flujo.length + PLA.ev.length + RIN.parts.length },
  };
}

/** Monta el ácido-base vivo en su vista (#abv-raiz). Devuelve { mostrar, ocultar, abrir(ancla) }. */
export function initAcidoBaseVivo(raiz) {
  R = raiz;
  if (!R) return { mostrar() {}, ocultar() {}, abrir() {} };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancarBucle(); });
  window.__abvPruebas = pruebas;
  return { mostrar, ocultar, abrir };
}
