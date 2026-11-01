// Termostato · opción B «El cuerpo que arde y tirita». Reutiliza (importados, no copiados): core/tope.js (topes con sello), core/frase-vista.js
// (la frase viva siempre a la vista), core/particulas.js (agua y Ca²⁺ con la forma de la app), core/motion.js (cargarMotion: la llama del hipotálamo).
// Los botones del dock se crean UNA vez y se repintan. Sin mando continuo de temperatura: la fija el paso.
import { crearTope } from '../../../js/core/tope.js';
import { seguirFrase } from '../../../js/core/frase-vista.js';
import { leyendaParticulas } from '../../../js/core/particulas.js';
import { cargarMotion, sinMovimiento } from '../../../js/core/motion.js';
import { PDF, IMG, IDEA, ESTADOS, YSI, FUENTES, NOTAS, PROFUNDIZAR, APUESTA, APUESTA2, ERROR, CASO, CASO_OVIDIO, CRECERA } from './datos.js';
import { nuevo, leer, topes, fmt, clamp } from './modelo.js';
import { nuevoLibre, pasar, enfriar, recalentar, antipiretico, fraseLibre } from './termostato-libre.js';
import { escena } from './dibujo.js';
const $ = (id) => document.getElementById(id);
let s = nuevo(), modo = 'explorar', activos = new Set(), topeApi, prev = { pt: 37 }, oculto = false, ronda = 0, casoN = 0, apN = 0, casoAct = CASO;
const capas = { piel: true, mus: true, cer: true }, CAPA = { cer: 'cer', piel: 'piel', mus: 'mus', ret: 'mus' };
const FICHAOK = (id) => id;
const cita = (c) => { const [p, id] = String(c).split('|'); return `<span class="cita"><a class="cita-pdf" href="${PDF}#page=${p}" target="_blank" rel="noopener">PDF p. ${p}</a> · <button type="button" class="ver-ficha" data-resaltar="#${FICHAOK(id)}" data-pag-ficha="${p}">p. ${p} · Ver en la ficha</button></span>`; };
const org = (t) => `<span class="org${/ilustrativ/.test(t) ? ' ilu' : ''}">${t}</span>`;
function frase(txt, o = 'ficha') { $('frase-txt').innerHTML = `${txt} ${org(o)}`; }
// cargarMotion() pide `js/vendor/motion.js` relativo a la página; desde esta carpeta hay que dejar Motion cargado con la ruta buena (en la app no hace falta).
const motionAqui = () => (window.Motion ? Promise.resolve() : new Promise((ok, mal) => { const e = document.createElement('script'); e.src = '../../js/vendor/motion.js?v=11.18.2'; e.onload = ok; e.onerror = mal; document.head.append(e); }));
// La aguja del ajuste gira del valor anterior al nuevo (Motion); con «reducir movimiento» queda en el estado final.
const ang = (t) => 180 * (clamp(t, 34, 42) - 34) / 8;
async function llama(antes, ahora) {
  const g = $('llama'); if (!g || antes === ahora || sinMovimiento()) return;
  try { await motionAqui(); const M = await cargarMotion(), d = ang(antes) - ang(ahora);
    M.animate(0, 1, { duration: 0.7, ease: 'easeOut', onUpdate: (v) => g.setAttribute('transform', `rotate(${d * (1 - v)} 298 84)`) }); } catch { /* sin Motion se queda el estado final */ }
}
function pintar() {
  const l = leer(s), E = ESTADOS[s.est], P = E.pasos[s.paso - 1], mask = oculto;
  $('mon-t').textContent = mask ? '?' : fmt(l.T); $('mon-t').className = !mask && (l.T >= 40 || l.T < 32) ? 'rojo' : '';
  $('mon-fc').textContent = l.fc === 0 ? 'asistolia' : l.fc; $('mon-co2').textContent = l.co2 ? l.co2 + ' mmHg' : '—'; $('mon-co2').className = l.co2 >= 60 ? 'rojo' : '';
  $('mon-ck').textContent = l.ck ? l.ck.toLocaleString('es') : '—'; $('mon-ck').className = l.ck > 1000 ? 'rojo' : '';
  $('mon-esc').textContent = l.esc ? 'sí' : 'no'; $('mon-sud').textContent = l.sud ? 'sí' : 'no'; $('mon-rig').textContent = l.rig ? 'sí' : 'no';
  $('mon-pie').innerHTML = `${l.nombre}: ${l.pac}${l.pa ? ' · PA ' + l.pa : ''}${l.k ? ' · K⁺ ' + fmt(l.k) : ''}${l.extra ? ' · ' + l.extra : ''} · umbrales: ficha; cifra de cada paso: ilustrativa`;
  const f = CAPA[P.foco]; if (f && !capas[f]) { capas[f] = true; }
  for (const k of ['piel', 'mus', 'cer']) $('l-' + k).setAttribute('aria-pressed', capas[k]);
  $('ter-svg').innerHTML = escena(l, capas, P.foco, false); llama(prev.pt, l.pt); prev = { pt: l.pt };
  // mandos (ya creados)
  const JG = s.est === 'juega'; document.body.classList.toggle('juega-on', JG);
  for (const id of ['mando-pasos', 'lab-ysi']) $(id).hidden = JG; for (const id of ['mando-juega', 'lab-pir']) $(id).hidden = !JG; $('pc-sig').hidden = JG;
  if (JG) { const j = s.j; $('j-pir').value = j.pir; $('j-calor').value = j.calor; $('j-frio').value = j.frio; $('j-para').textContent = `Paracetamol (${j.paraG} g)`; }
  $('m-est').value = s.est; $('m-ysi').value = s.ysi || ''; $('o-paso').textContent = `Paso ${s.paso} de 5`;
  $('m-ant').disabled = s.paso <= 1; $('m-sig').disabled = s.paso >= 5;
  $('m-trat').setAttribute('aria-pressed', !!s.trat); $('m-trat').textContent = `${s.trat ? 'Dado' : 'Dar'}: ${E.trat[0]}`;
  const caja = $('paso-caja'); caja.hidden = modo !== 'explorar';
  $('pc-t').textContent = `${s.paso}/5 · ${P.t}`; $('pc-x').textContent = P.x; $('pc-c').innerHTML = cita(P.c) + ' ' + org(P.o); $('pc-sig').disabled = s.paso >= 5;
  const lista = topes(s, l), nuevas = new Set(lista.map((t) => t.c));
  for (const c of activos) if (!nuevas.has(c)) topeApi.quitar(c);
  for (const t of lista) topeApi.poner(t.c, { nivel: t.n, titulo: t.titulo, texto: t.texto, cita: t.pag, origen: t.origen, deshabilita: t.off || [], bajo: t.bajo });
  activos = nuevas; topeApi.refrescar?.();
  $('figosb').open = s.est === 'hipo' && s.paso >= 3; $('fig445').open = s.est === 'fiebre' && s.paso === 5;
  window.__ter.lista = lista;
}
const fraseDe = () => { if (s.est === 'juega') { const [x, p, o] = fraseLibre(s.j, leer(s)); return frase(`${x} · p. ${p}`, o); } const P = ESTADOS[s.est].pasos[s.paso - 1]; frase(`${P.t}. ${P.x} · p. ${P.c.split('|')[0]}`, P.o); };
function ir(p) { Object.assign(s, p); if (s.est === 'juega' && (p.est === 'juega' || !s.j)) s.j = p.j || nuevoLibre(); if (s.est === 'juega') s.paso = 1; s.paso = clamp(s.paso, 1, 5); fraseDe(); pintar(); }
function mandos() {
  $('m-est').innerHTML = Object.entries(ESTADOS).map(([k, e]) => `<option value="${k}">${e.nombre}</option>`).join('');
  $('m-ysi').innerHTML = '<option value="">Tratamiento de la ficha</option>' + Object.entries(YSI).map(([k, y]) => `<option value="${k}">${y.n}</option>`).join('');
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
  for (const b of document.querySelectorAll('[data-preset]')) b.addEventListener('click', () => { for (const x of document.querySelectorAll('[data-preset]')) x.setAttribute('aria-pressed', x === b); modoPrueba('explorar'); ir({ est: b.dataset.preset, paso: 1, trat: 0, ysi: null }); });
  for (const b of document.querySelectorAll('[data-pest]')) b.addEventListener('click', () => { for (const x of document.querySelectorAll('[data-pest]')) x.setAttribute('aria-selected', x === b); $('dock-panel').hidden = b.dataset.pest !== 'dar'; $('dock-medir').hidden = b.dataset.pest === 'dar'; });
}
// ---- pruebas ----
function modoPrueba(m) {
  modo = m; oculto = false; for (const b of document.querySelectorAll('[data-modo]')) b.setAttribute('aria-pressed', b.dataset.modo === m);
  const c = $('prueba'); c.hidden = m === 'explorar'; c.innerHTML = ''; delete c.dataset.fin;
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
    if (dos) { antipiretico(s.j, 'para'); pasar(s.j); ir({}); frase('Con paracetamol la T baja, pero la mortalidad no: en la sepsis grave la temperatura inicial se relacionaba al revés con ella. · p. 71', 'ficha · p. 70-71'); return; }
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
  c.innerHTML = `<h3>${CS.paciente} · paso ${i + 1} de ${CS.pasos.length}</h3><div class="paso"><p class="ctx">${P.ctx}</p><p class="enun"><b>${P.q}</b></p>` + P.ops.map((o, j) => `<button type="button" class="b op" data-i="${j}">${o[0]}</button>`).join('') + '</div>';
  c.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
    if (c.querySelector('.por')) return; const j = +b.dataset.i;
    c.querySelectorAll('.op').forEach((x, k) => x.classList.add(k === P.ok ? 'bien' : x === b ? 'mal' : 'neutra'));
    c.querySelector('.paso').insertAdjacentHTML('beforeend', `<p class="por ${j === P.ok ? 'ok' : 'no'}">${j === P.ok ? 'Bien. ' : 'No era esa. '}${P.ops[j][1]} ${j === P.ok ? '' : 'Lo correcto: ' + P.ops[P.ok][0] + '.'} ${cita(P.c)}${P.enl ? ` <button type="button" class="b enlace" data-especialidad="nefrologia" data-view="nefrona" data-nefrona-viva="${P.enl}">Rabdomiólisis en la nefrona viva</button>` : ''}</p>`);
    if (!P.s) s.trat = i >= 1 && j === P.ok ? 1 : s.trat; fraseDe(); pintar();
    if (ult) { c.dataset.fin = '1'; c.insertAdjacentHTML('beforeend', llevas(CS.ll)); }
    else { const nx = document.createElement('button'); nx.type = 'button'; nx.className = 'b prim'; nx.textContent = 'Siguiente paso'; nx.addEventListener('click', () => caso(i + 1)); c.append(nx); }
  }));
  fraseDe(); pintar();
}
function pagina() {
  const dock = $('dock');
  topeApi = crearTope({ monitor: $('sello-zona'), dock, cita });
  $('idea').innerHTML = `${IDEA[0]} ${cita(IDEA[1])} ${org('ficha')}`;
  $('leyenda').innerHTML = leyendaParticulas(['agua', { clave: 'ca', nombre: 'Ca²⁺' }]) + '<p class="para">Punto rojo: calor. Vasos largos y rojos: piel abierta; cortos y grises: piel cerrada. Dial del hipotálamo: aguja dorada = punto de ajuste; marca roja y termómetro = temperatura real. Escala 34-42 °C: el tope 42 °C es del dibujo (ilustrativo).</p>';
  $('paso-caja').innerHTML = '<h3 id="pc-t"></h3><p id="pc-x"></p><p id="pc-c"></p><div class="fila-g"><button type="button" class="b prim" id="pc-sig">Siguiente paso</button></div>';
  $('fuentes').innerHTML = FUENTES.map(([t, o]) => `<li>${t} ${org(o)}</li>`).join('');
  $('notas').innerHTML = NOTAS.map(([k, t]) => `<p class="para"><b>${k}.</b> ${t}</p>`).join('');
  $('crecera').innerHTML = CRECERA.map(([t, o]) => `<li>${t} ${org(o.includes('ilustrativ') ? o : 'ficha · ' + o)}</li>`).join('');
  $('profundizar').innerHTML = PROFUNDIZAR.map((t) => `<li>${t}</li>`).join('');
  $('imgosb').src = IMG.osborn; $('img445').src = IMG.f445;
  mandos();
  for (const b of document.querySelectorAll('[data-modo]')) b.addEventListener('click', () => modoPrueba(b.dataset.modo));
  document.body.addEventListener('click', (e) => { const v = e.target.closest('.ver-ficha'); if (v) { $('toast').textContent = `En la app: lleva al párrafo de la ficha (p. ${v.dataset.pagFicha}).`; $('toast').hidden = false; setTimeout(() => ($('toast').hidden = true), 2200); } });
  const ajustar = () => { document.documentElement.style.setProperty('--dock-h', $('dock').offsetHeight + 'px'); document.documentElement.style.setProperty('--frase-h', $('frase').offsetHeight + 'px'); };
  new ResizeObserver(ajustar).observe($('dock')); new ResizeObserver(ajustar).observe($('frase')); ajustar();
  window.__ter = { get caso() { return casoAct; }, rondaDatos: (r) => ERROR.rondas[r % ERROR.rondas.length].map((f) => f.mal), get s() { return s; }, leer: () => leer(s), topes: () => topes(s, leer(s)), ir, modoPrueba, pintar, ESTADOS };
  ir({});
}
pagina();
seguirFrase(document.body, () => $('frase'), { dock: () => $('dock') });
