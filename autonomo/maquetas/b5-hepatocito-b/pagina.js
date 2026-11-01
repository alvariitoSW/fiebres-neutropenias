// Hepatocito vivo · opción B «La fábrica por dentro».
// Reutiliza (importado, no copiado): js/core/tope.js (sellos y avisos), js/core/frase-vista.js (frase a la vista),
// js/core/motion.js (Motion para el carril, con «reducir movimiento» = estado final), patrón PASOS/opacidad de receptores-animados.js,
// la guía de 3-5 pasos y la apuesta/error/caso del molde b4-iones-b. Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { cargarMotion, sinMovimiento } from '../../../js/core/motion.js';
import { PDF, PRESETS, FUENTES, NOTAS, PROFUNDIZAR, VIAS_APAGADAS, IDEA, fichaDe } from './datos.js';
import { nuevo, leer, topes, fmt, vitales } from './modelo.js';
import { escena, leyenda, opNodo } from './dibujo.js';
import { crearGuia, focoSvg } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id);
let s = nuevo(), modo = 'explorar', preset = 'sano', oculto = false, foco = [], guiaApi, topeApi, firma = '', espera = null;
const cita = (c, id) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${c}" target="_blank" rel="noopener">PDF p. ${c}</a> · <button type="button" class="ver-ficha" data-resaltar="#${id || fichaDe(c)}" data-pag-ficha="${c}">p. ${c} · Ver en la ficha</button></span>`;
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
const N = () => (oculto ? '?' : fmt(leer(s).a));
function aplicarTopes() {
  const lista = topes(s), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of ['edema', 'diarrea', 'hipovol', 'cvvh', 'rifa', 'nofis']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off || [], bajo: t.bajo || null });
}
function pintar() {
  const L = leer(s); aplicarTopes();
  $('hep-svg').innerHTML = escena(s, L, oculto) + focoSvg(foco);
  const v = vitales(s), cap = L.a >= 300;
  $('mon-nh3').textContent = oculto ? '? µmol/L' : `${cap ? '≥' : ''}${fmt(L.a)} µmol/L`; $('mon-wh').textContent = oculto ? '?' : String(L.wh); $('mon-carril').textContent = `${s.func} %`;
  $('mon-dep').textContent = s.dep ? `${s.dep}/día` : 'sin lactulosa'; $('mon-pa').textContent = v.pa; $('mon-fc').textContent = v.fc;
  $('mon-astro').textContent = oculto ? 'Astrocito: ?' : `Astrocito: ${L.sw > 0.4 ? 'hinchado' : 'normal'}`;
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('.presets button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === preset)));
  document.querySelectorAll('[data-prod]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.prod === s.prod)));
  document.querySelectorAll('[data-dep]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.dep === s.dep)));
  $('b-rifa').textContent = `Rifaximina 400 mg ×3 · ${s.rifa ? 'encendida' : 'apagada'}`; $('b-rifa').setAttribute('aria-pressed', String(!!s.rifa));
  $('b-cvvh').textContent = `Hemofiltración (CVVH) · ${s.cvvh ? 'encendida' : 'apagada'}`; $('b-cvvh').setAttribute('aria-pressed', String(!!s.cvvh));
  $('o-func').textContent = s.func; if (+$('r-func').value !== s.func) $('r-func').value = s.func;
  if (L.edema && !oculto) $('fig').open = true;
  topeApi.refrescar(); $('leyenda').innerHTML = leyenda();
}
// Cada acción cambia el estado y dice, en una frase, qué se ve y de dónde sale
function hacer(a, v) {
  if (a === 'func') { s.func = v; frase(`Quedan ${v} % de hepatocitos: el carril de la urea procesa menos y el amonio arterial pasa a ${N()} µmol/L.`, 'dirección: ficha · p. 6; cifra ilustrativa'); }
  if (a === 'prod') { s.prod = v; frase(`Producción intestinal de NH₃ ${['baja', 'normal', 'alta'][v]} (dieta proteica, hemorragia digestiva): amonio arterial ${N()} µmol/L.`, 'ficha · p. 6 («sobre todo en el intestino»); niveles ilustrativos'); }
  if (a === 'dep') { s.dep = v; frase(v ? `Lactulosa con ${v} deposiciones/día: la luz del colon se acidifica y desaparecen los productores de amonio; amonio ${N()} µmol/L.` : 'Sin lactulosa: el colon sigue fabricando amonio sin freno.', 'ficha · p. 7; efecto ilustrativo'); }
  if (a === 'rifa') { s.rifa = s.rifa ? 0 : 1; frase(s.rifa ? `Rifaximina: antibiótico que no se absorbe; frena a las bacterias productoras. Amonio ${N()} µmol/L.` : 'Rifaximina apagada.', 'ficha · p. 7; efecto ilustrativo'); }
  if (a === 'cvvh') { s.cvvh = v === 1 ? 1 : s.cvvh ? 0 : 1; frase(s.cvvh ? `CVVH: filtra el NH₃ de la sangre sin pasar por el hígado; amonio ${N()} µmol/L. En el fallo agudo es superior y cuanto antes mejor.` : 'CVVH apagada.', 'ficha · p. 8; efecto ilustrativo'); if (s.cvvh && typeof espera === 'function') espera(); }
  pintar();
}
function ponerPreset(clave) {
  preset = clave; s = nuevo(PRESETS[clave].s); oculto = false; foco = []; frase(PRESETS[clave].txt, 'paciente inventado; cifras ilustrativas, umbrales de la ficha · p. 6-8'); pintar(); guiaApi.abrir(clave);
}
async function replay() {
  const nodos = [...document.querySelectorAll('#hep-svg [data-nodo]')];
  frase('Cuatro pasos: el NH₃ entra, se une al CO₂ en la mitocondria, pasa por el ciclo de la urea y sale como urea a la sangre. Cada paso se apaga cuando faltan hepatocitos.', 'ficha · p. 6; los pasos intermedios del ciclo se omiten');
  if (sinMovimiento()) return;
  const M = await cargarMotion().catch(() => null); if (!M) return;
  nodos.forEach((g, i) => M.animate(g, { opacity: [0.15, opNodo(s.func, i)] }, { duration: 0.5, delay: i * 0.6 }));
}
// ---- Pon a prueba ----
const fin = (caja, clave) => { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[clave].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; };
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = []; espera = null; delete caja.dataset.fin; guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : CASO; preset = def.preset; s = nuevo(PRESETS[def.preset].s);
  const tit = document.createElement('h3'); tit.textContent = m === 'apuesta' ? 'Apuesta antes de tocar' : m === 'error' ? 'Encuentra el error (hay 0, 1 o 2)' : CASO.titulo; caja.append(tit);
  if (m === 'apuesta') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes + ' ' + def.pregunta; const c = document.createElement('div'); c.className = 'ops'; caja.append(p, c);
    opciones(c, def.ops, () => { oculto = false; def.tras({ poner: (o) => { Object.assign(s, o); frase(`Con ${s.func} % de hepatocitos y la misma producción, el amonio arterial sube a ${fmt(leer(s).a)} µmol/L: menos depuración, no más producción.`, 'dirección: ficha · p. 6; cifra ilustrativa'); } }); pintar(); fin(caja, 'apuesta'); }, def.orden);
  } else if (m === 'error') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes; caja.append(p); let hechas = 0;
    def.frases.forEach((f) => { const c = document.createElement('div'), t = document.createElement('p'); t.className = 'enun'; t.textContent = f.t; c.append(t); const b = document.createElement('div'); b.className = 'ops'; c.append(b); caja.append(c);
      opciones(b, [{ t: 'Es un error', ok: f.error, por: f.por }, { t: 'Es correcta', ok: !f.error, por: f.por }], () => { if (++hechas === def.frases.length) { oculto = false; hacer('dep', 3); fin(caja, 'error'); } }); });
  } else caso(0, caja);
  pintar();
}
function caso(i, caja) {
  const st = CASO.pasos[i]; Object.assign(s, st.estado); oculto = false; foco = [];
  const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${CASO.pasos.length}. ${st.enun}`; const o = document.createElement('div'); c.append(p, o); caja.append(c);
  const sigue = () => { pintar(); if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); }); c.append(b); } else { $('fig').open = true; const f = document.createElement('button'); f.type = 'button'; f.className = 'b'; f.id = 'b-filtro'; f.textContent = 'Abrir el filtro vivo del amonio'; f.addEventListener('click', () => toast('En la app, este botón abre el filtro vivo en el estado «amonio»; VOLVER te trae a esta ficha.')); c.append(f); fin(caja, 'caso'); } };
  if (st.mando) { espera = () => { espera = null; const r = document.createElement('p'); r.className = 'por ok'; r.textContent = st.ok; c.append(r); sigue(); }; frase(st.enun, 'paciente inventado; ficha · p. 8'); pintar(); return; }
  opciones(o, st.ops, () => sigue(), st.orden); frase(`Paso ${i + 1}: ${fmt(leer(s).a)} µmol/L de amonio arterial en el modelo (ilustrativo).`, 'paciente inventado; cifras ilustrativas'); pintar();
}
const toast = (t) => { const e = $('toast'); e.textContent = t; e.hidden = false; clearTimeout(e._t); e._t = setTimeout(() => { e.hidden = true; }, 3000); };
// ---- Montaje (una vez) ----
function montar() {
  const seg = (id, attr, vals) => `<div class="fila" id="${id}">${vals.map(([v, t]) => `<button type="button" data-${attr}="${v}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  $('dock-panel').innerHTML = `
   <div class="mando"><label>Hepatocitos vivos <output id="o-func"></output> %<input type="range" id="r-func" min="0" max="100" step="5" value="100"></label></div>
   <div class="mando" id="m-prod"><b class="dock-nota">Producción intestinal de NH₃ (ilustrativa)</b>${seg('s-prod', 'prod', [[0, 'Baja'], [1, 'Normal'], [2, 'Alta']])}</div>
   <div class="mando" id="m-dep"><b class="dock-nota">Lactulosa: deposiciones al día</b>${seg('s-dep', 'dep', [[0, 'Sin'], [2, '2'], [3, '3'], [4, '4'], [6, '6']])}</div>
   <div class="mando" id="m-rifa"><button type="button" id="b-rifa" class="b" aria-pressed="false">Rifaximina</button></div>
   <div class="mando" id="m-cvvh"><button type="button" id="b-cvvh" class="b" aria-pressed="false">CVVH</button></div>`;
  $('dock-medir').innerHTML = '<div class="mando"><div class="presets" id="presets"></div></div>';
  $('presets').innerHTML = Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('');
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { if (modo !== 'explorar') { modo = 'explorar'; $('prueba').hidden = true; } ponerPreset(b.dataset.pre); } });
  $('r-func').addEventListener('input', (ev) => hacer('func', +ev.target.value));
  $('dock-panel').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.prod) hacer('prod', +b.dataset.prod); else if (b.dataset.dep) hacer('dep', +b.dataset.dep); else if (b.id === 'b-rifa') hacer('rifa'); else if (b.id === 'b-cvvh') hacer('cvvh'); });
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  $('b-replay').addEventListener('click', replay);
  $('hep-svg').addEventListener('click', (ev) => { const g = ev.target.closest('.via-off'); if (g) { const [n, d] = VIAS_APAGADAS[+g.dataset.via]; frase(`${n}: ${d}. Aquí no hace nada.`, 'otras fichas del libro'); } });
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; ajustarDock(); });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha'); if (f) toast(`En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`); const d = ev.target.closest('[data-pag]'); if (d) window.open(`${PDF}#page=${d.dataset.pag}`, '_blank'); });
  guiaApi = crearGuia({ caja: $('guia'), hacer: (a) => hacer(a, 1), setFoco: (z) => { foco = z; pintar(); }, cita });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`; $('cita-fig').innerHTML = cita(6);
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · <button type="button" class="enlace" data-pag="${p}">p. ${p}</button></li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuente no lo dice' ? 'La fuente no lo dice' : t === 'las fuentes discrepan' ? 'Las fuentes discrepan' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('profundizar').innerHTML = PROFUNDIZAR.map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('');
  topeApi = crearTope({ monitor: $('monitor'), dock, cita });
}
function ajustarDock() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
montar(); ponerPreset('sano'); ajustarDock();
new ResizeObserver(ajustarDock).observe($('dock')); new ResizeObserver(ajustarDock).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
window.__hep = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, vitales: () => vitales(s) };
