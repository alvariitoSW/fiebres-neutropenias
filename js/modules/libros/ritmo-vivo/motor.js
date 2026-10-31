// El motor de conducción del corazón eléctrico (maqueta b3-ritmo v2): una sola verdad de la que salen la tinta, el ECG y los latidos.
/*<motor>*/
/* ============================================================
   EL MOTOR: una sola verdad. Un grafo de conducción (nodos con su rearme, aristas con su retraso) y un motor de
   sucesos que lo recorre. De él salen la tinta que avanza por el corazón, el ECG (sumando lo que hace cada trozo de
   músculo), los latidos con su RR (la presión y el pulso) y el torniquete del nodo AV. Ningún ritmo está dibujado:
   cada ritmo es una configuración del grafo (quién dispara, qué está bloqueado, qué fármaco frena qué).
   Cifras: las del Libro Azul (retraso del nodo AV 0,12 s; His 2 m/s; Purkinje 4 m/s; potencial de acción de 300 ms,
   de -90 a +45 mV) y las de Marino (QRS ≤0,12 s; 140-250 lpm de la reentrada nodal…). El resto (velocidad del
   músculo, periodos refractarios, escala del dibujo) es fisiología general o ilustrativo, y la pantalla lo dice.
   ============================================================ */
export const MOTOR = (() => {
  const hyp = Math.hypot;
  // ---------- 1. Geometría del corte: curvas y bandas de músculo ----------
  function curva(pts, n) {
    const d = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let s = 0; s < 16; s++) {
        const t = s / 16, t2 = t * t, t3 = t2 * t;
        d.push([0, 1].map(k => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    d.push(pts[pts.length - 1]);
    const L = [0]; for (let i = 1; i < d.length; i++) L.push(L[i - 1] + hyp(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]));
    const out = []; let j = 0;
    for (let k = 0; k <= n; k++) {
      const s = L[L.length - 1] * k / n; while (j < L.length - 2 && L[j + 1] < s) j++;
      const f = (s - L[j]) / ((L[j + 1] - L[j]) || 1);
      out.push([d[j][0] + (d[j + 1][0] - d[j][0]) * f, d[j][1] + (d[j + 1][1] - d[j][1]) * f]);
    }
    return out;
  }
  // Cada banda: una cara A (endocardio, o lado derecho del tabique) y una cara B (epicardio, o lado izquierdo),
  // partidas en segmentos a lo largo y en capas a lo ancho. mueve: cuánto se mueve cada cara al contraerse.
  const BANDAS = [
    { id: 'ad', reg: 'a', seg: 9, capas: 2, mueve: [1, 0],
      A: [[95, 58], [74, 62], [57, 76], [49, 100], [51, 126], [58, 148]],
      B: [[90, 49], [64, 53], [44, 68], [35, 98], [37, 130], [45, 155]] },
    { id: 'sia', reg: 'a', seg: 6, capas: 2, mueve: [1, 1],
      A: [[121, 56], [136, 66], [143, 94], [144, 122], [143, 147]],
      B: [[133, 50], [151, 61], [157, 92], [158, 122], [159, 147]] },
    { id: 'ai', reg: 'a', seg: 14, capas: 2, mueve: [1, 0],
      A: [[168, 58], [196, 52], [232, 52], [260, 62], [272, 88], [272, 118], [266, 145]],
      B: [[162, 48], [196, 40], [238, 40], [273, 51], [288, 84], [288, 120], [281, 153]] },
    { id: 'vd', reg: 'v', seg: 15, capas: 2, mueve: [1, 0], base: 2,
      A: [[52, 168], [40, 192], [41, 218], [56, 241], [88, 257], [128, 267], [168, 273], [192, 278]],
      B: [[38, 165], [24, 192], [25, 225], [42, 253], [82, 273], [128, 285], [172, 293], [205, 301]] },
    { id: 'siv', reg: 'v', seg: 9, capas: 3, mueve: [1, 1], base: 1,
      A: [[158, 169], [164, 196], [172, 224], [182, 250], [194, 274]],
      B: [[182, 169], [189, 196], [198, 224], [209, 250], [221, 272]] },
    { id: 'vi', reg: 'v', seg: 16, capas: 3, mueve: [1, 0], base: 2,
      A: [[279, 168], [291, 196], [291, 228], [281, 256], [263, 276], [242, 286], [226, 283]],
      B: [[297, 165], [311, 196], [311, 234], [299, 266], [276, 290], [248, 304], [212, 304]] },
    { id: 'pt', reg: 'v', seg: 2, capas: 2, mueve: [0, 0],
      A: [[193, 276], [208, 274], [223, 274]],
      B: [[205, 301], [209, 302], [213, 303]] },
  ];
  const teselas = [];
  for (const b of BANDAS) {
    b.a = curva(b.A, b.seg); b.b = curva(b.B, b.seg); b.n = [];
    for (let i = 0; i <= b.seg; i++) { const dx = b.b[i][0] - b.a[i][0], dy = b.b[i][1] - b.a[i][1], l = hyp(dx, dy) || 1; b.n.push([dx / l, dy / l]); }
    b.t = [];
    for (let i = 0; i < b.seg; i++) for (let c = 0; c < b.capas; c++) {
      const f0 = c / b.capas, f1 = (c + 1) / b.capas, fm = (f0 + f1) / 2, P = (k, f) => [b.a[k][0] + (b.b[k][0] - b.a[k][0]) * f, b.a[k][1] + (b.b[k][1] - b.a[k][1]) * f];
      const cx = (P(i, fm)[0] + P(i + 1, fm)[0]) / 2, cy = (P(i, fm)[1] + P(i + 1, fm)[1]) / 2;
      const nx = (b.n[i][0] + b.n[i + 1][0]) / 2, ny = (b.n[i][1] + b.n[i + 1][1]) / 2, nl = hyp(nx, ny) || 1;
      const t = { banda: b.id, reg: b.reg, i, c, f0, f1, x: cx, y: cy, nx: nx / nl, ny: ny / nl,
        endo: c === 0 || (b.mueve[1] && c === b.capas - 1), base: i < (b.base || 0), capa: c === 0 ? 'A' : c === b.capas - 1 ? 'B' : 'M' };
      teselas.push(t); b.t.push(t);
    }
  }
  // La cicatriz del VI (para la TV): un islote que no conduce (dibujo: fisiología general)
  const CICATRIZ = { x: 252, y: 282, rx: 10, ry: 6 };
  for (const t of teselas) t.cicatriz = t.banda === 'vi' && ((t.x - CICATRIZ.x) / (CICATRIZ.rx + 4)) ** 2 + ((t.y - CICATRIZ.y) / (CICATRIZ.ry + 4)) ** 2 < 1;

  // ---------- 2. El grafo ----------
  const nodos = [], porId = {};
  const nodo = (id, x, y, tipo, extra = {}) => { const n = { id, x, y, tipo, k: nodos.length, ...extra }; nodos.push(n); porId[id] = n; return n; };
  teselas.forEach((t, i) => { t.nodo = nodo(`t${i}`, t.x, t.y, t.reg, { tesela: t }); });
  // Sistema de conducción (posiciones del dibujo). Libro Azul: nodo sinusal junto a la cava superior; nodo AV en la
  // parte proximal del tabique, entre el seno coronario y la valva septal de la tricúspide.
  const C = {
    sa: [86, 56], ia1: [124, 62], ia2: [140, 100], im1: [131, 70], im2: [146, 128], ip1: [44, 96], ip2: [50, 140],
    bm1: [128, 50], bm2: [176, 45], bm3: [226, 44], bm4: [264, 52],
    navE: [138, 148], navR: [146, 148], navL: [143, 152], navC: [150, 153],
    his1: [156, 158], his2: [164, 168], bif: [170, 174],
    rb1: [165, 190], rb2: [168, 208], rb3: [152, 220], rb4: [108, 228], rb5: [64, 232],
    lb0: [182, 179], ls1: [188, 200], la1: [212, 190], la2: [244, 200], la3: [276, 222],
    lp1: [192, 212], lp2: [202, 234], lp3: [218, 254],
    ap: [289, 160],
  };
  for (const [id, [x, y]] of Object.entries(C)) nodo(id, x, y, id === 'sa' ? 'sa' : /^(ia|im|ip|bm)/.test(id) ? 'tr' : /^nav/.test(id) ? id : id === 'ap' ? 'ap' : 'hp');
  // Purkinje: una red subendocárdica (un nudo por segmento, salvo la base) que entra en el endocardio
  const pk = [];
  for (const b of BANDAS) if (b.reg === 'v') {
    const lados = b.mueve[1] ? ['A', 'B'] : ['A'];
    for (const lado of lados) {
      let prev = null;
      for (let i = b.base || 0; i < b.seg; i++) {
        const t = b.t.find(q => q.i === i && q.capa === lado);
        const sx = lado === 'A' ? -t.nx : t.nx, sy = lado === 'A' ? -t.ny : t.ny;   // hacia la cavidad
        const ex = (lado === 'A' ? (b.a[i][0] + b.a[i + 1][0]) / 2 : (b.b[i][0] + b.b[i + 1][0]) / 2) + sx * 1.5;
        const ey = (lado === 'A' ? (b.a[i][1] + b.a[i + 1][1]) / 2 : (b.b[i][1] + b.b[i + 1][1]) / 2) + sy * 1.5;
        const n = nodo(`pk-${b.id}${lado}${i}`, ex, ey, 'pk', { tesela: null, entra: t, banda: b.id, lado });
        pk.push(n); if (prev) n.prev = prev; prev = n;
      }
    }
  }
  // Circuitos: el del flúter (alrededor del anillo tricuspídeo) y el de la cicatriz (TV). Fisiología general.
  const anillo = (pre, cx, cy, rx, ry, n, a0) => Array.from({ length: n }, (_, i) => { const a = a0 + 2 * Math.PI * i / n; return nodo(`${pre}${i}`, cx + rx * Math.cos(a), cy + ry * Math.sin(a), 'anillo', { circuito: pre }); });
  const FL = anillo('fl', 98, 140, 38, 8, 12, Math.PI);
  const CR = anillo('cr', CICATRIZ.x, CICATRIZ.y, CICATRIZ.rx, CICATRIZ.ry, 8, -Math.PI / 2);

  const ady = nodos.map(() => []);
  const arista = (a, b, ms, tipo, una = false) => { ady[a.k].push({ m: b.k, d: ms / 1000, tipo }); if (!una) ady[b.k].push({ m: a.k, d: ms / 1000, tipo }); };
  const dist = (a, b) => hyp(a.x - b.x, a.y - b.y);
  // Escala: 1 unidad del dibujo ≈ 0,7 mm (ilustrativo). His 2 m/s y Purkinje 4 m/s (Libro Azul) → ms por unidad.
  const K = { his: 0.35, pk: 0.2, mv: 0.9, ma: 0.62, tr: 0.22 };
  // Músculo: vecinos dentro de cada región; nunca a través del anillo fibroso (aurícula ↔ ventrículo)
  const tv = teselas;
  const unidas = new Set(), unir = (a, b) => {
    if (a === b || a.reg !== b.reg) return; const clave = a.nodo.k < b.nodo.k ? a.nodo.k + '-' + b.nodo.k : b.nodo.k + '-' + a.nodo.k;
    if (unidas.has(clave)) return; unidas.add(clave);
    const d = hyp(a.x - b.x, a.y - b.y); arista(a.nodo, b.nodo, d * (a.reg === 'a' ? K.ma : K.mv), a.reg === 'a' ? 'ma' : 'mv');
  };
  // Dentro de cada banda: los vecinos a lo largo, a lo ancho y en diagonal
  for (const b of BANDAS) for (const t of b.t) for (const u of b.t) if (Math.abs(u.i - t.i) <= 1 && Math.abs(u.c - t.c) <= 1) unir(t, u);
  // Entre bandas: donde se tocan (el tabique con las paredes, junto a la punta y al techo)
  for (let i = 0; i < tv.length; i++) for (let j = i + 1; j < tv.length; j++) { const a = tv[i], b = tv[j]; if (a.banda !== b.banda && hyp(a.x - b.x, a.y - b.y) < (a.reg === 'v' ? 21 : 15)) unir(a, b); }
  // La pared posterior de las aurículas no está en el corte: la unen aristas que no se dibujan (fisiología general)
  const tA = (banda, i, c) => teselas.find(t => t.banda === banda && t.i === i && t.c === c);
  const atras = (a, b, ms) => arista(a.nodo, b.nodo, ms, 'ma');
  atras(tA('ad', 0, 1), tA('sia', 0, 0), 22); atras(tA('ad', 0, 0), tA('sia', 0, 0), 24);            // techo, por detrás de la cava superior
  atras(tA('ad', 8, 0), tA('sia', 5, 0), 40); atras(tA('ad', 8, 1), tA('sia', 5, 0), 42);            // suelo de la AD (istmo)
  atras(tA('ad', 5, 0), tA('sia', 3, 0), 46);                                                       // pared posterior de la AD
  atras(tA('sia', 0, 1), tA('ai', 0, 0), 20); atras(tA('sia', 0, 1), tA('ai', 0, 1), 22);            // techo de la AI
  atras(tA('sia', 5, 1), tA('ai', 13, 0), 60); atras(tA('sia', 3, 1), tA('ai', 11, 0), 55);          // pared posterior de la AI
  // Tractos internodales y haz de Bachmann (Libro Azul los nombra; su velocidad, fisiología general)
  const N = porId;
  const cadena = (ids, k, tipo) => { for (let i = 0; i < ids.length - 1; i++) arista(N[ids[i]], N[ids[i + 1]], dist(N[ids[i]], N[ids[i + 1]]) * k, tipo); };
  cadena(['sa', 'ia1', 'ia2', 'navE'], K.tr, 'tr'); cadena(['sa', 'im1', 'im2', 'navE'], K.tr, 'tr'); cadena(['sa', 'ip1', 'ip2', 'navE'], K.tr, 'tr');
  cadena(['sa', 'bm1', 'bm2', 'bm3', 'bm4'], K.tr, 'tr');
  const aTeselas = (n, reg, r, k, tipo, una) => { for (const t of teselas) if (t.reg === reg && hyp(t.x - n.x, t.y - n.y) < r) arista(n, t.nodo, hyp(t.x - n.x, t.y - n.y) * k + 2, tipo, una); };
  aTeselas(N.sa, 'a', 16, K.ma, 'ma'); for (const id of ['ia1', 'ia2', 'im1', 'im2', 'ip1', 'ip2', 'bm1', 'bm2', 'bm3', 'bm4']) aTeselas(N[id], 'a', 13, K.ma, 'ma');
  aTeselas(N.navE, 'a', 15, K.ma, 'ma');
  // El nodo AV: dos vías (rápida y lenta) entre la entrada y la vía final común. Retraso total de la rápida 0,12 s
  // (Libro Azul); la lenta tarda el doble (fisiología general). Pueden conducir en los dos sentidos.
  arista(N.navE, N.navR, 60, 'navR'); arista(N.navR, N.navC, 60, 'navR');
  arista(N.navE, N.navL, 120, 'navL'); arista(N.navL, N.navC, 120, 'navL');
  arista(N.navC, N.his1, 6, 'his', true); cadena(['his1', 'his2', 'bif'], K.his, 'his');
  arista(N.bif, N.rb1, 12, 'rama-d'); cadena(['rb1', 'rb2', 'rb3', 'rb4', 'rb5'], K.pk, 'rama-d');
  cadena(['bif', 'lb0', 'ls1'], K.pk, 'rama-i'); cadena(['lb0', 'la1', 'la2', 'la3'], K.pk, 'rama-i'); cadena(['lb0', 'lp1', 'lp2', 'lp3'], K.pk, 'rama-i');
  for (const id of ['his1', 'his2', 'bif', 'rb1', 'rb2', 'rb3', 'rb4', 'rb5', 'lb0', 'ls1', 'la1', 'la2', 'la3', 'lp1', 'lp2', 'lp3']) N[id].rama = /^rb/.test(id) ? 'd' : /^(lb|ls|la|lp)/.test(id) ? 'i' : 'his';
  // La red de Purkinje: cadena rápida por el endocardio y unión con su tesela (4 ms, fisiología general)
  for (const n of pk) { if (n.prev) arista(n.prev, n, dist(n.prev, n) * K.pk, 'pk'); arista(n, n.entra.nodo, 4, 'pkm', true); }
  const raiz = (id, banda, lado, r = 30) => { for (const n of pk) if (n.banda === banda && n.lado === lado && dist(n, N[id]) < r) arista(N[id], n, dist(n, N[id]) * K.pk + 1, 'pk', true); };
  raiz('rb1', 'siv', 'A', 18); raiz('rb2', 'siv', 'A', 18); raiz('rb5', 'vd', 'A', 22); raiz('rb4', 'vd', 'A', 16);
  raiz('ls1', 'siv', 'B', 18); raiz('lp1', 'siv', 'B', 16); raiz('lp2', 'siv', 'B', 16); raiz('la3', 'vi', 'A', 24); raiz('lp3', 'vi', 'A', 36); raiz('la2', 'vi', 'A', 18);
  // La vía accesoria (WPW): un atajo a través del anillo, sin torniquete (sitio: fisiología general, ver la nota)
  const tAI = teselas.filter(t => t.banda === 'ai' && t.i >= 12), tVI = teselas.filter(t => t.banda === 'vi' && t.i === 0);
  for (const t of tAI) arista(t.nodo, N.ap, 4, 'apA');
  for (const t of tVI) arista(N.ap, t.nodo, 4 + (t.c ? 3 : 0), 'apV');
  // Circuito del flúter: va en un solo sentido y sale a la aurícula (no entra)
  FL.forEach((n, i) => { arista(n, FL[(i + 1) % FL.length], 16.5, 'fl', true); for (const t of teselas) if (t.banda === 'ad' || (t.banda === 'sia' && t.i > 3)) if (dist(n, t) < 20) arista(n, t.nodo, 4, 'flA', true); });
  // Circuito de la cicatriz: un solo sentido; sale al músculo por un istmo
  CR.forEach((n, i) => arista(n, CR[(i + 1) % CR.length], 44, 'cr', true));
  { const salida = CR[5]; for (const t of teselas) if (t.banda === 'vi' && !t.cicatriz && dist(salida, t) < 17) arista(salida, t.nodo, 5, 'crV', true); }

  const regiones = { a: teselas.filter(t => t.reg === 'a'), v: teselas.filter(t => t.reg === 'v') };
  const grafo = { nodos, porId, ady, teselas, BANDAS, C, FL, CR, CICATRIZ, regiones, curva };

  // ---------- 3. El motor de sucesos ----------
  function crear(opc = {}) {
    const n = nodos.length;
    const ultimo = new Float64Array(n).fill(-1e9), previo = new Float64Array(n).fill(-1e9), refr = new Float64Array(n).fill(-1e9);
    const etiqueta = new Uint8Array(n);   // 1: llegó por His-Purkinje · 2: por el músculo (secuencia anómala)
    const reg = [];                        // activaciones: { k, t, dx, dy, et, r }
    const pasoNodo = [];                   // pasos y bloqueos del torniquete y del atajo
    const latidosV = [], latidosA = [];    // agrupaciones de activación ventricular y auricular
    let heap = [];
    let semilla = opc.semilla || 11;
    const azar = () => { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; };
    const m = {   // modificadores (cada uno con su fuente en los datos de los estados)
      fcSA: 75, sa: true, navF: 1, navRet: 1, cerrojo: -1, cerrojoFin: -1, apOn: false, ramaD: true, ramaI: true,
      musV: 1, hpRet: 1, ondasF: [], musA: 1, apd: 0.30, apdExtra: 0, refrA: 0.15, fa: false, fv: false, flOn: false, crOn: false, crRefr: 0.30,
      pAmp: 1, tAmp: 1, tAncho: 1, sinMecanica: false, faTasa: 0.03, fvTasa: 0.022, navRef: null, foco: null, ocultoHis: 0.31, llenadoMalo: false, contractil: 1, pd: 68, tdp: false,
      hisCada: 0, escapeCada: 1.0, espigas: [],   // hisCada: 1 de cada N pasos se bloquea en el His (0 = apagado) · escapeCada: s entre escapes de la unión con el nodo cerrado (null = sin escape) · espigas: instantes de los disparos de un foco con espiga
    };
    const h = { push(e) { heap.push(e); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p].t <= e.t) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } },
      pop() { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let s = i; if (l < heap.length && heap[l].t < heap[s].t) s = l; if (r < heap.length && heap[r].t < heap[s].t) s = r; if (s === i) break; [heap[s], heap[i]] = [heap[i], heap[s]]; i = s; } } return top; } };
    const programar = (k, t, de) => h.push({ k, t, de });
    let proxSA = 0, proxFA = 0, proxFV = 0, proxFoco = 0, tAhora = 0, escUlt = -1e9, pasosHis = 0;   // escUlt: el último latido de escape del nodo (ver avanzar)
    const apdK = new Float64Array(n).fill(0.3);
    function apd(k, t) {   // duración del potencial de acción ventricular según el RR local (restitución); se fija al activarse
      return apdK[k];
    }
    function apdNuevo(k, t) {
      const d = t - ultimo[k], rr = Math.min(2, Math.max(0.22, d > 5 ? 0.8 : d));
      // la zona que se activa tarde repolariza antes (el gradiente que mantiene la T concordante): el QT no arrastra el QRS ancho entero
      const b = latidosV[latidosV.length - 1], retraso = b && t - b.fin < 0.05 ? Math.min(0.2, t - b.t0) : 0;
      return Math.max(0.12, (m.apd + m.apdExtra) * Math.sqrt(rr / 0.8) - 0.55 * retraso);
    }
    function refractario(nd, t) {
      switch (nd.tipo) {
        case 'a': return m.fa ? 0.075 + 0.05 * azar() : m.refrA;   // en la FA, refractariedad desigual (fisiología general)
        case 'v': return m.fv ? 0.09 + 0.06 * azar() : m.tdp ? 0.2 : Math.max(0.25, 0.9 * apd(nd.k, t));   // el periodo refractario efectivo ≈ fases 0-2 y parte de la 3 (Libro Azul)
        // en la FA, la conducción oculta hace desigual el rearme del nodo (fisiología general): el RR es irregular
        case 'navR': return (m.navRef ? m.navRef.R : 0.32) * m.navF * (m.fa ? 0.5 + azar() : 1); case 'navL': return (m.navRef ? m.navRef.L : 0.22) * m.navF * (m.fa ? 0.5 + azar() : 1);
        case 'navC': return (m.navRef ? m.navRef.C : 0.24) * m.navF * (m.fa ? 0.5 + azar() : 1); case 'navE': return m.fa ? 0.11 : 0.15;
        case 'hp': return 0.26; case 'pk': return 0.25; case 'ap': return 0.25; case 'tr': return 0.20; case 'sa': return 0.2;
        case 'anillo': return nd.circuito === 'cr' ? m.crRefr : 0.17;
      }
      return 0.2;
    }
    const VM = 0.42;   // velocidad base del músculo ventricular (fisiología general): con 1, el bloqueo de rama y la TV daban QRS de 0,2 s
    function factor(nd, tipo) {
      if (tipo === 'mv' || tipo === 'pkm' || tipo === 'apV' || tipo === 'crV') return VM * m.musV * (m.fv ? 1.0 + 0.8 * azar() : 1);
      if (tipo === 'ma' || tipo === 'flA') return m.musA * (m.fa ? 1.0 + 0.8 * azar() : 1);
      if (tipo === 'navR' || tipo === 'navL') return m.navRet;
      if (tipo === 'his' || tipo === 'rama-d' || tipo === 'rama-i' || tipo === 'pk') return m.hpRet;   // el potasio alto enlentece también el His-Purkinje
      return 1;
    }
    function bloqueado(nd, t) {
      if ((nd.tipo === 'navR' || nd.tipo === 'navL' || nd.tipo === 'navC') && t >= m.cerrojo && t < m.cerrojoFin) return true;
      if (nd.tipo === 'ap' && !m.apOn) return true;
      if (nd.rama === 'd' && !m.ramaD) return true;
      if (nd.rama === 'i' && !m.ramaI) return true;
      if (nd.tipo === 'anillo' && nd.circuito === 'fl' && !m.flOn) return true;
      if (nd.tipo === 'anillo' && nd.circuito === 'cr' && !m.crOn) return true;
      if (m.crOn && ((nd.tesela && nd.tesela.cicatriz) || (nd.tipo === 'pk' && nd.entra.cicatriz))) return true;   // la cicatriz no conduce (solo en el corazón de la TV)
      return false;
    }
    function activar(k, t, de) {
      const nd = nodos[k];
      if (nd.tipo === 'sa' && de != null) proxSA = t + 60 / m.fcSA;   // el reloj sinusal se reinicia si lo despolarizan
      if (nd.tipo === 'v') apdK[k] = apdNuevo(k, t);
      previo[k] = ultimo[k]; ultimo[k] = t; refr[k] = t + refractario(nd, t);
      let dx = 0, dy = 0, et = 2;
      if (de != null) {
        const o = nodos[de];
        if (o.tipo === 'pk' && nd.tipo === 'v') { const ts = nd.tesela; const s = o.lado === 'A' ? 1 : -1; dx = ts.nx * s; dy = ts.ny * s; et = 1; }
        else { const l = hyp(nd.x - o.x, nd.y - o.y) || 1; dx = (nd.x - o.x) / l; dy = (nd.y - o.y) / l; et = etiqueta[de] || 2; }
      }
      etiqueta[k] = (nd.tipo === 'hp' || nd.tipo === 'pk' || nd.tipo.startsWith('nav')) ? 1 : nd.tipo === 'v' ? et : 0;
      if (nd.tipo === 'v' || nd.tipo === 'a') {
        const r = nd.tipo === 'v' ? t + apd(k, t) * (nd.tesela.capa === 'A' ? 1.04 : nd.tesela.capa === 'B' ? 0.96 : 1) : t + 0.15;
        reg.push({ k, t, dx, dy, et: etiqueta[k], r, choque: de === -1 });
        agrupar(nd.tipo === 'v' ? latidosV : latidosA, nd.tipo, t, r, de === -1, k);
      } else reg.push({ k, t, dx: 0, dy: 0, et: 0, r: t, de });
      if (nd.tipo === 'navR' || nd.tipo === 'navL' || nd.tipo === 'ap') pasoNodo.push({ k, t, paso: true, de });
      // En la TV, el frente entra hacia atrás en el His-Purkinje (conducción oculta, fisiología general): los impulsos
      // sinusales se quedan en el His casi siempre y salen ondas P sueltas (disociación AV); a veces, un latido de fusión.
      if (nd.tipo === 'anillo' && nd.circuito === 'cr' && nd.id === 'cr5') for (const id of ['his1', 'his2', 'bif', 'rb1', 'lb0']) refr[N[id].k] = Math.max(refr[N[id].k], t + m.ocultoHis);
      for (const e of ady[k]) if (e.m !== de) programar(e.m, t + e.d * factor(nodos[e.m], e.tipo), k);
    }
    // Un latido es una onda: empieza otro si hay un silencio de más de 50 ms o si vuelve a activarse un trozo que esta
    // onda ya activó (en la FA con una vía accesoria, las ondas se encadenan sin silencio entre ellas)
    function agrupar(lista, reg2, t, r, choque, k) {
      const total = reg2 === 'v' ? regiones.v.length : regiones.a.length;
      let b = lista[lista.length - 1];
      if (!b || t - b.fin > 0.05 || choque !== b.choque || (k != null && b.vistos.has(k))) { b = { t0: t, fin: t, n: 0, r0: r, r1: r, total, choque, vistos: new Set() }; lista.push(b); if (lista.length > 90) lista.shift(); }
      if (k != null) b.vistos.add(k);
      b.fin = t; b.n++; b.r1 = Math.max(b.r1, r); b.r0 = Math.min(b.r0, r);
    }
    function avanzar(hasta) {
      for (;;) {
        // generadores: el reloj sinusal y el desorden de la FA y de la FV
        let tg = Infinity;
        if (m.sa) tg = Math.min(tg, proxSA);
        if (m.fa) tg = Math.min(tg, proxFA);
        if (m.fv) tg = Math.min(tg, proxFV);
        if (m.foco) tg = Math.min(tg, proxFoco);
        // El escape de la unión: con el nodo AV cerrado (adenosina), si pasa m.escapeCada (1,0 s por defecto = 60/min)
        // sin QRS, el His late solo (fisiología general: la unión AV escapa a 40-60/min; 45/min = 1,33 s). Sin él, el cerrojo
        // dejaba el ventrículo sin ritmo; con escapeCada = null se apaga (el escape lo pone entonces un foco ventricular).
        let proxEsc = Infinity;
        if (m.escapeCada != null && m.cerrojoFin > m.cerrojo && m.cerrojo >= 0) { const E = m.escapeCada; const u = latidosV.length ? latidosV[latidosV.length - 1].t0 : -1e9; proxEsc = Math.max(m.cerrojo, u + E, escUlt + E); if (proxEsc < m.cerrojoFin) tg = Math.min(tg, proxEsc); else proxEsc = Infinity; }
        const te = heap.length ? heap[0].t : Infinity;
        const t = Math.min(tg, te);
        if (t > hasta) break;
        if (tg <= te) {
          if (m.sa && proxSA === tg) { programar(N.sa.k, tg, null); proxSA = tg + 60 / m.fcSA; }
          if (m.fa && proxFA === tg) { const ts = regiones.a[Math.floor(azar() * regiones.a.length)]; programar(ts.nodo.k, tg, null); proxFA = tg + m.faTasa * (0.5 + azar()); }
          if (m.foco && proxFoco === tg) { const k = m.foco.sitio(tg, azar); if (k != null) { programar(k, tg, null); if (m.foco.espiga) { m.espigas.push(tg); if (m.espigas.length > 80) m.espigas.shift(); } } proxFoco = tg + m.foco.cada * (1 + (m.foco.jitter || 0) * (azar() - 0.5) * 2); }
          if (proxEsc === tg) { programar(N.his1.k, tg, null); escUlt = tg; }
          if (m.fv && proxFV === tg) { const ts = regiones.v[Math.floor(azar() * regiones.v.length)]; programar(ts.nodo.k, tg, null); proxFV = tg + m.fvTasa * (0.5 + azar()); }
          continue;
        }
        const e = h.pop(); const nd = nodos[e.k];
        if (bloqueado(nd, e.t) || e.t < refr[e.k] - 1e-9) {
          if (nd.tipo === 'navR' || nd.tipo === 'navL' || nd.tipo === 'ap') { const ult = pasoNodo[pasoNodo.length - 1]; if (!ult || ult.k !== e.k || Math.abs(ult.t - e.t) > 0.02) pasoNodo.push({ k: e.k, t: e.t, paso: false, de: e.de, cerrojo: bloqueado(nd, e.t) && nd.tipo !== 'ap' }); }
          continue;
        }
        // Mobitz II: el His bloquea 1 de cada hisCada impulsos que le llegan del nodo (el PR de los conducidos no cambia)
        if (m.hisCada > 0 && e.k === N.his1.k && e.de != null && nodos[e.de].tipo === 'navC' && ++pasosHis % m.hisCada === 0) { pasoNodo.push({ k: e.k, t: e.t, paso: false, his: true }); continue; }
        // Con el nodo muy deprimido (navF > 2,5) el impulso lento no vuelve hacia la aurícula: sin eco (la P extra que reiniciaba el reloj sinusal)
        if (m.navF > 2.5 && nd.tipo === 'navE' && e.de != null && (nodos[e.de].tipo === 'navR' || nodos[e.de].tipo === 'navL')) continue;
        activar(e.k, e.t, e.de);
      }
      tAhora = hasta;
      const viejo = hasta - 5.5;
      if (reg.length > 12000 || (reg.length && reg[0].t < viejo)) { let i = 0; while (i < reg.length && reg[i].t < viejo) i++; reg.splice(0, i); }
      if (pasoNodo.length > 300) pasoNodo.splice(0, pasoNodo.length - 300);
    }
    // Un choque: todo el tejido (y los circuitos) se despolariza a la vez
    function choque(t) {
      for (const nd of nodos) if (nd.tipo !== 'sa') { if (t >= refr[nd.k] - 0.05 || nd.tipo === 'v' || nd.tipo === 'a' || nd.tipo === 'anillo') activarForzado(nd.k, t); }
      heap = heap.filter(e => e.t < t);
    }
    function activarForzado(k, t) {
      const nd = nodos[k]; previo[k] = ultimo[k]; ultimo[k] = t; refr[k] = t + Math.max(0.25, refractario(nd, t));
      if (nd.tipo === 'v' || nd.tipo === 'a') { reg.push({ k, t, dx: 0, dy: 0, et: 0, r: t + (nd.tipo === 'v' ? 0.28 : 0.15), choque: true }); }
    }
    // ---- La mecánica: qué latidos mueven sangre (la presión, el pulso y el déficit; Fig. 19.4) ----
    const efectivo = b => !b.choque && b.n >= 0.6 * b.total && b.fin - b.t0 < 0.45;   // los anchos (vía accesoria, músculo a músculo) también
    function latidosMecanicos(desde, hasta) {
      const out = []; let prev = null, rrPrev = 0.8;
      for (const b of latidosV) {
        if (!efectivo(b)) continue;
        const rr = prev ? b.t0 - prev.t0 : 1.0; prev = b; const salto = rr / rrPrev; rrPrev = rr;
        if (b.t0 < desde - 1.2 || b.t0 > hasta) continue;
        const a = m.fa ? null : latidosA.find(x => x.n >= 0.6 * x.total && x.fin - x.t0 < 0.16 && x.t0 > b.t0 - 0.32 && x.t0 < b.t0 - 0.05);
        // en la FA las ondas f no contraen la aurícula: no hay patada (p. 21)
        // llenado: un latido que llega pronto se llena poco (Fig. 19.4); la patada auricular, ~25 % del llenado, solo
        // se nota si el llenado ya está comprometido (p. 21). Magnitudes: ilustrativas.
        // y si llega mucho antes que el anterior (dos latidos muy juntos, como en la FA), se llena mucho menos
        const llen = Math.sqrt(Math.min(1, Math.max(0, (rr - 0.2) / 0.6))) * Math.min(1, Math.max(0.12, (salto - 0.42) / 0.42));
        const patada = a ? 1 : 1 - 0.25 * (m.llenadoMalo ? 1 : 0.22);
        out.push({ t: b.t0, rr, amp: m.sinMecanica ? 0 : 52 * m.contractil * llen * patada, patada: !!a });
      }
      return out;
    }
    const pulso = tau => (tau < 0 ? 0 : tau < 0.1 ? Math.sin(tau / 0.1 * Math.PI / 2) : Math.exp(-(tau - 0.1) / 0.24));
    function presion(t, lat) {
      // sin latidos que muevan sangre, la presión cae (parada, AESP): ilustrativo
      let u = -1e9, up = -1e9; for (const b of lat) if (b.t <= t && b.amp > 0 && b.t > u) { up = u; u = b.t; }
      const caida = d => Math.exp(-Math.max(0, d - 1.4) / 1.2), gPrev = caida(u - up), g = caida(t - u) * (gPrev + (1 - gPrev) * Math.min(1, (t - u) / 0.4));
      let p = 8 + (m.pd - 8) * g;
      for (const b of lat) { const tau = t - b.t - 0.07; if (tau < 0 || tau > 1.6) continue; p += b.amp * pulso(tau); }
      return p;
    }
    function contraccion(t, lat) {   // 0..1: cuánto se engruesan las paredes ahora
      let c = 0; for (const b of lat) { const tau = t - b.t - 0.05; if (tau > 0 && tau < 0.34) c = Math.max(c, Math.sin(Math.PI * tau / 0.34) * Math.min(1, b.amp / 40)); } return c;
    }
    function contraccionA(t) {
      let c = 0; for (const a of latidosA) { if (!(a.n >= 0.6 * a.total && a.fin - a.t0 < 0.16)) continue; const tau = t - a.t0 - 0.04; if (tau > 0 && tau < 0.2) c = Math.max(c, Math.sin(Math.PI * tau / 0.2)); } return c;
    }
    function disparar(id, t) { programar(typeof id === 'number' ? id : N[id].k, t, null); }
    // Bloqueo unidireccional al arrancar un circuito: el nodo anterior queda refractario
    function arrancarCircuito(lista, t) { const ult = lista[lista.length - 1]; refr[ult.k] = t + 0.1; programar(lista[0].k, t, null); }
    function reiniciarSA(t) { proxSA = t; }
    // Las ondas de la aurícula que no son una P: dientes de sierra del flúter y ondas f de la FA (se dibujan en el ECG; fisiología general)
    function ponerOndaF(tipo, t) { m.ondasF.push({ tipo, t0: t, t1: 1e9 }); }
    function quitarOndaF(t) { for (const o of m.ondasF) if (o.t1 > t) o.t1 = t; }
    function apdActual() { return (m.apd + m.apdExtra); }
    return { m, reg, pasoNodo, latidosV, latidosA, ultimo, previo, refr, apdK, avanzar, latidosMecanicos, presion, contraccion, contraccionA, efectivo, choque, disparar, arrancarCircuito, reiniciarSA, ponerOndaF, quitarOndaF, apd, apdActual,
      get ahora() { return tAhora; }, set proxFA(v) { proxFA = v; }, set proxFV(v) { proxFV = v; }, set proxFoco(v) { proxFoco = v; }, azar, grafo };
  }

  // ---------- 4. El ECG: la suma de lo que hace cada trozo de músculo ----------
  // Cada tesela, al despolarizarse, aporta (eje de la derivación · dirección del frente) durante unos ms; al
  // repolarizarse, lo mismo con el signo de su secuencia (si llegó por His-Purkinje, onda T concordante; si llegó por
  // el músculo, discordante). Forma: fisiología general; amplitudes: ilustrativas, ajustadas a un ECG normal.
  const DERIV = {
    II: { x: 0.5, y: 0.866, st: t => (t.y > 225 ? 0.25 : 0) },
    V2: { x: -0.42, y: -0.18, st: t => ((t.banda === 'siv' || (t.banda === 'vi' && t.i >= 9) || (t.banda === 'vd' && t.i >= 8)) ? 1 : 0) },
    V3: { x: -0.1, y: 0.25, st: t => ((t.banda === 'siv' || (t.banda === 'vi' && t.i >= 8)) ? 1 : 0) },
  };
  const AMP = { q: 0.04, p: 0.012, t: 0.0075, sq: 0.006, sp: 0.012, stS: 0.038 };
  function voltaje(mo, t, der = 'II', extra = {}) {
    const L = DERIV[der] || DERIV.II, R = mo.reg, m = mo.m;
    let v = 0;
    for (let i = R.length - 1; i >= 0; i--) {
      const a = R[i]; if (a.t > t + 0.06) continue; if (a.r < t - 0.25 && a.t < t - 0.7) break;
      const nd = nodos[a.k]; if (a.choque) continue;
      const w = L.x * a.dx + L.y * a.dy;
      if (nd.tipo === 'v') {
        // un frente que avanza despacio (por el músculo) tarda más en cruzar cada trozo: su aporte dura más
        const sq = AMP.sq * (a.et === 1 ? 1 : 2.1) * (m.musV > 1 ? m.musV : 1), dq = t - a.t;
        if (dq > -4 * sq && dq < 4 * sq) v += AMP.q * w * Math.exp(-(dq * dq) / (2 * sq * sq));
        const sT = 0.042 * m.tAncho, dr = t - (a.r - 0.075); if (Math.abs(dr) < 3.5 * sT) v += AMP.t * m.tAmp * w * (a.et === 1 ? 1 : -1.25) * Math.exp(-(dr * dr) / (2 * sT * sT));
      } else if (nd.tipo === 'a') {
        const dp = t - a.t; if (Math.abs(dp) < 0.04) v += AMP.p * m.pAmp * w * Math.exp(-(dp * dp) / (2 * AMP.sp * AMP.sp));
      }
    }
    // Ondas F del flúter (diente de sierra: bajada lenta y subida brusca, una por vuelta del circuito, 0,198 s) y ondas f de la FA
    // (ondulación irregular, 350-450/min): amplitudes ilustrativas, rotuladas en la pantalla
    for (const o of m.ondasF) {
      if (t < o.t0 || t > o.t1) continue;
      const ent = Math.min(1, (t - o.t0) / 0.15);
      if (o.tipo === 'sierra') { const f = ((t - o.t0) / 0.198) % 1; v += ent * 0.4 * (f < 0.86 ? 0.5 - f / 0.86 : -0.5 + (f - 0.86) / 0.14); }
      else v += ent * 0.1 * (0.55 + 0.45 * Math.sin(t * 2.1)) * (Math.sin(t * 41) + 0.6 * Math.sin(t * 57 + 1) + 0.4 * Math.sin(t * 29 + 2)) / 1.6;
    }
    // Lesión (ST elevado): una corriente de lesión entre el punto J y la onda T de cada latido (ilustrativo)
    if (extra.lesion) for (const b of mo.latidosV) {
      if (b.n < 0.5 * b.total) continue;
      const j = b.fin + 0.012, tf = b.r1 - 0.05; if (t < b.t0 || t > tf + 0.08) continue;
      const sube = Math.min(1, Math.max(0, (t - (b.fin - 0.02)) / 0.03)), baja = Math.min(1, Math.max(0, (tf + 0.08 - t) / 0.12));
      v += extra.lesion[der] * sube * baja * 0.1;   // en mV: 1 mm = 0,1 mV
    }
    return v;
  }
  return { grafo, crear, voltaje, DERIV, AMP };
})();
/*</motor>*/
