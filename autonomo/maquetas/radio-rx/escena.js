// Rx de tórax portátil AP dibujada (pieza común de las maquetas radio-rx-a/b/c). Sin librerías.
// pintarRx(svg, estado) pinta la placa y devuelve { cifras, frase, sello, ... } (de estados.js).
// Dibujo propio, de anatomía general: ningún contorno copiado de atlas ni de webs.
// Capas, de atrás adelante: 1 fondo y partes blandas · 1b huecos del pulmón · 2 huesos · 3 diafragmas ·
// 4 trama vascular · 5 parénquima · 6 pleura · 7 mediastino · 8 dispositivos · 9 «Señálalo».
// La imagen se hace con blanco y negro con opacidad (densidad); los colores de «Señálalo», con tokens de la app.
import { describir, normalizar } from './estados.js';
export { ESTADOS, MANDOS, ESTADO_INICIAL, MAX_PATOLOGIAS, describir, normalizar, patologiasEncendidas } from './estados.js';

export const ANCHO = 390, ALTO = 330;
const CX = 195;          // línea media
const CARINA = 140;      // y de la carina (T4-T5)
const PX_CM = 8;         // escala del dibujo: ilustrativa (placa de unos 40 cm de alto)

// Números pseudoaleatorios fijos: la trama sale siempre igual.
function semilla(s) { return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648); }

const W = (op) => `fill="#fff" fill-opacity="${op}"`;
const K = (op) => `fill="#000" fill-opacity="${op}"`;

// Contornos de los pulmones (cI: cuánto baja la cúpula izquierda; + baja).
function pulmonDer() { return 'M176 58 C150 32 112 38 88 76 C68 110 57 168 57 240 Q90 214 125 214 Q158 216 176 226 Z'; }
function pulmonIzq(cI) { const y = 226 + cI; return `M214 58 C240 32 278 38 302 76 C322 110 333 170 333 ${250 + cI * 0.6} Q300 ${y} 265 ${y} Q232 ${y + 2} 214 ${236 + cI * 0.4} Z`; }
function abdomen(cI) { const y = 226 + cI; return `M20 330 L22 252 L57 240 Q90 214 125 214 Q158 216 195 232 Q232 ${y + 2} 265 ${y} Q300 ${y} 333 ${250 + cI * 0.6} L370 262 L372 330 Z`; }

// Trama vascular: ramas que salen del hilio y se afilan hacia la periferia.
function trama(hx, hy, lado, rnd) {
  const gen = ['', '', '', '', ''];
  const rama = (x, y, ang, largo, w, g) => {
    const x2 = x + Math.cos(ang) * largo * lado, y2 = y + Math.sin(ang) * largo;
    const cx = (x + x2) / 2 + (rnd() - 0.5) * largo * 0.25, cy = (y + y2) / 2 + (rnd() - 0.5) * largo * 0.25;
    gen[g] += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${w.toFixed(2)}"/>`;
    if (g < 4) for (const sg of [-1, 1]) rama(x2, y2, ang + sg * (0.25 + rnd() * 0.35), largo * (0.62 + rnd() * 0.15), w * 0.66, g + 1);
  };
  for (let i = 0; i < 9; i++) {
    const ang = (-95 + i * 21 + rnd() * 8) * Math.PI / 180;     // de arriba a abajo, hacia fuera
    rama(hx + (rnd() - 0.5) * 10, hy + (i - 4) * 4, ang, 26 + rnd() * 10, 2.6, 0);
  }
  return gen.map((d, g) => `<g stroke-opacity="${[0.42, 0.34, 0.27, 0.2, 0.14][g]}">${d}</g>`).join('');
}

