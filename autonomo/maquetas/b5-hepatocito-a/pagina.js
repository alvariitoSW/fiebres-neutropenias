// Hepatocito · opción A «El sinusoide». Reutiliza (importados, no copiados): core/tope.js (topes con sello), core/frase-vista.js
// (la frase viva siempre a la vista), core/particulas.js (nh4, urea, agua, leyenda). Los botones del dock se crean UNA vez y se repintan.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { leyendaParticulas } from '../../../js/core/particulas.js';
import { PDF, FICHA, IMG, IDEA, PRESETS, FUENTES, NOTAS, PROFUNDIZAR, CRECERA, GUIA, APUESTA, ERROR, CASO } from './datos.js';
import { nuevo, leer, topes, fmt, clamp } from './modelo.js';
import { escena } from './dibujo.js';
const $ = (id) => document.getElementById(id);
let s = nuevo(), modo = 'explorar', gi = -1, foco = null, activos = new Set(), prev = { hin: false, tips: false }, topeApi;
const WHT = ['sin encefalopatía', 'atención corta, cambio de personalidad', 'apatía, desorientada en el tiempo', 'estupor, desorientada en lugar y tiempo', 'coma'];
// «PDF p. N» abre el libro; «p. N · Ver en la ficha» lleva al párrafo exacto (data-resaltar). c: 7 o '7|ma-eh-lactulosa'.
const cita = (c) => { const [p, id] = String(c).split('|'); return `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${p}" target="_blank" rel="noopener">PDF p. ${p}</a> · <button type="button" class="ver-ficha" data-resaltar="#${id || FICHA[p]}" data-pag-ficha="${p}">p. ${p} · Ver en la ficha</button></span>`; };
const org = (t) => `<span class="org${t === 'ilustrativo' ? ' ilu' : ''}">${t}</span>`;
function frase(txt, o = 'ficha') { $('frase-txt').innerHTML = `${txt} ${org(o)}`; }
const FR = {
  base: ['El amonio se forma en el intestino y el hígado lo convierte en urea; con el hígado apagado, el amonio sigue hasta el cerebro. · p. 6', 'ficha · p. 6'],
  fn: ['Con menos hepatocitos, el amonio que no se limpia sigue por la vena hepática hacia el cerebro. · p. 6', 'ficha · p. 6'],
  hin: ['Con amonio arterial >150 µmol/L sube el riesgo de edema cerebral: el astrocito fabrica glutamina y se hincha. · p. 6-7', 'ficha · p. 6-7'],
  lac: ['La lactulosa acidifica el colon y reduce las bacterias que fabrican amonio; se ajusta a 2-3 deposiciones blandas al día. · p. 7', 'ficha · p. 7'],
  rif: ['La rifaximina es un antibiótico que no se absorbe: 400 mg tres veces al día, al menos 10 días, casi siempre con lactulosa. · p. 7', 'ficha · p. 7'],
  cvvh: ['La CVVH retira el amonio de la sangre y se considera superior a lactulosa y rifaximina en el fallo hepático agudo. · p. 8', 'ficha · p. 8'],
  tips: ['El TIPS cambia un problema por otro: alivia la presión portal, pero salta el hígado y aumenta la encefalopatía. · p. 10', 'ficha · p. 10'],
};
const dec = (k) => frase(...FR[k]);
function pintar() {
  const l = leer(s);
  $('mon-nh3').textContent = fmt(l.nh3); $('mon-nh3').className = l.hinchado ? 'rojo' : '';
  $('mon-wh').textContent = `${l.wh} · ${WHT[l.wh]}`; $('mon-dep').textContent = s.dep;
  $('mon-ast').textContent = l.hinchado ? 'hinchado' : 'normal'; $('mon-ast').className = l.hinchado ? 'rojo' : '';
  $('mon-pa').textContent = `${l.pa[0]}/${l.pa[1]}`; $('mon-fc').textContent = l.fc;
  $('barra').style.width = (l.nh3 / 3) + '%';
  $('hep-svg').innerHTML = escena(s, l, foco);
  $('m-fn').value = s.fn; $('o-fn').textContent = s.fn + ' %';
  const DT = ['sin lactulosa', 'ataque: 20-30 g cada hora hasta la 1.ª deposición', '20 g/8 h, ajustada a 2-3 blandas/día', '20 g/8 h, ajustada a 2-3 blandas/día', 'diarrea osmótica', 'diarrea osmótica', 'diarrea intensa'];
  $('o-dep').textContent = `${s.dep} deposiciones/día · ${DT[s.dep]}`;
  const T = (b, on, txt) => { b.setAttribute('aria-pressed', on); b.textContent = txt; };
  T($('m-rif'), !!s.rif, `Rifaximina 400 mg ×3: ${s.rif ? 'sí' : 'no'}`); $('m-rifd').value = s.rifd; $('o-rifd').textContent = s.rifd + ' días';
  T($('m-cvvh'), !!s.cvvh, `CVVH: ${s.cvvh ? 'puesta' : 'apagada'}`); T($('m-tips'), !!s.tips, `TIPS: ${s.tips ? 'puesto' : 'no'}`);
  const lista = topes(s, l), nuevas = new Set(lista.map((t) => t.c));
  for (const c of activos) if (!nuevas.has(c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off || [], bajo: t.bajo });
  activos = nuevas; topeApi.refrescar?.();
  if (l.hinchado && !prev.hin) $('fig392').open = true; if (s.tips && !prev.tips) $('fig393').open = true;
  prev = { hin: l.hinchado, tips: !!s.tips }; window.__hep.lista = lista;
}
function ver(p) { Object.assign(s, p); pintar(); }
// ---- mandos (se crean una vez) ----
function mandos() {
  $('m-fn').addEventListener('input', (e) => { s.fn = +e.target.value; s.wh = null; dec('fn'); pintar(); if (leer(s).hinchado) dec('hin'); });
  $('m-dep-menos').addEventListener('click', () => { s.dep = clamp(s.dep - 1, 0, 6); dec('lac'); pintar(); });
  $('m-dep-mas').addEventListener('click', () => { s.dep = clamp(s.dep + 1, 0, 6); dec('lac'); pintar(); });
  $('m-rif').addEventListener('click', () => { s.rif ^= 1; dec('rif'); pintar(); });
  $('m-rifd').addEventListener('input', (e) => { s.rifd = +e.target.value; dec('rif'); pintar(); });
  $('m-cvvh').addEventListener('click', () => { s.cvvh ^= 1; dec('cvvh'); pintar(); });
  $('m-tips').addEventListener('click', () => { s.tips ^= 1; dec('tips'); pintar(); });
  for (const b of document.querySelectorAll('[data-preset]')) b.addEventListener('click', () => ponerPreset(b.dataset.preset));
  for (const b of document.querySelectorAll('[data-pest]')) b.addEventListener('click', () => { for (const x of document.querySelectorAll('[data-pest]')) x.setAttribute('aria-selected', x === b); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest === 'dar'; });
}
function ponerPreset(c) {
  s = { ...nuevo(), ...PRESETS[c].s }; foco = null; if (modo === 'explorar') guiaCerrar();
  for (const b of document.querySelectorAll('[data-preset]')) b.setAttribute('aria-pressed', b.dataset.preset === c);
  dec(leer(s).hinchado ? 'hin' : 'base'); pintar();
}
// ---- guía de 5 pasos ----
function guiaCerrar() { gi = -1; foco = null; $('guia').hidden = true; }
function guia(i) {
  gi = i; const g = GUIA[i]; foco = g.foco; const caja = $('guia'); caja.hidden = false;
  caja.innerHTML = `<h3>${i + 1}/${GUIA.length} · ${g.t}</h3><p class="enun">${g.x} ${cita(g.p)} ${org('ficha')}</p><div class="fila-g">${g.haz ? `<button type="button" class="b" data-g="haz">${g.haz[2]}</button>` : ''}${i ? '<button type="button" class="b" data-g="ant">Anterior</button>' : ''}<button type="button" class="b prim" data-g="sig">${i < GUIA.length - 1 ? 'Siguiente' : 'Terminar'}</button></div>`;
  frase(g.x, 'ficha · p. ' + g.p); pintar();
}
// ---- pruebas ----
function modoPrueba(m) {
  modo = m; for (const b of document.querySelectorAll('[data-modo]')) b.setAttribute('aria-pressed', b.dataset.modo === m);
  const c = $('prueba'); c.hidden = m === 'explorar'; c.innerHTML = ''; delete c.dataset.fin; guiaCerrar(); $('btn-guia').hidden = m !== 'explorar';
  if (m === 'explorar') { dec('base'); return pintar(); }
  s = { ...nuevo(), ...PRESETS.casimira.s }; foco = null;
  if (m === 'apuesta') apuesta(); if (m === 'error') error(); if (m === 'caso') caso(0); pintar();
}
const llevas = (L) => `<div class="llevas"><b>Lo que te llevas</b><ul>${L.map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('')}</ul></div>`;
function apuesta() {
  const c = $('prueba'), A = APUESTA;
  c.innerHTML = `<h3>Apuesta</h3><p class="enun">${A.enun}</p>` + A.ops.map((o, i) => `<button type="button" class="b op" data-i="${i}">${o[0]}</button>`).join('');
  c.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
    if (c.dataset.fin) return; const i = +b.dataset.i; c.dataset.fin = '1';
    c.querySelectorAll('.op').forEach((x, j) => x.classList.add(j === A.ok ? 'bien' : x === b ? 'mal' : 'neutra'));
    const n = (p) => fmt(leer({ ...s, ...p }).nh3), base = { ...s };
    c.insertAdjacentHTML('beforeend', `<p class="por ${i === A.ok ? 'ok' : 'no'}">${i === A.ok ? 'Bien apostado. ' : 'No era esa. '}${A.por} ${cita(A.p)}</p><p class="por">Con cada opción (ilustrativo): lactulosa a 3 deposiciones, ${n({ dep: 3 })} µmol/L · rifaximina, ${n({ rif: 1 })} · CVVH, ${n({ cvvh: 1 })}. Marino solo dice cuál es superior; las cifras son del modelo. ${org('ilustrativo')}</p>` + llevas(A.llevas));
    ver({ cvvh: 1 }); frase('Con CVVH el amonio de Casimira baja a ' + fmt(leer(s).nh3) + ' µmol/L: la que retira el amonio de la sangre es superior. · p. 8', 'ficha · p. 8; cifra ilustrativa');
  }));
}
function error() {
  const c = $('prueba'), E = ERROR, marca = [];
  c.innerHTML = `<h3>Encuentra el error</h3><p class="enun">${E.enun}</p>` + E.fr.map((f, i) => `<div class="ops" data-i="${i}"><p class="enun">${f.f}</p><div class="fila-g"><button type="button" class="b op" data-v="0">Bien</button><button type="button" class="b op" data-v="1">Error</button></div></div>`).join('');
  c.querySelectorAll('.ops').forEach((g) => g.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
    if (c.dataset.fin) return; marca[+g.dataset.i] = +b.dataset.v; g.querySelectorAll('.op').forEach((x) => x.setAttribute('aria-pressed', x === b));
    if (E.fr.every((_, i) => marca[i] !== undefined)) {
      c.dataset.fin = '1';
      c.querySelectorAll('.ops').forEach((gg, i) => { const f = E.fr[i], bien = (marca[i] === 1) === f.mal; gg.insertAdjacentHTML('beforeend', `<p class="por ${bien ? 'ok' : 'no'}">${bien ? 'Acertaste. ' : 'Fallaste. '}${f.por} ${cita(f.p)}</p>`); });
      c.insertAdjacentHTML('beforeend', llevas(E.llevas)); ver({ dep: 3, cvvh: 1 });
    }
  })));
}
function caso(i) {
  const c = $('prueba'), P = CASO.pasos[i], ult = i === CASO.pasos.length - 1; s = { ...nuevo(), ...P.s }; delete c.dataset.fin;
  c.innerHTML = `<h3>${CASO.paciente} · paso ${i + 1} de ${CASO.pasos.length}</h3><div class="paso"><p class="ctx">${P.ctx}</p><p class="enun"><b>${P.q}</b></p>` + P.ops.map((o, j) => `<button type="button" class="b op" data-i="${j}">${o}</button>`).join('') + '</div>';
  c.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
    if (c.dataset.paso === String(i) && c.querySelector('.por')) return; c.dataset.paso = i; const j = +b.dataset.i;
    c.querySelectorAll('.op').forEach((x, k) => x.classList.add(k === P.ok ? 'bien' : x === b ? 'mal' : 'neutra'));
    c.querySelector('.paso').insertAdjacentHTML('beforeend', `<p class="por ${j === P.ok ? 'ok' : 'no'}">${j === P.ok ? 'Bien. ' : 'No era esa. '}${P.por} ${cita(P.p)}</p>`);
    if (P.patch) ver(P.patch); else pintar();
    if (ult) { c.dataset.fin = '1'; c.insertAdjacentHTML('beforeend', llevas(CASO.llevas)); $('fig392').open = true; }
    else { const nx = document.createElement('button'); nx.type = 'button'; nx.className = 'b prim'; nx.textContent = 'Siguiente paso'; nx.addEventListener('click', () => { caso(i + 1); }); c.append(nx); }
  }));
  pintar();
}
// ---- arranque ----
function pagina() {
  const dock = $('dock');
  topeApi = crearTope({ monitor: $('monitor'), dock, cita });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} ${org('ficha')}`;
  $('leyenda').innerHTML = leyendaParticulas([{ clave: 'nh4', nombre: 'Amonio (NH₃/NH₄⁺)' }, 'urea', 'agua']) + '<p class="para">Bacterias del colon: punto morado. Hepatocito apagado: borde discontinuo y aspa.</p>';
  $('fuentes').innerHTML = FUENTES.map(([t, o]) => `<li>${t} ${org(o)}</li>`).join('');
  $('crecera').innerHTML = CRECERA.map((t) => `<li>${t}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([k, t]) => `<p class="para"><b>${k}.</b> ${t}</p>`).join('');
  $('profundizar').innerHTML = PROFUNDIZAR.map(([t]) => `<li>${t}</li>`).join('');
  $('img392').src = IMG.f392; $('img393').src = IMG.f393;
  mandos();
  for (const b of document.querySelectorAll('[data-modo]')) b.addEventListener('click', () => modoPrueba(b.dataset.modo));
  $('btn-guia').addEventListener('click', () => guia(0));
  $('guia').addEventListener('click', (e) => { const g = e.target.closest('[data-g]')?.dataset.g; if (!g) return; if (g === 'haz') { const h = GUIA[gi].haz; s[h[0]] = h[1]; if (h[0] === 'fn') s.wh = null; pintar(); } else if (g === 'ant') guia(gi - 1); else if (gi < GUIA.length - 1) guia(gi + 1); else { guiaCerrar(); pintar(); } });
  document.body.addEventListener('click', (e) => { const v = e.target.closest('.ver-ficha'); if (v) { $('toast').textContent = `En la app: lleva al párrafo de la ficha (p. ${v.dataset.pagFicha}).`; $('toast').hidden = false; setTimeout(() => ($('toast').hidden = true), 2200); } });
  const ajustar = () => { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); };
  new ResizeObserver(ajustar).observe($('dock')); new ResizeObserver(ajustar).observe($('frase')); ajustar();
  window.__hep = { get s() { return s; }, leer: () => leer(s), topes: () => topes(s, leer(s)), set: ver, ponerPreset, modoPrueba, pintar, tope: () => topeApi.activos() };
  dec('base'); ponerPreset('normal');
}
pagina();
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
