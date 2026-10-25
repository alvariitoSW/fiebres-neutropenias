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
const NIVELES = [{ nb: 192, ns: 448, n: 'alta' }, { nb: 160, ns: 384, n: 'media' }, { nb: 128, ns: 320, n: 'baja' }, { nb: 96, ns: 256, n: 'mínima' }];
const MEJORAS = ['moteado', 'sombra', 'reverb', 'especular', 'tgc', 'foco', 'ventana', 'calidad'];

const st = {
  vista: 'a4c', escenario: 'normal', corte: 0.5, pausa: false, fase: 0, ganancia: 0, prof: null, tgc: [0, 0, 0, 0], focoMm: 80,
  on: Object.fromEntries(MEJORAS.map(k => [k, true])),
  int: { moteado: 0.7, sombra: 0.7, reverb: 0.6, especular: 0.7, foco: 0.7, ventana: 0 },
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
  for (const k of ['moteado', 'sombra', 'reverb', 'especular', 'foco', 'ventana']) m[k] = st.on[k] ? st.int[k] : 0;
  m.tgc = st.on.tgc ? 1 : 0; return m;
}
function componer() {
  ctx.clearRect(0, 0, ANCHO, ALTO); ctx.drawImage(cA, 0, 0);
  const x = Math.round(st.corte * ANCHO);
  if (x < ANCHO) ctx.drawImage(cB, x, 0, ANCHO - x, ALTO, x, 0, ANCHO - x, ALTO);
  if (x > 0 && x < ANCHO) { ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-yellow') || 'white'; ctx.fillRect(x - 1, 0, 2, ALTO); }
  $('#ei-rot-antes').hidden = st.corte < 0.12; $('#ei-rot-despues').hidden = st.corte > 0.88;
}
let renders = 0;
function pintar() {
  const f = fotograma(st.fase), P = plano(), t = f.s.t + vueltas * (pac.onda.at(-1).t - pac.onda[0].t);     // un solo reloj: el del latido
  const a = antes.formar(f.partes, P, { ref: pac.ref, t, ganancia: st.ganancia });
  dA.data.set(a.pix); xA.putImageData(dA, 0, 0); guarda(tA, a.tiempos.total);
  const b = ec2().formar(f.partes, P, { ref: pac.ref, t, ganancia: st.ganancia, m: mejorasActivas(), tgc: st.tgc, focoMm: st.focoMm, ventanaVista: VISTAS[st.vista].ventana });
  dB.data.set(b.pix); xB.putImageData(dB, 0, 0); guarda(tB, b.tiempos.total);
  componer(); renders++;
  if (!nuevo) calidadAutomatica(b.tiempos.total);
  $('#ei-tiempos').textContent = `Antes: ${mediana(tA).toFixed(0)} ms por imagen · Después: ${mediana(tB).toFixed(0)} ms · calidad ${NIVELES[nivel].n} (${NIVELES[nivel].nb} haces × ${NIVELES[nivel].ns} muestras)`;
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
    pintar(); return renders;
  },
  tiempos: () => ({ antes: mediana(tA), despues: mediana(tB), nivel }),
};

ponerProf(); prepararPaciente(st.escenario); $('#ei-espera').hidden = true;
requestAnimationFrame(bucle);