function huesos() {
  let s = '';
  for (let y = 2; y < 320; y += 19) s += `<rect x="186" y="${y}" width="18" height="15" rx="3" ${W(0.14)}/>`; // columna
  for (let i = 0; i < 10; i++) {                                    // 10 arcos posteriores
    const y = 48 + i * 20, b = 16 + i * 2.2;
    s += `<path d="M186 ${y} C150 ${y - 15} 98 ${y - 6} ${66 - i * 0.6} ${y + b}" />`;
    s += `<path d="M204 ${y} C240 ${y - 15} 292 ${y - 6} ${324 + i * 0.6} ${y + b}" />`;
  }
  let a = '';
  for (let i = 0; i < 6; i++) {                                     // 6 arcos anteriores, más tenues
    const y = 66 + i * 25;
    a += `<path d="M${70 + i} ${y} C100 ${y + 8} 138 ${y + 22} 168 ${y + 34}"/><path d="M${320 - i} ${y} C290 ${y + 8} 252 ${y + 22} 222 ${y + 34}"/>`;
  }
  return `<g stroke="#fff" stroke-opacity="0.24" stroke-width="4" fill="none" stroke-linecap="round">${s.replace(/<rect[^>]*>/g, '')}</g>`
    + s.match(/<rect[^>]*>/g).join('')
    + `<g stroke="#fff" stroke-opacity="0.15" stroke-width="4" fill="none">${a}</g>`
    + `<path d="M186 64 Q140 50 76 56" stroke="#fff" stroke-opacity="0.55" stroke-width="8" fill="none" stroke-linecap="round"/>`
    + `<path d="M204 64 Q250 50 314 56" stroke="#fff" stroke-opacity="0.55" stroke-width="8" fill="none" stroke-linecap="round"/>`
    + `<path d="M36 70 L72 74 L50 176 Z M354 70 L318 74 L340 176 Z" ${W(0.1)}/>`
    + `<circle cx="20" cy="66" r="22" ${W(0.32)}/><circle cx="370" cy="66" r="22" ${W(0.32)}/>`;
}

// Línea visceral y zona sin trama del neumotórax (izquierdo, a la derecha de la imagen).
function geomNtx(e, d) {
  const cI = d.cupulaIzq, sup = e.postura === 'supino';
  if (e.ntx === 'no') return null;
  if (d.tension) return { zona: pulmonIzq(cI), linea: 'M232 150 C218 124 224 112 236 118 C248 128 246 196 238 204 C224 208 226 178 232 150 Z', mascara: 1, surco: sup ? 34 : 0, colapso: true }; // el pulmón colapsado se retrae al hilio (medial)
  if (sup) {
    const g = e.ntx === 'grande';
    return { zona: g ? `M232 150 C280 140 320 150 332 190 L333 ${250 + cI * 0.6} Q300 ${226 + cI} 265 ${226 + cI} Q232 ${228 + cI} 214 236 Z` : `M262 196 C290 188 318 196 330 214 L333 250 Q300 226 265 226 Q250 226 244 228 Z`,
      linea: null, mascara: g ? 0.85 : 0.6, surco: g ? 36 : 20, base: g ? 0.7 : 0.3 };
  }
  if (e.ntx === 'pequeno') return { zona: 'M218 60 C240 34 278 40 302 78 L304 90 C282 60 246 60 222 76 Z', linea: 'M222 76 C246 60 282 60 304 90', mascara: 1, surco: 0 };
  return { zona: 'M218 60 C240 34 278 40 302 78 C322 112 333 170 333 250 L284 238 C290 214 292 178 286 130 C280 84 252 66 222 72 Z',
    linea: 'M222 72 C252 66 280 84 286 130 C292 178 290 214 284 238', mascara: 1, surco: 0 };
}

// Derrame derecho (a la izquierda de la imagen): menisco si está sentado; veladura difusa si está tumbado.
function geomDerrame(e, d) {
  const n = d.perforacion && e.derrame === 'no' ? 'pequeno' : e.derrame;
  if (n === 'no') return null;
  if (e.postura === 'supino') return { velo: { pequeno: 0.12, medio: 0.26, grande: 0.42 }[n] }; // degradado sin borde, más denso abajo (ilustrativo)
  const top = { pequeno: 212, medio: 158, grande: 82 }[n];
  return { menisco: `M40 ${top - 12} Q70 ${top + 18} 120 ${top + 24} Q160 ${top + 28} 196 ${top + 30}`, top };
}

