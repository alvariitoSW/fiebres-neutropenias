// Hepatocito vivo · «La fábrica por dentro» (Marino cap. 39). La página: estado, monitor, dock de mandos, dibujo, guía, pruebas y carril animado.
// Se carga al primer abrir (index.js). Usa las piezas comunes: core/tope.js (sellos y avisos), core/frase-vista.js (frase a la vista),
// core/motion.js (Motion, con «reducir movimiento» = estado final) y core/particulas.js (NH₃, urea y glutamina). Los botones del dock
// se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../core/tope.js';
import { seguirFrase } from '../../../core/frase-vista.js';
import { IMG_VIA } from '../../../data/hepatocito-vivo-data.js';
import { cargarMotion, sinMovimiento } from '../../../core/motion.js';
import { PDF, PDF_TX, FIG_VIA, VIAS, viaDe, TX, PRESETS, FUENTES, NOTAS, PROFUNDIZAR, VIAS_APAGADAS, IDEA, fichaDe, CRECERA, UBICACION, FLUIDOS, TRR_FICHA } from '../../../data/hepatocito-vivo-data.js';
import { nuevo, leer, topes, fmt, vitales, glutDe, funcDe, p450 } from './modelo.js';
import { escena, leyenda, opNodo } from './dibujo.js';
import { crearGuia, focoSvg } from './guia.js';
import { cara, WH_TXT } from './cara.js';
import { crearMayeutica } from './mayeutica.js';
import { APUESTA, ERROR, ERROR2, CASO, LLEVAS, opciones } from './pruebas.js';
const $ = (id) => document.getElementById('hpv-' + id);
const R = $('raiz');
let s = nuevo(), modo = 'explorar', preset = 'sano', oculto = false, foco = [], guiaApi, topeApi, firma = '', espera = null;
// Enlace cruzado de siempre al párrafo exacto de la ficha (lo resuelve el listener delegado de home/index.js)
const ir = (id, txt) => { const u = UBICACION[id]; return `<button type="button" class="ver-ficha" data-especialidad="libros" data-view="${u[0]}" data-panel="${u[1]}" data-tab="${u[2]}" data-resaltar="#${id}">${txt}</button>`; };
const cita = (c, id, pdf) => { if (typeof c === 'string' && c.startsWith('TX:')) { const [, p, f] = c.split(':'); return citaTx(+p, f); } return pdf === 'TX' ? citaTx(c, id) : citaB(c, id); };
const citaTx = (c, id) => `<span class="cita"><a class="cita-pdf" href="${PDF_TX}#page=${c}" target="_blank" rel="noopener">PDF p. ${c}</a> · ${ir(id, `p. ${c} · Ver en la ficha`)}</span>`;
const citaB = (c, id) => `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${c}" target="_blank" rel="noopener">PDF p. ${c}</a> · ${ir(id || fichaDe(c), `p. ${c} · Ver en la ficha`)}</span>`;
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
const N = () => (oculto ? '?' : fmt(leer(s).a));
function aplicarTopes() {
  const lista = topes(s), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of ['dosis', 'fase3', 'hd', 'nomo', 'nomo2', 'alcohol', 'nac', 'phdial', 'vision', 'fomep', 'hdal', 'edema', 'diarrea', 'hipovol', 'cvvh', 'rifa', 'nofis', 'tips', 'fl']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
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
  pintarTx();
  if (L.edema && !oculto) $('fig').open = true;
  topeApi.refrescar();
}
// Vías de los tóxicos: mandos que se enseñan según la vía, monitor del hígado y figura real de la vía (todo ya creado; solo se repinta)
const coma = (x) => String(x).replace('.', ',');
function pintarTx() {
  const v = s.via, par = v === 'paracetamol', alc = v === 'alcoholes';
  R.querySelectorAll('[data-via-sel]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.viaSel === v)));
  for (const id of ['m-prod', 'm-dep', 'm-rifa', 'm-tips', 'm-fl']) $(id).hidden = v !== 'urea';
  $('m-par').hidden = !par; $('m-alc').hidden = !alc; $('mon-tx').hidden = v === 'urea';
  const mostrar = (id, on) => { $(id).parentElement.hidden = !on; };
  mostrar('mon-par', par); mostrar('mon-alt', par); mostrar('mon-ph', alc); mostrar('mon-ga', alc); mostrar('mon-lact', alc);
  $('mon-reloj').hidden = !par; $('mon-carril').parentElement.hidden = v !== 'urea';
  $('mon-par').textContent = `${s.par} µg/mL`; $('mon-reloj').innerHTML = `Reloj <b>${s.h} h</b>`;
  $('mon-alt').textContent = s.lab?.alt ?? '—'; $('mon-inr').textContent = s.lab?.inr ?? '—';
  $('mon-ph').textContent = coma(s.ph); $('mon-ga').textContent = s.ga ?? '—'; $('mon-go').textContent = s.go ?? '—'; $('mon-lact').textContent = s.lact ?? '—';
  if (par) { $('o-dosis').textContent = s.dosis; $('r-dosis').value = s.dosis; $('o-h').textContent = s.h; $('r-h').value = s.h; $('o-par').textContent = s.par; $('r-par').value = s.par; $('b-nac').setAttribute('aria-pressed', String(!!s.nac)); $('b-nac').textContent = `NAC · ${s.nac ? 'en marcha' : 'sin NAC'}`; $('b-beb').setAttribute('aria-pressed', String(!!s.bebedor)); $('b-beb').textContent = `Alcohol crónico · ${s.bebedor ? 'sí' : 'no'}`; }
  if (alc) { $('o-ph').textContent = coma(s.ph); $('r-ph').value = s.ph; R.querySelectorAll('[data-alc]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.alc === s.alc))); for (const [id, k, t] of [['b-fomep', 'fomep', 'Fomepizol'], ['b-coad', 'coad', s.alc === 'met' ? 'Ácido folínico' : 'Tiamina + piridoxina'], ['b-hd', 'hd', 'Hemodiálisis']]) { $(id).setAttribute('aria-pressed', String(!!s[k])); $(id).textContent = `${t} · ${s[k] ? 'sí' : 'no'}`; } }
  const f = FIG_VIA[v], det = $('fig-via'); det.hidden = !f;
  if (f) { $('fig-via-t').textContent = `Figura del libro · ${f[0]}`; const im = $('img-via'); const src = IMG_VIA[v]; if (!im.src.endsWith(src)) im.src = src; $('fig-via-c').innerHTML = `${f[0]}, de Marino (cap. ${v === 'paracetamol' ? 52 : 53}). ${cita(f[1], f[2], 'TX')}`; }
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
  if (['via', 'dosis', 'h', 'par', 'nac', 'bebedor', 'alc', 'ph', 'fomep', 'coad', 'hd'].includes(a)) tx(a, v);
  pintar();
}
// Recalcula el glutatión y los hepatocitos tras tocar la dosis, el reloj o la NAC. Los hepatocitos nunca suben por encima de los del paciente (func0): el daño hecho no se deshace.
function recalc() { if (s.glut0 === undefined) s.glut0 = s.glut; s.glut = s.nac ? Math.min(100, s.glut0 + 50) : s.glut0; s.func = Math.min(s.func0 ?? 100, funcDe(s)); s.lab = null; }
function tx(a, v) {
  const O = 'ficha · p. 4-5; el reparto exacto es ilustrativo';
  if (a === 'via') { s.via = v; frase(v === 'paracetamol' ? 'Paracetamol: casi todo se conjuga y sale por la orina (≈90 %; el libro dice «la mayor parte»); un ≈10 % lo oxida el P450 a un metabolito tóxico que el glutatión neutraliza con su cisteína.' : v === 'alcoholes' ? 'Etilenglicol y metanol: la alcohol deshidrogenasa del hígado los convierte en ácidos tóxicos y sube el NADH, y con él el lactato.' : 'Vía de la urea: el hígado convierte el NH₃ en urea.', v === 'paracetamol' ? 'ficha · p. 4' : v === 'alcoholes' ? 'ficha · p. 26' : 'ficha · p. 6'); return; }
  if (a === 'dosis') { s.dosis = v; s.glut0 = glutDe(s); recalc(); frase(v > TX.saturaG ? `${v} g: la conjugación (hasta 4 g/día) se satura, el P450 fabrica ${p450(s)} g de metabolito y el glutatión baja a ${s.glut} %.` : `${v} g: la conjugación aguanta y el glutatión se mantiene en ${s.glut} %.`, O); }
  if (a === 'h') { s.h = v; recalc(); frase(v < 24 ? `Hora ${v}: fase 1, aún sin daño en el hígado.` : v <= 72 ? `Hora ${v}: fase 2; con el glutatión agotado, los hepatocitos mueren (quedan ${s.func} %; ilustrativo).` : `Hora ${v}: fase 3, el fallo se completa (hepatocitos ${s.func} %).`, 'ficha · p. 5 (fases 24/72/96 h); cuántos mueren por hora: ilustrativo'); }
  if (a === 'par') { s.par = v; frase(v > TX.hdPar ? `${v} µg/mL: más de 900; con encefalopatía, hemodiálisis.` : `Paracetamol ${v} µg/mL. A las 4 h, por encima de 150 se trata con NAC.`, 'ficha · p. 6 y 8'); }
  if (a === 'nac') { s.nac = s.nac ? 0 : 1; recalc(); frase(s.nac ? `NAC: repone la cisteína, el glutatión sube a ${s.glut} % y los hepatocitos dejan de caer.` : 'Sin NAC: el glutatión sigue agotado y, sin esa reposición, los hepatocitos mueren (efecto de la NAC y muerte celular: ilustrativo).', 'ficha · p. 7; cuánto sube el glutatión: ilustrativo'); }
  if (a === 'bebedor') { s.bebedor = s.bebedor ? 0 : 1; s.glut0 = glutDe(s); recalc(); frase(s.bebedor ? `Con alcohol crónico el P450 está inducido y, por la mala nutrición, el glutatión puede estar bajo (p. 5, «probablemente»): con ${s.dosis} g queda en ${s.glut} %.` : 'Sin alcohol crónico.', 'ficha · p. 5; cuánto baja el umbral: ilustrativo'); }
  if (a === 'alc') { s.alc = v; s.vision = v === 'met' ? 1 : 0; frase(v === 'met' ? 'Metanol: la alcohol deshidrogenasa lo pasa a ácido fórmico, que inhibe la citocromo oxidasa y daña la retina.' : 'Etilenglicol: el hígado lo pasa por ácidos fuertes hasta el oxálico, que forma cristales en el túbulo.', 'ficha · p. 26-28'); }
  if (a === 'ph') { s.ph = v; frase(v < TX.phDialisis ? `pH ${coma(v)}: por debajo de 7,1 hace falta diálisis.` : `pH ${coma(v)}: sin criterio de diálisis por el pH.`, 'ficha · p. 28'); }
  if (a === 'fomep' || a === 'coad' || a === 'hd') { s[a] = s[a] ? 0 : 1; frase(a === 'fomep' ? (s.fomep ? 'Fomepizol: bloquea la alcohol deshidrogenasa (p. 27); mejor en las primeras 4 h (p. 28).' : 'Sin fomepizol.') : a === 'coad' ? (s.coad ? 'Coadyuvantes: desvían el metabolismo hacia productos no tóxicos.' : 'Sin coadyuvantes.') : (s.hd ? 'Hemodiálisis: quita el tóxico y los ácidos.' : 'Sin hemodiálisis.'), 'ficha · p. 27-29'); }
}
function ponerPreset(clave, sinGuia) {
  preset = clave; s = nuevo(PRESETS[clave].s); s.func0 = s.func; if (s.glut0 === undefined) s.glut0 = s.glut; oculto = false; foco = []; frase(PRESETS[clave].txt, 'paciente inventado; cifras ilustrativas, umbrales de la ficha · p. 6-8'); pintar(); if (sinGuia) guiaApi.cerrar(); else guiaApi.abrir(clave);
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
// Modo Preguntas (Mayéutica): esconde mandos y frase, enseña el recorrido y el dock de progreso
function vistaPreguntas(on) {
  R.classList.toggle('hpv-mayeutica', on); $('vista-preguntas').hidden = !on; $('dock-estudio').hidden = !on;
  for (const e of [R.querySelector('.dock-tabs'), $('dock-panel'), $('frase'), $('b-replay').parentElement, $('guia'), $('leyenda')]) e.hidden = on;
  $('dock-medir').hidden = true; verModelo(true);
  if (!on) { R.querySelector('.dock-tabs [data-pest="dar"]').click(); $('guia').hidden = true; }
  ajustarDock();
}
function verModelo(b) { for (const id of ['monitor', 'escena', 'sello-zona']) $(id).hidden = !b; }
function modoPrueba(m) {
  if (modo === 'preguntas') vistaPreguntas(false);
  if (m === 'preguntas') { modo = m; const c = $('prueba'); c.textContent = ''; c.hidden = true; oculto = false; foco = []; espera = null; guiaApi.cerrar(); vistaPreguntas(true); mayeutica.entrar(); pintar(); return; }
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
  const sigue = (op) => { pintar(); if (op) frase(`${op.ok ? '✓' : '✗'} Paso ${i + 1}: ${op.ok ? 'bien' : 'no'}. ${op.por || ''}`, 'paciente inventado; ficha · p. 3-9'); c.scrollIntoView({ block: 'end', behavior: 'auto' }); if (i + 1 < CASO.pasos.length) { const b = document.createElement('button'); b.type = 'button'; b.className = 'b prim'; b.textContent = 'Siguiente paso'; b.addEventListener('click', () => { b.remove(); c.classList.add('plegado'); c.textContent = `Paso ${i + 1} ✓ ${st.corto}`; caso(i + 1, caja); }); c.append(b); } else { $('fig').open = true; const f = document.createElement('button'); f.type = 'button'; f.className = 'b ver-ficha'; f.id = 'hpv-b-filtro'; f.textContent = 'Indicaciones de TRR (en general)'; const nt = document.createElement('p'); nt.className = 'por'; nt.textContent = 'La ficha de TRR no trata la CVVH del amonio: aquí, la p. 8 de Marino.'; c.append(nt); Object.assign(f.dataset, { especialidad: TRR_FICHA[0], view: TRR_FICHA[1], panel: TRR_FICHA[2], tab: TRR_FICHA[3] }); c.append(f); fin(caja, 'caso'); } };
  if (st.mando) { espera = () => { espera = null; const r = document.createElement('p'); r.className = 'por ok'; r.textContent = st.ok; c.append(r); sigue(); }; frase(st.enun, 'paciente inventado; ficha · p. 8'); pintar(); return; }
  opciones(o, st.ops, (op) => { if (!op.ok && op.alFallar) hacer('fl', op.alFallar.fl); if (op.ok && st.alAcertar) { Object.assign(s, st.alAcertar); frase(`PA y FC con albúmina 5 %: ${vitales(s).pa}, FC ${vitales(s).fc} (ilustrativo).`, 'ficha · p. 5 (albúmina); cambios ilustrativos'); } sigue(op); }, st.orden); frase(`Paso ${i + 1}: ${fmt(leer(s).a)} µmol/L de amonio arterial en el modelo (ilustrativo).`, 'paciente inventado; cifras ilustrativas'); pintar();
}
// ---- Montaje (una vez) ----
function montar() {
  const seg = (id, attr, vals) => `<div class="fila" id="hpv-${id}">${vals.map(([v, t]) => `<button type="button" data-${attr}="${v}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  $('dock-panel').innerHTML = `
   <div class="mando" id="hpv-m-via"><b class="dock-nota">Vía del hepatocito</b><div class="fila">${VIAS.filter((v) => v.on).map((v) => `<button type="button" data-via-sel="${v.id}" aria-pressed="false">${v.nombre}</button>`).join('')}</div></div>
   <div class="mando" id="hpv-m-par" hidden><label>Paracetamol ingerido: <output id="hpv-o-dosis"></output> g (tope 30)<input type="range" id="hpv-r-dosis" min="0" max="30" step="1" value="4"></label>
     <label>Reloj desde la ingesta: <output id="hpv-o-h"></output> h<input type="range" id="hpv-r-h" min="0" max="96" step="4" value="0"></label>
     <label>Paracetamol en sangre: <output id="hpv-o-par"></output> µg/mL<input type="range" id="hpv-r-par" min="0" max="1000" step="10" value="0"></label>
     <div class="fila"><button type="button" id="hpv-b-nac" class="b" aria-pressed="false">NAC</button><button type="button" id="hpv-b-beb" class="b" aria-pressed="false">Alcohol crónico</button></div></div>
   <div class="mando" id="hpv-m-alc" hidden><div class="fila"><button type="button" data-alc="eg" aria-pressed="false">Etilenglicol</button><button type="button" data-alc="met" aria-pressed="false">Metanol</button></div>
     <label>pH: <output id="hpv-o-ph"></output><input type="range" id="hpv-r-ph" min="6.8" max="7.6" step="0.05" value="7.4"></label>
     <div class="fila"><button type="button" id="hpv-b-fomep" class="b" aria-pressed="false">Fomepizol</button><button type="button" id="hpv-b-coad" class="b" aria-pressed="false">Coadyuvantes</button><button type="button" id="hpv-b-hd" class="b" aria-pressed="false">Hemodiálisis</button></div></div>
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
  for (const [id, a] of [['r-dosis', 'dosis'], ['r-h', 'h'], ['r-par', 'par'], ['r-ph', 'ph']]) $(id).addEventListener('input', (ev) => hacer(a, +ev.target.value));
  $('r-func').addEventListener('input', (ev) => { s.func0 = +ev.target.value; hacer('func', +ev.target.value); }); $('r-rifa').addEventListener('input', (ev) => hacer('rifa', +ev.target.value));
  $('dock-panel').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.prod) hacer('prod', +b.dataset.prod); else if (b.dataset.dep) hacer('dep', +b.dataset.dep); else if (b.id === 'hpv-b-cvvh') hacer('cvvh'); else if (b.id === 'hpv-b-tips') hacer('tips'); else if (b.dataset.fl) hacer('fl', b.dataset.fl); else if (b.dataset.viaSel) hacer('via', b.dataset.viaSel); else if (b.dataset.alc) hacer('alc', b.dataset.alc); else if (b.id === 'hpv-b-nac') hacer('nac'); else if (b.id === 'hpv-b-beb') hacer('bebedor'); else if (b.id === 'hpv-b-fomep') hacer('fomep'); else if (b.id === 'hpv-b-coad') hacer('coad'); else if (b.id === 'hpv-b-hd') hacer('hd'); });
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b) modoPrueba(b.dataset.modo); });
  $('b-replay').addEventListener('click', replay);
  $('svg').addEventListener('click', (ev) => { const g = ev.target.closest('.via-off'); if (g) { const [n, d] = VIAS_APAGADAS[+g.dataset.via]; frase(`${n}: ${d}. Aquí no hace nada. ${ir(VIAS_APAGADAS[+g.dataset.via][2], 'Ver en la ficha')}`, 'otras fichas del libro'); } });
  const dock = $('dock'); dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; ajustarDock(); });
  $('leyenda').innerHTML = leyenda();
  guiaApi = crearGuia({ dock: () => $('dock'), caja: $('guia'), hacer: (a) => hacer(a, 1), setFoco: (z) => { foco = z; pintar(); }, cita });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`; $('cita-fig').innerHTML = cita(6);
  $('fuentes').innerHTML = FUENTES.map(([t, p, k]) => `<li>${t} · ${k === 'TX' ? cita(p, p < 20 ? (p === 4 ? 'mt-para-mecanismo' : p === 6 ? 'mt-para-nomograma' : p === 7 ? 'mt-tabla-52-1' : 'mt-nac-hd-txt') : (p === 28 ? 'mt-tabla-53-2' : 'mt-eg-mecanismo'), 'TX') : cita(p)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuente no lo dice' ? 'La fuente no lo dice' : t === 'las fuentes discrepan' ? 'Las fuentes discrepan' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map(([t, id, pg]) => `<li>${t} ${cita(pg, id)}</li>`).join('');
  $('profundizar').innerHTML = PROFUNDIZAR.map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('');
  topeApi = crearTope({ monitor: $('sello-zona'), dock, cita });
}
function ajustarDock() { R.style.setProperty('--hpv-dock-h', $('dock').offsetHeight + 'px'); }
// Estado: «casimira» (un paciente), «sano:tips» (ese paciente con el TIPS puesto) o «casimira:rl» / «casimira:alb» (con ese fluido). Vacío = el hígado sano.
export function abrirEstado(clave) {
  const [p0, x] = String(clave || '').split(':'); const es = VIAS.flatMap((v) => Object.entries(v.estados || {}).filter(([k]) => k === p0).map(([, e]) => e))[0];
  const p = PRESETS[p0] ? p0 : es ? es[0] : p0; if (modo === 'preguntas') vistaPreguntas(false); modo = 'explorar'; $('prueba').hidden = true; $('prueba').textContent = ''; delete $('prueba').dataset.fin;
  ponerPreset(PRESETS[p] ? p : 'sano');
  if (!PRESETS[p0] && es) { Object.assign(s, es[1]); if (es[1].nac !== undefined || es[1].dosis !== undefined) recalc(); pintar(); }
  if (x === 'tips') { const a0 = fmt(leer(s).a); hacer('tips'); frase(`TIPS puesto: el amonio arterial pasa de ${a0} a ${N()} µmol/L, porque el NH₃ de la porta salta el hígado. Cambia un problema por otro.`, 'ficha · p. 10; cuánto sube: ilustrativo'); }
  else if (x === 'rl' || x === 'alb') hacer('fl', x);
  ajustarDock();
}
montar(); ponerPreset('sano', true); ajustarDock();
const mayeutica = crearMayeutica({
  poner: (clave, aj, tapado) => { ponerPreset(clave, true); Object.assign(s, aj || {}); oculto = !!tapado; pintar(); },
  tapar: (b) => { oculto = !!b; pintar(); }, aplicar: (o) => { Object.assign(s, o); pintar(); }, estado: () => s, ver: verModelo, cita, medir: ajustarDock,
  abrir: (clave) => { modoPrueba('explorar'); ponerPreset(clave); },
});
mayeutica.cargar();
new ResizeObserver(ajustarDock).observe($('dock'));
seguirFrase(R, () => $('escena'), { dock: () => $('dock') });
window.__hpv = { get s() { return s; }, leer: () => leer(s), hacer, ponerPreset, modoPrueba, pintar, abrirEstado, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, vitales: () => vitales(s) };
