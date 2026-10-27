// El pulmón con respirador, pieza 1: la página (maqueta; en la app, js/modules/libros/pulmon-vivo.js sobre el motor de
// la Mayéutica). Une el modelo (pulmon.mjs), el monitor común (comun/monitor.js), la escena (escena.js), los datos
// (datos.js) y la Mayéutica de muestra (comun/muestra-mayeutica.js). El modelo corre en vivo y el monitor dibuja
// muestra a muestra, con un barrido de 12 s.
import { instalarMonitor, instalarMonitorResp } from '../comun/monitor.js';
import { montarPantalla } from './pantalla.js';
import { instalarCss } from '../comun/dibujo-iso.js';
import { crearDock } from '../comun/dock.js';
import { crearMuestra } from '../comun/muestra-mayeutica.js';
import { crearPulmon, pbw, ORIGEN_MODELO, T_PAUSA, T_OCLUSION } from './pulmon.mjs';
import { crearTope } from '../comun/tope.js';
import { calcularTopes, estable, pasaDeTope, T as TOPE } from './topes.js';
import { crearEscena, ESCENA_CSS } from './escena.js';
import * as D from './datos.js';

const $ = (id) => document.getElementById(id);
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const SEG = 12;   // segundos por pantalla (un ciclo tarda de 1,7 a 7,5 s)
const f1 = (n) => (n == null || !isFinite(n) ? '—' : String(Math.round(n * 10) / 10).replace('.', ','));
const f0 = (n) => (n == null || !isFinite(n) ? '—' : String(Math.round(n)));
instalarMonitor(); instalarMonitorResp(); instalarCss('escena-pulmon', ESCENA_CSS);

// ---------------------------------------------------------------- citas: «Ver en la ficha» y el PDF de segunda opción
const pagTxt = (p) => /[-,]/.test(String(p)) ? `pp. ${p}` : `p. ${p}`;
export function cita(c) {
  if (!c) return '';
  const [[esp, view, panel], titulo, corto, pdf] = D.FICHA[c.f];
  const btn = `<button type="button" class="cita-ir" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${c.f}" data-resaltar="#${c.id}" data-titulo="${titulo}" data-sitio="${c.sitio}">Ver en la ficha: ${corto} · ${c.sitio} →</button>`;
  const enlace = pdf && c.p != null ? `<a class="cita-pdf" href="${pdf}#page=${String(c.p).match(/\d+/)[0]}" target="_blank" rel="noopener">PDF, ${pagTxt(c.p)}</a>` : '';
  return `<span class="cita">${btn}${enlace}</span>`;
}
const chip = (c) => c ? `<span class="org">${D.FICHA[c.f][4]}, ${pagTxt(c.p)}</span>` : '';
let toastT = 0;
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.cita-ir'); if (!b) return;
  const t = $('toast'); t.hidden = false;
  t.textContent = `En la app, este botón abre «${b.dataset.titulo}» y resalta «${b.dataset.sitio}». Al volver, regresas aquí.`;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3400);
});
const org = (t, ilu = true) => `<span class="org${ilu ? ' ilu' : ''}">${t}</span>`;

// ---------------------------------------------------------------- estado
const est = { modo: 'explorar', clave: 'normal-vcv', pac: D.PACIENTES[0], pausa: false, tapado: false, pest: 'resp', factorEsp: 1, fio2: 40, detenido: false };
const E0 = D.ESTADOS[est.clave];
const P = crearPulmon(E0.resp, E0.pulmon, E0.man);
// La pantalla del respirador (comun/respirador.js, configurada en pantalla.js): las curvas son su monitor
const PANT = montarPantalla($('monitor'), { P, PBW: () => PBW(), est, cita, alMando: (k, v) => cambiarMando(k, v), alModo: (k) => cambiarModo(k), alTecla: (k) => pulsarTecla(k) });
const mon = PANT.mon;
$('monitor').append($('velo-mon'));
const escena = crearEscena($('esc-svg'));
let tSim = 0, tProx = 0, L = null;

