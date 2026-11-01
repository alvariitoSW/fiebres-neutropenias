// Unión neuromuscular vivo · opción B «Del nervio al pulgar». Reutiliza (importados, no copiados): js/core/tope.js (topes con sello), js/core/frase-vista.js
// (frase viva a la vista), js/core/motion.js (Motion para el impulso; con «reducir movimiento», estado final), js/core/particulas.js (leyenda) y los tokens de
// css/variables.css (copiados en b3-ritmo/base.css). La lupa es propia y simple: en la app se enchufa el receptor vivo (b3). Los botones del dock se crean UNA vez.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { cargarMotion, sinMovimiento } from '../../../js/core/motion.js';
import { leyendaParticulas } from '../../../js/core/particulas.js';
import { PDF, PRESETS, IDEA, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, TABLA, DUR, NOMBRE, fichaDe, pagDe } from './datos.js';
import { nuevo, cambiar, leer, fmt, clamp } from './modelo.js';
import { NEO, bloqueoDe, sugNecesita } from './bloqueo-motor.js';
import { topes } from './topes.js';
import { escena, lupa } from './dibujo.js';
import { crearGuia } from './guia.js';
import { APUESTA, ERROR, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById(id);
let ultEst = '', s = nuevo('flor'), clave = 'flor', modo = 'explorar', oculto = false, foco = [], guiaApi, topeApi, firma = '';
const cita = (c) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${pagDe(c)}" target="_blank" rel="noopener">PDF p. ${pagDe(c)}</a> · <button type="button" class="ver-ficha" data-resaltar="#${fichaDe(c)}" data-pag-ficha="${pagDe(c)}">p. ${pagDe(c)} · Ver en la ficha</button></span>`;
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
const TODOS = ['succiK', 'parada', 'neo70', 'neo5', 'succik', 'rocaire', 'sugmal', 'tof0', 'par48', 'intub', 'piri', 'ses', 'igiv', 'sintto', 'mccrap', 'farm', 'hielo2'];
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of TODOS) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off, bajo: t.n === 'aviso' ? '#avisos' : null });
}
function pintar() {
  const L = leer(s); aplicarTopes(L);
  $('est').innerHTML = escena(s, L, oculto, foco); $('un-lupa').innerHTML = lupa(s, L);
  const q = oculto ? '?' : null, mg = s.est === 'miastenia';
  $('m-cond').textContent = q || L.cond; $('m-tof').textContent = s.est === 'bloqueo' && s.rel ? L.tof + '/4' : '4/4'; $('m-f').textContent = L.f + ' %';
  $('m-ref').textContent = q || L.ref; $('m-lcr').textContent = q || L.lcr; const apnea = s.est === 'bloqueo' && s.rel && L.tof === 0; $('m-cv').innerHTML = apnea ? 'apnea' : `${Math.round(L.cv)} mL<small>${fmt(L.cvkg, 1)} mL/kg${s.cvFijo ? ' · fija' : ''}</small>`; $('m-pim').textContent = apnea ? 'apnea' : '−' + L.f;
  $('m-fc').textContent = L.fc; $('m-pa').textContent = L.pa; $('m-k').textContent = fmt(s.k, 1); $('m-hielo').textContent = L.ptosis == null ? '—' : '+' + L.ptosis + ' mm'; $('m-sec').textContent = L.sec ? 'aumentan' : '—';
  const tb = $('tabla-466'); tb.dataset.col = s.est === 'gbs' ? '1' : mg ? '2' : '';
  topeApi.refrescar(); $('b-dia-').disabled = s.dia <= 0;
  document.querySelectorAll('[data-est]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.est === s.est)));
  document.querySelectorAll('[data-estim]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.estim === s.estim)));
  $('b-via').setAttribute('aria-pressed', String(s.via)); $('b-via').textContent = s.via ? 'Intubado (vía asegurada)' : 'Intubar (vía sin asegurar)';
  $('b-hielo').textContent = s.hielo ? `Hielo: ${s.hielo} min` : 'Hielo 2 min'; $('b-neo').textContent = `Neostigmina +35 µg/kg (${s.neo} de ${NEO.max})`;
  $('b-pla').textContent = `Plasmaféresis +1 sesión (${s.ses})`; $('b-perf-mas').textContent = `Perfusión + (${s.perf})`;
  document.querySelectorAll('[data-modo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('[data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === clave)));
  $('detalle-lupa').classList.toggle('foco-caja', foco.includes('lupa')); $('tabla-466').classList.toggle('foco-caja', foco.includes('tabla'));
  if (foco.includes('lupa')) $('detalle-lupa').open = true;
  $('pulmon-vivo').hidden = !(s.via && L.crit);
  $('ritmo-vivo').hidden = !(s.rel === 'succi' && s.k >= 5.5);
  if (s.est !== ultEst) { ultEst = s.est; $('detalle-lupa').open = s.est === 'miastenia' || s.est === 'bloqueo'; }
}
async function pulso() {
  const d = $('imp'); if (!d) return; const L = leer(s), tope = s.est === 'bloqueo' && s.rel && L.tof === 0 ? 140 : 264;
  if (sinMovimiento()) { d.setAttribute('opacity', '0'); return; }
  try { const { animate } = await cargarMotion(), lento = L.cond === 'lenta';
    animate(0, 1, { duration: lento ? 2.6 : 0.8, ease: 'linear', onUpdate: (v) => { const q = lento ? Math.round(v * 8) / 8 : v; d.setAttribute('cx', 10 + q * (tope - 10)); d.setAttribute('opacity', v < 1 ? '1' : '0'); } });
  } catch { d.setAttribute('opacity', '0'); }
}
function hacer(a, o = {}) {
  let t = '', org = '', L0 = leer(s), nota = null; const blq = s.est === 'bloqueo', rel = () => NOMBRE[s.rel];
  if (a === 'est') { cambiar(s, o.v); const L = leer(s); t = { gbs: 'Guillain-Barré: la mielina se deshace a trozos; el impulso llega lento, pero la placa no se fatiga. Se resuelve solo en cerca del 80 %.', miastenia: 'Miastenia: la mielina está sana y el impulso llega a tiempo, pero la placa tiene pocos receptores y con estímulos repetidos se agota.', pnc: 'Polineuropatía del crítico: el axón se adelgaza (sensitivo y motor), típica de la sepsis. Sin tratamiento.', mcc: 'Miopatía del crítico: nervio y placa sanos; la fibra pierde miosina. Es el que no se puede retirar del respirador.', bloqueo: 'Relajante: todo está sano y la placa se tapa; el TOF es el juez. Elige succinilcolina, rocuronio o cisatracurio.', sano: 'Sano: el impulso llega, la placa responde y el pulgar se contrae entero.' }[o.v]; org = 'ficha · p. 24-28; velocidad ilustrativa'; if (o.v === 'gbs') pulso(); }
  if (a === 'estim') { s.estim = o.v; const L = leer(s); const sa = L.f; t = o.v === 'unico' ? `Un estímulo: el pulgar da una sacudida del ${L.f} % de la fuerza.` : o.v === 'rep' ? (s.est === 'miastenia' ? 'Diez estímulos seguidos: la sacudida decae. Es la fatiga de la miastenia.' : s.est === 'bloqueo' && s.rel && s.rel !== 'succi' ? 'Estímulo repetido con relajante no despolarizante: la respuesta se apaga con cada estímulo.' : 'Diez estímulos seguidos: las sacudidas salen iguales, sin fatiga.') : `TOF: cuatro estímulos a 2 Hz en el cubital; se cuentan las sacudidas del pulgar (${s.est === 'bloqueo' && s.rel ? L.tof : 4} de 4).`; org = s.est === 'miastenia' ? 'ficha · p. 24-25; caída ilustrativa' : 'ficha · p. 24-27, 30'; pulso(); }
  if (a === 'hielo') { s.hielo += 2; const L = leer(s); t = s.est === 'miastenia' ? (s.hielo > 2 ? 'Más de 2 minutos no añade efecto.' : 'Hielo 2 minutos sobre el ojo cerrado: la ptosis mejora +3 mm (positivo desde +2 mm; sensibilidad y especificidad 80 %).') : 'El hielo es la prueba de la miastenia: aquí no hay debilidad ocular que mejore.'; org = 'ficha · p. 24-25; +3 mm ilustrativo'; }
  if (a === 'igiv') { if (s.est === 'pnc' || s.est === 'mcc') t = 'No hay tratamiento específico para este cuadro.'; else { s.igiv = s.dia; if (s.t0 == null) s.t0 = s.dia; t = 'IgIV 2 g/kg en 2-5 días. La fuerza no sube hasta el día 4-5: pasa el reloj para verlo.'; } org = 'ficha · p. 26-27; subida ilustrativa'; }
  if (a === 'pla') { s.ses++; if (s.t0 == null) s.t0 = s.dia; t = s.ses < 2 ? 'Primera sesión de plasmaféresis (5 en 7-10 días, 1-1,5 volúmenes).' : `Sesión ${s.ses}: la fuerza empieza a subir desde la segunda sesión.`; org = 'ficha · p. 26; subida ilustrativa'; }
  if (a === 'piri') { s.piri = true; s.piriOk = !L0.intub; t = s.est === 'miastenia' ? (L0.intub ? 'Piridostigmina con insuficiencia respiratoria: no mejora lo que importa y llena de secreciones la vía aérea.' : 'Piridostigmina: mejora algo la fuerza, pero aumenta las secreciones.') : 'La piridostigmina trata la miastenia; aquí no actúa.'; org = 'ficha · p. 26; subida ilustrativa'; }
  if (a === 'via') { s.via = !s.via; s.cvFijo = s.via && L0.crit ? { cv: L0.cv, cvkg: L0.cvkg } : null; if (s.via) s.dSin = 0; t = s.via ? (s.cvFijo ? `Intubado con CV ${Math.round(L0.cv)} mL (${fmt(L0.cvkg, 1)} mL/kg): la CV del monitor queda fija, ya no se mide. En la app se abre el pulmón vivo con estas cifras.` : 'Vía aérea asegurada: el rocuronio ya no deja sin respirar.') : 'Sin vía aérea.'; org = 'ficha · p. 25, 30-31'; }
  if (a === 'succi' || a === 'roc' || a === 'cis') { if (!blq && s.est !== 'mcc') { cambiar(s, 'bloqueo'); } s.rel = a; s.min = 0; s.sug = 0; s.sugOk = false; s.sugT = null; s.neo = 0; s.neoOk = false; s.neoT = null; s.perf = 0; s.perfT = null; if (a === 'succi') s.k = +(s.k + 0.5).toFixed(1); const L = leer(s);
    t = a === 'succi' ? `Succinilcolina 1 mg/kg: despolariza la placa y la deja abierta; el K⁺ sube 0,5 mEq/L (ahora ${fmt(s.k, 1)}). Empieza en 1-1,5 min (aún no: TOF 4/4) y dura 7-12 min.` : a === 'roc' ? 'Rocuronio 1 mg/kg: un tapón sobre la copa compite con la ACh. Empieza en 1,5-3 min (ahora el TOF sigue 4/4; pasa el reloj) y dura 50-70 min (el texto dice 30-70).' : 'Cisatracurio 0,15-0,2 mg/kg: tapón más lento, empieza en 5-7 min (ahora el TOF sigue 4/4) y dura 35-50 min; ni riñón ni hígado.'; org = 'ficha · p. 29-30 (Tabla 46.7); duración ilustrativa'; }
  if (a === 'min') { s.min += 10; t = blq && s.rel ? `Pasan ${s.min} min: TOF ${leer(s).tof}/4.` : 'El reloj de minutos solo cuenta con un relajante puesto.'; org = 'ficha · p. 29-30; punto medio ilustrativo'; }
  if (a === 'neo') { s.neo = Math.min(NEO.max, s.neo + NEO.paso); s.neoOk = s.neoOk || (blq && !!s.rel && L0.tof >= 2); s.neoT ??= s.min; const L = leer(s); t = `Neostigmina ${s.neo} µg/kg: ${s.neoOk ? 'la ACh se acumula y revierte un bloqueo moderado en 8-45 min; pasa el reloj.' : 'con el bloqueo profundo (TOF 0-1) no revierte nada: espera a que haya 2 respuestas.'} Sí hay bradicardia (FC ${L.fc}) y secreciones. Tope: 70 µg/kg.`; org = 'ficha · p. 31 (tope 70 µg/kg); 8-45 min y caída de FC ilustrativas'; }
  if (a === 'sug') { const need = sugNecesita(s, L0.tof); s.sug = o.v; s.sugOk = o.v >= need; s.sugT = s.min; if (s.rel === 'roc') s.min += 3; t = s.rel === 'roc' ? (s.sugOk ? `Sugammadex ${o.v} mg/kg: envuelve al rocuronio y lo saca de la hendidura en 2-3 min (pasan 3).` : `Sugammadex ${o.v} mg/kg es poco: hacían falta ${need} mg/kg (16 si es inmediato, 4 profundo, 2 moderado); el bloqueo solo baja a medias.`) : `Sugammadex ${o.v} mg/kg: solo vale con aminoesteroides (rocuronio); aquí no actúa.`; org = 'ficha · p. 31 (2 moderado · 4 profundo · 16 inmediato)'; }
  if (a === 'perfMas' || a === 'perfMenos') { const p0 = s.perf; s.perf = clamp(s.perf + (a === 'perfMas' ? 1 : -1), 0, 3); if (!p0 && s.perf) s.perfT = s.min; t = s.rel && s.rel !== 'succi' ? `Perfusión nivel ${s.perf} (rocuronio 5-12 µg/kg/min o cisatracurio 1-3 µg/kg/min): TOF ${leer(s).tof}/4 cuando pase el reloj. El objetivo es 1-2 respuestas.` : 'La perfusión es de rocuronio (5-12 µg/kg/min) o cisatracurio (1-3 µg/kg/min); pon uno antes.'; org = 'ficha · p. 29-30; niveles ilustrativos'; }
  if (a === 'farm') { s.farm = o.v; if (o.v === 'cort') s.cort = true; const n = { gent: 'La gentamicina', mg: 'El magnesio', cort: 'El corticoide a dosis alta' }[o.v]; t = s.est === 'miastenia' ? `${n} dificulta la transmisión (Tabla 46.5): la fuerza cae.` : `${n} está en la Tabla 46.5 de la miastenia; aquí no hay miastenia.`; org = 'ficha · p. 24; el mecanismo no lo da Marino; caída ilustrativa'; }
  if (a === 'dia') { const d0 = s.dia; s.dia = o.v != null ? o.v : s.dia + 1; if (L0.intub) { s.dSin += s.dia - d0; if (s.dSin >= 2 && s.dStop == null) s.dStop = s.dia; } const L = leer(s); t = `Día ${s.dia}: fuerza ${L.f} %, CV ${fmt(L.cvkg, 1)} mL/kg${L.aut ? `. Inestabilidad autonómica: FC ${L.fc} y PA ${L.pa} (el día anterior oscilaba al otro extremo)` : ''}.`; org = 'dirección: ficha · p. 26-28; magnitud ilustrativa'; }
  if (a === 'diaMenos') { s.dia = Math.max(0, s.dia - 1); t = `Día ${s.dia}.`; org = 'ficha'; }
  frase(t, org); pintar();
}
function ponerPreset(c) { clave = c; s = nuevo(c); oculto = false; foco = []; frase(PRESETS[c].txt, 'paciente inventado; cifras de la ficha'); pintar(); if (guiaApi) guiaApi.abrir(c); }
function modoPrueba(m) {
  modo = m; const caja = $('prueba'); caja.textContent = ''; caja.hidden = m === 'explorar'; oculto = false; foco = []; delete caja.dataset.fin; if (guiaApi) guiaApi.cerrar();
  if (m === 'explorar') { pintar(); return; }
  const def = m === 'apuesta' ? APUESTA : m === 'error' ? ERROR : CASO; clave = def.preset; s = nuevo(def.preset); firma = '';
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
  opciones(o, st.ops, (op) => { if (op.haz) op.haz({ hacer }); pintar(); if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); caso(i + 1, caja); pintar(); }); c.append(b); } else fin(caja, 'caso'); }, st.orden);
}
function fin(caja, k) { const b = document.createElement('div'); b.className = 'llevas'; b.innerHTML = '<b>Lo que te llevas</b><ul>' + LLEVAS[k].map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('') + '</ul>'; caja.append(b); caja.dataset.fin = '1'; }
function montar() {
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  const bt = (id, txt, extra = '') => `<button type="button" id="${id}" class="b" ${extra}>${txt}</button>`, d = (a, txt, v, k) => `<button type="button" data-a="${a}" data-v="${v}" ${k ? `data-${k.split('=')[0]}="${v}"` : ''} aria-pressed="false">${txt}</button>`;
  const ests = Object.entries({ sano: 'Sano', gbs: 'Guillain-Barré', miastenia: 'Miastenia', pnc: 'Polineuropatía', mcc: 'Miopatía', bloqueo: 'Relajante' }).map(([k, t]) => `<button type="button" data-est="${k}" aria-pressed="false">${t}</button>`).join('');
  $('dock-panel').innerHTML = `
   <div class="mando"><b class="dock-nota">Estado de la cadena</b><div class="fila">${ests}</div></div>
   <div class="mando"><b class="dock-nota">Estímulo (cada pulsación lanza un impulso)</b><div class="fila"><button type="button" data-estim="unico" aria-pressed="false">Único</button><button type="button" data-estim="rep" aria-pressed="false">Repetido ×10</button><button type="button" data-estim="tof" aria-pressed="false">TOF</button>${bt('b-hielo', 'Hielo 2 min')}</div></div>
   <div class="mando"><b class="dock-nota">Tratamiento (días)</b><div class="fila">${bt('b-igiv', 'IgIV 2 g/kg')}${bt('b-pla', 'Plasmaféresis +1 sesión (0)')}${bt('b-piri', 'Piridostigmina')}</div></div>
   <div class="mando"><b class="dock-nota">Relajante</b><div class="fila">${bt('b-via', 'Vía aérea: sin asegurar')}${bt('b-succi', 'Succinilcolina 1 mg/kg')}${bt('b-roc', 'Rocuronio 1 mg/kg')}${bt('b-cis', 'Cisatracurio 0,15 mg/kg')}${bt('b-perf-menos', 'Perfusión −')}${bt('b-perf-mas', 'Perfusión + (0)')}</div></div>
   <div class="mando"><b class="dock-nota">Reversión</b><div class="fila">${bt('b-neo', 'Neostigmina +35 µg/kg (0)')}<button type="button" class="b" data-sug="2">Sugammadex 2 mg/kg</button><button type="button" class="b" data-sug="4">Sugammadex 4 mg/kg</button><button type="button" class="b" data-sug="16">Sugammadex 16 mg/kg</button></div></div>
   <div class="mando"><b class="dock-nota">Fármaco que empeora la miastenia (Tabla 46.5)</b><div class="fila"><button type="button" class="b" data-farm="gent">Gentamicina</button><button type="button" class="b" data-farm="mg">Magnesio</button><button type="button" class="b" data-farm="cort">Corticoide alto</button></div></div>
   <div class="mando"><b class="dock-nota">Reloj</b><div class="fila">${bt('b-min', '+10 min')}${bt('b-dia', 'Día +1')}${bt('b-dia-', 'Día −1')}</div></div>`;
  $('dock-medir').innerHTML = `<div class="mando"><b class="dock-nota">Paciente</b><div class="presets" id="presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('')}</div></div>`;
  const ACC = { 'b-hielo': ['hielo'], 'b-igiv': ['igiv'], 'b-pla': ['pla'], 'b-piri': ['piri'], 'b-via': ['via'], 'b-succi': ['succi'], 'b-roc': ['roc'], 'b-cis': ['cis'], 'b-perf-menos': ['perfMenos'], 'b-perf-mas': ['perfMas'], 'b-neo': ['neo'], 'b-min': ['min'], 'b-dia': ['dia'], 'b-dia-': ['diaMenos'] };
  $('dock-panel').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.est) hacer('est', { v: b.dataset.est }); else if (b.dataset.estim) hacer('estim', { v: b.dataset.estim }); else if (b.dataset.sug) hacer('sug', { v: +b.dataset.sug }); else if (b.dataset.farm) hacer('farm', { v: b.dataset.farm }); else if (ACC[b.id]) hacer(ACC[b.id][0]); });
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { modo = 'explorar'; $('prueba').hidden = true; ponerPreset(b.dataset.pre); } });
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; });
  document.body.addEventListener('click', (ev) => { const f = ev.target.closest('.ver-ficha'); if (f) { const t = $('toast'); t.textContent = `En la app, esto abre la ficha en el párrafo de la p. ${f.dataset.pagFicha} del libro.`; t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600); } });
  guiaApi = crearGuia({ caja: $('guia'), hacer, cita, setFoco: (z) => { foco = z; pintar(); } });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`;
  $('tabla-466').innerHTML = `<table class="data-table"><caption>Tabla 46.6 · Guillain-Barré frente a miastenia ${cita('27:mn-tabla-46-6')}</caption><thead><tr><th>Rasgo</th><th>Guillain-Barré</th><th>Miastenia</th></tr></thead><tbody>${TABLA.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · <a class="enlace" href="${PDF}#page=${p}" target="_blank" rel="noopener">p. ${p}</a></li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  $('leyenda').innerHTML = leyendaParticulas(['k', 'igg'], { titulo: 'Qué es cada partícula' }) + '<p class="min-nota">Manguitos: mielina. Copas: receptores. Tapón: relajante. Y roja: anticuerpo. Aspas: acetilcolinesterasa. Línea de la campana: 15 mL/kg. Cifras de fuerza, CV y PIM: ilustrativas.</p>';
  topeApi = crearTope({ monitor: $('sellos'), dock, cita });
}
function ajustar() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
montar(); ponerPreset('flor'); ajustar();
new ResizeObserver(ajustar).observe($('dock')); new ResizeObserver(ajustar).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
window.__un = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); } };
