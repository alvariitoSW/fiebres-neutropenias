// La maqueta «antes / después» de la imagen de eco. Un solo estado por fotograma: el mismo motor del latido, la misma
// geometría y el mismo plano para las dos imágenes; «antes» es el ecógrafo de la app tal cual (js/modules/eco/
// ecografia.mjs) y «después», la copia de trabajo (ecografia-v2.mjs). Con todas las mejoras apagadas, las dos imágenes
// son idénticas (comprobado en Node: diferencia media de gris 0,0).
import { crearMotor } from '../../../js/modules/eco/motor.mjs';
import { construirCorazon } from '../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../js/modules/eco/formas.mjs';
import { planoVista, crearEcografo, VISTAS } from '../../../js/modules/eco/ecografia.mjs';
import { construirAbdomen } from '../../../js/modules/eco/abdomen.mjs';
import { ESCENARIOS, aplicarEscenario } from '../../../js/modules/eco/escenarios.mjs';
import { crearEcografoV2 } from './ecografia-v2.mjs';

const $ = (s) => document.querySelector(s);
const ANCHO = 360, ALTO = 300, NFOT = 20, OP = { pericardio: true, detalle: true };
const NIVELES = [{ nb: 192, ns: 448, n: 'la más fina' }, { nb: 160, ns: 384, n: 'fina' }, { nb: 128, ns: 320, n: 'más rápida' }, { nb: 96, ns: 256, n: 'la más rápida' }];
const MEJORAS = ['paredes', 'moteado', 'sombra', 'reverb', 'especular', 'tgc', 'foco', 'ventana', 'calidad'];

const st = {
  vista: 'a4c', escenario: 'normal', corte: 0.5, pausa: false, fase: 0, ganancia: 0, prof: null, tgc: [0, 0, 0, 0], focoMm: 80,
  on: Object.fromEntries(MEJORAS.map(k => [k, true])),
  int: { paredes: 0.9, moteado: 0.7, sombra: 0.7, reverb: 0.6, especular: 0.7, foco: 0.7, ventana: 0 },
};
st.on.ventana = false;          // la ventana pobre es un reto: se enciende a mano
st.int.ventana = 0.7;

// ---- el paciente: motor, latido y geometría de cada fotograma (se construye cuando se pide)
let pac = null;
function prepararPaciente(k) {
  const m = crearMotor(); m.correr(12); if (k !== 'normal') aplicarEscenario(m, k);
  const onda = m.onda, extra = extraDeMotor(m), td = onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), onda[0]);
  const pvc = m.ultimo ? m.ultimo.pvc : td.pad, idx = Array.from({ length: NFOT }, (_, i) => Math.round(i * (onda.length - 1) / NFOT));
  const gr = construirCorazon(estadoGeo(td, extra), OP);
  pac = { k, m, onda, extra, td: { ...td, mioVi: m.p.mioVi ?? 1 }, pvc, idx, fot: new Array(NFOT).fill(null),
    ref: gr.partes.concat(construirAbdomen(gr, { pvc, pad: pvc, t: 0 }).partes), planos: {} };
}
let nuevo = false;     // este fotograma se ha construido ahora: su tiempo no cuenta para la calidad
function fotograma(i) {
  nuevo = !pac.fot[i];
  if (!pac.fot[i]) { const s = pac.onda[pac.idx[i]], g = construirCorazon(estadoGeo(s, pac.extra), OP);
    pac.fot[i] = { s, partes: g.partes.concat(construirAbdomen(g, { pvc: pac.pvc, pad: s.pad, t: s.t }).partes) }; }
  return pac.fot[i];
}
function plano() {
  if (!pac.planos[st.vista]) pac.planos[st.vista] = planoVista(st.vista, pac.td);
  const P = pac.planos[st.vista]; return { ...P, prof: st.prof ?? P.prof };
}

// ---- los dos ecógrafos
const antes = crearEcografo({ ancho: ANCHO, alto: ALTO });
const despues = NIVELES.map(n => null); let nivel = 0, ema = 0, desdeCambio = 0;
const ec2 = () => (despues[nivel] ||= crearEcografoV2({ ancho: ANCHO, alto: ALTO, nb: NIVELES[nivel].nb, ns: NIVELES[nivel].ns }));
const tA = [], tB = [];
const mediana = (a) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[b.length >> 1] : 0; };
const guarda = (a, x) => { a.push(x); if (a.length > 15) a.shift(); };

