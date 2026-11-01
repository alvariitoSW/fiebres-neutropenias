// El paciente de la cama 4 · hepatocito C. Reutiliza (importado, no copiado): js/core/tope.js, js/core/frase-vista.js, js/core/particulas.js.
// Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { leyendaParticulas } from '../../../js/core/particulas.js';
import { PDF, IDEA, PRESETS, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, fichaDe } from './datos.js';
import { nuevo, leer, topes, fmt, WH, TOPE } from './modelo.js';
import { escena, ZONAS, NOMBRE } from './dibujo.js';
import { crearGuia } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id);
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
let s = nuevo(PRESETS.hilario.s), lupa = 'cabeza', modo = 'explorar', oculto = false, foco = null, preset = 'hilario', fl = 'alb', topeApi, guiaApi, firma = '';
const cita = (c) => { const pg = parseInt(c, 10); return `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${pg}" target="_blank" rel="noopener">PDF p. ${pg}</a> · <button type="button" class="ver-ficha" data-resaltar="#${fichaDe(c)}" data-pag-ficha="${pg}">p. ${pg} · Ver en la ficha</button></span>`; };
const FLN = { alb: 'albúmina 5 %', sal: 'suero salino', rl: 'Ringer lactato' };
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f !== firma) { firma = f; for (const c of ['edema', 'nh150', 'lac', 'rif', 'cvvh', 'rl', 'albok', 'vol', 'pam', 'tips']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
    for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off, bajo: t.n === 'aviso' ? '#dock-panel' : null }); }
  topeApi.refrescar();
}
function pintar() {
  const L = leer(s); aplicarTopes(L);
  $('esc').innerHTML = escena(s, L, lupa, oculto) + (foco ? `<rect class="foco" x="${ZONAS[foco][0]}" y="${ZONAS[foco][1]}" width="${ZONAS[foco][2]}" height="${ZONAS[foco][3]}" rx="10"/>` : '');
  $('mon-pa').textContent = `${L.sys}/${L.dia}`; $('mon-fc').textContent = L.fc;
  $('mon-nh').textContent = oculto ? '?' : fmt(L.nh); $('mon-wh').textContent = oculto ? '?' : WH[L.wh];
  $('mon-nh').className = !oculto && L.nh > TOPE.edema ? 'rojo' : '';
  document.querySelectorAll('[data-lupa]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lupa === lupa)));
  document.querySelectorAll('[data-lac]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.lac === s.dep)));
  document.querySelectorAll('[data-rif]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.rif === s.rif)));
  document.querySelectorAll('[data-fl]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fl === fl)));
  document.querySelectorAll('[data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === preset)));
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  $('b-cvvh').setAttribute('aria-pressed', String(s.cvvh)); $('b-tips').setAttribute('aria-pressed', String(s.tips)); $('b-oli').setAttribute('aria-pressed', String(s.oligu));
  $('b-cvvh').textContent = s.cvvh ? 'CVVH encendida' : 'CVVH apagada'; $('b-tips').textContent = s.tips ? 'TIPS puesto' : 'Sin TIPS';
  $('b-fluido').textContent = `Dar 500 mL de ${FLN[fl]} · total ${L.mlTot} mL`; $('b-oli').textContent = s.oligu ? 'Oliguria persistente: sí' : 'Oliguria persistente: no';
  $('o-func').textContent = `${Math.round(s.func)} %`; $('r-func').value = s.func; $('o-alb').textContent = fmt(s.alb, 1); $('r-alb').value = s.alb;
  $('fig-cabeza').hidden = lupa !== 'cabeza'; $('fig-abdomen').hidden = lupa !== 'abdomen';
  $('leyenda').innerHTML = leyendaParticulas(['nh4', 'urea'], { titulo: 'Qué es cada partícula' });
}
function hacer(a, v) {
  const L0 = leer(s);
  if (a === 'func') { s.func = +v; frase(`Función hepática ${Math.round(s.func)} %: el amonio pasa de ${fmt(L0.nh)} a ${fmt(leer(s).nh)} µmol/L (cifra ilustrativa); con menos hepatocitos sanos, menos urea y más NH₃.`, 'dirección: ficha · p. 6; cifras ilustrativas'); lupa = 'higado'; }
  if (a === 'lac') { s.dep = +v; frase(s.dep ? `Lactulosa (${s.dep >= 7 ? '6 o más' : s.dep >= 5 ? '4-5' : '2-3'} deposiciones al día): acidifica el colon y desaparecen las bacterias que fabrican amonio; ahora ${fmt(leer(s).nh)} µmol/L.` : 'Sin lactulosa: el colon sigue fabricando NH₃.', 'ficha · p. 7; cifra ilustrativa'); lupa = 'abdomen'; }
  if (a === 'rif') { s.rif = +v; frase(s.rif ? `Rifaximina 400 mg 3 veces al día, ${s.rif} días: antibiótico no absorbible; baja algo el NH₃ y se combina con lactulosa.` : 'Sin rifaximina.', 'ficha · p. 7; efecto ilustrativo'); lupa = 'abdomen'; }
  if (a === 'cvvh') { s.cvvh = !s.cvvh; frase(s.cvvh ? `CVVH encendida: el filtro retira NH₃ de la sangre; el amonio baja a ${fmt(leer(s).nh)} µmol/L (cifra ilustrativa).` : 'CVVH apagada.', 'ficha · p. 8; cifra ilustrativa'); lupa = 'abdomen'; }
  if (a === 'tips') { s.tips = !s.tips; frase(s.tips ? `TIPS: la sangre salta el hígado; el amonio sube de ${fmt(L0.nh)} a ${fmt(leer(s).nh)} µmol/L y la cara pasa a grado ${leer(s).wh}.` : 'Sin TIPS.', 'ficha · p. 10; cifras ilustrativas'); lupa = 'higado'; }
  if (a === 'fluido') { s.ml[fl] += TOPE.mlBolo; s.ult = fl; frase(fl === 'alb' ? `500 mL de albúmina 5 %: alrededor del 70 % se queda en el vaso y la PA sube a ${leer(s).sys}/${leer(s).dia}.` : fl === 'rl' ? `500 mL de Ringer lactato: hipotónico, favorece la hiponatremia y el edema cerebral; la cara pasa a grado ${leer(s).wh}.` : `500 mL de salino: la PA sube a ${leer(s).sys}/${leer(s).dia} (parte sale del vaso).`, fl === 'alb' ? 'ficha · p. 5; subida de PA ilustrativa' : 'ficha · p. 5, 9; subida de PA ilustrativa'); lupa = 'cabeza'; }
  pintar();
}
function ponerPreset(c) { preset = c; s = nuevo(PRESETS[c].s); oculto = false; foco = null; lupa = 'cabeza'; frase(PRESETS[c].txt, 'paciente inventado; cifras de la ficha o ilustrativas'); pintar(); }
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = null; guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : CASO; preset = def.preset; s = nuevo({ ...PRESETS[def.preset].s, ...(def.estado || {}) }); lupa = 'cabeza';
  const tit = document.createElement('h3'); tit.textContent = m === 'apuesta' ? 'Apuesta antes de tocar' : m === 'error' ? 'Encuentra el error (hay 0, 1 o 2)' : CASO.titulo; caja.append(tit);
  if (m === 'apuesta') { oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `${def.antes} ${def.pregunta}`; const c = document.createElement('div'); c.className = 'ops'; caja.append(p, c);
    opciones(c, def.ops, () => { oculto = false; pintar(); fin(caja, 'apuesta'); }, def.orden); }
  else if (m === 'error') { oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes; caja.append(p); let hechas = 0;
    def.frases.forEach((f) => { const c = document.createElement('div'); const t = document.createElement('p'); t.className = 'enun'; t.textContent = f.t; c.append(t); const b = document.createElement('div'); b.className = 'ops'; c.append(b); caja.append(c);
      opciones(b, [{ t: 'Es un error', ok: f.error, por: f.por }, { t: 'Es correcta', ok: !f.error, por: f.por }], () => { if (++hechas === def.frases.length) { oculto = false; pintar(); fin(caja, 'error'); } }); }); }
  else caso(0, caja);
  pintar();
}
function caso(i, caja) {
  const st = CASO.pasos[i]; s = nuevo({ ...PRESETS.hilario.s, ...st.antes }); oculto = false;
  const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${CASO.pasos.length}. ${st.enun}`; const o = document.createElement('div'); o.className = 'ops'; c.append(p, o); caja.append(c);
  opciones(o, st.ops, (op) => { Object.assign(s, op.haz || {}); if (op.haz && op.haz.ml) s.ml = { ...op.haz.ml }; pintar();
    if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); pintar(); }); o.append(b); } else fin(caja, 'caso'); }, [(i * 2) % 3, (i * 2 + 1) % 3, (i * 2 + 2) % 3].map((x) => x % 3));
  pintar();
}
function fin(caja, clave) { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[clave].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; }
function montar() {
  $('lupas').innerHTML = Object.entries(NOMBRE).map(([k, n]) => `<button type="button" data-lupa="${k}" aria-pressed="false"><span aria-hidden="true">${k === 'cabeza' ? '◍' : k === 'higado' ? '◐' : '◎'}</span> ${n}</button>`).join('');
  $('lupas').addEventListener('click', (ev) => { const b = ev.target.closest('[data-lupa]'); if (b) { lupa = b.dataset.lupa; foco = null; pintar(); } });
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  const seg = (attr, vals) => `<div class="fila">${vals.map(([v, t]) => `<button type="button" data-${attr}="${v}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  $('dock-panel').innerHTML = `
   <div class="mando"><label>Función hepática <output id="o-func"></output><input type="range" id="r-func" min="0" max="100" step="5" value="52"></label></div>
   <div class="mando"><b class="dock-nota">Lactulosa: deposiciones al día</b>${seg('lac', [[0, 'Sin'], [3, '2-3'], [5, '4-5'], [7, '6 o más']])}</div>
   <div class="mando"><b class="dock-nota">Rifaximina 400 mg ×3: días</b>${seg('rif', [[0, 'Sin'], [5, '5 d'], [10, '10 d']])}</div>
   <div class="mando fila"><button type="button" id="b-cvvh" class="b" aria-pressed="false">CVVH apagada</button><button type="button" id="b-tips" class="b" aria-pressed="false">Sin TIPS</button></div>
   <div class="mando"><b class="dock-nota">Fluido</b>${seg('fl', [['alb', 'Albúmina 5 %'], ['sal', 'Salino'], ['rl', 'Ringer lactato']])}<button type="button" id="b-fluido" class="b prim">Dar 500 mL</button></div>`;
  $('dock-medir').innerHTML = `<div class="mando"><div class="presets" id="presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('')}</div></div>
   <div class="mando"><label>Albúmina sérica <output id="o-alb"></output> g/dL<input type="range" id="r-alb" min="1.5" max="4.5" step="0.1" value="2.4"></label><button type="button" id="b-oli" class="b" aria-pressed="false">Oliguria persistente: no</button></div>`;
  const dp = $('dock-panel');
  dp.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.lac !== undefined) hacer('lac', b.dataset.lac); else if (b.dataset.rif !== undefined) hacer('rif', b.dataset.rif); else if (b.dataset.fl) { fl = b.dataset.fl; pintar(); }
    else if (b.id === 'b-cvvh') hacer('cvvh'); else if (b.id === 'b-tips') hacer('tips'); else if (b.id === 'b-fluido') hacer('fluido'); });
  $('r-func').addEventListener('input', (ev) => hacer('func', ev.target.value));
  $('r-alb').addEventListener('input', (ev) => { s.alb = +ev.target.value; frase('Con la albúmina sérica por debajo de 3 g/dL la albúmina 5 % es el fluido de elección en el sangrado por varices.', 'ficha · p. 5, 9'); pintar(); });
  $('b-oli').addEventListener('click', () => { s.oligu = !s.oligu; pintar(); });
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { if (modo !== 'explorar') { modo = 'explorar'; $('prueba').hidden = true; } ponerPreset(b.dataset.pre); } });
  $('dock').querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; $('dock').querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); dp.hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest === 'dar'; });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha'); if (f) { const t = $('toast'); t.textContent = `En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600); } });
  guiaApi = crearGuia({ caja: $('guia'), cita, accion: (a, v) => hacer(a, v === undefined ? undefined : v), lupa: (l) => { lupa = l; pintar(); }, foco: (z) => { foco = z; pintar(); } });
  $('b-guia').addEventListener('click', () => { if (modo !== 'explorar') { modo = 'explorar'; $('prueba').hidden = true; } ponerPreset('hilario'); guiaApi.abrir(); });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · ${cita(p)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  topeApi = crearTope({ monitor: $('monitor'), dock: $('dock'), cita });
}
function ajustarDock() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
// Asterixis: la mano pivota en la muñeca; con «reducir movimiento» queda quieta y torcida.
function bucle() {
  const amp = [0, 3, 12, 15, 0];
  const mover = (ts) => { const L = leer(s), a = oculto ? 0 : amp[L.wh]; document.querySelectorAll('#esc .mano').forEach((m, i) => { const ang = REDUCIR ? a * 0.8 : a * Math.sin(ts / 110 + i * 1.3); m.setAttribute('transform', `translate(${m.dataset.px} ${m.dataset.py}) rotate(${ang.toFixed(1)})`); }); if (!REDUCIR) requestAnimationFrame(mover); };
  requestAnimationFrame(mover);
}
montar(); ponerPreset('hilario'); bucle(); ajustarDock();
new ResizeObserver(ajustarDock).observe($('dock')); new ResizeObserver(ajustarDock).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
window.__cama = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, setLupa: (l) => { lupa = l; pintar(); }, setFl: (f) => { fl = f; pintar(); }, get modo() { return modo; } };
