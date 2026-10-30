// M1 · El corazón solo (maqueta). Motor real; el dibujo solo lee m.s (volumen y presión por instante).
import { ESCENARIOS } from '../../../js/modules/eco/escenarios.mjs';
import { PACIENTES, defectoDe, crearPaciente, medir, coma } from './m12-comun.mjs';

const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs = {}, padre) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (padre) padre.appendChild(e); return e; };
const C30 = Math.cos(Math.PI / 6);
const CAMARAS = [
  { id: 'ad', nombre: 'AD', cx: 92, suelo: 124, v: 'vad', p: 'pad', arriba: true },
  { id: 'ai', nombre: 'AI', cx: 268, suelo: 124, v: 'vai', p: 'pai', arriba: true },
  { id: 'vd', nombre: 'VD', cx: 92, suelo: 252, v: 'vvd', p: 'pvd', arriba: false },
  { id: 'vi', nombre: 'VI', cx: 268, suelo: 252, v: 'vvi', p: 'pvi', arriba: false },
];
const L_100 = 40, arista = (ml) => L_100 * Math.cbrt(Math.max(1, ml) / 100);
const lienzo = $('m1-lienzo');

// el suelo y las cajas se crean una vez; luego solo cambian sus atributos
mk('path', { d: 'M180 6 L180 312', stroke: 'var(--border-color)', 'stroke-dasharray': '3 4', fill: 'none' }, lienzo);
const iso = (cx, cy, L) => (x, y, z) => [cx + (x - y) * C30 * L, cy + (x + y) * 0.5 * L - z * L];
const pts = (ps) => ps.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
const caja = (cx, cy, L) => { const f = iso(cx, cy, L); const h = 0.5;
  const top = [f(-h, -h, 1), f(h, -h, 1), f(h, h, 1), f(-h, h, 1)], izq = [f(-h, h, 0), f(h, h, 0), f(h, h, 1), f(-h, h, 1)], der = [f(h, -h, 0), f(h, h, 0), f(h, h, 1), f(h, -h, 1)];
  return { top: pts(top), izq: pts(izq), der: pts(der) }; };
const mezcla = (pc) => `color-mix(in srgb, var(--accent-red) ${pc}%, var(--accent-green))`;
for (const c of CAMARAS) {
  const g = mk('g', {}, lienzo); c.g = g;
  const fan = caja(c.cx, c.suelo, L_100);
  c.fantasma = [fan.top, fan.izq, fan.der].map(d => mk('polygon', { points: d, fill: 'none', stroke: 'var(--text-muted)', 'stroke-width': 1, 'stroke-dasharray': '3 3' }, g));
  c.cara = ['top', 'izq', 'der'].map(() => mk('polygon', { stroke: 'var(--bg-main)', 'stroke-width': 1, 'stroke-linejoin': 'round' }, g));
  const ty = c.arriba ? 18 : 296;
  c.t1 = mk('text', { x: c.cx, y: ty, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 700, fill: 'var(--text-main)' }, g);
  c.t2 = mk('text', { x: c.cx, y: ty + 14, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--text-dim)' }, g);
}
function pintar(s) {
  for (const c of CAMARAS) {
    const ml = s[c.v], mm = s[c.p], L = arista(ml), d = caja(c.cx, c.suelo, L);
    const base = mezcla(Math.max(0, Math.min(100, mm)));
    c.cara[0].setAttribute('points', d.top); c.cara[0].style.fill = `color-mix(in srgb, ${base} 70%, var(--text-main))`;
    c.cara[1].setAttribute('points', d.izq); c.cara[1].style.fill = `color-mix(in srgb, ${base} 82%, var(--bg-main))`;
    c.cara[2].setAttribute('points', d.der); c.cara[2].style.fill = `color-mix(in srgb, ${base} 60%, var(--bg-main))`;
    c.t1.textContent = `${c.nombre} · ${Math.round(ml)} mL`; c.t2.textContent = `${coma(mm, 0)} mmHg`;
  }
}

let m = null, quien = PACIENTES[0], tocado = false, nLat = -1, last = performance.now(), ocupado = false, ultimaMed = null;
const chips = {};
for (const p of PACIENTES) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = p.nombre; b.setAttribute('aria-pressed', 'false'); b.dataset.pac = p.id; $('m1-pac').appendChild(b); chips[p.id] = b; }
const gIn = $('m1-g');
const gActual = () => (quien.k === 'normal' ? undefined : (tocado ? gIn.value / 100 : undefined));

