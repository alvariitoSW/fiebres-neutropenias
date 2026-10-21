// El paciente en grabado (maqueta b3-shock v2): el corazón en corte de cuatro cámaras, que se mueve con el MISMO motor
// (volúmenes de las cuatro cámaras, presiones a los lados del tabique, derrame del saco, válvulas, edema), con la VCI y
// la arteriola (la resistencia del motor). Y el «Recorrido» de cada aparato en el torso, de frente.
// En la app, esta capa es la Circulación viva (el corazón 3D y la eco); aquí, su sustituto en grabado.
const f1 = (n) => Math.round(n * 10) / 10;
const NS = 'http://www.w3.org/2000/svg';
const cl = (x, a, b) => Math.max(a, Math.min(b, x));
// curva cerrada suave por puntos (Catmull-Rom → Bézier)
function cerrada(p) {
  const n = p.length; let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + 'Z';
}
function abierta(p) {
  let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}
const esc = (p, c, k) => p.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]);
const des = (p, c, k) => p.map(([x, y]) => { const dx = x - c[0], dy = y - c[1], l = Math.hypot(dx, dy) || 1; return [x + dx / l * k, y + dy / l * k]; });

export function montarCorazon(svg) {
  svg.setAttribute('viewBox', '0 0 360 250');
  svg.innerHTML = '<g></g>';
  return dibujoCorazon(svg.firstChild, { arteriola: true });
}
// El corazón dibujado dentro de un grupo (lo usan la capa del paciente y el circuito del ECMO)
export function dibujoCorazon(grupo, { arteriola = true, pre = 'cor' } = {}) {
  grupo.innerHTML = `<g class="grabado">
    <g id="cor-pulmon"></g>
    <path id="cor-vci-l" class="vena-luz"/><path id="cor-vci" class="vena-borde"/>
    <path id="cor-saco" class="saco"/>
    <g id="cor-cav"></g>
    ${arteriola ? `<g id="cor-arteriola"><circle cx="318" cy="62" r="26" class="lupa-aro"/><circle id="cor-art-pared" cx="318" cy="62" r="21" class="art-pared"/><circle id="cor-art-luz" cx="318" cy="62" r="13" class="art-luz"/></g>
    <text x="318" y="102" class="rot-g" text-anchor="middle">arteriola</text>
    <text x="318" y="112" class="rot-g dim" text-anchor="middle">(la resistencia)</text>
    <text x="72" y="214" class="rot-g">VCI</text>` : ''}
  </g>`;
  if (pre !== 'cor') grupo.innerHTML = grupo.innerHTML.replace(/id="cor-/g, `id="${pre}-`);
  const $ = (id) => grupo.querySelector('#' + id.replace(/^cor-/, pre + '-'));
  const st = { fvi: 1, fvd: 1, fad: 1, fai: 1, bulto: 0, peri: 0, mit: 1, tri: 1 };
  function pintar(s, L, rsis, quieto) {
    // tamaños relativos a un corazón normal (volúmenes del motor; cómo se dibujan, ilustrativo)
    const tgt = { fvi: Math.cbrt(s.vvi / 120), fvd: Math.cbrt(s.vvd / 130), fad: Math.cbrt(s.vad / 55), fai: Math.cbrt(s.vai / 55) };
    for (const k in tgt) st[k] = quieto ? tgt[k] : st[k] + (tgt[k] - st[k]) * 0.35;
    // el tabique se abomba hacia el lado de menos presión (fisiología general)
    const bulto = cl((s.pvd - s.pvi) * 0.6, -10, 14);
    st.bulto = quieto ? bulto : st.bulto + (bulto - st.bulto) * 0.3;
    const fv = cl(st.fvi, 0.72, 1.4), fr = cl(st.fvd, 0.72, 1.5), fa = cl(st.fad, 0.75, 1.45), fi = cl(st.fai, 0.75, 1.5), bt = st.bulto;
    // VI: del anillo mitral (lado del tabique) por el tabique a la punta y por la pared lateral
    const viC = [[190, 108], [184 + bt * 0.6, 148], [186 + bt * 0.3, 190], [196, 210 + 14 * (fv - 1)], [222 + 22 * (fv - 1), 192 + 6 * (fv - 1)], [240 + 26 * (fv - 1), 150], [248 + 12 * (fv - 1), 112]];
    // VD: del anillo tricuspídeo (tabique) por el tabique a su punta y por la pared libre
    const vdC = [[154, 108], [168 + bt * 0.6, 148], [176 + bt * 0.3, 186], [158 - 10 * (fr - 1), 194 + 6 * (fr - 1)], [118 - 26 * (fr - 1), 166], [98 - 22 * (fr - 1), 132], [98 - 10 * (fr - 1), 112]];
    const sepIzq = [[154, 108], [168 + bt * 0.6, 148], [176 + bt * 0.3, 186]], sepDer = [[190, 108], [184 + bt * 0.6, 148], [186 + bt * 0.3, 190]];
    const ad = esc([[98, 108], [86, 86], [96, 56], [126, 48], [152, 62], [158, 92], [154, 108]], [124, 80], fa);
    const ai = esc([[190, 108], [192, 78], [210, 56], [238, 54], [256, 76], [250, 108]], [222, 82], fi);
    const liq = s.liquidoPeri || 0;
    st.peri = quieto ? liq : st.peri + (liq - st.peri) * 0.2;
    // miocardio: la pared del VI (gruesa), la del VD (fina) y el tabique
    const viExt = des(viC, [214, 156], 10), vdExt = des(vdC, [132, 150], 4);
    const exterior = [[80, 112], [82, 60], [124, 36], [176, 46], [226, 40], [266, 66], [262, 112], [256 + 18 * (fv - 1), 160], [228 + 16 * (fv - 1), 214], [194, 228 + 10 * (fv - 1)], [160, 210], [104 - 26 * (fr - 1), 176], [86 - 20 * (fr - 1), 138]];
    $('cor-saco').setAttribute('d', cerrada(des(exterior, [172, 136], 2 + st.peri / 20)));
    $('cor-saco').style.setProperty('--derrame', String(cl(st.peri / 300, 0, 1)));
    st.mit = quieto ? 1 : st.mit + ((s.vMit ? 1 : 0) - st.mit) * 0.4;
    st.tri = quieto ? 1 : st.tri + ((s.vTri ? 1 : 0) - st.tri) * 0.4;
    const valvas = (a, b, f) => `M${a[0]} ${a[1]}l${f1(6 + 6 * f)} ${f1(6 + 14 * f)}M${b[0]} ${b[1]}l${f1(-6 - 6 * f)} ${f1(6 + 14 * f)}`;
    // fibras del miocardio (grabado): rayas cortas de la cara interna a la externa
    let fib = '';
    for (const [c, e] of [[viC, viExt], [vdC, vdExt]]) for (let i = 1; i < c.length - 1; i++) { const a = c[i], b = e[i]; for (const t of [0.25, 0.6]) { const q = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; fib += `M${f1(q[0])} ${f1(q[1])}l${f1((b[0] - a[0]) * 0.25)} ${f1((b[1] - a[1]) * 0.25)}`; } }
    $('cor-cav').innerHTML = `<path class="mio grueso" d="${cerrada(viExt)}"/><path class="mio" d="${cerrada(vdExt)}"/>`
      + `<path class="mio grueso" d="${cerrada([...sepIzq, ...sepDer.slice().reverse()])}"/><path class="fibras-g" d="${fib}"/>`
      + `<path id="cor-ad" class="cav ven" d="${cerrada(ad)}"/><path id="cor-ai" class="cav art" d="${cerrada(ai)}"/>`
      + `<path id="cor-vd" class="cav ven" d="${abierta(vdC)}Z"/><path id="cor-vi" class="cav art" d="${abierta(viC)}Z"/>`
      + `<path id="cor-tabique" class="tabique" d="${abierta(sepDer)}"/>`
      + `<path class="valva" d="${valvas([100, 110], [152, 108], st.tri)}"/><path class="valva" d="${valvas([192, 108], [246, 112], st.mit)}"/>`
      + (arteriola ? `<text x="${f1(118 - 10 * (fa - 1))}" y="80" class="rot-g">AD</text><text x="216" y="84" class="rot-g">AI</text><text x="${f1(134 - 14 * (fr - 1))}" y="150" class="rot-g">VD</text><text x="${f1(212 + 10 * (fv - 1))}" y="156" class="rot-g">VI</text>` : '');
    // VCI: sube por la izquierda y entra en la AD por abajo; su diámetro sigue a la PVC (ilustrativo)
    const pvc = L?.u?.pvc ?? 4, d = cl(5 + pvc * 0.65, 4, 15);
    const via = abierta([[52, 250], [58, 200], [70, 140], [90, 96]]);
    $('cor-vci-l').setAttribute('d', via); $('cor-vci-l').setAttribute('stroke-width', f1(d));
    $('cor-vci').setAttribute('d', via); $('cor-vci').setAttribute('stroke-width', f1(d + 2));
    // arteriola: radio con la resistencia efectiva (Poiseuille: r ∝ R^-1/4; fisiología general)
    const r = cl(13 * Math.pow(1488 / Math.max(300, rsis), 0.25), 6, 19);
    if (arteriola) { $('cor-art-luz').setAttribute('r', f1(r)); $('cor-art-pared').setAttribute('r', f1(Math.min(23, r + 6 + (19 - r) * 0.25))); }
    // pulmones detrás, con las gotas del edema que calcula el motor
    const ed = L?.u?.vEdema || 0, n = Math.min(40, Math.round(ed / 25));
    let gotas = ''; for (let j = 0; j < n; j++) { const izq = j % 2 === 0, x = izq ? 22 + (j * 17) % 34 : 290 + (j * 13) % 26, y = 140 + (j * 23) % 80; gotas += `<circle cx="${x}" cy="${y}" r="1.6" class="gota"/>`; }
    $('cor-pulmon').innerHTML = `<path class="pulmon" d="M46 128 C24 136 14 176 18 232 C30 242 46 240 54 228 C60 196 60 160 46 128Z"/><path class="pulmon" d="M296 132 C318 140 328 180 324 232 C312 242 296 240 288 228 C282 196 282 162 296 132Z"/>${gotas}`;
  }
  return { pintar };
}

// ---------------------------------------------------------------- el recorrido: por dónde entra cada aparato
const AO = [[176, 92], [170, 64], [178, 44], [196, 40], [208, 52], [208, 80], [206, 130], [204, 180], [202, 205]];
const IL_D = [[202, 205], [190, 224], [176, 248]], IL_I = [[202, 205], [214, 224], [226, 248]];
const VCI = [[160, 104], [166, 140], [172, 180], [178, 205], [172, 224], [166, 248]];
export const RUTAS = {
  balon: { txt: 'Arteria femoral → ilíaca → aorta descendente; la punta, justo por debajo de la subclavia izquierda (p. 45).', pts: [[226, 248], [214, 224], [202, 205], [204, 180], [206, 130], [208, 82]], clase: 'ruta-art' },
  impella: { txt: 'Arteria femoral → aorta → cayado → aorta ascendente → a través de la válvula aórtica, hasta el VI (p. 47).', pts: [[226, 248], [214, 224], [202, 205], [204, 180], [206, 130], [208, 80], [208, 52], [196, 40], [178, 44], [170, 64], [174, 92], [168, 112]], clase: 'ruta-art' },
  ecmo: { txt: 'Cánula venosa: vena femoral → cava inferior, hasta cerca de la AD. Cánula arterial: arteria femoral; la sangre sube por la aorta al revés (p. 48).', pts: [[166, 248], [172, 224], [178, 205], [172, 180], [166, 140], [162, 112]], pts2: [[226, 248], [218, 232]], clase: 'ruta-ven' },
};
export function montarRecorrido(svg) {
  svg.setAttribute('viewBox', '0 0 360 250');
  const ao = abierta(AO), ild = abierta(IL_D), ili = abierta(IL_I), vci = abierta(VCI);
  const troncos = abierta([[182, 44], [176, 22]]) + abierta([[192, 40], [190, 16]]) + abierta([[202, 44], [212, 20]]);
  svg.innerHTML = `<g class="grabado">
    <path class="torso" d="M120 10 C150 4 250 4 280 10 C300 60 296 140 290 196 C286 226 276 246 270 262 M120 10 C100 60 104 140 110 196 C114 226 124 246 130 262"/>
    <path class="clavicula" d="M134 18 C160 26 180 24 196 20 M266 18 C240 26 220 24 204 20"/>
    <path class="pelvis" d="M138 220 C160 236 240 236 262 220"/>
    <path class="pulmon" d="M150 40 C128 52 124 110 130 150 C142 158 158 152 162 140 C164 100 162 64 150 40Z"/>
    <path class="pulmon" d="M250 40 C272 52 276 110 270 150 C258 158 242 152 238 140 C236 100 238 64 250 40Z"/>
    <path class="cav ven" d="M154 96 C146 100 146 118 156 122 C166 124 170 110 166 100Z"/>
    <path class="cav art" d="M170 104 C196 100 214 124 196 150 C184 150 168 130 170 104Z"/>
    <path class="vaso-luz art" d="${ao}"/><path class="vaso-luz art fino" d="${ild}"/><path class="vaso-luz art fino" d="${ili}"/><path class="vaso-luz art fino" d="${troncos}"/>
    <path class="vaso-luz ven" d="${vci}"/>
    <path id="rec-ruta" class="ruta"/><path id="rec-ruta2" class="ruta"/><circle id="rec-punta" r="3.4" class="punta"/>
    <text x="226" y="244" class="rot-g" text-anchor="end">femoral</text>
  </g>`;
  let tipo = 'balon', t = 0;
  const ruta = svg.querySelector('#rec-ruta'), ruta2 = svg.querySelector('#rec-ruta2'), punta = svg.querySelector('#rec-punta');
  function poner(k) {
    tipo = k; const R = RUTAS[k];
    ruta.setAttribute('d', abierta(R.pts)); ruta.setAttribute('class', 'ruta ' + R.clase);
    ruta2.setAttribute('d', R.pts2 ? abierta(R.pts2) : ''); ruta2.setAttribute('class', 'ruta ruta-art');
  }
  poner('balon');
  return {
    poner,
    tick(dt, quieto) {
      // la punta recorre la ruta (la inserción) y se queda en su sitio un momento
      t = quieto ? 1 : (t + dt / 3.2) % 1.35;
      const L = ruta.getTotalLength(), x = Math.min(1, t) * L, p = ruta.getPointAtLength(x);
      punta.setAttribute('cx', f1(p.x)); punta.setAttribute('cy', f1(p.y));
      ruta.style.strokeDasharray = `${f1(x)} ${f1(L)}`;
    },
    get texto() { return RUTAS[tipo].txt; },
  };
}
