// Placa motora viva · del nervio al pulgar (Marino cap. 46). La página: estado de la sesión, monitor, dock de mandos, cadena, lupa, guía y pruebas.
// Se carga al primer abrir (index.js). Usa core/tope.js (sellos), core/frase-vista.js (frase a la vista), core/motion.js (Motion; con «reducir movimiento»,
// estado final) y core/particulas.js (leyenda). Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../core/tope.js';
import { seguirFrase } from '../../../core/frase-vista.js';
import { cargarMotion, sinMovimiento } from '../../../core/motion.js';
import { leyendaParticulas } from '../../../core/particulas.js';
import { PDF, PRESETS, IDEA, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, ENLACES, TABLA, DUR, NOMBRE, fichaDe, tabDe, pagDe } from '../../../data/placa-viva-data.js';
import { nuevo, cambiar, leer, fmt, clamp, sacudidas } from './modelo.js';
import { NEO, bloqueoDe, sugNecesita } from './bloqueo-motor.js';
import { topes } from './topes.js';
import { escena } from './dibujo.js';
import { pintarHend, pasoHtml, prepararMotion, PASOS } from './hendidura.js';
import { crearGuia, GUIAS } from './guia.js';
import { crearMayeuticaModelo } from '../../../core/mayeutica-motor.js';
import { PREGUNTAS, CASOS } from '../../../data/placa-viva-mayeutica.js';
const $ = (id) => document.getElementById('plv-' + id);
const R = $('raiz');
const todos = (q) => R.querySelectorAll(q);
let ultEst = '', s = nuevo('flor'), clave = 'flor', modo = 'explorar', oculto = false, foco = [], paso = 3, ultMov = Promise.resolve(), guiaApi, topeApi, firma = '';
// Cada cita: «PDF p. N» (abre el libro) y «p. N · Ver en la ficha» (el enlace cruzado de siempre, al párrafo exacto de la ficha de Neurología)
const cita = (c) => { const id = fichaDe(c); return `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${pagDe(c)}" target="_blank" rel="noopener">PDF p. ${pagDe(c)}</a> · <button type="button" class="ver-ficha" data-especialidad="libros" data-view="marinoNeuro" data-panel="panel-marino-neuro-tabs" data-tab="${tabDe(id)}" data-resaltar="#${id}">p. ${pagDe(c)} · Ver en la ficha</button></span>`; };
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
const TODOS = ['succiK', 'parada', 'neo70', 'neo5', 'succik', 'rocaire', 'sugmal', 'tof0', 'par48', 'intub', 'piri', 'ses', 'igiv', 'sintto', 'mccrap', 'farm', 'hielo2', 'hielo6'];
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of TODOS) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, tono: t.tono, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off, bajo: t.n === 'aviso' ? '#plv-avisos' : null });
}
function pintar() {
  const L = leer(s); aplicarTopes(L);
  $('est').innerHTML = escena(s, L, oculto, foco); ultMov = pintarHend($('lupa'), s, paso, oculto); $('paso-txt').innerHTML = pasoHtml(paso, cita); todos('[data-paso]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.paso === paso)));
  const q = oculto ? '?' : null, mg = s.est === 'miastenia';
  $('m-cond').textContent = q || L.cond; $('m-tof').textContent = s.est === 'bloqueo' && s.rel ? L.tof + '/4' : '4/4'; $('m-f').textContent = L.f + ' %';
  $('m-ref').textContent = q || L.ref; $('m-lcr').textContent = q || L.lcr; const apnea = s.est === 'bloqueo' && s.rel && L.tof === 0; $('m-cv').innerHTML = apnea ? 'apnea' : `${Math.round(L.cv)} mL<small>${fmt(L.cvkg, 1)} mL/kg${s.cvFijo ? ' · fija' : ''}</small>`; $('m-pim').textContent = apnea ? 'apnea' : '−' + L.f;
  $('m-fc').textContent = L.fc; $('m-pa').textContent = L.pa; $('m-k').textContent = fmt(s.k, 1); $('m-hielo').textContent = L.ptosis == null ? '—' : '+' + L.ptosis + ' mm'; $('m-sec').textContent = L.sec ? 'aumentan' : '—';
  const tb = $('tabla-466'); tb.dataset.col = s.est === 'gbs' ? '1' : mg ? '2' : '';
  topeApi.refrescar(); $('b-dia-').disabled = s.dia <= 0;
  todos('[data-est]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.est === s.est)));
  todos('[data-estim]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.estim === s.estim)));
  $('b-via').setAttribute('aria-pressed', String(s.via)); $('b-via').textContent = s.via ? 'Intubado (vía asegurada)' : 'Intubar (vía sin asegurar)';
  $('b-hielo').textContent = s.hielo ? `Hielo: ${s.hielo} min` : 'Hielo 2 min'; $('b-neo').textContent = `Neostigmina +35 µg/kg (${s.neo} de ${NEO.max})`;
  $('b-pla').textContent = `Plasmaféresis +1 sesión (${s.ses})`; $('b-perf-mas').textContent = `Perfusión + (${s.perf})`;
  todos('[data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === clave)));
  $('detalle-lupa').classList.toggle('foco-caja', foco.includes('lupa')); $('tabla-466').classList.toggle('foco-caja', foco.includes('tabla'));
  if (foco.includes('lupa')) $('detalle-lupa').open = true;
  $('pulmon-vivo').hidden = !(!$('escena').hidden && s.via && L.crit);
  $('ritmo-vivo').hidden = !(!$('escena').hidden && s.rel === 'succi' && s.k >= 5.5);
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
  if (a === 'hielo') { s.hielo += 2; const L = leer(s); t = s.est === 'miastenia' ? (s.hielo >= 6 ? 'Tope del modelo: 6 minutos de hielo; el mando se apaga. Marino describe solo el test de 2 minutos.' : s.hielo > 2 ? 'El test dura 2 minutos; Marino no dice qué pasa con más tiempo.' : 'Hielo 2 minutos sobre el ojo cerrado: la ptosis mejora +3 mm (positivo desde +2 mm; sensibilidad y especificidad 80 %).') : 'El hielo es la prueba de la miastenia: aquí no hay debilidad ocular que mejore.'; org = 'ficha · p. 24-25; +3 mm ilustrativo'; }
  if (a === 'igiv') { if (s.est === 'pnc' || s.est === 'mcc') t = 'No hay tratamiento específico para este cuadro.'; else { s.igiv = s.dia; if (s.t0 == null) s.t0 = s.dia; t = 'IgIV 2 g/kg en 2-5 días. La fuerza no sube hasta el día 4-5: pasa el reloj para verlo.'; } org = 'ficha · p. 26-27; subida ilustrativa'; }
  if (a === 'pla') { s.ses++; if (s.t0 == null) s.t0 = s.dia; t = s.ses < 2 ? 'Primera sesión de plasmaféresis (5 en 7-10 días, 1-1,5 volúmenes).' : `Sesión ${s.ses}: la fuerza empieza a subir desde la segunda sesión.`; org = 'ficha · p. 26; subida ilustrativa'; }
  if (a === 'piri') { s.piri = true; s.piriOk = !L0.intub; t = s.est === 'miastenia' ? (L0.intub ? 'Piridostigmina con insuficiencia respiratoria: no mejora lo que importa y llena de secreciones la vía aérea.' : 'Piridostigmina: mejora algo la fuerza, pero aumenta las secreciones.') : 'La piridostigmina trata la miastenia; aquí no actúa.'; org = 'ficha · p. 26; subida ilustrativa'; }
  if (a === 'via') { s.via = !s.via; s.cvFijo = s.via && L0.crit ? { cv: L0.cv, cvkg: L0.cvkg } : null; if (s.via) s.dSin = 0; t = s.via ? (s.cvFijo ? `Intubado con CV ${Math.round(L0.cv)} mL (${fmt(L0.cvkg, 1)} mL/kg): la CV del monitor queda fija, ya no se mide. Debajo del dibujo tienes el enlace al pulmón vivo.` : 'Vía aérea asegurada: el rocuronio ya no deja sin respirar.') : 'Sin vía aérea.'; org = 'ficha · p. 25, 30-31'; }
  if (a === 'succi' || a === 'roc' || a === 'cis') { if (!blq && s.est !== 'mcc') { cambiar(s, 'bloqueo'); } s.rel = a; s.min = 0; s.sug = 0; s.sugOk = false; s.sugT = null; s.neo = 0; s.neoOk = false; s.neoT = null; s.perf = 0; s.perfT = null; if (a === 'succi') s.k = +(s.k + 0.5).toFixed(1); const L = leer(s);
    t = a === 'succi' ? `Succinilcolina 1 mg/kg: despolariza la placa y la deja abierta; el K⁺ sube 0,5 mEq/L (ahora ${fmt(s.k, 1)}). Empieza en 1-1,5 min (aún no: TOF 4/4) y dura 7-12 min.` : a === 'roc' ? 'Rocuronio 1 mg/kg: un tapón sobre la copa compite con la ACh. Empieza en 1,5-3 min (ahora el TOF sigue 4/4; pasa el reloj) y dura 50-70 min (el texto dice 30-70).' : 'Cisatracurio 0,15-0,2 mg/kg: tapón más lento, empieza en 5-7 min (ahora el TOF sigue 4/4) y dura 35-50 min; ni riñón ni hígado.'; org = 'ficha · p. 29-30 (Tabla 46.7); duración ilustrativa'; }
  if (a === 'min') { s.min += 10; t = blq && s.rel ? `Pasan ${s.min} min: TOF ${leer(s).tof}/4.` : 'El reloj de minutos solo cuenta con un relajante puesto.'; org = 'ficha · p. 29-30; punto medio ilustrativo'; }
  if (a === 'neo') { s.neo = Math.min(NEO.max, s.neo + NEO.paso); s.neoOk = s.neoOk || (blq && !!s.rel && L0.tof >= 2); s.neoT ??= s.min; const L = leer(s); t = `Neostigmina ${s.neo} µg/kg: ${s.neoOk ? 'la ACh se acumula y revierte un bloqueo moderado en 8-45 min; pasa el reloj.' : 'con el bloqueo profundo (TOF 0-1) no revierte nada: espera a que haya 2 respuestas.'} Sí hay bradicardia (FC ${L.fc}) y secreciones. Tope: 70 µg/kg.`; org = 'ficha · p. 31 (moderado, 8-45 min, tope 70 µg/kg); bloqueo profundo: drugs.com, monografía de neostigmina; bradicardia y secreciones: fisiología general; FC ilustrativa'; }
  if (a === 'sug') { const need = sugNecesita(s, L0.tof); s.sug = o.v; s.sugOk = o.v >= need; s.sugT = s.min; if (s.rel === 'roc') s.min += 3; t = s.rel === 'roc' ? (s.sugOk ? `Sugammadex ${o.v} mg/kg: envuelve al rocuronio y lo saca de la hendidura en 2-3 min (pasan 3).` : `Sugammadex ${o.v} mg/kg es poco: hacían falta ${need} mg/kg (16 si es inmediato, 4 profundo, 2 moderado); el bloqueo solo baja a medias.`) : `Sugammadex ${o.v} mg/kg: solo vale con aminoesteroides (rocuronio); aquí no actúa.`; org = 'ficha · p. 31 (2 moderado · 4 profundo · 16 inmediato)'; }
  if (a === 'perfMas' || a === 'perfMenos') { const p0 = s.perf; s.perf = clamp(s.perf + (a === 'perfMas' ? 1 : -1), 0, 3); if (!p0 && s.perf) s.perfT = s.min; t = s.rel && s.rel !== 'succi' ? `Perfusión nivel ${s.perf} (rocuronio 5-12 µg/kg/min o cisatracurio 1-3 µg/kg/min): TOF ${leer(s).tof}/4 cuando pase el reloj. El objetivo es 1-2 respuestas.` : 'La perfusión es de rocuronio (5-12 µg/kg/min) o cisatracurio (1-3 µg/kg/min); pon uno antes.'; org = 'ficha · p. 29-30; niveles ilustrativos'; }
  if (a === 'farm') { s.farm = o.v; if (o.v === 'cort') s.cort = true; const n = { gent: 'La gentamicina', mg: 'El magnesio', cort: 'El corticoide a dosis alta' }[o.v]; t = s.est === 'miastenia' ? `${n} dificulta la transmisión (Tabla 46.5): la fuerza cae.` : `${n} está en la Tabla 46.5 de la miastenia; aquí no hay miastenia.`; org = 'ficha · p. 24; el mecanismo no lo da Marino; caída ilustrativa'; }
  if (a === 'dia') { const d0 = s.dia; s.dia = o.v != null ? o.v : s.dia + 1; if (L0.intub) { s.dSin += s.dia - d0; if (s.dSin >= 2 && s.dStop == null) s.dStop = s.dia; } const L = leer(s); t = `Día ${s.dia}: fuerza ${L.f} %, CV ${fmt(L.cvkg, 1)} mL/kg${L.aut ? `. Inestabilidad autonómica: FC ${L.fc} y PA ${L.pa} (el día anterior oscilaba al otro extremo)` : ''}.`; org = 'dirección: ficha · p. 26-28; magnitud ilustrativa'; }
  if (a === 'diaMenos') { s.dia = Math.max(0, s.dia - 1); t = `Día ${s.dia}.`; org = 'ficha'; }
  frase(t, org); pintar();
}
// Lo que las pruebas pueden tocar del modelo (el caso obedece a cada opción).
const API = { hacer: (a, o) => hacer(a, o), poner: (o) => { Object.assign(s, o); pintar(); }, via: () => { if (!s.via) hacer('via'); } };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
function irPaso(p) { paso = p; pintar(); }
async function ciclo() { await prepararMotion(); for (let p = 1; p <= PASOS.length; p++) { irPaso(p); await ultMov; await espera(sinMovimiento() ? 0 : 450); } }
function ponerPreset(c, k = 0, previos = false) { clave = c; s = nuevo(c); oculto = false; foco = []; frase(PRESETS[c].txt, 'paciente inventado; cifras de la ficha'); pintar(); if (guiaApi) guiaApi.abrir(c, k, previos); }
const GUIA_DE = { gbs: 'flor', miastenia: 'sera', bloqueo: 'mel', pnc: 'pnc', mcc: 'mcc' };
/* ============================================================
   Mayéutica: el motor común (core/mayeutica-motor.js) con los enganches de la placa viva
   ============================================================ */
const subir = () => { const r = R.getBoundingClientRect(); if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' }); };
// Lo que se esconde cuando se predice (el monitor, el dibujo y los sellos salen al contestar) o no hay modelo en la pregunta
function verModelo(si) { for (const i of ['monitor', 'sellos', 'escena', 'avisos']) $(i).hidden = !si; if (!si) { $('ritmo-vivo').hidden = true; $('pulmon-vivo').hidden = true; } }
function tapar(si) { $('aviso-tapa').hidden = !si; if (si) verModelo(false); }
// Cada acción es [nombre, opciones]: las mismas del dock; «poner» fija el reloj y «via» intuba
function aplicarAcc(lista) { for (const [a, o] of lista || []) { if (a === 'poner') API.poner(o); else if (a === 'via') API.via(); else hacer(a, o || {}); } }
// El modelo vuelve al paciente de la pregunta, sin abrir su guía
function reponer(c) { clave = c; s = nuevo(c); firma = ''; oculto = false; foco = []; pintar(); }
function prepararPregunta(q) {
  verModelo(!q.sinModelo);
  if (q.estado) { reponer(q.estado); aplicarAcc(q.ajustes); }
  tapar(!!q.predice && !q.sinModelo);
}
const citasDe = (q) => [].concat(q.fuente || []);
let cuentaTocar = '';   // lo que el monitor dice tras «Compruébalo»
function comprobarEnModelo(m, cont, q) {
  const T = q.tocar, Ls = [leer(s)], ss = [{ ...s }];
  m.disabled = true;
  for (const grupo of T.haz) { aplicarAcc(grupo); Ls.push(leer(s)); ss.push({ ...s }); }
  cuentaTocar = `${T.cuenta(Ls[0], Ls[1], sacudidas(s, Ls[Ls.length - 1]), Ls[2], ss[0], ss[1])} <span class="org">cifras: ilustrativo</span>`;
  $('monitor').scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth', block: 'start' });
  cont.querySelector('[data-accion="comprobar"]').click();
  requestAnimationFrame(() => cont.querySelector('[data-hueco="fin"]')?.scrollIntoView({ block: 'start', behavior: 'auto' }));
}
export const mayeutica = crearMayeuticaModelo({
  p: 'plv', cont: () => $('preg'), clave: 'placa-viva-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
  subir, volverPor: 'La placa viva',
  reiniciar: () => { verModelo(true); tapar(false); reponer('flor'); },
  pregunta: {
    alEmpezar: (q) => prepararPregunta(q),
    verEnTexto: (q) => `<p class="plv-fuente-p">${citasDe(q).map(cita).join('<br>')}</p>`,
    alCerrar: (q) => { tapar(false); verModelo(!q.sinModelo); if (!q.sinModelo) pintar(); },
    tocar: {
      mandoHTML: (t) => `<p class="plv-para"><b>Compruébalo en el modelo:</b></p><button type="button" class="plv-b plv-prim" data-mando="sube">${t.txt}</button>`,
      alMostrar: (q, cont) => { tapar(false); verModelo(true); pintar(); const f = cont.querySelector('[data-accion="comprobar"]').closest('.plv-fila'); if (f) f.hidden = true; },
      comprobar: () => true,
      confirma: () => cuentaTocar,
      accion: comprobarEnModelo,
    },
  },
  textos: {
    ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): predices, y luego lo compruebas en el monitor.</span>
      <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen de la ficha.</span>
      <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span>
      <span><b>4.</b> Dos casos que evolucionan: Florentina y Melquíades.</span>`,
    empezar: 'Empezar la guía socrática', seguir: 'Seguir',
    pie: 'Las cifras del monitor salen cuando contestas: primero predices, luego compruebas. Los pacientes se inventan; la medicina sale de la ficha, y cada pregunta dice dónde.',
    conModelo: 'la placa', casos: 'El modelo se pone en el estado de cada paso. Lo nuevo de la ficha del paciente sale en rojo.',
    abrirPaciente: 'Volver a la placa viva',
  },
  preguntaDePaso: (paso) => ({ estado: paso.estado, ajustes: paso.ajustes }),
  alTerminarCaso: () => { verModelo(true); tapar(false); },
  abrirPaciente: () => setModo('explorar'),
});
// Explorar o Preguntas: en Preguntas se esconden los mandos, la lupa y el resto del modo Explorar
export function setModo(m) {
  if (guiaApi) guiaApi.cerrar();
  modo = m; foco = []; oculto = false;
  for (const k of ['explorar', 'preguntas']) $('modo-' + k).setAttribute('aria-pressed', String(m === k));
  const ex = m === 'explorar';
  $('vista-preguntas').hidden = ex; $('dock-explorar').hidden = !ex; $('dock-estudio').hidden = ex;
  for (const e of [$('detalle-lupa'), $('idea'), $('tabla-466'), $('leyenda'), ...R.querySelectorAll(':scope > .bloque, :scope > .figuras')]) e.hidden = !ex;
  verModelo(true); tapar(false);
  if (ex) { reponer(clave in PRESETS ? clave : 'flor'); } else mayeutica.entrar();
  ajustar();
}

function montar() {
  $('modo-explorar').onclick = () => setModo('explorar'); $('modo-preguntas').onclick = () => setModo('preguntas'); mayeutica.cargar();
  const cortos = ['Impulso', 'Vesículas', 'Copas', 'Enzima', 'Relajado'];
  $('pasos').innerHTML = PASOS.map((_, i) => `<button type="button" data-paso="${i + 1}" aria-pressed="false">${i + 1} ${cortos[i]}</button>`).join('') + '<button type="button" id="plv-b-ciclo">Ver el ciclo</button>';
  $('pasos').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b) return; if (b.id === 'plv-b-ciclo') ciclo(); else irPaso(+b.dataset.paso); });
  prepararMotion();
  const bt = (id, txt, extra = '') => `<button type="button" id="plv-${id}" class="b" ${extra}>${txt}</button>`, d = (a, txt, v, k) => `<button type="button" data-a="${a}" data-v="${v}" ${k ? `data-${k.split('=')[0]}="${v}"` : ''} aria-pressed="false">${txt}</button>`;
  const ests = Object.entries({ sano: 'Sano', gbs: 'Guillain-Barré', miastenia: 'Miastenia', pnc: 'Polineuro&shy;patía', mcc: 'Miopatía', bloqueo: 'Relajante' }).map(([k, t]) => `<button type="button" data-est="${k}" aria-pressed="false">${t}</button>`).join('');
  $('dock-panel').innerHTML = `
   <div class="mando"><b class="dock-nota">Estado de la cadena</b><div class="fila">${ests}</div></div>
   <div class="mando"><b class="dock-nota">Estímulo (cada pulsación lanza un impulso)</b><div class="fila"><button type="button" data-estim="unico" aria-pressed="false">Único</button><button type="button" data-estim="rep" aria-pressed="false">Repetido ×10</button><button type="button" data-estim="tof" aria-pressed="false">TOF</button>${bt('b-hielo', 'Hielo 2 min')}</div></div>
   <div class="mando"><b class="dock-nota">Tratamiento (días)</b><div class="fila">${bt('b-igiv', 'IgIV 2 g/kg')}${bt('b-pla', 'Plasmaféresis +1 sesión (0)')}${bt('b-piri', 'Piridostigmina')}</div></div>
   <div class="mando"><b class="dock-nota">Relajante</b><div class="fila">${bt('b-via', 'Vía aérea: sin asegurar')}${bt('b-succi', 'Succinilcolina 1 mg/kg')}${bt('b-roc', 'Rocuronio 1 mg/kg')}${bt('b-cis', 'Cisatracurio 0,15 mg/kg')}${bt('b-perf-menos', 'Perfusión −')}${bt('b-perf-mas', 'Perfusión + (0)')}</div></div>
   <div class="mando"><b class="dock-nota">Reversión</b><div class="fila">${bt('b-neo', 'Neostigmina +35 µg/kg (0)')}<button type="button" class="b" data-sug="2">Sugammadex 2 mg/kg</button><button type="button" class="b" data-sug="4">Sugammadex 4 mg/kg</button><button type="button" class="b" data-sug="16">Sugammadex 16 mg/kg</button></div></div>
   <div class="mando"><b class="dock-nota">Fármaco que empeora la miastenia (Tabla 46.5)</b><div class="fila"><button type="button" class="b" data-farm="gent">Gentamicina</button><button type="button" class="b" data-farm="mg">Magnesio</button><button type="button" class="b" data-farm="cort">Corticoide alto</button></div></div>
   <div class="mando"><b class="dock-nota">Reloj</b><div class="fila">${bt('b-min', '+10 min')}${bt('b-dia', 'Día +1')}${bt('b-dia-', 'Día −1')}</div></div>`;
  $('dock-medir').innerHTML = `<div class="mando"><b class="dock-nota">Paciente</b><div class="presets" id="plv-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('')}</div></div>`;
  const ACC = { 'b-hielo': ['hielo'], 'b-igiv': ['igiv'], 'b-pla': ['pla'], 'b-piri': ['piri'], 'b-via': ['via'], 'b-succi': ['succi'], 'b-roc': ['roc'], 'b-cis': ['cis'], 'b-perf-menos': ['perfMenos'], 'b-perf-mas': ['perfMas'], 'b-neo': ['neo'], 'b-min': ['min'], 'b-dia': ['dia'], 'b-dia-': ['diaMenos'] };
  $('dock-panel').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.est) { hacer('est', { v: b.dataset.est }); if (modo === 'explorar') { if (GUIA_DE[b.dataset.est]) guiaApi.abrir(GUIA_DE[b.dataset.est]); else guiaApi.cerrar(); } } else if (b.dataset.estim) hacer('estim', { v: b.dataset.estim }); else if (b.dataset.sug) hacer('sug', { v: +b.dataset.sug }); else if (b.dataset.farm) hacer('farm', { v: b.dataset.farm }); else if (ACC[b.id.replace(/^plv-/, '')]) hacer(ACC[b.id.replace(/^plv-/, '')][0]); });
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { setModo('explorar'); ponerPreset(b.dataset.pre); } });
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; });
  guiaApi = crearGuia({ caja: $('guia'), hacer, cita, setFoco: (z) => { foco = z; pintar(); } });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`;
  $('tabla-466').innerHTML = `<table class="data-table"><caption>Tabla 46.6 · Guillain-Barré frente a miastenia ${cita('27:mn-tabla-46-6')}</caption><thead><tr><th>Rasgo</th><th>Guillain-Barré</th><th>Miastenia</th></tr></thead><tbody>${TABLA.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · ${cita(p)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = ENLACES.map(([t, v, a, e]) => `<li><button type="button" class="ver-ficha" data-especialidad="libros" data-view="${v}" data-${a.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}="${e}">${t} →</button></li>`).join('') + CRECERA.map((t) => `<li>${t}</li>`).join(''); $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  $('leyenda').innerHTML = leyendaParticulas(['k', 'igg'], { titulo: 'Qué es cada partícula' }) + '<p class="min-nota">Manguitos: mielina. Copas: receptores. Doble círculo: succinilcolina. Hexágono: rocuronio. Anillo: sugammadex. Triángulo: neostigmina. Y roja: anticuerpo. Aspas: acetilcolinesterasa. Línea de la campana: 15 mL/kg. Cifras de fuerza, CV y PIM: ilustrativas.</p>';
  topeApi = crearTope({ monitor: $('sellos'), dock, cita });
}
// Estado: «flor» (un paciente), «flor:2» (su guía en el paso 2), «pnc» o «mcc» (esa guía). Vacío = Florentina.
export function abrirEstado(clave) {
  const [p, x] = String(clave || '').split(':'); setModo('explorar');
  const k = /^\d+$/.test(x || '') ? +x - 1 : 0;
  if (PRESETS[p]) ponerPreset(p, k, true); else if (p === 'pnc' || p === 'mcc') { ponerPreset('flor'); hacer('est', { v: p }); guiaApi.abrir(p, k, true); } else ponerPreset('flor', k, true);
  ajustar(); if (k > 0) verGuia();
}
function verGuia() { requestAnimationFrame(() => { const c = $('guia'); if (c && !c.hidden) c.scrollIntoView({ block: 'center' }); }); }
function ajustar() { R.style.setProperty('--plv-dock-h', $('dock').offsetHeight + 'px'); }
montar(); ponerPreset('flor'); ajustar();
new ResizeObserver(ajustar).observe($('dock'));
seguirFrase(R, () => $('escena'), { dock: () => $('dock') });
window.__plv = { abrirEstado, get s() { return s; }, get paso() { return paso; }, irPaso, ciclo, get mov() { return ultMov; }, leer: () => leer(s), hacer, ponerPreset, setModo, pintar, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); } };
