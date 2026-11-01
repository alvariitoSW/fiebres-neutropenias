// Cráneo vivo · opción C «El flujo». Reutiliza (importados, no copiados): js/core/tope.js (topes con sello), js/core/frase-vista.js (la frase viva
// a la vista), js/core/particulas.js (hematíes y O₂, leyenda) y css/variables.css (tokens, copiados en b3-ritmo/base.css). El latido del
// motor del shock vivo NO se importa en la maqueta: la PAM es una cifra; si se elige, se enchufa a shock-vivo/ al construirla en la app.
// Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { leyendaParticulas } from '../../../js/core/particulas.js';
import { PDF, PRESETS, IDEA, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, fichaDe, pagDe } from './datos.js';
import { nuevo, leer, topes, fmt, clamp } from './modelo.js';
import { escena } from './dibujo.js';
import { crearGuia } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id);
let s = nuevo('herme'), clave = 'herme', modo = 'explorar', oculto = false, foco = [], guiaApi, topeApi, firma = '';
const cita = (c) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${pagDe(c)}" target="_blank" rel="noopener">PDF p. ${pagDe(c)}</a> · <button type="button" class="ver-ficha" data-resaltar="#${fichaDe(c)}" data-pag-ficha="${pagDe(c)}">p. ${pagDe(c)} · Ver en la ficha</button></span>`;
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto, t.tono]));
  if (f === firma) return; firma = f;
  for (const c of ['pasin', 'pa220', 'tpapa', 'tpaok', 'pam65', 'sat94', 'nitro', 'vpp', 'me', 'ppc50', 'pic20', 'gluA', 'gluB', 'dex', 'gluM', 'tMax', 'fiebre', 'dci', 'dia21']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off || [], bajo: t.n === 'aviso' ? '#avisos' : null });
}
function pintar() {
  const L = leer(s); aplicarTopes(L);
  $('cr-svg').innerHTML = escena(s, L, oculto, foco);
  const q = oculto ? '?' : null;
  $('m-pa').textContent = `${Math.round(L.pas)}/${Math.round(L.pad)}`; $('m-pam').textContent = fmt(s.pam); $('m-pic').textContent = fmt(L.picEf);
  $('m-ppc').textContent = q || fmt(L.ppc); $('m-flujo').textContent = q || fmt(L.flujo) + ' %'; $('m-sat').textContent = L.sat + ' %';
  $('m-dtc').textContent = q || (L.dtc == null ? 'sin señal' : fmt(L.dtc)); $('m-glu').textContent = fmt(s.glu); $('m-t').textContent = fmt(s.temp, 1); $('m-gcs').textContent = L.gcs == null ? '—' : L.gcs;
  $('m-dia').textContent = s.hsa ? s.dia : '—';
  topeApi.refrescar(); $('b-dia-').disabled = !s.hsa || s.dia <= 0; $('b-dia-mas').disabled = !s.hsa || s.dia >= 21;
  document.querySelectorAll('[data-fio]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.fio === s.fio2)));
  $('b-vent').setAttribute('aria-pressed', String(s.vpp)); $('b-vent').textContent = s.vpp ? 'Presión positiva: sí' : 'Respira solo';
  $('b-tpa').setAttribute('aria-pressed', String(s.tpa)); $('b-tpa').textContent = s.tpa ? 'Trombólisis: sí' : 'Trombólisis: no';
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('.presets button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === clave)));
  $('fig-tpa').classList.toggle('resalta', L.pas > 180 || L.pad > 105 ? s.tpa : false);
}
const MOVER = { baja: 'pam', sube: 'pam' };
function hacer(a, o = {}) {
  const L0 = leer(s); let t = '', org = '';
  if (a === 'baja' || a === 'nitro') { s.pam = Math.max(45, s.pam - 10); if (a === 'nitro') s.nitro = true; const L = leer(s); t = a === 'nitro' ? `Nitroprusiato: la PAM baja a ${fmt(s.pam)} y la PIC sube (${fmt(L0.picEf)} → ${fmt(L.picEf)}); la PPC cae de ${fmt(L0.ppc)} a ${fmt(L.ppc)} y el flujo a ${fmt(L.flujo)} %.` : `Antihipertensivo (labetalol, nicardipina): PAM ${fmt(L0.ppc + L0.picEf)} → ${fmt(s.pam)}, PA ${Math.round(L.pas)}/${Math.round(L.pad)}. La PPC pasa de ${fmt(L0.ppc)} a ${fmt(L.ppc)} y el flujo de la penumbra de ${fmt(L0.flujo)} a ${fmt(L.flujo)} %.`; org = a === 'nitro' ? 'dirección: ficha · p. 36; subida de PIC ilustrativa' : 'dirección: ficha · p. 36; caída ilustrativa'; }
  if (a === 'sube') { s.pam = Math.min(180, s.pam + 10); const L = leer(s); t = `Vasopresor (noradrenalina; fenilefrina si hay FA rápida): PAM ${fmt(s.pam)}, PA ${Math.round(L.pas)}/${Math.round(L.pad)}. El flujo sube a ${fmt(L.flujo)} % porque la autorregulación no lo frena.`; org = 'ficha · p. 36-37; magnitud ilustrativa'; }
  if (a === 'picd' || a === 'picu' || a === 'picx') { s.pic = clamp(s.pic + (a === 'picd' ? -5 : a === 'picu' ? 5 : 15), 0, s.pam); const L = leer(s); t = a === 'picd' ? `Drenaje de LCR o bolo de salino hipertónico: la PIC baja a ${fmt(L.picEf)} y la PPC sube a ${fmt(L.ppc)}.` : `La PIC sube a ${fmt(L.picEf)} (edema, sangre o hidrocefalia): la mano aprieta el vaso y la PPC cae a ${fmt(L.ppc)}.`; org = 'ficha · p. 41, 45; magnitudes ilustrativas'; }
  if (a === 'fio') { s.fio2 = o.v; const L = leer(s); t = s.fio2 === 21 ? `Aire ambiente: SaO₂ ${L.sat} %. El flujo cerebral vuelve a ${fmt(L.flujo)} %.` : `O₂ al ${s.fio2} %: SaO₂ ${L.sat} % y el flujo cerebral cae a ${fmt(L.flujo)} % (con el 100 % cae 15-30 %).`; org = 'ficha · p. 34-35; SaO₂ ilustrativa'; }
  if (a === 'vent') { s.vpp = !s.vpp; const L = leer(s); t = s.vpp ? `Presión positiva: la PIC sube a ${fmt(L.picEf)} y la PPC baja a ${fmt(L.ppc)}.` : 'Respira solo: la PIC vuelve a su valor.'; org = 'dirección: ficha · p. 35; subida ilustrativa'; }
  if (a === 'glu') { s.glu = Math.min(400, s.glu + 60); s.dex = true; t = `Suero glucosado: glucemia ${fmt(s.glu)} mg/dL. Marino lo desaconseja en el ictus.`; org = 'ficha · p. 37; subida ilustrativa'; }
  if (a === 'ins') { s.glu = Math.max(30, s.glu - 40); s.dex = false; t = `Insulina: glucemia ${fmt(s.glu)} mg/dL; el objetivo es 140-180.`; org = 'ficha · p. 37; bajada ilustrativa'; }
  if (a === 'fiebre') { s.temp = Math.min(40.5, +(s.temp + 0.5).toFixed(1)); t = `Temperatura ${fmt(s.temp, 1)} °C: la fiebre empeora la recuperación y la mortalidad.`; org = 'ficha · p. 37'; }
  if (a === 'frio') { s.temp = Math.max(36, +(s.temp - 0.5).toFixed(1)); t = `Temperatura ${fmt(s.temp, 1)} °C tras tratar la fiebre y buscar su causa.`; org = 'ficha · p. 37'; }
  if (a === 'temp') { s.temp = o.v; t = `Temperatura ${fmt(s.temp, 1)} °C: buscar infección y bajarla.`; org = 'ficha · p. 37'; }
  if (a === 'dia' || a === 'diaMas' || a === 'diaMenos') { s.dia = clamp(a === 'dia' ? o.v : s.dia + (a === 'diaMas' ? 1 : -1), 0, 21); const L = leer(s); t = s.dia >= 4 && s.dia <= 14 ? `Día ${s.dia}: vasoespasmo. El Doppler sube a ${fmt(L.dtc)} cm/s, el flujo baja a ${fmt(L.flujo)} % y la GCS es ${L.gcs}.` : `Día ${s.dia} de la hemorragia: GCS ${L.gcs}, Doppler ${fmt(L.dtc)} cm/s.`; org = 'dirección: ficha · p. 48; cifras ilustrativas'; }
  frase(t, org); pintar();
}
function ponerPreset(c) { clave = c; s = nuevo(c); oculto = false; foco = []; frase(PRESETS[c].txt, 'paciente inventado; cifras de la ficha'); pintar(); if (guiaApi) guiaApi.abrir(c === 'sin' || c === 'err' ? 'herme' : c); }
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = []; if (guiaApi) guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : CASO; clave = def.preset; s = nuevo(def.preset); firma = '';
  const tit = document.createElement('h3'); tit.textContent = def.titulo; caja.append(tit);
  if (m === 'apuesta') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `${def.antes} ${def.pregunta}`; const c = document.createElement('div'); c.className = 'ops'; caja.append(p, c);
    opciones(c, def.ops, () => { oculto = false; def.tras({ hacer }); fin(caja, 'apuesta'); }, def.orden);
  } else if (m === 'error') {
    oculto = true; const p = document.createElement('p'); p.className = 'enun'; p.textContent = def.antes; caja.append(p); let hechas = 0;
    def.frases.forEach((f) => { const c = document.createElement('div'), t = document.createElement('p'), b = document.createElement('div'); t.className = 'enun'; t.textContent = f.t; b.className = 'ops'; c.append(t, b); caja.append(c);
      opciones(b, [{ t: 'Es un error', ok: f.error, por: f.por }, { t: 'Es correcta', ok: !f.error, por: f.por }], () => { if (++hechas === def.frases.length) { oculto = false; pintar(); fin(caja, 'error'); } }); });
  } else caso(0, caja);
  pintar();
}
function caso(i, caja) {
  const st = CASO.pasos[i]; const c = document.createElement('div'); c.className = 'paso'; const p = document.createElement('p'); p.className = 'enun'; p.textContent = `Paso ${i + 1} de ${CASO.pasos.length}. ${st.enun}`; const o = document.createElement('div'); o.className = 'ops'; c.append(p, o); caja.append(c);
  opciones(o, st.ops, (op) => { if (op.haz) op.haz({ hacer }); pintar(); if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); pintar(); }); c.append(b); } else fin(caja, 'caso'); }, st.orden);
}
function fin(caja, k) { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[k].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; }
function montar() {
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  const bt = (id, txt, cls = 'b') => `<button type="button" id="${id}" class="${cls}">${txt}</button>`, fio = [21, 30, 60, 100].map((v) => `<button type="button" data-fio="${v}" aria-pressed="false">${v} %</button>`).join('');
  $('dock-panel').innerHTML = `
   <div class="mando"><b class="dock-nota">Presión arterial media (PAM)</b><div class="fila">${bt('b-baja', 'Bajar −10 (labetalol)')}${bt('b-sube', 'Subir +10 (noradrenalina)')}${bt('b-nitro', 'Nitroprusiato (trampa)')}</div></div>
   <div class="mando"><b class="dock-nota">Presión intracraneal (PIC)</b><div class="fila">${bt('b-picd', 'Bajar −5 (drenar)')}${bt('b-picu', 'Subir +5')}${bt('b-picx', 'Subir +15')}</div></div>
   <div class="mando"><b class="dock-nota">Oxígeno inspirado (FiO₂)</b><div class="fila">${fio}</div></div>
   <div class="mando"><b class="dock-nota">Respirador</b><div class="fila">${bt('b-vent', 'Respira solo')}</div></div>
   <div class="mando"><b class="dock-nota">Glucosa</b><div class="fila">${bt('b-glu', 'Glucosado +60')}${bt('b-ins', 'Insulina −40')}</div></div>
   <div class="mando"><b class="dock-nota">Temperatura</b><div class="fila">${bt('b-fiebre', 'Fiebre +0,5')}${bt('b-frio', 'Bajarla −0,5')}</div></div>
   <div class="mando"><b class="dock-nota">Reloj de la HSA (día <span id="m-dia"></span>)</b><div class="fila">${bt('b-dia-', 'Día −1')}${bt('b-dia-mas', 'Día +1')}</div></div>`;
  $('dock-medir').innerHTML = `<div class="mando"><b class="dock-nota">Paciente</b><div class="presets" id="presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('')}</div></div><div class="mando">${bt('b-tpa', 'Trombólisis: sí')}</div>`;
  const ACC = { 'b-baja': 'baja', 'b-sube': 'sube', 'b-nitro': 'nitro', 'b-picd': 'picd', 'b-picu': 'picu', 'b-picx': 'picx', 'b-vent': 'vent', 'b-glu': 'glu', 'b-ins': 'ins', 'b-fiebre': 'fiebre', 'b-frio': 'frio', 'b-dia-': 'diaMenos', 'b-dia-mas': 'diaMas' };
  $('dock-panel').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return; if (b.dataset.fio) hacer('fio', { v: +b.dataset.fio }); else if (ACC[b.id]) hacer(ACC[b.id]); });
  $('b-tpa').addEventListener('click', () => { s.tpa = !s.tpa; frase(s.tpa ? 'Con trombólisis: la PA debe quedar por debajo de 180/105 durante 24 h.' : 'Sin trombólisis: solo se baja la PA por encima de 220/120.', 'ficha · p. 36'); pintar(); });
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { modo = 'explorar'; $('prueba').hidden = true; ponerPreset(b.dataset.pre); } });
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; ajustar(); });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha'); if (f) { const t = $('toast'); t.textContent = `En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600); } });
  guiaApi = crearGuia({ caja: $('guia'), hacer, cita, setFoco: (z) => { foco = z; pintar(); } });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t}${p ? ` · <a class="enlace" href="${PDF}#page=${p}" target="_blank" rel="noopener">p. ${p}</a>` : ''}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  $('leyenda').innerHTML = leyendaParticulas(['rbc', 'o2'], { titulo: 'Qué es cada partícula' }) + '<p class="min-nota">Línea continua gruesa: anillo de penumbra vivo. Punteada fina: apagado. Línea discontinua del gráfico: meseta del cerebro sano, ilustrativa (otra fuente pendiente).</p>';
  topeApi = crearTope({ monitor: $('monitor'), dock, cita });
}
function ajustar() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
montar(); ponerPreset('herme'); ajustar();
new ResizeObserver(ajustar).observe($('dock')); new ResizeObserver(ajustar).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
window.__cr = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); } };
