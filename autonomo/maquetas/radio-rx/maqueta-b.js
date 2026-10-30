// Maqueta B «Por qué se ve así: corte + rayo». Usa la pieza común (pintarRx, describir).
// Los botones se crean una vez y se repintan en su sitio. El corte se dibuja una vez y sus formas solo cambian de medida.
import { pintarRx } from './escena.js';

const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let st = { postura: 'erguido', que: 'aire', cuanto: 'pequeno', altura: 'vertice' };

// Geometría del corte (viewBox 390×214, visto desde los pies: la derecha del paciente queda a la izquierda).
const HEMI = { D: { cx: 135, cy: 108, rx: 52, ry: 56 }, I: { cx: 255, cy: 108, rx: 52, ry: 56 } };
const NIVEL = { vertice: 0.62, hilios: 1, bases: 1.05 };
// Fracción del hemitórax que ocupa la capa (ilustrativa). erguido = anillo; supino = capa delante (aire) o detrás (líquido).
const TAB = {
  aire: { erguido: { pequeno: { vertice: 0.14, hilios: 0, bases: 0 }, grande: { vertice: 0.32, hilios: 0.1, bases: 0.03 } },
          supino: { pequeno: { vertice: 0.08, hilios: 0.14, bases: 0.24 }, grande: { vertice: 0.2, hilios: 0.34, bases: 0.5 } } },
  liquido: { erguido: { pequeno: { vertice: 0, hilios: 0, bases: 0.12 }, grande: { vertice: 0.06, hilios: 0.28, bases: 0.5 } },
             supino: { pequeno: { vertice: 0.06, hilios: 0.1, bases: 0.14 }, grande: { vertice: 0.25, hilios: 0.45, bases: 0.55 } } },
};
const NIV_Y = { vertice: 64, hilios: 150, bases: 222 }; // altura del corte sobre la placa (viewBox 390×330)

function pulmon(lado, s) {
  const b = HEMI[lado], k = NIVEL[s.altura];
  const H = { cx: b.cx, cy: b.cy, rx: b.rx * k, ry: b.ry * k };
  const tipo = lado === 'I' ? 'aire' : 'liquido';
  const f = s.que === tipo ? TAB[tipo][s.postura][s.cuanto][s.altura] : 0;
  const R = 0.96;
  if (!f) return [H.cx, H.cy, H.rx * R, H.ry * R, H.rx, H.ry];
  if (s.postura === 'erguido') return [H.cx, H.cy, H.rx * R * (1 - f), H.ry * R * (1 - f), H.rx, H.ry];
  const th = f * 2 * H.ry, sup = H.cy - H.ry * R, inf = H.cy + H.ry * R;
  const top = tipo === 'aire' ? sup + th : sup, bot = tipo === 'aire' ? inf : inf - th;
  const ry = (bot - top) / 2;
  return [H.cx, (top + bot) / 2, H.rx * R * (0.35 + 0.65 * ry / (H.ry * R)), ry, H.rx, H.ry];
}
const objetivo = (s) => [NIVEL[s.altura], ...pulmon('D', s), ...pulmon('I', s)];

