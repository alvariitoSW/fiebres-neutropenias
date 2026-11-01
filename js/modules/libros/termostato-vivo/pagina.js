// Termostato vivo · el cuerpo que arde y tirita (Marino caps. 43-44). La página: estado de la sesión, monitor, dock de mandos, dibujo, pruebas.
// Se carga al primer abrir (index.js). Los botones del dock se crean UNA vez y se repintan en su sitio. Sin mando continuo de temperatura
// salvo en «Juega»: en los demás estados la fija el paso. Reutiliza core/tope.js, core/frase-vista.js, core/particulas.js y core/motion.js.
import { crearTope } from '../../../core/tope.js';
import { seguirFrase } from '../../../core/frase-vista.js';
import { leyendaParticulas } from '../../../core/particulas.js';
import { cargarMotion, sinMovimiento } from '../../../core/motion.js';
import { PDF, IMG, LIBRO_AZUL, TAB_FICHA, IDEA, ESTADOS, YSI, FUENTES, NOTAS, PROFUNDIZAR, APUESTA, APUESTA2, ERROR, CASO, CASO_OVIDIO, CRECERA } from '../../../data/termostato-vivo-data.js';
import { nuevo, leer, topes, fmt, clamp } from './modelo.js';
import { nuevoLibre, pasar, enfriar, recalentar, antipiretico, fraseLibre } from './libre.js';
import { escena } from './dibujo.js';
import { montarMayeutica } from './mayeutica.js';
const $ = (id) => document.getElementById('tmv-' + id);
const R = $('raiz');
const todos = (q) => R.querySelectorAll(q);
let may = null, s = nuevo(), modo = 'explorar', activos = new Set(), topeApi, prev = { pt: 37 }, oculto = false, ronda = 0, casoN = 0, apN = 0, casoAct = CASO;
const capas = { piel: true, mus: true, cer: true }, CAPA = { cer: 'cer', piel: 'piel', mus: 'mus', ret: 'mus' };
// Cada cita: «PDF p. N» (abre el libro) y «p. N · Ver en la ficha» (el enlace cruzado de siempre, al párrafo exacto de la ficha)
const cita = (c) => { const [p, id] = String(c).split('|');
  if (p === 'azul') return `<span class="cita"><a class="cita-pdf cita-azul" href="${LIBRO_AZUL}" target="_blank" rel="noopener">Libro Azul, sección III, p. 30</a></span>`;
  return `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${p}" target="_blank" rel="noopener">PDF p. ${p}</a> · <button type="button" class="ver-ficha" data-especialidad="libros" data-view="marinoAbdomen" data-panel="panel-marino-abd-tabs" data-tab="${TAB_FICHA[id]}" data-resaltar="#${id}">p. ${p} · Ver en la ficha</button></span>`; };
