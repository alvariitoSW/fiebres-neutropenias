// La escena del pulmón con respirador, pieza 1 (maqueta; en la app: js/modules/libros/pulmon-vivo-escena.js).
// Respirador (pantalla con los ajustes, rama inspiratoria y espiratoria, válvula espiratoria que se cierra en la pausa
// y la oclusión), tubo con su cuff, tórax con la pleura y el diafragma, y el racimo de alvéolos (12), que se hincha con
// el volumen del modelo. Un compartimento: todos los alvéolos se mueven a la vez; las poblaciones (colapsados,
// sobredistendidos) llegan en la pieza 2. No calcula nada: dibuja lo que le da el modelo (pulmon.mjs).
//   crearEscena(svg) → { actualizar(p, L, info), elementos }
const NS = 'http://www.w3.org/2000/svg';
const f1 = (n) => Math.round(n * 10) / 10;

export const ESCENA_CSS = `
.esc-caja { fill: var(--card2); stroke: var(--text-dim); stroke-width: 1; }
.esc-pantalla { fill: var(--bg-main); stroke: var(--accent-yellow); stroke-width: .8; }
.esc-txt { font: 600 8.5px var(--sans); fill: var(--text-dim); }
.esc-txt.g { font-size: 9.5px; fill: var(--accent-yellow); }
.esc-txt.rot { font-size: 8.5px; fill: var(--text-muted); letter-spacing: .03em; text-transform: uppercase; }
.esc-tubo { fill: none; stroke: var(--text-dim); stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; opacity: .75; }
.esc-tubo-luz { fill: none; stroke: var(--bg-main); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
.esc-flujo { fill: none; stroke: var(--accent-green); stroke-width: 2; stroke-dasharray: 5 6; stroke-linecap: round; opacity: 0; }
.esc-flujo.on { opacity: .9; }
.esc-valvula { fill: var(--accent-green); stroke: var(--text-dim); stroke-width: .8; }
.esc-valvula.cerrada { fill: var(--accent-red); }
.esc-torax { fill: color-mix(in srgb, var(--text-main) 6%, var(--bg-main)); stroke: var(--text-dim); stroke-width: 1.2; }
.esc-pleura { fill: none; stroke: var(--accent-blue); stroke-width: .8; stroke-dasharray: 2 2; opacity: .8; }
.esc-diafragma { fill: none; stroke: var(--text-dim); stroke-width: 2; stroke-linecap: round; }
.esc-pulmon { fill: color-mix(in srgb, var(--accent-green) 14%, var(--bg-main)); stroke: var(--accent-green); stroke-width: .8; opacity: .9; }
.esc-alv { fill: var(--accent-green); fill-opacity: .55; stroke: var(--accent-green); stroke-width: .8; }
.esc-racimo.terracota .esc-alv { fill: url(#pul-esc-rayas); stroke: var(--accent-red); }
.esc-racimo.hiper .esc-alv { stroke: var(--accent-yellow); }
.esc-capilar { fill: none; stroke: var(--accent-red); stroke-width: .7; opacity: .6; }
.esc-cuff { fill: color-mix(in srgb, var(--accent-blue) 40%, transparent); stroke: var(--accent-blue); stroke-width: .7; }
.esc-sello { font: 700 8.5px var(--sans); fill: var(--accent-red); }
`;