const lienzo = $('#ei-lienzo'), ctx = lienzo.getContext('2d');
const cA = document.createElement('canvas'), cB = document.createElement('canvas');
cA.width = cB.width = ANCHO; cA.height = cB.height = ALTO;
const xA = cA.getContext('2d'), xB = cB.getContext('2d'), dA = xA.createImageData(ANCHO, ALTO), dB = xB.createImageData(ANCHO, ALTO);

function mejorasActivas() {
  const m = {};
  for (const k of ['paredes', 'moteado', 'sombra', 'reverb', 'especular', 'foco', 'ventana']) m[k] = st.on[k] ? st.int[k] : 0;
  m.tgc = st.on.tgc ? 1 : 0; return m;
}
function componer() {
  ctx.clearRect(0, 0, ANCHO, ALTO); ctx.drawImage(cA, 0, 0);
  const x = Math.round(st.corte * ANCHO);
  if (x < ANCHO) ctx.drawImage(cB, x, 0, ANCHO - x, ALTO, x, 0, ANCHO - x, ALTO);
  if (x > 0 && x < ANCHO) { ctx.fillStyle = color(); ctx.fillRect(x - 1, 0, 2, ALTO); }
  if (st.senal && ultimoB) senalar(st.senal, ultimoB);
  $('#ei-rot-antes').hidden = st.corte < 0.12; $('#ei-rot-despues').hidden = st.corte > 0.88;
}
let renders = 0, ultimoB = null;
const color = () => getComputedStyle(document.body).getPropertyValue('--accent-yellow').trim() || 'white';

