// «Iones vivos · A pie de cama»: el monitor arriba, la gasometría con iones, las bombas con reloj y una lupa que abre la célula.
import { crearTope } from '../../../js/core/tope.js';
import { bombaMini } from '../../../js/core/bomba.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { PACIENTES, ORDEN, TOPES, NOTAS, FUENTES, PROFUNDIZAR, cita, pag } from './datos.js';
import * as M from './motor.js';
import { crearEcg } from './ecg.js';
import { pintarCelula, pintarFig362, pintarFig381, montarLeyenda } from './lupa.js';
import { montarEstudio } from './estudio.js';

const $ = id => document.getElementById(id);
let s = M.nuevo('damian'), correr = false, ocultaK = false;
const ecg = crearEcg($('ecg-svg'));
const tope = crearTope({ monitor: $('mon'), dock: $('dock'), cita: c => cita(c) });
const activos = new Set();

// ---------- Frase viva (corta, con su página) ----------
const frase = (t, p) => { $('frase-txt').innerHTML = t + (p ? ` <span class="cita"><a href="${pag(p)}" target="_blank" rel="noopener">p. ${p}</a></span>` : ''); };

// ---------- Construcción única de los mandos (los botones se crean una vez y se repintan) ----------
const BOTONES = [
  { sec: 'clk', tit: 'Cloruro potásico (ClK)', nota: 'Estándar: 20 mEq en 100 mL de salino en 1 h; máximo habitual 20 mEq/h, 40 si es grave. Por cava superior, nunca más de 20 (p. 23).', cuerpo: `
    <div class="fila" role="group" aria-label="Ritmo del ClK"><button type="button" data-clk-tasa="10">10 mEq/h</button><button type="button" data-clk-tasa="20">20 mEq/h</button><button type="button" data-clk-tasa="40">40 mEq/h</button></div>
    <div class="fila" role="group" aria-label="Vía"><button type="button" data-clk-via="periferica">Vena grande o periférica</button><button type="button" data-clk-via="cava">Cava superior</button></div>
    <div class="fila"><button type="button" id="b-clk-ini">Iniciar ClK</button></div>` },
  { sec: 'mg', tit: 'Sulfato de magnesio', nota: '1 g de MgSO₄·7H₂O = 8 mEq de Mg (p. 36). Se pierde hasta el 50 % por la orina; el Mg sube tras el bolo y baja a los 15 min (p. 37-38).', cuerpo: `
    <div class="fila"><button type="button" id="b-mg-2">2 g en 5 min</button><button type="button" id="b-mg-6">6 g en 3 h</button></div>
    <div class="fila"><button type="button" id="b-renal" aria-pressed="false">Riñón que falla (aclaramiento &lt;30)</button></div>` },
  { sec: 'ca', tit: 'Calcio intravenoso', nota: 'Gluconato 9 mg/mL de calcio elemental, cloruro 27 mg/mL (10 mL). Bolo ≤200 mg; luego 1-2 mg/kg/h (p. 45). En la hiperK arregla el ECG; el K⁺ no cambia (p. 26).', cuerpo: `
    <div class="fila"><button type="button" id="b-ca-glu">Gluconato 10 mL · 90 mg</button><button type="button" id="b-ca-cl">Cloruro 10 mL · 270 mg</button></div>
    <div class="fila" role="group" aria-label="Perfusión de calcio"><button type="button" data-ca-tasa="1">1 mg/kg/h</button><button type="button" data-ca-tasa="2">2 mg/kg/h</button><button type="button" data-ca-tasa="4">4 mg/kg/h</button><button type="button" id="b-ca-ini">Iniciar</button></div>` },
  { sec: 'ins', tit: 'Insulina, glucosa y nutrición', nota: 'Insulina 10 U + 50 mL de glucosa al 50 %: baja el K⁺ al menos 0,6 mEq/L (p. 27-28). La glucosa arrastra fosfato y Mg a la célula (p. 34, 49).', cuerpo: `
    <div class="fila"><button type="button" id="b-ins">Insulina 10 U + glucosa</button><button type="button" id="b-real">Realimentar (nutrición)</button><button type="button" id="b-real-no">Parar nutrición</button></div>` },
  { sec: 'otros', tit: 'Furosemida, fosfato y transfusión', nota: 'Furosemida: K⁺ y Mg²⁺ por la orina (p. 21, 34). Fosfato IV por peso (Tabla 38.5, p. 51). Cada concentrado de 18 días trae 2-3 mEq de K⁺ y citrato que quela el calcio (p. 25, 44).', cuerpo: `
    <div class="fila"><button type="button" id="b-furo">Furosemida 40 mg</button><button type="button" id="b-po4">Fosfato IV · 40 mmol</button></div>
    <div class="fila"><button type="button" id="b-tr1">+1 concentrado</button><button type="button" id="b-tr5">+5 concentrados</button></div>` },
];
function montarMandos() {
  $('bombas').innerHTML = BOTONES.map(b => `<div class="bomba" id="bm-${b.sec}"><div class="bomba-fig" id="bf-${b.sec}"></div><div><h3>${b.tit}</h3>${b.cuerpo}<p>${b.nota}</p></div></div>`).join('')
    + `<div class="bomba" id="bm-sl"><div></div><div><h3>Albúmina y pH</h3>
    <label class="deslizador"><span>Albúmina</span><b id="v-alb"></b><input id="r-alb" type="range" min="1" max="4.5" step="0.1" aria-label="Albúmina en g/dL"></label>
    <label class="deslizador"><span>pH</span><b id="v-ph"></b><input id="r-ph" type="range" min="7.1" max="7.6" step="0.01" aria-label="pH"></label>
    <p>Albúmina baja: baja el Ca total, no el iónico (p. 43). Alcalosis: el calcio se pega a la albúmina y baja el iónico (p. 44). El pH no mueve aquí el K⁺: el libro lo llama variable e impredecible (p. 21).</p></div></div>`;
}
const bomba = (k, l1, l2, avance, on) => { const e = $('bf-' + k); if (e) e.innerHTML = bombaMini({ l1, l2, avance, candado: false }); e.dataset.on = on ? '1' : ''; };

