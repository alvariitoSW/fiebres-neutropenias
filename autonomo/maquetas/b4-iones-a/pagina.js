// Iones vivos · A «La célula que crece»: la página (mandos, topes, frase viva, guía y Mayéutica).
import { crearTope } from '../../../js/core/tope.js';
import { verFrase, seguirFrase } from '../../../js/core/frase-vista.js';
import { leyendaParticulas } from '../../../js/core/particulas.js';
import * as M from './modelo.js';
import { crearEscena } from './escena.js';
import { GUIAS, FUENTES, NOTAS, PROFUNDIZAR, cita, ORIGEN } from './datos.js';
import { montarMayeutica } from './mayeutica.js';
const $ = id => document.getElementById(id);
const coma = (n, d = 1) => n.toFixed(d).replace('.', ',');
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = crearEscena($('esc'), { reducido });
export const API = { s: null, esc, M };   // para la prueba
let s = M.PACIENTES.sano.s(), clavePac = 'sano', modo = 'explorar';
$('leyenda').innerHTML = leyendaParticulas(['k', 'mg', 'ca', 'p'], { titulo: 'Qué es cada partícula' });
const tope = crearTope({ monitor: $('tarjeta'), dock: $('dock'), cita: c => `<span class="cita">${cita(c)}</span>` });
// ---------- lecturas ----------
const CELDAS = [['k', 'K⁺', 'mEq/L'], ['mg', 'Mg²⁺', 'mEq/L'], ['ca', 'Ca ión', 'mmol/L'], ['p', 'Fosfato', 'mg/dL'], ['fc', 'FC', 'lpm'], ['pa', 'PA', 'mmHg']];
$('lecturas').innerHTML = CELDAS.map(([c, n, u]) => `<div class="lect" id="lc-${c}"><small>${n}</small><b></b><small>${u}</small></div>`).join('');
const lee = s => { const f = M.caFr(s), ast = M.asistolia(s), hipoCa = f.ion < M.TOPES.ca.min;
  return { k: M.kSer(s), mg: M.mgSer(s), ca: f.ion, p: M.pSer(s), fc: ast ? 0 : hipoCa ? 112 : M.kSer(s) > 6.5 ? 62 : 75, pa: ast ? '0/0' : hipoCa ? '82/48' : '120/75' }; };