// ---- «Señálalo»: marca la zona del artefacto sobre la imagen de después y dice su frase en una línea
const FRASES = {
  sombra: 'Sombra: detrás de la costilla no llega sonido. Ahí no falta tejido.',
  refuerzo: 'Refuerzo: el líquido apenas frena el sonido y lo de detrás brilla más. No es tejido más denso.',
  reverb: 'Rebote del sonido en la pared del tórax. No se mueve con el corazón: no es un trombo.',
  especular: 'Pared lateral gris: el haz le pasa paralelo. No es que no se contraiga.',
  ventana: 'Aire del pulmón: tapa el sonido. La ganancia no lo arregla; cambia de ventana.',
};
const ROTULOS = { sombra: 'sombra de la costilla', refuerzo: 'refuerzo detrás de la sangre', reverb: 'rebotes a 2× y 3× la pared', especular: 'pared apagada', ventana: 'pulmón' };
const MEJORA_DE = { sombra: 'sombra', refuerzo: 'sombra', reverb: 'reverb', especular: 'especular', ventana: 'ventana' };
let rotuloEsp = 'pared apagada';
function senalar(tipo, b) {
  const pt = (r, th) => [b.cx + b.escala * r * Math.sin(th), b.arriba + b.escala * r * Math.cos(th)];
  const sector = (t0, t1, r0, r1) => { const p = []; for (let k = 0; k <= 12; k++) p.push(pt(r0, t0 + (t1 - t0) * k / 12)); for (let k = 12; k >= 0; k--) p.push(pt(r1, t0 + (t1 - t0) * k / 12)); return p; };
  const M = b.mitad, sub = VISTAS[st.vista].ventana === 'subcostal';
  let forma = null, aviso = '';
  if (tipo === 'sombra') { if (sub) aviso = 'En la subcostal el haz no cruza costillas: mira otra vista.'; else forma = sector(-M, -0.74 * M, b.pared - 6, b.prof - 2); }
  else if (tipo === 'reverb') forma = { varias: [2, 3].map(k => sector(-0.95 * M, 0.95 * M, k * b.pared - 3, k * b.pared + 3)) };
  else if (tipo === 'ventana') { if (!b.pulmon) aviso = 'En esta vista el pulmón no se interpone.'; else forma = sector(b.pulmon.borde * M, M, b.pulmon.rl, b.prof - 2); }
  else if (tipo === 'refuerzo') {
    // la tira más larga de haces centrales con sangre: la zona de 3 a 28 mm por debajo de la sangre más profunda
    const tiras = [[]];
    for (let i = 0; i < b.nb; i++) { const e = (i + 0.5) / b.nb * 2 - 1; let jj = -1;
      if (Math.abs(e) < 0.6) for (let j = b.ns - 1; j >= 0; j--) if (b.tag[j * b.nb + i] === 255) { jj = j; break; }
      if (jj < 0) { if (tiras.at(-1).length) tiras.push([]); continue; }
      tiras.at(-1).push([-M + (i + 0.5) * b.dth, (jj + 0.5) * b.dr]); }
    const t = tiras.reduce((a, x) => (x.length > a.length ? x : a), []);
    if (t.length > 3) forma = t.map(([th, r]) => pt(Math.min(b.prof - 2, r + 3), th)).concat(t.slice().reverse().map(([th, r]) => pt(Math.min(b.prof - 2, r + 28), th)));
  } else if (tipo === 'especular') {
    // las muestras de músculo que el haz roza en paralelo. En el apical de 4 cámaras, solo la pared lateral del VI (las
    // del VI a la derecha de su centro); en las demás vistas, el lado de la imagen donde hay más
    const tVi = b.etiquetas && b.etiquetas.get('VI'), a4 = st.vista === 'a4c' && tVi, P2 = [];
    let sx0 = 0, n0 = 0;
    if (a4) for (let q = 0; q < b.tag.length; q++) if (b.tag[q] === tVi) { sx0 += pt(((q / b.nb) | 0) * b.dr, -M + (q % b.nb + 0.5) * b.dth)[0]; n0++; }
    const xc = n0 ? sx0 / n0 : 0, lado = [[], []];
    for (let q = 0; q < b.tag.length; q++) if (b.apagado(q)) { const i = q % b.nb, j = (q / b.nb) | 0, p = pt((j + 0.5) * b.dr, -M + (i + 0.5) * b.dth);
      if (a4) { if (b.tag[q] === tVi && p[0] > xc + 6) P2.push(p); } else lado[i < b.nb / 2 ? 0 : 1].push(p); }
    const L = a4 ? P2 : (lado[1].length >= lado[0].length ? lado[1] : lado[0]);
    rotuloEsp = a4 ? 'pared lateral del VI' : 'músculo paralelo al haz';
    if (L.length > 20) { const mx = L.reduce((a, p) => a + p[0], 0) / L.length, my = L.reduce((a, p) => a + p[1], 0) / L.length;
      const sx = Math.sqrt(L.reduce((a, p) => a + (p[0] - mx) ** 2, 0) / L.length), sy = Math.sqrt(L.reduce((a, p) => a + (p[1] - my) ** 2, 0) / L.length);
      forma = { elipse: [mx, my, Math.max(10, 1.8 * sx), Math.max(14, 1.8 * sy)] }; }
    else aviso = 'En esta vista ninguna pared queda paralela al haz.';
  }
  $('#ei-senal').textContent = aviso || (tipo === 'especular' && st.vista !== 'a4c' ? 'El haz pasa paralelo a este músculo: se ve más gris, no está enfermo.' : FRASES[tipo]);
  if (!forma) return;
  ctx.save(); ctx.strokeStyle = color(); ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath();
  let cx, cy;
  if (forma.elipse) { const [x, y, rx, ry] = forma.elipse; ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI); cx = x; cy = y - ry - 10; }
  else { for (const f of forma.varias || [forma]) { f.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
    const f = (forma.varias || [forma]).at(-1); cx = f.reduce((a, p) => a + p[0], 0) / f.length; cy = f.reduce((a, p) => a + p[1], 0) / f.length; }
  ctx.stroke(); ctx.setLineDash([]);
  const txt = tipo === 'especular' ? rotuloEsp : ROTULOS[tipo]; ctx.font = '600 14px system-ui, sans-serif'; const w = ctx.measureText(txt).width + 10;
  const lx = Math.max(2, Math.min(ANCHO - w - 2, cx - w / 2)), ly = Math.max(2, Math.min(ALTO - 22, tipo === 'reverb' ? cy + 22 : cy - 10));   // el rebote es una banda fina: el rótulo, debajo
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-main').trim() || 'black'; ctx.globalAlpha = 0.85; ctx.fillRect(lx, ly, w, 20);
  ctx.globalAlpha = 1; ctx.fillStyle = color(); ctx.fillText(txt, lx + 5, ly + 15); ctx.restore();
}
function ponerSenal(tipo) {
  st.senal = st.senal === tipo ? null : tipo;
  document.querySelectorAll('.ei-senalalo').forEach(x => x.setAttribute('aria-pressed', x.dataset.senal === st.senal));
  if (!st.senal) { $('#ei-senal').textContent = ''; componer(); return; }
  const k = MEJORA_DE[tipo]; st.on[k] = true; $('#ei-on-' + k).checked = true;
  if (k === 'ventana' && st.int.ventana < 0.6) { st.int.ventana = 0.8; $('#ei-int-ventana').value = 80; }
  st.corte = 0; $('#ei-corte').value = 0; repintar();
}
function pintar() {
  const f = fotograma(st.fase), P = plano(), t = f.s.t + vueltas * (pac.onda.at(-1).t - pac.onda[0].t);     // un solo reloj: el del latido
  const a = antes.formar(f.partes, P, { ref: pac.ref, t, ganancia: st.ganancia });
  dA.data.set(a.pix); xA.putImageData(dA, 0, 0); guarda(tA, a.tiempos.total);
  const b = ultimoB = ec2().formar(f.partes, P, { ref: pac.ref, t, ganancia: st.ganancia, m: mejorasActivas(), tgc: st.tgc, focoMm: st.focoMm, ventanaVista: VISTAS[st.vista].ventana });
  dB.data.set(b.pix); xB.putImageData(dB, 0, 0); guarda(tB, b.tiempos.total);
  componer(); renders++;
  if (!nuevo) calidadAutomatica(b.tiempos.total);
  $('#ei-tiempos').textContent = `Antes: ${mediana(tA).toFixed(0)} ms por imagen · Después: ${mediana(tB).toFixed(0)} ms · imagen ${NIVELES[nivel].n}`;
  $('#ei-fase').value = st.fase;
}
// calidad automática: si «después» pasa de 40 ms por imagen (25 por segundo), menos haces y muestras; si el nivel de
// arriba cabría en 32 ms, más
function calidadAutomatica(ms) {
  if (!st.on.calidad) { if (nivel) { nivel = 0; ema = 0; } return; }
  ema = ema ? ema * 0.7 + ms * 0.3 : ms; desdeCambio++;
  if (desdeCambio < 6) return;
  // al subir de nivel, el tiempo crece con el número de muestras: solo se sube si cabría con holgura
  const coste = (n) => NIVELES[n].nb * NIVELES[n].ns;
  if (ema > 40 && nivel < NIVELES.length - 1) { nivel++; ema = 0; desdeCambio = 0; }
  else if (nivel > 0 && ema * coste(nivel - 1) / coste(nivel) < 32) { nivel--; ema = 0; desdeCambio = 0; }
}

