// Eje B «Dos glándulas, un enfermo». Reutiliza (importados): crearTope (js/core/tope.js), seguirFrase (js/core/frase-vista.js). Motion se carga a mano (script clásico).
// Los botones del dock se crean UNA vez y se repintan. Sin copiar el motor del shock vivo: aquí la PA es un cálculo ilustrativo propio, rotulado.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { PRES, IDEA, IMG, PDF, cita, REF, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, GUIAS } from './datos.js';
import { nuevo, leer, topes, clamp, toribioRet, PROD, U, acthVals } from './modelo.js';
import { escena, focoSvg } from './escena.js';
import { APUESTAS, ERRORES, CASOS } from './pruebas.js';
const $ = (id) => document.getElementById(id);
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
const num = (x) => String(x).replace('.', ',');
let s = nuevo('toribio'), modo = 'explorar', oculto = false, preset = 'toribio', lup = 'sr', foco = null, topeApi, firma = '', guiaI = 0, guiaC = null, vista = 'eje';
const NOTRATA = { fulgencio: 'eutiro', get policarpo() { return s.farm === 'amio' || s.farm === 'hep' ? 'hiperx' : ''; } };
const CLAVES = ['vol', 'nat', 'na2', 'tormenta', 'fc140', 'mixedema', 'levo', 'yodo', 'eutiro', 'asma', 'ptu', 'prop', 'imposible', 'hiperx', 'amio', 'dia', 'estresMax', 'estres2', 'sincob', 'retirar', 'deltaBajo', 'deltaAlto', 'farmEje', 'rebote'];
const cit = (c) => (c && c.p ? cita(c.p, c.f) : '');
const frase = (t, o) => { $('frase-txt').innerHTML = `${t} <span class="org">${o}</span>`; };
function aplicarTopes(L) {
  const lista = topes(s, L), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.titulo, t.texto]));
  if (f === firma) { topeApi.refrescar(); return; } firma = f;
  for (const c of CLAVES) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag ? { p: t.pag, f: t.ficha } : null, origen: t.origen, deshabilita: t.off });
  // un solo sello bajo el monitor: el chip amarillo solo para los topes que no están abiertos como sello
  document.querySelectorAll('.tope-linea span[data-tope]').forEach((l) => { const sl = document.querySelector(`.tope-sello[data-tope="${l.dataset.tope}"]`); l.hidden = !!(sl && !sl.hidden); });
}
function pintar() {
  const P = PRES[s.pac], L = leer(s); aplicarTopes(L);
  $('eje-svg').innerHTML = escena(s, L, { lup, vista }) + focoSvg(foco);
  const q = oculto ? '?' : null;
  $('m-pa').textContent = q || `${L.pas}/${L.pad}`; $('m-pam').textContent = q || L.pam.toFixed(0); $('m-fc').textContent = L.fc; $('m-rit').textContent = L.ritmo; $('m-t').textContent = num(L.t); $('m-na').textContent = L.na;
  $('m-gl').textContent = L.gluc; $('m-lac').textContent = num(L.lact); $('m-nor').textContent = num(s.na.toFixed(1)); $('m-dia').textContent = s.dia;
  $('b-mapa').setAttribute('aria-pressed', String(vista === 'mapa')); $('b-mapa').textContent = vista === 'mapa' ? 'Ver el eje' : 'Ver el mapa';
  $('mando-es').hidden = s.pac !== 'bibiana'; $('o-es').textContent = `Estrés ${s.estres} · ≈${PROD[s.estres]} mg/día${s.estres === 1 || s.estres === 2 ? ' · ilustrativo' : ''}`; $('b-ret').hidden = s.pac !== 'toribio'; $('b-ret').setAttribute('aria-pressed', String(s.ret)); $('b-ret').textContent = s.ret ? 'Retirada gradual en curso ✔' : 'Retirar la hidrocortisona poco a poco';
  $('mando-pat').hidden = !(s.pac === 'sinforoso' || s.pac === 'obdulia'); document.querySelectorAll('[data-pat]').forEach((b) => { b.hidden = (b.dataset.pat === 't3tox' && s.pac !== 'sinforoso') || (b.dataset.pat === 'hipoS' && s.pac !== 'obdulia'); b.setAttribute('aria-pressed', String(b.dataset.pat === s.pat)); });
  $('m-pa').parentElement.className = !oculto && L.pam < 65 ? 'mal' : ''; $('m-t').parentElement.className = L.t > 40 || L.t < 35 ? 'mal' : '';
  document.querySelectorAll('[data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === preset)));
  document.querySelectorAll('.modos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
  document.querySelectorAll('[data-lup]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lup === lup)));
  document.querySelectorAll('[data-atd]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.atd === s.atd)));
  document.querySelectorAll('[data-bb]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.bb === s.bb)));
  $('b-vol').textContent = `Suero +500 mL · ${num(s.vol / 1000)} L`; $('o-na').textContent = `NA ${num(s.na.toFixed(1))} µg/kg/min`;
  $('b-hc').textContent = s.hc ? 'Hidrocortisona dada ✔' : s.pac === 'lucrecia' ? 'Hidrocortisona 300 mg + 100 mg/8 h' : 'Hidrocortisona 100 mg/8 h'; $('b-hc').setAttribute('aria-pressed', String(!!s.hc)); $('b-hc').disabled = !!s.hc;
  $('mando-acth').hidden = !acthVals(s); $('b-acth').disabled = s.acth; $('b-acth').setAttribute('aria-pressed', String(s.acth)); $('b-acth').textContent = s.acth ? 'Prueba de ACTH hecha ✔' : 'Prueba de ACTH 250 µg';
  $('mando-farm').hidden = s.pac !== 'policarpo'; document.querySelectorAll('[data-farm]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.farm === s.farm)));
  $('b-yodo').setAttribute('aria-pressed', String(s.yodo)); $('b-yodo').textContent = s.yodo ? 'Yodo puesto ✔' : 'Yodo 5 gotas/6 h';
  $('b-levo').setAttribute('aria-pressed', String(s.hor === 'levo')); $('b-lio').setAttribute('aria-pressed', String(s.hor === 'lio'));
  $('b-asma').hidden = s.pac !== 'lucrecia'; $('b-asma').setAttribute('aria-pressed', String(s.crisis)); $('b-asma').textContent = s.crisis ? 'Crisis de asma: sí' : 'Crisis de asma: no';
  $('fig-img').src = `../../js/modules/libros/img/${IMG[0]}`; $('fig-cap').innerHTML = `${IMG[1]} ${cita(IMG[2], IMG[3])}`;
  topeApi.refrescar();
}
// Motion: el eje se enciende paso a paso (hipotálamo → hipófisis → glándula → freno). Con «reducir movimiento», el estado final.
function secuencia() {
  if (REDUCIR || !window.Motion) return;
  const gs = [...$('eje-svg').querySelectorAll('.paso')];
  for (let i = 0; i < 4; i++) { const g = gs.filter((x) => +x.dataset.i === i); if (g.length) window.Motion.animate(g, { opacity: [0.15, 1] }, { delay: i * 0.45, duration: 0.4 }); }
}
function relojFrase() {
  const L = leer(s), c = (x) => num(x), p = s.pac;
  const q = p === 'lucrecia' ? `T ${c(L.t)} °C y FC ${L.fc}.` : p === 'sinforoso' ? `FC ${L.fc}.` : p === 'obdulia' ? `T ${c(L.t)} °C, FC ${L.fc} y Na⁺ ${L.na}.` : p === 'toribio' && s.hc ? `lactato ${c(L.lact)} mmol/L.` : 'sin cambios a la vista.';
  return `Día ${s.dia}: ${q}`;
}
function dosis(a, v) {
  const t = s.pac === 'lucrecia', P = PRES[s.pac];
  const m = {
    vol: ['Suero 500 mL: la PA sube muy poco si falla el eje. El tope de la maqueta es 3 L.', 'cuánto sube: ilustrativo · tope: fisiología general'],
    'na+': [`Noradrenalina ${num(s.na.toFixed(1))} µg/kg/min: sube la PA, pero no arregla el eje.`, 'cuánto sube: ilustrativo'], 'na-': [`Noradrenalina ${num(s.na.toFixed(1))} µg/kg/min.`, 'ilustrativo'],
    hc: t ? ['Hidrocortisona 300 mg IV de carga y 100 mg cada 8 h, solo en la tormenta: entra por fuera y frena la ACTH.', 'dosis: ficha p. 55 · freno: Libro Azul p. 4-6, Younes'] : [`Hidrocortisona 100 mg IV cada 8 h: entra por fuera y frena la ACTH${P.circ ? '; la PA sube' : ''}.`, `dosis: ficha p. ${s.pac === 'obdulia' ? 57 : 51} · freno: Libro Azul p. 4-6, Younes · cuánto sube la PA: ilustrativo`],
    ptu: t ? ['Propiltiouracilo: carga de 500-1.000 mg y 250 mg cada 4 h. Bloquea la síntesis de T4 y su conversión a T3.', 'ficha p. 55 (Tabla 51.4)'] : ['Propiltiouracilo 50-150 mg cada 8 h. Bloquea la síntesis de T4 y su conversión a T3.', 'ficha p. 55 (Tabla 51.4)'],
    mti: t ? ['Metimazol 60-80 mg al día en la tormenta; bloquea la síntesis de T4.', 'ficha p. 55 (Tabla 51.4)'] : ['Metimazol 10-20 mg una vez al día; bloquea la síntesis de T4.', 'ficha p. 55 (Tabla 51.4)'],
    yodo: ['Yoduro potásico saturado, 5 gotas (250 mg de yodo) cada 6 h, junto al antitiroideo: bloquea la síntesis y la secreción de T4.', 'ficha p. 55 (Tabla 51.4)'],
    prop: t ? ['Propranolol 60-80 mg por vía oral cada 4 h: frena la taquicardia y, a dosis altas, la conversión de T4 a T3.', 'ficha p. 54 (Tabla 51.3; la maqueta enseña solo la vía oral)'] : ['Propranolol 10-40 mg por vía oral, 3-4 veces al día: frena la taquicardia.', 'ficha p. 54 (Tabla 51.3)'],
    meto: ['Metoprolol 25-50 mg por vía oral, 2-3 veces al día: relativamente β1, útil con asma o insuficiencia cardíaca.', 'ficha p. 54 (Tabla 51.3)'], esmolol: ['Esmolol 50-100 µg/kg/min en infusión continua: se ajusta en minutos.', 'ficha p. 54 (Tabla 51.3)'],
    levo: ['Levotiroxina en bolo IV lento de 200-400 µg; después 50-100 µg al día por vía oral (la IV, el 75 % de esa dosis).', 'ficha p. 57'],
    d1: [relojFrase(), 'el reloj y cuánto cambia: ilustrativo · sentido: ficha p. 51-57'], d7: [relojFrase(), 'el reloj y cuánto cambia: ilustrativo · sentido: ficha p. 51-57'], retg: [relojFrase(), 'el reloj y cuánto cambia: ilustrativo · sentido: ficha p. 51'],
    ret: ['Retirada gradual de la hidrocortisona: se hace al resolverse la causa, sin vasopresor y con el lactato normal.', 'ficha p. 51'],
    'es+': [`Estrés ${s.estres}: sube la demanda de cortisol; una glándula sana llega como mucho a 350 mg/día.`, 'ficha p. 48 · cuánto cae la PA sin cobertura: ilustrativo'], 'es-': [`Estrés ${s.estres}: baja la demanda de cortisol.`, 'ficha p. 48'],
    acth: (() => { const q = acthVals(s); return q ? [`Prueba de ACTH, 250 µg: el cortisol sube de ${q.b} a ${q.post} µg/dL, un aumento de ${q.d}${q.d < 9 ? ', menor de 9: supresión' : ', de 9 o más: no descarta la secundaria'}.`, 'ficha p. 50-51 · cifras ilustrativas'] : null; })(),
    farm: [`${{ amio: 'Amiodarona', hep: 'Heparina', eto: 'Etomidato', keto: 'Ketoconazol' }[v]}: ${{ amio: 'bloquea la conversión de T4 a T3; T4 alta, TSH normal y T3 baja. No se trata.', hep: 'activa la lipoproteína lipasa y los ácidos grasos libres desplazan la T4: T4 alta con TSH normal. No se trata.', eto: 'inhibe la síntesis de cortisol: cortisol bajo y ACTH alta.', keto: 'inhibe la síntesis de cortisol: cortisol bajo y ACTH alta.' }[v]}`, 'ficha p. 50 y 54'],
    pat: [s.pat === 't3tox' ? 'T3-toxicosis: T4 libre normal con TSH baja (Tabla 51.2).' : s.pat === 'hipoS' ? 'Hipotiroidismo secundario: T4 libre baja con TSH baja, el fallo es hipotálamo-hipofisario.' : 'El laboratorio del caso.', 'ficha, Tabla 51.2 (p. 53) · las cifras son ilustrativas'], lio: ['Liotironina IV: carga de 5-20 µg y 2,5-10 µg cada 8 h hasta que despierte.', 'ficha p. 57'],
  };
  return m[a === 'atd' || a === 'bb' ? v : a];
}
function hacer(a, v) {
  const P = PRES[s.pac]; s.intento = '';
  if (a === 'vol') { if (s.vol >= 3000) return; s.vol += 500; }
  else if (a === 'na+') s.na = clamp(Math.round((s.na + 0.1) * 10) / 10, 0, 1); else if (a === 'na-') s.na = clamp(Math.round((s.na - 0.1) * 10) / 10, 0, 1);
  else if (a === 'hc') { s.hc = 1; s.hcD = s.dia; }
  else if (a === 'd1' || a === 'd7') s.dia = Math.min(U.dia, s.dia + (a === 'd1' ? 1 : 7));
  else if (a === 'retg') { s.dia = Math.min(U.dia, s.dia + 3); s.na = 0; }
  else if (a === 'ret') { if (s.pac === 'toribio' && s.hc && !toribioRet(s, leer(s))) s.ret = true; }
  else if (a === 'es+') s.estres = Math.min(3, s.estres + 1); else if (a === 'es-') s.estres = Math.max(0, s.estres - 1);
  else if (a === 'farm') { s.farm = v; s.acth = false; lup = v === 'eto' || v === 'keto' ? 'sr' : 'ti'; } else if (a === 'acth') { s.acth = true; lup = 'sr'; } else if (a === 'pat') s.pat = v;
  else if (a === 'atd') { if (NOTRATA[s.pac] && v !== 'ninguno') s.intento = NOTRATA[s.pac]; else { s.atd = v; s.atdD = v === 'ninguno' ? null : s.dia; } }
  else if (a === 'yodo') { if (NOTRATA[s.pac]) s.intento = NOTRATA[s.pac]; else if (s.atd === 'ninguno') s.intento = 'yodo'; else { s.yodo = !s.yodo; s.yodoD = s.yodo ? s.dia : null; } }
  else if (a === 'bb') { if (s.crisis && v !== 'ninguno') s.intento = 'bb'; else { s.bb = v; s.bbD = v === 'ninguno' ? null : s.dia; } }
  else if (a === 'levo' || a === 'lio') { if (NOTRATA[s.pac]) s.intento = NOTRATA[s.pac]; else if (P.t < 35 && !s.hc) s.intento = 'levo'; else { s.hor = s.hor === a ? 'ninguna' : a; s.horD = s.hor === 'ninguna' ? null : s.dia; } }
  else if (a === 'asma') s.crisis = !s.crisis;
  const m = dosis(a, v); pintar();
  if (s.intento) { const t = topes(s, leer(s)).find((x) => x.c === s.intento || (s.intento === 'bb' && x.c === 'asma')); if (t) frase(`No se aplica: ${t.texto}`, t.origen); } else if (m) frase(...m);
  if (['hc', 'atd', 'yodo', 'bb', 'levo', 'lio'].includes(a) && !s.intento) secuencia();
}
function ponerPreset(c) { preset = c; s = nuevo(c); lup = PRES[c].lup; vista = 'eje'; oculto = false; foco = null; modoPrueba('explorar'); abrirGuia(c); frase(`${PRES[c].n}, ${PRES[c].e} años · ${PRES[c].caso}. Toca una lupa para ver qué eje falla.`, 'caso inventado · constantes: ilustrativo'); pintar(); secuencia(); }
// ---- guía de 3-5 pasos ----
function abrirGuia(c) { guiaC = GUIAS[c]; guiaI = 0; pasoGuia(0); }
function pasoGuia(k) {
  const caja = $('guia'); if (!guiaC) { caja.hidden = true; return; }
  guiaI = clamp(k, 0, guiaC[1].length - 1); const p = guiaC[1][guiaI]; caja.hidden = modo !== 'explorar'; foco = p.z; vista = p.v || 'eje';
  caja.innerHTML = `<h3>${guiaC[0]} · paso ${guiaI + 1} de ${guiaC[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p, p.f)}${p.x ? ' ' + REF[p.x] : ''}</p><div class="fila-g">${p.haz ? '<button type="button" class="b prim" data-g="haz">Hazlo: ' + p.btn + '</button>' : ''}<button type="button" data-g="ant" ${guiaI ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${guiaI < guiaC[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  pintar();
}
$('guia').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-g]'); if (!b || !guiaC) return; const a = b.dataset.g, p = guiaC[1][guiaI];
  if (a === 'ant') pasoGuia(guiaI - 1); else if (a === 'sig') { if (guiaI < guiaC[1].length - 1) pasoGuia(guiaI + 1); else { guiaC = null; foco = null; $('guia').hidden = true; pintar(); } } else if (a === 'haz') { hacer(...p.haz); foco = p.z; pintar(); }
});
// ---- apuesta, error, caso ----
const opsHtml = (ops, extra = '') => `<div class="ops">${ops.map((o, i) => `<button type="button" class="op" data-i="${i}">${o[0]}</button>`).join('')}${extra}</div><div class="resp"></div>`;
function modoPrueba(m, k = 0) {
  modo = m; const caja = $('prueba'); caja.dataset.fin = ''; caja.dataset.k = k; caja.dataset.found = 0; caja.hidden = m === 'explorar'; caja.innerHTML = ''; if (m !== 'explorar') { $('guia').hidden = true; foco = null; } else if (guiaC) $('guia').hidden = false;
  if (m === 'explorar') { oculto = false; vista = 'eje'; return pintar(); }
  if (m === 'apuesta') { const A = APUESTAS[k % APUESTAS.length]; caja.dataset.k = k % APUESTAS.length; s = nuevo(A.p); preset = A.p; lup = PRES[A.p].lup; vista = A.vista; oculto = true; frase(`${PRES[A.p].n}, ${PRES[A.p].e} años · ${PRES[A.p].caso}. Decide antes de ver la PA.`, 'caso inventado · constantes: ilustrativo'); caja.innerHTML = `<h3>Apuesta</h3><p class="enun">${A.enun}</p>${opsHtml(A.ops)}`; }
  if (m === 'error') { const E = ERRORES[k % ERRORES.length]; caja.dataset.k = k % ERRORES.length; s = nuevo(E.p); preset = E.p; lup = E.lup; vista = 'eje'; oculto = false; frase(`Nota de ${PRES[E.p].n}, ${PRES[E.p].e} años: toca la frase con el error.`, 'caso inventado · constantes: ilustrativo'); caja.innerHTML = `<h3>Encuentra el error</h3><p class="enun">${E.enun}</p>${opsHtml(E.fr, '<button type="button" class="op neutra" data-nada="1">No hay ningún error</button>')}`; }
  if (m === 'caso') { oculto = false; caja.dataset.k = k % CASOS.length; lup = CASOS[k % CASOS.length].lup; return paso(0); }
  pintar();
}
function paso(i) { const C = CASOS[+$('prueba').dataset.k], p = C.pasos[i]; s = { ...nuevo(C.pac), ...p.e }; preset = C.pac; vista = p.vista; frase(...p.fr); $('prueba').dataset.paso = i; $('prueba').dataset.fin = ''; $('prueba').innerHTML = `<h3>Caso · ${C.titulo} · paso ${i + 1} de ${C.pasos.length}</h3><p class="enun">${p.enun}</p>${opsHtml(p.ops)}`; pintar(); }
$('prueba').addEventListener('click', (ev) => {
  const sig = ev.target.closest('[data-sig]'); if (sig) return paso(+sig.dataset.sig);
  const otro = ev.target.closest('[data-otro]'); if (otro) return modoPrueba(otro.dataset.otro, +$('prueba').dataset.k + 1);
  const b = ev.target.closest('.op'); if (!b || b.disabled) return; const i = +b.dataset.i, caja = $('prueba'), r = caja.querySelector('.resp');
  const dar = (o, ok, acum) => { b.classList.add(ok ? 'bien' : 'mal'); const h = `<p class="por ${ok ? 'ok' : 'no'}">${ok ? '✔ ' : '✖ '}${o[2]} ${cita(o[3], o[4])}</p>`; if (acum) r.insertAdjacentHTML('beforeend', h); else r.innerHTML = h; };
  const cerrar = () => { caja.querySelectorAll('.op').forEach((x) => (x.disabled = true)); caja.dataset.fin = '1'; };
  const otra = (que, n) => { if (n > 1) r.insertAdjacentHTML('beforeend', `<button type="button" class="b prim" data-otro="${que}">Otra ${que === 'apuesta' ? 'apuesta' : que === 'caso' ? 'historia' : 'nota'}</button>`); };
  if (modo === 'apuesta') { const A = APUESTAS[+caja.dataset.k], o = A.ops[i]; dar(o, o[1]); cerrar(); oculto = false; if (o[1]) Object.assign(s, A.fin); pintar(); if (o[1]) secuencia(); otra('apuesta', APUESTAS.length); }
  else if (modo === 'error') {
    const E = ERRORES[+caja.dataset.k], n = E.fr.filter((x) => x[1]).length;
    if (b.dataset.nada) { r.insertAdjacentHTML('beforeend', `<p class="por no">✖ Hay ${n} error${n > 1 ? 'es' : ''}: relee las frases con cifras y con el orden de los fármacos.</p>`); return; }
    const o = E.fr[i]; dar(o, o[1], true); b.disabled = true; if (o[1]) caja.dataset.found = +caja.dataset.found + 1;
    if (+caja.dataset.found >= n) { cerrar(); otra('error', ERRORES.length); }
  } else if (modo === 'caso') {
    const C = CASOS[+caja.dataset.k], k = +caja.dataset.paso, o = C.pasos[k].ops[i]; dar(o, o[1]); cerrar(); Object.assign(s, o[5] || {}); pintar();
    if (k < C.pasos.length - 1) r.insertAdjacentHTML('beforeend', `<button type="button" class="b prim" data-sig="${k + 1}">Siguiente paso</button>`);
    else r.insertAdjacentHTML('beforeend', `<div class="llevas"><b>Lo que te llevas</b><ul>${C.llevas.map((x) => `<li>${x[0]} ${cita(x[1], x[2])}</li>`).join('')}</ul></div>`), otra('caso', CASOS.length);
  }
});
// ---- el dock: botones creados una vez ----
$('dock-panel').innerHTML = `
  <div class="mando"><b class="dock-nota">Circulación</b><div class="fila"><button type="button" id="b-vol" data-a="vol" class="b"></button></div><div class="fila"><button type="button" data-a="na-" class="b">NA −0,1</button><output id="o-na"></output><button type="button" data-a="na+" class="b">NA +0,1</button></div><span class="peq">Cuánto sube la PA con suero y noradrenalina: ilustrativo</span></div>
  <div class="mando" id="mando-acth" hidden><b class="dock-nota">Prueba de ACTH</b><div class="fila"><button type="button" id="b-acth" data-a="acth" class="b" aria-pressed="false"></button></div><span class="peq">Aumento del cortisol a los 60 min: menor de 9 = supresión (ficha p. 50)</span></div>
  <div class="mando"><b class="dock-nota">Corticoide</b><div class="fila"><button type="button" id="b-hc" data-a="hc" class="b" aria-pressed="false"></button><button type="button" id="b-ret" data-a="ret" class="b" aria-pressed="false"></button></div></div>
  <div class="mando" id="mando-es" hidden><b class="dock-nota">Estrés (cirugía, infección)</b><div class="fila"><button type="button" data-a="es-" class="b">Estrés −1</button><output id="o-es"></output><button type="button" data-a="es+" class="b">Estrés +1</button></div><span class="peq">De 0 a 3. Cuánto cae la PA sin cobertura: ilustrativo</span></div>
  <div class="mando"><b class="dock-nota">Reloj</b><div class="fila"><button type="button" data-a="d1" class="b">+1 día</button><button type="button" data-a="d7" class="b">+7 días</button></div><span class="peq">Los días y cuánto cambia el enfermo: ilustrativo</span></div>`;
const seg = (at, vals) => `<div class="fila">${vals.map(([v, t]) => `<button type="button" data-${at}="${v}" class="b" aria-pressed="false">${t}</button>`).join('')}</div>`;
$('dock-tiro').innerHTML = `
  <div class="mando"><b class="dock-nota">Antitiroideo y yodo</b>${seg('atd', [['ninguno', 'Ninguno'], ['ptu', 'Propiltiouracilo'], ['mti', 'Metimazol']])}<div class="fila"><button type="button" id="b-yodo" data-a="yodo" class="b" aria-pressed="false"></button></div></div>
  <div class="mando"><b class="dock-nota">Betabloqueante oral o esmolol</b>${seg('bb', [['ninguno', 'Ninguno'], ['prop', 'Propranolol oral'], ['meto', 'Metoprolol'], ['esmolol', 'Esmolol IV']])}<div class="fila"><button type="button" id="b-asma" data-a="asma" class="b" aria-pressed="false"></button></div></div>
  <div class="mando"><b class="dock-nota">Hormona tiroidea</b><div class="fila"><button type="button" id="b-levo" data-a="levo" class="b" aria-pressed="false">Levotiroxina IV 200-400 µg</button><button type="button" id="b-lio" data-a="lio" class="b" aria-pressed="false">Liotironina IV 5-20 µg</button></div></div>
  <div class="mando" id="mando-pat" hidden><b class="dock-nota">Patrón del laboratorio (Tabla 51.2)</b><div class="fila"><button type="button" data-pat="" class="b" aria-pressed="false">Del caso</button><button type="button" data-pat="t3tox" class="b" aria-pressed="false">T3-toxicosis</button><button type="button" data-pat="hipoS" class="b" aria-pressed="false">Hipot. secundario</button></div></div>
  <div class="mando" id="mando-farm" hidden><b class="dock-nota">Fármaco que corta el eje</b>${seg('farm', [['amio', 'Amiodarona'], ['hep', 'Heparina'], ['eto', 'Etomidato'], ['keto', 'Ketoconazol']])}</div>
  <div class="mando"><b class="dock-nota">Reloj</b><div class="fila"><button type="button" data-a="d1" class="b">+1 día</button><button type="button" data-a="d7" class="b">+7 días</button></div></div>`;
$('presets').innerHTML = Object.entries(PRES).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.n}</button>`).join('');
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('[data-a]'); if (a && !a.disabled && a.closest('#dock')) return hacer(a.dataset.a);
  const fa = ev.target.closest('[data-farm]'); if (fa && !fa.disabled) return hacer('farm', fa.dataset.farm);
  const at = ev.target.closest('[data-atd]'); if (at && !at.disabled) return hacer('atd', at.dataset.atd);
  const bb = ev.target.closest('[data-bb]'); if (bb && !bb.disabled) return hacer('bb', bb.dataset.bb);
  const pt = ev.target.closest('[data-pat]'); if (pt) return hacer('pat', pt.dataset.pat);
  const pr = ev.target.closest('[data-pre]'); if (pr) return ponerPreset(pr.dataset.pre);
  const lu = ev.target.closest('[data-lup]'); if (lu) { lup = lu.dataset.lup; pintar(); return secuencia(); }
  if (ev.target.closest('#b-mapa')) { vista = vista === 'mapa' ? 'eje' : 'mapa'; return pintar(); }
  const m = ev.target.closest('.modos [data-modo]'); if (m) return modoPrueba(m.dataset.modo);
  if (ev.target.closest('#paso-a-paso')) return secuencia();
  const pe = ev.target.closest('[data-pest]'); if (pe) { document.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === pe))); $('dock-panel').hidden = pe.dataset.pest !== 'circ'; $('dock-tiro').hidden = pe.dataset.pest === 'circ'; return ajustarDock(); }
  const vf = ev.target.closest('.ver-ficha'); if (vf) { const t2 = $('toast'); t2.textContent = `En la app: abre la ficha y resalta el párrafo #${vf.dataset.resaltar.slice(1)} (p. ${vf.dataset.pag}).`; t2.hidden = false; setTimeout(() => (t2.hidden = true), 3000); }
});
$('mas-mandos').addEventListener('click', () => { const ab = $('dock').classList.toggle('abierto'); $('mas-mandos').setAttribute('aria-expanded', String(ab)); $('mas-mandos').textContent = ab ? 'Menos mandos ▴' : 'Más mandos ▾'; ajustarDock(); });
$('fuentes').innerHTML = FUENTES.map((f) => `<li>${f[0]} <span class="org">${f[1]}</span></li>`).join('') + `<li><a href="${PDF}" target="_blank" rel="noopener">Abrir el PDF de Marino</a></li>`;
$('notas').innerHTML = NOTAS.map((n) => `<p class="para"><b>${n[0]}:</b> ${n[1]}</p>`).join('');
$('profundizar').innerHTML = PROFUNDIZAR.map((x) => `<li>${x}</li>`).join(''); $('crecera').innerHTML = CRECERA.map((x) => `<li>${x}</li>`).join(''); $('idea').innerHTML = IDEA;
function ajustarDock() { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); }
topeApi = crearTope({ monitor: $('monitor'), dock: $('dock'), cita: cit });
$('monitor').after(document.querySelector('.tope-avisos'));
new ResizeObserver(ajustarDock).observe($('dock')); new ResizeObserver(ajustarDock).observe($('frase'));
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
ponerPreset('toribio');
window.__eje = { get vista() { return vista; }, setVista: (v) => { vista = v; pintar(); }, get s() { return s; }, leer: () => leer(s), topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, hacer, ponerPreset, modoPrueba, pintar, setLup: (l) => { lup = l; pintar(); } };