const pacDe = (k) => D.PACIENTES.find((p) => p.k === k);
const PBW = () => pbw(est.pac.talla, est.pac.sexo);
const NOMBRE_MANDO = { vt: 'Vt', flujo: 'Flujo', pinsp: 'P. insuflación', ie: 'I:E', fr: 'FR', peep: 'PEEP', pmax: 'Alarma de presión', c: 'Compliance', r: 'Resistencia', modo: 'Modo' };

function ponerEstado(clave, { llenar = true } = {}) {
  const E = D.ESTADOS[clave]; if (!E) return;
  est.clave = clave; est.pac = pacDe(E.pac); topeMando = null;
  if (est.detenido) { est.detenido = false; tope.quitar('detenido'); }
  P.ajustar({ ...E.resp }); P.pulmonAjustar({ c: E.pulmon.c, r: E.pulmon.r, rEsp: E.pulmon.rEsp ?? E.pulmon.r }); P.maniobra({ pausa: !!E.man.pausa, oclusion: !!E.man.oclusion });
  est.factorEsp = E.pulmon.rEsp ? Math.round(E.pulmon.rEsp / E.pulmon.r) : 1;
  if (llenar) llenarMonitor();
  pintarTodo();
}
// Llena la pantalla de golpe con el modelo ya estable (al cambiar de estado, en pausa o con «reducir movimiento»)
function llenarMonitor() {
  if (est.detenido) { const peep = P.S.resp.peep; mon.llenar(() => ({ paw: peep, flujo: 0, vol: 0, fase: 'esp' })); return; }   // sin ventilación: planas en la PEEP
  const cada = SEG / mon.NP, n = Math.round(cada / 0.005);
  for (let i = 0; i < 7000; i++) P.paso(0.005);   // 35 s de calentamiento: el aire atrapado de un estado anterior se va (τ hasta 3,9 s, FR 10)
  // la ventana empieza al 85 % de un ciclo: caben dos comienzos de inspiración y un ciclo entero para la guía (con FR 10 y
  // oclusión, el ciclo dura 7 s; si la ventana de 12 s empezaba justo en una inspiración, no había ciclo completo que señalar)
  let g = 0; while (P.fase === 'insp' && g++ < 4000) P.paso(0.005);
  g = 0; while (P.fase !== 'insp' && g++ < 4000) P.paso(0.005);
  const tc = 60 / P.S.resp.fr + (P.S.man.pausa ? T_PAUSA : 0) + (P.S.man.oclusion ? T_OCLUSION : 0);
  for (let i = 0, n85 = Math.round(0.85 * tc / 0.005); i < n85; i++) P.paso(0.005);
  mon.llenar(() => { for (let j = 0; j < n; j++) P.paso(0.005); return muestra(); });
  L = P.lectura(); tProx = tSim;
}
const muestra = () => ({ paw: P.paw, flujo: P.flujo, vol: P.vol, fase: P.fase });
function avanzar(dt) {
  const cada = SEG / mon.NP, n = Math.round(dt / 0.005);
  for (let i = 0; i < n; i++) { P.paso(0.005); tSim += 0.005; if (tSim >= tProx) { tProx += cada; mon.empujar(muestra()); } }
  L = P.lectura() || L;
}

// ---------------------------------------------------------------- tramos de la última respiración completa (para la guía)
// Devuelve { insp: [i0, i1], pico, pausa, esp, finesp, oclusion } con índices de muestra, o null si no hay un ciclo entero
function tramosUltimoCiclo() {
  const F = mon.dato('fase'), NP = mon.NP, cur = mon.cursor, hueco = new Set(); for (let j = 0; j < 7; j++) hueco.add((cur + j) % NP);
  const inicios = [];
  for (let i = 1; i < NP; i++) if (F[i] === 'insp' && F[i - 1] && F[i - 1] !== 'insp' && !hueco.has(i) && !hueco.has(i - 1)) inicios.push(i);
  for (let k = inicios.length - 1; k >= 1; k--) {
    const a = inicios[k - 1], b = inicios[k]; let roto = false;
    for (let i = a; i < b; i++) if (hueco.has(i) || F[i] == null) { roto = true; break; }
    if (roto) continue;
    const seg = (nombre) => { let i0 = -1, i1 = -1; for (let i = a; i < b; i++) if (F[i] === nombre) { if (i0 < 0) i0 = i; i1 = i; } return i0 < 0 ? null : [i0, i1 + 1]; };
    const insp = seg('insp'), esp = seg('esp');
    return { insp, pico: insp ? [Math.max(insp[0], insp[1] - 6), insp[1] + (seg('pausa') ? 0 : 2)] : null, pausa: seg('pausa'), esp, finesp: esp ? [Math.max(esp[0], esp[1] - Math.max(6, Math.round((esp[1] - esp[0]) * 0.18))), esp[1] + (seg('oclusion') ? 0 : 1)] : null, oclusion: seg('oclusion') };
  }
  return null;
}

