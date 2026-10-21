// El monitor de UCI de la cabecera del shock (maqueta; en la app: js/core/monitor-uci.js). Cada canal lee el MISMO
// motor que mueve el corazón y los aparatos, muestra a muestra: la presión de la raíz aórtica (ART), la de la arteria
// pulmonar o, al enclavar, la de las venas pulmonares (PAP / PCP, como el catéter vivo: js/modules/eco/lecturas.mjs),
// la de la aurícula derecha (PVC). El ECG, la pletismografía y la capnografía son formas ilustrativas sincronizadas con
// el latido y la respiración del modelo. Con el balón, la curva punteada es la aórtica sin el volumen del balón.
const NS = 'http://www.w3.org/2000/svg';
const f1 = (n) => Math.round(n * 10) / 10;
const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));

// canales: alto en px del SVG, escala (mmHg) y color (token)
export const CANALES = [
  { k: 'ecg', rot: 'II', alto: 26, col: 'var(--accent-green)' },
  { k: 'art', rot: 'ART', alto: 48, min: 0, max: 150, marcas: [50, 100], col: 'var(--accent-red)' },
  { k: 'pap', rot: 'PAP', alto: 32, min: 0, max: 50, marcas: [25], col: 'var(--accent-yellow)' },
  { k: 'pvc', rot: 'PVC', alto: 28, min: 0, max: 25, marcas: [10], col: 'var(--accent-purple)' },
  { k: 'pleth', rot: 'Pleth', alto: 24, col: 'var(--text-dim)' },
  { k: 'co2', rot: 'CO₂', alto: 24, min: 0, max: 50, marcas: [], col: 'var(--text-muted)' },
];
const GUT = 26, SEG = 4.5;

