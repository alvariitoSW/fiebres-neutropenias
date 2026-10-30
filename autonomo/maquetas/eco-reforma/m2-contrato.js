// M2 · El cable (maqueta). 9 hilos = los 9 grupos del contrato (plan §2). Valores del motor real en vivo.
import { aplanamientoSeptal } from '../../../js/modules/eco/formas.mjs';
import { PACIENTES, crearPaciente, medir, coma } from './m12-comun.mjs';

const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, a = {}, padre) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (padre) padre.appendChild(e); return e; };
const C30 = Math.cos(Math.PI / 6);
const lienzo = $('m2-lienzo');

// Cada hilo: nombre del grupo, unidad, valor vivo (motor de hoy), quién lo usa, y de dónde viene hoy.
// rev: lo que hoy va al revés (mapa-motor §1 «Mezclas»). hueco: el motor de hoy no lo calcula.
const HILOS = [
  { id: 'vol', n: 1, nombre: 'vol · volumen de cada cámara', unidad: 'mL', corto: 'Volúmenes',
    valor: (m) => `VD ${coma(m.s.vvd)} · VI ${coma(m.s.vvi)} · AD ${coma(m.s.vad)} · AI ${coma(m.s.vai)} mL`,
    usa: 'B-mode (tamaño de las cavidades), modo M (diámetros), lecturas (FE, volúmenes).',
    hoy: 'Hoy el dibujo toca el motor: <code>suelo()</code> de <code>escenarios.mjs</code> sube el volumen basal de VD, AI y AD para que la forma quepa. En A el volumen del motor no se retoca; si no cabe, la imagen lo declara.', rev: [{ cod: 'suelo()', txt: 'el dibujo retoca el volumen del motor (suelo() de escenarios.mjs)' }] },
  { id: 'pres', n: 2, nombre: 'pres · presión de cámaras y vasos', unidad: 'mmHg', corto: 'Presiones',
    valor: (m) => `VI ${coma(m.s.pvi)} · VD ${coma(m.s.pvd)} · Ao ${coma(m.s.pao)} · AP ${coma(m.s.pap)} mmHg`,
    usa: 'Doppler (gradiente y TRV desde pres.ap), B-mode (el septo sale de pres.vd − pres.vi), lecturas (catéter, Wiggers, asas).',
    hoy: 'Sentido normal: el motor la calcula, la imagen la lee. (El septo hoy se hace desde pvi − pvd en <code>formas.mjs</code>.)' },
  { id: 'q', n: 3, nombre: 'q · caudal por válvula (anterógrado y regurgitante) y anillo', unidad: 'mL/s', corto: 'Caudales',
    valor: (m) => `mitral ${coma(m.s.qMit)} · tricúspide ${coma(m.s.qTri)} · aórtica ${coma(m.s.qAo)} · pulmonar ${coma(m.s.qPul)} mL/s`,
    usa: 'Doppler espectral y color (velocidad = caudal / área del anillo), flujo de sangre, lecturas (asa, Guyton).',
    hoy: 'Hoy el Doppler divide por el área del anillo que da la geometría del dibujo (<code>areasAnillo</code>). En A el área del anillo viaja por el cable (<code>anillo.mit, tri, ao, pul</code>, en cm²).' },
  { id: 'pared', n: 4, nombre: 'pared / masa · grosor telediastólico y masa', unidad: 'mm · g', corto: 'Pared y masa',
    valor: (m, r) => `pared VD (imagen) ${coma(r.paredVd, 1)} mm · masa VD del motor ×${coma(r.mioVd, 1)}`,
    usa: 'B-mode (grosor de la pared libre del VD y del VI), lecturas (RWT, hipertrofia).',
    hoy: 'Hoy la pared sale de la imagen (<code>medidasCorazon</code>) y el dibujo la recorta en HP crónica; en A la hipertrofia es del motor.' },
  { id: 'septo', n: 5, nombre: 'septo · posición del tabique −1…+1', unidad: 'sin unidad', corto: 'Septo',
    valor: (m) => `aplanamiento hoy ${coma(aplanamientoSeptal(m.s), 2)} (0 a 1; en A, continuo de −1 a +1)`,
    usa: 'B-mode (D-sign en eje corto), modo M (septo paradójico).',
    hoy: 'Hoy sale de pvi − pvd, casi binario (1,0 desde el TEP al 50 %). En A, continuo por instante.' },
  { id: 'regional', n: 6, nombre: 'regional · acortamiento por segmento (17 + 3 del VD)', unidad: '0-1', corto: 'Regional', hueco: true,
    valor: () => 'sin valor: el motor de hoy no lo calcula', usa: 'B-mode (McConnell: pared libre del VD quieta y ápex que late).',
    hoy: 'No existe hoy. En A la pared libre se quedaría quieta y el ápex latiría (ilustrativo, sin cifra).', sello: 'hueco · regional: el motor de hoy no tiene segmentos; hace falta para McConnell' },
  { id: 'anillo', n: 7, nombre: 'anillo · excursión (TAPSE, MAPSE) y velocidades de tejido (s′, e′, a′)', unidad: 'mm · cm/s', corto: 'Anillo',
    valor: (m, r) => `TAPSE ${coma(r.tapse, 1)} mm · e′ ${coma(r.eprima, 1)} cm/s · MAPSE hueco`,
    usa: 'Modo M (TAPSE), Doppler tisular (e′, s′), lecturas (E/e′).',
    hoy: 'Hoy dos hilos van al revés: TAPSE sale de la geometría (<code>tapseDeLatido</code>, FEVD × eje largo del VI) y e′ del atlas (<code>ePrima</code> en <code>atlas/diastolica.mjs</code>). En A los entrega el motor.', sello: 'hueco · MAPSE y S′ tricuspídea: sin fuente en docs/',
    rev: [{ cod: 'TAPSE', txt: 'TAPSE sale del dibujo (tapseDeLatido, corazon-geo.mjs)' }, { cod: 'e′', txt: 'e′ sale del atlas (ePrima, atlas/diastolica.mjs)' }] },
  { id: 'tiempos', n: 8, nombre: 'tiempos · TRIV, TD, tiempo de aceleración, TIVC', unidad: 'ms', corto: 'Tiempos',
    valor: (m, r) => `TRIV ${coma(r.triv)} ms (los demás: hueco hasta que lo entregue el motor)`,
    usa: 'Doppler (TRIV, tiempo de deceleración, TA pulmonar), lecturas (Wiggers).',
    hoy: 'El tiempo de aceleración pulmonar hoy no se mide; en A sale de la forma de <code>q.pul</code>.' },
  { id: 'derrame', n: 9, nombre: 'derrame y vci · saco pericárdico y vena cava', unidad: 'mL · mm', corto: 'Derrame y VCI',
    valor: (m) => `derrame ${coma(m.s.liquidoPeri ?? 0)} mL · VCI: sin cifra (hueco)`,
    usa: 'B-mode (espacio libre de eco), modo M, lecturas (taponamiento).',
    hoy: 'El derrame sí lo calcula el motor. El diámetro de la VCI hoy lo hace la imagen, no el motor.', sello: 'hueco · vci.diam y vci.colapso: el motor de hoy no los calcula (no comprobado si otra pieza los entrega)' },
];