// ---------------------------------------------------------------- pintar: monitor, cifras y escena
function marcasFlujo() {
  // la marca «flujo al final de la espiración» (triángulo y cifra) en cada paso de espiración a inspiración u oclusión
  const g = mon.capa('flujo'); if (!g) return;
  const F = mon.dato('fase'), Q = mon.dato('flujo'), NP = mon.NP; let h = '';
  for (let i = 1; i < NP; i++) if (F[i - 1] === 'esp' && F[i] && F[i] !== 'esp' && Q[i - 1] != null) {
    const y = mon.yDe('flujo', Q[i - 1]), v = Q[i - 1];
    h += `<path class="mon-marca" d="M${mon.x(i - 1)} ${f1(y + 2).replace(',', '.')}l-3 5h6z"/>` + (v < -2 ? `<text class="mon-marca-txt" x="${mon.x(i - 1) + 4}" y="${f1(y + 9).replace(',', '.')}">${f0(v)}</text>` : '');
  }
  g.innerHTML = h;
}
function pintarMonitor() { PANT.R.pintarCurvas(); marcasFlujo(); }
const alarma30 = (v) => (v == null ? '' : v > 30 ? 'no' : 'si');
function pintarCifrasTodo() {
  const r = P.S.resp, kg = PBW(), l = L || {};
  const hay = aplicarTopes();
  PANT.pintar(L, hay, { tapado: est.tapado, detenido: est.detenido });
  const celda = (k, et, g, t, cls = '') => `<div class="celda ${cls}" data-fila="${k}"><span class="k">${et}</span><span class="g">${est.tapado ? '?' : g}</span><span class="t">${t}</span></div>`;
  $('calc').innerHTML = [
    celda('pres', 'Pico − meseta', f1(l.meseta != null ? l.pico - l.meseta : null), 'Pres, cmH₂O'),
    celda('cstat', 'Cstat', l.cstat != null ? f0(l.cstat) : 'haz pausa', l.cstat == null ? 'mL/cmH₂O' : (l.conPeepTotal ? 'PEEP total' : 'PEEP aplicada') + ' · −3 mL/cmH₂O tubo', l.cstat == null ? '' : l.cstat < 25 ? 'no' : l.cstat >= 50 ? 'si' : ''),
    celda('dp', 'P. conducción', l.dp != null ? f1(l.dp) : 'haz pausa', l.conPeepTotal ? 'meseta − PEEP total' : 'meseta − PEEP aplicada'),
    celda('vtkg', 'Vt/kg PBW', f1(l.vtExh != null ? l.vtExh / kg : null), `PBW ${f1(kg)} kg`, l.vtExh != null && l.vtExh / kg > 8 ? 'no' : ''),
    celda('flujofin', 'Flujo fin esp.', f0(l.flujoFinEsp), l.flujoFinEsp != null && l.flujoFinEsp < -2 ? 'L/min · no llega a cero' : 'L/min · llega a cero', l.flujoFinEsp != null && l.flujoFinEsp < -2 ? 'no' : 'si'),
  ].join('');
  $('consola').hidden = !l.alarmaPresion;
  $('consola').innerHTML = (l.alarmaPresion ? `<span class="consola-aviso">Alarma de presión (${r.pmax ?? 40} cmH₂O): el respirador corta la insuflación y el Vt no llega entero. Baja el flujo, el Vt o la resistencia.</span>`
    : '');
}
function pintarFrase() {
  const E = D.ESTADOS[est.clave];
  const S = est.sello;   // un tope pasado manda sobre la frase del estado: la frase viva dice lo que le pasa al paciente
  $('frase-txt').innerHTML = S ? `<span class="estado">${S.titulo}</span>${S.texto} ${org(S.origen, false)}`
    : `<span class="estado">${E.tit}</span>${E.frase} ${org('modelo · umbrales: ficha')}`;
  $('ficha-pac').innerHTML = `<b>${est.pac.nombre}</b>, ${est.pac.linea}`;
  $('pacientes').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pac === est.pac.k)));
  $('leyenda').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.estado === est.clave)));
  $('fuentes').innerHTML = E.fuentes.map((c) => `<li><span>${D.FICHA[c.f][4]}: ${c.sitio}</span>${cita(c)}</li>`).join('');
  $('mon-quien').textContent = `${est.pac.nombre} · ${E.tit}`;
}
// Los topes de los mandos (topes.js): avisos ámbar bajo los mandos y sellos en el monitor, con su origen
const tope = crearTope({ monitor: PANT.R.curvas, dock: $('dock'), cita });
const topeVisto = {};
let topeMando = null;   // el sello de un mando que se pasó del tope y se quedó donde estaba
function aplicarTopes() {
  const hay = est.tapado ? {} : calcularTopes(P.S, L, PBW());
  if (topeMando) hay.sello = { nivel: 'sello', ...topeMando };
  for (const k of ['vtkg', 'meseta', 'pmax', 'sello', 'sello2', 'sello3', 'sello4']) {
    const t = hay[k], firma = t ? JSON.stringify(t) : '';
    if (topeVisto[k] === firma) continue;
    topeVisto[k] = firma; if (t) tope.poner(k, t); else tope.quitar(k);
  }
  const antes = est.sello; est.sello = hay.sello ? { titulo: hay.sello.titulo, texto: hay.sello.texto, origen: hay.sello.origen } : null;
  if (JSON.stringify(antes) !== JSON.stringify(est.sello)) pintarFrase();
  return hay;
}
function pintarTodo() { pintarMonitor(); pintarCifrasTodo(); escena.actualizar(P, L, { reducir: REDUCIR }); pintarFrase(); pintarMandos(); aplicarTopes(); medirDock(); }
// Predice y comprueba: mientras el monitor está tapado, la presión alveolar del dibujo tampoco se enseña
const taparEscena = () => { const t = document.getElementById('esc-palv'); if (t) t.toggleAttribute('hidden', est.tapado); };

