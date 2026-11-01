// Hepatocito vivo · «La fábrica por dentro» (Marino cap. 39). La página: estado, monitor, dock de mandos, dibujo, guía, pruebas y carril animado.
// Se carga al primer abrir (index.js). Usa las piezas comunes: core/tope.js (sellos y avisos), core/frase-vista.js (frase a la vista),
// core/motion.js (Motion, con «reducir movimiento» = estado final) y core/particulas.js (NH₃, urea y glutamina). Los botones del dock
// se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../core/tope.js';
import { seguirFrase } from '../../../core/frase-vista.js';
import { cargarMotion, sinMovimiento } from '../../../core/motion.js';
import { PDF, PRESETS, FUENTES, NOTAS, PROFUNDIZAR, VIAS_APAGADAS, IDEA, fichaDe, CRECERA, UBICACION, FLUIDOS } from '../../../data/hepatocito-vivo-data.js';
import { nuevo, leer, topes, fmt, vitales } from './modelo.js';
import { escena, leyenda, opNodo } from './dibujo.js';
import { crearGuia, focoSvg } from './guia.js';
import { cara, WH_TXT } from './cara.js';
import { APUESTA, ERROR, ERROR2, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById('hpv-' + id);
const R = $('raiz');
let s = nuevo(), modo = 'explorar', preset = 'sano', oculto = false, foco = [], guiaApi, topeApi, firma = '', espera = null;
// Enlace cruzado de siempre al párrafo exacto de la ficha (lo resuelve el listener delegado de home/index.js)
const ir = (id, txt) => { const u = UBICACION[id]; return `<button type="button" class="ver-ficha" data-especialidad="libros" data-view="${u[0]}" data-panel="${u[1]}" data-tab="${u[2]}" data-resaltar="#${id}">${txt}</button>`; };
const cita = (c, id) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${c}" target="_blank" rel="noopener">PDF p. ${c}</a> · ${ir(id || fichaDe(c), `p. ${c} · Ver en la ficha`)}</span>`;
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
const N = () => (oculto ? '?' : fmt(leer(s).a));
function aplicarTopes() {
  const lista = topes(s), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of ['edema', 'diarrea', 'hipovol', 'cvvh', 'rifa', 'nofis', 'tips', 'fl']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono || '', titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off || [], bajo: t.bajo || null });
}
function pintar() {
  const L = leer(s); aplicarTopes();
  $('svg').innerHTML = escena(s, L, oculto) + focoSvg(foco);
  const v = vitales(s), cap = L.a >= 300;
  $('mon-nh3').textContent = oculto ? '? µmol/L' : `${cap ? '≥' : ''}${fmt(L.a)} µmol/L`; $('mon-wh').innerHTML = oculto ? '?' : `${cara(L.wh)} ${L.wh} · ${WH_TXT[L.wh]} <i class="chip-ilus">ilustrativo</i>`; $('mon-carril').textContent = `${s.func} %`;
  $('mon-dep').textContent = s.dep ? `${s.dep} dep./día` : 'no'; $('mon-pa').textContent = v.pa + (v.nota ? ' ' + v.nota : ''); $('mon-fc').textContent = v.fc;
  $('mon-astro').textContent = oculto ? 'Astrocito: ?' : `Astrocito: ${L.sw > 0.4 ? 'hinchado' : 'normal'}`;
  R.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  R.querySelectorAll('.presets button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === preset)));
  R.querySelectorAll('[data-prod]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.prod === s.prod)));
  R.querySelectorAll('[data-dep]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.dep === s.dep)));
  $('o-rifa').textContent = s.rifa; if (+$('r-rifa').value !== s.rifa) $('r-rifa').value = s.rifa;
  $('b-cvvh').textContent = `Hemofiltración (CVVH) · ${s.cvvh ? 'encendida' : 'apagada'}`; $('b-cvvh').setAttribute('aria-pressed', String(!!s.cvvh));
  $('b-tips').textContent = `TIPS · ${s.tips ? 'puesto' : 'sin TIPS'}`; $('b-tips').setAttribute('aria-pressed', String(!!s.tips));
  R.querySelectorAll('[data-fl]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fl === s.fl)));
  $('o-func').textContent = s.func; if (+$('r-func').value !== s.func) $('r-func').value = s.func;
  if (L.edema && !oculto) $('fig').open = true;
  topeApi.refrescar();
}
// Cada acción cambia el estado y dice, en una frase, qué se ve y de dónde sale
function hacer(a, v) {
  if (a === 'func') { s.func = v; frase(`Quedan ${v} % de hepatocitos: el carril de la urea procesa menos y el amonio arterial pasa a ${N()} µmol/L.`, 'dirección: ficha · p. 6; cifra ilustrativa'); }
  if (a === 'prod') { s.prod = v; frase(`Producción intestinal de NH₃ ${['baja', 'normal', 'alta'][v]} (dieta proteica, hemorragia digestiva): amonio arterial ${N()} µmol/L.`, 'ficha · p. 6 («sobre todo en el intestino»); niveles ilustrativos'); }
  if (a === 'dep') { s.dep = v; frase(v ? `Lactulosa con ${v} deposiciones/día: la luz del colon se acidifica y desaparecen los productores de amonio; amonio ${N()} µmol/L.` : 'Sin lactulosa: el colon sigue fabricando amonio sin freno.', 'ficha · p. 7; efecto ilustrativo'); }
  if (a === 'rifa') { s.rifa = v; frase(v ? `Rifaximina ${v} día${v > 1 ? 's' : ''}: antibiótico que no se absorbe; frena a las bacterias productoras. ${v < 10 ? 'La ficha pide al menos 10 días. ' : ''}Amonio ${N()} µmol/L.` : 'Sin rifaximina.', 'ficha · p. 7 (400 mg ×3, ≥10 días); efecto ilustrativo'); }
  if (a === 'cvvh') { s.cvvh = v === 1 ? 1 : s.cvvh ? 0 : 1; frase(s.cvvh ? `CVVH: filtra el NH₃ de la sangre sin pasar por el hígado; amonio ${N()} µmol/L. En el fallo agudo es superior y cuanto antes mejor.` : 'CVVH apagada.', 'ficha · p. 8; efecto ilustrativo'); if (s.cvvh && typeof espera === 'function') espera(); }
  if (a === 'tips') { s.tips = s.tips ? 0 : 1; frase(s.tips ? `TIPS: la sangre de la porta salta el hígado y el NH₃ llega entero a la sangre arterial (${N()} µmol/L). Cambia un problema por otro: más riesgo de encefalopatía.` : 'Sin TIPS: la porta pasa por el hepatocito.', 'ficha · p. 10; cuánto sube: ilustrativo'); }
  if (a === 'fl') { s.fl = s.fl === v ? null : v; const f = s.fl && FLUIDOS[s.fl]; frase(!f ? 'Sin fluido.' : s.fl === 'alb' ? `Albúmina 5 %: cerca del 70 % del volumen se queda en el vaso; PA ${vitales(s).pa}, FC ${vitales(s).fc}.` : s.fl === 'rl' ? `Ringer lactato: hipotónico, favorece la hiponatremia y el astrocito se hincha más (PA ${vitales(s).pa}). No es el fluido recomendado.` : `Salino: sube la PA (${vitales(s).pa}) pero menos volumen se queda en el vaso que con albúmina.`, s.fl === 'sal' ? 'fisiología general; cambios de PA y FC ilustrativos' : 'ficha · p. 5 y 9; cambios de PA y FC ilustrativos'); }
  pintar();
}
function ponerPreset(clave, sinGuia) {
  preset = clave; s = nuevo(PRESETS[clave].s); oculto = false; foco = []; frase(PRESETS[clave].txt, 'paciente inventado; cifras ilustrativas, umbrales de la ficha · p. 6-8'); pintar(); if (sinGuia) guiaApi.cerrar(); else guiaApi.abrir(clave);
}
async function replay() {
  const nodos = [...R.querySelectorAll('#hpv-svg [data-nodo]')];
  frase('Cuatro estaciones del dibujo: el NH₃ entra, se une al CO₂ en la mitocondria, pasa por el ciclo de la urea y sale como urea a la sangre. Cada paso se apaga cuando faltan hepatocitos.', 'ciclo de la urea: ficha · p. 6; las cuatro estaciones y el CO₂ en la mitocondria: fisiología general');
  if (sinMovimiento()) return;
  const M = await cargarMotion().catch(() => null); if (!M) return;
  nodos.forEach((g, i) => M.animate(g, { opacity: [0.15, opNodo(s.func, i)] }, { duration: 0.5, delay: i * 0.6 }));
}
// ---- Pon a prueba ----
const fin = (caja, clave) => { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[clave].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; };
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = []; espera = null; delete caja.dataset.fin; guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : m === 'hilario' ? ERROR2 : CASO; preset = def.preset; s = nuevo(PRESETS[def.preset].s);
  const tit = document.createElement('h3'); tit.textContent = m === 'apuesta' ? 'Apuesta antes de tocar' : m === 'error' || m === 'hilario' ? 'Encuentra el error (hay 0, 1 o 2)' : CASO.titulo; caja.append(tit);
  if (m === 'apuesta') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes + ' ' + def.pregunta; const c = document.createElement('div'); c.className = 'ops'; caja.append(p, c);
    opciones(c, def.ops, () => { oculto = false; def.tras({ poner: (o) => { Object.assign(s, o); frase(`Con ${s.func} % de hepatocitos y la misma producción, el amonio arterial sube a ${fmt(leer(s).a)} µmol/L: menos depuración, no más producción.`, 'dirección: ficha · p. 6; cifra ilustrativa'); } }); foco = ['carril']; pintar(); const w = document.createElement('p'); w.className = 'enun por-que'; w.innerHTML = 'El recuadro marca el carril de la urea: es lo que aclara el amonio, y con el 30 % de hepatocitos deja pasar NH₃, aunque el colon produzca lo mismo. ' + cita(6); caja.append(w); fin(caja, 'apuesta'); }, def.orden);
  } else if (m === 'error' || m === 'hilario') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes; caja.append(p); let hechas = 0;
    def.frases.forEach((f) => { const c = document.createElement('div'), t = document.createElement('p'); t.className = 'enun'; t.textContent = f.t; c.append(t); const b = document.createElement('div'); b.className = 'ops'; c.append(b); caja.append(c);
      opciones(b, [{ t: 'Es un error', ok: f.error, por: f.por, piensa: f.error }, { t: 'Es correcta', ok: !f.error, por: f.por }], () => { if (++hechas === def.frases.length) { oculto = false; if (m === 'hilario') hacer('fl', 'alb'); else hacer('dep', 3); fin(caja, def.clave); } }); });
  } else caso(0, caja);
  pintar();
}
function caso(i, caja) {
  const st = CASO.pasos[i]; Object.assign(s, st.estado); oculto = false; foco = [];
  const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${CASO.pasos.length}. ${st.enun}`; const o = document.createElement('div'); c.append(p, o); caja.append(c);
  const sigue = () => { pintar(); if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); }); c.append(b); } else { $('fig').open = true; const f = document.createElement('button'); f.type = 'button'; f.className = 'b ver-ficha'; f.id = 'hpv-b-filtro'; f.textContent = 'Ver la modalidad de TRR (Nefrología)'; Object.assign(f.dataset, { especialidad: 'nefrologia', view: 'trr', panel: 'panel-trr-tabs', tab: 'trr-modalidad' }); c.append(f); fin(caja, 'caso'); } };
  if (st.mando) { espera = () => { espera = null; const r = document.createElement('p'); r.className = 'por ok'; r.textContent = st.ok; c.append(r); sigue(); }; frase(st.enun, 'paciente inventado; ficha · p. 8'); pintar(); return; }
  opciones(o, st.ops, (op) => { if (op.ok && st.alAcertar) { Object.assign(s, st.alAcertar); frase(`PA y FC con albúmina 5 %: ${vitales(s).pa}, FC ${vitales(s).fc} (ilustrativo).`, 'ficha · p. 5 (albúmina); cambios ilustrativos'); } sigue(); }, st.orden); frase(`Paso ${i + 1}: ${fmt(leer(s).a)} µmol/L de amonio arterial en el modelo (ilustrativo).`, 'paciente inventado; cifras ilustrativas'); pintar();
}
// ---- Montaje (una vez) ----
function montar() {
  const seg = (id, attr, vals) => `<div class="fila" id="hpv-${id}">${vals.map(([v, t]) => `<button type="button" data-${attr}="${v}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  $('dock-panel').innerHTML = `
   <div class="mando"><label>Hepatocitos vivos <output id="hpv-o-func"></output> %<input type="range" id="hpv-r-func" min="0" max="100" step="5" value="100"></label></div>
   <div class="mando" id="hpv-m-prod"><b class="dock-nota">Producción intestinal de NH₃ (ilustrativa)</b>${seg('s-prod', 'prod', [[0, 'Baja'], [1, 'Normal'], [2, 'Alta']])}</div>
   <div class="mando" id="hpv-m-dep"><b class="dock-nota">Lactulosa: deposiciones al día</b>${seg('s-dep', 'dep', [[0, 'Sin'], [2, '2'], [3, '3'], [4, '4'], [6, '6']])}</div>
   <div class="mando" id="hpv-m-rifa"><label>Rifaximina 400 mg ×3: <output id="hpv-o-rifa"></output> días (ficha: ≥10)<input type="range" id="hpv-r-rifa" min="0" max="14" step="1" value="0"></label></div>
   <div class="mando" id="hpv-m-tips"><button type="button" id="hpv-b-tips" class="b" aria-pressed="false">TIPS</button></div>
   <div class="mando" id="hpv-m-fl"><b class="dock-nota">Fluido (bolo)</b><div class="fila">${Object.entries(FLUIDOS).map(([k, f]) => `<button type="button" data-fl="${k}" aria-pressed="false">${f.n}</button>`).join('')}</div></div>
   <div class="mando" id="hpv-m-cvvh"><button type="button" id="hpv-b-cvvh" class="b" aria-pressed="false">CVVH</button></div>`;
  $('dock-medir').innerHTML = '<div class="mando"><div class="presets" id="hpv-presets"></div></div>';
  $('presets').innerHTML = Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('');
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { if (modo !== 'explorar') { modo = 'explorar'; $('prueba').hidden = true; } ponerPreset(b.dataset.pre); } });
  $('r-func').addEventListener('input', (ev) => hacer('func', +ev.target.value)); $('r-rifa').addEventListener('input', (ev) => hacer('rifa', +ev.target.value));
  $('dock-panel').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.prod) hacer('prod', +b.dataset.prod); else if (b.dataset.dep) hacer('dep', +b.dataset.dep); else if (b.id === 'hpv-b-cvvh') hacer('cvvh'); else if (b.id === 'hpv-b-tips') hacer('tips'); else if (b.dataset.fl) hacer('fl', b.dataset.fl); });
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  $('b-replay').addEventListener('click', replay);
  $('svg').addEventListener('click', (ev) => { const g = ev.target.closest('.via-off'); if (g) { const [n, d] = VIAS_APAGADAS[+g.dataset.via]; frase(`${n}: ${d}. Aquí no hace nada. ${ir(VIAS_APAGADAS[+g.dataset.via][2], 'Ver en la ficha')}`, 'otras fichas del libro'); } });
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; ajustarDock(); });
  $('leyenda').innerHTML = leyenda();
  guiaApi = crearGuia({ dock: () => $('dock'), caja: $('guia'), hacer: (a) => hacer(a, 1), setFoco: (z) => { foco = z; pintar(); }, cita });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`; $('cita-fig').innerHTML = cita(6);
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · ${cita(p)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuente no lo dice' ? 'La fuente no lo dice' : t === 'las fuentes discrepan' ? 'Las fuentes discrepan' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map(([t, id, pg]) => `<li>${t} ${cita(pg, id)}</li>`).join('');
  $('profundizar').innerHTML = PROFUNDIZAR.map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('');
  topeApi = crearTope({ monitor: $('monitor'), dock, cita });
}
function ajustarDock() { R.style.setProperty('--hpv-dock-h', $('dock').offsetHeight + 'px'); }
// Estado: «casimira» (un paciente) o «alta:tips» (ese paciente con el TIPS puesto). Vacío = el hígado sano.
export function abrirEstado(clave) {
  const [p, x] = String(clave || '').split(':'); modo = 'explorar'; $('prueba').hidden = true; $('prueba').textContent = ''; delete $('prueba').dataset.fin;
  ponerPreset(PRESETS[p] ? p : 'sano');
  if (x === 'tips') hacer('tips');
  ajustarDock();
}
montar(); ponerPreset('sano', true); ajustarDock();
new ResizeObserver(ajustarDock).observe($('dock'));
seguirFrase(R, () => $('escena'), { dock: () => $('dock') });
window.__hpv = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, abrirEstado, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, vitales: () => vitales(s) };