// ---------- dibujo isométrico: piezas sólidas, 4 tonos por cara, de atrás hacia delante
const iso = (cx, cy) => (x, y, z) => [cx + (x - y) * C30, cy + (x + y) * 0.5 - z];
const P = (ps) => ps.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
const tono = (c, f) => `color-mix(in srgb, ${c} ${f}%, var(--bg-main))`;
function prisma(g, cx, cy, w, d, h, z0, color, borde = 'var(--bg-main)') {
  const f = iso(cx, cy), a = w / 2, b = d / 2, z1 = z0 + h;
  const caras = [
    [[f(-a, b, z0), f(a, b, z0), f(a, b, z1), f(-a, b, z1)], tono(color, 72)],
    [[f(a, -b, z0), f(a, b, z0), f(a, b, z1), f(a, -b, z1)], tono(color, 48)],
    [[f(-a, -b, z1), f(a, -b, z1), f(a, b, z1), f(-a, b, z1)], `color-mix(in srgb, ${color} 80%, var(--text-main))`],
  ];
  for (const [ps, fill] of caras) { const e = mk('polygon', { points: P(ps), stroke: borde, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, g); e.style.fill = fill; }
  return { f, a, b, z0, z1 };
}
const fondo = mk('g', {}, lienzo);

// corazón: 4 cubos vivos (tamaño = volumen, color = presión); las dos filas de atrás primero
const CAM = [
  { v: 'vad', p: 'pad', cx: 36, cy: 100, t: 'AD' }, { v: 'vai', p: 'pai', cx: 88, cy: 100, t: 'AI' },
  { v: 'vvd', p: 'pvd', cx: 36, cy: 168, t: 'VD' }, { v: 'vvi', p: 'pvi', cx: 88, cy: 168, t: 'VI' },
];
const gCor = mk('g', {}, lienzo);
for (const c of CAM) { c.caras = [0, 1, 2].map(() => mk('polygon', { stroke: 'var(--bg-main)', 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, gCor)); }
function pintarCorazon(s) {
  for (const c of CAM) {
    const L = 30 * Math.cbrt(Math.max(1, s[c.v]) / 100), f = iso(c.cx, c.cy), h = 0.5 * L, mm = Math.max(0, Math.min(100, s[c.p]));
    const base = `color-mix(in srgb, var(--accent-red) ${mm}%, var(--accent-green))`;
    const q = [[[f(-h, h, 0), f(h, h, 0), f(h, h, L), f(-h, h, L)], tono(base, 80)], [[f(h, -h, 0), f(h, h, 0), f(h, h, L), f(h, -h, L)], tono(base, 56)],
      [[f(-h, -h, L), f(h, -h, L), f(h, h, L), f(-h, h, L)], `color-mix(in srgb, ${base} 70%, var(--text-main))`]];
    q.forEach(([ps, fill], i) => { c.caras[i].setAttribute('points', P(ps)); c.caras[i].style.fill = fill; });
  }
}
// rótulos de las dos piezas
const rot = (x, y, t, o = {}) => { const e = mk('text', { x, y, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: 'var(--text-main)', ...o }, lienzo); e.textContent = t; return e; };
rot(62, 20, 'CORAZÓN'); rot(62, 33, 'motor', { 'font-weight': 400, fill: 'var(--text-dim)', 'font-size': 10.5 });
rot(306, 20, 'ECÓGRAFO'); rot(306, 33, 'imagen', { 'font-weight': 400, fill: 'var(--text-dim)', 'font-size': 10.5 });
// ecógrafo: carro, columna, monitor con su pantalla y la sonda
const gEco = mk('g', {}, lienzo);
prisma(gEco, 306, 214, 56, 40, 12, 0, 'var(--text-muted)');
prisma(gEco, 306, 214, 10, 10, 54, 12, 'var(--text-muted)');
const mon = prisma(gEco, 306, 214, 74, 10, 56, 62, 'var(--text-dim)');
{ const f = mon.f, y = mon.b + 0.1, xa = -mon.a + 6, xb = mon.a - 6, za = mon.z0 + 6, zb = mon.z1 - 6;
  const p = mk('polygon', { points: P([f(xa, y, za), f(xb, y, za), f(xb, y, zb), f(xa, y, zb)]), fill: 'var(--bg-main)', stroke: 'var(--border-color)' }, gEco);
  const cxm = 0, ap = f(cxm, y, zb - 2);
  mk('polygon', { points: P([ap, f(22, y, za + 3), f(-22, y, za + 3)]), fill: 'none', stroke: 'var(--accent-green)', 'stroke-width': 1.4 }, gEco);
  mk('polyline', { points: P([f(-12, y, zb - 12), f(0, y, zb - 20), f(12, y, zb - 12)]), fill: 'none', stroke: 'var(--accent-yellow)', 'stroke-width': 1.2 }, gEco); }
prisma(gEco, 280, 220, 8, 8, 16, 12, 'var(--accent-yellow)');

// cable: 10 hebras (el hilo 7 lleva dos: TAPSE y e′), del corazón (x0) al ecógrafo (x1)
const X0 = 118, X1 = 250, YA = 62, PASO = 13;
const hebras = [];
for (const h of HILOS) { const n = h.id === 'anillo' ? 2 : 1; for (let k = 0; k < n; k++) hebras.push({ h, k }); }
const gCable = mk('g', {}, lienzo);
const bez = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
hebras.forEach((e, i) => {
  const y = YA + i * PASO, ym = 152 + (i - 4.5) * 3.2, d = `M${X0},${y} C${X0 + 42},${ym} ${X1 - 42},${ym} ${X1},${y}`;
  e.y = y; e.d = d;
  e.g = mk('g', { 'data-hebra': e.h.id }, gCable);
  e.hit = mk('path', { d, fill: 'none', stroke: 'transparent', 'stroke-width': 13, 'pointer-events': 'stroke', style: 'cursor:pointer' }, e.g);
  e.linea = mk('path', { d, fill: 'none', 'stroke-linecap': 'round' }, e.g);
  const tx = bez(X0, X0 + 42, X1 - 42, X1, 0.2), ty = bez(y, ym, ym, y, 0.2);
  e.flecha = mk('path', { transform: `translate(${tx.toFixed(1)},${ty.toFixed(1)})` }, e.g);
  // insignia en el extremo del corazón: número del hilo (y ↩ si hoy va al revés)
  e.ins = mk('g', { transform: `translate(${X0 - 8},${y})` }, e.g);
  e.c = mk('circle', { r: 6.2, fill: 'var(--bg-main)', 'stroke-width': 1.3 }, e.ins);
  e.t = mk('text', { 'text-anchor': 'middle', y: 3.4, 'font-size': 9.5, 'font-weight': 700 }, e.ins);
  e.t.textContent = String(e.h.n) + (e.h.id === 'anillo' ? 'ab'[e.k] : '');
  e.rev = null;
  if (e.h.rev && e.h.rev[e.k]) e.rev = e.h.rev[e.k];
  if (e.h.id === 'anillo') e.t.setAttribute('font-size', 8.5);
  if (e.rev) { e.marca = mk('text', { x: X0 + 12, y: y + 3.5, 'font-size': 10, 'font-weight': 700, fill: 'var(--accent-red)', 'data-reves': '1' }, e.g); e.marca.textContent = '↩'; }
});
// «la imagen solo lee» rotulado en el dibujo, bajo el cable
const gl = mk('text', { x: 184, y: 232, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 700, fill: 'var(--accent-yellow)' }, lienzo); gl.textContent = 'la imagen solo lee →';
const gl2 = mk('text', { x: 184, y: 246, 'text-anchor': 'middle', 'font-size': 10.5, fill: 'var(--text-dim)' }, lienzo); gl2.textContent = '9 hilos = 9 grupos del contrato';
const hoyMarca = [...gCable.querySelectorAll('[data-reves]')];

// ---------- estado y controles (se crean una vez; luego solo cambian sus atributos)
let m = null, quien = PACIENTES[0], modo = 'hoy', sel = 'vol', r = null, nLat = -1, last = performance.now(), ocupado = false;
const chips = {};
for (const p of PACIENTES) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.pac = p.id; b.textContent = p.nombre; b.setAttribute('aria-pressed', 'false'); $('m2-pac').appendChild(b); chips[p.id] = b; }
const botones = {};
for (const h of HILOS) { const b = document.createElement('button'); b.type = 'button'; b.dataset.hilo = h.id; b.innerHTML = `<b>${h.n}</b>${h.corto}`; if (h.hueco) b.classList.add('vacio'); $('m2-hilos').appendChild(b); botones[h.id] = b; }

function repintar() {
  for (const e of hebras) {
    const h = e.h, malo = modo === 'hoy' && !!e.rev, elegido = h.id === sel;
    const color = malo ? 'var(--accent-red)' : h.hueco ? 'var(--text-muted)' : elegido ? 'var(--accent-yellow)' : 'var(--text-dim)';
    e.linea.setAttribute('stroke', color); e.linea.setAttribute('stroke-width', elegido ? 3.2 : 1.8);
    e.linea.setAttribute('stroke-dasharray', h.hueco ? '4 3' : ''); e.g.setAttribute('opacity', elegido || sel === null ? 1 : 0.55);
    // flecha: hacia el ecógrafo (→), o invertida (←) en los hilos que hoy van al revés
    e.flecha.setAttribute('d', malo ? 'M-4,0 L3,-4.2 L3,4.2 Z' : 'M4,0 L-3,-4.2 L-3,4.2 Z'); e.flecha.setAttribute('fill', color);
    e.c.setAttribute('stroke', color); e.t.setAttribute('fill', color);
    if (e.marca) { e.marca.style.display = malo ? '' : 'none'; if (malo) e.marca.setAttribute('data-reves', '1'); else e.marca.removeAttribute('data-reves'); }
  }
  for (const h of HILOS) { botones[h.id].setAttribute('aria-pressed', String(h.id === sel)); botones[h.id].classList.toggle('rev', modo === 'hoy' && !!h.rev); }
  for (const k in chips) chips[k].setAttribute('aria-pressed', String(k === quien.id));
  document.querySelectorAll('[data-modo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  const lista = $('m2-lista'); lista.replaceChildren();
  if (modo === 'hoy') {
    $('m2-lista-t').textContent = 'Hoy, tres hebras (en rojo, con ↩ y la flecha invertida) van al revés: la imagen escribe o el motor lee del dibujo.';
    for (const h of HILOS) for (const q of h.rev || []) { const li = document.createElement('li'); li.innerHTML = `<span class="flecha-rev">↩ hilo ${h.n} · ${q.cod}:</span> ${q.txt}.`; lista.appendChild(li); }
  } else $('m2-lista-t').textContent = 'Opción A (ilustrativa): los 9 hilos van en un solo sentido, del corazón a la imagen. Las tres hebras que hoy van al revés pasan a ser salidas del motor.';
  info();
}
function info() {
  const h = HILOS.find(x => x.id === sel); if (!h || !m) return;
  $('m2-nombre').textContent = `${h.n}. ${h.nombre} [${h.unidad}]`;
  $('m2-usa').textContent = h.usa;
  $('m2-origen').innerHTML = (h.hueco ? '<span class="origen">hueco</span>' : '<span class="origen">valor: motor de hoy</span>') + `<span class="origen">${modo === 'hoy' ? 'hoy' : 'opción A: ilustrativo'}</span>`;
  $('m2-notahoy').innerHTML = modo === 'hoy' ? h.hoy : (h.rev ? 'En A: el motor entrega este hilo y la imagen solo lo lee. <span class="origen">ilustrativo</span>' : (h.hueco ? h.hoy : 'En A: igual que hoy; solo cambia que el contrato lo congela en una prueba. <span class="origen">ilustrativo</span>'));
  const s = $('m2-sello'); s.hidden = !h.sello; s.textContent = h.sello || '';
}
function valor() { const h = HILOS.find(x => x.id === sel); if (h && m && r) $('m2-valor').textContent = h.valor(m, r); }

$('m2-hilos').addEventListener('click', (e) => { const b = e.target.closest('button[data-hilo]'); if (b) { sel = b.dataset.hilo; repintar(); valor(); } });
lienzo.addEventListener('click', (e) => { const g = e.target.closest('[data-hebra]'); if (g) { sel = g.dataset.hebra; repintar(); valor(); } });
document.querySelectorAll('[data-modo]').forEach(b => b.addEventListener('click', () => { modo = b.dataset.modo; repintar(); }));
$('m2-pac').addEventListener('click', (e) => { const b = e.target.closest('button[data-pac]'); if (b) { quien = PACIENTES.find(p => p.id === b.dataset.pac); nuevo(); repintar(); } });
function nuevo() {
  ocupado = true; document.body.dataset.calculando = '1'; $('m2-valor').textContent = 'Calculando el paciente…';
  setTimeout(() => { m = crearPaciente(quien.k); r = medir(m); nLat = m.s.nLatido; ocupado = false; delete document.body.dataset.calculando; last = performance.now(); valor(); info(); }, 20);
}
function bucle(t) {
  requestAnimationFrame(bucle);
  if (!m || ocupado) return;
  const dt = Math.min(0.05, (t - last) / 1000); last = t;
  m.correr(dt); pintarCorazon(m.s);
  if (m.s.nLatido !== nLat) { nLat = m.s.nLatido; r = medir(m); }
  valor();
}
repintar(); nuevo(); requestAnimationFrame(bucle);