export function crearMonitor(svg) {
  let Wd = 250, NP = 220, bufs = {}, cursor = 0, tSim = 0, tProx = 0, faseResp = 0, nLat = -1, tR = -1, ultimoV = 0;
  const visibles = new Set(CANALES.map((c) => c.k));
  let enclavado = false, conBalon = false, marcas = [];
  function montar() {
    Wd = Math.max(160, Math.round(svg.getBoundingClientRect().width || 250));
    let y = 2, h = '';
    for (const c of CANALES) {
      c.y = y; c.oculto = !visibles.has(c.k);
      if (!c.oculto) {
        h += `<g id="tr-${c.k}" class="canal">`;
        h += `<text x="2" y="${y + 9}" class="mon-rot" fill="${c.col}">${c.k === 'pap' && enclavado ? 'PCP' : c.rot}</text>`;
        if (c.marcas) for (const m of c.marcas) { const yy = yDe(c, m); h += `<line x1="${GUT}" x2="${Wd}" y1="${yy}" y2="${yy}" class="mon-rej"/>` + (yy > y + 13 ? `<text x="${GUT - 2}" y="${yy + 3}" class="mon-esc" text-anchor="end">${m}</text>` : ''); }
        if (c.k === 'art') h += `<line id="mon-l65" x1="${GUT}" x2="${Wd}" class="mon-65"/><path id="tr-art-ref" class="mon-ref"/>`;
        h += `<path id="p-${c.k}" class="mon-traza" stroke="${c.col}"/>`;
        if (c.k === 'ecg') h += `<g id="mon-chispas"></g>`;
        if (c.k === 'art') h += `<g id="mon-ciclo"></g>`;
        h += `<line x1="0" x2="${Wd}" y1="${y + c.alto + 1}" y2="${y + c.alto + 1}" class="mon-sep"/></g>`;
        y += c.alto + 4;
      }
    }
    svg.setAttribute('viewBox', `0 0 ${Wd} ${y}`);
    svg.style.height = y + 'px';
    svg.innerHTML = h + `<line id="mon-barrido" x1="0" x2="0" y1="0" y2="${y}" class="mon-barrido"/>`;
    NP = Wd - GUT; bufs = {}; for (const c of CANALES) bufs[c.k] = new Array(NP).fill(null); bufs.ref = new Array(NP).fill(null); bufs.r = new Array(NP).fill(false); bufs.ciclo = new Array(NP).fill(0);
    cursor = 0; marcas = [];
  }
  function yDe(c, v) {
    if (c.k === 'ecg') return c.y + c.alto * 0.7 - v * c.alto * 0.6;
    if (c.k === 'pleth') return c.y + c.alto * 0.92 - v * c.alto * 0.8;
    const t = Math.max(0, Math.min(1, (v - c.min) / (c.max - c.min)));
    return c.y + c.alto - t * c.alto;
  }
  // Una muestra del instante del motor (s: estado del motor; st: el de los aparatos; ctx: FR, EtCO₂, etc.)
  function muestra(cab, ctx) {
    const s = cab.m.s, p = cab.m.p, T = cab.m.periodo, tl = s.tLatido, k = Math.sqrt(T / (60 / 70));
    // ECG: P antes de la activación auricular, QRS al empezar la ventricular (pr del motor), T en la repolarización
    const pr = p.pr;
    let ecg = 0.12 * g(tl, 0.05 * k, 0.02) - 0.1 * g(tl, pr - 0.012, 0.006) + 1.0 * g(tl, pr + 0.008, 0.009) - 0.22 * g(tl, pr + 0.028, 0.008) + 0.26 * g(tl, pr + 0.27 * k, 0.05 * k);
    if (ctx.voltajeBajo) ecg *= ctx.voltajeBajo;
    const esR = s.nLatido !== nLat && tl >= pr + 0.008;
    if (esR) nLat = s.nLatido;
    const art = s.pao, ref = cab.st.vBalon > 0.5 ? s.pao - cab.st.vBalon / p.cAo : null;
    const pap = enclavado ? s.pvp : s.pap;
    const pvc = s.pad;
    // pleth: la presión arterial suavizada y retrasada (ilustrativo), normalizada a su pulso
    const u = cab.lectura?.u;
    const pas = u?.pas ?? 120, pad = u?.pad_ ?? 80;
    ultimoV += ((s.paoDist - pad) / Math.max(4, pas - pad) - ultimoV) * 0.12;
    const pleth = Math.max(0, Math.min(1.1, ultimoV)) * (ctx.amplPleth ?? 1);
    // capnografía: meseta en la EtCO₂ durante la espiración (ilustrativa)
    faseResp = (faseResp + (SEG / NP) / (60 / (ctx.fr || 14))) % 1;
    const f = faseResp;
    const co2 = f < 0.45 ? (ctx.etco2 || 35) * (f < 0.06 ? f / 0.06 : 1) * (0.92 + 0.08 * (f - 0.06) / 0.39) : f < 0.52 ? (ctx.etco2 || 35) * (1 - (f - 0.45) / 0.07) : 0;
    const ciclo = cab.st.vBalon > 20 ? 1 : 0;
    return { ecg, art, ref, pap, pvc, pleth, co2, esR, ciclo };
  }
  function empujar(v) {
    for (const c of CANALES) bufs[c.k][cursor] = c.oculto ? null : yDe(c, v[c.k]);
    const ca = CANALES[1]; bufs.ref[cursor] = v.ref != null && conBalon ? yDe(ca, v.ref) : null;
    bufs.r[cursor] = v.esR && conBalon; bufs.ciclo[cursor] = conBalon ? v.ciclo : 0;
    cursor = (cursor + 1) % NP;
    for (let j = 0; j < 6; j++) { const c = (cursor + j) % NP; for (const ch of CANALES) bufs[ch.k][c] = null; bufs.ref[c] = null; bufs.r[c] = false; bufs.ciclo[c] = 0; }
  }
  function pintar() {
    for (const c of [...CANALES, { k: 'ref' }]) {
      const el = svg.querySelector(c.k === 'ref' ? '#tr-art-ref' : '#p-' + c.k); if (!el) continue;
      const b = bufs[c.k]; let d = '', pluma = false;
      for (let x = 0; x < NP; x++) { const y = b[x]; if (y == null) { pluma = false; continue; } d += (pluma ? 'L' : 'M') + (x + GUT) + ' ' + f1(y); pluma = true; }
      el.setAttribute('d', d);
    }
    const l65 = svg.querySelector('#mon-l65'); if (l65) { const y = yDe(CANALES[1], 65); l65.setAttribute('y1', y); l65.setAttribute('y2', y); }
    // chispas de disparo (onda R) y marcas de inflado/vaciado sobre la ART
    const ch = svg.querySelector('#mon-chispas'), ci = svg.querySelector('#mon-ciclo');
    if (ch) { let h = ''; const ce = CANALES[0]; for (let x = 0; x < NP; x++) if (bufs.r[x]) h += `<path class="mon-chispa" d="M${x + GUT} ${ce.y + 2}l2.6 4.6h-5.2z"/>`; ch.innerHTML = h; }
    if (ci) { let h = ''; const ca = CANALES[1]; for (let x = 1; x < NP; x++) { if (bufs.ciclo[x] === 1 && bufs.ciclo[x - 1] === 0) h += `<path class="mon-infla" d="M${x + GUT} ${ca.y + ca.alto - 1}l2.4 -4.2h-4.8z"/>`; if (bufs.ciclo[x] === 0 && bufs.ciclo[x - 1] === 1) h += `<path class="mon-vacia" d="M${x + GUT} ${ca.y + ca.alto - 5.2}l2.4 4.2h-4.8z"/>`; } ci.innerHTML = h; }
    const br = svg.querySelector('#mon-barrido'); if (br) { br.setAttribute('x1', cursor + GUT); br.setAttribute('x2', cursor + GUT); }
  }
  // Avanza el motor dt segundos (en pasos de 0,1 ms) y va tomando muestras al ritmo del barrido
  function avanzar(cab, dt, ctx) {
    const paso = 0.0001, n = Math.round(dt / paso), cada = SEG / NP;
    conBalon = cab.ajuste.soporte === 'balon' || (cab.ajuste.soporte === 'ecmo' && cab.ajuste.venteo === 'balon');
    for (let i = 0; i < n; i++) {
      cab.paso(paso); tSim += paso;
      if (tSim >= tProx) { tProx += cada; empujar(muestra(cab, ctx)); }
    }
  }
  // Llena la pantalla de golpe (al cambiar de paciente, con «reducir movimiento» o en pausa)
  function llenar(cab, ctx) { for (let i = 0; i < NP; i++) { const n = Math.round(SEG / NP / 0.0001); for (let j = 0; j < n; j++) cab.paso(0.0001); empujar(muestra(cab, ctx)); } tProx = tSim; }
  return {
    montar, avanzar, llenar, pintar,
    ver(lista) { visibles.clear(); for (const k of lista) visibles.add(k); montar(); },
    enclavar(on) { enclavado = !!on; montar(); },
    get enclavado() { return enclavado; },
  };
}