// ---------- Pintar todo desde el estado ----------
const f1 = (x, n = 1) => x.toFixed(n).replace('.', ',');
const rango = (v, a, b) => v < a ? 'mal' : v > b ? 'ojo' : 'bien';
function cifras() {
  const L = M.lecturas(s), p = s.p, b = s.bombas, kv = ocultaK ? '?' : f1(L.k);
  const fc = p.fc, fr = L.po4 < 1 ? 26 : 16;
  $('mon-cifras').innerHTML = `<div class="cifra"><b>${fc}</b><span>FC lpm · ilustrativo</span></div><div class="cifra ${L.ca < 0.9 ? 'mal' : ''}"><b>${L.pa.pas}/${L.pa.pad}</b><span>PA mmHg · ilustrativo</span></div><div class="cifra ${L.po4 < 1 ? 'mal' : ''}"><b>${fr}</b><span>FR /min · ilustrativo</span></div>`;
  const g = (id, v, et, u, ref, cls = '') => { const el = $(id); el.className = 'cifra ' + cls; el.innerHTML = `<b>${v}</b><span>${et} ${u}<br><i class="origen">${ref}</i></span>`; };
  g('g-ph', f1(L.ph, 2), 'pH', '', 'ficha · el que fijas', L.ph < 7.35 || L.ph > 7.45 ? 'ojo' : 'bien');
  g('g-hco3', f1(L.hco3, 0), 'HCO₃⁻', 'mEq/L', 'calculado (Henderson)');
  g('g-k', kv, 'K⁺', 'mEq/L', 'normal 3,5-5,5 · ficha p. 23', ocultaK ? 'ojo' : L.k < 3.5 ? 'mal' : L.k > 5.5 ? 'mal' : 'bien');
  g('g-mg', f1(L.mg), 'Mg²⁺', 'mEq/L', 'normal 1,4-2,0 · ficha p. 33', rango(L.mg, 1.4, 2.0));
  g('g-ca', f1(L.ca, 2), 'Ca²⁺ iónico', 'mmol/L', 'normal 1,15-1,25 · p. 43', rango(L.ca, 1.15, 1.25));
  g('g-cat', f1(L.fr.total), 'Ca total', 'mg/dL', 'normal 9-10 · p. 43', rango(L.fr.total, 9, 10));
  g('g-po4', f1(L.po4), 'Fosfato', 'mg/dL', 'normal 2,5-5 · p. 43', rango(L.po4, 2.5, 5));
  g('g-alb', f1(s.alb), 'Albúmina', 'g/dL', 'ilustrativo');
  $('r-alb').value = s.alb; $('r-ph').value = s.ph; $('v-alb').textContent = f1(s.alb) + ' g/dL'; $('v-ph').textContent = f1(s.ph, 2);
  $('hora').textContent = `Reloj de la bomba: ${Math.floor(s.min / 60)} h ${String(Math.round(s.min % 60)).padStart(2, '0')} min`;
  $('ecg-k').textContent = `K⁺ sérico ${ocultaK ? '?' : f1(L.k)} · el ECG lee ${ocultaK ? '?' : f1(Math.max(L.kEf, 0))}`;
}
function mandos() {
  const b = s.bombas, set = (id, f) => { const e = $(id); if (e) f(e); };
  document.querySelectorAll('[data-clk-tasa]').forEach(e => e.setAttribute('aria-pressed', String(+e.dataset.clkTasa === b.clk.tasa)));
  document.querySelectorAll('[data-clk-via]').forEach(e => e.setAttribute('aria-pressed', String(e.dataset.clkVia === b.clk.via)));
  document.querySelectorAll('[data-ca-tasa]').forEach(e => e.setAttribute('aria-pressed', String(+e.dataset.caTasa === b.ca.tasa)));
  set('b-clk-ini', e => { e.textContent = b.clk.on ? 'Parar ClK' : 'Iniciar ClK'; e.setAttribute('aria-pressed', String(b.clk.on)); });
  set('b-ca-ini', e => { e.textContent = b.ca.on ? 'Parar' : 'Iniciar'; e.setAttribute('aria-pressed', String(b.ca.on)); });
  set('b-real', e => e.setAttribute('aria-pressed', String(s.nutriOn)));
  set('b-renal', e => e.setAttribute('aria-pressed', String(s.renal)));
  bomba('clk', 'ClK', b.clk.on ? `${b.clk.tasa} mEq/h` : 'parada', b.clk.on ? 0.6 : 0.2, b.clk.on);
  bomba('mg', 'MgSO4', b.mg.on ? `${Math.round(b.mg.resta)} mEq` : 'parada', b.mg.on ? 0.5 : 0.2, b.mg.on);
  bomba('ca', 'Calcio', b.ca.on ? `${b.ca.tasa} mg/kg/h` : 'parada', b.ca.on ? 0.5 : 0.2, b.ca.on);
  bomba('ins', 'Insulina', s.nutriOn ? 'nutrición' : s.ins > 0.05 ? 'actúa' : 'parada', s.nutriOn ? 0.5 : 0.2, s.nutriOn);
  bomba('otros', 'Furosemida', 'bolo', 0.3, false);
}
function topesYa() {
  const t = M.topes(s), b = s.bombas, p = b.clk;
  if (!(p.pedido && p.via === 'cava' && p.tasa > 20)) t.clk = false; else { t.clk = true; p.on = false; }
  const dat = {
    clk: ['sello', '#b-clk-ini'], clkAviso: ['aviso', '[data-clk-tasa="20"]'], mg: ['sello', '#b-mg-2, #b-mg-6'], mgAviso: ['aviso', '#b-mg-6'],
    ca: ['sello', '#b-tr1, #b-tr5'], caAviso: ['aviso', '#b-tr5'], po4: ['sello', '#b-real'], caiv: ['sello', '#b-ca-glu, #b-ca-cl'], caivInf: ['sello', '#b-ca-ini'], comb: ['sello', '#b-clk-ini'],
  };
  for (const k of Object.keys(dat)) {
    const on = !!t[k];
    if (on && !activos.has(k)) { const d = TOPES[k]; tope.poner(k, { nivel: dat[k][0], titulo: d.titulo, texto: d.texto, cita: d.pag, origen: d.origen, deshabilita: dat[k][0] === 'sello' ? dat[k][1].split(', ') : [], bajo: dat[k][0] === 'aviso' ? dat[k][1].split(', ')[0] : null }); activos.add(k); }
    if (!on && activos.has(k)) { tope.quitar(k); activos.delete(k); }
  }
  if (t.caivInf) b.ca.on = false;
  if (t.comb) p.on = false;
  if (t.po4 && !activos.has('po4frase')) { activos.add('po4frase'); frase('Fosfato por debajo de 1 mg/dL: no sigas aumentando la nutrición; repón fosfato.', 51); } else if (!t.po4) activos.delete('po4frase');
  ecg.parada(t.clk ? 'Asistolia' : t.mg ? 'Parada' : '');
  tope.refrescar();
  return t;
}
export function repintar() {
  const t = topesYa(); cifras(); mandos();
  const L = M.lecturas(s); let nota = '';
  if (L.k < 3.5) nota = 'K⁺ bajo (U, T plana): pendiente'; else if (L.ca < 0.9) nota = 'QT largo por Ca²⁺ bajo: pendiente';
  ecg.pintar(0, Math.max(L.kEf, 4), s.p.fc, nota);
  if (!$('lupa').hidden) pintarLupa();
  tope.refrescar();
  return t;
}
function pintarLupa() { pintarCelula($('cel-svg'), s); $('f362-pie').textContent = pintarFig362($('f362-svg'), s); pintarFig381($('f381-svg'), s); }