const org = (t) => `<span class="org${/ilustrativ/.test(t) ? ' ilu' : ''}">${t}</span>`;
function frase(txt, o = 'ficha') { $('frase-txt').innerHTML = `${txt} ${org(o)}`; }
// La aguja del ajuste gira del valor anterior al nuevo (Motion); con «reducir movimiento» queda en el estado final.
const ang = (t) => 180 * (clamp(t, 34, 42) - 34) / 8;
async function llama(antes, ahora) {
  const g = $('llama'); if (!g || antes === ahora || sinMovimiento()) return;
  try { const M = await cargarMotion(), d = ang(antes) - ang(ahora);
    M.animate(0, 1, { duration: 0.7, ease: 'easeOut', onUpdate: (v) => g.setAttribute('transform', `rotate(${d * (1 - v)} 298 84)`) }); } catch { /* sin Motion se queda el estado final */ }
}
function pintar() {
  const l = leer(s), E = ESTADOS[s.est], P = E.pasos[s.paso - 1], mask = oculto;
  $('mon-t').textContent = mask ? '?' : fmt(l.T); $('mon-t').className = !mask && (l.T >= 40 || l.T < 32) ? 'rojo' : '';
  $('mon-fc').textContent = l.fc === 0 ? 'asistolia' : l.fc == null ? 'FV' : l.fc; $('mon-co2').textContent = l.co2 ? l.co2 + ' mmHg' : '—'; $('mon-co2').className = l.co2 >= 60 ? 'rojo' : '';
  $('mon-ck').textContent = l.ck ? l.ck.toLocaleString('es') : '—'; $('mon-ck').className = l.ck > 1000 ? 'rojo' : ''; $('mon-ck-tope').textContent = s.est === 'juega' ? 'ilustrativo · tope 24.000' : 'ilustrativo';
  $('mon-esc').textContent = l.esc ? 'sí' : 'no'; $('mon-sud').textContent = l.sud ? 'sí' : 'no'; $('mon-rig').textContent = l.rig ? 'sí' : 'no';
  $('mon-pie').innerHTML = `${l.nombre}: ${l.pac}${l.pa ? ' · PA ' + l.pa : ''}${l.k ? ' · K⁺ ' + fmt(l.k) : ''}${l.extra ? ' · ' + l.extra : ''} · umbrales: ficha; cifra de cada paso: ilustrativa`;
  const f = CAPA[P.foco]; if (f && !capas[f]) { capas[f] = true; }
  for (const k of ['piel', 'mus', 'cer']) $('l-' + k).setAttribute('aria-pressed', capas[k]);
  $('svg').innerHTML = escena(l, capas, P.foco, false); llama(prev.pt, l.pt); prev = { pt: l.pt };
  // mandos (ya creados)
  const JG = s.est === 'juega'; R.classList.toggle('juega-on', JG);
  for (const id of ['mando-pasos', 'lab-ysi']) $(id).hidden = JG; for (const id of ['mando-juega', 'lab-pir']) $(id).hidden = !JG; $('pc-sig').hidden = JG;
  if (JG) { const j = s.j; $('j-pir').value = j.pir; $('j-calor').value = j.calor; $('j-frio').value = j.frio; $('j-para').textContent = `Paracetamol (${j.paraG} g)`; }
  $('m-est').value = s.est; $('m-ysi').value = s.ysi || ''; $('o-paso').textContent = `Paso ${s.paso} de 5`;
  $('m-ant').disabled = s.paso <= 1; $('m-sig').disabled = s.paso >= 5;
  $('m-trat').setAttribute('aria-pressed', !!s.trat); $('m-trat').textContent = `${s.trat ? 'Dado' : 'Dar'}: ${E.trat[0]}`;
  const caja = $('paso-caja'); caja.hidden = modo !== 'explorar';
  $('pc-t').textContent = `${s.paso}/5 · ${P.t}`; $('pc-x').textContent = P.x; $('pc-c').innerHTML = cita(P.c) + ' ' + org(P.o); $('pc-sig').disabled = s.paso >= 5;
  const lista = topes(s, l), nuevas = new Set(lista.map((t) => t.c));
  for (const c of activos) if (!nuevas.has(c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off || [], });
  activos = nuevas; topeApi.refrescar?.(); { const ss = [...todos('#tmv-sello-zona .tope-sello')]; const cab = ss.find((e) => e.dataset.tope === 'tmax') || ss[0]; ss.forEach((e) => e.classList.toggle('cola', e !== cab)); }
  $('figosb').open = s.est === 'hipo' && s.paso >= 3; $('fig445').open = s.est === 'fiebre' && s.paso === 5;
  window.__tmv.lista = lista;
}
const primera = (x) => { const u = (x.match(/^.*?[.!?](?=\s|$)/) || [x])[0]; return u.length > 105 && u.includes('; ') ? u.split('; ')[0] + '.' : u; };   // frase corta en el dock (≤30 %)
const fraseDe = () => { if (s.est === 'juega') { const [x, p, o] = fraseLibre(s.j, leer(s)); return frase(`${x} · p. ${p}`, o); } const P = ESTADOS[s.est].pasos[s.paso - 1]; frase(`<b>${P.t}.</b> ${primera(P.x)} · p. ${P.c.split('|')[0]}`, P.o); };
// Tras cambiar de paso, la página sube lo justo para que la capa señalada (fibra, retículo, cerebro) quede sobre el dock.
function verFoco() { requestAnimationFrame(() => requestAnimationFrame(() => { const e = $('svg').querySelector('.foco'), d = $('dock'); if (!e || !d.offsetHeight) return;
  const r = e.getBoundingClientRect(), bajo = innerHeight - d.offsetHeight - 8, dy = r.bottom > bajo ? Math.min(r.bottom - bajo, r.top - 8) : r.top < 8 ? r.top - 8 : 0;
  if (Math.abs(dy) > 1) scrollBy({ top: dy, behavior: 'instant' }); })); }