// ---------------------------------------------------------------- bucle
let tAnt = 0;
function bucle(ts) {
  if (!est.pausa && !est.detenido && !REDUCIR) {
    const dt = Math.min(0.1, (ts - tAnt) / 1000 || 0.016); tAnt = ts;
    avanzar(dt); pintarMonitor(); escena.actualizar(P, L, {});
    if (Math.floor(ts / 400) !== Math.floor((ts - dt * 1000) / 400)) pintarCifrasTodo();
  } else tAnt = ts;
  requestAnimationFrame(bucle);
}

// ---------------------------------------------------------------- dock: mandos
const dock = crearDock($('dock'), { plegables: [$('dock-tabs'), $('dock-panel')] });
function medirDock() { dock.medir(); }
dock.plegar(true);   // plegado al abrir: la escena y el monitor se ven enteros
const desl = (k, et, v, min, max, paso, u, extra = '') => `<label class="deslizador"><input type="range" data-m="${k}" min="${min}" max="${max}" step="${paso}" value="${v}" aria-label="${et}"><output>${et} <b>${String(v).replace('.', ',')}</b> ${u}<small>${extra}</small></output></label>`;
function pintarMandos() {
  const r = P.S.resp, pu = P.S.pulmon, m = P.S.man, kg = PBW();
  let h = '';
  if (est.pest === 'resp') {
    h += `<div class="seg"><button type="button" data-m="modo" data-v="vcv" aria-pressed="${r.modo === 'vcv'}">VCV<small>volumen control</small></button><button type="button" data-m="modo" data-v="pcv" aria-pressed="${r.modo === 'pcv'}">PCV<small>presión control</small></button></div>`;
    if (r.modo === 'vcv') h += desl('vt', 'Vt', r.vt, 200, Math.max(r.vt, Math.min(800, Math.floor(TOPE.vtkgMax * kg / 10) * 10)), 10, 'mL', `${f1(r.vt / kg)} mL/kg PBW · tope 12`) + desl('flujo', 'Flujo', r.flujo, 30, 100, 5, 'L/min', 'ficha: 60, ≥80 si distrés');
    else h += desl('pinsp', 'P. insuflación', r.pinsp, 5, 30, 1, 'cmH₂O', 'sobre la PEEP') + desl('ie', 'I:E', r.ie, 1, 4, 0.5, '', `1:${String(r.ie).replace('.', ',')}`);
    h += desl('fr', 'FR', r.fr, 8, 35, 1, 'rpm', 'ficha: no pasar de 35') + desl('peep', 'PEEP', r.peep, 0, 20, 1, 'cmH₂O', 'ficha: 5-8 de inicio') + desl('pmax', 'Alarma de presión', r.pmax ?? 40, 30, TOPE.pmaxMax, 5, 'cmH₂O', 'ilustrativo');
  } else if (est.pest === 'pulmon') {
    h += desl('c', 'Compliance', pu.c, 15, TOPE.cMax, 1, 'mL/cmH₂O', pu.c < 25 ? 'ficha: SDRA <25' : pu.c >= 50 ? 'ficha: normal 50-80' : 'entre medias') + desl('r', 'Resistencia', pu.r, 2, 40, 1, 'cmH₂O/(L/s)', 'fisiología general');
    h += `<div class="seg" aria-label="Resistencia espiratoria"><button type="button" data-m="fesp" data-v="1" aria-pressed="${est.factorEsp === 1}">Esp. = insp.<small>pulmón sano</small></button><button type="button" data-m="fesp" data-v="2" aria-pressed="${est.factorEsp === 2}">Esp. ×2<small>EPOC</small></button><button type="button" data-m="fesp" data-v="3" aria-pressed="${est.factorEsp === 3}">Esp. ×3<small>asma (ilustrativo)</small></button></div>`;
    h += `<p class="dock-nota">τ = R·C = ${f1(pu.r * pu.c / 1000)} s (insp.) · ${f1((pu.rEsp ?? pu.r) * pu.c / 1000)} s (esp.): en 3 τ sale el 95 % del aire. ${org('fisiología general')}</p>`;
  } else if (est.pest === 'man') {
    h += `<div class="rejilla" style="--n:3"><button type="button" class="tog" data-m="pausa" aria-pressed="${!!m.pausa}">Pausa inspiratoria<small>pico → meseta</small></button><button type="button" class="tog" data-m="oclusion" aria-pressed="${!!m.oclusion}">Oclusión espiratoria<small>mide la PEEP oculta</small></button><button type="button" class="tog" data-m="monpausa" aria-pressed="${est.pausa}">Congelar monitor<small>para mirar</small></button></div>`;
    h += `<p class="dock-nota">La pausa cierra la válvula 0,5 s al final de la insuflación; la oclusión, 1 s al final de la espiración. Las dos valen solo si el paciente no respira por su cuenta (cap. 28 p. 31).</p>`;
  }
  $('dock-panel').innerHTML = h;
}
// El tope duro: si el cambio lleva a un estado que un paciente no aguanta (Vt > 12 mL/kg PBW, VM > 20 L/min), el mando
// se queda donde estaba y sale el sello. Si el cambio es válido, el sello se quita.
function guardarTope(k, antes) {
  const l = estable(P.S.resp, P.S.pulmon), t = pasaDeTope(l, PBW(), NOMBRE_MANDO[k] || k);
  if (!t) { topeMando = null; return; }
  if (k === 'c' || k === 'r') { P.pulmonAjustar({ [k]: antes }); P.pulmonAjustar({ rEsp: P.S.pulmon.r * est.factorEsp }); } else P.ajustar({ [k]: antes });
  topeMando = t;
}
$('dock-panel').addEventListener('input', (ev) => {
  const i = ev.target.closest('input[type=range]'); if (!i) return;
  cambiarMando(i.dataset.m, +i.value);
});
function cambiarMando(k, v) {
  if (k === 'fio2') { est.fio2 = v; pintarCifrasTodo(); return; }   // ilustrativo: el modelo no tiene gases
  const antes = k === 'c' || k === 'r' ? P.S.pulmon[k] : P.S.resp[k];
  if (k === 'c' || k === 'r') { P.pulmonAjustar({ [k]: v }); P.pulmonAjustar({ rEsp: P.S.pulmon.r * est.factorEsp }); } else P.ajustar({ [k]: v });
  guardarTope(k, antes);
  if (REDUCIR || est.pausa) llenarMonitor();
  pintarMandos(); pintarCifrasTodo(); pintarMonitor();
}
// Las pestañas de modo y las teclas de la pantalla
function cambiarModo(k) {
  if (k === 'detener') { detener(!est.detenido); return; }
  if (est.detenido) detener(false);
  const antes = P.S.resp.modo; P.ajustar({ modo: k }); guardarTope('modo', antes);
  if (REDUCIR || est.pausa) llenarMonitor();
  pintarMandos(); pintarCifrasTodo(); pintarMonitor();
}
function pulsarTecla(k) {
  if (k === 'alarmas') return PANT.infoAlarmas();
  if (k === 'vistas') { PANT.vistas(); llenarMonitor(); pintarTodo(); return; }
  if (k === 'inspmant' || k === 'espmant') { const m = k === 'inspmant' ? 'pausa' : 'oclusion'; P.maniobra({ [m]: !P.S.man[m] }); topeMando = null; }
  else if (k === 'congelar') { est.pausa = !est.pausa; }
  if (REDUCIR || est.pausa) llenarMonitor();
  pintarTodo();
}
// «Detener ventilación»: el bucle se para, las curvas quedan planas en la PEEP y sale el sello
function detener(on) {
  est.detenido = on;
  if (on) {
    llenarMonitor();
    tope.poner('detenido', { nivel: 'sello', titulo: 'Sin ventilación', texto: 'El respirador no da ninguna respiración y en este modelo el paciente no respira por su cuenta: el CO₂ sube y la saturación cae en minutos. Pulsa otra vez para reanudar.', origen: 'fisiología general' });
  } else { tope.quitar('detenido'); llenarMonitor(); }
  pintarTodo();
}
$('dock-panel').addEventListener('click', (ev) => {
  const b = ev.target.closest('button[data-m]'); if (!b) return;
  const k = b.dataset.m;
  if (k === 'modo') { const antes = P.S.resp.modo; P.ajustar({ modo: b.dataset.v }); guardarTope('modo', antes); }
  else if (k === 'fesp') { est.factorEsp = +b.dataset.v; P.pulmonAjustar({ rEsp: P.S.pulmon.r * est.factorEsp }); }
  else if (k === 'pausa' || k === 'oclusion') { P.maniobra({ [k]: !P.S.man[k] }); topeMando = null; }
  else if (k === 'monpausa') est.pausa = !est.pausa;
  if (REDUCIR || est.pausa) llenarMonitor();
  pintarMandos(); pintarCifrasTodo(); pintarMonitor(); medirDock();
});
$('dock-tabs').addEventListener('click', (ev) => {
  const b = ev.target.closest('button[data-pest]'); if (!b) return;
  est.pest = b.dataset.pest; $('dock-tabs').querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === b))); pintarMandos(); medirDock();
});