// ---------- Acciones ----------
function cargar(id) {
  s = M.nuevo(id); activos.forEach(k => tope.quitar(k)); activos.clear(); ocultaK = false;
  document.querySelectorAll('#pacs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pac === id)));
  $('pac-res').textContent = s.p.resumen; frase(`${s.p.nombre}. ${s.p.resumen}.`);
  repintar();
}
const acc = {
  realimentar: () => { M.realimentar(s); frase('Realimentas: la insulina y la glucosa meten K⁺, fosfato y Mg²⁺ en la célula. El suero baja; el cuerpo no ha perdido nada.', 49); },
  parar: () => { M.parar(s); frase('Paras la nutrición: lo que entró en la célula se queda; el suero se recupera despacio.', 49); },
  ins: () => { M.insulinaGlucosa(s); frase('Insulina 10 U + glucosa: el K⁺ baja al menos 0,6 mEq/L, con pico a los 30-60 min.', 28); },
  furo: () => { M.furosemida(s); frase('Furosemida: pierdes K⁺ y Mg²⁺ por la orina (en la UCI es la causa líder de déficit de Mg).', 34); },
  po4: () => { M.fosfatoIV(s); frase('Fosfato IV (Tabla 38.5, 61-80 kg: 40 mmol si <1 mg/dL). Si el K⁺ es <4, el de potasio.', 51); },
  tr: n => { M.transfundir(s, n); frase(`${s.uni} concentrados: cada uno quela calcio con su citrato y trae 2-3 mEq de K⁺.`, 44); },
  glu: () => { M.calcioBolo(s, 'gluconato'); frase('Gluconato 10 mL (90 mg): el Ca²⁺ iónico sube; en la hiperK protege el ECG 30-60 min y el K⁺ no cambia.', 26); },
  cl: () => { M.calcioBolo(s, 'cloruro'); frase('Cloruro 10 mL (270 mg): el triple de calcio; la ficha lo reserva para el colapso.', 26); },
  mg: g => { M.mgBolo(s, g); frase(g <= 2 ? '2 g de MgSO₄ en 5 min: el Mg sube y a los 15 min vuelve a caer; hace falta perfusión.' : '6 g en 3 h (hipoMg moderada): la mitad se pierde por la orina.', 37); },
  clk: () => { const c = s.bombas.clk; c.on = !c.on; c.pedido = c.on; if (c.on) frase(`ClK a ${c.tasa} mEq/h: el suero sube despacio al principio (tramo plano de la Fig. 36.2).`, 19); else frase('ClK parado.'); },
  clkTasa: v => { const c = s.bombas.clk; c.tasa = v; c.pedido = c.on; },
  clkVia: v => { const c = s.bombas.clk; c.via = v; c.pedido = c.on; },
  caTasa: v => { s.bombas.ca.tasa = v; },
  caIni: () => { const c = s.bombas.ca; c.on = !c.on && c.tasa > 0; },
  renal: () => { s.renal = !s.renal; },
};
function montarEventos() {
  document.body.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const id = b.id, d = b.dataset;
    if (d.pac) return cargar(d.pac);
    if (d.clkTasa) acc.clkTasa(+d.clkTasa); else if (d.clkVia) acc.clkVia(d.clkVia); else if (d.caTasa) acc.caTasa(+d.caTasa);
    else if (id === 'b-clk-ini') acc.clk(); else if (id === 'b-ca-ini') acc.caIni(); else if (id === 'b-real') acc.realimentar(); else if (id === 'b-real-no') acc.parar();
    else if (id === 'b-ins') acc.ins(); else if (id === 'b-furo') acc.furo(); else if (id === 'b-po4') acc.po4(); else if (id === 'b-tr1') acc.tr(1); else if (id === 'b-tr5') acc.tr(5);
    else if (id === 'b-ca-glu') acc.glu(); else if (id === 'b-ca-cl') acc.cl(); else if (id === 'b-mg-2') acc.mg(2); else if (id === 'b-mg-6') acc.mg(6); else if (id === 'b-renal') acc.renal();
    else if (id === 'r-t15') avanzar(15); else if (id === 'r-t60') avanzar(60); else if (id === 'r-t360') avanzar(360);
    else if (id === 'r-play') { correr = !correr; b.setAttribute('aria-pressed', String(correr)); b.textContent = correr ? '⏸ Pausa' : '▶ Correr'; }
    else if (id === 'lupa-btn') { const h = $('lupa').hidden = !$('lupa').hidden; b.setAttribute('aria-expanded', String(!h)); b.textContent = h ? '🔍 Abrir la lupa: la célula' : '🔍 Cerrar la lupa'; if (!h) pintarLupa(); return; }
    else return;
    repintar(); window.dispatchEvent(new CustomEvent('iones:cambio'));
  });
  $('r-alb').addEventListener('input', e => { s.alb = +e.target.value; frase('Albúmina baja: el Ca total cae, el iónico no. Mídelo con electrodo, no corrijas con fórmulas (p. 43).', 43); repintar(); window.dispatchEvent(new CustomEvent('iones:cambio')); });
  $('r-ph').addEventListener('input', e => { s.ph = +e.target.value; frase('Más alcalosis: el calcio se pega a la albúmina y baja el iónico; el K⁺ no se toca (p. 21, 44).', 44); repintar(); window.dispatchEvent(new CustomEvent('iones:cambio')); });
}
function avanzar(min) { M.avanzar(s, min); window.dispatchEvent(new CustomEvent('iones:cambio')); }

