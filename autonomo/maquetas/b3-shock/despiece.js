// El «Despiece» de cada aparato (maqueta b3-shock v2): el aparato solo, sobre su banco, desmontado en sus conjuntos,
// con la leyenda numerada que ilumina cada pieza (una sola en oro). Isométrico técnico con la pieza propia
// comun/dibujo-iso.js. Lo que la fuente no da no se dibuja (p. ej. el sensor de presión del Impella, la cánula de
// reperfusión del ECMO, el marcador radioopaco del balón).
import * as I from '../comun/dibujo-iso.js';
import { consola, W, H } from './aparatos.js';
const f1 = I.f1;
const coma = (x, d = 0) => (+x).toFixed(d).replace('.', ',');

// El banco: placa sobre cuatro patas, ranura perimetral, tornillos en las esquinas, placa de rótulo y soportes en «U»
function banco(P, lz, plan, soportes, zEje) {
  let s = `<path class="iso-halo" d="${I.camino(I.envolvente(I.anilloRedondeado(plan, 4).map(([a, b]) => P.iso([a, b, -5]))), true)}"/>`;
  const pies = [[plan.x + 8, plan.y + 8], [plan.x + plan.w - 8, plan.y + 8], [plan.x + 8, plan.y + plan.d - 8], [plan.x + plan.w - 8, plan.y + plan.d - 8]]
    .sort((a, b) => P.prof([a[0], a[1], 0]) - P.prof([b[0], b[1], 0]));
  for (const [x, y] of pies) s += lz.torno(I.torno([[0, 4.4], [1.4, 4.4], [1.4, 3.3], [4.2, 3.3]], I.marco([x, y, -4.2], [0, 0, 1]), P, { pasos: 28 }), { linea: 'lo', k: 0.5 });
  const placa = I.caja(plan, 0, 6, P, { pasos: 6, bisel: 1.2 });
  const ranura = I.camino(I.anilloRedondeado({ x: plan.x + 5, y: plan.y + 5, w: plan.w - 10, d: plan.d - 10, r: 2 }, 4).map(([a, b]) => P.iso([a, b, 6])), true);
  const torn = [[plan.x + 9, plan.y + 9], [plan.x + plan.w - 9, plan.y + 9], [plan.x + 9, plan.y + plan.d - 9], [plan.x + plan.w - 9, plan.y + plan.d - 9]];
  let anillos = ''; for (const [x, y] of torn) anillos += I.camino(Array.from({ length: 17 }, (_, j) => P.iso([x + 2 * Math.cos(j / 16 * 2 * Math.PI), y + 2 * Math.sin(j / 16 * 2 * Math.PI), 6])), true);
  s += lz.prisma(placa, { linea: 'lo', k: 0.5, dentro: `<path class="iso-l faint" d="${ranura}"/><path class="iso-l faint" d="${anillos}"/>` + I.tornillos(torn.map(([x, y]) => P.iso([x, y, 6])), 0.55) });
  // placa de rótulo en la tapa, delante a la izquierda: tres líneas de texto impreso y dos remaches
  const rx = plan.x + 14, ry = plan.y + plan.d - 18;
  const rot = I.caja({ x: rx, y: ry, w: 40, d: 10, r: 1 }, 6, 0.8, P, { pasos: 2 });
  const lin = [[rx + 4, ry + 3, 26], [rx + 4, ry + 5.2, 18], [rx + 4, ry + 7.4, 22]].map(([x, y, l]) => I.camino([P.iso([x, y, 6.8]), P.iso([x + l, y, 6.8])])).join('');
  s += lz.prisma(rot, { linea: 'lo', k: 0.75, dentro: `<path class="iso-l lo" data-free="1" d="${lin}"/>` + I.tornillos([P.iso([rx + 2, ry + 5, 6.8]), P.iso([rx + 38, ry + 5, 6.8])], 0.45) });
  // soportes en U: dos postes con su collar y un travesaño bajo el eje
  for (const x of soportes) {
    for (const y of [-7, 7]) s += lz.torno(I.torno([[0, 2.4], [1.6, 2.4], [1.6, 1.6], [zEje - 7.2, 1.6]], I.marco([x, y, 6], [0, 0, 1]), P, { pasos: 20 }), { linea: 'lo' });
    s += lz.prisma(I.caja({ x: x - 3, y: -8, w: 6, d: 16, r: 1 }, zEje - 9, 2.4, P, { pasos: 2, bisel: 0.3 }), { linea: 'lo' });
  }
  return s;
}