// ---------------------------------------------------------------- pacientes y estados
$('pacientes').innerHTML = D.PACIENTES.map((p) => `<button type="button" data-pac="${p.k}" aria-pressed="false">${p.nombre}<small>${p.chip}</small></button>`).join('');
$('pacientes').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pac]'); if (b) ponerEstado(pacDe(b.dataset.pac).estado); });
$('leyenda').innerHTML = D.ORDEN_ESTADOS.map((k, i) => `<button type="button" data-estado="${k}" aria-pressed="false"><b>${i + 1}</b>${D.ESTADOS[k].tit}</button>`).join('');
$('leyenda').addEventListener('click', (ev) => { const b = ev.target.closest('[data-estado]'); if (b) ponerEstado(b.dataset.estado); });

// ---------------------------------------------------------------- explicación guiada
let guia = null, gi = 0;
function abrirGuia(E) { guia = { E }; gi = 0; dock.plegar(false); dock.asa.hidden = true; $('dock-explorar').hidden = true; $('dock-est').hidden = true; $('dock-guia').hidden = false; est.pausa = true; llenarMonitor(); pintarTodo(); pintarGuia(); }
function cerrarGuia() {
  borrarSenal(); guia = null; $('dock-guia').hidden = true; est.pausa = false; dock.asa.hidden = est.modo !== 'explorar';
  if (est.modo === 'explorar') $('dock-explorar').hidden = false; else $('dock-est').hidden = false;
  medirDock();
}
function pintarGuia() {
  const E = guia.E, p = E.guia[gi], n = E.guia.length;
  $('dock-guia').innerHTML = `<div class="guia"><div class="guia-cab"><span class="guia-n">Paso ${gi + 1} de ${n}</span><span class="guia-tit">${E.tit}</span><button type="button" class="guia-x" id="guia-x" aria-label="Cerrar la explicación">×</button></div>
    <p class="guia-txt">${p.t}${p.org ? ' ' + org(p.org) : ''}</p>${cita(p.c)}
    <div class="guia-nav"><button type="button" class="guia-b" id="guia-ant" ${gi === 0 ? 'disabled' : ''}>← Atrás</button><span class="guia-puntos">${E.guia.map((_, i) => `<i class="${i < gi ? 'hecho' : i === gi ? 'aqui' : ''}"></i>`).join('')}</span><button type="button" class="guia-b prim" id="guia-sig">${gi === n - 1 ? 'Hecho' : 'Siguiente →'}</button></div></div>`;
  $('guia-x').onclick = cerrarGuia; $('guia-ant').onclick = () => { gi--; pintarGuia(); };
  $('guia-sig').onclick = () => { if (gi === n - 1) cerrarGuia(); else { gi++; pintarGuia(); } };
  medirDock(); requestAnimationFrame(() => senalar(p.s));
}
function borrarSenal() { document.querySelectorAll('.guia-anillo').forEach((e) => e.remove()); document.querySelectorAll('.guia-marco').forEach((e) => e.classList.remove('guia-marco')); mon.borrarTramos(); }
// s: lista de «canal:tramo» (paw:pausa, flujo:finesp…), selectores de la escena o de las cifras
function senalar(sels) {
  borrarSenal(); let primero = null; const T = tramosUltimoCiclo();
  const lista = [];
  for (const s of sels || []) {
    const m = s.match(/^(paw|flujo|vol):(\w+)$/);
    if (m) { const seg = T?.[m[2]]; if (seg) { const r = mon.tramo(m[1], m[2], seg[0], seg[1]); if (r) lista.push(r); } continue; }
    for (const el of document.querySelectorAll(s)) lista.push(el);
  }
  for (const el of lista) { const d = el.closest('details'); if (d && !d.open) d.open = true; }   // la lupa del pulmón, abierta antes de medir
  for (const el of lista) {
    const svg = el.ownerSVGElement;
    if (svg) {
      if (el.hasAttribute('data-tramo')) { primero = primero || el; continue; }
      let b; try { b = el.getBBox(); } catch { continue; } if (!b.width && !b.height) continue;
      const m = svg.getScreenCTM().inverse().multiply(el.getScreenCTM());
      const xs = [b.x, b.x + b.width].flatMap((x) => [b.y, b.y + b.height].map((y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]));
      const r = document.createElementNS(NS, 'rect'), x0 = Math.min(...xs.map((p) => p[0])), y0 = Math.min(...xs.map((p) => p[1]));
      r.setAttribute('class', 'guia-anillo'); r.setAttribute('x', x0 - 3); r.setAttribute('y', y0 - 3); r.setAttribute('width', Math.max(...xs.map((p) => p[0])) - x0 + 6); r.setAttribute('height', Math.max(...xs.map((p) => p[1])) - y0 + 6); r.setAttribute('rx', 6);
      svg.appendChild(r); primero = primero || r;
    } else { el.classList.add('guia-marco'); primero = primero || el; if (el.closest('details')) el.closest('details').open = true; }
  }
  if (primero) { const c = primero.getBoundingClientRect(), alto = innerHeight - $('dock').offsetHeight; if (c.top < 6 || c.bottom > alto - 6) scrollBy({ top: c.top - (alto - c.height) / 2, behavior: REDUCIR ? 'auto' : 'smooth' }); }
}
$('btn-guia').addEventListener('click', () => abrirGuia(D.ESTADOS[est.clave]));