export function crearEscena(svg) {
  svg.setAttribute('viewBox', '0 0 390 300');
  // 12 alvéolos en racimo alrededor del bronquio terminal (centro 300, 172)
  const CX = 300, CY = 172, ALV = [];
  for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6, rr = i % 2 ? 38 : 24; ALV.push([CX + rr * Math.cos(a), CY + rr * Math.sin(a)]); }
  svg.innerHTML = `<defs><pattern id="pul-esc-rayas" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" style="fill:var(--accent-red);fill-opacity:.35"/><line x1="0" y1="0" x2="0" y2="4" style="stroke:var(--accent-red)" stroke-width="1.2"/></pattern></defs>
  <!-- respirador -->
  <g id="pul-esc-respirador">
    <rect x="8" y="46" width="112" height="206" rx="8" class="esc-caja"/>
    <text x="64" y="40" class="esc-txt rot" text-anchor="middle">Respirador</text>
    <rect id="pul-esc-pantalla" x="16" y="54" width="96" height="92" rx="4" class="esc-pantalla"/>
    <text id="pul-esc-p-modo" x="22" y="68" class="esc-txt g">VCV</text>
    <text id="pul-esc-p-alarma" x="106" y="68" class="esc-sello" text-anchor="end" hidden>¡Pmax!</text>
    <text x="22" y="84" class="esc-txt">Vt</text><text id="pul-esc-p-vt" x="106" y="84" class="esc-txt g" text-anchor="end">500</text>
    <text x="22" y="98" class="esc-txt">FR</text><text id="pul-esc-p-fr" x="106" y="98" class="esc-txt g" text-anchor="end">14</text>
    <text x="22" y="112" class="esc-txt">PEEP</text><text id="pul-esc-p-peep" x="106" y="112" class="esc-txt g" text-anchor="end">5</text>
    <text x="22" y="126" class="esc-txt">Flujo</text><text id="pul-esc-p-flujo" x="106" y="126" class="esc-txt g" text-anchor="end">60</text>
    <text x="22" y="140" class="esc-txt">FiO₂</text><text x="106" y="140" class="esc-txt g" text-anchor="end">0,4</text>
    <circle cx="34" cy="170" r="9" class="esc-caja"/><circle cx="64" cy="170" r="9" class="esc-caja"/><circle cx="94" cy="170" r="9" class="esc-caja"/>
    <text x="34" y="190" class="esc-txt" text-anchor="middle">Vt</text><text x="64" y="190" class="esc-txt" text-anchor="middle">FR</text><text x="94" y="190" class="esc-txt" text-anchor="middle">PEEP</text>
    <text x="64" y="214" class="esc-txt rot" text-anchor="middle">dos ramas: insp. y esp.</text>
    <rect x="30" y="222" width="70" height="20" rx="3" class="esc-pantalla"/><text id="pul-esc-p-fase" x="65" y="236" class="esc-txt" text-anchor="middle">inspiración</text>
  </g>
  <!-- ramas y válvula espiratoria -->
  <path id="pul-esc-rama-insp" class="esc-tubo" d="M120 200 H150 Q172 200 180 184 L200 170"/>
  <path class="esc-tubo-luz" d="M120 200 H150 Q172 200 180 184 L200 170"/>
  <path id="pul-esc-rama-esp" class="esc-tubo" d="M200 170 L180 156 Q172 140 150 140 H120"/>
  <path class="esc-tubo-luz" d="M200 170 L180 156 Q172 140 150 140 H120"/>
  <path id="pul-esc-flujo-insp" class="esc-flujo" d="M120 200 H150 Q172 200 180 184 L200 170"/>
  <path id="pul-esc-flujo-esp" class="esc-flujo" d="M200 170 L180 156 Q172 140 150 140 H120"/>
  <text x="150" y="214" class="esc-txt rot" text-anchor="middle">rama insp.</text>
  <text x="150" y="132" class="esc-txt rot" text-anchor="middle">rama esp.</text>
  <circle id="pul-esc-valvula-esp" cx="134" cy="140" r="6" class="esc-valvula"><title>Válvula espiratoria</title></circle>
  <!-- tórax -->
  <g id="pul-esc-torax">
    <path class="esc-torax" d="M234 72 Q300 52 366 72 Q384 160 366 262 Q300 282 234 262 Q216 160 234 72 Z"/>
    <path id="pul-esc-pleura" class="esc-pleura" d="M242 86 Q300 70 358 86 Q372 160 358 250 Q300 266 242 250 Q228 160 242 86 Z"/>
    <path id="pul-esc-pulmon" class="esc-pulmon" d="M252 96 Q300 82 348 96 Q360 170 348 240 Q300 254 252 240 Q240 170 252 96 Z"/>
    <path id="pul-esc-diafragma" class="esc-diafragma" d="M236 262 Q300 236 364 262"/>
    <text x="300" y="66" class="esc-txt rot" text-anchor="middle">Tórax</text>
    <text x="300" y="277" class="esc-txt rot" text-anchor="middle">diafragma</text>
  </g>
  <!-- tubo endotraqueal con cuff -->
  <path id="pul-esc-tubo" class="esc-tubo" d="M200 170 H262 Q280 170 290 172"/>
  <path class="esc-tubo-luz" d="M200 170 H262 Q280 170 290 172"/>
  <ellipse id="pul-esc-cuff" cx="250" cy="170" rx="7" ry="9" class="esc-cuff"/>
  <text x="222" y="186" class="esc-txt rot" text-anchor="middle">tubo</text>
  <!-- racimo -->
  <g id="pul-esc-racimo" class="esc-racimo">${ALV.map((p, i) => `<line class="esc-capilar" x1="${f1(CX + (p[0] - CX) * 0.55)}" y1="${f1(CY + (p[1] - CY) * 0.55)}" x2="${f1(p[0])}" y2="${f1(p[1])}"/><circle class="esc-alv" data-alv="${i}" cx="${f1(p[0])}" cy="${f1(p[1])}" r="8"/>`).join('')}</g>
  <text id="pul-esc-palv" x="300" y="232" class="esc-txt g" text-anchor="middle">Palv 5</text>
  <text x="300" y="244" class="esc-txt rot" text-anchor="middle">presión alveolar</text>`;
  const $ = (id) => svg.querySelector('#' + id);
  const alv = [...svg.querySelectorAll('.esc-alv')];
  let despl = 0;
  // p: el pulmón vivo; L: su última lectura (o null); info: { reducir }
  function actualizar(p, L, info = {}) {
    const r = p.S.resp, V = p.volAbs, C = p.S.pulmon.c;
    // el racimo: radio con el volumen por encima del reposo a presión cero (0 → 6,5; 1000 mL → 12,5; aproximación de raíz cúbica)
    const esc = 6.5 + 6 * Math.cbrt(Math.max(0, V) / 1000);
    for (const a of alv) a.setAttribute('r', f1(esc));
    const t = Math.min(1, V / 1200);
    $('pul-esc-pulmon').setAttribute('transform', `translate(${f1(300 - 300 * (1 + 0.05 * t))} ${f1(168 - 168 * (1 + 0.05 * t))}) scale(${f1(1 + 0.05 * t)})`);
    $('pul-esc-diafragma').setAttribute('d', `M236 262 Q300 ${f1(236 + 14 * t)} 364 262`);
    const pa = p.palv;
    $('pul-esc-palv').textContent = `Palv ${f1(pa)} cmH₂O`;
    const rac = $('pul-esc-racimo');
    rac.classList.toggle('terracota', (L?.palvFinInsp ?? pa) > 30);
    rac.classList.toggle('hiper', (L?.vAtrapado ?? 0) > 150);
    // válvula espiratoria: cerrada en la inspiración, la pausa y la oclusión
    const cerrada = p.fase !== 'esp';
    $('pul-esc-valvula-esp').classList.toggle('cerrada', cerrada);
    $('pul-esc-p-fase').textContent = { insp: 'inspiración', pausa: 'pausa insp.', esp: 'espiración', oclusion: 'oclusión esp.' }[p.fase] || '';
    // el aire que se mueve: rayas que corren con el flujo
    const q = p.flujo, fi = $('pul-esc-flujo-insp'), fe = $('pul-esc-flujo-esp');
    fi.classList.toggle('on', q > 1); fe.classList.toggle('on', q < -1);
    if (!info.reducir) { despl = (despl - q * 0.015) % 11; fi.setAttribute('stroke-dashoffset', f1(despl)); fe.setAttribute('stroke-dashoffset', f1(-despl)); }
    // la pantalla
    $('pul-esc-p-modo').textContent = r.modo === 'vcv' ? 'VCV' : 'PCV';
    $('pul-esc-p-vt').textContent = r.modo === 'vcv' ? r.vt : (L ? Math.round(L.vtExh) : '—');
    $('pul-esc-p-fr').textContent = r.fr; $('pul-esc-p-peep').textContent = r.peep;
    $('pul-esc-p-flujo').textContent = r.modo === 'vcv' ? r.flujo : `Pi ${r.pinsp}`;
    $('pul-esc-p-alarma').hidden = !L?.alarmaPresion;
  }
  return { actualizar };
}
