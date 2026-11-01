// Cráneo A «La caja cerrada». Reutiliza (importado): crearTope (js/core/tope.js) y seguirFrase (js/core/frase-vista.js).
// NO importa calcPpc ni caraGlasgow (viven dentro de marino-neuro.js / visual-marino-piezas-45-53.js): la regla PPC = PAM − PIC
// (Ec. 47.1, p. 45) está en modelo.js y las pupilas son dos círculos propios. Los botones se crean UNA vez y se repintan.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { PDF, PRESETS, FUENTES, NOTAS, PROFUNDIZAR, IDEA, fichaDe, P } from './datos.js';
import { nuevo, leer, topes, fmt, clamp } from './modelo.js';
import { escena, focoSvg, NOMBRE_MASA } from './dibujo.js';
import { crearGuia } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id);
let foco = [], guiaApi, topeApi, firma = '', s = nuevo(PRESETS.segismundo.s), modo = 'explorar', oculto = false, preset = 'segismundo';
const cita = (c) => !c ? '' : `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${c}" target="_blank" rel="noopener">PDF p. ${c}</a> · <button type="button" class="ver-ficha" data-resaltar="#${fichaDe(c)}" data-pag-ficha="${c}">p. ${c} · Ver en la ficha</button></span>`;
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
function aplicarTopes() {
  const lista = topes(s), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of ['flujo', 'pic80', 'ppc', 'pic', 'na', 'co2', 'co2a', 'vpp', 'pam', 'pamx', 'pamn', 'dren', 'mmax', 'hid', 'h']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag || null, origen: t.origen, deshabilita: t.off || [], bajo: t.n === 'aviso' ? '#dock-panel' : null });
}
function pintar() {
  const L = leer(s); aplicarTopes();
  $('cr-svg').innerHTML = escena(s, L, oculto) + focoSvg(foco);
  $('mon-pam').textContent = fmt(L.pam); $('mon-pic').textContent = oculto ? '?' : fmt(L.pic); $('mon-ppc').textContent = oculto ? '?' : fmt(L.ppc);
  $('mon-gcs').textContent = oculto ? '?' : L.gcs; $('mon-pup').textContent = oculto ? '?' : L.pup; $('mon-co2').textContent = fmt(s.co2);
  $('mon-ppc-c').classList.toggle('ppc-mal', !oculto && (L.ppc < P.ppcMin || L.ppc > P.ppcMax));
  $('mon-ppc-nota').textContent = oculto ? '' : L.ppc < P.ppcMin ? '▼ bajo' : L.ppc > P.ppcMax ? '▲ alto' : '✔ 50-70';
  $('o-masa').textContent = s.m + ' %'; $('o-pam').textContent = fmt(s.pam); $('o-co2').textContent = s.co2; $('b-hiper').textContent = `Hipertónico · Na⁺ ${s.na}`; $('o-h').textContent = s.h + ' h'; $('b-dren').textContent = `Drenar LCR (${s.drain}/${P.drenajeMax})`;
  $('s-tipo').value = s.tipo; $('b-vpp').setAttribute('aria-pressed', String(s.vpp)); $('b-vpp').textContent = s.vpp ? 'Respirador: VPP puesta' : 'Respirador: sin VPP';
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('.presets button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === preset)));
  topeApi.refrescar();
}
function hacer(a, o) {
  const antes = leer(s);
  if (a === 'masa') { s.m = clamp(s.m + (o ?? 10), 0, 100); frase(`Masa al ${s.m} %: la PIC pasa de ${fmt(antes.pic)} a ${fmt(leer(s).pic)}. Primero se aprieta el LCR y la sangre venosa; luego ya no cabe.`, 'forma ilustrativa; PIC sube: ficha · p. 14'); }
  if (a === 'pam') { s.pam = clamp(s.pam + (o ?? 5), 40, 150); frase(`PAM ${s.pam}: PPC = PAM − PIC pasa de ${fmt(antes.ppc)} a ${fmt(leer(s).ppc)}. La PIC no cambia: la autorregulación no está modelada.`, 'ficha · p. 45 (PPC = PAM − PIC); autorregulación: ' + 'otra fuente pendiente'); }
  if (a === 'dren') { s.drain = clamp(s.drain + (o ?? 1), 0, P.drenajeMax); frase(`Se drena LCR: la PIC baja de ${fmt(antes.pic)} a ${fmt(leer(s).pic)} y el punto baja por la curva.`, 'drenar: ficha · p. 45; magnitud ilustrativa'); }
  if (a === 'hiper') { s.na += P.naBolo; frase(`Bolo de hipertónico: Na⁺ ${s.na}. Saca agua del edema; el objetivo es 145-155.`, 'ficha · p. 41; efecto ilustrativo'); }
  if (a === 'vpp') { s.vpp = !s.vpp; frase(s.vpp ? 'La presión positiva puede bajar la PPC: sube la PIC y baja el retorno.' : 'Sin presión positiva.', 'ficha · p. 35; magnitud ilustrativa'); }
  if (a === 'co2') { s.co2 = clamp(s.co2 + (o ?? 5), 25, 50); frase(`PaCO₂ ${s.co2}: ${s.co2 < 40 ? 'menos sangre cerebral, la PIC baja' : s.co2 > 40 ? 'más sangre cerebral, la PIC sube' : 'normocapnia'}.`, 'fisiología general; hiperventilación 30-35: Manual UMI'); }
  if (a === 'reloj') { s.h = Math.min(72, s.h + 12); frase(`Pasan 12 horas (${s.h} h): ${s.tipo === 'hv' && s.h >= 12 ? 'la sangre ventricular bloquea el LCR y aparece hidrocefalia.' : s.tipo === 'edema' ? 'el edema crece.' : 'sin cambios en este tipo de masa.'}`, 'hidrocefalia: ficha · p. 45; tiempos ilustrativos'); }
  pintar();
}
function ponerPreset(c) {
  preset = c; s = nuevo(PRESETS[c].s); oculto = false; foco = []; frase(PRESETS[c].txt, 'paciente inventado; cifras del modelo ilustrativas'); pintar(); if (guiaApi) guiaApi.abrir(c);
}
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = []; if (guiaApi) guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : CASO; preset = def.preset; s = nuevo(PRESETS[def.preset].s);
  const tit = document.createElement('h3'); tit.textContent = m === 'apuesta' ? 'Apuesta antes de tocar' : m === 'error' ? 'Encuentra el error (hay 0, 1 o 2)' : CASO.titulo; caja.append(tit);
  if (m === 'apuesta') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes + ' ' + def.pregunta; const c = document.createElement('div'); c.className = 'ops'; caja.append(p, c);
    opciones(c, def.ops, () => { oculto = false; def.tras({ hacer }); fin(caja, 'apuesta'); }, def.orden);
  } else if (m === 'error') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes; caja.append(p); let hechas = 0;
    def.frases.forEach((f) => { const c = document.createElement('div'); const t = document.createElement('p'); t.className = 'enun'; t.textContent = f.t; c.append(t); const b = document.createElement('div'); b.className = 'ops'; c.append(b); caja.append(c);
      opciones(b, [{ t: 'Es un error', ok: f.error, por: f.por }, { t: 'Es correcta', ok: !f.error, por: f.por }], () => { if (++hechas === def.frases.length) { oculto = false; frase('Ahora ves la PIC y la PPC: el plan correcto cuida las dos.', 'ficha · p. 44-45'); pintar(); fin(caja, 'error'); } }); });
  } else caso(0, caja);
  pintar();
}
function caso(i, caja) {
  const st = CASO.pasos[i], a = st.antes || {};
  if (a.preset) { s = nuevo(PRESETS[a.preset].s); } if (a.estado) Object.assign(s, a.estado); if (a.h !== undefined) s.h = a.h; if (a.oculto !== undefined) oculto = a.oculto;
  const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${CASO.pasos.length}. ${st.enun}`; const o = document.createElement('div'); c.append(p, o); caja.append(c);
  opciones(o, st.ops, (op) => { oculto = false; if (op.haz) op.haz({ hacer }); pintar();
    if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); pintar(); }); c.append(b); } else fin(caja, 'caso'); }, st.orden);
  pintar();
}
function fin(caja, clave) {
  const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[clave].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1';
}
function montar() {
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  const tipos = Object.entries(NOMBRE_MASA).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  $('dock-panel').innerHTML = `
   <div class="mando"><div class="fila"><select id="s-tipo" aria-label="Tipo de masa">${tipos}</select><button type="button" id="b-masa-menos" class="b">Masa −10</button><output id="o-masa"></output><button type="button" id="b-masa-mas" class="b">Masa +10</button></div></div>
   <div class="mando"><div class="fila"><button type="button" id="b-pam-menos" class="b">PAM −5</button><output id="o-pam"></output><button type="button" id="b-pam-mas" class="b">PAM +5</button></div></div>
   <div class="mando"><div class="fila"><button type="button" id="b-dren" class="b prim">Drenar LCR</button><button type="button" id="b-hiper" class="b">Hipertónico</button></div></div>`;
  $('dock-medir').innerHTML = `
   <div class="mando"><div class="fila"><button type="button" id="b-vpp" class="b" aria-pressed="false">Respirador</button><button type="button" id="b-co2-menos" class="b">PaCO₂ −5</button><output id="o-co2"></output><button type="button" id="b-co2-mas" class="b">PaCO₂ +5</button></div></div>
   <div class="mando"><div class="fila"><button type="button" id="b-reloj" class="b">Reloj +12 h</button><output id="o-h"></output></div></div>
   <div class="mando"><div class="presets" id="presets"></div></div>`;
  $('presets').innerHTML = Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('');
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { if (modo !== 'explorar') { modo = 'explorar'; $('prueba').hidden = true; } ponerPreset(b.dataset.pre); } });
  const map = { 'b-masa-menos': ['masa', -10], 'b-masa-mas': ['masa', 10], 'b-pam-menos': ['pam', -5], 'b-pam-mas': ['pam', 5], 'b-dren': ['dren', 1], 'b-hiper': ['hiper'], 'b-vpp': ['vpp'], 'b-co2-menos': ['co2', -5], 'b-co2-mas': ['co2', 5], 'b-reloj': ['reloj'] };
  document.querySelector('.dock').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled || !map[b.id]) return; hacer(...map[b.id]); });
  $('s-tipo').addEventListener('change', (ev) => { s.tipo = ev.target.value; frase(`Masa: ${NOMBRE_MASA[s.tipo]}. ${s.tipo === 'edema' ? 'El hipertónico actúa mejor sobre el edema.' : s.tipo === 'lcr' ? 'El LCR retenido se drena.' : 'Una masa sólida: la cirugía o la reversión la tratan.'}`, 'ficha · p. 40-41, 45; efecto ilustrativo'); pintar(); });
  const dock = $('dock'); const dp = $('dock-panel');
  dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); dp.hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest === 'dar'; });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha'); if (f) { const t = $('toast'); t.textContent = `En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600); } });
  guiaApi = crearGuia({ caja: $('guia'), hacer, cita, setFoco: (z) => { foco = z; pintar(); } });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha (la caja cerrada es fisiología general)</span>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · ${cita(p)}</li>`).join('') + '<li>PPC <70 pronóstico, <50 evitar; cabecera 30°; hiperventilación 30-35 transitoria · Manual UMI de la app (umi-pic)</li>';
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('profundizar').innerHTML = PROFUNDIZAR.map((x) => `<li>${x}</li>`).join('');
  topeApi = crearTope({ monitor: $('monitor'), dock, cita });
}
function ajustarDock() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
montar(); ponerPreset('segismundo'); ajustarDock();
new ResizeObserver(ajustarDock).observe($('dock')); new ResizeObserver(ajustarDock).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
window.__craneo = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); } };
