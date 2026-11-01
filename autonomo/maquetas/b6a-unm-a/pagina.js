// Unión neuromuscular vivo · opción A «La hendidura». Reutiliza (importados, no copiados): js/core/motion.js (Motion, vía anim.js), js/core/tope.js
// (topes con sello), js/core/frase-vista.js (frase viva a la vista), js/core/particulas.js (leyenda) y css/variables.css (tokens, vía b3-ritmo/base.css).
// En la app se enchufarán: calcBnm, calcIntubarMg, pulmón vivo `debilidad-neuromuscular` y ritmo vivo `hiperk` (aquí, enlaces de aviso).
// Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { leyendaParticulas } from '../../../js/core/particulas.js';
import { PDF, PRESETS, IDEA, PASOS, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, NEO, fichaDe, pagDe } from './datos.js';
import { nuevo, leer, topes, fmt, clamp } from './modelo.js';
import { escena, posicionesAch, NC } from './dibujo.js';
import { prepararMotion, moverAch, pulso } from './anim.js';
import { crearGuia } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id);
let s = nuevo('sera'), clave = 'sera', modo = 'explorar', oculto = false, foco = [], paso = 3, previas = [], guiaApi, topeApi, firma = '', reproduciendo = false;
const cita = (c) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${pagDe(c)}" target="_blank" rel="noopener">PDF p. ${pagDe(c)}</a> · <button type="button" class="ver-ficha" data-resaltar="#${fichaDe(c)}" data-pag-ficha="${pagDe(c)}">p. ${pagDe(c)} · Ver en la ficha</button></span>`;
const frase = (t, org) => { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; };
const CLAVES = ['sucMax', 'sucMaxC', 'rocMax', 'rocMaxC', 'cisMax', 'cisMaxC', 'neo70', 'neoC', 'fda', 'succK', 'succCerca', 'rocVia', 'sugNo', 'tof0', 'desp', 'p48', 'intubar', 'piri', 'cvC', 'hielo2', 'hieloC', 'emp', 'rec5', 'recC'];
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of CLAVES) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off, bajo: t.n === 'aviso' ? '#avisos' : null });
}
function pintar(mover = false) {
  const L = leer(s); aplicarTopes(L);
  const svg = $('un-svg'); svg.innerHTML = escena(s, L, paso, foco, oculto);
  if (mover) { const nuevas = posicionesAch(paso, Math.max(0, Math.ceil(NC * Math.min(100, L.recEf) / 100) - Math.round(L.lvl * Math.ceil(NC * Math.min(100, L.recEf) / 100)))); moverAch(svg, previas, nuevas); previas = nuevas; if (paso === 1) pulso(svg); }
  else previas = posicionesAch(paso, 0).length ? [...svg.querySelectorAll('.ach')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), o: +c.getAttribute('opacity') })) : [];
  const q = oculto ? '?' : null;
  $('m-tof').textContent = q || (s.est ? `${L.tof}/4` : '—'); $('m-fuerza').textContent = q || fmt(L.fuerza) + ' %';
  $('m-cv').textContent = s.via ? 'VM' : q || fmt(L.cv); $('m-pim').textContent = s.via ? 'VM' : q || fmt(L.pim);
  $('m-k').textContent = fmt(L.k, 1); $('m-fc').textContent = fmt(L.fc); $('m-secr').textContent = ['—', '↑', '↑↑', '↑↑↑'][Math.min(3, L.secr)];
  $('m-ptosis').textContent = L.ptosis ? `−${fmt(L.ptosis, 1)} mm` : '—'; $('m-rec').textContent = s.rec + ' %'; $('m-t').textContent = s.t < 120 ? `${fmt(s.t)} min` : `${fmt(s.t / 60, 1)} h`;
  topeApi.refrescar();
  $('b-est').setAttribute('aria-pressed', String(s.est)); $('b-est').textContent = s.est ? 'Estímulo repetido (TOF)' : 'Estímulo único';
  $('b-via').setAttribute('aria-pressed', String(s.via)); $('b-via').textContent = s.via ? 'Intubado y ventilado' : 'Sin vía aérea';
  $('b-sed').setAttribute('aria-pressed', String(s.sed)); $('b-sed').textContent = s.sed ? 'Sedación profunda: sí' : 'Sedación: no';
  $('b-piri').setAttribute('aria-pressed', String(s.piri));
  $('b-perf-menos').disabled = s.perf <= 0; $('b-perf-mas').disabled = $('b-perf-mas').disabled || false; $('perf-txt').textContent = s.perf ? `Perfusión ${s.perf} µg/kg/min` : 'Sin perfusión';
  $('b-recm').firstChild.textContent = '− receptores'; 
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('.presets button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === clave)));
  document.querySelectorAll('[data-paso]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.paso === paso)));
  const pa = PASOS[paso - 1]; $('paso-txt').innerHTML = pa ? `<b>${paso}. ${pa[0]}.</b> ${pa[1]} ${pa[2] ? cita(pa[2]) : ''}<span class="origen-paso"> · ${pa[3] || 'ficha'}</span>` : 'Reposo: elige un paso del ciclo.';
  $('fig-hielo').classList.toggle('resalta', s.hielo >= 2);
  const enl = []; if (L.crit) enl.push(['pulmón vivo «debilidad neuromuscular»']); if (L.k >= 5.5) enl.push(['ritmo vivo «hiperpotasemia»']);
  $('enlaces').innerHTML = enl.map(([t]) => `<button type="button" class="enlace-app">Abrir el ${t}</button>`).join(''); $('enlaces').hidden = !enl.length;
}
const BTN = { suc: 'b-suc', roc: 'b-roc', cis: 'b-cis', neo: 'b-neo', hielo: 'b-hielo', piri: 'b-piri', gent: 'b-gent', mg: 'b-mg', recm: 'b-recm' };
function hacer(a, o = {}) {
  const id = a === 'sug' ? `b-sug${o.v}` : a === 'perf' && (o.d > 0 || o.v > s.perf) ? 'b-perf-mas' : BTN[a];
  if (id && $(id) && $(id).disabled) return;
  const L0 = leer(s); let t = '', org = '';
  if (a === 'est') { s.est = o.v ?? !s.est; t = s.est ? 'Estímulo repetido a 2 Hz: cuatro sacudidas. En la miastenia cada una es más débil que la anterior.' : 'Estímulo único: una sola sacudida.'; org = 'ficha · p. 24, 30; decaimiento ilustrativo'; }
  if (a === 't') { s.t = clamp(s.t + o.v, 0, 6000); const L = leer(s); t = `Pasan ${o.v >= 60 ? fmt(o.v / 60, 1) + ' h' : o.v + ' min'}: TOF ${L.tof}/4, fuerza ${fmt(L.fuerza)} %.`; org = 'tiempos: ficha · p. 29-31 (Tabla 46.7)'; }
  if (a === 'suc' || a === 'roc' || a === 'cis') { const x = s[a] || { dosis: 0, t0: s.t }; const paso_ = a === 'cis' ? 0.05 : 0.5; s[a] = { dosis: +(x.dosis + paso_).toFixed(2), t0: x.dosis ? x.t0 : s.t }; paso = 3; const nom = { suc: 'Succinilcolina', roc: 'Rocuronio', cis: 'Cisatracurio' }[a]; t = `${nom} ${fmt(s[a].dosis, a === 'cis' ? 2 : 1)} mg/kg (${fmt(s[a].dosis * s.peso)} mg): ${a === 'suc' ? 'dos ACh pegadas que dejan la copa abierta (despolarización mantenida); el K⁺ sale del músculo; dura 7-12 min.' : 'un tapón que ocupa la copa sin abrirla y compite con la ACh.'} Las copas bloqueadas no se contraen.`; org = 'ficha · p. 29-30 (Tabla 46.7); magnitud del bloqueo ilustrativa'; }
  if (a === 'perf') { s.perf = clamp(o.v ?? s.perf + (o.d || 0), 0, 3); if (s.perf && s.perfT == null) s.perfT = s.t; if (!s.perf) s.perfT = null; t = s.perf ? `Perfusión de cisatracurio ${s.perf} µg/kg/min: mantiene el bloqueo.` : 'Perfusión detenida.'; org = 'ficha · p. 29-30 (1-3 µg/kg/min); efecto ilustrativo'; }
  if (a === 'neo') { s.neo = Math.min(NEO.max, s.neo + NEO.paso); s.neoOk = s.neoOk || L0.tof >= 2; s.neoT ??= s.t; t = `Neostigmina ${s.neo} µg/kg: frena las tijeras (la ACh se acumula). ${s.neoOk ? 'Revierte un bloqueo moderado en 8-45 min.' : 'Con bloqueo profundo no alcanza.'} FC ${fmt(leer(s).fc)} y más secreciones.`; org = 'ficha · p. 31; FC ilustrativa'; paso = 4; }
  if (a === 'sug') { const tr = s.roc ? s.t - s.roc.t0 : 99, need = !s.roc || tr < 3 ? 16 : L0.tof === 0 ? 4 : 2; s.sug = { dosis: o.v, t0: s.t, ok: o.v >= need, need }; t = s.roc ? `Sugammadex ${o.v} mg/kg (${fmt(o.v * s.peso)} mg): un anillo envuelve al rocuronio. ${o.v >= need ? 'Basta: sale de la hendidura en 2-3 min.' : `Insuficiente: hacían falta ${need} mg/kg; el bloqueo baja solo a medias.`}` : `Sugammadex ${o.v} mg/kg: no hay rocuronio que envolver.`; org = 'ficha · p. 31 (16 profundo inmediato · 4 profundo · 2 moderado)'; }
  if (a === 'piri') { s.piri = !s.piri; t = s.piri ? 'Piridostigmina: como la neostigmina, frena las tijeras; la fuerza sube y las secreciones también.' : 'Piridostigmina retirada.'; org = 'ficha · p. 26; subida ilustrativa'; }
  if (a === 'gent' || a === 'mg') { s.emp = true; t = s.rec < 100 ? `${a === 'gent' ? 'Gentamicina' : 'Magnesio'} (Tabla 46.5): dificulta la transmisión; la fuerza cae.` : 'Sin miastenia casi no se nota, pero suma a cualquier bloqueo.'; org = 'ficha · p. 24; mecanismo: otra fuente pendiente'; }
  if (a === 'hielo') { s.hielo += 1; t = `Hielo ${s.hielo} min: la ptosis mejora ${fmt(leer(s).ptosis, 1)} mm.`; org = 'ficha · p. 24-25; mejoría ilustrativa; mecanismo: otra fuente pendiente'; }
  if (a === 'recm' || a === 'recp') { s.rec = clamp(s.rec + (a === 'recm' ? -5 : 5), 5, 100); t = `Receptores al ${s.rec} %: ${Math.max(1, Math.ceil(NC * s.rec / 100))} copas útiles de ${NC}. Anticuerpos rompen copas.`; org = 'ficha · p. 24; porcentaje ilustrativo'; paso = 3; }
  if (a === 'via') { s.via = o.v ?? !s.via; t = s.via ? 'Vía aérea asegurada: ventilación mecánica.' : 'Sin vía aérea.'; org = 'ficha · p. 30'; }
  if (a === 'sed') { s.sed = o.v ?? !s.sed; t = s.sed ? 'Sedación profunda y analgesia.' : 'Sin sedación.'; org = 'ficha · p. 31'; }
  if (a === 'reset') { s = nuevo(clave); t = PRESETS[clave].txt; org = 'paciente inventado'; }
  frase(t, org); pintar(true);
}
function ponerPreset(c) { clave = c; s = nuevo(c); oculto = false; foco = []; paso = 3; frase(PRESETS[c].txt, 'paciente inventado; cifras de la ficha'); pintar(); if (guiaApi) guiaApi.abrir(c === 'sano' ? 'mel' : c); }
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
async function reproducir() { if (reproduciendo) return; reproduciendo = true; $('b-play').textContent = '■ Parar'; for (let p = 1; p <= 5 && reproduciendo; p++) { paso = p; pintar(true); await dormir(1500); } reproduciendo = false; $('b-play').textContent = '▶ Reproducir'; }
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; delete caja.dataset.fin; caja.hidden = m === 'explorar'; oculto = false; foco = []; if (guiaApi) guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : CASO; clave = def.preset; s = nuevo(def.preset); firma = ''; paso = 3;
  const tit = document.createElement('h3'); tit.textContent = def.titulo; caja.append(tit);
  if (m === 'apuesta') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `${def.antes} ${def.pregunta}`; const c = document.createElement('div'); c.className = 'ops'; caja.append(p, c);
    opciones(c, def.ops, () => { oculto = false; def.tras({ hacer }); fin(caja, 'apuesta'); }, def.orden);
  } else if (m === 'error') {
    const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes; caja.append(p); let hechas = 0;
    def.frases.forEach((f) => { const c = document.createElement('div'), t = document.createElement('p'), b = document.createElement('div'); t.className = 'enun'; t.textContent = f.t; b.className = 'ops'; c.append(t, b); caja.append(c);
      opciones(b, [{ t: 'Es un error', ok: f.error, por: f.por }, { t: 'Es correcta', ok: !f.error, por: f.por }], () => { if (++hechas === def.frases.length) fin(caja, 'error'); }); });
  } else caso(0, caja);
  pintar();
}
function caso(i, caja) {
  const st = CASO.pasos[i]; const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${CASO.pasos.length}. ${st.enun}`; const o = document.createElement('div'); o.className = 'ops'; c.append(p, o); caja.append(c);
  opciones(o, st.ops, (op) => { if (op.haz) op.haz({ hacer }); pintar(true); if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); pintar(); }); c.append(b); } else fin(caja, 'caso'); }, st.orden);
}
function fin(caja, k) { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[k].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; }
function montar() {
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  const bt = (id, txt, cls = 'b') => `<button type="button" id="${id}" class="${cls}">${txt}</button>`;
  $('dock-panel').innerHTML = `
   <div class="mando"><b class="dock-nota">Estímulo y reloj</b><div class="fila">${bt('b-est', 'Estímulo repetido')}${bt('b-t1', '+1 min')}${bt('b-t10', '+10 min')}${bt('b-t60', '+1 h')}${bt('b-t720', '+12 h')}</div></div>
   <div class="mando"><b class="dock-nota">Relajantes (dosis por kg de peso ideal)</b><div class="fila">${bt('b-suc', 'Succinilcolina +0,5 mg/kg')}${bt('b-roc', 'Rocuronio +0,5 mg/kg')}${bt('b-cis', 'Cisatracurio +0,05 mg/kg')}</div></div>
   <div class="mando"><b class="dock-nota" id="perf-txt">Sin perfusión</b><div class="fila">${bt('b-perf-menos', 'Perfusión −1')}${bt('b-perf-mas', 'Perfusión +1 µg/kg/min')}</div></div>
   <div class="mando"><b class="dock-nota">Reversión</b><div class="fila">${bt('b-neo', 'Neostigmina +35 µg/kg')}${bt('b-sug2', 'Sugammadex 2 mg/kg')}${bt('b-sug4', 'Sugammadex 4 mg/kg')}${bt('b-sug16', 'Sugammadex 16 mg/kg')}</div></div>
   <div class="mando"><b class="dock-nota">Miastenia (receptores ilustrativos)</b><div class="fila">${bt('b-recm', '<span>− receptores 5 %</span>')}${bt('b-recp', '+ receptores 5 %')}${bt('b-hielo', 'Hielo +1 min')}${bt('b-piri', 'Piridostigmina')}${bt('b-gent', 'Gentamicina')}${bt('b-mg', 'Magnesio')}</div></div>`;
  $('dock-medir').innerHTML = `<div class="mando"><b class="dock-nota">Paciente</b><div class="presets" id="presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('')}</div></div><div class="mando"><div class="fila">${bt('b-via', 'Sin vía aérea')}${bt('b-sed', 'Sedación: no')}${bt('b-reset', 'Reiniciar fármacos')}</div></div>`;
  const ACC = { 'b-est': ['est'], 'b-t1': ['t', { v: 1 }], 'b-t10': ['t', { v: 10 }], 'b-t60': ['t', { v: 60 }], 'b-t720': ['t', { v: 720 }], 'b-suc': ['suc'], 'b-roc': ['roc'], 'b-cis': ['cis'], 'b-perf-menos': ['perf', { d: -1 }], 'b-perf-mas': ['perf', { d: 1 }], 'b-neo': ['neo'], 'b-sug2': ['sug', { v: 2 }], 'b-sug4': ['sug', { v: 4 }], 'b-sug16': ['sug', { v: 16 }], 'b-recm': ['recm'], 'b-recp': ['recp'], 'b-hielo': ['hielo'], 'b-piri': ['piri'], 'b-gent': ['gent'], 'b-mg': ['mg'], 'b-via': ['via'], 'b-sed': ['sed'], 'b-reset': ['reset'] };
  document.querySelector('.dock').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled || !ACC[b.id]) return; hacer(...ACC[b.id]); });
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { modo = 'explorar'; $('prueba').hidden = true; ponerPreset(b.dataset.pre); } });
  $('b-play').addEventListener('click', () => { if (reproduciendo) { reproduciendo = false; } else reproducir(); });
  $('b-prev').addEventListener('click', () => { paso = Math.max(1, paso - 1); pintar(true); }); $('b-next').addEventListener('click', () => { paso = Math.min(5, paso + 1); pintar(true); });
  $('pasos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-paso]'); if (b) { paso = +b.dataset.paso; pintar(true); } });
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; ajustar(); });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha, .enlace-app'); if (f) { const t = $('toast'); t.textContent = f.classList.contains('enlace-app') ? `En la app, esto abre el ${f.textContent.replace('Abrir el ', '')}.` : `En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600); } });
  guiaApi = crearGuia({ caja: $('guia'), hacer, cita, setFoco: (z, p) => { foco = z; if (p) paso = p; pintar(true); } });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · <a class="enlace" href="${PDF}#page=${p}" target="_blank" rel="noopener">p. ${p}</a></li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t[0].toUpperCase() + t.slice(1)}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  $('leyenda').innerHTML = leyendaParticulas(['k'], { titulo: 'Qué es cada pieza' }) + '<p class="min-nota">Bolita verde: acetilcolina. Copa: receptor (rota con Y roja = anticuerpo). X: acetilcolinesterasa. Hexágono: rocuronio o cisatracurio. Dos bolitas unidas: succinilcolina. Anillo: sugammadex. Triángulo: neostigmina. Cuadrado gris: K⁺ (el de la leyenda).</p>';
  topeApi = crearTope({ monitor: $('monitor'), dock, cita });
}
function ajustar() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
await prepararMotion(); montar(); ponerPreset('sera'); ajustar();
new ResizeObserver(ajustar).observe($('dock')); new ResizeObserver(ajustar).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
window.__un = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, paso: (p) => { paso = p; pintar(true); } };