const E = {}; // elementos del corte, creados una vez
function el(tag, attrs, padre) { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); padre.append(n); return n; }
function montarCorte() {
  const s = $('rx-corte');
  s.setAttribute('viewBox', '0 0 390 214');
  const t = (x, y, txt, extra = {}) => { const n = el('text', { x, y, fill: '#fff', 'font-size': 11, 'font-family': 'system-ui,sans-serif', ...extra }, s); n.textContent = txt; return n; };
  // rayo: foco delante (arriba), chasis detrás (abajo)
  el('polygon', { points: '195,24 330,188 60,188', fill: 'var(--accent-yellow)', 'fill-opacity': 0.08 }, s);
  el('ellipse', { cx: 195, cy: 104, rx: 122, ry: 76, fill: '#fff', 'fill-opacity': 0.14, stroke: '#fff', 'stroke-opacity': 0.5 }, s);
  E.med = el('ellipse', { cx: 195, cy: 100, rx: 22, ry: 36, fill: '#fff', 'fill-opacity': 0.5 }, s);
  E.cavD = el('ellipse', { fill: '#fff', 'fill-opacity': 0.8 }, s);
  E.cavI = el('ellipse', { fill: '#000' }, s);
  E.pulD = el('ellipse', { fill: '#474747', stroke: '#fff', 'stroke-opacity': 0.9, 'stroke-width': 1.4 }, s);
  E.pulI = el('ellipse', { fill: '#474747', stroke: '#fff', 'stroke-opacity': 0.9, 'stroke-width': 1.4 }, s);
  el('rect', { x: 188, y: 31, width: 14, height: 7, rx: 2, fill: '#fff', 'fill-opacity': 0.7 }, s);
  el('circle', { cx: 195, cy: 166, r: 11, fill: '#fff', 'fill-opacity': 0.75 }, s);
  // rayos de muestra
  for (const x of [135, 195, 255]) el('line', { x1: 195, y1: 24, x2: x, y2: 188, stroke: 'var(--accent-yellow)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, s);
  // foco
  el('path', { d: 'M183 6 L207 6 L195 24 Z', fill: 'var(--accent-yellow)' }, s);
  t(214, 16, 'Foco del rayo (delante)', { fill: 'var(--accent-yellow)' });
  // chasis y tira de densidades
  el('rect', { x: 40, y: 188, width: 310, height: 14, fill: '#000', stroke: '#fff', 'stroke-opacity': 0.6 }, s);
  E.tira = [];
  for (let x = 40; x < 350; x += 5) E.tira.push(el('rect', { x, y: 189, width: 5, height: 12, fill: '#fff', 'fill-opacity': 0.5 }, s));
  t(195, 212, 'Chasis detrás · tira: suma de densidades (ilustrativo)', { 'text-anchor': 'middle' });
  t(52, 112, 'D', { 'font-size': 16, 'font-weight': 700 }); t(332, 112, 'I', { 'font-size': 16, 'font-weight': 700 });
  t(8, 40, 'delante ↑'); t(8, 180, 'detrás ↓');
  E.gSup = el('g', {}, s);
  el('path', { d: 'M10 62 L10 100 M4 92 L10 102 L16 92', stroke: '#fff', 'stroke-width': 2, fill: 'none' }, E.gSup);
  { const n = el('text', { x: 18, y: 84, fill: '#fff', 'font-size': 11, 'font-family': 'system-ui,sans-serif' }, E.gSup); n.textContent = 'gravedad'; }
  E.gErg = el('g', {}, s);
  el('circle', { cx: 16, cy: 56, r: 7, stroke: '#fff', 'stroke-width': 1.6, fill: 'none' }, E.gErg);
  el('path', { d: 'M12 52 L20 60 M20 52 L12 60', stroke: '#fff', 'stroke-width': 1.6 }, E.gErg);
  for (const [y, tx] of [[76, 'gravedad:'], [88, 'a los pies']]) { const n = el('text', { x: 6, y, fill: '#fff', 'font-size': 11, 'font-family': 'system-ui,sans-serif' }, E.gErg); n.textContent = tx; }
}

// Chord (longitud de la cuerda) de una elipse en la columna x.
const chord = (x, cx, rx, cy, ry) => { const u = (x - cx) / rx; return Math.abs(u) >= 1 ? 0 : 2 * ry * Math.sqrt(1 - u * u); };
function dibujar(v) {
  const [k, dcx, dcy, drx, dry, dHrx, dHry, icx, icy, irx, iry, iHrx, iHry] = v;
  const set = (n, o) => { for (const a in o) n.setAttribute(a, o[a]); };
  set(E.cavD, { cx: dcx, cy: HEMI.D.cy, rx: dHrx, ry: dHry });
  set(E.cavI, { cx: icx, cy: HEMI.I.cy, rx: iHrx, ry: iHry });
  set(E.pulD, { cx: dcx, cy: dcy, rx: drx, ry: dry });
  set(E.pulI, { cx: icx, cy: icy, rx: irx, ry: iry });
  set(E.med, { rx: 16 + 10 * k, ry: 22 + 16 * k });
  // Suma de densidades por columna: tejido 1, pulmón 0,3, líquido 1, aire 0,02 (ilustrativo).
  E.tira.forEach((r, i) => {
    const x = 42.5 + i * 5;
    const tor = chord(x, 195, 122, 104, 76);
    let d = 0, resto = tor;
    for (const [cx, hcy, hrx, hry, lcy, lrx, lry, aire] of [[dcx, HEMI.D.cy, dHrx, dHry, dcy, drx, dry, false], [icx, HEMI.I.cy, iHrx, iHry, icy, irx, iry, true]]) {
      const cav = chord(x, cx, hrx, hcy, hry), pul = Math.min(cav, chord(x, cx, lrx, lcy, lry));
      d += pul * 0.3 + (cav - pul) * (aire ? 0.02 : 1);
      resto -= cav;
    }
    d += Math.max(0, resto);
    r.setAttribute('fill-opacity', (0.12 + 0.88 * Math.min(1, d / 120)).toFixed(3));
  });
}

let actual = null, raf = 0;
function mover(meta) {
  cancelAnimationFrame(raf);
  if (!actual || reducido()) { actual = meta; dibujar(actual); return; }
  const ini = actual, t0 = performance.now(), DUR = 550;
  const paso = (t) => {
    const u = Math.min(1, (t - t0) / DUR), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    actual = ini.map((a, i) => a + (meta[i] - a) * e);
    dibujar(actual);
    if (u < 1) raf = requestAnimationFrame(paso); else actual = meta;
  };
  raf = requestAnimationFrame(paso);
}

// ---------- mandos (se crean una vez) ----------
const MANDOS = {
  postura: { titulo: 'Postura', op: [['erguido', 'Sentado'], ['supino', 'Tumbado']] },
  que: { titulo: 'Qué hay en la pleura', op: [['aire', 'Aire'], ['liquido', 'Líquido'], ['nada', 'Nada']] },
  cuanto: { titulo: 'Cuánto', op: [['pequeno', 'Pequeño'], ['grande', 'Grande']] },
  altura: { titulo: 'Altura del corte', op: [['vertice', 'Vértice'], ['hilios', 'Hilios'], ['bases', 'Bases']] },
};
const botones = {};
for (const [k, m] of Object.entries(MANDOS)) {
  const g = document.createElement('div');
  const h = document.createElement('p'); h.className = 'rx-grupo'; h.textContent = m.titulo;
  const sg = document.createElement('div'); sg.className = 'rx-seg'; sg.id = `rx-seg-${k}`; sg.setAttribute('role', 'group'); sg.setAttribute('aria-label', m.titulo);
  botones[k] = {};
  for (const [id, rot] of m.op) {
    const b = document.createElement('button'); b.type = 'button'; b.id = `rx-${k}-${id}`; b.textContent = rot;
    b.addEventListener('click', () => { if (k === 'cuanto' && st.que === 'nada') return; st = { ...st, [k]: id }; pintar(); });
    sg.append(b); botones[k][id] = b;
  }
  g.append(h, sg); $('rx-mandos').append(g);
}

const PORQUE = (s) => {
  const aire = s.que === 'aire', liq = s.que === 'liquido', sup = s.postura === 'supino', n = s.altura;
  if (!aire && !liq) return 'Sin aire ni líquido, el rayo cruza dos pulmones iguales y la placa los ve iguales.';
  if (aire && !sup) return n === 'vertice' ? 'Sentado, el aire sube al vértice. A esta altura rodea al pulmón: el rayo cruza una capa de aire sin trama y se ve la línea pleural.'
    : 'Sentado, el aire está arriba: a esta altura casi no hay capa que sumar. Por eso se busca en el vértice.';
  if (aire) return 'Tumbado, el aire sube a lo más alto, que es delante, y la capa es más gruesa en las bases. El rayo la atraviesa de delante atrás junto con todo el pulmón: la placa solo ve el total, más negro, y no dibuja borde.';
  if (liq && !sup) return n === 'bases' ? 'Sentado, el líquido baja a la base y rodea al pulmón: el rayo suma líquido y se ve el menisco.'
    : 'Sentado, el líquido está abajo: a esta altura apenas hay, salvo en un derrame grande.';
  return 'Tumbado, el líquido se extiende por detrás en una capa. El rayo suma una veladura pareja en todo el hemitórax, sin menisco.';
};

function pintar() {
  const aire = st.que === 'aire', liq = st.que === 'liquido';
  const estado = { postura: st.postura, ntx: aire ? st.cuanto : 'no', derrame: liq ? st.cuanto : 'no', foco: aire ? 'ntx' : liq ? 'derrame' : 'postura' };
  const r = pintarRx($('rx-placa'), estado);
  // línea del corte sobre la placa
  $('rx-placa').insertAdjacentHTML('beforeend', `<g><line x1="0" x2="390" y1="${NIV_Y[st.altura]}" y2="${NIV_Y[st.altura]}" stroke="var(--accent-yellow)" stroke-width="1.6" stroke-dasharray="6 4"/>`
    + `<text x="8" y="${NIV_Y[st.altura] - 5}" fill="var(--accent-yellow)" font-size="12" font-weight="600" font-family="system-ui,sans-serif" paint-order="stroke" stroke="#000" stroke-width="3">corte</text></g>`);
  mover(objetivo(st));
  E.gSup.style.display = st.postura === 'supino' ? '' : 'none';
  E.gErg.style.display = st.postura === 'erguido' ? '' : 'none';
  for (const k in botones) for (const id in botones[k]) {
    const b = botones[k][id];
    b.setAttribute('aria-pressed', String(st[k] === id));
    b.setAttribute('aria-disabled', String(k === 'cuanto' && st.que === 'nada'));
  }
  $('rx-que-corte').textContent = { vertice: 'vértice', hilios: 'hilios', bases: 'bases' }[st.altura];
  $('rx-frase').textContent = r.frase;
  $('rx-porque').textContent = PORQUE(st);
  $('rx-aviso').hidden = !r.aviso; $('rx-aviso').textContent = r.aviso ? `Atención: ${r.aviso}` : '';
  const caja = $('rx-sello'); caja.hidden = !r.sello;
  if (r.sello) {
    caja.replaceChildren(); const s = document.createElement('strong'); s.textContent = '▲ Peligro. '; caja.append(s, r.sello);
    if (r.selloHref) { const a = document.createElement('a'); a.href = r.selloHref; a.target = '_blank'; a.rel = 'noopener'; a.textContent = ' Fuente'; caja.append(' ·', a); }
  }
  $('rx-cifras').replaceChildren(...r.cifras.map(cf => {
    const li = document.createElement('li');
    const o = document.createElement('span'); o.className = 'rx-origen'; o.dataset.o = cf.origen; o.textContent = cf.origen;
    li.append(o, ' ', cf.texto);
    if (cf.cita) { const ci = document.createElement('span'); ci.className = 'rx-cita'; ci.append(' · ');
      if (cf.href) { const a = document.createElement('a'); a.href = cf.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = cf.cita; ci.append(a); } else ci.append(cf.cita);
      li.append(ci); }
    return li;
  }));
  $('rx-ver').dataset.resaltar = r.ficha.resaltar; $('rx-ver').textContent = `Ver en la ficha: ${r.ficha.nombre}`;
}
$('rx-ver').addEventListener('click', () => {
  const n = $('rx-ver-nota'); n.hidden = false; n.textContent = `En la app, este botón abre «${$('rx-ver').textContent.replace('Ver en la ficha: ', '')}» y resalta el párrafo de este estado.`;
});
$('rx-ver').addEventListener('blur', () => { $('rx-ver-nota').hidden = true; });
montarCorte();
pintar();
