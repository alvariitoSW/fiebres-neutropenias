// Ácido-base vivo · dibujo de la curva de titulación del bicarbonato (Marino, Fig. 32.2, p. 22 del PDF).
// Archivo aparte para no engordar acidobase-vivo.js. El punto del paciente sale del pH del motor (calcPH, Ec. 31.1-31.2).
// La curva es la de Henderson-Hasselbalch con pK 6,1: fracción del par en forma de HCO₃⁻ = 1 / (1 + 10^(pK − pH)).
import { calcPH } from './acidobase-vivo-calculo.js';

const NS = 'http://www.w3.org/2000/svg';
export const PK = 6.1;                                   // mr-lactato-bicarbonato#mr-bicarb-tampon (Fig. 32.2)
const X0 = 40, X1 = 336, Y0 = 188, Y1 = 26;              // pH 5 → 8 · 0 % → 100 %
const PH_MIN = 5, PH_MAX = 8;
const px = ph => X0 + (Math.min(PH_MAX, Math.max(PH_MIN, ph)) - PH_MIN) / (PH_MAX - PH_MIN) * (X1 - X0);
const py = f => Y0 - f * (Y0 - Y1);
export const fraccion = ph => 1 / (1 + Math.pow(10, PK - ph));
const coma = (v, d = 0) => v.toFixed(d).replace('.', ',');
const alfa = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };

export function construirTitulacion(svg, C) {
  if (!svg) return;
  let curva = '';
  for (let ph = PH_MIN; ph <= PH_MAX + 1e-9; ph += 0.05) curva += (curva ? 'L' : 'M') + px(ph).toFixed(1) + ' ' + py(fraccion(ph)).toFixed(1);
  const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 10}" fill="${o.c || C.dim}" text-anchor="${o.a || 'middle'}"${o.b ? ' font-weight="700"' : ''}>${s}</text>`;
  let t = `<rect x="0" y="0" width="360" height="236" fill="${C.fondo}"/>`;
  // zona eficaz del tampón: pK ± 1 (5,1 a 7,1)
  t += `<rect x="${px(5.1).toFixed(1)}" y="${Y1}" width="${(px(7.1) - px(5.1)).toFixed(1)}" height="${Y0 - Y1}" fill="${alfa(C.verde, .16)}"/>`;
  t += txt(((px(5.1) + px(7.1)) / 2).toFixed(1), Y1 + 13, 'zona eficaz del tampón', { c: C.crema, b: 1 });
  t += txt(((px(5.1) + px(7.1)) / 2).toFixed(1), Y1 + 25, 'de 5,1 a 7,1', { c: C.crema });
  // franja del pH extracelular
  t += `<rect x="${px(7.35).toFixed(1)}" y="${Y1}" width="${(px(7.45) - px(7.35)).toFixed(1)}" height="${Y0 - Y1}" fill="${alfa(C.ocre, .35)}"/>`;
  t += txt((px(7.45) + 3).toFixed(1), 128, 'pH de', { c: C.ocre, b: 1, a: 'start' }) + txt((px(7.45) + 3).toFixed(1), 140, 'la sangre', { c: C.ocre, b: 1, a: 'start' });
  // ejes
  t += `<path d="M${X0} ${Y1}V${Y0}H${X1}" fill="none" stroke="${C.muted}" stroke-width="1"/>`;
  [5, 6, 7, 8].forEach(p => { t += `<path d="M${px(p)} ${Y0}v4" stroke="${C.muted}"/>` + txt(px(p), Y0 + 16, p); });
  t += txt((X0 + X1) / 2, Y0 + 31, 'pH del plasma', { c: C.dim });
  [0, 0.5, 1].forEach(f => { t += txt(X0 - 5, py(f) + 3.5, Math.round(f * 100) + ' %', { a: 'end' }); });
  t += txt(X0 - 28, Y1 - 10, 'HCO₃⁻ en el par HCO₃⁻ / H₂CO₃', { a: 'start', c: C.dim });
  // pK
  t += `<path d="M${px(PK)} ${Y0}V${py(0.5)}H${X0}" fill="none" stroke="${C.crema}" stroke-width="1" stroke-dasharray="3 3"/>`;
  t += txt(px(PK) + 4, Y0 - 5, 'pK 6,1', { a: 'start', c: C.crema, b: 1 });
  t += `<circle cx="${px(PK)}" cy="${py(0.5)}" r="3.5" fill="${C.crema}"/>` + txt(px(PK) + 9, py(0.5) + 15, '50 %', { a: 'start', c: C.crema });
  t += `<path d="${curva}" fill="none" stroke="${C.oro}" stroke-width="2.4"/>`;
  // el paciente
  t += `<g id="abv-t-punto"><circle r="11" fill="${alfa(C.oro, .12)}" stroke="${C.oro}" stroke-width=".7"/><circle r="5.4" fill="${C.crema}" stroke="${C.oro}" stroke-width="1.6"/><circle r="1.6" fill="${C.fondo}"/></g>`;
  t += `<text id="abv-t-punto-t" font-size="10" fill="${C.crema}" font-weight="700"></text>`;
  svg.innerHTML = t;
  svg.setAttribute('viewBox', '0 0 360 236');
}

/** Pone el punto del paciente (pH del motor) y la frase viva. `O` es el generador de rótulos de origen del modelo. */
export function pintarTitulacion(R, E, O) {
  const g = R.querySelector('#abv-t-punto'), tt = R.querySelector('#abv-t-punto-t'), fr = R.querySelector('#abv-titu-frase'), og = R.querySelector('#abv-titu-org');
  if (!g || !tt || !fr) return;
  const tapa = !!(E.ocultar && (E.ocultar.includes('punto') || E.ocultar.includes('ph')));
  const ph = calcPH(E.paco2, E.hco3), f = fraccion(ph);
  g.setAttribute('visibility', tapa ? 'hidden' : 'visible'); tt.setAttribute('visibility', tapa ? 'hidden' : 'visible');
  if (!tapa) {
    const x = px(ph), y = py(f), der = x < 250;
    g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    tt.setAttribute('x', (der ? x + 13 : x - 13).toFixed(1)); tt.setAttribute('y', (y + 22).toFixed(1)); tt.setAttribute('text-anchor', der ? 'start' : 'end');
    tt.textContent = `pH ${coma(ph, 2)}`;
  }
  const dentro = ph >= 5.1 && ph <= 7.1;
  const h = tapa ? '' : `Tu paciente: pH <strong>${coma(ph, 2)}</strong>, ${coma(f * 100)} % del par en forma de HCO₃⁻. `;
  fr.innerHTML = `${h}El tampón solo es eficaz a ±1 unidad de su pK (6,1): <strong>entre 5,1 y 7,1</strong>. ${tapa ? 'El pH de la sangre cae fuera de esa zona.' : dentro ? 'Este pH sí cae dentro de la zona eficaz.' : 'Este pH cae fuera de la zona eficaz, como el pH normal de la sangre (7,35-7,45).'} Más que un tampón, el HCO₃⁻ es el producto final del transporte de CO₂.`;
  if (og) og.innerHTML = O('f', 'mr-lactato-bicarbonato#mr-bicarb-tampon') + O('i', 'cifras de la sangre del paciente');
}