// ---------------------------------------------------------------- notas, fuentes y profundizar
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-nota]'); if (!b) return;
  const n = $('nota-' + b.dataset.nota); if (!n) return;
  n.closest('details').open = true; n.scrollIntoView({ block: 'center', behavior: REDUCIR ? 'auto' : 'smooth' }); n.classList.add('guia-marco'); setTimeout(() => n.classList.remove('guia-marco'), 2400);
});
$('notas').innerHTML = D.NOTAS.map((n) => `<div class="nota" id="nota-${n.k}"><span class="nota-tipo ${D.NOTA_TIPO[n.tipo][1]}">${D.NOTA_TIPO[n.tipo][0]}</span><span>${n.txt}</span>${n.citas.map(cita).join('')}</div>`).join('');
$('profundizar').innerHTML = D.PROFUNDIZAR.map((p) => `<li><span>${p.t}</span>${cita(p.c)}</li>`).join('');

// ---------------------------------------------------------------- modos: Explorar | Mayéutica
const may = crearMuestra({
  cont: $('zona-may'), dock: { pasos: $('dock-pasos'), izq: $('dock-est-izq'), der: $('dock-est-der') },
  recorrido: D.RECORRIDO, caso: { ...D.CASO, modelo: { txt: D.CASO.modelo.txt, ir: () => { ponerModo('explorar'); ponerEstado(D.CASO.modelo.estado); } } },
  preparar(q) { if (q.estado) ponerEstado(q.estado); est.tapado = !!q.predice || !!q.tapar; $('velo-mon').hidden = !est.tapado; pintarCifrasTodo(); taparEscena(); },
  destapar(q) { est.tapado = false; $('velo-mon').hidden = true; pintarCifrasTodo(); taparEscena(); },
  tocar(q, hecho) {
    ponerEstado(q.tocar.estado); est.tapado = false; $('velo-mon').hidden = true; pintarCifrasTodo();
    const l = L || {};
    hecho(`pico <b>${f1(l.pico)}</b>, meseta <b>${l.meseta != null ? f1(l.meseta) : '—'}</b>, PEEP total <b>${l.peepTot != null ? f1(l.peepTot) : '—'}</b> (oculta ${l.autoPeep != null ? f1(l.autoPeep) : '—'}), flujo al final de la espiración <b>${f0(l.flujoFinEsp)}</b> L/min, Cstat <b>${f0(l.cstat)}</b>. ${org('modelo: ' + ORIGEN_MODELO)}`);
  },
  cita, chip, medir: medirDock,
});
function ponerModo(m) {
  est.modo = m; if (guia) cerrarGuia();
  $('modo-explorar').setAttribute('aria-selected', String(m === 'explorar')); $('modo-may').setAttribute('aria-selected', String(m === 'may'));
  $('zona-may').hidden = m !== 'may'; $('zona-pac').hidden = m !== 'explorar'; $('bajo-escena').hidden = m !== 'explorar';
  $('dock-explorar').hidden = m !== 'explorar'; $('dock-est').hidden = m !== 'may';
  PANT.R.soloLectura(m === 'may');
  if (m === 'may') may.empezar(); else { est.tapado = false; $('velo-mon').hidden = true; pintarCifrasTodo(); taparEscena(); }
  dock.asa.hidden = m !== 'explorar'; dock.plegar(m === 'explorar'); scrollTo({ top: 0 });
}
$('modo-explorar').addEventListener('click', () => ponerModo('explorar'));
$('modo-may').addEventListener('click', () => ponerModo('may'));

// ---------------------------------------------------------------- arranque
mon.montar(); ponerEstado('normal-vcv');
addEventListener('resize', () => { mon.montar(); llenarMonitor(); pintarTodo(); });
if (!REDUCIR) requestAnimationFrame(bucle);
