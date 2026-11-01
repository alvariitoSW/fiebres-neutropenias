// Dibujo del eje (viewBox 360×300): tres estaciones (óvalo = hipotálamo, gota = hipófisis, triángulo sobre riñón = suprarrenal, mariposa = tiroides),
// el cable de la retroalimentación (LA p. 4-6) y, a la derecha, el mapa (cortisol o Tabla 51.2). Rótulos ≥ 9,6 px.
const X = (x, y) => `<g class="bloq"><circle cx="${x}" cy="${y}" r="7"/><path d="M${x - 4} ${y - 4}l8 8m0-8l-8 8"/></g>`;
const T = (x, y, t, c = '', a = 'start') => `<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${t}</text>`;
export const ZONAS = { hipo: [20, 8, 100, 50], hipof: [20, 76, 100, 62], gland: [14, 160, 112, 100], cable: [124, 20, 100, 200], mapa: [244, 6, 114, 262], tijera: [132, 180, 90, 60] };
const ly = (v, a, b, h0, h1, lg) => { const f = lg ? (Math.log10(v) - Math.log10(a)) / (Math.log10(b) - Math.log10(a)) : (v - a) / (b - a); return h0 + (h1 - h0) * Math.min(1, Math.max(0, f)); };
export function escena(s, L, oculto, foco = []) {
  const adr = s.gl === 'adr', f = [];
  const a1 = adr ? (L.supr ? .15 : L.bloq ? .3 : 1) : (s.pat === 'hipoS' ? .15 : 1), a2 = adr ? (L.supr ? .15 : L.bloq ? .3 : L.eto ? 1 : 1) : (s.pat === 'hipoS' ? .15 : s.pat === 'graves' || s.pat === 't3' ? .15 : s.pat === 'hipoP' ? 1 : 1);
  const a3 = adr ? (L.prod == null ? .2 : 1) : (s.pat === 'hipoP' ? .25 : 1);
  f.push(`<ellipse class="est" cx="70" cy="32" rx="38" ry="20"/>${T(70, 36, 'Hipotálamo', 'rot', 'middle')}`);
  f.push(`<path class="est" d="M70 80 C34 108 38 138 70 138 C102 138 106 108 70 80Z"/>${T(70, 118, 'Hipófisis', 'rot', 'middle')}`);
  f.push(`<g id="a1" class="fl" opacity="${a1}"><path d="M70 54V82m-5-6l5 6 5-6"/></g>${T(78, 70, adr ? 'CRH' : 'TRH', 'hor')}`);
  f.push(`<g id="a2" class="fl" opacity="${a2}"><path d="M70 140V170m-5-6l5 6 5-6"/></g>${T(78, 160, adr ? 'ACTH' : 'TSH', 'hor')}`);
  if (adr) f.push(`<g transform="translate(70 205) scale(${L.atrofia ? .62 : 1}) translate(-70 -205)"><ellipse class="est ${L.eto ? 'cand' : ''}" cx="70" cy="214" rx="36" ry="20"/><path class="est tri" d="M70 168 L100 206 L40 206Z"/></g>${T(70, 252, 'Suprarrenal', 'rot', 'middle')}`);
  else f.push(`<g><ellipse class="est ${s.pat === 'hipoP' ? 'ap' : ''}" cx="48" cy="210" rx="19" ry="27"/><ellipse class="est ${s.pat === 'hipoP' ? 'ap' : ''}" cx="92" cy="210" rx="19" ry="27"/><rect class="est" x="58" y="204" width="24" height="12"/></g>${T(70, 252, 'Tiroides', 'rot', 'middle')}`);
  if (L.eto) f.push(`<g class="cand-i"><rect x="63" y="206" width="14" height="10"/><path d="M66 206v-4a4 4 0 0 1 8 0v4"/></g>${T(106, 238, s.farm === 'eto' ? 'etomidato' : 'ketoconazol', 'min')}`);
  f.push(`<g id="a3" class="fl" opacity="${a3}"><path d="M104 210H148m-6-5l6 5-6 5"/></g>${T(106, 202, adr ? 'cortisol' : 'T4 → T3', 'hor')}`);
  if (!adr) { f.push(`<g class="tij ${L.tijera}"><path d="M164 200l22 22M164 222l22-22"/><circle cx="164" cy="200" r="3"/><circle cx="164" cy="222" r="3"/></g>${T(176, 242, 'desyodasa', 'min', 'middle')}`); if (L.tijera === 'rota') f.push(`<path class="bloq-l" d="M160 232l30-30"/>`); }
  // cable
  const off = !L.cable && adr;
  f.push(`<g id="cab" class="cable ${off ? 'ext' : ''}"><path d="M148 210H215V32H108M215 110H100"/></g><circle class="menos" cx="215" cy="118" r="7"/><text x="215" y="121" class="menos-t" text-anchor="middle">−</text><circle class="menos" cx="215" cy="32" r="7"/><text x="215" y="35" class="menos-t" text-anchor="middle">−</text>`);
  f.push(T(112, 62, 'retroalimentación (−)', 'min') + T(112, 74, 'cable: Libro Azul', 'min'));
  if (adr && L.supr) f.push(`<g class="fl rojo"><path d="M170 150H212m-6-5l6 5-6 5"/></g>${T(130, 154, 'Prednisona', 'hor')}`);
  if (adr && L.bloq) f.push(X(70, 68), X(70, 168), X(148, 210), T(112, 92, 'citocinas', 'min'), T(112, 104, '3 bloqueos', 'min'));
  if (!adr && L.tormenta) f.push(T(104, 190, '¡sin freno!', 'oro'));
  // mapa
  if (adr) {
    const y = (v) => ly(v, 0, 60, 250, 34), rb = (a, b, c) => `<rect class="${c}" x="262" y="${y(b)}" width="22" height="${y(a) - y(b)}"/>`;
    f.push(T(248, 14, 'Cortisol µg/dL', 'rot') + rb(0, 10, 'b-r') + rb(10, 35, 'b-a') + rb(35, 60, 'b-v') + T(290, 37, '60', 'min') + T(290, y(35) + 3, '35', 'min') + T(290, y(10) + 3, '10', 'min') + T(290, 248, '0', 'min') + T(290, 72, 'adecuada', 'min') + T(290, 180, 'indeterminado', 'min') + T(290, 238, 'supresión', 'min'));
    if (!oculto) { const c = Math.min(60, L.cort); f.push(`<path class="pt" d="M256 ${y(c) - 5}l8 5-8 5z"/>`); if (s.acth) f.push(`<path class="pt hueco" d="M256 ${y(Math.min(60, c + L.delta)) - 5}l8 5-8 5z"/>` + T(248, 27, 'hueco: tras ACTH', 'min')); }
  } else {
    const x = (v) => 250 + ly(v, 0.001, 100, 0, 102, true), y = (v) => ly(v, 0.1, 10, 240, 30, true);
    f.push(`<rect class="caja" x="250" y="30" width="102" height="210"/><rect class="norm" x="${x(0.3)}" y="${y(1.8)}" width="${x(4.5) - x(0.3)}" height="${y(0.8) - y(1.8)}"/>`);
    f.push(T(248, 14, 'T4 libre ng/dL ↑', 'rot') + T(252, y(6) + 3, '6', 'min') + T(252, y(1) + 3, '1', 'min') + T(252, y(0.2) + 3, '0,2', 'min') + T(270, 252, '0,01', 'min', 'middle') + T(311, 252, '1', 'min', 'middle') + T(352, 252, '100', 'min', 'end') + T(301, 266, 'TSH mU/mL (log)', 'min', 'middle'));
    if (!oculto) f.push(`<circle class="pt" cx="${Math.min(352, Math.max(250, x(L.tsh)))}" cy="${Math.min(240, Math.max(30, y(L.t4)))}" r="5"/>`);
  }
  for (const z of foco) if (ZONAS[z]) f.push(`<rect class="foco" x="${ZONAS[z][0]}" y="${ZONAS[z][1]}" width="${ZONAS[z][2]}" height="${ZONAS[z][3]}" rx="8"/>`);
  return f.join('');
}