export function marcado(entrada) {
  const { e, d } = normalizar(entrada);
  const cI = d.cupulaIzq, dx = d.desvio, sup = e.postura === 'supino';
  const ntx = geomNtx(e, d), der = geomDerrame(e, d);
  const rnd = semilla(7);
  const atelP = e.atel === 'pulmon';
  const out = [];
  out.push(`<defs>
<filter id="rx-suave" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.6"/></filter>
<filter id="rx-muy" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="rx-hueso"><feGaussianBlur stdDeviation="0.8"/></filter>
<clipPath id="rx-cl-d"><path d="${pulmonDer()}"/></clipPath>
<clipPath id="rx-cl-i"><path d="${pulmonIzq(cI)}"/></clipPath>
<clipPath id="rx-cl-p"><path d="${pulmonDer()} ${pulmonIzq(cI)}"/></clipPath>
<mask id="rx-m-trama"><rect width="${ANCHO}" height="${ALTO}" fill="#fff"/>${ntx ? `<path d="${ntx.zona}" fill="#000" fill-opacity="${ntx.mascara}" filter="url(#rx-suave)"/>` : ''}${atelP ? `<path d="${pulmonIzq(cI)}" fill="#000" fill-opacity="0.85"/>` : ''}${der && der.menisco ? `<g clip-path="url(#rx-cl-d)"><path d="${der.menisco} L196 330 L40 330 Z" fill="#000" fill-opacity="0.85" filter="url(#rx-suave)"/></g>` : ''}</mask>
<pattern id="rx-grano" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#fff" fill-opacity="0.55"/><circle cx="5" cy="5" r="0.9" fill="#fff" fill-opacity="0.4"/></pattern>
<linearGradient id="rx-velo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.3"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
<radialGradient id="rx-ala"><stop offset="0" stop-color="#fff" stop-opacity="0.62"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
</defs>`);
  // 1 · fondo y partes blandas
  out.push(`<rect width="${ANCHO}" height="${ALTO}" fill="#000"/>`);
  out.push(`<path id="rx-c1" d="M14 330 L24 120 C28 70 70 48 140 40 L166 0 L224 0 L250 40 C320 48 362 70 366 120 L376 330 Z" ${W(0.3)} filter="url(#rx-muy)"/>`);
  // 1b · pulmones: el aire resta densidad
  out.push(`<g id="rx-c1b" filter="url(#rx-suave)"><path d="${pulmonDer()}" ${K(0.8)}/><path d="${pulmonIzq(cI)}" ${K(0.8)}/></g>`);
  // 2 · huesos
  out.push(`<g id="rx-c2" filter="url(#rx-hueso)">${huesos()}</g>`);
  // 3 · diafragmas, hígado y cámara gástrica
  out.push(`<g id="rx-c3"><path d="${abdomen(cI)}" ${W(0.5)} filter="url(#rx-suave)"/><ellipse cx="268" cy="${246 + cI}" rx="${cI > 0 ? 16 : 22}" ry="10" ${K(0.55)} filter="url(#rx-suave)"/></g>`);
  // 4 · trama vascular e hilios
  out.push(`<g id="rx-c4" mask="url(#rx-m-trama)"><g clip-path="url(#rx-cl-p)" stroke="#fff" fill="none" stroke-linecap="round" filter="url(#rx-hueso)" transform="translate(${dx * 0.5} 0)">${trama(160, 150, -1, rnd)}${trama(232, 148, 1, rnd)}</g>`
    + `<ellipse cx="${158 + dx * 0.5}" cy="152" rx="14" ry="22" ${W(0.3)} filter="url(#rx-suave)"/><ellipse cx="${234 + dx * 0.5}" cy="148" rx="12" ry="20" ${W(0.28)} filter="url(#rx-suave)"/></g>`);
  // 5 · parénquima
  const p = [];
  if (e.patron === 'edema') p.push(`<ellipse cx="140" cy="160" rx="56" ry="44" fill="url(#rx-ala)"/><ellipse cx="252" cy="158" rx="52" ry="42" fill="url(#rx-ala)"/>`
    + `<path d="M57 244 L60 220 Q70 232 96 226 L84 240 Z M333 254 L330 230 Q320 240 296 236 L306 250 Z" ${W(0.55)} filter="url(#rx-suave)"/>`);
  if (e.patron === 'sdra') p.push(`<g clip-path="url(#rx-cl-p)"><rect width="${ANCHO}" height="${ALTO}" ${W(0.3)}/><rect width="${ANCHO}" height="${ALTO}" fill="url(#rx-grano)"/></g>`);
  if (e.patron === 'sdraLoc') p.push(`<g clip-path="url(#rx-cl-p)" filter="url(#rx-muy)"><ellipse cx="88" cy="196" rx="32" ry="24" ${W(0.5)}/><ellipse cx="300" cy="206" rx="30" ry="22" ${W(0.48)}/></g>`);
  if (e.consol === 'si') p.push(`<g clip-path="url(#rx-cl-d)"><ellipse cx="104" cy="196" rx="48" ry="30" ${W(0.62)} filter="url(#rx-suave)"/>`
    + `<path d="M150 168 Q128 182 104 198 M128 182 L110 176 M116 190 L92 202 M104 198 L84 212" stroke="#000" stroke-opacity="0.7" stroke-width="2.4" fill="none" stroke-linecap="round" filter="url(#rx-hueso)"/></g>`);
  if (e.atel === 'lii') p.push(`<path d="M222 150 L298 ${236 + cI} L222 ${236 + cI} Z" ${W(0.42)} filter="url(#rx-suave)"/>`);
  if (atelP) p.push(`<path d="${pulmonIzq(cI)}" ${W(0.6)} filter="url(#rx-suave)"/>`);
  out.push(`<g id="rx-c5">${p.join('')}</g>`);
  // 6 · pleura
  const q = [];
  if (ntx) {
    q.push(`<path d="${ntx.zona}" ${K(ntx.colapso ? 0.75 : ntx.linea ? 0.7 : 0.9)} filter="url(#rx-suave)"/>`);
    if (ntx.colapso) q.push(`<path d="${ntx.linea}" ${W(0.36)} filter="url(#rx-suave)"/>`);
    if (ntx.linea) q.push(`<path d="${ntx.linea}" stroke="#fff" stroke-opacity="0.75" stroke-width="1.3" fill="none"/>`);
    if (ntx.base) q.push(`<g clip-path="url(#rx-cl-i)"><ellipse cx="288" cy="${212 + cI * 0.8}" rx="62" ry="50" ${K(Math.min(1, ntx.base + 0.25))} filter="url(#rx-muy)"/></g>`);
    if (ntx.surco) q.push(`<path d="M312 ${236 + cI * 0.6} Q332 ${250 + cI * 0.6} 340 ${250 + cI * 0.6 + ntx.surco} Q324 ${244 + cI * 0.6 + ntx.surco * 0.5} 296 ${236 + cI}" ${K(0.8)} filter="url(#rx-hueso)"/>`
      + `<path d="M265 ${226 + cI} Q300 ${226 + cI} 334 ${250 + cI * 0.6}" stroke="#fff" stroke-opacity="0.5" stroke-width="1.6" fill="none"/>`);
  }
  if (der && der.menisco) q.push(`<g clip-path="url(#rx-cl-d)"><path d="${der.menisco} L196 330 L40 330 Z" ${W(0.78)} filter="url(#rx-suave)"/></g>`);
  if (der && der.velo) q.push(`<rect x="30" y="46" width="176" height="262" fill="url(#rx-velo)" fill-opacity="${der.velo * 2.2}" filter="url(#rx-muy)"/>`);
  out.push(`<g id="rx-c6">${q.join('')}</g>`);
  // 7 · mediastino (se desplaza en bloque con el desvío)
  const ancho = d.perforacion ? 30 : 0, esc = e.patron === 'edema' ? 1.16 : 1;
  out.push(`<g id="rx-c7" transform="translate(${dx} 0)" filter="url(#rx-suave)">`
    + `<path d="M${172 - ancho} 40 L${218 + ancho * 0.6} 40 L${222 + ancho * 0.6} 150 L${170 - ancho} 150 Z" ${W(0.5)}/>`
    + `<circle cx="222" cy="110" r="13" ${W(0.5)}/>`
    + `<g transform="translate(${215 * (1 - esc)} 0) scale(${esc} 1)"><path d="M180 140 C162 160 158 204 172 236 Q214 252 262 240 C286 226 286 190 266 166 C252 150 230 144 214 142 Z" ${W(0.9)}/></g>`
    + `<rect x="188" y="0" width="14" height="${CARINA}" rx="6" ${K(0.6)}/>`
    + `<path d="M193 ${CARINA - 2} L164 172 M197 ${CARINA - 2} L232 164" stroke="#000" stroke-opacity="0.6" stroke-width="9" stroke-linecap="round"/></g>`);
  // 8 · dispositivos (siguen al mediastino)
  const r = [];
  const linea = (dd, op = 0.88, w = 1.8) => `<path d="${dd}" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  let puntaTubo = null, puntaVia = null, puntaSng = null;
  if (e.tubo !== 'no') {
    const tip = { alto: CARINA - 7 * PX_CM, bien: CARINA - 4 * PX_CM }[e.tubo];
    const dd = e.tubo === 'selectivo' ? `M195 0 L195 ${CARINA} L${195 - 2.2 * PX_CM} ${CARINA + 2.2 * PX_CM}` : `M195 0 L195 ${tip}`;
    puntaTubo = e.tubo === 'selectivo' ? [195 - 2.2 * PX_CM, CARINA + 2.2 * PX_CM] : [195, tip];
    r.push(`<path d="${dd}" stroke="#fff" stroke-opacity="0.2" stroke-width="8" fill="none"/>` + linea(dd.replace(/195/g, '197'), 0.9, 1.6));
  }
  if (e.via !== 'no') {
    const dd = { bien: 'M60 60 Q130 54 166 72 Q180 80 181 100 L181 132', ad: 'M60 60 Q130 54 166 72 Q180 80 181 100 L180 160 Q178 172 174 180',
      yugular: 'M60 60 Q130 54 166 72 Q176 66 176 40 L174 4', pared: 'M330 60 Q252 56 214 74 Q196 84 180 94' }[e.via];
    puntaVia = { bien: [181, 132], ad: [174, 180], yugular: [174, 4], pared: [180, 94] }[e.via];
    r.push(linea(dd, 0.9, 2));
  }
  if (e.sng !== 'no') {
    const tipY = 226 + cI + 10 * PX_CM - 2;
    const dd = e.sng === 'bien' ? `M199 0 L196 ${CARINA} L197 ${232 + cI} Q204 ${270 + cI} 240 ${tipY - 6} L262 ${tipY}` : `M199 0 L196 ${CARINA} Q180 160 160 186 Q140 210 122 226`;
    puntaSng = e.sng === 'bien' ? [262, tipY] : [122, 226];
    r.push(linea(dd, 0.8, 2.4));
  }
  out.push(`<g id="rx-c8"><circle cx="70" cy="28" r="6" ${W(0.7)}/><circle cx="320" cy="28" r="6" ${W(0.7)}/><circle cx="330" cy="296" r="6" ${W(0.7)}/><g transform="translate(${dx} 0)">${r.join('')}</g></g>`);
  // Rótulos fijos: «R» a la izquierda de la imagen (derecha del paciente) y la proyección.
  out.push(`<text x="14" y="34" fill="#fff" font-size="22" font-weight="700" font-family="system-ui,sans-serif">R</text>`
    + `<text x="378" y="20" fill="#fff" fill-opacity="0.85" font-size="12" text-anchor="end" font-family="system-ui,sans-serif">AP portátil, en la cama</text>`
    + (e.ocultarPostura ? '' : `<text x="378" y="322" fill="#fff" fill-opacity="0.85" font-size="12" text-anchor="end" font-family="system-ui,sans-serif">${sup ? 'Tumbado (supino)' : 'Sentado (erguido)'}</text>`));
  // 9 · «Señálalo»
  out.push(`<g id="rx-c9">${senal(e, d, { ntx, der, puntaTubo, puntaVia, puntaSng, cI, dx })}</g>`);
  return out.join('\n');
}

function senal(e, d, g) {
  const k = e.senal;
  if (!k) return '';
  const col = 'var(--accent-yellow)';
  const lin = (dd, extra = '') => `<path d="${dd}" stroke="${col}" stroke-width="2.4" fill="none" stroke-linecap="round" ${extra}/>`;
  const txt = (x, y, t, a = 'start') => `<text x="${x}" y="${y}" fill="${col}" font-size="13" font-weight="600" text-anchor="${a}" font-family="system-ui,sans-serif" paint-order="stroke" stroke="#000" stroke-width="3">${t}</text>`;
  const punta = (p, t, a = 'start') => p ? `<circle cx="${p[0] + g.dx}" cy="${p[1]}" r="8" stroke="${col}" stroke-width="2.4" fill="none"/>` + txt(p[0] + g.dx + (a === 'end' ? -12 : 12), p[1] + 4, t, a) : '';
  const carina = `<path d="M150 ${CARINA} L240 ${CARINA}" transform="translate(${g.dx} 0)" stroke="${col}" stroke-width="1.6" stroke-dasharray="5 4"/>` + txt(244 + g.dx, CARINA + 4, 'carina');
  switch (k) {
    case 'postura': return e.postura === 'supino'
      ? lin('M300 150 L300 210 M292 200 L300 212 L308 200') + txt(296, 140, 'aire: delante de la base', 'end')
      : lin('M290 120 L290 64 M282 74 L290 62 L298 74') + txt(286, 134, 'aire: al vértice', 'end');
    case 'ntx':
      if (!g.ntx) return txt(CX, 300, 'sin neumotórax', 'middle');
      if (g.ntx.colapso) return lin(g.ntx.linea) + txt(252, 150, 'pulmón colapsado') + lin(`M150 ${CARINA} L120 ${CARINA} M128 ${CARINA - 6} L118 ${CARINA} L128 ${CARINA + 6}`) + txt(112, CARINA - 8, 'mediastino', 'end');
      if (g.ntx.linea) return lin(g.ntx.linea, 'stroke-dasharray="6 4"') + txt(232, 50, 'línea pleural');
      return lin(`M312 ${236 + g.cI * 0.6} Q332 ${250 + g.cI * 0.6} 340 ${250 + g.cI * 0.6 + g.ntx.surco}`) + txt(330, 196, 'surco profundo', 'end');
    case 'derrame':
      if (!g.der) return txt(80, 300, 'sin derrame');
      return g.der.menisco ? lin(g.der.menisco) + txt(40, g.der.top - 18, 'menisco') : `<rect x="58" y="60" width="118" height="180" stroke="${col}" stroke-width="2" stroke-dasharray="6 4" fill="none"/>` + txt(60, 54, 'veladura sin borde');
    case 'patron':
      if (e.patron === 'edema') return `<ellipse cx="140" cy="160" rx="56" ry="44" stroke="${col}" stroke-width="2" fill="none"/><ellipse cx="252" cy="158" rx="52" ry="42" stroke="${col}" stroke-width="2" fill="none"/>` + txt(CX, 96, 'desde los hilios', 'middle');
      if (e.patron === 'sdra') return lin('M60 300 L330 300') + txt(CX, 294, 'todos los campos, sin derrame', 'middle');
      if (e.patron === 'sdraLoc') return `<ellipse cx="88" cy="196" rx="36" ry="28" stroke="${col}" stroke-width="2" fill="none"/><ellipse cx="300" cy="206" rx="34" ry="26" stroke="${col}" stroke-width="2" fill="none"/>` + txt(CX, 290, 'manchas en los campos inferiores', 'middle');
      return txt(CX, 300, 'trama normal', 'middle');
    case 'consol': return e.consol === 'si' ? `<ellipse cx="104" cy="196" rx="50" ry="32" stroke="${col}" stroke-width="2" fill="none"/>` + txt(60, 244, 'broncograma aéreo') : txt(80, 300, 'base derecha limpia');
    case 'atel':
      if (e.atel === 'no') return txt(CX, 300, 'sin pérdida de volumen', 'middle');
      return (e.atel === 'lii' ? lin(`M222 150 L298 ${236 + g.cI} L222 ${236 + g.cI} Z`) : lin(pulmonIzq(g.cI))) + lin(`M180 ${CARINA - 30} L${180 + Math.max(d.desvio, 8) + 14} ${CARINA - 30}`) + txt(176, CARINA - 36, d.selectivo && e.atel === 'pulmon' ? 'por el tubo selectivo' : 'tira del mediastino', 'end');
    case 'tubo':
      if (!g.puntaTubo) return carina;
      return carina + punta(g.puntaTubo, 'punta', 'end') + (e.tubo === 'selectivo' ? '' : lin(`M214 ${g.puntaTubo[1]} L218 ${g.puntaTubo[1]} L218 ${CARINA} L214 ${CARINA}`, `transform="translate(${g.dx} 0)"`) + txt(224 + g.dx, (g.puntaTubo[1] + CARINA) / 2 + 4, `${(CARINA - g.puntaTubo[1]) / PX_CM} cm`));
    case 'via': return carina + (g.puntaVia ? punta(g.puntaVia, 'punta', 'end') : '');
    case 'sng': return carina + (g.puntaSng ? punta(g.puntaSng, 'punta', e.sng === 'bien' ? 'start' : 'end') : '');
  }
  return '';
}

// Pinta la placa en el <svg> y devuelve los textos comunes (frase, cifras con origen, sello).
export function pintarRx(svg, estado) {
  svg.setAttribute('viewBox', `0 0 ${ANCHO} ${ALTO}`);
  svg.innerHTML = marcado(estado);
  return describir(estado);
}
