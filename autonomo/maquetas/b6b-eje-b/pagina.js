// Eje B «Dos glándulas, un enfermo». Reutiliza (importados): crearTope (js/core/tope.js), seguirFrase (js/core/frase-vista.js). Motion se carga a mano (script clásico).
// Los botones del dock se crean UNA vez y se repintan. Sin copiar el motor del shock vivo: aquí la PA es un cálculo ilustrativo propio, rotulado.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { PRES, IDEA, IMG, PDF, cita, REF, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, GUIAS } from './datos.js';
import { nuevo, leer, topes, clamp } from './modelo.js';
import { escena, focoSvg } from './escena.js';
import { APUESTA, ERROR, CASO } from './pruebas.js';
const $ = (id) => document.getElementById(id);
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
const num = (x) => String(x).replace('.', ',');
let s = nuevo('toribio'), modo = 'explorar', oculto = false, preset = 'toribio', lup = 'sr', foco = null, topeApi, firma = '', guiaI = 0, guiaC = null;
const CLAVES = ['vol', 'nat', 'na2', 'tormenta', 'fc140', 'mixedema', 'levo', 'yodo', 'eutiro', 'asma', 'ptu', 'prop', 'imposible'];
const cit = (c) => (c && c.p ? cita(c.p, c.f) : '');
const frase = (t, o) => { $('frase-txt').innerHTML = `${t} <span class="org">${o}</span>`; };
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.titulo, t.texto]));
  if (f === firma) { topeApi.refrescar(); return; } firma = f;
  for (const c of CLAVES) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag ? { p: t.pag, f: t.ficha } : null, origen: t.origen, deshabilita: t.off });
}
function pintar() {
  const P = PRES[s.pac], L = leer(s); aplicarTopes(L);
  $('eje-svg').innerHTML = escena(s, L, { lup }) + focoSvg(foco);
  const q = oculto ? '?' : null;
  $('m-pa').textContent = q || `${L.pas}/${L.pad}`; $('m-pam').textContent = q || L.pam.toFixed(0); $('m-fc').textContent = L.fc; $('m-rit').textContent = L.ritmo; $('m-t').textContent = num(L.t); $('m-na').textContent = L.na;
  $('m-gl').textContent = L.gluc; $('m-lac').textContent = num(L.lact); $('m-nor').textContent = num(s.na.toFixed(1));
  $('m-pa').parentElement.className = !oculto && L.pam < 65 ? 'mal' : ''; $('m-t').parentElement.className = L.t > 40 || L.t < 35 ? 'mal' : '';
  document.querySelectorAll('[data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === preset)));
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('[data-lup]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lup === lup)));
  document.querySelectorAll('[data-atd]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.atd === s.atd)));
  document.querySelectorAll('[data-bb]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.bb === s.bb)));
  $('b-vol').textContent = `Suero +500 mL · ${num(s.vol / 1000)} L`; $('o-na').textContent = `NA ${num(s.na.toFixed(1))} µg/kg/min`;
  $('b-hc').textContent = s.hc ? 'Hidrocortisona dada ✔' : s.pac === 'lucrecia' ? 'Hidrocortisona 300 mg + 100 mg/8 h' : 'Hidrocortisona 100 mg/8 h'; $('b-hc').setAttribute('aria-pressed', String(!!s.hc)); $('b-hc').disabled = !!s.hc;
  $('b-yodo').setAttribute('aria-pressed', String(s.yodo)); $('b-yodo').textContent = s.yodo ? 'Yodo puesto ✔' : 'Yodo 5 gotas/6 h';
  $('b-levo').setAttribute('aria-pressed', String(s.hor === 'levo')); $('b-lio').setAttribute('aria-pressed', String(s.hor === 'lio'));
  $('b-asma').hidden = s.pac !== 'lucrecia'; $('b-asma').setAttribute('aria-pressed', String(s.crisis)); $('b-asma').textContent = s.crisis ? 'Crisis de asma: sí' : 'Crisis de asma: no';
  $('fig-img').src = `../../js/modules/libros/img/${IMG[0]}`; $('fig-cap').innerHTML = `${IMG[1]} ${cita(IMG[2], IMG[3])}`;
  topeApi.refrescar();
}
// Motion: el eje se enciende paso a paso (hipotálamo → hipófisis → glándula → freno). Con «reducir movimiento», el estado final.
function secuencia() {
  if (REDUCIR || !window.Motion) return;
  const gs = [...$('eje-svg').querySelectorAll('.paso')];
  for (let i = 0; i < 4; i++) { const g = gs.filter((x) => +x.dataset.i === i); if (g.length) window.Motion.animate(g, { opacity: [0.15, 1] }, { delay: i * 0.45, duration: 0.4 }); }
}
function dosis(a, v) {
  const t = s.pac === 'lucrecia', P = PRES[s.pac];
  const m = {
    vol: ['Suero 500 mL: la PA sube muy poco si falla el eje. El tope de la maqueta es 3 L.', 'cuánto sube: ilustrativo · tope: fisiología general'],
    'na+': [`Noradrenalina ${num(s.na.toFixed(1))} µg/kg/min: sube la PA, pero no arregla el eje.`, 'cuánto sube: ilustrativo'], 'na-': [`Noradrenalina ${num(s.na.toFixed(1))} µg/kg/min.`, 'ilustrativo'],
    hc: t ? ['Hidrocortisona 300 mg IV de carga y 100 mg cada 8 h, solo en la tormenta: entra por fuera y frena la ACTH.', 'dosis: ficha p. 55 · freno: Libro Azul p. 4-6, Younes'] : [`Hidrocortisona 100 mg IV cada 8 h: entra por fuera y frena la ACTH${P.circ ? '; la PA sube' : ''}.`, `dosis: ficha p. ${s.pac === 'obdulia' ? 57 : 51} · freno: Libro Azul p. 4-6, Younes · cuánto sube la PA: ilustrativo`],
    ptu: t ? ['Propiltiouracilo: carga de 500-1.000 mg y 250 mg cada 4 h. Bloquea la síntesis de T4 y su conversión a T3.', 'ficha p. 55 (Tabla 51.4)'] : ['Propiltiouracilo 50-150 mg cada 8 h. Bloquea la síntesis de T4 y su conversión a T3.', 'ficha p. 55 (Tabla 51.4)'],
    mti: t ? ['Metimazol 60-80 mg al día en la tormenta; bloquea la síntesis de T4.', 'ficha p. 55 (Tabla 51.4)'] : ['Metimazol 10-20 mg una vez al día; bloquea la síntesis de T4.', 'ficha p. 55 (Tabla 51.4)'],
    yodo: ['Yoduro potásico saturado, 5 gotas (250 mg de yodo) cada 6 h, junto al antitiroideo: bloquea la síntesis y la secreción de T4.', 'ficha p. 55 (Tabla 51.4)'],
    prop: t ? ['Propranolol 60-80 mg por vía oral cada 4 h: frena la taquicardia y, a dosis altas, la conversión de T4 a T3.', 'ficha p. 54 (Tabla 51.3; la maqueta enseña solo la vía oral)'] : ['Propranolol 10-40 mg por vía oral, 3-4 veces al día: frena la taquicardia.', 'ficha p. 54 (Tabla 51.3)'],
    meto: ['Metoprolol 25-50 mg por vía oral, 2-3 veces al día: relativamente β1, útil con asma o insuficiencia cardíaca.', 'ficha p. 54 (Tabla 51.3)'], esmolol: ['Esmolol 50-100 µg/kg/min en infusión continua: se ajusta en minutos.', 'ficha p. 54 (Tabla 51.3)'],
    levo: ['Levotiroxina en bolo IV lento de 200-400 µg; después 50-100 µg orales al día (la IV es el 75 % de la oral).', 'ficha p. 57'], lio: ['Liotironina IV: carga de 5-20 µg y 2,5-10 µg cada 8 h hasta que despierte.', 'ficha p. 57'],
  };
  return m[a === 'atd' || a === 'bb' ? v : a];
}
function hacer(a, v) {
  const P = PRES[s.pac]; s.intento = '';
  if (a === 'vol') { if (s.vol >= 3000) return; s.vol += 500; }
  else if (a === 'na+') s.na = clamp(Math.round((s.na + 0.1) * 10) / 10, 0, 1); else if (a === 'na-') s.na = clamp(Math.round((s.na - 0.1) * 10) / 10, 0, 1);
  else if (a === 'hc') s.hc = 1;
  else if (a === 'atd') { if (s.pac === 'fulgencio' && v !== 'ninguno') s.intento = 'eutiro'; else s.atd = v; }
  else if (a === 'yodo') { if (s.pac === 'fulgencio') s.intento = 'eutiro'; else if (s.atd === 'ninguno') s.intento = 'yodo'; else s.yodo = !s.yodo; }
  else if (a === 'bb') { if (s.crisis && v !== 'ninguno') s.intento = 'bb'; else s.bb = v; }
  else if (a === 'levo' || a === 'lio') { if (s.pac === 'fulgencio') s.intento = 'eutiro'; else if (P.t < 35 && !s.hc) s.intento = 'levo'; else s.hor = s.hor === (a === 'levo' ? 'levo' : 'lio') ? 'ninguna' : (a === 'levo' ? 'levo' : 'lio'); }
  else if (a === 'asma') s.crisis = !s.crisis;
  const m = dosis(a, v); pintar();
  if (s.intento) { const t = topes(s, leer(s)).find((x) => x.c === s.intento || (s.intento === 'bb' && x.c === 'asma')); if (t) frase(`No se aplica: ${t.texto}`, t.origen); } else if (m) frase(...m);
  if (['hc', 'atd', 'yodo', 'bb', 'levo', 'lio'].includes(a) && !s.intento) secuencia();
}
function ponerPreset(c) { preset = c; s = nuevo(c); lup = PRES[c].lup; oculto = false; foco = null; modoPrueba('explorar'); abrirGuia(c); frase(`${PRES[c].n}, ${PRES[c].e} años · ${PRES[c].caso}. Toca una lupa para ver qué eje falla.`, 'caso inventado · constantes: ilustrativo'); pintar(); secuencia(); }
// ---- guía de 3-5 pasos ----
function abrirGuia(c) { guiaC = GUIAS[c]; guiaI = 0; pasoGuia(0); }
function pasoGuia(k) {
  const caja = $('guia'); if (!guiaC) { caja.hidden = true; return; }
  guiaI = clamp(k, 0, guiaC[1].length - 1); const p = guiaC[1][guiaI]; caja.hidden = modo !== 'explorar'; foco = p.z;
  caja.innerHTML = `<h3>${guiaC[0]} · paso ${guiaI + 1} de ${guiaC[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p, p.f)}${p.x ? ' ' + REF[p.x] : ''}</p><div class="fila-g">${p.haz ? '<button type="button" class="b prim" data-g="haz">Hazlo: ' + p.btn + '</button>' : ''}<button type="button" data-g="ant" ${guiaI ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${guiaI < guiaC[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  pintar();
}
$('guia').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-g]'); if (!b || !guiaC) return; const a = b.dataset.g, p = guiaC[1][guiaI];
  if (a === 'ant') pasoGuia(guiaI - 1); else if (a === 'sig') { if (guiaI < guiaC[1].length - 1) pasoGuia(guiaI + 1); else { guiaC = null; foco = null; $('guia').hidden = true; pintar(); } } else if (a === 'haz') { hacer(...p.haz); foco = p.z; pintar(); }
});
// ---- apuesta, error, caso ----
const opsHtml = (ops, extra = '') => `<div class="ops">${ops.map((o, i) => `<button type="button" class="op" data-i="${i}">${o[0]}</button>`).join('')}${extra}</div><div class="resp"></div>`;
function modoPrueba(m, k = 0) {
  modo = m; const caja = $('prueba'); caja.dataset.fin = ''; caja.dataset.k = k; caja.hidden = m === 'explorar'; caja.innerHTML = ''; if (m !== 'explorar') { $('guia').hidden = true; foco = null; } else if (guiaC) $('guia').hidden = false;
  if (m === 'explorar') { oculto = false; return pintar(); }
  if (m === 'apuesta') { s = nuevo(APUESTA.p); lup = 'sr'; oculto = true; caja.innerHTML = `<h3>Apuesta</h3><p class="enun">${APUESTA.enun}</p>${opsHtml(APUESTA.ops)}`; }
  if (m === 'error') { s = nuevo(ERROR.p); lup = 'ti'; oculto = false; caja.innerHTML = `<h3>Encuentra el error</h3><p class="enun">${ERROR.enun}</p>${opsHtml(ERROR.fr, '<button type="button" class="op neutra" data-nada="1">No hay ningún error</button>')}`; }
  if (m === 'caso') { oculto = false; lup = 'ti'; return paso(0); }
  pintar();
}
function paso(i) { const p = CASO.pasos[i]; s = { ...nuevo('obdulia'), ...p.e }; $('prueba').dataset.paso = i; $('prueba').dataset.fin = ''; $('prueba').innerHTML = `<h3>Caso · ${CASO.titulo} · paso ${i + 1} de ${CASO.pasos.length}</h3><p class="enun">${p.enun}</p>${opsHtml(p.ops)}`; pintar(); }
$('prueba').addEventListener('click', (ev) => {
  const sig = ev.target.closest('[data-sig]'); if (sig) return paso(+sig.dataset.sig);
  const b = ev.target.closest('.op'); if (!b || b.disabled) return; const i = +b.dataset.i, caja = $('prueba'), r = caja.querySelector('.resp');
  const dar = (o, ok) => { b.classList.add(ok ? 'bien' : 'mal'); r.innerHTML = `<p class="por ${ok ? 'ok' : 'no'}">${ok ? '✔ ' : '✖ '}${o[2]} ${cita(o[3], o[4])}</p>`; };
  const cerrar = () => { caja.querySelectorAll('.op').forEach((x) => (x.disabled = true)); caja.dataset.fin = '1'; };
  if (modo === 'apuesta') { const o = APUESTA.ops[i]; dar(o, o[1]); cerrar(); oculto = false; if (o[1]) s.hc = 1; pintar(); if (o[1]) secuencia(); }
  else if (modo === 'error') {
    if (b.dataset.nada) { r.innerHTML = `<p class="por no">✖ ${ERROR.nada[0]}</p>`; return; }
    const o = ERROR.fr[i]; dar(o, o[1]); if (o[1]) cerrar(); else b.disabled = true;
  } else if (modo === 'caso') {
    const k = +caja.dataset.paso, o = CASO.pasos[k].ops[i]; dar(o, o[1]); cerrar(); Object.assign(s, o[5] || {}); pintar();
    if (k < CASO.pasos.length - 1) r.insertAdjacentHTML('beforeend', `<button type="button" class="b prim" data-sig="${k + 1}">Siguiente paso</button>`);
    else r.insertAdjacentHTML('beforeend', `<div class="llevas"><b>Lo que te llevas</b><ul>${CASO.llevas.map((x) => `<li>${x[0]} ${cita(x[1], x[2])}</li>`).join('')}</ul></div>`);
  }
});
// ---- el dock: botones creados una vez ----
$('dock-panel').innerHTML = `
  <div class="mando"><b class="dock-nota">Circulación</b><div class="fila"><button type="button" id="b-vol" data-a="vol" class="b"></button></div><div class="fila"><button type="button" data-a="na-" class="b">NA −0,1</button><output id="o-na"></output><button type="button" data-a="na+" class="b">NA +0,1</button></div><span class="peq">Cuánto sube la PA con suero y noradrenalina: ilustrativo</span></div>
  <div class="mando"><b class="dock-nota">Corticoide</b><div class="fila"><button type="button" id="b-hc" data-a="hc" class="b" aria-pressed="false"></button></div></div>`;
const seg = (at, vals) => `<div class="fila">${vals.map(([v, t]) => `<button type="button" data-${at}="${v}" class="b" aria-pressed="false">${t}</button>`).join('')}</div>`;
$('dock-tiro').innerHTML = `
  <div class="mando"><b class="dock-nota">Antitiroideo y yodo</b>${seg('atd', [['ninguno', 'Ninguno'], ['ptu', 'Propiltiouracilo'], ['mti', 'Metimazol']])}<div class="fila"><button type="button" id="b-yodo" data-a="yodo" class="b" aria-pressed="false"></button></div></div>
  <div class="mando"><b class="dock-nota">Betabloqueante oral o esmolol</b>${seg('bb', [['ninguno', 'Ninguno'], ['prop', 'Propranolol oral'], ['meto', 'Metoprolol'], ['esmolol', 'Esmolol IV']])}<div class="fila"><button type="button" id="b-asma" data-a="asma" class="b" aria-pressed="false"></button></div></div>
  <div class="mando"><b class="dock-nota">Hormona tiroidea</b><div class="fila"><button type="button" id="b-levo" data-a="levo" class="b" aria-pressed="false">Levotiroxina IV 200-400 µg</button><button type="button" id="b-lio" data-a="lio" class="b" aria-pressed="false">Liotironina IV 5-20 µg</button></div></div>`;
$('presets').innerHTML = Object.entries(PRES).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.n}</button>`).join('');
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('[data-a]'); if (a && !a.disabled && a.closest('#dock')) return hacer(a.dataset.a);
  const at = ev.target.closest('[data-atd]'); if (at && !at.disabled) return hacer('atd', at.dataset.atd);
  const bb = ev.target.closest('[data-bb]'); if (bb && !bb.disabled) return hacer('bb', bb.dataset.bb);
  const pr = ev.target.closest('[data-pre]'); if (pr) return ponerPreset(pr.dataset.pre);
  const lu = ev.target.closest('[data-lup]'); if (lu) { lup = lu.dataset.lup; pintar(); return secuencia(); }
  const m = ev.target.closest('.modos [data-modo]'); if (m) return modoPrueba(m.dataset.modo);
  if (ev.target.closest('#paso-a-paso')) return secuencia();
  const pe = ev.target.closest('[data-pest]'); if (pe) { document.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === pe))); $('dock-panel').hidden = pe.dataset.pest !== 'circ'; $('dock-tiro').hidden = pe.dataset.pest === 'circ'; return ajustarDock(); }
  const vf = ev.target.closest('.ver-ficha'); if (vf) { const t2 = $('toast'); t2.textContent = `En la app: abre la ficha y resalta el párrafo #${vf.dataset.resaltar.slice(1)} (p. ${vf.dataset.pag}).`; t2.hidden = false; setTimeout(() => (t2.hidden = true), 3000); }
});
$('mas-mandos').addEventListener('click', () => { const ab = $('dock').classList.toggle('abierto'); $('mas-mandos').setAttribute('aria-expanded', String(ab)); $('mas-mandos').textContent = ab ? 'Menos mandos ▴' : 'Más mandos ▾'; ajustarDock(); });
$('fuentes').innerHTML = FUENTES.map((f) => `<li>${f[0]} <span class="org">${f[1]}</span></li>`).join('') + `<li><a href="${PDF}" target="_blank" rel="noopener">Abrir el PDF de Marino</a></li>`;
$('notas').innerHTML = NOTAS.map((n) => `<p class="para"><b>${n[0]}:</b> ${n[1]}</p>`).join('');
$('profundizar').innerHTML = PROFUNDIZAR.map((x) => `<li>${x}</li>`).join(''); $('crecera').innerHTML = CRECERA.map((x) => `<li>${x}</li>`).join(''); $('idea').innerHTML = IDEA;
function ajustarDock() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
topeApi = crearTope({ monitor: $('monitor'), dock: $('dock'), cita: cit });
$('monitor').after(document.querySelector('.tope-avisos'));
new ResizeObserver(ajustarDock).observe($('dock')); new ResizeObserver(ajustarDock).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
ponerPreset('toribio');
window.__eje = { get s() { return s; }, leer: () => leer(s), topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, hacer, ponerPreset, modoPrueba, pintar, setLup: (l) => { lup = l; pintar(); } };
