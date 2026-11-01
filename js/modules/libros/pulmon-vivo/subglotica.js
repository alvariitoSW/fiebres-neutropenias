// Secreciones sobre el balón y aspiración subglótica (estado `subglotica`, Marino cap. 28 pp. 21-23 y cap. 29 p. 38). Funciones puras
// (evaluar / frase / celda / mandosHtml) y el dibujo de la lupa de la tráquea (dibujar). Patrón de cuff.js, del que reusa la fuga.
// Origen: tope 25, fuga audible, biofilm en el tubo, puerto sobre el balón con succión ≤ −20 cmH₂O y menos NAV: ficha.
// Los 15 cmH₂O de «balón bajo», la altura de la colección y el número de gotas: ilustrativo (Marino no los da).
import * as D from '../../../data/pulmon-vivo-data.js';
import * as CU from './cuff.js';
import { instalarCss } from '../../../core/dibujo-iso.js';
const { CUFF, SUBGL, C } = D;
const f0 = (n) => String(Math.round(n));
export const estado0 = () => ({ asp: false, r: null });

// De la presión del balón (pedida) y la aspiración salen los ajustes del motor (los del cuff), el dibujo, el aviso y el sello
export function evaluar(s, pedido) {
  const c = CU.estado0(), r = CU.evaluar(c, pedido), p = r.p, bajo = p < SUBGL.bajo, a = s.asp ? 1 : 0, f = CU.fuga(p, false);
  const t = `Vt inspirado ${f0(CUFF.vt)} − espirado ${f0(CUFF.vt - f)} mL`;
  const dib = { p, asp: s.asp, bajo, isq: pedido > CUFF.tope, nivel: SUBGL.nivel[a], gotas: (s.asp ? SUBGL.gotas.con : SUBGL.gotas.sin)[bajo ? 1 : 0] };
  let aviso = null, sello = null;
  if (pedido > CUFF.tope) sello = { k: 'subgl-mucosa', titulo: 'Balón por encima del tope: lesión de la mucosa', texto: `Pides ${f0(pedido)} cmH₂O y el mando se queda en ${CUFF.tope}: por encima, el balón comprime los capilares de la pared de la tráquea (unos 25 mmHg) y la mucosa se isquemia. A ${CUFF.tope} cmH₂O el sello es total (${t}); más presión no sella mejor y daña la tráquea (deducción a partir de la isquemia, ilustrativo).`, cita: C.cuffPresion, origen: 'ficha, cap. 28 p. 21-22 (25 mmHg y 25 cmH₂O: nota de fuentes); «no sella mejor»: deducción, ilustrativo' };
  else if (bajo) sello = { k: 'subgl-bajo', titulo: 'Balón bajo: el sello falla y pasan las secreciones', texto: `A ${f0(p)} cmH₂O queda un hueco entre el balón y la pared: hay fuga audible (${t}) y las secreciones acumuladas encima resbalan por él hacia las vías aéreas inferiores${s.asp ? ', aunque el puerto las despeje en parte' : ''}. Infla hasta que no haya fuga audible, sin pasar de ${CUFF.tope}.`, cita: C.cuffFuga, origen: 'ficha, cap. 28 p. 21-22 y cap. 29 p. 38 · 15 cmH₂O y las gotas: ilustrativo (Marino no da un mínimo)' };
  else if (p >= CUFF.aviso && p < CUFF.tope) aviso = { nivel: 'aviso', titulo: 'Balón cerca del tope', texto: `${f0(p)} cmH₂O está cerca del límite de ${CUFF.tope}; por encima la mucosa traqueal se isquemia.`, cita: C.cuffPresion, origen: 'ficha, cap. 28 p. 21' };
  else if (s.asp) aviso = { nivel: 'aviso', titulo: 'Aspiración subglótica en marcha', texto: 'El puerto sobre el balón despeja las secreciones con succión continua (habitualmente no más de −20 cmH₂O): menos NAV en los estudios.', cita: C.subglotica, origen: 'ficha, cap. 29 p. 38' };
  else aviso = { nivel: 'aviso', titulo: 'Secreciones sobre el balón', texto: 'Con el balón inflado y sellado, las secreciones de la boca se acumulan encima, y el balón inflado no impide la aspiración (p. 38). Con un tubo de puerto subglótico se pueden despejar.', cita: C.subglotica, origen: 'ficha, cap. 29 p. 38' };
  s.r = dib;
  return { ...r, aviso, sello, dib };
}
// La frase viva: cambia con la aspiración y con la presión del balón
export function frase(s, p) {
  const pie = 'ficha: el balón no impide la aspiración y el puerto subglótico baja la NAV (cap. 29 p. 38) · cifras del dibujo: ilustrativo';
  if (p < SUBGL.bajo) return `Con el balón a ${f0(p)} cmH₂O el sello falla: las secreciones resbalan por el hueco hacia el pulmón${s.asp ? ' (el puerto despeja parte)' : ''}. ${pie}`;
  return (s.asp ? 'La succión continua del puerto despeja las secreciones sobre el balón: casi no queda nada que escurra hacia el pulmón.' : 'Las secreciones de la boca se acumulan sobre el balón y el balón inflado no impide la aspiración (p. 38).') + ' ' + pie;
}
export function celda(s, celdaFn) {
  const d = s.r; if (!d) return '';
  return celdaFn('secr', 'Secreciones sobre el balón', d.nivel > 0.5 ? 'acumuladas' : 'despejadas', d.asp ? 'puerto con succión ≤ −20 cmH₂O (cap. 29 p. 38) · ilustrativo' : 'sin aspiración subglótica · ilustrativo', d.nivel > 0.5 ? 'no' : 'si');
}
export function mandosHtml(c, s, desl) {
  return `<p class="dock-nota dock-grupo"><b>Gaspar, día 4</b>: intubado, volumen control (410 mL), tubo con puerto subglótico</p>`
    + desl('cuff', 'Presión del balón', c.p, 0, CUFF.max, 1, 'cmH₂O', `tope ${CUFF.tope} cmH₂O (nota: la ficha da 25 mmHg y 25 cmH₂O) (Marino cap. 28 p. 21-22: isquemia de la mucosa) · por debajo de ${SUBGL.bajo} el sello falla: ilustrativo`)
    + `<div class="rejilla" style="--n:1"><button type="button" class="tog" data-m="asp" aria-pressed="${s.asp}">Aspiración subglótica<small>${s.asp ? 'sí: succión continua ≤ −20 cmH₂O' : 'no'} (cap. 29 p. 38)</small></button></div>`;
}