const fmt = { k: v => coma(v), mg: v => coma(v), ca: v => coma(v, 2), p: v => coma(v), fc: v => String(v), pa: v => v };
function leer() {
  const v = lee(s);
  for (const [c] of CELDAS) { const el = $('lc-' + c); el.querySelector('b').textContent = fmt[c](v[c]); }
  $('lc-k').className = 'lect' + (v.k < 3.5 ? ' baja' : v.k > 5.5 ? ' alta' : ''); $('lc-mg').className = 'lect' + (v.mg < 1.4 ? ' baja' : v.mg > 2 ? ' alta' : '');
  $('lc-ca').className = 'lect' + (v.ca < 1.15 ? ' baja' : v.ca > 1.25 ? ' alta' : ''); $('lc-p').className = 'lect' + (v.p < 2.5 ? ' baja' : v.p > 5 ? ' alta' : '');
  return v;
}
// ---------- topes ----------
const TXT = {
  clk: ['Riesgo de asistolia', 'ClK por encima de 20 mEq/h por la cava superior: el ECG se queda plano.', 'ficha · p. 23', 'kcl', ['[data-clk="40"]']],
  mg: ['Parada cardíaca', 'Mg²⁺ de 13 mEq/L o más: antagonismo del calcio en el nodo AV; FC 0 y PA 0.', 'ficha · p. 39', 'mgalto', ['[data-mg]']],
  ca: ['Hipotensión y ectopia', 'Ca iónico por debajo de 0,65 mmol/L: PA 82/48 y FC 112 con extrasístoles ventriculares.', 'ficha · p. 45', 'caiv', []],
  p: ['Fosfato grave', 'Fosfato por debajo de 1 mg/dL: falta energía en el músculo respiratorio y en el corazón. No sigas con glucosa e insulina.', 'ficha · p. 50', 'p50', ['[data-act="realimentar"]']],
  bolo: ['Bolo de calcio superado', 'Más de 200 mg de calcio elemental en 10 minutos: la ficha da 200 mg y después 1-2 mg/kg/h. La fuente no dice qué le pasa.', 'ficha · p. 45', 'caiv', ['[data-ca]']],
  k: ['Combinación no fisiológica', 'Este K⁺ no cabe en la Fig. 36.2: el total y el sérico no pueden ir así.', 'ilustrativo', 'k362', ['[data-act="realimentar"]', '[data-act="furosemida"]']],
};
const AVISO = { mgAviso: m => ['Magnesio alto', `${m >= 10 ? 'Más de 10 mEq/L: bloqueo AV completo' : m >= 5 ? 'Más de 5: bloqueo AV de 1.er grado' : 'Más de 4: hiporreflexia'}; el sello salta a 13.`, 'ficha · p. 39', 'mgalto'], caAviso: () => ['Calcio iónico bajo', 'Por debajo de 0,9 mmol/L ya es grave (transfusión masiva); a 0,65 llegan la hipotensión y la ectopia.', 'ficha · p. 44-45', 'calc'] };
const vistos = new Set();
function topes() {
  const ev = M.evaluar(s), ahora = new Set(ev.map(e => e.c));
  for (const k of [...vistos]) if (!ahora.has(k)) { tope.quitar(k); vistos.delete(k); }
  for (const e of ev) {
    if (e.sello) { const [titulo, texto, origen, c, deshabilita] = TXT[e.c]; tope.poner(e.c, { nivel: 'sello', titulo, texto, origen, cita: c, deshabilita }); }
    else { const [titulo, texto, origen, c] = AVISO[e.c](M.mgSer(s)); tope.poner(e.c, { nivel: 'aviso', titulo, texto, origen, cita: c }); }
    vistos.add(e.c);
  }
  tope.refrescar();
}
// ---------- refresco ----------
let tapar = false;
export function refrescar() {
  const v = leer(); API.s = s;
  const kMed = M.kMedido(s);
  esc.sync(s); esc.pintar(s, { kMed, estadoEcg: v.k < 3.5 ? 'hipoK: pendiente' : '' });
  const ke = esc.ecg.pintarFijo(v.k, s.caEcg > 0.5, M.asistolia(s));
  topes();
  document.body.classList.toggle('tapar', tapar);
  pintarBotones();
}
let ultimoKe = 4;
// ---------- frase viva ----------
const frase = $('frase');
let antes = null;
function decir(accion, extra = '') {
  const v = lee(s), a = antes || v, partes = [];
  for (const [c, n, d] of [['k', 'K⁺', 1], ['mg', 'Mg²⁺', 1], ['ca', 'Ca ión', 2], ['p', 'fosfato', 1]]) if (Math.abs(v[c] - a[c]) >= 0.5 * 10 ** -d) partes.push(`${n} ${coma(a[c], d)} → ${coma(v[c], d)}`);
  frase.textContent = `${accion}${partes.length ? ': ' + partes.join(' · ') : ': ninguna cifra cambia'}${extra ? '. ' + extra : ''}`;
  requestAnimationFrame(() => requestAnimationFrame(() => verFrase(frase, { dock: $('dock') })));
}
export const decirFuera = decir;
// ---------- mandos (se crean una vez; luego solo cambian de marca) ----------
const MANDOS = {
  mover: [
    ['Realimentar (insulina + glucosa)', 'realimentar', () => { M.realimentar(s); return ['Realimentar', 'La insulina y la glucosa meten K⁺, fosfato y Mg²⁺ en la célula; el total del cuerpo no cambia (p. 20-21, 34, 49)']; }],
    ['Furosemida 40 mg', 'furosemida', () => { M.furosemida(s); return ['Furosemida', 'El K⁺ y el Mg²⁺ se pierden por la orina durante unas 6 h: pasa tiempo para verlo (p. 33-34)']; }],
    ['Extraer con puño y vacío', 'puno', () => { s.hemolisis = !s.hemolisis; return ['Extracción ' + (s.hemolisis ? 'con puño y vacío' : 'cuidadosa'), 'El tubo marca más K⁺ que el paciente: pseudohiperpotasemia (p. 23-24)']; }],
  ],
  reponer: [
    ['ClK 10 mEq/h', 'clk', () => ponerClk(10), '10'], ['ClK 20 mEq/h', 'clk', () => ponerClk(20), '20'], ['ClK 40 mEq/h', 'clk', () => ponerClk(40), '40'], ['Parar el ClK', 'clk', () => ponerClk(0), '0'],
    ['Vena periférica', 'via', () => { s.via = 'periferica'; return ['Vía periférica', 'El tope de 20 mEq/h solo rige para la cava superior (p. 23)']; }, 'periferica'],
    ['Cava superior', 'via', () => { s.via = 'cava'; return ['Cava superior', 'Por encima de 20 mEq/h hay riesgo de asistolia (p. 23)']; }, 'cava'],
    ['MgSO₄ 2 g', 'mg', () => { M.mgso4(s, 2); return ['MgSO₄ 2 g (16 mEq)', 'El Mg²⁺ sube ya, pero el 50 % se va por la orina y a los 15 min baja (p. 37-38)']; }],
    ['MgSO₄ 6 g', 'mg', () => { M.mgso4(s, 6); return ['MgSO₄ 6 g (48 mEq)', 'El pico cae a los 15 min; los depósitos tardan días (p. 37-38)']; }],
    ['Fosfato potásico 15 mmol', 'fosfato', () => { M.fosfatoK(s, 15); return ['Fosfato potásico 15 mmol', 'Sube el fosfato y trae K⁺ (4,3 mEq por 3 mmol: p. 51; p. 23 dice 4,5)']; }],
  ],
  calcio: [
    ['Gluconato 10 mL (90 mg)', 'ca', () => { M.calcioIV(s, 'gluconato', 10); return ['Gluconato cálcico 10 mL (90 mg)', 'El Ca iónico sube unos minutos; con K⁺ alto el ECG mejora pero el K⁺ no cambia (p. 27, 45)']; }],
    ['Cloruro 10 mL (270 mg)', 'ca', () => { M.calcioIV(s, 'cloruro', 10); return ['Cloruro cálcico 10 mL (270 mg)', 'Tiene el triple de calcio (27 mg/mL) y se reserva para el colapso (p. 27, 45)']; }],
    ['Albúmina −0,5', 'alb', () => { s.alb = Math.max(1, s.alb - 0.5); return ['Albúmina ' + coma(s.alb), 'Baja el calcio total, no el iónico (p. 43)']; }],
    ['Albúmina +0,5', 'alb', () => { s.alb = Math.min(5, s.alb + 0.5); return ['Albúmina ' + coma(s.alb), 'Sube el calcio total, no el iónico (p. 43)']; }],
    ['pH −0,05', 'ph', () => { s.ph = Math.max(7.0, s.ph - 0.05); return ['pH ' + coma(s.ph, 2), 'La acidosis suelta calcio de la albúmina: el iónico sube un poco (p. 44)']; }],
    ['pH +0,05', 'ph', () => { s.ph = Math.min(7.7, s.ph + 0.05); return ['pH ' + coma(s.ph, 2) + ' (alcalosis)', 'La alcalosis pega el calcio a la albúmina: el iónico baja (p. 44)']; }],
    ['Transfundir 1 unidad', 'unidad', () => { M.unidad(s); return ['1 concentrado', 'El citrato quela el Ca iónico y la bolsa trae 2-3 mEq de K⁺ (p. 24-25, 44)']; }],
  ],
  tiempo: [['Pasar 10 min', 't10', () => { M.pasar(s, 1 / 6); return ['10 minutos', 'Se disipan los picos del magnesio y del calcio']; }], ['Pasar 1 h', 't60', () => { M.pasar(s, 1); return ['1 hora', 'Pasan las dosis, el efecto de la insulina y la orina']; }],
    ...Object.entries(M.PACIENTES).map(([k, p]) => [p.nombre, 'pac', () => { cambiarPaciente(k); return null; }, k])],
};
const TABS = [['mover', 'Mover'], ['reponer', 'Reponer'], ['calcio', 'Calcio'], ['tiempo', 'Tiempo']];
const botones = []; let pest = 'mover';
function ponerClk(r) { s.rate = r; return ['ClK ' + (r ? r + ' mEq/h' : 'parado'), r > 20 ? 'Más de 20 mEq/h: necesario solo en la hipopotasemia grave (p. 23)' : 'Habitual: hasta 20 mEq/h; un K⁺ lento es normal por la parte plana de la curva (p. 23)']; }
function montarDock() {
  $('dock-tabs').innerHTML = TABS.map(([c, n]) => `<button type="button" role="tab" data-pest="${c}" aria-selected="${c === pest}">${n}</button>`).join('');
  const panel = $('dock-panel');
  for (const [c] of TABS) {
    const d = document.createElement('div'); d.id = 'panel-' + c; d.hidden = c !== pest;
    const fila = document.createElement('div'); fila.className = 'fila'; d.append(fila);
    for (const [txt, act, fn, val] of MANDOS[c]) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = txt;
      if (['clk', 'via', 'mg', 'ca', 'alb', 'ph', 'pac'].includes(act)) b.setAttribute({ clk: 'data-clk', via: 'data-via', mg: 'data-mg', ca: 'data-ca', alb: 'data-alb', ph: 'data-ph', pac: 'data-pac' }[act], val ?? '1'); else b.dataset.act = act;
      b.addEventListener('click', () => {
        antes = lee(s); const r = fn();
        if (act === 'pac') return;
        refrescar(); if (r) decir(r[0], r[1]); if (modo === 'preguntas') return;
      });
      botones.push([b, act, val]); fila.append(b);
    }
    panel.append(d);
  }
  $('dock-tabs').addEventListener('click', e => { const b = e.target.closest('[data-pest]'); if (!b) return; pest = b.dataset.pest; $('dock-tabs').querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', String(x === b))); TABS.forEach(([c]) => $('panel-' + c).hidden = c !== pest); });
}
function pintarBotones() {
  for (const [b, act, val] of botones) {
    const on = (act === 'clk' && String(s.rate) === val) || (act === 'via' && s.via === val) || (act === 'puno' && s.hemolisis) || (act === 'pac' && clavePac === val);
    b.classList.toggle('on', on); if (act === 'clk' || act === 'via' || act === 'puno' || act === 'pac') b.setAttribute('aria-pressed', String(on));
  }
}
function cambiarPaciente(k) {
  clavePac = k; s = M.PACIENTES[k].s(); antes = null; $('pac-nombre').textContent = M.PACIENTES[k].nombre; guiaPaso = -1; $('guia').hidden = true;
  refrescar(); ficha(k); frase.textContent = `${M.PACIENTES[k].nombre}: pulsa un mando o «Explícame este estado».`;
}
function ficha(k) {
  $('lista-fuentes').innerHTML = FUENTES.map(([n, c]) => `<li>${n} · ${cita(c)}</li>`).join('');
  $('lista-notas').innerHTML = NOTAS.map(([t, x]) => `<div class="nota"><b>${t}:</b> ${x}</div>`).join('');
  $('lista-prof').innerHTML = PROFUNDIZAR.map(x => `<li>${x}</li>`).join('');
}
// ---------- guía de 3-5 pasos que señalan el dibujo ----------
let guiaPaso = -1;
function guia(dir) {
  const g = GUIAS[clavePac]; guiaPaso = Math.max(0, Math.min(g.pasos.length - 1, guiaPaso + dir)); const p = g.pasos[guiaPaso];
  document.querySelectorAll('#esc .luz').forEach(n => n.classList.remove('luz')); p.r.forEach(id => $(id)?.classList.add('luz'));
  const G = $('guia'); G.hidden = false;
  G.innerHTML = `<b>${g.tit} · paso ${guiaPaso + 1} de ${g.pasos.length}</b><p>${p.t} ${ORIGEN[p.o]} ${cita(p.c)}</p><div class="pasos-g"><button type="button" class="btn" id="g-ant" ${guiaPaso ? '' : 'disabled'}>‹ Anterior</button><button type="button" class="btn" id="g-sig">${guiaPaso < g.pasos.length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  $('g-ant').onclick = () => guia(-1); $('g-sig').onclick = () => guiaPaso < g.pasos.length - 1 ? guia(1) : (G.hidden = true, document.querySelectorAll('#esc .luz').forEach(n => n.classList.remove('luz')), guiaPaso = -1);
}
$('explicame').onclick = () => { guiaPaso = -1; guia(1); $('guia').scrollIntoView({ block: 'nearest' }); };
// ---------- toques en piezas y en «Ver en la ficha» ----------
$('esc').addEventListener('click', e => { const g = e.target.closest('.pieza'); if (g) $('pista').textContent = g.dataset.nombre; });
document.addEventListener('click', e => { const b = e.target.closest('.ver-ficha'); if (!b) return; const t = $('toast'); t.textContent = `En la app, esto abre la ficha «${b.dataset.nombre}» en el párrafo exacto.`; t.hidden = false; setTimeout(() => t.hidden = true, 2600); });
// ---------- modos ----------
export function ponerModo(m) {
  modo = m; $('modo-explorar').setAttribute('aria-selected', String(m === 'explorar')); $('modo-preguntas').setAttribute('aria-selected', String(m === 'preguntas'));
  $('dock-explorar').hidden = m !== 'explorar'; $('dock-estudio').hidden = m === 'explorar'; $('vista-preg').hidden = m === 'explorar'; $('abajo').hidden = m !== 'explorar'; $('explicame').hidden = m !== 'explorar'; $('guia').hidden = true;
  if (m === 'explorar') { tapar = false; cambiarPaciente(clavePac); } else mayeutica.empezar();
}
$('modo-explorar').onclick = () => ponerModo('explorar'); $('modo-preguntas').onclick = () => ponerModo('preguntas');
const mayeutica = montarMayeutica({ M, esc, frase, lee, set: (ns, nombre, taparCifras) => { s = ns; antes = null; clavePac = 'damian'; $('pac-nombre').textContent = nombre; tapar = !!taparCifras; refrescar(); }, destapar: () => { tapar = false; refrescar(); }, getS: () => s, decir: (a, x) => decir(a, x), fotos: v => { antes = v; } });
// ---------- bucle ----------
let t0 = performance.now();
function bucle(t) {
  const dt = Math.min(0.1, (t - t0) / 1000); t0 = t; esc.mover(dt);
  if (!reducido) esc.ecg.tick(dt, M.kSer(s), s.caEcg > 0.5, M.asistolia(s));
  requestAnimationFrame(bucle);
}
montarDock(); ficha(); cambiarPaciente('sano'); requestAnimationFrame(bucle);
seguirFrase(document.body, frase, { dock: $('dock') });
