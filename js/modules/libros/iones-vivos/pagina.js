// Iones vivos · lo que ves y lo que hay. La página: estado de la sesión, monitor, dock de mandos, dibujo, guía, pruebas y bucle del ECG.
// Se carga al primer abrir (index.js). Los botones del dock se crean UNA vez y se repintan en su sitio.
import { crearTope } from '../../../core/tope.js';
import { seguirFrase } from '../../../core/frase-vista.js';
import { leyendaParticulas } from '../../../core/particulas.js';
import { PDF, PRESETS, FUENTES, NOTAS, PENDIENTE, CRECIMIENTO, P, fichaDe, IDEA } from '../../../data/iones-vivos-data.js';
import { crearGuia, focoSvg } from './guia.js';
import { nuevo, leer, topes, fmt, clamp, avanzar, vitales, kVer, enParada } from './motor.js';
import { escena, NOMBRE } from './dibujo.js';
import * as ECG from './ecg.js';
import { crearMayeutica } from './mayeutica.js';
const $ = (id) => document.getElementById('iov-' + id);
const R = $('raiz');
const todos = (q) => R.querySelectorAll(q);
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
let foco = [], guiaApi, topeApi, firma = '', corriendo = false;
let s = nuevo(), ion = 'k', oculto = false, modo = 'explorar', pausa = false, preset = 'normal';
const e = { via: 'central', rate: 20, g: 4, amp: 'glu', n: 1, caMg: 90 };
const FRASES = {
  k: 'El líquido de fuera de la célula guarda solo el 2 % del potasio (el suero, ~0,4 %): por eso un número normal puede ocultar un déficit de cientos de mEq.',
  mg: 'El suero es el 0,3 % del magnesio: puede salir normal con el total vacío.',
  ca: 'El laboratorio mide el calcio total: con poca albúmina baja el total y el iónico, el que actúa, no se mueve.',
  p: 'El fosfato casi todo está dentro de las células: la insulina lo mete y el suero se hunde.',
};
const ORIG = { k: 'ficha · p. 18-20', mg: 'ficha · p. 32', ca: 'ficha · p. 42-43', p: 'ficha · p. 49' };
const FICHA_ION = { k: 'mr-hipopotasemia', mg: 'mr-magnesio-deficit', ca: 'mr-calcio-hipoca', p: 'mr-fosforo' };
// Cada cita: «PDF p. N» (abre el libro) y «p. N · Ver en la ficha» (el enlace cruzado de siempre, al párrafo exacto de la ficha)
const ir = (tab, id, txt) => `<button type="button" class="ver-ficha" data-especialidad="libros" data-view="marinoRenal" data-panel="panel-marino-renal-tabs" data-tab="${tab}" data-resaltar="#${id}">${txt}</button>`;
const cita = (c) => { const [tab, id] = fichaDe(c); return `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${c}" target="_blank" rel="noopener">PDF p. ${c}</a> · ${ir(tab, id, `p. ${c} · Ver en la ficha`)}</span>`; };
function frase(t, org) { $('frase-txt').innerHTML = `${t} <span class="org">${org}</span>`; }
const ecgK = (L) => (L.k > 5.5 ? Math.max(5.5, L.k - 1.2 * clamp(s.caIV / 90, 0, 1)) : L.k);
function aplicarTopes() {
  const lista = topes(s, e), f = JSON.stringify(lista.map((t) => [t.c, t.n, t.texto]));
  if (f === firma) return; firma = f;
  for (const c of ['clk', 'mg', 'ca', 'po4', 'caiv', 'nofis', 'hiperk', 'mgbolo']) if (!lista.some((t) => t.c === c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off || [], bajo: t.n === 'aviso' ? '#iov-dock-panel' : null });
}
// El aviso de hiperpotasemia (bajo el dock) nace plegado en una línea: título a la vista y el resto al tocarlo (ahorra ~60 px a 360)
function plegarAvisos() {
  for (const a of R.querySelectorAll('.tope-aviso[data-tope="hiperk"]:not([data-pleg])')) {
    a.dataset.pleg = '1'; const m = a.innerHTML.match(/^(⚠ <b>.*?<\/b>)([\s\S]*)$/); if (m) a.innerHTML = `<details class="aviso-pleg"><summary>${m[1]}</summary>${m[2]}</details>`;
  }
}
function ecgPintar(L = leer(s)) { $('ecg-path').setAttribute('d', enParada(s, e) ? ECG.PLANO : ECG.traza().d); return L; }
function pintar() {
  e.caMg = (e.amp === 'glu' ? 90 : 270) * e.n; const L = leer(s); aplicarTopes();
  $('ion-svg').innerHTML = escena(ion, s, L, oculto) + focoSvg(foco);
  const v = vitales(s, e, preset); $('mon-pa').textContent = v.pa; $('mon-fc').textContent = v.fc; $('mon-extra').textContent = v.extra;
  $('mon-k').textContent = `K⁺ ${oculto ? '?' : kVer(L.k)}` + (!oculto && L.k > 5.5 && s.caIV > 0 ? ' · el calcio protege el ECG, el K⁺ no baja' : '');
  $('nota-ecg').hidden = L.k >= 3.5; $('nota-ecg-txt').textContent = PENDIENTE;
  const marca = (q, f) => todos(q).forEach((b) => b.setAttribute('aria-pressed', String(f(b))));
  marca('.selector-ion button', (b) => b.dataset.ion === ion); marca('.modos button', (b) => b.dataset.modo === modo); marca('.presets button', (b) => b.dataset.pre === preset);
  marca('[data-rate]', (b) => +b.dataset.rate === e.rate); marca('[data-via]', (b) => b.dataset.via === e.via); marca('[data-gmg]', (b) => +b.dataset.gmg === e.g);
  marca('[data-amp]', (b) => b.dataset.amp === e.amp); marca('[data-n]', (b) => +b.dataset.n === e.n);
  $('o-alb').textContent = fmt(s.alb); $('o-ph').textContent = fmt(s.ph, 2); $('o-uni').textContent = s.units; $('o-ca').textContent = e.caMg + ' mg';
  $('b-real').textContent = `Realimentar (insulina + glucosa) · ${s.ins}`;
  topeApi.refrescar(); plegarAvisos();
  if (REDUCIR) ECG.avanzar(4, ecgK(L));
  ecgPintar(L);
}
// Las acciones: cada una cambia el estado y dice, en una frase, qué se ve y de dónde sale
function hacer(a, o = {}) {
  const L0 = leer(s);
  if (a === 'real') { s.ins = Math.min(4, s.ins + 1); ion = ion === 'ca' ? 'k' : ion; frase(`Entra glucosa con insulina: el K⁺ del suero pasa de ${kVer(L0.k)} a ${kVer(leer(s).k)} sin que el total cambie; el fosfato cae a ${fmt(leer(s).po4)} mg/dL y el Mg²⁺ a ${fmt(leer(s).mg)}.`, 'dirección: ficha · p. 21, 34, 49; cifras ilustrativas'); }
  if (a === 'furo') { s.dK = Math.max(-900, s.dK - P.kFurosemida); s.dMg -= P.mgFurosemida; frase('Furosemida: se van 20 mEq de K⁺ y 6 de Mg²⁺ por la orina; el total baja y el suero apenas lo nota.', 'dirección: ficha · p. 21, 23, 34; cantidades ilustrativas'); }
  if (a === 'clk') { s.bombas.clk = { rate: e.rate }; avanzar(s, 60); delete s.bombas.clk; frase(`ClK ${e.rate} mEq en 1 h: el total sube ${e.rate} mEq; el suero tarda en notarlo si el déficit es grande (parte plana de la curva).`, 'ritmo: ficha · p. 23; curva: p. 20'); }
  if (a === 'mg') { s.mgBolo += 8 * e.g; s.dMg += 4 * e.g; ion = 'mg'; frase(`${e.g} g de MgSO₄ = ${8 * e.g} mEq: la mitad se va por la orina; el suero sube rápido y baja a los 15 minutos.`, 'ficha · p. 36-38; subida: ilustrativa'); }
  if (a === 'esp') { const min = o.min ?? 15; avanzar(s, min); frase(min < 30 ? `Pasan ${min} minutos: el bolo de Mg²⁺ se reparte por el cuerpo y el calcio, a medias de los 30 min tras los que su efecto se acaba.` : `Pasan ${min} minutos: el efecto del calcio ya se ha disipado (30 min en el modelo) y el bolo de Mg²⁺ se ha repartido.`, 'Mg: ficha · p. 37-38; calcio: p. 46 (30-60 min en hiperK, p. 27); tiempos ilustrativos'); }
  if (a === 'ca') { s.caIV += o.mg ?? e.caMg; ion = 'ca'; frase(`${o.mg ?? e.caMg} mg de calcio elemental: el iónico sube de ${fmt(L0.caIon)} a ${fmt(leer(s).caIon)} mg/dL. En la hiperpotasemia (10 mL de gluconato = 90 mg, p. 27) el calcio protege el ECG y el K⁺ no baja: se deduce de la Tabla 36.3.`, 'gluconato 9 y cloruro 27 mg/mL: ficha · p. 27, 45; subida: ilustrativa'); }
  pintar();
}
function ponerPreset(clave, paso = 0) {
  preset = clave; s = nuevo(PRESETS[clave].s); Object.assign(e, { via: 'central', rate: 20, g: 4, amp: 'glu', n: 1 }); oculto = false; ion = clave === 'valentin' ? 'ca' : clave === 'damian' ? 'p' : 'k'; foco = [];
  frase(PRESETS[clave].txt || FRASES[ion], PRESETS[clave].txt ? 'paciente inventado; cifras de la ficha' : ORIG[ion]); pintar(); guiaApi.abrir(clave, paso);
}
function ponerIon(i) { ion = i; frase(FRASES[i], ORIG[i]); pintar(); }
// ---- Mayéutica (el interruptor Explorar | Preguntas; el motor común, enganchado en mayeutica.js) ----
// est: { preset, ion, s (cambios al paciente), acc (lo ya hecho: ['ca', mg] o ['esperar', min]) }. Directo al estado: sin frases ni guía.
function ponerEstadoMay(est) {
  preset = est.preset; s = nuevo({ ...PRESETS[est.preset].s, ...(est.s || {}) }); Object.assign(e, { via: 'central', rate: 20, g: 4, amp: 'glu', n: 1 }); foco = []; guiaApi.cerrar();
  for (const [a, n] of est.acc || []) { if (a === 'ca') s.caIV += n; else if (a === 'esperar') avanzar(s, n); }
  ion = est.ion; pintar();
}
function taparTodo(si) { oculto = si; pintar(); }
function accion(a, n) { const i0 = ion; hacer(a, a === 'ca' ? { mg: n } : a === 'esp' ? { min: n } : {}); ion = i0; pintar(); }
let mayeutica = null;
function setModo(m, reiniciar = true) {
  modo = m; const est = m === 'preguntas'; guiaApi.cerrar(); oculto = false; foco = [];
  $('modo-explorar').setAttribute('aria-pressed', String(!est)); $('modo-preguntas').setAttribute('aria-pressed', String(est));
  $('vista-preguntas').hidden = !est; for (const id of ['idea', 'ion-sel', 'leyenda', 'zona-abajo']) $(id).hidden = est;
  $('dock-in').hidden = est; $('dock-estudio').hidden = !est; R.classList.toggle('iov-mayeutica', est);
  if (!est) { if (reiniciar) ponerPreset('normal'); else pintar(); } else { $('escena').before($('vista-preguntas')); mayeutica.entrar(); }
  ajustarDock();
}
// ---- Montaje (una vez) ----
function montar() {
  $('ion-sel').innerHTML = ['k', 'mg', 'ca', 'p'].map((i) => `<button type="button" data-ion="${i}" aria-pressed="false">${NOMBRE[i]}</button>`).join('');
  $('ion-sel').addEventListener('click', (ev) => { const b = ev.target.closest('[data-ion]'); if (b) ponerIon(b.dataset.ion); });
  $('modos').addEventListener('click', (ev) => { const b = ev.target.closest('[data-modo]'); if (b && b.dataset.modo !== modo) setModo(b.dataset.modo); });
  const dock = $('dock'), seg = (id, attr, vals) => `<div class="fila" id="iov-${id}">${vals.map(([v, t]) => `<button type="button" data-${attr}="${v}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  $('dock-panel').innerHTML = `
   <div class="mando"><button type="button" id="iov-b-real" class="b prim">Realimentar</button><button type="button" id="iov-b-furo" class="b">Furosemida (−20 K⁺, −6 Mg²⁺)</button></div>
   <details class="mas" id="iov-mas"><summary>Más mandos: ClK, MgSO₄ y calcio</summary>
   <div class="mando"><b class="dock-nota">ClK: ritmo y vía (el libro: 20 mEq/h, 40 en la grave, p. 23; el 10 es ilustrativo)</b>${seg('s-rate', 'rate', [[10, '10'], [20, '20'], [40, '40 mEq/h']])}${seg('s-via', 'via', [['periferica', 'Periférica'], ['central', 'Central'], ['cava', 'Cava sup.']])}<button type="button" id="iov-b-clk" class="b">Pasar 1 h de ClK</button></div>
   <div class="mando"><b class="dock-nota">MgSO₄ (8 mEq por gramo) · dosis y ritmo ilustrativos: el libro da 2 g en 2-5 min solo en riesgo vital y 6 g en 3 h (p. 37)</b>${seg('s-g', 'gmg', [[2, '2 g'], [4, '4 g'], [6, '6 g']])}<div class="fila"><button type="button" id="iov-b-mg" class="b">Dar MgSO₄</button><button type="button" id="iov-b-esp" class="b">Esperar 15 min</button></div></div>
   <div class="mando"><b class="dock-nota">Calcio IV: gluconato 9 · cloruro 27 mg/mL (ampolla de 10 mL)</b>${seg('s-amp', 'amp', [['glu', 'Gluconato'], ['cl', 'Cloruro']])}${seg('s-n', 'n', [[1, '1 ampolla'], [2, '2'], [3, '3']])}<button type="button" id="iov-b-ca" class="b">Dar calcio · <span id="iov-o-ca"></span></button></div></details>`;
  $('dock-medir').innerHTML = `
   <div class="mando"><div class="presets" id="iov-presets"></div></div>
   <div class="mando"><label>Albúmina <output id="iov-o-alb"></output> g/dL<input type="range" id="iov-r-alb" min="1" max="4.5" step="0.1" value="4"></label>
   <label>pH <output id="iov-o-ph"></output><input type="range" id="iov-r-ph" min="7.2" max="7.6" step="0.02" value="7.4"></label>
   <label>Concentrados con citrato <output id="iov-o-uni"></output> (K⁺ 2-3 mEq cada uno)<input type="range" id="iov-r-uni" min="0" max="16" step="1" value="0"></label></div>`;
  const dp = $('dock-panel'), ACC = { 'iov-b-real': 'real', 'iov-b-furo': 'furo', 'iov-b-clk': 'clk', 'iov-b-mg': 'mg', 'iov-b-esp': 'esp', 'iov-b-ca': 'ca' };
  dp.addEventListener('click', (ev) => {
    const b = ev.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.rate) e.rate = +b.dataset.rate; if (b.dataset.via) e.via = b.dataset.via; if (b.dataset.gmg) e.g = +b.dataset.gmg; if (b.dataset.amp) e.amp = b.dataset.amp; if (b.dataset.n) e.n = +b.dataset.n;
    if (ACC[b.id]) hacer(ACC[b.id]); else pintar();
  });
  const sl = (id, k) => $(id).addEventListener('input', (ev) => { s[k] = +ev.target.value; ion = 'ca'; frase(k === 'alb' ? 'Menos albúmina baja el calcio total y el iónico queda igual.' : k === 'ph' ? 'La alcalosis une calcio a la albúmina: baja el iónico sin tocar el total.' : 'Cada concentrado trae citrato, que quela calcio, y 2-3 mEq de K⁺.', k === 'ph' ? 'ficha · p. 44; cifra ilustrativa' : k === 'alb' ? 'ficha · p. 43' : 'ficha · p. 25, 44; cifra ilustrativa'); pintar(); });
  sl('r-alb', 'alb'); sl('r-ph', 'ph'); sl('r-uni', 'units');
  $('presets').innerHTML = Object.entries(PRESETS).map(([k, v]) => `<button type="button" data-pre="${k}" aria-pressed="false">${v.nombre}</button>`).join('');
  $('presets').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pre]'); if (b) { if (modo !== 'explorar') setModo('explorar', false); ponerPreset(b.dataset.pre); } });
  dock.querySelector('.dock-tabs').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pest]'); if (!b) return; dock.querySelectorAll('[data-pest]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); dp.hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest !== 'medir'; ajustarDock(); });
  guiaApi = crearGuia({ dock: () => $('dock'), caja: $('guia'), hacer, cita, unidades: (n) => { s.units = n; $('r-uni').value = n; ion = 'k'; frase(`${n} concentrados: cada uno trae citrato y 2-3 mEq de K⁺; el K⁺ del suero sube a ${kVer(leer(s).k)} y el iónico baja.`, 'ficha · p. 25, 44; cifras ilustrativas'); pintar(); },
    ponerIon: (i) => { ion = i; oculto = false; }, setFoco: (z) => { foco = z; pintar(); } });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} <span class="org">ficha</span>`;
  $('pausa').addEventListener('click', () => { pausa = !pausa; $('pausa').setAttribute('aria-pressed', String(pausa)); });
  $('fuentes').innerHTML = FUENTES.map(([t, p]) => `<li>${t} · ${cita(p)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([t, x]) => `<p><b>${t === 'fuentes discrepan' ? 'Las fuentes discrepan' : t === 'fuente no lo dice' ? 'La fuente no lo dice' : 'Opinión del autor'}.</b> ${x}</p>`).join('');
  $('crecera').innerHTML = CRECIMIENTO.map(([t, d]) => d === 'ritmoVivo' ? `<li><button type="button" class="ver-ficha" data-especialidad="libros" data-view="ritmoVivo" data-ritmo-vivo="">${t} →</button></li>` : `<li>${t}</li>`).join('');
  $('fichas').innerHTML = Object.entries(FICHA_ION).map(([k, tab]) => `<li>${NOMBRE[k]}: ${ir(tab, tab, 'Ver la ficha')}</li>`).join('');
  $('profundizar').innerHTML = '<li>Cuánto sube el Mg²⁺ del suero con cada gramo y a los 15 minutos: curva de la p. 38, aún sin dibujar.</li><li>Prueba de retención de Mg (p. 38, Tabla 37.5): 24 mmol en 1 h; orina de 24 h ≤12 = déficit, >19 = lleno.</li><li>Reposición de fosfato (Tabla 38.5, p. 51): pendiente de este modelo.</li>';
  topeApi = crearTope({ monitor: $('monitor'), dock, cita });
  $('leyenda').innerHTML = leyendaParticulas(['k', 'mg', 'ca', 'p'], { titulo: 'Qué es cada partícula' });
}
function ajustarDock() { R.style.setProperty('--iov-dock-h', $('dock').offsetHeight + 'px'); }
function bucle() {
  if (corriendo) return; corriendo = true; let ult = 0;
  const paso = (ts) => {
    if (!R.offsetParent) { corriendo = false; return; }   // la vista está oculta: nada que animar
    if (!REDUCIR && !pausa && ts - ult > 80) { ECG.avanzar(0.08, ecgK(leer(s))); ecgPintar(); ult = ts; }
    requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}
// Estado: «rufino» (un paciente), «rufino:3» (su guía en el paso 3) o «normal:ca» (el paciente normal y ese ion). Vacío = el normal.
export function abrirEstado(clave) {
  const [p, x] = String(clave || '').split(':'); if (modo !== 'explorar') setModo('explorar', false);
  ponerPreset(PRESETS[p] ? p : 'normal', /^\d+$/.test(x || '') ? +x - 1 : 0);
  if (['k', 'mg', 'ca', 'p'].includes(x)) ponerIon(x);
  bucle(); ajustarDock();
}
montar(); mayeutica = crearMayeutica({ ponerEstado: ponerEstadoMay, taparTodo, accion, cita, S: {}, medirDock: ajustarDock, setModo: (m) => setModo(m, false) }); ECG.iniciar(); ponerPreset('normal'); bucle(); ajustarDock();
new ResizeObserver(ajustarDock).observe($('dock'));
seguirFrase(R, () => $('escena'), { dock: () => $('dock') });
window.__iones = { get s() { return s; }, e, leer: () => leer(s), hacer, ponerIon, ponerPreset, setModo, mayeutica: () => mayeutica, ponerEstadoMay, taparTodo, pintar, ecg: ECG, topes: () => topeApi.activos(), set: (o) => { Object.assign(s, o); pintar(); }, ecgK: () => ecgK(leer(s)), abrirEstado };