// ---- bucle: el latido avanza un fotograma cada vez que hay imagen (sin dos relojes)
let sucio = true, ultimo = 0, vueltas = 0;
function bucle(ahora) {
  requestAnimationFrame(bucle);
  if (!pac) return;
  const dur = (pac.onda.at(-1).t - pac.onda[0].t) * 1000 / NFOT;
  if (!st.pausa && ahora - ultimo >= dur) { st.fase = (st.fase + 1) % NFOT; if (!st.fase) vueltas++; sucio = true; ultimo = ahora; }
  if (sucio) { sucio = false; pintar(); }
}
const repintar = () => { sucio = true; };

// ---- mandos
function chips(sel, lista, actual, fn) {
  const caja = $(sel); caja.innerHTML = lista.map(([k, n]) => `<button type="button" class="ei-chip" data-k="${k}" aria-pressed="${k === actual}">${n}</button>`).join('');
  caja.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return;
    caja.querySelectorAll('[data-k]').forEach(x => x.setAttribute('aria-pressed', x === b)); fn(b.dataset.k); });
}
const VISTAS_MAQ = [['plax', 'Paraesternal eje largo'], ['psaxPm', 'Paraesternal eje corto'], ['a4c', 'Apical 4 cámaras'], ['sc4c', 'Subcostal']];
const ESTADOS = ['normal', 'derrame', 'dilatada', 'hemorragia'];
chips('#ei-vistas', VISTAS_MAQ, st.vista, (k) => { st.vista = k; st.prof = null; ponerProf(); repintar(); });
chips('#ei-estados', ESTADOS.map(k => [k, ESCENARIOS[k].nombre]), st.escenario, (k) => cambiarPaciente(k));
function cambiarPaciente(k) {
  st.escenario = k; $('#ei-espera').hidden = false;
  setTimeout(() => { prepararPaciente(k); $('#ei-espera').hidden = true; repintar(); }, 30);
}
function ponerProf() { const p = st.prof ?? VISTAS[st.vista].prof; $('#ei-prof').value = p; $('#ei-prof-v').textContent = (p / 10).toFixed(0) + ' cm'; }
const rango = (id, fn) => { const el = $(id); el.addEventListener('input', () => { fn(+el.value); repintar(); }); };
rango('#ei-gan', (v) => { st.ganancia = v; $('#ei-gan-v').textContent = (v > 0 ? '+' : '') + v + ' dB'; });
rango('#ei-prof', (v) => { st.prof = v; $('#ei-prof-v').textContent = (v / 10).toFixed(0) + ' cm'; });
rango('#ei-foco', (v) => { st.focoMm = v; $('#ei-foco-v').textContent = (v / 10).toFixed(0) + ' cm'; });
for (let i = 0; i < 4; i++) rango('#ei-tgc' + i, (v) => { st.tgc[i] = v; $('#ei-tgc' + i + '-v').textContent = (v > 0 ? '+' : '') + v; });
rango('#ei-fase', (v) => { st.fase = v; st.pausa = true; $('#ei-pausa').textContent = 'Seguir el latido'; });
rango('#ei-corte', (v) => { st.corte = v / 100; componer(); });
$('#ei-pausa').addEventListener('click', () => { st.pausa = !st.pausa; $('#ei-pausa').textContent = st.pausa ? 'Seguir el latido' : 'Parar el latido'; });
for (const [id, c] of [['#ei-ver-antes', 1], ['#ei-ver-corte', 0.5], ['#ei-ver-despues', 0]]) $(id).addEventListener('click', () => { st.corte = c; $('#ei-corte').value = c * 100; componer(); });
// arrastrar la línea sobre la imagen
let arrastre = false;
const moverCorte = (e) => { const r = lienzo.getBoundingClientRect(); st.corte = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); $('#ei-corte').value = Math.round(st.corte * 100); componer(); };
lienzo.addEventListener('pointerdown', (e) => { arrastre = true; lienzo.setPointerCapture(e.pointerId); moverCorte(e); });
lienzo.addEventListener('pointermove', (e) => { if (arrastre) moverCorte(e); });
lienzo.addEventListener('pointerup', () => { arrastre = false; });
// interruptores e intensidades de cada mejora
for (const k of MEJORAS) {
  const c = $('#ei-on-' + k); if (!c) continue; c.checked = st.on[k];
  c.addEventListener('change', () => { st.on[k] = c.checked; repintar(); });
  const r = $('#ei-int-' + k); if (r) { r.value = Math.round(st.int[k] * 100); r.addEventListener('input', () => { st.int[k] = r.value / 100; repintar(); }); }
}
const todas = (v) => { for (const k of MEJORAS) { if (k === 'ventana' && v) continue; st.on[k] = v; const c = $('#ei-on-' + k); if (c) c.checked = v; } repintar(); };
document.querySelectorAll('.ei-senalalo').forEach(b => b.addEventListener('click', () => ponerSenal(b.dataset.senal)));
$('#ei-todo').addEventListener('click', () => todas(true));
$('#ei-nada').addEventListener('click', () => todas(false));

