// Maqueta M3: la misma patología en el motor (cinco signos) y en el ecógrafo real. Nada se calcula aquí salvo la TRV.
import { crearMotor } from '../../../js/modules/eco/motor.mjs';
import { construirCorazon, tapseDeLatido } from '../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../js/modules/eco/formas.mjs';
import { planoVista, crearEcografo, medirVd, medidasCorazon, MEJORAS_DEFECTO } from '../../../js/modules/eco/ecografia.mjs';
import { construirAbdomen } from '../../../js/modules/eco/abdomen.mjs';
import { ESCENARIOS, aplicarEscenario } from '../../../js/modules/eco/escenarios.mjs';

const $ = (s) => document.querySelector(s);
const ANCHO = 360, ALTO = 300, NFOT = 20, OP = { pericardio: true, detalle: true };
const st = { k: 'tep', g: ESCENARIOS.tep.gravedad.defecto, vista: 'a4c', pausa: false, fase: 0 };
const coma = (x, d = 1) => x.toFixed(d).replace('.', ',');
let pac = null, vueltas = 0, sucio = true, ultimo = 0, ticket = 0;
const eco = crearEcografo({ ancho: ANCHO, alto: ALTO, nb: 128, ns: 320 });
const lienzo = $('#lienzo'), ctx = lienzo.getContext('2d'), dat = ctx.createImageData(ANCHO, ALTO);

function prepararPaciente() {
  const m = crearMotor(); m.correr(12); aplicarEscenario(m, st.k, st.g);
  const onda = m.onda, extra = extraDeMotor(m), td = onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), onda[0]);
  const u = m.ultimo, pvc = u.pvc, est = estadoGeo(td, extra);
  const idx = Array.from({ length: NFOT }, (_, i) => Math.round(i * (onda.length - 1) / NFOT));
  const gr = construirCorazon(est, OP);
  const vd = medirVd(est), c = medidasCorazon(est), tapse = tapseDeLatido(u, m.p.mioVi ?? 1);
  pac = { m, onda, extra, td: { ...td, mioVi: m.p.mioVi ?? 1 }, pvc, idx, fot: new Array(NFOT).fill(null), planos: {},
    ref: gr.partes.concat(construirAbdomen(gr, { pvc, pad: pvc, t: 0 }).partes),
    sig: { vdvi: vd.basal / vd.basalVi, tapse, psap: u.paps, ratio: tapse / u.paps, pared: c.paredVd, trv: Math.sqrt(Math.max(0, u.paps - pvc) / 4),
      septo: est.septo, gc: u.gc, pam: u.pam, vvd: td.vvd } };
}
function fotograma(i) {
  if (!pac.fot[i]) { const s = pac.onda[pac.idx[i]], g = construirCorazon(estadoGeo(s, pac.extra), OP);
    pac.fot[i] = { s, partes: g.partes.concat(construirAbdomen(g, { pvc: pac.pvc, pad: s.pad, t: s.t }).partes) }; }
  return pac.fot[i];
}
function pintar() {
  const f = fotograma(st.fase);
  if (!pac.planos[st.vista]) pac.planos[st.vista] = planoVista(st.vista, pac.td);
  const t = f.s.t + vueltas * (pac.onda.at(-1).t - pac.onda[0].t);
  const r = eco.formar(f.partes, pac.planos[st.vista], { ref: pac.ref, t, ganancia: 0, m: MEJORAS_DEFECTO });
  dat.data.set(r.pix); ctx.putImageData(dat, 0, 0);
}
function bucle(ahora) {
  requestAnimationFrame(bucle);
  if (!pac) return;
  const dur = (pac.onda.at(-1).t - pac.onda[0].t) * 1000 / NFOT;
  if (!st.pausa && ahora - ultimo >= dur) { st.fase = (st.fase + 1) % NFOT; if (!st.fase) vueltas++; sucio = true; ultimo = ahora; }
  if (sucio) { sucio = false; pintar(); }
}