// ---------- Bucles: el ECG corre en tiempo real; la bomba, si pulsas «Correr» (4 min por segundo) ----------
let ult = performance.now(), acumulado = 0;
function bucle(now) {
  const dt = Math.min(0.1, (now - ult) / 1000); ult = now;
  if (correr) { acumulado += dt * 4; while (acumulado >= 1) { acumulado -= 1; M.paso(s, 1); } topesYa(); cifras(); mandos(); if (!$('lupa').hidden && Math.random() < 0.1) pintarLupa(); }
  const L = M.lecturas(s); ecg.pintar(matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : dt, Math.max(L.kEf, 4), s.p.fc, L.k < 3.5 ? 'K⁺ bajo (U, T plana): pendiente' : L.ca < 0.9 ? 'QT largo por Ca²⁺ bajo: pendiente' : '');
  requestAnimationFrame(bucle);
}

// ---------- Arranque ----------
$('pacs').innerHTML = ORDEN.map(id => `<button type="button" data-pac="${id}" aria-pressed="false">${PACIENTES[id].nombre.split(',')[0]}<small>${PACIENTES[id].nombre.split(', ')[1]}</small></button>`).join('');
montarMandos(); montarEventos(); montarLeyenda($('leyenda'));
$('notas').innerHTML = NOTAS.map(n => `<div class="nota"><b>${n.tipo}.</b> ${n.t} ${cita(n.pag)}</div>`).join('');
$('fuentes').innerHTML = FUENTES.map(f => `<li>${f.t} ${cita(f.pag)}</li>`).join('');
$('profundizar').innerHTML = PROFUNDIZAR.map(t => `<li>${t}</li>`).join('');
seguirFrase(document.body, $('frase'), { dock: $('dock') });
window.__iones = {
  get s() { return s; }, M, cargar, acc, repintar, avanzar: m => { avanzar(m); repintar(); }, tope, activos,
  ocultarK: v => { ocultaK = v; repintar(); }, frase, lect: () => M.lecturas(s), ecg,
};
montarEstudio({ api: window.__iones, $, frase });
cargar('damian');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(bucle);