// ---------------------------------------------------------------- IMPELLA desmontado a lo largo de su eje
export const LEYENDA_IMPELLA = [
  { n: '01', k: 'pig', t: 'Punta en «pigtail»', d: 'deja avanzar el catéter con seguridad hasta el VI', p: 47 },
  { n: '02', k: 'ent', t: 'Entrada', d: 'ventanas por donde aspira la sangre del VI', p: 47 },
  { n: '03', k: 'can', t: 'Cánula', d: 'cruza la válvula aórtica: los velos se cierran sobre ella', p: 47 },
  { n: '04', k: 'hel', t: 'Hélice', d: 'aspas que giran y crean un flujo no pulsátil (bomba «centrífuga miniatura» en Marino)', p: 47 },
  { n: '05', k: 'jau', t: 'Jaula de salida', d: 'suelta la sangre en la aorta proximal', p: 47 },
  { n: '06', k: 'mot', t: 'Motor', d: 'la carcasa de la bomba (Fig. 16.4)', p: 47 },
  { n: '07', k: 'cat', t: 'Catéter', d: 'por la aorta hasta la arteria femoral', p: 47 },
  { n: '08', k: 'con', t: 'Consola', d: 'mide el gasto propio y ajusta la bomba al total pedido', p: 47 },
];
export function montarDespieceImpella(svg) {
  const az = 36, el = 27;
  const plan = { x: -158, y: -52, w: 316, d: 74, r: 6 };
  const pts = [[plan.x, plan.y, -6], [plan.x + plan.w, plan.y, -6], [plan.x, plan.y + plan.d, -6], [plan.x + plan.w, plan.y + plan.d, -6], [plan.x, 0, 60], [plan.x + plan.w, -40, 70]];
  const P = I.ajustar(pts, W, H, { pad: 6, az, el });
  const lz = new I.Lienzo('dimp');
  const Z = 26;
  const eje = (x0) => I.marco([x0, 0, Z], [1, 0, 0], [0, 0, 1]);
  const piezas = {};
  // 01 pigtail: un rizo en el plano vertical del eje
  const rizo = []; for (let k = 0; k <= 30; k++) { const t = k / 30, a = Math.PI * 0.5 + t * Math.PI * 1.7, r = 9 - 3.4 * t; rizo.push([-144 + r * 1.3 * Math.cos(a), 0, Z + 12 + r * 1.3 * Math.sin(a)]); }
  piezas.pig = lz.tubo(I.tubo([[-128, 0, Z], [-134, 0, Z], ...rizo.reverse()], 2.2, P), { clase: 'dp pz-pig' });
  // 02 entrada: nariz cónica, cuerpo con cuatro ventanas (ranuras cerradas)
  const Me = eje(-126), Te = I.torno([[0, 2.6], [2.5, 5.4], [5, 7], [20, 7], [20, 6.4], [22, 6.4]], Me, P, { pasos: 56 });
  const base = (M) => Math.atan2(I.pto(M.v, P.V), I.pto(M.u, P.V));
  const ranuras = (M, s0, s1, r, n, fase, w = 0.5) => { let d = ''; const b = base(M); for (let j = 0; j < n; j++) { const th = fase + j / n * 2 * Math.PI; if (Math.cos(th - b) < 0.25) continue; const q = []; for (let k = 0; k <= 8; k++) q.push(P.iso(I.puntoEn(M, s0 + (s1 - s0) * k / 8, r, th - w / 2))); for (let k = 8; k >= 0; k--) q.push(P.iso(I.puntoEn(M, s0 + (s1 - s0) * k / 8, r, th + w / 2))); d += I.camino(q, true); } return d; };
  piezas.ent = lz.torno(Te, { clase: 'dp pz-ent', dentro: `<path class="hueco" d="${ranuras(Me, 8, 18, 7.02, 4, 0.5)}"/>` });
  // 03 cánula
  const Mc = eje(-98), Tc = I.torno([[0, 6.3], [1.2, 6.6], [62, 6.6], [63.2, 6.3]], Mc, P, { pasos: 56 });
  piezas.can = lz.torno(Tc, { clase: 'dp pz-can', dentro: `<path class="iso-l faint" d="${I.arco(Mc, 20, 6.6, P) + I.arco(Mc, 42, 6.6, P)}"/>` });
  // 05 jaula de salida (barras y huecos) y 04 la hélice, sacada hacia arriba
  const Mj = eje(-28), Tj = I.torno([[0, 7.4], [16, 7.4]], Mj, P, { pasos: 56 });
  const huecos = ranuras(Mj, 1.6, 14.4, 7.42, 6, 0.2, 0.7);
  piezas.jau = lz.torno(Tj, { clase: 'dp pz-jau', dentro: `<path class="hueco" d="${huecos}"/><path class="iso-l faint" d="${I.arco(Mj, 1.6, 7.4, P) + I.arco(Mj, 14.4, 7.4, P)}"/>` });
  const Mh = I.marco([-28, 0, Z + 26], [1, 0, 0], [0, 0, 1]);
  const Thub = I.torno([[0, 1.2], [1.4, 2.4], [14.6, 2.4], [16, 1.2]], Mh, P, { pasos: 36 });
  // 06 motor: carcasa con dos bandas y la tapa trasera
  const Mm = eje(-8), Tm = I.torno([[0, 7.6], [0.8, 8.0], [26, 8.0], [28, 6.6], [31, 3.4]], Mm, P, { pasos: 56 });
  piezas.mot = lz.torno(Tm, { clase: 'dp pz-mot', dentro: `<path class="iso-l faint" d="${I.arco(Mm, 6, 8.0, P) + I.arco(Mm, 9, 8.0, P) + I.arco(Mm, 20, 8.0, P)}"/>` });
  // 07 catéter con su trenzado (anillos que siguen la sección) y el conector
  const rutaCat = [[25, 0, Z], [52, 0, Z], [74, 2, Z - 2], [86, -14, Z - 4], [92, -30, Z - 6], [104, -36, 20]];
  const Tcat = I.tubo(rutaCat, 2.6, P);
  let trenza = '';
  for (let i = 2; i < Tcat.pts3.length - 2; i += 2) {
    const a = Tcat.pts3[i - 1], b = Tcat.pts3[i + 1], c = Tcat.pts3[i];
    trenza += I.arco(I.marco(c, I.res(b, a), [0, 0, 1]), 0, 2.62, P, 10);
  }
  piezas.cat = lz.tubo(Tcat, { clase: 'dp pz-cat' }) + `<path class="iso-l faint pz-cat" d="${trenza}"/>`;
  // 08 consola, detrás a la derecha, con el cable que llega a su lateral
  const cons = consola(P, lz, { x: 98, y: -48, z: 6, w: 50, d: 24, h: 34, pre: 'dimp-c', lineas: 3, clase: 'dp pz-con' });
  piezas.con = cons.svg;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<g class="iso">${banco(P, lz, plan, [-112, -66, -2, 40], Z)}
    ${piezas.cat}${piezas.con}${piezas.mot}${piezas.jau}<g id="dimp-helice" class="dp pz-hel"></g>${piezas.can}${piezas.ent}${piezas.pig}</g>`;
  svg.querySelector('.iso').insertAdjacentHTML('afterbegin', lz.defsSvg());
  const hel = svg.querySelector('#dimp-helice');
  const lzh = new I.Lienzo('dimph');
  const cubo = lzh.torno(Thub, { clase: 'lit-cubo', familia: 'lit', linea: 'hi' });
  svg.querySelector('.iso').insertAdjacentHTML('afterbegin', lzh.defsSvg());
  let fase = 0;
  function pintarHelice() {
    // tres aspas helicoidales: la parte de detrás fina y la de delante gruesa (sólidos simples), sobre el cubo
    let d = '', dD = '';
    for (let j = 0; j < 3; j++) { dD += I.helice(Mh, 1.5, 14.5, 6.2, 0.6, fase + j * 2.094 + Math.PI, P, 40); d += I.helice(Mh, 1.5, 14.5, 6.2, 0.6, fase + j * 2.094, P, 40); }
    hel.innerHTML = `<path class="alabe detras" d="${dD}"/>${cubo}<path class="alabe" d="${d}"/>`;
  }
  pintarHelice();
  return {
    actualizar(cab, dt, quieto, info) {
      if (!quieto && info.on) fase += dt * 2 * Math.PI * 0.45 * (cab.st.qImpObj / (1000 / 60));
      pintarHelice();
      const L = cab.lectura;
      if (L) {
        svg.querySelector('#dimp-c-l0').textContent = info.on ? `Bomba ${coma(L.imp, 1)} L/min` : 'Bomba parada';
        svg.querySelector('#dimp-c-l1').textContent = `Corazón ${coma(L.gcNativo, 1)}`;
        svg.querySelector('#dimp-c-l2').textContent = `Total ${coma(L.gcTotal, 1)}`;
      }
    },
  };
}

// ---------------------------------------------------------------- BALÓN desmontado
export const LEYENDA_BALON = [
  { n: '01', k: 'bal', t: 'Balón de poliuretano', d: 'alargado; se hincha con 35-40 mL', p: 45 },
  { n: '02', k: 'cat', t: 'Catéter', d: 'entra por la arteria femoral; la punta, justo por debajo de la subclavia izquierda', p: 45 },
  { n: '03', k: 'lin', t: 'Línea de gas', d: 'lleva el helio de la bomba al balón y de vuelta', p: 45 },
  { n: '04', k: 'con', t: 'Bomba (consola)', d: 'infla al cerrarse la aórtica y vacía antes de que se abra; dispara con la onda R', p: 45 },
  { n: '05', k: 'bot', t: 'Bombona de helio', d: 'gas de baja densidad: entra y sale rápido', p: 45 },
];
export function montarDespieceBalon(svg) {
  const az = 36, el = 27;
  const plan = { x: -158, y: -52, w: 316, d: 74, r: 6 };
  const pts = [[plan.x, plan.y, -6], [plan.x + plan.w, plan.y, -6], [plan.x, plan.y + plan.d, -6], [plan.x + plan.w, plan.y + plan.d, -6], [plan.x, 0, 60], [plan.x + plan.w, -40, 80]];
  const P = I.ajustar(pts, W, H, { pad: 6, az, el });
  const lz = new I.Lienzo('dbal');
  const Z = 24;
  const Mb = I.marco([-150, 0, Z], [1, 0, 0], [0, 0, 1]);
  let pzBal = '';
  const pintar = (v) => {
    const r = 1.2 + 6.4 * Math.sqrt(v / 40);
    const T = I.torno([[0, 1.2], [5, Math.max(1.2, r * 0.5)], [12, r * 0.94], [20, r], [128, r], [136, r * 0.92], [143, Math.max(1.2, r * 0.5)], [148, 1.2]], Mb, P, { pasos: 56 });
    const l = new I.Lienzo('dbalb');
    return { svg: l.torno(T, { clase: 'dp pz-bal', familia: 'helio', linea: 'hi', dentro: `<path class="iso-l faint" d="${I.arco(Mb, 20, r, P) + I.arco(Mb, 128, r, P)}"/>` }), defs: l.defsSvg() };
  };
  // catéter y conector en Y
  const Tcat = I.tubo([[-2, 0, Z], [40, 0, Z], [70, 0, Z]], 1.6, P, { suave: false });
  const My = I.marco([70, 0, Z], [1, 0, 0], [0, 0, 1]);
  const Ty = I.torno([[0, 1.9], [2, 3.2], [14, 3.2], [16, 2.2]], My, P, { pasos: 36 });
  const Tram = I.tubo([[76, 0, Z + 3], [80, 0, Z + 9], [84, 0, Z + 11]], 1.4, P);
  const Tlin = I.tubo([[86, 0, Z], [104, 0, Z], [118, -10, Z - 2], [126, -24, Z - 6], [128, -38, Z - 10]], 1.5, P);
  const cons = consola(P, lz, { x: 104, y: -50, z: 6, w: 38, d: 22, h: 30, pre: 'dbal-c', lineas: 2, clase: 'dp pz-con' });
  const Mbot = I.marco([150, -36, 6], [0, 0, 1]);
  const bot = I.torno([[0, 6], [30, 6], [33, 5], [35, 3], [37, 2], [41, 2]], Mbot, P, { pasos: 40 });
  const Mman = I.marco([150, -34, 49], [0, 1, 0]);
  const man = I.torno([[0, 5.4], [2, 5.4], [2.4, 4.8]], Mman, P, { pasos: 36 });
  let ticks = ''; for (let j = 0; j <= 10; j++) { const a = -2.2 + 4.4 * j / 10; ticks += I.camino([P.iso(I.puntoEn(Mman, 2.42, 4.2, a + Math.PI / 2)), P.iso(I.puntoEn(Mman, 2.42, j % 5 ? 3.5 : 3.0, a + Math.PI / 2))]); }
  const aguja = I.camino([P.iso(I.puntoEn(Mman, 2.44, 0, 0)), P.iso(I.puntoEn(Mman, 2.44, 3.8, 0.7 + Math.PI / 2))]);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const b0 = pintar(40);
  svg.innerHTML = `<g class="iso">${banco(P, lz, plan, [-130, -60, 20, 60], Z)}
    ${cons.svg}${lz.torno(bot, { clase: 'dp pz-bot', dentro: `<path class="iso-l faint" d="${I.arco(Mbot, 9, 6, P) + I.arco(Mbot, 22, 6, P)}"/>` })}
    ${lz.torno(man, { clase: 'dp pz-bot', dentro: `<path class="iso-l lo" d="${ticks}"/><path class="iso-l hi" d="${aguja}"/>` })}
    ${lz.tubo(Tlin, { clase: 'dp pz-lin', familia: 'helio' })}${lz.tubo(Tram, { clase: 'dp pz-cat' })}${lz.torno(Ty, { clase: 'dp pz-cat' })}${lz.tubo(Tcat, { clase: 'dp pz-cat' })}
    <g id="dbal-balon">${b0.svg}</g></g>`;
  svg.querySelector('.iso').insertAdjacentHTML('afterbegin', lz.defsSvg() + b0.defs);
  const gB = svg.querySelector('#dbal-balon');
  return {
    actualizar(cab, dt, quieto, info) {
      const v = quieto ? 40 : (info.on ? cab.st.vBalon : 0);
      const b = pintar(v); gB.innerHTML = b.defs + b.svg;
      svg.querySelector('#dbal-c-l0').textContent = info.on ? `Balón ${Math.round(v)} mL` : 'Balón parado';
      svg.querySelector('#dbal-c-l1').textContent = info.on ? 'Disparo: onda R' : '—';
    },
  };
}

// ---------------------------------------------------------------- ECMO desmontado: bomba, oxigenador, calentador, cánulas
export const LEYENDA_ECMO = [
  { n: '01', k: 'cv', t: 'Cánula venosa', d: 'por la vena femoral y la cava inferior, hasta cerca de la AD', p: 48 },
  { n: '02', k: 'bom', t: 'Bomba centrífuga', d: 'el rodete gira y genera la presión y el flujo', p: 48 },
  { n: '03', k: 'oxi', t: 'Oxigenador de membrana', d: 'sale el CO₂ y entra el O₂ (Fig. 16.5)', p: 49 },
  { n: '04', k: 'cal', t: 'Calentador', d: 'devuelve la sangre a 37 °C', p: 49 },
  { n: '05', k: 'ca', t: 'Cánula arterial', d: 'en la arteria femoral: la sangre sube por la aorta al revés', p: 48 },
];
export function montarDespieceEcmo(svg) {
  const az = 36, el = 27;
  const plan = { x: -150, y: -46, w: 300, d: 72, r: 6 };
  const pts = [[plan.x, plan.y, -6], [plan.x + plan.w, plan.y, -6], [plan.x, plan.y + plan.d, -6], [plan.x + plan.w, plan.y + plan.d, -6], [-60, 0, 92], [60, 0, 70]];
  const P = I.ajustar(pts, W, H, { pad: 6, az, el });
  const lz = new I.Lienzo('decm');
  // 01 cánula venosa larga con agujeros en la punta (ranuras cerradas)
  const Mcv = I.marco([-140, 22, 12], [1, 0, 0], [0, 0, 1]);
  const Tcv = I.torno([[0, 1.6], [3, 3.2], [60, 3.4], [92, 3.4], [96, 4.2], [104, 4.2]], Mcv, P, { pasos: 40 });
  const b = Math.atan2(I.pto(Mcv.v, P.V), I.pto(Mcv.u, P.V));
  let agujeros = ''; for (let k = 0; k < 6; k++) for (let j = 0; j < 4; j++) { const th = j / 4 * 2 * Math.PI + k * 0.8; if (Math.cos(th - b) < 0.3) continue; const c = I.puntoEn(Mcv, 8 + k * 6, 3.25, th); const q = []; for (let a = 0; a < 10; a++) { const t = a / 10 * 2 * Math.PI; q.push(P.iso(I.sum(c, I.sum(I.esc(Mcv.a, Math.cos(t) * 1.2), I.esc([0, 0, 1], Math.sin(t) * 0.7))))); } agujeros += I.camino(q, true); }
  // 05 cánula arterial corta
  const Mca = I.marco([-140, -30, 12], [1, 0, 0], [0, 0, 1]);
  const Tca = I.torno([[0, 1.8], [3, 3.0], [34, 3.0], [37, 4.0], [45, 4.0]], Mca, P, { pasos: 40 });
  // 02 bomba: base motriz, carcasa, rodete (levantado) y tapa con su entrada (más arriba)
  const bx = -40, by = -6;
  const baseB = I.caja({ x: bx - 12, y: by - 12, w: 24, d: 24, r: 3 }, 6, 10, P, { bisel: 0.6 });
  const Mcar = I.marco([bx, by, 16], [0, 0, 1]);
  const Tcar = I.torno([[0, 10], [5, 10], [6, 9]], Mcar, P, { pasos: 56 });
  const Mrod = I.marco([bx, by, 36], [0, 0, 1]);
  const Mtapa = I.marco([bx, by, 58], [0, 0, 1]);
  const Ttapa = I.torno([[0, 10], [3, 10], [5, 7], [8, 3.4], [16, 3.4]], Mtapa, P, { pasos: 56 });
  // salida tangencial de la carcasa (voluta)
  const Tsal = I.tubo([[bx + 9, by + 4, 19], [bx + 20, by + 9, 19]], 2.6, P, { suave: false });
  // 03 oxigenador: caja con su haz de fibras (estrías que van de cara a cara) y las tapas con los puertos de gas
  const ox = { x: 12, y: -26, w: 40, d: 26, r: 2.5 };
  const Tox = I.caja(ox, 6, 40, P, { bisel: 0.8 });
  const fr = I.caraMatriz(P, [ox.x, ox.y + ox.d, 46], [1, 0, 0], [0, 0, -1]);
  let estr = ''; for (let j = 0; j < 15; j++) estr += `<path class="fibra" d="M${4 + j * 2.3} 5V35"/>`;
  const Mgi = I.marco([ox.x + 30, ox.y + 13, 46], [0, 0, 1]), Mgo = I.marco([ox.x + 30, ox.y + 13, 6], [0, 0, -1]);
  const Tgi = I.torno([[0, 2.4], [5, 2.4], [6, 1.6], [9, 1.6]], Mgi, P, { pasos: 28 });
  // 04 calentador
  const ca = { x: 80, y: -20, w: 28, d: 16, r: 2 };
  const Tcal = I.caja(ca, 6, 22, P, { bisel: 0.6 });
  const frc = I.caraMatriz(P, [ca.x, ca.y + ca.d, 28], [1, 0, 0], [0, 0, -1]);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<g class="iso">${banco(P, lz, plan, [], 12)}
    ${lz.prisma(Tcal, { clase: 'dp pz-cal', dentro: `<g transform="${frc}"><rect x="3" y="3" width="22" height="10" rx="1" class="pantalla"/><text x="6" y="10.6" class="pantalla-txt" font-size="6">37 °C</text></g>` })}
    ${lz.prisma(Tox, { clase: 'dp pz-oxi', dentro: `<g transform="${fr}"><rect x="2" y="3" width="36" height="34" rx="1.5" class="ventana-oxi"/>${estr}</g>` })}
    ${lz.torno(Tgi, { clase: 'dp pz-oxi' })}
    ${lz.prisma(baseB, { clase: 'dp pz-bom' })}${lz.torno(Tcar, { clase: 'dp pz-bom' })}${lz.tubo(Tsal, { clase: 'dp pz-bom' })}
    <g id="decm-rodete" class="dp pz-bom"></g>
    ${lz.torno(Ttapa, { clase: 'dp pz-bom', dentro: `<path class="iso-l faint" d="${I.arco(Mtapa, 3, 10, P)}"/>` })}
    ${lz.torno(Tca, { clase: 'dp pz-ca', familia: 'sangre' })}
    ${lz.torno(Tcv, { clase: 'dp pz-cv', familia: 'venosa', dentro: `<path class="hueco" d="${agujeros}"/>` })}
  </g>`;
  svg.querySelector('.iso').insertAdjacentHTML('afterbegin', lz.defsSvg());
  const rod = svg.querySelector('#decm-rodete');
  let fase = 0;
  function pintarRodete() {
    const l = new I.Lienzo('decmr');
    const disco = I.torno([[0, 9], [1.4, 9]], Mrod, P, { pasos: 56 });
    const cubo = I.torno([[1.4, 2.6], [6, 2.6], [7, 1.8]], Mrod, P, { pasos: 28 });
    let al = '';
    for (let j = 0; j < 6; j++) {
      const a = fase + j * Math.PI / 3, q = [];
      for (let k = 0; k <= 8; k++) { const r = 2.8 + 6 * k / 8, th = a + 0.7 * k / 8; q.push(P.iso([bx + r * Math.cos(th), by + r * Math.sin(th), 37.4 + 3 * (1 - k / 8)])); }
      al += I.camino(q);
    }
    const cuerpo = l.torno(disco, { familia: 'lit', linea: 'hi' }) + `<path class="alabe" d="${al}"/>` + l.torno(cubo, { familia: 'lit', linea: 'hi' });
    rod.innerHTML = l.defsSvg() + cuerpo;
  }
  pintarRodete();
  return {
    actualizar(cab, dt, quieto, info) {
      if (!quieto && info.on) { fase += dt * 2 * Math.PI * 0.35 * (cab.ajuste.ecmo || 0); pintarRodete(); }
    },
  };
}