// ---- los cinco signos: cifra del motor, umbral de la guía, página
const FICHA_VD = 'Fisiopatología UCI · Cardiología · Ficha 11 (VD y TEP)';
const lib = (pdf, p, t) => `<a href="../../../docs/${pdf}#page=${p}" target="_blank" rel="noopener">${t}</a>`;
const ESC = 'esc-ers-2022-hipertension-pulmonar-parte1.pdf', MUK = 'mukherjee-2025-corazon-derecho-hp-ase.pdf', LANG = 'lang-2015-cuantificacion-camaras-ase.pdf';
const SIGNOS = [
  { id: 'vdvi', n: 'VD/VI basal', val: (s) => coma(s.vdvi, 2), unidad: '', pat: (s) => s.vdvi > 1.0, contra: (s, k) => k === 'hpcronica' && s.vdvi < 1.0, umbral: 'Patológico si >1,0',
    fuente: lib(ESC, 28, 'ESC/ERS 2022 Tabla 10, PDF 28 (p. 3645)'), origen: 'motor · medirVd (anchura basal VD / VI en A4C)' },
  { id: 'tapse', n: 'TAPSE', val: (s) => coma(s.tapse, 1), unidad: ' mm', pat: (s) => s.tapse < 17, umbral: 'Patológico si <17 mm',
    fuente: lib(LANG, 23, 'Lang 2015, PDF 23 (p. 23)'), origen: 'motor · tapseDeLatido' },
  { id: 'ratio', n: 'TAPSE/PSAP', val: (s) => coma(s.ratio, 2), unidad: ' mm/mmHg', pat: (s) => s.ratio < 0.55, umbral: 'Patológico si <0,55 mm/mmHg',
    fuente: lib(ESC, 28, 'ESC/ERS 2022 Tabla 10, PDF 28') + ' · ' + lib(MUK, 33, 'Mukherjee, PDF 33 (p. 173)'), origen: 'motor · TAPSE ÷ PSAP' },
  { id: 'pared', n: 'Pared libre del VD', val: (s) => coma(s.pared, 1), unidad: ' mm', pat: (s) => s.pared >= 5, umbral: 'Aumentada si ≥5 mm (normal <5, Mukherjee p. 144; 1-5, Lang Tabla 8, PDF 20)',
    fuente: lib(MUK, 4, 'Mukherjee, PDF 4 (p. 144)') + ' · ' + lib(LANG, 20, 'Lang 2015, Tabla 8, PDF 20'), origen: 'motor · medidasCorazon (telediástole)' },
  { id: 'trv', n: 'Velocidad de la regurgitación tricuspídea (TRV)', val: (s) => coma(s.trv, 1), unidad: ' m/s', intermedio: (s) => s.trv > 2.8 && s.trv <= 3.4, pat: (s) => s.trv > 3.4,
    umbral: 'Probabilidad de HP por TRV: ≤2,8 baja · 2,9-3,4 intermedia · >3,4 alta; con ≥2 categorías de otros signos (Tabla 10) sube un nivel (Fig. 5)', fuente: lib(ESC, 28, 'ESC/ERS 2022 Fig. 5, PDF 28 (p. 3645)'),
    origen: 'calculada √((PSAP−PVC)/4), ilustrativa; el motor aún no la entrega' },
];
function estado(sg, s) {
  if (sg.contra && (sg.contra(s, st.k) || (st.k === 'tep' && st.g >= ESCENARIOS.tep.gravedad.defecto && s.vdvi < 1.0))) return ['est-pat', '⚠ contradice la guía (>1,0 en HP): cifra del motor de hoy, no de la fisiología'];
  if (sg.pat(s)) return ['est-pat', '⚠ patológico'];
  if (sg.intermedio && sg.intermedio(s)) return ['est-int', '◐ intermedia'];
  return ['est-nor', sg.id === 'trv' ? '✔ TRV ≤2,8' : '✔ normal'];
}
function pintarSignos() {
  const s = pac.sig;
  $('#signos').innerHTML = SIGNOS.map((sg) => { const [c, t] = estado(sg, s);
    return `<div class="signo" id="signo-${sg.id}"><h3>${sg.n}</h3><span class="cifra">${sg.val(s)}${sg.unidad}</span><span class="estado ${c}">${t}</span>
      <p class="dim">${sg.umbral} · ${sg.fuente}</p><span class="origen">${sg.origen}</span>
      <br><span class="ficha dim">Ver en la ficha: ${FICHA_VD}</span></div>`; }).join('');
  const sellos = [];
  if (st.k === 'hpcronica' && st.g >= 0.97) sellos.push(`PSAP no sube de 95 (${coma(s.psap, 0)}) y VD ${coma(s.vvd, 0)} mL: tope del dibujo, no de la fisiología.`);
  if (st.k === 'tep' && st.g >= 0.97) sellos.push(`VD claudica: GC ${coma(s.gc, 1)} L/min, PAM ${coma(s.pam, 0)} mmHg. Es el tope del escenario (100 %).`);
  $('#sellos').innerHTML = sellos.map(x => `<div class="sello">⛔ ${x}</div>`).join('');
  $('#ad-septo').textContent = `Binario: ${coma(s.septo, 1)} (0 = ninguno, 1 = máximo) desde un 50 % de gravedad en TEP; no es una curva.`;
  $('#g-texto').textContent = ESCENARIOS[st.k].gravedad.texto(st.g) + ' · PSAP ' + coma(s.psap, 0) + ' mmHg · PVC ' + coma(pac.pvc, 0) + ' mmHg (motor).';
}
function recalcular() {
  const mio = ++ticket; $('#espera').hidden = false;
  setTimeout(() => { if (mio !== ticket) return; prepararPaciente(); pintarSignos(); $('#espera').hidden = true; sucio = true; }, 30);
}
$('#g-v').textContent = Math.round(st.g * 100) + ' %';
const ponerG = (g) => { st.g = g; $('#g').value = Math.round(g * 100); $('#g-v').textContent = Math.round(g * 100) + ' %'; recalcular(); };
$('#g').addEventListener('input', (e) => { st.g = +e.target.value / 100; $('#g-v').textContent = e.target.value + ' %'; recalcular(); });
const chips = (sel, fn) => $(sel).addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return;
  $(sel).querySelectorAll('[data-k]').forEach(x => x.setAttribute('aria-pressed', x === b)); fn(b.dataset.k); });
chips('#patologias', (k) => { st.k = k; ponerG(ESCENARIOS[k].gravedad.defecto); });
chips('#vistas', (k) => { st.vista = k; sucio = true; });
$('#defecto').addEventListener('click', () => ponerG(ESCENARIOS[st.k].gravedad.defecto));
$('#pausa').addEventListener('click', () => { st.pausa = !st.pausa; $('#pausa').textContent = st.pausa ? 'Seguir el latido' : 'Parar el latido'; });
// ganchos para la prueba
window.__m3 = { poner(k, g, vista) { st.k = k; st.g = g; if (vista) st.vista = vista; $('#g').value = Math.round(g * 100); $('#g-v').textContent = Math.round(g * 100) + ' %';
  prepararPaciente(); pintarSignos(); $('#espera').hidden = true; sucio = true; pintar();
  document.querySelectorAll('#patologias [data-k]').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === k));
  document.querySelectorAll('#vistas [data-k]').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === st.vista)); return pac.sig; } };
prepararPaciente(); pintarSignos(); $('#espera').hidden = true;
requestAnimationFrame(bucle);