function ir(p0) { const { quieto, ...p } = p0; Object.assign(s, p); if (s.est === 'juega' && (p.est === 'juega' || !s.j)) s.j = p.j || nuevoLibre(); if (s.est === 'juega') s.paso = 1; s.paso = clamp(s.paso, 1, 5); fraseDe(); pintar(); if (!quieto && (p.paso != null || p.est || p.ysi)) verFoco(); }
function mandos() {
  $('m-est').innerHTML = Object.entries(ESTADOS).map(([k, e]) => `<option value="${k}">${e.nombre}</option>`).join('');
  $('m-ysi').innerHTML = '<option value="">De la ficha</option>' + Object.entries(YSI).map(([k, y]) => `<option value="${k}">${y.n}</option>`).join('');
  $('presets').innerHTML = Object.entries(ESTADOS).map(([k, e]) => `<button type="button" class="b" data-preset="${k}" aria-pressed="false">${e.pac.split(' · ')[0]}<br>${e.nombre}</button>`).join('');
  $('m-est').addEventListener('change', (e) => ir({ est: e.target.value, paso: 1, trat: 0, ysi: null }));
  $('m-ysi').addEventListener('change', (e) => { const k = e.target.value; if (!k) return ir({ ysi: null }); ir({ est: k, ysi: k, trat: 0, paso: k === 'fiebre' ? 4 : k === 'golpe' ? 4 : k === 'hipo' ? 3 : 4 }); frase(YSI[k].x, YSI[k].o); });
  const jg = (f) => { f(s.j); ir({}); };
  $('j-pir').addEventListener('change', (e) => jg((j) => { j.pir = +e.target.value; j.anti = 0; j.dial = null; j.flags = {}; }));
  $('j-calor').addEventListener('change', (e) => jg((j) => { j.calor = +e.target.value; j.flags = {}; })); $('j-frio').addEventListener('change', (e) => jg((j) => { j.frio = +e.target.value; j.flags = {}; }));
  $('j-para').addEventListener('click', () => jg((j) => antipiretico(j, 'para'))); $('j-ibu').addEventListener('click', () => jg((j) => antipiretico(j, 'ibu'))); $('j-hora').addEventListener('click', () => jg(pasar));
  $('j-enf').addEventListener('change', (e) => { const k = e.target.value; e.target.value = ''; if (k) jg((j) => enfriar(j, k)); }); $('j-rec').addEventListener('change', (e) => { const k = e.target.value; e.target.value = ''; if (k) jg((j) => recalentar(j, k)); });
  $('m-ant').addEventListener('click', () => ir({ paso: s.paso - 1 })); $('m-sig').addEventListener('click', () => ir({ paso: s.paso + 1 })); $('pc-sig').addEventListener('click', () => ir({ paso: s.paso + 1 }));
  $('m-trat').addEventListener('click', () => { ir({ trat: s.trat ^ 1, ysi: null }); frase(`${ESTADOS[s.est].trat[0]}. · p. ${ESTADOS[s.est].trat[1].split('|')[0]}`, 'ficha'); });
  for (const k of ['piel', 'mus', 'cer']) $('l-' + k).addEventListener('click', () => { capas[k] = !capas[k]; pintar(); });
  for (const b of todos('[data-preset]')) b.addEventListener('click', () => { for (const x of todos('[data-preset]')) x.setAttribute('aria-pressed', x === b); modoPrueba('explorar'); ir({ est: b.dataset.preset, paso: 1, trat: 0, ysi: null }); });
  for (const b of todos('[data-pest]')) b.addEventListener('click', () => { for (const x of todos('[data-pest]')) x.setAttribute('aria-selected', x === b); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest === 'dar'; });
}
// ---- pruebas ----
function modoPrueba(m) {
  modo = m; oculto = false; for (const b of todos('[data-modo]')) b.setAttribute('aria-pressed', b.dataset.modo === m);
  const c = $('prueba'); c.hidden = m === 'explorar' || m === 'preguntas'; c.innerHTML = ''; delete c.dataset.fin;
  may?.enPreguntas(m === 'preguntas');
  if (m === 'preguntas') { s = { est: 'fiebre', paso: 1, trat: 0, ysi: null }; fraseDe(); pintar(); may.entrar(); return; }
  if (m === 'explorar') { fraseDe(); return pintar(); }
  if (m === 'apuesta') { s = { est: 'hm', paso: 1, trat: 0, ysi: null }; oculto = true; apuesta(); }
  if (m === 'error') { s = { est: 'snm', paso: 4, trat: 0, ysi: null }; error(); }
  if (m === 'caso') { casoAct = casoN++ % 2 ? CASO_OVIDIO : CASO; caso(0); return; }
  pintar();
}
const llevas = (L) => `<div class="llevas"><b>Lo que te llevas</b><ul>${L.map(([t, p]) => `<li>${t} ${cita(p)}</li>`).join('')}</ul></div>`;
function apuesta() {
  const c = $('prueba'), A = apN++ % 2 ? APUESTA2 : APUESTA, dos = A === APUESTA2;
  if (dos) s = { est: 'juega', paso: 1, trat: 0, ysi: null, j: nuevoLibre({ real: 39.4, pir: 2 }) };
  c.innerHTML = `<h3>Apuesta</h3><p class="enun">${A.enun}</p>` + A.ops.map((o, i) => `<button type="button" class="b op" data-i="${i}">${o[0]}</button>`).join('');
  c.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
    if (c.dataset.fin) return; const i = +b.dataset.i; c.dataset.fin = '1'; oculto = false;
    c.querySelectorAll('.op').forEach((x, j) => x.classList.add(j === A.ok ? 'bien' : x === b ? 'mal' : 'neutra'));
    c.insertAdjacentHTML('beforeend', `<p class="por ${i === A.ok ? 'ok' : 'no'}">${i === A.ok ? 'Bien apostado. ' : 'No era esa. '}${A.ops[i][1]}</p><p class="por">${A.por} ${cita(A.c)}</p>` + llevas(A.ll));
    if (dos) { antipiretico(s.j, 'para'); pasar(s.j); ir({}); frase('Con paracetamol la T baja; la Fig. 44.5 solo muestra una asociación (no una causa) entre T inicial baja y más mortalidad. · p. 71', 'ficha · p. 70-71'); return; }
    ir({ paso: 3 }); frase('El CO₂ espirado de Marcial sube a 68 mmHg con T 37,2 °C: el primer signo es el CO₂, la fiebre llega después. · p. 49', 'ficha · p. 49; cifras ilustrativas');
  }));
}
function error() {
  const c = $('prueba'), E = ERROR, R = E.rondas[ronda++ % E.rondas.length], marca = [];
  if (R.est) s = { ...s, ...R.est };
  c.innerHTML = `<h3>Encuentra el error</h3><p class="enun">${R.enun || E.enun}</p>` + R.map((f, i) => `<div class="ops" data-i="${i}"><p class="enun">${f.f}</p><div class="fila-g"><button type="button" class="b op" data-v="0">Bien</button><button type="button" class="b op" data-v="1">Error</button></div></div>`).join('');
  c.querySelectorAll('.ops').forEach((g) => g.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
    if (c.dataset.fin) return; marca[+g.dataset.i] = +b.dataset.v; g.querySelectorAll('.op').forEach((x) => x.setAttribute('aria-pressed', x === b));
    if (R.every((_, i) => marca[i] !== undefined)) {
      c.dataset.fin = '1';
      c.querySelectorAll('.ops').forEach((gg, i) => { const f = R[i], bien = (marca[i] === 1) === !!f.mal; gg.insertAdjacentHTML('beforeend', `<p class="por ${bien ? 'ok' : 'no'}">${bien ? 'Acertaste. ' : 'Fallaste. '}${f.por} ${cita(f.c)}</p>`); });
      const n = R.filter((f) => f.mal).length; c.insertAdjacentHTML('beforeend', `<p class="por">${n === 0 ? 'Esta vez no había ningún error.' : `Había ${n} error${n > 1 ? 'es' : ''}.`}</p>` + llevas(R.ll || E.ll)); ir({ paso: 5, trat: 1 });
    }
  })));
}
function caso(i) {
  const CS = casoAct, c = $('prueba'), P = CS.pasos[i], ult = i === CS.pasos.length - 1; s = P.s ? P.s() : { est: 'hm', paso: P.paso, trat: i >= 2 ? 1 : 0, ysi: null }; delete c.dataset.fin; delete c.dataset.paso;
  c.innerHTML = `<h3>${CS.paciente} · paso ${i + 1} de ${CS.pasos.length}</h3><div class="paso"><p class="ctx">${P.ctx}${P.rot ? ` ${org(P.rot)}` : ''}</p><p class="enun"><b>${P.q}</b></p>` + P.ops.map((o, j) => `<button type="button" class="b op" data-i="${j}">${o[0]}</button>`).join('') + '</div>';
  c.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
    if (c.querySelector('.por')) return; const j = +b.dataset.i;
    c.querySelectorAll('.op').forEach((x, k) => x.classList.add(k === P.ok ? 'bien' : x === b ? 'mal' : 'neutra'));
    c.querySelector('.paso').insertAdjacentHTML('beforeend', `<p class="por ${j === P.ok ? 'ok' : 'no'}">${j === P.ok ? 'Bien. ' : 'No era esa. '}${P.ops[j][1]} ${j === P.ok ? '' : 'Lo correcto: ' + P.ops[P.ok][0] + '.'} ${cita(P.c)}</p>`);
    if (!P.s) s.trat = i >= 1 && j === P.ok ? 1 : s.trat;
    const yk = j !== P.ok && P.ops[j][2]; if (yk) Object.assign(s, { est: yk, ysi: yk, trat: 0, paso: yk === 'hm' ? 4 : 4 });
    fraseDe(); pintar(); if (yk) frase(YSI[yk].x, YSI[yk].o); verFoco();
    if (ult) { c.dataset.fin = '1'; c.insertAdjacentHTML('beforeend', llevas(CS.ll)); }
    else { const nx = document.createElement('button'); nx.type = 'button'; nx.className = 'b prim'; nx.textContent = 'Siguiente paso'; nx.addEventListener('click', () => caso(i + 1)); c.append(nx); }
  }));
  fraseDe(); pintar();
}
function pagina() {
  topeApi = crearTope({ monitor: $('sello-zona'), dock: $('avisos-zona'), cita });   // los avisos van bajo el dibujo, no en el dock (que no pasa del 30 %)
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} ${org('ficha')}`;
  $('leyenda').innerHTML = leyendaParticulas(['agua', { clave: 'ca', nombre: 'Ca²⁺' }]) + '<p class="para">Punto rojo: calor. Vasos largos y rojos: piel abierta; cortos y grises: piel cerrada. Dial del hipotálamo: aguja dorada = punto de ajuste; marca roja y termómetro = temperatura real. Escala 34-42 °C: el tope 42 °C es el de la citotoxicidad (Libro Azul, sección III, p. 30).</p>';
  $('paso-caja').innerHTML = '<h3 id="tmv-pc-t"></h3><p id="tmv-pc-x"></p><p id="tmv-pc-c"></p><div class="fila-g"><button type="button" class="b prim" id="tmv-pc-sig">Siguiente paso</button></div>';
  $('fuentes').innerHTML = FUENTES.map(([t, o]) => `<li>${t} ${org(o)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([k, t]) => `<p class="para"><b>${k}.</b> ${t}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map(([t, o]) => `<li>${t} ${org(o)}</li>`).join('');
  $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  $('imgosb').src = IMG.osborn; $('img445').src = IMG.f445;
  mandos();
  for (const b of todos('[data-modo]')) b.addEventListener('click', () => modoPrueba(b.dataset.modo));
  const ajustar = () => R.style.setProperty('--tmv-dock-h', $('dock').offsetHeight + 'px');
  new ResizeObserver(ajustar).observe($('dock')); ajustar();
  window.__tmv = { get caso() { return casoAct; }, rondaDatos: (r) => ERROR.rondas[r % ERROR.rondas.length].map((f) => f.mal), get s() { return s; }, leer: () => leer(s), topes: () => topes(s, leer(s)), ir, modoPrueba, pintar, ESTADOS };
  may = montarMayeutica({ R, $, cita, org, ir, leer, modoPrueba }); may.cargar();
  ir({});
}
pagina();
seguirFrase(R, () => $('escena'), { dock: () => $('dock') });

// Abre un estado: «fiebre», «golpe:4» (estado y paso) o «juega». Se reinicia el modo a Explorar.
export function abrirEstado(clave) {
  const [e, p] = String(clave || '').split(':'), est = ESTADOS[e] ? e : 'fiebre';
  modoPrueba('explorar'); for (const x of todos('[data-preset]')) x.setAttribute('aria-pressed', x.dataset.preset === est);
  ir({ est, paso: clamp(+p || 1, 1, 5), trat: 0, ysi: null });
}
