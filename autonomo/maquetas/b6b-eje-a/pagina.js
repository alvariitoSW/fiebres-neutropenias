// Eje hormonal · opción A «El termostato hormonal». Reutiliza (importados, no copiados): js/core/tope.js (topes con sello), js/core/frase-vista.js (frase a la vista),
// js/core/motion.js (Motion para el impulso de las flechas; con «reducir movimiento», estado final) y los tokens de css/variables.css (vía b3-ritmo/base.css).
// Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { cargarMotion, sinMovimiento } from '../../../js/core/motion.js';
import { PDF, PRESETS, IDEA, FUENTES, FUENTES_EXT, NOTAS, PROFUNDIZAR, CRECERA, TABLA512, fichaDe, pagDe } from './datos.js';
import { nuevo, leer, fmt } from './modelo.js';
import { topes, TODOS } from './topes.js';
import { escena } from './dibujo.js';
import { crearGuia } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id), D = (n) => document.querySelectorAll(n);
let s = nuevo(), clave = 'tori', modo = 'explorar', oculto = false, foco = [], guiaApi, topeApi, firma = '';
const cita = (c) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${pagDe(c)}" target="_blank" rel="noopener">PDF p. ${pagDe(c)}</a> · <button type="button" class="ver-ficha" data-resaltar="#${fichaDe(c)}" data-pag-ficha="${pagDe(c)}">p. ${pagDe(c)} · Ver en la ficha</button></span>`;
const frase = (t, org) => { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; };
function aplicarTopes(L) {
  const lista = topes(s, L); if (s.ovMal) lista.push({ c: 'imposible', n: 'sello', titulo: 'Cifra no fisiológica', texto: `${s.ovMal} está fuera de lo que puede tener un paciente vivo; no se aplica.`, origen: 'fisiología general', off: [] });
  const f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto])); if (f === firma) return; firma = f;
  for (const c of TODOS) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off, bajo: t.n === 'aviso' ? '#avisos' : null });
}
function pintar() {
  const L = leer(s), adr = s.gl === 'adr', q = oculto ? '?' : null; aplicarTopes(L);
  $('est').innerHTML = escena(s, L, oculto, foco);
  const M = { pa: L.pa, fc: L.fc, t: fmt(L.t) + ' °C', na: L.na_s, lac: fmt(L.lac), nor: L.na ? fmt(L.na) : '—' };
  for (const k in M) $('m-' + k).textContent = M[k];
  $('m-c1').textContent = q || (adr ? Math.round(L.cort) + ' µg/dL' : fmt(L.t4, 1) + ' ng/dL'); $('m-c1l').textContent = adr ? 'Cortisol' : 'T4 libre';
  $('m-c2').textContent = q || (adr ? L.acthN : (L.tsh < 0.01 ? '<0,01' : fmt(L.tsh, L.tsh < 1 ? 2 : 1))); $('m-c2l').textContent = adr ? 'ACTH' : 'TSH mU/mL';
  $('m-c3').textContent = q || (adr ? (L.prod ? L.prod + ' mg' : '↓') : L.t3); $('m-c3l').textContent = adr ? 'Cortisol/día' : 'T3 libre';
  $('m-c4').textContent = 'día ' + s.dia;
  D('[data-solo]').forEach((e) => { e.hidden = e.dataset.solo !== s.gl; });
  D('[data-gl]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.gl === s.gl)));
  D('[data-estres]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.estres === s.estres)));
  D('[data-pat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pat === s.pat)));
  D('[data-farm]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.farm === s.farm)));
  $('b-circi').setAttribute('aria-pressed', String(s.circi)); $('b-circi').disabled = s.estres < 2; $('b-acth').setAttribute('aria-pressed', String(s.acth));
  $('b-hc').setAttribute('aria-pressed', String(s.hc)); $('b-ret').hidden = !s.hc || s.gl !== 'adr' || s.taper; $('b-ret').parentElement.dataset.n = '1';
  $('b-ptu').setAttribute('aria-pressed', String(s.at === 'ptu')); $('b-mmi').setAttribute('aria-pressed', String(s.at === 'mmi'));
  $('b-yodo').setAttribute('aria-pressed', String(s.yodo)); $('b-prop').setAttribute('aria-pressed', String(s.prop)); $('b-levo').setAttribute('aria-pressed', String(s.levo)); $('b-lio').setAttribute('aria-pressed', String(s.lio)); $('b-asma').setAttribute('aria-pressed', String(s.asma));
  $('r-dias').value = s.dias; $('r-dias-t').textContent = `Corticoide exógeno: ${s.dias} días`;
  topeApi.refrescar(); D('[data-modo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo))); D('[data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === clave)));
  $('tabla-512').dataset.fila = L.fila || ''; D('#tabla-512 tr[data-f]').forEach((r) => r.classList.toggle('lit', r.dataset.f === L.fila && !oculto)); $('tabla-512').hidden = adr;
  $('lectura').textContent = adr ? '' : (L.fila ? '' : 'Esta combinación de T4 libre y TSH no está en la Tabla 51.2.');
  $('fig').classList.toggle('resalta', adr && (L.supr || L.bloq || L.eto)); $('fig').hidden = !adr;
  $('tabla-512').classList.toggle('foco-caja', foco.includes('tabla')); $('fig').classList.toggle('foco-caja', foco.includes('fig'));
}
async function pulso() {
  if (sinMovimiento()) return;
  const ids = ['a1', 'a2', 'a3', 'cab'].map((i) => document.getElementById(i)); const base = ids.map((e) => e ? +(e.getAttribute('opacity') || 1) : 1);
  try { const { animate } = await cargarMotion(); animate(0, 1, { duration: 1.6, ease: 'linear', onUpdate: (v) => ids.forEach((e, i) => { if (e) e.setAttribute('opacity', String(base[i] * (0.15 + 0.85 * Math.min(1, Math.max(0, v * 4 - i))))); }) }); } catch { /* estado final */ }
}
function hacer(a, o = {}) {
  let t = '', org = '', L0 = leer(s); const adr = s.gl === 'adr';
  if (a === 'gl') { s.gl = o.v; s.farm = ''; s.acth = false; t = o.v === 'adr' ? 'Eje suprarrenal: CRH → ACTH → cortisol, y el cortisol frena a las dos primeras estaciones por el cable.' : 'Eje tiroideo: TRH → TSH → T4, que en los tejidos se convierte en T3 por la desyodasa; las hormonas tiroideas frenan a TRH y TSH por el cable.'; org = 'Libro Azul p. 4-6; ficha p. 47 y 52'; pulso(); }
  if (a === 'estres') { s.estres = o.v; if (s.estres < 2) s.circi = false; t = ['Reposo: la glándula produce 15-25 mg de cortisol al día.', 'Estrés moderado: sube la producción de cortisol.', 'Estrés intenso: sube mucho la producción.', 'Estrés máximo: hasta 350 mg de cortisol al día; no da más.'][o.v]; if (!adr) t = o.v >= 2 ? 'Enfermedad aguda: la T3 libre baja porque falla la conversión de T4 a T3 en los tejidos.' : 'Sin enfermedad grave: el eje tiroideo sigue su patrón.'; org = adr ? 'ficha p. 48 (15-25 y 350 mg/día); 60 y 150 ilustrativos' : 'ficha p. 56'; pulso(); }
  if (a === 'mas') { hacer('estres', { v: Math.min(3, s.estres + 1) }); return; }
  if (a === 'circi') { s.circi = !s.circi; t = s.circi ? 'Las citocinas bloquean tres puntos: hipotálamo, acción de la ACTH y respuesta del órgano. El cortisol cae y el vasopresor sube.' : 'Sin bloqueo: el eje responde al estrés.'; org = 'ficha p. 49-50 (Fig. 51.1); cifras ilustrativas'; }
  if (a === 'dias') { s.dias = o.v; t = s.dias >= 14 ? 'Con 14 días o más de corticoide el eje se apaga: el cable frena y la suprarrenal se encoge.' : 'Con menos de 10-14 días de corticoide, el eje se recupera pronto.'; org = 'Younes 2017 (otra fuente, pediátrica)'; }
  if (a === 'farm') { s.farm = s.farm === o.v ? '' : o.v; t = { eto: 'Etomidato: un candado en la glándula; deja de sintetizar cortisol.', keto: 'Ketoconazol: inhibe la síntesis de cortisol en la glándula.', amio: 'Amiodarona: bloquea la conversión de T4 a T3; la T4 libre sube y la TSH sigue normal.', hep: 'Heparina: libera ácidos grasos que desplazan a la T4 de sus proteínas y sube la T4 libre.', '': 'Sin fármaco.' }[s.farm]; org = adr ? 'ficha p. 50' : 'ficha p. 54'; }
  if (a === 'pat') { s.pat = o.v; s.at = false; s.levo = false; t = { sano: 'Glándula sana.', graves: 'Graves: la glándula va sola, la T4 libre sube y la TSH se apaga.', t3: 'T3-toxicosis: TSH baja con T4 libre normal.', hipoP: 'Hipotiroidismo primario: glándula apagada, T4 libre baja y TSH alta.', hipoS: 'Hipotiroidismo secundario: la hipófisis no manda; T4 libre baja y TSH baja.' }[o.v]; org = 'ficha p. 53, 56 (Tabla 51.2); el cable: Libro Azul'; pulso(); }
  if (a === 'acth') { s.acth = true; t = `Se dan 250 µg de ACTH y se mide a los 60 minutos: sube ${L0.delta} µg/dL.`; org = 'ficha p. 50; la subida es ilustrativa'; }
  if (a === 'hc') { s.hc = true; s.hcD = s.dia; s.intLevo = false; t = 'Hidrocortisona 100 mg IV cada 8 horas (200-300 mg al día).'; org = 'ficha p. 51, 55, 57'; }
  if (a === 'ret') { s.taper = true; t = 'Retirada gradual durante varios días para evitar el rebote de mediadores inflamatorios.'; org = 'ficha p. 51'; }
  if (a === 'at') { s.at = o.v; s.atD = s.dia; t = o.v === 'ptu' ? 'Propiltiouracilo: bloquea la síntesis de T4 y su conversión a T3; es el de la tormenta (500-1.000 mg de carga, 250 mg/4 h).' : 'Metimazol 10-20 mg al día: bloquea la síntesis de T4; es el de la tirotoxicosis, no el de la tormenta.'; org = 'ficha p. 54-55; bajada de T4 en días ilustrativa'; }
  if (a === 'yodo') { s.intYodo = true; s.yodo = !!s.at; t = s.at ? 'Yodo, 5 gotas de Lugol cada 6 horas: bloquea la síntesis y la secreción de T4, junto al antitiroideo.' : 'Yodo sin antitiroideo.'; org = 'ficha p. 55'; }
  if (a === 'prop') { s.intProp = true; s.prop = !s.asma; t = s.asma ? 'Propranolol con crisis asmática.' : 'Propranolol oral 10-40 mg, 3-4 veces al día (60-80 mg cada 4 horas en la tormenta): calma la taquicardia y bloquea T4 → T3.'; org = 'ficha p. 54, Tabla 51.3'; }
  if (a === 'asma') { s.asma = !s.asma; if (!s.asma) s.intProp = false; t = s.asma ? 'Crisis asmática: ningún betabloqueante.' : 'Sin crisis asmática.'; org = 'ficha p. 54'; }
  if (a === 'levo') { s.intLevo = true; s.levo = !(L0.mixed && !s.hc); if (s.levo) s.levoD = s.dia; t = s.levo ? 'Levotiroxina: en el mixedema, bolo IV lento de 200-400 µg; la T4 libre sube y la TSH baja.' : 'Levotiroxina sin hidrocortisona previa.'; org = 'ficha p. 56-57; subida en días ilustrativa'; }
  if (a === 'lio') { s.lio = true; t = 'Liotironina (T3): carga de 5-20 µg y 2,5-10 µg cada 8 horas, porque la conversión de T4 a T3 puede estar deprimida.'; org = 'ficha p. 57'; }
  if (a === 'dia') { s.dia += o.v; t = `Día ${s.dia}.`; if (s.hc && s.hcD != null && s.dia - s.hcD >= 3) t += ' Pasados tres días de hidrocortisona, el vasopresor ya se pudo retirar y el lactato se normalizó.'; org = 'reloj ilustrativo; ficha p. 51'; }
  frase(t, org); pintar();
}
const API = { hacer: (a, o) => hacer(a, o), poner: (o) => { Object.assign(s, o); pintar(); } };
function ponerPreset(c) { clave = c; const { nombre, txt, ...p } = PRESETS[c]; s = nuevo(p); oculto = false; foco = []; firma = ''; $('ov-c').value = $('ov-t4').value = $('ov-tsh').value = ''; frase(txt, 'paciente inventado; cifras de la ficha o ilustrativas'); pintar(); pulso(); if (guiaApi) guiaApi.abrir(c); }
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = []; delete caja.dataset.fin; if (guiaApi) guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = { apuesta: APUESTA, error: ERROR, caso: CASO }[m]; clave = def.preset; const { nombre, txt, ...p } = PRESETS[def.preset]; s = nuevo(p); firma = '';
  const tit = document.createElement('h3'); tit.textContent = def.titulo; caja.append(tit);
  if (m === 'apuesta') { oculto = true; const p2 = document.createElement('p'); p2.className = 'enun'; p2.textContent = `${def.antes} ${def.pregunta}`; const c = document.createElement('div'); c.className = 'ops'; caja.append(p2, c); opciones(c, def.ops, () => { oculto = false; def.tras(API); fin(caja, m); }, def.orden); }
  else if (m === 'error') { const p2 = document.createElement('p'); p2.className = 'enun'; p2.textContent = def.antes; caja.append(p2); let hechas = 0;
    def.frases.forEach((f) => { const c = document.createElement('div'), t = document.createElement('p'), b = document.createElement('div'); t.className = 'enun'; t.textContent = f.t; b.className = 'ops'; c.append(t, b); caja.append(c); opciones(b, [{ t: 'Es un error', ok: f.error, por: f.por }, { t: 'Es correcta', ok: !f.error, por: f.por }], () => { if (++hechas === def.frases.length) fin(caja, m); }); }); }
  else caso(0, caja, def, m);
  pintar();
}
function caso(i, caja, def, m) {
  const st = def.pasos[i]; if (st.antes) st.antes(API); const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${def.pasos.length}. ${st.enun}`; const o = document.createElement('div'); o.className = 'ops'; c.append(p, o); caja.append(c);
  opciones(o, st.ops, (op) => { if (op.haz) op.haz(API); pintar(); if (i + 1 < def.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja, def, m); pintar(); }); c.append(b); } else fin(caja, m); }, st.orden);
}
function fin(caja, k) { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[k].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; }
const RANGO = { c: [0, 60, 'Cortisol'], t4: [0.2, 6, 'T4 libre'], tsh: [0.001, 100, 'TSH'] };
function teclear(k, el) { const v = el.value.trim(); if (v === '') { delete s.ov[k === 'c' ? 'cort' : k]; s.ovMal = ''; return pintar(); }
  const n = parseFloat(v.replace(',', '.')), [a, b, nom] = RANGO[k]; if (!(n >= a && n <= b)) { s.ovMal = `${nom} ${v}`; frase(`${nom} ${v}: no es una cifra posible. El valor no se aplica.`, 'fisiología general'); return pintar(); }
  s.ovMal = ''; s.ov[k === 'c' ? 'cort' : k] = n; frase(`${nom} ${v} puesto a mano: el punto del mapa se mueve.`, 'cifra tecleada'); pintar(); }
function montar() {
  D('.modos').forEach((m) => m.addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); }));
  const b = (id, t, extra = '') => `<button type="button" id="${id}" class="b" ${extra}>${t}</button>`, d = (k, v, t) => `<button type="button" data-${k}="${v}" aria-pressed="false">${t}</button>`;
  $('dock-panel').innerHTML = `
   <div class="mando"><b class="dock-nota">Glándula</b><div class="fila">${d('gl', 'adr', 'Suprarrenal')}${d('gl', 'tir', 'Tiroides')}</div></div>
   <div class="mando" data-solo="tir"><b class="dock-nota">Estado de la tiroides</b><div class="fila">${d('pat', 'sano', 'Sana')}${d('pat', 'graves', 'Graves')}${d('pat', 't3', 'T3-toxicosis')}${d('pat', 'hipoP', 'Hipotiroidismo primario')}${d('pat', 'hipoS', 'Hipotiroidismo secundario')}</div></div>
   <div class="mando"><b class="dock-nota">Estrés o enfermedad aguda</b><div class="fila">${d('estres', 0, 'Reposo')}${d('estres', 1, 'Cirugía o infección')}${d('estres', 2, 'Sepsis')}${d('estres', 3, 'Shock séptico')}${b('b-estres-mas', 'Más estrés')}<span data-solo="adr" class="fila" style="flex:1 1 100%">${b('b-circi', 'Citocinas bloquean el eje')}</span></div></div>
   <div class="mando" data-solo="adr"><b class="dock-nota" id="r-dias-t">Corticoide exógeno</b><input type="range" id="r-dias" min="0" max="365" step="1" value="0" aria-label="Días de corticoide exógeno"></div>
   <div class="mando"><b class="dock-nota">Fármaco que corta o desvía</b><div class="fila"><span data-solo="adr" class="fila" style="flex:1 1 100%">${d('farm', 'eto', 'Etomidato')}${d('farm', 'keto', 'Ketoconazol')}</span><span data-solo="tir" class="fila" style="flex:1 1 100%">${d('farm', 'amio', 'Amiodarona')}${d('farm', 'hep', 'Heparina')}</span></div></div>
   <div class="mando" data-solo="adr"><b class="dock-nota">Prueba</b><div class="fila">${b('b-acth', 'ACTH 250 µg · mide a los 60 min')}</div></div>
   <div class="mando"><b class="dock-nota">Tratamiento</b><div class="fila">${b('b-hc', 'Hidrocortisona 100 mg/8 h')}${b('b-ret', 'Retirar hidrocortisona poco a poco')}<span data-solo="tir" class="fila" style="flex:1 1 100%">${b('b-ptu', 'PTU')}${b('b-mmi', 'Metimazol')}${b('b-yodo', 'Yodo (Lugol)')}${b('b-prop', 'Propranolol oral')}${b('b-levo', 'Levotiroxina IV')}${b('b-lio', 'Liotironina')}</span></div></div>
   <div class="mando"><b class="dock-nota">Reloj</b><div class="fila">${b('b-d1', '+1 día')}${b('b-d7', '+7 días')}</div></div>`;
  $('dock-medir').innerHTML = `<div class="mando"><b class="dock-nota">Paciente</b><div class="presets" id="presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('')}</div></div>
   <div class="mando"><b class="dock-nota">Teclea un resultado (vacío = el del modelo)</b><div class="fila"><label>Cortisol µg/dL<input id="ov-c" type="text" inputmode="decimal"></label><label>T4 libre ng/dL<input id="ov-t4" type="text" inputmode="decimal"></label><label>TSH mU/mL<input id="ov-tsh" type="text" inputmode="decimal"></label></div>${b('b-asma', 'Crisis asmática')}</div>`;
  $('dock-panel').addEventListener('click', (ev) => { const x = ev.target.closest('button'); if (!x || x.disabled) return; const ds = x.dataset;
    if (ds.gl) hacer('gl', { v: ds.gl }); else if (ds.pat) hacer('pat', { v: ds.pat }); else if (ds.estres != null) hacer('estres', { v: +ds.estres }); else if (ds.farm) hacer('farm', { v: ds.farm });
    else { const m = { 'b-estres-mas': ['mas'], 'b-circi': ['circi'], 'b-acth': ['acth'], 'b-hc': ['hc'], 'b-ret': ['ret'], 'b-ptu': ['at', { v: 'ptu' }], 'b-mmi': ['at', { v: 'mmi' }], 'b-yodo': ['yodo'], 'b-prop': ['prop'], 'b-levo': ['levo'], 'b-lio': ['lio'], 'b-d1': ['dia', { v: 1 }], 'b-d7': ['dia', { v: 7 }] }[x.id]; if (m) hacer(m[0], m[1] || {}); } });
  $('r-dias').addEventListener('input', (ev) => hacer('dias', { v: +ev.target.value }));
  $('dock-medir').addEventListener('click', (ev) => { const x = ev.target.closest('button'); if (!x) return; if (x.id === 'b-asma') hacer('asma'); else if (x.dataset.pre) { modo = 'explorar'; $('prueba').hidden = true; ponerPreset(x.dataset.pre); } });
  [['ov-c', 'c'], ['ov-t4', 't4'], ['ov-tsh', 'tsh']].forEach(([id, k]) => $(id).addEventListener('change', (ev) => teclear(k, ev.target)));
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const x = ev.target.closest('[data-pest]'); if (!x) return; dock.querySelectorAll('[data-pest]').forEach((y) => y.setAttribute('aria-selected', String(y === x))); $('dock-panel').hidden = x.dataset.pest !== 'dar'; $('dock-medir').hidden = x.dataset.pest !== 'medir'; });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha'); if (f) { const t = $('toast'); t.textContent = `En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600); } });
  guiaApi = crearGuia({ caja: $('guia'), hacer, cita, setFoco: (z) => { foco = z; pintar(); } });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha; el cable: Libro Azul</span>`;
  $('tabla-512').innerHTML = `<table class="data-table"><caption>Tabla 51.2 · Patrones de las pruebas tiroideas ${cita('53:mu-tabla-51-2')}</caption><thead><tr><th>Condición</th><th>T4 libre</th><th>TSH</th></tr></thead><tbody>${TABLA512.map((r) => `<tr data-f="${r[0]}"><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · <a class="enlace" href="${PDF}#page=${p}" target="_blank" rel="noopener">p. ${p}</a></li>`).join('') + FUENTES_EXT.map((t) => `<li>${t}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  topeApi = crearTope({ monitor: $('sellos'), dock, cita });
}
function ajustar() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
montar(); ponerPreset('tori'); ajustar();
new ResizeObserver(ajustar).observe($('dock')); new ResizeObserver(ajustar).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
window.__eje = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, teclear: (k, v) => { $({ c: 'ov-c', t4: 'ov-t4', tsh: 'ov-tsh' }[k]).value = v; $({ c: 'ov-c', t4: 'ov-t4', tsh: 'ov-tsh' }[k]).dispatchEvent(new Event('change')); } };