// ganchos para las capturas (no se ven en la página)
window.__ecoMaqueta = {
  poner(cfg) {
    if (cfg.vista) { st.vista = cfg.vista; st.prof = null; document.querySelectorAll('#ei-vistas [data-k]').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === cfg.vista)); ponerProf(); }
    if (cfg.escenario && cfg.escenario !== st.escenario) { prepararPaciente(cfg.escenario); st.escenario = cfg.escenario;
      document.querySelectorAll('#ei-estados [data-k]').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === cfg.escenario)); }
    if (cfg.on) for (const [k, v] of Object.entries(cfg.on)) { st.on[k] = v; const c = $('#ei-on-' + k); if (c) c.checked = v; }
    if (cfg.int) for (const [k, v] of Object.entries(cfg.int)) { st.int[k] = v; const r = $('#ei-int-' + k); if (r) r.value = Math.round(v * 100); }
    if (cfg.vueltas != null) vueltas = cfg.vueltas;
    if (cfg.tgc) { st.tgc = cfg.tgc; cfg.tgc.forEach((v, i) => { $('#ei-tgc' + i).value = v; $('#ei-tgc' + i + '-v').textContent = (v > 0 ? '+' : '') + v; }); } if (cfg.ganancia != null) st.ganancia = cfg.ganancia;
    if (cfg.corte != null) { st.corte = cfg.corte; $('#ei-corte').value = cfg.corte * 100; }
    if (cfg.fase != null) st.fase = cfg.fase; if (cfg.pausa != null) st.pausa = cfg.pausa;
    if ('senal' in cfg) { st.senal = null; $('#ei-senal').textContent = ''; document.querySelectorAll('.ei-senalalo').forEach(x => x.setAttribute('aria-pressed', 'false')); if (cfg.senal) ponerSenal(cfg.senal); }
    pintar(); return renders;
  },
  tiempos: () => ({ antes: mediana(tA), despues: mediana(tB), nivel }),
};

ponerProf(); prepararPaciente(st.escenario); $('#ei-espera').hidden = true;
requestAnimationFrame(bucle);