function textoG() {
  const e = ESCENARIOS[quien.k];
  if (quien.k === 'normal') { gIn.disabled = true; $('m1-gout').textContent = '—'; $('m1-gtxt').textContent = 'Paciente normal: sin escenario que graduar.'; return; }
  gIn.disabled = false; $('m1-gout').textContent = gIn.value + ' %';
  const g = tocado ? gIn.value / 100 : defectoDe(quien.k);
  $('m1-gtxt').textContent = `${e.nombre}: ${e.gravedad.texto(g)}` + (tocado ? '' : ' (el caso de la app por defecto)');
}
function cifras() {
  if (!m || !m.ultimo) return;
  const r = ultimaMed = medir(m);
  $('f-fevi').textContent = coma(r.fevi); $('f-fevd').textContent = coma(r.fevd);
  $('f-pap').textContent = `${coma(r.psap)}/${coma(r.papd)}`; $('f-pvc').textContent = coma(r.pvc);
  $('f-gc').textContent = coma(r.gc, 1); $('f-tapse').textContent = coma(r.tapse, 1);
  const ee = r.ee, malo = Number(coma(ee, 1).replace(',', '.')) < 4.0;
  $('m1-eev').textContent = coma(ee, 1); $('m1-eev').classList.toggle('mal', malo);
  const pos = (v) => Math.max(0, Math.min(100, v / 25 * 100));
  $('m1-banda-ok').style.left = pos(4) + '%'; $('m1-banda-ok').style.width = (pos(11.5) - pos(4)) + '%';
  $('m1-banda-pt').style.left = pos(ee) + '%'; $('m1-banda-pt').classList.toggle('mal', malo);
  $('m1-ee-sello').hidden = !malo; $('m1-ee-A').hidden = !malo;
  const s100 = $('m1-sello100'), tope = quien.k !== 'normal' && tocado && gIn.value === '100';
  s100.hidden = !tope;
  if (tope) s100.textContent = quien.k === 'tep'
    ? `VD claudica: GC ${coma(r.gc, 1)}, PAM ${coma(r.pam)}`
    : `Tope del escenario (100 %): GC ${coma(r.gc, 1)}, PAM ${coma(r.pam)}, PVC ${coma(r.pvc)}`;
}
function nuevo() {
  ocupado = true; document.body.dataset.calculando = '1';
  $('m1-gtxt').textContent = 'Calculando el paciente…';
  setTimeout(() => {
    m = crearPaciente(quien.k, gActual()); nLat = -1; textoG(); cifras(); pintar(m.s);
    ocupado = false; delete document.body.dataset.calculando; last = performance.now();
  }, 20);
}
function elegir(id) {
  quien = PACIENTES.find(p => p.id === id); tocado = false;
  for (const k in chips) chips[k].setAttribute('aria-pressed', String(k === id));
  gIn.value = Math.round(defectoDe(quien.k) * 100); nuevo();
}
$('m1-pac').addEventListener('click', (e) => { const b = e.target.closest('button[data-pac]'); if (b) elegir(b.dataset.pac); });
let tmr = null;
gIn.addEventListener('input', () => { tocado = true; $('m1-gout').textContent = gIn.value + ' %'; clearTimeout(tmr); tmr = setTimeout(nuevo, 250); });

function bucle(t) {
  requestAnimationFrame(bucle);
  if (!m || ocupado) return;
  const dt = Math.min(0.05, (t - last) / 1000); last = t;
  m.correr(dt); pintar(m.s);
  if (m.s.nLatido !== nLat) { nLat = m.s.nLatido; cifras(); }
  $('m1-lat').textContent = `n.º ${nLat} · ${coma(m.ultimo?.fc ?? 0)} lpm`;
}
window.__m1 = { get m() { return m; }, get medida() { return ultimaMed; } };
elegir('normal'); requestAnimationFrame(bucle);
