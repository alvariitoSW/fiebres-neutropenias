// El termostato de pared · termostato A. Reutiliza (importado, no copiado): js/core/tope.js, js/core/frase-vista.js.
// Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { PDF, IDEA, PRESETS, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, fichaDe } from './datos.js';
import { nuevo, leer, topes, fmt, pasar, enfriar, recalentar, antipiretico, PIR, CLAVES, ajuste } from './modelo.js';
import { escena } from './dibujo.js';
import { crearGuia } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id);
let s = nuevo(), modo = 'explorar', oculto = false, foco = null, preset = 'reposo', topeApi, guiaApi, firma = '';
const cita = (c) => { const pg = parseInt(c, 10); return `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${pg}" target="_blank" rel="noopener">PDF p. ${pg}</a> · <button type="button" class="ver-ficha" data-resaltar="#${fichaDe(c)}" data-pag-ficha="${pg}">p. ${pg} · Ver en la ficha</button></span>`; };
const NOM = { pir: ['Sin pirógeno', 'pirógeno 38,3 °C', 'pirógeno 39,4 °C', 'pirógeno >39,4 °C'], calor: ['sin carga de calor', 'calor ambiental', 'esfuerzo', 'fármaco (halogenado, antidopaminérgico o dos serotoninérgicos)'], frio: ['sin carga de frío', 'aire frío', 'agua <15 °C', 'alcohol (falla la conducta de abrigo)'],
  enf: { evap: 'evaporativo', inm: 'inmersión en agua fría', hielo: 'hielo en ingles, axilas y cuello', sal: 'salino a 4 °C', manta: 'manta de enfriamiento' }, rec: { pasivo: 'recalentamiento pasivo', activo: 'recalentamiento activo externo', gases: 'gases inhalados a 40-45 °C', fcal: 'fluidos calientes', f21: 'fluidos a 21 °C', ecmo: 'ECMO venoarterial' } };
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f !== firma) { firma = f; for (const c of CLAVES) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
    for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off, bajo: t.n === 'aviso' ? '#dock-panel' : null }); }
  topeApi.refrescar();
}
function pintar() {
  const L = leer(s); aplicarTopes(L);
  $('esc').innerHTML = escena(s, L, foco);
  $('mon-t').textContent = oculto ? '?' : fmt(L.t); $('mon-aj').textContent = oculto ? '?' : fmt(L.aj); $('mon-fc').textContent = oculto ? '?' : (L.fc || '—');
  $('mon-t').className = !oculto && L.t >= 41 ? 'rojo' : ''; $('mon-esc').textContent = oculto ? '?' : L.tirita ? 'sí' : 'no'; $('mon-sud').textContent = oculto ? '?' : L.sudor ? 'sí' : 'no';
  $('mon-ck').textContent = oculto ? '?' : s.ck; $('mon-rit').textContent = oculto ? '?' : L.ritmo; $('mon-snc').textContent = oculto ? '?' : L.snc;
  const marca = (sel, f) => document.querySelectorAll(sel).forEach((b) => b.setAttribute('aria-pressed', String(f(b))));
  marca('[data-pir]', (b) => +b.dataset.pir === s.pir && s.dial == null); marca('[data-calor]', (b) => +b.dataset.calor === s.calor); marca('[data-frio]', (b) => +b.dataset.frio === s.frio);
  marca('[data-pre]', (b) => b.dataset.pre === preset); marca('.modos button', (b) => b.dataset.modo === modo);
  $('b-para').textContent = `Paracetamol 1 g IV${s.paraG ? ` · ${s.paraG} g hoy` : ''}`;
  $('fig-osborn').hidden = L.t >= 32; $('fig-sepsis').hidden = !(s.pir >= 1 || (s.dial != null && s.dial >= 38.3));
}
function hacer(a, v) {
  const L0 = leer(s);
  if (a === 'pir') { s.pir = +v; s.dial = null; s.anti = 0; s.flags = {}; frase(s.pir ? `El pirógeno sube el dial a ${fmt(ajuste(s))} °C: la real (${fmt(s.real)} °C) queda por debajo y la caldera se pone a tiritar hasta alcanzarlo. Pulsa «+1 h».` : 'Sin pirógeno: el dial vuelve a 37 °C.', 'ficha · p. 45; categorías Fig. 44.5, p. 71'); foco = 'dial'; }
  if (a === 'calor') { s.calor = +v; s.flags = {}; frase(s.calor ? `Carga de calor (${NOM.calor[s.calor]}): el dial sigue en ${fmt(ajuste(s))} °C; si el calor supera al radiador la real se escapa del dial. Pulsa «+1 h».` : 'Sin carga de calor.', s.calor === 1 ? 'ilustrativo; golpe de calor y agotamiento, ficha · p. 46-47' : 'ficha · p. 45-47; cifra ilustrativa'); foco = 'radiador'; }
  if (a === 'frio') { s.frio = +v; s.flags = {}; frase(s.frio ? `Carga de frío (${NOM.frio[s.frio]}): la real cae bajo el dial y la caldera tirita hasta que la temperatura baja de 30 °C. Pulsa «+1 h».` : 'Sin carga de frío.', 'ficha · p. 53-54; cifra ilustrativa'); foco = 'caldera'; }
  if (a === 'hora') { pasar(s); const L = leer(s); frase(`Pasa 1 hora: la real va de ${fmt(L0.t)} a ${fmt(L.t)} °C con el dial en ${fmt(L.aj)} °C → ${L.estado === 'fiebre' ? 'fiebre: la regulación funciona' : L.estado === 'hiper' ? 'hipertermia: falla la regulación' : L.estado === 'hipo' ? 'hipotermia' : 'normal'}.`, 'ficha (≈1 °C/h, p. 45); cargas ilustrativas'); foco = 'termo'; }
  if (a === 'anti') { antipiretico(s, v); frase(s.flags.sinEfecto ? 'El dial ya estaba en 37 °C: no hay fiebre y el antipirético no cambia nada.' : `El ${v === 'para' ? 'paracetamol' : 'ibuprofeno'} baja el dial a ${fmt(ajuste(s))} °C; la real lo seguirá con el sudor (+1 h).`, v === 'para' ? 'ficha · p. 45, 72; descenso ilustrativo' : 'ficha · p. 72 (10 mg/kg, ≤800 mg/6 h); descenso ilustrativo'); foco = 'dial'; }
  if (a === 'enf') { enfriar(s, v); frase(s.flags.manta ? 'Manta en la fiebre: vasoconstricción y escalofrío, la temperatura sube.' : s.flags.parar ? 'Por debajo de 38 °C no se sigue: el escalofrío vuelve a subir la temperatura.' : `Enfriamiento ${NOM.enf[v]}: la real baja a ${fmt(s.real)} °C.`, v === 'evap' ? 'ficha · p. 47 (0,3 °C/min × 5 min)' : 'ficha · p. 47; velocidad ilustrativa'); foco = 'termo'; }
  if (a === 'rec') { recalentar(s, v); frase(`${NOM.rec[v][0].toUpperCase() + NOM.rec[v].slice(1)}: la real pasa de ${fmt(L0.t)} a ${fmt(s.real)} °C.`, v === 'gases' ? 'ficha · p. 56 (2,5 °C/h)' : 'ficha · p. 56; cifra ilustrativa'); foco = 'termo'; }
  pintar();
}
function ponerPreset(c) { preset = c; s = nuevo(PRESETS[c].s); oculto = false; foco = null; frase(PRESETS[c].txt, 'paciente inventado; cifras ilustrativas'); pintar(); }
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = null; guiaApi.cerrar(); delete caja.dataset.fin;
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : CASO; preset = def.preset; s = nuevo(PRESETS[def.preset].s);
  if (m === 'error') s = nuevo({ calor: 2, real: 41.6 });
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
  const st = CASO.pasos[i]; s = nuevo(st.antes); oculto = false; const ET = { normal: 'normal', fiebre: 'fiebre: la regulación funciona', hiper: 'hipertermia: falla la regulación', hipo: 'hipotermia' }, est = () => { const L = leer(s); return `Real ${fmt(L.t)} °C con el dial en ${fmt(L.aj)} °C → ${ET[L.estado]}.`; }; frase(`Paso ${i + 1} de ${CASO.pasos.length}. ${est()}`, 'paciente inventado; cifras ilustrativas');
  const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${CASO.pasos.length}. ${st.enun}`; const o = document.createElement('div'); o.className = 'ops'; c.append(p, o); caja.append(c);
  opciones(o, st.ops, (op) => { const h = op.haz || {}; Object.assign(s, h); if (!h.flags) s.flags = {}; frase(`${op.ok ? 'Bien' : 'Mal'}: ${est()}`, 'ficha; cifras ilustrativas'); pintar();
    if (st.enlace) { const e = document.createElement('button'); e.type = 'button'; e.className = 'ver-ficha'; e.dataset.pagFicha = '47'; e.dataset.resaltar = '#ma-calor-rabdo'; e.textContent = 'Abrir la nefrona viva: rabdomiólisis'; e.dataset.enlace = 'nefrona'; o.append(e); }
    if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); pintar(); }); o.append(b); } else fin(caja, 'caso'); }, [(i * 2) % 3, (i * 2 + 1) % 3, (i * 2 + 2) % 3].map((x) => x % 3));
  pintar();
}
function fin(caja, clave) { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[clave].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; }
const HAZ = { fiebre: () => { hacer('pir', 1); hacer('hora'); }, anti: () => hacer('anti', 'para'), hiper: () => { ponerPreset('reposo'); s.calor = 2; hacer('hora'); hacer('hora'); hacer('anti', 'para'); } };
function montar() {
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  const seg = (attr, vals) => vals.map(([v, t]) => `<button type="button" data-${attr}="${v}" aria-pressed="false">${t}</button>`).join('');
  const fila = (t, h, cl = '') => `<div class="mando-r ${cl}"><b class="dock-nota">${t}</b><div class="fila">${h}</div></div>`;
  $('dock-panel').innerHTML = fila('Pirógeno °C', seg('pir', [[0, 'Sin'], [1, '38,3'], [2, '39,4'], [3, '>39,4']])) + fila('Carga de calor', seg('calor', [[0, 'Sin'], [1, 'Ambiente'], [2, 'Esfuerzo'], [3, 'Fármaco']])) + fila('Carga de frío', seg('frio', [[0, 'Sin'], [1, 'Aire'], [2, 'Agua &lt;15 °C'], [3, 'Alcohol']]));
  $('dock-tratar').innerHTML = fila('Antipirético', '<button type="button" id="b-para" class="b">Paracetamol 1 g IV</button><button type="button" id="b-ibu" class="b">Ibuprofeno 10 mg/kg</button>') + fila('Enfriar', seg('enf', [['evap', 'Evaporativo'], ['inm', 'Inmersión'], ['hielo', 'Hielo'], ['sal', 'Salino 4 °C'], ['manta', 'Manta']]), 'cinco') + fila('Recalentar', seg('rec', [['pasivo', 'Pasivo'], ['activo', 'Activo ext.'], ['gases', 'Gases 40-45 °C'], ['fcal', 'Fluido caliente'], ['f21', 'Fluido 21 °C'], ['ecmo', 'ECMO VA']]), 'seis');
  $('dock-medir').innerHTML = `<div class="presets" id="presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('')}</div>`;
  const clic = (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return; const d = b.dataset;
    if (d.pir !== undefined) hacer('pir', d.pir); else if (d.calor !== undefined) hacer('calor', d.calor); else if (d.frio !== undefined) hacer('frio', d.frio); else if (d.enf) hacer('enf', d.enf); else if (d.rec) hacer('rec', d.rec); else if (b.id === 'b-para') hacer('anti', 'para'); else if (b.id === 'b-ibu') hacer('anti', 'ibu'); };
  $('dock-panel').addEventListener('click', clic); $('dock-tratar').addEventListener('click', clic); $('b-hora').addEventListener('click', () => hacer('hora'));
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { if (modo !== 'explorar') { modo = 'explorar'; $('prueba').hidden = true; } ponerPreset(b.dataset.pre); } });
  const paneles = { dar: 'dock-panel', tratar: 'dock-tratar', medir: 'dock-medir' };
  $('dock').querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; $('dock').querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); for (const [k, id] of Object.entries(paneles)) $(id).hidden = k !== b.dataset.pest; });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha'); if (f) { const t = $('toast'); t.textContent = f.dataset.enlace ? 'En la app, esto abre la nefrona viva en la rabdomiólisis y vuelve aquí.' : `En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600); } });
  guiaApi = crearGuia({ caja: $('guia'), cita, accion: (k) => HAZ[k](), foco: (z) => { foco = z; pintar(); } });
  $('b-guia').addEventListener('click', () => { if (modo !== 'explorar') { modo = 'explorar'; $('prueba').hidden = true; } ponerPreset('reposo'); guiaApi.abrir(); });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · ${cita(p)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  topeApi = crearTope({ monitor: $('monitor'), dock: $('dock'), cita });
}
function ajustarDock() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
montar(); ponerPreset('reposo'); ajustarDock();
new ResizeObserver(ajustarDock).observe($('dock')); new ResizeObserver(ajustarDock).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
void PIR;
window.__t = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, get modo() { return modo; } };