// ---------------------------------------------------------------- la lupa de la tráquea (dibujo)
const CSS = `
.sg-fondo { fill: var(--bg-main); stroke: var(--text-dim); stroke-width: 1; }
.sg-pared { fill: none; stroke: var(--text-dim); stroke-width: 1.6; }
.sg-pared.isq { stroke: var(--accent-red); stroke-width: 4; }
.sg-tubo { fill: color-mix(in srgb, var(--text-main) 10%, var(--bg-main)); stroke: var(--text-main); stroke-width: 1.2; }
.sg-balon { fill: color-mix(in srgb, var(--accent-blue) 40%, transparent); stroke: var(--accent-blue); stroke-width: 1; }
.sg-secr { fill: color-mix(in srgb, var(--accent-yellow) 55%, transparent); stroke: var(--accent-yellow); stroke-width: .6; }
.sg-gota { fill: var(--accent-yellow); stroke: var(--accent-red); stroke-width: .8; }
.sg-bio { fill: var(--accent-purple); fill-opacity: .8; }
.sg-puerto { fill: none; stroke: var(--text-dim); stroke-width: 1.4; stroke-dasharray: 3 2; }
.sg-puerto.on { stroke: var(--accent-green); stroke-width: 2.2; }
.sg-t { font: 9.5px var(--sans); fill: var(--text-dim); }
.sg-t.g { fill: var(--accent-green); font-weight: 700; }
.sg-t.r { fill: var(--accent-red); font-weight: 700; }
.sg-guia { stroke: var(--text-muted); stroke-width: .6; }
@media (prefers-reduced-motion: no-preference) { .sg-gota { animation: sg-baja 2.4s ease-in infinite; } @keyframes sg-baja { from { transform: translateY(0); opacity: 1; } to { transform: translateY(16px); opacity: 0; } } }
`;
const NS = 'http://www.w3.org/2000/svg', CX = 260, GOTAS = [[216, 188], [304, 192], [222, 206], [298, 210]];
const FIJO = `<rect class="sg-fondo" x="128" y="52" width="256" height="226" rx="6"/>
<text class="sg-t" x="134" y="66">Tráquea ampliada · ilustrativo</text>
<path class="sg-pared" d="M214 74 V212 Q214 226 196 242 L166 264"/><path class="sg-pared" d="M306 74 V212 Q306 226 324 242 L354 264"/><path class="sg-pared" d="M238 266 L260 238 L282 266"/>
<text class="sg-t" x="260" y="274" text-anchor="middle">al pulmón</text>
<text class="sg-t" x="134" y="100">secreciones</text><text class="sg-t" x="134" y="111">sobre el balón</text>
<text class="sg-t" x="134" y="170">balón</text>
<text class="sg-t" x="134" y="218">microaspi-</text><text class="sg-t" x="134" y="229">ración</text>
<text class="sg-t" x="312" y="92">biofilm</text><text class="sg-t" x="312" y="103">en la luz</text>
<text class="sg-t" x="312" y="132">puerto</text><text class="sg-t" x="312" y="143">subglótico</text>
<line class="sg-guia" x1="278" y1="96" x2="310" y2="96"/><line class="sg-guia" x1="276" y1="138" x2="310" y2="138"/>`;
export function dibujar(svg, s) {
  let g = svg.querySelector('#pul-esc-subgl');
  if (!s?.r) { if (g) g.setAttribute('hidden', ''); return; }
  if (!g) {
    instalarCss('pul-subgl', CSS);
    g = document.createElementNS(NS, 'g'); g.id = 'pul-esc-subgl';
    const bio = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle class="sg-bio" cx="${i % 2 ? 273 : 247}" cy="${86 + i * 14}" r="${i % 3 ? 2.2 : 3}"/>`).join('');
    g.innerHTML = FIJO + `<g data-sg="secr"></g><rect class="sg-balon" data-sg="balon" y="150" height="28" rx="10"/><rect class="sg-tubo" x="242" y="74" width="36" height="126" rx="3"/>${bio}
<path class="sg-puerto" data-sg="succion" d="M274 148 V74"/><text class="sg-t g" data-sg="menos20" x="284" y="70" hidden>−20 cmH₂O</text>
<g data-sg="gotas">${GOTAS.map(([x, y]) => `<circle class="sg-gota" cx="${x}" cy="${y}" r="3.2"/>`).join('')}</g>
<path class="sg-pared isq" data-sg="isq" d="M214 150 V178 M306 150 V178" hidden/><text class="sg-t r" data-sg="isqt" x="312" y="168" hidden>mucosa</text><text class="sg-t r" data-sg="isqt" x="312" y="179" hidden>isquémica</text>`;
    svg.append(g);
  }
  g.removeAttribute('hidden');
  const d = s.r, q = (k) => g.querySelector(`[data-sg="${k}"]`), hw = 18 + 1.12 * d.p, alto = 70 * d.nivel;
  q('balon').setAttribute('x', String(CX - hw)); q('balon').setAttribute('width', String(2 * hw));
  q('secr').innerHTML = alto < 1 ? '' : `<rect class="sg-secr" x="214" y="${150 - alto}" width="28" height="${alto}"/><rect class="sg-secr" x="278" y="${150 - alto}" width="28" height="${alto}"/>`;
  [...q('gotas').children].forEach((c, i) => c.toggleAttribute('hidden', i >= d.gotas));
  q('succion').classList.toggle('on', d.asp); q('menos20').toggleAttribute('hidden', !d.asp);
  q('isq').toggleAttribute('hidden', !d.isq); g.querySelectorAll('[data-sg="isqt"]').forEach((t) => t.toggleAttribute('hidden', !d.isq));
}
