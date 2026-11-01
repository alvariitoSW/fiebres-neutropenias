// Cráneo B «El corte con la cara». Reutiliza (importados, no copiados): crearTope (js/core/tope.js), seguirFrase (js/core/frase-vista.js).
// Copiado con marca TODO: dibujarCara/PUP (cara.js) y UMBRALES (modelo.js) → piezas comunes del bloque. Los botones del dock se crean UNA vez.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { PRES, IDEA, IMG, PDF, cita, FUENTES, NOTAS, PROFUNDIZAR, CRECERA } from './datos.js';
import { nuevo, leer, topes, avanzar, unidad, clamp, TIPOS, pad, pam, U } from './modelo.js';
import { escena } from './corte.js';
import { crearGuia, focoSvg } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, ERROR_SEG, CASO_SEG } from './pruebas.js';
import { FUENTES_EXTRA, NOTAS_EXTRA, hsaDtc, svgCaja, textoCaja, svgPpc, svgAuto, textoAuto, textoCo2, svgPenumbra, ICTUS } from './injertos.js';
const ERRORES = [ERROR, ERROR_SEG], CASOS = [{ ...CASO, titulo: 'Abundio 23 años', llevas: null }, CASO_SEG];
const $ = (id) => document.getElementById(id);
let s = nuevo(), modo = 'explorar', oculto = false, preset = 'abundio', foco = [], topeApi, firma = '';
const REV = { warfarina: 'Vitamina K 10 mg IV + concentrado de complejo protrombínico (Tabla 47.4)', dabigatrán: 'Idarucizumab (Tabla 47.4)', apixabán: 'Andexanet alfa (Tabla 47.5)' };
const cit = (c) => (c && c.p ? cita(c.p, c.f) : '');
let fraseT = '', fraseO = '';
function frase(t, o) { fraseT = t; fraseO = o; $('frase-txt').innerHTML = `${t} <span class="org">${o}</span>`; }
function aplicarTopes() {
  const lista = topes(s), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.titulo, t.texto]));
  if (f === firma) { topeApi.refrescar(); return; } firma = f;
  for (const c of ['me', 'desc', 'uncal', 'ppc', 'pic', 'pic80', 'sensor', 'edemasens', 'crece', 'pas', 'nitro', 'vpp', 'na', 'cran', 'resang', 'exc', 'vaso']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: { p: t.pag, f: t.ficha }, origen: t.origen, deshabilita: t.off, bajo: null });
}
function pintar() {
  const L = leer(s); aplicarTopes();
  $('cr-svg').innerHTML = escena(s, L, { oculto }) + focoSvg(foco);
  const ver = s.sensor && !oculto && s.tipo !== 'tronco';
  $('m-pa').textContent = `${s.pas}/${pad(s)}`; $('m-pam').textContent = L.P; $('m-pic').textContent = ver ? L.pic : (oculto ? '?' : '—'); $('m-ppc').textContent = ver ? L.ppc : (oculto ? '?' : '—');
  $('m-gcs').textContent = oculto ? '?' : L.gcs === null ? 'obedece' : L.gcs; $('m-na').textContent = s.na; $('m-t').textContent = `${s.t} ${unidad(s)}`;
  $('m-pic').parentElement.className = ver && L.pic >= U.pic ? 'mal' : ''; $('m-ppc').parentElement.className = ver && (L.ppc < U.ppcMin || L.ppc > U.ppcMax) ? 'mal' : '';
  document.querySelectorAll('[data-tipo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tipo === s.tipo)));
  document.querySelectorAll('[data-anti]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.anti === s.anti)));
  document.querySelectorAll('[data-vent]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vent === s.vent)));
  document.querySelectorAll('[data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === preset)));
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  $('o-mas').textContent = `masa ${s.masa} %`; $('r-pas').value = s.pas; $('o-pas').textContent = `PAS ${s.pas} · PAM ${L.P}`;
  $('b-rev').textContent = s.rev ? 'Revertido ✔' : s.anti === 'ninguno' ? 'Revertir (sin anticoagulante)' : `Revertir: ${REV[s.anti].split(' (')[0]}`;
  $('b-hora').textContent = `Avanzar 1 ${unidad(s)} · ${s.t}`; $('b-dren').textContent = `Drenar LCR · ${s.drenaje}`; $('b-hiper').textContent = `Salino 3 % 250 mL · ${s.hiper}`; $('b-mani').textContent = `Manitol (menos eficaz) · ${s.mani}`;
  $('b-sens').textContent = s.sensor ? 'Sensor de PIC: puesto' : 'Sensor de PIC: sin poner'; $('b-sens').setAttribute('aria-pressed', String(s.sensor));
  $('b-exc').textContent = s.exc ? 'Aneurisma cerrado ✔' : 'Cerrar aneurisma'; $('b-nimo').textContent = s.nimo ? 'Nimodipino oral ✔' : 'Nimodipino 60 mg/4 h oral'; $('b-cran').textContent = s.cran ? 'Hueso retirado ✔' : 'Hemicraniectomía';
  $('b-nitro').textContent = s.nitro ? 'Nitroprusiato dado' : 'Dar nitroprusiato (trampa)'; $('b-nitro').dataset.pend = '';
  $('b-exc').hidden = $('b-nimo').hidden = s.tipo !== 'hsa'; $('b-cran').hidden = s.tipo !== 'edema'; $('b-rev').hidden = !(s.tipo === 'hematoma' || s.tipo === 'ventricular');
  const im = IMG[s.tipo]; $('fig-img').src = `../../js/modules/libros/img/${im[0]}`; $('fig-cap').innerHTML = `${im[1]} ${cita(im[2], im[3])}`;
  injertos(L); topeApi.refrescar();
}
function injertos(L) {
  $('pv-svg').innerHTML = svgCaja(s, L); $('ppc-cab').innerHTML = svgPpc(L); $('pa-svg').innerHTML = svgAuto(s, L); $('co2-txt').textContent = textoCo2(s);
  const ict = s.tipo === 'edema'; $('pen-caja').hidden = !ict; if (ict) $('pen-svg').innerHTML = svgPenumbra(L);
  const d = hsaDtc(s, L), hsa = s.tipo === 'hsa'; $('dtc-s').hidden = !hsa; if (hsa) $('m-dtc').textContent = oculto ? '?' : d === null ? 'sin señal' : `${d} cm/s`;
}
const msg = { mas: ['Crece la masa: sube la PIC, se desvía la línea media y el uncus se acerca a la tienda.', 'ficha p. 10-11, 45 · cuánto: ilustrativo'], menos: ['Menos masa: baja la presión y el cerebro vuelve a su sitio.', 'ficha p. 45 · ilustrativo'],
  hiper: ['Bolo de salino hipertónico: baja la PIC y sube el Na⁺ (el objetivo es 145-155).', 'ficha p. 41 · cuánto baja: ilustrativo'], mani: ['Manitol: baja la PIC menos que el hipertónico.', 'ficha p. 41 · magnitud ilustrativa'],
  dren: ['Drena LCR: baja la PIC; con sangre ventricular es lo que trata la hidrocefalia.', 'ficha p. 45 · ilustrativo'], rev: ['Anticoagulante revertido: el hematoma deja de crecer.', 'ficha p. 42-44'], cran: ['Se retira el hueso: la caja se abre y la PIC cae.', 'ficha p. 40 · magnitud ilustrativa'],
  nitro: ['Nitroprusiato: sube la PIC. No se usa en el ictus agudo.', 'ficha p. 36'], exc: ['Aneurisma cerrado: se evita el resangrado.', 'ficha p. 47'], nimo: ['Nimodipino oral 60 mg/4 h: menos déficits, misma supervivencia.', 'ficha p. 48'] };
function hacer(a, v) {
  if (a === 'mas') s.masa = clamp(s.masa + (v ?? 10), 0, 100); else if (a === 'menos') s.masa = clamp(s.masa - 10, 0, 100);
  else if (a === 'hiper') { s.hiper++; s.na += 5; } else if (a === 'mani') s.mani++; else if (a === 'dren') s.drenaje = Math.min(3, s.drenaje + 1);
  else if (a === 'rev') s.rev = true; else if (a === 'cran') s.cran = true; else if (a === 'nitro') s.nitro = true;
  else if (a === 'exc') s.exc = true; else if (a === 'nimo') s.nimo = true; else if (a === 'hora') avanzar(s); else if (a === 'hora3') { avanzar(s); avanzar(s); avanzar(s); } else if (a === 'dia5') { s.t = 5; }
  else if (a === 'sens') s.sensor = !s.sensor;
  const m = msg[a]; if (m) frase(...m); pintar();
}
function ponerPreset(c) { preset = c; s = nuevo(PRES[c][1]); oculto = false; foco = []; guiaApi.abrir(c); frase('El cráneo es una caja cerrada: si crece algo dentro, la presión sube y lo ves en la pupila y en la mano.', 'ficha p. 10-11, 45 · cuánto: ilustrativo'); modoPrueba('explorar'); pintar(); }
function ponerTipo(t) { s = { ...nuevo({ tipo: t, pas: s.pas }) }; s.sensor = t !== 'edema'; frase(`Paciente con ${TIPOS[t].toLowerCase()}: mismo corte, otra lesión.`, 'ilustrativo'); pintar(); }
// ---- apuesta, error, caso ----
let fin = '';
function modoPrueba(m, k = 0) {
  modo = m; const caja = $('prueba'); fin = ''; caja.dataset.fin = ''; caja.hidden = m === 'explorar'; caja.innerHTML = ''; caja.dataset.k = k; $('guia').hidden = m !== 'explorar' || $('guia').hidden;
  if (m === 'explorar') { oculto = false; return pintar(); }
  if (m === 'apuesta') { s = nuevo(PRES.abundio[1]); oculto = true; caja.innerHTML = `<h3>Apuesta</h3><p class="enun">${APUESTA.enun}</p><div class="ops">${APUESTA.ops.map((o, i) => `<button type="button" class="op" data-i="${i}">${o[0]}</button>`).join('')}</div><div class="resp"></div>`; }
  if (m === 'error') { const E = ERRORES[k]; s = nuevo(PRES[E.p][1]); oculto = false; caja.innerHTML = `<h3>Encuentra el error</h3><p class="enun">${E.enun}</p><div class="ops">${E.fr.map((o, i) => `<button type="button" class="op" data-i="${i}">${o[0]}</button>`).join('')}<button type="button" class="op neutra" data-nada="1">No hay más errores</button></div><div class="resp"></div>`; }
  if (m === 'caso') { oculto = false; paso(0); return; }
  pintar();
}
function paso(i) {
  const C = CASOS[+$('prueba').dataset.k], p = C.pasos[i]; s = nuevo(p.e); $('prueba').dataset.paso = i;
  $('prueba').innerHTML = `<h3>Caso · ${C.titulo}</h3><p class="enun">${p.enun}</p><div class="ops">${p.ops.map((o, k) => `<button type="button" class="op" data-i="${k}">${o[0]}</button>`).join('')}</div><div class="resp"></div>`; pintar();
}
$('prueba').addEventListener('click', (ev) => {
  const b = ev.target.closest('.op'); if (!b || b.disabled) return; const i = +b.dataset.i, caja = $('prueba'), r = caja.querySelector('.resp');
  const dar = (o, ok) => { b.classList.add(ok ? 'bien' : 'mal'); r.innerHTML = `<p class="por ${ok ? 'ok' : 'no'}">${ok ? '✔ ' : '✖ '}${o[2]} ${cita(o[3], o[4])}</p>`; };
  if (modo === 'apuesta') { const o = APUESTA.ops[i]; dar(o, o[1]); caja.querySelectorAll('.op').forEach((x) => (x.disabled = true)); oculto = false; s.masa = APUESTA.fin.masa; fin = 'ok'; caja.dataset.fin = '1'; frase('Sin operar, la compresión baja por el tronco y la mano pasa a flexión y extensión.', 'ficha p. 10-11'); pintar(); }
  else if (modo === 'error') {
    const E = ERRORES[+caja.dataset.k], hallados = () => caja.querySelectorAll('.op.bien').length, total = E.fr.filter((x) => x[1]).length, cerrar = () => { caja.querySelectorAll('.op').forEach((x) => (x.disabled = true)); fin = 'ok'; caja.dataset.fin = '1'; if (!+caja.dataset.k) r.insertAdjacentHTML('beforeend', '<button type="button" class="b prim" data-otro="error">Otro error: Segismundo</button>'); };
    if (b.dataset.nada) { const falta = hallados() < total; r.insertAdjacentHTML('beforeend', `<p class="por ${falta ? 'no' : 'ok'}">${falta ? '✖ ' : '✔ '}${E.nada[falta ? 0 : 1]}</p>`); if (!falta) cerrar(); return; }
    const o = E.fr[i]; r.querySelectorAll('.por').forEach((x) => x.remove()); dar(o, o[1]); if (!o[1]) b.disabled = true; if (hallados() >= total) cerrar(); }
  else if (modo === 'caso') {
    const C = CASOS[+caja.dataset.k], k = +caja.dataset.paso, o = C.pasos[k].ops[i]; dar(o, o[1]); caja.querySelectorAll('.op').forEach((x) => (x.disabled = true));
    const ef = o[5] || {}; if (ef.hiper) { s.hiper++; s.na += 5; } if (ef.dren) s.drenaje++; if (ef.pas) s.pas = ef.pas; if (ef.vent) s.vent = ef.vent; if (ef.masa) s.masa = ef.masa; pintar();
    r.insertAdjacentHTML('beforeend', k < C.pasos.length - 1 ? `<button type="button" class="b prim" data-sig="${k + 1}">Siguiente paso</button>` : `<div class="llevas"><b>Lo que te llevas</b><ul>${(C.llevas ? C.llevas.map((x) => `<li>${x[0]} ${cita(x[1], { 35: 'mn-isq-vm', 42: 'mn-hic-warfarina', 45: 'mn-hic-ppc' }[x[1]])}</li>`) : LLEVAS.map((x) => `<li>${x}</li>`)).join('')}</ul></div>${+caja.dataset.k ? '' : '<button type="button" class="b prim" data-otro="caso">Otro caso: Segismundo</button>'}`);
    if (k === C.pasos.length - 1) { fin = 'ok'; caja.dataset.fin = '1'; }
  }
});
$('prueba').addEventListener('click', (ev) => { const b = ev.target.closest('[data-sig]'); if (b) paso(+b.dataset.sig); const o = ev.target.closest('[data-otro]'); if (o) modoPrueba(o.dataset.otro, 1); });
// ---- el dock: botones creados una vez ----
const seg = (id, at, vals) => `<div class="fila" id="${id}">${vals.map(([v, t]) => `<button type="button" data-${at}="${v}" aria-pressed="false">${t}</button>`).join('')}</div>`;
$('dock-panel').innerHTML = `
  <div class="mando"><b class="dock-nota">Qué ocupa lugar</b>${seg('s-tipo', 'tipo', Object.entries(TIPOS))}<div class="fila"><button type="button" id="b-menos" data-a="menos" class="b">Masa −10 %</button><output id="o-mas"></output><button type="button" id="b-mas" data-a="mas" class="b">Masa +10 %</button></div><span class="peq">Tamaño de la masa: ilustrativo</span></div>
  <div class="mando"><b class="dock-nota">Anticoagulante (crece el hematoma hasta revertirlo)</b>${seg('s-anti', 'anti', [['ninguno', 'Ninguno'], ['warfarina', 'Warfarina'], ['dabigatrán', 'Dabigatrán'], ['apixabán', 'Apixabán']])}<div class="fila"><button type="button" id="b-rev" data-a="rev" class="b"></button><button type="button" id="b-hora" data-a="hora" class="b"></button></div></div>
  <div class="mando"><b class="dock-nota">Cirugía y aneurisma</b><div class="fila"><button type="button" id="b-cran" data-a="cran" class="b"></button><button type="button" id="b-exc" data-a="exc" class="b"></button><button type="button" id="b-nimo" data-a="nimo" class="b"></button></div></div>`;
$('dock-medir').innerHTML = `
  <svg id="ppc-cab" class="ppc-cab" viewBox="0 0 390 36" role="img" aria-label="Presión de perfusión cerebral: PAM menos PIC"></svg>
  <div class="mando"><label>Presión arterial <output id="o-pas"></output><input type="range" id="r-pas" min="70" max="214" step="2" value="128"></label><span class="peq">PAD supuesta = 55 % de la PAS · ilustrativo</span><button type="button" id="b-nitro" data-a="nitro" class="b"></button></div>
  <div class="mando"><b class="dock-nota">Bajar la presión</b><div class="fila"><button type="button" id="b-dren" data-a="dren" class="b"></button></div><div class="fila"><button type="button" id="b-hiper" data-a="hiper" class="b"></button><button type="button" id="b-mani" data-a="mani" class="b"></button></div></div>
  <div class="mando"><b class="dock-nota">Respirador</b>${seg('s-vent', 'vent', [['esp', 'Espontánea'], ['vpp', 'Presión positiva'], ['hv', 'Hiperventilar']])}<button type="button" id="b-sens" data-a="sens" class="b"></button></div>`;
$('presets').innerHTML = Object.entries(PRES).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v[0]}</button>`).join('');
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('[data-a]'); if (a && !a.disabled) return hacer(a.dataset.a);
  const t = ev.target.closest('[data-tipo]'); if (t) return ponerTipo(t.dataset.tipo);
  const an = ev.target.closest('[data-anti]'); if (an) { s.anti = an.dataset.anti; s.rev = false; return pintar(); }
  const v = ev.target.closest('[data-vent]'); if (v) { s.vent = v.dataset.vent; return pintar(); }
  const pr = ev.target.closest('[data-pre]'); if (pr) return ponerPreset(pr.dataset.pre);
  const m = ev.target.closest('.modos [data-modo]'); if (m) return modoPrueba(m.dataset.modo);
  const pe = ev.target.closest('[data-pest]'); if (pe) { document.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === pe))); $('dock-panel').hidden = pe.dataset.pest !== 'dar'; $('dock-medir').hidden = pe.dataset.pest === 'dar'; return ajustarDock(); }
  const vf = ev.target.closest('.ver-ficha'); if (vf) { const t2 = $('toast'); t2.textContent = `En la app: abre la ficha y resalta el párrafo #${vf.dataset.resaltar.slice(1)} (p. ${vf.dataset.pag}).`; t2.hidden = false; setTimeout(() => (t2.hidden = true), 3000); }
});
$('mas-mandos').addEventListener('click', () => { const a = $('dock').classList.toggle('abierto'); $('mas-mandos').setAttribute('aria-expanded', String(a)); $('mas-mandos').textContent = a ? 'Menos mandos ▴' : 'Más mandos ▾'; ajustarDock(); });
$('r-pas').addEventListener('input', () => { s.pas = +$('r-pas').value; pintar(); });
$('fuentes').innerHTML = [...FUENTES, ...FUENTES_EXTRA].map((f) => `<li>${f[0]} <span class="org">${f[1]}</span></li>`).join('') + `<li><a href="${PDF}" target="_blank" rel="noopener">Abrir el PDF</a></li>`;
$('notas').innerHTML = [...NOTAS, ...NOTAS_EXTRA].map((n) => `<p class="para"><b>${n[0]}:</b> ${n[1]}</p>`).join('');
$('profundizar').innerHTML = PROFUNDIZAR.map((x) => `<li>${x}</li>`).join(''); $('crecera').innerHTML = CRECERA.map((x) => `<li>${x}</li>`).join('');
$('idea').innerHTML = IDEA; $('pv-txt').innerHTML = textoCaja; $('pa-txt').innerHTML = textoAuto; $('ictus-lista').innerHTML = ICTUS();
function ajustarDock() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
const guiaApi = crearGuia({ caja: $('guia'), hacer: (a, v) => (a === 'hora3' ? hacer('hora3') : hacer(a, v)), setFoco: (z) => { foco = z; $('cr-svg').innerHTML = escena(s, leer(s), { oculto }) + focoSvg(foco); }, cita: cit0 });
function cit0(p, f) { return cita(p, f); }
topeApi = crearTope({ monitor: $('monitor'), dock: $('dock'), cita: cit });
$('monitor').after(document.querySelector('.tope-avisos'));   // los avisos bajo el monitor: no engordan el dock fijo
new ResizeObserver(ajustarDock).observe($('dock')); new ResizeObserver(ajustarDock).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
ponerPreset('abundio');
window.__cr = { get s() { return s; }, leer: () => leer(s), topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, hacer, ponerPreset, modoPrueba, ponerTipo, pintar };
